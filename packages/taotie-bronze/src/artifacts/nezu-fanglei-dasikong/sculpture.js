// nezu-fanglei-dasikong — the cast sculpture (dossier §b.5): the two shoulder loop handles with beast heads (±X),
// the horned head at the centre of the front (and, inferred, back) shoulder, and the bridge of the low lug on the
// front (its pendant mask is relief on the body panel). Signed distance fields in VESSEL mm (Y up, front +Z),
// meshed with kit.meshSDF. Read off photo-34 (front) and photo-03 (front-left, higher).

import * as THREE from 'three'
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

/** 2D ellipse, approximate signed distance (iq) */
function sdEllipse2(px, py, rx, ry) {
  const k0 = len2(px / rx, py / ry)
  const k1 = len2(px / (rx * rx), py / (ry * ry))
  return k1 > 1e-9 ? (k0 * (k0 - 1)) / k1 : -Math.min(rx, ry)
}
/** 2D capsule from a to b, radius r */
function sdSeg2(px, py, ax, ay, bx, by, r) {
  const qx = px - ax, qy = py - ay, ux = bx - ax, uy = by - ay
  const h = clamp((qx * ux + qy * uy) / (ux * ux + uy * uy), 0, 1)
  return len2(qx - ux * h, qy - uy * h) - r
}
/** 2D C-ring: an annulus (radius R, half width w) open over the sector centred on angle `gap` (rad), half-angle `ga` */
function sdCurl2(px, py, cx, cy, R, w, gap, ga) {
  const dx = px - cx, dy = py - cy
  const ring = Math.abs(len2(dx, dy) - R) - w
  const a = Math.atan2(dy, dx) - gap
  const da = Math.abs(Math.atan2(Math.sin(a), Math.cos(a)))
  // outside the gap the ring; inside it, distance to the ring's cut ends
  if (da > ga) return ring
  const e1 = [cx + R * Math.cos(gap + ga), cy + R * Math.sin(gap + ga)], e2 = [cx + R * Math.cos(gap - ga), cy + R * Math.sin(gap - ga)]
  return Math.min(len2(px - e1[0], py - e1[1]), len2(px - e2[0], py - e2[1])) - w
}

/**
 * Round dsk-lug, re-read off photo-34 and photo-03 at full resolution (.work/dsk-lug): there is NO hole in the wall.
 * The dark patch above the head is the shade of a LOOP standing out of the wall and the gap behind the head it
 * carries: its upper edge is soft (a terminator rolling round the loop's top, lit and green above it — the plain
 * patch the photographs show between the blade's border strips), its lower edge is the head's crisp top; in photo-03
 * (camera further right and higher) the band shrinks and a dark crevice opens behind the head's right cheek, and
 * the head overlaps the blade's border strips, which run on behind it — the head stands ≈ 9 mm off the wall, its
 * face ≈ 18–21 mm out.
 *
 * Built in a frame sheared onto the wall: (x, y, w = z − wallZ(y)), w = depth out of the wall (the wall here leans
 * back ≈ 16° as it descends; the error of the shear on distances is < 4 %).
 *  - the LOOP: a half ring standing on the wall, axis along x (the rope runs sideways), centre y 91, centre-line
 *    radius 10, a rounded strap ≈ 14 mm wide × 6.4 mm thick; it springs from the wall at y ≈ 104 and returns into it
 *    behind the head at y ≈ 78; its outer face stands 13 mm out.
 *  - the HEAD on the loop's lower front: ≈ 32 mm across its round top (y 84.5), tapering to a blunt muzzle and chin
 *    at y ≈ 37; a convex dome (back ≈ 9 mm, face to 20.5 mm out). A broad ∩ CRESCENT of horns over the top, cut with
 *    short strokes, a panel of small hooks inside it; the horns' inner ends sweep down into a stem; a lozenge on the
 *    brow, curled side ears, round domed eyes with curled lids set wide, curled nostril scrolls, a blunt muzzle.
 *  - a 1 mm root PAD on the wall behind the head and under the loop (the loop's cast root) — it carries the per-vertex
 *    cavity (lugCavity) that darkens the gap, as an occlusion term the plain wall panel cannot have.
 */
