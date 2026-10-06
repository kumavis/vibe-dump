// The seats-and-races determinism check (DESIGN §4, R2). Three matchups no
// title-screen mode plays yet: serpent v serpent, squirrel v squirrel, and
// the classic pair with the seats swapped (the Coil in seat 0 on the west
// edge). They have no baseline, so each battle is played twice and must
// reach game over both times, with no error, and with identical traces,
// shadow snapshots and battle logs. Each matchup is played AI v AI and, for
// the human paths (deployClick into a seat's zone, the charge-end pick), as
// a hotseat game with both seats played by the aggressive bot policy, whose
// own seeded stream makes it deterministic too.
//
// What each run must also show:
// - the races it asked for: a run whose code ignored ?races would play the
//   classic matchup and prove nothing, so the roll-off winner must be named
//   by its seat's race, and every line a unit opens must be that seat's
//   race's unit;
// - the edges fixed by seat, never by race: seat 0 on the west edge (x < 0),
//   seat 1 on the east. Read off the first full-precision snapshot (taken at
//   the first state line), every unit that hasn't moved yet must sit on its
//   seat's side, at least one per seat. Unit ids follow army order, seat 0's
//   army first (§4.1), so the id says the seat. Determinism alone can't see
//   this: an edge taken from the race would put both mirror armies on one
//   edge, twice identically;
// - for the bot games, that the bot placed most of its units: it skips a
//   placement whose spot lands far from where it aimed (inside the seat's
//   zone), so a zone on the wrong edge would quietly place none.
// Finally the classic matchup asked for explicitly (?races=squirrel,serpent)
// must replay the corpus's AI battles exactly, so the URL path itself
// changes nothing.
//
// With --browser, each matchup's first AI battle is also played once in
// Chromium (a fresh build of the code under test, or --dist <dir>) and must
// trace and write its battle log exactly as Node did (the shadow may differ
// by an ULP of terrain between the engines, DESIGN §0.1).
//
//   node sim/mirror-check.mjs [--seeds 64-89,4242-99,…] [--ref <ref> | --dir <dir>] [--browser [--dist <dir>]]
//
// Exit 0 when everything holds, 1 when something fails, 2 when the code
// under test has no race data.
import { parseArgs } from 'node:util'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { rmSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { loadCorpus, runOracle, pool, CPUS, verdict, tag, firstDiff, buildApp } from './lib.mjs'
import { codeDir, PKG } from './oracle/pin.mjs'
import { setupFor } from './oracle/human-bot.mjs'

const { values: a } = parseArgs({
  options: { seeds: { type: 'string' }, ref: { type: 'string' }, dir: { type: 'string' }, browser: { type: 'boolean' }, dist: { type: 'string' } },
})
const dir = a.dir ? resolve(a.dir) : codeDir(a.ref ?? 'WORKTREE')
const { RACES } = await import(pathToFileURL(join(dir, 'data', 'schema.js')).href).catch((e) => {
  console.error(`mirror-check: ${dir} has no race data (data/schema.js), so it can't seat other races: code older than R2? (${e.message.split('\n')[0]})`)
  process.exit(2)
})

const MATCHUPS = [['serpent', 'serpent'], ['squirrel', 'squirrel'], ['serpent', 'squirrel']]
// the edge of each seat, restated from DESIGN §2.1 rather than imported, so a
// wrong EDGES in the code under test is caught too
const EDGE = [-1, 1]
const seeds = (a.seeds ?? '64-89,4242-99,777-1').split(',').map((p) => {
  const [seed, dice] = p.split('-').map(Number)
  if (!(seed > 0 && dice > 0)) throw new Error(`--seeds: "${p}" is not <board>-<dice>`)
  return { seed, dice }
})

// Which seat's race each log line shows, if any: the roll-off names the
// winner's race; a line that opens with a unit's short name is that unit's.
const shorts = Object.values(RACES).flatMap((r) => Object.values(r.units).map((t) => ({ race: r.key, short: t.short })))
  .sort((x, y) => y.short.length - x.short.length)
function raceProblems(trace, races) {
  const bad = []
  let checked = 0, rolloff = 0
  for (const l of trace) {
    const m = /^log (\d) (.*) rng:\S+$/.exec(l)
    if (!m) continue
    const seat = Number(m[1]), text = m[2], want = RACES[races[seat]]
    const roll = / win the roll-off and take the first turn\.$/.exec(text)
    if (roll) {
      rolloff++
      if (!text.startsWith(want.name + ' ')) bad.push(`seat ${seat} should be the ${want.name}: ${l}`)
      continue
    }
    const by = shorts.find((s) => text.startsWith(s.short + ' ') || text.startsWith(s.short + ':'))
    if (!by) continue
    checked++
    if (by.race !== want.key && !Object.values(want.units).some((t) => t.short === by.short)) bad.push(`seat ${seat} plays ${want.key}, but: ${l}`)
  }
  if (rolloff !== 1) bad.push(`expected one roll-off line, found ${rolloff}`)
  if (checked < 20) bad.push(`only ${checked} log lines name a unit, too few to tell the races apart`)
  return { bad, checked }
}

// Every unit still unmoved in the first snapshot sits on its seat's side of
// the table. Returns the problems and how many units of each seat it checked.
function edgeProblems(shadow0, races) {
  if (!shadow0) return { bad: ['no snapshot to read the edges from'], per: [0, 0] }
  const n0 = RACES[races[0]].army.length, n = n0 + RACES[races[1]].army.length
  const units = shadow0.split(' | ').slice(1, -1).map((p) => {
    const m = /^(\d+)@(\S+),(\S+) r\S+ a\d+ l\d+(?: mes)? \{([^}]*)\}/.exec(p)
    return m && { id: Number(m[1]), x: Number(m[2]), moved: m[4] !== '' }
  })
  if (units.some((u) => !u) || units.map((u) => u.id).join() !== Array.from({ length: n }, (_, i) => i + 1).join()) {
    return { bad: [`the snapshot's units aren't ids 1-${n} in order, so the seats can't be told apart: ${shadow0.slice(0, 120)}`], per: [0, 0] }
  }
  const bad = [], per = [0, 0]
  for (const u of units) {
    if (u.moved) continue
    const seat = u.id <= n0 ? 0 : 1
    per[seat]++
    if (Math.sign(u.x) !== EDGE[seat]) bad.push(`unit ${u.id} (seat ${seat}, ${races[seat]}) starts at x ${u.x}, not on the ${EDGE[seat] < 0 ? 'west' : 'east'} edge`)
  }
  for (const s of [0, 1]) if (!per[s]) bad.push(`no unmoved unit of seat ${s} in the first snapshot to check`)
  return { bad, per }
}

