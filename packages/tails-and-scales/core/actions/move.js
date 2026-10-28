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
import { alive, enemiesOf, isEngaged, ownersOf, statusOf, floorAt, groundY, HIGH } from '../queries.js'

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
// fits) and a pile-in ask. Read only with height.
export function groundOnly(u) {
  return u.t.vehicle
}

// Cells a unit may not enter: within 1" of an enemy (or just their bases when
// falling back / charging). `onlyBodies` lists whose bases only count.
//
// (F7a) With height an enemy's bubble (and base) forbids only the cells
// within HIGH of the floor it stands on, and its disc carries that floor
// (`y`) for nav.walkable's shortcuts: a unit walks the foot of a wall whose
// top an enemy holds.
export function forbidMask(G, u, pad, onlyBodies = []) {
  if (G.nav.hasHeight) return forbidHigh(G, u, pad, onlyBodies)
  // (the grid's own size, S0: the board the match is played on)
  const nav = G.nav, { W, H } = nav
  const f = new Uint8Array(nav.N)
  f.discs = [] // the exact shapes, for nav.walkable's straight-line shortcuts
  for (const e of enemiesOf(G, u)) {
    const R = e.r + u.r + (onlyBodies.includes(e) ? 0.02 : pad)
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
function forbidHigh(G, u, pad, onlyBodies) {
  const nav = G.nav, { W, H } = nav
  const f = new Uint8Array(nav.N)
  f.discs = []
  // (F9a) a ground vehicle never enters a cell whose floor is above STEP:
  // the reach, the path's shortcuts (nav.walkable reads the mask) and the
  // end (standable) all keep it on the ground
  if (groundOnly(u)) for (let i = 0; i < nav.N; i++) if (nav.floor[i] > STEP) f[i] = 1
  for (const e of enemiesOf(G, u)) {
    const R = e.r + u.r + (onlyBodies.includes(e) ? 0.02 : pad), y = groundY(G, e)
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
export function movePlan(G, u, extra = 0) {
  refreshNav(G)
  const memo = G.nav.memo, key = memo && planKey(G, u, extra)
  if (memo && memo.sig === key) return memo.plan
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

// What a plan reads, as a memo's key: the unit, where it stands, its base,
// the extra inches, the nav grid's epoch, and every live unit's place and
// base (numbers exactly, -0 apart from 0); (F9a) and which hull a rider
// rides (aboard), where one does: a rider stands in nobody's way, so the
// plan reads it too (a key without riders is the key it always was).
const num = (n) => (Object.is(n, -0) ? '-0' : String(n))
function planKey(G, u, extra) {
  let k = `${u.id}@${num(u.pos.x)},${num(u.pos.z)} r${num(u.r)} +${num(extra)} e${G.nav.epoch}`
  for (const o of G.units) if (alive(o)) k += `|${o.id}@${num(o.pos.x)},${num(o.pos.z)} r${num(o.r)}${o.aboard ? ` a${o.aboard}` : ''}`
  return k
}

// May the plan's unit end its move on cell i? (F10a) `at`, a Map of id →
// { x, z }, stands units somewhere else than G has them, as a group's
// planner (present/orders.js) foresees them: the members it planned
// before this one where they will have gone. Null: today's question. (F9a)
// A rider is off the table: it neither ends a move here nor stands in
// anyone's way (a hull's own riders stand at its centre).
export function validEnd(G, plan, i, at = null) {
  const { u, res, mode, endForbid } = plan
  const nav = G.nav
  if (i < 0 || !isFinite(res.dist[i])) return false
  if (!nav.standable(i, u.r, mode === 'wreck' ? 'wreck' : 'walk', endForbid)) return false
  const x = nav.x(i), z = nav.z(i)
  for (const o of G.units) {
    if (o === u || !alive(o) || o.aboard) continue
    const p = at?.get(o.id) ?? o.pos
    if (hypot(p.x - x, p.z - z) < o.r + u.r + 0.08) return false
  }
  return true
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
export function doMove(G, u, cell, plan = movePlan(G, u, u.flags.advanced ? u.flags.advRoll : 0)) {
  const pts = G.nav.path(plan.res, cell, u.r, plan.mode === 'fly' ? null : plan.forbid)
  u.flags.moved = true
  if (plan.fallback) u.flags.fellBack = true
  // (F7a: with height a climb counts what it costs, not the ground it spans)
  const L = G.nav.hasHeight ? walkCost(pts) : pathLength(pts)
  log(G, u.side, `<b>${u.t.short}</b> ${plan.fallback ? 'fall back' : u.flags.advanced ? 'advance' : 'move'} ${L.toFixed(1)}".`)
  const kegs = resolveWalk(G, u, pts, { fly: plan.mode === 'fly', stomp: u.t.wrecker && L > 0.1 })
  // (the nav follows the walk, at today's site: DESIGN §4.1 rule 9)
  refreshNav(G)
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
export function smashAround(G, u, { x, z, dir }, out, broke = []) {
  let n = 0
  const y = G.nav.hasHeight ? floorAt(G, x, z) : 0
  for (const c of G.terrain.chunks) {
    if (!c.alive || !c.destructible) continue
    if (G.nav.hasHeight && Math.abs((c.base ?? 0) - y) > HIGH) continue
    const s = c.nav || c.shape
    if (hypot(s.x - x, s.z - z) < u.r + Math.max(s.hx, s.hz) * 0.8) {
      G.terrain.hurt(c, 99, { x: x - sin(dir), z: z - cos(dir) }, out, broke)
      n++
    }
  }
  return n
}
