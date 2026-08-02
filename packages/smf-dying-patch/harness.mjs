#!/usr/bin/env node
/*
  Headless harness for SMF 01 — Dying Patch.

  The component source stays the single source of truth: this harness
  extracts the sim from src/Scenario01.jsx — everything between the
  CONSTANTS banner comment and the VIEW LAYER banner comment (the `P`
  constants block + `createSim`). That slice imports nothing and touches
  no DOM, so it evaluates directly with `new Function`.

  The scenario is player-driven: the mold handles growth and retreat, but
  two decisions belong to the player — placing the survey beacon at Patch B
  and granting resorb authority when the mold asks. The harness therefore
  runs twice:

    1. AUTOPLAYER — makes both moves with human-ish reaction delays and
       asserts the full milestone timeline.
    2. NO-INPUT CONTROL — never acts, and asserts the colony STALLS
       (no growth, no completion): proof the player is load-bearing.

  Run: node harness.mjs
*/
import { readFileSync } from 'node:fs'

const SRC_URL = new URL('./src/Scenario01.jsx', import.meta.url)
const T_DONE_MAX = 240 // sim-seconds for the autoplayer run
const T_HARD_CAP = 400 // safety cap so a broken sim can't loop forever

function fail(msg) {
  console.error(`\nHARNESS FAIL: ${msg}`)
  process.exit(1)
}

/* ---- slice the sim: CONSTANTS banner .. VIEW LAYER banner ---- */
const src = readFileSync(SRC_URL, 'utf8')
const startM = src.match(/\/\* =+ CONSTANTS =+ \*\//)
const endM = src.match(/\/\* =+\n\s+VIEW LAYER/)
if (!startM) fail('CONSTANTS banner not found in src/Scenario01.jsx')
if (!endM) fail('VIEW LAYER banner not found in src/Scenario01.jsx')
if (endM.index <= startM.index) fail('banners found out of order — refusing to slice')
const simSrc = src.slice(startM.index, endM.index)
if (/\bimport\s|\bdocument\b|\bwindow\b|THREE\./.test(simSrc))
  fail('sliced sim source unexpectedly references imports / DOM / three.js')

const { createSim, DT } = new Function(`${simSrc}\nreturn { createSim, DT, P };`)()
if (typeof createSim !== 'function' || typeof DT !== 'number')
  fail('slice did not yield createSim() and DT')

const TRACKED = [
  'start', 'deplete', 'gateClosed', 'beaconPlaced', 'alphaDorm',
  'grow', 'resorbWanted', 'authority', 'resorb1', 'done',
]

function run({ autoplay }) {
  const sim = createSim()
  if (typeof sim.survey !== 'function' || typeof sim.grantAuthority !== 'function')
    fail('sim does not expose the player verbs survey() / grantAuthority()')
  const times = {}
  let surveyAt = null
  let grantAt = null
  let ticks = 0
  const wall0 = performance.now()
  while (!sim.state.done && sim.state.t < T_HARD_CAP) {
    sim.step(DT)
    ticks++
    for (const k of TRACKED)
      if (!(k in times) && sim.state.flags[k]) times[k] = sim.state.t
    if (autoplay) {
      // reaction delay ~1.5s after the prompting condition appears
      if (surveyAt == null && sim.state.flags.gateClosed) surveyAt = sim.state.t + 1.5
      if (surveyAt != null && sim.state.t >= surveyAt && !sim.state.flags.beaconPlaced)
        sim.survey()
      if (grantAt == null && sim.state.flags.resorbWanted) grantAt = sim.state.t + 1.5
      if (grantAt != null && sim.state.t >= grantAt && !sim.state.authority)
        sim.grantAuthority()
    }
  }
  const wallMs = performance.now() - wall0
  return { sim, times, ticks, wallMs }
}

/* ---- run 1: autoplayer ---- */
const ap = run({ autoplay: true })

console.log('SMF 01 · DYING PATCH — headless harness (player-driven)')
console.log('-------------------------------------------------------')
console.log('AUTOPLAYER TIMELINE')
for (const k of TRACKED) {
  const mark = k in ap.times ? '■' : '□'
  const t = k in ap.times ? `T+${ap.times[k].toFixed(1).padStart(5)}s` : '   (never)'
  const you = k === 'beaconPlaced' || k === 'authority' ? '  ← player move' : ''
  console.log(`  ${mark} ${t}  ${k}${you}`)
}
console.log('PERF')
console.log(`  ticks      ${ap.ticks}`)
console.log(`  wall ms    ${ap.wallMs.toFixed(1)}`)
console.log(`  µs/tick    ${((ap.wallMs * 1000) / ap.ticks).toFixed(1)}`)

const missing = TRACKED.filter((k) => !(k in ap.times))
if (missing.length)
  fail(`milestone(s) never fired: ${missing.join(', ')} (stopped at T+${ap.sim.state.t.toFixed(1)}s)`)

// Partial orders (grow vs authority can legitimately race, so no total order):
const AFTER = [
  ['start', 'deplete'], ['deplete', 'gateClosed'], ['gateClosed', 'beaconPlaced'],
  ['beaconPlaced', 'grow'], ['gateClosed', 'alphaDorm'], ['alphaDorm', 'resorbWanted'],
  ['resorbWanted', 'authority'], ['authority', 'resorb1'], ['resorb1', 'done'], ['grow', 'done'],
]
for (const [a, b] of AFTER)
  if (ap.times[b] < ap.times[a])
    fail(`ordering violated: ${b} (T+${ap.times[b].toFixed(1)}) before ${a} (T+${ap.times[a].toFixed(1)})`)
if (ap.times.done > T_DONE_MAX)
  fail(`scenario finished too late: done at T+${ap.times.done.toFixed(1)}s > T+${T_DONE_MAX}s`)

/* ---- run 2: no-input control — the player must matter ---- */
const ni = run({ autoplay: false })
console.log('\nNO-INPUT CONTROL')
console.log(`  ran to T+${ni.sim.state.t.toFixed(1)}s · grow=${!!ni.sim.state.flags.grow} · done=${ni.sim.state.done} · resorbWanted=${!!ni.sim.state.flags.resorbWanted}`)
if (ni.sim.state.done) fail('scenario completed with zero player input — the player is not load-bearing')
if (ni.sim.state.flags.grow) fail('mold grew toward B without a survey beacon — beacon is not load-bearing')
if (!ni.sim.state.flags.resorbWanted) fail('mold never asked for resorb authority in the control run')

console.log(`\nHARNESS PASS — player-driven relocation at T+${ap.times.done.toFixed(1)}s; control run stalls without the player`)
