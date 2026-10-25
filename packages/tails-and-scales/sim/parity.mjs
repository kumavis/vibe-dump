// The parity gate: replay every battle in the corpus (sim/baselines) and
// check each trace line, each full-precision shadow snapshot and each
// battle-log write against the recorded hashes. Behaviour is frozen during
// the refactor, so any difference is a regression; the first diverging line
// is printed with context taken from the PIN code (sim/oracle/PIN),
// regenerated on demand. Passing needs only the hashes, so a clone without
// the PIN commit can still run the gate.
//
//   npm run parity -w @vibe-dump/tails-and-scales     the working tree's pure core, folded
//   node sim/parity.mjs                               headless (sim/run.mjs: no fake DOM, no three)
//   node sim/parity.mjs --page                        the working tree's page instead: main.js
//                                                     under the fake DOM, through sim/oracle's driver
//   node sim/parity.mjs --browser                     the page in Chromium (P-browser)
//   node sim/parity.mjs --pin | --ref <ref> | --dir <packageDir>   other code
//   node sim/parity.mjs --only ai,hotseat,4242-99     a subset: kinds, modes or ids
//   node sim/parity.mjs --dump <dir>                  also write every full trace, shadow and log
//   node sim/parity.mjs --record [--browser]          rewrite the hashes from the code under test
//
// The runner (R6b). By default the code under test is its pure core, folded
// headless: each AI pair is createMatch from its seeds, each human log
// createMatch then its entries applied for the seats they name, and the
// three streams rebuilt from the match (the G adapter, sim/run.mjs), judged
// exactly as the page's are (`--core` says so explicitly). (R8) Code with a
// Folder (match/fold.js) is folded through it, every entry an envelope
// written, encoded and decoded as a device's store does (sim/run.mjs), and
// a battle that didn't go that way fails. --page plays the
// page instead (sim/oracle/run-legacy.mjs, the driver the PIN and the
// working tree share), as --browser does in Chromium; code with no pure core
// (older than R6) runs only that way, so --dir or --ref to such code needs
// --page, and --pin takes the PIN's own runner. The references (a failure's
// context, mutation.mjs's) come from the PIN by its own runner too: since F4
// the PIN is refactored code, so its pure core (DESIGN's R6b notes: the PIN
// rule, revisited).
//
// --browser builds the code under test first and runs that build: the
// working tree with this package's own Vite config (into dist/), other code
// into a temp dir; `--dist <dir>` runs an existing build as it is instead.
// It honours CHROMIUM_PATH and PARALLEL, and every battle starts from its
// title-screen button. ORACLE_TIMEOUT_MS (default 60 s) stops a Node battle
// that never finishes; it is then reported STOPPED, naming the line it got
// to. An --only token that names no battle is an error (exit 2), never an
// empty pass.
//
// Re-record only for a change that is *meant* to alter play, and say so in
// the commit: in Node (the pure core, or --page), then check it with
// --browser, which must pass as it stands. (N0) The rules' trig is
// core/dmath.js's, so Chromium computes Node's shadow too, and there is
// nothing of its own to record (until N0 the corpus kept Chromium's shadow
// hashes, `webShadow`, where they differed). Code older than N0 still
// differs from them in Chromium, by an ULP of terrain.
// A re-record moves sim/oracle/PIN to the commit whose code produced the new
// hashes (see its header), and `node sim/parity.mjs --pin` must pass after it.
import { parseArgs } from 'node:util'
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { loadCorpus, select, savePairs, saveHuman, humanRecord, runOracle, pool, CPUS, hashLines, verdict, explain, tag, buildApp, CORE_RUNNER, PAGE_RUNNER, runnerOf } from './lib.mjs'
import { codeDir, readPin, PKG } from './oracle/pin.mjs'

