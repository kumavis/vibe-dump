// nezu-fanglei — the cast sculpture (dossier §b.6): the two shoulder loop handles with animal heads (±X),
// the frontal animal head at the centre of the front (and, inferred, back) shoulder, and the low lug on the
// front: a ring loop carrying a bovine-horned mask whose snout hangs below it. Signed distance fields in
// VESSEL mm (Y up, front +Z), meshed with kit.meshSDF. Read off photo-37 (front) and photo-36 (three-quarter).

import { halfAt, shoulderHalf, bellyHalf, RHO } from './form.js'

const len2 = (x, y) => Math.sqrt(x * x + y * y)
const len3 = (x, y, z) => Math.sqrt(x * x + y * y + z * z)
const clamp = (x, a, b) => Math.min(b, Math.max(a, x))
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
function sdEllipsoid(px, py, pz, rx, ry, rz) {
  const k0 = len3(px / rx, py / ry, pz / rz)
  const k1 = len3(px / (rx * rx), py / (ry * ry), pz / (rz * rz))
  return k1 > 1e-9 ? (k0 * (k0 - 1)) / k1 : -Math.min(rx, ry, rz)
}
/** 2D trapezoid, centred, half widths r1 (bottom, y = −he) and r2 (top, y = +he) — iq */
function sdTrapezoid(px, py, r1, r2, he) {
  const k1x = r2, k1y = he, k2x = r2 - r1, k2y = 2 * he
  px = Math.abs(px)
  const cax = px - Math.min(px, py < 0 ? r1 : r2), cay = Math.abs(py) - he
  const t = clamp(((k1x - px) * k2x + (k1y - py) * k2y) / (k2x * k2x + k2y * k2y), 0, 1)
  const cbx = px - k1x + k2x * t, cby = py - k1y + k2y * t
  const s = cbx < 0 && cay < 0 ? -1 : 1
  return s * Math.sqrt(Math.min(cax * cax + cay * cay, cbx * cbx + cby * cby))
}
/**
 * A raised C band (horn) on a plane: ring of radius R, band half width w, open toward `openAng` (rad, in the
 * plane, 0 = +x) over ±`openHalf`; (u, v) in-plane, h = height above the plane (signed distance in 3D).
 */
function cHorn(u, v, h, R, w, height, openAng, openHalf) {
  const r = len2(u, v)
  let a = Math.atan2(v, u) - openAng
  a = Math.atan2(Math.sin(a), Math.cos(a))
  let d2 = Math.abs(r - R) - w
  if (Math.abs(a) < openHalf) {
    // the open side: the band ends bluntly (distance to the end caps)
    const e = Math.abs(a) - openHalf
    d2 = Math.max(d2, -e * R)
  }
  return smax(d2, Math.abs(h - height / 2) - height / 2, 0.9)
}

/** a fat C horn with a rolled spiral core: ring band + a domed core knob + an incised groove along the band */
function fatHorn(u, v, h, R, w, height, openAng, openHalf) {
  let d = cHorn(u, v, h, R, w, height, openAng, openHalf)
  // the spiral core: a domed knob at the ring centre, the band's rolled end
  d = smin(d, smax(len2(u, v) - R * 0.62, Math.abs(h - height * 0.42) - height * 0.42, 0.8), 0.8)
  // a groove spiralling into the core
  const ang = Math.atan2(v, u), rr = len2(u, v)
  const sp = Math.abs(((rr - R * 0.12 - (ang / (2 * Math.PI)) * R * 0.22) % (R * 0.22) + R * 0.22) % (R * 0.22) - R * 0.11) - 0.3
  d = smax(d, -smax(Math.max(sp, rr - R * 0.6), height * 0.84 - 0.45 - h, 0.2), 0.2)
  // incised line along the middle of the band (the bronze's contour line)
  const g = Math.abs(len2(u, v) - R) - 0.35
  d = smax(d, -smax(g, height - 0.5 - h, 0.2), 0.25)
  return d
}
const zig = (t, p) => Math.abs(((((t / p) % 1) + 1) % 1) - 0.5) * 2 // 0..1 triangle wave

