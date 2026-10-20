// Dev-only: boot the built app (dist/) in headless Chromium and drive it with
// real pointer and key input (the wheel from the whole chain down to a
// valley, drags, the year slider and its ticks, the layer toggles, the
// chapter tour's Next and Back, an event's stops, the pins and the clusters
// they gather into, and their cards) to catch anything that stops input
// reaching what's on screen, and any console error on the way. Run
// `npm run build -w @vibe-dump/holo-i-ke-au` first.
//
//   node tools/smoke.mjs                 (real data if public/data has events, else test-data/)
//   DATA=test node tools/smoke.mjs       (test-data/, from tools/fake-data.mjs)
//   DATA=real node tools/smoke.mjs
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, normalize, extname } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const port = Number(process.env.PORT || 5298)
const realReady = existsSync(join(root, 'public/data/manifest.json')) && existsSync(join(root, 'public/data/events.json'))
const useTest = process.env.DATA ? process.env.DATA === 'test' : !realReady

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.geojson': 'application/geo+json', '.png': 'image/png', '.woff2': 'font/woff2' }
const server = createServer(async (req, res) => {
  let f = normalize(join(root, decodeURIComponent(req.url.split('?')[0])))
  if (!f.startsWith(root)) return res.writeHead(403).end()
  if ((await stat(f).catch(() => null))?.isDirectory()) f = join(f, 'index.html')
  const body = await readFile(f).catch(() => null)
  if (!body) return res.writeHead(404).end('not found')
  res.writeHead(200, { 'Content-Type': MIME[extname(f)] || 'application/octet-stream' }).end(body)
})
await new Promise((r) => server.listen(port, '127.0.0.1', r))

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
const errors = []
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
page.on('console', (m) => {
  // (a missing gazetteer file is a warning the app carries on from, not a failure)
  if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(`console: ${m.text()}`)
})
const t0 = Date.now()
await page.goto(`http://127.0.0.1:${port}/dist/index.html${useTest ? '?data=../test-data/' : ''}`)
await page.waitForSelector('#boot', { state: 'detached', timeout: 180000 })
console.log(`booted in ${Date.now() - t0} ms on ${useTest ? 'test' : 'real'} data`)
await page.waitForFunction(() => window.__app?.islandsLoaded, null, { timeout: 300000 })

let failed = 0
const check = async (name, fn) => {
  try {
    await fn()
    console.log('  ✓', name)
  } catch (err) {
    failed++
    console.log('  ✗', name, '—', err.message.split('\n')[0])
  }
}
const ui = (expr) => page.evaluate(new Function(`const app = window.__app; return ${expr}`))
const run = (body) => page.evaluate(new Function(`const app = window.__app; ${body}`))
const expect = async (expr, want) => {
  const got = await ui(expr)
  if (got !== want) throw new Error(`${expr} = ${JSON.stringify(got)}, wanted ${JSON.stringify(want)}`)
}
const frames = async (n) => {
  const f0 = await ui('app.frames')
  await page.waitForFunction((f) => window.__app.frames >= f, f0 + n, { timeout: 120000 })
}
const opts = { timeout: 20000 }
const cardTitle = () => ui("document.querySelector('.card.show h1')?.textContent ?? null")
/**
 * Land the year's easing and say where it landed. (Under the software
 * renderer a frame can take a second, so an easing of two seconds' worth of
 * frames can take most of a minute; as with finishFlight, skip to its end.)
 */
const yearSettles = () => ui('(app.ui.timeline.finish(), app.timeline.year)')
/** Where the camera is headed. */
const goalXZ = () => ui('[app.rig.goal.target.x, app.rig.goal.target.z, app.rig.goal.distance]')
const moved = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]) > 1 || Math.abs(Math.log(a[2] / b[2])) > 0.05

const eras = await ui('app.timeline.n')
const chapters = await ui('app.tour.chapters.length')

