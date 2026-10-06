// Where the built things stand, and what holds them up.
//
// Sites are chosen for what they are for (a kauhale back from the beach, a
// heiau on a commanding point, a koʻa above the landing) on the generator's
// coarse reading of the land. But a building stands on the ground as it is
// finally drawn, after the stream beds are cut, the loʻi carved and the hero
// falls' headwalls cut into the valley heads; and that ground has stream
// ribbons, paddies, ʻauwai and fishpond walls on it. So every footprint is
// measured on that ground before anything is built: it keeps clear of the
// water by more than the ribbon's own width, clear of the other buildings,
// out of the sea, back from any brink, and on ground whose relief its platform
// can honestly take up. A building whose site fails moves to the nearest place
// close by that serves (a house with none nearby is simply not built).
//
// What holds each one up follows how they were built. The paepae under a hale
// is a level stone platform: no corner of the slope rises through its top, and
// its walls reach down to the lowest ground beneath it. A heiau's platform is
// built up the same way, and where that leaves a tall face on the side the
// ground falls away from, it steps down there in terraces, as heiau on
// hillsides were.

import { WORLD, HALF, HEIGHT_RES, Y_PER_M } from '../config.js'

const S = 0.016 // world units per metre for structures (features/kit.js)
const M = Y_PER_M // world Y per metre of ground
const TEX = WORLD / HEIGHT_RES // one height texel, and one cell of the drawn mesh
const BED = TEX * 0.6 // the flat of a cut stream bed, either side of its line (channels.js)
const MARGIN = 0.06 // dry ground kept between a footprint and any water's edge
const BRINK = 0.38 // steepest fall (m/m) just outside a footprint before it stands on a brink
const LIP = 0.2 // metres of paepae showing on the uphill side
const EMBED = 0.3 // metres a platform's foot is set into the ground

/** Hale: walls L × W and roof height H, metres, before the house's own scale. */
export const HOUSE = {
  noa: [7, 4.6, 5.2],
  mua: [8, 5, 5.6],
  aina: [6, 4.2, 4.6],
  kuku: [5, 3.6, 4.0],
  alii: [12, 7, 7.5],
}
export const PAEPAE_TOP = 0.45 // metres: the house floor over the ground it is set on
export const PAEPAE_RIM = 1.8 // metres the paepae runs past the walls, both sides together

/** Heiau platforms, metres: base tier L × W, tiers, and each tier's rise. */
export const HEIAU = {
  big: { L: 44, W: 30, tiers: 3, rise: 1.6 },
  small: { L: 26, W: 18, tiers: 2, rise: 1.2 },
}
/** A heiau's base tier half sizes, world units. */
export const heiauHalf = (big) => {
  const d = big ? HEIAU.big : HEIAU.small
  return [(d.L * S) / 2, (d.W * S) / 2]
}
// a heiau's face taller than about this (metres) gets a terrace in front of
// it, up to two, each a tread wide
const TERRACE_RISE = 2.6
const TERRACE_TREAD = 4.5
const TERRACES = 2
const TERRACE_MIN = 0.8 // metres: the least a terrace stands below the one above it
const TREAD_LIP = 0.15 // metres: the least a terrace's top stands over the ground under its tread

// what each kind asks of its ground: the most relief (m) its platform takes up,
// how dry (m above the sea) its lowest corner must be, and how far out its
// brink is read (world units)
const NEEDS = {
  house: { reach: 1.3, dry: 0.3, skirt: 0.06 },
  heiau: { reach: 6, dry: 0.5, skirt: 0.12 },
  luakini: { reach: 9, dry: 0.5, skirt: 0.12 },
  koa: { reach: 1, dry: 0.3, skirt: 0.06 },
  ahu: { reach: 2, dry: 0.3, skirt: 0.06 },
  imu: { reach: 0.6, dry: 0.3, skirt: 0.06 },
  halau: { reach: 0.6, dry: 0.05, skirt: 0.06 },
  salt: { reach: 0.8, dry: 0.1, skirt: 0 },
}
const HALAU_LEAN = 0.07 // steepest a canoe shed follows the beach, world Y per unit (about 3°)
const AHU = 1.6 * S // an ahu's half width, world units
const AHU_SMALL = 0.65 // and a smaller one's, as built on steep ground, as a share of that
const FORCED = 1.5 // the relief a footing forced onto steep ground takes up, as a share of its kind's own

function bilinear(h, N, x, z) {
  let fx = ((x + HALF) / WORLD) * N - 0.5
  let fz = ((z + HALF) / WORLD) * N - 0.5
  if (fx < 0) fx = 0
  if (fz < 0) fz = 0
  if (fx > N - 1.001) fx = N - 1.001
  if (fz > N - 1.001) fz = N - 1.001
  const i = fx | 0
  const j = fz | 0
  const tx = fx - i
  const tz = fz - j
  const k = j * N + i
  const a = h[k] + (h[k + 1] - h[k]) * tx
  const b = h[k + N] + (h[k + N + 1] - h[k + N]) * tx
  return a + (b - a) * tz
}

/**
 * Metres of ground as the terrain draws it up close: the finest CDLOD mesh,
 * flat triangles between vertices read bilinearly at the corners of its
 * cells, the diagonals alternating (render/terrain.js). On steep, folded
 * ground it stands well off the bilinear height in places.
 */
export function drawnMetres(h, N, x, z) {
  const c = WORLD / N
  const fx = (x + HALF) / c
  const fz = (z + HALF) / c
  const i = Math.floor(fx)
  const j = Math.floor(fz)
  const u = fx - i
  const v = fz - j
  let h00, h10, h01, h11
  if (i > 0 && j > 0 && i < N - 1 && j < N - 1) {
    // (a vertex sits on the corner of four texels: the bilinear height there
    // is just their mean)
    const k = j * N + i
    const a = h[k - N - 1]
    const b = h[k - N]
    const d = h[k - N + 1]
    const e = h[k - 1]
    const f = h[k]
    const q = h[k + 1]
    const r = h[k + N - 1]
    const t = h[k + N]
    const w = h[k + N + 1]
    h00 = (a + b + e + f) * 0.25
    h10 = (b + d + f + q) * 0.25
    h01 = (e + f + r + t) * 0.25
    h11 = (f + q + t + w) * 0.25
  } else {
    const x0 = -HALF + i * c
    const z0 = -HALF + j * c
    h00 = bilinear(h, N, x0, z0)
    h10 = bilinear(h, N, x0 + c, z0)
    h01 = bilinear(h, N, x0, z0 + c)
    h11 = bilinear(h, N, x0 + c, z0 + c)
  }
  if ((i + j) & 1) return u + v <= 1 ? h00 + (h10 - h00) * u + (h01 - h00) * v : h11 + (h01 - h11) * (1 - u) + (h10 - h11) * (1 - v)
  return v >= u ? h00 + (h11 - h01) * u + (h01 - h00) * v : h00 + (h10 - h00) * u + (h11 - h10) * v
}

