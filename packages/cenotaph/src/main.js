import { Renderer, COOKIE } from './renderer.js'
import { Figure } from './figure.js'
import { Camera, mul3, rotY, rotZ, rotX, norm3 } from './mat.js'
import { Clock } from './clock.js'
import { ROOM, FIGURE_SCALE, confine } from './room.js'

const canvas = document.getElementById('view')
const resetBtn = document.getElementById('reset')
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

// Development aids, read from the query string and otherwise invisible.
//   ?t=95        start the clock at 95 s (skips the fade)
//   ?still       freeze the clock
//   ?cookie      show only the opening, black on paper, as cut
//   ?pose=curl   pin a pose key (open, curl, surrender, stand)
//   ?roll= &twist= &yaw= &tilt=   pin the body's orientation
//   ?reach=1     pin the gesture
//   ?sdf8        use the 8-bit fallback targets
//   ?rung=6      pin the quality ladder (0 roughest … 9 supersampled)
//   ?govern      let the frame-rate governor run even under automation
//   ?x= &y= &z=  start the eye somewhere else in the hall (metres)
//   ?vyaw= &vpitch=  turn it (radians, from where it starts)
//   ?nodust      leave the motes out
//   ?exp=2       scale the exposure
//   ?fov=0.9     pin the vertical field of view (radians)
// They also read from the hash, because some places (an artifact link) pass
// only a plain #anchor through to the page: there, write ~ between settings
// and _ for =, as in #t_200~y_12. Changing them reloads.
const DEV_KEYS = ['t', 'still', 'cookie', 'pose', 'roll', 'twist', 'yaw', 'tilt', 'reach', 'sdf8', 'rung', 'govern', 'x', 'y', 'z', 'vyaw', 'vpitch', 'nodust', 'exp', 'fov']
// the development settings a hash carries, as [key, value] pairs
function hashSettings(hash) {
  const h = decodeURIComponent(hash.slice(1))
  const q = /[=&]/.test(h) ? h : h.split('~').map((t) => t.replace('_', '=')).join('&')
  return [...new URLSearchParams(q)].filter(([k]) => DEV_KEYS.includes(k))
}
const params = new URLSearchParams(location.search)
for (const [k, v] of hashSettings(location.hash)) params.set(k, v)
// a host may set a hash of its own; reload only when ours change
const settingsOf = (hash) => JSON.stringify(hashSettings(hash).sort())
const startSettings = settingsOf(location.hash)
addEventListener('hashchange', () => {
  if (settingsOf(location.hash) !== startSettings) location.reload()
})
const pin = (name, value) => (params.has(name) ? +params.get(name) : value)

let renderer
try {
  renderer = new Renderer(canvas, { force8: params.has('sdf8') })
} catch (err) {
  console.error(err)
  document.body.classList.add('nogl')
}

const figure = new Figure()
const cam = new Camera()
const clock = new Clock(Number(params.get('t')) || 0)

// The figure is cut into the ceiling by a camera of its own: a long lens far
// off, so the projection is all but flat, framed so one metre of body is
// FIGURE_SCALE metres of hall across a COOKIE-texel square of HOLE_SPAN.
const cookieCam = new Camera()
cookieCam.w = cookieCam.h = COOKIE
cookieCam.fov = 0.1
cookieCam.update()
{
  const pxPerM = (COOKIE * FIGURE_SCALE) / ROOM.HOLE_SPAN
  cookieCam.pos = [0, 0, cookieCam.pxPerUnit / pxPerM]
  cookieCam.target = [0, 0, 0]
  cookieCam.update()
}

// The light changes over minutes — afternoon gold, a white noon, a rose
// evening, then moonlight — and the hall takes the colour of whatever is
// pouring in. Linear RGB: the sun's irradiance square on, the sky's radiance
// through the opening, and the air's own faint glow.
const SUN_I = 40
const PALETTES = [
  { sun: [1.0, 0.8, 0.58], sky: [0.5, 0.6, 0.74], fog: [0.02, 0.021, 0.024] },
  { sun: [1.0, 0.96, 0.9], sky: [0.46, 0.6, 0.86], fog: [0.02, 0.022, 0.026] },
  { sun: [1.0, 0.6, 0.44], sky: [0.66, 0.5, 0.6], fog: [0.024, 0.019, 0.022] },
  { sun: [0.62, 0.74, 1.0], sky: [0.22, 0.3, 0.5], fog: [0.014, 0.017, 0.024] },
]
const SKY_I = 0.13
const PALETTE_SPAN = 95 // seconds per colour

