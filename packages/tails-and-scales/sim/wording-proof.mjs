// The wording proof (the units rename, DESIGN's Units section): that a
// change to the battle log's words moved nothing else. It replays every
// corpus battle on the working tree's pure core, folded headless through its
// Folder as parity's default run is, and holds each run to the corpus as
// recorded before the rewording:
//   - the same number of trace lines, and every full-precision shadow
//     snapshot the same, hash for hash (the shadow has no text: a battle
//     whose dice, places, wounds or scenery moved fails here);
//   - every trace line either its recorded hash, or a `log` line whose words
//     put back (WAS, below: today's "6.3 tails" as the inch mark it was)
//     give exactly its recorded hash; a state line (an act, a phase, a round)
//     never differs;
//   - every battle-log write likewise: its recorded hash, or the same write
//     with the words put back.
// So the only lines that differ are log lines, and each differs by the
// wording alone. Then `node sim/parity.mjs --record` may take the new
// hashes (a commit of its own, the PIN moved to the code that made them).
//
//   node sim/wording-proof.mjs [--only <kinds, sets or ids>] [--base <git ref>]
//
// --base reads the recorded corpus from that commit (its sim/baselines)
// instead of the working tree's: for a branch whose own corpus is already
// recorded again, against the commit before. Exit 0 when every battle
// holds, 1 when one doesn't, 2 on a usage error.
//
// WAS is the rewording's inverse, and it must be exact: here the tail's word
// after a number back to the inch mark (`(\d) tails?` → `$1"`), from
// core/rules.js's LENGTH. No log line held a digit and " tail" before the
// rename, so the inverse is one to one. A later rewording edits WAS.
import { parseArgs } from 'node:util'
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { loadCorpus, select, runOracle, pool, CPUS, h10, hashLines, CORE_RUNNER } from './lib.mjs'
import { PKG } from './oracle/pin.mjs'

const { values: a } = parseArgs({ options: { only: { type: 'string' }, base: { type: 'string' } } })
const { LENGTH } = await import(pathToFileURL(join(PKG, 'core', 'rules.js')).href)
const word = new RegExp(`(\\d) (?:${LENGTH.one}|${LENGTH.many})\\b`, 'g')
const WAS = (line) => line.replace(word, '$1"')

const { items: all } = loadCorpus()
const items = select(all, a.only)
// the recorded hashes each battle is held to: the working tree's corpus, or --base's
const recorded = (() => {
  if (!a.base) return (it) => it
  const show = (p) => JSON.parse(execFileSync('git', ['-C', PKG, 'show', `${a.base}:./sim/baselines/${p}`], { encoding: 'utf8', maxBuffer: 1 << 28 }))
  const pairs = show('pairs.json').pairs
  return (it) => (it.set === undefined ? pairs.find((p) => p.seed === it.seed && p.dice === it.dice) : show(`${it.set}/${it.id}.json`))
})()
const folder = existsSync(join(PKG, 'match', 'fold.js'))
console.log(`wording-proof: ${items.length} battles on the pure core of the working tree, folded headless${folder ? ' through its Folder' : ''}, against the corpus ${a.base ? `of ${a.base}` : 'as committed in the working tree'}`)

// a stream's lines against its recorded hashes: { same, reworded, wrong: [i, line] }
function judge(lines, hashes, isLog) {
  const hs = hashes ? hashes.split(' ') : []
  const out = { same: 0, reworded: 0, wrong: [] }
  if (lines.length !== hs.length) out.wrong.push([Math.min(lines.length, hs.length), `${lines.length} lines, ${hs.length} recorded`])
  for (let i = 0; i < Math.min(lines.length, hs.length); i++) {
    const l = lines[i]
    if (h10(l) === hs[i]) out.same++
    else if (isLog(l) && WAS(l) !== l && h10(WAS(l)) === hs[i]) out.reworded++
    else out.wrong.push([i, l])
  }
  return out
}

const t0 = Date.now()
const results = await pool(items, CPUS, (it) => runOracle(it.job, PKG, { runner: CORE_RUNNER }).catch((e) => ({ trace: [], shadow: [], written: [], error: e.message })))
const sets = new Map()
let bad = 0
items.forEach((it, i) => {
  const r = results[i], rec = recorded(it)
  const why = []
  if (r.error) why.push(`stopped: ${r.error}`)
  if (folder && r.via !== 'folder') why.push(`folded ${r.via ?? 'by no named way'}, not through the Folder`)
  if (r.trace.length !== rec.n) why.push(`${r.trace.length} trace lines, ${rec.n} recorded`)
  const shadowSame = hashLines(r.shadow ?? []) === rec.shadow
  if (!shadowSame) why.push('a shadow snapshot differs')
  const tr = judge(r.trace, rec.trace, (l) => l.startsWith('log '))
  const wr = judge(r.written ?? [], rec.written, () => true)
  for (const [k, j] of [['trace', tr], ['written', wr]]) if (j.wrong.length) why.push(`${k} line ${j.wrong[0][0]} is neither as recorded nor reworded: ${String(j.wrong[0][1]).slice(0, 160)}${j.wrong.length > 1 ? ` (and ${j.wrong.length - 1} more)` : ''}`)
  const state = r.trace.filter((l) => !l.startsWith('log ')).length
  const set = it.set ?? 'pairs'
  const s = sets.get(set) ?? { battles: 0, ok: 0, lines: 0, state: 0, logs: 0, reworded: 0, written: 0, writes: 0, shadows: 0 }
  Object.assign(s, { battles: s.battles + 1, ok: s.ok + (why.length ? 0 : 1), lines: s.lines + r.trace.length, state: s.state + state, logs: s.logs + (r.trace.length - state), reworded: s.reworded + tr.reworded, written: s.written + wr.reworded, writes: s.writes + (r.written?.length ?? 0), shadows: s.shadows + (shadowSame ? r.shadow.length : 0) })
  sets.set(set, s)
  if (why.length) bad++
  console.log(`  ${why.length ? 'FAIL' : 'ok  '} ${it.id.padEnd(30)} ${String(r.trace.length).padStart(4)} lines, ${String(tr.reworded).padStart(3)} log lines reworded, ${String(wr.reworded).padStart(3)} writes reworded, ${String(r.shadow?.length ?? 0).padStart(4)} shadows${shadowSame ? ' identical' : ''}${why.length ? `: ${why.join('; ')}` : ''}`)
})
console.log('\nby set: battles held; trace lines (state lines identical, log lines reworded of all log lines); battle-log writes reworded; shadows identical')
const total = { battles: 0, ok: 0, lines: 0, state: 0, logs: 0, reworded: 0, written: 0, writes: 0, shadows: 0 }
for (const [set, s] of sets) {
  for (const k in total) total[k] += s[k]
  console.log(`  ${set.padEnd(8)} ${s.ok}/${s.battles}; ${s.lines} lines (${s.state} state lines identical, ${s.reworded} of ${s.logs} log lines reworded); ${s.written} of ${s.writes} writes reworded; ${s.shadows} shadows identical`)
}
console.log(`  ${'all'.padEnd(8)} ${total.ok}/${total.battles}; ${total.lines} lines (${total.state} state lines identical, ${total.reworded} of ${total.logs} log lines reworded); ${total.written} of ${total.writes} writes reworded; ${total.shadows} shadows identical  (${((Date.now() - t0) / 1000).toFixed(0)} s)`)
console.log(bad ? `\nwording-proof FAILED: ${bad} battle(s) moved more than their words` : `\nwording-proof passed: in all ${items.length} battles only log lines differ, each by its words alone; every state line and every shadow is as recorded`)
process.exit(bad ? 1 : 0)
