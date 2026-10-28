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
//     the nav's STEP under it), (the review) having got there by a move of
//     its own: a walk or a charge from below onto the deck, not deployed
//     there (every battle has its works, decks in each zone, so the units
//     deployed onto them met the row whether or not anything could climb;
//     that count is reported beside it);
//   - where the keep stands, its objective is held from the top in ≥ 1
//     battle of 6 (at a round's end the centre objective is held, with
//     height a model counting only within 1.2" of the objective's floor,
//     core/queries.js controlOf, and (the review) a model of the holding
//     seat within its range stands on the keep's top: held from below by a
//     rule that ignored the height, it would not count).
// Beside the thresholds it reports what else the battles did with height
// (the units deployed onto the works, ladders climbed, moves onto a deck,
// fights on one), read off the match as it is folded (sim/height-probe.mjs:
// never the trace, which has no floors).
//
// F7b's row (at F17, which lobs from height; DESIGN §4.2.9's thresholds),
// over the same battles as F7a's: a shooter fires from a deck in ≥ 50% of
// battles (a volley, a template or a spell, its shooter's floor above the
// nav's STEP as the events put it; sim/height-probe.mjs's deckShots).
// Beside it, whether the AI climbs to shoot (shots from a deck the shooter
// walked onto in the battle) and how often the lob decides (shots past the
// weapon's printed range, which only a lob from height reaches; shots up at
// a raised target).
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
// F9a's row, over the `vehicle/` AI pairs (War-Carts against the Coil, and
// Bushtail mirrors): riders disembark in ≥ 50% of battles (a rider of
// either seat stepping off of its own accord, a unit.disembark not forced:
// a bail-out is no disembark the AI chose), read off the match as it is
// folded (sim/rider-probe.mjs). Until the vehicle/ corpus is recorded (in
// its own commit after F9a's code) it sweeps 12 Field AI battles with
// War-Carts instead, seeded as corpus-add's candidates are, half Bushtail
// mirrors and half against the Coil (either seat), half open and half
// fortified, each Bushtail list autoList's at 90% of the points holding a
// War-Cart at least (the vehicle/ corpus's lists, as the army/ corpus's
// are built). Beside the threshold it says what else the battles did with
// their transports: the riders autoloaded, the rounds they stepped off in,
// the hulls destroyed, the bail-outs and the riders lost.
//
// F19a's row, over the `keg/` AI pairs (the keg mission: a Skirmish round a
// powder keg, its objectives clustered round it): the keg goes off in
// ≥ 50% of battles (a `keg.fuse` among the battle's events). Beside it, per
// battle, the round it went off in, who set it off and how (the template
// that broke it: its thrower's weapon, an eruption's thorns, a walk that
// smashed it, a keg before it in a chain), and the models its blast slew,
// the setter-off's enemies' and its own side's. With no keg/ AI pair in
// the corpus (before F19a's corpus commit) it sweeps 12 keg battles, seeded
// as corpus-add's candidates are, the races swapping seats.
//
//   node sim/play-report.mjs                    every row, on the working tree's core
//   node sim/play-report.mjs --row f10b         one row (f7a, f7b, f9a, f10b, f19a; comma-separated for more)
//   node sim/play-report.mjs --sweep 24 [--seed S]   F7a's and F9a's rows: a seeded sweep of AI battles instead
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

const ROWS = ['f7a', 'f7b', 'f9a', 'f10b', 'f19a']
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
// The fortified battles F7a's and F7b's rows judge, each folded once with
// the height probe: { what, rows, failed }, or null when the code has no
// fortified set
let folded = null
async function fortFolds() {
  if (!Object.hasOwn(SETS, 'fortified')) return null
  folded ??= foldFort()
  return folded
}
async function foldFort() {
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
  }
  return { what, rows, failed }
}

