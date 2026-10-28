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
//             phone ((V3b) and 1024×768 and an 844×390 landscape phone, the
//             phones touch screens), once the deployment's camera has
//             rested: the tools row
//             holds only its eight buttons of before F8b and (V2) the perf
//             overlay's 📈 (no ☰ or 🗺 in it: they widened it over the
//             other seat's score), and it
//             clears that score (#vp1); on Grand in landscape (1280×800 and
//             1366×768), with a unit
//             picked up and its card showing, the roster stops above the
//             minimap raised over the card. (V3b) With the perf overlay on
//             (its 📈) and the net badge shown in each of its states
//             (ui/netbadge.js's own NetBadge, its source put in the page:
//             online · 2 watching, reconnecting, offline, out of step with
//             two names), the badge stands in the top-left corner and no box
//             of the chrome (the badge, the perf overlay, the HUD, the hint,
//             the tools, the log, the roster, the minimap, the actions)
//             meets another; and once both seats have begun the battle, in
//             the first seat's movement phase with a unit picked up by Tab
//             (Advance up), every action button shown is on the screen, ↶
//             Undo among them, its title the rule, the row clear of the card
//             and the group bar, and the minimap clear of both
//   cart      (F9a) vs. the AI from seat 0 in a Field battle whose
//             Bushtails field two War-Carts (?mission=field&armies=): the
//             deployment adjusted by clicks, Begin battle, and in the first
//             movement phase a rider stepped off by the DOM alone (its chip
//             on the cart's label, "▣ n/12 ⟨…⟩", clicked, then the ground
//             beside the cart where the tooltip offers "⤓ Step off"), then
//             moves, shots and End into round 2
// (F4) A lane with a seat played here that reaches the round limit (--rounds
// 5) is asked to play on: the panel must say which round is over, and Keep
// playing must take it down and the HUD into round 6, overtime.
// A lane with a seat played here must place units by clicks in its
// deployment, every seat it plays: once the camera has come to rest, a
// click on a unit, then on the ground in its zone, seen as one of the
// seat's labels moving while every other label stays put; must reach its
// rounds or the end; and must play moves and Ends. The title must be up
// 1200 ms after the page loads. (V2) What the page draws decides how long
// a frame takes under SwiftShader (from about 2 a second to one every few
// seconds, the 'new' figures' splats at a close camera), so a wait for the
// table to show something (the camera at rest, a placed unit's label
// moved) is a wait for frames as well as time: at least the time it always
// was, and at least FRAMES frames drawn (the labels move only when a frame
// is drawn).
//
//   node sim/play-check.mjs [--lanes watch,bushtail,serpent,hotseat,grand,layout,cart] [--rounds R] [--full] [--dist <dir>] [--parallel N] [--shots <dir>]
//
// ?lowfi by default (--full: without); board 4242; the dice per lane
// (bushtail 99, serpent 7, hotseat 1, watch 99, grand 5, cart 99);
// 1280×800; the cart lane plays two rounds at most; the
// grand lane plays round 1 only (--rounds caps it), a Grand AI turn taking
// minutes at SwiftShader's frame rate. --parallel runs
// that many lanes at once (default 1: SwiftShader draws at about 2 fps on
// this machine). (V3b) --shots writes the layout lane's screenshots there
// (each screen and board: each of the net badge's states, and the actions
// in the movement phase). Exit 0 when every lane plays, 1 otherwise, 2 on bad
// arguments. Set CHROMIUM_PATH to the pre-installed Chromium if
// Playwright's own isn't installed.
import { parseArgs } from 'node:util'
import { mkdtempSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { chromium } from 'playwright'
import { startStaticServer } from '../../../scripts/static-server.mjs'
import { buildApp, pool } from './lib.mjs'
import { PKG } from './oracle/pin.mjs'

const LANES = ['watch', 'bushtail', 'serpent', 'hotseat', 'grand', 'layout', 'cart']
const DICE = { watch: 99, bushtail: 99, serpent: 7, hotseat: 1, grand: 5, layout: 1, cart: 99 }
// (F9a) the cart lane's battle: Field, the Bushtails with two War-Carts
const CART_QUERY = 'mission=field&armies=1222112,field'
let a
try {
  ({ values: a } = parseArgs({ options: { lanes: { type: 'string' }, rounds: { type: 'string' }, full: { type: 'boolean' }, dist: { type: 'string' }, parallel: { type: 'string' }, shots: { type: 'string' } } }))
} catch (e) {
  console.error(`play-check: ${e.message}\nusage: node sim/play-check.mjs [--lanes ${LANES.join(',')}] [--rounds R] [--full] [--dist <dir>] [--parallel N] [--shots <dir>]`)
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
// ((the WIP merge's follow-up) The boxes `sel` picks out on `page` at rest:
// none moving 2 px across a minimap tick (10 Hz) and two of the page's
// frames, three times running. Under SwiftShader a frame takes a second or
// more (on a Grand board, or on a loaded machine), so a fixed wait, or two
// readings 800 ms apart inside one frame, can read a page that hasn't drawn
// what it is doing yet: a camera still swinging read as at rest.)
async function settle(page, sel, what) {
  for (let n = 0, t0 = Date.now(); n < 3;) {
    if (Date.now() - t0 > 180000) throw new Error(`${what} never came to rest`)
    n = (await page.evaluate((sel) => new Promise((done) => {
      const at = () => [...document.querySelectorAll(sel)].map((e) => e.getBoundingClientRect())
      const was = at()
      setTimeout(() => requestAnimationFrame(() => requestAnimationFrame(() => done(at().every((r, i) => Math.max(Math.abs(r.left - was[i].left), Math.abs(r.top - was[i].top), Math.abs(r.bottom - was[i].bottom)) < 2)))), 150)
    }), sel)) ? n + 1 : 0
  }
}
// ((V2) the frames a wait for the table spans, at the least)
const FRAMES = 3

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
  // ((V2) `ms` and at least `n` frames drawn: requestAnimationFrame's
  // callbacks n times over, the page's own frame drawn between each)
  const drawn = (ms, n = FRAMES) => Promise.all([sleep(ms), page.evaluate((n) => new Promise((r) => {
    let k = 0
    const f = () => (++k >= n ? r() : requestAnimationFrame(f))
    requestAnimationFrame(f)
  }), n)])
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
  // under SwiftShader): no label moving 2 px (settle: (the WIP merge's
  // follow-up) across the page's own frames, not 800 ms, which a loaded
  // machine's frame outlasts; the serpent lane then hovered seat 1's
  // labels mid-swing and found no unit under any)
  const rest = () => settle(page, '#labels .ulabel', 'the camera')
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
    if (name !== 'grand' && name !== 'cart') return ls
    const free = []
    for (const l of ls) if (await onTable({ x: l.x, y: l.y + 22 })) free.push(l)
    return free.sort((p, q) => Math.abs(p.x - 640) - Math.abs(q.x - 640))
  }
  const stats = { placed: [0, 0], moves: 0, advances: 0, shots: 0, charges: 0, picks: 0, shortest: 0, autos: 0, ends: 0, decisions: 0, votes: 0, steps: 0, cargo: '' }

  // (F9a, the cart lane) A rider stepped off by the DOM: its chip on its
  // cart's label clicked (picking it up), then the ground round the cart
  // (under its label) tried until the tooltip offers a step-off, and
  // clicked. True once the table has caught up with it.
  async function stepOff(e) {
    const chips = await page.evaluate(() => [...document.querySelectorAll('#labels .ulabel.s0 .rd i')].map((c) => {
      const r = c.getBoundingClientRect(), l = c.closest('.ulabel').getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, lx: l.left + l.width / 2, ly: l.bottom, cargo: c.closest('.ulabel').querySelector('.cg')?.textContent ?? '' }
    }).filter((c) => c.x > 30 && c.x < innerWidth - 30 && c.y > 60 && c.y < innerHeight - 60))
    for (const c of chips) {
      stats.cargo ||= c.cargo
      await click(c)
      if (!/Step off|blue/.test(await text('#hint')) && !(await page.evaluate(() => document.querySelector('#card.show')?.textContent.includes('Aboard the')))) continue
      // the cart stands under its label: round it, about 2-3" out on screen
      for (const r of [70, 95, 55, 120]) for (let k = 0; k < 12; k++) {
        const a = (k / 12) * Math.PI * 2, q = { x: c.lx + Math.cos(a) * r, y: c.ly + 40 + Math.sin(a) * r * 0.7 }
        if (!(await onTable(q))) continue
        await page.mouse.move(q.x, q.y)
        await sleep(300)
        if (!(await tooltip()).startsWith('⤓ Step off')) continue
        await page.mouse.click(q.x, q.y)
        stats.steps++
        log('a rider stepped off by its chip and a click beside its cart')
        if ((await idle()) !== e.text) return true
        return true
      }
    }
    return false
  }

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
        // ((the merged build's gate) its landing read as the frames come,
        // up to 6 s, not once 1.5 s on: under load a frame took longer;
        // (V2) each reading after a frame drawn, the labels moving only then)
        let m = [], moved = [], still = []
        for (let k = 0; k < 12; k++) {
          await drawn(500, 1)
          m = moves(was, await every())
          moved = m.filter((x) => x.d > 12)
          still = m.filter((x) => x.d < 3)
          if (moved.length) break
        }
        await drawn(500, 1)
        m = moves(was, await every())
        moved = m.filter((x) => x.d > 12)
        still = m.filter((x) => x.d < 3)
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
      // ((F9a) the cart lane: a rider stepped off first, once)
      if (name === 'cart' && !stats.steps) {
        await stepOff(e)
        if ((await btn('#endPhase')).text !== e.text) return
      }
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
    await page.goto(`${url}/?${a.full ? '' : 'lowfi&'}seed=4242&dice=${DICE[name]}${name === 'cart' ? `&${CART_QUERY}` : ''}`)
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
      await page.click(`[data-mode="${name === 'grand' || name === 'cart' ? 'bushtail' : name}"]`)
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
      const rounds = name === 'grand' ? Math.min(ROUNDS, 1) : name === 'cart' ? Math.min(ROUNDS, 2) : ROUNDS
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
      // ((F9a) the cart lane: a rider stepped off by the DOM, its cart's
      // label counting its riders)
      if (name === 'cart' && (!stats.steps || !/^▣ \d+\/12$/.test(stats.cargo))) problems.push(`the cart lane stepped ${stats.steps} riders off by their chips (one at least), the cart's label reading "${stats.cargo}" (▣ n/12)`)
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

