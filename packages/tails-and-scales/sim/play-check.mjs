// The shipped page played rendered (R8b; the rendered playability lanes R6b
// to R8 ran from a scratch script): a fresh build in Chromium, without
// ?debug or ?fast, driven only through the DOM as a player drives it (the
// title's buttons, clicks on the table where a unit's floating label says
// it stands, the HUD's buttons), and read only through the DOM (the labels,
// the tooltip, the HUD, the end screen). Each lane must play without a page
// error:
//   watch     a watched battle to its end screen, Back to the war room (the
//             title up, the battle log empty), New battlefield, a second
//             watched battle into round 2
//   bushtail  vs. the AI from seat 0: the deployment adjusted by clicks
//             (units picked up and put down elsewhere in the zone), Begin
//             battle, then moves, an Advance, shots, Auto, charges (ended
//             on a spot in the orange area, or by Shortest move) and End,
//             into round --rounds
//   serpent   the same from seat 1
//   hotseat   both seats: each seat's deployment adjusted by clicks and
//             begun in turn, then the seats taking turns
//   grand     (F8b) vs. the AI from seat 0 on a Grand board, picked on the
//             battle-setup panel's size line (its note naming the board,
//             points and rounds): the deployment adjusted by clicks, Begin
//             battle, moves, shots and End into round 2; the first turn
//             with more than 10 units gives its one-time tip (the toast)
//   layout    (F8b's review) the battle's chrome in place: a hotseat battle
//             on classic and on Grand, at 1280×800, 1366×768 and a 412×915
//             phone, once the deployment's camera has rested: the tools row
//             holds only its eight buttons of before F8b (no ☰ or 🗺 in
//             it: they widened it over the other seat's score), and it
//             clears that score (#vp1); on Grand in landscape, with a unit
//             picked up and its card showing, the roster stops above the
//             minimap raised over the card
// (F4) A lane with a seat played here that reaches the round limit (--rounds
// 5) is asked to play on: the panel must say which round is over, and Keep
// playing must take it down and the HUD into round 6, overtime.
// A lane with a seat played here must place units by clicks in its
// deployment, every seat it plays: once the camera has come to rest, a
// click on a unit, then on the ground in its zone, seen as one of the
// seat's labels moving while every other label stays put; must reach its
// rounds or the end; and must play moves and Ends. The title must be up
// 1200 ms after the page loads.
//
//   node sim/play-check.mjs [--lanes watch,bushtail,serpent,hotseat,grand] [--rounds R] [--full] [--dist <dir>] [--parallel N]
//
// ?lowfi by default (--full: without); board 4242; the dice per lane
// (bushtail 99, serpent 7, hotseat 1, watch 99, grand 5); 1280×800; the
// grand lane plays round 1 only (--rounds caps it), a Grand AI turn taking
// minutes at SwiftShader's frame rate. --parallel runs
// that many lanes at once (default 1: SwiftShader draws at about 2 fps on
// this machine). Exit 0 when every lane plays, 1 otherwise, 2 on bad
// arguments. Set CHROMIUM_PATH to the pre-installed Chromium if
// Playwright's own isn't installed.
import { parseArgs } from 'node:util'
import { mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { chromium } from 'playwright'
import { startStaticServer } from '../../../scripts/static-server.mjs'
import { buildApp, pool } from './lib.mjs'
import { PKG } from './oracle/pin.mjs'

const LANES = ['watch', 'bushtail', 'serpent', 'hotseat', 'grand', 'layout']
const DICE = { watch: 99, bushtail: 99, serpent: 7, hotseat: 1, grand: 5, layout: 1 }
let a
try {
  ({ values: a } = parseArgs({ options: { lanes: { type: 'string' }, rounds: { type: 'string' }, full: { type: 'boolean' }, dist: { type: 'string' }, parallel: { type: 'string' } } }))
} catch (e) {
  console.error(`play-check: ${e.message}\nusage: node sim/play-check.mjs [--lanes ${LANES.join(',')}] [--rounds R] [--full] [--dist <dir>] [--parallel N]`)
  process.exit(2)
}
const lanes = a.lanes ? a.lanes.split(',') : LANES
const ROUNDS = a.rounds === undefined ? 3 : Number(a.rounds)
const PARALLEL = a.parallel === undefined ? 1 : Number(a.parallel)
if (lanes.some((l) => !LANES.includes(l)) || !Number.isInteger(ROUNDS) || ROUNDS < 1 || ROUNDS > 5 || !Number.isInteger(PARALLEL) || PARALLEL < 1) {
  console.error(`play-check: --lanes takes ${LANES.join(', ')}; --rounds 1 to 5; --parallel a whole number from 1`)
  process.exit(2)
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// One lane on its own page; returns { ok, lines, stats, errors }.
async function lane(browser, url, name) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage()
  page.setDefaultTimeout(120000)
  const errors = [], lines = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`))
  const t0 = Date.now()
  const log = (...x) => lines.push(`[${Math.round((Date.now() - t0) / 1000)}s] ${x.join(' ')}`)
  const visible = (s) => page.evaluate((s) => {
    const el = document.querySelector(s)
    return !!el && getComputedStyle(el).display !== 'none' && !el.classList.contains('hidden')
  }, s)
  const btn = (s) => page.evaluate((s) => {
    const el = document.querySelector(s)
    return { show: getComputedStyle(el).display !== 'none', enabled: !el.disabled, text: el.textContent }
  }, s)
  const text = (s) => page.evaluate((s) => document.querySelector(s)?.textContent ?? '', s)
  const tooltip = () => page.evaluate(() => {
    const t = document.querySelector('#tooltip')
    return t.style.display === 'block' ? t.textContent : ''
  })
  // the labels of a seat's standing units on the screen: each one's place
  // among the labels (a unit's label is made once, so it names the unit),
  // its name and the bottom centre of its box
  const labels = (seat) => page.evaluate((seat) => [...document.querySelectorAll('#labels .ulabel')].map((l, i) => [l, i]).filter(([l]) => l.classList.contains(`s${seat}`) && l.style.display !== 'none' && l.style.visibility !== 'hidden').map(([l, i]) => {
    const r = l.getBoundingClientRect()
    return { i, name: l.querySelector('.nm')?.textContent, x: r.left + r.width / 2, y: r.bottom }
  }).filter((p) => p.x > 30 && p.x < innerWidth - 30 && p.y > 60 && p.y < innerHeight - 60), seat)
  // a point on the unit under a label: the first below it the pointer finds
  // a unit at (the tooltip says so)
  const unitAt = async (l, want = (t) => !!t) => {
    for (const dy of [22, 34, 14, 48, 8]) {
      await page.mouse.move(l.x, l.y + dy)
      await sleep(350)
      const t = await tooltip()
      if (want(t)) return { x: l.x, y: l.y + dy, tip: t }
    }
    return null
  }
  const click = async (p) => {
    await page.mouse.click(p.x, p.y)
    await sleep(300)
  }
  // every label shown, wherever it is: its place among the labels (a
  // unit's label is made once, so it names the unit), its seat and the
  // bottom centre of its box
  const every = () => page.evaluate(() => [...document.querySelectorAll('#labels .ulabel')].map((l, i) => {
    const r = l.getBoundingClientRect()
    return { i, seat: l.classList.contains('s1') ? 1 : 0, x: r.left + r.width / 2, y: r.bottom, shown: l.style.display !== 'none' && l.style.visibility !== 'hidden' }
  }).filter((l) => l.shown))
  // how far each label moved between two readings (by its place)
  const moves = (a, b) => b.map((l) => {
    const o = a.find((x) => x.i === l.i)
    return { ...l, d: o ? Math.hypot(l.x - o.x, l.y - o.y) : 0 }
  })
  // the camera at rest (its swing onto the battle's view takes seconds
  // under SwiftShader): no label moving more than 2 px in 800 ms
  const rest = async () => {
    let was = await every()
    for (let k = 0; k < 90; k++) {
      await sleep(800)
      const now = await every()
      if (moves(was, now).every((m) => m.d < 2)) return
      was = now
    }
    throw new Error('the camera never came to rest')
  }
  // a point on the table clear of the HUD's panels and buttons
  const onTable = (q) => page.evaluate(({ x, y }) => x > 40 && x < innerWidth - 40 && y > 110 && y < innerHeight - 50 && ['#hud', '#hint', '#log', '#card', '#tray', '#actions', '#tools', '#roster', '#minimap'].every((s) => {
    const el = document.querySelector(s)
    if (!el || getComputedStyle(el).display === 'none') return true
    const r = el.getBoundingClientRect()
    return x < r.left - 10 || x > r.right + 10 || y < r.top - 10 || y > r.bottom + 10
  }), q)
  // the table has caught up: End or Begin battle enabled (or the end)
  const idle = async (ms = 900000) => {
    const until = Date.now() + ms
    for (;;) {
      if (await visible('#overVote')) return 'vote'
      if (await visible('#over')) return 'over'
      const e = await btn('#endPhase'), s = await btn('#closestSpot')
      if (s.show) return 'pick'
      if (e.show && e.enabled) return e.text
      if (Date.now() > until) throw new Error(`no decision in ${ms / 1000} s (hint "${await text('#hint')}")`)
      await sleep(1000)
    }
  }
  // ((F8b) the Grand lane's: the labels clear of the HUD's panels, the
  // roster and the minimap among them, nearest the middle of the screen
  // first; the other lanes' as ever, in the labels' order)
  const pickable = async (seat) => {
    const ls = await labels(seat)
    if (name !== 'grand') return ls
    const free = []
    for (const l of ls) if (await onTable({ x: l.x, y: l.y + 22 })) free.push(l)
    return free.sort((p, q) => Math.abs(p.x - 640) - Math.abs(q.x - 640))
  }
  const stats = { placed: [0, 0], moves: 0, advances: 0, shots: 0, charges: 0, picks: 0, shortest: 0, autos: 0, ends: 0, decisions: 0, votes: 0 }

  // The deployment of `seat`, once the camera is at rest: units picked up
  // by a click on them and put down by a click on the ground elsewhere in
  // the zone (the free spot nearest the click), each landing seen as one of
  // the seat's labels moving while every other label stays put; then
  // Begin battle.
  async function deploy(seat) {
    if (!(await text('#hint')).startsWith('Deployment')) throw new Error(`no deployment hint for seat ${seat}: "${await text('#hint')}"`)
    await rest()
    let tries = 0
    for (const l of (await pickable(seat)).slice(0, 6)) {
      if (stats.placed[seat] >= 2) break
      const p = await unitAt(l, (t) => /models|wounds/.test(t))
      if (!p) continue
      await click(p)
      // the ground beside it, in the zone: along the seat's edge first
      for (const [dx, dy] of [[70, 0], [-70, 0], [0, 50], [0, -50], [110, 10], [-110, 10], [40, 25], [-40, 25], [0, 80], [0, -80]]) {
        const q = { x: p.x + dx, y: p.y + dy }
        if (!(await onTable(q))) continue
        tries++
        const was = await every()
        await page.mouse.click(q.x, q.y)
        await sleep(1500)
        const m = moves(was, await every())
        const moved = m.filter((x) => x.d > 12), still = m.filter((x) => x.d < 3)
        if (moved.length === 1 && moved[0].seat === seat && still.length === m.length - 1) {
          stats.placed[seat]++
          log(`seat ${seat} placed a unit by a click: its label moved ${Math.round(moved[0].d)} px, the other ${still.length} labels still`)
          break
        }
      }
    }
    if (!stats.placed[seat]) throw new Error(`seat ${seat}'s deployment: no unit placed by a click (${tries} clicks on the ground)`)
    const b = await btn('#endPhase')
    if (!b.show || !b.enabled || !b.text.startsWith('Begin battle')) throw new Error(`seat ${seat}'s deployment: Begin battle isn't up (${JSON.stringify(b)})`)
    await page.click('#endPhase')
    await sleep(800)
  }

  // One decision for seat `mine`, by End's label.
  async function decide(mine, n) {
    const e = await btn('#endPhase')
    const phase = e.text.replace(/^End | ▸$/g, '')
    stats.decisions++
    const enemy = 1 - mine
    if (phase === 'Movement') {
      let k = 0
      for (const l of (await pickable(mine)).slice(0, 3)) {
        const p = await unitAt(l, (t) => /models|wounds/.test(t))
        if (!p) continue
        await click(p)
        if (!(await btn('#advance')).show && !(await text('#hint')).startsWith('Click inside')) continue
        // an Advance for the first unit, every other decision
        if (k === 0 && n % 2 === 0 && (await btn('#advance')).show) {
          await page.click('#advance')
          stats.advances++
          if ((await idle()) !== e.text) return
        }
        // a move: a click on the board ahead (towards the other edge)
        const dir = mine === 0 ? 1 : -1
        await page.mouse.move(p.x + dir * 60, p.y + 10)
        await sleep(400)
        if (/"\s*of/.test(await tooltip())) {
          await page.mouse.click(p.x + dir * 60, p.y + 10)
          stats.moves++
          if ((await idle()) !== e.text) return
          k++
        }
        if (k >= 2) break
      }
    } else if (phase === 'Shooting') {
      if (n % 3 === 1) {
        await page.click('#autoPhase')
        stats.autos++
        return
      }
      for (const l of (await pickable(mine)).slice(0, 4)) {
        const p = await unitAt(l, (t) => /models|wounds/.test(t))
        if (!p) continue
        await click(p)
        if (!(await text('#hint')).startsWith('Click an enemy unit to shoot')) continue
        for (const t of await labels(enemy)) {
          const q = await unitAt(t, (x) => /hit|Mesmerize|template|shots/.test(x) && !x.startsWith('✖'))
          if (!q) continue
          await click(q)
          stats.shots++
          if ((await idle()) !== e.text) return
          break
        }
      }
    } else if (phase === 'Charge') {
      for (const l of (await pickable(mine)).slice(0, 5)) {
        const p = await unitAt(l, (t) => /models|wounds/.test(t))
        if (!p) continue
        await click(p)
        if (!(await text('#hint')).startsWith('Click an enemy within')) continue
        for (const t of await labels(enemy)) {
          const q = await unitAt(t, (x) => /^Charge: need/.test(x))
          if (!q) continue
          await click(q)
          stats.charges++
          const r = await idle()
          if (r === 'pick') {
            // a spot in the orange area (hovering around the target until
            // the tooltip offers one), else Shortest move
            let done = false
            if (stats.picks <= stats.shortest) {
              for (const [dx, dy] of [[-40, 30], [40, 30], [0, 50], [-60, 10], [60, 10], [0, 70], [-30, 60], [30, 60], [-80, 40], [80, 40]]) {
                await page.mouse.move(q.x + dx, q.y + dy)
                await sleep(300)
                if ((await tooltip()).startsWith('End charge here')) {
                  await page.mouse.click(q.x + dx, q.y + dy)
                  stats.picks++
                  done = true
                  break
                }
              }
            }
            if (!done) {
              await page.click('#closestSpot')
              stats.shortest++
            }
            if ((await idle()) !== e.text) return
          } else if (r !== e.text) return
          break
        }
      }
    }
    const now = await btn('#endPhase')
    if (now.show && now.enabled && now.text === e.text) {
      await page.click('#endPhase')
      stats.ends++
    }
  }

  const problems = []
  try {
    await page.goto(`${url}/?${a.full ? '' : 'lowfi&'}seed=4242&dice=${DICE[name]}`)
    await page.waitForSelector('#title:not(.hidden)')
    await sleep(1200)
    if (!(await page.isVisible('#title .panel'))) problems.push('the title is not up at 1200 ms')
    log('title up at 1200 ms:', await page.isVisible('#title .panel'))
    // 4x, the camera's follow off
    const pace = async () => {
      await page.click('#speed')
      await page.click('#speed')
      await page.click('#follow')
    }
    if (name === 'watch') {
      await page.click('[data-mode="watch"]')
      await page.click('#setupStart')
      await pace()
      await page.waitForSelector('#over:not(.hidden)', { timeout: 3600000 })
      log('end screen:', await text('#overTitle'), '|', await text('#overWhy'))
      await page.click('#again')
      await sleep(1500)
      const empty = await page.evaluate(() => document.querySelector('#logList').children.length)
      if (!(await visible('#title')) || empty) problems.push(`back to the war room: the title ${await visible('#title') ? 'up' : 'not up'}, ${empty} log entries left`)
      await page.click('#reroll')
      await sleep(1500)
      log('new battlefield', await page.inputValue('#seed'))
      await page.click('[data-mode="watch"]')
      await page.click('#setupStart')
      const until = Date.now() + 600000
      while (Date.now() < until && !/Round [2-5]/.test(await text('#round'))) await sleep(3000)
      log('second watched battle:', await text('#round'), 'log entries:', await page.evaluate(() => document.querySelector('#logList').children.length))
      if (!/Round [2-5]/.test(await text('#round'))) problems.push(`the second watched battle never reached round 2 (${await text('#round')})`)
    } else {
      await page.click(`[data-mode="${name === 'grand' ? 'bushtail' : name}"]`)
      // ((F8b) the Grand lane picks its size on the panel, and keeps every
      // toast the page shows: the one-time tips among them)
      if (name === 'grand') {
        await page.click('#setupSize button[data-size="grand"]')
        const size = await page.evaluate(() => ({ on: document.querySelector('#setupSize button.on')?.dataset.size, note: document.querySelector('#setupSizeNote')?.textContent }))
        log('size line:', size.on, '|', size.note)
        if (size.on !== 'grand' || !/80×56 board, 1,500 points a side, 7 rounds/.test(size.note ?? '')) problems.push(`the size line after a click on Grand: ${JSON.stringify(size)}`)
        await page.evaluate(() => {
          window.__toasts = []
          new MutationObserver(() => window.__toasts.push(document.querySelector('#toast').textContent)).observe(document.querySelector('#toast'), { childList: true, characterData: true, subtree: true })
        })
      }
      await page.click('#setupStart')
      await pace()
      const seats = name === 'serpent' ? [1] : name === 'hotseat' ? [0, 1] : [0]
      const rounds = name === 'grand' ? Math.min(ROUNDS, 1) : ROUNDS
      log('started', name)
      let n = 0, deployed = 0
      for (;;) {
        const r = await idle()
        if (r === 'over') {
          // (F4) a battle ending on its rounds asks to play on first
          if (ROUNDS === 5 && !stats.votes && /^Final score/.test(await text('#overWhy'))) problems.push('the battle ended on its rounds without asking to play on')
          break
        }
        if (r === 'vote') {
          // (F4) the round limit: play on, once
          const asked = await text('#overTitle')
          log('vote:', asked, '|', await text('#overVotes'))
          if (!/^Round \d+ is over$/.test(asked)) problems.push(`the vote's panel says "${asked}", not which round is over`)
          if (stats.votes++) throw new Error('asked to play on a second time')
          await page.click('#keepPlaying')
          const until = Date.now() + 600000
          while (Date.now() < until && (await visible('#over') || !/overtime/.test(await text('#round')))) await sleep(1000)
          if (await visible('#over')) problems.push('Keep playing left the panel up')
          if (!/^Round 6 · overtime$/.test(await text('#round'))) problems.push(`Keep playing: the HUD reads "${await text('#round')}", not round 6, overtime`)
          break
        }
        if (r === 'Begin battle ▸') {
          // the seats played here deploy in seat order (hotseat: seat 0,
          // then seat 1 once seat 0 has begun)
          const seat = seats[deployed++]
          if (seat === undefined) throw new Error('Begin battle up again after every seat played here deployed')
          await deploy(seat)
          log(`seat ${seat} deployed:`, await text('#hint'))
          continue
        }
        const round = await text('#round')
        if (Number(/Round (\d)/.exec(round)?.[1]) > rounds) break
        const active = (await page.evaluate(() => document.querySelector('#sideB').classList.contains('active'))) ? 1 : 0
        if (!seats.includes(active)) throw new Error(`End up on seat ${active}'s turn`)
        log(round, `seat ${active}`, r)
        await decide(active, n++)
      }
      log('stopped at', await text('#round'), JSON.stringify(stats))
      if (name === 'grand') {
        const toasts = await page.evaluate(() => window.__toasts)
        log('toasts:', JSON.stringify([...new Set(toasts)].slice(0, 6)))
        if (!toasts.includes('Shift-drag (▭ on touch) to select a group')) problems.push(`no one-time tip for a turn of more than 10 units: ${JSON.stringify([...new Set(toasts)])}`)
        const board = await text('#round')
        if (!/\/ 7/.test(board)) problems.push(`the HUD's round line names no seventh round ("${board}"): not a Grand battle`)
      }
      const missing = seats.filter((s) => !stats.placed[s])
      if (missing.length) problems.push(`seat(s) ${missing.join(', ')} placed nothing by a click in the deployment`)
      if (!stats.decisions) problems.push('no decision was played')
      if (!stats.moves || !stats.ends) problems.push(`the decisions played no move or no End (${JSON.stringify(stats)})`)
    }
  } catch (e) {
    problems.push(e.message.split('\n')[0])
  }
  await page.context().close()
  problems.push(...errors.map((x) => `page error: ${x}`))
  return { name, ok: !problems.length, problems, lines, stats }
}

