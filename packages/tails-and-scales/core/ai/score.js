// What the AI thinks things are worth (DESIGN §1.1): a unit's points, a
// fight's or a shot's expected haul, and how good a spot on the table is
// for a unit of each role. No search, just a general's instincts written as
// scores: shooters want targets they can see from cover, brawlers want to
// end their move within a likely charge, troops want objectives, artillery
// wants to sit still, heroes want friends around them.
//
// AI code is rules code (DESIGN §4.1 rule 10): it runs inside the fold on
// every peer, and bestSpot's tie-breaks draw from the match's own dice, one
// draw per lattice cell that passes `isFinite(res.dist[i]) && validEnd`, in
// the lattice's order (rule 6). Everything else here only reads the match.
import { CHARGE_RANGE, AURA, expected, p2D6, pD6, hitNeed, attackCount } from '../rules.js'
import { draw } from '../rng.js'
import { hypot, hypot3 } from '../dmath.js'
import { alive, enemiesOf, friendsOf, inCover, sight, controlOf, validEnd, levelDist, levelSlack, floorAt, rangeOf, fightOf } from '../queries.js'
import { climbs, moveMode } from '../actions/move.js'
import { friendsUnder } from '../actions/shoot.js'
import { HAZARDS } from '../../data/hazards.js'

// a unit's points still standing
export const worth = (u) => (u.t.pts * u.alive) / u.t.models

export function meleeValue(a, d) {
  if (!a.t.melee) return 0
  return expected(a.alive * a.t.A, hitNeed(a.t.WS, a.mesmerized ? 1 : 0), a.t.melee, d, false).value
}

// (F18, rule 10: it bumps with F18) What a shot at `e` costs `u`'s own
// side, the shot's friendly fire, for shotValue. `fight` is fightOf(G, u, e)
// (u's units in a fight with e, or null): a plain volley's misses stray into
// them, n·(1 − p(hit)) of them by their share F / (F + T), each a hit on
// `onto` (rules.js's expected, hitting on 1+, against its T, Sv and cover),
// the same odds doShoot rolls. A template's cost is ownUnder's.
export function strayCost(n, need, w, fight) {
  const stray = n * (1 - pD6(need)) * fight.F / (fight.F + fight.T)
  return expected(stray, 1, w, fight.onto, fight.cover).value
}
// The points of `u`'s own side a template of its weapon landing square on
// `e` would take (friendsUnder: who it would catch there, u itself
// included), each friend by expected over its models under it, a big one's
// D3+1 hits as 3 (as the value of the target's own): one template's cost
// on a hit. A scatter's cost is the policy's (aiShoot's own lads).
export function ownUnder(G, u, e) {
  const w = u.t.ranged
  let cost = 0
  for (const { v, under } of friendsUnder(G, u, e)) cost += expected(v.t.big ? 3 : under, 1, w, v, inCover(G, v)).value
  return cost
}

// ── (F19a) The powder keg ───────────────────────────────────────────────────
// What the AI makes of a keg (rule 10: they bump with F19a), in three terms,
// each skipped where no keg stands (every board but the `keg` set's, so
// every other battle scores as it did, to the bit): a unit fears standing
// in a keg's blast while any enemy could set it off (score's), the guns
// value a template that would set one off (shotValue's) and a wrecker the
// walk that smashes one (score's), each keg's going off valued by what it
// takes of the enemy less what it takes of its own side (by expected, as
// ownUnder counts a template's friends). None draws: bestSpot's draws are
// where they were.

// The kegs standing, in chunk order ([] on a board with none).
export const kegsOf = (G) => G.terrain.chunks.filter((c) => c.alive && c.kind === 'keg')

// Whether any enemy of `side` could set a keg off this battle: one standing
// with a blast weapon (a template, acid's among them, or a blast spell's) or
// a wrecker's walk.
export const kegDanger = (G, side) => G.units.some((e) => e.side !== side && alive(e) && !!(e.t.ranged?.blast || e.t.wrecker))

