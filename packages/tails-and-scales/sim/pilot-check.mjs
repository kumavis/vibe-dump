// P-auto (DESIGN §4.2.9's row; F10b): `pilot` naming every standing unit of
// the seat, then `end`, is `auto`. The same trace, the same dice (rngState)
// and the same match (stateHash) at every phase's end, for every corpus
// battle's seeds. Folded headless through the pure core, `strict` (every AI
// command held to legal()), two matches in step:
//   - every corpus battle's board, dice and races with both seats the
//     human's: each deploys at once (`deployed`), then match A answers every
//     phase with `auto` and match B with `pilot` (when legal: some unit can
//     act) and `end`. No overtime vote, so a battle plays its rounds;
//   - every corpus human log, played as it is by A and by B, but for each
//     `auto` B sends `pilot` and `end` instead: an Auto part-way through a
//     phase (after the seat's own moves, an advance's roll held) is held to
//     the pilot too.
// After each phase (each `auto`, and B's pair) the two must agree; at the
// end they must have played as many phases, and the pilots must have done
// something (a check that pilots nothing passes nothing).
//
//   node sim/pilot-check.mjs [--only ids] [--self-test]
//
// --self-test plants faults in a copy of the core (a pilot that leaves out
// a named unit, one that rolls a die of its own, one that logs a line, a
// mask whose bits count only the standing units, so they shift as units
// die) and expects each to be caught. Exit 0 when everything holds.
import { parseArgs } from 'node:util'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadCorpus, select, copyCode } from './lib.mjs'
import { jobSetup } from './run.mjs'

const PKG = fileURLToPath(new URL('..', import.meta.url))
const { values: a } = parseArgs({ options: { only: { type: 'string' }, 'self-test': { type: 'boolean' } } })

// the pilot naming every standing unit of the seat's, by the core's own
// door (maskOf), or null when no unit could act (the core refuses it)
function pilotAll(core, G, seat) {
  const ids = G.units.filter((u) => u.side === seat && core.q.alive(u)).map((u) => u.id)
  const body = { t: 'pilot', m: core.q.maskOf(G, seat, ids) }
  return core.legal(G, seat, body) === null ? body : null
}

const look = (core, G) => ({ trace: G.journal.trace.length, last: G.journal.trace.at(-1) ?? '', rng: core.q.rngState(G.rng), hash: core.stateHash(G) })
function apart(core, A, B, where) {
  const x = look(core, A), y = look(core, B)
  if (x.rng !== y.rng) return `${where}: the dice apart (auto ${x.rng}, pilot ${y.rng})`
  if (x.hash !== y.hash) return `${where}: the match apart (auto ${x.hash}, pilot ${y.hash})`
  if (x.trace !== y.trace || A.journal.trace.join('\n') !== B.journal.trace.join('\n')) {
    const k = A.journal.trace.findIndex((l, i) => l !== B.journal.trace[i])
    return `${where}: the trace apart at line ${k < 0 ? Math.min(x.trace, y.trace) : k} (auto "${A.journal.trace[k] ?? '(none)'}", pilot "${B.journal.trace[k] ?? '(none)'}")`
  }
  return null
}

// One battle's two runs. `entries`: a human log's (A plays it, B the same
// with its Autos as pilots); none: both seats human, every phase Auto'd.
function pair(core, setup, entries, out) {
  const A = core.createMatch(setup, { out: null, strict: true })
  const B = core.createMatch(setup, { out: null, strict: true })
  let n = 0
  const step = (seat, body) => {
    core.apply(A, seat, body)
    if (body.t !== 'auto') {
      core.apply(B, seat, body)
      return apart(core, A, B, `after ${body.t}`)
    }
    const p = pilotAll(core, B, seat)
    if (p) {
      const before = core.q.rngState(B.rng) + B.journal.trace.length
      core.apply(B, seat, p)
      out.pilots++
      if (core.q.rngState(B.rng) + B.journal.trace.length !== before) out.acted++
    } else out.idle++
    core.apply(B, seat, { t: 'end' })
    out.phases++
    return apart(core, A, B, `phase ${++n}`)
  }
  if (entries) {
    for (const [k, e] of entries.entries()) {
      const { s, ...body } = e
      const why = step(s, body)
      if (why) return `entry ${k}, ${why}`
    }
    return A.turn.stage === B.turn.stage ? null : `at the log's end: auto ${A.turn.stage}, pilot ${B.turn.stage}`
  }
  for (let k = 0; A.turn.stage !== 'over'; k++) {
    if (k > 3000) return 'the battle never ends'
    const P = A.pending
    if (!P || B.pending?.k !== P.k) return `decision ${k}: auto waits on ${JSON.stringify(P)}, pilot on ${JSON.stringify(B.pending)}`
    const seat = P.seats[0]
    const why = step(seat, P.k === 'deploy' ? { t: 'deployed' } : P.k === 'phase' ? { t: 'auto' } : null)
    if (why) return why
  }
  return B.turn.stage === 'over' ? apart(core, A, B, 'the end') : `auto's battle is over, pilot's is ${B.turn.stage}`
}

