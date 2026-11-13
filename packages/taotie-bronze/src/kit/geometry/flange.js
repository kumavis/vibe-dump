// STATUS: first pass — a straight notched flange strip with an optional
// beaked top. Keep `flange(opts)`; the flange specialist adds hooked/T-slot
// profiles and curved paths (along a lathe meridian) behind the same call.
//
// Flanges (扉棱) began as the fins of bronze that leaked into the joints
// between mould sections; Anyang founders made a feature of them, cutting the
// joint deep and notching it, so a flange always sits on a mould seam — the
// corners of a fang vessel and the centre line of each taotie.

import * as THREE from 'three'

/**
 * @param {object} o
 * @param {THREE.Vector3} o.from   root start (bottom), on the wall surface
 * @param {THREE.Vector3} o.to     root end (top)
 * @param {THREE.Vector3} o.out    outward direction (perpendicular-ish to the root)
 * @param {number} o.height        projection from the wall (mm)
 * @param {number} o.thickness     blade thickness (mm)
 * @param {{every?:number, depth?:number, width?:number}|null} [o.notches]  every mm, depth as fraction of height, width mm
 * @param {number} [o.hook]        how far the top end beaks up past `to` (mm)
 * @param {number} [o.embed]       how far the root sinks into the wall (mm), hides the joint
 * @param {THREE.Material} o.material
 * @param {string} [o.part]
 */
export function flange({ from, to, out, height, thickness, notches = { every: 22, depth: 0.4, width: 3 }, hook = 0, embed, material, part = 'flanges' }) {
  const D = new THREE.Vector3().subVectors(to, from)
  const L = D.length()
  D.normalize()
  const O = out.clone().addScaledVector(D, -out.dot(D)).normalize()
  const S = new THREE.Vector3().crossVectors(D, O)
  const e = embed ?? Math.max(1, thickness * 0.6)
  const h = height

  // outline in (s along root, t outward)
  const shape = new THREE.Shape()
  shape.moveTo(0, -e)
  shape.lineTo(L, -e)
  if (hook > 0) {
    shape.lineTo(L + hook * 0.15, h * 0.55)
    shape.lineTo(L + hook, h)
  } else shape.lineTo(L, h)
  if (notches && notches.every > 0) {
    const nd = h * (notches.depth ?? 0.4)
    const nw = notches.width ?? 3
    const n = Math.floor(L / notches.every)
    const off = (L - (n - 1) * notches.every) / 2
    for (let k = n - 1; k >= 0; k--) {
      const s = off + k * notches.every
      shape.lineTo(s + nw / 2, h)
      shape.lineTo(s + nw / 2, h - nd)
      shape.lineTo(s - nw / 2, h - nd)
      shape.lineTo(s - nw / 2, h)
    }
  }
  shape.lineTo(0, h)
  shape.closePath()

  const bevel = Math.min(1.2, thickness * 0.18)
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.1, thickness - 2 * bevel),
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    curveSegments: 2,
  })
  geo.translate(0, 0, -(thickness - 2 * bevel) / 2)
  const m = new THREE.Matrix4().makeBasis(D, O, S).setPosition(from)
  geo.applyMatrix4(m)
  geo.computeBoundingBox()
  const mesh = new THREE.Mesh(geo, material)
  mesh.userData.part = part
  mesh.castShadow = mesh.receiveShadow = true
  return mesh
}
