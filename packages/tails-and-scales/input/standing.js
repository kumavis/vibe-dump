// Standing orders, the input side (DESIGN §4.2.6, F10c): giving the units
// picked up an order, kept in this device's book (input/book.js), and
// carrying the orders out when the seat presses End, ▶ Go or Auto
// (input/orders.js's runOrders, from the button's handler: never from a
// sink's events). Nothing reaches the match but the ordinary commands the
// orders send; the book is this page's, each seat's own.
//
//   March ➜ (G)      arms a click: the place the units march to, each to its
//                    slot in the formation round it (present/orders.js's
//                    slotsOf), over as many turns as it takes
//   Attack 🎯 (T)    arms a click: the enemy they go for until it falls
//   Hold ⚓ (H)      stand and shoot (the AI picks the shots)
//   Autopilot ⟳ (P)  the AI plays them, every phase
//   No orders ⊘ (X)  back to the player's hands
//
// When the orders act (§4.2.6): End runs them, then ends the phase; Go runs
// them and leaves the phase open; Auto runs them, then the AI plays the rest.
// Afterwards the book is brought up to date from the match: a march within
// its reach of its slot holds ("Arrived"); one that has gained under half an
// inch on its anchor two of its movement phases running goes back to the
// player ("Blocked"); an attack whose target fell goes on autopilot
// ("Target down"); a unit that fell leaves the book.
import { NAME, GLYPH, covers, actorsOf, doneOf, progressOf } from '../present/standing.js'
import { slotsOf } from '../present/orders.js'
import { runOrders } from './orders.js'
import { sfx } from '../view/sfx.js'

const NONE = Object.freeze({ actors: [], covered: new Set() })
// the order keys
const KEYS = { KeyG: 'march', KeyT: 'attack', KeyH: 'hold', KeyP: 'auto', KeyX: 'none' }
// Auto-End's countdown, ms
const COUNTDOWN = 1500

export class StandingInput {
  // `human` (input/human.js), `book` (input/book.js), `toast`
  // (ui/toast.js: { show(text, ms) }), `countdown` (Auto-End's, ms)
  constructor({ human, book, toast = null, countdown = COUNTDOWN }) {
    Object.assign(this, { human, book, toast, countdown })
    // a click armed by March or Attack: { k, seat, ids }, or null
    this.armed = null
    this.busy = false
    this.note = ''
    // O: every order's line, not only the picked units'
    this.allLines = false
    // (the settings, ui/hud.js's: kept in this browser)
    this.autoFirst = false
    this.autoEnd = false
    // what settled answered already, by (round, turn, phase, seat): each
    // phase is answered at most once, however many changes fold in it
    this.answered = new Set()
    // Auto-End's countdown: { key, timer, at }, or null
    this.counting = null
  }

  get session() {
    return this.human.session
  }

  // the seat whose orders the player gives now (the group input's: the one
  // deploying here, or whose phase it is here)
  seat() {
    return this.human.group?.seat() ?? -1
  }

  // the units picked up: the group, else the one on the card
  picked() {
    const g = this.human.group?.members() ?? []
    if (g.length) return g
    const sel = this.human.sel
    return sel && sel.side === this.seat() && sel.alive > 0 ? [sel] : []
  }

  orders(seat = this.seat()) {
    return seat >= 0 ? this.book.orders(seat) : new Map()
  }

  // ── Giving orders ─────────────────────────────────────────────────────────
  // March and Attack arm a click; the rest apply at once. Returns why not,
  // or null.
  order(k) {
    const seat = this.seat(), units = this.picked()
    if (seat < 0 || !units.length) return 'pick up some of your units first'
    if (k === 'march' || k === 'attack') {
      this.armed = { k, seat, ids: units.map((u) => u.id) }
      this.say(k === 'march' ? `March ${units.length === 1 ? units[0].t.short : `${units.length} units`}: click where to` : `Attack: click the enemy ${units.length === 1 ? units[0].t.short : `these ${units.length}`} go for`)
      return null
    }
    this.armed = null
    this.give(seat, units.map((u) => u.id), k === 'none' ? null : { k })
    return null
  }

  // the armed click: a place (March) or an enemy (Attack); true if taken
  click({ unit, ground }) {
    const a = this.armed
    if (!a || a.seat !== this.seat()) return false
    if (a.k === 'attack') {
      if (!unit || unit.side === a.seat || !(unit.alive > 0)) return false
      this.give(a.seat, a.ids, { k: 'attack', tg: unit.id }, unit.t.short)
    } else {
      if (!ground) return false
      const G = this.human.G, units = a.ids.map((id) => G.units.find((u) => u.id === id)).filter((u) => u?.alive > 0)
      const slots = this.human.ask((G2) => slotsOf(G2, units.map((u) => G2.units.find((x) => x.id === u.id)), ground))
      const anchor = G.nav.index(ground.x, ground.z)
      if (anchor < 0) return false
      this.give(a.seat, units.map((u) => u.id), (id) => ({ k: 'march', anchor, slot: G.nav.index(slots.get(id).x, slots.get(id).z) }))
    }
    this.armed = null
    return true
  }

