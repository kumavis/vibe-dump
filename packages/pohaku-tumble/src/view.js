import { BOUNDS, CELL, JITTER } from './field.js'
import { clamp01, smooth } from './ease.js'

// The camera's slow wander. It lives here, not in main.js, so tools/sim.mjs
// watches the floor through the same camera a viewer does.
//
// Jukugo's camera drifted a few units round the middle of its sheet. Here the
// eight places are spread round the whole island and the star compass stands
// out at sea in the far corner, so a drift round the middle showed a phone
// the compass never, and a desktop the fishpond hardly ever. So the drift's
// centre travels too: round a loop about the floor's middle, clockwise from
// the north, and so out past the compass first. The loop is sized to the
// screen so that the band the Director turns words in (director.js `inView`)
// comes past every word on the floor: a phone sweeps the floor end to end, a
// wide screen that sees most of it barely moves. On the loop rides Jukugo's
// own drift at WANDER of its size (x two sines, ±2.5 and ±1.4; z one, ±1.8),
// so the camera never runs on a rail.
const centre = { x: (BOUNDS.x0 + BOUNDS.x1) / 2, z: (BOUNDS.z0 + BOUNDS.z1) / 2 }
const half = { x: (BOUNDS.x1 - BOUNDS.x0) / 2, z: (BOUNDS.z1 - BOUNDS.z0) / 2 }
// The board is sized from the word list and can be much smaller than
// Jukugo's, so the view's centre keeps 6 units in from the floor's sides and
// 4 from its ends, unless a narrow screen's loop has to go further (range()).
const MARGIN = { x: 6, z: 4 }
const within = { x: Math.max(0, half.x - MARGIN.x), z: Math.max(0, half.z - MARGIN.z) }
const WANDER = 0.4
const drift = { x: Math.min(WANDER, within.x / 3.9), z: Math.min(WANDER, within.z / 1.8) }
// How far the drift alone carries the view either way.
const SWAY = { x: 3.9 * drift.x, z: 1.8 * drift.z }

// The loop is a rectangle with its corners rounded off. An ellipse passes its
// diagonals at 0.71 of each half-axis, so the words in the floor's corner
// cells came on screen at the band's edge but never into it, and kept their
// first word all run. At the loop's corners the band reaches PAD past the
// furthest out a word can stand (OUTER: an outer cell's middle, moved the
// most the jitter allows). That is room for the drift and the yaw, which on
// any lap may be carrying the band the other way, and for the Director
// seeing a stone at half its height, a third of a unit north of its foot. On
// a desktop, an upright phone or one held sideways, every place comes into
// the band within 4½ minutes, every word within 7, and every word again on
// nearly every lap.
const OUTER = { x: half.x - CELL.w / 2 + JITTER.x, z: half.z - CELL.h / 2 + JITTER.z }
const PAD = 2
const RADIUS = 1
// Never quite a line, even where the screen sees the floor's whole depth.
const LEAST = { x: 2, z: 1.5 }
// Once round in 5½ minutes, or longer where the way round is so long that
// the camera would go faster than SPEED: with the drift on top it never goes
// faster than 0.35 units a second, slower than Jukugo's drift at its
// fastest. It keeps that pace round the corners, so it never hurries round
// one.
const PERIOD = 330
const SPEED = 0.18
// The loop opens out from the middle over the opening, so the stones fall in
// round the middle of the floor, as in Jukugo: over 45 s, or longer where its
// north side is far out, so it never opens faster than 0.15 units a second.
const OPEN = { least: 45, speed: 0.15 }
// On a screen small both ways (an older phone held sideways, a window a few
// hundred pixels across) a loop that brings the corners into the band leaves
// a hole in the middle wider than the drift covers. There every other lap
// draws in to INNER of the size at which the band spans the middle, and the
// loop changes size over SWAP of a lap about the north crossing, away from
// the corners.
const INNER = 0.8
const SWAP = 0.2
// The Director's in-view band (director.js `inView`): x from 0.1 to 0.9 of
// the width, y from 0.16 to 0.86 of the height, here as half-sizes.
const BAND = { x: 0.4, y: 0.35 }
// The camera looks down at 55°, ±2.5°.
const PITCH = 55

const ppuFor = (w, h) => Math.max(34, Math.min(60, Math.min(w, h) / 17))

