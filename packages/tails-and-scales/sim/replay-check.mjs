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
  const [core, E, F, { LocalStore }, { Session }, R, { clock }] = await Promise.all(['core/index.js', 'match/envelope.js', 'match/fold.js', 'match/store.js', 'match/session.js', 'app/replay.js', 'view/clock.js'].map(at))
  return { core, E, F, LocalStore, Session, R, clock }
}

// A battle's log, written as the page writes one: a Session over a
// LocalStore, its human seats played from device 'sim'. `online`: the log
// opens with a commitment first, and a stale entry is slipped in after the
// third move. Returns the Session, every event it handed on, and the
// match's hash after each accepted entry (by its place among them).
function write(M, it, { online, upTo = Infinity }) {
  const setup = seatDevices(jobSetup(it.job), 'sim')
  const human = setup.seats.flatMap((x, s) => (x.ctrl === 'human' ? [s] : []))
  const events = [], hashes = []
  const store = new M.LocalStore()
  const ses = new M.Session({ store, localSeats: human, dev: 'sim', sink: { events: (ev) => events.push(...ev) } })
  const mark = () => {
    hashes[ses.accepted.length - 1] = ses.G ? M.core.stateHash(ses.G) : null
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
  return { ses, events, hashes, setup, rest: entries.slice(k) }
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
  const fail = (it, what) => {
    failed++
    if (!a.quiet) console.log(`  FAIL ${it.id}: ${what}`)
  }
  for (const it of picked) {
    const online = it.kind === 'human'
    const { ses: battle, events, hashes, setup } = write(M, it, { online })
    const { flow, bar } = standIn()
    const replay = new M.R.Replay({ flow, bar })
    replay.open(battle)
    const moves = replay.moves(), first = replay.first(moves)
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
    // close, back: the battle itself shown (one that isn't over: the war
    // room)
    replay.scrub(first)
    replay.close({ back: true })
    if ((battle.status === 'over' ? flow.shown !== battle : !flow.wentBack) || bar.m) fail(it, `the replay put away doesn't show the battle itself again (${battle.status})`)
    n++
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
  return { failed, n }
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
  const { failed, n } = await checks(a.dir ?? PKG, only)
  console.log(failed ? `\nreplay-check: ${failed} check(s) failed` : `\nreplay-check passed: ${n} battles scrubbed move by move, replayed from the start event for event, saved and opened again, held to what a page kept; a replay of a battle going on catches up with it (${((performance.now() - t0) / 1000).toFixed(0)} s)`)
  process.exit(failed ? 1 : 0)
}
