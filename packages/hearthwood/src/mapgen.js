// Seeded procedural map generator. OWNER: world implementer.
// Pure function of (world size, seed). Uses its own RNG/noise (rng.js) — never ctx.rng,
// so generating a map does not perturb the simulation stream.
//
// Pipeline (all passes O(size), typed arrays, writes world arrays directly and calls
// world.rebuildDerived() once at the end):
//   1. noise fields (lattice-cached fbm: no hashing per tile)       -> ponds, streams, cliff ridges
//   2. ground cover: moss under forest canopy / in damp hollows, dirt patches
//   3. tree stands: top `treeCover` fraction of eligible land by forest noise
//   4. random deposits: stone outcrops, ore seams, glowcap rings, moonstone veins
//   5. guaranteed deposits near/far from start (forced onto walkable ground)
//   6. clearing carved around start, then the START grove and rocks stamped
//   7. connectivity: 0-1 BFS from start (walkable 0, blocked 1); every walkable pocket is
//      either joined by carving fords/passes along the cheapest crossing or (tiny and
//      resource-free) filled in
//   8. edges: guarantee walkable edge stretches exist (Blight spawns)

import { RNG, hash01 } from './rng.js'
import { START, RESOURCES } from './content.js'
import {
  T_GRASS, T_MOSS, T_DIRT, T_WATER, T_CLIFF, TERRAIN_WALKABLE,
  R_NONE, R_TREE, R_STONE, R_ORE, R_GLOWCAP, R_MOONSTONE,
} from './constants.js'

/**
 * @typedef {Object} MapgenOptions
 * @property {number} [treeCover=0.30]   approx fraction of land tiles covered by tree stands (outside the clearing)
 * @property {number} [waterCover=0.06]  approx fraction of ponds/streams
 * @property {number} [cliffCover=0.03]  approx fraction of mossy cliff ridges
 */

/** Minimum distance (tiles) of RANDOM deposits from start, so guaranteed ones define the nearest. */
const MIN_DIST_STONE = 14
const MIN_DIST_ORE = 36
const MIN_DIST_GLOWCAP = 44
const MIN_DIST_MOONSTONE = 48
/** walkable pockets smaller than this with no resources (not touching the map edge) are filled in rather than bridged */
const TINY_POCKET = 10

/** Scratch buffers reused across generateMap calls of the same map size (map resets, tests). */
let SCR = null
function scratch(N) {
  if (SCR === null || SCR.N !== N) {
    SCR = {
      N,
      fA: new Float32Array(N), fB: new Float32Array(N), score: new Float32Array(N), mask: new Uint8Array(N),
      walk: new Uint8Array(N), i0: new Int32Array(N), i1: new Int32Array(N), i2: new Int32Array(N),
      i3: new Int32Array(N), i4: new Int32Array(N), i5: new Int32Array(N),
    }
  }
  return SCR
}

/**
 * Fill `out` with fractal value noise in [0,1) (same character as rng.fbm). The value lattice
 * of each octave is hashed once into a small Float32Array, so the per-tile cost is a
 * bilinear smoothstep lookup per octave.
 */
function noiseField(out, w, h, seed, octaves, freq) {
  out.fill(0)
  const colX = new Int32Array(w), colS = new Float32Array(w)
  let amp = 1, norm = 0, f = freq
  for (let o = 0; o < octaves; o++) {
    const lw = Math.ceil(w * f) + 2, lh = Math.ceil(h * f) + 2
    const lat = new Float32Array(lw * lh)
    const s = seed + o * 1013
    for (let ly = 0; ly < lh; ly++) for (let lx = 0; lx < lw; lx++) lat[ly * lw + lx] = hash01(lx, ly, s) * amp
    // per-column lattice index and smoothstep weight (depend on x only)
    for (let x = 0; x < w; x++) {
      const fx = (x + 0.5) * f, x0 = fx | 0, tx = fx - x0
      colX[x] = x0
      colS[x] = tx * tx * (3 - 2 * tx)
    }
    let k = 0
    for (let y = 0; y < h; y++) {
      const fy = (y + 0.5) * f, y0 = fy | 0, ty = fy - y0
      const sy = ty * ty * (3 - 2 * ty)
      const r0 = y0 * lw, r1 = r0 + lw
      for (let x = 0; x < w; x++, k++) {
        const x0 = colX[x], sx = colS[x]
        const a = lat[r0 + x0], b = lat[r0 + x0 + 1], c = lat[r1 + x0], d = lat[r1 + x0 + 1]
        const top = a + (b - a) * sx
        out[k] += top + (c + (d - c) * sx - top) * sy
      }
    }
    norm += amp
    amp *= 0.5
    f *= 2
  }
  const inv = 1 / norm
  for (let i = 0; i < out.length; i++) out[i] *= inv
}

