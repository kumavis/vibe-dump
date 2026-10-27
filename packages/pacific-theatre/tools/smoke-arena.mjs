#!/usr/bin/env node
// The wargame's gate (ROUND-3.md §3 "Determinism", §7; engine-3).
//
// Part 1, headless in node (the arena imports no three.js), the balance: each
// scenario run for both admirals with no player, 20 seeds a side: the sim
// finite, both sides taking losses, no unit beyond the arena's edge by more
// than 1 km, the side's main goal met within the clock in 40–75 % of its
// seeds (the balance band), the step under 2 ms (its mean and 99th
// percentile, on this machine).
//
// Part 2, headless, a scripted player in each scenario as each side:
// possess the first unit, fire at its station, hop to each kind (1–4, Tab),
// fly an aircraft and fire, be lost, be given the next unit two seconds
// later with its line, the tally and the highlights, release, a forced end.
//
// Part 3, in Chromium under SwiftShader against the Vite dev server
// (battle.html?wargame=test-box, started here if not up): enter the fixture
// as each side through Battle.enterWargame, the HUD's own lines (the clock,
// the station bar), a hit, a slow motion, the snapshots, a forced end and
// its event, no console error, frame time and heap (tools/shots/arena-*.png).
//
//   node tools/fake-data.mjs && node tools/fake-battle.mjs && node tools/fake-wargame.mjs
//   node tools/smoke-arena.mjs [--headless-only] [--browser-only] [--seeds 20] [--scenario <file> ...]
//   PORT=5431 node tools/smoke-arena.mjs ...     the dev server's port (another worktree's may hold 5297)
//
// The scenarios: the fixture (test-data/wargames/test-box.json), every
// public/data/wargames/*.json there is (content-3's), and any --scenario
// file (its box read from public/data/).

import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { readPNG } from './lib/png.mjs'
import { decodeHeights } from './lib/raster.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const argv = process.argv.slice(2)
const args = new Set(argv)
const PORT = Number(process.env.PORT || 5297)
const SEEDS = argv.includes('--seeds') ? Number(argv[argv.indexOf('--seeds') + 1]) : 20
const extra = argv.flatMap((a, i) => (a === '--scenario' ? [argv[i + 1]] : []))
const shots = path.join(root, 'tools/shots')
fs.mkdirSync(shots, { recursive: true })
const J = (p) => JSON.parse(fs.readFileSync(p, 'utf8'))
const list = (v, k) => (Array.isArray(v) ? v : v?.[k] || [])

const { createArena } = await import('../src/battle/arena/index.js')
const { hitAircraft, hitShip } = await import('../src/battle/arena/damage.js')
const { TangentProjection } = await import('../src/geo.js')
const { wrapDeep } = await import('../src/data/load.js')

let failed = 0
const check = async (name, fn) => {
  const t0 = Date.now()
  try {
    const note = await fn()
    console.log('  ✓', name + (note ? ` — ${note}` : ''), `(${((Date.now() - t0) / 1000).toFixed(1)} s)`)
  } catch (err) {
    failed++
    console.log('  ✗', name, '—', err.message.split('\n')[0])
  }
}
const assert = (c, m) => {
  if (!c) throw new Error(m)
}
const pct = (x) => `${Math.round(x * 100)} %`

// --- the scenarios and their boxes -------------------------------------------------------------------------
const fixtureFile = path.join(root, 'test-data/wargames/test-box.json')
if (!fs.existsSync(fixtureFile) && fs.existsSync(path.join(root, 'test-data/boxes/test-box/battle.json'))) {
  console.log('(no fixture scenario: running tools/fake-wargame.mjs)')
  await new Promise((r) => spawn(process.execPath, [path.join(root, 'tools/fake-wargame.mjs')], { stdio: 'inherit' }).on('exit', r))
}
const scenarios = []
if (fs.existsSync(fixtureFile)) scenarios.push({ file: fixtureFile, data: path.join(root, 'test-data') })
else console.log('no test-data/: run node tools/fake-data.mjs && node tools/fake-battle.mjs && node tools/fake-wargame.mjs first')
const pub = path.join(root, 'public/data/wargames')
if (fs.existsSync(pub)) for (const f of fs.readdirSync(pub).filter((f) => f.endsWith('.json')).sort()) scenarios.push({ file: path.join(pub, f), data: path.join(root, 'public/data') })
for (const f of extra) scenarios.push({ file: path.resolve(f), data: path.join(root, 'public/data') })

