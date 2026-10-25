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
    // the units an orders run piloted that the AI left as they were (no shot
    // worth taking, a charge too long), by decision: { key, ids }. They no
    // longer count among the orders' actors there, nor are piloted again
    this.declined = { at: null, ids: new Set() }
    // (the plan's cache, plan())
    this.planned = null
    // any press on the page stops Auto-End's countdown (the table's, a
    // button's, the help's): an order given since counts again (give())
    globalThis.document?.addEventListener('pointerdown', () => this.stopCount(), true)
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

  // the seat's orders held by units still standing (the book lets a fallen
  // unit go at the next run's tidy: until then it counts for nothing)
  living(seat = this.seat()) {
    const G = this.session?.G
    if (!G) return new Map()
    return new Map([...this.orders(seat)].filter(([id]) => G.units.find((u) => u.id === id)?.alive > 0))
  }

  // the decision the seat is answering here: its deployment or its phase
  // (an armed click belongs to it, and lapses with it)
  sigOf(seat) {
    const T = this.session?.G?.turn, P = this.session?.G?.pending
    return T && P ? `${P.k}:${T.round}:${T.active}:${P.phase ?? ''}:${seat}` : null
  }

  // ── Giving orders ─────────────────────────────────────────────────────────
  // March and Attack arm a click; the rest apply at once. Returns why not,
  // or null.
  order(k) {
    const seat = this.seat(), units = this.picked()
    if (seat < 0 || !units.length) return 'pick up some of your units first'
    if (k === 'march' || k === 'attack') {
      this.armed = { k, seat, ids: units.map((u) => u.id), sig: this.sigOf(seat) }
      const prompt = k === 'march' ? `March ${units.length === 1 ? units[0].t.short : `${units.length} units`}: click where to (Esc: never mind)` : `Attack: click the enemy ${units.length === 1 ? units[0].t.short : `these ${units.length}`} go for (Esc: never mind)`
      this.say(prompt)
      // (one unit has no group bar to say so: the toast does)
      if (units.length === 1) this.toast?.show(prompt, 3000)
      return null
    }
    this.armed = null
    this.give(seat, units.map((u) => u.id), k === 'none' ? null : { k })
    return null
  }

  // the armed click: a place (March) or an enemy (Attack); true if taken
  click({ unit, ground }) {
    const a = this.armed
    if (!a) return false
    // (an armed click lapses with its decision, or once its units are gone:
    // the click is the table's again)
    const G = this.human.G, units = G ? a.ids.map((id) => G.units.find((u) => u.id === id)).filter((u) => u?.alive > 0) : []
    if (a.seat !== this.seat() || a.sig !== this.sigOf(a.seat) || !units.length) {
      this.disarm()
      return false
    }
    if (a.k === 'attack') {
      if (!unit || unit.side === a.seat || !(unit.alive > 0)) return false
      this.give(a.seat, units.map((u) => u.id), { k: 'attack', tg: unit.id }, unit.t.short)
    } else {
      if (!ground) return false
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
    // (Auto-End looks again, from the start: these may be the last units in
    // the player's hands, or some back in them)
    this.recount()
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
    const ids = [...this.living(seat).keys()]
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
    const orders = this.living(seat)
    if (!orders.size) return NONE
    // (made again only when the match, the book or the seat moved on: the
    // HUD asks at every refresh)
    const G = this.session.G, sig = `${this.session.count}|${this.book.version}|${seat}|${P.phase}`
    if (this.planned?.G === G && this.planned.sig === sig) return this.planned.plan
    const skip = this.skipped(seat)
    const plan = h.ask((G, q) => ({
      actors: actorsOf(G, q, seat, orders, P.phase).filter((a) => !(a.how === 'pilot' && skip.has(a.u.id))).map((a) => a.u.id),
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
    for (const seat of this.session?.localSeats ?? []) for (const [id, o] of this.living(seat)) out.set(id, GLYPH[o.k])
    return out
  }

  // ── Carrying them out ─────────────────────────────────────────────────────
  // End ('end'), Go (null) or Auto ('auto'): the orders, then that. Returns
  // a promise of the run's result (null when nothing ran).
  async run(then) {
    const h = this.human, seat = h.localSeat(), P = h.localDecision()
    if (this.busy || seat < 0 || P?.k !== 'phase') return null
    const orders = this.living(seat)
    this.busy = true
    this.armed = null
    this.stopCount()
    try {
      const n = this.plan().actors.length
      if (n) this.toast?.show(`Your orders: ${n} unit${n === 1 ? '' : 's'}`, 1600)
      const key = this.keyOf(this.session, seat), skip = this.skipped(seat)
      const r = await runOrders({ session: this.session, seat, orders, then, skip })
      // (Go: the units the AI was asked to play and left as they were sit
      // out the rest of this phase's runs, so Go's count can reach nothing)
      if (then === null && this.keyOf(this.session, seat) === key) {
        const still = h.ask((G, q) => actorsOf(G, q, seat, orders, P.phase).filter((a) => a.how === 'pilot').map((a) => a.u.id))
        const tried = new Set(r.piloted ?? [])
        this.declined = { at: key, ids: new Set([...skip, ...still.filter((id) => tried.has(id))]) }
      }
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
    // (an armed click whose decision is over lapses: never a shot taken for
    // an Attack order the next turn)
    if (this.armed && this.armed.sig !== this.sigOf(this.armed.seat)) this.disarm()
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
    const h = this.human, ses = this.session, seat = h.localSeat()
    const key = this.keyOf(ses, seat)
    if (!key || !this.autoEnd || this.counting || this.answered.has(`end ${key}`)) return
    if (!this.endable(seat)) return
    this.answered.add(`end ${key}`)
    const timer = setTimeout(() => {
      this.counting = null
      // (asked again as it fires: the same decision, the table caught up,
      // the setting still on, no orders under way, nothing in the player's
      // hands, no dialog open; else it presses nothing, and may count again)
      if (h.localSeat() === seat && this.keyOf(this.session, seat) === key && this.autoEnd && this.endable(seat) && !globalThis.document?.querySelector('.modal:not(.hidden)')) h.end()
      else {
        this.answered.delete(`end ${key}`)
        h.flow.refreshUI()
      }
    }, this.countdown)
    this.counting = { key, timer, at: performance.now() }
    h.flow.refreshUI()
  }

  // whether Auto-End may press End for the seat now: its phase, here, the
  // table caught up, no orders or group order under way, an order covering
  // a unit, and none left that the player plays by hand
  endable(seat) {
    const h = this.human
    if (seat < 0 || h.localDecision()?.k !== 'phase' || !h.myTurn() || !h.flow.player.idle || this.busy || h.group?.busy) return false
    const plan = this.plan()
    return plan.covered.size > 0 && h.ask((G, q) => !G.units.some((u) => u.side === seat && !plan.covered.has(u.id) && q.canAct(G, u)))
  }

  stopCount() {
    if (!this.counting) return
    clearTimeout(this.counting.timer)
    this.counting = null
    this.human.flow.refreshUI()
  }

  // The orders changed (an order given, the setting turned on or off):
  // Auto-End's countdown stopped and, this phase's answer taken back,
  // looked at again.
  recount() {
    const key = this.keyOf(this.session, this.human.localSeat())
    this.stopCount()
    if (key) this.answered.delete(`end ${key}`)
    this.idled()
  }

  // the units the seat's orders sit out in its decision now (declined)
  skipped(seat) {
    const at = this.keyOf(this.session, seat)
    return at && this.declined.at === at ? this.declined.ids : new Set()
  }

  keyOf(session, seat) {
    const T = session?.G?.turn, P = session?.G?.pending
    return T && P?.k === 'phase' ? `${T.round}:${T.active}:${P.phase}:${seat}` : null
  }

  // a new battle: nothing answered, armed, counting or said, no plan kept
  reset() {
    this.stopCount()
    this.armed = null
    this.note = ''
    this.planned = null
    this.declined = { at: null, ids: new Set() }
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
