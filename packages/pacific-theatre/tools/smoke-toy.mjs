// The toy's smoke test (TOY.md §5): a scripted bot (it steers at the nearest
// target, fires when its nose is on, drops when the bracket says Drop!)
// plays both sides to the end screen.
//
// First in node, on src/toy/game.js and the real kits (no browser, a game
// in about a second): the waves and the battleship arrive on time, there are
// never more than 12 enemy aircraft or 6 ships, the end screen's numbers
// agree with what happened, and TOY.md §2's measures (the first enemy in
// sight, the first hit, the first explosion, the longest gap without a
// target in view) for the bot and for a clumsier one.
//
// Then in the browser, on the built app with the real data under SwiftShader
// (a frame a second there: the frame time is measured, the feel is judged
// from the bot's log and the screenshots): a box event's card offers three
// doors in a row and *Arcade* opens the toy's start screen with #toy and
// #side in the hash; United States plays to the end with the pictures taken
// on the way (the start, the first dogfight, a bombing run, a sinking, the
// battleship with her turrets, the end screen); the end screen's numbers and
// the high score kept; *Other side* plays Japan to the end; Leave gives the
// table back; no console errors; the frame time and the heap.
//
// Last, the phone: #toy=samar&side=us on a touch page at the six sizes
// tools/smoke.mjs uses (360×780, 390×844, 412×915, 412×720 upright, 844×390
// and 915×412 on its side): the start card on the screen, then the HUD and
// the touch controls (early in a game, and with the boss bar, the combo and
// a warning up), no two overlapping by more than 2 px and none off screen.
//
//   npm run build -w @vibe-dump/pacific-theatre
//   node tools/smoke-toy.mjs              (PART=node|browser|phone runs one part)
//   CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome (the default)

import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, normalize, extname } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const PART = process.env.PART || 'all'
const shots = join(root, 'tools/shots')
mkdirSync(shots, { recursive: true })
let failed = 0
const check = async (name, fn) => {
  try {
    const note = await fn()
    console.log('  ✓', name + (note ? ` — ${note}` : ''))
  } catch (err) {
    failed++
    console.log('  ✗', name, '—', err.message.split('\n')[0])
  }
}
const expect = (ok, msg) => {
  if (!ok) throw new Error(msg)
}
const report = { when: new Date().toISOString(), browser: {} }

// The bot, as a function's source (it runs in node and in the page alike). It flies at the nearest enemy (a ship
// counts 150 m further, so the fighters come first), at a ship's open weak point when she has one; low for the
// torpedo and higher for bombs; fires with its nose on; drops when the bracket says Drop!; and when it overshoots a
// ship it extends away and comes round again. CLUMSY=true weaves, turns lazily and fires in bursts.
const BOT = `(w) => {
  const clumsy = !!w.clumsy
  const me = w.me
  if (!me || me.alive !== 1) return { sx: 0, sy: 0, fire: false, drop: 0 }
  const wrap = (a) => a - Math.PI * 2 * Math.floor((a + Math.PI) / (Math.PI * 2))
  let best = null
  let bd = 1e9
  for (const th of w.things) {
    if (!th.enemy || th.alive !== 1) continue
    const d = Math.hypot(th.x - me.x, th.z - me.z) + (th.kind === 'ship' ? 150 : 0)
    if (d < bd) { bd = d; best = th }
  }
  if (!best) return { sx: Math.sin(w.t * 0.3) * 0.3, sy: (90 - me.y) / 80, fire: false, drop: 0 }
  let P = best
  if (best.points) { const p = best.points.find((p) => p.open && p.hp > 0); if (p) P = w.pointOf(best, p) }
  const diff = wrap(Math.atan2(P.x - me.x, -(P.z - me.z)) - me.yaw)
  const ty = best.kind === 'ship' ? (w.ammo.torpedo ? 30 : 75) : best.y
  const d = Math.hypot(P.x - me.x, P.y - me.y, P.z - me.z)
  if (best.kind === 'ship') {
    const dh = Math.hypot(P.x - me.x, P.z - me.z)
    if (w.botExt && (dh > 300 || w.t > w.botExt)) w.botExt = 0
    if (!w.botExt && dh < 140 && Math.abs(diff) > 0.6) w.botExt = w.t + 5
    if (w.botExt) return { sx: 0, sy: Math.max(-1, Math.min(1, (ty - me.y) / 40)), fire: false, drop: 0 }
  }
  let drop = 0
  const lk = w.lock
  if (lk && lk.locked && lk.inRange && w.t > (w.botDrop || 0)) { drop = 1; w.botDrop = w.t + 1 }
  if (clumsy) {
    const wob = Math.sin(w.t * 0.7) * 0.6
    return { sx: Math.max(-1, Math.min(1, diff * 1.2 + wob)), sy: Math.max(-1, Math.min(1, (ty - me.y) / 60)), fire: Math.abs(diff) < 0.3 && d < 450 && Math.sin(w.t * 2) > -0.3, drop }
  }
  return { sx: Math.max(-1, Math.min(1, diff * 2.5)), sy: Math.max(-1, Math.min(1, (ty - me.y) / 40)), fire: Math.abs(diff) < 0.25 && d < 500, drop }
}`

