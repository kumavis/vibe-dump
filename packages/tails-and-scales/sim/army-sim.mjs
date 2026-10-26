// The army builder's prices held to play (F11a, DESIGN §4.2.8.2 and §4.2.9's
// army-sim row): AI-against-AI battles between random legal lists, played
// headless by the pure core (core/index.js's createMatch, every seat `ai`,
// so the whole battle runs inside the start), and what they say about each
// unit's `cost` (and, F8b, each mission's own prices, below).
//
//   node sim/army-sim.mjs --check [--mission classic,field,grand] [--terrain <set>] [--n N] [--fit-n N] [--jobs 2] [--seed S[,S…]]
//   node sim/army-sim.mjs --fit   [--mission classic,field,grand] [--terrain <set>] [--n N] [--jobs 2] [--seed S[,S…]]
//   (either with --dir <packageDir>: another copy of the code, for a
//   before-and-after or a price table tried; the default is this
//   package's working tree)
//
// (F8b) --mission names one mission or a comma-separated few; without it a
// run takes every mission, in MISSIONS order: the Skirmish (classic), the
// Field and the Grand battle, each on every set it offers. --n is the score
// gate's battles per pair and set under --check (--fit-n its fit's), and
// the fit's under --fit; each defaults to its size's N in §4.2.8.2's gate
// table (NS below: the score gate 1,500 / 900 / 625, the fit 2,400 / 900 /
// 600). Classic's battles keep F11a's seeds; a larger mission's stream
// names it, so its battles draw seeds of their own. Exit 0 when every gate
// holds, 1 when one fails (or a battle throws), 2 on a bad command line
// (Grand's battle gates, reported, never fail it: below).
//
// (F8b) The prices. A list is priced as the fold prices it, by core/army.js
// priceOf under the mission's list rules: a unit's `cost`, or the
// mission's own price where its list sets one (`list.prices`, §4.2.8.2's
// fallback for a unit whose worth no one table holds at every size). The
// fit's exchange rate, each unit's cost in the per-unit gate and the
// proposed table are all that mission's prices. Where the heroes are fitted
// (Field and Grand: a list holds one to three) the intercept is printed as
// the race-level edge in points, which the heroes' prices answer.
//
//   node sim/army-sim.mjs --self-test [--terrain <set>] [--jobs 2]
//
// (F11a's review) --n, --fit-n and --jobs are each a whole number above 0.
// Exit 2 on a bad command line (an unknown option, a count that is no
// whole number, (F7a's merge) a set a mission run doesn't offer).
//
// --terrain (F7a's merge) plays one of the sets each mission run offers,
// alone: its score gate, and the fit's battles all on it. Without it
// --check plays every set the mission offers (DESIGN §4.2.8.2 step 5:
// classic and, from F7a, fortified at Skirmish; open and fortified at
// Field and Grand), a score gate on each and the fit's battles spread over
// them, two by two (a seat-swapped pair on one set). The streams are named
// by set, so `--terrain classic` plays exactly the battles F11a's one set
// did, and a set's score gate is the same battles with or without it.
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
// (WIP merge: the self-test runs the Skirmish alone, --mission classic.)
//
// A battle: a board seed and a dice seed, the mission, one of the sets it
// offers, both seats `ai`, each seat's `army` a count string that
// core/army.js's autoList built for the seat's race under the mission's
// list rules with that battle's budget (a points limit; every other rule
// the mission's), the pair's races seated one way on even battles and
// swapped on odd ones. The score is the pair's first race's (the
// Bushtails' today): a win 1, a draw 0.5, a loss 0, from the match's
// G.turn.result once createMatch returns (core/engine.js gameOver: `win`
// the seat, -1 a draw). (F9a) autoList draws a vehicle like any unit whose
// one more fits, so the War-Cart comes into a Field or Grand list wherever
// its Vehicle slot has room (0 to 2 a list) and never into a Skirmish one
// (the slot [0, 0]): the fit's lists vary its count, and the Skirmish's
// battles are the ones they were before it.
//
// --check is the gate, every row of §4.2.8.2's gate table, for every
// pair of races on every set each mission offers (one pair and one set a
// mission today; F5a and F7a grow both):
//   (a) the score gate: N (1,500 at Skirmish, SE 1.3; 900 at Field, SE
//       1.7; 625 at Grand, SE 2.0) battles between the random legal lists
//       a Random seat fields (autoList at the mission's own limit, so each
//       ends within its cheapest unit of it); it holds when |score − 50%|
//       ≤ the size's band (4 points at Skirmish, 5 at Field, 6 at Grand). A
//       balanced table fails it about 0.3% of the time, so a failing gate
//       is played again once on fresh seeds (its own stream), and only that
//       second run counts;
//   (b) the per-unit gate: the fit below (2,400 battles at Skirmish, 900
//       at Field, 600 at Grand); each unit's fitted value lies within
//       max(2 SE, 20%) of its price there. A unit whose count never varies
//       over the fit's lists (the hero: a Skirmish list holds exactly one)
//       can't be told from the intercept and is exempt, as §4.2.8.2
//       exempts the heroes at Skirmish; (F9a) and so is a unit the size
//       doesn't offer (the War-Cart at Skirmish, its Vehicle slot [0, 0]:
//       "at every size that offers it"), named so;
//   (c) each race's classic list costs at most the Skirmish's limit (once a
//       run, with (d));
//   (d) each mission's own preset is legal for every race (armyOf, the
//       fold's own refusal), as a seat naming no army plays it and as one
//       naming it; and (F8b) every preset of every race is legal for each
//       mission whose `army` names it, so a race's field and grand presets
//       are held at Field and Grand, its classic one at Skirmish, whichever
//       mission the run is for.
// (F8b's review) And before each mission's gates, a report, never judged:
// what binds each race's Random lists (bindOf: the points, or the units,
// models and slots), since §4.2.8.3 wants the points to and at Grand the
// Bushtails' slots and models do (DESIGN's F8b notes, the deviation).
// (F8b's review, the project owner's decision) At Grand, (a) and (b) are
// played and printed in full but reported, not judged (REPORTED below): no
// price table tried there passed a seed it wasn't tuned on, and the Grand
// rebalance is a ROADMAP item. A run exits 0 whatever Grand scores; (c)
// and (d) are judged at every size.
// It prints the score ± SE, each unit's fitted value ± SE against its cost,
// and each gate's verdict, and ends on every battle gate's verdict again.
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
// the same whichever process plays it. (F8b's review) --seed takes a
// comma-separated few, 1111,2222,3333: every gate and fit then plays its N
// battles under each seed and pools them (N per seed, so the SEs shrink by
// √seeds), because one seed's fit is a sample, and a table tuned until one
// seed's gates pass has been selected on that sample: tune on pooled seeds,
// then judge the table on a seed the tuning never saw. --jobs N plays them over N child
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
      mission: { type: 'string' }, terrain: { type: 'string' }, n: { type: 'string' }, 'fit-n': { type: 'string' },
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
function battleOf({ seed, stream, i, mission, set, pair, budget }) {
  const rng = mulberry32(cyrb53(`${seed}:${stream}:${i}`))
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
    error = `battle ${task.stream} #${task.i}, seed ${task.seed} (${JSON.stringify(setup)}): ${String(e?.stack ?? e)}`
  }
  const ms = performance.now() - t0
  if (error) return { i: task.i, error, ms }
  const win = G.turn.result.win
  // the first race's seat this battle
  const mine = swap ? 1 : 0
  const y = win === -1 ? 0.5 : win === mine ? 1 : 0
  return { i: task.i, seed: task.seed, y, swap, counts: lists.map((l) => l.counts), spent: lists.map((l) => A.listCost(RACES[l.race], l.counts, MISSIONS[task.mission].list)), why: G.turn.result.why, ms }
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
  // ((F8b) every price the mission's: priceOf, its list's own where it sets one)
  const price = (side, key) => A.priceOf(races[side], key, rules)
  const cost = cols.reduce((s, c) => s + (c.key ? classic[c.side][c.k] * price(c.side, c.key) : 0), 0)
  const worth = grad.reduce((s, gj, j) => s + gj * beta[j], 0)
  const rate = worth / cost
  // 2. each unit's value, coefficient / rate, its SE by the delta method:
  // ∂v/∂b = (e_j − v·grad/cost) / rate
  const vecSE = (d) => Math.sqrt(d.reduce((s, dj, j) => s + dj * d.reduce((t, dk, k) => t + cov[j][k] * dk, 0), 0))
  const units = []
  races.forEach((race, side) => race.roster.forEach((key, k) => {
    const j = cols.findIndex((c) => c.side === side && c.k === k)
    const t = race.units[key]
    // ((F9a) a unit this size doesn't offer, its slot's most 0: the
    // War-Cart in a Skirmish, never in a list, so never in the fit)
    if (j < 0) return units.push({ side, k, key, race, cost: price(side, key), value: null, se: null, role: t.role, fitted: false, absent: rules.roles[t.role][1] === 0 })
    const v = beta[j] / rate
    const d = cols.map((_, m) => ((m === j ? 1 : 0) - (v * grad[m]) / cost) / rate)
    units.push({ side, k, key, race, cost: price(side, key), value: v, se: vecSE(d), role: t.role, fitted: true })
  }))
  // 3. the units the fit can't separate (each side's hero at Skirmish):
  // the intercept is their difference, in points over the rate, split about
  // today's mean of their prices
  // ((F8b) the intercept in points is reported whether or not the heroes
  // are fitted: at Field and Grand, where they are, it is the race-level
  // edge no unit's count explains, which the heroes' prices answer, as
  // §4.2.8.2 step 3 has them do)
  const fixed = units.filter((u) => u.value === null)
  let handicap = null
  const diff = beta[0] / rate
  const dEdge = cols.map((_, m) => ((m === 0 ? 1 : 0) - (diff * grad[m]) / cost) / rate)
  const edge = { diff, se: vecSE(dEdge) }
  if (fixed.length === 2 && fixed[0].side !== fixed[1].side) {
    handicap = edge
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
  return { cols: cols.map((c) => c.name), beta, phi, iters, rate, units, handicap, edge, classic: [0, 1].map((side) => ({ today: A.listCost(races[side], classic[side], rules), proposed: classicAt(side) })) }
}

