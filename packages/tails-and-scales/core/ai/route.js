// (Breakthrough, DESIGN §4.2.12's AI) What the AI knows of a walled line:
// the route field, the face's grid and the wall's places, read by
// core/ai/score.js and core/ai/policy.js on a mission with roles whose
// board has a plan (the March Wall's, core/terrain/breakthrough.js), and
// never asked anywhere else: wallOf is null on every other board, and every
// term that reads this module is skipped there, so a battle on a mission
// without roles scores and draws exactly as it did.
//
// The route field. On the March Wall the attacker starts 23 to 29 tails of
// real walking from every objective, a wall in between, so a straight line
// (or levelDist's way up) points it at the wall's face and no further. A
// route field is the walking distance from every nav cell to an
// objective's hold area (the cells within HOLD of it at its level, where a
// unit's middle stands on it as score's objective term counts one), per
// movement class: the unit's move mode (walk, or wreck for a unit that
// ploughs soft scenery), its radius (rounded up to the class's step), and
// whether it climbs ladders and keeps to the ground (core/actions/move.js
// climbs and groundOnly, the plans' own mode setup). It is a Dijkstra run
// backwards from the hold area over the nav grid by the forward reach's
// own rules (core/nav.js reach and reachHeight): a step between neighbours
// whose floors are within STEP, onto a cell the class stands on (its
// clearance and, with height, the ledges' cliff field r − 0.06 or more, a
// ground-only class at a floor of STEP or under), costing a cell (√2 on the
// diagonal) doubled on difficult ground or, ploughing, through soft
// scenery; a climber also takes a ladder at its cost. One thing is not the
// nav's: a gate that stands is hard to everyone, but a wrecker rams it (a
// move a blow, core/actions/move.js smashAround), so a wrecker's field
// crosses a standing gate's cells, as soft, at RAM_STEP tails a blow still
// to strike: the gate is the wrecker's way through, at the price of the
// moves the ram takes.
//
// A field is derived data, as the nav's own fields are: worked out lazily
// the first time a unit of its class asks, cached on the nav grid
// (G.nav.routes, never hashed, never in a snapshot, never read by a rule),
// for the grid's epoch (a rebuild after a chunk falls, the gate or a breach
// block among them, opens or shuts a route) and, for a wrecker's, the
// gate's hit points (each blow makes the gate cheaper). The face's grid,
// every cell's faceDist, is worked out once a board (the plan never moves).
// No draw anywhere: the fields only read the terrain.
//
// AI code is rules code (DESIGN §4.1 rule 10): this is consensus code, with
// no clock, no Math.random and dmath's hypot.
import { STEP } from '../nav.js'
import { ENGAGE } from '../rules.js'
import { hypot } from '../dmath.js'
import { rolesOf, roleOf } from '../match.js'
import { faceDist } from '../terrain/breakthrough.js'
import { moveMode, climbs, groundOnly } from '../actions/move.js'

// A unit's middle within HOLD tails of an objective stands on it (score's
// objective term: its "d ≤ 2.6"), and its floor within HOLD_Y of the
// objective's holds it at its level (core/queries.js controlHigh's HIGH).
export const HOLD = 2.6, HOLD_Y = 1.2
// The tails a blow still to strike adds to a wrecker's way
// through a standing gate: about one move of the War-Cart, the Brute or the
// Howdah (8, 6 and 6 tails) less the walk the ram's move still makes.
// Chosen so, not tuned: with it the wreckers take the breach far more often
// than the gate (S3's As built, DESIGN §4.2.12)
export const RAM_STEP = 4
// a field's radius is rounded up to a multiple of this (a squad's disc
// shrinks as it loses models; each size would be a field of its own)
const R_STEP = 0.05

// The plan of the wall seat `side`'s AI plays round, or null: on a mission
// with roles whose board has a plan, the plan; on every other board null,
// and every term below with it.
export function wallOf(G) {
  return rolesOf(G.setup) && G.terrain.plan ? G.terrain.plan : null
}
// The role `u`'s seat plays ('attack' or 'defend'), on a wall's board.
export const sideRole = (G, u) => roleOf(G, u.side)

