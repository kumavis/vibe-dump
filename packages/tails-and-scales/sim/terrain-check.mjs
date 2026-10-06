// P-terrain (DESIGN §4 R3): the split terrain builds the battlefield the old
// one did. For every board seed it builds the table twice, with the R0 code's
// scenery.js (sim/lib.mjs's LEGACY_REF, a fixed commit; it imports three.js
// for real and gets a no-op fx that records its calls) and with the working
// tree's (core/terrain + view/terrain.js behind the Scenery facade), and
// requires, exactly (Object.is on every number, no tolerance):
//
//  1. the layout stream: every mulberry32 the generation makes, its seed and
//     its draw count, in order (sim/terrain-hooks.mjs counts them);
//  2. every chunk, in order: id order, kind, shape (x, y, z, hx, hy, hz,
//     yaw, reach), hp, maxHp, destructible, alive, navKind, los, cover, nav
//     and coverShape, the wall column (place, size, style, its blocks and
//     rubble) and level, trunkH and trunkR; the old chunk's presentation
//     fields against `look` (color = look.chip, the debris colour; leaves =
//     look.leaves; a cap's capH = look.h, which nothing ever read); and no
//     field on either side the other can't account for;
//  3. every chunk's mesh against the old one, and the whole scenery group:
//     object type, position, rotation, quaternion, scale, shadows, children;
//     geometry type, parameters and every vertex attribute value; material
//     type, colour and settings; and which meshes share a geometry or a
//     material (material ids decide the draw order);
//  4. then the same seeded run of destruction on both: blasts (some acid)
//     and wrecker sweeps that walk the live chunk list as main.js's
//     smashAround does, with the tweens stepped to the end and Math.random
//     seeded alike on both sides: after every one, the chunks (the rubble and
//     logs they make included), what blast returns, `dirty`, every fx call
//     and, at the end, the whole scenery group (rubble pieces, fallen logs,
//     collapsed blocks), plus line-of-sight queries before and after.
//
//   node sim/terrain-check.mjs [--seeds 1-500 | 42] [--ops 8] [--max 10]
//   node sim/terrain-check.mjs --self-test     each edit in terrain-hooks.mjs's
//                                              MUTATIONS must fail it
//
// --max caps the differences printed. Exit 0 when everything matches (the
// self-test: when every mutation is caught), 1 on a difference, 2 on bad
// arguments or a run that checked nothing (no board, or --ops above 0 and
// not one destruction op run).
//
// It drives the working tree through the Scenery facade (scenery.js: `new
// Scenery`, its generate, blast, hurt and los, and `view.object(id)` for a
// chunk's mesh), which goes at R4. R4 ports this check to Terrain and
// TerrainView directly: P-terrain is a standing check (DESIGN §1.1), not an
// R3-only one.
import { register } from 'node:module'
import { parseArgs } from 'node:util'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

// an unknown option, or a value parseArgs can't take (`--max -1`), is a bad
// argument like any other: exit 2 with the usage line (usage is below)
let args
try {
  ({ values: args } = parseArgs({ options: { seeds: { type: 'string' }, ops: { type: 'string' }, max: { type: 'string' }, 'self-test': { type: 'boolean' } } }))
} catch (e) {
  usage(e.message)
}

if (args['self-test']) {
  const { MUTATIONS } = await import('./terrain-hooks.mjs')
  let missed = 0
  for (const name of Object.keys(MUTATIONS)) {
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), '--seeds', '1-25', '--max', '1'], { env: { ...process.env, TERRAIN_MUTATE: name }, encoding: 'utf8' })
    const caught = r.status === 1 && /MISMATCH/.test(r.stdout)
    if (!caught) missed++
    const first = r.stdout.split('\n').find((l) => l.startsWith('  seed')) ?? (r.stderr.trim().split('\n')[0] || `exit ${r.status}`)
    console.log(`  ${caught ? 'caught' : 'MISSED'} ${name.padEnd(13)} ${first.trim().slice(0, 150)}`)
  }
  console.log(missed ? `\nterrain-check self-test FAILED: ${missed} mutation(s) passed` : '\nterrain-check self-test passed: every mutation fails the check')
  process.exit(missed ? 1 : 0)
}

register('./oracle/hooks.mjs', import.meta.url)
register('./terrain-hooks.mjs', import.meta.url)

