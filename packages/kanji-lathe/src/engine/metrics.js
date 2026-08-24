// The fitness function: what the art cost the reader.
//
// Everything here is measured against the pristine skeleton (`stroke.ref`), so
// the module answers one question — after all that deformation, is this still
// the character? Two independent views are blended, because either one alone is
// trivially cheatable: a blurred raster comparison (does the ink land where the
// eye expects it?) and the stroke-contact graph (do the same strokes still meet
// each other?). The second matters more than a pure shape metric admits — a
// stroke that slips off its crossbar reads as the wrong character long before it
// looks like one.
//
// Pure and DOM-free, so it runs in a Web Worker and in node.
import { clamp, polylineLength, simplify } from '../geom/path.js'
import { trimmedPoints, trimmedWidths, EM } from './skeleton.js'

// ── Weights ──────────────────────────────────────────────────────────────────
// Deliberately constants and not controls: a score you can turn up is not a
// score. The blend leans on shape because it is the continuous one — topology
// moves in steps and would make the headline number jumpy on its own.
const W_SHAPE = 0.6
const W_TOPO = 0.4
// Losing a stroke outright is categorically worse than distorting one: a glyph
// that is missing 1 of its 2 strokes is not a damaged character, it is another
// character (or none).
const DROP_PENALTY = 1.5

// ── Tuning ───────────────────────────────────────────────────────────────────
const GRID = 48 // raster resolution for shapeMatch
const GRID_FAST = 32 // ctx.quality < 1 (thumbnail grids, evolve scoring)
const PAD = 3 // cells of margin, so the blur never clips ink off the edge
const SUB = 0.5 // raster sub-sample spacing along a segment, in cells
const BLUR_PASSES = 2
const MIN_SPAN = 1e-3

// Lengths below are fractions of the em, so they survive a change of grid.
const DEAD_LEN = 0.002 // a stroke shorter than this counts as gone
// The two contact tolerances are fractions of the glyph's OWN extent, not of the
// em, so scaling a glyph up cannot pull its junctions apart.
const TOPO_SIMPLIFY = 0.012 // RDP tolerance before the contact scan
const CONTACT_TOL = 0.02 // strokes closer than this count as meeting
const CLOUD_STEP = 1 / 64 // spacing of the point cloud used for gaps and ink
const GAP_CELL = 1 / 16 // first-tier search radius for minGap
const NOMINAL_W = 0.028 // assumed half-width when the nib has not run yet
const INK_R_MAX = 0.12 // stamping radius cap for the ink grid
const MAX_CLOUD = 2400
const COARSE_CLOUD = 800 // subsample before the wide (rare) minGap tiers
const INK = 64 // ink grid resolution over the em box
const GRID_DIM_MAX = 64 // cap on the gap grid's dimensions
const CROWD_REACH = 1.25 // ink within this many combined widths reads as crowded

// The score is an observation, not a design decision — nothing to tune here.
export const params = []

const fin = (v, d = 0) => (Number.isFinite(v) ? v : d)

/**
 * Score `skel` against its own reference geometry. Never throws and never
 * returns a non-finite number, however wild the deformation upstream was.
 */
