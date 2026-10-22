// P-merge (DESIGN §4's gate, §2.6): the Folder (match/fold.js) as the
// replicated authority, under concurrency, with no Automerge at all.
//
// K peers share one append-only list, as an Automerge document's log is
// shared: each peer's Session (match/session.js) folds its own copy of the
// list through its own Folder. Every append is an op that names the element
// it was written after (the last in its author's view) and a Lamport stamp;
// a peer's list is the ops it holds, ordered the way Automerge orders a list
// (RGA: after the element it names, concurrent inserts there highest stamp
// first, the higher actor id winning a tie), so every peer holding the same
// ops holds the same list, whatever order they arrived in, and an op can
// land before entries a peer has already folded (the Folder's sync then
// folds again). Ops travel causally: a peer is handed an op only once it
// holds everything its author held, so each peer sees a causally closed
// subset at every moment, and the order it is handed them in is a random
// linear extension of the causal DAG of appends (one seeded schedule per
// run, which also picks when each peer acts on the view it has).
//
// Each corpus human log is played by its human seats on peers of their own
// (each seat its own device; the lowest human seat's peer writes the start),
// with a spectator, following the log's commands seat by seat as each seat's
// own view asks for them (so the two deployments interleave: concurrent
// deploy), while peers slip in what a peer must refuse alike:
//   junk       texts decode refuses: not JSON, not an object, an unknown
//              kind, a fraction or a string where a whole number goes, keys
//              out of canonical order, over 1 kB, no id, a start with a
//              stray field, a desync carrying a number, a start whose setup
//              holds 1e999 (Infinity once parsed: refused, never thrown on)
//   dup        an entry's text again (its id seen before)
//   stray      the seat's next command with a stray top-level field (which
//              bodyOf leaves in the body for legal() to refuse)
//   stale      the seat's next command after an older head than its own
//   offturn    the seat's next command while the match waits on the other
//   device     the seat's next command from a device that isn't the seat's
//   spoof      a spectator's concession or desync for a seat it doesn't play
// and, by scenario (one per --seeds): plain; fork (a second peer on seat
// 0's own device, playing the same commands: same-seat forks, the first
// valid extension of the head winning and the other stale, a peer that had
// shown the loser snapping back: sync's reset); concede (a seated peer
// concedes at a random moment, out of band, often while the other seat
// plays). And (R8b) one more per log, reenter: each seat's peer sends the
// log's commands only from inside its Session's sink, as an autopilot
// would (from the events it is handed, half the time leaving it to a later
// callback; from a reset; from settled, half the time; after a drop), one
// command queued at a time, and its deliveries come slowly, so the seats'
// deployments interleave and a reset finds a seat still deploying; the run
// only pokes it (junk slipped into its list, a change of its own, which
// settles). Every entry its Session writes must be appended once the
// change in hand is folded (never while its Folder syncs), on the seat's
// head and the match's hash as they then stand, and be the command it
// queued; settled must come with its whole list pushed and nothing of its
// own queued; and nothing may be left queued at the end. The AI pairs run
// as a start and spectators slipping in junk.
//
// At the end, with every op on every peer, all peers must agree on
// {accepted, rejected, stateHash} (and the status and the list itself);
// that must be the single-process fold of the final list (a fresh Folder);
// each peer's match must trace exactly that fold, and, unless a seat
// conceded, the corpus log's own single-process trace (sim/run.mjs foldJob,
// which parity holds to the baseline); every peer's view (the events its
// sink was handed, folded into a mirror, snapped to the match on a reset)
// must equal project(G) (and, each time its sink is handed an entry's
// events, the Session must already be the match they lead to: its preview
// works, its decision is the events' last stop, and the view they make is
// project(session.G), a refold's included); no two accepted commands of a
// seat share a `p`; every accepted entry carries `h` exactly where §0.2 #3
// says, by the kind of decision it answered (phase and chargeEnd: one; a
// deployment's and F4's vote: none; out of band: neither `h` nor `p`), the
// spec's kinds, never the code's own SIMULTANEOUS; every peer's Folder
// pushed each entry of the list once;
// every slipped-in entry must be refused for a reason its kind allows
// (junk and dup as 'envelope'; stray mostly 'illegal'; …), every honest
// entry accepted (a fork's loser stale), and over the run each kind must
// meet its own reason at least once, and sync must have both refolded
// quietly and reset.
//
// Four more scenarios:
//   cap    a spectator floods the log past the spec's cap (5,000 entries,
//          §2.6; never the code's own MAX_ENTRIES): every peer freezes
//          'full' at the list's 5,001st entry, agreeing on everything
//   edges  the Folder's own rules, one process: a start under another
//          CORE_VERSION (newer or older) or RULES_ID opens read-only
//          ('skew'); a start whose human seat names no device, or one no
//          entry can carry (past 64 characters), is refused; an online
//          log's `open` names the one device whose start counts (another's
//          inert, saying why); a second start is refused; an accepted entry
//          gone from the list is 'tamper', and stays so when it comes back
//          after an insert; an accepted id that names another body first
//          (inserted before it, or in its place) is tamper too, and so is a
//          copy of an accepted entry inserted before the head it was
//          written after (the accepted entries out of their order); decode
//          refuses every junk text above and throws on none; an entry with
//          another match's hash and a body this match refuses freezes it
//          (the hash before legal(), §0.2 #2), and so does one answering a
//          single seat's decision with no hash; after the end, a hashed
//          command on the final head freezes the match from the seat's own
//          device only; a Session whose sink reads it as the page's does
//          (its G, preview, accepted): a first match that arrives through a
//          refold (junk first, the start inserted before it), and a refold
//          that catches up and then shows what follows; a start no peer
//          could decode (over 1 kB, NaN, a device name too long) never
//          appended, the Session in its lobby saying why until another
//          device's start begins the match, one in a log another device
//          opened inert, saying why, and one carrying N2's seed reveal;
//          and (R8b) the single flight: a sink's submits while a change of
//          several entries is folded (as the Session is made over a store
//          holding them, and while a refold shows what follows) queued and,
//          once the change is folded, one the match moved past dropped and
//          reported, the others written in turn on the head and hash as
//          they then stand (two from one callback included), never stale;
//          a submit from a reset (two seats' placements folded in another
//          order) written on the reset match; an autopilot answering in
//          settled plays the log on to its end (the corpus battle), settled
//          once a change; each Session judged against a fresh Folder, every
//          entry pushed once; a sink that throws, the Session folding the
//          next change all the same; Folder.sync and Folder.push entered
//          again from the events it hands on throw, and push from the
//          match's own onTrace
//   forks  each hotseat log, one process: a same-seat fork in the
//          deployment, the losing tab placing a unit elsewhere, the other
//          seat closing the deployment having seen neither branch; the
//          losing world's answer to the first single seat's decision (by
//          the forked seat, or by the other one) is stale on the final
//          list, never a desync (the head after a close commits to every
//          seat's branch); the match lives on, a peer that showed the loser
//          resets, undoing its entries
//   drill  the desync drill: the hotseat logs played by two seated peers and
//          a spectator, one seat's peer running a copy of the code whose
//          maths drifts. The first single-seat entry either side writes
//          after the drift is found apart (its `h`), that peer freezes and
//          says so in the log (an out-of-band desync), and the other seat's
//          peer freezes on it: all three at the same entry, each with a
//          report (setup, entries, accepted, rejected, both hashes crossed,
//          the last 50 trace lines and the state). Eight drills:
//          hypot  dmath's hypot an ulp high, so the match drifts from the
//                 start: two where the drifted peer writes that entry (the
//                 spectator finds it apart by its own hash), one where an
//                 honest author writes it (the drifted peer finds it apart,
//                 and the spectator freezes on its desync entry);
//          late   (R8's fixer, round 2) a model slot an ulp off in the
//                 waiting seat's fold just before the author's final turn
//                 (the same on every refold): it finds the turn's first
//                 entry apart, its actor sorting below the author's and its
//                 ops held until nothing else can happen, so its desync
//                 lands after the end in every list and finds the author's
//                 and the spectator's matches over; twice, once with that
//                 entry the one that ends the match (a wipe-out);
//          deaf   (R8's fixer, round 2) a copy that plays a round more, so
//                 the entry that ends the match everywhere else ends a
//                 round there: the seat that round waits on plays on, its
//                 entry on the head the others' matches ended at, with the
//                 hash of a match that went on, which they find apart
//                 although theirs are over;
//          closing (N2) the final entry's own application drifts on its
//                 author's peer (a model slot an ulp off as it is
//                 accepted, after which nothing more is written): only the
//                 closing check finds it, each seated peer's Session saying
//                 its `final` (the head its match ended at, its hash
//                 there), every peer finding one of them apart and
//                 freezing; twice, as for late. Here the seats may freeze at
//                 different entries (each at the other's final, when both
//                 are written at once), so the drill holds every peer
//                 frozen by a final, none over.
//
//   node sim/merge-sim.mjs [--only <kinds, modes or ids>] [--seeds N] [--dir <packageDir> | --ref <ref>]
//   node sim/merge-sim.mjs --self-test    each broken copy in MUTANTS must fail it,
//                                         and so must a store caching by index
//                                         (and, R8b, a Session with no single
//                                         flight: `no-queue`)
//
// --seeds (default 3) scenarios per human log, the kinds in turn (plain,
// fork, concede), and one reenter; --only picks the corpus battles (cap, edges, forks and
// the drills run unless --only names battles). One child process per
// scenario, up to one per CPU. Exit 0 when every check holds (the
// self-test: when every mutant is caught), 1 otherwise, 2 on bad arguments.
import { parseArgs } from 'node:util'
import { spawn } from 'node:child_process'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadCorpus, select, verdict, pool, CPUS, copyCode } from './lib.mjs'
import { foldJob, jobSetup, differ } from './run.mjs'
import { mulberry32 } from './oracle/human-bot.mjs'
import { codeDir } from './oracle/pin.mjs'

let a
try {
  ({ values: a } = parseArgs({
    options: {
      only: { type: 'string' }, seeds: { type: 'string' }, dir: { type: 'string' }, ref: { type: 'string' },
      child: { type: 'boolean' }, patched: { type: 'string' }, store: { type: 'string' }, 'self-test': { type: 'boolean' },
    },
  }))
} catch (e) {
  console.error(`merge-sim: ${e.message}\nusage: node sim/merge-sim.mjs [--only <kinds, modes or ids>] [--seeds N] [--dir <packageDir> | --ref <ref>] | --self-test`)
  process.exit(2)
}
const SEEDS = a.seeds === undefined ? 3 : Number(a.seeds)
if (!Number.isInteger(SEEDS) || SEEDS < 1) {
  console.error(`merge-sim: --seeds takes a whole number from 1, not ${a.seeds}`)
  process.exit(2)
}
const dir = a.dir ? resolve(a.dir) : codeDir(a.ref ?? 'WORKTREE')
const KINDS = ['plain', 'fork', 'concede']
// the spec's numbers, never the code's: the log's cap (§2.6), and the
// decisions an entry answering carries `h` on and those it never does
// (§0.2 #3: by the decision's kind)
const CAP = 5000
const HASHED = ['phase', 'chargeEnd'], UNHASHED = ['deploy', 'roundLimit']

// ── The code under test ─────────────────────────────────────────────────────
async function modulesOf(pkg) {
  const imp = (f) => import(pathToFileURL(join(pkg, f)).href)
  const [core, E, F, S, mirror] = await Promise.all(['core/index.js', 'match/envelope.js', 'match/fold.js', 'match/session.js', 'present/mirror.js'].map(imp))
  // each op decoded once per module set: a peer's store hands out the same
  // entry object for the same list element every time (per op, never per
  // index: an insert shifts every later index), as N1's AutomergeStore
  // must cache per element or text
  return { core, E, F, S, mirror, folding: { envelope: E, fold: F }, cache: new WeakMap() }
}

// ── The shared list ─────────────────────────────────────────────────────────
// An op: { key, lamport, actor, seq, after, text, vc }. `after` is the key of
// the element its author last held (null: the list's head), `vc` how many
// ops of each actor its author held (its own included): a peer may take it
// once it holds as many.
const greater = (x, y) => x.lamport > y.lamport || (x.lamport === y.lamport && x.actor > y.actor)

class Net {
  constructor() {
    this.ops = []
    this.peers = []
    // what was slipped in, and who wrote each honest entry: op key → { kind, peer }
    this.why = new Map()
  }
}

// A peer: its replica of the list, its Session on it. `hold`: once its
// match has stopped, what it writes is held back until nothing else can
// happen (the late drill's desync); `fallback`: past its script, a seat
// sends End or Auto (the deaf drill's round more); `nudged`: its match
// drifts outside any event (the late and closing drills'), so its view
// isn't held to it; `closing`: its Session says its closing hash (N2, the
// closing drill);
// `reactive` (the reenter scenario): its seats act only from inside its
// sink's callbacks (events and settled, each half the time left to a later
// one; reset; dropped), one queued command at a time, never from the run's
// own steps (which only poke it, slipping junk into its list: a change of
// its own, which settles), and every entry its Session writes is vetted as
// it is appended (vet, below).
class Peer {
  constructor(net, { name, actor, dev, seats = [], M, rand, script = null, fork = false, hold = false, fallback = false, nudged = false, reactive = false, pace = null, closing = false }) {
    Object.assign(this, { net, name, actor, dev, seats, M, script, fork, hold, fallback, nudged, reactive, pace })
    // (reactive: the command its Session holds queued, and how many it
    // wrote, dropped, and sent from each callback)
    this.queued = null
    this.reacted = { events: 0, reset: 0, settled: 0, dropped: 0, written: 0, drops: 0, settles: 0 }
    this.pokes = 0
    this.ops = new Map()
    this.order = []
    this.seen = {}
    this.lamport = 0
    this.seq = 0
    this.subs = new Set()
    // the view: a mirror of the events the sink is handed (from the table
    // before the match's first event: sim/run.mjs mirrorTap's start), snapped
    // to the match on a reset
    this.view = null
    this.resets = 0
    this.undone = 0
    this.insertsBefore = 0
    this.budget = 0
    const start = (G) => ({ ...M.mirror.project(G), stage: 'title', owners: G.objectives.map(() => -1), chunks: {} })
    // (--store index, the self-test's broken store: each entry decoded
    // once per index, as a store that never inserts may, LocalStore)
    const byIndex = []
    const peer = this
    this.store = {
      kind: 'sim',
      get length() {
        return peer.order.length
      },
      entries: a.store === 'index' ? () => this.order.map((k, i) => (byIndex[i] ??= this.decoded(this.ops.get(k)))) : () => this.order.map((k) => this.decoded(this.ops.get(k))),
      // (the Session's appends; what the run slips in goes through put)
      append: (e) => {
        const text = typeof e === 'string' ? e : M.E.encode(e)
        return this.write(text, this.reactive && this.vet(text) ? 'honest' : null)
      },
      subscribe: (fn) => {
        this.subs.add(fn)
        return () => this.subs.delete(fn)
      },
    }
    this.session = new M.S.Session({
      store: this.store, localSeats: seats, dev, rand, closing,
      onTrace: (line, G) => (this.view ??= start(G)),
      sink: {
        // Handed an entry's events, the Session is the match they lead to
        // (a refold's too: the page's sink reads session.G, its preview and
        // its accepted ids there, app/flow.js): it previews, its decision
        // is the events' last stop, and the view they make is it.
        events: (events, ses) => {
          this.view ??= start(ses.G)
          for (const e of events) M.mirror.applyEvent(this.view, e)
          const P = ses.preview((G) => G.pending), stop = events.findLast((e) => e.t === 'pending')
          if (stop && (P?.k !== stop.k || `${P.seats}` !== `${stop.seats}`)) throw new Error(`${this.name}'s sink was handed a stop at ${stop.k} for seats ${stop.seats}, but the Session's match waits on ${JSON.stringify(P)}`)
          const d = !this.nudged && differ(this.view, M.mirror.project(ses.G))
          if (d) throw new Error(`${this.name}'s sink was handed events of another match than the Session's (${ses.accepted.length} accepted): ${d}`)
          if (this.reactive) this.react(ses, 'events')
        },
        reset: (G, ses, { undone }) => {
          this.resets++
          this.undone += undone
          this.view = M.mirror.project(G)
          if (this.reactive) this.react(ses, 'reset')
        },
        // (once the change is folded and nothing is queued: the store's
        // whole list pushed, no command of this peer's still waiting)
        settled: (ses) => {
          if (!this.reactive) return
          this.reacted.settles++
          if (this.queued) throw new Error(`${this.name}'s sink was told the Session settled while its ${JSON.stringify(this.queued.body)} (sent from ${this.queued.from}) was still queued`)
          if (ses.count !== this.order.length) throw new Error(`${this.name}'s sink was told the Session settled with ${ses.count} of ${this.order.length} entries pushed`)
          this.react(ses, 'settled')
        },
        dropped: (seat, body, why, ses) => {
          if (!this.reactive) throw new Error(`${this.name}'s Session dropped ${JSON.stringify(body)} for seat ${seat}, but it never sent one from a callback: ${why}`)
          if (!this.queued || this.queued.s !== seat || JSON.stringify(this.queued.body) !== JSON.stringify(body)) throw new Error(`${this.name}'s Session dropped ${JSON.stringify(body)}, which isn't the command it held queued (${JSON.stringify(this.queued)})`)
          this.queued = null
          this.reacted.drops++
          this.react(ses, 'dropped')
        },
      },
    })
    net.peers.push(this)
  }