// { checks, failed }, or null when the code has no fortified set
async function f7a() {
  const f = await fortFolds()
  if (!f) return null
  const { what, rows, failed } = f
  console.log(`\nF7a's row: ${what}`)
  for (const p of rows) console.log(`  ${p.id.padEnd(28)} on a deck by a move at the end of rounds ${p.movedRounds.join(',') || '-'}${p.movedBy3 ? ' (by 3)' : ''} (any unit: ${p.deckRounds.join(',') || '-'}); deployed on decks ${p.deployed}; ladders ${p.climbs} (${p.up} up); onto a deck ${p.ontoDeck}; deck fights ${p.deckFights}${p.keep ? `; the keep, held at ${p.keepHeld} round end${p.keepHeld === 1 ? '' : 's'}` : ''}`)
  for (const x of failed) console.log(`  FAILED ${x}`)

  const n = rows.length
  const deck = rows.filter((r) => r.movedBy3).length, anyDeck = rows.filter((r) => r.deckBy3).length
  const keeps = rows.filter((r) => r.keep), held = keeps.filter((r) => r.keepHeld > 0).length
  const sum = (k) => rows.reduce((s, r) => s + r[k], 0)
  console.log(`\n  ${n} battles: units deployed onto decks ${sum('deployed')}, ladders climbed ${sum('climbs')} (${sum('up')} up) in ${rows.filter((r) => r.climbs).length} battles, moves onto a deck ${sum('ontoDeck')} in ${rows.filter((r) => r.ontoDeck).length}, fights on a deck in ${rows.filter((r) => r.deckFights).length}`)
  const checks = [
    { name: 'a unit on a deck by a move of its own by the end of round 3', ok: n > 0 && deck * 2 >= n, got: `${deck} of ${n} battles (${pct(deck, n)}; counting the units deployed on decks, ${anyDeck})`, want: '≥ 50%' },
    { name: 'the keep\'s objective held from its top', ok: keeps.length > 0 && held * 6 >= keeps.length, got: keeps.length ? `${held} of the ${keeps.length} battles the keep stands in (${pct(held, keeps.length)})` : 'no battle has the keep, so this cannot be judged', want: '≥ 1 battle of 6' },
  ]
  return { checks, failed }
}

// ── F9a: riders step off ────────────────────────────────────────────────────
// { checks, failed }, or null when the code has no transport
async function f9a() {
  if (!existsSync(join(dir, 'core', 'actions', 'transport.js'))) return null
  const { riderProbe } = await import(pathToFileURL(fileURLToPath(new URL('./rider-probe.mjs', import.meta.url))).href)
  const { RACES } = await import(at('data/schema.js'))
  const match = await loadMatch(dir)
  const pairs = loadCorpus().items.filter((it) => it.set === 'vehicle' && it.kind === 'ai')
  // the sweep: board and dice drawn from the seed's own stream, as
  // corpus-add's candidates are; each Bushtail list holding a War-Cart
  const sweep = (n) => Array.from({ length: n }, (_, i) => {
    const r = mulberry32(Number(a.seed ?? 9000) + i + 1)
    const board = 1 + Math.floor(r() * 99999), dice = 1 + Math.floor(r() * 999999)
    const m = MISSIONS.field, rules = { ...m.list, points: Math.floor((90 * m.list.points) / 100) }
    const races = i % 2 === 0 ? ['squirrel', 'squirrel'] : i % 4 === 1 ? ['squirrel', 'serpent'] : ['serpent', 'squirrel']
    const seats = races.map((race, s) => {
      const R = RACES[race], k = R.roster.findIndex((key) => R.units[key].transport)
      let counts = core.army.autoList(R, rules, i * 2 + s + 1)
      for (let j = 1; k >= 0 && !(counts[k] >= 1) && j < 200; j++) counts = core.army.autoList(R, rules, 1000 * j + i * 2 + s + 1)
      return { race, ctrl: 'ai', army: core.army.listText(counts) }
    })
    const setup = { board, dice, mission: 'field', terrain: m.sets[Math.floor(i / 2) % m.sets.length], rounds: m.rounds, seats }
    return { id: `sweep-${i + 1}-${board}-${dice}`, job: { setup, entries: [] } }
  })
  const battles = SWEEP !== null || !pairs.length ? sweep(SWEEP ?? 12) : pairs
  const what = SWEEP !== null || !pairs.length ? `a sweep of ${battles.length} Field AI battles with War-Carts (no vehicle/ AI pair is in the corpus${SWEEP !== null ? ', or --sweep' : ''})` : `the ${battles.length} vehicle/ AI pairs`
  console.log(`\nF9a's row: ${what}`)
  const rows = [], failed = []
  for (const b of battles) {
    const probe = riderProbe()
    const res = foldJob(core, b.job, { match, probe })
    const p = probe.result()
    if (res.error) {
      failed.push(`${b.id}: ${res.error.split('\n')[0]}`)
      continue
    }
    if (!p.hulls) {
      failed.push(`${b.id}: it fields no hull that carries riders`)
      continue
    }
    rows.push({ id: b.id, ...p })
    const seats = b.job.setup.seats.map((x) => `${x.race === 'squirrel' ? 'Bushtails' : 'Coil'} ${x.army ?? ''}`.trim()).join(' v ')
    console.log(`  ${b.id.padEnd(26)} ${seats.padEnd(34)} ${b.job.setup.terrain.padEnd(9)} hulls ${p.hulls}, autoloaded ${p.autoloaded}; riders stepped off ${p.steps} times${p.steps ? ` (rounds ${p.stepRounds.join(',')})` : ''}; hulls destroyed with riders ${p.hullsDown} (${p.bailed} bailed out, ${p.lost} lost, ${p.bailDeaths} models lost to it); wrecks ${p.wrecks}`)
  }
  for (const f of failed) console.log(`  FAILED ${f}`)
  const n = rows.length, stepped = rows.filter((r) => r.steps > 0).length
  const sum = (k) => rows.reduce((s, r) => s + r[k], 0)
  console.log(`\n  ${n} battles: ${sum('hulls')} hulls, ${sum('autoloaded')} riders autoloaded, ${sum('steps')} steps off, ${sum('hullsDown')} hulls destroyed with riders aboard (${sum('bailed')} riders bailed out, ${sum('lost')} lost), ${sum('wrecks')} wrecks`)
  const checks = [
    { name: 'riders disembark (of their own accord, either seat\'s)', ok: n === battles.length && stepped * 2 >= n, got: `in ${stepped} of ${n} battles (${pct(stepped, n)})${n < battles.length ? `, ${battles.length - n} failed` : ''}`, want: '≥ 50%' },
  ]
  return { checks, failed }
}