// ------------------------------------------------------------------ shoulder loop handle (+X)

/**
 * Loop handle on the +X shoulder (photo-37 right edge, photo-36 centre), re-read in round 8: a FLAT-TOPPED beast head
 * lying nearly horizontal on the shoulder top, thrusting ≈ 45 mm out from the wall (x ≈ 104 → 164, y ≈ 326–337,
 * ≈ 25 mm across) with spiral horns incised on its flat top; under its outer end a BROAD FLAT strap (≈ 23 mm across,
 * ≈ 6.5 mm thick) curls down and back into the wall at y ≈ 284. The −X handle is this one turned 180° about Y.
 */
export function handleSDF() {
  const cx = 124, cy = 306, rx = 34, ry = 21 // strap centre line: half ellipse on the outer side
  const sd = (x, y, z) => {
    const u = (x - cx) / rx, v = (y - cy) / ry
    const r = len2(u, v)
    const k = rx + (ry - rx) * Math.abs(v / (r || 1))
    const dr = (r - 1) * k
    let d = sdRBox2(dr, z, 4.4, 11.5, 2.4)
    d = Math.max(d, shoulderHalf(clamp(y, 263, 325)) - 4 - x, cx - 6 - x)
    // the head: a flat slab, top face nearly level (tilted 6° up toward the snout), slightly wider at the muzzle
    const hx = x - 135, hy = y - 331.5
    const ca = Math.cos(0.1), sa = Math.sin(0.1)
    const ax = hx * ca + hy * sa, ay = -hx * sa + hy * ca
    const halfZ = 11.6 + 1.2 * clamp((ax + 25) / 55, 0, 1)
    let head = sdRBox3(ax, ay, z, 30, 5.6, halfZ, 2.2)
    // muzzle: the outer end drops into a blunt snout
    head = smin(head, sdRBox3(ax - 26, ay + 4.5, z, 5.5, 6.5, halfZ - 1.5, 2.6), 1.6)
    // flat top: two spiral horns (raised rings) and eyes, all low relief on the top face
    for (const sg of [-1, 1]) {
      head = smin(head, cHorn(ax + 14, z - sg * 6.2, ay - 5.6, 4.6, 1.3, 1.3, sg > 0 ? -1.2 : 1.2, 0.9), 0.4)
      head = smin(head, len3(ax - 6, ay - 5.0, z - sg * 7.2) - 2.4, 0.6)
      head = smin(head, cHorn(ax + 1, z - sg * 6.5, ay - 5.6, 2.6, 0.9, 1.0, 0, 0.6), 0.3)
    }
    head = Math.max(head, shoulderHalf(clamp(y, 263, 325)) - 10 - x)
    d = smin(d, head, 2.0)
    return d
  }
  return { sd, bounds: { min: [96, 278, -16], max: [170, 345, 16] } }
}

// ------------------------------------------------------------------ frontal shoulder head (front; back inferred)

/**
 * The sculpted head at the centre of the front shoulder (photo-37), re-read in round 8: a trapezoid ≈ 55 mm across
 * the top, ≈ 32 mm at the chin, y 276 → 324. Its upper half is two MASSIVE C horns (each ≈ 26 × 17 mm, band ≈ 7 mm,
 * a spiral core) curling down toward the centre; under them two bulging round eyes, small coils, a zigzag row of
 * teeth and a projecting flat-faced chin block. Front +Z; mirror z for the back.
 */
