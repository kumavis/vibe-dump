// The play-report (DESIGN §4.2.9's row and its thresholds table): whether
// a step's new mechanics actually get played, over the step's AI corpus. A
// step whose report misses a threshold is not done: tune its AI terms or
// data, then re-record. One row per step that has one, each judged on the
// code only where that code has what the row plays (a row whose mechanic
// the code lacks says so and is not judged: F7a's on a code with no
// `fortified` set, F10b's on one with no `grand` mission).
//
// F7a's row, over the `fort/` AI pairs (the Skirmish fortified board):
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
// F10b's row (at F8b, on the Grand boards): 4 Grand battles with one army
// on `pilot` every phase; that army reaches melee by round 3 in ≥ 3 of 4.
// The pilot army's seat is the human's, and every phase it is handed a
// `pilot` naming each of its standing units (core/queries.js maskOf, the
// core's own door, as sim/pilot-check.mjs drives it) and then `end`; it
// deploys as the deployment placed it (`deployed`). The other seat is the
// AI's. Each battle is the `scale/` corpus's Grand AI pairs' when it holds
// four (their boards, dice, races, armies and terrain, the pilot in seat
// 0), else four fixed Grand boards on `open` with the mission's presets,
// the pilot army the Bushtails on odd boards and the Coil on even ones
// (seat 0 either way). Reaching melee is the pilot army's own: (F8b's
// review) one of its charges making contact while the round is at most 3
// (a charge line of seat 0's in the trace, "X charge Y — roll …
// Contact!"), not any fight by then, which the AI's charge into a pilot
// that never charges would have counted too. The row also says, per
// battle, the round of the first fight and which army struck first, and
// the pilot army's charges by round 3 (made contact / declared). And it
// holds itself to a control: the same battles with the pilot army only
// pressing End (no pilot) must miss the threshold, or the row can't tell
// a pilot that charges from one that doesn't.
//
//   node sim/play-report.mjs                    every row, on the working tree's core
//   node sim/play-report.mjs --row f10b         one row (f7a, f10b; comma-separated for more)
//   node sim/play-report.mjs --sweep 24 [--seed S]   F7a's row: a seeded sweep of fortified AI battles instead
//   --pin | --ref <ref> | --dir <packageDir>    another copy of the code
//
// F7a's row: with no fort/ AI pair in the corpus (before F7a's corpus
// commit) it sweeps 24. Each battle is folded in this process through the
// code's own Folder (sim/run.mjs foldJob), as parity folds it. F10b's row
// folds through the code's createMatch and apply, `strict` (every AI
// command held to legal()). A battle that stops short is a failure, named.
// Exit 0 when every threshold judged holds, 1 below one (or a battle
// failed), 2 for a usage error.
import { parseArgs } from 'node:util'
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadCorpus } from './lib.mjs'
import { foldJob, loadMatch } from './run.mjs'
import { codeDir, readPin } from './oracle/pin.mjs'
import { setupFor, mulberry32 } from './oracle/human-bot.mjs'

const ROWS = ['f7a', 'f10b']
const { values: a } = parseArgs({ options: { row: { type: 'string' }, sweep: { type: 'string' }, seed: { type: 'string' }, pin: { type: 'boolean' }, ref: { type: 'string' }, dir: { type: 'string' } } })
const SWEEP = a.sweep === undefined ? null : Number(a.sweep)
if (SWEEP !== null && !(Number.isInteger(SWEEP) && SWEEP > 0)) {
  console.error('play-report: --sweep takes a whole number of battles, 1 or more')
  process.exit(2)
}
const rows = a.row === undefined ? ROWS : a.row.split(',').map((s) => s.trim())
if (!rows.length || rows.some((r) => !ROWS.includes(r))) {
  console.error(`play-report: --row takes ${ROWS.join(', ')} (comma-separated), not ${JSON.stringify(a.row)}`)
  process.exit(2)
}
const dir = a.dir ?? codeDir(a.pin ? readPin() : a.ref ?? 'WORKTREE')
const codeName = a.dir ?? (a.pin ? `the PIN (${readPin().slice(0, 9)})` : a.ref ?? 'the working tree')
const at = (f) => pathToFileURL(join(dir, f)).href
const core = await import(at('core/index.js'))
const { SETS } = await import(at('core/terrain/sets.js'))
const { MISSIONS } = await import(at('data/mission.js'))
const pct = (x, y) => (y ? `${Math.round((100 * x) / y)}%` : '-')

