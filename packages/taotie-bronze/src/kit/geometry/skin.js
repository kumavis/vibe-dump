// skin — dressing a triangle mesh the kit did not make (a scan, a polygon cage, an imported model).
//
// Everything else in the kit decorates surfaces it generates itself (buildSurface: (u, v) → mm). A mesh
// from elsewhere has no (u, v), so this module supplies the three things relief and patina need:
//
//   1. a clean, dense enough mesh  — weld, smooth normals, Loop subdivision of a coarse cage, and
//      refinement to a target edge length only where relief will displace it (with a vertex cap);
//   2. a cavity per vertex         — how recessed a point is (0 deep crease → ~0.72 open → 1 sharp ridge),
//      from a voxel obscurance at a few radii plus the mesh's own fine mean curvature, so corrosion
//      gathers in creases and bare metal shows on ridges the way the relief cavity channel does on panels;
//   3. projected relief            — planar / cylindrical / spherical projectors that map a ReliefMap onto
//      a region of the mesh: vertices displaced along the normal by relief.macro(), uv + tangents written
//      so the panel's normal map shades it, the weight fading to exactly 0 at the projector's edges and
//      where the surface turns away (no print-through to the back).
//
// Conventions follow geometry/surface.js: mm, Y up, front +Z; the SHADING normal is the smooth,
// undisplaced normal and the full-res normal map carries all relief slope (KIT.md § Normals). One region
// = one material group; regions outside every projector keep the bare mesh and its cavity-driven patina.
//
// A mesh here is a plain object { positions: Float32Array(3N), indices: Uint32Array(3T), normals? }.

import * as THREE from 'three'
import { PatinaMaterial } from '../material/patina.js'

// ------------------------------------------------------------------------------------------ basics

/** { positions, indices } from a THREE.BufferGeometry (indexed or not; copies). */
export function meshFromGeometry(geo) {
  const pos = geo.getAttribute('position')
  const positions = new Float32Array(pos.count * 3)
  for (let i = 0; i < pos.count; i++) {
    positions[i * 3] = pos.getX(i); positions[i * 3 + 1] = pos.getY(i); positions[i * 3 + 2] = pos.getZ(i)
  }
  let indices
  if (geo.index) indices = Uint32Array.from(geo.index.array)
  else {
    indices = new Uint32Array(pos.count)
    for (let i = 0; i < pos.count; i++) indices[i] = i
  }
  return { positions, indices }
}

/** → { min: [x,y,z], max, size, center } in mm */
export function meshBounds(m) {
  const P = m.positions
  const min = [Infinity, Infinity, Infinity]
  const max = [-Infinity, -Infinity, -Infinity]
  for (let i = 0; i < P.length; i += 3) {
    for (let k = 0; k < 3; k++) {
      const v = P[i + k]
      if (v < min[k]) min[k] = v
      if (v > max[k]) max[k] = v
    }
  }
  const size = [max[0] - min[0], max[1] - min[1], max[2] - min[2]]
  return { min, max, size, center: [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2] }
}

/** Transform in place by a THREE.Matrix4 (or a function (v: Vector3) => void). Drops cached normals. */
export function transformMesh(m, t) {
  const v = new THREE.Vector3()
  const P = m.positions
  for (let i = 0; i < P.length; i += 3) {
    v.set(P[i], P[i + 1], P[i + 2])
    if (typeof t === 'function') t(v)
    else v.applyMatrix4(t)
    P[i] = v.x; P[i + 1] = v.y; P[i + 2] = v.z
  }
  m.normals = null
  // a mirroring transform flips the winding
  if (t && t.isMatrix4 && t.determinant() < 0) flipWinding(m)
  return m
}

function flipWinding(m) {
  const I = m.indices
  for (let t = 0; t < I.length; t += 3) {
    const a = I[t + 1]
    I[t + 1] = I[t + 2]
    I[t + 2] = a
  }
}

/**
 * Merge vertices closer than `tolerance` (mm, default 1e-4 × the bbox diagonal), drop degenerate and
 * duplicate triangles. UV seams, hard-edge splits and per-face vertices of an exported model collapse.
 */
export function weldMesh(m, tolerance) {
  const P = m.positions
  const N = P.length / 3
  const b = meshBounds(m)
  const tol = tolerance ?? Math.hypot(...b.size) * 1e-4
  const cell = Math.max(tol, 1e-9)
  const map = new Map()
  const remap = new Uint32Array(N)
  const out = []
  const key = (x, y, z) => x * 73856093 ^ y * 19349663 ^ z * 83492791
  for (let i = 0; i < N; i++) {
    const x = P[i * 3], y = P[i * 3 + 1], z = P[i * 3 + 2]
    const cx = Math.floor((x - b.min[0]) / cell), cy = Math.floor((y - b.min[1]) / cell), cz = Math.floor((z - b.min[2]) / cell)
    let found = -1
    for (let dx = -1; dx <= 1 && found < 0; dx++) for (let dy = -1; dy <= 1 && found < 0; dy++) for (let dz = -1; dz <= 1 && found < 0; dz++) {
      const list = map.get(key(cx + dx, cy + dy, cz + dz))
      if (!list) continue
      for (const j of list) {
        const ox = out[j * 3] - x, oy = out[j * 3 + 1] - y, oz = out[j * 3 + 2] - z
        if (ox * ox + oy * oy + oz * oz <= tol * tol) { found = j; break }
      }
    }
    if (found < 0) {
      found = out.length / 3
      out.push(x, y, z)
      const k = key(cx, cy, cz)
      const list = map.get(k)
      if (list) list.push(found)
      else map.set(k, [found])
    }
    remap[i] = found
  }
  const I = m.indices
  const idx = []
  const seen = new Set()
  for (let t = 0; t < I.length; t += 3) {
    const a = remap[I[t]], bb = remap[I[t + 1]], c = remap[I[t + 2]]
    if (a === bb || bb === c || c === a) continue
    const s = [a, bb, c].sort((p, q) => p - q)
    const k = s[0] + ',' + s[1] + ',' + s[2]
    if (seen.has(k)) continue
    seen.add(k)
    idx.push(a, bb, c)
  }
  return { positions: Float32Array.from(out), indices: Uint32Array.from(idx) }
}

/**
 * Cheap preview decimation by vertex clustering: every vertex in a `cell` mm grid cell collapses to the
 * cell's mean, degenerate and duplicate triangles go. Topology is not preserved (fine detail under a cell
 * merges); use it for a lighter quality < 1 build of a dense scan, never for the hero mesh.
 */
export function decimateMesh(m, cell) {
  const P = m.positions
  const N = P.length / 3
  const b = meshBounds(m)
  const nx = Math.ceil(b.size[0] / cell) + 1, ny = Math.ceil(b.size[1] / cell) + 1
  const map = new Map()
  const remap = new Uint32Array(N)
  const sum = []
  for (let i = 0; i < N; i++) {
    const ix = Math.floor((P[i * 3] - b.min[0]) / cell), iy = Math.floor((P[i * 3 + 1] - b.min[1]) / cell), iz = Math.floor((P[i * 3 + 2] - b.min[2]) / cell)
    const k = (iz * ny + iy) * nx + ix
    let c = map.get(k)
    if (c === undefined) { c = sum.length / 4; map.set(k, c); sum.push(0, 0, 0, 0) }
    sum[c * 4] += P[i * 3]; sum[c * 4 + 1] += P[i * 3 + 1]; sum[c * 4 + 2] += P[i * 3 + 2]; sum[c * 4 + 3]++
    remap[i] = c
  }
  const M = sum.length / 4
  const positions = new Float32Array(M * 3)
  for (let c = 0; c < M; c++) for (let k = 0; k < 3; k++) positions[c * 3 + k] = sum[c * 4 + k] / sum[c * 4 + 3]
  const I = m.indices
  const idx = []
  const seen = new Set()
  for (let t = 0; t < I.length; t += 3) {
    const a = remap[I[t]], bb = remap[I[t + 1]], c = remap[I[t + 2]]
    if (a === bb || bb === c || c === a) continue
    const s = [a, bb, c].sort((p, q) => p - q)
    const key = (s[0] * M + s[1]) * M + s[2]
    if (seen.has(key)) continue
    seen.add(key)
    idx.push(a, bb, c)
  }
  return { positions, indices: Uint32Array.from(idx) }
}

