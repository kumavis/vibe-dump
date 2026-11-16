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
function sdEllipsoid(px, py, pz, rx, ry, rz) {
  const k0 = len3(px / rx, py / ry, pz / rz)
  const k1 = len3(px / (rx * rx), py / (ry * ry), pz / (rz * rz))
  return k1 > 1e-9 ? (k0 * (k0 - 1)) / k1 : -Math.min(rx, ry, rz)
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
const wallZ = (y) => RHO * bodyW(clamp(y, 0, 346))

/** a torus lying in the plane through c with unit normal n: major radius R, tube radius r */
function sdTorus(x, y, z, c, n, R, r) {
  const px = x - c[0], py = y - c[1], pz = z - c[2]
  const h = px * n[0] + py * n[1] + pz * n[2]
  const qx = px - h * n[0], qy = py - h * n[1], qz = pz - h * n[2]
  return len2(len3(qx, qy, qz) - R, h) - r
}
/** cheap seeded value noise (lattice hash, trilinear) in [-1, 1]: the corroded, knobbly skin of the cast heads */
function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z)
  const fx = x - xi, fy = y - yi, fz = z - zi
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy), uz = fz * fz * (3 - 2 * fz)
  const h = (i, j, k) => {
    let n = (i * 374761393 + j * 668265263 + k * 1274126177) | 0
    n = Math.imul(n ^ (n >>> 13), 1274126177)
    return ((n ^ (n >>> 16)) & 0xffff) / 32767.5 - 1
  }
  const l = (a, b, t) => a + (b - a) * t
  return l(l(l(h(xi, yi, zi), h(xi + 1, yi, zi), ux), l(h(xi, yi + 1, zi), h(xi + 1, yi + 1, zi), ux), uy),
    l(l(h(xi, yi, zi + 1), h(xi + 1, yi, zi + 1), ux), l(h(xi, yi + 1, zi + 1), h(xi + 1, yi + 1, zi + 1), ux), uy), uz)
}
const rough = (x, y, z, amp, f = 0.35) => amp * (0.65 * vnoise(x * f, y * f, z * f) + 0.35 * vnoise(x * f * 2.3 + 7, y * f * 2.3, z * f * 2.3))

// ------------------------------------------------------------------ shoulder head (front; back inferred)

/**
 * Round r8-dsk-fix, read off detail-head (photo-34 at ≈ 11 px/mm): a horned beast mask lying on the centre of the
 * shoulder, ≈ 58 mm across its crown. The crown is TWO FAT COILED HORNS (a thick rolled ring each, Ø ≈ 18 mm, centres
 * ±17 mm, y ≈ 334, a domed boss in each coil) joined over the brow; under them two round BULGING eyes (Ø ≈ 7 mm, ±10.5,
 * y 324.5) in rims under a heavy brow ridge; between and below them a short nose bridge and a big blunt, knobbly
 * SNOUT (≈ 27 mm wide) thrust out and down to y ≈ 297. The face plate under it all tapers from the crown to the snout
 * (a shield). The surface is corroded and lumpy (value noise, ≈ 0.6 mm).
 */