// ── F7a: height played ──────────────────────────────────────────────────────
// { checks, failed }, or null when the code has no fortified set
async function f7a() {
  if (!Object.hasOwn(SETS, 'fortified')) return null
  // (sim/height-probe.mjs is F7a's, beside this file)
  const { heightProbe } = await import(pathToFileURL(fileURLToPath(new URL('./height-probe.mjs', import.meta.url))).href)
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
  console.log(`\nF7a's row: ${what}`)

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
  console.log(`\n  ${n} battles: units deployed onto decks ${sum('deployed')}, ladders climbed ${sum('climbs')} (${sum('up')} up) in ${rows.filter((r) => r.climbs).length} battles, moves onto a deck ${sum('ontoDeck')} in ${rows.filter((r) => r.ontoDeck).length}, fights on a deck in ${rows.filter((r) => r.deckFights).length}`)
  const checks = [
    { name: 'a unit on a deck by the end of round 3', ok: n > 0 && deck * 2 >= n, got: `${deck} of ${n} battles (${pct(deck, n)})`, want: '≥ 50%' },
    { name: 'the keep\'s objective held from its top', ok: keeps.length > 0 && held * 6 >= keeps.length, got: keeps.length ? `${held} of the ${keeps.length} battles the keep stands in (${pct(held, keeps.length)})` : 'no battle has the keep, so this cannot be judged', want: '≥ 1 battle of 6' },
  ]
  return { checks, failed }
}

// ── F10b: autopilot reaches the fight ───────────────────────────────────────
// The fixed Grand boards when the corpus has no four Grand AI pairs:
// [board, dice] each (pilot-check's P-auto boards)
const GRAND = [[1, 7], [2, 11], [3, 5], [4, 9]]
const BY = 3

// the pilot naming every standing unit of the seat's, by the core's own
// door (maskOf), or null when no unit could act (the core refuses it)
function pilotAll(G, seat) {
  const ids = G.units.filter((u) => u.side === seat && core.q.alive(u)).map((u) => u.id)
  const body = { t: 'pilot', m: core.q.maskOf(G, seat, ids) }
  return core.legal(G, seat, body) === null ? body : null
}

// One battle, the pilot army in seat 0: what its fights and charges were
// (`pilot` false: the control, seat 0 pressing End alone)
function pilotBattle(setup, { pilot = true } = {}) {
  const seen = { fight: null, first: null, charges: 0, contacts: 0, pilots: 0, acted: 0 }
  const onTrace = (line, G) => {
    const round = G.turn.round
    const m = /^log ([01]) (.+?) (fight|charge) /.exec(line)
    if (!m) return
    const side = Number(m[1])
    if (m[3] === 'fight') {
      if (seen.fight === null) (seen.fight = round), (seen.first = side)
    } else if (side === 0 && round <= BY && / — roll /.test(line)) {
      seen.charges++
      if (/Contact!/.test(line)) seen.contacts++
    }
  }
  const G = core.createMatch(setup, { out: null, onTrace, strict: true })
  for (let k = 0; G.turn.stage !== 'over'; k++) {
    if (k > 6000) throw new Error('the battle never ends')
    const P = G.pending
    if (!P || P.seats[0] !== 0) throw new Error(`decision ${k}: the match waits on ${JSON.stringify(P)}, not the pilot army's seat`)
    if (P.k === 'deploy') {
      core.apply(G, 0, { t: 'deployed' })
      continue
    }
    if (P.k !== 'phase') throw new Error(`decision ${k}: a ${P.k} decision, which the pilot army doesn't take`)
    const p = pilot ? pilotAll(G, 0) : null
    if (p) {
      const before = core.q.rngState(G.rng) + G.journal.trace.length
      core.apply(G, 0, p)
      seen.pilots++
      if (core.q.rngState(G.rng) + G.journal.trace.length !== before) seen.acted++
    }
    core.apply(G, 0, { t: 'end' })
  }
  return { ...seen, result: G.turn.result, round: G.turn.round }
}

