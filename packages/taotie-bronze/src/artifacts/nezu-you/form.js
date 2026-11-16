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
  y0: 200, // the strap's lower end, inside the pivot head (between its horns)
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

/** 2D distance to a thick circular arc: centre c, radius R, from angle a0 to a1 (rad, a1 > a0), half thickness h */
function sdArc2(x, y, c, R, a0, a1, h) {
  const dx = x - c[0], dy = y - c[1]
  let a = Math.atan2(dy, dx)
  while (a < a0) a += Math.PI * 2
  if (a <= a1) return Math.abs(len2(dx, dy) - R) - h
  const e0 = [c[0] + R * Math.cos(a0), c[1] + R * Math.sin(a0)], e1 = [c[0] + R * Math.cos(a1), c[1] + R * Math.sin(a1)]
  return Math.min(len2(x - e0[0], y - e0[1]), len2(x - e1[0], y - e1[1])) - h
}
/** 2D distance to a segment, half thickness h */
function sdSeg2(x, y, a, b, h) {
  const bx = b[0] - a[0], by = b[1] - a[1], qx = x - a[0], qy = y - a[1]
  const t = Math.min(1, Math.max(0, (qx * bx + qy * by) / (bx * bx + by * by)))
  return len2(qx - bx * t, qy - by * t) - h
}
/** extrude a 2D distance between z0 and z1 with rounded edges r */
function extrude(d2, z, z0, z1, r) {
  const dz = Math.abs(z - (z0 + z1) / 2) - (z1 - z0) / 2
  return len2(Math.max(d2 + r, 0), Math.max(dz + r, 0)) + Math.min(Math.max(d2 + r, dz + r), 0) - r
}

// ------------------------------------------------------------------ knob: a tall tiered bud on a waisted stem

/**
 * photo-32: a TALL bud that widens upward to a broad, rounded top (≈ 29 mm across, ≈ 49 mm tall over the apex) on a
 * waisted stem (≈ 12 mm), its flank cut into ≈ 7 crisp wavy tiers like overlapping scales. Seen from the front in photo-31 it
 * hides behind the bail. Local frame: the lid apex at y = 0. (One photograph: the tier count is read off it.)
 */
export function knobSDF() {
  const R = (y) => {
    if (y < 3) return 6.4 + 7 * Math.max(0, 1 - y / 3) ** 2 // flaring into the lid
    if (y < 10) return 6.2 - 0.9 * Math.sin((Math.PI * (y - 3)) / 7) // the waisted stem
    if (y < 33) { const t = (y - 10) / 23; return 6.2 + 6.4 * Math.sin((t * Math.PI) / 2) ** 0.8 } // the bud widens upward
    return 0
  }
  const sd = (x, y, z) => {
    const r = len2(x, z)
    // body of revolution up to y 33, then a rounded dome cap to y 42
    let d = y < 33 ? Math.max(r - R(y), -y - 3) : Infinity
    d = smin(d, sdEllipsoid(x, y - 32.5, z, 12.6, 9.5, 12.6), 2.2)
    // ≈ 7 crisp wavy tiers on the flank (scales: each tier's lower edge overhangs the next)
    if (y > 11 && y < 39) {
      const ang = Math.atan2(z, x)
      const tier = (y - 11 + 1.1 * Math.sin(ang * 7)) / 3.9
      const fr = tier - Math.floor(tier)
      d += 1.2 * Math.max(0, 1 - fr / 0.22) ** 2 * (y < 35 ? 1 : (39 - y) / 4)
    }
    return d
  }
  const k = 1.15 // photo-32: a tall bud, ≈ 0.14 of the lid's span across
  return { sd: (x, y, z) => sd(x / k, y / k, z / k) * k, bounds: { min: [-19.5, -3.5, -19.5], max: [19.5, 50, 19.5] } }
}

// ------------------------------------------------------------------ lid horns (犄角) at the ends of the long axis

/** 2D signed distance to a closed polygon */
function sdPoly2(x, y, P) {
  let d = Infinity, inside = false
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
    const a = P[j], b = P[i]
    const bx = b[0] - a[0], by = b[1] - a[1], qx = x - a[0], qy = y - a[1]
    const t = Math.min(1, Math.max(0, (qx * bx + qy * by) / (bx * bx + by * by)))
    d = Math.min(d, len2(qx - bx * t, qy - by * t))
    if ((a[1] > y) !== (b[1] > y) && x < a[0] + ((y - a[1]) * bx) / by) inside = !inside
  }
  return inside ? -d : d
}

/**
 * photo-31 (both ends) and photo-32: each horn is a FLAT crescent BLADE in the vessel's XY plane, ≈ 8–9 mm thick
 * (front to back), standing on the eave at the end of the long axis: a broad base, a convex outer edge rising to one tip
 * (≈ 124 mm out, ≈ 286 mm up) and a concave inner edge sweeping back down to the lid; a small round boss on the face
 * (photo-31 left horn, photo-32 right horn). Read off photo-31 at 4.8 px/mm with × 1.12 on x for the horn plane lying
 * ≈ 110 mm behind the front face (dossier §b.1). Built for the +X end in vessel space.
 */