export function lugSDF() {
  const YC = 90, RL = 9.5, TL = 2.8, XL = 15.6 // loop: centre, centre-line radius, half thickness, half width
  const back = (x, y) => 9.5 - 2 * clamp((66 - y) / 26, 0, 1) + 1.5 * Math.min(1, (x / 15) ** 2)
  // the head's front surface (w): a dome rolling back over the top and in to the chin; the muzzle's bulge
  const S = (x, y) => {
    const dy = y - 60, L = dy > 0 ? 31 : 24
    const g = Math.sqrt(Math.max(0, 1 - (x / 18.5) ** 2 - (dy / L) ** 2))
    return 9.5 + 11 * g + 1.3 * Math.exp(-((x / 7) ** 2) - ((y - 43) / 4) ** 2)
  }
  const hwAt = (y) => (y > 62 ? 12 + 3.6 * clamp((y - 62) / 4.5, 0, 1) : 8 + 4 * Math.pow(clamp((y - 44) / 18, 0, 1), 0.85))
  const outline = (x, y) => {
    const top = sdEllipse2(x, y - 70, 16.2, 14.5)
    const mid = Math.max((Math.abs(x) - hwAt(y)) * 0.95, y - 68, 45 - y)
    const chin = sdEllipse2(x, y - 46.5, 8.0, 7.5)
    return smin(Math.max(top, 62 - y), smin(mid, chin, 2.5), 2.5)
  }
  const sd = (x, y, z) => {
    const w = z - wallZ(y)
    const ax = Math.abs(x)
    // ---- the loop: a broad strap arched out of the wall, grooves along both edges of its outer face
    const rr = len2(y - YC, w) - RL
    const qx = ax - XL + 2.0, qr = Math.abs(rr) - TL + 1.6
    let d = len2(Math.max(qx, 0), Math.max(qr, 0)) + Math.min(Math.max(qx, qr), 0) - 1.8
    if (d < 1.5 && rr > 0) for (const gx of [10.6, 12.6]) d = smax(d, -len2(ax - gx, rr - TL - 0.15) + 0.5, 0.3)
    // ---- the head
    const s0 = S(x, y), wb = back(x, y)
    let h = smax(smax(outline(x, y), w - s0, 2.6), wb - w, 1.6)
    const raise = (f, ht, k = 0.5) => { h = smin(h, Math.max(f, w - (s0 + ht), wb + 1 - w), k) }
    const cut = (f, base, depth, k = 0.25) => { h = smax(h, -Math.max(f, base - depth - w), k) }
    // horn crescent: a broad ∩ band along the top, its arms down to y ≈ 66
    const eOut = sdEllipse2(x, y - 70, 16.2, 14.5), eIn = sdEllipse2(x, y - 73.5, 10.6, 8.6)
    const cres = Math.max(eOut + 0.6, -eIn, 65.8 - y)
    raise(cres, 1.6, 0.6)
    // the horns' inner ends sweep down into a stem on the axis
    const stem = Math.min(sdSeg2(ax, y, 10.0, 67.0, 1.2, 62.0, 1.2), sdSeg2(ax, y, 0, 72, 0, 60.8, 0.95))
    raise(stem, 1.3, 0.6)
    // short strokes across the horn arms
    if (cres < 1) {
      let st = Infinity
      for (const t of [-0.45, -0.17, 0.11, 0.39]) {
        const c = Math.cos(t), sn = Math.sin(t)
        const px = 13.4 * c, py = 71.6 + 11.6 * sn
        const nx = c / 13.4, ny = sn / 11.6, nl = len2(nx, ny)
        st = Math.min(st, sdSeg2(ax, y, px - (nx / nl) * 1.4, py - (ny / nl) * 1.4, px + (nx / nl) * 1.1, py + (ny / nl) * 1.1, 0.33))
      }
      cut(st, s0 + 1.6, 0.55)
    }
    // the panel inside the crescent: small hooks incised on it
    if (eIn < 1) {
      const hook = Math.min(
        sdCurl2(ax, y, 3.4, 78.4, 1.6, 0.3, -2.4, 0.9), sdCurl2(ax, y, 6.9, 74.6, 1.5, 0.3, -0.7, 0.9),
        sdSeg2(ax, y, 0, 81, 0, 72, 0.3), sdSeg2(ax, y, 1.4, 81.2, 5.2, 81.0, 0.3), sdSeg2(ax, y, 5.2, 78.0, 8.2, 78.8, 0.3))
      cut(hook, s0, 0.5)
    }
    // lozenge on the brow
    raise((ax + Math.abs(y - 57.6) - 2.9) * 0.707, 1.4, 0.5)
    cut(len2(x, y - 57.6) - 0.75, s0 + 1.4, 0.5)
    // eyes: round domes set wide, in curled lids whose tails flick up and out
    const ex = 6.6, ey = 51.8
    const lid = Math.min(sdCurl2(ax, y, ex, ey, 3.0, 0.55, -2.2, 0.55), sdSeg2(ax, y, ex + 2.6, ey + 1.4, ex + 4.0, ey + 4.0, 0.55))
    raise(lid, 1.1, 0.45)
    h = smin(h, sdEllipsoid(ax - ex, y - ey, w - (S(ex, ey) + 0.3), 2.2, 2.1, 1.9), 0.5)
    // nostril scrolls on the muzzle and a mouth line under it
    raise(sdCurl2(ax, y, 3.7, 44.6, 1.6, 0.5, -1.2, 0.75), 0.9, 0.35)
    cut(Math.max(Math.abs(y - 40.6 - 0.03 * x * x) - 0.35, ax - 5.2), s0, 0.7)
    // curled side ears tucked under the horn tips
    raise(sdCurl2(ax, y, 13.6, 62.4, 1.9, 0.6, 2.6, 0.7), 1.0, 0.45)
    h += rough(x, y, z, 0.12, 0.6)
    d = smin(d, h, 1.0)
    // embedded 2.5 mm in the wall, no deeper
    return Math.max(d, -2.5 - w)
  }
  return { sd, bounds: { min: [-20, 35, 84], max: [20, 106, 114.5] } }
}