const boxCache = new Map()
function loadScenario({ file, data }) {
  const scenario = J(file)
  const key = `${data}:${scenario.box}`
  if (!boxCache.has(key)) {
    const kits = { ships: list(J(path.join(data, 'kits/ships.json')), 'ships'), aircraft: list(J(path.join(data, 'kits/aircraft.json')), 'aircraft'), weapons: list(J(path.join(data, 'kits/weapons.json')), 'weapons') }
    const man = list(J(path.join(data, 'boxes/manifest.json')), 'boxes').find((b) => b.id === scenario.box)
    if (!man) throw new Error(`${path.basename(file)}: no box ${scenario.box} in ${path.relative(root, data)}`)
    const proj = new TangentProjection(man.projection)
    const battle = J(path.join(data, man.battle))
    wrapDeep(battle, proj.lon0)
    const img = readPNG(path.join(data, man.height.file))
    const ground = { metres: decodeHeights(img, man.height.scale, man.height.offset), W: img.width, H: img.height, rect: proj.rect(man.bounds), exaggeration: man.exaggeration ?? 1 }
    boxCache.set(key, { kits, box: { battle, ground, proj, exaggeration: man.exaggeration ?? 1 } })
  }
  return { scenario, ...boxCache.get(key) }
}

const finiteState = (ar) => {
  const s = ar.state
  for (let i = 0; i < ar.capacity; i++) {
    if (!s.alive[i]) continue
    for (let k = 0; k < 3; k++) if (!Number.isFinite(s.pos[3 * i + k]) || !Number.isFinite(s.vel[3 * i + k])) return `${ar.slots[i].id} pos/vel`
    for (let k = 0; k < 4; k++) if (!Number.isFinite(s.quat[4 * i + k])) return `${ar.slots[i].id} quat`
  }
  return null
}

const doHeadless = !args.has('--browser-only')
const doBrowser = !args.has('--headless-only')
const balance = []

