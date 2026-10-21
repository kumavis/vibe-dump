// A district pack, from its PNG bytes to what the close-up draws (DATA.md
// "District packs"). Pure functions on typed arrays, run in the district's
// worker (district-worker.js) or, failing that, on the main thread.
//
// What it makes, all on the pack's own grid (2035 × 2048 for Nuʻuanu, 6 m):
//
// - metres, the lidar's heights as they are today, and normals with ambient
//   occlusion in their alpha, as decode.js makes them for the island packs;
// - water routed over those heights: every texel's way to the sea by a
//   priority flood (Barnes et al. 2014), which needs no pit to be filled by
//   hand and keeps the bake's breached dams open, then the area draining
//   through each. That gives the land map's riparian channel, and the streams
//   themselves, traced as lines down every channel past a set catchment;
// - the land map: rain, the beach sand of today's shore and of the shore the
//   patches give back (in alpha), riparian;
// - an aux map: r the lower patches, a soft weight that rises from nothing at
//   the old shore to whole a few tens of metres out, so the land the fill made
//   sinks to a reef flat with a beach in front of it rather than a cliff (and
//   from 128 up, the channels dug since, filled back in: patchLevel); g, b, a the
//   features rastered here (loʻi, fishponds, the village): their soft mask,
//   for a loʻi its paddy (a hash in the low bits, the bank between two paddies
//   in the top bit), and the feature's index;
// - the loʻi carve: how far each texel is cut or filled to its terrace's
//   water (half floats), so the shader can lay the terraces in by year (and
//   off the loʻi, where a dug channel is filled back in, the level it is
//   filled to, and where the normals were made off today's ground, by how
//   much);
// - the patch map, over the box the patches reach: which lower patches each
//   texel of that weight belongs to, so each can go at its own until, and the
//   raise patches' own soft masks (patchMap);
// - and the trees, placed once, species by rain, height and landform after the
//   ahupuaʻa app's FOREST.md, each with the feature whose clearing it stands in.

import { decodeHeights, decodeGrey, ambientOcclusion, packNormals, blur, distanceTransform } from './decode.js'

const smooth = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// --- water --------------------------------------------------------------------

/**
 * Where every land texel drains: rec[c] is the neighbour it sends its water
 * to (-1 off the grid or into the sea), order the land texels upstream-last
 * (each after the one it drains into). A priority flood from the sea and the
 * grid's edge inward, lowest first; a texel lower than the water level that
 * reached it is a pit, taken at that level from a plain queue (the "+ε"
 * variant), so pits and flats drain through their spill points.
 */
export function routeFlow(m, W, H) {
  const N = W * H
  const done = new Uint8Array(N)
  const rec = new Int32Array(N).fill(-1)
  const order = new Int32Array(N)
  const level = new Float32Array(N)
  let no = 0
  // binary heap of texel indices, keyed by level[]
  const heap = new Int32Array(N)
  let hn = 0
  const push = (c) => {
    let i = hn++
    const v = level[c]
    while (i > 0) {
      const p = (i - 1) >> 1
      if (level[heap[p]] <= v) break
      heap[i] = heap[p]
      i = p
    }
    heap[i] = c
  }
  const pop = () => {
    const top = heap[0]
    const last = heap[--hn]
    const v = level[last]
    let i = 0
    for (;;) {
      let k = 2 * i + 1
      if (k >= hn) break
      if (k + 1 < hn && level[heap[k + 1]] < level[heap[k]]) k++
      if (level[heap[k]] >= v) break
      heap[i] = heap[k]
      i = k
    }
    heap[i] = last
    return top
  }
  const pit = new Int32Array(N)
  let ph = 0
  let pt = 0
  for (let c = 0; c < N; c++) if (m[c] <= 0) done[c] = 1
  const DI = [-1, 1, 0, 0, -1, 1, -1, 1]
  const DJ = [0, 0, -1, 1, -1, -1, 1, 1]
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const c = j * W + i
      if (done[c]) continue
      let seed = i === 0 || j === 0 || i === W - 1 || j === H - 1
      let into = -1
      for (let k = 0; k < 8 && !seed; k++) {
        const x = i + DI[k]
        const y = j + DJ[k]
        const n = y * W + x
        if (m[n] <= 0) {
          seed = true
          into = n
        }
      }
      if (seed) {
        done[c] = 1
        rec[c] = into
        level[c] = m[c]
        push(c)
      }
    }
  }
  while (hn || ph < pt) {
    const c = ph < pt ? pit[ph++] : pop()
    order[no++] = c
    const lv = level[c]
    const i = c % W
    const j = (c - i) / W
    for (let k = 0; k < 8; k++) {
      const x = i + DI[k]
      const y = j + DJ[k]
      if (x < 0 || y < 0 || x >= W || y >= H) continue
      const n = y * W + x
      if (done[n]) continue
      done[n] = 1
      rec[n] = c
      if (m[n] <= lv) {
        level[n] = lv
        pit[pt++] = n
      } else {
        level[n] = m[n]
        push(n)
      }
    }
    // (the pit queue is drained before the heap is touched again, so it can
    // restart at the front once empty)
    if (ph === pt) ph = pt = 0
  }
  return { rec, order: order.subarray(0, no) }
}

/** Area (km²) draining through each texel, from routeFlow. */
export function flowArea(route, W, H, cellKm) {
  const area = new Float32Array(W * H)
  const { rec, order } = route
  for (let o = 0; o < order.length; o++) area[order[o]] = cellKm
  for (let o = order.length - 1; o >= 0; o--) {
    const c = order[o]
    const r = rec[c]
    if (r >= 0 && area[r] > 0) area[r] += area[c]
  }
  return area
}

/**
 * The streams: every channel (texels draining at least `minKm2`) traced from
 * its head down to the sea or to the trunk it joins, smoothed out of the D8
 * zigzag and resampled. Packed as [n, x, z, km², x, z, km², …] per line, in
 * world units.
 */
export function traceStreams(route, area, W, H, minKm2, toWorld, step = 0.14) {
  const N = W * H
  const { rec } = route
  const chan = new Uint8Array(N)
  for (let c = 0; c < N; c++) if (area[c] >= minKm2) chan[c] = 1
  // channel texels some other channel texel drains into are not heads
  const fed = new Uint8Array(N)
  for (let c = 0; c < N; c++) if (chan[c] && rec[c] >= 0 && chan[rec[c]]) fed[rec[c]] = 1
  const seen = new Uint8Array(N)
  const heads = []
  for (let c = 0; c < N; c++) if (chan[c] && !fed[c]) heads.push(c)
  // the longest first, so a trunk is one line from its head to the sea
  // and its tributaries end on it
  const len = new Float32Array(heads.length)
  heads.forEach((h, k) => {
    let n = 0
    for (let c = h; c >= 0 && chan[c] && n < 1e6; c = rec[c]) n++
    len[k] = n
  })
  const idx = heads.map((_, k) => k).sort((a, b) => len[b] - len[a])
  const out = []
  for (const k of idx) {
    const pts = []
    let c = heads[k]
    while (c >= 0 && chan[c]) {
      const i = c % W
      const j = (c - i) / W
      const [x, z] = toWorld(i + 0.5, j + 0.5)
      pts.push([x, z, area[c]])
      if (seen[c]) break // (joined a line already traced: end on it)
      seen[c] = 1
      c = rec[c]
    }
    if (c >= 0 && !chan[c]) {
      // into the sea: one step on, so the line reaches the water
      const i = c % W
      const j = (c - i) / W
      const [x, z] = toWorld(i + 0.5, j + 0.5)
      pts.push([x, z, pts.at(-1)?.[2] ?? minKm2])
    }
    if (pts.length < 3) continue
    const line = resample(smoothLine(pts, 3), step)
    if (line.length < 2) continue
    out.push(line.length)
    for (const p of line) out.push(p[0], p[1], p[2])
  }
  return new Float32Array(out)
}

