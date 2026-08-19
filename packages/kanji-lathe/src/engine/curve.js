// Small shared helper for `type: 'curve'` parameters.
//
// A curve value is a plain array of 9 numbers in 0..1 — a control polygon the
// user drags in the dashboard. evalCurve() reads it as a Catmull-Rom spline so
// a handful of handles gives a smooth response.
import { clamp } from '../geom/path.js'

export const CURVE_N = 9

/** A flat curve at height `v` (the identity for most uses is FLAT(0.5)). */
export const flatCurve = (v = 0.5) => Array.from({ length: CURVE_N }, () => v)

/** The identity ramp 0→1, used by remapping curves. */
export const rampCurve = () => Array.from({ length: CURVE_N }, (_, i) => i / (CURVE_N - 1))

/** Sample a curve array at t ∈ 0..1. */
export function evalCurve(c, t) {
  if (!c || !c.length) return 0.5
  const n = c.length
  const x = clamp(t, 0, 1) * (n - 1)
  const i = Math.min(n - 2, Math.floor(x))
  const f = x - i
  const p0 = c[Math.max(0, i - 1)]
  const p1 = c[i]
  const p2 = c[i + 1]
  const p3 = c[Math.min(n - 1, i + 2)]
  const f2 = f * f
  const f3 = f2 * f
  return (
    0.5 *
    (2 * p1 + (-p0 + p2) * f + (2 * p0 - 5 * p1 + 4 * p2 - p3) * f2 + (-p0 + 3 * p1 - 3 * p2 + p3) * f3)
  )
}

/**
 * Turn a curve into a strictly increasing 0→1 remap. Used by the region-warp
 * operators, where a non-monotone map would fold the glyph over itself.
 */
export function monotoneRemap(c) {
  const n = c.length
  // treat curve heights as per-band densities, integrate, normalise
  const w = new Float64Array(n - 1)
  let sum = 0
  for (let i = 0; i < n - 1; i++) {
    w[i] = Math.max(0.02, (c[i] + c[i + 1]) / 2)
    sum += w[i]
  }
  const cum = new Float64Array(n)
  for (let i = 0; i < n - 1; i++) cum[i + 1] = cum[i] + w[i] / sum
  return (t) => {
    const x = clamp(t, 0, 1) * (n - 1)
    const i = Math.min(n - 2, Math.floor(x))
    const f = x - i
    return cum[i] + (cum[i + 1] - cum[i]) * f
  }
}