const THREE = await import('three')
const { legacyDir, LEGACY_REF } = await import('./lib.mjs')
const { PKG } = await import('./oracle/pin.mjs')
const imp = (dir, f) => import(pathToFileURL(join(dir, f)).href)
const LEG = legacyDir()
const legacy = { ...(await imp(LEG, 'scenery.js')), ...(await imp(LEG, 'util.js')) }
const mine = { ...(await imp(PKG, 'scenery.js')), ...(await imp(PKG, 'util.js')) }
const { STYLES } = await imp(PKG, 'core/terrain/recipes.js')
const { BOARD } = await imp(PKG, 'core/rules.js')
const { hypot } = await imp(PKG, 'core/dmath.js')
const { distToBox } = await imp(PKG, 'core/terrain/geom.js')

// the objectives generate keeps clear of, as both main.js files have them
const OBJ_RE = /const OBJ_POS = (\[[^\]]*\])/
const objText = (dir) => readFileSync(join(dir, 'main.js'), 'utf8').match(OBJ_RE)?.[1]
if (!objText(LEG) || objText(LEG) !== objText(PKG)) throw new Error('main.js OBJ_POS: not found, or the R0 code and the working tree differ')
const OBJ_POS = new Function(`return ${objText(PKG)}`)()
const { W, H } = BOARD

// --seeds N or A-B (whole numbers, A <= B); --ops and --max whole numbers
function usage(why) {
  console.error(`terrain-check: ${why}\nusage: node sim/terrain-check.mjs [--seeds 1-500 | 42] [--ops 8] [--max 10] | --self-test`)
  process.exit(2)
}
const whole = (name, v, dflt) => {
  if (v === undefined) return dflt
  if (!/^\d+$/.test(v)) usage(`--${name} ${v}: not a whole number`)
  return Number(v)
}
const range = /^(\d+)(?:-(\d+))?$/.exec(args.seeds ?? '1-500') ?? usage(`--seeds ${args.seeds}: give N or A-B`)
const lo = Number(range[1]), hi = Number(range[2] ?? range[1])
if (lo > hi) usage(`--seeds ${args.seeds}: ${lo} is above ${hi}`)
const OPS = whole('ops', args.ops, 8)
const MAX = whole('max', args.max, 10)

