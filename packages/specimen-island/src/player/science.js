import { SPECIES } from '../data/species.js'
import { OBLIVIOUS } from '../actors/perception.js'

// Field science — the point of the expedition. Scanning catalogues a species
// (and unlocks its vitals readout); a sedated animal offers procedures you hold
// E to perform, one after another, while its sedative wears off. Dead animals
// still yield a tissue sample, worth a fraction of live blood.

export const PROCEDURES = {
  blood: { label: 'Draw blood sample', hold: 3.2 },
  measure: { label: 'Take measurements', hold: 2.4 },
  tag: { label: 'Attach tracking tag', hold: 2.8 },
  tissue: { label: 'Take tissue sample', hold: 3.0 },
}
const LIVE_ORDER = ['blood', 'measure', 'tag']

export class Science {
  constructor(G) {
    this.G = G
    this.catalogue = new Set() // species ids scanned at least once
    G.interact.addProvider(() => this.procedures())
  }

  known(id) {
    return this.catalogue.has(id)
  }

  scan(c) {
    const G = this.G
    if (c.rec.scanned) return
    c.rec.scanned = true
    const first = !this.catalogue.has(c.sp.id)
    this.catalogue.add(c.sp.id)
    const unaware = c.perception.awareness < OBLIVIOUS && c.vitals.conscious
    let points = first ? c.sp.science.scan : Math.round(c.sp.science.scan * 0.3)
    if (unaware) points = Math.round(points * 1.25)
    G.events.emit('science:scan', { creature: c, first, points, unaware })
    G.audio?.play('scan')
    G.toast(first ? `New species catalogued: ${c.sp.name}` : `${c.sp.name} individual logged`, 'science')
  }

  nextProcedure(c) {
    const r = c.rec
    if (!c.vitals.alive) return r.science.tissue || r.science.blood ? null : 'tissue'
    for (const p of LIVE_ORDER) if (!r.science[p]) return p
    return null
  }

  // Interactables offered on every downed animal near the player.
  procedures() {
    const G = this.G
    const out = []
    if (G.vehicle) return out // no fieldwork from the driving seat
    const p = G.player.pos
    for (const c of G.ecology.active) {
      if (c.vitals.conscious) continue
      const d = Math.hypot(c.pos.x - p.x, c.pos.z - p.z)
      if (d > c.radius + 4) continue
      out.push(this.interactableFor(c))
    }
    return out
  }

  interactableFor(c) {
    c._sci ||= {
      id: 'sci:' + c.rec.id,
      radius: c.radius + 2.6,
      dynamic: () => {
        const m = c.center()
        m.y = Math.min(m.y, c.pos.y + 1.2)
        return m
      },
      label: () => {
        const p = this.nextProcedure(c)
        if (!p) return `${c.sp.name}: fully processed`
        const warn = c.vitals.alive && c.vitals.sedation < 0.8 ? ' — WAKING SOON' : ''
        return `${PROCEDURES[p].label} — ${c.sp.name}${warn}`
      },
      enabled: () => {
        if (!this.nextProcedure(c)) return 'Nothing more to collect'
        if (c.vitals.alive && c.vitals.conscious) return 'It is awake!'
        return true
      },
      onUse: () => this.perform(c),
    }
    c._sci.hold = PROCEDURES[this.nextProcedure(c) || 'blood'].hold
    return c._sci
  }

  perform(c) {
    const G = this.G
    const proc = this.nextProcedure(c)
    if (!proc) return
    // hands-on work identifies the animal even if it was never scanned
    if (!c.rec.scanned) this.scan(c)
    c.rec.science[proc] = true
    const sci = c.sp.science
    let points = proc === 'tissue' ? Math.round(sci.blood * 0.3) : sci[proc]
    // it never knew you were there: ghost bonus
    const ghost = proc !== 'tissue' && !c.rec.spotted
    if (ghost) points = Math.round(points * 1.5)
    if (proc === 'tag') c.rec.tagged = true
    G.events.emit('science:done', { creature: c, procedure: proc, points, ghost })
    G.audio?.play('sample')
    G.toast(`${PROCEDURES[proc].label} — ${c.sp.name}${ghost ? ' (unseen)' : ''}`, 'science')
  }

  // Journal summary per species.
  summary() {
    const G = this.G
    const out = {}
    for (const id in SPECIES) {
      out[id] = {
        scanned: this.catalogue.has(id),
        blood: G.stats.get('blood:' + id),
        measure: G.stats.get('measure:' + id),
        tag: G.stats.get('tag:' + id),
        tissue: G.stats.get('tissue:' + id),
        kills: G.stats.get('kill:' + id),
      }
    }
    return out
  }
}