/** A moving average over ±r points, ends pinned (keeps a D8 path's course, loses its stair steps). */
function smoothLine(pts, r) {
  const n = pts.length
  const out = pts.map((p) => p.slice())
  for (let i = 1; i < n - 1; i++) {
    let sx = 0
    let sz = 0
    let w = 0
    const k = Math.min(r, i, n - 1 - i)
    for (let d = -k; d <= k; d++) {
      sx += pts[i + d][0]
      sz += pts[i + d][1]
      w++
    }
    out[i][0] = sx / w
    out[i][1] = sz / w
  }
  return out
}

function resample(pts, step) {
  const out = [pts[0]]
  let carry = 0
  for (let i = 0; i + 1 < pts.length; i++) {
    const a = pts[i]
    const b = pts[i + 1]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    let t = step - carry
    while (t < L) {
      const f = t / L
      out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f])
      t += step
    }
    carry = L - (t - step)
  }
  const last = pts[pts.length - 1]
  if (Math.hypot(last[0] - out.at(-1)[0], last[1] - out.at(-1)[1]) > step * 0.3) out.push(last)
  return out
}

// --- rasters --------------------------------------------------------------------

/** Even-odd scanline fill of rings given in grid coordinates (texel units, centres at +0.5). */
export function fillRings(grid, W, H, rings, value) {
  const edges = []
  let j0 = Infinity
  let j1 = -Infinity
  for (const r of rings) {
    for (let i = 0; i + 1 < r.length; i++) {
      const [ax, az] = r[i]
      const [bx, bz] = r[i + 1]
      if (az === bz) continue
      edges.push(az < bz ? [az, ax, bz, bx] : [bz, bx, az, ax])
      j0 = Math.min(j0, az, bz)
      j1 = Math.max(j1, az, bz)
    }
  }
  if (!edges.length) return 0
  const xs = []
  let count = 0
  for (let j = Math.max(0, Math.floor(j0)); j <= Math.min(H - 1, Math.ceil(j1)); j++) {
    const y = j + 0.5
    xs.length = 0
    for (const E of edges) if (E[0] <= y && E[2] > y) xs.push(E[1] + ((y - E[0]) / (E[2] - E[0])) * (E[3] - E[1]))
    xs.sort((a, b) => a - b)
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const a = Math.max(0, Math.ceil(xs[k] - 0.5))
      const b = Math.min(W - 1, Math.floor(xs[k + 1] - 0.5))
      for (let i = a; i <= b; i++) {
        grid[j * W + i] = value
        count++
      }
    }
  }
  return count
}

/** The shaders' value noise (common.glsl.js), for soft edges that wander. */
function hash12(x, y) {
  let a = (x * 0.1031) % 1
  let b = (y * 0.1031) % 1
  if (a < 0) a += 1
  if (b < 0) b += 1
  let c = a
  const d = a * (b + 33.33) + b * (c + 33.33) + c * (a + 33.33)
  a += d
  b += d
  c += d
  const v = ((a + b) * c) % 1
  return v < 0 ? v + 1 : v
}
function vnoise(x, y) {
  const i = Math.floor(x)
  const j = Math.floor(y)
  const fx = x - i
  const fy = y - j
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  const a = hash12(i, j)
  const b = hash12(i + 1, j)
  const c = hash12(i, j + 1)
  const d = hash12(i + 1, j + 1)
  return a + (b - a) * ux + (c - a + (a - b + d - c) * ux) * uy
}
/** An integer hash to 0..1 (for paddies and trees: deterministic, no state). */
export function ihash(a, b = 0, c = 0) {
  let h = Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263) ^ Math.imul(c | 0, 2246822519)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  h ^= h >>> 16
  return (h >>> 0) / 4294967296
}

/** A float as IEEE half bits (for the carve's R16F texture). */
const f32 = new Float32Array(1)
const u32 = new Uint32Array(f32.buffer)
export function toHalf(v) {
  f32[0] = v
  const x = u32[0]
  const sign = (x >>> 16) & 0x8000
  let e = ((x >>> 23) & 0xff) - 127 + 15
  const mant = x & 0x7fffff
  if (e <= 0) return sign
  if (e >= 31) return sign | 0x7c00
  return sign | (e << 10) | (mant >>> 13)
}
export function fromHalf(h) {
  const e = (h >>> 10) & 0x1f
  const m = h & 0x3ff
  const s = h & 0x8000 ? -1 : 1
  if (e === 0) return s * m * 5.960464477539063e-8
  if (e === 31) return m ? NaN : s * Infinity
  return s * (1 + m / 1024) * 2 ** (e - 15)
}

// --- the loʻi -------------------------------------------------------------------

// Terraces are stepped so a paddy is about this deep down the fall (metres),
// the step one of BASE·2^k as the ahupuaʻa app steps its own (gen/loi.js);
// paddies are paced off across the valley, parallel to the stream, this wide
// (and a little either way, terrace by terrace)
const PADDY_DEEP = 28
export const BASE = 0.5625
const PADDY_WIDE = [22, 36]
const MAX_CUT = 3.5
const MAX_FILL = 2.6
const LOI_EDGE = 32 // metres over which an inferred outline fades into the land round it
// a stream is drawn from where it drains this much (km²): the gulches' own, not every fold
const STREAM_KM2 = 0.45
const STREAM_KEEP = [7, 16] // the stream keeps its own bed: no terrace this near a trunk (metres)

/**
 * Lay the loʻi of `feature` (its rings rastered in `inside`) into terraces:
 * writes aux (g mask, b paddy, a index) and carve, and returns its paddy count.
 * hs: the heights smoothed (the floor's broad shape), cls: the step class,
 * chanDist: metres to the nearest trunk.
 */
