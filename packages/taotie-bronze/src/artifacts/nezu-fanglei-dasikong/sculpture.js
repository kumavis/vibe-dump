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

/** rounded box, half sizes b, corner radius r */
function sdRBox3(px, py, pz, bx, by, bz, r) {
  const qx = Math.abs(px) - bx + r, qy = Math.abs(py) - by + r, qz = Math.abs(pz) - bz + r
  return len3(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - r
}

/**
 * Round dsk-lug (after r8-dsk-fix; reviewers: "should be a short squared snout ending above the boss row … with crisp
 * curled horns"), read off detail-head and the photo-34 / photo-03 crops: a horned beast mask on the centre of the
 * shoulder, ≈ 56 mm across its crown. The crown is TWO COILED HORNS (a rolled ring each, Ø ≈ 18 mm, centres ±17.5 mm,
 * y ≈ 333, a spiral groove running into the coil) joined over the brow; under them two round BULGING eyes (±10,
 * y 327.5) in rims; between them the SNOUT: a short SQUARED block ≈ 23 mm wide, its front face flat and near vertical,
 * ≈ 14 mm proud, ending in a flat underside at y ≈ 312 — clear above the whorl-boss band (top 306.5) — with two
 * nostrils and a lip line low on its front. The surface is corroded (value noise, ≈ 0.3 mm), not lumpy.
 */
export function shoulderHeadSDF() {
  const sd = (x, y, z) => {
    const wz = wallZ(y)
    // shield-shaped face plate lying on the slope, back sunk in the wall
    const hwS = 12 + 15 * clamp((y - 310) / 26, 0, 1)
    let d = smax(Math.abs(x) - hwS, Math.abs(y - 325) - 14, 3)
    d = smax(d, z - (wz + 6 + 2 * Math.cos(x / 14)), 2)
    d = Math.max(d, wz - 6 - z)
    for (const sg of [-1, 1]) {
      // coiled horn: a rolled ring tipped back with the slope, a spiral groove winding into its sunk eye
      const hc = [sg * 17.5, 333, wallZ(333) + 8.5]
      const n = [sg * 0.12, 0.5, 0.86]
      const nl = len3(n[0], n[1], n[2])
      const nn = [n[0] / nl, n[1] / nl, n[2] / nl]
      d = smin(d, sdTorus(x, y, z, hc, nn, 5.4, 3.7), 1.0)
      d = smin(d, len3(x - hc[0], y - hc[1], z - hc[2] - 0.6) - 3.2, 0.8) // the coil's core
      {
        // spiral groove on the coil's face: radius growing with the angle round the coil (in its plane)
        const px = x - hc[0], py = y - hc[1], pz = z - hc[2]
        const h = px * nn[0] + py * nn[1] + pz * nn[2]
        const ux = sg, uy = 0, uz = 0 // in-plane axes (approximate: x and the slope direction)
        const vx = 0, vy = nn[2], vz = -nn[1]
        const a = px * ux + py * uy + pz * uz, b = px * vx + py * vy + pz * vz
        const r = len2(a, b), th = Math.atan2(b, a) + Math.PI
        const pitch = 2.6
        const k = Math.round((r - 1.4 - (pitch * th) / (2 * Math.PI)) / pitch)
        const rs = 1.4 + (pitch * th) / (2 * Math.PI) + k * pitch
        const hs = Math.max(Math.sqrt(Math.max(0, 13.7 - (r - 5.4) ** 2)), 3.8 - (r * r) / 7) // the coil's face height
        if (r < 9.6 && h > 1) d = smax(d, -(len2(r - rs, h - hs - 0.2) - 0.6), 0.3)
      }
      // eyes: round bulging domes in a raised rim, under the horns
      const ec = [sg * 10, 327.5, wallZ(327.5) + 10]
      d = smin(d, sdTorus(x, y, z, [ec[0], ec[1], ec[2] - 0.6], [0, 0.3, 0.954], 3.6, 1.2), 0.6)
      d = smax(d, -(len3(x - ec[0], y - ec[1], z - ec[2] + 0.6) - 3.0), 0.4) // the socket
      d = smin(d, len3(x - ec[0], y - ec[1], (z - ec[2]) * 1.2) - 2.6, 0.4)
    }
    // the crown: a band across the top joining the two coils
    d = smin(d, sdTube(x, y, z, [[-12, 339, wallZ(339) + 6, 2.8], [0, 340, wallZ(340) + 6.5, 3.1], [12, 339, wallZ(339) + 6, 2.8]]), 2.0)
    // brow ridge under the horns, running into the snout's top
    d = smin(d, sdTube(x, y, z, [[-13, 332, wallZ(332) + 8.5, 2.2], [0, 332.5, wallZ(332.5) + 9.5, 2.6], [13, 332, wallZ(332) + 8.5, 2.2]]), 2.0)
    // the snout: a short squared block, flat near-vertical front (z ≈ 136.5), flat underside at y ≈ 312
    const zb = 118, zf = 136.5 - 0.12 * (y - 312)
    const hwSn = 10.6 + 1.2 * clamp((326 - y) / 14, 0, 1)
    let sn = sdRBox3(x / (hwSn / 11.5), y - 319.5, z - (zb + zf) / 2, 11.5, 7.5, (zf - zb) / 2, 3.2)
    d = smin(d, sn, 2.2)
    // nostrils and the lip line on the snout's front, low
    const zF = zf
    for (const sg of [-1, 1]) d = smax(d, -(sdEllipsoid(x - sg * 5, y - 316, z - zF, 2.0, 1.4, 1.6)), 0.5)
    d = smax(d, -Math.max(Math.abs(y - 313.4) - 0.45, Math.abs(x) - 8.5, zF - 1.0 - z), 0.3)
    // a corroded skin
    d += rough(x, y, z, 0.32, 0.35)
    return d
  }
  return { sd, bounds: { min: [-31, 305, 96.5], max: [31, 348, 140] } }
}

// ------------------------------------------------------------------ shoulder loop handle (+X)

/**
 * Round dsk-lug, re-read off photo-34 (full-resolution crop of the +X handle) and photo-03: the head is a LONG, narrow
 * beast head lying along the top of the handle — its skull springs from the shoulder at x ≈ 125, its top line runs
 * nearly level (y ≈ 331 → 329) out to a blunt, squarish SNOUT ending in a flat front at x ≈ 160 (mouth line low on it,
 * two nostrils); a pair of pointed EARS rise and lean back from the crown at x ≈ 136 (the "horn" the photographs show
 * at the back of the head); round eyes at x ≈ 147. Out of the underside of the jaw a round BAR (Ø ≈ 10 mm) drops,
 * swelling outward to x ≈ 158 at y ≈ 302, and curves back into the wall at y ≈ 279. −X: this one turned 180°.
 */
export function handleSDF() {
  const sd = (x, y, z) => {
    const W = bodyW(clamp(y, 270, 346)) - 0.5
    // the bar
    let d = sdTube(x, y, z, [[147, 321, 0, 4.6], [154.5, 313, 0, 5.0], [157.4, 302, 0, 5.2], [155.5, 290.5, 0, 5.0], [148.5, 282.5, 0, 4.8], [W - 6, 279, 0, 4.6]])
    // the skull: a long rounded block tapering toward the snout
    const f = clamp((x - 125) / 35, 0, 1)
    const hy = 5.6 - 1.0 * f, hz = 6.0 - 1.2 * f
    d = smin(d, sdRBox3(x - 141, (y - (326 - 0.6 * f)) * (5.6 / hy), z * (6 / hz), 17, 5.6, 6, 3.4), 1.6)
    // the snout: a blunt squarish block, flat front at x ≈ 160
    d = smin(d, sdRBox3(x - 154.5, y - 324.6, z, 6.2, 4.4, 4.6, 2.4), 1.4)
    for (const sg of [-1, 1]) {
      // pointed ears rising and leaning back from the crown
      d = smin(d, sdTube(x, y, z, [[136, 330, sg * 3.4, 2.2], [134.5, 334.5, sg * 3.0, 1.2], [133.2, 337.2, sg * 2.6, 0.45]]), 1.2)
      d = smin(d, sdEllipsoid(x - 147, y - 327.6, z - sg * 5.0, 1.9, 1.7, 1.3), 0.5) // eyes
      d = smax(d, -sdEllipsoid(x - 160.6, y - 325.2, z - sg * 2.2, 1.2, 1.0, 1.0), 0.4) // nostrils
    }
    // brow ridge over the eyes
    d = smin(d, sdTube(x, y, z, [[143, 329.8, -4.6, 1.1], [149, 329.6, 0, 1.2], [143, 329.8, 4.6, 1.1]]), 1.0)
    // the mouth line along the snout's underside
    d = smax(d, -Math.max(Math.abs(y - 321.6) - 0.4, Math.abs(x - 156.5) - 4.5), 0.3)
    d += rough(x, y, z, 0.28, 0.25)
    d = Math.max(d, W - 9 - x)
    return d
  }
  return { sd, bounds: { min: [120, 270.5, -9.8], max: [166, 341, 9.8] } }
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
 * The dark patch above the head is the shadowed gap behind a head that stands well out from the wall on a loop: its
 * lower edge is crisp (the head's top), its upper edge soft (shadow, not a rim), fading into a plain lit patch; in
 * photo-03 (camera further right and higher) the band changes size and a dark crevice opens behind the head's right
 * cheek, and in both photographs the blade's border strips run on behind the head's flanks — the head stands ≈ 10–15 mm
 * off the wall (± 50 %), its face ≈ 20 mm out. The photographs cannot strictly tell a loop from a solid stalk; a loop
 * is the type's norm (and the sister nezu-fanglei's), so a loop is built.
 *
 * Built in a frame sheared onto the wall: (x, y, w = z − wallZ(y)), w = depth out of the wall (the wall here leans
 * back ≈ 16° as it descends; the error of the shear on distances is < 4 %).
 *  - the LOOP: a ring standing on the wall, axis along x (the rope runs sideways), centre y 78, centre-line radius 9,
 *    ≈ 13 mm wide × 6.6 mm thick; it springs from the wall at y ≈ 90, just above the head's top, swings out to 12 mm
 *    and returns into the wall behind the head at y ≈ 66. Seen from the side it is the head's carrier; from the front
 *    the head hides it.
 *  - the HEAD on the ring's outer face: ≈ 32 mm across its round top (y 84.5), tapering to a blunt muzzle and chin
 *    at y ≈ 39; a convex dome, its back 12 mm off the wall (10 at the chin), its face 20 mm (top) to 22.5 mm (brow) out.
 *    A broad ∩ CRESCENT of horns over the top, cut with short strokes, a panel of small hooks inside it; the horns'
 *    inner ends sweep down into a stem; a lozenge on the brow, curled side ears, round domed eyes in curled lids set
 *    wide, curled nostril scrolls, a blunt muzzle with a mouth line.
 *  - a ≤ 0.7 mm root PAD on the wall behind the head (flush at its edges): the floor of the gap. The dark patch is
 *    what a camera above the head's top sees of that gap — in the head's cast shadow, and darkened by the per-vertex
 *    cavity (lugCavity) that the plain wall panel cannot carry.
 */
export function lugSDF() {
  const YC = 66, RL = 9, TL = 3.3, XL = 6.4 // loop: centre, centre-line radius, half thickness, half width
  // the back: 12 mm off the wall, leaning forward under the crown so the top is a thin crest with the gap open behind it
  const back = (x, y) => 12 - 2 * clamp((52 - y) / 13, 0, 1) + 3.5 * clamp((y - 74) / 10, 0, 1) * Math.max(0, 1 - (x / 17) ** 2) + 1.3 * Math.min(1, (x / 15) ** 2)
  // the head's front surface (w): a dome rolling back over the top and in to the chin; the muzzle's bulge
  const S = (x, y) => {
    const dy = y - 58, L = dy > 0 ? 40 : 24
    const g = Math.sqrt(Math.max(0, 1 - (x / 18.5) ** 2 - (dy / L) ** 2))
    return 12 - 2 * clamp((52 - y) / 13, 0, 1) + 10.5 * g + 1.3 * Math.exp(-((x / 6.5) ** 2) - ((y - 42) / 4) ** 2)
  }
  const hwAt = (y) => (y > 62 ? 12 + 3.6 * clamp((y - 62) / 4.5, 0, 1) : 7 + 5 * Math.pow(clamp((y - 44) / 18, 0, 1), 0.85))
  const outline = (x, y) => {
    const top = sdEllipse2(x, y - 70, 16.2, 14.5)
    const mid = Math.max((Math.abs(x) - hwAt(y)) * 0.95, y - 68, 45 - y)
    const chin = sdEllipse2(x, y - 44, 7.0, 7.5)
    return smin(Math.max(top, 62 - y), smin(mid, chin, 2.5), 2.5)
  }
  const sd = (x, y, z) => {
    const w = z - wallZ(y)
    const ax = Math.abs(x)
    // ---- the loop: a ring springing from the wall just above the head's top and returning into it behind the head,
    //      the rope's way running sideways through it; the head rides on its outer face
    const rr = len2(y - YC, w) - RL
    const qx = ax - XL + 2.0, qr = Math.abs(rr) - TL + 1.6
    let d = len2(Math.max(qx, 0), Math.max(qr, 0)) + Math.min(Math.max(qx, qr), 0) - 1.8
    // ---- the root pad on the wall behind the head: the floor of the gap, flush at its edges (it carries the occlusion)
    {
      const e = Math.max(ax / 13.5, Math.abs(y - 70) / 18)
      d = Math.min(d, Math.max(ax - 13.5, Math.abs(y - 70) - 18, w - (0.7 - 1.2 * e * e)))
    }
    // ---- the head
    const s0 = S(x, y), wb = back(x, y)
    let h = smax(smax(outline(x, y), w - s0, 2.2), wb - w, 1.0)
    const raise = (f, ht, k = 0.5) => { h = smin(h, Math.max(f, w - (s0 + ht), wb + 1 - w), k) }
    const cut = (f, base, depth, k = 0.25) => { h = smax(h, -Math.max(f, base - depth - w), k) }
    // horn crescent: a broad ∩ band along the top, its arms down to y ≈ 66
    const eOut = sdEllipse2(x, y - 70, 16.2, 14.5), eIn = sdEllipse2(x, y - 76, 8.4, 6.6)
    // between the arms, under the panel, a V opens down to the stem: the horns are two arms, not a cap
    const wedge = Math.max(ax - (1.4 + (y - 62) * 0.5), y - 72)
    const cres = Math.max(eOut + 0.6, -Math.min(eIn, wedge), 65.8 - y)
    raise(cres, 1.6, 0.6)
    // the horns' inner ends sweep down into a stem on the axis
    const stem = Math.min(sdSeg2(ax, y, 8.5, 68.5, 1.2, 62.0, 1.3), sdSeg2(ax, y, 0, 70, 0, 60.8, 1.0))
    raise(stem, 1.3, 0.6)
    // short strokes across the horn arms
    if (cres < 1) {
      let st = Infinity
      for (const t of [-0.45, -0.17, 0.11, 0.39]) {
        const c = Math.cos(t), sn = Math.sin(t)
        const px = 12.6 * c, py = 71.6 + 11.0 * sn
        const nx = c / 12.6, ny = sn / 11.0, nl = len2(nx, ny)
        st = Math.min(st, sdSeg2(ax, y, px - (nx / nl) * 1.4, py - (ny / nl) * 1.4, px + (nx / nl) * 1.1, py + (ny / nl) * 1.1, 0.33))
      }
      cut(st, s0 + 1.6, 0.55)
    }
    // the panel inside the crescent: small hooks incised on it
    if (eIn < 1) {
      const hook = Math.min(
        sdCurl2(ax, y, 3.0, 79.0, 1.3, 0.28, -2.4, 0.9), sdCurl2(ax, y, 5.6, 76.0, 1.2, 0.28, -0.7, 0.9),
        sdSeg2(ax, y, 0, 81.5, 0, 72, 0.28), sdSeg2(ax, y, 1.2, 81.4, 4.4, 81.0, 0.28))
      cut(hook, s0, 0.5)
    }
    // lozenge on the brow
    raise((ax + Math.abs(y - 57.6) - 2.9) * 0.707, 1.4, 0.5)
    cut(len2(x, y - 57.6) - 0.75, s0 + 1.4, 0.5)
    // eyes: round domes set wide, in curled lids whose tails flick up and out
    const ex = 6.0, ey = 51.6
    const lid = Math.min(sdCurl2(ax, y, ex, ey, 2.7, 0.5, -2.2, 0.55), sdSeg2(ax, y, ex + 2.3, ey + 1.3, ex + 3.8, ey + 4.0, 0.5))
    raise(lid, 1.1, 0.45)
    h = smin(h, sdEllipsoid(ax - ex, y - ey, w - (S(ex, ey) + 0.3), 2.0, 1.9, 1.8), 0.5)
    // nostril scrolls on the muzzle and a mouth line under it
    raise(sdCurl2(ax, y, 3.3, 43.6, 1.5, 0.48, -1.2, 0.75), 0.9, 0.35)
    cut(Math.max(Math.abs(y - 39.4 - 0.03 * x * x) - 0.35, ax - 4.6), s0, 0.7)
    // curled side ears tucked under the horn tips
    raise(sdCurl2(ax, y, 13.6, 62.4, 1.9, 0.6, 2.6, 0.7), 1.0, 0.45)
    h += rough(x, y, z, 0.12, 0.6)
    d = smin(d, h, 2.0)
    // embedded 2.5 mm in the wall, no deeper
    return Math.max(d, -2.5 - w)
  }
  // a cheap stand-in for occlusion rays (lugCavity): the loop and the head's bare dome, no décor
  const proxy = (x, y, z) => {
    const w = z - wallZ(y), ax = Math.abs(x)
    const rr = len2(y - YC, w) - RL
    const ring = Math.max(ax - XL, Math.abs(rr) - TL)
    const head = Math.max(outline(x, y), w - S(x, y), back(x, y) - w)
    return Math.min(ring, head) + 1.2 // shrunk: the décor and the soft unions stand proud of it
  }
  return { sd, proxy, bounds: { min: [-20, 32.5, 77], max: [20, 92, 118] } }
}

/**
 * Per-vertex `cavity` (0 recess → 1 exposed) for the lug standing on the front wall, from two terms traced against the
 * lug's proxy AND the wall (z = wallZ(y)): occlusion sampled along each vertex normal (and two tilted rays), and
 * SHELTER from the museum's top light — the mean of n·l over seven directions round the zenith (elevation ≥ 60°),
 * each blocked if the solid or the wall lies in its way. A face turned down, or tucked under the loop or behind the
 * head, gets none. For a PatinaMaterial with `cavityAttribute: true` (the recess term darkens it: recessDirt).
 */
export function lugCavity(geo, sdf) {
  const P = geo.attributes.position.array, N = geo.attributes.normal.array
  const f = sdf.proxy || sdf.sd
  const occ = (x, y, z) => Math.min(f(x, y, z), (z - wallZ(y)) * 0.96)
  const cav = new Float32Array(P.length / 3)
  const steps = [1.5, 3.5, 7, 11.5, 16]
  const sky = [[0, 1, 0]]
  for (let k = 0; k < 6; k++) { const az = (k * Math.PI) / 3; sky.push([0.5 * Math.sin(az), 0.866, 0.5 * Math.cos(az)]) }
  const rays = [2, 5, 9, 15, 24]
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
    const ao = clamp(1 - 1.6 * (o / wsum), 0, 1)
    let vis = 0
    const ox = x + N[i] * 1.5, oy = y + N[i + 1] * 1.5, oz = z + N[i + 2] * 1.5
    for (const [lx, ly, lz] of sky) {
      const dt = N[i] * lx + N[i + 1] * ly + N[i + 2] * lz
      if (dt <= 0) continue
      let free = true
      for (const s of rays) if (occ(ox + lx * s, oy + ly * s, oz + lz * s) < 0.2) { free = false; break }
      if (free) vis += dt
    }
    vis /= sky.length
    const shelter = clamp(vis / 0.025, 0, 1) // the wall itself (leaning back, facing ≈ 16° down) sees ≈ 0.034: lit
    cav[v] = clamp(1.35 * ao * (0.1 + 0.9 * shelter * shelter), 0, 1) // open faces ≈ 0.8, the kit's plain-mesh constant
  }
  geo.setAttribute('cavity', new THREE.BufferAttribute(cav, 1))
  return geo
}
