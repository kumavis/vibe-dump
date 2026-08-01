import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

// ---------------------------------------------------------------------------
// Automatic skin binding (compact version of the solver proved out on
// space-goblin). Parts are authored in bind-pose world space; each declares
// its candidate bones (or one rigid bone) and every vertex is weighted by
// inverse distance to those bones' medial-axis segments, then smoothed once
// over a spatial hash so elbows and knees round off instead of creasing.
// ---------------------------------------------------------------------------

const _v = new THREE.Vector3()
const _ab = new THREE.Vector3()
const _ap = new THREE.Vector3()

function distSqToSegment(px, py, pz, a, b) {
  _ab.subVectors(b, a)
  _ap.set(px - a.x, py - a.y, pz - a.z)
  const len2 = _ab.lengthSq()
  const t = len2 > 1e-12 ? THREE.MathUtils.clamp(_ap.dot(_ab) / len2, 0, 1) : 0
  _v.copy(a).addScaledVector(_ab, t)
  const dx = _v.x - px
  const dy = _v.y - py
  const dz = _v.z - pz
  return dx * dx + dy * dy + dz * dz
}

/** Strip a geometry to indexed position+normal+color, non-shared attributes dropped. */
function normalize(geometry) {
  const g = geometry
  const keep = ['position', 'normal', 'color']
  for (const name of Object.keys(g.attributes)) {
    if (!keep.includes(name)) g.deleteAttribute(name)
  }
  if (!g.attributes.color) {
    const n = g.attributes.position.count
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 3).fill(1), 3))
  }
  if (!g.index) {
    const n = g.attributes.position.count
    const idx = new Uint32Array(n)
    for (let i = 0; i < n; i++) idx[i] = i
    g.setIndex(new THREE.BufferAttribute(idx, 1))
  }
  return g
}

/**
 * @typedef {object} SkinPart
 * @property {THREE.BufferGeometry} geometry   bind-pose world space, vertex-coloured
 * @property {string} material                 'body' | 'glow'
 * @property {string[]} [bones]                candidate bones (omit with rigid)
 * @property {string} [rigid]                  bind 100% to this bone
 * @property {number} [falloff]                inverse-distance exponent (default 4)
 * @property {number} [smooth]                 smoothing passes (default 1)
 */

/**
 * Merge parts into one skinnable geometry (grouped by material) and solve
 * weights. Returns { geometry, materials } where materials[i] names group i.
 */
