/* =====================================================================
   SMF 03 — PARTS BENCH · shell
   RAF loop with a fixed accumulator, HUD, input → act(). Owns UI state
   only (tool, selection, drag); all game state lives in the sim.
   ===================================================================== */
import './style.css'
import { createSim, DT, PUZZLES, PART_NAMES, COSTS, GW, GH } from './sim.js'
import { createView } from './view.js'

const sim = createSim()
const S = sim.state
window.smf = sim // headless-visible handle (smoke tests poke this)

/* ------------------------------- DOM ------------------------------- */
const root = document.getElementById('app')
root.className = 'pb-root'
root.innerHTML = `
  <canvas class="pb-canvas" id="pb-canvas"></canvas>
  <div class="pb-topbar">
    <div class="pb-palette" id="pb-palette"></div>
    <div class="pb-tabs" id="pb-tabs"></div>
  </div>
  <div class="pb-inspector" id="pb-inspector" style="display:none"></div>
  <button class="pb-toggle" id="pb-toggle">HIDE ▸</button>
  <div class="pb-panel" id="pb-panel">
    <div class="pb-h1">SLIME MOLD FOUNDRY</div>
    <div class="pb-sub">SMF 03 — PARTS BENCH</div>
    <div class="pb-row"><span class="pb-k" id="pb-time">T+0.0s</span><span class="pb-amber" id="pb-spent">SPENT 0</span></div>
    <div class="pb-speeds" id="pb-speeds"></div>
    <div class="pb-card">
      <div class="pb-cardh"><span id="pb-ckey">CONTRACT</span><span id="pb-cstat" class="pb-dim">—</span></div>
      <div class="pb-brief pb-dim" id="pb-brief"></div>
      <div class="pb-row"><span class="pb-k">OUTPUT</span><span class="pb-cyan" id="pb-out">0.00</span></div>
      <div class="pb-row"><span class="pb-k">TARGET</span><span id="pb-tgt">0.00</span></div>
      <div class="pb-bar"><div class="pb-fill" id="pb-hold" style="background:#9fd65a"></div></div>
    </div>
    <div class="pb-card">
      <div class="pb-cardh"><span>BENCH</span></div>
      <div class="pb-row"><span class="pb-k">PARTS</span><span class="pb-cyan" id="pb-parts">0</span></div>
      <div class="pb-row"><span class="pb-k">SIM</span><span class="pb-dim" id="pb-simperf">— µs/tick</span></div>
      <div class="pb-row"><span class="pb-k">DRAW</span><span class="pb-dim" id="pb-drawperf">— ms</span></div>
    </div>
    <div class="pb-card">
      <div class="pb-cardh"><span>MILESTONES</span></div>
      <ul class="pb-check" id="pb-check"></ul>
    </div>
    <div class="pb-card">
      <div class="pb-cardh"><span>EVENT LOG</span></div>
      <div class="pb-log" id="pb-log"></div>
    </div>
    <div class="pb-legend">
      <span class="pb-cyan">■ signal</span> · <span class="pb-amber">■ matter (costs)</span> · <span style="color:#d96b6b">■ fault</span> · <span style="color:#9fd65a">■ pass</span><br>
      trace cap 20/s · tank cap 30 · pass = 12s in tolerance<br>
      failures are visible: congestion glow · gate chatter · CONFUSED cycles
    </div>
  </div>
  <div class="pb-help">palette: click part, click cell · drag = draw trace · select + drag ↑↓ = tune · R rotate · right-click remove · 1–5 contracts</div>
`

const canvas = document.getElementById('pb-canvas')
const view = createView(canvas)

/* UI state (never game state) */
const ui = {
  tool: 'select', toolDir: 0, sel: null, hover: null,
  dragPath: null, tuneVal: null, panelOpen: true,
}

/* palette */
const TOOLS = [
  ['select', 'SELECT', ''], ['trace', 'TRACE', COSTS.trace],
  ['valve', 'VALVE', COSTS.valve], ['merge', 'MERGE', COSTS.merge],
  ['ratio', 'RATIO', COSTS.ratio], ['gate', 'GATE', COSTS.gate],
  ['tank', 'TANK', COSTS.tank], ['decay', 'DECAY', COSTS.decay],
  ['erase', 'ERASE', ''],
]
const paletteEl = document.getElementById('pb-palette')
for (const [tool, name, cost] of TOOLS) {
  const b = document.createElement('button')
  b.className = 'pb-btn' + (tool === ui.tool ? ' on' : '')
  b.dataset.tool = tool
  b.innerHTML = cost === '' ? name : `${name}<i>${cost}</i>`
  b.addEventListener('click', () => setTool(tool))
  paletteEl.appendChild(b)
}
function setTool(tool) {
  ui.tool = tool
  for (const b of paletteEl.children) b.classList.toggle('on', b.dataset.tool === tool)
}