// ((F8b's review) the layout lane: the chrome's boxes on three screens)
const TOOLS = ['speed', 'view', 'follow', 'batch', 'autoFirst', 'autoEnd', 'mute', 'helpBtn']
async function layoutLane(browser, url) {
  const lines = [], problems = [], errors = []
  for (const [w, h] of [[1280, 800], [1366, 768], [412, 915]]) {
    for (const mission of ['classic', 'grand']) {
      const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage()
      page.setDefaultTimeout(300000)
      page.on('pageerror', (e) => errors.push(e.message))
      const at = `${mission} at ${w}×${h}`
      try {
        await page.goto(`${url}/?seed=4242&dice=${DICE.layout}${a.full ? '' : '&lowfi'}${mission === 'classic' ? '' : `&mission=${mission}`}`)
        await page.waitForSelector('#title:not(.hidden)')
        await page.click('[data-mode="hotseat"]')
        await page.waitForSelector('#setupStart')
        await sleep(300)
        await page.click('#setupStart')
        // (the deployment's: Begin battle up for the seat placing)
        await page.waitForFunction(() => {
          const e = document.querySelector('#endPhase')
          return document.body.classList.contains('playing') && getComputedStyle(e).display !== 'none' && !e.disabled && e.textContent.startsWith('Begin battle')
        }, null, { timeout: 300000 })
        await sleep(4000)
        // ((the WIP merge's follow-up) the boxes `sel` picks out at rest: none
        // moving 2 px across a minimap tick (10 Hz) and two of the page's
        // frames, three times running. A frame on a Grand board under
        // SwiftShader takes a second or more, so a fixed wait, or two
        // readings 800 ms apart inside one frame, can read a page that hasn't
        // drawn what it is doing yet)
        const settle = async (sel, what) => {
          for (let n = 0, t0 = Date.now(); n < 3;) {
            if (Date.now() - t0 > 180000) throw new Error(`${what} never came to rest`)
            n = (await page.evaluate((sel) => new Promise((done) => {
              const at = () => [...document.querySelectorAll(sel)].map((e) => e.getBoundingClientRect())
              const was = at()
              setTimeout(() => requestAnimationFrame(() => requestAnimationFrame(() => done(at().every((r, i) => Math.max(Math.abs(r.left - was[i].left), Math.abs(r.top - was[i].top), Math.abs(r.bottom - was[i].bottom)) < 2)))), 150)
            }), sel)) ? n + 1 : 0
          }
        }
        // the deployment's camera at rest: its swing onto the battle's view
        // is 1.4 s of game time, a frame stepping at most 0.05 s of it
        // (view/stage.js), so on a Grand board the swing runs 20-30 s; 4 s
        // in, the camera still near the title's orbit, every one of the
        // seat's labels stood off the screen and no unit was clicked
        await settle('#labels .ulabel', 'the camera')
        const box = (s) => page.evaluate((s) => {
          const el = document.querySelector(s)
          if (!el || getComputedStyle(el).display === 'none' || el.classList.contains('hidden')) return null
          const r = el.getBoundingClientRect()
          return r.width && r.height ? { l: r.left, t: r.top, r: r.right, b: r.bottom } : null
        }, s)
        const meets = (p, q) => !!p && !!q && p.l < q.r && q.l < p.r && p.t < q.b && q.t < p.b
        const shown = await page.evaluate(() => [...document.querySelectorAll('#tools button')].filter((b) => getComputedStyle(b).display !== 'none').map((b) => b.id))
        const tools = await box('#tools'), score = await box('#vp1')
        if (shown.join() !== TOOLS.join()) problems.push(`${at}: the tools row shows ${shown.join(', ')}, not its eight of before F8b (${TOOLS.join(', ')})`)
        if (!tools || !score) problems.push(`${at}: no tools row or no score for the other seat on the page`)
        else if (meets(tools, score)) problems.push(`${at}: the tools row (${Math.round(tools.l)}-${Math.round(tools.r)} px) covers the other seat's score (${Math.round(score.l)}-${Math.round(score.r)} px)`)
        let card = ''
        if (mission === 'grand' && w > h) {
          // a unit of the seat placing picked up by a click on its label's
          // unit, so its card shows and the minimap rises over it
          const ls = await page.evaluate(() => [...document.querySelectorAll('#labels .ulabel.s0')].map((l) => l.getBoundingClientRect()).filter((r) => r.width && r.left > 260 && r.right < innerWidth - 40 && r.top > 120 && r.bottom < innerHeight - 120).map((r) => ({ x: r.left + r.width / 2, y: r.bottom })))
          for (const l of ls.slice(0, 6)) {
            await page.mouse.click(l.x, l.y + 20)
            await sleep(700)
            if (await box('#card.show')) break
          }
          await sleep(1200)
          // (the card done sliding in and the minimap's tick past it: a
          // reading 1.9 s after the click caught the card still 20 px low and
          // the map not yet raised)
          await settle('#card, #minimap, #roster', 'the card, the minimap and the roster')
          const c = await box('#card.show'), mm = await box('#minimap'), ro = await box('#roster')
          if (!c) problems.push(`${at}: no unit's card showed after clicks on six units`)
          else if (!mm || !ro) problems.push(`${at}: the minimap or the roster isn't up on a Grand board`)
          else {
            if (meets(ro, mm)) problems.push(`${at}: with the card up the minimap (${Math.round(mm.t)}-${Math.round(mm.b)} px) covers the roster's last rows (it runs ${Math.round(ro.t)}-${Math.round(ro.b)} px)`)
            if (meets(mm, c)) problems.push(`${at}: the minimap (${Math.round(mm.t)}-${Math.round(mm.b)} px) covers the card (${Math.round(c.t)}-${Math.round(c.b)} px)`)
            card = `; the card up (${Math.round(c.t)}-${Math.round(c.b)} px), the minimap ${Math.round(mm.t)}-${Math.round(mm.b)}, the roster ${Math.round(ro.t)}-${Math.round(ro.b)}`
          }
        }
        lines.push(`${at}: the tools ${shown.length} buttons, ${tools ? `${Math.round(tools.l)}-${Math.round(tools.r)} px` : 'none'}, the score ${score ? `${Math.round(score.l)}-${Math.round(score.r)} px` : 'none'}${card}`)
      } catch (e) {
        problems.push(`${at}: ${e.message.split('\n')[0]}`)
      }
      await page.context().close()
    }
  }
  problems.push(...errors.map((x) => `page error: ${x}`))
  return { name: 'layout', ok: !problems.length, problems, lines, stats: {} }
}

