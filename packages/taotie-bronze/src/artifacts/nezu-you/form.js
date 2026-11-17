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

// ------------------------------------------------------------------ knob: a mushroom — a broad grooved cap on a short stalk

/** distance to a closed (r, y) outline of revolution, ignoring its edges on the axis (r = 0); signed, inside < 0 */
function sdProfile(r, y, P) {
  let d = Infinity, inside = false
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
    const a = P[j], b = P[i]
    const bx = b[0] - a[0], by = b[1] - a[1]
    if ((a[1] > y) !== (b[1] > y) && r < a[0] + ((y - a[1]) * bx) / by) inside = !inside
    if (a[0] < 1e-6 && b[0] < 1e-6) continue
    const qx = r - a[0], qy = y - a[1]
    const t = Math.min(1, Math.max(0, (qx * bx + qy * by) / (bx * bx + by * by)))
    d = Math.min(d, len2(qx - bx * t, qy - by * t))
  }
  return inside ? -d : d
}
/** centripetal-ish Catmull-Rom through [r, y] knots (open), n samples per span */
function spline2(K, n = 6) {
  const out = []
  for (let i = 0; i < K.length - 1; i++) {
    const p0 = K[Math.max(0, i - 1)], p1 = K[i], p2 = K[i + 1], p3 = K[Math.min(K.length - 1, i + 2)]
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t
      out.push([0, 1].map((c) => 0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3)))
    }
  }
  out.push(K[K.length - 1])
  return out
}

/** knob outline (r, y) above the lid apex (y = 0 = LV.apex), stalk foot → rim → crown (mm) */
export const KNOB = {
  // photo-32 (≈ 3.75 px/mm at the knob through the fitted camera): cap Ø ≈ 39 (147 px), stalk Ø ≈ 22.5 (85 px) —
  // ≈ 0.185 of the lid's Ø 211 and 0.58 of the cap; cap ≈ 25 mm tall, widest ≈ 20.5 mm below the crown, then cut
  // back under to the stalk over ≈ 4 mm; the stalk shows ≈ 21 mm above the lid. A broad round crown (r ≈ 7.6 at
  // 2.8 mm down, ≈ 15 at 7 mm), near-upright sides. ≈ 8 deep wavy grooves from the crown to the rim.
  outline: [
    [14.6, -4.5], [13.6, -2.2], [12.2, -0.2], [11.4, 2.5], [11.1, 7], [11.1, 13], [11.4, 16.6], [12.4, 18.6],
    [14.6, 19.7], [17.0, 20.5], [18.8, 21.4], [19.6, 22.6], [19.7, 24], [19.3, 26.5], [18.6, 29.5], [17.6, 32.4],
    [16.0, 35.4], [13.6, 38.2], [10.4, 40.6], [6.6, 42.6], [3.2, 43.6], [0, 44],
  ],
  top: 44,
  grooves: { pitch: 3.5, depth: 1.5, waves: 12, amp: 0.85, centre: 26, radius: 18 },
}

/**
 * The mushroom knob: a body of revolution (KNOB.outline) with a single-start helical groove winding from the crown
 * down to the rim — on the bronze it reads as stacked wavy tiers (photo-32), each tier's lower edge dropping steeply
 * into the groove like an overlapping scale, the floor ramping out to the next tier. Local frame: y = 0 at the lid
 * apex, the stalk sunk 4.5 mm into the lid.
 */
