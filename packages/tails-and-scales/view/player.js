// The EventPlayer (DESIGN §2.4): plays the match's events, in order, at the
// view's pace. The match runs ahead synchronously, to the next decision a
// human makes, and the Session (match/session.js) hands the view each
// entry's events, which it push()es here; so the view shows what happened
// one event at a time, while the mirror (present/mirror.js) folds each
// event as it is played: the state as shown, which the figures, labels,
// flags and score read instead of G. When everything queued has played the
// player is idle and tells onIdle, and the table catches up (the input and
// the HUD read G, the match itself, only then).
//
// A handler is the old code's visuals for one kind of event, verbatim (a
// dice row in the tray, a figure's fall, a line in the battle log), called
// with the event and the mirror just after the event is folded in. It
// returns a promise when the next event must wait for it (a dice row, a
// pause), else nothing; events whose handlers take no time play at once,
// inside push(), when the player is idle. An event with no handler goes to
// `fallback`: the player's own (an event's text over the unit or the place
// it names, through the view's `text`, then a beat: §2.4), unless the
// handlers bring one, so a player made without one still plays an unknown
// event.
//
// snap(G) (R7) jumps to a match as it stands, whatever was queued: the
// queue is dropped, the mirror becomes project(G), the view is rebuilt from
// G (its `rebuild(G, M)`: the battlefield from its chunks, the figures from
// its units, what the view holds outside the mirror taken away), and the
// player is idle. A new table is a snap (the title's backdrop), and so is a
// battle's start (onto the backdrop, the battle's table as it stood before
// anything happened: the same board, terrain and races; the start entry's
// events then play on from there); (N2) an online match followed, a refold,
// and the catch-up past a backlog() of 30 s (a scrub is N3's).
//
// (V1) Batched playback: with `batched` on (the default; the HUD's ⇉ turns
// it off, "one at a time"), a run of one seat's walks (present/pace.js's
// batchAt: a movement phase's units, between their instant events) plays
// together: the batch's advance dice in one tray row, then each walk
// PACE.stagger after the last (or once a wreck before it has broken what it
// breaks), its events folded into the mirror in order as it starts, the
// batch over when every walk is; one focus for the batch, its pauses and
// per-unit trays left out, and the flags' owners each walk changes shown
// once it has arrived (the view's holdOwners). What breaks a batch plays
// as ever.
import { applyEvent, project } from '../present/mirror.js'
import { PACE, batchAt, playTime } from '../present/pace.js'
import { wait } from './clock.js'

export class EventPlayer {
  // `view.rebuild(G, M)`: the table made to show G as it stands (M its
  // mirror); `view.text(pos, str, color)`: text floating on the table (the
  // fallback's)
  constructor({ handlers, view = null, mirror = null, onIdle = null }) {
    this.handlers = { fallback: (e, M) => this.fallback(e, M), ...handlers }
    this.view = view
    this.mirror = mirror
    this.onIdle = onIdle
    // hears every snap and every event as it is played (?debug only:
    // sim/present-check.mjs folds its own mirror from them). It is handed
    // this player's mirror, which it reads and never folds into: applyEvent
    // folds in place, so the event would be applied twice.
    this.observer = null
    this.q = []
    this.running = false
    // which table's events are playing: a snap starts a new one, and a
    // handler's promise from before it resumes nothing
    this.table = 0
    // (V1) walks batched (false: one at a time, as before V1), and how many
    // batches have played
    this.batched = true
    this.batches = 0
  }

  // the seat a unit belongs to, as shown (the batch rule's)
  sideOf(u) {
    return this.mirror?.units?.[u]?.side
  }

  get idle() {
    return !this.running && !this.q.length
  }

  // (N2) about how long, in game seconds, what is queued takes to play
  // (PACE.cost's estimate: the elastic catch-up's, app/flow.js)
  backlog() {
    // ((V1) a batch counted once, at its longest walk)
    return playTime(this.q, (u) => this.sideOf(u), this.batched)
  }

  // Queue events; they start playing now if nothing is playing.
  push(events) {
    for (const e of events) this.q.push(e)
    if (!this.running) this.run()
  }

