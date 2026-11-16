// nezu-fanglei-dasikong — the form: measured stack, the rounded-square section law, and a loft builder that lays
// one 1:1 relief panel on each side of a rounded-square body, running from corner diagonal to corner diagonal
// (the corner blades of the lower belly straddle the corners, so a side's panel must reach round them).
// Units mm, Y up, foot on y = 0, front (+Z) = the face with the low lug; the loop handles are on ±X.
// Numbers: reference/nezu-fanglei-dasikong/dossier.md — every level and half width is back-projected from
// photo-34 through an ASSUMED camera (el 10°, ≈ 0.9 m, f ≈ 2980 px; .work/r8-dsk/solve). H = 500 is INFERRED.

import * as THREE from 'three'

export const H = 500
/** plan: depth (z) : width (x) — not visible in the two front photographs; INFERRED (fanglei 1.05–1.2 : 1) */
export const RHO = 0.9

/** levels (vessel y, mm) — dossier §b.2 */
export const LV = {
  base: 0,
  bladeTip: 28, //       centre blade tip (the lug's pendant mask ends at 31)
  cornerEnd: 45, //      corner blades' lower ends
  lugHoleBottom: 86,
  lugHoleTop: 101,
  lugTop: 112,
  blades: 213, //        blade register top = main register bottom (raised fillet 211–215)
  main: 277, //          main register top
  bossBottom: 285, //    whorl-boss band 285–306 (the fillet 277–285 between is plain)
  bossTop: 306.5,
  kuiTop: 336, //        kui frieze 307–336 on the shoulder slope
  shoulder: 346, //      shoulder top (three bowstrings 336–345); a flat ledge in to the collar
  collar: 397.5, //      collar 348–397.5 (a faint flush kui frieze)
  eave: 400, //          lid dome bottom
  lidBossTop: 421,
  lidTop: 466, //        dome crown (flat top under the knob)
  knob: 469, //          knob cap bottom (post 466–469)
  knobEave: 485,
  top: 500,
}

// half widths (x) of the body, back-projected silhouette of photo-34 (dossier §b.3)
const BODY = [[0, 77.5], [5.5, 78.7], [23.5, 84.1], [58.6, 94.8], [92.7, 105.5], [125.1, 114.5], [156.3, 122.6], [186.4, 129.9], [201.2, 133.6],
  [215.5, 136.4], [229.9, 139.8], [243.6, 141.2], [257.1, 141.9], [270.4, 141.9], [283.5, 140.9], [296.5, 139.6], [309.3, 137.1], [322, 133.3],
  [334.3, 124.6], [341, 115], [344.6, 106.5], [346, 100.5]]
// round r8-dsk-fix: re-measured against detail-lid (photo-34, same camera): the photographed dome slopes almost
// STRAIGHT in from the eave (half width ≈ 91 → 45 over its height) to a small crown that sits ≈ 10 mm lower than the
// first reading (the knob post shows under the cap). Seen from 10° above, a high flat crown shows its back edge and
// reads as a box: so the crown is lower (462) and narrower, the slope nearly conical.
const LID = [[400, 88.5], [406, 86.5], [414, 83], [422, 77.5], [430, 71], [438, 64], [445, 57], [451, 50], [456, 43], [459.5, 36], [461.5, 30], [462, 25]]
export const COLLAR = 87

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
/** corner radius of the body section (photo-34: fat rounded corners, ≈ 31 mm on the belly, ≈ 22 at the base) */
export const bodyR = (y) => 0.15 * bodyW(y) + 10
export const lidR = (y) => {
  const t = Math.min(1, Math.max(0, (y - LV.eave) / (LV.lidTop - LV.eave)))
  return 7 + 14 * t * t // r8-dsk-fix: 24 → 14 at the crown: flatter slopes meeting in rounded hips (detail-lid)
}

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
  // local (lx along the side, lz outward) → world
  if (k === 0) { out[0] = lx; out[1] = lz; out[2] = nx; out[3] = nz }
  else if (k === 1) { out[0] = lz; out[1] = -lx; out[2] = nz; out[3] = -nx }
  else if (k === 2) { out[0] = -lx; out[1] = -lz; out[2] = -nx; out[3] = -nz }
  else { out[0] = -lz; out[1] = lx; out[2] = -nz; out[3] = nx }
  return out
}

