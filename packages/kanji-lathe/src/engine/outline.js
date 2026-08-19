// Centreline + half-widths → the filled shape the renderer, the metrics and the
// font all read. One ribbon per stroke: side A offset forward, a terminal, side
// B offset back, another terminal.
//
// Two details are what make that survive real kanji rather than textbook
// polylines. Joins take the true miter — the bisector normal scaled by
// 1/cos(θ/2) — clamped by miterLimit, with a hairpin reversal (where that scale
// runs away) forced round however the caller set `join`. And the inner side of
// a turn folds back on itself the moment the brush is wider than the local
// curvature radius, which a corner with a fat nib always is; a folded contour
// punches holes under the non-zero rule, so unfold() drops every offset point
// the boundary has already walked past. At a corner that lands exactly on the
// intersection of the two inner offset lines, which is the true boundary.
//
// WINDING — every returned polygon has positive signedArea() in these y-down em
// coordinates. The exporter mirrors y on the way into the font, turning that
// into the clockwise outer contour TrueType wants; because every contour agrees,
// overlapping strokes union instead of cancelling under the non-zero rule.
import { clamp, tangents, signedArea, toPathData } from '../geom/path.js'
import { EM } from '../data/loader.js'

const CAP_KINDS = new Set(['butt', 'round', 'pointed', 'wedge', 'slab', 'bulb', 'split'])
const JOIN_KINDS = new Set(['round', 'miter', 'bevel'])

const WELD = 1e-6 // points nearer than this are one point
const MIN_HALF = 0.05 // a zero-width ribbon has no orientation to report
const MAX_HALF = EM // a half-width past one em is a mistake, not a brush
const MITER_MAX = 8
const CAP_MAX = 4
const REV_COS = -0.996 // ≈175°, past which the miter is meaningless
const MIN_COS = 0.05 // floor on the bisector projection we divide by
const ARC_TOL = 0.3 // chord sagitta in em units — sets arc smoothness
const ARC_MIN = 2
const ARC_MAX = 32
const JOIN_ARC_MAX = 16
const WEDGE_EXT = 0.95
const SLAB_EXT = 0.45
const SPLIT_EXT = 0.35
const SPLIT_DEPTH = 0.6
const BULB_R = 0.3 // bulb radius is w·(1 + BULB_R·capScale)
const BULB_OFF = 0.45

// ── scratch ──────────────────────────────────────────────────────────────────
// Outlining runs tens of thousands of times per font export and never re-enters
// itself, so the working buffers live here instead of in the nursery.
const S = { pts: null, wid: null, dir: null, tan: null, ax: null, au: null, bx: null, bu: null }
const fit = (k, n) => {
  const b = S[k]
  return b && b.length >= n ? b : (S[k] = new Float64Array(n))
}

let out = new Float64Array(2048)
let ok = 0

/** Append a vertex, skipping anything non-finite or coincident with the last. */
const emit = (x, y) => {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return
  if (ok >= 2 && Math.abs(x - out[ok - 2]) < WELD && Math.abs(y - out[ok - 1]) < WELD) return
  if (ok + 2 > out.length) {
    const bigger = new Float64Array(out.length * 2)
    bigger.set(out)
    out = bigger
  }
  out[ok++] = x
  out[ok++] = y
}

/** Segment count for an arc of radius `r` sweeping `sw`, at a fixed flatness. */
const arcSegs = (sw, r, max) => {
  if (!(r > ARC_TOL)) return ARC_MIN
  const step = 2 * Math.acos(clamp(1 - ARC_TOL / r, -1, 1))
  return clamp(Math.ceil(Math.abs(sw) / Math.max(step, 1e-3)), ARC_MIN, max)
}

/** Closed disc, used for degenerate strokes. Positive sweep = our winding. */
function disc(cx, cy, r) {
  const segs = arcSegs(2 * Math.PI, r, ARC_MAX)
  const p = new Float64Array(segs * 2)
  for (let j = 0; j < segs; j++) {
    const a = (2 * Math.PI * j) / segs
    p[j * 2] = cx + Math.cos(a) * r
    p[j * 2 + 1] = cy + Math.sin(a) * r
  }
  return p
}

