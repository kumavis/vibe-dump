/* =====================================================================
   SMF 02 — THE JAM · shell
   RAF loop with a fixed accumulator (DT=0.1, fast-forward = more ticks),
   HUD DOM, input -> act(). The harness dispatches the same actions.
   ===================================================================== */
import { createSim, DT, P, G, MILESTONES, laneY, laneCost, clamp } from './sim.js';
import { createView } from './view.js';

const sim = createSim();
const canvas = document.getElementById('game');
const view = createView(canvas);

const ui = { tool: null };
let speed = 1;

/* expose for the browser smoke test */
window.smf = sim;
window.smfShell = { view, ui, setSpeed: (v) => setSpeed(v) };

/* ------------------------------ HUD ------------------------------ */
const hud = document.getElementById('hud');
hud.innerHTML = `
  <div class="smf-h1">SLIME MOLD FOUNDRY</div>
  <div class="smf-sub">SMF 02 — THE JAM</div>
  <div class="smf-row"><span class="smf-k" id="hClock">T+0.0s</span>
    <span class="smf-amber" id="hMatter">MATTER 25</span></div>
  <div style="margin:7px 0 4px" id="hSpeed"></div>

  <div class="smf-card">
    <div class="smf-cardh"><span>FACTORY</span><span class="smf-dim" id="hLanes">2/8 LANES</span></div>
    <div class="smf-row"><span class="smf-k">QUOTA</span><span class="smf-amber" id="hQuota">0 / 1500</span></div>
    <div class="smf-bar"><div class="smf-fill" id="bQuota" style="transform:scaleX(0)"></div></div>
    <div class="smf-row"><span class="smf-k">THROUGHPUT</span><span id="hTp">4.0 /s</span></div>
    <button class="smf-btn amber" id="btnLane">+ LANE — 40</button>
  </div>

  <div class="smf-card">
    <div class="smf-cardh"><span>HANDS</span><span id="hHandsN" class="smf-amber">0.0/min</span></div>
    <div class="smf-bar"><div class="smf-fill" id="bHands" style="transform:scaleX(0)"></div>
      <div class="smf-tick" style="left:50%"></div></div>
    <div class="smf-row"><span class="smf-k">MANUAL / AUTO</span><span id="hClears">0 / 0</span></div>
  </div>

  <div class="smf-card locked" id="cardPalette">
    <div class="smf-cardh"><span>SIGNAL PALETTE</span><span class="smf-cyan">earned ×12</span></div>
    <button class="smf-btn" id="btnProbe">◇ PROBE — 15</button><button class="smf-btn" id="btnBot">▣ RESPONDER — 25</button>
    <button class="smf-btn hiddenb" id="btnTank">◫ TANK — 20</button>
    <div class="smf-dim" id="hToolHint" style="margin-top:4px">probe a lane: silence trips its gate</div>
  </div>

  <div class="smf-card">
    <div class="smf-cardh"><span>ALERT BAY</span><span id="hQueueN" class="smf-dim">QUEUE 0</span></div>
    <div class="smf-row"><span class="smf-k">RESPONDERS</span><span class="smf-green" id="hBots">0 hired</span></div>
    <div class="smf-row"><span class="smf-k">ALERTS MINTED</span><span class="smf-cyan" id="hMint">0</span></div>
    <div class="smf-row"><span class="smf-k">GHOST VISITS</span><span class="smf-dim" id="hGhost">0</span></div>
  </div>

  <div class="smf-card">
    <div class="smf-cardh"><span>MILESTONES</span></div>
    <ul class="smf-check" id="hCheck"></ul>
  </div>

  <div class="smf-card">
    <div class="smf-cardh"><span>EVENT LOG</span></div>
    <div class="smf-log" id="hLog"></div>
  </div>

  <div class="smf-legend">
    <span class="smf-amber">■ matter</span> · <span class="smf-cyan">■ signal</span> ·
    <span class="smf-green">■ responders</span> · <span class="smf-red">■ fault</span><br>
    gate trips after ${P.gateTrip}s of silence · tank band ${P.tankLo}–${P.tankHi} of ${P.tankCap}
  </div>
  <div class="smf-perf" id="hPerf">sim —µs/tick · draw —ms</div>
`;

