// Small sculptural animal heads in the round (research/03 §4.4, §3.4) — the
// bovine / ram heads on zun, lei and pou shoulders, the low heads at the centre
// of gui / you neck bands. L3: real 3D form, never a height map.
//
// Built as a signed distance field (smooth unions of blocks, ellipsoids and
// tapering horn tubes) meshed by surface nets, so the forms blend the way a
// clay model does: forehead into snout, horn roots into the brow.
//
// Local frame: +Z = out of the wall (the face looks along +Z), +Y = up, the
// wall surface is z = 0 and the back of the head is sunk `embed` mm into it.
// F (face module) = the face width in mm; everything scales with it.

import * as THREE from 'three'
import { Rng } from '../util/rng.js'
import { PatinaMaterial } from '../material/patina.js'

// ------------------------------------------------------------------ SDF primitives

const len3 = (x, y, z) => Math.sqrt(x * x + y * y + z * z)

function sdEllipsoid(px, py, pz, rx, ry, rz) {
  const k0 = len3(px / rx, py / ry, pz / rz)
  const k1 = len3(px / (rx * rx), py / (ry * ry), pz / (rz * rz))
  return k1 > 1e-9 ? (k0 * (k0 - 1)) / k1 : -Math.min(rx, ry, rz)
}

function sdRoundBox(px, py, pz, bx, by, bz, r) {
  const qx = Math.abs(px) - bx + r, qy = Math.abs(py) - by + r, qz = Math.abs(pz) - bz + r
  return len3(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - r
}

/** capsule from a to b with radii ra → rb (round cone, iq) */
function sdRoundCone(px, py, pz, a, b, ra, rb) {
  const bax = b[0] - a[0], bay = b[1] - a[1], baz = b[2] - a[2]
  const l2 = bax * bax + bay * bay + baz * baz
  const rr = ra - rb
  const a2 = l2 - rr * rr
  const il2 = 1 / l2
  const pax = px - a[0], pay = py - a[1], paz = pz - a[2]
  const y = pax * bax + pay * bay + paz * baz
  const z = y - l2
  const xx = len3(pax * l2 - bax * y, pay * l2 - bay * y, paz * l2 - baz * y)
  const x2 = xx * xx
  const y2 = y * y * l2
  const z2 = z * z * l2
  const k = Math.sign(rr) * rr * rr * x2
  if (Math.sign(z) * a2 * z2 > k) return Math.sqrt(x2 + z2) * il2 - rb
  if (Math.sign(y) * a2 * y2 < k) return Math.sqrt(x2 + y2) * il2 - ra
  return (Math.sqrt(x2 * a2 * il2) + y * rr) * il2 - ra
}

function smin(a, b, k) {
  if (k <= 0) return Math.min(a, b)
  const h = Math.max(k - Math.abs(a - b), 0) / k
  return Math.min(a, b) - h * h * k * 0.25
}

function smax(a, b, k) {
  return -smin(-a, -b, k)
}

/** a tapering tube along a polyline of [x, y, z, r] knots */
function sdTube(px, py, pz, knots) {
  let d = Infinity
  for (let i = 0; i < knots.length - 1; i++) {
    const a = knots[i], b = knots[i + 1]
    d = Math.min(d, sdRoundCone(px, py, pz, a, b, a[3], b[3]))
  }
  return d
}

// ------------------------------------------------------------------ heads

/**
 * Horn centre-lines (right horn, x > 0), as [x, y, z, r] in face modules.
 * bovine: C-curve out and up, tips turning forward-in (the zun 43.25.1 heads lie
 *         close to the shoulder: horns spread sideways, rise a little, blunt tips);
 * ram:    spiral curling back, down and forward around the ear;
 * buffalo: long, swept back and out, flattened tips;  'bottle': the stubby
 *         bottle-horn (瓶形角) of tiger / kui heads.
 */
function hornKnots(kind, p) {
  const s = p.hornSize, c = p.hornCurl
  if (kind === 'ram') {
    const out = []
    const turns = 0.85 + 0.35 * c
    for (let i = 0; i <= 14; i++) {
      const f = i / 14
      const a = -0.4 + f * turns * Math.PI * 2 // starts up/back, curls down and forward
      const R = (0.36 - 0.2 * f) * s
      out.push([0.3 + 0.18 * f * s, 0.22 + R * Math.cos(a) * 0.9, 0.02 + R * Math.sin(a) - 0.1 * s * (1 - f), (0.13 - 0.085 * f) * Math.sqrt(s)])
    }
    return out
  }
  if (kind === 'bottle') {
    return [[0.22, 0.36, 0.06, 0.09], [0.28, 0.5, 0.05, 0.1 * s], [0.31, 0.62 * s, 0.05, 0.075 * s], [0.3, 0.7 * s, 0.05, 0.05]]
  }
  if (kind === 'buffalo') {
    return [[0.26, 0.32, 0.04, 0.12], [0.55 * s, 0.4, -0.04, 0.1], [0.85 * s, 0.5, 0.02, 0.075], [1.02 * s, 0.66 * c + 0.2, 0.12, 0.045], [1.0 * s, 0.82 * c + 0.2, 0.22, 0.03]]
  }
  // bovine (zun / lei shoulders): thick horns rising from the brow, sweeping out
  // and curling down again — a lyre framing the forehead, lying close to the wall
  return [
    [0.24, 0.3, 0.05, 0.14],
    [0.38 * s, 0.48 + 0.08 * c, 0.03, 0.135],
    [0.57 * s, 0.56 + 0.12 * c, 0.01, 0.12],
    [0.72 * s, 0.48 + 0.1 * c, 0.01, 0.105],
    [0.75 * s, 0.32, 0.04, 0.085],
    [0.67 * s, 0.2 - 0.08 * c, 0.08, 0.06],
  ]
}

/**
 * Parameters (all in face modules unless marked mm):
 *   kind 'bovine' | 'ram' | 'buffalo' | 'tiger'   width (mm, F)   projection (× F, how far the snout stands out)
 *   droop (deg: snout pitched down)   hornSize   hornCurl   eyeSize   ears (bool)   embed (mm)   detail (mm voxel)
 */
export const HEAD_DEFAULTS = {
  kind: 'bovine', width: 40, projection: 0.62, droop: 28, hornSize: 1, hornCurl: 0.5, eyeSize: 1, ears: true,
  embed: 4, detail: 0, seed: 1, brow: true, nostrils: true,
}

export function headSDF(params) {
  const p = { ...HEAD_DEFAULTS, ...params }
  const F = p.width
  const rng = new Rng(p.seed)
  const jit = () => 1 + (rng.next() - 0.5) * 0.04
  const pr = p.projection
  const dr = (p.droop * Math.PI) / 180
  const cd = Math.cos(dr), sd = Math.sin(dr)
  const horns = p.kind === 'tiger' ? hornKnots('bottle', p) : hornKnots(p.kind === 'ram' ? 'ram' : p.kind === 'buffalo' ? 'buffalo' : 'bovine', p)
  const hornR = horns.map((k) => [k[0] * F * jit(), k[1] * F, k[2] * F, k[3] * F])
  const hornL = hornR.map((k) => [-k[0], k[1], k[2], k[3]])
  const eyeR = 0.1 * F * p.eyeSize
  const eyeX = (p.kind === 'tiger' ? 0.2 : 0.25) * F, eyeY = 0.16 * F, eyeZ = (0.17 + 0.35 * pr * 0.4) * F
  const muzA = [0, 0.14 * F, 0.12 * F]
  // the snout runs out and down: its axis pitched by `droop`
  const sl = pr * F * 1.15
  const muzB = [0, muzA[1] - sl * sd, muzA[2] + sl * cd]
  const k = 0.07 * F
  return {
    bounds: {
      min: [Math.min(...hornL.map((h) => h[0] - h[3])) - 2, Math.min(-0.5 * F, muzB[1] - 0.25 * F) - 2, -p.embed - 1],
      max: [Math.max(...hornR.map((h) => h[0] + h[3])) + 2, Math.max(0.55 * F, ...hornR.map((h) => h[1] + h[3])) + 2, Math.max(muzB[2] + 0.2 * F, ...hornR.map((h) => h[2] + h[3])) + 2],
    },
    F,
    p,
    sd(x, y, z) {
      // mount block / neck: a cushion lying on the wall, sunk into it
      let d = sdRoundBox(x, y + 0.02 * F, z + p.embed * 0.5 - 0.03 * F, 0.36 * F, 0.38 * F, p.embed * 0.5 + 0.12 * F, 0.12 * F)
      // cranium / forehead: broad, flat-fronted
      d = smin(d, sdEllipsoid(x, y - 0.16 * F, z - 0.1 * F, 0.38 * F, 0.3 * F, 0.22 * F), k)
      // snout: a tapering block running out and down
      d = smin(d, sdRoundCone(x, y, z, muzA, muzB, 0.29 * F, (p.kind === 'ram' ? 0.16 : 0.22) * F), k * 1.2)
      // muzzle pad
      const mx = x, my = y - muzB[1], mz = z - muzB[2]
      d = smin(d, sdEllipsoid(mx, my - 0.01 * F, mz, (p.kind === 'ram' ? 0.19 : 0.27) * F, 0.14 * F, 0.15 * F), k * 0.7)
      // brow ridges over the eyes
      if (p.brow) d = smin(d, sdTube(x, y, z, [[-eyeX * 1.25, eyeY + eyeR * 1.2, eyeZ - 0.02 * F, 0.05 * F], [0, eyeY + eyeR * 1.7, eyeZ + 0.02 * F, 0.06 * F], [eyeX * 1.25, eyeY + eyeR * 1.2, eyeZ - 0.02 * F, 0.05 * F]]), k * 0.5)
      // eyes: bulging, with a sunk pupil ring (臣-less: heads have plain round eyes)
      for (const sx of [-1, 1]) {
        const ex = x - sx * eyeX, ey = y - eyeY, ez = z - eyeZ
        d = smin(d, sdEllipsoid(ex, ey, ez, eyeR * 1.15, eyeR * 0.85, eyeR), k * 0.35)
        d = smax(d, -sdEllipsoid(ex - sx * eyeR * 0.05, ey, ez - eyeR * 0.95, eyeR * 0.42, eyeR * 0.36, eyeR * 0.28), 0.25)
      }
      // nostrils
      if (p.nostrils) for (const sx of [-1, 1]) d = smax(d, -sdEllipsoid(x - sx * 0.09 * F, y - muzB[1] + 0.02 * F, z - muzB[2] - 0.14 * F, 0.045 * F, 0.06 * F, 0.06 * F), 0.4)
      // ears: small leaves under the horn roots
      if (p.ears && p.kind !== 'ram') for (const sx of [-1, 1]) d = smin(d, sdEllipsoid(x - sx * 0.42 * F, y - 0.1 * F, z - 0.04 * F, 0.15 * F, 0.07 * F, 0.05 * F), k * 0.5)
      // horns
      d = smin(d, sdTube(x, y, z, hornR), k * 0.6)
      d = smin(d, sdTube(x, y, z, hornL), k * 0.6)
      return d
    },
  }
}

/**
 * Mesh a signed distance field with naive surface nets.
 * @returns {THREE.BufferGeometry} position, normal (SDF gradient)
 */
export function meshSDF(sdf, { voxel = 0.8, clipZ = null } = {}) {
  const [x0, y0, z0] = sdf.bounds.min, [x1, y1, z1] = sdf.bounds.max
  const nx = Math.ceil((x1 - x0) / voxel) + 1, ny = Math.ceil((y1 - y0) / voxel) + 1, nz = Math.ceil((z1 - z0) / voxel) + 1
  const field = new Float32Array(nx * ny * nz)
  const id = (i, j, k) => (k * ny + j) * nx + i
  const ev = (x, y, z) => {
    const d = sdf.sd(x, y, z)
    return clipZ != null ? Math.max(d, clipZ - z) : d
  }
  // coarse pass (every C voxels): the field is 1-Lipschitz, so a fine sample farther
  // than its coarse cell's reach from the surface keeps the coarse sign
  const C = 4
  const cx = Math.ceil((nx - 1) / C) + 1, cy = Math.ceil((ny - 1) / C) + 1, cz = Math.ceil((nz - 1) / C) + 1
  const coarse = new Float32Array(cx * cy * cz)
  for (let k = 0; k < cz; k++) for (let j = 0; j < cy; j++) for (let i = 0; i < cx; i++) coarse[(k * cy + j) * cx + i] = ev(x0 + i * C * voxel, y0 + j * C * voxel, z0 + k * C * voxel)
  const reach = C * voxel * 1.8
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const ci = Math.min(cx - 1, Math.round(i / C)), cj = Math.min(cy - 1, Math.round(j / C)), ck = Math.min(cz - 1, Math.round(k / C))
    const dc = coarse[(ck * cy + cj) * cx + ci]
    field[id(i, j, k)] = Math.abs(dc) > reach ? dc : ev(x0 + i * voxel, y0 + j * voxel, z0 + k * voxel)
  }
  // one vertex per cell with a sign change
  const cellV = new Int32Array((nx - 1) * (ny - 1) * (nz - 1)).fill(-1)
  const cid = (i, j, k) => (k * (ny - 1) + j) * (nx - 1) + i
  const P = []
  const corners = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]]
  const edges = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]]
  const v = new Float64Array(8)
  for (let k = 0; k < nz - 1; k++) for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
    let mask = 0
    for (let c = 0; c < 8; c++) {
      v[c] = field[id(i + corners[c][0], j + corners[c][1], k + corners[c][2])]
      if (v[c] < 0) mask |= 1 << c
    }
    if (mask === 0 || mask === 255) continue
    let sx = 0, sy = 0, sz = 0, n = 0
    for (const [a, b] of edges) {
      if ((v[a] < 0) === (v[b] < 0)) continue
      const t = v[a] / (v[a] - v[b])
      sx += corners[a][0] + (corners[b][0] - corners[a][0]) * t
      sy += corners[a][1] + (corners[b][1] - corners[a][1]) * t
      sz += corners[a][2] + (corners[b][2] - corners[a][2]) * t
      n++
    }
    cellV[cid(i, j, k)] = P.length / 3
    P.push(x0 + (i + sx / n) * voxel, y0 + (j + sy / n) * voxel, z0 + (k + sz / n) * voxel)
  }
  // quads across every sign-changing grid edge
  const I = []
  const quad = (a, b, c, d, flip) => {
    if (a < 0 || b < 0 || c < 0 || d < 0) return
    if (flip) I.push(a, c, b, a, d, c)
    else I.push(a, b, c, a, c, d)
  }
  for (let k = 1; k < nz - 1; k++) for (let j = 1; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
    const a = field[id(i, j, k)] < 0, b = field[id(i + 1, j, k)] < 0
    if (a === b) continue
    quad(cellV[cid(i, j - 1, k - 1)], cellV[cid(i, j, k - 1)], cellV[cid(i, j, k)], cellV[cid(i, j - 1, k)], b)
  }
  for (let k = 1; k < nz - 1; k++) for (let j = 0; j < ny - 1; j++) for (let i = 1; i < nx - 1; i++) {
    const a = field[id(i, j, k)] < 0, b = field[id(i, j + 1, k)] < 0
    if (a === b) continue
    quad(cellV[cid(i - 1, j, k - 1)], cellV[cid(i - 1, j, k)], cellV[cid(i, j, k)], cellV[cid(i, j, k - 1)], b)
  }
  for (let k = 0; k < nz - 1; k++) for (let j = 1; j < ny - 1; j++) for (let i = 1; i < nx - 1; i++) {
    const a = field[id(i, j, k)] < 0, b = field[id(i, j, k + 1)] < 0
    if (a === b) continue
    quad(cellV[cid(i - 1, j - 1, k)], cellV[cid(i, j - 1, k)], cellV[cid(i, j, k)], cellV[cid(i - 1, j, k)], b)
  }
  // normals from the field gradient
  const N = new Float32Array(P.length)
  const h = voxel * 0.5
  for (let q = 0; q < P.length; q += 3) {
    const x = P[q], y = P[q + 1], z = P[q + 2]
    const f = (a, b, c) => {
      let d = sdf.sd(a, b, c)
      if (clipZ != null) d = Math.max(d, clipZ - c)
      return d
    }
    const gx = f(x + h, y, z) - f(x - h, y, z), gy = f(x, y + h, z) - f(x, y - h, z), gz = f(x, y, z + h) - f(x, y, z - h)
    const l = len3(gx, gy, gz) || 1
    N[q] = gx / l; N[q + 1] = gy / l; N[q + 2] = gz / l
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3))
  geo.setAttribute('normal', new THREE.BufferAttribute(N, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array((P.length / 3) * 2), 2))
  geo.setIndex(I)
  fixWinding(geo)
  geo.computeBoundingBox()
  geo.computeBoundingSphere()
  return geo
}