export function buildSkinnedGeometry(parts, { boneNames, segments }) {
  const boneIndex = Object.fromEntries(boneNames.map((n, i) => [n, i]))

  const byMaterial = new Map()
  for (const part of parts) {
    if (!part || !part.geometry) continue
    const key = part.material || 'body'
    if (!byMaterial.has(key)) byMaterial.set(key, [])
    byMaterial.get(key).push(part)
  }

  const materials = [...byMaterial.keys()]
  const spans = []
  const perMaterial = []
  let base = 0
  for (const key of materials) {
    const geos = []
    for (const part of byMaterial.get(key)) {
      const g = normalize(part.geometry)
      spans.push({ part, start: base, count: g.attributes.position.count })
      base += g.attributes.position.count
      geos.push(g)
    }
    const merged = geos.length === 1 ? geos[0] : mergeGeometries(geos)
    if (!merged) throw new Error(`skinning: failed to merge group "${key}"`)
    perMaterial.push(merged)
  }
  const geometry = perMaterial.length === 1 ? perMaterial[0] : mergeGeometries(perMaterial, true)
  if (!geometry) throw new Error('skinning: failed to merge material groups')
  if (perMaterial.length === 1) geometry.addGroup(0, Infinity, 0)

  const total = geometry.attributes.position.count
  const pos = geometry.attributes.position.array
  const skinIndex = new Uint16Array(total * 4)
  const skinWeight = new Float32Array(total * 4)

  for (const { part, start, count } of spans) {
    if (part.rigid) {
      const bi = boneIndex[part.rigid]
      if (bi === undefined) throw new Error(`skinning: unknown rigid bone "${part.rigid}"`)
      for (let i = 0; i < count; i++) {
        skinIndex[(start + i) * 4] = bi
        skinWeight[(start + i) * 4] = 1
      }
      continue
    }

    const names = part.bones || boneNames
    const segs = []
    const ids = []
    for (const n of names) {
      const s = segments[n]
      if (!s) throw new Error(`skinning: no segment for bone "${n}"`)
      segs.push(s)
      ids.push(boneIndex[n])
    }
    const C = segs.length
    const falloff = part.falloff ?? 4
    const W = new Float32Array(count * C)
    const d2 = new Float32Array(C)

    for (let i = 0; i < count; i++) {
      const px = pos[(start + i) * 3]
      const py = pos[(start + i) * 3 + 1]
      const pz = pos[(start + i) * 3 + 2]
      let best = Infinity
      for (let c = 0; c < C; c++) {
        d2[c] = distSqToSegment(px, py, pz, segs[c].a, segs[c].b)
        if (d2[c] < best) best = d2[c]
      }
      const cutoff = best * 10.5 + 1e-6 // ignore bones >~3.2x the nearest distance
      let sum = 0
      for (let c = 0; c < C; c++) {
        if (d2[c] > cutoff) continue
        const w = 1 / Math.pow(Math.sqrt(d2[c]) + 1e-4, falloff)
        W[i * C + c] = w
        sum += w
      }
      if (sum > 0) for (let c = 0; c < C; c++) W[i * C + c] /= sum
      else W[i * C] = 1
    }

    // One neighbourhood-average pass rounds the joints.
    const passes = part.smooth ?? 1
    if (passes > 0 && count > 0) {
      const cell = 0.045
      const grid = new Map()
      const key = (x, y, z) => x * 73856093 ^ y * 19349663 ^ z * 83492791
      for (let i = 0; i < count; i++) {
        const k = key(
          Math.floor(pos[(start + i) * 3] / cell),
          Math.floor(pos[(start + i) * 3 + 1] / cell),
          Math.floor(pos[(start + i) * 3 + 2] / cell),
        )
        let b = grid.get(k)
        if (!b) grid.set(k, (b = []))
        b.push(i)
      }
      const r2 = cell * cell
      let src = W
      let dst = new Float32Array(count * C)
      for (let pass = 0; pass < passes; pass++) {
        dst.fill(0)
        for (let i = 0; i < count; i++) {
          const px = pos[(start + i) * 3]
          const py = pos[(start + i) * 3 + 1]
          const pz = pos[(start + i) * 3 + 2]
          const gx = Math.floor(px / cell)
          const gy = Math.floor(py / cell)
          const gz = Math.floor(pz / cell)
          let n = 0
          for (let oz = -1; oz <= 1; oz++)
            for (let oy = -1; oy <= 1; oy++)
              for (let ox = -1; ox <= 1; ox++) {
                const b = grid.get(key(gx + ox, gy + oy, gz + oz))
                if (!b) continue
                for (const j of b) {
                  const dx = pos[(start + j) * 3] - px
                  const dy = pos[(start + j) * 3 + 1] - py
                  const dz = pos[(start + j) * 3 + 2] - pz
                  if (dx * dx + dy * dy + dz * dz > r2) continue
                  for (let c = 0; c < C; c++) dst[i * C + c] += src[j * C + c]
                  n++
                }
              }
          let sum = 0
          for (let c = 0; c < C; c++) sum += dst[i * C + c]
          if (sum > 0) for (let c = 0; c < C; c++) dst[i * C + c] /= sum
          else for (let c = 0; c < C; c++) dst[i * C + c] = src[i * C + c]
        }
        const tmp = src
        src = dst
        dst = tmp === W ? new Float32Array(count * C) : tmp
      }
      if (src !== W) W.set(src)
    }

    // Compress to top-4 influences.
    for (let i = 0; i < count; i++) {
      const row = i * C
      let i0 = -1, i1 = -1, i2 = -1, i3 = -1
      let w0 = 0, w1 = 0, w2 = 0, w3 = 0
      for (let c = 0; c < C; c++) {
        const w = W[row + c]
        if (w <= 0) continue
        if (w > w0) { w3 = w2; i3 = i2; w2 = w1; i2 = i1; w1 = w0; i1 = i0; w0 = w; i0 = c }
        else if (w > w1) { w3 = w2; i3 = i2; w2 = w1; i2 = i1; w1 = w; i1 = c }
        else if (w > w2) { w3 = w2; i3 = i2; w2 = w; i2 = c }
        else if (w > w3) { w3 = w; i3 = c }
      }
      const sum = w0 + w1 + w2 + w3 || 1
      const o = (start + i) * 4
      skinIndex[o] = i0 >= 0 ? ids[i0] : 0
      skinIndex[o + 1] = i1 >= 0 ? ids[i1] : 0
      skinIndex[o + 2] = i2 >= 0 ? ids[i2] : 0
      skinIndex[o + 3] = i3 >= 0 ? ids[i3] : 0
      skinWeight[o] = w0 / sum
      skinWeight[o + 1] = w1 / sum
      skinWeight[o + 2] = w2 / sum
      skinWeight[o + 3] = w3 / sum
    }
  }

  geometry.setAttribute('skinIndex', new THREE.BufferAttribute(skinIndex, 4))
  geometry.setAttribute('skinWeight', new THREE.BufferAttribute(skinWeight, 4))
  geometry.computeBoundingSphere()
  geometry.computeBoundingBox()
  return { geometry, materials }
}

/** Weight rows must sum to ~1 or the mesh collapses when it animates. */
export function validateSkin(geometry) {
  const w = geometry.attributes.skinWeight.array
  const n = geometry.attributes.skinWeight.count
  let bad = 0
  let worst = 0
  for (let i = 0; i < n; i++) {
    const s = w[i * 4] + w[i * 4 + 1] + w[i * 4 + 2] + w[i * 4 + 3]
    const err = Math.abs(s - 1)
    if (err > 1e-3) bad++
    if (err > worst) worst = err
  }
  return { vertices: n, badRows: bad, worstError: worst }
}
