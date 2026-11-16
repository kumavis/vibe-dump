// Nezu bo 蟠螭文鎛 (90120) — the form, measured from the owner's two photographs (reference/nezu-bo/dossier.md).
//
// A bell of pointed-oval section standing on its flat mouth: two broad faces meeting at rounded edges (铣) at the
// ends of the long axis (X), a flat closed top (舞) carrying the openwork crown. The long axis is X, the faces look
// to ±Z, front = +Z. All mm, Y up, the mouth on y = 0.
//
// Section at height y:  x = A(y) · sin θ · (1 + s |sin θ|^n) / (1 + s),  z = K · A(y) · cos θ,  θ ∈ (−π, π]
//   (θ = 0 the front centre line, ±π/2 the edges, π the back centre). s, n pinch the ends into an edge: a rounded
//   point of small radius, as photo-19's mouth shows at the left end.
// A(y): half the length of the section, read off photo-18's silhouette row by row (the ends lie at z = 0, so the
//   silhouette IS the end line) with the camera's depth change top → bottom divided out (dossier §b). The body
//   widens from the top to about the middle of the boss zone and is near-straight below, swelling ≈ 1 % above the mouth.
// K = depth / length of the section: 0.92, from the joint camera fit on both photographs (dossier §b.1–2) —
//   the least certain number here (±0.08).

export const H = 450 // body: mouth (y 0) to the flat top
export const K = 0.92
export const PINCH = { s: 0.15, n: 8 }
export const WALL = 7 // wall thickness at the mouth (inferred: the photographs show the mouth only edge-on)
export const TOP = 12 // thickness of the top plate (inferred)

/** half-length of the section (mm) at height y: measured rows (dossier §b.2) */
const HALF = [[0, 175.6], [30, 175.8], [105, 176.6], [170, 176.6], [232, 176], [299, 173.4], [344, 170.0], [373, 167.3], [418, 162.1], [450, 155.4]]

export function halfLength(y) {
  const T = HALF
  if (y <= T[0][0]) return T[0][1]
  if (y >= T[T.length - 1][0]) return T[T.length - 1][1]
  let i = 0
  while (T[i + 1][0] < y) i++
  // Catmull-Rom through the table (non-uniform spacing handled by the local slopes)
  const p0 = T[Math.max(0, i - 1)], p1 = T[i], p2 = T[i + 1], p3 = T[Math.min(T.length - 1, i + 2)]
  const h = p2[0] - p1[0], t = (y - p1[0]) / h
  const m1 = ((p2[1] - p0[1]) / (p2[0] - p0[0] || 1)) * h, m2 = ((p3[1] - p1[1]) / (p3[0] - p1[0] || 1)) * h
  const t2 = t * t, t3 = t2 * t
  return (2 * t3 - 3 * t2 + 1) * p1[1] + (t3 - 2 * t2 + t) * m1 + (-2 * t3 + 3 * t2) * p2[1] + (t3 - t2) * m2
}

/** unit section (A = 1) */
export function sectionXZ(theta) {
  const s = Math.sin(theta), c = Math.cos(theta)
  const as = Math.abs(s)
  return [(s * (1 + PINCH.s * Math.pow(as, PINCH.n))) / (1 + PINCH.s), K * c]
}

// arc length of the unit section from θ = 0 to θ ∈ [0, π/2], tabulated; the panels are laid ANGLE-PROPORTIONALLY
// (panel x = fraction of the half-face arc), as a carver fits one design to a tapering mould face
const NT = 2048
const ARC = new Float64Array(NT + 1)
{
  let prev = sectionXZ(0)
  for (let i = 1; i <= NT; i++) {
    const p = sectionXZ((i / NT) * (Math.PI / 2))
    ARC[i] = ARC[i - 1] + Math.hypot(p[0] - prev[0], p[1] - prev[1])
    prev = p
  }
}
export const ARC_END = ARC[NT] // unit half-face arc
/** θ ∈ [0, π/2] at a fraction f ∈ [0, 1] of the half-face arc */
export function thetaAt(f) {
  const a = Math.min(1, Math.max(0, f)) * ARC_END
  let lo = 0, hi = NT
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1
    if (ARC[m] < a) lo = m
    else hi = m
  }
  const t = (a - ARC[lo]) / (ARC[hi] - ARC[lo] || 1)
  return ((lo + t) / NT) * (Math.PI / 2)
}
/** fraction of the half-face arc at θ ∈ [0, π/2] */
export function fracAt(theta) {
  const x = (Math.min(Math.PI / 2, Math.max(0, theta)) / (Math.PI / 2)) * NT
  const i = Math.min(NT - 1, Math.floor(x))
  return (ARC[i] + (ARC[i + 1] - ARC[i]) * (x - i)) / ARC_END
}

