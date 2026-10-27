// The replay's checks in Node (N3: DESIGN §2.7): app/replay.js driven over
// a stand-in flow, on every corpus battle's log (the human battles' as an
// online log: its open first, a stale entry slipped in after the third
// move; the AI battles' as one played alone).
//
//   scrub     the match a scrub to move k shows hashes as the battle did
//             right after its k-th move, for every k (sampled on long
//             battles); before the start, the table as it stood (the
//             start's setup, no match yet)
//   replay    watch from the start: the moves written one at a time hand on
//             exactly the battle's events, in order, and end on its match
//   live      a replay of a battle still going on, moves landing in the
//             battle meanwhile, plays them too, then shows the battle
//             itself (Live)
//   refold    the battle folded again under a replay (a concurrent insert
//             before a move the replay has played): the replay is made
//             again at its move and plays on to the battle's end
//   file      a battle's replay file opens again to its log, text for text,
//             and to its match; a file that isn't one is refused, saying
//             why
//   kept      (the tamper alarm across reloads) a Session given the
//             entries a page accepted (match/fold.js's knownOf) folds an
//             honest log as before, and freezes as tamper, with no match,
//             a log that lost one of them
//   logs      (F15) every battle-log line the page's sink hands on
//             (app/flow.js's, over the battle's Session) carries its
//             entry's place k among the moves: move k logged it (the
//             battle after move k - 1 is short of its `at`, after move k
//             reaches it, a traced line there the trace's own), a click
//             on it (the replay's before) shows the match after move
//             k - 1, the log made again after a snap (relog) stamps every
//             line alike, and a peek over a battle going on comes back to
//             it at Live and at ✕
//   undo      (F12) a human battle played alone: after every entry,
//             undoable() is exactly the rule (the last accepted a
//             placement, move or charge's end of the seat now deciding, no
//             die rolled across it, the counter read here off the match),
//             and at a sample of the entries it would take back the
//             battle's Session made again before it (app/undo.js's
//             rewind) is the match as it stood after the entry before,
//             and the same move sent again folds to the same trace, match
//             and log text as the move made once
//
//   node sim/replay-check.mjs [--only <ids>] [--self-test]
//
// --self-test: each broken copy in MUTANTS must fail. Exit 0 when every
// check holds (the self-test: when every mutant is caught), 1 otherwise.
import { parseArgs } from 'node:util'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadCorpus, select, copyCode } from './lib.mjs'
import { jobSetup, seatDevices } from './run.mjs'

const PKG = fileURLToPath(new URL('..', import.meta.url))
const { values: a } = parseArgs({ options: { only: { type: 'string' }, 'self-test': { type: 'boolean' }, dir: { type: 'string' }, quiet: { type: 'boolean' } } })

async function modules(dir) {
  const at = (f) => import(pathToFileURL(join(dir, f)).href)
  const [core, E, F, { LocalStore }, { Session }, R, { clock }, flow, undo, hud] = await Promise.all(['core/index.js', 'match/envelope.js', 'match/fold.js', 'match/store.js', 'match/session.js', 'app/replay.js', 'view/clock.js', 'app/flow.js', 'app/undo.js', 'present/hud-model.js'].map(at))
  return { core, E, F, LocalStore, Session, R, clock, flow, undo, hud }
}

// (F15) the page's flow, with nothing drawn: its sink (app/flow.js) hands
// each entry's events to a player that keeps the battle log's lines, and
// its relog writes into a log that keeps them too
function pageFlow(M, setup) {
  const flow = new M.flow.Flow({ view: {}, ui: {}, params: new URLSearchParams(), seed: setup.board, races: M.core.fullSetup(setup).seats.map((x) => x.race) })
  flow.lines = []
  flow.written = []
  flow.sameUnits = () => {}
  flow.player = { push: (ev) => flow.lines.push(...ev.filter((e) => e.t === 'log')) }
  flow.ui.log = { clear: () => (flow.written.length = 0), write: (side, html, cls, at, k) => flow.written.push({ html, at, k }) }
  return flow
}