// The gate's chunk, while it stands (null once it is down)
export function gateOf(G, plan) {
  const c = G.terrain.byId(plan.gate.id)
  return c && c.alive ? c : null
}
// The blows a gate still takes: its hit points over the ram's blow, up
export const blowsLeft = (c) => Math.ceil(c.hp / Math.min(99, c.ram))

// Whether a wrecker `u` standing at (x, z) at the end of a walk rams gate
// `c` (smashAround's own test: its radius, or a long hull's body disc's, and
// 0.8 of the gate's half-width; the walk's last sample is its end)
export function ramsAt(u, c, x, z) {
  const s = c.nav || c.shape
  return hypot(s.x - x, s.z - z) < (u.t.fp ? u.t.base : u.r) + Math.max(s.hx, s.hz) * 0.8
}

// The movement class of `u` for its route field: null for a flier (its
// move is a circle over everything: the straight line is its route)
export function classOf(u) {
  const mode = moveMode(u)
  if (mode === 'fly') return null
  // ((F9b) a long hull by its body disc, the disc its plans' clearance
  // keeps to; the lattice's room to turn is not the field's)
  const r = Math.ceil((u.t.fp ? u.t.base : u.r) / R_STEP - 1e-9) * R_STEP
  const wreck = mode === 'wreck', ladder = climbs(u), ground = groundOnly(u)
  return { key: `${wreck ? 'wreck' : 'walk'}:${r.toFixed(2)}:${ladder ? 1 : 0}:${ground ? 1 : 0}`, r, wreck, ladder, ground }
}

// The route fields of `u` on the wall's board (`plan`), one Float64Array a
// G.objectives entry (in its order, by `i`): the walking distance from each
// nav cell to that objective's hold area, Infinity where the class has no
// way; null for a flier.
export function routeFields(G, u, plan) {
  const cl = classOf(u)
  if (!cl) return null
  const nav = G.nav
  const gate = cl.wreck ? gateOf(G, plan) : null
  // (a climber's ladders whose top an enemy holds: shut to it, held)
  const shut = cl.ladder ? heldLadders(G, u, plan, cl) : 0
  const key = `${cl.key}${gate ? `:${gate.hp}` : ''}${shut ? `:L${shut}` : ''}`
  let memo = nav.routes
  if (!memo || memo.epoch !== nav.epoch) memo = nav.routes = { epoch: nav.epoch, fields: new Map(), ram: null, face: memo?.face ?? null }
  let f = memo.fields.get(key)
  if (!f) {
    const ram = gate ? ramClear(G, gate, memo) : null
    const gr = grounds(G, cl, ram), penalty = gate ? blowsLeft(gate) * RAM_STEP : 0
    const tops = new Set()
    plan.ladders.forEach((l, k) => {
      if (shut & (1 << k)) tops.add(nav.index(l.top.x, l.top.z))
    })
    f = G.objectives.map((o) => field(G, o, cl, gr, penalty, tops))
    memo.fields.set(key, f)
  }
  return f
}

// The siege ladders an enemy of `u` holds the head of, as a bit mask (bit
// k for plan.ladders[k]): an enemy standing (not a rider) whose base comes
// within ENGAGE (and the move's 0.05 pad, core/actions/move.js forbidMask)
// of a base of class `cl` on the ladder's top cell, at its level (HOLD_Y):
// no climber may step onto it, so its route field takes that ladder as
// shut until the head is cleared (a charge, a shot) and walks it to
// another way. (Measured, 400 battles: costing a held ladder 6 tails more
// instead of shutting it, the attackers stood still at the face 276 times
// against 49 and won 19 battles against 32, though they scored by round 4
// in 30% against 24%.) The fields are kept per mask, so a ladder held and let go is
// worked out once an epoch each way.
function heldLadders(G, u, plan, cl) {
  const nav = G.nav
  let mask = 0
  plan.ladders.forEach((l, k) => {
    const y = nav.hasHeight ? nav.floor[nav.index(l.top.x, l.top.z)] : 0
    for (const e of G.units) {
      if (e.side === u.side || e.alive <= 0 || e.aboard) continue
      const ey = nav.hasHeight ? nav.floor[Math.max(0, nav.index(e.pos.x, e.pos.z))] : 0
      if (Math.abs(ey - y) <= HOLD_Y && hypot(e.pos.x - l.top.x, e.pos.z - l.top.z) < e.r + cl.r + ENGAGE + 0.05) {
        mask |= 1 << k
        break
      }
    }
  })
  return mask
}