function fixWinding(geo) {
  // orient every triangle with the field gradient (outward)
  const p = geo.attributes.position.array, n = geo.attributes.normal.array
  const idx = geo.index.array
  for (let t = 0; t < idx.length; t += 3) {
    const a = idx[t] * 3, b = idx[t + 1] * 3, c = idx[t + 2] * 3
    const ux = p[b] - p[a], uy = p[b + 1] - p[a + 1], uz = p[b + 2] - p[a + 2]
    const vx = p[c] - p[a], vy = p[c + 1] - p[a + 1], vz = p[c + 2] - p[a + 2]
    const fx = uy * vz - uz * vy, fy = uz * vx - ux * vz, fz = ux * vy - uy * vx
    const nx = n[a] + n[b] + n[c], ny = n[a + 1] + n[b + 1] + n[c + 1], nz = n[a + 2] + n[b + 2] + n[c + 2]
    if (fx * nx + fy * ny + fz * nz < 0) { const s = idx[t + 1]; idx[t + 1] = idx[t + 2]; idx[t + 2] = s }
  }
  geo.index.needsUpdate = true
}

const headCache = new Map()

/**
 * A sculpted animal head as a Mesh in its local frame (+Z out of the wall, +Y up).
 * @param {object} o  HEAD_DEFAULTS keys + { material, part, quality }
 */
