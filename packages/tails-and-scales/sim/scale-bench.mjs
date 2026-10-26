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
// (F7a) The fortified rows: the same on the fortified set, the classic
// mission's board (Skirmish) and the Grand fixture's (its --fortified: the
// setups name the set, which scales itself by the table's area), the Grand
// ones against the same budget; and the height layer's own cost at Grand,
// over every fortified Grand board: nav.rebuild with the height layer
// (floor, links, ledges and cliff, levels and gates, the rasters by level),
// against 3 ms on average (§4.2.4's cost: S4 comes in past it), beside the
// flat rebuild of the same board without its fortifications, and reach's
// cost per plan with height against that flat board's (a report: the
// estimate was +10%).
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
// (pairs.json's pairs: an AI log of army/ or fort/, kind 'ai' too, has no
// seeds of its own, `it.set` naming its set)
const classicSetups = items.filter((it) => it.set === undefined).slice(0, 24).map((it) => [it.job.seed, it.job.dice])
const grandBoards = Array.from({ length: n }, (_, i) => [i + 1, 7 + 2 * i])
const out = {}
out.classic = await row(CODE, classicSetups, (seed, dice) => jobSetup({ seed, dice }))
for (const caps of [false, true]) {
  const { dir, lists } = await buildGrand({ caps, from: CODE })
  // (F11a: the setups name the fixture's lists, the ×3 presets or the cap
  // lists; on code from before F11a they name none, the copy's army lines
  // patched instead)
  const r = await row(dir, grandBoards, (b, d) => grandSetup(b, d, lists))
  // (a fixture whose battles field fewer units than its lists would be
  // measuring classic armies on a big board: refused)
  const want = Object.values(lists).reduce((n, l) => n + l.units, 0)
  if (r.units !== want) throw new Error(`the Grand fixture's battles field ${r.units} units, its lists ${want}: the fixture didn't take (sim/fixtures/grand.mjs)`)
  out[caps ? 'grandCaps' : 'grand'] = { ...r, lists: Object.fromEntries(Object.entries(lists).map(([r, l]) => [r, `${l.units} units, ${l.models} models`])) }
}
// (F7a) the fortified rows, for code whose mission is fought on the set
const FORT = (await import(pathToFileURL(join(CODE, 'data', 'mission.js')).href)).MISSIONS.classic.sets.includes('fortified')
if (FORT) {
  out.classicFort = await row(CODE, classicSetups, (seed, dice) => ({ ...jobSetup({ seed, dice }), terrain: 'fortified' }))
  for (const caps of [false, true]) {
    // (F11a: naming the fixture's lists, as the flat rows do)
    const { dir, lists } = await buildGrand({ caps, fortified: true, from: CODE })
    const r = await row(dir, grandBoards, (b, d) => grandSetup(b, d, lists, true))
    out[caps ? 'grandFortCaps' : 'grandFort'] = r
    if (!caps) out.height = await heightCost(dir, grandBoards, lists)
  }
}

// (F7a) The height layer's cost on each fortified Grand board (its table as
// a match makes it): nav.rebuild with it, timed REPS times; the flat rebuild
// of the same table without its fortifications' pieces (decks, stairs,
// ladders, posts), the rest of the rebuild's work; and reach (a squad's disc,
// a move of 8") from 40 standable cells of each, with height and on the flat
// table. (F7a's review) That flat table has more open ground than the
// fortified one (its decks gone), so its reach is no measure of the height
// branch's cost: like with like is the same table with the height layer
// skipped, each deck, stair and post rastered as a hard block (as a classic
// obstacle is) and the ladders dropped (`blocks`), whose rebuild and reach
// are timed too, and the reach's row is judged against it.
async function heightCost(dir, boards, lists) {
  const core = await import(pathToFileURL(join(dir, 'core', 'index.js')).href)
  const { NavGrid } = await import(pathToFileURL(join(dir, 'core', 'nav.js')).href)
  const REPS = 20, PIECES = new Set(['deck', 'stair', 'ladder', 'post'])
  const time = (f) => {
    const t0 = performance.now()
    for (let k = 0; k < REPS; k++) f()
    return (performance.now() - t0) / REPS
  }
  const rebuild = [], flat = [], reachH = [], reachF = [], blocked = [], reachB = []
  // (a piece as a classic obstacle: hard, with no surface or link)
  const asBlock = (c) => ({ ...c, navKind: 'hard', surface: undefined, link: undefined, base: undefined, cover: false })
  for (const [b, d] of boards) {
    const setup = grandSetup(b, d, lists, true)
    const G = core.createMatch({ ...setup, seats: setup.seats.map((x) => ({ ...x, ctrl: 'human' })) })
    const { W, H, cell } = G.nav, chunks = G.terrain.chunks, rest = chunks.filter((c) => !PIECES.has(c.kind))
    const solid = chunks.filter((c) => c.kind !== 'ladder').map((c) => (PIECES.has(c.kind) ? asBlock(c) : c))
    const nav = new NavGrid(W, H, cell), plain = new NavGrid(W, H, cell), block = new NavGrid(W, H, cell)
    nav.rebuild(chunks)
    plain.rebuild(rest)
    block.rebuild(solid)
    if (!nav.hasHeight || plain.hasHeight || block.hasHeight) throw new Error(`scale-bench: fortified Grand board ${b} built ${nav.hasHeight ? '' : 'no '}height, its flat copy ${plain.hasHeight ? 'height' : 'none'}, its blocks' copy ${block.hasHeight ? 'height' : 'none'}`)
    rebuild.push(time(() => nav.rebuild(chunks)))
    flat.push(time(() => plain.rebuild(rest)))
    blocked.push(time(() => block.rebuild(solid)))
    const starts = []
    for (let i = 0; i < nav.N && starts.length < 40; i += 97) if (nav.standable(i, 1.06, 'walk') && plain.standable(i, 1.06, 'walk') && block.standable(i, 1.06, 'walk')) starts.push(i)
    const opts = { r: 1.06, max: 8, mode: 'walk', climb: true }
    reachH.push(time(() => starts.forEach((i) => nav.reach(nav.x(i), nav.z(i), opts))) / starts.length)
    reachF.push(time(() => starts.forEach((i) => plain.reach(plain.x(i), plain.z(i), opts))) / starts.length)
    reachB.push(time(() => starts.forEach((i) => block.reach(block.x(i), block.z(i), opts))) / starts.length)
  }
  const avg = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length
  return { rebuild: avg(rebuild), rebuildMax: Math.max(...rebuild), flat: avg(flat), flatMax: Math.max(...flat), blocks: avg(blocked), reach: avg(reachH), reachFlat: avg(reachF), reachBlocks: avg(reachB), boards: boards.length }
}

