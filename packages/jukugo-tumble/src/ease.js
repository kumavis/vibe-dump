export const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t)
export const lerp = (a, b, t) => a + (b - a) * t
export const smooth = (t) => t * t * (3 - 2 * t)
export const inOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const outCubic = (t) => 1 - Math.pow(1 - t, 3)
export const outExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))
export const inOutExpo = (t) =>
  t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2
// Overshoots by `s` and settles: a block landing a touch past flat, then back.
export const outBack = (t, s = 1.4) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2)
