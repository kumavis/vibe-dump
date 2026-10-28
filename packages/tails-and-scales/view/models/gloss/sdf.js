// sdf.js: just enough signed-distance modelling for one sculpted part, the Basilisk Venom Engine's
// figurehead skull (serpents.js). A graft of prototype C's sdf.js (smooth min, iq's rounded cone and
// ellipsoid, surface nets with every vertex settled onto the surface and the field's gradient as its
// normal, ambient occlusion read off the field), cut down to what the skull uses. Plain numbers
// throughout: the skull's field is sampled ~10-30k times, and a symmetric field (the skull's) is meshed
// for its x ≥ 0 half only and mirrored (surfaceNets `mirror`), half the cost of a cold build.
import * as THREE from 'three'

// polynomial smooth minimum: a fillet `k` wide where two shapes meet
export function smin(a, b, k) {
  if (k <= 0) return Math.min(a, b)
  const h = Math.max(k - Math.abs(a - b), 0) / k
  return Math.min(a, b) - h * h * k * 0.25
}
// smooth maximum (a smooth subtraction is smax(a, -b, k))
export const smax = (a, b, k) => -smin(-a, -b, k)

// A rounded cone from a (radius ra) to b (radius rb): iq's exact distance.
export function roundCone(a, b, ra, rb) {
  const [ax, ay, az] = a
  const bx = b[0] - ax, by = b[1] - ay, bz = b[2] - az
  const l2 = bx * bx + by * by + bz * bz, rr = ra - rb, a2 = l2 - rr * rr, il2 = 1 / l2
  const k0 = Math.sign(rr) * rr * rr
  return (x, y, z) => {
    const px = x - ax, py = y - ay, pz = z - az
    const yy = px * bx + py * by + pz * bz, zz = yy - l2
    const qx = px * l2 - bx * yy, qy = py * l2 - by * yy, qz = pz * l2 - bz * yy
    const x2 = qx * qx + qy * qy + qz * qz, y2 = yy * yy * l2, z2 = zz * zz * l2, k = k0 * x2
    if (Math.sign(zz) * a2 * z2 > k) return Math.sqrt(x2 + z2) * il2 - rb
    if (Math.sign(yy) * a2 * y2 < k) return Math.sqrt(x2 + y2) * il2 - ra
    return (Math.sqrt(x2 * a2 * il2) + yy * rr) * il2 - ra
  }
}

// An ellipsoid of radii (rx, ry, rz) at `c`, turned `rx0` about x: iq's bound (exact on the surface).
export function ellipsoid(c, r, tilt = 0) {
  const [cx, cy, cz] = c, [rx, ry, rz] = r, co = Math.cos(tilt), si = Math.sin(tilt)
  return (x, y, z) => {
    const lx = x - cx, y0 = y - cy, z0 = z - cz
    const ly = co * y0 + si * z0, lz = -si * y0 + co * z0
    const ux = lx / rx, uy = ly / ry, uz = lz / rz
    const k0 = Math.sqrt(ux * ux + uy * uy + uz * uz)
    const k1 = Math.sqrt((ux / rx) ** 2 + (uy / ry) ** 2 + (uz / rz) ** 2)
    return k1 > 1e-9 ? (k0 * (k0 - 1)) / k1 : -Math.min(rx, ry, rz)
  }
}

const CORNERS = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]]
const EDGES = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]]

// the field's gradient at (x, y, z) (four samples on a tetrahedron), into g; returns its length²
function grad(sdf, x, y, z, e, g) {
  const a = sdf(x + e, y - e, z - e), b = sdf(x - e, y - e, z + e), c = sdf(x - e, y + e, z - e), d = sdf(x + e, y + e, z + e)
  g[0] = (a - b - c + d) / (4 * e)
  g[1] = (-a - b + c + d) / (4 * e)
  g[2] = (-a + b - c + d) / (4 * e)
  return g[0] ** 2 + g[1] ** 2 + g[2] ** 2
}

