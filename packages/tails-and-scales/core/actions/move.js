// Movement (DESIGN §1.1): where a unit may go this phase and how it gets
// there; the movement phase's actions (a move, which is also an advance's
// move and a fall back, and the advance roll itself); and the walk
// (resolveWalk), which both a move and a charge take.
//
// Synchronous, like damage.js: what the old code waited on is an event in
// the match's out at the same place (DESIGN §2.3, §4.1 rule 3): the advance
// roll's tray and dice (`tray.open`, `dice`), and the walk (`unit.move`,
// which the view plays back along its path). No logic moves across an
// emit, and building an event draws nothing and changes nothing.
//
// Neither action ends itself (its state line in the trace, the flags, the
// labels), and neither ever calls finishAction: the command's handler
// (core/commands.js), the only path to them, calls core/engine.js's
// finishAction after the action (DESIGN §2.2's (R6a) note). The advance
// roll writes no `act` line at all (§4.1 rule 8).
import { ENGAGE, roll } from '../rules.js'
import { hypot, sin, cos, atan2 } from '../dmath.js'
import { lerp } from '../util.js'
import { emit, log } from '../journal.js'
import { refreshNav } from '../match.js'
import { moveUnitTo } from '../units.js'
import { pathLength, STEP } from '../nav.js'
import { kegsIn } from '../terrain/terrain.js'
import { settle } from './settle.js'
import { alive, enemiesOf, isEngaged, ownersOf, statusOf, floorAt, groundY, HIGH } from '../queries.js'
import { discsOf } from '../footprint.js'

export function moveMode(u) {
  return u.t.move
}

// (F7a) Whether `u` climbs ladders (data/schema.js's derived `climb`:
// infantry, not big units, fliers or (F9a) vehicles): the plans' mode setup
// (movePlan, chargePlan) is the one reader, so the nav's reach takes it
// with the mode. Read only with height.
export function climbs(u) {
  return u.t.climb
}

// (F9a, DESIGN §4.2.5) Whether `u` keeps to the ground: a ground vehicle
// (data/schema.js `vehicle`) never stands on a floor above STEP, so it takes
// no stair onto a deck (P-height's rule). The plans' mode setup, with
// climbs: its one rules reader, which the forbid mask (with height, the
// raised cells forbidden to it: forbidHigh), the deployment (core/deploy.js
// fits) and a pile-in ask. Read only with height. (F5a, DESIGN §4.2.12) So
// does a burrower (its move the burrow mode): a deck's footprint is hard
// to it, so the deployment never puts it on the works' decks (where its
// plans, which never step above STEP, would leave it stranded), a pile-in
// never lifts it onto one, and its masks forbid the raised cells its
// reach already refuses: a branch only a burrower reaches (§4.1 rule 30).
export function groundOnly(u) {
  return u.t.vehicle || u.t.move === 'burrow'
}

