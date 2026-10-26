// The battle-setup panel (DESIGN §1.3, F6): what a title-screen mode button
// opens before its battle. Each seat's card says who plays it and its race
// (ui/screens/races.js: the races' buttons, the race's figures, a unit's
// stats under the pointer); Start the battle, or Back to the title. Its
// defaults are the page's races (?races=, else the classic matchup), and
// then the last ones chosen. Two seats of one race make a mirror match: the
// second army takes its race's other colours, and the panel says so. (F7a)
// The terrain line: the sets the battle's mission is fought on (its first,
// or ?terrain='s, then the last chosen), one button each. Later steps add
// the battle size (F8b) and the army (F11b).
import { RacePicker } from './races.js'

const $ = (s) => document.querySelector(s)

// (F7a) what each terrain set is called on the panel and in the lobby, and
// what is on it (a set without a line here is shown by its name)
export const TERRAINS = Object.freeze({
  classic: { name: 'Classic', what: 'ruins, woods, hedges and walls' },
  fortified: { name: 'Fortified', what: 'ramparts, bastions, towers and a keep to climb' },
})
export const terrainName = (set) => TERRAINS[set]?.name ?? set

export class SetupScreen {
  // `diorama()`: the race showcase (view/diorama.js), asked for only as the
  // panel first opens
  constructor({ diorama }) {
    this.diorama = diorama
    this.root = $('#setup')
    this.pickers = null
    this.on = null
  }

  get up() {
    return !this.root.classList.contains('hidden')
  }

  // { pick(seat, race), terrain(set), start(), back() }
  wire(on) {
    this.on = on
    $('#setupStart').onclick = () => on.start()
    $('#setupBack').onclick = () => on.back()
  }

  // { title, seats: [{ who, race, color }], mirror, (F7a) terrain: { sets,
  // pick } (the mission's sets and the one picked) }
  show({ title, seats, mirror, terrain = null }) {
    // (the pickers made once, as the panel first opens: nothing is drawn
    // before)
    this.pickers ??= [0, 1].map((s) => new RacePicker({ root: $(`#setup .setupSeat[data-seat="${s}"] .picker`), diorama: this.diorama(), pick: (race) => this.on.pick(s, race) }))
    $('#setupTitle').textContent = title
    seats.forEach((x, s) => {
      $(`#setup .setupSeat[data-seat="${s}"] .who`).textContent = x.who
      this.pickers[s].render({ race: x.race, color: x.color })
    })
    $('#setupMirror').classList.toggle('hidden', !mirror)
    this.terrainLine(terrain)
    this.root.classList.remove('hidden')
  }

  // (F7a) the terrain line: a button per set the mission is fought on, the
  // one picked pressed, and what is on it (none for a mission with one set)
  terrainLine(t) {
    const row = $('#setupTerrain')
    row.classList.toggle('hidden', !t || t.sets.length < 2)
    if (!t) return
    const opts = $('#setupTerrain .opts')
    opts.replaceChildren(...t.sets.map((set) => {
      const b = document.createElement('button')
      b.textContent = terrainName(set)
      b.dataset.terrain = set
      b.classList.toggle('on', set === t.pick)
      b.setAttribute('aria-pressed', String(set === t.pick))
      b.onclick = () => this.on.terrain(set)
      return b
    }))
    $('#setupTerrain .what').textContent = TERRAINS[t.pick]?.what ?? ''
  }

  hide() {
    this.root.classList.add('hidden')
    for (const p of this.pickers ?? []) p.close()
  }
}