/**
 * Per-vertex `cavity` (0 recess → 1 exposed) for a mesh of `sdf` standing on the front wall: occlusion sampled along
 * each vertex normal and two tilted rays against the solid AND the wall (z = wallZ(y)). For a PatinaMaterial with
 * `cavityAttribute: true`: the gap behind the lug's head, the loop's underside and the root pad go dark by themselves.
 */
export function lugCavity(geo, sdf) {
  const P = geo.attributes.position.array, N = geo.attributes.normal.array
  const occ = (x, y, z) => Math.min(sdf.sd(x, y, z), (z - wallZ(y)) * 0.96)
  const cav = new Float32Array(P.length / 3)
  const steps = [1.5, 3.5, 7, 11.5]
  for (let i = 0, v = 0; i < P.length; i += 3, v++) {
    const x = P[i], y = P[i + 1], z = P[i + 2]
    let o = 0, wsum = 0
    for (const [tx, ty] of [[0, 0], [0, 0.5], [0, -0.5]]) {
      let nx = N[i] + tx, ny = N[i + 1] + ty, nz = N[i + 2]
      const l = len3(nx, ny, nz); nx /= l; ny /= l; nz /= l
      for (const s of steps) {
        const d = occ(x + nx * s, y + ny * s, z + nz * s)
        o += Math.max(0, (s - d) / s) * (1 / s ** 0.3); wsum += 1 / s ** 0.3
      }
    }
    cav[v] = clamp(1 - 1.6 * (o / wsum), 0, 1)
  }
  geo.setAttribute('cavity', new THREE.BufferAttribute(cav, 1))
  return geo
}