// A battle's log, written as the page writes one: a Session over a
// LocalStore, its human seats played from device 'sim'. `online`: the log
// opens with a commitment first, and a stale entry is slipped in after the
// third move. Returns the Session, every event it handed on, and the
// match's hash and (F15) its trace's length after each accepted entry (by
// its place among them); (F15) with `page`, the page's flow (pageFlow)
// hears each entry's events too.
function write(M, it, { online, upTo = Infinity, page = null }) {
  const setup = seatDevices(jobSetup(it.job), 'sim')
  const human = setup.seats.flatMap((x, s) => (x.ctrl === 'human' ? [s] : []))
  const events = [], hashes = [], lens = []
  const store = new M.LocalStore()
  const ses = new M.Session({ store, localSeats: human, dev: 'sim', sink: { events: (ev, at) => (events.push(...ev), page?.sink.events(ev, at)) } })
  const mark = () => {
    hashes[ses.accepted.length - 1] = ses.G ? M.core.stateHash(ses.G) : null
    lens[ses.accepted.length - 1] = ses.G ? ses.G.journal.trace.length : 0
  }
  if (online) {
    ses.open('c0mm1t')
    mark()
  }
  ses.start(setup)
  mark()
  const entries = it.job.entries ?? []
  let k = 0
  for (const { s, ...body } of entries) {
    if (k >= upTo || ses.status !== 'live') break
    ses.submit(s, body)
    mark()
    k++
    if (online && k === 3) store.append(M.E.encode(M.E.envelope({ t: 'end' }, { id: 'sim.stale.0', s: human[0], d: 'sim', p: 'nope' })))
  }
  return { ses, events, hashes, lens, setup, rest: entries.slice(k) }
}

// (F15) The battle log's lines as the page's flow wrote them, each held to
// the move it names (`lens`, the battle's trace length after each move;
// `first`, the start's place): → why not, or null
function linesWrong(M, page, battle, lens, first) {
  const trace = battle.G.journal.trace, n = battle.accepted.length
  for (const [i, x] of page.lines.entries()) {
    const k = x.k
    if (!Number.isInteger(k) || k < first || k >= n) return `line ${i} ("${x.html.slice(0, 40)}") names move ${k}, not one of the battle's ${first}-${n - 1}`
    const before = k > first ? lens[k - 1] : 0, after = lens[k]
    // (a traced line is the trace's line at `at`; a held-back one, shown
    // but never traced, at the trace's length when it was flushed)
    const ok = x.traced ? before < x.at && x.at <= after && trace[x.at - 1].startsWith('log ') : before <= x.at && x.at <= after
    if (!ok) return `line ${i} ("${x.html.slice(0, 40)}", at ${x.at}) wasn't logged by move ${k} (the trace ${before} lines before it, ${after} after)`
  }
  return null
}

// (F12) Undo over a human battle's log played alone (as write's, never
// online): undoable() after every entry against the rule, read here off
// the match, and a sample of the entries it would take back taken back
// (rewind) and made again. → { why } (null when all held), how many
// entries were undoable, how many taken back
function undoWrong(M, it) {
  const setup = seatDevices(jobSetup(it.job), 'sim')
  const human = setup.seats.flatMap((x, s) => (x.ctrl === 'human' ? [s] : []))
  const ses = new M.Session({ store: new M.LocalStore(), localSeats: human, dev: 'sim' })
  ses.start(setup)
  const hashes = [M.core.stateHash(ses.G)], takes = []
  for (const { s, ...body } of it.job.entries ?? []) {
    if (ses.status !== 'live') break
    const rolled = ses.G.rng.n
    ses.submit(s, body)
    const k = ses.accepted.length - 1
    hashes[k] = M.core.stateHash(ses.G)
    // the rule, as open question 28 says it: a placement, a move or a
    // charge's end of the seat whose decision it now is, no die rolled
    const want = ses.status === 'live' && ['place', 'move', 'chargeEnd'].includes(body.t) && s === ses.decisionFor() && ses.G.rng.n === rolled ? k : -1
    const got = M.hud.undoable(ses)
    if (got !== want) return { why: `after entry ${k} (${body.t} by seat ${s}, the dice ${rolled} → ${ses.G.rng.n}, seat ${ses.decisionFor()} deciding) undoable says ${got}, not ${want}` }
    if (ses.folder.dice[k] !== ses.G.rng.n || ses.folder.pushed[ses.folder.placed[k]].id !== ses.accepted[k]) return { why: `after entry ${k} the Folder's record of it (its place ${ses.folder.placed[k]}, the dice ${ses.folder.dice[k]}) isn't the match's (the dice ${ses.G.rng.n})` }
    if (got >= 0) takes.push({ k, s, body })
  }
  if (M.hud.undoable(ses) >= 0 && ses.status !== 'live') return { why: `a battle ${ses.status} still has something to take back` }
  const texts = JSON.parse(ses.store.export())
  const sample = takes.length <= 4 ? takes : [0, 1, 2, 3].map((i) => takes[Math.round((i * (takes.length - 1)) / 3)])
  for (const { k, s, body } of sample) {
    const back = M.undo.rewind(ses, k)
    if (back.status !== 'live' || back.accepted.length !== k || M.core.stateHash(back.G) !== hashes[k - 1]) return { why: `entry ${k} (${body.t}) taken back: ${back.status}, ${back.accepted.length} moves, ${M.core.stateHash(back.G) === hashes[k - 1] ? '' : 'not '}the match after entry ${k - 1}` }
    back.submit(s, body)
    const once = new M.Session({ store: new M.LocalStore(texts.slice(0, ses.folder.placed[k] + 1)), localSeats: human, dev: 'sim' })
    if (back.G.journal.trace.join('\n') !== once.G.journal.trace.join('\n') || M.core.stateHash(back.G) !== hashes[k] || back.store.export() !== once.store.export()) return { why: `entry ${k} (${body.t}) taken back and sent again folds otherwise than made once (trace ${back.G.journal.trace.length}/${once.G.journal.trace.length} lines, ${M.core.stateHash(back.G) === hashes[k] ? 'same' : 'another'} match, ${back.store.export() === once.store.export() ? 'same' : 'other'} texts)` }
  }
  return { why: null, n: takes.length, taken: sample.length }
}

