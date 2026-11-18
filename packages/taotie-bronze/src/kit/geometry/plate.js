// STATUS: first pass — plate(): a flat cast plate (yue / ge / qi blade, plaque) with a
// real silhouette and real through-openings, relief on both faces.
//
// Shang blades were cast in two-piece moulds: a plate a few mm thick whose outline and
// openwork are true holes (the core pieces stood right through the mould), whose
// thickness changes across it (thick at the tang and body, thinning to a bevelled edge),
// and whose décor is low relief on one or both faces. plate() builds exactly that:
//
//   outline + holes (mm, in the plate's own x-right / y-up frame)
//     → constrained triangulation (earcut) → longest-edge (LEPP) refinement, fine where
//       the relief or the thickness changes, coarse on plain fields; the outline and the
//       hole loops are kept EXACTLY (they are only ever split at midpoints)
//     → front face at z = +t/2 (+ relief), back face at z = −t/2 (− relief)
//     → one wall strip along every boundary edge (the outline and every hole): clean,
//       straight-through cut walls, smooth along curves, creased at corners.
//
// Normals: the base (undisplaced) surface's own normals — a bevel or a thickness taper
// shades as such — and the ReliefMap's normal map carries the relief slope (as
// buildSurface's 'surface' normals: never both). One mesh, one material.
//
// The plate lies in the XY plane (x right, y up, front face toward +Z): position / rotate
// the returned mesh yourself. All mm.

import * as THREE from 'three'

/**
 * @param {object} o
 * @param {number[][]} o.outline           closed outline [[x, y]…] (either winding; no repeated last point)
 * @param {number[][][]} [o.holes]         through-openings, each a closed loop
 * @param {number|((x:number, y:number) => number)} [o.thickness]   full thickness (mm), symmetric about z = 0
 * @param {object} [o.front]               { relief: ReliefMap, rect: {x, y, w, h} (where the panel lies, plate mm),
 *                                           scale (1), mirror (false) }
 * @param {object} [o.back]                same; `mirror: true` (default for the back) reads the panel at −x, so a
 *                                         design made for the front reads the right way round from behind;
 *                                         `relief: 'front'` reuses the front's map and rect
 * @param {number} [o.spacing]             target edge length (mm) on plain fields (default 6)
 * @param {number} [o.reliefSpacing]       target edge length where a face carries relief (default 1.2)
 * @param {(x:number, y:number) => number} [o.refine]   extra target edge length (mm) per point; the minimum wins
 * @param {number} [o.crease]              wall normals split where the outline turns more than this (deg, 35)
 * @param {THREE.Material} [o.material]
 * @param {string} [o.part]                userData.part ('body')
 * @param {number} [o.maxTriangles]        refinement stops at this many (default 400k)
 * @returns {THREE.Mesh}  userData: { plate: { triangles, vertices, boundaryLoops, ms, thicknessAt(x,y), surfaceAt(x,y,side) } }
 */