export function shoulderHeadSDF() {
  const sd = (x, y, z) => {
    const wz = wallZ(y)
    // shield-shaped face plate lying on the slope, back sunk in the wall
    const hwS = 12 + 15 * clamp((y - 302) / 32, 0, 1)
    let d = smax(Math.abs(x) - hwS, Math.abs(y - 321) - 15, 3)
    d = smax(d, z - (wz + 6.5 + 2 * Math.cos(x / 14)), 2)
    d = Math.max(d, wz - 6 - z)
    for (const sg of [-1, 1]) {
      // fat coiled horn: a rolled ring tipped back with the slope, a boss in its centre, a groove round the roll
      const hc = [sg * 17.5, 333.5, wallZ(333.5) + 8.5]
      const n = [sg * 0.12, 0.5, 0.86]
      const nl = len3(n[0], n[1], n[2])
      const nn = [n[0] / nl, n[1] / nl, n[2] / nl]
      d = smin(d, sdTorus(x, y, z, hc, nn, 5.6, 3.6), 1.4)
      d = smax(d, -(len3(x - hc[0], y - hc[1], z - hc[2] - 3.4) - 2.2), 0.6) // the coil's eye, sunk
      d = smin(d, len3(x - hc[0], y - hc[1], z - hc[2] - 0.5) - 3.0, 1.2)
      // eyes: round bulging domes in a raised rim, under the brow
      const ec = [sg * 10.5, 328, wallZ(328) + 10]
      d = smin(d, sdTorus(x, y, z, [ec[0], ec[1], ec[2] - 0.6], [0, 0.3, 0.954], 3.9, 1.3), 0.7)
      d = smax(d, -(len3(x - ec[0], y - ec[1], z - ec[2] + 0.6) - 3.3), 0.5) // the socket
      d = smin(d, len3(x - ec[0], y - ec[1], (z - ec[2]) * 1.2) - 2.7, 0.5)
    }
    // the crown: a fat band across the top joining the two horn coils (photo: one continuous rough crown)
    d = smin(d, sdTube(x, y, z, [[-12, 339.5, wallZ(339.5) + 6.5, 3.2], [0, 340.5, wallZ(340.5) + 7, 3.5], [12, 339.5, wallZ(339.5) + 6.5, 3.2]]), 2.5)
    // heavy brow ridge across under the horns
    d = smin(d, sdTube(x, y, z, [[-14, 332.5, wallZ(332.5) + 9, 2.6], [0, 333.5, wallZ(333.5) + 10, 3.0], [14, 332.5, wallZ(332.5) + 9, 2.6]]), 2.5)
    // nose bridge from the brow down to the snout
    d = smin(d, sdTube(x, y, z, [[0, 329, wallZ(329) + 11, 4.0], [0, 316, wallZ(316) + 14, 5.8]]), 3)
    // the snout: a big blunt bulb thrust out and down
    const sz = wallZ(310.5) + 14.5
    d = smin(d, sdEllipsoid(x, y - 310.5, z - sz, 13.4, 8.6, 9.5), 4)
    // nostrils and the mouth line under the snout
    for (const sg of [-1, 1]) d = smax(d, -(len3(x - sg * 5.5, y - 307, z - (sz + 8.4)) - 1.4), 0.8)
    d = smax(d, -smax(Math.abs(y - 303) - 0.8, Math.abs(x) - 9.5, 0.5), 0.5)
    // a corroded, knobbly skin
    d += rough(x, y, z, 0.75, 0.3)
    return d
  }
  return { sd, bounds: { min: [-36, 290, 90], max: [36, 348, 160] } }
}

// ------------------------------------------------------------------ shoulder loop handle (+X)

/**
 * Round r8-dsk-fix, read off detail-handle (photo-34) and photo-03: a SLENDER round bar (Ø ≈ 10 mm) loops out from
 * under the beast head and down, and runs back into the wall; the head lies along the top of the loop, LONG and
 * snouted (≈ 30 mm), its flat brow rising to a raised horn at the back, the snout pointing out to x ≈ 153 and a
 * little down. Top ≈ y 331 (the first reading stood 14 mm too high and 9 mm too far out). −X: this one turned 180°.
 */
export function handleSDF() {
  const sd = (X, Y, z) => {
    // authored 3 mm higher and 0.5 mm further in than it stands (re-measured against detail-handle, photo-34)
    const x = X - 0.5, y = Y + 3
    const W = bodyW(clamp(Y, 270, 346)) - 0.5
    // the loop bar
    let d = sdTube(x, y, z, [[W - 6, 319, 0, 4.6], [143, 318, 0, 4.8], [150.5, 311, 0, 5.0], [152, 300, 0, 5.0], [148.5, 289, 0, 4.9], [141, 283, 0, 4.8], [W - 6, 280, 0, 4.6]])
    // the head: a long low skull along the loop's top, the snout out at x ≈ 153
    d = smin(d, sdEllipsoid(x - 139, y - 323.5, z, 14, 5.2, 7.2), 2.5)
    d = smin(d, sdTube(x, y, z, [[140, 323.5, 0, 5.0], [151.5, 321.5, 0, 4.1]]), 2.2)
    d = smin(d, len3(x - 152.2, y - 321, z) - 4.0, 1.5)
    // the raised horn at the back of the head
    d = smin(d, sdTube(x, y, z, [[131, 326, 0, 3.4], [128.5, 331.5, 0, 2.6], [131.5, 333, 0, 1.8]]), 1.8)
    for (const sg of [-1, 1]) {
      d = smin(d, len3(x - 143.5, y - 325.5, z - sg * 5.3) - 2.0, 0.8) // eyes
      d = smax(d, -(len3(x - 151, y - 324.5, z - sg * 3.3) - 1.0), 0.4) // nostrils
    }
    d = smax(d, -smax(Math.abs(y - 319.6) - 0.5, Math.abs(x - 150) - 4, 0.3), 0.3) // mouth line
    d += rough(x, y, z, 0.3, 0.25)
    d = Math.max(d, W - 9 - x)
    return d
  }
  return { sd, bounds: { min: [118, 268, -14], max: [164, 336, 14] } }
}

