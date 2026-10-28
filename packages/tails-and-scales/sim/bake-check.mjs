// The bake's extension for the glossy figures (V2, DESIGN §1.1's (V2) note):
// view/models/bake.js must bake every classic figure exactly as the R7 code
// did, and keep a glossy one whole. (proto/scales/bake-check.mjs until V2,
// which held the prototype's bake-gloss.js to bake.js; bake.js is that code
// now, so the reference is bake.js as R7a left it, read from BAKE_REF, a fixed
// commit that never moves.)
//
// 1. Every classic figure (view/models/classic/squirrel.js and serpent.js,
//    the 'classic' style's kits) built twice from one Math.random stream, one
//    baked by R7a's bake.js and the other by today's, compared node for
//    node: the same children in the same order and places, every geometry
//    attribute array equal value for value, the same index, the same
//    material class and fields, no shader patch.
// 2. Every glossy figure (view/models/gloss/serpents.js) at detail 1, the
//    game's DETAIL (view/models/serpent.js) and 0.3, baked: every triangle
//    kept, each skin class's own vertex colours (not its white material
//    colour) and its plain colour kept, the finishes apart.
// 3. The engine's crew (built at its final 0.72 size, its scales' frequency
//    divided by it): a standalone scaleguard's scales per figure, baked.
// 4. The far stand-in (view/models/cache.js's lodOf, F8b) of every glossy
//    figure as the game builds it: triangles, its height the figure's, and
//    its colours the paint's (vertex colour times material colour), not the
//    white of a glossy class's material.
// 5. The glossy runtime (and the splat runtime, ./splat/) draws no
//    Math.random as its modules load (three.js draws it for every object's
//    uuid, and the title's table is painted from Math.random as the page
//    loads: view/index.js), so a page drawing the classic figures draws its
//    table as before V2; and a figure style is set once (setFigureStyle
//    refuses another after a figure is built).
// 6. The splat-fur Bushtails (view/models/squirrel.js), each unit built as
//    the game builds it (cache.js's buildModel: the first a fresh build,
//    baked, the second its template's clone): its splat meshes (a
//    trebuchet's two, (F9a) the War-Cart's two) inside root.userData.fig,
//    left whole by the bake, casting no shadow, every figure of a unit
//    drawing one fur (nine furs for seven units: the trebuchet's crew are
//    two, and the War-Cart's); a shadow proxy per
//    squirrel, on SHADOW_LAYER alone, in the fresh build and the clone;
//    userData.anim as the view and the shots read it (kind; body, head,
//    tail, armL, armR in the figure; the elder's gem a kept mesh; the
//    trebuchet's wheels, throwArm, rest; (F9a) the War-Cart's wheels and
//    its deck's height, the machine both styles share, view/models/
//    warcart.js); and the far stand-in (lodOf): the
//    base and the kit merged (no white: a caster's material), a splat mesh
//    for each of the figure's, drawing its fur, and the body's shadow (its
//    proxies merged, on SHADOW_LAYER alone, casting), as tall as the
//    figure, its splats where the figure at rest holds them (the figure
//    caught mid-hop when first asked).
//    And (V2) every 'new' figure's shadow (cache.js's casterOf), the glossy
//    Ssithra's and the Bushtails': one caster in the figure, on SHADOW_LAYER
//    alone, casting, double-sided, as tall as the figure; nothing else in
//    the figure casting but a kept subtree on three's own layer (a gem, a
//    machine's arm and wheels: they move), so no shadow proxy casts; and the
//    base by one class, its plinth's.
// 7. The splats' preparation (splats.js's prepareSplats, a stub renderer
//    1280×800 at pixel ratio 1): a figure ~28 px tall draws 1,500 splats and
//    one ~60 px 6,000 ((V2) and at pixel ratio 0.5, ?lowfi's, one ~56 px
//    tall, 28 of its drawing buffer's, 1,500); a crowd that would draw more
//    than SPLAT_BUDGET is cut to it, the farthest stepped down first; (V2)
//    a frame's budget shared, the table's render first ('table'), a window
//    after it held to what it left ('window'), and the table's next render,
//    a window having shown, all at the coarsest level; a hidden figure, one
//    off screen and one in another scene aren't prepared; and a bin's draw
//    order no figure holds is freed once unused for a while, a freed
//    figure's with it.
//
//   node sim/bake-check.mjs        (exit 1 on a difference)
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { pathToFileURL } from 'node:url'
import { PKG } from './oracle/pin.mjs'

