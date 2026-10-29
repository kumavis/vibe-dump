// order 1000: a SEMANTIC animation state (idle/walk/run/attack/die/sit). The
// renderer maps it onto whatever the representation supports (design §8).
import { owned, len, isDead, ridingId } from './util.js'

export function installAnimate (world, { order }) {
  world.addSystem({
    name: 'animate',
    order,
    query: ['transform'],
    update (w, dt, set) {
      for (const e of owned(w, set)) {
        const l = e.live
        const s = l.v ? len(l.v[0], l.v[2]) : 0
        const speed = Number(e.c.body?.speed ?? 1)
        l.anim = isDead(e) ? 'die'
          : (l.attackT != null && w.time - l.attackT < 0.35) ? 'attack'
              : ridingId(e) ? 'sit'
                : s > speed * 0.6 ? 'run'
                  : s > 0.2 ? 'walk' : 'idle'
      }
    },
  })
}
