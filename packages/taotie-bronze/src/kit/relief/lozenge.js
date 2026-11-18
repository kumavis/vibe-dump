// Lattice grounds — the diagonal lozenge ground (菱形雷纹 / 斜方格雷纹) and its
// orthogonal twin, nested squares (回纹), traced from the Met gui 1992.165.18 /
// Met fangyi 1974.268.2 grounds (research/04-motif-inventory.md § Grounds).
//
// leiwen.js packs free-standing squared spirals into whatever the motif leaves
// over, each cell turned to the wall beside it. Some grounds are not packed but
// LATTICED: a regular lattice of cells (diagonal lozenges, or squares) is laid
// over the whole field and the motif simply cuts it off; each cell carries the
// same filling — concentric rings (the mitred "nested" lozenge whose corners
// line up into diagonals), a squared spiral, a round spiral or a dot. Where the
// lattice meets a motif, a cell that would be cut is halved (4 children per
// lozenge, `levels` deep), and at the last level either dropped or cut off at
// the margin (`clip`) the way the carver's lattice runs into the motif.
//
//   lozengeFill(panel, region, opts) → { cells, clipped, ms }
//     region: { rect, avoid: 'raised' | mask | draw | null, include, level, margin } — as leiwenFill
//
// Cost: one coarse free-region grid (as leiwen's planner), one panel.sink for
// every groove — the same per-pixel cost as a leiwen fill of the same area.

import { createCanvas, context2d } from '../util/canvas.js'
import { nearestFeature } from './edt.js'
import { Rng } from '../util/rng.js'
import { fillet } from './shapes.js'

export const LOZENGE_DEFAULTS = {
  lattice: 'diagonal', // 'diagonal' (lozenges, diagonals along x / y) | 'square' (回 cells)
  size: 9, // mm: lozenge width (horizontal diagonal) or square side; [w, h] for unequal
  levels: 2, // halvings allowed where a motif cuts a cell
  fill: 'nested', // 'nested' | 'squared' | 'spiral' | 'dot' | 'plain'
  pitch: 0.9, // mm between nested rings / spiral turns
  line: 0.48, // groove width as a fraction of pitch
  depth: 0.4,
  outline: true, // the lattice lines themselves
  clip: true, // last-level cells that a motif cuts are cut off at the margin (else left plain)
  minFree: 0.35, // a clipped cell is kept only if this share of its samples is free
  roundness: 0.1, // corner fillet of the rings, × pitch
  jitter: 0.04, // × pitch
  offset: [0, 0], // lattice phase, mm
  mode: 'sunk', // 'sunk' | 'thread'
  seed: 0,
}

export function lozengeOptions(opts = {}) {
  return { ...LOZENGE_DEFAULTS, ...opts }
}