// (F12) What the corpus never plays: no kind undo takes back rolls today (a
// placement, a move and a charge's end draw nothing), and the UI deploys a
// hotseat's seats one after the other. So undoable() is held to the rule
// on a stand-in Session whose last entry, a move of the seat deciding,
// rolled (none to take back) or didn't (that one); and over a hotseat
// battle (`it`) whose seat 1 places a unit while seat 0 is still deploying
// (seat 0 deciding: seat 1's entry isn't its to take back), then seat 0
// places one (its own). → why not, or null
function undoRule(M, it) {
  const stand = (dice) => {
    const setup = seatDevices(jobSetup(it.job), 'sim')
    const G = new M.Session({ store: new M.LocalStore(), localSeats: [0, 1], dev: 'sim' })
    G.start(setup)
    const move = { id: 'sim.1.0', s: 0, d: 'sim', t: 'move', u: 1, c: 1 }
    return { G: G.G, status: 'live', store: { kind: 'local' }, localSeats: [0, 1], dev: 'sim', decisionFor: () => 0, folder: { accepted: ['sim.0.0', 'sim.1.0'], placed: [0, 1], dice, pushed: [{ id: 'sim.0.0', t: 'start' }, move] } }
  }
  if (M.hud.undoable(stand([0, 3])) !== -1 || M.hud.undoable(stand([3, 3])) !== 1) return `a move of the seat deciding that rolled is ${M.hud.undoable(stand([0, 3])) === -1 ? '' : 'not '}a commit point, and one that didn't ${M.hud.undoable(stand([3, 3])) === 1 ? 'is' : "isn't"} undone`
  const setup = seatDevices(jobSetup(it.job), 'sim')
  const ses = new M.Session({ store: new M.LocalStore(), localSeats: [0, 1], dev: 'sim' })
  ses.start(setup)
  // (a placement the match takes for seat s: its first unit put down where
  // it stands, or on the first cell from there that will do)
  const place = (s) => {
    const G = ses.G, u = G.units.find((x) => x.side === s), c0 = G.nav.index(u.pos.x, u.pos.z)
    for (let i = 0; i < G.nav.N; i++) {
      const body = { t: 'place', u: u.id, c: (c0 + i) % G.nav.N }
      if (ses.legal(s, body) === null) return body
    }
  }
  ses.submit(1, place(1))
  if (ses.decisionFor() !== 0 || M.hud.undoable(ses) !== -1) return `seat 1's placement while seat 0 deploys (seat ${ses.decisionFor()} deciding) is taken back (${M.hud.undoable(ses)})`
  ses.submit(0, place(0))
  if (M.hud.undoable(ses) !== 2) return `seat 0's own placement after it isn't taken back (${M.hud.undoable(ses)})`
  return null
}

