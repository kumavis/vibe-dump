/* =====================================================================
   SMF 05 — THE SEAL · SHELL
   RAF loop with a fixed accumulator, HUD DOM, input → act().
   Every player verb goes through act() — the harness dispatches the
   exact same actions headless.
   ===================================================================== */

import { createSim, DT, C } from './sim.js';
import { createView } from './view.js';

const PANEL_W = 308;

const CHECKLIST = [
  ['start', 'Factory nominal — PLATE-A open'],
  ['sealed', 'PLATE-A sealed — contract measured'],
  ['plannerStamped', 'Planner stamped ×2 (L5 ← L4)'],
  ['leak', 'Leak — contract PASS, behavior failing'],
  ['radiusPreviewed', 'Blast radius previewed, cancelled'],
  ['sealBroken', 'Seal broken — radius unverified'],
  ['fixed', 'Surge tank installed'],
  ['resealed', 'Resealed — richer contract'],
  ['reverified', 'Same radius re-verified in green'],
  ['done', 'Product recovered ≥ 90%'],
];

const app = document.getElementById('app');
app.innerHTML = `
  <canvas class="smf-canvas" id="cv"></canvas>
  <button class="smf-toggle" id="toggle">HIDE ▸</button>
  <div class="smf-help">click PLATE-A / SEAL to measure · press &amp; HOLD "break seal" — the red wave is the blast radius · release early to cancel, hold ${C.HOLD_COMMIT}s to commit</div>
  <div class="smf-panel" id="panel">
    <div class="smf-h1">SLIME MOLD FOUNDRY</div>
    <div class="smf-sub">SMF 05 — THE SEAL</div>
    <div class="smf-row"><span class="smf-k" id="clock">T+0.0s</span><span class="smf-dim" id="perf"></span></div>
    <div class="smf-speeds" id="speeds"></div>

    <div class="smf-card">
      <div class="smf-cardh"><span>ACTION</span><span class="smf-dim" id="phase"></span></div>
      <button class="smf-act" id="act">SEAL PLATE-A ◈</button>
      <div class="smf-actnote smf-dim" id="actnote"></div>
    </div>

    <div class="smf-card">
      <div class="smf-cardh"><span>CONTRACT — PLATE-A</span><span id="cstat">OPEN</span></div>
      <div class="smf-cyan" id="ctext">— no contract; module is open —</div>
      <div class="smf-row"><span class="smf-k" id="mlabel">avg (8s)</span><span id="mval">4.0/s</span></div>
      <div class="smf-bar"><div class="smf-fill" id="mbar"></div><div class="smf-tick" style="left:66.7%"></div></div>
      <div class="smf-paradox" id="paradox" hidden>CONTRACT: <b class="p-pass">PASS</b> · BEHAVIOR: <b class="p-fail">FAILING</b></div>
    </div>

    <div class="smf-card">
      <div class="smf-cardh"><span>THE LINE</span></div>
      <div class="smf-row"><span class="smf-k">FINAL PRODUCT (SHIP)</span><span class="smf-amber" id="ship">0.50/s</span></div>
      <div class="smf-bar"><div class="smf-fill" id="shipbar"></div><div class="smf-tick" style="left:83.3%"></div></div>
      <div class="smf-row"><span class="smf-k">EXPORT</span><span class="smf-amber" id="crate">1.0 crates/s</span></div>
      <div class="smf-k" style="margin-top:6px">DOWNSTREAM PLATE HOPPERS</div>
      <div class="smf-minirow" id="bufs"></div>
    </div>

    <div class="smf-card">
      <div class="smf-cardh"><span>PLANNER (L5)</span><span id="plstat" class="smf-dim">IDLE</span></div>
      <div class="smf-dim" id="plnote">can only place what has been sealed — no vocabulary yet</div>
    </div>

    <div class="smf-card">
      <div class="smf-cardh"><span>MILESTONES</span></div>
      <ul class="smf-check" id="check"></ul>
    </div>

    <div class="smf-card">
      <div class="smf-cardh"><span>EVENT LOG</span></div>
      <div class="smf-log" id="log"></div>
    </div>

    <div class="smf-legend">
      <span class="smf-amber">■ matter</span> · <span class="smf-cyan">■ signal / contract</span> ·
      <span class="smf-green">■ verified</span> · <span class="smf-red">■ blast radius / fault</span><br/>
      seal = 5s measured window · break = hold ${C.HOLD_COMMIT}s · re-verify ${C.VERIFY_PER}s/node
    </div>
  </div>
`;

const $ = (id) => document.getElementById(id);
const cv = $('cv');

const sim = createSim();
const view = createView(cv);
window.smf = sim; // headless-in-browser hook for smoke tests

/* ------------------------------- HUD ------------------------------- */
const checkEl = $('check');
checkEl.innerHTML = CHECKLIST.map(([k, label]) =>
  `<li data-k="${k}"><b>□</b> ${label}</li>`).join('');