/** A stream ribbon's half-width, from the area its line carries (features/streams.js), widened as on a steep reach. */
const ribbonHalf = (lineA) => Math.min(0.11, 0.009 * Math.sqrt(lineA) + 0.012) * 1.4

// --- what to keep clear of ----------------------------------------------------------------------

const CELL = 0.5
const GRID = Math.ceil(WORLD / CELL)
const cellKey = (i, j) => j * GRID + i
const cellOf = (v) => Math.floor((v + HALF) / CELL)

// (the clipping interval, kept out here so the hot loop allocates nothing)
let T0 = 0
let T1 = 1
function clipEdge(p, q) {
  if (Math.abs(p) < 1e-12) return q >= 0
  const r = q / p
  if (p < 0) {
    if (r > T1) return false
    if (r > T0) T0 = r
  } else {
    if (r < T0) return false
    if (r < T1) T1 = r
  }
  return true
}

function pointSeg(px, pz, ax, az, dx, dz, l2) {
  const t = Math.min(1, Math.max(0, ((px - ax) * dx + (pz - az) * dz) / l2))
  return Math.hypot(ax + dx * t - px, az + dz * t - pz)
}

const pointBox = (x, z, hx, hz) => Math.hypot(Math.max(0, Math.abs(x) - hx), Math.max(0, Math.abs(z) - hz))

/** Distance from segment a–b, in a box's own frame, to the box |u| ≤ hx, |v| ≤ hz (0 if they touch). */
function segBox(ax, az, bx, bz, hx, hz) {
  const dx = bx - ax
  const dz = bz - az
  // clipped against the box, anything left inside means they touch
  T0 = 0
  T1 = 1
  if (clipEdge(-dx, ax + hx) && clipEdge(dx, hx - ax) && clipEdge(-dz, az + hz) && clipEdge(dz, hz - az)) return 0
  const l2 = dx * dx + dz * dz || 1e-12
  return Math.min(
    pointBox(ax, az, hx, hz),
    pointBox(bx, bz, hx, hz),
    pointSeg(-hx, -hz, ax, az, dx, dz, l2),
    pointSeg(hx, -hz, ax, az, dx, dz, l2),
    pointSeg(hx, hz, ax, az, dx, dz, l2),
    pointSeg(-hx, hz, ax, az, dx, dz, l2),
  )
}

function insidePoly(poly, x, z) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i]
    const b = poly[j]
    if (a[1] > z !== b[1] > z && x < ((b[0] - a[0]) * (z - a[1])) / (b[1] - a[1]) + a[0]) c = !c
  }
  return c
}

/**
 * The water a building keeps clear of: polylines, each segment with the
 * distance to keep from it (its own half-width and the margin), and closed
 * outlines (paddies) to keep out of altogether. Segments go in a coarse grid:
 * packed flat once `freeze()` is called (the bulk of them, the streams), and
 * in a map for any added after.
 */
export class Clear {
  constructor() {
    this.seg = []
    this.start = null
    this.list = null
    this.cells = new Map()
    this.polys = []
    this.polyCells = new Map()
    this.seen = new Uint32Array(0)
    this.query = 0
  }

  /** A polyline, every `stride`th point (a smooth line's chords stray less than `slack` off it). */
  line(pts, r, stride = 1, slack = 0) {
    let p = pts[0]
    for (let i = stride; ; i += stride) {
      const q = pts[Math.min(i, pts.length - 1)]
      this.segment(p[0], p[1], q[0], q[1], r + slack)
      if (i >= pts.length - 1) break
      p = q
    }
  }

