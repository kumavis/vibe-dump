// order 200: brain.drives utility -> live.intent { act, target, from, speedMul, drive, score }.
// score = weight·(1 − d/range) + priority (+ stickiness for the current drive).
// A drive without `match` is about the entity itself (gated by `when`) and scores
// weight + priority. Drive keys are sorted: Automerge does not keep key order.
import { compileFilter } from '../core/filters.js'
import { owned, dist, ridingId } from './util.js'

export function installDecide (world, { order }) {
  world.addSystem({
    name: 'decide',
    order,
    query: ['brain'],
    update (w, dt, set) {
      for (const e of owned(w, set)) {
        const c = e.c; const l = e.live
        if (!l.p) continue
        const mount = ridingId(e)
        if (mount && w.get(mount)) { l.intent = { act: 'ride', target: mount, from: [], speedMul: 1, drive: null, score: 0 }; l.scores = []; continue }
        const drives = c.brain.drives ?? {}
        const sticky = Number(c.brain.stickiness ?? 0.15)
        const scores = []
        let best = null
        for (const name of Object.keys(drives).sort()) {
          const d = drives[name]
          if (!d || typeof d !== 'object') continue
          if (d.when && !compileFilter(d.when)({ self: e, other: e, world: w })) continue
          const bonus = l.intent?.drive === name ? sticky : 0
          const weight = Number(d.weight ?? 1); const prio = Number(d.priority ?? 0)
          let cand = null
          if (d.match) {
            const range = Number(d.range ?? c.perception?.radius ?? 10)
            const test = compileFilter(d.match)
            const from = []
            let near = Infinity
            for (const oid of l.sensed ?? []) {
              const o = w.get(oid); if (!o?.live.p) continue
              const dd = dist(l.p, o.live.p)
              if (dd > range) break
              if (!test({ self: e, other: o, world: w })) continue
              if (!from.length) near = dd
              if (from.length < 8) from.push(oid)
            }
            if (from.length) cand = { u: weight * (1 - near / Math.max(range, 1e-6)) + prio + bonus, target: from[0], from }
          } else cand = { u: weight + prio + bonus, target: null, from: [] }
          if (!cand) continue
          scores.push({ name, score: Math.round(cand.u * 1000) / 1000, target: cand.target })
          if (!best || cand.u > best.u) best = { ...cand, drive: name, act: String(d.act ?? 'idle'), speedMul: Number(d.speedMul ?? 1), distance: d.distance }
        }
        l.scores = scores
        l.intent = best
          ? { act: best.act, target: best.target, from: best.from, speedMul: best.speedMul, drive: best.drive, score: best.u, distance: best.distance }
          : { act: String(c.brain.idle ?? 'wander'), target: null, from: [], speedMul: 1, drive: null, score: 0 }
      }
    },
  })
}
