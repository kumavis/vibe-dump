// The inset shown during DDR5 training. Two views:
//
// 'eye'   — behind: an oscilloscope persistence view of many bits overlaid on
//           one unit interval (UI = 178.6 ps at DDR5-5600). In front: a
//           training sweep in the style of memory reference code — a 1-D scan
//           of strobe delay at nominal Vref finds the left/right edges, a Vref
//           scan at that centre finds top/bottom (1-D scans as in the open
//           Haswell code), then a 2-D raster maps the contour (Intel's MRC
//           has 2-D centering steps, but their algorithm isn't public; the
//           raster is illustrative), and the setting is parked in the middle.
//           Each point is a burst of hardware-generated test traffic: pass or
//           fail. The small dashed diamond is JEDEC's DDR5-5600 Rx
//           stressed-eye mask at the DRAM receiver (0.235 UI × 60 mV, at the
//           slicer after DFE), so it is drawn on the write eye only; the
//           trained point must leave room for it. The eye's shape is
//           illustrative, not a measurement.
//
// 'flyby' — write leveling: the clock and command bus visit the DRAM chips of
//           a DIMM one after another ("fly-by"), so each chip sees its clock
//           edge later; the controller delays each byte's write strobe (DQS)
//           until that chip reports the 0 → 1 transition.

import { rng } from './util.js'

const COLS = 64 // timing ticks across ±½ UI
const ROWS = 48 // Vref steps across ≈ ±130 mV

const clamp01 = (x) => Math.max(0, Math.min(1, x))
// Each eye's full pass/fail raster, painted once; the sweep reveals it.
const GRIDS = new Map()
const smoothstep = (a, b, x) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

// Draw at the size the canvas is shown (CSS px, sharp at the device pixel
// ratio) so the 10–11 px labels stay readable on a 200–300 px wide card.
function fit(canvas) {
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  const W = Math.max(180, Math.round(canvas.clientWidth || 280))
  const H = Math.round((W * 300) / 560)
  if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
  }
  const g = canvas.getContext('2d')
  g.setTransform(dpr, 0, 0, dpr, 0, 0)
  return { g, W, H, dpr }
}
const MONO = 'ui-monospace, Menlo, monospace'