  segment(ax, az, bx, bz, r) {
    const k = this.seg.length / 5
    this.seg.push(ax, az, bx, bz, r)
    if (!this.start) return
    const [i0, i1, j0, j1] = this.span(k)
    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        const a = this.cells.get(cellKey(i, j))
        if (a) a.push(k)
        else this.cells.set(cellKey(i, j), [k])
      }
    }
  }

  /** The grid cells segment k (with its distance) reaches: i0, i1, j0, j1. */
  span(k, out = [0, 0, 0, 0]) {
    const seg = this.seg
    const o = k * 5
    const r = seg[o + 4]
    out[0] = Math.max(0, cellOf(Math.min(seg[o], seg[o + 2]) - r))
    out[1] = Math.min(GRID - 1, cellOf(Math.max(seg[o], seg[o + 2]) + r))
    out[2] = Math.max(0, cellOf(Math.min(seg[o + 1], seg[o + 3]) - r))
    out[3] = Math.min(GRID - 1, cellOf(Math.max(seg[o + 1], seg[o + 3]) + r))
    return out
  }

  /** Pack every segment so far into the flat grid (counted, then filled). */
  freeze() {
    const n = this.seg.length / 5
    const start = new Int32Array(GRID * GRID + 1)
    const sp = [0, 0, 0, 0]
    for (let k = 0; k < n; k++) {
      this.span(k, sp)
      for (let j = sp[2]; j <= sp[3]; j++) for (let i = sp[0]; i <= sp[1]; i++) start[cellKey(i, j) + 1]++
    }
    for (let c = 0; c < GRID * GRID; c++) start[c + 1] += start[c]
    const fill = start.slice(0, GRID * GRID)
    const list = new Int32Array(start[GRID * GRID])
    for (let k = 0; k < n; k++) {
      this.span(k, sp)
      for (let j = sp[2]; j <= sp[3]; j++) for (let i = sp[0]; i <= sp[1]; i++) list[fill[cellKey(i, j)]++] = k
    }
    this.start = start
    this.list = list
    return this
  }

  /** A closed outline: keep `r` from its edge, and never inside it. */
  outline(poly, r) {
    this.line([...poly, poly[0]], r)
    const k = this.polys.length
    this.polys.push(poly)
    let x0 = Infinity
    let x1 = -Infinity
    let z0 = Infinity
    let z1 = -Infinity
    for (const q of poly) {
      x0 = Math.min(x0, q[0])
      x1 = Math.max(x1, q[0])
      z0 = Math.min(z0, q[1])
      z1 = Math.max(z1, q[1])
    }
    for (let j = cellOf(z0); j <= cellOf(z1); j++) {
      for (let i = cellOf(x0); i <= cellOf(x1); i++) {
        const key = cellKey(i, j)
        const a = this.polyCells.get(key)
        if (a) a.push(k)
        else this.polyCells.set(key, [k])
      }
    }
  }

  /** Whether segment k keeps its distance from the box (in the box's frame after moving to its centre). */
  apart(k, x, z, c, s, hx, hz, rad) {
    const seg = this.seg
    const o = k * 5
    const r = seg[o + 4]
    const ax = seg[o] - x
    const az = seg[o + 1] - z
    const bx = seg[o + 2] - x
    const bz = seg[o + 3] - z
    // (far enough from the middle that no corner can be near)
    if (pointSeg(0, 0, ax, az, bx - ax, bz - az, (bx - ax) ** 2 + (bz - az) ** 2 || 1e-12) - rad >= r) return true
    return segBox(ax * c + az * s, -ax * s + az * c, bx * c + bz * s, -bx * s + bz * c, hx, hz) >= r
  }

  /** True if the box (centre, axis cos/sin, half sizes) keeps its distance from everything. */
  clear(x, z, c, s, hx, hz) {
    if (!this.seg.length) return true
    if (!this.start) this.freeze()
    const n = this.seg.length / 5
    if (this.seen.length < n) this.seen = new Uint32Array(n + 1024)
    const q = ++this.query
    const seen = this.seen
    const ex = Math.abs(c) * hx + Math.abs(s) * hz
    const ez = Math.abs(s) * hx + Math.abs(c) * hz
    const rad = Math.hypot(hx, hz)
    const { start, list } = this
    const extra = this.cells.size > 0
    for (let j = cellOf(z - ez); j <= cellOf(z + ez); j++) {
      for (let i = cellOf(x - ex); i <= cellOf(x + ex); i++) {
        const cell = cellKey(i, j)
        for (let m = start[cell]; m < start[cell + 1]; m++) {
          const k = list[m]
          if (seen[k] === q) continue
          seen[k] = q
          if (!this.apart(k, x, z, c, s, hx, hz, rad)) return false
        }
        const a = extra && this.cells.get(cell)
        if (a) {
          for (const k of a) {
            if (seen[k] === q) continue
            seen[k] = q
            if (!this.apart(k, x, z, c, s, hx, hz, rad)) return false
          }
        }
        const p = this.polyCells.get(cell)
        if (p) for (const k of p) if (insidePoly(this.polys[k], x, z)) return false
      }
    }
    return true
  }
}

/**
 * Everything drawn on the land that holds water: stream lines, and (given the
 * sites) paddies and their ʻauwai, and fishpond walls (and the hōlua). More
 * can be added after, with addLoi, addPond and addHolua.
 */
export function keepOut(lines, sites = null) {
  const K = new Clear()
  // (the stream lines are smoothed every few metres: every other point will do)
  for (const l of lines) K.line(l.pts, Math.max(ribbonHalf(l.lineA), BED) + MARGIN, 2, 0.01)
  if (sites) {
    for (const c of sites.loi) addLoi(K, c)
    for (const p of sites.ponds) addPond(K, p)
    if (sites.holua) addHolua(K, sites.holua)
  }
  return K.freeze()
}
export function addLoi(K, complex) {
  for (const p of complex.paddies) K.outline(p.poly, 0.009 + MARGIN)
  for (const a of complex.auwai) K.line(a, 0.008 + MARGIN)
}
export function addPond(K, p) {
  K.line(p.wall, 0.05 + MARGIN)
}
/** (not water, but no house stands on the hōlua's causeway either) */
export function addHolua(K, h) {
  K.segment(h.x0, h.z0, h.x1, h.z1, 0.07 + MARGIN)
}

// --- the ground under a footprint ---------------------------------------------------------------

/**
 * Lowest, highest and middle ground (metres, not below the sea) under a
 * footprint, and the lowest true ground (to tell a footprint that reaches the
 * sea). With a lean (metres per unit along u), what it reads is the ground
 * less the lean.
 */
function measure(g, x, z, c, s, u0, u1, v0, v1, out, lean = 0) {
  const nu = Math.max(2, Math.ceil((u1 - u0) / 0.012))
  const nv = Math.max(2, Math.ceil((v1 - v0) / 0.012))
  let lo = Infinity
  let hi = -Infinity
  let wet = Infinity
  const read = (u, v) => {
    const m = g(x + u * c - v * s, z + u * s + v * c)
    if (m < wet) wet = m
    const y = (m > 0 ? m : 0) - lean * u
    if (y < lo) lo = y
    if (y > hi) hi = y
  }
  // (the drawn ground is flat triangles, so its highest and lowest under a
  // footprint lie on the footprint's edge or at a vertex of the mesh inside
  // it: read all round the edge, finely, and every vertex within)
  for (let i = 0; i < nu; i++) {
    const u = u0 + ((u1 - u0) * i) / nu
    read(u, v0)
    read(u1 + u0 - u, v1)
  }
  for (let j = 0; j < nv; j++) {
    const v = v0 + ((v1 - v0) * j) / nv
    read(u1, v)
    read(u0, v1 + v0 - v)
  }
  const cu = (u0 + u1) / 2
  const cv = (v0 + v1) / 2
  const mx = x + cu * c - cv * s
  const mz = z + cu * s + cv * c
  const hu = (u1 - u0) / 2
  const hv = (v1 - v0) / 2
  const ex = Math.abs(c) * hu + Math.abs(s) * hv
  const ez = Math.abs(s) * hu + Math.abs(c) * hv
  for (let j = Math.ceil((mz - ez + HALF) / TEX); j <= Math.floor((mz + ez + HALF) / TEX); j++) {
    for (let i = Math.ceil((mx - ex + HALF) / TEX); i <= Math.floor((mx + ex + HALF) / TEX); i++) {
      const px = -HALF + i * TEX - x
      const pz = -HALF + j * TEX - z
      const u = px * c + pz * s
      const v = -px * s + pz * c
      if (u >= u0 && u <= u1 && v >= v0 && v <= v1) read(u, v)
    }
  }
  out.lo = lo
  out.hi = hi
  out.wet = wet
  out.mid = Math.max(0, g(mx, mz))
  return out
}

