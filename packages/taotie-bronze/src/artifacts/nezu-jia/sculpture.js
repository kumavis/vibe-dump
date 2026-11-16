// Nezu jia — the cast sculpture: the strap handle with its animal head (photo-21 crop "handle", photo-22).
// A signed distance field meshed with kit.meshSDF. Built in the HANDLE PLANE: x = distance from the vessel axis
// along the handle's azimuth (mm), y = height, z = across the strap. The caller rotates it to θ = AZ.handle.
//
// Read off photo-21 (handle seen ≈ 56° off its plane, scale 4.3 px/mm at the axis, ≈ 1.08× nearer) and photo-22
// (head nearly frontal, ≈ 16° off): a strap ≈ 14 mm thick and ≈ 20 mm wide leaves the upper wall at y 273–287 as
// a level arm, turns down under the head at r ≈ 110 and sweeps round in a C (outer face r ≈ 112 at y ≈ 245) into
// the lower drum at y ≈ 181. On the outer corner sits a head looking out and down: a broad brow, bulging eyes, a
// squared snout reaching r ≈ 127, and on its crown two upright SQUARE plates (≈ 22 × 24 mm, the photo-22
// "horns") each cut with a squared coil. The strap's side faces carry a border line and a row of cartouches.

import { yUnmap } from './form.js'

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
/** distance to a 2D polyline */
function dPoly(pts, x, y) {
  let best = 1e9
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1]
    const dx = bx - ax, dy = by - ay
    const t = Math.min(1, Math.max(0, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)))
    best = Math.min(best, len2(x - ax - dx * t, y - ay - dy * t))
  }
  return best
}
/** nearest point on a polyline: { d, a (arc mm), side (+1 left of travel) } */
function polyQuery(path, cum, x, y) {
  let best = 1e9, ba = 0, bs = 1
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
      bs = (x - cx) * (-dy / L) + (y - cy) * (dx / L) >= 0 ? 1 : -1
    }
  }
  return { d: best, a: ba, side: bs }
}
function densify(pts, step = 2) {
  const out = [pts[0]]
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i]
    const n = Math.max(1, Math.ceil(len2(bx - ax, by - ay) / step))
    for (let k = 1; k <= n; k++) out.push([ax + ((bx - ax) * k) / n, ay + ((by - ay) * k) / n])
  }
  return out
}
/** a squared coil (centre c, outer half size h, pitch p) as a polyline, in the plate's 2D frame */
function squaredCoil(h, p, turns) {
  const pts = [[-h, h]]
  const dirs = [[1, 0], [0, -1], [-1, 0], [0, 1]]
  let x = -h, y = h
  for (let i = 0; i < turns * 4; i++) {
    const L = 2 * h - p * Math.max(0, Math.floor((i - 1) / 2))
    if (L < p * 0.8) break
    const [dx, dy] = dirs[i % 4]
    x += dx * L; y += dy * L
    pts.push([x, y])
  }
  return pts
}

// strap centre line in the handle plane (x, y)
const PATH = densify([
  [50, 270.6], [64, 271.3], [80, 271.3], [93, 269.8], [102, 265.8], [107.8, 258.6], [110.9, 248.6], [111.9, 237.0],
  [111.1, 225.0], [108.2, 213.0], [103, 201.4], [95.4, 190.8], [85.6, 182.2], [74, 176.0], [62.4, 172.8], [51, 171.8],
], 1.5)
const STRAP = { half: 6.8, halfZ: 10.2, r: 3.4 }

export function handleSDF() {
  const cum = [0]
  for (let i = 1; i < PATH.length; i++) cum.push(cum[i - 1] + len2(PATH[i][0] - PATH[i - 1][0], PATH[i][1] - PATH[i - 1][1]))
  const total = cum[cum.length - 1]
  // cartouches on the side faces: from under the head down the C
  const cart = []
  for (let a = 58; a < total - 12; a += 9.6) cart.push(a)
  const coilA = squaredCoil(7.2, 4.8, 1.75)
  const sd = (x, yv, z) => {
    // the photographs put the handle 116 mm tall (y 190 → 306): squeeze the drawing 1/1.12 about its middle
    const y = 236 + (yUnmap(yv) - 236) * 1.12
    const q = polyQuery(PATH, cum, x, y)
    const n = q.d * q.side
    let d = sdRBox2(q.d, z, STRAP.half, STRAP.halfZ, STRAP.r)
    // side-face line work (both faces): a border groove 2 mm inside each edge, cross grooves making cartouches
    const zf = STRAP.halfZ - Math.abs(z) // depth below the side face
    if (zf < 1.2 && q.a > 50 && q.a < total - 6) {
      let g = Math.abs(Math.abs(n) - (STRAP.half - 2.1)) - 0.32
      let c = 1e9
      for (const a0 of cart) c = Math.min(c, Math.abs(q.a - a0))
      if (Math.abs(n) < STRAP.half - 2.1) g = Math.min(g, c - 0.32)
      // a short hook inside each cartouche (a C open toward the outer edge)
      let best = 1e9
      for (const a0 of cart) {
        const u = q.a - a0 - 4.8
        if (Math.abs(u) > 4.8) continue
        best = Math.min(best, Math.abs(len2(u, n + 0.6) - 2.0) - 0.3)
      }
      g = Math.min(g, best)
      d = Math.max(d, -(Math.max(g, zf - 0.55)))
    }
    // the head
    d = smin(d, head(x, y, z, coilA), 2.2)
    return d
  }
  return { sd, bounds: { min: [46, 182, -36], max: [146, 316, 36] } }
}

