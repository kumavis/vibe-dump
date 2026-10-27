// Smooth geometry for the glossy Ssithra (serpents.js): every skin part is built at its final size in its
// group's space (no mesh scale), so the skin shader's object-space scales come out the same size on every
// part, and every surface has smooth normals (nothing here is flat shaded). buildSerpent also folds any
// leftover part() scale into its geometry (unscale), so a mesh's model matrix carries only the figure's
// own scale, which the shader's level of detail reads.
//
//   blob(detail, shape, paint?)   an icosphere (indexed, its seams merged) whose unit directions `shape`
//                                 maps to positions; normals from the welded mesh, so it is seamless;
//                                 `paint(dir, pos)` gives each vertex a colour
//   body(knots, opts)             the naga's body: tail, coil, torso and neck as ONE swept tube (no join
//                                 between coil and torso), its cross-section flattened on the belly side.
//                                 Returns two meshes' geometry sharing their boundary vertices exactly:
//                                 `skin` (the scaled back and flanks, its markings cut crisply along their
//                                 own zero line) and `belly` (the scutes: overlapping transverse plates in
//                                 the geometry itself, each proud at its rear edge)
//   lathe(profile, segs)          a smooth lathe (about y), welded as it is built (seam and poles shared)
//   vertexNormals(g)              smooth normals of an indexed geometry, in plain array arithmetic
//   horn(a, b, r0, bend, segs)    a curved, tapering, smooth horn or spike from a to b
//   cutPaint(geo, q, cuts, paint) a crisp paint edge on any indexed geometry: its triangles cut along the
//                                 zero line of each field (graft of prototype C's sdf.js cut()), the
//                                 crossing vertices doubled so each side keeps its own colour; a cut with a
//                                 `region` is made only on the triangles there (their neighbours split
//                                 at its new edge vertices, so the surface stays closed)
//   occlude(group, occluders)     ambient occlusion into the vertex colours, from an analytic chain of
//                                 capsules (the body's own centreline, the head, the arms)
//
// Vertex colours: every skin mesh also carries `plain`, its colour without the markings, which the skin
// shader fades toward as a figure shrinks on screen (gloss.js: the markings' contrast is pixel noise at
// 28 px, so it fades with the rest of the gloss).
import * as THREE from 'three'

const V = (a) => new THREE.Vector3(...a)
const clamp = THREE.MathUtils.clamp
// GLSL's smoothstep (either way round: smooth(x, 1, 0) falls), not three's (which is 0 below a whatever b is)
export const smooth = (x, a, b) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