// A store that inserts, as Automerge's does when a concurrent change lands
// before entries already folded (entries decoded once per text)
class ListStore {
  constructor(M, texts) {
    this.M = M
    this.texts = texts
    this.subs = new Set()
    this.cache = new Map()
  }
  get length() {
    return this.texts.length
  }
  entries() {
    return this.texts.map((t) => {
      if (!this.cache.has(t)) this.cache.set(t, this.M.E.decode(t))
      return this.cache.get(t)
    })
  }
  append(t) {
    this.texts.push(typeof t === 'string' ? t : this.M.E.encode(t))
    for (const fn of [...this.subs]) fn()
  }
  insert(at, t) {
    this.texts.splice(at, 0, t)
    for (const fn of [...this.subs]) fn()
  }
  subscribe(fn) {
    this.subs.add(fn)
    return () => this.subs.delete(fn)
  }
  export() {
    return JSON.stringify(this.texts)
  }
}

// The flow, as app/replay.js uses it: the Session shown, its events heard.
function standIn() {
  const flow = {
    shown: null, startedWith: null, heard: [], shows: [],
    player: { idle: true },
    show(ses) {
      flow.hand(ses)
      flow.shows.push('show')
      flow.startedWith = null
    },
    showStart(ses, setup) {
      flow.hand(ses)
      flow.shows.push('start')
      flow.startedWith = setup
    },
    hand(ses) {
      flow.shown = ses
      ses.sink = { events: (ev) => flow.heard.push(...ev) }
    },
    back() {
      flow.wentBack = true
    },
  }
  const bar = { wire() {}, render(m) { bar.m = m }, hide() { bar.m = null } }
  return { flow, bar }
}

// play a replay on until it stops, or stops getting anywhere (each step:
// the table idle, the timer run), `until(replay)` besides
async function run(replay, until = () => !replay.playing) {
  let last = replay.k, still = 0
  while (!until(replay) && still < 200) {
    replay.idled()
    await new Promise((r) => setTimeout(r, 0))
    still = replay.k === last ? still + 1 : 0
    last = replay.k
  }
}

