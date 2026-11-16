// nezu-fanghu — the form: measured stack, the rounded-rectangle section law, and the loft builders.
// Units mm, Y up, the foot plate on y = 0, front (+Z) = the broad face photographed head-on in photo-08; the
// animal-head handles are on the narrow ±X sides.
// Numbers: reference/nezu-fanghu/dossier.md. Every level and half width is back-projected from photo-08 through
// an ASSUMED pinhole camera (f 3000 px, el 6°, az 4.4°, 965 mm; .work/r8-fanghu/solve/fit08.py); the plan ratio
// RHO from photo-09 (the foot plate's three visible corners + the strap centre line, fit09.py). H = 500 is INFERRED.

import * as THREE from 'three'

export const H = 500
/** plan: depth (z) : width (x) — photo-09, the foot plate's corners and the belly's silhouette: 0.55 ± 0.07 */
export const RHO = 0.55

/** levels (vessel y, mm) — dossier § Stack */
export const LV = {
  plateTop: 13, //      foot plate 0–13 (overhangs the foot band)
  footTop: 66, //       concave foot band 13–66 (a frieze 20–60)
  lowTop: 165, //       lower fields 72–163 (cartouches)
  strapTop: 196, //     horizontal strap 165–196; the diamond studs centred on it (y 180)
  upTop: 291, //        upper fields 199–289
  shoulder: 309, //     plain band 291–309 (the vertical straps start here, a triangle stud under it)
  frieze: 357, //       neck frieze 310–356: confronted birds either side of a centre line
  neck: 419, //         triangle band 359–416, then a fillet to the neck top
  lip: 425, //          lid lip ring 419–425
  lid: 464, //          lid band (domed) 425–464: bird cartouches
  top: 500, //          crown (open, flaring) 464–500
}

// half widths (x) of the body from the plate top to the neck top, back-projected silhouette of photo-08
const BODY = [[13, 107.5], [20, 106.2], [35, 104.4], [50, 103.4], [62, 103.6], [67, 106], [72, 112], [78, 117.5], [88, 122.3],
  [100, 125.2], [116, 126.5], [132, 126.7], [147, 126.2], [162, 124.6], [177, 122.2], [192, 118.8], [207, 114.3], [222, 107.8],
  [237, 101.6], [252, 95.8], [267, 90.2], [282, 85.6], [297, 81.6], [310, 78.6], [325, 76.4], [340, 75.1], [358, 74.6],
  [373, 75.3], [388, 76.8], [403, 78.6], [413, 79.6], [419, 79.9]]
// the lid: lip ring + domed band (W at the outer surface)
const LID = [[425, 79.4], [432, 78.6], [440, 76.4], [448, 71.5], [455, 64], [460, 56], [463, 50], [464.5, 47.5]]
export const PLATE = { w: 117, d: 0.564 * 117, r: 12, h: 13 }
export const CROWN = { y0: 464, y1: 500, w0: 45.5, w1: 50.2, wall: 3.6, r: 0.42 }

function monotone(rows) {
  const xs = rows.map((r) => r[0]), ys = rows.map((r) => r[1])
  const n = xs.length
  const d = []
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]))
  const m = ys.map((_, i) => (i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2))
  return (x) => {
    x = Math.min(xs[n - 1], Math.max(xs[0], x))
    let i = 0
    while (i < n - 2 && x > xs[i + 1]) i++
    const h = xs[i + 1] - xs[i], t = (x - xs[i]) / h
    const t2 = t * t, t3 = t2 * t
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1]
  }
}
export const bodyW = monotone(BODY)
export const lidW = monotone(LID)
/** corner radius: fat rounded corners (photo-09: the fields wrap round them), 0.7 × the half depth */
export const bodyR = (y) => 0.7 * RHO * bodyW(y)
export const lidR = (y) => 0.6 * RHO * lidW(y)

// ------------------------------------------------------------------ rounded-rectangle section

/** quarter perimeter of side k (front/back: half width a; right/left: half width b) from diagonal to diagonal */
export function quarterLen(a, b, r, k) {
  const hw = k % 2 === 0 ? a : b
  return 2 * (hw - r) + (Math.PI * r) / 2
}

/**
 * Point on the rounded rectangle (half extents a in x, b in z, corner radius r) at developed arc s from the
 * centre of side k (0 front +Z, 1 right +X, 2 back, 3 left), s positive to the right seen from outside.
 * Writes [x, z, nx, nz] into out.
 */
