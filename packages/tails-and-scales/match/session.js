// The Session (DESIGN §2.6): one match, as this device plays it. It folds
// the match's store (match/store.js) through the Folder (match/fold.js),
// the replicated authority, into the core, and hands what each accepted
// entry made happen (its events, §2.3) to a sink, the view; a seat played
// here sends its commands through it, as envelopes (match/envelope.js).
// Every mode is one Session over a store:
//
//   mode      seats 0 / 1      localSeats   the AI
//   vs. AI    human / ai       [0] or [1]   plays inside the fold, here
//             (or ai / human)
//   hotseat   human / human    [0, 1]       –
//   watch     ai / ai          []           plays inside the fold
//   online    human / human    [mine]       – (N2: an Automerge store)
//
// so the AI runs where the commands are folded and appends nothing (§0.2
// #9), and a game played alone goes through the same validator that guards
// online play: the device each human seat is played from (the setup names
// it), the seat's head (`p`), the match's hash (`h`) on a single seat's
// decision, then legal().
//
//   new Session({ store, localSeats, dev, rand, sink, onTrace, strict })
//                         dev: this device (the setup names it on each seat
//                         played here); rand(): an entry id's random part
//                         (N2's, so two devices sharing an id don't collide;
//                         '0' alone); strict: sim/'s, as createMatch's
//   session.start(setup, { a })  appends the log's start: the whole setup,
//                         the rules this game plays (CORE_VERSION, RULES_ID),
//                         and N2's seed reveal `a` when one is given
//   session.G             the match (null until the store has a valid start)
//   session.status        the Folder's: 'lobby' (no valid start yet: a start
//                         refused, by the Folder (an online log's start from
//                         another device than its opener's too) or as one no
//                         peer could decode, which is never appended, says
//                         why in session.error, until a start begins the
//                         match) | 'live' | 'over' | frozen:
//                         'desync' | 'skew' | 'full' | 'tamper'
//                         (session.report says what happened: its entries
//                         are decoded, a refused text's lost; N2's dialog
//                         adds the store's texts, LocalStore's export())
//   session.decisionFor() the first seat the match waits on that is played
//                         here, else -1
//   session.preview(fn)   fn(G, q) with the dice locked (core's preview): a
//                         tool's preview, the HUD, anything that must not roll
//   session.legal(seat, body)   null when seat, played here, may send body now
//   session.submit(seat, body)  appends it, as an envelope, to the store,
//                         which folds it at once (a store tells its
//                         subscribers synchronously), but for one sent
//                         from the sink while a change is being folded: it
//                         is appended then and folded once that change is
//                         done (below); throws unless legal, or when its
//                         envelope is one decode would refuse (over 1 kB,
//                         a name past 64 characters)
//   session.accepted, session.rejected   the Folder's: ids in fold order,
//                         and [{ id, why }]; its own arrays, so read-only,
//                         and read afresh after each change (a refold
//                         swaps them)
//   sink.events(events, session)   after each entry accepted: everything it
//                         made happen, in order (G.out drained: the match
//                         keeps none of them); the session is then the match
//                         those events lead to (its G, preview, accepted and
//                         the Folder's head), a refold's included. The sink
//                         may submit there (an autopilot answering a
//                         decision): the command is written on that match
//                         and appended at once, but folded only once the
//                         change in hand is done (a sync message, a reload,
//                         a refold, holds many entries), so it is stale when
//                         a later entry of that change moved its seat's head
//                         (and, refused, hands on no events: such a sink
//                         answers every batch it is handed, the last one
//                         standing), and a second submit in the same call,
//                         written on the same head, is stale too: one
//                         command a call
//   sink.reset(G, session, { undone })  the match was folded again and what
//                         was shown isn't its history any more (a concurrent
//                         insert, §2.6's sync): the view snaps to G; `undone`
//                         entries shown are accepted no longer (N2's "History
//                         changed: N moves undone"; 0 when only two seats'
//                         simultaneous entries changed order). Only with a
//                         match: a refold that leaves none (its start made
//                         inert: 'lobby', 'skew') is told by sink.status
//   sink.status(status, session)  the status changed (told once a change,
//                         when it is folded)
//   onTrace(line, G)      createMatch's, which the Folder passes (sim/; and
//                         the page's, app/flow.js: the unit card's facts, and
//                         ?debug's trace)
//
// When this device finds the match apart from an entry's author (its hash),
// it says so in the log, out of band from a seat played here, so the
// author's device freezes at the same entry (§2.6), even when its match is
// over by then (the Folder's end); a spectator only shows it.
//
// Pure and synchronous: no DOM, no three.js, nothing awaited. The view plays
// the events at its own pace, while the match has already run on to the next
// decision a human makes (a whole AI turn, after the `end` that hands it
// over); so a view reads G only when it has played everything (§2.4).
import { pendingSeats, legal, preview, stateHash, CORE_VERSION, RULES_ID } from '../core/index.js'
import { envelope, newEntryId, encode, decode } from './envelope.js'
import { Folder, SIMULTANEOUS } from './fold.js'