/** The steepest the ground falls away (m/m) just outside a footprint, read out to `skirt`. */
function fallAway(g, x, z, c, s, u0, u1, v0, v1, skirt) {
  const cu = (u0 + u1) / 2
  const cv = (v0 + v1) / 2
  const hu = (u1 - u0) / 2
  const hv = (v1 - v0) / 2
  let worst = 0
  for (let k = 0; k < 24; k++) {
    const a = (k / 24) * Math.PI * 2
    const du = Math.cos(a)
    const dv = Math.sin(a)
    const t = Math.min(hu / Math.max(1e-6, Math.abs(du)), hv / Math.max(1e-6, Math.abs(dv)))
    const eu = cu + du * t
    const ev = cv + dv * t
    const su = cu + du * (t + skirt)
    const sv = cv + dv * (t + skirt)
    const e = Math.max(0, g(x + eu * c - ev * s, z + eu * s + ev * c))
    const o = Math.max(0, g(x + su * c - sv * s, z + su * s + sv * c))
    worst = Math.max(worst, (e - o) / (skirt * 100))
  }
  return worst
}

// --- footings ---------------------------------------------------------------------------------

/** Relief (m) between a footprint's corners and middle, less a tilt (m, +u end over the middle): a quick first look. */
function cornerRelief(g, x, z, c, s, hx, hz, tilt = 0) {
  const ux = c * hx
  const uz = s * hx
  const vx = -s * hz
  const vz = c * hz
  const a = Math.max(0, g(x - ux - vx, z - uz - vz)) + tilt
  const b = Math.max(0, g(x + ux - vx, z + uz - vz)) - tilt
  const d = Math.max(0, g(x + ux + vx, z + uz + vz)) - tilt
  const e = Math.max(0, g(x - ux + vx, z - uz + vz)) + tilt
  const m = Math.max(0, g(x, z))
  return Math.max(a, b, d, e, m) - Math.min(a, b, d, e, m)
}

/** The OBB a footing takes up, for spacing buildings apart. */
function obb(x, z, rot, u0, u1, v0, v1) {
  const c = Math.cos(rot)
  const s = Math.sin(rot)
  const cu = (u0 + u1) / 2
  const cv = (v0 + v1) / 2
  return { x: x + cu * c - cv * s, z: z + cu * s + cv * c, c, s, hx: (u1 - u0) / 2, hz: (v1 - v0) / 2 }
}

function overlaps(A, B, gap) {
  const dx = B.x - A.x
  const dz = B.z - A.z
  if (Math.hypot(dx, dz) > Math.hypot(A.hx, A.hz) + Math.hypot(B.hx, B.hz) + gap) return false
  const axes = [A.c, A.s, -A.s, A.c, B.c, B.s, -B.s, B.c]
  for (let k = 0; k < 8; k += 2) {
    const ax = axes[k]
    const az = axes[k + 1]
    const ra = A.hx * Math.abs(A.c * ax + A.s * az) + A.hz * Math.abs(-A.s * ax + A.c * az)
    const rb = B.hx * Math.abs(B.c * ax + B.s * az) + B.hz * Math.abs(-B.s * ax + B.c * az)
    if (Math.abs(dx * ax + dz * az) > ra + rb + gap) return false
  }
  return true
}

/**
 * Places buildings one at a time on the ground `g` (metres), each clear of
 * the water in `K` and of every building placed before it.
 */
export class Placer {
  constructor(g, K) {
    this.g = g
    this.K = K
    this.taken = []
    this.cells = new Map()
    this.seen = []
    this.query = 0
    this.steep = 0
    this.watered = false
    this.G = { lo: 0, hi: 0, mid: 0, wet: 0 }
    this.B = { lo: 0, hi: 0, mid: 0, wet: 0 }
    this.means = [0, 0, 0, 0]
  }

  /** Something already standing, that later buildings keep clear of. */
  block(x, z, rot, hx, hz) {
    this.take({ box: obb(x, z, rot, -hx, hx, -hz, hz) })
  }

  take(f) {
    const b = f.box
    const k = this.taken.length
    this.taken.push(b)
    this.seen.push(0)
    const ex = Math.abs(b.c) * b.hx + Math.abs(b.s) * b.hz
    const ez = Math.abs(b.s) * b.hx + Math.abs(b.c) * b.hz
    for (let j = cellOf(b.z - ez); j <= cellOf(b.z + ez); j++) {
      for (let i = cellOf(b.x - ex); i <= cellOf(b.x + ex); i++) {
        const a = this.cells.get(cellKey(i, j))
        if (a) a.push(k)
        else this.cells.set(cellKey(i, j), [k])
      }
    }
    return f
  }

  /** Clear of everything standing (with a little gap) and of the water. */
  free(b) {
    const q = ++this.query
    const ex = Math.abs(b.c) * b.hx + Math.abs(b.s) * b.hz + 0.02
    const ez = Math.abs(b.s) * b.hx + Math.abs(b.c) * b.hz + 0.02
    for (let j = cellOf(b.z - ez); j <= cellOf(b.z + ez); j++) {
      for (let i = cellOf(b.x - ex); i <= cellOf(b.x + ex); i++) {
        const a = this.cells.get(cellKey(i, j))
        if (!a) continue
        for (const k of a) {
          if (this.seen[k] === q) continue
          this.seen[k] = q
          if (overlaps(this.taken[k], b, 0.02)) return false
        }
      }
    }
    return this.K.clear(b.x, b.z, b.c, b.s, b.hx, b.hz)
  }

