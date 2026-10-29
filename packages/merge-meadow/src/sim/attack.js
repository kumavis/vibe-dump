// order 700: reach + cooldown -> a `hit` op written straight into the victim's
// health ledger by the ATTACKER's owner (design §4.3, §16.3). hitId =
// `${peerId}:${seq}`, seq = a per-session base + a counter, so a reload with the
// same tab peer id cannot reuse an id the ledger already holds.
import { compileFilter } from '../core/filters.js'
import { owned, dist, hpOf, isDead } from './util.js'

export function installAttack (world, { order, events, peerId, hitBase }) {
  let seq = 0
  const base = hitBase ?? Date.now().toString(36)
  world.addSystem({
    name: 'attack',
    order,
    query: ['attack', 'transform'],
    update (w, dt, set) {
      for (const e of owned(w, set)) {
        const c = e.c; const l = e.live
        l.cooldown = Math.max(0, (l.cooldown ?? 0) - dt)
        if (l.cooldown > 0 || !l.p) continue
        const ok = (t) => t && t !== e && t.c.health && t.live.p && !isDead(t) && hpOf(t) > 0
        const inReach = (t) => dist(l.p, t.live.p) <= Number(c.attack.reach ?? 1) + Number(c.body?.radius ?? 0.5) + Number(t.c.body?.radius ?? 0.5)
        let target = null
        if (c.attack.match) {
          const test = compileFilter(c.attack.match)
          for (const oid of l.sensed ?? []) { const o = w.get(oid); if (ok(o) && test({ self: e, other: o, world: w })) { if (inReach(o)) target = o; break } }
        } else if (l.intent?.target) {
          const acts = Array.isArray(c.attack.acts) && c.attack.acts.length ? c.attack.acts.map(String) : ['pursue']
          if (acts.includes(l.intent.act)) { const t = w.get(l.intent.target); if (ok(t) && inReach(t)) target = t }
        }
        if (!target) continue
        const hitId = `${peerId}:${base}.${++seq}`
        const amount = Number(c.attack.damage ?? 0)
        if (target.local) {
          // players are not in the doc: their owner keeps the ledger in live
          if (w.owns(target.id)) (target.live.hits ??= {})[hitId] = amount
          events.emit({ type: 'hit', id: target.id, from: e.id, hitId, amount })
        } else w.queueOps({ op: 'hit', id: target.id, hitId, amount })
        events.emit({ type: 'attack', id: e.id, target: target.id, hitId, amount })
        l.cooldown = Number(c.attack.cooldown ?? 1)
        l.attackT = w.time
      }
    },
  })
}
