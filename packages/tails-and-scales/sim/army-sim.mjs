// The army builder's prices held to play (F11a, DESIGN §4.2.8.2 and §4.2.9's
// army-sim row): AI-against-AI battles between random legal lists, played
// headless by the pure core (core/index.js's createMatch, every seat `ai`,
// so the whole battle runs inside the start), and what they say about each
// unit's `cost`.
//
//   node sim/army-sim.mjs --check [--mission classic] [--terrain <set>] [--n 1500] [--fit-n 2400] [--jobs 2] [--seed S]
//   node sim/army-sim.mjs --fit   [--mission classic] [--terrain <set>] [--n 2400] [--jobs 2] [--seed S]
//   (either with --dir <packageDir>: another copy of the code, for a
//   before-and-after; the default is this package's working tree)
//   node sim/army-sim.mjs --self-test [--terrain <set>] [--jobs 2]
//
// --terrain (F7a's merge) plays one of the sets the mission offers, alone:
// its score gate, and the fit's battles all on it. Without it --check
// plays every set the mission offers (DESIGN §4.2.8.2 step 5: classic and,
// from F7a, fortified at Skirmish), a score gate on each and the fit's
// battles spread over them, two by two (a seat-swapped pair on one set).
// The streams are named by set, so `--terrain classic` plays exactly the
// battles F11a's one set did, and a set's score gate is the same battles
// with or without it.
//
// --n is the score gate's battles per pair and set under --check (--fit-n
// its fit's), and the fit's under --fit; each, and --jobs, a whole number
// above 0. Exit 0 when every gate holds, 1 when one fails (or a battle
// throws), 2 on a bad command line (an unknown option, a count that is no
// whole number, a set the mission doesn't offer).
//
// --self-test holds the gates to broken price tables, as every standing
// harness holds its own: three copies of the package's code, each run with
// --check at a small N (300 score battles, 600 fit; the default seed), on
// one set (--terrain's, else the mission's first: a broken price table
// shows on any set, and at this N a sound one sits closer to a second
// set's band than the control should be asked to):
//   sound         the working tree as it is: every gate holds (the control:
//                 at this N, too, the gates can pass);
//   cheap-nutkin  the Nutkin at 30 points, not 75: the score gate and the
//                 per-unit gate fail, the latter on the Nutkin, while the
//                 lists' gates (c) and (d) hold;
//   coil-over     the Brute at 125, not 100, so the Coil's classic list
//                 costs 520: gates (c) and (d) fail (its battles at a
//                 smaller N still, since only the lists' gates are judged).
// Each mutation is an exact-anchor edit of the copy's race file, failing
// loudly when the anchor is gone. Exit 0 when every case gets its verdict.
//
// A battle: a board seed and a dice seed, the mission, one of the sets it
// offers, both seats `ai`, each seat's `army` a count string that
// core/army.js's autoList built for the seat's race under the mission's
// list rules with that battle's budget (a points limit; every other rule
// the mission's), the pair's races seated one way on even battles and
// swapped on odd ones. The score is the pair's first race's (the
// Bushtails' today): a win 1, a draw 0.5, a loss 0, from the match's
// G.turn.result once createMatch returns (core/engine.js gameOver: `win`
// the seat, -1 a draw).
//
// --check is the gate, every row of §4.2.8.2's gate table that Skirmish
// carries, for every pair of races on every set the mission offers (one
// pair, and from F7a two sets, classic and fortified; F5a grows the pairs):
//   (a) the score gate: N (1,500 at Skirmish, SE 1.3) battles between the
//       random legal lists a Random seat fields (autoList at the mission's
//       own limit, so each ends within its cheapest unit of it); it holds
//       when |score − 50%| ≤ the size's band (4 points at Skirmish). A
//       balanced table fails it about 0.3% of the time, so a failing gate
//       is played again once on fresh seeds (its own stream), and only that
//       second run counts;
//   (b) the per-unit gate: the fit below (2,400 battles at Skirmish); each
//       unit's fitted value lies within max(2 SE, 20%) of its cost. A unit
//       whose count never varies over the fit's lists (the hero: a Skirmish
//       list holds exactly one) can't be told from the intercept and is
//       exempt, as §4.2.8.2 exempts the heroes at Skirmish;
//   (c) each race's classic list costs at most the mission's limit;
//   (d) each mission's own preset is legal for every race (armyOf, the
//       fold's own refusal).
// It prints the score ± SE, each unit's fitted value ± SE against its cost,
// and each gate's verdict.
//
// --fit is the report: the fitted price table, beside today's costs. A
// quasi-binomial logistic model of the first race's score on an
// intercept, the seat (+1 with the first race in seat 0, −1 swapped) and
// both sides' unit counts (the second race's entered negated, so every
// coefficient is a unit's worth to its own side), fitted by IRLS in plain
// JS; the dispersion is the Pearson χ² over the residual degrees of
// freedom, and it scales the covariance. Then §4.2.8.2's procedure:
//   1. the exchange rate: both classic lists' fitted value (Σ count ×
//      coefficient over the units the fit identifies) over what those units
//      cost today, logits per point;
//   2. each unit's fitted value: its coefficient over the rate, its SE by
//      the delta method through the rate (the full covariance);
//   3. the heroes, when the fit can't separate them: the intercept is their
//      difference in worth, so the pair's two hero prices keep today's mean
//      and split the intercept over the rate between them, a race-level
//      handicap;
//   4. round to 5 (at least 5), then while a classic list costs more than
//      the limit, take 5 off its unit priced furthest above its fitted
//      value.
//
// The budgets of the fit. §4.2.8.2 fits on budgets drawn from 80-120% of
// the limit, because balance moves with army size and a fit far from the
// limit misleads. The prototype's fold had no limit to refuse a list by;
// this core's has (fullSetup's armyOf refuses 515 points in a Skirmish),
// and this check patches nothing. So each side's budget is drawn uniformly
// from 80-120% of the limit, as the procedure says, and a budget over the
// limit is played at the limit: half the fit's lists are autoList's at
// 400-500 points and half are lists built to the limit (450-500 spent). That
// keeps every battle one the shipped rules play, still varies both sides'
// sizes and their difference (which is what identifies the coefficients),
// and leaves the lists over the limit, which no shipped battle fields, out.
//
// Everything is seeded: one master seed (--seed; fixed by default) names
// every battle's board, dice, budgets and autoList seeds, through
// mulberry32(cyrb53(`<seed>:<stream>:<battle>`)), per battle, so a battle is
// the same whichever process plays it. --jobs N plays them over N child
// processes (2 by default: the machine is shared), in chunks, and the
// report reads the results in battle order, so it doesn't depend on how
// the battles were spread. A battle that throws fails the run, named.
import { fork, spawn } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'
import { copyCode } from './lib.mjs'

