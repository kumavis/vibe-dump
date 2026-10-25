// The play-report (DESIGN §4.2.9's row and its thresholds table): whether
// a step's new mechanics actually get played, over the step's AI corpus. A
// step whose report misses a threshold is not done: tune its AI terms or
// data, then re-record. F7a's row, over the `fort/` AI pairs (the
// Skirmish fortified board):
//   - in ≥ 50% of battles some unit stands on a deck by the end of round 3
//     (at the end of round 1, 2 or 3, some unit standing has a floor above
//     the nav's STEP under it);
//   - where the keep stands, its objective is held from the top in ≥ 1
//     battle of 6 (at a round's end the centre objective is held: with
//     height a model counts only within 1.2" of the objective's floor, the
//     keep's top, core/queries.js controlOf).
// Beside the thresholds it reports what else the battles did with height
// (the units deployed onto the works, ladders climbed, moves onto a deck,
// fights on one), read off the match as it is folded (sim/height-probe.mjs:
// never the trace, which has no floors).
//
//   node sim/play-report.mjs                    the fort/ AI pairs, on the working tree's core
//   node sim/play-report.mjs --sweep 24 [--seed S]   a seeded sweep of fortified AI battles instead
//   --pin | --ref <ref> | --dir <packageDir>    another copy of the code
//
// With no fort/ AI pair in the corpus (before F7a's corpus commit) it sweeps
// 24. Each battle is folded in this process through the code's own Folder
// (sim/run.mjs foldJob), as parity folds it; a battle that stops short is a
// failure, named. Exit 0 when every threshold holds, 1 below one (or a
// battle failed), 2 for a usage error.
import { parseArgs } from 'node:util'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { loadCorpus } from './lib.mjs'
import { foldJob, loadMatch } from './run.mjs'
import { heightProbe } from './height-probe.mjs'
import { codeDir, readPin } from './oracle/pin.mjs'
import { setupFor, mulberry32 } from './oracle/human-bot.mjs'

const { values: a } = parseArgs({ options: { sweep: { type: 'string' }, seed: { type: 'string' }, pin: { type: 'boolean' }, ref: { type: 'string' }, dir: { type: 'string' } } })
const SWEEP = a.sweep === undefined ? null : Number(a.sweep)
if (SWEEP !== null && !(Number.isInteger(SWEEP) && SWEEP > 0)) {
  console.error('play-report: --sweep takes a whole number of battles, 1 or more')
  process.exit(2)
}
const dir = a.dir ?? codeDir(a.pin ? readPin() : a.ref ?? 'WORKTREE')
const core = await import(pathToFileURL(join(dir, 'core', 'index.js')).href)
const match = await loadMatch(dir)

// the battles: the fort/ AI pairs, or a sweep (seeded as corpus-add's
// candidates are: board and dice drawn from the seed's own stream)
const pairs = loadCorpus().items.filter((it) => it.set === 'fort' && it.kind === 'ai')
const sweep = (n) => Array.from({ length: n }, (_, i) => {
  const r = mulberry32(Number(a.seed ?? 7000) + i + 1)
  const setup = { ...setupFor('watch', 1 + Math.floor(r() * 99999), 1 + Math.floor(r() * 999999)), terrain: 'fortified' }
  return { id: `sweep-${setup.board}-${setup.dice}`, job: { setup, entries: [] } }
})
const battles = SWEEP !== null || !pairs.length ? sweep(SWEEP ?? 24) : pairs
const what = SWEEP !== null || !pairs.length ? `a sweep of ${battles.length} fortified AI battles (no fort/ AI pair is in the corpus${SWEEP !== null ? ', or --sweep' : ''})` : `the ${battles.length} fort/ AI pairs`
console.log(`play-report (F7a): ${what}, on the core of ${a.dir ?? (a.pin ? `the PIN (${readPin().slice(0, 9)})` : a.ref ?? 'the working tree')}`)

const rows = [], failed = []
for (const b of battles) {
  const probe = heightProbe(core.q)
  const res = foldJob(core, b.job, { match, probe })
  const p = probe.result()
  if (res.error || !p.height) {
    failed.push(`${b.id}: ${res.error ? res.error.split('\n')[0] : 'its board built no height layer (not a fortified board?)'}`)
    continue
  }
  rows.push({ id: b.id, ...p, rounds: res.over?.round })
  console.log(`  ${b.id.padEnd(28)} deck at the end of rounds ${p.deckRounds.join(',') || '-'}${p.deckBy3 ? ' (by 3)' : ''}; deployed on decks ${p.deployed}; ladders ${p.climbs} (${p.up} up); onto a deck ${p.ontoDeck}; deck fights ${p.deckFights}${p.keep ? `; the keep, held at ${p.keepHeld} round end${p.keepHeld === 1 ? '' : 's'}` : ''}`)
}
for (const f of failed) console.log(`  FAILED ${f}`)

const n = rows.length
const deck = rows.filter((r) => r.deckBy3).length
const keeps = rows.filter((r) => r.keep), held = keeps.filter((r) => r.keepHeld > 0).length
const sum = (k) => rows.reduce((s, r) => s + r[k], 0)
const pct = (x, y) => (y ? `${Math.round((100 * x) / y)}%` : '-')
console.log(`\n  ${n} battles: units deployed onto decks ${sum('deployed')}, ladders climbed ${sum('climbs')} (${sum('up')} up) in ${rows.filter((r) => r.climbs).length} battles, moves onto a deck ${sum('ontoDeck')} in ${rows.filter((r) => r.ontoDeck).length}, fights on a deck in ${rows.filter((r) => r.deckFights).length}`)
const checks = [
  { name: 'a unit on a deck by the end of round 3', ok: n > 0 && deck * 2 >= n, got: `${deck} of ${n} battles (${pct(deck, n)})`, want: '≥ 50%' },
  { name: 'the keep\'s objective held from its top', ok: keeps.length > 0 && held * 6 >= keeps.length, got: keeps.length ? `${held} of the ${keeps.length} battles the keep stands in (${pct(held, keeps.length)})` : 'no battle has the keep, so this cannot be judged', want: '≥ 1 battle of 6' },
]
for (const c of checks) console.log(`  ${c.ok ? 'ok  ' : 'FAIL'} ${c.name}: ${c.got}, against ${c.want}`)
const bad = checks.filter((c) => !c.ok).length + failed.length
console.log(bad ? `\nplay-report: ${checks.filter((c) => !c.ok).length} threshold(s) missed, ${failed.length} battle(s) failed` : '\nplay-report: every F7a threshold holds')
process.exit(bad ? 1 : 0)