// ── F7b: shooting from the decks (judged from F17, which lobs from them) ────
// { checks, failed }, or null when the code has no fortified set
async function f7b() {
  const f = await fortFolds()
  if (!f) return null
  const { what, rows, failed } = f
  console.log(`\nF7b's row: ${what}`)
  for (const p of rows) console.log(`  ${p.id.padEnd(28)} shots ${p.shots}: from a deck ${p.deckShots} (${p.climbedShots} by a shooter that climbed to it), past the printed range ${p.lobs}, up at a raised target ${p.upShots}`)
  for (const x of failed) console.log(`  FAILED ${x}`)
  const n = rows.length, fired = rows.filter((r) => r.deckShots > 0).length
  const sum = (k) => rows.reduce((s, r) => s + r[k], 0)
  console.log(`\n  ${n} battles: ${sum('shots')} shots, ${sum('deckShots')} from a deck in ${fired} battles, ${sum('climbedShots')} by a shooter that climbed to its deck in ${rows.filter((r) => r.climbedShots).length}, ${sum('lobs')} past the printed range in ${rows.filter((r) => r.lobs).length}, ${sum('upShots')} up at a raised target`)
  const checks = [
    { name: 'a shooter fires from a deck', ok: n > 0 && fired * 2 >= n, got: `${fired} of ${n} battles (${pct(fired, n)})`, want: '≥ 50%' },
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

// ── F19a: the powder keg goes off ───────────────────────────────────────────
// What a battle did with its keg, read off the events as they are folded
// (foldJob's probe: an AI battle's arrive at once, after its last line):
// each keg.fuse, the round it came in (the last phase.start's), who set it
// off (the walk whose smashes broke it, else the blast that did: a
// template's thrower, an eruption's caster, or the keg before it in the
// chain, whose setter it shares) and the models its blast slew (its
// unit.slain events up to the next fuse, throw, eruption or action's end),
// by side against the setter's.
function kegProbe() {
  const kegs = []
  return {
    trace() {},
    events(G, events) {
      let round = 1, actor = null, how = null
      const setterOf = new Map()
      const side = (id) => G.units.find((u) => u.id === id)?.side
      const short = (id) => G.units.find((u) => u.id === id)?.t.short ?? `unit ${id}`
      for (let i = 0; i < events.length; i++) {
        const e = events[i]
        if (e.t === 'phase.start') round = e.round
        if (e.t === 'blast.fire') (actor = e.u), (how = G.units.find((u) => u.id === e.u)?.t.ranged?.name ?? 'a template')
        // ((V3c) the eruption by its look's spell: Thornburst; Venom Mist
        // spares the scenery and sets no keg off)
        if (e.t === 'spell.thorns') (actor = e.u), (how = `its ${G.units.find((u) => u.id === e.u)?.t.spells?.find((w) => w.fx === e.fx)?.name ?? 'Thornburst'}`)
        if (e.t === 'unit.move') {
          for (const sm of e.smashes ?? []) for (const x of sm.ev) if (x.t === 'terrain.destroy' && x.kind === 'keg') setterOf.set(x.id, { u: e.u, how: 'its walk' })
        }
        if (e.t === 'terrain.destroy' && e.kind === 'keg' && !setterOf.has(e.id)) setterOf.set(e.id, { u: actor, how })
        if (e.t === 'keg.fuse') {
          const who = setterOf.get(e.id) ?? { u: actor, how: 'unknown' }
          const k = { round, u: who.u, by: who.u === null || who.u === undefined ? '?' : short(who.u), how: kegs.length && who.how === 'its Powder keg' ? 'a chain' : who.how, foes: 0, own: 0 }
          // (a keg a keg's blast broke: the setter of that keg, in a chain)
          actor = who.u
          how = 'a chain'
          for (let j = i + 1; j < events.length; j++) {
            const x = events[j]
            if (x.t === 'keg.fuse' || x.t === 'blast.fire' || x.t === 'spell.thorns' || x.t === 'act') break
            if (x.t === 'unit.slain') (side(x.u) === side(who.u) ? k.own++ : k.foes++)
          }
          kegs.push(k)
        }
      }
    },
    result: () => kegs,
  }
}
async function foldKeg() {
  const match = await loadMatch(dir)
  const pairs = loadCorpus().items.filter((it) => it.set === 'keg' && it.kind === 'ai')
  const sweep = (n) => Array.from({ length: n }, (_, i) => {
    const r = mulberry32(Number(a.seed ?? 7000) + i + 1)
    const races = i % 2 ? ['serpent', 'squirrel'] : ['squirrel', 'serpent']
    const setup = { board: 1 + Math.floor(r() * 99999), dice: 1 + Math.floor(r() * 999999), mission: 'keg', seats: races.map((race) => ({ race, ctrl: 'ai' })) }
    return { id: `sweep-${setup.board}-${setup.dice}`, job: { setup, entries: [] } }
  })
  const battles = SWEEP !== null || !pairs.length ? sweep(SWEEP ?? 12) : pairs
  const what = SWEEP !== null || !pairs.length ? `a sweep of ${battles.length} keg battles (no keg/ AI pair is in the corpus${SWEEP !== null ? ', or --sweep' : ''})` : `the ${battles.length} keg/ AI pairs`
  const rows = [], failed = []
  for (const b of battles) {
    const probe = kegProbe()
    const res = foldJob(core, b.job, { match, probe })
    if (res.error) {
      failed.push(`${b.id}: ${res.error.split('\n')[0]}`)
      continue
    }
    rows.push({ id: b.id, kegs: probe.result(), rounds: res.over?.round })
  }
  return { what, rows, failed }
}
// { checks, failed }, or null when the code has no keg mission
async function f19a() {
  if (!Object.hasOwn(MISSIONS, 'keg')) return null
  const { what, rows, failed } = await foldKeg()
  console.log(`\nF19a's row: ${what}`)
  for (const r of rows) console.log(`  ${r.id.padEnd(28)} ${r.kegs.length ? r.kegs.map((k) => `the keg off in round ${k.round}, set off by the ${k.by} (${k.how}): ${k.foes} of the enemy slain, ${k.own} of its own`).join('; ') : 'the keg never went off'}`)
  for (const x of failed) console.log(`  FAILED ${x}`)
  const n = rows.length, off = rows.filter((r) => r.kegs.length).length
  const all = rows.flatMap((r) => r.kegs)
  console.log(`\n  ${n} battles: the keg off in ${off}, ${all.filter((k) => /walk/.test(k.how)).length} by a walk; ${all.reduce((s, k) => s + k.foes, 0)} enemy models and ${all.reduce((s, k) => s + k.own, 0)} of the setters' own slain by it`)
  const checks = [
    { name: 'the powder keg goes off', ok: n > 0 && off * 2 >= n, got: `${off} of ${n} battles (${pct(off, n)})`, want: '≥ 50%' },
  ]
  return { checks, failed }
}

console.log(`play-report: ${rows.join(', ')}, on the core of ${codeName}`)
let missed = 0, broke = 0, judged = 0
for (const row of rows) {
  const r = row === 'f7a' ? await f7a() : row === 'f7b' ? await f7b() : row === 'f9a' ? await f9a() : row === 'f19a' ? await f19a() : await f10b()
  if (!r) {
    console.log(`\n${row === 'f7a' || row === 'f7b' ? `${row === 'f7a' ? 'F7a' : 'F7b'}'s row: not judged: this code has no fortified set` : row === 'f9a' ? "F9a's row: not judged: this code has no transport (core/actions/transport.js)" : row === 'f19a' ? "F19a's row: not judged: this code has no keg mission" : "F10b's row: not judged: this code has no grand mission"}`)
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