/* puzzle tabs */
const tabsEl = document.getElementById('pb-tabs')
PUZZLES.forEach((pz, i) => {
  const b = document.createElement('button')
  b.className = 'pb-btn pb-tab' + (i === S.puzzle ? ' on' : '')
  b.dataset.ix = i
  b.textContent = `${i + 1} ${pz.key}`
  b.addEventListener('click', () => { sim.act({ type: 'puzzle', ix: i }); ui.sel = null; syncTabs() })
  tabsEl.appendChild(b)
})
function syncTabs() {
  for (const b of tabsEl.children) {
    const i = +b.dataset.ix
    b.classList.toggle('on', i === S.puzzle)
    b.classList.toggle('pass', S.prog[i].passed)
    b.textContent = `${i + 1} ${PUZZLES[i].key}${S.prog[i].passed ? ' ✓' : ''}`
  }
}

/* speed buttons */
let speed = 1
const speedsEl = document.getElementById('pb-speeds')
for (const [lbl, v] of [['⏸', 0], ['×1', 1], ['×4', 4], ['×16', 16]]) {
  const b = document.createElement('button')
  b.className = 'pb-btn' + (v === speed ? ' on' : '')
  b.textContent = lbl
  b.addEventListener('click', () => {
    speed = v
    for (const c of speedsEl.children) c.classList.toggle('on', c === b)
  })
  speedsEl.appendChild(b)
}

/* milestones checklist */
const MILESTONES = [
  ['p1', 'HALF — one valve'],
  ['p2', 'BLEND — two valves + merge'],
  ['p3', 'STEADY — tank as averaging'],
  ['p4', 'GUARD — SENSE/FLOW gate'],
  ['p5', 'LATCH — the rig, from parts'],
  ['firstSaturation', 'felt a trace saturate'],
  ['firstChatter', 'heard a gate chatter'],
]
const checkEl = document.getElementById('pb-check')
for (const [k, label] of MILESTONES) {
  const li = document.createElement('li')
  li.id = 'pb-ms-' + k
  li.innerHTML = `<b>□</b> ${label}`
  checkEl.appendChild(li)
}

/* panel toggle */
const panelEl = document.getElementById('pb-panel')
const toggleEl = document.getElementById('pb-toggle')
toggleEl.addEventListener('click', () => {
  ui.panelOpen = !ui.panelOpen
  panelEl.classList.toggle('hidden', !ui.panelOpen)
  toggleEl.textContent = ui.panelOpen ? 'HIDE ▸' : '◂ TELEMETRY'
  doResize()
})

/* ---------------------------- inspector ---------------------------- */
const inspEl = document.getElementById('pb-inspector')
function selPart() {
  if (!ui.sel) return null
  return S.boards[S.puzzle].cells[ui.sel.gx + ui.sel.gz * GW]
}
function tuneSpec(p) {
  if (!p) return null
  if (p.type === 'valve') return { min: 0, max: 1, step: 0.01, get: () => p.k, label: 'k' }
  if (p.type === 'gate') return { min: 0, max: 12, step: 0.02, get: () => p.n, label: 'N' }
  if (p.type === 'tank') return { min: 0.5, max: 8, step: 0.1, get: () => p.drain, label: 'DRAIN' }
  return null
}
function renderInspector() {
  const p = selPart()
  if (!p || p.fixed) { inspEl.style.display = 'none'; return }
  const ts = tuneSpec(p)
  inspEl.style.display = 'flex'
  inspEl.innerHTML = `
    <span class="pb-iname">${PART_NAMES[p.type]}</span>
    ${ts ? `<span class="pb-k">${ts.label}</span>
      <input type="range" id="pb-slider" min="${ts.min}" max="${ts.max}" step="${ts.step}" value="${ts.get()}">
      <span class="pb-cyan" id="pb-sval">${ts.get().toFixed(2)}</span>` : ''}
    ${p.type === 'gate' ? `<button class="pb-btn" id="pb-mode">${p.mode}</button>` : ''}
    <button class="pb-btn" id="pb-rot">ROT ⟳</button>
    <button class="pb-btn pb-danger" id="pb-del">REMOVE</button>
  `
  const { gx, gz } = ui.sel
  const slider = document.getElementById('pb-slider')
  if (slider) slider.addEventListener('input', () => {
    sim.act({ type: 'tune', gx, gz, value: +slider.value })
    document.getElementById('pb-sval').textContent = (+slider.value).toFixed(2)
  })
  const modeB = document.getElementById('pb-mode')
  if (modeB) modeB.addEventListener('click', () => { sim.act({ type: 'mode', gx, gz }); renderInspector() })
  document.getElementById('pb-rot').addEventListener('click', () => sim.act({ type: 'rotate', gx, gz }))
  document.getElementById('pb-del').addEventListener('click', () => { sim.act({ type: 'remove', gx, gz }); ui.sel = null; renderInspector() })
}