async function run(dir, { only, say = console.log } = {}) {
  const core = await import(pathToFileURL(join(dir, 'core', 'index.js')).href)
  const items = select(loadCorpus().items, only)
  const out = { phases: 0, pilots: 0, acted: 0, idle: 0, bad: [] }
  const t0 = Date.now()
  for (const it of items) {
    const setup = jobSetup(it.job)
    const all = { ...setup, overtime: 'never', seats: setup.seats.map((s) => ({ ...s, ctrl: 'human' })) }
    for (const [what, s, entries] of [['every phase', all, null], ...(it.kind === 'human' ? [['its log', setup, it.job.entries]] : [])]) {
      let why
      try {
        why = pair(core, s, entries, out)
      } catch (e) {
        why = `threw: ${e.message}`
      }
      if (why) out.bad.push(`${it.id} (${what}): ${why}`)
    }
  }
  const ok = !out.bad.length && out.acted > 0
  say(`  ${ok ? 'ok  ' : 'FAIL'} ${items.length} battles, ${out.phases} phases: ${out.pilots} pilots (${out.acted} played something), ${out.idle} with nobody able to act, each the same battle as its Auto (${((Date.now() - t0) / 1000).toFixed(0)} s)${out.bad.length ? `\n         ${out.bad.slice(0, 6).join('\n         ')}` : ''}${!out.acted ? '\n         no pilot played anything' : ''}`)
  return ok ? 0 : 1
}

const MUTANTS = [
  ['skips-first', 'core/ai/policy.js', 'const mask = (u) => !only || only.includes(u)', 'const mask = (u) => !only || (only.includes(u) && u !== only[0])'],
  ['rolls-own', 'core/commands.js', '    runAI(G, seat, G.pending.phase, maskUnits(G, seat, m))\n', '    G.rng.n++\n    runAI(G, seat, G.pending.phase, maskUnits(G, seat, m))\n'],
  ['logs-line', 'core/commands.js', '    runAI(G, seat, G.pending.phase, maskUnits(G, seat, m))\n', "    log(G, seat, 'Autopilot.')\n    runAI(G, seat, G.pending.phase, maskUnits(G, seat, m))\n"],
  ['standing-bits', 'core/queries.js', 'export function maskUnits(G, seat, m) {\n  const mine = G.units.filter((u) => u.side === seat), out = []', 'export function maskUnits(G, seat, m) {\n  const mine = G.units.filter((u) => u.side === seat && alive(u)), out = []'],
]

if (a['self-test']) {
  console.log('pilot-check self-test: each planted fault caught\n')
  let bad = 0
  for (const [name, file, from, to] of MUTANTS) {
    const dir = copyCode(PKG, mkdtempSync(join(tmpdir(), `pilot-${name}-`)))
    try {
      const p = join(dir, file), text = readFileSync(p, 'utf8')
      if (text.split(from).length !== 2) {
        console.log(`  FAIL ${name}: its anchor is not in ${file} exactly once (stale mutant)`)
        bad++
        continue
      }
      writeFileSync(p, text.replace(from, () => to))
      const lines = []
      const failed = await run(dir, { only: a.only ?? 'hotseat-late-8,bushtail-random-6,64-89', say: (l) => lines.push(l) })
      console.log(`  ${failed ? 'ok  ' : 'FAIL'} ${name.padEnd(12)} ${failed ? `caught: ${(lines.join(' ').split('\n')[1] ?? lines[0]).trim().slice(0, 110)}` : 'not caught'}`)
      if (!failed) bad++
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  }
  console.log(bad ? `\npilot-check self-test FAILED: ${bad} problem(s)` : `\npilot-check self-test passed: ${MUTANTS.length} faults, each caught`)
  process.exit(bad ? 1 : 0)
}
console.log('pilot-check (P-auto): a pilot naming every standing unit, then End, against Auto, on every corpus battle\n')
const failed = await run(PKG, { only: a.only })
console.log(failed ? '\npilot-check FAILED' : '\npilot-check passed: a pilot of the whole army and End play the battle Auto plays, phase by phase')
process.exit(failed)
