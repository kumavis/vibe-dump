// Met gui 62.217 — the cast sculpture: the two animal-head loop handles and the two
// frontal heads in the neck frieze (dossier §b.4–b.5; detail-handle.jpg,
// detail-handle-end.jpg, detail-head.jpg, top.jpg). Signed distance fields meshed
// with kit.meshSDF. All mm.
//
// HANDLE, built in vessel space for the +X side (azimuth 90°): the loop lies in the
// XY plane, z across it. Centre line: out of the neck at y 98.5, round a C whose outer
// face reaches r ≈ 117 at y ≈ 75 (235 mm between handles), back into the lower belly at
// y 52. Section: a rounded rectangle 12.5 (radial) × 14 (z). On top of the outer corner
// sits a horned head looking out and down (snout tip r ≈ 117, y ≈ 92; horns lie flat on
// the crown as two C scrolls, ≈ 31 mm across in end view); a flat tongue-like tab runs
// down the loop's outer face from under the chin; each side face of the loop carries a
// row of raised D-shaped cartouches (sunk outlines ≈ 0.6 mm), ≈ 11 mm apart.

const len2 = (x, y) => Math.sqrt(x * x + y * y)
const len3 = (x, y, z) => Math.sqrt(x * x + y * y + z * z)
const smin = (a, b, k) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k
  return Math.min(a, b) - h * h * k * 0.25
}
const smax = (a, b, k) => -smin(-a, -b, k)

function sdEllipsoid(px, py, pz, rx, ry, rz) {
  const k0 = len3(px / rx, py / ry, pz / rz)
  const k1 = len3(px / (rx * rx), py / (ry * ry), pz / (rz * rz))
  return k1 > 1e-9 ? (k0 * (k0 - 1)) / k1 : -Math.min(rx, ry, rz)
}
/** capsule a → b, radius ra → rb (linear blend; adequate for gentle tapers) */
function sdCone(px, py, pz, a, b, ra, rb) {
  const bx = b[0] - a[0], by = b[1] - a[1], bz = b[2] - a[2]
  const qx = px - a[0], qy = py - a[1], qz = pz - a[2]
  const h = Math.min(1, Math.max(0, (qx * bx + qy * by + qz * bz) / (bx * bx + by * by + bz * bz)))
  return len3(qx - bx * h, qy - by * h, qz - bz * h) - (ra + (rb - ra) * h)
}
/** 2D rounded box, half extents bx, by, corner r */
function sdRBox2(x, y, bx, by, r) {
  const qx = Math.abs(x) - bx + r, qy = Math.abs(y) - by + r
  return len2(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r
}
function sdRBox3(x, y, z, bx, by, bz, r) {
  const qx = Math.abs(x) - bx + r, qy = Math.abs(y) - by + r, qz = Math.abs(z) - bz + r
  return len3(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - r
}

/** polyline helper: nearest point → { d (unsigned), a (arc length), nx, ny (unit normal, left of travel) } */
function polyQuery(path, cum, x, y) {
  let best = 1e9, ba = 0, bnx = 0, bny = 0, bs = 1
  for (let i = 0; i < path.length - 1; i++) {
    const [ax, ay] = path[i], [bx, by] = path[i + 1]
    const dx = bx - ax, dy = by - ay
    const L2 = dx * dx + dy * dy
    const t = Math.min(1, Math.max(0, ((x - ax) * dx + (y - ay) * dy) / L2))
    const cx = ax + dx * t, cy = ay + dy * t
    const d = len2(x - cx, y - cy)
    if (d < best) {
      best = d
      const L = Math.sqrt(L2)
      ba = cum[i] + L * t
      bnx = -dy / L; bny = dx / L
      bs = (x - cx) * bnx + (y - cy) * bny >= 0 ? 1 : -1
    }
  }
  return { d: best, a: ba, side: bs }
}

/** the handle loop's centre line (vessel x, y; +X side) */
function loopPath() {
  const pts = [[70, 98.5], [80, 98.6], [88, 98.5]]
  const cx = 91.5, cy = 75.5, rx = 19.0, ry = 23.5
  for (let i = 1; i <= 24; i++) {
    const a = Math.PI / 2 - (Math.PI * i) / 24
    pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)])
  }
  pts.push([80, 52.1], [70, 52.8])
  return pts
}

const DROP = 1.0

export function handleSDF() {
  const path = loopPath()
  const cum = [0]
  for (let i = 1; i < path.length; i++) cum.push(cum[i - 1] + len2(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]))
  const total = cum[cum.length - 1]
  const HW = 6.3, HZ = 7.0 // half section: radial, across
  // cartouches along the loop (arc mm from the top attachment): D-shaped plates outlined by a groove
  const cartA = []
  for (let a = 36; a < total - 14; a += 10.8) cartA.push(a)
  const sd = (x, y0, z) => {
    const y = y0 + DROP // the whole handle sits DROP mm lower than its drawing
    const q = polyQuery(path, cum, x, y)
    const n = q.d * q.side // signed offset from the centre line (+ = left of travel = inside of the C)
    // D cartouches (detail-handle.jpg): raised plates ≈ 0.8 mm on both side faces, ≈ 8 × 9 mm,
    // round on the side toward the loop's inside, square outside, outlined by their own step
    let e = 1e9
    if (q.a > 26 && q.a < total - 8) {
      for (const a0 of cartA) {
        const u = q.a - a0
        if (Math.abs(u) > 7) continue
        e = Math.min(e, sdRBox2(u, n + 0.3, 4.0, 4.3, n > 0 ? 3.4 : 1.0))
      }
    }
    const bump = 0.8 * Math.min(1, Math.max(0, (0.15 - e) / 0.5))
    let d = sdRBox2(q.d, z, HW, HZ + bump, 5.2)
    // tongue tab down the outer face (x ≈ 116.5 → 118.6), y 63 → 92, ≈ 10 wide
    const tab = sdRBox3(x - 116.0, y - 78, z, 1.3, 14, 4.9, 1.1)
    d = smin(d, tab, 1.2)
    // head
    d = smin(d, headOnHandle(x, y, z), 1.6)
    return d
  }
  return { sd, bounds: { min: [66, 40 - DROP, -18], max: [123, 114 - DROP, 18] } }
}