  /**
   * A footing for `kind` (see NEEDS) with half sizes hx × hz at (x, z, rot),
   * or null if the ground there won't take it (`opt.force`: one anyway, on
   * whatever ground is there). Kinds: 'house', 'koa' and 'ahu' sit on a block
   * platform; the 'imu' is a pile on the lowest ground under it;
   * 'heiau'/'luakini' step down a slope; 'halau' leans with the beach.
   */
  fit(kind, x, z, rot, hx, hz, opt = {}) {
    if (kind === 'heiau' || kind === 'luakini') return this.heiau(kind, x, z, rot, hx, hz, opt)
    if (kind === 'salt') return this.salt(x, z, rot, opt)
    const need = NEEDS[kind]
    const g = this.g
    const c = Math.cos(rot)
    const s = Math.sin(rot)
    // (the corners first: most places that fail, fail there; a shed follows
    // the beach along its length, the slope its canoes are drawn up)
    const reach = need.reach * 0.94
    let lean = 0
    if (kind === 'halau') {
      const back = Math.max(0, g(x - c * hx, z - s * hx))
      const front = Math.max(0, g(x + c * hx, z + s * hx))
      lean = Math.max(-HALAU_LEAN, Math.min(HALAU_LEAN, ((front - back) * M) / (2 * hx)))
    }
    const tilt = (lean / M) * hx
    const force = !!opt.force
    this.steep = cornerRelief(g, x, z, c, s, hx, hz, tilt) / reach
    if (this.steep > 1 && !force) return null
    const box = obb(x, z, rot, -hx, hx, -hz, hz)
    if (!force && !this.free(box)) return null
    const G = measure(g, x, z, c, s, -hx, hx, -hz, hz, this.G, tilt / hx)
    const lo = G.lo
    const hi = G.hi
    if (!force && (G.wet < need.dry || hi - lo > reach)) return null
    if (!force && need.skirt && fallAway(g, x, z, c, s, -hx, hx, -hz, hz, need.skirt) > BRINK) return null
    let top
    let base
    if (kind === 'house') {
      top = Math.max(G.mid * M + PAEPAE_TOP * S, hi * M + LIP * S)
      base = lo * M - EMBED * S
    } else if (kind === 'ahu') {
      // a cairn on a stone footing, level on top, down to the lowest ground
      top = Math.max(G.mid * M, hi * M + 0.1 * S)
      base = lo * M - EMBED * S
    } else if (kind === 'koa') {
      top = Math.max(G.mid * M + 0.5 * S, hi * M + 0.15 * S)
      base = lo * M - EMBED * S
    } else if (kind === 'halau') {
      // the eaves (0.3 m up) clear the sand everywhere along it
      top = hi * M + 0.05 * S
      base = top - need.reach * M - 0.05 * S
    } else {
      // the imu's low pile of stones settles on the lowest ground under it
      base = lo * M - EMBED * S
      top = lo * M + 0.5 * S
    }
    return { kind, x, z, rot, hx, hz, top, base, lean, relief: hi - lo, wet: G.wet, box }
  }

  /**
   * The nearest place within R of (x0, z0) for a footing forced onto steep
   * ground: built up from the lowest ground under it, it takes up as much
   * as `reach` times its kind's own relief (FORCED: half as much again), but
   * still stands dry, back from any brink, and clear of the water and the
   * other buildings. On the nearest ring with any such place, the one with
   * the least relief; null if there is none.
   */
  forced(kind, x0, z0, rot, hx, hz, R, step = 0.05, reach = FORCED) {
    const need = NEEDS[kind]
    const c = Math.cos(rot)
    const s = Math.sin(rot)
    for (let r = 0; r <= R + 1e-9; r += step) {
      const n = r ? Math.max(8, Math.round((Math.PI * 2 * r) / step)) : 1
      let best = null
      for (let k = 0; k < n; k++) {
        const a = ((k + 0.5) / n) * Math.PI * 2
        const x = x0 + Math.cos(a) * r
        const z = z0 + Math.sin(a) * r
        const f = this.fit(kind, x, z, rot, hx, hz, { force: true })
        if (f.relief > need.reach * reach || (best && f.relief >= best.relief)) continue
        if (f.wet < need.dry || fallAway(this.g, x, z, c, s, -hx, hx, -hz, hz, need.skirt) > BRINK || !this.free(f.box)) continue
        best = f
      }
      if (best) return best
    }
    return null
  }

  /**
   * A heiau: the base tier's top clears the highest ground under it and its
   * walls reach down to the lowest; where that leaves a tall face, the
   * platform is built out in front of it in terraces, each lower by an even
   * share of the drop (but never below the ground under its own tread) and a
   * tread wider, the last standing on the ground. `wall` is the tallest wall
   * left sheer on a side without terraces (its mean height, metres).
   */
  heiau(kind, x, z, rot, hx, hz, opt) {
    const need = NEEDS[kind]
    const g = this.g
    const c = Math.cos(rot)
    const s = Math.sin(rot)
    const reach = need.reach * 0.94
    if (cornerRelief(g, x, z, c, s, hx, hz) > reach) return null
    // (and not at a brink even before it's built out: a heiau stands back from one)
    if (fallAway(g, x, z, c, s, -hx, hx, -hz, hz, need.skirt) > BRINK) return null
    const G = measure(g, x, z, c, s, -hx, hx, -hz, hz, this.G)
    if (G.wet < need.dry || G.hi - G.lo > reach) return null
    const rise = (opt.rise ?? 1.2) * S
    const top = Math.max(G.mid * M + rise, G.hi * M + 0.3 * S)
    // ext: how far each side is built out, −u, +u, −v, +v. The terraces go on
    // the one side the ground falls away from most along its whole length
    // (stepped all round, or round a corner, a platform reads as a pyramid);
    // the others stand on the slope as walls whose height follows it down.
    // (Most along its length, not at its lowest point: that is usually a
    // corner, which two sides share, and the one that barely falls would win
    // as often as the one that really faces downhill.)
    const ext = [0, 0, 0, 0]
    const main = this.downhill(x, z, c, s, hx, hz)
    // (the tallest wall left standing sheer, on the whole, on a side without
    // terraces: a site that leaves less of one is the better)
    const means = this.means
    const wall = top / M - Math.min(...means.filter((_, k) => k !== main))
    const most = top - this.edgeLow(x, z, c, s, hx, hz, ext, main) * M
    const n = Math.min(TERRACES, Math.max(0, Math.round(most / (TERRACE_RISE * S)) - 1))
    const steps = []
    const B = this.B
    let level = top
    for (let k = 0; k < n; k++) {
      // Each terrace's top clears the highest ground under the tread it
      // adds: where the ground rises along the side, the terrace meets it at
      // grade rather than running into the hillside. One that would stand
      // hardly lower than the one above it isn't built.
      const t0 = ext[main]
      const t1 = t0 + TERRACE_TREAD * S
      const u0 = main === 0 ? -hx - t1 : main === 1 ? hx + t0 : -hx
      const u1 = main === 0 ? -hx - t0 : main === 1 ? hx + t1 : hx
      const v0 = main === 2 ? -hz - t1 : main === 3 ? hz + t0 : -hz
      const v1 = main === 2 ? -hz - t0 : main === 3 ? hz + t1 : hz
      measure(g, x, z, c, s, u0, u1, v0, v1, B)
      const want = Math.max(top - (most * (k + 1)) / (n + 1), B.hi * M + TREAD_LIP * S)
      if (want > level - TERRACE_MIN * S) break
      level = want
      ext[main] = t1
      steps.push({ top: level, ext: ext.slice() })
    }
    const u0 = -hx - ext[0]
    const u1 = hx + ext[1]
    const v0 = -hz - ext[2]
    const v1 = hz + ext[3]
    const box = obb(x, z, rot, u0, u1, v0, v1)
    if (!this.free(box)) return null
    const W = steps.length ? measure(g, x, z, c, s, u0, u1, v0, v1, B) : G
    if (W.wet < need.dry) return null
    if (steps.length && fallAway(g, x, z, c, s, u0, u1, v0, v1, need.skirt) > BRINK) return null
    const base = W.lo * M - EMBED * S
    // each block stands down into the next; the last into the ground
    const bottom = steps.length ? steps[0].top - 0.15 * S : base
    for (let k = 0; k < steps.length; k++) steps[k].bottom = k + 1 < steps.length ? steps[k + 1].top - 0.15 * S : base
    return { kind, x, z, rot, hx, hz, top, base, bottom, steps, main, wall, relief: G.hi - G.lo, box }
  }

