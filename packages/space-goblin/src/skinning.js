import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { normalizeAttributes } from './geometry.js'

// ---------------------------------------------------------------------------
// Automatic skin binding
//
// There is no DCC tool in this pipeline, so weights are solved here: every part
// declares which bones are *allowed* to influence it, and each vertex is
// weighted by inverse distance to those bones' medial-axis segments. Raw
// inverse-distance weights alone give creased, candy-wrapper joints, so the
// solve runs a few Laplacian smoothing passes over a spatial hash of the part's
// vertices before compressing down to the four influences the GPU wants.
// ---------------------------------------------------------------------------

const _v = new THREE.Vector3()
const _ab = new THREE.Vector3()
const _ap = new THREE.Vector3()

/** Squared distance from point p to segment a-b. */
function distSqToSegment(p, a, b) {
  _ab.subVectors(b, a)
  _ap.subVectors(p, a)
  const len2 = _ab.lengthSq()
  const t = len2 > 1e-12 ? THREE.MathUtils.clamp(_ap.dot(_ab) / len2, 0, 1) : 0
  _v.copy(a).addScaledVector(_ab, t)
  return _v.distanceToSquared(p)
}

// ---- spatial hash --------------------------------------------------------

function buildGrid(positions, count, cell) {
  const map = new Map()
  const key = (x, y, z) => `${x},${y},${z}`
  for (let i = 0; i < count; i++) {
    const x = Math.floor(positions[i * 3] / cell)
    const y = Math.floor(positions[i * 3 + 1] / cell)
    const z = Math.floor(positions[i * 3 + 2] / cell)
    const k = key(x, y, z)
    let bucket = map.get(k)
    if (!bucket) map.set(k, (bucket = []))
    bucket.push(i)
  }
  return {
    map,
    cell,
    forEachNear(px, py, pz, fn) {
      const gx = Math.floor(px / cell)
      const gy = Math.floor(py / cell)
      const gz = Math.floor(pz / cell)
      for (let z = -1; z <= 1; z++) {
        for (let y = -1; y <= 1; y++) {
          for (let x = -1; x <= 1; x++) {
            const bucket = map.get(key(gx + x, gy + y, gz + z))
            if (bucket) for (let i = 0; i < bucket.length; i++) fn(bucket[i])
          }
        }
      }
    },
  }
}

// ---- the solve -----------------------------------------------------------

/**
 * Solve dense weights for one part over its candidate bones.
 *
 * @param {Float32Array} pos      flat xyz, bind-pose (part-local == world)
 * @param {number} count          vertex count
 * @param {{a:THREE.Vector3,b:THREE.Vector3}[]} segs  one per candidate bone
 * @param {object} o
 * @returns {Float32Array} count * segs.length, rows normalised
 */
function solveDenseWeights(pos, count, segs, { falloff = 4, smooth = 2, smoothRadius = 0.03, maxRatio = 3.2 }) {
  const C = segs.length
  const W = new Float32Array(count * C)
  const p = new THREE.Vector3()
  const d2 = new Float32Array(C)

  for (let i = 0; i < count; i++) {
    p.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2])
    let best = Infinity
    for (let c = 0; c < C; c++) {
      d2[c] = distSqToSegment(p, segs[c].a, segs[c].b)
      if (d2[c] < best) best = d2[c]
    }
    // Ignore bones that are far compared to the closest one; without this the
    // hips leak influence into the fingertips on a curled-up pose.
    const cutoff = best * maxRatio * maxRatio + 1e-6
    let sum = 0
    const row = i * C
    for (let c = 0; c < C; c++) {
      if (d2[c] > cutoff) continue
      const d = Math.sqrt(d2[c]) + 1e-4
      const w = 1 / Math.pow(d, falloff)
      W[row + c] = w
      sum += w
    }
    if (sum > 0) for (let c = 0; c < C; c++) W[row + c] /= sum
    else W[row] = 1
  }

  // Laplacian smoothing over nearby vertices — this is what turns a creased
  // elbow into a rounded one.
  if (smooth > 0 && count > 0) {
    const grid = buildGrid(pos, count, smoothRadius)
    const r2 = smoothRadius * smoothRadius
    let src = W
    let dst = new Float32Array(count * C)
    for (let pass = 0; pass < smooth; pass++) {
      dst.fill(0)
      for (let i = 0; i < count; i++) {
        const px = pos[i * 3]
        const py = pos[i * 3 + 1]
        const pz = pos[i * 3 + 2]
        let n = 0
        const row = i * C
        grid.forEachNear(px, py, pz, (j) => {
          const dx = pos[j * 3] - px
          const dy = pos[j * 3 + 1] - py
          const dz = pos[j * 3 + 2] - pz
          if (dx * dx + dy * dy + dz * dz > r2) return
          const jrow = j * C
          for (let c = 0; c < C; c++) dst[row + c] += src[jrow + c]
          n++
        })
        if (n === 0) {
          for (let c = 0; c < C; c++) dst[row + c] = src[row + c]
        } else {
          let sum = 0
          for (let c = 0; c < C; c++) sum += dst[row + c]
          if (sum > 0) for (let c = 0; c < C; c++) dst[row + c] /= sum
        }
      }
      const tmp = src
      src = dst
      dst = tmp === W ? new Float32Array(count * C) : tmp
    }
    if (src !== W) W.set(src)
  }

  return W
}

