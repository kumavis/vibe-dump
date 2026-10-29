// order 600: riders take their seat pose. rider.mount is the only stored side of
// the relation; the first rider id wins a contested seat (a CRDT race), the
// loser gets a `dismount` event and its owner clears its rider.mount once.
// A seat may name a render anchor (design §16.14); otherwise its offset is used.
import { owned, ridingId, isDead } from './util.js'

export function installMount (world, { order, anchor, events }) {
  world.addSystem({
    name: 'mount',
    order,
    query: ['rider'],
    update (w, dt, set) {
      const taken = new Set()
      for (const e of owned(w, set)) {
        const l = e.live
        const mid = ridingId(e)
        if (!mid) { l.dismountQueued = null; continue }
        const m = w.get(mid)
        const ix = Number(e.c.rider.seat ?? 0)
        const seat = m?.c.mount?.seats?.[ix]
        const key = `${mid}#${ix}`
        const reason = !m ? 'gone' : !seat ? 'no-seat' : isDead(m) ? 'mount-dead' : taken.has(key) ? 'seat-taken' : null
        if (reason) {
          if (l.dismountQueued !== mid) {
            l.dismountQueued = mid
            events.emit({ type: 'dismount', id: e.id, mount: mid, reason })
            if (!e.local) w.queueOps({ op: 'set', id: e.id, component: 'rider', patch: { mount: '' } })
          }
          continue
        }
        taken.add(key)
        const ml = m.live; if (!ml.p) continue
        const at = seat.anchor && anchor ? anchor(mid, String(seat.anchor)) : null
        if (Array.isArray(at) && at.length === 3 && at.every(Number.isFinite)) l.p = [at[0], at[1], at[2]]
        else {
          const o = Array.isArray(seat.offset) ? seat.offset : [0, 1.5, 0]
          const s = Math.sin(ml.yaw ?? 0); const co = Math.cos(ml.yaw ?? 0)
          l.p = [ml.p[0] + o[0] * co + o[2] * s, ml.p[1] + o[1], ml.p[2] - o[0] * s + o[2] * co]
        }
        l.v = [...(ml.v ?? [0, 0, 0])]
        l.yaw = ml.yaw ?? 0
      }
    },
  })
}
