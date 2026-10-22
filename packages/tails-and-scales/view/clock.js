// The view's clock (DESIGN §1.1, §1.3: util.js's view half): easings, and a
// promise-based tween clock the whole table awaits on, so every event the
// player plays resolves through the same animated code path. Game time runs
// `clock.speed` times faster than wall time (the speed button; ?fast runs it
// at 1e4), and the frame loop (view/stage.js) steps it. The seeded
// generator and the pure helpers live in core/util.js; `lerp` is re-exported
// from there, and `pick` here wraps core's to default to Math.random, for
// purely visual choices (core's always names its stream).
import { pick as pickFrom } from '../core/util.js'

export { lerp } from '../core/util.js'
export const pick = (arr, rng = Math.random) => pickFrom(arr, rng)
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

// Game time runs `speed` times faster than wall time, so the AI can be
// hurried; (N2) `boost` times faster again while an online table catches up
// (app/flow.js's elastic catch-up: 1, 2 or 4). `rate`: how much game time
// a wall second has given lately at speed 1 (view/stage.js: a frame steps
// at most 0.05 s, so a page drawing fewer than 20 frames a second runs
// slow), which the catch-up turns a backlog into wall seconds by.
export const clock = { speed: 1, time: 0, boost: 1, rate: 1 }

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
