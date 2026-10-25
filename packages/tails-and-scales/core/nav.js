import { hypot, sin, cos } from './dmath.js'

// ---------------------------------------------------------------------------
// Movement on the tabletop. The board is rasterised into half-inch cells; each
// unit is treated as a disc, so instead of inflating obstacles per unit size we
// keep a clearance field (distance from every cell to the nearest obstacle or
// table edge) and a disc of radius r may stand anywhere clearance ≥ r.
//
// Two clearance fields, because the Constrictor Brute is allowed to plough
// through anything destructible: `clearAll` counts every obstacle, `clearHard`
// only the ones nothing can break (rocks).
//
// (F7a, DESIGN §4.2.4) Height. A board with fortifications (an alive chunk
// with a `surface` or a `link`: recipes.js's decks, stairs and ladders) also
// builds a height layer, derived from the chunks like the clearance fields
// and never hashed (§4.1 rule 21): `floor`, the walkable height of every
// cell; `link`, the ladders, each joining a foot cell to a top cell; `cliff`,
// the distance from every cell to the nearest ledge (a cell with a neighbour
// more than STEP above or below it), which a disc must keep clear of as it
// keeps clear of obstacles; `level`, which raised region a cell is on; and
// `gates`, every way up and down (core/queries.js's levelDist reads them).
// Every rule that reads it sits behind `hasHeight` (§4.1 rule 18), its own
// code path: classic and `open` boards never build a floor, and the code
// they run is the code they always ran.
// ---------------------------------------------------------------------------

const SQRT2 = Math.SQRT2