async function checks(dir, only) {
  const M = await modules(dir)
  M.clock.speed = 1e9
  const { items } = loadCorpus()
  const picked = select(items, only)
  let failed = 0, n = 0
  const undone = { entries: 0, taken: 0 }
  const fail = (it, what) => {
    failed++
    if (!a.quiet) console.log(`  FAIL ${it.id}: ${what}`)
  }
  for (const it of picked) {
    const online = it.kind === 'human'
    const page = pageFlow(M, seatDevices(jobSetup(it.job), 'sim'))
    const { ses: battle, events, hashes, lens, setup } = write(M, it, { online, page })
    const { flow, bar } = standIn()
    const replay = new M.R.Replay({ flow, bar })
    replay.open(battle)
    const moves = replay.moves(), first = replay.first(moves)
    // (F15) logs: every line names the move that logged it; relog stamps
    // the same; a click on a line shows the match before its move
    const lw = linesWrong(M, page, battle, lens, first)
    if (lw) fail(it, `the battle log: ${lw}`)
    page.relog(battle.folder.pushed)
    const shown = page.lines.slice(-80).map((x) => ({ html: x.html, at: x.at, k: x.k }))
    if (JSON.stringify(page.written) !== JSON.stringify(shown)) fail(it, `the battle log made again (relog) isn't the log as written, move for move (${page.written.length} lines, ${shown.length} written; first apart at ${page.written.findIndex((x, i) => JSON.stringify(x) !== JSON.stringify(shown[i]))})`)
    const clicks = page.lines.length <= 6 ? page.lines : [0, 1, 2, 3, 4, 5].map((i) => page.lines[Math.round((i * (page.lines.length - 1)) / 5)])
    for (const x of clicks) {
      replay.before(battle, x.k)
      const G = flow.shown?.G
      const ok = replay.k === x.k - 1 && (x.k > first ? !!G && M.core.stateHash(G) === hashes[x.k - 1] && G.journal.trace.length === lens[x.k - 1] : !G && flow.startedWith === moves[first].setup)
      if (!ok) {
        fail(it, `a click on the line "${x.html.slice(0, 40)}" (move ${x.k}) shows move ${replay.k}${G ? '' : ' (before the battle)'}, not the match before its move`)
        break
      }
    }
    replay.live()
    // scrub: every k (a sample of 40 on long battles), and before the start
    const ks = moves.length <= 40 ? moves.map((_, k) => k) : Array.from({ length: 40 }, (_, i) => Math.round((i * (moves.length - 1)) / 39))
    let wrong = null
    for (const k of [first - 1, ...ks.filter((k) => k >= first)]) {
      replay.scrub(k)
      const G = flow.shown?.G
      const ok = k < first ? !G && moves[first].t === 'start' && flow.startedWith === moves[first].setup && flow.startedWith.board === setup.board : !!G && M.core.stateHash(G) === hashes[k]
      if (!ok && !wrong) wrong = k
    }
    if (wrong !== null) fail(it, `the scrub to move ${wrong} doesn't show the battle as it stood after it (${online ? 'online' : 'local'} log, its start at ${first})`)
    // replay: from the start, every event the battle handed on
    flow.heard.length = 0
    replay.fromStart()
    await run(replay)
    const end = flow.shown?.G
    if (JSON.stringify(flow.heard) !== JSON.stringify(events)) fail(it, `watched from the start, the replay hands on ${flow.heard.length} events, the battle ${events.length} (first apart at ${flow.heard.findIndex((e, i) => JSON.stringify(e) !== JSON.stringify(events[i]))})`)
    else if (!end || M.core.stateHash(end) !== M.core.stateHash(battle.G) || replay.k !== moves.length - 1) fail(it, `watched from the start, the replay ends elsewhere than the battle (move ${replay.k} of ${moves.length - 1})`)
    // file: the whole log, back again
    const text = replay.file()
    const back = M.R.openReplay(text)
    const again = back.store && new M.Session({ store: back.store, dev: 'replay' })
    if (!again || back.store.export() !== battle.store.export() || M.core.stateHash(again.G) !== M.core.stateHash(battle.G) || JSON.stringify(again.rejected) !== JSON.stringify(battle.rejected)) fail(it, `its replay file opens to another log or match (${back.why ?? 'opened'})`)
    // kept: an honest log, and one that lost an accepted entry
    const known = M.F.knownOf(battle.folder)
    const texts = JSON.parse(battle.store.export())
    const honest = new M.Session({ store: new M.LocalStore(texts), dev: 'x', known })
    const cut = new M.Session({ store: new M.LocalStore(texts.filter((t, i) => i !== texts.length - 1)), dev: 'x', known })
    if (honest.status !== battle.status || M.core.stateHash(honest.G) !== M.core.stateHash(battle.G)) fail(it, `given its own accepted entries, a page folds its log otherwise (${honest.status})`)
    if (cut.status !== 'tamper' || cut.G) fail(it, `given its accepted entries, a log that lost its last is not tamper (${cut.status})`)
    // (F12) undo, over the battle played alone
    if (it.kind === 'human') {
      const u = undoWrong(M, it)
      if (u.why) fail(it, `undo: ${u.why}`)
      else {
        undone.entries += u.n
        undone.taken += u.taken
      }
    }
    // close, back: the battle itself shown (one that isn't over: the war
    // room)
    replay.scrub(first)
    replay.close({ back: true })
    if ((battle.status === 'over' ? flow.shown !== battle : !flow.wentBack) || bar.m) fail(it, `the replay put away doesn't show the battle itself again (${battle.status})`)
    n++
  }
  // (F12) undo's rule where the corpus doesn't reach it
  {
    const it = picked.find((x) => x.mode === 'hotseat')
    const why = it && undoRule(M, it)
    if (why) fail(it, `undo: ${why}`)
  }
  // live: a human battle still going on, moves landing while it replays
  {
    const it = picked.find((x) => x.kind === 'human' && (x.job.entries?.length ?? 0) > 30)
    if (it) {
      const { ses: battle, rest } = write(M, it, { online: true, upTo: 20 })
      const { flow, bar } = standIn()
      const replay = new M.R.Replay({ flow, bar })
      replay.open(battle, { live: true })
      replay.fromStart()
      let landed = 0
      // (three more moves land in the battle while the replay is half way)
      await run(replay, () => replay.k >= 10 || !replay.playing)
      if (replay.k === 10) {
        for (const { s, ...body } of rest.slice(0, 3)) battle.submit(s, body)
        landed = 3
      }
      await run(replay)
      const moves = replay.moves()
      if (!landed || flow.shown !== battle || replay.k !== moves.length - 1 || flow.shows.at(-1) !== 'show' || !bar.m?.atLive) fail(it, `a replay of a battle going on, ${landed} moves landing meanwhile, ends ${flow.shown === battle ? 'on the battle itself' : 'elsewhere'} at move ${replay.k} of ${moves.length - 1}, not at Live`)
      // (F15) a peek: a click on a line of a battle going on that has no
      // bar puts the bar up over the match before its move; Live, and ✕
      // the second time, take it away, the battle itself shown, never the
      // war room
      for (const how of ['live', 'close']) {
        const peek = standIn()
        const pr = new M.R.Replay(peek)
        pr.before(battle, 5)
        const up = !!peek.bar.m && peek.flow.shown !== battle && pr.k === 4 && peek.bar.m.closable && peek.bar.m.live
        if (how === 'live') pr.live()
        else pr.close({ back: true })
        if (!up || peek.bar.m || peek.flow.shown !== battle || peek.flow.wentBack || pr.battle) fail(it, `a peek at move 4 of a battle going on ${up ? '' : "never shows it on the bar (closable, at Live's side), and "}${how === 'live' ? 'at Live' : 'at ✕'} ${peek.bar.m ? 'keeps the bar up' : peek.flow.wentBack ? 'goes to the war room' : peek.flow.shown !== battle ? "doesn't show the battle" : 'comes back'}`)
      }
    }
  }
  // refold: an entry of seat 1 inserted before seat 0's first, both in the
  // deployment, once the replay has played every move but the last
  {
    const it = picked.find((x) => x.id === 'hotseat-late-8') ?? picked.find((x) => x.mode === 'hotseat')
    if (it) {
      const { ses: whole } = write(M, it, { online: false, upTo: 12 })
      const texts = JSON.parse(whole.store.export()), ents = texts.map((t) => M.E.decode(t))
      const i = ents.findIndex((e) => e.s === 0 && e.t !== 'start'), j = ents.findIndex((e) => e.s === 1)
      const store = new ListStore(M, texts.slice(0, j))
      const battle = new M.Session({ store, dev: 'watch' })
      const { flow, bar } = standIn()
      const replay = new M.R.Replay({ flow, bar })
      replay.open(battle)
      replay.fromStart()
      await run(replay, () => replay.k >= battle.accepted.length - 1)
      store.insert(i, texts[j])
      replay.play()
      await run(replay)
      const moves = replay.moves()
      if (!flow.shown?.G || M.core.stateHash(flow.shown.G) !== M.core.stateHash(battle.G) || replay.k !== moves.length - 1) fail(it, `a replay the battle folded again under ends at move ${replay.k} of ${moves.length - 1}, ${flow.shown?.G && M.core.stateHash(flow.shown.G) === M.core.stateHash(battle.G) ? 'on' : 'not on'} the battle's match`)
    }
  }
  // files that aren't replays
  const refused = ['nope', '{}', JSON.stringify({ log: ['x'] }), JSON.stringify({ replay: 'tails-and-scales', log: [] }), JSON.stringify({ replay: 'tails-and-scales', log: [1, 2] })].filter((t) => !M.R.openReplay(t).why)
  if (refused.length) {
    failed++
    if (!a.quiet) console.log(`  FAIL a file that isn't a replay opens all the same: ${refused[0]}`)
  }
  return { failed, n, undone }
}

