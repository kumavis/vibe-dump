// The eye-diagram inset shown during DDR5 training. Behind: an oscilloscope
// persistence view of many bits overlaid on one unit interval (UI) — the open
// "eye" between transitions is where a receiver can safely sample. In front:
// the training algorithm's 2-D sweep — for each (strobe delay, reference
// voltage) pair it runs a test pattern and marks pass or fail — and finally the
// centre of the passing region, which is where the setting is parked.

import { rng } from './util.js'

const COLS = 44
const ROWS = 22

export function drawEye(canvas, spec, p, time) {
  const g = canvas.getContext('2d')
  const W = canvas.width
  const H = canvas.height
  g.fillStyle = '#05070d'
  g.fillRect(0, 0, W, H)
  const padL = 34
  const padB = 18
  const pw = W - padL - 8
  const ph = H - padB - 8
  const X = (u) => padL + u * pw // u: 0..1 across 2 UI (eye centred at 0.5)
  const Y = (v) => 8 + (1 - v) * ph // v: 0..1 voltage

  // grid
  g.strokeStyle = 'rgba(120,130,170,0.12)'
  g.lineWidth = 1
  for (let i = 0; i <= 8; i++) {
    g.beginPath()
    g.moveTo(X(i / 8), Y(0))
    g.lineTo(X(i / 8), Y(1))
    g.stroke()
  }
  for (let j = 0; j <= 4; j++) {
    g.beginPath()
    g.moveTo(X(0), Y(j / 4))
    g.lineTo(X(1), Y(j / 4))
    g.stroke()
  }

  // Eye geometry, opening as training improves the settings: before training
  // the eye is skewed and narrow (sampling point wrong, Vref off-centre).
  const train = spec.kind === 'write' ? 0.85 : 1
  const skew = (1 - smoothstep(0.82, 1, p)) * 0.07
  const cx = 0.5 + skew
  const cy = 0.5
  const halfW = 0.2 * train
  const halfH = 0.3 * train

  // persistence traces
  const r = rng(spec.seed || 7)
  g.globalCompositeOperation = 'lighter'
  const N = 46
  for (let k = 0; k < N; k++) {
    const jitter = (r() - 0.5) * 0.09 + Math.sin(time * 3 + k) * 0.006
    const noise = (r() - 0.5) * 0.08
    const b0 = r() < 0.5 ? 0 : 1
    const b1 = r() < 0.5 ? 0 : 1
    const b2 = r() < 0.5 ? 0 : 1
    const isi = (r() - 0.5) * 0.12 // inter-symbol interference: previous bits pull the level
    g.strokeStyle = `rgba(80, 220, 255, ${0.13 + r() * 0.06})`
    g.lineWidth = 1.2
    g.beginPath()
    for (let s = 0; s <= 120; s++) {
      const u = s / 120
      // transitions at u=0.5-halfW-ish and u=0.5+..., i.e. edges at 0.25 and 0.75
      const e1 = 0.25 + jitter + skew
      const e2 = 0.75 + jitter + skew
      const lvl = (a, b, e) => a + (b - a) * (0.5 + 0.5 * Math.tanh((u - e) / 0.035))
      let v = u < 0.5 ? lvl(b0, b1, e1) : lvl(b1, b2, e2)
      v = 0.2 + v * 0.6 + noise * 0.5 + (b1 === b0 ? 0 : isi)
      if (s === 0) g.moveTo(X(u), Y(v))
      else g.lineTo(X(u), Y(v))
    }
    g.stroke()
  }
  g.globalCompositeOperation = 'source-over'

  // sweep overlay
  const sweep = clamp01((p - 0.08) / 0.7)
  const shown = Math.floor(sweep * COLS * ROWS)
  const cw = pw / COLS
  const ch = ph / ROWS
  for (let n = 0; n < shown; n++) {
    const i = n % COLS
    const j = Math.floor(n / COLS)
    const u = (i + 0.5) / COLS
    const v = (j + 0.5) / ROWS
    // Hexagonal eye mask, as real eyes look: diamond in time, flat in voltage.
    const dx = Math.abs(u - cx) / halfW
    const dy = Math.abs(v - cy) / halfH
    const pass = dx + Math.max(0, dy - 0.35) * 1.3 < 0.82 && dy < 0.95
    g.fillStyle = pass ? 'rgba(79, 224, 138, 0.38)' : 'rgba(255, 70, 90, 0.16)'
    g.fillRect(X(0) + i * cw + 0.5, Y(1) + (ROWS - 1 - j) * ch + 0.5, cw - 1, ch - 1)
  }
  // the cursor of the sweep
  if (sweep > 0 && sweep < 1) {
    const i = shown % COLS
    const j = Math.floor(shown / COLS)
    g.strokeStyle = '#fff'
    g.lineWidth = 1.5
    g.strokeRect(X(0) + i * cw, Y(1) + (ROWS - 1 - j) * ch, cw, ch)
  }
  // chosen centre
  if (p > 0.8) {
    const a = clamp01((p - 0.8) / 0.08)
    g.strokeStyle = `rgba(255, 207, 107, ${a})`
    g.lineWidth = 2
    const x = X(cx)
    const y = Y(cy)
    g.beginPath()
    g.moveTo(x - 14, y)
    g.lineTo(x + 14, y)
    g.moveTo(x, y - 14)
    g.lineTo(x, y + 14)
    g.stroke()
    g.beginPath()
    g.arc(x, y, 7, 0, Math.PI * 2)
    g.stroke()
    g.fillStyle = `rgba(255, 207, 107, ${a})`
    g.font = '600 12px ui-monospace, Menlo, monospace'
    g.fillText('centre → saved', x + 12, y - 10)
  }

  // axes
  g.fillStyle = 'rgba(160,170,200,0.75)'
  g.font = '11px ui-monospace, Menlo, monospace'
  g.save()
  g.translate(12, Y(0.5))
  g.rotate(-Math.PI / 2)
  g.textAlign = 'center'
  g.fillText(spec.yLabel || 'Vref', 0, 0)
  g.restore()
  g.textAlign = 'center'
  g.fillText('1 UI', X(0.5), H - 4)
  g.textAlign = 'left'
}

function clamp01(x) {
  return Math.max(0, Math.min(1, x))
}
function smoothstep(a, b, x) {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
