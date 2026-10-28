// The lobby screen (DESIGN §2.7, N2): an online match before its start. The
// battle's link (Copy link, Open second tab), the battlefield (the host's to
// change), the two seats, and a status line. A seat shows who sits there,
// their race (F6: the race picker, ui/screens/races.js, its figures and
// their stats) and whether they're ready; your own seat takes your name
// (fitted as you type: net/ids.js's fitName, which `on.fit` is), your race
// (the picker's buttons) and your Ready; a free seat offers Sit here, with
// the race it would bring. (F7a) The terrain is the host's to choose too,
// from the sets the mission is fought on. What's shown is drawn from the
// lobby each time it changes (render), never kept here; a name is a peer's
// say-so, so it is only ever written as text. (F8b) The battle size (the
// mission: Skirmish, Field, Grand, with their boards and points) is the
// host's to choose, beside the battlefield; a change un-readies both seats
// (net/lobby.js's editBattle), and a lobby written before F8b reads as
// Skirmish. (F16) The courtesy fog of war, a switch beside them, the host's
// to turn (a change un-readies both seats: Ready is the agreement), shown
// to the guest before its Ready as the size and terrain are.
import { RacePicker } from './races.js'
import { terrainName } from './setup.js'

const $ = (s) => document.querySelector(s)
const el = (tag, cls, text) => {
  const e = document.createElement(tag)
  if (cls) e.className = cls
  if (text !== undefined) e.textContent = text
  return e
}

export class LobbyScreen {
  // `diorama()`: the race showcase (view/diorama.js), asked for only as a
  // seat first shows its race
  constructor({ diorama }) {
    this.root = $('#lobby')
    this.diorama = diorama
    this.on = {}
    // (your name box, kept across renders while you type in it; and each
    // seat's picker, kept across renders, its figures built once a race)
    this.nameBox = null
    this.pickers = []
  }

  get up() {
    return !this.root.classList.contains('hidden')
  }

  // (F6) the lobby's seats show the table through their figures' windows,
  // so the title is put out of the way while it is up (style.css)
  show() {
    this.root.classList.remove('hidden')
    document.body.classList.add('lobbying')
  }

  hide() {
    this.root.classList.add('hidden')
    document.body.classList.remove('lobbying')
    for (const p of this.pickers) p?.picker.close()
  }

  // seat i's picker (its parts made once, then moved from render to render)
  pickerOf(i) {
    if (this.pickers[i]) return this.pickers[i]
    const root = el('div', 'picker')
    return (this.pickers[i] = { root, picker: new RacePicker({ root, diorama: this.diorama(), pick: (race) => this.on.race(race) }) })
  }

  // `on`: { claim(i), leave(i), name(text), race(key), ready(bool),
  // board(n), (F7a) terrain(set), (F8b) mission(key), (F16) fog(bool), reroll(), copy(), secondTab(), back(),
  // fit(text, typing) }
  wire(on) {
    this.on = on
    // (F8b) the size's select, made once beside the battlefield's box
    if (!$('#lobbySize')) {
      const label = el('label', 'sizePick', 'Battle size ')
      const pick = el('select')
      pick.id = 'lobbySize'
      label.append(pick)
      $('#lobby .seedrow').prepend(label)
    }
    $('#lobbySize').onchange = () => on.mission?.($('#lobbySize').value)
    // (F16) the fog's switch, made once after the battle's row
    if (!$('#lobbyFog')) {
      const label = el('label', 'fogPick', 'Fog of war ')
      const box = el('input')
      box.id = 'lobbyFog'
      box.type = 'checkbox'
      const note = el('span', 'small', ' each side sees only what its units see')
      label.append(box, note)
      $('#lobby .seedrow').append(label)
    }
    $('#lobbyFog').onchange = () => on.fog?.($('#lobbyFog').checked)
    $('#copyLink').onclick = () => on.copy()
    $('#secondTab').onclick = () => on.secondTab()
    $('#lobbyReroll').onclick = () => on.reroll()
    $('#lobbyBoard').onchange = () => on.board((Number($('#lobbyBoard').value) || 1) >>> 0)
    $('#lobbyTerrain').onchange = () => on.terrain($('#lobbyTerrain').value)
    $('#lobbyBack').onclick = () => on.back()
  }

  // A line under the title and nothing else (connecting, not found).
  note(text) {
    this.show()
    $('#lobbyStatus').textContent = text
    for (const s of this.root.querySelectorAll('.seat')) {
      s.replaceChildren()
      s.classList.remove('mine')
    }
    for (const p of this.pickers) p?.picker.close()
    this.nameBox = null
    $('#lobbyLink').value = ''
    for (const id of ['#copyLink', '#secondTab', '#lobbyReroll', '#lobbyBoard', '#lobbyTerrain', '#lobbySize', '#lobbyFog']) $(id).disabled = true
  }

