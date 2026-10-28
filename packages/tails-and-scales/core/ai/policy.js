// The opponent (DESIGN §2.2's "AI inside the fold", §2.5): for each phase,
// a generator that looks at the match and yields the commands it decides on,
// one at a time, as a seat's would be (`{ t: 'advance' | 'move' | 'shoot' |
// 'charge', u, c | tg }`, units by id, places by nav cell; (V3c) a
// caster's shot names its spell, `sp`). core/engine.js's
// runAI, the only driver, applies each command before asking for the next,
// in the fold, which every peer runs (an AI seat's phase, and a human's
// `auto`), so the generator reads the match as each of its commands left
// it. An AI
// seat appends nothing to a match's log: the AI's play is a function of the
// match.
//
// The rest is the AI's own, never a command: `hold` (an advanced unit it
// leaves standing has spent its move), and what the view is shown along the
// way, as events (`focus {x, z}`, where the camera may swing; `pause {s}`,
// the beats between units).
//
// AI code is rules code (DESIGN §4.1 rule 10): every tie-break draw stays
// between the same yields as the old awaits, and any change to what it
// decides bumps CORE_VERSION and re-baselines. The role sorts are stable,
// ascending for moves and charges and reversed for shots (rule 6).
import { p2D6 } from '../rules.js'
import { hypot } from '../dmath.js'
import { emit } from '../journal.js'
import {
  alive, enemiesOf, gap, isEngaged, engagedWith, movePlan, canShoot, shootTargets, shotInfo, canCharge, chargeTargets, chargePlan,
} from '../queries.js'
import { hold } from '../actions/move.js'
import { worth, meleeValue, shotValue, spellValue, bestSpot, fallbackSpot } from './score.js'

// Each unit type names its AI role in the race data (`t.ai`); the roles act
// in this order, brawlers first and the guns last.
export const ORDER = Object.freeze(['melee', 'raider', 'line', 'shooter', 'hero', 'artillery'])

// The commands seat `side` plays in `phase` (the move, shoot and charge
// phases; the fight and morale phases play themselves). `only` (F10b's
// `pilot`): the units it plays, a list of the seat's; null, all of them.
// The filter only drops units from each phase's list, so the units it keeps
// are played as they would be with the rest, in the same order, with the
// same draws between the same yields (P-auto: a `pilot` naming every unit,
// then `end`, is `auto`).
export function* aiPhase(G, side, phase, only = null) {
  const mask = (u) => !only || only.includes(u)
  if (phase === 'move') yield* aiMove(G, side, mask)
  else if (phase === 'shoot') yield* aiShoot(G, side, mask)
  else if (phase === 'charge') yield* aiCharge(G, side, mask)
}

