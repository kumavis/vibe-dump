import { SPECIES, SPECIES_ORDER } from '../data/species.js'
import { WEAPONS } from '../data/weapons.js'
import { doseCard, jabCard } from './dose.js'
import { starHtml } from '../player/photos.js'
import { formatTime } from '../core/mathx.js'

// Every lethal round fired: the guns marked lethal, and every missile launched.
const lethalShots = (G) => Object.keys(WEAPONS).reduce((n, id) => n + (WEAPONS[id].lethal ? G.stats.get(`shots:${id}`) : 0), G.stats.get('shots:missile'))

// Field journal: the species catalogue (filled in by scanning), what you have
// collected from each, the photo album (each species' best shot), and the
// Foundation's running ledger of your conduct.

const BIOMES = { jungle: 'jungle', beach: 'the beaches', swamp: 'swamp', grass: 'grassland', highland: 'the highlands' }

// What the Foundation's old records say about a species nobody has scanned yet:
// enough to go looking for it, not its name. Derived from the species data, so
// a new species gets one for free.
function sightingNote(sp) {
  const size = sp.mass < 20 ? 'Tiny' : sp.mass < 150 ? 'Small' : sp.mass < 1000 ? 'Mid-sized' : sp.mass < 10000 ? 'Large' : 'Giant'
  const [lo, hi] = sp.herd
  const group = hi <= 1 ? 'solitary' : hi === 2 ? 'alone or in pairs' : `groups of ${lo}–${hi}`
  const where = Object.entries(sp.habitat)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([b]) => BIOMES[b] || b)
    .join(' and ')
  return `${size} ${sp.diet}, ${group}; last recorded in ${where}.`
}

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
    const tab = (id, label) => `<button data-tab="${id}" class="${this.tab === id ? 'on' : ''}">${label}</button>`
    const tabs = `<div class="tabs">${tab('species', 'Species')}${tab('photos', 'Photos')}${tab('ledger', 'Ledger')}${tab('help', 'Field manual')}</div>`
    let body = ''
    if (this.tab === 'species') {
      const n = SPECIES_ORDER.length
      const O = G.objectives
      // what the active objectives still want from each species (the Full Survey)
      const open = O.active().filter((o) => o.need && O.missing(o).length)
      const needs = {}
      for (const o of open) for (const id of O.missing(o)) (needs[id] ||= []).push(O.need(o, id))
      const needLine = (id) => (needs[id] ? `<div class="need">Still needed: ${needs[id].join(', ')}${O.extinct(id) ? ' — none left alive' : ''}</div>` : '')
      const photo = (id) => `<span class="${G.photos.album[id] ? 'done' : ''}">photo</span>`
      body = `<div class="ledger"><div class="cats">Catalogued ${G.science.catalogue.size}/${n} · Blood from ${G.stats.get('speciesBlood')}/${n} species · Photographed ${G.photos.count}/${n}${open
        .map((o) => `<br><b>${o.title} ${O.progress(o)}</b> — still needed: ${O.missingText(o)}`)
        .join('')}</div></div><div class="cards">`
      // each melee syringe carried gets its own row of jabs
      const melee = Object.values(WEAPONS).filter((w) => w.kind === 'melee' && G.inventory.weapons.has(w.id))
      for (const id of SPECIES_ORDER) {
        const sp = SPECIES[id]
        const s = sum[id]
        if (!s.scanned) {
          const note = needs[id] ? `<p class="sighting">Foundation records: ${sightingNote(sp)}</p>` : ''
          body += `<div class="card unknown${needs[id] ? ' needed' : ''}"><h3>Unknown species</h3><p>Catalogue it with the Field Scanner to unlock its file.</p>${note}<div class="sci"><span>scan</span>${photo(id)}</div>${needLine(id)}</div>`
          continue
        }
        const marks = ['blood', 'measure', 'tag', 'tissue'].map((k) => `<span class="${s[k] ? 'done' : ''}">${k}${s[k] > 1 ? ' ×' + s[k] : ''}</span>`).join('') + photo(id)
        const dose = doseCard(sp)
        body += `<div class="card t-${sp.temperament}${needs[id] ? ' needed' : ''}"><h3>${sp.name}</h3><em>${sp.latin}</em><p>${sp.blurb}</p>
          <dl><dt>Temperament</dt><dd>${sp.temperament}</dd><dt>Mass</dt><dd>${sp.mass.toLocaleString()} kg</dd>
          <dt>Knockout</dt><dd>${dose.ko}</dd>
          <dt>Overdose</dt><dd>${dose.od}</dd>
          ${melee.map((w) => `<dt>${w.name}</dt><dd>${jabCard(sp, w)}</dd>`).join('')}
          <dt>Blood value</dt><dd>${sp.science.blood} pts</dd><dt>Kill penalty</dt><dd class="bad">−${sp.killPenalty}</dd></dl>
          <div class="sci">${marks}</div>${needLine(id)}${s.kills ? `<div class="bad">Killed: ${s.kills}</div>` : ''}</div>`
      }
      body += '</div>'
    } else if (this.tab === 'photos') {
      body = this.photos()
    } else if (this.tab === 'ledger') {
      const L = G.scoring.ledger.slice(-40).reverse()
      body = `<div class="ledger"><div class="tot">${G.scoring.total} pts — <b>${G.scoring.rank()}</b></div>
        <div class="cats">Science ${G.scoring.byCategory.science || 0} · Photos ${G.scoring.byCategory.photo || 0} · Objectives ${G.scoring.byCategory.bonus || 0} · Penalties ${G.scoring.byCategory.penalty || 0}</div>
        ${L.map((e) => `<div class="row ${e.delta < 0 ? 'bad' : ''}"><span>${e.reason}</span><b>${e.delta > 0 ? '+' : ''}${e.delta}</b></div>`).join('') || '<p>No entries yet.</p>'}
        <div class="cats">Shots fired: ${G.stats.get('shots:pistol') + G.stats.get('shots:rifle')} darts · ${lethalShots(G)} lethal · Knockouts ${G.stats.get('knockouts')} · Times spotted ${G.stats.get('detections')}</div></div>`
    } else {
      body = `<div class="manual">
        <h3>The charter</h3><p>Scan, sedate, sample, release. Science earns points; every animal that dies by your hand — bullet or overdose — costs points. A procedure on an animal that never noticed you is worth half again.</p>
        <h3>Staying unseen</h3><p>The eye in the corner is how visible you are. Crouch [C] in ferns, reeds and tall grass; move slowly; keep the wind (see map) blowing from them to you — downwind animals smell you. Night hides you, the flashlight [F] does not. Arcs around the reticle show who has noticed you: white curious, yellow suspicious, red alerted.</p>
        <h3>Darting</h3><p>Darts take a few seconds to soak in — a darted predator can still reach you — and the animal keeps clearing sedative all the while, so the knockout counts on the target readout allow for what it burns off at a steady rate of fire. Neck and head carry more dose; legs and tail less; armour stops darts cold. Too much sedative is an overdose: a red line on the readout means the next dart there would kill. Scan a species to see its lines.</p>
        <h3>Procedures</h3><p>Stand over a sedated animal and hold [E]: blood, then measurements, then a tracking tag (tagged animals show on the map). Watch for “waking soon”. Dead animals yield only a tissue sample.</p>
        <h3>Jumbo syringe</h3><p>The old keepers dosed the sauropods by hand, with a pole syringe kept in a shed at Paddock C's gate. [7] selects it; left mouse thrusts the needle along your aim, and only an animal within reach — under three metres, IN REACH on the readout — takes it. A hit empties one whole cartridge into the animal wherever the needle goes in (armour still turns it); a miss costs only the swing. It is quiet, but you have to stand beside the animal: UNDERFOOT on the readout means a sauropod will trample you as soon as it walks, and a jabbed predator turns on you while the next cartridge goes in. Two jabs drop an adult brachiosaur, one a stegosaur, trike or anky — and one kills anything smaller. With the generator running, the Field Lab's cold store restocks the cartridges.</p>
        <h3>Field Camera</h3><p>[6] Hold right mouse to raise it to your eye; the wheel turns the zoom ring; left mouse takes the picture (then a second to wind on). A photo is graded on how much of the frame the animal fills, how much of it you can actually see — leaves and grass count — whether its head is in, a rule-of-thirds point over dead centre, a steady hand, and what it is doing: a roar or a charge beats a nap, and an animal that never noticed you is worth more. Each species pays its photo value once, scaled by quality; a better retake pays only the difference. The album is the Photos tab.</p>
        <h3>Vehicles</h3><p>Walk up to a door of the station jeep or the helicopter and press [E]; [E] again gets you out once it has stopped or landed, and [V] switches the camera. Jeep: [W]/[S] drive, [A]/[D] steer, [Space] handbrake, [F] headlights. It fords water up to the axles and no deeper, and anything small under the bull bar counts as a kill. Helicopter: [Space]/[Shift] climb and descend, [W]/[S] pitch, [A]/[D] slide, the mouse turns; it burns fuel, and a hard landing costs hull. A wreck can be patched up where it lies — hold [E] on it — enough to limp home; the pump on the lab helipad refuels and repairs properly.</p>
        <h3>Tools</h3><p>[G] throws a stone — a noise somewhere else. [T] lights a flare — animals will not come near it for twenty seconds. [H] uses a medkit. [R] reloads, right mouse aims. [J] or [Tab] opens this journal, [M] the map.</p>
        <h3>Full Survey</h3><p>When the expedition is over its debrief offers a second season: scan every species and draw blood from every one of them. Everything collected on the expedition counts, and a species wiped out before you drew its blood will have to make do with a carcass’s tissue. The Species tab marks what each animal still owes the survey, and for species you have not met yet it gives the Foundation’s old sighting notes — size, company and haunts. A brachiosaur goes through rifle darts faster than you can find them; the keeper’s jumbo syringe at Paddock C was made for it.</p>
        <h3>Temperaments</h3><p>Skittish animals bolt and take the herd with them. Defensive ones threaten inside their personal space and charge if you push — or shoot. Aggressive ones hunt you. Passive giants ignore you; do not stand underfoot.</p></div>`
    }
    this.el.querySelector('.inner').innerHTML = `<h2>Field Journal</h2>${tabs}${body}<div class="foot">[J] / [Tab] close</div>`
  }

  // The album: one frame per species, its best photo or an empty frame.
  photos() {
    const G = this.G
    const P = G.photos
    let html = `<div class="ledger"><div class="cats">${P.count}/${SPECIES_ORDER.length} species photographed · ${G.scoring.byCategory.photo || 0} pts · ${P.shots} shot${P.shots === 1 ? '' : 's'} taken. A species pays its photo value once, scaled by quality — a retake pays only the improvement.</div></div><div class="album">`
    for (const id of SPECIES_ORDER) {
      const sp = SPECIES[id]
      const a = P.album[id]
      if (!a) {
        html += `<div class="pcard empty"><div class="pframe"><span>?</span></div><h3>${G.science.known(id) ? sp.name : 'Not yet photographed'}</h3><p>Worth up to ${sp.science.photo} pts</p></div>`
        continue
      }
      const name = G.science.known(id) ? sp.name : 'Unknown animal'
      const img = a.image ? `<img src="${a.image}" alt="${name}" />` : '<span>developing…</span>'
      html += `<div class="pcard"><div class="pframe">${img}</div><h3>${name} <span class="st">${starHtml(a.stars)}</span></h3><p>${a.pose} · ${a.dist} m · ${formatTime(a.hours)}</p><p>quality ${a.quality} · ${a.points}/${sp.science.photo} pts</p></div>`
    }
    return html + '</div>'
  }
}