// ── Reports ─────────────────────────────────────────────────────────────────
const pct = (s) => `${s.score.toFixed(1)}% ± ${s.se.toFixed(1)} (N = ${s.n}, ${s.draws} drawn)`
const num = (v, w = 6) => (v === null ? '–' : v.toFixed(0)).padStart(w)
const size = (rules) => rules.size ?? 'battle'
// The score gate's band: 4 points at Skirmish, 5 at Field, 6 at Grand
// (§4.2.8.2's gate table; a size it doesn't name gets Skirmish's)
const BAND = { Skirmish: 4, Field: 5, Grand: 6 }

// (F8b's review) The sizes whose battle gates are reported, not judged: at
// Grand no price table tried passed a seed it wasn't tuned on (its fit is
// weakly identified, whole columns moving 40-100 points between seeds) and
// the Bushtails' lists are held by their slots and models, not their
// points, so its balance is a design call, the Grand rebalance, a ROADMAP
// item (the project owner's decision; DESIGN's F8b notes record it as a
// deviation from §4.2.8.2's gates there). Its score and every unit's fit
// are still played and printed in full, each with what the gate would have
// said; a run's exit and its verdict count only the judged sizes, so
// Skirmish and Field keep both gates as the spec has them.
const REPORTED = { Grand: 'reported, not judged: the Grand rebalance is a ROADMAP item (DESIGN\'s F8b notes)' }

