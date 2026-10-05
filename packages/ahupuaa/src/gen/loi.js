// Loʻi kalo laid out the way a valley floor holds them: a patchwork of
// roughly square paddies, stepping down the valley in terraces.
//
// The arable ground is the gentle floor near the trunk stream, low enough for
// an ʻauwai to reach and clear of the channel itself. It is cut into terrace
// bands by height — each band a strip between two contours of the floor's
// broad shape, its step chosen so that the terrace is about a paddy deep — and
// each band into paddies by cross-banks laid square to its contours, paced
// off from the stream about as far apart as the terrace is deep (a terrace too
// deep for one paddy is split into rows). So a paddy is four-sided first: its
// up- and down-valley banks follow the contours, its side banks run straight
// down the fall of the land. Only where the land runs out — at the stream
// bank, the valley wall, a bend — is it clipped into a trapezoid or a wedge;
// scraps and strips too small or narrow for a paddy go to their neighbours.
// The outlines are drawn all together, so that two neighbours share the bank
// between them exactly. Every paddy takes its water level from its own
// ground; the ground under them is levelled to their water, never more than a
// few metres of cut or fill, and the channel is left alone so the stream
// keeps its own descending bed through the complex.

import { WORLD, HALF } from '../config.js'
import { sample } from './grid.js'
import { chaikin } from './division.js'

const CELL = 0.05 // fine grid, world units (5 m): paddies are a few cells to a few dozen across
// Terraces are stepped to be about SIDE deep (world units: 32 m) and paced
// into paddies MIN_SIDE to MAX_SIDE wide along them; the banks and the edge
// of the land take their share, so most paddies end up 20–30 m across
const SIDE = 0.32
const MIN_SIDE = 0.24
const MAX_SIDE = 0.42
const BASE = 0.5625 // m: the lowest terrace step, on the flattest floors
const LEVELS = 4 // step sizes: BASE doubled up to three times, to 4.5 m where it steepens
const DEPTH = 0.3 // m of water and mud over the levelled floor
const BANK = 0.014 // the kuāuna between two paddies, world units (1.4 m)
const MIN_AREA = 0.019 // nor is an outline shrunk below 190 m² (150 m² once its bank is taken off)
const MAX_CUT = 3.5 // m: the most ground is ever cut to level a paddy
const MAX_FILL = 1.5 // m: and the most it is ever built up
const FLOAT = 2.5 // m: the deepest water may stand over a hollow in a paddy
const MAX_W = 1.9 // furthest out from the trunk a paddy may lie
// An ʻauwai can water ground lower than the stream a little way upstream,
// where its intake is: from just above the bed here to the bed this far up.
const INTAKE = 4.5
const SLOPE = 0.22 // steepest ground (m/m, smoothed) worth terracing
const MIN_CELLS = 8 // the smallest paddy, in cells (200 m²)
const SLIVER = 10 // a scrap of a column smaller than this (cells) joins a neighbour
const SMALL = 10 // and a paddy that has come out smaller than this is given up
const NARROW = 1.8 // and a strip narrower than this (cells across, on average) is a sliver too
// Outlines: a stretch against open ground is drawn straight to within a
// cell or so
const FREE_TOL = CELL * 1.3
// (and less straight, as need be: see plainer)
const FREE = [FREE_TOL, FREE_TOL / 2, 0]

/** Resample a polyline every `step` world units, carrying arc length. */
function resample(pts, step) {
  const out = []
  let acc = 0
  let s0 = 0
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]
    const b = pts[i]
    const seg = Math.hypot(b[0] - a[0], b[1] - a[1])
    while (acc <= seg) {
      const t = seg > 0 ? acc / seg : 0
      out.push({ x: a[0] + (b[0] - a[0]) * t, z: a[1] + (b[1] - a[1]) * t, s: s0 + acc })
      acc += step
    }
    acc -= seg
    s0 += seg
  }
  return out
}

function smoothLine(pts, passes) {
  let p = pts.map((q) => [q[0], q[1]])
  for (let k = 0; k < passes; k++) {
    const q = p.map((a) => [a[0], a[1]])
    for (let i = 1; i < p.length - 1; i++) {
      q[i][0] = (p[i - 1][0] + 2 * p[i][0] + p[i + 1][0]) / 4
      q[i][1] = (p[i - 1][1] + 2 * p[i][1] + p[i + 1][1]) / 4
    }
    p = q
  }
  return p
}

/** Point-in-polygon (even-odd). */
export function insidePoly(poly, x, z) {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i]
    const b = poly[j]
    if (a[1] > z !== b[1] > z && x < ((b[0] - a[0]) * (z - a[1])) / (b[1] - a[1]) + a[0]) inside = !inside
  }
  return inside
}

/** Area-weighted centroid and area of a simple polygon. */
export function polyCentroid(poly) {
  let a = 0
  let cx = 0
  let cz = 0
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i]
    const q = poly[(i + 1) % poly.length]
    const w = p[0] * q[1] - q[0] * p[1]
    a += w
    cx += (p[0] + q[0]) * w
    cz += (p[1] + q[1]) * w
  }
  if (Math.abs(a) < 1e-12) return { x: poly[0][0], z: poly[0][1], area: 0 }
  return { x: cx / (3 * a), z: cz / (3 * a), area: Math.abs(a) / 2 }
}

/**
 * Lay one valley's loʻi along its trunk stream. `trunk` is the stream's
 * cells from the mouth up ({x, z}); `lines` the drawn streams (to keep out of
 * their channels); `height` the 2048 ground, already with the stream beds cut.
 * Returns the paddies (polygon, water level in metres, planting), the ʻauwai,
 * the ground edits (texel, height, whether it may fill) for carveTerraces,
 * and a lookup for "is this spot terraced".
 *
 * (Each step is its own small function: the generator runs once, cold, and
 * the engine optimises small hot loops far sooner than one long one. For the
 * same reason the loops over cells are indexed: for…of runs at half the
 * speed or worse until then.)
 */
export function layTerraces({ height, N2, trunk, lines, houses, rand, label, id }) {
  const empty = { paddies: [], auwai: [], cut: null, occupied: () => false }
  if (trunk.length < 8) return empty
  const axis = valleyAxis(trunk, height, N2)
  if (!axis) return empty
  const span = extentOf(axis)
  if (!span) return empty
  const [k0, k1] = span
  const G = gridOver(axis, k0, k1)
  const near = nearestAxis(G, axis, k0, k1)
  const chan = channels(G, lines)
  const ground = groundOf(G, height, N2)
  const hs = smoothed(G, ground)
  const slope = slopeNear(G, hs)
  const homes = houses.filter((p) => p.x > G.x0 - 0.2 && p.x < G.x1 + 0.2 && p.z > G.z0 - 0.2 && p.z < G.z1 + 0.2)
  const { mask, cells } = despeck(G, arable(G, { axis, k0, k1, near, chan, slope, hs, ground, homes, label, id }))

  // terrace bands along the floor's broad contours (its shape eased over
  // ~50 m, not every hummock on it: each paddy still takes its level from its
  // own ground), split into paddies by cross-banks square to them
  // (the terraced cells, listed: most of the grid is valley wall)
  G.cells = cells
  G.box = boxAround(G, cells, 16)
  G.span = spansOf(G, cells, 5)
  const lab = cellLabels(G, mask, cells, terraces(G, cells, floorShape(G, hs, cells, axis, near), rand()), axis, near, rand)
  const { comp, pieces } = piecesOf(G, lab.key, lab.band)
  mergeSlivers(G, comp, pieces, pieces.map((_, i) => i), SLIVER)
  cutLong(G, comp, pieces, lab.tau, pieces.map((_, i) => i))
  const win = windowsOf(G, hs, height, N2)
  const live = tidy(G, comp, pieces, settle(G, mask, comp, pieces, win, hs), win, lab.tau)
  const { paddies, owner, minL } = trace(G, pieces, live, axis, near, ground, chan)
  if (paddies.length < 8) return empty
  // which bank of the stream each lies on (for the ʻauwai), and the planting:
  // each paddy at its own stage, a few lying fallow and flooded
  for (const p of paddies) {
    const c = p.cells[p.cells.length >> 1]
    const a = axis[near[c]]
    p.side = (G.x0 + ((c % G.w) + 0.5) * CELL - a.x) * a.nx + (G.z0 + (((c / G.w) | 0) + 0.5) * CELL - a.z) * a.nz > 0 ? 1 : -1
    p.flood = rand() < 0.16 ? 0 : 1
    // (most well grown: kalo stands in the paddy the better part of a year)
    p.age = 1 - (1 - rand()) ** 2
  }
  const cut = carvePlan(G, minL, owner, chan, ground, height, N2)
  const auwai = [1, -1].map((side) => ditch(G, paddies, side, axis, near)).filter(Boolean)

  // downstream first, as the valley is walked
  paddies.sort((a, b) => a.s - b.s)
  for (const p of paddies) {
    const c = polyCentroid(p.poly)
    p.c = [Math.round(c.x * 1000) / 1000, Math.round(c.z * 1000) / 1000]
    delete p.cells
    delete p.s
    delete p.side
  }
  const occupied = (x, z) => {
    const i = Math.floor((x - G.x0) / CELL)
    const j = Math.floor((z - G.z0) / CELL)
    return i >= 0 && j >= 0 && i < G.w && j < G.h && mask[j * G.w + i] === 1
  }
  return { paddies, auwai, cut, occupied }
}

/** The valley's axis (the trunk smoothed, every 10 m) and its stream bed, mouth first. */
function valleyAxis(trunk, height, N2) {
  const axis = resample(smoothLine(trunk.map((p) => [p.x, p.z]), 4), 0.1)
  if (axis.length < 20) return null
  for (let k = 0; k < axis.length; k++) {
    // the bed is the lowest ground across the channel here
    const a = axis[k]
    const b = axis[Math.min(axis.length - 1, k + 1)]
    const p = axis[Math.max(0, k - 1)]
    const tx = b.x - p.x
    const tz = b.z - p.z
    const l = Math.sqrt(tx * tx + tz * tz) || 1
    a.nx = -tz / l
    a.nz = tx / l
    a.raw = Math.min(sample(height, N2, a.x, a.z), sample(height, N2, a.x + a.nx * 0.08, a.z + a.nz * 0.08), sample(height, N2, a.x - a.nx * 0.08, a.z - a.nz * 0.08))
  }
  // never rising downstream: the lowest ground anywhere above
  let run = Infinity
  for (let k = axis.length - 1; k >= 0; k--) axis[k].bed = run = Math.min(run, axis[k].raw)
  return axis
}

/**
 * The stretch of the axis to terrace: past the beach and the village at the
 * mouth, up to the first steep step (above it the water comes down a ramp,
 * not across a floor).
 */
function extentOf(axis) {
  const k0 = axis.findIndex((a) => a.s >= 1.8 && a.bed >= 1.5)
  if (k0 < 0) return null
  let k1 = k0
  while (k1 < axis.length - 1) {
    const a = axis[k1]
    if (a.bed > 300) break
    const ahead = axis[Math.min(axis.length - 1, k1 + 10)]
    if (ahead.bed - a.bed > 24) break
    k1++
  }
  return axis[k1].s - axis[k0].s < 2 ? null : [k0, k1]
}

/** The fine grid over that stretch, out to MAX_W either side. */
function gridOver(axis, k0, k1) {
  let x0 = Infinity
  let z0 = Infinity
  let x1 = -Infinity
  let z1 = -Infinity
  for (let k = k0; k <= k1; k++) {
    x0 = Math.min(x0, axis[k].x)
    z0 = Math.min(z0, axis[k].z)
    x1 = Math.max(x1, axis[k].x)
    z1 = Math.max(z1, axis[k].z)
  }
  x0 = Math.max(-HALF + 0.5, x0 - MAX_W - 0.3)
  z0 = Math.max(-HALF + 0.5, z0 - MAX_W - 0.3)
  x1 = Math.min(HALF - 0.5, x1 + MAX_W + 0.3)
  z1 = Math.min(HALF - 0.5, z1 + MAX_W + 0.3)
  const w = Math.ceil((x1 - x0) / CELL)
  const h = Math.ceil((z1 - z0) / CELL)
  // (nb: the four neighbours of a cell)
  return { x0, z0, x1, z1, w, h, n: w * h, nb: [-1, 1, -w, w] }
}

/**
 * Each cell's nearest axis point within MAX_W, stamped disc by disc (every
 * third point: 30 m along the valley is close enough to read its bed off).
 */
function nearestAxis(G, axis, k0, k1) {
  const { x0, z0, w, h, n } = G
  const near = new Int16Array(n).fill(-1)
  const nd = new Float32Array(n).fill(MAX_W * MAX_W)
  const R = Math.ceil(MAX_W / CELL)
  // (and each row's span of the discs of the stretch itself, k0 to k1: the
  // only cells whose nearest point can lie on it, see G.reach)
  const lo = new Int32Array(h).fill(w)
  const hi = new Int32Array(h).fill(-1)
  for (let k = Math.max(0, k0 - 6); k <= Math.min(axis.length - 1, k1 + 6); k += 3) {
    const a = axis[k]
    const ai = Math.round((a.x - x0) / CELL - 0.5)
    const aj = Math.round((a.z - z0) / CELL - 0.5)
    const jA = Math.max(0, aj - R)
    const jB = Math.min(h - 1, aj + R)
    for (let j = jA; j <= jB; j++) {
      const dz = z0 + (j + 0.5) * CELL - a.z
      const dz2 = dz * dz
      // (the disc's chord along this row)
      const half = Math.sqrt(Math.max(0, MAX_W * MAX_W - dz2)) / CELL
      const iA = Math.max(0, Math.floor(ai - half))
      const iB = Math.min(w - 1, Math.ceil(ai + half))
      if (k >= k0 && k <= k1) {
        if (iA < lo[j]) lo[j] = iA
        if (iB > hi[j]) hi[j] = iB
      }
      let c = j * w + iA
      let dx = x0 + (iA + 0.5) * CELL - a.x
      for (let i = iA; i <= iB; i++, c++, dx += CELL) {
        const d = dx * dx + dz2
        if (d < nd[c]) {
          nd[c] = d
          near[c] = k
        }
      }
    }
  }
  G.reach = { lo, hi }
  return near
}

/** The stream channels (every drawn line, not just the trunk), kept clear. */
function channels(G, lines) {
  const { x0, z0, x1, z1, w, h, n } = G
  const chan = new Uint8Array(n)
  for (const l of lines) {
    const B = lineBox(l)
    if (B[0] > x1 + 0.4 || B[2] < x0 - 0.4 || B[1] > z1 + 0.4 || B[3] < z0 - 0.4) continue
    for (let q = 0; q < l.pts.length; q++) {
      const px = l.pts[q][0]
      const pz = l.pts[q][1]
      if (px < x0 - 0.4 || px > x1 + 0.4 || pz < z0 - 0.4 || pz > z1 + 0.4) continue
      const r = 0.05 + 0.008 * Math.sqrt(l.area[q])
      const ri = Math.ceil(r / CELL)
      const pi = Math.round((px - x0) / CELL - 0.5)
      const pj = Math.round((pz - z0) / CELL - 0.5)
      for (let j = Math.max(0, pj - ri); j <= Math.min(h - 1, pj + ri); j++) {
        const dz = z0 + (j + 0.5) * CELL - pz
        for (let i = Math.max(0, pi - ri); i <= Math.min(w - 1, pi + ri); i++) {
          const dx = x0 + (i + 0.5) * CELL - px
          if (dx * dx + dz * dz <= r * r) chan[j * w + i] = 1
        }
      }
    }
  }
  return chan
}

/** A drawn line's bounding box [x0, z0, x1, z1] (kept: every valley asks of every line). */
function lineBox(l) {
  let B = BOX.get(l)
  if (!B) {
    B = [Infinity, Infinity, -Infinity, -Infinity]
    for (const p of l.pts) {
      if (p[0] < B[0]) B[0] = p[0]
      if (p[1] < B[1]) B[1] = p[1]
      if (p[0] > B[2]) B[2] = p[0]
      if (p[1] > B[3]) B[3] = p[1]
    }
    BOX.set(l, B)
  }
  return B
}
const BOX = new WeakMap()

/**
 * The 2048 texels under the grid, smoothed (`sm`), and the highest of each
 * texel's neighbours (`mx`: a cell under a texel that stands far above it
 * can't be levelled without cutting a trench into the slope).
 */
function groundOf(G, height, N2) {
  const tex = WORLD / N2
  const ti0 = Math.max(1, Math.floor((G.x0 + HALF) / tex) - 2)
  const tj0 = Math.max(1, Math.floor((G.z0 + HALF) / tex) - 2)
  const ti1 = Math.min(N2 - 2, Math.ceil((G.x1 + HALF) / tex) + 2)
  const tj1 = Math.min(N2 - 2, Math.ceil((G.z1 + HALF) / tex) + 2)
  const tw = ti1 - ti0 + 1
  const th = tj1 - tj0 + 1
  const sm = new Float32Array(tw * th)
  const mx = new Float32Array(tw * th)
  for (let j = 0; j < th; j++) {
    for (let i = 0; i < tw; i++) {
      let s = 0
      let hi = -Infinity
      for (let dj = -1; dj <= 1; dj++) {
        for (let di = -1; di <= 1; di++) {
          const v = height[(tj0 + j + dj) * N2 + ti0 + i + di]
          s += v * (di === 0 && dj === 0 ? 4 : di === 0 || dj === 0 ? 2 : 1)
          if (v > hi) hi = v
        }
      }
      sm[j * tw + i] = s / 16
      mx[j * tw + i] = hi
    }
  }
  return { tex, ti0, tj0, tw, th, sm, mx }
}

/** Bilinear read of one of groundOf's arrays at world (x, z). */
function local(gr, arr, x, z) {
  let fx = (x + HALF) / gr.tex - 0.5 - gr.ti0
  let fz = (z + HALF) / gr.tex - 0.5 - gr.tj0
  fx = Math.max(0, Math.min(gr.tw - 1.001, fx))
  fz = Math.max(0, Math.min(gr.th - 1.001, fz))
  const i = fx | 0
  const j = fz | 0
  const ax = fx - i
  const az = fz - j
  const tw = gr.tw
  const k = j * tw + i
  const a = arr[k] + (arr[k + 1] - arr[k]) * ax
  const b = arr[k + tw] + (arr[k + tw + 1] - arr[k + tw]) * ax
  return a + (b - a) * az
}

/** The smoothed ground at every cell (local's bilinear read, its weights worked out once per column and row). */
function smoothed(G, gr) {
  const { w, h } = G
  const hs = new Float32Array(G.n)
  const ci = new Int32Array(w)
  const cx = new Float32Array(w)
  for (let i = 0; i < w; i++) {
    const f = Math.max(0, Math.min(gr.tw - 1.001, (G.x0 + (i + 0.5) * CELL + HALF) / gr.tex - 0.5 - gr.ti0))
    ci[i] = f | 0
    cx[i] = f - (f | 0)
  }
  const sm = gr.sm
  const tw = gr.tw
  for (let j = 0; j < h; j++) {
    const f = Math.max(0, Math.min(gr.th - 1.001, (G.z0 + (j + 0.5) * CELL + HALF) / gr.tex - 0.5 - gr.tj0))
    const row = (f | 0) * tw
    const az = f - (f | 0)
    for (let i = 0; i < w; i++) {
      const k = row + ci[i]
      const ax = cx[i]
      const a = sm[k] + (sm[k + 1] - sm[k]) * ax
      const b = sm[k + tw] + (sm[k + tw + 1] - sm[k + tw]) * ax
      hs[j * w + i] = a + (b - a) * az
    }
  }
  return hs
}