export function animalHead(o = {}) {
  const { material, part = 'heads', quality = 1, ...params } = o
  const p = { ...HEAD_DEFAULTS, ...params }
  const voxel = p.detail || Math.max(0.35, p.width / (55 * Math.sqrt(quality)))
  const key = JSON.stringify({ ...p, voxel })
  let geo = headCache.get(key)
  if (!geo) {
    geo = meshSDF(headSDF(p), { voxel, clipZ: -p.embed })
    headCache.set(key, geo)
  }
  const mesh = new THREE.Mesh(geo, material || new PatinaMaterial())
  mesh.userData.part = part
  mesh.userData.head = p
  mesh.castShadow = mesh.receiveShadow = true
  return mesh
}

/**
 * Mount a head on a lathe body: at azimuth (deg) and height y (or arc s), its
 * face looking out along the horizontal radial direction pitched by `pitch` deg
 * (+ = looking down), sitting on the wall (lathe info.frame gives the wall point).
 * @param {THREE.Object3D} body  a lathe() Group
 * @param {THREE.Object3D} head  from animalHead()
 * @param {{azimuth:number, y?:number, s?:number, pitch?:number, lift?:number, follow?:number}} at
 *        follow 0..1: 0 = face horizontal-radial, 1 = face along the wall normal
 */
export function mountOnLathe(body, head, { azimuth = 0, y, s, pitch = 0, lift = 0, follow = 0.35 } = {}) {
  const info = body.userData.lathe
  const sArc = s ?? info.sAtY(y)
  const fr = info.frame(azimuth, sArc)
  const radial = new THREE.Vector3(Math.sin((azimuth * Math.PI) / 180), 0, Math.cos((azimuth * Math.PI) / 180))
  const z = radial.clone().lerp(fr.n, follow).normalize()
  // pitch the face down about the tangential axis
  const b = fr.b.clone()
  z.applyAxisAngle(b, (pitch * Math.PI) / 180)
  const yv = new THREE.Vector3().crossVectors(z, b).normalize()
  if (yv.y < 0) yv.negate()
  const x = new THREE.Vector3().crossVectors(yv, z).normalize()
  head.matrix.makeBasis(x, yv, z)
  head.matrix.setPosition(fr.p.clone().addScaledVector(fr.n, lift))
  head.matrix.decompose(head.position, head.quaternion, head.scale)
  head.matrixWorldNeedsUpdate = true
  return head
}