const PKG = fileURLToPath(new URL('..', import.meta.url))
const SELF = fileURLToPath(import.meta.url)

// A bad command line is exit 2, never a run on defaults or a gate's exit 1.
const usage = (why) => {
  console.error(`army-sim: ${why}`)
  process.exit(2)
}
let a
try {
  ({ values: a } = parseArgs({
    options: {
      check: { type: 'boolean' }, fit: { type: 'boolean' }, worker: { type: 'boolean' }, 'self-test': { type: 'boolean' },
      mission: { type: 'string', default: 'classic' }, terrain: { type: 'string' }, n: { type: 'string' }, 'fit-n': { type: 'string' },
      jobs: { type: 'string', default: '2' }, seed: { type: 'string', default: '1111' }, dir: { type: 'string' },
    },
  }))
} catch (e) {
  usage(e.message)
}
for (const k of ['n', 'fit-n', 'jobs']) {
  if (a[k] !== undefined && !/^[1-9][0-9]*$/.test(a[k])) usage(`--${k} takes a whole number above 0, not ${JSON.stringify(a[k])}`)
}
const DIR = a.dir ? resolve(a.dir) : PKG
const load = (f) => import(pathToFileURL(join(DIR, f)).href)
const [core, { RACES }, { MISSIONS }, { mulberry32, cyrb53 }] = await Promise.all([load('core/index.js'), load('data/schema.js'), load('data/mission.js'), load('core/util.js')])
const A = core.army