function layLoi({ index, inside, box, m, hs, cls, chanDist, aux, carve, W, mx, mz }) {
  const { x0, y0, x1, y1 } = box
  const bw = x1 - x0 + 1
  const bh = y1 - y0 + 1
  // distance into the outline from its edge, for the soft edge (over its box alone)
  const din = distanceTransform(bw, bh, (c) => !inside[(y0 + Math.floor(c / bw)) * W + x0 + (c % bw)], mx, mz)
  const seen = new Set()
  for (let j = y0; j <= y1; j++) {
    for (let i = x0; i <= x1; i++) {
      const c = j * W + i
      if (!inside[c] || m[c] <= 0.3) continue
      const xm = i * mx
      const zm = j * mz
      // the edge wanders, as an inferred outline should: about ±12 m over a few hundred
      const wob = (vnoise(xm / 140 + index * 7.1, zm / 140) - 0.5) * 24
      const edge = smooth(0, LOI_EDGE, din[(j - y0) * bw + (i - x0)] + wob)
      const keep = smooth(STREAM_KEEP[0], STREAM_KEEP[1], chanDist[c])
      if (edge * keep < 0.02) continue
      const k = cls[c]
      const step = BASE * 2 ** k
      // (the level as the shader will find it, from tau as a half float holds it)
      const tau = hs[c] / step
      const tauHalf = toHalf(tau - 64 * Math.floor(tau / 64))
      const lambda = loiLevel(m[c], fromHalf(tauHalf), k)
      const L = Math.round(lambda / step - 0.5)
      const delta = lambda - m[c]
      // (where the ground is too rough to level, a road cut or a bank, it is left be)
      const ok = delta < 0 ? smooth(MAX_CUT + 1, MAX_CUT, -delta) : smooth(MAX_FILL + 1, MAX_FILL, delta)
      const w = edge * keep * ok
      if (w < 0.02) continue
      // Across the valley the terrace is paced off into paddies from the
      // stream: u counts paddies outward, its whole part the paddy, its
      // fraction where in it (the banks between are drawn where it turns
      // over), each terrace its own width and phase. Down the valley tau
      // counts terraces (hs over the step), so the shader finds the
      // terrace's level, and draws its banks where tau turns over, from a
      // value that runs smoothly between texels (district.glsl.js). Kept
      // modulo 64 terraces so a half float holds it finely; the shader
      // restores the whole of it from the height.
      const u = (chanDist[c] - STREAM_KEEP[0]) / paddyWide(L, k, index) + ihash(index, L, k * 7 + 2)
      seen.add((k * 4096 + L) * 4096 + Math.floor(u))
      aux[c * 4 + 1] = Math.round(255 * w)
      aux[c * 4 + 2] = k
      aux[c * 4 + 3] = index
      carve[c * 2] = tauHalf
      carve[c * 2 + 1] = toHalf(u)
    }
  }
  return seen.size
}

/** A terrace's paddy width (metres), a little different terrace by terrace. */
function paddyWide(L, k, index) {
  return PADDY_WIDE[0] + (PADDY_WIDE[1] - PADDY_WIDE[0]) * ihash(index, L, k * 7 + 1)
}

/** The box of some rings (grid coordinates), padded and clamped to the grid. */
function boxOf(rings, W, H, pad) {
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (const r of rings) {
    for (const [x, y] of r) {
      x0 = Math.min(x0, x)
      y0 = Math.min(y0, y)
      x1 = Math.max(x1, x)
      y1 = Math.max(y1, y)
    }
  }
  return { x0: Math.max(0, Math.floor(x0) - pad), y0: Math.max(0, Math.floor(y0) - pad), x1: Math.min(W - 1, Math.ceil(x1) + pad), y1: Math.min(H - 1, Math.ceil(y1) + pad) }
}

/** A loʻi texel's level: its terrace (tau modulo 64, restored from its height) at the step of its class. */
export function loiLevel(h, tauMod, cls) {
  const step = BASE * 2 ** cls
  const L = tauMod + 64 * Math.floor((h / step - tauMod) / 64 + 0.5)
  return (Math.floor(L) + 0.5) * step
}

// --- trees ----------------------------------------------------------------------

// rain in the land map's units, ln(mm / 300) / ln(40) (vegetation.js, ahupuaʻa)
const R1000 = 0.326
const R1075 = 0.346
const R1250 = 0.387
const R1500 = 0.436
const R2500 = 0.575
const R4000 = 0.702

export const TREE_KINDS = ['ohia', 'ohiaKrumm', 'koa', 'kukui', 'ohiaai', 'hau', 'hala', 'wiliwili', 'lama', 'aalii', 'niu', 'milo']
const T = Object.fromEntries(TREE_KINDS.map((k, i) => [k, i]))
// per-instance leaf tints (multipliers on the model's colour), as vegetation.js
const TINT = { ohiaDry: [1.48, 1.41, 1.8], ohiaWet: [0.72, 0.75, 0.7], olapa: [1.32, 1.46, 1.17] }
export const TREE_STRIDE = 9 // x, z, metres, rot, scale, r, g, b, clearing

function choose(u, w) {
  let t = 0
  for (let k = 0; k < w.length; k++) if (w[k] > 0) t += w[k]
  if (t <= 0) return -1
  u *= t
  let last = -1
  for (let k = 0; k < w.length; k++) {
    if (w[k] <= 0) continue
    last = k
    if ((u -= w[k]) < 0) return k
  }
  return last
}

/**
 * The district's trees, one candidate every `step` metres, kept or not and
 * given a species by the rules of the ahupuaʻa app's FOREST.md, cut down to
 * what this valley needs: the farmed lowland below about 460 m a mosaic (no
 * trees on the loʻi or round the village, kukui pale in the gulches and on the
 * steep lower walls, ʻōhiʻa ʻai in groves on the moist floors, hau along the
 * streams, hala on the slopes), the dry plain and Pūowaina open pili with
 * wiliwili, lama and ʻaʻaliʻi on rocky ground, niu and hala along the shore of
 * the year, and ʻōhiʻa with koa on the upper walls and the valley head, low and
 * wind-shorn on the ridges and the pali (Macrae, walking up Nuʻuanu in 1825,
 * met kukui and mountain apple first, ʻōhiʻa only up the valley).
 */
