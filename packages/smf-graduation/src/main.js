/* =====================================================================
   SMF 00 — GRADUATION · shell
   RAF loop with fixed accumulator, HUD DOM, input -> sim.act().
   ===================================================================== */

import { createSim, DT, MAX_DEMAND, STAMP_COST, dirName, rotN } from './sim.js'
import { createView } from './view.js'
import './style.css'

const sim = createSim()
window.smf = sim // debuggability: the whole sim is inspectable/drivable

const canvas = document.getElementById('world')
const view = createView(canvas)
window.smfView = view

/* ------------------------------ HUD DOM ------------------------------ */

const CHECKLIST = [
  ['firstLine', 'First line — extractor + furnace'],
  ['thirdLine', 'Third hand-placed line'],
  ['echoUnlocked', 'Pattern echo earned ×3'],
  ['firstStamp', 'First stamp'],
  ['surge', 'Demand surge — 6/s'],
  ['mismatchSeen', 'Echo rejected — mismatch'],
  ['mismatchResolved', 'Pocket fixed by hand'],
  ['contractMet', 'Contract met — 10/s × 20s'],
]

const panel = document.getElementById('panel')
panel.innerHTML = `
  <div class="h1">SLIME MOLD FOUNDRY</div>
  <div class="sub">SCENARIO 00 — GRADUATION</div>
  <div class="row"><span class="k" id="hud-t">T+0.0s</span><span class="amber" id="hud-matter">MATTER 30</span></div>
  <div id="speed" style="margin:7px 0 4px"></div>

  <div class="card">
    <div class="cardh"><span>CONTRACT</span>
      <span><span class="lamp" id="hud-lamp"></span><span id="hud-lampt">OK</span></span></div>
    <div class="row"><span class="k">REQUIRED</span><span class="amber" id="hud-req">1.0/s</span></div>
    <div class="row"><span class="k">ACTUAL</span><span id="hud-act">0.0/s</span></div>
    <div class="bar"><div class="fill" id="hud-actfill" style="background:#e0973a"></div>
      <div class="tick" id="hud-reqtick"></div></div>
    <div class="row"><span class="k">BACKLOG</span><span id="hud-back">0</span></div>
    <div class="bar"><div class="fill" id="hud-backfill" style="background:#e0973a"></div></div>
    <div class="row"><span class="k">DELIVERED</span><span class="amber" id="hud-del">0</span></div>
  </div>

  <div class="card">
    <div class="cardh"><span>TOIL</span><span class="dim">CLICKS / LINE</span></div>
    <div class="toilbig" id="hud-toil"><span class="dim">—</span></div>
    <div class="row"><span class="k">LINES</span><span id="hud-lines">0</span></div>
    <div class="row"><span class="k">STAMPED</span><span id="hud-stamped">0 (0%)</span></div>
  </div>

  <div class="card">
    <div class="cardh"><span>PALETTE</span><span class="dim" id="hud-rot"></span></div>
    <div class="pal" id="pal-extractor"><span>1 · EXTRACTOR</span><span class="cost">10</span></div>
    <div class="pal" id="pal-furnace"><span>2 · FURNACE</span><span class="cost">15</span></div>
    <div class="pal" id="pal-echo"><span>3 · PATTERN ECHO<br><span class="dim">earned ×3</span></span><span class="cost">${STAMP_COST}</span></div>
  </div>

  <div class="card">
    <div class="cardh"><span>MILESTONES</span></div>
    <ul class="check" id="checklist">
      ${CHECKLIST.map(([k, l]) => `<li id="ck-${k}"><b>□</b> ${l}</li>`).join('')}
    </ul>
  </div>

  <div class="card">
    <div class="cardh"><span>EVENT LOG</span></div>
    <div class="log" id="log"></div>
  </div>

  <div class="legend">
    <span class="amber">■ matter</span> · <span class="cyan">■ signal/echo</span> ·
    <span class="green">■ valid</span> · <span class="red">■ fault</span><br>
    line = extractor + adjacent furnace · 1.0 ingot/s<br>
    <span class="dim" id="hud-perf">sim — µs/tick · draw — ms</span>
  </div>
`

