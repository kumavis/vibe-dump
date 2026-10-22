// The fold's cost per entry (DESIGN §2.6's per-entry rule, R8b): folding a
// log of n entries costs per entry what a short log does, so a large
// battle's log (5,000 entries, the cap) folds as cheaply per entry as a
// small one's (reloaded whole, the fold is linear; played an entry at a
// time, each change also makes the identity scan below, which this check
// can't see: nanoseconds a compare). Per entry
// the Folder does its checks, stateHash where one seat is waited on,
// legal() and apply(), and O(1) besides; per change, one pass of identity
// compares over the entries pushed (the prefix check); nothing per entry
// decodes, copies or stringifies the list. The store tells its length, and
// the Session numbers its ids from a counter of its own (match/store.js,
// match/session.js).
//
// A synthetic log of n entries: a hotseat corpus log (hotseat-late-8, its
// battle played to its end) with filler spread evenly between its entries:
// in the deployment, the deploying seat placing a unit on the cell it
// stands on (legal() and apply()); at a single seat's decision, a command
// with that seat's head and the match's hash that legal() refuses
// (stateHash and legal()); and every tenth a text decode refuses (junk,
// which the cap counts too). Each log is folded two ways through the code
// under test: `play`, a spectator's Session over a LocalStore the log's
// texts are appended to one at a time (each a change: the way every game
// played on one device, and every peer, folds), and `reload`, a Session
// made over a LocalStore holding them all (one change). Each must end over,
// having pushed every entry, at the same match as the log alone (the corpus
// battle's own stateHash).
//
// (N1) With --store automerge, both folds run over the AutomergeStore
// (net/automerge-store.js) on a document of a repo with no network
// (automerge-repo's, in this process): `play` appends each text in a change
// of its own, `reload` makes the store over a document whose log holds them
// all (one change). What Automerge itself does per change (its diff, the
// patches) is counted and timed with the fold, since a peer pays it.
//
// The verdict compares the marginal cost per filler entry (the cost of a
// log of n entries less the battle's alone, over the entries added) at n/4
// and at n entries: in time (the fastest of five folds, each in a fresh
// process: linear keeps it level, quadratic grows it fourfold), and in what
// a fold does, counted while it runs: JSON.parse calls (one decode per
// entry), JSON.stringify calls, and array elements copied by slice, map,
// filter, concat, flatMap and Array.from (spreads aren't seen). Each must
// stay level (at most 1.5 times; time at most twice, for noise), and
// JSON.parse at one a filler entry, or the fold is not linear.
//
//   node sim/fold-cost.mjs [--entries N] [--store local | automerge] [--dir <packageDir> | --ref <ref>]
//   node sim/fold-cost.mjs --self-test [--store automerge]   each broken copy in
//                                        MUTANTS (the store's own, for the
//                                        AutomergeStore) must fail it, after
//                                        the unbroken passes
//
// --entries (default 5000, the cap) is n. Exit 0 when the fold is linear
// (the self-test: when every mutant is caught), 1 otherwise, 2 on bad
// arguments.
import { parseArgs } from 'node:util'
import { spawn } from 'node:child_process'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { readFileSync, writeFileSync, rmSync, symlinkSync, existsSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadCorpus, copyCode } from './lib.mjs'
import { jobSetup } from './run.mjs'
import { codeDir, PKG } from './oracle/pin.mjs'

let a
try {
  ({ values: a } = parseArgs({ options: { entries: { type: 'string' }, store: { type: 'string' }, dir: { type: 'string' }, ref: { type: 'string' }, child: { type: 'string' }, 'self-test': { type: 'boolean' } } }))
} catch (e) {
  console.error(`fold-cost: ${e.message}\nusage: node sim/fold-cost.mjs [--entries N] [--store local | automerge] [--dir <packageDir> | --ref <ref>] | --self-test [--store automerge]`)
  process.exit(2)
}
const STORE = a.store ?? 'local'
if (!['local', 'automerge'].includes(STORE)) {
  console.error(`fold-cost: --store takes local or automerge, not ${a.store}`)
  process.exit(2)
}
const N = a.entries === undefined ? 5000 : Number(a.entries)
if (!Number.isInteger(N) || N < 1000 || N > 5000) {
  console.error(`fold-cost: --entries takes a whole number from 1,000 to 5,000 (the cap), not ${a.entries}`)
  process.exit(2)
}
const dir = a.dir ? resolve(a.dir) : codeDir(a.ref ?? 'WORKTREE')
// the log the filler is spread over
const LOG = 'hotseat-late-8'
const PATHS = ['play', 'reload']
// how much the marginal cost per entry may grow from n/4 to n entries, and
// how many timed folds each size takes the fastest of
const LEVEL = 1.5, LEVEL_TIME = 2, RUNS = 5