function placeTrees({ W, H, mx, mz, m, m1795, rain, normals, rip, tpi, chanDist, clear, patch, shore, toWorld, step }) {
  const out = TREE_KINDS.map(() => [])
  const n = new Int32Array(TREE_KINDS.length)
  const w = new Float32Array(TREE_KINDS.length)
  const gi0 = Math.floor((W * mx) / step)
  const gj0 = Math.floor((H * mz) / step)
  for (let gj = 0; gj < gj0; gj++) {
    for (let gi = 0; gi < gi0; gi++) {
      const xm = (gi + ihash(gi, gj, 11)) * step
      const zm = (gj + ihash(gi, gj, 12)) * step
      const i = Math.min(W - 1, Math.floor(xm / mx))
      const j = Math.min(H - 1, Math.floor(zm / mz))
      const c = j * W + i
      // never on the water of the year or on ground the fill made
      if (patch[c] > 0 || m[c] < 1.2 || m1795[c] < 1.2) continue
      // (no trunk in a stream)
      if (chanDist[c] < 9) continue
      const h = m[c]
      const r = rain[c] / 255 + (ihash(gi, gj, 3) - 0.5) * 0.1
      const R = rain[c] / 255
      // (the normal map's y is at NORMAL_EXAG, a little steeper than the valley's 1.3)
      const up = (normals[c * 4 + 1] / 255) * 2 - 1
      const steep = 1 - smooth(0.55, 0.75, up)
      const t = h - coarseAt(tpi, i, j, 4)
      const rp = coarseAt(rip, i, j, 4)
      const gulch = Math.max(smooth(0.1, 0.3, rp), smooth(12, 30, -t))
      const ridge = smooth(10, 30, t) * (1 - smooth(0.05, 0.2, rp))
      const floor = smooth(0.94, 0.97, up) * smooth(0.25, 0.5, rp)
      const windward = R - (0.22 + 0.00043 * h)
      // the farmed lowland ends about 460 m up, untouched forest only above
      // about 760 m (Kirch); lower where it is wettest, at the head of the
      // valley, where Macrae met ʻōhiʻa in 1825 (terrain.glsl.js does the same)
      const wetHead = smooth(0.5, 0.6, R)
      const cult = 1 - smooth(420 - 250 * wetHead, 760 - 430 * wetHead, h + (ihash(gi, gj, 20) - 0.5) * 120)
      const kp = smooth(0.42, 0.6, vnoise(xm / 210 + 13.1, zm / 210 + 7.7)) // kukui's groves
      const ag = smooth(0.6, 0.7, vnoise(xm / 190 + 41.3, zm / 190 + 3.9)) // ʻōhiʻa ʻai's
      const nearStream = 1 - smooth(14, 40, chanDist[c])
      const kuk = h < 670 && R > R1075 ? (1 - smooth(450, 670, h)) * (1 - smooth(R4000 - 0.04, R4000 + 0.02, R)) : 0
      const hal = h < 610 ? 1 : 0
      const ai = h < 550 && r > R1500 ? (floor > 0.5 ? 0.8 + 4 * ag : 0.1 + 6 * ag) : 0
      const crest = Math.max(smooth(0, 20, t), smooth(300, 420, h))
      w.fill(0)
      let p = 0
      let s = 1
      let tint = null
      const atShore = shore.a[(j >> 1) * shore.w + (i >> 1)] < 70 && h < 8
      if (atShore) {
        // the shore of the year: niu and hala, and milo and kou by the houses
        p = 0.3
        w[T.niu] = 50
        w[T.hala] = 30
        w[T.milo] = 15
      } else if (r < R1250 && windward < 0.04 && h < 300) {
        // the dry plain and the leeward slopes: pili, trees on rocky ground and in gulches
        p = 0.04 + 0.32 * gulch + 0.22 * steep
        w[T.aalii] = 35
        w[T.wiliwili] = R < R1250 - 0.02 ? 25 : 8
        w[T.lama] = 25
        w[T.ohia] = 12
        tint = TINT.ohiaDry
      } else if (cult > ihash(gi, gj, 22)) {
        // the farmed lowland
        if (floor > 0.5) {
          p = 0.45
          w[T.ohiaai] = 40 * ai
          w[T.hau] = 70 * nearStream
          w[T.kukui] = 20 * kuk * (1 - 0.9 * ag)
          w[T.hala] = 5 * hal
        } else if (gulch > 0.4 || steep > 0.4) {
          p = 0.85
          w[T.kukui] = 70 * kuk * (0.25 + 0.75 * kp) * (1 - 0.9 * ag)
          w[T.hala] = 14 * hal * (1 - 0.7 * ag)
          w[T.ohiaai] = 10 * ai
          w[T.hau] = 60 * nearStream * (h < 450 ? 1 : 0)
          w[T.lama] = 12 * (r < R1500 && windward < 0 ? 1 : 0)
          w[T.ohia] = (5 + 45 * (1 - kuk) * (r > R1075 ? 1 : 0)) * (h > 150 ? crest : 0)
          w[T.ohiaKrumm] = 10 * (1 - kuk) * (r >= R2500 ? 1 : 0) * steep
        } else {
          // fallow grass and fern with groves, closing into forest above about 460 m
          const upF = smooth(460, 640, h)
          p = 0.25 + 0.55 * upF
          if (ridge > 0.5) {
            w[T.ohia] = 60 * (h > 150 ? 1 : 0)
            w[T.koa] = 20 * (h > 250 ? 1 : 0)
            w[T.hala] = 20 * hal * (1 - upF)
          } else {
            w[T.kukui] = 45 * kuk * (0.1 + 0.9 * kp) * (1 - 0.9 * ag)
            w[T.hala] = 35 * hal * (1 - 0.7 * ag) * (1 - 0.85 * upF)
            w[T.ohiaai] = 10 * ai
            w[T.hau] = 60 * nearStream * (h < 450 ? 1 : 0)
            w[T.ohia] = (10 + 50 * upF) * (h > 150 ? crest : 0)
            w[T.koa] = (10 + 5 * upF) * (h > 250 ? 1 : 0)
          }
        }
      } else if (r < R2500) {
        // mesic forest above the farmed band
        p = h < 760 ? 0.55 : 0.85
        w[T.ohia] = 45
        w[T.koa] = 30 * (h > 300 ? 1 : 0)
        w[T.lama] = 15
        w[T.aalii] = 5
        w[T.kukui] = 10 * kuk * (gulch > 0.5 ? 1 : 0)
      } else if (ridge > 0.5 || steep > 0.5) {
        // the wet ridges and the pali: open stunted ʻōhiʻa over uluhe
        p = 0.6
        w[T.ohiaKrumm] = 55
        w[T.ohia] = 45
        s = 0.55 + 0.3 * ihash(gi, gj, 14)
      } else {
        // the wet forest at the valley head
        p = 0.92
        w[T.ohia] = 80
        w[T.koa] = 10 * (up > 0.8 ? 1 : 0)
        w[T.ohiaKrumm] = 10
        tint = ihash(gi, gj, 15) < 0.12 ? TINT.olapa : TINT.ohiaWet
      }
      if (p <= ihash(gi, gj, 5)) continue
      const k = choose(ihash(gi, gj, 6), w)
      if (k < 0) continue
      const [x, z] = toWorld(xm / mx, zm / mz)
      const jit = 0.92 + 0.16 * ihash(gi, gj, 8)
      const tt = k === T.ohia && tint ? tint : k === T.ohiaKrumm && tint === TINT.olapa ? TINT.olapa : [jit, jit, jit]
      // (sunk a little, so a trunk on a slope or a coarse mesh never stands off the ground)
      out[k].push(x, z, h - 0.6, ihash(gi, gj, 7) * Math.PI * 2, s * (0.8 + 0.4 * ihash(gi, gj, 9)), tt[0], tt[1], tt[2], clear[c])
      n[k]++
    }
  }
  return { kinds: TREE_KINDS, lists: out.map((l) => new Float32Array(l)), counts: Array.from(n) }
}