let failed = 0
const fail = (msg) => {
  failed++
  console.log(`  FAIL ${msg}`)
}

console.log(`mirror-check: ${MATCHUPS.length} matchups × ${seeds.length} battles, AI v AI and bot v bot, each played twice, on ${a.dir ? dir : a.ref ? `ref ${a.ref}` : 'the working tree'}`)
// the bot games' setup still names the classic races: the legacy oracle
// takes only title-screen setups (oracle/human-bot.mjs legacyMode), and the
// races go on the URL; the step that admits race logs to the corpus folds
// them into setup.seats
const jobs = MATCHUPS.flatMap((races) => seeds.flatMap((s) => [
  { kind: 'ai', job: { ...s, races } },
  { kind: 'bot', job: { setup: setupFor('hotseat', s.seed, s.dice), bot: { policy: 'aggressive', seed: s.seed }, races } },
]))
const runs = await pool(jobs.flatMap((j) => [j, j]), CPUS, (j) => runOracle(j.job, dir))
const nodeRun = new Map()
for (let k = 0; k < jobs.length; k++) {
  const { kind, job } = jobs[k], r1 = runs[2 * k], r2 = runs[2 * k + 1]
  const setup = job.setup ?? job
  const name = `${kind} ${job.races.join(' v ')} ${setup.seed ?? setup.board}-${setup.dice}`.padEnd(34)
  nodeRun.set(job, r1)
  const errs = []
  for (const [i, r] of [[1, r1], [2, r2]]) {
    if (r.error) errs.push(`run ${i} stopped: ${r.error.split('\n')[0]}`)
    else if (!r.trace.at(-1)?.startsWith('over ')) errs.push(`run ${i} never reached game over`)
  }
  for (const k2 of ['trace', 'shadow', 'written', ...(kind === 'bot' ? ['entries'] : [])]) {
    const show = (v) => (typeof v === 'string' ? v : JSON.stringify(v))
    const x = (r1[k2] ?? []).map(show), y = (r2[k2] ?? []).map(show)
    const i = x.findIndex((l, n) => l !== y[n])
    const at = i >= 0 ? i : x.length !== y.length ? Math.min(x.length, y.length) : -1
    if (at >= 0) errs.push(`the two runs' ${k2} differ at ${k2 === 'trace' ? 'line' : 'entry'} ${at + 1}:\n         ${x[at]}\n         ${y[at]}`)
  }
  const { bad, checked } = raceProblems(r1.trace, job.races)
  errs.push(...bad.slice(0, 3))
  const edges = edgeProblems(r1.shadow?.[0], job.races)
  errs.push(...edges.bad.slice(0, 3))
  let placed = ''
  if (kind === 'bot') {
    const n = [0, 1].map((s) => (r1.entries ?? []).filter((e) => e.t === 'place' && e.s === s).length)
    const of = job.races.map((r) => RACES[r].army.length)
    for (const s of [0, 1]) if (n[s] * 2 < of[s]) errs.push(`the bot placed only ${n[s]} of seat ${s}'s ${of[s]} units: its zone is not where the seat's edge says?`)
    placed = `; placed ${n[0]}/${of[0]} and ${n[1]}/${of[1]}`
  }
  if (errs.length) fail(`${name} ${errs.join('\n       ')}`)
  else {
    const o = r1.over
    const end = o.wiped >= 0 ? `seat ${o.wiped} wiped out` : `${o.vp.join('–')} on points`
    console.log(`  ok   ${name} twice identical: ${r1.trace.length} lines, ${r1.shadow.length} states, ${r1.written.length} writes; ${end}; ${checked} lines by race; edges ${edges.per.join('+')} units${placed}`)
  }
}

