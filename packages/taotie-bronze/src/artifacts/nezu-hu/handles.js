// Nezu hu — the two sculpted handles (photo-11: both seen exactly in profile on the silhouette, ±90°).
// A signed distance field meshed with kit.meshSDF, built in the HANDLE PLANE: x = distance from the vessel axis
// along the handle's azimuth (mm), y = height (mm), z = across the handle. The caller turns it to θ = ±90°.
//
// Read off photo-11 on a grid in handle-plane mm (.work/r8-hu/hgrid.py; crops detail-handle / -left): a feline
// dragon climbing the shoulder. A thick ring (the neck rolling over) round a round opening, its left side against the
// vessel's neck; the head on its right, flat-faced, looking out, the snout down, two short horns on the crown; the body
// from under the head steeply down and out to the tail, a squared curl with a hole on a bar clamped to the shoulder; a
// haunch filling the angle between body and shoulder. Thickness across (z) is NOT visible (both are seen edge-on):
// 12 mm assumed, the head 16 mm. Incised décor on the sides is reduced to a groove round the opening, ladder rings
// behind the head, contour and spine grooves on the body and a squared spiral on the tail.

const len2 = (x, y) => Math.sqrt(x * x + y * y)
const len3 = (x, y, z) => Math.sqrt(x * x + y * y + z * z)
const smin = (a, b, k) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k
  return Math.min(a, b) - h * h * k * 0.25
}
const smax = (a, b, k) => -smin(-a, -b, k)
function sdRBox2(x, y, bx, by, r) {
  const qx = Math.abs(x) - bx + r, qy = Math.abs(y) - by + r
  return len2(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r
}
function sdRBox3(x, y, z, bx, by, bz, r) {
  const qx = Math.abs(x) - bx + r, qy = Math.abs(y) - by + r, qz = Math.abs(z) - bz + r
  return len3(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - r
}
function sdCone(px, py, pz, a, b, ra, rb) {
  const bx = b[0] - a[0], by = b[1] - a[1], bz = b[2] - a[2]
  const qx = px - a[0], qy = py - a[1], qz = pz - a[2]
  const h = Math.min(1, Math.max(0, (qx * bx + qy * by + qz * bz) / (bx * bx + by * by + bz * bz)))
  return len3(qx - bx * h, qy - by * h, qz - bz * h) - (ra + (rb - ra) * h)
}
function sdEllipsoid(px, py, pz, rx, ry, rz) {
  const k0 = len3(px / rx, py / ry, pz / rz)
  const k1 = len3(px / (rx * rx), py / (ry * ry), pz / (rz * rz))
  return k1 > 1e-9 ? (k0 * (k0 - 1)) / k1 : -Math.min(rx, ry, rz)
}
function densify(pts, step = 1.5) {
  const out = [pts[0]]
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i]
    const n = Math.max(1, Math.ceil(len2(bx - ax, by - ay) / step))
    for (let k = 1; k <= n; k++) out.push([ax + ((bx - ax) * k) / n, ay + ((by - ay) * k) / n])
  }
  return out
}
/** chaikin-smoothed polyline (a few passes), ends kept */
function smooth(pts, passes = 3) {
  let p = pts
  for (let k = 0; k < passes; k++) {
    const o = [p[0]]
    for (let i = 0; i < p.length - 1; i++) {
      const [ax, ay] = p[i], [bx, by] = p[i + 1]
      o.push([0.75 * ax + 0.25 * bx, 0.75 * ay + 0.25 * by], [0.25 * ax + 0.75 * bx, 0.25 * ay + 0.75 * by])
    }
    o.push(p[p.length - 1])
    p = o
  }
  return densify(p, 1.2)
}
/** nearest point on a polyline: d, arc a, t (0..1 along), and the local half-width interpolated from `hw` */
function query(path, x, y) {
  let best = 1e9, bi = 0, bt = 0
  for (let i = 0; i < path.pts.length - 1; i++) {
    const [ax, ay] = path.pts[i], [bx, by] = path.pts[i + 1]
    const dx = bx - ax, dy = by - ay
    const t = Math.min(1, Math.max(0, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)))
    const d = len2(x - ax - dx * t, y - ay - dy * t)
    if (d < best) { best = d; bi = i; bt = t }
  }
  const a = path.cum[bi] + (path.cum[bi + 1] - path.cum[bi]) * bt
  return { d: best, f: a / path.total, a }
}
function makePath(ctrl, hw) {
  const pts = smooth(ctrl)
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + len2(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1])
  const box = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]
  return { pts, cum, total: cum[cum.length - 1], hw, box }
}
const FAR = { d: 1e9, f: -1, a: 0 }
/** a limb along a path: rounded-rect section, half-width in the plane hw(f) (mm), half-thickness across hz */
function limb(path, x, y, z, hz, r = 3.5) {
  // far from the path's box: a cheap lower bound (keeps the sign; the mesher's coarse pass skips these cells)
  const bx = Math.max(path.box[0] - x, 0, x - path.box[2]), by = Math.max(path.box[1] - y, 0, y - path.box[3])
  const db = len2(bx, by)
  if (db > 14) return { d: Math.max(db - 12, Math.abs(z) - hz), q: FAR, hw: 0 }
  const q = query(path, x, y)
  const hw = typeof path.hw === 'function' ? path.hw(q.f) : path.hw
  return { d: sdRBox2(q.d, z, hw, hz, Math.min(r, hw * 0.9, hz * 0.9)), q, hw }
}

