// Read-only questions about the match: who is alive, engaged, in cover, in
// sight; who holds an objective; who can still act. Each one that needs the
// match takes G first; the ones that read only their arguments (alive, dist,
// gap, mx/mz, eyeY/chestY) don't. None of them changes anything but the nav
// cache (movePlan and chargePlan refresh it, as they always have), and none
// draws a die.
//
// This module is also the query set the ?debug surface and the AI reach for:
// it re-exports the move, shoot, charge and deploy queries and the dice
// stream's fingerprint (rngState).
//
// (F7a, DESIGN §4.2.4) Height. On a board with a height layer (G.nav.hasHeight:
// fortified boards; never classic or `open`) a unit stands on the floor under
// it (groundY), sees from its eye above that floor, engages and holds an
// objective only within HIGH (1.2") of the level it stands on, and the AI
// measures how far a place is by the way up to it (levelDist). Each rule's
// height is its own code path behind hasHeight (§4.1 rule 18): the classic
// expressions are the ones they always were, never the height one plus 0.
import { ENGAGE, AURA, OBJECTIVE_RANGE, PHASES } from './rules.js'
import { hypot } from './dmath.js'
import { STEP } from './nav.js'
import { canShoot, shootTargets } from './actions/shoot.js'
import { canCharge, chargeTargets } from './actions/charge.js'

export { moveMode, forbidMask, movePlan, validEnd, nearestValid } from './actions/move.js'
export { canShoot, shotInfo, shootTargets } from './actions/shoot.js'
export { canCharge, chargeTargets, chargePlan, chargeSpots } from './actions/charge.js'
export { freeSpot } from './deploy.js'
export { rngState } from './rng.js'

export const alive = (u) => u.alive > 0
export const enemiesOf = (G, u) => G.units.filter((e) => e.side !== u.side && alive(e))
export const friendsOf = (G, u) => G.units.filter((e) => e.side === u.side && alive(e) && e !== u)
export const dist = (a, b) => hypot(a.pos.x - b.pos.x, a.pos.z - b.pos.z)
export const gap = (a, b) => dist(a, b) - a.r - b.r
// (F7a) with height, an enemy within 1" engages only within HIGH of the floor
// it stands on: a unit at the foot of a 2" wall can't fight the defenders on
// top
export const engagedWith = (G, u) => G.nav.hasHeight
  ? enemiesOf(G, u).filter((e) => gap(u, e) <= ENGAGE + 0.05 && Math.abs(groundY(G, u) - groundY(G, e)) <= HIGH)
  : enemiesOf(G, u).filter((e) => gap(u, e) <= ENGAGE + 0.05)
// Where a model stands as far as the rules are concerned: its slot in the
// formation, not wherever its figure has animated to this frame.
export const mx = (u, m) => u.pos.x + m.ox
export const mz = (u, m) => u.pos.z + m.oz
export const isEngaged = (G, u) => engagedWith(G, u).length > 0

// ── Height (F7a) ────────────────────────────────────────────────────────────
// How far apart in height two things may be and still fight, hold an
// objective together, be caught by a charge's spot or a smash: 1.2" (a 2"
// wall's top is out of reach from its foot).
export const HIGH = 1.2
// The floor at (x, z): the nav's, quantised to 1/64"; 0 without height (and
// off the table).
export function floorAt(G, x, z) {
  if (!G.nav.hasHeight) return 0
  const i = G.nav.index(x, z)
  return i < 0 ? 0 : G.nav.floor[i]
}
// The floor a unit stands on (F9: a rider's will be its hull's plus the
// deck's height).
export const groundY = (G, u) => floorAt(G, u.pos.x, u.pos.z)

// ── Line of sight, cover, control ───────────────────────────────────────────
export const eyeY = (u) => u.t.eye
export const chestY = (u) => u.t.chest

export function inCover(G, u) {
  const live = u.models.filter((m) => m.alive)
  if (u.t.fly) return false
  let n = 0
  for (const m of live) if (G.nav.cover[G.nav.index(mx(u, m), mz(u, m))]) n++
  return n * 2 >= live.length && n > 0
}

