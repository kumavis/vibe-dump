// Yachou yue — the plate: outline, through-openings, thickness. Plate mm: x = 0 on the
// centre axis (+x = the axe's left = the viewer's right seen from the front), y = 0 at the
// lowest point of the cutting edge, y up. Measured on Gary Todd's CC0 head-on photograph
// (reference/yachou-yue/front.jpg, see dossier.md § Measurements): the outline's tang, shoulders,
// flare and blade are averaged left / right; the slotted sides, the mouth, ears and brow slits are
// TRACED per side off the flattened photograph (traced.js) — the axe is hand-made and not symmetric.

import { MOUTH_CUT, EAR_CUT_L, EAR_CUT_R, BROW_CUT_L, SIDE_L, SIDE_R } from './traced.js'

// ---------------------------------------------------------------- outline (right half)

/** the cutting edge, centre → tip */
export const EDGE = [
  [0, 0], [20, 0.25], [43, 1.1], [60, 2.3], [78, 4.2], [95, 6.4], [112, 9], [130, 12.6], [147, 17],
  [158, 21], [166, 25], [172.5, 29.6],
]
/** the side edge, tip → shoulder corner: [half-width, y] */
const SIDE = [
  [172.5, 29.6], [169.5, 32], [159, 40.6], [151.5, 49.4], [146, 58.1], [141.8, 66.9], [138.8, 75.6], [136, 84.5],
  [133.5, 97.7], [130.5, 119.6], [128.5, 141.6], [125.7, 163.5], [123.8, 185.4], [121.8, 207], [120.5, 229.4],
  [119, 251.4], [118, 275],
]
export const SHOULDER_Y = 275
export const TANG = { top: 327, halfTop: 68.5, halfBottom: 70 }
export const H = TANG.top

/** the side slots are TRACED (traced.js) and rebuilt square from the trace: seven a side, each a straight slit ≈ 3–5 mm high
 *  open to the edge, ending plain or in a square head that runs up and/or down, leaving a comb of ≈ 17 mm square-cornered
 *  tabs — not alike, and not alike left and right.
 *  The traced stretch of each side edge runs between these heights; outside it the measured SIDE table holds. */
export const SLOTS = [233, 211, 191, 169, 147, 126, 105]

export function sideX(y) {
  for (let i = 0; i < SIDE.length - 1; i++) {
    const [x0, y0] = SIDE[i], [x1, y1] = SIDE[i + 1]
    if (y >= y0 && y <= y1) return x0 + ((x1 - x0) * (y - y0)) / (y1 - y0)
  }
  return y < SIDE[0][1] ? SIDE[0][0] : SIDE[SIDE.length - 1][0]
}

/** the blade edge height at |x| (linear between the measured points) */
export function edgeY(x) {
  x = Math.abs(x)
  for (let i = 0; i < EDGE.length - 1; i++) {
    const [x0, y0] = EDGE[i], [x1, y1] = EDGE[i + 1]
    if (x >= x0 && x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0)
  }
  return EDGE[EDGE.length - 1][1]
}

/** one half of the outline as |x|: bottom centre → tip → side (traced stretch spliced in) → tang top corner */
function halfPath(s) {
  // traced side, top → bottom in plate x; as |x|, bottom → top, its two ends blended onto the measured side
  const T = (s > 0 ? SIDE_R : SIDE_L).map(([x, y]) => [s * x, y]).reverse()
  const yb = T[0][1], yt = T[T.length - 1][1]
  const ob = sideX(yb) - T[0][0], ot = sideX(yt) - T[T.length - 1][0]
  const traced = T.map(([x, y]) => [x + ob + ((ot - ob) * (y - yb)) / (yt - yb), y])
  const pts = EDGE.slice()
  for (let i = 1; i < SIDE.length; i++) if (SIDE[i][1] < yb - 0.5) pts.push(SIDE[i])
  pts.push(...traced)
  for (let i = 1; i < SIDE.length; i++) if (SIDE[i][1] > yt + 0.5) pts.push(SIDE[i])
  pts.push([TANG.halfBottom, SHOULDER_Y])
  pts.push([TANG.halfTop, TANG.top])
  return pts
}

/** the whole outline, CCW from the bottom centre (left and right halves differ along the slotted sides) */
export function outline() {
  const R = halfPath(1)
  const L = halfPath(-1).slice(1).map(([x, y]) => [-x, y]).reverse()
  // R runs centre-bottom → tang top right; L (mirrored, reversed) runs tang top left → just left of centre-bottom
  const out = R.concat([[0, TANG.top]]).concat(L)
  return dedupe(out)
}

// ---------------------------------------------------------------- openings

