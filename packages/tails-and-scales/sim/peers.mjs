// P-peers (DESIGN §4's gate, N1): the match layer over real Automerge.
// merge-sim (P-merge) holds the Folder to agreement over a list ordered as
// Automerge orders one; this check plays the corpus logs over the real
// thing: automerge-repo 2.5.6 repos in one Node process, each peer's
// Session (match/session.js) folding its own replica of one document's log
// through the AutomergeStore (net/automerge-store.js). The repos are linked
// in a full mesh by MessageChannelNetworkAdapter, over ports that deliver
// each message after a random delay (in order per direction, as a
// MessagePort does), on the repo's own schedule (it sends a peer what
// changed at most every 100 ms). Each peer acts on its own view as soon as
// it holds a decision, after a random pause, so the seats' deployments
// interleave, concurrent inserts land before entries a peer has folded (its
// Folder folds again), and a second device on one seat forks. The schedule
// is real time, so no two runs are alike; what is judged holds for every
// one.
//
// Scenarios, per corpus human log:
//   pair   its human seats' peers (a vs-AI log: its seat and a spectator):
//          two peers, the actor ids rising with the peer (seat 0's lowest)
//   trio   the same and a spectator more: three peers, the actor ids the
//          other way round (seat 0's highest), so every concurrent insert
//          is ordered the other way
//   fork   (hotseat logs) seat 0 played from two tabs (two peers of one
//          device, each playing the log's commands) and seat 1's peer:
//          three peers, same-seat forks, the loser stale
//   auto   as pair, but each seat answers only from inside its Session's
//          sink, in `settled`, as an autopilot does: the log's next command
//          and, when it is legal already, the one after it, two queued in
//          one call (the Session writes the second on the head the first
//          leaves, so the store must take a write made from inside a fold)
// and, for one hotseat log, tamper: a peer puts the log anew (a string)
// part way through, and every peer's match must freeze, 'tamper'.
// and the AI pairs (--ai N of them, default 3): a spectator writes the
// start and a second one joins.
//
// Once the network is quiet (nothing in flight, nothing changed for a
// while, every peer's document at the same heads): every peer's log holds
// the same texts; every peer's Folder agrees on its status, accepted ids,
// rejected entries and stateHash, and each is the single-process fold of
// that list (a fresh Folder); every peer's Folder pushed each entry once;
// the match is over and every peer's match traces the single-process
// fold's, which is the corpus log's own (sim/run.mjs foldJob); every
// peer's view (its sink's events folded into a mirror, snapped on a reset)
// is project(G); each accepted seat command carries `h` exactly where §0.2
// #3 says (one for a phase and a charge's end, none for the deployment and
// the round limit's vote); no seat has two accepted commands after the same
// head. In pair, trio and auto nothing is refused (and over the run some
// auto seat queued two commands in one call); in fork every refused entry
// is a seat's command that lost to a tab's (stale, no longer its turn, or
// inert past the end: a tab's loser, or one the other seat wrote having
// seen only the loser), sent again on the winner's head. Over the run, entries must have landed before entries
// a peer had folded, and a fork must have reset some peer's view.
//
// It also weighs the document: each scenario's saved bytes, and those of a
// synthetic log of 465 entries (the start, then 464 of the corpus logs'
// commands, each its own change; §4.2.1's estimate for a Grand battle's
// log, 50-100 KB).
//
//   node sim/peers.mjs [--only <kinds, modes or ids>] [--ai N] [--dir <packageDir> | --ref <ref>]
//   node sim/peers.mjs --self-test   each broken copy of the store in MUTANTS
//                                    must fail it, after the unbroken passes
//
// One child process per scenario, up to one per CPU. Exit 0 when every
// check holds (the self-test: when every mutant is caught), 1 otherwise, 2
// on bad arguments.
import { parseArgs } from 'node:util'
import { spawn } from 'node:child_process'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { readFileSync, writeFileSync, rmSync, symlinkSync, existsSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadCorpus, select, pool, CPUS, copyCode } from './lib.mjs'
import { foldJob, jobSetup, differ } from './run.mjs'
import { mulberry32 } from './oracle/human-bot.mjs'
import { codeDir, PKG } from './oracle/pin.mjs'

