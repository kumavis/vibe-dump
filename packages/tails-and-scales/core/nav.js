import { hypot } from './dmath.js'

// ---------------------------------------------------------------------------
// Movement on the tabletop. The board is rasterised into half-inch cells; each
// unit is treated as a disc, so instead of inflating obstacles per unit size we
// keep a clearance field (distance from every cell to the nearest obstacle or
// table edge) and a disc of radius r may stand anywhere clearance ≥ r.
//
// Two clearance fields, because the Constrictor Brute is allowed to plough
// through anything destructible: `clearAll` counts every obstacle, `clearHard`
// only the ones nothing can break (rocks).
// ---------------------------------------------------------------------------

const SQRT2 = Math.SQRT2

// The grid's size in cells for a W×H table (the overlay's texture is sized
// by it before any match exists)
export const gridSize = (W, H, cell) => ({ nx: Math.round(W / cell), nz: Math.round(H / cell) })

export class NavGrid {
  constructor(W, H, cell = 0.5) {
    this.W = W
    this.H = H
    this.cell = cell
    const { nx, nz } = gridSize(W, H, cell)
    this.nx = nx
    this.nz = nz
    const N = (this.N = this.nx * this.nz)
    this.hard = new Uint8Array(N) // impassable, indestructible
    this.soft = new Uint8Array(N) // impassable unless you are a Brute
    this.diff = new Uint8Array(N) // difficult ground: every inch costs two
    this.cover = new Uint8Array(N) // standing here counts as being in cover
    this.clearAll = new Float32Array(N)
    this.clearHard = new Float32Array(N)
    this.tmp = new Float32Array(N)
  }

  x(i) {
    return -this.W / 2 + ((i % this.nx) + 0.5) * this.cell
  }
  z(i) {
    return -this.H / 2 + (Math.floor(i / this.nx) + 0.5) * this.cell
  }
  index(x, z) {
    const ix = Math.floor((x + this.W / 2) / this.cell)
    const iz = Math.floor((z + this.H / 2) / this.cell)
    if (ix < 0 || iz < 0 || ix >= this.nx || iz >= this.nz) return -1
    return iz * this.nx + ix
  }

  // Re-rasterise every live chunk. Cheap enough (a few thousand cells) to run
  // after each explosion rather than patching incrementally.
  rebuild(chunks) {
    this.hard.fill(0)
    this.soft.fill(0)
    this.diff.fill(0)
    this.cover.fill(0)
    for (const c of chunks) {
      if (!c.alive) continue
      const s = c.nav || c.shape
      if (c.navKind === 'hard') this.raster(s, 0.1, this.hard)
      else if (c.navKind === 'soft') this.raster(s, 0.1, this.soft)
      else if (c.navKind === 'diff') this.raster(s, 0.15, this.diff)
      if (c.cover) this.raster(c.coverShape || s, 0.6, this.cover)
    }
    this.field(this.hard, null, this.clearHard)
    this.field(this.hard, this.soft, this.clearAll)
  }

  raster(s, pad, arr) {
    const reach = hypot(s.hx, s.hz) + pad
    const c = Math.cos(s.yaw), sn = Math.sin(s.yaw)
    const ix0 = Math.max(0, Math.floor((s.x - reach + this.W / 2) / this.cell))
    const ix1 = Math.min(this.nx - 1, Math.floor((s.x + reach + this.W / 2) / this.cell))
    const iz0 = Math.max(0, Math.floor((s.z - reach + this.H / 2) / this.cell))
    const iz1 = Math.min(this.nz - 1, Math.floor((s.z + reach + this.H / 2) / this.cell))
    for (let iz = iz0; iz <= iz1; iz++) {
      for (let ix = ix0; ix <= ix1; ix++) {
        const i = iz * this.nx + ix
        const dx = this.x(i) - s.x, dz = this.z(i) - s.z
        // into the shape's own frame (yaw is a rotation about +y)
        const lx = dx * c - dz * sn
        const lz = dx * sn + dz * c
        if (Math.abs(lx) <= s.hx + pad && Math.abs(lz) <= s.hz + pad) arr[i] = 1
      }
    }
  }

