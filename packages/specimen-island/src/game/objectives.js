import { OBJECTIVES } from '../data/objectives.js'

// Runs the data-driven expedition in data/objectives.js: unlocks objectives as
// their prerequisites complete, polls each active one's `done` test, and
// exposes a marker (a world point) for the compass and map.

export class Objectives {
  constructor(G) {
    this.G = G
    this.list = OBJECTIVES.map((o) => ({ ...o, state: 'locked' }))
    this.timer = 0
    this.finished = false
    this.refresh()
  }

  byId(id) {
    return this.list.find((o) => o.id === id)
  }

  active() {
    return this.list.filter((o) => o.state === 'active')
  }

  refresh() {
    for (const o of this.list) {
      if (o.state !== 'locked') continue
      if ((o.after || []).every((id) => this.byId(id).state === 'done')) {
        o.state = 'active'
        if (this.G.started) this.G.toast(`New objective: ${o.title}`, 'objective')
      }
    }
  }

  test(o) {
    const G = this.G
    const d = o.done
    if (d.reach) {
      const p = G.island.poi[d.reach]
      const pos = G.heli?.piloted ? G.heli.pos : G.player.pos
      return Math.hypot(p.x - pos.x, p.z - pos.z) < d.radius
    }
    if (d.flag) return G.flags.get(d.flag)
    if (d.item) return G.inventory.has(d.item)
    if (d.stat) return G.stats.get(d.stat) >= d.n
    return false
  }

  update(dt) {
    this.timer -= dt
    if (this.timer > 0) return
    this.timer = 0.4
    let changed = false
    for (const o of this.list) {
      if (o.state !== 'active') continue
      if (this.test(o)) {
        o.state = 'done'
        changed = true
        this.G.events.emit('objective:done', { objective: o })
        this.G.toast(`Objective complete: ${o.title}`, 'objective')
        if (o.final) {
          this.finished = true
          this.G.events.emit('expedition:complete', {})
        }
      }
    }
    if (changed) this.refresh()
  }

  // World-space point for an objective's marker, or null.
  marker(o) {
    const G = this.G
    const m = o.marker
    if (!m) return null
    if (typeof m === 'string') {
      const p = G.island.poi[m]
      return p ? { x: p.x, y: p.y + 2, z: p.z } : null
    }
    if (m.interactable) {
      const it = G.interact.get(m.interactable)
      return it ? { x: it.x, y: it.y, z: it.z } : null
    }
    return null
  }

  // Progress text for counters ("1/3").
  progress(o) {
    const d = o.done
    if (d.stat) return `${Math.min(d.n, this.G.stats.get(d.stat))}/${d.n}`
    return ''
  }
}
