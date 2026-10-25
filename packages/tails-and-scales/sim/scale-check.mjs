// The scale hygiene's checks (DESIGN §4.2.2, §4.2.9; S0-S3): the core's
// faster scans hold to the scans as they were (sim/oracle/scan-ref.mjs), on
// the classic board and on Grand (the Grand fixture, sim/fixtures/grand.mjs).
//
//   P-scan  On states sampled from AI battles (the corpus's boards, and
//           Grand ones), for a unit at random: bestSpot (S0's bounded
//           lattice, S1's hoisted facts) returns what the whole board's
//           lattice did, with the facts asked afresh at every cell, and
//           leaves the dice where it did; the fall back's scan
//           (fallbackSpot) and freeSpot return the cell the whole board's
//           scan found.
//   P-los   On terrain from board seeds 1-500 (Grand: 1-100) after random
//           blasts, the broadphase line of sight (S0b's bins) returns what
//           the scan over every chunk did, { blocked, obscure }, over
//           random segments, some with an end off the table.
//   P-memo  (S3) Every plan an AI battle's fold reads back from its memo
//           (the AI's plan asked for again by the move's legality check and
//           its handler) is a fresh plan's equal (its reach's dist and prev,
//           both masks and their discs, whether it falls back); so is one a
//           probe asks for inside an apply, and asking again returns it;
//           every human corpus log folded with previews
//           (plans for random units, through the core's preview) between
//           its entries traces, shadows, writes and hashes as it does
//           without them; an apply that throws leaves G.nav.memo null, as
//           every command boundary does.
//
//   node sim/scale-check.mjs [--dir <code>] [--quick] [--self-test]
//
// --dir checks another copy of the code (its own Grand fixture is not
// built: classic only); --quick samples less. --self-test builds broken
// copies of the code, each a scan that would change a battle (a lattice box
// too tight, a lattice row's offset swapped, the fall back's odd cells, a
// zone's columns cut short, two facts hoisted wrong, chunks binned short or
// met out of order, a memo key that forgets the other units, a memo left
// open by a throw) and expects the checks to fail each. (A key without the
// nav grid's epoch is no fault a fold can show: nothing rebuilds the grid
// between the AI's plan and its read-backs; the epoch stays in the key all
// the same.) Exit 0 when
// everything holds.
import { parseArgs } from 'node:util'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadCorpus } from './lib.mjs'
import { foldJob, jobSetup } from './run.mjs'
import { buildGrand, grandSetup } from './fixtures/grand.mjs'
import * as ref from './oracle/scan-ref.mjs'

const PKG = fileURLToPath(new URL('..', import.meta.url))
const { values: a } = parseArgs({ options: { dir: { type: 'string' }, quick: { type: 'boolean' }, 'self-test': { type: 'boolean' } } })

// the code under test: its core's entry and the modules the scans live in
async function coreOf(dir) {
  const at = (f) => import(pathToFileURL(join(dir, f)).href)
  const [index, score, move, deploy, queries, rng, dmath, terrain, geom, mission] = await Promise.all([
    at('core/index.js'), at('core/ai/score.js'), at('core/actions/move.js'), at('core/deploy.js'), at('core/queries.js'),
    at('core/rng.js'), at('core/dmath.js'), at('core/terrain/terrain.js'), at('core/terrain/geom.js'), at('data/mission.js'),
  ])
  const M = { ...queries, ...move, ...deploy, ...score, draw: rng.draw, hypot: dmath.hypot, segmentHitsBox: geom.segmentHitsBox }
  return { core: index, M, Terrain: terrain.Terrain, mission: mission.MISSIONS.classic, rules: await at('core/rules.js') }
}

// a small seeded stream of the check's own (never the match's)
function stream(seed) {
  let s = seed >>> 0 || 1
  const next = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 4294967296
  }
  return { next, int: (n) => Math.floor(next() * n), pick: (xs) => xs[Math.floor(next() * xs.length)] }
}

const json = (v) => JSON.stringify(v)
const sameArray = (x, y) => x.length === y.length && x.every((v, i) => Object.is(v, y[i]))

// ── P-scan and P-memo's first part: states inside AI battles ───────────────
// Plays AI battles (createMatch, which plays them through) and calls each
// probe at every `every`-th trace line of the battle proper, where the nav
// grid is clean and the dice unlocked; a probe returns what it found wrong.
function sample(C, setups, every, probes, rand) {
  const out = { states: 0, bad: [], hits: 0, memoProbes: 0 }
  for (const [name, setup] of setups) {
    let n = 0
    const onTrace = (line, G) => {
      if (G.turn.stage !== 'battle' || G.terrain.dirty || G.rng.locked || ++n % every) return
      out.states++
      for (const p of probes) {
        const why = p(C, G, rand, out)
        if (why && out.bad.length < 12) out.bad.push(`${name}, at "${line.slice(0, 40)}": ${why}`)
      }
    }
    C.core.createMatch(setup, { onTrace })
  }
  return out
}

