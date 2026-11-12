// Shared anatomy of the optic nerve head, in millimetres, in the "nerve-head
// frame": x runs back along the nerve (x < 0 is inside the eye), y is up, and
// z points toward the nose. The slice face is the plane z = 0.
//
// These numbers drive both the 3-D geometry and the painted section, so the
// two always agree. Where a dimension is a round textbook value rather than a
// cited measurement it is listed as such in content.js (CAVEATS).
import { smooth, lerp } from './util.js'

export const D2R = Math.PI / 180
export const THETA = 20 * D2R       // the disc sits this far to the nasal side of the eye's rear pole
export const RE = 12                // outer radius of the globe
export const WALL_C = -12.25        // centre (x) of the inner wall surfaces — sclera is thickest at the back
export const R_SCL_IN = 11.25       // sclera / choroid boundary
export const R_CHOR_IN = 11.0       // choroid / retina boundary (Bruch's membrane)
export const R_RET_IN = 10.75       // inner surface of the retina
export const DISC_R = 0.88          // radius of the opening the nerve leaves through
export const LAM_T = 0.3            // lamina cribrosa thickness
export const R_SAS = 2.0, R_DURA = 2.4, NERVE_END = 12
export const SLICE_Z = -0.14        // the painted section sits just behind the cut
export const TUBE_Z = -0.07         // in-plane bundles and vessels sit between the cut and the paint

// One bundle per laminar pore. Pores ~25 µm across and beams ~45 µm thick match in-vivo
// OCT of healthy human eyes (24.6 µm and 46.7 µm, Wang et al. 2013).
export const LANES = 11
export const PORE = 0.025
export const laneY = i => 0.12 + i * 0.07
/** front face of the lamina cribrosa: bowed backward in the middle */
export const lamFront = y => -0.95 + 0.1 * (1 - Math.min(1, (y / 0.9) ** 2))
/** radius of the nerve tissue itself at depth x */
export const nerveR = x => (x <= -0.62 ? 0.88 + 0.02 * smooth(-1.5, -0.62, x) : 0.9 + 0.6 * smooth(-0.62, 0.45, x))
/** the inner surface of the nerve head, with its small central cup */
export const discSurface = y => -1.5 + 0.2 * (1 - smooth(0.06, 0.5, Math.abs(y)))
export const wallX = (r, y) => WALL_C + Math.sqrt(Math.max(0, r * r - y * y))

// The micro stage: two pores and the beam between them, upper half of the nerve
export const MICRO = { lane: 5, x: lamFront(0.478), y: (laneY(5) + laneY(6)) / 2 }

function catmull(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t
  return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
}

/**
 * One nerve-fibre bundle in the plane of the slice: over the retina, round
 * the rim of the disc, through its pore in the lamina, and out along the
 * nerve. Returns samples [{x, y, r, bump}] — r is the bundle's radius and
 * bump (0..1) marks the prelaminar stretch that swells in NAION.
 * Lane 0 is nearest the centre of the nerve and rides on top in the retina;
 * the last lane hugs the rim.
 */
export function bundle(i, sign = 1, perSpan = 10) {
  const yT = laneY(i)
  const rr = R_RET_IN + 0.008 + i * 0.012
  const a0 = lerp(16, 62, i / (LANES - 1)) * D2R
  const yB = yT + 0.42
  const a1 = Math.asin(yB / rr)
  const xr = wallX(rr, yB), lf = lamFront(yT)
  const pts = []
  for (let k = 0; k < 5; k++) { const a = lerp(a0, a1, k / 4); pts.push([WALL_C + rr * Math.cos(a), rr * Math.sin(a)]) }
  pts.push([xr + 0.035, yT + 0.2], [xr + 0.14, yT + 0.06], [xr + 0.3, yT], [lf, yT], [lf + LAM_T, yT],
    [-0.2, yT * 1.25], [0.45, yT * 1.62], [3, yT * 1.62], [7, yT * 1.62], [NERVE_END, yT * 1.62])
  const out = []
  for (let s = 0; s < pts.length - 1; s++) {
    const p0 = pts[Math.max(0, s - 1)], p1 = pts[s], p2 = pts[s + 1], p3 = pts[Math.min(pts.length - 1, s + 2)]
    for (let k = 0; k < perSpan; k++) {
      const t = k / perSpan
      out.push([catmull(p0[0], p1[0], p2[0], p3[0], t), catmull(p0[1], p1[1], p2[1], p3[1], t)])
    }
  }
  out.push(pts[pts.length - 1])
  return out.map(([x, y]) => {
    const pre = lerp(0.0058, 0.027, smooth(xr + 0.02, xr + 0.28, x))
    const inLam = lerp(pre, 0.0125, smooth(lf - 0.06, lf + 0.02, x))
    const r = lerp(inLam, 0.047, smooth(lf + LAM_T - 0.02, lf + LAM_T + 0.3, x))
    const bump = smooth(xr - 0.25, xr + 0.12, x) * (1 - smooth(lf - 0.05, lf + 0.02, x)) * (y > yT + 0.4 ? smooth(yT + 0.9, yT + 0.4, y) : 1)
    return { x, y: y * sign, r, bump, lane: i }
  })
}

/** A point on the inside of the eye, given millimetres from the disc centre: u toward the temple, v up. */
export function fundus(u, v, lift = 0) {
  const d = Math.hypot(10.72, u, v), r = R_RET_IN - lift
  return [WALL_C + (r * 10.72) / d, (r * v) / d, (-r * u) / d]
}
export const FOVEA = { u: 3.9, v: -0.3 } // the disc lies 3–4 mm to the nasal side of the fovea