// Surface nets: the field sampled on a grid of cell h over the box [lo, hi]; one vertex per cell the
// surface crosses (the mean of its edges' crossings, then pulled onto the surface by two Newton steps and
// given the field's unit gradient as its normal), one quad per grid edge it crosses. → { P, N, T, src }
// mirror: the field is symmetric in x (x ↔ -x): the grid is laid out symmetric about x 0, only its x ≥ 0
// half is sampled and settled, and the other half's vertices are those mirrored (src[v]: the vertex v
// mirrors, or -1), so a symmetric part costs half (the engine's skull: about 2× faster to build).
export function surfaceNets(sdf, lo, hi, h, steps = 2, mirror = false) {
  let x0 = lo[0], nx
  if (mirror) {
    const m = Math.ceil(Math.max(-lo[0], hi[0]) / h - 1e-9)
    x0 = -m * h
    nx = 2 * m + 1
  } else nx = Math.ceil((hi[0] - lo[0]) / h) + 1
  const ny = Math.ceil((hi[1] - lo[1]) / h) + 1, nz = Math.ceil((hi[2] - lo[2]) / h) + 1
  const mid = mirror ? (nx - 1) / 2 : 0
  const Vf = new Float32Array(nx * ny * nz)
  const at = (i, j, k) => i + nx * (j + ny * k)
  // a narrow band: a coarse pass first; a fine sample far from the surface takes its coarse neighbour's value
  const C = 3, cx = Math.ceil((nx - 1) / C) + 1, cy = Math.ceil((ny - 1) / C) + 1, cz = Math.ceil((nz - 1) / C) + 1
  const Vc = new Float32Array(cx * cy * cz), c0 = Math.round(mid / C)
  for (let k = 0; k < cz; k++) for (let j = 0; j < cy; j++) for (let i = c0; i < cx; i++) Vc[i + cx * (j + cy * k)] = sdf(x0 + i * C * h, lo[1] + j * C * h, lo[2] + k * C * h)
  const far = 1.5 * (C * h * Math.sqrt(3) * 0.5 + h)
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = mid; i < nx; i++) {
    const c = Vc[Math.round(i / C) + cx * (Math.round(j / C) + cy * Math.round(k / C))]
    const v = (Vf[at(i, j, k)] = Math.abs(c) > far ? c : sdf(x0 + i * h, lo[1] + j * h, lo[2] + k * h))
    if (mirror) Vf[at(nx - 1 - i, j, k)] = v
  }
  const cell = new Int32Array(nx * ny * nz).fill(-1)
  const P = [], cv = new Float64Array(8)
  for (let k = 0; k < nz - 1; k++) for (let j = 0; j < ny - 1; j++) for (let i = mid; i < nx - 1; i++) {
    let mask = 0
    for (let c = 0; c < 8; c++) {
      cv[c] = Vf[at(i + CORNERS[c][0], j + CORNERS[c][1], k + CORNERS[c][2])]
      if (cv[c] < 0) mask |= 1 << c
    }
    if (mask === 0 || mask === 255) continue
    let sx = 0, sy = 0, sz = 0, cnt = 0
    for (const [a, b] of EDGES) {
      if (cv[a] < 0 === cv[b] < 0) continue
      const t = cv[a] / (cv[a] - cv[b])
      sx += CORNERS[a][0] + t * (CORNERS[b][0] - CORNERS[a][0])
      sy += CORNERS[a][1] + t * (CORNERS[b][1] - CORNERS[a][1])
      sz += CORNERS[a][2] + t * (CORNERS[b][2] - CORNERS[a][2])
      cnt++
    }
    cell[at(i, j, k)] = P.length / 3
    P.push(x0 + (i + sx / cnt) * h, lo[1] + (j + sy / cnt) * h, lo[2] + (k + sz / cnt) * h)
  }
  // settle every vertex onto the surface; its normal is the field's gradient
  const own = P.length / 3
  const N = new Array(P.length).fill(0), g = [0, 0, 0], e = h * 0.05
  for (let v = 0; v < own; v++) {
    let x = P[3 * v], y = P[3 * v + 1], z = P[3 * v + 2], g2 = 0
    for (let s = 0; s < steps; s++) {
      const d = sdf(x, y, z)
      g2 = grad(sdf, x, y, z, e, g)
      if (Math.abs(d) < h * 1e-3 || g2 < 1e-10) break
      let kk = d / g2
      const len = Math.abs(kk) * Math.sqrt(g2)
      if (len > h * 0.5) kk *= (h * 0.5) / len
      x -= kk * g[0], y -= kk * g[1], z -= kk * g[2]
    }
    P[3 * v] = x, P[3 * v + 1] = y, P[3 * v + 2] = z
    // (after a single step the gradient it took is the normal: the vertex moved under half a cell)
    if (steps !== 1 || !g2) g2 = grad(sdf, x, y, z, e, g)
    const l = Math.sqrt(g2) || 1
    N[3 * v] = g[0] / l, N[3 * v + 1] = g[1] / l, N[3 * v + 2] = g[2] / l
  }
  // the x < 0 half: each cell's vertex the mirror of its twin's (cell i's twin is nx - 2 - i)
  const src = []
  for (let v = 0; v < own; v++) src.push(-1)
  if (mirror) {
    for (let k = 0; k < nz - 1; k++) for (let j = 0; j < ny - 1; j++) for (let i = 0; i < mid; i++) {
      const w = cell[at(nx - 2 - i, j, k)]
      if (w < 0) continue
      cell[at(i, j, k)] = P.length / 3
      P.push(-P[3 * w], P[3 * w + 1], P[3 * w + 2])
      N.push(-N[3 * w], N[3 * w + 1], N[3 * w + 2])
      src.push(w)
    }
  }
  const T = []
  const quad = (a, b, c, d) => {
    if (a < 0 || b < 0 || c < 0 || d < 0) return
    const dist = (u, v) => (P[3 * u] - P[3 * v]) ** 2 + (P[3 * u + 1] - P[3 * v + 1]) ** 2 + (P[3 * u + 2] - P[3 * v + 2]) ** 2
    if (dist(a, c) <= dist(b, d)) T.push(a, b, c, a, c, d)
    else T.push(a, b, d, b, c, d)
  }
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const neg = Vf[at(i, j, k)] < 0
    if (i < nx - 1 && j > 0 && k > 0 && neg !== Vf[at(i + 1, j, k)] < 0) quad(cell[at(i, j - 1, k - 1)], cell[at(i, j, k - 1)], cell[at(i, j, k)], cell[at(i, j - 1, k)])
    if (j < ny - 1 && i > 0 && k > 0 && neg !== Vf[at(i, j + 1, k)] < 0) quad(cell[at(i - 1, j, k - 1)], cell[at(i, j, k - 1)], cell[at(i, j, k)], cell[at(i - 1, j, k)])
    if (k < nz - 1 && i > 0 && j > 0 && neg !== Vf[at(i, j, k + 1)] < 0) quad(cell[at(i - 1, j - 1, k)], cell[at(i, j - 1, k)], cell[at(i, j, k)], cell[at(i - 1, j, k)])
  }
  // wind every triangle outward (along its corners' normals)
  for (let t = 0; t < T.length; t += 3) {
    const a = T[t], b = T[t + 1], c = T[t + 2]
    const ux = P[3 * b] - P[3 * a], uy = P[3 * b + 1] - P[3 * a + 1], uz = P[3 * b + 2] - P[3 * a + 2]
    const vx = P[3 * c] - P[3 * a], vy = P[3 * c + 1] - P[3 * a + 1], vz = P[3 * c + 2] - P[3 * a + 2]
    const fx = uy * vz - uz * vy, fy = uz * vx - ux * vz, fz = ux * vy - uy * vx
    if (fx * (N[3 * a] + N[3 * b] + N[3 * c]) + fy * (N[3 * a + 1] + N[3 * b + 1] + N[3 * c + 1]) + fz * (N[3 * a + 2] + N[3 * b + 2] + N[3 * c + 2]) < 0) (T[t + 1] = c), (T[t + 2] = b)
  }
  return { P, N, T, src, grid: { V: Vf, lo: [x0, lo[1], lo[2]], h, nx, ny, nz } }
}

