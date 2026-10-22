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
//                         subscribers synchronously); throws unless legal,
//                         or when its envelope is one decode would refuse
//                         (over 1 kB, a name past 64 characters). Sent while
//                         a change is being folded (from any sink callback,
//                         or onTrace) it is queued instead, as its body (the
//                         single flight, below)
//   session.accepted, session.rejected   the Folder's: ids in fold order,
//                         and [{ id, why }]; its own arrays, so read-only,
//                         and read afresh after each change (a refold
//                         swaps them)
//   session.count         how many entries the Folder has pushed, junk
//                         counted (what the log's cap counts: F4's offer
//                         cap, the HUD)
//   sink.events(events, session)   after each entry accepted: everything it
//                         made happen, in order (G.out drained: the match
//                         keeps none of them); the session is then the match
//                         those events lead to (its G, preview, accepted and
//                         the Folder's head), a refold's included, though
//                         more entries of the same change may follow
//   sink.reset(G, session, { undone })  the match was folded again and what
//                         was shown isn't its history any more (a concurrent
//                         insert, §2.6's sync): the view snaps to G; `undone`
//                         entries shown are accepted no longer (N2's "History
//                         changed: N moves undone"; 0 when only two seats'
//                         simultaneous entries changed order). Only with a
//                         match: a refold that leaves none (its start made
//                         inert: 'lobby', 'skew') is told by sink.status
//   sink.status(status, session)  the status changed (told once the change
//                         that changed it is folded)
//   sink.settled(session) once a change is folded and nothing else is to be:
//                         no entry left to fold, nothing queued (so a burst
//                         of changes, a sync message's entries and what the
//                         sink queued meanwhile, is folded first). The place
//                         to answer a decision (an autopilot, an auto-End):
//                         the match there is the match the store's whole
//                         list leads to, and a submit there is queued, then
//                         written on it and folded, a change of its own,
//                         which settles again
//   sink.dropped(seat, body, why, session)  a queued submit no longer legal
//                         when its turn to be written came (or one decode
//                         would refuse): never written
//   onTrace(line, G)      createMatch's, which the Folder passes (sim/; and
//                         the page's, app/flow.js: the unit card's facts, and
//                         ?debug's trace)
//
// The single flight. A change is folded whole before anything else is
// written: a submit (or a start) made while one is being folded, from any
// sink callback (events, reset, status, settled, dropped) or the match's
// onTrace, is queued as its body, never appended there and then. Once the
// change is folded (its status told, a desync this device found said), the
// queue drains one body at a time: each is held to legal() again, on the
// match as it then stands, and either dropped (sink.dropped says why) or
// written (its envelope, its id, the seat's head as `p` and the match's
// hash as `h`, built then, from that match) and folded before the next is
// looked at; and only with the queue empty is the sink told it settled. So
// a queued command is never stale for what its own change still held, a
// second one from the same callback is written on the head the first left,
// and every entry is pushed once, in list order, as on every peer. A change
// that reaches the store meanwhile (a peer's entries, a sync message) is
// folded first, in another pass. (legal() is all a queued body is held to:
// one a sink sent from an entry's events that a later entry of the change
// made needless but not illegal, a second End, is written. So decisions are
// answered in settled, where nothing of the change is left to come.)
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
    if (!Number.isInteger(store.length)) throw new Error('a MatchStore tells its length (match/store.js)')
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
    // The next entry's number in its id (newEntryId): counted on from the
    // log's length as the Session is made, never read off the list (which
    // a store may build afresh), and still past every number this device
    // wrote before (each of its entries is one of the log's).
    this.n = store.length
    // the single flight (onChange): a change being folded, another made
    // meanwhile, a change folded since the sink was told it settled, the
    // status it was last told, and the submits waiting for the change in
    // hand to be folded ({ seat, body })
    this.folding = false
    this.again = false
    this.dirty = false
    this.shown = this.folder.status
    this.queue = []
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
  get count() {
    return this.folder.count
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

  // A seat's command: written now, or, while a change is being folded,
  // queued as its body until that change is folded (the single flight).
  submit(seat, body) {
    // bodies still queued from an earlier change (a sink threw before they
    // drained) go first, so the log keeps the order they were made in
    if (!this.folding && this.queue.length) this.onChange()
    const why = this.legal(seat, body)
    if (why) throw new Error(`seat ${seat} can't send ${JSON.stringify(body)}: ${why}`)
    if (this.folding) {
      this.queue.push({ seat, body: { ...body } })
      return
    }
    const unsent = this.send(seat, body)
    if (unsent) throw new Error(`seat ${seat} can't send ${JSON.stringify(body)}: its entry would be refused (${unsent})`)
  }

  // A seat's command, in its envelope: after the seat's head, with the hash
  // of the match as this device sees it where one seat is waited on (none on
  // a simultaneous decision, none out of band); both read now, from the
  // match as it stands. Returns why it was not appended (decode would
  // refuse it), else null.
  send(seat, body) {
    const P = this.G.pending, oob = body.t === 'concede'
    return this.append(body, {
      s: seat,
      p: oob ? undefined : this.folder.head(seat),
      h: oob || SIMULTANEOUS.includes(P.k) ? undefined : stateHash(this.G),
    })
  }

  // The log's start: the whole setup (each seat played here naming this
  // device), and the rules this game plays. A setup no entry can carry
  // (too big, a number JSON can't write) is never appended: the log stays
  // in its lobby, session.error saying why, as for a start the Folder
  // refuses. Made while a change is being folded, it is queued as a submit
  // is (and dropped if a start has begun the match by its turn).
  start(setup, { a } = {}) {
    if (this.status !== 'lobby') throw new Error(`the match has started already (${this.status})`)
    if (this.folding) {
      this.queue.push({ seat: -1, body: { t: 'start', setup, a } })
      return
    }
    this.begin(setup, a)
  }

  begin(setup, a) {
    this.unsent = null
    this.unsent = this.append({ t: 'start', core: CORE_VERSION, rules: RULES_ID, setup, a }, { s: -1, p: this.folder.head(-1) ?? undefined })
  }

  // An envelope from this device around `body`, appended as its text,
  // unless decode would refuse it (every peer would): then why, and
  // nothing is appended.
  append(body, fields) {
    const e = envelope(body, { id: newEntryId(this.dev, this.n, this.rand()), d: this.dev, ...fields })
    let text
    try {
      text = encode(e)
    } catch (err) {
      return err.message
    }
    const back = decode(text)
    if (back.bad) return back.bad
    this.n++
    this.store.append(text)
    return null
  }

  // The next queued body, held to legal() again on the match as it now
  // stands: written (and so folded, the store telling this Session at
  // once: another pass), or dropped, the sink told why.
  drain() {
    const { seat, body } = this.queue.shift()
    if (seat === -1 && body.t === 'start') {
      if (this.status !== 'lobby') this.call(() => this.sink?.dropped?.(seat, body, `the match has started already (${this.status})`, this))
      else this.begin(body.setup, body.a)
      return
    }
    const why = this.legal(seat, body) ?? this.send(seat, body)
    if (why) this.call(() => this.sink?.dropped?.(seat, body, why, this))
  }

  // A sink's callback (or a pass, which runs them): its first error is kept
  // and thrown once the loop is done, so a sink that throws never strands
  // a queued body, loses a status or skips `settled`.
  call(fn) {
    try {
      fn()
    } catch (err) {
      this.failed ??= err
      return false
    }
    return true
  }

  // Fold the store's list as it now stands, and everything that follows
  // from it, one thing at a time (the single flight, above): a change that
  // reached the store (a pass), the status told when it changed, a desync
  // this device found said (a change of its own), the next queued body
  // written or dropped (a change of its own), and, with nothing left, the
  // sink told it settled (once a change). Not reentrant: a change made
  // meanwhile sets `again` and is folded in the next pass, so every entry
  // is pushed once and in list order, as on every peer. A sink that throws
  // doesn't end the loop: its first error is kept (call(), above) and thrown
  // once the loop is done, after every queued body has been written or
  // dropped and `settled` told; the flag drops in any case.
  onChange() {
    if (this.folding) {
      this.again = true
      return
    }
    this.folding = true
    this.again = true
    this.failed = null
    try {
      for (;;) {
        if (this.again) {
          // a pass that throws part way (a sink's onTrace, say) may still
          // have folded entries: count the change as made, so it settles
          if (!this.call(() => this.pass())) this.dirty = true
        } else if (this.status !== this.shown) {
          this.shown = this.status
          this.call(() => this.sink?.status?.(this.status, this))
        } else if (!this.tell()) {
          if (this.queue.length) this.drain()
          else if (this.dirty) {
            this.dirty = false
            this.call(() => this.sink?.settled?.(this))
          } else break
        }
      }
    } finally {
      this.folding = false
    }
    const err = this.failed
    this.failed = null
    if (err) throw err
  }

  // One pass: the store's list as it now stands, through the Folder, each
  // entry's events to the sink (a reset told after).
  pass() {
    this.again = false
    const was = this.folder.count
    const { reset, undone } = this.folder.sync(this.store.entries(), (events) => this.call(() => this.sink?.events?.(events, this)))
    if (reset && this.G) this.call(() => this.sink?.reset?.(this.G, this, { undone }))
    if (reset || this.folder.count !== was) this.dirty = true
    // (why this device's start was never written says nothing once a
    // start, another device's, has begun the match)
    if (this.status !== 'lobby') this.unsent = null
  }

  // A desync this device found (an author's hash not its match's): said
  // from a seat played here, once (true when it was).
  tell() {
    const r = this.folder.report
    if (this.status !== 'desync' || r?.by !== 'hash' || this.told === r.at) return false
    const seat = this.localSeats.find((s) => this.G.setup.seats[s]?.dev === this.dev)
    if (seat === undefined) return false
    this.told = r.at
    this.append({ t: 'desync', at: r.at, mine: r.mine }, { s: seat })
    return true
  }

  // stop following the store
  close() {
    this.off()
  }
}