let a
try {
  ({ values: a } = parseArgs({ options: { only: { type: 'string' }, ai: { type: 'string' }, dir: { type: 'string' }, ref: { type: 'string' }, child: { type: 'string' }, 'self-test': { type: 'boolean' } } }))
} catch (e) {
  console.error(`peers: ${e.message}\nusage: node sim/peers.mjs [--only <kinds, modes or ids>] [--ai N] [--dir <packageDir> | --ref <ref>] | --self-test`)
  process.exit(2)
}
const AI = a.ai === undefined ? 3 : Number(a.ai)
if (!Number.isInteger(AI) || AI < 0) {
  console.error(`peers: --ai takes a whole number, not ${a.ai}`)
  process.exit(2)
}
const dir = a.dir ? resolve(a.dir) : codeDir(a.ref ?? 'WORKTREE')
const HASHED = ['phase', 'chargeEnd'], UNHASHED = ['deploy', 'roundLimit']
// a peer's pause before it acts on a decision (ms), a link's delay (ms), how
// long the network stays quiet before it is judged settled, and how long a
// run may go without a change before it is called stalled
const THINK = 30, LAG = 40, QUIET = 400, STALL = 15000
// (at a decision both seats answer at once, the deployment and the round
// limit's vote, a longer pause, so the two seats' answers overlap)
const THINK_TOGETHER = 250

// ── The network ─────────────────────────────────────────────────────────────
// A link between two peers: two ends, each the MessagePort subset
// MessageChannelNetworkAdapter uses, each message delivered (a structured
// clone) after a random delay, never before an earlier one the same way.
class Link {
  constructor(rand) {
    this.rand = rand
    this.inflight = 0
    this.ends = [0, 1].map((i) => this.end(i))
  }