// Cells a unit may not enter: within 1" of an enemy (or just their bases when
// falling back / charging). `onlyBodies` lists whose bases only count.
//
// (F7a) With height an enemy's bubble (and base) forbids only the cells
// within HIGH of the floor it stands on, and its disc carries that floor
// (`y`) for nav.walkable's shortcuts: a unit walks the foot of a wall whose
// top an enemy holds.
//
// (F9b, DESIGN §4.2.5) `r`, the radius the mask is for: the unit's own by
// default, so every round call is the one it always was; a long hull's
// plans make one mask per radius class of its footprint (masksOf), its
// disc of that class tested against it. An enemy with a footprint
// forbids a bubble round each of its discs (its own branch: forbidDiscs),
// and its exact discs join `f.discs` for nav.walkable.
export function forbidMask(G, u, pad, onlyBodies = [], r = u.r) {
  if (G.nav.hasHeight) return forbidHigh(G, u, pad, onlyBodies, r)
  // (the grid's own size, S0: the board the match is played on)
  const nav = G.nav, { W, H } = nav
  const f = new Uint8Array(nav.N)
  f.discs = [] // the exact shapes, for nav.walkable's straight-line shortcuts
  for (const e of enemiesOf(G, u)) {
    if (e.t.fp) {
      forbidDiscs(nav, f, e, r + (onlyBodies.includes(e) ? 0.02 : pad), null)
      continue
    }
    const R = e.r + r + (onlyBodies.includes(e) ? 0.02 : pad)
    f.discs.push({ x: e.pos.x, z: e.pos.z, R: R - 0.02 })
    const i0x = Math.max(0, Math.floor((e.pos.x - R + W / 2) / nav.cell)), i1x = Math.min(nav.nx - 1, Math.floor((e.pos.x + R + W / 2) / nav.cell))
    const i0z = Math.max(0, Math.floor((e.pos.z - R + H / 2) / nav.cell)), i1z = Math.min(nav.nz - 1, Math.floor((e.pos.z + R + H / 2) / nav.cell))
    for (let iz = i0z; iz <= i1z; iz++) for (let ix = i0x; ix <= i1x; ix++) {
      const i = iz * nav.nx + ix
      if (hypot(nav.x(i) - e.pos.x, nav.z(i) - e.pos.z) < R) f[i] = 1
    }
  }
  return f
}
function forbidHigh(G, u, pad, onlyBodies, r) {
  const nav = G.nav, { W, H } = nav
  const f = new Uint8Array(nav.N)
  f.discs = []
  // (F9a) a ground vehicle never enters a cell whose floor is above STEP:
  // the reach, the path's shortcuts (nav.walkable reads the mask) and the
  // end (standable) all keep it on the ground
  if (groundOnly(u)) for (let i = 0; i < nav.N; i++) if (nav.floor[i] > STEP) f[i] = 1
  for (const e of enemiesOf(G, u)) {
    if (e.t.fp) {
      forbidDiscs(nav, f, e, r + (onlyBodies.includes(e) ? 0.02 : pad), groundY(G, e))
      continue
    }
    const R = e.r + r + (onlyBodies.includes(e) ? 0.02 : pad), y = groundY(G, e)
    f.discs.push({ x: e.pos.x, z: e.pos.z, R: R - 0.02, y })
    const i0x = Math.max(0, Math.floor((e.pos.x - R + W / 2) / nav.cell)), i1x = Math.min(nav.nx - 1, Math.floor((e.pos.x + R + W / 2) / nav.cell))
    const i0z = Math.max(0, Math.floor((e.pos.z - R + H / 2) / nav.cell)), i1z = Math.min(nav.nz - 1, Math.floor((e.pos.z + R + H / 2) / nav.cell))
    for (let iz = i0z; iz <= i1z; iz++) for (let ix = i0x; ix <= i1x; ix++) {
      const i = iz * nav.nx + ix
      if (hypot(nav.x(i) - e.pos.x, nav.z(i) - e.pos.z) < R && Math.abs(nav.floor[i] - y) <= HIGH) f[i] = 1
    }
  }
  return f
}
// (F9b) footprint enemy e's bubbles on mask f: round each of its discs (at
// its facing), of the disc's r plus `add` (the mover's r and the pad), and
// each disc's exact shape onto f.discs; with height (`y`, e's floor) only
// the cells within HIGH of it, as a round enemy's
function forbidDiscs(nav, f, e, add, y) {
  const { W, H } = nav
  for (const d of discsOf(e)) {
    const R = d.r + add
    f.discs.push(y === null ? { x: d.x, z: d.z, R: R - 0.02 } : { x: d.x, z: d.z, R: R - 0.02, y })
    const i0x = Math.max(0, Math.floor((d.x - R + W / 2) / nav.cell)), i1x = Math.min(nav.nx - 1, Math.floor((d.x + R + W / 2) / nav.cell))
    const i0z = Math.max(0, Math.floor((d.z - R + H / 2) / nav.cell)), i1z = Math.min(nav.nz - 1, Math.floor((d.z + R + H / 2) / nav.cell))
    for (let iz = i0z; iz <= i1z; iz++) for (let ix = i0x; ix <= i1x; ix++) {
      const i = iz * nav.nx + ix
      if (hypot(nav.x(i) - d.x, nav.z(i) - d.z) < R && (y === null || Math.abs(nav.floor[i] - y) <= HIGH)) f[i] = 1
    }
  }
}
// (F9b) A long hull's masks, one per radius class of its footprint
// (fp.radii, at most 3), in class order: what hullReach and the hull's
// tests take (core/nav.js), each disc against its class's
export const masksOf = (G, u, pad, onlyBodies = []) => u.t.fp.radii.map((r) => forbidMask(G, u, pad, onlyBodies, r))