const { values: a } = parseArgs({
  options: {
    browser: { type: 'boolean' }, pin: { type: 'boolean' }, ref: { type: 'string' }, dir: { type: 'string' },
    only: { type: 'string' }, dump: { type: 'string' }, record: { type: 'boolean' }, dist: { type: 'string' }, core: { type: 'boolean' }, page: { type: 'boolean' },
  },
})
// (the pure core is folded in Node; Chromium plays the page)
if ((a.core && a.page) || ((a.core || a.page) && a.browser)) {
  console.error('parity: one runner at a time: the pure core (the default, --core), the page in Node (--page) or the page in Chromium (--browser)')
  process.exit(2)
}
const { pairs, items: all } = loadCorpus()
const items = select(all, a.only)
if (!items.length) {
  console.error('parity: the corpus is empty')
  process.exit(2)
}
const pin = readPin()
const dir = a.dir ? resolve(a.dir) : codeDir(a.pin ? pin : a.ref ?? 'WORKTREE')
const code = a.dir ? dir : a.pin ? `the PIN (${pin})` : a.ref ? `ref ${a.ref}` : 'the working tree'
// the Node runner: the page when asked (or the PIN's own, for --pin), else
// the pure core, which code older than R6 doesn't have
const runner = a.page ? PAGE_RUNNER : a.pin && !a.core ? runnerOf(dir) : CORE_RUNNER
if (!a.browser && runner === CORE_RUNNER && !existsSync(join(dir, 'core', 'index.js'))) {
  console.error(`parity: ${code} has no pure core (core/index.js): code older than R6 runs as its page, with --page`)
  process.exit(2)
}
// (R8) the Folder of the code under test, which the pure core's runs must go through
const folder = !a.browser && runner === CORE_RUNNER && existsSync(join(dir, 'match', 'fold.js'))
const what = a.browser ? `Chromium on ${a.dist ? resolve(a.dist) : `a fresh build of ${code}`}` : runner === CORE_RUNNER ? `the pure core of ${code}, folded headless${folder ? ' through its Folder, every entry an envelope' : ''}` : `the page of ${code}, under the fake DOM`
console.log(`parity: ${items.length} battles (${items.filter((i) => i.kind === 'ai').length} AI, ${items.filter((i) => i.kind === 'human').length} human) on ${what}`)
if (pin === 'WORKTREE') console.log('  (sim/oracle/PIN is still WORKTREE, so references come from the working tree, not frozen code)')
const engines = pairs.engines ?? {}
const engine = a.browser ? 'chromium' : 'node'
const partial = items.length < all.length

const t0 = Date.now()
const report = (r, it) => {
  const v = verdict(it, r)
  console.log(`  ${it.kind.padEnd(5)} ${it.id.padEnd(24)} ${String(r.trace.length).padStart(4)} lines ${String(r.shadow?.length ?? 0).padStart(4)} states ${String(r.written?.length ?? 0).padStart(4)} writes  ${a.record ? 'recorded' : tag(v, r)}${r.secs !== undefined ? `  (${r.secs} s)` : ''}`)
  return v
}
let results, running = process.version, tmpBuild = null
if (a.browser) {
  const { runBrowser, chromiumVersion, DIST } = await import('./chromium.mjs')
  running = await chromiumVersion()
  if (a.record) {
    console.error('not recording: since N0 Chromium computes Node\'s shadow, so the corpus holds nothing of its own; record in Node, then check with --browser')
    process.exit(2)
  }
  // Chromium runs a build of exactly the code under test, never a stale dist/
  let dist = a.dist ? resolve(a.dist) : null
  if (!dist && dir === PKG) {
    const { build } = await import('vite')
    await build({ root: PKG, configFile: join(PKG, 'vite.config.js'), logLevel: 'warn' })
    dist = DIST
  } else if (!dist) dist = tmpBuild = await buildApp(dir, join(tmpdir(), `tails-and-scales-parity-${process.pid}`))
  console.log(`  Chromium ${running}, build ${dist}`)
  results = await runBrowser(items.map((it) => it.job), { dist, each: (r, _, i) => report(r, items[i]) })
} else {
  if (a.record && partial && engines.node && engines.node !== running) {
    console.error(`not recording: the corpus's shadow comes from Node ${engines.node}, this is ${running}; re-record all of it (no --only), or use that Node`)
    process.exit(2)
  }
  results = await pool(items, CPUS, (it) => runOracle(it.job, dir, { runner }).catch((e) => ({ trace: [], shadow: [], written: [], error: e.message }))
    .then((r) => (report(r, it), r)))
}
if (tmpBuild) rmSync(tmpBuild, { recursive: true, force: true })

if (a.dump) {
  mkdirSync(a.dump, { recursive: true })
  items.forEach((it, i) => {
    for (const k of ['trace', 'shadow', 'written']) writeFileSync(join(a.dump, `${it.id}.${k}.txt`), (results[i][k] ?? []).join('\n') + '\n')
  })
  console.log(`wrote ${items.length} traces, shadows and battle logs to ${a.dump}`)
}