/**
 * Make stray triangles agree with their neighbourhood: a scan decimated by a crude algorithm carries a few
 * triangles wound the wrong way (they shade black, or vanish with back-face culling). Each triangle whose
 * face normal points against the mean of its corners' smooth normals is flipped; repeated `passes` times.
 * In place; returns the number flipped.
 */
export function orientFaces(m, passes = 2) {
  const P = m.positions, I = m.indices
  let flipped = 0
  for (let pass = 0; pass < passes; pass++) {
    const n = vertexNormals(m)
    let f = 0
    for (let t = 0; t < I.length; t += 3) {
      const a = I[t] * 3, b = I[t + 1] * 3, c = I[t + 2] * 3
      const abx = P[b] - P[a], aby = P[b + 1] - P[a + 1], abz = P[b + 2] - P[a + 2]
      const acx = P[c] - P[a], acy = P[c + 1] - P[a + 1], acz = P[c + 2] - P[a + 2]
      const fx = aby * acz - abz * acy, fy = abz * acx - abx * acz, fz = abx * acy - aby * acx
      const d = fx * (n[a] + n[b] + n[c]) + fy * (n[a + 1] + n[b + 1] + n[c + 1]) + fz * (n[a + 2] + n[b + 2] + n[c + 2])
      if (d < 0) {
        const s = I[t + 1]
        I[t + 1] = I[t + 2]
        I[t + 2] = s
        f++
      }
    }
    flipped += f
    if (!f) break
  }
  m.normals = null
  return flipped
}

/** Angle-weighted smooth vertex normals (stored on m.normals and returned). */
export function vertexNormals(m) {
  const P = m.positions, I = m.indices
  const n = new Float32Array(P.length)
  for (let t = 0; t < I.length; t += 3) {
    const ia = I[t] * 3, ib = I[t + 1] * 3, ic = I[t + 2] * 3
    const abx = P[ib] - P[ia], aby = P[ib + 1] - P[ia + 1], abz = P[ib + 2] - P[ia + 2]
    const acx = P[ic] - P[ia], acy = P[ic + 1] - P[ia + 1], acz = P[ic + 2] - P[ia + 2]
    const bcx = P[ic] - P[ib], bcy = P[ic + 1] - P[ib + 1], bcz = P[ic + 2] - P[ib + 2]
    let fx = aby * acz - abz * acy, fy = abz * acx - abx * acz, fz = abx * acy - aby * acx
    const fl = Math.hypot(fx, fy, fz)
    if (fl < 1e-20) continue
    fx /= fl; fy /= fl; fz /= fl
    const lab = Math.hypot(abx, aby, abz), lac = Math.hypot(acx, acy, acz), lbc = Math.hypot(bcx, bcy, bcz)
    const ang = (dx, dy, dz, l1, ex, ey, ez, l2) => Math.acos(Math.max(-1, Math.min(1, (dx * ex + dy * ey + dz * ez) / (l1 * l2 || 1))))
    const wa = ang(abx, aby, abz, lab, acx, acy, acz, lac)
    const wb = ang(-abx, -aby, -abz, lab, bcx, bcy, bcz, lbc)
    const wc = Math.PI - wa - wb
    n[ia] += fx * wa; n[ia + 1] += fy * wa; n[ia + 2] += fz * wa
    n[ib] += fx * wb; n[ib + 1] += fy * wb; n[ib + 2] += fz * wb
    n[ic] += fx * wc; n[ic + 1] += fy * wc; n[ic + 2] += fz * wc
  }
  for (let i = 0; i < n.length; i += 3) {
    const l = Math.hypot(n[i], n[i + 1], n[i + 2]) || 1
    n[i] /= l; n[i + 1] /= l; n[i + 2] /= l
  }
  m.normals = n
  return n
}

// edge table: key a*N+b (a < b) → edge id; per edge its two end vertices, up to two opposite vertices
// and the face count (> 2 = non-manifold, treated as a crease like a boundary)
function edgeTable(m) {
  const I = m.indices
  const N = m.positions.length / 3
  const H = I.length
  // bucket the half-edges by their lower vertex, then match the upper vertex inside each (small) bucket
  const start = new Uint32Array(N + 1)
  for (let h = 0; h < H; h++) {
    const a = I[h], b = I[h - (h % 3) + ((h % 3) + 1) % 3]
    start[(a < b ? a : b) + 1]++
  }
  for (let v = 0; v < N; v++) start[v + 1] += start[v]
  const fill = start.slice(0, N)
  const bucket = new Uint32Array(H)
  for (let h = 0; h < H; h++) {
    const a = I[h], b = I[h - (h % 3) + ((h % 3) + 1) % 3]
    bucket[fill[a < b ? a : b]++] = h
  }
  const ea = new Uint32Array(H), eb = new Uint32Array(H), o1 = new Int32Array(H), o2 = new Int32Array(H), fc = new Uint16Array(H)
  const triEdges = new Uint32Array(H)
  let count = 0
  for (let v = 0; v < N; v++) {
    const s0 = start[v], s1 = start[v + 1]
    const first = count
    for (let q = s0; q < s1; q++) {
      const h = bucket[q], t = h - (h % 3), k = h % 3
      const a = I[h], b = I[t + ((k + 1) % 3)], c = I[t + ((k + 2) % 3)]
      const hi = a < b ? b : a
      let e = -1
      for (let x = first; x < count; x++) if (eb[x] === hi) { e = x; break }
      if (e < 0) {
        e = count++
        ea[e] = v; eb[e] = hi; o1[e] = c; o2[e] = -1; fc[e] = 1
      } else {
        if (fc[e] === 1) o2[e] = c
        fc[e]++
      }
      triEdges[h] = e // edge k = (I[t+k], I[t+k+1])
    }
  }
  return { ea, eb, o1, o2, fc, triEdges, count }
}

/**
 * Loop subdivision (levels × 1:4), with the standard boundary / crease rules: an edge with one face
 * (or more than two) is a crease; its odd vertex is the edge midpoint, a vertex on two crease edges
 * moves by (1/8, 3/4, 1/8) along them, a corner (≠ 2 crease edges) stays put.
 */
export function loopSubdivide(m, levels = 1) {
  let cur = m
  for (let l = 0; l < levels; l++) cur = loopOnce(cur)
  return cur
}

