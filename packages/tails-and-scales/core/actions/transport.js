// Transports (DESIGN §4.2.5, F9a): units riding a vehicle, boarding it and
// stepping off it, the deployment's autoload, and a hull destroyed with its
// riders aboard (its wreck and the bail-out).
//
// This is the one rules module that reads a unit type's `transport` record
// (data/schema.js: capacity, maxBase, fire, deck, wreck; sim/flag-lint.mjs's
// one-reader rows), and the legality's reader of `vehicle`. A rider is a
// unit whose `aboard` names its hull's id (core/units.js): it stands at its
// hull's place (moveUnitTo carries it), and is off the table for every
// spatial rule (core/queries.js's enemiesOf and friendsOf, and each site
// §4.1 rule 19 lists). Everything here is reached only where a unit rides or
// a hull with room stands on the table: a battle without either never calls
// a function of this module but `hullDestroyed` and `autoload`, which each
// return at their first test, drawing nothing.
//
// Synchronous, like damage.js: what the view shows is events in the match's
// out, in order (DESIGN §2.3):
//
//   unit.embark    { u, v }                 u boards v (in a phase, after its
//                                           walk to v's side: a unit.move)
//   unit.disembark { u, v, to, forced }     u steps off v onto `to` ({ x, z },
//                                           and y with height); `forced`: it
//                                           bailed out of v's wreck
//   terrain.add    { def }                  v's wreck (kind 'wreck': the
//                                           terrain's own report)
//
// No draw anywhere but the bail-out's dice (§4.1 rule 16), each rider's
// roll in G.units order after its spot is found: every choice here is the
// nearest or least of a set of cells, ties to the lowest cell index.
import { ENGAGE, roll } from '../rules.js'
import { hypot } from '../dmath.js'
import { emit, log } from '../journal.js'
import { refreshNav } from '../match.js'
import { moveUnitTo, setUnitPos } from '../units.js'
import { pathLength } from '../nav.js'
import { alive, isEngaged, groundY, ownersOf, statusOf } from '../queries.js'
import { movePlan, validEnd, forbidMask, climbs, resolveWalk, walkCost } from './move.js'
import { damage, killModel } from './damage.js'

const unitOf = (G, id) => G.units.find((u) => u.id === id)

// How far beyond a hull's edge a unit boards from (its base within 1" of
// the hull's), and steps off to (within 3").
export const BOARD_REACH = 1
export const LAND_REACH = 3

// ── Who rides what ──────────────────────────────────────────────────────────
// Whether `u` carries riders (it has a transport record).
export const isTransport = (u) => !!u.t.transport
// The unit standing on the table for `u`: its hull while it rides, else
// itself.
export const hullOf = (G, u) => (u.aboard ? unitOf(G, u.aboard) : u)
// The units riding `v`, in G.units order.
export const riders = (G, v) => G.units.filter((p) => p.aboard === v.id && alive(p))
// The models `v` has room for still (0 for a unit that carries nobody).
export function room(G, v) {
  const tr = v.t.transport
  if (!tr) return 0
  let n = tr.capacity
  for (const p of riders(G, v)) n -= p.alive
  return n
}
// How many rider units may shoot from `v`'s deck now: the AI keeps that
// many aboard while it has no other reason to step them off (DESIGN
// §4.2.5's AI: the riders past the deck's slots step off once an enemy is
// in reach of their guns). None before F9c's firing deck: canShoot refuses
// every rider, so a rider kept aboard for a slot would carry its gun out of
// the battle (F9a's integration: the play-report and army-sim's fit, with
// the record's `fire` 2, kept both War-Cart squads aboard until the hull
// reached an objective, and the cart fitted about 0). F9c makes this the
// record's `fire` (v.t.transport.fire), once riders shoot from the deck.
export const fireSlots = () => 0