// ── A battle ────────────────────────────────────────────────────────────────
// Battle `i` of stream `stream` (the gate and pair it belongs to, which
// also names the races and the set): its setup, from its own seeded draw.
// `budget` 'limit' builds both lists at the mission's limit (a Random
// seat's); 'fit' draws each side's from 80-120% of it, played at most at it
// (the header's "budgets of the fit").
function battleOf({ stream, i, mission, set, pair, budget }) {
  const rng = mulberry32(cyrb53(`${a.seed}:${stream}:${i}`))
  const u32 = () => Math.floor(rng() * 4294967296)
  const board = u32(), dice = u32()
  const rules = MISSIONS[mission].list
  const lists = pair.map((race) => {
    const points = budget === 'fit' ? Math.min(rules.points, Math.round(rules.points * (0.8 + 0.4 * rng()))) : rules.points
    const counts = A.autoList(RACES[race], { ...rules, points }, u32())
    return { race, points, counts, army: A.listText(counts) }
  })
  // (seats swapped on every odd battle: the pair's second race in seat 0)
  const swap = i % 2 === 1
  const seated = swap ? [lists[1], lists[0]] : lists
  const setup = { board, dice, mission, terrain: set, seats: seated.map((l) => ({ race: l.race, ctrl: 'ai', army: l.army })) }
  return { setup, swap, lists }
}

// Play one battle to its end; the first race's score and what the fit reads.
function play(task) {
  const { setup, swap, lists } = battleOf(task)
  const t0 = performance.now()
  let G, error = null
  try {
    G = core.createMatch(setup)
    if (G.turn.stage !== 'over' || !G.turn.result) throw new Error(`an AI battle stopped short of its end (stage ${G.turn.stage}, waiting on ${JSON.stringify(G.pending)})`)
  } catch (e) {
    error = `battle ${task.stream} #${task.i} (${JSON.stringify(setup)}): ${String(e?.stack ?? e)}`
  }
  const ms = performance.now() - t0
  if (error) return { i: task.i, error, ms }
  const win = G.turn.result.win
  // the first race's seat this battle
  const mine = swap ? 1 : 0
  const y = win === -1 ? 0.5 : win === mine ? 1 : 0
  return { i: task.i, y, swap, counts: lists.map((l) => l.counts), spent: lists.map((l) => A.listCost(RACES[l.race], l.counts)), why: G.turn.result.why, ms }
}

// Play `tasks` over `jobs` processes (in this one with jobs 1), in chunks;
// the results come back in task order.
async function playAll(tasks, label) {
  const jobs = Math.max(1, Number(a.jobs) || 1)
  const out = new Array(tasks.length)
  const t0 = performance.now()
  let done = 0, told = 0
  const tell = () => {
    // (progress on stderr, about every quarter of the run)
    if (done < tasks.length && done - told < tasks.length / 4) return
    told = done
    process.stderr.write(`  ${label}: ${done}/${tasks.length} battles, ${((performance.now() - t0) / 1000).toFixed(0)} s\n`)
  }
  if (jobs === 1) {
    for (const [k, t] of tasks.entries()) {
      out[k] = play(t)
      done++
      tell()
    }
  } else {
    const CHUNK = 20
    const chunks = []
    for (let k = 0; k < tasks.length; k += CHUNK) chunks.push(k)
    let next = 0
    const lane = async () => {
      const child = fork(SELF, ['--worker', '--seed', a.seed, ...(a.dir ? ['--dir', DIR] : [])], { stdio: ['ignore', 'inherit', 'inherit', 'ipc'] })
      const exited = new Promise((_, reject) => child.on('exit', (code) => reject(new Error(`an army-sim worker exited (code ${code}) with battles unplayed`))))
      exited.catch(() => {})
      try {
        for (let c; (c = next++) < chunks.length; ) {
          const at = chunks[c], part = tasks.slice(at, at + CHUNK)
          const reply = new Promise((ok) => child.once('message', ok))
          child.send({ id: c, tasks: part })
          const { results } = await Promise.race([reply, exited])
          results.forEach((r, k) => (out[at + k] = r))
          done += part.length
          tell()
        }
      } finally {
        child.removeAllListeners('exit')
        child.disconnect()
      }
    }
    await Promise.all(Array.from({ length: Math.min(jobs, chunks.length) }, lane))
  }
  const secs = (performance.now() - t0) / 1000
  const errors = out.filter((r) => r.error)
  return { results: out, secs, errors, cpu: out.reduce((s, r) => s + r.ms, 0) / 1000 }
}