const randomUnit = (C, G, rand) => rand.pick(G.units.filter((u) => C.M.alive(u)))

// P-scan at one state: the core's scans against the whole board's, from the
// same dice; the match's memo set aside (each scan makes its plan afresh)
function scanProbe(C, G, rand) {
  const { M } = C
  const memo = G.nav.memo
  G.nav.memo = null
  try {
    const u = randomUnit(C, G, rand)
    const extra = rand.pick([0, 0, 2, 5])
    const plan = M.movePlan(G, u, extra)
    const claimed = new Set(G.objectives.filter(() => rand.next() < 0.3).map((o) => o.i))
    const dice = { ...G.rng }
    const got = M.bestSpot(G, u, plan, claimed), gotDice = { ...G.rng }
    Object.assign(G.rng, dice)
    const want = ref.fullBestSpot(M, C.rules, G, u, plan, claimed), wantDice = { ...G.rng }
    Object.assign(G.rng, dice)
    if (json(got) !== json(want)) return `bestSpot for ${u.t.short} (+${extra}): ${json(got)}, the whole board's ${json(want)}`
    if (json(gotDice) !== json(wantDice)) return `bestSpot for ${u.t.short} (+${extra}) left the dice at ${json(gotDice)}, the whole board's at ${json(wantDice)}`
    const fb = M.fallbackSpot(G, u, plan), fbWant = ref.fullFallback(M, G, u, plan)
    if (fb !== fbWant) return `fallbackSpot for ${u.t.short}: cell ${fb}, the whole board's ${fbWant}`
    const { W, H } = G.nav
    const x = (rand.next() - 0.5) * W, z = (rand.next() - 0.5) * H
    const others = G.units.filter((o) => o !== u && M.alive(o))
    const fs = M.freeSpot(G, u, x, z, u.side, others), fsWant = ref.fullFreeSpot(M, G, u, x, z, u.side, others)
    if (json(fs) !== json(fsWant)) return `freeSpot for ${u.t.short} near (${x.toFixed(2)}, ${z.toFixed(2)}): ${json(fs)}, the whole board's ${json(fsWant)}`
    return null
  } finally {
    G.nav.memo = memo
  }
}

// P-memo inside an apply: a plan read back from the memo is a fresh one's
// equal, and asked again it is the same plan
function planDiff(p, q) {
  if (p.max !== q.max || p.mode !== q.mode || p.fallback !== q.fallback) return `max/mode/fallback ${p.max}/${p.mode}/${p.fallback}, fresh ${q.max}/${q.mode}/${q.fallback}`
  if (p.res.start !== q.res.start || !Object.is(p.res.sx, q.res.sx) || !Object.is(p.res.sz, q.res.sz)) return 'its start'
  if (!sameArray(p.res.dist, q.res.dist)) return 'its reach (dist)'
  if (!sameArray(p.res.prev, q.res.prev)) return 'its routes (prev)'
  for (const k of ['forbid', 'endForbid']) {
    if (!sameArray(p[k], q[k])) return `its ${k} mask`
    if (json(p[k].discs) !== json(q[k].discs)) return `its ${k} discs`
  }
  return null
}
function memoProbe(C, G, rand, out) {
  const memo = G.nav.memo
  if (!memo) return 'no plan memo open inside the fold (S3: apply opens G.nav.memo)'
  out.memoProbes++
  // half the time the plan the fold itself made last in this apply (the
  // AI's, a legality check's), asked for as it was; else any unit's
  const from = memo.plan && rand.next() < 0.5 ? memo.plan : null
  const u = from && C.M.alive(from.u) ? from.u : randomUnit(C, G, rand)
  const extra = from && from.u === u ? from.max - u.t.M : rand.pick([0, 0, 2, 5])
  const before = memo.plan
  const p1 = C.M.movePlan(G, u, extra)
  if (p1 === before) out.hits++
  G.nav.memo = null
  let p2
  try {
    p2 = C.M.movePlan(G, u, extra)
  } finally {
    G.nav.memo = memo
  }
  const why = planDiff(p1, p2)
  if (why) return `${u.t.short}'s plan (+${extra}) from the memo differs from a fresh one: ${why}`
  if (C.M.movePlan(G, u, extra) !== p1) return `${u.t.short}'s plan (+${extra}) asked again inside the apply is made afresh, not read back`
  return null
}