// Everything the movement phase needs for one unit: where it can go and how.
//
// (S3, DESIGN §4.2.2) Inside one apply (core/index.js), the last plan made
// is kept in G.nav.memo, so the AI's plan for a move and the move's own (its
// legality, then the handler's) are made once: it is read back only for the
// same unit, where it stands, the same extra inches, the same nav grid (its
// epoch, after refreshNav) and every live unit where it stands, all that a
// plan reads (planKey). One plan, not every one: those asks come one after
// another, and an AI battle, which createMatch plays as one apply, would
// otherwise keep every plan of the battle. Outside an apply there is no
// memo (a preview, the HUD, a legality check of the page's): every plan is
// fresh, so nothing the page asks can feed the fold.
//
// (F9b, DESIGN §4.2.5) A long hull (t.fp) plans on its lattice instead
// (hullPlan): nav.hullReach from where it stands and the way it faces,
// over (cell, heading) states, its masks one per radius class. Its plan
// holds `fp`, the footprint, and `cells`, the lattice by cell (nav.cellBest:
// `dist`, the least at any heading, `h` that heading, `prev` a cell
// chain), which every reader that indexes a plan by cell reads in place of
// `res` (`res.dist` is by state there, N·8 long).
export function movePlan(G, u, extra = 0) {
  refreshNav(G)
  const memo = G.nav.memo, key = memo && planKey(G, u, extra)
  if (memo && memo.sig === key) return memo.plan
  if (u.t.fp) return hullPlan(G, u, extra, memo, key)
  const fallback = isEngaged(G, u)
  const max = u.t.M + extra
  const mode = moveMode(u)
  const enemies = enemiesOf(G, u)
  // falling back may walk through the 1" bubble but not through bases; (S3)
  // any other move's mask is the end's, made once
  const endForbid = forbidMask(G, u, ENGAGE + 0.05)
  const forbid = fallback ? forbidMask(G, u, ENGAGE + 0.05, enemies) : endForbid
  const res = G.nav.reach(u.pos.x, u.pos.z, { r: u.r, max, mode: mode === 'fly' ? 'fly' : mode, forbid: mode === 'fly' ? null : forbid, climb: climbs(u) })
  const plan = { u, res, max, mode, forbid, endForbid, fallback }
  if (memo) {
    memo.sig = key
    memo.plan = plan
  }
  return plan
}
// (F9b) movePlan for a long hull: the same plan, on the lattice, each mask
// a list by radius class (a fall back's through the bubbles, never the
// bases), and the plan's `fp` and `cells`
function hullPlan(G, u, extra, memo, key) {
  const fallback = isEngaged(G, u)
  const max = u.t.M + extra
  const mode = moveMode(u)
  const endForbid = masksOf(G, u, ENGAGE + 0.05)
  const forbid = fallback ? masksOf(G, u, ENGAGE + 0.05, enemiesOf(G, u)) : endForbid
  const res = G.nav.hullReach(u.pos.x, u.pos.z, u.facing, u.t.fp, { max, mode: latticeMode(mode), forbid })
  const plan = { u, res, max, mode, forbid, endForbid, fallback, fp: u.t.fp, cells: G.nav.cellBest(res) }
  if (memo) {
    memo.sig = key
    memo.plan = plan
  }
  return plan
}
// (F9b) the lattice's mode for a hull's: a wrecker's measures clearHard
// (it pivots through soft scenery and smashes it), any other walks (a
// flier is round, and never on the lattice)
export const latticeMode = (mode) => (mode === 'wreck' ? 'wreck' : 'walk')

// What a plan reads, as a memo's key: the unit, where it stands, its base,
// the extra inches, the nav grid's epoch, and every live unit's place and
// base (numbers exactly, -0 apart from 0); (F9a) and which hull a rider
// rides (aboard), where one does: a rider stands in nobody's way, so the
// plan reads it too (a key without riders is the key it always was).
// (F9b) And a footprint unit's facing (the plan's own unit's, its start,
// and every other's, its discs): only a footprint unit holds one, so a key
// with no long hull is the key it always was.
const num = (n) => (Object.is(n, -0) ? '-0' : String(n))
const faced = (u) => (u.facing !== undefined ? ` f${u.facing}` : '')
function planKey(G, u, extra) {
  let k = `${u.id}@${num(u.pos.x)},${num(u.pos.z)} r${num(u.r)}${faced(u)} +${num(extra)} e${G.nav.epoch}`
  for (const o of G.units) if (alive(o)) k += `|${o.id}@${num(o.pos.x)},${num(o.pos.z)} r${num(o.r)}${faced(o)}${o.aboard ? ` a${o.aboard}` : ''}`
  return k
}