export class Session {
  constructor({ store, localSeats = [], dev = 'local', rand = () => '0', sink = null, onTrace = null, strict = false }) {
    this.store = store
    this.localSeats = Object.freeze([...localSeats])
    this.dev = dev
    this.rand = rand
    this.sink = sink
    this.folder = new Folder({ out: [], onTrace, strict })
    // the entry this device last reported a desync at, and why the last
    // start this device made was never appended
    this.told = null
    this.unsent = null
    // a change being folded, and another made meanwhile (onChange)
    this.folding = false
    this.again = false
    this.off = store.subscribe(() => this.onChange())
    this.onChange()
  }

  get G() {
    return this.folder.G
  }
  get status() {
    return this.folder.status
  }
  get error() {
    return this.unsent ?? this.folder.error
  }
  get report() {
    return this.folder.report
  }
  get accepted() {
    return this.folder.accepted
  }
  get rejected() {
    return this.folder.rejected
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
  // the match is live, the seat is played from this device, it is waited on
  // (a concession comes out of band, §0.2 #6: legal() alone judges it), then
  // legal()
  legal(seat, body) {
    if (this.status !== 'live') return `the match is ${this.status}`
    if (!this.localSeats.includes(seat)) return `seat ${seat} is not played on this device`
    if (this.G.setup.seats[seat]?.dev !== this.dev) return `seat ${seat} is played from another device`
    if (body?.t !== 'concede' && !pendingSeats(this.G).includes(seat)) return `seat ${seat} has no decision to make now`
    return legal(this.G, seat, body)
  }

  // A seat's command, in its envelope: after the seat's head, with the hash
  // of the match as this device sees it where one seat is waited on (none on
  // a simultaneous decision, none out of band).
  submit(seat, body) {
    const why = this.legal(seat, body)
    if (why) throw new Error(`seat ${seat} can't send ${JSON.stringify(body)}: ${why}`)
    const P = this.G.pending, oob = body.t === 'concede'
    const unsent = this.append(body, {
      s: seat,
      p: oob ? undefined : this.folder.head(seat),
      h: oob || SIMULTANEOUS.includes(P.k) ? undefined : stateHash(this.G),
    })
    if (unsent) throw new Error(`seat ${seat} can't send ${JSON.stringify(body)}: its entry would be refused (${unsent})`)
  }

  // The log's start: the whole setup (each seat played here naming this
  // device), and the rules this game plays. A setup no entry can carry
  // (too big, a number JSON can't write) is never appended: the log stays
  // in its lobby, session.error saying why, as for a start the Folder
  // refuses.
  start(setup, { a } = {}) {
    if (this.status !== 'lobby') throw new Error(`the match has started already (${this.status})`)
    this.unsent = null
    this.unsent = this.append({ t: 'start', core: CORE_VERSION, rules: RULES_ID, setup, a }, { s: -1, p: this.folder.head(-1) ?? undefined })
  }

  // An envelope from this device around `body`, appended as its text,
  // unless decode would refuse it (every peer would): then why, and
  // nothing is appended.
  append(body, fields) {
    const e = envelope(body, { id: newEntryId(this.dev, this.store.entries().length, this.rand()), d: this.dev, ...fields })
    let text
    try {
      text = encode(e)
    } catch (err) {
      return err.message
    }
    const back = decode(text)
    if (back.bad) return back.bad
    this.store.append(text)
    return null
  }

  // Fold the store's list as it now stands. Not reentrant: a change made
  // while one is being folded (a sink's submit, from the events it is
  // handed) is folded once that one is done, in another pass, so every
  // entry is pushed once and in list order, as on every peer. The flag is
  // dropped even when a sink throws, before the desync is said (its append
  // is a change of its own).
  onChange() {
    if (this.folding) {
      this.again = true
      return
    }
    const was = this.status
    this.folding = true
    try {
      do {
        this.again = false
        const { reset, undone } = this.folder.sync(this.store.entries(), (events) => this.sink?.events?.(events, this))
        if (reset && this.G) this.sink?.reset?.(this.G, this, { undone })
      } while (this.again)
    } finally {
      this.folding = false
    }
    // (why this device's start was never written says nothing once a start,
    // another device's, has begun the match)
    if (this.status !== 'lobby') this.unsent = null
    if (this.status !== was) this.sink?.status?.(this.status, this)
    this.tell()
  }

  // A desync this device found (an author's hash not its match's): say so
  // from a seat played here, once.
  tell() {
    const r = this.folder.report
    if (this.status !== 'desync' || r?.by !== 'hash' || this.told === r.at) return
    const seat = this.localSeats.find((s) => this.G.setup.seats[s]?.dev === this.dev)
    if (seat === undefined) return
    this.told = r.at
    this.append({ t: 'desync', at: r.at, mine: r.mine }, { s: seat })
  }

  // stop following the store
  close() {
    this.off()
  }
}
