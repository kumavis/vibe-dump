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
//   - (A) hidden under the bases: a scatter of bases over the plan's own
//     clutter (its debris, tufts and flowers), the mask view/dressing/
//     bases.js paints for them, and every item whose disc meets a base hidden
//     by it, read at its centre's texel as the shaders read it.
// --self-test plants, on a board that passes, a violation of each class
// (low clutter in a zone, in an objective's range, by a piece, on a cell the
// nav refuses; something tall on the open mat, and half on it) and two
// unseeded placers (a copy of place.js drawing Math.random, and one keeping
// a count between calls), and (A) two broken bases' masks (one painted
// without its reach, one leaving the mat's far rows unpainted) and two
// broken readings of the bases from real figures (the page's first, which
// read a base's group as one mesh and threw, and one taking every base for
// a Nutkin's), and each must be caught.
//
// --browser (Chromium; set CHROMIUM_PATH): a watched battle per board in
// two fresh pages of a fresh build, one dressed and one with ?dress=0, both
// under ?fast, and each must end with the same state hash, the same trace
// line for line and the same dice state: the dressing reaches nothing of
// the match. Each page must also show what it should: dressing in the
// dressed one, none in the other.
//
//   node sim/dressing-check.mjs [--seeds 1000] [--sets classic,open] [--self-test]
//   node sim/dressing-check.mjs --browser [--boards classic:classic:1,classic:fortified:4,grand:open:7] [--view-seeds 10] [--sets ...]
//
// Exit 0 when everything holds, 1 when anything fails, 2 on bad arguments.
import { parseArgs } from 'node:util'
import { mkdtempSync, mkdirSync, cpSync, readFileSync, writeFileSync, rmSync, symlinkSync } from 'node:fs'
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
  ({ values: a } = parseArgs({ options: { seeds: { type: 'string' }, sets: { type: 'string' }, 'self-test': { type: 'boolean' }, browser: { type: 'boolean' }, boards: { type: 'string' }, 'view-seeds': { type: 'string' } } }))
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
const bases = (dir = PKG) => import(pathToFileURL(join(dir, 'view/dressing/bases.js')).href)
const ground = (dir = PKG) => import(pathToFileURL(join(dir, 'view/dressing/ground.js')).href)
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
// (A) The clutter under the bases: on the plan's own items, a scatter of
// bases (radii 0.3-1.6 tails, half of them on an item), the mask painted for
// them (bases.js, as the page paints it), and every item whose disc meets a
// base must be hidden by it, read as the shaders read it (its centre's
// texel). Items are held to the mask's reach (no clutter wider than the
// mask was dilated for).
function basesProblems(B, G, p) {
  const { W, H } = G.board
  const items = [...p.debris, ...p.tufts, ...p.flowers]
  if (!items.length) return []
  const out = []
  let x = G.setup.board >>> 0
  const rnd = () => {
    x = (Math.imul(x, 1664525) + 1013904223) >>> 0
    return x / 4294967296
  }
  const discs = []
  for (let i = 0; i < 40; i++) {
    const it = i % 2 ? items[Math.floor(rnd() * items.length)] : null
    discs.push({ x: it ? it.x + (rnd() - 0.5) : (rnd() - 0.5) * W, z: it ? it.z + (rnd() - 0.5) : (rnd() - 0.5) * H, r: 0.3 + rnd() * 1.3 })
  }
  const { w, h } = B.maskSize(W, H)
  const mask = B.paintBases(new Uint8Array(w * h), W, H, discs)
  for (const it of items) {
    if (it.r > B.REACH - Math.SQRT2 / (2 * B.RES) + 1e-9) out.push(`clutter at ${it.x.toFixed(2)},${it.z.toFixed(2)} wider (r ${it.r.toFixed(2)}) than the bases' mask reaches`)
    const d = discs.find((d) => Math.hypot(it.x - d.x, it.z - d.z) < d.r + it.r)
    if (d && !B.maskAt(mask, W, H, it.x, it.z)) out.push(`clutter at ${it.x.toFixed(2)},${it.z.toFixed(2)} (r ${it.r.toFixed(2)}) shows through a base at ${d.x.toFixed(2)},${d.z.toFixed(2)} (r ${d.r.toFixed(2)})`)
  }
  return out.slice(0, 3)
}

