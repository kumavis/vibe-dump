// F5a View phase: screenshots of the new races (scratch, not in the tree)
//   node shots.mjs <part> [style]   part: picker | close | action | vs
import { chromium } from '/home/user/vibe-dump-wt/f5a/node_modules/playwright/index.mjs'
import { startStaticServer } from '/home/user/vibe-dump-wt/f5a/scripts/static-server.mjs'
import { join } from 'node:path'
import { mkdirSync } from 'node:fs'

const DIST = '/home/user/vibe-dump-wt/f5a/packages/tails-and-scales/dist'
const OUT = '/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/sweep/shots'
mkdirSync(OUT, { recursive: true })
const [part = 'close', style = 'new', races = 'insect,bird', seedArg = '4242'] = process.argv.slice(2)
const Q = `${style === 'classic' ? '&models=classic' : ''}`
const TAG = style === 'classic' ? 'classic' : 'new'
const server = await startStaticServer(DIST)
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const frames = (page, n = 4) => page.evaluate((n) => new Promise((res) => {
  let k = 0
  const f = () => (++k >= n ? res() : requestAnimationFrame(f))
  requestAnimationFrame(f)
}), n)
// the camera put and held there (a glide under way writes it each frame)
const pose = async (page, pos, target) => {
  for (let k = 0; k < 20; k++) {
    const held = await page.evaluate(([pos, target]) => new Promise((r) => {
      const { camera, controls } = window.__ts
      camera.position.set(...pos)
      controls.target.set(...target)
      controls.update()
      const p0 = camera.position.clone(), t0 = controls.target.clone()
      let n = 4
      const f = () => (--n ? requestAnimationFrame(f) : r(camera.position.distanceTo(p0) < 1e-3 && controls.target.distanceTo(t0) < 1e-3))
      requestAnimationFrame(f)
    }), [pos, target])
    if (held) return
    await new Promise((r) => setTimeout(r, 300))
  }
}
const shot = async (page, name) => {
  const p = join(OUT, `f5a-${name}.png`)
  await page.screenshot({ path: p, timeout: 300000 })
  console.log('  shot', p)
}
async function open(vp, q) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, hasTouch: !!vp.touch, isMobile: !!vp.touch })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => console.log('pageerror:', e.stack ?? e.message))
  page.on('console', (m) => m.type() === 'error' && console.log('console:', m.text()))
  await page.goto(`${server.url}/?debug&seed=${seedArg}&dice=7${Q}${q}`, { timeout: 600000 })
  await page.waitForFunction(() => window.__ts, null, { timeout: 600000 })
  return { ctx, page }
}
try {
  if (part === 'picker') {
    for (const [vp, nm] of [[{ width: 1280, height: 800 }, 'desktop'], [{ width: 360, height: 780, touch: true }, 'phone']]) {
      const { ctx, page } = await open(vp, `&races=${races}`)
      await page.evaluate(() => document.querySelector('[data-mode="watch"]').click())
      await page.waitForFunction(() => !document.querySelector('#setup').classList.contains('hidden'))
      await page.waitForTimeout(2500)
      await shot(page, `picker-${nm}-${TAG}`)
      const geo = await page.evaluate(() => [...document.querySelectorAll('.setupSeat .raceRow')].map((r) => [...r.querySelectorAll('button')].filter((b) => b.getClientRects().length).map((b) => { const q = b.getBoundingClientRect(); return `${b.dataset.race} ${Math.round(q.left)},${Math.round(q.top)} ${Math.round(q.width)}x${Math.round(q.height)}` }).join(' | ')))
      console.log(nm, 'race buttons:', JSON.stringify(geo), 'scrollWidth', await page.evaluate(() => [document.scrollingElement.scrollWidth, document.documentElement.clientWidth]))
      if (nm === 'phone') {
        await page.evaluate(() => document.querySelector('.setupSeat[data-seat="1"]')?.scrollIntoView())
        await page.waitForTimeout(1500)
        await shot(page, `picker-${nm}-seat1-${TAG}`)
      }
      await ctx.close()
    }
  }
  if (part === 'close' || part === 'action' || part === 'vs') {
    const { ctx, page } = await open({ width: 1280, height: 800 }, `&races=${races}`)
    const still = part === 'close' || part === 'vs'
    await page.evaluate((m) => document.querySelector(`[data-mode="${m}"]`).click(), still ? 'hotseat' : 'watch')
    await page.waitForFunction(() => !document.querySelector('#setup').classList.contains('hidden'))
    await page.evaluate(() => document.querySelector('#setupStart').click())
    if (still) await page.waitForFunction(() => window.__ts?.session?.G?.pending?.k === 'deploy' && window.__ts.player.idle, null, { timeout: 600000, polling: 500 })
    else await page.waitForFunction(() => window.__ts.S.stage === 'battle', null, { timeout: 600000, polling: 500 })
    await page.evaluate(() => (window.__ts.S.follow = false))
    if (part === 'close' || part === 'vs') {
      // the overview, then each new unit close up
      await page.evaluate(() => window.__ts.view.look('overview'))
      await frames(page, 30)
      await shot(page, `${races.replace(',', '-')}-overview-${TAG}`)
      const units = await page.evaluate(() => window.__ts.G.units.filter((u) => u.alive > 0).map((u) => ({ id: u.id, key: u.key, race: u.race, side: u.side, x: u.pos.x, z: u.pos.z, big: !!u.t.big, fly: u.t.move === 'fly' })))
      const seen = new Set()
      for (const u of units) {
        if (seen.has(u.key) || !['insect', 'bird'].includes(u.race) || (part === 'vs' && seen.size >= 3)) continue
        seen.add(u.key)
        const dir = u.side === 0 ? 1 : -1, d = u.big ? 4.2 : 2.6, y = u.big ? 2.2 : u.fly ? 2.0 : 1.4
        await pose(page, [u.x + dir * d, y, u.z + d * 0.55], [u.x, u.big ? 0.9 : u.fly ? 1.0 : 0.5, u.z])
        await shot(page, `${part === 'vs' ? races.replace(',', '-') + '-' : ''}unit-${u.key}-${TAG}`)
      }
      if (part === 'close') {
        // the cards of a burrower and a diver
        for (const key of ['delver', 'kestrel']) {
          const id = units.find((u) => u.key === key)?.id
          if (id === undefined) continue
          await page.evaluate((id) => window.__ts.present.card(window.__ts.G.units.find((u) => u.id === id)), id)
          await frames(page, 4)
          await shot(page, `card-${key}-${TAG}`)
        }
      }
    }
    if (part === 'action' || part === 'vs') {
      // catch the moments: a burrower sunk mid-tunnel, a Kestrel's dive
      // charge, the Boilback's lob, the Finches' pebbles, the Longbills'
      // quills, Upwelling, the Cry
      const SPEED = 3
      await page.evaluate((SPEED) => {
        const ts = window.__ts, W = (window.__want = { caught: null, done: new Set(), pend: [] })
        const obs = ts.player.observer
        const unit = (id) => ts.G.units.find((u) => u.id === id)
        const at = (id, M) => M.units[id]?.pos
        ts.present.listen({
          ...obs,
          event: (ev, M) => {
            try {
              const u = ev.u !== undefined ? unit(ev.u) : null
              const now = ts.clock.time
              if (ev.t === 'volley' && ['quill', 'pebble', 'sting'].includes(ev.fx) && !W.done.has(ev.fx)) {
                const a = at(ev.u, M), b = at(ev.tg, M), dist = Math.hypot(b.x - a.x, b.z - a.z), sp = { quill: 26, pebble: 18, sting: 36 }[ev.fx]
                W.pend.push({ name: ev.fx, t: now + Math.min(0.5, (dist / sp) * 0.5) + 0.05, mid: [(a.x + b.x) / 2, (a.z + b.z) / 2], a, b })
              }
              if (ev.t === 'blast.fire' && ev.fx === 'glob' && !W.done.has('glob')) {
                const a = at(ev.u, M), b = ev.to, dist = Math.hypot(b.x - a.x, b.z - a.z)
                W.pend.push({ name: 'glob', t: now + 0.15 + (dist / 15) * 0.5, mid: [(a.x + b.x) / 2, (a.z + b.z) / 2], a, b, high: true })
              }
              if (ev.t === 'spell.thorns' && ev.fx === 'mandibles' && !W.done.has('upwelling')) W.pend.push({ name: 'upwelling', t: now + 0.4, mid: [ev.x, ev.z], a: at(ev.u, M), b: { x: ev.x, z: ev.z } })
              if (ev.t === 'spell.gaze' && u?.key === 'skyseer' && !W.done.has('cry')) {
                const a = at(ev.u, M), b = at(ev.tg, M)
                W.pend.push({ name: 'cry', t: now + 0.25, mid: [(a.x + b.x) / 2, (a.z + b.z) / 2], a, b })
              }
              if (ev.t === 'charge.result' && ev.ok && u?.key === 'kestrel' && !W.done.has('dive')) W.dive = ev.u
              if (ev.t === 'unit.move' && u?.t.move === 'burrow' && !W.done.has('tunnel') && (ev.L ?? 0) > 2.5) W.tunnel = { key: u.key, t: now + (ev.L / ev.speed) * 0.5 }
              if (ev.t === 'spell.snare' && !W.done.has('snare-' + u?.key)) W.pend.push({ name: 'snare-' + u.key, t: now + 0.4, mid: [at(ev.tg, M).x, at(ev.tg, M).z], a: at(ev.u, M), b: at(ev.tg, M) })
              if (ev.t === 'spell.ward' && !W.done.has('ward-' + ev.fx)) W.pend.push({ name: 'ward-' + ev.fx, t: now + 0.45, mid: [at(ev.tg, M).x, at(ev.tg, M).z], a: at(ev.u, M), b: at(ev.tg, M) })
            } catch (e) {
              console.error('want: ' + e.message)
            }
            return obs?.event?.(ev, M)
          },
        })
        const put = (pos, target) => {
          ts.camera.position.set(...pos)
          ts.controls.target.set(...target)
          ts.controls.update()
          W.pose = [pos, target]
        }
        const look = (mid, a, b, high) => {
          const dx = b.x - a.x, dz = b.z - a.z, L = Math.hypot(dx, dz) || 1, nx = -dz / L, nz = dx / L, back = Math.max(5, L * 0.8)
          put([mid[0] + nx * back, high ? 6 : 3.2, mid[1] + nz * back], [mid[0], high ? 2 : 0.8, mid[1]])
        }
        const loop = () => {
          requestAnimationFrame(loop)
          if (W.caught) return
          const now = ts.clock.time
          for (const p of W.pend) {
            if (now >= p.t && !W.done.has(p.name)) {
              W.done.add(p.name)
              ts.clock.speed = 0
              look(p.mid, p.a, p.b, p.high)
              W.caught = p.name
              W.pend = W.pend.filter((q) => q !== p)
              return
            }
          }
          W.pend = W.pend.filter((q) => !W.done.has(q.name))
          // a burrower sunk, or a Kestrel high in its charge: found by the
          // figures' template key and height
          let found = null
          ts.scenery.scene.traverse((o) => {
            const k = o.userData?.lodKey
            if (!k || found) return
            if (W.tunnel && !W.done.has('tunnel') && k.includes(`/insect/${W.tunnel.key}|`) && o.position.y < -0.3) found = ['tunnel', o.position]
            if (W.dive !== undefined && !W.done.has('dive') && k.includes('/bird/kestrel|') && o.position.y > 1.2) found = ['dive', o.position]
          })
          if (found) {
            W.done.add(found[0])
            ts.clock.speed = 0
            const p = found[1]
            put([p.x + 3.2, 2.6, p.z + 3.2], [p.x, 0.4, p.z])
            W.caught = found[0]
          }
        }
        loop()
        ts.clock.speed = SPEED
      }, SPEED)
      const want = part === 'vs' ? 3 : 12
      const t0 = Date.now()
      let n = 0
      while (n < want && Date.now() - t0 < 1500000) {
        const st = await page.evaluate(() => ({ caught: window.__want.caught, over: window.__ts.S.stage === 'over' }))
        if (st.caught) {
          const P = await page.evaluate(() => window.__want.pose)
          if (P) await pose(page, P[0], P[1])
          await frames(page, 6)
          await shot(page, `${races.replace(',', '-')}-${st.caught}-${TAG}`)
          n++
          await page.evaluate((s) => {
            window.__want.caught = null
            window.__ts.clock.speed = s
          }, SPEED)
        } else if (st.over) break
        else await new Promise((r) => setTimeout(r, 300))
      }
      console.log('caught', n, 'in', Math.round((Date.now() - t0) / 1000), 's; done', await page.evaluate(() => [...window.__want.done].join(',')))
    }
    await ctx.close()
  }
} finally {
  await browser.close()
  await server.close()
}
