// order 0: per-tick housekeeping for owned entities. Brainless entities drop
// stale intent (a corpse must not keep fleeing); the owner drains its inbox
// (design §4.3): `move` teleports, `push` is an impulse, anything else becomes
// a world event that `on` reactions and doc systems can see.
import { plain } from '../doc/convert.js'
import { owned, DEG } from './util.js'

// p may be absent (a yaw-only move): the entity keeps its live position
export function teleport (world, id, p, yawDeg) {
  const e = world.get(id)
  const hasP = Array.isArray(p)
  if (!e || (!hasP && !Number.isFinite(yawDeg))) return false
  const l = e.live
  if (hasP) {
    l.p = [Number(p[0]) || 0, Number(p[1]) || 0, Number(p[2]) || 0]
    l.v = [0, 0, 0]
    l.desired = [0, 0]
  } else if (!Array.isArray(l.p)) return false
  if (Number.isFinite(yawDeg)) l.yaw = yawDeg * DEG
  if (!e.local && world.owns(id)) world.queueOps({ op: 'checkpoint', id, p: l.p.map((x) => Math.round(x * 1000) / 1000), yaw: Math.round((l.yaw / DEG) * 10) / 10 })
  return true
}

export function installLifecycle (world, { order, events }) {
  world.addSystem({
    name: 'lifecycle',
    order,
    query: ['transform'],
    update (w, dt, set) {
      for (const e of owned(w, set)) {
        const l = e.live
        if (!e.c.brain) l.intent = null // control (300) re-sets steer/ride every tick
        const box = e.inbox
        if (e.local || !box) continue
        const keys = Object.keys(box).sort()
        if (!keys.length) { l.drained = null; continue }
        l.drained = l.drained ? new Set(keys.filter((k) => l.drained.has(k))) : new Set()
        const todo = keys.filter((k) => !l.drained.has(k))
        if (!todo.length) continue
        for (const k of todo) {
          const ev = plain(box[k])
          const type = String(ev?.type ?? '')
          if (type === 'move') teleport(w, e.id, ev.p, ev.yaw ?? ev.r?.[1])
          else if (type === 'push' && Array.isArray(ev.v)) { l.v[0] += Number(ev.v[0]) || 0; l.v[2] += Number(ev.v[ev.v.length === 3 ? 2 : 1]) || 0 } else if (type) events.emit({ ...ev, type, id: e.id, eventId: k })
          l.drained.add(k)
        }
        w.queueOps({ op: 'drain', id: e.id, eventIds: todo })
      }
    },
  })
}