  // (reactive) Answer a decision of a seat played here from inside one of
  // the sink's callbacks: the seat's next command, if it is legal now and
  // nothing of this peer's is queued; from `events` or `settled`, half the
  // time left to a later callback (a later batch, a reset, a later change's
  // settling), so a seat's turn spreads over changes and meets the others'.
  // The Session queues it (the callback runs while a change is folded) and
  // writes it once that change is folded.
  react(ses, from) {
    if (this.queued || ses.status !== 'live') return
    if ((from === 'events' || from === 'settled') && this.pace() < 0.5) return
    const act = this.canAct(true)
    if (!act) return
    ses.submit(act.s, act.body)
    this.queued = { ...act, from }
    this.reacted[from]++
  }

  // (reactive) An entry this peer's Session appends, as it is appended: never
  // while its Folder is folding a change (a callback's submit is queued, and
  // written only once the change is folded), and, for a seat's command,
  // written on the match as it then stands: the seat's head as `p`, the
  // match's hash as `h` exactly where §0.2 #3 puts one. True when it is
  // the command this peer held queued.
  vet(text) {
    const ses = this.session, e = this.M.E.decode(text)
    if (!ses || e.bad) return false
    if (ses.folder.syncing) throw new Error(`${this.name}'s Session appended ${e.t} for seat ${e.s} while its Folder was folding a change: a sink's submit written there and then, not queued until the change was folded`)
    if (e.s < 0 || e.t === 'concede' || e.t === 'desync') return false
    const head = ses.folder.head(e.s), one = HASHED.includes(ses.G.pending?.k)
    if (e.p !== head) throw new Error(`${this.name}'s Session wrote ${e.t} for seat ${e.s} after ${e.p}, not the seat's head as the match stands (${head})`)
    if (e.h !== (one ? this.M.core.stateHash(ses.G) : undefined)) throw new Error(`${this.name}'s Session wrote ${e.t} for seat ${e.s} with ${e.h === undefined ? 'no hash' : `the hash ${e.h}`}, not the match's as it stands (${one ? 'one seat waited on' : 'a simultaneous decision'})`)
    const q = this.queued
    if (!q || q.s !== e.s || this.M.core.canonicalJSON(this.M.E.bodyOf(e)) !== this.M.core.canonicalJSON(q.body)) throw new Error(`${this.name}'s Session wrote ${JSON.stringify(e)}, which isn't the command it held queued (${JSON.stringify(q)})`)
    this.queued = null
    this.reacted.written++
    return true
  }

  // what the run slips in (junk, a duplicate, a flood): appended as it is,
  // never vetted, noted as `kind`
  put(x, kind = null) {
    return this.write(typeof x === 'string' ? x : this.M.E.encode(x), kind)
  }

  decoded(op) {
    let d = this.M.cache.get(op)
    if (!d) this.M.cache.set(op, (d = this.M.E.decode(op.text)))
    return d
  }

  // RGA: after the element named, past every concurrent insert there with a
  // higher stamp (and so past their own successors). Returns the index.
  integrate(op) {
    let at = op.after === null ? 0 : this.order.indexOf(op.after) + 1
    if (op.after !== null && at === 0) throw new Error(`${this.name} took ${op.key} before ${op.after}: the delivery broke causality`)
    while (at < this.order.length && greater(this.ops.get(this.order[at]), op)) at++
    this.order.splice(at, 0, op.key)
    this.ops.set(op.key, op)
    this.lamport = Math.max(this.lamport, op.lamport)
    this.seen[op.actor] = op.seq
    return at
  }

  notify() {
    for (const fn of [...this.subs]) fn()
  }

  // an append: the op, in this peer's list at once, its Session told
  // (`kind`: what it is, noted before the Session hears of it, so whatever
  // the Session writes in answer is noted as its own)
  write(text, kind = null) {
    const seq = (this.seen[this.actor] ?? 0) + 1
    const op = { key: `${this.lamport + 1}@${this.actor}`, lamport: this.lamport + 1, actor: this.actor, seq, after: this.order.at(-1) ?? null, text, vc: { ...this.seen, [this.actor]: seq } }
    if (this.hold && this.session && this.session.status !== 'live') op.held = true
    this.integrate(op)
    this.net.ops.push(op)
    this.last = op
    if (kind) this.net.why.set(op.key, { kind, peer: this.name })
    this.notify()
    return op
  }

  deliverable(op) {
    if ((this.seen[op.actor] ?? 0) !== op.seq - 1) return false
    for (const [actor, n] of Object.entries(op.vc)) if (actor !== op.actor && (this.seen[actor] ?? 0) < n) return false
    return true
  }

  // a batch of ops arrives (one sync message): integrated, then the Session
  // told once
  receive(ops) {
    for (const op of ops) if (this.integrate(op) < this.order.length - 1) this.insertsBefore++
    this.notify()
  }

  // this peer's match, as its own Folder has it
  get G() {
    return this.session.G
  }

  // the seat's command the log plays next: its accepted commands so far
  // (by any device) count it off
  next(seat) {
    // (an accepted id's entry is the first good one carrying it: a dup comes
    // later, and a bad entry with that id never counts)
    const byId = new Map()
    for (const e of this.store.entries()) if (!e.bad && !byId.has(e.id)) byId.set(e.id, e)
    const done = this.session.accepted.filter((id) => {
      const e = byId.get(id)
      return e.s === seat && e.t !== 'concede' && e.t !== 'desync'
    }).length
    return this.script?.[seat]?.[done] ?? null
  }

  // a decision of a seat played here, with the log's next command for it
  // legal now in this peer's view (a reactive peer's only from its sink:
  // `own`)
  canAct(own = false) {
    if (this.reactive && !own) return null
    if (this.session.status !== 'live') return null
    for (const s of this.seats) {
      if (!this.G.pending?.seats.includes(s)) continue
      const next = this.next(s)
      for (const body of next ? [next] : this.fallback ? [{ t: 'end' }, { t: 'auto' }] : []) if (this.session.legal(s, body) === null) return { s, body }
    }
    return null
  }

  // write `body` for seat s as `kind` (honest, or slipped in), noting it
  mark(kind) {
    this.net.why.set(this.last.key, { kind, peer: this.name })
  }
}

// ── What a peer slips in ────────────────────────────────────────────────────
// texts decode refuses (n: a counter, for ids of their own)
const JUNK = [
  () => 'not json',
  () => '[]',
  () => '{}',
  (E, p, n) => E.encode({ id: `${p.dev}.junk${n}`, s: 0, d: p.dev, t: 'nope' }),
  (E, p, n) => E.encode({ id: `${p.dev}.junk${n}`, s: 0, d: p.dev, t: 'move', u: 1.5, c: 3 }),
  (E, p, n) => E.encode({ id: `${p.dev}.junk${n}`, s: 0, d: p.dev, t: 'move', u: '1', c: 3 }),
  (E, p, n) => JSON.stringify({ t: 'end', s: 0, id: `${p.dev}.junk${n}`, d: p.dev }),
  (E, p, n) => E.encode({ id: `${p.dev}.junk${n}`, s: 0, d: p.dev, t: 'end', pad: 1, x: 'x'.repeat(1100) }),
  (E, p) => E.encode({ s: 0, d: p.dev, t: 'end' }),
  (E, p, n) => E.encode({ id: `${p.dev}.junk${n}`, s: -1, d: p.dev, t: 'start', core: 1, rules: 'x', setup: {}, extra: 1 }),
  (E, p, n) => E.encode({ id: `${p.dev}.junk${n}`, s: 0, d: p.dev, t: 'desync', at: 'x', mine: 3 }),
  // (a text: encode can't write Infinity, which 1e999 parses to)
  (E, p, n) => `{"core":1,"d":"${p.dev}","id":"${p.dev}.junk${n}","rules":"x","s":-1,"setup":{"board":1e999},"t":"start"}`,
]
// the reasons each kind of entry may meet (the first word of a rejection's
// why; 'accepted'), and the one each slipped-in kind must meet at least once
// over a run
const ALLOWED = {
  honest: ['accepted', 'inert'],
  // (a fork's loser after the winner: stale, or, where the winner ended the
  // seat's part in the decision, no longer the seat's turn)
  fork: ['accepted', 'stale', 'turn', 'inert'],
  start: ['accepted'],
  concede: ['accepted', 'illegal', 'inert'],
  junk: ['envelope'],
  dup: ['envelope'],
  stray: ['illegal', 'stale', 'turn', 'inert'],
  stale: ['stale', 'turn', 'inert'],
  offturn: ['turn', 'stale', 'inert'],
  device: ['device', 'turn', 'inert'],
  spoof: ['device', 'seat', 'inert'],
}
const PRIMARY = { junk: 'envelope', dup: 'envelope', stray: 'illegal', stale: 'stale', offturn: 'turn', device: 'device', spoof: 'device' }

// Slip something in from peer p, if its view allows one; returns its kind.
function slip(p, rand, n) {
  const { E, core } = p.M
  const ses = p.session, G = p.G
  const kinds = ['junk', 'dup']
  const mine = p.seats.find((s) => G.pending?.seats.includes(s))
  const idle = p.seats.find((s) => !G.pending?.seats.includes(s) && p.next(s))
  if (mine !== undefined && p.next(mine)) kinds.push('stray', 'device', ...(ses.accepted.length > 2 ? ['stale'] : []))
  if (idle !== undefined) kinds.push('offturn')
  if (!p.seats.length) kinds.push('spoof')
  const kind = kinds[Math.floor(rand() * kinds.length)]
  const id = () => E.newEntryId(p.dev, ses.store.entries().length, `x${n}`)
  const one = G.pending && !p.M.F.SIMULTANEOUS.includes(G.pending.k)
  const cmd = (s, extra = {}) => E.envelope(p.next(s), { id: id(), s, d: p.dev, p: ses.folder.head(s), h: one ? core.stateHash(G) : undefined, ...extra })
  if (kind === 'junk') p.put(JUNK[Math.floor(rand() * JUNK.length)](E, p, n), kind)
  else if (kind === 'dup') {
    const had = ses.store.entries().filter((e) => !e.bad)
    p.put(E.encode(had[Math.floor(rand() * had.length)]), kind)
  } else if (kind === 'stray') p.put(cmd(mine, { zz: 1 }), kind)
  else if (kind === 'device') p.put(cmd(mine, { d: `${p.dev}x` }), kind)
  else if (kind === 'stale') {
    const head = ses.folder.head(mine), old = ses.accepted.filter((x) => x !== head)
    p.put(cmd(mine, { p: old[Math.floor(rand() * old.length)] }), kind)
  } else if (kind === 'offturn') p.put(cmd(idle), kind)
  else {
    // a concession or a desync for a seat the spectator doesn't play
    const s = Math.floor(rand() * G.seats.length)
    p.put(rand() < 0.5 ? E.envelope({ t: 'concede' }, { id: id(), s, d: p.dev }) : E.envelope({ t: 'desync', at: ses.accepted.at(-1), mine: 'x' }, { id: id(), s, d: p.dev }), kind)
  }
  return kind
}

// ── A run ───────────────────────────────────────────────────────────────────
// Play until no op is left undelivered and no peer can act. Each step picks
// at random among: hand a peer a batch of 1-3 deliverable ops, a peer acting
// on its view (its seat's next command), a peer slipping something in
// (while it has budget), a conceding peer conceding. A held op travels only
// once nothing else can happen.
// the most a reactive peer is poked in a run
const POKES = 300
// (`deliver`: how often a delivery is picked against a peer acting; the
// reenter scenario's seats deploy at once more often with it lower, so
// their deployments interleave and a reset finds a seat still deploying)
function play(net, rand, { cap = 400000, deliver = 3 } = {}) {
  for (let step = 0; step < cap; step++) {
    const moves = []
    for (const p of net.peers) {
      if (net.ops.some((op) => !op.held && !p.ops.has(op.key) && p.deliverable(op))) moves.push([deliver, 'deliver', p])
      const act = p.canAct()
      if (act) moves.push([1, 'act', p, act])
      // (a reactive peer with a decision to answer and nothing queued: its
      // list changes, so its sink is told the change settled; a few hundred
      // times at most, so a Session that never settles stalls the match
      // instead of the run)
      if (p.reactive && !p.queued && p.pokes < POKES && p.canAct(true)) moves.push([1, 'poke', p])
      const live = p.session.status === 'live'
      if (live && p.budget > 0) moves.push([0.12, 'slip', p])
      if (live && p.concedes && p.G.turn.stage === 'battle') moves.push([0.04, 'concede', p])
    }
    if (!moves.length) {
      if (!net.ops.some((op) => op.held)) return step
      for (const op of net.ops) delete op.held
      continue
    }
    let r = rand() * moves.reduce((s, m) => s + m[0], 0), m = moves[0]
    for (const x of moves) if ((r -= x[0]) < 0) {
      m = x
      break
    }
    const p = m[2]
    if (m[1] === 'deliver') {
      const batch = []
      for (let k = 1 + Math.floor(rand() * 3); k > 0; k--) {
        const ready = net.ops.filter((op) => !op.held && !p.ops.has(op.key) && !batch.includes(op) && batchOk(p, batch, op))
        if (!ready.length) break
        batch.push(ready[Math.floor(rand() * ready.length)])
      }
      p.receive(batch)
    } else if (m[1] === 'act') {
      p.session.submit(m[3].s, m[3].body)
      p.mark(p.fork ? 'fork' : 'honest')
    } else if (m[1] === 'slip') {
      p.budget--
      slip(p, rand, net.ops.length)
    } else if (m[1] === 'poke') {
      p.pokes++
      p.put(JUNK[Math.floor(rand() * JUNK.length)](p.M.E, p, net.ops.length), 'junk')
    } else {
      p.concedes = false
      const s = p.seats[0]
      if (p.session.legal(s, { t: 'concede' }) === null) {
        p.session.submit(s, { t: 'concede' })
        p.mark('concede')
      }
    }
  }
  throw new Error(`no end after ${cap} steps`)
}
// may `op` join `batch` for peer p (everything it needs held, or earlier in
// the batch)
function batchOk(p, batch, op) {
  const has = (actor) => Math.max(p.seen[actor] ?? 0, ...batch.filter((b) => b.actor === actor).map((b) => b.seq))
  if (has(op.actor) !== op.seq - 1) return false
  for (const [actor, n] of Object.entries(op.vc)) if (actor !== op.actor && has(actor) < n) return false
  return true
}

// The final list folded afresh in one process (a new Folder), each entry's
// fate as it went: op key → 'accepted' | the first word of why it was
// refused | 'frozen'; and the kind of decision the match waited on as each
// came (null unless live).
function refold(M, list, peer) {
  const ref = new M.F.Folder({ out: null })
  const fate = new Map(), answered = new Map()
  for (const k of list) {
    const e = peer.decoded(peer.ops.get(k))
    const n = ref.accepted.length, r = ref.rejected.length
    answered.set(k, ref.status === 'live' ? ref.G.pending?.k ?? null : null)
    ref.push(e)
    fate.set(k, ref.accepted.length > n ? 'accepted' : ref.rejected.length > r ? ref.rejected[r].why.split(':')[0] : 'frozen')
  }
  return { ref, fate, answered }
}

