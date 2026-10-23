// playback-check (DESIGN §4.2.9's row; V1): batched playback. The batch
// rule is present/pace.js's (batchAt, batchesOf, playTime), a pure
// function of an event stream, so its checks run here in Node over the
// event streams the corpus battles make (each AI battle as createMatch plays
// it, each human log folded entry by entry) and over AI battles on the Grand
// fixture (sim/fixtures/grand.mjs, until F8b gives the core a Grand board):
//   - every batch holds two or more walks of one seat and nothing but walks
//     and instant events (a focus, a pause of 0.2 s or less, objectives,
//     status, act, log, a tray opened, an advance's dice, a checkpoint: this
//     check's own list, not pace.js's); its walks start at least
//     PACE.stagger apart, and none before the last smash of a wreck before
//     it has played (the walk's timing worked out here again, as
//     view/units.js walks); and the steps cut the stream end to end, in
//     order (the player folds every event in order: nothing is reordered);
//   - each phase plays no longer batched than one at a time (the report:
//     the phases the table plays in one go, an AI's or a watched battle's;
//     a phase played here waits on its player between commands);
//   - a Grand movement phase plays in 8 s or less, batched (the budget,
//     DESIGN §4.2.1); the report gives each kind of phase's average and
//     longest, and a battle's, one at a time and batched.
// --browser also watches a battle in Chromium (?debug&fast, a fresh build):
// it must play batches (the player's count) and end with no page error,
// and with the HUD's ⇉ off (one at a time) a second battle plays none.
//
//   node sim/playback-check.mjs [--browser] [--boards N] [--self-test]
//
// --self-test breaks a copy of present/pace.js one way at a time (a batch
// across seats, walks after a wreck let go before its smashes, a charge's
// dice let through, a single walk called a batch) and expects each to be caught. Exit 0 when
// everything holds.
import { parseArgs } from 'node:util'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadCorpus, buildApp } from './lib.mjs'
import { jobSetup } from './run.mjs'
import { buildGrand, grandSetup } from './fixtures/grand.mjs'

const PKG = fileURLToPath(new URL('..', import.meta.url))
const { values: a } = parseArgs({ options: { browser: { type: 'boolean' }, boards: { type: 'string' }, 'self-test': { type: 'boolean' } } })
const BUDGET = 8

// when a walk's last smash plays (view/units.js's walk: a tween of
// L / speed + 0.15 s, easeInOut, over L + 0.15·speed inches), found here by
// bisection rather than pace.js's inverse
const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
function lastSmash(e) {
  if (!e.smashes?.length) return 0
  const speed = e.speed || 6, L = e.L ?? 0, T = L / speed + 0.15, s = Math.max(...e.smashes.map((x) => x.s ?? L))
  let lo = 0, hi = 1
  for (let k = 0; k < 60; k++) {
    const mid = (lo + hi) / 2
    if (Math.min(L, ease(mid) * (L + speed * 0.15)) >= s) hi = mid
    else lo = mid
  }
  return T * hi
}

// this check's own idea of what may sit inside a batch
const quiet = (e) => ['focus', 'objectives', 'status', 'act', 'log', 'tray.open', 'check'].includes(e.t) || (e.t === 'pause' && (e.s ?? 0) <= 0.2) || (e.t === 'dice' && /^Advance/.test(e.label ?? ''))

// the event stream of a battle: an AI battle as createMatch plays it, a
// human log's entries applied one by one
function streamOf(core, setup, entries = []) {
  const G = core.createMatch(setup, { out: [] })
  const events = G.out.splice(0)
  for (const { s, ...body } of entries) {
    core.apply(G, s, body)
    events.push(...G.out.splice(0))
  }
  const side = new Map(G.units.map((u) => [u.id, u.side]))
  return { events, sideOf: (u) => side.get(u) }
}