const $ = (id) => document.getElementById(id)
const els = {
  t: $('hud-t'), matter: $('hud-matter'),
  req: $('hud-req'), act: $('hud-act'), actfill: $('hud-actfill'), reqtick: $('hud-reqtick'),
  back: $('hud-back'), backfill: $('hud-backfill'), del: $('hud-del'),
  lamp: $('hud-lamp'), lampt: $('hud-lampt'),
  toil: $('hud-toil'), lines: $('hud-lines'), stamped: $('hud-stamped'),
  rot: $('hud-rot'), log: $('log'), perf: $('hud-perf'),
  risk: $('risk'), banner: $('banner'),
  pal: {
    extractor: $('pal-extractor'),
    furnace: $('pal-furnace'),
    echo: $('pal-echo'),
  },
}

/* --------------------------- speed buttons --------------------------- */

let speed = 1
let prevSpeed = 1
const speedBox = $('speed')
const speedDefs = [['⏸', 0], ['×1', 1], ['×4', 4], ['×16', 16]]
const speedBtns = speedDefs.map(([label, v]) => {
  const b = document.createElement('button')
  b.className = 'btn' + (v === speed ? ' on' : '')
  b.textContent = label
  b.addEventListener('click', () => setSpeed(v))
  speedBox.appendChild(b)
  return b
})
function setSpeed(v) {
  if (v !== 0) prevSpeed = v
  speed = v
  speedBtns.forEach((b, i) => b.classList.toggle('on', speedDefs[i][1] === v))
}

/* ------------------------------- input ------------------------------- */

for (const tool of ['extractor', 'furnace', 'echo'])
  els.pal[tool].addEventListener('click', () => sim.act({ type: 'select', tool }))

canvas.addEventListener('mousemove', (e) => { view.hover = view.cellAt(e.offsetX, e.offsetY) })
canvas.addEventListener('mouseleave', () => { view.hover = null })
canvas.addEventListener('click', (e) => {
  const c = view.cellAt(e.offsetX, e.offsetY)
  if (c) sim.act({ type: 'place', gx: c.gx, gz: c.gz })
})
canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  const c = view.cellAt(e.offsetX, e.offsetY)
  if (c) sim.act({ type: 'demolish', gx: c.gx, gz: c.gz })
})
window.addEventListener('keydown', (e) => {
  if (e.key === '1') sim.act({ type: 'select', tool: 'extractor' })
  else if (e.key === '2') sim.act({ type: 'select', tool: 'furnace' })
  else if (e.key === '3') sim.act({ type: 'select', tool: 'echo' })
  else if (e.key === 'r' || e.key === 'R') sim.act({ type: 'rotate' })
  else if (e.key === ' ') { e.preventDefault(); setSpeed(speed === 0 ? prevSpeed : 0) }
})

const toggle = document.getElementById('toggle')
toggle.addEventListener('click', () => {
  const hidden = panel.classList.toggle('hidden')
  toggle.textContent = hidden ? '◂ TELEMETRY' : 'HIDE ▸'
  view.panelW = hidden ? 12 : 332
  view.resize()
})

window.addEventListener('resize', () => view.resize())
view.resize()

/* ----------------------------- main loop ----------------------------- */

let last = performance.now()
let acc = 0
let simUs = 0, simMsAcc = 0, tickAcc = 0
let drawMs = 0

