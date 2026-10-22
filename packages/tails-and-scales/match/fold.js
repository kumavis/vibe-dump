// The Folder (DESIGN §2.6): the replicated authority. Every peer, and every
// device playing alone, folds a match's log through one of these, entry by
// entry, into the core (core/index.js), and every peer that holds the same
// list accepts and rejects the same entries and stands at the same match:
// the fold depends on the list alone, never on when or in what order its
// entries arrived, who is online or any local setting. It knows nothing of
// Automerge, the DOM or time.
//
//   new Folder({ out, onTrace, strict })   out: the array the match's events
//                         go to (null for a quiet fold); onTrace and strict
//                         as createMatch takes them
//   folder.G              the match, null until a valid start
//   folder.status         'lobby' until a valid start, then 'live', 'over';
//                         frozen: 'desync' (a peer's match differs from this
//                         one: its hash, or a seat's `desync` entry), 'skew'
//                         (made under another CORE_VERSION or RULES_ID:
//                         read-only, no match folded), 'full' (the log ran
//                         past MAX_ENTRIES), 'tamper' (an entry accepted here
//                         vanished from the list, another entry took its id,
//                         or the accepted entries came out of their order).
//                         After a freeze every later entry is inert;
//                         after the end too, but for what still says the
//                         match went apart (the end, below)
//   folder.accepted       ids, in fold order (the start included)
//   folder.rejected       [{ id, why }]: a refused entry, or an inert one
//   folder.count          how many entries were pushed, junk counted: what
//                         the cap (MAX_ENTRIES) counts
//   folder.error          why the last start was refused, or why it is skew
//   folder.report         a frozen match's report (freeze, below)
//   folder.head(seat)     the `p` an entry for `seat` must carry
//   folder.finals         each closing hash (`final`, N2) folded, whatever
//                         came of it, as `${device} ${head}`
//   folder.push(e)        fold one decoded entry (match/envelope.js decode);
//                         not reentrant (it throws when called while an
//                         entry is folded or its events handed on: from the
//                         match's onTrace, or from sync's `each`)
//   folder.sync(entries, each)  fold the store's list as it now stands:
//                         → { events, reset } (below); not reentrant (it
//                         throws when `each` asks for another fold)
//
// Per entry the Folder does the checks below, stateHash where one seat is
// waited on, legal() and apply(), and O(1) besides; per sync, one pass of
// identity compares over the entries pushed (the prefix check). Nothing
// per entry decodes, copies or stringifies the list (sim/fold-cost.mjs).
// (A refold folds the list again, from the one seam that starts it:
// refoldFrom.)
//
// The checks, in this order (§0.2 #2): the envelope (decode's verdict, and
// an id seen before) → the turn (the seat is one the decision pending waits
// on) → the device (the one the setup names for the seat) → prev (the
// seat's head: the first valid extension of it wins, every later one is
// stale) → h, on a single seat's decision only (deploy and the F4 vote are
// simultaneous: their entries carry none, §0.2 #3), before legal(): a
// mismatch is a desync, never a rejection, so a peer whose fold drifted is
// told so instead of rejecting the author's moves one by one into a stall
// → legal(), on the body alone (bodyOf: legal() refuses any envelope
// field, §2.6's (R6a) note) → apply.
//
// Out of band (§0.2 #6): `concede`, `desync` and (N2) `final`
// (OUT_OF_BAND, and no other kind ever: sim/data-check.mjs) come at any
// time after the start, from a seated human seat's own device; a concession
// and a desync carry no prev and no hash (an `h` or `p` one carries is never
// read). A concession is then judged by legal() alone (any human seat,
// until the battle is decided) and played; a `desync {at, mine}` freezes the
// match here too, so the author of the entry `at`, whose own hash matched,
// freezes at the same entry as the device that found it apart. A
// concession, which carries no prev, moves the head to a digest of the head
// before it, the head its accept makes and its own id (the head before
// alone names the history, which an entry that raced it may have changed:
// N2's review), so a final on it names the history that ended there. A
// `final` (the closing check, below) is never accepted: the head stays
// where the end left it.
//
// The end. Once the match is over, later entries are inert, but for two
// that say a peer's match went apart from this one (§2.6): a seat's
// `desync` still freezes it (the entry found apart may be the one that
// ended it here, or the desync may land after the end), and so does a
// seat's command, from its own device, on the very head this match ended
// at, carrying a hash that isn't this match's: its author's match went on
// where this one ended (an honest author's ends there too, so it writes
// nothing more, and a stale or forked entry never names that head; from
// any other device it is inert, or one forged entry would freeze every
// peer's result). Neither is caught when a peer whose match went on waits
// on a seat whose match is over, nor a drift inside the entry that ended
// the match: so (N2's closing check, §2.7) each seated device whose match is
// over says so once, out of band, as a `final` carrying the head its match
// ended at (`p`) and its hash after the end (`h`). A Folder on that same
// head whose match hashes otherwise (over another way, or still live) is
// apart from it: a desync by the hash, at the `final`, which its Session
// says out of band as for any other, so the device that ended freezes too
// (a desync still freezes a match that is over). On any other head it says
// nothing this Folder can check (a peer that wrote on after that head is
// held to the rule above by the device that ended): stale.
//
// Heads. While a simultaneous decision is open (the deployment, F4's vote),
// each seat extends its own head: its last accepted entry in that decision,
// else the head that opened it (the start, for the deployment); the seats'
// commands commute (the zones are 24" apart, the votes are per seat), so
// their order between the seats changes nothing. When the decision closes,
// the head is a digest of every seat's head in it (closed(), below), not the
// closing entry alone: the seat that closes it never saw the other seats'
// branches, so a second device on one seat whose branch lost (a same-seat
// fork) would otherwise write on after the close with its own placements in
// its hash, a desync where every peer must find it stale. Otherwise the head
// is the last accepted entry overall.
import { createMatch, legal, apply, stateHash, shadowState, cyrb53, CORE_VERSION, RULES_ID } from '../core/index.js'
import { bodyOf, isName, MAX_NAME } from './envelope.js'