// the rule's steps over one stream, held to the properties above; adds to
// `acc` each phase's times
function judge(P, { events, sideOf }, acc, name) {
  const steps = P.batchesOf(events, sideOf)
  let at = 0
  for (const b of steps) {
    if (b.from !== at || !(b.to > b.from)) return `${name}: the steps don't cut the stream end to end (a step at ${b.from}–${b.to} after ${at})`
    at = b.to
    if (!b.walks) continue
    acc.batches++
    acc.walks += b.walks.length
    if (b.walks.length < 2) return `${name}: a batch of ${b.walks.length} walk at event ${b.from}`
    const sides = new Set(b.walks.map((j) => sideOf(events[j].u)))
    if (sides.size !== 1) return `${name}: a batch at event ${b.from} walks both seats`
    for (let j = b.from; j < b.to; j++) {
      const e = events[j]
      if (e.t === 'unit.move') {
        if (!b.walks.includes(j)) return `${name}: a walk at event ${j} inside a batch but not in it`
      } else if (!quiet(e)) return `${name}: a ${e.t}${e.label ? ` (${e.label})` : ''} at event ${j} inside a batch`
    }
    // the walks' starts: PACE.stagger apart, none before an earlier wreck's
    // last smash
    let gate = 0
    for (const [n, j] of b.walks.entries()) {
      const t = b.starts[n]
      if (n && t < b.starts[n - 1] + P.PACE.stagger - 1e-9) return `${name}: walks ${n - 1} and ${n} of a batch at event ${b.from} start ${(t - b.starts[n - 1]).toFixed(2)} s apart`
      if (t < gate - 1e-6) return `${name}: walk ${n} of a batch at event ${b.from} starts at ${t.toFixed(2)} s, before an earlier wreck's last smash at ${gate.toFixed(2)} s`
      gate = Math.max(gate, t + lastSmash(events[j]))
      if (lastSmash(events[j]) > 0) acc.wrecks++
    }
  }
  if (at !== events.length) return `${name}: the steps end at ${at} of ${events.length}`
  // each phase, one at a time and batched
  let from = 0, kind = 'setup'
  // (a phase played here, by a human, waits on the player between its
  // commands, `pending`: it is timed, never reported, as the table never
  // plays it in one go)
  const close = (to) => {
    const seg = events.slice(from, to)
    const one = P.playTime(seg, sideOf, false), two = P.playTime(seg, sideOf, true)
    if (!seg.some((e) => e.t === 'pending')) (acc.phases[kind] ??= []).push([one, two])
    return two > one + 1e-9 ? `${name}: a ${kind} phase plays longer batched (${two.toFixed(2)} s) than one at a time (${one.toFixed(2)} s)` : null
  }
  for (let i = 0; i < events.length; i++) {
    if (events[i].t !== 'phase.start') continue
    const why = close(i)
    if (why) return why
    from = i
    kind = events[i].phase
  }
  const why = close(events.length)
  if (why) return why
  acc.battles.push([P.playTime(events, sideOf, false), P.playTime(events, sideOf, true)])
  return null
}

// The rule on streams made up to hold what the corpus never puts side by
// side: each must cut exactly as `want` says (a batch's walks' indices, or
// none), its every batch also judged as above.
const walk = (u, extra = {}) => ({ t: 'unit.move', u, L: 6, speed: 6, smashes: [], ...extra })
const CASES = [
  ['two seats', [walk(1), { t: 'focus' }, walk(2), { t: 'focus' }, walk(9), walk(10)], [[0, 2], [4, 5]]],
  ["a charge's dice", [walk(1), { t: 'dice', label: 'Charge 2D6', dice: [3, 4] }, walk(2)], []],
  ['a long pause', [walk(1), { t: 'pause', s: 0.5 }, walk(2)], []],
  ['a wound', [walk(1), { t: 'unit.wound', u: 9 }, walk(2), walk(3)], [[2, 3]]],
  ['advance dice', [{ t: 'tray.open' }, { t: 'dice', label: 'Advance D6', dice: [4] }, walk(1), { t: 'tray.open' }, { t: 'dice', label: 'Advance D6', dice: [2] }, walk(2)], [[2, 5]]],
  ['a wreck', [walk(1, { smashes: [{ s: 3 }] }), walk(2), walk(3)], [[0, 1, 2]]],
]
const SIDE = (u) => (u < 9 ? 0 : 1)
function rules(P) {
  for (const [what, events, want] of CASES) {
    const got = P.batchesOf(events, SIDE).filter((b) => b.walks).map((b) => b.walks)
    if (JSON.stringify(got) !== JSON.stringify(want)) return `the rule on "${what}": batches ${JSON.stringify(got)}, should be ${JSON.stringify(want)}`
    const why = judge(P, { events, sideOf: SIDE }, { batches: 0, walks: 0, wrecks: 0, phases: {}, battles: [] }, what)
    if (why) return why
  }
  const adv = P.batchesOf(CASES[4][1], SIDE).find((b) => b.walks)
  if (JSON.stringify(adv?.dice) !== '[4,2]') return `the rule on "advance dice": the batch's row holds ${JSON.stringify(adv?.dice)}, should be [4,2]`
  return null
}