if (eras > 0) {
  await check('it opens on the first chapter: its era card, its year', async () => {
    await expect('JSON.stringify([app.tour.active, app.tour.chapter, app.tour.step])', JSON.stringify([true, 0, -1]))
    await expect('app.ui.card.mode', 'era')
    await expect("document.querySelector('.card.show h1')?.textContent === app.timeline.eras[0].label", true)
    await expect('app.timeline.s', 0)
    const pill = await ui("document.querySelector('.tl-tour').textContent")
    if (!/Chapter 1 of \d+/.test(pill)) throw new Error(`the indicator reads “${pill}”`)
    console.log(`      ${pill.replace(/\s+/g, ' ')}`)
  })
}

await check('the wheel zooms from the whole chain to a valley', async () => {
  const d0 = await ui('app.rig.goal.distance')
  // aim at the middle of the largest island pack on screen
  const [x, y] = await page.evaluate(() => {
    const app = window.__app
    const t = app.world.islands.sort((a, b) => (b.pack.rect.x1 - b.pack.rect.x0) - (a.pack.rect.x1 - a.pack.rect.x0))[0]
    const r = t.pack.rect
    const v = new app.camera.position.constructor((r.x0 + r.x1) / 2, 0, (r.z0 + r.z1) / 2)
    v.y = app.world.heightAt(v.x, v.z)
    v.project(app.camera)
    return [((v.x + 1) / 2) * innerWidth, ((1 - v.y) / 2) * innerHeight]
  })
  const over = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.id, [x, y])
  if (over !== 'scene') throw new Error(`the island's middle is under #${over}, not the scene: the opening view frames it under the interface`)
  await page.mouse.move(x, y)
  for (let i = 0; i < 40; i++) {
    await page.mouse.wheel(0, -120)
    if (i % 8 === 7) await frames(1)
  }
  await frames(2)
  const d1 = await ui('app.rig.goal.distance')
  const exag = await ui('app.world.exag')
  if (!(d1 < 40 && d0 > 3000)) throw new Error(`distance ${d0.toFixed(0)} → ${d1.toFixed(1)}`)
  console.log(`      distance ${d0.toFixed(0)} → ${d1.toFixed(1)}, exaggeration now ${exag.toFixed(2)}`)
})
await check('island packs take over near the ground', async () => {
  await frames(30)
  const s = await ui('app.world.slots.filter(Boolean).map((t) => t.pack.id + ":" + t.k.toFixed(2)).join(" ")')
  if (!s || !/:(0\.[3-9]|1\.00)/.test(s)) throw new Error(`slots: ${s || 'none'}`)
  console.log(`      slots ${s}`)
})
await check('the camera stays above the ground', async () => {
  const gap = await ui('app.camera.position.y - app.world.heightAt(app.camera.position.x, app.camera.position.z)')
  if (!(gap > 0)) throw new Error(`camera ${gap.toFixed(3)} above the ground`)
})
await check('drag pans', async () => {
  const before = await ui('app.rig.goal.target.x + "," + app.rig.goal.target.z')
  await page.mouse.move(640, 420)
  await page.mouse.down()
  await page.mouse.move(760, 470, { steps: 6 })
  await page.mouse.up()
  const after = await ui('app.rig.goal.target.x + "," + app.rig.goal.target.z')
  if (before === after) throw new Error('target did not move')
})
await check('right-drag turns', async () => {
  const yaw = await ui('app.rig.goal.yaw')
  await page.mouse.move(500, 400)
  await page.mouse.down({ button: 'right' })
  await page.mouse.move(640, 410, { steps: 6 })
  await page.mouse.up({ button: 'right' })
  const now = await ui('app.rig.goal.yaw')
  if (Math.abs(now - yaw) < 0.1) throw new Error(`yaw ${yaw} → ${now}`)
})
await check('the wheel zooms back out to the whole chain', async () => {
  await page.mouse.move(640, 400)
  for (let i = 0; i < 45; i++) await page.mouse.wheel(0, 120)
  await frames(3)
  const d = await ui('app.rig.goal.distance')
  if (!(d > 4000)) throw new Error(`distance ${d}`)
})
await check('home flies to the whole chain', async () => {
  await page.click('.tools [data-tool="home"]', opts)
  await page.evaluate(() => window.__app.rig.finishFlight())
  const d = await ui('Math.round(app.rig.goal.distance) === Math.round(app.rig.home.distance)')
  if (!d) throw new Error('not home')
})
if (eras > 1) {
  await check('a tick on the timeline moves the year', async () => {
    await page.click('.tl-tick[data-i="0"] span', opts)
    await page.waitForFunction(() => window.__app.timeline.s < 0.01, null, { timeout: 15000 })
    await expect("document.querySelector('.tl-era').textContent === window.__app.timeline.eras[0].label", true)
  })
  await check('dragging the slider moves the year and leaves the tour', async () => {
    const box = await page.locator('.tl-input').boundingBox()
    await page.mouse.move(box.x + 12, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width - 12, box.y + box.height / 2, { steps: 8 })
    await page.mouse.up()
    const s = await ui('app.timeline.s')
    if (!(s > eras - 1.3)) throw new Error(`s = ${s}`)
    await expect('app.tour.active', false)
    const pill = await ui("document.querySelector('.tl-tour').textContent")
    if (!new RegExp(`resumes at chapter ${Math.round(s) + 1} of`).test(pill)) throw new Error(`the indicator reads “${pill}”`)
  })
} else console.log('  - one era or none: timeline checks skipped')