// ── Boarding ────────────────────────────────────────────────────────────────
// Why `u` may not board `v` now, or null (core/commands.js's `embark`,
// DESIGN §4.2.5's table). u: standing, on the table, no vehicle, its bases
// within the hull's maxBase, not yet moved, not in combat. v: a standing
// vehicle of u's seat with a transport, on the table, not in combat, with
// room for u's models. In a phase (`inPhase`) u must also reach the hull's
// side this move (embarkSpot); in the deployment it boards where it stands.
// ((V3c, at the V3 merge) A unit Root Snare binds boards nothing: boarding
// is its move, and the snare forbids one, core/commands.js mayMove.)
export function mayBoard(G, u, v, inPhase) {
  if (!alive(u)) return `unit ${u.id} is destroyed`
  if (u.aboard) return `${u.t.short} is aboard a vehicle already`
  if (u.t.vehicle) return `${u.t.short} is a vehicle: it carries, it doesn't ride`
  if (!v || !alive(v) || v.side !== u.side) return `${u.t.short} has no standing vehicle of its own seat to board there`
  const tr = v.t.transport
  if (!tr) return `the ${v.t.short} carries nobody`
  if (v.aboard) return `the ${v.t.short} is aboard a vehicle itself`
  if (u.t.base > tr.maxBase) return `${u.t.short}'s bases are too large for the ${v.t.short} (${u.t.base}" over its ${tr.maxBase}")`
  if (u.flags.moved) return `${u.t.short} has moved`
  if (u.snared) return `${u.t.short} is snared`
  if (isEngaged(G, u)) return `${u.t.short} is in combat`
  if (isEngaged(G, v)) return `the ${v.t.short} is in combat`
  const left = room(G, v)
  if (left < u.alive) return `the ${v.t.short} has room for ${left} model${left === 1 ? '' : 's'}, not ${u.alive}`
  if (inPhase && embarkSpot(G, u, v) < 0) return `${u.t.short} can't reach the ${v.t.short} this move`
  return null
}

// The cell `u` walks to to board `v` this move: of the valid ends of its
// move (validEnd, on `plan`: movePlan's, with the advance roll when it
// advanced) within 1" of the hull's edge (for a round hull, within v.r +
// u.r + 1" of its centre), the one the plan reaches shortest, ties to the
// lowest index; -1 for none. (F9b's long hulls measure each disc: clearOf.)
export function embarkSpot(G, u, v, plan = movePlan(G, u, u.flags.advanced ? u.flags.advRoll : 0)) {
  const nav = G.nav, R = v.r + u.r + BOARD_REACH
  const x0 = Math.max(0, Math.floor((v.pos.x - R + nav.W / 2) / nav.cell)), x1 = Math.min(nav.nx - 1, Math.floor((v.pos.x + R + nav.W / 2) / nav.cell))
  const z0 = Math.max(0, Math.floor((v.pos.z - R + nav.H / 2) / nav.cell)), z1 = Math.min(nav.nz - 1, Math.floor((v.pos.z + R + nav.H / 2) / nav.cell))
  let best = -1, bd = Infinity
  for (let iz = z0; iz <= z1; iz++) for (let ix = x0; ix <= x1; ix++) {
    const i = iz * nav.nx + ix
    const d = plan.res.dist[i]
    if (!(d < bd) || hypot(nav.x(i) - v.pos.x, nav.z(i) - v.pos.z) > R || !validEnd(G, plan, i)) continue
    bd = d
    best = i
  }
  return best
}

// `u` boards `v` (mayBoard says it may). In the deployment it simply rides
// (the hull's place is its own from now on). In a phase (DESIGN §4.2.5's
// handler): it walks to embarkSpot's cell as a move walks (resolveWalk,
// then the nav follows, at the walk's own site: §4.1 rule 20), then rides,
// its move spent, the flags and labels as it leaves them, and a line says
// so. Draws nothing; core/commands.js's
// handler ends the action.
export function doEmbark(G, u, v, inPhase) {
  if (!inPhase) {
    u.aboard = v.id
    setUnitPos(u, v.pos.x, v.pos.z)
    emit(G, 'unit.embark', { u: u.id, v: v.id })
    return
  }
  const plan = movePlan(G, u, u.flags.advanced ? u.flags.advRoll : 0)
  const c = embarkSpot(G, u, v, plan)
  const pts = G.nav.path(plan.res, c, u.r, plan.mode === 'fly' ? null : plan.forbid)
  const L = G.nav.hasHeight ? walkCost(pts) : pathLength(pts)
  resolveWalk(G, u, pts, { fly: plan.mode === 'fly' })
  refreshNav(G)
  u.aboard = v.id
  moveUnitTo(G, u, v.pos.x, v.pos.z)
  u.flags.moved = true
  emit(G, 'unit.embark', { u: u.id, v: v.id })
  // (F9a's integration) the flags and labels as it leaves them: the walk's
  // own were taken with the unit standing at the hull's side, where it may
  // have held an objective a rider holds no more
  if (G.out) {
    emit(G, 'objectives', { owners: ownersOf(G) })
    emit(G, 'status', statusOf(G))
  }
  log(G, u.side, `<b>${u.t.short}</b> board the ${v.t.short} (${L.toFixed(1)}").`)
}

