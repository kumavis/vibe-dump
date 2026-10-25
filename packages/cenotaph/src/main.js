import { Renderer, COOKIE } from './renderer.js'
import { Figure } from './figure.js'
import { Camera, mul3, rotY, rotZ, rotX, norm3 } from './mat.js'
import { Clock } from './clock.js'
import { ROOM, FIGURE_SCALE, confine } from './room.js'
import { Score, LAYERS } from './audio.js'
import { tune, compare, reference, mountPanel } from './tune.js'

const canvas = document.getElementById('view')
const resetBtn = document.getElementById('reset')
const soundBtn = document.getElementById('sound')
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
//   ?layers=dust,breath   play only these parts of the score (see audio.js)
//   #debug       a panel of sliders for the light, the air, the dust, the
//                floor, the lens and the sound (see tune.js)
// They also read from the hash, because some places (an artifact link) pass
// only a plain #anchor through to the page: there, write ~ between settings
// and _ for =, as in #t_200~y_12. Changing them reloads.
const DEV_KEYS = ['t', 'still', 'cookie', 'pose', 'roll', 'twist', 'yaw', 'tilt', 'reach', 'sdf8', 'rung', 'govern', 'x', 'y', 'z', 'vyaw', 'vpitch', 'nodust', 'exp', 'fov', 'layers', 'adaptlog', 'adaptkey', 'debug']
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
if (params.has('debug')) mountPanel()
const score = new Score({ tune, layers: params.has('layers') ? params.get('layers').split(/[,.]/).filter((k) => LAYERS.includes(k)) : LAYERS })

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

// The light changes over minutes. It opens on a cold blue-white, then a white
// noon, an afternoon gold, a rose evening and moonlight, and round again; the
// hall takes the colour of whatever is pouring in. Linear RGB: the sun's
// irradiance square on, the sky's radiance through the opening, and the air's
// own faint glow. How strong each is comes from the tuning (tune.js).
const PALETTES = [
  { sun: [0.69, 0.75, 0.92], sky: [0.27, 0.35, 0.54], fog: [0.015, 0.017, 0.024] },
  { sun: [1.0, 0.96, 0.9], sky: [0.46, 0.6, 0.86], fog: [0.02, 0.022, 0.026] },
  { sun: [1.0, 0.8, 0.58], sky: [0.5, 0.6, 0.74], fog: [0.02, 0.021, 0.024] },
  { sun: [1.0, 0.6, 0.44], sky: [0.66, 0.5, 0.6], fog: [0.024, 0.019, 0.022] },
  { sun: [0.62, 0.74, 1.0], sky: [0.22, 0.3, 0.5], fog: [0.014, 0.017, 0.024] },
]
const PALETTE_SPAN = 95 // seconds per colour

