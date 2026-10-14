export const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t)
export const smooth = (t) => t * t * (3 - 2 * t)
export const inOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const outCubic = (t) => 1 - Math.pow(1 - t, 3)