function loopOnce(m) {
  const P = m.positions, I = m.indices
  const N = P.length / 3
  const E = edgeTable(m)
  const out = new Float32Array((N + E.count) * 3)
  // even vertices
  const nbrSum = new Float64Array(N * 3), nbrCount = new Uint32Array(N)
  const crSum = new Float64Array(N * 3), crCount = new Uint32Array(N)
  for (let e = 0; e < E.count; e++) {
    const a = E.ea[e], b = E.eb[e]
    const crease = E.fc[e] !== 2
    for (let k = 0; k < 3; k++) {
      nbrSum[a * 3 + k] += P[b * 3 + k]; nbrSum[b * 3 + k] += P[a * 3 + k]
      if (crease) { crSum[a * 3 + k] += P[b * 3 + k]; crSum[b * 3 + k] += P[a * 3 + k] }
    }
    nbrCount[a]++; nbrCount[b]++
    if (crease) { crCount[a]++; crCount[b]++ }
  }
  for (let v = 0; v < N; v++) {
    const n = nbrCount[v]
    for (let k = 0; k < 3; k++) {
      const p = P[v * 3 + k]
      let q
      if (crCount[v] === 2) q = 0.75 * p + 0.125 * crSum[v * 3 + k]
      else if (crCount[v] > 0 || n === 0) q = p
      else {
        const beta = n === 3 ? 3 / 16 : 3 / (8 * n)
        q = (1 - n * beta) * p + beta * nbrSum[v * 3 + k]
      }
      out[v * 3 + k] = q
    }
  }
  // odd vertices
  for (let e = 0; e < E.count; e++) {
    const a = E.ea[e], b = E.eb[e], o = (N + e) * 3
    if (E.fc[e] === 2) {
      const c = E.o1[e], d = E.o2[e]
      for (let k = 0; k < 3; k++) out[o + k] = 0.375 * (P[a * 3 + k] + P[b * 3 + k]) + 0.125 * (P[c * 3 + k] + P[d * 3 + k])
    } else for (let k = 0; k < 3; k++) out[o + k] = 0.5 * (P[a * 3 + k] + P[b * 3 + k])
  }
  const idx = new Uint32Array(I.length * 4)
  let w = 0
  for (let t = 0; t < I.length; t += 3) {
    const a = I[t], b = I[t + 1], c = I[t + 2]
    const ab = N + E.triEdges[t], bc = N + E.triEdges[t + 1], ca = N + E.triEdges[t + 2]
    idx[w++] = a; idx[w++] = ab; idx[w++] = ca
    idx[w++] = b; idx[w++] = bc; idx[w++] = ab
    idx[w++] = c; idx[w++] = ca; idx[w++] = bc
    idx[w++] = ab; idx[w++] = bc; idx[w++] = ca
  }
  return { positions: out, indices: idx }
}

/**
 * Split edges longer than the target length where `where` says relief will displace the mesh (red-green:
 * a triangle with 1 / 2 / 3 split edges becomes 2 / 3 / 4), repeated until nothing is too long, `passes`
 * runs out or `maxVerts` would be exceeded (then the longest edges go first). New points sit on the
 * Phong-tessellated surface through the end points' normals, so a coarse curved mesh refines smooth,
 * not faceted.
 * @param {object} o
 * @param {number|((x:number,y:number,z:number)=>number)} o.edge  target edge length, mm
 * @param {(x:number,y:number,z:number,nx:number,ny:number,nz:number)=>number} [o.where]  > 0 = refine here
 *        (e.g. reliefWhere(regions) or skinWeight(projectors)); default everywhere. Evaluated once per vertex (new
 *        vertices as they appear); an edge is split when either end is in
 * @param {number} [o.maxVerts] default 400k
 * @param {number} [o.passes] default 8
 * @param {number} [o.phong] 0 flat midpoints … 1 full Phong (default 0.75)
 */
export function refineMesh(m, { edge, where = null, maxVerts = 400000, passes = 8, phong = 0.75 } = {}) {
  let cur = { positions: m.positions, indices: m.indices }
  const target = typeof edge === 'function' ? edge : () => edge
  let flags = new Uint8Array(0) // per vertex: 0 unknown, 1 out, 2 in (vertex indices survive every pass)
  for (let pass = 0; pass < passes; pass++) {
    const P = cur.positions, I = cur.indices
    const N = P.length / 3
    const nrm = vertexNormals(cur)
    if (where) {
      const f = new Uint8Array(N)
      f.set(flags.subarray(0, Math.min(flags.length, N)))
      for (let v = 0; v < N; v++) if (!f[v]) f[v] = where(P[v * 3], P[v * 3 + 1], P[v * 3 + 2], nrm[v * 3], nrm[v * 3 + 1], nrm[v * 3 + 2]) > 0 ? 2 : 1
      flags = f
    }
    const E = edgeTable(cur)
    // candidate edges: too long and in the refine region
    const cand = []
    const len2 = new Float32Array(E.count)
    for (let e = 0; e < E.count; e++) {
      if (where && flags[E.ea[e]] !== 2 && flags[E.eb[e]] !== 2) continue
      const a = E.ea[e] * 3, b = E.eb[e] * 3
      const dx = P[b] - P[a], dy = P[b + 1] - P[a + 1], dz = P[b + 2] - P[a + 2]
      const L = Math.hypot(dx, dy, dz)
      const t = target((P[a] + P[b]) / 2, (P[a + 1] + P[b + 1]) / 2, (P[a + 2] + P[b + 2]) / 2)
      if (!(L > t)) continue
      len2[e] = L / t
      cand.push(e)
    }
    if (!cand.length) break
    // cap: each split edge adds one vertex
    const room = maxVerts - N
    if (room <= 0) break
    if (cand.length > room) {
      cand.sort((p, q) => len2[q] - len2[p])
      cand.length = room
    }
    const mid = new Int32Array(E.count).fill(-1)
    const out = new Float32Array((N + cand.length) * 3)
    out.set(P)
    let nv = N
    for (const e of cand) {
      const a = E.ea[e], b = E.eb[e]
      phongMid(P, nrm, a, b, phong, out, nv * 3)
      mid[e] = nv++
    }
    const idx = new Uint32Array(I.length * 4)
    let w = 0
    const tri = (a, b, c) => { idx[w++] = a; idx[w++] = b; idx[w++] = c }
    const v = [0, 0, 0], sp = [0, 0, 0]
    for (let t = 0; t < I.length; t += 3) {
      v[0] = I[t]; v[1] = I[t + 1]; v[2] = I[t + 2]
      sp[0] = mid[E.triEdges[t]]; sp[1] = mid[E.triEdges[t + 1]]; sp[2] = mid[E.triEdges[t + 2]] // sp[k] on edge v[k]→v[k+1]
      const n = (sp[0] >= 0) + (sp[1] >= 0) + (sp[2] >= 0)
      if (n === 0) tri(v[0], v[1], v[2])
      else if (n === 3) {
        tri(v[0], sp[0], sp[2]); tri(v[1], sp[1], sp[0]); tri(v[2], sp[2], sp[1]); tri(sp[0], sp[1], sp[2])
      } else if (n === 1) {
        const k = sp[0] >= 0 ? 0 : sp[1] >= 0 ? 1 : 2
        const a = v[k], b = v[(k + 1) % 3], c = v[(k + 2) % 3], ab = sp[k]
        tri(a, ab, c); tri(ab, b, c)
      } else {
        // two split edges: k = the unsplit one; cut the corner opposite it, then the quad by its shorter diagonal
        const k = sp[0] < 0 ? 0 : sp[1] < 0 ? 1 : 2
        const a = v[k], b = v[(k + 1) % 3], c = v[(k + 2) % 3]
        const bc = sp[(k + 1) % 3], ca = sp[(k + 2) % 3]
        tri(c, ca, bc)
        // quad a, b, bc, ca
        if (dist2(out, a, bc) < dist2(out, b, ca)) { tri(a, b, bc); tri(a, bc, ca) } else { tri(a, b, ca); tri(b, bc, ca) }
      }
    }
    cur = { positions: out, indices: idx.slice(0, w) }
    if (nv >= maxVerts) break
  }
  cur.normals = null
  return cur
}

function dist2(P, a, b) {
  const dx = P[a * 3] - P[b * 3], dy = P[a * 3 + 1] - P[b * 3 + 1], dz = P[a * 3 + 2] - P[b * 3 + 2]
  return dx * dx + dy * dy + dz * dz
}

function phongMid(P, nrm, a, b, alpha, out, o) {
  const ax = P[a * 3], ay = P[a * 3 + 1], az = P[a * 3 + 2]
  const bx = P[b * 3], by = P[b * 3 + 1], bz = P[b * 3 + 2]
  const mx = (ax + bx) / 2, my = (ay + by) / 2, mz = (az + bz) / 2
  const nax = nrm[a * 3], nay = nrm[a * 3 + 1], naz = nrm[a * 3 + 2]
  const nbx = nrm[b * 3], nby = nrm[b * 3 + 1], nbz = nrm[b * 3 + 2]
  const da = (mx - ax) * nax + (my - ay) * nay + (mz - az) * naz
  const db = (mx - bx) * nbx + (my - by) * nby + (mz - bz) * nbz
  const px = mx - 0.5 * (da * nax + db * nbx), py = my - 0.5 * (da * nay + db * nby), pz = mz - 0.5 * (da * naz + db * nbz)
  out[o] = mx + alpha * (px - mx); out[o + 1] = my + alpha * (py - my); out[o + 2] = mz + alpha * (pz - mz)
}

