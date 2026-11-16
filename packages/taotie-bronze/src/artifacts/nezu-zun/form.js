// Nezu zun 饕餮文尊 (90075) — the form, measured.
//
// The outline is a camera solve on the project owner's two whole-vessel photographs (reference/nezu-zun/dossier.md
// §b.1): a pinhole camera per photograph and a set of profile rings (lip tip, neck minimum, belly ledge, belly
// maximum, lower circle band, foot junction, foot base) fitted together by least squares to hand-read outline
// points (photo-26 8.4 px rms), then the band borders read on photo-26's front centre line converted to heights
// through the same camera, and the trumpet fitted free-form to photo-26's silhouette. Scale is INFERRED from the
// thread-line pitch (dossier §b.2): 1 fitted unit = 1.45 mm. All mm, Y up, front (+Z) = a shoulder head and the
// mask-centre flange below it (photo-26).

/** register heights (mm): [y0, y1] */
export const LV = {
  base: [0, 14], // plain foot base band
  foot: [14, 56], // foot frieze (taotie with boss eyes)
  footRidges: [62.6, 71, 76], // three bowstrings (rows 1405, 1372, 1352 of photo-26)
  holes: 81.5, // centre height of the three cross-shaped openings (60°, 180°, 300°)
  footTop: 87,
  circLow: [100.5, 114], // lower circle band (on the underside curving in)
  mask: [114, 170], // the belly mask
  circUp: [170, 186.5], // upper circle band
  studs: 199, // plain strip with small square studs
  collar: [207.8, 213.4], // the narrow C-scroll band on the collar under the shoulder slope
  shoulder: [215.6, 238.4], // the sloping shoulder band between the heads
  neckRidges: [244.5, 253, 261.5],
  rim: 347.5,
}

/** outer profile, bottom → top, [r, y] mm */
export const BODY = [
  [88.7, 0, 'corner'],
  [89.3, 1.4],
  [89.3, 4],
  [88.9, 14],
  [87.6, 30],
  [86.2, 45],
  [85.0, 56],
  [84.6, 60],
  [84.1, 68],
  [83.7, 76],
  [83.4, 82],
  [83.5, 86.4],
  [85.6, 88.4],
  [92, 90.7],
  [100, 93.3],
  [107, 96],
  [112.6, 99.4],
  [117.4, 103.7],
  [121, 108.6],
  [123.6, 113.8],
  [128.6, 124],
  [134, 136],
  [138.8, 148],
  [142.2, 160],
  [144.2, 170],
  [145.1, 179],
  [145.3, 187],
  [144.8, 194],
  [143.4, 199.4],
  [141.0, 203.4],
  [137.6, 205.8],
  [134.4, 206.9, 'corner'],
  [133.4, 208.2],
  [133.1, 213.6, 'corner'],
  [131.2, 215.6],
  [124, 221.8],
  [116, 228.6],
  [109.2, 234.4],
  [105.4, 238.2],
  [103.7, 241.4],
  [103.1, 246],
  [102.7, 255],
  [102.5, 265],
  [102.6, 275.5],
  [104.4, 282.6],
  [109.6, 288.8],
  [121.6, 295.2],
  [138, 304],
  [154.6, 312.6],
  [164.6, 318.6],
  [171, 325.4],
  [173.6, 333],
  [174.8, 340],
  [176.6, 345.6],
  [177.4, 347.5],
]

export const RIDGES = [
  ...LV.footRidges.map((y) => ({ y, count: 1, width: 2.6, height: 1.2, shape: 'round' })),
  ...LV.neckRidges.map((y) => ({ y, count: 1, width: 2.4, height: 1.0, shape: 'round' })),
]

/** azimuths (deg; 0 = front +Z, + toward +X) */
export const AZ = {
  heads: [0, 120, 240], // the shoulder heads, over the mask-centre flanges
  dividers: [60, 180, 300], // shoulder flanges, belly / foot divider flanges, the foot openings
  all6: [0, 60, 120, 180, 240, 300],
  studs: [45, 135, 225, 315], // two seen (±48° on photo-26, 41° on photo-28); four assumed
}

