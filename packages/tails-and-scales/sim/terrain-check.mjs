// P-terrain (DESIGN §4 R3, R4): the split terrain builds the battlefield the
// old one did. For every board seed it builds the table twice, with the R0
// code's scenery.js (sim/lib.mjs's LEGACY_REF, a fixed commit; it imports
// three.js for real and gets a no-op fx that records its calls) and with the
// working tree's Terrain (core/terrain/terrain.js) and TerrainView
// (view/terrain.js), driven as main.js drives them: each terrain call
// reports into an out array, and straight after the call each report is
// folded into a mirror (present/mirror.js) and applied to the view, in order
// (main.js's EventPlayer). It requires, exactly (Object.is on every number,
// no tolerance):
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
//     and wrecker sweeps that walk the live chunk list (the working tree's
//     through core/actions/move.js's smashAround itself, the R0 side
//     through a restatement of its main.js's), with the tweens stepped to
//     the end and Math.random seeded alike on both sides: after every one,
//     the chunks (the rubble and logs they make included), what blast
//     returns, `dirty`, every fx call and, at the end, the whole scenery
//     group (rubble pieces, fallen logs, collapsed blocks), plus
//     line-of-sight queries before and after;
//  5. (R7) the snap's views: a table built from the chunks as they stand
//     (TerrainView.sync, what a snap builds) is the table the events built,
//     on the fresh table and after the destruction: every chunk shown or
//     not alike, every shown one's mesh where it stands (to within 1e-9: a
//     dropped block's tween ends a bounce's rounding off its height) and the
//     same mesh (type, shape, children, geometry, material), but for what is
//     cosmetic (a scuffed chunk's darker colour, a rubble pile's pieces,
//     strewn at random). So is a table synced on the fresh table and synced
//     again after the destruction (sync's keeping path: what still shows its
//     chunk kept, the rest taken off and built), and the table the events
//     built, synced, keeps every mesh it shows. A table cleared and its
//     board added again takes every mesh back untouched (a battle started on
//     the table the title showed builds nothing). And a table synced to the
//     wrecked chunks (fresh, and the one synced before and again after),
//     cleared and its board added again, shows the board as a fresh sync
//     does: an add takes back no broken chunk's empty item, and no block
//     a sync set lower at the height it dropped to. And (R7a's fixer,
//     round 3) every terrain.add's def, as it is played, is exactly the
//     view's defOf of its chunk (view/terrain.js keeps a copy of
//     core/terrain/terrain.js's, which core doesn't export: a sync builds
//     and keys the table by the copy, an add by the def the event carries,
//     so a field one has and the other lacks would part the two tables).
//
// One fx call is held to R5's rule rather than R0's own (DESIGN §2.3): the
// dust a dropped block raises when its fall ends. R0 read the block's place
// at that moment, so when a later collapse in the same blast or sweep had
// lowered it again, the dust came from the lower place; R5's view reads no
// live chunk and puts it where that drop left the block (the mirror as the
// collapse is played). sim/terrain-hooks.mjs makes the R0 code take its
// dust's height there too, as the drop happens (an edit in memory, like its
// draw counter), and counts the puffs that moved; every other number of
// every fx call is still R0's own.
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
// Until R4 it drove the working tree through R3's Scenery facade; R4 removed
// the facade, and the check now drives Terrain and TerrainView directly
// (Now, below). It is a standing check (DESIGN §1.1), not an R3-only one.
// The objectives the boards keep clear of, and the deployment depth, are
// the classic mission's (data/mission.js; core/match.js's OBJ_POS through
// R5), the objectives held to the R0 code's main.js.
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
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), '--seeds', MUTATIONS[name][3] ?? '1-25', '--max', '1'], { env: { ...process.env, TERRAIN_MUTATE: name }, encoding: 'utf8' })
    const caught = r.status === 1 && /MISMATCH/.test(r.stdout)
    if (!caught) missed++
    const first = r.stdout.split('\n').find((l) => l.startsWith('  seed')) ?? (r.stderr.trim().split('\n')[0] || `exit ${r.status}`)
    console.log(`  ${caught ? 'caught' : 'MISSED'} ${name.padEnd(17)} ${first.trim().slice(0, 150)}`)
  }
  // (F8b) the connectivity rows' controls: a wall of cells across the
  // centre line, and a ring round one objective, each planted in the grid
  // of every Field and Grand board, must fail a connectivity row (and the
  // classic part, untouched, still pass)
  for (const [control, want] of [['wall', /reaches no cell of seat/], ['ring', /controls no ground within/]]) {
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), '--seeds', '1-3', '--ops', '0', '--max', '1'], { env: { ...process.env, CONNECT_MUTATE: control }, encoding: 'utf8' })
    const caught = r.status === 1 && /MISMATCH: connectivity/.test(r.stdout) && want.test(r.stdout)
    if (!caught) missed++
    const first = r.stdout.split('\n').find((l) => l.startsWith('  connectivity')) ?? (r.stderr.trim().split('\n')[0] || `exit ${r.status}`)
    console.log(`  ${caught ? 'caught' : 'MISSED'} ${`connect-${control}`.padEnd(17)} ${first.trim().slice(0, 150)}`)
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
const { STYLES } = await imp(PKG, 'core/terrain/recipes.js')
const { BOARD } = await imp(PKG, 'core/rules.js')
const { hypot } = await imp(PKG, 'core/dmath.js')
const { distToBox } = await imp(PKG, 'core/terrain/geom.js')
const { Terrain } = await imp(PKG, 'core/terrain/terrain.js')
const { TerrainView, defOf: viewDefOf } = await imp(PKG, 'view/terrain.js')
const { blankMirror, applyEvent } = await imp(PKG, 'present/mirror.js')
const { smashAround } = await imp(PKG, 'core/actions/move.js')
const { MISSIONS } = await imp(PKG, 'data/mission.js')
const OBJ_POS = MISSIONS.classic.objectives
// (F8a) the board the classic mission chooses (the ruleset's BOARD)
const { W, H } = MISSIONS.classic.board

