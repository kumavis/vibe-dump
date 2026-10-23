// Baking a miniature (DESIGN §1.1: models.js's bake, R7). A miniature is ~40
// primitives in a dozen colours. Bake everything that doesn't animate on its
// own into one vertex-coloured mesh per material class (plain, metal,
// glowing...), so a whole army costs a few hundred draw calls instead of
// several thousand. Subtrees marked `keep` (a trebuchet's arm, its wheels, a
// glowing gem) are baked separately and stay movable.
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

function flipWinding(geo) {
  for (const name of ['position', 'normal']) {
    const a = geo.getAttribute(name)
    for (let i = 0; i < a.count; i += 3) {
      const x = a.getX(i + 1), y = a.getY(i + 1), z = a.getZ(i + 1)
      a.setXYZ(i + 1, a.getX(i + 2), a.getY(i + 2), a.getZ(i + 2))
      a.setXYZ(i + 2, x, y, z)
    }
  }
}

// one material per class, shared by every figure baked
const classMats = new Map()
function classKey(m) {
  return [m.metalness, m.roughness, m.emissiveIntensity > 0 ? m.emissive.getHex() : 0, m.emissiveIntensity, m.transparent, m.opacity, m.side, m.flatShading].join('|')
}
export function bake(root) {
  root.updateMatrixWorld(true)
  const inv = new THREE.Matrix4().copy(root.matrixWorld).invert()
  const rel = new THREE.Matrix4()
  const classes = new Map()
  const doomed = []
  const walk = (o) => {
    for (const c of o.children) {
      if (c.userData.keep) {
        bake(c)
        continue
      }
      if (c.isMesh) {
        const m = c.material
        const key = classKey(m)
        if (!classes.has(key)) classes.set(key, { m, geos: [] })
        const src = c.geometry.index ? c.geometry.toNonIndexed() : c.geometry
        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', src.getAttribute('position').clone())
        geo.setAttribute('normal', src.getAttribute('normal').clone())
        geo.applyMatrix4(rel.multiplyMatrices(inv, c.matrixWorld))
        // Baking bakes the transform into the vertices, so three can no longer
        // flip front faces for a mirrored (negative-scale) part. Do it here.
        if (rel.determinant() < 0) flipWinding(geo)
        const n = geo.getAttribute('position').count
        const col = new Float32Array(n * 3)
        for (let i = 0; i < n; i++) col.set([m.color.r, m.color.g, m.color.b], i * 3)
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
        classes.get(key).geos.push(geo)
        doomed.push(c)
      }
      walk(c)
    }
  }
  walk(root)
  for (const c of doomed) c.parent.remove(c)
  for (const [key, { m, geos }] of classes) {
    if (!classMats.has(key)) {
      classMats.set(key, new THREE.MeshStandardMaterial({
        vertexColors: true, metalness: m.metalness, roughness: m.roughness, flatShading: m.flatShading,
        emissive: m.emissive, emissiveIntensity: m.emissiveIntensity, transparent: m.transparent, opacity: m.opacity, side: m.side,
      }))
    }
    root.add(new THREE.Mesh(mergeGeometries(geos), classMats.get(key)))
  }
}
