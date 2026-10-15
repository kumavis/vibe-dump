import { Noise2D } from '../core/noise.js'
import { Rng } from '../core/rng.js'
import { clamp, lerp, smoothstep, segDist } from '../core/mathx.js'

// The island as pure data — no three.js in here. Heights, water, biomes and
// vegetation densities live on one grid (the terrain vertex grid), so the mesh,
// the physics, the stealth model ("how much cover is this tall grass?") and the
// AI all read the same truth.

export const BIOME_NAMES = ['beach', 'grass', 'jungle', 'swamp', 'highland', 'rock']

const NO_WATER = -1e4

// The river mouth, overridable per island as cfg.river.mouth: the last `tidal`
// m before the coast sit at sea level, the surface comes down to it at
// `grade`, and over `length` m upstream of that the channel widens
// (×1+widen), shoals, and its banks lie back to `opens` half-widths as low
// sand instead of levees; the meander shrinks to `meander` of its swing.
const MOUTH = { tidal: 35, length: 130, grade: 0.045, widen: 1.2, shoal: 0.35, opens: 7, meander: 0.35 }

// River water stands on grid vertices within WET half-widths of the centre;
// the surface keeps BANK m under the lower bank, cutting down at most to its
// own level CUT m downstream, and the cut changes by at most EASE of the
// profile's own fall a sample (see carveRiver).
const WET = 1.3
const BANK = 0.4
const CUT = 20
const EASE = 0.25

// The inland sheet's dry corners sit this far under their own ground, so the
// sheet always ends against the bank, waves and all (water.js: ±0.11 m).
const SINK = 0.15

// The levee settleWater banks a dry corner of the sheet up to: `height` m over
// the water, and on the river's banks (within `reach` half-widths of its
// centre) `rise` m more per half-width past the last wet corner, at most
// `most` m more: the slope carveRiver gives the river's own banks.
const LEVEE = { height: 0.2, rise: 0.9, most: 0.6, reach: 4.5 }

// A wreck's lot beside the road (see world/structures.js WRECKS for the
// models): how far off the centreline it sits, and its body's footprint.
const WRECK_LOT = { jeep: { off: 6.2, length: 4.4, width: 1.9 }, truck: { off: 7.5, length: 6.0, width: 2.2 } }

// A grid value inside cell (i, j) at (fx, fz), linear on the cell's two
// triangles — the split the terrain mesh draws (see terrain.js winding).
function triangle(arr, n, i, j, fx, fz) {
  const a = arr[j * n + i]
  const b = arr[(j + 1) * n + i]
  const c = arr[j * n + i + 1]
  const d = arr[(j + 1) * n + i + 1]
  if (fx + fz <= 1) return a + (c - a) * fx + (b - a) * fz
  return d + (b - d) * (1 - fx) + (c - d) * (1 - fz)
}

// cumulative distance along a polyline of [x, z] points
function alongOf(pts) {
  const out = new Float32Array(pts.length)
  for (let k = 1; k < pts.length; k++) out[k] = out[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1])
  return out
}

export class Island {
  constructor(cfg) {
    this.cfg = cfg
    this.size = cfg.size
    this.seg = cfg.seg
    this.n = cfg.seg + 1
    this.cell = cfg.size / cfg.seg
    this.half = cfg.size / 2
    this.sea = cfg.seaLevel
    const N = this.n * this.n
    const f = () => new Float32Array(N)
    this.h = f()
    this.water = new Float32Array(N).fill(NO_WATER)
    this.level = new Float32Array(N).fill(NO_WATER) // surface of the nearest inland water, over its valley
    this.surface = new Float32Array(N).fill(NO_WATER) // the inland water sheet as drawn (settleWater)
    this.riverD = new Float32Array(N).fill(1e4) // distance to river centre / half width
    this.riverM = new Float32Array(N).fill(1e4) // distance to river centre in metres
    this.riverE = f() // 1 where the river opens into its estuary (sandy, no levees)
    this.moist = f()
    this.slope = f()
    this.road = f()
    this.clear = f() // 1 = keep clear of vegetation (POIs, roads)
    this.w = {} // biome weights
    for (const b of BIOME_NAMES) this.w[b] = f()
    this.d = {} // vegetation densities, 0..1
    for (const v of ['canopy', 'palm', 'broadleaf', 'pine', 'fern', 'bush', 'grass', 'reed', 'rock', 'bigleaf', 'log'])
      this.d[v] = f()
    this.cover = f()

    this.noise = new Noise2D(cfg.seed)
    this.noiseB = new Noise2D(cfg.seed + 7)
    this.rng = new Rng(cfg.seed)
    this.pois = []
    this.roads = []
    this.bridges = []
    this.wrecks = []
    this.river = null
    this.lake = null

    this.generateBase()
    this.carveRiver()
    this.carveLake()
    this.settleWater()
    this.placePois()
    this.buildRoads()
    this.settleWater() // the roads re-shape some banks
    this.computeSlope()
    this.computeBiomes()
    this.computeDensities()
    this.placeWrecks()
  }

  // ---------------------------------------------------------------- grid utils
  idx(i, j) {
    return j * this.n + i
  }
  xOf(i) {
    return -this.half + i * this.cell
  }
  forEachInBox(minX, minZ, maxX, maxZ, fn) {
    const i0 = Math.max(0, Math.floor((minX + this.half) / this.cell))
    const i1 = Math.min(this.n - 1, Math.ceil((maxX + this.half) / this.cell))
    const j0 = Math.max(0, Math.floor((minZ + this.half) / this.cell))
    const j1 = Math.min(this.n - 1, Math.ceil((maxZ + this.half) / this.cell))
    for (let j = j0; j <= j1; j++) {
      const z = this.xOf(j)
      for (let i = i0; i <= i1; i++) fn(this.idx(i, j), this.xOf(i), z)
    }
  }