// Every accepted entry's `h` (and an out-of-band one's `p`) where §0.2 #3
// and #6 put them, by the kind of decision it answered, the spec's kinds;
// how many of each kind were held to it.
function hashes(p0, list, fate, answered, where) {
  const hk = {}
  for (const k of list) {
    const e = p0.decoded(p0.ops.get(k))
    if (fate.get(k) !== 'accepted' || e.s < 0) continue
    const kind = answered.get(k), oob = e.t === 'concede' || e.t === 'desync'
    const want = oob ? false : HASHED.includes(kind) ? true : UNHASHED.includes(kind) ? false : null
    if (want === null) throw new Error(`${where}: the accepted entry ${e.id} (${e.t}) answers a ${kind} decision, which §0.2 #3 doesn't name`)
    if ((e.h !== undefined) !== want) throw new Error(`${where}: the accepted entry ${e.id} (${e.t}, ${oob ? 'out of band' : `answering a ${kind} decision`}) carries ${want ? 'no hash' : `a hash`}, which §0.2 #3 says it ${want ? 'must' : 'never does'}`)
    if (oob && e.p !== undefined) throw new Error(`${where}: the accepted entry ${e.id} (${e.t}, out of band) carries a prev (§0.2 #6)`)
    const key = oob ? 'out of band' : kind
    hk[key] = (hk[key] ?? 0) + 1
  }
  return hk
}