// Broken copies the self-test builds; each must fail.
const MUTANTS = {
  // a scrub to k shows the match after k - 1 moves
  'scrub-off-by-one': ['app/replay.js', 'new LocalStore(moves.slice(0, k + 1))', 'new LocalStore(moves.slice(0, k))'],
  // a battle's moves are every good entry pushed, the refused ones too
  'moves-not-accepted': ['match/fold.js', 'return this.accepted.map((id) => byId.get(id))', 'return [...byId.values()]'],
  // the replay skips a move now and then
  'replay-skips': ['app/replay.js', '      this.k++\n', '      this.k += this.k % 7 === 3 && this.k + 2 < moves.length ? 2 : 1\n'],
  // the start taken to be the first move (an online log's open is)
  'first-is-zero': ['app/replay.js', "return Math.max(0, moves.findIndex((e) => e.t === 'start'))", 'return 0'],
  // a replay of a battle going on never comes back to it
  'never-live': ['app/replay.js', '        if (this.isLive) return this.live()\n', ''],
  // a replay file without the log's first entry
  'file-drops-first': ['app/replay.js', 'log: JSON.parse(this.battle.store.export())', 'log: JSON.parse(this.battle.store.export()).slice(1)'],
  // any JSON with a log opens as a replay
  'file-unchecked': ['app/replay.js', "if (f?.replay !== 'tails-and-scales' || !Array.isArray(f.log))", 'if (!Array.isArray(f?.log))'],
  // the bar put away leaves the replay on the table
  'close-stays': ['app/replay.js', '    if (back && shown) this.flow.show(battle)\n', '    if (false) this.flow.show(battle)\n'],
  // a replay goes on writing moves by their place after the battle folded
  // again under it
  'no-refold-check': ['app/replay.js', 'if (at.length !== this.k + 1 || at[this.k] !== moves[this.k]?.id) {', 'if (false) {'],
  // (F15) a log line names the move after its own
  'log-k-next': ['app/flow.js', 'const facts = this.acted.splice(0), k = ses.accepted.length - 1', 'const facts = this.acted.splice(0), k = ses.accepted.length'],
  // (F15) the log made again after a snap names no move
  'relog-unstamped': ['app/flow.js', "if (x.t === 'log') lines.push({ ...x, k })", "if (x.t === 'log') lines.push(x)"],
  // (F15) a click shows the match after the line's move, not before it
  'click-after': ['app/replay.js', '    this.scrub(k - 1)\n', '    this.scrub(k)\n'],
  // (F15) a peek put away at Live stays on the bar
  'peek-stays': ['app/replay.js', '    if (this.peek) return this.close({ back: true })\n', ''],
  // (F12) undo takes back past a die rolled
  'undo-past-dice': ['present/hud-model.js', '&& f.dice[k] === f.dice[k - 1] ? k : -1', '? k : -1'],
  // (F12) in hotseat a seat takes back the other's entry
  'undo-any-seat': ['present/hud-model.js', 'UNDOABLE.includes(e.t) && e.s === seat && e.d', 'UNDOABLE.includes(e.t) && e.d'],
  // (F12) the Folder's dice counter not the match's
  'dice-unread': ['match/fold.js', '    this.dice.push(this.G ? this.G.rng.n : 0)\n', '    this.dice.push(0)\n'],
  // (F12) the Session made again keeps the entry taken back
  'rewind-keeps': ['app/undo.js', '.slice(0, session.folder.placed[k])', '.slice(0, session.folder.placed[k] + 1)'],
}

