// nezu-fanglei-dasikong — the cast sculpture (dossier §b.5): the two shoulder loop handles with beast heads (±X),
// the horned head at the centre of the front (and, inferred, back) shoulder, and the bridge of the low lug on the
// front (its pendant mask is relief on the body panel). Signed distance fields in VESSEL mm (Y up, front +Z),
// meshed with kit.meshSDF. Read off photo-34 (front) and photo-03 (front-left, higher).

import { bodyW, RHO } from './form.js'

const len2 = (x, y) => Math.sqrt(x * x + y * y)
const len3 = (x, y, z) => Math.sqrt(x * x + y * y + z * z)
const clamp = (x, a, b) => Math.min(b, Math.max(a, x))
const smin = (a, b, k) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k
  return Math.min(a, b) - h * h * k * 0.25
}
const smax = (a, b, k) => -smin(-a, -b, k)
function sdRBox3(x, y, z, bx, by, bz, r) {
  const qx = Math.abs(x) - bx + r, qy = Math.abs(y) - by + r, qz = Math.abs(z) - bz + r
  return len3(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - r
}
function sdEllipsoid(px, py, pz, rx, ry, rz) {
  const k0 = len3(px / rx, py / ry, pz / rz)
  const k1 = len3(px / (rx * rx), py / (ry * ry), pz / (rz * rz))
  return k1 > 1e-9 ? (k0 * (k0 - 1)) / k1 : -Math.min(rx, ry, rz)
}
/** distance to a segment a→b (3D) */
function sdSeg(x, y, z, a, b) {
  const px = x - a[0], py = y - a[1], pz = z - a[2]
  const bx = b[0] - a[0], by = b[1] - a[1], bz = b[2] - a[2]
  const h = clamp((px * bx + py * by + pz * bz) / (bx * bx + by * by + bz * bz), 0, 1)
  return len3(px - bx * h, py - by * h, pz - bz * h)
}
/** a tube through a polyline of [x, y, z, r] knots (radius interpolated) */
function sdTube(x, y, z, knots) {
  let d = Infinity
  for (let i = 0; i < knots.length - 1; i++) {
    const a = knots[i], b = knots[i + 1]
    const px = x - a[0], py = y - a[1], pz = z - a[2]
    const bx = b[0] - a[0], by = b[1] - a[1], bz = b[2] - a[2]
    const h = clamp((px * bx + py * by + pz * bz) / (bx * bx + by * by + bz * bz), 0, 1)
    d = Math.min(d, len3(px - bx * h, py - by * h, pz - bz * h) - (a[3] + (b[3] - a[3]) * h))
  }
  return d
}
/** a raised spiral-horn coil on a plane: (u, v) in-plane, h height above it; R outer radius, band half width w */
function coil(u, v, h, R, w, height) {
  const r = len2(u, v)
  const a = Math.atan2(v, u)
  // Archimedean band: distance to the nearest turn
  const pitch = R * 0.42
  const t = (r - (a / (2 * Math.PI)) * pitch) / pitch
  const dr = Math.abs(t - Math.round(t)) * pitch - w
  const d2 = Math.max(dr, r - R)
  return smax(d2, Math.abs(h - height / 2) - height / 2, 0.6)
}

const wallZ = (y) => RHO * bodyW(clamp(y, 0, 346))

// ------------------------------------------------------------------ shoulder head (front; back inferred)

/**
 * photo-34 / photo-03: a buffalo-like head on the centre of the front shoulder, y ≈ 296–345, ≈ 58 mm across its
 * horns. Two fat horns curl outward and down into coils at the top (y 330–345), round bulging eyes under them,
 * a broad brow, and a heavy, blunt, squarish snout (≈ 28 mm wide) thrusting out and down to y ≈ 296.
 */
export function shoulderHeadSDF() {
  const sd = (x, y, z) => {
    const wz = wallZ(y)
    // the face: a broad cushion lying on the slope, its back sunk in the wall
    let d = sdEllipsoid(x, y - 322, z - (wallZ(322) + 4), 23, 21, 12)
    d = Math.max(d, wz - 6 - z)
    // brow
    d = smin(d, sdRBox3(x, y - 331, z - (wallZ(331) + 9), 17, 3.5, 5, 3), 3)
    for (const sg of [-1, 1]) {
      // the horns: a FAT band arching up and out from the brow, rolling down and in at the sides (photo-34: the
      // crown of the head is two massive rounded horns)
      const hz = wallZ(338) + 7
      d = smin(d, sdTube(x, y, z, [[sg * 4, 338, hz + 1.5, 5.0], [sg * 11, 342.5, hz + 0.5, 5.6], [sg * 19, 341, hz - 1, 5.4], [sg * 23, 334, hz - 3, 4.6], [sg * 19.5, 328.5, hz - 1.5, 3.8], [sg * 15, 331.5, hz + 0.5, 2.8]]), 2.6)
      d = smax(d, -(Math.abs(len2(x - sg * 16.5, y - 335.5) - 5.0) - 0.45 + Math.max(0, hz + 3 - z)), 0.3) // a groove following the curl
      // eyes: round, bulging under the brow
      const ez = wallZ(325) + 12
      d = smin(d, len3(x - sg * 10.5, y - 325, (z - ez) * 1.15) - 4.0, 1.4)
      d = smax(d, -(len3(x - sg * 10.5, y - 325, z - ez - 3.6) - 1.3), 0.4) // pupil
    }
    // the snout: a heavy blunt block thrusting out and down, flat-fronted
    const sz = wallZ(306) + 17
    d = smin(d, sdRBox3(x, y - 305, z - sz, 13.5, 11.5, 9.5, 4.5), 4.5)
    for (const sg of [-1, 1]) d = smax(d, -(len3(x - sg * 6, y - 300, z - (sz + 9)) - 2.4), 0.6)
    d = smax(d, -smax(Math.abs(y - 296.2) - 0.7, Math.abs(x) - 11, 0.4), 0.4)
    return d
  }
  return { sd, bounds: { min: [-42, 286, 86], max: [42, 356, 160] } }
}

// ------------------------------------------------------------------ shoulder loop handle (+X)

/**
 * photo-34 right edge, photo-03: a beast head lies along the top of the handle, its snout pointing out (to x ≈ 162)
 * and a little down, two short horns standing up at its back; under it a round bar (≈ 11 mm thick) loops out and
 * down and runs back into the wall at y ≈ 303. The −X handle is this one turned 180° about Y.
 */
export function handleSDF() {
  const sd = (x, y, z) => {
    const W = bodyW(clamp(y, 280, 346))
    // the loop bar: from under the head's root, out and round, back into the wall
    let d = sdTube(x, y, z, [[W - 6, 333, 0, 5.6], [146, 334, 0, 5.8], [156, 327, 0, 6.0], [160, 315, 0, 6.0], [156, 302, 0, 5.8], [146, 295.5, 0, 5.6], [W - 6, 294.5, 0, 5.6]])
    // the head: lying along the loop's top, snout out and a little up (photo-34, photo-03)
    d = smin(d, sdEllipsoid(x - 143, y - 338, z, 19, 6.5, 9), 3)
    d = smin(d, sdRBox3(x - 158, y - 339, z, 6.5, 5, 6.5, 3.2), 2.5)
    for (const sg of [-1, 1]) {
      d = smin(d, sdTube(x, y, z, [[134, 342, sg * 5, 2.6], [130, 346, sg * 6.5, 2.0]]), 1.2) // ears / short horns
      d = smin(d, len3(x - 149, y - 341, z - sg * 6.5) - 2.1, 0.8) // eyes
    }
    d = smax(d, -(len3(x - 164, y - 339.5, z) - 2.1), 0.6)
    d = Math.max(d, W - 9 - x)
    return d
  }
  return { sd, bounds: { min: [118, 284, -16], max: [172, 352, 16] } }
}

// ------------------------------------------------------------------ low lug (front)

/**
 * photo-34 / photo-03: the low lug is a beast head hanging point-down on the centre blade. Its top edge stands
 * ≈ 17 mm out of the wall at y ≈ 86 (the lit lip photo-03 shows); above it the lug's hole is a dark opening into the
 * wall (y 86–100, a deep pocket in the front body panel, relief.js); the head tapers back into the wall to a point at
 * y ≈ 31: C horns at its top, small eyes, a nose ridge down the middle.
 */
export function lugSDF() {
  const zc = wallZ(91) - 2
  const zf = (y) => wallZ(y) + 2.5 + 15 * Math.pow(clamp((y - 31) / 53, 0, 1), 1.3)
  const hw = (y) => 17 * Math.pow(clamp((y - 31) / 53, 0, 1), 0.6)
  const sd = (x, y, z) => {
    let d = 1e9
    // the pendant head: a plate sloping back into the wall to its point
    const wz = wallZ(y)
    let pl = smax(Math.abs(x) - hw(y), z - zf(y), 1.6)
    pl = smax(pl, Math.max(31 - y, y - 86.5), 1.6)
    pl = Math.max(pl, wz - 3 - z)
    d = pl
    for (const sg of [-1, 1]) {
      d = smin(d, coil(x - sg * 9.5, y - 78.5, z - zf(78.5), 5.4, 1.1, 1.6), 0.6) // C horns
      d = smin(d, len3(x - sg * 6.5, y - 64.5, (z - zf(64.5)) * 1.4) - 2.6, 0.8) // eyes
    }
    d = smin(d, sdRBox3(x, y - 58, z - zf(58), 1.6, 15, 1.4, 0.8), 0.7) // nose ridge
    return d
  }
  return { sd, bounds: { min: [-23, 26, zc - 6], max: [23, 103, zc + 24] } }
}