// The working tree's battlefield, driven as main.js drives it: the rules'
// Terrain reports each call's events into `out`, and straight after the
// call each is folded into the mirror and applied to the TerrainView, in
// order (main.js's EventPlayer). It offers what the R0 code's Scenery does,
// so one script runs both.
class Now {
  constructor(scene, fx) {
    this.view = new TerrainView(scene, fx)
    this.terrain = new Terrain(W, H)
    this.out = []
    this.mirror = blankMirror()
    // each add played, with the view's defOf of its chunk then (defCheck)
    this.adds = []
  }
  drain() {
    for (const e of this.out.splice(0)) {
      if (e.t === 'terrain.add') this.adds.push([e.def, viewDefOf(this.terrain.chunks.find((c) => c.id === e.def.id))])
      this.view.apply(e, applyEvent(this.mirror, e))
    }
  }
  get chunks() {
    return this.terrain.chunks
  }
  get features() {
    return this.terrain.features
  }
  get dirty() {
    return this.terrain.dirty
  }
  get group() {
    return this.view.group
  }
  generate(seed, objectives, deployDepth) {
    this.terrain.generate(seed, objectives, deployDepth, 'classic', this.out)
    this.drain()
  }
  los(a, b, ignoreR) {
    return this.terrain.los(a, b, ignoreR)
  }
  blast(x, z, r, dmg, opts) {
    const broke = this.terrain.blast(x, z, r, dmg, opts, this.out)
    this.drain()
    return broke
  }
  hurt(c, amount, from) {
    const broke = this.terrain.hurt(c, amount, from, this.out)
    this.drain()
    return broke
  }
}
const legacy = { ...(await imp(LEG, 'scenery.js')), ...(await imp(LEG, 'util.js')) }
legacy.make = (scene, fx) => new legacy.Scenery(scene, fx, W, H)
// One sample of a wrecker's walk, by a unit of radius r at (x, z) heading
// `dir`. The R0 side restates the R0 code's main.js smashAround (walking the
// live list; its table shake is main.js's, not the scenery's, so it is left
// out on both sides); the working tree's is core/actions/move.js's own,
// reporting into the out drained after it, as resolveWalk keeps a sample's
// events and the view plays them in order.
legacy.smash = (S, x, z, dir, r) => {
  for (const c of S.chunks) {
    if (!c.alive || !c.destructible) continue
    const s = c.nav || c.shape
    if (hypot(s.x - x, s.z - z) < r + Math.max(s.hx, s.hz) * 0.8) S.hurt(c, 99, { x: x - Math.sin(dir), z: z - Math.cos(dir) })
  }
}
const mine = { ...(await imp(PKG, 'view/clock.js')), make: (scene, fx) => new Now(scene, fx) }
mine.smash = (S, x, z, dir, r) => {
  smashAround({ terrain: S.terrain }, { r }, { x, z, dir }, S.out)
  S.drain()
}

