// order 800: the OWNER of a victim observes its hp (from the ledger) and emits
// `hurt` when it drops and `died` once when it reaches 0. Groups are added by
// the `on` reactions (events, order 900): death is data, not an engine feature.
// A new owner that first sees an entity already at 0 hp emits `died` unless the
// entity already carries every group its on.died reaction adds.
import { owned, hpOf } from './util.js'

const reacted = (e) => {
  const add = e.c.on?.died?.add
  return Array.isArray(add) && add.length > 0 && add.every((g) => e.groups.has(String(g)))
}

export function installHealth (world, { order, events }) {
  world.addSystem({
    name: 'health',
    order,
    query: ['health'],
    update (w, dt, set) {
      for (const e of owned(w, set)) {
        const l = e.live
        const now = hpOf(e)
        if (now == null) continue
        if (l.hp === undefined) { l.hp = now; l.died = now <= 0 && (reacted(e) || !!e.c.tags?.dead) }
        if (now < l.hp) events.emit({ type: 'hurt', id: e.id, amount: l.hp - now, hp: now })
        if (now <= 0 && !l.died) { l.died = true; events.emit({ type: 'died', id: e.id, hp: 0 }) } else if (now > 0) l.died = false
        l.hp = now
      }
    },
  })
}