/** vertex → neighbour lists as CSR { start: Uint32Array(N+1), list: Uint32Array } */
export function meshNeighbours(m) {
  const N = m.positions.length / 3
  const E = edgeTable(m)
  const deg = new Uint32Array(N + 1)
  for (let e = 0; e < E.count; e++) { deg[E.ea[e]]++; deg[E.eb[e]]++ }
  const start = new Uint32Array(N + 1)
  for (let v = 0; v < N; v++) start[v + 1] = start[v] + deg[v]
  const fill = start.slice(0, N)
  const list = new Uint32Array(start[N])
  for (let e = 0; e < E.count; e++) {
    const a = E.ea[e], b = E.eb[e]
    list[fill[a]++] = b
    list[fill[b]++] = a
  }
  return { start, list }
}

// ------------------------------------------------------------------------------------------ cavity

/**
 * Per-vertex cavity, 0 deep recess → `flat` (0.72) on an open surface → 1 a sharp ridge — the same sense
 * as a ReliefMap's cavity channel and PatinaMaterial's `cavity`. Two cheap measures, computed once:
 *  - obscurance: the mesh is voxelised (surface → flood-fill the outside → solid), box-blurred at each
 *    radius, and read just off the surface: the solid fraction around a point is ½ on a flat wall, more in
 *    a crease or between coils, less on a crest (one O(grid) pass per radius, trilinear per vertex);
 *  - the fine mean curvature from the one-ring (umbrella Laplacian along the normal), band-passed (lightly
 *    smoothed, minus a heavily smoothed copy): the grooves between a scan's scales, finer than any useful
 *    voxel, read against their own neighbourhood — so they still count as recesses on a convex flank.
 * @param {object} o
 * @param {number} [o.voxel] mm (default bbox max / 140)
 * @param {number[]} [o.radii] mm (default [2.5, 6, 14] × voxel / 1.6)
 * @param {number[]} [o.weights] per radius, relative (default [0.5, 0.5, 0.4])
 * @param {number} [o.obscurance] gain of the voxel term (default 1.6)
 * @param {number} [o.curvature] gain of the fine curvature term (default 0.8)
 * @param {number} [o.curvatureScale] mm: a crease of this radius saturates (default 1.2 × mean edge)
 * @param {number|number[]} [o.smooth] smoothing passes on the curvature: n, or [fine, coarse] for a band-pass
 *        (default [2, 12]: the coarse copy is subtracted)
 * @param {number} [o.flat] cavity of an open flat surface (default 0.72)
 * @param {number} [o.gamma] > 1 deepens recesses (default 1)
 * @returns {Float32Array} 0..1 per vertex (also m.cavity)
 */
export function meshCavity(m, o = {}) {
  const P = m.positions
  const N = P.length / 3
  const nrm = m.normals || vertexNormals(m)
  const b = meshBounds(m)
  const vox = o.voxel ?? Math.max(...b.size) / 140
  const radii = o.radii ?? [2.5, 6, 14].map((r) => (r * vox) / 1.6)
  const weights = o.weights ?? [0.5, 0.5, 0.4]
  const flat = o.flat ?? 0.72
  const nb = meshNeighbours(m)

  // ---- voxel obscurance
  const pad = Math.ceil(Math.max(...radii) / vox) + 2
  const nx = Math.ceil(b.size[0] / vox) + 2 * pad + 1
  const ny = Math.ceil(b.size[1] / vox) + 2 * pad + 1
  const nz = Math.ceil(b.size[2] / vox) + 2 * pad + 1
  const ox = b.min[0] - pad * vox, oy = b.min[1] - pad * vox, oz = b.min[2] - pad * vox
  const G = nx * ny * nz
  const at = (i, j, k) => (k * ny + j) * nx + i
  const surf = new Uint8Array(G)
  const I = m.indices
  const mark = (x, y, z) => {
    const i = Math.floor((x - ox) / vox), j = Math.floor((y - oy) / vox), k = Math.floor((z - oz) / vox)
    surf[at(i, j, k)] = 1
  }
  for (let t = 0; t < I.length; t += 3) {
    const a = I[t] * 3, c = I[t + 1] * 3, d = I[t + 2] * 3
    const L = Math.max(Math.hypot(P[c] - P[a], P[c + 1] - P[a + 1], P[c + 2] - P[a + 2]), Math.hypot(P[d] - P[a], P[d + 1] - P[a + 1], P[d + 2] - P[a + 2]), Math.hypot(P[d] - P[c], P[d + 1] - P[c + 1], P[d + 2] - P[c + 2]))
    const n = Math.max(1, Math.ceil(L / (vox * 0.6)))
    for (let s = 0; s <= n; s++) for (let r = 0; r <= n - s; r++) {
      const u = s / n, v = r / n, w = 1 - u - v
      mark(P[a] * w + P[c] * u + P[d] * v, P[a + 1] * w + P[c + 1] * u + P[d + 1] * v, P[a + 2] * w + P[c + 2] * u + P[d + 2] * v)
    }
  }
  // flood the outside from the padded border
  const outside = new Uint8Array(G)
  const queue = new Int32Array(G)
  let qh = 0, qt = 0
  queue[qt++] = 0
  outside[0] = 1
  while (qh < qt) {
    const c = queue[qh++]
    const i = c % nx, j = ((c / nx) | 0) % ny, k = (c / (nx * ny)) | 0
    const push = (n) => {
      if (!outside[n] && !surf[n]) { outside[n] = 1; queue[qt++] = n }
    }
    if (i > 0) push(c - 1)
    if (i < nx - 1) push(c + 1)
    if (j > 0) push(c - nx)
    if (j < ny - 1) push(c + nx)
    if (k > 0) push(c - nx * ny)
    if (k < nz - 1) push(c + nx * ny)
  }
  const solid = new Float32Array(G)
  for (let c = 0; c < G; c++) solid[c] = outside[c] ? 0 : 1
  const obs = new Float32Array(N)
  let wsum = 0
  const tmp = new Float32Array(G)
  for (let s = 0; s < radii.length; s++) {
    const r = Math.max(1, Math.round(radii[s] / vox))
    const f = boxBlur3(solid, tmp, nx, ny, nz, r)
    const lift = vox * 0.5
    for (let v = 0; v < N; v++) {
      const occ = trilinear(f, nx, ny, nz, (P[v * 3] + nrm[v * 3] * lift - ox) / vox - 0.5, (P[v * 3 + 1] + nrm[v * 3 + 1] * lift - oy) / vox - 0.5, (P[v * 3 + 2] + nrm[v * 3 + 2] * lift - oz) / vox - 0.5)
      obs[v] += weights[s] * Math.max(-1, Math.min(1, (0.5 - occ) * 2.6))
    }
    wsum += weights[s]
  }

  const total = new Float32Array(N)
  const og = (o.obscurance ?? 1.6) / Math.max(wsum, 1e-6)
  for (let v = 0; v < N; v++) total[v] = obs[v] * og

  // ---- fine mean curvature (umbrella Laplacian along the normal), band-passed
  const cw = o.curvature ?? 0.8
  if (cw > 0) {
    const curv = new Float32Array(N)
    let edgeSum = 0, edgeN = 0
    for (let v = 0; v < N; v++) {
      const s0 = nb.start[v], s1 = nb.start[v + 1]
      if (s1 === s0) continue
      let ax = 0, ay = 0, az = 0, e2 = 0
      for (let q = s0; q < s1; q++) {
        const u = nb.list[q] * 3
        const dx = P[u] - P[v * 3], dy = P[u + 1] - P[v * 3 + 1], dz = P[u + 2] - P[v * 3 + 2]
        ax += dx; ay += dy; az += dz
        e2 += dx * dx + dy * dy + dz * dz
      }
      const k = s1 - s0
      ax /= k; ay /= k; az /= k; e2 /= k
      edgeSum += Math.sqrt(e2); edgeN++
      // convex: the neighbours' mean lies below the tangent plane → positive
      curv[v] = (-4 * (ax * nrm[v * 3] + ay * nrm[v * 3 + 1] + az * nrm[v * 3 + 2])) / Math.max(e2, 1e-12)
    }
    const meanEdge = edgeSum / Math.max(edgeN, 1)
    const cs = o.curvatureScale ?? 1.2 * meanEdge
    const sm = o.smooth ?? [2, 12]
    const [fine, coarse] = Array.isArray(sm) ? sm : [sm, 0]
    smoothField(curv, nb, fine)
    if (coarse > fine) {
      const low = Float32Array.from(curv)
      smoothField(low, nb, coarse - fine)
      for (let v = 0; v < N; v++) curv[v] -= low[v]
    }
    for (let v = 0; v < N; v++) total[v] += cw * Math.tanh(curv[v] * cs)
  }

  const cav = new Float32Array(N)
  const g = o.gamma ?? 1
  for (let v = 0; v < N; v++) {
    const c = Math.max(-1, Math.min(1, total[v]))
    cav[v] = c < 0 ? flat * Math.pow(1 + c, g) : flat + (1 - flat) * c
  }
  m.cavity = cav
  return cav
}

