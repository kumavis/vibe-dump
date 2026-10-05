// Loʻi kalo laid the way the land asks for them.
//
// A valley's terraces are read off its floor rather than ruled onto it. The
// arable ground is the gentle floor near the trunk stream, low enough for an
// ʻauwai to reach and clear of the channel itself. That ground is cut into
// terrace bands by height — each band a strip between two contours of the
// floor's broad shape, a metre or a few apart, so the terraces bend round the
// valley and narrow where it steepens — and each band into paddies by
// cross-banks and by the stream. Every paddy takes its water level from its own
// ground and is traced as a polygon: wedges, crescents and long strips of every
// size, as real loʻi are. The ground under them is levelled to their water,
// never more than a few metres of cut or fill, and the channel is left alone so
// the stream keeps its own descending bed through the complex.

import { WORLD, HALF } from '../config.js'
import { sample } from './grid.js'
import { chaikin, simplify } from './division.js'

const CELL = 0.05 // fine grid, world units (5 m): paddies are a few cells to a few dozen across
// m between terrace levels: low steps on the flat floor, taller ones as the
// ground steepens, so no terrace is narrower than about 20 m
const stepFor = (slope) => Math.min(4.5, Math.max(1.3, slope * 20))
const DEPTH = 0.3 // m of water and mud over the levelled floor
const BANK = 0.014 // the kuāuna between two paddies, world units (1.4 m)
const MAX_CUT = 3.5 // m: the most ground is ever cut to level a paddy
const MAX_FILL = 1.5 // m: and the most it is ever built up
const FLOAT = 2.5 // m: the deepest water may stand over a hollow in a paddy
const MAX_W = 1.9 // furthest out from the trunk a paddy may lie
// An ʻauwai can water ground lower than the stream a little way upstream,
// where its intake is: from just above the bed here to the bed this far up.
const INTAKE = 4.5
const SLOPE = 0.22 // steepest ground (m/m, smoothed) worth terracing
const MIN_CELLS = 8 // the smallest paddy, in cells (200 m²)
const SEED = 0.27 // mean spacing of the cross-banks, world units

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
 * Closed outlines of the cells where `inside(i, j)` holds on a w×h grid, by
 * marching squares over the cell centres (so an outline runs half a cell
 * outside its cells). Diagonal-only contacts stay apart, as the regions are
 * 4-connected. Returns loops of [i, j] in cell units, longest first.
 */
