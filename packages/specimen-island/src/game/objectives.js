import { OBJECTIVES, MISSIONS } from '../data/objectives.js'
import { SPECIES_ORDER } from '../data/species.js'

// Runs the data-driven missions in data/objectives.js: the expedition from the
// start, later ones once the player takes them up. Unlocks objectives as their
// prerequisites complete, polls each active one's `done` test, and exposes a
// marker (a world point) for the compass and map.

export class Objectives {
  constructor(G) {
    this.G = G
    this.list = OBJECTIVES.map((o) => ({ mission: 'expedition', ...o, state: 'locked' }))
    this.timer = 0
    this.started = new Map([['expedition', 0]]) // mission id -> game time it began
    this.completed = new Set()
    this.refresh()
  }

  // the expedition is over (a later mission may still be running)
  get finished() {
    return this.completed.has('expedition')
  }

  byId(id) {
    return this.list.find((o) => o.id === id)
  }

  active() {
    return this.list.filter((o) => o.state === 'active')
  }

  isStarted(mission) {
    return this.started.has(mission)
  }

  startedAt(mission) {
    return this.started.get(mission) ?? 0
  }

  // Take up a mission (the debrief's Continue). Its objectives are tested on
  // the next poll, so whatever is already done completes straight away.
  start(id) {
    const m = MISSIONS[id]
    if (!m || this.started.has(id)) return
    this.started.set(id, this.G.time)
    this.G.events.emit('mission:start', { mission: m })
    this.refresh()
    this.timer = 0
  }

  refresh() {
    for (const o of this.list) {
      if (o.state !== 'locked' || !this.started.has(o.mission)) continue
      if ((o.after || []).every((id) => this.byId(id).state === 'done')) {
        o.state = 'active'
        if (this.G.started) this.G.toast(`New objective: ${o.title}`, 'objective')
      }
    }
  }

  test(o, d = o.done) {
    const G = this.G
    if (d.reach) {
      const p = G.island.poi[d.reach]
      const pos = G.vehicle ? G.vehicle.pos : G.player.pos
      return Math.hypot(p.x - pos.x, p.z - pos.z) < d.radius
    }
    if (d.flag) return G.flags.get(d.flag)
    if (d.item) return G.inventory.has(d.item)
    if (d.stat) return G.stats.get(d.stat) >= d.n
    if (d.allSpecies) return SPECIES_ORDER.every((id) => G.stats.has(d.allSpecies, id))
    if (d.any) return d.any.some((t) => this.test(o, t))
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
        if (o.final) this.complete(o.mission)
      }
    }
    if (changed) this.refresh()
  }

  complete(id) {
    this.completed.add(id)
    this.G.events.emit('mission:complete', { mission: MISSIONS[id] })
    if (id === 'expedition') this.G.events.emit('expedition:complete', {})
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
    if (d.allSpecies) return `${SPECIES_ORDER.length - this.missing(o).length}/${SPECIES_ORDER.length}`
    return ''
  }

  // The species an all-species objective is still waiting on.
  missing(o) {
    const set = o.done.allSpecies
    return set ? SPECIES_ORDER.filter((id) => !this.G.stats.has(set, id)) : []
  }

  // Those species as text: named once catalogued, otherwise only counted.
  // `max` caps how many names are listed ("…, 2 more").
  missingText(o, max = Infinity) {
    const G = this.G
    const miss = this.missing(o)
    const named = miss.filter((id) => G.science.known(id)).map((id) => G.species[id].name)
    const parts = named.slice(0, max)
    if (named.length > max) parts.push(`${named.length - max} more`)
    if (miss.length > named.length) parts.push(`${miss.length - named.length} unidentified`)
    return parts.join(', ')
  }
}