function smoothField(f, nb, passes) {
  const N = f.length
  const t = new Float32Array(N)
  for (let p = 0; p < passes; p++) {
    for (let v = 0; v < N; v++) {
      const s0 = nb.start[v], s1 = nb.start[v + 1]
      let s = f[v]
      for (let q = s0; q < s1; q++) s += f[nb.list[q]]
      t[v] = s / (1 + s1 - s0)
    }
    f.set(t)
  }
}

// separable box blur of radius r (cells) with running sums; returns a new array (src untouched)
function boxBlur3(src, tmp, nx, ny, nz, r) {
  const a = Float32Array.from(src)
  const line = new Float32Array(Math.max(nx, ny, nz))
  const pass = (n, stride, count, base) => {
    for (const b0 of base) {
      for (let i = 0; i < n; i++) line[i] = a[b0 + i * stride]
      let s = 0
      for (let i = -r; i <= r; i++) s += line[Math.min(n - 1, Math.max(0, i))]
      for (let i = 0; i < n; i++) {
        a[b0 + i * stride] = s / (2 * r + 1)
        s += line[Math.min(n - 1, i + r + 1)] - line[Math.max(0, i - r)]
      }
    }
    void count
  }
  const bx = [], by = [], bz = []
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) bx.push((k * ny + j) * nx)
  for (let k = 0; k < nz; k++) for (let i = 0; i < nx; i++) by.push(k * ny * nx + i)
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) bz.push(j * nx + i)
  pass(nx, 1, 0, bx)
  pass(ny, nx, 0, by)
  pass(nz, nx * ny, 0, bz)
  void tmp
  return a
}

function trilinear(f, nx, ny, nz, x, y, z) {
  x = Math.max(0, Math.min(nx - 1.001, x)); y = Math.max(0, Math.min(ny - 1.001, y)); z = Math.max(0, Math.min(nz - 1.001, z))
  const i = Math.floor(x), j = Math.floor(y), k = Math.floor(z)
  const fx = x - i, fy = y - j, fz = z - k
  const c = (k * ny + j) * nx + i
  const s = nx, t = nx * ny
  const c00 = f[c] * (1 - fx) + f[c + 1] * fx
  const c10 = f[c + s] * (1 - fx) + f[c + s + 1] * fx
  const c01 = f[c + t] * (1 - fx) + f[c + t + 1] * fx
  const c11 = f[c + t + s] * (1 - fx) + f[c + t + s + 1] * fx
  return (c00 * (1 - fy) + c10 * fy) * (1 - fz) + (c01 * (1 - fy) + c11 * fy) * fz
}

// ------------------------------------------------------------------------------------------ projectors
//
// A projector maps a mesh point (p, n) to panel mm (x, y) plus the 3D directions of +x and +y there,
// and a weight 0..1: 1 inside, fading to 0 over `fade` mm at the extent's edges, over `facing` where the
// surface turns away from the projection direction, outside `depth` / `radial` clips and under `mask`.
// evaluate(px, py, pz, nx, ny, nz, out) → weight; out = { x, y, tu: [3], tv: [3] }.

const smooth01 = (a, b, x) => {
  if (b === a) return x < a ? 0 : 1
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const ramp = (d, w) => (w <= 0 ? (d >= 0 ? 1 : 0) : smooth01(0, w, d))
const norm3 = (v) => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / l, v[1] / l, v[2] / l]
}
const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

function clipWeight(d, range, fade) {
  if (!range) return 1
  return ramp(d - range[0], fade) * ramp(range[1] - d, fade)
}

/**
 * Planar projector: the panel lies in the plane through `center` facing `normal` (the direction the
 * decorated surface faces, i.e. toward the viewer), panel +y along `up`, +x = up × normal (left → right
 * seen from the front). Panel (W/2, H/2) = center.
 * @param {object} o  { center, normal, up = [0,1,0], width, height, fade = 6, facing = [0.15, 0.45] (cos of
 *   the angle between surface normal and `normal`), depth: [near, far] mm along `normal` from center (optional),
 *   depthFade = 4, mask: (x, y, z, nx, ny, nz, px, py) => 0..1, mirror: false (panel x read right → left),
 *   anchor: [W/2, H/2] (the panel mm where `center` lands) }
 */
export function planarProjector(o) {
  const n = norm3(o.normal)
  let up = o.up ?? [0, 1, 0]
  up = norm3([up[0] - n[0] * dot3(up, n), up[1] - n[1] * dot3(up, n), up[2] - n[2] * dot3(up, n)])
  const right = cross3(up, n)
  const W = o.width, H = o.height, c = o.center
  const [AX, AY] = o.anchor ?? [W / 2, H / 2]
  const fade = o.fade ?? 6
  const facing = o.facing ?? [0.15, 0.45]
  const sx = o.mirror ? -1 : 1
  const tu = right.map((v) => v * sx)
  return {
    kind: 'planar', width: W, height: H, direction: n,
    evaluate(px, py, pz, nx, ny, nz, out) {
      const dx = px - c[0], dy = py - c[1], dz = pz - c[2]
      const x = AX + sx * (dx * right[0] + dy * right[1] + dz * right[2])
      const y = AY + dx * up[0] + dy * up[1] + dz * up[2]
      out.x = x; out.y = y
      out.tu[0] = tu[0]; out.tu[1] = tu[1]; out.tu[2] = tu[2]
      out.tv[0] = up[0]; out.tv[1] = up[1]; out.tv[2] = up[2]
      let w = ramp(Math.min(x, W - x), fade) * ramp(Math.min(y, H - y), fade)
      if (w <= 0) return 0
      w *= smooth01(facing[0], facing[1], nx * n[0] + ny * n[1] + nz * n[2])
      if (w <= 0) return 0
      w *= clipWeight(dx * n[0] + dy * n[1] + dz * n[2], o.depth, o.depthFade ?? 4)
      if (w > 0 && o.mask) w *= o.mask(px, py, pz, nx, ny, nz, x, y)
      return w
    },
  }
}

/**
 * Cylindrical projector round an axis: panel x = W/2 + θ·radius (θ = 0 at `front`, positive toward
 * axis × front — the lathe's azimuth sense, so x runs left → right seen from outside), panel y = H/2 +
 * the height along the axis from `origin`. `radius` sets the mm per radian (the décor is true-size on
 * that radius). Facing compares the surface normal with the radial direction.
 * @param {object} o  { origin, axis = [0,1,0], front = [0,0,1], radius, width, height, fade = 6,
 *   facing = [0.15, 0.45], radial: [rMin, rMax] (optional clip), radialFade = 4, mask, mirror,
 *   anchor: [W/2, H/2] (the panel mm of θ = 0 at the origin's height) }
 */