export function hornSDF() {
  const P = [[95, 249], [114, 250.5], [121.5, 260], [124.6, 273], [125, 286.2], [121.6, 286.8], [118.2, 278.5], [112.6, 271.2],
    [105.6, 265.6], [99.4, 262.4], [95.5, 258.5]]
  const sd = (x, y, z) => {
    x /= RK
    let d = extrude(sdPoly2(x, y, P) + 0.6, z, -4.4, 4.4, 2.0)
    // clip the inner side flat against the lid (the horn grows out of the eave)
    d = smax(d, -(x - 92), 2)
    // a small round boss on each face
    d = smin(d, sdEllipsoid(x - 113.5, y - 261, Math.abs(z) - 4.2, 3.6, 3.6, 2.1), 1.0)
    return d
  }
  return { sd, bounds: { min: [86 * RK, 240, -10], max: [129 * RK, 291, 10] } }
}

// ------------------------------------------------------------------ pivot heads (the bail's ends)

/**
 * photo-31 (head-on, ≈ 5 px/mm at the head through the fitted camera): ≈ 47 mm across the horns and ≈ 40 mm tall
 * (horn tops ≈ 204, lozenge ≈ 184, eyes ≈ 178.5, snout ≈ 166 mm up; mounted at y 190). Two FLAT ribbon
 * C-horns (≈ 6.5 mm bands) leave the crown, run out along the top and curl OUT and DOWN, their tips hooking back in
 * under a dark hollow; below them a trapezoid face plate (≈ 41 mm wide at the brow, narrowing down) carries a
 * lozenge on the brow ABOVE two bulging round eyes (≈ 6.5 mm, at ± 10.5 mm, each under a hooked brow), and ends in a
 * short broad snout. It stands ≈ 20 mm proud of the neck; the strap runs into the top of the head.
 * Local frame: +Z out of the wall (z = 0 = wall surface), +Y up, centre of the face at y = 0.
 */
export function pivotHeadSDF() {
  const sd = (x, y, z) => {
    const ax = Math.abs(x)
    // face plate: a trapezoid slab, 41 wide at the brow → 22 at the snout, front face leaning out at the bottom
    const w = 11 + 9.5 * Math.min(1, Math.max(0, (y + 23) / 22))
    const plate2 = Math.max(ax - w, Math.abs(y + 11.8) - 11.8)
    const front = 12.5 + Math.max(0, -y - 8) * 0.12
    let d = extrude(plate2, z, -4, front, 3)
    // short broad snout pad
    d = smin(d, extrude(Math.max(ax - 10.5, Math.abs(y + 20.5) - 3.6), z, 0, front + 2.2, 2.4), 1.5)
    // horns: flat C ribbons lying on the face plane above the plate, curling out and down, tip hooking back in
    const hx = ax, hy = y
    // (photo-31: each horn is a big domed lobe ≈ 22 × 16 mm, its tip hooking back in under a slot)
    let h2 = sdSeg2(hx, hy, [7.5, 9.2], [15, 9.2], 5.2) // crown bar out from beside the strap
    h2 = Math.min(h2, sdArc2(hx, hy, [16, 5], 4.6, -Math.PI * 0.6, Math.PI * 0.5, 5.4)) // the broad C, out and down
    d = smin(d, extrude(h2, z, -3, 13, 4), 1.4)
    // the strap's tongue runs down between the horns to the lozenge
    d = smin(d, extrude(Math.max(ax - 6.5, Math.abs(y - 7) - 7.5), z, -3, 10.5, 1.5), 1.2)
    // a dark slot hollow inside each C, opening inward
    d = smax(d, -extrude(sdSeg2(hx, hy, [10, 5], [16.5, 5.4], 1.7), z, 6, 22, 0.8), 0.5)
    // lozenge on the brow (raised), at the top of the plate between the horns
    d = smin(d, Math.max(ax + Math.abs(y + 4.2) * 0.85 - 4.2, Math.abs(z - front - 0.4) - 1.6), 0.8)
    // eyes: sunk sockets with bulging round eyeballs, BELOW the lozenge
    d = smax(d, -sdEllipsoid(ax - 10.3, y + 11.5, z - front, 5.4, 4.6, 2.6), 0.8)
    d = smin(d, sdEllipsoid(ax - 10.3, y + 11.5, z - front + 0.6, 3.4, 3.2, 2.8), 0.6)
    // hooked brows over the eyes
    d = smin(d, extrude(sdArc2(ax, y, [10.3, -11.5], 5.9, Math.PI * 0.12, Math.PI * 0.95, 0.9), z, front - 1, front + 1.2, 0.6), 0.5)
    // nostrils
    d = smax(d, -(len2(ax - 5, y + 21) - 1.7) + Math.max(0, front + 1.5 - z) * 0.5, 0.6)
    return d
  }
  return { sd, bounds: { min: [-30, -28, -4.5], max: [30, 19, 23] } }
}