function outlines(w, h, inside) {
  const at = (i, j) => (i >= 0 && j >= 0 && i < w && j < h && inside(i, j) ? 1 : 0)
  // edge midpoints: horizontal edge (i,j)-(i+1,j) and vertical edge (i,j)-(i,j+1)
  const W = w + 2
  const hKey = (i, j) => ((j + 1) * W + (i + 1)) * 2
  const vKey = (i, j) => ((j + 1) * W + (i + 1)) * 2 + 1
  const pos = (k) => {
    const c = k >> 1
    const i = (c % W) - 1
    const j = ((c / W) | 0) - 1
    return k & 1 ? [i, j + 0.5] : [i + 0.5, j]
  }
  const next = new Map()
  const link = (a, b) => next.set(a, b)
  for (let j = -1; j < h; j++) {
    for (let i = -1; i < w; i++) {
      const a = at(i, j)
      const b = at(i + 1, j)
      const c = at(i + 1, j + 1)
      const d = at(i, j + 1)
      const code = a | (b << 1) | (c << 2) | (d << 3)
      if (code === 0 || code === 15) continue
      const T = hKey(i, j) // top: a–b
      const R = vKey(i + 1, j) // right: b–c
      const B = hKey(i, j + 1) // bottom: d–c
      const L = vKey(i, j) // left: a–d
      // segments run with the inside on the left
      switch (code) {
        case 1: link(T, L); break
        case 2: link(R, T); break
        case 3: link(R, L); break
        case 4: link(B, R); break
        case 5: link(T, L); link(B, R); break // a and c only: kept apart
        case 6: link(B, T); break
        case 7: link(B, L); break
        case 8: link(L, B); break
        case 9: link(T, B); break
        case 10: link(R, T); link(L, B); break // b and d only: kept apart
        case 11: link(R, B); break
        case 12: link(L, R); break
        case 13: link(T, R); break
        case 14: link(L, T); break
      }
    }
  }
  const loops = []
  const seen = new Set()
  for (const start of next.keys()) {
    if (seen.has(start)) continue
    const loop = []
    let k = start
    while (k !== undefined && !seen.has(k)) {
      seen.add(k)
      loop.push(pos(k))
      k = next.get(k)
    }
    if (loop.length >= 4) loops.push(loop)
  }
  return loops.sort((p, q) => q.length - p.length)
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
 * the engine optimises small hot loops far sooner than one long one.)
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
  const slope = blurred(slopeOf(hs, G.w, G.h), G.w, G.h, 1, 2)
  const homes = houses.filter((p) => p.x > G.x0 - 0.2 && p.x < G.x1 + 0.2 && p.z > G.z0 - 0.2 && p.z < G.z1 + 0.2)
  const mask = despeck(arable(G, { axis, k0, k1, near, chan, slope, hs, ground, homes, label, id }), G.w, G.h)

  // terrace bands, split into paddies by cross-banks: the seeds for the
  // cross-banks first, then the bands
  const seeds = seedsFor(G, rand)
  const { key, band } = bandsOf(G, mask, hs, seeds, rand())
  const { comp, pieces } = piecesOf(G, key, band)
  mergeSlivers(G, comp, pieces)
  const win = windowsOf(G, mask, hs, height, N2)
  const live = settle(G, mask, comp, pieces, win, hs)
  const { paddies, owner } = trace(G, comp, pieces, live, axis, near)
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
  const cut = carvePlan(G, paddies, owner, chan, ground, height, N2)
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
  for (let k = Math.max(0, k0 - 6); k <= Math.min(axis.length - 1, k1 + 6); k += 3) {
    const a = axis[k]
    const ai = Math.round((a.x - x0) / CELL - 0.5)
    const aj = Math.round((a.z - z0) / CELL - 0.5)
    const jA = Math.max(0, aj - R)
    const jB = Math.min(h - 1, aj + R)
    const iA = Math.max(0, ai - R)
    const iB = Math.min(w - 1, ai + R)
    for (let j = jA; j <= jB; j++) {
      const dz = z0 + (j + 0.5) * CELL - a.z
      const dz2 = dz * dz
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
  return near
}

/** The stream channels (every drawn line, not just the trunk), kept clear. */
function channels(G, lines) {
  const { x0, z0, x1, z1, w, h, n } = G
  const chan = new Uint8Array(n)
  for (const l of lines) {
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

/** The smoothed ground at every cell. */
function smoothed(G, gr) {
  const hs = new Float32Array(G.n)
  for (let j = 0; j < G.h; j++) for (let i = 0; i < G.w; i++) hs[j * G.w + i] = local(gr, gr.sm, G.x0 + (i + 0.5) * CELL, G.z0 + (j + 0.5) * CELL)
  return hs
}

/** Slope (m/m) of a field of heights on the fine grid. */
function slopeOf(f, w, h) {
  const out = new Float32Array(w * h)
  for (let j = 1; j < h - 1; j++) {
    for (let i = 1; i < w - 1; i++) {
      const c = j * w + i
      const gx = f[c + 1] - f[c - 1]
      const gz = f[c + w] - f[c - w]
      out[c] = Math.sqrt(gx * gx + gz * gz) / (2 * CELL * 100)
    }
  }
  return out
}

function blurred(f, w, h, r, passes) {
  for (let pass = 0; pass < passes; pass++) f = boxBlur(f, w, h, r)
  return f
}

/** Cells fit to terrace (see the constants at the top). */
function arable(G, { axis, k0, k1, near, chan, slope, hs, ground, homes, label, id }) {
  const { x0, z0, w, h, n } = G
  const mask = new Uint8Array(n)
  const reach = Math.round(INTAKE * 10)
  for (let j = 1; j < h - 1; j++) {
    for (let i = 1; i < w - 1; i++) {
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
    }
  }
  return mask
}

/** Drop specks and whiskers: cells with fewer than two terraced neighbours. */
function despeck(mask, w, h) {
  for (let pass = 0; pass < 2; pass++) {
    const out = new Uint8Array(w * h)
    for (let j = 1; j < h - 1; j++) {
      for (let i = 1; i < w - 1; i++) {
        const c = j * w + i
        out[c] = mask[c] && mask[c - 1] + mask[c + 1] + mask[c - w] + mask[c + w] >= 2 ? 1 : 0
      }
    }
    mask = out
  }
  return mask
}

/**
 * Seeds for the cross-banks: a jittered lattice with a few dropped (big
 * paddies) and a few doubled (small ones), bucketed by lattice cell.
 */
function seedsFor(G, rand) {
  const sw = Math.ceil((G.x1 - G.x0) / SEED) + 1
  const sh = Math.ceil((G.z1 - G.z0) / SEED) + 1
  const xs = []
  const zs = []
  const start = new Int32Array(sw * sh + 1)
  for (let j = 0; j < sh; j++) {
    for (let i = 0; i < sw; i++) {
      start[j * sw + i] = xs.length
      const r = rand()
      const count = r < 0.22 ? 0 : r < 0.42 ? 2 : 1
      for (let q = 0; q < count; q++) {
        xs.push(G.x0 + (i + rand()) * SEED)
        zs.push(G.z0 + (j + rand()) * SEED)
      }
    }
  }
  start[sw * sh] = xs.length
  return { sw, sh, start, xs: Float64Array.from(xs), zs: Float64Array.from(zs) }
}

function nearestSeed(G, S, x, z) {
  const si = Math.floor((x - G.x0) / SEED)
  const sj = Math.floor((z - G.z0) / SEED)
  let best = -1
  let bd = Infinity
  for (let dj = -2; dj <= 2; dj++) {
    const j = sj + dj
    if (j < 0 || j >= S.sh) continue
    for (let di = -2; di <= 2; di++) {
      const i = si + di
      if (i < 0 || i >= S.sw) continue
      const b = j * S.sw + i
      for (let q = S.start[b]; q < S.start[b + 1]; q++) {
        const dx = S.xs[q] - x
        const dz = S.zs[q] - z
        const d = dx * dx + dz * dz
        if (d < bd) {
          bd = d
          best = q
        }
      }
    }
  }
  return best
}

/**
 * Each terraced cell's band and paddy key (band × nearest cross-bank seed).
 * The bands follow the floor's broad shape, not every hummock on it (each
 * paddy still takes its level from its own ground): the ground eased over
 * ~50 m, quantised by a step that grows with its slope.
 */
function bandsOf(G, mask, hs, S, phase) {
  const { x0, z0, w, h, n } = G
  const broad = blurred(hs, w, h, 5, 2)
  const broadSlope = slopeOf(broad, w, h)
  const key = new Int32Array(n).fill(-1)
  const band = new Int32Array(n)
  for (let c = 0; c < n; c++) {
    if (!mask[c]) continue
    const b = Math.floor(broad[c] / stepFor(broadSlope[c]) + phase)
    band[c] = b
    key[c] = nearestSeed(G, S, x0 + ((c % w) + 0.5) * CELL, z0 + (((c / w) | 0) + 0.5) * CELL) * 4096 + (b & 4095)
  }
  return { key, band }
}

/** Connected pieces of one band and one seed: the paddies-to-be. */
function piecesOf(G, key, band) {
  const { n, nb } = G
  const comp = new Int32Array(n).fill(-1)
  const pieces = []
  const stack = []
  for (let c0 = 0; c0 < n; c0++) {
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
 * Slivers join the neighbour they touch most (one in their own band if they
 * can: the level stays truer), or are dropped.
 */
function mergeSlivers(G, comp, pieces) {
  const nb = G.nb
  for (const p of pieces) {
    if (p.cells.length >= 16 || p.cells.length === 0) continue
    const touch = new Map()
    const me = comp[p.cells[0]]
    for (const c of p.cells) {
      for (let e = 0; e < 4; e++) {
        const q = comp[c + nb[e]]
        if (q >= 0 && q !== me && pieces[q].cells.length) touch.set(q, (touch.get(q) || 0) + (pieces[q].band === p.band ? 8 : 1))
      }
    }
    let best = -1
    let bt = 0
    for (const [q, t] of touch) {
      if (t > bt) {
        bt = t
        best = q
      }
    }
    if (best >= 0) {
      for (const c of p.cells) comp[c] = best
      pieces[best].cells.push(...p.cells)
    } else for (const c of p.cells) comp[c] = -1
    p.cells = []
  }
}

/**
 * The window of water levels each cell can sit under: no texel round it may
 * need more than MAX_CUT taken off to get under the water (lo), and its
 * ground may be no more than FLOAT below it (hi: the water may stand over a
 * hollow, held by the bank, but not perched far above it).
 */
function windowsOf(G, mask, hs, height, N2) {
  const { x0, z0, w, n } = G
  const tex = WORLD / N2
  const lo = new Float32Array(n)
  const hi = new Float32Array(n)
  for (let c = 0; c < n; c++) {
    if (!mask[c]) continue
    const ti = Math.max(1, Math.min(N2 - 2, Math.round((x0 + ((c % w) + 0.5) * CELL + HALF) / tex - 0.5)))
    const tj = Math.max(1, Math.min(N2 - 2, Math.round((z0 + (((c / w) | 0) + 0.5) * CELL + HALF) / tex - 0.5)))
    let top = -Infinity
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) top = Math.max(top, height[(tj + dj) * N2 + ti + di])
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
  const { n, nb } = G
  const { lo, hi } = win
  const fits = (c, L) => lo[c] <= L && L <= hi[c]
  const live = []
  for (let pid = 0; pid < pieces.length; pid++) {
    const p = pieces[pid]
    p.cells = p.cells.filter((c) => comp[c] === pid)
    if (p.cells.length < MIN_CELLS) {
      for (const c of p.cells) comp[c] = -1
      p.cells = []
      continue
    }
    p.level = levelFor(p.cells, win, hs)
    for (const c of p.cells) if (!fits(c, p.level)) comp[c] = -1
    p.cells = p.cells.filter((c) => comp[c] === pid)
    live.push(pid)
  }
  const grow = () => {
    let free = []
    for (let c = 0; c < n; c++) if (mask[c] && comp[c] < 0) free.push(c)
    for (let round = 0; round < 6; round++) {
      let moved = 0
      for (const c of free) {
        if (comp[c] >= 0) continue
        for (let e = 0; e < 4; e++) {
          const q = comp[c + nb[e]]
          if (q >= 0 && fits(c, pieces[q].level)) {
            comp[c] = q
            pieces[q].cells.push(c)
            moved++
            break
          }
        }
      }
      if (!moved) break
      free = free.filter((c) => comp[c] < 0)
    }
  }
  grow()
  // what's left over gathers into paddies of its own where it can
  for (let c0 = 0; c0 < n; c0++) {
    if (!mask[c0] || comp[c0] >= 0) continue
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
    const cells = part.length >= MIN_CELLS ? part.filter((c) => fits(c, L)) : []
    for (const c of part) comp[c] = -3 // looked at
    if (cells.length >= MIN_CELLS) {
      for (const c of cells) comp[c] = pid
      pieces.push({ cells, band: -1, level: L })
      live.push(pid)
    }
  }
  for (let c = 0; c < n; c++) if (comp[c] === -3) comp[c] = -1
  grow()
  return live
}

/** Trace each paddy's outline: smoothed, and pulled in to leave room for its bank. */
function trace(G, comp, pieces, live, axis, near) {
  const { x0, z0, w, h, n } = G
  const paddies = []
  const owner = new Int32Array(n).fill(-1)
  for (const pid of live) {
    const p = pieces[pid]
    const cells = largestPart(p.cells.filter((c) => comp[c] === pid), w)
    if (cells.length < MIN_CELLS) continue
    let bi0 = w
    let bj0 = h
    let bi1 = 0
    let bj1 = 0
    let sAxis = 0
    for (const c of cells) {
      const i = c % w
      const j = (c / w) | 0
      bi0 = Math.min(bi0, i)
      bi1 = Math.max(bi1, i)
      bj0 = Math.min(bj0, j)
      bj1 = Math.max(bj1, j)
      sAxis += axis[near[c]].s
    }
    const bw = bi1 - bi0 + 1
    const box = new Uint8Array(bw * (bj1 - bj0 + 1))
    for (const c of cells) box[(((c / w) | 0) - bj0) * bw + (c % w) - bi0] = 1
    const loops = outlines(bw, bj1 - bj0 + 1, (i, j) => box[j * bw + i] === 1)
    if (!loops.length) continue
    let poly = loops[0].map(([i, j]) => [x0 + (bi0 + i + 0.5) * CELL, z0 + (bj0 + j + 0.5) * CELL])
    poly = simplify([...poly, poly[0]], CELL * 0.3).slice(0, -1)
    if (poly.length < 3) continue
    poly = chaikin(poly, 2, true)
    poly = simplify([...poly, poly[0]], CELL * 0.06).slice(0, -1)
    // neighbours share their outlines: pull each in to leave room for a bank
    poly = inset(poly, BANK / 2)
    if (!poly) continue
    for (const c of cells) owner[c] = paddies.length
    paddies.push({
      poly: poly.map((q) => [Math.round(q[0] * 1000) / 1000, Math.round(q[1] * 1000) / 1000]),
      level: Math.round(p.level * 100) / 100,
      flood: 1,
      age: 0,
      s: sAxis / cells.length,
      cells,
      side: 0,
    })
  }
  return { paddies, owner }
}

/**
 * The ground edits that level each paddy, never into a trench. Every texel
 * the bilinear ground reads anywhere under a paddy must lie under that
 * paddy's water, so where two levels share a texel the lower wins (the upper
 * paddy's bank wall stands on it). Texels under a paddy are levelled outright
 * (cut, or a little fill); those just outside are only ever lowered.
 */
function carvePlan(G, paddies, owner, chan, gr, height, N2) {
  const { x0, z0, w, h } = G
  const { tex, ti0, tj0, tw, th } = gr
  const minL = new Float32Array(tw * th).fill(Infinity)
  const stamp = (x, z, L) => {
    const i = Math.floor((x + HALF) / tex - 0.5 - ti0)
    const j = Math.floor((z + HALF) / tex - 0.5 - tj0)
    for (let dj = 0; dj <= 1; dj++) {
      for (let di = 0; di <= 1; di++) {
        const ii = i + di
        const jj = j + dj
        if (ii < 0 || jj < 0 || ii >= tw || jj >= th) continue
        const t = jj * tw + ii
        if (L < minL[t]) minL[t] = L
      }
    }
  }
  const hc = CELL * 0.75
  for (const p of paddies) {
    for (const c of p.cells) {
      const x = x0 + ((c % w) + 0.5) * CELL
      const z = z0 + (((c / w) | 0) + 0.5) * CELL
      stamp(x - hc, z - hc, p.level)
      stamp(x + hc, z - hc, p.level)
      stamp(x + hc, z + hc, p.level)
      stamp(x - hc, z + hc, p.level)
    }
  }
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
    for (const c of p.cells) {
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

/** Separable box blur of radius r cells over a w×h grid (edges clamped). */
function boxBlur(src, w, h, r) {
  const tmp = new Float32Array(w * h)
  const out = new Float32Array(w * h)
  const k = 1 / (2 * r + 1)
  for (let j = 0; j < h; j++) {
    const row = j * w
    let s = 0
    for (let d = -r; d <= r; d++) s += src[row + Math.min(w - 1, Math.max(0, d))]
    for (let i = 0; i < w; i++) {
      tmp[row + i] = s * k
      s += src[row + Math.min(w - 1, i + r + 1)] - src[row + Math.max(0, i - r)]
    }
  }
  for (let i = 0; i < w; i++) {
    let s = 0
    for (let d = -r; d <= r; d++) s += tmp[Math.min(h - 1, Math.max(0, d)) * w + i]
    for (let j = 0; j < h; j++) {
      out[j * w + i] = s * k
      s += tmp[Math.min(h - 1, j + r + 1) * w + i] - tmp[Math.max(0, j - r) * w + i]
    }
  }
  return out
}

/** The biggest 4-connected group among `cells` (indices on a grid w wide). */
function largestPart(cells, w) {
  const nb = [-1, 1, -w, w]
  const set = new Set(cells)
  const seen = new Set()
  let best = []
  for (const c0 of cells) {
    if (seen.has(c0)) continue
    const part = []
    const stack = [c0]
    seen.add(c0)
    while (stack.length) {
      const c = stack.pop()
      part.push(c)
      for (let q = 0; q < 4; q++) {
        const d = c + nb[q]
        if (set.has(d) && !seen.has(d)) {
          seen.add(d)
          stack.push(d)
        }
      }
    }
    if (part.length > best.length) best = part
  }
  return best
}

/** Pull a simple polygon's outline in by d (mitred); null if it collapses. */
function inset(poly, d) {
  const n = poly.length
  const a0 = polyCentroid(poly).area
  let sa = 0
  for (let i = 0; i < n; i++) sa += poly[i][0] * poly[(i + 1) % n][1] - poly[(i + 1) % n][0] * poly[i][1]
  const sg = sa > 0 ? 1 : -1
  const out = []
  for (let i = 0; i < n; i++) {
    const p = poly[(i + n - 1) % n]
    const q = poly[i]
    const r = poly[(i + 1) % n]
    let ax = q[0] - p[0]
    let az = q[1] - p[1]
    let bx = r[0] - q[0]
    let bz = r[1] - q[1]
    const la = Math.hypot(ax, az) || 1
    const lb = Math.hypot(bx, bz) || 1
    ax /= la
    az /= la
    bx /= lb
    bz /= lb
    // inward normals of the two edges, and their bisector
    const mx = -az * sg - bz * sg
    const mz = ax * sg + bx * sg
    const ml = Math.hypot(mx, mz) || 1
    const k = d / Math.max(0.5, (mx * -bz * sg + mz * bx * sg) / ml)
    out.push([q[0] + (mx / ml) * k, q[1] + (mz / ml) * k])
  }
  let sb = 0
  for (let i = 0; i < n; i++) sb += out[i][0] * out[(i + 1) % n][1] - out[(i + 1) % n][0] * out[i][1]
  return sb * sa > 0 && polyCentroid(out).area > a0 * 0.35 ? out : null
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