export function cylindricalProjector(o) {
  const ax = norm3(o.axis ?? [0, 1, 0])
  let f = o.front ?? [0, 0, 1]
  f = norm3([f[0] - ax[0] * dot3(f, ax), f[1] - ax[1] * dot3(f, ax), f[2] - ax[2] * dot3(f, ax)])
  const side = cross3(ax, f)
  const W = o.width, H = o.height, c = o.origin, R = o.radius
  const [AX, AY] = o.anchor ?? [W / 2, H / 2]
  const fade = o.fade ?? 6
  const facing = o.facing ?? [0.15, 0.45]
  const sx = o.mirror ? -1 : 1
  return {
    kind: 'cylindrical', width: W, height: H,
    evaluate(px, py, pz, nx, ny, nz, out) {
      const dx = px - c[0], dy = py - c[1], dz = pz - c[2]
      const h = dx * ax[0] + dy * ax[1] + dz * ax[2]
      const rx = dx - h * ax[0], ry = dy - h * ax[1], rz = dz - h * ax[2]
      const a = rx * f[0] + ry * f[1] + rz * f[2], s = rx * side[0] + ry * side[1] + rz * side[2]
      const th = Math.atan2(s, a)
      const r = Math.hypot(a, s) || 1e-9
      const x = AX + sx * th * R
      const y = AY + h
      out.x = x; out.y = y
      const ux = rx / r, uy = ry / r, uz = rz / r // radial
      const t = cross3(ax, [ux, uy, uz])
      out.tu[0] = t[0] * sx; out.tu[1] = t[1] * sx; out.tu[2] = t[2] * sx
      out.tv[0] = ax[0]; out.tv[1] = ax[1]; out.tv[2] = ax[2]
      let w = ramp(Math.min(x, W - x), fade) * ramp(Math.min(y, H - y), fade)
      if (w <= 0) return 0
      w *= smooth01(facing[0], facing[1], nx * ux + ny * uy + nz * uz)
      if (w <= 0) return 0
      w *= clipWeight(r, o.radial, o.radialFade ?? 4)
      if (w > 0 && o.mask) w *= o.mask(px, py, pz, nx, ny, nz, x, y)
      return w
    },
  }
}

/**
 * Spherical projector (latitude / longitude about `pole`): panel x = W/2 + longitude·radius (0 at `front`,
 * positive toward pole × front), panel y = H/2 + latitude·radius (toward the pole). True-size along the
 * equator, stretched toward the poles — lay the pole where no décor goes. Facing compares the surface
 * normal with the direction from `center`.
 * @param {object} o  { center, pole = [0,1,0], front = [0,0,1], radius, width, height, fade = 6,
 *   facing = [0.15, 0.45], radial: [rMin, rMax] (optional), radialFade, mask, mirror,
 *   anchor: [W/2, H/2] (the panel mm of longitude 0, latitude 0) }
 */
export function sphericalProjector(o) {
  const pl = norm3(o.pole ?? [0, 1, 0])
  let f = o.front ?? [0, 0, 1]
  f = norm3([f[0] - pl[0] * dot3(f, pl), f[1] - pl[1] * dot3(f, pl), f[2] - pl[2] * dot3(f, pl)])
  const side = cross3(pl, f)
  const W = o.width, H = o.height, c = o.center, R = o.radius
  const [AX, AY] = o.anchor ?? [W / 2, H / 2]
  const fade = o.fade ?? 6
  const facing = o.facing ?? [0.15, 0.45]
  const sx = o.mirror ? -1 : 1
  return {
    kind: 'spherical', width: W, height: H,
    evaluate(px, py, pz, nx, ny, nz, out) {
      const dx = px - c[0], dy = py - c[1], dz = pz - c[2]
      const r = Math.hypot(dx, dy, dz) || 1e-9
      const ux = dx / r, uy = dy / r, uz = dz / r
      const hp = ux * pl[0] + uy * pl[1] + uz * pl[2]
      const lat = Math.asin(Math.max(-1, Math.min(1, hp)))
      const a = ux * f[0] + uy * f[1] + uz * f[2], s = ux * side[0] + uy * side[1] + uz * side[2]
      const lon = Math.atan2(s, a)
      const x = AX + sx * lon * R
      const y = AY + lat * R
      out.x = x; out.y = y
      // +lon direction: pole × radial; +lat: toward the pole, perpendicular to the radial
      const e = norm3(cross3(pl, [ux, uy, uz]))
      out.tu[0] = e[0] * sx; out.tu[1] = e[1] * sx; out.tu[2] = e[2] * sx
      const nl = norm3([pl[0] - hp * ux, pl[1] - hp * uy, pl[2] - hp * uz])
      out.tv[0] = nl[0]; out.tv[1] = nl[1]; out.tv[2] = nl[2]
      let w = ramp(Math.min(x, W - x), fade) * ramp(Math.min(y, H - y), fade)
      if (w <= 0) return 0
      w *= smooth01(facing[0], facing[1], nx * ux + ny * uy + nz * uz)
      if (w <= 0) return 0
      w *= clipWeight(r, o.radial, o.radialFade ?? 4)
      if (w > 0 && o.mask) w *= o.mask(px, py, pz, nx, ny, nz, x, y)
      return w
    },
  }
}

/** (x, y, z, nx, ny, nz) → the largest projector weight: pass as refineMesh's `where`. */
export function skinWeight(projectors) {
  const out = { x: 0, y: 0, tu: [0, 0, 0], tv: [0, 0, 0] }
  const list = projectors.flat()
  return (x, y, z, nx, ny, nz) => {
    let w = 0
    for (const p of list) w = Math.max(w, p.evaluate(x, y, z, nx, ny, nz, out))
    return w
  }
}

/**
 * (x, y, z, nx, ny, nz) → 1 where some region's relief will actually displace the mesh: projector weight ×
 * |relief.macro(size)| above `threshold` mm. `size` (default 3 mm) low-passes the map so the test also
 * catches the shoulders around a band, not only its top. Pass as refineMesh's `where`: flat ground and
 * fine leiwen (normal map only) stay coarse.
 */
export function reliefWhere(regions, { size = 3, threshold = 0.05 } = {}) {
  const out = { x: 0, y: 0, tu: [0, 0, 0], tv: [0, 0, 0] }
  const list = regions.map((r) => ({ macro: r.relief.macro(size), W: r.relief.widthMM ?? r.relief.width, H: r.relief.heightMM ?? r.relief.height, projectors: r.projectors }))
  return (x, y, z, nx, ny, nz) => {
    for (const r of list) {
      for (const p of r.projectors) {
        const w = p.evaluate(x, y, z, nx, ny, nz, out)
        if (w <= 0) continue
        const u = out.x / r.W, v = out.y / r.H
        if (u < 0 || u > 1 || v < 0 || v > 1) continue
        if (Math.abs(r.macro.sample(u, v)) * w > threshold) return 1
      }
    }
    return 0
  }
}

// ------------------------------------------------------------------------------------------ the skin

/**
 * Build the dressed BufferGeometry: smooth undisplaced normals, positions displaced along them by each
 * region's relief.macro(spacing) × weight, uv (panel x / W, y / H, clamped) + tangents per region, the
 * `cavity` attribute, and one group per region (group 0 = bare mesh, group i + 1 = regions[i]). A vertex
 * shared by two regions is split (each keeps its own uv); its position comes from the region that weighs
 * most there, so the seam cannot crack.
 * @param {object} m  mesh { positions, indices, normals? }
 * @param {object} o
 * @param {{relief, projectors: object[], scale?: number}[]} [o.regions]
 * @param {Float32Array|null} [o.cavity]  per-vertex cavity (meshCavity)
 * @param {number} [o.spacing]  mm, the macro low-pass (default: the mesh's mean edge length in the regions)
 * @param {number} [o.threshold] a triangle joins a region once any vertex weighs more (default 0.002)
 */