// ── A child: one measure ────────────────────────────────────────────────────
// { path, n, counted }: the fold of a log of n entries (0: the battle alone)
// by `path`, timed, or (counted) with what it does counted.
async function measure({ path, n, counted }) {
  const at = (f) => import(pathToFileURL(join(dir, f)).href)
  const [core, E, F, { LocalStore }, { Session }] = await Promise.all(['core/index.js', 'match/envelope.js', 'match/fold.js', 'match/store.js', 'match/session.js'].map(at))
  // (--store automerge: a store over a document of a repo with no network;
  // the repo's full entry first, which initialises the wasm the store's
  // slim import shares)
  const am = STORE === 'automerge' ? await automerge(at) : null
  const it = loadCorpus().items.find((x) => x.id === LOG)
  const texts = build({ core, E, F }, it, n)
  // the battle alone, folded straight: the match every fold must end at
  const G0 = core.createMatch(jobSetup(it.job), { out: null })
  for (const { s, ...b } of it.job.entries) core.apply(G0, s, b)
  const want = core.stateHash(G0)
  const counts = counted ? count() : null
  const t0 = performance.now()
  let ses
  if (path === 'play') {
    const store = am ? am.store() : new LocalStore()
    ses = new Session({ store, localSeats: [], dev: 'watch', sink: { events() {} } })
    for (const t of texts) store.append(t)
  } else ses = new Session({ store: am ? am.store(texts) : new LocalStore(texts), localSeats: [], dev: 'watch', sink: { events() {} } })
  const ms = performance.now() - t0
  const got = counts?.stop()
  if (ses.status !== 'over' || ses.folder.pushed.length !== texts.length || core.stateHash(ses.G) !== want) {
    throw new Error(`the ${path} fold of ${texts.length} entries ends ${ses.status} with ${ses.folder.pushed.length} pushed${ses.G ? `, at ${core.stateHash(ses.G) === want ? 'the battle\'s match' : 'another match than the battle\'s'}` : ''}`)
  }
  return { entries: texts.length, ms, ...got }
}

// The AutomergeStore of the code under test, and a store over a new
// document (holding `texts`, written in one change).
async function automerge(at) {
  const { Repo } = await import('@automerge/automerge-repo')
  const { ImmutableString } = await import('@automerge/automerge/slim')
  const { AutomergeStore, matchDoc } = await at('net/automerge-store.js')
  const repo = new Repo({ network: [] })
  return { store: (texts = []) => new AutomergeStore(repo.create({ ...matchDoc(), log: texts.map((t) => new ImmutableString(t)) })) }
}

// The log of n entries: the start, then the corpus log's entries with the
// filler spread evenly before them (n 0: the log alone). Each entry written
// as a device writes it (each human seat from its own device, after its
// head, the match's hash where one seat is waited on), followed by a
// writer's own Folder.
function build({ core, E, F }, it, n) {
  const setup = jobSetup(it.job)
  const devs = { ...setup, seats: setup.seats.map((x, s) => (x.ctrl === 'human' ? { ...x, dev: `d${s}` } : x)) }
  const f = new F.Folder({ out: null })
  const texts = []
  let k = 0
  const put = (text) => {
    texts.push(text)
    f.push(E.decode(text))
  }
  const env = (body, s, extra = {}) => E.encode(E.envelope(body, { id: `d${Math.max(s, 0)}.${(k++).toString(36)}.0`, s, d: `d${Math.max(s, 0)}`, ...extra }))
  const write = (body, s) => {
    const one = !F.SIMULTANEOUS.includes(f.G.pending.k)
    return env(body, s, { p: f.head(s), h: one ? core.stateHash(f.G) : undefined })
  }
  put(env({ t: 'start', core: core.CORE_VERSION, rules: core.RULES_ID, setup: devs }, -1))
  const entries = it.job.entries
  const extra = n ? Math.max(0, n - 1 - entries.length) : 0
  const share = (i) => Math.floor((extra * (i + 1)) / entries.length) - Math.floor((extra * i) / entries.length)
  let made = 0
  for (const [i, { s, ...b }] of entries.entries()) {
    for (let x = share(i); x > 0; x--, made++) {
      const P = f.G.pending, seat = P.seats[0]
      if (made % 10 === 9) put(`junk ${made}`)
      else if (P.k === 'deploy') {
        const u = f.G.units.find((x) => x.side === seat)
        put(write({ t: 'place', u: u.id, c: f.G.nav.index(u.pos.x, u.pos.z) }, seat))
      } else put(write({ t: 'move', u: 999, c: 0 }, seat))
    }
    put(write(b, s))
  }
  if (f.status !== 'over') throw new Error(`the synthetic log of ${texts.length} entries folds ${f.status} for its writer`)
  return texts
}