// Returns the caption shown under the canvas.
export function drawEye(canvas, spec, p, time) {
  if (spec.kind === 'flyby') return drawFlyby(canvas, spec, p, time)
  const { g, W, H, dpr } = fit(canvas)
  g.fillStyle = '#05070d'
  g.fillRect(0, 0, W, H)
  const padL = 20
  const padB = 16
  const padT = 6
  const pw = W - padL - 10
  const ph = H - padB - padT
  const X = (u) => padL + u * pw // u: 0..1 across one UI, eye centred at 0.5
  const Y = (v) => padT + (1 - v) * ph // v: 0..1 voltage window

  // graticule
  g.strokeStyle = 'rgba(120,130,170,0.12)'
  g.lineWidth = 1
  for (let i = 0; i <= 8; i++) {
    g.beginPath()
    g.moveTo(X(i / 8), Y(0))
    g.lineTo(X(i / 8), Y(1))
    g.stroke()
  }
  for (let j = 0; j <= 6; j++) {
    g.beginPath()
    g.moveTo(X(0), Y(j / 6))
    g.lineTo(X(1), Y(j / 6))
    g.stroke()
  }

  // The lane's eye: centre offset from nominal (why each lane needs its own
  // setting), a lens-shaped passing region.
  const lane = rng(spec.seed || 7)
  const cx = 0.5 + (lane() - 0.5) * 0.18
  const cy = 0.5 + (lane() - 0.5) * 0.12
  const halfW = spec.kind === 'write' ? 0.19 : 0.21
  const halfH = spec.kind === 'write' ? 0.32 : 0.36
  const passAt = (u, v) => {
    const dv = Math.abs(v - cy) / halfH
    if (dv >= 1) return false
    const w = halfW * Math.pow(1 - dv, 0.8)
    const rough = (Math.sin(u * 91 + v * 37) + Math.sin(v * 53)) * 0.006
    return Math.abs(u - cx) < w + rough
  }

  // persistence traces: edges at cx ± ½ UI
  const r = rng((spec.seed || 7) + 11)
  g.globalCompositeOperation = 'lighter'
  for (let k = 0; k < 52; k++) {
    const jitter = (r() - 0.5) * 0.08 + Math.sin(time * 3 + k) * 0.005
    const noise = (r() - 0.5) * 0.06
    const b0 = r() < 0.5 ? 0 : 1
    const b1 = r() < 0.5 ? 0 : 1
    const b2 = r() < 0.5 ? 0 : 1
    const isi = (r() - 0.5) * 0.1
    g.strokeStyle = `rgba(80, 220, 255, ${0.11 + r() * 0.06})`
    g.lineWidth = 1.1
    g.beginPath()
    for (let s = 0; s <= 120; s++) {
      const u = s / 120
      const e1 = cx - 0.5 + jitter
      const e2 = cx + 0.5 + jitter
      const lvl = (a, b, e) => a + (b - a) * (0.5 + 0.5 * Math.tanh((u - e) / 0.03))
      let v = u < cx ? lvl(b0, b1, e1) : lvl(b1, b2, e2)
      v = cy - 0.42 + v * 0.84 + noise * 0.5 + (b1 === b0 ? 0 : isi)
      if (s === 0) g.moveTo(X(u), Y(v))
      else g.lineTo(X(u), Y(v))
    }
    g.stroke()
  }
  g.globalCompositeOperation = 'source-over'

  // The sweep. Phases: 1-D timing at nominal Vref, 1-D Vref at that centre,
  // 2-D raster, then park in the centre.
  const cw = pw / COLS
  const ch = ph / ROWS
  const nomRow = Math.floor(ROWS / 2)
  const cell = (i, j, pass) => {
    g.fillStyle = pass ? 'rgba(79, 224, 138, 0.42)' : 'rgba(255, 70, 90, 0.16)'
    g.fillRect(X(0) + i * cw + 0.5, Y(1) + (ROWS - 1 - j) * ch + 0.5, cw - 1, ch - 1)
  }
  const at = (i, j) => passAt((i + 0.5) / COLS, (j + 0.5) / ROWS)
  const p1 = clamp01(p / 0.16)
  const p2 = clamp01((p - 0.16) / 0.14)
  const p3 = clamp01((p - 0.3) / 0.55)
  // 2-D raster (drawn first so the 1-D scans stay on top). It fills row by
  // row from the bottom, so what's done so far is a block of whole rows plus
  // part of the next one: copy those from the pre-painted grid.
  const n3 = Math.floor(p3 * COLS * ROWS)
  if (n3 > 0) {
    const key = `${spec.kind}:${spec.seed || 7}:${W}x${H}`
    let grid = GRIDS.get(`${key}@${dpr}`)
    if (!grid) {
      grid = document.createElement('canvas')
      grid.width = Math.round(W * dpr)
      grid.height = Math.round(H * dpr)
      const gg = grid.getContext('2d')
      gg.setTransform(dpr, 0, 0, dpr, 0, 0)
      for (let j = 0; j < ROWS; j++) {
        for (let i = 0; i < COLS; i++) {
          gg.fillStyle = at(i, j) ? 'rgba(79, 224, 138, 0.42)' : 'rgba(255, 70, 90, 0.16)'
          gg.fillRect(X(0) + i * cw + 0.5, Y(1) + (ROWS - 1 - j) * ch + 0.5, cw - 1, ch - 1)
        }
      }
      GRIDS.set(`${key}@${dpr}`, grid)
    }
    // drawImage's source rect is in the grid's device pixels
    const blit = (x, y, w, h) => g.drawImage(grid, x * dpr, y * dpr, w * dpr, h * dpr, x, y, w, h)
    const full = Math.floor(n3 / COLS)
    const rem = n3 % COLS
    if (full > 0) {
      const y = Y(1) + (ROWS - full) * ch
      blit(X(0), y, pw, full * ch)
    }
    if (rem > 0) {
      const y = Y(1) + (ROWS - 1 - full) * ch
      blit(X(0), y, rem * cw, ch)
    }
  }
  const n1 = Math.floor(p1 * COLS)
  for (let i = 0; i < n1; i++) cell(i, nomRow, at(i, nomRow))
  // centre column from the 1-D timing scan
  let lo = COLS
  let hi = -1
  for (let i = 0; i < COLS; i++) {
    if (at(i, nomRow)) {
      lo = Math.min(lo, i)
      hi = Math.max(hi, i)
    }
  }
  const midCol = hi >= lo ? Math.round((lo + hi) / 2) : COLS / 2
  const n2 = Math.floor(p2 * ROWS)
  for (let j = 0; j < n2; j++) cell(midCol, j, at(midCol, j))
  // sweep cursor
  let cur = null
  if (p1 > 0 && p1 < 1) cur = [n1, nomRow]
  else if (p2 > 0 && p2 < 1) cur = [midCol, n2]
  else if (p3 > 0 && p3 < 1) cur = [n3 % COLS, Math.floor(n3 / COLS)]
  if (cur) {
    g.strokeStyle = '#fff'
    g.lineWidth = 1.5
    g.strokeRect(X(0) + cur[0] * cw, Y(1) + (ROWS - 1 - cur[1]) * ch, cw, ch)
  }
  // trained centre (+ on writes, the JEDEC Rx stressed-eye diamond that must fit around it)
  if (p > 0.85) {
    const a = smoothstep(0.85, 0.93, p)
    const x = X(cx)
    const y = Y(cy)
    const mw = 0.235 * pw
    const mh = (60 / 260) * ph // ±130 mV window
    if (spec.kind === 'write') {
      // JEDEC's Rx stressed-eye mask is for the DRAM receiver, i.e. writes
      g.strokeStyle = `rgba(255, 255, 255, ${0.8 * a})`
      g.setLineDash([3, 3])
      g.beginPath()
      g.moveTo(x - mw / 2, y)
      g.lineTo(x, y - mh / 2)
      g.lineTo(x + mw / 2, y)
      g.lineTo(x, y + mh / 2)
      g.closePath()
      g.stroke()
      g.setLineDash([])
    }
    g.strokeStyle = `rgba(255, 207, 107, ${a})`
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(x - 8, y)
    g.lineTo(x + 8, y)
    g.moveTo(x, y - 8)
    g.lineTo(x, y + 8)
    g.stroke()
    g.fillStyle = `rgba(255, 207, 107, ${a})`
    g.font = `600 11px ${MONO}`
    g.textAlign = 'left'
    g.fillText('centre → saved', Math.min(W - 98, x + mw / 2 + 4), y - 5)
    g.fillStyle = `rgba(255, 255, 255, ${0.75 * a})`
    g.font = `10px ${MONO}`
    if (spec.kind === 'write') g.fillText('JEDEC min eye', Math.min(W - 84, x + mw / 2 + 4), y + 12)
  }
  // axes
  g.fillStyle = 'rgba(160,170,200,0.85)'
  g.font = `10px ${MONO}`
  g.textAlign = 'center'
  g.save()
  g.translate(9, Y(0.5))
  g.rotate(-Math.PI / 2)
  g.fillText(spec.kind === 'write' ? 'DRAM VrefDQ' : 'host Vref', 0, 3)
  g.restore()
  g.fillText('−½ UI', X(0) + 16, H - 4)
  g.fillText('+½ UI', X(1) - 16, H - 4)
  const phase = p < 0.16 ? '1-D: timing at nominal Vref' : p < 0.3 ? '1-D: Vref at the timing centre' : p < 0.85 ? '2-D raster: each point is one test burst' : 'parked in the middle'
  return `${phase} · strobe delay across 1 UI = 178.6 ps`
}