/**
 * The horned head over the handle's outer corner, its face turned OUT (+X) and down
 * (detail-handle-end.jpg, detail-handle.jpg, top.jpg): a broad flat brow ≈ 19 mm across, two big
 * C horns lying on the crown and curling out to the sides (≈ 31 mm across), leaf ears below them,
 * round eyes, and a long muzzle that narrows down into the tongue-like tab on the loop.
 */
function headOnHandle(x, y, z) {
  // skull: a rounded block, its front (face) plane at x ≈ 115
  let d = sdRBox3(x - 108.6, y - 98.6, z, 6.4, 8.2, 8.8, 4.2)
  // muzzle narrowing down to the tab (face plane leaning out at the bottom)
  d = smin(d, sdCone(x, y, z, [112.0, 94, 0], [114.4, 86.8, 0], 5.6, 4.0), 2.4)
  // brow ridge across the top of the face
  d = smin(d, sdRBox3(x - 113.6, y - 103.2, z, 2.2, 1.5, 8.6, 1.2), 1.0)
  // eyes
  for (const s of [-1, 1]) d = smin(d, len3(x - 114.6, y - 99.2, z - s * 4.4) - 2.1, 0.6)
  for (const s of [-1, 1]) {
    // horns: C scrolls in the y-z plane on the crown, curling out and down; a sunk line round the C
    const hy = (y - 105.9) / 0.62, hz = z - s * 8.4, hx = x - 108.8
    const r = len2(hy, hz)
    let ring = (Math.abs(r - 4.0) - 2.1) * 0.7
    const ang = Math.atan2(hy, hz * s) // 0 = outward, +90° = up
    if (ang < -1.9 || ang > 2.9) ring = Math.max(ring, 0.5) // opening: down and inward
    let horn = smax(ring, Math.abs(hx) - 3.0, 0.8)
    horn = Math.max(horn, -Math.max(Math.abs(r - 4.0) - 0.45, 2.45 - hx))
    d = smin(d, horn, 1.3)
    // leaf ears out to the sides under the horns
    d = smin(d, sdEllipsoid(x - 107.5, y - 100.5 + 0 * s, z - s * 12.2, 2.4, 2.0, 4.0), 1.2)
  }
  return d
}

// ------------------------------------------------------------------ neck-frieze head

/**
 * The frontal head at the centre of each neck frieze (detail-head.jpg, detail-neck-band.jpg):
 * ≈ 20 mm across the horns, ≈ 17 mm tall, standing ≈ 5 mm proud of the neck. Two kidney-shaped
 * C horns with sunk centres form the top; a broad flat brow; two round eyes; a squared snout
 * narrowing to the bottom border. Local frame as kit heads: +Z out of the wall, +Y up, wall at z = 0.
 */
export function friezeHeadSDF({ embed = 2 } = {}) {
  const sd = (x, y, z) => {
    // wall curvature (r ≈ 77): the back follows the neck
    const zb = z + (x * x) / (2 * 77)
    // face: a narrow block tapering to the snout
    const w = 4.6 - 0.22 * Math.max(0, -y)
    let d = sdRBox3(x, y + 1.8, zb - 1.6, Math.max(2.8, w), 6.4, 3.6 + embed / 2, 2.2)
    d = smax(d, -zb - embed, 0.5)
    // horns: two big kidney lobes spreading over the brow, curling down at their outer ends, sunk centres
    for (const s of [-1, 1]) {
      const hx = x - s * 6.0, hy = y - 4.0
      let h = sdEllipsoid(hx, hy, zb - 1.6, 6.0, 4.0, 3.6)
      h = smin(h, sdEllipsoid(x - s * 10.4, y - 1.0, zb - 1.2, 2.2, 3.0, 2.8), 1.2)
      const hole = sdEllipsoid(hx + s * 0.8, hy - 0.4, zb - 5.0, 2.8, 1.5, 1.5)
      h = smax(h, -hole, 0.5)
      d = smin(d, h, 1.0)
    }
    // eyes
    for (const s of [-1, 1]) d = smin(d, len3(x - s * 3.4, y + 1.0, zb - 4.6) - 1.55, 0.6)
    // nostril / mouth line: a shallow groove across the snout
    d = smax(d, -(sdRBox3(x, y + 5.8, zb - 5.2, 2.2, 0.35, 1.2, 0.3)), 0.3)
    return d
  }
  return { sd, bounds: { min: [-14, -10, -embed - 1], max: [14, 10.5, 8] } }
}