/**
 * Threshold t such that about `frac` of the tiles with mask[i] (or all when mask is null)
 * have score >= t. Scores are expected in [lo, hi). 2048-bin histogram.
 */
function topThreshold(score, mask, frac, lo, hi) {
  const BINS = 2048
  const hist = new Int32Array(BINS)
  const scale = BINS / (hi - lo)
  let n = 0
  for (let i = 0; i < score.length; i++) {
    if (mask !== null && mask[i] === 0) continue
    let b = ((score[i] - lo) * scale) | 0
    if (b < 0) b = 0; else if (b >= BINS) b = BINS - 1
    hist[b]++
    n++
  }
  const want = Math.round(n * frac)
  if (want <= 0) return Infinity
  let acc = 0
  for (let b = BINS - 1; b >= 0; b--) {
    acc += hist[b]
    if (acc >= want) return lo + b / scale
  }
  return lo
}

/**
 * Fill `world` (terrain, res, resAmt; occupancy untouched) from `seed`, set
 * world.start (packed tile at the map centre, the Hearth's centre tile) and world.seed.
 *
 * Guarantees (tests/world.test.mjs checks them):
 *  - Clearing: every tile within START.clearRadius (Euclidean) of start has walkable
 *    terrain (grass/moss/dirt) and NO resource, except the stamped grove and rocks.
 *  - START.grove rect (relative to start) is all R_TREE, START.rocks rect all R_STONE,
 *    at RESOURCES[r].amount each. Stamped AFTER the clearing is carved.
 *  - At least one R_ORE seam (>= 12 tiles) whose nearest tile is 18..32 tiles from start.
 *  - At least one R_GLOWCAP ring (>= 10 tiles) 18..40 tiles from start.
 *  - At least one R_MOONSTONE vein (>= 8 tiles) >= 45 tiles from start (any distance on small maps
 *    where that does not fit: as far as possible).
 *  - Overall mix on a 256x256 map: trees most common, then stone, ore, glowcap, moonstone rarest;
 *    every resource type present at least twice outside the clearing.
 *  - Every resource and the map edges are reachable on foot from start (no sealed pockets): carve
 *    gaps through water/cliff where flood fill finds unreachable walkable land, or convert it.
 *  - Deterministic: same (w, h, seed) -> byte-identical arrays.
 *  - Budget: < 150 ms for 512x512 in Node.
 *
 * @param {import('./world.js').World} world  freshly constructed World
 * @param {number} seed
 * @param {MapgenOptions} [opts]
 * @returns {{start:number, sx:number, sy:number}} packed start tile and its coords
 */