export function plate({
  outline,
  holes = [],
  thickness = 8,
  front = null,
  back = null,
  spacing = 6,
  reliefSpacing = 1.2,
  refine = null,
  crease = 35,
  material = null,
  part = 'body',
  maxTriangles = 400000,
}) {
  const t0 = now()
  const T = typeof thickness === 'function' ? thickness : () => thickness
  const F = faceSpec(front, null)
  const B = faceSpec(back === 'front' ? { relief: 'front' } : back, F, true)

  // ---- loops: outline CCW, holes CW (earcut does not care, the walls do)
  // collinear vertices are dropped first: earcut turns three collinear boundary points into a zero-area
  // triangle, and bisecting that duplicates a vertex
  // (boundary edges are never pre-split: refinement splits them at their midpoints where it needs to)
  const outer = simplify(orient(outline, true))
  const hl = holes.map((h) => simplify(orient(h, false)))

  // ---- earcut
  const V = [] // flat x, y
  const push = (p) => { V.push(p[0], p[1]); return V.length / 2 - 1 }
  for (const p of outer) push(p)
  for (const h of hl) for (const p of h) push(p)
  const tri = THREE.ShapeUtils.triangulateShape(
    outer.map((p) => new THREE.Vector2(p[0], p[1])),
    hl.map((h) => h.map((p) => new THREE.Vector2(p[0], p[1]))),
  )
  const Tr = [] // flat a, b, c (CCW)
  for (const [a, b, c] of tri) {
    const area = (V[2 * b] - V[2 * a]) * (V[2 * c + 1] - V[2 * a + 1]) - (V[2 * c] - V[2 * a]) * (V[2 * b + 1] - V[2 * a + 1])
    if (area >= 0) Tr.push(a, b, c)
    else Tr.push(a, c, b)
  }

  // ---- sizing field: relief busy-ness (from the maps) + thickness change + caller's refine
  const busy = busyGrid([F, B], 2)
  const target = (x, y) => {
    let h = spacing
    if (busy.at(x, y)) h = Math.min(h, reliefSpacing)
    if (refine) h = Math.min(h, refine(x, y))
    return Math.max(h, 0.2)
  }

  // ---- Delaunay flips (earcut fans slivers) ⇄ LEPP refinement (Rivara: conforming, keeps every
  // boundary edge on its line), alternated so new points land in well-shaped triangles
  flipDelaunay(V, Tr)
  for (let pass = 0; pass < 4; pass++) {
    const n0 = Tr.length
    lepp(V, Tr, target, maxTriangles)
    flipDelaunay(V, Tr)
    if (Tr.length === n0) break
  }

  // ---- per-vertex base surface + displacement
  const nV = V.length / 2
  const nT = Tr.length / 3
  const th = new Float32Array(nV)
  for (let i = 0; i < nV; i++) th[i] = T(V[2 * i], V[2 * i + 1])
  const dF = new Float32Array(nV)
  const dB = new Float32Array(nV)
  const uvF = new Float32Array(nV * 2).fill(-1)
  const uvB = new Float32Array(nV * 2).fill(-1)
  const macroF = F ? F.relief.macro(reliefSpacing * 0.75) : null
  const macroB = B ? (B.relief === F?.relief ? macroF : B.relief.macro(reliefSpacing * 0.75)) : null
  for (let i = 0; i < nV; i++) {
    const x = V[2 * i], y = V[2 * i + 1]
    if (F) {
      const [u, v] = F.uv(x, y)
      uvF[2 * i] = u; uvF[2 * i + 1] = v
      if (u >= 0 && u <= 1 && v >= 0 && v <= 1) dF[i] = macroF.sample(u, v) * F.scale
    }
    if (B) {
      const [u, v] = B.uv(x, y)
      uvB[2 * i] = u; uvB[2 * i + 1] = v
      if (u >= 0 && u <= 1 && v >= 0 && v <= 1) dB[i] = macroB.sample(u, v) * B.scale
    }
  }
  // a face without a map still needs valid uv for a material that has one (read the corner pixel = plain)

  // base normals of the two faces from the undisplaced thickness surface (z = ±t/2)
  const nF = new Float32Array(nV * 3)
  for (let k = 0; k < nT; k++) {
    const a = Tr[3 * k], b = Tr[3 * k + 1], c = Tr[3 * k + 2]
    const ax = V[2 * a], ay = V[2 * a + 1], az = th[a] / 2
    const bx = V[2 * b] - ax, by = V[2 * b + 1] - ay, bz = th[b] / 2 - az
    const cx = V[2 * c] - ax, cy = V[2 * c + 1] - ay, cz = th[c] / 2 - az
    const nx = by * cz - bz * cy, ny = bz * cx - bx * cz, nz = bx * cy - by * cx // area-weighted, +z
    for (const i of [a, b, c]) { nF[3 * i] += nx; nF[3 * i + 1] += ny; nF[3 * i + 2] += nz }
  }
  for (let i = 0; i < nV; i++) {
    const l = Math.hypot(nF[3 * i], nF[3 * i + 1], nF[3 * i + 2]) || 1
    nF[3 * i] /= l; nF[3 * i + 1] /= l; nF[3 * i + 2] /= l
  }

  // ---- boundary loops (edges used by one triangle), in triangle order (CCW → outward on the right)
  const bnext = new Map() // a → b along the boundary
  {
    const cnt = new Map()
    const key = (a, b) => (a < b ? a * nV + b : b * nV + a)
    for (let k = 0; k < nT; k++) for (let e = 0; e < 3; e++) {
      const a = Tr[3 * k + e], b = Tr[3 * k + ((e + 1) % 3)]
      const kk = key(a, b)
      cnt.set(kk, (cnt.get(kk) || 0) + 1)
    }
    for (let k = 0; k < nT; k++) for (let e = 0; e < 3; e++) {
      const a = Tr[3 * k + e], b = Tr[3 * k + ((e + 1) % 3)]
      if (cnt.get(key(a, b)) === 1) bnext.set(a, b)
    }
  }
  const loops = []
  {
    const seen = new Set()
    for (const s of bnext.keys()) {
      if (seen.has(s)) continue
      const L = []
      let a = s
      while (!seen.has(a) && bnext.has(a)) { seen.add(a); L.push(a); a = bnext.get(a) }
      if (L.length > 2) loops.push(L)
    }
  }

  // ---- assemble: front, back, walls
  let wallVerts = 0
  for (const L of loops) wallVerts += L.length * 4
  const NV = nV * 2 + wallVerts
  const pos = new Float32Array(NV * 3)
  const nrm = new Float32Array(NV * 3)
  const uv = new Float32Array(NV * 2)
  const tan = new Float32Array(NV * 4)
  const idx = []
  for (let i = 0; i < nV; i++) {
    const x = V[2 * i], y = V[2 * i + 1]
    // front
    pos.set([x, y, th[i] / 2 + dF[i]], i * 3)
    nrm.set([nF[3 * i], nF[3 * i + 1], nF[3 * i + 2]], i * 3)
    uv.set([uvF[2 * i], uvF[2 * i + 1]], i * 2)
    tan.set(tangentFor(nF, i, F && F.mirror ? -1 : 1, 1), i * 4)
    // back
    const j = nV + i
    pos.set([x, y, -th[i] / 2 - dB[i]], j * 3)
    nrm.set([nF[3 * i], nF[3 * i + 1], -nF[3 * i + 2]], j * 3)
    uv.set([uvB[2 * i], uvB[2 * i + 1]], j * 2)
    tan.set(tangentFor(nF, i, B && B.mirror ? -1 : 1, -1), j * 4)
  }
  for (let k = 0; k < nT; k++) {
    const a = Tr[3 * k], b = Tr[3 * k + 1], c = Tr[3 * k + 2]
    idx.push(a, b, c)
    idx.push(nV + a, nV + c, nV + b)
  }
  // walls: per loop vertex, an outward normal (right of travel) averaged across the two edges
  // unless the loop turns sharply there (crease → the corner gets two vertices per row)
  let w = nV * 2
  const cosC = Math.cos((crease * Math.PI) / 180)
  for (const L of loops) {
    const n = L.length
    const en = [] // outward normal per edge i → i+1
    for (let i = 0; i < n; i++) {
      const a = L[i], b = L[(i + 1) % n]
      const dx = V[2 * b] - V[2 * a], dy = V[2 * b + 1] - V[2 * a + 1]
      const l = Math.hypot(dx, dy) || 1
      en.push([dy / l, -dx / l])
    }
    // each edge gets its own 4 vertices: (a front, b front, b back, a back), normals smoothed at soft joints
    for (let i = 0; i < n; i++) {
      const a = L[i], b = L[(i + 1) % n]
      const e = en[i]
      const ePrev = en[(i - 1 + n) % n], eNext = en[(i + 1) % n]
      const na = e[0] * ePrev[0] + e[1] * ePrev[1] > cosC ? norm2(e[0] + ePrev[0], e[1] + ePrev[1]) : e
      const nb = e[0] * eNext[0] + e[1] * eNext[1] > cosC ? norm2(e[0] + eNext[0], e[1] + eNext[1]) : e
      const tx = -e[1], ty = e[0] // along −travel … any in-plane tangent will do: the map is flat at a cut
      const verts = [
        [a, 1, na], [b, 1, nb], [b, -1, nb], [a, -1, na],
      ]
      for (let q = 0; q < 4; q++) {
        const [vi, side, nn] = verts[q]
        const z = side > 0 ? th[vi] / 2 + dF[vi] : -th[vi] / 2 - dB[vi]
        pos.set([V[2 * vi], V[2 * vi + 1], z], (w + q) * 3)
        nrm.set([nn[0], nn[1], 0], (w + q) * 3)
        // the wall reads the face map at its own boundary point (same patina as the land beside it)
        if (side > 0) uv.set([uvF[2 * vi], uvF[2 * vi + 1]], (w + q) * 2)
        else uv.set([uvB[2 * vi], uvB[2 * vi + 1]], (w + q) * 2)
        tan.set([tx, ty, 0, 1], (w + q) * 4)
      }
      // outward = right of travel; seen from outside the quad a(front) b(front) b(back) a(back) is …
      idx.push(w, w + 3, w + 2, w, w + 2, w + 1)
      w += 4
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('normal', new THREE.BufferAttribute(nrm, 3))
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  geo.setAttribute('tangent', new THREE.BufferAttribute(tan, 4))
  geo.setIndex(NV > 65535 ? new THREE.Uint32BufferAttribute(idx, 1) : new THREE.Uint16BufferAttribute(idx, 1))
  geo.computeBoundingBox()
  geo.computeBoundingSphere()
  const mesh = new THREE.Mesh(geo, material || new THREE.MeshStandardMaterial({ color: 0x6b7f5a }))
  mesh.castShadow = mesh.receiveShadow = true
  mesh.userData.part = part
  mesh.userData.plate = {
    triangles: idx.length / 3,
    vertices: NV,
    boundaryLoops: loops.length,
    ms: Math.round(now() - t0),
    thicknessAt: (x, y) => T(x, y),
    surfaceAt: (x, y, side = 1) => {
      let d = 0
      const S = side > 0 ? F : B
      if (S) { const [u, v] = S.uv(x, y); if (u >= 0 && u <= 1 && v >= 0 && v <= 1) d = S.relief.sample(u, v) * S.scale }
      return side * (T(x, y) / 2 + d)
    },
  }
  return mesh
}

// ---------------------------------------------------------------------------- helpers

function faceSpec(f, other, isBack = false) {
  if (!f) return null
  if (f.relief === 'front') {
    if (!other) return null
    f = { ...f, relief: other.relief, rect: f.rect || other.rect, scale: f.scale ?? other.scale }
  }
  if (!f.relief) return null
  const rect = f.rect || { x: 0, y: 0, w: f.relief.widthMM, h: f.relief.heightMM }
  const mirror = f.mirror ?? isBack
  return {
    relief: f.relief,
    rect,
    scale: f.scale ?? 1,
    mirror,
    uv: (x, y) => [((mirror ? -x : x) - rect.x) / rect.w, (y - rect.y) / rect.h],
  }
}

/** coarse "does the relief change here" grid over both faces' maps, in plate mm (cell mm), dilated one cell */
function busyGrid(faces, cell, busyStep = 0.12) {
  const rects = []
  for (const f of faces) {
    if (!f) continue
    const r = f.relief
    const cols = Math.ceil(f.rect.w / cell), rows = Math.ceil(f.rect.h / cell)
    // a cell is busy where the relief CHANGES inside it (shoulders, domes, grooves), not on a flat top
    const lo = new Float32Array(cols * rows).fill(Infinity)
    const hi = new Float32Array(cols * rows).fill(-Infinity)
    const W = r.width, H = r.height, D = r.data
    for (let j = 0; j < H; j++) {
      const gy = Math.min(rows - 1, Math.floor(((j + 0.5) / H) * rows))
      for (let i = 0; i < W; i++) {
        const c = gy * cols + Math.min(cols - 1, Math.floor(((i + 0.5) / W) * cols))
        const v = D[j * W + i]
        if (v < lo[c]) lo[c] = v
        if (v > hi[c]) hi[c] = v
      }
    }
    const g = new Uint8Array(cols * rows)
    for (let c = 0; c < g.length; c++) g[c] = hi[c] - lo[c] > busyStep ? 1 : 0
    const d = new Uint8Array(g)
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      if (!g[j * cols + i]) continue
      for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) {
        const ii = i + a, jj = j + b
        if (ii >= 0 && jj >= 0 && ii < cols && jj < rows) d[jj * cols + ii] = 1
      }
    }
    rects.push({ f, cols, rows, d })
  }
  return {
    at(x, y) {
      for (const { f, cols, rows, d } of rects) {
        const [u, v] = f.uv(x, y)
        if (u < 0 || u > 1 || v < 0 || v > 1) continue
        if (d[Math.min(rows - 1, Math.floor(v * rows)) * cols + Math.min(cols - 1, Math.floor(u * cols))]) return true
      }
      return false
    },
  }
}