export function rrPoint(k, s, a, b, r, out = [0, 0, 0, 0]) {
  const hw = k % 2 === 0 ? a : b, hd = k % 2 === 0 ? b : a
  const L = hw - r
  const as = Math.abs(s), sg = s < 0 ? -1 : 1
  let lx, lz, nx, nz
  if (as <= L) { lx = s; lz = hd; nx = 0; nz = 1 }
  else {
    const ph = Math.min(Math.PI / 2, (as - L) / Math.max(r, 1e-6))
    lx = sg * (L + r * Math.sin(ph)); lz = hd - r + r * Math.cos(ph)
    nx = sg * Math.sin(ph); nz = Math.cos(ph)
  }
  if (k === 0) { out[0] = lx; out[1] = lz; out[2] = nx; out[3] = nz }
  else if (k === 1) { out[0] = lz; out[1] = -lx; out[2] = nz; out[3] = -nx }
  else if (k === 2) { out[0] = -lx; out[1] = -lz; out[2] = -nx; out[3] = -nz }
  else { out[0] = -lz; out[1] = lx; out[2] = -nz; out[3] = nx }
  return out
}

/** half developed width of side k at y (diagonal to the side centre) */
export const halfQ = (k, W = bodyW, R = bodyR) => (y) => quarterLen(W(y), RHO * W(y), Math.min(R(y), RHO * W(y) - 0.5), k) / 2

/** arc length up the side-k centre meridian from y0, tabulated (that side's panel uses this vertical scale) */
export function arcTable(y0, y1, half, k = 0, step = 0.5) {
  const ys = [], ss = []
  let s = 0, prev = null
  const dk = k % 2 ? 1 : RHO
  for (let y = y0; y <= y1 + step * 0.5; y += step) {
    const z = dk * half(y)
    if (prev) s += Math.hypot(y - prev[0], z - prev[1])
    ys.push(y); ss.push(s); prev = [y, z]
  }
  const f = (y) => {
    const t = (y - y0) / step
    const i = Math.max(0, Math.min(ys.length - 2, Math.floor(t)))
    return ss[i] + (ss[i + 1] - ss[i]) * (t - i)
  }
  f.inverse = (sv) => {
    let lo = 0, hi = ss.length - 1
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (ss[m] < sv) lo = m; else hi = m }
    const t = (sv - ss[lo]) / (ss[hi] - ss[lo] || 1)
    return ys[lo] + (ys[hi] - ys[lo]) * t
  }
  f.total = s
  return f
}

/** surface point + outward normal of the body (or any W/R law) at side k, developed s, height y */
export function surfacePoint(k, s, y, W = bodyW, R = bodyR) {
  const a = W(y), b = RHO * a, r = Math.min(R(y), b - 0.5)
  const t = rrPoint(k, s, a, b, r)
  // tilt the normal by the profile slope (along the section normal)
  const e = 0.5
  const da = (W(y + e) - W(y - e)) / (2 * e)
  const n = new THREE.Vector3(t[2], 0, t[3])
  const slope = da * (Math.abs(t[2]) + RHO * Math.abs(t[3])) // ≈ outward travel per mm of height
  n.y = -slope
  n.normalize()
  return { p: new THREE.Vector3(t[0], y, t[1]), n }
}

/**
 * One side (k) of a rounded-rectangle loft between y0 and y1, half width W(y) (x), depth RHO·W, corner radius R(y).
 * u runs diagonal → diagonal, v linear in y (neighbouring sides share their seam vertices exactly).
 * With `relief`, the panel is laid 1:1: panel x = panelW/2 + s (developed mm from the side centre), panel y =
 * arc(y) − arc(y0) along the side's centre meridian; no fade across the seams (the décor keeps them plain).
 */
