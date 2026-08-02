#!/usr/bin/env node
/* =====================================================================
   SMF 03 — PARTS BENCH · headless harness
   THE EXISTENCE PROOF. An autoplayer builds a known-good solution to all
   five contracts through the exact same act() API the mouse uses, with
   human-ish pacing between actions. If a contract cannot be solved this
   way, the parts list failed the pressure test.

   Also deliberately exercises the two visible failure modes mid-solve:
   - BLEND: a wrong first draft (const + square into one merge) pushes
     22/s into a 20/s trace → firstSaturation.
   - GUARD: the gate is built with a bad guess (NO mode, N=8) before
     being tuned properly; the sine hovers at 8 near each peak and the
     gate chatters → firstChatter.

   Run: node harness.mjs   (exits non-zero on any failure)
   ===================================================================== */
import { createSim, DT, PUZZLES, GW } from './src/sim.js'

const sim = createSim({ eventCap: 500 })
const S = sim.state

let ticks = 0
let wallMs = 0
function run(seconds) {
  const n = Math.round(seconds / DT)
  const t0 = performance.now()
  for (let i = 0; i < n; i++) sim.step(DT)
  wallMs += performance.now() - t0
  ticks += n
}
function runUntil(pred, capSeconds, what) {
  const n = Math.round(capSeconds / DT)
  const t0 = performance.now()
  for (let i = 0; i < n; i++) {
    sim.step(DT)
    if (pred()) { wallMs += performance.now() - t0; ticks += i + 1; return true }
  }
  wallMs += performance.now() - t0
  ticks += n
  fail(`timeout after ${capSeconds}s sim waiting for: ${what}`)
}
function fail(msg) {
  console.error(`\nHARNESS FAIL: ${msg}`)
  console.error(`  at sim T+${S.t.toFixed(1)}s, puzzle ${S.puzzle + 1}`)
  process.exit(1)
}
function assert(cond, msg) { if (!cond) fail(msg) }

// human-ish pacing: every verb costs a beat of "player time"
const BEAT = 0.4
function act(a) { sim.act(a); run(BEAT) }
const place = (part, gx, gz, dir = 0) => act({ type: 'place', part, gx, gz, dir })
const trace = (cells) => act({ type: 'traceRun', cells })
const remove = (gx, gz) => act({ type: 'remove', gx, gz })
const mode = (gx, gz) => act({ type: 'mode', gx, gz })
function tuneDrag(gx, gz, from, to) {
  // a drag, not a teleport: three intermediate settles then the final value
  for (const f of [0.35, 0.7, 1]) act({ type: 'tune', gx, gz, value: from + (to - from) * f })
}
const path = (...pts) => pts // readability

function partsUsed(boardIx) {
  const counts = {}
  for (const c of S.boards[boardIx].cells) {
    if (!c || c.fixed) continue
    counts[c.type] = (counts[c.type] || 0) + 1
  }
  return Object.entries(counts).map(([k, n]) => `${k}×${n}`).join(' ')
}

const solveLog = []
function solved(ix, t0) {
  const key = PUZZLES[ix].key
  assert(S.flags['p' + (ix + 1)], `flag p${ix + 1} not set after ${key}`)
  solveLog.push({
    key, ix,
    t0, t1: S.t,
    parts: partsUsed(ix),
    spent: S.boards[ix].spent,
  })
  console.log(`  ✔ p${ix + 1} ${key} passed at T+${S.t.toFixed(1)}s (build+hold ${(S.t - t0).toFixed(1)}s) — ${partsUsed(ix)}`)
}

console.log('SMF 03 · PARTS BENCH — headless harness (existence proof)')
console.log(`grid ${GW}×9 · DT ${DT}s · pass = 12 consecutive in-tolerance seconds\n`)