/** Slope (m/m) of a field of heights on the fine grid (or one `step` apart). */
function slopeOf(f, w, h, box = [0, 0, w - 1, h - 1], step = CELL) {
  const out = new Float32Array(w * h)
  for (let j = Math.max(1, box[1]); j <= Math.min(h - 2, box[3]); j++) {
    for (let i = Math.max(1, box[0]); i <= Math.min(w - 2, box[2]); i++) {
      const c = j * w + i
      const gx = f[c + 1] - f[c - 1]
      const gz = f[c + w] - f[c - w]
      out[c] = Math.sqrt(gx * gx + gz * gz) / (2 * step * 100)
    }
  }
  return out
}

function blurred(f, w, h, r, passes, box) {
  for (let pass = 0; pass < passes; pass++) f = boxBlur(f, w, h, r, box)
  return f
}

/** The cells' bounding box [i0, j0, i1, j1], grown by m cells (within the grid). */
function boxAround(G, cells, m) {
  let i0 = G.w
  let j0 = G.h
  let i1 = 0
  let j1 = 0
  for (let q = 0; q < cells.length; q++) {
    const c = cells[q]
    const i = c % G.w
    const j = (c / G.w) | 0
    if (i < i0) i0 = i
    if (i > i1) i1 = i
    if (j < j0) j0 = j
    if (j > j1) j1 = j
  }
  return [Math.max(0, i0 - m), Math.max(0, j0 - m), Math.min(G.w - 1, i1 + m), Math.min(G.h - 1, j1 + m)]
}

/** Cells fit to terrace (see the constants at the top). */
function arable(G, { axis, k0, k1, near, chan, slope, hs, ground, homes, label, id }) {
  const { x0, z0, w, h, n } = G
  const mask = new Uint8Array(n)
  const reach = Math.round(INTAKE * 10)
  // (and the rows and columns they lie in)
  const box = [w, h, -1, -1]
  const { lo, hi } = G.reach
  for (let j = 1; j < h - 1; j++) {
    for (let i = Math.max(1, lo[j]); i <= Math.min(w - 2, hi[j]); i++) {
      const c = j * w + i
      const k = near[c]
      if (k < k0 || k > k1 || chan[c] || slope[c] > SLOPE) continue
      const v = hs[c]
      // low enough for an ʻauwai to reach; and not sunk far below the
      // stream (a marshy hollow a little under it is good taro land)
      if (v < axis[k].bed - 3 || v > axis[Math.min(axis.length - 1, k + reach)].bed - 0.5 || v < 1.2) continue
      const x = x0 + (i + 0.5) * CELL
      const z = z0 + (j + 0.5) * CELL
      if (local(ground, ground.mx, x, z) - v > 5.5) continue
      if (label && label(x, z) !== id) continue
      // (and clear of houses already standing)
      if (homes.some((p) => Math.abs(p.x - x) < 0.16 && Math.abs(p.z - z) < 0.16)) continue
      mask[c] = 1
      if (i < box[0]) box[0] = i
      if (j < box[1]) box[1] = j
      if (i > box[2]) box[2] = i
      if (j > box[3]) box[3] = j
    }
  }
  return { mask, box }
}

/**
 * Drop specks and whiskers: cells with fewer than two terraced neighbours.
 * Returns the mask and its cells, in order.
 */
function despeck(G, { mask, box }) {
  const { w, h } = G
  const cells = []
  for (let pass = 0; pass < 2; pass++) {
    const out = new Uint8Array(w * h)
    for (let j = Math.max(1, box[1]); j <= Math.min(h - 2, box[3]); j++) {
      for (let c = j * w + Math.max(1, box[0]); c <= j * w + Math.min(w - 2, box[2]); c++) {
        if (!mask[c] || mask[c - 1] + mask[c + 1] + mask[c - w] + mask[c + w] < 2) continue
        out[c] = 1
        if (pass) cells.push(c)
      }
    }
    mask = out
  }
  return { mask, cells }
}

/**
 * The slope (m/m) of the smoothed ground, eased over a few cells (a box blur
 * of radius one, twice: [1 2 3 2 1] / 9 each way), wherever it is read:
 * the ground within reach of the stretch being terraced (G.reach).
 */
function slopeNear(G, hs) {
  const { w, h, n } = G
  const { lo, hi } = G.reach
  // the rows' spans grown by two cells every way (the blur's reach)
  const L = new Int32Array(h).fill(w)
  const H = new Int32Array(h).fill(-1)
  for (let j = 0; j < h; j++) {
    if (hi[j] < 0) continue
    for (let d = Math.max(0, j - 2); d <= Math.min(h - 1, j + 2); d++) {
      L[d] = Math.min(L[d], Math.max(1, lo[j] - 2))
      H[d] = Math.max(H[d], Math.min(w - 2, hi[j] + 2))
    }
  }
  const raw = new Float32Array(n)
  for (let j = 1; j < h - 1; j++) {
    for (let c = j * w + L[j]; c <= j * w + H[j]; c++) {
      const gx = hs[c + 1] - hs[c - 1]
      const gz = hs[c + w] - hs[c - w]
      raw[c] = Math.sqrt(gx * gx + gz * gz) / (2 * CELL * 100)
    }
  }
  const tmp = new Float32Array(n)
  for (let j = 0; j < h; j++) {
    for (let i = Math.max(2, L[j]); i <= Math.min(w - 3, H[j]); i++) {
      const c = j * w + i
      tmp[c] = raw[c - 2] + 2 * raw[c - 1] + 3 * raw[c] + 2 * raw[c + 1] + raw[c + 2]
    }
  }
  const out = new Float32Array(n)
  for (let j = 2; j < h - 2; j++) {
    for (let i = Math.max(0, lo[j]); i <= Math.min(w - 1, hi[j]); i++) {
      const c = j * w + i
      out[c] = (tmp[c - 2 * w] + 2 * tmp[c - w] + 3 * tmp[c] + 2 * tmp[c + w] + tmp[c + 2 * w]) / 81
    }
  }
  return out
}

/**
 * Each row's span of the grid within m cells of the terraced cells ({ lo,
 * hi } per row; lo > hi where there is none): the ground the terraces'
 * shape is read on.
 */
function spansOf(G, cells, m) {
  const { w, h } = G
  const lo = new Int32Array(h).fill(w)
  const hi = new Int32Array(h).fill(-1)
  for (let q = 0; q < cells.length; q++) {
    const c = cells[q]
    const i = c % w
    const j = (c / w) | 0
    if (i < lo[j]) lo[j] = i
    if (i > hi[j]) hi[j] = i
  }
  const L = new Int32Array(h).fill(w)
  const H = new Int32Array(h).fill(-1)
  for (let j = 0; j < h; j++) {
    if (hi[j] < 0) continue
    for (let d = Math.max(0, j - m); d <= Math.min(h - 1, j + m); d++) {
      L[d] = Math.min(L[d], Math.max(0, lo[j] - m))
      H[d] = Math.max(H[d], Math.min(w - 1, hi[j] + m))
    }
  }
  return { lo: L, hi: H }
}

/**
 * The terraces: the broad ground cut by its contours into steps of BASE m or
 * twice, four or eight times that. Each terrace starts at the tallest step
 * and is halved while most of it would still be about SIDE deep or more, so
 * a terrace keeps one step all along, the steep valley gets tall narrow steps
 * and the flat floor low wide ones — and as the steps nest, every bank between
 * two terraces is a true contour of the broad ground, whatever their steps.
 * `tau` is the height in BASE steps and `band` each cell's terrace (its
 * step in the low bits, see upOf), set for the terraced cells and the few
 * round them (`zone`, where their level lines are looked for).
 */
function terraces(G, cells, broad, phase) {
  const { w, h, n } = G
  const tau = new Float32Array(n)
  const { lo, hi } = G.span
  for (let j = 0; j < h; j++) for (let c = j * w + lo[j]; c <= j * w + hi[j]; c++) tau[c] = broad[c] / BASE + phase
  const lev = new Uint8Array(n).fill(255)
  const mark = new Int32Array(n)
  const queue = [[cells, LEVELS - 1]]
  let gen = 0
  while (queue.length) {
    const [set, e] = queue.pop()
    gen++
    for (let q = 0; q < set.length; q++) mark[set[q]] = gen
    for (let q = 0; q < set.length; q++) {
      if (mark[set[q]] !== gen) continue
      const part = stepPiece(G, tau, mark, gen, set[q], e)
      if (e > 0 && depthAt(G, part, broad, e, 0.3) > SIDE * 100 * 1.6) queue.push([part, e - 1])
      else for (let k = 0; k < part.length; k++) lev[part[k]] = e
    }
  }
  const zone = spreadSteps(G, lev, cells)
  const band = new Int32Array(n).fill(-(2 ** 30)) // (out of reach: never anyone's terrace)
  for (let u = 0; u < zone.length; u++) {
    const c = zone[u]
    band[c] = Math.floor(tau[c] / (1 << lev[c])) * LEVELS + lev[c]
  }
  return { tau, lev, band, zone }
}

/**
 * The ground just round the terraces (3 cells out) takes the step of the
 * terrace beside it. Returns every cell with a step: the terraces' `zone`.
 */
function spreadSteps(G, lev, cells) {
  const { w, h, nb } = G
  const zone = cells.slice()
  let front = cells
  for (let pass = 0; pass < 3; pass++) {
    const next = []
    for (let q = 0; q < front.length; q++) {
      const c = front[q]
      const i = c % w
      const j = (c / w) | 0
      for (let d = 0; d < 4; d++) {
        if ((d === 0 && i === 0) || (d === 1 && i === w - 1) || (d === 2 && j === 0) || (d === 3 && j === h - 1)) continue
        const o = c + nb[d]
        if (lev[o] !== 255) continue
        lev[o] = lev[c]
        next.push(o)
        zone.push(o)
      }
    }
    front = next
  }
  return zone
}

/** One connected piece of one terrace at doubling e, from c0, among the cells marked `set`. */
function stepPiece(G, tau, mark, set, c0, e) {
  const nb = G.nb
  const s = 1 / (1 << e)
  const k0 = Math.floor(tau[c0] * s)
  const part = [c0]
  mark[c0] = -set
  for (let q = 0; q < part.length; q++) {
    for (let d = 0; d < 4; d++) {
      const c = part[q] + nb[d]
      if (mark[c] === set && Math.floor(tau[c] * s) === k0) {
        mark[c] = -set
        part.push(c)
      }
    }
  }
  return part
}

/** How deep (m) a terrace of doubling e is over the given share of its cells (from the slope of the broad ground). */
function depthAt(G, part, broad, e, share) {
  const w = G.w
  const deep = new Float64Array(part.length)
  for (let k = 0; k < part.length; k++) {
    const c = part[k]
    const slope = Math.hypot(broad[c + 1] - broad[c - 1], broad[c + w] - broad[c - w]) / (2 * CELL * 100)
    deep[k] = ((1 << e) * BASE) / Math.max(1e-4, slope)
  }
  return select(deep, Math.floor(deep.length * share))
}

/** The k-th smallest of the values (which it reorders), by quickselect. */
function select(a, k) {
  let lo = 0
  let hi = a.length - 1
  while (lo < hi) {
    const pivot = a[(lo + hi) >> 1]
    let i = lo
    let j = hi
    while (i <= j) {
      while (a[i] < pivot) i++
      while (a[j] > pivot) j--
      if (i <= j) {
        const t = a[i]
        a[i++] = a[j]
        a[j--] = t
      }
    }
    if (k <= j) hi = j
    else if (k >= i) lo = i
    else break
  }
  return a[k]
}

/**
 * The floor's broad shape, which the terraces follow. On ground steep enough
 * that a paddy must lie along the slope to be levelled at all, that is the
 * ground itself eased over ~50 m. On gentler ground a paddy can be levelled
 * whichever way it lies, and following every swell and hollow of the floor
 * would only wrap the terraces round in rings: there the bands follow the
 * valley's own shape instead — its bed falling down the valley, the floor
 * rising evenly toward either wall — and each paddy still takes its level
 * from its own ground.
 */
function floorShape(G, hs, cells, axis, near) {
  const { w, n, box } = G
  // (worked out at half the grid's resolution, over the box round the
  // terraces: it is eased over ~50 m anyway)
  const [i0, j0, i1, j1] = box
  const hw = ((i1 - i0) >> 1) + 1
  const hh = ((j1 - j0) >> 1) + 1
  const half = new Float32Array(hw * hh)
  for (let J = 0; J < hh; J++) {
    for (let I = 0; I < hw; I++) {
      const i = i0 + 2 * I
      const j = j0 + 2 * J
      const di = i < i1 ? 1 : 0
      const dj = j < j1 ? w : 0
      const c = j * w + i
      half[J * hw + I] = (hs[c] + hs[c + di] + hs[c + dj] + hs[c + di + dj]) / 4
    }
  }
  const eased = blurred(half, hw, hh, 2, 2)
  const slope = slopeOf(eased, hw, hh, undefined, 2 * CELL)
  const trend = blurred(valleyTrend(G, valleyFit(G, hs, cells, axis, near), eased, hw, hh, axis, near), hw, hh, 2, 1)
  for (let k = 0; k < hw * hh; k++) {
    const t = Math.max(0, Math.min(1, (slope[k] - 0.09) / 0.07))
    trend[k] += (eased[k] - trend[k]) * t * t * (3 - 2 * t)
  }
  // and read back where it's wanted (see spansOf)
  const out = new Float32Array(n)
  const { lo, hi } = G.span
  const ci = new Int32Array(i1 - i0 + 1)
  const cx = new Float32Array(i1 - i0 + 1)
  for (let i = i0; i <= i1; i++) {
    const f = Math.min(hw - 1.001, Math.max(0, (i - i0 - 0.5) / 2))
    ci[i - i0] = f | 0
    cx[i - i0] = f - (f | 0)
  }
  for (let j = j0; j <= j1; j++) {
    const fJ = Math.min(hh - 1.001, Math.max(0, (j - j0 - 0.5) / 2))
    const J = fJ | 0
    const az = fJ - J
    for (let i = Math.max(i0, lo[j]); i <= Math.min(i1, hi[j]); i++) {
      const ax = cx[i - i0]
      const k = J * hw + ci[i - i0]
      const a = trend[k] + (trend[k + 1] - trend[k]) * ax
      const b = trend[k + hw] + (trend[k + hw + 1] - trend[k + hw]) * ax
      out[j * w + i] = a + (b - a) * az
    }
  }
  return out
}

/**
 * The valley's own shape about each axis point: h = B + C·|d| across it,
 * each bank its own C, fitted (least squares) over the terraced ground
 * within ~60 m along the valley. Returns [B, C+, C-] per axis point (NaN
 * where there is too little ground to tell).
 */
function valleyFit(G, hs, cells, axis, near) {
  const { x0, z0, w } = G
  const K = axis.length
  // the normal equations' sums for [1, u, v] (u, v: the distance out on
  // either bank) per axis point
  const acc = new Float64Array(K * 8)
  for (let qi = 0; qi < cells.length; qi++) {
    const c = cells[qi]
    if (near[c] < 0) continue
    const a = axis[near[c]]
    const d = (x0 + ((c % w) + 0.5) * CELL - a.x) * a.nx + (z0 + (((c / w) | 0) + 0.5) * CELL - a.z) * a.nz
    const u = d > 0 ? d : 0
    const v = d > 0 ? 0 : -d
    const o = near[c] * 8
    acc[o]++
    acc[o + 1] += u
    acc[o + 2] += v
    acc[o + 3] += u * u
    acc[o + 4] += v * v
    acc[o + 5] += hs[c]
    acc[o + 6] += u * hs[c]
    acc[o + 7] += v * hs[c]
  }
  const fit = new Float64Array(K * 3).fill(NaN)
  // (the sums over the window k - 6 to k + 6, slid along)
  const S = new Float64Array(8)
  for (let q = 0; q <= Math.min(K - 1, 5); q++) for (let e = 0; e < 8; e++) S[e] += acc[q * 8 + e]
  for (let k = 0; k < K; k++) {
    if (k + 6 < K) for (let e = 0; e < 8; e++) S[e] += acc[(k + 6) * 8 + e]
    if (k - 7 >= 0) for (let e = 0; e < 8; e++) S[e] -= acc[(k - 7) * 8 + e]
    if (S[0] < 12) continue
    // solve [[n, Σu, Σv], [Σu, Σuu, 0], [Σv, 0, Σvv]] · [B, C+, C-] = [Σh, Σuh, Σvh]
    const pu = S[3] + 1e-6
    const pv = S[4] + 1e-6
    const B = (S[5] - (S[1] * S[6]) / pu - (S[2] * S[7]) / pv) / (S[0] - (S[1] * S[1]) / pu - (S[2] * S[2]) / pv)
    // (a floor rises toward its walls: never a trough, never a cliff)
    fit[k * 3] = B
    fit[k * 3 + 1] = Math.max(0, Math.min(30, (S[6] - S[1] * B) / pu))
    fit[k * 3 + 2] = Math.max(0, Math.min(30, (S[7] - S[2] * B) / pv))
  }
  return fit
}

/**
 * The fitted valley shape at every cell of floorShape's half-resolution grid
 * (the eased ground where there's no fit).
 */
function valleyTrend(G, fit, eased, hw, hh, axis, near) {
  const { x0, z0, w, box } = G
  const trend = new Float32Array(hw * hh)
  for (let J = 0; J < hh; J++) {
    for (let I = 0; I < hw; I++) {
      const i = box[0] + 2 * I
      const j = box[1] + 2 * J
      const k = near[j * w + i]
      const o = J * hw + I
      if (k < 0 || Number.isNaN(fit[k * 3])) {
        trend[o] = eased[o]
        continue
      }
      const a = axis[k]
      const d = (x0 + (i + 1) * CELL - a.x) * a.nx + (z0 + (j + 1) * CELL - a.z) * a.nz
      trend[o] = fit[k * 3] + (d > 0 ? fit[k * 3 + 1] * d : -fit[k * 3 + 2] * d)
    }
  }
  return trend
}

/**
 * Level lines of the terraces of one doubling `e`, at the levels asked for
 * (`levels`: sorted values of tau / 2^e, each a terrace's key plus a fraction
 * of the way up it), through the cells of that doubling (`box`: the
 * terraces and the ground just round them): by marching squares over the
 * cell centres, chained into polylines that carry their arc length, their
 * terrace's band key and the eighth `q` of the way up it they run at. Each
 * is measured from where it crosses the stream (or comes nearest it), so a
 * terrace's paddies can be laid out from the channel outward on either bank.
 */
function contours(G, tau, e, levels, box) {
  const np = march(G, tau, e, levels, squaresOf(G, box))
  return chainLines(np, levels, e)
}

/** The squares with a corner on the given cells, each by its top-left cell, in order. */
function squaresOf(G, box) {
  const { w, h } = G
  if (SEEN.length < w * h) SEEN = new Int32Array(w * h)
  const seen = SEEN
  const gen = ++SEEN_GEN
  const sq = new Int32Array(4 * box.length)
  let ns = 0
  const last = w * (h - 1)
  for (let q = 0; q < box.length; q++) {
    // (the four squares the cell is a corner of, those on the grid)
    const z = box[q]
    const i = z % w
    if (i <= w - 2) {
      if (z < last && seen[z] !== gen) {
        seen[z] = gen
        sq[ns++] = z
      }
      if (z >= w && seen[z - w] !== gen) {
        seen[z - w] = gen
        sq[ns++] = z - w
      }
    }
    if (i >= 1) {
      if (z - 1 < last && seen[z - 1] !== gen) {
        seen[z - 1] = gen
        sq[ns++] = z - 1
      }
      if (z >= w && seen[z - w - 1] !== gen) {
        seen[z - w - 1] = gen
        sq[ns++] = z - w - 1
      }
    }
  }
  return sq.subarray(0, ns).sort()
}