// May the plan's unit end its move on cell i? (F10a) `at`, a Map of id →
// { x, z }, stands units somewhere else than G has them, as a group's
// planner (present/orders.js) foresees them: the members it planned
// before this one where they will have gone. Null: today's question. (F9a)
// A rider is off the table: it neither ends a move here nor stands in
// anyone's way (a hull's own riders stand at its centre).
//
// (F9b, DESIGN §4.2.5) `f`, a heading, for a long hull's plan: whether it
// may end on the state (i, f); null, at any heading (endFacing finds the
// one). A round mover beside a footprint unit keeps the spacing to its
// nearest disc (clearAt), and `at`'s entries carry a planned hull's
// heading too ({ x, z, f }: present/orders.js), its facing where not.
export function validEnd(G, plan, i, at = null, f = null) {
  if (plan.fp) return f === null || f === undefined ? endFacing(G, plan, i, at) >= 0 : hullEnd(G, plan, i, f, at)
  const { u, res, mode, endForbid } = plan
  const nav = G.nav
  if (i < 0 || !isFinite(res.dist[i])) return false
  if (!nav.standable(i, u.r, mode === 'wreck' ? 'wreck' : 'walk', endForbid)) return false
  const x = nav.x(i), z = nav.z(i)
  for (const o of G.units) {
    if (o === u || !alive(o) || o.aboard) continue
    const p = at?.get(o.id) ?? o.pos
    if (o.t.fp) {
      if (clearAt(o, p, at?.get(o.id)?.f ?? o.facing, x, z, u.r) < 0.08) return false
    } else if (hypot(p.x - x, p.z - z) < o.r + u.r + 0.08) return false
  }
  return true
}

// (F9b) The least edge gap from the disc (x, z, r) to footprint unit o's
// discs, o standing at p facing h (where a group's planner foresees it, or
// where it stands: then exactly core/footprint.js's clearOf)
function clearAt(o, p, h, x, z, r) {
  const fp = o.t.fp, row = fp.H[h]
  let g = Infinity
  for (let q = 0; q < row.length; q++) {
    const d = row[q]
    const v = hypot(p.x + d.ix * fp.cell - x, p.z + d.iz * fp.cell - z) - d.r - r
    if (v < g) g = v
  }
  return g
}

// (F9b) May a long hull's plan end on state (i, h)? The state reached
// within the plan's inches (every reached state is), standing outside the
// end's masks (a fall back's plan walks through the bubbles it may not end
// in), and every disc clear of every other unit's discs (a round unit's
// one) by 0.08", as a round mover's spacing.
function hullEnd(G, plan, i, h, at) {
  const { u, res, fp, mode, endForbid } = plan
  const nav = G.nav
  if (!(Number.isInteger(i) && i >= 0 && i < nav.N && Number.isInteger(h) && h >= 0 && h < 8)) return false
  if (!(res.dist[i * 8 + h] <= plan.max)) return false
  if (!nav.hullStands(i, h, fp, latticeMode(mode), endForbid)) return false
  const x = nav.x(i), z = nav.z(i), row = fp.H[h]
  for (const o of G.units) {
    if (o === u || !alive(o) || o.aboard) continue
    const p = at?.get(o.id) ?? o.pos
    for (let q = 0; q < row.length; q++) {
      const d = row[q], dx = x + d.ix * fp.cell, dz = z + d.iz * fp.cell
      if ((o.t.fp ? clearAt(o, p, at?.get(o.id)?.f ?? o.facing, dx, dz, d.r) : hypot(p.x - dx, p.z - dz) - o.r - d.r) < 0.08) return false
    }
  }
  return true
}

// (F9b, DESIGN §4.2.5's default heading) The heading a long hull's move to
// cell i takes when the command names none: of the valid end states at i,
// the one the plan reaches shortest, ties to the lowest index (§4.1 rule
// 25: no draw); −1 when none is valid. The AI's and the macros' moves send
// no heading, so this is theirs too.
export function endFacing(G, plan, i, at = null) {
  const nav = G.nav
  if (!(Number.isInteger(i) && i >= 0 && i < nav.N) || !(plan.cells.dist[i] < Infinity)) return -1
  let best = -1, bd = Infinity
  for (let h = 0; h < 8; h++) {
    const d = plan.res.dist[i * 8 + h]
    if (!(d < bd)) continue
    if (!hullEnd(G, plan, i, h, at)) continue
    bd = d
    best = h
  }
  return best
}

