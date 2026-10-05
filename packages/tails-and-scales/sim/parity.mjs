// The parity gate: replay every battle in the corpus (sim/baselines) and
// check each trace line, each full-precision shadow snapshot and each
// battle-log write against the recorded hashes. Behaviour is frozen during
// the refactor, so any difference is a regression; the first diverging line
// is printed with context taken from the PIN code (sim/oracle/PIN),
// regenerated on demand. Passing needs only the hashes, so a clone without
// the PIN commit can still run the gate.
//
//   npm run parity -w @vibe-dump/tails-and-scales     the working tree, in Node
//   node sim/parity.mjs --browser                     the same in Chromium (P-browser)
//   node sim/parity.mjs --pin | --ref <ref> | --dir <packageDir>   other code
//   node sim/parity.mjs --only ai,hotseat,4242-99     a subset: kinds, modes or ids
//   node sim/parity.mjs --dump <dir>                  also write every full trace, shadow and log
//   node sim/parity.mjs --record [--browser]          rewrite the hashes from the code under test
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
// the commit: first in Node, then with --browser, which records only
// Chromium's shadow (`webShadow`, where it differs from Node's) and refuses
// if any trace or battle-log write differs from Node's. A re-record moves
// sim/oracle/PIN to the commit whose code produced the new hashes (see its
// header), and `node sim/parity.mjs --pin` must pass after it.
import { parseArgs } from 'node:util'
import { mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { loadCorpus, select, savePairs, saveHuman, humanRecord, runOracle, pool, CPUS, firstDiff, hashLines, verdict, explain, tag, buildApp } from './lib.mjs'
import { codeDir, readPin, PKG } from './oracle/pin.mjs'

const { values: a } = parseArgs({
  options: {
    browser: { type: 'boolean' }, pin: { type: 'boolean' }, ref: { type: 'string' }, dir: { type: 'string' },
    only: { type: 'string' }, dump: { type: 'string' }, record: { type: 'boolean' }, dist: { type: 'string' },
  },
})
const { pairs, items: all } = loadCorpus()
const items = select(all, a.only)
if (!items.length) {
  console.error('parity: the corpus is empty')
  process.exit(2)
}
const pin = readPin()
const dir = a.dir ? resolve(a.dir) : codeDir(a.pin ? pin : a.ref ?? 'WORKTREE')
const code = a.dir ? dir : a.pin ? `the PIN (${pin})` : a.ref ? `ref ${a.ref}` : 'the working tree'
const what = a.browser ? `Chromium on ${a.dist ? resolve(a.dist) : `a fresh build of ${code}`}` : code
console.log(`parity: ${items.length} battles (${items.filter((i) => i.kind === 'ai').length} AI, ${items.filter((i) => i.kind === 'human').length} human) on ${what}`)
if (pin === 'WORKTREE') console.log('  (sim/oracle/PIN is still WORKTREE, so references come from the working tree, not frozen code)')
const engines = pairs.engines ?? {}
const engine = a.browser ? 'chromium' : 'node'
const partial = items.length < all.length

const t0 = Date.now()
const opt = { browser: !!a.browser }
const report = (r, it) => {
  const v = verdict(it, r, opt)
  console.log(`  ${it.kind.padEnd(5)} ${it.id.padEnd(24)} ${String(r.trace.length).padStart(4)} lines ${String(r.shadow?.length ?? 0).padStart(4)} states ${String(r.written?.length ?? 0).padStart(4)} writes  ${a.record ? 'recorded' : tag(v, r)}${r.secs !== undefined ? `  (${r.secs} s)` : ''}`)
  return v
}
let results, running = process.version, tmpBuild = null
if (a.browser) {
  const { runBrowser, chromiumVersion, DIST } = await import('./chromium.mjs')
  running = await chromiumVersion()
  if (a.record && partial && engines.chromium && engines.chromium !== running) {
    console.error(`not recording: the corpus's webShadow comes from Chromium ${engines.chromium}, this is ${running}; re-record all of it (no --only), or set CHROMIUM_PATH to that build`)
    process.exit(2)
  }
  // Chromium runs a build of exactly the code under test, never a stale dist/
  let dist = a.dist ? resolve(a.dist) : null
  if (!dist && dir === PKG) {
    const { build } = await import('vite')
    await build({ root: PKG, configFile: join(PKG, 'vite.config.js'), logLevel: 'warn' })
    dist = DIST
  } else if (!dist) dist = tmpBuild = await buildApp(dir, join(tmpdir(), `tails-and-scales-parity-${process.pid}`))
  console.log(`  Chromium ${running}${engines.chromium && engines.chromium !== running ? ` (the corpus's webShadow was recorded on ${engines.chromium})` : ''}, build ${dist}`)
  results = await runBrowser(items.map((it) => it.job), { dist, each: (r, _, i) => report(r, items[i]) })
} else {
  if (a.record && partial && engines.node && engines.node !== running) {
    console.error(`not recording: the corpus's shadow comes from Node ${engines.node}, this is ${running}; re-record all of it (no --only), or use that Node`)
    process.exit(2)
  }
  results = await pool(items, CPUS, (it) => runOracle(it.job, dir).catch((e) => ({ trace: [], shadow: [], written: [], error: e.message }))
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
  // Chromium records only its shadow, and only where its traces and battle
  // logs are Node's: admission means the two engines agree on those
  const bad = results.map((r, i) => (r.error || (a.browser && (firstDiff(r.trace, items[i].trace) >= 0 || firstDiff(r.written, items[i].written) >= 0))) && items[i].id).filter(Boolean)
  if (bad.length) {
    console.error(`not recording: ${bad.join(', ')} ${a.browser ? 'stopped short, or traced or wrote its battle log differently from Node' : 'stopped short'}`)
    process.exit(1)
  }
  const stale = []
  items.forEach((it, i) => {
    const r = results[i]
    let rec
    if (a.browser) rec = { webShadow: hashLines(r.shadow) === it.shadow ? undefined : hashLines(r.shadow) }
    else {
      rec = { n: r.trace.length, trace: hashLines(r.trace), shadow: hashLines(r.shadow), written: hashLines(r.written) }
      // Chromium's shadow stays valid while Node's is unchanged; where the
      // play changed, it is dropped until --record --browser re-takes it
      if (it.webShadow && rec.shadow !== it.shadow) (rec.webShadow = undefined), stale.push(it.id)
    }
    Object.assign(it, rec)
    if (it.kind === 'ai') Object.assign(pairs.pairs.find((p) => p.seed === it.seed && p.dice === it.dice), rec)
    else saveHuman(it.id, humanRecord(it))
  })
  pairs.engines = { ...engines, [engine]: running }
  savePairs(pairs)
  console.log(`recorded ${items.length} battles on ${a.browser ? 'Chromium' : 'Node'} ${running}`)
  if (stale.length) console.log(`\n${stale.length} battles changed play and lost their Chromium shadow (${stale.join(', ')}): run node sim/parity.mjs --record --browser before P-browser can pass`)
  else if (!a.browser) console.log('\nnow node sim/parity.mjs --record --browser, to re-take Chromium\'s shadow where it differs')
  console.log(`then move sim/oracle/PIN (its first line) to the commit whose code produced these hashes, in the same push, and check that node sim/parity.mjs --pin passes`)
  process.exit(0)
}

const bad = []
for (let i = 0; i < items.length; i++) {
  const v = verdict(items[i], results[i], opt)
  if (!v.ok) bad.push({ it: items[i], r: results[i], v })
}
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
  let ref = !pinDir || (!a.browser && dir === pinDir) ? null : await runOracle(it.job, pinDir).catch(() => null)
  // context only from a PIN that still reproduces this battle's hashes
  const pinStale = ref && !verdict(it, ref).ok
  if (pinStale) ref = null
  console.log(`\n${it.kind} ${it.id}:\n${explain(it, r, v, ref)}`)
  if (pinStale) {
    console.log(pin === 'WORKTREE'
      ? '   (the PIN is still WORKTREE, this same code, so there is no frozen reference text: hashes only)'
      : '   (the PIN code no longer reproduces this battle\'s recorded hashes: re-recorded without moving sim/oracle/PIN? so hashes only)')
  }
  if (a.browser && it.webShadow && v.line < 0 && v.shadow >= 0 && ref) console.log('   (the context is Node\'s shadow, which differs from Chromium\'s by an ULP of terrain anyway)')
}
// a shadow-only failure on another engine than the one that recorded it may
// be the engine, not the code: Chromium's sin/cos changed between builds
// before; Node 20-22 agree on every Math function the logic uses
const shadowOnly = bad.length && bad.every(({ r, v }) => !r.error && v.line < 0 && v.written < 0)
if (shadowOnly && engines[engine] && engines[engine] !== running) {
  console.log(a.browser
    ? `\nOnly shadows differ, under Chromium ${running}, but webShadow was recorded on Chromium ${engines.chromium}: re-check with CHROMIUM_PATH set to that build before treating this as a regression.`
    : `\n(only shadows differ; they were recorded on Node ${engines.node} and this is ${running}, though Node 20-22 agree on every Math function the logic uses)`)
}
const secs = Math.round((Date.now() - t0) / 1000)
console.log(bad.length ? `\n${bad.length} of ${items.length} battles differ (${secs} s)` : `all ${items.length} battles replay identically: traces, shadows and battle logs (${secs} s)`)
process.exit(bad.length ? 1 : 0)
