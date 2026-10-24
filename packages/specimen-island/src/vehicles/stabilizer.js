import { clamp, damp } from '../core/mathx.js'

// Bank into a turn, but never tip over. With no forward motion or turn the
// target is exactly upright, including when parked on a cross-slope.
export function stabilizedLean(current, forwardSpeed, yawRate, dt, tune) {
  const target = clamp(Math.atan(forwardSpeed * yawRate / tune.gravity), -tune.maxLean, tune.maxLean)
  return clamp(damp(current, target, tune.response, dt), -tune.maxLean, tune.maxLean)
}
