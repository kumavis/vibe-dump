/* SMF 05 — THE SEAL · headless harness
   Scripted autoplayer with human-ish reaction delays drives the whole
   scenario through act() — the same path the mouse takes — and asserts:
     (a) every milestone flag fires, in order,
     (b) computeRadius exact membership (7 modules + 2 planner stamps),
     (c) product rate craters < 40% of nominal during the leak,
     (d) product rate recovers > 90% after re-verification,
     (e) done before T_MAX.
   Exits non-zero with a clear message on any failure.                   */

import { createSim, computeRadius, DT, C } from './src/sim.js';

const T_MAX = 150;

const EXPECTED_FLAGS = [
  'start', 'sealed', 'plannerStamped', 'leak', 'radiusPreviewed',
  'sealBroken', 'fixed', 'resealed', 'reverified', 'done',
];
const EXPECTED_MODULES = [
  'FRAME-SHOP', 'HULL-YARD', 'SERVO-LAB',        // depth 1 — direct assumers
  'PANEL-LINE', 'CORE-ASSY', 'SHIP-DOCK',        // depth 2
  'EXPORT-BAY',                                  // depth 3
];
const EXPECTED_STAMPS = ['STAMP-1', 'STAMP-2'];

/* the autoplayer: seal at T+8, preview with early release at T+40,
   hold-to-commit at T+46, fix, reseal — leak is scripted in the sim. */
const SCRIPT = [
  [8.0, { type: 'seal' }],
  [40.0, { type: 'breakHold', on: true }],
  [40.6, { type: 'breakHold', on: false }],       // early release = cancel
  [46.0, { type: 'breakHold', on: true }],        // held through 1.2s = commit
  [47.8, { type: 'breakHold', on: false }],       // release after commit (no-op)
  [49.0, { type: 'fix' }],
  [52.0, { type: 'reseal' }],
];

let failures = 0;
const fail = (msg) => { failures++; console.error(`  ✗ ${msg}`); };
const ok = (msg) => { console.log(`  ✓ ${msg}`); };
const assertEq = (label, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g === w) ok(`${label}: ${g}`);
  else fail(`${label}: got ${g}, expected ${w}`);
};

const sim = createSim();
const st = sim.state;

let si = 0;
let radiusSnapshot = null;
let craterSum = 0, craterN = 0;          // ship rate during the leak, pre-break
let recovSum = 0, recovN = 0;            // ship rate after re-verification
let nominalSum = 0, nominalN = 0;        // ship rate before anything happens

const t0 = process.hrtime.bigint();
let ticks = 0;
while (st.t < T_MAX) {
  while (si < SCRIPT.length && st.t + 1e-9 >= SCRIPT[si][0]) sim.act(SCRIPT[si++][1]);
  sim.step(DT);
  ticks++;

  if (st.t > 2 && st.t <= 7.5) { nominalSum += st.rates.ship; nominalN++; }
  if (st.t > 38 && st.t <= 46) { craterSum += st.rates.ship; craterN++; }
  if (st.flags.reverified && st.t > st.reverifiedT + 2 && st.t <= st.reverifiedT + 8) {
    recovSum += st.rates.ship; recovN++;
  }
  if (st.t > 44.9 && !radiusSnapshot) radiusSnapshot = computeRadius(st, 'PLATE-A');

  if (st.flags.done && st.t > st.flagOrder.find((f) => f.k === 'done').t + 2) break;
}
const wallMs = Number(process.hrtime.bigint() - t0) / 1e6;

/* ---- report ---- */
console.log('MILESTONE TIMELINE');
for (const f of st.flagOrder) console.log(`  T+${f.t.toFixed(1).padStart(5)}s  ${f.k}`);
console.log(`PERF  ${ticks} ticks · ${wallMs.toFixed(1)} ms wall · ${((wallMs * 1000) / ticks).toFixed(2)} µs/tick`);
console.log('ASSERTIONS');

/* (a)+(b) flags fire, in order */
assertEq('flag order', st.flagOrder.map((f) => f.k), EXPECTED_FLAGS);

/* (c) radius membership, exact */
if (!radiusSnapshot) fail('no radius snapshot taken');
else {
  assertEq('radius modules (7)', radiusSnapshot.modules, EXPECTED_MODULES);
  assertEq('radius stamps (2)', radiusSnapshot.stamps, EXPECTED_STAMPS);
  assertEq('contracts downstream', radiusSnapshot.contracts, 3);
  if (radiusSnapshot.reverifyEst >= 35 && radiusSnapshot.reverifyEst <= 45)
    ok(`re-verify estimate ${radiusSnapshot.reverifyEst}s (shown as ≈ ${radiusSnapshot.reverifyRounded}s)`);
  else fail(`re-verify estimate ${radiusSnapshot.reverifyEst}s outside 35–45s`);
}

/* preview really was an early release, and the same radius both times */
const prevFlag = st.flagOrder.find((f) => f.k === 'radiusPreviewed');
const brokeFlag = st.flagOrder.find((f) => f.k === 'sealBroken');
if (prevFlag && brokeFlag && prevFlag.t < brokeFlag.t) ok(`preview (T+${prevFlag.t.toFixed(1)}) before commit (T+${brokeFlag.t.toFixed(1)})`);
else fail('preview/commit ordering wrong');

/* (d) product-rate crater and recovery */
const nominal = nominalSum / Math.max(1, nominalN);
const crater = craterSum / Math.max(1, craterN);
const recov = recovSum / Math.max(1, recovN);
if (nominal >= 0.95 * C.SHIP_NOM) ok(`nominal product ${nominal.toFixed(3)}/s (≥ 95% of ${C.SHIP_NOM})`);
else fail(`nominal product only ${nominal.toFixed(3)}/s`);
if (crater < 0.4 * C.SHIP_NOM) ok(`leak crater ${crater.toFixed(3)}/s = ${(100 * crater / C.SHIP_NOM).toFixed(0)}% of nominal (< 40%)`);
else fail(`leak crater ${crater.toFixed(3)}/s = ${(100 * crater / C.SHIP_NOM).toFixed(0)}% of nominal — not < 40%`);
if (recov > 0.9 * C.SHIP_NOM) ok(`recovery ${recov.toFixed(3)}/s = ${(100 * recov / C.SHIP_NOM).toFixed(0)}% of nominal (> 90%)`);
else fail(`recovery ${recov.toFixed(3)}/s = ${(100 * recov / C.SHIP_NOM).toFixed(0)}% of nominal — not > 90%`);

/* (e) done in time */
if (st.flags.done) ok(`done at T+${st.flagOrder.find((f) => f.k === 'done').t.toFixed(1)}s (< T_MAX ${T_MAX}s)`);
else fail(`scenario not done by T_MAX ${T_MAX}s`);

if (failures) { console.error(`\n${failures} FAILURE(S)`); process.exit(1); }
console.log('\nALL GREEN');
