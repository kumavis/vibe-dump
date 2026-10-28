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
//  6. (F7a, DESIGN §4.2.4) the `fortified` set, on the same seeds, on the
//     Skirmish board (the classic mission's 40×28, its objectives and zones),
//     (the merged build's gate) the field mission's (60×40, zones 12", seven
//     objectives) and the grand mission's (data/mission.js: 80×56, zones
//     14", nine objectives; until the merged build's gate, the Grand
//     fixture's copy of the same table, sim/fixtures/grand.mjs, retired
//     since), each board built as a match builds it, by the working tree's
//     Terrain alone
//     (there is no R0 code to hold it to): every board built twice, with
//     Math.random made to throw, gives the same adds (every def, its look and
//     its height fields) and the same footprints, so every look is made of
//     recorded draws; every add's def carries the chunk's surface, link,
//     base, supports, fallsAt and on as the chunk has them, and nothing it
//     lacks; every deck, stair, ladder and post is exactly point-symmetric
//     with its partner (the copy's place the negation of the first's, bit
//     for bit, its yaw the first's plus π, its surface, look and size the
//     same, its link's foot and top negated, its supports and deck its
//     partner's), the keep and the keep's deck their own, and every other
//     chunk symmetric within 1e-9; every such piece lies inside the footprint
//     of the fortification it belongs to (each corner, each link's foot and
//     each stair's gate within its radius), and every fortification placed
//     has its pieces; the works' decks have their front face on the zone's
//     edge and their ladders' feet 2.25" out; facing pieces face the other
//     zone (±0.3) and the keep's stairs the zones (±0.2). Over 100 boards or
//     more it also judges the rates against DESIGN's measurements (§4.2.4,
//     the prototype's seeds 1-200): the works on ≥ 95% of boards, the keep on
//     45-55%, and the fort pairs besides the works per board (Skirmish 0-1,
//     on average under 0.5; Field at most the 3 the rule can want there, on
//     average 0.5-1.0; Grand at least 2 and at most the 7 the rule can
//     want there, on average 3.5-4.5). Fewer boards than that make a rate
//     noise: it prints them and judges only the exact rows. And the view of
//     every such board (TerrainView: its decks, stairs, ladders and posts
//     drawn from their looks): each add's def is the view's defOf of its
//     chunk, height fields and all (the view's list of them held to core's),
//     a table synced from the chunks is the table the adds built (5.'s
//     rows), the walkable tops it lists (the overlay's tints, the picker's
//     quads) are exactly the chunks with a surface, and the board's adds
//     played again take back every mesh.
//  (7, P-climb and the lob rows, and the connectivity and tiles rows, say
//  what they hold where they stand below.)
//  8. (F19a) the powder keg: the keg set's boards (one keg, at the centre
//     exactly, the board built alike twice and point-symmetric, the view's
//     defs and sync, the keg gone once broken, the keg mission's objectives
//     inside its blast), its hit points against every template (broken
//     exactly where blast's model reaches them, scuffed short of it) and a
//     wrecker's smash, and two kegs under a third's blast broken in chunk
//     order (the section's own comment, below, says each row). The keg
//     mission, a Skirmish, is reported beside classic in the connectivity
//     rows, never judged.
//  9. (V3d, DESIGN §4.2.11) the Powder Field: the powder mission's boards
//     (80×56, its seven objectives, zones 14"), on --powder-seeds (the
//     run's seeds when not given), held to section 6's rows as a fortified
//     board is (built twice alike with Math.random throwing, every add's
//     def the view's defOf, every deck, stair, ladder and post exactly
//     point-mirrored, the farmstead's deck its own mirror, every other chunk
//     within 1e-9, every piece inside the footprint of the wreck it belongs
//     to, the view's sync, walkable tops and meshes taken back) and to
//     section 7's P-climb (every wreck's deck reached by a climber from
//     seat 0's zone, the stair wrecks' (the farmstead, farms, trebuchets,
//     engines) by big walkers and the ladder-only ones' (barns, wagons) by
//     none, every ladder climbed over its link and every stair walked up
//     from its gate, every top holding a climber and the fliers, the floor
//     and links exactly point-symmetric, the lob rows on every deck); and to
//     its own: every site on its objective (a wreck's deck centred on it,
//     the objective's floor its top's; a magazine's kegs round it, none
//     nearer than 2.3"), no keg in a deployment zone, every keg a keg in
//     its rules (the keg's hit points, soft, no sight or cover), and its
//     chains: which kegs each keg's own blast breaks (Terrain.blastDamage
//     at its place, its profile: what kegsGoOff sets off), each magazine's
//     kegs one chain, the chains' sizes printed. Its connectivity rows run
//     with the rest's, below, on the same --powder-seeds (2,000 boards:
//     `--powder-seeds 1-2000`).
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
//   node sim/terrain-check.mjs [--seeds 1-500 | 42] [--ops 8] [--max 10] [--powder-seeds 1-2000]
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
  ({ values: args } = parseArgs({ options: { seeds: { type: 'string' }, 'powder-seeds': { type: 'string' }, ops: { type: 'string' }, max: { type: 'string' }, 'self-test': { type: 'boolean' } } }))
} catch (e) {
  usage(e.message)
}