const checkItems = new Map([...checkEl.querySelectorAll('li')].map((li) => [li.dataset.k, li]));

const bufsEl = $('bufs');
const BUF_IDS = ['FRAME-SHOP', 'HULL-YARD', 'SERVO-LAB'];
bufsEl.innerHTML = BUF_IDS.map((id) =>
  `<div class="smf-mini"><span>${id.split('-')[0]}</span><div class="smf-bar smf-bar-s"><div class="smf-fill" data-b="${id}"></div></div></div>`).join('');
const bufBars = new Map(BUF_IDS.map((id) => [id, bufsEl.querySelector(`[data-b="${id}"]`)]));

let speed = 1;
const speedsEl = $('speeds');
for (const [label, v] of [['⏸', 0], ['×1', 1], ['×4', 4], ['×16', 16]]) {
  const b = document.createElement('button');
  b.className = `smf-btn${v === 1 ? ' on' : ''}`;
  b.textContent = label;
  b.onclick = () => {
    speed = v;
    speedsEl.querySelectorAll('.smf-btn').forEach((x) => x.classList.remove('on'));
    b.classList.add('on');
  };
  speedsEl.appendChild(b);
}

let panelOpen = true;
$('toggle').onclick = () => {
  panelOpen = !panelOpen;
  $('panel').classList.toggle('hidden', !panelOpen);
  $('toggle').textContent = panelOpen ? 'HIDE ▸' : '◂ TELEMETRY';
  view.resize(panelOpen ? PANEL_W : 0);
};

/* ------------------------- action button --------------------------- */
const actBtn = $('act');
let holding = false;
const startHold = () => {
  const p = sim.state.phase;
  if ((p === 'sealed' || (p === 'resealed' && !sim.state.reverify)) && !holding) {
    holding = true;
    sim.act({ type: 'breakHold', on: true });
  }
};
const endHold = () => {
  if (holding) { holding = false; sim.act({ type: 'breakHold', on: false }); }
};
actBtn.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  const p = sim.state.phase;
  if (p === 'open') sim.act({ type: 'seal' });
  else if (p === 'broken' && !sim.state.surgeTank) sim.act({ type: 'fix' });
  else if (p === 'fixed') sim.act({ type: 'reseal' });
  else startHold();
});
window.addEventListener('pointerup', endHold);
actBtn.addEventListener('pointerleave', endHold);
window.addEventListener('blur', endHold);

/* canvas: click PLATE-A to seal, hold it to break */
const io = { pointer: null };
cv.addEventListener('pointermove', (e) => {
  const r = cv.getBoundingClientRect();
  io.pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
  const hit = view.hitModule(sim.state, io.pointer.x, io.pointer.y);
  cv.style.cursor = hit === 'PLATE-A' ? 'pointer' : 'default';
});
cv.addEventListener('pointerdown', (e) => {
  const r = cv.getBoundingClientRect();
  io.pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
  const hit = view.hitModule(sim.state, io.pointer.x, io.pointer.y);
  if (hit !== 'PLATE-A') return;
  const p = sim.state.phase;
  if (p === 'open') sim.act({ type: 'seal' });
  else startHold();
});
cv.addEventListener('pointerleave', () => { io.pointer = null; });

/* ------------------------------ loop -------------------------------- */
let last = performance.now(), acc = 0;
let usTick = 15, drawMs = 1;

function frame(now) {
  const rdt = Math.min((now - last) / 1000, 0.1);
  last = now;
  acc += rdt * speed;
  let steps = 0;
  const t0 = performance.now();
  while (acc >= DT && steps < 200) { sim.step(DT); acc -= DT; steps++; }
  if (steps) usTick = usTick * 0.95 + ((performance.now() - t0) * 1000 / steps) * 0.05;
  const t1 = performance.now();
  view.draw(sim.state, now / 1000, io);
  drawMs = drawMs * 0.95 + (performance.now() - t1) * 0.05;
  requestAnimationFrame(frame);
}

