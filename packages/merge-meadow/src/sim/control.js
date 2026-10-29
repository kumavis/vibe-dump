// order 300: controller.kind == 'input' -> live.input; a rider in a controlling
// seat steers its mount unless the mount's winning drive has priority >= the
// mount's panicPriority. move is a world-space [x, z] direction, |move| <= 1.
import { owned, ridingId, rid } from './util.js'

export function installControl (world, { order, inputs }) {
  world.addSystem({
    name: 'control',
    order,
    query: ['controller'],
    update (w, dt, set) {
      const mine = owned(w, set)
      if (!mine.length) return
      const all = inputs?.() ?? null
      const steered = new Set() // first rider id wins a contested seat
      for (const e of mine) {
        if (rid(e.c.controller.kind || 'input') !== 'input') continue
        const raw = all?.get?.(e.id)?.move
        const move = Array.isArray(raw) ? [Number(raw[0]) || 0, Number(raw[1]) || 0] : [0, 0]
        const m = Math.hypot(move[0], move[1]); if (m > 1) { move[0] /= m; move[1] /= m }
        e.live.input = { move }
        const mountId = ridingId(e)
        if (mountId) {
          const mt = w.get(mountId)
          const seat = mt?.c.mount?.seats?.[Number(e.c.rider.seat ?? 0)]
          if (mt && seat?.controls && w.owns(mountId) && !steered.has(mountId)) {
            steered.add(mountId)
            const cur = mt.live.intent
            const prio = cur?.drive ? Number(mt.c.brain?.drives?.[cur.drive]?.priority ?? 0) : -Infinity
            const panic = Number(mt.c.mount.panicPriority ?? Infinity)
            if (!(prio >= panic)) mt.live.intent = { act: 'steer', vec: move, target: null, from: [], speedMul: 1, drive: null, by: e.id, score: 0 }
          }
          e.live.intent = { act: 'ride', target: mountId, from: [], speedMul: 1, drive: null, score: 0 }
        } else if (e.c.body && !e.c.brain) e.live.intent = { act: 'steer', vec: move, target: null, from: [], speedMul: 1, drive: null, score: 0 }
      }
    },
  })
}