// (A) The same, from real figures: the bases' mask as the page paints it,
// from the scene (ground.js baseDiscs, which Ground.bases reads each tenth
// of a second), over figure roots made as the model cache makes them
// (view/models/cache.js buildModel: a Nutkin's round base, a War-Cart's and
// a Brute's broad ones, the Shell-Back Howdah's long base, turned). Each
// stands on one of the plan's clutter items; every item whose disc meets
// the base the rules give the unit (its data's `base` radius, a long hull's
// discs turned with it) must be hidden. A figure on a deck, above the
// ground, hides nothing. The base check above paints discs it made itself:
// this one is what would have caught a page whose mask could not be read
// from its figures at all (bases of three.js groups read as one mesh).
const FIGS = [['squirrel', 'nutkin'], ['squirrel', 'warcart'], ['serpent', 'brute'], ['serpent', 'scaleguard'], ['serpent', 'howdah']]
let figs = null
async function figures() {
  if (figs) return figs
  const THREE = await import('three')
  const cache = await import(pathToFileURL(join(PKG, 'view/models/cache.js')).href)
  const { RACES } = await import(pathToFileURL(join(PKG, 'data/schema.js')).href)
  const scene = new THREE.Scene()
  const roots = FIGS.map(([race, key]) => {
    const t = RACES[race].units[key]
    const root = cache.buildModel(race, key, t, '#46c27a')
    scene.add(root)
    return { root, t }
  })
  // and one on a deck, whose base hides nothing of the mat's
  const up = cache.buildModel('squirrel', 'nutkin', RACES.squirrel.units.nutkin, '#ec8a34')
  scene.add(up)
  return (figs = { scene, roots, up })
}
function figureBasesProblems(G, B, F, p, discsOf) {
  const { W, H } = G.board
  const items = [...p.debris, ...p.tufts, ...p.flowers]
  if (!items.length) return []
  let x = (G.setup.board >>> 0) ^ 0x5bd1
  const rnd = () => {
    x = (Math.imul(x, 1664525) + 1013904223) >>> 0
    return x / 4294967296
  }
  // each figure on an item (a hair off its centre), turned
  const want = []
  for (const { root, t } of F.roots) {
    const it = items[Math.floor(rnd() * items.length)], yaw = rnd() * Math.PI * 2
    root.position.set(it.x + (rnd() - 0.5) * 0.4, 0, it.z + (rnd() - 0.5) * 0.4)
    root.rotation.set(0, yaw, 0)
    const c = Math.cos(yaw), s = Math.sin(yaw)
    for (const [lx, lz, r] of t.fp ? t.fp.discs : [[0, 0, t.base]]) want.push({ x: root.position.x + lx * c + lz * s, z: root.position.z - lx * s + lz * c, r, unit: t.name ?? 'a unit' })
  }
  const deckAt = items[Math.floor(rnd() * items.length)]
  F.up.position.set(deckAt.x, 1.2, deckAt.z)
  F.scene.updateMatrixWorld(true)
  let discs
  try {
    discs = discsOf(F.scene)
  } catch (e) {
    return [`the bases' mask could not be read from the figures: ${e.message}`]
  }
  const { w, h } = B.maskSize(W, H)
  const mask = B.paintBases(new Uint8Array(w * h), W, H, discs)
  const out = []
  for (const it of items) {
    const d = want.find((d) => Math.hypot(it.x - d.x, it.z - d.z) < d.r + it.r)
    if (d && !B.maskAt(mask, W, H, it.x, it.z)) out.push(`clutter at ${it.x.toFixed(2)},${it.z.toFixed(2)} (r ${it.r.toFixed(2)}) shows through ${d.unit}'s base at ${d.x.toFixed(2)},${d.z.toFixed(2)} (r ${d.r.toFixed(2)}), the mask read from the figures`)
  }
  // the figure on the deck: nothing hidden for it alone
  if (discs.some((d) => Math.hypot(d.x - deckAt.x, d.z - deckAt.z) < 1e-6)) out.push(`a figure standing on a deck (1.2 up) hides the mat's clutter under it`)
  return out.slice(0, 3)
}

function board(P, set, seed, B = null, F = null) {
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
  if (B) for (const t of basesProblems(B, G, p1)) problems.push(`${set} board ${seed} (${mission}): ${t}`)
  if (B && F) for (const t of figureBasesProblems(G, B, F.figs, p1, F.discsOf)) problems.push(`${set} board ${seed} (${mission}): ${t}`)
  return { G, p: p1, problems }
}

