// main.js — boot: query params, renderer, the Book, the HUD and the loop.
//
// Query params (all optional):
//   ?page=<id|index>   open directly at a spread (no cover animation);
//                      also 'cover' (closed front) and 'back' (closed back)
//   ?theta=<0..1>      freeze the turn INTO that page at that progress: the
//                      previous spread closes (θ = π − p·π), this one opens
//                      (θ = p·π). Without ?page it turns into the intro.
//   ?scrub=1           a slider that drives the same progress by hand
//   ?quality=low|high  low: DPR ≤ 1.5, 1024 shadows, smaller page textures,
//                      scenes halve particles (default: low on small touch screens)
//   ?nohud=1           hide the HUD (input still works)
//   ?guide=0           the guide off: captions show each spread's `line` only
//                      (frame.beat = the final beat: scenes show their resting state)
//                      (the lamp in the HUD; otherwise remembered per browser)
//   ?beat=<n>          force the open spread's guide beat (0 = `line`, k =
//                      guide[k − 1]); shows that line even with the guide off
//   ?pull=<0..1>       force frame.pull (the pull tab) on every spread

import * as THREE from 'three'
import { Book } from './src/book.js'
import { Stage } from './src/stage.js'
import { Breath } from './src/breath.js'
import { Hud } from './src/hud.js'
import { Drone } from './src/audio.js'
import scenes, { colophon } from './src/scenes/index.js'

const q = new URLSearchParams(location.search)
const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v)

const coarse = matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 820
const quality = q.get('quality') === 'low' || (q.get('quality') !== 'high' && coarse) ? 'low' : 'high'
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
const nohud = q.get('nohud') === '1'
const scrub = q.get('scrub') === '1'
const thetaParam = q.has('theta') ? clamp(parseFloat(q.get('theta')) || 0, 0, 1) : null
const beatParam = q.has('beat') ? Math.max(0, parseInt(q.get('beat'), 10) || 0) : null
const pullParam = q.has('pull') ? clamp(parseFloat(q.get('pull')) || 0, 0, 1) : null

// The guide: on unless ?guide=0 or the reader turned it off (remembered best
// effort; ?guide never writes the preference).
const GUIDE_KEY = 'jhana-book:guide'
function storedGuide() {
  try {
    return localStorage.getItem(GUIDE_KEY) !== '0'
  } catch {
    return true
  }
}
function storeGuide(on) {
  try {
    localStorage.setItem(GUIDE_KEY, on ? '1' : '0')
  } catch {
    /* private mode, blocked storage: the choice lasts this visit */
  }
}
const guideOn = q.get('guide') === '0' ? false : q.get('guide') === '1' ? true : storedGuide()

// ?page → rest state n (0 closed front, k + 1 spread k, 11 closed back)
function pageToRest(v) {
  if (v === null) return null
  const s = v.trim().toLowerCase()
  if (s === 'cover' || s === 'front') return 0
  if (s === 'back' || s === 'end') return 11
  const byId = scenes.findIndex((m) => m.id === s)
  if (byId >= 0) return byId + 1
  const k = Number(s)
  if (Number.isInteger(k) && k >= 0 && k < scenes.length) return k + 1
  console.warn(`[jhana-book] unknown ?page=${v}`)
  return null
}
const startRest = pageToRest(q.get('page'))

// ---- renderer / scene ----------------------------------------------------------
let renderer
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
} catch (err) {
  // no WebGL: say so instead of inviting a click on an empty table
  document.getElementById('hint').textContent = 'This book needs WebGL, which this browser has turned off.'
  throw err // stop here: a module can't return
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality === 'low' ? 1.5 : 2))
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.0
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.VSMShadowMap
document.getElementById('app').appendChild(renderer.domElement)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 60)
const stage = new Stage({ renderer, scene, camera, quality, reducedMotion })
const book = new Book({ scene, renderer, camera, scenes, quality, colophon })
book.setGuide(guideOn)
if (pullParam !== null) book.forcePull = pullParam
const breath = new Breath()
const drone = new Drone()

// ---- start state -----------------------------------------------------------------
if (thetaParam !== null || scrub) {
  const n = startRest && startRest > 0 ? startRest : 1
  book.freeze(n, thetaParam ?? 1)
} else if (startRest !== null) {
  book.setRest(startRest)
} else {
  book.setRest(0)
}
if (beatParam !== null) {
  const k = Book.spreadAt(book.target)
  if (k >= 0) book.forceBeat = { k, beat: Math.min(beatParam, (scenes[k].guide || []).length) }
}

