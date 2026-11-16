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
  // fix pass r8: the foot flares a little more toward its base (detail-foot: ≈ 10 % wider at the base than at the
  // frieze top, against ≈ 5 % before)
  [90.6, 0, 'corner'],
  [91.2, 1.4],
  [91.2, 4],
  [90.6, 14],
  [88.6, 30],
  [86.6, 45],
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
  [174.4, 333],
  [176.6, 340],
  [178.2, 345.6],
  [178.8, 347.5], // fix pass r8: the flare runs on to the edge (no upright lip band)
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
  // fix pass r8 (detail-head, detail-head-front): a BULBOUS head, not a plank. Side profile (radial z → top, bottom,
  // half-width at the top): a thick root on the shoulder, the top dropping in a concave sweep and rising again into
  // a rounded prow at the tip; the section is a rounded trapezoid, wider at the top (photo-26: ≈ 26 mm across the top
  // of the snout end, narrowing downward). The horns are two coiled discs at the back of the head, their incised
  // faces turned out and down, leaning outward so that from the front they spread in a V behind the snout and from
  // the side each reads as a big round coil standing ≈ 25 mm over the snout line (photo-28's heads).
  const LOFT = [
    // z,   top,   bottom, half-width (top): the snout runs DOWN from the horns (≈ 25°) and its tip turns up (a prow)
    [104, 248.0, 222.0, 17.0],
    [116, 245.0, 211.0, 17.2],
    [130, 238.6, 205.4, 16.2],
    [144, 231.6, 203.0, 15.0],
    [156, 226.4, 202.6, 14.2],
    [166, 223.4, 203.4, 13.8],
    [174, 223.0, 205.8, 13.4],
    [180, 226.0, 209.6, 12.8],
    [184, 230.4, 214.6, 12.0],
  ]
  const ZT = 184.5
  const lerpL = (z, k) => {
    if (z <= LOFT[0][0]) return LOFT[0][k]
    for (let i = 0; i < LOFT.length - 1; i++) {
      const a = LOFT[i], b = LOFT[i + 1]
      if (z <= b[0]) { const t = (z - a[0]) / (b[0] - a[0]); const s = t * t * (3 - 2 * t); return a[k] + (b[k] - a[k]) * s }
    }
    return LOFT[LOFT.length - 1][k]
  }
  // horn disc frame (right horn; the left mirrors in |x|): centre, outward face normal n, in-plane axes e1, e2
  const HC = [18.4, 238.4, 120]
  const nrm = (v) => { const l = Math.hypot(v[0], v[1], v[2]); return v.map((c) => c / l) }
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
  const n = nrm([0.7, -0.62, 0.36])
  const e1 = nrm(cross([0, 1, 0], n)) // horizontal-ish in the face
  const e2 = cross(n, e1)
  const HR = 11.2, HT = 4.6
  const sd = (x, y, z) => {
    const ax = Math.abs(x)
    const zc = Math.min(Math.max(z, 100), ZT)
    const top = lerpL(zc, 1), bot = lerpL(zc, 2), hwTop = lerpL(zc, 3)
    // trapezoid section: half-width shrinks toward the bottom
    const f = Math.min(1, Math.max(0, (y - bot) / Math.max(1, top - bot)))
    const hw = hwTop * (0.56 + 0.44 * f)
    const rr = 6.4 // fat rounding: a bulbous mass
    const q1 = Math.max(y - top, bot - y, z - ZT, 98 - z) + rr
    const q2 = ax - hw + rr
    let d = Math.hypot(Math.max(q1, 0), Math.max(q2, 0)) + Math.min(Math.max(q1, q2), 0) - rr
    // the prow: rounded off in plan
    d = smax(d, len2(ax * 0.92, Math.max(0, z - 168)) - 15.6, 5)
    // a broad swelling over the brow, between the horns
    d = smin(d, sdEllipsoid(ax, y - 232, z - 126, 12, 7, 14), 4)
    // horns: coiled discs, domed outer face incised with a rounded-square spiral
    {
      const px = ax - HC[0], py = y - HC[1], pz = z - HC[2]
      const u = px * e1[0] + py * e1[1] + pz * e1[2]
      const v = px * e2[0] + py * e2[1] + pz * e2[2]
      const w = px * n[0] + py * n[1] + pz * n[2]
      const rho = Math.hypot(u, v)
      const tt = HT * (1 - 0.3 * Math.min(1, (rho / HR) ** 2)) // domed face
      const qa = rho - HR + 2.4, qb = Math.abs(w + 0.6) - tt + 2.4
      const disc = Math.hypot(Math.max(qa, 0), Math.max(qb, 0)) + Math.min(Math.max(qa, qb), 0) - 2.4
      d = smin(d, disc, 2.6)
      // the spiral: a squared-round coil (superellipse radius), pitch 2.4 mm, cut ≈ 0.8 mm into the outer face
      if (w > 0 && rho < HR - 1.2) {
        const ang = Math.atan2(v, u)
        const sq = Math.pow(Math.pow(Math.abs(u), 4) + Math.pow(Math.abs(v), 4), 0.25)
        const ph = sq / 2.4 + ang / (2 * Math.PI)
        const fr = ph - Math.floor(ph)
        const groove = Math.abs(fr - 0.5) * 2.4 - 0.5
        d = smax(d, Math.min(-groove, w - (tt - 1.4)), 0.35)
      }
    }
    // eyes: small oval beads on the sides of the head, under the horns
    d = smin(d, sdEllipsoid(ax - 13.6, y - 222.5, z - 142, 2.6, 3.4, 4.8), 1.2)
    d = smax(d, -sdEllipsoid(ax - 15.2, y - 222.5, z - 142, 1.4, 1.0, 3.0), 0.5)
    // back: sink into the body
    d = smax(d, -(z - 96), 2)
    return d
  }
  return { sd, bounds: { min: [-36, 196, 96], max: [36, 262, 190] } }
}

// ------------------------------------------------------------------ shoulder flange (an L-shaped slab)

/**
 * photo-26 (two seen side-on at ±60°) and photo-28 (one end-on): a slab ≈ 11 mm thick standing radially on the
 * shoulder slope: its top runs from the neck (r ≈ 112, y ≈ 240) out to r ≈ 148 (y ≈ 232), the outer edge drops
 * vertically past the collar and ends in a small hook tucked against the belly's rolled top (y ≈ 206). In (r, y),
 * the slab's buried part goes below the slope surface.
 */
export const SHOULDER_FLANGE = [
  // fix pass r8: a short LOW lug lying along the slope (≈ 7 mm proud of it) whose outer end hooks down over the
  // collar onto the belly's rolled top (photo-28), not a tall block
  [110, 238.6], [118, 232.8], [128, 224.8], [136, 218.6], [141.2, 214.6], [143.2, 211], [142.8, 207], [140.4, 205],
  [137.8, 206.2], [138.4, 209], [134, 210.2], [128, 214], [112, 226.4],
]
export const SHOULDER_FLANGE_T = 11