const avg = (xs) => xs.reduce((s, x) => s + x, 0) / Math.max(1, xs.length)
const fmt = (pairs = []) => !pairs.length ? 'none timed' : `avg ${avg(pairs.map((p) => p[0])).toFixed(1)} → ${avg(pairs.map((p) => p[1])).toFixed(1)} s, longest ${Math.max(...pairs.map((p) => p[0])).toFixed(1)} → ${Math.max(...pairs.map((p) => p[1])).toFixed(1)} s`

async function run(paceDir, { boards = 4, say = console.log } = {}) {
  const P = await import(pathToFileURL(join(paceDir, 'present', 'pace.js')).href)
  const core = await import(pathToFileURL(join(PKG, 'core', 'index.js')).href)
  const bad = []
  const why = rules(P)
  if (why) bad.push(why)
  say(`  ${why ? 'FAIL' : 'ok  '} the rule on ${CASES.length} made-up streams (two seats, a charge's dice, a long pause, a wound, advance dice in one row, a wreck)`)
  // classic: the corpus
  const classic = { batches: 0, walks: 0, wrecks: 0, phases: {}, battles: [] }
  for (const it of loadCorpus().items) {
    const why = judge(P, streamOf(core, jobSetup(it.job), it.job.entries ?? []), classic, it.id)
    if (why) bad.push(why)
  }
  say(`  ${bad.length ? 'FAIL' : 'ok  '} classic, ${classic.battles.length} corpus battles: ${classic.batches} batches (${(classic.walks / Math.max(1, classic.batches)).toFixed(1)} walks each, ${classic.wrecks} wrecks among them), every one a seat's walks and instant events, in order, the walks after a wreck held back to its last smash`)
  say(`       an AI's movement phase ${fmt(classic.phases.move)}; a battle ${fmt(classic.battles)}`)
  // Grand: the fixture's AI battles, with the presets
  const grand = { batches: 0, walks: 0, wrecks: 0, phases: {}, battles: [] }
  const { dir } = await buildGrand({ caps: false, from: PKG })
  const gcore = await import(pathToFileURL(join(dir, 'core', 'index.js')).href)
  for (let b = 1; b <= boards; b++) {
    const why = judge(P, streamOf(gcore, grandSetup(b, 7 + 2 * b)), grand, `Grand board ${b}`)
    if (why) bad.push(why)
  }
  const worst = Math.max(0, ...(grand.phases.move ?? []).map((p) => p[1]))
  if (worst > BUDGET) bad.push(`Grand: a movement phase plays ${worst.toFixed(1)} s batched, over its ${BUDGET} s`)
  say(`  ${bad.length ? 'FAIL' : 'ok  '} Grand, ${boards} AI battles (the fixture, the presets): ${grand.batches} batches (${(grand.walks / Math.max(1, grand.batches)).toFixed(1)} walks each, ${grand.wrecks} wrecks among them)`)
  say(`       an AI's movement phase ${fmt(grand.phases.move)} (budget ${BUDGET} s); a battle ${fmt(grand.battles)}`)
  for (const b of bad.slice(0, 6)) say(`       ${b}`)
  return bad.length ? 1 : 0
}