/**
 * Marching squares (see contours) over the squares given: the nodes, into
 * the scratch arrays NX…NB. Returns how many.
 */
function march(G, tau, e, levels, order) {
  const { x0, z0, w } = G
  const nl = levels.length
  const ns = order.length
  const scale = 1 / (1 << e)
  // each crossing of a level over a cell edge is a node; an edge's nodes
  // are made together (the levels crossing it, in order: `eb` the first
  // node, `el` its level), the first time a square asks for one of them.
  // Squares go row by row, so the square beside one finds the nodes on the
  // edge they share in `vb`/`vl` (the right edge of the square before), and
  // the square below in `hb`/`hl` (each column's bottom edge in the row
  // above, `hr` the row it was made for). Nodes link in pairs within a
  // square, and chain into lines.
  let np = 0
  const ids = [0, 0, 0, 0]
  const cs = [0, 0, 0, 0]
  const vs = [0, 0, 0, 0]
  const eb = [0, 0, 0, 0]
  const el = [0, 0, 0, 0]
  const hb = new Int32Array(w)
  const hl = new Int32Array(w)
  const hr = new Int32Array(w).fill(-1)
  let vb = 0
  let vl = 0
  let vr = -1
  for (let s = 0; s < ns; s++) {
    const c = order[s]
    const v0 = tau[c] * scale
    const v1 = tau[c + 1] * scale
    const v2 = tau[c + w + 1] * scale
    const v3 = tau[c + w] * scale
    const lo = Math.min(v0, v1, v2, v3)
    const hi = Math.max(v0, v1, v2, v3)
    // (every level is a whole number of eighths: most squares lie within one)
    if (Math.floor(lo * 8) === Math.floor(hi * 8)) continue
    // corners in order round the square (the edges run from each to the
    // next: top, right, bottom, left), and the nodes already on its edges
    const i = c % w
    const j = (c / w) | 0
    cs[0] = c
    cs[1] = c + 1
    cs[2] = c + w + 1
    cs[3] = c + w
    vs[0] = v0
    vs[1] = v1
    vs[2] = v2
    vs[3] = v3
    eb[0] = hr[i] === j ? hb[i] : -1
    el[0] = hl[i]
    eb[1] = -1
    eb[2] = -1
    eb[3] = vr === c ? vb : -1
    el[3] = vl
    for (let li = rank(levels, lo); li < nl && levels[li] < hi; li++) {
      const L = levels[li]
      let m = 0
      for (let k = 0; k < 4; k++) {
        const vp = vs[k]
        const vq = vs[(k + 1) & 3]
        if (vp >= L === vq >= L) continue
        if (eb[k] < 0) {
          const l0 = rank(levels, Math.min(vp, vq))
          eb[k] = np
          el[k] = l0
          if (k === 1) {
            vb = np
            vl = l0
            vr = c + 1
          } else if (k === 2) {
            hb[i] = np
            hl[i] = l0
            hr[i] = j + 1
          }
          const p = cs[k]
          const q = cs[(k + 1) & 3]
          const ax = x0 + ((p % w) + 0.5) * CELL
          const az = z0 + (((p / w) | 0) + 0.5) * CELL
          const bx = x0 + ((q % w) + 0.5) * CELL
          const bz = z0 + (((q / w) | 0) + 0.5) * CELL
          for (let l = l0; l < nl && levels[l] <= Math.max(vp, vq); l++) {
            if (np >= NX.length) growNodes()
            const t = (levels[l] - vp) / (vq - vp)
            NX[np] = ax + (bx - ax) * t
            NZ[np] = az + (bz - az) * t
            NL[np] = l
            NA[np] = -1
            NB[np] = -1
            np++
          }
        }
        ids[m++] = eb[k] + li - el[k]
      }
      if (m >= 2) link(NA, NB, ids[0], ids[1])
      if (m === 4) link(NA, NB, ids[2], ids[3])
    }
  }
  return np
}

/** The first np nodes chained into level lines: open lines from their ends first, then the closed loops. */
function chainLines(np, levels, e) {
  const used = new Uint8Array(np)
  const lines = []
  for (let pass = 0; pass < 2; pass++) {
    for (let id = 0; id < np; id++) {
      if (used[id] || (pass === 0 && NB[id] >= 0)) continue
      const chain = walkChain(NA, NB, used, id)
      if (chain.length >= 3) lines.push(polyline(chain, NX, NZ, levels[NL[id]], e))
    }
  }
  return lines
}

// (contours' scratch, kept from one call to the next: squares seen, and
// the nodes)
let SEEN = new Int32Array(0)
let SEEN_GEN = 0
let NX = new Float64Array(4096)
let NZ = new Float64Array(4096)
let NL = new Int32Array(4096)
let NA = new Int32Array(4096)
let NB = new Int32Array(4096)

function growNodes() {
  const grow = (a, A) => {
    const b = new A(a.length * 2)
    b.set(a)
    return b
  }
  NX = grow(NX, Float64Array)
  NZ = grow(NZ, Float64Array)
  NL = grow(NL, Int32Array)
  NA = grow(NA, Int32Array)
  NB = grow(NB, Int32Array)
}

/** Link two contour nodes (each has at most two neighbours). */
function link(nbA, nbB, a, b) {
  if (nbA[a] < 0) nbA[a] = b
  else nbB[a] = b
  if (nbA[b] < 0) nbA[b] = a
  else nbB[b] = a
}

/** The chain of contour nodes from `start`, marking them used. */
function walkChain(nbA, nbB, used, start) {
  const chain = [start]
  used[start] = 1
  let k = start
  for (;;) {
    const a = nbA[k]
    const b = nbB[k]
    const nx = a >= 0 && !used[a] ? a : b >= 0 && !used[b] ? b : -1
    if (nx < 0) break
    used[nx] = 1
    chain.push(nx)
    k = nx
  }
  return chain
}

/** A chain of contour nodes as a level line (see contours). */
function polyline(chain, px, pz, L, e) {
  const m = chain.length
  const xs = new Float64Array(m)
  const zs = new Float64Array(m)
  const s = new Float64Array(m)
  for (let q = 0; q < m; q++) {
    xs[q] = px[chain[q]]
    zs[q] = pz[chain[q]]
    if (q) s[q] = s[q - 1] + Math.hypot(xs[q] - xs[q - 1], zs[q] - zs[q - 1])
  }
  const kb = Math.floor(L)
  // (o, where it crosses the stream, worked out for the lines a piece is laid out along: see alongLines)
  return { b: kb * LEVELS + e, q: Math.round((L - kb) * 8), xs, zs, s, o: NaN }
}

/** Arc length along a level line where it crosses the stream, or comes nearest it. */
function origin(G, xs, zs, s, axis, near) {
  const { x0, z0, w, h } = G
  let best = -1
  let bd = Infinity
  let pd = NaN
  let ps = 0
  const cross = []
  for (let q = 0; q < xs.length; q++) {
    const i = Math.floor((xs[q] - x0) / CELL)
    const j = Math.floor((zs[q] - z0) / CELL)
    const k = i >= 0 && j >= 0 && i < w && j < h ? near[j * w + i] : -1
    if (k < 0) {
      pd = NaN
      continue
    }
    const a = axis[k]
    const d = (xs[q] - a.x) * a.nx + (zs[q] - a.z) * a.nz
    if (Math.abs(d) < bd) {
      bd = Math.abs(d)
      best = s[q]
    }
    if (pd * d < 0) cross.push(ps + ((s[q] - ps) * pd) / (pd - d))
    pd = d
    ps = s[q]
  }
  if (cross.length) return cross[cross.length >> 1]
  return best >= 0 ? best : s[s.length >> 1]
}

/** How many of the sorted values are at most v. */
function rank(sorted, v) {
  let lo = 0
  let hi = sorted.length
  while (lo < hi) {
    const m = (lo + hi) >> 1
    if (sorted[m] <= v) lo = m + 1
    else hi = m
  }
  return lo
}

/**
 * Lay out the paddies: every terraced cell's band, the column it falls in
 * along its terrace and the row within a deep terrace. Each piece of a
 * terrace is laid out along one of its level lines (so the line between two
 * columns is that line's normal there, square to the contours), and along
 * each bank of the stream the columns are paced off from the channel outward,
 * about as wide as the land in that stretch is deep: a terrace too deep for
 * one paddy is split into rows along its contours.
 */
function cellLabels(G, mask, cells, T, axis, near, rand) {
  const { piece, ref } = terracePieces(G, mask, cells, T)
  const lines = levelLines(G, T, ref)
  const { sl, sv } = nearestOnLines(G, piece, ref, lines)
  const t = alongLines(G, cells, lines, sl, sv, axis, near)
  const { cols, first } = paceColumns(sides(cells, sl, t), rand)
  const key = assignColumns(G, cells, T, cols, first, sl, t)
  return { tau: T.tau, band: T.band, key }
}

/** Where cell c sits up its terrace, 0 at the foot to 1 at the top. */
function upOf(T, c) {
  const b = T.band[c]
  return T.tau[c] / (1 << (b & (LEVELS - 1))) - Math.floor(b / LEVELS)
}

/**
 * The connected pieces of each terrace, and the level line each is laid out
 * along: the one through the middle of the piece (`q` eighths up its
 * terrace), which for a whole terrace is its midline and for a scrap of one
 * (a strip along the channel, say) runs through that scrap rather than
 * somewhere off beyond it.
 */
function terracePieces(G, mask, cells, T) {
  const { n, nb } = G
  const band = T.band
  const piece = new Int32Array(n).fill(-1)
  const ref = []
  const part = []
  for (const c0 of cells) {
    if (piece[c0] >= 0) continue
    const id = ref.length
    part.length = 0
    part.push(c0)
    piece[c0] = id
    for (let q = 0; q < part.length; q++) {
      for (let d = 0; d < 4; d++) {
        const c = part[q] + nb[d]
        if (mask[c] && piece[c] < 0 && band[c] === band[c0]) {
          piece[c] = id
          part.push(c)
        }
      }
    }
    const f = new Float64Array(part.length)
    for (let q = 0; q < part.length; q++) f[q] = upOf(T, part[q])
    f.sort()
    ref.push({ band: band[c0], q: Math.max(1, Math.min(7, Math.round(f[f.length >> 1] * 8))), n: part.length })
  }
  return { piece, ref }
}

/** Every level line the pieces asked for, through their terraces and the ground just round them. */
function levelLines(G, T, ref) {
  // (the ground of each step, so each is only looked for where it is: the
  // zone's cells sorted by their step, in order within each)
  const { zone, lev } = T
  const at = new Int32Array(LEVELS + 1)
  for (let q = 0; q < zone.length; q++) at[lev[zone[q]] + 1]++
  for (let e = 0; e < LEVELS; e++) at[e + 1] += at[e]
  const by = new Int32Array(zone.length)
  const fill = at.slice(0, LEVELS)
  for (let q = 0; q < zone.length; q++) by[fill[lev[zone[q]]]++] = zone[q]
  const lines = []
  for (let e = 0; e < LEVELS; e++) {
    // (a scrap too small to be a paddy goes to a neighbour anyway: it needs no line)
    const want = new Set()
    for (const r of ref) if ((r.band & (LEVELS - 1)) === e && r.n >= SLIVER) want.add(Math.floor(r.band / LEVELS) + r.q / 8)
    if (!want.size) continue
    for (const ln of contours(G, T.tau, e, Float64Array.from(want).sort(), by.subarray(at[e], at[e + 1]))) lines.push(ln)
  }
  return lines
}

/**
 * Each terraced cell's nearest vertex on its piece's line (`sl` the line,
 * `sv` the vertex), carried cell to cell through the piece from the cells
 * the line passes through.
 */
function nearestOnLines(G, piece, ref, lines) {
  const { x0, z0, w, h, n } = G
  const sl = new Int32Array(n).fill(-1)
  const sv = new Int32Array(n)
  const sd = new Float64Array(n).fill(Infinity)
  const queue = []
  // (whether a cell waits in the queue: one offered a nearer vertex while it
  // waits needn't wait twice, it passes on its nearest when its turn comes)
  const waits = new Uint8Array(n)
  for (let L = 0; L < lines.length; L++) {
    const ln = lines[L]
    for (let v = 0; v < ln.xs.length; v++) {
      const i = Math.floor((ln.xs[v] - x0) / CELL)
      const j = Math.floor((ln.zs[v] - z0) / CELL)
      if (i < 0 || j < 0 || i >= w || j >= h) continue
      const c = j * w + i
      if (piece[c] < 0) continue
      const r = ref[piece[c]]
      if (r.band === ln.b && r.q === ln.q && offer(G, lines, sl, sv, sd, c, L, v) && !waits[c]) {
        waits[c] = 1
        queue.push(c)
      }
    }
  }
  // (offer, worked into the walk: each cell offers its neighbours its own vertex)
  const ring = [-1, 1, -w, w, -1 - w, 1 - w, w - 1, w + 1]
  const rx = [-CELL, CELL, 0, 0, -CELL, CELL, -CELL, CELL]
  const rz = [0, 0, -CELL, CELL, -CELL, -CELL, CELL, CELL]
  for (let qi = 0; qi < queue.length; qi++) {
    const c = queue[qi]
    waits[c] = 0
    const L = sl[c]
    const v0 = sv[c]
    const pc = piece[c]
    const { xs, zs } = lines[L]
    const m = xs.length
    const cx = x0 + ((c % w) + 0.5) * CELL
    const cz = z0 + (((c / w) | 0) + 0.5) * CELL
    for (let k = 0; k < 8; k++) {
      const d = c + ring[k]
      if (piece[d] !== pc) continue
      const x = cx + rx[k]
      const z = cz + rz[k]
      let v = v0
      let dd = (xs[v] - x) * (xs[v] - x) + (zs[v] - z) * (zs[v] - z)
      for (let dir = -1; dir <= 1; dir += 2) {
        while (v + dir >= 0 && v + dir < m) {
          const dx = xs[v + dir] - x
          const dz = zs[v + dir] - z
          const e = dx * dx + dz * dz
          if (e >= dd) break
          dd = e
          v += dir
        }
      }
      if (dd >= sd[d] - 1e-12) continue
      sd[d] = dd
      sl[d] = L
      sv[d] = v
      if (waits[d]) continue
      waits[d] = 1
      queue.push(d)
    }
  }
  return { sl, sv }
}

/**
 * Offer cell c vertex v of line L (sliding along the line while that comes
 * nearer); true if it is nearer than what the cell had.
 */
function offer(G, lines, sl, sv, sd, c, L, v) {
  const ln = lines[L]
  const x = G.x0 + ((c % G.w) + 0.5) * CELL
  const z = G.z0 + (((c / G.w) | 0) + 0.5) * CELL
  const xs = ln.xs
  const zs = ln.zs
  let d = (xs[v] - x) * (xs[v] - x) + (zs[v] - z) * (zs[v] - z)
  for (let dir = -1; dir <= 1; dir += 2) {
    while (v + dir >= 0 && v + dir < xs.length) {
      const dx = xs[v + dir] - x
      const dz = zs[v + dir] - z
      const e = dx * dx + dz * dz
      if (e >= d) break
      d = e
      v += dir
    }
  }
  if (d >= sd[c] - 1e-12) return false
  sd[c] = d
  sl[c] = L
  sv[c] = v
  return true
}

/**
 * Each terraced cell's place along its line, signed from where the line
 * crosses the stream (and past either end of the line, along its last
 * stretch).
 */
function alongLines(G, cells, lines, sl, sv, axis, near) {
  const { x0, z0, w, n } = G
  const t = new Float32Array(n)
  for (let q = 0; q < cells.length; q++) {
    const c = cells[q]
    if (sl[c] < 0) continue
    const ln = lines[sl[c]]
    const v = sv[c]
    const x = x0 + ((c % w) + 0.5) * CELL
    const z = z0 + (((c / w) | 0) + 0.5) * CELL
    let best = ln.s[v]
    let bd = Infinity
    const end = v === 0 || v === ln.xs.length - 1
    for (let u = v - 1; u <= v + 1; u += 2) {
      if (u < 0 || u >= ln.xs.length) continue
      const ax = ln.xs[v]
      const az = ln.zs[v]
      const dx = ln.xs[u] - ax
      const dz = ln.zs[u] - az
      const l2 = dx * dx + dz * dz || 1e-12
      const raw = ((x - ax) * dx + (z - az) * dz) / l2
      const f = Math.min(1, end ? raw : Math.max(0, raw))
      const ex = ax + dx * f - x
      const ez = az + dz * f - z
      if (ex * ex + ez * ez < bd) {
        bd = ex * ex + ez * ez
        best = ln.s[v] + (ln.s[u] - ln.s[v]) * f
      }
    }
    if (Number.isNaN(ln.o)) ln.o = origin(G, ln.xs, ln.zs, ln.s, axis, near)
    t[c] = best - ln.o
  }
  return t
}

/** The cells' distances along each bank of each line (key: line × 2 + bank), sorted. */
function sides(cells, sl, t) {
  const by = new Map()
  for (let q = 0; q < cells.length; q++) {
    const c = cells[q]
    if (sl[c] < 0) continue
    const key = sl[c] * 2 + (t[c] >= 0 ? 0 : 1)
    const list = by.get(key)
    if (list) list.push(Math.abs(t[c]))
    else by.set(key, [Math.abs(t[c])])
  }
  for (const [key, us] of by) by.set(key, Float64Array.from(us).sort())
  return by
}

/**
 * Pace the columns off each bank of each line, from the edge of the land by
 * the stream outward: each a little wider than the land there is deep (or a
 * row of it is), give or take, and never a sliver left at the far end.
 */
function paceColumns(bySide, rand) {
  const cols = []
  // (each side's first column and one past its last, by key)
  const first = new Map()
  const R = 0.1
  for (const [key, us] of bySide) {
    const end = us[us.length - 1] + CELL / 2
    let u = Math.max(0, us[0] - CELL / 2)
    const k0 = cols.length
    for (;;) {
      // how deep the land is about here: its cells within R along the line
      const at = u + SIDE / 2
      const d = ((rank(us, at + R) - rank(us, at - R)) * CELL * CELL) / (2 * R)
      const rows = d > SIDE * 1.5 ? Math.round(d / SIDE) : 1
      let next = u + Math.min(MAX_SIDE, Math.max(MIN_SIDE, (d / rows) * 1.2)) * (1 + (rand() - 0.5) * 0.25)
      if (end - next < MIN_SIDE * 0.5) next = Math.max(next, end + CELL)
      cols.push({ line: key >> 1, side: key & 1 ? -1 : 1, lo: u, hi: next, rows: 1, f0: Infinity, f1: -Infinity, n: 0 })
      u = next
      if (u >= end) break
    }
    first.set(key, [k0, cols.length])
  }
  return { cols, first }
}

/**
 * Each terraced cell's column, row and paddy key. A column whose land is
 * deep for its width is split into rows, along the contours, over the part
 * of the terrace it actually covers; a cell no line reached keys by its
 * terrace alone.
 */