// What a fold does, counted from now until stop(): JSON.parse and
// JSON.stringify calls, and the elements of every array copied by slice,
// map, filter, concat, flatMap or Array.from. (N1) Copies Automerge makes
// itself, its wasm's glue code copying the document's materialized log at
// every change (Array.from), are counted apart, as `automerge`: Automerge
// 3.5.0's own cost, which no store can avoid (told, not judged).
function count() {
  const c = { parse: 0, stringify: 0, copied: 0, automerge: 0 }
  const was = { parse: JSON.parse, stringify: JSON.stringify, from: Array.from }
  const protos = ['slice', 'map', 'filter', 'concat', 'flatMap'].map((m) => [m, Array.prototype[m]])
  JSON.parse = function (...x) {
    c.parse++
    return was.parse.apply(this, x)
  }
  JSON.stringify = function (...x) {
    c.stringify++
    return was.stringify.apply(this, x)
  }
  Array.from = function (x, ...y) {
    if (x && typeof x.length === 'number') {
      if (x.length > 64 && /automerge_wasm/.test(new Error().stack)) c.automerge += x.length
      else c.copied += x.length
    }
    return was.from.call(this, x, ...y)
  }
  for (const [m, fn] of protos) {
    Array.prototype[m] = function (...x) {
      c.copied += this.length
      return fn.apply(this, x)
    }
  }
  return {
    stop() {
      Object.assign(JSON, { parse: was.parse, stringify: was.stringify })
      Array.from = was.from
      for (const [m, fn] of protos) Array.prototype[m] = fn
      return c
    },
  }
}

if (a.child) {
  let out
  try {
    out = { ok: true, r: await measure(JSON.parse(a.child)) }
  } catch (e) {
    out = { ok: false, error: String(e?.message ?? e) }
  }
  process.stdout.write(JSON.stringify(out))
  process.exit(0)
}

// ── The run ─────────────────────────────────────────────────────────────────
const ME = fileURLToPath(import.meta.url)
function child(task, pkg) {
  return new Promise((done) => {
    const p = spawn(process.execPath, [ME, '--dir', pkg, '--store', STORE, '--child', JSON.stringify(task)], { stdio: ['ignore', 'pipe', 'pipe'] })
    let out = '', err = ''
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
  })
}

// Measure the code in `pkg`; returns the problems (empty when linear).
// One child at a time, so the timings don't share the machine.
async function run(pkg, { quiet = false } = {}) {
  const say = quiet ? () => {} : (s) => console.log(s)
  const bad = []
  for (const path of PATHS) {
    const at = {}
    for (const n of [0, N / 4, N]) {
      const runs = []
      for (let r = 0; r < RUNS; r++) runs.push(await child({ path, n }, pkg))
      const counted = await child({ path, n, counted: true }, pkg)
      const fail = [...runs, counted].find((x) => !x.ok)
      if (fail) {
        bad.push({ error: `${path}, ${n || 'the battle alone'}: ${fail.error}` })
        break
      }
      at[n] = { ...counted.r, ms: Math.min(...runs.map((x) => x.r.ms)), msAll: runs.map((x) => Math.round(x.r.ms)) }
    }
    if (Object.keys(at).length < 3) continue
    // the marginal cost of an entry added to the battle's log, at n/4 and n
    const base = at[0], per = (n, k) => (at[n][k] - base[k]) / (at[n].entries - base.entries)
    const rows = ['ms', 'parse', 'stringify', 'copied'].map((k) => {
      const lo = per(N / 4, k), hi = per(N, k), ratio = hi / lo
      return { k, lo, hi, ratio, ok: k === 'ms' ? ratio <= LEVEL_TIME : ratio <= LEVEL && (k !== 'parse' || (lo <= 1.05 && hi <= 1.05)) }
    })
    if (at[N].automerge) say(`  ${path.padEnd(7)} (Automerge's own copies of its log, per entry added: ${per(N / 4, 'automerge').toFixed(1)} elements at ${N / 4}, ${per(N, 'automerge').toFixed(1)} at ${N}; not judged)`)
    say(`  ${path.padEnd(7)} the battle alone ${base.entries} entries in ${Math.round(base.ms)} ms; ${at[N / 4].entries} in ${Math.round(at[N / 4].ms)} ms; ${at[N].entries} in ${Math.round(at[N].ms)} ms (fastest of ${at[N].msAll.join(', ')})`)
    for (const r of rows) {
      const fmt = (x) => (r.k === 'ms' ? `${(x * 1000).toFixed(1)} µs` : x.toFixed(2))
      say(`          ${{ ms: 'time', parse: 'JSON.parse', stringify: 'JSON.stringify', copied: 'elements copied' }[r.k].padEnd(16)} per entry added ${fmt(r.lo)} at ${N / 4}, ${fmt(r.hi)} at ${N}: ×${r.ratio.toFixed(2)} ${r.ok ? 'level' : 'GROWS'}`)
      if (!r.ok) bad.push({ error: `${path}: ${r.k} per entry added grows ×${r.ratio.toFixed(2)} from ${N / 4} to ${N} entries (${fmt(r.lo)} to ${fmt(r.hi)})${r.k === 'parse' && r.ratio <= LEVEL ? ': more than one decode per entry' : ''}` })
    }
  }
  return bad
}

