// Small shared helpers: a seeded RNG, easings, and a promise-based tween clock
// that the whole game awaits on, so an AI turn and a human click resolve
// through the same animated code path.

export function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const lerp = (a, b, t) => a + (b - a) * t
export const pick = (arr, rng = Math.random) => arr[Math.floor(rng() * arr.length)]
export const rr = (rng, a, b) => a + rng() * (b - a)
export const easeOut = (x) => 1 - Math.pow(1 - x, 3)
export const easeIn = (x) => x * x * x
export const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
export const easeOutBack = (x) => 1 + 2.7 * Math.pow(x - 1, 3) + 1.7 * Math.pow(x - 1, 2)
export const wrapAngle = (a) => Math.atan2(Math.sin(a), Math.cos(a))
export function bounce(x) {
  const n = 7.5625, d = 2.75
  if (x < 1 / d) return n * x * x
  if (x < 2 / d) return n * (x -= 1.5 / d) * x + 0.75
  if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + 0.9375
  return n * (x -= 2.625 / d) * x + 0.984375
}

// Game time runs `speed` times faster than wall time, so the AI can be hurried.
export const clock = { speed: 1, time: 0 }

const live = new Set()

// tween(seconds, t => ...) resolves when done. Durations are in game seconds.
export function tween(duration, fn, ease = (x) => x) {
  return new Promise((resolve) => {
    live.add({ t: 0, duration: Math.max(1e-4, duration), fn, ease, resolve })
  })
}
export const wait = (seconds) => tween(seconds, () => {})

export function stepTweens(dt) {
  for (const tw of [...live]) {
    tw.t += dt
    const k = Math.min(1, tw.t / tw.duration)
    tw.fn(tw.ease(k), k)
    if (k >= 1) {
      live.delete(tw)
      tw.resolve()
    }
  }
}
