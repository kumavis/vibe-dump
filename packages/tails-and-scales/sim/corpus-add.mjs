// Add logs to the parity corpus (a log set under sim/baselines) without
// building it again: the human-bot plays seeded games of one mode and setup
// on the PIN code (or, --mode watch, the AI plays both seats), and the first
// --count of them that show everything --need asks for, and pass
// sim/corpus.mjs's admission (twice more identically in Node from their
// entries alone, then the same trace and battle log in Chromium, on a fresh
// build of the PIN code, started from the title screen as pageStart says),
// are written. A step whose code lets a log hold something new (F4's vote,
// F5's races, F7's terrain, F10b's pilot, F11a's lists) adds its logs this
// way, recorded on that code: so sim/oracle/PIN names its commit first (the
// PIN's header), and `node sim/parity.mjs --pin` passes afterwards.
//
//   node sim/corpus-add.mjs --mode hotseat --policy late --tag vote --overtime vote --need vote,overtime [--count 1] [--tries 24] [--dry]
//   node sim/corpus-add.mjs --set army --mode watch --tag lists --auto-armies 90 --need lists --count 2
//   node sim/corpus-add.mjs --set army --mode watch --tag lists-swapped --races serpent,squirrel --auto-armies 90 --need lists --count 2 --from 101
//   node sim/corpus-add.mjs --set army --mode hotseat --policy aggressive --tag lists --auto-armies 90 --need lists,wipe
//   node sim/corpus-add.mjs --set scale --mission grand --terrain open --mode watch --tag grand --auto-armies 90 --count 2
//   node sim/corpus-add.mjs --set scale --mission field --mode hotseat --policy aggressive --tag field --auto-armies 90 --dry --ref WORKTREE
//
// --mode bushtail, serpent, hotseat or watch; --policy (not with watch)
// random, late, aggressive or pilot (sim/oracle/human-bot.mjs); --overtime
// the setup's (F4: 'vote'); --races <seat 0>,<seat 1> the seats' races
// (default squirrel,serpent, the title screen's: serpent,squirrel puts the
// Coil in seat 0); --set the log set it joins (lib.mjs LOG_SETS: human, the
// default; pilot, F10b's; army, F11a's; scale, F8b's).
//
// The board (F8b): --mission <name> the setup's mission (the code's
// data/mission.js; classic, the default, is named by none, so a classic
// log's setup is the one it always was), its rounds the mission's own and
// its terrain the mission's first set, or --terrain <set>, one of the sets
// the mission is fought on (the `scale/` corpus's: --mission field or
// grand, --terrain open, and from F7a fortified). The page starts it from
// ?mission= (oracle/human-bot.mjs pageStart), and the human-bot's deploy
// depth is the match's own. --auto-armies builds its lists under that
// mission's rules (90: 900 of a Field's 1,000 points, 1,350 of a Grand's
// 1,500).
//
// --ref <ref> plays the candidates on another commit's code than the PIN's
// (WORKTREE: the working tree), or --dir <packageDir> on a copy of the
// code (a snapshot of a working tree others are editing), and only with
// --dry: a corpus is recorded
// on the PIN, whose hashes `parity --pin` holds it to, so a run that would
// write refuses it. It proves a recording's tooling before the code it
// needs is committed and pinned (F8b's dry runs, on missions the PIN
// lacks).
//
// --mode watch (F11a): an AI pair, kept as a log because its setup names
// what pairs.json's seeds can't (its lists, its seat races). It has no
// entries, since the whole battle runs inside the start, so admission
// replays the setup alone (twice more in Node, once in Chromium), and
// lib.mjs's loadCorpus counts it an AI battle (kind 'ai', mode 'watch').
//
// The seats' armies (F11a; the PIN's code must have core/army.js), at most
// one of:
//   --armies <a>,<b>      each seat's army as written: a preset's name or a
//                         count string (core/army.js's armyOf judges it)
//   --auto-armies <pct>   each seat's list built by the PIN's autoList(race,
//                         { ...mission.list, points: ⌊pct × points / 100⌋ },
//                         k), k the candidate's own seed, so a log's lists
//                         follow from its name. The army/ corpus's are at 90
//                         (DESIGN §4.2.9): every list costs at most 90% of
//                         its limit (450 at Skirmish), so a price retune of
//                         up to 10% keeps it legal, which data-check asserts.
//                         (Integer arithmetic: the same floor as the spec's
//                         ⌊0.9 × points⌋ for a whole percentage, without a
//                         float's rounding in the way.)
// Without either, a seat names no army and plays its mission's preset.
//
// --need a comma-separated list, each a property every log written must show:
//   vote       a vote among its entries (F4)
//   overtime   a round played past the setup's rounds (F4)
//   score      ended on the score: no army wiped out
//   wipe       ended by a wipe-out
//   pilot      (F10b) a pilot among its entries that played a unit, in
//              each of the movement, shooting and charge phases
//   lists      (F11a) both seats name a list of counts (not a preset)
// --from <k> the first candidate seed (default 1): candidate k plays board
// and dice drawn from mulberry32(9000 + k), and the bot's policy seed k.
// Logs are named <mode>-<policy>-<tag>-<k> (watch: watch-<tag>-<k>); an
// existing log, in any set, is never overwritten, and its seed is skipped.
import { parseArgs } from 'node:util'
import { existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { pathToFileURL } from 'node:url'
import { runOracle, pool, CPUS, features, hashLines, saveHuman, buildApp, BASE, LOG_SETS } from './lib.mjs'
import { codeDir, readPin } from './oracle/pin.mjs'
import { setupFor, mulberry32, MODES } from './oracle/human-bot.mjs'

const NEEDS = {
  vote: (r) => (r.entries ?? []).some((e) => e.t === 'vote'),
  overtime: (r) => r.trace.some((l) => /^log -1 Overtime: round \d+/.test(l)),
  score: (r) => r.over.wiped < 0,
  wipe: (r) => r.over.wiped >= 0,
  // (the trace grew between the pilot and the entry after it: it played a
  // unit, whose action wrote its act line)
  pilot: (r) => ['move', 'shoot', 'charge'].every((ph) => (r.entries ?? []).some((e, i) => e.t === 'pilot' && r.asked[i] === ph && (r.at[i + 1] ?? r.trace.length) > r.at[i])),
  // (the setup's, as the candidate was made: a count string on each seat)
  lists: (r, c) => c.job.setup.seats.every((s) => typeof s.army === 'string' && !!army?.LIST.test(s.army)),
}
const { values: a } = parseArgs({
  options: {
    mode: { type: 'string' }, policy: { type: 'string' }, tag: { type: 'string' }, overtime: { type: 'string' }, need: { type: 'string' },
    count: { type: 'string' }, tries: { type: 'string' }, dry: { type: 'boolean' }, set: { type: 'string' },
    races: { type: 'string' }, armies: { type: 'string' }, 'auto-armies': { type: 'string' }, from: { type: 'string' },
    mission: { type: 'string' }, terrain: { type: 'string' }, ref: { type: 'string' }, dir: { type: 'string' },
  },
})
const need = (a.need ?? '').split(',').filter(Boolean)
const COUNT = Number(a.count ?? 1), TRIES = Number(a.tries ?? 24), FROM = Number(a.from ?? 1)
const watch = a.mode === 'watch'
const races = (a.races ?? 'squirrel,serpent').split(',')
const armies = a.armies === undefined ? null : a.armies.split(',')
const PCT = a['auto-armies'] === undefined ? null : Number(a['auto-armies'])
const bad = [
  !Object.keys(MODES).includes(a.mode) && `--mode takes ${Object.keys(MODES).join(', ')}`,
  watch && a.policy !== undefined && '--mode watch takes no --policy (the AI plays both seats)',
  !watch && !['random', 'late', 'aggressive', 'pilot'].includes(a.policy) && '--policy takes random, late, aggressive or pilot',
  !LOG_SETS.includes(a.set ?? 'human') && `--set takes ${LOG_SETS.join(' or ')}`,
  !/^[a-z]+(-[a-z]+)*$/.test(a.tag ?? '') && '--tag takes lowercase words joined by hyphens (it names the logs)',
  need.some((n) => !NEEDS[n]) && `--need takes ${Object.keys(NEEDS).join(', ')}`,
  !(Number.isInteger(COUNT) && COUNT > 0 && Number.isInteger(TRIES) && TRIES >= COUNT) && '--count and --tries take whole numbers, tries at least count',
  !(Number.isInteger(FROM) && FROM > 0) && '--from takes a whole number above 0',
  races.length !== 2 && '--races takes two races, <seat 0>,<seat 1>',
  armies && armies.length !== 2 && '--armies takes two armies, <seat 0>,<seat 1>',
  armies && PCT !== null && '--armies and --auto-armies are one or the other',
  PCT !== null && !(Number.isInteger(PCT) && PCT > 0 && PCT <= 100) && '--auto-armies takes a whole percentage, 1-100',
  (a.ref !== undefined || a.dir !== undefined) && !a.dry && '--ref and --dir take another code than the PIN only with --dry (a corpus is recorded on the PIN)',
  a.ref !== undefined && a.dir !== undefined && '--ref and --dir are one or the other',
].filter(Boolean)
if (bad.length) {
  console.error(`corpus-add: ${bad.join('; ')}`)
  process.exit(2)
}

const PIN = readPin()
// (the code the candidates play on: the PIN's, or --ref's or --dir's for
// a dry run)
const dir = a.dir ?? codeDir(a.ref ?? PIN)
const codeName = a.dir !== undefined ? `${a.dir} (--dir, a dry run)` : a.ref === undefined ? `PIN ${PIN.slice(0, 9)}` : a.ref === 'WORKTREE' ? 'the working tree (--ref, a dry run)' : `${a.ref} (--ref, a dry run)`
// The PIN's own race data and list builder (F11a): the lists are the PIN
// code's, as its hashes are.
const at = (f) => pathToFileURL(join(dir, f)).href
const ARMY = existsSync(join(dir, 'core', 'army.js'))
if ((armies || PCT !== null) && !ARMY) {
  console.error(`corpus-add: ${codeName} has no core/army.js, so no seat can name an army (F11a on)`)
  process.exit(2)
}
const { RACES } = await import(at('data/schema.js'))
const { MISSIONS } = await import(at('data/mission.js'))
const army = ARMY ? await import(at('core/army.js')) : null
// (F8b) the mission and its terrain, as the code's MISSIONS has them
const MISSION = a.mission ?? 'classic'
const M = Object.hasOwn(MISSIONS, MISSION) ? MISSIONS[MISSION] : null
if (!M) {
  console.error(`corpus-add: --mission: no mission ${JSON.stringify(MISSION)} in ${codeName}'s code (there are ${Object.keys(MISSIONS).join(', ')})`)
  process.exit(2)
}
const sets = M.sets ?? ['classic']
if (a.terrain !== undefined && !sets.includes(a.terrain)) {
  console.error(`corpus-add: --terrain: the ${MISSION} mission is fought on ${sets.join(' or ')}, not ${JSON.stringify(a.terrain)}`)
  process.exit(2)
}
// A candidate's setup on the mission's board: classic's as setupFor makes
// it (naming no mission), a larger mission's named, with its own rounds and
// its terrain (setupFor's 'classic', the default's, replaced)
const onMission = (setup) => {
  if (MISSION === 'classic') return a.terrain === undefined ? setup : { ...setup, terrain: a.terrain }
  return { ...setup, mission: MISSION, terrain: a.terrain ?? sets[0], rounds: M.rounds }
}
const unknown = races.filter((r) => !Object.hasOwn(RACES, r))
if (unknown.length) {
  console.error(`corpus-add: --races: no race ${unknown.join(', ')} in ${codeName}'s code (there are ${Object.keys(RACES).join(', ')})`)
  process.exit(2)
}

// Seat i's army for candidate k: as --armies wrote it, or built by
// autoList on k at PCT% of the mission's points, or none.
const listsOf = (setup, k) => {
  if (armies) return armies
  if (PCT === null) return null
  const rules = MISSIONS[setup.mission ?? 'classic'].list
  return races.map((race) => army.listText(army.autoList(RACES[race], { ...rules, points: Math.floor((PCT * rules.points) / 100) }, k)))
}
// a seat's army as the log's why says it: its digits and their cost
const costOf = (setup, i) => {
  const s = setup.seats[i]
  if (!army || s.army == null) return null
  const { counts } = army.armyOf(setup, i)
  // (at the mission's prices, F8b: core/army.js priceOf)
  return `${s.army} (${RACES[s.race].short ?? s.race} ${army.listCost(RACES[s.race], counts, MISSIONS[setup.mission ?? 'classic'].list)})`
}

const json = (v) => JSON.stringify(v ?? null)
const sameTrace = (x, y) => json(x.trace) === json(y.trace) && json(x.written) === json(y.written)
const same = (x, y) => sameTrace(x, y) && json(x.shadow) === json(y.shadow)
// (each play timed: a Grand battle under load takes seconds)
const run = (jobs) => pool(jobs, CPUS, (j) => {
  const t0 = Date.now()
  return runOracle(j, dir).catch((e) => ({ trace: [], shadow: [], written: [], entries: [], error: e.message })).then((r) => ({ ...r, secs: (Date.now() - t0) / 1000 }))
})

const what = [watch ? 'watched (AI v AI)' : `${a.mode}, ${a.policy} bot`, `${races.join(' v ')}`, (MISSION !== 'classic' || a.terrain) && `the ${MISSION} mission on ${a.terrain ?? sets[0]}`, a.overtime && `overtime ${a.overtime}`, armies && `armies ${armies.join(', ')}`, PCT !== null && `lists by autoList at ${PCT}%`].filter(Boolean).join(', ')
console.log(`corpus-add: ${TRIES} games (seeds ${FROM}-${FROM + TRIES - 1}), ${what}, on ${codeName}; wanted ${COUNT} showing ${need.join(', ') || 'anything'}, into ${a.set ?? 'human'}/`)
const cands = Array.from({ length: TRIES }, (_, i) => {
  const k = FROM + i, r = mulberry32(9000 + k)
  const base = onMission(setupFor(a.mode, 1 + Math.floor(r() * 99999), 1 + Math.floor(r() * 999999), a.overtime))
  const named = listsOf(base, k)
  const setup = { ...base, seats: base.seats.map((s, j) => ({ ...s, race: races[j], ...(named ? { army: named[j] } : {}) })) }
  const label = watch ? `watch-${a.tag}-${k}` : `${a.mode}-${a.policy}-${a.tag}-${k}`
  return { k, label, job: watch ? { setup } : { setup, bot: { policy: a.policy, seed: k } } }
}).filter((c) => !LOG_SETS.some((set) => existsSync(join(BASE, set, `${c.label}.json`))))
const played = await run(cands.map((c) => c.job))
const fits = cands.map((c, i) => ({ ...c, res: played[i] })).filter((c) => {
  const miss = c.res.error ? `failed: ${c.res.error.split('\n')[0]}` : need.filter((n) => !NEEDS[n](c.res, c)).join(', ')
  const end = c.res.error ? '' : c.res.over.wiped >= 0 ? `seat ${c.res.over.wiped} wiped out` : `${c.res.over.vp.join('-')} on the score`
  console.log(`  ${c.label.padEnd(30)} ${miss ? (c.res.error ? miss : `lacks ${miss}`) : 'fits'}${end ? `  (${end}${c.job.setup.seats.some((s) => s.army != null) ? `; ${c.job.setup.seats.map((s) => s.army ?? '-').join(' v ')}` : ''})` : ''}  [played in ${c.res.secs.toFixed(1)} s]`)
  return !miss
})

// admission: twice more in Node from the entries alone (a watch: its setup
// alone), then Chromium from the title screen
const work = join(tmpdir(), `tails-and-scales-corpus-add-${process.pid}`)
const { runBrowser } = await import('./chromium.mjs')
const dist = await buildApp(dir, join(work, 'dist'))
const chosen = []
for (const c of fits) {
  if (chosen.length >= COUNT) break
  const t0 = Date.now()
  const log = { setup: c.job.setup, entries: c.res.entries ?? [] }
  const [x, y] = await run([log, log])
  const node = !x.error && !y.error && same(x, c.res) && same(y, c.res)
  const t1 = Date.now()
  const [web] = node ? await runBrowser([log], { dist }) : []
  const ok = node && web && !web.error && sameTrace(web, c.res)
  const secs = `Node ${((t1 - t0) / 1000).toFixed(1)} s${node ? `, Chromium ${((Date.now() - t1) / 1000).toFixed(1)} s` : ''}`
  console.log(`  ${ok ? 'admit ' : 'REJECT'} ${c.label}${ok ? '' : !node ? ': not the same battle again in Node' : `: ${web?.error?.split('\n')[0] ?? 'the trace or battle log differs in Chromium'}`}  (${secs})`)
  if (ok) chosen.push(c)
}
rmSync(work, { recursive: true, force: true })

const describe = (f) => Object.entries(f).filter(([, v]) => v).map(([k, v]) => `${k} ${v}`).join(', ')
for (const c of chosen) {
  const entries = c.res.entries ?? []
  const votes = entries.filter((e) => e.t === 'vote').length, pilots = entries.filter((e) => e.t === 'pilot').length
  const over = c.res.trace.filter((l) => /^log -1 Overtime: round/.test(l)).length
  const lists = [0, 1].map((i) => costOf(c.job.setup, i)).filter(Boolean)
  const why = [lists.length && `lists ${lists.join(' v ')}`, votes && `votes ${votes}`, pilots && `pilots ${pilots}`, over && `overtime rounds ${over}`, c.res.over.wiped >= 0 ? `wipe ${c.res.over.wiped}` : `score ${c.res.over.vp.join('-')}`, describe(features(c.res.trace))].filter(Boolean).join(', ')
  console.log(`  ${c.label}: ${why}`)
  if (!a.dry) saveHuman(c.label, { setup: c.job.setup, bot: c.job.bot, why, n: c.res.trace.length, trace: hashLines(c.res.trace), shadow: hashLines(c.res.shadow), written: hashLines(c.res.written), entries }, a.set ?? 'human')
}
const short = chosen.length < COUNT
console.log(short ? `\ncorpus-add: only ${chosen.length} of ${COUNT} logs fit and passed admission${chosen.length && !a.dry ? ' (those written)' : ''}` : `\ncorpus-add: ${a.dry ? 'would write' : 'wrote'} ${chosen.map((c) => c.label).join(', ')}`)
process.exit(short ? 1 : 0)
