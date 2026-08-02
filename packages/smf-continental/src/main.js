/* =====================================================================
   SMF 06 · CONTINENTAL — SHELL
   RAF loop with a fixed accumulator, HUD, input → act().
   Chrome comes from the shared foundry shell (src/smf.css + src/briefing.js);
   this file only wires it. All player verbs go through sim.act(); the
   headless harness dispatches the exact same actions. The work-order card
   never touches the sim — pause is the shell holding speed at 0.
   ===================================================================== */

import { createSim, DT, P, DEFAULT_SEED, NCELLS } from './sim.js';
import { createView } from './view.js';
import { mountBriefing } from './briefing.js';

const $ = (id) => document.getElementById(id);
const fmt = (n) => {
  n = Math.round(n);
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 10000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
};
const fmtFull = (n) => Math.round(n).toLocaleString('en-US');

/* --------------------------------------------------------------- boot */
const canvas = $('world');
const sim = createSim();
const view = createView(canvas, sim);
const S = sim.state;

let speed = 1;
const perf = { usPerTick: 0, tickAcc: 0, msAcc: 0, tps: 0, tpsAcc: 0, tpsT: 0 };

/* ------------------------------------------------------------- inputs */
/* One brush: plain drag pours (the work order's DRAG verb), alt/ctrl or
   right-drag starves, [B] flips the brush to a pan hand for navigation. */
const drag = { on: false, mode: 'pan', px: 0, py: 0, id: -1 };
let brushArmed = true;

function setBrushLabel() {
  const b = $('brushBtn');
  b.classList.toggle('on', brushArmed);
  b.textContent = brushArmed ? 'BRUSH — POUR [B]' : 'BRUSH — PAN [B]';
  view.brush.mode = brushArmed ? 'pour' : 'pan';
}

function dispatchBrush(mx, my, mode) {
  const [wx, wz] = view.screenToWorld(mx, my);
  sim.act(mode === 'pour'
    ? { type: 'pour', x: wx, z: wz, strength: 1.2 }
    : { type: 'starve', x: wx, z: wz });
}

canvas.addEventListener('pointerdown', (e) => {
  canvas.setPointerCapture(e.pointerId);
  drag.on = true; drag.id = e.pointerId;
  drag.px = e.clientX; drag.py = e.clientY;
  const pour = e.shiftKey || brushArmed;
  drag.mode = e.button === 2 || e.ctrlKey || e.altKey ? 'starve' : pour ? 'pour' : 'pan';
  view.brush.mode = drag.mode === 'pan' ? (brushArmed ? 'pour' : 'pan') : drag.mode;
  view.brush.dragging = drag.mode !== 'pan';
  if (drag.mode !== 'pan') dispatchBrush(e.clientX, e.clientY, drag.mode);
});
canvas.addEventListener('pointermove', (e) => {
  view.brush.mx = e.clientX; view.brush.my = e.clientY; view.brush.over = true;
  if (!drag.on || e.pointerId !== drag.id) return;
  const dx = e.clientX - drag.px, dy = e.clientY - drag.py;
  drag.px = e.clientX; drag.py = e.clientY;
  if (drag.mode === 'pan') view.panBy(dx, dy);
  else dispatchBrush(e.clientX, e.clientY, drag.mode);
});
const endDrag = (e) => {
  if (e.pointerId === drag.id) { drag.on = false; drag.id = -1; view.brush.dragging = false; }
};
canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);
canvas.addEventListener('pointerleave', () => { view.brush.over = false; });
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  view.zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.0016));
}, { passive: false });

window.addEventListener('keydown', (e) => {
  if (brief && brief.isOpen()) return; // the work order holds the shift at ⏸
  if (e.key === 'b' || e.key === 'B') { brushArmed = !brushArmed; setBrushLabel(); }
  if (e.key === '1') setSpeed(0);
  if (e.key === '2') setSpeed(1);
  if (e.key === '3') setSpeed(8);
  if (e.key === '4') setSpeed(32);
});