  end(i) {
    const link = this, listeners = []
    let last = 0
    return {
      listeners,
      addEventListener: (type, fn) => type === 'message' && listeners.push(fn),
      removeEventListener: () => {},
      start: () => {},
      close: () => {},
      postMessage(data) {
        const other = link.ends[1 - i], copy = structuredClone(data)
        const at = Math.max(last, Date.now() + link.rand() * LAG)
        last = at
        link.inflight++
        setTimeout(() => {
          link.inflight--
          for (const fn of other.listeners) fn({ data: copy })
        }, at - Date.now())
      },
    }
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
// an actor id that sorts by `rank` (Automerge orders concurrent inserts
// at one place by it, the higher first)
const actorOf = (rank) => rank.toString(16).padStart(2, '0').repeat(16)

// ── A peer ──────────────────────────────────────────────────────────────────
class Peer {
  constructor(M, { name, seats = [], dev, script, reactive = false }) {
    Object.assign(this, { M, name, seats, dev, script, reactive })
    // (reactive: commands sent from settled, two queued in one call, and
    // queued ones the Session dropped)
    this.sent = 0
    this.pairs = 0
    this.drops = 0
    this.view = null
    this.resets = 0
    this.undone = 0
    this.insertsBefore = 0
    this.readyAt = 0
  }

  // Its replica: the handle (its actor set to `actor`), the store and the
  // Session; the inserts that land before entries it holds counted.
  open(handle, actor, rand) {
    const { M } = this
    handle.update((d) => M.A.clone(d, { actor }))
    this.handle = handle
    this.store = new M.Store(handle)
    // (an insert into the log at a place before its end, the length as
    // each patch found it)
    let length = this.store.length
    handle.on('change', ({ patches }) => {
      for (const p of patches) {
        if (p.path[0] !== 'log' || p.action !== 'insert') continue
        if (p.path[1] < length) this.insertsBefore++
        length += p.values.length
      }
    })
    const start = (G) => ({ ...M.mirror.project(G), stage: 'title', owners: G.objectives.map(() => -1), chunks: {} })
    this.session = new M.S.Session({
      store: this.store, localSeats: this.seats, dev: this.dev, rand: () => Math.floor(rand() * 1e9).toString(36),
      onTrace: (line, G) => (this.view ??= start(G)),
      sink: {
        // handed an entry's events, the Session is the match they lead to
        events: (events, ses) => {
          this.view ??= start(ses.G)
          for (const e of events) M.mirror.applyEvent(this.view, e)
          const d = differ(this.view, M.mirror.project(ses.G))
          if (d) throw new Error(`${this.name}'s sink was handed events of another match than the Session's (${ses.accepted.length} accepted): ${d}`)
        },
        reset: (G, ses, { undone }) => {
          this.resets++
          this.undone += undone
          this.view = M.mirror.project(G)
        },
        settled: (ses) => this.reactive && this.react(ses),
        dropped: (seat, body, why) => {
          if (!this.reactive) throw new Error(`${this.name}'s Session dropped ${JSON.stringify(body)}, which it never queued: ${why}`)
          this.drops++
        },
      },
    })
  }

  get G() {
    return this.session.G
  }

  // (auto) the seats' next commands from inside the sink's settled, as an
  // autopilot answers: the next, and the one after it if it is legal
  // already, both queued in one call
  react(ses) {
    if (ses.status !== 'live') return
    for (const s of this.seats) {
      if (!ses.G.pending?.seats.includes(s)) continue
      const first = this.next(s)
      if (!first || ses.legal(s, first) !== null) continue
      ses.submit(s, first)
      this.sent++
      const second = this.next(s, 1)
      if (second && ses.legal(s, second) === null) {
        ses.submit(s, second)
        this.sent++
        this.pairs++
      }
    }
  }

  // the seat's command the log plays next (or `ahead` after it): its
  // accepted commands so far, by any device, count it off
  next(seat, ahead = 0) {
    const byId = new Map()
    for (const e of this.store.entries()) if (!e.bad && !byId.has(e.id)) byId.set(e.id, e)
    // (an accepted id gone from the list counts nothing: the log put anew,
    // which the Session hears a microtask later)
    const done = this.session.accepted.filter((id) => {
      const e = byId.get(id)
      return e?.s === seat && e.t !== 'concede' && e.t !== 'desync'
    }).length
    return this.script?.[seat]?.[done + ahead] ?? null
  }

  // a decision of a seat played here, with the log's next command for it
  // legal now in this peer's view
  canAct() {
    if (this.reactive || this.session?.status !== 'live') return null
    for (const s of this.seats) {
      if (!this.G.pending?.seats.includes(s)) continue
      const body = this.next(s)
      if (body && this.session.legal(s, body) === null) return { s, body }
    }
    return null
  }
}

// ── One scenario ────────────────────────────────────────────────────────────
// { kind: 'pair' | 'trio' | 'fork' | 'ai', id, seed }
async function scenario(M, task) {
  const it = select(loadCorpus().items, task.id)[0]
  const where = `${it.id} (${task.kind})`
  const rand = mulberry32(task.seed)
  const setup = jobSetup(it.job)
  const humans = setup.seats.map((x, s) => (x.ctrl === 'human' ? s : -1)).filter((s) => s >= 0)
  const script = Object.fromEntries(humans.map((s) => [s, it.job.entries.filter((e) => e.s === s).map(({ s: _, ...b }) => b)]))
  // the peers: a seat's own device each (fork: seat 0's on two tabs), and
  // spectators
  const specs = []
  if (task.kind === 'ai') specs.push({ name: 'host', dev: 'h' }, { name: 'watcher', dev: 'w' })
  else {
    for (const s of humans) specs.push({ name: `seat ${s}`, seats: [s], dev: `d${s}`, script, reactive: task.kind === 'auto' })
    if (task.kind === 'fork') specs.splice(1, 0, { name: 'seat 0, tab 2', seats: [0], dev: 'd0', script })
    if (humans.length === 1 || task.kind === 'trio') specs.push({ name: humans.length === 1 && task.kind === 'trio' ? 'watcher 2' : 'watcher', dev: 'w' })
    if (humans.length === 1 && task.kind === 'trio') specs.splice(1, 0, { name: 'watcher', dev: 'w1' })
  }
  const peers = specs.map((x) => new Peer(M, x))
  const n = peers.length
  // the repos, in a full mesh of lagging links
  const links = []
  const adapters = peers.map(() => [])
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const l = new Link(rand)
      links.push(l)
      adapters[i].push(new M.MessageChannelNetworkAdapter(l.ends[0]))
      adapters[j].push(new M.MessageChannelNetworkAdapter(l.ends[1]))
    }
  }
  const repos = peers.map((p, i) => new M.Repo({ network: adapters[i], peerId: `peer${i}`, sharePolicy: async () => true }))
  try {
    const first = repos[0].create(M.matchDoc())
    const handles = [first, ...(await Promise.all(repos.slice(1).map((r) => r.find(first.url))))]
    // the actor ids, rising with the peer, or (trio) falling
    peers.forEach((p, i) => p.open(handles[i], actorOf(task.kind === 'trio' ? n - i : i + 1), rand))
    // the start, from the first peer (the lowest human seat's, or the host)
    const devs = { ...setup, seats: setup.seats.map((x, s) => (x.ctrl === 'human' ? { ...x, dev: `d${s}` } : x)) }
    peers[0].session.start(devs)
    let last = Date.now(), steps = 0
    for (const h of handles) h.on('change', () => (last = Date.now()))
    const heads = (p) => M.A.getHeads(p.handle.doc()).slice().sort().join()
    let tampered = false
    for (;;) {
      // (tamper) part way through, the last peer puts the log anew
      if (task.kind === 'tamper' && !tampered && peers.at(-1).store.length >= 40) {
        peers.at(-1).handle.change((d) => {
          d.log = 'junk'
        })
        tampered = true
      }
      for (const p of peers) {
        if (Date.now() < p.readyAt) continue
        const act = p.canAct()
        if (!act) continue
        const together = M.F.SIMULTANEOUS.includes(p.G.pending.k)
        p.session.submit(act.s, act.body)
        p.readyAt = Date.now() + rand() * (together ? THINK_TOGETHER : THINK)
        steps++
      }
      const quiet = links.every((l) => l.inflight === 0) && Date.now() - last > QUIET
      if (quiet && peers.every((p) => !p.canAct() && heads(p) === heads(peers[0]))) break
      if (Date.now() - last > STALL) {
        const at = peers.map((p) => `${p.name}: ${p.session.status}, ${p.store.length} entries, waiting on ${JSON.stringify(p.G?.pending ?? null)}`).join('; ')
        throw new Error(`${where}: stalled, nothing changed for ${STALL / 1000} s (${at})`)
      }
      await sleep(2)
    }
    if (task.kind === 'tamper') {
      const not = peers.filter((p) => p.session.status !== 'tamper')
      if (!tampered || not.length) throw new Error(`${where}: ${tampered ? `the log put anew, ${not.map((p) => `${p.name}'s match is ${p.session.status}`).join(', ')}, not tamper` : 'the run never reached the tamper'}`)
      return { where, peers: peers.length, entries: peers[0].store.length, steps, refused: {}, inserts: 0, resets: 0, undone: 0, pairs: 0, bytes: M.A.save(peers[0].handle.doc()).byteLength, tamper: true }
    }
    return judge(M, peers, it, task, where, steps)
  } finally {
    for (const r of repos) await r.shutdown?.()
  }
}

