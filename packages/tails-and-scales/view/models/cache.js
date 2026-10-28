// A model's figure (DESIGN §1.1, §2.11's frame budget: the template cache,
// R7): a base in its seat's colour (view/models/kit.js, made for each
// figure: its flock falls at random) carrying the unit's miniature, which is
// built and baked once per (figure style, models kit, unit) and then cloned.
// A clone shares the template's geometry and materials, so an army of 52
// figures costs about a dozen bakes, and a new table or a rematch none at
// all.
//
// The miniature doesn't depend on the seat's colour (only the base's rim
// does), so its template is keyed by style, kit and unit, not by colour.
// (V2) The style is the page's: 'new' (the glossy Ssithra, view/models/
// serpent.js, and the splat-fur Bushtails, view/models/squirrel.js) or
// 'classic' (the R7 figures, view/models/classic/), set once by
// setFigureStyle before any figure is built (app/boot.js, from ?models= or
// the title's Figures switch). A builder that draws Math.random itself (a
// kit's DRAWS: a trebuchet's heap of acorns, whose pile is every figure's
// own) makes no template: each of its figures is built afresh, as every
// figure was before R7, so it looks as it always did.
//
// What a figure draws is otherwise as before, in the same order (its base's
// flock, its miniature, its idle phase), but three.js draws Math.random for
// every object it makes (its uuid), and a unit's first figure now makes
// more objects than a build did (the template, then its clone) and each
// later one fewer (a clone): so the flocks and idle phases fall from
// another point of the stream than before R7 (later at first, earlier from
// a unit's third figure or so on). That is cosmetic, and unseeded in play
// anyway; sim/title-shot.mjs holds the title
// to the code before R7 pixel for pixel with the figures hidden, and every
// figure's place and miniature, vertex for vertex.
//
//   buildModel(kit, key, t, color, rim)   a figure ((F6) its base's rim
//                                    `rim` times as broad): its root's
//                                    userData holds
//                                    `fig` (the miniature, marked: the
//                                    screenshot tools hide figures by it;
//                                    its userData's y0 and (V2) sy, its
//                                    height and height's scale as built),
//                                    `anim` (what the view wiggles), `phase`
//                                    (its idle animation's), `own` (the
//                                    geometry only it uses) and `drawn`
//                                    (its miniature has parts its builder
//                                    placed at random: sim/title-shot.mjs
//                                    compares their shapes, not where);
//                                    (F9a) `base`, its base, which a
//                                    rider's figure hides on a hull's deck
//                                    (both styles' kits build the Acorn
//                                    War-Cart from ./warcart.js, so its
//                                    template is keyed by style like any)
//   disposeFigure(root)              frees what only that figure used (a
//                                    template's geometry is shared: kept)
//                                    ((V2) and takes its splats off the
//                                    list splats.js prepares)
//   setFigureStyle(name)             (V2) the style every figure is built
//                                    in, 'new' or 'classic' (STYLES); once,
//                                    before the first figure (a later call
//                                    naming another style throws)
//   figureStyle()                    (V2) the style figures are built in
//   lodOf(root)                      (F8b) the figure's far stand-in: one
//                                    mesh, low-poly, made on first asking
//                                    and kept as the root's last child
//                                    (hidden until the view shows it);
//                                    (V2) a splat-fur figure's holds its fur
//                                    and its body's shadow too (below)
//
// (F8b, DESIGN §4.2.7's "Drawing at scale" 3) Past 60" from the camera a
// figure is drawn as one mesh (view/units.js switches): its base and
// miniature, every part, merged in the root's space and thinned by vertex
// clustering (every vertex within LOD_CELL of a grid point one vertex, the
// triangles left with three corners kept), each vertex in its part's
// colour, under one flat-shaded vertex-coloured material. Its geometry is
// made once per (style, kit, unit, seat colour, rim) from the first figure
// that asks, and shared by every figure of that key from then on (a builder
// that draws gives its first figure's heap to all: at that distance a
// heap is a few pixels). Only a board larger than classic's asks for one,
// so the title makes no more objects, nor Math.random draws, than it did.
// (V2) A glossy figure's stand-in is the same: its baked classes carry
// their colours in the vertices under a white material (gloss.js's
// classMaterial), so vertex colour times material colour is its paint. A
// splat-fur figure's merges its base and its kit (a far squirrel keeps its
// hat and its halberd) and keeps its fur: a splat mesh of each of the
// figure's furs, where the figure at rest holds it, in the stand-in (a
// quad per splat is no shape to merge, and the classic body that a first
// version merged in its place turned darker, harder and curled-tailed at
// the 60" switch); prepareSplats gives it its level as any figure's (the
// coarsest, mostly, at that distance). Its shadow proxies, which no camera
// draws, cast its body's shadow as one more mesh in the stand-in, on
// SHADOW_LAYER alone. The stand-in is made with the figure at rest (where
// the view's hop, breath, lean and keel would leave it: the rest its build
// left, userData.rest), whatever pose it holds when first asked.
//
// (V2) A splat-fur figure (view/models/squirrel.js, ./splat/splats.js):
// its splat meshes are kept whole by the bake (userData.keep) and never
// cast a shadow (the castShadow pass below skips them: its shadow caster,
// its proxy in it, casts for it), and they draw their unit's fur, which no figure owns (a
// figure's own geometry never counts them). A figure built or cloned here
// is put on the list splats.js's prepareSplats sees (registerSplats),
// before every render that can show it, and taken off by disposeFigure.
// The stand-in also draws a double-sided part (a robe, a breastplate, a
// glider's membrane) from both sides, each triangle twice, once each way
// round (its material is single-sided), as the part is drawn.
//
// (V2) The sun's shadow pass draws every figure on the board whatever the
// camera sees, a call a class, so the 'new' style (ONE_CASTER) casts each
// figure through one mesh: its miniature's every mesh merged in its space
// (casterOf: positions only, each vertex within CASTER_CELL of a grid point
// one vertex, under one double-sided material, on splats.js's SHADOW_LAYER
// alone, which only the shadow pass draws: view/stage.js), made with the
// template and copied by its clones, the miniature's own meshes casting
// none. What it leaves out casts as ever: a kept subtree on three's own
// layer (a trebuchet's arm and wheels, a gem: they move on their own, so
// they cast from where they are), and the base, by its plinth's class
// alone (bake's first: base()'s plinth and its flock; the top's and the
// rim's shadows fall inside the plinth's). A squirrel's shadow proxy (kept
// on SHADOW_LAYER alone) is merged into it. Two calls a figure in the
// shadow pass, where the glossy ones made 9 to 13 and the classic 6 or 7;
// the classic style casts as it always did.
import * as THREE from 'three'
import { base } from './kit.js'
import { bake } from './bake.js'
import { BUILDERS as SQUIRREL, DRAWS as SQUIRREL_DRAWS } from './squirrel.js'
import { BUILDERS as SERPENT, DRAWS as SERPENT_DRAWS } from './serpent.js'
import { BUILDERS as CLASSIC_SQUIRREL, DRAWS as CLASSIC_SQUIRREL_DRAWS } from './classic/squirrel.js'
import { BUILDERS as CLASSIC_SERPENT, DRAWS as CLASSIC_SERPENT_DRAWS } from './classic/serpent.js'
import { Splats, registerSplats, unregisterSplats, SHADOW_LAYER } from './splat/splats.js'
import { drawStats } from '../stats.js'