const WAVES = [0.4, 30, 60, 90, 120]
const r1 = (v) => (v == null ? null : +v.toFixed(1))

/** The checks on one finished game: its log (wave, sunk, shotdown, lost, point-out, over), its results, its world. */
function judge(side, log, res, w, { maxF = 0, maxS = 0 } = {}) {
  const waves = log.filter((e) => e.type === 'wave').map((e) => e.t)
  expect(waves.length === 5, `${side}: ${waves.length} waves, want 5`)
  waves.forEach((t, i) => expect(Math.abs(t - WAVES[i]) < 0.1, `${side}: wave ${i + 1} at ${t} s, want ${WAVES[i]}`))
  expect(w.boss, `${side}: no battleship`)
  const over = log.find((e) => e.type === 'over')
  expect(over && over.t <= 180.05, `${side}: no end by 3:00 (${over?.t})`)
  const downs = log.filter((e) => e.type === 'shotdown').length
  const sinks = log.filter((e) => e.type === 'sunk').length
  expect(res.downed === downs, `${side}: end screen says ${res.downed} shot down, the log ${downs}`)
  expect(res.sunk === sinks, `${side}: end screen says ${res.sunk} sunk, the log ${sinks}`)
  const shots = w.stats.shots || 0
  const acc = shots ? Math.round(((w.stats.hits || 0) / shots) * 100) : 0
  expect(res.accuracy === acc && acc >= 0 && acc <= 100, `${side}: accuracy ${res.accuracy}, want ${acc}`)
  expect(res.combo >= 1 && res.combo <= 5, `${side}: best combo ×${res.combo}`)
  expect(res.score > 0, `${side}: no score`)
  if (maxF) expect(maxF <= 12 && maxS <= 6, `${side}: ${maxF} aircraft and ${maxS} ships at once`)
  return { reason: res.reason, t: over.t, score: res.score, downed: res.downed, sunk: res.sunk, accuracy: res.accuracy, combo: res.combo, lost: res.lost, turretsOut: log.filter((e) => e.type === 'point-out').length }
}

/** The end screen's numbers as Toy.results makes them (the browser's are compared with these). */
function results(w, side) {
  const shots = w.stats.shots || 0
  return { reason: w.over?.reason ?? 'time', side, score: w.score || 0, combo: w.combo?.best ?? 1, sunk: w.sunk || 0, downed: w.downed || 0, accuracy: shots ? Math.round(((w.stats.hits || 0) / shots) * 100) : 0, lost: w.lost || 0 }
}