async function nodeHalf() {
  const P = await place(), B = await bases(), F = { figs: await figures(), discsOf: (await ground()).baseDiscs }
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
      const r = board(P, set, seed, B, F)
      if (r.p) items += P.standing(r.p).length
      bad.push(...r.problems)
    }
    failed += bad.length
    console.log(`  ${set.padEnd(10)} ${bad.length ? `FAILED: ${bad.length} problems` : 'ok'}: ${SEEDS} boards, ${items} items stood, each placement seeded and the same twice, the clutter hidden under every base (drawn and read from real figures) (${((performance.now() - t0) / 1000).toFixed(1)} s)`)
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
    const copy = (name, edit, file = 'place.js', editOther = null) => {
      const dir = join(work, name)
      mkdirSync(join(dir, 'view'), { recursive: true })
      cpSync(join(PKG, 'view/dressing'), join(dir, 'view/dressing'), { recursive: true })
      mkdirSync(join(dir, 'core'), { recursive: true })
      cpSync(join(PKG, 'core/dmath.js'), join(dir, 'core/dmath.js'))
      const f = join(dir, 'view/dressing', editOther ? file : 'place.js'), src = readFileSync(f, 'utf8')
      const next = (editOther ?? edit)(src)
      if (next === src) throw new Error(`self-test: the ${name} edit changed nothing`)
      writeFileSync(f, next)
      return dir
    }
    const random = await place(copy('random', (s) => s.replace("out.stakes.push({ x: sx * (W / 2 + 0.55),", "out.stakes.push({ x: sx * (W / 2 + 0.55 + Math.random() * 0.01),")))
    verdict('a placer drawing Math.random', board(random, 'classic', 411).problems.length > 0)
    const counting = await place(copy('counting', (s) => s.replace('export function plan(ctx) {', 'let calls = 0\nexport function plan(ctx) {\n  calls++').replace("out.stakes.push({ x: sx * (W / 2 + 0.55),", "out.stakes.push({ x: sx * (W / 2 + 0.55 + calls * 0.01),")))
    verdict('a placer keeping a count between calls', board(counting, 'classic', 411).problems.length > 0)
    // (A) a bases' mask painted without its reach: clutter by a base's rim
    // shows through it
    const tight = await bases(copy('tight', (s) => s, 'bases.js', (s) => s.replace('export const REACH = 0.45 + Math.SQRT2 / (2 * RES)', 'export const REACH = 0')))
    verdict("a bases' mask painted without its reach", board(P, 'classic', 411, tight).problems.length > 0)
    // and one that leaves the mat's far rows unpainted
    const short = await bases(copy('short', (s) => s, 'bases.js', (s) => s.replace('j1 = Math.min(h - 1,', 'j1 = Math.min(h - 9,')))
    verdict("a bases' mask that leaves the mat's far edge unpainted", [411, 7, 30].some((n) => board(P, 'classic', n, short).problems.length > 0))
    // (A) the mask read from real figures: the page's first reading (each
    // base taken as one mesh, its geometry's bounding sphere: a base is a
    // group, so it throws on the first figure), and one that takes every
    // base for a Nutkin's
    const B0 = await bases(), F0 = await figures()
    const withThree = (dir) => (symlinkSync(join(PKG, '../../node_modules'), join(dir, 'node_modules'), 'dir'), dir)
    const first = await ground(withThree(copy('first', (s) => s, 'ground.js', (s) => s.replace("    const own = b.userData.discs\n", "    b.geometry.boundingSphere ?? b.geometry.computeBoundingSphere()\n    const own = b.userData.discs\n"))))
    verdict("the bases read as the page first read them (a base's group as one mesh)", board(P, 'classic', 411, B0, { figs: F0, discsOf: first.baseDiscs }).problems.length > 0)
    const small = await ground(withThree(copy('small', (s) => s, 'ground.js', (s) => s.replace('discs.push({ x: _q.x, z: _q.z, r: r * k })', 'discs.push({ x: _q.x, z: _q.z, r: 0.315 })'))))
    verdict("every base read as a Nutkin's", [411, 7, 30].some((n) => board(P, 'classic', n, B0, { figs: F0, discsOf: small.baseDiscs }).problems.length > 0))
    const real = await ground()
    verdict('the bases read from real figures as ground.js reads them', board(P, 'classic', 411, B0, { figs: F0, discsOf: real.baseDiscs }).problems.length > 0, false)
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
    failed += await openingViews(browser, server, IDLE_MS)
  } finally {
    await browser?.close()
    server?.close()
    rmSync(work, { recursive: true, force: true })
  }
  console.log(failed ? '\ndressing-check --browser FAILED' : '\ndressing-check --browser passed')
  return failed ? 1 : 0
}