function assignColumns(G, cells, T, cols, first, sl, t) {
  const n = G.n
  const col = new Int32Array(n).fill(-1)
  for (let qi = 0; qi < cells.length; qi++) {
    const c = cells[qi]
    if (sl[c] < 0) continue
    const u = Math.abs(t[c])
    // (the side's first column that ends past u, or its last)
    const run = first.get(sl[c] * 2 + (t[c] >= 0 ? 0 : 1))
    let lo = run[0]
    let hi = run[1] - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (cols[mid].hi <= u) lo = mid + 1
      else hi = mid
    }
    const k = lo
    col[c] = k
    const f = upOf(T, c)
    const C = cols[k]
    if (f < C.f0) C.f0 = f
    if (f > C.f1) C.f1 = f
    C.n++
  }
  for (const C of cols) {
    const depth = (C.n * CELL * CELL) / Math.max(CELL, C.hi - C.lo)
    if (depth > SIDE * 1.5) C.rows = Math.min(8, Math.round(depth / SIDE))
  }
  const row = new Int32Array(n)
  const key = new Int32Array(n).fill(-1)
  for (let q = 0; q < cells.length; q++) {
    const c = cells[q]
    if (col[c] < 0) {
      key[c] = (1 << 30) + (T.band[c] & 0xfffff)
      continue
    }
    const C = cols[col[c]]
    if (C.rows > 1) row[c] = Math.min(C.rows - 1, Math.floor(((upOf(T, c) - C.f0) / Math.max(1e-6, C.f1 - C.f0)) * C.rows))
    key[c] = col[c] * 8 + row[c]
  }
  return key
}

/** Connected pieces of one terrace, column and row: the paddies-to-be. */
function piecesOf(G, key, band) {
  const { n, nb } = G
  const comp = new Int32Array(n).fill(-1)
  const pieces = []
  const stack = []
  // (key is set on the terraced cells only)
  for (const c0 of G.cells) {
    if (key[c0] < 0 || comp[c0] >= 0) continue
    const id = pieces.length
    const cells = []
    comp[c0] = id
    stack.push(c0)
    while (stack.length) {
      const c = stack.pop()
      cells.push(c)
      for (let e = 0; e < 4; e++) {
        const d = c + nb[e]
        if (comp[d] < 0 && key[d] === key[c0]) {
          comp[d] = id
          stack.push(d)
        }
      }
    }
    pieces.push({ cells, band: band[c0], level: 0 })
  }
  return { comp, pieces }
}

/**
 * Slivers — the scraps and narrow strips a column leaves against the edge of
 * the land — go to their neighbours, smallest first so that no paddy grows
 * by a chain of them (see absorb).
 */
function mergeSlivers(G, comp, pieces, ids, small, fit) {
  const order = ids.filter((i) => pieces[i].cells.length && sliver(G, pieces[i].cells, small))
  order.sort((a, b) => pieces[a].cells.length - pieces[b].cells.length)
  const weak = new Set(order)
  for (const me of order) {
    if (pieces[me].cells.length && sliver(G, pieces[me].cells, small)) absorb(G, comp, pieces, me, weak, fit)
    weak.delete(me)
  }
}

/**
 * Give up a sliver. A narrow strip is shared out among the pieces beside
 * it, each cell to the one it touches, so that a strip along a row of
 * paddies lengthens each of them, square, rather than one into an L. A
 * small scrap joins the neighbour it shares most bank with (one on its own
 * terrace if it's close: the level stays truer) — or, once the paddies have
 * their levels (`fit`: whether a cell suits a paddy's water), only one it
 * makes a square paddy with, and is left as banks if there is none.
 */
function absorb(G, comp, pieces, me, weak, fit) {
  const p = pieces[me]
  if (narrow(G, p.cells)) return handOut(G, comp, pieces, me, weak, fit)
  let best = -1
  let bs = 0
  for (const [q, t] of touching(G, comp, pieces, p.cells, me)) {
    const ok = !fit || (!weak.has(q) && hullFill(together(pieces[q].cells, p.cells), G.w) >= 0.88)
    const score = t * (pieces[q].band === p.band ? 1.5 : 1) * (weak.has(q) ? 0.3 : 1)
    if (ok && score > bs) {
      bs = score
      best = q
    }
  }
  for (let k = 0; k < p.cells.length; k++) {
    const c = p.cells[k]
    if (best < 0 || (fit && !fit(c, best))) comp[c] = -1
    else {
      comp[c] = best
      pieces[best].cells.push(c)
    }
  }
  p.cells = []
}

/** Two lists of cells as one, in index order (in scratch: read it straight away). */
function together(a, b) {
  const m = a.length + b.length
  if (TOG.length < m) TOG = new Int32Array(2 * m)
  TOG.set(a)
  TOG.set(b, a.length)
  return TOG.subarray(0, m).sort()
}
let TOG = new Int32Array(256)

/** The pieces beside a piece's cells, and how many cell sides each shares with it. */
function touching(G, comp, pieces, cells, me) {
  const nb = G.nb
  const touch = new Map()
  for (let k = 0; k < cells.length; k++) {
    const c = cells[k]
    for (let e = 0; e < 4; e++) {
      const q = comp[c + nb[e]]
      if (q >= 0 && q !== me && pieces[q].cells.length) touch.set(q, (touch.get(q) || 0) + 1)
    }
  }
  return touch
}

/** Share piece `me`'s cells out to the pieces beside them, a ring at a time from its edge in (see mergeSlivers). */
function handOut(G, comp, pieces, me, weak, fit) {
  const nb = G.nb
  const p = pieces[me]
  let rest = p.cells
  const take = []
  for (;;) {
    take.length = 0
    for (let qi = 0; qi < rest.length; qi++) {
      const c = rest[qi]
      let best = -1
      let bs = 0
      for (let e = 0; e < 4; e++) {
        const q = comp[c + nb[e]]
        if (q < 0 || q === me || (fit && !fit(c, q))) continue
        let k = 0
        for (let f = 0; f < 4; f++) if (comp[c + nb[f]] === q) k++
        const sc = k * (pieces[q].band === p.band ? 1.5 : 1) * (weak.has(q) ? 0.3 : 1)
        if (sc > bs) {
          bs = sc
          best = q
        }
      }
      if (best >= 0) take.push(c, best)
    }
    if (!take.length) break
    for (let t = 0; t < take.length; t += 2) {
      comp[take[t]] = take[t + 1]
      pieces[take[t + 1]].cells.push(take[t])
    }
    owned(rest, comp, me)
    if (!rest.length) break
  }
  for (let u = 0; u < rest.length; u++) comp[rest[u]] = -1
  p.cells = []
}

/** Whether a piece is a sliver: fewer than `small` cells, or narrow. */
const sliver = (G, cells, small) => cells.length < small || narrow(G, cells)

/**
 * Whether a piece is too narrow to be a paddy: under NARROW cells across, on
 * average, along its longest way.
 */
function narrow(G, cells) {
  const w = G.w
  const ang = axisOf(cells, w)
  const ax = Math.cos(ang)
  const az = Math.sin(ang)
  let u0 = Infinity
  let u1 = -Infinity
  for (let q = 0; q < cells.length; q++) {
    const c = cells[q]
    const u = (c % w) * ax + ((c / w) | 0) * az
    if (u < u0) u0 = u
    if (u > u1) u1 = u
  }
  return cells.length / (u1 - u0 + 1) < NARROW
}

/**
 * A safety net under the layout: a piece (of `ids`) that still came out long
 * along its terrace (the tail of one strung along a channel, say) is cut into
 * parts about as long as it is wide, by cross-banks down the fall of the land
 * like the rest (or across its length, where the land has no fall to speak
 * of). Returns the new pieces, each at the level of the one it was cut from.
 */
function cutLong(G, comp, pieces, tau, ids) {
  const added = []
  for (const pid of ids) {
    const p = pieces[pid]
    const m = p.cells.length
    // (most are nowhere near long enough to need it: as wide as they are long)
    if (m < 2 * MIN_CELLS || diagonal(G, p.cells) < MAX_SIDE * 1.25) continue
    const us = new Float64Array(m)
    fallAxis(G, p.cells, tau, us)
    const u0 = UU[0]
    const u1 = UU[1]
    // its length along its axis, and its mean width (area over length, which
    // a crescent's bow doesn't inflate)
    const len = (u1 - u0 + 1) * CELL
    const wide = (m * CELL * CELL) / len
    if (len < MAX_SIDE * 1.25 || len < wide * 1.9) continue
    const k = Math.max(2, Math.round(len / Math.max(MIN_SIDE, wide * 1.1)))
    const span = (u1 - u0 + 1) / k
    const parts = [pid]
    for (let i = 1; i < k; i++) {
      parts.push(pieces.length)
      added.push(pieces.length)
      pieces.push({ cells: [], band: p.band, level: p.level })
    }
    const cells = p.cells
    p.cells = []
    for (let q = 0; q < m; q++) {
      const id = parts[Math.min(k - 1, Math.max(0, Math.floor((us[q] - u0 + 0.5) / span)))]
      pieces[id].cells.push(cells[q])
      comp[cells[q]] = id
    }
  }
  return added
}

/** The diagonal of the box round some cells, in world units. */
function diagonal(G, cells) {
  const w = G.w
  let i0 = Infinity
  let i1 = -Infinity
  let j0 = Infinity
  let j1 = -Infinity
  for (let q = 0; q < cells.length; q++) {
    const c = cells[q]
    const i = c % w
    const j = (c / w) | 0
    if (i < i0) i0 = i
    if (i > i1) i1 = i
    if (j < j0) j0 = j
    if (j > j1) j1 = j
  }
  return Math.hypot(i1 - i0 + 1, j1 - j0 + 1) * CELL
}

/**
 * The cells' places (in cells) along a piece of a terrace, into us: along
 * it is square to the mean fall of the land across it (or, where the land
 * has no fall to speak of, its own long way). Their least and most into
 * UU.
 */
function fallAxis(G, cells, tau, us) {
  const w = G.w
  const m = cells.length
  let mx = 0
  let mz = 0
  for (let qi = 0; qi < cells.length; qi++) {
    const c = cells[qi]
    mx += c % w
    mz += (c / w) | 0
  }
  mx /= m
  mz /= m
  let sxx = 0
  let sxz = 0
  let szz = 0
  let gx = 0
  let gz = 0
  for (let k = 0; k < cells.length; k++) {
    const c = cells[k]
    const dx = (c % w) - mx
    const dz = ((c / w) | 0) - mz
    sxx += dx * dx
    sxz += dx * dz
    szz += dz * dz
    gx += tau[c + 1] - tau[c - 1]
    gz += tau[c + w] - tau[c - w]
  }
  const gl = Math.hypot(gx, gz)
  const ang = gl > m * 0.02 ? Math.atan2(gx, -gz) : 0.5 * Math.atan2(2 * sxz, sxx - szz)
  const ax = Math.cos(ang)
  const az = Math.sin(ang)
  let u0 = Infinity
  let u1 = -Infinity
  for (let q = 0; q < m; q++) {
    const c = cells[q]
    const u = ((c % w) - mx) * ax + (((c / w) | 0) - mz) * az
    us[q] = u
    u0 = Math.min(u0, u)
    u1 = Math.max(u1, u)
  }
  UU[0] = u0
  UU[1] = u1
}
const UU = new Float64Array(2)

/**
 * The window of water levels each cell can sit under: none of the texels its
 * paddy will level for it (those carvePlan stamps for the cell) may need more
 * than MAX_CUT taken off to get under the water (lo), and its ground may be
 * no more than FLOAT below it (hi: the water may stand over a hollow, held by
 * the bank, but not perched far above it).
 */
function windowsOf(G, hs, height, N2) {
  const { x0, z0, w, n } = G
  const tex = WORLD / N2
  const hc = CELL * 0.75
  const lo = new Float32Array(n)
  const hi = new Float32Array(n)
  for (let q = 0; q < G.cells.length; q++) {
    const c = G.cells[q]
    const x = x0 + ((c % w) + 0.5) * CELL + HALF
    const z = z0 + (((c / w) | 0) + 0.5) * CELL + HALF
    const i0 = Math.max(0, Math.floor((x - hc) / tex - 0.5))
    const i1 = Math.min(N2 - 1, Math.floor((x + hc) / tex - 0.5) + 1)
    const j0 = Math.max(0, Math.floor((z - hc) / tex - 0.5))
    const j1 = Math.min(N2 - 1, Math.floor((z + hc) / tex - 0.5) + 1)
    let top = -Infinity
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) top = Math.max(top, height[j * N2 + i])
    lo[c] = top + DEPTH - MAX_CUT
    hi[c] = hs[c] + FLOAT
  }
  return { lo, hi }
}

/** The level inside the most cells' windows (nearest their mean on ties). */
function levelFor(cells, { lo, hi }, hs) {
  // sweep the windows' sorted ends
  const m = cells.length
  const los = new Float32Array(m)
  const his = new Float32Array(m)
  let mean = 0
  for (let q = 0; q < m; q++) {
    los[q] = lo[cells[q]]
    his[q] = hi[cells[q]]
    mean += hs[cells[q]]
  }
  mean /= m
  los.sort()
  his.sort()
  let a = 0
  let b = 0
  let best = -1
  let L = mean
  while (a < m) {
    // just after the a-th window opens: those open minus those shut
    const v = los[a]
    while (b < m && his[b] < v) b++
    a++
    while (a < m && los[a] === v) a++
    const cur = a - b
    const end = a < m ? Math.min(los[a], his[b]) : his[b]
    const pick = Math.min(Math.max(v, mean), Math.max(v, end))
    if (cur > best || (cur === best && Math.abs(pick - mean) < Math.abs(L - mean))) {
      best = cur
      L = pick
    }
  }
  return L
}

/**
 * Each paddy takes the level that suits most of its cells; the rest go to a
 * neighbour that can take them, or gather into paddies of their own, or are
 * left as banks. Returns the pieces that are paddies.
 */
function settle(G, mask, comp, pieces, win, hs) {
  const { lo, hi } = win
  const live = []
  for (let pid = 0; pid < pieces.length; pid++) {
    const p = pieces[pid]
    owned(p.cells, comp, pid)
    if (p.cells.length < MIN_CELLS) {
      for (let k = 0; k < p.cells.length; k++) comp[p.cells[k]] = -1
      p.cells = []
      continue
    }
    const L = (p.level = levelFor(p.cells, win, hs))
    for (let q = 0; q < p.cells.length; q++) {
      const c = p.cells[q]
      if (!(lo[c] <= L && L <= hi[c])) comp[c] = -1
    }
    owned(p.cells, comp, pid)
    live.push(pid)
  }
  regrow(G, comp, pieces, win, hs, 6)
  gather(G, mask, comp, pieces, win, hs, live)
  regrow(G, comp, pieces, win, hs, 6)
  return live
}

/** What's left over gathers into paddies of its own where it can (added to live). */
function gather(G, mask, comp, pieces, win, hs, live) {
  const nb = G.nb
  const { lo, hi } = win
  for (let q0 = 0; q0 < G.cells.length; q0++) {
    const c0 = G.cells[q0]
    if (comp[c0] >= 0) continue
    const part = []
    const st = [c0]
    comp[c0] = -2
    while (st.length) {
      const c = st.pop()
      part.push(c)
      for (let e = 0; e < 4; e++) {
        const d = c + nb[e]
        if (mask[d] && comp[d] === -1) {
          comp[d] = -2
          st.push(d)
        }
      }
    }
    const pid = pieces.length
    const L = part.length >= MIN_CELLS ? levelFor(part, win, hs) : 0
    const cells = []
    for (let k = 0; k < part.length; k++) {
      const c = part[k]
      if (part.length >= MIN_CELLS && lo[c] <= L && L <= hi[c]) cells.push(c)
      comp[c] = -3 // looked at
    }
    if (cells.length >= MIN_CELLS) {
      for (let k = 0; k < cells.length; k++) comp[cells[k]] = pid
      pieces.push({ cells, band: -1, level: L })
      live.push(pid)
    }
  }
  for (let q = 0; q < G.cells.length; q++) {
    const c = G.cells[q]
    if (comp[c] === -3) comp[c] = -1
  }
}

/**
 * Free arable cells join the paddy beside them that holds most of their
 * sides and whose water suits them (one walled in on three sides may lie
 * deeper under it), a ring at a time so that no direction is favoured.
 */
function regrow(G, comp, pieces, { lo, hi }, hs, rounds) {
  const nb = G.nb
  const free = owned(G.cells.slice(), comp, -1)
  const take = []
  for (let round = 0; round < rounds && free.length; round++) {
    take.length = 0
    for (let u = 0; u < free.length; u++) {
      const c = free[u]
      let best = -1
      let bk = 0
      let bd = Infinity
      for (let e = 0; e < 4; e++) {
        const q = comp[c + nb[e]]
        if (q < 0) continue
        let k = 0
        for (let f = 0; f < 4; f++) if (comp[c + nb[f]] === q) k++
        const L = pieces[q].level
        if (L < lo[c] || (L > hi[c] && k < 3)) continue
        const d = Math.abs(L - hs[c])
        if (k > bk || (k === bk && d < bd)) {
          best = q
          bk = k
          bd = d
        }
      }
      if (best >= 0) take.push(c, best)
    }
    if (!take.length) break
    for (let t = 0; t < take.length; t += 2) {
      comp[take[t]] = take[t + 1]
      pieces[take[t + 1]].cells.push(take[t])
    }
    owned(free, comp, -1)
  }
}

/** Keep only the cells comp gives to `id` (the list itself, in place). */
function owned(cells, comp, id) {
  let k = 0
  for (let q = 0; q < cells.length; q++) if (comp[cells[q]] === id) cells[k++] = cells[q]
  cells.length = k
  return cells
}

/**
 * Tidy the paddies' cells before they are outlined, so that an outline has
 * no teeth or spikes to follow. The terraced ground as a whole loses the
 * teeth and strips under three cells wide that it pushes out into open
 * ground; each paddy loses its whiskers and necks a cell wide where it meets
 * open ground, takes in the notches open ground makes in it, and is cut in
 * two if it is bent round a corner; one left too small or narrow joins a
 * neighbour it makes a square paddy with; and one that has come out long is
 * cut across, as before. A cell only goes to a paddy whose water suits it
 * (`fit`: here the water may stand a little deeper over a hollow). Returns
 * the pieces that are still paddies.
 */
function tidy(G, comp, pieces, live, win, tau) {
  const fit = (c, q) => win.lo[c] <= pieces[q].level && pieces[q].level <= win.hi[c] + FLOAT
  openLand(G, comp)
  shave(G, comp, pieces, live, fit)
  fillNotches(G, comp, pieces, fit)
  mergeSlivers(G, comp, pieces, live, SMALL, fit)
  shave(G, comp, pieces, live, fit)
  live.push(...cutLong(G, comp, pieces, tau, live))
  const kept = []
  for (const pid of live) {
    const p = pieces[pid]
    owned(p.cells, comp, pid)
    if (p.cells.length >= MIN_CELLS) kept.push(pid)
    else for (let k = 0; k < p.cells.length; k++) comp[p.cells[k]] = -1
  }
  return kept
}

/**
 * Open ground in a notch of a paddy — walled in by it on five sides of
 * eight — is taken in, if the paddy's water suits it.
 */