  // Two-pass chamfer distance transform, then clamp by the table edge.
  field(a, b, out) {
    const { nx, nz, cell } = this
    const INF = 1e6
    const d1 = cell, d2 = cell * SQRT2
    for (let i = 0; i < this.N; i++) out[i] = a[i] || (b && b[i]) ? 0 : INF
    for (let iz = 0; iz < nz; iz++) {
      for (let ix = 0; ix < nx; ix++) {
        const i = iz * nx + ix
        let v = out[i]
        if (ix > 0) v = Math.min(v, out[i - 1] + d1)
        if (iz > 0) {
          v = Math.min(v, out[i - nx] + d1)
          if (ix > 0) v = Math.min(v, out[i - nx - 1] + d2)
          if (ix < nx - 1) v = Math.min(v, out[i - nx + 1] + d2)
        }
        out[i] = v
      }
    }
    for (let iz = nz - 1; iz >= 0; iz--) {
      for (let ix = nx - 1; ix >= 0; ix--) {
        const i = iz * nx + ix
        let v = out[i]
        if (ix < nx - 1) v = Math.min(v, out[i + 1] + d1)
        if (iz < nz - 1) {
          v = Math.min(v, out[i + nx] + d1)
          if (ix < nx - 1) v = Math.min(v, out[i + nx + 1] + d2)
          if (ix > 0) v = Math.min(v, out[i + nx - 1] + d2)
        }
        out[i] = v
      }
    }
    for (let i = 0; i < this.N; i++) {
      const x = this.x(i), z = this.z(i)
      const edge = Math.min(x + this.W / 2, this.W / 2 - x, z + this.H / 2, this.H / 2 - z)
      // centre-to-centre distance overstates clearance by half a cell
      out[i] = Math.min(out[i] > 0 ? out[i] - cell * 0.5 : 0, edge)
    }
  }

  clearance(i, mode) {
    return mode === 'wreck' ? this.clearHard[i] : this.clearAll[i]
  }

  // Can a disc of radius r stand on cell i?
  standable(i, r, mode, forbid) {
    if (i < 0) return false
    if (forbid && forbid[i]) return false
    return this.clearance(i, mode === 'wreck' ? 'wreck' : 'all') >= r - 0.06
  }

  // Dijkstra out to `max` inches. Flyers just get a circle: they ignore terrain
  // on the way and only need somewhere to land.
  reach(sx, sz, { r, max, mode = 'walk', forbid = null }) {
    const N = this.N
    // Float64, not Float32: the heap keys are doubles, and a rounded-down
    // stored distance made `d > dist[i]` discard live entries, so diagonal
    // routes went unexplored and reach (and charge `need`) came out short.
    const dist = new Float64Array(N).fill(Infinity)
    const prev = new Int32Array(N).fill(-1)
    const start = this.index(sx, sz)
    const res = { dist, prev, start, mode, sx, sz }
    if (start < 0) return res
    if (mode === 'fly') {
      for (let i = 0; i < N; i++) {
        const d = hypot(this.x(i) - sx, this.z(i) - sz)
        if (d <= max) dist[i] = d
      }
      return res
    }
    // measure from where the unit actually stands, not its cell's centre, so
    // a unit nudged off-centre (a pile-in) can't walk further than its roll
    const d0 = hypot(sx - this.x(start), sz - this.z(start))
    dist[start] = d0
    const heap = new Heap()
    heap.push(start, d0)
    const { nx, nz, cell } = this
    // A unit that starts somewhere cramped (squeezed by a collapse, or after
    // the Brute ploughed in) may wriggle out through its own footprint.
    const escape = this.clearance(start, mode === 'wreck' ? 'wreck' : 'all') < r - 0.06 ? r * 1.5 : 0
    while (heap.size) {
      const [i, d] = heap.pop()
      if (d > dist[i]) continue
      const ix = i % nx, iz = (i / nx) | 0
      for (let oz = -1; oz <= 1; oz++) {
        for (let ox = -1; ox <= 1; ox++) {
          if (!ox && !oz) continue
          const jx = ix + ox, jz = iz + oz
          if (jx < 0 || jz < 0 || jx >= nx || jz >= nz) continue
          const j = jz * nx + jx
          if (forbid && forbid[j]) continue
          const cl = this.clearance(j, mode === 'wreck' ? 'wreck' : 'all')
          if (cl < r - 0.06 && !(escape && cl > 0.05 && hypot(this.x(j) - sx, this.z(j) - sz) < escape)) continue
          let mul = this.diff[j] ? 2 : 1
          if (mode === 'wreck' && this.clearAll[j] < r - 0.06) mul = 2
          const nd = d + (ox && oz ? SQRT2 : 1) * cell * mul
          if (nd <= max && nd < dist[j]) {
            dist[j] = nd
            prev[j] = i
            heap.push(j, nd)
          }
        }
      }
    }
    return res
  }