// Ambient occlusion off the field: how much of a short probe out along each vertex's normal is inside the
// surface (iq's sampled AO), 1 open → 0 buried. The probes read the field from the meshing grid
// (trilinear), not the field itself: it is exact near the surface, where they look, and costs nothing.
export function occlusion(sdf, { P, N, grid, src }, { step = 0.012, taps = 5, strength = 1.6 } = {}) {
  const { V: G, lo, h, nx, ny, nz } = grid
  const at = (i, j, k) => G[i + nx * (j + ny * k)]
  const field = (x, y, z) => {
    const fx = (x - lo[0]) / h, fy = (y - lo[1]) / h, fz = (z - lo[2]) / h
    if (fx < 0 || fy < 0 || fz < 0 || fx >= nx - 1 || fy >= ny - 1 || fz >= nz - 1) return sdf(x, y, z)
    const i = Math.floor(fx), j = Math.floor(fy), k = Math.floor(fz), u = fx - i, v = fy - j, w = fz - k
    const c00 = at(i, j, k) * (1 - u) + at(i + 1, j, k) * u, c10 = at(i, j + 1, k) * (1 - u) + at(i + 1, j + 1, k) * u
    const c01 = at(i, j, k + 1) * (1 - u) + at(i + 1, j, k + 1) * u, c11 = at(i, j + 1, k + 1) * (1 - u) + at(i + 1, j + 1, k + 1) * u
    return (c00 * (1 - v) + c10 * v) * (1 - w) + (c01 * (1 - v) + c11 * v) * w
  }
  const ao = new Float32Array(P.length / 3)
  for (let v = 0; v < ao.length; v++) {
    // (a mirrored vertex: its twin's, the field being symmetric)
    if (src && src[v] >= 0) {
      ao[v] = ao[src[v]]
      continue
    }
    let occ = 0, wt = 1, wsum = 0
    for (let i = 1; i <= taps; i++) {
      const hh = step * i
      const d = field(P[3 * v] + N[3 * v] * hh, P[3 * v + 1] + N[3 * v + 1] * hh, P[3 * v + 2] + N[3 * v + 2] * hh)
      occ += (wt * Math.max(0, hh - d)) / hh
      wsum += wt
      wt *= 0.7
    }
    ao[v] = Math.max(0, 1 - (strength * occ) / wsum)
  }
  return ao
}