const only = a.only
if (a['self-test']) {
  const work = join(tmpdir(), `tails-and-scales-replay-test-${process.pid}`)
  let missed = 0
  try {
    const clean = await checks(copyCode(PKG, join(work, 'unbroken')), only ?? 'hotseat-late-8,bushtail-random-6,64-89')
    if (clean.failed) throw new Error(`the unbroken copy fails ${clean.failed} check(s)`)
    for (const [name, [file, from, to]] of Object.entries(MUTANTS)) {
      const code = copyCode(PKG, join(work, name))
      const f = join(code, file), src = readFileSync(f, 'utf8')
      if (src.split(from).length !== 2) throw new Error(`mutant ${name}: ${file} doesn't hold what it changes`)
      writeFileSync(f, src.replace(from, to))
      a.quiet = true
      const out = await checks(code, only ?? 'hotseat-late-8,bushtail-random-6,64-89')
      a.quiet = false
      if (!out.failed) missed++
      console.log(`  ${name.padEnd(20)} ${out.failed ? `caught (${out.failed} check(s) failed)` : 'MISSED'}`)
    }
  } finally {
    rmSync(work, { recursive: true, force: true })
  }
  console.log(missed ? `\nreplay-check self-test: ${missed} mutant(s) missed` : `\nreplay-check self-test passed: ${Object.keys(MUTANTS).length} broken copies each caught`)
  process.exit(missed ? 1 : 0)
} else {
  const t0 = performance.now()
  const { failed, n, undone } = await checks(a.dir ?? PKG, only)
  console.log(failed ? `\nreplay-check: ${failed} check(s) failed` : `\nreplay-check passed: ${n} battles scrubbed move by move, replayed from the start event for event, saved and opened again, held to what a page kept; a replay of a battle going on catches up with it; (F15) every battle-log line names the move that logged it, and a click on one shows the battle before it; (F12) undo's rule held after every entry of the human battles (${undone.entries} entries it would take back), ${undone.taken} taken back and made again to the same trace (${((performance.now() - t0) / 1000).toFixed(0)} s)`)
  process.exit(failed ? 1 : 0)
}