// (V2) The figure styles: each a set of kits, by the name a race's look
// gives its models (look.models). 'new' (the default): the glossy Ssithra
// (serpent.js) and the splat-fur Bushtails (squirrel.js); 'classic': the
// R7 figures (classic/), kept for comparison and as the fallback.
export const STYLES = Object.freeze({
  new: Object.freeze({ squirrel: SQUIRREL, serpent: SERPENT }),
  classic: Object.freeze({ squirrel: CLASSIC_SQUIRREL, serpent: CLASSIC_SERPENT }),
})
// the builders whose figures are each built afresh (they draw)
const DRAWS = new Set([...SQUIRREL_DRAWS, ...SERPENT_DRAWS, ...CLASSIC_SQUIRREL_DRAWS, ...CLASSIC_SERPENT_DRAWS])
// ((V2) the styles whose figures cast through one shadow caster each: see above)
const ONE_CASTER = new Set(['new'])

// (V2) the style's kits, set once before any figure is built (a page draws
// one style: app/boot.js sets it as the page loads)
let style = 'new'
let KITS = STYLES.new
let built = false
export const figureStyle = () => style
export function setFigureStyle(name) {
  if (!Object.hasOwn(STYLES, name)) throw new Error(`no figure style "${name}": ${Object.keys(STYLES).join(', ')}`)
  if (name === style) return
  if (built) throw new Error(`setFigureStyle("${name}") after a figure was built in the "${style}" style`)
  style = name
  KITS = STYLES[name]
}