  // Cell path back to the start, string-pulled into a short polyline.
  path(res, goal, r, forbid) {
    if (res.mode === 'fly') return [{ x: res.sx, z: res.sz }, { x: this.x(goal), z: this.z(goal) }]
    const cells = []
    for (let i = goal; i !== -1; i = res.prev[i]) {
      cells.push(i)
      if (i === res.start) break
    }
    cells.reverse()
    const pts = cells.map((i) => ({ x: this.x(i), z: this.z(i) }))
    pts[0] = { x: res.sx, z: res.sz }
    if (pts.length < 3) return pts
    const out = [pts[0]]
    let k = 0
    while (k < pts.length - 1) {
      let best = k + 1
      for (let j = pts.length - 1; j > k + 1; j--) {
        if (this.walkable(pts[k], pts[j], r, res.mode, forbid)) {
          best = j
          break
        }
      }
      out.push(pts[best])
      k = best
    }
    return out
  }

  walkable(a, b, r, mode, forbid) {
    const len = hypot(b.x - a.x, b.z - a.z)
    const steps = Math.ceil(len / (this.cell * 0.5))
    const d0 = this.diff[this.index(a.x, a.z)]
    for (let s = 1; s < steps; s++) {
      const t = s / steps
      const i = this.index(a.x + (b.x - a.x) * t, a.z + (b.z - a.z) * t)
      if (i < 0) return false
      if (forbid && forbid[i]) return false
      if (this.clearance(i, mode === 'wreck' ? 'wreck' : 'all') < r - 0.06) return false
      // don't let string-pulling shortcut across rough ground the search paid for
      if (this.diff[i] !== d0) return false
      if (mode === 'wreck' && this.clearAll[i] < r - 0.06) return false
    }
    // the raster only samples cell centres; test the enemy discs exactly so a
    // shortcut can't shave the edge of a base or a 1" bubble
    if (forbid?.discs) for (const d of forbid.discs) if (segDist(a, b, d) < d.R) return false
    return true
  }
}

function segDist(a, b, p) {
  const dx = b.x - a.x, dz = b.z - a.z
  const L2 = dx * dx + dz * dz
  let t = L2 > 0 ? ((p.x - a.x) * dx + (p.z - a.z) * dz) / L2 : 0
  t = t < 0 ? 0 : t > 1 ? 1 : t
  return hypot(a.x + dx * t - p.x, a.z + dz * t - p.z)
}

export const pathLength = (pts) => {
  let L = 0
  for (let i = 1; i < pts.length; i++) L += hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z)
  return L
}

// Minimal binary heap keyed on cost.
class Heap {
  constructor() {
    this.ids = []
    this.keys = []
  }
  get size() {
    return this.ids.length
  }
  push(id, key) {
    const { ids, keys } = this
    let i = ids.length
    ids.push(id)
    keys.push(key)
    while (i > 0) {
      const p = (i - 1) >> 1
      if (keys[p] <= key) break
      ids[i] = ids[p]
      keys[i] = keys[p]
      i = p
    }
    ids[i] = id
    keys[i] = key
  }
  pop() {
    const { ids, keys } = this
    const top = [ids[0], keys[0]]
    const id = ids.pop(), key = keys.pop()
    if (ids.length) {
      let i = 0
      const n = ids.length
      for (;;) {
        let c = 2 * i + 1
        if (c >= n) break
        if (c + 1 < n && keys[c + 1] < keys[c]) c++
        if (keys[c] >= key) break
        ids[i] = ids[c]
        keys[i] = keys[c]
        i = c
      }
      ids[i] = id
      keys[i] = key
    }
    return top
  }
}