// ── blob ───────────────────────────────────────────────────────────────────
// An indexed icosphere, welded as it is built (three's IcosahedronGeometry is unindexed, and welding it
// with mergeVertices was most of a cold build's time): each of the 20 faces cut into (detail + 1)²
// triangles, the vertices on an edge shared by the two faces that meet there. Made once per detail.
const icos = new Map()
const ICO_T = (1 + Math.sqrt(5)) / 2
const ICO_V = [-1, ICO_T, 0, 1, ICO_T, 0, -1, -ICO_T, 0, 1, -ICO_T, 0, 0, -1, ICO_T, 0, 1, ICO_T, 0, -1, -ICO_T, 0, 1, -ICO_T, ICO_T, 0, -1, ICO_T, 0, 1, -ICO_T, 0, -1, -ICO_T, 0, 1]
const ICO_F = [0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1]
function icosphere(detail) {
  if (!icos.has(detail)) {
    const n = detail + 1, pos = [], idx = []
    const add = (x, y, z) => {
      const l = Math.hypot(x, y, z)
      pos.push(x / l, y / l, z / l)
      return pos.length / 3 - 1
    }
    for (let i = 0; i < 12; i++) add(ICO_V[3 * i], ICO_V[3 * i + 1], ICO_V[3 * i + 2])
    // the vertices along each edge, from its lower-numbered corner
    const edges = new Map()
    const edge = (a, b) => {
      const key = a < b ? a * 12 + b : b * 12 + a
      if (!edges.has(key)) {
        const [p, q] = a < b ? [a, b] : [b, a], list = []
        for (let k = 1; k < n; k++) {
          const t = k / n
          list.push(add(ICO_V[3 * p] + t * (ICO_V[3 * q] - ICO_V[3 * p]), ICO_V[3 * p + 1] + t * (ICO_V[3 * q + 1] - ICO_V[3 * p + 1]), ICO_V[3 * p + 2] + t * (ICO_V[3 * q + 2] - ICO_V[3 * p + 2])))
        }
        edges.set(key, list)
      }
      const list = edges.get(key)
      // vertex k (1..n-1) of the way from a to b
      return (k) => (a < b ? list[k - 1] : list[n - 1 - k])
    }
    for (let f = 0; f < 20; f++) {
      const A = ICO_F[3 * f], B = ICO_F[3 * f + 1], C = ICO_F[3 * f + 2]
      const ab = edge(A, B), ac = edge(A, C), bc = edge(B, C)
      // row i (0 at A .. n at the BC edge) has i + 1 vertices, from the AB side to the AC side
      const rows = []
      for (let i = 0; i <= n; i++) {
        const row = []
        for (let j = 0; j <= i; j++) {
          if (i === 0) row.push(A)
          else if (i === n) row.push(j === 0 ? B : j === n ? C : bc(j))
          else if (j === 0) row.push(ab(i))
          else if (j === i) row.push(ac(i))
          else {
            const u = (i - j) / n, v = j / n, w = 1 - u - v
            row.push(add(w * ICO_V[3 * A] + u * ICO_V[3 * B] + v * ICO_V[3 * C], w * ICO_V[3 * A + 1] + u * ICO_V[3 * B + 1] + v * ICO_V[3 * C + 1], w * ICO_V[3 * A + 2] + u * ICO_V[3 * B + 2] + v * ICO_V[3 * C + 2]))
          }
        }
        rows.push(row)
      }
      for (let i = 0; i < n; i++) {
        for (let j = 0; j <= i; j++) {
          idx.push(rows[i][j], rows[i + 1][j], rows[i + 1][j + 1])
          if (j < i) idx.push(rows[i][j], rows[i + 1][j + 1], rows[i][j + 1])
        }
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setIndex(idx)
    outward(g)
    icos.set(detail, g)
  }
  return icos.get(detail).clone()
}
// smooth vertex normals of an indexed geometry (area-weighted face normals summed at each vertex): three's
// computeVertexNormals, in plain array arithmetic (it runs on every blob and lathe while V8 is still cold)
export function vertexNormals(g) {
  const p = g.attributes.position.array, ix = g.index.array, n = new Float32Array(p.length)
  for (let k = 0; k < ix.length; k += 3) {
    const a = 3 * ix[k], b = 3 * ix[k + 1], c = 3 * ix[k + 2]
    const ux = p[b] - p[a], uy = p[b + 1] - p[a + 1], uz = p[b + 2] - p[a + 2]
    const vx = p[c] - p[a], vy = p[c + 1] - p[a + 1], vz = p[c + 2] - p[a + 2]
    const fx = uy * vz - uz * vy, fy = uz * vx - ux * vz, fz = ux * vy - uy * vx
    n[a] += fx, n[a + 1] += fy, n[a + 2] += fz
    n[b] += fx, n[b + 1] += fy, n[b + 2] += fz
    n[c] += fx, n[c + 1] += fy, n[c + 2] += fz
  }
  for (let i = 0; i < n.length; i += 3) {
    const l = Math.sqrt(n[i] * n[i] + n[i + 1] * n[i + 1] + n[i + 2] * n[i + 2]) || 1
    n[i] /= l, n[i + 1] /= l, n[i + 2] /= l
  }
  g.setAttribute('normal', new THREE.BufferAttribute(n, 3))
  return g
}

export function blob(detail, shape, paint) {
  const g = icosphere(detail)
  const p = g.attributes.position
  const d = new THREE.Vector3(), out = new THREE.Vector3()
  const col = paint ? new Float32Array(p.count * 3) : null
  const c = new THREE.Color()
  for (let i = 0; i < p.count; i++) {
    d.fromBufferAttribute(p, i).normalize()
    out.copy(d)
    shape(out, d)
    p.setXYZ(i, out.x, out.y, out.z)
    if (paint) {
      paint(d, out, c)
      col.set([c.r, c.g, c.b], i * 3)
    }
  }
  if (col) g.setAttribute('color', new THREE.BufferAttribute(col, 3))
  return vertexNormals(g)
}

// an ellipsoid blob centred at `at` with radii `r`
export function ellipsoid(detail, r, at = [0, 0, 0], paint) {
  return blob(detail, (v) => v.set(at[0] + v.x * r[0], at[1] + v.y * r[1], at[2] + v.z * r[2]), paint)
}

// ── lathe ──────────────────────────────────────────────────────────────────
// three's LatheGeometry, welded as it is built (its seam shared, a profile point on the axis one vertex):
// the same surface as LatheGeometry + mergeVertices, without the latter's string-keyed hashing
export function lathe(profile, segs = 16) {
  const pos = [], idx = [], rows = []
  for (const [r, y] of profile) {
    if (Math.abs(r) < 1e-9) {
      rows.push([pos.length / 3])
      pos.push(0, y, 0)
      continue
    }
    const row = []
    for (let j = 0; j < segs; j++) {
      const phi = (j / segs) * Math.PI * 2
      row.push(pos.length / 3)
      pos.push(Math.sin(phi) * r, y, Math.cos(phi) * r)
    }
    rows.push(row)
  }
  for (let i = 0; i < rows.length - 1; i++) {
    const A = rows[i], B = rows[i + 1]
    for (let j = 0; j < segs; j++) {
      const j1 = (j + 1) % segs
      if (A.length === 1 && B.length === 1) continue
      if (A.length === 1) idx.push(A[0], B[j], B[j1])
      else if (B.length === 1) idx.push(A[j], B[0], A[j1])
      else idx.push(A[j], B[j], A[j1], A[j1], B[j], B[j1])
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setIndex(idx)
  outward(g)
  return vertexNormals(g)
}

// make a closed indexed mesh's triangles face out (its signed volume positive), whichever way its
// profile ran
export function outward(g) {
  const p = g.attributes.position, ix = g.index.array
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3()
  let vol = 0
  for (let k = 0; k < ix.length; k += 3) {
    a.fromBufferAttribute(p, ix[k]), b.fromBufferAttribute(p, ix[k + 1]), c.fromBufferAttribute(p, ix[k + 2])
    vol += a.dot(b.cross(c))
  }
  if (vol < 0) {
    for (let k = 0; k < ix.length; k += 3) {
      const t = ix[k + 1]
      ix[k + 1] = ix[k + 2]
      ix[k + 2] = t
    }
  }
  return g
}

// ── horn ───────────────────────────────────────────────────────────────────
// A curved spike: a quadratic bend from a to b (the middle pushed by `bend`), radius r0 at its root to a
// point, smooth.
export function horn(a, b, r0, bend = [0, 0, 0], radial = 10, segs = 10, tip = 0) {
  const A = V(a), B = V(b), M = A.clone().lerp(B, 0.5).add(V(bend))
  const curve = new THREE.QuadraticBezierCurve3(A, M, B)
  return sweepSimple(curve, (t) => tip + (r0 - tip) * Math.pow(1 - t, 0.85), radial, segs, true)
}

// a plain round tube along a curve, radius by t (rotation-minimising frames), closed at both ends
export function sweepSimple(curve, radius, radial = 10, segs = 16, pointed = false) {
  const pos = [], idx = []
  const T = [], N = [], B = []
  for (let i = 0; i <= segs; i++) T.push(curve.getTangentAt(i / segs).normalize())
  // parallel transport
  let n0 = Math.abs(T[0].y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0)
  n0 = n0.sub(T[0].clone().multiplyScalar(n0.dot(T[0]))).normalize()
  N.push(n0)
  for (let i = 1; i <= segs; i++) {
    const n = N[i - 1].clone()
    n.sub(T[i].clone().multiplyScalar(n.dot(T[i]))).normalize()
    N.push(n)
  }
  for (let i = 0; i <= segs; i++) B.push(new THREE.Vector3().crossVectors(T[i], N[i]))
  for (let i = 0; i <= segs; i++) {
    const t = i / segs, P = curve.getPointAt(t), r = Math.max(radius(t), 1e-4)
    for (let j = 0; j < radial; j++) {
      const a = (j / radial) * Math.PI * 2
      const ca = Math.cos(a), sa = Math.sin(a)
      pos.push(P.x + r * (ca * N[i].x + sa * B[i].x), P.y + r * (ca * N[i].y + sa * B[i].y), P.z + r * (ca * N[i].z + sa * B[i].z))
    }
  }
  for (let i = 0; i < segs; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * radial + j, b = i * radial + ((j + 1) % radial), c = a + radial, d = b + radial
      idx.push(a, b, c, c, b, d)
    }
  }
  // caps: a rounded nub at the root, the point at the tip
  const P0 = curve.getPointAt(0), P1 = curve.getPointAt(1)
  const c0 = pos.length / 3
  pos.push(P0.x - T[0].x * radius(0) * 0.5, P0.y - T[0].y * radius(0) * 0.5, P0.z - T[0].z * radius(0) * 0.5)
  for (let j = 0; j < radial; j++) idx.push(c0, (j + 1) % radial, j)
  const c1 = pos.length / 3
  const e = pointed ? Math.max(0.002, radius(1)) : radius(1) * 0.5
  pos.push(P1.x + T[segs].x * e, P1.y + T[segs].y * e, P1.z + T[segs].z * e)
  const last = segs * radial
  for (let j = 0; j < radial; j++) idx.push(c1, last + j, last + ((j + 1) % radial))
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setIndex(idx)
  outward(g)
  return vertexNormals(g)
}

// ── crisp paint: cutting triangles along a field's zero line ───────────────
// A cut mesh is plain arrays: P (positions), N (normals), Q (k floats of parameters per vertex: whatever
// the paint fields are written in), T (triangles), L (a label per triangle: one bit per cut). cut() splits
// every triangle a field crosses along its zero (each crossing made once per edge and shared by both
// triangles of that edge, so the surface stays closed), interpolating position, normal and parameters, and
// sets `bit` on the triangles on its negative side. Graft of prototype C's sdf.js cut(); here the new
// vertices lie on the triangle's own plane (the meshes are fine enough that a chord is the surface).
// (sparse: the field is read only at the vertices M's triangles use, for a sub-mesh: cutPaint cuts a mark
// that shows only in a small region on just the triangles there)
// (splits: a Map that records each edge's new vertex under the edge's key, for cutPaint to split the
// triangles on the far side of a sub-mesh's boundary at the same vertices)
export const edgeKey = (a, b) => (a < b ? a * 4194304 + b : b * 4194304 + a)
export function cutMesh(M, field, bit, sparse = false, splits = null) {
  const { P, N, Q, k, T, L } = M
  const nv = P.length / 3, fv = new Float64Array(nv)
  if (sparse) {
    fv.fill(NaN)
    for (let i = 0; i < T.length; i++) {
      const v = T[i]
      if (fv[v] !== fv[v]) fv[v] = field(Q, v * k, P, v * 3)
    }
  } else for (let v = 0; v < nv; v++) fv[v] = field(Q, v * k, P, v * 3)
  const edges = new Map()
  const cross = (a, b) => {
    const key = edgeKey(a, b)
    const got = edges.get(key)
    if (got !== undefined) return got
    const t = fv[a] / (fv[a] - fv[b])
    const i = P.length / 3
    for (let c = 0; c < 3; c++) P.push(P[3 * a + c] + t * (P[3 * b + c] - P[3 * a + c]))
    let nx = N[3 * a] + t * (N[3 * b] - N[3 * a]), ny = N[3 * a + 1] + t * (N[3 * b + 1] - N[3 * a + 1]), nz = N[3 * a + 2] + t * (N[3 * b + 2] - N[3 * a + 2])
    const nl = Math.hypot(nx, ny, nz) || 1
    N.push(nx / nl, ny / nl, nz / nl)
    for (let c = 0; c < k; c++) Q.push(Q[k * a + c] + t * (Q[k * b + c] - Q[k * a + c]))
    edges.set(key, i)
    if (splits) splits.set(key, i)
    return i
  }
  const T2 = [], L2 = []
  for (let t = 0; t < T.length / 3; t++) {
    const a = T[3 * t], b = T[3 * t + 1], c = T[3 * t + 2], l = L[t]
    const sa = fv[a] < 0, sb = fv[b] < 0, sc = fv[c] < 0
    if (sa === sb && sb === sc) {
      T2.push(a, b, c)
      L2.push(sa ? l | bit : l)
      continue
    }
    // the lone vertex first, keeping the winding
    const [p, q, r] = sa === sb ? [c, a, b] : sa === sc ? [b, c, a] : [a, b, c]
    const x1 = cross(p, q), x2 = cross(r, p)
    const lp = fv[p] < 0 ? l | bit : l, lq = fv[q] < 0 ? l | bit : l
    T2.push(p, x1, x2, x1, q, r, x1, r, x2)
    L2.push(lp, lq, lq)
  }
  M.T = T2
  M.L = L2
  return M
}

// seal(M, T, L, splits): triangles T (labels L) that weren't cut, but whose edges a cut split (splits:
// edge key -> its new vertex, each half perhaps split again by a later cut), split at the same vertices,
// so they share every vertex of their cut neighbours' edges and the surface stays closed. A triangle with
// one split edge becomes a fan from its opposite corner; with more, a fan from a new vertex at its centre.
function seal(M, T, L, splits) {
  if (!splits.size) return { T, L }
  const { P, N, Q, k } = M
  // the vertices along edge a -> b, from a (b not included)
  const chain = (a, b, out) => {
    const x = splits.get(edgeKey(a, b))
    if (x === undefined) out.push(a)
    else chain(a, x, out), chain(x, b, out)
  }
  // (the ends of every split edge: a triangle with fewer than two of its corners among them has no split
  // edge, and is kept as it is without walking its edges: nearly all of them)
  const end = new Uint8Array(P.length / 3)
  for (const key of splits.keys()) (end[Math.floor(key / 4194304)] = 1), (end[key % 4194304] = 1)
  const T2 = [], L2 = [], e = [[], [], []]
  for (let t = 0; t < L.length; t++) {
    const a = T[3 * t], b = T[3 * t + 1], c = T[3 * t + 2]
    if (end[a] + end[b] + end[c] < 2) {
      T2.push(a, b, c), L2.push(L[t])
      continue
    }
    const v = [a, b, c], l = L[t]
    for (let j = 0; j < 3; j++) (e[j].length = 0), chain(v[j], v[(j + 1) % 3], e[j])
    const n = e[0].length + e[1].length + e[2].length
    if (n === 3) {
      T2.push(v[0], v[1], v[2]), L2.push(l)
      continue
    }
    const split = [0, 1, 2].filter((j) => e[j].length > 1)
    if (split.length === 1) {
      // edge j's vertices, then its end; fanned from the corner opposite it
      const j = split[0], ring = [...e[j], v[(j + 1) % 3]], o = v[(j + 2) % 3]
      for (let i = 0; i + 1 < ring.length; i++) T2.push(o, ring[i], ring[i + 1]), L2.push(l)
      continue
    }
    const ring = [...e[0], ...e[1], ...e[2]], g = P.length / 3
    for (let c = 0; c < 3; c++) P.push((P[3 * v[0] + c] + P[3 * v[1] + c] + P[3 * v[2] + c]) / 3)
    const nx = N[3 * v[0]] + N[3 * v[1]] + N[3 * v[2]], ny = N[3 * v[0] + 1] + N[3 * v[1] + 1] + N[3 * v[2] + 1], nz = N[3 * v[0] + 2] + N[3 * v[1] + 2] + N[3 * v[2] + 2]
    const nl = Math.hypot(nx, ny, nz) || 1
    N.push(nx / nl, ny / nl, nz / nl)
    for (let c = 0; c < k; c++) Q.push((Q[k * v[0] + c] + Q[k * v[1] + c] + Q[k * v[2] + c]) / 3)
    for (let i = 0; i < ring.length; i++) T2.push(g, ring[i], ring[(i + 1) % ring.length]), L2.push(l)
  }
  return { T: T2, L: L2 }
}

// A cut mesh as an indexed BufferGeometry: each vertex is doubled per label of the triangles that use it,
// so a paint edge is crisp while position and normal stay continuous (the shading doesn't see the cut).
// colour(Q, qi, label, out) paints a vertex for a label; plain(Q, qi, out), if given, its unmarked colour
// (a vertex of label 0, unmarked, is painted once: its colour is its plain colour).
export function cutGeometry(M, colour, plain) {
  const { P, N, Q, k, T, L } = M
  // (each vertex's copy for each label: a flat table over the labels in use, renumbered from 0: a mesh cut
  // eight times has up to 256 labels but uses a handful)
  const ids = new Map(), LI = new Int32Array(L.length)
  for (let t = 0; t < L.length; t++) {
    let i = ids.get(L[t])
    if (i === undefined) ids.set(L[t], (i = ids.size))
    LI[t] = i
  }
  const S = ids.size, nv = P.length / 3, map = new Int32Array(nv * S).fill(-1)
  const pos = [], nor = [], col = [], pl = plain ? [] : null, idx = new Uint32Array(T.length), src = []
  const c = new THREE.Color()
  for (let t = 0; t < L.length; t++) {
    for (let j = 0; j < 3; j++) {
      const v = T[3 * t + j], key = v * S + LI[t]
      let i = map[key]
      if (i < 0) {
        i = map[key] = src.length
        pos.push(P[3 * v], P[3 * v + 1], P[3 * v + 2])
        nor.push(N[3 * v], N[3 * v + 1], N[3 * v + 2])
        colour(Q, v * k, L[t], c)
        col.push(c.r, c.g, c.b)
        if (pl) {
          if (L[t] !== 0) plain(Q, v * k, c)
          pl.push(c.r, c.g, c.b)
        }
        src.push(v)
      }
      idx[3 * t + j] = i
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3))
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  if (pl) g.setAttribute('plain', new THREE.Float32BufferAttribute(pl, 3))
  g.setIndex(new THREE.BufferAttribute(idx, 1))
  g.userData.src = src
  return g
}

// cutPaint(geo, q, cuts, paint): cut an indexed geometry (position, normal, color) along each of `cuts`
// ({ field(Q, o) → signed, bit, region? }), where q(p, n) gives a vertex the parameters the fields are written in
// (a field reads them at Q[o], Q[o + 1], ...); then paint(Q, o, label, base, out) colours each vertex for
// its label (base: its colour before the cut). The result carries `plain` (the colour before the cut, so
// the markings can fade).
export function cutPaint(geo, q, cuts, paint) {
  const pa = geo.attributes.position.array, na = geo.attributes.normal.array, ca = geo.attributes.color.array
  const P = Array.from(pa), N = Array.from(na)
  const pv = new THREE.Vector3(), nv = new THREE.Vector3()
  const Q = []
  let k = 0
  for (let i = 0; i < pa.length / 3; i++) {
    const qq = q(pv.set(pa[3 * i], pa[3 * i + 1], pa[3 * i + 2]), nv.set(na[3 * i], na[3 * i + 1], na[3 * i + 2]))
    k = qq.length + 3
    for (let j = 0; j < qq.length; j++) Q.push(qq[j])
    Q.push(ca[3 * i], ca[3 * i + 1], ca[3 * i + 2])
  }
  const M = { P, N, Q, k, T: Array.from(geo.index.array), L: new Array(geo.index.count / 3).fill(0) }
  // (a field reads its vertex's parameters at Q[o], Q[o + 1], ...)
  for (const { field, bit, region } of cuts) if (!region) cutMesh(M, field, bit)
  // the cuts with a region (all the same one): only on the triangles with a corner in it (a mark that shows
  // only inside another cut's extent need not split the rest of the mesh along its fields' zero lines).
  // Where a field's zero line runs out of the region, its cut splits a sub-mesh triangle's edge that an
  // outside triangle shares: that outside triangle is split at the same vertices (sealed), or the two
  // would meet in a T-junction, a hairline crack that sparkles
  const regional = cuts.filter((c) => c.region)
  if (regional.length) {
    const region = regional[0].region, inR = new Uint8Array(P.length / 3)
    for (let v = 0; v < inR.length; v++) inR[v] = region(Q, v * k) ? 1 : 0
    const sub = { P, N, Q, k, T: [], L: [] }, T = [], L = []
    for (let t = 0; t < M.L.length; t++) {
      const a = M.T[3 * t], b = M.T[3 * t + 1], c = M.T[3 * t + 2]
      if (inR[a] || inR[b] || inR[c]) sub.T.push(a, b, c), sub.L.push(M.L[t])
      else T.push(a, b, c), L.push(M.L[t])
    }
    const splits = new Map()
    for (const { field, bit } of regional) cutMesh(sub, field, bit, true, splits)
    const sealed = seal({ P, N, Q, k }, T, L, splits)
    M.T = sealed.T.concat(sub.T)
    M.L = sealed.L.concat(sub.L)
  }
  const base = new THREE.Color()
  return cutGeometry(M, (Q, o, label, out) => {
    base.setRGB(Q[o + k - 3], Q[o + k - 2], Q[o + k - 1])
    paint(Q, o, label, base, out)
  }, (Q, o, out) => out.setRGB(Q[o + k - 3], Q[o + k - 2], Q[o + k - 1]))
}

// ── body ───────────────────────────────────────────────────────────────────
// knots: the centreline's control points, each { p: [x,y,z], r, fb (belly flattening), fs (width), d
// (where the belly faces: a direction, made perpendicular to the body), bh (optional: the belly's half
// angle there) }. Every scalar is interpolated smoothly between knots by the curve's own parameter.
// opts: radial (around), scutes (true: plates in the geometry; false: plain rings), ringStep (ring
// spacing as a fraction of the local radius, when no scutes), bellyHalf (radians each side of the belly
// line, where a knot gives no bh), scuteDepth, paint(s, theta, u, out) for the back and flanks (unmarked),
// marks: [{ field(s, theta, u), paint(s, theta, u, out) }] the markings (a field is negative inside a
// mark; its zero line is cut crisply, not stepped along the rings; the first mark listed wins where two
// overlap), bellyPaint(s, u, out).
export function body(knots, opts = {}) {
  const { radial = 24, scutes = true, ringStep = 0.45, bellyHalf = 1.05, scuteDepth = 0.05, paint, marks = [], bellyPaint } = opts
  knots = knots.map((k) => ({ bh: bellyHalf, ...k }))
  const curve = new THREE.CatmullRomCurve3(knots.map((k) => V(k.p)))
  const L = curve.getLength()
  const n = knots.length - 1
  // a knot scalar at curve parameter t (0..1), smoothly
  const at = (key, t) => {
    const x = clamp(t * n, 0, n)
    const i = Math.min(Math.floor(x), n - 1), f = x - i
    const a = knots[i][key], b = knots[i + 1][key]
    const s = f * f * (3 - 2 * f)
    if (Array.isArray(a)) return [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, a[2] + (b[2] - a[2]) * s]
    return a + (b - a) * s
  }
  // the radius along the body, by arc length (u = s / L)
  const radiusAt = (u) => at('r', curve.getUtoTmapping(clamp(u, 0, 1)))

  // the rings: by arc length; within a scute, three rings (rear edge proud, middle, front tucked under)
  const rings = [] // { s, kind: 0 plain | 1 proud | 2 mid | 3 tucked }
  let s = 0
  while (s < L) {
    const r = Math.max(radiusAt(s / L), 0.012)
    if (scutes) {
      const len = clamp(0.36 * r, 0.011, 0.045)
      rings.push({ s, kind: 1 }, { s: s + 0.45 * len, kind: 2 }, { s: s + 0.86 * len, kind: 3 })
      s += len
    } else {
      rings.push({ s, kind: 0 })
      s += clamp(ringStep * r, 0.008, 0.07)
    }
  }
  rings.push({ s: L, kind: scutes ? 1 : 0 })
  for (const r of rings) r.s = Math.min(r.s, L)

  // the columns: the belly's (from -bh to +bh) and the back's (the rest of the way round), per ring
  const nb = Math.max(3, Math.round((radial * bellyHalf) / Math.PI))
  const ns = Math.max(6, radial - nb)

  // each ring's frame: tangent, belly direction, side; its radius and shape; its slope
  const frames = rings.map((ring) => {
    const u = ring.s / L
    const t = curve.getUtoTmapping(u)
    const P = curve.getPoint(t)
    const T = curve.getTangent(t).normalize()
    const D = V(at('d', t))
    const b = D.sub(T.clone().multiplyScalar(D.dot(T))).normalize()
    const side = new THREE.Vector3().crossVectors(T, b)
    const r = at('r', t)
    const du = 0.002
    const dr = (radiusAt(Math.min(1, u + du)) - radiusAt(Math.max(0, u - du))) / ((Math.min(1, u + du) - Math.max(0, u - du)) * L)
    return { ...ring, u, P, T, b, side, r, dr, fb: at('fb', t), fs: at('fs', t), bh: at('bh', t) }
  })

  function build(isBelly) {
    const P = [], N = [], Q = [], T = []
    const w = (isBelly ? nb : ns) + 1
    for (const f of frames) {
      for (let j = 0; j < w; j++) {
        const th = isBelly ? -f.bh + (2 * f.bh * j) / nb : f.bh + ((Math.PI * 2 - 2 * f.bh) * j) / ns
        const cb = Math.cos(th), sb = Math.sin(th)
        const A = f.r * (cb > 0 ? f.fb : 1), Bs = f.r * f.fs
        // the cross-section: (along the belly direction, along the side)
        const qb = A * cb, qs = Bs * sb
        // its 2D outward normal, then tilted by how fast the radius changes
        let nb2 = cb / Math.max(A, 1e-5), ns2 = sb / Math.max(Bs, 1e-5)
        const nl = Math.hypot(nb2, ns2)
        nb2 /= nl, ns2 /= nl
        // (the unit cross-section's reach along its normal: finite at the tail's point, where r is 0)
        const qn = (cb > 0 ? f.fb : 1) * cb * nb2 + f.fs * sb * ns2
        let tilt = -f.dr * qn, off = 0
        if (isBelly && scutes) {
          // the plates: proud at the rear edge, sloping in, tucked under the next one forward
          const wt = Math.pow(Math.max(0, Math.cos((th / f.bh) * Math.PI * 0.5)), 0.7)
          const h = scuteDepth * f.r * wt
          if (f.kind === 1) (off = h), (tilt += 0.3 * wt)
          else if (f.kind === 2) tilt += 0.16 * wt
          else if (f.kind === 3) (off = -h), (tilt -= 0.38 * wt)
        }
        let nx = f.b.x * nb2 + f.side.x * ns2 + f.T.x * tilt, ny = f.b.y * nb2 + f.side.y * ns2 + f.T.y * tilt, nz = f.b.z * nb2 + f.side.z * ns2 + f.T.z * tilt
        const nn = Math.hypot(nx, ny, nz) || 1
        nx /= nn, ny /= nn, nz /= nn
        P.push(f.P.x + f.b.x * qb + f.side.x * qs + nx * off, f.P.y + f.b.y * qb + f.side.y * qs + ny * off, f.P.z + f.b.z * qb + f.side.z * qs + nz * off)
        N.push(nx, ny, nz)
        Q.push(f.s, th, f.u, f.kind)
      }
    }
    for (let i = 0; i < frames.length - 1; i++) {
      for (let j = 0; j < w - 1; j++) {
        const a = i * w + j, b = a + 1, d = a + w, e = d + 1
        T.push(a, d, b, b, d, e)
      }
    }
    return { P, N, Q, k: 4, T, L: new Array(T.length / 3).fill(0) }
  }
  const skinM = build(false), bellyM = build(true)
  // the markings: cut along their own zero line, so a mark's edge is a clean curve at any ring spacing
  marks.forEach((m, i) => cutMesh(skinM, (Q, o) => m.field(Q[o], Q[o + 1], Q[o + 2]), 1 << i))
  const skin = cutGeometry(skinM, (Q, o, label, out) => {
    const i = marks.findIndex((m, k) => label & (1 << k))
    ;(i < 0 ? paint : marks[i].paint)(Q[o], Q[o + 1], Q[o + 2], out)
  }, (Q, o, out) => paint(Q[o], Q[o + 1], Q[o + 2], out))
  const belly = cutGeometry(bellyM, (Q, o, label, out) => {
    bellyPaint(Q[o], Q[o + 2], out)
    // the crease where each plate tucks under the next: a dark line of wash
    if (scutes && Q[o + 3] === 3) out.multiplyScalar(0.8)
  })
  // the arc length of each vertex (occlude() skips the body's own neighbourhood by it)
  skin.userData.arc = Float32Array.from(skin.userData.src, (v) => skinM.Q[v * 4])
  belly.userData.arc = Float32Array.from(belly.userData.src, (v) => bellyM.Q[v * 4])
  skin.userData.th = Float32Array.from(skin.userData.src, (v) => skinM.Q[v * 4 + 1])
  belly.userData.th = Float32Array.from(belly.userData.src, (v) => bellyM.Q[v * 4 + 1])
  // the surface without the scutes' relief, for occlusion: frameAt(s) gives the cross-section there, and
  // its point(th, P, N) the surface point and normal at theta; shadeNaga samples a coarse grid of these
  // and the vertices read it back by their own (s, theta)
  const frameAt = (s) => {
    const u = clamp(s / L, 0, 1), t = curve.getUtoTmapping(u)
    const C = curve.getPoint(t), T = curve.getTangent(t).normalize(), D = V(at('d', t))
    const b = D.sub(T.clone().multiplyScalar(D.dot(T))).normalize(), side = new THREE.Vector3().crossVectors(T, b)
    const r = at('r', t), fb = at('fb', t), fs = at('fs', t)
    return (th, P, N) => {
      const cb = Math.cos(th), sb = Math.sin(th), A = r * (cb > 0 ? fb : 1), Bs = r * fs
      const nb2 = cb / Math.max(A, 1e-5), ns2 = sb / Math.max(Bs, 1e-5), nl = Math.hypot(nb2, ns2) || 1
      P.copy(C).addScaledVector(b, A * cb).addScaledVector(side, Bs * sb)
      N.copy(b).multiplyScalar(nb2 / nl).addScaledVector(side, ns2 / nl).normalize()
    }
  }
  // which way the triangles wind depends on the frame's handedness: make the skin face outward
  fixWinding(skin), fixWinding(belly)
  // the centreline as a chain of capsules, for occlusion: { a, b, ra, rb, s0, s1 }
  const chain = []
  const steps = Math.max(12, Math.round(L / 0.05))
  for (let i = 0; i < steps; i++) {
    const u0 = i / steps, u1 = (i + 1) / steps
    const t0 = curve.getUtoTmapping(u0), t1 = curve.getUtoTmapping(u1)
    chain.push({ a: curve.getPoint(t0).toArray(), b: curve.getPoint(t1).toArray(), ra: at('r', t0) * 0.95, rb: at('r', t1) * 0.95, s0: u0 * L, s1: u1 * L })
  }
  return { skin, belly, length: L, curve, chain, frameAt }
}

// flip an indexed geometry's triangles if they face against their vertex normals (on the whole)
function fixWinding(g) {
  const p = g.attributes.position.array, n = g.attributes.normal.array, ix = g.index.array
  let vote = 0
  for (let k = 0; k < ix.length; k += 3) {
    const a = 3 * ix[k], b = 3 * ix[k + 1], c = 3 * ix[k + 2]
    const ux = p[b] - p[a], uy = p[b + 1] - p[a + 1], uz = p[b + 2] - p[a + 2], vx = p[c] - p[a], vy = p[c + 1] - p[a + 1], vz = p[c + 2] - p[a + 2]
    vote += Math.sign((uy * vz - uz * vy) * n[a] + (uz * vx - ux * vz) * n[a + 1] + (ux * vy - uy * vx) * n[a + 2])
  }
  if (vote < 0) {
    for (let k = 0; k < ix.length; k += 3) {
      const t = ix[k + 1]
      ix[k + 1] = ix[k + 2]
      ix[k + 2] = t
    }
  }
}

// give a geometry one vertex colour all over (or by position: paint(pos, out))
export function tint(g, color, paint) {
  const p = g.attributes.position, col = new Float32Array(p.count * 3), c = new THREE.Color(color), v = new THREE.Vector3()
  for (let i = 0; i < p.count; i++) {
    if (paint) paint(v.fromBufferAttribute(p, i), c.set(color))
    col.set([c.r, c.g, c.b], i * 3)
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3))
  return g
}

// a skin mesh's unmarked colour: its colour, where it has no markings of its own
export function withPlain(g) {
  if (!g.attributes.plain) g.setAttribute('plain', g.attributes.color.clone())
  return g
}

// ── ambient occlusion from capsules ────────────────────────────────────────
// occluder(capsules, opts) → shade(px, py, pz, nx, ny, nz, id, arc): how much of a point's sky the capsules
// hide (a sphere's occlusion at each capsule's nearest point: cos · r² / d², iq's, summed, capped and faded
// out toward `reach` radii), as a factor for its colour. A capsule { a, b, ra, rb, id, s0 } doesn't occlude
// a point of its own part (id), nor, on the body, a point whose arc length is within `near` radii of its
// own span (the tube's own curvature isn't occlusion, but its next loop round is). The capsules are
// binned on a grid, so a point only visits the few that can reach it.
export function occluder(occluders, { strength = 0.75, floor = 0.5, near = 2.6, reach = 3.5 } = {}) {
  const n = occluders.length, C = new Float64Array(n * 14)
  occluders.forEach((o, k) => {
    const [ax, ay, az] = o.a, dx = o.b[0] - ax, dy = o.b[1] - ay, dz = o.b[2] - az
    const l2 = Math.max(1e-12, dx * dx + dy * dy + dz * dz), rm = Math.max(o.ra, o.rb)
    C.set([ax, ay, az, dx, dy, dz, l2, o.ra, o.rb, ax + dx / 2, ay + dy / 2, az + dz / 2, Math.sqrt(l2) / 2 + reach * rm, o.s0 ?? NaN], k * 14)
  })
  const ids = occluders.map((o) => o.id)
  const cell = 0.08, grid = new Map()
  const key = (i, j, l) => (i + 512) * 1048576 + (j + 512) * 1024 + (l + 512)
  for (let k = 0; k < n; k++) {
    const o = k * 14, R = C[o + 12]
    const lo = [0, 1, 2].map((a) => Math.floor((C[o + 9 + a] - R) / cell)), hi = [0, 1, 2].map((a) => Math.floor((C[o + 9 + a] + R) / cell))
    for (let i = lo[0]; i <= hi[0]; i++) for (let j = lo[1]; j <= hi[1]; j++) for (let l = lo[2]; l <= hi[2]; l++) {
      const kk = key(i, j, l)
      if (!grid.has(kk)) grid.set(kk, [])
      grid.get(kk).push(k)
    }
  }
  const R2 = reach * reach, F0 = (reach - 1) ** 2
  return (px, py, pz, nx, ny, nz, id, arc) => {
    const use = grid.get(key(Math.floor(px / cell), Math.floor(py / cell), Math.floor(pz / cell)))
    if (!use) return 1
    let occ = 0
    for (let u = 0; u < use.length; u++) {
      const k = use[u], o = k * 14
      if (id !== undefined && ids[k] === id) {
        if (arc === undefined || Number.isNaN(C[o + 13])) continue
        const r = Math.max(C[o + 7], C[o + 8], 0.03), s0 = C[o + 13], s1 = s0 + Math.sqrt(C[o + 6])
        if (arc > s0 - near * r && arc < s1 + near * r) continue
      }
      const wx = px - C[o], wy = py - C[o + 1], wz = pz - C[o + 2]
      let t = (wx * C[o + 3] + wy * C[o + 4] + wz * C[o + 5]) / C[o + 6]
      t = t < 0 ? 0 : t > 1 ? 1 : t
      const qx = C[o] + C[o + 3] * t - px, qy = C[o + 1] + C[o + 4] * t - py, qz = C[o + 2] + C[o + 5] * t - pz
      const r = C[o + 7] + (C[o + 8] - C[o + 7]) * t, r2 = r * r
      const d2 = qx * qx + qy * qy + qz * qz, q2 = d2 / r2
      if (q2 > R2) continue
      const cos = (nx * qx + ny * qy + nz * qz) / Math.max(Math.sqrt(d2), 1e-6)
      if (cos > 0) occ += (cos / Math.max(q2, 1)) * (1 - smooth(q2, F0, R2))
    }
    return Math.max(floor, 1 - strength * Math.min(1, occ))
  }
}

// occlude(meshes, shade, root): darken every vertex's colour (and plain) of each mesh (taken into `root`'s
// space) by shade(); a mesh's own part is mesh.userData.aoId
export function occlude(meshes, shade, root) {
  root.updateMatrixWorld(true)
  const inv = new THREE.Matrix4().copy(root.matrixWorld).invert()
  const m = new THREE.Matrix4(), nm = new THREE.Matrix3()
  for (const mesh of meshes) {
    const g = mesh.geometry, pos = g.attributes.position.array, nor = g.attributes.normal.array
    const attrs = [g.attributes.color, g.attributes.plain].filter(Boolean).map((a) => a.array)
    const id = mesh.userData.aoId
    m.multiplyMatrices(inv, mesh.matrixWorld)
    nm.getNormalMatrix(m)
    const e = m.elements, f = nm.elements
    for (let i = 0; i < pos.length / 3; i++) {
      const x0 = pos[3 * i], y0 = pos[3 * i + 1], z0 = pos[3 * i + 2], n0 = nor[3 * i], n1 = nor[3 * i + 1], n2 = nor[3 * i + 2]
      let nx = f[0] * n0 + f[3] * n1 + f[6] * n2, ny = f[1] * n0 + f[4] * n1 + f[7] * n2, nz = f[2] * n0 + f[5] * n1 + f[8] * n2
      const nl = Math.hypot(nx, ny, nz) || 1
      const kk = shade(e[0] * x0 + e[4] * y0 + e[8] * z0 + e[12], e[1] * x0 + e[5] * y0 + e[9] * z0 + e[13], e[2] * x0 + e[6] * y0 + e[10] * z0 + e[14], nx / nl, ny / nl, nz / nl, id)
      if (kk < 1) {
        for (let q = 0; q < attrs.length; q++) {
          const a = attrs[q]
          a[3 * i] *= kk, a[3 * i + 1] *= kk, a[3 * i + 2] *= kk
        }
      }
    }
    for (const a of [g.attributes.color, g.attributes.plain]) if (a) a.needsUpdate = true
  }
}

// count a group's triangles (every mesh)
export function triangles(root) {
  let n = 0
  root.traverse((o) => {
    if (!o.isMesh) return
    const g = o.geometry
    n += (g.index ? g.index.count : g.attributes.position.count) / 3
  })
  return Math.round(n)
}