// Re-read (r8 fix pass) off photo-11 on a 5 mm grid in handle-plane mm (.work/r8-hu-fix/hgrid.py: right handle,
// x = (px − axis)/3.56, y = (1680.8 − py)/3.525; the left one mirrors it). A feline dragon in an S: its NECK is a
// thick arch (≈ 14–17 mm) rising off the vessel's neck (x ≈ 91, y 290–325) over a big open loop (x 109–125,
// y 304–323; Ø ≈ 16 × 19, its lower right running out to a point under the chin) to the HEAD on the right
// (x 125–139, y 305–337: flat face looking out, snout down, round eyes, ribbed brow behind, a crest of two ridged
// horns to y ≈ 343); under the chin a short neck drops to a C-VOLUTE at the shoulder (124, 293); from there a
// FORELEG strap (≈ 8 mm, ribbed across) runs down-left to a squared paw on the vessel's shoulder (112, 273) and the
// BODY strap (≈ 9 mm, ribbed across) runs down-right into a big rolled TAIL VOLUTE (centre 141, 263), which ends
// in an open squared TAIL LOOP (x 122–138, y 245–265, a hole 7 × 6.5 through it) seated on the shoulder; open
// ground shows between paw, body and loop. Thickness across (z) is NOT visible (both handles are seen edge-on):
// assumed ≈ 13 mm for the arch, 16 mm for the head, 10–11 mm for the straps, all with rounded sections.
const ARCH = { c: [110, 314.5], rx: 20.5, ry: 24.5, hole: [116.6, 312.6], hrx: 8.0, hry: 9.9 }
// the arch as a fat TUBE round the loop (photo: shaded round across its whole width, not a flat slab):
// centre line from the shoulder volute round the loop's left and top into the back of the head
const ARCHP = makePath([[121.5, 296.2], [110, 296.4], [101.4, 300.5], [99.4, 312], [101.6, 323], [108, 329.8], [116, 331.2], [123, 329], [127.2, 324]],
  (f) => (f < 0.3 ? 6.6 + (9.2 - 6.6) * (f / 0.3) : f < 0.6 ? 9.2 : 9.2 - (9.2 - 7.0) * ((f - 0.6) / 0.4)))