// Every peer against the others and the single-process fold.
function judge(M, peers, it, task, where, steps) {
  const [p0] = peers
  const texts = p0.store.texts()
  for (const p of peers) {
    const t = p.store.texts()
    if (t.length !== texts.length || t.some((x, i) => x !== texts[i])) throw new Error(`${where}: ${p.name}'s log isn't ${p0.name}'s (${t.length} and ${texts.length} entries)`)
    if (p.session.folder.pushed.length !== texts.length) throw new Error(`${where}: ${p.name}'s Folder pushed ${p.session.folder.pushed.length} entries for a log of ${texts.length}`)
  }
  // the final list folded afresh, each entry's fate, and the kind of
  // decision each answered
  const list = texts.map((t) => M.E.decode(t))
  const ref = new M.F.Folder({ out: null })
  const fate = [], answered = []
  for (const e of list) {
    const k = ref.accepted.length, r = ref.rejected.length
    answered.push(ref.status === 'live' ? ref.G.pending?.k ?? null : null)
    ref.push(e)
    fate.push(ref.accepted.length > k ? 'accepted' : ref.rejected.length > r ? ref.rejected[r].why.split(':')[0] : 'frozen')
  }
  const sig = (f) => JSON.stringify({ status: f.status, accepted: f.accepted, rejected: f.rejected, hash: f.G ? M.core.stateHash(f.G) : null })
  for (const p of peers) {
    if (sig(p.session.folder) !== sig(ref)) {
      const f = p.session.folder, i = f.accepted.findIndex((x, j) => x !== ref.accepted[j])
      throw new Error(`${where}: ${p.name} disagrees with the single-process fold: status ${f.status}/${ref.status}, accepted ${f.accepted.length}/${ref.accepted.length} (first apart ${i}), rejected ${f.rejected.length}/${ref.rejected.length}, hash ${f.G && M.core.stateHash(f.G)}/${ref.G && M.core.stateHash(ref.G)}`)
    }
  }
  if (ref.status !== 'over') throw new Error(`${where}: the match ends ${ref.status}, not over${ref.report ? ` (${JSON.stringify({ at: ref.report.at, theirs: ref.report.theirs, mine: ref.report.mine })})` : ''}`)
  // every peer's match traces the fold, which is the corpus battle's
  const trace = ref.G.journal.trace
  for (const p of peers) if (p.G.journal.trace.join('\n') !== trace.join('\n')) throw new Error(`${where}: ${p.name}'s match traces another battle than the single-process fold`)
  const corpus = foldJob(M.core, it.job, { match: M.folding })
  if (corpus.error) throw new Error(`${where}: the corpus log folds short in one process: ${corpus.error.split('\n')[0]}`)
  if (trace.join('\n') !== corpus.trace.join('\n')) {
    const i = trace.findIndex((l, k) => l !== corpus.trace[k])
    throw new Error(`${where}: the accepted entries trace another battle than the corpus log from line ${i + 1}: ${(trace[i] ?? '(ended)').slice(0, 80)} | ${(corpus.trace[i] ?? '(ended)').slice(0, 80)}`)
  }
  // what each peer shows is its match
  for (const p of peers) {
    const d = differ(p.view, M.mirror.project(p.G))
    if (d) throw new Error(`${where}: ${p.name}'s view (its sink's events, snapped on ${p.resets} reset(s)) isn't its match: ${d}`)
  }
  // §0.2 #3's hashes, one accepted command per seat and head, and what was
  // refused
  const heads = new Set(), refused = {}
  list.forEach((e, i) => {
    if (fate[i] !== 'accepted') {
      refused[fate[i]] = (refused[fate[i]] ?? 0) + 1
      // (in a fork any seat's command may lose: a tab's loser, and one the
      // other seat wrote having seen only the loser, both stale once the
      // winner is folded before them; no longer the seat's turn where the
      // winner ended its part in the decision; or inert, a tab's last
      // command landing after the winner ended the battle)
      if (task.kind !== 'fork' || e.s < 0 || !['stale', 'turn', 'inert'].includes(fate[i])) throw new Error(`${where}: ${e.t} for seat ${e.s} from ${e.d} was ${fate[i] === 'frozen' ? 'met with a frozen match' : `refused as ${fate[i]}`}, which ${task.kind === 'fork' ? 'only a seat\'s stale, out-of-turn or inert command may be' : 'no entry here may be'}`)
      return
    }
    if (e.s < 0) return
    const want = HASHED.includes(answered[i]) ? true : UNHASHED.includes(answered[i]) ? false : null
    if (want === null) throw new Error(`${where}: the accepted entry ${e.id} (${e.t}) answers a ${answered[i]} decision, which §0.2 #3 doesn't name`)
    if ((e.h !== undefined) !== want) throw new Error(`${where}: the accepted entry ${e.id} (${e.t}, answering a ${answered[i]} decision) carries ${want ? 'no hash' : 'a hash'}`)
    const key = `${e.s}@${e.p}`
    if (heads.has(key)) throw new Error(`${where}: two accepted commands of seat ${e.s} after the same head ${e.p}`)
    heads.add(key)
  })
  return {
    where, peers: peers.length, entries: list.length, steps, refused,
    inserts: peers.reduce((s, p) => s + p.insertsBefore, 0), resets: peers.reduce((s, p) => s + p.resets, 0), undone: peers.reduce((s, p) => s + p.undone, 0),
    pairs: peers.reduce((s, p) => s + p.pairs, 0), drops: peers.reduce((s, p) => s + p.drops, 0),
    bytes: M.A.save(p0.handle.doc()).byteLength,
  }
}

