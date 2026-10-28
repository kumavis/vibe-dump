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
//
// (F9a, DESIGN §4.2.5) Riders. A unit aboard a vehicle (u.aboard, its id) is
// off the table for every spatial rule, friendly ones included (§4.1 rule
// 19): enemiesOf and friendsOf leave it out, so it is never in a forbid
// mask, an engagement, a charge's or a shot's targets, the AI's threat sums,
// a fight or a leadership aura; it engages nobody itself, and holds no
// objective (its hull's own OC counts: 0 for every vehicle so far). Each
// test is reached only where a unit is aboard: with nobody riding, every
// filter keeps what it always kept, in the same order.
import { ENGAGE, AURA, OBJECTIVE_RANGE, PHASES } from './rules.js'
import { hypot } from './dmath.js'
import { STEP } from './nav.js'
import { canShoot, hasTarget } from './actions/shoot.js'
import { canCharge, chargeTargets } from './actions/charge.js'

export { moveMode, climbs, forbidMask, movePlan, validEnd, nearestValid } from './actions/move.js'
export { canShoot, shotInfo, shootTargets, rangeOf, lobbed, weaponOf, allySpell, hasTarget } from './actions/shoot.js'
// ((V3c) the AI's pick of a caster's spell, which the shooting tool and the
// group's fire take as theirs until the player picks another: pure
// appraisal, no draw)
export { bestSpell, spellFor } from './ai/policy.js'
export { canCharge, chargeTargets, chargePlan, chargeSpots } from './actions/charge.js'
export { freeSpot } from './deploy.js'
export { groundOnly } from './actions/move.js'
export { hullOf, riders, room, mayBoard, embarkSpot, landing, isTransport } from './actions/transport.js'
export { rngState } from './rng.js'

export const alive = (u) => u.alive > 0
// (F9a: a rider is neither: it is off the table)
export const enemiesOf = (G, u) => G.units.filter((e) => e.side !== u.side && alive(e) && !e.aboard)
export const friendsOf = (G, u) => G.units.filter((e) => e.side === u.side && alive(e) && e !== u && !e.aboard)
export const dist = (a, b) => hypot(a.pos.x - b.pos.x, a.pos.z - b.pos.z)
export const gap = (a, b) => dist(a, b) - a.r - b.r
// (F7a) with height, an enemy within 1" engages only within HIGH of the floor
// it stands on: a unit at the foot of a 2" wall can't fight the defenders on
// top. (F9a) A rider engages nobody: [] while it is aboard.
export const engagedWith = (G, u) => u.aboard ? [] : G.nav.hasHeight
  ? enemiesOf(G, u).filter((e) => gap(u, e) <= ENGAGE + 0.05 && Math.abs(groundY(G, u) - groundY(G, e)) <= HIGH)
  : enemiesOf(G, u).filter((e) => gap(u, e) <= ENGAGE + 0.05)
