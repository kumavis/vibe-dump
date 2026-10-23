// The selection (DESIGN §4.2.6, F10a): which of the seat's own standing
// units are picked up together, local to this page (never logged; a
// hotseat's two seats each keep their own). One unit selected is today's
// `sel`; two or more are a group, whose clicks pin a formation before
// anything is sent. A unit that falls drops out: the members are the ids
// still standing in the match the table shows.
//
//   sel.group           the ids picked, in the order they were
//   sel.lead            the unit on the card (the last one picked)
//   sel.saved[1..9]     saved groups (Ctrl-1…9; 1…9 recalls)
//   sel.pin             a pinned group preview ({ verb, target, preview,
//                       line }), or null
//   sel.note            what the bar says of the last thing done (a run's
//                       "Target down · 3 still ready", "Saved as group 2")
//   sel.advance         +D6: the seat's group Moves advance first
export class Selection {
  constructor() {
    this.bySeat = new Map()
  }

  // the seat's own record, made on first use
  of(seat) {
    let s = this.bySeat.get(seat)
    if (!s) this.bySeat.set(seat, (s = { group: [], lead: null, saved: {}, pin: null, note: '', advance: false }))
    return s
  }

  // the units of `ids` still standing in G, as G has them
  units(G, ids) {
    return ids.map((id) => G.units.find((u) => u.id === id)).filter((u) => u && u.alive > 0)
  }

  // the seat's group as G has it (standing units only)
  members(G, seat) {
    return this.units(G, this.of(seat).group)
  }

  set(seat, ids, lead = ids.at(-1) ?? null) {
    const s = this.of(seat)
    s.group = [...new Set(ids)]
    s.lead = s.group.includes(lead) ? lead : s.group.at(-1) ?? null
    s.pin = null
  }

  toggle(seat, id) {
    const s = this.of(seat)
    this.set(seat, s.group.includes(id) ? s.group.filter((x) => x !== id) : [...s.group, id], s.group.includes(id) ? s.lead : id)
  }

  clear(seat) {
    this.set(seat, [])
  }

  save(seat, k) {
    const s = this.of(seat)
    if (s.group.length) s.saved[k] = [...s.group]
  }

  recall(G, seat, k) {
    const ids = this.of(seat).saved[k]
    if (!ids) return false
    this.set(seat, this.units(G, ids).map((u) => u.id))
    return true
  }
}
