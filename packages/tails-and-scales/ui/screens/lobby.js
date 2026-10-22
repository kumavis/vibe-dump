// The lobby screen (DESIGN §2.7, N2): an online match before its start. The
// battle's link (Copy link, Open second tab), the battlefield (the host's to
// change), the two seats, and a status line. A seat shows who sits there,
// their race and whether they're ready; your own seat takes your name
// (fitted as you type: net/ids.js's fitName, which `on.fit` is), your race
// and your Ready; a free seat
// offers Sit here. What's shown is drawn from the lobby each time it
// changes (render), never kept here; a name is a peer's say-so, so it is
// only ever written as text.
const $ = (s) => document.querySelector(s)
const el = (tag, cls, text) => {
  const e = document.createElement(tag)
  if (cls) e.className = cls
  if (text !== undefined) e.textContent = text
  return e
}

export class LobbyScreen {
  constructor() {
    this.root = $('#lobby')
    this.on = {}
    // (your name box, kept across renders while you type in it)
    this.nameBox = null
  }

  get up() {
    return !this.root.classList.contains('hidden')
  }

  show() {
    this.root.classList.remove('hidden')
  }

  hide() {
    this.root.classList.add('hidden')
  }

  // `on`: { claim(i), leave(i), name(text), race(key), ready(bool),
  // board(n), reroll(), copy(), secondTab(), back(), fit(text, typing) }
  wire(on) {
    this.on = on
    $('#copyLink').onclick = () => on.copy()
    $('#secondTab').onclick = () => on.secondTab()
    $('#lobbyReroll').onclick = () => on.reroll()
    $('#lobbyBoard').onchange = () => on.board((Number($('#lobbyBoard').value) || 1) >>> 0)
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
    this.nameBox = null
    $('#lobbyLink').value = ''
    for (const id of ['#copyLink', '#secondTab', '#lobbyReroll', '#lobbyBoard']) $(id).disabled = true
  }

  // m: { status, link, board, host (the battle is yours to change), races
  // (the picker's: [{ key, name, icon }]), seats: [{ name, race, look
  // ({ name, icon } of its race), ready, mine, free, canSit }] }
  render(m) {
    this.show()
    $('#lobbyStatus').textContent = m.status
    $('#lobbyLink').value = m.link
    $('#copyLink').disabled = $('#secondTab').disabled = false
    const board = $('#lobbyBoard')
    if (document.activeElement !== board) board.value = m.board ?? ''
    board.disabled = $('#lobbyReroll').disabled = !m.host
    m.seats.forEach((s, i) => this.seat(this.root.querySelector(`.seat[data-seat="${i}"]`), s, i, m.races))
  }

  seat(box, s, i, races) {
    const race = s.look
    box.classList.toggle('mine', !!s.mine)
    if (s.free) {
      const sit = el('button', 'primary', 'Sit here')
      sit.onclick = () => this.on.claim(i)
      sit.disabled = !s.canSit
      box.replaceChildren(el('div', 'who', `Seat ${i + 1} is free`), el('div', 'race', race ? `${race.icon} ${race.name}` : ''), sit)
      return
    }
    if (!s.mine) {
      box.replaceChildren(el('div', 'who', s.name || '…'), el('div', 'race', race ? `${race.icon} ${race.name}` : ''), el('div', s.ready ? 'ok' : 'wait', s.ready ? '✓ Ready' : 'Getting ready…'))
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
    const pick = el('select')
    pick.setAttribute('aria-label', 'Your race')
    for (const r of races) {
      const o = el('option', '', `${r.icon} ${r.name}`)
      o.value = r.key
      pick.appendChild(o)
    }
    pick.value = s.race
    pick.onchange = () => this.on.race(pick.value)
    const ready = el('button', s.ready ? 'on' : 'primary', s.ready ? '✓ Ready (click to wait)' : 'Ready')
    ready.onclick = () => this.on.ready(!s.ready)
    const leave = el('button', '', 'Leave seat')
    leave.onclick = () => this.on.leave(i)
    box.replaceChildren(el('div', 'race', `Seat ${i + 1} · you`), name, pick, ready, leave)
  }
}