// ── Stepping off ────────────────────────────────────────────────────────────
// Where `u` may step off `v` (DESIGN §4.2.5's `disembark`): the cells it
// walks to from the hull's place (nav.reach from v.pos, its own base and
// climbing, walk mode, out to v.r + u.r + 3", round the enemies' 1" bubbles
// as any move's end: `bubbles`), each standable for it, within 3" of the
// hull's edge (edge to edge), and clear of every unit on the table by o.r +
// u.r + 0.08 (a valid end's spacing). Riders so walk off at the hull's own
// level, and reach a deck only by its stairs or ladders within those
// inches. The cells in index order. `bubbles` false (the bail-out's last
// resort, bailSpot) drops the enemies' bubbles: the reach then walks
// anywhere a base fits, still clear of every base.
export function landing(G, u, v, bubbles = true) {
  refreshNav(G)
  const nav = G.nav, max = v.r + u.r + LAND_REACH
  const forbid = bubbles ? forbidMask(G, u, ENGAGE + 0.05) : null
  const res = nav.reach(v.pos.x, v.pos.z, { r: u.r, max, mode: 'walk', forbid, climb: climbs(u) })
  const others = G.units.filter((o) => o !== u && alive(o) && !o.aboard)
  const x0 = Math.max(0, Math.floor((v.pos.x - max + nav.W / 2) / nav.cell)), x1 = Math.min(nav.nx - 1, Math.floor((v.pos.x + max + nav.W / 2) / nav.cell))
  const z0 = Math.max(0, Math.floor((v.pos.z - max + nav.H / 2) / nav.cell)), z1 = Math.min(nav.nz - 1, Math.floor((v.pos.z + max + nav.H / 2) / nav.cell))
  const cells = []
  for (let iz = z0; iz <= z1; iz++) for (let ix = x0; ix <= x1; ix++) {
    const i = iz * nav.nx + ix
    if (!isFinite(res.dist[i]) || !nav.standable(i, u.r, 'walk', forbid)) continue
    const x = nav.x(i), z = nav.z(i)
    if (hypot(x - v.pos.x, z - v.pos.z) - v.r - u.r > LAND_REACH) continue
    if (others.some((o) => hypot(o.pos.x - x, o.pos.z - z) < o.r + u.r + 0.08)) continue
    cells.push(i)
  }
  return cells
}

// The cell of `cells` nearest (x, z), ties to the lowest index (the cells
// in index order); -1 for none. The AI's and the bail-out's pick.
export function nearestCell(G, cells, x, z) {
  let best = -1, bd = Infinity
  for (const i of cells) {
    const d = hypot(G.nav.x(i) - x, G.nav.z(i) - z)
    if (d < bd) {
      bd = d
      best = i
    }
  }
  return best
}

// Why rider `u` may not step off onto cell c now, or null: it rides, hasn't
// moved, and c is one of its landing cells.
export function mayLand(G, u, c) {
  if (!u.aboard) return `${u.t.short} rides no vehicle`
  if (u.flags.moved) return `${u.t.short} has moved`
  const v = unitOf(G, u.aboard)
  if (!(Number.isInteger(c) && c >= 0 && c < G.nav.N) || !landing(G, u, v).includes(c)) return `${u.t.short} can't step off the ${v.t.short} onto cell ${c}`
  return null
}

// What a step off reports: where the rider now stands (and its floor, with
// height: a classic event doesn't carry one)
const landed = (G, u) => (G.nav.hasHeight ? { x: u.pos.x, y: groundY(G, u), z: u.pos.z } : { x: u.pos.x, z: u.pos.z })