// ── P-memo: every plan the fold reads back from its memo ────────────────────
// An AI battle is one apply (createMatch plays it), so its memo, opened as
// it starts, is watched from the battle's first trace line on: each time
// movePlan reads the plan back (a hit: the AI's plan asked for again by the
// move's legality check and its handler), that plan is held to a fresh
// one, made with the memo set aside.
function foldHits(C, setups) {
  const out = { hits: 0, bad: [] }
  for (const [name, setup] of setups) {
    let watched = null
    const onTrace = (line, G) => {
      const m = G.nav.memo
      if (!m || m === watched) return
      watched = m
      let stored = m.plan, checking = false
      Object.defineProperty(m, 'plan', {
        configurable: true,
        set(v) {
          stored = v
        },
        get() {
          if (checking || !stored) return stored
          checking = true
          G.nav.memo = null
          try {
            const fresh = C.M.movePlan(G, stored.u, stored.max - stored.u.t.M)
            const why = planDiff(stored, fresh)
            out.hits++
            if (why && out.bad.length < 8) out.bad.push(`${name}: ${stored.u.t.short}'s plan read back from the memo differs from a fresh one: ${why}`)
          } finally {
            G.nav.memo = m
            checking = false
          }
          return stored
        },
      })
    }
    C.core.createMatch(setup, { onTrace })
  }
  return out
}

// ── P-memo: previews between a log's entries change nothing ─────────────────
function previewFolds(C, items, rand) {
  const bad = []
  let n = 0
  for (const it of items) {
    const hashes = [[], []]
    const runs = [false, true].map((previews, w) => foldJob(C.core, it.job, {
      before: (G) => {
        hashes[w].push(C.core.stateHash(G))
        if (G.nav.memo !== null) bad.push(`${it.id}: G.nav.memo is not null between entries`)
        if (!previews) return
        C.core.preview(G, (G2, q) => {
          for (let k = 0; k < 3; k++) q.movePlan(G2, rand.pick(G2.units.filter((u) => q.alive(u))), rand.pick([0, 3]))
        })
      },
    }))
    n++
    const [x, y] = runs
    for (const k of ['error', 'trace', 'shadow', 'written']) if (json(x[k]) !== json(y[k])) bad.push(`${it.id}: folded with previews between its entries, its ${k} differs`)
    if (json(hashes[0]) !== json(hashes[1])) bad.push(`${it.id}: folded with previews between its entries, its stateHash differs`)
  }
  return { n, bad }
}

// ── P-memo: an apply that throws shuts the memo ─────────────────────────────
function throwingApply(C) {
  const G = C.core.createMatch({ board: 64, dice: 89, seats: [{ race: 'squirrel', ctrl: 'human' }, { race: 'serpent', ctrl: 'human' }] })
  let threw = false
  try {
    C.core.apply(G, 0, { t: 'move', u: 99999, c: 0 })
  } catch {
    threw = true
  }
  if (!threw) return ['a move of a unit that is not there was applied without throwing: the check needs an apply that throws']
  return G.nav.memo === null ? [] : ['an apply that threw left G.nav.memo open']
}

// ── P-los ───────────────────────────────────────────────────────────────────
function pLos(C, seeds, perBoard, rand) {
  // (F8a) the board the mission chooses
  const { W, H } = C.mission.board
  const bad = []
  let n = 0
  for (const seed of seeds) {
    const T = new C.Terrain(W, H)
    T.generate(seed, C.mission.objectives, C.mission.deploy, 'classic')
    for (let k = rand.int(6); k > 0; k--) T.blast((rand.next() - 0.5) * W, (rand.next() - 0.5) * H, 1 + rand.next() * 2.5, 1 + rand.int(4))
    for (let k = 0; k < perBoard; k++) {
      // a tenth of the ends off the table, by up to 4"
      const end = () => {
        const off = rand.next() < 0.1
        return { x: (rand.next() - 0.5) * (W + (off ? 8 : 0)), y: 0.4 + rand.next() * 2.2, z: (rand.next() - 0.5) * (H + (off ? 8 : 0)) }
      }
      const p = end(), q = rand.next() < 0.3 ? { x: p.x + (rand.next() - 0.5) * 12, y: 0.4 + rand.next() * 2.2, z: p.z + (rand.next() - 0.5) * 12 } : end()
      const got = T.los(p, q), want = ref.fullLos(C.M, T, p, q)
      n++
      if (json(got) !== json(want) && bad.length < 8) bad.push(`board ${seed}, ${json(p)} to ${json(q)}: ${json(got)}, every chunk's ${json(want)}`)
    }
  }
  return { n, bad }
}

