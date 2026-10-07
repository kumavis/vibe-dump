// Morale (DESIGN §1.1): the end-of-turn test of every squad that lost
// models this turn, and the models that flee it.
//
// Synchronous, like damage.js: the tray's title and each unit's roll are
// events (`tray.open`, `dice`), the old wait after a flight a `pause`, each
// fleeing model a `unit.flee`, and the battle log's lines `log` events
// (core/journal.js), all in the old order (§4.1 rule 3). It walks the units
// in G.units order (§4.1 rule 6), one D6 each.
//
//   unit.flee { u, m }   model m runs off the table over its seat's edge
import { roll } from '../rules.js'
import { emit, log } from '../journal.js'
import { alive, leadership, ownersOf, statusOf } from '../queries.js'
import { closeRanks, unitDestroyed } from './damage.js'

export function moralePhase(G) {
  let any = false
  for (const u of G.units) {
    if (!alive(u) || !u.lost || u.t.models === 1) continue
    if (!any) emit(G, 'tray.open', { title: 'Morale' })
    any = true
    const ld = leadership(G, u)
    const r = roll(G, 1)
    const total = r[0] + u.lost
    // how many lose their nerve (a 1 always holds)
    const nerve = r[0] === 1 ? 0 : Math.max(0, total - ld)
    emit(G, 'dice', { label: `${u.t.short}: D6 + ${u.lost} lost vs Ld ${ld}`, dice: r, need: 0, sum: true, pass: nerve === 0, note: `${total}` })
    if (nerve) {
      const n = Math.min(nerve, u.alive)
      const runners = u.models.filter((m) => m.alive).slice(-n)
      for (const m of runners) flee(G, u, m)
      log(G, u.side, `<b>${u.t.short}</b> lose their nerve — <b>${n} flee</b>.`)
      if (!alive(u)) unitDestroyed(G, u, null)
      else closeRanks(G, u)
      // the flags and the labels, as they now stand
      if (G.out) {
        emit(G, 'objectives', { owners: ownersOf(G) })
        emit(G, 'status', statusOf(G))
      }
      emit(G, 'pause', { s: 0.5 })
    } else log(G, u.side, `<b>${u.t.short}</b> hold firm (${total} vs Ld ${ld}).`)
  }
}

// Model `m` of `u` flees: it is gone, as if slain.
export function flee(G, u, m) {
  m.alive = false
  m.w = 0
  u.alive--
  emit(G, 'unit.flee', { u: u.id, m: u.models.indexOf(m) })
}