// Every peer against the others and the single-process fold. Returns counts.
function judge(net, M, { want = 'over', corpusTrace = null, where }) {
  const [p0] = net.peers
  const list = p0.order
  for (const p of net.peers) {
    if (p.order.length !== list.length || p.order.some((k, i) => k !== list[i])) throw new Error(`${where}: ${p.name}'s list isn't ${p0.name}'s (the simulator's own RGA)`)
  }
  // every entry pushed once by every peer's Folder (a fold re-entered from
  // a sink pushes the rest of a list twice)
  for (const p of net.peers) if (p.session.folder.pushed.length !== list.length) throw new Error(`${where}: ${p.name}'s Folder pushed ${p.session.folder.pushed.length} entries for a list of ${list.length}`)
  const { ref, fate, answered } = refold(M, list, p0)
  const hk = hashes(p0, list, fate, answered, where)
  const sig = (f) => JSON.stringify({ status: f.status, accepted: f.accepted, rejected: f.rejected, hash: f.G ? M.core.stateHash(f.G) : null })
  const want0 = sig(ref)
  for (const p of net.peers) {
    const got = sig(p.session.folder)
    if (got !== want0) {
      const f = p.session.folder
      const i = f.accepted.findIndex((x, j) => x !== ref.accepted[j])
      const j = f.rejected.findIndex((x, k) => JSON.stringify(x) !== JSON.stringify(ref.rejected[k]))
      throw new Error(`${where}: ${p.name} disagrees with the single-process fold: status ${f.status}/${ref.status}, accepted ${f.accepted.length}/${ref.accepted.length} (first apart ${i}: ${f.accepted[i]} | ${ref.accepted[i]}), rejected ${f.rejected.length}/${ref.rejected.length} (first apart ${j}: ${JSON.stringify(f.rejected[j])} | ${JSON.stringify(ref.rejected[j])}), hash ${f.G && M.core.stateHash(f.G)}/${ref.G && M.core.stateHash(ref.G)}`)
    }
  }
  if (ref.status !== want) {
    // (where each peer stands: what it waits on, and the command it would send)
    const at = net.peers.map((p) => `${p.name}: ${p.session.status}, waiting on ${JSON.stringify(p.G?.pending ?? null)}${p.seats.map((x) => `, seat ${x}'s next ${JSON.stringify(p.next(x))} (${p.next(x) && p.session.legal(x, p.next(x))})`).join('')}`).join('; ')
    throw new Error(`${where}: the match ends ${ref.status}, not ${want}${ref.report ? `: ${JSON.stringify({ ...ref.report, entries: undefined, accepted: undefined, rejected: undefined, trace: undefined, state: undefined })}` : ''} (${at})`)
  }
  if (want !== 'over') return { ref, fate, hk }
  // the match each peer holds traces the single-process fold, and the
  // corpus's own fold when the log played to its end
  const trace = ref.G.journal.trace.join('\n')
  for (const p of net.peers) if (p.G.journal.trace.join('\n') !== trace) throw new Error(`${where}: ${p.name}'s match traces another battle than the single-process fold`)
  if (corpusTrace && trace !== corpusTrace.join('\n')) {
    const lines = ref.G.journal.trace, i = lines.findIndex((l, k) => l !== corpusTrace[k])
    throw new Error(`${where}: the accepted entries trace another battle than the corpus log from line ${i + 1}: ${(lines[i] ?? '(ended)').slice(0, 80)} | ${(corpusTrace[i] ?? '(ended)').slice(0, 80)}`)
  }
  // what each peer shows is its match
  for (const p of net.peers) {
    const d = differ(p.view, M.mirror.project(p.G))
    if (d) throw new Error(`${where}: ${p.name}'s view (its sink's events, snapped on ${p.resets} reset(s)) isn't its match: ${d}`)
  }
  // one accepted command per seat and head
  const heads = new Set()
  for (const k of list) {
    const e = p0.decoded(p0.ops.get(k))
    if (fate.get(k) !== 'accepted' || e.p === undefined) continue
    const key = `${e.s}@${e.p}`
    if (heads.has(key)) throw new Error(`${where}: two accepted commands of seat ${e.s} after the same head ${e.p}`)
    heads.add(key)
  }
  return { ref, fate, hk }
}

// each slipped-in entry refused for a reason its kind allows, each honest
// one accepted; the reasons met, by kind
function fates(net, fate, where) {
  const met = {}
  for (const [k, { kind, peer }] of net.why) {
    const f = fate.get(k)
    if (!ALLOWED[kind].includes(f)) throw new Error(`${where}: ${peer}'s ${kind} entry ${k} was ${f === 'accepted' ? 'accepted' : `refused as ${f}`}, which a ${kind} entry never may be (${ALLOWED[kind].join(', ')})`)
    met[`${kind}:${f}`] = (met[`${kind}:${f}`] ?? 0) + 1
  }
  return met
}

// ── Scenarios ───────────────────────────────────────────────────────────────
// a seeded random name (an actor id, a device's random part)
const nameFrom = (rand, n = 6) => Array.from({ length: n }, () => Math.floor(rand() * 36).toString(36)).join('')

// A human log played by its seats' peers, a spectator and (fork) a second
// device on seat 0's; (reenter) each seat's peer answering only from inside
// its sink's callbacks.
function humanScenario(M, it, kind, seed) {
  const rand = mulberry32(seed * 7919 + it.id.length * 104729 + (kind === 'reenter' ? 7 : KINDS.indexOf(kind)))
  const where = `${it.id} #${seed} (${kind})`
  const net = new Net()
  const setup = jobSetup(it.job)
  const humans = setup.seats.flatMap((x, s) => (x.ctrl === 'human' ? [s] : []))
  const script = {}
  for (const { s, ...body } of it.job.entries) (script[s] ??= []).push(body)
  const peer = (o) => {
    const r = mulberry32(Math.floor(rand() * 2 ** 32))
    return new Peer(net, { actor: nameFrom(rand), M, script, rand: () => nameFrom(r, 3), ...o })
  }
  // (in a fork scenario any seat's honest entry may lose: the fork's loser,
  // and an entry the other seat wrote after seeing only the loser, are both
  // refused as stale once the winner is folded before them)
  const forked = kind === 'fork', reactive = kind === 'reenter'
  const seated = humans.map((s) => peer({ name: `seat ${s}`, dev: `d${s}`, seats: [s], fork: forked, ...(reactive ? { reactive, pace: mulberry32(Math.floor(rand() * 2 ** 32)) } : {}) }))
  const spectator = peer({ name: 'spectator', dev: 'dS' })
  if (forked) peer({ name: `seat ${humans[0]}'`, dev: `d${humans[0]}`, seats: [humans[0]], fork: true })
  for (const p of net.peers) p.budget = 3 + Math.floor(rand() * 4)
  if (kind === 'concede') seated[Math.floor(rand() * seated.length)].concedes = true
  // the start, by the lowest human seat's device (the list's first op:
  // what a reactive seat answers it with comes after)
  const host = seated[0]
  host.session.start({ ...setup, seats: setup.seats.map((x, s) => (x.ctrl === 'human' ? { ...x, dev: `d${s}` } : x)) })
  net.why.set(net.ops[0].key, { kind: 'start', peer: host.name })
  const steps = play(net, rand, reactive ? { deliver: 0.5 } : {})
  const conceded = [...net.why.values()].some((w) => w.kind === 'concede')
  const corpus = conceded ? null : foldJob(M.core, it.job, { match: M.folding })
  if (corpus?.error) throw new Error(`${where}: the corpus log folds short in one process: ${corpus.error.split('\n')[0]}`)
  if (corpus && !verdict(it, corpus).ok) throw new Error(`${where}: the corpus log, folded in one process, no longer replays its baseline`)
  const { ref, fate, hk } = judge(net, M, { corpusTrace: corpus?.trace, where })
  const met = fates(net, fate, where)
  // with one device a seat, nothing a peer has shown is ever undone (a reset
  // there only reorders two seats' deployments, which commute)
  const undone = net.peers.reduce((n, p) => n + p.undone, 0)
  if ((kind === 'plain' || kind === 'reenter') && undone) throw new Error(`${where}: with one device a seat, a reset undid ${undone} entries shown`)
  // (reenter) nothing left queued, and every command a seat's peer sent
  // from a callback written (a drop only where the match had moved on)
  let reacted = null
  if (reactive) {
    reacted = {}
    for (const p of seated) {
      if (p.queued) throw new Error(`${where}: ${p.name}'s ${JSON.stringify(p.queued.body)} (sent from ${p.queued.from}) is still queued at the end`)
      for (const [k, n] of Object.entries(p.reacted)) reacted[k] = (reacted[k] ?? 0) + n
    }
    const sent = reacted.events + reacted.reset + reacted.settled + reacted.dropped
    if (sent !== reacted.written + reacted.drops) throw new Error(`${where}: the seats' peers sent ${sent} commands from their sinks, ${reacted.written} written and ${reacted.drops} dropped`)
  }
  return {
    where, steps, peers: net.peers.length, entries: ref.accepted.length + ref.rejected.length, accepted: ref.accepted.length, rejected: ref.rejected.length,
    resets: net.peers.reduce((n, p) => n + p.resets, 0), undone, refolds: net.peers.reduce((n, p) => n + p.insertsBefore, 0), conceded, met, hk, spectator: spectator.name, reacted,
  }
}

// An AI pair: its start (the whole battle runs inside it), spectators
// slipping junk in around it.
function aiScenario(M, it, seed) {
  const rand = mulberry32(seed * 7919 + it.id.length)
  const where = `${it.id} #${seed} (ai)`
  const net = new Net()
  const peers = ['host', 'spectator a', 'spectator b'].map((name, i) => new Peer(net, { name, actor: nameFrom(rand), dev: `d${i}`, M, rand: () => nameFrom(rand, 3) }))
  for (const p of peers) p.budget = 4
  peers[0].session.start(jobSetup(it.job))
  peers[0].mark('start')
  // (an all-AI match is over at its start: what follows is inert, and the
  // spectators only slip junk in while it is live, so slip some in now)
  for (const p of peers) for (let k = 0; k < 3; k++) p.put(JUNK[Math.floor(rand() * JUNK.length)](M.E, p, k), 'junk')
  const steps = play(net, rand)
  const corpus = foldJob(M.core, it.job, { match: M.folding })
  if (!verdict(it, corpus).ok) throw new Error(`${where}: the AI pair, folded in one process, no longer replays its baseline`)
  const { ref, fate } = judge(net, M, { corpusTrace: corpus.trace, where })
  // (after the end every later entry is inert, junk included: decode's
  // verdict still comes first)
  return { where, steps, peers: 3, entries: ref.accepted.length + ref.rejected.length, accepted: ref.accepted.length, rejected: ref.rejected.length, resets: 0, refolds: 0, met: fates(net, fate, where) }
}

// The cap: a spectator floods the log past MAX_ENTRIES while a seat plays.
function capScenario(M, it) {
  const rand = mulberry32(5000)
  const where = `${it.id} (cap)`
  const net = new Net()
  const setup = jobSetup(it.job)
  const s0 = setup.seats.findIndex((x) => x.ctrl === 'human')
  const script = {}
  for (const { s, ...body } of it.job.entries) (script[s] ??= []).push(body)
  // (the flooder's actor sorts first where the two wrote concurrently, so
  // its flood lands before the seat's later commands: the cap is reached
  // while the match is live)
  const seat = new Peer(net, { name: `seat ${s0}`, actor: 'b', dev: 'd0', seats: [s0], M, script, rand: () => '0' })
  const flood = new Peer(net, { name: 'flooder', actor: 'z', dev: 'dF', M, rand: () => '0' })
  seat.session.start({ ...setup, seats: setup.seats.map((x, s) => (s === s0 ? { ...x, dev: 'd0' } : x)) })
  // a few of the seat's commands, then the flood, written while the seat
  // plays on: ids of their own, each refused (no such kind)
  for (let k = 0; k < 3; k++) {
    const act = seat.canAct()
    seat.session.submit(act.s, act.body)
  }
  flood.receive(net.ops.slice())
  const N = CAP
  for (let k = 0; flood.session.status !== 'full'; k++) {
    if (k > N + 10) throw new Error(`${where}: the flooder's own Folder never went full (${k} entries written)`)
    flood.put(M.E.encode({ id: `dF.flood${k}`, s: s0, d: 'dF', t: 'nope' }))
  }
  // the seat plays on, concurrently, then the flood reaches it at once
  for (let k = 0; k < 5; k++) {
    const act = seat.canAct()
    if (act) seat.session.submit(act.s, act.body)
  }
  seat.receive(net.ops.filter((op) => op.actor === 'z'))
  play(net, rand)
  const { ref } = judge(net, M, { want: 'full', where })
  const at = ref.report.at, list = net.peers[0].order
  const k = list.findIndex((key) => net.peers[0].decoded(net.peers[0].ops.get(key)).id === at)
  if (k !== N) throw new Error(`${where}: the match froze at entry ${k} (${at}), not at entry ${N}, the first past the spec's cap of ${CAP}`)
  for (const p of net.peers) if (p.session.report?.at !== at) throw new Error(`${where}: ${p.name} froze at ${p.session.report?.at}, not ${at}`)
  return { where, steps: 0, peers: 2, entries: list.length, accepted: ref.accepted.length, rejected: ref.rejected.length, resets: 0, refolds: net.peers.reduce((n, p) => n + p.insertsBefore, 0), met: {}, full: N }
}

// The desync drills (`how`: hypot, late, deaf, closing; the header). One
// seat's peer runs the drifting copy (`patched`): `odd` for hypot; for late,
// the seat that waits through the author's final turn; for deaf, the seat
// the copy's round more waits on first; for closing, the author of the
// final entry.
function drill(M, patched, it, odd, how = 'hypot') {
  const rand = mulberry32(31337 + (how === 'hypot' ? odd : how === 'late' ? 1000 : how === 'closing' ? 3000 : 2000))
  const net = new Net()
  const setup = jobSetup(it.job), E = it.job.entries
  const devs = { ...setup, seats: setup.seats.map((x, s) => ({ ...x, dev: `d${s}` })) }
  const script = {}
  for (const { s, ...body } of E) (script[s] ??= []).push(body)
  // late: the author's final turn, the log's trailing run of its entries;
  // the copy drifts once the entry before it is accepted (the start counts)
  const author = E.at(-1).s
  let first = E.length - 1
  while (first > 0 && E[first - 1].s === author) first--
  if (how === 'late') {
    odd = 1 - author
    globalThis.MERGE_SIM_DRIFT_AT = first + 1
  }
  if (how === 'closing') {
    // (every entry of a corpus log is accepted: with the start, its last)
    odd = author
    globalThis.MERGE_SIM_DRIFT_AT = E.length + 1
  }
  if (how === 'deaf') {
    // the log folded by the copy: the match must go on past it, and the seat
    // it waits on first plays on
    const f = new patched.F.Folder({ out: null })
    let n = 0
    const env = (body, s, extra = {}) => patched.E.decode(patched.E.encode(patched.E.envelope(body, { id: `d${Math.max(s, 0)}.${n++}.p`, s, d: `d${Math.max(s, 0)}`, ...extra })))
    f.push(env({ t: 'start', core: patched.core.CORE_VERSION, rules: patched.core.RULES_ID, setup: devs }, -1))
    for (const { s, ...b } of E) if (f.status === 'live') f.push(env(b, s, { p: f.head(s), h: patched.F.SIMULTANEOUS.includes(f.G.pending.k) ? undefined : patched.core.stateHash(f.G) }))
    if (f.status !== 'live') throw new Error(`${where0(it, how)}: the copy that plays a round more ends this log ${f.status}: the drill wants a log that ends on the rounds`)
    odd = f.G.pending.seats[0]
  }
  const where = `${it.id} (drill: ${how}, seat ${odd} drifted)`
  const actor = (s) => (how === 'late' ? (s === odd ? 'a' : 'b') : `a${s}`)
  const seats = [0, 1].map((s) => new Peer(net, {
    name: `seat ${s}${s === odd ? ` (${how === 'hypot' ? 'nudged hypot' : how === 'late' ? 'drifts late' : how === 'closing' ? 'drifts in the last entry' : 'a round more'})` : ''}`,
    actor: actor(s), dev: `d${s}`, seats: [s], M: s === odd ? patched : M, script, rand: () => nameFrom(rand, 3),
    hold: how === 'late' && s === odd, nudged: (how === 'late' || how === 'closing') && s === odd, fallback: how === 'deaf' && s === odd, closing: how === 'closing',
  }))
  const spectator = new Peer(net, { name: 'spectator', actor: 'aS', dev: 'dS', M, rand: () => '0' })
  seats[0].session.start(devs)
  const steps = play(net, rand)
  const peers = [...seats, spectator]
  for (const p of peers) if (p.session.status !== 'desync') throw new Error(`${where}: ${p.name} ends ${p.session.status}, not desync (${p.session.accepted.length} accepted)`)
  const rs = peers.map((p) => p.session.report)
  if (how === 'closing') {
    // every peer folded the whole log, its match over before a final froze
    // it (by its own hash, or on a seat's desync of one), each final from a
    // seat's own device on the head the match ended at
    const list = spectator.store.entries(), finals = list.filter((e) => e.t === 'final')
    const last = list.findLast((e) => e.t !== 'final' && e.t !== 'desync')
    const atFinal = (r) => finals.some((e) => e.id === r.at)
    if (!finals.length || finals.some((e) => e.d !== `d${e.s}`)) throw new Error(`${where}: ${finals.length} finals, ${finals.map((e) => `${e.d} for seat ${e.s}`).join(', ')}: each seat's own device says one`)
    for (const [i, r] of rs.entries()) {
      if (!atFinal(r)) throw new Error(`${where}: ${peers[i].name} froze at ${r.at} (by ${r.by}), not at a final`)
      if (!peers[i].session.accepted.includes(last.id)) throw new Error(`${where}: ${peers[i].name} never accepted the log's last entry ${last.id}`)
    }
    if (!rs.some((r) => r.by === 'hash')) throw new Error(`${where}: no peer found a final apart by its own hash`)
    for (const [i, r] of rs.entries()) {
      const missing = ['setup', 'entries', 'accepted', 'rejected', 'trace', 'state', 'core', 'rules'].filter((k) => r[k] === undefined || r[k] === null)
      if (missing.length) throw new Error(`${where}: ${peers[i].name}'s report lacks ${missing.join(', ')}`)
    }
    return { where, steps, peers: 3, entries: list.length, accepted: spectator.session.accepted.length, rejected: spectator.session.rejected.length, resets: 0, refolds: 0, met: {}, at: rs.map((r) => r.at).join(' / '), found: peers.filter((p, i) => rs[i].by === 'hash').map((p) => p.name).join(', '), watched: rs[2].by === 'hash' ? 'its own hash' : 'a desync entry', how, odd, finals: finals.length }
  }
  if (rs.some((r) => r.at !== rs[0].at)) throw new Error(`${where}: the peers froze at different entries: ${rs.map((r, i) => `${peers[i].name} ${r.at}`).join(', ')}`)
  // one seat found it by the hash, the other by that seat's desync entry,
  // their hashes crossed
  const [r0, r1] = rs
  const byHash = rs.slice(0, 2).filter((r) => r.by === 'hash').length
  if (byHash !== 1) throw new Error(`${where}: ${byHash} of the two seats froze on the hash (one must, and say so)`)
  if (r0.theirs !== r1.mine || r0.mine !== r1.theirs || r0.mine === r0.theirs) throw new Error(`${where}: the reports' hashes don't cross: ${JSON.stringify([r0.mine, r0.theirs, r1.mine, r1.theirs])}`)
  for (const [i, r] of rs.entries()) {
    const missing = ['setup', 'entries', 'accepted', 'rejected', 'trace', 'state', 'core', 'rules'].filter((k) => r[k] === undefined || r[k] === null)
    if (missing.length || !r.trace.length || r.trace.length > 50 || typeof r.state !== 'string') throw new Error(`${where}: ${peers[i].name}'s report lacks ${missing.join(', ') || 'its trace or state'}`)
  }
  // (the spectator froze by its own hash, or, when the author's match was
  // its own, on the drifted seat's desync entry)
  const watched = rs[2].by === 'hash' ? 'its own hash' : rs[2].by === rs.find((r) => r.by !== 'hash').by ? 'the desync entry' : null
  if (!watched) throw new Error(`${where}: the spectator froze on ${rs[2].by}, neither by its hash nor on the seats' desync entry`)
  const list = spectator.store.entries(), at = list.find((e) => e.id === r0.at)
  const other = seats[1 - odd]
  if (how === 'late') {
    // the author's final turn found apart, by the drifted seat; its desync
    // after the end in the list, so the author's and the spectator's
    // matches were over when it came
    const kd = list.findIndex((e) => e.id === rs[1 - odd].by), ke = list.findLastIndex((e) => e.d === `d${author}`)
    if (at?.s !== author || rs[odd].by !== 'hash' || at.id !== list.filter((e) => e.s === author && e.d === `d${author}`)[E.slice(0, first).filter((x) => x.s === author).length]?.id) throw new Error(`${where}: the match froze at ${r0.at}, not at the first entry of seat ${author}'s final turn, found by seat ${odd}`)
    if (!(kd > ke) || other.G.turn.stage !== 'over' || spectator.G.turn.stage !== 'over' || !other.session.accepted.includes(list[ke].id)) throw new Error(`${where}: the desync (at ${kd}) didn't land after the end (seat ${author}'s last entry at ${ke}, its match ${other.G.turn.stage}), so the drill never met an over match`)
  }
  if (how === 'deaf') {
    // the drifted seat's entry past the end, found apart by the others'
    // over matches
    if (at?.s !== odd || rs[1 - odd].by !== 'hash' || rs[2].by !== 'hash' || other.G.turn.stage !== 'over' || spectator.G.turn.stage !== 'over' || seats[odd].G.turn.stage === 'over') throw new Error(`${where}: the match froze at ${r0.at} (seat ${at?.s}'s), found by ${rs.map((r) => r.by).join(', ')}, the matches ${peers.map((p) => p.G.turn.stage).join(', ')}: not on the drifted seat's entry past the others' end`)
  }
  return { where, steps, peers: 3, entries: spectator.order.length, accepted: spectator.session.accepted.length, rejected: spectator.session.rejected.length, resets: 0, refolds: 0, met: {}, at: r0.at, found: peers[rs.findIndex((r) => r.by === 'hash')].name, watched, how, odd }
}
const where0 = (it, how) => `${it.id} (drill: ${how})`

// The Folder's edges, one process, each from a fresh Folder (the header
// lists them all): a start made under another CORE_VERSION or RULES_ID
// opens read-only ('skew': no match, later entries inert); a start whose
// human seat names no device (or one no entry can carry) is refused and the
// log stays in its lobby for a good one; an online log's `open` makes its
// device the only one whose start counts; a second start is refused; an
// entry accepted here that vanishes from the list is tamper (the match
// freezes as it stands, reported); then the hash's, the Session's and
// reentrancy's.
// (F4) The round limit's vote from both seats' devices at once: a hotseat
// log that ends on its rounds, under setup.overtime 'vote', stops at the
// round limit with both seats to vote; each says its own on its own head (a
// simultaneous decision: no hash), and the peers fold the same match in
// either order, on to round 6 when both say more and to the end on the score
// when either doesn't. A seat's second say (on the same head, concurrent with
// its first) is refused, and so is a say for a seat from another device.
function votes(M, it) {
  const { E, F, core } = M
  const where = `${it.id} (votes)`
  const setup = { ...jobSetup(it.job), overtime: 'vote' }
  const devs = { ...setup, seats: setup.seats.map((x, s) => (x.ctrl === 'human' ? { ...x, dev: `d${s}` } : x)) }
  let n = 0
  const env = (body, s, extra = {}) => E.decode(E.encode(E.envelope(body, { id: `d${Math.max(s, 0)}.${n++}.v`, s, d: `d${Math.max(s, 0)}`, ...extra })))
  const write = (f, s, b) => env(b, s, { p: f.head(s), h: F.SIMULTANEOUS.includes(f.G.pending.k) ? undefined : core.stateHash(f.G) })
  const checks = []
  const expect = (what, ok, got) => {
    if (!ok) throw new Error(`${where}: ${what} (${got})`)
    checks.push(what)
  }
  const fold = (list) => {
    const f = new F.Folder({ out: [] })
    for (const e of list) f.push(e)
    return f
  }
  // (the battle's log too: the says commute in it as in the match)
  const sig = (f) => JSON.stringify({ status: f.status, accepted: f.accepted.length, rejected: f.rejected.map((r) => r.why), hash: f.G ? core.stateHash(f.G) : null, pending: f.G?.pending?.k ?? null, round: f.G?.turn.round, result: f.G?.turn.result ?? null, trace: f.G ? core.cyrb53(f.G.journal.trace.join('\n')) : null })
  // the log to its round limit, as its seats wrote it
  const lead = new F.Folder({ out: [] })
  const list = [env({ t: 'start', core: core.CORE_VERSION, rules: core.RULES_ID, setup: devs }, -1)]
  lead.push(list[0])
  for (const { s, ...b } of it.job.entries) {
    const e = write(lead, s, b)
    list.push(e)
    lead.push(e)
  }
  expect('the log, under the vote, stops at the round limit with both seats to vote', lead.status === 'live' && lead.G.pending?.k === 'roundLimit' && lead.G.pending.seats.join() === '0,1' && lead.rejected.length === 0, `${lead.status}, ${JSON.stringify(lead.G?.pending)}, ${JSON.stringify(lead.rejected)}`)
  for (const [m0, m1] of [[true, true], [true, false], [false, true], [false, false]]) {
    const v0 = write(lead, 0, { t: 'vote', more: m0 }), v1 = write(lead, 1, { t: 'vote', more: m1 })
    const a = fold([...list, v0, v1]), b = fold([...list, v1, v0])
    expect(`seats saying ${m0 ? 'more' : 'end'} and ${m1 ? 'more' : 'end'} at once fold the same match in either order`, sig(a) === sig(b) && a.accepted.includes(v0.id) && a.accepted.includes(v1.id), `${sig(a)} | ${sig(b)}`)
    const on = m0 && m1
    expect(`… which ${on ? 'plays round 6, overtime' : 'ends on the score'}`, on ? a.status === 'live' && a.G.turn.round === 6 && a.G.turn.overtime === 1 && a.G.pending?.k === 'phase' : a.status === 'over' && a.G.turn.result?.why === 'score' && a.G.turn.round === 5, sig(a))
  }
  {
    const v0 = write(lead, 0, { t: 'vote', more: true }), again = write(lead, 0, { t: 'vote', more: false })
    const f = fold([...list, v0, again])
    expect("a seat's second say, on the head its first was written on, is refused", f.accepted.includes(v0.id) && f.rejected.some((r) => r.id === again.id), JSON.stringify(f.rejected))
    const spoof = env({ t: 'vote', more: true }, 1, { d: 'd0', p: lead.head(1) })
    const g = fold([...list, spoof])
    expect("a say for seat 1 from seat 0's device is refused", g.rejected.some((r) => r.id === spoof.id && /^device/.test(r.why)) && g.G.pending?.seats.includes(1), JSON.stringify(g.rejected))
  }
  return { where, steps: 0, peers: 2, entries: 0, accepted: 0, rejected: 0, resets: 0, refolds: 0, met: {}, checks }
}

function edges(M, it) {
  const { E, F, S, core } = M
  const where = `${it.id} (edges)`
  const setup = jobSetup(it.job)
  const devs = { ...setup, seats: setup.seats.map((x, s) => (x.ctrl === 'human' ? { ...x, dev: `d${s}` } : x)) }
  let n = 0
  const env = (body, s, d, extra = {}) => E.decode(E.encode(E.envelope(body, { id: `${d}.${n++}.e`, s, d, ...extra })))
  const start = (over = {}, d = 'd0', st = devs) => env({ t: 'start', core: core.CORE_VERSION, rules: core.RULES_ID, setup: st, ...over }, -1, d)
  const checks = []
  const expect = (what, ok, got) => {
    if (!ok) throw new Error(`${where}: ${what} (${got})`)
    checks.push(what)
  }
  // (a newer build's start and an older one's alike: any other CORE_VERSION
  // is another battle)
  for (const [what, over] of [['a newer CORE_VERSION', { core: core.CORE_VERSION + 1 }], ['an older CORE_VERSION', { core: core.CORE_VERSION - 1 }], ['other rules', { rules: `${core.RULES_ID}x` }]]) {
    const f = new F.Folder({ out: [] })
    f.push(start(over))
    f.push(start())
    expect(`a start under ${what} opens read-only, and a later start is inert`, f.status === 'skew' && !f.G && /another version/.test(f.error) && f.rejected.length === 2 && /^skew/.test(f.rejected[0].why) && /^inert/.test(f.rejected[1].why), `${f.status}, ${JSON.stringify(f.rejected)}`)
  }
  {
    const f = new F.Folder({ out: [] })
    f.push(start({}, 'd0', setup))
    expect('a start whose human seat names no device is refused, the log still in its lobby', f.status === 'lobby' && /names no device/.test(f.rejected[0]?.why), `${f.status}, ${JSON.stringify(f.rejected)}`)
    // a device name past 64 characters: no entry the seat sends decodes,
    // so the match would wait on it for ever
    const long = 'd'.repeat(65)
    f.push(start({}, 'd0', { ...devs, seats: devs.seats.map((x) => (x.ctrl === 'human' ? { ...x, dev: long } : x)) }))
    expect('a start whose human seat names a device no entry can carry (past 64 characters) is refused, the log still in its lobby, saying why', f.status === 'lobby' && /^start: .*no entry can carry/.test(f.rejected[1]?.why) && /no entry can carry/.test(f.error ?? ''), `${f.status}, ${JSON.stringify(f.rejected)}`)
    f.push(start())
    expect('… and a good start then begins it', f.status === 'live' && f.accepted.length === 1 && f.error === null, f.status)
    f.push(start())
    expect('a second start is refused', f.status === 'live' && /^turn: the match has begun/.test(f.rejected.at(-1).why), JSON.stringify(f.rejected.at(-1)))
  }
  {
    const f = new F.Folder({ out: [] })
    f.push(env({ t: 'open', commit: 'c0' }, -1, 'd0'))
    f.push(env({ t: 'open', commit: 'c1' }, -1, 'd1'))
    f.push(start({}, 'd1'))
    expect("an online log's start counts only from the device that opened it (another's inert, the Folder saying why)", f.status === 'lobby' && f.accepted.length === 1 && f.rejected.length === 2 && /opened by device d0/.test(f.error ?? ''), `${f.status}, ${f.error}, ${JSON.stringify(f.rejected)}`)
    const s = start({ p: f.head(-1) }, 'd0')
    f.push(s)
    expect('… whose start begins it, after the open', f.status === 'live' && f.accepted.at(-1) === s.id && s.p === f.accepted[0], `${f.status}`)
  }
  {
    const store = []
    const f = new F.Folder({ out: [] })
    store.push(start())
    f.sync(store)
    const s0 = setup.seats.findIndex((x) => x.ctrl === 'human')
    const body = it.job.entries.find((e) => e.s === s0)
    const { s, ...b } = body
    const first = env(b, s, `d${s}`, { p: f.head(s) })
    store.push(first)
    f.sync(store)
    const took = f.accepted.length
    f.sync([store[0]])
    expect('an accepted entry gone from the list is tamper, the match frozen as it stood', took === 2 && f.status === 'tamper' && f.report?.gone?.[0] === first.id && f.accepted.length === 2, `${took} accepted, ${f.status}`)
    // the entry back, after a concurrent insert: the list would refold
    // (no accepted id is gone now), but the freeze holds
    f.sync([store[0], env({ t: 'nope' }, s, 'dX'), first])
    expect('… and stays tamper when the entry comes back after an insert', f.status === 'tamper' && f.report?.gone?.[0] === first.id, f.status)
    // an accepted id that names another body first: in its place, or
    // inserted before it (the first good entry with an id is the one a
    // fold takes), never refolded silently into another match
    const other = E.decode(E.encode({ ...first, zz: 1 }))
    for (const [how, list] of [['in its place', [store[0], other]], ['inserted before it', [store[0], other, first]]]) {
      const g = new F.Folder({ out: [] })
      g.sync(store)
      const r = g.sync(list)
      expect(`an accepted id that names another body ${how} is tamper too`, !other.bad && g.status === 'tamper' && g.report?.gone?.[0] === first.id && !r.events.length, `${g.status}, ${JSON.stringify(g.rejected.at(-1))}`)
    }
  }
  // every junk text merge-sim slips in, refused by decode, none thrown on
  {
    const peer = { dev: 'dJ' }
    const bad = JUNK.map((j, k) => {
      try {
        return E.decode(j(E, peer, k)).bad ? null : `junk ${k} decoded`
      } catch (err) {
        return `junk ${k} threw: ${err.message}`
      }
    }).filter(Boolean)
    expect(`decode refuses each of the ${JUNK.length} junk texts and throws on none (1e999 included)`, !bad.length, bad.join('; '))
  }
  // the seat's deployment, then its first single seat's decision: a Folder
  // live there
  const s0 = setup.seats.findIndex((x) => x.ctrl === 'human')
  const script = it.job.entries.filter((e) => e.s === s0).map(({ s, ...b }) => b)
  const deployed = script.findIndex((b) => b.t === 'deployed') + 1
  const write = (f, b, d = `d${s0}`) => env(b, s0, d, { p: f.head(s0), h: F.SIMULTANEOUS.includes(f.G.pending.k) ? undefined : core.stateHash(f.G) })
  {
    // hash before legal() (§0.2 #2): an author whose match isn't this one
    // may well send what this match refuses; it is told apart (a freeze,
    // reported), never refused one move at a time into a stall
    const f = new F.Folder({ out: null })
    f.push(start())
    for (const b of script.slice(0, deployed)) f.push(write(f, b))
    const e = env({ t: 'move', u: 999, c: 0 }, s0, `d${s0}`, { p: f.head(s0), h: 'apart' })
    f.push(e)
    expect("an entry with another match's hash and a body this match refuses freezes it (desync), never a rejection", f.status === 'desync' && f.report?.at === e.id && f.report?.by === 'hash' && !f.rejected.some((r) => r.id === e.id), `${f.status}, ${JSON.stringify(f.rejected.at(-1))}`)
  }
  {
    // a single seat's decision answered with no hash at all: nothing says
    // its author's match is this one, so it freezes the match (§2.6's
    // sketch: e.h !== stateHash(G)), never played unchecked
    const f = new F.Folder({ out: null })
    f.push(start())
    for (const b of script.slice(0, deployed)) f.push(write(f, b))
    const k = f.G.pending.k
    const e = env(script[deployed], s0, `d${s0}`, { p: f.head(s0) })
    f.push(e)
    expect("an entry answering a single seat's decision with no hash freezes the match (desync by the hash), never played unchecked", HASHED.includes(k) && e.h === undefined && f.status === 'desync' && f.report?.at === e.id && f.report?.by === 'hash' && f.report?.theirs === null && !f.accepted.includes(e.id), `${k}, ${f.status}, ${JSON.stringify(f.rejected.at(-1))}`)
  }
  {
    // After the end, a seat's hashed command on the head the match ended
    // at, with a hash that isn't this match's, freezes it only from the
    // seat's own device: from any other (a spectator's, one the seat isn't
    // played from) it is inert, or one forged entry would turn every
    // peer's result into a desync.
    const f = new F.Folder({ out: null })
    f.push(start())
    for (const b of script) if (f.status === 'live') f.push(write(f, b))
    const over = f.status, last = f.head(s0)
    const forged = ['dS', `d${s0}x`].map((d) => env({ t: 'end' }, s0, d, { p: last, h: 'apart' }))
    for (const e of forged) f.push(e)
    expect("after the end, a hashed command on the final head from a device the seat isn't played from (a spectator's, another) is inert, the match still over", over === 'over' && f.status === 'over' && forged.every((e) => /^inert/.test(f.rejected.find((r) => r.id === e.id)?.why ?? '')), `${over}, ${f.status}, ${JSON.stringify(f.rejected.slice(-2))}`)
    const own = env({ t: 'end' }, s0, `d${s0}`, { p: last, h: 'apart' })
    f.push(own)
    expect("… and the same from the seat's own device freezes it by the hash", f.status === 'desync' && f.report?.at === own.id && f.report?.by === 'hash', f.status)
  }
  {
    // A copy of an accepted entry (its very text) inserted before the head
    // it was written after: stale there, it would make the entry itself a
    // second copy, undoing it and everything after it, were the accepted
    // entries not held to their order (an insert never moves an element,
    // and an honest copy lands after its original).
    const f = new F.Folder({ out: [] })
    const st = start()
    f.push(st)
    const [A, B] = script.slice(0, 2).map((b) => {
      const e = write(f, b)
      f.push(e)
      return e
    })
    const r = f.sync([st, E.decode(E.encode(B)), A, B])
    expect('a copy of an accepted entry inserted before the head it was written after is tamper (the accepted entries out of their order), never a quiet undo', A.p === st.id && B.p === A.id && f.status === 'tamper' && f.report?.moved?.[0] === B.id && f.accepted.length === 3 && !r.events.length && !r.reset, `${f.status}, ${JSON.stringify(f.report && { at: f.report.at, moved: f.report.moved, gone: f.report.gone })}, reset ${r.reset}`)
  }
  {
    // A Session whose store this test rewrites, its sink the page's kind:
    // handed an entry's events, it reads the Session (its match, a preview
    // of it, its accepted ids), which must be the match they lead to,
    // through a refold too.
    let list = []
    const subs = new Set()
    const store = {
      kind: 'sim',
      get length() {
        return list.length
      },
      entries: () => list.slice(),
      append: (x) => {
        list.push(E.decode(typeof x === 'string' ? x : E.encode(x)))
        for (const fn of [...subs]) fn()
      },
      subscribe: (fn) => (subs.add(fn), () => subs.delete(fn)),
    }
    const set = (l) => {
      list = l
      for (const fn of [...subs]) fn()
    }
    const seen = []
    const sink = {
      events: (events, ses) => seen.push({ n: ses.accepted.length, hash: core.stateHash(ses.G), k: ses.preview((G) => G.pending?.k ?? null), stop: events.findLast((x) => x.t === 'pending')?.k ?? null }),
      reset: () => seen.push('reset'),
    }
    const junk = env({ t: 'nope' }, s0, 'dX')
    const ses = new S.Session({ store, localSeats: [s0], dev: `d${s0}`, sink })
    set([junk])
    const st = start()
    set([st, junk])
    const ref = new F.Folder({ out: null })
    ref.push(st)
    expect("a peer's first match comes through a refold (junk first, its start inserted before it): the sink reads that match", ses.status === 'live' && seen.length === 1 && seen[0].n === 1 && seen[0].hash === core.stateHash(ref.G) && seen[0].k === ref.G.pending.k, `${ses.status}, ${JSON.stringify(seen)}`)
    // two of the seat's entries, sent; then junk lands before the second
    // and a third arrives with it: the refold catches up with what was
    // shown, then shows the third, the Session already its match
    const [b1, b2, b3] = script
    ses.submit(s0, b1)
    ses.submit(s0, b2)
    for (const e of list.slice(2)) ref.push(e)
    const e3 = write(ref, b3)
    ref.push(e3)
    seen.length = 0
    set([list[0], list[1], list[2], env({ t: 'nope' }, s0, 'dY'), list[3], e3])
    expect('a refold that catches up shows what follows with the Session already the refolded match (its G, preview and accepted)', ses.status === 'live' && seen.length === 1 && seen[0] !== 'reset' && seen[0].n === 4 && seen[0].hash === core.stateHash(ref.G) && seen[0].k === ref.G.pending.k && ses.folder.head(s0) === ref.head(s0), `${ses.status}, ${JSON.stringify(seen)}`)
    ses.close()
    // A start no peer could decode is never appended: the log stays in its
    // lobby, the Session's error saying why (over 1 kB; a number JSON can't
    // write; a device whose ids run past 64 characters)
    for (const [what, st, dev, why] of [
      ['over 1 kB', { ...devs, pad: 'x'.repeat(1100) }, 'd0', /over 1024 bytes/],
      ['holding NaN', { ...devs, dice: NaN }, 'd0', /finite/],
      ['from a device named past 64 characters', devs, 'd'.repeat(70), /no id|no device/],
    ]) {
      list = []
      const s1 = new S.Session({ store, localSeats: [s0], dev })
      s1.start(st)
      expect(`a start ${what} is never appended, the Session in its lobby saying why`, !list.length && s1.status === 'lobby' && why.test(s1.error ?? ''), `${list.length} appended, ${s1.status}, ${s1.error}`)
      // (another device's start then begins the match: the reason is gone)
      store.append(start())
      expect(`… and once another device's start begins the match, its error says nothing more`, s1.status === 'live' && s1.error === null, `${s1.status}, ${s1.error}`)
      s1.close()
    }
    // a start from another device than the one that opened an online log:
    // inert, the Session in its lobby saying why
    list = []
    const s2 = new S.Session({ store, localSeats: [s0], dev: 'd1' })
    store.append(env({ t: 'open', commit: 'c0' }, -1, 'd0'))
    s2.start(devs)
    expect("a Session's start in an online log another device opened is inert, the Session in its lobby saying why", list.length === 2 && list[1].p === list[0].id && s2.status === 'lobby' && /opened by device d0/.test(s2.error ?? ''), `${list.length} appended, ${s2.status}, ${s2.error}`)
    s2.close()
    // N2's seed reveal, carried by the start the Session writes
    list = []
    const s3 = new S.Session({ store, localSeats: [s0], dev: `d${s0}` })
    s3.start(devs, { a: 'r3v3al' })
    expect("a start with N2's seed reveal (`a`) carries it and begins the match", list.length === 1 && list[0].a === 'r3v3al' && s3.status === 'live', `${list.length} appended, ${JSON.stringify(list[0]?.bad ?? list[0]?.a)}, ${s3.status}`)
    s3.close()
  }
  {
    // (R8b) The single flight: the Session folds a change whole before it
    // writes anything, and the Folder never folds within itself. A submit
    // made from a sink's callback while a change of several entries is
    // folded (a sync message, a reload, a refold) is queued as its body and
    // written once the change is folded, on the match as it then stands:
    // held to legal() again, it is dropped (sink.dropped saying why) when
    // the match has moved past it, else written with the seat's head and
    // the match's hash as they then are, never stale; two from one callback
    // are written in turn. Each Session here is judged against a fresh
    // Folder over the list its store ends with: the same accepted and
    // refused entries and status, and as many entries pushed as the list
    // holds.
    const listStore = (initial) => {
      const L = { list: initial }
      const subs = new Set()
      const tell = () => {
        for (const fn of [...subs]) fn()
      }
      L.store = {
        kind: 'sim',
        get length() {
          return L.list.length
        },
        entries: () => L.list.slice(),
        append: (x) => {
          L.list.push(E.decode(typeof x === 'string' ? x : E.encode(x)))
          tell()
        },
        subscribe: (fn) => (subs.add(fn), () => subs.delete(fn)),
      }
      L.set = (l) => {
        L.list = l
        tell()
      }
      return L
    }
    // the start and the seat's first k commands, as written
    const preload = (k) => {
      const f = new F.Folder({ out: null })
      const out = [start()]
      f.push(out[0])
      for (const b of script.slice(0, k)) {
        out.push(write(f, b))
        f.push(out.at(-1))
      }
      return out
    }
    const sig = (f) => JSON.stringify({ status: f.status, accepted: f.accepted, rejected: f.rejected })
    const judged = (what, ses, L, ok, got = '') => {
      const ref = new F.Folder({ out: null })
      for (const e of L.list) ref.push(e)
      expect(what, ok && sig(ses.folder) === sig(ref) && ses.folder.pushed.length === L.list.length, `${ses.status}/${ref.status}, ${ses.folder.pushed.length} pushed for ${L.list.length} entries, refused ${JSON.stringify(ses.rejected.slice(0, 3))}${got}`)
    }
    // (the seat's next command: in a log against the AI every accepted
    // entry but the start is the seat's)
    const nextOf = (ses) => script[ses.accepted.length - 1]
    // the first place past the deployment where the log plays four of the
    // seat's actions in one phase (entries j to j + 3) and the last two are
    // already legal before the second is played (as the match stands after
    // entry j): a sink handed entry j's events may send them both
    const ACTS = ['move', 'advance', 'shoot', 'charge']
    const after = (k) => {
      const f = new F.Folder({ out: null })
      for (const e of preload(k)) f.push(e)
      return f
    }
    let j = -1
    for (let k = deployed; k + 3 < script.length && j < 0; k++) {
      if (!script.slice(k, k + 4).every((x) => ACTS.includes(x.t))) continue
      const f = after(k + 1)
      if (f.status === 'live' && [2, 3].every((d) => core.legal(f.G, s0, script[k + d]) === null)) j = k
    }
    if (j < 0) throw new Error(`${where}: the log has no four actions in a phase whose last two are legal after the first`)
    // (a body as a peer would see it: canonical, for comparing)
    const canon = (b) => core.canonicalJSON(b)
    {
      // the prefix path: a store holding the log up to the run's second
      // move as the Session is made; its sink submits the seat's first
      // deployment command when handed the start's events (legal then;
      // past the deployment by the time the change is folded: dropped),
      // and, handed the run's first move's events, the run's third and
      // fourth moves in one call (each legal in turn on the match the whole
      // change leads to: written after the second, on the head it left)
      const L = listStore(preload(j + 2))
      const drops = [], wrote = []
      const sink = {
        events: (events, ses) => {
          const n = ses.accepted.length
          if (n === 1) ses.submit(s0, script[0])
          if (n === j + 2) {
            ses.submit(s0, script[j + 2])
            ses.submit(s0, script[j + 3])
          }
        },
        dropped: (seat, body, why, ses) => drops.push({ seat, body, why, n: ses.accepted.length }),
      }
      const before = L.list.length
      const ses = new S.Session({ store: L.store, localSeats: [s0], dev: `d${s0}`, sink })
      for (const e of L.list.slice(before)) wrote.push(e)
      const heads = wrote.map((e) => e.p), at = L.list.slice(before - 1).map((e) => e.id)
      judged("a sink's submits while a change of several entries is folded are queued: one the match has moved past is dropped and reported, never written; two from one callback are written in turn once the change is folded, on the head each finds (never stale); every entry pushed once", ses, L,
        drops.length === 1 && drops[0].seat === s0 && canon(drops[0].body) === canon(script[0]) && /doesn't answer|no decision/.test(drops[0].why) && drops[0].n === j + 3
        && wrote.length === 2 && wrote.every((e, k) => canon(E.bodyOf(e)) === canon(script[j + 2 + k]) && ses.accepted.includes(e.id)) && heads[0] === at[0] && heads[1] === at[1] && !ses.rejected.length,
        `, ${drops.length} dropped (${JSON.stringify(drops.map((d) => d.why))}), ${wrote.length} written after ${JSON.stringify(heads)} (heads ${JSON.stringify(at)})`)
      ses.close()
    }
    {
      // the refold path: junk inserted before folded entries, the sink
      // submitting while the refold shows what follows: written once the
      // change is folded, after the entries that follow, never stale
      const pre = preload(j + 2)
      const L = listStore(pre.slice(0, j + 1))
      let armed = false, sent = 0
      const sink = {
        events: (events, ses) => {
          if (!armed || ses.accepted.length !== j + 2) return
          armed = false
          sent++
          ses.submit(s0, script[j + 2])
        },
        reset: () => {
          throw new Error('a refold that undid nothing reset the view')
        },
      }
      const ses = new S.Session({ store: L.store, localSeats: [s0], dev: `d${s0}`, sink })
      armed = true
      L.set([pre[0], env({ t: 'nope' }, s0, 'dX'), ...pre.slice(1)])
      const last = L.list.at(-1)
      judged("… and one that submits while a refold shows what follows: written once the change is folded, after the entries that follow (accepted, never stale)", ses, L, sent === 1 && L.list.length === j + 5 && canon(E.bodyOf(last)) === canon(script[j + 2]) && last.p === pre.at(-1).id && ses.accepted.at(-1) === last.id && ses.rejected.length === 1, `, j ${j}, sent ${sent}, ${L.list.length} entries, the last ${JSON.stringify(last)} after ${pre.at(-1).id}`)
      ses.close()
    }
    {
      // and from a reset: a hotseat-style deployment folded in another
      // order (a concurrent insert of the other seat's placements before
      // this seat's): the sink submits from the reset, which is queued and
      // written on the reset match
      const hs = { ...devs, seats: devs.seats.map((x, s) => ({ ...x, ctrl: 'human', dev: `d${s}` })) }
      const o = 1 - s0
      const st = start({}, 'd0', hs)
      const f = new F.Folder({ out: null })
      f.push(st)
      const mine = [], theirs = []
      for (const [s, into] of [[s0, mine], [o, theirs]]) {
        const u = f.G.units.find((x) => x.side === s)
        into.push(env({ t: 'place', u: u.id, c: f.G.nav.index(u.pos.x, u.pos.z) }, s, `d${s}`, { p: st.id }))
      }
      const L = listStore([st, ...mine])
      const resets = []
      const sink = {
        reset: (G, ses, { undone }) => {
          resets.push(undone)
          const u = ses.G.units.find((x) => x.side === s0)
          ses.submit(s0, { t: 'place', u: u.id, c: ses.G.nav.index(u.pos.x, u.pos.z) })
        },
      }
      const ses = new S.Session({ store: L.store, localSeats: [s0], dev: `d${s0}`, sink })
      L.set([st, ...theirs, ...mine])
      const last = L.list.at(-1)
      judged('a submit from a reset (two seats\' placements folded in another order) is queued and written on the reset match, after the seat\'s own head', ses, L, resets.length === 1 && resets[0] === 0 && L.list.length === 4 && last.d === `d${s0}` && last.p === mine[0].id && ses.accepted.at(-1) === last.id, `, resets ${JSON.stringify(resets)}`)
      ses.close()
    }
    {
      // an autopilot that answers in settled (the one place to answer a
      // decision: the match the whole list leads to, nothing queued): from a
      // store of several entries, it plays the log on to its end, one
      // change at a time, each settled once; the corpus battle traced
      const L = listStore(preload(j + 2))
      let settles = 0, changes = 0
      const sink = {
        settled: (ses) => {
          settles++
          if (ses.count !== L.list.length) throw new Error(`settled with ${ses.count} of ${L.list.length} entries pushed`)
          const b = nextOf(ses)
          if (b && ses.legal(s0, b) === null) ses.submit(s0, b)
        },
      }
      const sub = L.store.subscribe
      L.store.subscribe = (fn) => sub(() => (changes++, fn()))
      const ses = new S.Session({ store: L.store, localSeats: [s0], dev: `d${s0}`, sink })
      const corpus = foldJob(core, it.job, { match: M.folding })
      judged('an autopilot answering in settled plays the log on to its end: settled once a change (the Session made over the store, then each entry it wrote), every entry pushed once, the corpus battle traced, never full', ses, L, ses.status === 'over' && settles === changes + 1 && L.list.length === script.length + 1 && !corpus.error && ses.G.journal.trace.join('\n') === corpus.trace.join('\n'), `, ${settles} settles for ${changes} changes after the first, ${ses.accepted.length} accepted`)
      ses.close()
    }
    {
      // a sink that throws: the Session folds the next change all the same
      const L = listStore(preload(0))
      let boom = false
      const ses = new S.Session({ store: L.store, localSeats: [s0], dev: `d${s0}`, sink: { events: () => {
        if (boom) {
          boom = false
          throw new Error('boom')
        }
      } } })
      boom = true
      let threw = null
      try {
        ses.submit(s0, script[0])
      } catch (err) {
        threw = err.message
      }
      ses.submit(s0, script[1])
      judged('a sink that throws leaves the Session folding the next change', ses, L, threw === 'boom' && ses.accepted.length === 3, `, threw ${threw}`)
      ses.close()
    }
    {
      // a sink that queues a body and then throws: the body is still written
      // (or dropped, the sink told) and the change still settles before the
      // error surfaces, so nothing waits on a queue no change will drain
      const L = listStore(preload(0))
      let armed = false, settles = 0, dropped = 0
      const ses = new S.Session({ store: L.store, localSeats: [s0], dev: `d${s0}`, sink: {
        events: (ev, ses) => {
          if (!armed) return
          armed = false
          ses.submit(s0, script[1])
          throw new Error('boom after queueing')
        },
        settled: () => settles++,
        dropped: () => dropped++,
      } })
      armed = true
      let threw = null
      const before = settles
      try {
        ses.submit(s0, script[0])
      } catch (err) {
        threw = err.message
      }
      judged('a sink that queues a body and then throws: the body is written before the error surfaces, and the change settles', ses, L, threw === 'boom after queueing' && !ses.queue.length && ses.accepted.length + dropped === 3 && settles > before, `, threw ${threw}, ${ses.queue.length} still queued, ${ses.accepted.length} accepted, ${dropped} dropped, ${settles - before} settles`)
      ses.close()
    }
    {
      // a store that throws while a queued body is written (no sink's
      // error, so call() never sees it): the error reaches the caller and
      // the Session folds the next change all the same, never left folding
      const L = listStore(preload(0))
      let armed = false, broke = false
      const append = L.store.append
      L.store.append = (x) => {
        if (broke) {
          broke = false
          throw new Error('store full')
        }
        append(x)
      }
      const ses = new S.Session({ store: L.store, localSeats: [s0], dev: `d${s0}`, sink: { events: (ev, ses) => {
        if (!armed) return
        armed = false
        broke = true
        ses.submit(s0, script[1])
      } } })
      armed = true
      let threw = null
      try {
        ses.submit(s0, script[0])
      } catch (err) {
        threw = err.message
      }
      const stuck = ses.folding
      ses.submit(s0, script[1])
      judged('a store that throws while a queued body is written leaves the Session folding the next change', ses, L, threw === 'store full' && !stuck && ses.accepted.length === 3, `, threw ${threw}, folding after ${stuck}, ${ses.accepted.length} accepted`)
      ses.close()
    }
    {
      // the Folder itself: sync entered again from the events it hands on
      // throws (the rest of the list is never pushed twice), and a sink
      // that throws leaves it free to fold on; push from the events it
      // hands on, or from the match's own onTrace, throws too (an entry
      // pushed into the middle of a fold)
      const pre = preload(2)
      const f = new F.Folder({ out: [] })
      let threw = null, pushed = null, after = null
      f.sync(pre.slice(0, 2), (events, e) => {
        if (e.id !== pre[0].id) return
        try {
          f.sync(pre)
        } catch (err) {
          threw = err.message
        }
        try {
          f.push(pre[2])
        } catch (err) {
          pushed = err.message
        }
      })
      try {
        f.sync(pre, () => {
          throw new Error('a sink that throws')
        })
      } catch (err) {
        after = err.message
      }
      f.sync(pre)
      expect('Folder.sync and Folder.push entered again from the events it hands on throw, never pushing the list twice, and it folds on after a sink that throws', /^Folder\.sync is not reentrant/.test(threw ?? '') && /^Folder\.push is not reentrant/.test(pushed ?? '') && after === 'a sink that throws' && f.pushed.length === 3 && f.accepted.length === 3 && !f.rejected.length, `sync threw ${threw}, push ${pushed}, then ${after}; ${f.pushed.length} pushed, ${f.accepted.length} accepted, ${JSON.stringify(f.rejected)}`)
      let traced = null
      const g = new F.Folder({ out: [], onTrace: () => {
        if (traced !== null) return
        try {
          g.push(pre[1])
          traced = 'pushed'
        } catch (err) {
          traced = err.message
        }
      } })
      g.push(pre[0])
      expect("Folder.push entered again from the match's own onTrace throws", /^Folder\.push is not reentrant/.test(traced ?? ''), traced)
    }
    {
      // a change that reaches the store while one is being folded (here a
      // sink appending the log's next entry itself, as a sync message
      // landing mid-change would): folded in the Session's next pass, never
      // inside the fold under way, every entry pushed once
      const pre = preload(j + 3)
      const L = listStore(pre.slice(0, j + 1))
      let armed = false, landed = 0
      const sink = {
        events: (events, ses) => {
          if (!armed) return
          armed = false
          landed++
          L.store.append(pre[j + 2])
        },
      }
      const ses = new S.Session({ store: L.store, localSeats: [], dev: 'dS', sink })
      armed = true
      L.store.append(pre[j + 1])
      judged("a change that reaches the store while one is folded (an entry appended from the sink) is folded in the Session's next pass, never within the fold under way", ses, L, landed === 1 && L.list.length === j + 3 && ses.accepted.length === j + 3, `, ${landed} landed, ${ses.accepted.length} accepted`)
      ses.close()
    }
    {
      // a start made from a callback (an online lobby's: settled, once the
      // open has arrived) is queued like a submit, and written once the
      // change is folded, after the open
      const L = listStore([])
      let sent = 0
      const sink = {
        settled: (ses) => {
          if (ses.status !== 'lobby' || sent) return
          sent++
          ses.start(devs)
        },
      }
      const ses = new S.Session({ store: L.store, localSeats: [s0], dev: 'd0', sink })
      L.store.append(env({ t: 'open', commit: 'c0' }, -1, 'd0'))
      judged('a start made from a sink\'s callback (settled, once the open arrived) is queued, then written after the open and begins the match', ses, L, sent === 1 && L.list.length === 2 && L.list[1].t === 'start' && L.list[1].p === L.list[0].id && ses.status === 'live', `, ${L.list.length} entries`)
      ses.close()
    }
  }
  return { where, steps: 0, peers: 1, entries: n, accepted: 0, rejected: 0, resets: 0, refolds: 0, met: {}, checks }
}

// Same-seat forks in a simultaneous decision, one process (§2.6's heads):
// two devices on seat `fk` deploy apart (the losing tab first puts one of
// the seat's units on another cell), and the other seat closes the
// deployment having seen neither branch (its entries extend its own head
// only). In the losing branch's world (the start, the loser's deployment,
// the other seat's) the battle's first single seat's decision is then
// answered: by the forked seat's losing tab, or, with the fork on the other
// seat, by the seat that saw only the loser. On the list every peer ends
// with (the winner's deployment first), that entry is stale (its prev is
// the head past the loser's branch: the head after a close commits to every
// seat's branch), never a desync of everyone's match; the winning world's
// own entry after it is played, the match live; a peer that had shown the
// losing world snaps back to it, undoing the loser's entries; and every
// Folder, however it got there, agrees with the single-process fold.
function forks(M, it) {
  const { E, F, core } = M
  const where = `${it.id} (forks)`
  const setup = jobSetup(it.job)
  const devs = { ...setup, seats: setup.seats.map((x, s) => ({ ...x, dev: `d${s}` })) }
  if (setup.seats.some((x) => x.ctrl !== 'human')) throw new Error(`${where}: the forks want a hotseat log`)
  let n = 0
  const env = (body, s, tag, extra = {}) => E.decode(E.encode(E.envelope(body, { id: `d${s}.${n++}.${tag}`, s, d: `d${s}`, ...extra })))
  const start = env({ t: 'start', core: core.CORE_VERSION, rules: core.RULES_ID, setup: devs }, -1, 'go')
  const fresh = () => {
    const f = new F.Folder({ out: null })
    f.push(start)
    return f
  }
  // `bodies` for seat s, each after the seat's head in `f` (and its hash
  // where one seat is waited on), folded there as they are written
  const write = (f, s, bodies, tag) => bodies.map((b) => {
    const one = !F.SIMULTANEOUS.includes(f.G.pending.k)
    const e = env(b, s, tag, { p: f.head(s), h: one ? core.stateHash(f.G) : undefined })
    f.push(e)
    if (f.accepted.at(-1) !== e.id) throw new Error(`${where}: ${JSON.stringify(b)} for seat ${s} wasn't taken (${JSON.stringify(f.rejected.at(-1))}, ${f.status})`)
    return e
  })
  const script = {}
  for (const { s, ...body } of it.job.entries) (script[s] ??= []).push(body)
  const deploy = (s) => script[s].slice(0, script[s].findIndex((b) => b.t === 'deployed') + 1)
  const sig = (f) => JSON.stringify({ status: f.status, accepted: f.accepted, rejected: f.rejected, hash: f.G ? core.stateHash(f.G) : null })
  const probe = fresh()
  for (const s of [0, 1]) write(probe, s, deploy(s), 'p')
  const first = probe.G.pending.seats[0]
  const checks = []
  for (const fk of [first, 1 - first]) {
    const o = 1 - fk, what = `seat ${fk} forked, seat ${first} first to play`
    // the losing tab's deployment: one of the seat's units on a cell of its
    // own first (the first that leaves the rest of the deployment legal)
    let B = null, L = null
    for (const u of probe.G.units.filter((x) => x.side === fk)) {
      for (let c = 0; c < probe.G.nav.N && !B; c += 37) {
        const f = fresh()
        if (core.legal(f.G, fk, { t: 'place', u: u.id, c }) !== null || (f.G.nav.x(c) === u.pos.x && f.G.nav.z(c) === u.pos.z)) continue
        try {
          B = write(f, fk, [{ t: 'place', u: u.id, c }, ...deploy(fk)], 'b')
          L = f
        } catch {
          B = null
        }
      }
      if (B) break
    }
    if (!B) throw new Error(`${where}: no other cell for any of seat ${fk}'s units leaves its deployment legal`)
    // the other seat's deployment closes it, in the losing world; then the
    // first single seat's decision there is answered
    const O = write(L, o, deploy(o), 'o')
    const writer = L.G.pending.seats[0]
    if (L.G.pending.seats.length !== 1 || F.SIMULTANEOUS.includes(L.G.pending.k) || writer !== first) throw new Error(`${where}: past the losing deployment the match waits on ${JSON.stringify(L.G.pending)}, not seat ${first} alone`)
    const answer = ['end', 'auto'].map((t) => ({ t })).find((b) => core.legal(L.G, writer, b) === null)
    const [X] = write(L, writer, [answer], 'x')
    const losing = [start, ...B, ...O, X]
    // the winning tab's deployment, folded first on the list every peer
    // ends with; the winning world's own answer after the loser's
    const W = fresh()
    const A = write(W, fk, deploy(fk), 'a')
    for (const e of [...B, ...O, X]) W.push(e)
    const [Y] = write(W, writer, [answer], 'y')
    const list = [start, ...A, ...B, ...O, X, Y]
    const ref = new F.Folder({ out: null })
    for (const e of list) ref.push(e)
    const why = (e) => ref.rejected.find((r) => r.id === e.id)?.why ?? 'accepted'
    const expect = (claim, ok, got) => {
      if (!ok) throw new Error(`${where}: ${what}: ${claim} (${got})`)
      checks.push(`${what}: ${claim}`)
    }
    expect('the match lives on, the winner in it, the losing tab\'s entries stale', ref.status === 'live' && A.every((e) => why(e) === 'accepted') && B.every((e) => /^(stale|turn)/.test(why(e))) && O.every((e) => why(e) === 'accepted'), `${ref.status}, ${[...B, X].map(why).join('; ')}`)
    expect(`the losing world's answer (seat ${writer}'s, written after the close) is stale, never a desync; the winning world's is played`, /^stale/.test(why(X)) && why(Y) === 'accepted' && !ref.report, `${why(X)}, ${why(Y)}, ${JSON.stringify(ref.report && { status: ref.report.status, at: ref.report.at })}`)
    // a peer that showed the losing world, then the list; one that showed
    // the winner's deployment and the close, then the list
    const shown = new F.Folder({ out: [] })
    shown.sync(losing)
    const r = shown.sync(list)
    expect('a peer that had shown the losing world snaps back to the match (a reset, undoing the loser\'s entries)', r.reset && r.undone === B.length + 1 && sig(shown) === sig(ref), `reset ${r.reset}, undone ${r.undone} of ${B.length + 1}, ${shown.status}`)
    const won = new F.Folder({ out: [] })
    won.sync([start, ...A, ...O])
    const w = won.sync(list)
    expect("a peer that had shown the winner's world refolds without a reset, to the same match", !w.reset && sig(won) === sig(ref), `reset ${w.reset}, ${won.status}`)
  }
  return { where, steps: 0, peers: 1, entries: 0, accepted: 0, rejected: 0, resets: 0, refolds: 0, met: {}, checks }
}

// Copies of the code under test (`code`), made under `work`, each a drill's
// drifting peer (`how`):
//   hypot  dmath's two-argument hypot answers an ulp high
//   late   the Folder nudges a model slot an ulp once the drill's count of
//          entries is accepted (globalThis.MERGE_SIM_DRIFT_AT: the same on
//          every refold, a function of the list alone)
//   deaf   the battle runs a round more than its setup says
const DRIFTS = {
  hypot: ['core/dmath.js', '  return Math.sqrt((a / max) * (a / max) + (b / max) * (b / max)) * max\n', '  const r = Math.sqrt((a / max) * (a / max) + (b / max) * (b / max)) * max\n  return r + r * Number.EPSILON\n'],
  late: ['match/fold.js', '    const G = this.G, now = G?.pending, open = this.simul\n', '    const G = this.G, now = G?.pending, open = this.simul\n    if (G && this.accepted.length === globalThis.MERGE_SIM_DRIFT_AT) {\n      const m = G.units.flatMap((u) => u.models).find((x) => x.alive)\n      m.ox += Number.EPSILON * Math.max(1, Math.abs(m.ox))\n    }\n'],
  deaf: ['core/engine.js', 'if (T.round < G.setup.rounds) {', 'if (T.round < G.setup.rounds + 1) {'],
}
// (closing: late's nudge, at the last entry)
DRIFTS.closing = DRIFTS.late
function drifting(code, work, how) {
  const pkg = copyCode(code, join(work, `drift-${how}`))
  const [file, from, to] = DRIFTS[how]
  const f = join(pkg, file)
  const src = readFileSync(f, 'utf8')
  if (src.split(from).length !== 2) throw new Error(`the ${how} drill can't find what it changes in ${file}`)
  writeFileSync(f, src.replace(from, to))
  return pkg
}

// ── A child: one scenario ───────────────────────────────────────────────────
if (a.child) {
  const task = JSON.parse(readFileSync(0, 'utf8'))
  let out
  try {
    const M = await modulesOf(dir)
    const it = loadCorpus().items.find((x) => x.id === task.id)
    let r
    if (task.kind === 'drill') r = drill(M, await modulesOf(a.patched), it, task.odd, task.how)
    else if (task.kind === 'edges') r = edges(M, it)
    else if (task.kind === 'votes') r = votes(M, it)
    else if (task.kind === 'forks') r = forks(M, it)
    else if (task.kind === 'cap') r = capScenario(M, it)
    else if (task.kind === 'ai') r = aiScenario(M, it, task.seed)
    else r = humanScenario(M, it, task.kind, task.seed)
    out = { ok: true, r }
  } catch (e) {
    out = { ok: false, error: String(e?.message ?? e) }
  }
  process.stdout.write(JSON.stringify(out))
  process.exit(0)
}

// ── The run ─────────────────────────────────────────────────────────────────
const ME = fileURLToPath(import.meta.url)
// the longest one scenario may run (seconds each; the cap's the longest):
// a broken copy that loops is failed, not waited on
const CHILD_MS = 300000
function child(task, pkg, patched, store) {
  return new Promise((done) => {
    const p = spawn(process.execPath, [ME, '--child', '--dir', pkg, ...(patched ? ['--patched', patched] : []), ...(store ? ['--store', store] : [])], { stdio: ['pipe', 'pipe', 'pipe'] })
    let out = '', err = ''
    const timer = setTimeout(() => {
      err = `timed out after ${CHILD_MS / 1000} s`
      p.kill('SIGKILL')
    }, CHILD_MS)
    p.on('close', () => clearTimeout(timer))
    p.stdout.setEncoding('utf8')
    p.stderr.setEncoding('utf8')
    p.stdout.on('data', (d) => (out += d))
    p.stderr.on('data', (d) => (err += d))
    p.on('close', () => {
      try {
        done(JSON.parse(out))
      } catch {
        done({ ok: false, error: `the child crashed: ${err.trim().split('\n').slice(0, 4).join(' / ') || out.slice(0, 200)}` })
      }
    })
    p.stdin.end(JSON.stringify(task))
  })
}

// The scenarios for `only` (parity's --only), `seeds` per human log, and the
// cap, the edges, the forks and the drills unless `only` names battles.
function tasks({ only, seeds, extras = only === undefined }) {
  const { items } = loadCorpus()
  const picked = select(items, only)
  const out = []
  for (const it of picked) {
    if (it.kind === 'ai') out.push({ kind: 'ai', id: it.id, seed: 1 })
    else {
      for (let k = 0; k < seeds; k++) out.push({ kind: KINDS[k % KINDS.length], id: it.id, seed: k + 1 })
      // (R8b) the seats answering from their sinks' callbacks
      out.push({ kind: 'reenter', id: it.id, seed: 1 })
    }
  }
  if (extras) {
    const vsAi = items.find((x) => x.kind === 'human' && x.job.setup.seats.some((s) => s.ctrl === 'ai'))
    out.push({ kind: 'cap', id: vsAi.id }, { kind: 'edges', id: vsAi.id })
    // (F4) the round limit's vote from both seats at once, on a hotseat log
    // that ends on its rounds
    out.push({ kind: 'votes', id: 'hotseat-late-8' })
    const hot = items.filter((x) => x.mode === 'hotseat')
    // (the third hypot drill nudges the seat that does not write the first
    // single-seat entry: the drifted peer finds an honest author apart, and
    // the spectator, whose match is the author's, freezes on its desync)
    out.push({ kind: 'drill', how: 'hypot', id: hot[0].id, odd: 1 }, { kind: 'drill', how: 'hypot', id: hot[1].id, odd: 0 }, { kind: 'drill', how: 'hypot', id: hot[0].id, odd: 0 })
    // (late: hotseat-late-8's author ends on a turn of seven entries, the
    // first found apart; hotseat-aggressive-125's final turn is the one
    // entry that wipes the other army out, found apart itself. deaf: a log
    // that ends on the rounds, as hotseat-late-8 does)
    out.push({ kind: 'drill', how: 'late', id: 'hotseat-late-8' }, { kind: 'drill', how: 'late', id: 'hotseat-aggressive-125' }, { kind: 'drill', how: 'deaf', id: 'hotseat-late-8' })
    // (N2) closing: the same two logs, the drift inside the final entry
    out.push({ kind: 'drill', how: 'closing', id: 'hotseat-late-8' }, { kind: 'drill', how: 'closing', id: 'hotseat-aggressive-125' })
    out.push(...hot.map((x) => ({ kind: 'forks', id: x.id })))
  }
  return out
}

async function run(pkg, list, { quiet = false, store = null } = {}) {
  const say = quiet ? () => {} : (s) => console.log(s)
  const work = join(tmpdir(), `tails-and-scales-merge-${process.pid}-${Math.floor(Math.random() * 1e9)}`)
  const patched = {}
  for (const how of new Set(list.filter((t) => t.kind === 'drill').map((t) => t.how))) patched[how] = drifting(pkg, work, how)
  const t0 = Date.now()
  const res = await pool(list, CPUS, async (t) => {
    const r = await child(t, pkg, patched[t.how], store)
    const x = r.r
    say(`  ${`${t.id} ${t.kind === 'drill' ? `drill, ${t.how}${t.odd === undefined ? '' : `, seat ${t.odd}`}` : ['cap', 'edges', 'forks', 'votes'].includes(t.kind) ? t.kind : `#${t.seed} ${t.kind}`}`.padEnd(40)} ${r.ok
      ? t.kind === 'drill' && x.how === 'closing' ? `ok   all 3 peers froze on a final (${x.finals} said; at ${x.at}), found by ${x.found}, the spectator by ${x.watched}, reported (${x.steps} steps)`
        : t.kind === 'drill' ? `ok   all 3 peers froze at ${x.at}, found by ${x.found}, the spectator by ${x.watched}, reported${x.how === 'late' ? ' (its desync after the end)' : x.how === 'deaf' ? " (on seat " + x.odd + "'s entry past the others' end)" : ''} (${x.steps} steps)`
        : t.kind === 'cap' ? `ok   both peers full at entry ${x.full} (${x.entries} entries)`
          : t.kind === 'votes' ? `ok   ${x.checks.length} checks: both seats' say at once, in either order, every way (more, end), on to overtime or the end; a second say and another device's refused`
          : t.kind === 'edges' ? `ok   ${x.checks.length} checks: skew (newer, older, rules), devices no entry names, open's device, a second start, tamper (gone, replaced, out of order), junk, the hash (before legal(), missing, after the end), a sink through a refold, starts never written, the single flight (queued, dropped, written in turn; from a reset; an autopilot in settled), push and sync not reentrant`
          : t.kind === 'forks' ? `ok   ${x.checks.length} checks: each seat forked in the deployment, the loser's world answering first, stale everywhere, live`
          : `ok   ${x.peers} peers agree: ${x.accepted} accepted, ${x.rejected} refused${x.conceded ? ', conceded' : ''}; ${x.refolds} inserts before folded entries, ${x.resets} resets${x.undone ? ` (${x.undone} undone)` : ''}${x.reacted ? `; sent from events ${x.reacted.events}, reset ${x.reacted.reset}, settled ${x.reacted.settled}, dropped ${x.reacted.dropped} (${x.reacted.written} written, ${x.reacted.drops} dropped)` : ''}`
      : `FAIL ${r.error}`}`)
    return r
  })
  rmSync(work, { recursive: true, force: true })
  const bad = res.filter((r) => !r.ok)
  // over the run: every slipped-in kind met its own reason, sync refolded
  // and reset
  const met = {}
  for (const r of res) if (r.ok) for (const [k, n] of Object.entries(r.r.met)) met[k] = (met[k] ?? 0) + n
  const ok = res.filter((r) => r.ok).map((r) => r.r)
  const sums = { refolds: ok.reduce((n, x) => n + x.refolds, 0), resets: ok.reduce((n, x) => n + x.resets, 0), undone: ok.reduce((n, x) => n + (x.undone ?? 0), 0), entries: ok.reduce((n, x) => n + x.entries, 0) }
  const hk = {}
  for (const x of ok) for (const [k, n] of Object.entries(x.hk ?? {})) hk[k] = (hk[k] ?? 0) + n
  // (R8b) what the reenter scenarios' seats sent from each callback
  const reacted = {}
  for (const x of ok) for (const [k, n] of Object.entries(x.reacted ?? {})) reacted[k] = (reacted[k] ?? 0) + n
  const reenters = list.filter((t) => t.kind === 'reenter').length
  if (reenters >= 4 && !bad.length) {
    for (const k of ['events', 'reset', 'settled']) if (!reacted[k]) bad.push({ error: `no reenter scenario's seat ever submitted from its sink's ${k} callback` })
  }
  const human = list.filter((t) => KINDS.includes(t.kind)).length
  if (human >= KINDS.length && !bad.length) {
    for (const k of [...HASHED, 'deploy']) if (!hk[k]) bad.push({ error: `no accepted entry answering a ${k} decision was ever held to §0.2 #3's hash rule` })
    const never = Object.entries(PRIMARY).filter(([k, why]) => !met[`${k}:${why}`]).map(([k, why]) => `${k} refused as ${why}`)
    if (never.length) bad.push({ error: `the run never met: ${never.join(', ')}` })
    if (!sums.refolds) bad.push({ error: 'no op ever landed before entries a peer had folded: sync never refolded' })
    if (!sums.resets) bad.push({ error: 'no peer ever had its shown history changed: sync never reset' })
    if (!sums.undone) bad.push({ error: 'no reset ever undid an entry shown (a fork\'s loser)' })
    if (!met['fork:stale']) bad.push({ error: "no fork's loser was ever refused as stale" })
    if (!met['concede:accepted']) bad.push({ error: 'no concession out of band was ever accepted' })
  }
  // over the hypot drills: a spectator froze by its own hash, and one on a
  // seat's desync entry (its match the honest author's)
  const drills = ok.filter((x) => x.watched && x.how === 'hypot')
  if (list.filter((t) => t.kind === 'drill' && t.how === 'hypot').length >= 3 && !bad.length) {
    for (const how of ['its own hash', 'the desync entry']) if (!drills.some((x) => x.watched === how)) bad.push({ error: `no hypot drill's spectator froze by ${how}` })
  }
  say(`\n${list.length} scenarios, ${sums.entries} entries folded by every peer, ${sums.refolds} inserts before folded entries, ${sums.resets} resets (${sums.undone} entries shown undone); refused or accepted: ${Object.entries(met).sort().map(([k, n]) => `${k} ${n}`).join(', ')}; held to §0.2 #3's hash rule: ${Object.entries(hk).sort().map(([k, n]) => `${k} ${n}`).join(', ')}${reenters ? `; submitted from a sink's callback (reenter): ${['events', 'reset', 'settled', 'dropped'].map((k) => `${k} ${reacted[k] ?? 0}`).join(', ')}, ${reacted.written ?? 0} written once their change was folded, ${reacted.drops ?? 0} dropped, ${reacted.settles ?? 0} settles` : ''} (${Math.round((Date.now() - t0) / 1000)} s)`)
  return bad
}

// ── The self-test ───────────────────────────────────────────────────────────
// Each a broken copy of the match layer (or the Session); P-merge must fail
// on each. Parity (one device, its own envelopes) sees none of them.
const MUTANTS = {
  // the Folder takes any head: an entry written on a stale view is played
  'no-prev': ['match/fold.js', "    if (e.p !== this.head(e.s)) return this.reject(e, `stale: seat ${e.s}'s head is ${this.head(e.s)}, not ${e.p}`)\n", ''],
  // any device may play a seat
  'no-device': ['match/fold.js', '    if (e.d !== G.setup.seats[e.s].dev) return this.reject(e, `device: seat ${e.s} is not played from ${e.d}`)\n', ''],
  // an id seen before is folded again
  'no-duplicate': ['match/fold.js', "    if (this.seen.has(e.id)) return this.reject(e, 'envelope: an id seen before')\n", ''],
  // the hash checked on simultaneous decisions too (a deployment's entries
  // carry none: §0.2 #3)
  'hash-every-kind': ['match/fold.js', 'if (!SIMULTANEOUS.includes(P.k) && e.h !== stateHash(G)) return this.freeze(e)', 'if (e.h !== stateHash(G)) return this.freeze(e)'],
  // legal() handed the envelope, not its body
  'legal-takes-envelope': ['match/fold.js', '    const why = legal(G, e.s, body)\n    if (why) return this.reject(e, `illegal: ${why}`)\n    const clock', '    const why = legal(G, e.s, e)\n    if (why) return this.reject(e, `illegal: ${why}`)\n    const clock'],
  // bodyOf keeps only the fields a command may have, so a stray one is
  // quietly dropped and the command played
  'body-by-kind': ['match/envelope.js', 'export const bodyOf = (e) => Object.fromEntries(Object.entries(e).filter(([k]) => !ENVELOPE_KEYS.includes(k)))', "export const bodyOf = (e) => Object.fromEntries(Object.entries(e).filter(([k]) => ['t', 'u', 'c', 'tg', 'more'].includes(k)))"],
  // sync folds on in arrival order: an insert before folded entries is
  // only appended to them
  'arrival-order': ['match/fold.js', 'prefix = same(entries[i], this.pushed[i])', 'prefix = true'],
  // a refold that undid what was shown doesn't say so (no snap)
  'no-reset': ['match/fold.js', '    const reset = !showing\n    if (reset) show()\n', '    const reset = false\n    if (!showing) show()\n'],
  // one head for every seat in a simultaneous decision
  'global-head': ['match/fold.js', 'return this.simul ? this.simul.heads[seat] ?? this.simul.id : this.last', 'return this.last'],
  // a concession held to the turn (it carries no prev: refused)
  'concede-in-band': ['match/fold.js', 'if (OUT_OF_BAND.includes(e.t)) return this.outOfBand(e)', "if (e.t === 'desync') return this.outOfBand(e)"],
  // anyone may speak out of band for a seat
  'spoofed-out-of-band': ['match/fold.js', '    if (e.d !== seat.dev) return this.reject(e, `device: seat ${e.s} is not played from ${e.d}`)\n', ''],
  // no cap on the log
  'no-cap': ['match/fold.js', 'if (this.pushed.length > MAX_ENTRIES) {', 'if (false) {'],
  // the device that found a desync keeps it to itself
  'silent-desync': ['match/session.js', "    this.append({ t: 'desync', at: r.at, mine: r.mine }, { s: seat })\n", ''],
  // a start made under other rules is folded as if they were these
  'no-skew': ['match/fold.js', 'if (e.core !== CORE_VERSION || e.rules !== RULES_ID) {', 'if (false) {'],
  // anyone's start begins an online log
  'any-start': ['match/fold.js', "if (e.t === 'start' && (this.openBy === null || e.d === this.openBy)) return this.begin(e)", "if (e.t === 'start') return this.begin(e)"],
  // an accepted entry may vanish from the list unnoticed
  'no-tamper': ['match/fold.js', 'if (gone.length || moved.length) {', 'if (false) {'],
  // a seat's desync entry is taken and the match plays on
  'desync-ignored': ['match/fold.js', "      this.accept(e)\n      return this.halt('desync', ", "      return this.accept(e)\n      this.halt('desync', "],
  // no turn check: a seat not waited on is judged by legal() alone
  'no-turn': ['match/fold.js', "    if (!P.seats.includes(e.s)) return this.reject(e, `turn: seat ${e.s} has no decision to make`)\n", ''],
  // no hash check: a peer whose fold drifted plays on in another battle
  'no-hash': ['match/fold.js', '    if (!SIMULTANEOUS.includes(P.k) && e.h !== stateHash(G)) return this.freeze(e)\n', ''],
  // a hash apart refuses the entry instead of freezing the match (§0.2 #2)
  'hash-rejects': ['match/fold.js', 'e.h !== stateHash(G)) return this.freeze(e)', "e.h !== stateHash(G)) return this.reject(e, 'hash: mismatch')"],
  // legal() before the hash: a drifted peer refuses the author's moves one
  // by one into a stall, unreported
  'legal-before-hash': ['match/fold.js', '    if (!SIMULTANEOUS.includes(P.k) && e.h !== stateHash(G)) return this.freeze(e)\n    const body = bodyOf(e)\n    const why = legal(G, e.s, body)\n    if (why) return this.reject(e, `illegal: ${why}`)\n', '    const body = bodyOf(e)\n    const why = legal(G, e.s, body)\n    if (why) return this.reject(e, `illegal: ${why}`)\n    if (!SIMULTANEOUS.includes(P.k) && e.h !== stateHash(G)) return this.freeze(e)\n'],
  // the head after a simultaneous decision is the entry that closed it
  // alone: a same-seat fork's loser writes on after the close into a desync
  'closing-id-head': ['match/fold.js', '        this.last = closed(open)\n', ''],
  // a tamper freeze thaws once the entry comes back after an insert
  'tamper-thaws': ['match/fold.js', "    if (this.status === 'tamper') return { events, reset: false, undone: 0 }\n", ''],
  // decode lets a non-finite number throw (1e999): one peer's junk crashes
  // every peer's fold
  'decode-throws': ['match/envelope.js', "  let canon\n  try {\n    canon = canonicalJSON(e)\n  } catch {\n    return { bad: 'not canonical JSON', id }\n  }\n  if (canon !== text)", '  if (canonicalJSON(e) !== text)'],
  // (R8's fixer, round 2) an over match is deaf to a seat's desync: the
  // author of an entry found apart that ended its match (or whose desync
  // lands after the end) never freezes
  'over-ignores-desync': ['match/fold.js', "      if (e.t === 'desync' || e.t === 'final') return this.outOfBand(e)\n", "      if (e.t === 'final') return this.outOfBand(e)\n"],
  // an over match is deaf to a seat's hashed command on the head it ended
  // at: a peer whose match ended where another's went on never says so
  // (N2) the closing check: a device whose match is over never says so; a
  // final's hash never compared; an over match deaf to a final (the drift
  // inside the last entry goes unseen)
  'silent-final': ['match/session.js', "    return !this.append({ t: 'final' }, { s: seat, p: this.folder.last, h: stateHash(this.G) })\n", '    return false\n'],
  'final-unchecked': ['match/fold.js', '    if (e.h !== stateHash(this.G)) return this.freeze(e)\n', ''],
  'over-ignores-final': ['match/fold.js', "      if (e.t === 'desync' || e.t === 'final') return this.outOfBand(e)\n", "      if (e.t === 'desync') return this.outOfBand(e)\n"],
  'over-ignores-hash': ['match/fold.js', '      if (e.h !== undefined && e.p === this.last && e.t !== \'concede\' && seat?.ctrl === \'human\' && e.d === seat.dev && e.h !== stateHash(this.G)) return this.freeze(e)\n', ''],
  // tamper by ids alone: another body under an accepted id refolds silently
  'tamper-by-id': ['match/fold.js', 'const gone = this.accepted.filter((id) => !now.has(id) || !same(now.get(id).e, was.get(id).e))', 'const gone = this.accepted.filter((id) => !now.has(id))'],
  // a charge's end taken for a simultaneous decision: written and folded
  // with no hash (§0.2 #3 requires one)
  'chargeEnd-simultaneous': ['match/fold.js', "export const SIMULTANEOUS = Object.freeze(['deploy', 'roundLimit'])", "export const SIMULTANEOUS = Object.freeze(['deploy', 'roundLimit', 'chargeEnd'])"],
  // the cap moved by one (§2.6: 5,000 entries)
  'cap-moved': ['match/fold.js', 'export const MAX_ENTRIES = 5000', 'export const MAX_ENTRIES = 5001'],
  // (R8's fixer, round 3) the Session folds a change that reaches the store
  // while one is being folded nested inside it (R8b: a sink's own submits
  // are queued, so an entry appended from elsewhere, a sync message landing
  // mid-change): the rest of the list pushed twice, or Folder.sync throws
  'session-reentrant': ['match/session.js', '    if (this.folding) {\n      this.again = true\n      return\n    }\n', ''],
  // the Folder lets sync be entered again from the events it hands on
  'sync-reentrant': ['match/fold.js', 'if (this.syncing) throw', 'if (false) throw'],
  // a store that throws mid-fold leaves the Session folding for ever:
  // every later change queued and never written
  // (F4) the round limit's vote taken for a single seat's decision: each
  // seat's say written hashed on the one head, so two said at once fork
  'roundLimit-hashed': ['match/fold.js', "export const SIMULTANEOUS = Object.freeze(['deploy', 'roundLimit'])", "export const SIMULTANEOUS = Object.freeze(['deploy'])"],
  // each say logged as it folds: the battle's log then depends on which of
  // two says made at once came first
  'vote-logged-as-said': ['core/commands.js', "    emit(G, 'vote', { seat, more })\n", "    log(G, seat, `${seat} ${more}`)\n    emit(G, 'vote', { seat, more })\n"],
  // a seat's say doesn't close its part of the vote: the vote never ends
  'vote-never-closes': ['core/commands.js', '    const left = P.seats.filter((s) => s !== seat)\n', '    const left = P.seats\n'],
  'session-no-finally': ['match/session.js', '    } finally {\n      this.folding = false\n    }\n', '    } finally {}\n    this.folding = false\n'],
  // a single seat's decision answered with no hash is played unchecked
  'missing-h-accepted': ['match/fold.js', 'if (!SIMULTANEOUS.includes(P.k) && e.h !== stateHash(G)) return this.freeze(e)', 'if (!SIMULTANEOUS.includes(P.k) && e.h !== undefined && e.h !== stateHash(G)) return this.freeze(e)'],
  // after the end, any device's hashed command on the final head freezes
  // the match (a spectator forges every peer's result into a desync)
  'over-any-device': ['match/fold.js', "seat?.ctrl === 'human' && e.d === seat.dev && e.h !== stateHash(this.G)) return this.freeze(e)", "seat?.ctrl === 'human' && e.h !== stateHash(this.G)) return this.freeze(e)"],
  // only a newer build's start is skew: an older one's is folded under
  // these rules
  'core-newer-only': ['match/fold.js', 'if (e.core !== CORE_VERSION || e.rules !== RULES_ID) {', 'if (e.core > CORE_VERSION || e.rules !== RULES_ID) {'],
  // tamper by content alone: a copy inserted before its own head undoes
  // the entry quietly
  'tamper-ignores-order': ['match/fold.js', 'if (gone.length || moved.length) {', 'if (gone.length) {'],
  // a human seat may name a device no entry can carry: the match waits on
  // it for ever
  'long-device-seated': ['match/fold.js', "x?.ctrl === 'human' && !isName(x.dev)", "x?.ctrl === 'human' && (typeof x.dev !== 'string' || !x.dev)"],
  // a start made inert by another device's open says nothing
  'opener-silent': ['match/fold.js', "      if (e.t === 'start') this.error = ", "      if (false) this.error = "],
  // why this device's start was never written outlives the match it
  // didn't start
  'error-lingers': ['match/session.js', "    if (this.status !== 'lobby') this.unsent = null\n", ''],
  // the start drops N2's seed reveal
  'start-drops-a': ['match/session.js', "rules: RULES_ID, setup, a }", "rules: RULES_ID, setup }"],
  // (R8b) no single flight: a submit from a sink's callback is written
  // there and then, on the match as it stands mid-change (R8's Session):
  // stale once a later entry of the change moves the seat's head, and a
  // body the change made illegal written all the same
  // a sink's error ends the loop at once, as before R8b's review: a body it
  // queued is stranded and the change never settles
  'call-rethrows': ['match/session.js', '      this.failed ??= err\n      return false\n', '      throw err\n'],
  'no-queue': ['match/session.js', '    if (this.folding) {\n      this.queue.push({ seat, body: { ...body } })\n      return\n    }\n', ''],
  // a queued body written without being held to legal() again: one the
  // change in hand made illegal is written, and refused by every peer
  'drain-unchecked': ['match/session.js', 'const why = this.legal(seat, body) ?? this.send(seat, body)', 'const why = this.send(seat, body)'],
  // a queued body dropped without a word to the sink
  'drop-silent': ['match/session.js', '    if (why) this.call(() => this.sink?.dropped?.(seat, body, why, this))\n', ''],
  // the sink told the Session settled before its queue drained: an
  // autopilot answering there answers again what it has queued
  'settled-early': ['match/session.js', `          if (this.queue.length) this.drain()
          else if (this.dirty) {
            this.dirty = false
            this.call(() => this.sink?.settled?.(this))
          } else break`, `          if (this.dirty) {
            this.dirty = false
            this.call(() => this.sink?.settled?.(this))
          } else if (this.queue.length) this.drain()
          else break`],
  // the sink never told a change settled: whoever answers there waits for
  // ever
  'no-settled': ['match/session.js', '            this.call(() => this.sink?.settled?.(this))\n', ''],
  // the Folder lets push be entered again (from the events it hands on, or
  // from the match's onTrace): an entry lands in the middle of a fold
  'push-reentrant': ['match/fold.js', "    if (this.busy) throw new Error('Folder.push is not reentrant", "    if (false) throw new Error('Folder.push is not reentrant"],
  // the refold is swapped in only after it is shown: a sink handed its
  // events reads the old match (or none)
  'late-swap': ['match/fold.js', `      if (next.G) Object.assign(next.G, { out: this.opts.out ? [] : null, onTrace: this.opts.onTrace })
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
`, `      const out = this.opts.out ? [] : null
      if (next.G) Object.assign(next.G, { out, onTrace: this.opts.onTrace })
      else Object.assign(next.opts, { out, onTrace: this.opts.onTrace })
    }
    if (!old.length) show()
    for (let i = from; i < N; i++) {
      const e = entries[i]
      if (showing) {
        next.step(e, events, each)
        continue
      }
      const k = next.accepted.length
      next.push(e)
      if (apart || next.accepted.length === k) continue
      if (next.accepted[k] !== old[k]) apart = true
      else if (k + 1 === old.length) show()
    }
    const reset = !showing
    if (reset) show()
    Object.assign(this, { ...next, opts: this.opts, syncing: true })
`],
}

if (a['self-test']) {
  const work = join(tmpdir(), `tails-and-scales-merge-test-${process.pid}`)
  const load = [
    { kind: 'plain', id: 'hotseat-late-8', seed: 1 }, { kind: 'fork', id: 'hotseat-late-8', seed: 2 }, { kind: 'concede', id: 'hotseat-late-8', seed: 3 },
    { kind: 'fork', id: 'bushtail-random-6', seed: 2 }, { kind: 'fork', id: 'hotseat-random-2', seed: 2 }, { kind: 'concede', id: 'serpent-random-2', seed: 3 },
    { kind: 'plain', id: 'hotseat-aggressive-103', seed: 1 }, { kind: 'ai', id: '64-89', seed: 1 },
    { kind: 'cap', id: 'bushtail-random-6' }, { kind: 'edges', id: 'bushtail-random-6' }, { kind: 'drill', how: 'hypot', id: 'hotseat-late-8', odd: 1 },
    { kind: 'forks', id: 'hotseat-late-8' }, { kind: 'forks', id: 'hotseat-random-2' }, { kind: 'votes', id: 'hotseat-late-8' },
    { kind: 'drill', how: 'late', id: 'hotseat-late-8' }, { kind: 'drill', how: 'deaf', id: 'hotseat-late-8' }, { kind: 'drill', how: 'closing', id: 'hotseat-aggressive-125' },
    { kind: 'reenter', id: 'hotseat-late-8', seed: 1 }, { kind: 'reenter', id: 'hotseat-random-4', seed: 1 }, { kind: 'reenter', id: 'bushtail-random-6', seed: 1 },
  ]
  const clean = await run(copyCode(dir, join(work, 'unbroken')), load, { quiet: true })
  if (clean.length) {
    console.log(`merge-sim self-test: the unbroken copy fails the same workload, so no mutant can be judged: ${clean[0].error}`)
    rmSync(work, { recursive: true, force: true })
    process.exit(1)
  }
  console.log(`  unbroken               passes (${load.length} scenarios)`)
  let missed = 0
  for (const [name, [file, from, to]] of Object.entries(MUTANTS)) {
    const pkg = copyCode(dir, join(work, name))
    const f = join(pkg, file)
    const src = readFileSync(f, 'utf8')
    if (src.split(from).length !== 2) {
      console.log(`  ${name.padEnd(22)} STALE: "${from.trim().slice(0, 50)}" isn't in ${file} exactly once`)
      missed++
      continue
    }
    writeFileSync(f, src.replace(from, to))
    const bad = await run(pkg, load, { quiet: true })
    console.log(`  ${name.padEnd(22)} ${bad.length ? `caught: ${bad[0].error.slice(0, 150)}` : 'MISSED'}`)
    if (!bad.length) missed++
    rmSync(pkg, { recursive: true, force: true })
  }
  // and a broken store (merge-sim's own, as N1's AutomergeStore must not
  // be): each entry decoded once per index, so an insert before folded
  // entries hands the Folder the old ones at shifted places, which it takes
  // for a prefix
  {
    const bad = await run(copyCode(dir, join(work, 'store')), load, { quiet: true, store: 'index' })
    console.log(`  ${'store-caches-by-index'.padEnd(22)} ${bad.length ? `caught: ${bad[0].error.slice(0, 150)}` : 'MISSED'}`)
    if (!bad.length) missed++
  }
  rmSync(work, { recursive: true, force: true })
  console.log(missed ? `\nmerge-sim self-test FAILED: ${missed} mutant(s) missed or stale` : `\nmerge-sim self-test passed: all ${Object.keys(MUTANTS).length + 1} mutants caught (the store's included)`)
  process.exit(missed ? 1 : 0)
}

console.log(`merge-sim: the Folder of ${dir}`)
const list = tasks({ only: a.only, seeds: SEEDS })
const bad = await run(dir, list)
for (const b of bad) if (!b.r) console.log(`  FAIL ${b.error}`)
// (what passed: only what ran)
const ran = new Set(list.map((t) => t.kind))
const said = ['every peer folds the same list to the same accepted, refused and hashed match, the single-process fold of it, whatever order the entries reached it in']
if (ran.has('cap')) said.push('a flooded log freezes alike everywhere')
if (ran.has('edges')) said.push("the Folder's edges hold")
if (ran.has('forks')) said.push("a same-seat fork's loser is stale everywhere")
if (ran.has('votes')) said.push("both seats' say at the round limit folds alike in either order")
if (ran.has('drill')) said.push('a peer whose maths drifted, early or late, freezes with the others at the same entry, reported (and, drifting inside the last entry, every peer on a final: N2\'s closing check)')
const skipped = ['cap', 'edges', 'forks', 'votes', 'drill'].filter((k) => !ran.has(k))
console.log(bad.length ? `\nmerge-sim FAILED: ${bad.length} problem(s)` : `\nmerge-sim passed: ${said.join('; ')}${skipped.length ? ` (not run: ${skipped.join(', ')}${a.only ? ', as --only names battles' : ''})` : ''}`)
process.exit(bad.length ? 1 : 0)
