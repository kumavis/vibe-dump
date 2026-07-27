import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { noise3, makeRng, clamp01, smoothstep } from './noise.js'

// ---------------------------------------------------------------------------
// Procedural mesh toolkit
//
// Every polygon in this app is generated here. The workhorse is `sweep()`: a
// generalized cylinder that extrudes an arbitrary cross-section along a path
// using parallel-transport frames. Limbs, horns, straps, blades, pouches and
// the torso are all sweeps with different profile functions; armour plates and
// hard-surface bits are rounded boxes and lathes on top.
// ---------------------------------------------------------------------------

const _v0 = new THREE.Vector3()
const _v1 = new THREE.Vector3()
const _v2 = new THREE.Vector3()
const _q = new THREE.Quaternion()

// ---- cross-section helpers ------------------------------------------------

/**
 * An ellipse cross-section. `squash` pulls the lower half in (dorsal/ventral
 * asymmetry — real limbs are not circular), `bulge` adds a directional lump.
 */
export function ellipseProfile(rx, ry, segments = 12, { squash = 0, bulge = 0, bulgeAngle = 0 } = {}) {
  const pts = []
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2
    const c = Math.cos(a)
    const s = Math.sin(a)
    let x = c * rx
    let y = s * ry
    if (squash) y *= 1 - squash * clamp01(-s)
    if (bulge) {
      const d = Math.cos(a - bulgeAngle)
      const k = 1 + bulge * Math.max(0, d) ** 2
      x *= k
      y *= k
    }
    pts.push(new THREE.Vector2(x, y))
  }
  return pts
}

/** A rounded-rectangle cross-section — straps, blades, plates, belts. */
export function rectProfile(w, h, round = 0.3, segments = 16) {
  const pts = []
  const hw = w / 2
  const hh = h / 2
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2
    // Superellipse: exponent controls how boxy the corners read.
    const n = 2 / (1 - round * 0.85 + 1e-6)
    const c = Math.cos(a)
    const s = Math.sin(a)
    const x = Math.sign(c) * Math.abs(c) ** (2 / n) * hw
    const y = Math.sign(s) * Math.abs(s) ** (2 / n) * hh
    pts.push(new THREE.Vector2(x, y))
  }
  return pts
}

/** Interpolate between two same-length profiles. */
export function blendProfiles(a, b, t) {
  const out = []
  for (let i = 0; i < a.length; i++) {
    out.push(new THREE.Vector2(a[i].x + (b[i].x - a[i].x) * t, a[i].y + (b[i].y - a[i].y) * t))
  }
  return out
}

/** Scale a profile uniformly (returns a new array). */
export function scaleProfile(p, sx, sy = sx) {
  return p.map((v) => new THREE.Vector2(v.x * sx, v.y * sy))
}

// ---- parallel transport frames -------------------------------------------

/**
 * Build a smooth frame (tangent/normal/binormal) at every point of a polyline
 * without the flipping you get from Frenet frames on straight or S-shaped
 * paths: carry the previous normal forward through the minimal rotation that
 * takes the previous tangent onto the current one.
 */
export function parallelFrames(points, upHint = new THREE.Vector3(0, 0, 1)) {
  const n = points.length
  const tangents = []
  for (let i = 0; i < n; i++) {
    const a = points[Math.max(0, i - 1)]
    const b = points[Math.min(n - 1, i + 1)]
    const t = new THREE.Vector3().subVectors(b, a)
    if (t.lengthSq() < 1e-12) t.set(0, 1, 0)
    tangents.push(t.normalize())
  }

  const normals = []
  const binormals = []
  // Seed the first normal from the hint, orthogonalised against the tangent.
  let nrm = new THREE.Vector3().copy(upHint)
  if (Math.abs(nrm.dot(tangents[0])) > 0.99) nrm.set(1, 0, 0)
  nrm.addScaledVector(tangents[0], -nrm.dot(tangents[0])).normalize()

  for (let i = 0; i < n; i++) {
    if (i > 0) {
      _v0.crossVectors(tangents[i - 1], tangents[i])
      const len = _v0.length()
      if (len > 1e-8) {
        _v0.divideScalar(len)
        const angle = Math.acos(THREE.MathUtils.clamp(tangents[i - 1].dot(tangents[i]), -1, 1))
        nrm.applyQuaternion(_q.setFromAxisAngle(_v0, angle))
      }
      // Re-orthogonalise: floating point drift accumulates over long paths.
      nrm.addScaledVector(tangents[i], -nrm.dot(tangents[i])).normalize()
    }
    normals.push(nrm.clone())
    binormals.push(new THREE.Vector3().crossVectors(tangents[i], nrm).normalize())
  }
  return { tangents, normals, binormals }
}