// The valid end cell nearest (x, z), within `within` inches; -1 for none.
export function nearestValid(G, plan, x, z, within = 2.4) {
  const nav = G.nav
  let best = -1, bd = within
  const c = nav.index(x, z)
  if (c < 0) return -1
  const R = Math.ceil(within / nav.cell)
  const cx = c % nav.nx, cz = (c / nav.nx) | 0
  for (let dz = -R; dz <= R; dz++) for (let dx = -R; dx <= R; dx++) {
    const ix = cx + dx, iz = cz + dz
    if (ix < 0 || iz < 0 || ix >= nav.nx || iz >= nav.nz) continue
    const i = iz * nav.nx + ix
    const d = hypot(nav.x(i) - x, nav.z(i) - z)
    if (d < bd && validEnd(G, plan, i)) {
      bd = d
      best = i
    }
  }
  return best
}

// ── The movement phase's actions ────────────────────────────────────────────
// `u` moves to `cell`, one validEnd accepts of `plan` (movePlan's, made with
// the advance roll when the unit advanced): by the shortest route there,
// smashing what a wrecker passes, and the nav grid follows. An engaged unit's
// plan is a fall back. The log line gives the route's length before the
// walk, as it always has; a wrecker setting off on a move of more than 0.1"
// stomps (`stomp`: the old boom, the view's), which its charge never did.
// With no `plan`, it is made afresh from the unit's flags, as the `move`
// command (core/commands.js), which carries only the unit and the cell,
// makes it: the only path a move takes, so parity holds each corpus move
// made on the remade plan to the old move, made on the plan the seat or the
// AI picked from (a one-off probe at R5c found the plans deep-equal too).
//
// (F19a) Returns the powder kegs a wrecker's walk smashed, in the order it
// smashed them, for the move's handler to set off (core/commands.js: a
// keg's going off is shoot.js's kegsGoOff, which this module can't import
// without a cycle, damage.js importing this one); [] for every other walk.
//
// (F9b) A long hull moves to the state (cell, f): `f` the command's heading,
// or the default (endFacing); along the lattice's own path (nav.hullPath:
// straight runs and pivots), its log line the plan's cost there, turning
// and backing included (hullWalk).
export function doMove(G, u, cell, plan = movePlan(G, u, u.flags.advanced ? u.flags.advRoll : 0), f = null) {
  if (plan.fp) return hullMove(G, u, cell, plan, f ?? endFacing(G, plan, cell))
  const pts = G.nav.path(plan.res, cell, u.r, plan.mode === 'fly' ? null : plan.forbid)
  u.flags.moved = true
  if (plan.fallback) u.flags.fellBack = true
  // (F7a: with height a climb counts what it costs, not the ground it spans)
  const L = G.nav.hasHeight ? walkCost(pts) : pathLength(pts)
  log(G, u.side, `<b>${u.t.short}</b> ${plan.fallback ? 'fall back' : u.flags.advanced ? 'advance' : 'move'} ${L.toFixed(1)}".`)
  const kegs = resolveWalk(G, u, pts, { fly: plan.mode === 'fly', stomp: u.t.wrecker && L > 0.1 })
  // (the nav follows the walk, at today's site: DESIGN §4.1 rule 9)
  refreshNav(G)
  // ((F7c, §4.1 rule 17) and the units on a timber deck whose posts the
  // walk smashed fall, before a keg it smashed goes off)
  settle(G)
  return kegs
}
// (F9b) doMove for a long hull, to state (cell, h): the same steps, its
// path the lattice's, its length the plan's cost
function hullMove(G, u, cell, plan, h) {
  const pts = G.nav.hullPath(plan.res, cell, h)
  const L = plan.res.dist[cell * 8 + h]
  u.flags.moved = true
  if (plan.fallback) u.flags.fellBack = true
  log(G, u.side, `<b>${u.t.short}</b> ${plan.fallback ? 'fall back' : u.flags.advanced ? 'advance' : 'move'} ${L.toFixed(1)}".`)
  const kegs = hullWalk(G, u, pts, { stomp: u.t.wrecker && L > 0.1 })
  refreshNav(G)
  settle(G)
  return kegs
}