export function computeMetrics(skel, P, ctx) {
  const em = skel && skel.em > 0 ? skel.em : EM
  const strokes = (skel && skel.strokes) || []
  const scratch = (skel && skel.scratch) || {}
  const grid = ctx && ctx.quality < 1 ? GRID_FAST : GRID

  // What is actually drawn right now: alive, trimmed, and long enough to see.
  const live = []
  const deadLen = DEAD_LEN * em
  let dropped = 0
  for (const s of strokes) {
    const p = s.alive ? trimmedPoints(s) : null
    const len = p && p.length >= 4 ? polylineLength(p) : 0
    // a NaN stroke fails this test too, which is the right answer for it
    if (!(len > deadLen)) {
      dropped++
      continue
    }
    live.push({ i: s.i, p, w: trimmedWidths(s), len })
  }

  // — shape: two blurred rasters, each normalised to its own bbox
  const cur = rasterOf(live.map((e) => e.p), grid)
  let ref = scratch.mxRefRaster
  if (!ref || ref.length !== grid * grid) {
    ref = rasterOf(strokes.map((s) => s.ref), grid)
    scratch.mxRefRaster = ref // `ref` never changes, so this survives every call
  }
  const shapeMatch = correlate(cur, ref)

  // — topology: which strokes still touch which
  const curPairs = contactPairs(live)
  let refPairs = scratch.mxRefPairs
  if (!refPairs) {
    refPairs = contactPairs(strokes.map((s) => ({ i: s.i, p: s.ref })))
    scratch.mxRefPairs = refPairs
  }
  const topology = jaccard(curPairs, refPairs)

  // — everything else rides on one resampled point cloud
  const cloud = buildCloud(live, em)
  const halfW = cloud.meanW > 0 ? cloud.meanW : em * NOMINAL_W
  const crowdTol = halfW * 2 * CROWD_REACH
  const near = proximity(cloud, em, crowdTol)
  const ink = inkStats(cloud, em, halfW)

  const lost = strokes.length ? dropped / strokes.length : 0
  const legibility = clamp((W_SHAPE * shapeMatch + W_TOPO * topology) * (1 - DROP_PENALTY * lost), 0, 1)

  return {
    legibility: fin(legibility),
    shapeMatch: fin(shapeMatch),
    topology: fin(topology),
    coverage: fin(ink.coverage),
    gray: fin(ink.gray),
    bboxFill: fin(ink.bboxFill),
    minGap: fin(near.minGap, em),
    crowding: fin(near.crowding),
    inkLength: fin(cloud.total),
    strokesDropped: dropped | 0,
  }
}

// ── Shape: rasterise, blur, correlate ────────────────────────────────────────

function rasterOf(lines, grid) {
  const g = new Float32Array(grid * grid)
  rasterise(lines, g, grid)
  const tmp = new Float32Array(grid * grid)
  for (let k = 0; k < BLUR_PASSES; k++) boxBlur(g, tmp, grid)
  return g
}

/**
 * Coverage raster of a bundle of centrelines, normalised to their own bounding
 * box. Sizing the glyph up is not a legibility problem, so it must not register;
 * moving ink around *inside* the glyph is, so it must. The scale is uniform,
 * which means a squash still counts as a change — because it is one.
 */
function rasterise(lines, g, grid) {
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (const p of lines) {
    for (let i = 0; i < p.length; i += 2) {
      const x = p[i]
      const y = p[i + 1]
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue
      if (x < x0) x0 = x
      if (x > x1) x1 = x
      if (y < y0) y0 = y
      if (y > y1) y1 = y
    }
  }
  if (x0 === Infinity) return g
  const span = Math.max(x1 - x0, y1 - y0, MIN_SPAN)
  const scale = (grid - 2 * PAD) / span
  const cx = (x0 + x1) / 2
  const cy = (y0 + y1) / 2
  const half = grid / 2
  for (const p of lines) {
    let px = 0
    let py = 0
    let has = false
    for (let i = 0; i < p.length; i += 2) {
      const x = p[i]
      const y = p[i + 1]
      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        has = false
        continue
      }
      const gx = (x - cx) * scale + half
      const gy = (y - cy) * scale + half
      if (has) drawSegment(g, grid, px, py, gx, gy)
      px = gx
      py = gy
      has = true
    }
  }
  return g
}

/** Splat a segment as arc-length-weighted samples, so density means ink. */
function drawSegment(g, grid, ax, ay, bx, by) {
  const dx = bx - ax
  const dy = by - ay
  const len = Math.hypot(dx, dy)
  if (!(len >= 0)) return
  const steps = Math.min(4096, Math.max(1, Math.ceil(len / SUB)))
  const w = len / steps
  for (let k = 0; k < steps; k++) {
    const t = (k + 0.5) / steps
    splat(g, grid, ax + dx * t, ay + dy * t, w)
  }
}

function splat(g, grid, x, y, w) {
  const fx = Math.floor(x - 0.5)
  const fy = Math.floor(y - 0.5)
  const tx = x - 0.5 - fx
  const ty = y - 0.5 - fy
  for (let dy = 0; dy < 2; dy++) {
    const yy = fy + dy
    if (yy < 0 || yy >= grid) continue
    const wy = w * (dy ? ty : 1 - ty)
    for (let dx = 0; dx < 2; dx++) {
      const xx = fx + dx
      if (xx < 0 || xx >= grid) continue
      g[yy * grid + xx] += wy * (dx ? tx : 1 - tx)
    }
  }
}

