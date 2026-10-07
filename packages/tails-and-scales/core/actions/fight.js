// The fight (DESIGN §1.1): every unit in combat strikes once, the chargers
// first, then the rest, defender first, alternating.
//
// Synchronous, like damage.js: what the old code waited on is an event in
// the match's out at the same place (DESIGN §2.3, §4.1 rule 3): the tray's
// title and each row of dice (`tray.open`, `dice`), the beat after a fight
// (`pause`), and what the view shows as its own event, which main.js's
// handlers play with the old visuals. No logic moves across an emit, and
// building an event draws nothing and changes nothing.
//
//   unit.face { u, tg }           u turns to face tg
//   focus     { x, z }            the camera may swing there (the view's
//                                 follow setting decides)
//   melee     { u, tg, n, hits }  u's models lunge at tg, throwing n
//                                 attacks; hits of them land, and the
//                                 sparks fly as the hit row settles
//
// Units go by id. It walks the units in G.units order, and the alternation
// keeps its guard of 30 (§4.1 rule 6).
import { roll, passes, woundNeed, saveNeed, hitNeed, attackCount } from '../rules.js'
import { emit, log } from '../journal.js'
import { alive, engagedWith, isEngaged, statusOf } from '../queries.js'
import { damage } from './damage.js'

// `u` strikes the enemy it charged, else the weakest it is fighting.
export function fight(G, u) {
  if (!alive(u) || u.flags.fought) return
  const foes = engagedWith(G, u)
  if (!foes.length) return
  u.flags.fought = true
  const target = foes.find((f) => f.id === u.flags.chargeTarget) || foes.reduce((a, b) => (a.alive * a.t.W < b.alive * b.t.W ? a : b))
  const w = u.t.melee
  const mod = u.mesmerized ? 1 : 0
  const need = hitNeed(u.t.WS, mod)
  emit(G, 'unit.face', { u: u.id, tg: target.id })
  emit(G, 'focus', { x: u.pos.x * 0.5 + target.pos.x * 0.5, z: u.pos.z * 0.5 + target.pos.z * 0.5 })
  emit(G, 'tray.open', { title: `${u.t.short} fight ${target.t.short} · ${w.name}` })
  const n = attackCount(u, w, true)
  const hits = roll(G, n)
  const h = passes(hits, need)
  // lunge! (the view's sparks wait for the hit row below)
  emit(G, 'melee', { u: u.id, tg: target.id, n, hits: h })
  emit(G, 'dice', { label: `Hit ${need}+${mod ? ' (mesmerized)' : ''}`, dice: hits, need })
  const wn = woundNeed(w.S, target.t.T, w.poison)
  const wd = roll(G, h)
  const wounds = passes(wd, wn)
  if (h) emit(G, 'dice', { label: `Wound ${wn}+`, dice: wd, need: wn })
  const sn = saveNeed(target.t.Sv, w.AP, false)
  // (the dice roll even when there is no save to make: §4.1 rule 5)
  const sv = roll(G, wounds)
  const unsaved = sn > 6 ? wounds : wounds - passes(sv, sn)
  if (wounds) emit(G, 'dice', { label: sn > 6 ? 'No save' : `Save ${sn}+`, dice: sn > 6 ? [] : sv, need: sn, save: true })
  const killed = damage(G, target, unsaved, w.D, u)
  log(G, u.side, `<b>${u.t.short}</b> fight ${target.t.short}: ${h} hit, ${wounds} wound, ${unsaved} unsaved${killed ? ` — <b>${killed} slain</b>` : ''}.`)
  emit(G, 'pause', { s: 0.3 })
}

// The fight phase of `active`'s turn.
export function fightPhase(G, active) {
  const chargers = G.units.filter((u) => u.side === active && u.flags.charged && alive(u))
  for (const u of chargers) fight(G, u)
  // then the rest, defender first, alternating (the guard of 30 is
  // behaviour: DESIGN §4.1 rule 6)
  let side = 1 - active
  for (let guard = 0; guard < 30; guard++) {
    const next = G.units.find((u) => u.side === side && alive(u) && !u.flags.fought && isEngaged(G, u))
    const other = G.units.find((u) => u.side === 1 - side && alive(u) && !u.flags.fought && isEngaged(G, u))
    if (!next && !other) break
    if (next) fight(G, next)
    side = 1 - side
  }
  for (const u of G.units) u.flags.fought = false
  // every label, now the fighting is over
  if (G.out) emit(G, 'status', statusOf(G))
}