/** the face sits this far right of the plate axis in the photograph (eye centres; photograph over symmetry) */
export const MASK_DX = 1.6
// face elements below are in MASK-local x (add MASK_DX for plate x); traced openings (traced.js) are plate x
export const EYE = { c: [55.6, 185.2], r: 9.7 }
export const EAR_C = { 1: [98.0, 181.2], [-1]: [-94.9, 182.4] } // traced ear-hole centres, mask-local
export const LASH = { c: [79, 257], w: 25, h: 11.5, r: 2.5 }
export const LASH_DX = 1.0 // the lashing slots' own axis offset in the photograph (traced centres −78.2 / 80.2)

export function holes() {
  const out = []
  for (const s of [1, -1]) {
    out.push(circle([MASK_DX + s * EYE.c[0], EYE.c[1]], EYE.r, 48))
    out.push(rrect([LASH_DX + s * LASH.c[0], LASH.c[1]], LASH.w, LASH.h, LASH.r))
  }
  out.push(EAR_CUT_L, EAR_CUT_R)
  out.push(BROW_CUT_L, BROW_CUT_L.map(([x, y]) => [2 * MASK_DX - x, y]).reverse())
  out.push(MOUTH_CUT)
  return out
}

// ---------------------------------------------------------------- thickness (inferred: dossier § Thickness)

export const THICK = { body: 8.5, blade: 6.5, edge: 0.9, bevel: 19 }

export function makeThickness() {
  const ed = densify(EDGE.slice().reverse().map(([x, y]) => [-x, y]).concat(EDGE.slice(1)), 2)
  const T = (x, y) => {
    const base = y >= 95 ? THICK.body : y <= 45 ? THICK.blade : THICK.blade + ((THICK.body - THICK.blade) * (y - 45)) / 50
    const d = edgeDist(ed, x, y)
    if (d >= THICK.bevel) return base
    const t = d / THICK.bevel
    return THICK.edge + (base - THICK.edge) * t
  }
  T.edgeDistance = (x, y) => edgeDist(ed, x, y)
  return T
}

function edgeDist(ed, x, y) {
  if (y - edgeY(x) > THICK.bevel + 4) return Infinity
  let best = Infinity
  for (let i = 0; i < ed.length - 1; i++) {
    const a = ed[i], b = ed[i + 1]
    const dx = b[0] - a[0], dy = b[1] - a[1]
    const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy)))
    const d = Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy)
    if (d < best) best = d
  }
  return best
}

// ---------------------------------------------------------------- shape helpers

export function circle(c, r, n = 32) {
  const out = []
  for (let i = 0; i < n; i++) {
    const a = (2 * Math.PI * i) / n
    out.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)])
  }
  return out
}

export function rrect(c, w, h, r, seg = 5) {
  r = Math.min(r, w / 2, h / 2)
  const out = []
  const corners = [[w / 2 - r, -h / 2 + r, -90], [w / 2 - r, h / 2 - r, 0], [-w / 2 + r, h / 2 - r, 90], [-w / 2 + r, -h / 2 + r, 180]]
  for (const [cx, cy, a0] of corners) {
    for (let i = 0; i <= seg; i++) {
      const a = ((a0 + (90 * i) / seg) * Math.PI) / 180
      out.push([c[0] + cx + r * Math.cos(a), c[1] + cy + r * Math.sin(a)])
    }
  }
  return dedupe(out)
}

/** closed Catmull-Rom through the points, `k` samples per span */
export function smoothClosed(pts, k = 6) {
  const n = pts.length
  const out = []
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n]
    for (let j = 0; j < k; j++) {
      const t = j / k, t2 = t * t, t3 = t2 * t
      out.push([0, 1].map((d) => 0.5 * (2 * p1[d] + (-p0[d] + p2[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * t3)))
    }
  }
  return out
}

/** open Catmull-Rom (end points kept) */
export function smoothOpen(pts, k = 6) {
  const n = pts.length
  const out = []
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)]
    for (let j = 0; j < k; j++) {
      const t = j / k, t2 = t * t, t3 = t2 * t
      out.push([0, 1].map((d) => 0.5 * (2 * p1[d] + (-p0[d] + p2[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * t3)))
    }
  }
  out.push(pts[n - 1])
  return out
}

export function densify(pts, h) {
  const out = [pts[0]]
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const k = Math.max(1, Math.ceil(L / h))
    for (let s = 1; s <= k; s++) out.push([a[0] + ((b[0] - a[0]) * s) / k, a[1] + ((b[1] - a[1]) * s) / k])
  }
  return out
}

function dedupe(pts) {
  const out = []
  for (const p of pts) {
    const q = out[out.length - 1]
    if (!q || Math.hypot(p[0] - q[0], p[1] - q[1]) > 1e-4) out.push(p)
  }
  while (out.length > 2 && Math.hypot(out[0][0] - out[out.length - 1][0], out[0][1] - out[out.length - 1][1]) < 1e-4) out.pop()
  return out
}