// The dressed page as it is drawn (not under ?fast): for each set, boards
// 1-N (--view-seeds, 10 by default; each set's missions in turn, as the
// Node half), a fresh page of the dressed build, its title drawn, then a
// watched battle begun on the board (the table a battle shows is its own
// setup's; the title always shows the classic board):
//   - drawn: 30 frames and more on the title and again in the battle, and
//     not one page error (the bases' mask is read from the figures every
//     tenth of a second of them);
//   - the opening views: the page's own camera taken to each view a battle
//     on this board opens on (present/camera-presets.js battleView, fitted
//     by fitPose to the page's screen as view/camera.js fits it: the
//     broadside a watched or two-seat battle opens on, and behind each
//     army, the view against the AI), and the title's orbit as the page
//     draws it, panel and all (on the classic set's pages); a landmark of
//     the board's theme (place.js LANDMARKS: the farm's house or barn, the
//     quarry's cut, crane or spoil, the keep's gatehouse, towers or curtain,
//     the burned hamlet's shells) must stand inside the frame, below the
//     HUD's top bar (and clear of the title's panel), on at least 9 boards
//     in 10 of each set: the broadside on every set; behind each army
//     wherever the view takes in ground off the mat (a classic-sized
//     board: on Field and Grand it is fitted to the army's own half of the
//     mat, and is counted, not held);
//   - the caps: the dressing drawn alone at the high quality (every item
//     of every list, the works shown, nothing culled), as the renderer
//     counts it: at most 12 draw calls and 40,000 triangles on every board.
// And once, on the first board, the battle's opening camera must be the
// broadside fitPose gives (within a tenth of a tail), so the views held
// above are the ones a battle opens on.
async function openingViews(browser, server, IDLE_MS) {
  const CP = await import(pathToFileURL(join(PKG, 'present/camera-presets.js')).href)
  const N = Number(a['view-seeds'] ?? 10)
  const sets = a.sets ? a.sets.split(',') : [...SETS.keys()]
  const jobs = []
  for (const set of sets) for (let seed = 1; seed <= N; seed++) jobs.push({ set, seed, mission: SETS.get(set)[seed % SETS.get(set).length] })
  const PAR = Number(process.env.PARALLEL || 3)
  const results = []
  let failed = 0, opened = false
  const one = async (j) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    try {
      const page = await ctx.newPage()
      page.setDefaultTimeout(IDLE_MS)
      const errors = []
      page.on('pageerror', (e) => errors.push(e.message))
      await page.goto(`${server.url}/?debug&seed=${j.seed}&dice=1&mission=${j.mission}&terrain=${j.set}`, { timeout: 2 * IDLE_MS, waitUntil: 'domcontentloaded' })
      await page.waitForFunction(() => window.__ts, null, { timeout: 2 * IDLE_MS })
      const drawn = () => page.evaluate(() => new Promise((res) => {
        let n = 0
        const t0 = performance.now()
        const step = () => (++n >= 30 && performance.now() - t0 > 1500 ? res(n) : requestAnimationFrame(step))
        requestAnimationFrame(step)
      }))
      // the title's table (the classic board the title shows) first, its
      // orbit as the page draws it; then the board itself, a watched battle
      // begun on it (the table a battle shows is its own setup's)
      let frames = await drawn()
      const title = await page.evaluate(() => {
        const cam = window.__ts.camera
        let works = null
        window.__ts.scenery.scene.traverse((o) => o.userData.works && (works = o))
        const hud = document.querySelector('#hud').getBoundingClientRect().bottom / innerHeight
        const panel = document.querySelector('#title')
        const panelRight = panel && !panel.classList.contains('hidden') ? Math.max(0, ...[...panel.children].map((e) => e.getBoundingClientRect().right)) / innerWidth : 0
        const marks = works ? works.userData.works.filter((w) => works.userData.landmarks.includes(w.kind)) : []
        cam.updateMatrixWorld()
        return marks.find((w) => [0.3, 0.6, 0.9].some((f) => {
          const v = new cam.position.constructor(w.x, w.y + w.h * f, w.z).project(cam)
          return v.z < 1 && v.x > -1 + 2 * panelRight && v.x < 0.98 && v.y > -0.98 && v.y < 1 - 2 * hud
        }))?.kind ?? null
      })
      await page.evaluate(() => window.__ts.start('watch'))
      await page.waitForFunction(() => window.__ts.S.stage === 'battle', null, { timeout: 2 * IDLE_MS })
      frames = Math.min(frames, await drawn())
      const screen = await page.evaluate(() => ({ aspect: innerWidth / innerHeight, board: window.__ts.board }))
      const rect = CP.boardRect(screen.board)
      if (screen.board.W !== { classic: 40, field: 60, grand: 80, keg: 40, powder: 80 }[j.mission] && j.mission in { classic: 1, field: 1, grand: 1 }) throw new Error(`the battle's board is ${screen.board.W} wide, not ${j.mission}'s`)
      const views = {
        broadside: CP.fitPose(CP.PRESETS.broadside, screen.aspect, rect),
        'behind the west army': CP.fitPose(CP.PRESETS.behind(-1), screen.aspect, rect),
        'behind the east army': CP.fitPose(CP.PRESETS.behind(1), screen.aspect, rect),
      }
      const got = await page.evaluate((views) => {
        const r = window.__ts, cam = r.camera, scene = r.scenery.scene
        let works = null
        scene.traverse((o) => o.userData.works && (works = o))
        const hud = document.querySelector('#hud').getBoundingClientRect().bottom / innerHeight
        const panel = document.querySelector('#title')
        const panelRight = panel && !panel.classList.contains('hidden') ? Math.max(0, ...[...panel.children].map((e) => e.getBoundingClientRect().right)) / innerWidth : 0
        const marks = works ? works.userData.works.filter((w) => works.userData.landmarks.includes(w.kind)) : []
        const seen = (left = -0.98) => {
          cam.updateMatrixWorld()
          return marks.find((w) => [0.3, 0.6, 0.9].some((f) => {
            const v = new cam.position.constructor(w.x, w.y + w.h * f, w.z).project(cam)
            return v.z < 1 && v.x > left && v.x < 0.98 && v.y > -0.98 && v.y < 1 - 2 * hud
          }))?.kind ?? null
        }
        const out = { works: marks.length }
        const was = { pos: cam.position.clone(), quat: cam.quaternion.clone(), fov: cam.fov, view: cam.view && { ...cam.view } }
        for (const [name, p] of Object.entries(views)) {
          cam.clearViewOffset()
          cam.fov = p.fov
          cam.aspect = innerWidth / innerHeight
          cam.updateProjectionMatrix()
          cam.position.set(...p.pos)
          cam.lookAt(...p.target)
          out[name] = seen()
        }
        // the caps: the dressing alone, all of it, as the renderer counts it
        const hidden = [], culled = [], counts = []
        for (const o of scene.children) {
          if (o.userData.dressing || !o.visible) continue
          hidden.push(o)
          o.visible = false
        }
        scene.traverse((o) => {
          let d = false
          for (let q = o; q; q = q.parent) d ||= !!q.userData.dressing
          if (!d || !o.isMesh) return
          culled.push([o, o.frustumCulled, o.visible])
          o.frustumCulled = false
          if (o.isInstancedMesh && o.full != null) {
            counts.push([o, o.count])
            o.count = o.full
            o.visible = o.full > 0
          } else o.visible = true
          if (o.geometry.drawRange.count !== Infinity) {
            counts.push([o.geometry, o.geometry.drawRange.count, true])
            o.geometry.setDrawRange(0, Infinity)
          }
        })
        const info = r.renderer.info
        info.autoReset = true
        r.renderer.render(scene, cam)
        out.calls = info.render.calls
        out.tris = info.render.triangles
        for (const o of hidden) o.visible = true
        for (const [o, f, v] of culled) Object.assign(o, { frustumCulled: f, visible: v })
        for (const [o, n, range] of counts) range ? o.setDrawRange(0, n) : (o.count = n)
        cam.position.copy(was.pos)
        cam.quaternion.copy(was.quat)
        cam.fov = was.fov
        if (was.view?.enabled) cam.setViewOffset(was.view.fullWidth, was.view.fullHeight, was.view.offsetX, was.view.offsetY, was.view.width, was.view.height)
        cam.updateProjectionMatrix()
        return out
      }, views)
      // once: a battle begun, its opening camera the broadside's
      if (!opened && j === jobs[0]) {
        opened = true
        const pos = await page.waitForFunction(() => {
          const c = window.__ts.camera.position, k = c.toArray().map((v) => v.toFixed(3)).join()
          const t = window.__ts.controls.target, still = window.__openKey === k && Math.abs(t.x) < 0.05 && Math.abs(t.z) < 0.05
          window.__openKey = k
          return still && c.toArray()
        }, null, { timeout: 2 * IDLE_MS, polling: 1500 }).then((h) => h.jsonValue())
        const want = views.broadside.pos
        got.opening = Math.hypot(pos[0] - want[0], pos[1] - want[1], pos[2] - want[2])
      }
      if (errors.length) got.errors = errors
      got.frames = frames
      // (the title shows the classic board whatever the address asks: its
      // orbit is counted on the classic set's pages alone)
      if (j.set === 'classic') got.title = title
      return { ...j, W: screen.board.W, ...got }
    } finally {
      await ctx.close()
    }
  }
  for (let i = 0; i < jobs.length; i += PAR) results.push(...(await Promise.all(jobs.slice(i, i + PAR).map((j) => one(j).catch((e) => ({ ...j, errors: [e.message] }))))))
  console.log(`dressing-check --browser: the dressed page drawn, boards 1-${N} of each set: the opening views, the caps`)
  const VIEWS = ['broadside', 'behind the west army', 'behind the east army', 'title']
  for (const set of sets) {
    const rs = results.filter((r) => r.set === set), bad = []
    for (const r of rs) if (r.errors) bad.push(`board ${r.seed} (${r.mission}): page errors: ${r.errors.slice(0, 2).join('; ')}`)
    const ok = rs.filter((r) => !r.errors)
    const tally = VIEWS.map((v) => {
      if (v === 'title' && set !== 'classic') return null
      const held = v === 'broadside' || ok.every((r) => r.W <= 40)
      const n = ok.filter((r) => r[v]).length
      if (held && n < Math.ceil(0.9 * rs.length)) bad.push(`a landmark in the ${v} on ${n} of ${rs.length} boards (under 9 in 10): missing on ${ok.filter((r) => !r[v]).map((r) => r.seed).join(', ')}`)
      return `${v} ${n}/${rs.length}${held ? '' : ' (counted)'}`
    }).filter(Boolean)
    for (const r of ok) {
      if (r.calls > 12) bad.push(`board ${r.seed} (${r.mission}): the dressing draws ${r.calls} calls (cap 12)`)
      if (r.tris > 40000) bad.push(`board ${r.seed} (${r.mission}): the dressing draws ${r.tris} triangles (cap 40,000)`)
      if (r.opening != null && r.opening > 0.1) bad.push(`board ${r.seed} (${r.mission}): the battle opened ${r.opening.toFixed(2)} tails from the broadside's pose`)
    }
    const calls = Math.max(0, ...ok.map((r) => r.calls)), tris = Math.max(0, ...ok.map((r) => r.tris))
    failed += bad.length
    console.log(`  ${set.padEnd(10)} ${bad.length ? `FAILED: ${bad.length} problems` : 'ok'}: ${rs.length} boards drawn (${Math.min(...ok.map((r) => r.frames))}+ frames each, no page error); a landmark in the ${tally.join(', ')}; the dressing at most ${calls} calls and ${tris} triangles${ok.some((r) => r.opening != null) ? `; a battle opened on the broadside (${ok.find((r) => r.opening != null).opening.toFixed(3)} tails off)` : ''}`)
    for (const r of ok) console.log(`      board ${String(r.seed).padStart(2)} ${r.mission.padEnd(8)} ${r.calls} calls ${String(r.tris).padStart(6)} tris  ${VIEWS.map((v) => `${v.split(' ').pop()}:${r[v] ?? '-'}`).join(' ')}`)
    for (const t of bad.slice(0, 12)) console.log(`    ${t}`)
  }
  return failed
}

process.exit(a['self-test'] ? await selfTest() : a.browser ? await browserHalf() : await nodeHalf())