// ── The self-test ───────────────────────────────────────────────────────────
// Each a broken copy whose fold does O(n) work per entry; the check must
// fail on each. (--store automerge: the AutomergeStore's own.)
const AUTOMERGE_MUTANTS = {
  // the list read off the document again at every change: O(n) elements
  // copied per entry
  'rebuild-every-change': ['net/automerge-store.js', "      if (p.path[0] !== 'log') continue\n      touched = true\n", "      if (p.path[0] !== 'log') continue\n      this.rebuild()\n      return true\n"],
  // the whole log decoded again at every change, an insert's patch
  // ignored: O(n) decodes per entry
  'decode-every-change': ['net/automerge-store.js', 'this.list.splice(p.path[1], 0, ...p.values.map((v) => this.decoded(String(v))))', '(this.list = this.texts().map((t) => decode(t)))'],
}
const MUTANTS = STORE === 'automerge' ? AUTOMERGE_MUTANTS : {
  // the store hands out a copy of its list every change (R8's entries()):
  // O(n) elements copied per entry
  'entries-copies': ['match/store.js', '    return this.decoded\n', '    return this.decoded.slice()\n'],
  // the store decodes its whole log every change: O(n) decodes per entry
  'decode-every-change': ['match/store.js', '    for (let i = this.decoded.length; i < this.log.length; i++) this.decoded.push(decode(this.log[i]))\n', '    this.decoded = this.log.map((t) => decode(t))\n'],
  // the prefix check compares by content alone: O(n) stringifies per entry
  'same-by-json': ['match/fold.js', 'const same = (a, b) => a === b || (!!a && !!b', 'const same = (a, b) => (!!a && !!b'],
}

if (a['self-test']) {
  const work = join(tmpdir(), `tails-and-scales-cost-${process.pid}`)
  // (a copy outside the repo finds its node_modules through a link)
  const copy = (to) => {
    copyCode(dir, to)
    if (STORE === 'automerge' && !existsSync(join(to, 'node_modules'))) symlinkSync(join(PKG, '..', '..', 'node_modules'), join(to, 'node_modules'))
    return to
  }
  const clean = await run(copy(join(work, 'unbroken')), { quiet: true })
  if (clean.length) {
    console.log(`fold-cost self-test: the unbroken copy fails, so no mutant can be judged: ${clean[0].error}`)
    rmSync(work, { recursive: true, force: true })
    process.exit(1)
  }
  console.log('  unbroken               linear')
  let missed = 0
  for (const [name, [file, from, to]] of Object.entries(MUTANTS)) {
    const pkg = copy(join(work, name))
    const f = join(pkg, file)
    const src = readFileSync(f, 'utf8')
    if (src.split(from).length !== 2) {
      console.log(`  ${name.padEnd(22)} STALE: "${from.trim().slice(0, 50)}" isn't in ${file} exactly once`)
      missed++
      continue
    }
    writeFileSync(f, src.replace(from, to))
    const bad = await run(pkg, { quiet: true })
    console.log(`  ${name.padEnd(22)} ${bad.length ? `caught: ${bad[0].error.slice(0, 150)}` : 'MISSED'}`)
    if (!bad.length) missed++
  }
  rmSync(work, { recursive: true, force: true })
  console.log(missed ? `\nfold-cost self-test FAILED: ${missed} mutant(s) missed or stale` : `\nfold-cost self-test passed: all ${Object.keys(MUTANTS).length} mutants caught`)
  process.exit(missed ? 1 : 0)
}

console.log(`fold-cost: the fold of ${dir === PKG ? 'the working tree' : dir} over the ${STORE === 'automerge' ? 'AutomergeStore (a repo with no network)' : 'LocalStore'}, ${LOG} padded to ${N / 4} and ${N} entries`)
const bad = await run(dir)
for (const b of bad) console.log(`  FAIL ${b.error}`)
console.log(bad.length ? `\nfold-cost FAILED: ${bad.length} problem(s)` : `\nfold-cost passed: folding a log of ${N} entries costs per entry what one of ${N / 4} does, played one entry at a time and reloaded whole (no O(n) decode, copy or stringify per entry)`)
process.exit(bad.length ? 1 : 0)