// Where a model stands as far as the rules are concerned: its slot in the
// formation, not wherever its figure has animated to this frame.
export const mx = (u, m) => u.pos.x + m.ox
export const mz = (u, m) => u.pos.z + m.oz
export const isEngaged = (G, u) => engagedWith(G, u).length > 0
// (F18, DESIGN §4.1 rule 27) The fight `tg` is locked in, as `u`'s side
// sees it when it shoots there: `friends`, u's own units engaged with tg
// (G.units order); F their living models and T the target's, a stray
// shot's odds being F in F + T; `onto`, the friend a stray strikes, the one
// with the most living models (a tie keeps the first in G.units order); and
// whether that one is in cover (its save's). null when none of u's units is
// in the fight (F = 0: a unit nobody of u's is fighting), which draws no
// stray die.
export function fightOf(G, u, tg) {
  const friends = engagedWith(G, tg).filter((f) => f.side === u.side)
  if (!friends.length) return null
  let F = 0, onto = friends[0]
  for (const f of friends) {
    F += f.alive
    if (f.alive > onto.alive) onto = f
  }
  return { friends, F, T: tg.alive, onto, cover: inCover(G, onto) }
}

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
// The floor a unit stands on (a rider's is its hull's, where it stands: F9c's
// firing deck adds the deck's height for its eye, not here).
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
// too: the keep's objective is held from its top. (F9a) Riders hold
// nothing: an aboard unit is skipped, and its hull's own OC counts.
export function controlOf(G, o) {
  if (G.nav.hasHeight) return controlHigh(G, o)
  const oc = [0, 0]
  for (const u of G.units) {
    if (!alive(u) || u.aboard) continue
    for (const m of u.models) if (m.alive && hypot(mx(u, m) - o.x, mz(u, m) - o.z) <= OBJECTIVE_RANGE + u.t.base) oc[u.side] += u.t.OC
  }
  return oc[0] > oc[1] ? 0 : oc[1] > oc[0] ? 1 : -1
}
function controlHigh(G, o) {
  const oc = [0, 0], y = floorAt(G, o.x, o.z)
  for (const u of G.units) {
    if (!alive(u) || u.aboard) continue
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
// before. Without height, the straight line.
//
// (The review) A ladder costs 2·h but spans its 2.25" out and half its
// deck, more than it costs, so a deck can be a shortcut between two points
// below it (up a bastion's front ladder, down its back stair), and the three
// closed forms above miss it. The graph's own shortest ways between its
// nodes (gateGraph: made once per nav rebuild, O(gates³)) put them back:
// on the ground, a pair of gate ends the graph joins shorter than the
// straight line (`short`, `into`); both raised, the ground between the two
// gates (`mid`); on one raised region, down and up again. Where no deck is
// a shortcut (every Skirmish board) these are the closed forms, to the bit.
// And a point partway up a stair (its cell's floor the stair's: nav.rampOf)
// may walk straight down it to the stair's foot, not round by its top. Still
// O(gates of two levels) a call, and no field built.
export function levelDist(G, a, b, climb) {
  const nav = G.nav, line = hypot(a.x - b.x, a.z - b.z)
  if (!nav.hasHeight) return line
  const la = nav.levelAt(a.x, a.z), lb = nav.levelAt(b.x, b.z)
  const gg = gateGraph(nav, climb), gs = gg.gates, n = gs.length
  let best = Infinity
  if (la === lb) {
    best = line
    if (!la) {
      // both on the ground: the straight line, or over a deck that is a
      // shortcut between two gate ends
      for (const [u, v, d] of gg.short) {
        const c = hypot(a.x - gg.node[u].x, a.z - gg.node[u].z) + d + hypot(gg.node[v].x - b.x, gg.node[v].z - b.z)
        if (c < best) best = c
      }
      return best
    }
    // one raised region: the straight line, or down off it and up again
    const sa = stairUnder(nav, gg, a, la), sb = stairUnder(nav, gg, b, lb)
    const downs = gg.at.get(la) ?? [], ups = downs
    for (let x = -1; x < downs.length; x++) {
      const k = x < 0 ? sa : downs[x]
      if (k < 0) continue
      const down = x < 0 ? hypot(a.x - gs[k].lo.x, a.z - gs[k].lo.z) : hypot(a.x - gs[k].hi.x, a.z - gs[k].hi.z) + gs[k].cost
      for (let y = -1; y < ups.length; y++) {
        const m = y < 0 ? sb : ups[y]
        if (m < 0) continue
        const c = y < 0 ? down + gg.mid[k * n + m] + hypot(gs[m].lo.x - b.x, gs[m].lo.z - b.z) : down + gg.mid[k * n + m] + gs[m].cost + hypot(gs[m].hi.x - b.x, gs[m].hi.z - b.z)
        if (c < best) best = c
      }
    }
    return best
  }
  if (!la || !lb) {
    // one end on the ground: up (or down) through one of the other's gates
    const L = la || lb, g0 = la ? b : a, g1 = la ? a : b
    for (const k of gg.at.get(L) ?? []) {
      const g = gs[k]
      const d = groundTo(gg, g0, k) + g.cost + hypot(g.hi.x - g1.x, g.hi.z - g1.z)
      if (d < best) best = d
    }
    // (partway up a stair: straight down it)
    const s = stairUnder(nav, gg, g1, L)
    if (s >= 0) {
      const d = groundTo(gg, g0, s) + hypot(gs[s].lo.x - g1.x, gs[s].lo.z - g1.z)
      if (d < best) best = d
    }
  } else {
    // both raised: down one of a's gates, across the ground, up one of b's
    const sa = stairUnder(nav, gg, a, la), sb = stairUnder(nav, gg, b, lb)
    const downs = gg.at.get(la) ?? [], ups = gg.at.get(lb) ?? []
    for (let x = -1; x < downs.length; x++) {
      const k = x < 0 ? sa : downs[x]
      if (k < 0) continue
      const g = gs[k]
      const down = x < 0 ? hypot(a.x - g.lo.x, a.z - g.lo.z) : hypot(a.x - g.hi.x, a.z - g.hi.z) + g.cost
      for (let y = -1; y < ups.length; y++) {
        const m = y < 0 ? sb : ups[y]
        if (m < 0) continue
        const k2 = gs[m]
        const d = y < 0 ? down + gg.mid[k * n + m] + hypot(k2.lo.x - b.x, k2.lo.z - b.z) : down + gg.mid[k * n + m] + k2.cost + hypot(k2.hi.x - b.x, k2.hi.z - b.z)
        if (d < best) best = d
      }
    }
  }
  return isFinite(best) ? best : line
}

// (the review) How much shorter than the straight line levelDist can make a
// way (a ladder's shortcut): never by more than this, the most the graph
// joins two of its nodes under their straight line (0 without height, or
// where nothing is a shortcut). Any way levelDist measures is the straight
// line from a to a node, the graph's from it to another, and the line on to
// b, so it is at least |a − b| less this: the AI skips the enemies a
// straight line already puts out of a term's reach by more (core/ai/
// score.js), and measures exactly the ones it keeps. (A hair, EPS, over
// the graph's own most, so no rounding of a sum can slip under it.)
export function levelSlack(G, climb) {
  return G.nav.hasHeight ? gateGraph(G.nav, climb).slack + EPS : 0
}

// (the review) The gate graph of a nav grid for a climber or a walker (the
// ladders only for a climber), made once per rebuild (nav.epoch) and kept on
// the nav like the plan memo: derived, never hashed. Its nodes are each
// gate's two ends (gate k's foot 2k, on the ground; its top 2k + 1, on its
// level); the straight line joins two on one level and a gate its own two
// ends at its cost, and the shortest ways between them all are Floyd's, the
// nodes in order. What levelDist reads of it: `at`, each level's gates (in
// chunk order); `mid`, the ground between two gates' feet (the straight
// line, to the bit, unless the graph's way is shorter by more than EPS);
// `short`, every pair of ground nodes the graph joins so, and `into`, those
// ending at each gate's foot; `stair`, a stair's gate by its chunk's id;
// `slack`, levelSlack's bound.
const EPS = 1e-9
function gateGraph(nav, climb) {
  if (nav.gateMemo?.epoch !== nav.epoch) nav.gateMemo = { epoch: nav.epoch, climb: null, walk: null }
  const memo = nav.gateMemo
  return climb ? (memo.climb ??= buildGateGraph(nav, true)) : (memo.walk ??= buildGateGraph(nav, false))
}
function buildGateGraph(nav, climb) {
  const gates = nav.gates.filter((g) => climb || !g.ladder), n = gates.length, m = 2 * n
  const node = [], lev = []
  for (const g of gates) {
    node.push(g.lo, g.hi)
    lev.push(0, g.level)
  }
  const D = new Float64Array(m * m)
  for (let u = 0; u < m; u++) for (let v = 0; v < m; v++) D[u * m + v] = u === v ? 0 : lev[u] === lev[v] ? hypot(node[u].x - node[v].x, node[u].z - node[v].z) : Infinity
  for (let k = 0; k < n; k++) {
    const i = 2 * k * m + 2 * k + 1, j = (2 * k + 1) * m + 2 * k
    if (gates[k].cost < D[i]) D[i] = D[j] = gates[k].cost
  }
  for (let w = 0; w < m; w++) {
    for (let u = 0; u < m; u++) {
      const du = D[u * m + w]
      if (du === Infinity) continue
      for (let v = 0; v < m; v++) {
        const c = du + D[w * m + v]
        if (c < D[u * m + v]) D[u * m + v] = c
      }
    }
  }
  const mid = new Float64Array(n * n)
  for (let k = 0; k < n; k++) {
    for (let j = 0; j < n; j++) {
      const h = hypot(gates[k].lo.x - gates[j].lo.x, gates[k].lo.z - gates[j].lo.z), d = D[2 * k * m + 2 * j]
      mid[k * n + j] = d < h - EPS ? d : h
    }
  }
  let slack = 0
  for (let u = 0; u < m; u++) for (let v = 0; v < m; v++) {
    const gap = hypot(node[u].x - node[v].x, node[u].z - node[v].z) - D[u * m + v]
    if (gap > slack) slack = gap
  }
  // (a pair whose way first walks the ground to another node w, or last
  // walks it from one, is no way of its own: the straight line to w, then
  // w's, is as short, so only the pairs left are kept, the few the graph
  // leaves the ground at once from and comes down onto)
  const ground = []
  for (let u = 0; u < m; u++) if (!lev[u]) ground.push(u)
  const line = (u, v) => hypot(node[u].x - node[v].x, node[u].z - node[v].z)
  const own = (u, v, d) => !ground.some((w) => (w !== u && line(u, w) + D[w * m + v] <= d) || (w !== v && D[u * m + w] + line(w, v) <= d))
  const short = [], into = gates.map(() => [])
  for (const u of ground) {
    for (const v of ground) {
      if (u === v) continue
      const d = D[u * m + v]
      if (!(d < line(u, v) - EPS) || !own(u, v, d)) continue
      short.push([u, v, d])
    }
    // (into a gate's foot: the pairs whose way first leaves the ground at u)
    for (let k = 0; k < n; k++) {
      const v = 2 * k, d = D[u * m + v]
      if (u === v || !(d < line(u, v) - EPS) || ground.some((w) => w !== u && line(u, w) + D[w * m + v] <= d)) continue
      into[k].push([u, d])
    }
  }
  const at = new Map(), stair = new Map()
  gates.forEach((g, k) => {
    if (g.level) {
      if (!at.has(g.level)) at.set(g.level, [])
      at.get(g.level).push(k)
    }
    if (!g.ladder) stair.set(g.id, k)
  })
  return { gates, node, mid, short, into, at, stair, slack }
}
// the way from a point on the ground to gate k's foot: the straight line,
// or over a deck that is a shortcut there
function groundTo(gg, p, k) {
  const g = gg.gates[k]
  let d = hypot(p.x - g.lo.x, p.z - g.lo.z)
  for (const [u, w] of gg.into[k]) {
    const c = hypot(p.x - gg.node[u].x, p.z - gg.node[u].z) + w
    if (c < d) d = c
  }
  return d
}
// the stair (its gate in gg) a point on level L stands partway up: its
// cell's floor that stair's ramp's (nav.rampOf), and the stair rising to L;
// -1 when none
function stairUnder(nav, gg, p, L) {
  const i = nav.index(p.x, p.z)
  if (i < 0 || nav.rampOf[i] < 0) return -1
  const k = gg.stair.get(nav.rampOf[i])
  return k !== undefined && gg.gates[k].level === L ? k : -1
}

// What the table shows at the end of an action (DESIGN §2.3's `objectives`
// and `status` events): who holds each objective, and which units are in
// combat or mesmerized (by id), and (V3c) which the spells mark: snared,
// warded and resolute.
export const ownersOf = (G) => G.objectives.map((o) => controlOf(G, o))
export const statusOf = (G) => ({
  engaged: G.units.filter((u) => alive(u) && isEngaged(G, u)).map((u) => u.id),
  mesmerized: G.units.filter((u) => u.mesmerized).map((u) => u.id),
  snared: G.units.filter((u) => u.snared).map((u) => u.id),
  warded: G.units.filter((u) => u.warded).map((u) => u.id),
  resolute: G.units.filter((u) => u.resolute).map((u) => u.id),
})

// ── Who can act ─────────────────────────────────────────────────────────────
// The key of the turn's phase ('move' … 'morale'). G.turn.ph is its index in
// PHASES; once a turn's last phase is over (the engine's turn end and round
// scoring) it is one past the end, and the phase is still the last one run.
export const phaseKey = (G) => PHASES[Math.min(G.turn.ph, PHASES.length - 1)].key

// Something left to do for `u` in the current phase of its own turn. (F9a)
// A rider can still act in the movement phase while it hasn't moved (it may
// disembark: `!moved`, as for any unit), and never in the shooting or the
// charge phase while aboard (canShoot and canCharge refuse it). ((V3c) a
// snared unit has no move to make; a caster has a spell to cast while it
// may cast at all: hasTarget)
export function canAct(G, u) {
  if (!alive(u) || u.side !== G.turn.active) return false
  switch (phaseKey(G)) {
    case 'move': return !u.flags.moved && !u.snared
    case 'shoot': return canShoot(G, u) && hasTarget(G, u)
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