function palette(t, tune) {
  // a colour pinned from the tuning panel holds; otherwise they cycle
  const x = tune.palette >= 0 ? Math.min(PALETTES.length - 1, tune.palette | 0) : (t / PALETTE_SPAN) % PALETTES.length
  const i = Math.floor(x)
  // each colour holds for most of its span, then turns into the next
  let f = Math.max(0, (x - i - 0.6) / 0.4)
  f = f * f * (3 - 2 * f)
  const a = PALETTES[i], b = PALETTES[(i + 1) % PALETTES.length]
  const mix = (k, s) => a[k].map((v, j) => (v + (b[k][j] - v) * f) * s)
  return { sun: mix('sun', tune.sun), sky: mix('sky', tune.sun * tune.sky), fog: mix('fog', tune.sun * tune.glow) }
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
// down its length toward the light. Click and move the mouse to look, WASD or
// the arrows to walk (Shift to run); on a touch screen, drag to look and pinch
// to walk.
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
const touches = new Map()
const keys = new Set()
let dragging = false
let pinch = null
let spaceHeld = false
let mouseHeld = false
let idleTimer = 0
let lastInput = -Infinity // when the eye was last steered, for the idle sway

function wake() {
  document.body.classList.remove('idle')
  clearTimeout(idleTimer)
  idleTimer = setTimeout(() => document.body.classList.add('idle'), 2600)
}

function press() {
  clock.holding = true
  if (!score.started && !score.muted) startSound()
}
function release() {
  clock.holding = spaceHeld || mouseHeld
}

function startSound() {
  score
    .start()
    .then(() => document.body.classList.add('sounding'))
    .catch((err) => console.warn('no sound:', err))
}

const clampPitch = (p) => Math.max(-PITCH_MAX, Math.min(PITCH_MAX, p))

// the direction the eye faces, flattened to the floor
function heading() {
  const y = HOME.yaw + eye.tyaw
  return [Math.sin(y), 0, -Math.cos(y)]
}

// First-person: move the mouse (or a finger) right and the eye turns right,
// up and it looks up. `rate` is radians per pixel moved.
const MOUSE_RATE = 0.0022
const TOUCH_RATE = 0.005
function look(dx, dy, rate) {
  eye.tyaw += dx * rate
  // clamped as drawn, so the end of the range is never a dead zone
  eye.tpitch = clampPitch(HOME.pitch + eye.tpitch - dy * rate) - HOME.pitch
  eye.slow = false
  lastInput = performance.now()
  markMoved()
}

// in half-metre steps, each kept out of the concrete, so a long stride slides
// round a pier instead of passing through it
function walk(forward, side = 0) {
  const f = heading()
  const r = [-f[2], 0, f[0]]
  const dx = f[0] * forward + r[0] * side, dz = f[2] * forward + r[2] * side
  const n = Math.max(1, Math.ceil(Math.hypot(dx, dz) / 0.5))
  let p = eye.tpos
  for (let i = 0; i < n; i++) p = confine([p[0] + dx / n, p[1], p[2] + dz / n])
  eye.tpos = p
  eye.slow = false
  lastInput = performance.now()
  markMoved()
}

function resetView() {
  eye.tyaw = 0
  eye.tpitch = 0
  eye.tpos = confine([HOME.x, HOME.y, HOME.z])
  // turn the short way round, and unhurried
  eye.yaw = Math.atan2(Math.sin(eye.yaw), Math.cos(eye.yaw))
  eye.slow = true
  markMoved()
}

function markMoved() {
  const d = Math.hypot(eye.tpos[0] - HOME.x, eye.tpos[1] - HOME.y, eye.tpos[2] - HOME.z)
  const moved = Math.abs(Math.atan2(Math.sin(eye.tyaw), Math.cos(eye.tyaw))) > 0.03 || Math.abs(eye.tpitch) > 0.03 || d > 0.5
  document.body.classList.toggle('moved', moved)
}

// the buttons, and the tuning panel, are not the hall
const isControl = (e) => e.target.closest?.('button, .tune-ui')

// The mouse is the standard first-person one: a click captures it (pointer
// lock), moving it looks, Esc lets it go. While it is captured, holding a
// button holds time. Where a page can't capture it (some embeds refuse), a
// drag looks instead, the same way round.
let lockable = typeof canvas.requestPointerLock === 'function'
const locked = () => document.pointerLockElement === canvas
document.addEventListener('pointerlockerror', () => {
  lockable = false
})
document.addEventListener('pointerlockchange', () => {
  document.body.classList.toggle('locked', locked())
  if (!locked() && mouseHeld) {
    mouseHeld = false
    release()
  }
})
function capture() {
  try {
    const p = canvas.requestPointerLock()
    p?.catch?.(() => {
      lockable = false
    })
  } catch {
    lockable = false
  }
}

addEventListener('pointerdown', (e) => {
  if (isControl(e)) return
  wake()
  if (e.pointerType === 'mouse' && lockable) {
    if (!locked()) capture()
    mouseHeld = true
    press()
    return
  }
  try {
    canvas.setPointerCapture(e.pointerId)
  } catch {}
  touches.set(e.pointerId, { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY })
  if (touches.size === 1) {
    dragging = false
    press()
  } else {
    // two fingers: pinch to walk, move together to look
    reseedPinch()
    dragging = true
    release()
  }
})

// whenever the set of fingers changes, measure the pinch afresh, or lifting
// one of three would read as a giant stride
function reseedPinch() {
  if (touches.size === 2) {
    const [a, b] = [...touches.values()]
    pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1 }
  } else pinch = null
}