export function lozengeFill(panel, region = {}, opts = {}) {
  const t0 = now()
  const o = lozengeOptions(opts)
  const rect = region.rect ?? { x: 0, y: 0, w: panel.width, h: panel.height }
  const rng = new Rng(`lozenge:${o.seed}:${rect.x.toFixed(2)},${rect.y.toFixed(2)},${rect.w.toFixed(2)}`)
  const lw = o.pitch * o.line
  const grid = freeGrid(panel, rect, region, Math.max(0, (region.margin ?? 0.6)) + lw / 2)
  if (!grid) return { cells: 0, clipped: 0, ms: 0 }
  const [W, H] = Array.isArray(o.size) ? o.size : [o.size, o.size]
  // lattice basis: cell (i, j) = origin + i e1 + j e2, the unit square [0,1]² → cell
  const diag = o.lattice !== 'square'
  const e1 = diag ? [W / 2, H / 2] : [W, 0]
  const e2 = diag ? [-W / 2, H / 2] : [0, H]
  const org = [rect.x + rect.w / 2 + o.offset[0], rect.y + rect.h / 2 + o.offset[1]]
  if (diag) org[1] -= H / 2 // a lozenge centred on the rect centre
  else { org[0] -= W / 2; org[1] -= H / 2 }
  const det = e1[0] * e2[1] - e1[1] * e2[0]
  const toLat = (x, y) => {
    const dx = x - org[0], dy = y - org[1]
    return [(dx * e2[1] - dy * e2[0]) / det, (e1[0] * dy - e1[1] * dx) / det]
  }
  let i0 = Infinity, i1 = -Infinity, j0 = Infinity, j1 = -Infinity
  for (const [x, y] of [[rect.x, rect.y], [rect.x + rect.w, rect.y], [rect.x, rect.y + rect.h], [rect.x + rect.w, rect.y + rect.h]]) {
    const [u, v] = toLat(x, y)
    i0 = Math.min(i0, Math.floor(u)); i1 = Math.max(i1, Math.ceil(u))
    j0 = Math.min(j0, Math.floor(v)); j1 = Math.max(j1, Math.ceil(v))
  }
  const strokes = []
  const stats = { cells: 0, clipped: 0 }
  const S = [0, 0.25, 0.5, 0.75, 1]
  const visit = (u0, v0, s, level) => {
    const P = (a, b) => [org[0] + (u0 + a * s) * e1[0] + (v0 + b * s) * e2[0], org[1] + (u0 + a * s) * e1[1] + (v0 + b * s) * e2[1]]
    let free = 0, tot = 0
    for (const a of S) for (const b of S) {
      if (a > 0 && a < 1 && b > 0 && b < 1 && !(a === 0.5 && b === 0.5)) continue
      tot++
      const [x, y] = P(a, b)
      if (grid.free(x, y)) free++
    }
    if (free === tot) { emit(P, s, false); return }
    if (free === 0 && level > 0) return
    if (level < o.levels) {
      const h = s / 2
      visit(u0, v0, h, level + 1); visit(u0 + h, v0, h, level + 1)
      visit(u0, v0 + h, h, level + 1); visit(u0 + h, v0 + h, h, level + 1)
      return
    }
    if (o.clip && free / tot >= o.minFree) emit(P, s, true)
  }
  // perpendicular distances between a cell's opposite sides (for ring spacing in unit coords)
  const cross = Math.abs(det)
  const h1 = cross / Math.hypot(e2[0], e2[1]) // across the e2-parallel sides (along e1)
  const h2 = cross / Math.hypot(e1[0], e1[1])
  const emit = (P, s, clipped) => {
    stats.cells++
    if (clipped) stats.clipped++
    const du = o.pitch / (h1 * s), dv = o.pitch / (h2 * s)
    const j = o.jitter * o.pitch
    const J = (p) => [p[0] + rng.jitter(j), p[1] + rng.jitter(j)]
    const rr = o.roundness * o.pitch
    const ring = (k) => [P(k * du, k * dv), P(1 - k * du, k * dv), P(1 - k * du, 1 - k * dv), P(k * du, 1 - k * dv)]
    if (o.outline) strokes.push({ pts: ring(0), closed: true, r: 0 })
    const kMax = Math.floor(Math.min(0.5 / du, 0.5 / dv) - 0.35)
    if (o.fill === 'nested') {
      for (let k = 1; k <= kMax; k++) strokes.push({ pts: ring(k).map(J), closed: true, r: rr })
      if (kMax >= 0 && Math.min(0.5 / du, 0.5 / dv) - kMax > 0.85) strokes.push({ dot: P(0.5, 0.5), r: lw * 0.6 })
    } else if (o.fill === 'squared') {
      // a squared spiral wound in the cell's own frame: legs shrink one pitch every half turn
      const v = []
      let a = 1, k = 1
      v.push(P(k * du, k * dv))
      while (k <= kMax) {
        const lo = k, hi = k
        v.push(P(1 - hi * du, lo * dv), P(1 - hi * du, 1 - hi * dv), P(lo * du, 1 - hi * dv), P(lo * du, (k + 1) * dv))
        k++
        a++
      }
      if (v.length > 2) strokes.push({ pts: v.map(J), closed: false, r: rr })
    } else if (o.fill === 'spiral') {
      const c = P(0.5, 0.5)
      const rin = Math.min(h1, h2) * s * 0.5 - o.pitch * 0.9
      if (rin > o.pitch) {
        const pts = []
        const turns = (rin - lw) / o.pitch
        const hand = rng.next() < 0.5 ? 1 : -1
        const a0 = rng.range(0, 6.283)
        for (let phi = 0; phi <= turns * 2 * Math.PI; phi += 0.2) {
          const r = rin - (o.pitch * phi) / (2 * Math.PI)
          pts.push([c[0] + Math.cos(a0 + hand * phi) * r, c[1] + Math.sin(a0 + hand * phi) * r])
        }
        strokes.push({ pts, closed: false, r: 0 })
      } else strokes.push({ dot: c, r: lw * 0.8 })
    } else if (o.fill === 'dot') {
      strokes.push({ dot: P(0.5, 0.5), r: Math.max(lw, Math.min(h1, h2) * s * 0.12) })
    }
  }
  for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) visit(i, j, 1, 0)
  if (strokes.length) drawLattice(panel, rect, grid, strokes, o, lw)
  return { ...stats, ms: Math.round(now() - t0) }
}

