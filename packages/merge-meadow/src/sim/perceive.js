// order 100: spatial hash -> live.sensed (ids within perception.radius, nearest
// first, ties by id). Every entity with a live pose is visible, owned or not:
// non-owned poses come from the stream.
import { owned } from './util.js'

const CELL = 8
export function installPerceive (world, { order }) {
  world.addSystem({
    name: 'perceive',
    order,
    query: ['transform', 'perception'],
    update (w, dt, set) {
      const mine = owned(w, set)
      if (!mine.length) return
      const grid = new Map()
      for (const o of w.entities.values()) {
        const p = o.live.p; if (!p) continue
        const k = Math.floor(p[0] / CELL) + ',' + Math.floor(p[2] / CELL)
        let a = grid.get(k); if (!a) grid.set(k, (a = [])); a.push(o)
      }
      for (const e of mine) {
        const l = e.live; if (!l.p) continue
        const r = Number(e.c.perception.radius) || 0; const r2 = r * r
        const cx = Math.floor(l.p[0] / CELL); const cz = Math.floor(l.p[2] / CELL); const n = Math.ceil(r / CELL)
        const out = []
        for (let i = -n; i <= n; i++) {
          for (let j = -n; j <= n; j++) {
            for (const o of grid.get((cx + i) + ',' + (cz + j)) ?? []) {
              if (o === e) continue
              const dx = o.live.p[0] - l.p[0]; const dz = o.live.p[2] - l.p[2]; const d2 = dx * dx + dz * dz
              if (d2 <= r2) out.push([d2, o.id])
            }
          }
        }
        out.sort((a, b) => a[0] - b[0] || (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0))
        l.sensed = out.map((x) => x[1])
      }
    },
  })
}
