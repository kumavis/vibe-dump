// The core's cost at scale (DESIGN §4.2.1's performance budget, §4.2.9's
// scale-bench row; S0 on, then every step): the core rows on the classic
// board and on Grand (the Grand fixture, sim/fixtures/grand.mjs, until F8b
// gives the core a `grand` mission), Grand with the ×3 presets and with
// lists at the caps.
//
//   createMatch   a hotseat match made, to its deployment (the board, its
//                 terrain and nav, both armies placed)
//   move phase    an AI seat's movement phase (the time between the trace
//                 lines it writes), p50 / p90 / max
//   battle        a whole AI battle folded quietly (no events kept), as a
//                 rejoin or a peer folds one
//
// A report: classic for reference (§4.2.1's "today" column), and Grand
// against its budget, failing above 1.5× (createMatch 40 ms, a movement
// phase's p90 35 ms, a battle 350 ms, all on the cap lists' row too). The
// cap lists' rows are the AI count budget's trigger (§4.2.2): from F9b, with
// two hulls a side. Timings are the median of each board's (one warm-up
// battle first); a busy machine reads high, so a failure on one is run
// again on a quiet one before it is believed.
//
//   node sim/scale-bench.mjs [--boards N] [--dir <code>] [--json]
//
// --dir measures another copy of the code (the fixture built from it), for
// a before-and-after.
import { parseArgs } from 'node:util'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadCorpus } from './lib.mjs'
import { jobSetup } from './run.mjs'
import { buildGrand, grandSetup } from './fixtures/grand.mjs'

const PKG = fileURLToPath(new URL('..', import.meta.url))
const { values: a } = parseArgs({ options: { boards: { type: 'string' }, dir: { type: 'string' }, json: { type: 'boolean' } } })
const CODE = a.dir ?? PKG
const BUDGET = { create: 40, moveP90: 35, battle: 350 }
const OVER = 1.5

const pct = (xs, p) => {
  const s = [...xs].sort((x, y) => x - y)
  return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : NaN
}
const median = (xs) => pct(xs, 0.5)
const ms = (v) => (Number.isFinite(v) ? v.toFixed(1) : '–')

// One row: `setups` [[board, dice], …] on the core in `dir`
async function row(dir, setups, setupOf) {
  const core = await import(pathToFileURL(join(dir, 'core', 'index.js')).href)
  const q = await import(pathToFileURL(join(dir, 'core', 'queries.js')).href)
  const hotseat = (s) => ({ ...s, seats: s.seats.map((x) => ({ ...x, ctrl: 'human' })) })
  // warm up (the JIT), on the first board
  core.createMatch(setupOf(...setups[0]))
  const create = [], battle = [], move = []
  let units = 0
  for (const [b, d] of setups) {
    let t0 = performance.now()
    core.createMatch(hotseat(setupOf(b, d)))
    create.push(performance.now() - t0)
    // the battle, timed whole, with each AI movement phase's share: the time
    // from one trace line to the next is the phase's whose line it follows
    let last = 0, key = null, phase = 0
    const close = () => {
      if (key) move.push(phase)
      key = null
      phase = 0
    }
    const onTrace = (line, G) => {
      const now = performance.now()
      const k = G.turn.stage === 'battle' && q.phaseKey(G) === 'move' ? `${G.turn.round}.${G.turn.t}` : null
      if (k !== key) close()
      if (k) {
        key = k
        phase += now - last
      }
      last = now
    }
    t0 = last = performance.now()
    const G = core.createMatch(setupOf(b, d), { onTrace })
    close()
    battle.push(performance.now() - t0)
    // (and once more quietly, as a rejoin folds: the row's battle time)
    t0 = performance.now()
    core.createMatch(setupOf(b, d))
    battle[battle.length - 1] = performance.now() - t0
    units = G.units.length
  }
  return { create: median(create), move: { p50: pct(move, 0.5), p90: pct(move, 0.9), max: Math.max(...move) }, battle: median(battle), battles: setups.length, phases: move.length, units }
}

const { items } = loadCorpus()
const n = Number(a.boards) || 8
const classicSetups = items.filter((it) => it.kind === 'ai').slice(0, 24).map((it) => [it.job.seed, it.job.dice])
const grandBoards = Array.from({ length: n }, (_, i) => [i + 1, 7 + 2 * i])
const out = {}
out.classic = await row(CODE, classicSetups, (seed, dice) => jobSetup({ seed, dice }))
for (const caps of [false, true]) {
  const { dir, lists } = await buildGrand({ caps, from: CODE })
  const r = await row(dir, grandBoards, grandSetup)
  // (a fixture whose battles field fewer units than its lists would be
  // measuring classic armies on a big board: refused)
  const want = Object.values(lists).reduce((n, l) => n + l.units, 0)
  if (r.units !== want) throw new Error(`the Grand fixture's battles field ${r.units} units, its lists ${want}: the fixture didn't take (sim/fixtures/grand.mjs)`)
  out[caps ? 'grandCaps' : 'grand'] = { ...r, lists: Object.fromEntries(Object.entries(lists).map(([r, l]) => [r, `${l.units} units, ${l.models} models`])) }
}

if (a.json) console.log(JSON.stringify(out, null, 2))
console.log(`scale-bench: the core at scale, on ${a.dir ? CODE : 'the working tree'} (ms; medians over boards, movement phases over every AI phase played)\n`)
console.log('  row                     units  createMatch  move p50 / p90 / max     battle   (boards, phases)')
const line = (name, r) => console.log(`  ${name.padEnd(22)} ${String(r.units).padStart(5)}  ${ms(r.create).padStart(11)}  ${`${ms(r.move.p50)} / ${ms(r.move.p90)} / ${ms(r.move.max)}`.padStart(22)}  ${ms(r.battle).padStart(9)}   (${r.battles}, ${r.phases})`)
line('classic', out.classic)
line('Grand, ×3 presets', out.grand)
line('Grand, cap lists', out.grandCaps)
console.log(`\n  Grand lists at the caps: ${Object.entries(out.grandCaps.lists).map(([r, l]) => `${r} ${l}`).join('; ')}`)
let failed = 0
console.log(`\nGrand against its budget (fails above ${OVER}×): createMatch ${BUDGET.create} ms, a movement phase's p90 ${BUDGET.moveP90} ms, a battle ${BUDGET.battle} ms`)
for (const k of ['grand', 'grandCaps']) {
  const r = out[k]
  for (const [what, v, b] of [['createMatch', r.create, BUDGET.create], ['move p90', r.move.p90, BUDGET.moveP90], ['battle', r.battle, BUDGET.battle]]) {
    const ok = v <= b * OVER
    if (!ok) failed++
    console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${(k === 'grand' ? 'presets' : 'cap lists').padEnd(9)} ${what.padEnd(11)} ${ms(v).padStart(7)} ms  (${(v / b).toFixed(2)}× budget)`)
  }
}
console.log(failed ? `\nscale-bench FAILED: ${failed} row(s) over ${OVER}× budget (on a busy machine? run it again on a quiet one)` : '\nscale-bench passed: Grand inside its budget')
process.exit(failed ? 1 : 0)