// Can `a` see `b`? Rays from a's centre to each of b's models. (S1)
// `bCover`, when given, is inCover(G, b), worked out once by a caller that
// asks from many places (the AI's lattice scan, core/ai/score.js).
//
// (F7a) With height the eye stands on the floor where the shooter would
// stand (`from`: the AI scoring a deck cell from the ground, and the
// planner's approach, see from that cell) and each target model's chest on
// its own floor; the terrain's segment test is 3D already, so a deck's solid
// body blocks a ray that dips into it (the dead ground at a wall's foot).
export function sight(G, a, b, from = a.pos, bCover = undefined) {
  if (G.nav.hasHeight) return look(G, a, b, from, bCover, null)
  const eye = { x: from.x, y: eyeY(a), z: from.z }
  let seen = 0, obsc = 0, total = 0
  for (const m of b.models) {
    if (!m.alive) continue
    total++
    const r = G.terrain.los(eye, { x: mx(b, m), y: chestY(b), z: mz(b, m) })
    if (!r.blocked) {
      seen++
      if (r.obscure) obsc++
    }
  }
  return { visible: seen > 0, cover: seen > 0 && (obsc > 0 || seen < total || (bCover ?? inCover(G, b))), seen, total }
}

// sight with height, and with the reasons when `why` is given ({ block,
// obscure }: the chunk that stopped the first ray stopped by a solid one,
// and every obscuring chunk a ray passed, by id, each once in the order met)
function look(G, a, b, from, bCover, why) {
  const eye = G.nav.hasHeight ? { x: from.x, y: floorAt(G, from.x, from.z) + eyeY(a), z: from.z } : { x: from.x, y: eyeY(a), z: from.z }
  let seen = 0, obsc = 0, total = 0
  const ray = why && { block: null, obscure: [] }
  for (const m of b.models) {
    if (!m.alive) continue
    total++
    const x = mx(b, m), z = mz(b, m)
    const y = G.nav.hasHeight ? floorAt(G, x, z) + chestY(b) : chestY(b)
    if (ray) {
      ray.block = null
      ray.obscure.length = 0
    }
    const r = G.terrain.los(eye, { x, y, z }, undefined, ray)
    if (why) {
      if (r.blocked && ray.block !== null && why.block === null) why.block = ray.block
      for (const id of ray.obscure) if (!why.obscure.includes(id)) why.obscure.push(id)
    }
    if (!r.blocked) {
      seen++
      if (r.obscure) obsc++
    }
  }
  return { visible: seen > 0, cover: seen > 0 && (obsc > 0 || seen < total || (bCover ?? inCover(G, b))), seen, total }
}

// (F7a) What `u` sees of `tg` from `from` (its own place by default), and
// why: { ok, block, obscure, cover, high, seen, total }. The same rays as
// sight (whose verdict `ok` and `cover` are: P-height holds them equal),
// with their reasons: `block`, the id of the solid chunk that stopped the
// first ray a solid chunk stopped (null when none did: two obscurers in a
// row block too); `obscure`, the ids of the obscuring chunks the rays
// passed; `high`, the eye's floor more than STEP above the target's (it
// looks down from raised ground). F7b's line of sight with its reasons
// reads it. Under the lock, like every query here.
export function sightInfo(G, u, tg, from = u.pos) {
  const why = { block: null, obscure: [] }
  const s = look(G, u, tg, from, undefined, why)
  const high = G.nav.hasHeight && floorAt(G, from.x, from.z) - groundY(G, tg) > STEP
  return { ok: s.visible, block: why.block, obscure: why.obscure, cover: s.cover, high, seen: s.seen, total: s.total }
}

export function leadership(G, u) {
  let ld = u.t.Ld
  for (const f of friendsOf(G, u)) if (f.t.hero && dist(u, f) <= AURA + u.r) ld = Math.max(ld, f.t.Ld)
  return ld
}

// Who holds objective `o`: the seat with more OC within range, -1 for nobody.
// (F7a) With height a model counts only within HIGH of the objective's floor
// too: the keep's objective is held from its top.
export function controlOf(G, o) {
  if (G.nav.hasHeight) return controlHigh(G, o)
  const oc = [0, 0]
  for (const u of G.units) {
    if (!alive(u)) continue
    for (const m of u.models) if (m.alive && hypot(mx(u, m) - o.x, mz(u, m) - o.z) <= OBJECTIVE_RANGE + u.t.base) oc[u.side] += u.t.OC
  }
  return oc[0] > oc[1] ? 0 : oc[1] > oc[0] ? 1 : -1
}
function controlHigh(G, o) {
  const oc = [0, 0], y = floorAt(G, o.x, o.z)
  for (const u of G.units) {
    if (!alive(u)) continue
    for (const m of u.models) {
      if (!m.alive) continue
      const x = mx(u, m), z = mz(u, m)
      if (hypot(x - o.x, z - o.z) <= OBJECTIVE_RANGE + u.t.base && Math.abs(floorAt(G, x, z) - y) <= HIGH) oc[u.side] += u.t.OC
    }
  }
  return oc[0] > oc[1] ? 0 : oc[1] > oc[0] ? 1 : -1
}

