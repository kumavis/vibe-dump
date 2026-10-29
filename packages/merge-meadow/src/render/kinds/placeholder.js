// What an unregistered representation kind renders as: a visible, pickable
// wireframe cube, so a typo in `kind` (or a kind an agent has not registered
// yet) shows up in the world instead of making the entity vanish. When the kind
// is registered later, the reconciler rebuilds these in place.
import * as THREE from 'three'
import { geoKey, shapeGeo } from '../resources.js'

export default {
  schema: { type: 'object', properties: {} },
  defaults: {},
  create (d, { res }) {
    const g = new THREE.Group()
    const m = new THREE.Mesh(res.use(g, geoKey('box'), shapeGeo('box')),
      res.use(g, 'mat:placeholder:unknown', () => new THREE.MeshBasicMaterial({ color: '#ff3cc8', wireframe: true })))
    m.position.y = 0.5
    g.add(m); g.userData.pick = 'box'; g.userData.placeholder = true
    return g
  },
  update: () => false,
  dispose () {},
}