function fillNotches(G, comp, pieces, fit) {
  const w = G.w
  const ring = [-w - 1, -w, -w + 1, -1, 1, w - 1, w, w + 1]
  for (let pass = 0; pass < 2; pass++) {
    const take = []
    for (let u = 0; u < G.cells.length; u++) {
      const c = G.cells[u]
      if (comp[c] >= 0) continue
      let best = -1
      let bk = 0
      for (let e = 0; e < 8; e++) {
        const q = comp[c + ring[e]]
        if (q < 0 || q === best) continue
        let k = 0
        for (let f = 0; f < 8; f++) if (comp[c + ring[f]] === q) k++
        if (k > bk) {
          bk = k
          best = q
        }
      }
      if (bk >= 5 && fit(c, best)) take.push(c, best)
    }
    if (!take.length) break
    for (let t = 0; t < take.length; t += 2) {
      comp[take[t]] = take[t + 1]
      pieces[take[t + 1]].cells.push(take[t])
    }
  }
}

/** The long axis (angle) of a set of cells. */
function axisOf(cells, w) {
  const m = cells.length
  let mx = 0
  let mz = 0
  for (let k = 0; k < cells.length; k++) {
    const c = cells[k]
    mx += c % w
    mz += (c / w) | 0
  }
  mx /= m
  mz /= m
  let sxx = 0
  let sxz = 0
  let szz = 0
  for (let q = 0; q < cells.length; q++) {
    const c = cells[q]
    const dx = (c % w) - mx
    const dz = ((c / w) | 0) - mz
    sxx += dx * dx
    sxz += dx * dz
    szz += dz * dz
  }
  return 0.5 * Math.atan2(2 * sxz, sxx - szz)
}

/**
 * How much of its convex hull a set of cells fills (1 for a rectangle,
 * about 0.75 for an L). The cells must be in index order, which is the
 * order of their centres (row, column), so the hull is a single pass.
 */
function hullFill(cells, w) {
  const m = cells.length
  if (HJ.length < m) {
    HJ = new Int32Array(2 * m)
    HI = new Int32Array(2 * m)
    HULL = new Int32Array(4 * m + 4)
  }
  for (let k = 0; k < m; k++) {
    HJ[k] = (cells[k] / w) | 0
    HI[k] = cells[k] % w
  }
  // (Andrew's monotone chain over the points in (row, column) order, as indices)
  const H = HULL
  let n = 0
  for (let pass = 0; pass < 2; pass++) {
    const start = n
    for (let s = 0; s < m; s++) {
      const k = pass ? m - 1 - s : s
      while (n >= start + 2) {
        const o = H[n - 2]
        const a = H[n - 1]
        if ((HJ[a] - HJ[o]) * (HI[k] - HI[o]) - (HI[a] - HI[o]) * (HJ[k] - HJ[o]) > 0) break
        n--
      }
      H[n++] = k
    }
    n--
  }
  let A = 0
  let i0 = Infinity
  let i1 = -Infinity
  let j0 = Infinity
  let j1 = -Infinity
  for (let t = 0; t < n; t++) {
    const a = H[t]
    const b = H[(t + 1) % n]
    A += HJ[a] * HI[b] - HJ[b] * HI[a]
    if (HI[a] < i0) i0 = HI[a]
    if (HI[a] > i1) i1 = HI[a]
    if (HJ[a] < j0) j0 = HJ[a]
    if (HJ[a] > j1) j1 = HJ[a]
  }
  // (the hull of the cell centres, grown by half a cell all round)
  return m / (Math.abs(A) / 2 + (i1 - i0) + (j1 - j0) + 1)
}
let HJ = new Int32Array(0)
let HI = new Int32Array(0)
let HULL = new Int32Array(256)

/**
 * Open ground bites back: a terraced cell that lies in no 3×3 block of
 * terraced cells (whoever's) is left out — a tooth, a whisker, or a strip
 * along the edge of the land too narrow for a paddy.
 */
function openLand(G, comp) {
  const { w, n } = G
  const core = new Uint8Array(n)
  for (let u = 0; u < G.cells.length; u++) {
    const c = G.cells[u]
    if (comp[c] < 0) continue
    let k = 0
    for (let dj = -w; dj <= w; dj += w) for (let di = -1; di <= 1; di++) if (comp[c + dj + di] >= 0) k++
    if (k === 9) core[c] = 1
  }
  for (let q = 0; q < G.cells.length; q++) {
    const c = G.cells[q]
    if (comp[c] < 0) continue
    let keep = false
    for (let dj = -w; dj <= w && !keep; dj += w) for (let di = -1; di <= 1 && !keep; di++) if (core[c + dj + di]) keep = true
    if (!keep) comp[c] = -1
  }
}

/**
 * Where a paddy meets open ground, keep only its cells that lie in a 2×2
 * block of it (inside the patchwork a bank is laid straight whatever the
 * cells do), and of those its largest part. A cell cut off goes to the
 * neighbour that holds two or more of its sides, if that one's water suits
 * it (fit), or is left as a bank.
 */
function shave(G, comp, pieces, live, fit) {
  const drop = whiskers(G, comp, pieces, live)
  splinters(G, comp, pieces, live, drop)
  rehome(G, comp, drop, fit)
  for (const pid of live) owned(pieces[pid].cells, comp, pid)
  for (let q = 0; q < drop.length; q++) {
    const c = drop[q]
    if (comp[c] >= 0) pieces[comp[c]].cells.push(c)
  }
}

/** The cells of each paddy where it meets open ground that lie in no 2×2 block of it (see shave). */
function whiskers(G, comp, pieces, live) {
  const w = G.w
  const drop = []
  for (const pid of live) {
    for (let q = 0; q < pieces[pid].cells.length; q++) {
      const c = pieces[pid].cells[q]
      if (comp[c] !== pid || (comp[c - 1] >= 0 && comp[c + 1] >= 0 && comp[c - w] >= 0 && comp[c + w] >= 0)) continue
      const a = comp[c - 1] === pid
      const b = comp[c + 1] === pid
      const u = comp[c - w] === pid
      const d = comp[c + w] === pid
      if ((a && u && comp[c - w - 1] === pid) || (b && u && comp[c - w + 1] === pid) || (a && d && comp[c + w - 1] === pid) || (b && d && comp[c + w + 1] === pid)) continue
      drop.push(c)
    }
  }
  return drop
}

/** With those to drop, each paddy's cells left outside its largest part (see shave), added to drop. */
function splinters(G, comp, pieces, live, drop) {
  const gone = new Uint8Array(G.n)
  for (let u = 0; u < drop.length; u++) gone[drop[u]] = 1
  for (const pid of live) {
    const p = pieces[pid]
    const kept = p.cells.filter((c) => comp[c] === pid && !gone[c])
    const part = largestPart(G, kept)
    if (part.length < kept.length) {
      for (let k = 0; k < part.length; k++) gone[part[k]] = 2
      for (let q = 0; q < kept.length; q++) {
        const c = kept[q]
        if (gone[c] !== 2) drop.push(c)
      }
    }
  }
}

/**
 * The dropped cells taken out, then each given to the neighbour (not the
 * paddy it came from) that holds two or more of its sides, if that one's
 * water suits it.
 */
function rehome(G, comp, drop, fit) {
  const nb = G.nb
  const was = new Int32Array(drop.length)
  for (let k = 0; k < drop.length; k++) was[k] = comp[drop[k]]
  for (let u = 0; u < drop.length; u++) comp[drop[u]] = -1
  for (let k = 0; k < drop.length; k++) {
    const c = drop[k]
    let best = -1
    let bk = 0
    for (let e = 0; e < 4; e++) {
      const q = comp[c + nb[e]]
      if (q < 0 || q === was[k] || !fit(c, q)) continue
      let n = 0
      for (let f = 0; f < 4; f++) if (comp[c + nb[f]] === q) n++
      if (n < 2) continue
      if (n > bk) {
        bk = n
        best = q
      }
    }
    if (best >= 0) comp[c] = best
  }
}

/**
 * Outline the paddies, all of them together as one map, so that two
 * neighbours share every stretch of bank between them exactly and can never
 * overlap. The map's edges run between the cells; each stretch from one
 * junction to the next is drawn as its straight runs — between two paddies
 * most are a single one, a cross-bank or a stretch of a contour, since the
 * layout drew them so; against the edge of the land (the stream, the valley
 * wall, a house) a few, so that a paddy there is clipped into a trapezoid or
 * a wedge rather than a blob — and the junctions where they meet are the
 * corners. Then the notches left are straightened or cut back (see
 * straighten, cutNotches). No line is drawn where the paddy's water would
 * not cover the ground (see dry), nor more than a quarter of a cell out past
 * the cells either side of it (three quarters, against open ground).
 * Finally each outline is pulled in to leave room for its bank.
 */
function trace(G, pieces, live, axis, near, gr, chan) {
  const { n } = G
  const own = new Int32Array(n).fill(-1)
  const pads = []
  for (const pid of live) {
    const p = pieces[pid]
    for (let u = 0; u < p.cells.length; u++) own[p.cells[u]] = pads.length
    pads.push({ cells: p.cells, level: p.level })
  }
  const ctx = { G, own, pads, gr, chan, minL: stamps(G, gr, pads) }
  const M = boundaryMap(G, own, pads)
  for (const p of pads) p.nb = new Set()
  for (const ch of M.chains) {
    if (ch.l < 0 || ch.r < 0) continue
    pads[ch.l].nb.add(ch.r)
    pads[ch.r].nb.add(ch.l)
  }
  // each stretch's straight runs (closer to the cells between two paddies)
  for (const ch of M.chains) if (!ch.closed) ch.runs = runsOf(rawLine(G, M, ch), ch.l >= 0 && ch.r >= 0 ? CELL * 0.6 : FREE_TOL)
  joinShort(ctx, M)
  for (const ch of M.chains) if (ch.l >= 0 && ch.r >= 0) ch.geom = sharedLine(ctx, M, ch)
  const polys = outlinePads(ctx, M)
  straighten(ctx, M, polys)
  for (const o of polys) if (o) o.poly = cutNotches(o.poly)
  const paddies = []
  const owner = new Int32Array(n).fill(-1)
  const finals = polys.map((o) => o && inset(o.poly, BANK / 2))
  const minL = unstamp(ctx, finals)
  for (let a = 0; a < pads.length; a++) {
    // neighbours share their outlines: pull each in to leave room for a bank
    const poly = finals[a]
    if (!poly) continue
    let s = 0
    for (let k = 0; k < pads[a].cells.length; k++) {
      const c = pads[a].cells[k]
      owner[c] = paddies.length
      s += axis[near[c]].s
    }
    paddies.push({
      poly: poly.map((q) => [Math.round(q[0] * 1000) / 1000, Math.round(q[1] * 1000) / 1000]),
      level: Math.round(pads[a].level * 100) / 100,
      flood: 1,
      age: 0,
      s: s / pads[a].cells.length,
      cells: pads[a].cells,
      side: 0,
    })
  }
  return { paddies, owner, minL }
}

/**
 * The levels to carve the ground to, without the paddies that came to
 * nothing (no outline would settle for them): their ground is left as it
 * was rather than cut for no paddy — unless a neighbour's outline stands on
 * ground levelled only for one of them, when they are carved after all.
 */
function unstamp(ctx, finals) {
  const { G, gr, pads } = ctx
  const gone = []
  for (let a = 0; a < pads.length; a++) if (!finals[a]) gone.push(a)
  if (!gone.length) return ctx.minL
  const minL = stamps(G, gr, pads.filter((_, a) => finals[a]))
  const { tex, ti0, tj0, tw, th } = gr
  for (const d of gone) {
    for (const b of pads[d].nb) {
      const P = finals[b]
      if (!P) continue
      const L = pads[b].level + 1e-4
      for (let k = 0; k < P.length; k++) {
        const A = P[k]
        const B = P[(k + 1) % P.length]
        const m = Math.max(1, Math.ceil(Math.hypot(B[0] - A[0], B[1] - A[1]) / (CELL * 0.5)))
        for (let q = 0; q <= m; q++) {
          const x = A[0] + ((B[0] - A[0]) * q) / m
          const z = A[1] + ((B[1] - A[1]) * q) / m
          const i = Math.floor((x + HALF) / tex - 0.5) - ti0
          const j = Math.floor((z + HALF) / tex - 0.5) - tj0
          if (i < 0 || j < 0 || i + 1 >= tw || j + 1 >= th) continue
          const t = j * tw + i
          if (minL[t] > L || minL[t + 1] > L || minL[t + tw] > L || minL[t + tw + 1] > L) return ctx.minL
        }
      }
    }
  }
  return minL
}

/**
 * The water level each texel of the ground is levelled to: the lowest of
 * the paddies whose cells need it (every texel the bilinear ground reads
 * anywhere within three quarters of a cell of one of a paddy's cell
 * centres), so that where two levels share a texel the lower wins.
 */
function stamps(G, gr, pads) {
  const { x0, z0, w } = G
  const { tex, ti0, tj0, tw, th } = gr
  const minL = new Float32Array(tw * th).fill(Infinity)
  const hc = CELL * 0.75
  for (const p of pads) {
    const L = p.level
    for (let q = 0; q < p.cells.length; q++) {
      const c = p.cells[q]
      const x = x0 + ((c % w) + 0.5) * CELL + HALF
      const z = z0 + (((c / w) | 0) + 0.5) * CELL + HALF
      const i0 = Math.max(0, Math.floor((x - hc) / tex - 0.5) - ti0)
      const i1 = Math.min(tw - 1, Math.floor((x + hc) / tex - 0.5) + 1 - ti0)
      const j0 = Math.max(0, Math.floor((z - hc) / tex - 0.5) - tj0)
      const j1 = Math.min(th - 1, Math.floor((z + hc) / tex - 0.5) + 1 - tj0)
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) if (L < minL[j * tw + i]) minL[j * tw + i] = L
    }
  }
  return minL
}

/**
 * Whether every point of a segment (sampled every half cell or so) may lie
 * on the line between paddies l and r (-1: open ground): under the water of
 * both — every texel the ground there is read from levelled for it, or for
 * a lower paddy — and near the cells of one of them or of a neighbour of
 * theirs: within three quarters of a cell of a cell's centre, a quarter of
 * a cell out past it (where two banks meet, the corner may stand a little
 * way into the cells of a third paddy, as the banks wander off the cells).
 * An edge against open ground may stand three quarters of a cell out past
 * its cells, so that a straight bank can cut across the steps of the cells
 * along it — but not out over a stream's channel.
 */
function segFits(ctx, ax, az, bx, bz, l, r) {
  const { G, own, gr, minL, chan, pads } = ctx
  const { x0, z0, w, h } = G
  const { tex, ti0, tj0, tw, th } = gr
  const L = Math.min(l >= 0 ? pads[l].level : Infinity, r >= 0 ? pads[r].level : Infinity) + 1e-4
  const free = l < 0 || r < 0
  const k = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / (CELL * 0.5)))
  for (let s = 0; s <= k; s++) {
    const x = ax + ((bx - ax) * s) / k
    const z = az + ((bz - az) * s) / k
    const ti = Math.floor((x + HALF) / tex - 0.5) - ti0
    const tj = Math.floor((z + HALF) / tex - 0.5) - tj0
    if (ti < 0 || tj < 0 || ti + 1 >= tw || tj + 1 >= th) return false
    const t = tj * tw + ti
    if (minL[t] > L || minL[t + 1] > L || minL[t + tw] > L || minL[t + tw + 1] > L) return false
    const u = (x - x0) / CELL
    const v = (z - z0) / CELL
    let reach = 0.75 + 1e-9
    if (free) {
      const ci = Math.floor(u)
      const cj = Math.floor(v)
      if (!(ci >= 0 && cj >= 0 && ci < w && cj < h && chan[cj * w + ci] === 1)) reach = 1.25 + 1e-9
    }
    const fi = u - 0.5
    const fj = v - 0.5
    const i0 = Math.round(fi)
    const j0 = Math.round(fj)
    let near = false
    for (let side = 0; side < 2 && !near; side++) {
      const a = side ? r : l
      if (a < 0) continue
      // (the cell it lies in first)
      if (i0 >= 0 && j0 >= 0 && i0 < w && j0 < h && own[j0 * w + i0] === a) {
        near = true
        break
      }
      const nb = pads[a].nb
      for (let j = Math.max(0, j0 - 1); j <= Math.min(h - 1, j0 + 1) && !near; j++) {
        if (Math.abs(fj - j) > reach) continue
        for (let i = Math.max(0, i0 - 1); i <= Math.min(w - 1, i0 + 1); i++) {
          const o = own[j * w + i]
          if (o >= 0 && (o === a || nb.has(o)) && Math.abs(fi - i) <= reach) {
            near = true
            break
          }
        }
      }
    }
    if (!near) return false
  }
  return true
}

/**
 * The edges between the cells of different paddies (or of a paddy and open
 * ground), as chains of grid corners from one junction (a corner where three
 * or four edges meet) to the next, or closed loops. A chain carries the
 * paddy on its left (l) and right (r), -1 for open ground, walking from its
 * first corner to its last. Corners are indexed j·(w + 1) + i; `ends` lists
 * the chains that start or end at each junction.
 */
function boundaryMap(G, own, pads) {
  const { w, h } = G
  const W1 = w + 1
  // the corners of the paddies' cells, in order (no paddy cell lies on the
  // edge of the grid, so every corner's four cells are on it)
  const seen = new Uint8Array(W1 * (h + 1))
  let nc = 0
  for (const p of pads) nc += p.cells.length
  const all = new Int32Array(4 * nc)
  nc = 0
  for (const p of pads) {
    for (let qi = 0; qi < p.cells.length; qi++) {
      const c = p.cells[qi]
      const v = ((c / w) | 0) * W1 + (c % w)
      for (let k = 0; k < 4; k++) {
        const u = v + (k & 1) + (k >> 1) * W1
        if (seen[u]) continue
        seen[u] = 1
        all[nc++] = u
      }
    }
  }
  const corners = all.subarray(0, nc).sort()
  // the edges out of each corner (bit d: 0 east, 1 south, 2 west, 3 north)
  const dirs = new Uint8Array(W1 * (h + 1))
  const deg = new Uint8Array(W1 * (h + 1))
  let k = 0
  for (let q = 0; q < nc; q++) {
    const v = corners[q]
    const se = ((v / W1) | 0) * w + (v % W1)
    const nw = own[se - w - 1]
    const ne = own[se - w]
    const sw = own[se - 1]
    const d = (ne !== own[se] ? 1 : 0) | (sw !== own[se] ? 2 : 0) | (nw !== sw ? 4 : 0) | (nw !== ne ? 8 : 0)
    if (!d) continue
    dirs[v] = d
    deg[v] = (d & 1) + ((d >> 1) & 1) + ((d >> 2) & 1) + ((d >> 3) & 1)
    corners[k++] = v
  }
  const at = (i, j) => own[j * w + i]
  const step = [1, W1, -1, -W1]
  // (an edge's index: twice its corner, east or south of it, plus one if it runs south)
  const eo = [0, 1, -2, 1 - 2 * W1]
  const used = new Uint8Array(2 * W1 * (h + 2))
  const chains = []
  const ends = new Map()
  const walk = (v0, d0, closed) => {
    const pts = [v0]
    let v = v0
    let d = d0
    for (;;) {
      used[2 * v + eo[d]] = 1
      v += step[d]
      pts.push(v)
      if (v === v0 || deg[v] !== 2) break
      const back = (d + 2) & 3
      for (let e = 0; e < 4; e++) {
        if (e !== back && (dirs[v] >> e) & 1) {
          d = e
          break
        }
      }
    }
    // who lies either side of the first edge
    const i = v0 % W1
    const j = (v0 / W1) | 0
    const lr = d0 === 0 ? [at(i, j - 1), at(i, j)] : d0 === 1 ? [at(i, j), at(i - 1, j)] : d0 === 2 ? [at(i - 1, j), at(i - 1, j - 1)] : [at(i - 1, j - 1), at(i, j - 1)]
    // (every field from the start, so that every chain has one shape)
    const ch = { v: pts, l: lr[0], r: lr[1], closed, geom: null, lv: 0, runs: null, mid: null, drawn: null }
    chains.push(ch)
    if (!closed) {
      for (const [u, e] of [
        [pts[0], 0],
        [pts[pts.length - 1], 1],
      ]) {
        const list = ends.get(u)
        if (list) list.push({ ch, end: e })
        else ends.set(u, [{ ch, end: e }])
      }
    }
  }
  for (let q = 0; q < k; q++) {
    const v = corners[q]
    if (deg[v] === 2) continue
    for (let d = 0; d < 4; d++) if ((dirs[v] >> d) & 1 && !used[2 * v + eo[d]]) walk(v, d, false)
  }
  // what's left are loops with no junction on them
  for (let q = 0; q < k; q++) {
    const v = corners[q]
    for (let d = 0; d < 4; d++) if ((dirs[v] >> d) & 1 && !used[2 * v + eo[d]]) walk(v, d, true)
  }
  const pos = new Map()
  for (const v of ends.keys()) pos.set(v, [G.x0 + (v % W1) * CELL, G.z0 + ((v / W1) | 0) * CELL])
  return { chains, ends, pos, W1 }
}