// the objectives generate keeps clear of: the R0 code's, in its main.js
const OBJ_RE = /const OBJ_POS = (\[[^\]]*\])/
const objText = readFileSync(join(LEG, 'main.js'), 'utf8').match(OBJ_RE)?.[1]
if (!objText || JSON.stringify(new Function(`return ${objText}`)()) !== JSON.stringify(OBJ_POS)) {
  throw new Error("OBJ_POS: not found in the R0 code's main.js, or it differs from data/mission.js's classic objectives")
}

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
  const S = code.make(scene, fx.proxy)
  return { S, fx, code }
}
async function settle(code) {
  // every tween here ends inside 1 s of game time (a topple takes 0.9)
  for (let i = 0; i < 45; i++) {
    code.stepTweens(1 / 30)
    await new Promise((r) => setImmediate(r))
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

const stats = { defs: 0, chunks: 0, meshes: 0, draws: 0, streams: 0, ops: 0, broke: 0, logs: 0, freshLogSmashed: 0, logSparedByBlast: 0, rubble: 0, mirrorChunks: 0, synced: 0, syncedShown: 0, syncedDead: 0, syncedFallen: 0, syncedDropped: 0, reused: 0, replayed: 0, replayBroken: 0, replayLower: 0, replayTaken: 0 }

// 5. A table synced from the chunks as they stand against the one the events
// built (`now`, the working tree's side).
//
// Every add played since the last call: its def is the view's defOf of its
// chunk as the add was played, field for field (core's adds and the view's
// sync draw the same chunk).
function defCheck(where, now) {
  for (const [def, mine] of now.adds.splice(0)) {
    deep(`${where} chunk ${def.id}'s def (the add's | the view's defOf)`, def, mine)
    stats.defs++
  }
}
// The same for adds played straight from a generation's `out`.
function addsCheck(where, chunks, out) {
  for (const e of out) {
    if (e.t !== 'terrain.add') continue
    const c = chunks.find((x) => x.id === e.def.id)
    deep(`${where} chunk ${e.def.id}'s def (the add's | the view's defOf)`, e.def, c ? viewDefOf(c) : null)
    stats.defs++
  }
}
const near = (where, a, b) => Math.abs(a - b) <= 1e-9 || differ(where, a, b)
function sameMesh(where, a, b, colour) {
  same(`${where} type`, a.type, b.type)
  for (const k of ['visible', 'castShadow', 'receiveShadow']) same(`${where} ${k}`, a[k], b[k])
  vec(`${where} scale`, a.scale, b.scale)
  if (a.isMesh || b.isMesh) {
    sameGeometry(`${where} geometry`, a.geometry, b.geometry)
    for (const k of MAT) same(`${where} material.${k}`, a.material[k], b.material[k])
    if (colour) vec(`${where} material.color`, a.material.color, b.material.color, ['r', 'g', 'b'])
  }
  same(`${where} children`, a.children.length, b.children.length)
  a.children.forEach((c, i) => sameMesh(`${where}.children[${i}]`, c, b.children[i], colour))
}
// (tally: count what it compared in the sync stats; replayCheck's own don't)
function syncCheck(where, now, view = null, tally = true) {
  const fresh = view ?? new TerrainView(new THREE.Scene(), recorder().proxy)
  fresh.sync(now.terrain.chunks)
  const n = tally ? stats : {}
  for (const c of now.terrain.chunks) {
    const w = `${where} chunk ${c.id} (${c.look.piece})`
    const a = now.view.state(c.id), b = fresh.state(c.id)
    same(`${w} shown`, a.shown, b.shown)
    n.synced++
    if (!a.shown) {
      n.syncedDead++
      continue
    }
    n.syncedShown++
    if (c.look.piece === 'fallen') n.syncedFallen++
    if (c.shape.y !== now.view.items.get(c.id).c.shape.y) n.syncedDropped++
    for (const k of ['x', 'y', 'z']) near(`${w} ${k}`, a[k], b[k])
    a.q.forEach((x, i) => near(`${w} quaternion[${i}]`, x, b.q[i]))
    if (c.kind === 'rubble') continue
    const item = now.view.items.get(c.id)
    sameMesh(`${w} mesh`, item.obj, fresh.items.get(c.id).obj, !item.ownMat)
  }
  if (!view) fresh.dispose()
}
// The table the events built, synced to the chunks it shows: every mesh kept.
function keepCheck(where, now) {
  const before = new Map([...now.view.items].map(([id, it]) => [id, it.obj]))
  now.view.sync(now.terrain.chunks)
  for (const c of now.terrain.chunks) if (now.view.state(c.id).shown) same(`${where} chunk ${c.id} (${c.look.piece}) mesh kept`, now.view.items.get(c.id).obj === before.get(c.id), true)
}
// A table cleared and its board's adds played again: every mesh taken back.
function reuseCheck(where, now) {
  const before = new Map([...now.view.items].map(([id, it]) => [id, it.obj]))
  const out = []
  now.terrain.generate(now.seed, OBJ_POS, MISSIONS.classic.deploy, 'classic', out)
  addsCheck(where, now.terrain.chunks, out)
  for (const e of out) now.view.apply(e, applyEvent(now.mirror, e))
  for (const [id, obj] of before) same(`${where} chunk ${id} mesh kept`, now.view.items.get(id)?.obj === obj, true)
  same(`${where} items`, now.view.items.size, before.size)
  same(`${where} spares left`, now.view.spares.size, 0)
  stats.reused += before.size
}
// A table synced to the chunks after the destruction, then cleared and the
// board's adds played on it again (the next battle on this board starting on
// the table a snap drew): it shows the board as a table synced to it fresh
// does. Its spares are what the sync left: a broken chunk's item holds no
// mesh (an add must build that chunk, not take back nothing), and a block
// the sync set lower is no longer the def its add carries (an add must not
// take it back at the height it dropped to).
function replayCheck(where, view, seed) {
  const T = new Terrain(W, H), out = [], mirror = blankMirror()
  T.generate(seed, OBJ_POS, MISSIONS.classic.deploy, 'classic', out)
  addsCheck(where, T.chunks, out)
  // what the old table shows of the new one's chunks: broken, or lower
  const ref = new TerrainView(new THREE.Scene(), recorder().proxy)
  ref.sync(T.chunks)
  for (const c of T.chunks) {
    const a = view.state(c.id), b = ref.state(c.id)
    if (!a.shown) stats.replayBroken++
    else if (a.y !== b.y) stats.replayLower++
  }
  ref.dispose()
  const before = new Set([...view.items.values()].map((it) => it.obj).filter(Boolean))
  for (const e of out) view.apply(e, applyEvent(mirror, e))
  syncCheck(where, { terrain: T, view }, null, false)
  for (const c of T.chunks) if (before.has(view.items.get(c.id)?.obj)) stats.replayTaken++
  stats.replayed += T.chunks.length
}
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
  M.S.generate(seed, OBJ_POS, MISSIONS.classic.deploy)
  const drawsM = globalThis.__layoutDraws
  globalThis.__layoutDraws = null
  same(`${where} layout streams`, drawsL.length, drawsM.length)
  drawsL.forEach((d, i) => deep(`${where} layout stream ${i}`, d, drawsM[i]))
  stats.streams += drawsL.length
  stats.draws += drawsL.reduce((n, d) => n + d.n, 0)

  sameChunks(where, L.S.chunks, M.S.chunks)
  defCheck(where, M.S)
  deep(`${where} features`, L.S.features, M.S.features)
  same(`${where} dirty`, L.S.dirty, M.S.dirty)
  const share = { geo: sharing(), mat: sharing() }
  L.S.chunks.forEach((c, i) => sameObject(`${where} chunk ${i} (${c.kind}) mesh`, c.mesh, M.S.view.object(M.S.chunks[i].id), share))
  sameObject(`${where} scenery group`, L.S.group, M.S.group, share)
  stats.chunks += L.S.chunks.length
  for (const c of M.S.chunks) pieces[c.look.piece] = (pieces[c.look.piece] ?? 0) + 1
  stats.meshes += count(L.S.group)

  // the snap's views on the fresh table: synced from its chunks, and
  // cleared and added again
  M.S.seed = seed
  syncCheck(`${where} synced`, M.S)
  reuseCheck(`${where} cleared and added again`, M.S)
  // (a table synced now, synced again after the destruction)
  const stale = new TerrainView(new THREE.Scene(), recorder().proxy)
  stale.sync(M.S.terrain.chunks)

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
        for (let d = 0; d <= 2; d += 0.25) s.code.smash(s.S, x0 - Math.sin(dir) * (1 - d), z0 - Math.cos(dir) * (1 - d), dir, r)
      }
      const dirty = s.S.dirty
      await settle(s.code)
      return { broke, dirty, added: s.S.chunks.slice(before), fx: s.fx.log.slice() }
    }
    const a = await run(L), b = await run(M)
    sameChunks(w, L.S.chunks, M.S.chunks)
    defCheck(w, M.S)
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
  // the mirror the events folded into is the terrain as it stands
  for (const c of M.S.chunks) {
    const m = M.S.mirror.chunks[c.id]
    if (!m) differ(`${where} mirror chunk ${c.id}`, 'present', 'missing')
    same(`${where} mirror chunk ${c.id} alive`, c.alive, m.alive)
    same(`${where} mirror chunk ${c.id} y`, c.shape.y, m.y)
    stats.mirrorChunks++
  }
  same(`${where} mirror chunk count`, M.S.chunks.length, Object.keys(M.S.mirror.chunks).length)
  if (ops.length) {
    sameObject(`${where} scenery group after destruction`, L.S.group, M.S.group, share)
    deep(`${where} los after destruction`, losProbe(L.S, mulberry(rseed ^ 0x106)), losProbe(M.S, mulberry(rseed ^ 0x106)))
    syncCheck(`${where} synced after destruction`, M.S)
    syncCheck(`${where} synced before and again after destruction`, M.S, stale)
    keepCheck(`${where} the table the events built, synced`, M.S)
    // a table synced fresh to the wrecked chunks, and the one synced before
    // and again after, each cleared and its board added again
    const wrecked = new TerrainView(new THREE.Scene(), recorder().proxy)
    wrecked.sync(M.S.terrain.chunks)
    replayCheck(`${where} synced after destruction, cleared and added again`, wrecked, seed)
    wrecked.dispose()
    replayCheck(`${where} synced before and again after destruction, cleared and added again`, stale, seed)
  }
  stale.dispose()
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
console.log(`  ${globalThis.__fallsCut ?? 0} of ${globalThis.__fallsAll ?? 0} falls began while the block was still falling from an earlier drop in the same op, and fell on from there to its new rest (R7's rule, made of the R0 code too; R0 dropped it by the drop from where the earlier fall began, a level or more too high)`)
console.log(`  synced from the chunks as they stand, ${stats.synced} chunks matched the table the events built (${stats.syncedShown} shown, ${stats.syncedFallen} of them fallen logs and ${stats.syncedDropped} dropped blocks; ${stats.syncedDead} broken); a cleared table's ${stats.reused} meshes all taken back by its adds`)
console.log(`  synced after destruction, cleared and the board added again: ${stats.replayed} chunks as a fresh table shows them (${stats.replayBroken} broken on the old table, ${stats.replayLower} standing lower on it; ${stats.replayTaken} meshes taken back)`)
console.log(`  ${stats.defs} adds played, each one's def the view's defOf of its chunk (the copy sync builds and keys the table by)`)
console.log(`  the mirror the events folded into matched ${stats.mirrorChunks} chunks (standing, height); ${globalThis.__dustMoved ?? 0} of ${globalThis.__dustAll ?? 0} collapse dust puffs rise where their own drop left the block, not lower where a later drop in the same op took it (R5's rule; R0 read the place when the fall ended)`)
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