// `${style}/${kit}/${unit}` → a pristine baked miniature, never put on the table
const templates = new Map()

export function buildModel(kit, key, t, sideColor, rim = 1) {
  if (!Object.hasOwn(KITS, kit) || !Object.hasOwn(KITS[kit], key)) throw new Error(`no figure for unit "${key}" in the "${kit}" kit`)
  built = true
  const id = `${style}/${kit}/${key}`, build = KITS[kit][key], draws = DRAWS.has(build)
  const root = new THREE.Group()
  const b = base(t.base, sideColor, rim)
  root.add(b)
  const fresh = draws || !templates.has(id)
  // ((V2) a fresh build timed, its bake with it: the perf overlay's)
  const t0 = fresh ? performance.now() : 0
  const fig = fresh ? build() : cloneFigure(templates.get(id))
  fig.position.y = t.big ? 0.09 : 0.06
  fig.userData.y0 = fig.position.y
  // ((V2) its pose at rest, which the view's tweens leave: the stand-in's)
  fig.userData.rest = [...fig.position.toArray(), fig.rotation.x, fig.rotation.y, fig.rotation.z, ...fig.scale.toArray()]
  // ((V2) its height's scale as built: a brute's 2.15, a hierophant's 1.32,
  // an elder's 1.28, which the idle breath scales about, view/units.js)
  fig.userData.sy = fig.scale.y
  root.add(fig)
  root.userData.fig = fig
  // ((F9a) its base, which a rider's figure hides while it stands on a
  // hull's deck: view/units.js)
  root.userData.base = b
  root.userData.anim = fig.userData.anim
  root.userData.phase = Math.random() * 10
  root.userData.drawn = draws
  // (F8b) the key its far stand-in is shared by (lodOf)
  root.userData.lodKey = `${id}|${new THREE.Color(sideColor).getHexString()}|${rim}`
  bake(b)
  const one = ONE_CASTER.has(style)
  if (fresh) {
    bake(fig)
    // ((V2) its shadow caster, made with the template: its clones copy it)
    if (one) fig.add(casterOf(fig))
    drawStats.built += performance.now() - t0
    drawStats.builds++
  }
  // ((V2) a splat mesh never; in a style with ONE_CASTER, only the caster
  // (a squirrel's shadow proxy in it), the kept parts that move, and the
  // base's plinth)
  if (one) {
    b.children[0].castShadow = true
    castKept(fig)
  } else {
    root.traverse((o) => {
      if (o.isMesh && !o.isSplats) o.castShadow = true
    })
  }
  // baking replaced the base's meshes, so re-grant what part() can't know
  b.traverse((o) => {
    if (o.isMesh) o.receiveShadow = true
  })
  // what only this figure uses: its base, and a miniature no template shares
  // ((V2) but its splats', which its unit's fur owns)
  const own = new Set()
  const mine = (o) => o.traverse((m) => m.isMesh && !m.isSplats && own.add(m.geometry))
  mine(b)
  if (draws) mine(fig)
  root.userData.own = [...own]
  if (fresh && !draws) templates.set(id, cloneFigure(fig))
  // ((V2) its splats prepared before each render from now on: the
  // template's never are, it never stands on a table)
  registerSplats(root)
  return root
}

// Free the geometry only this figure used (it is off the table for good).
export function disposeFigure(root) {
  unregisterSplats(root)
  for (const g of root.userData.own ?? []) g.dispose()
  root.userData.own = []
}

// (F8b) The figure's far stand-in (made the first time it is asked for):
// one mesh of its key's shared low-poly geometry, the root's child, hidden.
const lods = new Map()
let lodMat = null
const LOD_CELL = 0.07
export function lodOf(root) {
  if (root.userData.lod) return root.userData.lod
  const key = root.userData.lodKey
  if (!lods.has(key)) lods.set(key, atRest(root, () => lowPoly(root)))
  lodMat ??= new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.75, flatShading: true })
  const { geo, furs, body } = lods.get(key)
  const m = new THREE.Mesh(geo, lodMat)
  m.castShadow = true
  m.visible = false
  m.userData.lod = true
  // ((V2) a splat-fur figure's: its furs where it holds them, its body's
  // shadow; on the list prepareSplats sees from now on)
  for (const [fur, at] of furs) {
    const s = new Splats(fur)
    s.matrixAutoUpdate = false
    s.matrix.copy(at)
    m.add(s)
  }
  if (body) m.add(casterMesh(body))
  root.add(m)
  root.userData.lod = m
  registerSplats(m)
  return m
}
// how many far stand-in shapes have been made (?debug's view counts)
export const lodShapes = () => lods.size