/**
 * Separable 3-tap box blur, edges clamped. The blur is the whole point of the
 * comparison: it asks where the ink roughly is, not which cells it happened to
 * land in, so a stroke that shifted by a hair still matches itself.
 */
function boxBlur(g, tmp, grid) {
  for (let y = 0; y < grid; y++) {
    const row = y * grid
    for (let x = 0; x < grid; x++) {
      const a = g[row + (x > 0 ? x - 1 : 0)]
      const b = g[row + x]
      const c = g[row + (x < grid - 1 ? x + 1 : grid - 1)]
      tmp[row + x] = (a + b + c) / 3
    }
  }
  for (let x = 0; x < grid; x++) {
    for (let y = 0; y < grid; y++) {
      const a = tmp[(y > 0 ? y - 1 : 0) * grid + x]
      const b = tmp[y * grid + x]
      const c = tmp[(y < grid - 1 ? y + 1 : grid - 1) * grid + x]
      g[y * grid + x] = (a + b + c) / 3
    }
  }
}

/** Normalised cross-correlation, negative agreement folded to zero. */
function correlate(a, b) {
  const n = a.length
  if (!n || n !== b.length) return 0
  let sa = 0
  let sb = 0
  for (let i = 0; i < n; i++) {
    sa += a[i]
    sb += b[i]
  }
  const ma = sa / n
  const mb = sb / n
  let saa = 0
  let sbb = 0
  let sab = 0
  for (let i = 0; i < n; i++) {
    const da = a[i] - ma
    const db = b[i] - mb
    saa += da * da
    sbb += db * db
    sab += da * db
  }
  // a blank raster has no variance to correlate: blank vs blank agrees, blank
  // vs inked does not
  if (saa < 1e-12 || sbb < 1e-12) return saa < 1e-12 && sbb < 1e-12 ? 1 : 0
  return clamp(sab / Math.sqrt(saa * sbb), 0, 1)
}

// ── Topology: the stroke-contact graph ───────────────────────────────────────

/** Largest dimension of a bundle of polylines — the yardstick for tolerances. */
function spanOf(entries) {
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (const e of entries) {
    const p = e.p
    if (!p) continue
    for (let i = 0; i < p.length; i += 2) {
      const x = p[i]
      const y = p[i + 1]
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue
      if (x < x0) x0 = x
      if (x > x1) x1 = x
      if (y < y0) y0 = y
      if (y > y1) y1 = y
    }
  }
  return x0 === Infinity ? MIN_SPAN : Math.max(x1 - x0, y1 - y0, MIN_SPAN)
}

/**
 * Pairs of distinct strokes that meet. Contact rather than strict intersection:
 * kanji are full of T-junctions where one stroke lands *on* another, and an
 * exact-crossing test would flip those on and off with rounding noise. The
 * tolerance is wider than the simplification below, so simplifying can never
 * invent or destroy a contact by itself.
 */
function contactPairs(entries) {
  const span = spanOf(entries)
  const tol = CONTACT_TOL * span
  const tol2 = tol * tol
  const items = []
  for (const e of entries) {
    const p = e.p
    if (!p || p.length < 4) continue
    const q = simplify(p, TOPO_SIMPLIFY * span)
    let x0 = Infinity
    let y0 = Infinity
    let x1 = -Infinity
    let y1 = -Infinity
    for (let i = 0; i < q.length; i += 2) {
      const x = q[i]
      const y = q[i + 1]
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue
      if (x < x0) x0 = x
      if (x > x1) x1 = x
      if (y < y0) y0 = y
      if (y > y1) y1 = y
    }
    if (x0 === Infinity) continue
    items.push({ i: e.i, q, x0, y0, x1, y1 })
  }
  const pairs = new Set()
  for (let a = 0; a < items.length; a++) {
    const A = items[a]
    for (let b = a + 1; b < items.length; b++) {
      const B = items[b]
      if (A.x1 + tol < B.x0 || B.x1 + tol < A.x0 || A.y1 + tol < B.y0 || B.y1 + tol < A.y0) continue
      if (touches(A.q, B.q, tol, tol2)) pairs.add(A.i * 4096 + B.i)
    }
  }
  return pairs
}