// the browser: a watched battle batched, then one at a time
async function browser() {
  const { chromium } = await import('playwright')
  const { startStaticServer } = await import('../../../scripts/static-server.mjs')
  const work = mkdtempSync(join(tmpdir(), 'playback-check-'))
  try {
    const dist = await buildApp(PKG, join(work, 'dist'))
    const { url, close } = await startStaticServer(dist)
    const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
    try {
      const page = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage()
      const errors = []
      page.on('pageerror', (e) => errors.push(e.message))
      await page.goto(`${url}/?debug&fast&seed=4242&dice=99`)
      await page.waitForSelector('#title:not(.hidden)', { timeout: 120000 })
      const watch = async () => {
        await page.click('[data-mode="watch"]')
        await page.click('#setupStart')
        await page.waitForFunction(() => window.__ts.session?.status === 'over' && window.__ts.player.idle, null, { timeout: 600000, polling: 500 })
        return page.evaluate(() => window.__ts.player.batches)
      }
      const one = await watch()
      await page.click('#again')
      await page.waitForSelector('#title:not(.hidden)')
      // (the HUD's ⇉, pressed from the title, under which it sits: the
      // setting is kept for the next battle, which under ?fast plays at once)
      await page.evaluate(() => document.querySelector('#batch').click())
      const before = await page.evaluate(() => window.__ts.player.batches)
      const two = (await watch()) - before
      const ok = one > 0 && two === 0 && !errors.length
      console.log(`  ${ok ? 'ok  ' : 'FAIL'} Chromium: a watched battle played ${one} batches; with ⇉ off (one at a time) the next played ${two}${errors.length ? `; page errors: ${errors.slice(0, 3).join('; ')}` : ''}`)
      return ok ? 0 : 1
    } finally {
      await b.close()
      close()
    }
  } finally {
    rmSync(work, { recursive: true, force: true })
  }
}

const MUTANTS = [
  ['cross-seat', '      if (side !== null && sideOf(e.u) !== side) break', ''],
  ['smash-ungated', '    gate = Math.max(gate, t + smashDone(events[j]))', '    gate = 0'],
  ['charge-dice', "const isAdvanceDice = (e) => e.t === 'dice' && /^Advance/.test(e.label ?? '')", "const isAdvanceDice = (e) => e.t === 'dice'"],
  ['one-walk', '  if (walks.length < 2) return null', '  if (walks.length < 1) return null'],
]

if (a['self-test']) {
  console.log('playback-check self-test: each broken batch rule caught\n')
  let bad = 0
  for (const [name, from, to] of MUTANTS) {
    const dir = mkdtempSync(join(tmpdir(), `playback-${name}-`))
    try {
      cpSync(join(PKG, 'present'), join(dir, 'present'), { recursive: true })
      writeFileSync(join(dir, 'package.json'), JSON.stringify({ type: 'module', private: true }))
      const p = join(dir, 'present', 'pace.js'), text = readFileSync(p, 'utf8')
      if (text.split(from).length !== 2) {
        console.log(`  FAIL ${name}: its anchor is not in present/pace.js exactly once (stale mutant)`)
        bad++
        continue
      }
      writeFileSync(p, text.replace(from, () => to))
      const lines = []
      const failed = await run(dir, { boards: 2, say: (l) => lines.push(l) })
      const why = lines.find((l) => /^ {7}\S/.test(l) && !/movement phase/.test(l))?.trim() ?? ''
      console.log(`  ${failed ? 'ok  ' : 'FAIL'} ${name.padEnd(16)} ${failed ? `caught: ${why.slice(0, 110)}` : 'not caught'}`)
      if (!failed) bad++
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  }
  console.log(bad ? `\nplayback-check self-test FAILED: ${bad} problem(s)` : `\nplayback-check self-test passed: ${MUTANTS.length} broken rules, each caught`)
  process.exit(bad ? 1 : 0)
}

console.log('playback-check (V1): batched playback, the batch rule over the corpus and Grand event streams\n')
let failed = await run(PKG, { boards: Number(a.boards) || 4 })
if (a.browser) failed |= await browser()
console.log(failed ? '\nplayback-check FAILED' : '\nplayback-check passed: walks batch only as the rule says, nothing reordered, and every phase plays no longer batched; a Grand movement phase within its budget')
process.exit(failed)
