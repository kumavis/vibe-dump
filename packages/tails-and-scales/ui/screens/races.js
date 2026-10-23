// The race picker (DESIGN §1.3, F6): a seat's race, with the race's figures
// beside it (view/diorama.js: a window the table's renderer draws into),
// and, as the pointer rests on a figure, that unit's stats, as its card
// shows them. The battle-setup panel's seats use it (ui/screens/setup.js),
// and the lobby's seat cards (ui/screens/lobby.js).
//
//   new RacePicker({ root, diorama, pick })   builds its parts in `root`;
//                         pick(race) when a race is chosen
//   picker.render({ race, color, editable })  the race shown (its bases'
//                         rims in `color`), its buttons offered or not
//   picker.close()        the figures let go of
import { RACES } from '../../data/schema.js'
import { statsHtml } from '../card.js'

const HINT = 'Point at a figure (or tap it) to read its stats.'

export class RacePicker {
  constructor({ root, diorama, pick }) {
    this.diorama = diorama
    root.innerHTML = '<div class="dwin"></div><div class="raceRow"></div><div class="unitInfo"></div>'
    this.win = root.querySelector('.dwin')
    this.row = root.querySelector('.raceRow')
    this.info = root.querySelector('.unitInfo')
    this.info.textContent = HINT
    this.shownType = null
    for (const [id, r] of Object.entries(RACES)) {
      const b = document.createElement('button')
      b.dataset.race = id
      b.textContent = `${r.icon} ${r.name}`
      // (a seat not yours to change shows its race's button, which picks
      // nothing: a lobby's other seats, whose `pick` would be your own)
      b.onclick = () => this.editable && pick(id)
      this.row.appendChild(b)
    }
    // (a mouse reads the figure it rests on; a finger the one it taps, its
    // stats kept once it lifts)
    this.win.onpointermove = this.win.onpointerdown = (e) => this.point(e.clientX, e.clientY)
    this.win.onpointerleave = (e) => e.pointerType === 'mouse' && this.point(null)
  }

  render({ race, color, editable = true }) {
    // (another race: the last one's stats put away)
    if (race !== this.race) {
      this.shownType = null
      this.info.textContent = HINT
    }
    this.race = race
    this.editable = editable
    for (const b of this.row.querySelectorAll('button')) {
      const on = b.dataset.race === race
      b.classList.toggle('on', on)
      b.disabled = !editable
      b.classList.toggle('hidden', !editable && !on)
    }
    this.diorama.show(this.win, race, color)
    // (a race this code doesn't know, a peer's, has no figures: its window
    // is shut rather than left clear onto the table)
    this.win.classList.toggle('empty', !this.diorama.shown(this.win))
  }

  // the stats of the unit under the pointer (none: the hint)
  point(x, y) {
    const t = x === null ? null : this.diorama.unitAt(this.win, x, y)
    if (t === this.shownType) return
    this.shownType = t
    this.info.innerHTML = t ? `<div class="card-head"><b>${t.name}</b><span>${RACES[this.race].short} · ${t.role}</span></div>${statsHtml(t)}` : HINT
  }

  close() {
    this.diorama.hide(this.win)
    this.shownType = null
    this.info.textContent = HINT
  }
}