  // Height exactly matching the rendered triangles (see terrain.js winding).
  heightAt(x, z) {
    const gx = (x + this.half) / this.cell
    const gz = (z + this.half) / this.cell
    if (gx < 0 || gz < 0 || gx >= this.seg || gz >= this.seg) return -30
    const i = Math.floor(gx)
    const j = Math.floor(gz)
    return triangle(this.h, this.n, i, j, gx - i, gz - j)
  }

  sample(arr, x, z) {
    const gx = clamp((x + this.half) / this.cell, 0, this.seg - 0.001)
    const gz = clamp((z + this.half) / this.cell, 0, this.seg - 0.001)
    const i = Math.floor(gx)
    const j = Math.floor(gz)
    const fx = gx - i
    const fz = gz - j
    const n = this.n
    const a = arr[j * n + i]
    const b = arr[j * n + i + 1]
    const c = arr[(j + 1) * n + i]
    const d = arr[(j + 1) * n + i + 1]
    return lerp(lerp(a, b, fx), lerp(c, d, fx), fz)
  }

  // Water surface at a point. The ocean is everywhere at sea level; rivers and
  // the lake sit above it on their own surfaces. Inland that is the sheet the
  // player sees (settleWater), on the same triangles as the ground, so the
  // depth is the water's own: zero exactly at the drawn waterline, and on a
  // steep reach the surface the swimmer floats on is the one sliding past.
  waterAt(x, z) {
    const gx = (x + this.half) / this.cell
    const gz = (z + this.half) / this.cell
    let s = this.sea
    if (gx >= 0 && gz >= 0 && gx < this.seg && gz < this.seg) {
      const i = Math.floor(gx)
      const j = Math.floor(gz)
      const n = this.n
      const w = this.water
      const a = j * n + i
      if (Math.max(w[a], w[a + 1], w[a + n], w[a + n + 1]) > s + 0.01) {
        const m = triangle(this.surface, n, i, j, gx - i, gz - j)
        if (m > s) s = m
      }
    }
    return s
  }

  // How deep the water is over the ground here (<= 0 means dry).
  depthAt(x, z) {
    return this.waterAt(x, z) - this.heightAt(x, z)
  }

  normalAt(x, z, out) {
    const e = 1.5
    const hx = this.heightAt(x + e, z) - this.heightAt(x - e, z)
    const hz = this.heightAt(x, z + e) - this.heightAt(x, z - e)
    const nx = -hx
    const ny = 2 * e
    const nz = -hz
    const l = Math.hypot(nx, ny, nz)
    out.x = nx / l
    out.y = ny / l
    out.z = nz / l
    return out
  }

  biomeAt(x, z) {
    let best = 'grass'
    let bw = -1
    for (const b of BIOME_NAMES) {
      const v = this.sample(this.w[b], x, z)
      if (v > bw) {
        bw = v
        best = b
      }
    }
    if (this.heightAt(x, z) < this.sea - 0.3) return 'ocean'
    return best
  }

  coverAt(x, z) {
    return this.sample(this.cover, x, z)
  }

  isLand(x, z, margin = 0.3) {
    return this.depthAt(x, z) < margin
  }

  // ---------------------------------------------------------------- generation
  generateBase() {
    const { radius: R, mountain: M, plains: P } = this.cfg
    const n = this.noise
    const nb = this.noiseB
    for (let j = 0; j < this.n; j++) {
      const z = this.xOf(j)
      for (let i = 0; i < this.n; i++) {
        const x = this.xOf(i)
        const wx = x + 150 * n.fbm(x * 0.0011, z * 0.0011, 3)
        const wz = z + 150 * n.fbm(x * 0.0011 + 40, z * 0.0011 - 30, 3)
        const r = Math.hypot(wx, wz * 1.05) / R
        const land = 1 - smoothstep(0.7, 1.02, r)
        let h = lerp(-24, 5, land)
        h += (nb.fbm(x * 0.0024 + 7, z * 0.0024 + 3, 4) * 0.5 + 0.5) * 36 * land * land
        h += n.fbm(x * 0.013, z * 0.013, 3) * 3 * land
        const dm = Math.hypot(x - M.x, z - M.z)
        h += M.height * Math.exp(-((dm / M.spread) ** 2)) * land
        h += 32 * nb.ridged(x * 0.0055, z * 0.0055, 4) * Math.exp(-((dm / (M.spread * 1.35)) ** 2)) * land
        h -= M.crater * Math.exp(-((dm / 58) ** 2))
        const dp = Math.hypot(x - P.x, z - P.z) / P.radius
        const pf = (1 - smoothstep(0.5, 1.0, dp)) * land
        h = lerp(h, P.height + nb.fbm(x * 0.006, z * 0.006, 2) * 3, pf * 0.85)
        // squash the band just above sea level into wide, gentle beaches
        if (h > 0 && h < 6) h = 6 * Math.pow(h / 6, 1.7)
        this.h[this.idx(i, j)] = h
      }
    }
  }