// Rider `u` steps off onto cell c (mayLand says it may), as its move: it
// stands there, its move spent, and (`rode`) it may not charge this turn if
// its hull had already moved. The flags and the labels as it leaves them,
// then a line. core/commands.js's handler ends the action.
export function doDisembark(G, u, c) {
  const v = unitOf(G, u.aboard)
  u.aboard = 0
  moveUnitTo(G, u, G.nav.x(c), G.nav.z(c))
  u.flags.moved = true
  if (v.flags.moved) u.flags.rode = true
  emit(G, 'unit.disembark', { u: u.id, v: v.id, to: landed(G, u), forced: false })
  if (G.out) {
    emit(G, 'objectives', { owners: ownersOf(G) })
    emit(G, 'status', statusOf(G))
  }
  log(G, u.side, `<b>${u.t.short}</b> step off the ${v.t.short}.`)
}

// ── The deployment's autoload (DESIGN §4.2.8.7) ─────────────────────────────
// After both armies' rows are placed (core/deploy.js deployArmies), each
// vehicle with a transport, in G.units order, boards its own seat's Troops
// in G.units order: a unit still on the table, its bases within maxBase,
// neither big nor a wrecker, whole, while its models fit the room left (a
// unit that doesn't fit is passed over, and a smaller one after it may).
// No draw (§4.1 rule 19): an army without a vehicle (every preset) deploys
// exactly as it did. A human seat re-arranges in its deployment (a `place`
// takes a rider off; an `embark` boards one).
export function autoload(G) {
  for (const v of G.units) {
    const tr = v.t.transport
    if (!tr || !alive(v)) continue
    let left = room(G, v)
    for (const u of G.units) {
      if (u.side !== v.side || u.t.role !== 'Troops' || u.aboard || !alive(u)) continue
      if (u.t.base > tr.maxBase || u.t.big || u.t.wrecker || u.alive > left) continue
      u.aboard = v.id
      setUnitPos(u, v.pos.x, v.pos.z)
      left -= u.alive
    }
  }
}

// ── A hull destroyed (DESIGN §4.2.5, §4.1 rule 16) ──────────────────────────
// The end of core/actions/damage.js's unitDestroyed, for every unit; only a
// transport goes on. Its wreck joins the terrain where it stood (when its
// record has one) and the nav follows; then each rider, in G.units order,
// bails out: it rides no more, and stands on bailSpot's cell, its move
// spent, then rolls a D6 a model, each 1 a mortal wound (damage at D1 with
// no save, by the hull); a rider with nowhere to stand is lost, every model
// slain by the hull. This runs inside damage(), mid-attack: a blast's
// victims were found before any damage (no rider is among them), and the
// blast's chunk sweep walks a copy taken after the wreck joined, so it may
// chip the new wreck, as it would any chunk. No line of its own: the
// destroyed lines wait for the attack's report (§4.1 rule 8), and a line
// written here would let them out ahead of it; the dice row and the events
// say what happened.
export function hullDestroyed(G, v, by) {
  const tr = v.t.transport
  if (!tr) return
  if (tr.wreck) {
    const base = groundY(G, v)
    G.terrain.wreck({ x: v.pos.x, z: v.pos.z, base, hx: tr.wreck.hx, hy: tr.wreck.hy, hz: tr.wreck.hz, yaw: 0, look: { piece: 'wreck', race: v.race } }, G.out)
    refreshNav(G)
  }
  for (const p of G.units.filter((o) => o.aboard === v.id && alive(o))) {
    p.aboard = 0
    const c = bailSpot(G, p, v)
    if (c < 0) {
      for (const m of p.models) if (m.alive) killModel(G, p, m, v, m.w)
      continue
    }
    moveUnitTo(G, p, G.nav.x(c), G.nav.z(c))
    p.flags.moved = true
    emit(G, 'unit.disembark', { u: p.id, v: v.id, to: landed(G, p), forced: true })
    const dice = roll(G, p.alive)
    emit(G, 'dice', { label: `${p.t.short}: bail out, 1s wound`, dice, need: 2 })
    damage(G, p, dice.filter((d) => d === 1).length, 1, v)
  }
}

// Where rider `p` bails out of the wreck of `v`: the landing cell nearest the
// hull's centre outside the enemies' 1" (landing's own bubbles), ties to the
// lowest index; failing that, the nearest without the bubbles; else -1.
export function bailSpot(G, p, v) {
  const c = nearestCell(G, landing(G, p, v), v.pos.x, v.pos.z)
  return c >= 0 ? c : nearestCell(G, landing(G, p, v, false), v.pos.x, v.pos.z)
}