// The document of a synthetic log of `n` entries (§4.2.1's Grand estimate):
// the start, then the corpus human logs' commands in turn (a battle's worth
// of distinct units, cells and targets, not one log's repeated, which would
// compress past any real log), each an envelope as a device writes one (its
// seat's device, a fresh id, the previous entry as its head, a hash where
// one seat is waited on), appended in a change of its own; its saved bytes.
async function weigh(M, n = 465) {
  const { items } = loadCorpus()
  const human = items.filter((x) => x.kind === 'human')
  const setup = jobSetup(human[0].job)
  const devs = { ...setup, seats: setup.seats.map((x, s) => ({ ...x, dev: `d${s}` })) }
  const repo = new M.Repo({ network: [] })
  const h = repo.create(M.matchDoc())
  const store = new M.Store(h)
  const rand = mulberry32(465)
  const word = (k) => Array.from({ length: k }, () => Math.floor(rand() * 36).toString(36)).join('')
  let prev
  const put = (body, s, extra = {}) => {
    const id = `d${Math.max(s, 0)}.${store.length.toString(36)}.${word(6)}`
    store.append(M.E.encode(M.E.envelope(body, { id, s, d: `d${Math.max(s, 0)}`, ...extra })))
    prev = id
  }
  put({ t: 'start', core: M.core.CORE_VERSION, rules: M.core.RULES_ID, setup: devs }, -1)
  const cmds = human.flatMap((x) => x.job.entries)
  for (let i = 0; store.length < n; i++) {
    const { s, ...b } = cmds[i % cmds.length]
    put(b, s, { p: prev, h: ['place', 'deployed', 'vote'].includes(b.t) ? undefined : word(11) })
  }
  const bytes = M.A.save(h.doc()).byteLength, text = store.texts().reduce((t, x) => t + x.length, 0)
  await repo.shutdown?.()
  return { entries: store.length, bytes, text }
}

