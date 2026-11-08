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
// (F5a, DESIGN §4.2.12) The burrow mode reads `clearHard` too: a burrower
// (the Hive's Delvers and Deepguard) tunnels under soft and difficult
// scenery (walls, hedges, trees, crates, kegs; rough ground) at a walker's
// pace, ×1, its pulled path free of the rough-ground test the search never
// paid, and ends on a cell standable on foot (`standable` reads 'all' for
// every mode but 'wreck'). With height it keeps to floors at or under STEP,
// the cliff field keeping its disc off a deck's ledge as a walker's, so a
// deck's footprint is hard to it with no third array. Each is a branch only
// `mode === 'burrow'` reaches (§4.1 rule 30): walk, wreck and fly read what
// they always read.
//
// (F7a, DESIGN §4.2.4) Height. A board with fortifications (an alive chunk
// with a `surface` or a `link`: recipes.js's decks, stairs and ladders) also
// builds a height layer, derived from the chunks like the clearance fields
// and never hashed (§4.1 rule 21): `floor`, the walkable height of every
// cell; `link`, the ladders, each joining a foot cell to a top cell; `cliff`,
// the distance from every cell to the nearest ledge (a cell with a neighbour
// more than STEP above or below it), which a disc must keep clear of as it
// keeps clear of obstacles; `level`, which raised region a cell is on;
// `gates`, every way up and down (core/queries.js's levelDist reads them,
// with `rampOf`, the stair a raised cell stands on); and `linkSave` and
// `linkMin`, how much farther than it costs a link may carry a climber
// (core/ai/score.js's scanBox widens by them).
// Every rule that reads it sits behind `hasHeight` (§4.1 rule 18), its own
// code path: classic and `open` boards never build a floor, and the code
// they run is the code they always ran.
//
// (F9b, DESIGN §4.2.5) Long hulls. A unit with a footprint (core/footprint.js
// t.fp: 2 or 3 discs turned with its facing) is planned over (cell, heading)
// states, not cells: hullReach, a Dijkstra that drives forward, backs up and
// pivots where the swept arc is clear, with its own path (hullPath: straight
// runs and pivots, never string-pulled) and its per-cell digest (cellBest).
// Its terrain-only tests are memoised per nav epoch (hullMemo, a derived
// cache that never decides: §4.1 rule 21); no round unit's plan reads any
// of it.
// ---------------------------------------------------------------------------

const SQRT2 = Math.SQRT2