// ── Movement ────────────────────────────────────────────────────────────────
function* aiMove(G, side, mask) {
  const mine = G.units.filter((u) => u.side === side && alive(u) && mask(u))
  mine.sort((a, b) => ORDER.indexOf(a.t.ai) - ORDER.indexOf(b.t.ai))
  const claimed = new Set()
  for (const u of mine) {
    // ((V3c) a snared unit has no move to make: core/commands.js)
    if (!alive(u) || u.flags.moved || u.snared) continue
    const role = u.t.ai
    if (isEngaged(G, u)) {
      // brawlers stay stuck in; anyone else gets out if the fight is going badly
      const foes = engagedWith(G, u)
      const theirs = foes.reduce((s, e) => s + meleeValue(e, u), 0)
      const ours = foes.reduce((s, e) => Math.max(s, meleeValue(u, e)), 0)
      if (role === 'melee' || role === 'line' || ours >= theirs * 0.8) continue
      const best = fallbackSpot(G, u, movePlan(G, u))
      if (best >= 0) {
        emit(G, 'focus', { x: u.pos.x, z: u.pos.z })
        yield { t: 'move', u: u.id, c: best }
      }
      continue
    }
    // a unit its player already advanced (before pressing Auto) moves on that
    // roll; it never advances twice
    let plan = movePlan(G, u, u.flags.advanced ? u.flags.advRoll : 0)
    let pick = bestSpot(G, u, plan, claimed)
    // Advance when the extra inches are worth more than what it forfeits:
    // brawlers still far from a charge, shooters with nothing to shoot yet.
    const nearest = Math.min(...enemiesOf(G, u).map((e) => gap(u, e)))
    let advance = false
    if (role === 'melee' || role === 'line' || role === 'raider') {
      advance = nearest > u.t.M + 8 && !(role === 'line' && pick.onObjective) && !(role === 'raider' && pick.canShoot)
    } else if (role === 'shooter') {
      advance = !pick.canShoot && !pick.onObjective && (u.t.ranged.assault || nearest > u.t.ranged.range + u.t.M + 3)
    }
    if (advance && !u.flags.advanced) {
      emit(G, 'focus', { x: u.pos.x, z: u.pos.z })
      yield { t: 'advance', u: u.id }
      // (the roll is the unit's now: its advRoll)
      plan = movePlan(G, u, u.flags.advRoll)
      const adv = bestSpot(G, u, plan, claimed)
      if (adv.cell >= 0) pick = adv
    }
    if (pick.obj >= 0) claimed.add(pick.obj)
    if (pick.cell >= 0 && pick.dist > 0.4) {
      emit(G, 'focus', { x: u.pos.x, z: u.pos.z })
      yield { t: 'move', u: u.id, c: pick.cell }
    } else if (u.flags.advanced) {
      // an advanced unit staying put has spent its move all the same
      hold(G, u)
    }
    emit(G, 'pause', { s: 0.05 })
  }
}

// ── Shooting ────────────────────────────────────────────────────────────────
// (V3c) A caster picks its spell and its target together (bestCast), every
// other unit its target (bestShot), as it always has.
function* aiShoot(G, side, mask) {
  const mine = G.units.filter((u) => u.side === side && canShoot(G, u) && mask(u))
  mine.sort((a, b) => ORDER.indexOf(b.t.ai) - ORDER.indexOf(a.t.ai))
  for (const u of mine) {
    if (!canShoot(G, u)) continue
    const pick = u.t.spells ? bestCast(G, u) : bestShot(G, u)
    if (pick) {
      const best = pick.e
      emit(G, 'focus', { x: (u.pos.x + best.pos.x) / 2, z: (u.pos.z + best.pos.z) / 2 })
      yield u.t.spells ? { t: 'shoot', u: u.id, tg: best.id, sp: pick.sp } : { t: 'shoot', u: u.id, tg: best.id }
      emit(G, 'pause', { s: 0.1 })
    }
  }
}

// What a shot (or (V3c) a cast) at `e` with weapon `w` is worth to `u` as
// the policy weighs it: its value (`v`), less, for a template, the cost of a
// scatter landing on our own lads (a blast spell's too, which never
// scatters: the AI fears its template near them all the same), and a fifth
// of it for a gaze at a target already mesmerized.
function weighed(G, u, w, e, v) {
  if (w.blast) {
    // count the cost of a scatter landing on our own lads
    for (const f of G.units) {
      if (f.side !== u.side || !alive(f)) continue
      const g = hypot(f.pos.x - e.pos.x, f.pos.z - e.pos.z) - f.r
      if (g < w.blast + 2.5) v -= worth(f) * 0.25 * (1 - Math.max(0, g) / (w.blast + 2.5))
    }
  }
  if (w.mesmerize && e.mesmerized) v *= 0.2
  return v
}