function palette(t) {
  const x = (t / PALETTE_SPAN) % PALETTES.length
  const i = Math.floor(x)
  let f = x - i
  f = f * f * (3 - 2 * f)
  const a = PALETTES[i], b = PALETTES[(i + 1) % PALETTES.length]
  const mix = (k, s) => a[k].map((v, j) => (v + (b[k][j] - v) * f) * s)
  return { sun: mix('sun', SUN_I), sky: mix('sky', SUN_I * SKY_I), fog: mix('fog', SUN_I * 0.01) }
}

// The sun stands a little off the vertical, so the light slants across the
// hall and lands well away from under the opening — wandering slowly, the
// way a sun does, so the shafts sweep.
function sunAt(T) {
  const sx = 0.28 + 0.035 * Math.sin(T / 83 + 1)
  const sz = -0.52 + 0.03 * Math.sin(T / 67)
  return norm3([sx, 1, sz])
}

// ---- the eye -----------------------------------------------------------------
// It stands a little above the floor near the open end of the hall, looking
// down its length toward the light. Drag to look round, wheel or pinch to walk.
const HOME = { x: pin('x', -10), y: pin('y', 3.2), z: pin('z', 30), yaw: 0.22, pitch: 0.27 }
const eye = {
  pos: confine([HOME.x, HOME.y, HOME.z]),
  yaw: pin('vyaw', 0),
  pitch: pin('vpitch', 0),
}
eye.tpos = eye.pos.slice()
eye.tyaw = eye.yaw
eye.tpitch = eye.pitch
const PITCH_MAX = 1.35
const pointer = { x: 0, y: 0, sx: 0, sy: 0 }
const touches = new Map()
const keys = new Set()
let dragging = false
let pinch = null
let spaceHeld = false
let idleTimer = 0

function wake() {
  document.body.classList.remove('idle')
  clearTimeout(idleTimer)
  idleTimer = setTimeout(() => document.body.classList.add('idle'), 2600)
}

function press() {
  clock.holding = true
}
function release() {
  clock.holding = spaceHeld
}

const clampPitch = (p) => Math.max(-PITCH_MAX, Math.min(PITCH_MAX, p))

// the direction the eye faces, flattened to the floor
function heading() {
  const y = HOME.yaw + eye.tyaw
  return [Math.sin(y), 0, -Math.cos(y)]
}

// grab-the-world: drag right and the hall slides right, drag down and it
// slides down — so the eye turns the other way, and looks up
function look(dx, dy) {
  eye.tyaw -= dx * 0.0035
  eye.tpitch = clampPitch(eye.tpitch + dy * 0.0035)
  markMoved()
}

function walk(forward, side = 0) {
  const f = heading()
  const r = [-f[2], 0, f[0]]
  eye.tpos = confine([eye.tpos[0] + f[0] * forward + r[0] * side, eye.tpos[1], eye.tpos[2] + f[2] * forward + r[2] * side])
  markMoved()
}

function resetView() {
  eye.tyaw = 0
  eye.tpitch = 0
  eye.tpos = confine([HOME.x, HOME.y, HOME.z])
  // turn the short way round
  eye.yaw = Math.atan2(Math.sin(eye.yaw), Math.cos(eye.yaw))
  markMoved()
}

function markMoved() {
  const d = Math.hypot(eye.tpos[0] - HOME.x, eye.tpos[1] - HOME.y, eye.tpos[2] - HOME.z)
  const moved = Math.abs(Math.atan2(Math.sin(eye.tyaw), Math.cos(eye.tyaw))) > 0.03 || Math.abs(eye.tpitch) > 0.03 || d > 0.5
  document.body.classList.toggle('moved', moved)
}