if (a.record) {
  const bad = results.map((r, i) => r.error && items[i].id).filter(Boolean)
  if (bad.length) {
    console.error(`not recording: ${bad.join(', ')} stopped short`)
    process.exit(1)
  }
  items.forEach((it, i) => {
    const r = results[i]
    const rec = { n: r.trace.length, trace: hashLines(r.trace), shadow: hashLines(r.shadow), written: hashLines(r.written) }
    Object.assign(it, rec)
    if (it.kind === 'ai') Object.assign(pairs.pairs.find((p) => p.seed === it.seed && p.dice === it.dice), rec)
    else saveHuman(it.id, humanRecord(it), it.set)
  })
  pairs.engines = { ...engines, [engine]: running }
  savePairs(pairs)
  console.log(`recorded ${items.length} battles on Node ${running}`)
  console.log('\nnow node sim/parity.mjs --browser, which must pass as recorded')
  console.log(`then move sim/oracle/PIN (its first line) to the commit whose code produced these hashes, in the same push, and check that node sim/parity.mjs --pin passes`)
  process.exit(0)
}

const bad = []
for (let i = 0; i < items.length; i++) {
  const v = verdict(items[i], results[i])
  if (!v.ok) bad.push({ it: items[i], r: results[i], v })
  // (R8) a run of code with a Folder that went straight through its core,
  // or past its Folder (foldJob's `via`: what the run did)
  else if (folder && results[i].via !== 'folder') {
    bad.push({ it: items[i], r: results[i], v: { ...v, ok: false } })
    const how = { core: 'straight through its core', bypassed: 'past its Folder (which did not accept the start and every entry, or whose match is not the one traced)' }
    console.log(`  ${items[i].id}: folded ${how[results[i].via] ?? 'by a runner that names no way'}, not through the Folder`)
  }
}
if (folder) console.log(`  ${results.filter((r) => r.via === 'folder').length} of ${items.length} folded through the Folder`)
// the reference text comes from the PIN code (unless that is what ran),
// fetched only now: without the PIN commit, only the hashes can be shown
let pinDir = null
if (bad.length) {
  try {
    pinDir = codeDir(pin)
  } catch (e) {
    console.log(`\n(${e.message}; so no reference text below, only hashes)`)
  }
}
for (const { it, r, v } of bad) {
  // (by the PIN's own runner: its pure core if it has one, else its page)
  let ref = !pinDir || (!a.browser && dir === pinDir && runner === runnerOf(pinDir)) ? null : await runOracle(it.job, pinDir, { runner: runnerOf(pinDir) }).catch(() => null)
  // context only from a PIN that still reproduces this battle's hashes
  const pinStale = ref && !verdict(it, ref).ok
  if (pinStale) ref = null
  console.log(`\n${it.kind} ${it.id}:\n${explain(it, r, v, ref)}`)
  if (pinStale) {
    console.log(pin === 'WORKTREE'
      ? '   (the PIN is still WORKTREE, this same code, so there is no frozen reference text: hashes only)'
      : '   (the PIN code no longer reproduces this battle\'s recorded hashes: re-recorded without moving sim/oracle/PIN? so hashes only)')
  }
}
// a shadow-only failure may be the engine, not the code: code older than N0
// takes the engine's own Math.sin/cos, which Chromium's build of V8 rounds
// differently from Node's for a few inputs (since N0 the rules' trig is
// core/dmath.js's, the same bits everywhere)
const shadowOnly = bad.length && bad.every(({ r, v }) => !r.error && v.line < 0 && v.written < 0)
if (shadowOnly && a.browser) console.log(`\nOnly shadows differ, in Chromium ${running}: code older than N0 computes its terrain with the engine's Math.sin/cos, an ULP from Node's for a few inputs; the code under test since N0 never does.`)
else if (shadowOnly && engines.node && engines.node !== running) console.log(`\n(only shadows differ; they were recorded on Node ${engines.node} and this is ${running}, though Node 20-22 agree on every Math function the logic uses)`)
const secs = Math.round((Date.now() - t0) / 1000)
console.log(bad.length ? `\n${bad.length} of ${items.length} battles differ (${secs} s)` : `all ${items.length} battles replay identically: traces, shadows and battle logs (${secs} s)`)
process.exit(bad.length ? 1 : 0)