// { checks, failed }, or null when the code has no grand mission
async function f10b() {
  if (!Object.hasOwn(MISSIONS, 'grand')) return null
  const grand = MISSIONS.grand
  const pairs = loadCorpus().items.filter((it) => it.set === 'scale' && it.kind === 'ai' && it.setup?.mission === 'grand')
  const fromCorpus = pairs.length >= 4
  const battles = fromCorpus
    ? pairs.slice(0, 4).map((it) => ({ id: it.id, setup: it.setup }))
    : GRAND.map(([board, dice], k) => {
      const races = k % 2 ? ['serpent', 'squirrel'] : ['squirrel', 'serpent']
      return { id: `grand-${board}-${dice}`, setup: { board, dice, mission: 'grand', terrain: grand.sets[0], seats: races.map((race) => ({ race, ctrl: 'ai' })) } }
    })
  console.log(`\nF10b's row: ${battles.length} Grand battles (${fromCorpus ? "the scale/ corpus's Grand AI pairs" : `no four Grand AI pairs in the scale/ corpus, so ${GRAND.length} fixed boards on ${grand.sets[0]} with the mission's presets`}), the army in seat 0 on pilot every phase, the other the AI`)
  const out = [], failed = []
  for (const b of battles) {
    const setup = { ...b.setup, overtime: 'never', seats: b.setup.seats.map((s, i) => ({ ...s, ctrl: i === 0 ? 'human' : 'ai' })) }
    const t0 = performance.now()
    let r
    try {
      r = pilotBattle(setup)
    } catch (e) {
      failed.push(`${b.id}: ${String(e?.message ?? e).split('\n')[0]}`)
      continue
    }
    const secs = (performance.now() - t0) / 1000
    const melee = r.contacts > 0
    // (the control: the same battle, End alone)
    let ctl = null
    try {
      ctl = pilotBattle(setup, { pilot: false })
    } catch (e) {
      failed.push(`${b.id}, the control (End alone): ${String(e?.message ?? e).split('\n')[0]}`)
    }
    out.push({ ...r, melee, ctl: ctl && ctl.contacts > 0 })
    const end = r.result ? (r.result.win === -1 ? 'a draw' : r.result.win === 0 ? 'the pilot army won' : 'the AI won') : 'no result'
    console.log(`  ${b.id.padEnd(16)} pilot ${setup.seats[0].race.padEnd(8)} first fight ${r.fight === null ? 'never' : `in round ${r.fight}, struck by the ${r.first === 0 ? 'pilot army' : 'AI'}`}; the pilot army's charges by round ${BY}: ${r.contacts} made contact of ${r.charges}${melee ? ' (melee by 3)' : ''}; ${r.pilots} pilots (${r.acted} played something); ${end} after ${r.round} rounds (${secs.toFixed(1)} s); the control, End alone: ${ctl ? `${ctl.contacts} contacts by round ${BY}, first fight ${ctl.fight === null ? 'never' : `in round ${ctl.fight}`}` : 'failed'}`)
  }
  for (const f of failed) console.log(`  FAILED ${f}`)
  const n = out.length, hit = out.filter((r) => r.melee).length, ctl = out.filter((r) => r.ctl).length
  const acted = out.reduce((s, r) => s + r.acted, 0)
  const checks = [
    { name: `the pilot army reaches melee by round ${BY} (its own charge's contact)`, ok: n === battles.length && hit * 4 >= 3 * n, got: `${hit} of ${n} battles (${pct(hit, n)})${n < battles.length ? `, ${battles.length - n} failed` : ''}`, want: '≥ 3 of 4' },
    // ((F8b's review) the control must miss: End alone never charges)
    { name: `the control, End alone in the pilot's seat, misses it`, ok: n === battles.length && ctl * 4 < 3 * n, got: `${ctl} of ${n} battles with a contact of its own by round ${BY}`, want: 'under 3 of 4' },
    // (a pilot that plays nothing passes nothing)
    { name: 'its pilots played something', ok: acted > 0, got: `${acted} pilots that moved the match`, want: 'some' },
  ]
  return { checks, failed }
}

console.log(`play-report: ${rows.join(', ')}, on the core of ${codeName}`)
let missed = 0, broke = 0, judged = 0
for (const row of rows) {
  const r = row === 'f7a' ? await f7a() : await f10b()
  if (!r) {
    console.log(`\n${row === 'f7a' ? "F7a's row: not judged: this code has no fortified set" : "F10b's row: not judged: this code has no grand mission"}`)
    continue
  }
  judged++
  for (const c of r.checks) console.log(`  ${c.ok ? 'ok  ' : 'FAIL'} ${c.name}: ${c.got}, against ${c.want}`)
  missed += r.checks.filter((c) => !c.ok).length
  broke += r.failed.length
}
// (a run that judged nothing passes nothing)
const bad = missed + broke + (judged ? 0 : 1)
console.log(missed + broke ? `\nplay-report: ${missed} threshold(s) missed, ${broke} battle(s) failed` : judged ? `\nplay-report: every threshold of the ${judged} row(s) judged holds` : '\nplay-report: no row asked for could be judged on this code')
process.exit(bad ? 1 : 0)