/** Rivara longest-edge propagation-path bisection, in place on V (flat xy) and Tr (flat CCW triangles) */
function lepp(V, Tr, target, maxTriangles) {
  const E = new Map() // edge key → [tri, tri]
  const key = (a, b) => (a < b ? `${a},${b}` : `${b},${a}`)
  const addTri = (k) => {
    for (let e = 0; e < 3; e++) {
      const kk = key(Tr[3 * k + e], Tr[3 * k + ((e + 1) % 3)])
      const l = E.get(kk)
      if (l) l.push(k)
      else E.set(kk, [k])
    }
  }
  const remTri = (k) => {
    for (let e = 0; e < 3; e++) {
      const kk = key(Tr[3 * k + e], Tr[3 * k + ((e + 1) % 3)])
      const l = E.get(kk)
      const p = l.indexOf(k)
      if (p >= 0) l.splice(p, 1)
      if (!l.length) E.delete(kk)
    }
  }
  const len2 = (a, b) => (V[2 * a] - V[2 * b]) ** 2 + (V[2 * a + 1] - V[2 * b + 1]) ** 2
  // longest edge, ties broken by vertex ids so both triangles of an edge agree
  const longest = (k) => {
    let best = -1, be = 0, bk = ''
    for (let e = 0; e < 3; e++) {
      const a = Tr[3 * k + e], b = Tr[3 * k + ((e + 1) % 3)]
      const l = len2(a, b)
      const kk = key(a, b)
      if (l > best + 1e-9 || (Math.abs(l - best) <= 1e-9 && kk < bk)) { best = l; be = e; bk = kk }
    }
    return be
  }
  const nT0 = Tr.length / 3
  for (let k = 0; k < nT0; k++) addTri(k)
  const mids = new Map()
  const splitEdge = (a, b) => {
    const kk = key(a, b)
    let m = mids.get(kk)
    if (m === undefined) {
      V.push((V[2 * a] + V[2 * b]) / 2, (V[2 * a + 1] + V[2 * b + 1]) / 2)
      m = V.length / 2 - 1
      mids.set(kk, m)
    }
    const tris = (E.get(kk) || []).slice()
    for (const k of tris) {
      // rotate so the split edge is (p, q) with r opposite, keeping CCW
      let e = 0
      for (; e < 3; e++) {
        const p = Tr[3 * k + e], q = Tr[3 * k + ((e + 1) % 3)]
        if ((p === a && q === b) || (p === b && q === a)) break
      }
      const p = Tr[3 * k + e], q = Tr[3 * k + ((e + 1) % 3)], r = Tr[3 * k + ((e + 2) % 3)]
      remTri(k)
      Tr[3 * k] = p; Tr[3 * k + 1] = m; Tr[3 * k + 2] = r
      addTri(k)
      const n = Tr.length / 3
      Tr.push(m, q, r)
      addTri(n)
      queue.push(k, n)
    }
  }
  const needs = (k) => {
    const e = longest(k)
    const a = Tr[3 * k + e], b = Tr[3 * k + ((e + 1) % 3)]
    const c = Tr[3 * k + ((e + 2) % 3)]
    const cx = (V[2 * a] + V[2 * b] + V[2 * c]) / 3, cy = (V[2 * a + 1] + V[2 * b + 1] + V[2 * c + 1]) / 3
    const h = Math.min(target(cx, cy), target((V[2 * a] + V[2 * b]) / 2, (V[2 * a + 1] + V[2 * b + 1]) / 2))
    return len2(a, b) > h * h
  }
  const bisect = (k, depth = 0) => {
    // walk the longest-edge propagation path until a terminal edge (shared longest, or boundary)
    for (let guard = 0; guard < 64; guard++) {
      const e = longest(k)
      const a = Tr[3 * k + e], b = Tr[3 * k + ((e + 1) % 3)]
      const l = E.get(key(a, b))
      const n = l.length > 1 ? (l[0] === k ? l[1] : l[0]) : -1
      if (n < 0) { splitEdge(a, b); return }
      const en = longest(n)
      const na = Tr[3 * n + en], nb = Tr[3 * n + ((en + 1) % 3)]
      if (key(na, nb) === key(a, b)) { splitEdge(a, b); return }
      if (depth > 48) { splitEdge(a, b); return } // non-conforming safety valve (never seen)
      bisect(n, depth + 1)
    }
  }
  const queue = []
  for (let k = 0; k < Tr.length / 3; k++) queue.push(k)
  while (queue.length) {
    if (Tr.length / 3 >= maxTriangles) break
    const k = queue.pop()
    if (needs(k)) { bisect(k); queue.push(k) }
  }
}