export function skinGeometry(m, { regions = [], cavity = null, spacing, threshold = 0.002 } = {}) {
  const P = m.positions, I = m.indices
  const N = P.length / 3
  const nrm = m.normals || vertexNormals(m)
  const R = regions.length
  const W = new Float32Array(R * N)
  const UV = new Float32Array(R * N * 2)
  const TU = new Float32Array(R * N * 3)
  const TV = new Float32Array(R * N * 3)
  const out = { x: 0, y: 0, tu: [0, 0, 0], tv: [0, 0, 0] }
  for (let r = 0; r < R; r++) {
    const reg = regions[r]
    const pw = reg.relief.widthMM ?? reg.relief.width, ph = reg.relief.heightMM ?? reg.relief.height
    for (let v = 0; v < N; v++) {
      let best = 0
      for (const pr of reg.projectors) {
        const w = pr.evaluate(P[v * 3], P[v * 3 + 1], P[v * 3 + 2], nrm[v * 3], nrm[v * 3 + 1], nrm[v * 3 + 2], out)
        if (w > best || (best === 0 && pr === reg.projectors[0])) {
          if (w > best) best = w
          const k = r * N + v
          UV[k * 2] = Math.max(0, Math.min(1, out.x / pw))
          UV[k * 2 + 1] = Math.max(0, Math.min(1, out.y / ph))
          TU[k * 3] = out.tu[0]; TU[k * 3 + 1] = out.tu[1]; TU[k * 3 + 2] = out.tu[2]
          TV[k * 3] = out.tv[0]; TV[k * 3 + 1] = out.tv[1]; TV[k * 3 + 2] = out.tv[2]
        }
      }
      W[r * N + v] = best
    }
  }
  // triangle → region (-1 bare)
  const T = I.length / 3
  const triReg = new Int32Array(T).fill(-1)
  for (let t = 0; t < T; t++) {
    let bestR = -1, bestS = 0
    for (let r = 0; r < R; r++) {
      const a = W[r * N + I[t * 3]], b = W[r * N + I[t * 3 + 1]], c = W[r * N + I[t * 3 + 2]]
      if (Math.max(a, b, c) <= threshold) continue
      const s = a + b + c
      if (s > bestS) { bestS = s; bestR = r }
    }
    triReg[t] = bestR
  }
  // mean edge length in the regions → macro spacing
  if (spacing == null) {
    let s = 0, n = 0
    for (let t = 0; t < T && n < 20000; t++) {
      if (triReg[t] < 0) continue
      const a = I[t * 3] * 3, b = I[t * 3 + 1] * 3
      s += Math.hypot(P[b] - P[a], P[b + 1] - P[a + 1], P[b + 2] - P[a + 2]); n++
    }
    spacing = n ? s / n : 1
  }
  const macros = regions.map((reg) => reg.relief.macro(spacing))
  // displacement per vertex from its heaviest region
  const disp = new Float32Array(N)
  for (let v = 0; v < N; v++) {
    let br = -1, bw = 0
    for (let r = 0; r < R; r++) if (W[r * N + v] > bw) { bw = W[r * N + v]; br = r }
    if (br < 0) continue
    const k = br * N + v
    disp[v] = macros[br].sample(UV[k * 2], UV[k * 2 + 1]) * bw * (regions[br].scale ?? 1)
  }
  // split vertices per (vertex, region)
  const keyOf = new Int32Array(N * (R + 1)).fill(-1)
  const vIdx = [], vReg = []
  const newIdx = new Uint32Array(I.length)
  const order = []
  for (let g = -1; g < R; g++) for (let t = 0; t < T; t++) if (triReg[t] === g) order.push(t)
  const groups = []
  let gStart = 0, gCur = -2
  let w = 0
  for (const t of order) {
    const g = triReg[t]
    if (g !== gCur) {
      if (gCur > -2 && w > gStart) groups.push({ start: gStart, count: w - gStart, materialIndex: gCur + 1 })
      gCur = g
      gStart = w
    }
    for (let k = 0; k < 3; k++) {
      const v = I[t * 3 + k]
      const key = v * (R + 1) + (g + 1)
      let id = keyOf[key]
      if (id < 0) {
        id = vIdx.length
        keyOf[key] = id
        vIdx.push(v); vReg.push(g)
      }
      newIdx[w++] = id
    }
  }
  if (gCur > -2 && w > gStart) groups.push({ start: gStart, count: w - gStart, materialIndex: gCur + 1 })
  const M = vIdx.length
  const pos = new Float32Array(M * 3), nor = new Float32Array(M * 3), uv = new Float32Array(M * 2), tan = new Float32Array(M * 4)
  const cav = cavity ? new Float32Array(M) : null
  for (let i = 0; i < M; i++) {
    const v = vIdx[i], g = vReg[i]
    const nx = nrm[v * 3], ny = nrm[v * 3 + 1], nz = nrm[v * 3 + 2]
    pos[i * 3] = P[v * 3] + nx * disp[v]; pos[i * 3 + 1] = P[v * 3 + 1] + ny * disp[v]; pos[i * 3 + 2] = P[v * 3 + 2] + nz * disp[v]
    nor[i * 3] = nx; nor[i * 3 + 1] = ny; nor[i * 3 + 2] = nz
    if (cav) cav[i] = cavity[v]
    if (g < 0) {
      uv[i * 2] = -1; uv[i * 2 + 1] = -1
      // any tangent ⟂ n (unused by a bare material)
      const t = Math.abs(ny) < 0.9 ? norm3(cross3([0, 1, 0], [nx, ny, nz])) : norm3(cross3([1, 0, 0], [nx, ny, nz]))
      tan[i * 4] = t[0]; tan[i * 4 + 1] = t[1]; tan[i * 4 + 2] = t[2]; tan[i * 4 + 3] = 1
      continue
    }
    const k = g * N + v
    uv[i * 2] = UV[k * 2]; uv[i * 2 + 1] = UV[k * 2 + 1]
    let tx = TU[k * 3], ty = TU[k * 3 + 1], tz = TU[k * 3 + 2]
    const d = tx * nx + ty * ny + tz * nz
    tx -= nx * d; ty -= ny * d; tz -= nz * d
    const l = Math.hypot(tx, ty, tz) || 1
    tx /= l; ty /= l; tz /= l
    const b = cross3([nx, ny, nz], [tx, ty, tz])
    const hand = b[0] * TV[k * 3] + b[1] * TV[k * 3 + 1] + b[2] * TV[k * 3 + 2] < 0 ? -1 : 1
    tan[i * 4] = tx; tan[i * 4 + 1] = ty; tan[i * 4 + 2] = tz; tan[i * 4 + 3] = hand
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3))
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  geo.setAttribute('tangent', new THREE.BufferAttribute(tan, 4))
  if (cav) geo.setAttribute('cavity', new THREE.BufferAttribute(cav, 1))
  geo.setIndex(M > 65535 ? new THREE.BufferAttribute(newIdx, 1) : new THREE.BufferAttribute(Uint16Array.from(newIdx), 1))
  for (const g of groups) geo.addGroup(g.start, g.count, g.materialIndex)
  geo.computeBoundingBox()
  geo.computeBoundingSphere()
  const triCount = new Array(R + 1).fill(0)
  for (let t = 0; t < T; t++) triCount[triReg[t] + 1]++
  geo.userData.skin = { vertices: M, triangles: T, spacing, regionTriangles: triCount }
  return geo
}

/**
 * The whole dressing as a THREE.Mesh: skinGeometry + materials (group 0 = `material`, default a
 * PatinaMaterial on the cavity attribute; group i + 1 = regions[i].material, default a PatinaMaterial with
 * that region's relief). Materials get `skin: true` so the cavity attribute joins the relief's recess terms.
 * @returns {THREE.Mesh}  userData.part = part; userData.skin = { vertices, triangles, spacing, regionTriangles }
 */
