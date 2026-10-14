// World flags and running statistics. Objectives, structures and the debrief
// read these; everything that changes them goes through set()/bump() so the
// change is announced on the bus.

export class Flags {
  constructor(events) {
    this.events = events
    this.values = {}
  }
  get(name) {
    return !!this.values[name]
  }
  set(name, value = true) {
    if (this.values[name] === value) return
    this.values[name] = value
    this.events.emit('flag', { flag: name, value })
  }
}

export class Stats {
  constructor(events) {
    this.events = events
    this.counters = {}
    this.sets = {}
    // derive the counters objectives care about straight from the bus
    events.on('science:scan', ({ creature, first }) => {
      if (first) this.addToSet('speciesScanned', creature.species.id)
      this.bump('scans')
    })
    events.on('science:done', ({ creature, procedure }) => {
      this.bump(procedure)
      this.bump(`${procedure}:${creature.species.id}`)
      if (procedure === 'blood') this.addToSet('speciesBlood', creature.species.id)
    })
    events.on('creature:died', ({ creature, cause }) => {
      if (cause === 'predation') return this.bump('predation')
      this.bump('kills')
      this.bump(`kill:${creature.species.id}`)
      if (cause === 'overdose') this.bump('overdoses')
    })
    events.on('creature:ko', () => this.bump('knockouts'))
    events.on('weapon:fired', ({ weapon }) => this.bump(`shots:${weapon}`))
    events.on('creature:detected', () => this.bump('detections'))
  }
  get(name) {
    if (this.sets[name]) return this.sets[name].size
    return this.counters[name] || 0
  }
  bump(name, by = 1) {
    this.counters[name] = (this.counters[name] || 0) + by
  }
  addToSet(name, value) {
    ;(this.sets[name] ||= new Set()).add(value)
  }
  has(name, value) {
    return !!this.sets[name] && this.sets[name].has(value)
  }
}