// ── The statistics ──────────────────────────────────────────────────────────
// The first race's mean score and its SE (the sample's), in percent.
function scoreOf(results) {
  const ys = results.map((r) => r.y), n = ys.length
  const m = ys.reduce((s, y) => s + y, 0) / n
  const v = ys.reduce((s, y) => s + (y - m) * (y - m), 0) / (n - 1)
  return { n, score: 100 * m, se: 100 * Math.sqrt(v / n), draws: ys.filter((y) => y === 0.5).length }
}

// The inverse of the symmetric positive-definite matrix M (Gauss-Jordan,
// partial pivoting); throws on a singular one, naming the column.
function inverse(M, names) {
  const p = M.length
  const W = M.map((row, i) => [...row, ...row.map((_, j) => (i === j ? 1 : 0))])
  for (let c = 0; c < p; c++) {
    let piv = c
    for (let r = c + 1; r < p; r++) if (Math.abs(W[r][c]) > Math.abs(W[piv][c])) piv = r
    if (Math.abs(W[piv][c]) < 1e-12) throw new Error(`the fit's information matrix is singular at ${names[c]}: a column the lists never vary, or one that is another's sum`)
    ;[W[c], W[piv]] = [W[piv], W[c]]
    const d = W[c][c]
    for (let j = 0; j < 2 * p; j++) W[c][j] /= d
    for (let r = 0; r < p; r++) {
      if (r === c || !W[r][c]) continue
      const f = W[r][c]
      for (let j = 0; j < 2 * p; j++) W[r][j] -= f * W[c][j]
    }
  }
  return W.map((row) => row.slice(p))
}

// A quasi-binomial logistic regression of y (in [0, 1]) on the rows of X,
// by iteratively reweighted least squares: { beta, cov, phi, iters }.
function logisticIRLS(X, y, names) {
  const n = X.length, p = X[0].length
  let beta = new Array(p).fill(0), info = null, iters = 0
  const muOf = (row, b) => 1 / (1 + Math.exp(-row.reduce((s, x, j) => s + x * b[j], 0)))
  for (; iters < 100; iters++) {
    const H = Array.from({ length: p }, () => new Array(p).fill(0)), g = new Array(p).fill(0)
    for (let i = 0; i < n; i++) {
      const row = X[i], mu = muOf(row, beta), w = mu * (1 - mu)
      for (let j = 0; j < p; j++) {
        g[j] += row[j] * (y[i] - mu)
        for (let k = 0; k < p; k++) H[j][k] += row[j] * w * row[k]
      }
    }
    info = inverse(H, names)
    // the Newton step, which IRLS's weighted least squares is
    const step = info.map((r) => r.reduce((s, h, k) => s + h * g[k], 0))
    beta = beta.map((b, j) => b + step[j])
    if (Math.max(...step.map(Math.abs)) < 1e-10) break
  }
  let chi = 0
  for (let i = 0; i < n; i++) {
    const mu = muOf(X[i], beta)
    chi += ((y[i] - mu) * (y[i] - mu)) / (mu * (1 - mu))
  }
  const phi = chi / (n - p)
  return { beta, cov: info.map((r) => r.map((v) => v * phi)), phi, iters }
}