/** arc length up the FRONT centre meridian from y0, tabulated (every side's panel uses this vertical scale) */
export function arcTable(y0, y1, half, step = 0.5) {
  const ys = [], ss = []
  let s = 0, prev = null
  for (let y = y0; y <= y1 + step * 0.5; y += step) {
    const z = RHO * half(y)
    if (prev) s += Math.hypot(y - prev[0], z - prev[1])
    ys.push(y); ss.push(s); prev = [y, z]
  }
  const f = (y) => {
    const t = (y - y0) / step
    const i = Math.max(0, Math.min(ys.length - 2, Math.floor(t)))
    return ss[i] + (ss[i + 1] - ss[i]) * (t - i)
  }
  f.inverse = (s) => {
    let lo = 0, hi = ss.length - 1
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (ss[m] < s) lo = m; else hi = m }
    const t = (s - ss[lo]) / (ss[hi] - ss[lo] || 1)
    return ys[lo] + (ys[hi] - ys[lo]) * t
  }
  f.total = s
  return f
}

/**
 * One side (k) of a rounded-square loft between y0 and y1, half width W(y) (x), depth RHO·W, corner radius R(y).
 * u runs diagonal → diagonal, v linear in y (so neighbouring sides share their seam vertices exactly).
 * With `relief`, the panel is laid 1:1: panel x = W_p/2 + s (developed mm from the side centre), panel y =
 * arc(y) − arc(y0) along the front meridian; no fade across the seams (the décor is symmetric about them).
 */
export function loftSide(kit, { k, y0, y1, W, R, relief = null, arc = null, panelW = 0, material, density = 0.7, fade = 1.2, maxVerts = 160000 }) {
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
  const surface = (u, v, out) => {
    const y = y0 + (y1 - y0) * v
    pos(u, y, out.pos)
    // analytic normal: in-plane section normal tilted by the profile slope
    const a = A(y), b = B(y), r = Math.min(R(y), b - 0.5)
    rrPoint(k, (u - 0.5) * quarterLen(a, b, r, k), a, b, r, tmp)
    const e = 0.25
    pos(u, Math.min(y1, y + e), p1); pos(u, Math.max(y0, y - e), p0)
    pv.subVectors(p1, p0)
    const nIn = new THREE.Vector3(tmp[2], 0, tmp[3])
    pu.set(-tmp[3], 0, tmp[2]) // tangent along the perimeter (horizontal)
    const n = new THREE.Vector3().crossVectors(pv, pu)
    if (n.dot(nIn) < 0) n.negate()
    out.nrm.copy(n.normalize())
  }
  const yMid = (y0 + y1) / 2
  const lenU = quarterLen(A(yMid), B(yMid), Math.min(R(yMid), B(yMid) - 0.5), k)
  const lenV = arc ? arc(y1) - arc(y0) : y1 - y0
  const nu = Math.max(8, Math.ceil(lenU * density)), nv = Math.max(2, Math.ceil(lenV * density))
  const opts = { surface, segments: [nu, nv], normals: 'surface', maxVerts }
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

/** a plain rounded-rect ring loft (ledges, lips, caps) through levels [{ y, a, b, r }] → Mesh */
export function ringLoft(levels, material, { n = 160 } = {}) {
  const pts = [], nrm = [], idx = []
  const tmp = [0, 0, 0, 0]
  const per = n
  // each quarter of the perimeter is centred on side k: sample side k over f ∈ [0, 1) from its left diagonal
  for (let j = 0; j < levels.length; j++) {
    const L = levels[j]
    const r = Math.max(0, Math.min(L.r, L.b - 0.01, L.a - 0.01))
    for (let i = 0; i < per; i++) {
      const t = i / per
      const k = Math.floor(t * 4) % 4
      const f = t * 4 - k
      const Q = quarterLen(L.a, L.b, r, k)
      rrPoint(k, (f - 0.5) * Q, L.a, L.b, r, tmp)
      pts.push(tmp[0], L.y, tmp[1])
      nrm.push(tmp[2], 0, tmp[3])
    }
  }
  for (let j = 0; j < levels.length - 1; j++) {
    for (let i = 0; i < per; i++) {
      const a = j * per + i, b = j * per + ((i + 1) % per), c = a + per, d = b + per
      idx.push(a, b, d, a, d, c)
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
export function capMesh({ y, a, b, r }, material, up = true, n = 160) {
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