// (F7a, DESIGN §4.2.4's AI) How far a unit walks from a to b ({x, z} each),
// exactly over the gate graph: the ground and each raised region, joined
// through the region's gates (nav.gates: each stair's ends at its length,
// and, for a climber, each ladder's foot and top at its cost). With la and
// lb the two points' levels: the same level, the straight line; one on the
// ground, the best of the other's gates (|a − g.lo| + g.cost + |g.hi − b|,
// or the reverse); both raised, the best pair of gates, through the ground.
// The minimum is taken over the gates in chunk order (the first of equals);
// with no way (a region with no gate this unit takes) the straight line, as
// before. O(gates of two levels) a call, no field built. Without height,
// the straight line.
export function levelDist(G, a, b, climb) {
  const nav = G.nav, line = hypot(a.x - b.x, a.z - b.z)
  if (!nav.hasHeight) return line
  const la = nav.levelAt(a.x, a.z), lb = nav.levelAt(b.x, b.z)
  if (la === lb) return line
  let best = Infinity
  if (!la || !lb) {
    // one end on the ground: up (or down) through one of the other's gates
    const L = la || lb, g0 = la ? b : a, g1 = la ? a : b
    for (const g of nav.gates) {
      if (g.level !== L || (g.ladder && !climb)) continue
      const d = hypot(g0.x - g.lo.x, g0.z - g.lo.z) + g.cost + hypot(g.hi.x - g1.x, g.hi.z - g1.z)
      if (d < best) best = d
    }
  } else {
    // both raised: down one of a's gates, across the ground, up one of b's
    for (const g of nav.gates) {
      if (g.level !== la || (g.ladder && !climb)) continue
      const down = hypot(a.x - g.hi.x, a.z - g.hi.z) + g.cost
      for (const k of nav.gates) {
        if (k.level !== lb || (k.ladder && !climb)) continue
        const d = down + hypot(g.lo.x - k.lo.x, g.lo.z - k.lo.z) + k.cost + hypot(k.hi.x - b.x, k.hi.z - b.z)
        if (d < best) best = d
      }
    }
  }
  return isFinite(best) ? best : line
}

// What the table shows at the end of an action (DESIGN §2.3's `objectives`
// and `status` events): who holds each objective, and which units are in
// combat or mesmerized (by id).
export const ownersOf = (G) => G.objectives.map((o) => controlOf(G, o))
export const statusOf = (G) => ({
  engaged: G.units.filter((u) => alive(u) && isEngaged(G, u)).map((u) => u.id),
  mesmerized: G.units.filter((u) => u.mesmerized).map((u) => u.id),
})

// ── Who can act ─────────────────────────────────────────────────────────────
// The key of the turn's phase ('move' … 'morale'). G.turn.ph is its index in
// PHASES; once a turn's last phase is over (the engine's turn end and round
// scoring) it is one past the end, and the phase is still the last one run.
export const phaseKey = (G) => PHASES[Math.min(G.turn.ph, PHASES.length - 1)].key

// Something left to do for `u` in the current phase of its own turn.
export function canAct(G, u) {
  if (!alive(u) || u.side !== G.turn.active) return false
  switch (phaseKey(G)) {
    case 'move': return !u.flags.moved
    case 'shoot': return canShoot(G, u) && shootTargets(G, u).length > 0
    case 'charge': return canCharge(G, u) && chargeTargets(G, u).length > 0
  }
  return false
}
export const anyCanAct = (G, side) => G.units.some((u) => u.side === side && canAct(G, u))

// ── A set of a seat's units, as one number (F10b's `pilot {m}`) ─────────────
// Bit j is the seat's j-th unit in G.units order, dead or alive, so a mask
// means the same units on every peer for the whole battle. maskUnits is the
// units a mask names, in G.units order, or null when it names a unit the
// seat doesn't have (a bit past its last); exact division, never a bitwise
// operator, so a mask may use all 53 bits a safe integer holds (a Grand
// army's 24 among them).
export function maskUnits(G, seat, m) {
  const mine = G.units.filter((u) => u.side === seat), out = []
  for (let j = 0; m > 0; j++) {
    const r = m % 2
    if (r) {
      if (j >= mine.length) return null
      out.push(mine[j])
    }
    m = (m - r) / 2
  }
  return out
}
// the mask naming the seat's units among `ids` (bit by doubling: core/
// keeps out the ** operator)
export function maskOf(G, seat, ids) {
  let m = 0, bit = 1
  for (const u of G.units) {
    if (u.side !== seat) continue
    if (ids.includes(u.id)) m += bit
    bit *= 2
  }
  return m
}