// The target `u`'s ranged weapon is best fired at: { e, v }, the first found
// of the best worth more than 0.4, or null. (F18) An enemy locked in combat
// is among the targets, valued net of the shot's friendly fire (shotValue:
// a volley's strays into the fight, a template's friends under it), so one
// that costs more of ours than it takes of theirs is never picked.
function bestShot(G, u) {
  let best = null, bv = 0.4
  for (const e of shootTargets(G, u)) {
    const v = weighed(G, u, u.t.ranged, e, shotValue(G, u, e, u.pos, u.flags.moved))
    if (v > bv) {
      bv = v
      best = { e, v }
    }
  }
  return best
}

// (V3c, rule 10: it bumps with V3c) The spell and target a caster's cast is
// best worth: every spell (in its order) at every target it takes
// (shootTargets: friends for a ward or a resolve), each by spellValue as
// weighed above; { sp, e, v }, the first found of the best worth more than
// 0.4, or null. Pure: it draws nothing.
export function bestCast(G, u) {
  let best = null, bv = 0.4
  u.t.spells.forEach((w, sp) => {
    for (const e of shootTargets(G, u, sp)) {
      const v = weighed(G, u, w, e, spellValue(G, u, sp, e))
      if (v > bv) {
        bv = v
        best = { sp, e, v }
      }
    }
  })
  return best
}

// (V3c) The spell a caster's player finds picked when it picks the caster up
// (the shooting tool's default, input/human.js): the AI's own pick, or its
// first spell when the AI would cast none. 0 for a unit with no spells.
export const bestSpell = (G, u) => (u.t.spells ? bestCast(G, u)?.sp ?? 0 : 0)

// (V3c) The spell a caster fires at enemy `tg` in a group's fire
// (present/orders.js): of its spells that take tg (shotInfo), the one worth
// most to the AI there (the first found of the best, worth or not); -1 for
// none, and undefined for a unit with no spells, whose shot names none.
export function spellFor(G, u, tg) {
  if (!u.t.spells) return undefined
  let best = -1, bv = -Infinity
  u.t.spells.forEach((w, sp) => {
    if (!shotInfo(G, u, tg, sp).ok) return
    const v = weighed(G, u, w, tg, spellValue(G, u, sp, tg))
    if (v > bv) {
      bv = v
      best = sp
    }
  })
  return best
}

// ── Charges ─────────────────────────────────────────────────────────────────
// (an AI's charge goes straight on to the shortest move: its runner says
// so, `via` 'ai', and no spot is picked)
function* aiCharge(G, side, mask) {
  const mine = G.units.filter((u) => u.side === side && canCharge(G, u) && mask(u))
  mine.sort((a, b) => ORDER.indexOf(a.t.ai) - ORDER.indexOf(b.t.ai))
  for (const u of mine) {
    if (!canCharge(G, u)) continue
    const role = u.t.ai
    let best = null, bs = 0
    for (const e of chargeTargets(G, u)) {
      const plan = chargePlan(G, u, e)
      if (!plan) continue
      // ((V3c, rule 10) a resolute unit rolls a miss again: 2p − p²)
      const p0 = p2D6(plan.need), p = u.resolute ? p0 + p0 * (1 - p0) : p0
      const gain = meleeValue(u, e) + (e.t.role === 'Artillery' ? 12 : 0) + (e.alive <= 2 ? 6 : 0)
      const loss = meleeValue(e, u)
      const min = role === 'melee' ? 0.25 : role === 'line' ? 0.33 : role === 'raider' ? 0.4 : role === 'hero' ? 0.5 : 0.6
      if (p < min) continue
      if ((role === 'shooter' || role === 'hero') && gain < loss * 1.4) continue
      const sc = p * (gain - loss * 0.4)
      if (sc > bs) {
        bs = sc
        best = e
      }
    }
    if (best) {
      emit(G, 'focus', { x: (u.pos.x + best.pos.x) / 2, z: (u.pos.z + best.pos.z) / 2 })
      yield { t: 'charge', u: u.id, tg: best.id }
      emit(G, 'pause', { s: 0.1 })
    }
  }
}
