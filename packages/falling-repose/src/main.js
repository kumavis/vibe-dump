import { Renderer } from './renderer.js'
import { Figure } from './figure.js'
import { Camera, mul3, rotY, rotZ, rotX } from './mat.js'
import { Clock } from './clock.js'
import { Score } from './audio.js'

const canvas = document.getElementById('view')
const soundBtn = document.getElementById('sound')
const resetBtn = document.getElementById('reset')
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

// Development aids, read from the query string and otherwise invisible:
//   ?t=95        start the clock at 95 s (skips the fade)
//   ?still       freeze the clock
//   ?fig         draw only the silhouette, black on paper
//   ?pose=curl   pin a pose key (open, curl, surrender, stand)
//   ?roll= &twist= &yaw= &tilt=   pin the body's orientation
//   ?reach=1     pin the gesture
//   ?sdf8        use the 8-bit fallback targets
//   ?rung=9      pin the quality ladder (0 roughest … 9 supersampled)
//   ?govern      let the frame-rate governor run even under automation
//   ?zoom=3 &vyaw=1 &vpitch=0.8   start the viewer's camera somewhere else
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

// ---- input -----------------------------------------------------------------
// Press and hold anywhere to hold time. Drag to turn the camera round the
// body; wheel or pinch to come closer or pull far back. A press that starts to
// move becomes a drag and lets time go again — unless Space is down, which
// holds time on its own, so Space + drag looks round a frozen moment.
const pointer = { x: 0, y: 0, sx: 0, sy: 0 }
// the viewer's own camera, on top of the piece's slow drift; t* are targets
const view = { yaw: pin('vyaw', 0), pitch: pin('vpitch', 0), zoom: pin('zoom', 1) }
view.tyaw = view.yaw
view.tpitch = view.pitch
view.tzoom = view.zoom
const ZOOM_MIN = 0.5
const ZOOM_MAX = 4.5
const PITCH_MAX = 1.3
const touches = new Map()
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
  if (!score.started && !score.muted) startSound()
}
function release() {
  clock.holding = spaceHeld
}

function startSound() {
  score
    .start()
    .then(() => document.body.classList.add('sounding'))
    .catch((err) => console.warn('no sound:', err))
}

const clampPitch = (p) => Math.max(-PITCH_MAX, Math.min(PITCH_MAX, p))
const clampZoom = (z) => Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z))

// grab-the-world: drag right and the scene turns right, drag down and the
// camera rises to look down on it
function orbit(dx, dy) {
  view.tyaw -= dx * 0.006
  view.tpitch = clampPitch(view.tpitch + dy * 0.005)
  markMoved()
}

function zoomBy(factor) {
  view.tzoom = clampZoom(view.tzoom * factor)
  markMoved()
}

function resetView() {
  view.tyaw = 0
  view.tpitch = 0
  view.tzoom = 1
  // turn the long way round no more than half a turn
  view.yaw = Math.atan2(Math.sin(view.yaw), Math.cos(view.yaw))
  markMoved()
}

function markMoved() {
  const moved = Math.abs(Math.atan2(Math.sin(view.tyaw), Math.cos(view.tyaw))) > 0.03 || Math.abs(view.tpitch) > 0.03 || Math.abs(Math.log(view.tzoom)) > 0.03
  document.body.classList.toggle('moved', moved)
}

const isControl = (e) => e.target.closest?.('button')