/** the half-face panel width (mm) = the half-face arc where the body is widest */
export const PANEL_W = Math.round(176.6 * ARC_END * 10) / 10

/** outer surface point at (θ, y) */
export function pointAt(theta, y) {
  const A = halfLength(y)
  const [x, z] = sectionXZ(theta)
  return [A * x, y, A * z]
}

/** outward unit normal at (θ, y), central differences (smooth across the centre lines; the edge is a crease) */
export function normalAt(theta, y) {
  const e = 1e-4, ey = 0.05
  const a = pointAt(theta - e, y), b = pointAt(theta + e, y)
  const c = pointAt(theta, y - ey), d = pointAt(theta, y + ey)
  const t = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const v = [d[0] - c[0], d[1] - c[1], d[2] - c[2]]
  // outward = dθ × dy for θ increasing toward +X on the front (right-handed: x right, y up, z out)
  let n = [t[1] * v[2] - t[2] * v[1], t[2] * v[0] - t[0] * v[2], t[0] * v[1] - t[1] * v[0]]
  const p = pointAt(theta, y)
  if (n[0] * p[0] + n[2] * p[2] < 0) n = [-n[0], -n[1], -n[2]]
  const l = Math.hypot(n[0], n[1], n[2]) || 1
  return [n[0] / l, n[1] / l, n[2] / l]
}

/**
 * θ of a point on a face given its panel coordinate.
 * face: +1 front (+Z) | −1 back;  side: +1 the right half seen from outside | −1 the left;  f: fraction of the half-face
 */
export function faceTheta(face, side, f) {
  const th = thetaAt(f)
  return face > 0 ? side * th : Math.PI + side * th
}

// ------------------------------------------------------------------ the décor layout (body y, panel x; dossier §c)
// Read off photo-19 and photo-18 DEVELOPED onto the half-face panel through the fitted cameras
// (reference/nezu-bo/faces/dev-*.jpg, 4–8 px/mm, ruled every 10 mm): the borders of every register, the boss centres
// (also fitted with the cameras: x 59.7 / 139.4 / 213.0, rows 192 / 294 / 400), the panel's frame (a trapezoid,
// half-width 30.5 at the top → 32 at the foot), the edge strip.
export const LAYOUT = {
  mouth: [0, 18], // plain margin above the mouth (the lowest row of the field is worn almost flat)
  field: [18, 144.5], // the broad lower field (鼓部): large interlace
  border: [147.5, 161.5], // the broad raised border over the field
  rows: [[161.5, 215], [267, 319], [370, 432]], // three rows of three coiled bosses per half-face (枚)
  bands: [[222, 261], [326, 361.5]], // two bands of interlace between them (篆)
  ledges: [[215, 222], [261, 267], [319, 326], [361.5, 370], [432, 437.5]], // raised strips framing them (with their shadowed foot)
  topBand: [437.5, 450], // the band of twisted pairs round the top
  panel: { top: 30.5, bottom: 32, y: [161.5, 432] }, // the central panel (钲): frame outer edge, panel mm
  frame: 4.8, // the raised frame strips (mm): the panel's dark side frames ≈ 5 mm (face-panel)
  end: [243, PANEL_W], // the vertical strip along the edge (panel x)
  bosses: { x: [59.5, 139.5, 213], y: [189, 293, 401], r: 19, height: 13 },
  split: 146, // lower patch [0, split] (field + mouth), upper patch [split, H]: the seam lies in the plain gap under the border
}