if (doHeadless) {
  // =========================================================================================================
  // Part 1: the balance
  // =========================================================================================================
  console.log(`balance (ROUND-3 §3), ${SEEDS} seeds a side, no player:`)
  for (const sc of scenarios) {
    const { scenario, kits, box } = loadScenario(sc)
    for (const side of ['jp', 'us']) {
      await check(`${scenario.id} as ${side}: finite, losses on both sides, inside the arena, the goal met in 40–75 % of the seeds, the step under 2 ms`, () => {
        let met = 0
        let both = 0
        let far = 0
        const times = []
        const reasons = {}
        let sumMs = 0
        let steps = 0
        for (let k = 0; k < SEEDS; k++) {
          const ar = createArena(scenario, kits, box, { side, seed: String(k), warn: () => {} })
          let n = 0
          while (!ar.result) {
            const t0 = performance.now()
            ar.step()
            const d = performance.now() - t0
            if (n > 120) {
              times.push(d)
              sumMs += d
              steps++
            }
            if (n % 30 === 0) {
              const bad = finiteState(ar)
              if (bad) throw new Error(`seed ${k}: not finite at ${ar.t.toFixed(1)} s (${bad})`)
              const s = ar.state
              for (let i = 0; i < ar.capacity; i++) if (s.alive[i] === 1) far = Math.max(far, Math.hypot(s.pos[3 * i] - ar.centre.x, s.pos[3 * i + 2] - ar.centre.z) - ar.R)
            }
            n++
          }
          const r = ar.result
          reasons[r.reason] = (reasons[r.reason] || 0) + 1
          if (r.goals[side].status === 'met') met++
          const t = ar.tally
          if (t.jp.shipsLost + t.jp.aircraftLost > 0 && t.us.shipsLost + t.us.aircraftLost > 0) both++
        }
        times.sort((a, b) => a - b)
        const p99 = times[Math.floor(times.length * 0.99)]
        const mean = sumMs / Math.max(1, steps)
        const rate = met / SEEDS
        balance.push({ id: scenario.id, side, rate, mean, p99, far, reasons })
        const note = `goal met in ${met}/${SEEDS} (${pct(rate)}); losses on both sides in ${both}/${SEEDS}; furthest ${Math.max(0, far).toFixed(0)} m beyond the edge; step ${mean.toFixed(3)} ms mean, ${p99.toFixed(3)} ms p99; ends ${JSON.stringify(reasons)}`
        assert(both >= Math.ceil(SEEDS * 0.9), `losses on both sides in only ${both} of ${SEEDS}: ${note}`)
        assert(far <= 1000, `a unit ${far.toFixed(0)} m beyond the edge: ${note}`)
        assert(mean < 2 && p99 < 2, `the step: ${note}`)
        assert(rate >= 0.4 && rate <= 0.75, `outside the band: ${note}`)
        return note
      })
    }
  }

  // =========================================================================================================
  // Part 2: a scripted player
  // =========================================================================================================
  console.log('a scripted player (ROUND-3 §7):')
  for (const sc of scenarios) {
    const { scenario, kits, box } = loadScenario(sc)
    for (const side of ['jp', 'us']) {
      await check(`${scenario.id} as ${side}: possess, fire, hop, fly, be lost, respawn, release, a forced end`, () => {
        const ar = createArena(scenario, kits, box, { side, seed: 'player', warn: () => {} })
        const first = ar.first
        assert(first, 'no first unit')
        const pl = ar.takeControl(first)
        assert(ar.slots[pl.unitIndex].side === side, 'the first unit is not the side’s')
        const rows = ar.units()
        assert(rows.every((r) => r.enemy === (r.side !== side)), 'a row marked enemy wrongly')
        assert(rows.filter((r) => !r.enemy && r.alive === 1).every((r) => r.takeable === true), 'a friendly unit alive is not takeable')
        assert(rows.filter((r) => r.enemy).every((r) => typeof r.takeable === 'string'), 'an enemy row is takeable')
        // twenty seconds at the first unit's station: steer, lay the guns on the lead, fire
        for (let k = 0; k < 20 * 60; k++) {
          const p = ar.player
          if (p.kind === 'ship') {
            p.input.helm = Math.sin(ar.t / 4) * 0.5
            const t = p.state.target
            if (t?.lead) {
              const i = p.unitIndex
              const s = ar.state
              p.input.aimAz = (Math.atan2(t.lead[0] - s.pos[3 * i], -(t.lead[2] - s.pos[3 * i + 2])) / (Math.PI / 180) + 360) % 360
              p.input.aimRange = Math.hypot(t.lead[0] - s.pos[3 * i], t.lead[2] - s.pos[3 * i + 2])
              if (k % 120 === 0) p.input.salvoCount++
              if (k === 300) p.input.torpedoCount++
            }
          }
          ar.step()
        }
        const fired = ar.sortie?.releases
        assert(fired && fired.salvos + fired.torpedoes > 0, `nothing fired from ${ar.slots[ar.player.unitIndex].id}`)
        // the hops: each kind there is
        const hopped = []
        for (const kind of ['carrier', 'capital', 'destroyer', 'aircraft', 'next']) {
          const want = ar.hopTarget(kind)
          const p = ar.hop(kind)
          if (want >= 0) {
            assert(p && p.unitIndex === want, `hop ${kind} did not land on ${ar.slots[want].id}`)
            hopped.push(`${kind}→${ar.slots[p.unitIndex].id}`)
          }
          ar.step()
        }
        // an aircraft (when the side has one): fly at the nearest enemy, fire, drop
        const air = ar.hop('aircraft')
        let flown = 'no aircraft'
        if (air) {
          const i = air.unitIndex
          for (let k = 0; k < 15 * 60; k++) {
            const s = ar.state
            const t = ar.player.state.target
            let best = t?.index ?? -1
            if (best < 0) {
              let bd = Infinity
              for (const j of ar._ships) if (s.alive[j] === 1 && ar.slots[j].side !== side) {
                const d = Math.hypot(s.pos[3 * j] - s.pos[3 * i], s.pos[3 * j + 2] - s.pos[3 * i + 2])
                if (d < bd) {
                  bd = d
                  best = j
                }
              }
            }
            if (best >= 0 && ar.player?.unitIndex === i) {
              ar.player.input.mode = 'aim'
              ar.player.input.aimDir = [s.pos[3 * best] - s.pos[3 * i], Math.max(-300, s.pos[3 * best + 1] - s.pos[3 * i + 1] + 60), s.pos[3 * best + 2] - s.pos[3 * i + 2]]
              ar.player.input.fireHeld = true
              if (k === 400) {
                ar.player.input.bombCount++
                ar.player.input.torpedoCount++
              }
            }
            ar.step()
            if (ar.player?.unitIndex !== i) break
          }
          flown = `${ar.slots[i].id}: ${ar.state.alive[i] === 1 ? `${ar.state.pos[3 * i + 1].toFixed(0)} m up` : 'lost'}`
          // be lost: the next one of the flight two seconds later, with its line
          if (ar.player?.unitIndex === i && ar.state.alive[i] === 1) {
            hitAircraft(ar, i, 9, -1, 'aa')
            const tLost = ar.t
            while (ar.player?.unitIndex === i && ar.t - tLost < 3) ar.step()
            assert(ar.respawn && ar.respawn.from === i, 'no respawn after the aircraft was lost')
            assert(Math.abs(ar.respawn.t - tLost - 2) < 0.1, `the respawn came ${(ar.respawn.t - tLost).toFixed(2)} s after the loss`)
            assert(/did not return\. The next one is yours\./.test(ar.respawn.line), `the line: “${ar.respawn.line}”`)
          }
        }
        // a ship lost: the nearest friendly ship
        const shipPl = ar.hop('capital') || ar.hop('destroyer') || ar.hop('carrier')
        let shipLine = 'no ship to lose'
        if (shipPl) {
          const i = shipPl.unitIndex
          hitShip(ar, i, 999, { by: -1, weapon: 'torpedo' })
          const tLost = ar.t
          while (ar.player?.unitIndex === i && ar.t - tLost < 3) ar.step()
          if (ar.player) {
            assert(ar.respawn?.from === i, 'no respawn after the ship was lost')
            assert(/is going down\. .+ is yours\./.test(ar.respawn.line), `the line: “${ar.respawn.line}”`)
            shipLine = ar.respawn.line
          }
        }
        const t = ar.tally
        assert(t.player.lost >= 1, 'the tally has no loss')
        assert(ar.highlights.some((h) => h.kind === 'loss'), 'no loss among the highlights')
        assert(ar.highlights.some((h) => h.kind === 'sinking'), 'no sinking among the highlights')
        const so = ar.releaseControl()
        assert(so && so.held === false, 'release gave no sortie')
        const r = ar.forceEnd()
        assert(r && r.reason === 'forced' && r.goals.jp && r.goals.us && r.line, 'no result from the forced end')
        assert(!/\b(kill|score|win|enemy)\b/i.test(r.line + shipLine), `a never-word: ${r.line}`)
        return `${hopped.join(', ')}; ${flown}; “${shipLine}”; the end: “${r.line}”`
      })
    }
  }
}

