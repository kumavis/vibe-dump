// primitive: { shape: box|sphere|cone|cylinder|capsule, size: [x,y,z], color, roughness, metalness }
// Unit geometry scaled by size and lifted so it stands on the entity's origin.
import * as THREE from 'three'
import { geoKey, shapeGeo, stdMatKey, stdMat, tintColor, normShape, SHAPES } from '../resources.js'
import { kindProp, defaultsOf, anchorPoint, vec3 } from './common.js'

const schema = {
  type: 'object',
  properties: {
    kind: kindProp('primitive'),
    shape: { enum: SHAPES, title: 'shape', default: 'box', 'x-immutable': true },
    size: { type: 'array', items: { type: 'number', minimum: 0.01, maximum: 100 }, minItems: 3, maxItems: 3, title: 'size (m)', default: [1, 1, 1] },
    color: { type: 'string', format: 'color', title: 'colour', default: '#88aa55' },
    roughness: { type: 'number', minimum: 0, maximum: 1, step: 0.05, title: 'roughness', default: 0.8 },
    metalness: { type: 'number', minimum: 0, maximum: 1, step: 0.05, title: 'metalness', default: 0 },
  },
}

const matData = (d) => ({ color: tintColor(d.color ?? '#88aa55', d.tint), roughness: d.roughness, metalness: d.metalness })

function place (g, d) {
  const [x, y, z] = vec3(d.size)
  const m = g.userData.mesh
  m.scale.set(x, y, z); m.position.y = y / 2
  g.userData.seat.position.set(0, y, 0); g.userData.head.position.set(0, y, 0)
}

export default {
  schema,
  defaults: defaultsOf(schema),
  create (d, { res }) {
    const g = new THREE.Group(); const m = new THREE.Mesh()
    m.geometry = res.use(g, geoKey(d.shape), shapeGeo(d.shape))
    m.material = res.use(g, stdMatKey(matData(d)), stdMat(matData(d)))
    g.add(m); g.userData.mesh = m; g.userData.shape = normShape(d.shape); g.userData.pick = 'mesh'
    g.userData.seat = anchorPoint(g, 'seat'); g.userData.head = anchorPoint(g, 'head')
    place(g, d)
    return g
  },
  // shape, colour and size all patch in place: a shape swap is just another shared geometry
  update (g, d, prev, { res }) {
    const m = g.userData.mesh
    m.geometry = res.swap(g, geoKey(prev.shape), geoKey(d.shape), shapeGeo(d.shape))
    m.material = res.swap(g, stdMatKey(matData(prev)), stdMatKey(matData(d)), stdMat(matData(d)))
    g.userData.shape = normShape(d.shape)
    place(g, d)
  },
  dispose () {},
  anchors: (g) => ({ seat: g.userData.seat, head: g.userData.head }),
}