// the classic matchup through the URL, against the corpus
const { items } = loadCorpus()
const pairs = items.filter((it) => it.kind === 'ai')
console.log(`\nthe classic matchup asked for by URL (?races=squirrel,serpent): ${pairs.length} corpus AI battles`)
const res = await pool(pairs, CPUS, (it) => runOracle({ ...it.job, races: ['squirrel', 'serpent'] }, dir))
let same = 0
pairs.forEach((it, i) => {
  const v = verdict(it, res[i])
  if (v.ok) same++
  else fail(`${it.id} ${tag(v, res[i])} (trace line ${firstDiff(res[i].trace, it.trace) + 1})`)
})
console.log(`  ${same}/${pairs.length} same`)

// the same matchups in Chromium, one AI battle each, against Node's run
if (a.browser) {
  const { runBrowser, DIST } = await import('./chromium.mjs')
  let dist = a.dist ? resolve(a.dist) : null, tmpBuild = null
  if (!dist && dir === PKG) {
    const { build } = await import('vite')
    await build({ root: PKG, configFile: join(PKG, 'vite.config.js'), logLevel: 'warn' })
    dist = DIST
  } else if (!dist) dist = tmpBuild = await buildApp(dir, join(tmpdir(), `tails-and-scales-mirror-${process.pid}`))
  const web = jobs.filter((j) => j.kind === 'ai' && j.job.seed === seeds[0].seed && j.job.dice === seeds[0].dice).map((j) => j.job)
  console.log(`\nin Chromium (build ${dist}): ${web.length} AI battles, against Node's trace and battle log`)
  const out = await runBrowser(web, { dist })
  console.log(`  Chromium ${out.chromium}`)
  web.forEach((job, i) => {
    const r = out[i], n = nodeRun.get(job), name = `${job.races.join(' v ')} ${job.seed}-${job.dice}`.padEnd(30)
    const diff = (k) => {
      const at = r[k].findIndex((l, j) => l !== n[k][j])
      return at >= 0 ? at : r[k].length !== n[k].length ? Math.min(r[k].length, n[k].length) : -1
    }
    const errs = []
    if (r.error) errs.push(`stopped: ${r.error.split('\n')[0]}`)
    for (const k of ['trace', 'written']) {
      const at = diff(k)
      if (at >= 0) errs.push(`${k} differs from Node's at ${k === 'trace' ? 'line' : 'write'} ${at + 1}:\n         ${r[k][at]}\n         ${n[k][at]}`)
    }
    if (errs.length) fail(`chromium ${name} ${errs.join('\n       ')}`)
    else console.log(`  ok   ${name} as in Node: ${r.trace.length} lines, ${r.written.length} writes (${r.secs} s)`)
  })
  if (tmpBuild) rmSync(tmpBuild, { recursive: true, force: true })
}

console.log(failed ? `\nmirror-check FAILED: ${failed} problem(s)` : `\nmirror-check passed: every matchup finishes, twice identically, as the races it asked for, each seat on its own edge`)
process.exit(failed ? 1 : 0)