/* ------------------------------ input ------------------------------ */
let pointer = null // {mode:'trace'|'tune'|'erase'|'maybe-tune', ...}
canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  const cell = view.cellAt(e.offsetX, e.offsetY)
  if (cell) { sim.act({ type: 'remove', gx: cell.gx, gz: cell.gz }); if (ui.sel && ui.sel.gx === cell.gx && ui.sel.gz === cell.gz) ui.sel = null; renderInspector() }
})
canvas.addEventListener('pointerdown', (e) => {
  if (e.button !== 0) return
  const cell = view.cellAt(e.offsetX, e.offsetY)
  if (!cell) return
  canvas.setPointerCapture(e.pointerId)
  const { gx, gz } = cell
  const cells = S.boards[S.puzzle].cells
  const p = cells[gx + gz * GW]
  if (ui.tool === 'trace') {
    pointer = { mode: 'trace' }
    ui.dragPath = [[gx, gz]]
  } else if (ui.tool === 'erase') {
    pointer = { mode: 'erase' }
    sim.act({ type: 'remove', gx, gz })
  } else if (ui.tool === 'select') {
    if (p && !p.fixed) {
      ui.sel = { gx, gz }
      const ts = tuneSpec(p)
      pointer = ts ? { mode: 'maybe-tune', y0: e.offsetY, v0: ts.get(), ts, gx, gz } : null
    } else ui.sel = null
    renderInspector()
  } else {
    // placement tool
    sim.act({ type: 'place', part: ui.tool, gx, gz, dir: ui.toolDir })
    const placed = cells[gx + gz * GW]
    if (placed && !placed.fixed) { ui.sel = { gx, gz }; renderInspector() }
  }
})
canvas.addEventListener('pointermove', (e) => {
  ui.hover = view.cellAt(e.offsetX, e.offsetY)
  if (!pointer) return
  const cell = ui.hover
  if (pointer.mode === 'trace' && cell) {
    const path = ui.dragPath
    const [lx, lz] = path[path.length - 1]
    let dx = cell.gx - lx, dz = cell.gz - lz
    if (dx === 0 && dz === 0) return
    // bridge to the pointer cell one axis step at a time (L-shaped)
    let cx = lx, cz = lz
    let guard = 0
    while ((cx !== cell.gx || cz !== cell.gz) && guard++ < 40) {
      if (cx !== cell.gx) cx += Math.sign(cell.gx - cx)
      else cz += Math.sign(cell.gz - cz)
      if (!path.some(([a, b]) => a === cx && b === cz)) path.push([cx, cz])
    }
  } else if (pointer.mode === 'erase' && cell) {
    sim.act({ type: 'remove', gx: cell.gx, gz: cell.gz })
  } else if (pointer.mode === 'maybe-tune' || pointer.mode === 'tune') {
    const dy = pointer.y0 - e.offsetY
    if (pointer.mode === 'maybe-tune' && Math.abs(dy) > 5) pointer.mode = 'tune'
    if (pointer.mode === 'tune') {
      const span = pointer.ts.max - pointer.ts.min
      const v = Math.max(pointer.ts.min, Math.min(pointer.ts.max, pointer.v0 + dy * span / 160))
      sim.act({ type: 'tune', gx: pointer.gx, gz: pointer.gz, value: v })
      ui.tuneVal = v.toFixed(2)
    }
  }
})
function endPointer() {
  if (pointer && pointer.mode === 'trace' && ui.dragPath) {
    sim.act({ type: 'traceRun', cells: ui.dragPath })
  }
  if (pointer && pointer.mode === 'tune') renderInspector()
  pointer = null
  ui.dragPath = null
  ui.tuneVal = null
}
canvas.addEventListener('pointerup', endPointer)
canvas.addEventListener('pointercancel', endPointer)
canvas.addEventListener('pointerleave', () => { ui.hover = null })