export function shoulderHeadSDF() {
  const yc = 300, he = 24
  const zf = (y) => 99 + (322 - y) * 0.27 // the face leans out toward the chin
  const sd = (x, y, z) => {
    const wall = RHO * shoulderHalf(clamp(y, 263, 325))
    const zt = zf(y)
    let d2 = sdTrapezoid(x, y - yc, 14, 25, he) - 1.5
    let d = smax(d2, Math.max(z - zt, wall - 5 - z), 2.2)
    for (const sg of [-1, 1]) {
      // the horn: a fat C opening down toward the centre line
      d = smin(d, fatHorn(x - sg * 13.4, y - 313.5, z - zt, 7.6, 4.2, 4.4, sg > 0 ? -2.3 : -0.84, 0.6), 0.8)
      d = smin(d, len3(x - sg * 10.5, y - 299.5, (z - zt - 0.6) * 1.15) - 3.6, 1.0) // bulging eye
      d = smin(d, cHorn(x - sg * 18.5, y - 296, z - zt, 2.8, 1.0, 1.6, sg > 0 ? 2.4 : 0.7, 0.8), 0.5) // coil
      d = smin(d, cHorn(x - sg * 5.5, y - 292, z - zt, 2.4, 0.9, 1.4, 1.57, 0.8), 0.5) // coil
    }
    // the tooth row: a raised band whose lower edge is a zigzag (y ≈ 283–288)
    const teeth = Math.max(Math.abs(x) - 15.5, (y - 288.5), 283 + 3.2 * zig(x + 1.6, 3.2) - y)
    d = smin(d, smax(teeth, Math.abs(z - zt - 0.8) - 1.6, 0.4), 0.5)
    // the chin block: projecting, vertical-faced (y 276–283)
    d = smin(d, sdRBox3(x, y - 277, z - (zf(277) + 2.5), 15.5, 6.5, 5.2, 1.4), 1.0)
    return d
  }
  return { sd, bounds: { min: [-30, 268, 74], max: [30, 330, 124] } }
}

// ------------------------------------------------------------------ low lug (front)

/**
 * The tilting lug low on the front (photo-37, photo-36 lower left), re-read in round 8: a round-section ring standing
 * out from the wall and on its outer face a NARROW mask ≈ 48 mm across its horns: two C horns curling down toward the
 * centre (nested lines), a face narrowing from ≈ 34 to ≈ 22 mm covered in hooks, small eyes, then a long snout with a
 * zigzag row of fangs hanging to y ≈ 33.
 */
export function lugSDF() {
  const yc = 72, zc = 83, R = 20, rr = 5.6
  const sd = (x, y, z) => {
    const wall = RHO * bellyHalf(clamp(y, 21.5, 263))
    const q = len2(y - yc, z - zc) - R
    let d = len2(q, x) - rr
    d = Math.max(d, wall - 4 - z)
    const zf = 106 + (102 - y) * 0.09
    const plate = smax(sdTrapezoid(x, y - 72, 10, 18, 25) - 2, Math.abs(z - (zf - 5.5)) - 5.5, 2.4)
    d = smin(d, plate, 2)
    for (const sg of [-1, 1]) {
      d = smin(d, fatHorn(x - sg * 12.8, y - 88.5, z - zf, 7.8, 3.8, 3.8, sg > 0 ? -2.25 : -0.89, 0.6), 0.8)
      d = smin(d, len3(x - sg * 7, y - 73, z - zf - 0.6) - 2.4, 0.8) // eyes
      d = smin(d, cHorn(x - sg * 12, y - 66, z - zf, 3.0, 1.0, 1.5, sg > 0 ? 2.4 : 0.7, 0.8), 0.5) // cheek hooks
      d = smin(d, cHorn(x - sg * 6, y - 60, z - zf, 2.4, 0.9, 1.3, 1.57, 0.8), 0.5)
    }
    d = smin(d, sdRBox3(x, y - 76, z - zf - 0.5, 1.3, 12, 1.2, 0.6), 0.5) // nose ridge
    // the snout: a long block projecting further out, a zigzag row of fangs across it, rounded muzzle at y ≈ 33
    let sn = sdRBox3(x, y - 43.5, z - zf - 1.5, 10.5, 10, 6.4, 3.4)
    d = smin(d, sn, 2)
    const fang = 47.5 - 3.4 * zig(x + 1.75, 3.5)
    d = smax(d, -smax(Math.abs(y - fang) - 0.55, zf + 4.2 - z, 0.3), 0.3)
    for (const sg of [-1, 1]) d = smax(d, -(len3(x - sg * 4.4, y - 38, z - zf - 7.6) - 1.8), 0.5) // nostrils
    return d
  }
  return { sd, bounds: { min: [-28, 26, 46], max: [28, 112, 118] } }
}

void halfAt