export function skin(m, { regions = [], cavity = null, spacing, material = null, part = 'body', threshold } = {}) {
  const geo = skinGeometry(m, { regions, cavity, spacing, threshold })
  const opts = cavity ? { cavityAttribute: true, skin: true } : {}
  const mats = [material || new PatinaMaterial(opts)]
  for (const r of regions) mats.push(r.material || new PatinaMaterial({ relief: r.relief, ...opts }))
  const mesh = new THREE.Mesh(geo, mats)
  mesh.userData.part = part
  mesh.userData.skin = geo.userData.skin
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

// ------------------------------------------------------------------------------------------ slicing

/**
 * Cut the mesh with a plane → polylines [[x, y, z]…] (each chained where triangles share edges; open or
 * closed). For a flange along a mask's centre line, or a profile measured off a scan.
 * @param {object} m  mesh
 * @param {{point:number[], normal:number[]}} plane
 */
export function sliceMesh(m, { point, normal }) {
  const P = m.positions, I = m.indices
  const n = norm3(normal)
  const N = P.length / 3
  const d = new Float32Array(N)
  for (let v = 0; v < N; v++) d[v] = (P[v * 3] - point[0]) * n[0] + (P[v * 3 + 1] - point[1]) * n[1] + (P[v * 3 + 2] - point[2]) * n[2]
  // each crossing edge → a point keyed by the edge; each triangle crossing → a segment between two keys
  const pts = new Map()
  const adj = new Map()
  const key = (a, b) => (a < b ? a * N + b : b * N + a)
  const ptOn = (a, b) => {
    const k = key(a, b)
    if (!pts.has(k)) {
      const t = d[a] / (d[a] - d[b])
      pts.set(k, [P[a * 3] + t * (P[b * 3] - P[a * 3]), P[a * 3 + 1] + t * (P[b * 3 + 1] - P[a * 3 + 1]), P[a * 3 + 2] + t * (P[b * 3 + 2] - P[a * 3 + 2])])
    }
    return k
  }
  const link = (p, q) => {
    if (!adj.has(p)) adj.set(p, [])
    if (!adj.has(q)) adj.set(q, [])
    adj.get(p).push(q)
    adj.get(q).push(p)
  }
  for (let t = 0; t < I.length; t += 3) {
    const v = [I[t], I[t + 1], I[t + 2]]
    const cross = []
    for (let k = 0; k < 3; k++) {
      const a = v[k], b = v[(k + 1) % 3]
      if ((d[a] > 0) !== (d[b] > 0)) cross.push(ptOn(a, b))
    }
    if (cross.length === 2) link(cross[0], cross[1])
  }
  const used = new Set()
  const lines = []
  const walk = (s) => {
    const line = [s]
    used.add(s)
    let cur = s
    for (;;) {
      const next = (adj.get(cur) || []).find((q) => !used.has(q))
      if (next === undefined) break
      used.add(next)
      line.push(next)
      cur = next
    }
    return line
  }
  // open chains first (start at an end), then loops
  for (const [k, list] of adj) if (list.length === 1 && !used.has(k)) lines.push(walk(k))
  for (const k of adj.keys()) if (!used.has(k)) lines.push(walk(k))
  return lines.map((l) => l.map((k) => pts.get(k)))
}

// ------------------------------------------------------------------------------------------ compact binary

// 'TTM1' · u32 vertices · u32 triangles · f32 min[3] · f32 size[3] · u32 flags (bit 0: a u8 per-vertex
// channel follows the positions) · u16 positions [3N] (0..65535 over the bbox) · [u8 channel [N], padded
// to 2] · indices as LEB128 varints: per index, code = next − index where next = the count of vertices
// referenced so far (0 = a new vertex: vertices are numbered in first-use order). Encoder: tools/classics.mjs
// (it also orders triangles for vertex-cache locality, which is what keeps the codes to ~1 byte).
const MAGIC = 0x314d5454 // 'TTM1' little-endian

/** Decode the compact binary → { positions (mm), indices, channel?: Float32Array 0..1 } */
// Fetch a mesh binary written by encodeMesh. A host that will not serve .bin files gets the same
// bytes as base64 text beside it (`<url>.txt`); tools/artifact.mjs writes that file and sets
// data-mesh-text="1" on <html> to say so.
export async function fetchMeshBytes(url) {
  const asText = typeof document !== 'undefined' && document.documentElement.dataset.meshText === '1'
  const res = await fetch(asText ? url + '.txt' : url)
  if (!res.ok) throw new Error('mesh asset ' + res.status)
  if (!asText) return res.arrayBuffer()
  const bin = atob((await res.text()).trim())
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out.buffer
}

export function decodeMesh(buffer) {
  const buf = buffer instanceof ArrayBuffer ? buffer : buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
  const dv = new DataView(buf)
  if (dv.getUint32(0, true) !== MAGIC) throw new Error('decodeMesh: not a TTM1 mesh')
  const N = dv.getUint32(4, true), T = dv.getUint32(8, true)
  const min = [dv.getFloat32(12, true), dv.getFloat32(16, true), dv.getFloat32(20, true)]
  const size = [dv.getFloat32(24, true), dv.getFloat32(28, true), dv.getFloat32(32, true)]
  const flags = dv.getUint32(36, true)
  let o = 40
  const q = new Uint16Array(buf, o, N * 3)
  o += N * 6
  const positions = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) for (let k = 0; k < 3; k++) positions[i * 3 + k] = min[k] + (q[i * 3 + k] / 65535) * size[k]
  let channel = null
  if (flags & 1) {
    const c = new Uint8Array(buf, o, N)
    channel = new Float32Array(N)
    for (let i = 0; i < N; i++) channel[i] = c[i] / 255
    o += N + (N & 1)
  }
  const bytes = new Uint8Array(buf, o)
  const indices = new Uint32Array(T * 3)
  let p = 0, next = 0
  for (let i = 0; i < T * 3; i++) {
    let code = 0, shift = 0, b
    do {
      b = bytes[p++]
      code += (b & 127) * 2 ** shift
      shift += 7
    } while (b & 128)
    indices[i] = code === 0 ? next++ : next - code
  }
  return { positions, indices, channel }
}

/**
 * Encode → Uint8Array. Vertices are renumbered in first-use order of the triangle list as given (order
 * the triangles for locality first). `channel` (optional, 0..1 per input vertex) is stored as u8.
 */
export function encodeMesh(m, { channel = null } = {}) {
  const P = m.positions, I = m.indices
  const N0 = P.length / 3
  const remap = new Int32Array(N0).fill(-1)
  const order = []
  const codes = []
  let next = 0
  for (let i = 0; i < I.length; i++) {
    const v = I[i]
    if (remap[v] < 0) {
      remap[v] = next++
      order.push(v)
      codes.push(0)
    } else codes.push(next - remap[v])
  }
  const N = order.length
  const b = meshBounds(m)
  const size = b.size.map((s) => s || 1)
  const head = 40
  const chan = channel ? N + (N & 1) : 0
  const varBytes = []
  for (let c of codes) {
    do {
      let byte = c % 128
      c = Math.floor(c / 128)
      if (c > 0) byte |= 128
      varBytes.push(byte)
    } while (c > 0)
  }
  const out = new Uint8Array(head + N * 6 + chan + varBytes.length)
  const dv = new DataView(out.buffer)
  dv.setUint32(0, MAGIC, true)
  dv.setUint32(4, N, true)
  dv.setUint32(8, I.length / 3, true)
  for (let k = 0; k < 3; k++) {
    dv.setFloat32(12 + k * 4, b.min[k], true)
    dv.setFloat32(24 + k * 4, size[k], true)
  }
  dv.setUint32(36, channel ? 1 : 0, true)
  for (let i = 0; i < N; i++) {
    const v = order[i]
    for (let k = 0; k < 3; k++) dv.setUint16(head + (i * 3 + k) * 2, Math.round(((P[v * 3 + k] - b.min[k]) / size[k]) * 65535), true)
  }
  let o = head + N * 6
  if (channel) {
    for (let i = 0; i < N; i++) out[o + i] = Math.round(Math.max(0, Math.min(1, channel[order[i]])) * 255)
    o += chan
  }
  out.set(varBytes, o)
  return out
}
