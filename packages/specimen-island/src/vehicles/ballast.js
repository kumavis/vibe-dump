import { clamp } from '../core/mathx.js'

// The submersible's depth control, as pure functions of plain numbers.
//
// Ballast `b` runs -1 (flooded: heavy, sinks) .. +1 (blown: light, rises).
// Holding Space blows it, Shift floods it; letting go trims it back to 0,
// neutral, and water drag then brings her to a stop: she holds her depth.
// Buoyancy acts only on the share of the float body that is under water
// (the hull from F.y0 up to F.y1 above the keel; the canopy and the tower
// are free-flooding), so she can never leave the water: breaking the surface
// she loses lift until the weight wins, and settles with her waterline where
// share × (1 + reserve × b) = 1.

// The trim tanks after `dt`: `cmd` +1 blow, -1 flood, 0 let go (trim back to
// `rest`, neutral unless the boat is left to itself).
export function ballastStep(b, cmd, dt, B, rest = 0) {
  if (cmd) return clamp(b + cmd * B.rate * dt, -1, 1)
  const step = B.trim * dt
  return b > rest ? Math.max(rest, b - step) : Math.min(rest, b + step)
}

// How much of the float body is under a surface at `surfaceY` with the keel
// at `keelY`: 0 out of the water .. 1 submerged.
export function submergedShare(keelY, surfaceY, F) {
  return clamp((surfaceY - keelY - F.y0) / (F.y1 - F.y0), 0, 1)
}

// Vertical acceleration: buoyancy against weight, less water drag (linear
// and quadratic). Drag only acts as far as she is in the water.
export function heaveAccel(vy, share, b, B) {
  const wet = Math.max(share, 0.15)
  return 9.8 * (share * (1 + B.reserve * b) - 1) - (B.drag * vy + B.drag2 * vy * Math.abs(vy)) * wet
}

// Advance { y, vy } (keel height and climb rate) by `dt` against a surface at
// `surfaceY`, in substeps short enough that the result does not depend on
// the frame rate. Mutates and returns `state`.
export function heave(state, b, surfaceY, dt, T) {
  const n = Math.max(1, Math.ceil(dt / (1 / 120)))
  const h = dt / n
  for (let i = 0; i < n; i++) {
    const share = submergedShare(state.y, surfaceY, T.float)
    state.vy += heaveAccel(state.vy, share, b, T.ballast) * h
    state.y += state.vy * h
  }
  return state
}

// Where she floats at rest with ballast `b` (b >= 0): the keel height.
export function floatKeel(surfaceY, b, T) {
  const share = 1 / (1 + T.ballast.reserve * Math.max(0, b))
  return surfaceY - T.float.y0 - share * (T.float.y1 - T.float.y0)
}