// --- the patches ---------------------------------------------------------------

// The levels the lower patches lay the ground at in their years: a reef flat
// where the fill made land of the sea (each patch's own depth in the shader;
// this one, DATA.md's default, for what is built here on the ground of the
// year), and where a channel has been dug through the land since, its banks'
// level, and never under this (common.glsl.js DIST_FILL).
export const PATCH_REEF = -1
export const PATCH_FILL = 0.5
// how far (texels) a lower patch's texels reach the beach before its old
// shore, so the beach of its years goes with its own until
const BEACH = 16

/**
 * A texel's height in a year, from today's and its lower patches' byte (aux
 * r): under 128 a weight toward the reef flat at `depth`, from 128 a weight
 * toward the fill, at `level` (the carve's first channel there); k the
 * patches' weight in the year (1 before their until). As distPatched.
 */
export function patchLevel(h, r, k, level = PATCH_FILL, depth = PATCH_REEF) {
  return r < 128 ? h + (depth - h) * (r / 127) * k : h + (Math.max(PATCH_FILL, level) - h) * ((r - 128) / 127) * k
}

/**
 * The patch map (common.glsl.js uDistPatch) over the box the patches reach,
 * grown by BEACH: in r which lower patches a texel of their weight belongs
 * to, as a group (each different set of them a group, from 1; groups[g] its
 * bits); in g and a the two strongest raise masks over it, their indices in
 * b (low and high four bits). A texel the lower masks don't mark takes the
 * patches of the nearest that does (the first found, where two are as near),
 * through the ground their derivation added and BEACH texels beyond it, the
 * beach before their old shore; a filled channel goes with all of them, as
 * the one patch it was derived from.
 */
function patchMap({ W, H, lowerMasks, lowerOf, raises, patchMask, fill, log }) {
  const N = W * H
  let x0 = W
  let y0 = H
  let x1 = -1
  let y1 = -1
  const mark = (c) => {
    const i = c % W
    const j = (c - i) / W
    if (i < x0) x0 = i
    if (i > x1) x1 = i
    if (j < y0) y0 = j
    if (j > y1) y1 = j
  }
  for (let c = 0; c < N; c++) {
    if (patchMask[c] || fill[c]) mark(c)
    else for (const m of raises) if (m[c]) mark(c)
  }
  if (x1 < 0) return null
  x0 = Math.max(0, x0 - BEACH)
  y0 = Math.max(0, y0 - BEACH)
  x1 = Math.min(W - 1, x1 + BEACH)
  y1 = Math.min(H - 1, y1 + BEACH)
  const bw = x1 - x0 + 1
  const bh = y1 - y0 + 1
  const at = (k) => (y0 + Math.floor(k / bw)) * W + x0 + (k % bw)
  // the lower patches' bits, from their masks outward a level at a time
  // (through the ground their derivation added however far it reaches, and
  // beyond it BEACH texels)
  const FAR = 65535
  const bits = new Uint32Array(bw * bh)
  const dist = new Uint16Array(bw * bh).fill(FAR)
  let queue = []
  for (let k = 0; k < bw * bh; k++) {
    const c = at(k)
    let b = 0
    lowerOf.forEach((mi, i) => {
      if (lowerMasks[mi][c] >= 128) b |= 1 << i
    })
    if (b) {
      bits[k] = b
      dist[k] = 0
      queue.push(k)
    }
  }
  for (let level = 1; level < FAR && queue.length; level++) {
    const next = []
    for (const k of queue) {
      const i = k % bw
      for (const n of [i > 0 ? k - 1 : -1, i < bw - 1 ? k + 1 : -1, k - bw, k + bw]) {
        if (n < 0 || n >= bw * bh) continue
        if (dist[n] !== FAR || (level > BEACH && !patchMask[at(n)])) continue
        dist[n] = level
        bits[n] = bits[k]
        next.push(n)
      }
    }
    queue = next
  }
  const all = lowerOf.reduce((b, _, i) => b | (1 << i), 0)
  for (let k = 0; k < bw * bh; k++) if (fill[at(k)]) bits[k] = all
  // the groups: each set of lower patches that occurs, numbered from 1
  const groups = [0]
  const ids = new Map()
  const data = new Uint8Array(bw * bh * 4)
  for (let k = 0; k < bw * bh; k++) {
    const b = bits[k]
    if (b) {
      let g = ids.get(b)
      if (g === undefined) {
        if (groups.length < 16) {
          g = groups.push(b) - 1
        } else {
          // (more sets than the map can number: these go with all of them)
          g = ids.get(all) ?? groups.length - 1
          log?.(`patch map: more than 15 sets of lower patches; ${b.toString(2)} goes with group ${g}`)
        }
        ids.set(b, g)
      }
      data[k * 4] = g
    }
    // the two strongest raise masks
    const c = at(k)
    let a = -1
    let wa = 0
    let bI = -1
    let wb = 0
    raises.forEach((m, i) => {
      const v = m[c]
      if (v > wa) {
        bI = a
        wb = wa
        a = i
        wa = v
      } else if (v > wb) {
        bI = i
        wb = v
      }
    })
    if (a >= 0) {
      data[k * 4 + 1] = wa
      data[k * 4 + 2] = (a & 15) | (Math.max(0, bI) & 15) << 4
      data[k * 4 + 3] = bI >= 0 ? wb : 0
    }
  }
  return { data, x0, y0, w: bw, h: bh, groups }
}

/** The water (heights at or under nothing) that reaches the grid's edge, and so the open sea. */
function seaOf(m, W, H) {
  const sea = new Uint8Array(W * H)
  const q = new Int32Array(W * H)
  let qh = 0
  let qt = 0
  const seed = (c) => {
    if (m[c] <= 0 && !sea[c]) (sea[c] = 1), (q[qt++] = c)
  }
  for (let i = 0; i < W; i++) seed(i), seed((H - 1) * W + i)
  for (let j = 0; j < H; j++) seed(j * W), seed(j * W + W - 1)
  while (qh < qt) {
    const c = q[qh++]
    const i = c % W
    const j = (c - i) / W
    if (i > 0) seed(c - 1)
    if (i < W - 1) seed(c + 1)
    if (j > 0) seed(c - W)
    if (j < H - 1) seed(c + W)
  }
  return sea
}

// --- the whole district ---------------------------------------------------------

/**
 * Everything the close-up needs, from decoded pixels. `features` are the
 * rastered ones: { index, kind: 'loi' | 'pond' | 'village', rings } with rings
 * in grid coordinates (texel units from the north-west corner). `rect` is the
 * pack's world rect. (Phases drop what they no longer need as they go: the
 * grids are four million texels each.)
 */