if (chapters > 1) {
  await check('Next picks the tour up at the nearest chapter', async () => {
    const near = await ui('Math.round(app.timeline.s)')
    await page.click('.tl-next', opts)
    await expect('JSON.stringify([app.tour.active, app.tour.chapter, app.tour.step])', JSON.stringify([true, near, -1]))
    await expect(`document.querySelector('.card.show h1')?.textContent === app.timeline.eras[${near}].label`, true)
    await yearSettles()
    await expect(`Math.abs(app.timeline.s - ${near}) < 0.001`, true)
  })
  await check('Back from a chapter card goes to the last step before it', async () => {
    const c = await ui('app.tour.chapter')
    await page.keyboard.press('ArrowLeft')
    const [pc, ps, title] = await ui(`[app.tour.chapter, app.tour.step, app.tour.event?.title ?? app.timeline.eras[${c - 1}].label]`)
    if (pc !== c - 1) throw new Error(`chapter ${pc}, wanted ${c - 1}`)
    const got = await cardTitle()
    if (got !== title) throw new Error(`the card reads “${got}”, wanted “${title}” (step ${ps})`)
  })
  await check(', and . step chapter by chapter', async () => {
    const c = await ui('app.tour.chapter')
    const inside = await ui('app.tour.step >= 0')
    await page.keyboard.press(',') // inside a chapter: its own card first
    await expect('JSON.stringify([app.tour.chapter, app.tour.step])', JSON.stringify([inside ? c : c - 1, -1]))
    await page.keyboard.press(',')
    await page.keyboard.press('.')
    await expect('JSON.stringify([app.tour.chapter, app.tour.step])', JSON.stringify([inside ? c : c - 1, -1]))
    await expect('app.ui.card.mode', 'era')
  })

  // the busiest chapter with no stops in it (and not the last), to step through
  const pick = await ui(`(() => {
    let best = -1
    app.tour.chapters.forEach((ch, i) => {
      if (i < app.tour.chapters.length - 1 && ch.events.length >= 3 && ch.events.every((e) => !e.stops?.length) && (best < 0 || ch.events.length > app.tour.chapters[best].events.length)) best = i
    })
    return best
  })()`)
  if (pick >= 0) {
    await check(`Next walks chapter ${pick + 1}: the year moves, the camera flies, the card and pin follow`, async () => {
      await run(`app.tour.goTo(${pick}, -1); app.settle()`)
      await page.focus('#scene')
      const n = await ui(`app.tour.chapters[${pick}].events.length`)
      for (let s = 0; s < n; s++) {
        const before = await goalXZ()
        if (s % 2) await page.keyboard.press('Space')
        else await page.keyboard.press('ArrowRight')
        const [step, title, id, flying, want] = await ui(
          `[app.tour.step, app.tour.event.title, app.tour.event.id, !!app.rig.flight, app.tour.stepYear(app.tour.event, app.tour.current)]`,
        )
        if (step !== s) throw new Error(`step ${step}, wanted ${s}`)
        const got = await cardTitle()
        if (got !== title) throw new Error(`step ${s}: the card reads “${got}”, wanted “${title}”`)
        const dur = await ui('app.rig.flight?.duration ?? 0')
        if (dur > 3.5) throw new Error(`step ${s}: a ${dur.toFixed(1)} s flight`)
        await page.evaluate(() => window.__app.rig.finishFlight())
        const after = await goalXZ()
        if (!flying && !moved(before, after)) throw new Error(`step ${s} (${id}): the camera stayed put`)
        const y = await yearSettles()
        if (Math.abs(y - want) > 0.05) throw new Error(`step ${s} (${id}): year ${y.toFixed(2)}, wanted ${want.toFixed(2)}`)
        await frames(2)
        // its pin lit, standing alone with its label, never in a cluster
        const [lit, grouped] = await ui(
          `[app.ui.pins.items.find((it) => it.ev.id === '${id}')?.el.matches('.show.active') ?? false, app.ui.pins.groups().some((g) => g.ids.includes('${id}'))]`,
        )
        if (grouped) throw new Error(`step ${s} (${id}): its pin is in a cluster`)
        if (!lit) {
          // fine only if its point is off the screen (a far step can frame a place by its edge)
          const where = await ui(`(() => {
            const it = app.ui.pins.items.find((it) => it.ev.id === '${id}')
            if (!it) return 'no pin'
            const v = it.pos.clone().project(app.camera)
            const x = ((v.x + 1) / 2) * innerWidth, y = ((1 - v.y) / 2) * innerHeight
            return x > 0 && x < innerWidth && y > 84 && y < innerHeight ? 'on screen at ' + x.toFixed(0) + ',' + y.toFixed(0) : 'off screen'
          })()`)
          if (where.startsWith('on screen')) throw new Error(`step ${s} (${id}): its pin is not lit, though ${where}`)
          console.log(`      (step ${s}: ${id} has ${where === 'no pin' ? 'no pin' : 'its pin off the screen'})`)
        }
        console.log(`      ${s + 1}/${n} ${title} · ${y.toFixed(1)} · d ${after[2].toFixed(0)}`)
      }
      await page.keyboard.press('ArrowRight')
      await expect('JSON.stringify([app.tour.chapter, app.tour.step])', JSON.stringify([pick + 1, -1]))
      await expect(`document.querySelector('.card.show h1')?.textContent === app.tour.chapters[${pick + 1}].era.label`, true)
    })
    await check('Back reverses, step by step, into the chapter before', async () => {
      const n = await ui(`app.tour.chapters[${pick}].events.length`)
      await page.keyboard.press('ArrowLeft')
      await expect('JSON.stringify([app.tour.chapter, app.tour.step])', JSON.stringify([pick, n - 1]))
      await expect('document.querySelector(".card.show h1")?.textContent === app.tour.event.title', true)
      await page.click('.card.show .nav.prev', opts)
      await expect('JSON.stringify([app.tour.chapter, app.tour.step])', JSON.stringify([pick, n - 2]))
      await expect('document.querySelector(".card.show h1")?.textContent === app.tour.event.title', true)
      const want = await ui('app.tour.stepYear(app.tour.event, app.tour.current)')
      const y = await yearSettles()
      if (Math.abs(y - want) > 0.05) throw new Error(`year ${y.toFixed(2)}, wanted ${want.toFixed(2)}`)
    })
  } else console.log('  - no chapter with three plain events: the step walk is skipped')

  const walk = await ui('(() => { for (const ch of app.tour.chapters) { const s = ch.events.findIndex((e) => e.stops?.length > 1); if (s >= 0) return [ch.index, s] } return null })()')
  if (walk) {
    const [wc, ws] = walk
    await check('inside the tour, Next walks an event’s stops and then moves on', async () => {
      await run(`app.tour.goTo(${wc}, ${ws}); app.settle()`)
      await page.focus('#scene')
      const [id, n, last] = await ui(`[app.tour.event.id, app.tour.event.stops.length, app.tour.chapters[${wc}].events.length - 1]`)
      const label = await ui("document.querySelector('.card.show .nav.next')?.textContent.trim()")
      if (!/stops/.test(label)) throw new Error(`Next on the card reads “${label}”`)
      for (let i = 0; i < n; i++) {
        const before = await goalXZ()
        await page.keyboard.press('ArrowRight')
        const st = await ui('app.tour.state')
        if (st.event !== id || st.stop !== i) throw new Error(`after ${i + 1} Next: ${JSON.stringify(st)}`)
        const box = await ui("document.querySelector('.card.show .stop-n')?.textContent")
        if (!box?.startsWith(`${i + 1} / ${n}`)) throw new Error(`stop box reads “${box}”`)
        const stop = await ui(`app.tour.event.stops[${i}]`)
        await page.evaluate(() => window.__app.rig.finishFlight())
        const after = await goalXZ()
        if (i > 0 && !moved(before, after)) {
          // (two stops whose places share a point and a zoom share a view)
          const same = await ui(`(() => {
            const [a, b] = [app.tour.event.stops[${i}], app.tour.event.stops[${i - 1}]]
            const pa = app.tour.places.get(a.place)?.geometry.coordinates, pb = app.tour.places.get(b.place)?.geometry.coordinates
            return a.zoom === b.zoom && JSON.stringify(pa) === JSON.stringify(pb)
          })()`)
          if (!same) throw new Error(`stop ${i + 1}: the camera stayed put`)
          console.log(`      (stops ${i} and ${i + 1} share a point: one view)`)
        }
        if (Number.isFinite(stop.year)) {
          const y = await yearSettles()
          if (Math.abs(y - stop.year) > 0.05) throw new Error(`stop ${i + 1}: year ${y}, wanted ${stop.year}`)
        }
      }
      console.log(`      ${n} stops of ${id}`)
      await page.keyboard.press('ArrowRight')
      const st = await ui('app.tour.state')
      const want = ws < last ? [wc, ws + 1] : [wc + 1, -1]
      if (st.chapter !== want[0] || st.step !== want[1] || st.stop !== -1) throw new Error(`after the last stop: ${JSON.stringify(st)}`)
    })
    await check('Back walks the stops in reverse, to the event’s own card', async () => {
      const n = await ui(`app.tour.chapters[${wc}].events[${ws}].stops.length`)
      await page.keyboard.press('ArrowLeft')
      await expect('JSON.stringify([app.tour.chapter, app.tour.step, app.tour.stop])', JSON.stringify([wc, ws, n - 1]))
      await expect(`document.querySelector('.card.show .stop-n')?.textContent.startsWith('${n} / ${n}')`, true)
      for (let i = n - 2; i >= -1; i--) await page.keyboard.press('ArrowLeft')
      await expect('JSON.stringify([app.tour.chapter, app.tour.step, app.tour.stop])', JSON.stringify([wc, ws, -1]))
      await expect("!!document.querySelector('.card.show .stop')", false)
    })
  } else console.log('  - no event with stops: the stop walk is skipped')

  // two events on near views of different islands, one after the other
  const hop = await ui(`(() => {
    const T = app.tour
    for (const ch of T.chapters) for (let s = 0; s + 1 < ch.events.length; s++) {
      const a = ch.events[s], b = ch.events[s + 1]
      if (a.stops?.length || b.stops?.length) continue
      const pa = T.placeOf(a), pb = T.placeOf(b)
      if (pa && pb && pa.island && pb.island && pa.island !== pb.island && a.zoom?.includes('near') && b.zoom?.includes('near')) return [ch.index, s]
    }
    return null
  })()`)
  if (hop) {
    await check('a flight between islands rises before it descends, and is short', async () => {
      await run(`app.tour.goTo(${hop[0]}, ${hop[1]}); app.settle()`)
      const d0 = await ui('app.rig.state.distance')
      // watch the flight from inside the page, frame by frame
      const watch = page.evaluate(
        () =>
          new Promise((resolve) => {
            const app = window.__app
            let top = 0
            const t0 = performance.now()
            const tick = () => {
              top = Math.max(top, app.rig.state.distance)
              if (app.rig.flight || performance.now() - t0 < 300) requestAnimationFrame(tick)
              else resolve(top)
            }
            requestAnimationFrame(tick)
          }),
      )
      await page.keyboard.press('ArrowRight')
      const dur = await ui('app.rig.flight?.duration ?? 0')
      const top = await watch
      const d1 = await ui('app.rig.state.distance')
      if (!(top > 4 * Math.max(d0, d1))) throw new Error(`distance ${d0.toFixed(0)} → peak ${top.toFixed(0)} → ${d1.toFixed(0)}`)
      if (!(dur > 0 && dur <= 3.5)) throw new Error(`a ${dur} s flight`)
      console.log(`      distance ${d0.toFixed(0)} → peak ${top.toFixed(0)} → ${d1.toFixed(0)} in ${dur.toFixed(1)} s`)
    })
  }
} else console.log('  - fewer than two chapters: tour checks skipped')