addEventListener('pointerdown', (e) => {
  if (isControl(e)) return
  wake()
  // keep the drag even if it leaves the window, so its release still arrives
  try {
    canvas.setPointerCapture(e.pointerId)
  } catch {}
  touches.set(e.pointerId, { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY })
  if (touches.size === 1) {
    dragging = false
    press()
  } else if (touches.size === 2) {
    // two fingers: pinch to zoom, move together to turn
    const [a, b] = [...touches.values()]
    pinch = { d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, zoom0: view.tzoom }
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
    if (dragging) orbit(dx, dy)
  } else if (touches.size === 2 && pinch) {
    const [a, b] = [...touches.values()]
    const d = Math.hypot(a.x - b.x, a.y - b.y) || 1
    view.tzoom = clampZoom((pinch.zoom0 * pinch.d0) / d)
    orbit(dx / 2, dy / 2)
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
    zoomBy(Math.exp(Math.max(-200, Math.min(200, px)) * 0.0015))
  },
  { passive: false },
)

addEventListener('keydown', (e) => {
  wake()
  const k = e.key
  if (k === 'ArrowLeft') orbit(-28, 0)
  else if (k === 'ArrowRight') orbit(28, 0)
  else if (k === 'ArrowUp') orbit(0, -28)
  else if (k === 'ArrowDown') orbit(0, 28)
  else if (k === '+' || k === '=') zoomBy(1 / 1.15)
  else if (k === '-' || k === '_') zoomBy(1.15)
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
// pixels per texel of the silhouette's distance field]. Above 1 on an ordinary
// screen it supersamples, and the browser's downscale smooths the edges — the
// thin hair most of all. The governor drops a rung when frames run slow,
// climbs one when there's headroom, and once a climb fails it leaves that
// rung alone for a while instead of flickering between the two.
const LADDER = [
  [0.5, 2],
  [0.6, 2],
  [0.7, 2],
  [0.85, 2],
  [1, 2],
  [1, 1],
  [1.25, 1],
  [1.5, 1],
  [1.75, 1],
  [2, 1],
]
// never more than about a 4K frame, however big the window
const MAX_PIXELS = 8.3e6
const gov = {
  rung: params.has('rung') ? Math.max(0, Math.min(LADDER.length - 1, +params.get('rung') | 0)) : (devicePixelRatio || 1) >= 2 ? 7 : 5,
  ceiling: LADDER.length - 1,
  blockedUntil: 0,
  backoff: 30000,
  climbed: false,
  samples: [],
  // ignore frames until then: shader compiles, and the hitch of a resize
  quietUntil: performance.now() + 2500,
  windowStart: 0,
}
// A pinned rung, or a browser driven by automation (the gallery's thumbnail
// shot runs on a software renderer at a few frames a second), keeps its
// starting quality rather than sinking to the floor.
const governed = params.has('govern') || (!params.has('rung') && !navigator.webdriver)
const born = performance.now()
let frames = 0
let last = performance.now()
let ready = false

function rungRatio(i) {
  const cap = Math.sqrt(MAX_PIXELS / Math.max(1, innerWidth * innerHeight))
  return Math.min(LADDER[i][0], cap)
}

function size() {
  const pr = rungRatio(gov.rung)
  const w = Math.max(2, Math.round(innerWidth * pr))
  const h = Math.max(2, Math.round(innerHeight * pr))
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
  }
  return [w, h, LADDER[gov.rung][1]]
}

function setRung(i, now) {
  i = Math.max(0, Math.min(LADDER.length - 1, i))
  if (i === gov.rung) return
  gov.climbed = i > gov.rung
  gov.rung = i
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
  const median = sorted[n >> 1]
  const p90 = sorted[Math.floor(n * 0.9)]
  gov.samples = []
  if (now > gov.blockedUntil) gov.ceiling = LADDER.length - 1
  if (median > 19.5 && gov.rung > 0) {
    // slow: step down (two rungs if badly slow); a failed climb sets a ceiling
    // Each failed climb waits twice as long before trying again, so a
    // machine on the edge doesn't pop between two sharpnesses forever.
    if (gov.climbed) {
      gov.ceiling = gov.rung - 1
      gov.blockedUntil = now + gov.backoff
      gov.backoff = Math.min(gov.backoff * 2, 600000)
    }
    setRung(gov.rung - (median > 34 ? 2 : 1), now)
    gov.climbed = false
  } else if (median < 17.6 && p90 < 22 && gov.rung < gov.ceiling && rungRatio(gov.rung + 1) > rungRatio(gov.rung) + 1e-6) {
    setRung(gov.rung + 1, now)
  } else {
    gov.climbed = false
  }
}

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
  score.update(clock)
  if (!renderer) return

  const [w, h, sdfDiv] = size()
  renderer.resize(w, h, sdfDiv)
  const T = clock.wall

  // pointer parallax, eased; the viewer's camera, eased
  pointer.sx += (pointer.x - pointer.sx) * Math.min(1, dt * 1.5)
  pointer.sy += (pointer.y - pointer.sy) * Math.min(1, dt * 1.5)
  const ease = 1 - Math.exp(-dt / 0.14)
  view.yaw += (view.tyaw - view.yaw) * ease
  view.pitch += (view.tpitch - view.pitch) * ease
  view.zoom = Math.exp(Math.log(view.zoom) + (Math.log(view.tzoom) - Math.log(view.zoom)) * (1 - Math.exp(-dt / 0.2)))

  // Dolly zoom: in a suspension the lens narrows and the camera backs away,
  // so the figure holds its size while the world behind it flattens.
  const aspect = w / h
  const halfH = Math.max(1.36, 1.5 / aspect)
  const fov = 0.68 - 0.24 * clock.susp + 0.14 * clock.rush - 0.08 * clock.hold
  const dist = (halfH / Math.tan(fov / 2)) * view.zoom
  const yaw = 0.1 * Math.sin(T / 41) + pointer.sx * 0.08 + view.yaw
  const pitch = clampPitch(0.1 + 0.07 * Math.sin(T / 53) + 0.18 * clock.rush + pointer.sy * 0.06 + view.pitch)
  cam.w = w
  cam.h = h
  cam.fov = fov
  cam.target = [0, 0, 0]
  cam.pos = [Math.sin(yaw) * Math.cos(pitch) * dist, Math.sin(pitch) * dist, Math.cos(yaw) * Math.cos(pitch) * dist]
  cam.update()

  // The body turns slowly in the fall: a lazy roll in the picture plane, a
  // slow spin about its own spine — open-fronted, profile, back, profile — and
  // a little yaw and tilt so it is never quite square to us. Story time drives
  // it all, so when time stops the spin stops.
  const s = clock.story
  // (kept near the horizontal: a body plunging head-first reads as a
  // particular, real fall rather than this one)
  const roll = pin('roll', 1.72 + 0.36 * Math.sin(s / 31) + 0.12 * Math.sin(s / 13 + 1))
  const twist = pin('twist', 1.0 + (s * Math.PI * 2) / 75 + 0.45 * Math.sin(s / 17))
  const fyaw = pin('yaw', 0.25 * Math.sin(s / 21 + 0.5))
  const tilt = pin('tilt', -0.2 + 0.2 * Math.sin(s / 17 + 2))
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

  // the particle field is periodic in 960 units of fall (see vsParticles);
  // the haze only needs the drift to stay small enough for float precision
  const fallPeriod = 960
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
    drift: clock.fall % 65536,
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

addEventListener('resize', () => settle(performance.now()))
document.addEventListener('visibilitychange', () => {
  last = performance.now()
  settle(last, 1500)
  if (document.hidden) release()
  score.setHidden(document.hidden)
})

wake()
requestAnimationFrame((t) => {
  last = t
  requestAnimationFrame(frame)
})
