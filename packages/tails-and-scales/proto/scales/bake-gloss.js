// view/models/bake.js, taught the glossy figures: what integration would change there (viewer.js's
// bake=1 shows a baked figure draws the same as the unbaked one; bake-check.mjs shows a squirrel kit
// figure bakes exactly as bake.js bakes it). bake.js merges a figure into one mesh per material class,
// keeping position, normal and ONE colour per part, and draws each class with a MeshStandardMaterial built
// from the class key's fields. Marked ★ below, the three changes, each a no-op for the kit's plain parts:
//   ★1 classKey keeps every one of bake.js's fields (flatShading included) and, for a glossy part only,
//      appends gloss.js's physical fields (type, clearcoat and its roughness, specular, iridescence, env
//      intensity) and its shader parameters, so a hood and a body don't merge into one finish;
//   ★2 a part's own vertex colours are read (times its material's colour) only when its material has
//      vertexColors on, as three would draw it: the skin's pattern, the scutes' creases, the head's jaw,
//      the skull's wash. A plain part is its material's colour, as before; a skin part also carries its
//      `plain` colour (the shader fades the markings toward it on a small figure);
//   ★3 a glossy class is drawn with gloss.js's classMaterial (the same MeshPhysicalMaterial, env map and
//      shader patch as its parts, its colour moved into the vertices); a plain class with bake.js's own
//      MeshStandardMaterial, as before.
// The skin shader reads only object-space position and normal, which baking carries (in the figure's
// space: serpents.js folds every part's own scale into its geometry first, so the scales keep their size
// relative to the figure). No UVs are needed anywhere.
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { isGlossy, finishFields, classMaterial as glossClass } from './gloss.js'

// (★2: colours and plain flip with the corners they belong to)
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
  // ★1
  return (isGlossy(m) ? [...old, ...finishFields(m)] : old).join('|')
}
export function bakeGloss(root) {
  root.updateMatrixWorld(true)
  const inv = new THREE.Matrix4().copy(root.matrixWorld).invert()
  const rel = new THREE.Matrix4()
  const classes = new Map()
  const doomed = []
  const walk = (o) => {
    for (const c of o.children) {
      if (c.userData.keep) {
        bakeGloss(c)
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
        // ★2 (before the transform and the flip, so a colour stays with its corner)
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
    // (a class merges only geometries with the same attributes: a part with no plain colour of its own
    // is plain where it is)
    if (geos.some((g) => g.getAttribute('plain'))) for (const g of geos) if (!g.getAttribute('plain')) g.setAttribute('plain', g.getAttribute('color').clone())
    if (!classMats.has(key)) {
      // ★3
      classMats.set(key, isGlossy(m) ? glossClass(key, m) : new THREE.MeshStandardMaterial({
        vertexColors: true, metalness: m.metalness, roughness: m.roughness, flatShading: m.flatShading,
        emissive: m.emissive, emissiveIntensity: m.emissiveIntensity, transparent: m.transparent, opacity: m.opacity, side: m.side,
      }))
    }
    root.add(new THREE.Mesh(mergeGeometries(geos), classMats.get(key)))
  }
}
