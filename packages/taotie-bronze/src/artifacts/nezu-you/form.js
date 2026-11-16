// Nezu you 饕餮文卣 (90086) — the form: measured outline, levels, plan, and the cast sculpture
// (knob, lid horns, pivot heads) as signed distance fields for kit.meshSDF. All mm, Y up, front +Z.
//
// Measured on photo-31 (head-on, broad face, bail edge-on) at 4.75 px/mm on the front plane: the scale
// is INFERRED from the leiwen pitch (≈ 5.7 px on the belly ground ≈ 1.2 mm, research/01 §1.3) — see
// reference/nezu-you/dossier.md §b. Radii are the X (long-axis) half-widths read off the side
// silhouettes; the plan is an oval, Z = X / OVAL (dossier §b.3).

export const OVAL = 1.0

/** levels (y, mm above the ground) — dossier §b.2 */
export const LV = {
  base: 17, // plain flared base band of the ring foot (top)
  footFrieze: [20.5, 46.5], // foot frieze (kui pairs)
  footTop: 52, // foot neck under the belly's lower roll
  belly: [57, 164.6], // belly mask field
  shoulder: 167.4, // belly top: a rounded shoulder in to the neck
  neck: [170, 205.5], // neck frieze (kui flanking the pivot head)
  mouth: 213, // the lid's skirt sits on this
  skirt: [216, 243], // lid skirt frieze
  eave: 257, // eave edge (lid rim)
  lidTop: [264.5, 304], // decorated lid slope
  apex: 312,
  knob: 347,
  bail: 389, // top of the bail's outer face, displayed upright
}

/** body outline (outer surface, r = X half-width), bottom → top */
/** radial scale on the measured outlines (the strong perspective of the ≈ 1 m camera, dossier §b.1) */
export const RK = 1.04
const scaleR = (pts) => pts.map(([r, y, j]) => (j ? [r * RK, y, j] : [r * RK, y]))

export const BODY = scaleR([
  [79, 0], [83.2, 0.6], [84.6, 2.2, 'corner'], [85.2, 9], [85.4, 15.6], [84.6, 17, 'corner'], [82.4, 17.6, 'corner'],
  [82.1, 25], [81.8, 38], [81.6, 45.6, 'corner'], [80.2, 47.2], [79.4, 50.2, 'corner'],
  [82, 51.8], [85.4, 54.6], [89, 59], [93.6, 65], [98.6, 72], [104, 80.5], [109.4, 90], [114.4, 100], [118, 110],
  [119.4, 118.5], [119, 127], [117, 136], [114, 145], [109.5, 154], [105, 160.5], [99.6, 165], [93.4, 167.4, 'corner'],
  [91, 169.2], [90.6, 188], [90.5, 205.8, 'corner'], [89.8, 207.5], [89.6, 213],
])

/** lid outline (outer), bottom of the skirt → apex; the skirt sits over the mouth */
export const LID = scaleR([
  [92.6, 213, 'corner'], [92.8, 216], [93, 230], [93.2, 243.2, 'corner'], [95.4, 246.4], [99.2, 251.6],
  [101.6, 257, 'corner'], [101.2, 260.8], [99.4, 263.4, 'corner'], [85, 273.4], [70, 283],
  [55, 292], [40, 300], [25, 306.4], [12, 310.4], [0.01, 312],
])

/** a closed-strap bail: half-width 0 plane x = 0, centre line from the pivot up and over (YZ) */
export const BAIL = {
  width: 27, // across (X)
  thick: 7, // radial
  get zLeg() { return (101.6 * RK) / OVAL + 4.6 }, // centre line of the vertical legs (|z|): clear of the eave
  y0: 205, // the strap's lower end, inside the pivot head
  get yArc() { return LV.bail - this.thick / 2 - this.zLeg }, // centre of the top semicircle
}

/** centre line of the front half of the bail, by arc length a ∈ [0, half] → { p: [y, z], t: [dy, dz], n: [ny, nz] } */
export function bailFrame(a) {
  const legL = BAIL.yArc - BAIL.y0
  if (a <= legL) return { p: [BAIL.y0 + a, BAIL.zLeg], t: [1, 0], n: [0, 1] }
  const th = (a - legL) / BAIL.zLeg // 0 at the leg top → π/2 at the crown
  const c = Math.cos(th), s = Math.sin(th)
  return { p: [BAIL.yArc + BAIL.zLeg * s, BAIL.zLeg * c], t: [c, -s], n: [s, c] }
}
export const bailHalfLength = () => BAIL.yArc - BAIL.y0 + (Math.PI / 2) * BAIL.zLeg