// The route distance from (x, z) to objective `o` by fields `f`: the field
// at the cell, or for a flier (f null) the straight line less HOLD (its
// hold area's edge), never under 0
export function routeDist(G, f, o, x, z) {
  if (!f) return Math.max(0, hypot(o.x - x, o.z - z) - HOLD)
  const i = G.nav.index(x, z)
  return i < 0 ? Infinity : f[o.i][i]
}

// The face's grid: every cell's faceDist (behind the face above 0), worked
// out once a board
export function faceGrid(G, plan) {
  const nav = G.nav
  let memo = nav.routes
  if (!memo || memo.epoch !== nav.epoch) memo = nav.routes = { epoch: nav.epoch, fields: new Map(), ram: null, face: memo?.face ?? null }
  if (memo.face && memo.face.plan === plan) return memo.face.d
  const d = new Float32Array(nav.N)
  for (let i = 0; i < nav.N; i++) d[i] = faceDist(plan, nav.x(i), nav.z(i))
  memo.face = { plan, d }
  return d
}
// faceDist at (x, z) by the grid (the cell's), -Infinity off the table
export function faceAt(G, plan, x, z) {
  const i = G.nav.index(x, z)
  return i < 0 ? -Infinity : faceGrid(G, plan)[i]
}

// A standing gate's cells, and the clearance a wrecker has with the gate
// counted soft instead of hard: { gate: Uint8Array (the gate's raster),
// clear: Float32Array (the hard raster less the gate's, as a field) },
// once an epoch
function ramClear(G, gate, memo) {
  if (memo.ram && memo.ram.id === gate.id) return memo.ram
  const nav = G.nav, N = nav.N
  const mask = new Uint8Array(N), hard = new Uint8Array(N), clear = new Float32Array(N)
  const s = gate.nav || gate.shape
  if (nav.hasHeight) nav.rasterAt(s, 0.1, mask, gate.base ?? 0)
  else nav.raster(s, 0.1, mask)
  for (let i = 0; i < N; i++) hard[i] = nav.hard[i] && !mask[i] ? 1 : 0
  nav.field(hard, null, clear)
  memo.ram = { id: gate.id, mask, clear }
  return memo.ram
}

// What every field of class `cl` reads of the grid, worked out once for
// its objectives: `stand`, the cells it stands on (its clearance and, with
// height, the ledges' cliff field r − 0.06 or more, a ground-only class at a
// floor of STEP or under: reach's own tests), and `mul`, what a step onto
// each costs a cell (1, or 2 on difficult ground or, ploughing, where the
// soft scenery is in the way); ramming (`ram`, while the gate stands), its
// clearance has the gate soft, and `gated` marks the cells only the gate
// keeps it off
function grounds(G, cl, ram) {
  const nav = G.nav, N = nav.N, high = nav.hasHeight
  const need = cl.r - 0.06
  const clear = cl.wreck ? (ram ? ram.clear : nav.clearHard) : nav.clearAll
  const stand = new Uint8Array(N), mul = new Uint8Array(N), gated = ram ? new Uint8Array(N) : null
  for (let i = 0; i < N; i++) {
    stand[i] = clear[i] >= need && (!high || (nav.cliff[i] >= need && (!cl.ground || nav.floor[i] <= STEP))) ? 1 : 0
    mul[i] = nav.diff[i] || (cl.wreck && nav.clearAll[i] < need) ? 2 : 1
    if (gated) gated[i] = nav.clearHard[i] < need ? 1 : 0
  }
  return { stand, mul, gated }
}

