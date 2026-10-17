// The opponent (DESIGN §2.2's "AI inside the fold", §2.5): for each phase,
// a generator that looks at the match and yields the commands it decides on,
// one at a time, as a seat's would be (`{ t: 'advance' | 'move' | 'shoot' |
// 'charge', u, c | tg }`, units by id, places by nav cell). Whoever runs it
// applies each command before asking for the next (core/engine.js's runAI
// in the fold, which every peer runs; main.js's old turn loop until R6b),
// so the generator reads the match as each of its commands left it. An AI
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
  alive, enemiesOf, gap, isEngaged, engagedWith, movePlan, validEnd, canShoot, shootTargets, canCharge, chargeTargets, chargePlan,
} from '../queries.js'
import { hold } from '../actions/move.js'
import { worth, meleeValue, shotValue, bestSpot } from './score.js'

// Each unit type names its AI role in the race data (`t.ai`); the roles act
// in this order, brawlers first and the guns last.
export const ORDER = Object.freeze(['melee', 'raider', 'line', 'shooter', 'hero', 'artillery'])

// The commands seat `side` plays in `phase` (the move, shoot and charge
// phases; the fight and morale phases play themselves).
export function* aiPhase(G, side, phase) {
  if (phase === 'move') yield* aiMove(G, side)
  else if (phase === 'shoot') yield* aiShoot(G, side)
  else if (phase === 'charge') yield* aiCharge(G, side)
}

// ── Movement ────────────────────────────────────────────────────────────────
function* aiMove(G, side) {
  const mine = G.units.filter((u) => u.side === side && alive(u))
  mine.sort((a, b) => ORDER.indexOf(a.t.ai) - ORDER.indexOf(b.t.ai))
  const claimed = new Set()
  for (const u of mine) {
    if (!alive(u) || u.flags.moved) continue
    const role = u.t.ai
    if (isEngaged(G, u)) {
      // brawlers stay stuck in; anyone else gets out if the fight is going badly
      const foes = engagedWith(G, u)
      const theirs = foes.reduce((s, e) => s + meleeValue(e, u), 0)
      const ours = foes.reduce((s, e) => Math.max(s, meleeValue(u, e)), 0)
      if (role === 'melee' || role === 'line' || ours >= theirs * 0.8) continue
      const plan = movePlan(G, u)
      let best = -1, bs = -Infinity
      for (let i = 0; i < G.nav.N; i += 2) {
        if (!validEnd(G, plan, i)) continue
        const x = G.nav.x(i), z = G.nav.z(i)
        const s = Math.min(...enemiesOf(G, u).map((e) => hypot(e.pos.x - x, e.pos.z - z) - e.r))
        if (s > bs) {
          bs = s
          best = i
        }
      }
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
function* aiShoot(G, side) {
  const mine = G.units.filter((u) => u.side === side && canShoot(G, u))
  mine.sort((a, b) => ORDER.indexOf(b.t.ai) - ORDER.indexOf(a.t.ai))
  for (const u of mine) {
    if (!canShoot(G, u)) continue
    const targets = shootTargets(G, u)
    let best = null, bv = 0.4
    for (const e of targets) {
      let v = shotValue(G, u, e, u.pos, u.flags.moved)
      const w = u.t.ranged
      if (w.blast) {
        // count the cost of a scatter landing on our own lads
        for (const f of G.units) {
          if (f.side !== u.side || !alive(f)) continue
          const g = hypot(f.pos.x - e.pos.x, f.pos.z - e.pos.z) - f.r
          if (g < w.blast + 2.5) v -= worth(f) * 0.25 * (1 - Math.max(0, g) / (w.blast + 2.5))
        }
      }
      if (w.mesmerize && e.mesmerized) v *= 0.2
      if (v > bv) {
        bv = v
        best = e
      }
    }
    if (best) {
      emit(G, 'focus', { x: (u.pos.x + best.pos.x) / 2, z: (u.pos.z + best.pos.z) / 2 })
      yield { t: 'shoot', u: u.id, tg: best.id }
      emit(G, 'pause', { s: 0.1 })
    }
  }
}

// ── Charges ─────────────────────────────────────────────────────────────────
// (an AI's charge goes straight on to the shortest move: its runner says
// so, `via` 'ai', and no spot is picked)
function* aiCharge(G, side) {
  const mine = G.units.filter((u) => u.side === side && canCharge(G, u))
  mine.sort((a, b) => ORDER.indexOf(a.t.ai) - ORDER.indexOf(b.t.ai))
  for (const u of mine) {
    if (!canCharge(G, u)) continue
    const role = u.t.ai
    let best = null, bs = 0
    for (const e of chargeTargets(G, u)) {
      const plan = chargePlan(G, u, e)
      if (!plan) continue
      const p = p2D6(plan.need)
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