export function generateMap(world, seed, opts = {}) {
  seed >>>= 0
  const treeCover = opts.treeCover ?? 0.30
  const waterCover = opts.waterCover ?? 0.06
  const cliffCover = opts.cliffCover ?? 0.03
  const W = world.w, H = world.h, N = world.size, shift = world.shift
  const terrain = world.terrain, res = world.res, amt = world.resAmt
  const rng = new RNG((seed ^ 0x6d61703a) >>> 0)
  const sx = W >> 1, sy = H >> 1
  const start = (sy << shift) | sx
  const clearR = START.clearRadius
  const clearR2 = clearR * clearR

  // squared distance to start per tile is cheap to recompute; keep a helper inline
  const S = scratch(N)
  const fA = S.fA, fB = S.fB, score = S.score, mask = S.mask

  // ---------------------------------------------------------------- 1. water + cliffs
  terrain.fill(T_GRASS)
  res.fill(R_NONE)
  amt.fill(0)
  // ponds: low-frequency blobs; streams: thin ridge lines of a second field
  noiseField(fA, W, H, seed + 11, 3, 1 / 40)
  noiseField(fB, W, H, seed + 23, 2, 1 / 90)
  const pondFrac = waterCover * 0.6, streamFrac = waterCover - pondFrac
  // keep the start surroundings dry so the clearing does not sit in a lake
  for (let i = 0; i < N; i++) {
    const dx = (i & world.mask) - sx, dy = (i >> shift) - sy
    const d2 = dx * dx + dy * dy
    const damp = d2 < 400 ? 0.35 : d2 < 900 ? 0.15 : 0
    score[i] = fA[i] - damp
  }
  let thr = topThreshold(score, null, pondFrac, -0.5, 1)
  for (let i = 0; i < N; i++) if (score[i] >= thr) terrain[i] = T_WATER
  for (let i = 0; i < N; i++) {
    const r = fB[i] - 0.5
    score[i] = terrain[i] === T_WATER ? -1 : -(r < 0 ? -r : r) // higher = closer to the ridge line
  }
  thr = topThreshold(score, null, streamFrac, -0.5, 0)
  // brooks are broken into reaches: ~30% of 8x8 blocks keep a dry crossing (fords keep
  // detours, and therefore path searches, short)
  for (let i = 0; i < N; i++) {
    if (score[i] < thr) continue
    const x = i & world.mask, y = i >> shift
    if (hash01(x >> 3, y >> 3, seed + 91) < 0.3) continue
    terrain[i] = T_WATER
  }
  // cliffs: ridge lines of a third field, only where a mask field is high (broken ridges)
  noiseField(fA, W, H, seed + 37, 2, 1 / 28)
  noiseField(fB, W, H, seed + 41, 2, 1 / 64)
  for (let i = 0; i < N; i++) {
    if (terrain[i] !== T_GRASS) { score[i] = -9; continue }
    const r = fA[i] - 0.5
    score[i] = fB[i] * 1.2 - (r < 0 ? -r : r) * 4
  }
  thr = topThreshold(score, null, cliffCover, -9, 2)
  for (let i = 0; i < N; i++) if (score[i] >= thr) terrain[i] = T_CLIFF

  // ---------------------------------------------------------------- 2+3. ground cover + forest
  noiseField(fA, W, H, seed + 53, 3, 1 / 22) // forest density
  noiseField(fB, W, H, seed + 67, 3, 1 / 14) // ground cover
  for (let i = 0; i < N; i++) {
    const x = i & world.mask, y = i >> shift
    const dx = x - sx, dy = y - sy
    const eligible = terrain[i] === T_GRASS && dx * dx + dy * dy > (clearR + 2) * (clearR + 2)
    mask[i] = eligible ? 1 : 0
    score[i] = fA[i] + (hash01(x, y, seed + 71) - 0.5) * 0.10
  }
  thr = topThreshold(score, mask, treeCover, -0.1, 1.1)
  const treeAmt = RESOURCES[R_TREE].amount
  for (let i = 0; i < N; i++) {
    if (terrain[i] !== T_GRASS) continue
    if (mask[i] === 1 && score[i] >= thr) { res[i] = R_TREE; amt[i] = treeAmt }
    // moss under canopy and in damp hollows, dirt in dry patches
    const g = fB[i]
    if (score[i] >= thr - 0.06 || g > 0.68) terrain[i] = T_MOSS
    else if (g < 0.24) terrain[i] = T_DIRT
  }

  // ---------------------------------------------------------------- 4. random deposits
  const areaK = N / 65536
  const count = (base) => Math.max(2, Math.round(base * areaK))
  const minDim = Math.min(W, H)
  // Deposits that cannot keep the usual distance on small maps fall back to "outside the clearing".
  // Ore and glowcap never do: their guaranteed deposits must stay the nearest ones.
  const fit = (d) => (d < minDim * 0.42 ? d : clearR + 4)
  scatter(R_STONE, count(30), fit(MIN_DIST_STONE), stoneBlob)
  scatter(R_ORE, count(13), MIN_DIST_ORE, seam)
  scatter(R_GLOWCAP, count(6), MIN_DIST_GLOWCAP, ring)
  scatter(R_MOONSTONE, count(5), fit(MIN_DIST_MOONSTONE), vein)

  // ---------------------------------------------------------------- 5. guaranteed deposits
  const a0 = rng.float() * Math.PI * 2
  // ore: seam pointing away from start, first tile ~21 tiles out
  guaranteedSeam(R_ORE, a0, 21, 12, 2, 18, 32)
  // a second, slightly farther seam a quarter turn away (two forges' worth of ore early on)
  guaranteedSeam(R_ORE, a0 - Math.PI * 0.5, 27, 10, 2, 18, 40)
  // glowcap ring on the opposite side, centre ~26 out
  guaranteedRing(a0 + Math.PI * (0.8 + rng.float() * 0.4), 26, 18, 40)
  // moonstone: far, as far as the map allows
  const farMax = Math.min(sx, sy, W - 1 - sx, H - 1 - sy) * Math.SQRT2 - 6
  const moonD = Math.max(clearR + 8, Math.min(62, farMax - 3))
  // aim at a diagonal (corners are the farthest on small maps)
  const quad = rng.int(4)
  guaranteedSeam(R_MOONSTONE, Math.PI / 4 + quad * Math.PI / 2 + (rng.float() - 0.5) * 0.4, moonD, 6, 2, Math.min(45, moonD - 1), 1e9)

  // ---------------------------------------------------------------- 6. clearing + START stamps
  for (let y = sy - clearR; y <= sy + clearR; y++) {
    if (y < 0 || y >= H) continue
    for (let x = sx - clearR; x <= sx + clearR; x++) {
      if (x < 0 || x >= W) continue
      const dx = x - sx, dy = y - sy, d2 = dx * dx + dy * dy
      if (d2 > clearR2) continue
      const i = (y << shift) | x
      res[i] = R_NONE
      amt[i] = 0
      // trampled dirt yard around the Hearth, grass beyond, a little moss at the rim
      terrain[i] = d2 <= 9 ? T_DIRT : d2 >= (clearR - 1.5) * (clearR - 1.5) && hash01(x, y, seed + 5) < 0.5 ? T_MOSS : T_GRASS
    }
  }
  stampRect(START.grove, T_MOSS)
  stampRect(START.rocks, T_GRASS)

  // ---------------------------------------------------------------- 7. connectivity
  connect()

  // ---------------------------------------------------------------- 8. edges
  // the Blight must be able to spawn on every side: make sure each edge has walkable stretches
  let carved = 0
  for (let side = 0; side < 4; side++) carved += ensureEdge(side)
  if (carved > 0) connect() // an inlet may have opened onto a pocket that was sealed

  world.start = start
  world.seed = seed
  world.rebuildDerived()
  return { start, sx, sy }

  // ================================================================== helpers (hoisted)

  function walkableT(i) { return TERRAIN_WALKABLE[terrain[i]] === 1 }

  function put(x, y, r, minD2, force) {
    if (x < 1 || y < 1 || x >= W - 1 || y >= H - 1) return 0
    const dx = x - sx, dy = y - sy
    if (dx * dx + dy * dy < minD2) return 0
    const i = (y << shift) | x
    if (!walkableT(i)) {
      if (!force) return 0
      terrain[i] = r === R_ORE ? T_MOSS : T_DIRT
    }
    if (res[i] === r) return 0
    res[i] = r
    amt[i] = RESOURCES[r].amount
    return 1
  }

  /** Place `n` random deposits of `r` at least `minD` from start using `shape`. */
  function scatter(r, n, minD, shape) {
    const minD2 = minD * minD
    let placed = 0
    for (let attempt = 0; attempt < n * 12 && placed < n; attempt++) {
      const cx = 4 + rng.int(W - 8), cy = 4 + rng.int(H - 8)
      const dx = cx - sx, dy = cy - sy
      if (dx * dx + dy * dy < (minD + 3) * (minD + 3)) continue
      if (!walkableT((cy << shift) | cx)) continue
      if (shape(r, cx, cy, minD2, false) > 0) placed++
    }
  }

  function stoneBlob(r, cx, cy, minD2, force) {
    const R = 1.6 + rng.float() * 2.2
    const s = rng.nextU32() & 0xffff
    let n = 0
    const ir = Math.ceil(R + 1)
    for (let y = cy - ir; y <= cy + ir; y++) for (let x = cx - ir; x <= cx + ir; x++) {
      const dx = x - cx, dy = y - cy
      const rr = R + (hash01(x, y, s) - 0.5) * 1.4
      if (dx * dx + dy * dy <= rr * rr) n += put(x, y, r, minD2, force)
    }
    return n
  }

  function walk(r, cx, cy, ang, len, width, minD2, force, bend) {
    let x = cx + 0.5, y = cy + 0.5, n = 0
    for (let k = 0; k < len; k++) {
      const ix = Math.floor(x), iy = Math.floor(y)
      n += put(ix, iy, r, minD2, force)
      if (width > 1) {
        // thicken perpendicular to the direction
        const px = Math.round(-Math.sin(ang)), py = Math.round(Math.cos(ang))
        n += put(ix + px, iy + py, r, minD2, force)
        if (width > 2 && rng.float() < 0.5) n += put(ix - px, iy - py, r, minD2, force)
      }
      x += Math.cos(ang)
      y += Math.sin(ang)
      ang += (rng.float() - 0.5) * bend
    }
    return n
  }

  function seam(r, cx, cy, minD2, force) {
    return walk(r, cx, cy, rng.float() * Math.PI * 2, 8 + rng.int(9), 2 + (rng.float() < 0.3 ? 1 : 0), minD2, force, 0.7)
  }

  function vein(r, cx, cy, minD2, force) {
    return walk(r, cx, cy, rng.float() * Math.PI * 2, 4 + rng.int(4), 2, minD2, force, 0.9)
  }

  function ring(r, cx, cy, minD2, force) {
    const R = 2 + rng.float() * 0.9
    let n = 0
    const ir = Math.ceil(R + 1)
    for (let y = cy - ir; y <= cy + ir; y++) for (let x = cx - ir; x <= cx + ir; x++) {
      const dx = x - cx, dy = y - cy
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d >= R - 0.8 && d <= R + 0.6) n += put(x, y, r, minD2, force)
    }
    // a lone cap in the middle of larger rings
    if (R > 2.6) n += put(cx, cy, r, minD2, force)
    return n
  }

  /** Clamp a point to the map interior (margin m). */
  function clampX(x, m) { return x < m ? m : x > W - 1 - m ? W - 1 - m : x }
  function clampY(y, m) { return y < m ? m : y > H - 1 - m ? H - 1 - m : y }

  /**
   * Radial seam of `r` starting `d0` tiles out at angle `ang`; tiles closer than `lo` are skipped;
   * keeps extending (bounded) until at least `minTiles` placed.
   */
  function guaranteedSeam(r, ang, d0, minTiles, width, lo, hi) {
    const minD2 = lo * lo
    let x = clampX(Math.round(sx + Math.cos(ang) * d0), 3), y = clampY(Math.round(sy + Math.sin(ang) * d0), 3)
    // direction: outward from start, bent a little
    let dirA = Math.atan2(y - sy, x - sx) + (rng.float() - 0.5) * 0.6
    let n = 0
    let fx = x + 0.5, fy = y + 0.5
    for (let k = 0; k < 40 && n < minTiles + 4; k++) {
      const ix = Math.floor(fx), iy = Math.floor(fy)
      const dx = ix - sx, dy = iy - sy, d2 = dx * dx + dy * dy
      if (d2 <= hi * hi || n < minTiles) {
        n += put(ix, iy, r, minD2, true)
        if (width > 1) n += put(ix + Math.round(-Math.sin(dirA)), iy + Math.round(Math.cos(dirA)), r, minD2, true)
      }
      let nx = fx + Math.cos(dirA), ny = fy + Math.sin(dirA)
      if (nx < 2 || ny < 2 || nx > W - 3 || ny > H - 3) {
        // bounce along the edge rather than leaving the map
        dirA += Math.PI / 2
        nx = fx + Math.cos(dirA); ny = fy + Math.sin(dirA)
      }
      fx = nx; fy = ny
      dirA += (rng.float() - 0.5) * 0.5
    }
    return n
  }

  function guaranteedRing(ang, d0, lo, hi) {
    const R = 2.6
    const cx = clampX(Math.round(sx + Math.cos(ang) * d0), 5), cy = clampY(Math.round(sy + Math.sin(ang) * d0), 5)
    const minD2 = lo * lo
    let n = 0
    for (let y = cy - 4; y <= cy + 4; y++) for (let x = cx - 4; x <= cx + 4; x++) {
      const dx = x - cx, dy = y - cy
      const d = Math.sqrt(dx * dx + dy * dy)
      const ex = x - sx, ey = y - sy
      if (ex * ex + ey * ey > hi * hi) continue
      if (d >= R - 0.8 && d <= R + 0.6) n += put(x, y, R_GLOWCAP, minD2, true)
    }
    put(cx, cy, R_GLOWCAP, minD2, true)
    return n
  }

  function stampRect(def, ground) {
    const amount = RESOURCES[def.res].amount
    for (let y = sy + def.dy; y < sy + def.dy + def.h; y++) {
      if (y < 0 || y >= H) continue
      for (let x = sx + def.dx; x < sx + def.dx + def.w; x++) {
        if (x < 0 || x >= W) continue
        const i = (y << shift) | x
        if (!walkableT(i)) terrain[i] = ground
        else if (terrain[i] === T_DIRT && ground === T_MOSS) terrain[i] = T_MOSS
        res[i] = def.res
        amt[i] = amount
      }
    }
  }

  /**
   * Make every walkable tile reachable from start. 0-1 BFS (deque in an Int32Array of 2N)
   * where entering a blocked tile costs 1; then each unreached walkable component is either
   * filled (tiny, no resources) or joined by converting the blocked tiles on its cheapest
   * crossing (water -> dirt ford, cliff -> moss pass).
   */
  function connect() {
    const walk = S.walk
    for (let i = 0; i < N; i++) walk[i] = TERRAIN_WALKABLE[terrain[i]]
    const dist = S.i0.fill(0x7fffffff)
    const par = S.i1.fill(-1)
    // layered 0-1 BFS: flood zero-cost (walkable) tiles within a level, collect the next level
    let cur = S.i2, nxt = S.i3
    let curLen = 0, nxtLen = 0, level = 0
    dist[start] = 0
    cur[curLen++] = start
    while (curLen > 0) {
      for (let h = 0; h < curLen; h++) {
        const i = cur[h]
        if (dist[i] !== level) continue
        const x = i & world.mask, y = i >> shift
        for (let d = 0; d < 4; d++) {
          let j
          if (d === 0) { if (x === 0) continue; j = i - 1 } else if (d === 1) { if (x === W - 1) continue; j = i + 1 } else if (d === 2) { if (y === 0) continue; j = i - W } else { if (y === H - 1) continue; j = i + W }
          if (walk[j] === 1) {
            if (dist[j] > level) { dist[j] = level; par[j] = i; cur[curLen++] = j }
          } else if (dist[j] > level + 1) { dist[j] = level + 1; par[j] = i; nxt[nxtLen++] = j }
        }
      }
      const t = cur; cur = nxt; nxt = t
      curLen = nxtLen; nxtLen = 0
      level++
    }
    // label walkable components (4-connected) with a plain BFS; comp 0 = start's
    const comp = S.i4.fill(-1)
    const q = S.i5
    const compSize = [], compRes = [], compSeed = [], compEdge = []
    let nc = 0
    for (let s = 0; s < N; s++) {
      if (comp[s] >= 0 || walk[s] !== 1) continue
      let qh = 0, qt = 0, size = 0, hasRes = 0, edge = 0
      q[qt++] = s
      comp[s] = nc
      while (qh < qt) {
        const i = q[qh++]
        size++
        if (res[i] !== R_NONE) hasRes = 1
        const x = i & world.mask, y = i >> shift
        if (x === 0 || y === 0 || x === W - 1 || y === H - 1) edge = 1
        if (x > 0 && comp[i - 1] < 0 && walk[i - 1] === 1) { comp[i - 1] = nc; q[qt++] = i - 1 }
        if (x < W - 1 && comp[i + 1] < 0 && walk[i + 1] === 1) { comp[i + 1] = nc; q[qt++] = i + 1 }
        if (y > 0 && comp[i - W] < 0 && walk[i - W] === 1) { comp[i - W] = nc; q[qt++] = i - W }
        if (y < H - 1 && comp[i + W] < 0 && walk[i + W] === 1) { comp[i + W] = nc; q[qt++] = i + W }
      }
      compSize.push(size); compRes.push(hasRes); compSeed.push(s); compEdge.push(edge)
      nc++
    }
    if (nc <= 1) return
    const startComp = comp[start]
    const joined = new Uint8Array(nc)
    joined[startComp] = 1
    // process components nearest-first so far ones can reuse the fords of near ones
    const order = []
    for (let c = 0; c < nc; c++) if (c !== startComp) order.push(c)
    order.sort((a, b) => dist[compSeed[a]] - dist[compSeed[b]] || a - b)
    for (let k = 0; k < order.length; k++) {
      const c = order[k]
      if (joined[c]) continue
      if (compSize[c] < TINY_POCKET && compRes[c] === 0 && compEdge[c] === 0) {
        fillComponent(compSeed[c], comp, c, q)
        joined[c] = 1
        continue
      }
      // trace the cheapest crossing back toward start
      let i = compSeed[c]
      while (i >= 0) {
        const ci = comp[i]
        if (ci >= 0) {
          if (ci !== c && joined[ci]) break
          joined[ci] = 1
        } else {
          const t = terrain[i]
          terrain[i] = t === T_CLIFF ? T_MOSS : T_DIRT
          comp[i] = c
        }
        i = par[i]
      }
      joined[c] = 1
    }
  }

  function fillComponent(seedTile, comp, c, q) {
    let qh = 0, qt = 0
    q[qt++] = seedTile
    const fillT = [] // decided per tile from neighbours
    while (qh < qt) {
      const i = q[qh++]
      fillT.push(i)
      const x = i & world.mask, y = i >> shift
      if (x > 0 && comp[i - 1] === c) { comp[i - 1] = -2; q[qt++] = i - 1 }
      if (x < W - 1 && comp[i + 1] === c) { comp[i + 1] = -2; q[qt++] = i + 1 }
      if (y > 0 && comp[i - W] === c) { comp[i - W] = -2; q[qt++] = i - W }
      if (y < H - 1 && comp[i + W] === c) { comp[i + W] = -2; q[qt++] = i + W }
      comp[i] = -2
    }
    for (let k = 0; k < fillT.length; k++) {
      const i = fillT[k]
      const x = i & world.mask, y = i >> shift
      let t = T_WATER
      if (x > 0 && terrain[i - 1] === T_CLIFF) t = T_CLIFF
      else if (x < W - 1 && terrain[i + 1] === T_CLIFF) t = T_CLIFF
      else if (y > 0 && terrain[i - W] === T_CLIFF) t = T_CLIFF
      else if (y < H - 1 && terrain[i + W] === T_CLIFF) t = T_CLIFF
      terrain[i] = t
    }
  }

  /** At least ~a third of each edge row must be walkable; open gaps in blocked stretches. */
  function ensureEdge(side) {
    let carved = 0
    const len = side === 0 || side === 2 ? W : H
    // edgeTile scans +-16 laterally, so every aligned 12-wide stretch needs a walkable tile
    for (let p = 0; p < len; p += 12) {
      // is there a walkable tile within 8 deep in this stretch?
      let ok = false
      for (let depth = 0; depth <= 8 && !ok; depth++) {
        for (let q = p; q < p + 12 && q < len; q++) {
          if (walkableT(edgeIdx(side, q, depth))) { ok = true; break }
        }
      }
      if (ok) continue
      // carve a short inlet in the middle of the stretch
      const q = Math.min(len - 1, p + 6)
      for (let depth = 0; depth <= 8; depth++) {
        const i = edgeIdx(side, q, depth)
        if (walkableT(i)) break
        terrain[i] = terrain[i] === T_CLIFF ? T_MOSS : T_DIRT
        carved++
      }
    }
    return carved
  }

  function edgeIdx(side, q, depth) {
    let x, y
    if (side === 0) { x = q; y = depth } else if (side === 2) { x = q; y = H - 1 - depth } else if (side === 1) { x = W - 1 - depth; y = q } else { x = depth; y = q }
    return (y << shift) | x
  }
}

/**
 * Debug helper: ASCII dump of a world region (one char per tile). Not used by the game.
 * '.' grass ',' moss ':' dirt '~' water '#' cliff 'T' tree 'o' stone '%' ore '*' glowcap '@' moonstone
 */
export function asciiMap(world, x0 = 0, y0 = 0, w = world.w, h = world.h) {
  const TER = '.,:~#'
  const RES = ' To%*@'
  let s = ''
  for (let y = y0; y < y0 + h && y < world.h; y++) {
    for (let x = x0; x < x0 + w && x < world.w; x++) {
      const i = world.idx(x, y)
      s += world.res[i] !== R_NONE ? RES[world.res[i]] : TER[world.terrain[i]]
    }
    s += '\n'
  }
  return s
}
