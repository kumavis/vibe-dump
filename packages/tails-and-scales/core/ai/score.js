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
import { CHARGE_RANGE, OBJECTIVE_RANGE, AURA, expected, p2D6, pD6, hitNeed, attackCount, saveNeed } from '../rules.js'
import { draw } from '../rng.js'
import { hypot, hypot3 } from '../dmath.js'
import { alive, enemiesOf, friendsOf, inCover, sight, controlOf, validEnd, levelDist, levelSlack, floorAt, rangeOf, fightOf, gap, isEngaged, canCharge, hullOf, deckPoint, deckEye } from '../queries.js'
import { climbs, moveMode, latticeMode } from '../actions/move.js'
import { clearOf } from '../footprint.js'
import { friendsUnder } from '../actions/shoot.js'
import { inFootprint } from '../actions/settle.js'
import { HAZARDS } from '../../data/hazards.js'
import { MISSIONS } from '../../data/mission.js'
import { wallOf, sideRole, routeFields, routeDist, faceGrid, gateOf, ramsAt, nearField, HOLD, HOLD_Y } from './route.js'
import { postsOf, faceDist } from '../terrain/breakthrough.js'
import { STEP } from '../nav.js'

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
// on a hit. A scatter's cost is the policy's (aiShoot's own lads). ((V3c)
// `w`: the weapon, a caster's spell; its ranged weapon by default)
export function ownUnder(G, u, e, w = u.t.ranged) {
  let cost = 0
  for (const { v, under } of friendsUnder(G, u, e, w)) cost += expected(v.t.big ? 3 : under, 1, w, v, inCover(G, v)).value
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
// it is (a wrecker scoring where its walk through the keg ends). (F9a) A
// rider is never under a blast (blastLands'): its hull is.
export function kegValue(G, side, k, mover = null, at = null) {
  let v = 0
  for (const x of G.units) {
    if (!alive(x) || x.aboard) continue
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

// ── (F7c) The timber platforms ──────────────────────────────────────────────
// What the AI makes of a timber platform's posts (rule 10: it bumps with
// F7c), in one term, skipped where no platform stands manned (every board
// but a fortified one, and every fortified one whose platforms stand empty,
// so those battles score as they did, to the bit): a template is also
// worth the platforms it would help shoot out from under their defenders.
// A post with defenders above it is a target worth its wounds: the D3
// mortal wounds each unit on the deck takes as it falls (core/actions/
// settle.js), the enemy's gained and u's own side's lost, as kegValue
// weighs a keg's blast. No draw, and no field is built.

// The decks that can fall standing manned: { d, on }, each alive deck with
// a `fallsAt` (a platform's: the barn's hayloft has none) and the units on
// the table whose centres lie inside its footprint (settle's own test), in
// chunk order; none without height
export function platformsOf(G) {
  if (!G.nav.hasHeight) return []
  const out = []
  for (const d of G.terrain.chunks) {
    if (!d.alive || d.kind !== 'deck' || d.fallsAt === undefined) continue
    const on = G.units.filter((x) => alive(x) && !x.aboard && inFootprint(d.shape, x.pos))
    if (on.length) out.push({ d, on })
  }
  return out
}

// What a fall is worth: the D3's mean in wounds (FALL_WOUNDS, no save, one
// damage each), as expected() counts kills and their points; and the share
// of a deck's fall a template that only chips its posts is credited with
// (FALL_CHIP: the next template has to finish the work)
export const FALL_WOUNDS = 2, FALL_CHIP = 0.5
const fallValue = (x) => Math.min(x.alive, FALL_WOUNDS / x.t.W) * x.t.pts

// What `u`'s template `w` landing square on `e` is worth by the manned
// platforms (of `plats`, platformsOf's) it would help bring down: for each,
// its posts still standing chipped as blast chips them (terrain.js
// blastDamage, measured from e's floor as the landing is), each by the
// share of its hit points the blow takes (at most all), the `need` best of
// them (the posts still to fall before the deck does: fallsAt less those
// down) summed and shared by `need`; a deck the template alone brings down
// is worth its whole fall, one it only chips FALL_CHIP of that share of
// it. A fall's worth is its defenders' (fallValue), each of the enemy's
// gained and each of u's own side's lost. 0 for a template of scenery 0
// (Venom Mist's wrecks nothing), and where no platform stands manned.
export function fallGain(G, u, e, w = u.t.ranged, plats = platformsOf(G)) {
  if (!plats.length || !w?.blast || w.scenery === 0) return 0
  const T = G.terrain, y = floorAt(G, e.pos.x, e.pos.z) + 0.5
  let gain = 0
  for (const { d, on } of plats) {
    let down = 0
    const chip = []
    for (const id of d.supports) {
      const p = T.byId(id)
      if (!p.alive) {
        down++
        continue
      }
      const amount = T.blastDamage(p, e.pos.x, y, e.pos.z, w.blast, w.scenery || 1, !!w.corrodes)
      chip.push(amount === null ? 0 : Math.min(1, amount / p.hp))
    }
    const need = d.fallsAt - down
    chip.sort((a, b) => b - a)
    let k = 0
    for (let j = 0; j < need && j < chip.length; j++) k += chip[j]
    if (!(need > 0 && k > 0)) continue
    let v = 0
    for (const x of on) v += x.side === u.side ? -fallValue(x) : fallValue(x)
    gain += k >= need ? v : v * (k / need) * FALL_CHIP
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
//
// (F7c; rule 10: it bumps with F7c) And every template (a blast spell's
// too) is worth the manned timber platforms it would help shoot out from
// under their defenders (fallGain), once a shot, on its hit: nothing where
// no platform stands manned.
//
// (V3c; rule 10: it bumps with V3c) `w`: the weapon, a caster's spell that
// strikes as one (an eruption, the gaze: spellValue's), its ranged weapon
// by default; `pre` is only ever its ranged weapon's.
//
// (F9c, DESIGN §4.2.5's firing deck; rule 10: it bumps with F9c) `deck`,
// for a rider weighing a shot from its hull's deck as shotInfo judges it
// ({ v, eye }: its hull and its deck eye, `from` the hull's deckPoint;
// riderShot below): the gap from the hull's nearest edge (the rules' own,
// gap(v, e): where the hull stands is no hypothetical cell), the reach
// from the deck point, the sight at the deck eye. Given only by bestShot
// and spellValue for a unit aboard; never by the cell scan (score) or
// bestLanding, which weigh a cell a rider would stand on, from the ground.
// (F9b) shotValue's gap when either is a long hull: from `from`, the
// shooter's body disc (a long hull's base) to the target's nearest disc
function hullGap(u, e, from) {
  const r = u.t.fp ? u.t.base : u.r
  return e.t.fp ? clearOf(e, from.x, from.z, r) : hypot(e.pos.x - from.x, e.pos.z - from.z) - r - e.r
}
export function shotValue(G, u, e, from, moved, pre = null, w = u.t.ranged, deck = null) {
  if (!w) return 0
  // ((F9b, rule 10) a long hull shooting measures from its body disc, never
  // its bounding R (which would claim shots the rules refuse); a long hull
  // target from its nearest disc; (F9c) a rider from its hull's edge)
  const g = deck ? gap(deck.v, e) : u.t.fp || e.t.fp ? hullGap(u, e, from) : hypot(e.pos.x - from.x, e.pos.z - from.z) - u.r - e.r
  if (g > (w === u.t.ranged ? rangeOf(G, u, e, from) : w.range)) return 0
  const s = deck ? sight(G, u, e, from, pre?.cover, deck.eye) : sight(G, u, e, from, pre?.cover)
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
    const value = attackCount(u, w, false) * pHit * (expected(under, 1, w, e, s.cover).value - (pre ? pre.own : ownUnder(G, u, e, w)))
    const keg = pre ? pre.keg : kegGain(G, u, e)
    // ((F7c) keg + 0 is keg to the bit, so a board with no manned platform
    // scores as it did)
    const more = keg + (pre ? pre.fall : fallGain(G, u, e, w))
    return more ? value + pHit * more : value
  }
  const n = attackCount(u, w, false), need = hitNeed(u.t.BS, mod)
  const fight = pre ? pre.fight : fightOf(G, u, e)
  return expected(n, need, w, e, s.cover).value - (fight ? strayCost(n, need, w, fight) : 0)
}

// ── (V3c) The casters' spells ───────────────────────────────────────────────
// What a caster's spell `sp` cast on `e` from where it stands is worth to
// the AI (rule 10: it bumps with V3c), each by the cast's odds (p2D6): an
// eruption (Thornburst, Venom Mist) and the gaze (Mesmerize) as shotValue
// values them, struck where the caster stands; a snare (Root Snare) by the
// charge it denies and the ground it keeps the target from (snareGain); a
// ward (Barkskin) by the saves it adds to a friend in danger (wardGain ×
// its points × exposure); a resolve (Cold Blood) by the charge roll it may
// give again and the nerve it keeps (resolveGain). A mark already on its
// target is worth nothing. Pure, no draw: the policy's choice of spell and
// target (core/ai/policy.js bestCast), and the shooting tool's default.
export function spellValue(G, u, sp, e, moved = !!u.flags.moved) {
  const w = u.t.spells[sp]
  const p = p2D6(w.spell)
  if (w.ward) return e.warded ? 0 : p * worth(e) * exposure(G, e) * wardGain(e)
  if (w.resolve) return e.resolute ? 0 : p * resolveGain(G, e)
  if (w.snare) return e.snared ? 0 : p * snareGain(G, u, e)
  // ((F9c) a caster aboard casts from its hull's deck)
  if (u.aboard) return riderShot(G, u, e, moved, w)
  return shotValue(G, u, e, u.pos, moved, null, w)
}

// (F9c, rule 10) What rider `u`'s shot (or strike of a spell, `w`) at `e`
// from its hull's deck is worth: shotValue from the hull's deck point, with
// the hull's edge and the rider's deck eye, as moved if it or its hull
// moved. bestShot's and spellValue's, for a unit aboard alone.
export function riderShot(G, u, e, moved = !!u.flags.moved, w = u.t.ranged) {
  const v = hullOf(G, u)
  return shotValue(G, u, e, deckPoint(v), moved || !!v.flags.moved, null, w, { v, eye: deckEye(G, u) })
}

// How much of `f` is in danger before its side's next turn, as a share of
// its points: locked in a fight 0.35, an enemy brawler free to charge it
// within its move and an average charge 0.3, an enemy gun in range 0.2,
// else 0.05.
export function exposure(G, f) {
  if (isEngaged(G, f)) return 0.35
  let x = 0.05
  for (const e of enemiesOf(G, f)) {
    const g = gap(e, f)
    if (e.t.brawler && !e.t.noCharge && !e.snared && g < e.t.M + 7) return 0.3
    if (e.t.ranged && g <= e.t.ranged.range) x = 0.2
  }
  return x
}

// The share of the wounds `f` fails to save that a ward saves (its save one
// better, against an AP 1 blow in the open): 1/3 for a 3+ save, 1/6 for
// none.
export function wardGain(f) {
  const fail = (sv) => 1 - pD6(saveNeed(sv, 1, false))
  const f0 = fail(f.t.Sv), f1 = fail(f.t.Sv - 1)
  return f0 > 0 ? (f0 - f1) / f0 : 0
}

// What a resolve gives `f`: a charge it may still make this turn rolled
// again on a miss (the best of its targets within 12", p(1 − p) more of
// reaching it, by the straight gap, worth its fight as the charge term
// values one), and the nerve of a squad that may lose models before its
// side's next turn.
export function resolveGain(G, f) {
  let v = 0
  if (canCharge(G, f)) {
    for (const e of enemiesOf(G, f)) {
      const g = gap(f, e)
      if (g > CHARGE_RANGE) continue
      const p = g <= 1 ? 1 : p2D6(Math.ceil(g))
      const gain = p * (1 - p) * (meleeValue(f, e) + (e.t.role === 'Artillery' ? 10 : 0))
      if (gain > v) v = gain
    }
  }
  if (f.t.models > 1 && f.alive > 1) v += worth(f) * exposure(G, f) * 0.3
  return v
}

// What a snare on `e` denies `u`'s side: for a brawler free to charge, half
// the worst its charge could do to one of u's units within its move and a
// charge; and the ground it can't take, a share of its points (little for
// a unit that never charges, which rarely moves).
export function snareGain(G, u, e) {
  let deny = 0
  if (e.t.brawler && !e.t.noCharge && !isEngaged(G, e)) {
    for (const f of G.units) {
      if (f.side !== u.side || !alive(f) || gap(e, f) > e.t.M + CHARGE_RANGE) continue
      const v = meleeValue(e, f)
      if (v > deny) deny = v
    }
  }
  return deny * 0.5 + worth(e) * (e.t.noCharge ? 0.02 : 0.08)
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
//
// (F9a) `role`: the role the unit plays as, its own but for a hull's
// (core/ai/policy.js hullRole: a raider while brawlers ride it, else a line
// unit). (Friends never count riders: friendsOf leaves them out, so a hull
// isn't pushed off by its own.)
//
// (F9b, DESIGN §4.2.5's AI; rule 10: it bumps with F9b) A long hull scans
// its lattice by cell (plan.cells, the least distance at any heading), a
// cell passing when it has a valid end at some heading (validEnd's null
// heading), each such cell its one tie-break draw (§4.1 rule 25), scored
// at the body's centre. The room term: a long hull ending, or staying,
// where it could pivot neither way (nav.hullRoom on its terrain alone:
// the memo's bits) scores ROOM less, at the cell's best heading (cellBest's,
// the move's default where it is a valid end) or, staying put, where it
// stands and faces, so it keeps out of the pockets it couldn't leave.
//
// (F9b, DESIGN §4.2.2's AI count budget; rule 10: it bumps with F9b) On a
// mission with `ai` (Grand and the Powder Field), the lattice's step is
// its `lattice` cells at least, the unit's own step where that is coarser.
export const ROOM = 1.5
export function bestSpot(G, u, plan, claimed, role = u.t.ai) {
  const { nav } = G
  const ctx = scoring(G, u, claimed, role)
  const fp = plan.fp, roomOf = fp ? (c, h) => (nav.hullRoom(c, h, fp, latticeMode(plan.mode)) ? 0 : -ROOM) : null
  // stay put is always an option
  let best = { cell: -1, score: score(G, u, u.pos.x, u.pos.z, ctx, false) + (fp ? roomOf(nav.index(u.pos.x, u.pos.z), u.facing) : 0), dist: 0, ...ctx.last }
  const B = budgetOf(G)
  const step = B ? Math.max(B.lattice, u.t.M > 8 ? 3 : 2) : u.t.M > 8 ? 3 : 2 // sample on a 1" or 1.5" lattice
  const res = fp ? plan.cells : plan.res
  const box = scanBox(nav, plan.res.sx, plan.res.sz, plan.max)
  for (let iz = Math.ceil(box.z0 / step) * step; iz <= box.z1; iz += step) {
    const off = (iz / step) % 2 ? 1 : 0
    for (let ix = off + Math.max(0, Math.ceil((box.x0 - off) / step)) * step; ix <= box.x1; ix += step) {
      const i = iz * nav.nx + ix
      if (!isFinite(res.dist[i])) continue
      if (!validEnd(G, plan, i)) continue
      const x = nav.x(i), z = nav.z(i)
      const sc = fp ? score(G, u, x, z, ctx, true) + roomOf(i, res.h[i]) + draw(G.rng) * 0.05 : score(G, u, x, z, ctx, true) + draw(G.rng) * 0.05
      if (sc > best.score) best = { cell: i, score: sc, dist: hypot(x - u.pos.x, z - u.pos.z), ...ctx.last }
    }
  }
  // ((Breakthrough) an attacker on a wall's board also weighs its route's
  // waypoints, after the lattice and drawing nothing: wallWaypoints)
  if (ctx.bt?.atk && ctx.bt.f && !fp) {
    for (const i of wallWaypoints(G, plan, ctx.bt.f, box)) {
      const x = nav.x(i), z = nav.z(i)
      const sc = score(G, u, x, z, ctx, true)
      if (sc > best.score) best = { cell: i, score: sc, dist: hypot(x - u.pos.x, z - u.pos.z), ...ctx.last }
    }
  }
  return best
}

// (Breakthrough) The cells of `plan` (a round unit's move plan) an
// attacker's lattice may miss on its way: for each objective, the valid end
// its route field puts nearest it (the first in the board's order of
// equals), so a climber can step onto a ladder's foot (a single cell, and
// the ladder costs 4 tails of a 5-tail move from it) or its top, and a
// wrecker up to the gate, though no lattice point falls there. In
// objective order, each once.
function wallWaypoints(G, plan, f, box) {
  const nav = G.nav, res = plan.res, out = []
  for (const d of f) {
    let best = -1, bd = Infinity
    const order = []
    for (let iz = box.z0; iz <= box.z1; iz++) for (let i = iz * nav.nx + box.x0; i <= iz * nav.nx + box.x1; i++) {
      if (!isFinite(res.dist[i]) || !(d[i] < Infinity)) continue
      order.push(i)
    }
    order.sort((a, b) => d[a] - d[b] || a - b)
    for (const i of order) {
      if (!(d[i] < bd)) break
      if (!validEnd(G, plan, i)) continue
      best = i
      bd = d[i]
      break
    }
    if (best >= 0 && !out.includes(best)) out.push(best)
  }
  return out
}

// What score asks of the match for `u`, worked out once for a whole scan:
// its enemies and friends (riders left out), who holds each objective, and
// (S1, DESIGN §4.2.2) what the scan asks of each enemy at every cell, none
// of which a cell changes, worked out once: whether it is in cover, and
// the fight's value either way; (F18) and, for a unit that shoots, what a
// shot at it would cost its own side (until F18 whether it was engaged,
// which barred the shot): a volley's fight (fightOf), a template's friends
// under it (ownUnder), each asked only of the weapon whose value reads it
//
// (F19a) and the kegs standing, whether an enemy could set one off, and
// what a gun's template on each enemy would set off (kegGain); (F7c) and
// what a template on each would do to the manned platforms (fallGain).
// (F9a) `role`
// is the role the unit plays as (bestSpot's: a hull's by its riders).
// ((F9b) On a mission with an AI count budget, only its `targets` nearest
// enemies: nearestOf.)
function scoring(G, u, claimed, role) {
  const B = budgetOf(G)
  const enemies = B ? nearestOf(G, u, enemiesOf(G, u), B.targets) : enemiesOf(G, u)
  const friends = friendsOf(G, u)
  const owners = G.objectives.map((o) => controlOf(G, o))
  const w = u.t.ranged, shoots = !!w && role !== 'melee'
  const kegs = kegsOf(G)
  const plats = shoots && w.blast ? platformsOf(G) : []
  const pre = new Map(enemies.map((e) => [e, {
    cover: inCover(G, e), hit: meleeValue(u, e), back: meleeValue(e, u),
    fight: shoots && !w.blast && !w.mesmerize ? fightOf(G, u, e) : null, own: shoots && w.blast ? ownUnder(G, u, e) : 0,
    keg: shoots && w.blast ? kegGain(G, u, e, kegs) : 0,
    fall: plats.length ? fallGain(G, u, e, w, plats) : 0,
  }]))
  // ((Breakthrough) the wall's terms: null on every board without one)
  const wall = wallOf(G)
  const bt = wall ? wallTerms(G, u, wall, enemies, owners) : null
  return { enemies, friends, owners, claimed, role, pre, kegs, kegDanger: kegs.length > 0 && kegDanger(G, u.side), bt }
}

// (F9b) A mission's AI count budget (DESIGN §4.2.2: `ai`, { lattice,
// targets }, rules data that RULES_ID hashes with the mission), or null
export const budgetOf = (G) => MISSIONS[G.setup.mission ?? 'classic']?.ai ?? null

// (F9b) The `k` of `enemies` nearest `u` by gap (the rules' edge gap: a
// long hull's nearest disc, fpGap), ties to the earlier in the list (G.units
// order, as enemiesOf gives them), kept in the list's order; the list
// itself when it holds k or fewer. No draw.
export function nearestOf(G, u, enemies, k) {
  if (enemies.length <= k) return enemies
  const by = enemies.map((e, i) => ({ g: gap(u, e), i }))
  by.sort((a, b) => a.g - b.g || a.i - b.i)
  const keep = new Set(by.slice(0, k).map((x) => x.i))
  return enemies.filter((e, i) => keep.has(i))
}

// (F9a) Where rider `u` steps off to, of `cells` (its landing cells, in
// index order: core/actions/transport.js landing): the one it scores best
// on as a mover of its own role, ties to the lowest index, with no draw (the
// AI chooses only whether it steps off by the rules of core/ai/policy.js's
// transports; this is where). -1 for none.
export function bestLanding(G, u, cells, claimed) {
  const ctx = scoring(G, u, claimed, u.t.ai)
  let best = -1, bs = -Infinity
  for (const i of cells) {
    const sc = score(G, u, G.nav.x(i), G.nav.z(i), ctx, true)
    if (sc > bs) {
      bs = sc
      best = i
    }
  }
  return best
}

// Where an engaged unit getting out of a fight falls back to, on `plan`
// (movePlan's, a fall back): the valid end farthest from the nearest enemy's
// base, over every other cell of the board (the even indices), the first
// found of the farthest; -1 for none. (S0) Only the cells inside the plan's
// box are visited (scanBox), in the board's order: none outside is a valid
// end. ((Breakthrough) On a wall's board a defender's cells in front of the
// wall's face are passed over: it falls back behind the line or not at all.)
export function fallbackSpot(G, u, plan) {
  let best = -1, bs = -Infinity
  const nav = G.nav, box = scanBox(nav, plan.res.sx, plan.res.sz, plan.max)
  // ((Breakthrough) a defender behind a wall never falls back in front of
  // its face)
  const wall = wallOf(G), face = wall && sideRole(G, u) === 'defend' ? faceGrid(G, wall) : null
  for (let iz = box.z0; iz <= box.z1; iz++) {
    const row = iz * nav.nx
    for (let i = row + box.x0 + ((row + box.x0) % 2); i <= row + box.x1; i += 2) {
      if (face && face[i] < 0) continue
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
    // ((Breakthrough) on a wall's board, the wall's own objective term)
    if (ctx.bt) [bestObj, onObjective, obj] = wallObjective(G, u, x, z, ctx, pull, walks, climb)
    else for (const o of G.objectives) {
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
      let g = (walks ? levelDist(G, from, e.pos, climb) : hypot(e.pos.x - x, e.pos.z - z)) - u.r - e.r
      // ((Breakthrough) an attacker's way to a defender across the wall is
      // no shorter than its route fields say: wallGap)
      if (ctx.bt?.atk) g = Math.max(g, wallGap(G, ctx.bt, u, e, x, z))
      if (g > CHARGE_RANGE) continue
      const p = g <= 1 ? 1 : p2D6(Math.ceil(g))
      const back = pre.get(e).back * 0.4
      let v = p * (pre.get(e).hit - back + (e.t.role === 'Artillery' ? 10 : 0))
      // ((Breakthrough) a defender's charge at an attacker holding an
      // objective contests it: wallDeny)
      if (ctx.bt && !ctx.bt.atk) v += p * wallDeny(G, ctx.bt, e)
      if (v > best) best = v
    }
    const w = role === 'melee' ? 0.3 : role === 'raider' ? 0.18 : role === 'hero' ? 0.06 : 0.15
    s += best * w
    // far from everything: just close the distance
    // ((Breakthrough) on a wall's board, by the wall's way: wallNear)
    if (best === 0 && role !== 'hero') {
      const near = ctx.bt ? wallNear(G, u, x, z, ctx, walks, climb) : walks ? nearestBy(G, from, enemies, climb) : Math.min(...enemies.map((e) => hypot(e.pos.x - x, e.pos.z - z)))
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
  // ((F9b, rule 10: the play-report's tuning) a long hull measures its own
  // side of the gap by its body disc, t.base, as its range terms do (Q13),
  // never its bounding R: read by R, every cell within 4.5" of a friend's
  // centre cost it (its 2.5"-wide body taken for a 6" disc), and the
  // Howdahs stayed behind their own lines, moving in 87-91% of their
  // movement phases (play-report's F9b row: 41 of 47 on four Field and
  // Grand AI pairs, 706 of 774 on its 64-battle sweep), where DESIGN
  // §4.2.9 asks 90%; by the body disc 94% on that sweep (713 of 760))
  for (const f of friends) {
    const g = t.fp ? hypot(f.pos.x - x, f.pos.z - z) - f.r - t.base : hypot(f.pos.x - x, f.pos.z - z) - f.r - u.r
    if (g < 1.5) s -= (1.5 - g) * 0.6
  }
  // (F19a) a powder keg's blast, and a wrecker's walk through a keg
  if (kegs.length) {
    if (ctx.kegDanger) for (const k of kegs) s -= kegFear(u, k, from, G) * KEG_FEAR
    if (moved) s += kegWalk(G, u, from, kegs) * KEG_SMASH
  }
  // ((Breakthrough) the wall: the ram, and the line held; (S5c) and
  // whether this spot is the post held, for wallRush)
  ctx.held = false
  if (ctx.bt) s += wallScore(G, u, x, z, ctx, moved, canShoot, ci)
  ctx.last = ctx.held ? { onObjective, obj, canShoot, held: true } : { onObjective, obj, canShoot }
  return s
}

// ── (Breakthrough) The wall ─────────────────────────────────────────────────
// What the AI makes of a walled line (DESIGN §4.2.12's AI), on a mission with
// roles whose board has a plan (core/ai/route.js wallOf: the March Wall's),
// in terms each skipped on every other board (scoring's `bt` is null there,
// and score, bestSpot's draws and every other term are as they were, to the
// bit). Keyed on the mission's roles and the board's plan, never on a
// mission's, set's, race's or unit's name.
//   - The attacker: its objective term (wallObjective) and its "close the
//     distance" (wallNear) measure the walking way to each objective by its
//     route field (route.js), never the straight line, and pull from across
//     the table (ROUTE_REACH), so a unit walks to the ladders, the gate,
//     the breach or the wood its class may take, whichever is shortest for
//     it; and a wrecker's walk that ends ramming the gate is worth RAM_BLOW
//     (wallScore), so it rams on move after move until the gate falls.
//   - The defender: ground in front of the wall's outer face costs
//     FRONT_COST (wallScore: a unit never ends a move out there by choice);
//     an objective the attacker holds pulls DENY times (wallObjective) and
//     one an attacker stands within THREAT of as if unheld, so the line
//     contests what is taken; a shooter on the works with a target is worth
//     WALL_HOLD more there; and its "close the distance" (wallNear) goes to
//     the attackers across the face when any stand there (the reserves'
//     countercharge), else to its post in the yard, or the second line's
//     once the attacker holds the yard's objective.
// None draws, and nothing is built but the route fields' cache (derived).
// The weights, each measured over 80 AI battles (boards 1-20, every cell)
// against the attacker scoring by round 4, unless it says otherwise:
// PROGRESS 0.25 scored 16%, 0.4 38%; with THIN, 0.4 / 0.6 / 1 scored 38% /
// 36% / 44%, 1 doubling the attackers standing still at the face, so 0.4;
// THIN (the thinner held objective pulls more) at PROGRESS 0.25 31%
// against 16% without; DENY and
// DENY_GAIN over 60 battles (boards 1-15): the defender's OC up where it
// could contest in 4 of 39 cases with neither, 8 of 42 at 1.6 and 15, 12
// of 53 at 3, 19 of 64 at 5 and 40, so those; ROUTE_REACH, RAM_BLOW (8
// raised the gate's fall from 20% to 52% of battles and scored no more),
// FRONT_COST, THREAT and WALL_HOLD chosen, not tuned. (S5b: those are
// S3's measurements on S3's record; the gate's fall and the ram's way on
// the final one are route.js RAM_STEP's.)
export const ROUTE_REACH = 40, RAM_BLOW = 3, FRONT_COST = 30, DENY = 5, THREAT = 12, WALL_HOLD = 1, PROGRESS = 0.4, THIN = 6, DENY_GAIN = 40
// (S5c) What staying on a post held is worth to a defender (holdOf, which
// says when it holds one): measured below in DESIGN §4.2.12's As built (S5c)
export const HOLD_POST = 8

// What the wall's terms read of the match for `u`'s scan, once: for the
// attacker its route fields and, for a wrecker, the gate standing; for the
// defender the face's grid, the attackers across it, how each objective is
// threatened (2 the attacker holds it, 1 an attacker within THREAT of it, 0
// neither) and its post (the nearest of the yard's, or the second line's
// once the yard is lost: the attacker holding the objective nearest the
// gate)
export function wallTerms(G, u, wall, enemies, owners) {
  if (sideRole(G, u) === 'attack') {
    const f = routeFields(G, u, wall), nav = G.nav
    // (each enemy's route distances, for wallGap: contactOf)
    const at = f ? new Map(enemies.map((e) => [e, contactOf(G, f, u, e)])) : null
    // (the defenders' OC standing on each objective, a squad's by its
    // models left: the thinner held, the more it pulls)
    const held = G.objectives.map((o) => {
      let c = 0
      for (const e of enemies) if (hypot(e.pos.x - o.x, e.pos.z - o.z) <= OBJECTIVE_RANGE + e.r) c += (e.t.OC * e.alive) / e.t.models
      return c
    })
    return { atk: true, f, at, held, gate: u.t.wrecker ? gateOf(G, wall) : null }
  }
  const face = faceGrid(G, wall), nav = G.nav
  const across = enemies.filter((e) => {
    const i = nav.index(e.pos.x, e.pos.z)
    return i >= 0 && face[i] > 0
  })
  const foe = 1 - u.side
  const threat = G.objectives.map((o) => (owners[o.i] === foe ? 2 : enemies.some((e) => hypot(e.pos.x - o.x, e.pos.z - o.z) <= THREAT) ? 1 : 0))
  let yard = null
  for (const o of G.objectives) if (!yard || hypot(o.x - wall.gate.x, o.z - wall.gate.z) < hypot(yard.x - wall.gate.x, yard.z - wall.gate.z)) yard = o
  const lost = owners[yard.i] === foe
  let post = null
  for (const p of postsOf(wall, lost ? 'second' : 'yard')) if (!post || hypot(p.x - u.pos.x, p.z - u.pos.z) < hypot(post.x - u.pos.x, post.z - u.pos.z)) post = p
  return { atk: false, face, across, threat, post, hold: holdOf(G, u, wall, enemies, threat) }
}

// (Breakthrough, S5c) The post defender `u` holds where it stands, for
// wallScore's HOLD_POST: 'post' at a siege ladder's head (its middle within
// HEAD_R of the ladder's top, at its level within HOLD_Y) or, for a unit
// with OC, in an objective's hold area (within HOLD, at its level); 'works'
// on a deck (a floor above STEP), held only while it has a target from
// there (wallScore's canShoot); null standing anywhere else, or when one of
// the line's reasons to go applies: an objective the attacker holds that u
// could contest this turn (OC, its middle within its move and the
// objective's range of it, wall-probe's `able`), or, for a brawler, an
// attacker behind the face its countercharge could reach (its middle
// within u's move and CHARGE_RANGE and both radii). An attacker no more
// than CHARGE_OUT in front of the face, at the wall's foot, is charged
// from the post itself or not at all (the policy's charges, core/ai/
// policy.js): counted too, it took the yard's brawlers off their posts
// as the attack reached the wall (on the presets, the Oak Guard still
// at its post in round 2 in 0 of 24 battles). A post whose
// other terms (the brawlers' danger, the shot from elsewhere) outweigh
// HOLD_POST is untenable by the score itself.
//
// (CHARGE_OUT: how far in front of a wall's outer face a defender still
// charges an attacker, one whose middle stands within CHARGE_OUT of it, so
// the charge ends a base or two from the face and the next move takes it
// back behind the line. Chosen, not tuned: over 400 AI battles no
// defender's charge ended in front of the face at all (S3's As built,
// DESIGN §4.2.12). Here from S5c; core/ai/policy.js's charges read it.)
export const HEAD_R = 1.5, CHARGE_OUT = 2
function holdOf(G, u, wall, enemies, threat) {
  const nav = G.nav, y = nav.hasHeight ? floorAt(G, u.pos.x, u.pos.z) : 0
  const level = (x, z) => !nav.hasHeight || Math.abs(floorAt(G, x, z) - y) <= HOLD_Y
  let hold = null
  if (wall.ladders.some((l) => hypot(l.top.x - u.pos.x, l.top.z - u.pos.z) <= HEAD_R && level(l.top.x, l.top.z))) hold = 'post'
  else if (u.t.OC > 0 && G.objectives.some((o) => hypot(o.x - u.pos.x, o.z - u.pos.z) <= HOLD && level(o.x, o.z))) hold = 'post'
  else if (y > STEP) hold = 'works'
  if (!hold) return null
  if (u.t.OC > 0 && G.objectives.some((o) => threat[o.i] === 2 && hypot(o.x - u.pos.x, o.z - u.pos.z) - u.r <= u.t.M + OBJECTIVE_RANGE)) return null
  if (u.t.brawler && enemies.some((e) => faceDist(wall, e.pos.x, e.pos.z) > 0 && hypot(e.pos.x - u.pos.x, e.pos.z - u.pos.z) - u.r - e.r <= u.t.M + CHARGE_RANGE)) return null
  return hold
}

// The objective term on a wall's board: [its best value, whether (x, z) is
// on an objective, which]: for the attacker by the route (0 on the hold
// area), from across the table; for the defender by the way up as ever
// (levelDist), each objective's want by its threat
function wallObjective(G, u, x, z, ctx, pull, walks, climb) {
  const { owners, claimed, bt } = ctx
  let best = 0, on = false, obj = -1
  for (const o of G.objectives) {
    let d, v
    // (the attacker never discounts an objective a friend is already
    // going for: the line is broken by weight, not spread across it)
    // (nor the defender one the attacker holds: every unit that can
    // contests it)
    const taken = bt.atk || bt.threat[o.i] === 2 || !claimed.has(o.i) ? 1 : 0.25
    if (bt.atk) {
      d = routeDist(G, bt.f, o, x, z)
      if (!isFinite(d)) continue
      const want = (owners[o.i] === u.side ? 0.45 : 1) * THIN / (THIN + bt.held[o.i])
      v = d <= 0 ? pull * want * taken * 1.4 : pull * want * taken * Math.max(0, 1 - d / ROUTE_REACH) * 0.7
      d = d <= 0 ? 0 : d + 2.6
    } else {
      if (walks && hypot(o.x - x, o.z - z) - levelSlack(G, climb) >= 18.6) continue
      d = walks ? levelDist(G, { x, z }, o, climb) : hypot(o.x - x, o.z - z)
      const th = bt.threat[o.i]
      const want = th === 2 ? DENY : th === 1 ? 1 : owners[o.i] === u.side ? 0.45 : 1
      v = d <= 2.6 ? pull * want * taken * 1.4 : pull * want * taken * Math.max(0, 1 - (d - 2.6) / 16) * 0.7
    }
    if (v > best) {
      best = v
      if (d <= 2.6) {
        on = true
        obj = o.i
      } else if (!on) obj = -1
    }
  }
  return [best, on, obj]
}

// (Breakthrough) What a defender's charge at attacker `e` is worth beyond
// its fight: DENY_GAIN when e stands within an objective's range (its
// middle within OBJECTIVE_RANGE and its radius) of one the attacker holds,
// so the line charges what sits on its objectives rather than shooting it
// from afar while the tally climbs; 0 otherwise. The charge term and the
// policy's charges (core/ai/policy.js aiCharge) read it.
export function wallDeny(G, bt, e) {
  for (const o of G.objectives) if (bt.threat[o.i] === 2 && hypot(e.pos.x - o.x, e.pos.z - o.z) <= OBJECTIVE_RANGE + e.r) return DENY_GAIN
  return 0
}

// "Close the distance" on a wall's board: the attacker's route to its
// nearest objective; the defender's way to the nearest attacker across the
// face, or with none there to its post
function wallNear(G, u, x, z, ctx, walks, climb) {
  const bt = ctx.bt
  if (bt.atk) {
    let near = Infinity
    for (const o of G.objectives) near = Math.min(near, routeDist(G, bt.f, o, x, z))
    return isFinite(near) ? near : Math.min(...G.objectives.map((o) => hypot(o.x - x, o.z - z)))
  }
  const from = { x, z }
  if (bt.across.length) return walks ? nearestBy(G, from, bt.across, climb) : Math.min(...bt.across.map((e) => hypot(e.pos.x - x, e.pos.z - z)))
  if (!bt.post) return 0
  return walks ? levelDist(G, from, bt.post, climb) : hypot(bt.post.x - x, bt.post.z - z)
}

// (Breakthrough, S5b) What attacker `u`'s route fields `f` know of enemy
// `e`, for wallGap: each objective's route distance at e's own cell, and
// for each field e's cell is off, the greatest at the cells where u's
// middle stands in base contact with e (within their radii and CONTACT_PAD
// of e's middle: route.js nearField). e's cell is off u's field wherever e
// stands hard against a wall a wider base has no clearance by, or on a
// tower's top a walker never stands on; the cells it is charged from are
// on it all the same. { own, far }: far null where own is on every field.
export const CONTACT_PAD = 0.375
function contactOf(G, f, u, e) {
  const j = G.nav.index(e.pos.x, e.pos.z)
  const own = f.map((d) => (j >= 0 ? d[j] : Infinity))
  return { own, far: own.every(isFinite) ? null : nearField(G, f, e.pos.x, e.pos.z, e.r + (u.t.fp ? u.t.base : u.r) + CONTACT_PAD) }
}

// A lower bound on the gap attacker `u` must walk from nav cell `i` to
// base contact with enemy `e` (`c` its contactOf), by the wall's way: a
// walk changes no route distance by more than its length, so for each
// objective's field it is at least the field's drop from here to e's own
// cell, less both radii (exact on a straight walk in the open), or where
// e's cell is off that field, its drop to the contact cell where the field
// is greatest (the walk ends in base contact there: no radii to take off).
// The most of them; Infinity where neither is on any field (a tower's top
// for a unit that climbs no ladder). (S5a took the least field value over
// the contact cells, which on a straight walk with the objective beyond e
// is e's far side: the gap both radii and the pad too long, a charge that
// is on out of reach; S3 e's own cell alone, Infinity wherever it is off
// the field.) wallGap and wallRush both read it. Measured on the final
// tree (army-sim's role mode, seed 1111): with S3's form the attacker wins
// 54.0%, the Coil attacking the Bushtails 61.0%; with this one 52.8% and
// 59.3%. P-wall's charge scenes hold it (sim/property.mjs wallScenes).
function contactGap(f, c, i, u, e) {
  let lb = -Infinity, any = false
  for (let k = 0; k < f.length; k++) {
    const d = isFinite(c.own[k]) ? f[k][i] - c.own[k] - u.r - e.r : c.far && isFinite(c.far[k]) ? f[k][i] - c.far[k] : NaN
    if (d !== d) continue
    any = true
    if (d > lb) lb = d
  }
  return any ? lb : Infinity
}

// The gap the charge term reads from (x, z) to enemy `e` on a wall's board
// (contactGap; -Infinity, no bound, for a flier, whose way is the straight
// line). So an attacker at the wall's foot no longer weighs a charge at
// defenders behind the wall that the straight line (or levelDist's way up,
// which knows the ladders but not the wall) puts within reach.
export function wallGap(G, bt, u, e, x, z) {
  if (!bt.f) return -Infinity
  const c = bt.at.get(e), i = G.nav.index(x, z)
  if (!c || i < 0) return -Infinity
  return contactGap(bt.f, c, i, u, e)
}

// The rest of the wall's terms at (x, z): the attacker's ram (a wrecker's
// walk ending where it rams the standing gate); the defender's line (the
// ground in front of the face refused, a shooter with a target on the works
// held there)
function wallScore(G, u, x, z, ctx, moved, canShoot, ci) {
  const bt = ctx.bt
  let s = 0
  if (bt.atk) {
    if (bt.gate && moved && ramsAt(u, bt.gate, x, z)) s += RAM_BLOW
    // (the way on: every attacker but the guns, a hero at half weight)
    if (ctx.role !== 'artillery' && bt.f !== undefined) s -= wallNear(G, u, x, z, ctx, false, false) * (ctx.role === 'hero' ? PROGRESS / 2 : PROGRESS)
    return s
  }
  const fd = ci >= 0 ? bt.face[ci] : -1
  if (fd < 0) s -= FRONT_COST
  else if (canShoot && G.nav.hasHeight && floorAt(G, x, z) > STEP) s += WALL_HOLD
  // ((S5c) the post held: staying on it, holdOf's)
  if (!moved && bt.hold && (bt.hold !== 'works' || canShoot)) {
    s += HOLD_POST
    ctx.held = true
  }
  return s
}

// (Breakthrough) Whether an attacker on a wall's board advances (the
// policy's Advance, core/ai/policy.js aiMoveOne), or null off a wall's
// board and for a defender (the policy's own rule then, as ever, but (S5c)
// false for a defender whose pick is staying on the post it holds): the
// guns and the heroes never; a unit within its move and 2 of its nearest
// objective by its route never (it arrives walking); a line unit on an
// objective, and a raider or a shooter with a shot from its pick, never
// (an Advance forfeits the shot); a brawler (melee, line or raider) with an
// enemy within its move and 8 of it by the wall's way (contactGap's bound
// beside the gap) never (it may charge); every other attacker does: the
// route is long and the wall's fire is on it while it walks. No draw.
export function wallRush(G, u, role, pick) {
  const wall = wallOf(G)
  // ((S5c) a defender whose pick is the post it holds never advances: it
  // stays, its shot and its charge kept)
  if (wall && sideRole(G, u) === 'defend' && pick.held) return false
  if (!wall || sideRole(G, u) !== 'attack') return null
  if (role === 'artillery' || role === 'hero') return false
  const f = routeFields(G, u, wall), nav = G.nav, i = nav.index(u.pos.x, u.pos.z)
  let left = Infinity
  for (const o of G.objectives) left = Math.min(left, routeDist(G, f, o, u.pos.x, u.pos.z))
  if (!(left > u.t.M + 2)) return false
  if (role === 'line' && pick.onObjective) return false
  if ((role === 'raider' || role === 'shooter') && pick.canShoot) return false
  if (role === 'melee' || role === 'line' || role === 'raider') {
    for (const e of enemiesOf(G, u)) {
      let g = gap(u, e)
      if (f && i >= 0) g = Math.max(g, contactGap(f, contactOf(G, f, u, e), i, u, e))
      if (g < u.t.M + 8) return false
    }
  }
  return true
}