/* -------------------------------------------------------------- speed */
function setSpeed(v) {
  speed = v;
  document.querySelectorAll('#speedRow button').forEach((b) => {
    b.classList.toggle('on', Number(b.dataset.v) === v);
  });
}
document.querySelectorAll('#speedRow button').forEach((b) => {
  b.addEventListener('click', () => setSpeed(Number(b.dataset.v)));
});
$('brushBtn').addEventListener('click', () => { brushArmed = !brushArmed; setBrushLabel(); });
$('panelToggle').addEventListener('click', () => {
  $('panel').classList.toggle('hidden');
  $('panelToggle').textContent = $('panel').classList.contains('hidden') ? '◂ TELEMETRY' : 'HIDE ▸';
});

/* ---------------------------------------------------------------- HUD */
const CHECKLIST = [
  ['spawned', '50,000 structures spawned'],
  ['steadyState', 'Steady churn — births & resorptions'],
  ['poured', 'First pour — the brush answers'],
  ['migration', '300+ structures follow the pour'],
  ['starved', '200+ resorbed in the trench'],
];
/* milestones where the verb is the player's — checklist marks them YOU: */
const PLAYER_VERB = new Set(['poured', 'starved']);
$('checklist').innerHTML = CHECKLIST
  .map(([k, label]) =>
    `<li id="ck-${k}"><b>□</b> ${PLAYER_VERB.has(k) ? '<span class="you">YOU:</span> ' : ''}${label}</li>`)
  .join('');
$('seedLine').textContent =
  `SEED 0x${DEFAULT_SEED.toString(16).toUpperCase()} · deterministic · tick ${DT * 1000} ms`;
const banner = $('banner');

function updateHud() {
  const vs = view.stats();
  const tierN = view.tier();
  // perf card — perf IS the content
  $('usTick').textContent = perf.usPerTick.toFixed(0);
  $('usBar').style.transform = `scaleX(${Math.min(1, perf.usPerTick / 250)})`;
  $('usBar').style.background =
    perf.usPerTick > 250 ? '#d96b6b' : perf.usPerTick > 120 ? '#e0973a' : '#55d6f0';
  $('drawMs').textContent = vs.drawMs.toFixed(1);
  $('drawBar').style.transform = `scaleX(${Math.min(1, vs.drawMs / 16)})`;
  $('drawBar').style.background = vs.drawMs > 8 ? '#d96b6b' : '#55d6f0';
  $('lod').textContent = `TIER ${tierN} · ×${view.cam.scale.toFixed(1)} zoom`;
  $('fieldCells').textContent = `${fmtFull(vs.litCells)} / ${fmtFull(NCELLS)} lit`;
  $('tps').textContent = `${fmt(perf.tps)} ticks/s real`;

  // organism card
  const total = S.alive + S.dormant;
  $('structTotal').textContent = fmtFull(total);
  $('structBreak').textContent =
    `${fmtFull(S.alive)} active · ${fmtFull(S.dormant)} dormant · ${fmtFull(S.resorbedTotal)} resorbed`;
  const bpm = S.t < 60 ? S.birthsRun : S.birthsMin;
  const rpm = S.t < 60 ? S.resorbsRun : S.resorbsMin;
  $('churn').textContent = `${fmtFull(bpm)} births · ${fmtFull(rpm)} resorbs /min`;
  $('matter').textContent = fmt(S.matter);
  $('income').textContent = `+${fmt(S.incomeRate)}/s`;
  let live = 0, survey = 0, dark = 0;
  for (const p of S.provinces) {
    if (p.pTotal > 0) live++;
    else if (p.scoutOn) survey++;
    else dark++;
  }
  $('provinces').textContent = `${live} colonised · ${survey} survey · ${dark} dark`;

  // wield card
  $('migCount').textContent = fmtFull(S.pourBuilds);
  $('trenchCount').textContent = fmtFull(S.starveResorbs);
  let em = 0, tr = 0;
  for (const e of S.emitters) if (e.active) em++;
  for (const t of S.trenches) if (t.active) tr++;
  $('wieldMisc').textContent =
    `${em} emitters · ${tr} trenches · pour cost ${P.pourCost} (spent ${fmt(S.pourSpent)})`;

  $('clock').textContent = `T+${S.t.toFixed(0)}s`;

  for (const [k] of CHECKLIST) {
    const li = $('ck-' + k);
    if (!li) continue;
    const on = !!S.flags[k];
    li.classList.toggle('on', on);
    li.querySelector('b').textContent = on ? '■' : '□';
  }
  $('log').innerHTML = S.events.slice(-10).reverse()
    .map((e) => `<div>T+${e.t.toFixed(0)} ${e.msg}</div>`).join('');

  // shift complete — the province was pulled to the pour AND one was eaten
  if (S.flags.migration && S.flags.starved) {
    banner.hidden = false;
    banner.textContent = 'SHIFT COMPLETE — PROVINCE REDIRECTED';
  } else {
    banner.hidden = true;
  }
}