// `u` advances: a D6 more inches for its move this phase (its move is a
// doMove on movePlan(G, u, roll)), at the price the rules set (no shooting
// unless assault, no charge unless it may charge after advancing). Returns
// the roll. No `act` line: the move that follows writes it (§4.1 rule 8).
export function doAdvance(G, u) {
  emit(G, 'tray.open', { title: `${u.t.short} — Advance` })
  const r = roll(G, 1)
  emit(G, 'dice', { label: 'Advance D6', dice: r, need: 0, sum: true, note: `+${r[0]}"` })
  u.flags.advanced = true
  u.flags.advRoll = r[0]
  log(G, u.side, `<b>${u.t.short}</b> advance: +${r[0]}".`)
  return r[0]
}

// An advanced unit the AI leaves where it is: its move is spent (the AI's
// own, never a seat's command: DESIGN §2.2). No event and no line, as ever.
export function hold(G, u) {
  u.flags.moved = true
}

// (F7a) A path's length, each climb (a point marked `climb`: nav.path) at its
// link's cost, the rest as pathLength measures it.
export function walkCost(pts) {
  let L = 0
  for (let i = 1; i < pts.length; i++) L += pts[i].climb ? pts[i].cost : hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z)
  return L
}

// ── The walk ────────────────────────────────────────────────────────────────
// A unit goes along `pts` (DESIGN §2.3's resolveWalk, §4.1 rule 7), all at
// once: a wrecker smashes what it passes at fixed 0.25" samples along the
// path plus its end point, in order, so what breaks (and which way trees
// fall) never depends on the frame rate; then the unit stands where the
// walk's last frame always put it (the k=1 lerp along the path, not
// pts.at(-1)). A path under 0.05" moves nothing and smashes nothing.
//
//   unit.move { u, path: [{ x, z }], L, speed, fly, stomp, smashes: [{ s, ev }], to: { x, z } }
//   (F7a, with height) path: [{ x, y, z, climb? }], to: { x, y, z }: each
//   vertex's floor, and `climb` on a ladder's far end (the segment into it
//   is the climb); classic's events don't grow
//   (F9a) a hull's riders go with it, to `to`: the mirror carries them
//   (present/mirror.js), so the event doesn't grow
//
// The view walks the unit along `path` (L long, at `speed` inches a second,
// flying or not, stomping off as it sets out when `stomp`: each of them is
// how it looks, which the caller says) and breaks what each sample smashed
// (`ev`, its terrain events) as the walker comes `s` along; `to` is where
// the unit stands. Then `objectives` and `status`: the flags and labels as
// the walk left them (the old walk turned a flag the frame it crossed; this
// turns it as the walk ends).
//
// (F19a) Returns the powder kegs the walk smashed, in the order it smashed
// them (sample by sample, each sample's in chunk order): they go off once
// the walk has ended, the walker standing where it stopped, by its
// caller's hand (doMove's handler, finishCharge; DESIGN §4.1 rule 28). []
// when it smashed none, as every walk but a wrecker's past a keg does.
export function resolveWalk(G, u, pts, { speed = 7, fly = false, stomp = false } = {}) {
  const L = pathLength(pts)
  if (L < 0.05) return []
  const seg = []
  let acc = 0
  for (let i = 1; i < pts.length; i++) {
    const l = hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z)
    seg.push({ a: pts[i - 1], b: pts[i], s: acc, l })
    acc += l
  }
  const smashes = [], broke = []
  if (u.t.wrecker) {
    const samples = []
    for (const q of seg) for (let t = 0; t < q.l; t += 0.25) samples.push({ s: q.s + t, x: q.a.x + ((q.b.x - q.a.x) * t) / q.l, z: q.a.z + ((q.b.z - q.a.z) * t) / q.l, dir: atan2(q.b.x - q.a.x, q.b.z - q.a.z) })
    // (a path of 0.05" or more has a last segment)
    const last = seg[seg.length - 1]
    samples.push({ s: L, x: pts[pts.length - 1].x, z: pts[pts.length - 1].z, dir: atan2(last.b.x - last.a.x, last.b.z - last.a.z) })
    // (a quiet run, G.out null, keeps no events: the smashing is the same;
    // a wrecker is big, so never a climber, and no sample lies on a climb)
    for (const p of samples) {
      const ev = G.out ? [] : null
      if (smashAround(G, u, p, ev, broke) && ev) smashes.push({ s: p.s, ev })
    }
  }
  // the walk's last frame: k = 1, so the distance along is L itself (F9a:
  // and a hull's riders with it, moveUnitTo)
  const end = seg.find((q) => L <= q.s + q.l) || seg[seg.length - 1]
  const f = end.l > 0 ? (L - end.s) / end.l : 1
  moveUnitTo(G, u, lerp(end.a.x, end.b.x, f), lerp(end.a.z, end.b.z, f))
  // the walk, then the flags (who holds what) and the labels (who is in
  // combat) as it left them
  if (G.out) {
    // (one emit, its path and its end with their floors only with height)
    const high = G.nav.hasHeight
    const path = high ? pts.map((p) => (p.climb ? { x: p.x, y: floorAt(G, p.x, p.z), z: p.z, climb: true } : { x: p.x, y: floorAt(G, p.x, p.z), z: p.z })) : pts.map((p) => ({ x: p.x, z: p.z }))
    emit(G, 'unit.move', { u: u.id, path, L, speed, fly, stomp, smashes, to: high ? { x: u.pos.x, y: groundY(G, u), z: u.pos.z } : { x: u.pos.x, z: u.pos.z } })
    emit(G, 'objectives', { owners: ownersOf(G) })
    emit(G, 'status', statusOf(G))
  }
  return kegsIn(broke)
}