/* ---------------------------- HUD sync ------------------------------ */
function hudSync() {
  const st = sim.state;
  $('clock').textContent = `T+${st.t.toFixed(1)}s`;
  $('perf').textContent = `sim ${usTick.toFixed(0)}µs/tick · draw ${drawMs.toFixed(1)}ms`;
  $('phase').textContent = st.phase.toUpperCase();

  /* action button by phase */
  const p = st.phase;
  let label = '', disabled = false, note = '', danger = false;
  if (p === 'open') { label = 'SEAL PLATE-A ◈'; note = '5s measurement window writes the contract'; }
  else if (p === 'measuring') { label = `MEASURING ${(st.t - st.measureT0).toFixed(1)} / ${C.MEASURE}s`; disabled = true; }
  else if (p === 'sealed') { label = 'BREAK SEAL — HOLD'; danger = true; note = 'hold: red wave previews the blast radius · release early to cancel'; }
  else if (p === 'broken') { label = 'INSTALL SURGE TANK'; note = 'descend into the re-opened module and fix the burstiness'; }
  else if (p === 'fixed') { label = 'RESEAL PLATE-A ◈'; note = 'the failure taught the contract — it will watch 2s windows now'; }
  else if (p === 'resealing') { label = `RE-MEASURING ${(st.t - st.measureT0).toFixed(1)} / ${C.MEASURE}s`; disabled = true; }
  else if (p === 'resealed' && st.reverify) { label = `RE-VERIFYING ${st.reverify.i + 1}/${st.reverify.order.length}`; disabled = true; note = 'green wave walks the exact radius the red preview showed'; }
  else if (p === 'resealed') { label = st.flags.done ? 'BREAK SEAL — HOLD (again?)' : 'BREAK SEAL — HOLD'; danger = true; }
  actBtn.textContent = label;
  actBtn.disabled = disabled;
  actBtn.classList.toggle('danger', danger);
  actBtn.classList.toggle('holding', !!st.hold);
  $('actnote').textContent = note;

  /* contract card */
  const cs = $('cstat');
  if (p === 'open') { cs.textContent = 'OPEN'; cs.className = 'smf-dim'; }
  else if (p === 'measuring' || p === 'resealing') { cs.textContent = 'MEASURING'; cs.className = 'smf-cyan'; }
  else if (p === 'broken' || p === 'fixed') { cs.textContent = 'BROKEN'; cs.className = 'smf-red'; }
  else { cs.textContent = st.contractPass ? '◈ PASS' : '◈ FAIL'; cs.className = st.contractPass ? 'smf-green' : 'smf-red'; }
  $('ctext').textContent =
    st.contract ? (st.contract.windowed ? 'PLATE ≥ 4/s per ANY 2s window' : 'PLATE ≥ 4/s (sustained avg)')
      : p === 'broken' || p === 'fixed' ? '— contract void; seal was broken —'
        : '— no contract; module is open —';
  const windowed = st.contract && st.contract.windowed;
  $('mlabel').textContent = windowed ? 'worst 2s window' : 'avg (8s window)';
  const mv = windowed ? st.rates.win2 : st.rates.plateAvg;
  $('mval').textContent = `${mv.toFixed(2)}/s`;
  const mbar = $('mbar');
  mbar.style.transform = `scaleX(${Math.min(mv / 6, 1)})`;
  mbar.style.background = !st.contract ? '#566068' : st.contractPass ? '#9fd65a' : '#d96b6b';
  const par = $('paradox');
  par.hidden = !st.paradox;

  /* line card */
  $('ship').textContent = `${st.rates.ship.toFixed(2)}/s · ${(st.rates.shipAvg5 / C.SHIP_NOM * 100).toFixed(0)}%`;
  const sb = $('shipbar');
  sb.style.transform = `scaleX(${Math.min(st.rates.shipAvg5 / 0.6, 1)})`;
  sb.style.background = st.rates.shipAvg5 >= 0.45 ? '#e0973a' : st.rates.shipAvg5 > 0.2 ? '#a06a2a' : '#d96b6b';
  $('crate').textContent = `${st.rates.crate.toFixed(1)} crates/s`;
  for (const id of BUF_IDS) {
    const inp = st.byId[id].ins[0];
    const el = bufBars.get(id);
    el.style.transform = `scaleX(${Math.max(0, Math.min(inp.buf / inp.cap, 1))})`;
    el.style.background = inp.starved ? '#d96b6b' : st.t - inp.lastSpillT < 0.4 ? '#e6c15a' : '#e0973a';
  }

  /* planner */
  const pl = st.planner;
  const pls = $('plstat');
  pls.textContent = pl.status.toUpperCase();
  pls.className = pl.status === 'halted' ? 'smf-red' : pl.status === 'active' ? 'smf-green' : 'smf-dim';
  $('plnote').textContent =
    pl.status === 'idle' ? 'can only place what has been sealed — no vocabulary yet'
      : pl.status === 'planning' ? 'vocabulary acquired: PLATE — siting stamps'
        : pl.status === 'stamping' ? 'stamping PLATE-A′ ×2 on the MINE-C field'
          : pl.status === 'halted' ? 'HALTED — its vocabulary word is broken'
            : '2 stamps placed · PANEL-LINE fed';

  /* milestones */
  for (const [k, li] of checkItems) {
    const on = !!st.flags[k];
    li.classList.toggle('on', on);
    li.querySelector('b').textContent = on ? '■' : '□';
  }

  /* log */
  $('log').innerHTML = st.events.slice(-11).reverse()
    .map((e) => `<div>T+${e.t.toFixed(0)} ${escapeHtml(e.msg)}</div>`).join('');
}
function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

view.resize(PANEL_W);
view.draw(sim.state, 0, io);   // first painted frame is the running factory
hudSync();
setInterval(hudSync, 200);
window.addEventListener('resize', () => view.resize(panelOpen ? PANEL_W : 0));
requestAnimationFrame((t) => { last = t; requestAnimationFrame(frame); });