// ── Connectivity (F8b, DESIGN §4.2.3 and §4.2.9) ────────────────────────────
// Lanes are checked, not assumed: a footprint circle over-states some pieces
// and under-states none, so the scatter's `gap` alone neither proves nor
// rules out a lane. On every set a Field or Grand mission offers, on the
// same seeds (1-500 by default), each board built as newState builds it
// (core/terrain/terrain.js's generate on the mission's board, objectives and
// depth, then a NavGrid rebuilt from the chunks, as refreshNav does) and,
// from the standable ground cell nearest the middle of each seat's zone
// (|x| > W/2 − deploy), the rules' own reach (core/nav.js, mode 'walk',
// unbounded):
//  - a round hull disc (r HULL_R, 1.5", ground only) reaches a standable
//    cell in the other seat's zone;
//  - so does an r SQUAD_R (1.18", the largest squad's) disc, and it controls
//    every objective: it reaches a standable cell within OBJECTIVE_RANGE + r
//    of it (core/queries.js counts a model within OBJECTIVE_RANGE plus its
//    base; a disc of r holds its models).
// Every row must pass on every board: a failure names the mission, the set,
// the seed, the seat, the disc and the zone or objective it couldn't reach.
// The classic mission's boards are measured too and only reported (their
// lanes are the Skirmish's, frozen with its draws). It prints each board
// size's chunk counts (§4.2.3 expects 250-300 at Grand). Its controls
// (--self-test, below) plant a wall of cells across the centre line, and a
// ring of them round one objective, into the grid: each must fail a row.
// (F9b, F5b add a row per footprint: the hull on its lattice.)
const { NavGrid } = await imp(PKG, 'core/nav.js')
const { OBJECTIVE_RANGE } = await imp(PKG, 'core/rules.js')
const HULL_R = 1.5, SQUAD_R = 1.18
const CONTROL = process.env.CONNECT_MUTATE ?? null
const conn = { boards: 0, failed: 0, reaches: 0, chunks: {}, classic: { boards: 0, hull: 0, squad: 0, objectives: 0 } }
const connShown = []
const tn0 = Date.now()
// one board's rows: null when every row holds, else what failed
function connectBoard(name, m, set, seed) {
  const { W: BW, H: BH } = m.board
  const T = new Terrain(BW, BH)
  T.generate(seed, m.objectives, m.deploy, set, null)
  const nav = new NavGrid(BW, BH, 0.5)
  nav.rebuild(T.chunks)
  // (the controls: cells made unstandable in the grid, as a wall of scenery
  // would; never in a run that judges)
  const block = (pred) => {
    for (let i = 0; i < nav.N; i++) if (pred(nav.x(i), nav.z(i))) nav.clearAll[i] = nav.clearHard[i] = 0
  }
  if (CONTROL === 'wall') block((x) => Math.abs(x) < 1)
  if (CONTROL === 'ring') block((x, z) => { const d = hypot(x - m.objectives[1].x, z - m.objectives[1].z); return d > OBJECTIVE_RANGE + SQUAD_R + 0.5 && d < OBJECTIVE_RANGE + SQUAD_R + 4 })
  const edge = BW / 2 - m.deploy
  const why = []
  for (const seat of [0, 1]) {
    const sgn = seat ? 1 : -1, mid = sgn * (BW / 2 - m.deploy / 2)
    for (const r of [HULL_R, SQUAD_R]) {
      let start = -1, bd = Infinity
      for (let i = 0; i < nav.N; i++) {
        if (!(sgn * nav.x(i) > edge) || !nav.standable(i, r, 'walk')) continue
        const d = hypot(nav.x(i) - mid, nav.z(i))
        if (d < bd) [bd, start] = [d, i]
      }
      if (start < 0) {
        why.push(`seat ${seat}'s zone has no cell an r ${r} disc stands on`)
        continue
      }
      const res = nav.reach(nav.x(start), nav.z(start), { r, max: Infinity, mode: 'walk' })
      conn.reaches++
      let crossed = false
      for (let i = 0; i < nav.N && !crossed; i++) crossed = -sgn * nav.x(i) > edge && isFinite(res.dist[i])
      if (!crossed) why.push(`an r ${r} disc from seat ${seat}'s zone (${nav.x(start)}, ${nav.z(start)}) reaches no cell of seat ${1 - seat}'s`)
      if (r !== SQUAD_R) continue
      for (const o of m.objectives) {
        let held = false
        for (let i = 0; i < nav.N && !held; i++) held = isFinite(res.dist[i]) && hypot(nav.x(i) - o.x, nav.z(i) - o.z) <= OBJECTIVE_RANGE + r
        if (!held) why.push(`an r ${r} squad from seat ${seat}'s zone controls no ground within ${OBJECTIVE_RANGE + r}" of the objective at (${o.x}, ${o.z})`)
      }
    }
  }
  return { why, chunks: T.chunks.length }
}
for (const [name, m] of Object.entries(MISSIONS)) {
  for (const set of m.sets) {
    const key = `${name} on ${set}`
    const counts = []
    for (let seed = lo; seed <= hi; seed++) {
      let r
      try {
        r = connectBoard(name, m, set, seed)
      } catch (e) {
        r = { why: [`threw: ${e.stack.split('\n').slice(0, 3).join(' / ')}`], chunks: 0 }
      }
      counts.push(r.chunks)
      if (name === 'classic') {
        // (reported, never judged: the Skirmish's lanes are its frozen draws')
        const c = conn.classic
        c.boards++
        if (!r.why.some((w) => w.includes(`r ${HULL_R} disc`))) c.hull++
        if (!r.why.some((w) => w.includes(`r ${SQUAD_R} disc`))) c.squad++
        if (!r.why.some((w) => w.includes('objective'))) c.objectives++
        continue
      }
      conn.boards++
      if (r.why.length) {
        conn.failed++
        if (connShown.length < MAX) connShown.push(`connectivity ${key}, seed ${seed}: ${r.why.join('; ')}`)
      }
    }
    counts.sort((a, b) => a - b)
    conn.chunks[key] = `${counts[0]}-${counts[counts.length - 1]} (median ${counts[counts.length >> 1]}, mean ${(counts.reduce((a, b) => a + b, 0) / counts.length).toFixed(0)})`
  }
}
console.log(`\nconnectivity (F8b): ${conn.boards} Field and Grand boards, seeds ${lo}-${hi} (${((Date.now() - tn0) / 1000).toFixed(1)} s, ${conn.reaches} reaches): from each seat's zone a round hull (r ${HULL_R}, ground only) and a squad (r ${SQUAD_R}) cross to the other zone, and the squad controls every objective (within OBJECTIVE_RANGE + r, ${OBJECTIVE_RANGE + SQUAD_R}")${CONTROL ? ` [control: ${CONTROL}]` : ''}`)
for (const [key, c] of Object.entries(conn.chunks)) console.log(`  ${key}: chunks ${c}`)
const C = conn.classic
console.log(`  (reported, not judged) classic: the hull crosses on ${C.hull} of ${C.boards} boards, the squad on ${C.squad}, and controls every objective on ${C.objectives}`)
if (conn.failed) {
  console.log(`MISMATCH: connectivity failed on ${conn.failed} of ${conn.boards} board(s):`)
  for (const s of connShown) console.log(`  ${s}`)
  process.exit(1)
}
if (!conn.boards) {
  console.log('terrain-check: VACUOUS: no Field or Grand board checked for connectivity (no mission offers them?)')
  process.exit(2)
}
console.log(`every Field and Grand board connected: ${conn.boards} of ${conn.boards}`)

