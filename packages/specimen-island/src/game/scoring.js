// The Foundation's ledger. Science earns points; killing costs them — the
// whole incentive structure of the game lives in this one listener table.

export const RANKS = [
  { min: 6000, title: 'Foundation Fellow' },
  { min: 3500, title: 'Distinguished Naturalist' },
  { min: 2000, title: 'Senior Field Biologist' },
  { min: 900, title: 'Field Biologist' },
  { min: 200, title: 'Research Assistant' },
  { min: -Infinity, title: 'Poacher (contract terminated)' },
]

export class Scoring {
  constructor(G) {
    this.G = G
    this.total = 0
    this.ledger = []
    this.byCategory = { science: 0, bonus: 0, penalty: 0, photo: 0 }
    const ev = G.events
    ev.on('science:scan', ({ creature, points, first }) => this.add(points, `${first ? 'Catalogued' : 'Logged'} ${creature.sp.name}`, 'science'))
    ev.on('science:done', ({ creature, procedure, points, ghost }) => {
      const what = { blood: 'Blood sample', measure: 'Measurements', tag: 'Tracking tag', tissue: 'Tissue sample' }[procedure]
      this.add(points, `${what}: ${creature.sp.name}${ghost ? ' (unseen ×1.5)' : ''}`, 'science')
    })
    // photos pay per species: the first shot by quality, retakes only the improvement
    ev.on('photo:taken', ({ species, stars, points }) => {
      const name = G.science.known(species) ? G.species[species].name : 'Unknown animal'
      this.add(points, `Photo: ${name} ${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}`, 'photo')
    })
    ev.on('creature:died', ({ creature, cause }) => {
      if (cause === 'predation' || !creature.rec.hitByPlayer) return
      const pen = creature.sp.killPenalty
      this.add(-pen, cause === 'overdose' ? `Overdose: ${creature.sp.name}` : `Killed: ${creature.sp.name}`, 'penalty')
    })
    ev.on('player:died', () => this.add(-250, 'Medical evacuation', 'penalty'))
    ev.on('objective:done', ({ objective }) => this.add(objective.final ? 500 : 100, `Objective: ${objective.title}`, 'bonus'))
  }

  add(delta, reason, category) {
    if (!delta) return
    this.total += delta
    this.byCategory[category] = (this.byCategory[category] || 0) + delta
    this.ledger.push({ delta, reason, category, time: this.G.time })
    this.G.events.emit('score', { delta, reason, category })
  }

  rank() {
    return RANKS.find((r) => this.total >= r.min).title
  }
}