addEventListener('pointermove', (e) => {
  wake()
  if (locked()) {
    // (a browser can report one wild jump as the lock takes hold)
    const clip = (v) => Math.max(-200, Math.min(200, v || 0))
    look(clip(e.movementX), clip(e.movementY), MOUSE_RATE)
    return
  }
  const t = touches.get(e.pointerId)
  if (!t) return
  const dx = e.clientX - t.x, dy = e.clientY - t.y
  t.x = e.clientX
  t.y = e.clientY
  const rate = e.pointerType === 'mouse' ? MOUSE_RATE * 1.4 : TOUCH_RATE
  if (touches.size === 1) {
    // a press that starts to move becomes a look, and lets time go
    if (!dragging && Math.hypot(t.x - t.x0, t.y - t.y0) > 6) {
      dragging = true
      release()
    }
    if (dragging) look(dx, dy, rate)
  } else if (touches.size === 2 && pinch) {
    const [a, b] = [...touches.values()]
    const d = Math.hypot(a.x - b.x, a.y - b.y) || 1
    walk((d - pinch.d) * 0.12)
    pinch.d = d
    look(dx / 2, dy / 2, rate)
  }
})

function lift(e) {
  if (e.pointerType === 'mouse' && mouseHeld) {
    mouseHeld = false
    release()
  }
  touches.delete(e.pointerId)
  reseedPinch()
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
  mouseHeld = false
  release()
})

addEventListener(
  'wheel',
  (e) => {
    if (isControl(e)) return
    e.preventDefault()
    wake()
    const px = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY
    walk(-Math.max(-240, Math.min(240, px)) * 0.03)
  },
  { passive: false },
)

// WASD or the arrows walk, Shift runs
const MOVE_KEYS = {
  KeyW: [1, 0],
  ArrowUp: [1, 0],
  KeyS: [-1, 0],
  ArrowDown: [-1, 0],
  KeyD: [0, 1],
  ArrowRight: [0, 1],
  KeyA: [0, -1],
  ArrowLeft: [0, -1],
}
addEventListener('keydown', (e) => {
  wake()
  // keys typed into the panel's sliders are the panel's
  if (isControl(e) && /^(INPUT|SELECT)$/.test(e.target.tagName)) return
  // a shortcut is not a step: and a letter let go while Cmd is down never
  // reports its release, so drop any walking held
  if (e.metaKey || e.ctrlKey || e.altKey) {
    keys.clear()
    return
  }
  const k = e.key
  if (e.code in MOVE_KEYS || e.key === 'Shift') keys.add(e.key === 'Shift' ? 'Shift' : e.code)
  else if (k === '+' || k === '=') walk(3)
  else if (k === '-' || k === '_') walk(-3)
  else if (e.repeat) return
  else if (e.code === 'Space') {
    spaceHeld = true
    press()
  } else if (e.code === 'KeyM') toggleSound()
  else if (e.code === 'KeyF') toggleFullscreen()
  else if (e.code === 'KeyR' || k === '0') resetView()
  else return
  e.preventDefault()
})
addEventListener('keyup', (e) => {
  keys.delete(e.code)
  if (e.key === 'Shift') keys.delete('Shift')
  if (e.key === 'Meta') keys.clear()
  if (e.code === 'Space') {
    spaceHeld = false
    if (touches.size === 0 || dragging) release()
  }
})
addEventListener('dblclick', (e) => {
  if (!isControl(e) && !locked()) toggleFullscreen()
})
addEventListener('contextmenu', (e) => e.preventDefault())

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen?.()
  else document.documentElement.requestFullscreen?.().catch(() => {})
}

function toggleSound() {
  if (!score.started) {
    score.muted = false
    startSound()
    return
  }
  score.setMuted(!score.muted)
  document.body.classList.toggle('sounding', !score.muted)
}
soundBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  toggleSound()
})
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

// What fills the frame: your values, the reference's, or the two side by
// side, the reference on the left (see tune.js).
function side(vals, x0, x1, T) {
  return { tune: vals, palette: palette(T, vals), exposure: pin('exp', vals.exposure) * (1.0 + 0.2 * clock.swell), x0, x1 }
}
function sides(T) {
  if (compare.view === 'split') return [side(reference(), 0, compare.split, T), side(tune, compare.split, 1, T)]
  return [side(compare.view === 'ref' ? reference() : tune, 0, 1, T)]
}