  // Jump to G as it stands (`shown`: the mirror to show, project(G) unless
  // the caller says otherwise: the title shows its backdrop at the stage
  // 'title'). Nothing queued is played, and a handler still running (a dice
  // row, a pause) resumes nothing when it settles; the table is rebuilt
  // from G, the observer told, and the player idle (onIdle told so with
  // `{ snap: true, G }`: the table was made from G, not played up to).
  snap(G, shown = project(G)) {
    this.table++
    this.q.length = 0
    this.running = false
    this.mirror = shown
    this.view?.rebuild(G, shown)
    this.observer?.reset?.(shown)
    this.onIdle?.({ snap: true, G })
  }

  run() {
    const table = this.table
    this.running = true
    try {
      while (this.q.length) {
        // (V1) a batch of walks from here: played together
        const b = this.batched ? batchAt(this.q, 0, (u) => this.sideOf(u)) : null
        if (b) {
          this.batch(this.q.splice(0, b.to), b, table).then(
            () => table === this.table && this.run(),
            (err) => table === this.table && this.fail(err),
          )
          return
        }
        const e = this.q.shift()
        this.mirror = applyEvent(this.mirror, e)
        this.observer?.event?.(e, this.mirror)
        const r = (this.handlers[e.t] ?? this.handlers.fallback)(e, this.mirror)
        if (r && typeof r.then === 'function') {
          r.then(() => table === this.table && this.run(), (err) => table === this.table && this.fail(err))
          return
        }
      }
    } catch (err) {
      return this.fail(err)
    }
    this.running = false
    this.onIdle?.()
  }

  // (V1) A batch (`events`, batchAt's `b` over them): its advance dice in one
  // row, then its events in order, each walk started at its b.starts and
  // none awaited until the batch's end; the first focus followed,
  // the others, the pauses and the per-unit trays and dice left out (the
  // mirror folds them all). A snap in between ends it.
  async batch(events, b, table) {
    const h = this.handlers, walks = []
    this.batches++
    // (the flags' owners as shown when the batch starts, each walk's own
    // shown once it has arrived, in order: the mirror folds them as the walk
    // sets off)
    this.view?.holdOwners?.(this.mirror.owners)
    let shown = Promise.resolve()
    if (b.dice.length) {
      h['tray.open']?.({ t: 'tray.open', title: `Advance · ${b.dice.length} unit${b.dice.length > 1 ? 's' : ''}` }, this.mirror)
      await h.dice?.({ t: 'dice', label: 'D6 each', dice: b.dice, need: 0 }, this.mirror)
      if (table !== this.table) return
    }
    let focused = false
    for (const e of events) {
      // (each walk at its start: PACE.stagger after the last, later if a
      // wreck before it is still breaking scenery)
      if (e.t === 'unit.move' && walks.length) {
        await wait(b.starts[walks.length] - b.starts[walks.length - 1])
        if (table !== this.table) return
      }
      this.mirror = applyEvent(this.mirror, e)
      this.observer?.event?.(e, this.mirror)
      if (e.t === 'pause' || e.t === 'tray.open' || e.t === 'dice' || (e.t === 'focus' && focused)) continue
      if (e.t === 'objectives' && walks.length) {
        const owners = e.owners
        shown = Promise.all([shown, walks.at(-1)]).then(() => table === this.table && this.view?.holdOwners?.(owners))
      }
      if (e.t === 'focus') focused = true
      const r = (h[e.t] ?? h.fallback)(e, this.mirror)
      if (e.t === 'unit.move') walks.push(r)
      else if (r && typeof r.then === 'function') {
        await r
        if (table !== this.table) return
      }
    }
    await Promise.all(walks)
    await shown
    if (table === this.table) this.view?.holdOwners?.(null)
  }

  // An event this table has no visuals for yet: its text over the unit (or
  // the place) it names, then a beat (PACE.beat, unless it says how long),
  // so a new kind of event can ship its rules before its art.
  fallback(e, M) {
    const at = e.u !== undefined && M.units[e.u] ? M.units[e.u].pos : { x: e.x ?? 0, z: e.z ?? 0 }
    if (e.text) this.view?.text?.({ x: at.x, y: 1.6, z: at.z }, e.text, '#ffffff')
    return wait(e.beat ?? PACE.beat)
  }

  // A handler threw: nothing more is played, and the error goes on up (a
  // bug in a handler must not pass quietly).
  fail(err) {
    this.running = false
    this.q.length = 0
    throw err
  }
}