// The fit of a pair's battles (DESIGN §4.2.8.2 steps 1-4): each unit's
// fitted value in points, with its SE, and the proposed table.
function fitOf(pair, results, rules) {
  const races = pair.map((r) => RACES[r])
  // the columns: the intercept, the seat, then every roster entry of each
  // race whose count varies over these lists (a hero at Skirmish doesn't)
  const cols = [{ name: 'intercept' }, { name: 'seat' }]
  races.forEach((race, side) => race.roster.forEach((key, k) => {
    const seen = new Set(results.map((r) => r.counts[side][k]))
    if (seen.size > 1) cols.push({ side, k, key, name: `${race.short} ${race.units[key].short}` })
  }))
  const X = results.map((r) => cols.map((c) => (c.name === 'intercept' ? 1 : c.name === 'seat' ? (r.swap ? -1 : 1) : (c.side ? -1 : 1) * r.counts[c.side][c.k])))
  const { beta, cov, phi, iters } = logisticIRLS(X, results.map((r) => r.y), cols.map((c) => c.name))
  // 1. the exchange rate: the classic lists' fitted worth over their cost,
  // over the units the fit identifies (a gradient vector g, rate = g · beta)
  const classic = races.map((race) => race.roster.map((key) => race.army.filter((k) => k === key).length))
  const grad = cols.map((c) => (c.key ? classic[c.side][c.k] : 0))
  const cost = cols.reduce((s, c) => s + (c.key ? classic[c.side][c.k] * races[c.side].units[c.key].cost : 0), 0)
  const worth = grad.reduce((s, gj, j) => s + gj * beta[j], 0)
  const rate = worth / cost
  // 2. each unit's value, coefficient / rate, its SE by the delta method:
  // ∂v/∂b = (e_j − v·grad/cost) / rate
  const vecSE = (d) => Math.sqrt(d.reduce((s, dj, j) => s + dj * d.reduce((t, dk, k) => t + cov[j][k] * dk, 0), 0))
  const units = []
  races.forEach((race, side) => race.roster.forEach((key, k) => {
    const j = cols.findIndex((c) => c.side === side && c.k === k)
    const t = race.units[key]
    if (j < 0) return units.push({ side, k, key, race, cost: t.cost, value: null, se: null, role: t.role, fitted: false })
    const v = beta[j] / rate
    const d = cols.map((_, m) => ((m === j ? 1 : 0) - (v * grad[m]) / cost) / rate)
    units.push({ side, k, key, race, cost: t.cost, value: v, se: vecSE(d), role: t.role, fitted: true })
  }))
  // 3. the units the fit can't separate (each side's hero at Skirmish):
  // the intercept is their difference, in points over the rate, split about
  // today's mean of their prices
  const fixed = units.filter((u) => u.value === null)
  let handicap = null
  if (fixed.length === 2 && fixed[0].side !== fixed[1].side) {
    const diff = beta[0] / rate
    const d = cols.map((_, m) => ((m === 0 ? 1 : 0) - (diff * grad[m]) / cost) / rate)
    handicap = { diff, se: vecSE(d) }
    const mean = (fixed[0].cost + fixed[1].cost) / 2
    fixed[0].value = mean + diff / 2
    fixed[1].value = mean - diff / 2
    fixed.forEach((u) => (u.se = handicap.se / 2))
  }
  // 4. the proposed table: round to 5; then each classic list brought
  // within the limit, 5 at a time off its unit priced furthest over its
  // fitted value
  for (const u of units) u.proposed = u.value === null ? u.cost : Math.max(5, Math.round(u.value / 5) * 5)
  const classicAt = (side) => units.filter((u) => u.side === side).reduce((s, u) => s + classic[side][u.k] * u.proposed, 0)
  for (const side of [0, 1]) {
    while (classicAt(side) > rules.points) {
      const over = units.filter((u) => u.side === side && classic[side][u.k] && u.proposed > 5).sort((x, y) => y.proposed - y.value - (x.proposed - x.value))[0]
      if (!over) break
      over.proposed -= 5
    }
  }
  return { cols: cols.map((c) => c.name), beta, phi, iters, rate, units, handicap, classic: [0, 1].map((side) => ({ today: A.listCost(races[side], classic[side]), proposed: classicAt(side) })) }
}

// ── Reports ─────────────────────────────────────────────────────────────────
const pct = (s) => `${s.score.toFixed(1)}% ± ${s.se.toFixed(1)} (N = ${s.n}, ${s.draws} drawn)`
const num = (v, w = 6) => (v === null ? '–' : v.toFixed(0)).padStart(w)
const size = (rules) => rules.size ?? 'battle'
// The score gate's band: 4 points at Skirmish, 5 at Field, 6 at Grand
// (§4.2.8.2's gate table; a size it doesn't name gets Skirmish's)
const BAND = { Skirmish: 4, Field: 5, Grand: 6 }

// The races' pairs: every two distinct races, in RACES order (the first's
// score is the one reported)
const pairs = () => {
  const keys = Object.keys(RACES), out = []
  keys.forEach((r, i) => keys.slice(i + 1).forEach((s) => out.push([r, s])))
  return out
}