let prevViewProj = null
let lightInView = 1
// Falling Repose opens on the body in profile, which cut flat into a ceiling
// is a straight line; this one starts further into the same fall, where the
// arms are up and the knees drawn in and the shape reads as a person.
const STORY_OFFSET = 118
// the brightest a frame may be on average (log luminance) before the eye
// stops down: a little above the view from the start, so that one is untouched
const ADAPT_KEY = pin('adaptkey', -3.8)
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
  // the sound follows whichever values fill the frame
  score.tune = compare.view === 'ref' ? reference() : tune
  score.update(clock, lightInView)
  if (!renderer) return

  const [w, h, pr] = size()
  if (renderer.resize(w, h, pr)) history = 0
  const T = clock.wall
  const [, steps, reflSteps] = LADDER[gov.rung]

  // walking keys, held: about a brisk walk, three times that running
  let fw = 0, sd = 0
  for (const code of keys) if (MOVE_KEYS[code]) (fw += MOVE_KEYS[code][0]), (sd += MOVE_KEYS[code][1])
  if (fw || sd) {
    const v = (keys.has('Shift') ? 18 : 6) * dt / Math.hypot(fw, sd)
    walk(fw * v, sd * v)
  }

  // the eye follows the mouse all but at once; only a reset swings it home
  // slowly
  const ease = 1 - Math.exp(-dt / (eye.slow ? 0.4 : 0.03))
  eye.yaw += (eye.tyaw - eye.yaw) * ease
  eye.pitch += (eye.tpitch - eye.pitch) * ease
  const walkEase = 1 - Math.exp(-dt / (eye.slow ? 0.45 : 0.12))
  // (kept out of the concrete as it goes, so it slides round a corner)
  eye.pos = confine(eye.pos.map((v, k) => v + (eye.tpos[k] - v) * walkEase))

  // The eye breathes: a slow sway of where it looks and where it stands, too
  // slow to notice as motion — the hall just never quite holds still.
  const aspect = w / h
  // the landscape lens keeps its width on narrower screens, up to a point:
  // past 86° tall it narrows instead, so a phone still sees the opening
  const vTan = Math.min((Math.tan(0.475) * 1.6) / aspect, Math.tan(0.75))
  const fov = pin('fov', 2 * Math.atan(Math.max(Math.tan(0.475), vTan)))
  // (it settles while someone is steering, and returns once they stop)
  const since = (performance.now() - lastInput) / 1000
  const calm = since < 4 ? 0 : Math.min(1, (since - 4) / 8)
  const yaw = HOME.yaw + eye.yaw + calm * 0.035 * Math.sin(T / 47)
  const pitch = clampPitch(HOME.pitch + eye.pitch + calm * 0.02 * Math.sin(T / 61 + 1) + 0.03 * clock.hold)
  const sway = [0.5 * calm * Math.sin(T / 97), 0.25 * calm * Math.sin(T / 71 + 2), 0.4 * calm * Math.sin(T / 89 + 4)]
  const pos = confine([eye.pos[0] + sway[0], eye.pos[1] + sway[1], eye.pos[2] + sway[2]])
  const fwd = [Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch)]
  cam.w = w
  cam.h = h
  cam.fov = fov
  cam.pos = pos
  cam.target = [pos[0] + fwd[0], pos[1] + fwd[1], pos[2] + fwd[2]]
  cam.update()

  // how much of the light is in view, for the score: the middle of the shaft,
  // on screen or near it
  {
    const sunNow = sunAt(T)
    const mid = [ROOM.HOLE_X - (sunNow[0] / sunNow[1]) * ROOM.H * 0.5, ROOM.H * 0.5, ROOM.HOLE_Z - (sunNow[2] / sunNow[1]) * ROOM.H * 0.5]
    const [px, py, depth] = cam.project(mid)
    const c = cam.toCam(mid)
    const off = Math.max(Math.abs(px / w - 0.5), Math.abs(py / h - 0.5))
    lightInView = c[2] < 0 ? Math.max(0, Math.min(1, (0.9 - off) / 0.4)) * Math.min(1, 40 / depth) : 0
  }

  // The body turns slowly in the fall, as it did in Falling Repose: a lazy
  // roll, a slow spin about its own spine, a little yaw and tilt. Story time
  // drives it all, so when time stops the opening stops changing shape.
  const s = clock.story + STORY_OFFSET
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
    histValid: history > 0,
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
    exposure: pin('exp', tune.exposure) * (1.0 + 0.2 * clock.swell),
    tune,
    palette: palette(T, tune),
    sides: sides(T),
    fade: fade * fade,
    dt,
    adaptKey: ADAPT_KEY,
    logAdapt: params.has('adaptlog') && frames % 4 === 0,
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
  score.setHidden(document.hidden)
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