export function deriveDistrict({ heightPx, rainPx, masks = [], lower = [], raise = [], raiseDepth = [], W, H, scale, offset, mx, mz, rect, features, stride = 4, log = () => {} }) {
  const t0 = Date.now()
  const times = {}
  let tl = t0
  const lap = (what) => {
    const now = Date.now()
    times[what] = now - tl
    tl = now
  }
  const N = W * H
  const m = decodeHeights(heightPx, W, H, scale, offset, stride)
  const rain = rainPx ? decodeGrey(rainPx, W, H, stride) : new Uint8Array(N).fill(82)
  // water the bare earth holds inland, cut off from the sea (a park's lagoon,
  // a basin): today's, so it is filled to just above the tide
  const basin = new Uint8Array(N)
  {
    const sea = seaOf(m, W, H)
    for (let c = 0; c < N; c++) if (m[c] <= 0 && !sea[c]) (m[c] = 0.3), (basin[c] = 1)
  }
  const sx = (rect.x1 - rect.x0) / W
  const sz = (rect.z1 - rect.z0) / H
  const toWorld = (gi, gj) => [rect.x0 + gi * sx, rect.z0 + gj * sz]
  lap('decode')

  // the lower patches: their masks as one (DATA.md lets two share one; masks
  // that differ are merged here, and told apart again in the patch map), soft
  // from the old shore out; the raise patches' masks are their own
  const lowerMasks = [...new Set(lower)].map((i) => masks[i])
  const raises = raise.map((i) => masks[i])
  const raiseAny = new Uint8Array(N)
  for (const m of raises) for (let c = 0; c < N; c++) if (m[c] > raiseAny[c]) raiseAny[c] = m[c]
  const patchMask = new Uint8Array(N)
  for (const px of lowerMasks) for (let c = 0; c < N; c++) if (px[c] >= 128) patchMask[c] = 1
  // (the fill outlines stop a few metres short of today's piers and seawalls,
  // which would stand out of the reef as rims: low land that close to both
  // the patch and today's water goes with the patch)
  if (lowerMasks.length) {
    const R = 3
    const near = (c, test) => {
      const i = c % W
      const j = (c - i) / W
      for (let dj = -R; dj <= R; dj++) {
        const y = j + dj
        if (y < 0 || y >= H) continue
        for (let di = -R; di <= R; di++) {
          const x = i + di
          if (x >= 0 && x < W && test(y * W + x)) return true
        }
      }
      return false
    }
    const add = []
    for (let c = 0; c < N; c++) {
      if (patchMask[c] || m[c] <= 0 || m[c] > 5) continue
      if (near(c, (n) => patchMask[n]) && near(c, (n) => m[n] <= 0 && !patchMask[n])) add.push(c)
    }
    for (const c of add) patchMask[c] = 1
    // (and a basin dug in the fill, filled above, goes with the fill round it
    // rather than stand out of the reef as an islet)
    const seen = new Uint8Array(N)
    for (let c0 = 0; c0 < N; c0++) {
      if (!basin[c0] || seen[c0]) continue
      const comp = [c0]
      seen[c0] = 1
      let touches = false
      for (let q = 0; q < comp.length; q++) {
        const c = comp[q]
        if (!touches && near(c, (n) => patchMask[n] === 1)) touches = true
        const i = c % W
        for (const n of [i > 0 ? c - 1 : -1, i < W - 1 ? c + 1 : -1, c - W, c + W]) {
          if (n >= 0 && n < N && basin[n] && !seen[n]) (seen[n] = 1), comp.push(n)
        }
      }
      if (touches) for (const c of comp) patchMask[c] = 1
    }
  }
  // and the channels dug since: water today too narrow for the sea's own
  // shapes (under about 90 m across, as the Ala Wai is, and the canals the
  // streams were straightened into), reaching in from the shore of the
  // patched years. Where one opens off the fill (the slips between the piers)
  // it was the reef's and goes with the patch; inland it was land (the
  // Waikīkī wetland the Ala Wai drained, the streams' own lower courses), and
  // in the patch's years it is filled back to just above the tide. (Water a
  // raise patch marks is that patch's to lay, not this rule's.)
  const fill = new Uint8Array(N)
  if (lowerMasks.length) {
    const R = 45
    const sea = (c) => m[c] <= 0 || patchMask[c] === 1
    const toLand = distanceTransform(W, H, (c) => !sea(c), mx, mz)
    const toWide = distanceTransform(W, H, (c) => sea(c) && toLand[c] > R, mx, mz)
    const toPatch = distanceTransform(W, H, (c) => patchMask[c] === 1, mx, mz)
    const narrow = R + 1.5 * Math.max(mx, mz)
    for (let c = 0; c < N; c++) {
      if (m[c] > 0 || patchMask[c] || toWide[c] <= narrow || raiseAny[c] >= 64) continue
      if (toPatch[c] < 60) patchMask[c] = 2
      else fill[c] = 1
    }
    for (let c = 0; c < N; c++) if (patchMask[c]) patchMask[c] = 1
  }
  const aux = new Uint8Array(N * 4)
  // the ground of the patched years (for their beach and where the trees
  // stand): the raises first, as the shader lays them, then the lowers
  const m1795 = Float32Array.from(m)
  raises.forEach((px, i) => {
    const d = raiseDepth[i] ?? PATCH_REEF
    for (let c = 0; c < N; c++) if (px[c]) m1795[c] += (Math.max(m1795[c], d) - m1795[c]) * (px[c] / 255)
  })
  let pbox = null
  let islets = null
  {
    let x0 = W
    let y0 = H
    let x1 = -1
    let y1 = -1
    for (let c = 0; c < N; c++) {
      if (!patchMask[c]) continue
      const i = c % W
      const j = (c - i) / W
      x0 = Math.min(x0, i)
      x1 = Math.max(x1, i)
      y0 = Math.min(y0, j)
      y1 = Math.max(y1, j)
    }
    if (x1 >= 0) {
      // (over the patch's box and a margin: the ramp reaches 45 m from the old land)
      x0 = Math.max(0, x0 - 12)
      y0 = Math.max(0, y0 - 12)
      x1 = Math.min(W - 1, x1 + 12)
      y1 = Math.min(H - 1, y1 + 12)
      pbox = { x0, y0, x1, y1 }
      const bw = x1 - x0 + 1
      const bh = y1 - y0 + 1
      const at = (c) => (y0 + Math.floor(c / bw)) * W + x0 + (c % bw)
      const toOldLand = distanceTransform(bw, bh, (c) => !patchMask[at(c)] && m[at(c)] > 0, mx, mz)
      for (let c = 0; c < bw * bh; c++) {
        const g = at(c)
        if (!patchMask[g]) continue
        const w = smooth(0, 45, toOldLand[c])
        aux[g * 4] = Math.round(127 * w)
        m1795[g] += (PATCH_REEF - m1795[g]) * w
      }
    }
  }
  // (and an islet of today's ground the fill outline missed, left standing
  // on the reef the patch makes, under a hectare and a half: a mound or a
  // pier head, gone with the fill round it)
  if (pbox) {
    const ISLET = Math.round(15000 / (mx * mz))
    const lab = new Uint8Array(N)
    const comp = []
    for (let c0 = 0; c0 < N; c0++) {
      const i0 = c0 % W
      const j0 = (c0 - i0) / W
      if (i0 < pbox.x0 || i0 > pbox.x1 || j0 < pbox.y0 || j0 > pbox.y1) continue
      if (lab[c0] || m1795[c0] <= 0) continue
      comp.length = 0
      comp.push(c0)
      lab[c0] = 1
      let touches = false
      let big = false
      for (let q = 0; q < comp.length; q++) {
        const c = comp[q]
        const i = c % W
        const j = (c - i) / W
        // (searched within the patch's box: what reaches its edge is no islet)
        if (i <= pbox.x0 || j <= pbox.y0 || i >= pbox.x1 || j >= pbox.y1) {
          big = true
          continue
        }
        for (const n of [c - 1, c + 1, c - W, c + W]) {
          if (m1795[n] > 0) {
            if (!lab[n]) (lab[n] = 1), comp.push(n)
          } else if (patchMask[n]) touches = true
        }
        if (comp.length > ISLET) big = true
      }
      if (big || !touches) continue
      islets ||= []
      for (const c of comp) {
        patchMask[c] = 1
        aux[c * 4] = 127
        m1795[c] = PATCH_REEF
        islets.push(c)
      }
    }
  }
  // (today's heights with the dug channels counted as land, for the water's
  // ways and today's beaches: a stream runs on down its canal to the sea,
  // and a canal's banks are no beach)
  const mS = Float32Array.from(m)
  // a filled channel's level: its banks' (the land either side, a little
  // under it), so the line it was dug along doesn't show as a trough; kept
  // in the carve's first channel, which no loʻi uses there
  let fillAt = null
  if (lowerMasks.length) {
    for (let c = 0; c < N; c++) if (fill[c]) m1795[c] = PATCH_FILL
    // (with the water a filled canal leaves cut off from the sea: a basin dug
    // along it, or the reef the patch makes of its mouth)
    const sea = seaOf(m1795, W, H)
    for (let c = 0; c < N; c++) if (!fill[c] && m1795[c] <= 0 && !sea[c]) fill[c] = 1
    const bank = new Float32Array(N)
    const wt = new Float32Array(N)
    for (let c = 0; c < N; c++) {
      if (fill[c] || patchMask[c] || m[c] <= 0) continue
      bank[c] = Math.min(m[c], 6)
      wt[c] = 1
    }
    const r = Math.ceil(30 / Math.max(mx, mz))
    const sB = blur(bank, W, H, r, 2)
    const sW = blur(wt, W, H, r, 2)
    fillAt = new Float32Array(N)
    for (let c = 0; c < N; c++) {
      if (!fill[c]) continue
      const lv = sW[c] > 1e-3 ? Math.max(PATCH_FILL, Math.min(6, sB[c] / sW[c] - 0.2)) : PATCH_FILL
      fillAt[c] = lv
      aux[c * 4] = 255
      m1795[c] = lv
      mS[c] = lv
    }
  }
  const pmap = patchMap({ W, H, lowerMasks: masks, lowerOf: lower, raises, patchMask, fill, log })
  lap('patches')

  // normals and occlusion, on today's heights (the carve's own slope is added
  // in the shader), the dug channels filled: under today's water their banks
  // hardly show, and over the land of the patched years they would draw the
  // line they were dug along. (And the islets sunk: a mound's flanks would
  // ring the reef of those years, where today it is a speck.)
  let mN = mS
  if (islets) {
    mN = Float32Array.from(mS)
    for (const c of islets) mN[c] = PATCH_REEF
  }
  const normals = packNormals(mN, W, H, mx, mz, ambientOcclusion(mN, W, H, mx, mz))
  lap('normals')

  // water, routed over the heights pooled two by two to their lowest (so a
  // breach a texel wide stays open), 12 m cells
  let rip
  let chanDist
  let streams
  {
    const half = pool(mS, W, H, 2, true)
    const route = routeFlow(half.a, half.w, half.h)
    const area = flowArea(route, half.w, half.h, (4 * mx * mz) / 1e6)
    lap('routing')
    streams = traceStreams(route, area, half.w, half.h, STREAM_KM2, (gi, gj) => toWorld(gi * 2, gj * 2))
    lap('streams')
    // metres to the nearest trunk (a catchment of a square kilometre and more)
    chanDist = distanceTransform(W, H, (c) => {
      const i = c % W
      const j = (c - i) / W
      return mS[c] > 0 && area[(j >> 1) * half.w + (i >> 1)] >= 1
    }, mx, mz)
    // riparian, as the island packs' land maps have it, on a 24 m grid and
    // softened, so it reads like the island's own at the seam
    const rip0 = new Float32Array(half.w * half.h)
    for (let c = 0; c < rip0.length; c++) rip0[c] = half.a[c] > 0 ? Math.max(0, Math.min(1, Math.log10(Math.max(1e-9, area[c]) / 0.04) / 1.6)) : 0
    const q = pool(rip0, half.w, half.h, 2, false)
    rip = { a: blur(q.a, q.w, q.h, 1, 2), w: q.w, h: q.h }
  }
  lap('riparian')

  // sand: today's shore, and the shore of the patched years (12 m is fine enough for a beach)
  const land = new Uint8Array(N * 4)
  let shore
  {
    const sandOf = (h, ch) => {
      const g2 = pool(h, W, H, 2, false)
      const toSea2 = distanceTransform(g2.w, g2.h, (c) => g2.a[c] <= 0, mx * 2, mz * 2)
      const s2 = new Float32Array(g2.w * g2.h)
      for (let j = 1; j < g2.h - 1; j++) {
        for (let i = 1; i < g2.w - 1; i++) {
          const c = j * g2.w + i
          const v = g2.a[c]
          if (v <= 0 || v > 9) continue
          const g = Math.hypot((g2.a[c + 1] - g2.a[c - 1]) / (4 * mx), (g2.a[c + g2.w] - g2.a[c - g2.w]) / (4 * mz))
          s2[c] = toSea2[c] < 70 && g < 0.12 ? 1 : 0
        }
      }
      const b = { a: blur(s2, g2.w, g2.h, 1, 1), w: g2.w, h: g2.h }
      for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) land[(j * W + i) * 4 + ch] = h[j * W + i] > 0 ? Math.round(255 * Math.min(1, coarseAt(b, i, j, 2) * 1.5)) : 0
      return { a: toSea2, w: g2.w, h: g2.h }
    }
    sandOf(mS, 1)
    shore = sandOf(m1795, 3)
  }
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const c = j * W + i
      land[c * 4] = rainPx ? rain[c] : m[c] > 0 ? 82 : 0
      land[c * 4 + 2] = mS[c] > 0 ? Math.round(255 * Math.min(1, coarseAt(rip, i, j, 4) * 1.6)) : 0
    }
  }
  lap('sand')

  // the features
  const carve = new Uint16Array(N * 2)
  // (and off the loʻi its second channel keeps how far the normals were made
  // above today's ground, so the shader adds only what the year changes)
  if (fillAt) {
    for (let c = 0; c < N; c++) {
      if (!fill[c]) continue
      carve[c * 2] = toHalf(fillAt[c])
      carve[c * 2 + 1] = toHalf(fillAt[c] - m[c])
    }
  }
  if (islets) for (const c of islets) carve[c * 2 + 1] = toHalf(PATCH_REEF - m[c])
  const counts = {}
  const clearIdx = new Uint8Array(N)
  {
    const hs = blur(m, W, H, 3, 2)
    const cls = new Uint8Array(N)
    {
      const slope = new Float32Array(N)
      for (let j = 1; j < H - 1; j++) {
        for (let i = 1; i < W - 1; i++) {
          const c = j * W + i
          slope[c] = Math.hypot((hs[c + 1] - hs[c - 1]) / (2 * mx), (hs[c + W] - hs[c - W]) / (2 * mz))
        }
      }
      const slopeB = blur(slope, W, H, 6, 2)
      for (let c = 0; c < N; c++) cls[c] = Math.max(0, Math.min(3, Math.round(Math.log2(Math.max(1e-6, (slopeB[c] * PADDY_DEEP) / BASE)))))
    }
    const inside = new Uint8Array(N)
    // (the village first, the fishponds over it, and the loʻi last of all, though
    // none of them should overlap)
    const rank = { village: 0, loi: 1, pond: 2 }
    for (const f of [...features].sort((a, b) => rank[a.kind] - rank[b.kind])) {
      const box = boxOf(f.rings, W, H, 4)
      for (let j = box.y0; j <= box.y1; j++) inside.fill(0, j * W + box.x0, j * W + box.x1 + 1)
      const n = fillRings(inside, W, H, f.rings, 1)
      if (!n) continue
      if (f.kind === 'loi') {
        counts[f.index] = layLoi({ index: f.index, inside, box, m, hs, cls, chanDist, aux, carve, W, mx, mz })
      } else {
        // a pond's water, or the village's ground: a soft inner edge
        const bw = box.x1 - box.x0 + 1
        const bh = box.y1 - box.y0 + 1
        const din = distanceTransform(bw, bh, (c) => !inside[(box.y0 + Math.floor(c / bw)) * W + box.x0 + (c % bw)], mx, mz)
        for (let j = box.y0; j <= box.y1; j++) {
          for (let i = box.x0; i <= box.x1; i++) {
            const c = j * W + i
            if (!inside[c]) continue
            aux[c * 4 + 1] = Math.round(255 * smooth(0, f.kind === 'pond' ? 9 : 40, din[(j - box.y0) * bw + (i - box.x0)]))
            aux[c * 4 + 2] = 0
            aux[c * 4 + 3] = f.index
            carve[c * 2] = carve[c * 2 + 1] = 0
          }
        }
        counts[f.index] = n
      }
      for (let j = box.y0; j <= box.y1; j++) for (let i = box.x0; i <= box.x1; i++) if (inside[j * W + i]) clearIdx[j * W + i] = f.index
    }
  }
  lap('features')

  // the trees, and the clearings round the features they keep out of
  let trees
  {
    const clear = dilateIndex(clearIdx, W, H, 5)
    const q = pool(m, W, H, 4, false)
    const tpi = { a: blur(q.a, q.w, q.h, 2, 2), w: q.w, h: q.h }
    trees = placeTrees({ W, H, mx, mz, m, m1795, rain, normals, rip, tpi, chanDist, clear, patch: patchMask, shore, toWorld, step: 25 })
  }
  lap('trees')

  let lo = Infinity
  let hi = -Infinity
  for (let c = 0; c < N; c++) {
    if (m[c] < lo) lo = m[c]
    if (m[c] > hi) hi = m[c]
  }
  log(`district decoded in ${Date.now() - t0} ms: ${JSON.stringify(times)}`)
  return { metres: m, normals, land, aux, carve, streams, trees, counts, lo, hi, patchMap: pmap, ms: Date.now() - t0, times }
}