const NECK = makePath([[129, 306], [126.8, 299.5], [125, 293.5]], 4.6)
// lower half re-read on photo-11 (r8 fix, second pass): the straps are BROAD and lie close together — the foreleg
// (≈ 9 mm) from the volute down-left to a paw on the shoulder at (111, 281), the body (≈ 13 mm) down-right into a
// small rolled tail volute (centre 142, 265.5, Ø ≈ 12), the squared tail loop to its lower left (x 116–137,
// y 244.5–267.5, its opening x 121–129, y 252–261); open ground only under the paw (x 112–122, y 268–278)
const LEG = makePath([[123, 291], [118, 286.6], [113.6, 283], [111.2, 281.2]], (f) => 4.6 - 0.5 * f)
const BODY = makePath([[125.5, 290.5], [128, 284.5], [131.4, 277.4], [135, 271.6], [139.2, 270.4], [143.6, 271.4], [147, 268.6], [147.6, 264.2], [145, 260.6], [140.8, 260.4], [138.8, 263.8]],
  (f) => (f < 0.4 ? 6.4 - 1.0 * (f / 0.4) : 5.4 - 2.2 * ((f - 0.4) / 0.6)))
const TAIL = { c: [126.6, 256.0], h: [10.4, 11.5], hole: [125.1, 256.5], hh: [4.0, 4.5] }
export const HANDLE = {
  bounds: { min: [84, 240, -12], max: [154, 347, 12] },
  hz: 6.5, // half thickness of the arch across the handle (mm, assumed)
}

export function handleSDF() {
  const hz = HANDLE.hz
  const sd = (x, y, z) => {
    // the arch: an elliptical slab, its section rounded (≈ elliptical where it is thick)
    const e = sdEllipsoid(x - ARCH.c[0], y - ARCH.c[1], 0, ARCH.rx, ARCH.ry, 1)
    const A = limb(ARCHP, x, y, z, hz, 6.2)
    let d = A.d
    // the straps (rounded sections, thinner)
    const N = limb(NECK, x, y, z, hz - 0.5, 3.6)
    const L = limb(LEG, x, y, z, 4.8, 3.6)
    const B = limb(BODY, x, y, z, 5.4, 3.6)
    d = smin(d, N.d, 2.2)
    d = smin(d, L.d, 1.2)
    d = smin(d, B.d, 1.4)
    // C-volute at the shoulder joint, a squared paw, the open tail loop
    d = smin(d, sdRBox3(x - 124.6, y - 292.8, z, 5.6, 5.6, hz - 0.2, 4.4), 1.6)
    d = smin(d, sdRBox3(x - 110.6, y - 280.2, z, 3.2, 3.0, 4.8, 1.2), 1.0)
    let t = sdRBox3(x - TAIL.c[0], y - TAIL.c[1], z, TAIL.h[0], TAIL.h[1], 5.0, 3.0)
    t = smax(t, -sdRBox3(x - TAIL.hole[0], y - TAIL.hole[1], z, TAIL.hh[0], TAIL.hh[1], 9, 1.2), 0.5)
    d = smin(d, t, 1.6)
    // the loop through the arch: an ellipse, its lower right drawn out to a point under the chin
    let hole = sdEllipsoid(x - ARCH.hole[0], y - ARCH.hole[1], 0, ARCH.hrx, ARCH.hry, 1)
    hole = smin(hole, sdCone(x, y, 0, [119.5, 309, 0], [125.4, 304.6, 0], 3.6, 0.9), 2.0)
    // incised line work on the side faces
    if (d > -2.5 && d < 1.5) {
      let g = 1e9
      // a contour line round the loop and inside the arch's outer edge
      if (x < 124) g = Math.min(g, Math.abs(hole - 2.6) - 0.34)
      if (A.q.f > 0.2 && A.q.f < 0.85) g = Math.min(g, Math.abs(A.q.d - A.hw + 2.4) - 0.34)
      // ribbing across the straps (photo: transverse ridges on body and leg)
      if (B.q.f > 0.05 && B.q.f < 0.36) g = Math.min(g, Math.abs((B.q.a % 3.2) - 1.6) - 0.36 + Math.max(0, B.q.d - 5.0))
      if (L.q.f > 0.1 && L.q.f < 0.85) g = Math.min(g, Math.abs((L.q.a % 3.0) - 1.5) - 0.34 + Math.max(0, L.q.d - 4.2))
      // spiral grooves in the volutes (shoulder joint, tail)
      g = Math.min(g, spiralGroove(x - 124.6, y - 292.8, 1.4, 1.5))
      g = Math.min(g, spiralGroove(x - 142.4, y - 265.6, 1.3, -1.6))
      // the tail loop's inner contour
      g = Math.min(g, Math.abs(sdRBox2(x - TAIL.c[0], y - TAIL.c[1], TAIL.h[0] - 2.6, TAIL.h[1] - 2.6, 1.8)) - 0.34)
      // ribbed brow behind the head (horizontal ridges where the arch meets the head)
      if (x > 119 && x < 127 && y > 324 && y < 336) g = Math.min(g, Math.abs((y % 2.6) - 1.3) - 0.38)
      d = smax(d, -Math.max(g, -d - 0.6), 0.3)
    }
    d = smin(d, head(x, y, z), 2.2)
    d = smax(d, -hole, 1.2)
    return d
  }
  return { sd, bounds: HANDLE.bounds }
}

