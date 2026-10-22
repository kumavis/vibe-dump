// Where the camera looks (DESIGN §2.11): the presets and which one a battle
// opens on, as plain numbers. Pure: no three.js, no DOM, nothing but the
// board's size; view/camera.js (the CameraRig) moves the camera to them,
// and sim/camera-check.mjs tests them in Node.
//
// R7 kept the R0 code's views exactly: the title's slow orbit from behind
// seat 0's lines, and a battle seen across the table on a landscape screen
// or down its length from behind seat 0 on a portrait one (main.js's
// defaultView and fitFov before R7; sim/camera-check.mjs holds the camera
// made at load, the field of view and the orbit to the R0 code's still).
// (F1, F2) A battle now opens `behind` the one seat played here, its own
// army in front whichever edge it holds (the serpents' too), and
// `broadside` for everyone else (a watched battle, hotseat's two seats):
// one army left, one right. Both are fitted to the screen and to the board
// by fitPose, and the view button cycles through them and an overview.
import { BOARD } from '../core/rules.js'

const { W, H } = BOARD

// The board as a rectangle on the table, its centre and size: classic's
// here; (F8) a mission's own board is passed in its place.
export const BOARD_RECT = Object.freeze({ cx: 0, cz: 0, w: W, h: H })

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
  // (F2) one army left, one right: seat 0 (west) on the left. Its max lets
  // a portrait phone take in the whole board (about 104" at 412×915)
  broadside: Object.freeze({ azimuth: 0, elevation: 0.77, max: 105 }),
  // (F1) from behind the seat played here, its own army in front
  behind: (edge) => Object.freeze({ azimuth: edge < 0 ? -Math.PI / 2 : Math.PI / 2, elevation: 0.9, max: 80 }),
  // the whole board from nearly overhead (the view button's last, and the
  // Home key)
  overview: Object.freeze({ azimuth: 0, elevation: 1.45, max: 100 }),
})

// Whether a screen of this aspect is landscape: as wide as it is tall, or
// wider. (Today's `innerWidth >= innerHeight`, which a 0×0 screen, whose
// aspect is NaN, passes too.)
const wide = (aspect) => !(aspect < 1)

// The view a battle opens on, for the seats played on this screen and each
// seat's edge (-1 west, 1 east): (F1) behind the one seat played here,
// (F2) else broadside. The screen's shape no longer decides it: fitPose
// fits either to the screen.
export const battleView = ({ localSeats = [], edges = [] }) => (localSeats.length === 1 ? PRESETS.behind(edges[localSeats[0]]) : PRESETS.broadside)

// The views the view button (and V) steps through, the battle's own first:
// behind the seat played here, broadside, behind the other army, overview;
// for a watched or hotseat battle, broadside, behind the west army, behind
// the east, overview.
export function viewsFor({ localSeats = [], edges = [] }) {
  if (localSeats.length === 1) {
    const own = edges[localSeats[0]]
    return [PRESETS.behind(own), PRESETS.broadside, PRESETS.behind(-own), PRESETS.overview]
  }
  return [PRESETS.broadside, PRESETS.behind(-1), PRESETS.behind(1), PRESETS.overview]
}

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

// A pose for a preset given by azimuth and elevation, fitted to the screen
// and the board (`rect`, classic's by default): the camera looking at the
// board's centre from the nearest distance at which the whole board shows
// (all four corners, whichever way it lies across the screen), with room
// for the HUD (12% each way), never farther than the preset's `max`. A pose
// preset (pos and target) is returned as it is. (The CameraRig's fit and
// goTo go through it. Each fitted preset's max takes in the whole classic
// board on every screen down to a 412×915 portrait phone; sim/camera-check
// says so.)
export function fitPose(preset, aspect, rect = BOARD_RECT) {
  if (preset.pos) return preset
  const fov = fovFor(aspect)
  const tv = Math.tan((fov * Math.PI) / 360), th = tv * aspect
  const { azimuth: az, elevation: el } = preset
  // the camera's direction from the centre, and its right and up
  const dir = [Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)]
  const fwd = dir.map((x) => -x)
  const right = norm([-fwd[2], 0, fwd[0]])
  const up = cross(right, fwd)
  const { cx, cz, w, h } = rect
  // the corners, from the board's centre
  const corners = [[-w / 2, -h / 2], [w / 2, -h / 2], [-w / 2, h / 2], [w / 2, h / 2]].map(([x, z]) => [x, 0, z])
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
  return { pos: [cx + dir[0] * hi, dir[1] * hi, cz + dir[2] * hi], target: [cx, 0, cz], fov }
}
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const norm = (a) => {
  const l = Math.hypot(a[0], a[1], a[2])
  return a.map((x) => x / l)
}
