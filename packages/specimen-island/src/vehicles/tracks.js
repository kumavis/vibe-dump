import { clamp } from '../core/mathx.js'

// Skid steering, as plain numbers (no three.js): what a pair of tracks does
// with a throttle and a steer, both -1..1 (steer + turns left, the game's
// positive yaw). Both tracks forward drive it ahead; driven against each
// other they turn it on the spot. At speed the outer track can only run so
// much faster than the inner, so the turn is gentler (`turn.speedLoss` of the
// on-the-spot rate is gone at road top speed). Reversing keeps the same
// sense of turn: steer left and the hull swings left, whichever way it goes.

// The hull's target forward speed (m/s) and turn rate (rad/s).
export function skidSteer(throttle, steer, top, tune) {
  const forward = throttle >= 0 ? throttle * top : throttle * tune.top.reverse
  const loss = tune.turn.speedLoss * clamp(Math.abs(forward) / tune.top.road, 0, 1)
  return { forward, yawRate: steer * tune.turn.pivot * (1 - loss) }
}

// Each track's belt speed for a hull motion, `half` metres either side of the
// centreline: the right track runs faster in a left turn.
export function trackSpeeds(forward, yawRate, half) {
  return { left: forward - yawRate * half, right: forward + yawRate * half }
}

// ...and back: the hull motion two belt speeds make.
export function hullMotion(left, right, half) {
  return { forward: (left + right) / 2, yawRate: (right - left) / (2 * half) }
}

// What a grade does to a tracked hull pitched `slope` rad (nose up +). The
// tracks' grip holds it on anything up to tan(slope) = `climb.grip`, so on
// a hill it neither rolls back nor runs away; past that it slides at what the
// grip can't hold (`slip`, m/s², + back along the hull). Going up, the
// engine's `climb.power` (W/kg: speed times the grade's pull) sets the pace,
// `cap` m/s: a crawl up a bank the jeep spins out on, but never a stall.
// `pull` is the grade's own pull, m/s², + back.
export function onGrade(slope, tune) {
  const pull = 9.8 * Math.sin(slope)
  const hold = 9.8 * Math.cos(slope) * tune.climb.grip
  const slip = Math.sign(pull) * Math.max(0, Math.abs(pull) - hold)
  return { pull, slip, cap: tune.climb.power / Math.max(Math.abs(pull), 1e-6) }
}

// Move `current` toward `target` by at most `maxStep`.
export function approach(current, target, maxStep) {
  return current < target ? Math.min(target, current + maxStep) : Math.max(target, current - maxStep)
}