// (F9b) The eight headings, the nav's own neighbour steps: DIRS[h] = [dx, dz]
// in cells, h = 0 facing +z, h = 2 facing +x, clockwise seen from above (the
// turn core/footprint.js gives a footprint's discs, and the wreck raster's
// yaw, h·π/4)
export const DIRS = Object.freeze([[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]].map((d) => Object.freeze(d)))

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
    // (F9b) the long hulls' terrain tests, per footprint and mode, for this
    // epoch: '<race>.<unit>:<mode>' → Uint8Array(N·8), a byte per state
    // (cell·8 + heading): 1 stand known, 2 stand ok, 4 sweep known, 8 sweep
    // ok, 16 this state's step costs double. Cleared by every rebuild;
    // the forbid masks, a plan's own, are never in it.
    this.hullMemo = new Map()
    // (F9b) each footprint's tables as this grid's cells, by the footprint
    // (hullTab: its offsets depend on the grid's row length alone, so they
    // never go stale), and hullReach's touched list and heap, grown as
    // they need
    this.hullTabs = new Map()
    this.hullTouch = new Int32Array(1024)
    this.hullHeap = null
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
    // (F9b) the hull memo is the old terrain's
    this.hullMemo.clear()
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

  // (F5a) the burrow field is the hard one: what nothing breaks stops it
  clearance(i, mode) {
    return mode === 'wreck' || mode === 'burrow' ? this.clearHard[i] : this.clearAll[i]
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
    // ((F5a) a burrower measures the burrow field, and tunnels at ×1.)
    const burrow = mode === 'burrow', fm = mode === 'wreck' ? 'wreck' : burrow ? 'burrow' : 'all'
    const escape = this.clearance(start, fm) < r - 0.06 ? r * 1.5 : 0
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
          const cl = this.clearance(j, fm)
          if (cl < r - 0.06 && !(escape && cl > 0.05 && hypot(this.x(j) - sx, this.z(j) - sz) < escape)) continue
          let mul = burrow ? 1 : this.diff[j] ? 2 : 1
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
      if (this.clearance(i, mode === 'wreck' ? 'wreck' : mode === 'burrow' ? 'burrow' : 'all') < r - 0.06) return false
      // don't let string-pulling shortcut across rough ground the search paid
      // for ((F5a) a burrower paid nothing for it, so its pull keeps the
      // tunnel the search found)
      if (mode !== 'burrow' && this.diff[i] !== d0) return false
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
  // the gates (and, F7b, the level each parapet's deck is on: onLevel);
  // (5) the hard, soft and difficult rasters, and (6) the cover, each
  // chunk's only on the cells whose floor is within STEP of the floor it
  // stands on (`base`, 0 when absent: a parapet on a deck covers the deck,
  // not the ditch below; F7b's parapets join F9a's wreck (on the floor its
  // hull stood on) as chunks with a base, the first standing on a raised
  // deck, so the first whose cover this keeps off the ground below, and
  // their cover is the band behind them, their `coverShape`); then the
  // clearance fields, as ever. (7, F9b:
  // the hull memo is cleared.)
  //
  // (F7c) A timber deck shot out from under its defenders (core/terrain/
  // terrain.js's cascade) is a chunk no longer alive, and so are its
  // ladders: the rebuild after it (the refreshNav that ends the blast, the
  // move or the charge, right before core/actions/settle.js) rasters no
  // floor for the deck and no link for its ladders, so its footprint is
  // ground again, its rims are ledges no more (their cliff field with
  // them), its level and its gates are gone (gateGraph's memo is keyed by
  // the epoch: queries.js levelDist), and the pile of planks it left is
  // difficult ground and cover there, rastered at the ground's level as any
  // chunk with no base. Nothing here is new: every array is derived from the
  // live chunks. A board whose last raised piece falls (one whose only
  // pieces were platforms) builds no height layer at its next rebuild
  // (rebuild, above), and plays on as a flat board does.
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
      this.rampOf = new Int32Array(N)
    }
    const { floor, link, linkCost, ledge, level, nx, nz } = this
    floor.fill(0)
    this.rampOf.fill(-1)
    for (const c of chunks) if (c.alive && c.surface) this.rasterFloor(c.shape, c.surface, c.id)
    link.fill(-1)
    linkCost.fill(0)
    // a cell more than one ladder joins (a watchtower's top, which both its
    // ladders reach): the first in link and linkCost, the rest here, cell →
    // [[cell, cost]…] in chunk order; null when no cell has two
    this.linkMore = null
    // (the review) a link costs LADDER_MUL × its height, but joins a foot
    // 2.25" out from its face to a top on its deck's centreline: a rampart's
    // or platform's ladder carries a climber some 0.5" farther than it costs,
    // a bastion's 0.75" (more, cell centre to cell centre), so a plan's
    // finite cells are no longer all within its max of the start. linkSave
    // is the most any alive link carries beyond its cost (0 when none does)
    // and linkMin the least a link costs (Infinity with none): a plan of max
    // m takes at most floor(m / linkMin) links, so no cell of it lies more
    // than m + linkSave × that from its start (scanBox's bound)
    this.linkSave = 0
    this.linkMin = Infinity
    for (const c of chunks) {
      if (!c.alive || !c.link) continue
      const { foot, top, h } = c.link
      const i = this.index(foot.x, foot.z), j = this.index(top.x, top.z)
      if (i < 0 || j < 0) continue
      this.joinCells(i, j, LADDER_MUL * h)
      this.joinCells(j, i, LADDER_MUL * h)
      const save = hypot(this.x(i) - this.x(j), this.z(i) - this.z(j)) - LADDER_MUL * h
      if (save > this.linkSave) this.linkSave = save
      if (LADDER_MUL * h < this.linkMin) this.linkMin = LADDER_MUL * h
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
    // (the review) each stair's gate by its chunk's id, for rampOf's cells
    this.stairGate = new Map()
    for (const c of chunks) {
      if (!c.alive) continue
      if (c.surface?.ramp) {
        const s = c.shape, { axis, y0, y1 } = c.surface.ramp
        const h = axis === 'x' ? s.hx : s.hz, up = y1 >= y0 ? 1 : -1
        const end = (k) => this.local(s, axis === 'x' ? k * h : 0, axis === 'z' ? k * h : 0)
        const lo = end(-up), hi = end(up)
        this.stairGate.set(c.id, this.gates.length)
        this.gates.push({ id: c.id, lo, hi, level: this.levelAt(hi.x, hi.z), cost: 2 * h, ladder: false })
      } else if (c.link) {
        const { foot, top, h } = c.link
        this.gates.push({ id: c.id, lo: { x: foot.x, z: foot.z }, hi: { x: top.x, z: top.z }, level: this.levelAt(top.x, top.z), cost: LADDER_MUL * h, ladder: true })
      }
    }
    // (F7b) the level of the deck each alive piece standing on one is on (a
    // chunk with a `base` and its deck's id, `on`: a parapet), chunk id →
    // level: the region its deck's centre is in. A shooter on that level, at
    // the piece's base, looks over it (core/queries.js sight: defenders fire
    // over their own parapets), as anyone looks over an obscurer it hugs.
    // (A deck comes before what stands on it, in its recipe's order.)
    const deckLevel = new Map()
    this.onLevel = new Map()
    for (const c of chunks) {
      if (!c.alive) continue
      if (c.surface && !c.surface.ramp) deckLevel.set(c.id, this.levelAt(c.shape.x, c.shape.z))
      else if (c.base !== undefined && c.on !== undefined) this.onLevel.set(c.id, deckLevel.get(c.on) ?? 0)
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
    // (7, F9b) the hull memo is the old terrain's
    this.hullMemo.clear()
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
  // at its + end, quantised; the highest so far wins. (The review) rampOf
  // keeps, for each cell, the id of the stair whose ramp gave it its floor
  // (−1 where a deck's, or nothing's, did): a unit standing partway up a
  // stair walks down it, not round by its top (queries.js levelDist).
  rasterFloor(s, surf, id) {
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
        if (y > this.floor[i]) {
          this.floor[i] = y
          this.rampOf[i] = ramp ? id : -1
        }
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

  // reach (walk, wreck and burrow modes) with height: a neighbour step needs
  // the floors within STEP of each other and its end standable (the cliff
  // included); a climber may also take a link at its cost, onto a standable
  // end. Stairs cost their length: a step up one costs what it does on the
  // flat. (F5a, DESIGN §4.2.12) A burrower reads the burrow field (the hard
  // one, so it passes under soft and difficult scenery at ×1) and keeps to
  // the ground: a deck's footprint is hard to it (D:2926), so it never
  // steps onto a floor above STEP (no stair top, no deck), takes no ladder
  // (its climb is false, and `climbs` refuses it anyway), and keeps its
  // disc clear of every ledge by the cliff test, as a walker's.
  reachHeight(res, { r, max, mode, forbid, climb }) {
    const { dist, prev, start, sx, sz } = res
    const { nx, nz, cell, floor, cliff, link, linkCost } = this
    const d0 = hypot(sx - this.x(start), sz - this.z(start))
    dist[start] = d0
    const heap = new Heap()
    heap.push(start, d0)
    const clMode = mode === 'wreck' ? 'wreck' : mode === 'burrow' ? 'burrow' : 'all'
    const burrow = mode === 'burrow'
    const climbs = climb && !burrow   // (Q4 makes climb false for it anyway)
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
          if (burrow && floor[j] > STEP) continue   // a deck's footprint is hard (D:2926)
          const cl = this.clearance(j, clMode), cf = cliff[j]
          if ((cl < r - 0.06 || cf < r - 0.06) && !(escape && cl > 0.05 && cf > 0.05 && hypot(this.x(j) - sx, this.z(j) - sz) < escape)) continue
          let mul = burrow ? 1 : this.diff[j] ? 2 : 1
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
  // (within 1.2" of its floor: core/actions/move.js forbidMask). (F5a) A
  // burrower's pull reads its field, skips the rough-ground test as on the
  // flat, and never crosses a sample above STEP.
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
      if (this.clearance(i, mode === 'wreck' ? 'wreck' : mode === 'burrow' ? 'burrow' : 'all') < r - 0.06) return false
      if (this.cliff[i] < r - 0.06 || Math.abs(this.floor[i] - f) > STEP) return false
      if (mode === 'burrow' && this.floor[i] > STEP) return false
      f = this.floor[i]
      if (mode !== 'burrow' && this.diff[i] !== d0) return false
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

  // ── Long hulls (F9b, DESIGN §4.2.5) ───────────────────────────────────────
  // A state is (c, h), index c·8 + h: the body disc on cell c, facing h. A
  // footprint `fp` is a unit type's t.fp (core/footprint.js): fp.H[h][q] its
  // discs' cell offsets at heading h, fp.S[h] the pivot sweep from h to
  // h + 1, fp.cls[q] disc q's radius class. `mode` is the plan's: 'walk' or
  // 'wreck' (a wrecker measures clearHard, so it pivots through soft
  // scenery and smashes it). `forbid`, null or one Uint8Array(N) (or null)
  // per radius class (core/actions/move.js forbidMask, built per class): a
  // disc never stands, nor sweeps, on a cell of its class's mask.

  // The memo for one footprint and mode (a byte per state, hullMemo above)
  hullMemoOf(fp, mode) {
    const key = `${fp.id}:${mode}`
    let m = this.hullMemo.get(key)
    if (!m) this.hullMemo.set(key, (m = new Uint8Array(this.N * 8)))
    return m
  }

  // A footprint's tables as this grid's cells, made once a grid for each
  // footprint (its row length is the grid's): for H (each disc) and S (each sweep sample), per
  // heading, `off` the cell index offset, `need` the clearance it needs
  // there (r − 0.06 for a disc, the sample's need), `cls` its radius
  // class, and `box` the offsets' extremes [lox, hix, loz, hiz] (a state is
  // on the board, every disc or sample of it, exactly when they are).
  hullTab(fp) {
    let tab = this.hullTabs.get(fp)
    if (tab) return tab
    const nx = this.nx
    const flat = (rows, needOf, clsOf) => {
      const len = rows[0].length
      const off = new Int32Array(8 * len), need = new Float64Array(8 * len), cls = new Int32Array(8 * len), box = new Int32Array(32)
      rows.forEach((row, h) => {
        let lox = 0, hix = 0, loz = 0, hiz = 0
        row.forEach((p, k) => {
          off[h * len + k] = p.iz * nx + p.ix
          need[h * len + k] = needOf(p)
          cls[h * len + k] = clsOf(p, k)
          lox = Math.min(lox, p.ix)
          hix = Math.max(hix, p.ix)
          loz = Math.min(loz, p.iz)
          hiz = Math.max(hiz, p.iz)
        })
        box.set([lox, hix, loz, hiz], 4 * h)
      })
      return { len, off, need, cls, box }
    }
    tab = { H: flat(fp.H, (d) => d.r - 0.06, (d, k) => fp.cls[k]), S: flat(fp.S, (p) => p.need, (p) => fp.cls[p.q]) }
    this.hullTabs.set(fp, tab)
    return tab
  }

  // Whether state s's entries of one of a footprint's flat tables fit (`t`,
  // its H or its S): every entry's cell on the board with
  // clearance (clearHard in wreck mode, clearAll else) ≥ its need and, with
  // height, cliff ≥ its need and floor ≤ STEP (a ground hull never climbs)
  hullFits(t, s, mode) {
    const { nx, nz } = this
    const c = s >> 3, h = s & 7, ix = c % nx, iz = (c / nx) | 0, b = 4 * h
    if (ix + t.box[b] < 0 || ix + t.box[b + 1] >= nx || iz + t.box[b + 2] < 0 || iz + t.box[b + 3] >= nz) return false
    const cl = mode === 'wreck' ? this.clearHard : this.clearAll
    for (let k = h * t.len, e = k + t.len; k < e; k++) {
      const j = c + t.off[k], need = t.need[k]
      if (cl[j] < need || (this.hasHeight && (this.cliff[j] < need || this.floor[j] > STEP))) return false
    }
    return true
  }

  // State s's stand bits, measured once an epoch: 2 when its discs fit
  // (hullFits, the tables' H: each disc r_q − 0.06); 16 with it when a step
  // onto it costs double, a disc on difficult ground or a wrecker's disc
  // ploughing (clearAll under r_q − 0.06)
  hullStandBits(m, s, fp, mode) {
    const b = m[s]
    if (b & 1) return b
    const t = this.hullTab(fp).H
    let bits = 1
    if (this.hullFits(t, s, mode)) {
      bits |= 2
      const c = s >> 3
      for (let k = (s & 7) * t.len, e = k + t.len; k < e; k++) {
        const j = c + t.off[k]
        if (this.diff[j] || (mode === 'wreck' && this.clearAll[j] < t.need[k])) bits |= 16
      }
    }
    return (m[s] = b | bits)
  }

  // State s's sweep bits, measured once an epoch: 8 when the pivot from s's
  // heading h to h + 1 about its cell is clear (hullFits, the tables' S:
  // each sample's need). The end states are the lattice's to test.
  hullSweepBits(m, s, fp, mode) {
    const b = m[s]
    if (b & 4) return b
    return (m[s] = b | 4 | (this.hullFits(this.hullTab(fp).S, s, mode) ? 8 : 0))
  }

  // whether no disc of state s (or, `sweep`, no sample of its pivot to
  // h + 1) lies on its class's forbid mask; s's cells are on the board
  hullFree(s, fp, forbid, sweep = false) {
    if (!forbid) return true
    const tab = this.hullTab(fp), t = sweep ? tab.S : tab.H, c = s >> 3
    for (let k = (s & 7) * t.len, e = k + t.len; k < e; k++) {
      const f = forbid[t.cls[k]]
      if (f && f[c + t.off[k]]) return false
    }
    return true
  }

  // Does the hull stand at (c, h)? (Its terrain, memoised, and the masks.)
  hullStands(c, h, fp, mode = 'walk', forbid = null) {
    hullMasks(forbid)
    const s = c * 8 + h
    return c >= 0 && !!(this.hullStandBits(this.hullMemoOf(fp, mode), s, fp, mode) & 2) && this.hullFree(s, fp, forbid)
  }

  // Is the pivot from (c, h) to (c, h + 1) clear? (Its sweep alone: the end
  // states stand or not on their own.)
  hullSwings(c, h, fp, mode = 'walk', forbid = null) {
    hullMasks(forbid)
    const s = c * 8 + h
    return c >= 0 && !!(this.hullSweepBits(this.hullMemoOf(fp, mode), s, fp, mode) & 8) && this.hullFree(s, fp, forbid, true)
  }

  // Can the hull at (c, h) pivot at least one way: right to h + 1 (S[h]
  // clear, (c, h + 1) standing) or left to h − 1 (S[h − 1] clear, (c, h − 1)
  // standing)? The AI's room term and the placement's "no room to turn here"
  // ask it.
  hullRoom(c, h, fp, mode = 'walk', forbid = null) {
    const r = (h + 1) & 7, l = (h + 7) & 7
    return (this.hullSwings(c, h, fp, mode, forbid) && this.hullStands(c, r, fp, mode, forbid)) ||
      (this.hullSwings(c, l, fp, mode, forbid) && this.hullStands(c, l, fp, mode, forbid))
  }

  // The cells state (c, h)'s discs stand on, front to back (−1 for one off
  // the board).
  hullCells(c, h, fp) {
    const { nx, nz } = this, ix = c % nx, iz = (c / nx) | 0
    return fp.H[h].map((d) => {
      const jx = ix + d.ix, jz = iz + d.iz
      return jx < 0 || jz < 0 || jx >= nx || jz >= nz ? -1 : jz * nx + jx
    })
  }

  // The lattice: a Dijkstra over states from the hull at (sx, sz) facing h0,
  // out to `max` inches. From each popped state, in this order (§4.1 rule
  // 25):
  //   1. forward, to (c + DIRS[h], h), at step·mul, step 0.5" or 0.5·√2" as
  //      reach's (the same expression, so the body disc's reach is an
  //      exact lower bound: sim/property.mjs P-lattice);
  //   2. reverse, to (c − DIRS[h], h), at step·rev·mul;
  //   3. pivot right, to (c, h + 1), at turn, if the sweep S[h] is clear;
  //   4. pivot left, to (c, h − 1), at turn, if the sweep S[h − 1] is clear;
  // each onto a state that stands, `mul` 2 where the target's bit 16 says.
  // The start state is accepted as it stands (no wriggle: nothing makes a
  // ground hull's own cells unstandable between commands but F7c's
  // collapse, whose settle moves it); its distance is from where the unit
  // stands to its cell's centre, as reach's. Ties pop as reach's (the same
  // heap). A flier never uses the lattice: a flying hull is round.
  //
  // Returns { fp, mode, max, sx, sz, h0, start, dist, prev, touched }:
  // `start` the start state (−1 off the board), `dist` (Float64) and `prev`
  // (Int32, −1 for none) of N·8, by state, and `touched` the states it
  // reached, in the order it first reached them (cellBest's walk). `into`,
  // an earlier result of this grid its caller is done with, lends its
  // arrays: reset through its own touched list, not a fill (that earlier
  // result reads the new plan from then on).
  hullReach(sx, sz, h0, fp, { max, mode = 'walk', forbid = null, into = null } = {}) {
    if (mode === 'fly') throw new Error('hullReach: a flier is round and never uses the lattice')
    // (F5a) a guard: no burrowing hull in v1 (D:4199), so no lattice mode
    if (mode === 'burrow') throw new Error('hullReach: no hull burrows (no burrowing hull in v1)')
    if (fp.cell !== this.cell) throw new Error(`hullReach: the footprint's offsets are in ${fp.cell}" cells, the grid's ${this.cell}"`)
    if (!(Number.isInteger(h0) && h0 >= 0 && h0 < 8)) throw new Error(`hullReach: a heading is 0-7, not ${h0}`)
    hullMasks(forbid)
    const N8 = this.N * 8
    let dist, prev
    if (into && into.dist.length === N8) {
      dist = into.dist
      prev = into.prev
      for (const s of into.touched) {
        dist[s] = Infinity
        prev[s] = -1
      }
    } else {
      dist = new Float64Array(N8).fill(Infinity)
      prev = new Int32Array(N8).fill(-1)
    }
    const c0 = this.index(sx, sz)
    const res = { fp, mode, max, sx, sz, h0, start: c0 < 0 ? -1 : c0 * 8 + h0, dist, prev, touched: null }
    let touch = this.hullTouch, n = 0
    if (c0 >= 0) {
      const m = this.hullMemoOf(fp, mode)
      const { nx, nz, cell } = this
      const turn = fp.turn, rev = fp.rev
      const s0 = res.start
      dist[s0] = hypot(sx - this.x(c0), sz - this.z(c0))
      touch[n++] = s0
      const heap = (this.hullHeap ??= new StateHeap())
      heap.size = 0
      heap.push(s0, dist[s0])
      while (heap.size) {
        const d = heap.topKey(), s = heap.pop()
        if (d > dist[s]) continue
        const c = s >> 3, h = s & 7, ix = c % nx, iz = (c / nx) | 0
        const dir = DIRS[h], dx = dir[0], dz = dir[1]
        const step = (h & 1 ? SQRT2 : 1) * cell
        // the four moves in rule 25's order: forward, reverse, pivot right
        // (the sweep S[h] from s), pivot left (S[h − 1], from the state it
        // ends on); each target t standing (its memo bits, then the masks)
        for (let k = 0; k < 4; k++) {
          let t
          if (k < 2) {
            const jx = k ? ix - dx : ix + dx, jz = k ? iz - dz : iz + dz
            if (jx < 0 || jz < 0 || jx >= nx || jz >= nz) continue
            t = (jz * nx + jx) * 8 + h
          } else {
            const w = k === 2 ? s : c * 8 + ((h + 7) & 7)
            let b = m[w]
            if (!(b & 4)) b = this.hullSweepBits(m, w, fp, mode)
            if (!(b & 8) || (forbid && !this.hullFree(w, fp, forbid, true))) continue
            t = k === 2 ? c * 8 + ((h + 1) & 7) : w
          }
          let b = m[t]
          if (!(b & 1)) b = this.hullStandBits(m, t, fp, mode)
          if (!(b & 2) || (forbid && !this.hullFree(t, fp, forbid))) continue
          const nd = k === 0 ? d + step * (b & 16 ? 2 : 1) : k === 1 ? d + step * rev * (b & 16 ? 2 : 1) : d + turn
          if (nd > max) continue
          const old = dist[t]
          if (!(nd < old)) continue
          if (old === Infinity) {
            if (n === touch.length) {
              const more = new Int32Array(touch.length * 2)
              more.set(touch)
              this.hullTouch = touch = more
            }
            touch[n++] = t
          }
          dist[t] = nd
          prev[t] = s
          heap.push(t, nd)
        }
      }
    }
    res.touched = touch.slice(0, n)
    return res
  }

  // The body's path to state (c, h) of a lattice plan, as { x, z, f } points
  // from where the unit stands: consecutive steps one way merge into one
  // straight run, a pivot is a repeated point with its new f (two pivots,
  // two repeats); no string-pulling, so a long hull drives straight, pivots
  // and drives straight. [] when the plan never reached (c, h). (A run's
  // facing is its points' f; it backs up where it runs against DIRS[f].)
  hullPath(res, c, h) {
    const goal = c * 8 + h
    if (res.start < 0 || !(res.dist[goal] < Infinity)) return []
    const states = []
    for (let s = goal; s !== -1; s = res.prev[s]) {
      states.push(s)
      if (s === res.start) break
    }
    states.reverse()
    const pts = [{ x: res.sx, z: res.sz, f: res.h0 }]
    let run = 0
    for (let k = 1; k < states.length; k++) {
      const a = states[k - 1] >> 3, b = states[k] >> 3, f = states[k] & 7
      const last = pts[pts.length - 1]
      if (a === b) {
        pts.push({ x: last.x, z: last.z, f })
        run = 0
        continue
      }
      const p = { x: this.x(b), z: this.z(b), f }
      if (run === b - a) pts[pts.length - 1] = p
      else pts.push(p)
      run = b - a
    }
    return pts
  }

  // A lattice plan by cell, over the states it touched: for each cell the
  // least distance at any heading, `dist` (Float64, Infinity where none),
  // and that heading, `h` (Int8, ties to the lowest index; −1 where none);
  // `prev`, the cell that best state's path last left from (−1 at the
  // start's cell or none: a cell chain for the cell-indexed readers, not a
  // hull's path, which is hullPath's); `start`, the start's cell. The plan
  // readers that index by cell read this (a footprint plan's plan.cells:
  // core/actions/move.js), never the state arrays.
  cellBest(res) {
    const N = this.N
    const dist = new Float64Array(N).fill(Infinity), h = new Int8Array(N).fill(-1), prev = new Int32Array(N).fill(-1)
    for (const s of res.touched) {
      const c = s >> 3, d = res.dist[s]
      if (d < dist[c] || (d === dist[c] && (s & 7) < h[c])) {
        dist[c] = d
        h[c] = s & 7
      }
    }
    for (const s of res.touched) {
      const c = s >> 3
      if ((s & 7) !== h[c]) continue
      let p = res.prev[s]
      while (p !== -1 && p >> 3 === c) p = res.prev[p]
      prev[c] = p < 0 ? -1 : p >> 3
    }
    return { dist, h, prev, start: res.start < 0 ? -1 : res.start >> 3 }
  }
}

// (F9b) a lattice's masks are one per radius class (a list, each entry a
// mask or null), never one mask: indexed by class, one would read as
// nothing at all
function hullMasks(forbid) {
  if (forbid !== null && !Array.isArray(forbid)) throw new Error('a long hull\'s forbid is a list of masks, one per radius class (core/actions/move.js forbidMask per class), not one mask')
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

// (F9b) The lattice's heap: Heap's discipline exactly (the same sift up
// and down, so ties pop in the same order: §4.1 rule 25), over typed
// arrays the grid keeps between plans, popping without a pair per pop.
class StateHeap {
  constructor() {
    this.ids = new Int32Array(1024)
    this.keys = new Float64Array(1024)
    this.size = 0
  }
  topKey() {
    return this.keys[0]
  }
  push(id, key) {
    if (this.size === this.ids.length) {
      const ids = new Int32Array(this.size * 2), keys = new Float64Array(this.size * 2)
      ids.set(this.ids)
      keys.set(this.keys)
      this.ids = ids
      this.keys = keys
    }
    const { ids, keys } = this
    let i = this.size++
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
    const top = ids[0]
    const n = --this.size
    const id = ids[n], key = keys[n]
    if (n) {
      let i = 0
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