// ── A long hull's walk (F9b, DESIGN §4.2.5) ─────────────────────────────────
// `u`, a footprint unit, goes along `pts`, a lattice path ({ x, z, f }
// points from where it stands: nav.hullPath), all at once, as resolveWalk
// does a round unit's. A wrecker hull smashes at fixed samples: every
// 0.25" along each straight run, plus the end, as a round walk's, and at
// each pivot's two 15° sub-steps; at each sample each disc, front to back,
// runs smashAround with its own radius, at its place there (a run's discs
// at the run's facing, a sub-step's at the pivot sweep's own cells, fp.S:
// no trig at play), heading the way the run travels (backing, so, the way
// its tail leads) or, on a pivot, along the disc's tangent. A smash's `s`
// counts the path's inches plus 0.5" for each 45° pivot, for the view's
// timing alone; the event's `L` is that whole measure. The hull ends on
// the path's last point, a cell centre, facing its last f (moveUnitTo
// carries its riders). A path that neither moves nor turns does nothing.
//
//   unit.move { u, path: [{ x, z, f }], L, speed, fly: false, stomp, smashes, to: { x, z, f } }
//   (with height, each point and `to` carry their floor `y` too)
//
// Returns the powder kegs it smashed, as resolveWalk's.
export const PIVOT_S = 0.5
export function hullWalk(G, u, pts, { speed = 7, stomp = false } = {}) {
  if (pts.length < 2) return []
  const fp = u.t.fp, cell = fp.cell
  // the path's pieces in order: a run ({ a, b, s, l }) or a pivot ({ a, f0,
  // f1, s }), `s` the walk's measure where it starts
  const seg = []
  let acc = 0
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i]
    if (a.x === b.x && a.z === b.z) {
      seg.push({ pivot: true, a, f0: a.f, f1: b.f, s: acc })
      acc += PIVOT_S
    } else {
      const l = hypot(b.x - a.x, b.z - a.z)
      seg.push({ pivot: false, a, b, s: acc, l, f: b.f })
      acc += l
    }
  }
  const L = acc
  const smashes = [], broke = []
  if (u.t.wrecker) {
    // one sample: the discs at (x, z) facing h, in front-to-back order,
    // each heading `dir` (a run's) or its tangent (a pivot's, `turn` ±1)
    const at = (s, x, z, row, dirOf) => {
      const ev = G.out ? [] : null
      let n = 0
      for (let q = 0; q < row.length; q++) {
        const d = row[q], ox = d.ix * cell, oz = d.iz * cell
        n += smashAround(G, u, { x: x + ox, z: z + oz, dir: dirOf(ox, oz) }, ev, broke, d.r)
      }
      if (n && ev) smashes.push({ s, ev })
    }
    // a pivot from f0 to f1 = f0 ± 1 sweeps fp.S[lo] (lo the lower of the
    // two, h to h + 1), its samples per disc front to back, 15° then 30°
    // from lo: turning right reads them so, left the other way round
    const sub = (p, k) => {
      const right = p.f1 === ((p.f0 + 1) & 7), lo = right ? p.f0 : p.f1, S = fp.S[lo]
      const j = right ? k : 1 - k
      return { row: fp.r.map((r, q) => ({ ix: S[2 * q + j].ix, iz: S[2 * q + j].iz, r })), sign: right ? 1 : -1 }
    }
    let lastDir = null
    for (const p of seg) {
      if (p.pivot) {
        for (let k = 0; k < 2; k++) {
          const { row, sign } = sub(p, k)
          // the tangent of a clockwise turn (seen from above, h rising) at
          // offset (ox, oz) is (oz, −ox); anticlockwise its reverse (0 + and
          // 0 −, so the body disc's, (0, 0), holds no −0)
          at(p.s + (PIVOT_S * (k + 1)) / 3, p.a.x, p.a.z, row, (ox, oz) => atan2(0 + sign * oz, 0 - sign * ox))
        }
        lastDir = p
        continue
      }
      const dir = atan2(p.b.x - p.a.x, p.b.z - p.a.z), row = fp.H[p.f]
      for (let t = 0; t < p.l; t += 0.25) at(p.s + t, p.a.x + ((p.b.x - p.a.x) * t) / p.l, p.a.z + ((p.b.z - p.a.z) * t) / p.l, row, () => dir)
      lastDir = dir
    }
    // the end, at its heading: the last run's way, or the last pivot's
    // tangents when it ended turning
    const end = pts[pts.length - 1], row = fp.H[end.f]
    if (typeof lastDir === 'number') at(L, end.x, end.z, row, () => lastDir)
    else {
      const sign = lastDir.f1 === ((lastDir.f0 + 1) & 7) ? 1 : -1
      at(L, end.x, end.z, row, (ox, oz) => atan2(0 + sign * oz, 0 - sign * ox))
    }
  }
  const end = pts[pts.length - 1]
  u.facing = end.f
  moveUnitTo(G, u, end.x, end.z)
  if (G.out) {
    const high = G.nav.hasHeight
    const path = high ? pts.map((p) => ({ x: p.x, y: floorAt(G, p.x, p.z), z: p.z, f: p.f })) : pts.map((p) => ({ x: p.x, z: p.z, f: p.f }))
    emit(G, 'unit.move', { u: u.id, path, L, speed, fly: false, stomp, smashes, to: high ? { x: u.pos.x, y: groundY(G, u), z: u.pos.z, f: u.facing } : { x: u.pos.x, z: u.pos.z, f: u.facing } })
    emit(G, 'objectives', { owners: ownersOf(G) })
    emit(G, 'status', statusOf(G))
  }
  return kegsIn(broke)
}

