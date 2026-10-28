// Acceptance scenario for construction sites, discard and refunds. Run by hand, NOT by
// `node --test` (like smoke.playwright.mjs):
//
//   npx vite build                               # from packages/hearthwood
//   node tests/scenario-sites.playwright.mjs     # serves dist/, drives Chromium, prints JSON
//
// The player's softlock: every storage full, no wood in storage, every Lumber Lodge's output
// full. Placing a Quarry must still work: a construction site appears, couriers carry wood
// from the LODGE straight to it, it is raised and starts producing. Demolishing it with
// storage still full overfills the Hearth (the 50% refund does not vanish), and discarding a
// stack from the Hearth makes room again.
//
// Env: PORT (default 4733), SHOTS (screenshot dir, default os.tmpdir()), CHROMIUM_PATH, HW_DIST.
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
const port = Number(process.env.PORT || 4733)
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

const server = spawn(process.execPath, [path.join(repo, 'scripts/serve.mjs'), dist], {
  env: { ...process.env, PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'],
})
await new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(new Error('server did not start')), 10000)
  server.stdout.on('data', (d) => { if (String(d).includes('Serving')) { clearTimeout(t); resolve() } })
  server.on('exit', (c) => reject(new Error('server exited ' + c)))
})

// ids from constants.js
const B_HEARTH = 1, B_LUMBER_LODGE = 3, B_QUARRY = 4
const I_WOOD = 1, I_STONE = 2
const BS_OUTPUT_FULL = 2

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
    const p = path.join(shots, `hearthwood-sites-${name}.png`)
    await page.screenshot({ path: p })
    results.shots.push(p)
  }

  await page.goto(`http://127.0.0.1:${port}/?seed=20261026&peaceful`, { waitUntil: 'load' })
  await page.waitForFunction(() => window.__hw && window.__hw.ctx, null, { timeout: 10000 })
  await page.waitForTimeout(500)

  // ---------------------------------------------------------------- 1. the softlock setup
  const setup = await page.evaluate(({ B_HEARTH, B_LUMBER_LODGE, I_WOOD, I_STONE, BS_OUTPUT_FULL }) => {
    __hw.pause()
    const ctx = __hw.ctx, B = ctx.buildings
    const h = B.typeList[B_HEARTH][0]
    const lodge = B.typeList[B_LUMBER_LODGE][0]
    const storages = () => { const out = []; for (let b = 0; b < B.hi; b++) if (B.alive[b] && !B.site[b] && (b === h || B.type[b] === 2)) out.push(b); return out }
    // no wood in storage; every storage filled to capacity (stone)
    const fill = () => {
      for (const s of storages()) {
        __hw.discard(s, I_WOOD)
        const cap = s === h ? 500 : 200
        __hw.give(s, I_STONE, cap - B.invTotal[s] - B.resInTotal[s])
      }
    }
    fill()
    // let the lodge's output fill up (the sawmill eats some wood first, then backs up too)
    let t = 0
    while (t < 8000 && !(B.status[lodge] === BS_OUTPUT_FULL && B.inv[(lodge << 4) | I_WOOD] >= 20)) { __hw.tick(10); t += 10; if (t % 200 === 0) fill() }
    fill()
    __hw.tick(1)
    const used = storages().reduce((a, s) => a + B.invTotal[s], 0)
    return {
      h, lodge, ticks: t,
      lodgeStatus: B.status[lodge], lodgeWood: B.inv[(lodge << 4) | I_WOOD],
      stockWood: ctx.stock[I_WOOD], storeUsed: used, storeCap: ctx.storeCap,
      hx: B.tx[h] + 1.5, hy: B.ty[h] + 1.5,
    }
  }, { B_HEARTH, B_LUMBER_LODGE, I_WOOD, I_STONE, BS_OUTPUT_FULL })
  check('storage full', setup.storeUsed >= setup.storeCap, { used: setup.storeUsed, cap: setup.storeCap })
  check('no wood in storage (nothing "affordable")', setup.stockWood === 0, setup.stockWood)
  check('lumber lodge output full', setup.lodgeStatus === BS_OUTPUT_FULL && setup.lodgeWood >= 20, setup)

  // ---------------------------------------------------------------- 2. place a Quarry with hotkey 2 + click
  const cands = await page.evaluate(({ hx, hy }) => {
    __hw.look(hx, hy, 1)
    const w = __hw.world, cam = __hw.camera, out = []
    const cx = cam.x | 0, cy = cam.y | 0
    for (let ty = cy - 10; ty <= cy + 10; ty++) for (let tx = cx - 16; tx <= cx + 16; tx++) {
      if (!w.areaFree(tx, ty, 2, 2)) continue
      const d = w.doorTile(4, tx, ty)
      if (d < 0 || !w.walkable(d) || w.occ[d] >= 0) continue
      if (w.countResource(tx, ty, 2, 2, 2, 2) <= 0) continue
      const s = cam.worldToScreen(tx + 1, ty + 1, { x: 0, y: 0 })
      if (s.x < 300 || s.y < 140 || s.x > 1000 || s.y > 560) continue
      out.push({ tx, ty, sx: s.x, sy: s.y, d: (tx - cx) ** 2 + (ty - cy) ** 2 })
    }
    out.sort((a, b) => a.d - b.d)
    return out.slice(0, 12)
  }, setup)
  check('quarry spot on rock in view', cands.length > 0, cands.length)
  await page.waitForTimeout(150)
  await page.mouse.move(640, 400)
  await page.keyboard.press('Digit2')
  let spot = null
  for (const c of cands) {
    await page.mouse.move(c.sx, c.sy)
    await page.waitForTimeout(40)
    const g = await page.evaluate(() => ({ t: __hw.overlay.ghostType, r: __hw.overlay.ghostReason }))
    if (g.t === B_QUARRY && g.r === 0) { spot = c; break }
  }
  check('ghost is valid with zero wood in storage (no cost reason)', !!spot)
  if (spot) await page.mouse.click(spot.sx, spot.sy)
  await page.waitForTimeout(100)
  const placed = await page.evaluate(({ B_QUARRY, I_WOOD }) => {
    const B = __hw.buildings
    const q = B.typeList[B_QUARRY][B.typeCount[B_QUARRY] - 1]
    return { q, site: q >= 0 ? B.site[q] : -1, stockWood: __hw.ctx.stock[I_WOOD], ghost: __hw.overlay.ghostType,
      toasts: Array.from(document.querySelectorAll('#toasts .toast')).map((t) => t.textContent) }
  }, { B_QUARRY, I_WOOD })
  check('a construction site appears', placed.q >= 0 && placed.site === 1, placed)
  check('nothing was paid', placed.stockWood === 0)

  // select the site (click its footprint) so its panel is open
  await page.mouse.click(spot.sx, spot.sy)
  await page.waitForTimeout(120)

  // ---------------------------------------------------------------- 3. couriers bring wood from the lodge
  const supply = await page.evaluate(({ q, lodge, I_WOOD }) => {
    const B = __hw.buildings, U = __hw.units
    let lodgeJobs = 0, storageJobs = 0, t = 0, shotAt = -1
    const seen = new Set()
    while (t < 3000 && B.site[q]) {
      __hw.tick(1); t++
      for (let u = 0; u < U.hi; u++) {
        if (!U.alive[u] || U.job[u] === 0 || U.jobDst[u] !== q || seen.has(u * 100000 + U.jobSrcGen[u] + U.jobSrc[u] * 7)) continue
        if (U.job[u] !== 1) continue // count each job once, as it is assigned (J_TO_PICKUP)
        seen.add(u * 100000 + U.jobSrcGen[u] + U.jobSrc[u] * 7)
        if (U.jobSrc[u] === lodge) lodgeJobs++
        else if (B.type[U.jobSrc[u]] === 1 || B.type[U.jobSrc[u]] === 2) storageJobs++
      }
      // stop midway so the screenshot shows wood on its way (couriers carrying, "+N" incoming)
      if (shotAt < 0 && B.resIn[(q << 4) | I_WOOD] > 0 && U.job.some((j, u) => U.alive[u] && j === 3 && U.jobDst[u] === q)) {
        let near = false
        for (let u = 0; u < U.hi; u++) {
          if (U.alive[u] && U.job[u] === 3 && U.jobDst[u] === q && Math.abs(U.x[u] - B.tx[q] - 1) + Math.abs(U.y[u] - B.ty[q] - 1) < 9) near = true
        }
        if (near) { shotAt = t; break }
      }
    }
    return { lodgeJobs, storageJobs, t, delivered: B.inv[(q << 4) | I_WOOD], incoming: B.resIn[(q << 4) | I_WOOD], site: B.site[q] }
  }, { q: placed.q, lodge: setup.lodge, I_WOOD })
  await page.evaluate(({ q }) => { const B = __hw.buildings; __hw.look(B.tx[q] + 1, B.ty[q] + 1, 1.6) }, { q: placed.q })
  await page.waitForTimeout(400)
  const panel = await page.evaluate(() => ({ head: document.querySelector('#selpanel .sel-head')?.textContent || '', body: document.querySelector('#selpanel .sel-body')?.textContent || '', hidden: document.getElementById('selpanel').hidden }))
  check('site panel open with title + delivered/needed', !panel.hidden && /Construction site — Quarry/.test(panel.head) && /Cancel/.test(panel.head) && /\/15/.test(panel.body), panel)
  check('panel shows incoming deliveries', /\+\d+/.test(panel.body), panel.body)
  await shot('1-site-under-construction')
  // and again once wood has arrived (raising)
  const arrived = await page.evaluate(({ q, I_WOOD }) => {
    const B = __hw.buildings
    let t = 0
    while (t < 2000 && B.site[q] && B.inv[(q << 4) | I_WOOD] < 15) { __hw.tick(1); t++ }
    return { t, wood: B.inv[(q << 4) | I_WOOD], site: B.site[q] }
  }, { q: placed.q, I_WOOD })
  supply.t += arrived.t
  await page.waitForTimeout(400)
  await shot('1b-site-raising')
  const done = await page.evaluate(({ q, lodge, I_WOOD }) => {
    const B = __hw.buildings, U = __hw.units
    let t = 0, lodgeJobs = 0
    while (t < 3000 && B.site[q]) {
      __hw.tick(1); t++
      for (let u = 0; u < U.hi; u++) if (U.alive[u] && U.job[u] === 1 && U.jobDst[u] === q && U.jobSrc[u] === lodge) lodgeJobs++
    }
    const built = { site: B.site[q], alive: B.alive[q], t, lodgeJobs, invWood: B.inv[(q << 4) | I_WOOD] }
    let p = 0
    while (p < 600 && !(B.progress[q] > 0 || B.inv[(q << 4) | 2] > 0)) { __hw.tick(1); p++ }
    built.producing = B.progress[q] > 0 || B.inv[(q << 4) | 2] > 0
    __hw.tick(80)
    built.stone = B.inv[(q << 4) | 2]
    return built
  }, { q: placed.q, lodge: setup.lodge, I_WOOD })
  const totalTicks = supply.t + done.t
  check('couriers carried wood from the LODGE output to the site', supply.lodgeJobs > 0 && supply.storageJobs === 0, supply)
  check('site completed within 1500 ticks', done.site === 0 && done.alive === 1 && totalTicks <= 1500, { ...done, totalTicks })
  check('the quarry starts producing', done.producing && done.stone >= 1, done)
  await page.waitForTimeout(300)
  const toastsBuilt = await page.evaluate(() => Array.from(document.querySelectorAll('#toasts .toast')).map((t) => t.textContent))
  check('HUD toasts "Quarry raised"', toastsBuilt.some((t) => /Quarry raised/.test(t)), toastsBuilt)
  await shot('2-quarry-raised')

  // ---------------------------------------------------------------- 4. demolish with storage still full
  const pre = await page.evaluate(({ h, I_WOOD }) => ({ hearthTotal: __hw.buildings.invTotal[h], wood: __hw.ctx.stock[I_WOOD], storeCap: __hw.ctx.storeCap }), { h: setup.h, I_WOOD })
  check('storage still full before demolishing', pre.hearthTotal >= 500, pre)
  await page.evaluate(({ q }) => { const B = __hw.buildings; __hw.look(B.tx[q] + 1, B.ty[q] + 1, 1.6) }, { q: placed.q })
  await page.waitForTimeout(150)
  const qScreen = await page.evaluate(({ q }) => { const B = __hw.buildings; return __hw.camera.worldToScreen(B.tx[q] + 1, B.ty[q] + 1, { x: 0, y: 0 }) }, { q: placed.q })
  await page.mouse.click(qScreen.x, qScreen.y)
  await page.waitForTimeout(150)
  const selQ = await page.evaluate(() => __hw.overlay.selBuilding)
  check('quarry selected', selQ === placed.q, selQ)
  await page.keyboard.press('Delete')
  await page.waitForTimeout(250)
  const post = await page.evaluate(({ h, q, I_WOOD }) => ({
    alive: __hw.buildings.alive[q], hearthTotal: __hw.buildings.invTotal[h], wood: __hw.ctx.stock[I_WOOD],
    refund: Array.from(__hw.ctx.lastRefund), cap: document.querySelector('#stock .stock-cap')?.textContent,
    capOver: document.querySelector('#stock .stock-cap')?.classList.contains('over'),
    toasts: Array.from(document.querySelectorAll('#toasts .toast')).map((t) => t.textContent),
  }), { h: setup.h, q: placed.q, I_WOOD })
  check('quarry demolished', post.alive === 0)
  // +7 wood (50% of 15) plus the quarry's own unreserved output (stone), all into the Hearth
  const refunded = post.refund.reduce((a, n) => a + n, 0)
  check('50% refund landed (overfilling the Hearth)', post.wood === pre.wood + 7 && refunded >= 7 && post.hearthTotal === pre.hearthTotal + refunded, { pre, post: { wood: post.wood, hearthTotal: post.hearthTotal, refunded } })
  check('demolish toast lists the refund', post.toasts.some((t) => /Quarry demolished: \+7 Heartwood/.test(t)), post.toasts)
  check('HUD storage figure shows the overfill, tinted', post.capOver === true && /^\d+ \/ \d+$/.test(post.cap || '') && Number(post.cap.split(' / ')[0]) > Number(post.cap.split(' / ')[1]), post.cap)

  // ---------------------------------------------------------------- 5. discard a stack from the Hearth
  await page.evaluate(({ hx, hy }) => __hw.look(hx, hy + 2, 1.3), setup)
  await page.waitForTimeout(150)
  const hScreen = await page.evaluate(({ hx, hy }) => __hw.camera.worldToScreen(hx, hy, { x: 0, y: 0 }), setup)
  await page.mouse.click(hScreen.x, hScreen.y)
  await page.waitForTimeout(350)
  const btn = await page.$('#selpanel [data-act="discard"][data-item="2"]')
  check('Hearth panel shows a discard control on the stone stack', !!btn)
  const title = btn ? await btn.getAttribute('title') : ''
  check('discard control states how many it destroys', /^Discard \d+ Mossstone/.test(title || ''), title)
  await shot('3-hearth-overfilled-discard')
  const preD = await page.evaluate(({ h, I_STONE }) => ({ stone: __hw.ctx.stock[I_STONE], total: __hw.buildings.invTotal[h], resOut: __hw.buildings.resOut[(h << 4) | I_STONE] }), { h: setup.h, I_STONE })
  if (btn) await btn.click()
  await page.waitForTimeout(300)
  const postD = await page.evaluate(({ h, I_STONE }) => ({
    stone: __hw.ctx.stock[I_STONE], total: __hw.buildings.invTotal[h], cap: __hw.ctx.storeCap, inv: __hw.buildings.inv[(h << 4) | I_STONE],
    resOut: __hw.buildings.resOut[(h << 4) | I_STONE],
    toasts: Array.from(document.querySelectorAll('#toasts .toast')).map((t) => t.textContent),
  }), { h: setup.h, I_STONE })
  check('discard destroyed the unreserved stone stack', postD.stone === 0 && postD.inv === postD.resOut && postD.inv === preD.resOut, { preD, postD })
  check('room appeared in storage', postD.total < 500, postD.total)
  check('a toast confirms the discard', postD.toasts.some((t) => /Discarded \d+ Mossstone/.test(t)), postD.toasts)
  // couriers resume delivering into the freed room
  const resume = await page.evaluate(({ h, I_WOOD }) => { const w0 = __hw.buildings.inv[(h << 4) | I_WOOD]; __hw.tick(600); return { w0, w1: __hw.buildings.inv[(h << 4) | I_WOOD] } }, { h: setup.h, I_WOOD })
  check('goods flow into storage again', resume.w1 > resume.w0, resume)
  await page.waitForTimeout(200)
  await shot('4-after-discard')

  // bookkeeping
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
