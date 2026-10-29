// The `light` component: one three.js light as a child of the entity root.
// Kind changes rebuild; colour, intensity, distance and offset patch in place.
import * as THREE from 'three'
import { normColor } from './resources.js'
import { finite, vec3 } from './kinds/common.js'

export const LIGHT_KINDS = ['point', 'spot', 'directional', 'ambient', 'hemisphere']
const kindOf = (d) => (LIGHT_KINDS.includes(String(d?.kind)) ? String(d.kind) : 'point')

function make (kind, d) {
  const c = normColor(d.color, '#ffffff')
  switch (kind) {
    case 'spot': { const l = new THREE.SpotLight(c); l.angle = Math.PI / 5; l.penumbra = 0.4; return l }
    case 'directional': return new THREE.DirectionalLight(c)
    case 'ambient': return new THREE.AmbientLight(c)
    case 'hemisphere': return new THREE.HemisphereLight(c, normColor(d.groundColor, '#445533'))
    default: return new THREE.PointLight(c)
  }
}

function apply (l, d) {
  l.color.set(normColor(d.color, '#ffffff'))
  l.intensity = finite(d.intensity, 1)
  if ('distance' in l) l.distance = Math.max(0, finite(d.distance, 0))
  const o = vec3(d.offset, [0, 0, 0]); l.position.set(o[0], o[1], o[2])
  // spot and directional aim straight down from wherever they hang
  if (l.target) { l.target.position.set(0, -1, 0) }
}

export const lightHandler = {
  create (d) {
    const kind = kindOf(d); const l = make(kind, d)
    l.userData.lightKind = kind; l.userData.noPick = true
    if (l.target) l.add(l.target)
    apply(l, d)
    return l
  },
  update (l, d) {
    if (kindOf(d) !== l.userData.lightKind) return false
    apply(l, d)
  },
  dispose (l) { l.dispose?.() },
}