// ((F8b's review) the layout lane: the chrome's boxes on three screens;
// (V3b) five, the phones touch screens: [width, height, touch])
const TOOLS = ['speed', 'view', 'follow', 'batch', 'autoFirst', 'autoEnd', 'mute', 'perf', 'helpBtn']
const SCREENS = [[1280, 800], [1366, 768], [1024, 768], [844, 390, true], [412, 915, true]]
// ((V3b) the net badge in each of its states, shown by ui/netbadge.js's own
// NetBadge (its source put in the page as a script: the module imports
// nothing), and the chrome's boxes while it shows: the badge, the perf
// overlay, the HUD, the hint, the tools, the log, the roster, the minimap
// and the actions, those on the page)
const BADGE = [['online', { link: 'online', watching: 2 }], ['reconnecting', { link: 'reconnecting' }], ['offline', { link: 'offline' }], ['apart', { link: 'online', watching: 1, apart: ['Ann', 'Bartholomew'] }]]
const BADGE_SRC = readFileSync(join(PKG, 'ui', 'netbadge.js'), 'utf8').replace(/^export class/m, 'class')
const CHROME = ['#netbadge', '#perfOverlay', '#hud', '#hint', '#tools', '#log', '#roster', '#minimap', '#actions']
async function layoutLane(browser, url) {
  const lines = [], problems = [], errors = []
  if (a.shots) mkdirSync(a.shots, { recursive: true })
  for (const [w, h, touch = false] of SCREENS) {
    for (const mission of ['classic', 'grand']) {
      const page = await (await browser.newContext({ viewport: { width: w, height: h }, ...(touch ? { hasTouch: true, isMobile: true } : {}) })).newPage()
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
        // ((the WIP merge's follow-up) then the deployment's camera at rest:
        // its swing onto the battle's view is 1.4 s of game time, a frame
        // stepping at most 0.05 s of it (view/stage.js), so on a Grand board
        // the swing runs 20-30 s; 4 s in, the camera still near the title's
        // orbit, every one of the seat's labels stood off the screen and no
        // unit was clicked)
        await settle(page, '#labels .ulabel', 'the camera')
        const box = (s) => page.evaluate((s) => {
          const el = document.querySelector(s)
          if (!el || getComputedStyle(el).display === 'none' || el.classList.contains('hidden')) return null
          const r = el.getBoundingClientRect()
          return r.width && r.height ? { l: r.left, t: r.top, r: r.right, b: r.bottom } : null
        }, s)
        const meets = (p, q) => !!p && !!q && p.l < q.r && q.l < p.r && p.t < q.b && q.t < p.b
        const shown = await page.evaluate(() => [...document.querySelectorAll('#tools button')].filter((b) => getComputedStyle(b).display !== 'none').map((b) => b.id))
        const tools = await box('#tools'), score = await box('#vp1')
        if (shown.join() !== TOOLS.join()) problems.push(`${at}: the tools row shows ${shown.join(', ')}, not its eight of before F8b and (V2) 📈 (${TOOLS.join(', ')})`)
        if (!tools || !score) problems.push(`${at}: no tools row or no score for the other seat on the page`)
        else if (meets(tools, score)) problems.push(`${at}: the tools row (${Math.round(tools.l)}-${Math.round(tools.r)} px) covers the other seat's score (${Math.round(score.l)}-${Math.round(score.r)} px)`)
        const shot = (what) => (a.shots ? page.screenshot({ path: join(a.shots, `layout-${mission}-${w}x${h}-${what}.png`) }) : null)
        const rounded = (b) => `${Math.round(b.l)},${Math.round(b.t)}-${Math.round(b.r)},${Math.round(b.b)}`
        // ((V3b) the perf overlay on by its 📈, as a player switches it, its
        // six lines written (twice a second, as the frames come); then the
        // net badge in each state: in the top-left corner, and no box of the
        // chrome meeting another)
        await page.click('#perf')
        await page.waitForFunction(() => document.querySelector('#perfOverlay').textContent.split('\n').length === 6, null, { timeout: 120000 })
        await page.addScriptTag({ content: `${BADGE_SRC}\nwindow.__v3bBadge = new NetBadge(document.querySelector('#netbadge'))` })
        let badge = ''
        for (const [k, state] of BADGE) {
          await page.evaluate((s) => window.__v3bBadge.show(s), state)
          await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
          const bs = []
          for (const s of CHROME) {
            const b = await box(s)
            if (b) bs.push([s, b])
          }
          const nb = bs.find(([s]) => s === '#netbadge')?.[1]
          if (!nb) problems.push(`${at}: the net badge ("${k}") isn't on the page`)
          else if (nb.l > 12 || nb.t > 12) problems.push(`${at}: the net badge ("${k}") stands at ${rounded(nb)}, not in the top-left corner`)
          if (!bs.some(([s]) => s === '#perfOverlay')) problems.push(`${at}: the perf overlay isn't up after its 📈`)
          for (let i = 0; i < bs.length; i++) {
            for (let j = i + 1; j < bs.length; j++) if (meets(bs[i][1], bs[j][1])) problems.push(`${at}, the badge "${k}": ${bs[i][0]} (${rounded(bs[i][1])}) meets ${bs[j][0]} (${rounded(bs[j][1])})`)
          }
          if (k === 'apart') badge = `; the badge ${nb ? rounded(nb) : 'none'} beside ${bs.length - 1} boxes`
          await shot(`badge-${k}`)
        }
        await page.evaluate(() => window.__v3bBadge.hide())
        await page.click('#perf')
        let card = ''
        if (mission === 'grand' && w >= 1280) {
          // a unit of the seat placing picked up by a click on its label's
          // unit, so its card shows and the minimap rises over it
          const ls = await page.evaluate(() => [...document.querySelectorAll('#labels .ulabel.s0')].map((l) => l.getBoundingClientRect()).filter((r) => r.width && r.left > 260 && r.right < innerWidth - 40 && r.top > 120 && r.bottom < innerHeight - 120).map((r) => ({ x: r.left + r.width / 2, y: r.bottom })))
          // (the unit under its label found as the other lanes find it, by
          // the tooltip its hover shows a little below the label, then
          // clicked there, the card waited on as the frames come)
          const tip = () => page.evaluate(() => { const t = document.querySelector('#tooltip'); return t.style.display === 'block' ? t.textContent : '' })
          for (const l of ls.slice(0, 6)) {
            let p = null
            for (const dy of [22, 34, 14, 48, 8]) {
              await page.mouse.move(l.x, l.y + dy)
              await sleep(500)
              if (/models|wounds/.test(await tip())) { p = { x: l.x, y: l.y + dy }; break }
            }
            if (!p) continue
            await page.mouse.click(p.x, p.y)
            for (let k = 0; k < 10 && !(await box('#card.show')); k++) await sleep(500)
            if (await box('#card.show')) break
          }
          // (and the minimap's rise over it, on its own ≤ 10 Hz tick and a
          // 0.2 s slide, both starved by SwiftShader's slow frames: its box
          // read once its tick has seen the card (view/minimap.js's lift,
          // the card's height and 20 px) and it holds still over two
          // readings 1 s apart; 30 s at most, then judged as it stands)
          await sleep(1200)
          // (the card done sliding in and the minimap's tick past it: a
          // reading 1.9 s after the click caught the card still 20 px low and
          // the map not yet raised)
          await settle(page, '#card, #minimap, #roster', 'the card, the minimap and the roster')
          const c = await box('#card.show'), mm = await box('#minimap'), ro = await box('#roster')
          if (!c) problems.push(`${at}: no unit's card showed after clicks on six units`)
          else if (!mm || !ro) problems.push(`${at}: the minimap or the roster isn't up on a Grand board`)
          else {
            if (meets(ro, mm)) problems.push(`${at}: with the card up the minimap (${Math.round(mm.t)}-${Math.round(mm.b)} px) covers the roster's last rows (it runs ${Math.round(ro.t)}-${Math.round(ro.b)} px)`)
            if (meets(mm, c)) problems.push(`${at}: the minimap (${Math.round(mm.t)}-${Math.round(mm.b)} px) covers the card (${Math.round(c.t)}-${Math.round(c.b)} px)`)
            card = `; the card up (${Math.round(c.t)}-${Math.round(c.b)} px), the minimap ${Math.round(mm.t)}-${Math.round(mm.b)}, the roster ${Math.round(ro.t)}-${Math.round(ro.b)}`
          }
        }
        // ((V3b) ↶ Undo on the screen: Begin battle for each seat, then in
        // the first seat's movement phase a unit picked up by Tab (its card
        // up, Advance up: the actions' fullest common row; on a touch screen
        // ▭ Select and 👆 Aim too): every action button shown inside the
        // screen, Undo among them, its title the rule, the row clear of the
        // card and the group bar, the minimap of both)
        const endUp = () => page.evaluate(() => {
          const e = document.querySelector('#endPhase')
          return getComputedStyle(e).display !== 'none' && !e.disabled ? e.textContent : ''
        })
        for (const t0 = Date.now(); !(await endUp()).startsWith('End Movement');) {
          if (Date.now() - t0 > 300000) throw new Error(`no movement phase 300 s after the deployment (End reads "${await endUp()}")`)
          if ((await endUp()).startsWith('Begin battle')) {
            await page.click('#endPhase')
            await page.waitForFunction(() => document.querySelector('#endPhase').disabled, null, { timeout: 10000 }).catch(() => {})
          }
          await sleep(1000)
        }
        await page.evaluate(() => document.activeElement?.blur?.())
        await page.keyboard.press('Tab')
        await page.waitForFunction(() => getComputedStyle(document.querySelector('#advance')).display !== 'none' && document.querySelector('#card.show'), null, { timeout: 60000 }).catch(() => {})
        await settle(page, '#card, #actions, #groupbar', 'the card and the actions')
        const acts = await page.evaluate(() => [...document.querySelectorAll('#actions button')].filter((b) => getComputedStyle(b).display !== 'none' && !b.classList.contains('hidden')).map((b) => {
          const r = b.getBoundingClientRect()
          return { id: b.id, l: r.left, t: r.top, r: r.right, b: r.bottom, title: b.title }
        }))
        const undo = acts.find((x) => x.id === 'undo')
        const off = acts.filter((x) => x.l < 0 || x.t < 0 || x.r > w || x.b > h)
        if (!undo) problems.push(`${at}: in the movement phase ↶ Undo isn't up (the actions: ${acts.map((x) => x.id).join(', ')})`)
        else if (!/End or dice roll/.test(undo.title)) problems.push(`${at}: ↶ Undo's title doesn't say the rule ("${undo.title}")`)
        if (off.length) problems.push(`${at}: in the movement phase ${off.map((x) => `${x.id} (${rounded(x)})`).join(', ')} off the ${w}×${h} screen`)
        if (!acts.some((x) => x.id === 'advance')) problems.push(`${at}: Tab picked up no unit that can advance (the actions: ${acts.map((x) => x.id).join(', ')})`)
        const row = await box('#actions'), cardUp = await box('#card.show'), bar = await box('#groupbar'), map = await box('#minimap')
        if (meets(row, cardUp)) problems.push(`${at}: the actions (${rounded(row)}) meet the unit card (${rounded(cardUp)})`)
        if (meets(row, bar)) problems.push(`${at}: the actions (${rounded(row)}) meet the group bar (${rounded(bar)})`)
        // (and the minimap, raised over the card or put away for it)
        if (meets(map, cardUp)) problems.push(`${at}: the minimap (${rounded(map)}) meets the unit card (${rounded(cardUp)})`)
        if (meets(map, row)) problems.push(`${at}: the minimap (${rounded(map)}) meets the actions (${rounded(row)})`)
        await shot('undo')
        const moves = `; in the movement phase ${acts.length} actions in ${row ? rounded(row) : 'none'}, Undo ${undo ? rounded(undo) : 'none'}`
        lines.push(`${at}: the tools ${shown.length} buttons, ${tools ? `${Math.round(tools.l)}-${Math.round(tools.r)} px` : 'none'}, the score ${score ? `${Math.round(score.l)}-${Math.round(score.r)} px` : 'none'}${badge}${card}${moves}`)
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