// ------------------------------------------------------------------ low lug (front)

/**
 * Round r8-dsk-fix, read off detail-lug (photo-34): under the black opening (a 13 mm pocket in the front body panel,
 * relief.js) hangs a rounded SHIELD-shaped beast head, ≈ 36 mm across its U-shaped top at y ≈ 86, tapering to a point
 * at y ≈ 31. Its top stands ≈ 9 mm out of the wall and curves back into it at the point (no shelf). On it: a raised
 * rim round the U, two ARCHING C-horns over the brow, small round eyes, a nose ridge down the middle.
 */
export function lugSDF() {
  const zc = wallZ(91) - 2
  const T = (y) => clamp((y - 31) / 55, 0, 1)
  const zf = (y) => wallZ(y) + 1.2 + 8 * Math.pow(T(y), 1.1)
  const hw = (y) => 16.5 * Math.sqrt(T(y)) * (1 - 0.35 * Math.pow(clamp((y - 78) / 8.5, 0, 1), 2.2))
  const sd = (x, y, z) => {
    const wz = wallZ(y)
    // the pendant: a domed shield sloping back into the wall to its point; the U top rounded over
    const dome = zf(y) + 1.6 * (1 - Math.pow(Math.abs(x) / Math.max(1, hw(y)), 2))
    let d = smax(Math.abs(x) - hw(y), z - dome, 1.6)
    d = smax(d, Math.max(31 - y, y - 86.5), 2.2)
    d = Math.max(d, wz - 3 - z)
    const zs = (yy, xx = 0) => zf(yy) + 1.6 * (1 - Math.pow(Math.abs(xx) / Math.max(1, hw(yy)), 2))
    // rim round the top
    d = smin(d, sdTube(x, y, z, [[-14.5, 80, zs(80, 14.5), 1.3], [-11, 84.6, zs(84.6, 11), 1.3], [0, 85.4, zs(85.4), 1.3], [11, 84.6, zs(84.6, 11), 1.3], [14.5, 80, zs(80, 14.5), 1.3]]), 0.6)
    for (const sg of [-1, 1]) {
      // arching C-horns: a band from the centre up and out, curling down at the side
      d = smin(d, len3(x - sg * 6.2, y - 66, (z - zs(66, 6.2)) * 1.4) - 2.4, 0.7) // eyes
      d = smin(d, sdTube(x, y, z, [[sg * 3, 57, zs(57, 3), 1.0], [sg * 8, 62, zs(62, 8), 1.0]]), 0.5) // cheek hooks
    }
    // the arching C-horns (photo): a FAT ∪ crescent under the U top, raised ≈ 1.3 mm, its inner edge rising to the corners
    {
      const cres = Math.max(len2(x, (y - 88) * 1.05) - 15.8, -(len2(x, (y - 91.5) * 1.15) - 11.2), y - 84.2)
      const top = zs(clamp(y, 31, 86), Math.min(Math.abs(x), 15))
      d = smin(d, Math.max(cres, z - (top + 1.3), top - 2.5 - z), 0.5)
      d = smax(d, -Math.max(Math.abs(len2(x, (y - 88) * 1.05) - 13.3) - 0.35, -cres - 0.2, z - top - 2), 0.2) // a groove along it
    }
    d = smin(d, sdTube(x, y, z, [[0, 74, zs(74) + 0.3, 1.5], [0, 40, zs(40) + 0.2, 1.1]]), 0.7) // nose ridge
    d += rough(x, y, z, 0.25, 0.5)
    return d
  }
  return { sd, bounds: { min: [-23, 26, zc - 6], max: [23, 92, zc + 18] } }
}