// ------------------------------------------------------------------ SDF helpers

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
function sdCone(px, py, pz, a, b, ra, rb) {
  const bx = b[0] - a[0], by = b[1] - a[1], bz = b[2] - a[2]
  const qx = px - a[0], qy = py - a[1], qz = pz - a[2]
  const h = Math.min(1, Math.max(0, (qx * bx + qy * by + qz * bz) / (bx * bx + by * by + bz * bz)))
  return len3(qx - bx * h, qy - by * h, qz - bz * h) - (ra + (rb - ra) * h)
}
function sdRBox3(x, y, z, bx, by, bz, r) {
  const qx = Math.abs(x) - bx + r, qy = Math.abs(y) - by + r, qz = Math.abs(z) - bz + r
  return len3(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - r
}
function sdTube(px, py, pz, knots) {
  let d = Infinity
  for (let i = 0; i < knots.length - 1; i++) {
    const a = knots[i], b = knots[i + 1]
    d = Math.min(d, sdCone(px, py, pz, a, b, a[3], b[3]))
  }
  return d
}

/** the profile's radius at height y (linear between points; the body below the snout) */
export function rAt(y) {
  for (let i = 0; i < BODY.length - 1; i++) {
    const [r0, y0] = BODY[i], [r1, y1] = BODY[i + 1]
    if (y >= y0 && y <= y1 && y1 > y0) return r0 + ((r1 - r0) * (y - y0)) / (y1 - y0)
  }
  return BODY[BODY.length - 1][0]
}

// ------------------------------------------------------------------ the shoulder head

/**
 * One shoulder head, built IN VESSEL SPACE at azimuth 0 (x lateral, y up, z = radial outward); rotate it about Y.
 *
 * photo-28 (both heads near profile): the head lies down the shoulder slope from the neck and runs out into a long
 * horizontal snout that overhangs the belly's rolled top, its tip ≈ 180 mm from the axis (≈ 35 mm past the belly),
 * the end turned up a little like a prow; the top of the head carries a raised horn coiled into a squared spiral
 * near the neck; an eye bead below the coil. photo-26 (head-on): the snout's end is a rounded trapezoid ≈ 28 mm
 * wide at the top, ≈ 24 at the bottom and ≈ 24 mm tall (y ≈ 200–224), pale and worn; behind it two flat horns
 * spread to ≈ ±27 mm and rise to y ≈ 240. Ears / horn edges are toothed on photo-28's left head (worn).
 */
export function headSDF() {
  // side profile of the head, radial z (mm from the axis) → top y, bottom y, half-width: thick at the neck, the top
  // sweeping down in a concave line, the snout tapering and its tip turning up like a prow (photo-28)
  const LOFT = [
    // z,   top,   bottom, half-width
    [104, 253.0, 224.0, 20.0],
    [116, 250.0, 213.0, 19.6],
    [130, 243.0, 207.6, 17.6],
    [144, 234.0, 205.0, 15.6],
    [158, 227.0, 204.0, 14.2],
    [170, 223.8, 204.4, 13.4],
    [178, 225.0, 206.6, 12.8],
    [183.5, 228.0, 211.0, 11.6],
  ]
  const lerpL = (z, k) => {
    if (z <= LOFT[0][0]) return LOFT[0][k]
    for (let i = 0; i < LOFT.length - 1; i++) {
      const a = LOFT[i], b = LOFT[i + 1]
      if (z <= b[0]) { const t = (z - a[0]) / (b[0] - a[0]); const s = t * t * (3 - 2 * t); return a[k] + (b[k] - a[k]) * s }
    }
    return LOFT[LOFT.length - 1][k]
  }
  const sl = Math.atan2(240 - 214, 133 - 104) // the shoulder slope ≈ 41.9°
  const cs = Math.cos(sl), sn = Math.sin(sl)
  const sd = (x, y, z) => {
    const ax = Math.abs(x)
    const zc = Math.min(Math.max(z, 100), 183.5)
    const top = lerpL(zc, 1), bot = lerpL(zc, 2), hw = lerpL(zc, 3)
    const rr = 3.2 // edge rounding
    const q1 = Math.max(y - top, bot - y, z - 183.5, 98 - z) + rr
    const q2 = ax - hw + rr
    let d = Math.hypot(Math.max(q1, 0), Math.max(q2, 0)) + Math.min(Math.max(q1, q2), 0) - rr
    // the snout's end rounded off in plan
    // the snout's end: rounded off in plan and tapering downward (photo-26: a rounded trapezoid)
    d = smax(d, len2(ax * (0.9 + 0.012 * Math.max(0, 224 - y)), Math.max(0, z - 172)) - 13.6, 3)
    // horns: flat rounded-square plates lying on the slope either side of the brow, ≈ 2.5 mm proud of the head,
    // their tops incised with a squared spiral (photo-28: the coil on top of each head near the neck)
    {
      const zr = z - 104, yr = y - 240
      const u = zr * cs - yr * sn, v = zr * sn + yr * cs
      const pu = u - 13, px = ax - 12.4, pv = v - 20.6
      const plate = sdRBox3(px, pu, pv, 11.2, 11.8, 3.4, 4.2)
      d = smin(d, plate, 1.6)
      const cheb = Math.max(Math.abs(px), Math.abs(pu) / 1.05)
      const ph = cheb / 2.5 - Math.floor(cheb / 2.5)
      const groove = Math.abs(ph - 0.5) * 2.5 - 0.42
      if (cheb < 10.4) d = smax(d, Math.min(-groove, pv - 2.4), 0.3)
    }
    // eyes: oval beads on the sides of the head, behind the snout
    d = smin(d, sdEllipsoid(ax - 15.4, y - 221.5, z - 147, 2.8, 3.8, 5.4), 1.2)
    d = smax(d, -sdEllipsoid(ax - 16.8, y - 221.5, z - 147, 1.6, 1.1, 3.2), 0.5)
    // back: sink into the body
    d = smax(d, -(z - 96), 2)
    return d
  }
  return { sd, bounds: { min: [-34, 198, 96], max: [34, 266, 188] } }
}

// ------------------------------------------------------------------ shoulder flange (an L-shaped slab)

/**
 * photo-26 (two seen side-on at ±60°) and photo-28 (one end-on): a slab ≈ 11 mm thick standing radially on the
 * shoulder slope: its top runs from the neck (r ≈ 112, y ≈ 240) out to r ≈ 148 (y ≈ 232), the outer edge drops
 * vertically past the collar and ends in a small hook tucked against the belly's rolled top (y ≈ 206). In (r, y),
 * the slab's buried part goes below the slope surface.
 */
export const SHOULDER_FLANGE = [
  [112, 233], [116, 232.4], [128, 231], [140, 229.8], [147.6, 229], [148.6, 226.4], [148.4, 214],
  [147, 208.4], [143.4, 205.4], [140.6, 206.4], [141.6, 209.6], [139.8, 211.6], [128, 214], [112, 226],
]
export const SHOULDER_FLANGE_T = 11