// The races' pairs: every two distinct races, in RACES order (the first's
// score is the one reported)
const pairs = () => {
  const keys = Object.keys(RACES), out = []
  keys.forEach((r, i) => keys.slice(i + 1).forEach((s) => out.push([r, s])))
  return out
}

function printFit(pair, fit, { gate = false, report = false } = {}) {
  console.log(`\n  the fit (${pair.map((r) => RACES[r].short).join(' vs ')}): IRLS in ${fit.iters} steps, dispersion ${fit.phi.toFixed(3)}, exchange rate ${(1000 * fit.rate).toFixed(3)} logits per 1,000 points`)
  if (fit.handicap) console.log(`  the heroes' difference (the intercept): ${fit.handicap.diff.toFixed(1)} ± ${fit.handicap.se.toFixed(1)} points to the ${RACES[pair[0]].short}`)
  else console.log(`  the race-level edge (the intercept; the heroes fitted): ${fit.edge.diff.toFixed(1)} ± ${fit.edge.se.toFixed(1)} points to the ${RACES[pair[0]].short}`)
  console.log(`  ${'unit'.padEnd(34)} ${'role'.padEnd(10)}   cost  fitted ±  SE   proposed${gate ? '   gate' : ''}`)
  let failed = 0
  for (const u of fit.units) {
    const exempt = !u.fitted
    const band = Math.max(2 * (u.se ?? 0), 0.2 * u.cost)
    const ok = exempt || Math.abs(u.value - u.cost) <= band
    if (!ok) failed++
    // (a reported size's rows say where each unit lies against the band,
    // never ok or FAIL)
    const verdict = !gate ? '' : u.absent ? `   exempt (none in this size's lists: its ${u.role} slot is [0, 0])` : exempt ? '   exempt (its count never varies: the intercept)' : report ? `   ${ok ? 'inside' : 'outside'} (band ${band.toFixed(0)})` : `   ${ok ? 'ok  ' : 'FAIL'} (within ${band.toFixed(0)})`
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

// The battles per gate, by size (§4.2.8.2's gate table): the score gate's N
// per pair and set (each band at least 3 SE, SE = 50/√N), and the per-unit
// fit's. A size the table doesn't name gets Skirmish's.
const NS = { Skirmish: { n: 1500, fit: 2400 }, Field: { n: 900, fit: 900 }, Grand: { n: 625, fit: 600 } }

// A battle's stream names its mission (F8b): classic's streams keep F11a's
// names, so a Skirmish run plays the very battles it played, and a larger
// mission's draw seeds of their own rather than classic's again.
const streamOf = (mission, stream) => (mission === 'classic' ? stream : `${mission}:${stream}`)

// (F8b's review) What binds a Random seat's lists (autoList at the
// mission's limit, seeds 1-1,000, as §4.2.8.3's "points must be what
// binds" reads them): a list is held by its points when one unit more would
// pass every rule but the points limit, else by the rest (the units, the
// models, a slot or perKind leave nothing to add). One line, with the
// points spent (p10, median, the least and the most).
function bindOf(race, rules) {
  const free = { ...rules, points: Infinity }
  let points = 0
  const spent = []
  for (let seed = 1; seed <= 1000; seed++) {
    const c = A.autoList(race, rules, seed)
    spent.push(A.listCost(race, c, rules))
    if (race.roster.some((_, k) => A.checkList(race, free, c.map((x, j) => x + (j === k ? 1 : 0))) === null)) points++
  }
  spent.sort((x, y) => x - y)
  return `what binds the ${race.short}' Random lists (1,000 seeds): the points in ${points}, the units, models or slots in ${1000 - points}; spent ${spent[100]} (p10), ${spent[500]} (median), ${spent[0]}-${spent[999]} of ${rules.points}`
}

// (F8b's review) the master seeds, one or a comma-separated few, pooled
const SEEDS = a.seed.split(',').map((s) => s.trim())

// (F7a's merge) The sets a run plays on `mission` (named `name`):
// --terrain's alone, else every set the mission offers (a set it doesn't
// offer is a bad command line).
function setsOf(mission, name) {
  if (a.terrain === undefined) return mission.sets
  if (!mission.sets.includes(a.terrain)) usage(`--terrain takes a set the ${name} mission offers (${mission.sets.join(', ')}), not ${JSON.stringify(a.terrain)}`)
  return [a.terrain]
}

async function main() {
  // (F8b) every mission by default, in MISSIONS order; --mission names one
  // or a comma-separated few
  const names = a.mission === undefined ? Object.keys(MISSIONS) : a.mission.split(',').map((s) => s.trim())
  const unknown = names.filter((m) => !MISSIONS[m])
  if (!names.length || unknown.length) {
    console.error(`army-sim: no mission ${unknown.map((m) => JSON.stringify(m)).join(', ') || '""'} (there are ${Object.keys(MISSIONS).join(', ')})`)
    process.exit(2)
  }
  if (!a.check && !a.fit) {
    console.error('army-sim: --check (the gates), --fit (the fitted price table) or --self-test')
    process.exit(2)
  }
  if (SEEDS.some((x) => !x) || new Set(SEEDS).size !== SEEDS.length) {
    console.error(`army-sim: --seed ${JSON.stringify(a.seed)} names an empty or repeated seed (one seed, or a comma-separated few, each once)`)
    process.exit(2)
  }
  // ((F7a's merge) --terrain checked on every mission run before any battle)
  for (const name of names) setsOf(MISSIONS[name], name)
  const T0 = performance.now()
  console.log(`army-sim: ${a.check ? '--check' : '--fit'} on the ${names.join(', ')} mission${names.length === 1 ? '' : 's'}, ${SEEDS.length === 1 ? `seed ${SEEDS[0]}` : `seeds ${SEEDS.join(', ')} pooled`}, ${a.jobs} job(s), on ${a.dir ? DIR : 'the working tree'}`)

  let failed = 0
  const gate = (ok, what) => {
    if (!ok) failed++
    console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`)
  }
  const verdicts = []

  // (c) and (d), once a run: the price table and the presets, before any
  // battle (they read every mission, whichever the run plays)
  if (a.check) {
    console.log('\nthe lists')
    for (const race of Object.values(RACES)) {
      const counts = race.roster.map((key) => race.army.filter((k) => k === key).length)
      const c = A.listCost(race, counts)
      gate(c <= MISSIONS.classic.list.points, `${race.name}: the classic list (${A.listText(counts)}) costs ${c}, the Skirmish limit ${MISSIONS.classic.list.points}`)
    }
    for (const [m, M] of Object.entries(MISSIONS)) {
      for (const race of Object.keys(RACES)) {
        // (a seat naming none, then one naming the preset)
        for (const army of [undefined, M.army]) {
          let why = null, cost = null
          try {
            cost = A.listCost(RACES[race], A.armyOf({ mission: m, seats: [{ race, ctrl: 'ai', ...(army ? { army } : {}) }] }, 0).counts, M.list)
          } catch (e) {
            why = e.message
          }
          gate(!why, `the ${m} mission's preset, ${JSON.stringify(M.army)}, is legal for the ${RACES[race].name}${army ? ' named' : ' (a seat naming none)'}${why ? `: ${why}` : `: ${cost} of ${M.list.points} points`}`)
        }
      }
    }
    // (F8b) every preset of every race, at the missions whose army names it
    for (const r of Object.values(RACES)) {
      for (const name of Object.keys(r.armies)) {
        const at = Object.entries(MISSIONS).filter(([, M]) => M.army === name).map(([m]) => m)
        gate(at.length > 0, `the ${r.name}' preset ${name} is some mission's army${at.length ? ` (${at.join(', ')})` : ': no mission plays it'}`)
        for (const m of at) {
          const why = A.checkList(r, MISSIONS[m].list, [...r.armies[name]].map(Number))
          gate(why === null, `the ${r.name}' preset ${name} ('${r.armies[name]}') passes the ${m} mission's list rules${why ? `: ${why}` : ''}`)
        }
      }
    }
  }

  for (const name of names) {
    const mission = MISSIONS[name], rules = mission.list, sets = setsOf(mission, name)
    const ns = NS[size(rules)] ?? NS.Skirmish
    const N = Number(a.n) || ns.n
    const fitN = Number(a.fit ? a.n : a['fit-n']) || ns.fit
    // (each seed's n battles, the seeds in the order given)
    const tasksOf = (stream, n, pair, budget, set) => SEEDS.flatMap((seed) => Array.from({ length: n }, (_, i) => ({ seed, stream: streamOf(name, stream), i, mission: name, set: set ?? sets[Math.floor(i / 2) % sets.length], pair, budget })))
    console.log(`\n━━ the ${name} mission: a ${size(rules)}, ${mission.board.W}×${mission.board.H}, ${rules.points} points, on ${sets.join(', ')}${a.terrain ? ' (--terrain)' : ''} ━━`)
    // ((F8b's review) what binds a Random seat's list, reported, never
    // judged: §4.2.8.3 wants the points to, and at Grand the Bushtails'
    // slots and models do)
    if (a.check) for (const r of Object.values(RACES)) console.log(`  ${bindOf(r, rules)}`)

    if (a.fit) {
      for (const pair of pairs()) {
        const r = await playAll(tasksOf(`fit:${pair}`, fitN, pair, 'fit'), `${name} fit ${pair.join('-')}`)
        if (failErrors(r)) process.exit(1)
        console.log(`\n${pair.map((r) => RACES[r].short).join(' vs ')}, budgets 80-120% of the limit (played at most at it): ${pct(scoreOf(r.results))}; ${runtime(r)}`)
        printFit(pair, fitOf(pair, r.results, rules))
      }
      continue
    }

    // (a) the score gates, per pair and set; a failure played again once
    // (a reported size's is played once: there is no verdict for a re-run
    // to absorb a fluke of)
    const band = BAND[size(rules)] ?? BAND.Skirmish
    const report = REPORTED[size(rules)]
    if (report) console.log(`\n  the ${size(rules)} gates below are ${report}`)
    for (const pair of pairs()) {
      for (const set of sets) {
        const what = `${pair.map((r) => RACES[r].short).join(' vs ')} on ${set}`
        console.log(`\nthe score gate (${name}): ${what}, random legal lists at the limit, |score − 50%| ≤ ${band}${report ? ` (${report})` : ''}`)
        let r = await playAll(tasksOf(`score:${pair}:${set}`, N, pair, 'limit', set), `${name} score ${what}`)
        if (failErrors(r)) process.exit(1)
        let s = scoreOf(r.results)
        console.log(`  ${RACES[pair[0]].short} score ${pct(s)}; ${runtime(r)}`)
        if (!report && Math.abs(s.score - 50) > band) {
          console.log(`  outside the band: played again once on fresh seeds, and that run counts`)
          r = await playAll(tasksOf(`score-again:${pair}:${set}`, N, pair, 'limit', set), `${name} score again ${what}`)
          if (failErrors(r)) process.exit(1)
          s = scoreOf(r.results)
          console.log(`  ${RACES[pair[0]].short} score ${pct(s)}; ${runtime(r)}`)
        }
        const ok = Math.abs(s.score - 50) <= band
        if (report) {
          console.log(`  the score, ${name}, ${what}: ${s.score.toFixed(1)}% ± ${s.se.toFixed(1)} is ${Math.abs(s.score - 50).toFixed(1)} points from even, ${ok ? 'inside' : 'outside'} the band of ${band}: ${report}`)
          verdicts.push(`info ${name} score ${what}: ${s.score.toFixed(1)}% ± ${s.se.toFixed(1)} (N = ${s.n}, ${ok ? 'inside' : 'outside'} the band of ${band}), ${report}`)
          continue
        }
        gate(ok, `the score gate, ${name}, ${what}: ${s.score.toFixed(1)}% is ${Math.abs(s.score - 50).toFixed(1)} points from even`)
        verdicts.push(`${ok ? 'ok  ' : 'FAIL'} ${name} score ${what}: ${s.score.toFixed(1)}% ± ${s.se.toFixed(1)} (N = ${s.n}, band ${band})`)
      }
    }

    // (b) the per-unit gate, from the fit
    for (const pair of pairs()) {
      const what = pair.map((r) => RACES[r].short).join(' vs ')
      console.log(`\nthe per-unit gate (${name}): ${what}, the fit on budgets 80-120% of the limit (played at most at it); each unit within max(2 SE, 20%) of its cost${report ? ` (${report})` : ''}`)
      const r = await playAll(tasksOf(`fit:${pair}`, fitN, pair, 'fit'), `${name} fit ${what}`)
      if (failErrors(r)) process.exit(1)
      console.log(`  ${RACES[pair[0]].short} score over the fit's battles ${pct(scoreOf(r.results))}; ${runtime(r)}`)
      const bad = printFit(pair, fitOf(pair, r.results, rules), { gate: true, report: !!report })
      if (report) {
        console.log(`  the per-unit fit, ${name}, ${what}: ${bad ? `${bad} unit(s) outside their band` : 'every unit inside its band'}: ${report}`)
        verdicts.push(`info ${name} per-unit ${what}: ${bad ? `${bad} unit(s) outside their band` : 'every unit inside its band'} (fit N = ${fitN * SEEDS.length}), ${report}`)
        continue
      }
      gate(!bad, `the per-unit gate, ${name}, ${what}: ${bad ? `${bad} unit(s) priced outside their band` : 'every unit within its band'}`)
      verdicts.push(`${bad ? 'FAIL' : 'ok  '} ${name} per-unit ${what}: ${bad ? `${bad} unit(s) outside their band` : 'every unit within its band'} (fit N = ${fitN * SEEDS.length})`)
    }
  }

  const secs = (performance.now() - T0) / 1000
  if (a.fit) {
    console.log(`\narmy-sim --fit: ${secs.toFixed(0)} s`)
    return
  }
  // (every battle gate again, together, so a run over three sizes ends on
  // what it found)
  console.log(`\nthe battle gates\n${verdicts.map((v) => `  ${v}`).join('\n')}`)
  console.log(failed ? `\narmy-sim --check FAILED: ${failed} gate(s) (${secs.toFixed(0)} s)` : `\narmy-sim --check passed: every gate holds${verdicts.some((v) => v.startsWith('info')) ? ' (the reported rows judged by none)' : ''} (${secs.toFixed(0)} s)`)
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
  // (the header's one set: --terrain's, else the mission's first; the
  // Skirmish's unless --mission names one)
  const mname = a.mission ?? 'classic', mission = MISSIONS[mname]
  if (!mission) usage(`no mission ${JSON.stringify(mname)} (there are ${Object.keys(MISSIONS).join(', ')})`)
  const set = setsOf(mission, mname)[0]
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
      const args = [SELF, '--check', '--dir', dir, '--n', String(t.n), '--fit-n', String(t.fitN), '--jobs', a.jobs, '--seed', a.seed, '--mission', a.mission ?? 'classic', '--terrain', set]
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