const feel = (w) => ({ firstSight: r1(w.stats.firstSight), firstHit: r1(w.stats.firstHit), firstExplosion: r1(w.stats.firstExplosion), longestGap: r1(w.stats.longestGap), longestGapAt: r1(w.stats.longestGapAt) })

// ---------------------------------------------------------------------------------------------
if (PART === 'all' || PART === 'node') {
  console.log('the toy in node (src/toy/game.js, the real kits)')
  const { newGame, modelsFor } = await import('../src/toy/game.js')
  const { SIDES } = await import('../src/toy/sides.js')
  const kits = {}
  for (const f of ['ships', 'aircraft']) {
    const j = JSON.parse(readFileSync(join(root, `public/data/kits/${f}.json`), 'utf8'))
    for (const k of j[f] || j) kits[k.id] = k
  }
  const bot = (0, eval)(BOT)
  const play = (side, { seed = 7, clumsy = false } = {}) => {
    const S = SIDES[side]
    const w = newGame(S, kits, { models: modelsFor(S, kits), seed })
    w.clumsy = clumsy
    const log = []
    let maxF = 0
    let maxS = 0
    const t0 = performance.now()
    for (let i = 0; i < 60 * 200 && !w.over; i++) {
      const inp = bot(w)
      w.input.sx = inp.sx
      w.input.sy = inp.sy
      w.input.fire = inp.fire
      w.input.drop += inp.drop
      w.step(1 / 60)
      for (const e of w.events) if (['wave', 'sunk', 'shotdown', 'lost', 'point-out', 'over'].includes(e.type)) log.push({ type: e.type, t: +e.t.toFixed(2), role: e.th?.role })
      w.events.length = 0
      maxF = Math.max(maxF, w.things.filter((t) => t.role === 'fighter' && t.alive === 1).length)
      maxS = Math.max(maxS, w.things.filter((t) => t.kind === 'ship' && t.enemy && t.alive === 1).length)
    }
    return { w, log, maxF, maxS, ms: Math.round(performance.now() - t0) }
  }
  report.node = {}
  for (const side of ['us', 'jp']) {
    await check(`${side}: the bot plays to the end screen; five waves on time, the battleship at 2:00, at most 12 aircraft and 6 ships, the end screen's numbers agree with the game`, async () => {
      const g = play(side)
      const j = judge(side, g.log, results(g.w, side), g.w, g)
      const f = feel(g.w)
      report.node[side] = { ...j, ...f, maxAircraft: g.maxF, maxShips: g.maxS, ms: g.ms, log: g.log.filter((e) => e.type !== 'shotdown') }
      return `${j.reason} at ${j.t} s, ${j.score} points, ${j.downed} shot down, ${j.sunk} sunk, ${j.turretsOut} weak points out, accuracy ${j.accuracy} %, ×${j.combo}, ${j.lost} lost (${g.ms} ms)`
    })
    await check(`${side}: TOY.md §2's clock (the bot): the first enemy in sight within 5 s, the first hit within 10, the first explosion within 20, never more than 5 s without a target in view`, async () => {
      const f = feel(play(side).w)
      expect(f.firstSight <= 5 && f.firstHit <= 10 && f.firstExplosion <= 20, JSON.stringify(f))
      expect(f.longestGap <= 5, `the longest gap ${f.longestGap} s (from ${f.longestGapAt} s)`)
      return `in sight ${f.firstSight} s, hit ${f.firstHit} s, explosion ${f.firstExplosion} s, longest gap ${f.longestGap} s`
    })
    await check(`${side}: a clumsier bot (weaving, lazy turns, bursts) still reaches the battleship and an end screen`, async () => {
      const g = play(side, { clumsy: true, seed: 11 })
      const j = judge(side, g.log, results(g.w, side), g.w, g)
      report.node[`${side}-clumsy`] = { ...j, ...feel(g.w), carrier: Math.round(g.w.carrier.hp) }
      return `${j.reason} at ${j.t} s, ${j.score} points, ${j.downed} shot down, ${j.sunk} sunk, ${j.turretsOut} weak points out, carrier at ${Math.round(g.w.carrier.hp)} of ${g.w.carrier.hpMax}, ${j.lost} lost`
    })
  }
}

