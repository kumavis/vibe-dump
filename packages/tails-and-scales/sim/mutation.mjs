// The parity gate must catch a single wrong die. Copy the PIN code, make one
// die come up wrong (the Nth d6 of each battle shows 7 − v; the logic RNG is
// untouched) and run the corpus on the mutant: parity has to fail, and for
// every battle the line it names must be exactly where the mutant's full
// trace first departs from the reference.
//
//   node sim/mutation.mjs [--die 40] [--only ai,hotseat,…] [--browser | --core]
//
// --browser also builds the mutant and checks three battles in Chromium.
// --core (R6a) judges the headless gate instead, `parity.mjs --core` (the
// default runner since R6b; without --core the mutant is the PIN's, which
// has no pure core, so its CLI line runs `parity.mjs --page`): the
// mutant is a copy of the working tree with the swap in its core, folded
// by sim/run.mjs, and the reference is the working tree's own core (the
// PIN's code has none), which must reproduce the corpus first. A human log
// whose entries the swap makes illegal stops at that entry, which parity
// reports too.
// Exit 0 passed, 1 failed, 2 inconclusive: the swap changed no battle (a die
// past the end of every battle, which roll a few hundred d6 each, or one
// whose outcome didn't depend on it), so pick another --die; or the PIN code
// itself no longer reproduces the corpus (re-recorded without moving
// sim/oracle/PIN), so it can't say where the mutant ought to part.
import { parseArgs } from 'node:util'
import { readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { spawnSync } from 'node:child_process'
import { loadCorpus, select, runOracle, pool, CPUS, copyCode, buildApp, verdict, SIM, CORE_RUNNER } from './lib.mjs'
import { codeDir, readPin } from './oracle/pin.mjs'

const { values: a } = parseArgs({ options: { die: { type: 'string' }, only: { type: 'string' }, browser: { type: 'boolean' }, core: { type: 'boolean' } } })
if (a.core && a.browser) {
  console.error('--core judges the headless fold in Node; it takes no --browser')
  process.exit(2)
}
const N = Number(a.die ?? 40)
if (!Number.isInteger(N) || N < 1) {
  console.error('--die takes a positive integer: which d6 of each battle to swap')
  process.exit(2)
}
const { items: all } = loadCorpus()
const items = select(all, a.only)
// the code the mutant is copied from, and the reference it is judged against
const pinDir = codeDir(a.core ? 'WORKTREE' : readPin())
const whose = a.core ? "the working tree's pure core" : 'the PIN code'
const how = a.core ? { runner: CORE_RUNNER } : {}
const work = join(tmpdir(), `tails-and-scales-mutant-${process.pid}`)
const mutant = copyCode(pinDir, join(work, 'pkg'))

// the mutation: one die, by its index in the battle. The d6 definition is
// found by shape in rules.js or core/rules.js, so the check keeps working
// when the PIN moves to refactored code; if neither holds it, say so.
const D6 = /export const d6 = \(([^)]*)\) => 1 \+ Math\.floor\(([^)]+)\(([^)]*)\) \* 6\)/
const rules = ['rules.js', join('core', 'rules.js')].map((f) => join(mutant, f)).find((f) => existsSync(f) && D6.test(readFileSync(f, 'utf8')))
if (!rules) {
  console.log(`\nmutation check INCONCLUSIVE: no \`export const d6 = (…) => 1 + Math.floor(draw(…) * 6)\` in ${whose} to swap; update sim/mutation.mjs for it.`)
  rmSync(work, { recursive: true, force: true })
  process.exit(2)
}
const src = readFileSync(rules, 'utf8')
writeFileSync(rules, src.replace(D6, (_, args, draw, dargs) => `let rolled = 0 // MUTANT: die #${N} comes up 7 − v\nexport const d6 = (${args}) => { const v = 1 + Math.floor(${draw}(${dargs}) * 6); return ++rolled === ${N} ? 7 - v : v }`))
console.log(`mutant: ${mutant} (die #${N} of each battle swapped${a.core ? ', folded headless by sim/run.mjs' : ''})`)