// ── Tiles (F8b, DESIGN §4.2.7's "Drawing at scale" 1) ──────────────────────
// The view's half of the larger boards. On a board larger than classic's
// the standing chunks are drawn by 8" tiles (view/terrain.js's tiling():
// one merged mesh per tile and material class, each chunk's own mesh kept
// but hidden). On every set a Field or Grand mission offers, on the first
// TILE_SEEDS seeds of the run, a board is generated as newState generates
// it and played, event by event and folded into a mirror, into a tiled
// TerrainView and an untiled one, which must agree:
//  - every tiled chunk's drawn shape and colour, vertex for vertex in world
//    space, is its own mesh's (tileCheck: none drawn by a tile it has left,
//    none hidden and untiled, none standing untouched and untiled);
//  - every chunk's state (shown or not, where its object stands) is the
//    untiled table's;
// on the fresh table, mid-destruction (blasts played, their tweens not yet
// stepped: each chunk they touched promoted out of its tile, the tiles
// merged again without it) and after it (every animation ended: back in
// their tiles); then on a tiled table synced from the chunks as they stand
// (the snap's), and on the event-built one with tiling turned off (back to
// classic: every chunk its own mesh again, no tile left). It prints the
// tiles and their draw calls per board (§4.2.7 expects about 70 tiles and
// 150 calls at Grand).
const TILE_SEEDS = Number(process.env.TILE_SEEDS ?? 12)
const tiles = { boards: 0, failed: 0, checks: 0, promoted: 0, rows: {} }
const tileShown = []
const tt0 = Date.now()
const tmine = { ...(await imp(PKG, 'view/clock.js')) }
// where two tables' chunks differ (shown, place, turn)
function sameStates(T, a, b) {
  const out = []
  for (const c of T.chunks) {
    const x = a.state(c.id), y = b.state(c.id)
    if (x.shown !== y.shown) out.push(`chunk ${c.id} (${c.kind}) shown ${x.shown} tiled, ${y.shown} untiled`)
    else if (x.shown && ['x', 'y', 'z'].some((k) => Math.abs(x[k] - y[k]) > 1e-9)) out.push(`chunk ${c.id} (${c.kind}) at (${x.x}, ${x.y}, ${x.z}) tiled, (${y.x}, ${y.y}, ${y.z}) untiled`)
  }
  return out
}
async function tileBoard(name, m, set, seed) {
  const { W: BW, H: BH } = m.board
  const T = new Terrain(BW, BH)
  const out = []
  const mirror = blankMirror()
  const tiled = new TerrainView(new THREE.Scene(), recorder().proxy)
  tiled.tiling(true)
  const plain = new TerrainView(new THREE.Scene(), recorder().proxy)
  const play = () => {
    for (const e of out.splice(0)) {
      const M = applyEvent(mirror, e)
      tiled.apply(e, M)
      plain.apply(e, M)
    }
  }
  const why = []
  const check = (when, view = tiled, ref = plain) => {
    const r = view.tileCheck()
    tiles.checks++
    for (const b of r.bad) why.push(`${when}: ${b}`)
    for (const d of sameStates(T, view, ref)) why.push(`${when}: ${d}`)
    return r
  }
  Math.random = mulberry(seed ^ 0x711e)
  T.generate(seed, m.objectives, m.deploy, set, out)
  play()
  await Promise.resolve()
  const fresh = check('fresh')
  // blasts on the destructible chunks, checked as they play and once settled
  const plan = mulberry(seed ^ 0xb1a57)
  const targets = T.chunks.filter((c) => c.destructible)
  for (let k = 0; k < 4 && targets.length; k++) {
    const t = targets[Math.floor(plan() * targets.length)].shape
    T.blast(t.x + (plan() - 0.5) * 2, t.z + (plan() - 0.5) * 2, [1.6, 2.4, 3][Math.floor(plan() * 3)], 1 + Math.floor(plan() * 4), { acid: plan() < 0.3 }, out)
    play()
    tiles.promoted += [...tiled.items.values()].filter((it) => it.anims > 0).length
    check(`blast ${k + 1}, playing`)
  }
  await settle(tmine)
  check('blasts settled')
  // a snap's table, tiled, synced from the chunks as they stand
  const synced = new TerrainView(new THREE.Scene(), recorder().proxy)
  synced.tiling(true)
  synced.sync(T.chunks)
  check('synced', synced, plain)
  // back to an untiled table: every chunk its own mesh again
  tiled.tiling(false)
  const off = tiled.tileCheck()
  if (off.tiles || off.meshes || off.tiled) why.push(`tiling off: ${off.tiles} tiles and ${off.meshes} meshes left`)
  for (const b of off.bad) why.push(`tiling off: ${b}`)
  for (const d of sameStates(T, tiled, plain)) why.push(`tiling off: ${d}`)
  for (const v of [tiled, plain, synced]) v.dispose()
  return { why, chunks: T.chunks.length, tiles: fresh.tiles, meshes: fresh.meshes }
}
for (const [name, m] of Object.entries(MISSIONS)) {
  if (m.board.W * m.board.H <= W * H) continue
  for (const set of m.sets) {
    const key = `${name} on ${set}`, row = (tiles.rows[key] = { tiles: [], meshes: [], chunks: [] })
    for (let seed = lo; seed <= Math.min(hi, lo + TILE_SEEDS - 1); seed++) {
      let r
      try {
        r = await tileBoard(name, m, set, seed)
      } catch (e) {
        r = { why: [`threw: ${e.stack.split('\n').slice(0, 3).join(' / ')}`], tiles: 0, meshes: 0, chunks: 0 }
      }
      tiles.boards++
      row.tiles.push(r.tiles)
      row.meshes.push(r.meshes)
      row.chunks.push(r.chunks)
      if (r.why.length) {
        tiles.failed++
        if (tileShown.length < MAX) tileShown.push(`tiles ${key}, seed ${seed}: ${r.why.slice(0, 3).join('; ')}${r.why.length > 3 ? ` (and ${r.why.length - 3} more)` : ''}`)
      }
    }
  }
}
Math.random = realRandom
const span = (a) => `${Math.min(...a)}-${Math.max(...a)} (mean ${(a.reduce((x, y) => x + y, 0) / a.length).toFixed(0)})`
console.log(`\ntiles (F8b): ${tiles.boards} Field and Grand boards, seeds ${lo}-${Math.min(hi, lo + TILE_SEEDS - 1)} (${((Date.now() - tt0) / 1000).toFixed(1)} s, ${tiles.checks} checks, ${tiles.promoted} chunks promoted out of their tiles mid-blast): every tiled chunk drawn as its own mesh, vertex for vertex and in its colour, the tiled table's chunks the untiled one's, fresh, mid-blast, settled, synced and untiled again`)
for (const [key, r] of Object.entries(tiles.rows)) console.log(`  ${key}: ${span(r.chunks)} chunks in ${span(r.tiles)} tiles, ${span(r.meshes)} draw calls`)
if (tiles.failed) {
  console.log(`MISMATCH: tiles failed on ${tiles.failed} of ${tiles.boards} board(s):`)
  for (const s of tileShown) console.log(`  ${s}`)
  process.exit(1)
}
if (!tiles.boards) {
  console.log('terrain-check: VACUOUS: no Field or Grand board tiled (no mission larger than classic?)')
  process.exit(2)
}
console.log(`every Field and Grand board's tiles drawn as their chunks: ${tiles.boards} of ${tiles.boards}`)
