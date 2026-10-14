import { SPECIES, SPECIES_ORDER } from '../data/species.js'
import { WEAPONS } from '../data/weapons.js'
import { doseCard } from './dose.js'

// Field journal: the species catalogue (filled in by scanning), what you have
// collected from each, and the Foundation's running ledger of your conduct.

export class Journal {
  constructor(G, el) {
    this.G = G
    this.el = el
    this.open = false
    this.tab = 'species'
    el.addEventListener('click', (e) => {
      const t = e.target.closest('[data-tab]')
      if (t) {
        this.tab = t.dataset.tab
        this.render()
      }
    })
  }

  toggle(force) {
    this.open = force ?? !this.open
    this.el.classList.toggle('show', this.open)
    if (this.open) this.render()
  }

  render() {
    const G = this.G
    const sum = G.science.summary()
    const tabs = `<div class="tabs"><button data-tab="species" class="${this.tab === 'species' ? 'on' : ''}">Species</button><button data-tab="ledger" class="${this.tab === 'ledger' ? 'on' : ''}">Ledger</button><button data-tab="help" class="${this.tab === 'help' ? 'on' : ''}">Field manual</button></div>`
    let body = ''
    if (this.tab === 'species') {
      body = '<div class="cards">'
      for (const id of SPECIES_ORDER) {
        const sp = SPECIES[id]
        const s = sum[id]
        if (!s.scanned) {
          body += `<div class="card unknown"><h3>Unknown species</h3><p>Catalogue it with the Field Scanner to unlock its file.</p></div>`
          continue
        }
        const marks = ['blood', 'measure', 'tag', 'tissue'].map((k) => `<span class="${s[k] ? 'done' : ''}">${k}${s[k] > 1 ? ' ×' + s[k] : ''}</span>`).join('')
        const dose = doseCard(sp.sedation)
        body += `<div class="card t-${sp.temperament}"><h3>${sp.name}</h3><em>${sp.latin}</em><p>${sp.blurb}</p>
          <dl><dt>Temperament</dt><dd>${sp.temperament}</dd><dt>Mass</dt><dd>${sp.mass.toLocaleString()} kg</dd>
          <dt>Knockout</dt><dd>${dose.ko}</dd>
          <dt>Overdose</dt><dd>${dose.od}</dd>
          <dt>Blood value</dt><dd>${sp.science.blood} pts</dd><dt>Kill penalty</dt><dd class="bad">−${sp.killPenalty}</dd></dl>
          <div class="sci">${marks}</div>${s.kills ? `<div class="bad">Killed: ${s.kills}</div>` : ''}</div>`
      }
      body += '</div>'
    } else if (this.tab === 'ledger') {
      const L = G.scoring.ledger.slice(-40).reverse()
      body = `<div class="ledger"><div class="tot">${G.scoring.total} pts — <b>${G.scoring.rank()}</b></div>
        <div class="cats">Science ${G.scoring.byCategory.science || 0} · Objectives ${G.scoring.byCategory.bonus || 0} · Penalties ${G.scoring.byCategory.penalty || 0}</div>
        ${L.map((e) => `<div class="row ${e.delta < 0 ? 'bad' : ''}"><span>${e.reason}</span><b>${e.delta > 0 ? '+' : ''}${e.delta}</b></div>`).join('') || '<p>No entries yet.</p>'}
        <div class="cats">Shots fired: ${G.stats.get('shots:pistol') + G.stats.get('shots:rifle')} darts · ${G.stats.get('shots:hunting') + G.stats.get('shots:shotgun')} lethal · Knockouts ${G.stats.get('knockouts')} · Times spotted ${G.stats.get('detections')}</div></div>`
    } else {
      body = `<div class="manual">
        <h3>The charter</h3><p>Scan, sedate, sample, release. Science earns points; every animal that dies by your hand — bullet or overdose — costs points. A procedure on an animal that never noticed you is worth half again.</p>
        <h3>Staying unseen</h3><p>The eye in the corner is how visible you are. Crouch [C] in ferns, reeds and tall grass; move slowly; keep the wind (see map) blowing from them to you — downwind animals smell you. Night hides you, the flashlight [F] does not. Arcs around the reticle show who has noticed you: white curious, yellow suspicious, red alerted.</p>
        <h3>Darting</h3><p>Darts take a few seconds to work — a darted predator can still reach you. Neck and head carry more dose; legs and tail less; armour stops darts cold. Too much sedative is an overdose. Scan a species to see its knockout and overdose lines on the target readout.</p>
        <h3>Procedures</h3><p>Stand over a sedated animal and hold [E]: blood, then measurements, then a tracking tag (tagged animals show on the map). Watch for “waking soon”. Dead animals yield only a tissue sample.</p>
        <h3>Tools</h3><p>[G] throws a stone — a noise somewhere else. [T] lights a flare — animals will not come near it for twenty seconds. [H] uses a medkit. [R] reloads, right mouse aims.</p>
        <h3>Temperaments</h3><p>Skittish animals bolt and take the herd with them. Defensive ones threaten inside their personal space and charge if you push — or shoot. Aggressive ones hunt you. Passive giants ignore you; do not stand underfoot.</p></div>`
    }
    this.el.querySelector('.inner').innerHTML = `<h2>Field Journal</h2>${tabs}${body}<div class="foot">[J] / [Tab] close</div>`
  }
}
