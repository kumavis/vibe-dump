// order 500: acceleration-limited velocity toward live.desired, speed cap,
// position, yaw (optionally turn-rate limited), ground height, hard bounds.
import { owned, len } from './util.js'

const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a))
export function installIntegrate (world, { order, ground }) {
  world.addSystem({
    name: 'integrate',
    order,
    query: ['transform', 'body'],
    update (w, dt, set) {
      const B = Number(w.doc?.world?.bounds ?? 40)
      for (const e of owned(w, set)) {
        const c = e.c; const l = e.live
        if (!l.p || !l.desired || l.intent?.act === 'ride') continue
        if (l.held) { l.v[0] = 0; l.v[2] = 0; continue }
        const a = Number(c.body.accel ?? 10) * dt
        let fx = l.desired[0] - l.v[0]; let fz = l.desired[1] - l.v[2]
        const fm = len(fx, fz); if (fm > a) { fx *= a / fm; fz *= a / fm }
        l.v[0] += fx; l.v[2] += fz
        const cap = Number(c.body.speed ?? 3) * Number(l.intent?.speedMul ?? 1) * 1.05
        const s = len(l.v[0], l.v[2]); if (s > cap) { l.v[0] *= cap / s; l.v[2] *= cap / s }
        l.p[0] = Math.max(-B, Math.min(B, l.p[0] + l.v[0] * dt))
        l.p[2] = Math.max(-B, Math.min(B, l.p[2] + l.v[2] * dt))
        l.p[1] = (ground ? Number(ground(l.p[0], l.p[2])) || 0 : 0) + Number(c.body.hover ?? 0)
        if (len(l.v[0], l.v[2]) > 0.05) {
          const want = Math.atan2(l.v[0], l.v[2]); const turn = Number(c.body.turn ?? 0)
          l.yaw = turn > 0 ? l.yaw + Math.max(-turn * dt, Math.min(turn * dt, wrap(want - l.yaw))) : want
        }
      }
    },
  })
}