function touches(p, q, tol, tol2) {
  for (let i = 0; i + 3 < p.length; i += 2) {
    const ax = p[i]
    const ay = p[i + 1]
    const bx = p[i + 2]
    const by = p[i + 3]
    const alo = ax < bx ? ax : bx
    const ahi = ax < bx ? bx : ax
    const blo = ay < by ? ay : by
    const bhi = ay < by ? by : ay
    for (let j = 0; j + 3 < q.length; j += 2) {
      const cx = q[j]
      const cy = q[j + 1]
      const dx = q[j + 2]
      const dy = q[j + 3]
      if (ahi + tol < (cx < dx ? cx : dx) || (cx < dx ? dx : cx) + tol < alo) continue
      if (bhi + tol < (cy < dy ? cy : dy) || (cy < dy ? dy : cy) + tol < blo) continue
      if (segSegDist2(ax, ay, bx, by, cx, cy, dx, dy) <= tol2) return true
    }
  }
  return false
}

/** Squared distance between two segments; 0 when they cross. */
function segSegDist2(ax, ay, bx, by, cx, cy, dx, dy) {
  const ux = bx - ax
  const uy = by - ay
  const vx = dx - cx
  const vy = dy - cy
  const wx = ax - cx
  const wy = ay - cy
  const a = ux * ux + uy * uy
  const b = ux * vx + uy * vy
  const c = vx * vx + vy * vy
  const d = ux * wx + uy * wy
  const e = vx * wx + vy * wy
  const D = a * c - b * b
  let sN = 0
  let sD = D
  let tN = 0
  let tD = D
  if (D < 1e-12) {
    // parallel or degenerate: pin s to the start and solve for t alone
    sN = 0
    sD = 1
    tN = e
    tD = c
  } else {
    sN = b * e - c * d
    tN = a * e - b * d
    if (sN < 0) {
      sN = 0
      tN = e
      tD = c
    } else if (sN > sD) {
      sN = sD
      tN = e + b
      tD = c
    }
  }
  if (tN < 0) {
    tN = 0
    if (-d < 0) sN = 0
    else if (-d > a) sN = sD
    else {
      sN = -d
      sD = a
    }
  } else if (tN > tD) {
    tN = tD
    const f = b - d
    if (f < 0) sN = 0
    else if (f > a) sN = sD
    else {
      sN = f
      sD = a
    }
  }
  const s = Math.abs(sD) < 1e-12 ? 0 : sN / sD
  const t = Math.abs(tD) < 1e-12 ? 0 : tN / tD
  const px = wx + s * ux - t * vx
  const py = wy + s * uy - t * vy
  return px * px + py * py
}

function jaccard(a, b) {
  if (!a.size && !b.size) return 1 // no crossings to lose is a perfect score
  let inter = 0
  for (const k of a) if (b.has(k)) inter++
  const union = a.size + b.size - inter
  return union > 0 ? inter / union : 1
}

// ── Point cloud: gaps, crowding, ink ─────────────────────────────────────────

/**
 * Resample every live stroke to a fixed spacing. One cloud feeds the gap search,
 * the crowding count and the ink grid, so none of them has to walk the geometry
 * again — and the fixed spacing is what lets the spatial grid stay O(n).
 */
