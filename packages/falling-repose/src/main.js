import { Renderer } from './renderer.js'
import { Figure } from './figure.js'
import { Camera, mul3, rotY, rotZ, rotX } from './mat.js'
import { Clock } from './clock.js'
import { Score } from './audio.js'

const canvas = document.getElementById('view')
const soundBtn = document.getElementById('sound')
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

// Development aids, read from the query string and otherwise invisible:
//   ?t=95        start the clock at 95 s (skips the fade)
//   ?still       freeze the clock
//   ?fig         draw only the silhouette, black on paper
//   ?pose=curl   pin a pose key (open, curl, surrender, stand)
//   ?roll= &twist= &yaw= &tilt=   pin the body's orientation
//   ?reach=1     pin the gesture
//   ?sdf8        use the 8-bit fallback targets
const params = new URLSearchParams(location.search)
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
const score = new Score()

// The light changes colour over minutes — gold, then moon, then rose, then sea.
// Linear RGB; `atten` is how fast each channel is scattered out of a shaft.
const PALETTES = [
  {
    core: [1.0, 0.72, 0.4],
    halo: [0.7, 0.42, 0.2],
    atten: [3.2, 1.7, 1.1],
    bgTop: [0.004, 0.016, 0.024],
    bgBot: [0.0, 0.002, 0.004],
    sky: [0.008, 0.03, 0.034],
  },
  {
    core: [0.8, 0.88, 1.0],
    halo: [0.26, 0.38, 0.55],
    atten: [2.0, 1.45, 0.95],
    bgTop: [0.004, 0.011, 0.028],
    bgBot: [0.0, 0.001, 0.005],
    sky: [0.008, 0.018, 0.036],
  },
  {
    core: [1.0, 0.7, 0.66],
    halo: [0.5, 0.28, 0.36],
    atten: [1.8, 2.0, 1.35],
    bgTop: [0.012, 0.006, 0.022],
    bgBot: [0.002, 0.0, 0.004],
    sky: [0.02, 0.012, 0.03],
  },
  {
    core: [0.82, 1.0, 0.9],
    halo: [0.22, 0.48, 0.46],
    atten: [2.8, 1.25, 1.35],
    bgTop: [0.002, 0.018, 0.02],
    bgBot: [0.0, 0.002, 0.003],
    sky: [0.006, 0.03, 0.028],
  },
]
const PALETTE_SPAN = 95 // seconds per colour

function palette(t) {
  const x = (t / PALETTE_SPAN) % PALETTES.length
  const i = Math.floor(x)
  let f = x - i
  f = f * f * (3 - 2 * f)
  const a = PALETTES[i], b = PALETTES[(i + 1) % PALETTES.length]
  const out = {}
  for (const k of Object.keys(a)) out[k] = a[k].map((v, j) => v + (b[k][j] - v) * f)
  return out
}

// ---- input: press and hold to hold time -----------------------------------
let pointer = { x: 0, y: 0, sx: 0, sy: 0 }
let idleTimer = 0

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
  clock.holding = false
}

function startSound() {
  score
    .start()
    .then(() => document.body.classList.add('sounding'))
    .catch((err) => console.warn('no sound:', err))
}

addEventListener('pointerdown', (e) => {
  if (e.target.closest('#sound')) return
  wake()
  press()
})
addEventListener('pointerup', release)
addEventListener('pointercancel', release)
addEventListener('blur', release)
addEventListener('pointermove', (e) => {
  wake()
  pointer.x = (e.clientX / innerWidth) * 2 - 1
  pointer.y = (e.clientY / innerHeight) * 2 - 1
})
addEventListener('keydown', (e) => {
  if (e.repeat) return
  if (e.code === 'Space') {
    e.preventDefault()
    press()
  } else if (e.code === 'KeyM') toggleSound()
  else if (e.code === 'KeyF') toggleFullscreen()
})
addEventListener('keyup', (e) => {
  if (e.code === 'Space') release()
})
addEventListener('dblclick', toggleFullscreen)
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

// ---- frame ----------------------------------------------------------------
// Start a little under full resolution on dense screens; the frame-time
// governor below raises or lowers it from there.
let scale = (devicePixelRatio || 1) > 1.5 ? 0.8 : 1
const born = performance.now()
let frameTimes = []
let frames = 0
let last = performance.now()
let ready = false

function size() {
  const dpr = Math.min(devicePixelRatio || 1, 2)
  const w = Math.max(2, Math.round(innerWidth * dpr * scale))
  const h = Math.max(2, Math.round(innerHeight * dpr * scale))
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
  }
  return [w, h]
}