export function loftSide(kit, { k, y0, y1, W, R, relief = null, arc = null, panelW = 0, material, density = 0.7, fade = 1.2, maxVerts = 160000, rows = null }) {
  const tmp = [0, 0, 0, 0]
  const A = (y) => W(y), B = (y) => RHO * W(y)
  const pos = (u, y, o) => {
    const a = A(y), b = B(y), r = Math.min(R(y), b - 0.5)
    const Q = quarterLen(a, b, r, k)
    rrPoint(k, (u - 0.5) * Q, a, b, r, tmp)
    o.set(tmp[0], y, tmp[1])
    return o
  }
  const p0 = new THREE.Vector3(), p1 = new THREE.Vector3(), pu = new THREE.Vector3(), pv = new THREE.Vector3()
  const nIn = new THREE.Vector3(), nn = new THREE.Vector3()
  const surface = (u, v, out) => {
    const y = y0 + (y1 - y0) * v
    pos(u, y, out.pos)
    const a = A(y), b = B(y), r = Math.min(R(y), b - 0.5)
    rrPoint(k, (u - 0.5) * quarterLen(a, b, r, k), a, b, r, tmp)
    const e = 0.25
    pos(u, Math.min(y1, y + e), p1); pos(u, Math.max(y0, y - e), p0)
    if (p1.distanceToSquared(p0) < 1e-12) { pos(u, y + e, p1); pos(u, y - e, p0) }
    pv.subVectors(p1, p0)
    nIn.set(tmp[2], 0, tmp[3])
    pu.set(-tmp[3], 0, tmp[2])
    nn.crossVectors(pv, pu)
    if (nn.dot(nIn) < 0) nn.negate()
    out.nrm.copy(nn.normalize())
  }
  const yMid = (y0 + y1) / 2
  const lenU = quarterLen(A(yMid), B(yMid), Math.min(R(yMid), B(yMid) - 0.5), k)
  const lenV = arc ? arc(y1) - arc(y0) : y1 - y0
  const nu = Math.max(8, Math.ceil(lenU * density)), nv = Math.max(2, Math.ceil(lenV * density))
  const opts = { surface, segments: [nu, nv], normals: 'surface', maxVerts }
  if (rows) opts.samples = { v: rows }
  if (relief) {
    const Hp = relief.heightMM
    const a0 = arc(y0)
    opts.relief = relief
    opts.fade = { u0: 0, u1: 0, v0: fade, v1: fade }
    opts.panelMap = (u, v, o) => {
      const y = y0 + (y1 - y0) * v
      const a = A(y), b = B(y), r = Math.min(R(y), b - 0.5)
      const Q = quarterLen(a, b, r, k)
      o[0] = 0.5 + ((u - 0.5) * Q) / panelW
      o[1] = (arc(y) - a0) / Hp
      o[2] = 1
    }
  }
  const geo = kit.buildSurface(opts)
  const m = new THREE.Mesh(geo, material)
  m.castShadow = m.receiveShadow = true
  return m
}

/** a plain rounded-rect ring loft (ledges, lips, plate, crown) through levels [{ y, a, b, r }] → Mesh; flip for inner walls */
export function ringLoft(levels, material, { n = 192, flip = false } = {}) {
  const pts = [], idx = []
  const tmp = [0, 0, 0, 0]
  for (let j = 0; j < levels.length; j++) {
    const L = levels[j]
    const r = Math.max(0, Math.min(L.r, L.b - 0.01, L.a - 0.01))
    for (let i = 0; i < n; i++) {
      const t = i / n
      const k = Math.floor(t * 4) % 4
      const f = t * 4 - k
      rrPoint(k, (f - 0.5) * quarterLen(L.a, L.b, r, k), L.a, L.b, r, tmp)
      pts.push(tmp[0], L.y, tmp[1])
    }
  }
  for (let j = 0; j < levels.length - 1; j++) {
    for (let i = 0; i < n; i++) {
      const a = j * n + i, b = j * n + ((i + 1) % n), c = a + n, d = b + n
      if (flip) idx.push(a, d, b, a, c, d)
      else idx.push(a, b, d, a, d, c)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  g.setIndex(idx)
  g.computeVertexNormals()
  const m = new THREE.Mesh(g, material)
  m.castShadow = m.receiveShadow = true
  return m
}

/** a flat rounded-rect cap at y (up: normal +Y, else −Y) */
export function capMesh({ y, a, b, r }, material, up = true, n = 192) {
  const tmp = [0, 0, 0, 0]
  const pts = [0, y, 0], idx = []
  const rr = Math.max(0, Math.min(r, b - 0.01, a - 0.01))
  for (let i = 0; i < n; i++) {
    const t = i / n, k = Math.floor(t * 4) % 4, f = t * 4 - k
    rrPoint(k, (f - 0.5) * quarterLen(a, b, rr, k), a, b, rr, tmp)
    pts.push(tmp[0], y, tmp[1])
  }
  for (let i = 0; i < n; i++) {
    const a1 = 1 + i, b1 = 1 + ((i + 1) % n)
    if (up) idx.push(0, a1, b1)
    else idx.push(0, b1, a1)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  g.setIndex(idx)
  g.computeVertexNormals()
  const m = new THREE.Mesh(g, material)
  m.receiveShadow = true
  return m
}