  /**
   * The side of a footprint (0 −u, 1 +u, 2 −v, 3 +v) whose foot has the
   * lowest ground along it on the whole; `this.means` has each side's mean.
   */
  downhill(x, z, c, s, hx, hz) {
    const g = this.g
    let side = 0
    let lowest = Infinity
    for (let k = 0; k < 4; k++) {
      const along = k < 2
      const off = k === 0 ? -hx : k === 1 ? hx : k === 2 ? -hz : hz
      const half = along ? hz : hx
      const n = Math.max(2, Math.ceil((2 * half) / 0.035))
      let sum = 0
      for (let i = 0; i <= n; i++) {
        const t = -half + (2 * half * i) / n
        const u = along ? off : t
        const v = along ? t : off
        sum += Math.max(0, g(x + u * c - v * s, z + u * s + v * c))
      }
      this.means[k] = sum / (n + 1)
      if (this.means[k] < lowest) {
        lowest = this.means[k]
        side = k
      }
    }
    return side
  }

  /** Lowest ground along the foot of one side of a heiau's current outline (0 −u, 1 +u, 2 −v, 3 +v). */
  edgeLow(x, z, c, s, hx, hz, ext, side) {
    const g = this.g
    const along = side < 2
    const off = side === 0 ? -hx - ext[0] : side === 1 ? hx + ext[1] : side === 2 ? -hz - ext[2] : hz + ext[3]
    const a0 = along ? -hz - ext[2] : -hx - ext[0]
    const a1 = along ? hz + ext[3] : hx + ext[1]
    const n = Math.max(2, Math.ceil((a1 - a0) / 0.035))
    let lo = Infinity
    for (let i = 0; i <= n; i++) {
      const t = a0 + ((a1 - a0) * i) / n
      const u = along ? off : t
      const v = along ? t : off
      lo = Math.min(lo, Math.max(0, g(x + u * c - v * s, z + u * s + v * c)))
    }
    return lo
  }

  /** Salt pans: a grid of clay pans, each set on its own patch of shore. */
  salt(x, z, rot, opt) {
    const g = this.g
    const mid = g(x, z)
    if (mid < NEEDS.salt.dry || mid > 4) return null
    const c = Math.cos(rot)
    const s = Math.sin(rot)
    const box = obb(x, z, rot, -opt.hx, opt.hx, -opt.hz, opt.hz)
    if (!this.free(box)) return null
    const pans = []
    const G = this.G
    for (const [lu, lv] of opt.pans) {
      const px = x + lu * c - lv * s
      const pz = z + lu * s + lv * c
      measure(g, px, pz, c, s, -opt.ph, opt.ph, -opt.pv, opt.pv, G)
      if (G.wet < NEEDS.salt.dry || G.hi - G.lo > NEEDS.salt.reach * 0.94) return null
      pans.push({ x: px, z: pz, top: Math.max(G.mid * M + 0.2 * S, G.hi * M + 0.05 * S), base: G.lo * M - 0.25 * S })
    }
    return { kind: 'salt', x, z, rot, hx: opt.hx, hz: opt.hz, pans, box }
  }

  /**
   * The nearest place within R of (x0, z0) where `kind` fits, trying each of
   * `rots`; rings outward (`opt.step` apart, from `opt.from` out), and on the
   * first ring with any fit, the one with the least relief. `opt.keep(x, z)`
   * can rule places out.
   */
  settle(kind, x0, z0, rots, hx, hz, R, opt = {}) {
    const keep = opt.keep || (() => true)
    for (const rot of rots) {
      if (!keep(x0, z0)) break
      const f = this.fit(kind, x0, z0, rot, hx, hz, opt)
      if (f) return f
    }
    const step = opt.step || Math.max(0.05, Math.min(hx, hz) * 0.8)
    for (let r = (opt.from || 0) + step; r <= R + 1e-9; r += step) {
      const n = Math.max(8, Math.round((Math.PI * 2 * r) / step))
      let best = null
      for (let k = 0; k < n; k++) {
        const a = ((k + 0.5) / n) * Math.PI * 2
        const x = x0 + Math.cos(a) * r
        const z = z0 + Math.sin(a) * r
        if (!keep(x, z)) continue
        this.steep = 0
        for (const rot of rots) {
          const f = this.fit(kind, x, z, rot, hx, hz, opt)
          if (f && (!best || f.relief < best.relief)) best = f
          // (no turn of it will fit ground that steep)
          if (this.steep > 1.6) break
        }
      }
      if (best) return best
    }
    return null
  }
}

/** The half sizes (world units) of the paepae under a hale with walls L × W metres. */
export const paepae = (L, W) => [((L + PAEPAE_RIM) * S) / 2, ((W + PAEPAE_RIM) * S) / 2]

// --- every building, settled ---------------------------------------------------------------------

const hash = (n) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return v - Math.floor(v)
}

/**
 * Generator, once the ground is otherwise finished (after the loʻi are carved
 * and the stream beds cut for the last time): settle every building, moving
 * any whose site fails to the nearest place near it that serves, and writing
 * where each one stands into the sites (with the canoe sheds, the pond
 * keepers' houses, the imu and the puʻuhonua's buildings, which are placed
 * here: `shed`, `keeper`, `imu`, `puuhonua.heiau` and `puuhonua.houses`).
 * `ground` is the Placer placeSites chose the heiau with.
 */
