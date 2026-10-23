// The group bar (DESIGN §4.2.6, F10a): above the action buttons while two
// or more units are selected. What the group is (how many, how many models,
// a chip per unit type: tap one to keep only that type, right-click or
// long-press to drop it; greyed with how many of it can't act now), what a
// click does with it in this phase (Move, Approach, Fire, Charge or Place:
// a hint; the click on the table is the verb), +D6 in the movement phase,
// (F10b) 🤖 Auto these (the AI plays the group's phase, which stays open),
// (F10c) the standing orders (➜ March, 🎯 Attack: a click armed; ⚓ Hold,
// ⟳ Autopilot, ⊘ none: at once), ⇥ the next ready unit, ✓ to send a pinned
// formation and ✕ to drop it, and Clear. And the actions' Ready N whenever a seat played here decides:
// every unit of it still to act. Drawn from input/group.js's model().
const $ = (s) => document.querySelector(s)

export class GroupBar {
  constructor() {
    this.root = $('#groupbar')
    this.readyBtn = $('#readyN')
    this.on = {}
    this.shown = ''
    this.readyBtn.onclick = () => this.on.ready?.()
  }

  // { only(key), drop(key), next(), commit(), cancel(), clear(), save(),
  // ready(), advance(), pilot(), order(k) }
  wire(on) {
    this.on = on
  }

  // m: { show, ready (Ready N's count; null: not a decision played here),
  // count, models, chips: [{ key, name, n, why }], verbs: [{ k, label, on
  // }], advance (+D6's state; null: not the movement phase), pilot ({ n,
  // why }: how many of the group can act; null: not a phase), orders ({ by:
  // { kind: n }, armed }: (F10c) the standing orders the members hold),
  // pinned, summary, note }
  render(m) {
    const r = this.readyBtn
    r.classList.toggle('hidden', !m.ready)
    if (m.ready) r.textContent = `Ready ${m.ready}`
    this.root.classList.toggle('hidden', !m.show)
    document.body.classList.toggle('grouped', !!m.show)
    if (!m.show) {
      this.shown = ''
      return
    }
    const key = JSON.stringify(m)
    if (key === this.shown) return
    this.shown = key
    const el = (tag, cls, text) => {
      const e = document.createElement(tag)
      if (cls) e.className = cls
      if (text !== undefined) e.textContent = text
      return e
    }
    const parts = [el('span', 'gcount', `${m.count} selected · ${m.models} models`)]
    for (const c of m.chips) {
      const b = el('button', `chip${c.why ? ' dim' : ''}`, `${c.name} ×${c.n}`)
      b.title = c.why ? `${c.why} · click: only these · right-click: drop them` : 'click: only these · right-click: drop them'
      b.onclick = () => this.on.only(c.key)
      b.oncontextmenu = (e) => {
        e.preventDefault()
        this.on.drop(c.key)
      }
      let press = 0
      b.onpointerdown = (e) => {
        if (e.pointerType !== 'mouse') press = setTimeout(() => this.on.drop(c.key), 450)
      }
      b.onpointerup = b.onpointerleave = () => clearTimeout(press)
      parts.push(b)
    }
    const next = el('button', 'gnext', '⇥')
    next.title = 'The next unit still to act (Tab)'
    next.onclick = () => this.on.next()
    parts.push(next, el('span', 'gsep', '│'))
    for (const v of m.verbs) parts.push(el('span', `verb${v.on ? ' on' : ''}`, v.label))
    if (m.advance !== null && m.advance !== undefined) {
      const adv = el('button', `gadv${m.advance ? ' on' : ''}`, '+D6')
      adv.title = m.advance ? 'Each member advances first (a D6 more inches; most can\'t shoot or charge after): on' : 'Advance first: each member rolls a D6 more inches (most can\'t shoot or charge after)'
      adv.onclick = () => this.on.advance()
      parts.push(adv)
    }
    if (m.pilot) {
      const auto = el('button', 'gpilot', '🤖 Auto these')
      auto.title = m.pilot.why || `The AI plays these units' ${m.verbs[0]?.k === 'move' ? 'moves' : m.verbs[0]?.k === 'shoot' ? 'shots' : 'charges'} this phase; the phase stays open for the rest`
      auto.disabled = !m.pilot.n
      auto.onclick = () => this.on.pilot()
      parts.push(auto)
    }
    if (m.orders) {
      parts.push(el('span', 'gsep', '│'))
      const ORDERS = [
        ['march', '➜ March', 'March: click where to (G); they go a turn at a time, each to its place in the formation'],
        ['attack', '🎯 Attack', 'Attack: click the enemy they go for until it falls (T)'],
        ['hold', '⚓ Hold', 'Hold: stand and shoot, the AI picking the shots (H)'],
        ['auto', '⟳ Autopilot', 'Autopilot: the AI plays them every phase (P)'],
        ['none', '⊘', 'No orders: back in your hands (X)'],
      ]
      for (const [k, label, title] of ORDERS) {
        const n = m.orders.by[k] ?? 0
        const b = el('button', `gorder${m.orders.armed === k ? ' on' : ''}${n ? ' held' : ''}`, n && k !== 'none' ? `${label} ${n}` : label)
        b.title = title
        b.dataset.k = k
        b.onclick = () => this.on.order(k)
        parts.push(b)
      }
    }
    if (m.pinned) {
      const go = el('button', 'primary', '✓ Send')
      go.title = 'Send the pinned formation (Enter)'
      go.onclick = () => this.on.commit()
      const no = el('button', '', '✕')
      no.title = 'Drop the pin (Esc)'
      no.onclick = () => this.on.cancel()
      parts.push(go, no)
    }
    const save = el('button', '', '＋Save')
    save.title = 'Save this group (Ctrl-1…9; 1…9 calls it back)'
    save.onclick = () => this.on.save()
    const clear = el('button', '', 'Clear ✕')
    clear.title = 'Clear the selection (Esc)'
    clear.onclick = () => this.on.clear()
    parts.push(el('span', 'gsep', '│'), save, clear)
    if (m.summary || m.note) parts.push(el('span', 'gnote', m.note || m.summary))
    this.root.replaceChildren(...parts)
  }
}