// (V2) `fn()` with the root's figure at rest (userData.rest), its pose put
// back after.
function atRest(root, fn) {
  const fig = root.userData.fig, r = fig.userData.rest
  if (!r) return fn()
  const p = fig.position.clone(), q = fig.rotation.clone(), s = fig.scale.clone()
  fig.position.fromArray(r, 0)
  fig.rotation.set(r[3], r[4], r[5])
  fig.scale.fromArray(r, 6)
  try {
    return fn()
  } finally {
    fig.position.copy(p)
    fig.rotation.copy(q)
    fig.scale.copy(s)
    root.updateMatrixWorld(true)
  }
}

// Every mesh under `root` (the stand-in itself, (V2) a splat mesh and a
// mesh on SHADOW_LAYER alone, a shadow caster's or a proxy's, aside) as
// triangles in the root's space, each corner in its mesh's vertex colour,
// thinned by clustering to LOD_CELL ((V2) a double-sided mesh's triangles
// both ways round): `geo`, an indexed geometry of positions and colours.
// (V2) And a splat-fur figure's `furs`, [fur, its splat mesh's matrix in
// the root's space], and `body`, its shadow proxies merged the same way,
// positions only (null where it has none).
function lowPoly(root) {
  const shadowOnly = (o) => o.layers.mask === 1 << SHADOW_LAYER
  // ((F9a) a hull's riders on its deck left out, their meshes, furs and
  // shadow proxies alike: they are their own units' figures, and hide with
  // the deck at range)
  const geo = cluster(root, LOD_CELL, (o) => !o.userData.lod && !shadowOnly(o) && !onDeck(o, root), true)
  const furs = [], inv = new THREE.Matrix4().copy(root.matrixWorld).invert()
  root.traverse((o) => o.isSplats && !o.parent.userData.lod && !onDeck(o, root) && furs.push([o.fur, new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld)]))
  const body = furs.length ? cluster(root, LOD_CELL, (o) => !o.userData.lod && shadowOnly(o) && !o.userData.caster && !onDeck(o, root), false) : null
  return { geo, furs, body: body?.index.count ? body : null }
}

// (V2) A figure's shadow caster: every mesh of the miniature `fig` (baked)
// but its splats and its kept subtrees on three's own layer (they cast as
// themselves), a kept subtree on SHADOW_LAYER alone in (a squirrel's shadow
// proxy), merged in its space and thinned by clustering to CASTER_CELL,
// positions only; on SHADOW_LAYER alone, casting, never drawn but by the
// sun's shadow pass.
const CASTER_CELL = 0.012
let casterMat = null
function casterOf(fig) {
  const kept = new Set()
  fig.traverse((o) => o !== fig && o.userData.keep && o.layers.mask !== 1 << SHADOW_LAYER && kept.add(o))
  const under = (o) => {
    for (; o && o !== fig; o = o.parent) if (kept.has(o)) return true
    return false
  }
  return casterMesh(cluster(fig, CASTER_CELL, (o) => !under(o), false))
}
// A shadow caster of geometry `geo`: double-sided, on SHADOW_LAYER alone.
function casterMesh(geo) {
  casterMat ??= new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
  const m = new THREE.Mesh(geo, casterMat)
  m.layers.set(SHADOW_LAYER)
  m.castShadow = true
  m.userData.caster = true
  return m
}
// What casts in a figure with a caster: the caster, and the meshes of a kept
// subtree on three's own layer (not a splat mesh, not a shadow proxy's).
function castKept(fig) {
  const walk = (o, kept) => {
    for (const c of o.children) {
      const k = kept || (!!c.userData.keep && c.layers.mask !== 1 << SHADOW_LAYER)
      if (c.isMesh && !c.isSplats) c.castShadow = k || !!c.userData.caster
      walk(c, k)
    }
  }
  walk(fig, false)
}