// ── A run over one copy of the code ─────────────────────────────────────────
async function run(dir, { quick = false, grand = true, only = null, say = console.log } = {}) {
  const C = await coreOf(dir)
  const rand = stream(20261023)
  let failed = 0
  const report = (ok, what, bad = []) => {
    if (!ok) failed++
    say(`  ${ok ? 'ok  ' : 'FAIL'} ${what}${bad.length ? `\n         ${bad.slice(0, 4).join('\n         ')}` : ''}`)
  }
  const { items } = loadCorpus()
  const ai = items.filter((it) => it.kind === 'ai').slice(0, quick ? 4 : 12)
  const classic = ai.map((it) => [`classic ${it.id}`, jobSetup(it.job)])
  const want = (k) => !only || only.includes(k)
  let G_ = null
  if (grand) {
    const { dir: gdir, lists } = await buildGrand({ caps: false })
    G_ = await coreOf(gdir)
    // (a fixture whose battles field fewer units than its lists is checking
    // classic armies: refused)
    const n = G_.core.createMatch(grandSetup(1, 7)).units.length, want = Object.values(lists).reduce((k, l) => k + l.units, 0)
    if (n !== want) throw new Error(`the Grand fixture's battles field ${n} units, its lists ${want}: the fixture didn't take (sim/fixtures/grand.mjs)`)
  }
  const grandSetups = [[1, 7], [2, 11], [3, 5], [4, 9]].slice(0, quick ? 1 : 4).map(([b, d]) => [`Grand ${b}-${d}`, grandSetup(b, d)])

  if (want('scan')) {
    const s1 = sample(C, classic, quick ? 9 : 4, [scanProbe], rand)
    report(!s1.bad.length && s1.states >= (quick ? 50 : 500), `P-scan, classic: ${s1.states} states, bestSpot, fallbackSpot and freeSpot as the whole board's scans`, s1.bad)
    if (G_) {
      const s2 = sample(G_, grandSetups, quick ? 30 : 7, [scanProbe], rand)
      report(!s2.bad.length && s2.states >= (quick ? 20 : 400), `P-scan, Grand: ${s2.states} states, the same`, s2.bad)
    }
  }
  if (want('los')) {
    const l1 = pLos(C, Array.from({ length: quick ? 60 : 500 }, (_, i) => i + 1), 40, rand)
    report(!l1.bad.length, `P-los, classic: ${l1.n} segments on boards 1-${quick ? 60 : 500} after random blasts, as every chunk's scan`, l1.bad)
    if (G_) {
      const l2 = pLos(G_, Array.from({ length: quick ? 10 : 100 }, (_, i) => i + 1), 60, rand)
      report(!l2.bad.length, `P-los, Grand: ${l2.n} segments on boards 1-${quick ? 10 : 100}, the same`, l2.bad)
    }
  }
  if (want('memo')) {
    const m1 = sample(C, classic, quick ? 7 : 3, [memoProbe], rand)
    report(!m1.bad.length && m1.hits > 0, `P-memo, classic: ${m1.memoProbes} plans inside applies, ${m1.hits} read back from the memo, each a fresh plan's equal`, m1.bad)
    if (G_) {
      const m2 = sample(G_, grandSetups.slice(0, quick ? 1 : 2), quick ? 30 : 10, [memoProbe], rand)
      report(!m2.bad.length && m2.hits > 0, `P-memo, Grand: ${m2.memoProbes} plans, ${m2.hits} read back, the same`, m2.bad)
    }
    const f1 = foldHits(C, classic)
    report(!f1.bad.length && f1.hits > 0, `P-memo, the fold's own: ${f1.hits} plans an AI battle read back from its memo, each a fresh plan's equal`, f1.bad)
    if (G_) {
      const f2 = foldHits(G_, grandSetups.slice(0, quick ? 1 : 2))
      report(!f2.bad.length && f2.hits > 0, `P-memo, the fold's own, Grand: ${f2.hits} plans read back, the same`, f2.bad)
    }
    const humans = items.filter((it) => it.kind === 'human').slice(0, quick ? 3 : Infinity)
    const pf = previewFolds(C, humans, rand)
    report(!pf.bad.length, `P-memo, previews: ${pf.n} human logs folded with previews between their entries, as without (trace, shadow, writes, stateHash; no memo between entries)`, pf.bad)
    const th = throwingApply(C)
    report(!th.length, 'P-memo, a throw: an apply that throws leaves no memo', th)
  }
  return failed
}