  // m: { status, link, board, (F7a) terrain and terrains (the set chosen and
  // the mission's sets), host (the battle is yours to change), (F8b)
  // mission and sizes ([{ mission, name, W, H, points }]), (F16) fog (the
  // courtesy fog agreed: on or off), seats: [{ name,
  // race (a free seat's: the race it would bring), color (its bases' rims),
  // ready, mine, free, canSit }] }
  render(m) {
    this.show()
    $('#lobbyStatus').textContent = m.status
    $('#lobbyLink').value = m.link
    $('#copyLink').disabled = $('#secondTab').disabled = false
    const board = $('#lobbyBoard')
    if (document.activeElement !== board) board.value = m.board ?? ''
    board.disabled = $('#lobbyReroll').disabled = !m.host
    // (F7a) the terrain: the mission's sets, the lobby's chosen
    const terrain = $('#lobbyTerrain')
    const sets = (m.terrains ?? [m.terrain]).filter(Boolean)
    if (terrain.dataset.opts !== sets.join()) {
      terrain.replaceChildren(...sets.map((set) => Object.assign(document.createElement('option'), { value: set, textContent: terrainName(set) })))
      terrain.dataset.opts = sets.join()
    }
    if (document.activeElement !== terrain) terrain.value = m.terrain ?? ''
    terrain.disabled = !m.host || sets.length < 2
    // (F8b) the battle size: every size offered, the lobby's chosen (a
    // name no size has, a peer's, shown as it is)
    const size = $('#lobbySize'), sizes = m.sizes ?? []
    const opts = sizes.some((s) => s.mission === m.mission) ? sizes : [...sizes, { mission: m.mission, name: String(m.mission) }]
    if (size.dataset.shown !== JSON.stringify(opts)) {
      size.replaceChildren(...opts.map((s) => {
        const o = el('option', '', s.W ? `${s.name} · ${s.W}×${s.H}, ${s.points.toLocaleString('en')} pts` : s.name)
        o.value = s.mission
        return o
      }))
      size.dataset.shown = JSON.stringify(opts)
    }
    if (document.activeElement !== size) size.value = m.mission
    size.disabled = !m.host
    // (F16) the fog: the lobby's, the host's to turn
    const fog = $('#lobbyFog')
    fog.checked = !!m.fog
    fog.disabled = !m.host
    m.seats.forEach((s, i) => this.seat(this.root.querySelector(`.seat[data-seat="${i}"]`), s, i))
  }

  // A seat's card: who sits there (its head), its race (the picker: yours
  // to change in your own seat), and below them what can be done there.
  seat(box, s, i) {
    box.classList.toggle('mine', !!s.mine)
    const { root, picker } = this.pickerOf(i)
    picker.render({ race: s.race, color: s.color, editable: !!s.mine })
    const head = (who) => {
      const h = el('div', 'seatHead')
      h.append(el('span', 'who', who), el('span', 'edge', i ? 'east edge' : 'west edge'))
      return h
    }
    const ctl = (...parts) => {
      const c = el('div', 'seatCtl')
      c.append(...parts)
      return c
    }
    if (s.free) {
      const sit = el('button', 'primary', 'Sit here')
      sit.onclick = () => this.on.claim(i)
      sit.disabled = !s.canSit
      box.replaceChildren(head(`Seat ${i + 1} is free`), root, ctl(sit))
      return
    }
    if (!s.mine) {
      box.replaceChildren(head(s.name || '…'), root, ctl(el('div', s.ready ? 'ok' : 'wait', s.ready ? '✓ Ready' : 'Getting ready…')))
      return
    }
    // your own seat: the name box kept while it has focus
    const name = this.nameBox ?? el('input')
    if (!this.nameBox) {
      this.nameBox = name
      name.setAttribute('aria-label', 'Your name')
      name.addEventListener('input', () => {
        const fit = this.on.fit(name.value, true)
        if (fit !== name.value) name.value = fit
      })
      name.addEventListener('change', () => {
        name.value = this.on.fit(name.value, false)
        if (name.value) this.on.name(name.value)
      })
    }
    if (document.activeElement !== name) name.value = s.name
    const ready = el('button', s.ready ? 'on' : 'primary', s.ready ? '✓ Ready (click to wait)' : 'Ready')
    ready.onclick = () => this.on.ready(!s.ready)
    const leave = el('button', '', 'Leave seat')
    leave.onclick = () => this.on.leave(i)
    const row = el('div', 'row')
    row.append(ready, leave)
    box.replaceChildren(head(`Seat ${i + 1} · you`), root, ctl(name, row))
  }
}