// The field over [lo, hi] at cell h as one indexed geometry, each vertex painted by
// paint(x, y, z, ao, out) (ao from the field). mirror: the field and the paint are symmetric in x (see
// surfaceNets): half of it is built, the other half mirrored.
export function fieldGeometry(sdf, lo, hi, h, paint, aoOpts, steps = 2, mirror = false) {
  const M = surfaceNets(sdf, lo, hi, h, steps, mirror)
  const ao = occlusion(sdf, M, aoOpts)
  const col = new Float32Array(M.P.length), c = new THREE.Color()
  for (let v = 0; v < M.P.length / 3; v++) {
    const w = M.src[v]
    if (w >= 0) {
      col[3 * v] = col[3 * w], col[3 * v + 1] = col[3 * w + 1], col[3 * v + 2] = col[3 * w + 2]
      continue
    }
    paint(M.P[3 * v], M.P[3 * v + 1], M.P[3 * v + 2], ao[v], c)
    col[3 * v] = c.r, col[3 * v + 1] = c.g, col[3 * v + 2] = c.b
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(M.P, 3))
  g.setAttribute('normal', new THREE.Float32BufferAttribute(M.N, 3))
  g.setAttribute('color', new THREE.BufferAttribute(col, 3))
  g.setIndex(M.T)
  return g
}
