// nezu-fanglei — form: the measured stack (dossier §b), the swelling belly and shoulder profile, flange
// outlines and paths. Units mm, Y up, the foot stands on y = 0, front (+Z) = the face with the low lug.
// H = 503 mm is INFERRED (scale argued in reference/nezu-fanglei/dossier.md §a.3); every proportion is
// measured by solving the cameras of photo-37 (front: el ≈ 10°, ≈ 3.8 m, near-orthographic) and photo-36
// (az ≈ 69°) against these numbers (.work/r7-lei/solve, dossier §b.1).

import * as THREE from 'three'

export const H = 503

/** register levels (y, mm) — dossier §b.2 */
export const LV = {
  base: 4, // plain base strip under the foot frieze
  foot: 21.5, // foot top = belly underside
  bellyBorder: 35, // plain border curling under the belly
  narrow: 50.5, // narrow frieze (kui / snakes) 35 → 50.5
  low: 101, // third register (lug mask, lozenge ground) 50.5 → 101
  second: 178, // second register (lower taotie) 101 → 178
  main: 263, // main mask register 178 → 263 = belly top = shoulder crease
  shoulderField: [273, 318], // shoulder frieze field
  shoulder: 325, // shoulder top = ledge = collar base
  collar: 376, // collar top (lid skirt sits on it)
  skirt: 8, // lid skirt height
  fascia: 4, // lid eave edge
  rise: 70, // eave (388) → ridge: photo-37's flattened slope ends at ≈ 455–458 (photo-36 alone would read ≈ 90; dossier §b.2)
  ridge: 458,
  knobEave: 482, // knob roof eave (post 458 → 482); round 8: photo-37 shows the cap ≈ 0.55 × its width tall, a third of it vertical fascia
  top: 503,
}

/** plan: depth (z) : width (x) — photo-36 solved at azimuth ≈ 69° (dossier §b.1); the ±X faces are the narrow ones */
export const RHO = 0.75

/** plan half WIDTHS (x); every half depth (z) is RHO × these */
export const PLAN = {
  foot: 62.5,
  collar: 85.5,
  skirt: 85.5,
  eave: 88,
  ridgeHalf: 44, // round 8: face-lid's field still ±43 mm at 90 % of the slope, photo-36's ridge half ≈ 45–48 [est]
  knob: { eave: 19.5, depth: 15, post: [8.5, 7.5], ridge: 0.3 },
}

// half width of the belly and shoulder (front face plane z = half) — dossier §b.3, read off photo-37
const BELLY = [[21.5, 66.5], [35, 69.5], [50.5, 75.5], [70, 85.5], [101, 98.8], [125, 110.5], [150, 120.5], [178, 127.2], [215, 129.8], [245, 130.4], [263, 130.3]]
const SHOULDER = [[263, 130.3], [276, 130.6], [294, 128], [310, 122], [319, 116], [325, 108.5]]

function monotone(rows) {
  const xs = rows.map((r) => r[0]), ys = rows.map((r) => r[1])
  const n = xs.length
  const d = []
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]))
  const m = ys.map((_, i) => (i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2))
  return (x) => {
    x = Math.min(xs[n - 1], Math.max(xs[0], x))
    let i = 0
    while (i < n - 2 && x > xs[i + 1]) i++
    const h = xs[i + 1] - xs[i], t = (x - xs[i]) / h
    const t2 = t * t, t3 = t2 * t
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1]
  }
}
export const bellyHalf = monotone(BELLY)
export const shoulderHalf = monotone(SHOULDER)
/** half width at any body height (foot … collar) */
export function halfAt(y) {
  if (y < LV.foot) return PLAN.foot
  if (y <= LV.main) return bellyHalf(y)
  if (y <= LV.shoulder) return shoulderHalf(y)
  return PLAN.collar
}

/** arc length up the belly / shoulder wall (front centre line) from y0 to y1 */
export function arcLen(y0, y1, f = halfAt) {
  let s = 0
  const n = Math.max(4, Math.ceil(Math.abs(y1 - y0) / 1.5))
  for (let i = 1; i <= n; i++) {
    const a = y0 + ((y1 - y0) * (i - 1)) / n, b = y0 + ((y1 - y0) * i) / n
    s += Math.hypot(b - a, f(b) - f(a))
  }
  return s
}