function printFit(pair, fit, { gate = false } = {}) {
  console.log(`\n  the fit (${pair.map((r) => RACES[r].short).join(' vs ')}): IRLS in ${fit.iters} steps, dispersion ${fit.phi.toFixed(3)}, exchange rate ${(1000 * fit.rate).toFixed(3)} logits per 1,000 points`)
  if (fit.handicap) console.log(`  the heroes' difference (the intercept): ${fit.handicap.diff.toFixed(1)} ± ${fit.handicap.se.toFixed(1)} points to the ${RACES[pair[0]].short}`)
  console.log(`  ${'unit'.padEnd(34)} ${'role'.padEnd(10)}   cost  fitted ±  SE   proposed${gate ? '   gate' : ''}`)
  let failed = 0
  for (const u of fit.units) {
    const exempt = !u.fitted
    const band = Math.max(2 * (u.se ?? 0), 0.2 * u.cost)
    const ok = exempt || Math.abs(u.value - u.cost) <= band
    if (!ok) failed++
    const verdict = !gate ? '' : exempt ? '   exempt (its count never varies: the intercept)' : `   ${ok ? 'ok  ' : 'FAIL'} (within ${band.toFixed(0)})`
    console.log(`  ${`${u.race.short}: ${u.race.units[u.key].name}`.padEnd(34)} ${u.role.padEnd(10)} ${num(u.cost)}  ${num(u.value)} ± ${num(u.se, 3)}   ${num(u.proposed, 6)}${verdict}`)
  }
  console.log(`  classic lists: ${fit.classic.map((c, s) => `${RACES[pair[s]].short} ${c.today} today, ${c.proposed} proposed`).join('; ')}`)
  return failed
}

const runtime = (r) => `${r.results.length} battles in ${r.secs.toFixed(0)} s wall (${(r.results.length / r.secs).toFixed(1)} a second; ${(1000 * r.cpu / r.results.length).toFixed(0)} ms each)`

function failErrors(r) {
  if (!r.errors.length) return false
  console.log(`\n  ${r.errors.length} battle(s) threw; the first:\n  ${r.errors[0].error}`)
  return true
}

// The sets a run plays: --terrain's alone, else every set the mission
// offers (a set it doesn't offer is a bad command line).
function setsOf(mission) {
  if (a.terrain === undefined) return mission.sets
  if (!mission.sets.includes(a.terrain)) usage(`--terrain takes a set the ${a.mission} mission offers (${mission.sets.join(', ')}), not ${JSON.stringify(a.terrain)}`)
  return [a.terrain]
}

