// The battle-setup panel (DESIGN §1.3, F6): what a title-screen mode button
// opens before its battle. Each seat's card says who plays it and its race
// (ui/screens/races.js: the races' buttons, the race's figures, a unit's
// stats under the pointer); Start the battle, or Back to the title. Its
// defaults are the page's races (?races=, else the classic matchup), and
// then the last ones chosen. Two seats of one race make a mirror match: the
// second army takes its race's other colours, and the panel says so. Later
// steps add the terrain (F7a), the battle size (F8b) and the army (F11b).
import { RacePicker } from './races.js'

const $ = (s) => document.querySelector(s)

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

  // { pick(seat, race), start(), back() }
  wire(on) {
    this.on = on
    $('#setupStart').onclick = () => on.start()
    $('#setupBack').onclick = () => on.back()
  }

  // { title, seats: [{ who, race, color }], mirror }
  show({ title, seats, mirror }) {
    // (the pickers made once, as the panel first opens: nothing is drawn
    // before)
    this.pickers ??= [0, 1].map((s) => new RacePicker({ root: $(`#setup .setupSeat[data-seat="${s}"] .picker`), diorama: this.diorama(), pick: (race) => this.on.pick(s, race) }))
    $('#setupTitle').textContent = title
    seats.forEach((x, s) => {
      $(`#setup .setupSeat[data-seat="${s}"] .who`).textContent = x.who
      this.pickers[s].render({ race: x.race, color: x.color })
    })
    $('#setupMirror').classList.toggle('hidden', !mirror)
    this.root.classList.remove('hidden')
  }

  hide() {
    this.root.classList.add('hidden')
    for (const p of this.pickers ?? []) p.close()
  }
}
