// tree: { nodes: [{ shape?, p, r, s, color, roughness, metalness, anchor?, children }] }
// The "sculpt it" path (design §8): a JSON node tree. Each node is a Group placed
// by p and r (degrees); s scales only that node's own shape, so children sit in
// unscaled parent space and resizing a torso never stretches the head. A node may
// carry `anchor: 'seat'|'head'` to name the point a rider or camera attaches to.
import * as THREE from 'three'
import { geoKey, shapeGeo, stdMatKey, stdMat, tintColor, normShape } from '../resources.js'
import { kindProp, defaultsOf, vec3 } from './common.js'

const D = Math.PI / 180

const schema = {
  type: 'object',
  properties: {
    kind: kindProp('tree'),
    nodes: { type: 'array', 'x-json': true, title: 'nodes', default: [{ shape: 'box', p: [0, 0.5, 0], s: [1, 1, 1], color: '#aa7744' }] },
  },
}

// Structure = shapes, nesting and anchor names. Same structure -> patch poses,
// scales and colours in place; anything else rebuilds (tested in Node).
export function signature (nodes) {
  if (!Array.isArray(nodes)) return ''
  return nodes.map((n) => `${n?.shape ? normShape(n.shape) : ''}${n?.anchor ? '@' + String(n.anchor) : ''}(${signature(n?.children)})`).join(',')
}

const matData = (n, tint) => ({ color: tintColor(n.color ?? '#cccccc', tint), roughness: n.roughness, metalness: n.metalness })

function pose (g, n) {
  const p = vec3(n.p, [0, 0, 0]); const r = vec3(n.r, [0, 0, 0])
  g.position.set(p[0], p[1], p[2]); g.rotation.set(r[0] * D, r[1] * D, r[2] * D)
}

function build (root, n, res, tint) {
  const g = new THREE.Group(); pose(g, n)
  if (n?.shape) {
    const k = stdMatKey(matData(n, tint))
    const m = new THREE.Mesh(res.use(root, geoKey(n.shape), shapeGeo(n.shape)), res.use(root, k, stdMat(matData(n, tint))))
    m.scale.fromArray(vec3(n.s)); m.userData.matKey = k
    g.add(m); g.userData.mesh = m
  }
  if (n?.anchor) { g.userData.anchor = String(n.anchor); (root.userData.anchors ||= {})[String(n.anchor)] = g }
  for (const c of Array.isArray(n?.children) ? n.children : []) g.add(build(root, c, res, tint))
  return g
}

function patch (root, g, n, res, tint) {
  pose(g, n)
  const m = g.userData.mesh
  if (m) {
    const k = stdMatKey(matData(n, tint))
    m.material = res.swap(root, m.userData.matKey, k, stdMat(matData(n, tint))); m.userData.matKey = k
    m.scale.fromArray(vec3(n.s))
  }
  const kids = g.children.filter((c) => c !== m)
  ;(Array.isArray(n?.children) ? n.children : []).forEach((c, i) => patch(root, kids[i], c, res, tint))
}

export default {
  schema,
  defaults: defaultsOf(schema),
  signature,
  create (d, { res }) {
    const root = new THREE.Group(); root.userData.sig = signature(d.nodes); root.userData.pick = 'mesh'
    for (const n of Array.isArray(d.nodes) ? d.nodes : []) root.add(build(root, n, res, d.tint))
    return root
  },
  update (root, d, prev, { res }) {
    if (signature(d.nodes) !== root.userData.sig) return false
    ;(Array.isArray(d.nodes) ? d.nodes : []).forEach((n, i) => patch(root, root.children[i], n, res, d.tint))
  },
  dispose () {},
  anchors: (root) => root.userData.anchors ?? {},
}
