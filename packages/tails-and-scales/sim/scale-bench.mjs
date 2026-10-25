// The core's cost at scale (DESIGN §4.2.1's performance budget, §4.2.9's
// scale-bench row; S0 on, then every step): the core rows on the classic
// board and on Grand, the `grand` mission (F8b: 80×56, the `open` set),
// Grand with the ×3 presets ('336333', every race's) and with lists at the
// caps. (Before F8b its Grand rows ran on the Grand fixture, a patched copy
// of the code, retired with it.)
//
// The cap lists (§4.2.1): the largest lists a Grand army may field, by
// units and then models, within every rule of the grand mission's list
// (1,500 points, 24 units, 90 models, 7 of one unit, the slot table).
// CAPS records them, and the bench measures exactly those; capList (below)
// is the deterministic greedy that found them (each role's minimum from its
// cheapest units, then the cheapest unit that still fits, ties to the one
// with more models, then roster order), run again each time: if a price
// retune moves its answer the bench says so, and CAPS is recorded anew.
// Each unit is priced as the grand mission prices it (its list's own
// `prices`, core/army.js priceOf). At those prices the Bushtails' is
// '305743', 22 units and 87 models (1,085 points, held by the model cap),
// and the Coil's '315743', 23 units and 88 models (1,340 points: a 24th
// unit of 4 models or more passes 90 models, a second Brute 1,500 points,
// and the heroes and the artillery are at their slots' 3). (At the
// v6 prices, before F8b's retune, both were '305743'.) The fixture's cap lists (the
// Bushtails' 23 units and 89 models, the Coil's 24 and 84) cost 1,575 and
// 1,670, so it lifted the points limit to 2,000 to field them; on the real
// mission no list over 1,500 is legal, so these are its caps.
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
// --dir measures another copy of the code, for a before-and-after (on code
// with no `grand` mission, from before F8b, its classic row alone).
import { parseArgs } from 'node:util'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadCorpus } from './lib.mjs'
import { jobSetup } from './run.mjs'

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

// (the races a Grand battle seats, the Bushtails in seat 0)
const GRAND_RACES = ['squirrel', 'serpent']
// the ×3 presets as each seat names them, and the cap lists (above)
const PRESETS = { squirrel: '336333', serpent: '336333' }
const CAPS = { squirrel: '305743', serpent: '315743' }
// A Grand AI battle on `board` with `dice`, each seat naming its list
const grandSetup = (board, dice, lists) => ({
  board, dice, mission: 'grand', terrain: 'open',
  seats: GRAND_RACES.map((race) => ({ race, ctrl: 'ai', army: lists[race] })),
})

