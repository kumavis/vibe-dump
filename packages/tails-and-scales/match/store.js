// Match stores (DESIGN §2.6): where a match's log lives. A store holds the
// entries in list order and tells its subscribers when the list changes; the
// Session (match/session.js) folds them through the Folder (match/fold.js)
// into the core. It holds commands, never game state: the match is a pure
// function of its entries.
//
//   MatchStore = { kind: 'local' | 'automerge', length, entries(): Entry[]
//                  (decoded, list order), append(entry | text): void,
//                  subscribe(fn): () => void }
//
// entries() is the decoded list as it stands, the same object for the same
// entry across calls: a fast path for the Folder's prefix check (it tells
// a prefix by identity first), never something it relies on (it falls back
// to the entry's id and content). So a store caches what it decodes per
// list element or per text, never per index alone: a store that inserts
// (Automerge, N1) shifts every later index, and an index's old entry handed
// out at its new place reads as a prefix, the inserted entry never folded.
// The array it returns is read-only, and may be the store's own (it then
// grows as entries are appended: LocalStore's); a caller that keeps one
// copies it. Nothing per entry decodes, copies or stringifies the list:
// entries() decodes each text once, `length` is the entry count without a
// list (the Session numbers its ids by its own counter: match/session.js),
// and the Folder compares by identity first (sim/fold-cost.mjs holds a
// fold of a 5,000-entry log to linear time).
// append takes an envelope, or the text it is written as (the Session
// hands over the text it has checked decode takes: kept as it is, never
// encoded again).
//
// An entry is an envelope (match/envelope.js): the log's first entry starts
// the match ({ id, s: -1, d, t: 'start', core, rules, setup }: the whole
// setup, createMatch's, so the log is a replay), every later one is a
// command for a seat ({ id, s, d, p, h?, t, …fields }), or a seat's
// concession or desync out of band. A store keeps each as the text it is
// shared as (canonical JSON, as the Automerge document keeps it: N1's
// AutomergeStore) and hands out what match/envelope.js decodes from it, so
// a device playing alone folds exactly what a peer would: an entry decode
// refuses comes back marked `bad`, for the Folder to reject.
//
// LocalStore is the store of every mode played on one device (vs. the AI,
// hotseat, watch, sim/): a list of texts. Its subscribers hear an append
// synchronously, before append returns, as the Automerge store's will on a
// local change.
import { encode, decode } from './envelope.js'

export class LocalStore {
  // `entries`: envelopes, or texts as export() wrote them (a replay; a text
  // is kept as it is, so junk stays junk)
  constructor(entries = []) {
    this.kind = 'local'
    this.log = entries.map((e) => (typeof e === 'string' ? e : encode(e)))
    // each text decoded once, by its place in the log (safe here only
    // because this store never inserts: the MatchStore note above)
    this.decoded = []
    this.subs = new Set()
  }

  // how many entries the log holds
  get length() {
    return this.log.length
  }

  // the decoded log: this store's own array (read-only; it grows at its
  // end as entries are appended, the only change a LocalStore makes)
  entries() {
    for (let i = this.decoded.length; i < this.log.length; i++) this.decoded.push(decode(this.log[i]))
    return this.decoded
  }

  // an envelope (or a text, kept as it is)
  append(entry) {
    this.log.push(typeof entry === 'string' ? entry : encode(entry))
    for (const fn of [...this.subs]) fn()
  }

  subscribe(fn) {
    this.subs.add(fn)
    return () => this.subs.delete(fn)
  }

  // the log as a replay (a few kB): every entry's text, in order
  export() {
    return JSON.stringify(this.log)
  }
}