function adapt(ms) {
  frameTimes.push(ms)
  if (frameTimes.length < 40) return
  frameTimes.sort((a, b) => a - b)
  const median = frameTimes[20]
  frameTimes = []
  if (median > 24 && scale > 0.45) scale = Math.max(0.45, scale * 0.85)
  else if (median < 12 && scale < 1) scale = Math.min(1, scale * 1.1)
}

function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000)
  last = now
  if (frames > 3) adapt(dt * 1000)
  frames++
  step(dt)
  requestAnimationFrame(frame)
}

function step(dt) {
  clock.tick(params.has('still') ? 0 : dt, reducedMotion)
  score.update(clock)
  if (!renderer) return

  const [w, h] = size()
  renderer.resize(w, h)
  const T = clock.wall

  // pointer parallax, eased
  pointer.sx += (pointer.x - pointer.sx) * Math.min(1, dt * 1.5)
  pointer.sy += (pointer.y - pointer.sy) * Math.min(1, dt * 1.5)

  // Dolly zoom: in a suspension the lens narrows and the camera backs away,
  // so the figure holds its size while the world behind it flattens.
  const aspect = w / h
  const halfH = Math.max(1.36, 1.3 / aspect)
  const fov = 0.68 - 0.24 * clock.susp + 0.14 * clock.rush - 0.08 * clock.hold
  const dist = halfH / Math.tan(fov / 2)
  const yaw = 0.1 * Math.sin(T / 41) + pointer.sx * 0.08
  const pitch = 0.1 + 0.07 * Math.sin(T / 53) + 0.18 * clock.rush + pointer.sy * 0.06
  cam.w = w
  cam.h = h
  cam.fov = fov
  cam.target = [0, 0, 0]
  cam.pos = [Math.sin(yaw) * Math.cos(pitch) * dist, Math.sin(pitch) * dist, Math.cos(yaw) * Math.cos(pitch) * dist]
  cam.update()

  // The body turns slowly in the fall: a lazy roll in the picture plane, a
  // turn about its own spine that takes it from open-fronted to profile, and a
  // little yaw and tilt so it is never quite square to us.
  const s = clock.story
  // (kept near the horizontal: a body plunging head-first reads as a
  // particular, real fall rather than this one)
  const roll = pin('roll', 1.72 + 0.4 * Math.sin(s / 47) + 0.12 * Math.sin(s / 19 + 1))
  const twist = pin('twist', 0.45 + 0.75 * Math.sin(s / 41 + 0.3))
  const fyaw = pin('yaw', 0.25 * Math.sin(s / 37 + 0.5))
  const tilt = pin('tilt', -0.2 + 0.2 * Math.sin(s / 29 + 2))
  const orient = mul3(rotY(fyaw), mul3(rotX(tilt), mul3(rotZ(roll), rotY(twist))))
  const wind = 0.35 + 0.6 * Math.min(2, Math.max(0, clock.blur))
  figure.pose(s, { wind, reach: pin('reach', clock.reach), wall: T, orient, preset: params.get('pose') })
  figure.project(cam)

  // the light sits behind the torso, wandering a little so the shafts sweep
  const tp = figure.torsoPx
  const lightPx = [
    tp[0] + figure.pxPerM * (0.12 * Math.sin(T / 29) + 0.05 * Math.sin(T / 11)),
    tp[1] + figure.pxPerM * (0.08 * Math.sin(T / 37 + 2) + 0.04),
  ]

  const fallPeriod = renderer.wrap * 8
  // fade in on real time, not the clock's — a slow first frame shouldn't
  // stretch the dark
  const fade = params.has('t') ? 1 : Math.min(1, (performance.now() - born) / 5000)
  renderer.render({
    figure,
    cam,
    lightPx,
    story: s,
    wall: T,
    fallSmall: clock.fall % fallPeriod,
    shutter: 0.085 * Math.max(0.12, clock.blur),
    focus: dist,
    aperture: 0.06,
    exposure: 1.0 + 0.3 * clock.swell,
    swell: clock.swell,
    palette: palette(T + 20),
    fade: fade * fade,
    bloom: 0.3,
    debug: params.has('fig'),
  })

  if (!ready && fade >= 1 && frames > 8) {
    ready = true
    document.body.classList.add('ready')
  }
}

addEventListener('resize', () => (frameTimes = []))
document.addEventListener('visibilitychange', () => {
  last = performance.now()
  if (document.hidden) release()
  score.setHidden(document.hidden)
})

wake()
requestAnimationFrame((t) => {
  last = t
  requestAnimationFrame(frame)
})