// ------------------------------------------------------------------ SDF helpers

const len2 = (x, y) => Math.sqrt(x * x + y * y)
const len3 = (x, y, z) => Math.sqrt(x * x + y * y + z * z)
export const smin = (a, b, k) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k
  return Math.min(a, b) - h * h * k * 0.25
}
export const smax = (a, b, k) => -smin(-a, -b, k)
export function sdEllipsoid(px, py, pz, rx, ry, rz) {
  const k0 = len3(px / rx, py / ry, pz / rz)
  const k1 = len3(px / (rx * rx), py / (ry * ry), pz / (rz * rz))
  return k1 > 1e-9 ? (k0 * (k0 - 1)) / k1 : -Math.min(rx, ry, rz)
}
/** capsule a → b, radius ra → rb */
export function sdCone(px, py, pz, a, b, ra, rb) {
  const bx = b[0] - a[0], by = b[1] - a[1], bz = b[2] - a[2]
  const qx = px - a[0], qy = py - a[1], qz = pz - a[2]
  const h = Math.min(1, Math.max(0, (qx * bx + qy * by + qz * bz) / (bx * bx + by * by + bz * bz)))
  return len3(qx - bx * h, qy - by * h, qz - bz * h) - (ra + (rb - ra) * h)
}
export function sdRBox3(x, y, z, bx, by, bz, r) {
  const qx = Math.abs(x) - bx + r, qy = Math.abs(y) - by + r, qz = Math.abs(z) - bz + r
  return len3(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - r
}
/** a tube along [x, y, z, r] knots */
export function sdTube(px, py, pz, knots) {
  let d = Infinity
  for (let i = 0; i < knots.length - 1; i++) {
    const a = knots[i], b = knots[i + 1]
    d = Math.min(d, sdCone(px, py, pz, a, b, a[3], b[3]))
  }
  return d
}

// ------------------------------------------------------------------ knob: a ribbed bud on a short stem

/**
 * photo-32 (≈ 5.1 px/mm there): the bud is ≈ 27 mm across and ≈ 25 mm tall, a fat closed bud whose
 * surface is ridged by ≈ 6 horizontal wavy ribs; it rises from a waisted stem ≈ 13 mm across off the
 * lid's crown. Seen from the front in photo-31 it hides behind the bail. Local frame: the lid apex at
 * y = 0. (The ribs read as roof tiles / petals; their exact count is from one photo.)
 */
export function knobSDF() {
  const sd = (x, y, z) => {
    const zz = z
    // stem: waisted, flaring into the lid
    const r = len2(x, zz)
    const t = Math.min(1, Math.max(0, y / 12))
    const stemR = 7.2 - 1.6 * Math.sin(Math.PI * t) + 6 * Math.max(0, 1 - y / 3.5) ** 2
    let d = Math.max(r - stemR, -y - 3, y - 14)
    // bud: an egg, widest a third up, slightly pointed top
    const by = y - 23.5
    const ry = by > 0 ? 17 : 12.5
    const egg = sdEllipsoid(x, by, zz, 12.8, ry, 12.8)
    // ribs: ≈ 6 tiers, wavy (6 lobes round), shallow grooves
    const ang = Math.atan2(zz, x)
    const tier = (y - 10.5 + 0.9 * Math.sin(ang * 6)) / 4.3
    const fr = tier - Math.floor(tier)
    const groove = by > -11 && by < 12.5 ? 0.85 * Math.exp(-((fr - 0.08) ** 2) / 0.006) : 0
    const bud = egg + groove
    d = smin(d, bud, 3)
    return d
  }
  return { sd, bounds: { min: [-16, -3, -16], max: [16, 43, 16] } }
}

// ------------------------------------------------------------------ lid horns (犄角) at the ends of the long axis

/**
 * photo-31: from the eave at each end a thick prong curves out and up past the eave (its tip ≈ 127 mm out,
 * ≈ 288 mm up; base on the eave ≈ 104–114 mm out, 243–256 up); ≈ 16 mm thick seen from the front, its outer
 * face flat, a small boss on it (photo-32, right horn). Built for the +X end in vessel space.
 */
export function hornSDF() {
  const knots = [
    [96, 252, 0, 8],
    [104, 257, 0, 8.4],
    [110.5, 263, 0, 8],
    [114, 271, 0, 7.2],
    [113.6, 279, 0, 6.2],
    [109, 285, 0, 4.8],
    [103, 287.6, 0, 3.6],
  ]
  const sd = (x, y, z) => {
    // flatten the tube front-back: a blade 1.25× as wide (z) as thick (x) — photo-32's broad face
    x /= RK
    let d = sdTube(x, y, z / 1.3, knots) * 1.0
    // clip the inner side flat against the lid slope (the horn grows out of the eave)
    d = smax(d, -(x - 92), 2)
    // a small round boss on the outer face (photo-32)
    const bx = x - 120.4, by = y - 268, bz = z
    d = smin(d, sdEllipsoid(bx, by, bz, 2.2, 4.6, 4.6), 1.5)
    return d
  }
  return { sd, bounds: { min: [86 * RK, 238, -16], max: [128 * RK, 296, 16] } }
}

// ------------------------------------------------------------------ pivot heads (the bail's ends)

/**
 * photo-31 (head-on, 4.75 px/mm): the head is ≈ 54 mm across the horns and ≈ 46 mm tall; two flat C-shaped
 * horns curl out and DOWN from the crown (their curls at the top corners, ≈ 18 mm across each), a lozenge
 * on the forehead, two bulging oval eyes ≈ 9 mm, a broad flat snout narrowing to ≈ 24 mm with two nostril
 * curls; it stands ≈ 22 mm proud of the neck. The strap runs into the top of the head. Local frame: +Z out of
 * the wall (z = 0 = wall surface), +Y up, centre of the face at y = 0.
 */
export function pivotHeadSDF() {
  const sd = (x, y, z) => {
    const ax = Math.abs(x)
    // face plate: broad and flat, wider at the brow, narrowing to the snout, leaning forward at the bottom
    const lean = -0.16 * y
    const w = 13.5 + 6 * Math.min(1, Math.max(0, (y + 6) / 20))
    let d = sdRBox3(x, y + 1, z - 7.5 - lean, w, 18, 7.5 + Math.max(0, -y) * 0.1, 4.5)
    d = smax(d, -z - 4, 1) // back plane, sunk 4 into the wall
    // snout: a flat broad pad
    d = smin(d, sdRBox3(x, y + 15.5, z - 14.5, 11.5, 5.5, 3.5, 3), 2.5)
    // horns: thick FLAT C scrolls lying on the face plane: out of the crown, out and down, curling back in over the eye
    const hk = []
    for (let i = 0; i <= 14; i++) {
      const t = i / 14, a = -0.3 + Math.PI * 1.55 * t
      const R = 9.6 - 4.6 * t
      hk.push([15 + R * Math.sin(a), 12.5 + R * Math.cos(a), 13, 5.2 - 1.8 * t])
    }
    // flattened ribbons (≈ 2:1), lying on the face plate
    d = smin(d, sdTube(ax, y, 13 + (z - 13) * 1.9, hk) / 1.25, 1.6)
    // eyes: oval bulges in a sunk socket
    d = smax(d, -(sdEllipsoid(ax - 9.5, y - 1, z - 15.5, 6.4, 4.6, 2.6)), 0.8)
    d = smin(d, sdEllipsoid(ax - 9.5, y - 1, z - 14.6, 4.4, 3.2, 2.4), 0.8)
    // lozenge on the forehead
    {
      const lz = ax + Math.abs(y - 9) * 0.8 - 4.2
      d = smin(d, Math.max(lz, Math.abs(z - 15.6) - 1.0), 1.0)
    }
    // nostril curls on the snout
    d = smax(d, -(len2(ax - 5.5, y + 15.5) - 1.6) + Math.max(0, 17.5 - z) * 0.5, 0.6)
    return d
  }
  return { sd, bounds: { min: [-30, -27, -4.5], max: [30, 26, 28] } }
}