// ---------------------------------------------------------------------------------------------
if (PART === 'all' || PART === 'browser' || PART === 'phone') {
  const { chromium } = await import('playwright')
  if (!existsSync(join(root, 'dist/index.html'))) throw new Error('no dist/: run npm run build -w @vibe-dump/pacific-theatre first')
  const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.geojson': 'application/geo+json', '.png': 'image/png', '.woff2': 'font/woff2' }
  const port = Number(process.env.PORT || 5299)
  const server = createServer(async (req, res) => {
    let f = normalize(join(root, decodeURIComponent(req.url.split('?')[0])))
    if (!f.startsWith(root)) return res.writeHead(403).end()
    if ((await stat(f).catch(() => null))?.isDirectory()) f = join(f, 'index.html')
    const body = await readFile(f).catch(() => null)
    if (!body) return res.writeHead(404).end('not found')
    res.writeHead(200, { 'Content-Type': MIME[extname(f)] || 'application/octet-stream' }).end(body)
  })
  await new Promise((r) => server.listen(port, '127.0.0.1', r))
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
  const errors = []
  const listen = (p, tag) => {
    p.on('pageerror', (e) => errors.push(`${tag}pageerror: ${e.message}`))
    p.on('console', (m) => m.type() === 'error' && errors.push(`${tag}console: ${m.text()}`))
  }
  const URL0 = `http://127.0.0.1:${port}/dist/index.html`
  const helpers = (page) => {
    const run = (body) => page.evaluate(new Function(`const app = window.__app; const toy = app.toy; return (async () => { ${body} })()`))
    const frames = async (n) => {
      const f0 = await page.evaluate(() => window.__app.frames)
      await page.waitForFunction((f) => window.__app.frames >= f, f0 + n, { timeout: 180000 })
    }
    /** Step the game (the bot steering) until `until` or `s` seconds; then draw two frames with the game held, for a picture. */
    const sim = async (s, until = 'false') => {
      await run(`toy.running = true; toy.simulate(${s}, toy.bot, (w, toy) => (${until})); toy.running = false; toy.scene.chase.snap = true`)
      await frames(2)
    }
    return { run, frames, sim }
  }

  if (PART !== 'phone') {
    console.log('the toy in the built app (the real data, SwiftShader)')
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
    listen(page, '')
    const { run, frames, sim } = helpers(page)
    const shot = (name) => page.screenshot({ path: join(shots, `toy-${name}.png`) })
    await page.goto(URL0)
    await page.waitForSelector('#boot', { state: 'detached', timeout: 180000 })
    await page.waitForFunction(() => window.__app?.ready, null, { timeout: 120000 })
    await page.evaluate(() => localStorage.removeItem('pt.toy.best'))
    await check("a box event's card offers three doors in a row: Enter the battle, Play it as a wargame, Arcade", async () => {
      await run(`app.ui.openEvent(app.data.events.find((e) => e.box === 'samar'))`)
      await frames(2)
      const doors = await page.$$eval('.card footer .enter, .card footer .wg-door, .card footer .toy-door', (bs) => bs.map((b) => ({ t: b.textContent.trim(), top: Math.round(b.getBoundingClientRect().top), w: b.scrollWidth - b.clientWidth })))
      await shot('card')
      expect(doors.map((d) => d.t).join('|') === 'Enter the battle|Play it as a wargame|Arcade', doors.map((d) => d.t).join('|'))
      expect(new Set(doors.map((d) => d.top)).size === 1, `not one row: ${doors.map((d) => d.top)}`)
      const other = await run(`app.ui.openEvent(app.data.events.find((e) => e.box === 'midway')); await new Promise((r) => setTimeout(r, 300)); return [...document.querySelectorAll('.card footer .nav')].map((b) => b.textContent.trim()).join('|')`)
      expect(/Arcade/.test(other), `Midway's card: ${other}`)
      await run(`app.ui.openEvent(app.data.events.find((e) => e.box === 'samar'))`)
      return `one line; Midway's card: ${other}`
    })
    await check('Arcade opens the toy: the start screen over Samar, United States focused, the label, #toy=samar&side=us', async () => {
      await page.click('.card footer .toy-door')
      await page.waitForFunction(() => window.__app.toy?.active && window.__app.mode === 'moment' && document.querySelector('.toy-start'), null, { timeout: 240000 })
      await frames(3)
      await shot('start')
      const s = await run(`return { hash: location.hash, focus: document.querySelector('.toy-start .side.focus')?.dataset.side, label: document.querySelector('.toy-label')?.textContent, active: app.active === toy.scene, table: !!document.querySelector('#ui') && getComputedStyle(document.querySelector('#ui')).display }`)
      expect(/toy=samar/.test(s.hash) && /side=us/.test(s.hash), s.hash)
      expect(s.focus === 'us' && s.label === 'A toy, not the record.' && s.active, JSON.stringify(s))
      return `${s.hash}; the table's interface ${s.table === 'none' ? 'stands aside' : 'shows'}`
    })
    let perf = null
    await check('United States: a game starts on the click; the frame time and the heap while it runs', async () => {
      await page.click('.toy-start button[data-side="us"]')
      await page.evaluate(`window.__app.toy.bot = ${BOT}`)
      await page.waitForFunction(() => window.__app.toy.running && window.__app.toy.world.t > 0, null, { timeout: 60000 })
      const cdp = await page.context().newCDPSession(page)
      await cdp.send('HeapProfiler.collectGarbage')
      const heap = await cdp.send('Runtime.getHeapUsage')
      const ms = await page.evaluate(
        (n) =>
          new Promise((resolve) => {
            const app = window.__app
            const f0 = app.frames + 1
            let t0 = 0
            const tick = () => {
              if (!t0 && app.frames >= f0) t0 = performance.now()
              if (t0 && app.frames >= f0 + n) return resolve(+((performance.now() - t0) / n).toFixed(1))
              requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
          }),
        6,
      )
      const st = await run(`return app.stats()`)
      perf = { frameMs: ms, calls: st.calls, triangles: st.triangles, programs: st.programs, textures: st.textures, heapMB: +(heap.usedSize / 1048576).toFixed(1), gpu: st.gpu }
      report.perf = perf
      return JSON.stringify(perf)
    })
    await check('the first dogfight: a fighter in front of the nose within the first seconds, brackets and the reticle on screen', async () => {
      await sim(8, `w.t > 1.5 && w.things.some((t) => t.role === 'fighter' && t.alive === 1 && Math.hypot(t.x - w.me.x, t.z - w.me.z) < 220)`)
      await shot('dogfight')
      const s = await run(`return { t: toy.world.t, marks: document.querySelectorAll('.toy-mark.aircraft').length, hit: toy.world.stats.firstHit }`)
      expect(s.marks >= 1, `no bracket on a fighter at ${s.t.toFixed(1)} s`)
      return `at ${s.t.toFixed(1)} s, ${s.marks} bracketed`
    })
    await check('a bombing run: a ship locked, a bomb or the torpedo on its way', async () => {
      await sim(90, `w.lock?.locked && w.lock.th && Math.abs(((Math.atan2(w.lock.th.x - w.me.x, -(w.lock.th.z - w.me.z)) - w.me.yaw + 9.42478) % 6.28319) - 3.14159) < 0.35 && w.shots.some((s) => s.by === 'me' && (s.kind === 'bomb' || s.kind === 'torpedo') && s.age > 0.3)`)
      await shot('bombing')
      const s = await run(`const w = toy.world; return { t: w.t, locked: !!w.lock?.locked, ord: w.shots.filter((s) => s.by === 'me' && s.kind !== 'bullet').map((s) => s.kind), lock: getComputedStyle(document.querySelector('.toy-lock')).display, text: document.querySelector('.toy-lock span').textContent }`)
      expect(s.ord.length, `nothing dropped by ${s.t.toFixed(1)} s`)
      return `at ${s.t.toFixed(1)} s: ${s.ord.join(', ')}; the bracket ${s.lock === 'none' ? 'off screen' : `says “${s.text}”`}`
    })
    await check('a sinking: SUNK!, the slow-motion second and the cut to her', async () => {
      await sim(90, `!!toy.pendingSunk`)
      const s = await run(`const e = toy.pendingSunk; const ok = toy.showSunk(); toy.running = false; return { ok, role: e?.th?.role, t: toy.world.t, slow: toy.slow.until > toy.realT, cut: !!toy.scene.chase.cutTo }`)
      expect(s.ok && s.slow && s.cut, JSON.stringify(s))
      await frames(2)
      await shot('sinking')
      return `a ${s.role} at ${s.t.toFixed(1)} s`
    })
    await check('the battleship at 2:00: the boss bar with her three turrets and the magazine, glowing weak points on her', async () => {
      await sim(125, `w.t >= 124`)
      // (the picture: the player put 300 m off her beam, facing her, so her turrets are in the frame)
      const s = await run(`const w = toy.world; const b = w.boss; toy.scene.chase.cutTo = null; if (!b) return { boss: false, t: w.t }; const me = w.me; const side = Math.cos(b.yaw), sz = Math.sin(b.yaw); Object.assign(me, { alive: 1, down: false, x: b.x + side * 300, z: b.z + sz * 300, y: 70, pitch: -0.12, roll: 0 }); me.yaw = Math.atan2(b.x - me.x, -(b.z - me.z)); toy.scene.chase.snap = true; return { boss: true, t: w.t, name: b.name, segs: document.querySelectorAll('.toy-boss-bar span').length }`)
      expect(s.boss, `no battleship at ${s.t}`)
      await run(`toy.world.writeState()`)
      await frames(3)
      await shot('boss')
      const pts = await page.$$eval('.toy-mark.point', (m) => m.filter((e) => e.style.display !== 'none').length)
      const segs = await page.$$eval('.toy-boss-bar span', (m) => m.length)
      expect(segs === 4, `${segs} boss-bar segments`)
      expect(pts >= 2, `${pts} weak points marked`)
      return `${s.name} at ${s.t.toFixed(1)} s, ${segs} segments, ${pts} weak points glowing`
    })
    let usRes = null
    await check("the end screen: by 3:00, its numbers agree with the game's, the high score kept", async () => {
      await sim(200)
      await page.waitForSelector('.toy-end', { timeout: 30000 })
      await frames(2)
      await shot('end')
      const s = await run(`const r = toy.lastResults; const dd = [...document.querySelectorAll('.toy-nums-end dd')].map((d) => d.textContent); return { r, big: document.querySelector('.toy-big').textContent, dd, best: JSON.parse(localStorage.getItem('pt.toy.best') || '{}'), log: toy.log, stats: toy.world.stats, over: toy.world.over, boss: !!toy.world.boss }`)
      usRes = s
      const j = judge('us', s.log, s.r, { boss: s.boss, stats: s.stats })
      expect(s.big === String(s.r.score), `the card says ${s.big}, the game ${s.r.score}`)
      expect(s.dd.join('|') === [`×${s.r.combo}`, s.r.sunk, s.r.downed, `${s.r.accuracy}%`].join('|'), s.dd.join('|'))
      expect(s.best.us === s.r.score, `kept ${JSON.stringify(s.best)}`)
      report.browser.us = j
      return `${j.reason} at ${j.t} s: ${s.r.score} points (kept), ×${s.r.combo}, ${s.r.sunk} sunk, ${s.r.downed} shot down, ${s.r.accuracy} %`
    })
    await check('Other side: Japan, a Zero over Akagi, plays to the end the same way', async () => {
      await page.click('.toy-end button[data-act="other"]')
      await page.waitForFunction(() => window.__app.toy.side === 'jp' && window.__app.toy.running, null, { timeout: 60000 })
      await frames(2)
      await shot('jp-start')
      await sim(200)
      await page.waitForSelector('.toy-end', { timeout: 30000 })
      await frames(2)
      await shot('jp-end')
      const s = await run(`return { r: toy.lastResults, log: toy.log, stats: toy.world.stats, boss: toy.world.boss?.name, hash: location.hash, player: toy.world.kits[0].id, carrier: toy.world.kits[2].id }`)
      const j = judge('jp', s.log, s.r, { boss: s.boss, stats: s.stats })
      expect(s.player === 'a6m2' && s.carrier === 'akagi' && s.boss === 'Washington', JSON.stringify(s))
      expect(/side=jp/.test(s.hash), s.hash)
      report.browser.jp = j
      return `${j.reason} at ${j.t} s: ${s.r.score} points, ${s.r.downed} shot down, ${s.r.sunk} sunk; ${s.hash}`
    })
    await check('Leave gives the table back: its scene and mode, the hash without #toy, the toy gone', async () => {
      await page.click('.toy-end button[data-act="leave"]')
      await page.waitForFunction(() => !window.__app.toy.active && window.__app.mode === 'table', null, { timeout: 60000 })
      await frames(3)
      await shot('left')
      const s = await run(`return { active: app.active === app.table, hash: location.hash, el: !!document.querySelector('.toy'), on: document.body.classList.contains('toy-on') }`)
      expect(s.active && !/toy=/.test(s.hash) && !s.el && !s.on, JSON.stringify(s))
      return s.hash
    })
    await check('#toy=midway&side=jp offers the start screen with Japan focused, and Back leaves it', async () => {
      await run(`app.ui.card.close(); history.pushState(null, '', '#toy=midway&side=jp'); dispatchEvent(new HashChangeEvent('hashchange'))`)
      await page.waitForFunction(() => window.__app.toy?.active && document.querySelector('.toy-start'), null, { timeout: 240000 })
      const f = await run(`return { focus: document.querySelector('.toy-start .side.focus')?.dataset.side, running: toy.running, box: toy.boxId }`)
      expect(f.focus === 'jp' && !f.running && f.box === 'midway', JSON.stringify(f))
      await page.goBack()
      await page.waitForFunction(() => !window.__app.toy.active, null, { timeout: 60000 })
      return JSON.stringify(f)
    })
    await page.close()
  }

  if (PART !== 'browser') {
    console.log('the toy on a phone')
    const SIZES = [[360, 780], [390, 844], [412, 915], [412, 720], [844, 390], [915, 412]]
    const pp = await browser.newPage({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
    listen(pp, 'phone: ')
    const { run, frames, sim } = helpers(pp)
    await pp.goto(`${URL0}#toy=samar&side=us`)
    await pp.waitForSelector('#boot', { state: 'detached', timeout: 180000 })
    await pp.waitForFunction(() => window.__app?.toy?.active && document.querySelector('.toy-start'), null, { timeout: 240000 })
    const MEASURE = () => {
      const W = innerWidth
      const H = innerHeight
      const shown = (el) => {
        for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
          const cs = getComputedStyle(e)
          if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) < 0.05 || e.hidden) return false
        }
        return true
      }
      const items = []
      const add = (name, el) => {
        if (!el || !shown(el)) return
        const r = el.getBoundingClientRect()
        if (r.width < 1 || r.height < 1) return
        items.push({ name, b: [r.left, r.top, r.right, r.bottom] })
      }
      add('card', document.querySelector('.toy-card'))
      for (const [n, s] of [['score', '.toy-tl'], ['clock', '.toy-clock'], ['wave', '.toy-wave'], ['boss', '.toy-boss'], ['lives+carrier', '.toy-tr'], ['status', '.toy-status'], ['warn', '.toy-warn.on']]) add(n, document.querySelector(s))
      document.querySelectorAll('.pt-touch > *').forEach((e) => add(`touch:${[...e.classList].find((c) => c.startsWith('t-'))?.slice(2)}`, e))
      const overlaps = []
      const out = []
      for (let i = 0; i < items.length; i++) {
        const a = items[i].b
        if (a[0] < -1 || a[1] < -1 || a[2] > W + 1 || a[3] > H + 1) out.push(items[i].name)
        for (let j = i + 1; j < items.length; j++) {
          const b = items[j].b
          const ox = Math.min(a[2], b[2]) - Math.max(a[0], b[0])
          const oy = Math.min(a[3], b[3]) - Math.max(a[1], b[1])
          if (ox > 2 && oy > 2) overlaps.push(`${items[i].name} × ${items[j].name}`)
        }
      }
      return { names: items.map((x) => x.name), overlaps, out }
    }
    const STATES = [
      { name: 'the start screen', setup: '', want: ['card'] },
      { name: 'early in a game', setup: `document.querySelector('.toy-start button[data-side="us"]').click(); await new Promise((r) => setTimeout(r, 400)); toy.bot = ${BOT}; toy.running = true; toy.simulate(3); toy.running = false`, want: ['score', 'clock', 'wave', 'lives+carrier', 'status', 'touch:stick', 'touch:fire', 'touch:bomb'] },
      { name: 'the battleship, the combo and a warning up', setup: `toy.running = true; toy.simulate(124); toy.running = false; const w = toy.world; w.combo = { count: 30, mult: 4, until: 1e9, best: 4, bestCount: 30 }; toy.hud.warnT = { text: 'Guns hot!', until: 1e9 }; toy.hud.update(0, w)`, want: ['score', 'clock', 'boss', 'lives+carrier', 'status', 'warn', 'touch:stick', 'touch:fire', 'touch:bomb'] },
    ]
    for (const st of STATES) {
      await check(`the toy on a phone, ${st.name}: nothing overlaps by more than 2 px and nothing leaves the screen (${SIZES.map((z) => z.join('×')).join(', ')})`, async () => {
        await pp.setViewportSize({ width: SIZES[0][0], height: SIZES[0][1] })
        if (st.setup) await run(st.setup)
        await new Promise((r) => setTimeout(r, 400))
        const bad = []
        let names = []
        for (const [w, h] of SIZES) {
          await pp.setViewportSize({ width: w, height: h })
          await frames(2)
          if (st.name.startsWith('the battleship')) await run(`toy.hud.update(0, toy.world)`)
          const r = await pp.evaluate(MEASURE)
          names = r.names
          const lacks = st.want.filter((n) => !r.names.includes(n))
          const fails = [...r.overlaps, ...r.out.map((x) => `off screen: ${x}`), ...lacks.map((n) => `missing: ${n}`)]
          if (fails.length) bad.push(`${w}×${h}: ${fails.join('; ')}`)
          if (fails.length || (w === 412 && h === 915) || (w === 844 && h === 390)) await pp.screenshot({ path: join(shots, `toy-phone-${st.name.split(' ')[1]}-${w}x${h}.png`) })
          console.log(`      ${w}×${h}: ${r.names.length} boxes${fails.length ? `, failing: ${fails.join('; ')}` : ', clear'}`)
        }
        if (bad.length) throw new Error(bad.join(' | '))
        return names.join(', ')
      })
    }
    await pp.close()
  }
  await check('no console errors', async () => {
    expect(!errors.length, errors.slice(0, 5).join(' | '))
  })
  await browser.close()
  server.close()
}

writeFileSync(join(shots, 'smoke-toy.json'), JSON.stringify(report, null, 1))
console.log(failed ? `${failed} failed` : 'all passed')
process.exit(failed ? 1 : 0)