// The loop on a w × h screen: its half-sizes and corner radius, its length,
// how long a lap takes, the scale of its inner laps (1 for none) and how long
// it takes to open out.
function loop(w, h) {
  const ppu = ppuFor(w, h)
  const band = { x: (BAND.x * w) / ppu, z: (BAND.y * h) / ppu / Math.sin((PITCH * Math.PI) / 180) }
  const a = Math.max(LEAST.x, OUTER.x + PAD - band.x)
  const b = Math.max(LEAST.z, OUTER.z + PAD - band.z)
  const r = Math.min(RADIUS, a, b)
  const length = 4 * (a + b - 2 * r) + 2 * Math.PI * r
  const hole = a - band.x > SWAY.x && b - band.z > SWAY.z
  return {
    a,
    b,
    r,
    length,
    lap: Math.max(PERIOD, length / SPEED),
    inner: hole ? INNER * Math.max(band.x / a, band.z / b) : 1,
    open: Math.max(OPEN.least, (1.5 * b) / OPEN.speed),
  }
}

// How far from the floor's middle the view's centre may go: MARGIN in from
// the floor's edge, or as far as the loop and the drift take it.
function range(l) {
  return { x: Math.max(within.x, l.a + SWAY.x), z: Math.max(within.z, l.b + SWAY.z) }
}

// How far a drag may move the view from where the wander has it: to the
// view's limit from anywhere in the wander but no further, so dragging back
// answers at once.
export function reach(w, h) {
  const l = loop(w, h)
  const r = range(l)
  return { x: r.x + l.a + SWAY.x, z: r.z + l.b + SWAY.z }
}

// Keep v within r of c.
export const clamp = (v, c, r) => Math.max(c - r, Math.min(c + r, v))

// The point `n` laps round the loop, at an even pace, clockwise from the
// middle of its north side (z runs south). Each leg is a side run up to a
// corner (NE, SE, SW, NW) and the quarter turn round it.
const CORNERS = [
  [1, -1],
  [1, 1],
  [-1, 1],
  [-1, -1],
]
function around(n, { a, b, r, length }) {
  const sx = a - r
  const sz = b - r
  const turn = (Math.PI / 2) * r
  let s = ((n - Math.floor(n)) * length + sx) % length
  for (let k = 0; k < 4; k++) {
    // The corner's centre of turn, and the side's outward normal.
    const cx = CORNERS[k][0] * sx
    const cz = CORNERS[k][1] * sz
    const out = ((k - 1) * Math.PI) / 2
    const run = k % 2 ? 2 * sz : 2 * sx
    if (s < run) {
      const back = run - s
      return [cx + r * Math.cos(out) + back * Math.sin(out), cz + r * Math.sin(out) - back * Math.cos(out)]
    }
    s -= run
    if (s < turn) return [cx + r * Math.cos(out + s / r), cz + r * Math.sin(out + s / r)]
    s -= turn
  }
  return [-sx, -b]
}

// 0 on an outer lap, 1 on an inner one (the odd laps), changing over SWAP
// of a lap about each north crossing.
function inward(n) {
  const m = Math.round(n)
  const g = smooth(clamp01((n - m) / SWAP + 0.5))
  return m % 2 ? g : m > 0 ? 1 - g : 0
}

// Where the camera is `t` seconds into the piece on a w × h screen, with the
// viewer's drag and zoom: a slow drift over the floor, never still, never
// fast enough to make the captions hard to read. Written into `view`.
export function wander(view, t, w, h, user = { dx: 0, dz: 0, zoom: 1 }) {
  const wave = (period, phase = 0) => Math.sin((t / period) * Math.PI * 2 + phase)
  const l = loop(w, h)
  const r = range(l)
  const n = t / l.lap
  const [x, z] = around(n, l)
  const k = smooth(Math.min(1, t / l.open)) * (1 - (1 - l.inner) * inward(n))
  view.ppu = ppuFor(w, h) * user.zoom * (1 + 0.035 * wave(53))
  view.tx = clamp(centre.x + k * x + drift.x * (2.5 * wave(97) + 1.4 * wave(41)) + user.dx, centre.x, r.x)
  view.tz = clamp(centre.z + k * z + drift.z * 1.8 * wave(83, 1) + user.dz, centre.z, r.z)
  view.yaw = ((-3 + 5 * wave(120)) * Math.PI) / 180
  view.pitch = ((PITCH + 2.5 * wave(71)) * Math.PI) / 180
  return view
}