  disarm() {
    if (!this.armed) return false
    this.armed = null
    this.say('')
    return true
  }

  // G March, T Attack, H Hold, P Autopilot, X no orders, O every order's
  // line; Esc lets an armed click go (true: the key was the orders'). Any
  // key stops Auto-End's countdown.
  key(e) {
    this.stopCount()
    if (e.ctrlKey || e.metaKey || e.altKey || document.querySelector('.modal:not(.hidden)')) return false
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target?.tagName ?? '')) return false
    if (e.code === 'Escape') return this.disarm()
    if (e.code === 'KeyO') {
      this.allLines = !this.allLines
      this.human.flow.refreshUI()
      return true
    }
    const k = KEYS[e.code]
    if (!k || this.seat() < 0) return false
    return this.order(k) === null
  }

  give(seat, ids, order, what = '') {
    const k = typeof order === 'function' ? order(ids[0])?.k : order?.k
    this.book.set(seat, ids, order)
    sfx.click()
    // (Auto-End looks again: these may be the last units in the player's hands)
    this.idled()
    this.say(k ? `${GLYPH[k]} ${NAME[k]}${what ? ` ${what}` : ''}: ${ids.length} unit${ids.length === 1 ? '' : 's'}` : `No orders: ${ids.length} unit${ids.length === 1 ? '' : 's'} back in your hands`)
  }

  say(text) {
    this.note = text
    this.human.flow.refreshUI()
  }

  // Orders N: every unit of the seat holding an order, picked up (their
  // lines drawn, as a picked unit's are)
  pickOrdered() {
    const seat = this.seat(), G = this.human.G
    if (seat < 0 || !G) return 'no seat of yours to pick for now'
    const ids = [...this.orders(seat).keys()].filter((id) => G.units.find((u) => u.id === id)?.alive > 0)
    if (!ids.length) return 'no unit holds an order'
    this.human.group.setGroup(ids)
    return null
  }

  // the bar's line: how many of the units picked hold each order, and the
  // click armed
  summary(units) {
    const seat = this.seat(), by = {}
    for (const u of units) {
      const k = this.book.get(seat, u.id)?.k
      if (k) by[k] = (by[k] ?? 0) + 1
    }
    return { by, armed: this.armed?.k ?? null }
  }

  // ── What the orders would do now ──────────────────────────────────────────
  // On a phase of a seat played here: the units whose orders act in it now
  // (End's ⟳ badge, Go's count), and the ids an order covers in it (which
  // End's "nothing left to do" leaves out). Asked of the match, so only once
  // the table has caught up.
  plan() {
    const h = this.human, seat = h.localSeat(), P = h.localDecision()
    if (seat < 0 || P?.k !== 'phase' || !h.flow.player.idle) return NONE
    const orders = this.orders(seat)
    if (!orders.size) return NONE
    // (made again only when the match, the book or the seat moved on: the
    // HUD asks at every refresh)
    const G = this.session.G, sig = `${this.session.count}|${this.book.version}|${seat}|${P.phase}`
    if (this.planned?.G === G && this.planned.sig === sig) return this.planned.plan
    const plan = h.ask((G, q) => ({
      actors: actorsOf(G, q, seat, orders, P.phase).map((a) => a.u.id),
      covered: new Set([...orders].filter(([id, o]) => covers(o, P.phase) && G.units.find((u) => u.id === id)?.alive > 0).map(([id]) => id)),
    }))
    this.planned = { G, sig, plan }
    return plan
  }

  // The lines the table draws (view/overlay.js's orderLines): a march's to
  // its slot, an attack's to its target, for the units picked up (O: all of
  // every seat played here); the units as the table shows them.
  lines() {
    const h = this.human, ses = this.session, out = []
    if (!ses?.G) return out
    const picked = new Set(this.picked().map((u) => u.id))
    const M = h.flow.player.mirror, G = ses.G
    for (const seat of ses.localSeats) {
      for (const [id, o] of this.orders(seat)) {
        if (!this.allLines && !picked.has(id)) continue
        const u = M.units?.[id], t = G.units.find((x) => x.id === id)
        if (!(u?.alive > 0) || !t) continue
        if (o.k === 'march') out.push({ k: 'march', from: u.pos, to: { x: G.nav.x(o.slot), z: G.nav.z(o.slot) }, r: u.r })
        else if (o.k === 'attack' && M.units?.[o.tg]?.alive > 0) out.push({ k: 'attack', from: u.pos, to: M.units[o.tg].pos, r: M.units[o.tg].r + 0.3 })
      }
    }
    return out.slice(0, 48)
  }

  // every seat played here's orders, a glyph by unit id (the labels)
  glyphs() {
    const out = new Map()
    for (const seat of this.session?.localSeats ?? []) for (const [id, o] of this.orders(seat)) out.set(id, GLYPH[o.k])
    return out
  }

  // ── Carrying them out ─────────────────────────────────────────────────────
  // End ('end'), Go (null) or Auto ('auto'): the orders, then that. Returns
  // a promise of the run's result (null when nothing ran).
  async run(then) {
    const h = this.human, seat = h.localSeat(), P = h.localDecision()
    if (this.busy || seat < 0 || P?.k !== 'phase') return null
    const orders = this.orders(seat)
    this.busy = true
    this.armed = null
    try {
      const n = this.plan().actors.length
      if (n) this.toast?.show(`Your orders: ${n} unit${n === 1 ? '' : 's'}`, 1600)
      const r = await runOrders({ session: this.session, seat, orders, then })
      this.after(seat, P.phase, then, r)
      return r
    } catch (err) {
      this.say(err.message)
      return null
    } finally {
      this.busy = false
      h.flow.refreshUI()
    }
  }

  // ── Answered by themselves ────────────────────────────────────────────────
  // (The Session's sink.settled, app/flow.js's: a change folded whole, the
  // match the store's whole list leads to; never from an entry's events, a
  // decision a later entry of the change may have made needless.) Each
  // phase of a seat played here is answered once (by its round, turn, phase
  // and seat), and only while the match still waits on that seat there.
  settled(session) {
    if (session !== this.session) return
    const seat = session.decisionFor(), P = session.G?.pending
    if (seat < 0 || P?.k !== 'phase') return this.stopCount()
    const T = session.G.turn, key = `${T.round}:${T.active}:${P.phase}:${seat}`
    // Autopilot first: the seat's units on autopilot play as its phase opens
    if (this.autoFirst && !this.answered.has(`auto ${key}`)) {
      this.answered.add(`auto ${key}`)
      const orders = new Map([...this.orders(seat)].filter(([, o]) => o.k === 'auto'))
      if (orders.size) {
        const ids = this.human.ask((G, q) => [...orders.keys()].filter((id) => q.canAct(G, G.units.find((u) => u.id === id) ?? {})))
        const m = ids.length ? this.human.ask((G, q) => q.maskOf(G, seat, ids)) : 0
        if (m && !session.legal(seat, { t: 'pilot', m })) session.submit(seat, { t: 'pilot', m })
      }
    }
    // (Auto-End: counted down once the table has caught up, idled)
  }

  // The table has caught up (the human's idled), or an order changed: Auto-
  // End's countdown, once nothing is left for the player's own hand and
  // every unit still able to act is under orders (End lit), drawn on End,
  // once a phase; a key, a press on the table or End itself stops it.
  idled() {
    const h = this.human, ses = this.session, seat = h.localSeat(), P = h.localDecision()
    const key = this.keyOf(ses, seat)
    if (!key || !this.autoEnd || this.counting || this.answered.has(`end ${key}`) || !h.flow.player.idle) return
    if (seat < 0 || P?.k !== 'phase') return
    const plan = this.plan()
    const handless = h.ask((G, q) => !G.units.some((u) => u.side === seat && !plan.covered.has(u.id) && q.canAct(G, u)))
    if (!handless || !plan.covered.size) return
    this.answered.add(`end ${key}`)
    const timer = setTimeout(() => {
      this.counting = null
      // (the same decision still, the table still caught up)
      if (h.localSeat() === seat && this.keyOf(this.session, seat) === key && h.myTurn()) h.end()
      else h.flow.refreshUI()
    }, this.countdown)
    this.counting = { key, timer, at: performance.now() }
    h.flow.refreshUI()
  }

  stopCount() {
    if (!this.counting) return
    clearTimeout(this.counting.timer)
    this.counting = null
    this.human.flow.refreshUI()
  }

  keyOf(session, seat) {
    const T = session?.G?.turn, P = session?.G?.pending
    return T && P?.k === 'phase' ? `${T.round}:${T.active}:${P.phase}:${seat}` : null
  }

  // a new battle: nothing answered, nothing counting
  reset() {
    this.stopCount()
    this.armed = null
    this.answered.clear()
  }

  // the book brought up to date from the match as the run left it
  after(seat, phase, then, r) {
    const marchedOn = phase === 'move' && then !== null
    const notes = this.book.tidy(this.session.G, seat, (u, o, notes) => {
      const done = this.human.ask((G, q) => doneOf(G, q, u, o))
      if (done) {
        notes.push(`${u.t.short}: ${done.note}`)
        return done.next
      }
      if (o.k === 'march' && marchedOn) {
        const p = this.human.ask((G, q) => progressOf(G, q, u, o))
        if (p.blocked) notes.push(`${u.t.short}: Blocked`)
        return p.order
      }
      return o
    })
    const blocked = r?.blocked?.length ?? 0
    const said = [...notes, ...(blocked ? [`${blocked} order${blocked === 1 ? '' : 's'} blocked`] : [])]
    if (said.length) this.toast?.show(said.slice(0, 4).join(' · ') + (said.length > 4 ? ` · ${said.length - 4} more` : ''), 3000)
    this.note = ''
  }
}