/**
 * The head on the outer corner (round r8-fix, re-drawn from photo-21 crop "handle" — profile — and photo-22 crop
 * "handle head" — near frontal): a crown block on the strap's corner, and from it a LONG snout thrusting out and
 * down, ≈ 1/3 of the strap's height, its tip ≈ 24 mm beyond the strap's outer face, ending in a flat squared
 * muzzle; a lower jaw curls back under it into the strap. Brow and eyes are SURFACE décor on the face (a low
 * boss in a sunk ring under a sunk brow curl), not button eyes. On the crown two upright square plates (≈ 24 ×
 * 22 mm, sides vertical), splayed outward like ears, each with a raised border and ONE squared coil ending in a
 * hooked centre.
 */
function head(x, y, z, coil) {
  // crown block on the strap corner
  let d = sdRBox3(x - 111, y - 264.5, z, 7.6, 7.6, 12.6, 4.4)
  // the snout: a tapered box from the crown (A) out and down to the muzzle (B)
  const Ax = 113, Ay = 262.5, Bx = 139.5, By = 240.5
  const Lx = Bx - Ax, Ly = By - Ay, L = Math.hypot(Lx, Ly)
  const ux = Lx / L, uy = Ly / L, nx = -uy, ny = ux // n: the face side, out and up
  const mx = (Ax + Bx) / 2, my = (Ay + By) / 2
  const a = (x - mx) * ux + (y - my) * uy, b = (x - mx) * nx + (y - my) * ny
  const f = Math.min(1, Math.max(0, a / L + 0.5)) // 0 crown → 1 muzzle
  const hb = 8.4 - 2.2 * f, hz = 12.2 - 2.6 * f
  d = smin(d, sdRBox3(a, b + 0.6 * f, z, L / 2, hb, hz, 3.0), 2.4)
  // lower jaw: curls from under the muzzle back into the strap
  d = smin(d, sdCone(x, y, z, [117, 241.5, 0], [133.5, 236.4, 0], 5.6, 4.0), 2.6)
  d = smin(d, sdRBox3(x - 125, y - 238.6, z, 8.5, 3.0, 8.6, 2.4), 2.0)
  // muzzle end: a flat face with two nostril pits and a mouth groove under it
  const ea = a - L / 2 // ≤ 0 inside
  // (no nostril pits: on photo-22 the muzzle front is flat, crossed by lines)
  for (const k of [-1, 1]) d = smax(d, -Math.max(Math.abs(b - 1.0 + k * 2.4) - 0.5, -ea - 1.0, Math.abs(z) - 7.2), 0.25)
  d = smax(d, -sdRBox3(x - 134.5, y - 235.8, z, 5.5, 0.55, 7.4, 0.4), 0.3)
  // face décor (on the n side): eyes as low bosses in a sunk ring, a sunk brow curl over each, a ridge down the nose
  const depthBelow = hb - b // > 0 under the face surface
  if (depthBelow > -2 && depthBelow < 2.5) {
    let g = 1e9
    for (const sgn of [-1, 1]) {
      const ea2 = a + L / 2 - 9.2, ez = z - sgn * 6.4
      const r = len2(ea2 * 0.9, ez)
      d = smin(d, len3(ea2 * 0.9, (b - (hb - 1.4)) * 1.3, ez) - 2.6, 0.6) // the boss: ≈ 1 mm proud
      g = Math.min(g, Math.abs(r - 3.9) - 0.6) // sunk ring
      // brow: a C-curl above-behind the eye, opening toward the muzzle
      const bc = len2(a + L / 2 - 6.2, z - sgn * 8.6)
      if (a + L / 2 - 6.2 < 1.5) g = Math.min(g, Math.abs(bc - 5.6) - 0.6)
      // cheek line toward the muzzle
      g = Math.min(g, dPoly([[ -L / 2 + 13, sgn * 9.4], [L / 2 - 6, sgn * 7.0]], a, z) - 0.55)
    }
    // ladder on the nose ridge
    if (Math.abs(z) < 2.2 && a > -L / 2 + 13 && a < L / 2 - 3) g = Math.min(g, Math.abs(((a % 2.8) + 2.8) % 2.8 - 1.4) - 0.35)
    d = smax(d, -Math.max(g, depthBelow - 1.3), 0.25)
  }
  // the two square plates on the crown: upright, splayed 13° outward (tops out), faces toward +x
  for (const s of [-1, 1]) {
    const cz = s * 15.0, cy = 284.2, cx = 109.6
    const ang = s * 13 * Math.PI / 180
    const ly = (y - cy) * Math.cos(ang) - (z - cz) * Math.sin(ang)
    const lz = (y - cy) * Math.sin(ang) + (z - cz) * Math.cos(ang)
    let pl = sdRBox3(x - cx, ly, lz, 3.3, 13.0, 12.0, 2.4)
    const face = (cx + 3.3) - x
    // raised border: the field inside it is sunk 0.9 mm, the coil stands back up to the face
    const field = sdRBox2(lz, ly, 12.0 - 2.4, 13.0 - 2.4, 1.6)
    const coilBand = dPoly(coil, lz * s, ly + 0.4) - 1.45
    const sunk = Math.max(field, -coilBand)
    pl = Math.max(pl, -Math.max(sunk, face - 0.9))
    d = smin(d, pl, 1.6)
  }
  return d
}