function buildCloud(entries, em) {
  let total = 0
  for (const e of entries) total += e.len
  const step = Math.max(CLOUD_STEP * em, total / MAX_CLOUD, 1e-3)
  const cap = Math.ceil(total / step) + entries.length * 2 + 8
  const xs = new Float64Array(cap)
  const ys = new Float64Array(cap)
  const ws = new Float64Array(cap)
  const sid = new Int32Array(cap)
  let n = 0
  let sumW = 0
  const push = (x, y, w, id) => {
    if (n >= cap || !Number.isFinite(x) || !Number.isFinite(y)) return
    xs[n] = x
    ys[n] = y
    ws[n] = Number.isFinite(w) && w > 0 ? w : 0
    sid[n] = id
    sumW += ws[n]
    n++
  }
  for (const e of entries) {
    const p = e.p
    const w = e.w
    let acc = step // forces an emit at the very first point
    for (let i = 0; i + 3 < p.length && n < cap; i += 2) {
      const ax = p[i]
      const ay = p[i + 1]
      const bx = p[i + 2]
      const by = p[i + 3]
      const wa = w && w.length > i / 2 ? w[i / 2] : 0
      const wb = w && w.length > i / 2 + 1 ? w[i / 2 + 1] : 0
      const d = Math.hypot(bx - ax, by - ay)
      if (!(d > 0)) continue
      let t = 0
      while (acc + d * (1 - t) >= step && n < cap) {
        t += (step - acc) / d
        if (!(t >= 0 && t <= 1)) break
        acc = 0
        push(ax + (bx - ax) * t, ay + (by - ay) * t, wa + (wb - wa) * t, e.i)
      }
      acc += d * (1 - t)
    }
    const m = p.length
    if (m >= 2) push(p[m - 2], p[m - 1], w && w.length ? w[w.length - 1] : 0, e.i)
  }
  return { xs, ys, ws, sid, n, step, total, meanW: n ? sumW / n : 0 }
}

/** Bucket the cloud into a uniform grid whose cell is at least `cell` wide. */
function gridOf(cloud, cell) {
  const { xs, ys, n } = cloud
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (let i = 0; i < n; i++) {
    if (xs[i] < x0) x0 = xs[i]
    if (xs[i] > x1) x1 = xs[i]
    if (ys[i] < y0) y0 = ys[i]
    if (ys[i] > y1) y1 = ys[i]
  }
  if (!(x0 <= x1)) return null
  // widening the cell rather than growing the grid keeps a scattered glyph from
  // allocating a huge sparse table
  const eff = Math.max(cell, (x1 - x0) / GRID_DIM_MAX, (y1 - y0) / GRID_DIM_MAX, 1e-6)
  const cols = Math.floor((x1 - x0) / eff) + 1
  const rows = Math.floor((y1 - y0) / eff) + 1
  const cells = cols * rows
  const ci = new Int32Array(n)
  const start = new Int32Array(cells + 1)
  for (let i = 0; i < n; i++) {
    const cx = clamp(Math.floor((xs[i] - x0) / eff), 0, cols - 1)
    const cy = clamp(Math.floor((ys[i] - y0) / eff), 0, rows - 1)
    ci[i] = cy * cols + cx
    start[ci[i] + 1]++
  }
  for (let c = 0; c < cells; c++) start[c + 1] += start[c]
  const cursor = start.slice(0, cells)
  const items = new Int32Array(n)
  for (let i = 0; i < n; i++) items[cursor[ci[i]]++] = i
  return { cols, rows, eff, ci, start, items }
}

/** Nearest other-stroke neighbour for every point, in one 3×3 sweep. */
function sweep(cloud, g, crowd2) {
  const { xs, ys, sid, n } = cloud
  const { cols, rows, ci, start, items } = g
  let best2 = Infinity
  let crowded = 0
  for (let i = 0; i < n; i++) {
    const col = ci[i] % cols
    const row = (ci[i] / cols) | 0
    const x = xs[i]
    const y = ys[i]
    const id = sid[i]
    let near2 = Infinity
    for (let dr = -1; dr <= 1; dr++) {
      const r = row + dr
      if (r < 0 || r >= rows) continue
      for (let dc = -1; dc <= 1; dc++) {
        const c = col + dc
        if (c < 0 || c >= cols) continue
        const cell = r * cols + c
        for (let k = start[cell]; k < start[cell + 1]; k++) {
          const j = items[k]
          if (sid[j] === id) continue
          const ex = xs[j] - x
          const ey = ys[j] - y
          const d2 = ex * ex + ey * ey
          if (d2 < near2) near2 = d2
        }
      }
    }
    if (near2 < best2) best2 = near2
    if (near2 <= crowd2) crowded++
  }
  return { best2, crowded }
}

/** Take every k-th point so the rare wide searches stay cheap. */
function coarsen(cloud, maxN) {
  if (cloud.n <= maxN) return cloud
  const stride = Math.ceil(cloud.n / maxN)
  const n = Math.ceil(cloud.n / stride)
  const xs = new Float64Array(n)
  const ys = new Float64Array(n)
  const sid = new Int32Array(n)
  for (let i = 0, j = 0; j < n; i += stride, j++) {
    xs[j] = cloud.xs[i]
    ys[j] = cloud.ys[i]
    sid[j] = cloud.sid[i]
  }
  return { ...cloud, xs, ys, sid, n }
}