for (const t of ['polity', 'lines', 'pins']) {
  await check(`toggle ${t}`, async () => {
    const was = await ui(`app.overlay.${t}`)
    await page.click(`.tools [data-tool="${t}"]`, opts)
    await expect(`app.overlay.${t}`, !was)
    await page.click(`.tools [data-tool="${t}"]`, opts)
    await expect(`app.overlay.${t}`, was)
  })
}
await check('help opens and closes', async () => {
  await page.click('.tools [data-tool="help"]', opts)
  await expect("document.querySelector('.help').classList.contains('hidden')", false)
  await page.click('.help .help-close', opts)
  await expect("document.querySelector('.help').classList.contains('hidden')", true)
})
await check('hovering land names its moku', async () => {
  await run('app.ui.card.close()')
  await page.click('.tools [data-tool="home"]', opts)
  await page.evaluate(() => window.__app.settle())
  await frames(2)
  const pt = await page.evaluate(() => {
    const app = window.__app
    for (let y = 120; y < innerHeight - 120; y += 23) {
      for (let x = 60; x < innerWidth - 60; x += 23) {
        if (document.elementFromPoint(x, y)?.id !== 'scene' || document.elementFromPoint(x - 4, y)?.id !== 'scene') continue
        const p = app.rig.pickGround(x, y)
        if (p && app.world.metresAt(p.x, p.z) > 50 && app.polity.mokuAt(p.x, p.z)) return [x, y]
      }
    }
    return null
  })
  if (!pt) throw new Error('no moku on screen')
  await page.mouse.move(pt[0] - 4, pt[1])
  await page.waitForTimeout(250)
  await page.mouse.move(pt[0], pt[1])
  await page.waitForFunction(() => document.querySelector('.inspector.show b')?.textContent, null, { timeout: 10000 })
})