if (a.json) console.log(JSON.stringify(out, null, 2))
console.log(`scale-bench: the core at scale, on ${a.dir ? CODE : 'the working tree'} (ms; medians over boards, movement phases over every AI phase played)\n`)
console.log('  row                     units  createMatch  move p50 / p90 / max     battle   (boards, phases)')
const line = (name, r) => console.log(`  ${name.padEnd(22)} ${String(r.units).padStart(5)}  ${ms(r.create).padStart(11)}  ${`${ms(r.move.p50)} / ${ms(r.move.p90)} / ${ms(r.move.max)}`.padStart(22)}  ${ms(r.battle).padStart(9)}   (${r.battles}, ${r.phases})`)
line('classic', out.classic)
line('Grand, ×3 presets', out.grand)
line('Grand, cap lists', out.grandCaps)
if (FORT) {
  line('classic, fortified', out.classicFort)
  line('Grand fort, ×3 presets', out.grandFort)
  line('Grand fort, cap lists', out.grandFortCaps)
}
console.log(`\n  Grand lists at the caps: ${Object.entries(out.grandCaps.lists).map(([r, l]) => `${r} ${l}`).join('; ')}`)
let failed = 0
console.log(`\nGrand against its budget (fails above ${OVER}×): createMatch ${BUDGET.create} ms, a movement phase's p90 ${BUDGET.moveP90} ms, a battle ${BUDGET.battle} ms`)
const NAMES = { grand: 'presets', grandCaps: 'cap lists', grandFort: 'fort ×3', grandFortCaps: 'fort caps' }
for (const k of ['grand', 'grandCaps', ...(FORT ? ['grandFort', 'grandFortCaps'] : [])]) {
  const r = out[k]
  for (const [what, v, b] of [['createMatch', r.create, BUDGET.create], ['move p90', r.move.p90, BUDGET.moveP90], ['battle', r.battle, BUDGET.battle]]) {
    const ok = v <= b * OVER
    if (!ok) failed++
    console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${NAMES[k].padEnd(9)} ${what.padEnd(11)} ${ms(v).padStart(7)} ms  (${(v / b).toFixed(2)}× budget)`)
  }
}
if (FORT) {
  // (F7a) the height layer at Grand: its rebuild against 3 ms on average
  const h = out.height, HEIGHT_BUDGET = 3
  const ok = h.rebuild <= HEIGHT_BUDGET
  if (!ok) failed++
  console.log(`\nThe height layer at Grand (fortified, ${h.boards} boards; ms, the average and the worst board's)`)
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} nav.rebuild with height ${ms(h.rebuild)} (max ${ms(h.rebuildMax)}) against ${HEIGHT_BUDGET} ms: the same table with its pieces as hard blocks ${ms(h.blocks)}, so the height layer ${ms(h.rebuild - h.blocks)}; (the table without its fortifications ${ms(h.flat)}, max ${ms(h.flatMax)})`)
  console.log(`  report: reach (r 1.06, 8") ${h.reach.toFixed(3)} ms a plan with height, ${h.reachBlocks.toFixed(3)} ms on the same table with its pieces as hard blocks (the height branch's cost: ${((h.reach / h.reachBlocks - 1) * 100).toFixed(0)}%); ${h.reachFlat.toFixed(3)} ms on the table without its fortifications (more open ground: ${((h.reach / h.reachFlat - 1) * 100).toFixed(0)}%)`)
}
console.log(failed ? `\nscale-bench FAILED: ${failed} row(s) over ${OVER}× budget (on a busy machine? run it again on a quiet one)` : '\nscale-bench passed: Grand inside its budget')
process.exit(failed ? 1 : 0)