/** The cells left and right of the edge from corner p to the next corner q. */
function edgeCells(p, q, W1, w, out) {
  const i = p % W1
  const j = (p / W1) | 0
  const d = q - p
  if (d === 1) {
    out[0] = (j - 1) * w + i
    out[1] = j * w + i
  } else if (d === W1) {
    out[0] = j * w + i
    out[1] = j * w + i - 1
  } else if (d === -1) {
    out[0] = j * w + i - 1
    out[1] = (j - 1) * w + i - 1
  } else {
    out[0] = (j - 1) * w + i - 1
    out[1] = (j - 1) * w + i
  }
}
const LR = new Int32Array(2)

/** A corner's place in world units. */
function cornerAt(G, W1, v, out) {
  out[0] = G.x0 + (v % W1) * CELL
  out[1] = G.z0 + ((v / W1) | 0) * CELL
  return out
}
const XZ = new Float64Array(2)

/**
 * A polyline (flat, P) cut into straight runs by Douglas–Peucker to within
 * tol, each with the line that best fits its points (leaving out its two
 * ends, which a corner pulls off it): [{ a, b, line: { x, z, nx, nz } }],
 * a and b its first and last point.
 */
function runsOf(P, tol) {
  const m = P.length / 2
  const keep = new Uint8Array(m)
  keep[0] = keep[m - 1] = 1
  keepFar(null, P, keep, 0, m - 1, tol, -1, -1, false)
  const runs = []
  let a = 0
  for (let k = 1; k < m; k++) {
    if (!keep[k]) continue
    runs.push(k - a >= 3 ? { a, b: k, line: fitLine(P, a + 1, k - 1) } : { a, b: k, line: fitLine(P, a, k) })
    a = k
  }
  return runs
}

/** The line that best fits points a to b of a flat polyline (least squares, perpendicular). */
function fitLine(P, a, b) {
  const m = b - a + 1
  let mx = 0
  let mz = 0
  for (let k = a; k <= b; k++) {
    mx += P[2 * k]
    mz += P[2 * k + 1]
  }
  mx /= m
  mz /= m
  let sxx = 0
  let sxz = 0
  let szz = 0
  for (let k = a; k <= b; k++) {
    const dx = P[2 * k] - mx
    const dz = P[2 * k + 1] - mz
    sxx += dx * dx
    sxz += dx * dz
    szz += dz * dz
  }
  const ang = 0.5 * Math.atan2(2 * sxz, sxx - szz)
  return { x: mx, z: mz, nx: Math.cos(ang), nz: Math.sin(ang) }
}

/**
 * A polyline drawn as its straight runs (see runsOf), from its first point
 * to its last: each corner where two runs' lines cross, if they cross at
 * more than 20° and near where the runs meet (otherwise that point itself).
 */
function crisp(P, runs) {
  const out = [P[0], P[1]]
  for (let r = 0; r + 1 < runs.length; r++) {
    const A = runs[r].line
    const B = runs[r + 1].line
    const vx = P[2 * runs[r].b]
    const vz = P[2 * runs[r].b + 1]
    const det = A.nx * B.nz - A.nz * B.nx
    if (Math.abs(det) > 0.34) {
      const t = ((B.x - A.x) * B.nz - (B.z - A.z) * B.nx) / det
      const cx = A.x + A.nx * t
      const cz = A.z + A.nz * t
      if (Math.hypot(cx - vx, cz - vz) < CELL * 1.5) {
        out.push(cx, cz)
        continue
      }
    }
    out.push(vx, vz)
  }
  out.push(P[P.length - 2], P[P.length - 1])
  return out
}

/**
 * Two junctions a stretch of a cell or two apart are put together at its
 * middle, where every stretch from them still fits: the paddies round them
 * meet at one corner instead of in two kinks.
 */
function joinShort(ctx, M) {
  const joined = new Set()
  for (const ch of M.chains) {
    if (ch.closed || ch.l < 0 || ch.r < 0 || ch.v.length > 3) continue
    const a = ch.v[0]
    const b = ch.v[ch.v.length - 1]
    if (a === b || joined.has(a) || joined.has(b)) continue
    const P = M.pos.get(a)
    const Q = M.pos.get(b)
    const mid = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2]
    if (!nodeFits(ctx, M, M.ends.get(a).concat(M.ends.get(b)), mid[0], mid[1])) continue
    M.pos.set(a, mid)
    M.pos.set(b, mid)
    joined.add(a)
    joined.add(b)
  }
}

/** Whether a junction may move to (x, z): the first stretch of every chain from it must still fit. */
function nodeFits(ctx, M, list, x, z) {
  const { G } = ctx
  for (const { ch, end } of list) {
    // the midpoint of the chain's edge next to this end
    const m = ch.v.length - 1
    const t = end ? m - 1 : 0
    cornerAt(G, M.W1, ch.v[t], XZ)
    const ax = XZ[0]
    const az = XZ[1]
    cornerAt(G, M.W1, ch.v[t + 1], XZ)
    if (!segFits(ctx, x, z, (ax + XZ[0]) / 2, (az + XZ[1]) / 2, ch.l, ch.r)) {
      return false
    }
  }
  return true
}

/**
 * A chain as drawn straight off the cells, flat [x, z, …]: its edges'
 * midpoints (so a one-cell step becomes a 45° chamfer), between its two
 * junctions as placed (leaving out any it would double back to, where a
 * junction has moved past them), or round its loop.
 */
function rawLine(G, M, ch) {
  const m = ch.v.length - 1
  if (!ch.mid) {
    ch.mid = new Float64Array(2 * m)
    for (let t = 0; t < m; t++) {
      cornerAt(G, M.W1, ch.v[t], XZ)
      const x = XZ[0]
      const z = XZ[1]
      cornerAt(G, M.W1, ch.v[t + 1], XZ)
      ch.mid[2 * t] = (x + XZ[0]) / 2
      ch.mid[2 * t + 1] = (z + XZ[1]) / 2
    }
  }
  if (ch.closed) return Array.from(ch.mid)
  const a = M.pos.get(ch.v[0])
  const b = M.pos.get(ch.v[m])
  const P = ch.mid
  let k0 = 0
  let k1 = m - 1
  while (k0 < k1 && (P[2 * k0] - a[0]) * (P[2 * k0 + 2] - P[2 * k0]) + (P[2 * k0 + 1] - a[1]) * (P[2 * k0 + 3] - P[2 * k0 + 1]) < 0) k0++
  while (k1 > k0 && (b[0] - P[2 * k1]) * (P[2 * k1] - P[2 * k1 - 2]) + (b[1] - P[2 * k1 + 1]) * (P[2 * k1 + 1] - P[2 * k1 - 1]) < 0) k1--
  const out = [a[0], a[1]]
  for (let k = k0; k <= k1; k++) out.push(P[2 * k], P[2 * k + 1])
  out.push(b[0], b[1])
  return out
}

/**
 * A stretch between two paddies: drawn as its straight runs, corner to
 * corner, where that fits (most are one straight run, a cross-bank or a
 * stretch of a contour), or else eased a little off the cells.
 */
function sharedLine(ctx, M, ch) {
  const raw = rawLine(ctx.G, M, ch)
  if (ch.closed) return closedLine(ctx, raw, CELL * 0.5, ch.l, ch.r)
  const out = crisp(raw, ch.runs)
  if (allFit(ctx, out, ch.l, ch.r)) return out
  return thinned(ctx, raw, CELL * 0.5, ch.l, ch.r, true)
}

/** Whether every segment of a flat polyline fits. */
function allFit(ctx, P, l, r) {
  for (let k = 0; k + 3 < P.length; k += 2) if (!segFits(ctx, P[k], P[k + 1], P[k + 2], P[k + 3], l, r)) return false
  return true
}

/**
 * Douglas–Peucker over a flat polyline, ends held, to within tol, keeping a
 * segment only where it fits (`check`; otherwise it is split, down to the
 * line's own points if need be).
 */
function thinned(ctx, P, tol, l, r, check) {
  const m = P.length / 2
  const keep = new Uint8Array(m)
  keep[0] = keep[m - 1] = 1
  keepFar(ctx, P, keep, 0, m - 1, tol, l, r, check)
  const out = []
  for (let k = 0; k < m; k++) if (keep[k]) out.push(P[2 * k], P[2 * k + 1])
  return out
}

function keepFar(ctx, P, keep, a, b, tol, l, r, check) {
  const ax = P[2 * a]
  const az = P[2 * a + 1]
  const dx = P[2 * b] - ax
  const dz = P[2 * b + 1] - az
  const len = Math.hypot(dx, dz) || 1e-9
  let worst = -1
  let at = -1
  for (let k = a + 1; k < b; k++) {
    const d = Math.abs((P[2 * k] - ax) * dz - (P[2 * k + 1] - az) * dx) / len
    if (d > worst) {
      worst = d
      at = k
    }
  }
  if (at < 0 || (worst <= tol && (!check || segFits(ctx, ax, az, P[2 * b], P[2 * b + 1], l, r)))) return
  keep[at] = 1
  keepFar(ctx, P, keep, a, at, tol, l, r, check)
  keepFar(ctx, P, keep, at, b, tol, l, r, check)
}

/**
 * Thin a closed loop as thinned does, split at its two most distant points;
 * returns it open (first point not repeated).
 */
function closedLine(ctx, P, tol, l, r) {
  const m = P.length / 2
  let far = 0
  let best = -1
  for (let k = 1; k < m; k++) {
    const d = (P[2 * k] - P[0]) ** 2 + (P[2 * k + 1] - P[1]) ** 2
    if (d > best) {
      best = d
      far = k
    }
  }
  const half = (Q) => {
    if (tol > 0) {
      const out = crisp(Q, runsOf(Q, tol))
      if (allFit(ctx, out, l, r)) return out
    }
    return thinned(ctx, Q, tol, l, r, true)
  }
  const a = half(P.slice(0, 2 * far + 2))
  const b = half([...P.slice(2 * far), P[0], P[1]])
  return a.slice(0, -2).concat(b.slice(0, -2))
}

/**
 * Each paddy's outline from its chains: the shared stretches as drawn, its
 * stretches against open ground drawn as straight as they may be. Where an
 * outline crosses itself, or another's, only the stretches that cross are
 * drawn again, a step plainer each time (see plainer), and if that's not
 * enough the junctions at their ends are put back on the grid; one that
 * loses much of its ground has its stretches against open ground drawn less
 * straight. Returns { poly } per paddy, or null for one that never settles
 * (left out rather than risk an overlap).
 */
function outlinePads(ctx, M) {
  const { G, pads } = ctx
  const mine = pads.map(() => [])
  for (const ch of M.chains) {
    if (ch.l >= 0) mine[ch.l].push(ch)
    if (ch.r >= 0) mine[ch.r].push(ch)
  }
  const rings = pads.map((_, a) => outerRing(M, mine[a], a))
  const out = new Array(pads.length).fill(null)
  let again = new Set()
  // (the paddy being built: it is built again straight away, not next round)
  let self = -1
  const redo = (ch) => {
    for (const b of [ch.l, ch.r]) if (b >= 0 && b !== self) again.add(b)
  }
  const line = (ch) => (ch.l >= 0 && ch.r >= 0 ? ch.geom : ch.lv < FREE.length ? freeLine(ctx, M, ch, FREE[ch.lv]) : rawLine(G, M, ch))
  // the given stretches each drawn plainer, or if none can be, their
  // junctions put back on the grid; false if nothing changed
  const ease = (chs) => {
    let done = false
    for (const ch of chs) {
      if (!plainer(ctx, M, ch)) continue
      redo(ch)
      done = true
    }
    if (done) return true
    for (const ch of chs) {
      if (ch.closed) continue
      for (const v of [ch.v[0], ch.v[ch.v.length - 1]]) {
        const x = G.x0 + (v % M.W1) * CELL
        const z = G.z0 + ((v / M.W1) | 0) * CELL
        const P = M.pos.get(v)
        if (P[0] === x && P[1] === z) continue
        M.pos.set(v, [x, z])
        for (const e of M.ends.get(v)) {
          if (e.ch.l >= 0 && e.ch.r >= 0) drawShared(ctx, M, e.ch)
          redo(e.ch)
        }
        done = true
      }
    }
    return done
  }
  const build = (a) => {
    out[a] = null
    const ring = rings[a]
    if (!ring) return true
    self = a
    let ok = false
    for (let tries = 0; tries < 16; tries++) {
      const p = unpinch(ringPoints(ring, line))
      const bad = selfCrossing(p)
      if (bad) {
        if (ease(new Set(bad.map((i) => ring[p[i][2]].ch)))) continue
        break
      }
      // (a small one may lose most of its edge to the chamfers and the
      // straight runs: it is drawn plainer while it can be, and kept as it
      // comes if it holds half its ground)
      const held = Math.abs(signedArea(p)) / (pads[a].cells.length * CELL * CELL)
      if (held < 0.75) {
        let done = false
        for (const { ch } of ring) if ((ch.l < 0 || ch.r < 0) && plainer(ctx, M, ch)) done = true
        if (done) continue
        if (held < 0.5) break
      }
      out[a] = { poly: p, ring, area: 0, notch: 0, corners: 0 }
      fresh.add(a)
      ok = true
      break
    }
    self = -1
    return ok
  }
  // (the outlines drawn since they were last checked against each other)
  const fresh = new Set()
  let todo = new Set(pads.keys())
  for (let round = 0; round < 10 && todo.size; round++) {
    again = new Set()
    for (const a of todo) build(a)
    // (once every outline holds on its own, no two may cross)
    if (!again.size) {
      const found = crossings(out, fresh)
      fresh.clear()
      for (const { a, b, chs } of found) {
        if (ease(chs)) continue
        // (nothing left to draw plainer: the smaller gives way)
        const drop = Math.abs(signedArea(out[a].poly)) < Math.abs(signedArea(out[b].poly)) ? a : b
        out[drop] = null
        rings[drop] = null
      }
    }
    todo = again
  }
  for (const a of todo) out[a] = null
  // (every stretch's line as drawn, for straighten)
  for (const o of out) if (o) for (const { ch } of o.ring) if (ch.l < 0 || ch.r < 0) ch.geom = line(ch)
  return out
}

/**
 * Take out the notches the outlines are left with: a corner that turns into
 * its paddy (from a step in its cells, or where a junction stands off the
 * line its paddy's sides run along) is straightened where it may be — a
 * point of a stretch dropped, or a junction moved onto the line through its
 * neighbours — as long as every paddy it touches stays under its own water
 * (the ground swept over is levelled for both sides), clear of the others
 * and much the size it was, and the notches round about get shallower for
 * it.
 */
function straighten(ctx, M, out) {
  const boxes = out.map((o) => o && boxOf(o.poly))
  // (each outline's size and how far it is from four-square, kept up to date)
  for (const o of out) {
    if (!o) continue
    o.area = Math.abs(signedArea(o.poly))
    o.notch = notchDepth(o.poly)
    o.corners = cornersOf(o.poly)
  }
  // (the outlines near each, within a few cells: all an edit can reach)
  const around = nearby(boxes, CELL * 3)
  const near = (hit) => {
    const list = new Set()
    for (const b of hit) for (const c of around[b]) list.add(c)
    return list
  }
  // (every outline once, then again those changed since)
  let todo = out.map((_, a) => a)
  for (let pass = 0; pass < 3 && todo.length; pass++) {
    const changed = new Set()
    for (const a of todo) {
      if (!out[a]) continue
      // (each notch the outline has now, deepest first; then, if it has
      // more than four corners, each mild corner)
      for (const [x, z] of notchesOf(out[a].poly)) {
        const p = out[a].poly
        const i = p.findIndex((q) => q[0] === x && q[1] === z)
        const hit = i >= 0 && tryStraight(ctx, M, out, boxes, near, a, i, false)
        if (hit) for (const b of hit) changed.add(b)
      }
      if (out[a].corners <= 4 || !amid(out[a].ring)) continue
      // (the mildest few: as many as it has corners too many, and one more)
      for (const [x, z] of mildOf(out[a].poly).slice(0, out[a].corners - 3)) {
        if (!out[a] || out[a].corners <= 4) break
        const p = out[a].poly
        const i = p.findIndex((q) => q[0] === x && q[1] === z)
        const hit = i >= 0 && tryStraight(ctx, M, out, boxes, near, a, i, true)
        if (hit) for (const b of hit) changed.add(b)
      }
    }
    todo = [...changed]
  }
}

/**
 * Try to straighten paddy a's outline at its point i (see straighten): a
 * notch, or with `mild` a corner that bends it only a little (the trade
 * then is corners for corners, the notches no deeper); the paddies changed,
 * or null.
 */