/** A grid reduced by k × k: each cell the min (min = true) or max of the texels it covers. */
function pool(a, W, H, k, min) {
  const w = Math.ceil(W / k)
  const h = Math.ceil(H / k)
  const out = new Float32Array(w * h).fill(min ? Infinity : -Infinity)
  for (let j = 0; j < H; j++) {
    const row = Math.floor(j / k) * w
    for (let i = 0; i < W; i++) {
      const o = row + Math.floor(i / k)
      const v = a[j * W + i]
      if (min ? v < out[o] : v > out[o]) out[o] = v
    }
  }
  return { a: out, w, h }
}

/** Bilinear read of a k-times-coarser grid at texel (i, j) of the fine one. */
function coarseAt(g, i, j, k) {
  const fx = Math.min(g.w - 1.001, Math.max(0, (i + 0.5) / k - 0.5))
  const fz = Math.min(g.h - 1.001, Math.max(0, (j + 0.5) / k - 0.5))
  const x = fx | 0
  const z = fz | 0
  const tx = fx - x
  const tz = fz - z
  const a = g.a
  const c = z * g.w + x
  const top = a[c] + (a[c + 1] - a[c]) * tx
  const bot = a[c + g.w] + (a[c + g.w + 1] - a[c + g.w]) * tx
  return top + (bot - top) * tz
}