// Write leveling across a fly-by bus: four x8 DRAM chips of one sub-channel.
function drawFlyby(canvas, spec, p, time) {
  const { g, W, H } = fit(canvas)
  g.fillStyle = '#05070d'
  g.fillRect(0, 0, W, H)
  const chips = 4
  const left = 44
  const right = W - 10
  const gap = (right - left) / chips
  const busY = 22
  // CK / CA fly-by bus from the controller, visiting each chip in turn
  g.strokeStyle = 'rgba(255, 181, 71, 0.75)'
  g.lineWidth = 2
  g.beginPath()
  g.moveTo(8, busY)
  g.lineTo(right, busY)
  g.stroke()
  g.fillStyle = 'rgba(255, 181, 71, 0.9)'
  g.font = `10px ${MONO}`
  g.textAlign = 'left'
  g.fillText('CK + CA (fly-by)', 8, busY - 7)
  // a clock edge travelling along the bus
  const travel = (time * 0.6) % 1
  g.fillStyle = '#ffcf6b'
  g.beginPath()
  g.arc(8 + travel * (right - 8), busY, 3, 0, Math.PI * 2)
  g.fill()
  // per chip: arrival of the clock edge vs. the DQS strobe being slid later
  const rowTop = 42
  const rowH = (H - rowTop - 4) / chips
  const tl = left + 4
  const tr = W - 10
  const TX = (t) => tl + t * (tr - tl)
  for (let k = 0; k < chips; k++) {
    const y = rowTop + k * rowH
    const cxp = left + gap * (k + 0.5)
    // chip on the bus
    g.fillStyle = '#1a1f2c'
    g.fillRect(cxp - 18, busY + 4, 36, 13)
    g.fillStyle = '#8aa0c8'
    g.font = `9.5px ${MONO}`
    g.textAlign = 'center'
    g.fillText(`DRAM ${k}`, cxp, busY + 14)
    // timeline row
    g.strokeStyle = 'rgba(120,130,170,0.25)'
    g.beginPath()
    g.moveTo(tl, y + rowH * 0.6)
    g.lineTo(tr, y + rowH * 0.6)
    g.stroke()
    g.fillStyle = '#8aa0c8'
    g.textAlign = 'right'
    g.fillText(`byte ${k}`, tl - 6, y + rowH * 0.6 + 4)
    // clock edge arrives later at each chip down the fly-by
    const arrive = 0.25 + k * 0.13
    g.strokeStyle = 'rgba(255, 181, 71, 0.9)'
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(TX(arrive), y + rowH * 0.2)
    g.lineTo(TX(arrive), y + rowH * 0.9)
    g.stroke()
    // DQS strobe delay being swept per byte; locks when it crosses the edge
    const sweep = clamp01((p - 0.08 - k * 0.04) / 0.62)
    const dqs = 0.08 + sweep * 0.8
    const locked = dqs >= arrive
    const pos = locked ? arrive : dqs
    g.fillStyle = locked ? '#4fe08a' : '#7cf2ff'
    g.fillRect(TX(pos) - 3, y + rowH * 0.35, 6, rowH * 0.5)
    g.fillStyle = locked ? '#4fe08a' : 'rgba(200,210,235,0.7)'
    g.textAlign = 'left'
    g.fillText(locked ? '0→1 ✓' : '0', TX(Math.min(0.86, pos)) + 6, y + rowH * 0.62)
  }
  return 'orange: the clock edge as each chip sees it · blue: that byte’s write strobe (DQS), slid later until the chip’s feedback flips 0 → 1'
}