// The meshes under `root` that `take(mesh)` (never a splat mesh) as
// triangles in the root's space, each corner moved to the mean of the
// corners within `cell` of the same grid point, a triangle whose corners
// meet dropped; with `colors`, each corner in its mesh's vertex colour times
// its material's, and a double-sided mesh's triangles both ways round. An
// indexed geometry, its bounding sphere computed. (A grid point's key is a
// number, its three indices 16 bits each: a figure is a few inches across,
// a few hundred cells of the finest grid, so none wraps; a string key cost
// the caster a tenth of a cold figure's build.)
function cluster(root, cell, take, colors) {
  root.updateMatrixWorld(true)
  const inv = new THREE.Matrix4().copy(root.matrixWorld).invert()
  const rel = new THREE.Matrix4()
  const cells = new Map(), px = [], col = [], cnt = [], tris = []
  const v = new THREE.Vector3()
  root.traverse((o) => {
    if (!o.isMesh || o.isSplats || !take(o)) return
    const g = o.geometry, pos = g.attributes.position, c = colors ? g.attributes.color : null, idx = g.index
    const mc = o.material.color, both = colors && o.material.side === THREE.DoubleSide
    rel.multiplyMatrices(inv, o.matrixWorld)
    const n = idx ? idx.count : pos.count
    const corner = (k) => {
      const i = idx ? idx.getX(k) : k
      v.fromBufferAttribute(pos, i).applyMatrix4(rel)
      const key = (Math.round(v.x / cell) + 32768) * 4294967296 + (Math.round(v.y / cell) + 32768) * 65536 + (Math.round(v.z / cell) + 32768)
      let at = cells.get(key)
      if (at === undefined) {
        at = cnt.length
        cells.set(key, at)
        px.push(0, 0, 0)
        col.push(0, 0, 0)
        cnt.push(0)
      }
      px[at * 3] += v.x, px[at * 3 + 1] += v.y, px[at * 3 + 2] += v.z
      if (colors) {
        const r = c ? c.getX(i) * mc.r : mc.r, gg = c ? c.getY(i) * mc.g : mc.g, b = c ? c.getZ(i) * mc.b : mc.b
        col[at * 3] += r, col[at * 3 + 1] += gg, col[at * 3 + 2] += b
      }
      cnt[at]++
      return at
    }
    for (let k = 0; k + 2 < n; k += 3) {
      const a = corner(k), b = corner(k + 1), d = corner(k + 2)
      if (a !== b && b !== d && a !== d) {
        tris.push(a, b, d)
        if (both) tris.push(a, d, b)
      }
    }
  })
  for (let i = 0; i < cnt.length; i++) for (let j = 0; j < 3; j++) (px[i * 3 + j] /= cnt[i]), colors && (col[i * 3 + j] /= cnt[i])
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(px, 3))
  if (colors) geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  geo.setIndex(tris)
  geo.computeBoundingSphere()
  return geo
}

// (F9a) whether a mesh stands on a hull's deck (view/units.js's deck group,
// in the hull's root: its riders' figures), which the hull's stand-in
// leaves out (they are their own units', and hide with the deck at range)
function onDeck(o, root) {
  for (let p = o; p && p !== root; p = p.parent) if (p.userData.deck) return true
  return false
}

// A copy of a baked miniature sharing its geometry and materials (Mesh.clone
// shares both). Object3D.clone would copy each node's userData through
// JSON, which can't hold what it does (the anim's parts, an arm's hand, all
// nodes of the same tree), so userData is set aside while cloning and then
// copied with every node it names mapped to the copy's own.
function cloneFigure(src) {
  const held = new Map()
  src.traverse((o) => {
    held.set(o, o.userData)
    o.userData = {}
  })
  let copy
  try {
    copy = src.clone(true)
  } finally {
    for (const [o, data] of held) o.userData = data
  }
  const twin = new Map()
  const pair = (a, b) => {
    twin.set(a, b)
    a.children.forEach((c, i) => pair(c, b.children[i]))
  }
  pair(src, copy)
  const map = (v) => (v?.isObject3D ? twin.get(v) ?? v : Array.isArray(v) ? v.map(map) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, map(x)])) : v)
  for (const [o, data] of held) twin.get(o).userData = map(data)
  return copy
}