// How many hits keg `k` going off would put on `v` were it standing at `at`
// (where it stands, by default): its living models within the keg's blast
// and 0.6 of a base of the keg, blastLands' own test (core/actions/shoot.js
// modelsUnder), a big one's D3+1 as 3 (ownUnder's). Flat, as on the keg
// mission's board; (V3d; rule 10: it bumps with V3d) with height (the
// Powder Field's kegs stand among wrecks with decks), in 3D, each model's
// floor off the floor the keg's blast lands on, as blastLands measures it:
// a squad on a wreck's top over a keg is no longer feared as one beside it.
export function kegHits(v, k, at = v.pos, G = null) {
  const R = HAZARDS.keg.blast + v.t.base * 0.6
  let n = 0
  if (G?.nav.hasHeight) {
    const ky = floorAt(G, k.shape.x, k.shape.z)
    for (const m of v.models) {
      if (!m.alive) continue
      const x = at.x + m.ox, z = at.z + m.oz
      if (hypot3(x - k.shape.x, floorAt(G, x, z) - ky, z - k.shape.z) <= R) n++
    }
  } else for (const m of v.models) if (m.alive && hypot(at.x + m.ox - k.shape.x, at.z + m.oz - k.shape.z) <= R) n++
  return n && v.t.big ? 3 : n
}

// What `u` would lose to keg `k` going off with it standing at `at`: the
// points a template of the keg's profile due there takes (expected over
// the models it would catch, kegHits'), the fear term's (score's). ((V3d)
// `G`, for the test with height.)
export function kegFear(u, k, at, G = null) {
  const n = kegHits(u, k, at, G)
  return n ? expected(n, 1, HAZARDS.keg, u, false).value : 0
}

// What keg `k` going off is worth to `side`: the points it would take of
// the enemy less those of `side`'s own (each unit under it by expected, as
// ownUnder counts a template's), `mover` standing at `at` instead of where
// it is (a wrecker scoring where its walk through the keg ends).
export function kegValue(G, side, k, mover = null, at = null) {
  let v = 0
  for (const x of G.units) {
    if (!alive(x)) continue
    const n = kegHits(x, k, x === mover ? at : x.pos, G)
    if (!n) continue
    const e = expected(n, 1, HAZARDS.keg, x, inCover(G, x)).value
    v += x.side === side ? -e : e
  }
  return v
}

// What setting kegs off is worth to `u`'s artillery shooting at `e`: the
// kegs (of `kegs`, kegsOf's) a template of its weapon landing square on e
// would set off (terrain.js blastDamage, blast's own arithmetic: its damage
// there at least the keg's hit points left), each by kegValue. 0 for any
// other unit (only the guns weigh the keg in a shot: rule 10's modest
// term), and where no keg would go off.
export function kegGain(G, u, e, kegs = kegsOf(G)) {
  const w = u.t.ranged
  if (u.t.ai !== 'artillery' || !w?.blast || !kegs.length) return 0
  const y = G.nav.hasHeight ? floorAt(G, e.pos.x, e.pos.z) + 0.5 : 0.5
  let gain = 0
  for (const k of kegs) {
    const amount = G.terrain.blastDamage(k, e.pos.x, y, e.pos.z, w.blast, w.scenery || 1, !!w.corrodes)
    if (amount !== null && amount >= k.hp) gain += kegValue(G, u.side, k)
  }
  return gain
}

// What a wrecker's walk ending at `at` is worth by the kegs it smashes
// there: a walk's last sample is its end, so a keg within the smash's reach
// of it (smashAround's test: u.r and 0.8 of the keg's half-width) is
// smashed for sure, and goes off with u standing at `at`. (A keg on the
// way is left out: the nav's wreck mode pays double through soft ground,
// so its path goes round a lone keg rather than through it.) 0 for a unit
// that smashes nothing.
export function kegWalk(G, u, at, kegs) {
  if (!u.t.wrecker || !kegs.length) return 0
  let gain = 0
  for (const k of kegs) {
    const s = k.shape
    if (hypot(s.x - at.x, s.z - at.z) < u.r + Math.max(s.hx, s.hz) * 0.8) gain += kegValue(G, u.side, k, u, at)
  }
  return gain
}

// How much a unit fears a keg's blast at a place, a weight on the points it
// would lose there (the danger term's scale, between its fragile and
// robust weights); and how much a wrecker values a walk that sets one off
// (the brawlers' charge weight).
export const KEG_FEAR = 0.12, KEG_SMASH = 0.3