// R7a's view/models/bake.js (the last commit to touch it before V2)
const BAKE_REF = '417c0127b037c414605ad1b59e18067a44f21478'

let bad = 0
const fail = (what) => {
  console.log(`  FAIL ${what}`)
  bad++
}

// ── 5 (first: before anything glossy is loaded) ────────────────────────────
const real = Math.random
let draws = 0
Math.random = () => (draws++, real())
await import('three')
await import('../view/models/kit.js')
await import('../view/models/classic/squirrel.js')
await import('../view/models/classic/serpent.js')
const before = draws
const { buildSerpent, KEYS } = await import('../view/models/gloss/serpents.js')
const { triangles } = await import('../view/models/gloss/shapes.js')
const { bake } = await import('../view/models/bake.js')
const { DETAIL } = await import('../view/models/serpent.js')
const cache = await import('../view/models/cache.js')
Math.random = real
console.log(`loading the glossy and splat runtimes, today's bake.js and the styles' kits: ${draws - before} Math.random draws`)
if (draws !== before) fail(`the glossy and splat modules drew Math.random ${draws - before} times as they loaded`)

const THREE = await import('three')
const { BUILDERS: SQUIRREL } = await import('../view/models/classic/squirrel.js')
const { BUILDERS: SERPENT } = await import('../view/models/classic/serpent.js')
const { RACES } = await import('../data/schema.js')

