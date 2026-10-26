// A model's figure (DESIGN §1.1, §2.11's frame budget: the template cache,
// R7): a base in its seat's colour (view/models/kit.js, made for each
// figure: its flock falls at random) carrying the unit's miniature, which is
// built and baked once per (models kit, unit) and then cloned. A clone
// shares the template's geometry and materials, so an army of 52 figures
// costs about a dozen bakes, and a new table or a rematch none at all.
//
// The miniature doesn't depend on the seat's colour (only the base's rim
// does), so its template is keyed by kit and unit, not by colour. A builder
// that draws Math.random itself (a kit's DRAWS: a trebuchet's heap of
// acorns, whose pile is every figure's own) makes no template: each of its
// figures is built afresh, as every figure was before R7, so it looks as it
// always did.
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
//                                    screenshot tools hide figures by it),
//                                    `anim` (what the view wiggles), `phase`
//                                    (its idle animation's), `own` (the
//                                    geometry only it uses) and `drawn`
//                                    (its miniature has parts its builder
//                                    placed at random: sim/title-shot.mjs
//                                    compares their shapes, not where)
//   disposeFigure(root)              frees what only that figure used (a
//                                    template's geometry is shared: kept)
//   lodOf(root)                      (F8b) the figure's far stand-in: one
//                                    mesh, low-poly, made on first asking
//                                    and kept as the root's last child
//                                    (hidden until the view shows it)
//
// (F8b, DESIGN §4.2.7's "Drawing at scale" 3) Past 60" from the camera a
// figure is drawn as one mesh (view/units.js switches): its base and
// miniature, every part, merged in the root's space and thinned by vertex
// clustering (every vertex within LOD_CELL of a grid point one vertex, the
// triangles left with three corners kept), each vertex in its part's
// colour, under one flat-shaded vertex-coloured material. Its geometry is
// made once per (kit, unit, seat colour, rim) from the first figure that
// asks, and shared by every figure of that key from then on (a builder
// that draws gives its first figure's heap to all: at that distance a
// heap is a few pixels). Only a board larger than classic's asks for one,
// so the title makes no more objects, nor Math.random draws, than it did.
import * as THREE from 'three'
import { base } from './kit.js'
import { bake } from './bake.js'
import { BUILDERS as SQUIRREL, DRAWS as SQUIRREL_DRAWS } from './squirrel.js'
import { BUILDERS as SERPENT, DRAWS as SERPENT_DRAWS } from './serpent.js'

// the kits, by the name a race's look gives its models (look.models)
const KITS = Object.freeze({ squirrel: SQUIRREL, serpent: SERPENT })
// the builders whose figures are each built afresh (they draw)
const DRAWS = new Set([...SQUIRREL_DRAWS, ...SERPENT_DRAWS])

// `${kit}/${unit}` → a pristine baked miniature, never put on the table
const templates = new Map()

export function buildModel(kit, key, t, sideColor, rim = 1) {
  if (!Object.hasOwn(KITS, kit) || !Object.hasOwn(KITS[kit], key)) throw new Error(`no figure for unit "${key}" in the "${kit}" kit`)
  const id = `${kit}/${key}`, build = KITS[kit][key], draws = DRAWS.has(build)
  const root = new THREE.Group()
  const b = base(t.base, sideColor, rim)
  root.add(b)
  const fresh = draws || !templates.has(id)
  const fig = fresh ? build() : cloneFigure(templates.get(id))
  fig.position.y = t.big ? 0.09 : 0.06
  fig.userData.y0 = fig.position.y
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
  if (fresh) bake(fig)
  root.traverse((o) => {
    if (o.isMesh) o.castShadow = true
  })
  // baking replaced the base's meshes, so re-grant what part() can't know
  b.traverse((o) => {
    if (o.isMesh) o.receiveShadow = true
  })
  // what only this figure uses: its base, and a miniature no template shares
  const own = new Set()
  const mine = (o) => o.traverse((m) => m.isMesh && own.add(m.geometry))
  mine(b)
  if (draws) mine(fig)
  root.userData.own = [...own]
  if (fresh && !draws) templates.set(id, cloneFigure(fig))
  return root
}

// Free the geometry only this figure used (it is off the table for good).
export function disposeFigure(root) {
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
  if (!lods.has(key)) lods.set(key, lowPoly(root))
  lodMat ??= new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.75, flatShading: true })
  const m = new THREE.Mesh(lods.get(key), lodMat)
  m.castShadow = true
  m.visible = false
  m.userData.lod = true
  root.add(m)
  root.userData.lod = m
  return m
}
// how many far stand-in shapes have been made (?debug's view counts)
export const lodShapes = () => lods.size

// Every mesh under `root` (the stand-in itself aside) as triangles in the
// root's space, each corner in its mesh's vertex colour, thinned by
// clustering to LOD_CELL; an indexed geometry of positions and colours.
function lowPoly(root) {
  root.updateMatrixWorld(true)
  const inv = new THREE.Matrix4().copy(root.matrixWorld).invert()
  const rel = new THREE.Matrix4()
  const cells = new Map(), px = [], col = [], cnt = [], tris = []
  const v = new THREE.Vector3()
  root.traverse((o) => {
    if (!o.isMesh || o.userData.lod || onDeck(o, root)) return
    const g = o.geometry, pos = g.attributes.position, c = g.attributes.color, idx = g.index
    const mc = o.material.color
    rel.multiplyMatrices(inv, o.matrixWorld)
    const n = idx ? idx.count : pos.count
    const corner = (k) => {
      const i = idx ? idx.getX(k) : k
      v.fromBufferAttribute(pos, i).applyMatrix4(rel)
      const key = `${Math.round(v.x / LOD_CELL)},${Math.round(v.y / LOD_CELL)},${Math.round(v.z / LOD_CELL)}`
      let at = cells.get(key)
      if (at === undefined) {
        at = cnt.length
        cells.set(key, at)
        px.push(0, 0, 0)
        col.push(0, 0, 0)
        cnt.push(0)
      }
      px[at * 3] += v.x, px[at * 3 + 1] += v.y, px[at * 3 + 2] += v.z
      const r = c ? c.getX(i) * mc.r : mc.r, gg = c ? c.getY(i) * mc.g : mc.g, b = c ? c.getZ(i) * mc.b : mc.b
      col[at * 3] += r, col[at * 3 + 1] += gg, col[at * 3 + 2] += b
      cnt[at]++
      return at
    }
    for (let k = 0; k + 2 < n; k += 3) {
      const a = corner(k), b = corner(k + 1), d = corner(k + 2)
      if (a !== b && b !== d && a !== d) tris.push(a, b, d)
    }
  })
  for (let i = 0; i < cnt.length; i++) for (let j = 0; j < 3; j++) (px[i * 3 + j] /= cnt[i]), (col[i * 3 + j] /= cnt[i])
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(px, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
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