// ---- the sweep ------------------------------------------------------------

/**
 * Extrude a cross-section along a path.
 *
 * @param {object} o
 * @param {THREE.Vector3[]} o.path            spine of the sweep (>= 2 points)
 * @param {(t:number, i:number) => THREE.Vector2[]} o.profile
 *        cross-section at parameter t (0..1). Must return the same number of
 *        points every call. Profile x maps to the frame normal, y to binormal.
 * @param {boolean} [o.capStart=true] [o.capEnd=true]
 * @param {number}  [o.twist=0]               radians of twist end-to-end
 * @param {[number,number]} [o.uvScale=[1,1]]
 * @param {[number,number]} [o.uvOffset=[0,0]]
 * @param {THREE.Vector3} [o.upHint]
 */
export function sweep({
  path,
  profile,
  capStart = true,
  capEnd = true,
  twist = 0,
  uvScale = [1, 1],
  uvOffset = [0, 0],
  upHint,
}) {
  const rings = path.length
  const { normals, binormals } = parallelFrames(path, upHint)
  const first = profile(0, 0)
  const N = first.length

  // Arc length along the path drives V so textures don't stretch on tapers.
  const arc = [0]
  for (let i = 1; i < rings; i++) arc.push(arc[i - 1] + path[i].distanceTo(path[i - 1]))
  const total = arc[rings - 1] || 1

  const vertCount = rings * (N + 1) + (capStart ? N + 2 : 0) + (capEnd ? N + 2 : 0)
  const positions = new Float32Array(vertCount * 3)
  const uvs = new Float32Array(vertCount * 2)
  const indices = []
  let vp = 0
  let up = 0

  const pushVert = (x, y, z, u, v) => {
    positions[vp++] = x
    positions[vp++] = y
    positions[vp++] = z
    uvs[up++] = u * uvScale[0] + uvOffset[0]
    uvs[up++] = v * uvScale[1] + uvOffset[1]
  }

  // Duplicate the seam column (N+1 per ring) so the U wrap doesn't smear.
  for (let i = 0; i < rings; i++) {
    const t = rings === 1 ? 0 : i / (rings - 1)
    const cs = i === 0 ? first : profile(t, i)
    const nrm = normals[i]
    const bin = binormals[i]
    const tw = twist * t
    const ct = Math.cos(tw)
    const st = Math.sin(tw)
    const v = arc[i] / total
    for (let j = 0; j <= N; j++) {
      const p = cs[j % N]
      const px = p.x * ct - p.y * st
      const py = p.x * st + p.y * ct
      pushVert(
        path[i].x + nrm.x * px + bin.x * py,
        path[i].y + nrm.y * px + bin.y * py,
        path[i].z + nrm.z * px + bin.z * py,
        j / N,
        v,
      )
    }
  }

  // Winding matters: the frame is right-handed with T = N x B, so a profile
  // wound counter-clockwise in (N, B) — which is what `ellipseProfile` and
  // friends produce — needs the triangles emitted this way round to end up
  // facing *out*. Get it backwards and the whole mesh is lit from the inside.
  for (let i = 0; i < rings - 1; i++) {
    const r0 = i * (N + 1)
    const r1 = (i + 1) * (N + 1)
    for (let j = 0; j < N; j++) {
      indices.push(r0 + j, r0 + j + 1, r1 + j)
      indices.push(r0 + j + 1, r1 + j + 1, r1 + j)
    }
  }

  // Caps: a triangle fan around a centroid vertex.
  const addCap = (ringIndex, flip) => {
    const t = rings === 1 ? 0 : ringIndex / (rings - 1)
    const cs = profile(t, ringIndex)
    const nrm = normals[ringIndex]
    const bin = binormals[ringIndex]
    const tw = twist * t
    const ct = Math.cos(tw)
    const st = Math.sin(tw)
    const center = vp / 3
    pushVert(path[ringIndex].x, path[ringIndex].y, path[ringIndex].z, 0.5, 0.5)
    const base = vp / 3
    for (let j = 0; j <= N; j++) {
      const p = cs[j % N]
      const px = p.x * ct - p.y * st
      const py = p.x * st + p.y * ct
      pushVert(
        path[ringIndex].x + nrm.x * px + bin.x * py,
        path[ringIndex].y + nrm.y * px + bin.y * py,
        path[ringIndex].z + nrm.z * px + bin.z * py,
        0.5 + Math.cos((j / N) * Math.PI * 2) * 0.5,
        0.5 + Math.sin((j / N) * Math.PI * 2) * 0.5,
      )
    }
    for (let j = 0; j < N; j++) {
      if (flip) indices.push(center, base + j + 1, base + j)
      else indices.push(center, base + j, base + j + 1)
    }
  }
  if (capStart) addCap(0, false)
  if (capEnd) addCap(rings - 1, true)

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions.subarray(0, vp), 3))
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs.subarray(0, up), 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