// ── The code under test ─────────────────────────────────────────────────────
async function modulesOf(pkg) {
  const imp = (f) => import(pathToFileURL(join(pkg, f)).href)
  // the repo first: its full entry initialises the wasm the store's slim
  // import shares
  const { Repo } = await import('@automerge/automerge-repo')
  const { MessageChannelNetworkAdapter } = await import('@automerge/automerge-repo-network-messagechannel')
  const A = await import('@automerge/automerge/slim')
  const [core, E, F, S, mirror, net] = await Promise.all(['core/index.js', 'match/envelope.js', 'match/fold.js', 'match/session.js', 'present/mirror.js', 'net/automerge-store.js'].map(imp))
  return { core, E, F, S, mirror, A, Repo, MessageChannelNetworkAdapter, Store: net.AutomergeStore, matchDoc: net.matchDoc, folding: { envelope: E, fold: F } }
}

if (a.child) {
  let out
  try {
    const task = JSON.parse(a.child), M = await modulesOf(dir)
    out = { ok: true, r: task.kind === 'weigh' ? await weigh(M) : await scenario(M, task) }
  } catch (e) {
    out = { ok: false, error: String(e?.stack ?? e).split('\n').slice(0, 3).join(' | ') }
  }
  process.stdout.write(JSON.stringify(out))
  process.exit(0)
}

