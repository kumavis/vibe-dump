// order 900: Bedrock-style reactions. For each event of the previous tick about
// an entity this peer owns, `on[event.type]` adds/removes component groups (a
// doc write by the owner, idempotent: groups are a map of true).
export function installEvents (world, { order, events }) {
  world.addSystem({
    name: 'events',
    order,
    query: ['on'],
    update (w) {
      const list = events.events()
      if (!list.length) return
      const done = new Set()
      for (const ev of list) {
        if (!ev.id || done.has(`${ev.id}|${ev.type}`)) continue
        const e = w.get(ev.id)
        if (!e || e.local || !e.c.on || !w.owns(e.id)) continue
        done.add(`${ev.id}|${ev.type}`)
        const r = e.c.on[ev.type]
        if (!r || typeof r !== 'object') continue
        for (const g of r.add ?? []) if (!e.groups.has(String(g))) w.queueOps({ op: 'addGroup', id: e.id, group: String(g) })
        for (const g of r.remove ?? []) if (e.groups.has(String(g))) w.queueOps({ op: 'removeGroup', id: e.id, group: String(g) })
      }
    },
  })
}
