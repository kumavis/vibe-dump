// Damage (DESIGN §1.1): wounds allocated to a unit's models, the fallen, and
// the ranks closing behind them.
//
// Synchronous. What the old code waited for (a beat after each wound, a
// breath after losses) is an event in the match's out at the same place
// (DESIGN §2.3, §4.1 rule 3): `pause` for a pure wait, and what the view
// shows as its own event (a wound's number and flinch, a model's fall, a
// unit's end, the survivors' new formation), which main.js's handlers play
// with the old visuals. No logic moves across an emit, and building an event
// draws nothing and changes nothing.
//
//   unit.wound     { u, m, dmg }         model m took dmg and stands
//   unit.slain     { u, m, by, dmg }     model m fell (by: the attacker's id)
//   unit.destroyed { u, by }             the unit's last model is gone
//   unit.formation { u, offs, r, pos }   the survivors' slots ([ox, oz] per
//                                        model), the disc, and its place
//
// Units go by id and models by index into the unit's models. A destroyed
// unit's line in the battle log waits in G.journal.pendingLog until the
// attack that did it is reported (§4.1 rule 8).
import { ENGAGE } from '../rules.js'
import { hypot } from '../dmath.js'
import { emit } from '../journal.js'
import { relayout, setUnitPos } from '../units.js'
import { alive, dist, gap, engagedWith, isEngaged, mx, mz, ownersOf, statusOf } from '../queries.js'

// Allocate `n` wounds of `D` damage to `u`, finishing off wounded models
// first and preferring the models actually under a template. Returns the
// models slain.
export function damage(G, u, n, D, attacker, prefer = null) {
  let killed = 0
  for (let i = 0; i < n; i++) {
    const live = u.models.filter((m) => m.alive)
    if (!live.length) break
    let pool = prefer ? live.filter((m) => prefer.includes(m)) : []
    if (!pool.length) pool = live
    const wounded = pool.filter((m) => m.w < u.t.W)
    let m
    if (wounded.length) m = wounded[0]
    else {
      // whoever is nearest the attacker takes it (a tie keeps the first:
      // DESIGN §4.1 rule 6)
      const near = (q) => hypot(mx(u, q) - attacker.pos.x, mz(u, q) - attacker.pos.z)
      m = pool.reduce((a, b) => (near(a) < near(b) ? a : b))
    }
    m.w -= D
    // the number shown: the wounds it took, no more than it had
    const dmg = Math.min(D, D + Math.min(0, m.w))
    if (m.w <= 0) {
      killModel(G, u, m, attacker, dmg)
      killed++
    } else emit(G, 'unit.wound', { u: u.id, m: u.models.indexOf(m), dmg })
    emit(G, 'pause', { s: 0.06 })
  }
  if (killed) {
    u.lost += killed
    emit(G, 'pause', { s: 0.25 })
    if (alive(u)) closeRanks(G, u)
    // the flags (who holds what) and, below, the labels, as they now stand
    if (G.out) emit(G, 'objectives', { owners: ownersOf(G) })
  }
  if (G.out) emit(G, 'status', statusOf(G))
  return killed
}

// Survivors close ranks — and pile in, so a squad thinned out in melee doesn't
// shrink out of the fight it was in.
export function closeRanks(G, u) {
  const foes = engagedWith(G, u)
  relayout(u)
  if (foes.length && !isEngaged(G, u)) {
    const f = foes.reduce((a, b) => (gap(u, a) < gap(u, b) ? a : b))
    const d = dist(u, f)
    const step = gap(u, f) - (ENGAGE - 0.3)
    setUnitPos(u, u.pos.x + ((f.pos.x - u.pos.x) / d) * step, u.pos.z + ((f.pos.z - u.pos.z) / d) * step)
  }
  emit(G, 'unit.formation', { u: u.id, offs: u.models.map((m) => [m.ox, m.oz]), r: u.r, pos: { x: u.pos.x, z: u.pos.z } })
}

// Model `m` of `u` falls to `attacker` (dmg: the number its last wound shows).
export function killModel(G, u, m, attacker, dmg) {
  m.alive = false
  m.w = 0
  u.alive--
  emit(G, 'unit.slain', { u: u.id, m: u.models.indexOf(m), by: attacker ? attacker.id : null, dmg })
  if (!alive(u)) unitDestroyed(G, u, attacker)
}

// `u`'s last model is gone (to `by`, or to its own nerve: null).
export function unitDestroyed(G, u, by) {
  // reported after the attack that did it, not in the middle of it
  G.journal.pendingLog.push([u.side, `<b>${u.t.name}</b> ${u.t.models > 1 ? 'are' : 'is'} destroyed!`, 'big'])
  emit(G, 'unit.destroyed', { u: u.id, by: by ? by.id : null })
}
