#!/usr/bin/env node
/*
  Headless harness for SMF 01 — Dying Patch.

  This package is a faithful port: src/Scenario01.jsx stays verbatim, so
  instead of importing a src/sim.js this harness extracts the sim from the
  component source text — everything between the CONSTANTS banner comment
  and the VIEW LAYER banner comment (the `P` constants block + `createSim`).
  That slice imports nothing and touches no DOM, so it evaluates directly
  with `new Function` (nothing is stubbed).

  Run: node harness.mjs
  Asserts, in order:  start → deplete → gateClosed → alphaDorm → grow →
  resorb1 → done, with `done` before T+180 sim-seconds (~98s expected).
*/
import { readFileSync } from 'node:fs'

const SRC_URL = new URL('./src/Scenario01.jsx', import.meta.url)
const EXPECTED = ['start', 'deplete', 'gateClosed', 'alphaDorm', 'grow', 'resorb1', 'done']
const T_DONE_MAX = 180 // sim-seconds; design doc says ~98s — leave slack
const T_HARD_CAP = 300 // safety cap so a broken sim can't loop forever

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

/* ---- run the scenario to completion (no player input required) ---- */
const sim = createSim()
const times = {} // flag -> sim time when first observed true
const seen = new Set()
let ticks = 0
const wall0 = performance.now()
while (!sim.state.done && sim.state.t < T_HARD_CAP) {
  sim.step(DT)
  ticks++
  for (const k of EXPECTED) {
    if (!seen.has(k) && sim.state.flags[k]) {
      seen.add(k)
      times[k] = sim.state.t
    }
  }
}
const wallMs = performance.now() - wall0

/* ---- report ---- */
console.log('SMF 01 · DYING PATCH — headless harness')
console.log('---------------------------------------')
console.log('MILESTONE TIMELINE')
for (const k of EXPECTED) {
  const mark = k in times ? '■' : '□'
  const t = k in times ? `T+${times[k].toFixed(1).padStart(5)}s` : '   (never)'
  console.log(`  ${mark} ${t}  ${k}`)
}
console.log('PERF')
console.log(`  ticks      ${ticks}`)
console.log(`  wall ms    ${wallMs.toFixed(1)}`)
console.log(`  µs/tick    ${((wallMs * 1000) / ticks).toFixed(1)}`)

/* ---- assertions ---- */
const missing = EXPECTED.filter((k) => !(k in times))
if (missing.length)
  fail(`milestone(s) never fired: ${missing.join(', ')} (stopped at T+${sim.state.t.toFixed(1)}s)`)
for (let i = 1; i < EXPECTED.length; i++) {
  const a = EXPECTED[i - 1], b = EXPECTED[i]
  if (times[b] < times[a])
    fail(`milestones out of order: ${b} (T+${times[b].toFixed(1)}s) fired before ${a} (T+${times[a].toFixed(1)}s)`)
}
if (times.done > T_DONE_MAX)
  fail(`scenario finished too late: done at T+${times.done.toFixed(1)}s > T+${T_DONE_MAX}s`)
if (!sim.state.done) fail('sim.state.done never became true')

console.log(`\nHARNESS PASS — colony relocated at T+${times.done.toFixed(1)}s (< ${T_DONE_MAX}s)`)
