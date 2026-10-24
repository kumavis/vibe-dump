import { clamp, stepAngle, wrapAngle } from '../core/mathx.js'

// Fire control for a gun that throws a shell on a ballistic arc (no drag):
// the elevation that lands it on a point, the arc it then flies, and the
// slewing limits of a turret and its gun. Pure numbers, so the tank's model
// and its tests share one set of sums.

// The launch angle (radians above horizontal) that carries a shell fired at
// `v` m/s under gravity `g` across `dist` metres of level distance to a point
// `dh` metres above the muzzle: the flatter of the two solutions, or null
// when the point is out of reach.
export function launchAngle(dist, dh, v, g) {
  if (dist < 1e-6) return dh >= 0 ? Math.PI / 2 : -Math.PI / 2
  const v2 = v * v
  const disc = v2 * v2 - g * (g * dist * dist + 2 * dh * v2)
  if (disc < 0) return null
  return Math.atan2(v2 - Math.sqrt(disc), g * dist)
}

// Height of the arc above the muzzle after `dist` metres of level distance.
export function arcHeight(dist, angle, v, g) {
  const c = Math.cos(angle)
  const t = dist / (v * c)
  return v * Math.sin(angle) * t - 0.5 * g * t * t
}

// Seconds of flight to cover `dist` metres of level distance.
export function flightTime(dist, angle, v) {
  return dist / (v * Math.cos(angle))
}

// One frame of laying the gun: the turret turns toward `wantYaw` (relative to
// the hull) at `traverse` rad/s the short way round, and the gun moves toward
// `wantElev` at `elevate` rad/s, never outside [depress, raise].
export function layGun(turretYaw, elevation, wantYaw, wantElev, dt, gun) {
  const yaw = wrapAngle(stepAngle(turretYaw, wantYaw, gun.traverse * dt))
  const target = clamp(wantElev, gun.depress, gun.raise)
  const step = gun.elevate * dt
  const elev = clamp(elevation + clamp(target - elevation, -step, step), gun.depress, gun.raise)
  return { yaw, elev }
}
