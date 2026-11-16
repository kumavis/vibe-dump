// nezu-fanglei — form: the measured stack (dossier §b), the swelling belly and shoulder profile, flange
// outlines and paths. Units mm, Y up, the foot stands on y = 0, front (+Z) = the face with the low lug.
// H = 503 mm is INFERRED (scale argued in reference/nezu-fanglei/dossier.md §a.3); every proportion is
// measured on photo-37 (front, camera ≈ 12° above the belly's mid height, its z-offsets corrected).

import * as THREE from 'three'

export const H = 503

/** register levels (y, mm) — dossier §b.2 */
export const LV = {
  base: 4.5, // plain base strip under the foot frieze
  foot: 25, // foot top = belly underside
  bellyBorder: 36, // plain border curling under the belly
  narrow: 52, // narrow frieze (kui / snakes) 36 → 52
  low: 101, // third register (lug mask, lozenge ground) 52 → 101
  second: 178, // second register (lower taotie) 101 → 178
  main: 266, // main mask register 178 → 266 = belly top = shoulder crease
  shoulderField: [277, 323], // shoulder frieze field
  shoulder: 331, // shoulder top = ledge = collar base
  collar: 382, // collar top (lid skirt sits on it)
  skirt: 11.5, // lid skirt height
  fascia: 4, // lid eave edge
  rise: 58, // eave → ridge
  ridge: 455.5,
  knobEave: 486, // knob roof eave (post 455.5 → 486)
  top: 503,
}

/** plan half widths (square section, x = z; the plan is INFERRED square) */
export const PLAN = {
  foot: 62,
  collar: 85,
  skirt: 84,
  eave: 90,
  ridgeHalf: 66,
  knob: { eave: 19.5, depth: 17, post: [8.5, 7.5], ridge: 0.55 },
}

// half width of the belly and shoulder (front face plane z = half) — dossier §b.3, read off photo-37
const BELLY = [[25, 66], [36, 69.5], [52, 76], [70, 86.5], [101, 100.5], [140, 113.5], [178, 123.5], [220, 130.5], [250, 134], [266, 135]]
const SHOULDER = [[266, 135], [280, 134.6], [300, 130.5], [316, 123.5], [324, 118.5], [331, 112.5]]

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