// The greedy that finds a race's cap list under `rules` (a mission's list):
// counts in roster order, each unit at its price there (`priceOf`,
// core/army.js's: the mission's own where its list sets one, else its cost).
export function capList(race, rules, priceOf = (r, key) => r.units[key].cost) {
  const ro = race.roster.map((key, k) => ({ key, k, t: race.units[key], cost: priceOf(race, key, rules) }))
  const counts = ro.map(() => 0)
  const fits = (e) => {
    let units = 0, models = 0, points = 0, role = 0
    ro.forEach((x, k) => {
      units += counts[k]
      models += counts[k] * x.t.models
      points += counts[k] * x.cost
      if (x.t.role === e.t.role) role += counts[k]
    })
    return units < rules.units && models + e.t.models <= rules.models && points + e.cost <= rules.points && counts[e.k] < rules.perKind && role < rules.roles[e.t.role][1]
  }
  const cheapest = (es) => es.filter(fits).sort((x, y) => x.cost - y.cost || y.t.models - x.t.models || x.k - y.k)[0]
  for (const [role, [min]] of Object.entries(rules.roles)) {
    for (let n = 0; n < min; n++) {
      const e = cheapest(ro.filter((x) => x.t.role === role))
      if (!e) throw new Error(`capList: the ${race.name} can't field the ${min} ${role} a list needs`)
      counts[e.k]++
    }
  }
  for (let e; (e = cheapest(ro)); ) counts[e.k]++
  return counts
}

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
const imp = (f) => import(pathToFileURL(join(CODE, f)).href)
const { MISSIONS } = await imp('data/mission.js')
const grand = MISSIONS.grand
let failed = 0
const notes = []
if (grand) {
  const { RACES } = await imp('data/schema.js')
  const A = await imp('core/army.js')
  const sizeOf = (race, text) => {
    const counts = [...text].map(Number), r = RACES[race]
    return { units: counts.reduce((n, c) => n + c, 0), models: counts.reduce((n, c, k) => n + c * r.units[r.roster[k]].models, 0), points: A.listCost(r, counts, grand.list) }
  }
  // the lists, each legal on the grand mission (a list it refuses would
  // measure nothing: the setup would throw), and the greedy's answer today
  for (const [what, lists] of [['×3 preset', PRESETS], ['cap list', CAPS]]) {
    for (const race of GRAND_RACES) {
      const why = A.checkList(RACES[race], grand.list, [...lists[race]].map(Number))
      if (why) {
        failed++
        notes.push(`FAIL the ${RACES[race].short}' ${what} '${lists[race]}' is refused by the grand mission: ${why} (record CAPS anew from capList)`)
      }
    }
  }
  for (const race of GRAND_RACES) {
    const got = A.listText(capList(RACES[race], grand.list, A.priceOf))
    if (got !== CAPS[race]) notes.push(`note: capList now gives the ${RACES[race].short} '${got}' (${JSON.stringify(sizeOf(race, got))}), CAPS records '${CAPS[race]}': a price or rule moved; record CAPS anew`)
  }
  for (const [key, lists] of [['grand', PRESETS], ['grandCaps', CAPS]]) {
    const r = await row(CODE, grandBoards, (b, d) => grandSetup(b, d, lists))
    // (battles that field other units than their lists measure something
    // else: refused)
    const want = GRAND_RACES.reduce((n, race) => n + sizeOf(race, lists[race]).units, 0)
    if (r.units !== want) throw new Error(`the grand mission's battles field ${r.units} units, their lists ${want}: the setups' armies didn't take`)
    out[key] = { ...r, lists: Object.fromEntries(GRAND_RACES.map((race) => { const z = sizeOf(race, lists[race]); return [race, `'${lists[race]}' ${z.units} units, ${z.models} models, ${z.points} points`] })) }
  }
}

if (a.json) console.log(JSON.stringify(out, null, 2))
console.log(`scale-bench: the core at scale, on ${a.dir ? CODE : 'the working tree'} (ms; medians over boards, movement phases over every AI phase played)\n`)
console.log('  row                     units  createMatch  move p50 / p90 / max     battle   (boards, phases)')
const line = (name, r) => console.log(`  ${name.padEnd(22)} ${String(r.units).padStart(5)}  ${ms(r.create).padStart(11)}  ${`${ms(r.move.p50)} / ${ms(r.move.p90)} / ${ms(r.move.max)}`.padStart(22)}  ${ms(r.battle).padStart(9)}   (${r.battles}, ${r.phases})`)
line('classic', out.classic)
if (!grand) {
  console.log(`\n  (no grand mission in ${CODE}: code from before F8b; its classic row alone)`)
  process.exit(0)
}
line('Grand, ×3 presets', out.grand)
line('Grand, cap lists', out.grandCaps)
console.log(`\n  the grand mission on open; the ×3 presets: ${Object.entries(out.grand.lists).map(([r, l]) => `${r} ${l}`).join('; ')}`)
console.log(`  the cap lists: ${Object.entries(out.grandCaps.lists).map(([r, l]) => `${r} ${l}`).join('; ')}`)
for (const n of notes) console.log(`  ${n}`)
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