const isControl = (e) => e.target.closest?.('button')

addEventListener('pointerdown', (e) => {
  if (isControl(e)) return
  wake()
  try {
    canvas.setPointerCapture(e.pointerId)
  } catch {}
  touches.set(e.pointerId, { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY })
  if (touches.size === 1) {
    dragging = false
    press()
  } else if (touches.size === 2) {
    // two fingers: pinch to walk, move together to look
    const [a, b] = [...touches.values()]
    pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1 }
    dragging = true
    release()
  }
})

addEventListener('pointermove', (e) => {
  wake()
  if (e.pointerType === 'mouse' && touches.size === 0) {
    pointer.x = (e.clientX / innerWidth) * 2 - 1
    pointer.y = (e.clientY / innerHeight) * 2 - 1
  }
  const t = touches.get(e.pointerId)
  if (!t) return
  const dx = e.clientX - t.x, dy = e.clientY - t.y
  t.x = e.clientX
  t.y = e.clientY
  if (touches.size === 1) {
    if (!dragging && Math.hypot(t.x - t.x0, t.y - t.y0) > 6) {
      dragging = true
      release()
    }
    if (dragging) look(dx, dy)
  } else if (touches.size === 2 && pinch) {
    const [a, b] = [...touches.values()]
    const d = Math.hypot(a.x - b.x, a.y - b.y) || 1
    walk((d - pinch.d) * 0.12)
    pinch.d = d
    look(dx / 2, dy / 2)
  }
})

function lift(e) {
  touches.delete(e.pointerId)
  if (touches.size < 2) pinch = null
  if (touches.size === 0) {
    dragging = false
    release()
  }
}
addEventListener('pointerup', lift)
addEventListener('pointercancel', lift)
addEventListener('blur', () => {
  touches.clear()
  keys.clear()
  pinch = null
  dragging = false
  spaceHeld = false
  release()
})

addEventListener(
  'wheel',
  (e) => {
    e.preventDefault()
    wake()
    const px = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY
    walk(-Math.max(-240, Math.min(240, px)) * 0.03)
  },
  { passive: false },
)

const WALK_KEYS = ['KeyW', 'KeyA', 'KeyS', 'KeyD']
addEventListener('keydown', (e) => {
  wake()
  const k = e.key
  if (k === 'ArrowLeft') look(-28, 0)
  else if (k === 'ArrowRight') look(28, 0)
  else if (k === 'ArrowUp') look(0, -28)
  else if (k === 'ArrowDown') look(0, 28)
  else if (k === '+' || k === '=') walk(3)
  else if (k === '-' || k === '_') walk(-3)
  else if (WALK_KEYS.includes(e.code)) keys.add(e.code)
  else if (e.repeat) return
  else if (e.code === 'Space') {
    spaceHeld = true
    press()
  } else if (e.code === 'KeyF') toggleFullscreen()
  else if (e.code === 'KeyR' || k === '0') resetView()
  else return
  e.preventDefault()
})
addEventListener('keyup', (e) => {
  keys.delete(e.code)
  if (e.code === 'Space') {
    spaceHeld = false
    if (touches.size === 0 || dragging) release()
  }
})
addEventListener('dblclick', (e) => {
  if (!isControl(e)) toggleFullscreen()
})
addEventListener('contextmenu', (e) => e.preventDefault())

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen?.()
  else document.documentElement.requestFullscreen?.().catch(() => {})
}

resetBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  resetView()
})