/** A max filter of radius r texels (separable). */
function dilate(a, W, H, r) {
  const b = new Float32Array(W * H)
  const out = new Float32Array(W * H)
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      let v = 0
      for (let k = Math.max(0, i - r); k <= Math.min(W - 1, i + r); k++) v = Math.max(v, a[j * W + k])
      b[j * W + i] = v
    }
  }
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      let v = 0
      for (let k = Math.max(0, j - r); k <= Math.min(H - 1, j + r); k++) v = Math.max(v, b[k * W + i])
      out[j * W + i] = v
    }
  }
  return out
}

/** Spread nonzero indices into the zeros round them, r texels (the clearings round the features). */
function dilateIndex(a, W, H, r) {
  const b = Uint8Array.from(a)
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const c = j * W + i
      if (a[c]) continue
      for (let k = 1; k <= r; k++) {
        const v = (i - k >= 0 && a[c - k]) || (i + k < W && a[c + k])
        if (v) {
          b[c] = v
          break
        }
      }
    }
  }
  const out = Uint8Array.from(b)
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const c = j * W + i
      if (b[c]) continue
      for (let k = 1; k <= r; k++) {
        const v = (j - k >= 0 && b[c - k * W]) || (j + k < H && b[c + k * W])
        if (v) {
          out[c] = v
          break
        }
      }
    }
  }
  return out
}