// The Brute ploughs through anything breakable in its way, at one sample of
// its walk ({ x, z, dir }: where, and which way it is heading). It walks the
// live chunk list (§4.1 rule 6), so a log a tree it felled leaves in its
// path is smashed in the same sweep. The terrain's events go into `out`
// (nowhere when it is null). Returns how many chunks it hit. (F19a) What
// broke is pushed onto `broke`, when given (resolveWalk's: the kegs among
// it go off once the walk has ended).
//
// (F7a) With height it skips a chunk whose base (the floor it stands on, 0
// when absent) isn't within HIGH of the sample's floor: a Brute on the
// ground doesn't smash the parapets on a deck beside it.
//
// (F9b) `r`, the radius smashing: the unit's own by default (every round
// walk's), a long hull's disc's at each of its samples (hullWalk).
export function smashAround(G, u, { x, z, dir }, out, broke = [], r = u.r) {
  let n = 0
  const y = G.nav.hasHeight ? floorAt(G, x, z) : 0
  for (const c of G.terrain.chunks) {
    if (!c.alive || !c.destructible) continue
    if (G.nav.hasHeight && Math.abs((c.base ?? 0) - y) > HIGH) continue
    const s = c.nav || c.shape
    if (hypot(s.x - x, s.z - z) < r + Math.max(s.hx, s.hz) * 0.8) {
      G.terrain.hurt(c, 99, { x: x - sin(dir), z: z - cos(dir) }, out, broke)
      n++
    }
  }
  return n
}
