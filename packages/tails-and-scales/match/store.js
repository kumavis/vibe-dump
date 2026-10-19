// Match stores (DESIGN §2.6): where a match's log lives. A store holds the
// entries in list order and tells its subscribers when one is appended; the
// Session (match/session.js) folds them through the core. It holds commands,
// never game state: the match is a pure function of its entries.
//
//   MatchStore = { kind: 'local' | 'automerge', entries(): Entry[],
//                  append(entry): void, subscribe(fn): () => void }
//
// An entry is plain data (R6b; R8 wraps it in an envelope):
//   { s: -1, t: 'start', setup }   the first: the whole setup (core/index.js
//                                  createMatch's), so the log is a replay
//   { s, t, …fields }              a command for seat `s`: its body is the
//                                  rest of it (core/commands.js), and the seat
//                                  travels beside the body, never inside what
//                                  legal() and apply() take
//
// LocalStore is the store of every mode played on one device (vs. the AI,
// hotseat, watch, sim/): an array. Its subscribers hear an append
// synchronously, before append returns, as the Automerge store's will on a
// local change (R0 of the multiplayer work).
export class LocalStore {
  constructor(entries = []) {
    this.kind = 'local'
    this.list = entries.map((e) => ({ ...e }))
    this.subs = new Set()
  }

  entries() {
    return this.list
  }

  append(entry) {
    this.list.push({ ...entry })
    for (const fn of [...this.subs]) fn()
  }

  subscribe(fn) {
    this.subs.add(fn)
    return () => this.subs.delete(fn)
  }

  // the log as a replay (a few kB): the setup and every command, in order
  export() {
    return JSON.stringify(this.list)
  }
}
