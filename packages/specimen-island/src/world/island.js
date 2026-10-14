import { Noise2D } from '../core/noise.js'
import { Rng } from '../core/rng.js'
import { clamp, lerp, smoothstep, segDist } from '../core/mathx.js'

// The island as pure data — no three.js in here. Heights, water, biomes and
// vegetation densities live on one grid (the terrain vertex grid), so the mesh,
// the physics, the stealth model ("how much cover is this tall grass?") and the
// AI all read the same truth.

export const BIOME_NAMES = ['beach', 'grass', 'jungle', 'swamp', 'highland', 'rock']

const NO_WATER = -1e4

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
    this.riverD = new Float32Array(N).fill(1e4) // distance to river centre / half width
    this.riverM = new Float32Array(N).fill(1e4) // distance to river centre in metres
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
    this.river = null
    this.lake = null

    this.generateBase()
    this.carveRiver()
    this.carveLake()
    this.placePois()
    this.buildRoads()
    this.computeSlope()
    this.computeBiomes()
    this.computeDensities()
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
    const fx = gx - i
    const fz = gz - j
    const n = this.n
    const h = this.h
    const a = h[j * n + i]
    const b = h[(j + 1) * n + i]
    const c = h[j * n + i + 1]
    const d = h[(j + 1) * n + i + 1]
    if (fx + fz <= 1) return a + (c - a) * fx + (b - a) * fz
    return d + (b - d) * (1 - fx) + (c - d) * (1 - fz)
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

  // Water surface at a point, or -Infinity on dry land. The ocean is everywhere
  // at sea level; rivers and the lake sit above it on their own surfaces.
  waterAt(x, z) {
    const gx = (x + this.half) / this.cell
    const gz = (z + this.half) / this.cell
    let s = this.sea
    if (gx >= 0 && gz >= 0 && gx < this.seg && gz < this.seg) {
      const i = Math.floor(gx)
      const j = Math.floor(gz)
      const n = this.n
      const w = this.water
      const m = Math.max(w[j * n + i], w[j * n + i + 1], w[(j + 1) * n + i], w[(j + 1) * n + i + 1])
      if (m > s) s = m
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
    // meander perpendicular to the flow
    let acc = 0
    for (let k = 1; k < path.length - 1; k++) {
      const dx = path[k + 1][0] - path[k - 1][0]
      const dz = path[k + 1][1] - path[k - 1][1]
      const l = Math.hypot(dx, dz) || 1
      acc += 6
      const off = this.noiseB.noise(acc * 0.006, 3.3) * 28
      path[k][0] += (-dz / l) * off
      path[k][1] += (dx / l) * off
    }
    // surface profile: always downhill, at least a metre below the land
    const K = path.length
    const surf = new Float32Array(K)
    let prev = Infinity
    for (let k = 0; k < K; k++) {
      const h = this.heightAt(path[k][0], path[k][1])
      prev = Math.min(prev - 0.03, h - 1.2)
      surf[k] = Math.max(prev, this.sea)
    }
    // smooth, then re-impose monotonicity
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
      sm[k] = s / c
    }
    for (let k = 1; k < K; k++) sm[k] = Math.min(sm[k], sm[k - 1] - 0.01)
    for (let k = 0; k < K; k++) sm[k] = Math.max(sm[k], this.sea)

    const widths = new Float32Array(K)
    for (let k = 0; k < K; k++) {
      widths[k] = lerp(cfg.widthStart, cfg.widthEnd, k / (K - 1)) * (1 + 0.25 * this.noise.noise(k * 0.05, 9.1))
    }

    const best = new Float32Array(this.n * this.n).fill(NO_WATER)
    for (let k = 0; k < K - 1; k++) {
      const [ax, az] = path[k]
      const [bx, bz] = path[k + 1]
      const hw = Math.max(widths[k], widths[k + 1]) / 2
      const reach = hw * 4 + 10
      this.forEachInBox(Math.min(ax, bx) - reach, Math.min(az, bz) - reach, Math.max(ax, bx) + reach, Math.max(az, bz) + reach, (id, x, z) => {
        const { d, t } = segDist(x, z, ax, az, bx, bz)
        const w = lerp(widths[k], widths[k + 1], t) / 2
        const nd = d / w
        if (nd < this.riverD[id]) {
          this.riverD[id] = nd
          this.riverM[id] = d
          best[id] = lerp(sm[k], sm[k + 1], t)
        }
      })
    }
    for (let id = 0; id < best.length; id++) {
      const nd = this.riverD[id]
      if (nd > 4.5) continue
      const s = best[id]
      let h = this.h[id]
      if (nd < 1) {
        const bed = s - cfg.depth * (1 - nd * nd) - 0.25
        h = Math.min(h, bed)
      } else {
        const bank = s + 0.35 + (nd - 1) * 0.9
        h = Math.min(h, lerp(bank, h, smoothstep(1, 4.5, nd)))
        if (nd < 1.6) h = Math.max(h, s + 0.2)
      }
      this.h[id] = h
      if (nd < 1.3 && s > this.sea + 0.01) this.water[id] = s
    }
    this.river = { path, surf: sm, widths }
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
    })
    this.lake = { x: L.x, z: L.z, radius: L.radius, level }
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
      const poi = { id: def.id, name: def.name, icon: def.icon, x: def.x ?? 0, z: def.z ?? 0, yaw: 0, flat: def.flat }
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

  buildRoads() {
    for (const def of this.cfg.roads) {
      const ctrl = def.map((p) => (typeof p === 'string' ? [this.poi[p].x, this.poi[p].z] : p))
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
          if (this.riverD[id] < 2.6) return
          const target = lerp(prof[k], prof[k + 1], t)
          const kk = 1 - smoothstep(hw, hw + shoulder, d)
          this.h[id] = lerp(this.h[id], target, kk)
          this.road[id] = Math.max(this.road[id], 1 - smoothstep(hw - 1, hw + 0.8, d))
        })
      }
      // bridges: contiguous runs of road over the channel
      let run = null
      for (let k = 0; k < K; k++) {
        const wet = riverAt[k] < 2.2
        if (wet && !run) run = { a: k, b: k }
        else if (wet) run.b = k
        if ((!wet || k === K - 1) && run) {
          const a = Math.max(0, run.a - 2)
          const b = Math.min(K - 1, run.b + 2)
          const [ax, az] = pts[a]
          const [bx, bz] = pts[b]
          this.bridges.push({
            x: (ax + bx) / 2,
            z: (az + bz) / 2,
            yaw: Math.atan2(-(bx - ax), -(bz - az)),
            length: Math.hypot(bx - ax, bz - az) + 4,
            y: Math.max(prof[a], prof[b]) + 0.15,
          })
          run = null
        }
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
        const beach = h > this.sea - 1 ? (1 - smoothstep(1.4, 3.6, h)) * (this.riverD[id] > 1.4 ? 1 : 0.3) : 1
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
        d.reed[id] = dry * (1 - this.road[id]) * (w.swamp[id] * 0.85 + (rv > 1.15 && rv < 2.6 ? 0.85 : 0) + (h < 2.6 && w.beach[id] < 0.5 ? 0.2 : 0))
        d.rock[id] = open * (w.rock[id] * 0.6 + w.highland[id] * 0.12 + w.beach[id] * 0.04 + w.grass[id] * 0.02 + w.jungle[id] * 0.02)
        d.bigleaf[id] = open * bank * (w.jungle[id] * smoothstep(-0.1, 0.5, patch2) * 0.6 + w.swamp[id] * 0.3)
        d.log[id] = open * w.jungle[id] * 0.25

        this.cover[id] = clamp(d.fern[id] * 0.85 + d.grass[id] * 0.95 + d.bush[id] * 0.5 + d.reed[id] * 0.85 + d.bigleaf[id] * 0.5, 0, 1)
      }
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