if (args['self-test']) {
  const { MUTATIONS } = await import('./terrain-hooks.mjs')
  let missed = 0
  for (const name of Object.keys(MUTATIONS)) {
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), '--seeds', MUTATIONS[name][3] ?? '1-25', '--max', '1'], { env: { ...process.env, TERRAIN_MUTATE: name }, encoding: 'utf8' })
    // ((the WIP merge's follow-up) a row of its own: no edit is the
    // connectivity rows', and while they fail on the tower ring's boards
    // every run prints their MISMATCH whatever it breaks)
    const caught = r.status === 1 && /^MISMATCH(?!: connectivity)/m.test(r.stdout)
    if (!caught) missed++
    const first = r.stdout.split('\n').find((l) => l.startsWith('  seed')) ?? (r.stderr.trim().split('\n')[0] || `exit ${r.status}`)
    console.log(`  ${caught ? 'caught' : 'MISSED'} ${name.padEnd(17)} ${first.trim().slice(0, 150)}`)
  }
  // (F8b) the connectivity rows' controls: a wall of cells across the
  // centre line, and a ring round one objective, each planted in the grid
  // of every Field and Grand board, must fail a connectivity row (and the
  // classic part, untouched, still pass). ((the WIP merge's follow-up) On
  // seeds 7-9, boards with no tower ring at the centre, which pass without
  // the control: seeds 1-3 all stand one on `fortified`, which fails a row
  // by itself)
  for (const [control, want] of [['wall', /reaches no cell of seat/], ['ring', /controls no cell within/]]) {
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), '--seeds', '7-9', '--ops', '0', '--max', '1'], { env: { ...process.env, CONNECT_MUTATE: control }, encoding: 'utf8' })
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
  // (a match of just the terrain: a board with no height layer, F7a's
  // smash test skipped as on every classic board)
  smashAround({ terrain: S.terrain, nav: { hasHeight: false } }, { r }, { x, z, dir }, S.out)
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
// ((V3d) the Powder Field's seeds: the run's, or --powder-seeds A-B)
const prange = /^(\d+)(?:-(\d+))?$/.exec(args['powder-seeds'] ?? `${lo}-${hi}`) ?? usage(`--powder-seeds ${args['powder-seeds']}: give N or A-B`)
const plo = Number(prange[1]), phi = Number(prange[2] ?? prange[1])
if (plo > phi) usage(`--powder-seeds ${args['powder-seeds']}: ${plo} is above ${phi}`)
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
// (what the two sides are called: the R0 code's and the working tree's, or
// in section 6, where there is no R0 code, what a row wants and what it got)
let sides = ['R0', 'now']
function differ(where, a, b) {
  mismatches++
  if (shown.length < MAX) shown.push(`${where}: ${sides[0]} ${fmt(a)} | ${sides[1]} ${fmt(b)}`)
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

// ── 6. The fortified set (F7a) ──────────────────────────────────────────────
// (the grand mission's table: its board, zones and objectives, as
// core/match.js scatters a Grand battle's terrain around them)
const GRAND = MISSIONS.grand
const { SETS } = await imp(PKG, 'core/terrain/sets.js')
const { FOOTPRINT, GATE_OUT, LADDER_OUT } = await imp(PKG, 'core/terrain/recipes.js')
// the height fields an add's def carries where its chunk has them (DESIGN
// §4.2.4's terrain.add), named here and held to core's list, so an edit that
// drops one from core's list alike is a difference, not a pass
const HEIGHT = ['surface', 'link', 'base', 'supports', 'fallsAt', 'on']
const { HEIGHT_FIELDS } = await imp(PKG, 'core/terrain/terrain.js')
// (and the view's copy of that list, which its defOf carries: view/terrain.js
// can't import core's, terrain.js being no door of the core's)
const { HEIGHT_FIELDS: VIEW_HEIGHT } = await imp(PKG, 'view/terrain.js')
const { sin: dsin, cos: dcos } = await imp(PKG, 'core/dmath.js')
const FORT_PIECES = new Set(['deck', 'stair', 'ladder', 'post'])
const FACING = new Set(SETS.fortified.facing)
const FORT_BOARDS = [
  { label: 'Skirmish', W, H, deploy: MISSIONS.classic.deploy, objectives: OBJ_POS, pairs: [0, 1], avg: [0, 0.5] },
  // (s = 4 there: forts [1, 1] want 4 + a draw below 4, so 7 at most)
  // ((the merged build's gate) the field mission's table too, as §4.2.9's
  // P-climb runs on every mission: s = 60·40/1120 ≈ 2.14, so the rule asks
  // for 2 + a draw below 2 pairs, 3 at most; on seeds 1-500 0 / 0.73 / 2,
  // so judged on average 0.5-1.0, as the Grand row is about its own)
  { label: 'Field', W: MISSIONS.field.board.W, H: MISSIONS.field.board.H, deploy: MISSIONS.field.deploy, objectives: MISSIONS.field.objectives, pairs: [0, 3], avg: [0.5, 1.0] },
  { label: 'Grand', W: GRAND.board.W, H: GRAND.board.H, deploy: GRAND.deploy, objectives: GRAND.objectives, pairs: [2, 7], avg: [3.5, 4.5] },
]
// a yaw's distance from another, the turn between them folded into [0, π]
const turn = (a, b) => {
  const d = Math.abs(a - b) % (2 * Math.PI)
  return d > Math.PI ? 2 * Math.PI - d : d
}
const fort = { boards: 0, failed: 0, chunks: 0, pieces: {}, links: 0, surfaces: 0, pairs: 0, selfPairs: 0, others: 0, defs: 0, viewed: 0, synced: 0, tops: 0, taken: 0 }
const fortRows = []
// a board, built twice; the differences thrown as `differ` does
function fortBoard(B, seed) {
  const where = `${B.set ?? 'fortified'} ${B.label} seed ${seed}`
  const build = () => {
    const T = new Terrain(B.W, B.H), out = []
    const random = Math.random, STUB = Symbol('Math.random')
    Math.random = () => {
      // (made here, so its stack names the caller)
      throw Object.assign(new Error('Math.random'), { [STUB]: true })
    }
    try {
      // ((V3d) a board's set: fortified's, or the Powder Field's)
      T.generate(seed, B.objectives, B.deploy, B.set ?? 'fortified', out)
    } catch (e) {
      if (!e?.[STUB]) throw e
      differ(`${where}: the build's draws (a look is made of the layout stream's recorded draws)`, 'none from Math.random', `Math.random called: ${e.stack.split('\n')[2]?.trim()}`)
    } finally {
      Math.random = random
    }
    return { T, out }
  }
  const a = build(), b = build()
  same(`${where} adds (built twice)`, a.out.length, b.out.length)
  a.out.forEach((e, i) => deep(`${where} add ${i} (built twice)`, e, b.out[i]))
  deep(`${where} footprints (built twice)`, a.T.features, b.T.features)
  const { T, out } = a
  const chunks = T.chunks
  fort.chunks += chunks.length
  // every add's def: the chunk's place and look, and its height fields as
  // the chunk has them
  for (const e of out) {
    if (e.t !== 'terrain.add') continue
    const c = chunks.find((x) => x.id === e.def.id)
    const want = { id: c.id, kind: c.kind, shape: { ...c.shape }, look: c.look }
    for (const k of HEIGHT) if (c[k] !== undefined) want[k] = c[k]
    deep(`${where} chunk ${c.id} (${c.kind})'s def`, want, e.def)
    // (and the view's defOf of it, which a snap's sync builds and keys by)
    deep(`${where} chunk ${c.id} (${c.kind})'s def (the add's | the view's defOf)`, e.def, viewDefOf(c))
    fort.defs++
  }
  fortView(where, T, out)
  // the point mirror
  const key = (kind, x, z) => `${kind}:${x}:${z}`
  const byPlace = new Map()
  for (const c of chunks) if (FORT_PIECES.has(c.kind)) byPlace.set(key(c.kind, c.shape.x, c.shape.z), c)
  const partner = new Map()
  for (const c of chunks) {
    if (!FORT_PIECES.has(c.kind)) continue
    fort.pieces[c.kind] = (fort.pieces[c.kind] ?? 0) + 1
    if (c.surface) fort.surfaces++
    if (c.link) fort.links++
    const m = byPlace.get(key(c.kind, -c.shape.x, -c.shape.z))
    const w = `${where} ${c.look.recipe}'s ${c.kind} ${c.id} at (${c.shape.x}, ${c.shape.z})`
    if (!m) differ(`${w}: its point mirror`, 'a piece at its negation', 'none')
    partner.set(c.id, m.id)
  }
  for (const c of chunks) {
    if (!FORT_PIECES.has(c.kind)) continue
    const m = chunks.find((x) => x.id === partner.get(c.id))
    const w = `${where} ${c.look.recipe}'s ${c.kind} ${c.id} and its mirror ${m.id}`
    if (m === c) {
      // (only a deck at the centre may be its own: a box turned by π is the
      // same box, and a deck's top has no way up or down)
      if (c.kind !== 'deck') differ(`${w}: its own mirror`, 'a deck', c.kind)
      fort.selfPairs++
      continue
    }
    if (c.id < m.id) {
      fort.pairs++
      same(`${w}: yaw + π`, c.shape.yaw + Math.PI, m.shape.yaw)
    }
    for (const k of ['y', 'hx', 'hy', 'hz']) same(`${w}: shape.${k}`, c.shape[k], m.shape[k])
    deep(`${w}: surface`, c.surface, m.surface)
    deep(`${w}: look`, c.look, m.look)
    same(`${w}: base`, c.base, m.base)
    same(`${w}: fallsAt`, c.fallsAt, m.fallsAt)
    if (c.link || m.link) {
      if (!c.link || !m.link) differ(`${w}: link`, !!c.link, !!m.link)
      for (const end of ['foot', 'top']) for (const k of ['x', 'z']) same(`${w}: link.${end}.${k} negated`, -c.link[end][k], m.link[end][k])
      same(`${w}: link.h`, c.link.h, m.link.h)
    }
    same(`${w}: supports, its partners`, (c.supports ?? []).map((id) => partner.get(id)).join(), (m.supports ?? []).join())
    same(`${w}: its deck, its partner`, c.on === undefined ? undefined : partner.get(c.on), m.on)
  }
  // every other chunk: a partner of its kind at its negation, within 1e-9
  for (const c of chunks) {
    if (FORT_PIECES.has(c.kind)) continue
    const m = chunks.find((x) => x.kind === c.kind && Math.abs(x.shape.x + c.shape.x) <= 1e-9 && Math.abs(x.shape.z + c.shape.z) <= 1e-9 &&
      Math.abs(x.shape.hx - c.shape.hx) <= 1e-9 && Math.abs(x.shape.hz - c.shape.hz) <= 1e-9 && Math.abs(x.shape.y - c.shape.y) <= 1e-9)
    if (!m) differ(`${where} ${c.kind} ${c.id} at (${c.shape.x}, ${c.shape.z}): its point mirror within 1e-9`, 'a chunk of its kind and size', 'none')
    fort.others++
  }
  // every piece inside the footprint of the fortification it belongs to
  const forts = T.features.filter((f) => f.fort)
  const held = new Map(forts.map((f) => [f, 0]))
  for (const c of chunks) {
    if (!FORT_PIECES.has(c.kind)) continue
    const s = c.shape
    const pts = corners(s)
    if (c.link) pts.push([c.link.foot.x, c.link.foot.z])
    // (a stair's gate: GATE_OUT past its foot, the low end of its own x)
    if (c.kind === 'stair') pts.push([s.x - (s.hx + GATE_OUT) * dcos(s.yaw), s.z + (s.hx + GATE_OUT) * dsin(s.yaw)])
    const f = forts.find((f) => pts.every(([x, z]) => hypot(x - f.x, z - f.z) <= f.r + 1e-9))
    if (!f) differ(`${where} ${c.look.recipe}'s ${c.kind} ${c.id}: inside a footprint`, 'every corner, foot and gate inside one', JSON.stringify(pts.map((p) => p.map((v) => +v.toFixed(3)))))
    if (f.fort !== c.look.recipe) differ(`${where} ${c.kind} ${c.id}: the fortification whose footprint holds it`, c.look.recipe, f.fort)
    held.set(f, held.get(f) + 1)
    if (c.kind !== 'deck') continue
    if (f.works !== undefined) {
      // the works: the front face on the zone's edge, the deck inside it
      const xs = pts.slice(0, 4).map(([x]) => (f.works === 0 ? x : -x))
      const edge = -B.W / 2 + B.deploy
      if (Math.abs(Math.max(...xs) - edge) > 1e-9) differ(`${where} works ${f.works}'s deck: its front face on the zone's edge`, edge, Math.max(...xs))
      if (Math.abs(Math.min(...xs) - (edge - c.look.d)) > 1e-9) differ(`${where} works ${f.works}'s deck: inside the zone`, edge - c.look.d, Math.min(...xs))
    }
    if (FACING.has(f.fort)) {
      const want = f.x < 0 ? -Math.PI / 2 : Math.PI / 2
      if (turn(s.yaw, want) > (f.works !== undefined ? 1e-12 : 0.3 + 1e-12)) differ(`${where} ${f.fort} at (${f.x.toFixed(2)}, ${f.z.toFixed(2)}): its front toward the other zone`, want, s.yaw)
    }
    if (f.fort === 'keep' && turn(s.yaw, 0) > 0.2 + 1e-12 && turn(s.yaw, Math.PI) > 0.2 + 1e-12) differ(`${where} the keep: its stairs toward the zones`, '|yaw| ≤ 0.2', s.yaw)
  }
  for (const c of chunks) {
    if (c.kind !== 'ladder') continue
    const f = forts.find((f) => hypot(c.link.foot.x - f.x, c.link.foot.z - f.z) <= f.r)
    if (f.works === undefined) continue
    const x = f.works === 0 ? c.link.foot.x : -c.link.foot.x
    if (Math.abs(x - (-B.W / 2 + B.deploy + LADDER_OUT)) > 1e-9) differ(`${where} works ${f.works}'s ladder: its foot ${LADDER_OUT}" out from the zone`, -B.W / 2 + B.deploy + LADDER_OUT, x)
  }
  // ((V3d) but a magazine, a site with no deck: its kegs are features')
  for (const [f, n] of held) if (!n && f.fort !== 'magazine') differ(`${where} the ${f.fort} at (${f.x.toFixed(2)}, ${f.z.toFixed(2)}): its pieces`, 'some', 'none')
  for (const f of forts) if (f.r !== FOOTPRINT[f.fort]) differ(`${where} the ${f.fort}'s footprint`, FOOTPRINT[f.fort], f.r)
  return {
    T,
    works: forts.some((f) => f.works === 0) && forts.some((f) => f.works === 1),
    keep: forts.some((f) => f.fort === 'keep'),
    pairs: forts.filter((f) => f.works === undefined && f.fort !== 'keep').length / 2,
    kinds: forts.filter((f) => f.works === undefined && f.fort !== 'keep').map((f) => f.fort),
    chunks: chunks.length,
  }
}
// The view of a fortified board (TerrainView, view/terrain.js): its adds
// played into a table as the player plays them; a table synced from the
// chunks is that table (syncCheck: every chunk shown alike, every mesh where
// it stands and the same mesh); the walkable tops it lists (surfaces, and the
// picker's quads on them, tops) are exactly the chunks with a surface, one
// quad each; and the table cleared and its adds played again takes every
// mesh back (a battle started on the title's fortified table builds nothing).
function fortView(where, T, out) {
  const view = new TerrainView(new THREE.Scene(), recorder().proxy), mirror = blankMirror()
  for (const e of out) view.apply(e, applyEvent(mirror, e))
  syncCheck(`${where} synced`, { terrain: T, view }, null, false)
  fort.synced += T.chunks.length
  const want = T.chunks.filter((c) => c.surface).map((c) => c.id).join()
  same(`${where} the view's walkable tops (surfaces)`, want, view.surfaces().map((c) => c.id).join())
  same(`${where} the picker's quads on them (tops)`, T.chunks.filter((c) => c.surface).length, view.tops().length)
  fort.tops += view.tops().length
  const before = new Map([...view.items].map(([id, it]) => [id, it.obj]))
  for (const e of out) view.apply(e, applyEvent(mirror, e))
  for (const [id, obj] of before) same(`${where} chunk ${id} mesh taken back (cleared and added again)`, true, view.items.get(id)?.obj === obj)
  same(`${where} spares left (cleared and added again)`, 0, view.spares.size)
  fort.taken += before.size
  fort.viewed++
  view.dispose()
}
// (the corners of a box on the table, as core/terrain/geom.js measures them)
const { corners } = await imp(PKG, 'core/terrain/geom.js')
const tf0 = Date.now()
sides = ['want', 'got']
try {
  same("core's HEIGHT_FIELDS (core/terrain/terrain.js)", HEIGHT.join(), HEIGHT_FIELDS.join())
  same("the view's HEIGHT_FIELDS (view/terrain.js)", HEIGHT.join(), VIEW_HEIGHT.join())
} catch (e) {
  if (!(e instanceof Stop)) throw e
  fort.failed++
}
for (const B of FORT_BOARDS) {
  const got = []
  for (let seed = lo; seed <= hi; seed++) {
    fort.boards++
    try {
      got.push(fortBoard(B, seed))
    } catch (e) {
      Math.random = realRandom
      if (!(e instanceof Stop)) throw e
      fort.failed++
    }
  }
  if (!got.length) continue
  const n = got.length, sum = (f) => got.reduce((s, g) => s + f(g), 0)
  const pairs = got.map((g) => g.pairs), chunks = got.map((g) => g.chunks)
  const kinds = {}
  for (const g of got) for (const k of g.kinds) kinds[k] = (kinds[k] ?? 0) + 0.5
  const row = { B, n, works: sum((g) => g.works), keep: sum((g) => g.keep), pairs, avg: sum((g) => g.pairs) / n, chunks, kinds }
  fortRows.push(row)
  if (n < 100) continue
  // the rates, against DESIGN §4.2.4's measurements
  const judge = (ok, what, a, b) => {
    if (ok) return
    fort.failed++
    if (shown.length < MAX) shown.push(`fortified ${B.label}, seeds ${lo}-${hi}: ${what}: DESIGN ${a} | now ${b}`)
  }
  judge(row.works >= 0.95 * n, 'the works on ≥ 95% of boards', `≥ ${Math.ceil(0.95 * n)} of ${n}`, row.works)
  judge(row.keep >= 0.45 * n && row.keep <= 0.55 * n, 'the keep on about half the boards', `${Math.ceil(0.45 * n)}-${Math.floor(0.55 * n)} of ${n}`, row.keep)
  judge(Math.min(...pairs) >= B.pairs[0] && Math.max(...pairs) <= B.pairs[1], 'fort pairs besides the works, per board', `${B.pairs[0]}-${B.pairs[1]}`, `${Math.min(...pairs)}-${Math.max(...pairs)}`)
  judge(row.avg >= B.avg[0] && row.avg <= B.avg[1], 'fort pairs besides the works, on average', `${B.avg[0]}-${B.avg[1]}`, row.avg.toFixed(2))
}
const stat = (a) => `${Math.min(...a)} / ${(a.reduce((s, x) => s + x, 0) / a.length).toFixed(2)} / ${Math.max(...a)}`
console.log(`\nP-terrain, fortified (F7a): boards ${lo}-${hi} on ${FORT_BOARDS.map((B) => `${B.label} ${B.W}×${B.H}`).join(' and ')} (${((Date.now() - tf0) / 1000).toFixed(1)} s)`)
for (const r of fortRows) {
  console.log(`  ${r.B.label}: the works on ${r.n ? r.works : 0} of ${r.n} boards, the keep on ${r.keep}; fort pairs besides the works (min / avg / max) ${stat(r.pairs)} (${Object.entries(r.kinds).map(([k, v]) => `${k} ${v}`).join(', ') || 'none'}); chunks ${stat(r.chunks)}${r.n < 100 ? ' (under 100 boards: the rates not judged)' : ''}`)
}
console.log(`  ${fort.chunks} chunks built twice alike, Math.random never called; ${fort.defs} adds' defs carrying the chunk's height fields; pieces ${Object.entries(fort.pieces).map(([k, v]) => `${k} ${v}`).join(', ')} (${fort.surfaces} surfaces, ${fort.links} links)`)
console.log(`  ${fort.pairs} mirrored pairs of pieces exact (and ${fort.selfPairs} decks their own mirror), ${fort.others} other chunks within 1e-9; every piece, foot and gate inside its fortification's footprint`)
console.log(`  the view: ${fort.viewed} boards' adds played into a TerrainView, each add's def the view's defOf of its chunk; ${fort.synced} chunks synced alike; ${fort.tops} walkable tops listed, a picker's quad on each; ${fort.taken} meshes taken back by the board's adds played again`)

if (failedSeeds || fort.failed) {
  console.log(`MISMATCH on ${[failedSeeds && `${failedSeeds} classic board(s)`, fort.failed && `${fort.failed} fortified board(s) or rate(s)`].filter(Boolean).join(' and ')}:`)
  for (const s of shown) console.log(`  ${s}`)
  process.exit(1)
}
// a run that compared nothing is not a pass
if (!boards || !stats.chunks) {
  console.log(`terrain-check: VACUOUS: ${boards} board(s), ${stats.chunks} chunks compared`)
  process.exit(2)
}
if (!fort.chunks || !fort.pairs || !fort.links || !fort.viewed || !fort.tops) {
  console.log(`terrain-check: VACUOUS: ${fort.boards} fortified board(s), ${fort.chunks} chunks, ${fort.pairs} mirrored pairs of pieces, ${fort.links} links checked`)
  process.exit(2)
}
if (OPS > 0 && !stats.ops) {
  console.log(`terrain-check: VACUOUS: --ops ${OPS} but no destruction op ran`)
  process.exit(2)
}
console.log(`all ${boards} board${boards === 1 ? '' : 's'} identical: layout draws, chunks, looks against the old meshes, destruction, line of sight; the fortified boards built alike twice, point-symmetric and inside their footprints`)

// ── 7. P-climb (F7a, DESIGN §4.2.9) ─────────────────────────────────────────
// The height layer core/nav.js builds on every fortified board above, each
// board's nav grid rebuilt from its chunks (as a match's refreshNav does): the
// expected matrix of who climbs what, the decks' room, and the layer's
// symmetry.
//  - From the ground in seat 0's zone (the standable ground cell nearest its
//    middle), a climber's reach (r CLIMB_R, ladders taken) finds every deck's
//    top; a big walker's (the Trebuchet's 1.05 and the Brute's 0.95, no
//    ladders) every top a stair rises to (the rampart's, the bastion's, the
//    keep's) and none that only a ladder reaches (the watchtower's, the
//    platform's). (Ground hulls never climb: F9a's vehicles have no unit
//    yet, so their column is empty.)
//  - Every ladder is climbable: both its ends standable for an r CLIMB_R
//    disc, and a climber at its foot reaches its top over the link alone
//    (at its cost, LADDER_MUL × its height); every stair takes a big walker
//    from its gate up onto its deck.
//  - Every deck top hosts an r CLIMB_R disc (every climber's r is at most
//    it, sim/data-check.mjs), and every flier's own disc: they land on
//    every top.
//  - The floor and the links are exactly point-symmetric (cell i and cell
//    N − 1 − i: the same floor, and a link from one where the other has the
//    mirror link, at the same cost); the cliff field within 1e-4 (its two
//    chamfer passes sum in the board's order).
//  - The works stand on ≥ 95% of boards (judged over 100 boards or more).
//  - (F17, DESIGN §4.2.4) Lobbing from height, over every deck: a lobbed
//    weapon (blast or indirect, never a spell) on the deck's top reaches a
//    target on the ground √(R² + 2hR) away, h the top's floor, and one on the
//    ground reaches a target on the top √(R² − 2hR) (rangeOf, bit for bit
//    that expression); its reach to the ground (no target: the overlay's
//    ring) is the first; direct fire and spells reach their printed range
//    both ways; and a board without height gives every weapon its printed
//    range exactly. The roadmap's numbers to a tenth: the Trebuchet's 36"
//    is 37.9" from a 2" deck (a rampart's, a bastion's) and 38.4" from the
//    keep's 2.5", 33.9" firing up at a 2" one; the Venom Engine's 30" is
//    31.9" from 2"; the Grenadiers' 12" is 13.9" from 2" and 14.7" from the
//    watchtower's 3".
// A failure names the board, the piece and the row.
const { NavGrid, CLIMB_R, STEP, LADDER_MUL } = await imp(PKG, 'core/nav.js')
const { rangeOf } = await imp(PKG, 'core/queries.js')
const { RACES } = await imp(PKG, 'data/schema.js')
const { formation } = await imp(PKG, 'core/units.js')
const radius = (t) => formation(t.models, t.base).reduce((m, [x, z]) => Math.max(m, hypot(x, z)), 0) + t.base
const UNITS = Object.values(RACES).flatMap((r) => Object.values(r.units))
const BIG = [1.05, 0.95]
const FLIERS = [...new Set(UNITS.filter((t) => t.fly).map(radius))]
const STAIRED = new Set(['rampart', 'bastion', 'keep'])
const climb = { boards: 0, failed: 0, decks: 0, staired: 0, ladderOnly: 0, ladders: 0, stairs: 0, cells: 0, works: {} }
// (F17) the lob rows: the weapons (a lobbed one of each kind, direct fire, a
// blast spell and a gaze), the decks they were held on, and the numbers the
// roadmap gives, each met at least once
const UNIT = (race, key) => ({ ...RACES[race].units[key], key })
const LOBS = [UNIT('squirrel', 'trebuchet'), UNIT('serpent', 'engine'), UNIT('squirrel', 'grenadier')]
const FLAT = [UNIT('squirrel', 'nutkin'), UNIT('serpent', 'spitter'), UNIT('squirrel', 'elder'), UNIT('serpent', 'hierophant')]
const NUMBERS = [
  ['trebuchet', 2, 'down', '37.9'], ['trebuchet', 2.5, 'down', '38.4'], ['trebuchet', 2, 'up', '33.9'],
  ['engine', 2, 'down', '31.9'], ['grenadier', 2, 'down', '13.9'], ['grenadier', 3, 'down', '14.7'],
]
const lob = { decks: 0, pairs: 0, met: new Set() }
const tc0 = Date.now()
const climbShown = []
const fail = (where, what) => {
  climb.failed++
  if (climbShown.length < MAX) climbShown.push(`${where}: ${what}`)
}
function climbBoard(B, seed) {
  const where = `P-climb ${B.label} seed ${seed}`
  const T = new Terrain(B.W, B.H)
  T.generate(seed, B.objectives, B.deploy, B.set ?? 'fortified', null)
  const nav = new NavGrid(B.W, B.H, 0.5)
  nav.rebuild(T.chunks)
  if (!nav.hasHeight) return fail(where, 'a fortified board built no height layer')
  climb.boards++
  if (T.features.some((f) => f.works === 0)) climb.works[B.label] = (climb.works[B.label] ?? 0) + 1
  const { N } = nav
  // the floor and the links, exactly point-symmetric; the cliff within 1e-4
  for (let i = 0; i < N; i++) {
    const m = N - 1 - i
    if (!Object.is(nav.floor[i], nav.floor[m])) return fail(where, `the floor at cell ${i} (${nav.x(i)}, ${nav.z(i)}) is ${nav.floor[i]}, its mirror cell ${m}'s ${nav.floor[m]}`)
    if (Math.abs(nav.cliff[i] - nav.cliff[m]) > 1e-4) return fail(where, `the cliff at cell ${i} is ${nav.cliff[i]}, its mirror cell's ${nav.cliff[m]} (over 1e-4 apart)`)
    const j = nav.link[i]
    if ((j < 0) !== (nav.link[m] < 0) || (j >= 0 && (nav.link[m] !== N - 1 - j || nav.linkCost[m] !== nav.linkCost[i]))) return fail(where, `cell ${i}'s link is ${j} (cost ${nav.linkCost[i]}), its mirror cell ${m}'s ${nav.link[m]} (cost ${nav.linkCost[m]}), not ${j < 0 ? -1 : N - 1 - j}`)
    const more = nav.linkMore?.get(i), mm = nav.linkMore?.get(m)
    if (JSON.stringify(more?.map(([k, c]) => [N - 1 - k, c]) ?? null) !== JSON.stringify(mm ?? null)) return fail(where, `cell ${i}'s further links ${JSON.stringify(more)} aren't the mirror of cell ${m}'s ${JSON.stringify(mm)}`)
  }
  climb.cells += N
  // where each deck's top is: its level, and whether a stair rises to it
  const decks = T.chunks.filter((c) => c.kind === 'deck')
  const levelOf = (c) => nav.level[nav.index(c.shape.x, c.shape.z)]
  for (const d of decks) {
    const L = levelOf(d)
    if (!L) return fail(where, `deck ${d.id} (${d.look.recipe}) has no raised level at its centre (floor ${nav.floor[nav.index(d.shape.x, d.shape.z)]})`)
    // its top hosts a climber, and every flier
    for (const r of [CLIMB_R, ...FLIERS]) {
      let ok = false
      for (let i = 0; i < N && !ok; i++) ok = nav.level[i] === L && nav.standable(i, r, 'walk')
      if (!ok) return fail(where, `deck ${d.id} (${d.look.recipe}, level ${L}) has no cell an r ${r} disc stands on`)
    }
  }
  // (F17) lobbing from each deck's top at the ground, and up at it
  lobDecks(where, nav, decks)
  // the reaches from seat 0's zone
  let start = -1, bd = Infinity
  const zx = -B.W / 2 + B.deploy / 2
  for (let i = 0; i < N; i++) {
    if (nav.level[i] || !nav.standable(i, CLIMB_R, 'walk')) continue
    const d = hypot(nav.x(i) - zx, nav.z(i))
    if (d < bd) [bd, start] = [d, i]
  }
  if (start < 0) return fail(where, `no ground cell in seat 0's zone hosts an r ${CLIMB_R} disc`)
  const from = (r, climbs) => nav.reach(nav.x(start), nav.z(start), { r, max: Infinity, mode: 'walk', climb: climbs })
  const reached = (res) => {
    const got = new Set()
    for (let i = 0; i < N; i++) if (nav.level[i] && isFinite(res.dist[i])) got.add(nav.level[i])
    return got
  }
  const climber = reached(from(CLIMB_R, true))
  const walkers = BIG.map((r) => [r, reached(from(r, false))])
  for (const d of decks) {
    const L = levelOf(d), recipe = d.look.recipe
    climb.decks++
    if (!climber.has(L)) fail(where, `deck ${d.id} (${recipe}) isn't reached from seat 0's zone by a climber (r ${CLIMB_R}, ladders and stairs)`)
    // ((V3d) the board's own staired recipes: the Powder Field's wrecks')
    const staired = B.staired ?? STAIRED
    for (const [r, got] of walkers) {
      if (staired.has(recipe) && !got.has(L)) fail(where, `deck ${d.id} (${recipe}, a stair's) isn't reached from seat 0's zone by a big walker (r ${r}, stairs only)`)
      if (!staired.has(recipe) && got.has(L)) fail(where, `deck ${d.id} (${recipe}, a ladder's only) is reached by a big walker (r ${r}, which takes no ladder)`)
    }
    if (staired.has(recipe)) climb.staired++
    else climb.ladderOnly++
  }
  // every ladder climbable over its link alone; every stair walked up from
  // its gate by a big walker
  for (const g of nav.gates) {
    const lo = nav.index(g.lo.x, g.lo.z), hi = nav.index(g.hi.x, g.hi.z)
    if (g.ladder) {
      climb.ladders++
      if (!nav.standable(lo, CLIMB_R, 'walk') || !nav.standable(hi, CLIMB_R, 'walk')) {
        fail(where, `ladder ${g.id}: its foot (cell ${lo}, cliff ${nav.cliff[lo]?.toFixed(2)}) or top (cell ${hi}, cliff ${nav.cliff[hi]?.toFixed(2)}) holds no r ${CLIMB_R} disc`)
        continue
      }
      const res = nav.reach(nav.x(lo), nav.z(lo), { r: CLIMB_R, max: g.cost + 0.001, mode: 'walk', climb: true })
      if (res.prev[hi] !== lo || res.dist[hi] !== g.cost || g.cost !== LADDER_MUL * T.chunks.find((c) => c.id === g.id).link.h) fail(where, `ladder ${g.id}: a climber at its foot reaches its top ${isFinite(res.dist[hi]) ? `in ${res.dist[hi]}` : 'not at all'}, not over the link at its cost ${g.cost}`)
    } else {
      climb.stairs++
      const gate = T.chunks.find((c) => c.id === g.id)
      // (the stair's gate: GATE_OUT past its foot, along its own axis)
      const k = hypot(g.lo.x - g.hi.x, g.lo.z - g.hi.z)
      const gx = g.lo.x + ((g.lo.x - g.hi.x) / k) * GATE_OUT, gz = g.lo.z + ((g.lo.z - g.hi.z) / k) * GATE_OUT
      const res = nav.reach(gx, gz, { r: BIG[0], max: g.cost * 3 + 6, mode: 'walk', climb: false })
      const L = g.level
      let up = false
      for (let i = 0; i < N && !up; i++) up = nav.level[i] === L && isFinite(res.dist[i])
      if (!L || !up) fail(where, `stair ${g.id} (${gate.look.recipe}) doesn't take a big walker (r ${BIG[0]}) from its gate up onto level ${L}`)
    }
  }
}
// (F17) every deck's top against the ground: the cell at the deck's centre
// (its floor the deck's height) and the first ground cell (floor 0), a
// shooter of each weapon at one and a target at the other, both ways
function lobDecks(where, nav, decks) {
  const G = { nav }
  const at = (t, i) => ({ t, pos: { x: nav.x(i), z: nav.z(i) }, r: 1 })
  let ground = -1
  for (let i = 0; i < nav.N && ground < 0; i++) if (nav.floor[i] === 0) ground = i
  if (ground < 0) return fail(where, 'the board has no ground cell')
  for (const d of decks) {
    const top = nav.index(d.shape.x, d.shape.z), h = nav.floor[top]
    lob.decks++
    for (const t of [...LOBS, ...FLAT]) {
      const w = t.ranged, R = w.range, lobbed = LOBS.includes(t)
      const down = rangeOf(G, at(t, top), at(t, ground)), up = rangeOf(G, at(t, ground), at(t, top)), ring = rangeOf(G, at(t, top))
      const wantDown = lobbed ? Math.sqrt(R * R + 2 * h * R) : R, wantUp = lobbed ? Math.sqrt(R * R - 2 * h * R) : R
      lob.pairs++
      if (!Object.is(down, wantDown)) fail(where, `${w.name} (${R}") on deck ${d.id} (${d.look.recipe}, ${h}" up) reaches ${down}" at the ground, not ${wantDown}"`)
      if (!Object.is(up, wantUp)) fail(where, `${w.name} (${R}") on the ground reaches ${up}" at deck ${d.id} (${d.look.recipe}, ${h}" up), not ${wantUp}"`)
      if (!Object.is(ring, down)) fail(where, `${w.name}'s ring on deck ${d.id} (${d.look.recipe}) is ${ring}", not its reach to the ground, ${down}"`)
      for (const [key, hh, way, tenth] of NUMBERS) {
        if (t.key !== key || h !== hh) continue
        const got = (way === 'down' ? down : up).toFixed(1)
        if (got !== tenth) fail(where, `${w.name} ${way === 'down' ? `from ${hh}" up at the ground` : `at ${hh}" up from the ground`} reaches ${got}", not the roadmap's ${tenth}"`)
        else lob.met.add(`${key} ${hh} ${way}`)
      }
    }
  }
  // without height, the printed range itself
  const flat = { nav: { hasHeight: false } }
  for (const t of [...LOBS, ...FLAT]) {
    const u = { t, pos: { x: 0, z: 0 }, r: 1 }, v = { t, pos: { x: 5, z: 5 }, r: 1 }
    if (!Object.is(rangeOf(flat, u, v), t.ranged.range) || !Object.is(rangeOf(flat, u), t.ranged.range)) fail(where, `${t.ranged.name} reaches ${rangeOf(flat, u, v)}" on a board without height, not its printed ${t.ranged.range}"`)
  }
}
for (const B of FORT_BOARDS) {
  for (let seed = lo; seed <= hi; seed++) {
    try {
      climbBoard(B, seed)
    } catch (e) {
      fail(`P-climb ${B.label} seed ${seed}`, `threw: ${e.stack.split('\n').slice(0, 3).join(' / ')}`)
    }
  }
  const n = hi - lo + 1, w = climb.works[B.label] ?? 0
  if (n >= 100 && w < 0.95 * n) fail(`P-climb ${B.label}, seeds ${lo}-${hi}`, `the works stand on ${w} of ${n} boards, not ≥ 95%`)
}
console.log(`\nP-climb (F7a): ${climb.boards} fortified boards' height layers (${((Date.now() - tc0) / 1000).toFixed(1)} s): ${climb.decks} decks (${climb.staired} a stair rises to, ${climb.ladderOnly} only ladders reach), each reached by a climber (r ${CLIMB_R}) from seat 0's zone, the stair decks by big walkers (r ${BIG.join(', ')}) and no ladder-only deck; ${climb.ladders} ladders climbed over their links, ${climb.stairs} stairs walked up from their gates; every top hosts r ${CLIMB_R} and the fliers' r ${FLIERS.map((r) => r.toFixed(3)).join(', ')}; ${climb.cells} cells' floor and links point-symmetric exactly, the cliff within 1e-4; the works on ${FORT_BOARDS.map((B) => `${climb.works[B.label] ?? 0} ${B.label}`).join(' and ')} boards of ${hi - lo + 1}`)
console.log(`Lobbing (F17): ${lob.pairs} weapon-deck rows on ${lob.decks} decks: the lobbed weapons (${LOBS.map((t) => `${t.short} ${t.ranged.range}"`).join(', ')}) reach √(R² ± 2hR) down from each top and up at it, the ring the reach down, direct fire and spells (${FLAT.map((t) => t.short).join(', ')}) their printed range, every weapon its printed range on a board without height; the roadmap's numbers met: ${NUMBERS.filter(([k, h, way]) => lob.met.has(`${k} ${h} ${way}`)).map(([k, h, way, tenth]) => `${k} ${way === 'down' ? 'from' : 'up at'} ${h}" ${tenth}"`).join(', ') || 'none'}`)
// (a deck of each height stands on most runs of seeds: 2" the works, 2.5"
// the keep on half the boards, 3" a watchtower on a few; a short run may
// meet none of the rarer ones, which is reported, not failed)
const lobMissed = NUMBERS.filter(([k, h, way]) => !lob.met.has(`${k} ${h} ${way}`))
if (lobMissed.length) console.log(`  (not met on these boards: ${lobMissed.map(([k, h, way]) => `${k} ${way} ${h}"`).join(', ')})`)
if (climb.failed) {
  console.log(`MISMATCH: P-climb failed ${climb.failed} time(s):`)
  for (const s of climbShown) console.log(`  ${s}`)
  process.exit(1)
}
if (!climb.decks || !climb.ladders || !climb.stairs) {
  console.log(`terrain-check: VACUOUS: P-climb met ${climb.decks} decks, ${climb.ladders} ladders and ${climb.stairs} stairs`)
  process.exit(2)
}

// ── 8. The powder keg (F19a, DESIGN §4.2.3 and §4.1 rule 28) ───────────────
// The keg set's boards and the keg itself: the terrain's half (the rules'
// half, the keg going off, its order and its dice, is P-keg's:
// sim/property.mjs). On seeds lo-hi, the keg mission's board (40×28, its
// four objectives, zones 8") built as newState builds it:
//  - built twice, Math.random made to throw: the same adds (a look made of
//    recorded draws); exactly one keg, the first chunk, at (0, 0) exactly
//    (its own point mirror), with the keg's hit points (data/hazards.js),
//    walked round (soft), no sight or cover in it; every other chunk with
//    its point mirror within 1e-9 (classic's features, turned by π);
//  - the view (a TerrainView playing the adds): each add's def the view's
//    defOf of its chunk, the keg drawn as its piece, a table synced from the
//    chunks the adds' table; and once the keg breaks (its hit points spent:
//    terrain.destroy, played as a crate's burst) gone from both;
//  - the objectives inside the keg's blast: each within its radius of the
//    keg, and the nearest cell an r 1.18 squad holds it from (standable,
//    within OBJECTIVE_RANGE + r) under the blast: holding one from its near
//    side is standing in it (the farthest, its far side, printed);
// and on a table with the keg alone, its hit points against every template
// and a wrecker:
//  - each blast weapon of both races and the keg's own, landing at 0.25"
//    steps from the keg's box out past its radius (Terrain.blast, as
//    blastLands calls it): its damage there blast's own model (its scenery
//    within 0.6 of its radius, half rounded up out to the rim, a corroding
//    one's +1 only on a wall's block), the keg broken (in blast's list)
//    exactly where that damage reaches its hit points, scuffed (its
//    terrain.hurt) where it falls short, untouched past the radius; printed:
//    which templates set it off, from how far, and which only crack it;
//  - a wrecker's smash (smashAround, at a walk's sample, an r 0.95 walker):
//    the keg broken from a sample within its reach (u.r and 0.8 of its
//    half-width) and in the list `broke` resolveWalk reads, untouched from
//    one just out of it;
//  - the chain: two kegs more under the first's blast (2.4" each side, in
//    that chunk order), the first broken: its own blast at its place breaks
//    both in chunk order (the line they go off in, which P-keg holds the
//    rules to), and a second blast there breaks nothing (a keg breaks once).
const { HAZARDS } = await imp(PKG, 'data/hazards.js')
const { powderKeg } = await imp(PKG, 'core/terrain/recipes.js')
const { OBJECTIVE_RANGE: OBJ_RANGE } = await imp(PKG, 'core/rules.js')
const KEG = HAZARDS.keg, KM = MISSIONS.keg
const kegs = { boards: 0, failed: 0, chunks: 0, mirrored: 0, defs: 0, near: [], far: [], hp: [], smashes: 0, chains: 0 }
const tk0 = Date.now()
sides = ['want', 'got']
function kegBoard(seed) {
  const where = `the keg set, seed ${seed}`
  const build = () => {
    const T = new Terrain(KM.board.W, KM.board.H), out = []
    const random = Math.random, STUB = Symbol('Math.random')
    Math.random = () => {
      throw Object.assign(new Error('Math.random'), { [STUB]: true })
    }
    try {
      T.generate(seed, KM.objectives, KM.deploy, 'keg', out)
    } catch (e) {
      if (!e?.[STUB]) throw e
      differ(`${where}: the build's draws (a look is made of the layout stream's recorded draws)`, 'none from Math.random', `Math.random called: ${e.stack.split('\n')[2]?.trim()}`)
    } finally {
      Math.random = random
    }
    return { T, out }
  }
  const { T, out } = build(), again = build()
  deep(`${where} the adds, built twice`, out.map((e) => e.def ?? e.t), again.out.map((e) => e.def ?? e.t))
  const ks = T.chunks.filter((c) => c.kind === 'keg')
  same(`${where} kegs`, 1, ks.length)
  const k = ks[0]
  same(`${where} the keg is the first chunk`, T.chunks[0], k)
  same(`${where} the keg's x`, 0, k.shape.x)
  same(`${where} the keg's z`, 0, k.shape.z)
  same(`${where} the keg's hit points`, KEG.hp, k.hp)
  same(`${where} the keg's footing`, 'soft', k.navKind)
  same(`${where} the keg's sight`, null, k.los)
  same(`${where} the keg's cover`, false, k.cover)
  for (const c of T.chunks) {
    if (c === k) continue
    const m = T.chunks.find((o) => o !== c && o.kind === c.kind && Math.abs(o.shape.x + c.shape.x) < 1e-9 && Math.abs(o.shape.z + c.shape.z) < 1e-9 && Math.abs(o.shape.y - c.shape.y) < 1e-9)
    if (!m) differ(`${where} chunk ${c.id} (${c.kind} at ${c.shape.x}, ${c.shape.z})'s point mirror`, 'a chunk of its kind at the negated place, within 1e-9', 'none')
    kegs.mirrored++
  }
  kegs.chunks += T.chunks.length
  // the view
  const view = new TerrainView(new THREE.Scene(), recorder().proxy), mirror = blankMirror()
  for (const e of out) {
    if (e.t === 'terrain.add') {
      deep(`${where} chunk ${e.def.id}'s def (the add's | the view's defOf)`, e.def, viewDefOf(T.chunks.find((c) => c.id === e.def.id)))
      kegs.defs++
    }
    view.apply(e, applyEvent(mirror, e))
  }
  same(`${where} the keg drawn as its piece`, 'keg', view.items.get(k.id)?.c.look.piece)
  syncCheck(`${where} synced`, { terrain: T, view }, null, false)
  const broke = []
  const hit = []
  T.hurt(k, k.hp, { x: -5, z: 0 }, hit, broke)
  same(`${where} the keg broken at its hit points`, 1, broke.length)
  for (const e of hit) view.apply(e, applyEvent(mirror, e))
  same(`${where} the keg gone from the table once broken`, false, view.state(k.id).shown)
  syncCheck(`${where} synced, the keg broken`, { terrain: T, view }, null, false)
  view.dispose()
  // the objectives inside the blast, held from the near side in it
  k.alive = true
  T.dirty = true
  const nav = new NavGrid(KM.board.W, KM.board.H, 0.5)
  nav.rebuild(T.chunks)
  for (const o of KM.objectives) {
    const d = hypot(o.x, o.z)
    if (!(d < KEG.blast)) differ(`${where} the objective at (${o.x}, ${o.z})`, `within the keg's ${KEG.blast}" blast`, `${d}" off`)
    let near = Infinity, far = 0
    for (let i = 0; i < nav.N; i++) {
      if (!nav.standable(i, KEG_SQUAD, 'walk') || hypot(nav.x(i) - o.x, nav.z(i) - o.z) > OBJ_RANGE + KEG_SQUAD) continue
      const dk = hypot(nav.x(i), nav.z(i))
      near = Math.min(near, dk)
      far = Math.max(far, dk)
    }
    if (!(near <= KEG.blast)) differ(`${where} the objective at (${o.x}, ${o.z}): the nearest cell an r ${KEG_SQUAD} squad holds it from`, `under the keg's ${KEG.blast}" blast`, `${near}" off`)
    kegs.near.push(near)
    kegs.far.push(far)
  }
  kegs.boards++
}
// (the squad's disc, connectivity's: the largest squad's)
const KEG_SQUAD = 1.18
for (let seed = lo; seed <= hi; seed++) {
  try {
    kegBoard(seed)
  } catch (e) {
    Math.random = realRandom
    if (!(e instanceof Stop)) throw e
    kegs.failed++
  }
}
// the keg's hit points against every template, a wrecker, and the chain
const lone = (x = 0) => {
  const T = new Terrain(KM.board.W, KM.board.H)
  const k = powderKeg(T, x, 0, 0, '#8a5a34')
  return { T, k }
}
const TEMPLATES = []
for (const r of Object.values(RACES)) for (const t of Object.values(r.units)) if (t.ranged?.blast) TEMPLATES.push({ name: t.ranged.name, blast: t.ranged.blast, scenery: t.ranged.scenery || 1, acid: !!t.ranged.corrodes })
TEMPLATES.push({ name: KEG.name, blast: KEG.blast, scenery: KEG.scenery, acid: false })
const setsOff = []
try {
  for (const w of TEMPLATES) {
    let farthest = -1
    for (let s = 0; s <= w.blast + 0.75; s += 0.25) {
      const { T, k } = lone()
      const x = 0.5 + s, out = []
      const d = distToBox(x, 0.5, 0, k.shape)
      const broke = T.blast(x, 0, w.blast, w.scenery, { acid: w.acid }, out)
      const want = d > w.blast ? 0 : d < w.blast * 0.6 ? w.scenery : Math.ceil(w.scenery / 2)
      const at = `${w.name} landing ${d.toFixed(2)}" off the keg's box`
      same(`${at}: the keg broken`, want >= KEG.hp, broke.includes(k))
      same(`${at}: the keg scuffed`, want > 0 && want < KEG.hp, out.some((e) => e.t === 'terrain.hurt' && e.id === k.id))
      same(`${at}: its hit points left`, KEG.hp - want, k.hp)
      if (want >= KEG.hp) farthest = Math.max(farthest, d)
    }
    setsOff.push(`${w.name} ${farthest >= 0 ? `sets it off from ${farthest.toFixed(2)}" of its box` : 'only cracks it'}`)
    kegs.hp.push(w.name)
  }
  // a wrecker's smash
  for (const [off, want] of [[0, true], [0.95 + 0.4 - 0.01, true], [0.95 + 0.4 + 0.01, false]]) {
    const { T, k } = lone()
    const broke = []
    smashAround({ nav: { hasHeight: false }, terrain: T }, { r: 0.95 }, { x: off, z: 0, dir: Math.PI / 2 }, null, broke)
    same(`a wrecker's smash ${off.toFixed(2)}" from the keg: the keg in the list broken`, want, broke.includes(k))
    same(`a wrecker's smash ${off.toFixed(2)}" from the keg: the keg broken`, !want, k.alive)
    kegs.smashes++
  }
  // the chain
  {
    const T = new Terrain(KM.board.W, KM.board.H)
    const A = powderKeg(T, 0, 0, 0, '#8a5a34'), B = powderKeg(T, 2.4, 0, 0, '#8a5a34'), C = powderKeg(T, -2.4, 0, 0, '#8a5a34')
    T.hurt(A, A.hp, { x: -5, z: 0 }, null, [])
    const broke = T.blast(0, 0, KEG.blast, KEG.scenery, {}, null)
    same("the chain: the first keg's blast breaks", [B.id, C.id].join(), broke.map((c) => c.id).join())
    same('the chain: a second blast there breaks', '', T.blast(0, 0, KEG.blast, KEG.scenery, {}, null).map((c) => c.id).join())
    kegs.chains++
  }
} catch (e) {
  if (!(e instanceof Stop)) throw e
  kegs.failed++
}
const pct = (a) => `${Math.min(...a).toFixed(2)}-${Math.max(...a).toFixed(2)}"`
console.log(`\nthe powder keg (F19a): ${kegs.boards} keg boards, seeds ${lo}-${hi} (${((Date.now() - tk0) / 1000).toFixed(1)} s): built twice alike, Math.random never called, one keg at (0, 0) exactly, the first chunk, with ${KEG.hp} hit points, soft, no sight or cover; ${kegs.mirrored} other chunks with their point mirror within 1e-9; ${kegs.defs} adds' defs the view's defOf, the keg drawn as its piece, the synced table the adds' table, the keg gone from both once broken; each objective inside the keg's ${KEG.blast}" blast, the nearest cell a squad holds it from ${pct(kegs.near)} from the keg (in the blast), the farthest ${pct(kegs.far)}`)
console.log(`  the keg's ${KEG.hp} hit points, by blast's own model, at 0.25" steps: ${setsOff.join('; ')}; a wrecker's smash breaks it from its reach (${kegs.smashes} rows); the chain: a keg's blast breaks the two beside it in chunk order, and a keg breaks once`)
if (kegs.failed || !kegs.boards || kegs.hp.length !== TEMPLATES.length) {
  console.log(`MISMATCH: the powder keg failed ${kegs.failed} time(s)${kegs.boards ? '' : ' (no keg board checked)'}:`)
  for (const s of shown.splice(0)) console.log(`  ${s}`)
  process.exitCode = 1
}

// ── 9. The Powder Field (V3d, DESIGN §4.2.11) ──────────────────────────────
// The header's section 9: the powder mission's boards on --powder-seeds,
// through section 6's fortBoard (its view half, fortView, inside it) and
// section 7's climbBoard, with the board's own set and staired recipes,
// then its sites, its kegs and their chains.
const PM = MISSIONS.powder
const POWDER = { label: 'Powder Field', set: 'powder', W: PM.board.W, H: PM.board.H, deploy: PM.deploy, objectives: PM.objectives, staired: new Set(['farmstead', 'farm', 'trebuchet', 'engine']) }
const { objectivePairs } = await imp(PKG, 'core/terrain/recipes.js')
const pw = { boards: 0, failed: 0, chunks: [], kegs: [], chains: {}, longest: 0, sites: 0, magazines: 0, forts: {}, decks: 0, vents: 0 }
const pwShown = []
const pwFail = (where, what) => {
  pw.failed++
  if (pwShown.length < MAX) pwShown.push(`${where}: ${what}`)
}
const tp0 = Date.now()
const climbBefore = { ...climb }
sides = ['want', 'got']
for (let seed = plo; seed <= phi; seed++) {
  const where = `the Powder Field, seed ${seed}`
  let T
  try {
    T = fortBoard(POWDER, seed).T
  } catch (e) {
    Math.random = realRandom
    if (!(e instanceof Stop)) throw e
    pw.failed++
    for (const s of shown.splice(0)) if (pwShown.length < MAX) pwShown.push(s)
    continue
  }
  pw.boards++
  pw.chunks.push(T.chunks.length)
  try {
    climbBoard(POWDER, seed)
  } catch (e) {
    fail(`P-climb ${POWDER.label} seed ${seed}`, `threw: ${e.stack.split('\n').slice(0, 3).join(' / ')}`)
  }
  for (const f of T.features) if (f.fort && f.site === undefined && f.fort !== 'farmstead') pw.forts[f.fort] = (pw.forts[f.fort] ?? 0) + 0.5
  // the sites, each on its objective
  const nav = new NavGrid(PM.board.W, PM.board.H, 0.5)
  nav.rebuild(T.chunks)
  const floor = (o) => nav.floor[nav.index(o.x, o.z)]
  const centre = T.chunks.find((c) => c.kind === 'deck' && c.look.recipe === 'farmstead')
  if (!centre || !Object.is(centre.shape.x, 0) || !Object.is(centre.shape.z, 0) || floor({ x: 0, z: 0 }) !== centre.surface.y) pwFail(where, "the farmstead's floor doesn't hold the centre objective")
  objectivePairs(PM.objectives).forEach((o, k) => {
    const name = SETS.powder.sites[k]
    for (const at of [o, { x: -o.x, z: -o.z }]) {
      pw.sites++
      if (!T.features.some((f) => f.site === k && f.x === at.x && f.z === at.z && f.fort === name)) pwFail(where, `no ${name} placed on its objective (${at.x}, ${at.z})`)
      if (name === 'magazine') {
        pw.magazines++
        const near = T.chunks.filter((c) => c.kind === 'keg' && hypot(c.shape.x - at.x, c.shape.z - at.z) < 4)
        if (near.length < 5 || near.some((c) => hypot(c.shape.x - at.x, c.shape.z - at.z) < 2.3)) pwFail(where, `the magazine on (${at.x}, ${at.z}): ${near.length} kegs round it, the nearest ${Math.min(...near.map((c) => hypot(c.shape.x - at.x, c.shape.z - at.z))).toFixed(2)}" off`)
      } else {
        const d = T.chunks.find((c) => c.kind === 'deck' && c.look.recipe === name && Math.abs(c.shape.x - at.x) < 1e-9 && Math.abs(c.shape.z - at.z) < 1e-9)
        if (!d || floor(at) !== nav.floor[nav.index(d.shape.x, d.shape.z)] || !(floor(at) > STEP)) pwFail(where, `the ${name} on (${at.x}, ${at.z}): ${d ? `the objective's floor ${floor(at)}, its deck's ${d.surface.y}` : 'no deck centred on it'}`)
        pw.decks++
      }
    }
  })
  // the kegs: none in a zone, each a keg in its rules, and their chains
  const kegs = T.chunks.filter((c) => c.kind === 'keg')
  pw.kegs.push(kegs.length)
  for (const k of kegs) {
    if (Math.abs(k.shape.x) > PM.board.W / 2 - PM.deploy) pwFail(where, `keg ${k.id} at (${k.shape.x.toFixed(2)}, ${k.shape.z.toFixed(2)}) stands in a deployment zone`)
    if (k.hp !== KEG.hp || k.navKind !== 'soft' || k.los || k.cover) pwFail(where, `keg ${k.id} isn't a keg in its rules (hp ${k.hp}, ${k.navKind}, los ${k.los}, cover ${k.cover})`)
  }
  const root = kegs.map((_, i) => i)
  const find = (i) => (root[i] === i ? i : (root[i] = find(root[i])))
  kegs.forEach((a, i) => kegs.forEach((b, j) => {
    if (i === j) return
    const amount = T.blastDamage(b, a.shape.x, 0.5, a.shape.z, KEG.blast, KEG.scenery, false)
    if (amount !== null && amount >= b.hp) root[find(i)] = find(j)
  }))
  const sizes = new Map()
  kegs.forEach((_, i) => sizes.set(find(i), (sizes.get(find(i)) ?? 0) + 1))
  for (const n of sizes.values()) {
    pw.chains[n] = (pw.chains[n] ?? 0) + 1
    pw.longest = Math.max(pw.longest, n)
  }
  // each magazine's kegs go up together
  for (const o of objectivePairs(PM.objectives).filter((_, k) => SETS.powder.sites[k] === 'magazine').flatMap((o) => [o, { x: -o.x, z: -o.z }])) {
    const own = kegs.map((k, i) => (hypot(k.shape.x - o.x, k.shape.z - o.z) < 4 ? find(i) : null)).filter((r) => r !== null)
    if (new Set(own).size > 1) pwFail(where, `the magazine on (${o.x}, ${o.z}): its kegs are ${new Set(own).size} chains, not one`)
  }
  // the view lit its fires (fortBoard's fortView played the adds: here the
  // vents a table registers, counted on one more)
  const rec = recorder(), view = new TerrainView(new THREE.Scene(), rec.proxy), mirror = blankMirror()
  const out = []
  new Terrain(PM.board.W, PM.board.H).generate(seed, PM.objectives, PM.deploy, 'powder', out)
  for (const e of out) view.apply(e, applyEvent(mirror, e))
  const burning = T.chunks.filter((c) => c.look.burn || c.look.spill).length, lit = new Set(rec.log.filter(([k]) => k === 'vent').map(([, a]) => a[0])).size
  if (lit !== burning) pwFail(where, `${lit} chunks' fires lit by the view, ${burning} burning or sputtering`)
  pw.vents += lit
  view.dispose()
  if (rec.log.filter(([k]) => k === 'unvent').length !== lit) pwFail(where, "the view's dispose put out another count of fires than it lit")
}
Math.random = realRandom
{
  const stat = (a) => (a.length ? `${Math.min(...a)} / ${(a.reduce((s, x) => s + x, 0) / a.length).toFixed(1)} / ${Math.max(...a)}` : 'none')
  const n = pw.boards
  console.log(`\nthe Powder Field (V3d): ${n} boards, seeds ${plo}-${phi} (${((Date.now() - tp0) / 1000).toFixed(1)} s): built twice alike, point-symmetric, every piece inside its wreck's footprint, the view's defs, sync and tops (section 6's rows); every wreck's deck climbed (section 7's: ${climb.decks - climbBefore.decks} decks, ${climb.ladders - climbBefore.ladders} ladders, ${climb.stairs - climbBefore.stairs} stairs); ${pw.sites} sites on their objectives (${pw.decks} on a deck's top, ${pw.magazines} magazines' kegs round theirs); chunks ${stat(pw.chunks)}; kegs ${stat(pw.kegs)}, none in a zone, each a keg in its rules; chains (kegs that go up together: size × count) ${Object.entries(pw.chains).sort((a, b) => a[0] - b[0]).map(([k, v]) => `${k}×${v}`).join(', ')}, the longest ${pw.longest}, each magazine one; fort pairs per board ${Object.entries(pw.forts).map(([k, v]) => `${k} ${(v / Math.max(1, n)).toFixed(2)}`).join(', ') || 'none'}; ${pw.vents} chunks' fires lit by the view and put out again`)
  if (climb.failed > climbBefore.failed) {
    pw.failed += climb.failed - climbBefore.failed
    for (const s of climbShown.slice(-MAX)) if (pwShown.length < MAX) pwShown.push(s)
  }
  if (pw.failed) {
    console.log(`MISMATCH: the Powder Field failed ${pw.failed} time(s):`)
    for (const s of pwShown) console.log(`  ${s}`)
    process.exitCode = 1
  } else if (!n || !pw.sites || !pw.vents) {
    console.log(`terrain-check: VACUOUS: ${n} Powder Field boards, ${pw.sites} sites, ${pw.vents} fires checked`)
    process.exit(2)
  }
}

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
// (The WIP merge's follow-up) With height (a fortified board) the rows read
// the board as the rules do: the hull keeps to the ground, starting there
// and never stepping onto a cell whose floor is above STEP (a ground
// vehicle takes no stair: F9a's rule, which the nav's walk doesn't apply
// yet, so a hull walked the works' and the keep's stairs), and the squad,
// which walks stairs as every non-vehicle does (no ladder: the
// non-climbers' reach, the narrower), holds an objective only from a cell
// within HIGH of the objective's floor (controlOf's rule, §4.2.9's "at its
// level": the keep's objective is held from its top, up either stair).
// Every row must pass on every board: a failure names the mission, the set,
// the seed, the seat, the disc and the zone or objective it couldn't reach,
// and what stands round the centre objective (the keep, the ruined tower
// ring); the MISMATCH counts the failed boards by it, the piece a centre
// row fails on read off the board rather than guessed.
// The classic mission's boards are measured too and only reported (their
// lanes are the Skirmish's, frozen with its draws). It prints each board
// size's chunk counts (§4.2.3 expects 250-300 at Grand). Its controls
// (--self-test, below) plant a wall of cells across the centre line, and a
// ring of them round one objective, into the grid: each must fail a row.
// (F9b, F5b add a row per footprint: the hull on its lattice.)
// (NavGrid: imported for P-climb, above)
const { OBJECTIVE_RANGE } = await imp(PKG, 'core/rules.js')
const { HIGH } = await imp(PKG, 'core/queries.js')
const HULL_R = 1.5, SQUAD_R = 1.18
const CONTROL = process.env.CONNECT_MUTATE ?? null
// ((F19a) the Skirmish-sized missions, classic and keg, each reported apart)
const conn = { boards: 0, failed: 0, reaches: 0, chunks: {}, byCentre: {}, small: {} }
// what scatter stood round the centre objective, from the footprints it
// placed (recipes.js CENTRES: the keep's is marked `fort`, the tower ring's
// `hollow`; the rock box's four piles stand off the centre)
const centreOf = (placed) => {
  const c = placed.find((p) => p.x === 0 && p.z === 0)
  return c?.fort === 'keep' ? 'the keep' : c?.hollow ? 'the ruined tower ring' : 'no keep or tower ring'
}
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
  const centre = centreOf(T.features)
  // (with height) the cells off the ground, which the hull never enters
  const raised = nav.hasHeight ? Uint8Array.from(nav.floor, (f) => (f > STEP ? 1 : 0)) : null
  for (const seat of [0, 1]) {
    const sgn = seat ? 1 : -1, mid = sgn * (BW / 2 - m.deploy / 2)
    for (const r of [HULL_R, SQUAD_R]) {
      const forbid = r === HULL_R ? raised : null
      let start = -1, bd = Infinity
      for (let i = 0; i < nav.N; i++) {
        if (!(sgn * nav.x(i) > edge) || !nav.standable(i, r, 'walk', forbid)) continue
        const d = hypot(nav.x(i) - mid, nav.z(i))
        if (d < bd) [bd, start] = [d, i]
      }
      if (start < 0) {
        why.push(`seat ${seat}'s zone has no cell an r ${r} disc stands on`)
        continue
      }
      const res = nav.reach(nav.x(start), nav.z(start), { r, max: Infinity, mode: 'walk', forbid })
      conn.reaches++
      let crossed = false
      for (let i = 0; i < nav.N && !crossed; i++) crossed = -sgn * nav.x(i) > edge && isFinite(res.dist[i])
      if (!crossed) why.push(`an r ${r} disc from seat ${seat}'s zone (${nav.x(start)}, ${nav.z(start)}) reaches no cell of seat ${1 - seat}'s`)
      if (r !== SQUAD_R) continue
      for (const o of m.objectives) {
        // (with height) the objective's floor: a cell counts within HIGH of it
        const oy = raised ? nav.floor[nav.index(o.x, o.z)] : 0
        let held = false
        for (let i = 0; i < nav.N && !held; i++) held = isFinite(res.dist[i]) && hypot(nav.x(i) - o.x, nav.z(i) - o.z) <= OBJECTIVE_RANGE + r && (!raised || Math.abs(nav.floor[i] - oy) <= HIGH)
        const round = o.x === 0 && o.z === 0 ? `, ${centre} round it` : ''
        if (!held) why.push(`an r ${r} squad from seat ${seat}'s zone controls no cell within ${OBJECTIVE_RANGE + r}" of the objective at (${o.x}, ${o.z})${oy ? ` and within ${HIGH}" of its floor (${oy}")` : ''}${round}`)
      }
    }
  }
  return { why, chunks: T.chunks.length, centre }
}
for (const [name, m] of Object.entries(MISSIONS)) {
  for (const set of m.sets) {
    const key = `${name} on ${set}`
    const counts = []
    // ((V3d) the Powder Field on its own seeds, --powder-seeds)
    const [slo, shi] = name === 'powder' ? [plo, phi] : [lo, hi]
    for (let seed = slo; seed <= shi; seed++) {
      let r
      try {
        r = connectBoard(name, m, set, seed)
      } catch (e) {
        r = { why: [`threw: ${e.stack.split('\n').slice(0, 3).join(' / ')}`], chunks: 0 }
      }
      counts.push(r.chunks)
      // ((F19a) a mission on classic's table, the keg's too, is a Skirmish)
      if (m.board.W * m.board.H <= W * H) {
        // (reported, never judged: the Skirmish's lanes are its frozen draws'
        // (classic's, and the keg set's, classic's table round its keg))
        const c = (conn.small[name] ??= { boards: 0, hull: 0, squad: 0, objectives: 0 })
        c.boards++
        if (!r.why.some((w) => w.includes(`r ${HULL_R} disc`))) c.hull++
        if (!r.why.some((w) => w.includes(`r ${SQUAD_R} disc`))) c.squad++
        if (!r.why.some((w) => w.includes('objective'))) c.objectives++
        continue
      }
      conn.boards++
      if (r.why.length) {
        conn.failed++
        conn.byCentre[r.centre] = (conn.byCentre[r.centre] ?? 0) + 1
        if (connShown.length < MAX) connShown.push(`connectivity ${key}, seed ${seed}: ${r.why.join('; ')}`)
      }
    }
    counts.sort((a, b) => a - b)
    conn.chunks[key] = `${counts[0]}-${counts[counts.length - 1]} (median ${counts[counts.length >> 1]}, mean ${(counts.reduce((a, b) => a + b, 0) / counts.length).toFixed(0)})`
  }
}
console.log(`\nconnectivity (F8b): ${conn.boards} Field and Grand boards, seeds ${lo}-${hi} (the Powder Field's ${plo}-${phi}) (${((Date.now() - tn0) / 1000).toFixed(1)} s, ${conn.reaches} reaches): from each seat's zone a round hull (r ${HULL_R}, ground only) and a squad (r ${SQUAD_R}, up stairs) cross to the other zone, and the squad controls every objective (within OBJECTIVE_RANGE + r, ${OBJECTIVE_RANGE + SQUAD_R}", and with height within HIGH, ${HIGH}", of its floor)${CONTROL ? ` [control: ${CONTROL}]` : ''}`)
for (const [key, c] of Object.entries(conn.chunks)) console.log(`  ${key}: chunks ${c}`)
for (const [name, C] of Object.entries(conn.small)) console.log(`  (reported, not judged) ${name}: the hull crosses on ${C.hull} of ${C.boards} boards, the squad on ${C.squad}, and controls every objective on ${C.objectives}`)
if (conn.failed) {
  console.log(`MISMATCH: connectivity failed on ${conn.failed} of ${conn.boards} board(s) (by what stands round the centre objective: ${Object.entries(conn.byCentre).map(([k, v]) => `${k} ${v}`).join(', ')}):`)
  for (const s of connShown) console.log(`  ${s}`)
  // ((the WIP merge's follow-up) exit 1 at the end: the tiles' rows below
  // still run, so a failed board here hides none of theirs)
  process.exitCode = 1
} else {
  if (!conn.boards) {
    console.log('terrain-check: VACUOUS: no Field or Grand board checked for connectivity (no mission offers them?)')
    process.exit(2)
  }
  console.log(`every Field and Grand board connected: ${conn.boards} of ${conn.boards}`)
}

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