// Expected points of `e` removed by `u` shooting from `from`. (S1) `pre`,
// when given, is what bestSpot worked out about `e` once for its whole
// scan (its `cover`, (F18) its `fight` and its template's `own` cost: the
// same values, asked once).
//
// (F17; rule 10: it bumps with F17) The range is shotInfo's: rangeOf, the
// printed range but for a lobbed weapon with height, measured from the
// floor of the cell scored (`from`), so a gun weighs the deck it could
// climb to by the reach it would have there. Nothing here is bounded by a
// weapon's range (S0's boxes bound the move's plan, never the targets), so
// no bound needs the extra inches.
//
// (F18; rule 10: it bumps with F18) A target locked in combat is shot at
// as any other (shotInfo's rule), valued net of what the shot is expected
// to cost u's own side: a volley's strays into a fight (strayCost), a
// template's friends under it (ownUnder; a blast spell's too, the thorns
// erupting where the target stands). So a shot whose friendly fire
// outweighs its haul is worth less than nothing, and the AI never prefers
// to shell its own Brute. The gaze strikes its target alone.
//
// (F19a; rule 10: it bumps with F19a) The guns' template is also worth the
// powder kegs it would set off landing on `e` (kegGain), once a shot, on
// its hit: nothing where no keg stands.
export function shotValue(G, u, e, from, moved, pre = null) {
  const w = u.t.ranged
  if (!w) return 0
  const g = hypot(e.pos.x - from.x, e.pos.z - from.z) - u.r - e.r
  if (g > rangeOf(G, u, e, from)) return 0
  const s = sight(G, u, e, from, pre?.cover)
  if (!s.visible && !w.indirect && !w.mesmerize) return 0
  if (w.mesmerize) {
    if (!s.visible) return 0
    return p2D6(w.spell) * (worth(e) * 0.25 + Math.min(2, e.alive) * e.t.pts * 0.08 + (e.t.ranged?.blast ? 8 : 0))
  }
  let mod = 0
  if (w.heavy && moved) mod++
  if (w.indirect && !s.visible) mod++
  if (w.blast) {
    const pHit = w.spell ? p2D6(w.spell) : pD6(hitNeed(u.t.BS, mod))
    const under = e.t.big ? 3 : Math.max(1, Math.min(e.alive, Math.round(e.alive * Math.min(1, (w.blast * w.blast) / (e.r * e.r)) * 0.8)))
    const value = attackCount(u, w, false) * pHit * (expected(under, 1, w, e, s.cover).value - (pre ? pre.own : ownUnder(G, u, e)))
    const keg = pre ? pre.keg : kegGain(G, u, e)
    return keg ? value + pHit * keg : value
  }
  const n = attackCount(u, w, false), need = hitNeed(u.t.BS, mod)
  const fight = pre ? pre.fight : fightOf(G, u, e)
  return expected(n, need, w, e, s.cover).value - (fight ? strayCost(n, need, w, fight) : 0)
}

// The cells of the board within `reach` inches of (x, z), as rows and
// columns, a cell either side to spare: (S0, DESIGN §4.2.2) a plan of at
// most `reach` reaches no cell outside it (every finite cell of a reach lies
// within its `max` of the start, the path being no shorter than the
// straight line), so a scan over a plan's cells may skip the rest of the
// board, in the same order, and draw where it drew.
//
// (F7a's review) With height a ladder may carry a climber farther than it
// costs (nav.linkSave, the most any link does: a bastion's 0.75" and more),
// and a plan of `reach` takes at most floor(reach / nav.linkMin) links, so
// the box grows by that many savings: still every finite cell inside it,
// and still the whole board's scan. On a board with no such link it is the
// box it always was.
export function scanBox(nav, x, z, reach) {
  if (nav.hasHeight && nav.linkSave > 0) reach += nav.linkSave * Math.floor(reach / nav.linkMin)
  const span = reach + nav.cell
  return {
    x0: Math.max(0, Math.floor((x - span + nav.W / 2) / nav.cell)), x1: Math.min(nav.nx - 1, Math.floor((x + span + nav.W / 2) / nav.cell)),
    z0: Math.max(0, Math.floor((z - span + nav.H / 2) / nav.cell)), z1: Math.min(nav.nz - 1, Math.floor((z + span + nav.H / 2) / nav.cell)),
  }
}

