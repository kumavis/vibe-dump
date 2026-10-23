// The order book (DESIGN §4.2.6, F10c): each seat's standing orders, kept on
// this device and never in the match or its log (peers only ever see the
// ordinary commands the orders send). A hotseat's two seats keep their own.
// One battle's book, keyed by its start entry and seeds; in this browser's
// storage (`ts.orders.<key>.<seat>`, every access in try/catch: a private
// window keeps it for the page only), so a reload or a rejoin finds it again.
//
//   book = { v: 1, units: { [id]: order }, groups: { 1…9: [ids] } }
//   order: present/standing.js's ({ k: 'march', anchor, slot, best?, stall? },
//   { k: 'attack', tg }, { k: 'hold' }, { k: 'auto' })
//
//   open(key, { fresh })  the battle's book (fresh: a new battle, its key's
//                         old orders dropped)
//   orders(seat)          id → order, a Map of the seat's
//   set(seat, ids, order) each of ids given the order (null: none)
//   saved(seat)           the seat's saved groups (input/selection.js's)
//   tidy(G, seat, fn)     each order passed through fn(u, order) → order or
//                         null; a unit gone from the match (or fallen)
//                         leaves the book
const PREFIX = 'ts.orders.'

export class OrderBook {
  constructor(storage = null) {
    this.storage = storage
    this.key = null
    this.bySeat = new Map()
    // (bumped by every change: what a cached plan was made from)
    this.version = 0
  }

  // (localStorage, or nothing: a refused one is no book at all)
  get store() {
    if (this.storage) return this.storage
    try {
      return globalThis.localStorage ?? null
    } catch {
      return null
    }
  }

  open(key, { fresh = false } = {}) {
    this.key = key
    this.bySeat.clear()
    this.version++
    if (!fresh || !key) return
    try {
      for (const seat of [0, 1]) this.store?.removeItem(`${PREFIX}${key}.${seat}`)
    } catch {}
  }

  close() {
    this.key = null
    this.bySeat.clear()
    this.version++
  }

  of(seat) {
    let b = this.bySeat.get(seat)
    if (b) return b
    b = { v: 1, units: {}, groups: {} }
    if (this.key) {
      try {
        const got = JSON.parse(this.store?.getItem(`${PREFIX}${this.key}.${seat}`) ?? 'null')
        if (got?.v === 1 && got.units && typeof got.units === 'object') b = { v: 1, units: got.units, groups: got.groups ?? {} }
      } catch {}
    }
    this.bySeat.set(seat, b)
    return b
  }

  save(seat) {
    this.version++
    if (!this.key) return
    try {
      this.store?.setItem(`${PREFIX}${this.key}.${seat}`, JSON.stringify(this.of(seat)))
    } catch {}
  }

  orders(seat) {
    return new Map(Object.entries(this.of(seat).units).map(([id, o]) => [Number(id), o]))
  }

  get(seat, id) {
    return this.of(seat).units[id] ?? null
  }

  set(seat, ids, order) {
    const b = this.of(seat)
    for (const id of ids) {
      if (order) b.units[id] = typeof order === 'function' ? order(id) : { ...order }
      else delete b.units[id]
    }
    this.save(seat)
  }

  saved(seat) {
    return this.of(seat).groups
  }

  tidy(G, seat, fn = (u, o) => o) {
    const b = this.of(seat), notes = []
    for (const [id, o] of Object.entries(b.units)) {
      const u = G.units.find((x) => x.id === Number(id))
      const next = u && u.alive > 0 ? fn(u, o, notes) : null
      if (next) b.units[id] = next
      else delete b.units[id]
    }
    this.save(seat)
    return notes
  }
}