  carveRiver() {
    const cfg = this.cfg.river
    // Catmull-Rom through the control points, then meander.
    const pts = cfg.points
    const path = []
    for (let k = 0; k < pts.length - 1; k++) {
      const p0 = pts[Math.max(0, k - 1)]
      const p1 = pts[k]
      const p2 = pts[k + 1]
      const p3 = pts[Math.min(pts.length - 1, k + 2)]
      const len = Math.hypot(p2[0] - p1[0], p2[1] - p1[1])
      const steps = Math.max(2, Math.ceil(len / 6))
      for (let s = 0; s < steps; s++) {
        const t = s / steps
        const t2 = t * t
        const t3 = t2 * t
        const cr = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3)
        path.push([cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])])
      }
    }
    path.push(pts[pts.length - 1].slice())
    const sea = this.sea
    const M = { ...MOUTH, ...cfg.mouth }
    const tidal = M.tidal
    const flare = M.length
    const opensTo = M.opens
    // meander perpendicular to the flow. Offsets are taken off the smooth
    // spline, not the already-shifted points (which fed back into a zig-zag
    // of blobs), and relax near the coast so the mouth runs out fairly straight.
    const base = path.map((p) => p.slice())
    const alongBase = alongOf(base)
    let seaB = base.findIndex(([x, z]) => this.heightAt(x, z) < sea)
    if (seaB < 0) seaB = base.length - 1
    let acc = 0
    for (let k = 1; k < path.length - 1; k++) {
      const dx = base[k + 1][0] - base[k - 1][0]
      const dz = base[k + 1][1] - base[k - 1][1]
      const l = Math.hypot(dx, dz) || 1
      acc += 6
      const relax = lerp(M.meander, 1, smoothstep(0, 160, alongBase[seaB] - alongBase[k]))
      const off = this.noiseB.noise(acc * 0.006, 3.3) * 28 * relax
      path[k][0] += (-dz / l) * off
      path[k][1] += (dx / l) * off
    }
    // The channel ends a little past the coast, once the seabed is deeper than
    // its bed — carving on out to the last control point only built levees
    // across the seabed.
    let line = path.map(([x, z]) => this.heightAt(x, z))
    let coast = line.findIndex((h) => h < sea)
    if (coast >= 0) {
      let end = coast
      while (end < path.length - 1 && line[end] > sea - cfg.depth - 1.5) end++
      path.length = Math.min(path.length, end + 3)
      line = line.slice(0, path.length)
    } else coast = path.length - 1
    const K = path.length
    const along = alongOf(path)
    // estuary factor: 0 upstream, 1 over the last `tidal` metres to the coast
    const est = new Float32Array(K)
    for (let k = 0; k < K; k++) est[k] = 1 - smoothstep(tidal, tidal + flare, along[coast] - along[k])

    const widths = new Float32Array(K)
    for (let k = 0; k < K; k++) {
      widths[k] = lerp(cfg.widthStart, cfg.widthEnd, k / (K - 1)) * (1 + 0.25 * this.noise.noise(k * 0.05, 9.1))
      widths[k] *= 1 + M.widen * est[k] * est[k] // the mouth flares
    }

    // The channel has to hold its water at the grid's resolution, not just on
    // its centreline. Upstream the river is narrower than a cell, so a wet cell
    // reaches grid corners well past its bank, and where the land falls away
    // across the flow (it slants down the mountain's flank) those corners stood
    // below the surface and the water spilled out over them. So the surface
    // also holds under the lower bank, out to the farthest corner a wet cell
    // reaches, and the river cuts into the hillside instead of perching on it,
    // but never deeper than its own level CUT m downstream, so a steep reach
    // takes up most of the cut. It holds wherever a bank is that low, plains
    // included: on the home island the cut is over before them, on other seeds
    // it can lower a stretch of the plains river. What it leaves (the outside
    // of the bend at the foot of the mountain lies lower than even the plains
    // river) settleWater banks up. The estuary has its own, gentler bank cap
    // below.
    const natural = new Float32Array(K)
    let run = Infinity
    for (let k = 0; k < K; k++) natural[k] = run = Math.min(run - 0.03, line[k] - 1.2)
    const hold = new Float32Array(K).fill(Infinity)
    const downOf = new Int32Array(K) // the sample CUT m downstream
    for (let k = 0, down = 0; k < K; k++) {
      while (down < K - 1 && along[down] < along[k] + CUT) down++
      downOf[k] = down
      if (est[k] > 0.01) continue
      const kk = Math.min(K - 1, k + 1)
      const k0 = Math.max(0, k - 1)
      const dx = path[kk][0] - path[k0][0]
      const dz = path[kk][1] - path[k0][1]
      const l = Math.hypot(dx, dz) || 1
      const hw = widths[k] / 2
      const far = hw * WET + this.cell * Math.SQRT2
      let low = Infinity
      for (const side of [-1, 1]) {
        for (let o = hw; o <= far; o += 1.5) {
          low = Math.min(low, this.heightAt(path[k][0] - (dz / l) * o * side, path[k][1] + (dx / l) * o * side))
        }
      }
      // ...plus the 3 cm a sample the profile falls anyway, so the cut rejoins it
      // there
      hold[k] = Math.max(low - BANK, natural[down] + (down - k) * 0.03)
    }

    // surface profile: always downhill, at least a metre below the land
    const surf = new Float32Array(K)
    const nat = new Float32Array(K)
    const cap = new Float32Array(K)
    let prev = Infinity
    for (let k = 0; k < K; k++) {
      prev = Math.min(prev - 0.03, line[k] - 1.2)
      surf[k] = nat[k] = Math.max(prev, sea)
      // near the coast the river comes down to the sea on a steady grade
      // instead of dropping off the coastal bluff, and never sits above its
      // own banks (which used to need levees across the beach)
      cap[k] = sea + Math.max(0, along[coast] - along[k] - tidal) * M.grade
      if (est[k] > 0.01) {
        const kk = Math.min(K - 1, k + 1)
        const k0 = Math.max(0, k - 1)
        const dx = path[kk][0] - path[k0][0]
        const dz = path[kk][1] - path[k0][1]
        const l = Math.hypot(dx, dz) || 1
        let low = Infinity
        for (const side of [-1, 1]) {
          for (const nd of [1.15, 1.5, 1.9]) {
            const o = (side * nd * widths[k]) / 2
            low = Math.min(low, this.heightAt(path[k][0] - (dz / l) * o, path[k][1] + (dx / l) * o))
          }
        }
        cap[k] = Math.min(cap[k], Math.max(sea, low - 0.3))
      }
      surf[k] = Math.min(surf[k], cap[k])
    }
    // ...but only on the coastal reach where the grade actually bites. Walking
    // up from the coast, the cap is lifted from the first sample above the
    // estuary where the natural profile already runs under it; the two meet
    // there, so the hand-off is level, and the upper river keeps its own bed
    // instead of being sunk into a gorge down the mountain.
    let lift = Math.min(coast, K - 1)
    while (lift > 0 && !(nat[lift] <= cap[lift] && est[lift] <= 0.01)) lift--
    for (let k = 0; k <= lift; k++) {
      cap[k] = Infinity
      surf[k] = nat[k]
    }
    // smooth, then re-impose the caps and monotonicity
    const sm = new Float32Array(K)
    for (let k = 0; k < K; k++) {
      let s = 0
      let c = 0
      for (let q = -4; q <= 4; q++) {
        const kk = k + q
        if (kk < 0 || kk >= K) continue
        s += surf[kk]
        c++
      }
      sm[k] = Math.min(s / c, cap[k])
    }
    // Then the bank hold, as a cut under that profile. Taken sample by sample a
    // low bank dropped the water metres in one step and the profile ran flat
    // until it caught up: a cliff into a pool, with a straight crease across
    // the stream. So the cut eases: it changes by at most EASE of the
    // profile's own fall a sample (0.1 m where that is flat), coming in above a
    // low bank and going out below it, so the reach keeps falling on something
    // like its own grade. Easing never takes the water under what it is held to
    // in the next CUT m, so where a steep reach meets a gentle one, the gentle
    // one keeps its level.
    const cut = new Float32Array(K)
    for (let k = 0; k < K; k++) cut[k] = Math.max(0, sm[k] - hold[k])
    const most = new Float32Array(K)
    for (let k = 0; k < K; k++) {
      let below = Infinity
      for (let j = k + 1; j <= downOf[k]; j++) below = Math.min(below, sm[j] - cut[j] + (j - k) * 0.03)
      most[k] = Math.max(cut[k], sm[k] - below)
    }
    const ease = (k, from, fall) => Math.min(most[k], Math.max(cut[k], cut[from] - Math.max(0.1, EASE * fall)))
    for (let k = 1; k < K; k++) cut[k] = ease(k, k - 1, sm[k - 1] - sm[k])
    for (let k = K - 2; k >= 0; k--) cut[k] = ease(k, k + 1, sm[k] - sm[k + 1])
    for (let k = 0; k < K; k++) sm[k] -= cut[k]
    for (let k = 1; k < K; k++) sm[k] = Math.min(sm[k], sm[k - 1] - 0.01)
    for (let k = 0; k < K; k++) sm[k] = Math.max(sm[k], sea)
    // While the river still runs above the sea its bed stays above sea level (a
    // sandy riffle), so its water never doubles up over the sea's; past that
    // the estuary pool deepens again.
    const floor = new Float32Array(K).fill(-1e4)
    let above = -1
    for (let k = 0; k < K; k++) {
      if (sm[k] > sea + 0.005) above = k
      if (above >= 0) floor[k] = sea + 0.06 - (along[k] - along[above]) * 0.09
    }

    const best = new Float32Array(this.n * this.n).fill(NO_WATER)
    const bestF = new Float32Array(this.n * this.n)
    const bestE = this.riverE
    for (let k = 0; k < K - 1; k++) {
      const [ax, az] = path[k]
      const [bx, bz] = path[k + 1]
      const hw = Math.max(widths[k], widths[k + 1]) / 2
      const reach = hw * lerp(4, opensTo, Math.max(est[k], est[k + 1])) + 10
      this.forEachInBox(Math.min(ax, bx) - reach, Math.min(az, bz) - reach, Math.max(ax, bx) + reach, Math.max(az, bz) + reach, (id, x, z) => {
        const { d, t } = segDist(x, z, ax, az, bx, bz)
        const w = lerp(widths[k], widths[k + 1], t) / 2
        const nd = d / w
        if (nd < this.riverD[id]) {
          this.riverD[id] = nd
          this.riverM[id] = d
          best[id] = lerp(sm[k], sm[k + 1], t)
          bestE[id] = lerp(est[k], est[k + 1], t)
          bestF[id] = lerp(floor[k], floor[k + 1], t)
        }
      })
    }
    for (let id = 0; id < best.length; id++) {
      const nd = this.riverD[id]
      const e = bestE[id]
      // the valley sides lie back further at the mouth
      const reach = lerp(4.5, opensTo, e)
      if (nd > reach) {
        bestE[id] = 0
        continue
      }
      const s = best[id]
      const h0 = this.h[id]
      let h = h0
      if (nd < 1) {
        // the bed shoals as the channel opens into the estuary
        const bed = s - cfg.depth * (1 - M.shoal * e) * (1 - nd * nd) - 0.25
        h = Math.min(h, Math.max(bed, bestF[id]))
      } else {
        // banks: steep and muddy upstream, a low sandy shelf at the mouth
        const bank = s + lerp(0.35, 0.12, e) + (nd - 1) * lerp(0.9, 0.4, e)
        h = Math.min(h, lerp(bank, h, smoothstep(1, reach, nd)))
        // a low levee keeps a perched river in its bed; it fades out as the
        // surface comes down to the sea and never builds on beach or seabed
        if (nd < 1.6 && h0 > sea && h < s + 0.2) h = lerp(h, s + 0.2, smoothstep(0.05, 0.8, s - sea))
      }
      this.h[id] = h
      // river water only over ground it can stand on: where the bed has
      // dropped below the sea, the sea's surface takes over
      if (nd < WET && s > sea + 0.01 && h >= sea) this.water[id] = s
    }
    this.level.set(best)
    this.river = { path, surf: sm, widths, est, coast }
  }

  carveLake() {
    const L = this.cfg.lake
    const radiusAt = (ang) => L.radius * (1 + 0.28 * this.noise.noise(Math.cos(ang) * 1.3 + 5, Math.sin(ang) * 1.3 + 5))
    let level = Infinity
    for (let a = 0; a < 64; a++) {
      const ang = (a / 64) * Math.PI * 2
      const r = radiusAt(ang) * 1.3
      level = Math.min(level, this.heightAt(L.x + Math.cos(ang) * r, L.z + Math.sin(ang) * r))
    }
    level = Math.max(level - 0.4, this.sea + 1.5)
    const reach = L.radius * 2.2
    this.forEachInBox(L.x - reach, L.z - reach, L.x + reach, L.z + reach, (id, x, z) => {
      const dx = x - L.x
      const dz = z - L.z
      const nd = Math.hypot(dx, dz) / radiusAt(Math.atan2(dz, dx))
      let h = this.h[id]
      if (nd < 1) {
        h = Math.min(h, level - 6 * (1 - nd * nd) - 0.4)
      } else if (nd < 1.9) {
        h = Math.min(h, lerp(level + 0.3, h, smoothstep(1, 1.9, nd)))
        if (nd < 1.3) h = Math.max(h, level + 0.12)
      }
      this.h[id] = h
      if (nd < 1.2) this.water[id] = Math.max(this.water[id], level)
      if (nd < 1.9) this.level[id] = Math.max(this.level[id], level)
    })
    this.lake = { x: L.x, z: L.z, radius: L.radius, level }
  }

  // The inland water as drawn and as the physics reads it. Every grid cell with
  // a wet corner carries the sheet (water.js), so its dry corners have to hold
  // the water: one that sat under the water beside it let the sheet float out
  // over the lower ground and end in a straight cell edge. So every dry corner
  // is banked up to a low LEVEE at the grid's own resolution, on the river or
  // the lake shore (faded out as the surface comes down to the sea, never on
  // the seabed or the estuary's open sand), and either can gain a few raised
  // corners here. Beside the river the levee also rises with the corner's
  // distance from the channel: banked level, a narrow reach's dry corners all
  // stood the same few centimetres over the water, so its waterline hugged
  // them, ran along the grid and jogged a whole cell where it changed column.
  // Every dry corner of the sheet then sits at the water's level but never
  // above its own ground less SINK: the sheet always runs into the bank, so
  // its edge is the terrain's.
  settleWater() {
    const n = this.n
    const W = this.water
    const S = this.surface
    const h = this.h
    const sea = this.sea
    const wet = (id) => W[id] > sea + 0.01
    const edge = new Uint8Array(n * n)
    S.fill(NO_WATER)
    for (let j = 0; j < n - 1; j++) {
      for (let i = 0; i < n - 1; i++) {
        const a = j * n + i
        if (!(wet(a) || wet(a + 1) || wet(a + n) || wet(a + n + 1))) continue
        for (const id of [a, a + 1, a + n, a + n + 1]) {
          if (wet(id)) S[id] = W[id]
          else edge[id] = 1
        }
      }
    }
    for (let id = 0; id < n * n; id++) {
      if (!edge[id]) continue
      let level = this.level[id]
      if (level <= NO_WATER) {
        // no water body claims it: the wet neighbours' mean
        const i = id % n
        const j = (id - i) / n
        let s = 0
        let c = 0
        for (let dj = -1; dj <= 1; dj++)
          for (let di = -1; di <= 1; di++) {
            const ii = i + di
            const jj = j + dj
            if (ii < 0 || jj < 0 || ii >= n || jj >= n || !wet(jj * n + ii)) continue
            s += W[jj * n + ii]
            c++
          }
        level = s / c
      }
      const nd = this.riverD[id]
      const top = level + LEVEE.height + (nd < LEVEE.reach ? Math.min(LEVEE.most, Math.max(0, nd - WET) * LEVEE.rise) : 0)
      if (h[id] > sea && h[id] < top) h[id] = lerp(h[id], top, smoothstep(0.05, 0.8, level - sea) * (1 - this.riverE[id]))
      // out over the seabed the sheet stays level and fades into the sea instead
      S[id] = h[id] < sea ? level : Math.max(sea, Math.min(level, h[id] - SINK))
    }
  }

  // Walk from a point along a direction until the ground dips under the sea.
  findCoast(x, z, dx, dz) {
    for (let s = 0; s < 1200; s += 2) {
      const px = x + dx * s
      const pz = z + dz * s
      if (this.heightAt(px, pz) < this.sea + 0.2) return { x: px, z: pz }
    }
    return { x: x + dx * 1200, z: z + dz * 1200 }
  }

  flatten(x, z, radius, target, falloff = 1.8) {
    const outer = radius * falloff + 10
    this.forEachInBox(x - outer, z - outer, x + outer, z + outer, (id, px, pz) => {
      const d = Math.hypot(px - x, pz - z)
      if (d > outer) return
      const k = 1 - smoothstep(radius, outer, d)
      this.h[id] = lerp(this.h[id], target, k)
      this.clear[id] = Math.max(this.clear[id], 1 - smoothstep(radius, radius + 10, d))
    })
  }

  placePois() {
    const byId = {}
    for (const def of this.cfg.pois) {
      const poi = { id: def.id, name: def.name, icon: def.icon, x: def.x ?? 0, z: def.z ?? 0, yaw: 0, flat: def.flat, def }
      if (def.coast) {
        const [dx, dz] = def.coast.dir
        const c = this.findCoast(def.coast.x, 0, dx, dz)
        // stand the dock base a little inland, facing out to sea
        poi.x = c.x - dx * 12
        poi.z = c.z - dz * 12
        poi.seaDir = [dx, dz]
        poi.yaw = Math.atan2(-dx, -dz)
      } else if (def.inland) {
        const from = byId[def.inland.from]
        const dx = -from.seaDir[0]
        const dz = -from.seaDir[1]
        poi.x = from.x + dx * def.inland.dist
        poi.z = from.z + dz * def.inland.dist
        poi.yaw = Math.atan2(-dx, -dz)
      } else if (def.summit) {
        const M = this.cfg.mountain
        let bh = -Infinity
        for (let a = 0; a < 48; a++) {
          for (let r = 30; r <= 140; r += 10) {
            const x = M.x + Math.cos((a / 48) * Math.PI * 2) * r
            const z = M.z + Math.sin((a / 48) * Math.PI * 2) * r
            // prefer the south-facing rim so it can be seen from the station
            const h = this.heightAt(x, z) + (z > M.z ? 6 : 0)
            if (h > bh) {
              bh = h
              poi.x = x
              poi.z = z
            }
          }
        }
      }
      if (def.flat > 0) {
        let sum = 0
        let cnt = 0
        for (let a = 0; a < 12; a++) {
          const r = def.flat * 0.6
          sum += this.heightAt(poi.x + Math.cos(a) * r, poi.z + Math.sin(a) * r)
          cnt++
        }
        poi.y = Math.max(sum / cnt, this.sea + 1.6)
        this.flatten(poi.x, poi.z, def.flat, poi.y, def.summit ? 1.3 : 1.8)
      }
      poi.y = this.heightAt(poi.x, poi.z)
      byId[def.id] = poi
      this.pois.push(poi)
    }
    this.poi = byId
  }

  // Resolve a road's control points (see data/world.js roads) to [x, z].
  roadControls(def) {
    const first = def.map((p) => {
      if (Array.isArray(p)) return p
      if (typeof p === 'string') return [this.poi[p].x, this.poi[p].z]
      const poi = this.poi[p.at]
      if (p.local) {
        const c = Math.cos(poi.yaw)
        const s = Math.sin(poi.yaw)
        return [poi.x + p.local[0] * c + p.local[1] * s, poi.z - p.local[0] * s + p.local[1] * c]
      }
      if (p.gate) {
        const f = poi.def.fence
        const a = ((f.gate + 0.5) / f.sides) * Math.PI * 2
        const r = f.radius + 8
        return [poi.x + Math.cos(a) * r, poi.z + Math.sin(a) * r]
      }
      return [poi.x, poi.z]
    })
    // `stop` anchors pull back toward their neighbour on the road
    return first.map((pt, k) => {
      const p = def[k]
      if (!p || typeof p !== 'object' || Array.isArray(p) || !p.stop) return pt
      const nb = first[k > 0 ? k - 1 : k + 1]
      const dx = nb[0] - pt[0]
      const dz = nb[1] - pt[1]
      const l = Math.hypot(dx, dz) || 1
      return [pt[0] + (dx / l) * p.stop, pt[1] + (dz / l) * p.stop]
    })
  }

  buildRoads() {
    for (const def of this.cfg.roads) {
      const ctrl = this.roadControls(def)
      // resample with Catmull-Rom every ~4 m
      const pts = []
      for (let k = 0; k < ctrl.length - 1; k++) {
        const p0 = ctrl[Math.max(0, k - 1)]
        const p1 = ctrl[k]
        const p2 = ctrl[k + 1]
        const p3 = ctrl[Math.min(ctrl.length - 1, k + 2)]
        const len = Math.hypot(p2[0] - p1[0], p2[1] - p1[1])
        const steps = Math.max(2, Math.ceil(len / 4))
        for (let s = 0; s < steps; s++) {
          const t = s / steps
          const t2 = t * t
          const t3 = t2 * t
          const cr = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3)
          pts.push([cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])])
        }
      }
      pts.push(ctrl[ctrl.length - 1].slice())
      const K = pts.length
      const raw = pts.map(([x, z]) => this.heightAt(x, z))
      const riverAt = pts.map(([x, z]) => this.sample(this.riverD, x, z))
      // the profile ignores the river channel so the road bridges it
      const prof = new Float32Array(K)
      for (let k = 0; k < K; k++) {
        let s = 0
        let c = 0
        for (let q = -10; q <= 10; q++) {
          const kk = k + q
          if (kk < 0 || kk >= K || riverAt[kk] < 2.5) continue
          s += raw[kk]
          c++
        }
        prof[k] = Math.max(c ? s / c : raw[k], this.sea + 1.2)
      }
      // Bridges: contiguous runs of road over the water. Each gets one flat
      // deck height between its two banks, and the road profile ramps to it on
      // both sides (a cutting into the high bank, an embankment on the low one)
      // so the deck meets the road at both ends.
      const spans = []
      let run = null
      for (let k = 0; k < K; k++) {
        const wet = riverAt[k] < 1.4
        if (wet && !run) run = { a: k, b: k }
        else if (wet) run.b = k
        if ((!wet || k === K - 1) && run) {
          if (run.a > 0 && run.b < K - 1) spans.push(run)
          run = null
        }
      }
      const deckAt = new Float32Array(K).fill(NaN)
      for (const sp of spans) {
        let iA = sp.a
        while (iA > 0 && riverAt[iA] < 2.6) iA--
        let iB = sp.b
        while (iB < K - 1 && riverAt[iB] < 2.6) iB++
        let water = this.sea
        for (let k = iA; k <= iB; k++) water = Math.max(water, this.waterAt(pts[k][0], pts[k][1]))
        const H = Math.max(water + 1.6, (prof[iA] + prof[iB]) / 2)
        for (const [k0, dir] of [
          [iA, -1],
          [iB, 1],
        ]) {
          // a level landing at deck height, then a ramp back to the natural
          // profile, long enough to stay under ~9 % at its steepest
          const land = 2
          let dev = 0
          for (let q = 1; q <= 40 && k0 + dir * q >= 0 && k0 + dir * q < K; q++) dev = Math.max(dev, Math.abs(prof[k0 + dir * q] - H))
          const n = clamp(Math.ceil((1.5 * dev) / (0.09 * 4)), 3, 40)
          for (let q = 1; q <= land + n; q++) {
            const k = k0 + dir * q
            if (k < 0 || k >= K) break
            prof[k] = lerp(prof[k], H, 1 - smoothstep(land, land + n, q))
          }
        }
        for (let k = iA; k <= iB; k++) {
          prof[k] = H
          if (k < iB) deckAt[k] = H
        }
        Object.assign(sp, { iA, iB, H, water })
      }
      const hw = 3.2
      const shoulder = 7
      for (let k = 0; k < K - 1; k++) {
        const [ax, az] = pts[k]
        const [bx, bz] = pts[k + 1]
        const reach = hw + shoulder + 6
        this.forEachInBox(Math.min(ax, bx) - reach, Math.min(az, bz) - reach, Math.max(ax, bx) + reach, Math.max(az, bz) + reach, (id, x, z) => {
          const { d, t } = segDist(x, z, ax, az, bx, bz)
          if (d > hw + shoulder) return
          this.clear[id] = Math.max(this.clear[id], 1 - smoothstep(hw, hw + 4, d))
          if (this.riverD[id] < 2.6) {
            // under a deck: keep the bank clear of the planks
            if (!Number.isNaN(deckAt[k]) && d < hw + 1.5) this.h[id] = Math.min(this.h[id], deckAt[k] - 0.45)
            return
          }
          const target = lerp(prof[k], prof[k + 1], t)
          const kk = 1 - smoothstep(hw, hw + shoulder, d)
          this.h[id] = lerp(this.h[id], target, kk)
          this.road[id] = Math.max(this.road[id], 1 - smoothstep(hw - 1, hw + 0.8, d))
        })
      }
      // Span each deck from where the road leaves deck height on one bank to
      // where it regains it on the other, plus a bearing on solid ground.
      for (const sp of spans) {
        const [ax, az] = pts[sp.iA]
        const [bx, bz] = pts[sp.iB]
        const len = Math.hypot(bx - ax, bz - az) || 1
        const ux = (bx - ax) / len
        const uz = (bz - az) / len
        const mx = (ax + bx) / 2
        const mz = (az + bz) / 2
        const out = (sign) => {
          for (let s = 1; s < len / 2 + 16; s += 0.5) {
            if (this.heightAt(mx + ux * s * sign, mz + uz * s * sign) >= sp.H - 0.08) return { s, solid: true }
          }
          return { s: len / 2 + 16, solid: false }
        }
        const A = out(-1)
        const B = out(1)
        const bear = 1.6
        const s0 = -A.s - bear
        const s1 = B.s + bear
        const end = (s, e) => ({ x: mx + ux * s, z: mz + uz * s, solid: e.solid, ground: this.heightAt(mx + ux * s, mz + uz * s) })
        this.bridges.push({
          x: mx + ux * ((s0 + s1) / 2),
          z: mz + uz * ((s0 + s1) / 2),
          yaw: Math.atan2(-ux, -uz),
          length: s1 - s0,
          y: sp.H,
          water: sp.water,
          // where the banks start to fall away under the deck (abutments go here)
          ends: [end(-A.s, A), end(B.s, B)],
        })
      }
      this.roads.push({ pts, prof })
    }
  }

  computeSlope() {
    const n = this.n
    const c = this.cell
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const hl = this.h[this.idx(Math.max(0, i - 1), j)]
        const hr = this.h[this.idx(Math.min(n - 1, i + 1), j)]
        const hd = this.h[this.idx(i, Math.max(0, j - 1))]
        const hu = this.h[this.idx(i, Math.min(n - 1, j + 1))]
        this.slope[this.idx(i, j)] = Math.hypot(hr - hl, hu - hd) / (2 * c)
      }
    }
  }

  computeBiomes() {
    const { radius: R, plains: P } = this.cfg
    const n = this.noise
    const L = this.lake
    for (let j = 0; j < this.n; j++) {
      const z = this.xOf(j)
      for (let i = 0; i < this.n; i++) {
        const x = this.xOf(i)
        const id = this.idx(i, j)
        const h = this.h[id]
        let m = 0.52 + 0.32 * n.fbm(x * 0.0022 + 11, z * 0.0022 - 4, 3) - (x / R) * 0.3
        m += 0.45 * Math.exp(-this.riverM[id] / 70)
        m += 0.35 * Math.exp(-Math.max(0, Math.hypot(x - L.x, z - L.z) - L.radius) / 90)
        const dp = Math.hypot(x - P.x, z - P.z) / P.radius
        m -= 0.5 * (1 - smoothstep(0.4, 1.05, dp))
        m -= Math.max(0, h - 55) / 170
        m = clamp(m, 0, 1)
        this.moist[id] = m

        const s = this.slope[id]
        let rem = 1
        const take = (v) => {
          const t = clamp(v, 0, 1) * rem
          rem -= t
          return t
        }
        const beach = h > this.sea - 1 ? (1 - smoothstep(1.4, 3.6, h)) * lerp(this.riverD[id] > 1.4 ? 1 : 0.3, 1, this.riverE[id]) : 1
        this.w.beach[id] = take(beach)
        this.w.rock[id] = take(smoothstep(0.85, 1.25, s) + smoothstep(170, 195, h))
        this.w.highland[id] = take(smoothstep(70, 105, h))
        this.w.swamp[id] = take(smoothstep(0.7, 0.86, m) * (1 - smoothstep(5, 14, h)))
        this.w.jungle[id] = take(smoothstep(0.4, 0.58, m))
        this.w.grass[id] = rem
      }
    }
  }

  computeDensities() {
    const n = this.noise
    const nb = this.noiseB
    const d = this.d
    for (let j = 0; j < this.n; j++) {
      const z = this.xOf(j)
      for (let i = 0; i < this.n; i++) {
        const x = this.xOf(i)
        const id = this.idx(i, j)
        const h = this.h[id]
        const dry = this.depthAt(x, z) < -0.25 ? 1 : 0
        const open = (1 - this.clear[id]) * (1 - this.road[id]) * dry
        if (!open) continue
        const w = this.w
        const rv = this.riverD[id]
        const bank = rv < 1.6 ? 0 : 1
        const patch = n.noise(x * 0.012 + 3, z * 0.012 - 8) // large patches
        const patch2 = nb.noise(x * 0.03, z * 0.03) // small clumps
        const slopeOk = 1 - smoothstep(0.65, 1.0, this.slope[id])

        d.canopy[id] = open * bank * slopeOk * w.jungle[id] * clamp(0.75 + 0.35 * patch, 0, 1)
        d.palm[id] = open * bank * (w.beach[id] * smoothstep(0.6, 1.8, h) * 0.55 + w.swamp[id] * 0.35 + w.jungle[id] * 0.18 + w.grass[id] * 0.03)
        d.broadleaf[id] = open * bank * slopeOk * (w.grass[id] * smoothstep(0.25, 0.7, patch) * 0.45 + w.jungle[id] * 0.25 + w.highland[id] * 0.08)
        d.pine[id] = open * slopeOk * w.highland[id] * clamp(0.45 + 0.5 * patch, 0, 1)
        d.fern[id] = open * bank * (w.jungle[id] * clamp(0.75 + 0.4 * patch2, 0, 1) + w.swamp[id] * 0.25)
        d.bush[id] = open * (w.jungle[id] * 0.45 + w.grass[id] * smoothstep(0.2, 0.6, patch2) * 0.4 + w.highland[id] * 0.25)
        d.grass[id] = open * bank * (w.grass[id] * smoothstep(-0.25, 0.25, patch + 0.3 * patch2) + w.highland[id] * 0.35 * smoothstep(0, 0.5, patch2) + w.jungle[id] * 0.1)
        const reedBank = rv > 1.15 && rv < 2.6 ? 0.85 * (1 - 0.8 * this.riverE[id]) : 0 // thins out on the estuary sand
        d.reed[id] = dry * (1 - this.road[id]) * (w.swamp[id] * 0.85 + reedBank + (h < 2.6 && w.beach[id] < 0.5 ? 0.2 : 0))
        d.rock[id] = open * (w.rock[id] * 0.6 + w.highland[id] * 0.12 + w.beach[id] * 0.04 + w.grass[id] * 0.02 + w.jungle[id] * 0.02)
        d.bigleaf[id] = open * bank * (w.jungle[id] * smoothstep(-0.1, 0.5, patch2) * 0.6 + w.swamp[id] * 0.3)
        d.log[id] = open * w.jungle[id] * 0.25

        this.cover[id] = clamp(d.fern[id] * 0.85 + d.grass[id] * 0.95 + d.bush[id] * 0.5 + d.reed[id] * 0.85 + d.bigleaf[id] * 0.5, 0, 1)
      }
    }
  }

  // Abandoned vehicles (cfg.wrecks): each takes the first spot near its place
  // on the road, on either verge, whose footprint is dry, off the river and
  // other roads, and fairly level, then keeps the big trees off it (through
  // the clear mask, after the undergrowth densities, which it leaves alone).
  placeWrecks() {
    const rng = new Rng(this.cfg.seed + 404)
    for (const def of this.cfg.wrecks || []) {
      const road = this.roads[def.road]
      const lot = WRECK_LOT[def.kind]
      if (!road || !lot) continue
      const K = road.pts.length
      const k0 = Math.floor(K * def.at)
      const side0 = rng.sign()
      const jitter = rng.range(-0.45, 0.45)
      let best = null
      for (let t = 0; t < 11 && !(best && best.bad === 0); t++) {
        const k = clamp(k0 + (t % 2 ? 1 : -1) * Math.ceil(t / 2) * 3, 0, K - 2)
        const [ax, az] = road.pts[k]
        const [bx, bz] = road.pts[k + 1]
        const l = Math.hypot(bx - ax, bz - az) || 1
        for (const side of [side0, -side0]) {
          const x = ax + (-(bz - az) / l) * lot.off * side
          const z = az + ((bx - ax) / l) * lot.off * side
          const yaw = Math.atan2(bx - ax, bz - az) + jitter
          const c = Math.cos(yaw)
          const sn = Math.sin(yaw)
          let lo = Infinity
          let hi = -Infinity
          let bad = 0
          for (const [sx, sz] of [[0, 0], [-1, -1], [1, -1], [-1, 1], [1, 1]]) {
            const lx = (sx * lot.width) / 2
            const lz = (sz * lot.length) / 2
            const px = x + lx * c + lz * sn
            const pz = z - lx * sn + lz * c
            const h = this.heightAt(px, pz)
            lo = Math.min(lo, h)
            hi = Math.max(hi, h)
            if (this.depthAt(px, pz) > -0.3 || this.sample(this.riverD, px, pz) < 2.6) bad += 2
            if (this.sample(this.road, px, pz) > 0.02) bad += 1
          }
          bad += Math.max(0, hi - lo - 1) // over a metre of fall across the body
          if (!best || bad < best.bad) best = { x, z, yaw, roadSide: side, bad }
          if (bad === 0) break
        }
      }
      const { x, z, yaw, roadSide } = best
      // ...and the body, its loose wheel and crate, stand clear of trunks
      const c = Math.cos(yaw)
      const sn = Math.sin(yaw)
      const r = Math.hypot(lot.width, lot.length) / 2 + 4
      this.forEachInBox(x - r, z - r, x + r, z + r, (id, px, pz) => {
        const dx = px - x
        const dz = pz - z
        const out = Math.hypot(Math.max(0, Math.abs(dx * c - dz * sn) - lot.width / 2), Math.max(0, Math.abs(dx * sn + dz * c) - lot.length / 2))
        this.clear[id] = Math.max(this.clear[id], 1 - smoothstep(2, 5, out))
      })
      this.wrecks.push({ x, z, yaw, roadSide, kind: def.kind, crate: !!def.crate })
    }
  }

  // Score how well a spot suits a species' habitat preferences.
  habitat(x, z, prefs) {
    if (!this.isLand(x, z, -0.2)) return 0
    let s = 0
    for (const k in prefs) s += (this.w[k] ? this.sample(this.w[k], x, z) : 0) * prefs[k]
    return s
  }
}