const $ = (id) => document.getElementById(id);
const el = {
  clock: $('hClock'), matter: $('hMatter'), lanes: $('hLanes'), quota: $('hQuota'),
  bQuota: $('bQuota'), tp: $('hTp'), handsN: $('hHandsN'), bHands: $('bHands'),
  clears: $('hClears'), palette: $('cardPalette'), queueN: $('hQueueN'),
  bots: $('hBots'), mint: $('hMint'), ghost: $('hGhost'), check: $('hCheck'),
  log: $('hLog'), perf: $('hPerf'), toolHint: $('hToolHint'),
  btnLane: $('btnLane'), btnProbe: $('btnProbe'), btnBot: $('btnBot'), btnTank: $('btnTank'),
};

for (const [k, label] of MILESTONES) {
  const li = document.createElement('li');
  li.id = `ms-${k}`;
  li.innerHTML = `<b>□</b> ${label}`;
  el.check.appendChild(li);
}

/* speed buttons */
const speedBtns = [];
[['⏸', 0], ['×1', 1], ['×4', 4], ['×16', 16]].forEach(([lab, v]) => {
  const b = document.createElement('button');
  b.className = 'smf-btn';
  b.textContent = lab;
  b.onclick = () => setSpeed(v);
  $('hSpeed').appendChild(b);
  speedBtns.push([b, v]);
});
function setSpeed(v) {
  speed = v;
  for (const [b, bv] of speedBtns) b.classList.toggle('on', bv === v);
}
setSpeed(1);

/* toast + banner */
const toast = document.getElementById('toast');
let toastT = 0;
function say(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  toastT = performance.now() + 1800;
}
const banner = document.getElementById('banner');

function dispatch(action) {
  const r = sim.act(action);
  if (!r.ok && r.reason) say(r.reason);
  return r;
}

/* tool buttons */
function setTool(tool) {
  ui.tool = ui.tool === tool ? null : tool;
  el.btnProbe.classList.toggle('on', ui.tool === 'probe');
  el.btnTank.classList.toggle('on', ui.tool === 'tank');
  el.toolHint.textContent =
    ui.tool === 'probe' ? 'click a lane to install its probe + gate' :
    ui.tool === 'tank' ? 'click a probed lane: tank goes between probe and gate' :
    'probe a lane: silence trips its gate';
}
el.btnProbe.onclick = () => setTool('probe');
el.btnTank.onclick = () => setTool('tank');
el.btnBot.onclick = () => dispatch({ type: 'buyBot' });
el.btnLane.onclick = () => dispatch({ type: 'buyLane' });

/* panel toggle */
const panel = document.getElementById('hud');
document.getElementById('panelToggle').onclick = () => {
  panel.classList.toggle('hidden');
  document.getElementById('panelToggle').textContent =
    panel.classList.contains('hidden') ? '◂ TELEMETRY' : 'HIDE ▸';
};

/* ---------------------------- input ---------------------------- */
canvas.addEventListener('pointerdown', (e) => {
  const [x, y] = view.clientToWorld(e.clientX, e.clientY);
  /* find the lane row under the cursor */
  let laneIx = -1;
  for (let i = 0; i < P.maxLanes; i++) {
    if (Math.abs(y - laneY(i)) <= G.laneDY / 2 - 3) { laneIx = i; break; }
  }
  if (laneIx < 0 || x < G.laneX0 - 70 || x > G.laneX1 + 60) return;
  const l = sim.state.lanes[laneIx];

  if (l.active && l.jam && Math.abs(x - l.jam.x) < 48) {
    dispatch({ type: 'clear', laneIx });
    return;
  }
  if (!l.active) { dispatch({ type: 'buyLane' }); return; }
  if (ui.tool === 'probe') { dispatch({ type: 'buyProbe', laneIx }); return; }
  if (ui.tool === 'tank') { dispatch({ type: 'buyTank', laneIx }); return; }
  if (l.jam) dispatch({ type: 'clear', laneIx }); // generous jam hitbox fallback
});

window.addEventListener('keydown', (e) => {
  if (e.key === ' ') { setSpeed(speed === 0 ? 1 : 0); e.preventDefault(); }
  else if (e.key === '1') setSpeed(1);
  else if (e.key === '2') setSpeed(4);
  else if (e.key === '3') setSpeed(16);
});

window.addEventListener('resize', () => view.resize());

