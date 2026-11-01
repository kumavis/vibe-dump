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
        // hysteresis: a creature hovering at a threshold must not flicker between
        // states every tick (each switch starts a crossfade in the renderer)
        const was = l.anim
        const runAt = speed * (was === 'run' ? 0.55 : 0.65)
        const walkAt = was === 'walk' || was === 'run' ? 0.15 : 0.25
        l.anim = isDead(e) ? 'die'
          : (l.attackT != null && w.time - l.attackT < 0.35) ? 'attack'
              : ridingId(e) ? 'sit'
                : s > runAt ? 'run'
                  : s > walkAt ? 'walk' : 'idle'
      }
    },
  })
}