// ── The run ─────────────────────────────────────────────────────────────────
const ME = fileURLToPath(import.meta.url)
function child(task, pkg) {
  return new Promise((done) => {
    const p = spawn(process.execPath, [ME, '--dir', pkg, '--child', JSON.stringify(task)], { stdio: ['ignore', 'pipe', 'pipe'] })
    let out = '', err = ''
    p.stdout.setEncoding('utf8')
    p.stderr.setEncoding('utf8')
    p.stdout.on('data', (d) => (out += d))
    p.stderr.on('data', (d) => (err += d))
    const timer = setTimeout(() => p.kill('SIGKILL'), 300000)
    p.on('close', () => {
      clearTimeout(timer)
      try {
        done(JSON.parse(out))
      } catch {
        done({ ok: false, error: `the child crashed or timed out: ${err.trim().split('\n').slice(0, 4).join(' / ') || out.slice(0, 200)}` })
      }
    })
  })
}

function tasks(only) {
  const { items } = loadCorpus()
  const chosen = select(items, only)
  const out = []
  let seed = 1
  for (const it of chosen.filter((x) => x.kind === 'human')) {
    for (const kind of ['pair', 'trio', 'auto', ...(it.mode === 'hotseat' ? ['fork'] : [])]) out.push({ kind, id: it.id, seed: seed++ })
  }
  const hot = chosen.find((x) => x.kind === 'human' && x.mode === 'hotseat')
  if (hot) out.push({ kind: 'tamper', id: hot.id, seed: seed++ })
  for (const it of chosen.filter((x) => x.kind === 'ai').slice(0, only === undefined ? AI : Infinity)) out.push({ kind: 'ai', id: it.id, seed: seed++ })
  return out
}

// Run the code in `pkg`: the problems, and the results.
async function run(pkg, list, { quiet = false } = {}) {
  const say = quiet ? () => {} : (s) => console.log(s)
  const bad = [], done = []
  await pool(list, Math.max(1, CPUS), async (task) => {
    const r = await child(task, pkg)
    if (!r.ok) {
      bad.push({ error: r.error })
      say(`  ${`${task.id} ${task.kind}`.padEnd(32)} FAIL ${r.error.slice(0, 300)}`)
      return
    }
    done.push(r.r)
    const x = r.r
    if (x.tamper) return say(`  ${`${task.id} ${task.kind}`.padEnd(32)} ok   ${x.peers} peers: the log put anew after ${x.steps} commands, every peer's match frozen, tamper`)
    say(`  ${`${task.id} ${task.kind}`.padEnd(32)} ok   ${x.peers} peers, ${x.entries} entries,${x.pairs ? ` ${x.pairs} pairs queued from settled${x.drops ? ` (${x.drops} dropped)` : ''},` : ''} ${x.inserts} landing before folded ones, ${x.resets} resets${x.undone ? ` (${x.undone} shown undone)` : ''}${Object.keys(x.refused).length ? `, refused ${Object.entries(x.refused).map(([k, v]) => `${k} ${v}`).join(', ')}` : ''}; ${(x.bytes / 1024).toFixed(1)} KB saved (${x.steps} commands sent)`)
  })
  // over the run: concurrent inserts landed before folded entries, and a
  // fork reset some peer's view
  if (!bad.length && list.some((t) => t.kind !== 'ai')) {
    if (!done.some((x) => x.inserts > 0)) bad.push({ error: 'no entry ever landed before entries a peer had folded: the run never met Automerge\'s concurrent inserts' })
    if (list.some((t) => t.kind === 'fork') && !done.some((x) => x.where.endsWith('(fork)') && x.resets > 0)) bad.push({ error: 'no fork ever reset a peer\'s view' })
    if (list.some((t) => t.kind === 'auto') && !done.some((x) => x.pairs > 0)) bad.push({ error: 'no auto seat ever queued two commands in one call: the Session\'s queue never wrote from inside a fold' })
  }
  return { bad, done }
}