function reverseInPlace(p) {
  for (let i = 0, j = p.length - 2; i < j; i += 2, j -= 2) {
    const x = p[i]
    const y = p[i + 1]
    p[i] = p[j]
    p[i + 1] = p[j + 1]
    p[j] = x
    p[j + 1] = y
  }
}

// ── terminals ────────────────────────────────────────────────────────────────

/**
 * Vertices between the two side endpoints. `d` points out of the stroke, which
 * makes the start terminal the same code in a reversed frame — it then runs
 * from side B's endpoint back to side A's, exactly where the ribbon needs it.
 */
function emitCap(kind, px, py, dx, dy, w, capScale) {
  const nx = -dy
  const ny = dx
  const e = capScale * w
  if (kind === 'round') {
    const a0 = Math.atan2(ny, nx)
    const segs = arcSegs(Math.PI, w, ARC_MAX)
    for (let j = 1; j < segs; j++) {
      const a = a0 - (Math.PI * j) / segs
      emit(px + Math.cos(a) * w, py + Math.sin(a) * w)
    }
  } else if (kind === 'pointed') {
    // the brush leaving the paper: both sides converge on one extended point
    emit(px + dx * e, py + dy * e)
  } else if (kind === 'wedge') {
    // one side overshoots, so the cut across the tip is a chisel's slant
    const s = e * WEDGE_EXT
    emit(px + nx * w + dx * s, py + ny * w + dy * s)
  } else if (kind === 'slab') {
    const s = e * SLAB_EXT
    emit(px + nx * w + dx * s, py + ny * w + dy * s)
    emit(px - nx * w + dx * s, py - ny * w + dy * s)
  } else if (kind === 'bulb') {
    // a swollen head: one full turn, wound the same way as the ribbon so the
    // non-zero rule unions it with the stroke instead of hollowing it out
    const cx = px + dx * w * BULB_OFF * capScale
    const cy = py + dy * w * BULB_OFF * capScale
    const r = w * (1 + BULB_R * capScale)
    const a0 = Math.atan2(py + ny * w - cy, px + nx * w - cx)
    const segs = arcSegs(2 * Math.PI, r, ARC_MAX)
    for (let j = 0; j < segs; j++) {
      const a = a0 - (2 * Math.PI * j) / segs
      emit(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
    }
  } else if (kind === 'split') {
    // dry brush: the tip keeps two prongs and the notch bites back inward
    const s = e * SPLIT_EXT
    emit(px + nx * w + dx * s, py + ny * w + dy * s)
    emit(px - dx * e * SPLIT_DEPTH, py - dy * e * SPLIT_DEPTH)
    emit(px - nx * w + dx * s, py - ny * w + dy * s)
  }
  // butt: the straight run between the two side endpoints already is the cap
}

// ── one side of the ribbon ───────────────────────────────────────────────────

/**
 * Offset every vertex by `sign · normal · halfWidth`, writing points into X and
 * the local direction of travel into U (unfold() needs that to tell a fold from
 * an honest turn).
 */
function buildSide(sign, m, closed, join, miterLimit, P, W, D, T, X, U) {
  let k = 0
  for (let i = 0; i < m; i++) {
    const px = P[i * 2]
    const py = P[i * 2 + 1]
    const hw = W[i]
    const inS = closed ? (i + m - 1) % m : i - 1
    const outS = closed ? i : i === m - 1 ? -1 : i
    if (inS < 0 || outS < 0) {
      const j = inS < 0 ? outS : inS
      const dx = D[j * 2]
      const dy = D[j * 2 + 1]
      X[k * 2] = px - sign * dy * hw
      X[k * 2 + 1] = py + sign * dx * hw
      U[k * 2] = dx
      U[k * 2 + 1] = dy
      k++
      continue
    }
    const d1x = D[inS * 2]
    const d1y = D[inS * 2 + 1]
    const d2x = D[outS * 2]
    const d2y = D[outS * 2 + 1]
    const cosTurn = d1x * d2x + d1y * d2y
    if (cosTurn > REV_COS) {
      // the miter: the bisector normal is already unit, so the whole correction
      // is 1/cos(θ/2) — and cos(θ/2) is the bisector's projection on a segment
      const tx = T[i * 2]
      const ty = T[i * 2 + 1]
      const cosHalf = 0.5 * (tx * d1x + ty * d1y + tx * d2x + ty * d2y)
      const scale = 1 / Math.max(cosHalf, MIN_COS)
      if (scale <= miterLimit) {
        X[k * 2] = px - sign * ty * hw * scale
        X[k * 2 + 1] = py + sign * tx * hw * scale
        U[k * 2] = tx
        U[k * 2 + 1] = ty
        k++
        continue
      }
    }
    // Past the limit. Only the outer side of the turn can spike, so it gets the
    // round or bevel treatment; the inner side takes the plain chord and lets
    // unfold() clean up whatever of it lies buried in the ink.
    const cross = d1x * d2y - d1y * d2x
    const outer = sign > 0 ? cross <= 0 : cross >= 0
    if (outer && (join === 'round' || cosTurn <= REV_COS)) {
      const a0 = Math.atan2(sign * d1x, -sign * d1y)
      const sw = Math.atan2(cross, cosTurn)
      const segs = arcSegs(sw, hw, JOIN_ARC_MAX)
      const dir = sw >= 0 ? 1 : -1
      for (let j = 0; j <= segs; j++) {
        const a = a0 + (sw * j) / segs
        const ca = Math.cos(a)
        const sa = Math.sin(a)
        X[k * 2] = px + ca * hw
        X[k * 2 + 1] = py + sa * hw
        U[k * 2] = -sa * dir
        U[k * 2 + 1] = ca * dir
        k++
      }
    } else {
      X[k * 2] = px - sign * d1y * hw
      X[k * 2 + 1] = py + sign * d1x * hw
      U[k * 2] = d1x
      U[k * 2 + 1] = d1y
      k++
      X[k * 2] = px - sign * d2y * hw
      X[k * 2 + 1] = py + sign * d2x * hw
      U[k * 2] = d2x
      U[k * 2 + 1] = d2y
      k++
    }
  }
  return k
}

/**
 * Local loop removal: pop any point the boundary has already travelled past.
 * One backward step means the offset has crossed itself, and a crossed contour
 * reads as a hole. The first point is anchored — the terminal needs it.
 */
function unfold(X, U, k) {
  let w = 1
  for (let r = 1; r < k; r++) {
    const x = X[r * 2]
    const y = X[r * 2 + 1]
    while (w > 1 && (x - X[(w - 1) * 2]) * U[(w - 1) * 2] + (y - X[(w - 1) * 2 + 1]) * U[(w - 1) * 2 + 1] < 0) w--
    X[w * 2] = x
    X[w * 2 + 1] = y
    U[w * 2] = U[r * 2]
    U[w * 2 + 1] = U[r * 2 + 1]
    w++
  }
  return w
}

// ── the outline ──────────────────────────────────────────────────────────────

/**
 * Closed polygons tracing a variable-width centreline. `pts` is flat
 * [x0,y0,x1,y1,…], `widths` one half-width per point. Returns an empty array
 * only when there is genuinely nothing to draw.
 */
export function strokeOutline(pts, widths, opts = {}) {
  if (!pts || pts.length < 2) return []
  const capStart = CAP_KINDS.has(opts.capStart) ? opts.capStart : 'butt'
  const capEnd = CAP_KINDS.has(opts.capEnd) ? opts.capEnd : 'butt'
  const join = JOIN_KINDS.has(opts.join) ? opts.join : 'round'
  const miterLimit = Number.isFinite(opts.miterLimit) ? clamp(opts.miterLimit, 1, MITER_MAX) : 4
  const capScale = Number.isFinite(opts.capScale) ? clamp(opts.capScale, 0, CAP_MAX) : 1
  const closeTol = Number.isFinite(opts.closeTol) ? clamp(opts.closeTol, 0, EM) : 0

  // 1 — weld and sanitise. Everything below may assume finite points, a real
  // gap between consecutive ones, and a half-width inside sane bounds.
  const np = pts.length >> 1
  const wn = widths ? widths.length : 0
  const P = fit('pts', np * 2)
  const W = fit('wid', np)
  let m = 0
  for (let i = 0; i < np; i++) {
    const x = pts[i * 2]
    const y = pts[i * 2 + 1]
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue
    let hw = i < wn ? widths[i] : m > 0 ? W[m - 1] : MIN_HALF
    if (!Number.isFinite(hw)) hw = MIN_HALF
    hw = clamp(hw, MIN_HALF, MAX_HALF)
    if (m > 0 && Math.abs(x - P[(m - 1) * 2]) < WELD && Math.abs(y - P[(m - 1) * 2 + 1]) < WELD) {
      if (hw > W[m - 1]) W[m - 1] = hw
      continue
    }
    P[m * 2] = x
    P[m * 2 + 1] = y
    W[m] = hw
    m++
  }
  if (m === 0) return []
  if (m === 1) return W[0] > MIN_HALF ? [disc(P[0], P[1], W[0])] : []

  // A stroke whose ends meet is a ring: cyclic normals, no terminals, and the
  // seam left as a zero-width slit so one contour still states one winding.
  let closed = false
  if (closeTol > 0 && m >= 4 && Math.hypot(P[0] - P[(m - 1) * 2], P[1] - P[(m - 1) * 2 + 1]) <= closeTol) {
    closed = true
    m--
  }

  // 2 — segment directions and per-point tangents
  const nseg = closed ? m : m - 1
  const D = fit('dir', nseg * 2)
  for (let j = 0; j < nseg; j++) {
    const b = j + 1 === m ? 0 : j + 1
    let dx = P[b * 2] - P[j * 2]
    let dy = P[b * 2 + 1] - P[j * 2 + 1]
    const L = Math.hypot(dx, dy)
    if (L > WELD) {
      dx /= L
      dy /= L
    } else {
      dx = 1
      dy = 0
    }
    D[j * 2] = dx
    D[j * 2 + 1] = dy
  }
  const Pv = P.subarray(0, m * 2)
  const T = tangents(Pv, fit('tan', m * 2).subarray(0, m * 2))
  if (closed) {
    // tangents() cannot see across the seam; both ends of a ring straddle it
    for (const [i, a, b] of [
      [0, m - 1, 1],
      [m - 1, m - 2, 0],
    ]) {
      let dx = P[b * 2] - P[a * 2]
      let dy = P[b * 2 + 1] - P[a * 2 + 1]
      const L = Math.hypot(dx, dy) || 1
      T[i * 2] = dx / L
      T[i * 2 + 1] = dy / L
    }
  }

  // 3 — both sides, each unfolded
  const cap = m * (JOIN_ARC_MAX + 2) * 2
  const AX = fit('ax', cap)
  const AU = fit('au', cap)
  const BX = fit('bx', cap)
  const BU = fit('bu', cap)
  const ka = unfold(AX, AU, buildSide(1, m, closed, join, miterLimit, P, W, D, T, AX, AU))
  const kb = unfold(BX, BU, buildSide(-1, m, closed, join, miterLimit, P, W, D, T, BX, BU))

  // 4 — assemble: side A forward, terminal, side B back, terminal
  ok = 0
  for (let i = 0; i < ka; i++) emit(AX[i * 2], AX[i * 2 + 1])
  if (!closed) emitCap(capEnd, P[(m - 1) * 2], P[(m - 1) * 2 + 1], T[(m - 1) * 2], T[(m - 1) * 2 + 1], W[m - 1], capScale)
  for (let i = kb - 1; i >= 0; i--) emit(BX[i * 2], BX[i * 2 + 1])
  if (!closed) emitCap(capStart, P[0], P[1], -T[0], -T[1], W[0], capScale)
  if (ok >= 4 && Math.abs(out[0] - out[ok - 2]) < WELD && Math.abs(out[1] - out[ok - 1]) < WELD) ok -= 2
  if (ok < 6) {
    // everything collapsed — a dot is a truer answer than a sliver
    let r = 0
    for (let i = 0; i < m; i++) if (W[i] > r) r = W[i]
    return r > MIN_HALF ? [disc(P[0], P[1], r)] : []
  }

  const poly = out.slice(0, ok)
  if (signedArea(poly) < 0) reverseInPlace(poly)
  return [poly]
}

/** Total ink area of an outline set, whatever each polygon's orientation. */
export function outlineArea(polys) {
  if (!polys) return 0
  let a = 0
  for (const p of polys) if (p && p.length >= 6) a += Math.abs(signedArea(p))
  return a
}

/** One SVG path for a whole set — fill it with fill-rule="nonzero". */
export function polysToPathData(polys, prec = 2) {
  if (!polys) return ''
  let d = ''
  for (const p of polys) if (p && p.length >= 6) d += toPathData(p, true, prec)
  return d
}
