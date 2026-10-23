// The Automerge match store (DESIGN §2.7, N1): the MatchStore contract
// (match/store.js) over an automerge-repo document handle, the log a peer
// shares online. The document holds commands, never state:
//
//   { app: 'tails-and-scales', schema: 1, lobby: {…}, log: [ImmutableString, …] }
//
// each log element the canonical JSON text of one envelope
// (match/envelope.js), written once by one change and never edited. Every
// peer's Folder folds the list as Automerge orders it, which may put a
// concurrent insert before entries a peer has already folded (the higher
// actor id first): the Folder then folds again (match/fold.js's sync).
//
// What the contract asks of a store, and how this one meets it:
//   - entries(): the decoded list, the same object for the same entry
//     across calls. Each text is decoded once (a Map from text to entry:
//     decode depends only on the text, and every text carries a unique id),
//     never cached by place, since an insert shifts every later place. The
//     array is this store's own, kept in step with the document by each
//     change's patches (an insert into the log spliced in where it lands),
//     so nothing per change decodes, copies or stringifies the whole list
//     (sim/fold-cost.mjs --store automerge); a change that touches the log
//     any other way (an element deleted, replaced or edited, the log put
//     anew: never an honest peer's, tamper or junk) has the list decoded
//     again from the document, which costs a decode per element only then.
//   - length: the list's length, read without decoding anything.
//   - append(entry | text): the text pushed as it is (the Session hands
//     over the canonical text it has checked decode takes: encoding it
//     again would make a JSON-quoted string every peer refuses), in one
//     change. Its subscribers hear it before append returns, as LocalStore
//     tells its own at once.
//   - subscribe(fn): told on every change that touches the log, a peer's
//     arriving through the network included, never inside the handle's own
//     change event. automerge-repo 2.5.6 emits that event from inside its
//     state machine (xstate), where a change made meanwhile is only queued,
//     applied after the event's listeners return: so a Session that folded
//     there and wrote an entry from its own loop (a queued submit, a
//     desync it found) would go on before the entry was in the list, its
//     next entry written on a stale head. The store notes the change in the
//     event and tells its subscribers outside it: a change its own append
//     made as append returns (the handle has applied it by then), any other
//     a microtask later (a peer's, arriving between the event loop's tasks:
//     told before any other task runs). A subscriber's error so reaches
//     append's caller (or, for a peer's change, the microtask's), never the
//     handle's machinery.
//
// ImmutableString comes from @automerge/automerge/slim, the module instance
// the repo uses (its slim entry, or the one its full entry initialises: an
// element pushed from another instance would not be one). This module never
// initialises the wasm: whoever makes the repo does (net/repo.js in the
// page, N2; the full entry in Node, sim/peers.mjs).
import { ImmutableString } from '@automerge/automerge/slim'
import { encode, decode } from '../match/envelope.js'

// A new match document: the lobby (N2's) and an empty log.
export const matchDoc = () => ({ app: 'tails-and-scales', schema: 1, lobby: {}, log: [] })

export class AutomergeStore {
  // `handle`: an automerge-repo DocHandle, ready (its document loaded)
  constructor(handle) {
    if (!handle?.isReady?.()) throw new Error('an AutomergeStore takes a ready document handle')
    this.kind = 'automerge'
    this.handle = handle
    // text → its decoded entry
    this.byText = new Map()
    // the decoded log, in list order (entries())
    this.list = []
    this.subs = new Set()
    this.rebuild()
    // a change heard but not yet told, and whether this store's append is
    // making one now
    this.unheard = false
    this.writing = false
    this.heard = ({ patches }) => {
      if (!this.patch(patches)) return
      this.unheard = true
      if (!this.writing) queueMicrotask(() => this.tell())
    }
    handle.on('change', this.heard)
  }

  // how many entries the log holds
  get length() {
    return this.list.length
  }

  // the decoded log: this store's own array (read-only; changed in place
  // as the document changes)
  entries() {
    return this.list
  }

  // an envelope (or a text, kept as it is), in a change of its own
  append(entry) {
    const text = typeof entry === 'string' ? entry : encode(entry)
    this.writing = true
    try {
      this.handle.change((d) => {
        d.log.push(new ImmutableString(text))
      })
    } finally {
      this.writing = false
    }
    this.tell()
  }

  // the subscribers told of the change heard, once
  tell() {
    if (!this.unheard) return
    this.unheard = false
    for (const fn of [...this.subs]) fn()
  }

  subscribe(fn) {
    this.subs.add(fn)
    return () => this.subs.delete(fn)
  }

  // stop listening to the handle
  close() {
    this.handle.off('change', this.heard)
    this.subs.clear()
  }

  // the log as a replay, the texts as the document holds them (N2's desync
  // report takes these raw texts)
  export() {
    return JSON.stringify(this.texts())
  }

  // the log's texts (a log put anew as anything but a list reads as empty:
  // every accepted entry gone, the Folder's tamper)
  texts() {
    const log = this.handle.doc()?.log
    return Array.isArray(log) ? log.map((x) => String(x)) : []
  }

  decoded(text) {
    let e = this.byText.get(text)
    if (!e) this.byText.set(text, (e = decode(text)))
    return e
  }

  // the list decoded again from the document, whole
  rebuild() {
    this.list = this.texts().map((t) => this.decoded(t))
  }

  // A change's patches applied to the list: each insert into the log at its
  // place; anything else touching the log, the list decoded again (also if
  // the patched list's length isn't the document's). True when the log was
  // touched.
  patch(patches = []) {
    let touched = false
    for (const p of patches) {
      if (p.path[0] !== 'log') continue
      touched = true
      if (p.action === 'insert' && p.path.length === 2) this.list.splice(p.path[1], 0, ...p.values.map((v) => this.decoded(String(v))))
      else {
        this.rebuild()
        return true
      }
    }
    const log = this.handle.doc()?.log
    if (touched && this.list.length !== (Array.isArray(log) ? log.length : 0)) this.rebuild()
    return touched
  }
}
