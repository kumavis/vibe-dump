import { BOUNDS } from './field.js'

// The camera's slow wander. It lives here, not in main.js, so tools/sim.mjs
// watches the floor through the same camera a viewer does.
//
// Jukugo's camera drifted a few units round the middle of its sheet. Here the
// eight places are spread round the whole island and the star compass stands
// out at sea in the far corner, so a drift round the middle showed a phone
// the compass never, and a desktop the fishpond hardly ever. So the drift's
// centre travels too: once round an
// ellipse about the floor's middle, clockwise from the north, and so out past
// the compass first. The ellipse is sized to the screen, so the band the
// Director counts as in view reaches to within EDGE of the floor's edge: a
// phone sweeps the floor end to end, a wide screen that sees most of it
// barely moves. On the ellipse rides Jukugo's own drift at WANDER of its size
// (x two sines, ±2.5 and ±1.4; z one, ±1.8), so the camera never runs on a
// rail. The board is sized from the word list and can be much smaller than
// Jukugo's, so everything stops short of the floor's edge: the view's centre
// keeps 6 units in from the sides and 4 from the ends.
const MARGIN = { x: 6, z: 4 }
const centre = { x: (BOUNDS.x0 + BOUNDS.x1) / 2, z: (BOUNDS.z0 + BOUNDS.z1) / 2 }
const half = { x: (BOUNDS.x1 - BOUNDS.x0) / 2, z: (BOUNDS.z1 - BOUNDS.z0) / 2 }
const range = { x: Math.max(0, half.x - MARGIN.x), z: Math.max(0, half.z - MARGIN.z) }
const WANDER = 0.4
const drift = { x: Math.min(WANDER, range.x / 3.9), z: Math.min(WANDER, range.z / 1.8) }

// Once round in 5½ minutes. A phone has the longest way round, and crosses
// the middle of the floor at 0.35 units a second at most, drift included: no
// faster than Jukugo's drift alone. Every place has been in view within four
// minutes of the start, on every screen.
const PERIOD = 330
// The ellipse opens out from the middle over the opening's first 45 s, so the
// stones fall in round the middle of the floor, as in Jukugo.
const OPEN = 45
// The Director's in-view band (director.js `inView`): x from 0.1 to 0.9 of
// the width, y from 0.16 to 0.86 of the height, here as half-sizes. The
// places sit on the island, inside the sea round it; EDGE brings the band
// that close to the floor's edge, so a place on the shore comes well inside.
const BAND = { x: 0.4, y: 0.35 }
const EDGE = 1.5
// The camera looks down at 55°, ±2.5°.
const PITCH = 55
// Never quite a line, even where the screen sees the floor's whole depth.
const LEAST = { x: 2, z: 1.5 }

const ppuFor = (w, h) => Math.max(34, Math.min(60, Math.min(w, h) / 17))

// The ellipse's half-axes on a w × h screen.
function ellipse(w, h) {
  const ppu = ppuFor(w, h)
  const band = { x: (BAND.x * w) / ppu, z: (BAND.y * h) / ppu / Math.sin((PITCH * Math.PI) / 180) }
  const axis = (k, sway) => Math.max(0, Math.min(range[k] - sway, Math.max(LEAST[k], half[k] - EDGE - band[k])))
  return { x: axis('x', 3.9 * drift.x), z: axis('z', 1.8 * drift.z) }
}

// How far a drag may move the view from where the wander has it: to the
// view's limit from anywhere in the wander but no further, so dragging back
// answers at once.
export function reach(w, h) {
  const e = ellipse(w, h)
  return { x: range.x + e.x + 3.9 * drift.x, z: range.z + e.z + 1.8 * drift.z }
}

// Keep v within r of c.
export const clamp = (v, c, r) => Math.max(c - r, Math.min(c + r, v))

// Where the camera is `t` seconds into the piece on a w × h screen, with the
// viewer's drag and zoom: a slow drift over the floor, never still, never
// fast enough to make the captions hard to read. Written into `view`.
export function wander(view, t, w, h, user = { dx: 0, dz: 0, zoom: 1 }) {
  const wave = (period, phase = 0) => Math.sin((t / period) * Math.PI * 2 + phase)
  const e = ellipse(w, h)
  const s = Math.min(1, t / OPEN)
  const open = s * s * (3 - 2 * s)
  const turn = (t / PERIOD) * Math.PI * 2
  view.ppu = ppuFor(w, h) * user.zoom * (1 + 0.035 * wave(53))
  view.tx = clamp(centre.x + open * e.x * Math.sin(turn) + drift.x * (2.5 * wave(97) + 1.4 * wave(41)) + user.dx, centre.x, range.x)
  view.tz = clamp(centre.z - open * e.z * Math.cos(turn) + drift.z * 1.8 * wave(83, 1) + user.dz, centre.z, range.z)
  view.yaw = ((-3 + 5 * wave(120)) * Math.PI) / 180
  view.pitch = ((PITCH + 2.5 * wave(71)) * Math.PI) / 180
  return view
}