// the decisions every seat in them answers at once
export const SIMULTANEOUS = Object.freeze(['deploy', 'roundLimit'])
// the kinds a seat sends out of band, whatever the match waits on: these
// two only (§0.2 #6)
export const OUT_OF_BAND = Object.freeze(['concede', 'desync', 'final'])
// the longest a match's log may run: past it the match freezes ('full')
export const MAX_ENTRIES = 5000
// how many trace lines a report keeps
const REPORT_LINES = 50

// where the turn stands: a decision that is still this one leaves it be
// (an entry answering a simultaneous decision moves nothing of it until
// the decision closes)
const clockOf = (G) => {
  const T = G.turn
  return `${T.stage}/${T.step}/${T.round}/${T.t}/${T.ph}/${T.overtime}`
}

// The head after a simultaneous decision closes: every seat's head in it, in
// seat order (a seat that wrote nothing in it: the head that opened it),
// as one name short enough for an entry's `p` (cyrb53, base 36). Fixed by
// the branches the decision took, never by the order its seats' entries
// were folded in.
const closed = ({ id, heads, seats }) => cyrb53(JSON.stringify(seats.map((s) => heads[s] ?? id))).toString(36)

// one entry of a store's list is still the entry folded at that place
const same = (a, b) => a === b || (!!a && !!b && a.id === b.id && JSON.stringify(a) === JSON.stringify(b))

export class Folder {
  constructor({ out = null, onTrace = null, strict = false } = {}) {
    this.opts = { out, onTrace, strict }
    this.G = null
    this.status = 'lobby'
    this.accepted = []
    this.rejected = []
    this.error = null
    this.report = null
    // every entry pushed, in list order (sync's prefix), the ids seen, the
    // device that opened an online log, the head past the last accepted
    // entry, and the simultaneous decision open: { id: the head that opened
    // it, seats: the seats it waits on, heads: { [seat]: id } }
    this.pushed = []
    this.seen = new Set()
    this.openBy = null
    this.last = null
    this.simul = null
    this.finals = new Set()
    // a sync under way (sync), and an entry being folded or its events
    // handed on (push)
    this.syncing = false
    this.busy = false
  }

  head(seat) {
    return this.simul ? this.simul.heads[seat] ?? this.simul.id : this.last
  }

  get count() {
    return this.pushed.length
  }

  // Fold one entry. Not reentrant: an entry pushed while one is folded (from
  // the match's onTrace) or while one's events are handed on (sync's `each`)
  // would land in the middle of the list every other peer folds whole.
  push(e) {
    if (this.busy) throw new Error('Folder.push is not reentrant: it was called while an entry was being folded or its events handed on')
    this.busy = true
    try {
      this.judge(e)
    } finally {
      this.busy = false
    }
  }

