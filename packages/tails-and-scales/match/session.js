// The Session (DESIGN §2.6): one match, as this device plays it. It folds
// the match's store (match/store.js) through the core, entry by entry, and
// hands what each entry made happen (its events, §2.3) to a sink, the view;
// a seat played here sends its commands through it. Every mode is one
// Session over a store:
//
//   mode      seats 0 / 1      localSeats   the AI
//   vs. AI    human / ai       [0] or [1]   plays inside the fold, here
//             (or ai / human)
//   hotseat   human / human    [0, 1]       –
//   watch     ai / ai          []           plays inside the fold
//
// so the AI runs where the commands are folded and appends nothing (§0.2 #9).
// The store's first entry starts the match (`{ s: -1, t: 'start', setup }`,
// createMatch from the whole setup); every later one is a command, played
// for its seat `s` with the rest of the entry as the body. Plain bodies, no
// envelopes yet: R8 puts the Folder (devices, `prev`, the state hash) between
// the store and the core, and this keeps its shape.
//
//   new Session({ store, localSeats, sink, onTrace })
//   session.G             the match (null until the store has its start)
//   session.status        'lobby' (no start yet) | 'live' | 'over' |
//                         'refused' (a start the core refused: session.error)
//   session.decisionFor() the first seat the match waits on that is played
//                         here, else -1
//   session.preview(fn)   fn(G, q) with the dice locked (core's preview): a
//                         tool's preview, the HUD, anything that must not roll
//   session.legal(seat, body)   null when seat, played here, may send body now
//   session.submit(seat, body)  appends it to the store, which folds it at
//                         once (a store tells its subscribers synchronously);
//                         throws unless legal
//   session.rejected      the entries the fold refused: [{ at, why }]
//   sink.events(events, session)   after each entry is folded: everything it
//                         made happen, in order (G.out drained: the match keeps
//                         none of them)
//   onTrace(line, G)      createMatch's (sim/ and ?debug only)
//
// Pure and synchronous: no DOM, no three.js, nothing awaited. The view plays
// the events at its own pace, while the match has already run on to the next
// decision a human makes (a whole AI turn, after the `end` that hands it
// over); so a view reads G only when it has played everything (§2.4).
import { createMatch, pendingSeats, legal, apply, preview } from '../core/index.js'

export class Session {
  constructor({ store, localSeats = [], sink = null, onTrace = null }) {
    this.store = store
    this.localSeats = Object.freeze([...localSeats])
    this.sink = sink
    this.onTrace = onTrace
    this.G = null
    this.status = 'lobby'
    this.error = null
    this.rejected = []
    // how many of the store's entries have been folded
    this.folded = 0
    this.off = store.subscribe(() => this.onChange())
    this.onChange()
  }

  // the first seat the match is waiting on that this device plays, or -1
  decisionFor() {
    const P = this.G?.pending
    return P?.seats.find((s) => this.localSeats.includes(s)) ?? -1
  }

  preview(fn) {
    if (!this.G) throw new Error('no match to preview: the store has no start yet')
    return preview(this.G, fn)
  }

  // null when `seat`, a seat played here, may send `body` now, else why not:
  // the match is live, the seat is waited on (a concession comes out of band,
  // §0.2 #6: legal() alone judges it), then legal()
  legal(seat, body) {
    if (this.status !== 'live') return `the match is ${this.status}`
    if (!this.localSeats.includes(seat)) return `seat ${seat} is not played on this device`
    if (body?.t !== 'concede' && !pendingSeats(this.G).includes(seat)) return `seat ${seat} has no decision to make now`
    return legal(this.G, seat, body)
  }

  submit(seat, body) {
    const why = this.legal(seat, body)
    if (why) throw new Error(`seat ${seat} can't send ${JSON.stringify(body)}: ${why}`)
    this.store.append({ s: seat, ...body })
  }

  // fold whatever the store holds that hasn't been folded yet
  onChange() {
    const entries = this.store.entries()
    while (this.folded < entries.length) {
      const k = this.folded++
      this.fold(entries[k], k)
    }
  }

  fold(e, k) {
    if (this.status === 'lobby') {
      if (e?.t !== 'start') return this.reject(k, 'the log has no start yet')
      try {
        this.G = createMatch(e.setup, { out: [], onTrace: this.onTrace })
      } catch (err) {
        this.status = 'refused'
        this.error = err.message
        return this.reject(k, err.message)
      }
    } else if (this.status !== 'live') {
      return this.reject(k, `the match is ${this.status}`)
    } else {
      // the seat beside the body, never in it: legal() refuses a field its
      // kind doesn't take (§2.6, bodyOf at R8)
      const { s, ...body } = e
      if (body.t === 'start') return this.reject(k, 'the match has started already')
      if (body.t !== 'concede' && !pendingSeats(this.G).includes(s)) return this.reject(k, `seat ${s} has no decision to make`)
      const why = legal(this.G, s, body)
      if (why) return this.reject(k, why)
      apply(this.G, s, body)
    }
    this.status = this.G.turn.stage === 'over' ? 'over' : 'live'
    this.sink?.events?.(this.G.out.splice(0), this)
  }

  reject(at, why) {
    this.rejected.push({ at, why })
  }

  // stop following the store
  close() {
    this.off()
  }
}
