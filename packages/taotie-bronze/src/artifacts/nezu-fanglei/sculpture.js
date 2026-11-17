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
function cHorn(u, v, h, R, w, height, openAng, openHalf, sq = 2) {
  const r = sq === 2 ? len2(u, v) : Math.pow(Math.pow(Math.abs(u), sq) + Math.pow(Math.abs(v), sq), 1 / sq)
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
  // a rounded-SQUARE C (p-norm 3.2): the photographed horns are C blocks with rounded corners, not rings
  let d = cHorn(u, v, h, R, w, height, openAng, openHalf, 3.2)
  // the spiral core: a domed knob at the ring centre, the band's rolled end
  d = smin(d, smax(len2(u, v) - R * 0.62, Math.abs(h - height * 0.42) - height * 0.42, 0.8), 0.8)
  // a groove spiralling into the core
  const ang = Math.atan2(v, u), rr = len2(u, v)
  const sp = Math.abs(((rr - R * 0.12 - (ang / (2 * Math.PI)) * R * 0.22) % (R * 0.22) + R * 0.22) % (R * 0.22) - R * 0.11) - 0.3
  d = smax(d, -smax(Math.max(sp, rr - R * 0.6), height * 0.84 - 0.45 - h, 0.2), 0.2)
  // incised line along the middle of the band (the bronze's contour line)
  const g = Math.abs(Math.pow(Math.pow(Math.abs(u), 3.2) + Math.pow(Math.abs(v), 3.2), 1 / 3.2) - R) - 0.35
  d = smax(d, -smax(g, height - 0.5 - h, 0.2), 0.25)
  return d
}
const zig = (t, p) => Math.abs(((((t / p) % 1) + 1) % 1) - 0.5) * 2 // 0..1 triangle wave

// ------------------------------------------------------------------ shoulder loop handle (+X)

const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t) }

/**
 * Shoulder handle on +X — round 10 (.work/lei-mid), re-read with a camera FITTED to photo-36 (az 68°, el 13°, ≈ 0.75 m,
 * vfov 41° on the crop) and photo-37: a beast head HOLDING A RING (衔环). The head lies almost level on the shoulder,
 * its flat top at y ≈ 321 (level with the ledge and the shoulder corner-flange tops in photo-37, not above them),
 * from the wall (x ≈ 92) out to a blunt muzzle at x ≈ 171, ≈ 40 mm across at the brow, ≈ 30 at the muzzle, whose
 * front drops as a vertical face to y ≈ 287. Its top is carved: two big spiral horns at the back, hooked ears, bulging
 * eyes, a nose ridge, nostrils. From the mouth hangs a heavy ROUND-SECTION ring (section ≈ 12.6 mm, outer Ø ≈ 63 mm)
 * whose plane is the side face's (YZ), swung 12° so its bottom (y ≈ 239, over the belly top) stands ≈ 6 mm off the
 * wall: seen nearly face-on from three-quarters (photo-36: the dark D under the head), edge-on from the front.
 * Two fields, meshed separately with tight bounds (cheaper than one box round both). −X = this turned 180° about Y.
 */