function tryStraight(ctx, M, out, boxes, near, a, i, mild) {
  const p = out[a].poly
  const m = p.length
  const V = p[i]
  const U = p[(i + m - 1) % m]
  const W = p[(i + 1) % m]
  const { ch, rev } = out[a].ring[V[2]]
  if (ch.closed) return null
  // the stretches to change, each with its new line, and the triangles of
  // ground they sweep over
  const edits = []
  const swept = []
  // (and the point as it stands, and where it goes: null, dropped)
  let to = null
  if (V[3] > 0) {
    // a point along a stretch: dropped
    const g = ch.geom
    const n = g.length / 2
    const q = rev ? n - 1 - V[3] : V[3]
    if (q <= 0 || q >= n - 1) return null
    edits.push({ ch, geom: g.slice(0, 2 * q).concat(g.slice(2 * q + 2)), seg: q - 1 })
    swept.push([g[2 * q - 2], g[2 * q - 1], g[2 * q], g[2 * q + 1], g[2 * q + 2], g[2 * q + 3], ch.l, ch.r])
  } else {
    // a junction: onto the line through the points either side of it
    const v = rev ? ch.v[ch.v.length - 1] : ch.v[0]
    const dx = W[0] - U[0]
    const dz = W[1] - U[1]
    const l2 = dx * dx + dz * dz
    if (l2 < 1e-12) return null
    const t = ((V[0] - U[0]) * dx + (V[1] - U[1]) * dz) / l2
    if (t <= 0.05 || t >= 0.95) return null
    const nx = U[0] + dx * t
    const nz = U[1] + dz * t
    if (Math.hypot(nx - V[0], nz - V[1]) > CELL * 1.2) return null
    // (a junction put together with another at a short stretch: the
    // outlines are drawn again whole, the stretch opening up)
    let lone = true
    for (const { ch: c } of M.ends.get(v)) {
      const u = c.v[0] === v ? c.v[c.v.length - 1] : c.v[0]
      const Q = M.pos.get(u)
      if (u !== v && Q[0] === V[0] && Q[1] === V[1]) lone = false
    }
    to = lone ? [nx, nz] : undefined
    for (const { ch: c, end } of M.ends.get(v)) {
      // (a stretch only a paddy that never settled runs along isn't drawn)
      if (!c.geom) continue
      const g = c.geom.slice()
      const k = end ? g.length - 2 : 0
      const o = end ? g.length - 4 : 2
      g[k] = nx
      g[k + 1] = nz
      edits.push({ ch: c, geom: g, seg: end ? g.length / 2 - 2 : 0 })
      swept.push([V[0], V[1], nx, nz, g[o], g[o + 1], c.l, c.r])
    }
  }
  // the outlines touched, before and after: each the size it was, simple,
  // and the trade a good one
  const hit = new Set()
  const old = []
  for (let k = 0; k < edits.length; k++) {
    const c = edits[k].ch
    if (c.l >= 0 && out[c.l]) hit.add(c.l)
    if (c.r >= 0 && out[c.r]) hit.add(c.r)
    old.push(c.geom)
    c.geom = edits[k].geom
  }
  const polys = new Map()
  let before = 0
  let after = 0
  let k0 = 0
  let k1 = 0
  let ok = true
  for (const b of hit) {
    const o = out[b]
    const q = moved(o.poly, V, to) || ringPoints(o.ring, (c) => c.geom)
    const A1 = Math.abs(signedArea(q))
    if (A1 < o.area * 0.85 || A1 > o.area * 1.15 || (A1 < o.area && A1 < MIN_AREA)) {
      ok = false
      break
    }
    before += o.notch
    k0 += o.corners
    const m1 = { poly: q, ring: o.ring, area: A1, notch: notchDepth(q), corners: 0 }
    after += m1.notch
    polys.set(b, m1)
  }
  // (the cheap measure first: a notch must get shallower, a mild corner
  // must not make one deeper; then the corners, then the outlines simple)
  ok = ok && (mild ? after <= before + 0.01 : after < before - 0.03)
  if (ok) {
    for (const m1 of polys.values()) k1 += m1.corners = cornersOf(m1.poly)
    ok = mild ? k1 < k0 : k1 <= k0
  }
  if (ok) for (const m1 of polys.values()) if (selfCrossing(m1.poly)) ok = false
  // and every new segment fits, the ground swept over suits both sides,
  // and no other outline is crossed
  if (ok) for (const { ch: c, geom: g, seg: k } of edits) if (!segFits(ctx, g[2 * k], g[2 * k + 1], g[2 * k + 2], g[2 * k + 3], c.l, c.r)) ok = false
  if (ok) for (const T of swept) if (!sweptFits(ctx, T)) ok = false
  if (ok && strays(out, near(hit), edits, polys)) ok = false
  if (!ok) {
    for (let k = 0; k < edits.length; k++) edits[k].ch.geom = old[k]
    return null
  }
  if (V[3] === 0) M.pos.set(rev ? ch.v[ch.v.length - 1] : ch.v[0], [edits[0].geom[0], edits[0].geom[1]])
  for (const [b, o] of polys) {
    out[b] = o
    boxes[b] = boxOf(o.poly)
  }
  return hit
}

/**
 * Cut back what notches are left: at a corner that turns into the paddy, the
 * paddy is cut along one of its two sides there, carried on straight across
 * it, where that takes off a strip no more than 1.5 cells deep and 15% of
 * its ground (the lesser of the two cuts). The outline only shrinks, so it
 * stays under its water and clear of its neighbours; the strip it gives up
 * is ground already levelled to its floor, and reads as a wider bank.
 */
function cutNotches(p) {
  for (let guard = 0; guard < 4; guard++) {
    const list = notchesOf(p)
    let done = false
    for (const [x, z, t] of list) {
      if (t > -0.52) continue
      const i = p.findIndex((q) => q[0] === x && q[1] === z)
      const q = cutAt(p, i)
      if (q) {
        p = q
        done = true
        break
      }
    }
    if (!done) break
  }
  return p
}

/** Paddy outline p cut at its notch at point i (see cutNotches), or null. */
function cutAt(p, i) {
  const m = p.length
  const V = p[i]
  const A0 = Math.abs(signedArea(p))
  const d0 = notchDepth(p)
  let best = null
  let bestA = 0
  for (const o of [(i + m - 1) % m, (i + 1) % m]) {
    // the ray on from the side o–V, to where it first meets the outline again
    let dx = V[0] - p[o][0]
    let dz = V[1] - p[o][1]
    const l = Math.hypot(dx, dz)
    if (l < 1e-9) continue
    dx /= l
    dz /= l
    let tx = Infinity
    let at = -1
    for (let k = 0; k < m; k++) {
      const k1 = (k + 1) % m
      if (k === i || k1 === i) continue
      const a = p[k]
      const b = p[k1]
      const ex = b[0] - a[0]
      const ez = b[1] - a[1]
      const den = dx * ez - dz * ex
      if (Math.abs(den) < 1e-12) continue
      const t = ((a[0] - V[0]) * ez - (a[1] - V[1]) * ex) / den
      const u = ((a[0] - V[0]) * dz - (a[1] - V[1]) * dx) / den
      if (t > 1e-6 && u >= 0 && u <= 1 && t < tx) {
        tx = t
        at = k
      }
    }
    if (at < 0) continue
    const X = [V[0] + dx * tx, V[1] + dz * tx]
    // the two parts either side of the chord V–X: the larger is kept
    const one = [V]
    for (let k = (i + 1) % m; k !== (at + 1) % m; k = (k + 1) % m) one.push(p[k])
    one.push(X)
    const two = [X]
    for (let k = (at + 1) % m; k !== i; k = (k + 1) % m) two.push(p[k])
    two.push(V)
    const a1 = Math.abs(signedArea(one))
    const a2 = Math.abs(signedArea(two))
    const keep = a1 >= a2 ? one : two
    const gone = a1 >= a2 ? two : one
    const ak = Math.max(a1, a2)
    if (ak < A0 * 0.85 || ak < MIN_AREA || ak <= bestA) continue
    // (no deeper than 1.5 cells off the chord)
    let deep = 0
    for (const q of gone) deep = Math.max(deep, Math.abs((q[0] - V[0]) * dz - (q[1] - V[1]) * dx))
    if (deep > CELL * 1.5 || selfCrossing(keep) || notchDepth(keep) >= d0 - 0.03) continue
    best = keep
    bestA = ak
  }
  return best
}

/**
 * An outline with its point V moved to `to` (or, with to null, dropped:
 * the points after it along its stretch counting one fewer), as ringPoints
 * would draw it from the changed stretches; null unless V is in it once
 * (or with `to` undefined).
 */
function moved(poly, V, to) {
  if (to === undefined) return null
  let at = -1
  for (let i = 0; i < poly.length; i++) {
    if (poly[i][0] !== V[0] || poly[i][1] !== V[1]) continue
    if (at >= 0) return null
    at = i
  }
  if (at < 0) return null
  const P = poly[at]
  if (to) {
    const out = poly.slice()
    out[at] = [to[0], to[1], P[2], P[3]]
    return out
  }
  const out = []
  for (let i = 0; i < poly.length; i++) {
    if (i === at) continue
    const q = poly[i]
    out.push(q[2] === P[2] && q[3] > P[3] ? [q[0], q[1], q[2], q[3] - 1] : q)
  }
  return out
}

/** Whether a triangle of ground [ax, az, bx, bz, cx, cz, l, r] is levelled for paddies l and r (sampled every half cell or so). */
function sweptFits(ctx, [ax, az, bx, bz, cx, cz, l, r]) {
  const { G, gr, minL, chan, pads } = ctx
  const { tex, ti0, tj0, tw, th } = gr
  const L = Math.min(l >= 0 ? pads[l].level : Infinity, r >= 0 ? pads[r].level : Infinity) + 1e-4
  const free = l < 0 || r < 0
  const k = Math.max(1, Math.ceil(Math.max(Math.hypot(bx - ax, bz - az), Math.hypot(cx - ax, cz - az)) / (CELL * 0.5)))
  for (let u = 0; u <= k; u++) {
    for (let v = 0; u + v <= k; v++) {
      const x = ax + ((bx - ax) * u + (cx - ax) * v) / k
      const z = az + ((bz - az) * u + (cz - az) * v) / k
      const ti = Math.floor((x + HALF) / tex - 0.5) - ti0
      const tj = Math.floor((z + HALF) / tex - 0.5) - tj0
      if (ti < 0 || tj < 0 || ti + 1 >= tw || tj + 1 >= th) return false
      const t = tj * tw + ti
      if (minL[t] > L || minL[t + 1] > L || minL[t + tw] > L || minL[t + tw + 1] > L) return false
      if (!free) continue
      const ci = Math.floor((x - G.x0) / CELL)
      const cj = Math.floor((z - G.z0) / CELL)
      if (ci >= 0 && cj >= 0 && ci < G.w && cj < G.h && chan[cj * G.w + ci] === 1) return false
    }
  }
  return true
}

/**
 * Whether any changed segment crosses another outline's, of those listed
 * (the paddies' new outlines in `polys`).
 */
function strays(out, list, edits, polys) {
  for (const { geom, seg } of edits) {
    const a = [geom[2 * seg], geom[2 * seg + 1]]
    const c = [geom[2 * seg + 2], geom[2 * seg + 3]]
    const sx0 = Math.min(a[0], c[0])
    const sx1 = Math.max(a[0], c[0])
    const sz0 = Math.min(a[1], c[1])
    const sz1 = Math.max(a[1], c[1])
    for (const b of list) {
      if (!out[b]) continue
      const Q = (polys.get(b) || out[b]).poly
      for (let q = 0; q < Q.length; q++) {
        const d = Q[q]
        const e = Q[(q + 1) % Q.length]
        if ((d[0] < sx0 && e[0] < sx0) || (d[0] > sx1 && e[0] > sx1) || (d[1] < sz0 && e[1] < sz0) || (d[1] > sz1 && e[1] > sz1)) continue
        if (cross3(a, c, d) * cross3(a, c, e) < -1e-14 && cross3(d, e, a) * cross3(d, e, c) < -1e-14) return true
      }
    }
  }
  return false
}

/**
 * Whether a paddy lies within the patchwork: most of its outline (by its
 * cell edges) shared with other paddies. (One against open ground is cut to
 * the land there, and may keep a corner or two for it.)
 */
function amid(ring) {
  let shared = 0
  let all = 0
  for (const { ch } of ring) {
    const n = ch.v.length - 1
    all += n
    if (ch.l >= 0 && ch.r >= 0) shared += n
  }
  return shared > all * 0.6
}

/** For each box (or null), the boxes that come within m of it, itself among them. */
function nearby(boxes, m) {
  const ids = []
  boxes.forEach((B, a) => B && ids.push(a))
  ids.sort((a, b) => boxes[a][0] - boxes[b][0])
  const around = boxes.map((B, a) => (B ? [a] : []))
  for (let i = 0; i < ids.length; i++) {
    const A = boxes[ids[i]]
    for (let j = i + 1; j < ids.length && boxes[ids[j]][0] <= A[2] + m; j++) {
      const B = boxes[ids[j]]
      if (B[1] > A[3] + m || B[3] < A[1] - m) continue
      around[ids[i]].push(ids[j])
      around[ids[j]].push(ids[i])
    }
  }
  return around
}

/** The bounding box [x0, z0, x1, z1] of a polygon (or of a flat polyline). */
function boxOf(P, flat) {
  let x0 = Infinity
  let z0 = Infinity
  let x1 = -Infinity
  let z1 = -Infinity
  const n = flat ? P.length / 2 : P.length
  for (let k = 0; k < n; k++) {
    const x = flat ? P[2 * k] : P[k][0]
    const z = flat ? P[2 * k + 1] : P[k][1]
    if (x < x0) x0 = x
    if (x > x1) x1 = x
    if (z < z0) z0 = z
    if (z > z1) z1 = z
  }
  return [x0, z0, x1, z1]
}

/**
 * A polygon's points that turn into it by more than 20°, deepest first, as
 * [x, z]; the turn measured to the nearest points either side more than
 * 1.5 m away.
 */
function notchesOf(p) {
  const m = p.length
  const sa = signedArea(p)
  const found = []
  for (let i = 0; i < m; i++) {
    const t = turnAt(p, i, sa)
    if (t < -0.44) found.push([p[i][0], p[i][1], t])
  }
  found.sort((a, b) => a[2] - b[2])
  return found
}

/** A polygon's points that turn out of it by 25° to 70°, mildest first, as [x, z]. */
function mildOf(p) {
  const sa = signedArea(p)
  const found = []
  for (let i = 0; i < p.length; i++) {
    const t = turnAt(p, i, sa)
    if (t > 0.5 && t < 1.22) found.push([p[i][0], p[i][1], t])
  }
  found.sort((a, b) => a[2] - b[2])
  return found
}

/**
 * How many corners a polygon has, to the eye: its outline drawn straight to
 * within 8% of its side (Douglas–Peucker from its two farthest points), and
 * every turn of less than 30° left out.
 */
function cornersOf(p) {
  const m = p.length
  if (m <= 4) return m
  let far = 0
  let best = 0
  for (let k = 1; k < m; k++) {
    const d = (p[k][0] - p[0][0]) ** 2 + (p[k][1] - p[0][1]) ** 2
    if (d > best) {
      best = d
      far = k
    }
  }
  const tol = 0.08 * Math.sqrt(Math.abs(signedArea(p)))
  const keep = new Uint8Array(m + 1)
  keep[0] = keep[far] = keep[m] = 1
  dpKeep(p, keep, 0, far, tol)
  dpKeep(p, keep, far, m, tol)
  const ring = []
  for (let k = 0; k < m; k++) if (keep[k]) ring.push(p[k])
  for (let changed = true; changed && ring.length > 3; ) {
    changed = false
    for (let k = 0; k < ring.length; k++) {
      const a = ring[(k + ring.length - 1) % ring.length]
      const b = ring[k]
      const c = ring[(k + 1) % ring.length]
      const ux = b[0] - a[0]
      const uz = b[1] - a[1]
      const vx = c[0] - b[0]
      const vz = c[1] - b[1]
      if (Math.abs(Math.atan2(ux * vz - uz * vx, ux * vx + uz * vz)) < Math.PI / 6) {
        ring.splice(k, 1)
        changed = true
        break
      }
    }
  }
  return ring.length
}

/** Douglas–Peucker over points a to b of a closed polygon (b may be its length: back to the first). */
function dpKeep(p, keep, a, b, tol) {
  const m = p.length
  const A = p[a % m]
  const B = p[b % m]
  const dx = B[0] - A[0]
  const dz = B[1] - A[1]
  const len = Math.hypot(dx, dz) || 1e-9
  let worst = tol
  let at = -1
  for (let k = a + 1; k < b; k++) {
    const d = Math.abs((p[k][0] - A[0]) * dz - (p[k][1] - A[1]) * dx) / len
    if (d > worst) {
      worst = d
      at = k
    }
  }
  if (at < 0) return
  keep[at] = 1
  dpKeep(p, keep, a, at, tol)
  dpKeep(p, keep, at, b, tol)
}

/** How deep a polygon's notches are, all told: the turns into it past 15°, in radians. */
function notchDepth(p) {
  const sa = signedArea(p)
  let d = 0
  for (let i = 0; i < p.length; i++) {
    const t = turnAt(p, i, sa)
    if (t < -0.26) d -= t + 0.26
  }
  return d
}

/** The turn at a polygon's point i (radians; negative into the polygon), to its nearest points either side over 1.5 m away. */
function turnAt(p, i, sa) {
  const m = p.length
  const V = p[i]
  let a = (i + m - 1) % m
  while (a !== i && Math.hypot(p[a][0] - V[0], p[a][1] - V[1]) < 0.015) a = (a + m - 1) % m
  let b = (i + 1) % m
  while (b !== i && Math.hypot(p[b][0] - V[0], p[b][1] - V[1]) < 0.015) b = (b + 1) % m
  if (a === i || b === i || a === b) return 0
  const ux = V[0] - p[a][0]
  const uz = V[1] - p[a][1]
  const vx = p[b][0] - V[0]
  const vz = p[b][1] - V[1]
  const t = Math.atan2(ux * vz - uz * vx, ux * vx + uz * vz)
  return sa > 0 ? t : -t
}

/**
 * Draw a stretch one step plainer: a shared one thinned off its cells and
 * then straight off them; one against open ground less straight, and then
 * straight off its cells. False if it is as plain as it gets.
 */
function plainer(ctx, M, ch) {
  const shared = ch.l >= 0 && ch.r >= 0
  if (ch.lv >= (shared ? 2 : FREE.length)) return false
  ch.lv++
  if (shared) drawShared(ctx, M, ch)
  return true
}

/** A shared stretch's line, drawn as plainly as its level (see plainer) asks. */
function drawShared(ctx, M, ch) {
  const raw = rawLine(ctx.G, M, ch)
  ch.geom = ch.lv === 0 ? sharedLine(ctx, M, ch) : ch.lv === 1 ? thinned(ctx, raw, CELL * 0.5, ch.l, ch.r, true) : raw
}

/**
 * The start of each segment of a polygon that crosses another of its
 * segments, or turns straight back on the one before; null if none do.
 */
function selfCrossing(poly) {
  const m = poly.length
  if (m < 3) return [0]
  let bad = null
  for (let i = 0; i < m; i++) {
    const a = poly[i]
    const b = poly[(i + 1) % m]
    const p = poly[(i + m - 1) % m]
    const ux = a[0] - p[0]
    const uz = a[1] - p[1]
    const vx = b[0] - a[0]
    const vz = b[1] - a[1]
    if (ux * vx + uz * vz < 0 && Math.abs(ux * vz - uz * vx) < 0.05 * Math.hypot(ux, uz) * Math.hypot(vx, vz)) (bad ||= []).push((i + m - 1) % m, i)
    // (the segments beyond it whose boxes meet its own)
    const sx0 = Math.min(a[0], b[0])
    const sx1 = Math.max(a[0], b[0])
    const sz0 = Math.min(a[1], b[1])
    const sz1 = Math.max(a[1], b[1])
    for (let j = i + 2; j < m; j++) {
      if (i === 0 && j === m - 1) continue
      const c = poly[j]
      const d = poly[(j + 1) % m]
      if ((c[0] < sx0 && d[0] < sx0) || (c[0] > sx1 && d[0] > sx1) || (c[1] < sz0 && d[1] < sz0) || (c[1] > sz1 && d[1] > sz1)) continue
      if (cross3(a, b, c) * cross3(a, b, d) < 0 && cross3(c, d, a) * cross3(c, d, b) < 0) (bad ||= []).push(i, j)
    }
  }
  return bad
}

const cross3 = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])

/**
 * The stretches of outlines that cross another paddy's, in pairs (one from
 * each), among the pairs with an outline drawn since the last look
 * (`fresh`). They share their banks exactly, so this only happens where a
 * stretch against open ground, or one drawn off the cells, strays across
 * one nearby.
 */