/**
 * @typedef {object} SkinPart
 * @property {THREE.BufferGeometry} geometry  in bind-pose world space
 * @property {string} material                material key (groups the merge)
 * @property {string[]} [bones]               candidate bones; omit with `rigid`
 * @property {string} [rigid]                 bind 100% to this single bone
 * @property {number} [falloff]               inverse-distance exponent
 * @property {number} [smooth]                smoothing passes
 * @property {number} [smoothRadius]
 */

/**
 * Merge parts into one skinnable geometry and solve its skin attributes.
 *
 * @param {SkinPart[]} parts
 * @param {object} o
 * @param {string[]} o.boneNames                skeleton order (index = bone id)
 * @param {Record<string,{a:THREE.Vector3,b:THREE.Vector3}>} o.segments
 * @returns {{ geometry: THREE.BufferGeometry, materials: string[] }}
 */
export function buildSkinnedGeometry(parts, { boneNames, segments }) {
  const boneIndex = Object.fromEntries(boneNames.map((n, i) => [n, i]))

  // Group parts by material so the final mesh has one draw group per material.
  const byMaterial = new Map()
  for (const part of parts) {
    if (!part || !part.geometry) continue
    const key = part.material || 'default'
    if (!byMaterial.has(key)) byMaterial.set(key, [])
    byMaterial.get(key).push(part)
  }

  const materials = [...byMaterial.keys()]
  const perMaterial = []
  /** @type {{part: SkinPart, start: number, count: number}[]} */
  const spans = []
  let runningBase = 0

  for (const key of materials) {
    const group = byMaterial.get(key)
    const geos = []
    const localSpans = []
    let local = 0
    for (const part of group) {
      const g = normalizeAttributes(part.geometry)
      const count = g.attributes.position.count
      localSpans.push({ part, start: local, count })
      local += count
      geos.push(g)
    }
    const merged = geos.length === 1 ? geos[0] : mergeGeometries(geos)
    if (!merged) throw new Error(`space-goblin: failed to merge material group "${key}"`)
    for (const s of localSpans) spans.push({ part: s.part, start: runningBase + s.start, count: s.count })
    runningBase += merged.attributes.position.count
    perMaterial.push(merged)
  }

  const geometry = perMaterial.length === 1 ? perMaterial[0] : mergeGeometries(perMaterial, true)
  if (!geometry) throw new Error('space-goblin: failed to merge material groups')
  if (perMaterial.length === 1) geometry.addGroup(0, Infinity, 0)

  const total = geometry.attributes.position.count
  const pos = geometry.attributes.position.array
  const skinIndex = new Uint16Array(total * 4)
  const skinWeight = new Float32Array(total * 4)

  for (const span of spans) {
    const { part, start, count } = span
    if (part.rigid) {
      const bi = boneIndex[part.rigid]
      if (bi === undefined) throw new Error(`space-goblin: unknown rigid bone "${part.rigid}"`)
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
      if (!s) throw new Error(`space-goblin: no segment for bone "${n}"`)
      segs.push(s)
      ids.push(boneIndex[n])
    }

    // Copy this span's positions out so the solver works on a tight buffer.
    const sub = new Float32Array(count * 3)
    sub.set(pos.subarray(start * 3, (start + count) * 3))

    const W = solveDenseWeights(sub, count, segs, {
      falloff: part.falloff ?? 4,
      smooth: part.smooth ?? 2,
      smoothRadius: part.smoothRadius ?? 0.03,
      maxRatio: part.maxRatio ?? 3.2,
    })

    // Compress each row to its top four influences.
    const C = segs.length
    for (let i = 0; i < count; i++) {
      const row = i * C
      let i0 = -1
      let i1 = -1
      let i2 = -1
      let i3 = -1
      let w0 = 0
      let w1 = 0
      let w2 = 0
      let w3 = 0
      for (let c = 0; c < C; c++) {
        const w = W[row + c]
        if (w <= 0) continue
        if (w > w0) {
          w3 = w2; i3 = i2; w2 = w1; i2 = i1; w1 = w0; i1 = i0; w0 = w; i0 = c
        } else if (w > w1) {
          w3 = w2; i3 = i2; w2 = w1; i2 = i1; w1 = w; i1 = c
        } else if (w > w2) {
          w3 = w2; i3 = i2; w2 = w; i2 = c
        } else if (w > w3) {
          w3 = w; i3 = c
        }
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

/**
 * Sanity report for the solve — every vertex must have weights summing to ~1
 * and at least one non-zero influence, or the mesh collapses to the origin the
 * moment it animates.
 */
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
