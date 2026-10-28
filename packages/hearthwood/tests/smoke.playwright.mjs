// Headless end-to-end smoke test for Hearthwood. Run by hand, NOT by `node --test`:
//
//   npx vite build                       # from packages/hearthwood
//   node tests/smoke.playwright.mjs      # serves dist/, drives Chromium, prints JSON
//
// Env: PORT (default 4419), SHOTS (screenshot dir, default os.tmpdir()), CHROMIUM_PATH,
//      HW_DIST (default ../dist next to this file).
// Exit code 1 on any failed check, console error or page error.

import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'
import { createRequire } from 'node:module'

const here = path.dirname(fileURLToPath(import.meta.url))
const pkg = path.resolve(here, '..')
const repo = path.resolve(pkg, '../..')
const dist = process.env.HW_DIST || path.join(pkg, 'dist')
const port = Number(process.env.PORT || 4419)
const shots = process.env.SHOTS || os.tmpdir()
fs.mkdirSync(shots, { recursive: true })

const require = createRequire(path.join(repo, 'package.json'))
const { chromium } = require('playwright')

const results = { checks: [], errors: [], shots: [] }
let failed = false
const check = (name, ok, info) => {
  results.checks.push({ name, ok: !!ok, ...(info !== undefined ? { info } : {}) })
  if (!ok) failed = true
}

if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error(`no build at ${dist} — run "npx vite build" in packages/hearthwood first`)
  process.exit(1)
}

// ------------------------------------------------------------------ server
const server = spawn(process.execPath, [path.join(repo, 'scripts/serve.mjs'), dist], {
  env: { ...process.env, PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'],
})
await new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(new Error('server did not start')), 10000)
  server.stdout.on('data', (d) => { if (String(d).includes('Serving')) { clearTimeout(t); resolve() } })
  server.on('exit', (c) => reject(new Error('server exited ' + c)))
})