async function main() {
  const name = a.mission
  const mission = MISSIONS[name]
  if (!mission) {
    console.error(`army-sim: no mission ${JSON.stringify(name)} (there are ${Object.keys(MISSIONS).join(', ')})`)
    process.exit(2)
  }
  if (!a.check && !a.fit) {
    console.error('army-sim: --check (the gates), --fit (the fitted price table) or --self-test')
    process.exit(2)
  }
  const sets = setsOf(mission)
  const rules = mission.list
  const T0 = performance.now()
  const fitN = Number(a.fit ? a.n : a['fit-n']) || 2400
  const tasksOf = (stream, n, pair, budget, set) => Array.from({ length: n }, (_, i) => ({ stream, i, mission: name, set: set ?? sets[Math.floor(i / 2) % sets.length], pair, budget }))
  console.log(`army-sim: the ${name} mission (a ${size(rules)}, ${rules.points} points) on ${sets.join(' and ')}${a.terrain ? ' (--terrain)' : ''}, seed ${a.seed}, ${a.jobs} job(s), on ${a.dir ? DIR : 'the working tree'}`)

  if (a.fit) {
    for (const pair of pairs()) {
      const r = await playAll(tasksOf(`fit:${pair}`, fitN, pair, 'fit'), `fit ${pair.join('-')}`)
      if (failErrors(r)) process.exit(1)
      console.log(`\n${pair.map((r) => RACES[r].short).join(' vs ')}, budgets 80-120% of the limit (played at most at it): ${pct(scoreOf(r.results))}; ${runtime(r)}`)
      printFit(pair, fitOf(pair, r.results, rules))
    }
    console.log(`\narmy-sim --fit: ${((performance.now() - T0) / 1000).toFixed(0)} s`)
    return
  }

  let failed = 0
  const gate = (ok, what) => {
    if (!ok) failed++
    console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`)
  }
  // (c) and (d): the price table and the presets, before any battle
  console.log('\nthe lists')
  for (const race of Object.values(RACES)) {
    const counts = race.roster.map((key) => race.army.filter((k) => k === key).length)
    const c = A.listCost(race, counts)
    gate(c <= rules.points, `${race.name}: the classic list (${A.listText(counts)}) costs ${c}, the limit ${rules.points}`)
  }
  for (const [m, M] of Object.entries(MISSIONS)) {
    for (const race of Object.keys(RACES)) {
      let why = null
      try {
        A.armyOf({ mission: m, seats: [{ race, ctrl: 'ai' }] }, 0)
      } catch (e) {
        why = e.message
      }
      gate(!why, `the ${m} mission's preset, ${JSON.stringify(M.army)}, is legal for the ${RACES[race].name}${why ? `: ${why}` : ''}`)
    }
  }

  // (a) the score gates, per pair and set; a failure played again once
  const band = BAND[size(rules)] ?? BAND.Skirmish
  const N = Number(a.n) || 1500
  for (const pair of pairs()) {
    for (const set of sets) {
      const what = `${pair.map((r) => RACES[r].short).join(' vs ')} on ${set}`
      console.log(`\nthe score gate: ${what}, random legal lists at the limit, |score − 50%| ≤ ${band}`)
      let r = await playAll(tasksOf(`score:${pair}:${set}`, N, pair, 'limit', set), `score ${what}`)
      if (failErrors(r)) process.exit(1)
      let s = scoreOf(r.results)
      console.log(`  ${RACES[pair[0]].short} score ${pct(s)}; ${runtime(r)}`)
      if (Math.abs(s.score - 50) > band) {
        console.log(`  outside the band: played again once on fresh seeds, and that run counts`)
        r = await playAll(tasksOf(`score-again:${pair}:${set}`, N, pair, 'limit', set), `score again ${what}`)
        if (failErrors(r)) process.exit(1)
        s = scoreOf(r.results)
        console.log(`  ${RACES[pair[0]].short} score ${pct(s)}; ${runtime(r)}`)
      }
      gate(Math.abs(s.score - 50) <= band, `the score gate, ${what}: ${s.score.toFixed(1)}% is ${Math.abs(s.score - 50).toFixed(1)} points from even`)
    }
  }

  // (b) the per-unit gate, from the fit
  for (const pair of pairs()) {
    const what = pair.map((r) => RACES[r].short).join(' vs ')
    console.log(`\nthe per-unit gate: ${what}, the fit on budgets 80-120% of the limit (played at most at it); each unit within max(2 SE, 20%) of its cost`)
    const r = await playAll(tasksOf(`fit:${pair}`, fitN, pair, 'fit'), `fit ${what}`)
    if (failErrors(r)) process.exit(1)
    console.log(`  ${RACES[pair[0]].short} score over the fit's battles ${pct(scoreOf(r.results))}; ${runtime(r)}`)
    const bad = printFit(pair, fitOf(pair, r.results, rules), { gate: true })
    gate(!bad, `the per-unit gate, ${what}: ${bad ? `${bad} unit(s) priced outside their band` : 'every unit within its band'}`)
  }

  const secs = (performance.now() - T0) / 1000
  console.log(failed ? `\narmy-sim --check FAILED: ${failed} gate(s) (${secs.toFixed(0)} s)` : `\narmy-sim --check passed: every gate holds (${secs.toFixed(0)} s)`)
  process.exit(failed ? 1 : 0)
}