export function handleHeadSDF() {
  const top = (x) => 326.2 - 0.075 * (x - 100) // emerges from the ledge (325) at the collar, ≈ 321 at the muzzle
  const sd = (x, y, z) => {
    const yt = top(x)
    const hz = 15 + 5 * sstep(96, 128, x) - 5 * sstep(146, 168, x) // half width: wall → brow (≈ 40 across) → muzzle (≈ 30)
    // the slab: flat top, rounded edges, bottom resting on the shoulder slope
    let d = sdRBox3(x - 131, y - (yt - 9), z, 42, 9, hz, 3.2)
    // the muzzle: a block dropping in front to y ≈ 293, its face slightly undercut
    d = smin(d, sdRBox3(x - 160, y - 303.5, z, 11, 17, 14.5, 4.5), 3) // ≈ 34 mm deep at the front (photo-36: the dark muzzle face)
    // carved top: everything below in (u, v) = (x, z) on the plane y = top(x), h = height above it
    const h = y - yt
    for (const sg of [-1, 1]) {
      // the big spiral horns (photo-36: two fat curls behind the eyes, filling the back half of the top)
      d = smin(d, fatHorn(x - 114, z - sg * 10, h, 8.4, 3.0, 2.6, sg > 0 ? 2.6 : -2.6, 0.75), 0.6)
      // hooked ears at the outer edge, opening backward
      d = smin(d, cHorn(x - 129, z - sg * 16, h, 4.0, 1.3, 1.8, Math.PI, 0.9), 0.4)
      // bulging eyes with a sunk pupil ring
      d = smin(d, sdEllipsoid(x - 141, h + 0.6, z - sg * 11, 4.6, 3.4, 3.8), 0.8)
      d = smax(d, -(Math.abs(len2(x - 141, z - sg * 11) - 2.1) - 0.35 + Math.max(0, 2.4 - h) * 4), 0.2)
      // brow hook over each eye
      d = smin(d, cHorn(x - 138, z - sg * 5, h, 2.8, 0.95, 1.4, 0, 0.8), 0.3)
      // a curl on each cheek of the muzzle's flank
      d = smin(d, cHorn(x - 158, y - 305, (Math.abs(z) - 14.5) * sg * sg, 3.4, 1.1, 1.4, Math.PI / 2, 0.9), 0.4)
      // nostrils on the muzzle front (x ≈ 170)
      d = smax(d, -(len3(x - 172, y - 311, z - sg * 5.5) - 1.9), 0.5)
      // fangs: two short downward teeth at the mouth corners, either side of the ring
      d = smin(d, sdRBox3(x - 166, y - 286, z - sg * 10, 2.2, 3.4, 1.9, 0.9), 0.8)
    }
    // nose ridge down the centre of the muzzle
    d = smin(d, sdRBox3(x - 152, h - 0.7, z, 15, 1.1, 1.6, 0.8), 0.5)
    // the mouth: a groove across the muzzle front, the ring passes through it
    d = smax(d, -sdRBox3(x - 169, y - 292, z, 4, 1.1, 12, 0.5), 0.4)
    // its back end stops at the collar face
    d = Math.max(d, 88 - x)
    return d
  }
  return { sd, bounds: { min: [86, 278, -26], max: [177, 334, 26] } }
}
export const HANDLE_RING = { c: [150, 270, 0], R: 25, r: 6.3, tilt: 12 }
export function handleRingSDF() {
  const { c, R, r, tilt } = HANDLE_RING
  const t = (tilt * Math.PI) / 180, st = Math.sin(t), ct = Math.cos(t)
  const sd = (x, y, z) => {
    const px = x - c[0], py = y - c[1], pz = z - c[2]
    const a = px * st + py * ct, n = px * ct - py * st // in-plane up, plane normal
    return len2(len2(a, pz) - R, n) - r
  }
  return { sd, bounds: { min: [130, 235, -34], max: [168, 305, 34] } }
}
/** legacy: head and ring in one field */
export function handleSDF() {
  const a = handleHeadSDF(), b = handleRingSDF()
  return { sd: (x, y, z) => Math.min(a.sd(x, y, z), b.sd(x, y, z)), bounds: { min: [92, 244, -31], max: [176, 330, 31] } }
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
 * The tilting lug low on the front — round 10, re-read on photo-37 (1:1 at ≈ 3.6 px/mm, its face) and photo-36 (the ring,
 * nearly face-on from three-quarters): a heavy D-RING (round section ≈ 12 mm, ≈ 54 mm front-to-back, ≈ 52 mm tall)
 * standing out of the wall in the YZ plane, its lower arc below and behind the head; on its front a mask 49 mm across
 * the horns (y 33 → 101): two big C horns each drawn as TWO NESTED FAT BANDS rolling inward round a domed core and
 * filling the upper third, a crest down the centre, a brow, round eyes, a face packed with hooks and curls narrowing to
 * ≈ 30 mm, then a snout whose mouth is a zigzag of interlocking fangs in real relief over a rounded lower lip.
 */
const lugFace = (y) => 114 + (101 - y) * 0.06 // face plane z, leaning out toward the snout
export function lugHeadSDF() {
  const sd = (x, y, z) => {
    const zf = lugFace(y), h = z - zf
    // the mask plate: a trapezoid, 24 mm half width at the horns → 15 at the cheeks, ≈ 14 mm thick
    let d = smax(sdTrapezoid(x, y - 74, 15, 24, 27) - 1.5, Math.abs(z - (zf - 7)) - 7, 2.4)
    for (const sg of [-1, 1]) {
      const cx = sg * 12.6, cy = 86.5, open = sg > 0 ? -2.36 : -0.785
      d = smin(d, cHorn(x - cx, y - cy, h, 9.4, 2.1, 2.7, open, 0.62, 3), 0.7) // outer horn band
      d = smin(d, cHorn(x - cx, y - cy, h, 4.9, 1.75, 2.4, open, 0.7, 3), 0.6) // the nested inner band
      d = smin(d, smax(len2(x - cx, y - cy) - 2.2, Math.abs(h - 1.4) - 1.4, 0.6), 0.6) // domed core
      // brow band over the eye
      d = smin(d, smax(sdRBox2(x - sg * 12.5, y - 74.5, 7.5, 1.4, 1.2), Math.abs(h - 0.9) - 0.9, 0.5), 0.5)
      // round eyes with a sunk slit
      d = smin(d, sdEllipsoid(x - sg * 11.5, y - 68, h - 0.4, 3.4, 2.8, 2.4), 0.7)
      d = smax(d, -sdRBox3(x - sg * 11.5, y - 68, h - 2.6, 1.5, 0.45, 1.2, 0.3), 0.2)
      // hooks and curls packed on the cheeks
      d = smin(d, cHorn(x - sg * 15.5, y - 59.5, h, 3.6, 1.25, 2.0, sg > 0 ? 0.6 : 2.54, 0.8), 0.4)
      d = smin(d, cHorn(x - sg * 7.2, y - 57.5, h, 3.0, 1.15, 1.9, sg > 0 ? 2.3 : 0.84, 0.8), 0.4)
      d = smin(d, cHorn(x - sg * 18.5, y - 68.5, h, 2.4, 0.95, 1.6, sg > 0 ? 3.14 : 0, 0.9), 0.4)
      d = smin(d, cHorn(x - sg * 11, y - 51, h, 2.4, 0.95, 1.6, Math.PI / 2, 0.9), 0.4)
    }
    // the crest down the centre between the horns, and the nose bridge below it
    d = smin(d, smax(sdRBox2(x, y - 85, 2.1, 15, 1.4), Math.abs(h - 1.1) - 1.1, 0.5), 0.5)
    d = smin(d, smax(sdRBox2(x, y - 61, 2.6, 9, 1.6), Math.abs(h - 1.3) - 1.3, 0.5), 0.5)
    // the snout: a block projecting further, y 33 → 49
    const zs = lugFace(41)
    d = smin(d, sdRBox3(x, y - 41.5, z - (zs - 3), 13, 8.5, 7.5, 3.6), 2)
    // the mouth: upper fangs pointing down, lower fangs pointing up, interlocking, in relief on the snout front
    const hs = z - (zs + 4.5)
    const upper = Math.max(Math.abs(x) - 11.5, y - 47.5, 43.2 + 3.2 * zig(x + 1.6, 3.2) - y)
    const lower = Math.max(Math.abs(x) - 10.5, 39.6 - y, y - (43.0 - 3.0 * zig(x, 3.2)))
    d = smin(d, smax(Math.min(upper, lower), Math.abs(hs - 0.8) - 1.5, 0.3), 0.4)
    d = smax(d, -smax(Math.abs(y - 43.1) - 0.45, -hs - 0.4, 0.2), 0.2) // the dark mouth line between them
    // rounded lower lip with two nostril pits above the fangs
    d = smin(d, sdEllipsoid(x, y - 36.2, z - (zs + 3), 11.5, 4.2, 4.6), 1.2)
    for (const sg of [-1, 1]) d = smax(d, -(len3(x - sg * 5, y - 47.6, z - (zs + 5.2)) - 1.7), 0.5)
    return d
  }
  return { sd, bounds: { min: [-28, 28, 97], max: [28, 105, 128] } }
}
export const LUG_RING = { yc: 60, zc: 84, Ry: 20, Rz: 21, r: 6 }
export function lugRingSDF() {
  const { yc, zc, Ry, Rz, r } = LUG_RING
  const sd = (x, y, z) => {
    const u = (z - zc) / Rz, v = (y - yc) / Ry
    const q = len2(u, v)
    const k = Rz + (Ry - Rz) * Math.abs(v / (q || 1))
    let d = len2((q - 1) * k, x) - r
    return Math.max(d, RHO * bellyHalf(clamp(y, 21.5, 263)) - 4 - z)
  }
  return { sd, bounds: { min: [-9, yc - Ry - r - 3, 50], max: [9, yc + Ry + r + 3, zc + Rz + r + 3] } }
}
/** legacy: the lug as one field */
export function lugSDF() {
  const a = lugHeadSDF(), b = lugRingSDF()
  return { sd: (x, y, z) => Math.min(a.sd(x, y, z), b.sd(x, y, z)), bounds: { min: [-30, 27, 50], max: [30, 106, 128] } }
}

void halfAt