/**
 * Convenience: sweep a circular/elliptical tube along a path with a radius
 * function. `radius(t)` may return a number or `[rx, ry]`.
 */
export function tube(path, radius, radialSegments = 12, opts = {}) {
  const rf = typeof radius === 'function' ? radius : () => radius
  return sweep({
    path,
    profile: (t) => {
      const r = rf(t)
      const rx = Array.isArray(r) ? r[0] : r
      const ry = Array.isArray(r) ? r[1] : r
      return ellipseProfile(rx, ry, radialSegments, opts.shape || {})
    },
    ...opts,
  })
}

/** Sample a Catmull-Rom through control points — smooth limb/strap spines. */
export function smoothPath(points, samples = 24, tension = 0.5) {
  const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', tension)
  return curve.getSpacedPoints(samples - 1)
}

// ---- hard-surface primitives ---------------------------------------------

/**
 * A box with rounded edges, built by pushing a subdivided cube's vertices out
 * from an inner box by `r`. Unlike a bevel this gives a continuous surface with
 * clean normals, which reads well under the metal texture set.
 */
export function roundedBox(w, h, d, r = 0.02, seg = 4) {
  const geo = new THREE.BoxGeometry(1, 1, 1, seg, seg, seg)
  const pos = geo.attributes.position
  const half = new THREE.Vector3(w / 2 - r, h / 2 - r, d / 2 - r)
  half.x = Math.max(half.x, 1e-4)
  half.y = Math.max(half.y, 1e-4)
  half.z = Math.max(half.z, 1e-4)
  for (let i = 0; i < pos.count; i++) {
    _v0.fromBufferAttribute(pos, i).multiply(new THREE.Vector3(w, h, d))
    // Nearest point on the inner box, then offset by the corner radius.
    _v1.set(
      THREE.MathUtils.clamp(_v0.x, -half.x, half.x),
      THREE.MathUtils.clamp(_v0.y, -half.y, half.y),
      THREE.MathUtils.clamp(_v0.z, -half.z, half.z),
    )
    _v2.subVectors(_v0, _v1)
    const len = _v2.length()
    if (len > 1e-8) _v2.multiplyScalar(r / len)
    pos.setXYZ(i, _v1.x + _v2.x, _v1.y + _v2.y, _v1.z + _v2.z)
  }
  geo.computeVertexNormals()
  return geo
}

/** A lathe of a 2D profile around Y — rivets, canisters, lenses, horn bases. */
export function lathe(points2, segments = 16, phiLength = Math.PI * 2) {
  return new THREE.LatheGeometry(points2, segments, 0, phiLength)
}

/**
 * A tapered spiral horn/tusk. Grows along a helix so it curls; `curl` is
 * radians of total sweep, `taper` the exponent of the radius falloff.
 */
export function horn({
  length = 0.12,
  radius = 0.022,
  curl = 1.6,
  curlAxis = new THREE.Vector3(1, 0, 0),
  taper = 1.4,
  rings = 14,
  radialSegments = 8,
  twistRibs = 0,
}) {
  const path = []
  const dir = new THREE.Vector3(0, 1, 0)
  const p = new THREE.Vector3()
  const axis = curlAxis.clone().normalize()
  const step = length / (rings - 1)
  for (let i = 0; i < rings; i++) {
    path.push(p.clone())
    dir.applyAxisAngle(axis, curl / (rings - 1))
    p.addScaledVector(dir, step)
  }
  return sweep({
    path,
    profile: (t) => {
      const r = radius * (1 - t) ** taper
      const prof = ellipseProfile(r, r * 0.92, radialSegments)
      if (twistRibs) {
        // Ribbed keratin: a low-amplitude ripple riding the surface.
        for (let i = 0; i < prof.length; i++) {
          const k = 1 + Math.sin(t * twistRibs * Math.PI * 2) * 0.06 * (1 - t)
          prof[i].multiplyScalar(k)
        }
      }
      return prof
    },
    capStart: true,
    capEnd: false,
  })
}