  // (push's checks, in §0.2 #2's order)
  judge(e) {
    this.pushed.push(e)
    if (this.pushed.length > MAX_ENTRIES) {
      if (this.status === 'lobby' || this.status === 'live') this.halt('full', { at: e.id ?? null, why: `the log ran past ${MAX_ENTRIES} entries` })
      return this.inert(e)
    }
    if (e.bad) return this.reject(e, `envelope: ${e.bad}`)
    if (this.seen.has(e.id)) return this.reject(e, 'envelope: an id seen before')
    this.seen.add(e.id)
    if (this.status === 'lobby') {
      // an online log opens with `open` (N2), a local one with its start
      if (e.t === 'open' && this.openBy === null) {
        this.openBy = e.d
        return this.accept(e)
      }
      if (e.t === 'start' && (this.openBy === null || e.d === this.openBy)) return this.begin(e)
      if (e.t === 'start') this.error = `the log was opened by device ${this.openBy}: only its start counts`
      return this.inert(e)
    }
    if (this.status === 'over') {
      // what still says a peer's match went apart from this one (the end,
      // above): a seat's desync or final, a seat's hashed command on the
      // last head
      if (e.t === 'desync' || e.t === 'final') return this.outOfBand(e)
      const seat = this.G.setup.seats[e.s]
      if (e.h !== undefined && e.p === this.last && e.t !== 'concede' && seat?.ctrl === 'human' && e.d === seat.dev && e.h !== stateHash(this.G)) return this.freeze(e)
    }
    if (this.status !== 'live') return this.inert(e)
    if (e.t === 'open' || e.t === 'start') return this.reject(e, `turn: the match has begun, so no ${e.t}`)
    if (OUT_OF_BAND.includes(e.t)) return this.outOfBand(e)
    const G = this.G, P = G.pending
    if (!P.seats.includes(e.s)) return this.reject(e, `turn: seat ${e.s} has no decision to make`)
    if (e.d !== G.setup.seats[e.s].dev) return this.reject(e, `device: seat ${e.s} is not played from ${e.d}`)
    if (e.p !== this.head(e.s)) return this.reject(e, `stale: seat ${e.s}'s head is ${this.head(e.s)}, not ${e.p}`)
    if (!SIMULTANEOUS.includes(P.k) && e.h !== stateHash(G)) return this.freeze(e)
    const body = bodyOf(e)
    const why = legal(G, e.s, body)
    if (why) return this.reject(e, `illegal: ${why}`)
    const clock = clockOf(G)
    apply(G, e.s, body)
    return this.accept(e, P, clock)
  }

  // A start: the match, made from the whole setup, if this game's rules are
  // the ones it was made under; else read-only ('skew').
  begin(e) {
    if (e.core !== CORE_VERSION || e.rules !== RULES_ID) {
      this.error = `this battle was made with another version of the game (core ${e.core}, rules ${e.rules}; this is core ${CORE_VERSION}, rules ${RULES_ID})`
      this.reject(e, `skew: ${this.error}`)
      return this.halt('skew', { at: e.id, why: this.error })
    }
    // a human seat is played from the device the setup names for it, a
    // name an entry can carry as its `d` (else the match would wait on that
    // seat for ever: no peer decodes its entries)
    const seats = Array.isArray(e.setup.seats) ? e.setup.seats : []
    const nameless = seats.findIndex((x) => x?.ctrl === 'human' && !isName(x.dev))
    if (nameless >= 0) {
      const dev = seats[nameless].dev
      this.error = typeof dev === 'string' && dev ? `seat ${nameless} names a device no entry can carry (${dev.length} characters; at most ${MAX_NAME})` : `seat ${nameless} is a human seat that names no device`
      return this.reject(e, `start: ${this.error}`)
    }
    try {
      this.G = createMatch(e.setup, { out: this.opts.out, onTrace: this.opts.onTrace, strict: this.opts.strict })
    } catch (err) {
      this.error = err.message
      return this.reject(e, `start: ${err.message}`)
    }
    this.error = null
    this.status = 'live'
    return this.accept(e)
  }

  // concede and desync: a seated human seat, from its own device
  outOfBand(e) {
    const G = this.G, seat = G.setup.seats[e.s]
    if (!seat || seat.ctrl !== 'human') return this.reject(e, `seat: ${e.t} from seat ${e.s}, which no human plays`)
    if (e.d !== seat.dev) return this.reject(e, `device: seat ${e.s} is not played from ${e.d}`)
    if (e.t === 'desync') {
      // the hash this fold agreed to at entry `at` (the author's own, which
      // it checked), against the one the seat's device found
      const at = this.pushed.find((x) => x.id === e.at && !x.bad)
      this.accept(e)
      return this.halt('desync', { at: e.at, theirs: e.mine, mine: at?.h ?? null, by: e.id, seat: e.s })
    }
    if (e.t === 'final') return this.closing(e)
    const body = bodyOf(e)
    const why = legal(G, e.s, body)
    if (why) return this.reject(e, `illegal: ${why}`)
    const before = this.last
    apply(G, e.s, body)
    this.accept(e)
    this.last = cyrb53(JSON.stringify([before, this.last, e.id])).toString(36)
  }