function frame(now) {
  const rdt = Math.min((now - last) / 1000, 0.1)
  last = now
  acc += rdt * speed
  let steps = 0
  const t0 = performance.now()
  while (acc >= DT && steps < 240) { sim.step(DT); acc -= DT; steps++ }
  if (steps) {
    simMsAcc += performance.now() - t0
    tickAcc += steps
    if (tickAcc >= 60) { simUs = (simMsAcc * 1000) / tickAcc; simMsAcc = 0; tickAcc = 0 }
  }
  const d0 = performance.now()
  view.draw(sim)
  drawMs = drawMs * 0.9 + (performance.now() - d0) * 0.1
  requestAnimationFrame(frame)
}
requestAnimationFrame(frame)

/* ------------------------- HUD refresh (5 Hz) ------------------------- */

let echoShown = false
let bannerShown = false

function refreshHud() {
  const s = sim.state
  els.t.textContent = `T+${s.t.toFixed(1)}s`
  els.matter.textContent = `MATTER ${Math.floor(s.matter)}`
  els.req.textContent = `${s.required.toFixed(1)}/s`
  els.act.textContent = `${s.actual.toFixed(1)}/s`
  const denom = MAX_DEMAND * 1.2
  els.actfill.style.transform = `scaleX(${Math.min(1, s.actual / denom)})`
  els.reqtick.style.left = `${Math.min(100, (s.required / denom) * 100)}%`
  els.back.textContent = `${s.backlog.toFixed(0)} ingots`
  els.backfill.style.transform = `scaleX(${Math.min(1, s.backlog / 50)})`
  els.backfill.style.background = s.atRisk ? '#d96b6b' : '#e0973a'
  els.del.textContent = s.delivered.toFixed(0)
  els.lamp.style.background = s.atRisk ? '#e0973a' : '#2c4f31'
  els.lampt.textContent = s.atRisk ? 'AT RISK' : 'OK'
  els.lampt.className = s.atRisk ? 'amber' : 'green'
  els.risk.hidden = !s.atRisk

  // toil
  const T = s.toil
  const before = T.lb > 0 ? (T.cb / T.lb).toFixed(1) : null
  const after = T.la > 0 ? (T.ca / T.la).toFixed(1) : null
  els.toil.innerHTML = before === null
    ? `<span class="dim">— /line</span>`
    : after === null
      ? `<span class="amber">${before}</span> <span class="dim">/line by hand</span>`
      : `<span class="amber">${before}</span> <span class="dim">→</span> <span class="green">${after}</span> <span class="dim">/line</span>`
  els.lines.textContent = `${s.linesCompleted}`
  els.stamped.textContent = s.linesCompleted
    ? `${s.stampedLines} (${Math.round((100 * s.stampedLines) / s.linesCompleted)}%)`
    : '0 (0%)'

  // palette
  for (const tool of ['extractor', 'furnace', 'echo'])
    els.pal[tool].classList.toggle('sel', s.tool === tool)
  if (s.echo.unlocked && !echoShown) {
    echoShown = true
    els.pal.echo.classList.add('show', 'pulse')
  }
  els.rot.textContent = s.echo.unlocked
    ? `R↻ furnace ${dirName(rotN(s.echo.base, s.echo.rot))}`
    : ''

  // checklist
  for (const [k] of CHECKLIST) {
    const li = $(`ck-${k}`)
    const on = !!s.flags[k]
    li.classList.toggle('on', on)
    li.querySelector('b').textContent = on ? '■' : '□'
  }

  // events (newest first)
  els.log.innerHTML = s.events.slice(-10).reverse()
    .map((e) => `<div>T+${e.t.toFixed(0)} ${escapeHtml(e.msg)}</div>`).join('')

  els.perf.textContent = `sim ${simUs.toFixed(1)} µs/tick · draw ${drawMs.toFixed(1)} ms`

  if (s.done && !bannerShown) {
    bannerShown = true
    els.banner.textContent = `CONTRACT MET — T+${(s.flagT.contractMet ?? s.t).toFixed(0)}s`
    els.banner.hidden = false
  }
}
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
refreshHud()
setInterval(refreshHud, 200)