/* ------------------------- main loop ------------------------- */
let last = performance.now(), acc = 0;
let simUs = 0, drawMs = 0; // rolling perf, HUD-visible

function frame(now) {
  const rdt = Math.min((now - last) / 1000, 0.1);
  last = now;
  acc += rdt * speed;
  let steps = 0;
  const s0 = performance.now();
  while (acc >= DT && steps < 240) { sim.step(DT); acc -= DT; steps++; }
  if (steps) simUs = simUs * 0.9 + ((performance.now() - s0) * 1000 / steps) * 0.1;

  const d0 = performance.now();
  view.draw(sim.state, ui);
  drawMs = drawMs * 0.9 + (performance.now() - d0) * 0.1;

  if (toastT && now > toastT) { toast.classList.remove('show'); toastT = 0; }
  requestAnimationFrame(frame);
}

/* ------------------------- HUD refresh (5 Hz) ------------------------- */
let palettePulsed = false, tankPulsed = false;
function refreshHud() {
  const s = sim.state;
  el.clock.textContent = `T+${s.t.toFixed(1)}s`;
  el.matter.textContent = `MATTER ${Math.floor(s.matter)}`;
  const nAct = s.lanes.filter((l) => l.active).length;
  el.lanes.textContent = `${nAct}/8 LANES`;
  el.quota.textContent = `${Math.floor(s.banked)} / ${P.quota}`;
  el.bQuota.style.transform = `scaleX(${clamp(s.banked / P.quota, 0, 1)})`;
  el.tp.textContent = `${s.throughput.toFixed(1)} /s`;

  el.handsN.textContent = `${s.handsRate.toFixed(1)}/min`;
  const hf = clamp(s.handsRate / 12, 0, 1);
  el.bHands.style.transform = `scaleX(${hf})`;
  el.bHands.className = `smf-fill${s.handsRate >= 6 ? ' red' : ''}`;
  el.handsN.className = s.handsRate >= 6 ? 'smf-red' : 'smf-amber';
  el.clears.textContent = `${s.manualClears} / ${s.autoClears}`;

  el.btnLane.textContent = nAct >= P.maxLanes ? 'ALL LANES BUILT' : `+ LANE — ${laneCost(nAct)}`;
  el.btnLane.disabled = nAct >= P.maxLanes;

  if (s.flags.fluency) {
    el.palette.classList.remove('locked');
    if (!palettePulsed) { el.palette.classList.add('pulse'); palettePulsed = true; }
  }
  if (s.flags.storm && !tankPulsed) {
    el.btnTank.classList.remove('hiddenb');
    el.palette.classList.remove('pulse');
    void el.palette.offsetWidth; // restart the pulse for the tank reveal
    el.palette.classList.add('pulse');
    tankPulsed = true;
  }

  const qn = s.queue.length;
  el.queueN.textContent = `QUEUE ${qn}`;
  el.queueN.className = qn > 5 ? 'smf-red' : qn ? 'smf-cyan' : 'smf-dim';
  el.bots.textContent = `${s.bots.length} hired`;
  el.mint.textContent = `${s.alertsMinted}`;
  el.ghost.textContent = `${s.ghostVisits}`;

  for (const [k] of MILESTONES) {
    const li = document.getElementById(`ms-${k}`);
    const on = !!s.flags[k];
    li.className = on ? 'on' : '';
    li.firstChild.textContent = on ? '■' : '□';
  }

  const evs = s.events.slice(-9).reverse();
  el.log.innerHTML = evs.map((e) => `<div>T+${e.t.toFixed(0)} ${e.msg}</div>`).join('');

  el.perf.textContent = `sim ${simUs.toFixed(1)}µs/tick · draw ${drawMs.toFixed(1)}ms`;

  if (s.flags.quota) {
    banner.className = 'smf-banner show';
    banner.textContent = `QUOTA BANKED — T+${s.flagT.quota.toFixed(0)}s`;
  } else if (s.flags.storm && !s.flags.stormQuelled) {
    banner.className = 'smf-banner show storm';
    banner.textContent = 'ALERT STORM — RESPONDERS THRASHING';
  } else {
    banner.className = 'smf-banner';
  }
}

setInterval(refreshHud, 200);
refreshHud();
requestAnimationFrame(frame);