// ---- frame ----------------------------------------------------------------
// Quality follows the frame rate. Each rung is [canvas pixels per CSS pixel,
// steps along a ray through the shafts, steps along a reflected one]. The
// temporal resolve turns a few noisy frames into one clean one, so the low
// rungs mostly cost a little grain while the eye is moving.
//
// Every change of rung is itself a visible change, so the governor is built
// to make few of them. It climbs only while settling in (after load, or
// after the window changes size) and never back past a rung that failed. It
// steps down when frames are slow for two verdicts running, or at once when
// they are very slow. And "slow" is measured against the display's own
// refresh, so a 50 Hz panel or a 30 fps power cap reads as steady.
const LADDER = [
  [0.4, 16, 6],
  [0.5, 20, 8],
  [0.6, 24, 10],
  [0.7, 28, 12],
  [0.85, 32, 12],
  [1, 36, 14],
  [1, 48, 18],
  [1.25, 48, 18],
  [1.5, 56, 20],
  [2, 64, 24],
]
// never more than about a 4K frame, however big the window
const MAX_PIXELS = 8.3e6
const SETTLE_IN_MS = 12000
// A pinned rung, or a browser driven by automation (the gallery's thumbnail
// shot runs on a software renderer at a frame every few seconds), keeps its
// starting quality rather than sinking to the floor.
const automated = navigator.webdriver
const gov = {
  rung: params.has('rung') ? Math.max(0, Math.min(LADDER.length - 1, +params.get('rung') | 0)) : automated ? 6 : 4,
  ceiling: LADDER.length - 1,
  climbUntil: performance.now() + SETTLE_IN_MS,
  refresh: Infinity, // shortest steady frame interval seen: the display's own
  slowStreak: 0,
  samples: [],
  // ignore frames until then: shader compiles, and the hitch of a resize
  quietUntil: performance.now() + 2500,
  windowStart: 0,
}
const governed = params.has('govern') || (!params.has('rung') && !automated)
let born = performance.now()
let frames = 0
let last = performance.now()
let ready = false

function rungRatio(i) {
  const cap = Math.sqrt(MAX_PIXELS / Math.max(1, innerWidth * innerHeight))
  return Math.min(LADDER[i][0], cap)
}

// does rung i + 1 actually look any better than rung i on this window?
const better = (i) => i + 1 < LADDER.length && (rungRatio(i + 1) > rungRatio(i) + 1e-6 || LADDER[i + 1][1] > LADDER[i][1])

function size() {
  const pr = rungRatio(gov.rung)
  const w = Math.max(2, Math.round(innerWidth * pr))
  const h = Math.max(2, Math.round(innerHeight * pr))
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
  }
  return [w, h, pr]
}

function setRung(i, now) {
  i = Math.max(0, Math.min(LADDER.length - 1, i))
  if (i === gov.rung) return
  gov.rung = i
  gov.slowStreak = 0
  settle(now)
}

function settle(now, ms = 700) {
  gov.samples = []
  gov.quietUntil = now + ms
}

// A verdict every 45 frames or 1.5 s, whichever comes first — a device doing
// two frames a second shouldn't wait half a minute to be helped.
function govern(ms, now) {
  if (now < gov.quietUntil) return
  if (gov.samples.length === 0) gov.windowStart = now
  gov.samples.push(ms)
  const n = gov.samples.length
  if (n < 45 && !(n >= 6 && now - gov.windowStart > 1500)) return
  const sorted = gov.samples.slice().sort((a, b) => a - b)
  gov.samples = []
  const median = sorted[n >> 1]
  const p90 = sorted[Math.floor(n * 0.9)]
  gov.refresh = Math.max(4, Math.min(gov.refresh, sorted[Math.floor(n * 0.1)]))
  const slow = gov.rung > 0 && (median > Math.max(19.5, gov.refresh * 1.25) || median > 40)
  if (slow) {
    const severe = median > Math.max(34, gov.refresh * 2.2) || median > 66
    gov.slowStreak++
    if (severe || gov.slowStreak >= 2) {
      // a rung that ran slow is out of reach until the window changes size
      setRung(gov.rung - (severe ? 2 : 1), now)
      gov.ceiling = Math.min(gov.ceiling, gov.rung)
    }
    return
  }
  gov.slowStreak = 0
  const steady = median < gov.refresh * 1.08 && p90 < gov.refresh * 1.4 && median < 22
  if (steady && now < gov.climbUntil && gov.rung < gov.ceiling && better(gov.rung)) setRung(gov.rung + 1, now)
}