// ── The self-test ───────────────────────────────────────────────────────────
// The header's three cases: each a copy of the package's code, mutated by an
// exact anchor, run with --check, and held to its exit code and the
// verdicts its gate lines print.
const GATE_LINES = {
  c: / the classic list \(/,
  d: / mission's preset, /,
  a: / the score gate, /,
  b: / the per-unit gate, /,
}
const SELF_TESTS = [
  { name: 'sound', n: 300, fitN: 600, exit: 0, want: { c: 'ok', d: 'ok', a: 'ok', b: 'ok' } },
  {
    name: 'cheap-nutkin', n: 300, fitN: 600, exit: 1, want: { c: 'ok', d: 'ok', a: 'FAIL', b: 'FAIL' },
    edit: ['data/races/squirrel.js', 'pts: 7, cost: 75,', 'pts: 7, cost: 30,'], also: [/Nutkin Skirmishers .*FAIL \(within/, 'the per-unit gate fails on the Nutkin'],
  },
  {
    name: 'coil-over', n: 100, fitN: 200, exit: 1, want: { c: 'FAIL', d: 'FAIL' },
    edit: ['data/races/serpent.js', 'pts: 125, cost: 100,', 'pts: 125, cost: 125,'], also: [/FAIL Coil[^:]*: the classic list \(\d+\) costs 520/, "the Coil's classic list is named at 520"],
  },
]

async function selfTest() {
  // (the header's one set: --terrain's, else the mission's first)
  const mission = MISSIONS[a.mission]
  if (!mission) usage(`no mission ${JSON.stringify(a.mission)} (there are ${Object.keys(MISSIONS).join(', ')})`)
  const set = setsOf(mission)[0]
  const work = mkdtempSync(join(tmpdir(), 'tails-and-scales-army-sim-'))
  let bad = 0
  const say = (ok, what) => {
    if (!ok) bad++
    console.log(`  ${ok ? 'ok  ' : 'BAD '} ${what}`)
  }
  const T0 = performance.now()
  console.log(`army-sim self-test: ${SELF_TESTS.length} copies of the code under --check on ${set}, seed ${a.seed}, ${a.jobs} job(s)`)
  try {
    for (const t of SELF_TESTS) {
      const dir = copyCode(PKG, join(work, t.name))
      if (t.edit) {
        const [file, from, to] = t.edit, path = join(dir, file), text = readFileSync(path, 'utf8')
        const at = text.split(from).length - 1
        if (at !== 1) throw new Error(`self-test ${t.name}: the anchor ${JSON.stringify(from)} is in ${file} ${at} time(s), not once: port the mutation`)
        writeFileSync(path, text.replace(from, to))
      }
      const args = [SELF, '--check', '--dir', dir, '--n', String(t.n), '--fit-n', String(t.fitN), '--jobs', a.jobs, '--seed', a.seed, '--mission', a.mission, '--terrain', set]
      const t1 = performance.now()
      const { code, out } = await new Promise((done) => {
        const child = spawn(process.execPath, args, { stdio: ['ignore', 'pipe', 'inherit'] })
        let out = ''
        child.stdout.on('data', (d) => (out += d))
        child.on('close', (code) => done({ code, out }))
      })
      const lines = out.split('\n')
      console.log(`\n${t.name}${t.edit ? ` (${t.edit[0]}: ${t.edit[1]} → ${t.edit[2]})` : ' (unmutated)'}, N ${t.n} / ${t.fitN}: exit ${code}, ${((performance.now() - t1) / 1000).toFixed(0)} s`)
      say(code === t.exit, `exits ${t.exit}${code === t.exit ? '' : `, not ${code}`}`)
      for (const [g, verdict] of Object.entries(t.want)) {
        const got = lines.filter((l) => /^ {2}(ok {2}|FAIL) /.test(l) && GATE_LINES[g].test(l)).map((l) => l.slice(2, 6).trim())
        const ok = got.length > 0 && (verdict === 'ok' ? got.every((v) => v === 'ok') : got.includes('FAIL'))
        say(ok, `gate (${g}): ${verdict === 'ok' ? 'holds' : 'fails'} (${got.length ? got.join(', ') : 'no gate line printed'})`)
      }
      if (t.also) say(lines.some((l) => t.also[0].test(l)), t.also[1])
      if (bad) console.log(out.split('\n').filter((l) => /^ {2}(ok {2}|FAIL) |threw/.test(l)).map((l) => `      | ${l}`).join('\n'))
    }
  } finally {
    rmSync(work, { recursive: true, force: true })
  }
  const secs = ((performance.now() - T0) / 1000).toFixed(0)
  console.log(bad ? `\narmy-sim self-test FAILED: ${bad} wrong verdict(s) (${secs} s)` : `\narmy-sim self-test passed: the gates hold on the sound table and fail on both broken ones (${secs} s)`)
  process.exit(bad ? 1 : 0)
}

// ── The worker, or the run ──────────────────────────────────────────────────
// A child process (--worker) plays each chunk of tasks it is sent and sends
// back their results, until its parent hangs up.
if (a.worker) {
  process.on('message', ({ id, tasks }) => process.send({ id, results: tasks.map(play) }))
  process.on('disconnect', () => process.exit(0))
} else if (a['self-test']) {
  await selfTest()
} else {
  await main()
}
