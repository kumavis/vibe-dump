// The battlefield dressing's check (DESIGN's "Battlefield dressing": its
// rules 1 and 2). view/dressing/place.js places everything the dressing
// stands on the table, from the board's own seed; this holds it to the
// rules the dressing promises, against the core's own table: the chunks,
// nav grid, objectives and zones of the match as createMatch makes it.
//
// Node (the default): for every terrain set, boards 1..N (--seeds, 1,000 by
// default), each set's missions in turn:
//   - seeded: the plan is made with Math.random replaced by a function that
//     throws (a draw from it is no seed's), twice, from two matches made
//     apart, and the two plans must be the same, value for value;
//   - placed: every item the plan stands on the ground (place.js standing)
//     is off the mat, or inside a rules piece's footprint (its shape's box),
//     or low clutter (at most 0.3" tall) on the mat with all of: outside
//     both deployment zones, outside every objective's range, 1" or more
//     from every rules piece's footprint, and its centre and the four
//     points at its radius on walkable nav cells (not hard, not soft, on
//     the ground). The rules are worked out here afresh (Math's own trig,
//     a hair of slack for place.js's dmath), not asked of place.js.
// --self-test plants, on a board that passes, a violation of each class
// (low clutter in a zone, in an objective's range, by a piece, on a cell the
// nav refuses; something tall on the open mat, and half on it) and two
// unseeded placers (a copy of place.js drawing Math.random, and one keeping
// a count between calls), and each must be caught.
//
// --browser (Chromium; set CHROMIUM_PATH): a watched battle per board in
// two fresh pages of a fresh build, one dressed and one with ?dress=0, both
// under ?fast, and each must end with the same state hash, the same trace
// line for line and the same dice state: the dressing reaches nothing of
// the match. Each page must also show what it should: dressing in the
// dressed one, none in the other.
//
//   node sim/dressing-check.mjs [--seeds 1000] [--sets classic,open] [--self-test]
//   node sim/dressing-check.mjs --browser [--boards classic:classic:1,classic:fortified:4,grand:open:7]
//
// Exit 0 when everything holds, 1 when anything fails, 2 on bad arguments.
import { parseArgs } from 'node:util'
import { mkdtempSync, mkdirSync, cpSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { createHash } from 'node:crypto'
import { pathToFileURL } from 'node:url'
import { createMatch } from '../core/index.js'
import { OBJECTIVE_RANGE } from '../core/rules.js'
import { MISSIONS } from '../data/mission.js'
import { PKG } from './oracle/pin.mjs'

let a
try {
  ({ values: a } = parseArgs({ options: { seeds: { type: 'string' }, sets: { type: 'string' }, 'self-test': { type: 'boolean' }, browser: { type: 'boolean' }, boards: { type: 'string' } } }))
} catch (e) {
  console.error(`dressing-check: ${e.message}`)
  process.exit(2)
}
const SEEDS = Number(a.seeds ?? 1000)
if (!(SEEDS >= 1)) {
  console.error(`dressing-check: --seeds ${a.seeds}: give a whole number`)
  process.exit(2)
}
const SEATS = [{ race: 'squirrel', ctrl: 'human' }, { race: 'serpent', ctrl: 'human' }]
// each set, and the missions fought on it
const SETS = new Map()
for (const [m, M] of Object.entries(MISSIONS)) for (const s of M.sets) SETS.set(s, [...(SETS.get(s) ?? []), m])
const LOW = 0.3, CLEAR = 1, EPS = 1e-6

const place = (dir = PKG) => import(pathToFileURL(join(dir, 'view/dressing/place.js')).href)
const matchOf = (board, mission, terrain) => createMatch({ board, dice: 0, mission, terrain, seats: SEATS }, { out: null })
const ctxOf = (P, G) => ({
  seed: P.dressSeed(G.setup), set: G.setup.terrain, W: G.board.W, H: G.board.H, deploy: G.board.deploy,
  edges: G.seats.map((s) => s.edge), objectives: G.objectives, range: OBJECTIVE_RANGE, chunks: G.terrain.chunks, nav: G.nav,
})
const digest = (p) => createHash('sha256').update(JSON.stringify(p)).digest('hex')

// the plan with Math.random refused
function seeded(P, ctx) {
  const random = Math.random
  Math.random = () => {
    throw new Error('Math.random drawn')
  }
  try {
    return P.plan(ctx)
  } finally {
    Math.random = random
  }
}

// The placement rules, worked out here: every problem with the items `items`
// on table G ([text])
function placementProblems(G, items) {
  const { W, H, deploy } = G.board, nav = G.nav
  const boxes = G.terrain.chunks.map((c) => {
    const s = c.shape, n = c.nav
    const b = n && n.hx * n.hz > s.hx * s.hz ? n : s
    return { x: b.x, z: b.z, hx: b.hx, hz: b.hz, c: Math.cos(b.yaw ?? 0), s: Math.sin(b.yaw ?? 0), id: c.id, kind: c.kind }
  })
  const loc = (b, x, z) => [(x - b.x) * b.c - (z - b.z) * b.s, (x - b.x) * b.s + (z - b.z) * b.c]
  const inside = (b, x, z, r) => {
    const [lx, lz] = loc(b, x, z)
    return Math.abs(lx) <= b.hx - r + EPS && Math.abs(lz) <= b.hz - r + EPS
  }
  const dist = (b, x, z) => {
    const [lx, lz] = loc(b, x, z)
    return Math.hypot(Math.max(0, Math.abs(lx) - b.hx), Math.max(0, Math.abs(lz) - b.hz))
  }
  const walk = (x, z) => {
    const i = nav.index(x, z)
    return i >= 0 && !nav.hard[i] && !nav.soft[i] && !(nav.hasHeight && nav.floor[i] > 0.01)
  }
  const out = []
  for (const it of items) {
    const { x, z, r, h } = it
    const name = `${it.list} at ${x.toFixed(2)},${z.toFixed(2)} (r ${r.toFixed(2)}, ${h.toFixed(2)} tall)`
    if (![x, z, r, h].every(Number.isFinite)) {
      out.push(`${name}: not a place`)
      continue
    }
    if (Math.abs(x) >= W / 2 + r - EPS || Math.abs(z) >= H / 2 + r - EPS) continue
    if (boxes.some((b) => inside(b, x, z, r))) continue
    if (h > LOW + EPS) {
      out.push(`${name}: taller than ${LOW}" on the mat, outside every rules piece's footprint`)
      continue
    }
    if (Math.abs(x) > W / 2 - deploy - r + EPS) out.push(`${name}: low clutter in a deployment zone`)
    else if (Math.abs(z) > H / 2 - r + EPS) out.push(`${name}: low clutter across the mat's edge`)
    else if (G.objectives.some((o) => Math.hypot(x - o.x, z - o.z) < OBJECTIVE_RANGE + r - EPS)) out.push(`${name}: low clutter in an objective's range`)
    else {
      const b = boxes.find((b) => dist(b, x, z) < CLEAR + r - EPS)
      if (b) out.push(`${name}: low clutter ${dist(b, x, z).toFixed(2)}" from ${b.kind} #${b.id}, under ${CLEAR}" + its radius`)
      else if (![[0, 0], [r, 0], [-r, 0], [0, r], [0, -r]].every(([dx, dz]) => walk(x + dx, z + dz))) out.push(`${name}: low clutter on a nav cell nobody may walk`)
    }
  }
  return out
}

// one board: its two plans, the same, and their items where they may stand
function board(P, set, seed) {
  const missions = SETS.get(set), mission = missions[seed % missions.length]
  const G = matchOf(seed, mission, set)
  let p1, p2
  try {
    p1 = seeded(P, ctxOf(P, G))
    p2 = seeded(P, ctxOf(P, matchOf(seed, mission, set)))
  } catch (e) {
    return { G, problems: [`${set} board ${seed} (${mission}): ${e.message}`] }
  }
  const problems = []
  if (digest(p1) !== digest(p2)) problems.push(`${set} board ${seed} (${mission}): two runs placed it differently`)
  for (const t of placementProblems(G, P.standing(p1))) problems.push(`${set} board ${seed} (${mission}): ${t}`)
  return { G, p: p1, problems }
}

async function nodeHalf() {
  const P = await place()
  const sets = a.sets ? a.sets.split(',') : [...SETS.keys()]
  for (const s of sets) if (!SETS.has(s)) {
    console.error(`dressing-check: no set "${s}" (there are ${[...SETS.keys()].join(', ')})`)
    process.exit(2)
  }
  let failed = 0
  console.log(`dressing-check: the dressing's placement, boards 1-${SEEDS} of each set (${sets.join(', ')})`)
  for (const set of sets) {
    const t0 = performance.now()
    let items = 0, bad = []
    for (let seed = 1; seed <= SEEDS; seed++) {
      const r = board(P, set, seed)
      if (r.p) items += P.standing(r.p).length
      bad.push(...r.problems)
    }
    failed += bad.length
    console.log(`  ${set.padEnd(10)} ${bad.length ? `FAILED: ${bad.length} problems` : 'ok'}: ${SEEDS} boards, ${items} items stood, each placement seeded and the same twice (${((performance.now() - t0) / 1000).toFixed(1)} s)`)
    for (const t of bad.slice(0, 12)) console.log(`    ${t}`)
  }
  console.log(failed ? `\ndressing-check FAILED` : `\ndressing-check passed`)
  return failed ? 1 : 0
}

async function selfTest() {
  const P = await place()
  let bad = 0
  const verdict = (what, caught, want = true) => {
    const ok = caught === want
    if (!ok) bad++
    console.log(`  ${ok ? 'ok  ' : 'MISS'} ${what}: ${caught ? 'caught' : 'passed'}`)
  }
  // a board that passes as it stands
  const { G, p, problems } = board(P, 'classic', 411)
  verdict('classic board 411 as placed', problems.length > 0, false)
  const { W, H, deploy } = G.board
  // a clear low spot on open ground (in no piece), as place.js judges one
  const R = P.rulesOf(ctxOf(P, G))
  let t = null
  for (let x = -W / 2; !t && x < W / 2; x += 0.5) for (let z = -H / 2; !t && z < H / 2; z += 0.5) if (R.lowOk(x, z, 0.05) && !R.inPiece(x, z, 0)) t = { x, z }
  const plant = (it) => placementProblems(G, [{ list: 'planted', r: 0.05, h: 0.1, ...it }]).length > 0
  verdict('low clutter where place.js would put it', plant({ x: t.x, z: t.z }), false)
  verdict('low clutter in a deployment zone', plant({ x: -(W / 2 - deploy / 2), z: 0.3 }))
  const o = G.objectives[1]
  verdict("low clutter in an objective's range", plant({ x: o.x + OBJECTIVE_RANGE - 0.5, z: o.z }))
  const c = G.terrain.chunks.find((c) => c.kind === 'crate' || c.kind === 'rock')
  {
    // half an inch off its box's +x face, in the box's own frame
    const l = c.shape.hx + 0.5, y = c.shape.yaw ?? 0
    verdict(`low clutter half an inch from a ${c.kind}`, plant({ x: c.shape.x + l * Math.cos(y), z: c.shape.z - l * Math.sin(y), r: 0.02 }))
  }
  {
    const i = G.nav.index(t.x, t.z), was = G.nav.hard[i]
    G.nav.hard[i] = 1
    verdict('low clutter on a nav cell made hard', plant({ x: t.x, z: t.z }))
    G.nav.hard[i] = was
  }
  verdict('something tall on the open mat', plant({ x: t.x, z: t.z, h: 1.2 }))
  verdict("something tall half across the mat's edge", plant({ x: W / 2 + 0.2, z: 0, r: 0.5, h: 2 }))
  verdict("something tall inside a piece's footprint", plant({ x: c.shape.x, z: c.shape.z, r: 0.05, h: 2 }), false)
  // unseeded placers: a copy of the dressing drawing Math.random, and one
  // keeping a count between calls
  const work = mkdtempSync(join(tmpdir(), 'dressing-check-'))
  try {
    const copy = (name, edit) => {
      const dir = join(work, name)
      mkdirSync(join(dir, 'view'), { recursive: true })
      cpSync(join(PKG, 'view/dressing'), join(dir, 'view/dressing'), { recursive: true })
      mkdirSync(join(dir, 'core'), { recursive: true })
      cpSync(join(PKG, 'core/dmath.js'), join(dir, 'core/dmath.js'))
      const f = join(dir, 'view/dressing/place.js'), src = readFileSync(f, 'utf8')
      const next = edit(src)
      if (next === src) throw new Error(`self-test: the ${name} edit changed nothing`)
      writeFileSync(f, next)
      return dir
    }
    const random = await place(copy('random', (s) => s.replace("out.stakes.push({ x: sx * (W / 2 + 0.55),", "out.stakes.push({ x: sx * (W / 2 + 0.55 + Math.random() * 0.01),")))
    verdict('a placer drawing Math.random', board(random, 'classic', 411).problems.length > 0)
    const counting = await place(copy('counting', (s) => s.replace('export function plan(ctx) {', 'let calls = 0\nexport function plan(ctx) {\n  calls++').replace("out.stakes.push({ x: sx * (W / 2 + 0.55),", "out.stakes.push({ x: sx * (W / 2 + 0.55 + calls * 0.01),")))
    verdict('a placer keeping a count between calls', board(counting, 'classic', 411).problems.length > 0)
  } finally {
    rmSync(work, { recursive: true, force: true })
  }
  console.log(bad ? `\ndressing-check --self-test FAILED: ${bad} verdicts wrong` : '\ndressing-check --self-test passed')
  return bad ? 1 : 0
}

// The Chromium half: the match the same with the dressing drawn or not.
async function browserHalf() {
  const { chromium } = await import('playwright')
  const { startStaticServer } = await import('../../../scripts/static-server.mjs')
  const { buildApp } = await import('./lib.mjs')
  const { IDLE_MS } = await import('./chromium.mjs')
  const boards = (a.boards ?? 'classic:classic:1,classic:fortified:4,grand:open:7').split(',').map((b) => {
    const [mission, terrain, seed] = b.split(':')
    if (!MISSIONS[mission]?.sets.includes(terrain) || !/^\d+$/.test(seed ?? '')) {
      console.error(`dressing-check: --boards ${b}: give mission:set:seed`)
      process.exit(2)
    }
    return { mission, terrain, seed: Number(seed) }
  })
  const work = mkdtempSync(join(tmpdir(), 'dressing-check-build-'))
  let browser = null, server = null, failed = 0
  try {
    const dir = await buildApp(PKG, join(work, 'app'))
    server = await startStaticServer(dir)
    browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
    const watch = async (b, dress) => {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
      try {
        const page = await ctx.newPage()
        page.setDefaultTimeout(IDLE_MS)
        const errors = []
        page.on('pageerror', (e) => errors.push(e.message))
        await page.goto(`${server.url}/?debug&fast&seed=${b.seed}&dice=${b.seed * 31 + 7}&mission=${b.mission}&terrain=${b.terrain}${dress ? '' : '&dress=0'}`, { timeout: IDLE_MS })
        await page.waitForFunction(() => window.__ts, null, { timeout: IDLE_MS })
        await page.evaluate(() => window.__ts.start('watch'))
        await page.waitForFunction(() => window.__ts.S.stage === 'over', null, { timeout: 10 * IDLE_MS, polling: 500 })
        const got = await page.evaluate(() => {
          const ts = window.__ts
          let dressed = 0
          ts.scenery.scene.traverse((o) => (dressed += o.userData.dressing ? 1 : 0))
          return { hash: ts.hash(), trace: ts.trace.map(String), rng: JSON.stringify(ts.q.rngState()), dressed }
        })
        if (errors.length) throw new Error(errors.join('; '))
        return got
      } finally {
        await ctx.close()
      }
    }
    console.log('dressing-check --browser: a watched battle per board, dressed and with ?dress=0')
    for (const b of boards) {
      const on = await watch(b, true), off = await watch(b, false)
      const line = on.trace.findIndex((l, i) => l !== off.trace[i])
      const why = !on.dressed ? 'the dressed page shows no dressing' : off.dressed ? 'the ?dress=0 page shows dressing'
        : on.hash !== off.hash ? `the state hash differs (${on.hash} against ${off.hash})`
        : on.trace.length !== off.trace.length || line >= 0 ? `the trace differs (line ${line >= 0 ? line + 1 : Math.min(on.trace.length, off.trace.length) + 1})`
        : on.rng !== off.rng ? 'the dice state differs' : ''
      if (why) failed++
      console.log(`  ${b.mission}/${b.terrain} board ${b.seed}: ${why ? `FAILED: ${why}` : `the same match (hash ${on.hash}, ${on.trace.length} trace lines, the dice state alike)`}`)
    }
  } finally {
    await browser?.close()
    server?.close()
    rmSync(work, { recursive: true, force: true })
  }
  console.log(failed ? '\ndressing-check --browser FAILED' : '\ndressing-check --browser passed')
  return failed ? 1 : 0
}

process.exit(a['self-test'] ? await selfTest() : a.browser ? await browserHalf() : await nodeHalf())