window.addEventListener('keydown', (e) => {
  if (e.key >= '1' && e.key <= '5') {
    sim.act({ type: 'puzzle', ix: +e.key - 1 })
    ui.sel = null
    renderInspector()
    syncTabs()
  } else if (e.key === 'r' || e.key === 'R') {
    if (ui.sel) sim.act({ type: 'rotate', gx: ui.sel.gx, gz: ui.sel.gz })
    else ui.toolDir = (ui.toolDir + 1) & 3
  } else if (e.key === 'Escape') {
    ui.sel = null
    setTool('select')
    renderInspector()
  } else if (e.key === 'Delete' || e.key === 'Backspace' || e.key === 'x') {
    if (ui.sel) { sim.act({ type: 'remove', gx: ui.sel.gx, gz: ui.sel.gz }); ui.sel = null; renderInspector() }
  }
})

/* ------------------------------- loop ------------------------------- */
let simUs = 0, drawMs = 0 // exponential rolling averages
function doResize() { view.resize(ui.panelOpen ? Math.min(330, window.innerWidth * 0.86) : 0) }
window.addEventListener('resize', doResize)
doResize()

// pre-warm: the first painted frame is already a live bench
for (let i = 0; i < 60; i++) sim.step(DT)

let last = performance.now(), acc = 0
function loop(now) {
  const rdt = Math.min((now - last) / 1000, 0.1)
  last = now
  acc += rdt * speed
  let steps = 0
  const t0 = performance.now()
  while (acc >= DT && steps < 240) { sim.step(DT); acc -= DT; steps++ }
  if (steps > 0) {
    const us = (performance.now() - t0) * 1000 / steps
    simUs = simUs ? simUs * 0.9 + us * 0.1 : us
  }
  const t1 = performance.now()
  view.draw(S, now / 1000, ui)
  drawMs = drawMs ? drawMs * 0.92 + (performance.now() - t1) * 0.08 : performance.now() - t1
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)

/* HUD at 5 Hz */
const $ = (id) => document.getElementById(id)
setInterval(() => {
  const pz = PUZZLES[S.puzzle]
  const pr = S.prog[S.puzzle]
  const board = S.boards[S.puzzle]
  $('pb-time').textContent = `T+${S.t.toFixed(1)}s`
  $('pb-spent').textContent = `SPENT ${board.spent ?? 0}`
  $('pb-ckey').textContent = `CONTRACT ${S.puzzle + 1} · ${pz.key}`
  $('pb-cstat').textContent = pr.passed ? 'PASSED ✓' : pr.ok ? `HOLD ${pr.hold.toFixed(1)}s` : 'OUT OF BAND'
  $('pb-cstat').className = pr.passed || pr.ok ? 'pb-green' : 'pb-dim'
  $('pb-brief').textContent = pz.brief
  $('pb-out').textContent = pr.actual.toFixed(2)
  $('pb-tgt').textContent = `${pr.target.toFixed(2)} ±${pz.tol}`
  $('pb-hold').style.transform = `scaleX(${pr.passed ? 1 : Math.min(1, pr.hold / 12)})`
  let parts = 0
  for (const c of board.cells) if (c && !c.fixed) parts++
  $('pb-parts').textContent = parts
  $('pb-simperf').textContent = `${simUs.toFixed(1)} µs/tick`
  $('pb-drawperf').textContent = `${drawMs.toFixed(1)} ms`
  for (const [k] of MILESTONES) {
    const li = $('pb-ms-' + k)
    const on = !!S.flags[k]
    li.className = on ? 'on' : ''
    li.firstChild.textContent = on ? '■' : '□'
  }
  const logEl = $('pb-log')
  logEl.innerHTML = S.events.slice(-9).reverse()
    .map((e) => `<div>T+${e.t.toFixed(0)} ${e.msg}</div>`).join('')
  syncTabs()
}, 200)

/* debug hooks for the browser smoke test (not part of the player API) */
window.smfDebug = {
  cellCenter: (gx, gz) => view.cellCenter(gx, gz),
  setTool,
}
