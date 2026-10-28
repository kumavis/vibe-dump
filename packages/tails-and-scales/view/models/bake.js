// Baking a miniature (DESIGN §1.1: models.js's bake, R7). A miniature is ~40
// primitives in a dozen colours. Bake everything that doesn't animate on its
// own into one vertex-coloured mesh per material class (plain, metal,
// glowing...), so a whole army costs a few hundred draw calls instead of
// several thousand. Subtrees marked `keep` (a trebuchet's arm, its wheels, a
// glowing gem) are baked separately and stay movable.
//
// (V2) It also bakes the glossy figures (view/models/gloss/: the 'new'
// style's Ssithra, cache.js), with three changes, each a no-op for a plain
// part (the classic kits', the bases'), so those bake exactly as before
// (sim/bake-check.mjs holds them to the R7 code, node for node):
//   1. classKey keeps every old field (flatShading included) and, for a
//      glossy part only (gloss.js's isGlossy), appends its finish's fields
//      (the physical ones, clearcoat to env intensity, and the shader's
//      parameters), so a hood and a body don't merge into one finish;
//   2. a part's own vertex colours are read (times its material's colour)
//      only when its material has `vertexColors` on, as three would draw
//      it (the skin's markings and occlusion, the skull's wash); a plain
//      part is its material's colour, as ever. A skin part also carries
//      `plain`, its colour without the markings (the shader fades to it on
//      a small figure); both flip with their corners on a mirrored part;
//   3. a glossy class is drawn with gloss.js's classMaterial (the same
//      MeshPhysicalMaterial, env map and shader patch as its parts, its
//      colour moved into the vertices); a plain class with the
//      MeshStandardMaterial built from its key's fields, as ever.
// The skin shader reads only object-space position and normal (and
// `plain`), which baking carries in the figure's space; no UVs anywhere.
//
// (V2) And for the splat-fur Bushtails (view/models/squirrel.js), a fourth,
// also a no-op for every other figure (whose every node is on three's
// default layer): 4. a class's merged mesh is made on its bake root's
// layers, so a kept subtree on a layer of its own (a squirrel's shadow
// proxy, on splats.js's SHADOW_LAYER alone) stays on it once baked (and a
// clone, which copies a node's layers, keeps it). A splat mesh is kept
// (userData.keep) and has no children, so it is left as it is.
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { isGlossy, finishFields, classMaterial as glossClass } from './gloss/gloss.js'

// ((V2) a part's own colours and plain colour flip with their corners)
function flipWinding(geo) {
  for (const name of ['position', 'normal', 'color', 'plain']) {
    const a = geo.getAttribute(name)
    if (!a) continue
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
  const old = [m.metalness, m.roughness, m.emissiveIntensity > 0 ? m.emissive.getHex() : 0, m.emissiveIntensity, m.transparent, m.opacity, m.side, m.flatShading]
  // ((V2) 1: a glossy part's finish too)
  return (isGlossy(m) ? [...old, ...finishFields(m)] : old).join('|')
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
        // ((V2) 2: its own colours, before the transform and the flip, so
        // each stays with its corner)
        const own = m.vertexColors ? src.getAttribute('color') : null
        if (own) {
          const n = own.count, col = new Float32Array(n * 3)
          for (let i = 0; i < n; i++) col.set([own.getX(i) * m.color.r, own.getY(i) * m.color.g, own.getZ(i) * m.color.b], i * 3)
          geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
          const plain = src.getAttribute('plain')
          if (plain) geo.setAttribute('plain', plain.clone())
        }
        geo.applyMatrix4(rel.multiplyMatrices(inv, c.matrixWorld))
        // Baking bakes the transform into the vertices, so three can no longer
        // flip front faces for a mirrored (negative-scale) part. Do it here.
        if (rel.determinant() < 0) flipWinding(geo)
        if (!own) {
          const n = geo.getAttribute('position').count
          const col = new Float32Array(n * 3)
          for (let i = 0; i < n; i++) col.set([m.color.r, m.color.g, m.color.b], i * 3)
          geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
        }
        classes.get(key).geos.push(geo)
        doomed.push(c)
      }
      walk(c)
    }
  }
  walk(root)
  for (const c of doomed) c.parent.remove(c)
  for (const [key, { m, geos }] of classes) {
    // ((V2) a class merges only geometries with the same attributes: in a
    // class with a plain colour, a part without one is plain where it is)
    if (geos.some((g) => g.getAttribute('plain'))) for (const g of geos) if (!g.getAttribute('plain')) g.setAttribute('plain', g.getAttribute('color').clone())
    if (!classMats.has(key)) {
      // ((V2) 3: a glossy class in its own finish)
      classMats.set(key, isGlossy(m) ? glossClass(key, m) : new THREE.MeshStandardMaterial({
        vertexColors: true, metalness: m.metalness, roughness: m.roughness, flatShading: m.flatShading,
        emissive: m.emissive, emissiveIntensity: m.emissiveIntensity, transparent: m.transparent, opacity: m.opacity, side: m.side,
      }))
    }
    const merged = new THREE.Mesh(mergeGeometries(geos), classMats.get(key))
    // ((V2) 4: on its root's layers)
    merged.layers.mask = root.layers.mask
    root.add(merged)
  }
}