const evs = await ui('app.data.events.length')
if (evs) {
  await check('a pin opens its card, and the tour moves to it', async () => {
    await run('app.ui.card.close(); app.ui.onScrub()')
    const ev = await ui("(app.data.events.find((e) => e.stops?.length) || app.data.events[0]).id")
    await run(`const it = app.ui.pins.items.find((it) => it.ev.id === '${ev}'); app.timeline.setYear(it.start + 0.01); const p = app.tour.pointView(it.place, 900); app.rig.jump({ x: p.target.x, z: p.target.z, distance: p.distance, yaw: p.yaw, pitch: p.pitch })`)
    await frames(3)
    const sel = `.pin.show[title="${await ui(`app.data.events.find((e) => e.id === '${ev}').title`)}"]`
    await page.waitForSelector(sel, opts)
    const [title, x, y] = await page.evaluate((sel) => {
      const m = document.querySelector(sel)
      const r = m.getBoundingClientRect()
      return [m.title, r.x + 14, r.y + r.height / 2]
    }, sel)
    await page.mouse.click(x, y)
    await page.waitForFunction((t) => document.querySelector('.card.show h1')?.textContent === t, title, { timeout: 15000 })
    await expect(`app.tour.event?.id === '${ev}' && app.tour.active`, true)
  })
  await check('the card closes', async () => {
    await page.click('.card.show .card-close', opts)
    await expect("document.querySelector('.card').classList.contains('show')", false)
  })

  // clusters: the palace if the data has it, else the busiest spot that has two events at once
  const spot = await ui(`(() => {
    const items = app.ui.pins.items
    const key = (it) => it.x.toFixed(2) + ',' + it.z.toFixed(2)
    const pal = items.find((it) => it.ev.id === 'overthrow-1893')
    const seed = pal || items.find((it) => items.some((o) => o !== it && key(o) === key(it) && o.span[1] >= it.start && o.span[0] <= it.start + 0.01))
    if (!seed) return null
    const same = items.filter((o) => key(o) === key(seed)).map((o) => o.ev.id)
    return { id: seed.ev.id, year: seed.start + 0.01, same }
  })()`)
  if (spot) {
    const sel = `.cluster.show[data-events~="${spot.id}"]`
    await check(`pins cluster over the whole chain (${spot.id})`, async () => {
      await run(`app.ui.card.close(); app.ui.onScrub(); app.timeline.setYear(${spot.year})`)
      await page.click('.tools [data-tool="home"]', opts)
      await page.evaluate(() => window.__app.settle())
      await frames(3)
      await page.waitForSelector(sel, opts)
      const g = await ui(`app.ui.pins.groups().find((g) => g.ids.includes('${spot.id}'))`)
      const shown = await ui(`app.ui.pins.items.filter((it) => it.el.classList.contains('show') && it.ev.id === '${spot.id}').length`)
      if (!g || g.count < 2) throw new Error(`no cluster: ${JSON.stringify(g)}`)
      if (shown) throw new Error('its own pin shows as well as the cluster')
      const n = await ui(`document.querySelector('${sel}').textContent`)
      if (Number(n) !== g.count) throw new Error(`the marker reads ${n}, the cluster holds ${g.count}`)
      console.log(`      ${g.count}: ${g.ids.join(', ')}`)
    })
    await check('hovering a cluster lists its events and years', async () => {
      await page.hover(sel, opts)
      await page.waitForSelector('.cl-tip.show', opts)
      const [rows, title] = await page.evaluate(
        (id) => [document.querySelectorAll('.cl-tip.show .tip-row').length, window.__app.data.events.find((e) => e.id === id).title],
        spot.id,
      )
      const text = await ui("document.querySelector('.cl-tip').textContent")
      const g = await ui(`app.ui.pins.groups().find((g) => g.ids.includes('${spot.id}'))`)
      if (rows !== g.count || !text.includes(title)) throw new Error(`${rows} rows for ${g.count}: “${text}”`)
    })
    await check('clicking a cluster opens its list, earliest first', async () => {
      await page.click(sel, opts)
      await page.waitForSelector('.card.show[data-mode="cluster"] .ev-row', opts)
      const ids = await ui("[...document.querySelectorAll('.card.show .ev-row')].map((b) => b.dataset.ev)")
      const starts = await ui(`${JSON.stringify(ids)}.map((id) => app.ui.pins.items.find((it) => it.ev.id === id).start)`)
      if (!starts.every((s, i) => !i || s >= starts[i - 1])) throw new Error(`out of order: ${ids.join(', ')}`)
      if (!ids.includes(spot.id)) throw new Error(`${spot.id} missing from ${ids.join(', ')}`)
      await expect("document.querySelector('.cl-tip').classList.contains('show')", false)
    })
    await check('choosing from the list opens that event and lights its pin', async () => {
      await page.click(`.card.show .ev-row[data-ev="${spot.id}"]`, opts)
      const title = await ui(`app.data.events.find((e) => e.id === '${spot.id}').title`)
      await page.waitForFunction((t) => document.querySelector('.card.show h1')?.textContent === t, title, opts)
      await frames(3)
      await expect(`app.ui.pins.items.find((it) => it.ev.id === '${spot.id}').el.matches('.show.active')`, true)
      await expect(`app.ui.pins.groups().some((g) => g.ids.includes('${spot.id}'))`, false)
      await expect(`app.tour.event?.id`, spot.id)
    })
    await check('closer in the cluster comes apart; one spot stays together', async () => {
      // the open event stands alone; the others at its very point stay listed as one
      await run(`const it = app.ui.pins.items.find((it) => it.ev.id === '${spot.id}'); app.rig.jump({ x: it.x, z: it.z, distance: 40, yaw: 0 }); app.settle()`)
      await frames(4)
      const groups = await ui('app.ui.pins.groups()')
      const visibleSame = await ui(`${JSON.stringify(spot.same)}.filter((id) => id !== '${spot.id}' && (() => { const it = app.ui.pins.items.find((x) => x.ev.id === id); const [a, b] = app.timeline.window; return it.span[1] >= a && it.span[0] <= b })())`)
      const here = groups.find((g) => visibleSame.some((id) => g.ids.includes(id)))
      if (visibleSame.length >= 2 && (!here || !visibleSame.every((id) => here.ids.includes(id)))) throw new Error(`same spot split: ${JSON.stringify(groups)}`)
      if (groups.some((g) => g.ids.includes(spot.id))) throw new Error('the open event is in a cluster')
      // nothing that isn't at the very spot rides along at this zoom unless it is near on screen too
      const far = await ui(`app.ui.pins.groups().flatMap((g) => g.ids).filter((id) => { const a = app.ui.pins.items.find((x) => x.ev.id === id); const b = app.ui.pins.items.find((x) => x.ev.id === '${spot.id}'); return Math.hypot(a.x - b.x, a.z - b.z) > 20 })`)
      if (far.length) throw new Error(`still gathered from afar: ${far.join(', ')}`)
      console.log(`      at 4 km: ${groups.map((g) => g.ids.join('+')).join(' | ') || 'no clusters'}; ${spot.id} alone`)
    })
  } else console.log('  - no two events at one spot: cluster checks skipped')
} else console.log('  - no events: pin checks skipped')

const stats = await ui('app.stats()')
console.log('stats', JSON.stringify(stats))
if (errors.length) {
  failed++
  console.log('  ✗ console errors:\n   ', errors.slice(0, 10).join('\n    '))
} else console.log('  ✓ no console errors')
await browser.close()
server.close()
console.log(failed ? `${failed} failed` : 'all passed')
process.exitCode = failed ? 1 : 0
