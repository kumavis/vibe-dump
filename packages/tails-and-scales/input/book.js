// The order book (DESIGN §4.2.6, F10c): each seat's standing orders, kept on
// this device and never in the match or its log (peers only ever see the
// ordinary commands the orders send). A hotseat's two seats keep their own.
// One battle's book, keyed by its start entry and seeds; in this browser's
// storage (`ts.orders.<key>.<seat>`, every access in try/catch: a private
// window keeps it for the page only), so a reload or a rejoin finds it again.
//
//   book = { v: 1, at, units: { [id]: order } }   (at: when last saved)
//   order: present/standing.js's ({ k: 'march', anchor, slot, best?, stall? },
//   { k: 'attack', tg }, { k: 'hold' }, { k: 'auto' })
//
//   open(key, { fresh })  the battle's book (fresh: a new battle, its key's
//                         old orders dropped); the books of all but the
//                         KEEP most recently saved other battles are let go
//   orders(seat)          id → order, a Map of the seat's
//   set(seat, ids, order) each of ids given the order (null: none)
//   tidy(G, seat, fn)     each order passed through fn(u, order) → order or
//                         null; a unit gone from the match (or fallen)
//                         leaves the book
// (A seat's saved groups are the selection's, input/selection.js, kept for
// the page only.)
const PREFIX = 'ts.orders.'
// how many battles' books this browser keeps
const KEEP = 12

export class OrderBook {
  constructor(storage = null) {
    this.storage = storage
    this.id = null
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
    this.id = key
    this.bySeat.clear()
    this.version++
    if (!key) return
    try {
      if (fresh) for (const seat of [0, 1]) this.store?.removeItem(`${PREFIX}${key}.${seat}`)
      this.prune()
    } catch {}
  }

  // the books of all but the KEEP battles saved last (this one's aside) let
  // go, so finished battles' orders don't pile up in the browser
  prune() {
    const st = this.store
    if (!st) return
    const at = new Map()
    for (let i = 0; i < st.length; i++) {
      const k = st.key(i)
      if (k?.slice(0, PREFIX.length) !== PREFIX) continue
      const battle = k.slice(PREFIX.length, k.lastIndexOf('.'))
      if (battle === this.id) continue
      let t = 0
      try {
        t = JSON.parse(st.getItem(k))?.at ?? 0
      } catch {}
      at.set(battle, Math.max(at.get(battle) ?? 0, t))
    }
    const old = [...at].sort((a, b) => b[1] - a[1]).slice(KEEP)
    for (const [battle] of old) for (const seat of [0, 1]) st.removeItem(`${PREFIX}${battle}.${seat}`)
  }

  of(seat) {
    let b = this.bySeat.get(seat)
    if (b) return b
    b = { v: 1, units: {} }
    if (this.id) {
      try {
        const got = JSON.parse(this.store?.getItem(`${PREFIX}${this.id}.${seat}`) ?? 'null')
        if (got?.v === 1 && got.units && typeof got.units === 'object') b = { v: 1, units: got.units }
      } catch {}
    }
    this.bySeat.set(seat, b)
    return b
  }

  save(seat) {
    this.version++
    if (!this.id) return
    try {
      this.store?.setItem(`${PREFIX}${this.id}.${seat}`, JSON.stringify({ ...this.of(seat), at: Date.now() }))
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