// (F7a) The height layer's constants (DESIGN §4.2.4's sizing table, each
// measured at the worst of 24 yaws and 3 sub-cell origins): a neighbour step
// anyone walks (a diagonal step up a stair rises 0.354", and a floor's
// quantisation adds at most 1/64": always under it); the slope every stair
// rises at (recipes.js builds them so: 4" long for a 2" deck); what a ladder
// costs per inch it climbs; and the largest disc every deck top, stair and
// ladder end admits, at the worst yaw: every climber's r is at most it
// (sim/data-check.mjs).
export const STEP = 0.4
export const STAIR_SLOPE = 0.5
export const LADDER_MUL = 2
export const CLIMB_R = 1.22
// Floors are quantised to 1/64" as they are rastered (§4.1 rule 18), so every
// comparison with STEP is between exact Float32 values. A point mirror's
// copy is built from the negated places and the yaw plus π (recipes.js
// fortFrame), whose cos and sin are an ulp or so off the first copy's
// negation: a cell centre exactly on a piece's edge, or a ramp's height
// exactly half a 64th, would otherwise land on either side by that ulp. The
// slack takes both copies the same way (it is far below a cell, and far
// above an ulp), so the floor is exactly point-symmetric.
const Q = 64, SLACK = 1e-6
// a quantised floor: k/64, ties up (both copies' ties, by the slack)
const quant = (y) => Math.floor(y * Q + 0.5 + SLACK) / Q

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
    // (S3) how many times the grid was rebuilt, and the last plan made
    // inside the current apply (core/actions/move.js movePlan: { sig, plan }, sig its key;
    // null outside one)
    this.epoch = 0
    this.memo = null
    // (F7a) false until a rebuild meets a chunk with a surface or a link; the
    // height arrays are allocated then, and only then (classic never has them)
    this.hasHeight = false
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
    this.epoch++
    // (F7a) a board with something to stand on builds the height layer, and
    // its rasters by level: its own path (rebuildHeight), never this one
    if (chunks.some((c) => c.alive && (c.surface || c.link))) return this.rebuildHeight(chunks)
    this.hasHeight = false
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
    const c = cos(s.yaw), sn = sin(s.yaw)
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
    // (F7a) a base never straddles a ledge: on a deck it keeps off the rim,
    // and on the ground off the deck's solid body. (F9a: a ground vehicle
    // also needs floor[i] ≤ STEP, its mode's test joining here; F9b: a long
    // hull both, for every disc's cell.)
    if (this.hasHeight) return this.clearance(i, mode === 'wreck' ? 'wreck' : 'all') >= r - 0.06 && this.cliff[i] >= r - 0.06
    return this.clearance(i, mode === 'wreck' ? 'wreck' : 'all') >= r - 0.06
  }

  // Dijkstra out to `max` inches. Flyers just get a circle: they ignore terrain
  // on the way and only need somewhere to land.
  //
  // (F7a) `climb`: the unit climbs ladders (u.t.climb, which only the plans'
  // mode setup reads: core/actions/move.js climbs). Read only with height.
  reach(sx, sz, { r, max, mode = 'walk', forbid = null, climb = false }) {
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
    if (this.hasHeight) return this.reachHeight(res, { r, max, mode, forbid, climb })
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
    if (this.hasHeight) return this.pathHeight(cells, pts, r, res.mode, forbid)
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
    if (this.hasHeight) return this.walkableHeight(a, b, r, mode, forbid)
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
  // ── Height (F7a, DESIGN §4.2.4) ───────────────────────────────────────────
  // rebuild(chunks) for a board with something to stand on, in the spec's
  // order: (1) the floor raster, in chunk order, the highest surface winning;
  // (2) the links; (3) the ledges, then the cliff field; (4) the levels and
  // the gates; (5) the hard, soft and difficult rasters, and (6) the cover,
  // each chunk's only on the cells whose floor is within STEP of the floor it
  // stands on (`base`, 0 when absent: a parapet on a deck covers the deck,
  // not the ditch below); then the clearance fields, as ever. (7, F9b: the
  // hull memo is cleared.)
  rebuildHeight(chunks) {
    const N = this.N
    if (!this.hasHeight) {
      this.hasHeight = true
      this.floor = new Float32Array(N)
      this.link = new Int32Array(N)
      // (doubles: a link's cost goes into reach's heap keys)
      this.linkCost = new Float64Array(N)
      this.ledge = new Uint8Array(N)
      this.cliff = new Float32Array(N)
      this.level = new Int32Array(N)
    }
    const { floor, link, linkCost, ledge, level, nx, nz } = this
    floor.fill(0)
    for (const c of chunks) if (c.alive && c.surface) this.rasterFloor(c.shape, c.surface)
    link.fill(-1)
    linkCost.fill(0)
    // a cell more than one ladder joins (a watchtower's top, which both its
    // ladders reach): the first in link and linkCost, the rest here, cell →
    // [[cell, cost]…] in chunk order; null when no cell has two
    this.linkMore = null
    for (const c of chunks) {
      if (!c.alive || !c.link) continue
      const { foot, top, h } = c.link
      const i = this.index(foot.x, foot.z), j = this.index(top.x, top.z)
      if (i < 0 || j < 0) continue
      this.joinCells(i, j, LADDER_MUL * h)
      this.joinCells(j, i, LADDER_MUL * h)
    }
    // a ledge: a cell with an 8-neighbour more than STEP above or below it
    // (on both sides of every edge, so a rim of ledge cells runs round each):
    // each pair of neighbours looked at once, from the one first in the
    // board's order, both marked
    ledge.fill(0)
    for (let iz = 0; iz < nz; iz++) {
      for (let ix = 0; ix < nx; ix++) {
        const i = iz * nx + ix, f = floor[i]
        if (ix < nx - 1 && Math.abs(floor[i + 1] - f) > STEP) ledge[i] = ledge[i + 1] = 1
        if (iz === nz - 1) continue
        if (Math.abs(floor[i + nx] - f) > STEP) ledge[i] = ledge[i + nx] = 1
        if (ix > 0 && Math.abs(floor[i + nx - 1] - f) > STEP) ledge[i] = ledge[i + nx - 1] = 1
        if (ix < nx - 1 && Math.abs(floor[i + nx + 1] - f) > STEP) ledge[i] = ledge[i + nx + 1] = 1
      }
    }
    this.field(ledge, null, this.cliff)
    // the levels: 0 on the ground (floor ≤ STEP), else the raised region's
    // number (8-connected by steps of STEP or less), 1, 2, … in the order of
    // each region's first cell
    level.fill(0)
    const stack = this.tmpCells ?? (this.tmpCells = new Int32Array(N))
    let regions = 0
    for (let i0 = 0; i0 < N; i0++) {
      if (level[i0] || floor[i0] <= STEP) continue
      level[i0] = ++regions
      let top = 0
      stack[top++] = i0
      while (top) {
        const i = stack[--top], ix = i % nx, iz = (i / nx) | 0
        for (let oz = -1; oz <= 1; oz++) {
          for (let ox = -1; ox <= 1; ox++) {
            const jx = ix + ox, jz = iz + oz
            if ((!ox && !oz) || jx < 0 || jz < 0 || jx >= nx || jz >= nz) continue
            const j = jz * nx + jx
            if (level[j] || floor[j] <= STEP || Math.abs(floor[j] - floor[i]) > STEP) continue
            level[j] = regions
            stack[top++] = j
          }
        }
      }
    }
    this.levels = regions
    // the gates, in chunk order: each alive stair (its low and high ends'
    // centres, costing its length) and ladder (its foot and top, costing
    // LADDER_MUL × its height), with the level its high end is on
    this.gates = []
    for (const c of chunks) {
      if (!c.alive) continue
      if (c.surface?.ramp) {
        const s = c.shape, { axis, y0, y1 } = c.surface.ramp
        const h = axis === 'x' ? s.hx : s.hz, up = y1 >= y0 ? 1 : -1
        const end = (k) => this.local(s, axis === 'x' ? k * h : 0, axis === 'z' ? k * h : 0)
        const lo = end(-up), hi = end(up)
        this.gates.push({ id: c.id, lo, hi, level: this.levelAt(hi.x, hi.z), cost: 2 * h, ladder: false })
      } else if (c.link) {
        const { foot, top, h } = c.link
        this.gates.push({ id: c.id, lo: { x: foot.x, z: foot.z }, hi: { x: top.x, z: top.z }, level: this.levelAt(top.x, top.z), cost: LADDER_MUL * h, ladder: true })
      }
    }
    // today's rasters, each by its chunk's level
    this.hard.fill(0)
    this.soft.fill(0)
    this.diff.fill(0)
    this.cover.fill(0)
    for (const c of chunks) {
      if (!c.alive) continue
      const s = c.nav || c.shape, base = c.base ?? 0
      if (c.navKind === 'hard') this.rasterAt(s, 0.1, this.hard, base)
      else if (c.navKind === 'soft') this.rasterAt(s, 0.1, this.soft, base)
      else if (c.navKind === 'diff') this.rasterAt(s, 0.15, this.diff, base)
      if (c.cover) this.rasterAt(c.coverShape || s, 0.6, this.cover, base)
    }
    this.field(this.hard, null, this.clearHard)
    this.field(this.hard, this.soft, this.clearAll)
  }

  // a point (lx, lz) of shape s's own frame, on the table (the inverse of the
  // rasters' turn into it, as recipes.js's fortFrame places a piece)
  local(s, lx, lz) {
    const c = cos(s.yaw), sn = sin(s.yaw)
    return { x: s.x + c * lx + sn * lz, z: s.z - sn * lx + c * lz }
  }

  // the level at (x, z): 0 off the table, or without height
  levelAt(x, z) {
    const i = this.index(x, z)
    return i < 0 || !this.hasHeight ? 0 : this.level[i]
  }

  // a link from cell i to cell j, costing `cost`
  joinCells(i, j, cost) {
    if (this.link[i] < 0) {
      this.link[i] = j
      this.linkCost[i] = cost
      return
    }
    if (this.link[i] === j) return
    this.linkMore ??= new Map()
    const more = this.linkMore.get(i)
    if (more) more.push([j, cost])
    else this.linkMore.set(i, [[j, cost]])
  }

  // The cost of the link from cell i to cell j, or -1 when no link joins
  // them (the move tooltip walks a plan's prev chain adding these: F7b).
  linkCostOf(i, j) {
    if (!this.hasHeight || i < 0) return -1
    if (this.link[i] === j) return this.linkCost[i]
    const more = this.linkMore?.get(i)
    if (more) for (const [k, cost] of more) if (k === j) return cost
    return -1
  }

  // A surface's floor on the cells whose centres its shape covers: a deck's
  // y, a ramp's height lerped along its axis from y0 at its own − end to y1
  // at its + end, quantised; the highest so far wins.
  rasterFloor(s, surf) {
    const reach = hypot(s.hx, s.hz) + this.cell
    const c = cos(s.yaw), sn = sin(s.yaw)
    const ramp = surf.ramp
    const ix0 = Math.max(0, Math.floor((s.x - reach + this.W / 2) / this.cell))
    const ix1 = Math.min(this.nx - 1, Math.floor((s.x + reach + this.W / 2) / this.cell))
    const iz0 = Math.max(0, Math.floor((s.z - reach + this.H / 2) / this.cell))
    const iz1 = Math.min(this.nz - 1, Math.floor((s.z + reach + this.H / 2) / this.cell))
    for (let iz = iz0; iz <= iz1; iz++) {
      for (let ix = ix0; ix <= ix1; ix++) {
        const i = iz * this.nx + ix
        const dx = this.x(i) - s.x, dz = this.z(i) - s.z
        const lx = dx * c - dz * sn
        const lz = dx * sn + dz * c
        if (Math.abs(lx) > s.hx + SLACK || Math.abs(lz) > s.hz + SLACK) continue
        let y = surf.y
        if (ramp) {
          const l = ramp.axis === 'x' ? lx : lz, h = ramp.axis === 'x' ? s.hx : s.hz
          const t = Math.min(1, Math.max(0, (l + h) / (2 * h)))
          y = ramp.y0 + (ramp.y1 - ramp.y0) * t
        }
        y = quant(y)
        if (y > this.floor[i]) this.floor[i] = y
      }
    }
  }

  // raster, on the cells whose floor is within STEP of `base` only
  rasterAt(s, pad, arr, base) {
    const reach = hypot(s.hx, s.hz) + pad
    const c = cos(s.yaw), sn = sin(s.yaw)
    const ix0 = Math.max(0, Math.floor((s.x - reach + this.W / 2) / this.cell))
    const ix1 = Math.min(this.nx - 1, Math.floor((s.x + reach + this.W / 2) / this.cell))
    const iz0 = Math.max(0, Math.floor((s.z - reach + this.H / 2) / this.cell))
    const iz1 = Math.min(this.nz - 1, Math.floor((s.z + reach + this.H / 2) / this.cell))
    for (let iz = iz0; iz <= iz1; iz++) {
      for (let ix = ix0; ix <= ix1; ix++) {
        const i = iz * this.nx + ix
        if (Math.abs(this.floor[i] - base) > STEP) continue
        const dx = this.x(i) - s.x, dz = this.z(i) - s.z
        const lx = dx * c - dz * sn
        const lz = dx * sn + dz * c
        if (Math.abs(lx) <= s.hx + pad && Math.abs(lz) <= s.hz + pad) arr[i] = 1
      }
    }
  }

  // reach (walk and wreck modes) with height: a neighbour step needs the
  // floors within STEP of each other and its end standable (the cliff
  // included); a climber may also take a link at its cost, onto a standable
  // end. Stairs cost their length: a step up one costs what it does on the
  // flat. (Burrowing, F5a's insectoids: no unit burrows yet, and the mode
  // walks; a deck's footprint is hard to it, so a burrower keeps to the
  // ground and takes no ladder, until F5a's burrow field replaces this.)
  reachHeight(res, { r, max, mode, forbid, climb }) {
    const { dist, prev, start, sx, sz } = res
    const { nx, nz, cell, floor, cliff, link, linkCost } = this
    const d0 = hypot(sx - this.x(start), sz - this.z(start))
    dist[start] = d0
    const heap = new Heap()
    heap.push(start, d0)
    const clMode = mode === 'wreck' ? 'wreck' : 'all'
    const burrow = mode === 'burrow'
    const climbs = climb && !burrow
    // a unit that starts somewhere cramped may wriggle out through its own
    // footprint, as on the flat; a ledge squeezes it as an obstacle does (it
    // still never steps more than STEP up or down)
    const escape = this.clearance(start, clMode) < r - 0.06 || cliff[start] < r - 0.06 ? r * 1.5 : 0
    const relax = (i, j, nd) => {
      if (nd <= max && nd < dist[j]) {
        dist[j] = nd
        prev[j] = i
        heap.push(j, nd)
      }
    }
    while (heap.size) {
      const [i, d] = heap.pop()
      if (d > dist[i]) continue
      const ix = i % nx, iz = (i / nx) | 0, fi = floor[i]
      for (let oz = -1; oz <= 1; oz++) {
        for (let ox = -1; ox <= 1; ox++) {
          if (!ox && !oz) continue
          const jx = ix + ox, jz = iz + oz
          if (jx < 0 || jz < 0 || jx >= nx || jz >= nz) continue
          const j = jz * nx + jx
          if (forbid && forbid[j]) continue
          if (Math.abs(floor[j] - fi) > STEP) continue
          if (burrow && floor[j] > STEP) continue
          const cl = this.clearance(j, clMode), cf = cliff[j]
          if ((cl < r - 0.06 || cf < r - 0.06) && !(escape && cl > 0.05 && cf > 0.05 && hypot(this.x(j) - sx, this.z(j) - sz) < escape)) continue
          let mul = this.diff[j] ? 2 : 1
          if (mode === 'wreck' && this.clearAll[j] < r - 0.06) mul = 2
          relax(i, j, d + (ox && oz ? SQRT2 : 1) * cell * mul)
        }
      }
      if (!climbs || link[i] < 0) continue
      // a ladder: up or down, at its cost, onto a standable end
      if (this.standable(link[i], r, mode, forbid)) relax(i, link[i], d + linkCost[i])
      const more = this.linkMore?.get(i)
      if (more) for (const [j, cost] of more) if (this.standable(j, r, mode, forbid)) relax(i, j, d + cost)
    }
    return res
  }

  // path with height: the cell path cut at each link (a step between cells
  // that are no neighbours), each run string-pulled on its own, so the foot
  // and the top stay vertices; the top is marked `climb` (the segment into it
  // is the climb, its `cost` the link's).
  pathHeight(cells, pts, r, mode, forbid) {
    const out = []
    let a = 0
    for (let k = 1; k <= cells.length; k++) {
      if (k < cells.length) {
        const i = cells[k - 1], j = cells[k]
        if (Math.abs((i % this.nx) - (j % this.nx)) <= 1 && Math.abs(((i / this.nx) | 0) - ((j / this.nx) | 0)) <= 1) continue
      }
      const run = this.pull(pts.slice(a, k), r, mode, forbid)
      if (out.length) run[0] = { ...run[0], climb: true, cost: this.linkCostOf(cells[a - 1], cells[a]) }
      out.push(...run)
      a = k
    }
    return out
  }

  // the string-pull of one run of neighbouring cells (path's, with height)
  pull(pts, r, mode, forbid) {
    if (pts.length < 3) return pts
    const out = [pts[0]]
    let k = 0
    while (k < pts.length - 1) {
      let best = k + 1
      for (let j = pts.length - 1; j > k + 1; j--) {
        if (this.walkable(pts[k], pts[j], r, mode, forbid)) {
          best = j
          break
        }
      }
      out.push(pts[best])
      k = best
    }
    return out
  }

  // walkable with height: also refuses a sample on a ledge's band (cliff
  // under r − 0.06) or more than STEP above or below the sample before it,
  // and an enemy's disc only where the segment passes it at its level
  // (within 1.2" of its floor: core/actions/move.js forbidMask)
  walkableHeight(a, b, r, mode, forbid) {
    const len = hypot(b.x - a.x, b.z - a.z)
    const steps = Math.ceil(len / (this.cell * 0.5))
    const ia = this.index(a.x, a.z)
    const d0 = this.diff[ia]
    let f = this.floor[ia]
    for (let s = 1; s < steps; s++) {
      const t = s / steps
      const i = this.index(a.x + (b.x - a.x) * t, a.z + (b.z - a.z) * t)
      if (i < 0) return false
      if (forbid && forbid[i]) return false
      if (this.clearance(i, mode === 'wreck' ? 'wreck' : 'all') < r - 0.06) return false
      if (this.cliff[i] < r - 0.06 || Math.abs(this.floor[i] - f) > STEP) return false
      f = this.floor[i]
      if (this.diff[i] !== d0) return false
      if (mode === 'wreck' && this.clearAll[i] < r - 0.06) return false
    }
    if (forbid?.discs) {
      for (const d of forbid.discs) {
        if (segDist(a, b, d) >= d.R) continue
        const t = segT(a, b, d), i = this.index(a.x + (b.x - a.x) * t, a.z + (b.z - a.z) * t)
        if (i < 0 || Math.abs(this.floor[i] - d.y) <= 1.2) return false
      }
    }
    return true
  }
}

// how far along a → b (0 to 1) the point nearest p lies
function segT(a, b, p) {
  const dx = b.x - a.x, dz = b.z - a.z
  const L2 = dx * dx + dz * dz
  const t = L2 > 0 ? ((p.x - a.x) * dx + (p.z - a.z) * dz) / L2 : 0
  return t < 0 ? 0 : t > 1 ? 1 : t
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
