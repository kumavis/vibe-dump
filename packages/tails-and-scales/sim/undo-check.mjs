// Undo and the battle log's scrub in Chromium (F12, F15: ROADMAP's
// playtest items, open questions 28 and 33). A fresh build with
// ?debug&lowfi&fast, a hotseat battle started from the title (seed 4242,
// dice 1), the units put down and moved through ?debug's hooks as a click
// sends them, and Undo, Ctrl-Z, the battle log's lines and the replay bar
// pressed on the page:
//   deployment  ↶ Undo is up beside Begin battle, disabled with nothing
//               placed; a unit placed, it is enabled, and a press puts the
//               unit back where it stood, the log one entry shorter and
//               Undo disabled again; placed again, Ctrl-Z does the same
//   battle      once the seat's movement phase opens, Undo is up and
//               disabled (Begin battle and the roll-off committed); a unit
//               moved, a press puts it back where it stood, not moved, put
//               down, the phase still open (End Movement up, the seat to
//               act) and the move's line gone from the battle log; an
//               advance (a die rolled) leaves nothing to take back, and the
//               advanced unit's move is taken back to the advance, the unit
//               still advanced
//   the log     a click on the line of a move just made shows the battle as
//               it stood before it, on the replay bar: the unit where it
//               stood, the table's Session a replay's (no seat played here:
//               End, Auto and Undo down, no phase to act in, Ctrl-Z and a
//               move sent through the hooks refused); Live comes back to the
//               battle as it stands, the bar away and the seat able to act;
//               ✕ does too; ▶ plays the move and on, and comes back to the
//               battle; a line of the deployment shows "Before the battle"
// and no page error throughout.
//
//   node sim/undo-check.mjs [--dist <dir>] [--self-test]
//
// --self-test: each broken copy in MUTANTS (Undo never wired, Undo that
// leaves the old Session as the battle, a log line's click unwired, a peek
// that Live leaves on the bar) is built and must fail, after the unbroken
// build passes. 1280×800. Exit 0 when every step holds. Set CHROMIUM_PATH to
// the pre-installed Chromium if Playwright's own isn't installed.
import { parseArgs } from 'node:util'
import { mkdtempSync, rmSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { chromium } from 'playwright'
import { startStaticServer } from '../../../scripts/static-server.mjs'
import { buildApp, copyCode } from './lib.mjs'
import { PKG } from './oracle/pin.mjs'
import { IDLE_MS } from './chromium.mjs'

const { values: a } = parseArgs({ options: { dist: { type: 'string' }, 'self-test': { type: 'boolean' } } })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// the self-test's edits: [file, text, replacement]
const MUTANTS = {
  // the button and the key do nothing
  'undo-unwired': ['app/boot.js', '  $(\'#undo\').onclick = () => flow.undo()\n', '  $(\'#undo\').onclick = () => null\n'],
  // the Session made again is shown, but the old one stays the battle (and
  // is closed: the table is no battle's to play on)
  'undo-keeps-battle': ['app/flow.js', '    this.battle = ses\n    this.show(ses)\n', '    this.show(ses)\n'],
  // a click on a line of the battle log does nothing
  'log-unwired': ['app/boot.js', '  ui.log.wire((k) => flow.battle && replay.before(flow.battle, k))\n', ''],
  // Live on a peek leaves the bar up, over the battle
  'peek-stays': ['app/replay.js', '    if (this.peek) return this.close({ back: true })\n', ''],
}

async function check(page, say) {
  const ev = (fn, arg) => page.evaluate(fn, arg)
  const fail = (m) => {
    throw new Error(m)
  }
  // the player idle and nothing still sending: the table caught up
  const idle = () => page.waitForFunction(() => window.__ts.player.idle && !window.__ts.group.busy() && !window.__ts.orders.busy(), null, { timeout: IDLE_MS })
  const button = (sel) => ev((s) => {
    const b = document.querySelector(s)
    return { up: !!b && getComputedStyle(b).display !== 'none' && !b.classList.contains('hidden'), on: !!b && !b.disabled, text: b?.textContent ?? '' }
  }, sel)
  const unit = (id) => ev((id) => {
    const u = window.__ts.G.units.find((x) => x.id === id)
    return { x: u.pos.x, z: u.pos.z, moved: !!u.flags.moved, advanced: !!u.flags.advanced }
  }, id)
  const count = () => ev(() => window.__ts.session.count)
  const lines = () => ev(() => [...document.querySelectorAll('#logList .entry')].map((e) => ({ k: e.dataset.k === undefined ? null : Number(e.dataset.k), text: e.textContent })))
  const press = async (sel) => {
    await page.click(sel)
    await sleep(150)
    await idle()
  }
  const undoKey = async () => {
    await page.keyboard.press('Control+z')
    await sleep(150)
    await idle()
  }
  const same = (p, q) => Math.abs(p.x - q.x) < 1e-9 && Math.abs(p.z - q.z) < 1e-9

  // ── The deployment ───────────────────────────────────────────────────────
  await page.waitForFunction(() => window.__ts?.session?.G?.pending?.k === 'deploy' && window.__ts.player.idle, null, { timeout: IDLE_MS })
  let b = await button('#undo')
  if (!b.up || b.on) fail(`in the deployment, nothing placed, Undo is ${b.up ? 'up' : 'down'} and ${b.on ? 'enabled' : 'disabled'} (up and disabled, beside Begin battle)`)
  // a unit of the seat deploying put down a few inches from where it stands
  const seat = await ev(() => window.__ts.session.decisionFor())
  const place = () => ev((seat) => {
    const ts = window.__ts, u = ts.G.units.find((x) => x.side === seat)
    const n = ts.session.count
    for (const dz of [3, -3, 5, -5, 7, -7]) {
      ts.deployClick(u, null)
      ts.deployClick(null, { x: u.pos.x, z: u.pos.z + dz })
      if (ts.session.count > n) return u.id
    }
    return null
  }, seat)
  const placed = await ev((seat) => window.__ts.G.units.find((x) => x.side === seat).id, seat)
  const home = await unit(placed)
  const n0 = await count()
  if ((await place()) !== placed) fail(`seat ${seat}'s unit ${placed} could not be placed near where it stands`)
  await idle()
  if (same(await unit(placed), home)) fail('the placement moved nothing')
  b = await button('#undo')
  if (!b.up || !b.on) fail(`a unit placed, Undo is ${b.up ? 'up' : 'down'} and ${b.on ? 'enabled' : 'disabled'}`)
  await press('#undo')
  let at = await unit(placed)
  b = await button('#undo')
  if (!same(at, home) || (await count()) !== n0 || b.on || (await button('#endPhase')).text !== 'Begin battle ▸') fail(`Undo after a placement: unit ${placed} at (${at.x}, ${at.z}), not (${home.x}, ${home.z}), or the log ${await count()} entries (${n0} before), Undo ${b.on ? 'still enabled' : 'disabled'}, End "${(await button('#endPhase')).text}"`)
  say(`deployment: Undo up and disabled, enabled once unit ${placed} is placed; a press puts it back where it stood (the log ${n0} entries again)`)
  await place()
  await idle()
  await undoKey()
  at = await unit(placed)
  if (!same(at, home) || (await count()) !== n0) fail(`Ctrl-Z after a placement: unit ${placed} at (${at.x}, ${at.z}), not (${home.x}, ${home.z}), the log ${await count()} entries (${n0} before)`)
  say('deployment: Ctrl-Z takes a placement back too')

  // ── The battle: both seats done deploying, the roll-off, a movement phase
  for (let k = 0; k < 2; k++) {
    await ev(() => window.__ts.endPhase())
    await idle()
  }
  await page.waitForFunction(() => window.__ts.phaseResolve && window.__ts.G.pending?.phase === 'move', null, { timeout: IDLE_MS })
  await idle()
  const mover = await ev(() => window.__ts.session.decisionFor())
  b = await button('#undo')
  if (!b.up || b.on) fail(`seat ${mover}'s movement phase opens with Undo ${b.up ? 'up' : 'down'} and ${b.on ? 'enabled' : 'disabled'} (Begin battle and the roll-off committed: up, disabled)`)
  // a unit of the seat, its move's plan and a cell 2-5" off it
  const pick = () => ev((seat) => {
    const ts = window.__ts
    for (const u of ts.G.units.filter((x) => x.side === seat && x.alive > 0)) {
      if (!ts.q.canAct(u) || ts.q.isEngaged(u) || u.flags.moved) continue
      const plan = ts.q.movePlan(u, u.flags.advanced ? u.flags.advRoll : 0), d = plan.res.dist
      for (let c = 0; c < d.length; c++) if (d[c] > 2 && d[c] < 5 && ts.validEnd(plan, c)) return { u: u.id, c }
    }
    return null
  }, mover)
  const mv = await pick()
  if (!mv) fail(`no unit of seat ${mover} has a move of 2-5"`)
  const start = await unit(mv.u)
  const lines0 = await lines()
  await ev(({ u, c }) => window.__ts.doMove(window.__ts.G.units.find((x) => x.id === u), c), mv)
  await idle()
  if (same(await unit(mv.u), start) || !(await unit(mv.u)).moved) fail(`unit ${mv.u}'s move to cell ${mv.c} moved nothing`)
  const movedTo = await unit(mv.u)
  b = await button('#undo')
  if (!b.on) fail('a unit moved, Undo is disabled')
  await press('#undo')
  at = await unit(mv.u)
  const after = await ev(() => ({ act: !!window.__ts.phaseResolve, seat: window.__ts.session.decisionFor(), phase: window.__ts.G.pending?.phase, sel: window.__ts.S.sel?.id ?? null, group: window.__ts.group.ids().length, card: !!document.querySelector('#card.show') }))
  const end = await button('#endPhase')
  const lines1 = await lines()
  if (!same(at, start) || at.moved) fail(`Undo after a move: unit ${mv.u} at (${at.x}, ${at.z})${at.moved ? ', moved' : ''}, not where it stood (${start.x}, ${start.z})`)
  if (!after.act || after.seat !== mover || after.phase !== 'move' || !end.up || end.text !== 'End Movement ▸') fail(`Undo after a move leaves the phase ${JSON.stringify(after)}, End "${end.text}" (${end.up ? 'up' : 'down'}): seat ${mover}'s movement, still open`)
  if (after.sel !== null || after.group || after.card) fail(`Undo after a move leaves unit ${after.sel ?? '?'} picked up (${after.group} in the group, the card ${after.card ? 'open' : 'shut'}): put down`)
  if (JSON.stringify(lines1) !== JSON.stringify(lines0)) fail(`Undo after a move leaves the battle log ${lines1.length} lines (${lines0.length} before the move): the move's line gone`)
  say(`battle: Undo up and disabled as seat ${mover}'s movement opens; unit ${mv.u} moved, a press puts it back, not moved and put down, the phase still open, its line gone from the log`)

  // an advance (a die rolled) commits; its move is taken back to it
  const adv = await ev(({ seat, not }) => {
    const ts = window.__ts
    const u = ts.G.units.find((x) => x.side === seat && x.id !== not && x.alive > 0 && ts.q.canAct(x) && !ts.q.isEngaged(x) && !x.flags.moved && !x.flags.advanced)
    return u ? u.id : null
  }, { seat: mover, not: mv.u })
  if (adv !== null) {
    await ev((id) => window.__ts.doAdvance(window.__ts.G.units.find((x) => x.id === id)), adv)
    await idle()
    if ((await button('#undo')).on) fail(`unit ${adv} advanced (a die rolled), Undo is still enabled`)
    const before = await unit(adv)
    const cell = await ev((id) => {
      const ts = window.__ts, u = ts.G.units.find((x) => x.id === id)
      const plan = ts.q.movePlan(u, u.flags.advRoll), d = plan.res.dist
      for (let c = 0; c < d.length; c++) if (d[c] > 2 && ts.validEnd(plan, c)) return c
      return -1
    }, adv)
    if (cell >= 0) {
      await ev(({ id, c }) => window.__ts.doMove(window.__ts.G.units.find((x) => x.id === id), c), { id: adv, c: cell })
      await idle()
      await undoKey()
      const back = await unit(adv)
      if (!same(back, before) || back.moved || !back.advanced || (await button('#undo')).on) fail(`the advanced unit ${adv}'s move taken back leaves it at (${back.x}, ${back.z})${back.moved ? ', moved' : ''}${back.advanced ? '' : ', not advanced'}, Undo ${(await button('#undo')).on ? 'enabled' : 'disabled'} (back at the advance, still advanced, nothing more to take back)`)
      say(`battle: unit ${adv}'s advance leaves nothing to take back; its move after it is taken back to the advance`)
    }
  }

  // ── The battle log's lines ───────────────────────────────────────────────
  // the move made again (to where it went the first time), then a click on
  // its line
  await ev(({ u, c }) => window.__ts.doMove(window.__ts.G.units.find((x) => x.id === u), c), mv)
  await idle()
  if (!same(await unit(mv.u), movedTo)) fail(`unit ${mv.u}'s move made again lands elsewhere than the first time`)
  const k = (await count()) - 1
  const line = (await lines()).find((x) => x.k === k)
  if (!line || !/move/.test(line.text)) fail(`no line of the battle log names move ${k}, unit ${mv.u}'s (${JSON.stringify((await lines()).slice(0, 4))})`)
  const scrubbed = async () => ev(() => ({ bar: !document.querySelector('#replay').classList.contains('hidden'), label: document.querySelector('#rpLabel').textContent, seats: window.__ts.session.localSeats.length, act: !!window.__ts.phaseResolve }))
  const clickLine = async (k) => {
    await page.click(`#logList .entry[data-k="${k}"]`)
    await sleep(150)
    await idle()
  }
  await clickLine(k)
  let s = await scrubbed()
  at = await unit(mv.u)
  const ups = await Promise.all(['#endPhase', '#autoPhase', '#undo'].map(button))
  if (!s.bar || s.seats || s.act || !same(at, start) || ups.some((x) => x.up)) fail(`a click on move ${k}'s line: the bar ${s.bar ? 'up' : 'down'} ("${s.label}"), ${s.seats} seats played on the table's Session, ${s.act ? 'a phase to act in' : 'no phase'}, unit ${mv.u} at (${at.x}, ${at.z}) (before the move: (${start.x}, ${start.z})), End/Auto/Undo ${ups.map((x) => (x.up ? 'up' : 'down')).join('/')}`)
  const n1 = await count()
  await page.keyboard.press('Control+z')
  await sleep(200)
  const refused = await ev(({ u, c }) => {
    try {
      window.__ts.doMove(window.__ts.G.units.find((x) => x.id === u), c)
      return false
    } catch {
      return true
    }
  }, { u: mv.u, c: mv.c })
  if ((await count()) !== n1 || !refused) fail(`scrubbed, ${!refused ? 'a move sent through the hooks was taken' : `Ctrl-Z changed the log (${n1} → ${await count()} entries)`}`)
  say(`the log: a click on move ${k}'s line shows the battle before it ("${s.label}"), unit ${mv.u} back where it stood, no seat to act (End, Auto and Undo down, Ctrl-Z and a move refused)`)
  await press('#rpLive')
  s = await scrubbed()
  at = await unit(mv.u)
  if (s.bar || s.seats !== 2 || !s.act || !same(at, movedTo) || !(await button('#endPhase')).up) fail(`Live after a scrub: the bar ${s.bar ? 'still up' : 'away'}, ${s.seats} seats played, ${s.act ? '' : 'no '}phase to act in, unit ${mv.u} at (${at.x}, ${at.z}) (moved to (${movedTo.x}, ${movedTo.z}))`)
  say('the log: Live comes back to the battle as it stands, the bar away, the seat to act')
  await clickLine(k)
  await press('#rpClose')
  s = await scrubbed()
  if (await ev(() => !document.querySelector('#title').classList.contains('hidden'))) fail('✕ after a scrub of a battle going on went to the war room')
  if (s.bar || s.seats !== 2 || !s.act) fail(`✕ after a scrub: the bar ${s.bar ? 'still up' : 'away'}, ${s.seats} seats played, ${s.act ? '' : 'no '}phase to act in`)
  say('the log: ✕ comes back to the battle too')
  await clickLine(k)
  await page.click('#rpPlay')
  await page.waitForFunction(() => document.querySelector('#replay').classList.contains('hidden') && window.__ts.session.localSeats.length === 2, null, { timeout: IDLE_MS }).catch(() => fail('▶ after a scrub never played back to the battle'))
  await idle()
  at = await unit(mv.u)
  if (!same(at, movedTo) || !(await ev(() => !!window.__ts.phaseResolve))) fail(`▶ played back to the battle with unit ${mv.u} at (${at.x}, ${at.z}), ${(await ev(() => !!window.__ts.phaseResolve)) ? '' : 'no phase to act in'}`)
  say(`the log: ▶ plays move ${k} and on, back to the battle`)
  const first = (await lines()).filter((x) => x.k !== null).at(-1)
  await clickLine(first.k)
  s = await scrubbed()
  if (!s.bar || s.label !== 'Before the battle') fail(`a click on the deployment's line ("${first.text}", move ${first.k}) shows "${s.label}", not "Before the battle"`)
  await press('#rpLive')
  if ((await scrubbed()).bar) fail('Live from before the battle leaves the bar up')
  say(`the log: the deployment's line ("${first.text.slice(0, 30)}…") shows "Before the battle"`)
}

// One run over a build: true when every step holds
async function run(dist, quiet = false) {
  const say = (l) => quiet || console.log(`  ok   ${l}`)
  const { url, close } = await startStaticServer(dist)
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
  let ok = false
  try {
    const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage()
    page.setDefaultTimeout(IDLE_MS)
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`))
    await page.goto(`${url}/?debug&lowfi&fast&seed=4242&dice=1`)
    await page.waitForSelector('#title:not(.hidden)')
    await page.click('[data-mode="hotseat"]')
    await page.click('#setupStart')
    try {
      await check(page, say)
      ok = !errors.length
    } catch (e) {
      if (!quiet) console.log(`  FAIL ${e.message}`)
    }
    if (errors.length && !quiet) console.log(`  FAIL page errors:\n         ${errors.slice(0, 5).join('\n         ')}`)
  } finally {
    await browser.close()
    close()
  }
  return ok
}

const work = mkdtempSync(join(tmpdir(), 'undo-check-'))
let ok = false
try {
  if (a['self-test']) {
    console.log('undo-check --self-test: the unbroken build, then each broken copy\n')
    ok = await run(await buildApp(PKG, join(work, 'dist')), true)
    console.log(`  ${'unbroken'.padEnd(18)} ${ok ? 'passes' : 'FAILS'}`)
    let missed = 0
    for (const [name, [file, from, to]] of Object.entries(MUTANTS)) {
      const code = copyCode(PKG, join(work, name))
      const f = join(code, file), src = readFileSync(f, 'utf8')
      if (src.split(from).length !== 2) throw new Error(`mutant ${name}: ${file} doesn't hold what it changes`)
      writeFileSync(f, src.replace(from, to))
      const caught = !(await run(await buildApp(code, join(work, `${name}-dist`)), true))
      if (!caught) missed++
      console.log(`  ${name.padEnd(18)} ${caught ? 'caught' : 'MISSED'}`)
    }
    ok = ok && !missed
    console.log(ok ? `\nundo-check self-test passed: ${Object.keys(MUTANTS).length} broken copies each caught` : '\nundo-check self-test FAILED')
  } else {
    console.log('undo-check (F12, F15): Undo and the battle log\'s scrub in Chromium\n')
    ok = await run(a.dist ?? (await buildApp(PKG, join(work, 'dist'))))
    console.log(ok ? '\nundo-check passed: a placement, a move and an advanced move taken back (the button and Ctrl-Z), the phase still open; a log line shows the battle before its move, no seat to act, and Live, ✕ and ▶ come back' : '\nundo-check FAILED')
  }
} finally {
  rmSync(work, { recursive: true, force: true })
}
process.exit(ok ? 0 : 1)
