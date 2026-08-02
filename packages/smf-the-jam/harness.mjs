/* =====================================================================
   SMF 02 — THE JAM · headless harness
   Autoplayer plays through act() only, with human-ish reaction delays:
   - clears jams manually (~1.2s reaction) until automation covers them
   - buys lanes as affordable (holds expansion during the storm)
   - adopts probes + responder bots after fluency
   - installs the tank on the flapping lane ~2s after the storm flags
   Asserts the milestone order, the toil curve, the storm queue depths,
   and the quota deadline. Prints the timeline and perf stats.
   ===================================================================== */
import { performance } from 'node:perf_hooks';
import { createSim, DT, P, MILESTONES, laneCost } from './src/sim.js';

const T_MAX = 480;

const fail = (msg) => {
  console.error(`\nFAIL: ${msg}`);
  process.exit(1);
};
const ok = (msg) => console.log(`  ok  ${msg}`);

/* ------------------------------------------------------------------ */
const sim = createSim();
const S = sim.state;

let nextClearOk = 0;   // min gap between manual clears (human hands)

function policy() {
  const t = S.t;
  const active = S.lanes.filter((l) => l.active).length;

  /* Manual clears: 1.2s reaction, one clear per 0.35s. Once a lane is
     probed and a bot exists, leave it to the responders; after the storm
     is quelled, trust automation entirely. */
  if (t >= nextClearOk && !S.flags.stormQuelled) {
    for (const l of S.lanes) {
      if (!l.jam || t - l.jam.t0 < 1.2) continue;
      if (l.probe && S.bots.length > 0) continue;
      sim.act({ type: 'clear', laneIx: l.ix });
      nextClearOk = t + 0.35;
      break;
    }
  }

  /* Purchases, one per tick, in priority order. */
  const stormRaging = S.flags.storm && !S.flags.stormQuelled;

  // The fix first: tank on the flapping lane, ~2s after the storm flags.
  if (S.flags.storm && !S.flags.tankInstalled && S.stormLane >= 0
    && t >= S.flagT.storm + 2 && S.matter >= P.tankCost) {
    sim.act({ type: 'buyTank', laneIx: S.stormLane });
    return;
  }
  if (stormRaging) return; // heads down during the storm — no expansion

  if (S.flags.fluency) {
    if (S.bots.length === 0 && S.matter >= P.botCost) { sim.act({ type: 'buyBot' }); return; }
    const un = S.lanes.find((l) => l.active && !l.probe);
    if (un && S.matter >= P.probeCost) { sim.act({ type: 'buyProbe', laneIx: un.ix }); return; }
    if (!un && S.bots.length < P.maxBots && S.matter >= P.botCost) { sim.act({ type: 'buyBot' }); return; }
  }
  if (active < P.maxLanes && S.matter >= laneCost(active)) sim.act({ type: 'buyLane' });
}

/* ------------------------------------------------------------------ */
let ticks = 0;
const t0 = performance.now();
while (S.t < T_MAX && !S.flags.quota) {
  policy();
  sim.step(DT);
  ticks++;
}
const wallMs = performance.now() - t0;
const usPerTick = (wallMs * 1000) / ticks;

/* ---------------- timeline ---------------------------------------- */
console.log('SMF 02 — THE JAM · headless run\n');
console.log('  MILESTONE TIMELINE');
for (const [k, label] of MILESTONES) {
  const tt = S.flagT[k];
  console.log(`    ${tt !== undefined ? `T+${tt.toFixed(1).padStart(6)}s` : '     —   '}  ${k.padEnd(15)} ${label}`);
}
console.log('\n  TOIL CURVE');
console.log(`    manual clears        ${S.manualClears}`);
console.log(`    auto clears          ${S.autoClears}  (+${S.ghostVisits} ghost visits)`);
console.log(`    alerts minted        ${S.alertsMinted}`);
console.log(`    HANDS peak pre-auto  ${S.stats.handsPeakPre.toFixed(1)}/min`);
console.log(`    HANDS at end         ${S.handsRate.toFixed(1)}/min  (last manual T+${S.lastManualT.toFixed(1)}s)`);
console.log('\n  STORM');
console.log(`    peak bay queue       ${S.stats.peakQueueStorm} (storm) / ${S.stats.peakQueue} (overall)`);
console.log(`    queue at quell       ${S.stats.queueAtQuell}`);
console.log(`    final bay queue      ${S.queue.length}`);
console.log('\n  PERF');
console.log(`    ticks ${ticks} · sim time T+${S.t.toFixed(1)}s · wall ${wallMs.toFixed(1)}ms · ${usPerTick.toFixed(2)}µs/tick`);
console.log(`    banked ${S.banked.toFixed(0)} · spendable ${S.matter.toFixed(0)}\n`);

/* ---------------- assertions --------------------------------------- */
console.log('  ASSERTIONS');

// (a) every milestone fired
for (const [k] of MILESTONES) if (!S.flags[k]) fail(`milestone '${k}' never fired`);
ok('all 10 milestones fired');

// (b) in order
let prev = -1, prevK = '(start)';
for (const [k] of MILESTONES) {
  const tt = S.flagT[k];
  if (tt < prev) fail(`milestone order violated: '${k}' (T+${tt.toFixed(1)}) before '${prevK}' (T+${prev.toFixed(1)})`);
  prev = tt; prevK = k;
}
ok('milestones fired in spec order');

// (c) toil curve: peak >= 4/min before automation, 0 in the final stretch
if (S.stats.handsPeakPre < 4) fail(`HANDS peak pre-automation ${S.stats.handsPeakPre.toFixed(1)}/min < 4/min`);
ok(`HANDS peaked at ${S.stats.handsPeakPre.toFixed(1)}/min before the first probe`);
if (S.handsRate !== 0) fail(`HANDS at end is ${S.handsRate.toFixed(1)}/min, expected 0`);
if (S.t - S.lastManualT < 60) fail(`last manual clear only ${(S.t - S.lastManualT).toFixed(1)}s before the end`);
ok(`0 manual clears in the final ${(S.t - S.lastManualT).toFixed(0)}s`);

// (d) storm queue depths
if (S.stats.peakQueueStorm <= 5) fail(`bay queue peaked at ${S.stats.peakQueueStorm} during the storm, expected > 5`);
ok(`bay queue peaked at ${S.stats.peakQueueStorm} during the storm (> 5)`);
if (S.stats.queueAtQuell >= 2) fail(`queue at stormQuelled was ${S.stats.queueAtQuell}, expected < 2`);
if (S.queue.length >= 2) fail(`final bay queue ${S.queue.length}, expected < 2`);
ok(`bay queue back under 2 after the tank (${S.stats.queueAtQuell} at quell, ${S.queue.length} at end)`);

// (e) quota under T_MAX
if (S.flagT.quota > T_MAX) fail(`quota at T+${S.flagT.quota.toFixed(1)}s, past T_MAX ${T_MAX}s`);
ok(`quota banked at T+${S.flagT.quota.toFixed(1)}s (limit ${T_MAX}s)`);

// (f) wall clock sanity
if (wallMs > 5000) fail(`harness took ${wallMs.toFixed(0)}ms wall time`);
ok(`fast: ${usPerTick.toFixed(2)}µs/tick`);

console.log('\nPASS');