  // (N2) A seat's device says its match is over, at the head `p`, hashing
  // to `h` (the end, above): on this same head a hash that isn't this
  // match's is a desync by the hash; else it agrees, or (another head) says
  // nothing this Folder can check. Never accepted.
  closing(e) {
    this.finals.add(`${e.d} ${e.p}`)
    if (e.p !== this.last) return this.reject(e, `stale: the match's head is ${this.last}, not ${e.p}`)
    if (e.h !== stateHash(this.G)) return this.freeze(e)
    return this.reject(e, `inert: the match is ${this.status}, its closing hash agreeing`)
  }

  // The author's hash isn't this match's: a desync, at this entry. Neither
  // accepted nor rejected; the match stops here.
  freeze(e) {
    return this.halt('desync', { at: e.id, theirs: e.h ?? null, mine: stateHash(this.G), by: 'hash', seat: e.s })
  }

  // Freeze (or end read-only) with a report (§2.7: the setup, the raw
  // entries, what was accepted and rejected, where it went apart and both
  // hashes, the last trace lines and the state; the page adds the browser,
  // the URL and the time, N2).
  halt(status, info) {
    this.status = status
    const G = this.G
    this.report = {
      status, ...info, core: CORE_VERSION, rules: RULES_ID, count: this.pushed.length,
      setup: G?.setup ?? null, entries: this.pushed.slice(), accepted: this.accepted.slice(), rejected: this.rejected.map((r) => ({ ...r })),
      trace: G ? G.journal.trace.slice(-REPORT_LINES) : [], state: G ? shadowState(G) : null,
    }
  }

  // `P` and `clock`: the decision the entry answered, and where the turn
  // stood before it
  accept(e, P = null, clock = null) {
    this.accepted.push(e.id)
    this.last = e.id
    const G = this.G, now = G?.pending, open = this.simul
    const simultaneous = !!now && SIMULTANEOUS.includes(now.k)
    // the same decision still open: this seat's head moves on
    if (open && simultaneous && P?.k === now.k && clockOf(G) === clock) open.heads[e.s] = e.id
    else {
      // the decision open closes here: the head commits to every seat's
      // branch in it (an entry answering it is its seat's last)
      if (open) {
        if (P) open.heads[e.s] = e.id
        this.last = closed(open)
      }
      // a new one, opened by this head
      this.simul = simultaneous ? { id: this.last, seats: [...now.seats], heads: {} } : null
    }
    if (G && G.turn.stage === 'over' && this.status === 'live') this.status = 'over'
  }

  reject(e, why) {
    this.rejected.push({ id: e.id ?? null, why })
  }

  inert(e) {
    this.reject(e, this.status === 'lobby' ? 'inert: the match has not started' : `inert: the match is ${this.status}`)
  }

  // One entry, its events handed on: what an accepted entry made happen
  // (the match keeps none of it in G.out), to `each(events, e)` and onto
  // `events`.
  step(e, events, each) {
    const n = this.accepted.length
    this.push(e)
    if (this.accepted.length === n || !this.G?.out) return
    const batch = this.G.out.splice(0)
    events.push(...batch)
    if (!each) return
    // (nothing is pushed meanwhile: push throws)
    this.busy = true
    try {
      each(batch, e)
    } finally {
      this.busy = false
    }
  }