/* ----------------------------------------------------------- RAF loop */
let last = performance.now(), acc = 0;

function loop(now) {
  const rdt = Math.min((now - last) / 1000, 0.25);
  last = now;
  acc += rdt * speed;
  let steps = 0;
  const t0 = performance.now();
  while (acc >= DT && steps < 64) { sim.step(DT); acc -= DT; steps++; }
  if (steps === 64) acc = 0; // never spiral
  const ms = performance.now() - t0;
  if (steps > 0) {
    // Only fold in batched frames (≥3 ticks): Chromium clamps
    // performance.now() to ~100µs, and single-tick bursts at ×1 mostly
    // measure the cache eviction caused by drawing, not the sim. The
    // budget is about sustained fast-forward, which is what batches are.
    if (steps >= 3) {
      perf.msAcc += ms; perf.tickAcc += steps;
      if (perf.msAcc >= 2 || perf.tickAcc >= 64) {
        const inst = (perf.msAcc * 1000) / perf.tickAcc;
        perf.usPerTick = perf.usPerTick === 0 ? inst : perf.usPerTick + (inst - perf.usPerTick) * 0.2;
        perf.msAcc = 0; perf.tickAcc = 0;
      }
    }
    perf.tpsAcc += steps;
  }
  perf.tpsT += rdt;
  if (perf.tpsT > 0.75) { perf.tps = perf.tpsAcc / perf.tpsT; perf.tpsAcc = 0; perf.tpsT = 0; }

  view.render(now / 1000, rdt);
  requestAnimationFrame(loop);
}

// seed the µs/tick stat before first paint: one batch to warm the JIT,
// a second to measure
{
  for (let i = 0; i < 24; i++) sim.step(DT);
  const t0 = performance.now();
  for (let i = 0; i < 24; i++) sim.step(DT);
  perf.usPerTick = ((performance.now() - t0) * 1000) / 24;
}

/* ---------------- WORK ORDER briefing (shared shell) ---------------- */
/* The card holds the shift at speed 0; BEGIN SHIFT (or Esc) sets ×1.
   The sim itself is never touched — harnesses see the same world. */
setBrushLabel();
setSpeed(1);
updateHud();

const brief = mountBriefing($('root'), {
  workOrder: 'FOUNDRY WORK ORDER 06',
  title: 'CONTINENTAL',
  layer: 'PERFORMANCE · WIELDING THE WHOLE ORGANISM',
  situation: 'Fifty thousand structures and one brush. The organism reads the field, not your clicks — pour value where it should live, starve what it should abandon, and watch provinces move.',
  verbs: [
    ['DRAG', 'pour survey field (costs income)'],
    ['ALT-DRAG or RIGHT-DRAG', 'starve a region'],
    ['WHEEL', 'zoom continent ↔ machine'],
  ],
  objective: 'Pull a province to your pour; make the mold eat one you starve.',
  onOpen() { setSpeed(0); },
  onBegin() { setSpeed(1); },
});

view.render(performance.now() / 1000, 0.016); // pre-warm: the continent is live behind the dimmed card
setInterval(updateHud, 200);
requestAnimationFrame(loop);

/* ------------------------------------------------- test hooks (smoke) */
window.smf = sim; // shared-shell contract: the sim itself, untouched by chrome
window.smfShell = {
  view, setSpeed, brief, act: (a) => sim.act(a),
  perf: () => ({
    usPerTick: perf.usPerTick,
    drawMs: view.stats().drawMs,
    tier: view.tier(),
    t: S.t,
    alive: S.alive, dormant: S.dormant, resorbed: S.resorbedTotal,
    flags: { ...S.flags },
  }),
};