// The best spot for `u` to end its move on `plan` (movePlan's): staying put
// is always an option, then every cell of a 1" or 1.5" lattice it may end
// on, each scored with a small random tie-break off the match's dice (the
// lattice scan and its draws are behaviour: DESIGN §4.1 rule 6). (S0) The
// lattice is walked only inside the plan's box (scanBox), on the board's
// own rows and columns: row iz a multiple of the step, its columns from
// its offset (1 on odd lattice rows) in steps, as the whole board's scan
// visited them.
export function bestSpot(G, u, plan, claimed) {
  const { nav } = G
  const enemies = enemiesOf(G, u)
  const friends = friendsOf(G, u)
  const owners = G.objectives.map((o) => controlOf(G, o))
  const role = u.t.ai
  // (S1, DESIGN §4.2.2) what the scan asks of each enemy at every cell, none
  // of which a cell changes, worked out once: whether it is in cover, and
  // the fight's value either way; (F18) and, for a unit that shoots, what a
  // shot at it would cost its own side (until F18 whether it was engaged,
  // which barred the shot): a volley's fight (fightOf), a template's friends
  // under it (ownUnder), each asked only of the weapon whose value reads it
  //
  // (F19a) and the kegs standing, whether an enemy could set one off, and
  // what a gun's template on each enemy would set off (kegGain)
  const w = u.t.ranged, shoots = !!w && role !== 'melee'
  const kegs = kegsOf(G)
  const pre = new Map(enemies.map((e) => [e, {
    cover: inCover(G, e), hit: meleeValue(u, e), back: meleeValue(e, u),
    fight: shoots && !w.blast && !w.mesmerize ? fightOf(G, u, e) : null, own: shoots && w.blast ? ownUnder(G, u, e) : 0,
    keg: shoots && w.blast ? kegGain(G, u, e, kegs) : 0,
  }]))
  const ctx = { enemies, friends, owners, claimed, role, pre, kegs, kegDanger: kegs.length > 0 && kegDanger(G, u.side) }
  // stay put is always an option
  let best = { cell: -1, score: score(G, u, u.pos.x, u.pos.z, ctx, false), dist: 0, ...ctx.last }
  const step = u.t.M > 8 ? 3 : 2 // sample on a 1" or 1.5" lattice
  const res = plan.res
  const box = scanBox(nav, res.sx, res.sz, plan.max)
  for (let iz = Math.ceil(box.z0 / step) * step; iz <= box.z1; iz += step) {
    const off = (iz / step) % 2 ? 1 : 0
    for (let ix = off + Math.max(0, Math.ceil((box.x0 - off) / step)) * step; ix <= box.x1; ix += step) {
      const i = iz * nav.nx + ix
      if (!isFinite(res.dist[i])) continue
      if (!validEnd(G, plan, i)) continue
      const x = nav.x(i), z = nav.z(i)
      const sc = score(G, u, x, z, ctx, true) + draw(G.rng) * 0.05
      if (sc > best.score) best = { cell: i, score: sc, dist: hypot(x - u.pos.x, z - u.pos.z), ...ctx.last }
    }
  }
  return best
}

// Where an engaged unit getting out of a fight falls back to, on `plan`
// (movePlan's, a fall back): the valid end farthest from the nearest enemy's
// base, over every other cell of the board (the even indices), the first
// found of the farthest; -1 for none. (S0) Only the cells inside the plan's
// box are visited (scanBox), in the board's order: none outside is a valid
// end.
export function fallbackSpot(G, u, plan) {
  let best = -1, bs = -Infinity
  const nav = G.nav, box = scanBox(nav, plan.res.sx, plan.res.sz, plan.max)
  for (let iz = box.z0; iz <= box.z1; iz++) {
    const row = iz * nav.nx
    for (let i = row + box.x0 + ((row + box.x0) % 2); i <= row + box.x1; i += 2) {
      if (!validEnd(G, plan, i)) continue
      const x = nav.x(i), z = nav.z(i)
      const s = Math.min(...enemiesOf(G, u).map((e) => hypot(e.pos.x - x, e.pos.z - z) - e.r))
      if (s > bs) {
        bs = s
        best = i
      }
    }
  }
  return best
}

