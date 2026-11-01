// The node tree both `tree` and `rig` build (design §8 "sculpt it", §17.1 layer 1).
// Each node is a Group placed by p and r (degrees); s scales only that node's own
// shape, so children sit in unscaled parent space and resizing a torso never
// stretches the head. A node may carry `anchor: 'seat'|'head'` (the point a rider
// or camera attaches to) and `name`: a named node is a bone that clips can move,
// its children moving with it. Every group records its rest pose (userData.rest)
// so animation offsets are added to it, never accumulated.
import * as THREE from 'three'
import { geoKey, shapeGeo, stdMatKey, stdMat, tintColor, normShape } from '../resources.js'
import { vec3 } from './common.js'

const D = Math.PI / 180

// Structure = shapes, nesting, names and anchor names. Same structure -> patch
// poses, scales and colours in place; anything else rebuilds (tested in Node).
export function signature (nodes) {
  if (!Array.isArray(nodes)) return ''
  return nodes.map((n) => `${n?.shape ? normShape(n.shape) : ''}${n?.name ? '#' + String(n.name) : ''}${n?.anchor ? '@' + String(n.anchor) : ''}(${signature(n?.children)})`).join(',')
}

// a node's colour, multiplied by the look-wide colour and then the group tint
const matData = (n, look) => ({ color: tintColor(tintColor(n.color ?? '#cccccc', look.color), look.tint), roughness: n.roughness, metalness: n.metalness })

function pose (g, n) {
  const p = vec3(n.p, [0, 0, 0]); const r = vec3(n.r, [0, 0, 0]); const s = vec3(n.s)
  g.position.set(p[0], p[1], p[2]); g.rotation.set(r[0] * D, r[1] * D, r[2] * D)
  const rest = g.userData.rest ||= { p: [0, 0, 0], r: [0, 0, 0], s: [1, 1, 1] }
  rest.p[0] = p[0]; rest.p[1] = p[1]; rest.p[2] = p[2]
  rest.r[0] = r[0] * D; rest.r[1] = r[1] * D; rest.r[2] = r[2] * D
  // `s` scales only the node's own shape: a node with no shape (a bone pivot) has
  // none, so its rest scale is 1 — an sx/sy/sz track then scales its group (and
  // subtree) from 1, never jumping to an `s` that does nothing at rest
  if (g.userData.mesh) { rest.s[0] = s[0]; rest.s[1] = s[1]; rest.s[2] = s[2] } else { rest.s[0] = 1; rest.s[1] = 1; rest.s[2] = 1; g.scale.set(1, 1, 1) }
  g.userData.applied = null // at rest now: the next applyOffsets writes
}

// look: { color, tint } — the look-wide colour multiplier and the group tint
export function buildNode (root, n, res, look) {
  const g = new THREE.Group()
  if (n?.shape) {
    const k = stdMatKey(matData(n, look))
    const m = new THREE.Mesh(res.use(root, geoKey(n.shape), shapeGeo(n.shape)), res.use(root, k, stdMat(matData(n, look))))
    m.scale.fromArray(vec3(n.s)); m.userData.matKey = k
    g.add(m); g.userData.mesh = m
  }
  pose(g, n ?? {})
  if (n?.name) { g.name = String(n.name); (root.userData.bones ||= new Map()).set(String(n.name), g) }
  if (n?.anchor) { g.userData.anchor = String(n.anchor); (root.userData.anchors ||= {})[String(n.anchor)] = g }
  for (const c of Array.isArray(n?.children) ? n.children : []) g.add(buildNode(root, c, res, look))
  return g
}

export function patchNode (root, g, n, res, look) {
  const m = g.userData.mesh
  if (m) {
    const k = stdMatKey(matData(n, look))
    if (k !== m.userData.matKey) { m.material = res.swap(root, m.userData.matKey, k, stdMat(matData(n, look))); m.userData.matKey = k }
    m.scale.fromArray(vec3(n.s))
  }
  pose(g, n)
  const kids = g.children.filter((c) => c !== m)
  ;(Array.isArray(n?.children) ? n.children : []).forEach((c, i) => patchNode(root, kids[i], c, res, look))
}

// build every top-level node under root (root.userData.bones / anchors reset)
export function buildNodes (root, nodes, res, look) {
  root.userData.bones = new Map(); root.userData.anchors = {}
  for (const n of Array.isArray(nodes) ? nodes : []) root.add(buildNode(root, n, res, look))
}

// root's node children (it may also hold non-node children, e.g. a placeholder)
export function patchNodes (root, nodes, res, look) {
  const kids = root.children.filter((c) => !c.userData.notNode)
  ;(Array.isArray(nodes) ? nodes : []).forEach((n, i) => patchNode(root, kids[i], n, res, look))
}