/** an incised Archimedean spiral groove (pitch mm, `turns` signed = hand) centred at the origin, ≈ 2 turns */
function spiralGroove(x, y, pitch, turns) {
  const r = len2(x, y)
  if (r > pitch * Math.abs(turns) * 2.2 + 0.6) return 1e9
  const a = Math.atan2(y, x) * Math.sign(turns)
  const u = r / pitch - a / (2 * Math.PI)
  const f = u - Math.floor(u)
  return Math.abs(f - 0.5) * pitch - 0.34
}

/** the head: a flat face looking out (+x), the snout down and out; round eyes; a crest of two ridged horns */
function head(x, y, z) {
  // far from the head's box (x 118–145, y 300–347, |z| ≤ 10): a cheap lower bound
  const bx = Math.max(118 - x, 0, x - 145), by = Math.max(300 - y, 0, y - 347), bz = Math.max(Math.abs(z) - 10, 0)
  const db = len3(bx, by, bz)
  if (db > 4) return db
  // skull and cheeks
  let d = sdEllipsoid(x - 131.0, y - 321.5, z, 7.6, 12.5, 8.0)
  // flat face with a heavy brow
  d = smin(d, sdRBox3(x - 135.2, y - 322, z, 3.6, 7.6, 7.0, 2.6), 2)
  d = smin(d, sdRBox3(x - 136.6, y - 328.6, z, 2.0, 1.6, 7.0, 1.0), 1.0)
  // snout: down and out, a broad muzzle; mouth slit
  d = smin(d, sdCone(x, y, z, [134.5, 315, 0], [137.6, 308.6, 0], 5.4, 4.0), 2.2)
  d = smax(d, -sdRBox3(x - 139.2, y - 309.6, z, 1.8, 0.55, 4.4, 0.3), 0.4)
  // jaw under the chin
  d = smin(d, sdEllipsoid(x - 131.5, y - 307.6, z, 4.6, 3.0, 5.6), 1.6)
  // eyes: round, bulging, on the sides of the face
  for (const s of [-1, 1]) {
    d = smin(d, sdEllipsoid(x - 136.4, y - 323.4, z - s * 4.4, 2.2, 2.2, 2.0), 0.7)
    d = smax(d, -(len3(x - 137.6, y - 323.6, z - s * 5.6) - 0.9), 0.3)
  }
  // ears on the back of the skull
  for (const s of [-1, 1]) d = smin(d, sdEllipsoid(x - 126.6, y - 329.5, z - s * 5.6, 2.6, 3.6, 1.6), 1.2)
  // crest: two ridged horns, the front one taller (photo: tips at ≈ (127.4, 341) and (134, 342.6))
  const horns = [[[127.4, 332.5], [127.0, 340.6], 2.8, 1.7], [[131.0, 333], [131.6, 341.2], 2.6, 1.6], [[134.4, 332.5], [135.4, 342.2], 2.9, 1.8]]
  for (const [a, b, ra, rb] of horns) {
    let hd = sdCone(x, y, z, [a[0], a[1], 0], [b[0], b[1], 0], ra, rb)
    // ridges round the horn
    const g = Math.abs((((y - a[1]) % 2.2) + 2.2) % 2.2 - 1.1) - 0.32
    hd = smax(hd, -Math.max(g, -hd - 0.45), 0.25)
    d = smin(d, hd, 1.4)
  }
  return d
}