// =========================================================================================================
// Part 3: the browser (the fixture under SwiftShader)
// =========================================================================================================
if (doBrowser) {
  console.log('the browser (ROUND-3 §7), the fixture under SwiftShader:')
  let vite = null
  const up = async () => {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/battle.html`)
      return r.ok
    } catch {
      return false
    }
  }
  if (!(await up())) {
    vite = spawn('npx', ['vite', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], { cwd: root, stdio: 'ignore', detached: false })
    for (let k = 0; k < 60 && !(await up()); k++) await new Promise((r) => setTimeout(r, 500))
  }
  const { chromium } = await import('playwright')
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  const errors = []
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  page.on('pageerror', (e) => errors.push(String(e)))
  const run = (body) => page.evaluate(new Function(`return (async () => { const app = window.__app; const battle = app.battle; const sim = battle.sim; ${body} })()`))
  const steps = (n) => run(`for (let k = 0; k < ${n} && !sim.result; k++) sim.step(); return sim.t`)
  try {
    await check('enter the fixture as the United States: Battle.enterWargame, the first unit held, the HUD’s own lines', async () => {
      const t0 = Date.now()
      await page.goto(`http://127.0.0.1:${PORT}/battle.html?wargame=test-box&side=us&data=./test-data/`)
      await page.waitForFunction(() => window.__app?.ready === true, null, { timeout: 240000 })
      await page.evaluate(() => {
        window.__events = []
        window.__app.events.addEventListener('battle', (e) => window.__events.push(e.detail.kind))
      })
      await page.waitForTimeout(1500)
      const st = await run(`return { w: battle.state.wargame, held: battle.state.held, mode: app.mode, cam: battle.scene.cameraMode, clock: document.querySelector('.pt-hud .clock')?.textContent, stations: [...document.querySelectorAll('.pt-hud .stations button')].map((b) => b.textContent), speeds: battle.speeds }`)
      assert(st.w?.id === 'test-box' && st.w.side === 'us', `wargame state ${JSON.stringify(st.w)}`)
      assert(st.held && st.mode === 'moment', `not held: ${JSON.stringify(st)}`)
      assert(/^0:0\d/.test(st.clock || ''), `the HUD's clock: “${st.clock}”`)
      assert(st.stations.length >= 2, `the station bar: ${st.stations.join(', ')}`)
      await page.screenshot({ path: path.join(shots, 'arena-enter-us.png') })
      return `in ${((Date.now() - t0) / 1000).toFixed(1)} s; ${st.held.id} at ${st.stations[0]}; camera ${st.cam}; clock “${st.clock.slice(0, 40)}”`
    })
    await check('a hit and its marker, a slow motion (the arena’s dt only), the snapshots (320 × 200 JPEG)', async () => {
      // the arena run on in the page (SwiftShader draws a frame a second; the sim is not the frame)
      let t = 0
      for (let k = 0; k < 20; k++) {
        t = await steps(600)
        const n = await run(`return sim.markers.filter((m) => m.kind !== 'down').length`)
        if (n > 0) break
      }
      const markers = await run(`return sim.markers.slice(0, 3).map((m) => m.text)`)
      assert(markers.length, `no hit by ${t.toFixed(0)} s`)
      // a slow motion: the arena's request reaches the scene, whose factor slows the arena and only the arena
      await run(`sim.requestSlowmo(1.2, 'test'); return true`)
      await page.waitForTimeout(400)
      const f = await run(`return battle.scene.slowFactor()`)
      assert(f < 1, `the slow motion's factor ${f}`)
      const before = await run(`return sim.t`)
      await page.waitForTimeout(1500)
      const after = await run(`return { t: sim.t, f: battle.scene.slowFactor() }`)
      // a snapshot on a highlight worth one
      await run(`battle.scene._lastSnapT = -1e9; sim.highlight({ kind: 'hit', unit: sim.player.unitIndex, caption: 'test: a highlight', snap: true }); return true`)
      await page.waitForFunction(() => window.__app.battle.sim.highlights.some((h) => h.caption === 'test: a highlight' && h.snapshot), null, { timeout: 30000 })
      const snap = await page.evaluate(async () => {
        const h = window.__app.battle.sim.highlights.find((x) => x.caption === 'test: a highlight')
        const img = new Image()
        img.src = h.snapshot
        await img.decode()
        return { w: img.width, h: img.height, jpeg: h.snapshot.startsWith('data:image/jpeg'), n: window.__app.battle.scene.snapshots }
      })
      assert(snap.jpeg && snap.w === 320 && snap.h === 200, `the snapshot ${JSON.stringify(snap)}`)
      await page.screenshot({ path: path.join(shots, 'arena-fight-us.png') })
      return `${markers.join(' · ')}; slow ×${f.toFixed(2)} (the arena ${(after.t - before).toFixed(2)} s in 1.5 s of the screen); snapshot ${snap.w}×${snap.h} JPEG, ${snap.n} taken`
    })
    await check('a forced end: the result, the wargame-end event, the controls let go', async () => {
      const r = await run(`const r = battle.endNow(); return { line: r?.line, reason: r?.reason, mode: app.mode, held: battle.state.held, snaps: sim.highlights.filter((h) => h.snapshot).length }`)
      await page.waitForTimeout(800)
      const ev = await page.evaluate(() => window.__events)
      assert(r.reason === 'forced' && r.line, `result ${JSON.stringify(r)}`)
      assert(ev.includes('wargame-end'), `events ${ev.join(', ')}`)
      assert(r.mode === 'watch', `mode ${r.mode}`)
      await page.screenshot({ path: path.join(shots, 'arena-end-us.png') })
      return `“${r.line}”; ${r.snaps} snapshot(s) on the highlights`
    })
    await check('play the other side: Battle.restart({ side: jp }), the first Japanese unit held, a hop', async () => {
      const st = await run(`battle.restart({ side: 'jp' }); return { w: battle.state.wargame, held: battle.state.held, side: sim.slots[sim.player.unitIndex].side }`)
      assert(st.w.side === 'jp' && st.side === 'jp' && st.held, `restart ${JSON.stringify(st)}`)
      await page.waitForTimeout(1500)
      const h = await run(`const r = battle.hop('aircraft') || battle.hop('destroyer'); return { row: r && r.id, cam: battle.scene.cameraMode, held: battle.state.held?.id }`)
      assert(h.row && h.held === h.row, `hop ${JSON.stringify(h)}`)
      await steps(1200)
      await page.waitForTimeout(1200)
      await page.screenshot({ path: path.join(shots, 'arena-jp.png') })
      return `${st.held.id} first; hopped to ${h.row} (${h.cam})`
    })
    await check('no console error; frame time and heap', async () => {
      const st = await page.evaluate(() => ({ s: window.__app.stats?.(), frame: window.__app.frameAvg, heap: performance.memory ? performance.memory.usedJSHeapSize / 1048576 : null }))
      assert(!errors.length, errors.slice(0, 3).join(' | '))
      return `frame ${st.frame?.toFixed(0)} ms (SwiftShader), ${st.s?.calls} draw calls, ${st.s?.triangles} triangles, heap ${st.heap?.toFixed(1)} MB`
    })
  } finally {
    await browser.close()
    if (vite) vite.kill()
  }
}

if (balance.length) {
  console.log('\nbalance:')
  for (const b of balance) console.log(`  ${b.id} as ${b.side}: ${pct(b.rate)} met; step ${b.mean.toFixed(3)} / ${b.p99.toFixed(3)} ms; ${JSON.stringify(b.reasons)}`)
}
console.log(failed ? `\n${failed} check(s) failed` : '\nall checks passed')
process.exit(failed ? 1 : 0)