/** Lawson flips to the constrained Delaunay triangulation (boundary edges never flip), in place */
function flipDelaunay(V, Tr) {
  const nT = Tr.length / 3
  const E = new Map()
  const key = (a, b) => (a < b ? a * 4194304 + b : b * 4194304 + a)
  const setE = (k) => {
    for (let e = 0; e < 3; e++) {
      const kk = key(Tr[3 * k + e], Tr[3 * k + ((e + 1) % 3)])
      const l = E.get(kk)
      if (l) { if (!l.includes(k)) l.push(k) } else E.set(kk, [k])
    }
  }
  const unsetE = (k) => {
    for (let e = 0; e < 3; e++) {
      const kk = key(Tr[3 * k + e], Tr[3 * k + ((e + 1) % 3)])
      const l = E.get(kk)
      if (!l) continue
      const p = l.indexOf(k)
      if (p >= 0) l.splice(p, 1)
      if (!l.length) E.delete(kk)
    }
  }
  for (let k = 0; k < nT; k++) setE(k)
  const X = (i) => V[2 * i], Y = (i) => V[2 * i + 1]
  const inCircle = (a, b, c, d) => {
    const ax = X(a) - X(d), ay = Y(a) - Y(d), bx = X(b) - X(d), by = Y(b) - Y(d), cx = X(c) - X(d), cy = Y(c) - Y(d)
    return (ax * ax + ay * ay) * (bx * cy - cx * by) - (bx * bx + by * by) * (ax * cy - cx * ay) + (cx * cx + cy * cy) * (ax * by - bx * ay)
  }
  const orient2 = (a, b, c) => (X(b) - X(a)) * (Y(c) - Y(a)) - (X(c) - X(a)) * (Y(b) - Y(a))
  const stack = []
  for (let k = 0; k < nT; k++) stack.push(k)
  let guard = nT * 30
  while (stack.length && guard-- > 0) {
    const k = stack.pop()
    for (let e = 0; e < 3; e++) {
      const a = Tr[3 * k + e], b = Tr[3 * k + ((e + 1) % 3)], c = Tr[3 * k + ((e + 2) % 3)]
      const l = E.get(key(a, b))
      if (!l || l.length !== 2) continue
      const n = l[0] === k ? l[1] : l[0]
      let d = -1
      for (let f = 0; f < 3; f++) { const v = Tr[3 * n + f]; if (v !== a && v !== b) d = v }
      if (d < 0) continue
      if (inCircle(a, b, c, d) <= 1e-9) continue
      // the flipped pair (c, a, d) and (c, d, b) must both stay CCW (the quad is convex)
      if (orient2(c, a, d) <= 1e-9 || orient2(c, d, b) <= 1e-9) continue
      unsetE(k); unsetE(n)
      Tr[3 * k] = c; Tr[3 * k + 1] = a; Tr[3 * k + 2] = d
      Tr[3 * n] = c; Tr[3 * n + 1] = d; Tr[3 * n + 2] = b
      setE(k); setE(n)
      stack.push(k, n)
      break
    }
  }
}

