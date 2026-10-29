// Small helpers every kind shares: the hidden `kind` property of a kind's schema,
// defaults read off a schema, and named anchor objects.
import * as THREE from 'three'

// `kind` is written by the kind switcher as one `replace` (design §2.2), never by a
// form field, so the inspector hides it
export const kindProp = (name) => ({ enum: [name], default: name, 'x-immutable': true, 'x-hidden': true, title: 'kind' })

const copy = (v) => (v == null || typeof v !== 'object' ? v : Array.isArray(v) ? v.map(copy) : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, copy(x)])))

export function defaultsOf (schema) {
  const o = {}
  for (const [k, p] of Object.entries(schema?.properties ?? {})) {
    if (p.default !== undefined) o[k] = copy(p.default)
    else if (p.type === 'object' && p.properties) o[k] = defaultsOf(p)
  }
  return o
}

// a named, invisible, unpickable point a rider's seat or a camera can attach to
export function anchorPoint (parent, name, x = 0, y = 0, z = 0) {
  const a = new THREE.Object3D()
  a.name = 'anchor:' + name; a.userData.anchor = name; a.userData.noPick = true
  a.position.set(x, y, z)
  parent.add(a)
  return a
}

export const finite = (v, d) => (Number.isFinite(+v) && v !== null && v !== '' ? +v : d)
export const clamp = (v, d, lo, hi) => Math.min(hi, Math.max(lo, finite(v, d)))
export const vec3 = (v, d = [1, 1, 1]) => Array.isArray(v) ? [0, 1, 2].map((i) => finite(v[i], d[i])) : Number.isFinite(+v) && v !== null ? [+v, +v, +v] : [...d]