function drawLattice(panel, rect, grid, strokes, o, lw) {
  const gate = grid.gateCanvas()
  const draw = (ctx) => {
    ctx.save()
    ctx.beginPath()
    ctx.rect(rect.x, rect.y, rect.w, rect.h)
    ctx.clip()
    ctx.lineWidth = lw
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    for (const s of strokes) {
      if (s.dot) continue
      let pts = s.pts
      if (s.r > 0) pts = fillet(s.closed ? pts : pts, s.r, { closed: s.closed, step: Math.max(0.1, lw * 0.4) })
      ctx.moveTo(pts[0][0], pts[0][1])
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
      if (s.closed) ctx.closePath()
    }
    ctx.stroke()
    ctx.beginPath()
    for (const s of strokes) {
      if (!s.dot) continue
      ctx.moveTo(s.dot[0] + s.r, s.dot[1])
      ctx.arc(s.dot[0], s.dot[1], s.r, 0, Math.PI * 2)
    }
    ctx.fill()
    // cut everything off at the eroded free region (motif walls + margin)
    ctx.globalCompositeOperation = 'destination-in'
    ctx.imageSmoothingEnabled = true
    ctx.drawImage(gate.canvas, gate.x, gate.y, gate.w, gate.h)
    ctx.restore()
  }
  if (o.mode === 'thread') panel.add(draw, { height: o.depth, profile: 'ridge' })
  else panel.sink(draw, { depth: o.depth, shoulder: lw * 0.4, profile: 'u' })
}

/**
 * The free region on a coarse grid (≈ 0.2 mm): rect ∧ include ∧ ¬avoid (∧ level),
 * eroded by `erode` mm. free(x, y) answers for a point; gateCanvas() is the same
 * region as an alpha image (row 0 = bottom, drawn in mm).
 */
function freeGrid(panel, rect, region, erode) {
  const { cols, rows, ppmm, field } = panel
  let h = Math.max(1 / ppmm, 0.2)
  if ((rect.w / h) * (rect.h / h) > 3.2e6) h = Math.sqrt((rect.w * rect.h) / 3.2e6)
  const gw = Math.ceil(rect.w / h) + 2, gh = Math.ceil(rect.h / h) + 2
  const ox = rect.x - h, oy = rect.y - h
  const blocked = new Uint8Array(gw * gh)
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) if (!i || !j || i === gw - 1 || j === gh - 1) blocked[j * gw + i] = 1
  const toMask = (m) => (typeof m === 'function' ? panel.mask(m).data : m && m.data ? m.data : null)
  const avoid = region.avoid === undefined ? (region.level != null ? null : 'raised') : region.avoid
  const avoidData = avoid === 'raised' ? null : toMask(avoid)
  const inc = toMask(region.include)
  const level = region.level
  const tol = level == null ? 0 : 0.04 + 0.03 * Math.abs(level)
  const px0 = Math.max(0, Math.floor(rect.x * ppmm)), px1 = Math.min(cols, Math.ceil((rect.x + rect.w) * ppmm))
  const py0 = Math.max(0, Math.floor(rect.y * ppmm)), py1 = Math.min(rows, Math.ceil((rect.y + rect.h) * ppmm))
  for (let y = py0; y < py1; y++) {
    const gj = Math.min(gh - 2, Math.max(1, Math.floor(((y + 0.5) / ppmm - oy) / h)))
    for (let x = px0; x < px1; x++) {
      const k = y * cols + x
      let hit = false
      if (avoid === 'raised') hit = field[k] > 0.05
      else if (avoidData) hit = avoidData[k] > 0.5
      if (!hit && inc) hit = inc[k] < 0.5
      if (!hit && level != null) hit = Math.abs(field[k] - level) > tol
      if (hit) blocked[gj * gw + Math.min(gw - 2, Math.max(1, Math.floor(((x + 0.5) / ppmm - ox) / h)))] = 1
    }
  }
  const nf = nearestFeature(blocked, gw, gh)
  const m = erode / h
  const m2 = m * m
  const free = (x, y) => {
    const i = Math.floor((x - ox) / h), j = Math.floor((y - oy) / h)
    if (i < 0 || j < 0 || i >= gw || j >= gh) return false
    return nf.dist2[j * gw + i] > m2
  }
  let cache = null
  const gateCanvas = () => {
    if (cache) return cache
    const cv = createCanvas(gw, gh)
    const ctx = context2d(cv)
    const img = ctx.createImageData(gw, gh)
    for (let j = 0; j < gh; j++) {
      for (let i = 0; i < gw; i++) {
        const d = Math.sqrt(nf.dist2[j * gw + i]) - m
        const a = Math.max(0, Math.min(1, d + 0.5))
        const k = (j * gw + i) * 4 // image row j = grid row j (bottom first): drawn with y up it lands right side up
        img.data[k] = img.data[k + 1] = img.data[k + 2] = 255
        img.data[k + 3] = Math.round(a * 255)
      }
    }
    ctx.putImageData(img, 0, 0)
    cache = { canvas: cv, x: ox, y: oy, w: gw * h, h: gh * h }
    return cache
  }
  return { free, gateCanvas, h, gw, gh }
}

const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now())