  // Fold the store's list as it now stands (`entries`, decoded, in list
  // order) → { events, reset, undone }.
  //   - The entries already pushed are a prefix of the list: the rest are
  //     pushed, their events handed on.
  //   - Not (a concurrent insert landed before entries already folded,
  //     which Automerge does when the higher actor's change arrives later):
  //     the list is folded again from the start, quietly. While the new
  //     accepted ids are the old ones, nothing shown is undone: once they
  //     are all accepted again, the rest is pushed with events. Otherwise
  //     the whole refold is quiet and `reset` is true: the view snaps to the
  //     new match. `undone` counts the entries shown that the new match has
  //     not accepted at all ("History changed: N moves undone": two devices
  //     on one seat, or a forged entry); two seats' entries in a
  //     simultaneous decision folded in another order undo none (they
  //     commute: the snap shows the same table).
  //   - An entry accepted here that is gone from the list is tamper: the
  //     match freezes as it stands, for this Folder's life (a later list,
  //     whatever it holds, folds nothing more; an entry that becomes
  //     rejected after a concurrent insert is not tamper). So is an accepted
  //     id that now names another entry first (another body under it,
  //     deleted and written again, or inserted before it), which a check by
  //     ids alone would refold silently into another match, the view never
  //     told; and so are the accepted ids' entries out of the order they
  //     were folded in (a copy of an entry inserted before the head it was
  //     written after: stale there, it would make the entry itself a
  //     duplicate, undoing it and all after it). An insert never moves an
  //     element already in the list, and a copy written by a peer holding
  //     the entry lands after it, so neither happens in honest play.
  // `each(events, e)` hears each entry's events as they are handed on; by
  // then the Folder is the match that made them (a refold's included), so
  // its G, accepted and head() are the ones those events lead to. It must
  // not fold again (sync throws: the rest of the list would be pushed twice);
  // the Session folds a change made then once this one is done.
  sync(entries, each = null) {
    if (this.syncing) throw new Error('Folder.sync is not reentrant: it was called again while it handed on an entry\'s events')
    this.syncing = true
    try {
      return this.fold(entries, each)
    } finally {
      this.syncing = false
    }
  }

  // Where a refold of the list starts: a quiet Folder, and the first entry
  // of the list it has still to push. Today a fresh Folder, from the start:
  // the one seam a checkpoint (S6) would start it from instead (a copy of
  // a Folder that had pushed the list's first k entries, and k, where the
  // list still begins with those).
  refoldFrom() {
    return { next: new Folder({ ...this.opts, out: null, onTrace: null }), from: 0 }
  }

  // (sync's fold, under its flag)
  fold(entries, each) {
    const events = []
    if (this.status === 'tamper') return { events, reset: false, undone: 0 }
    // (the list as it stands as the sync begins: a store may hand out its
    // own array, and what joins it meanwhile is the next sync's)
    const N = entries.length, n = this.pushed.length
    let prefix = N >= n
    for (let i = 0; prefix && i < n; i++) prefix = same(entries[i], this.pushed[i])
    if (prefix) {
      for (let i = n; i < N; i++) this.step(entries[i], events, each)
      return { events, reset: false, undone: 0 }
    }
    // (an id's entry: the first good one carrying it, the one a fold takes,
    // and its place in the list)
    const firsts = (list, len) => {
      const m = new Map()
      for (let i = 0; i < len; i++) if (!list[i].bad && !m.has(list[i].id)) m.set(list[i].id, { e: list[i], i })
      return m
    }
    const now = firsts(entries, N), was = firsts(this.pushed, n)
    const gone = this.accepted.filter((id) => !now.has(id) || !same(now.get(id).e, was.get(id).e))
    const moved = this.accepted.filter((id, k) => k > 0 && now.get(id)?.i < now.get(this.accepted[k - 1])?.i)
    if (gone.length || moved.length) {
      this.halt('tamper', gone.length ? { at: gone[0], gone } : { at: moved[0], moved })
      return { events, reset: false, undone: 0 }
    }
    const old = this.accepted
    const { next, from } = this.refoldFrom()
    let showing = false, apart = false
    // From here on the match is shown again (its events and trace lines),
    // and the refold is this Folder: whoever is handed an entry's events
    // (the Session's sink) reads the match they lead to, never the old one.
    // (A start still to come is begun with this Folder's own opts; the sync
    // under way is still this one's.)
    const show = () => {
      showing = true
      if (next.G) Object.assign(next.G, { out: this.opts.out ? [] : null, onTrace: this.opts.onTrace })
      Object.assign(this, { ...next, opts: this.opts, syncing: true })
    }
    if (!old.length) show()
    for (let i = from; i < N; i++) {
      const e = entries[i]
      if (showing) {
        this.step(e, events, each)
        continue
      }
      const k = next.accepted.length
      next.push(e)
      if (apart || next.accepted.length === k) continue
      if (next.accepted[k] !== old[k]) apart = true
      else if (k + 1 === old.length) show()
    }
    // (a refold that never caught up with what was shown undid some of it)
    const reset = !showing
    if (reset) show()
    const kept = new Set(this.accepted)
    return { events, reset, undone: reset ? old.filter((id) => !kept.has(id)).length : 0 }
  }
}
