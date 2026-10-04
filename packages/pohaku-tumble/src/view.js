import { BOUNDS } from './field.js'

// The camera's slow wander: x is two sines (±2.5 and ±1.4), z one (±1.8).
// The board is sized from the word list and can be much smaller than
// Jukugo's, so the wander and the reach of a drag both come from the floor:
// the view's centre keeps 6 units in from the sides and 4 from the ends, the
// wander shrinks to fit what's left, and a drag can push the view to that
// limit from anywhere in the wander but no further, so dragging back answers
// at once. It lives here, not in main.js, so tools/sim.mjs watches the floor
// through the same camera a viewer does.
const MARGIN = { x: 6, z: 4 }
const centre = { x: (BOUNDS.x0 + BOUNDS.x1) / 2, z: (BOUNDS.z0 + BOUNDS.z1) / 2 }
const range = {
  x: Math.max(0, (BOUNDS.x1 - BOUNDS.x0) / 2 - MARGIN.x),
  z: Math.max(0, (BOUNDS.z1 - BOUNDS.z0) / 2 - MARGIN.z),
}
const drift = { x: Math.min(1, range.x / 3.9), z: Math.min(1, range.z / 1.8) }

// How far a drag may move the view from where the wander has it.
export const REACH = { x: range.x + 3.9 * drift.x, z: range.z + 1.8 * drift.z }

// Keep v within r of c.
export const clamp = (v, c, r) => Math.max(c - r, Math.min(c + r, v))

// Where the camera is `t` seconds into the piece on a w × h screen, with the
// viewer's drag and zoom: a slow drift over the floor, never still, never
// fast enough to make the captions hard to read. Written into `view`.
export function wander(view, t, w, h, user = { dx: 0, dz: 0, zoom: 1 }) {
  const base = Math.max(34, Math.min(60, Math.min(w, h) / 17))
  const wave = (period, phase = 0) => Math.sin((t / period) * Math.PI * 2 + phase)
  view.ppu = base * user.zoom * (1 + 0.035 * wave(53))
  view.tx = clamp(centre.x + drift.x * (2.5 * wave(97) + 1.4 * wave(41)) + user.dx, centre.x, range.x)
  view.tz = clamp(centre.z + drift.z * 1.8 * wave(83, 1) + user.dz, centre.z, range.z)
  view.yaw = ((-3 + 5 * wave(120)) * Math.PI) / 180
  view.pitch = ((55 + 2.5 * wave(71)) * Math.PI) / 180
  return view
}