const work = mkdtempSync(join(tmpdir(), 'ts-play-'))
try {
  const dist = a.dist ?? (await buildApp(PKG, join(work, 'dist')))
  const { url, close } = await startStaticServer(dist)
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
  console.log(`play-check: ${a.dist ? dist : 'a fresh build of the working tree'} in Chromium ${browser.version()}, ${a.full ? 'full' : '?lowfi'}, lanes ${lanes.join(', ')}`)
  const res = await pool(lanes, PARALLEL, async (name) => {
    const r = name === 'layout' ? await layoutLane(browser, url) : await lane(browser, url, name)
    console.log(`\n  ${name}: ${r.ok ? 'ok' : 'FAIL'}\n${r.lines.map((l) => `    ${l}`).join('\n')}${r.ok ? '' : `\n${r.problems.map((p) => `    FAIL ${p}`).join('\n')}`}`)
    return r
  })
  await browser.close()
  close()
  const bad = res.filter((r) => !r.ok)
  console.log(bad.length ? `\nplay-check FAILED: ${bad.map((r) => r.name).join(', ')}` : `\nplay-check passed: ${lanes.join(', ')} played rendered through the DOM alone, no page error${lanes.some((l) => l !== 'watch') ? ', each seat played here placing units by clicks before Begin battle' : ''}`)
  process.exitCode = bad.length ? 1 : 0
} finally {
  rmSync(work, { recursive: true, force: true })
}