/**
 * Smallest clearance between different strokes, plus the share of the ink that
 * sits within a hair of other ink. The search widens in tiers: a hit is only
 * trusted once it is closer than the cell size, which is what the 3×3 window
 * actually guarantees.
 */
function proximity(cloud, em, crowdTol) {
  if (cloud.n < 2) return { minGap: em, crowding: 0 }
  let cell = Math.max(GAP_CELL * em, crowdTol)
  let gap = Infinity
  let crowding = 0
  for (let tier = 0; tier < 3; tier++) {
    const c = tier === 0 ? cloud : coarsen(cloud, COARSE_CLOUD)
    const g = gridOf(c, cell)
    if (!g) break
    const r = sweep(c, g, tier === 0 ? crowdTol * crowdTol : -1)
    if (tier === 0) crowding = c.n ? r.crowded / c.n : 0
    if (r.best2 < Infinity) {
      const d = Math.sqrt(r.best2)
      if (d < gap) gap = d
      if (d <= g.eff) break // inside the window's guarantee, so it is exact
    }
    cell *= 4
  }
  return { minGap: Number.isFinite(gap) ? Math.min(gap, em) : em, crowding: clamp(crowding, 0, 1) }
}

/**
 * Ink area by stamping half-width discs into a coarse grid over the em box.
 * A grid rather than a sum of stroke areas because overlapping strokes must
 * count once — that overlap is exactly what a dense kanji is made of.
 */
function inkStats(cloud, em, halfW) {
  const { xs, ys, ws, n } = cloud
  const cell = em / INK
  const rMax = INK_R_MAX * em
  const g = new Float32Array(INK * INK)
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (let i = 0; i < n; i++) {
    const r = clamp(ws[i] > 0 ? ws[i] : halfW, 0.5, rMax)
    if (xs[i] - r < x0) x0 = xs[i] - r
    if (xs[i] + r > x1) x1 = xs[i] + r
    if (ys[i] - r < y0) y0 = ys[i] - r
    if (ys[i] + r > y1) y1 = ys[i] + r
  }
  if (x0 === Infinity) return { gray: 0, coverage: 0, bboxFill: 0 }
  // when the nib is far wider than the sample spacing the discs overlap many
  // times over, so skipping samples costs nothing but the work
  const stride = clamp(Math.floor(halfW / Math.max(cloud.step, 1e-6)), 1, 8)
  for (let i = 0; i < n; i += stride) {
    const px = xs[i]
    const py = ys[i]
    const r = clamp(ws[i] > 0 ? ws[i] : halfW, 0.5, rMax)
    const c0 = clamp(Math.floor((px - r) / cell), 0, INK - 1)
    const c1 = clamp(Math.floor((px + r) / cell), 0, INK - 1)
    const r0 = clamp(Math.floor((py - r) / cell), 0, INK - 1)
    const r1 = clamp(Math.floor((py + r) / cell), 0, INK - 1)
    for (let row = r0; row <= r1; row++) {
      const cy = (row + 0.5) * cell - py
      for (let col = c0; col <= c1; col++) {
        const cx = (col + 0.5) * cell - px
        const cov = clamp((r - Math.hypot(cx, cy)) / cell + 0.5, 0, 1)
        const k = row * INK + col
        if (cov > g[k]) g[k] = cov
      }
    }
  }
  let sum = 0
  for (let i = 0; i < g.length; i++) sum += g[i]
  const gray = clamp(sum / (INK * INK), 0, 1)
  const cw = Math.max(0, Math.min(em, x1) - Math.max(0, x0))
  const ch = Math.max(0, Math.min(em, y1) - Math.max(0, y0))
  const coverage = clamp((cw * ch) / (em * em), 0, 1)
  const box = (x1 - x0) * (y1 - y0)
  const bboxFill = box > 1e-6 ? clamp((gray * em * em) / box, 0, 1) : 0
  return { gray, coverage, bboxFill }
}