/* ---------------- 1 · HALF — valve ---------------- */
{
  const t0 = S.t
  console.log('contract 1 · HALF — from the 10/s constant, deliver 5±0.5')
  place('valve', 3, 1, 0)
  trace(path([1, 1], [2, 1], [3, 1]))
  trace(path([4, 1], [5, 1], [6, 1], [7, 1], [7, 2], [7, 3], [7, 4], [8, 4], [9, 4], [10, 4], [11, 4], [12, 4], [13, 4]))
  tuneDrag(3, 1, 1, 0.5) // drag the valve down to half
  runUntil(() => S.flags.p1, 40, 'p1 (HALF)')
  solved(0, t0)
}

/* ---------------- 2 · BLEND — two valves + merge ----------------
   First draft is wrong on purpose: const + square into the merge is
   10+12 = 22/s — the output trace saturates (cap 20). The bench shows
   the failure; the player reroutes to the sine and tunes the valves. */
{
  act({ type: 'puzzle', ix: 1 })
  const t0 = S.t
  console.log('contract 2 · BLEND — deliver 0.5·sine + 0.5·const ±1')
  place('merge', 6, 4, 0)
  place('valve', 4, 1, 0)
  trace(path([1, 1], [2, 1], [3, 1], [4, 1]))
  trace(path([5, 1], [6, 1], [6, 2], [6, 3], [6, 4])) // const → merge N side
  trace(path([7, 4], [8, 4], [9, 4], [10, 4], [11, 4], [12, 4], [13, 4])) // merge → socket
  // wrong draft: square wave straight into the merge W side
  trace(path([1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [5, 4], [6, 4]))
  run(8) // one full square period — the high phase pushes 22/s
  assert(S.flags.firstSaturation, 'firstSaturation should have fired during the BLEND draft (22/s into a 20/s trace)')
  console.log('  ✔ firstSaturation — the wrong draft congested the output trace, excess lost')
  // fix: tear out the square feed, bring in the sine instead
  for (const [gx, gz] of [[1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [5, 4]]) remove(gx, gz)
  place('valve', 2, 5, 0)
  trace(path([1, 5], [2, 5]))
  trace(path([3, 5], [4, 5], [5, 5], [6, 5], [6, 4])) // sine → merge S side
  tuneDrag(4, 1, 1, 0.5)
  tuneDrag(2, 5, 1, 0.5)
  runUntil(() => S.flags.p2, 60, 'p2 (BLEND)')
  solved(1, t0)
}

/* ---------------- 3 · STEADY — tank as averaging ----------------
   The square wave averages 6. A tank with the stock 4/s drain can only
   ever deliver 4 — the drain must be dragged up to sit just under the
   incoming average (5.7), and the tank body must swallow a 22.8-unit
   low-phase swing (hence cap 30; see README Findings). */
{
  act({ type: 'puzzle', ix: 2 })
  const t0 = S.t
  console.log('contract 3 · STEADY — from the square wave, deliver 6±1')
  place('tank', 4, 3, 0)
  trace(path([1, 3], [2, 3], [3, 3], [4, 3]))
  trace(path([5, 3], [6, 3], [7, 3], [7, 4], [8, 4], [9, 4], [10, 4], [11, 4], [12, 4], [13, 4]))
  run(6) // watch it: stock drain delivers a flat 4 — out of band
  assert(Math.abs(S.prog[2].actual - 4) < 0.75 || S.prog[2].actual === 0,
    `expected the stock 4/s drain to deliver ~4 before tuning (got ${S.prog[2].actual.toFixed(2)})`)
  tuneDrag(4, 3, 4, 5.7) // drag drain up to just under the incoming average
  runUntil(() => S.flags.p3, 90, 'p3 (STEADY)')
  solved(2, t0)
}

/* ---------------- 4 · GUARD — the two-port gate ----------------
   THE finding this bench exists to produce: a one-input threshold gate
   cannot conditionally route a different stream. SENSE (sine) and FLOW
   (const) must be separate ports. Built badly first: NO mode, N=8 —
   the sine hovers at 8 near each peak and the gate chatters. */
{
  act({ type: 'puzzle', ix: 3 })
  const t0 = S.t
  console.log('contract 4 · GUARD — deliver const while sine < 4, else 0 (±1)')
  place('gate', 7, 4, 0) // faces E: FLOW enters from W, SENSE taps in from the sides
  trace(path([1, 1], [2, 1], [3, 1], [3, 2], [3, 3], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4])) // const → FLOW
  trace(path([1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [7, 4])) // sine → SENSE (S side)
  trace(path([8, 4], [9, 4], [10, 4], [11, 4], [12, 4], [13, 4])) // gate → socket
  tuneDrag(7, 4, 6, 8) // bad first guess: "open when the sine is high"?
  run(22) // one full sine period — SENSE hovers at 8 near the peak
  assert(S.flags.firstChatter, 'firstChatter should have fired with N=8 (sine hovers at its 8 peak)')
  console.log('  ✔ firstChatter — mis-tuned gate flapped while the sine hovered at N')
  mode(7, 4) // NO → NC: pass while SENSE *below* N
  tuneDrag(7, 4, 8, 4)
  runUntil(() => S.flags.p4, 60, 'p4 (GUARD)')
  solved(3, t0)
}

/* ---------------- 5 · LATCH — the Scenario 01 rig, from parts ----
   tri → valve(0.62) → tank(stock 4/s drain) → gate SENSE
   const → valve(0.4) = 4/s → gate FLOW ; gate NO, N=3.72.
   While the tank holds charge its 4/s drain pins SENSE at 4 (≥N: open);
   when it runs dry SENSE falls to the valved triangle (<N: closed).
   The tank level IS the hysteresis memory — open ≈ tri≥6, close ≈ tri<2. */
{
  act({ type: 'puzzle', ix: 4 })
  const t0 = S.t
  console.log('contract 5 · LATCH — 4/s while latched: open ≥6, close <2')
  place('valve', 2, 7, 0)
  place('tank', 5, 7, 0)
  place('gate', 9, 4, 0)
  place('valve', 3, 1, 0)
  trace(path([1, 7], [2, 7]))
  trace(path([3, 7], [4, 7], [5, 7]))
  trace(path([6, 7], [7, 7], [8, 7], [9, 7], [9, 6], [9, 5], [9, 4])) // tank → SENSE (S side)
  trace(path([1, 1], [2, 1], [3, 1]))
  trace(path([4, 1], [5, 1], [6, 1], [6, 2], [6, 3], [6, 4], [7, 4], [8, 4], [9, 4])) // const → FLOW
  trace(path([10, 4], [11, 4], [12, 4], [13, 4]))
  tuneDrag(2, 7, 1, 0.62)
  tuneDrag(3, 1, 1, 0.4)
  tuneDrag(9, 4, 6, 3.72)
  runUntil(() => S.flags.p5, 120, 'p5 (LATCH)')
  solved(4, t0)
}

/* ---------------------------- verdict ---------------------------- */
const want = ['p1', 'p2', 'p3', 'p4', 'p5', 'firstSaturation', 'firstChatter']
for (const f of want) assert(S.flags[f], `milestone flag ${f} missing at the end`)
for (const pr of S.prog) assert(Number.isFinite(pr.actual), 'non-finite socket value')

console.log('\nMILESTONE TIMELINE')
const shown = new Set()
for (const e of S.events) {
  if (/PASSED|SATURATED|CHATTER|BENCH ONLINE|BENCH →/.test(e.msg) && !shown.has(e.msg)) {
    shown.add(e.msg)
    console.log(`  T+${e.t.toFixed(1).padStart(6)}s  ${e.msg}`)
  }
}

console.log('\nSOLVE SUMMARY')
for (const s of solveLog) {
  console.log(`  ${s.key.padEnd(7)} pass T+${s.t1.toFixed(1)}s · ${s.parts} · cost ${s.spent} matter`)
}

const usPerTick = (wallMs * 1000) / ticks
console.log(`\nPERF  ${ticks} ticks · ${wallMs.toFixed(1)} ms wall · ${usPerTick.toFixed(2)} µs/tick`)
assert(usPerTick < 500, `sim too slow: ${usPerTick.toFixed(1)} µs/tick`)

console.log('\nALL FIVE CONTRACTS SOLVED THROUGH act() — computation-as-plumbing held. ✅')
process.exit(0)