// subpixel offsets for the temporal resolve: Halton (2, 3)
function halton(i, b) {
  let f = 1, r = 0
  while (i > 0) {
    f /= b
    r += f * (i % b)
    i = Math.floor(i / b)
  }
  return r
}
const JITTER = Array.from({ length: 16 }, (_, i) => [halton(i + 1, 2) - 0.5, halton(i + 1, 3) - 0.5])

let prevViewProj = null
let history = 0 // frames of history the resolve can trust

function frame(now) {
  const ms = now - last
  last = now
  const dt = Math.min(0.1, ms / 1000)
  if (governed) govern(ms, now)
  frames++
  step(dt)
  requestAnimationFrame(frame)
}

function step(dt) {
  clock.tick(params.has('still') ? 0 : dt, reducedMotion)
  if (!renderer) return

  const [w, h, pr] = size()
  if (renderer.resize(w, h, pr)) history = 0
  const T = clock.wall
  const [, steps, reflSteps] = LADDER[gov.rung]

  // walking keys, held
  if (keys.size) {
    const v = 9 * dt
    walk((keys.has('KeyW') ? v : 0) - (keys.has('KeyS') ? v : 0), (keys.has('KeyD') ? v : 0) - (keys.has('KeyA') ? v : 0))
  }

  // pointer parallax, eased; the eye, eased
  pointer.sx += (pointer.x - pointer.sx) * Math.min(1, dt * 1.5)
  pointer.sy += (pointer.y - pointer.sy) * Math.min(1, dt * 1.5)
  const ease = 1 - Math.exp(-dt / 0.14)
  eye.yaw += (eye.tyaw - eye.yaw) * ease
  eye.pitch += (eye.tpitch - eye.pitch) * ease
  const walkEase = 1 - Math.exp(-dt / 0.45)
  for (let k = 0; k < 3; k++) eye.pos[k] += (eye.tpos[k] - eye.pos[k]) * walkEase

  // The eye breathes: a slow sway of where it looks and where it stands, too
  // slow to notice as motion — the hall just never quite holds still.
  const aspect = w / h
  const fov = pin('fov', Math.max(0.95, 2 * Math.atan(Math.tan(0.475) * (1.6 / aspect))))
  const yaw = HOME.yaw + eye.yaw + 0.035 * Math.sin(T / 47) + pointer.sx * 0.03
  const pitch = clampPitch(HOME.pitch + eye.pitch + 0.02 * Math.sin(T / 61 + 1) - pointer.sy * 0.02 + 0.03 * clock.hold)
  const sway = [0.5 * Math.sin(T / 97), 0.25 * Math.sin(T / 71 + 2), 0.4 * Math.sin(T / 89 + 4)]
  const pos = confine([eye.pos[0] + sway[0], eye.pos[1] + sway[1], eye.pos[2] + sway[2]])
  const fwd = [Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch)]
  cam.w = w
  cam.h = h
  cam.fov = fov
  cam.pos = pos
  cam.target = [pos[0] + fwd[0], pos[1] + fwd[1], pos[2] + fwd[2]]
  cam.update()

  // The body turns slowly in the fall, as it did in Falling Repose: a lazy
  // roll, a slow spin about its own spine, a little yaw and tilt. Story time
  // drives it all, so when time stops the opening stops changing shape.
  const s = clock.story
  const roll = pin('roll', 1.72 + 0.36 * Math.sin(s / 31) + 0.12 * Math.sin(s / 13 + 1))
  const twist = pin('twist', 1.0 + (s * Math.PI * 2) / 75 + 0.45 * Math.sin(s / 17))
  const fyaw = pin('yaw', 0.25 * Math.sin(s / 21 + 0.5))
  const tilt = pin('tilt', -0.2 + 0.2 * Math.sin(s / 17 + 2))
  const orient = mul3(rotY(fyaw), mul3(rotX(tilt), mul3(rotZ(roll), rotY(twist))))
  const wind = 0.35 + 0.6 * Math.min(2, Math.max(0, clock.blur))
  figure.pose(s, { wind, reach: pin('reach', clock.reach), wall: T, orient, preset: params.get('pose') })
  figure.project(cookieCam)

  // the opening turns a little in the ceiling, too
  const cookieRot = -0.22 + 0.14 * Math.sin(s / 89 + 0.7)
  const cookieM = ROOM.HOLE_SPAN / COOKIE
  const sun = sunAt(T)

  // the bounds of the opening on the ceiling, so the shafts are only marched
  // where they might be
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9
  for (const g of figure.groups) {
    x0 = Math.min(x0, g.cx - g.r)
    y0 = Math.min(y0, g.cy - g.r)
    x1 = Math.max(x1, g.cx + g.r)
    y1 = Math.max(y1, g.cy + g.r)
  }
  const c = Math.cos(cookieRot), sn = Math.sin(cookieRot)
  const bx = [1e9, 1e9, -1e9, -1e9]
  for (const [px, py] of [
    [x0, y0],
    [x1, y0],
    [x0, y1],
    [x1, y1],
  ]) {
    const lx = (Math.max(0, Math.min(COOKIE, px)) / COOKIE - 0.5) * ROOM.HOLE_SPAN
    const lz = (Math.max(0, Math.min(COOKIE, py)) / COOKIE - 0.5) * ROOM.HOLE_SPAN
    const wx = ROOM.HOLE_X + c * lx - sn * lz
    const wz = ROOM.HOLE_Z + sn * lx + c * lz
    bx[0] = Math.min(bx[0], wx)
    bx[1] = Math.min(bx[1], wz)
    bx[2] = Math.max(bx[2], wx)
    bx[3] = Math.max(bx[3], wz)
  }
  const margin = 0.8
  const beamBox = [bx[0] - margin, bx[1] - margin, bx[2] + margin, bx[3] + margin]

  // the resolve trusts history more the longer it has had: an average over
  // the first frames, then a running blend
  const viewProj = cam.viewProj()
  const blend = Math.max(1 / (history + 1), automated || params.has('still') ? 0.06 : 0.12)

  const fade = params.has('t') ? 1 : Math.min(1, (performance.now() - born) / 5000)
  renderer.render({
    figure,
    cam,
    prevViewProj: prevViewProj ?? viewProj,
    histValid: history > 0 && renderer.floatOk,
    blend,
    jitter: JITTER[frames % JITTER.length],
    frame: frames,
    steps,
    reflSteps,
    sun,
    cookieRot,
    cookieM,
    beamBox,
    story: s,
    wall: T,
    // dust banks sink at about a fifth of a metre a second while time runs
    drift: (clock.fall * 0.0021) % 1,
    dustFall: clock.fall * 0.05,
    shutter: 0.04 * Math.max(0.12, clock.blur),
    focus: 45,
    dust: !params.has('nodust'),
    exposure: pin('exp', 2.5) * (1.0 + 0.2 * clock.swell),
    palette: palette(T + 20),
    fade: fade * fade,
    bloom: 0.06,
    pr,
    debug: params.has('cookie'),
  })
  prevViewProj = viewProj
  history++

  if (!ready && fade >= 1 && frames > (automated ? 14 : 8)) {
    ready = true
    document.body.classList.add('ready')
  }
}

// a new window size is a new budget: settle in again, from scratch
addEventListener('resize', () => {
  const now = performance.now()
  settle(now)
  gov.ceiling = LADDER.length - 1
  gov.climbUntil = now + SETTLE_IN_MS
  gov.slowStreak = 0
})
document.addEventListener('visibilitychange', () => {
  last = performance.now()
  settle(last, 1500)
  if (document.hidden) release()
})

wake()
// Before drawing anything, time a few empty frames: that is the display's own
// refresh, which the governor judges "slow" against. The fade starts at the
// first frame actually drawn.
const calibration = []
function calibrate(t) {
  calibration.push(t)
  if (calibration.length < 18) {
    requestAnimationFrame(calibrate)
    return
  }
  const gaps = calibration
    .slice(1)
    .map((x, i) => x - calibration[i])
    .sort((a, b) => a - b)
  gov.refresh = Math.max(4, gaps[gaps.length >> 1])
  last = t
  born = t
  gov.quietUntil = t + 2500
  gov.climbUntil = t + SETTLE_IN_MS
  requestAnimationFrame(frame)
}
requestAnimationFrame(calibrate)