// ── --self-test: broken copies, each caught ─────────────────────────────────
const MUTANTS = [
  ['box-tight', 'scan', 'core/ai/score.js', 'const span = reach + nav.cell', 'const span = reach * 0.6'],
  ['lattice-offset', 'scan', 'core/ai/score.js', 'const off = (iz / step) % 2 ? 1 : 0', 'const off = (iz / step) % 2 ? 0 : 1'],
  ['fallback-odd', 'scan', 'core/ai/score.js', 'i = row + box.x0 + ((row + box.x0) % 2)', 'i = row + box.x0 + 1 - ((row + box.x0) % 2)'],
  ['zone-columns', 'scan', 'core/deploy.js', 'Math.floor((box.minX + nav.W / 2) / nav.cell) - 1', 'Math.floor((box.minX + nav.W / 2) / nav.cell) + 4'],
  ['hoist-cover', 'scan', 'core/ai/score.js', 'cover: inCover(G, e)', 'cover: false'],
  ['hoist-back', 'scan', 'core/ai/score.js', 'const back = pre.get(e).back * 0.4', 'const back = pre.get(e).hit * 0.4'],
  ['bins-short', 'los', 'core/terrain/terrain.js', 'this.binSpan(s.x - s.reach - PAD, s.x + s.reach + PAD, this.W, this.nbx)', 'this.binSpan(s.x - s.reach * 0.3, s.x + s.reach * 0.3, this.W, this.nbx)'],
  ['bins-order', 'los', 'core/terrain/terrain.js', 'while (j >= 0 && met[j] > v)', 'while (j >= 0 && met[j] < v)'],
  ['memo-key', 'memo', 'core/actions/move.js', '  for (const o of G.units) if (alive(o)) k += `|${o.id}@${num(o.pos.x)},${num(o.pos.z)} r${num(o.r)}`\n', ''],
  ['memo-leak', 'memo', 'core/index.js', '  try {\n    return fn()\n  } finally {\n    G.nav.memo = null\n  }', '  const r = fn()\n  G.nav.memo = null\n  return r'],
]

async function selfTest() {
  console.log('scale-check self-test: the clean code passes, and each broken copy fails\n')
  let bad = 0
  const clean = await run(PKG, { quick: true, grand: false, say: () => {} })
  console.log(`  ${clean ? 'FAIL' : 'ok  '} the working tree passes (quick, classic)`)
  if (clean) bad++
  for (const [name, check, file, from, to] of MUTANTS) {
    const dir = mkdtempSync(join(tmpdir(), `scale-check-${name}-`))
    try {
      for (const d of ['core', 'data', 'match']) cpSync(join(PKG, d), join(dir, d), { recursive: true })
      writeFileSync(join(dir, 'package.json'), JSON.stringify({ type: 'module', private: true }))
      const p = join(dir, file), text = readFileSync(p, 'utf8')
      if (text.split(from).length !== 2) {
        console.log(`  FAIL ${name}: its anchor is not in ${file} exactly once (stale mutant)`)
        bad++
        continue
      }
      writeFileSync(p, text.replace(from, () => to))
      const lines = []
      const failed = await run(dir, { quick: true, grand: false, only: [check], say: (l) => lines.push(l) })
      const caught = lines.filter((l) => l.includes('FAIL')).map((l) => l.trim().split('\n')[0].slice(5, 90))
      console.log(`  ${failed ? 'ok  ' : 'FAIL'} ${name.padEnd(15)} ${failed ? `caught: ${caught[0]}` : `not caught by ${check}`}`)
      if (!failed) bad++
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  }
  console.log(bad ? `\nscale-check self-test FAILED: ${bad} problem(s)` : `\nscale-check self-test passed: ${MUTANTS.length} broken copies, each caught`)
  return bad
}

if (a['self-test']) process.exit((await selfTest()) ? 1 : 0)
const dir = a.dir ?? PKG
console.log(`scale-check: S0-S3's scans against the whole board's, on ${a.dir ? dir : 'the working tree'}${a.dir ? '' : ' and the Grand fixture'}${a.quick ? ' (quick)' : ''}\n`)
const t0 = performance.now()
const failed = await run(dir, { quick: a.quick, grand: !a.dir })
console.log(failed ? `\nscale-check FAILED: ${failed} problem(s)` : `\nscale-check passed: the bounded scans, the line-of-sight bins and the plan memo change nothing (${((performance.now() - t0) / 1000).toFixed(0)} s)`)
process.exit(failed ? 1 : 0)
