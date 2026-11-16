// Nezu hu — the two sculpted handles (photo-11: both seen exactly in profile on the silhouette, ±90°).
// A signed distance field meshed with kit.meshSDF, built in the HANDLE PLANE: x = distance from the vessel axis
// along the handle's azimuth (mm), y = height (mm), z = across the handle. The caller turns it to θ = ±90°.
//
// Read off photo-11 (crops detail-handle-right / -left, 4.27 px per fitted unit = 3.56 px/mm at the inferred
// scale): a feline dragon climbing the shoulder. Its tail is a squared curl clamped on the shoulder (y 247–263,
// out to r 148, a hole through it); the body rises from it, steep and fat, to a head under the neck rope that
// looks OUT and a little down (snout tip r ≈ 137, y ≈ 312) with a horn / ear tuft standing up from the crown
// (top y ≈ 345); from the back of the head the neck arches over (top y ≈ 338) and comes down against the vessel's
// neck, so a round opening ≈ 14 × 16 mm stays between arch, head and a bar from the chin to the root.
// Thickness across (z) is NOT visible (both are seen edge-on): 12 mm assumed, the head 16 mm.
// Incised décor on the sides (photo: scrolls on the body and the tail curl, ladder ticks on the arch) is
// reduced to a contour groove, a spine groove and a C-scroll on the tail.

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

// centre lines in the handle plane (mm), read off photo-11 (right handle; the left one mirrors it)
const ARCH = makePath([[87, 292], [95, 300], [97.5, 314], [100.5, 326], [108, 332], [116, 330.5], [121, 326]], (f) => 6.6 - 0.4 * f)
const CHIN = makePath([[94, 299.5], [104, 301.5], [114, 304], [122, 309]], 3.9)
const BODY = makePath([[124, 312], [128.5, 302], [132.5, 290], [137, 278], [140, 268], [141, 261]], (f) => 7.2 + 0.6 * f)

export const HANDLE = {
  bounds: { min: [80, 236, -12], max: [154, 352, 12] },
  hz: 6, // half thickness across the handle (mm, assumed)
}

export function handleSDF() {
  const hz = HANDLE.hz
  const sd = (x, y, z) => {
    // arch (neck curving back to the vessel) — its sides carry a groove parallel to the edges
    const A = limb(ARCH, x, y, z, hz)
    let d = A.d
    d = smin(d, limb(CHIN, x, y, z, hz * 0.85).d, 2.4)
    const B = limb(BODY, x, y, z, hz + 0.6)
    d = smin(d, B.d, 3)
    // the tail: a squared curl clamped on the shoulder, a hole through its outer end
    let t = sdRBox3(x - 132, y - 255, z, 16.5, 8.4, hz + 0.4, 3.2)
    t = smax(t, -sdRBox3(x - 140.5, y - 254, z, 3.1, 2.8, hz + 4, 1.4), 0.6)
    d = smin(d, t, 3.2)
    // incised line work on both side faces (z = ±hz): contour groove inside the edge of arch and body,
    // a spine groove down the body, a C-scroll on the tail
    const zf = hz + 0.6 - Math.abs(z)
    if (zf < 1.4) {
      let g = 1e9
      if (A.q.f > 0.12 && A.q.f < 0.95) g = Math.min(g, Math.abs(A.q.d - (A.hw - 2.0)) - 0.32)
      if (B.q.f > 0.08 && B.q.f < 0.92) {
        g = Math.min(g, Math.abs(B.q.d - (B.hw - 2.1)) - 0.32)
        g = Math.min(g, Math.max(B.q.d - 0.32, -1e9))
      }
      // C-scroll on the tail (open toward the hole)
      const cx = x - 128, cy = y - 255.5
      const rr = len2(cx, cy)
      if (cx < 2.5) g = Math.min(g, Math.abs(rr - 4.6) - 0.34)
      g = Math.min(g, Math.abs(rr - 1.6) - 0.3)
      d = smax(d, -Math.max(g, zf - 0.6), 0.25)
    }
    d = smin(d, head(x, y, z), 2.6)
    return d
  }
  return { sd, bounds: HANDLE.bounds }
}

/** the head: looks out (+x) and a little down; a horn tuft and a smaller ear on the crown */
function head(x, y, z) {
  // skull
  let d = sdEllipsoid(x - 127.5, y - 323.5, z, 8.6, 10.2, 7.8)
  // brow over the eyes
  d = smin(d, sdRBox3(x - 132.5, y - 327, z, 2.6, 2.2, 7.2, 1.6), 1.6)
  // snout: out and down, squared, a broad muzzle
  d = smin(d, sdCone(x, y, z, [131, 319.5, 0], [137.2, 312.2, 0], 5.6, 4.0), 2.2)
  // the mouth: a slot under the muzzle
  d = smax(d, -sdRBox3(x - 136.5, y - 309.6, z, 3.4, 0.7, 4.6, 0.4), 0.4)
  // eyes: bulging, on the sides of the face
  for (const s of [-1, 1]) {
    d = smin(d, sdEllipsoid(x - 132.4, y - 323.2, z - s * 5.6, 2.4, 2.1, 1.8), 0.8)
    d = smax(d, -(len3(x - 133.2, y - 323.2, z - s * 7.3) - 0.9), 0.3)
  }
  // horn tuft: a fat horn rising from the crown, leaning back, its tip rolled forward
  d = smin(d, sdCone(x, y, z, [127, 331, 0], [126.4, 343, 0], 3.6, 2.2), 1.8)
  d = smin(d, sdEllipsoid(x - 128.2, y - 344, z, 2.6, 2.0, 2.4), 1.0)
  // a smaller ear behind it
  for (const s of [-1, 1]) d = smin(d, sdCone(x, y, z, [121.5, 329.5, s * 3.2], [118.6, 337.2, s * 4.2], 2.4, 1.0), 1.4)
  return d
}
