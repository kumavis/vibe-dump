// Where the camera looks (DESIGN §2.11): the presets and which one a battle
// opens on, as plain numbers. Pure: no three.js, no DOM, nothing but the
// board's size; view/camera.js (the CameraRig) moves the camera to them,
// and sim/camera-check.mjs tests them in Node.
//
// R7 keeps today's views exactly: the title's slow orbit from behind seat
// 0's lines, and a battle seen across the table on a landscape screen or
// down its length from behind seat 0 on a portrait one (main.js's
// defaultView and fitFov before R7; sim/camera-check.mjs holds these to the
// R0 code's). The views that change what a player sees, `behind` a seat
// played here (F1) and `broadside` for everyone else (F2), are here and
// fitted to the screen by fitPose, but no battle picks them yet:
// battleView still chooses by the screen's shape alone.
import { BOARD } from '../core/rules.js'

const { W, H } = BOARD

export const PRESETS = Object.freeze({
  // the title screen: a slow drift around (centre) from behind seat 0's
  // lines (the west edge), across toward seat 1's; `angle` where it starts,
  // `speed` radians per game second
  title: Object.freeze({ orbit: Object.freeze({ centre: Object.freeze([-5, 0, 0]), radius: 25, y: 13, speed: 0.035, angle: -1.02 }) }),
  // a battle on a landscape screen: across the table
  landscape: Object.freeze({ pos: Object.freeze([0, 30, 31]), target: Object.freeze([0, 0, 1.5]), fov: 40 }),
  // a battle on a portrait screen: down the table's length from behind
  // seat 0's lines, so the 28" width is what has to fit
  portrait: Object.freeze({ pos: Object.freeze([-36, 46, 0]), target: Object.freeze([-1, 0, 0]), fov: 56 }),
  // (F2) one army left, one right: seat 0 (west) on the left
  broadside: Object.freeze({ azimuth: 0, elevation: 0.77, max: 86 }),
  // (F1) from behind the seat played here, its own army in front
  behind: (edge) => Object.freeze({ azimuth: edge < 0 ? -Math.PI / 2 : Math.PI / 2, elevation: 0.9, max: 75 }),
})

// Whether a screen of this aspect is landscape: as wide as it is tall, or
// wider. (Today's `innerWidth >= innerHeight`, which a 0×0 screen, whose
// aspect is NaN, passes too.)
const wide = (aspect) => !(aspect < 1)

// The view a battle opens on, for the seats played on this screen (their
// edges by seat) and the screen's aspect (width / height). Today's: the
// screen's shape alone decides (F1 and F2 make it `behind` one seat played
// here, else `broadside`, §2.11).
export const battleView = ({ localSeats = [], edges = [], aspect }) => (wide(aspect) ? PRESETS.landscape : PRESETS.portrait)

// The camera's vertical field of view for a screen's aspect: wider on a
// portrait screen (the title's too).
export const fovFor = (aspect) => (wide(aspect) ? PRESETS.landscape.fov : PRESETS.portrait.fov)

// Where an orbit puts the camera at game time `time`, having started at
// `angle`: { pos, target }.
export function orbitPose(orbit, time, angle = orbit.angle) {
  const a = angle + time * orbit.speed
  const c = orbit.centre
  return { pos: [c[0] + Math.sin(a) * orbit.radius, orbit.y, c[2] + Math.cos(a) * orbit.radius], target: [c[0], c[1], c[2]] }
}

// Whether the camera follows the action to (a `focus` event): only when the
// player asked it to (the HUD's 🎥), in battle, and never during the turn of
// the one seat played here (hotseat's two seats and a spectator's none
// follow every turn).
export const follows = ({ follow, stage, active, localSeats }) => !!follow && stage === 'battle' && !(localSeats.length === 1 && localSeats.includes(active))

// A pose for a preset given by azimuth and elevation, fitted to the screen:
// the camera looking at the board's centre from the nearest distance at
// which the whole board shows (all four corners, whichever way it lies
// across the screen), with room for the HUD (12% each way), never farther
// than the preset's `max`. A pose preset (pos and target) is returned as it
// is. (The CameraRig's fit and goTo go through it; no battle picks a fitted
// preset yet: F1/F2's. On a narrow portrait phone both stop at their
// `max` with the board's ends past the screen's sides, the broadside below
// an aspect of about 0.55 and behind below about 0.47: for F1/F2 to tune,
// with a fit across one of the board's sides only if they want one.)
export function fitPose(preset, aspect) {
  if (preset.pos) return preset
  const fov = fovFor(aspect)
  const tv = Math.tan((fov * Math.PI) / 360), th = tv * aspect
  const { azimuth: az, elevation: el } = preset
  // the camera's direction from the centre, and its right and up
  const dir = [Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)]
  const fwd = dir.map((x) => -x)
  const right = norm([-fwd[2], 0, fwd[0]])
  const up = cross(right, fwd)
  const corners = [[-W / 2, -H / 2], [W / 2, -H / 2], [-W / 2, H / 2], [W / 2, H / 2]].map(([x, z]) => [x, 0, z])
  // whether the board fits from distance d
  const fits = (d) => corners.every((p) => {
    const v = [p[0] - dir[0] * d, p[1] - dir[1] * d, p[2] - dir[2] * d]
    const depth = dot(v, fwd)
    return depth > 0 && Math.abs(dot(v, right)) * 1.12 <= depth * th && Math.abs(dot(v, up)) * 1.12 <= depth * tv
  })
  let lo = 1, hi = preset.max
  if (fits(lo)) hi = lo
  else if (fits(hi)) for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2
    if (fits(mid)) hi = mid
    else lo = mid
  }
  return { pos: dir.map((x) => x * hi), target: [0, 0, 0], fov }
}
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const norm = (a) => {
  const l = Math.hypot(a[0], a[1], a[2])
  return a.map((x) => x / l)
}