const fail = (e) => ({ trace: [], shadow: [], written: [], error: e.message })
const [mut, ref] = await Promise.all([
  pool(items, Math.ceil(CPUS / 2), (it) => runOracle(it.job, mutant, how).catch(fail)),
  pool(items, Math.floor(CPUS / 2) || 1, (it) => runOracle(it.job, pinDir, how).catch(fail)),
])
// the reference has to be right before the mutant can be judged against it
const off = items.filter((it, i) => !verdict(it, ref[i]).ok)
if (off.length) {
  console.log(`
mutation check INCONCLUSIVE: ${whose} itself doesn't reproduce ${off.length} battles' recorded hashes (${off.slice(0, 5).map((it) => it.id).join(', ')}${off.length > 5 ? ', …' : ''}).`)
  console.log(a.core ? 'Fix that first (node sim/parity.mjs --core).' : 'Was the corpus re-recorded without moving sim/oracle/PIN? Fix that first (node sim/parity.mjs --pin).')
  rmSync(work, { recursive: true, force: true })
  process.exit(2)
}

// where the full texts really part, against what parity named from hashes
const first = (x, y) => {
  for (let i = 0; i < Math.max(x.length, y.length); i++) if (x[i] !== y[i]) return i
  return -1
}
let flagged = 0, changed = 0, wrong = 0
items.forEach((it, i) => {
  const v = verdict(it, mut[i])
  const truth = first(ref[i].trace, mut[i].trace)
  const truthShadow = first(ref[i].shadow, mut[i].shadow)
  const truthWritten = first(ref[i].written, mut[i].written)
  if (truth >= 0 || truthShadow >= 0 || truthWritten >= 0) changed++
  if (!v.ok) flagged++
  const right = v.line === truth && (truth >= 0 || (v.shadow === truthShadow && v.written === truthWritten))
  if (!right) wrong++
  const at = truth >= 0 ? `line ${truth + 1}: ${mut[i].trace[truth]?.slice(0, 110) ?? '(trace ended)'}` : 'trace unchanged'
  console.log(`  ${it.id.padEnd(24)} parity ${v.ok ? 'passes' : `flags line ${v.line + 1}`}; truly ${at}${right ? '' : '   <-- MISMATCH'}`)
})
console.log(`\n${flagged} of ${items.length} battles flagged; ${changed} truly changed; ${wrong} named the wrong line`)
if (!changed) {
  console.log(`\nmutation check INCONCLUSIVE: swapping die #${N} changed no selected battle's trace or shadow, so there was nothing to catch.`)
  console.log('Either every battle ends before that die (they roll a few hundred d6 each) or no outcome depended on it; pick a smaller --die.')
  rmSync(work, { recursive: true, force: true })
  process.exit(2)
}

// and the user-facing CLI says so too, naming the line
const one = items.find((it, i) => !verdict(it, mut[i]).ok)
let cli = true
if (one) {
  // (the PIN's mutant has no pure core: parity plays its page, --page)
  const p = spawnSync(process.execPath, [join(SIM, 'parity.mjs'), a.core ? '--core' : '--page', '--dir', mutant, '--only', one.id], { encoding: 'utf8' })
  console.log(`\n$ node sim/parity.mjs ${a.core ? '--core' : '--page'} --dir <mutant> --only ${one.id}   (exit ${p.status})\n${p.stdout.trim()}`)
  // (a human log the swap makes illegal stops at that entry under --core)
  cli = p.status === 1 && (a.core ? /(DIVERGES at|STOPPED before) trace line \d+/ : /DIVERGES at trace line \d+/).test(p.stdout)
}

let web = true
if (a.browser) {
  const { runBrowser } = await import('./chromium.mjs')
  const dist = await buildApp(mutant, join(work, 'dist'))
  const picks = items.filter((it, i) => !verdict(it, mut[i]).ok).slice(0, 3)
  const res = await runBrowser(picks.map((it) => it.job), { dist })
  console.log('\nChromium on the mutant build:')
  picks.forEach((it, k) => {
    const i = items.indexOf(it), v = verdict(it, res[k], { browser: true })
    const ok = !v.ok && v.line === first(ref[i].trace, res[k].trace)
    if (!ok) web = false
    console.log(`  ${it.id.padEnd(24)} parity ${v.ok ? 'passes' : `flags line ${v.line + 1}`}${ok ? '' : '   <-- WRONG'}`)
  })
}

const pass = flagged > 0 && wrong === 0 && flagged === changed && cli && web
console.log(pass ? '\nmutation check PASSED: one swapped die fails parity, at the right line' : '\nmutation check FAILED')
rmSync(work, { recursive: true, force: true })
process.exit(pass ? 0 : 1)
