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
//   buildModel(kit, key, t, color)   a figure: its root's userData holds
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

export function buildModel(kit, key, t, sideColor) {
  if (!Object.hasOwn(KITS, kit) || !Object.hasOwn(KITS[kit], key)) throw new Error(`no figure for unit "${key}" in the "${kit}" kit`)
  const id = `${kit}/${key}`, build = KITS[kit][key], draws = DRAWS.has(build)
  const root = new THREE.Group()
  const b = base(t.base, sideColor)
  root.add(b)
  const fresh = draws || !templates.has(id)
  const fig = fresh ? build() : cloneFigure(templates.get(id))
  fig.position.y = t.big ? 0.09 : 0.06
  fig.userData.y0 = fig.position.y
  root.add(fig)
  root.userData.fig = fig
  root.userData.anim = fig.userData.anim
  root.userData.phase = Math.random() * 10
  root.userData.drawn = draws
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