// ---- HUD + input -----------------------------------------------------------------
const hud = new Hud({
  canvas: renderer.domElement,
  titles: scenes.map((m) => m.title),
  lines: scenes.map((m) => `${[m.title, m.pali].filter(Boolean).join(' · ')} — ${m.line}`),
  nohud,
  orbit: stage.orbit,
  onNext: () => book.next(),
  onPrev: () => (book.n === 0 && !book.turning ? book.next() : book.prev()), // any first click opens the cover
  onDot: (k) => book.goTo(k),
  onAgain: () => book.again(),
  onSound: () => {
    const wasOff = !drone.ctx
    const on = drone.toggle()
    if (on && wasOff) drone.apply(book.audioFor(book.target), true)
    hud.setSound(on)
  },
  onGuide: () => {
    book.setGuide(!book.guide)
    storeGuide(book.guide)
    hud.setGuide(book.guide)
  },
})
hud.setSound(false)
hud.setGuide(book.guide)
if (startRest !== null || thetaParam !== null || scrub) hud.firstTurn()
book.onTurnStart = (to) => {
  hud.firstTurn()
  drone.setSpread(book.audioFor(to))
}
// the live region: the spread's text on arrival (with the guide line showing,
// if it has moved on from `line`), then each new guide line as it appears
const shownLine = (n) => {
  const k = Book.spreadAt(n)
  const beat = k >= 0 ? book.shownBeat(k) : 0
  return beat > 0 ? book.lineFor(k, beat) : ''
}
book.onArrive = (n) => hud.announce(n, shownLine(n))
book.onBeat = (k, beat, text) => hud.say(text)
hud.announce(book.target, shownLine(book.target))
// an OS interruption (a call, another app) can leave the drone suspended
renderer.domElement.addEventListener('pointerdown', () => {
  if (drone.on && drone.ctx && drone.ctx.state !== 'running') drone.ctx.resume()
})

if (scrub) {
  const n = book.frozen.nB
  const label = n >= 1 && n <= 10 ? scenes[n - 1].id : 'back'
  const wrap = document.createElement('label')
  wrap.id = 'scrub'
  wrap.innerHTML = `<span>into ${label}</span><input type="range" min="0" max="1" step="0.001"><output></output>`
  const input = wrap.querySelector('input')
  const out = wrap.querySelector('output')
  input.value = String(book.frozen.progress)
  const show = () => (out.textContent = `θ ${(book.frozen.progress * 180).toFixed(0)}°`)
  input.addEventListener('input', () => {
    book.setFrozenProgress(parseFloat(input.value))
    show()
  })
  show()
  document.body.appendChild(wrap)
}

// ---- resize ------------------------------------------------------------------------
function resize() {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality === 'low' ? 1.5 : 2))
  const w = window.innerWidth
  const h = window.innerHeight
  renderer.setSize(w, h)
  stage.resize(w, h)
}
window.addEventListener('resize', resize)
// zoom or a move to another screen changes the DPR, not always with a resize
function watchDpr() {
  matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`).addEventListener(
    'change',
    () => {
      resize()
      watchDpr()
    },
    { once: true },
  )
}
watchDpr()
resize()

// ---- loop ----------------------------------------------------------------------------
const ZERO = { x: 0, y: 0 }
const _tint = new THREE.Color()
let last = performance.now()
let running = false
let rafId = 0

function frame(now) {
  rafId = requestAnimationFrame(frame)
  const dt = Math.min(0.1, Math.max(0, (now - last) / 1000))
  last = now
  breath.update(dt)

  // pointer for parallax + scenes: eased toward the cursor, back to 0 when idle
  const goal = reducedMotion ? ZERO : hud.pointerGoal(now) || ZERO
  const k = 1 - Math.exp(-dt * 3)
  book.pointer.x += (goal.x - book.pointer.x) * k
  book.pointer.y += (goal.y - book.pointer.y) * k

  book.update(dt, breath)
  stage.update(dt, book.look, breath, book.pointer)
  hud.setState(book.target, book.turning || !!book.frozen)
  hud.setTint(_tint.copy(book.look.accent).convertLinearToSRGB()) // look is linear, CSS wants sRGB
  hud.setBreath(breath.breath)
  drone.update(dt, breath.breath)
  renderer.render(scene, camera)
}

function start() {
  if (running) return
  running = true
  last = performance.now()
  rafId = requestAnimationFrame(frame)
}

function stop() {
  running = false
  cancelAnimationFrame(rafId)
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) stop()
  else start()
  // the drone pauses with the tab
  if (drone.on && drone.ctx) {
    if (document.hidden) drone.ctx.suspend()
    else drone.ctx.resume()
  }
})
start()

// handy from the console / Playwright
window.__jhana = { book, stage, breath, drone, hud }