// ------------------------------------------------------------------ paths

/**
 * A flange path through world points (bottom → top) with an outward direction per point.
 * Extrapolates linearly past both ends (caps run beyond the register).
 */
export function polyPath(pts, outs) {
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + pts[i].distanceTo(pts[i - 1]))
  const L = cum[cum.length - 1]
  const last = pts.length - 1
  return {
    isPath: true, length: L,
    frame(s) {
      let i = 1
      while (i < last && cum[i] < s) i++
      const t = (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1)
      const p = pts[i - 1].clone().lerp(pts[i], t)
      const d = pts[i].clone().sub(pts[i - 1]).normalize()
      const n = outs[i - 1].clone().lerp(outs[i], Math.min(1, Math.max(0, t)))
      n.addScaledVector(d, -n.dot(d)).normalize()
      return { p, n, d, b: new THREE.Vector3().crossVectors(d, n) }
    },
  }
}

/**
 * Toothed flange outline (σ along the path from its bottom, t outward), CCW, root at t = −e.
 * The photo-37 flanges are thick slabs cut by narrow slots from the crest (not T-notched blocks): `slots`
 * = σ of each slot centre, `w` slot width, `dep` slot depth (mm). `top` / `bottom`: end caps
 * { over (mm past the end along σ), up (extra projection), back } — the squared Γ caps.
 */
export function toothed(L, p, { slots = [], w = 2.4, dep = 6, e = 2.5, top = null, bottom = null, r = 0.8 } = {}) {
  const crest = []
  const sT = top ? L + (top.over ?? 0) : L
  const sB = bottom ? -(bottom.over ?? 0) : 0
  // crest from the top end down to the bottom end (CCW with root first: root runs low σ → high σ)
  if (top) {
    const pt = p + (top.up ?? 0)
    crest.push([sT, -e + (top.under ?? e)], [sT, pt - r], [sT - r, pt], [L - (top.len ?? 8), pt], [L - (top.len ?? 8) - 1, p])
  } else crest.push([L, p - r], [L - r, p])
  for (const s of [...slots].sort((a, b) => b - a)) {
    if (s > L - 3 || s < 3) continue
    crest.push([s + w / 2, p], [s + w / 2, p - dep + 0.6], [s + w / 2 - 0.6, p - dep], [s - w / 2 + 0.6, p - dep], [s - w / 2, p - dep + 0.6], [s - w / 2, p])
  }
  if (bottom) {
    const pb = p + (bottom.up ?? 0)
    crest.push([(bottom.len ?? 8) + 1, p], [bottom.len ?? 8, pb], [sB + r, pb], [sB, pb - r], [sB, -e + (bottom.under ?? e)])
  } else crest.push([r, p], [0, p - r])
  const start = sB, end = sT
  return [[start, -e], [end, -e], ...crest]
}

/** evenly spaced slot positions over (a, b): n slots */
export function slotRow(a, b, n) {
  const out = []
  for (let i = 0; i < n; i++) out.push(a + ((b - a) * (i + 0.5)) / n)
  return out
}

/**
 * Incised marks on a flange's flanks (photo-37 / photo-36: a contour line along the crest and a T / L between
 * slots). Returns polylines in (σ, t).
 */
export function flankMarks(L, p, slots, { e = 2.5, inset = 1.4, sB = 0, sT = L } = {}) {
  const lines = []
  const s = [sB + 1, ...[...slots].sort((a, b) => a - b), sT - 1]
  for (let i = 0; i < s.length - 1; i++) {
    const a = s[i] + 2.2, b = s[i + 1] - 2.2
    if (b - a < 3.5) continue
    const m = (a + b) / 2
    // a T: a bar along the root half, a stem toward the crest (the photographs read them as ⊥ marks)
    lines.push([[a + 0.6, p * 0.38], [b - 0.6, p * 0.38]])
    lines.push([[m, p * 0.38], [m, p - inset - 0.8]])
  }
  void e
  return lines
}