// ── The self-test ───────────────────────────────────────────────────────────
// Broken copies of the store; the check must fail on each.
const MUTANTS = {
  // an insert anywhere taken for an append: the list apart from the
  // document's wherever an entry lands before folded ones
  'insert-at-end': ['net/automerge-store.js', 'this.list.splice(p.path[1], 0, ...p.values.map((v) => this.decoded(String(v))))', 'this.list.push(...p.values.map((v) => this.decoded(String(v))))'],
  // the Session's text encoded again: a JSON-quoted string every peer
  // refuses
  'append-encodes': ['net/automerge-store.js', "    const text = typeof entry === 'string' ? entry : encode(entry)\n", '    const text = encode(entry)\n'],
  // a change never told: the Session folds nothing after its start
  'silent': ['net/automerge-store.js', '    for (const fn of [...this.subs]) fn()\n', ''],
  // a peer's change told inside the handle's own change event, where a
  // write the Session makes is only queued: an autopilot's second command
  // written on a stale head
  'told-in-emit': ['net/automerge-store.js', '      if (!this.writing) queueMicrotask(() => this.tell())\n', '      if (!this.writing) this.tell()\n'],
  // decoded once per place (the cache the contract forbids): an insert
  // before folded entries hands out the old entries at their old places,
  // the inserted one at the end
  'cache-by-place': ['net/automerge-store.js', 'this.list.splice(p.path[1], 0, ...p.values.map((v) => this.decoded(String(v))))', '(this.list = this.texts().map((t, i) => this.list[i] ?? this.decoded(t)))'],
}
const SELF_TEST_ON = 'hotseat-late-8,serpent-random-1'

// a copy of the package that still finds the repo's node_modules
function copyWithModules(pkg, to) {
  copyCode(pkg, to)
  if (!existsSync(join(to, 'node_modules'))) symlinkSync(join(PKG, '..', '..', 'node_modules'), join(to, 'node_modules'))
  return to
}

if (a['self-test']) {
  const work = join(tmpdir(), `tails-and-scales-peers-${process.pid}`)
  const list = tasks(SELF_TEST_ON)
  const clean = await run(copyWithModules(dir, join(work, 'unbroken')), list, { quiet: true })
  if (clean.bad.length) {
    console.log(`peers self-test: the unbroken copy fails, so no mutant can be judged: ${clean.bad[0].error}`)
    rmSync(work, { recursive: true, force: true })
    process.exit(1)
  }
  console.log(`  unbroken               passes (${list.length} scenarios)`)
  let missed = 0
  for (const [name, [file, from, to]] of Object.entries(MUTANTS)) {
    const pkg = copyWithModules(dir, join(work, name))
    const f = join(pkg, file)
    const src = readFileSync(f, 'utf8')
    if (src.split(from).length !== 2) {
      console.log(`  ${name.padEnd(22)} STALE: "${from.trim().slice(0, 50)}" isn't in ${file} exactly once`)
      missed++
      continue
    }
    writeFileSync(f, src.replace(from, to))
    const { bad } = await run(pkg, list, { quiet: true })
    console.log(`  ${name.padEnd(22)} ${bad.length ? `caught: ${bad[0].error.slice(0, 150)}` : 'MISSED'}`)
    if (!bad.length) missed++
  }
  rmSync(work, { recursive: true, force: true })
  console.log(missed ? `\npeers self-test FAILED: ${missed} mutant(s) missed or stale` : `\npeers self-test passed: all ${Object.keys(MUTANTS).length} mutants caught`)
  process.exit(missed ? 1 : 0)
}

const list = tasks(a.only)
console.log(`peers: ${list.length} scenarios over real Automerge (automerge-repo, lagging MessageChannel links) on ${dir === PKG ? 'the working tree' : dir}`)
const t0 = Date.now()
const { bad, done } = await run(dir, list)
const w = await child({ kind: 'weigh' }, dir)
if (w.ok) console.log(`\nthe document of a synthetic ${w.r.entries}-entry log: ${(w.r.bytes / 1024).toFixed(1)} KB saved (its entries' texts ${(w.r.text / 1024).toFixed(1)} KB)`)
else bad.push({ error: `weighing the synthetic log: ${w.error}` })
for (const b of bad) console.log(`  FAIL ${b.error.slice(0, 400)}`)
const sum = (k) => done.reduce((s, x) => s + x[k], 0)
console.log(bad.length ? `\npeers FAILED: ${bad.length} problem(s)` : `\npeers passed: ${done.length} scenarios, ${sum('entries')} entries, ${sum('inserts')} landing before entries a peer had folded, ${sum('resets')} resets; every peer's document, fold and view agree, and are the corpus battle (${Math.round((Date.now() - t0) / 1000)} s)`)
process.exit(bad.length ? 1 : 0)
