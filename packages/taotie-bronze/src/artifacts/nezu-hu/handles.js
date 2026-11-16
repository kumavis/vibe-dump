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
  return { pts, cum, total: cum[cum.length - 1], hw }
}
/** a limb along a path: rounded-rect section, half-width in the plane hw(f) (mm), half-thickness across hz */
function limb(path, x, y, z, hz, r = 3.5) {
  const q = query(path, x, y)
  const hw = typeof path.hw === 'function' ? path.hw(q.f) : path.hw
  return { d: sdRBox2(q.d, z, hw, hz, Math.min(r, hw * 0.9, hz * 0.9)), q, hw }
}

// read off photo-11 on a grid in handle-plane mm (right handle; the left one mirrors it): the upper handle is a
// thick ring (x 97–135, y 297–338) round a round opening (centre 117.5, 315.5; Ø ≈ 15), its left side lying against
// the neck, the head on its right; the body runs from under the head steeply down and out to the tail (r 151 at
// y 262); a haunch fills the angle between body and shoulder, leaving a small gap under the body (y ≈ 273)
const ROOT = makePath([[87, 294], [95, 304], [99, 318]], 6.2)
const BODY = makePath([[122, 305], [128.5, 297], [133, 287.5], [137, 278], [140.5, 270], [142, 263]], (f) => 9.2 - 1.2 * f)
const LEG = makePath([[99, 297], [109, 290.5], [117, 283], [121, 274]], 8)
const RING = { c: [116, 318], rx: 19, ry: 20.5, hole: [117.5, 315.5], hr: 7.6 }
export const HANDLE = {
  bounds: { min: [80, 236, -12], max: [154, 352, 12] },
  hz: 6, // half thickness across the handle (mm, assumed)
}

export function handleSDF() {
  const hz = HANDLE.hz
  const sd = (x, y, z) => {
    // arch (neck curving back to the vessel) — its sides carry a groove parallel to the edges
    // the ring (neck rolling over into the head), sides rounded, the opening through it
    let d = smax(sdEllipsoid(x - RING.c[0], y - RING.c[1], z, RING.rx, RING.ry, hz + 8) , Math.abs(z) - hz, 2.4)
    d = smin(d, limb(ROOT, x, y, z, hz).d, 2.6)
    d = smin(d, limb(LEG, x, y, z, hz * 0.95).d, 2.6)
    const B = limb(BODY, x, y, z, hz + 0.6)
    d = smin(d, B.d, 3)
    // the tail: a squared curl (x 128–151, y 252–275) on a bar clamped to the shoulder, a hole through its middle
    let t = sdRBox3(x - 139.5, y - 263.5, z, 11.5, 11.5, hz + 0.4, 3.6)
    t = smin(t, sdRBox3(x - 123, y - 262, z, 13, 5.6, hz, 2.4), 2)
    t = smax(t, -sdRBox3(x - 141, y - 262.5, z, 3.0, 3.4, hz + 4, 1.4), 0.6)
    d = smin(d, t, 3.2)
    // incised line work on both side faces (z = ±hz): contour groove inside the edge of arch and body,
    // a spine groove down the body, a C-scroll on the tail
    const zf = hz + 0.6 - Math.abs(z)
    if (zf < 1.4) {
      let g = 1e9
      const rr = len2(x - RING.hole[0], y - RING.hole[1])
      if (x < 128) g = Math.min(g, Math.abs(rr - RING.hr - 2.4) - 0.32)
      if (B.q.f > 0.08 && B.q.f < 0.92) {
        g = Math.min(g, Math.abs(B.q.d - (B.hw - 2.1)) - 0.32)
        g = Math.min(g, Math.max(B.q.d - 0.32, -1e9))
      }
      // C-scroll on the tail (open toward the hole)
      // a squared spiral round the tail's hole
      g = Math.min(g, sdRBox2(x - 141, y - 262.5, 6.6, 7.0, 2.2) < 0 ? Math.abs(sdRBox2(x - 141, y - 262.5, 6.6, 7.0, 2.2)) - 0.34 : 1e9)
      // ladder rings on the neck behind the head (photo: transverse ridges where the ring meets the head)
      const ang = Math.atan2(y - RING.hole[1], x - RING.hole[0])
      if (ang > 0.35 && ang < 1.2 && rr > RING.hr + 4) g = Math.min(g, Math.abs((((ang * 12) % 1) + 1) % 1 - 0.5) * 2.2 - 0.32)
      d = smax(d, -Math.max(g, zf - 0.6), 0.25)
    }
    d = smin(d, head(x, y, z), 2.6)
    d = smax(d, -(len2(x - RING.hole[0], y - RING.hole[1]) - RING.hr), 3.2)
    return d
  }
  return { sd, bounds: HANDLE.bounds }
}

/** the head: a flat face looking out (+x), the snout pointing down; a horn tuft on the crown */
function head(x, y, z) {
  // skull
  let d = sdEllipsoid(x - 131.5, y - 322, z, 8.0, 12.0, 8.0)
  // flat face with a brow
  d = smin(d, sdRBox3(x - 135, y - 322, z, 3.6, 7.2, 6.6, 2.4), 2)
  d = smin(d, sdRBox3(x - 137.2, y - 327.4, z, 1.6, 1.6, 6.4, 1.0), 1.0)
  // snout: down and a little out, a broad muzzle
  d = smin(d, sdCone(x, y, z, [135, 316, 0], [137.6, 309.6, 0], 5.2, 4.2), 2.2)
  d = smax(d, -sdRBox3(x - 139.6, y - 310.8, z, 1.8, 0.6, 4.2, 0.3), 0.4)
  // eyes: bulging, on the face
  for (const s of [-1, 1]) {
    d = smin(d, sdEllipsoid(x - 137.4, y - 323.6, z - s * 3.6, 1.8, 2.0, 1.9), 0.7)
    d = smax(d, -(len3(x - 139.0, y - 323.6, z - s * 3.8) - 0.8), 0.3)
  }
  // horn tuft: two short horns side by side, tips rolled forward
  for (const s of [-1, 1]) {
    d = smin(d, sdCone(x, y, z, [130.5, 331, s * 2.6], [131.6, 338.4, s * 3.0], 3.2, 2.0), 1.8)
    d = smin(d, sdEllipsoid(x - 132.6, y - 338.6, z - s * 3.0, 2.4, 1.6, 2.0), 1.0)
  }
  return d
}
