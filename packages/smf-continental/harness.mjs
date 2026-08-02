#!/usr/bin/env node
/* =====================================================================
   SMF 06 · CONTINENTAL — headless harness
   (a) BENCHMARK: builds worlds at 5k / 20k / 50k structures, steps each a
       fixed number of ticks, prints the scaling table, asserts the 50k
       budget (≤ 120 µs/tick on this container) and bounded heap growth.
   (b) GAMEPLAY: the autoplayer waits for steady churn, pours at an
       unclaimed province and asserts migration, then starves a living
       province and asserts the trench resorptions — all through the same
       act() API the mouse uses.
   Exits non-zero with a clear message on any failure.
   ===================================================================== */

import { createSim, DT, P } from './src/sim.js';

let failed = false;
const fail = (msg) => { console.error(`  ✗ FAIL: ${msg}`); failed = true; };
const pass = (msg) => console.log(`  ✓ ${msg}`);
const hr = () => console.log('─'.repeat(64));

console.log('SMF 06 · CONTINENTAL — headless harness');
hr();

/* ---------------------------------------------------- (a) benchmark */
console.log('SCALING TABLE  (settle 400 ticks, then time 1200 ticks)');
const WARM = 400, MEASURE = 1200;
const scales = [5000, 20000, 50000];
const table = [];
for (const target of scales) {
  const sim = createSim({ target });
  for (let i = 0; i < WARM; i++) sim.step(DT);
  const t0 = performance.now();
  for (let i = 0; i < MEASURE; i++) sim.step(DT);
  const us = ((performance.now() - t0) * 1000) / MEASURE;
  table.push({ target, us, alive: sim.state.alive, dormant: sim.state.dormant });
}
console.log('  structures   µs/tick   alive    dormant');
for (const r of table) {
  console.log(
    `  ${String(r.target).padStart(10)}   ${r.us.toFixed(1).padStart(7)}   ${String(r.alive).padStart(6)}   ${String(r.dormant).padStart(7)}`,
  );
}
const us50k = table[2].us;
if (us50k <= 120) pass(`50k budget: ${us50k.toFixed(1)} µs/tick ≤ 120 µs/tick`);
else fail(`50k budget blown: ${us50k.toFixed(1)} µs/tick > 120 µs/tick`);
hr();

/* ----------------------------------------- (b) gameplay + heap watch */
console.log('GAMEPLAY  (autoplayer via act(), 50k world)');
const sim = createSim({ target: 50000 });
const S = sim.state;

if (S.builtTotal >= 50000) pass(`spawned: ${S.builtTotal} structures at boot`);
else fail(`spawned only ${S.builtTotal} structures (wanted ≥ 50000)`);

// settle, then take the heap baseline for the whole 50k run
for (let i = 0; i < 200; i++) sim.step(DT);
if (globalThis.gc) globalThis.gc();
const heap0 = process.memoryUsage().heapUsed;
let gameplayTicks = 0;
const stepN = (n) => { for (let i = 0; i < n; i++) sim.step(DT); gameplayTicks += n; };

// 1. steady state: births AND resorptions in the same minute, unattended
{
  let guard = 0;
  while (!S.flags.steadyState && guard++ < 3000) stepN(1);
  if (S.flags.steadyState) {
    pass(`steadyState at T+${S.flagT.steadyState.toFixed(0)}s ` +
      `(${S.birthsMin} births · ${S.resorbsMin} resorbs in the minute)`);
  } else fail(`steadyState never fired by T+${S.t.toFixed(0)}s`);
}

// 2. pour at an empty-ish province → migration
{
  const prospect = S.provinces.find((p) => p.pTotal === 0 && p.reserve / p.init > 0.8);
  if (!prospect) fail('no unclaimed province found to pour at');
  else {
    console.log(`  pouring at ${prospect.name} (unclaimed, reserve ${(100 * prospect.reserve / prospect.init).toFixed(0)}%)`);
    sim.act({ type: 'pour', x: prospect.x, z: prospect.z, strength: 1.2 });
    let guard = 0;
    while (!S.flags.migration && guard++ < 2400) {
      if (guard % 20 === 0) sim.act({ type: 'pour', x: prospect.x, z: prospect.z, strength: 1.2 });
      stepN(1);
    }
    if (S.flags.migration) {
      pass(`migration at T+${S.flagT.migration.toFixed(0)}s — ` +
        `${S.pourBuilds} structures built in ${prospect.name} after the pour ` +
        `(${(S.flagT.migration - S.flagT.poured).toFixed(0)}s of sim time)`);
    } else fail(`migration: only ${S.pourBuilds}/${P.migrationGoal} builds near the pour`);
  }
}

// 3. starve a living province → trench resorptions
{
  let victim = null;
  for (const p of S.provinces) {
    if (p.idx === S.lastPour.prov) continue;
    if (!victim || p.pAct > victim.pAct) victim = p;
  }
  console.log(`  starving ${victim.name} (${victim.pAct} active structures)`);
  sim.act({ type: 'starve', x: victim.x, z: victim.z });
  let guard = 0;
  while (!S.flags.starved && guard++ < 1600) {
    if (guard % 300 === 0) sim.act({ type: 'starve', x: victim.x, z: victim.z });
    stepN(1);
  }
  if (S.flags.starved) {
    pass(`starved at T+${S.flagT.starved.toFixed(0)}s — ` +
      `${S.starveResorbs} resorbed in ${victim.name}'s trench ` +
      `(${(S.flagT.starved - S.lastStarve.t < 0 ? 0 : S.flagT.starved - S.flagT.migration).toFixed(0)}s after starve act)`);
  } else fail(`starved: only ${S.starveResorbs}/${P.starveGoal} resorbed in the trench`);
}

// milestone order
{
  const want = ['spawned', 'steadyState', 'poured', 'migration', 'starved'];
  const got = S.flagOrder.filter((k) => want.includes(k));
  if (want.every((k, i) => got[i] === k)) pass(`milestone order: ${got.join(' → ')}`);
  else fail(`milestone order wrong: ${got.join(' → ')} (wanted ${want.join(' → ')})`);
}

// heap growth across the whole 50k gameplay run
{
  if (globalThis.gc) globalThis.gc();
  const growth = (process.memoryUsage().heapUsed - heap0) / 1048576;
  if (growth < 20) pass(`heap growth ${growth.toFixed(1)} MB over ${gameplayTicks} ticks (< 20 MB)`);
  else fail(`heap grew ${growth.toFixed(1)} MB (≥ 20 MB) — allocation leak in the hot loop`);
}

hr();
console.log('MILESTONE TIMELINE');
for (const k of S.flagOrder) console.log(`  T+${String(S.flagT[k].toFixed(1)).padStart(7)}s  ${k}`);
hr();
console.log('PERF SUMMARY');
console.log(`  scaling: ${table.map((r) => `${r.target / 1000}k=${r.us.toFixed(0)}µs`).join(' · ')} per tick`);
console.log(`  gameplay ran ${gameplayTicks} ticks to T+${S.t.toFixed(0)}s sim time`);
console.log(`  churn last minute: ${S.birthsMin} births · ${S.resorbsMin} resorbs`);
hr();

if (failed) { console.error('HARNESS FAILED'); process.exit(1); }
console.log('HARNESS GREEN — the continent holds');