function tangentFor(nF, i, uSign, zSign) {
  // tangent along ±x projected off the face normal; w so that cross(n, t)·w = +y (panel v up)
  const nx = nF[3 * i], ny = nF[3 * i + 1], nz = nF[3 * i + 2] * zSign
  let tx = uSign, ty = 0, tz = 0
  const d = tx * nx
  tx -= nx * d; ty -= ny * d; tz -= nz * d
  const l = Math.hypot(tx, ty, tz) || 1
  tx /= l; ty /= l; tz /= l
  const by = nz * tx - nx * tz // (n × t).y
  return [tx, ty, tz, by < 0 ? -1 : 1]
}

function orient(loop, ccw) {
  let a = 0
  for (let i = 0; i < loop.length; i++) {
    const p = loop[i], q = loop[(i + 1) % loop.length]
    a += p[0] * q[1] - q[0] * p[1]
  }
  return (a > 0) === ccw ? loop.slice() : loop.slice().reverse()
}

/** drop vertices where the loop runs straight on (< 0.3°) or doubles back onto itself */
function simplify(loop) {
  let pts = loop.slice()
  for (let pass = 0; pass < 3; pass++) {
    const out = []
    const n = pts.length
    for (let i = 0; i < n; i++) {
      const a = pts[(i - 1 + n) % n], b = pts[i], c = pts[(i + 1) % n]
      const ux = b[0] - a[0], uy = b[1] - a[1], vx = c[0] - b[0], vy = c[1] - b[1]
      const lu = Math.hypot(ux, uy), lv = Math.hypot(vx, vy)
      if (lu < 1e-6) continue
      const sin = (ux * vy - uy * vx) / (lu * lv || 1)
      const cos = (ux * vx + uy * vy) / (lu * lv || 1)
      if (Math.abs(sin) < 0.005 && cos > 0) continue
      out.push(b)
    }
    if (out.length === pts.length) break
    pts = out
  }
  return pts
}

/** split every edge of a closed loop so no piece is longer than `h` (original vertices kept) */
function resampleLoop(loop, h) {
  const out = []
  const n = loop.length
  for (let i = 0; i < n; i++) {
    const p = loop[i], q = loop[(i + 1) % n]
    const L = Math.hypot(q[0] - p[0], q[1] - p[1])
    if (L < 1e-6) continue
    const k = Math.max(1, Math.ceil(L / h))
    for (let s = 0; s < k; s++) out.push([p[0] + ((q[0] - p[0]) * s) / k, p[1] + ((q[1] - p[1]) * s) / k])
  }
  return out
}

function norm2(x, y) {
  const l = Math.hypot(x, y) || 1
  return [x / l, y / l]
}

function now() {
  return typeof performance !== 'undefined' ? performance.now() : Date.now()
}
