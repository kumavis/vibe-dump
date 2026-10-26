// The battle-setup panel (DESIGN §1.3, F6): what a title-screen mode button
// opens before its battle. Each seat's card says who plays it and its race
// (ui/screens/races.js: the races' buttons, the race's figures, a unit's
// stats under the pointer); Start the battle, or Back to the title. Its
// defaults are the page's races (?races=, else the classic matchup), and
// then the last ones chosen. Two seats of one race make a mirror match: the
// second army takes its race's other colours, and the panel says so. (F7a)
// The terrain line: the sets the battle's mission is fought on (its first,
// or ?terrain='s, then the last chosen), one button each. A later step adds
// the army (F11b).
//
// (F8b) The battle size: a line of the missions (Skirmish, Field, Grand),
// each with its board and points, the one chosen named under them with its
// rounds; its default the flow's mission (?mission=, else classic; then the
// last chosen). Grand is offered on a phone too (open question 16), with a
// note that it is best on a larger screen. The sizes come from the page
// (app/boot.js reads the missions), so this panel imports no rules data.
// The size's sets are the terrain line's options.
import { RacePicker } from './races.js'

const $ = (s) => document.querySelector(s)

// (F7a) what each terrain set is called on the panel and in the lobby, and
// what is on it (a set without a line here is shown by its name)
export const TERRAINS = Object.freeze({
  classic: { name: 'Classic', what: 'ruins, woods, hedges and walls' },
  fortified: { name: 'Fortified', what: 'ramparts, bastions, towers and a keep to climb' },
  // (F8b's set, the larger tables')
  open: { name: 'Open', what: 'ruins, woods, hedges and walls, spread over the larger table' },
})
export const terrainName = (set) => TERRAINS[set]?.name ?? set

// a phone's screen: narrow, or a coarse pointer on a small one
export const phoneScreen = () => innerWidth < 700 || (!!globalThis.matchMedia?.('(pointer: coarse)').matches && Math.min(innerWidth, innerHeight) < 600)

export class SetupScreen {
  // `diorama()`: the race showcase (view/diorama.js), asked for only as the
  // panel first opens
  constructor({ diorama }) {
    this.diorama = diorama
    this.root = $('#setup')
    this.pickers = null
    this.on = null
    // (F8b) the size line, made as the panel first shows it
    this.sizeRow = null
  }

  get up() {
    return !this.root.classList.contains('hidden')
  }

  // { pick(seat, race), terrain(set), size(mission), start(), back() }
  wire(on) {
    this.on = on
    $('#setupStart').onclick = () => on.start()
    $('#setupBack').onclick = () => on.back()
  }

  // { title, seats: [{ who, race, color }], mirror, (F8b) sizes: [{
  // mission, name, W, H, points, rounds }], size (the chosen one's mission),
  // (F7a) terrain: { sets, pick } (the mission's sets and the one picked) }
  show({ title, seats, mirror, sizes = [], size = null, terrain = null }) {
    // (the pickers made once, as the panel first opens: nothing is drawn
    // before)
    this.pickers ??= [0, 1].map((s) => new RacePicker({ root: $(`#setup .setupSeat[data-seat="${s}"] .picker`), diorama: this.diorama(), pick: (race) => this.on.pick(s, race) }))
    $('#setupTitle').textContent = title
    seats.forEach((x, s) => {
      $(`#setup .setupSeat[data-seat="${s}"] .who`).textContent = x.who
      this.pickers[s].render({ race: x.race, color: x.color })
    })
    this.sizes(sizes, size)
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

  // (F8b) The size line: a button per size (its name, its board and points),
  // the chosen one lit, and a line saying what it is.
  sizes(sizes, size) {
    if (!sizes.length) return
    if (!this.sizeRow) {
      const row = (this.sizeRow = document.createElement('div'))
      row.id = 'setupSize'
      row.setAttribute('role', 'radiogroup')
      row.setAttribute('aria-label', 'Battle size')
      const note = document.createElement('p')
      note.id = 'setupSizeNote'
      note.className = 'small'
      $('#setupMirror').before(row, note)
    }
    const phone = phoneScreen()
    const lbl = document.createElement('span')
    lbl.className = 'lbl'
    lbl.textContent = 'Battle size'
    const buttons = sizes.map((s) => {
      const b = document.createElement('button')
      b.dataset.size = s.mission
      b.className = s.mission === size ? 'on' : ''
      b.setAttribute('role', 'radio')
      b.setAttribute('aria-checked', String(s.mission === size))
      b.append(s.name)
      const small = document.createElement('small')
      small.textContent = `${s.W}×${s.H} · ${s.points.toLocaleString('en')} pts`
      b.append(small)
      b.onclick = () => this.on.size?.(s.mission)
      return b
    })
    this.sizeRow.replaceChildren(lbl, ...buttons)
    const at = sizes.find((s) => s.mission === size) ?? sizes[0]
    const big = phone && at.W * at.H > 60 * 40
    $('#setupSizeNote').textContent = `${at.name}: ${/^8/.test(String(at.W)) ? 'an' : 'a'} ${at.W}×${at.H} board, ${at.points.toLocaleString('en')} points a side, ${at.rounds} rounds.${big ? ' Best on a larger screen.' : ''}`
  }

  hide() {
    this.root.classList.add('hidden')
    for (const p of this.pickers ?? []) p.close()
  }
}