let browser
try {
  try { browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) } catch (err) {
    browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
  }
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  page.on('console', (m) => { if (m.type() === 'error') results.errors.push('console: ' + m.text()) })
  page.on('pageerror', (e) => results.errors.push('pageerror: ' + (e.stack || e.message)))
  page.on('requestfailed', (r) => results.errors.push('requestfailed: ' + r.url()))
  const shot = async (name) => {
    const p = path.join(shots, `hearthwood-${name}.png`)
    await page.screenshot({ path: p })
    results.shots.push(p)
  }

  await page.goto(`http://127.0.0.1:${port}/?seed=20261026`, { waitUntil: 'load' })
  await page.waitForFunction(() => window.__hw && window.__hw.ctx, null, { timeout: 10000 })
  await page.waitForTimeout(2000)
  await shot('1-opening')

  // ---------------------------------------------------------------- hamlet
  const hamlet = await page.evaluate(() => {
    const B = __hw.buildings, U = __hw.units
    // type ids from constants.js: 1 Hearth, 3 Lumber Lodge, 8 Sawmill; unit 1 courier
    const r = {
      hearth: B.typeCount[1], lodge: B.typeCount[3], sawmill: B.typeCount[8], couriers: U.typeCount[1],
      tick: __hw.ctx.tick, fallback: !!__hw.fallback,
      hud: {
        stock: document.getElementById('stock').textContent.trim().length,
        couriers: document.getElementById('couriers').textContent.trim(),
        build: document.querySelectorAll('#buildmenu > *').length,
      },
      moving: 0,
    }
    for (let i = 0; i < U.hi; i++) if (U.alive[i] && U.type[i] === 1 && U.mstate[i] === 2) r.moving++
    return r
  })
  check('hamlet: hearth+lodge+sawmill', hamlet.hearth === 1 && hamlet.lodge >= 1 && hamlet.sawmill >= 1, hamlet)
  check('hamlet: 8 couriers', hamlet.couriers >= 8)
  check('opening: couriers moving after 2 s', hamlet.moving >= 1, hamlet.moving)
  check('sim advances in rAF loop', hamlet.tick > 20, hamlet.tick)
  check('real renderer (no fallback)', !hamlet.fallback)
  check('HUD populated', hamlet.hud.stock > 0 && hamlet.hud.couriers.length > 0 && hamlet.hud.build >= 10, hamlet.hud)

  // ---------------------------------------------------------------- 400 ticks of economy
  const econ = await page.evaluate(() => {
    __hw.pause()
    const ctx = __hw.ctx, B = ctx.buildings
    const saw = B.typeList[8][0]
    const inv = (b, item) => B.inv[(b << 4) | item]
    const d0 = ctx.log.stats.totalDelivered
    const plankStock0 = ctx.stock[6]
    let cycles = 0, woodIn = 0, lastProg = B.progress[saw], lastWood = inv(saw, 1)
    let maxMs = 0
    for (let t = 0; t < 400; t++) {
      const t0 = performance.now()
      __hw.tick(1)
      const dt = performance.now() - t0
      if (dt > maxMs) maxMs = dt
      const p = B.progress[saw], w = inv(saw, 1)
      if (lastProg > 0 && p === 0) cycles++
      if (w > lastWood) woodIn += w - lastWood
      lastProg = p; lastWood = w
    }
    const s = __hw.stats()
    __hw.resume()
    return {
      delivered: ctx.log.stats.totalDelivered - d0, totalDelivered: ctx.log.stats.totalDelivered,
      aborted: ctx.log.stats.totalAborted, lost: ctx.log.stats.totalLost,
      sawCycles: cycles, sawWoodIn: woodIn, plankStockDelta: ctx.stock[6] - plankStock0,
      tickMs: s.tickMs, maxTickMs: maxMs, stats: s,
    }
  })
  check('courier jobs completed in 400 ticks', econ.delivered >= 1, econ)
  check('sawmill received wood', econ.sawWoodIn >= 1)
  check('sawmill produced planks', econ.sawCycles >= 1)
  check('tickMs sane (< 3 ms)', econ.tickMs < 3, econ.tickMs)
  await page.waitForTimeout(800)
  await shot('2-after-400-ticks')

  // ---------------------------------------------------------------- UI: place a quarry via hotkey + click
  const before = await page.evaluate(() => {
    const B = __hw.buildings, w = __hw.world
    __hw.look(B.tx[B.typeList[1][0]] + 1.5, B.ty[B.typeList[1][0]] + 1.5, 1)
    // candidate quarry top-lefts on rock (R_STONE = 2), nearest to the camera centre first
    const cam = __hw.camera, out = []
    const cx = cam.x | 0, cy = cam.y | 0
    for (let ty = cy - 10; ty <= cy + 10; ty++) for (let tx = cx - 16; tx <= cx + 16; tx++) {
      if (!w.areaFree(tx, ty, 2, 2)) continue
      const d = w.doorTile(4, tx, ty)
      if (d < 0 || !w.walkable(d) || w.occ[d] >= 0) continue
      if (w.countResource(tx, ty, 2, 2, 2, 2) <= 0) continue
      const s = cam.worldToScreen(tx + 1, ty + 1, { x: 0, y: 0 })
      if (s.x < 80 || s.y < 120 || s.x > 1000 || s.y > 600) continue
      out.push({ tx, ty, sx: s.x, sy: s.y, d: (tx - cx) ** 2 + (ty - cy) ** 2 })
    }
    out.sort((a, b) => a.d - b.d)
    const hh = __hw.buildings.typeList[1][0]
    return { quarries: __hw.buildings.typeCount[4], wood: __hw.ctx.stock[1], hearthWood: __hw.buildings.inv[(hh << 4) | 1], buildings: __hw.buildings.count, cands: out.slice(0, 12) }
  })
  check('found a quarry candidate on screen', before.cands.length > 0, before.cands.length)
  let placed = false
  await page.mouse.move(640, 400)
  await page.keyboard.press('Digit2')
  for (const c of before.cands) {
    await page.mouse.move(c.sx, c.sy)
    await page.waitForTimeout(50)
    const ok = await page.evaluate(() => __hw.overlay.ghostType === 4 && __hw.overlay.ghostReason === 0)
    if (ok) { await page.mouse.click(c.sx, c.sy); placed = true; break }
  }
  await page.waitForTimeout(100)
  const after = await page.evaluate(() => {
    const B = __hw.buildings, list = B.typeList[4]
    const q = list[B.typeCount[4] - 1]
    const hh = B.typeList[1][0]
    return { quarries: B.typeCount[4], wood: __hw.ctx.stock[1], hearthWood: B.inv[(hh << 4) | 1], ghost: __hw.overlay.ghostType, q, site: q >= 0 ? B.site[q] : -1 }
  })
  check('quarry placed via hotkey 2 + click', placed && after.quarries === before.quarries + 1, { before: before.quarries, after: after.quarries })
  // (the site's couriers reserve wood at once, so ctx.stock may dip; the Hearth's inventory only
  // drops as couriers actually pick up, at most a load or two in these few ticks)
  check('placed as a construction site, nothing paid up front', after.site === 1 && after.hearthWood >= before.hearthWood - 10, { before: before.hearthWood, after: after.hearthWood, site: after.site })
  check('placement mode ended', after.ghost === 0)
  const raised = await page.evaluate((q) => { for (let i = 0; i < 40 && __hw.buildings.site[q]; i++) __hw.tick(50); return { site: __hw.buildings.site[q], alive: __hw.buildings.alive[q], tick: __hw.ctx.tick } }, after.q)
  check('couriers supply the quarry site and it is raised', raised.alive === 1 && raised.site === 0, raised)

  // ---------------------------------------------------------------- UI: soldiers, drag-select, right-click move
  const army = await page.evaluate(() => {
    const B = __hw.buildings, h = B.typeList[1][0]
    const x = B.tx[h] + 1.5, y = B.ty[h] + 5.5
    const ids = []
    for (let k = 0; k < 4; k++) ids.push(__hw.spawn(2, x + k * 0.8 - 1.2, y, 0)) // U_WARDEN, F_PLAYER
    __hw.tick(1)
    const cam = __hw.camera
    const a = cam.worldToScreen(x - 2.5, y - 1.5, { x: 0, y: 0 }), b = cam.worldToScreen(x + 2.5, y + 1.5, { x: 0, y: 0 })
    const g = cam.worldToScreen(x + 4, y + 3, { x: 0, y: 0 })
    return { ids, a, b, g, goal: { x: x + 4, y: y + 3 } }
  })
  await page.mouse.move(army.a.x, army.a.y)
  await page.mouse.down()
  await page.mouse.move((army.a.x + army.b.x) / 2, (army.a.y + army.b.y) / 2, { steps: 4 })
  await page.mouse.move(army.b.x, army.b.y, { steps: 4 })
  await page.mouse.up()
  await page.waitForTimeout(100)
  const sel = await page.evaluate(() => __hw.overlay.selCount)
  check('drag-select picked the wardens', sel === 4, sel)
  await page.mouse.click(army.g.x, army.g.y, { button: 'right' })
  await page.waitForTimeout(100)
  const ordered = await page.evaluate((ids) => ids.map((id) => [__hw.units.order[id], __hw.units.mstate[id]]), army.ids)
  check('right-click issued a move order', ordered.every(([o, m]) => o !== 0 || m !== 0), ordered)
  await page.evaluate(() => __hw.tick(120))
  const arrived = await page.evaluate(({ ids, goal }) => ids.map((id) => Math.hypot(__hw.units.x[id] - goal.x, __hw.units.y[id] - goal.y)), army)
  check('wardens walked to the right-click spot', arrived.every((d) => d < 4), arrived.map((d) => +d.toFixed(2)))
  await shot('3-ui')

  // ---------------------------------------------------------------- stress
  const stress = await page.evaluate(() => {
    const r = __hw.stress({ buildings: 300, couriers: 1500 })
    __hw.pause()
    const t0 = performance.now()
    __hw.tick(200)
    const wall = (performance.now() - t0) / 200
    const s = __hw.stats()
    __hw.resume()
    return { placed: r, tickMsEma: s.tickMs, tickMsAvg: wall, units: s.units, buildings: s.buildings, jobs: s.jobs, idle: s.idle, pathQueue: s.pathQueue }
  })
  check('stress placed 300 buildings', stress.placed.buildings === 300, stress.placed)
  check('stress spawned 1500 couriers', stress.placed.couriers === 1500)
  check('stress tickMs < 3', stress.tickMsAvg < 3, stress.tickMsAvg)

  const measureFrames = () => page.evaluate(() => new Promise((resolve) => {
    const d = []
    let last = performance.now()
    const t0 = last
    const f = (now) => {
      d.push(now - last); last = now
      if (now - t0 < 2000) requestAnimationFrame(f)
      else {
        d.sort((a, b) => a - b)
        const s = __hw.stats()
        resolve({ frames: d.length, avgDelta: d.reduce((a, b) => a + b, 0) / d.length, p95Delta: d[Math.floor(d.length * 0.95)], loopFrameMs: s.frameMs, fps: s.fps, tickMs: s.tickMs })
      }
    }
    requestAnimationFrame(f)
  }))
  const frames1 = await measureFrames()
  await shot('4-stress-zoom1')
  await page.evaluate(() => { const c = __hw.camera; __hw.look(c.x, c.y, 0.25) })
  const framesFar = await measureFrames()
  await shot('5-stress-far')
  await page.evaluate(() => __hw.setSpeed(4))
  const frames4x = await measureFrames()
  results.stress = { ...stress, frames1, framesFar, frames4x }
  check('stress frame work < 16 ms at 1x', frames1.loopFrameMs < 16, frames1.loopFrameMs)

  // ---------------------------------------------------------------- invariant: stock bookkeeping
  const drift = await page.evaluate(() => {
    const ctx = __hw.ctx, B = ctx.buildings
    let bad = 0
    for (let i = 1; i < 11; i++) {
      let s = 0
      for (let b = 0; b < B.hi; b++) if (B.alive[b] && !B.site[b] && (B.type[b] === 1 || B.type[b] === 2)) s += B.inv[(b << 4) | i] - B.resOut[(b << 4) | i]
      if (s !== ctx.stock[i]) bad++
    }
    return bad
  })
  check('ctx.stock matches storage inventories', drift === 0, drift)

  // ---------------------------------------------------------------- reset replaces ctx (render/minimap/UI caches)
  const reset = await page.evaluate(async () => {
    __hw.setSpeed(1)
    const old = __hw.ctx
    __hw.reset(5)
    await new Promise((r) => setTimeout(r, 600))
    return { replaced: __hw.ctx !== old, tick: __hw.ctx.tick, buildings: __hw.buildings.count, couriers: __hw.units.typeCount[1], fallback: !!__hw.fallback }
  })
  check('reset(5) boots a fresh hamlet and keeps rendering', reset.replaced && reset.tick > 0 && reset.buildings === 3 && reset.couriers >= 8 && !reset.fallback, reset)
  await shot('6-after-reset')

  // ---------------------------------------------------------------- large map boots
  await page.goto(`http://127.0.0.1:${port}/?size=512&seed=3`, { waitUntil: 'load' })
  await page.waitForFunction(() => window.__hw && window.__hw.ctx, null, { timeout: 10000 })
  await page.waitForTimeout(1500)
  const large = await page.evaluate(() => { __hw.tick(200); const s = __hw.stats(); return { w: __hw.world.w, buildings: s.buildings, tick: s.tick, tickMs: s.tickMs, fallback: !!__hw.fallback } })
  check('512x512 map boots and ticks', large.w === 512 && large.buildings === 3 && !large.fallback, large)
  await shot('7-large-map')
} catch (err) {
  failed = true
  results.errors.push('script: ' + (err.stack || err.message))
} finally {
  if (browser) await browser.close()
  server.kill()
}

if (results.errors.length) failed = true
results.ok = !failed
console.log(JSON.stringify(results, null, 2))
process.exit(failed ? 1 : 0)
