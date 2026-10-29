// order 400: intent -> live.desired [vx, vz] (Reynolds-style pursue/flee/seek/
// follow/wander/steer), plus soft containment inside world.bounds and separation
// from sensed bodies. Ported from research/behaviors/proto/systems.mjs.
import { owned, len, dist, ridingId } from './util.js'

export function installSteer (world, { order }) {
  world.addSystem({
    name: 'steer',
    order,
    query: ['transform', 'body'],
    update (w, dt, set) {
      const B = Number(w.doc?.world?.bounds ?? 40)
      for (const e of owned(w, set)) {
        const c = e.c; const l = e.live
        if (!l.p) continue
        if (l.held) { l.desired = [0, 0]; continue } // in someone's hand (interaction sets live.held)
        const it = l.intent ?? { act: 'idle' }
        const max = Number(c.body.speed ?? 3) * Number(it.speedMul ?? 1)
        if (it.act === 'ride') { l.desired = [0, 0]; continue }
        let dx = 0; let dz = 0; let scale = max
        if (it.act === 'pursue' || it.act === 'seek' || it.act === 'follow') {
          const t = w.get(it.target)?.live
          if (t?.p) {
            const d = dist(l.p, t.p)
            const T = it.act === 'pursue' ? Math.min(1, d / Math.max(max, 1e-3)) : 0
            dx = t.p[0] + (t.v?.[0] ?? 0) * T - l.p[0]; dz = t.p[2] + (t.v?.[2] ?? 0) * T - l.p[2]
            if (it.act === 'follow') { const stop = Number(it.distance ?? 3); scale = d <= stop ? 0 : max * Math.min(1, (d - stop) / Math.max(stop, 1)) }
          }
        } else if (it.act === 'flee') {
          for (const oid of it.from ?? []) {
            const t = w.get(oid)?.live; if (!t?.p) continue
            const ex = l.p[0] - t.p[0]; const ez = l.p[2] - t.p[2]; const d = Math.max(len(ex, ez), 0.1)
            dx += ex / (d * d); dz += ez / (d * d)
          }
        } else if (it.act === 'wander') {
          l.wanderA = (l.wanderA ?? 0) + (w.rand(e.id) - 0.5) * 1.2
          const f = len(l.v[0], l.v[2]) > 0.05 ? Math.atan2(l.v[0], l.v[2]) : l.yaw
          dx = Math.sin(f) * 2 + Math.sin(l.wanderA); dz = Math.cos(f) * 2 + Math.cos(l.wanderA)
          scale = max * 0.4
        } else if (it.act === 'steer') {
          const v = it.vec ?? [0, 0]; dx = v[0]; dz = v[1]
          scale = max * Math.min(1, len(dx, dz))
        }
        const m = len(dx, dz)
        let sx = m > 1e-6 ? (dx / m) * scale : 0
        let sz = m > 1e-6 ? (dz / m) * scale : 0
        const edge = B * 0.85; const span = Math.max(B - edge, 1e-3); const push = Math.max(max, 1)
        // near a wall, the outward part of the wish is dropped and the rest keeps
        // full speed, so a cornered animal slides along the wall instead of
        // stalling where flight and containment cancel; wedged into a corner, it
        // slides out along the axis it was fleeing along least
        const outX = Math.abs(l.p[0]) > edge && sx * l.p[0] > 0
        const outZ = Math.abs(l.p[2]) > edge && sz * l.p[2] > 0
        if ((outX || outZ) && scale > 0) {
          const ox = sx; const oz = sz
          if (outX) sx = 0
          if (outZ) sz = 0
          if (outX && outZ) { if (Math.abs(ox) < Math.abs(oz)) sx = -Math.sign(l.p[0]) * scale; else sz = -Math.sign(l.p[2]) * scale }
          const r = len(sx, sz)
          if (r > 1e-6) { sx *= scale / r; sz *= scale / r }
        }
        if (Math.abs(l.p[0]) > edge) sx -= Math.sign(l.p[0]) * push * (Math.abs(l.p[0]) - edge) / span
        if (Math.abs(l.p[2]) > edge) sz -= Math.sign(l.p[2]) * push * (Math.abs(l.p[2]) - edge) / span
        const mine = ridingId(e)
        let n = 0
        for (const oid of l.sensed ?? []) {
          if (n++ >= 4) break
          const o = w.get(oid); if (!o?.c.body || !o.live.p || oid === mine || ridingId(o) === e.id) continue
          const ex = l.p[0] - o.live.p[0]; const ez = l.p[2] - o.live.p[2]; const d = len(ex, ez)
          const r = Number(c.body.radius ?? 0.5) + Number(o.c.body.radius ?? 0.5)
          if (d < r && d > 1e-6) { sx += (ex / d) * push * (r - d) / r; sz += (ez / d) * push * (r - d) / r }
        }
        l.desired = [sx, sz]
      }
    },
  })
}