export function settleSites(ground, sites, ahu) {
  return walk(new Placer(ground.g, ground.K), sites, ahu, null)
}

/**
 * Main thread: the footing of every building on the ground as it is drawn
 * (`island.data.height` after the hero falls have cut their headwalls).
 * Each stands where the generator settled it; one the carve has undercut is
 * found new ground nearby, and the move written back into the sites, so that
 * the trees, the people and the tour stops follow it. Returns the footings
 * Features builds from.
 */
export function planFootings(island, lines) {
  const { data, meta } = island
  const g = (x, z) => drawnMetres(data.height, HEIGHT_RES, x, z)
  return walk(new Placer(g, new Clear()), meta.sites, meta.ahu, () => keepOut(lines, meta.sites))
}

/**
 * Every building, in order (the big and the important first): settled from
 * where it was put, or (`water` given) checked where it stands, and only
 * moved if it no longer fits there; `water` makes the keep-out then.
 */
function walk(P, sites, ahu, water) {
  const list = []
  const out = { moved: 0, dropped: 0 }
  const turn = (r) => [r, r + Math.PI / 2]
  const put = (kind, x, z, rots, hx, hz, R, opt) => {
    if (water) {
      const f = P.fit(kind, x, z, rots[0], hx, hz, opt)
      if (f) return f
      if (!P.watered) {
        P.K = water()
        P.watered = true
      }
    }
    const f = P.settle(kind, x, z, rots, hx, hz, R, opt)
    if (f && (Math.abs(f.x - x) > 1e-6 || Math.abs(f.z - z) > 1e-6)) out.moved++
    return f
  }
  const drop = (arr, item) => {
    arr.splice(arr.indexOf(item), 1)
    out.dropped++
  }

  // heiau first, the model's above all (the biggest, and a tour stop)
  const order = [...sites.heiau].sort((a, b) => (b.model ? 1 : 0) - (a.model ? 1 : 0))
  for (const h of order) {
    const big = h.kind === 'luakini'
    const d = big ? HEIAU.big : HEIAU.small
    const [hx, hz] = heiauHalf(big)
    const f = put(big ? 'luakini' : 'heiau', h.x, h.z, [h.rot, h.rot + 0.25, h.rot - 0.25], hx, hz, h.model ? 2.5 : 1.2, { rise: d.rise })
    if (!f) {
      if (h.model) {
        const fb = P.take(fallbackHeiau(P, h, d))
        h.court = fb.top + (d.tiers - 1) * d.rise * S
        list.push(fb)
      } else drop(sites.heiau, h)
      continue
    }
    h.x = f.x
    h.z = f.z
    h.rot = f.rot
    // (the court's floor, world Y, for whoever stands on it)
    h.court = f.top + (d.tiers - 1) * d.rise * S
    list.push(P.take({ ...f, big, dims: d, tag: `${h.kind} a${h.id}${h.model ? ' model' : ''}` }))
  }

  // the puʻuhonua: its heiau and houses stay on the seaward side of the wall
  if (sites.puuhonua) {
    const p = sites.puuhonua
    const dx = Math.cos(p.dir)
    const dz = Math.sin(p.dir)
    const cx = p.x - dx * 1.6
    const cz = p.z - dz * 1.6
    const inside = (m) => (x, z) => (x - cx) * dx + (z - cz) * dz > m
    const d = HEIAU.small
    const [hx, hz] = heiauHalf(false)
    if (p.heiau !== null) {
      const at = p.heiau || { x: p.x - dx * 0.5, z: p.z - dz * 0.5, rot: p.dir }
      const f = put('heiau', at.x, at.z, [at.rot, at.rot + 0.25, at.rot - 0.25], hx, hz, 0.9, { rise: d.rise, keep: inside(0.32) })
      p.heiau = f ? { x: f.x, z: f.z, rot: f.rot, court: f.top + (d.tiers - 1) * d.rise * S } : null
      if (f) list.push(P.take({ ...f, big: false, dims: d, tag: 'puuhonua' }))
    }
    const homes = []
    for (let k = 0; k < 3; k++) {
      if (p.houses && !p.houses[k]) continue
      const [sx, sz] = paepae(6, 4)
      const q = p.houses ? p.houses[k] : { x: cx + dx * 0.5 - dz * (k - 1) * 0.6, z: cz + dz * 0.5 + dx * (k - 1) * 0.6, rot: p.dir + Math.PI / 2 }
      const h = put('house', q.x, q.z, turn(q.rot), sx, sz, 0.5, { keep: inside(0.15) })
      homes.push(h ? { x: h.x, z: h.z, rot: h.rot } : null)
      if (h) list.push(P.take({ ...h, dims: [6, 4, 4.2], tag: 'puuhonua' }))
    }
    p.houses = homes
  }

  // canoe sheds behind their canoes, still opening to the sea
  for (const c of sites.canoes) {
    if (!c.house) continue
    const at = c.shed || { x: c.x - Math.cos(c.dir) * 0.32, z: c.z - Math.sin(c.dir) * 0.32, rot: c.dir }
    const f = put('halau', at.x, at.z, [at.rot, at.rot + 0.3, at.rot - 0.3], 8.2 * S, 3.3 * S, 0.5)
    if (!f) {
      c.house = false
      out.dropped++
      continue
    }
    c.shed = { x: f.x, z: f.z, rot: f.rot }
    list.push(P.take({ ...f, tag: `v${c.village}` }))
  }

  // the pond keeper's house, ashore by the end of the wall nearer the first gate
  for (const p of sites.ponds) {
    if (p.keeper === null) continue
    const end = p.gates[0] < 0.5 ? p.wall[0] : p.wall[p.wall.length - 1]
    const at = p.keeper || { x: end[0] - p.ax * 0.16, z: end[1] - p.az * 0.16, rot: Math.atan2(p.az, p.ax) + Math.PI / 2 }
    const [hx, hz] = paepae(4, 3)
    const f = put('house', at.x, at.z, turn(at.rot), hx, hz, 0.5)
    p.keeper = f ? { x: f.x, z: f.z, rot: f.rot } : null
    if (f) list.push(P.take({ ...f, dims: [4, 3, 3.4], tag: 'pond keeper' }))
  }

  // koʻa (each a tour stop's, perhaps: one that fits nowhere near is built
  // where it is, its base reaching what ground there is)
  for (const k of sites.koa) {
    const rot = k.rot ?? hash(k.x * 3.1 + k.z) * 6.28
    const f = put('koa', k.x, k.z, turn(rot), 1.6 * S, 1.2 * S, 0.8) || put('koa', k.x, k.z, turn(rot), 1.6 * S, 1.2 * S, 1.6, { from: 0.8, step: 0.08 }) || P.fit('koa', k.x, k.z, rot, 1.6 * S, 1.2 * S, { force: true })
    k.x = f.x
    k.z = f.z
    k.rot = f.rot
    list.push(P.take({ ...f, tag: `a${k.id}` }))
  }

  // houses: the chief's first
  const houses = [...sites.houses].sort((a, b) => (b.kind === 'alii' ? 1 : 0) - (a.kind === 'alii' ? 1 : 0))
  const villages = new Map(sites.villages.map((v) => [v.id, v]))
  const homes = new Map()
  const left = []
  const house = (h, near) => {
    const sc = h.scale || 1
    const [L, W, H] = HOUSE[h.kind] || HOUSE.noa
    const [hx, hz] = paepae(L * sc, W * sc)
    // (and if nothing near will take it, somewhere a little further out
    // among the village's other houses, before giving up on it; `near`:
    // never far out past the village's edge)
    const v = near && villages.get(h.village)
    const edge = v ? Math.max(0.9, Math.hypot(h.x - v.x, h.z - v.z)) + 0.3 : Infinity
    const keep = v ? (x, z) => Math.hypot(x - v.x, z - v.z) <= edge : undefined
    const f = put('house', h.x, h.z, turn(h.rot), hx, hz, 0.45, { keep }) || put('house', h.x, h.z, turn(h.rot), hx, hz, 1.1, { from: 0.45, step: 0.08, keep })
    if (!f) return false
    h.x = f.x
    h.z = f.z
    h.rot = f.rot
    homes.set(h.village, (homes.get(h.village) || 0) + 1)
    list.push(P.take({ ...f, dims: [L * sc, W * sc, H * sc], tag: `${h.kind} v${h.village}` }))
    return true
  }
  for (const h of houses) if (!house(h, true)) left.push(h)
  // (a village none of whose houses fits close in keeps one further out
  // rather than none)
  for (const h of left) if ((homes.get(h.village) || 0) > 0 || !house(h, false)) drop(sites.houses, h)

  // ahu where the trail crosses each boundary: an ahu marks the crossing, so
  // it stands right by it. Where the ground there is steep, it is a smaller
  // cairn (`small`); and where even that won't sit, it is built up from the
  // lowest ground on a stone footing, on the best of the ground close by
  // (`forced`). The model ahupuaʻa's own (a tour stop's subject) stays full
  // size on a stone footing first, if one close by and no taller than an
  // ahu's own reach will hold it. Either, once found, stays.
  for (const a of ahu) {
    const rot = a.rot ?? hash(a.x * 3.1 + a.z) * 6.28
    const shown = a.a === sites.model || a.b === sites.model
    let f = null
    if (!a.small && !a.forced) f = put('ahu', a.x, a.z, [rot], AHU, AHU, 0.25, { step: 0.05 })
    if (!f && !a.small && (a.forced || shown)) {
      f = P.forced('ahu', a.x, a.z, rot, AHU, AHU, a.forced ? 0 : 0.25, 0.05, 1)
      if (f) a.forced = true
    }
    if (!f) {
      a.small = true
      const hs = AHU * AHU_SMALL
      if (!a.forced) f = put('ahu', a.x, a.z, [rot], hs, hs, 0.25, { step: 0.05 })
      if (!f) {
        // (as near the crossing as there's any such ground: only where it is
        // steep all round will that be any way off)
        f = P.forced('ahu', a.x, a.z, rot, hs, hs, a.forced ? 0 : 0.8) || P.fit('ahu', a.x, a.z, rot, hs, hs, { force: true })
        a.forced = true
      }
    }
    a.x = f.x
    a.z = f.z
    a.rot = f.rot
    list.push(P.take({ ...f, size: a.small ? AHU_SMALL : 1, forced: !!a.forced, tag: `${a.a}|${a.b}` }))
  }

  // an imu by each village
  for (const v of sites.villages) {
    if (v.imu === null) continue
    const a = hash(v.id + 0.5) * Math.PI * 2
    const at = v.imu || { x: v.x + Math.cos(a) * 0.35, z: v.z + Math.sin(a) * 0.35 }
    const f = put('imu', at.x, at.z, [0], 1.3 * S, 1.3 * S, 0.35)
    v.imu = f ? { x: f.x, z: f.z } : null
    if (f) list.push(P.take({ ...f, tag: `v${v.id}` }))
  }

  // salt pans: four by three, each its own clay basin
  const pans = []
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) pans.push([(i - 1.5) * 0.11, (j - 1) * 0.09])
  const SALT = { pans, ph: 3.3 * S, pv: 2.7 * S, hx: 0.165 + 0.053, hz: 0.09 + 0.043 }
  // (on the open shore, at the edge of a village at most)
  const awayFromHomes = (x, z) => sites.villages.every((v) => Math.hypot(v.x - x, v.z - z) > 0.6)
  for (const sp of [...sites.saltpans]) {
    const f = put('salt', sp.x, sp.z, [sp.dir + Math.PI / 2], SALT.hx, SALT.hz, 6, { ...SALT, keep: awayFromHomes, step: 0.15 })
    if (!f) {
      drop(sites.saltpans, sp)
      continue
    }
    sp.x = f.x
    sp.z = f.z
    list.push(P.take(f))
  }
  return { list, ...out }
}

/** The model heiau has to stand somewhere: if nothing near serves, on its own spot, built up from the lowest ground. */
function fallbackHeiau(P, h, d) {
  const [hx, hz] = heiauHalf(true)
  const c = Math.cos(h.rot)
  const s = Math.sin(h.rot)
  const G = measure(P.g, h.x, h.z, c, s, -hx, hx, -hz, hz, { lo: 0, hi: 0, mid: 0, wet: 0 })
  const top = Math.max(G.mid * M + d.rise * S, G.hi * M + 0.3 * S)
  const base = G.lo * M - EMBED * S
  return { kind: 'luakini', x: h.x, z: h.z, rot: h.rot, hx, hz, top, base, bottom: base, steps: [], relief: G.hi - G.lo, box: obb(h.x, h.z, h.rot, -hx, hx, -hz, hz), big: true, dims: d, tag: 'luakini model' }
}