function mulberry(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const realRandom = Math.random

// ── Differences ─────────────────────────────────────────────────────────────
let mismatches = 0
const shown = []
class Stop extends Error {}
function differ(where, a, b) {
  mismatches++
  if (shown.length < MAX) shown.push(`${where}: R0 ${fmt(a)} | now ${fmt(b)}`)
  throw new Stop()
}
const fmt = (v) => (typeof v === 'number' && Object.is(v, -0) ? '-0' : typeof v === 'string' ? JSON.stringify(v) : v && typeof v === 'object' ? JSON.stringify(v)?.slice(0, 120) : String(v))
const same = (where, a, b) => Object.is(a, b) || differ(where, a, b)
// plain data, exactly: numbers by Object.is, objects by their own keys
function deep(where, a, b) {
  if (Object.is(a, b)) return
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object' || Array.isArray(a) !== Array.isArray(b)) return differ(where, a, b)
  const ka = Object.keys(a).sort(), kb = Object.keys(b).sort()
  same(`${where} keys`, ka.join(), kb.join())
  for (const k of ka) deep(`${where}.${k}`, a[k], b[k])
}

// ── Chunks ──────────────────────────────────────────────────────────────────
const LOGIC = ['kind', 'alive', 'destructible', 'hp', 'maxHp', 'los', 'cover', 'navKind', 'level', 'trunkH', 'trunkR']
// fields only the old chunk has, and where they went
const LEGACY_ONLY = new Set(['mesh', 'color', 'leaves', 'capH', 'canopy', 'ownMat', 'pieces'])
function sameChunks(where, A, B) {
  same(`${where} chunk count`, A.length, B.length)
  const ia = new Map(A.map((c, i) => [c, i])), ib = new Map(B.map((c, i) => [c, i]))
  A.forEach((a, i) => {
    const b = B[i], w = `${where} chunk ${i} (${a.kind})`
    same(`${w} id order`, a.id - A[0].id, b.id - B[0].id)
    same(`${w} id`, b.id, i + 1)
    for (const k of LOGIC) same(`${w} ${k}`, a[k], b[k])
    deep(`${w} shape`, a.shape, b.shape)
    deep(`${w} nav`, a.nav, b.nav)
    deep(`${w} coverShape`, a.coverShape, b.coverShape)
    if (a.col || b.col) {
      const ca = a.col, cb = b.col
      if (!ca || !cb) differ(`${w} col`, !!ca, !!cb)
      for (const k of ['x', 'z', 'yaw', 'w', 't']) same(`${w} col.${k}`, ca[k], cb[k])
      same(`${w} col.by`, ca.style.by, cb.by)
      deep(`${w} col style`, { colors: ca.style.colors, look: ca.style.look }, { colors: STYLES[cb.style].colors, look: STYLES[cb.style].look })
      same(`${w} col blocks`, ca.blocks.map((c) => ia.get(c)).join(), cb.blocks.map((c) => ib.get(c)).join())
      same(`${w} col rubble`, ca.rubble ? ia.get(ca.rubble) : null, cb.rubble ? ib.get(cb.rubble) : null)
    }
    // the presentation fields the old chunk carried, now in look
    same(`${w} color = look.chip`, a.color, b.look.chip)
    deep(`${w} leaves = look.leaves`, a.leaves, b.look.leaves)
    if (a.capH !== undefined) same(`${w} capH = look.h`, a.capH, b.look.h)
    const ka = Object.keys(a).filter((k) => !LEGACY_ONLY.has(k)).sort(), kb = Object.keys(b).filter((k) => k !== 'look').sort()
    same(`${w} fields`, ka.join(), kb.join())
  })
}

// ── Meshes ──────────────────────────────────────────────────────────────────
// Which geometry and material objects are shared is compared as first-seen
// order per side; their contents once per pair.
function sharing() {
  const ids = [new Map(), new Map()]
  return (side, o) => {
    if (!ids[side].has(o)) ids[side].set(o, ids[side].size)
    return ids[side].get(o)
  }
}
const geoSeen = new WeakMap()
const vec = (where, a, b, keys = ['x', 'y', 'z']) => keys.forEach((k) => same(`${where}.${k}`, a[k], b[k]))
const MAT = ['type', 'roughness', 'metalness', 'flatShading', 'transparent', 'opacity', 'side', 'depthWrite', 'depthTest', 'visible', 'toneMapped', 'vertexColors', 'emissiveIntensity', 'wireframe']
function sameGeometry(where, a, b) {
  if (geoSeen.get(a) === b) return
  same(`${where} type`, a.type, b.type)
  deep(`${where} parameters`, a.parameters, b.parameters)
  same(`${where} attributes`, Object.keys(a.attributes).sort().join(), Object.keys(b.attributes).sort().join())
  for (const k of Object.keys(a.attributes)) {
    const x = a.attributes[k], y = b.attributes[k]
    same(`${where} ${k}.itemSize`, x.itemSize, y.itemSize)
    same(`${where} ${k} type`, x.array.constructor.name, y.array.constructor.name)
    same(`${where} ${k} length`, x.array.length, y.array.length)
    for (let i = 0; i < x.array.length; i++) if (!Object.is(x.array[i], y.array[i])) differ(`${where} ${k}[${i}]`, x.array[i], y.array[i])
  }
  same(`${where} index`, a.index ? a.index.array.join() : null, b.index ? b.index.array.join() : null)
  deep(`${where} groups`, a.groups, b.groups)
  geoSeen.set(a, b)
}
function sameObject(where, a, b, share) {
  same(`${where} type`, a.type, b.type)
  vec(`${where} position`, a.position, b.position)
  vec(`${where} rotation`, a.rotation, b.rotation)
  same(`${where} rotation.order`, a.rotation.order, b.rotation.order)
  vec(`${where} quaternion`, a.quaternion, b.quaternion, ['x', 'y', 'z', 'w'])
  vec(`${where} scale`, a.scale, b.scale)
  for (const k of ['visible', 'castShadow', 'receiveShadow', 'renderOrder', 'frustumCulled']) same(`${where} ${k}`, a[k], b[k])
  if (a.isMesh || b.isMesh) {
    same(`${where} geometry shared as`, share.geo(0, a.geometry), share.geo(1, b.geometry))
    sameGeometry(`${where} geometry`, a.geometry, b.geometry)
    const ma = a.material, mb = b.material
    same(`${where} material shared as`, share.mat(0, ma), share.mat(1, mb))
    for (const k of MAT) same(`${where} material.${k}`, ma[k], mb[k])
    vec(`${where} material.color`, ma.color, mb.color, ['r', 'g', 'b'])
    if (ma.emissive || mb.emissive) vec(`${where} material.emissive`, ma.emissive, mb.emissive, ['r', 'g', 'b'])
  }
  same(`${where} children`, a.children.length, b.children.length)
  a.children.forEach((c, i) => sameObject(`${where}.children[${i}]`, c, b.children[i], share))
}

// ── One board ───────────────────────────────────────────────────────────────
function recorder() {
  const log = []
  const state = { shake: 0 }
  const proxy = new Proxy(state, {
    get: (t, k) => (k in t ? t[k] : (...a) => void log.push([k, structuredClone(a)])),
    set: (t, k, v) => ((t[k] = v), log.push([`=${String(k)}`, v]), true),
  })
  return { proxy, log }
}
// a side: a fresh scene, its own fx recorder, Math.random seeded per step
function side(code, seed) {
  const fx = recorder()
  const scene = new THREE.Scene()
  Math.random = mulberry(seed)
  const S = new code.Scenery(scene, fx.proxy, W, H)
  return { S, fx, code }
}
async function settle(code) {
  // every tween here ends inside 1 s of game time (a topple takes 0.9)
  for (let i = 0; i < 45; i++) {
    code.stepTweens(1 / 30)
    await new Promise((r) => setImmediate(r))
  }
}
function smash(S, x, z, dir, r) {
  // main.js smashAround, walking the live list
  for (const c of S.chunks) {
    if (!c.alive || !c.destructible) continue
    const s = c.nav || c.shape
    if (hypot(s.x - x, s.z - z) < r + Math.max(s.hx, s.hz) * 0.8) S.hurt(c, 99, { x: x - Math.sin(dir), z: z - Math.cos(dir) })
  }
}
function losProbe(S, rand) {
  const out = []
  for (let i = 0; i < 24; i++) {
    const a = { x: (rand() - 0.5) * W, y: 0.5 + rand() * 1.5, z: (rand() - 0.5) * H }
    const b = { x: (rand() - 0.5) * W, y: 0.5 + rand() * 1.5, z: (rand() - 0.5) * H }
    out.push(S.los(a, b, rand() < 0.5 ? undefined : 1 + rand()))
  }
  return out
}

const stats = { chunks: 0, meshes: 0, draws: 0, streams: 0, ops: 0, broke: 0, logs: 0, freshLogSmashed: 0, logSparedByBlast: 0, rubble: 0 }
const pieces = {}
const count = (o) => 1 + o.children.reduce((n, c) => n + count(c), 0)

async function board(seed) {
  const where = `seed ${seed}`
  const rseed = (seed * 2654435761) >>> 0
  // generation, on both sides, the layout stream counted
  globalThis.__layoutDraws = []
  const L = side(legacy, rseed)
  L.S.generate(seed, OBJ_POS, BOARD.deploy)
  const drawsL = globalThis.__layoutDraws
  globalThis.__layoutDraws = []
  const M = side(mine, rseed)
  M.S.generate(seed, OBJ_POS, BOARD.deploy)
  const drawsM = globalThis.__layoutDraws
  globalThis.__layoutDraws = null
  same(`${where} layout streams`, drawsL.length, drawsM.length)
  drawsL.forEach((d, i) => deep(`${where} layout stream ${i}`, d, drawsM[i]))
  stats.streams += drawsL.length
  stats.draws += drawsL.reduce((n, d) => n + d.n, 0)

  sameChunks(where, L.S.chunks, M.S.chunks)
  deep(`${where} features`, L.S.features, M.S.features)
  same(`${where} dirty`, L.S.dirty, M.S.dirty)
  const share = { geo: sharing(), mat: sharing() }
  L.S.chunks.forEach((c, i) => sameObject(`${where} chunk ${i} (${c.kind}) mesh`, c.mesh, M.S.view.object(M.S.chunks[i].id), share))
  sameObject(`${where} scenery group`, L.S.group, M.S.group, share)
  stats.chunks += L.S.chunks.length
  for (const c of M.S.chunks) pieces[c.look.piece] = (pieces[c.look.piece] ?? 0) + 1
  stats.meshes += count(L.S.group)

  // line of sight on the fresh table
  const probe = mulberry(rseed ^ 0x105)
  deep(`${where} los`, losProbe(L.S, probe), losProbe(M.S, mulberry(rseed ^ 0x105)))

  // destruction: the same ops on both, aimed off the table as generated
  const plan = mulberry(rseed ^ 0xb1a57)
  const targets = L.S.chunks.filter((c) => c.destructible)
  const ops = []
  for (let k = 0; k < OPS && targets.length; k++) {
    const t = targets[Math.floor(plan() * targets.length)].shape
    const x = t.x + (plan() - 0.5) * 2, z = t.z + (plan() - 0.5) * 2
    if (plan() < 0.7) ops.push({ blast: [x, z, [1.6, 2.4, 2.6, 3][Math.floor(plan() * 4)], 1 + Math.floor(plan() * 4), { acid: plan() < 0.3 }] })
    else ops.push({ smash: [x, z, plan() * Math.PI * 2, 0.95] })
  }
  for (const [n, op] of ops.entries()) {
    const w = `${where} op ${n + 1} (${op.blast ? `blast r${op.blast[2]} dmg${op.blast[3]}${op.blast[4].acid ? ' acid' : ''}` : 'smash'})`
    const run = async (s) => {
      const before = s.S.chunks.length
      s.fx.log.length = 0
      Math.random = mulberry(rseed + n + 1)
      let broke = null
      if (op.blast) broke = s.S.blast(...op.blast)
      else {
        const [x0, z0, dir, r] = op.smash
        // a short walk through the target, sampled every 0.25"
        for (let d = 0; d <= 2; d += 0.25) smash(s.S, x0 - Math.sin(dir) * (1 - d), z0 - Math.cos(dir) * (1 - d), dir, r)
      }
      const dirty = s.S.dirty
      await settle(s.code)
      return { broke, dirty, added: s.S.chunks.slice(before), fx: s.fx.log.slice() }
    }
    const a = await run(L), b = await run(M)
    sameChunks(w, L.S.chunks, M.S.chunks)
    same(`${w} dirty`, a.dirty, b.dirty)
    if (a.broke) same(`${w} broken`, a.broke.map((c) => L.S.chunks.indexOf(c)).join(), b.broke.map((c) => M.S.chunks.indexOf(c)).join())
    deep(`${w} fx calls`, a.fx, b.fx)
    stats.ops++
    stats.broke += a.broke?.length ?? 0
    for (const c of a.added) {
      if (c.kind === 'rubble') stats.rubble++
      if (c.kind !== 'log') continue
      stats.logs++
      if (op.smash && !c.alive) stats.freshLogSmashed++
      if (op.blast && c.hp === c.maxHp && distToBox(op.blast[0], 0.5, op.blast[1], c.shape) <= op.blast[2]) stats.logSparedByBlast++
    }
  }
  if (ops.length) {
    sameObject(`${where} scenery group after destruction`, L.S.group, M.S.group, share)
    deep(`${where} los after destruction`, losProbe(L.S, mulberry(rseed ^ 0x106)), losProbe(M.S, mulberry(rseed ^ 0x106)))
  }
}

const t0 = Date.now()
let failedSeeds = 0, boards = 0
for (let seed = lo; seed <= hi; seed++) {
  boards++
  try {
    await board(seed)
  } catch (e) {
    Math.random = realRandom
    globalThis.__layoutDraws = null
    if (!(e instanceof Stop)) throw e
    failedSeeds++
  }
}
Math.random = realRandom

console.log(`P-terrain: boards ${lo}-${hi}, R0 code ${LEGACY_REF.slice(0, 9)} against the working tree (${((Date.now() - t0) / 1000).toFixed(1)} s)`)
console.log(`  ${stats.chunks} chunks and ${stats.meshes} scene objects built; ${stats.streams} layout streams, ${stats.draws} draws`)
console.log(`  pieces: ${Object.entries(pieces).map(([k, n]) => `${k} ${n}`).join(', ')}`)
console.log(`  ${stats.ops} destruction ops: ${stats.broke} chunks broken by blasts, ${stats.rubble} rubble piles, ${stats.logs} fallen logs (${stats.freshLogSmashed} smashed in the same sweep that felled them, ${stats.logSparedByBlast} in range of the blast that felled them and spared)`)
if (failedSeeds) {
  console.log(`MISMATCH on ${failedSeeds} board(s):`)
  for (const s of shown) console.log(`  ${s}`)
  process.exit(1)
}
// a run that compared nothing is not a pass
if (!boards || !stats.chunks) {
  console.log(`terrain-check: VACUOUS: ${boards} board(s), ${stats.chunks} chunks compared`)
  process.exit(2)
}
if (OPS > 0 && !stats.ops) {
  console.log(`terrain-check: VACUOUS: --ops ${OPS} but no destruction op ran`)
  process.exit(2)
}
console.log(`all ${boards} board${boards === 1 ? '' : 's'} identical: layout draws, chunks, looks against the old meshes, destruction, line of sight`)