/**
 * A two-sided shell over a parametric surface, with rims so it reads as a cut
 * piece of material rather than a zero-width sheet. `thickness` may be a number
 * or a function of (u, v) — a membrane wants a thick spine and a thin edge.
 *
 * The winding is probed from the surface itself: some parameterisations put
 * du x dv along +n and some along -n, and getting it wrong lights the whole
 * piece from the inside.
 */
export function panelSurface(surface, { rows = 8, cols = 8, thickness = 0.004 } = {}) {
  const th = typeof thickness === 'function' ? thickness : () => thickness
  const positions = []
  const uvs = []
  const indices = []

  const eps = 1e-3
  const s0 = surface(0.5, 0.5)
  const su = surface(0.5 + eps, 0.5)
  const sv = surface(0.5, 0.5 + eps)
  const flip =
    _v0.subVectors(su.p, s0.p).cross(_v1.subVectors(sv.p, s0.p)).dot(s0.n) < 0

  const add = (p, u, v) => {
    positions.push(p.x, p.y, p.z)
    uvs.push(u, v)
    return positions.length / 3 - 1
  }

  const outer = []
  const inner = []
  for (let r = 0; r <= rows; r++) {
    const v = r / rows
    outer.push([])
    inner.push([])
    for (let c = 0; c <= cols; c++) {
      const u = c / cols
      const { p, n } = surface(u, v)
      const half = th(u, v) / 2
      outer[r].push(add(p.clone().addScaledVector(n, half), u, v))
      inner[r].push(add(p.clone().addScaledVector(n, -half), u, v))
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const a = outer[r][c]
      const b = outer[r][c + 1]
      const d = outer[r + 1][c]
      const e = outer[r + 1][c + 1]
      const ia = inner[r][c]
      const ib = inner[r][c + 1]
      const id = inner[r + 1][c]
      const ie = inner[r + 1][c + 1]
      if (flip) {
        indices.push(a, d, b, b, d, e, ia, ib, id, ib, ie, id)
      } else {
        indices.push(a, b, d, b, e, d, ia, id, ib, ib, id, ie)
      }
    }
  }
  const rim = (o0, o1, i0, i1) => {
    if (flip) indices.push(o0, i0, o1, o1, i0, i1)
    else indices.push(o0, o1, i0, o1, i1, i0)
  }
  for (let c = 0; c < cols; c++) {
    rim(outer[0][c + 1], outer[0][c], inner[0][c + 1], inner[0][c])
    rim(outer[rows][c], outer[rows][c + 1], inner[rows][c], inner[rows][c + 1])
  }
  for (let r = 0; r < rows; r++) {
    rim(outer[r][0], outer[r + 1][0], inner[r][0], inner[r + 1][0])
    rim(outer[r + 1][cols], outer[r][cols], inner[r + 1][cols], inner[r][cols])
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
  geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

// ---- deformers ------------------------------------------------------------

/** Organic lumpiness: displace along normals by 3D noise. */
export function noisify(geo, { amp = 0.004, freq = 9, seed = 1, mask = null } = {}) {
  geo.computeVertexNormals()
  const pos = geo.attributes.position
  const nrm = geo.attributes.normal
  const off = seed * 13.37
  for (let i = 0; i < pos.count; i++) {
    _v0.fromBufferAttribute(pos, i)
    const n = noise3(_v0.x * freq + off, _v0.y * freq + off, _v0.z * freq + off) - 0.5
    const m = mask ? mask(_v0, i) : 1
    const d = n * amp * 2 * m
    pos.setXYZ(
      i,
      _v0.x + nrm.getX(i) * d,
      _v0.y + nrm.getY(i) * d,
      _v0.z + nrm.getZ(i) * d,
    )
  }
  geo.computeVertexNormals()
  return geo
}

/** Bend a geometry around an axis, proportional to position along `along`. */
export function bend(geo, { amount = 0.4, along = 'y', axis = new THREE.Vector3(0, 0, 1), center = 0 } = {}) {
  const pos = geo.attributes.position
  const a = axis.clone().normalize()
  for (let i = 0; i < pos.count; i++) {
    _v0.fromBufferAttribute(pos, i)
    const t = _v0[along] - center
    _q.setFromAxisAngle(a, amount * t)
    _v0.applyQuaternion(_q)
    pos.setXYZ(i, _v0.x, _v0.y, _v0.z)
  }
  geo.computeVertexNormals()
  return geo
}

/** Randomly nibble a silhouette edge — torn cloth, chipped plate. */
export function ragged(geo, { axis = 'y', from = 0, amp = 0.02, freq = 22, seed = 3 } = {}) {
  const pos = geo.attributes.position
  const rng = makeRng(seed)
  const phase = rng() * 100
  for (let i = 0; i < pos.count; i++) {
    _v0.fromBufferAttribute(pos, i)
    const d = Math.abs(_v0[axis] - from)
    const w = smoothstep(0.06, 0, d) // only the edge band moves
    if (w <= 0) continue
    const n = Math.sin((_v0.x + _v0.z) * freq + phase) * 0.5 + noise3(_v0.x * freq, phase, _v0.z * freq) - 0.5
    _v0[axis] += n * amp * w
    pos.setXYZ(i, _v0.x, _v0.y, _v0.z)
  }
  geo.computeVertexNormals()
  return geo
}

// ---- assembly -------------------------------------------------------------

/** Apply a transform to a geometry (in place) and return it. */
export function xform(geo, { pos, rot, scale, quat } = {}) {
  const m = new THREE.Matrix4()
  const q = quat || new THREE.Quaternion()
  if (rot && !quat) q.setFromEuler(rot instanceof THREE.Euler ? rot : new THREE.Euler(...rot))
  m.compose(
    pos ? (pos.isVector3 ? pos : new THREE.Vector3(...pos)) : new THREE.Vector3(),
    q,
    scale
      ? typeof scale === 'number'
        ? new THREE.Vector3(scale, scale, scale)
        : scale.isVector3
          ? scale
          : new THREE.Vector3(...scale)
      : new THREE.Vector3(1, 1, 1),
  )
  geo.applyMatrix4(m)
  return geo
}

/**
 * Merge geometries that may not share attribute sets. Every input is coerced to
 * exactly { position, normal, uv } (+ optional groups) so mergeGeometries never
 * bails on a mismatch — a real trap when mixing our sweeps with three's
 * built-in primitives.
 */
export function normalizeAttributes(geo) {
  if (!geo.index) {
    // Give it a trivial index rather than expanding to non-indexed: merging
    // wants every input to agree, and staying indexed keeps vertex counts (and
    // therefore skin-weight solve time) down.
    const n = geo.attributes.position.count
    const idx = n > 65535 ? new Uint32Array(n) : new Uint16Array(n)
    for (let i = 0; i < n; i++) idx[i] = i
    geo.setIndex(new THREE.BufferAttribute(idx, 1))
  }
  if (!geo.attributes.normal) geo.computeVertexNormals()
  if (!geo.attributes.uv) {
    const count = geo.attributes.position.count
    const uv = new Float32Array(count * 2)
    // Cheap planar fallback so untextured primitives still take a material.
    const pos = geo.attributes.position
    for (let i = 0; i < count; i++) {
      uv[i * 2] = pos.getX(i) * 4 + 0.5
      uv[i * 2 + 1] = pos.getY(i) * 4 + 0.5
    }
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  }
  const keep = ['position', 'normal', 'uv']
  for (const name of Object.keys(geo.attributes)) {
    if (!keep.includes(name)) geo.deleteAttribute(name)
  }
  geo.morphAttributes = {}
  return geo
}

export function mergeAll(geos, useGroups = false) {
  const clean = geos.filter(Boolean).map((g) => normalizeAttributes(g))
  if (clean.length === 0) return null
  if (clean.length === 1 && !useGroups) return clean[0]
  return mergeGeometries(clean, useGroups)
}

/** Bounding-sphere-safe recompute after we mutate positions. */
export function refresh(geo) {
  geo.attributes.position.needsUpdate = true
  geo.computeVertexNormals()
  geo.computeBoundingSphere()
  return geo
}