export function knobSDF() {
  const K = KNOB.outline
  const P = [[0, K[0][1]], ...spline2(K, 6)]
  const G = KNOB.grooves
  // the outline's distance, tabulated on a 0.1 mm (r, y) grid and read bilinearly (exact to ≪ a voxel, 10× faster)
  const h = 0.1, r1 = 30, y0 = -9, y1 = KNOB.top + 6
  const nr = Math.round(r1 / h) + 1, ny = Math.round((y1 - y0) / h) + 1
  const T = new Float32Array(nr * ny)
  for (let j = 0; j < ny; j++) for (let i = 0; i < nr; i++) T[j * nr + i] = sdProfile(i * h, y0 + j * h, P)
  const prof = (r, y) => {
    const u = Math.min(nr - 1.001, r / h), v = Math.min(ny - 1.001, Math.max(0, (y - y0) / h))
    const i = Math.floor(u), j = Math.floor(v), fu = u - i, fv = v - j, k = j * nr + i
    return (T[k] * (1 - fu) + T[k + 1] * fu) * (1 - fv) + (T[k + nr] * (1 - fu) + T[k + nr + 1] * fu) * fv
  }
  const sd = (x, y, z) => {
    const r = len2(x, z)
    let d = prof(r, y)
    if (d < 3 && y > 20.6) {
      // u ≈ arc length from the crown (polar angle about the cap's centre), θ round the axis
      const u = G.radius * Math.atan2(r, y - G.centre)
      const th = Math.atan2(z, x)
      const fade = Math.min(1, Math.max(0, (u - 2.5) / 3)) * Math.min(1, Math.max(0, (31.6 - u) / 1.6))
      if (fade > 0) {
        const ph = (u + (G.pitch * th) / (Math.PI * 2) + G.amp * Math.sin(G.waves * th)) / G.pitch
        const t = ph - Math.floor(ph)
        const bump = t < 0.36 ? 1 - t / 0.36 : t > 0.8 ? 1 - (1 - t) / 0.2 : 0
        d += G.depth * fade * bump * bump * (3 - 2 * bump)
      }
    }
    return d
  }
  return { sd, bounds: { min: [-23.5, -7.5, -23.5], max: [23.5, KNOB.top + 4, 23.5] } }
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

/** the ram head's proportions (mm, local frame of pivotHeadSDF) — dossier §b.5 */
export const HEAD = {
  // photo-31 head-on (≈ 5.2 px/mm at the head: the 27 mm strap reads 141 px): 47 across the horn curls (245 px),
  // ≈ 37 tall (horn tops 205 → snout 168), lozenge 184, eyes 178.5 at ± 10.3. photo-32 (from the front right, the
  // head near side-on at the left of the neck) through the fitted camera: the horn curl's outer face stands at
  // z ≈ 116 and the muzzle at z ≈ 122–128, i.e. ≈ 22 and ≈ 28–34 mm proud of the neck wall (r 94.2) and 8–14 mm in
  // front of the strap's outer face (113.8): the head masks the strap end, not the other way round.
  hornX: 14.6, hornY: 5.6, hornR: 5.0, // the C curl's centre and radius (each side)
  brow: 26.5, // face plane (z) at the brow
  snout: 33.5, // the muzzle's front (z)
}

/**
 * A ram head in the round riding over the bail's pivot (photo-31, photo-32). A skull block on the wall carries two
 * horn tubes that leave the crown beside the strap, sweep out along the top and curl OUT, DOWN and back IN (a C, a
 * hollow in its eye); under them a trapezoid face plate (41 mm at the brow → 22 at the snout) leaning out to a
 * projecting muzzle with two nostrils; a lozenge on the brow above two bulging eyes under hooked brows. The strap's
 * lower end (z 12.6–19.6 here) runs down into the skull between the horns and is hidden by them.
 * Local frame: +Z out of the wall (z = 0 = wall surface), +Y up, y = 0 at the mounting height (vessel y 190).
 */
export function pivotHeadSDF() {
  const H = HEAD
  // horn centre line (right side; mirrored by |x|): crown → out along the top → C curl out, down and back in
  const horn = [[6.5, 10.6, 13.5, 4.0], [10.5, 11.2, 17.5, 4.5]]
  for (let i = 0; i <= 10; i++) {
    const a = ((100 - i * 25) * Math.PI) / 180 // 100° → -150°
    horn.push([H.hornX + H.hornR * Math.cos(a), H.hornY + H.hornR * Math.sin(a), 19.5 + 3 * Math.sin((i / 10) * Math.PI), 4.6 - 1.7 * (i / 10)])
  }
  const sd = (x, y, z) => {
    const ax = Math.abs(x)
    // skull: the mass on the wall behind the horns, swallowing the strap's lower end
    let d = sdRBox3(x, y - 5.5, z - 6, 16.5, 7.5, 10.5, 4)
    // face plate: trapezoid, the sides drawing in toward the front, the face leaning out toward the muzzle
    const w = 11 + 9.5 * Math.min(1, Math.max(0, (y + 23) / 22)) - 0.12 * Math.max(0, z - 8)
    const plate2 = Math.max(ax - w, Math.abs(y + 11.5) - 12)
    const front = H.brow + Math.max(0, -y - 5) * 0.2
    d = smin(d, extrude(plate2, z, -4, front, 3), 2.5)
    // muzzle: a broad pad projecting past the face, rounded
    d = smin(d, sdRBox3(x, y + 20.2, z - (H.snout - 6.5), 10.5, 4.4, 6.5, 3.2), 2.2)
    // horns: tapering tubes in the round (skipped where their box is far from the surface)
    const hb = sdRBox3(ax - 14, y - 9, z - 19, 12, 12.5, 10.5, 0)
    if (hb < d + 2) d = smin(d, sdTube(ax, y, z, horn), 1.6)
    // the hollow in the eye of each curl
    d = smax(d, -sdEllipsoid(ax - H.hornX - 0.6, y - H.hornY + 0.3, z - 22, 2.4, 2.2, 4.5), 0.8)
    // the face details below change the field by < 4 mm: far from the surface return a safe bound (cheap)
    if (d > 6) return d - 4
    if (d < -6) return d + 4
    // brow ridge across the top of the face, under the horn roots
    d = smin(d, sdRBox3(x, y + 1.6, z - (front - 1.2), 13.5, 2.0, 2.4, 1.6), 1.2)
    // lozenge on the brow (raised)
    const fz = H.brow + 0.2
    d = smin(d, Math.max(ax + Math.abs(y + 5.8) * 0.85 - 4.2, Math.abs(z - fz - 0.6) - 1.6), 0.8)
    // eyes: sunk sockets with bulging round eyeballs
    const ez = H.brow + 1.3
    d = smax(d, -sdEllipsoid(ax - 10.3, y + 11.5, z - ez, 5.6, 4.8, 3.2), 0.8)
    d = smin(d, sdEllipsoid(ax - 10.3, y + 11.5, z - ez + 0.2, 3.6, 3.3, 3.3), 0.6)
    // hooked brows over the eyes
    d = smin(d, extrude(sdArc2(ax, y, [10.3, -11.5], 6.1, Math.PI * 0.12, Math.PI * 0.95, 1.0), z, ez - 2, ez + 1.6, 0.6), 0.5)
    // nostrils in the muzzle's front
    d = smax(d, -sdEllipsoid(ax - 5, y + 21, z - H.snout, 2.0, 1.7, 2.6), 0.6)
    // mouth: a shallow slit under the muzzle
    d = smax(d, -sdRBox3(x, y + 24.4, z - (H.snout - 2), 7, 0.7, 3, 0.5), 0.4)
    return d
  }
  return { sd, bounds: { min: [-28, -31, -7], max: [28, 21, 39] } }
}