// R7a's bake.js, its bare imports pointed at the files this script's own
// resolve to (so both bakes share one three.js), loaded from a temp file
async function refBake() {
  let text
  try {
    text = execFileSync('git', ['show', `${BAKE_REF}:packages/tails-and-scales/view/models/bake.js`], { cwd: PKG, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  } catch {
    throw new Error(`${BAKE_REF.slice(0, 12)} is not in this clone (a shallow one?): git fetch --unshallow`)
  }
  for (const spec of ['three', 'three/examples/jsm/utils/BufferGeometryUtils.js']) {
    if (!text.includes(`from '${spec}'`)) throw new Error(`R7a's bake.js has no import of ${spec}`)
    text = text.replace(`from '${spec}'`, `from '${import.meta.resolve(spec)}'`)
  }
  const dir = mkdtempSync(join(tmpdir(), 'tails-and-scales-bake-'))
  try {
    const f = join(dir, 'bake.mjs')
    writeFileSync(f, text)
    return (await import(pathToFileURL(f).href)).bake
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}
const bakeR7 = await refBake()

// ── 1. The classic figures ─────────────────────────────────────────────────
// (the kits' builders draw Math.random, a trebuchet's heap of acorns: both
// builds of a figure get the same stream, so they are the same figure)
function seeded(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
function built(build, seed) {
  Math.random = seeded(seed)
  try {
    return build()
  } finally {
    Math.random = real
  }
}
const FIELDS = ['type', 'vertexColors', 'metalness', 'roughness', 'flatShading', 'emissiveIntensity', 'transparent', 'opacity', 'side']
function same(a, b, path, out) {
  const say = (what) => out.push(`${path}: ${what}`)
  if (a.type !== b.type) return say(`${a.type} vs ${b.type}`)
  for (const k of ['position', 'quaternion', 'scale']) if (!a[k].equals(b[k])) say(`${k} differs`)
  if (a.isMesh) {
    const ga = a.geometry, gb = b.geometry
    const na = Object.keys(ga.attributes).sort().join(), nb = Object.keys(gb.attributes).sort().join()
    if (na !== nb) say(`attributes ${na} vs ${nb}`)
    else for (const k of Object.keys(ga.attributes)) {
      const x = ga.attributes[k].array, y = gb.attributes[k].array
      if (x.length !== y.length || x.some((v, i) => v !== y[i])) say(`attribute ${k} differs`)
    }
    if (!!ga.index !== !!gb.index || (ga.index && ga.index.array.some((v, i) => v !== gb.index.array[i]))) say('index differs')
    const ma = a.material, mb = b.material
    for (const k of FIELDS) if (ma[k] !== mb[k]) say(`material.${k} ${ma[k]} vs ${mb[k]}`)
    for (const k of ['color', 'emissive']) if (ma[k].getHex() !== mb[k].getHex()) say(`material.${k} differs`)
    if (ma.onBeforeCompile.toString() !== mb.onBeforeCompile.toString()) say('material patched')
  }
  if (a.children.length !== b.children.length) return say(`${a.children.length} vs ${b.children.length} children`)
  a.children.forEach((c, i) => same(c, b.children[i], `${path}/${i}`, out))
}
console.log(`\n1. the classic figures, baked by R7a's bake.js (${BAKE_REF.slice(0, 7)}) and by today's`)
for (const [kit, builders] of [['squirrel', SQUIRREL], ['serpent', SERPENT]]) {
  for (const [key, build] of Object.entries(builders)) {
    // (a first build warms the kit's caches: three draws Math.random for each
    // object it makes, so a build that makes a cached material makes the
    // stream fall differently for what follows)
    built(build, 7)
    const a = built(build, 7), b = built(build, 7)
    bakeR7(a)
    bake(b)
    const diffs = []
    same(a, b, key, diffs)
    let meshes = 0
    a.traverse((o) => o.isMesh && meshes++)
    console.log(`  ${diffs.length ? 'FAIL' : 'ok  '} ${kit.padEnd(8)} ${key.padEnd(11)} ${diffs.length ? 'differs' : 'the same'} (${meshes} baked meshes, ${triangles(a)} triangles)`)
    for (const d of diffs.slice(0, 8)) console.log('       ', d)
    bad += diffs.length
  }
}

// ── 2. The glossy figures ──────────────────────────────────────────────────
console.log(`\n2. the glossy figures baked (the game builds them at detail ${DETAIL})`)
for (const key of KEYS) {
  for (const detail of [...new Set([1, DETAIL, 0.3])]) {
    const { group } = buildSerpent(key, { detail })
    const pre = triangles(group)
    let skinColours = 0
    group.traverse((o) => {
      if (o.isMesh && o.material.userData.shader?.plain) skinColours += o.geometry.attributes.color.count
    })
    bake(group)
    const after = triangles(group)
    const issues = []
    if (pre !== after) issues.push(`${pre} triangles became ${after}`)
    let skin = 0, meshes = 0
    const finishes = new Set()
    group.traverse((o) => {
      if (!o.isMesh) return
      meshes++
      finishes.add(o.material)
      const sh = o.material.userData.shader
      if (!sh?.plain) return
      skin++
      const c = o.geometry.attributes.color.array
      if (!o.geometry.attributes.plain) issues.push('a skin class lost its plain colour')
      let white = 0
      for (let i = 0; i < c.length; i += 3) if (c[i] > 0.99 && c[i + 1] > 0.99 && c[i + 2] > 0.99) white++
      if (white > c.length / 30) issues.push(`a skin class is ${Math.round((300 * white) / c.length)}% white`)
    })
    if (skinColours && !skin) issues.push('no skin class')
    console.log(`  ${issues.length ? 'FAIL' : 'ok  '} ${key.padEnd(11)} detail ${String(detail).padEnd(4)} ${issues.length ? 'lost: ' + issues.join('; ') : 'kept'} (${meshes} meshes, ${finishes.size} finishes, ${after} triangles)`)
    bad += issues.length
  }
}

// ── 3. The engine's crew ───────────────────────────────────────────────────
{
  const skinOf = (g) => {
    let out = null
    g.traverse((o) => o.isMesh && o.material.userData.shader?.scales && !o.material.userData.shader.uBump?.toString().startsWith('0.16') && (out ??= o))
    return out
  }
  const height = (m) => {
    m.geometry.computeBoundingBox()
    const b = m.geometry.boundingBox
    return b.max.y - b.min.y
  }
  const solo = buildSerpent('scaleguard', { detail: DETAIL }).group, eng = buildSerpent('engine', { detail: DETAIL }).group
  bake(solo)
  bake(eng)
  const a = skinOf(solo), b = skinOf(eng)
  const per = (m) => m.material.userData.shader.uScaleFreq * height(m)
  const ratio = per(b) / per(a)
  const ok = Math.abs(ratio - 1) <= 0.02
  console.log(`\n3. the engine's crew: ${b.material.userData.shader.uScaleFreq.toFixed(1)} cells a unit over a ${height(b).toFixed(3)} tall skin, a scaleguard's ${a.material.userData.shader.uScaleFreq} over ${height(a).toFixed(3)}: scales per figure ×${ratio.toFixed(3)}`)
  if (!ok) fail(`the engine's crew has ×${ratio.toFixed(3)} a scaleguard's scales per figure`)
}

// ── 4. The far stand-ins ───────────────────────────────────────────────────
console.log(`\n4. the glossy figures' far stand-ins (cache.js's lodOf), as the game builds them`)
const box = new THREE.Box3()
for (const key of KEYS) {
  const t = RACES.serpent.units[key]
  const root = cache.buildModel('serpent', key, t, '#46c27a')
  const stand = cache.lodOf(root)
  const g = stand.geometry, c = g.attributes.color.array, n = g.index.count / 3
  // the figure's height (the stand-in hidden), against the stand-in's
  stand.visible = false
  root.updateMatrixWorld(true)
  box.setFromObject(root.userData.fig)
  const tall = box.max.y, own = (g.computeBoundingBox(), g.boundingBox.max.y)
  let white = 0, lum = 0
  for (let i = 0; i < c.length; i += 3) {
    if (c[i] > 0.95 && c[i + 1] > 0.95 && c[i + 2] > 0.95) white++
    lum += 0.2126 * c[i] + 0.7152 * c[i + 1] + 0.0722 * c[i + 2]
  }
  const nv = c.length / 3, issues = []
  if (n < 50) issues.push(`only ${n} triangles`)
  if (Math.abs(own - tall) > 0.08 * tall) issues.push(`${own.toFixed(2)} tall, the figure ${tall.toFixed(2)}`)
  if (white > nv / 20) issues.push(`${Math.round((100 * white) / nv)}% of its vertices white (a class's white material colour, not its paint)`)
  console.log(`  ${issues.length ? 'FAIL' : 'ok  '} ${key.padEnd(11)} ${n} triangles, ${own.toFixed(2)} tall (the figure ${tall.toFixed(2)}), mean luminance ${(lum / nv).toFixed(2)}, ${white} white of ${nv} vertices${issues.length ? ': ' + issues.join('; ') : ''}`)
  bad += issues.length
}
// a style is set once: another after a figure is built is refused
{
  let threw = false
  try {
    cache.setFigureStyle('classic')
  } catch {
    threw = true
  }
  console.log(`\n5. setFigureStyle('classic') after a 'new' figure was built ${threw ? 'is refused' : 'was taken'}`)
  if (!threw) fail("setFigureStyle took another style after a figure was built")
}


// ── 6. The splat-fur Bushtails ────────────────────────────────────────────
console.log(`\n6. the splat-fur Bushtails, as the game builds them (a fresh build, then its template's clone), and every 'new' figure's shadow caster`)
const splat = await import('../view/models/splat/splats.js')
const { SHADOW_LAYER } = splat
const inFig = (o, fig) => {
  for (let p = o; p; p = p.parent) if (p === fig) return true
  return false
}
// (V2) what casts in a 'new' figure: its one caster (on SHADOW_LAYER alone,
// double-sided, as tall as what it merges: the figure's meshes but its kept
// parts that move), a kept subtree on three's own layer, and the base's
// first class; the problems
const kept0 = (o, fig) => {
  for (let p = o; p && p !== fig; p = p.parent) if (p.userData.keep && p.layers.mask !== 1 << SHADOW_LAYER) return true
  return false
}
function casting(root) {
  const fig = root.userData.fig, out = []
  const casters = fig.children.filter((o) => o.userData.caster)
  if (casters.length !== 1) return [`${casters.length} shadow casters in the figure, not 1`]
  const c = casters[0]
  if (!c.castShadow || c.layers.mask !== 1 << SHADOW_LAYER || c.material.side !== THREE.DoubleSide) out.push('the caster not a double-sided caster on SHADOW_LAYER alone')
  root.updateMatrixWorld(true)
  const fb = new THREE.Box3(), cb = new THREE.Box3().setFromObject(c, true)
  fig.traverse((o) => o.isMesh && !o.isSplats && !o.userData.caster && !o.userData.lod && !kept0(o, fig) && fb.union(new THREE.Box3().setFromObject(o, true)))
  if (Math.abs(cb.max.y - fb.max.y) > 0.05 * (fb.max.y - root.position.y)) out.push(`the caster ${cb.max.y.toFixed(2)} tall, the figure's meshes ${fb.max.y.toFixed(2)}`)
  fig.traverse((o) => {
    if (o.isMesh && o !== c && o.castShadow !== kept0(o, fig) && !o.isSplats) out.push(`${o.castShadow ? 'a mesh' : 'a kept mesh that moves'} ${o.castShadow ? 'casting beside the caster' : 'casting none'}`)
  })
  const base = root.children[0], cast = base.children.filter((o) => o.castShadow)
  if (cast.length !== 1 || cast[0] !== base.children[0]) out.push(`the base casting by ${cast.length} classes, not its plinth's alone`)
  return [...new Set(out)]
}
// the glossy figures' casters, as the game builds them
for (const key of KEYS) {
  const root = cache.buildModel('serpent', key, RACES.serpent.units[key], '#46c27a')
  const issues = casting(root)
  const c = root.userData.fig.children.find((o) => o.userData.caster)
  let n = 0
  root.userData.fig.traverse((o) => o.isMesh && !o.userData.caster && o.layers.mask === 1 && (n += (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3))
  console.log(`  ${issues.length ? 'FAIL' : 'ok  '} ${key.padEnd(11)} a caster of ${c ? c.geometry.index.count / 3 : 0} triangles for the figure's ${n}${issues.length ? ': ' + issues.join('; ') : ''}`)
  bad += issues.length
  cache.disposeFigure(root)
}
const surs = new Set()
for (const key of Object.keys(RACES.squirrel.units)) {
  const t = RACES.squirrel.units[key]
  for (const how of ['fresh', 'clone']) {
    const root = cache.buildModel('squirrel', key, t, '#ec8a34')
    const fig = root.userData.fig, a = root.userData.anim, issues = []
    const meshes = [], proxies = []
    root.traverse((o) => {
      if (o.isSplats) meshes.push(o)
      else if (o.isMesh && o.layers.mask === 1 << SHADOW_LAYER && !o.userData.caster) proxies.push(o)
    })
    const want = t.big ? 2 : 1
    if (meshes.length !== want) issues.push(`${meshes.length} splat meshes, not ${want}`)
    for (const m of meshes) {
      surs.add(m.fur)
      if (!inFig(m, fig)) issues.push('a splat mesh outside the figure')
      if (m.castShadow) issues.push('a splat mesh casts a shadow')
      if (!m.userData.keep || m.children.length) issues.push('a splat mesh not kept whole')
    }
    // a proxy per squirrel (each may be a class or two: a glider's membrane is double-sided)
    const squirrels = new Set(proxies.map((o) => o.parent))
    if (squirrels.size !== want) issues.push(`${squirrels.size} shadow proxies, not ${want}`)
    if (proxies.some((o) => o.castShadow)) issues.push('a shadow proxy casts (the caster casts for it)')
    let onShadow = 0
    root.traverse((o) => o.isMesh && o.layers.test({ mask: 1 << SHADOW_LAYER }) && !o.layers.test({ mask: 1 }) && onShadow++)
    if (onShadow !== proxies.length + 1) issues.push('a mesh on the shadow layer and the default one')
    issues.push(...casting(root))
    if (t.transport) {
      // ((F9a) the War-Cart: a machine whose wheels turn, its deck's height for its riders)
      if (a.kind !== 'machine' || a.wheels?.length !== 4 || a.wheels.some((w) => !w.userData.keep || !inFig(w, fig)) || typeof a.deck !== 'number' || a.throwArm) issues.push(`the War-Cart's anim is ${Object.keys(a)}`)
    } else if (t.big) {
      if (a.kind !== 'machine' || a.wheels?.length !== 4 || !a.throwArm?.isObject3D || typeof a.rest !== 'number') issues.push(`the machine's anim is ${Object.keys(a)}`)
    } else {
      if (a.kind !== 'squirrel') issues.push(`anim.kind ${a.kind}`)
      for (const k of ['body', 'head', 'tail', 'armL', 'armR']) if (!a[k]?.isObject3D || !inFig(a[k], fig)) issues.push(`anim.${k} not in the figure`)
    }
    if (t.hero && !(a.gem?.isMesh && a.gem.userData.keep && inFig(a.gem, fig))) issues.push("the elder's gem not a kept mesh in the figure")
    // the far stand-in: the base and the kit, the fur, the body's shadow, as
    // tall as the figure; asked mid-hop, made at rest
    const fig0 = fig.position.y
    fig.position.y += 0.16
    fig.rotation.x = 0.12
    const stand = cache.lodOf(root)
    fig.position.y = fig0
    fig.rotation.x = 0
    stand.visible = false
    root.updateMatrixWorld(true)
    // (the figure's height: its meshes' vertices and its finest splats' centres, where they stand)
    box.makeEmpty()
    const v = new THREE.Vector3()
    fig.traverse((o) => {
      if (o.isSplats) {
        const xyz = o.fur.levels[o.fur.levels.length - 1].xyz
        for (let i = 0; i < xyz.length; i += 3) box.expandByPoint(v.set(xyz[i], xyz[i + 1], xyz[i + 2]).applyMatrix4(o.matrixWorld))
      } else if (o.isMesh) box.expandByObject(o, true)
    })
    const tall = box.max.y, g = stand.geometry
    g.computeBoundingBox()
    const n = g.index.count / 3
    let own = g.boundingBox.max.y
    const sp = stand.children.filter((o) => o.isSplats), body = stand.children.filter((o) => o.userData.caster)
    for (const o of sp) {
      const xyz = o.fur.levels[o.fur.levels.length - 1].xyz
      for (let i = 0; i < xyz.length; i += 3) own = Math.max(own, v.set(xyz[i], xyz[i + 1], xyz[i + 2]).applyMatrix4(o.matrix).y)
    }
    if (n < 50) issues.push(`a stand-in of ${n} triangles`)
    if (Math.abs(own - tall) > 0.15 * tall) issues.push(`a stand-in ${own.toFixed(2)} tall, the figure ${tall.toFixed(2)}`)
    if (sp.length !== meshes.length || sp.some((o, i) => o.fur !== meshes[i].fur)) issues.push(`the stand-in draws ${sp.length} furs, not the figure's ${meshes.length}`)
    if (body.length !== 1 || !body[0].castShadow || body[0].layers.mask !== 1 << SHADOW_LAYER) issues.push("the stand-in's body shadow not one caster on SHADOW_LAYER alone")
    const c = g.attributes.color.array
    let white = 0
    for (let i = 0; i < c.length; i += 3) if (c[i] > 0.95 && c[i + 1] > 0.95 && c[i + 2] > 0.95) white++
    if (white > c.length / 3 / 20) issues.push(`${white} of the stand-in's ${c.length / 3} vertices white (a caster's material, not paint)`)
    const caster = fig.children.find((o) => o.userData.caster)
    console.log(`  ${issues.length ? 'FAIL' : 'ok  '} ${key.padEnd(11)} ${how.padEnd(5)} ${meshes.length} splat mesh${meshes.length > 1 ? 'es' : ''} (${meshes.map((m) => m.fur.count).join(' + ')} splats over the levels), ${proxies.length} proxy mesh${proxies.length > 1 ? 'es' : ''}, a caster of ${caster ? caster.geometry.index.count / 3 : 0} triangles, anim ${Object.keys(a).join(' ')}; stand-in ${n} triangles, ${sp.length} fur${sp.length > 1 ? 's' : ''} and a body shadow of ${body[0] ? body[0].geometry.index.count / 3 : 0}, ${own.toFixed(2)} tall (the figure ${tall.toFixed(2)})${issues.length ? ': ' + issues.join('; ') : ''}`)
    bad += issues.length
    cache.disposeFigure(root)
  }
}
// ((F9a) the War-Cart's two crew too)
if (surs.size !== 9) fail(`${surs.size} furs for the seven units, not 9 (one a unit, the trebuchet's crew two, the War-Cart's two)`)
else console.log(`  ok   9 furs for the seven units, each drawn by every figure of its unit`)

// ── 7. The splats' preparation ─────────────────────────────────────────────
{
  console.log(`\n7. the splats' preparation (prepareSplats, 1280×800 at pixel ratio 1)`)
  const stub = { getCurrentViewport: (v) => v.set(0, 0, 1280, 800), getPixelRatio: () => 1 }
  const scene = new THREE.Scene(), other = new THREE.Scene()
  const cam = new THREE.PerspectiveCamera(40, 1280 / 800, 0.1, 500)
  const look = (d) => {
    cam.position.set(0, d * Math.sin(0.77), d * Math.cos(0.77))
    cam.lookAt(0, 0.5, 0)
    cam.updateMatrixWorld()
    scene.updateMatrixWorld()
  }
  const toSun = new THREE.Vector3(-16, 34, 20).normalize()
  const nutkin = RACES.squirrel.units.nutkin
  const one = cache.buildModel('squirrel', 'nutkin', nutkin, '#ec8a34')
  scene.add(one)
  const m = []
  one.traverse((o) => o.isSplats && m.push(o))
  const focal = 800 / 2 / Math.tan((20 * Math.PI) / 180), h = m[0].fur.height
  const issues = []
  for (const [px, n] of [[28, 1500], [60, 6000], [12, 800]]) {
    // (a fresh want each time: the hysteresis keeps a level it holds)
    m[0].want = 0
    for (let k = 0; k < 3; k++) {
      look((h * focal) / px)
      splat.prepareSplats(cam, stub, toSun, scene)
    }
    const drew = m[0].fur.levels[m[0].level].n
    console.log(`  ${drew === n ? 'ok  ' : 'FAIL'} a nutkin ~${px} px tall draws ${drew} splats (want ${n})`)
    if (drew !== n) issues.push(`~${px} px drew ${drew}`)
  }
  // (V2) at pixel ratio 0.5 (?lowfi): the drawing buffer's height, not CSS px
  {
    const half = { getCurrentViewport: (v) => v.set(0, 0, 640, 400), getPixelRatio: () => 0.5 }
    m[0].want = 0
    for (let k = 0; k < 3; k++) {
      look((h * focal) / 56)
      splat.prepareSplats(cam, half, toSun, scene)
    }
    const drew = m[0].fur.levels[m[0].level].n
    console.log(`  ${drew === 1500 ? 'ok  ' : 'FAIL'} a nutkin ~56 px tall at pixel ratio 0.5 (28 of its drawing buffer's) draws ${drew} splats (want 1500)`)
    if (drew !== 1500) issues.push(`~56 px at 0.5 drew ${drew}`)
  }
  // a crowd close up: 40 figures, every one wanting the finest level
  const crowd = []
  for (let i = 0; i < 40; i++) {
    const f = cache.buildModel('squirrel', 'nutkin', nutkin, '#ec8a34')
    f.position.set((i % 8) - 3.5, 0, Math.floor(i / 8) * 1.2 - 2.4)
    scene.add(f)
    crowd.push(f)
  }
  look(4.5)
  splat.prepareSplats(cam, stub, toSun, scene)
  const st = splat.splatStats()
  const near = [], far = []
  for (const f of crowd) f.traverse((o) => o.isSplats && (f.position.z > 0 ? near : far).push(o.level))
  const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length
  const capOk = st.splats <= splat.SPLAT_BUDGET && st.splats > splat.SPLAT_BUDGET - 6000 && mean(far) <= mean(near)
  console.log(`  ${capOk ? 'ok  ' : 'FAIL'} 41 figures close up: ${st.figures} prepared, ${st.splats.toLocaleString()} splats (the budget ${splat.SPLAT_BUDGET.toLocaleString()}); mean level near ${mean(near).toFixed(2)}, far ${mean(far).toFixed(2)}`)
  if (!capOk) issues.push('the budget')
  // (V2) a frame: the table's render first, a window held to what it left;
  // the table's next render, a window having shown, all at the coarsest
  {
    const win = new THREE.Scene(), wf = []
    for (let i = 0; i < 6; i++) {
      const f = cache.buildModel('squirrel', 'nutkin', nutkin, '#ec8a34')
      f.position.set(i - 2.5, 0, 0)
      win.add(f)
      wf.push(f)
    }
    win.updateMatrixWorld()
    const wcam = new THREE.PerspectiveCamera(28, 1280 / 800, 0.1, 100)
    wcam.position.set(0, 1.4, 3.2)
    wcam.lookAt(0, 0.5, 0)
    wcam.updateMatrixWorld()
    splat.setSplatBudget(140000)
    splat.prepareSplats(cam, stub, toSun, scene, 'table')
    const table = splat.splatsPrepared.splats
    splat.prepareSplats(wcam, stub, toSun, win, 'window')
    const left = splat.splatsPrepared.splats
    splat.prepareSplats(cam, stub, toSun, scene, 'table')
    const coarse = splat.splatsPrepared.splats, all0 = crowd.every((f) => f.userData.fig.children[0].children.every((o) => !o.isSplats || o.level === 0) || !f.userData.fig.visible)
    splat.prepareSplats(wcam, stub, toSun, win, 'window')
    const after = splat.splatsPrepared.splats
    // (a window draws its coarsest at the least: 6 × 800)
    const ok = table <= 140000 && left <= Math.max(140000 - table, 6 * 800) && all0 && coarse <= 40 * 800 && after > left
    console.log(`  ${ok ? 'ok  ' : 'FAIL'} a frame of 140,000: the table ${table.toLocaleString()}, then a window ${left.toLocaleString()} (what was left); the next table, a window shown, ${coarse.toLocaleString()} (all at the coarsest: ${all0}), its window ${after.toLocaleString()}`)
    if (!ok) issues.push('the frame budget')
    for (const f of wf) {
      win.remove(f)
      cache.disposeFigure(f)
    }
    splat.setSplatBudget(splat.SPLAT_BUDGET)
    splat.prepareSplats(cam, stub, toSun, scene, 'table')
  }
  // hidden, off screen, another scene: not prepared (two of the middle row, in view)
  const before = splat.splatsPrepared.figures
  crowd[19].userData.fig.visible = false
  crowd[20].position.set(0, 0, 200)
  const elsewhere = cache.buildModel('squirrel', 'nutkin', nutkin, '#ec8a34')
  other.add(elsewhere)
  scene.updateMatrixWorld()
  splat.prepareSplats(cam, stub, toSun, scene)
  const skipped = before - splat.splatsPrepared.figures
  console.log(`  ${skipped === 2 ? 'ok  ' : 'FAIL'} a hidden figure, one off screen and one in another scene: ${splat.splatsPrepared.figures} of the ${before} in view prepared, the other scene's untouched`)
  if (skipped !== 2) issues.push(`${skipped} skipped, not 2`)
  // freed: every figure off, then a while of preparing nothing: no order held but the templates'
  for (const f of [one, ...crowd, elsewhere]) {
    f.parent.remove(f)
    cache.disposeFigure(f)
  }
  const held = splat.splatStats().orders
  for (let k = 0; k < 200; k++) splat.prepareSplats(cam, stub, toSun, scene)
  const left = splat.splatStats()
  // (the six templates' own kept, cache.js's, the War-Cart's two crew among
  // them: the trebuchet DRAWS, so it has none)
  const freed = left.live === 0 && left.orders === 7
  console.log(`  ${freed ? 'ok  ' : 'FAIL'} every figure freed: ${left.live} registered, draw orders ${held} → ${left.orders} after 200 preparations (the six templates' own kept, the War-Cart's two crew among them)`)
  if (!freed) issues.push('orders kept')
  bad += issues.length
}

if (bad) {
  console.log(`\nbake-check FAILED: ${bad} problem(s)`)
  process.exit(1)
}
console.log("\nbake-check passed: bake.js bakes every classic figure exactly as R7a's did, and keeps the glossy ones whole, their far stand-ins in their paint; the splat Bushtails keep their splats, shadow proxies and anim through the bake and a clone; every 'new' figure casts through its one shadow caster; and the splats' preparation keeps its levels, its frame's budget and memory")
