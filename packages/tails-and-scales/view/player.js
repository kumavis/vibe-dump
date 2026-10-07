// The EventPlayer (DESIGN §2.4): plays the match's events, in order, at the
// view's pace. The rules run ahead synchronously and leave their events in
// G.out; main.js drains them into play() and awaits it, so the view shows
// what happened one event at a time, while the mirror (present/mirror.js)
// folds each event as it is played: the state as shown, which the figures,
// labels, flags and score read instead of G.
//
// A handler is the old code's visuals for one kind of event, verbatim (a
// dice row in the tray, a figure's fall, a line in the battle log), called
// with the event and the mirror just after the event is folded in. It
// returns a promise when the next event must wait for it (a dice row, a
// pause), else nothing; events whose handlers take no time play at once, so
// draining a terrain call's reports while the player is idle plays them
// before play() returns, as the old code did. An event with no handler goes
// to `fallback`.
//
// Transitional (R5): through R5 main.js wraps each action it has converted
// as `fn(G, …); await player.play(drain(G))`, and its own code emits and
// plays the flow events (phase starts, scores, action ends) the step machine
// will emit from R6. R7's player adds snap(G) (it needs TerrainView.sync);
// backlog() and catch-up are N2's. Here a new table only resets the mirror
// (reset).
import { applyEvent } from '../present/mirror.js'

export class EventPlayer {
  constructor({ handlers, mirror = null, onIdle = null }) {
    this.handlers = handlers
    this.mirror = mirror
    this.onIdle = onIdle
    // hears every reset and every event as it is played (?debug only:
    // sim/present-check.mjs folds its own mirror from them). It is handed
    // this player's mirror, which it reads and never folds into: applyEvent
    // folds in place, so the event would be applied twice.
    this.observer = null
    this.q = []
    this.running = false
    this.waiters = []
    // which table's events are playing: reset() starts a new one, and a
    // handler's promise from the last table resumes nothing
    this.table = 0
  }

  get idle() {
    return !this.running && !this.q.length
  }

  // Queue events; they start playing now if nothing is playing.
  push(events) {
    for (const e of events) this.q.push(e)
    if (!this.running) this.run()
  }

  // Queue events; resolves once everything queued has played.
  play(events) {
    this.push(events)
    if (this.idle) return Promise.resolve()
    return new Promise((resolve, reject) => this.waiters.push({ resolve, reject }))
  }

  // A new table: the mirror becomes `mirror` (project(G) of a match that
  // hasn't run ahead), and nothing queued is played. Today a table is only
  // replaced while the player is idle (from the title or the end screen),
  // but should one be replaced mid-playback, nothing of the old one carries
  // on: a handler still running (a dice row, a pause) resumes nothing when
  // it settles, the new table's events play at once, and whoever awaited
  // the old table's events is left waiting with it, never resumed against
  // the new match (their play() promises are dropped, not settled).
  reset(mirror) {
    this.table++
    this.q.length = 0
    this.running = false
    this.waiters.length = 0
    this.mirror = mirror
    this.observer?.reset?.(mirror)
  }

  run() {
    const table = this.table
    this.running = true
    try {
      while (this.q.length) {
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
    for (const w of this.waiters.splice(0)) w.resolve()
  }

  // A handler threw: nothing more is played, whoever waits hears why, and
  // the error goes on up (a bug in a handler must not pass quietly).
  fail(err) {
    this.running = false
    this.q.length = 0
    for (const w of this.waiters.splice(0)) w.reject(err)
    throw err
  }
}