// One field: objective `o`'s hold area out over the grid, backwards, for
// class `cl`, on its grounds `gr` (`penalty`, ramming: the tails entering
// the gate's cells from outside them costs, its blows still to strike)
function field(G, o, cl, gr, penalty, tops) {
  const nav = G.nav, N = nav.N, { nx, nz, cell } = nav
  const high = nav.hasHeight
  const floor = high ? nav.floor : null
  const { stand, mul, gated } = gr
  const dist = new Float64Array(N).fill(Infinity)
  const heap = new CellHeap(N)
  const oy = high ? floor[Math.max(0, nav.index(o.x, o.z))] : 0
  const iz0 = Math.max(0, Math.floor((o.z - HOLD + nav.H / 2) / cell)), iz1 = Math.min(nz - 1, Math.floor((o.z + HOLD + nav.H / 2) / cell))
  const ix0 = Math.max(0, Math.floor((o.x - HOLD + nav.W / 2) / cell)), ix1 = Math.min(nx - 1, Math.floor((o.x + HOLD + nav.W / 2) / cell))
  for (let iz = iz0; iz <= iz1; iz++) for (let ix = ix0; ix <= ix1; ix++) {
    const i = iz * nx + ix
    if (hypot(nav.x(i) - o.x, nav.z(i) - o.z) > HOLD || !stand[i]) continue
    if (high && Math.abs(floor[i] - oy) > HOLD_Y) continue
    dist[i] = 0
    heap.push(i, 0)
  }
  const straight = cell, diagonal = Math.SQRT2 * cell
  const ladders = cl.ladder && high
  while (heap.size) {
    const j = heap.pop(), d = heap.lastKey
    if (d > dist[j]) continue
    // (the forward step i → j costs j's ground; ramming, entering the
    // gate's cells from outside them costs the blows)
    const m = mul[j], gj = gated ? gated[j] : 0
    const jx = j % nx, jz = (j / nx) | 0, fj = high ? floor[j] : 0
    for (let oz = -1; oz <= 1; oz++) {
      const iz = jz + oz
      if (iz < 0 || iz >= nz) continue
      for (let ox = -1; ox <= 1; ox++) {
        const ix = jx + ox
        if ((!ox && !oz) || ix < 0 || ix >= nx) continue
        const i = iz * nx + ix
        if (!stand[i] || (high && Math.abs(floor[i] - fj) > STEP)) continue
        let nd = d + (ox && oz ? diagonal : straight) * m
        if (gj && !gated[i]) nd += penalty
        if (nd < dist[i]) {
          dist[i] = nd
          heap.push(i, nd)
        }
      }
    }
    // a ladder, either way at its cost (the nav joins both ends alike)
    // (a held head shuts its ladder, either way)
    if (!ladders || nav.link[j] < 0 || tops.has(j)) continue
    const k = nav.link[j]
    if (stand[k] && !tops.has(k) && d + nav.linkCost[j] < dist[k]) {
      dist[k] = d + nav.linkCost[j]
      heap.push(k, dist[k])
    }
    const more = nav.linkMore?.get(j)
    if (more) {
      for (const [i, cost] of more) {
        if (stand[i] && !tops.has(i) && d + cost < dist[i]) {
          dist[i] = d + cost
          heap.push(i, dist[i])
        }
      }
    }
  }
  return dist
}

// A binary heap of cells keyed by distance (nav.js's discipline: the same
// sift, so ties pop alike on every engine), its last popped key kept
class CellHeap {
  constructor(n) {
    this.ids = new Int32Array(Math.max(16, n))
    this.keys = new Float64Array(Math.max(16, n))
    this.size = 0
    this.lastKey = 0
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
    this.lastKey = keys[0]
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