// (F7a's review) The nearest of `enemies` from `from` by levelDist, measuring
// only those whose straight line, less any shortcut (levelSlack), could
// still beat the nearest so far: the same minimum, Infinity for none.
function nearestBy(G, from, enemies, climb) {
  const slack = levelSlack(G, climb)
  let best = Infinity
  for (const e of enemies) {
    if (hypot(e.pos.x - from.x, e.pos.z - from.z) - slack >= best) continue
    const d = levelDist(G, from, e.pos, climb)
    if (d < best) best = d
  }
  return best
}

// How good (x, z) is for `u`, by its role. Leaves what it found in ctx.last:
// whether the spot is on an objective (and which), and whether u could
// shoot from it.
//
// (F7a, DESIGN §4.2.4's AI; rule 10: it bumps with F7a) With height the
// objective and approach terms measure the way there for a walker
// (levelDist: up the stairs, or the ladders for a climber, rather than
// through the wall; a flier's is the straight line it flies), and
// shooters and artillery like raised ground: +0.25 an inch of floor, up to
// 4". What climbing costs reaches the score through the plan's distances
// (validEnd's), already paid for. (The review's tuning, DESIGN §4.2.9's
// play-report: the AI met its F7a row only with the units deployed onto
// the works counted) The charge term and the brawlers' danger measure their
// ways so too, each walker's by levelDist: a deck's defenders are as far
// from a brawler at the wall's foot as its stairs make them, both ways.
//
// (F19a; rule 10: it bumps with F19a) A powder keg: standing in its blast is
// feared as a template of its profile due there (KEG_FEAR of the points it
// would take) while any enemy could set it off; and a wrecker's walk that
// smashes one is worth what the keg then takes of the enemy less its own
// (KEG_SMASH of it). Both skipped where no keg stands.
export function score(G, u, x, z, ctx, moving) {
  const { enemies, friends, owners, claimed, role, pre, kegs } = ctx
  const t = u.t
  const from = { x, z }
  // (the review) the way up is a walker's: a flier's move is a circle that
  // ignores the terrain (nav.reach's fly mode), so it measures the straight
  // line, as on the flat
  const high = G.nav.hasHeight, climb = high && climbs(u), walks = high && moveMode(u) !== 'fly'
  const moved = moving && hypot(x - u.pos.x, z - u.pos.z) > 0.3
  let s = 0
  let onObjective = false, obj = -1
  // objectives — troops lean on them hardest
  if (t.OC > 0) {
    const pull = role === 'line' || role === 'shooter' ? 5 : role === 'melee' ? 2 : 2.5
    let bestObj = 0
    for (const o of G.objectives) {
      // (with height: an objective the straight line, less any shortcut,
      // puts 18.6" off or more is worth nothing by the way too: v is 0)
      if (walks && hypot(o.x - x, o.z - z) - levelSlack(G, climb) >= 18.6) continue
      const d = walks ? levelDist(G, from, o, climb) : hypot(o.x - x, o.z - z)
      const want = owners[o.i] === u.side ? 0.45 : 1
      const taken = claimed.has(o.i) ? 0.25 : 1
      let v
      if (d <= 2.6) v = pull * want * taken * 1.4
      else v = pull * want * taken * Math.max(0, 1 - (d - 2.6) / 16) * 0.7
      if (v > bestObj) {
        bestObj = v
        if (d <= 2.6) {
          onObjective = true
          obj = o.i
        } else if (!onObjective) obj = -1
      }
    }
    s += bestObj
  }
  // shooting from here
  let canShoot = false
  if (t.ranged && role !== 'melee') {
    let best = 0
    for (const e of enemies) {
      const v = shotValue(G, u, e, from, moved, pre.get(e))
      if (v > best) best = v
    }
    if (best > 0) canShoot = true
    const w = role === 'artillery' ? 0.25 : role === 'hero' ? 0.12 : 0.18
    // an Advance would forfeit the shot unless the weapon is Assault
    s += best * w * (u.flags.advanced && !t.ranged.assault ? 0 : 1)
  }
  // charging from here
  if (role === 'melee' || role === 'line' || role === 'raider' || role === 'hero') {
    let best = 0
    for (const e of enemies) {
      // (F7a's review, the play-report's tuning) with height a charge walks
      // to its spot, up the stairs (or a ladder) to a defender on a deck
      // (an enemy the straight line puts out of reach by more than any
      // shortcut, levelSlack, is out of it by the way too: not measured)
      if (walks && hypot(e.pos.x - x, e.pos.z - z) - u.r - e.r - levelSlack(G, climb) > CHARGE_RANGE) continue
      const g = (walks ? levelDist(G, from, e.pos, climb) : hypot(e.pos.x - x, e.pos.z - z)) - u.r - e.r
      if (g > CHARGE_RANGE) continue
      const p = g <= 1 ? 1 : p2D6(Math.ceil(g))
      const back = pre.get(e).back * 0.4
      const v = p * (pre.get(e).hit - back + (e.t.role === 'Artillery' ? 10 : 0))
      if (v > best) best = v
    }
    const w = role === 'melee' ? 0.3 : role === 'raider' ? 0.18 : role === 'hero' ? 0.06 : 0.15
    s += best * w
    // far from everything: just close the distance
    if (best === 0 && role !== 'hero') {
      const near = walks ? nearestBy(G, from, enemies, climb) : Math.min(...enemies.map((e) => hypot(e.pos.x - x, e.pos.z - z)))
      s -= near * (role === 'melee' ? 0.12 : 0.05)
    }
  }
  // danger: enemy brawlers who could reach here next turn, guns that can see us
  const fragile = role === 'shooter' || role === 'artillery' || role === 'hero'
  for (const e of enemies) {
    // (F7a's review, the play-report's tuning) with height an enemy walker
    // comes by its own way here: a brawler at a wall's foot is as far from
    // its top as the stairs (or, climbing, a ladder) make it (only a
    // brawler the straight line, less levelSlack, leaves within reach is
    // measured: the rest add nothing either way)
    if (high && !(e.t.brawler && hypot(e.pos.x - x, e.pos.z - z) - u.r - e.r - (moveMode(e) !== 'fly' ? levelSlack(G, climbs(e)) : 0) < e.t.M + 7)) continue
    const g = (high && moveMode(e) !== 'fly' ? levelDist(G, e.pos, from, climbs(e)) : hypot(e.pos.x - x, e.pos.z - z)) - u.r - e.r
    if (e.t.brawler && g < e.t.M + 7) s -= pre.get(e).back * (fragile ? 0.16 : 0.05) * (1 - g / (e.t.M + 7))
  }
  // cover and staying put
  const ci = G.nav.index(x, z)
  if (ci >= 0 && G.nav.cover[ci]) s += fragile ? 1.5 : 0.5
  if (role === 'artillery' && moved) s -= 2.5
  // (F7a) the high ground, for the guns
  if (high && (role === 'shooter' || role === 'artillery')) s += 0.25 * Math.min(4, floorAt(G, x, z))
  // heroes like company
  if (role === 'hero') {
    let n = 0
    for (const f of friends) if (hypot(f.pos.x - x, f.pos.z - z) <= AURA + f.r) n++
    s += Math.min(3, n) * 0.9
    const front = Math.min(...enemies.map((e) => hypot(e.pos.x - x, e.pos.z - z)))
    if (front < 8) s -= (8 - front) * 0.6
  }
  // don't bunch up for the blast templates
  for (const f of friends) {
    const g = hypot(f.pos.x - x, f.pos.z - z) - f.r - u.r
    if (g < 1.5) s -= (1.5 - g) * 0.6
  }
  // (F19a) a powder keg's blast, and a wrecker's walk through a keg
  if (kegs.length) {
    if (ctx.kegDanger) for (const k of kegs) s -= kegFear(u, k, from, G) * KEG_FEAR
    if (moved) s += kegWalk(G, u, from, kegs) * KEG_SMASH
  }
  ctx.last = { onObjective, obj, canShoot }
  return s
}