function crossings(out, fresh) {
  const boxes = []
  out.forEach((o, a) => {
    if (!o) return
    let x0 = Infinity
    let x1 = -Infinity
    let z0 = Infinity
    let z1 = -Infinity
    for (const q of o.poly) {
      if (q[0] < x0) x0 = q[0]
      if (q[0] > x1) x1 = q[0]
      if (q[1] < z0) z0 = q[1]
      if (q[1] > z1) z1 = q[1]
    }
    boxes.push({ a, x0, x1, z0, z1 })
  })
  boxes.sort((p, q) => p.x0 - q.x0)
  const found = []
  for (let i = 0; i < boxes.length; i++) {
    const A = boxes[i]
    for (let j = i + 1; j < boxes.length && boxes[j].x0 <= A.x1; j++) {
      const B = boxes[j]
      if (B.z0 > A.z1 || B.z1 < A.z0 || !(fresh.has(A.a) || fresh.has(B.a))) continue
      const P = out[A.a].poly
      const Q = out[B.a].poly
      for (let p = 0; p < P.length; p++) {
        const a = P[p]
        const b = P[(p + 1) % P.length]
        if (Math.max(a[0], b[0]) < B.x0 || Math.min(a[0], b[0]) > B.x1 || Math.max(a[1], b[1]) < B.z0 || Math.min(a[1], b[1]) > B.z1) continue
        const sx0 = Math.min(a[0], b[0])
        const sx1 = Math.max(a[0], b[0])
        const sz0 = Math.min(a[1], b[1])
        const sz1 = Math.max(a[1], b[1])
        for (let q = 0; q < Q.length; q++) {
          const c = Q[q]
          const d = Q[(q + 1) % Q.length]
          if ((c[0] < sx0 && d[0] < sx0) || (c[0] > sx1 && d[0] > sx1) || (c[1] < sz0 && d[1] < sz0) || (c[1] > sz1 && d[1] > sz1)) continue
          if (cross3(a, b, c) * cross3(a, b, d) < -1e-14 && cross3(c, d, a) * cross3(c, d, b) < -1e-14) found.push({ a: A.a, b: B.a, chs: [out[A.a].ring[a[2]].ch, out[B.a].ring[c[2]].ch] })
        }
      }
    }
  }
  return found
}

/** A stretch against open ground, as straight as it may be drawn to within tol (one of FREE). */
function freeLine(ctx, M, ch, tol) {
  // (drawn again only if its junctions have moved since: a junction that
  // moves is given a new point, so the old one tells)
  const k = FREE.indexOf(tol)
  const A = ch.closed ? null : M.pos.get(ch.v[0])
  const B = ch.closed ? null : M.pos.get(ch.v[ch.v.length - 1])
  const memo = (ch.drawn ||= [null, null, null])[k]
  if (memo && memo.A === A && memo.B === B) return memo.out
  const raw = rawLine(ctx.G, M, ch)
  const a = ch.l >= 0 ? ch.l : ch.r
  let out = null
  if (ch.closed) out = closedLine(ctx, raw, tol, a, -1)
  else if (tol > 0) {
    out = crisp(raw, inward(ctx.G, M, ch, raw, k === 0 ? ch.runs : runsOf(raw, tol), a))
    if (!allFit(ctx, out, a, -1)) out = null
  }
  if (!out) out = thinned(ctx, raw, tol, a, -1, true)
  ch.drawn[k] = { A, B, out }
  return out
}

/**
 * A free stretch's runs with each line moved in toward paddy a until no
 * point of the run lies more than a fifth of a cell outside it: the edge of
 * a paddy against open ground is drawn along the inside of its cells, so
 * that a straight bank never stands out over ground it doesn't hold.
 */
function inward(G, M, ch, P, runs, a) {
  // which side of the chain the paddy lies on, from its first edge
  edgeCells(ch.v[0], ch.v[1], M.W1, G.w, LR)
  const c = a === ch.l ? LR[0] : LR[1]
  cornerAt(G, M.W1, ch.v[0], XZ)
  const ex = G.x0 + (ch.v[1] % M.W1) * CELL - XZ[0]
  const ez = G.z0 + ((ch.v[1] / M.W1) | 0) * CELL - XZ[1]
  const side = Math.sign(ex * (G.z0 + (((c / G.w) | 0) + 0.5) * CELL - XZ[1]) - ez * (G.x0 + ((c % G.w) + 0.5) * CELL - XZ[0]))
  return runs.map(({ a: ra, b: rb, line }) => {
    // the line's direction along the chain
    let ux = line.nx
    let uz = line.nz
    if (ux * (P[2 * rb] - P[2 * ra]) + uz * (P[2 * rb + 1] - P[2 * ra + 1]) < 0) {
      ux = -ux
      uz = -uz
    }
    let out = 0
    for (let k = ra; k <= rb; k++) out = Math.max(out, -side * (ux * (P[2 * k + 1] - line.z) - uz * (P[2 * k] - line.x)))
    const d = Math.max(0, out - CELL * 0.2) * side
    return { a: ra, b: rb, line: { x: line.x - uz * d, z: line.z + ux * d, nx: ux, nz: uz } }
  })
}

/**
 * Paddy a's outer boundary as a ring of chains, each walked with the paddy
 * on its left ({ ch, rev }); null if it has none. (A paddy can touch itself
 * at a corner: there the ring turns into the paddy, so it comes apart into
 * loops, and the largest is the outside.)
 */
function outerRing(M, chains, a) {
  const loops = []
  const from = new Map()
  for (const ch of chains) {
    if (ch.l === a && ch.r === a) continue
    const rev = ch.r === a
    if (ch.closed) {
      loops.push([{ ch, rev }])
      continue
    }
    const s = rev ? ch.v[ch.v.length - 1] : ch.v[0]
    const list = from.get(s)
    if (list) list.push({ ch, rev })
    else from.set(s, [{ ch, rev }])
  }
  const done = new Set()
  for (const list of from.values()) {
    for (const first of list) {
      if (done.has(first)) continue
      const loop = []
      let cur = first
      while (cur && !done.has(cur)) {
        done.add(cur)
        loop.push(cur)
        const v = cur.ch.v
        const e = cur.rev ? v[0] : v[v.length - 1]
        const cand = (from.get(e) || []).filter((c) => !done.has(c))
        if (cand.length <= 1) cur = cand[0]
        else {
          // the turn into the paddy: left, then straight on, then right
          const din = dirOf(cur.rev ? v[1] - v[0] : v[v.length - 1] - v[v.length - 2], M.W1)
          let best = null
          let bt = 9
          for (const c of cand) {
            const u = c.ch.v
            const dout = dirOf(c.rev ? u[u.length - 2] - u[u.length - 1] : u[1] - u[0], M.W1)
            const turn = (dout - din + 5) & 3 // 0 left, 1 straight, 2 right
            if (turn < bt) {
              bt = turn
              best = c
            }
          }
          cur = best
        }
      }
      loops.push(loop)
    }
  }
  if (loops.length === 1) return loops[0]
  let best = null
  let ba = -1
  for (const loop of loops) {
    // (its area on the grid, from the corners: each chain's direction doesn't matter, its edges' do)
    let A = 0
    for (const { ch, rev } of loop) {
      const v = ch.v
      for (let k = 1; k < v.length; k++) {
        const p = v[k - 1]
        const q = v[k]
        A += ((p % M.W1) * ((q / M.W1) | 0) - (q % M.W1) * ((p / M.W1) | 0)) * (rev ? -1 : 1)
      }
    }
    A = Math.abs(A)
    if (A > ba) {
      ba = A
      best = loop
    }
  }
  return best
}

/** The direction (0 east, 1 south, 2 west, 3 north) of a step between corners. */
function dirOf(d, W1) {
  return d === 1 ? 0 : d === W1 ? 1 : d === -1 ? 2 : 3
}

/**
 * A ring of chains as one polygon [[x, z, r, k], …], each chain's points
 * from line(ch) (flat, first to last): r the ring's chain the point starts a
 * segment of, k its place along that chain as the ring walks it (0: the
 * junction it starts from).
 */
function ringPoints(ring, line) {
  const out = []
  for (let r = 0; r < ring.length; r++) {
    const { ch, rev } = ring[r]
    const P = line(ch)
    const m = P.length / 2
    // (a chain's last point is the next one's first; a closed chain's is its own first)
    const last = ch.closed ? m : m - 1
    for (let k = 0; k < last; k++) {
      const q = rev ? (ch.closed ? (m - k) % m : m - 1 - k) : k
      const x = P[2 * q]
      const z = P[2 * q + 1]
      const prev = out[out.length - 1]
      if (!prev || Math.abs(prev[0] - x) + Math.abs(prev[1] - z) > 1e-7) out.push([x, z, r, k])
    }
  }
  if (out.length > 1 && Math.abs(out[0][0] - out[out.length - 1][0]) + Math.abs(out[0][1] - out[out.length - 1][1]) < 1e-7) out.pop()
  return out
}

function signedArea(poly) {
  let a = 0
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i]
    const q = poly[(i + 1) % poly.length]
    a += p[0] * q[1] - q[0] * p[1]
  }
  return a / 2
}

/**
 * A ring that passes twice through one point (two corners placed together)
 * is two loops pinched there: the larger.
 */
function unpinch(p) {
  for (let i = 0; i < p.length; i++) {
    for (let j = i + 2; j < p.length; j++) {
      if (i === 0 && j === p.length - 1) continue
      if (Math.abs(p[i][0] - p[j][0]) + Math.abs(p[i][1] - p[j][1]) > 1e-7) continue
      const a = unpinch(p.slice(i, j))
      const b = unpinch(p.slice(j).concat(p.slice(0, i)))
      return Math.abs(signedArea(a)) >= Math.abs(signedArea(b)) ? a : b
    }
  }
  return p
}

/**
 * The ground edits that level each paddy, never into a trench: every texel
 * is levelled to the water of the lowest paddy that needs it (see stamps;
 * the upper paddy's bank wall stands on it). Texels under a paddy are
 * levelled outright (cut, or a little fill); those just outside are only
 * ever lowered.
 */
function carvePlan(G, minL, owner, chan, gr, height, N2) {
  const { x0, z0, w, h } = G
  const { tex, ti0, tj0, tw, th } = gr
  const idx = []
  const val = []
  const fill = []
  for (let j = 0; j < th; j++) {
    for (let i = 0; i < tw; i++) {
      const t = j * tw + i
      if (minL[t] === Infinity) continue
      const fi = Math.floor((-HALF + (ti0 + i + 0.5) * tex - x0) / CELL)
      const fj = Math.floor((-HALF + (tj0 + j + 0.5) * tex - z0) / CELL)
      const c = fi >= 0 && fj >= 0 && fi < w && fj < h ? fj * w + fi : -1
      // a texel under a paddy, well clear of any channel, may be filled
      const f = c >= 0 && owner[c] >= 0 && !chanNear(chan, w, h, fi, fj, 4)
      const g = (tj0 + j) * N2 + ti0 + i
      idx.push(g)
      val.push(f ? Math.min(minL[t] - DEPTH, height[g] + MAX_FILL) : minL[t] - DEPTH)
      fill.push(f ? 1 : 0)
    }
  }
  return { idx: Int32Array.from(idx), val: Float32Array.from(val), fill: Uint8Array.from(fill) }
}

/**
 * One bank's ʻauwai: off the stream above its top paddies, along the outer
 * edge of its terraces, and back into the stream below the last. Points are
 * [x, z, water level in metres], never rising toward the return.
 */
function ditch(G, paddies, side, axis, near) {
  const { x0, z0, w } = G
  const mine = paddies.filter((p) => p.side === side)
  if (mine.length < 6) return null
  // outermost terraced cell per axis point on this side, and its level
  const reach = new Float32Array(axis.length).fill(-1)
  const lev = new Float32Array(axis.length).fill(-Infinity)
  for (const p of mine) {
    for (let u = 0; u < p.cells.length; u++) {
      const c = p.cells[u]
      const k = near[c]
      const a = axis[k]
      const d = (x0 + ((c % w) + 0.5) * CELL - a.x) * a.nx + (z0 + (((c / w) | 0) + 0.5) * CELL - a.z) * a.nz
      if (d * side > reach[k]) reach[k] = d * side
      if (p.level > lev[k]) lev[k] = p.level
    }
  }
  let ka = -1
  let kb = -1
  for (let k = 0; k < axis.length; k++) {
    if (reach[k] < 0) continue
    if (ka < 0) ka = k
    kb = k
  }
  if (kb - ka < 12) return null
  // hold the line out past every paddy near it, then ease it
  const W0 = new Float32Array(axis.length)
  for (let k = ka; k <= kb; k++) {
    let m = 0
    for (let q = Math.max(ka, k - 4); q <= Math.min(kb, k + 4); q++) m = Math.max(m, reach[q])
    W0[k] = m
  }
  const pts = []
  let lvl = -Infinity
  for (let k = kb; k >= ka; k -= 2) {
    let m = 0
    let wsum = 0
    for (let q = Math.max(ka, k - 3); q <= Math.min(kb, k + 3); q++) {
      m += W0[q]
      wsum++
    }
    const off = Math.max(W0[k], m / wsum) + 0.07
    const a = axis[k]
    if (lev[k] > -Infinity) lvl = Math.max(lvl, lev[k] + 0.4)
    pts.push([a.x + a.nx * side * off, a.z + a.nz * side * off, lvl])
  }
  // from the intake upstream, to the return below
  const top = axis[Math.min(axis.length - 1, kb + 6)]
  const bot = axis[Math.max(0, ka - 4)]
  pts.unshift([top.x, top.z, Math.max(lvl, top.bed + 0.2)])
  pts.push([bot.x, bot.z, bot.bed + 0.2])
  // water runs downhill: never rising toward the return
  for (let q = 1; q < pts.length; q++) pts[q][2] = Math.min(pts[q][2], pts[q - 1][2])
  const smooth = chaikin(pts.map((q) => [q[0], q[1]]), 2)
  // carry the levels over to the smoothed line, which has the same ends
  return smooth.map((q, idx) => {
    const t = (idx / (smooth.length - 1)) * (pts.length - 1)
    const a = pts[Math.floor(t)]
    const b = pts[Math.min(pts.length - 1, Math.floor(t) + 1)]
    const lvq = a[2] + (b[2] - a[2]) * (t - Math.floor(t))
    return [Math.round(q[0] * 1000) / 1000, Math.round(q[1] * 1000) / 1000, Math.round(lvq * 100) / 100]
  })
}

/**
 * Separable box blur of radius r cells over a w×h grid, within box (the
 * whole grid by default; edges clamped to it, zero outside it).
 */
function boxBlur(src, w, h, r, box = [0, 0, w - 1, h - 1]) {
  const [i0, j0, i1, j1] = box
  const tmp = new Float32Array(w * h)
  const out = new Float32Array(w * h)
  const k = 1 / (2 * r + 1)
  for (let j = j0; j <= j1; j++) {
    const row = j * w
    let s = 0
    for (let d = -r; d <= r; d++) s += src[row + Math.min(i1, Math.max(i0, i0 + d))]
    for (let i = i0; i <= i1; i++) {
      tmp[row + i] = s * k
      s += src[row + Math.min(i1, i + r + 1)] - src[row + Math.max(i0, i - r)]
    }
  }
  for (let i = i0; i <= i1; i++) {
    let s = 0
    for (let d = -r; d <= r; d++) s += tmp[Math.min(j1, Math.max(j0, j0 + d)) * w + i]
    for (let j = j0; j <= j1; j++) {
      out[j * w + i] = s * k
      s += tmp[Math.min(j1, j + r + 1) * w + i] - tmp[Math.max(j0, j - r) * w + i]
    }
  }
  return out
}

/** The biggest 4-connected group among `cells` (G.mark is scratch, two generations a call). */
function largestPart(G, cells) {
  const nb = G.nb
  const mark = G.mark || (G.mark = new Int32Array(G.n))
  const gen = (G.gen = (G.gen || 0) + 2)
  for (let k = 0; k < cells.length; k++) mark[cells[k]] = gen
  let best = []
  for (const c0 of cells) {
    if (mark[c0] !== gen) continue
    const part = [c0]
    mark[c0] = gen + 1
    for (let q = 0; q < part.length; q++) {
      for (let e = 0; e < 4; e++) {
        const d = part[q] + nb[e]
        if (mark[d] === gen) {
          mark[d] = gen + 1
          part.push(d)
        }
      }
    }
    if (part.length > best.length) best = part
  }
  return best
}

/**
 * Pull a simple polygon's outline in by d: each side moved in square to
 * itself, with a corner where two moved sides meet; a short side that its
 * neighbours close over (they converge past it) is dropped, and they meet
 * instead. Null if it collapses.
 */
function inset(poly, d) {
  const n0 = poly.length
  const a0 = polyCentroid(poly).area
  let sa = 0
  for (let i = 0; i < n0; i++) sa += poly[i][0] * poly[(i + 1) % n0][1] - poly[(i + 1) % n0][0] * poly[i][1]
  const sg = sa > 0 ? 1 : -1
  // each side as a line moved in: a point on it, and its direction
  const L = []
  for (let i = 0; i < n0; i++) {
    const a = poly[i]
    const b = poly[(i + 1) % n0]
    const l = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (l < 1e-9) continue
    const dx = (b[0] - a[0]) / l
    const dz = (b[1] - a[1]) / l
    L.push({ x: a[0] - dz * sg * d, z: a[1] + dx * sg * d, dx, dz })
  }
  while (L.length >= 3) {
    const n = L.length
    const Q = new Array(n)
    for (let i = 0; i < n; i++) {
      const A = L[(i + n - 1) % n]
      const B = L[i]
      const det = A.dx * B.dz - A.dz * B.dx
      if (Math.abs(det) < 1e-9) Q[i] = [B.x, B.z]
      else {
        const t = ((B.x - A.x) * B.dz - (B.z - A.z) * B.dx) / det
        Q[i] = [A.x + A.dx * t, A.z + A.dz * t]
      }
    }
    // a side that now runs backwards has been closed over
    let drop = -1
    let worst = -1e-9
    for (let i = 0; i < n; i++) {
      const p = Q[i]
      const q = Q[(i + 1) % n]
      const along = (q[0] - p[0]) * L[i].dx + (q[1] - p[1]) * L[i].dz
      if (along < worst) {
        worst = along
        drop = i
      }
    }
    if (drop < 0) {
      let sb = 0
      for (let i = 0; i < n; i++) sb += Q[i][0] * Q[(i + 1) % n][1] - Q[(i + 1) % n][0] * Q[i][1]
      return sb * sa > 0 && polyCentroid(Q).area > a0 * 0.35 ? Q : null
    }
    L.splice(drop, 1)
  }
  return null
}

function chanNear(chan, w, h, i, j, r) {
  for (let dj = -r; dj <= r; dj++) {
    for (let di = -r; di <= r; di++) {
      const ii = i + di
      const jj = j + dj
      if (ii >= 0 && jj >= 0 && ii < w && jj < h && chan[jj * w + ii]) return true
    }
  }
  return false
}

/** Press the loʻi into the land: level the ground under each paddy's water. */
export function carveTerraces(height, loi) {
  for (const complex of loi) {
    const { idx, val, fill } = complex.cut
    for (let q = 0; q < idx.length; q++) {
      const c = idx[q]
      if (fill[q]) height[c] = val[q]
      else if (height[c] > val[q]) height[c] = val[q]
    }
  }
}
