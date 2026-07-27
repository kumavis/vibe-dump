import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createWorld } from './src/world.js'
import { createEnvironment } from './src/env.js'
import { createGoblin } from './src/character.js'

// ---------------------------------------------------------------------------
// The show
//
// The goblin runs in place at the origin and the world scrolls past him, so the
// sprint can go on forever. A small director loop breaks the run every few
// seconds to swing the cleaver, dropping the world speed to nothing for the
// duration of the combo and winding it back up afterwards.
// ---------------------------------------------------------------------------

const { clamp, lerp } = THREE.MathUtils
const RUN_SPEED = 4.8 // m/s — matched to the stride length in the run clip
const app = document.getElementById('app')
const boot = document.getElementById('boot')
const bootStep = document.getElementById('boot-step')
const bootFill = document.getElementById('boot-fill')

// ---- renderer -------------------------------------------------------------

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.05
renderer.outputColorSpace = THREE.SRGBColorSpace
app.appendChild(renderer.domElement)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 400)
camera.position.set(1.62, 1.02, 1.92)

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 0.78, 0)
controls.enableDamping = true
controls.dampingFactor = 0.07
controls.minDistance = 0.7
controls.maxDistance = 9
controls.maxPolarAngle = Math.PI * 0.52
controls.enablePan = false

// ---- build ----------------------------------------------------------------

/** Yield to the browser so the boot overlay actually repaints between steps. */
const step = (label, fraction) =>
  new Promise((resolve) => {
    bootStep.textContent = label
    bootFill.style.width = `${Math.round(fraction * 100)}%`
    requestAnimationFrame(() => requestAnimationFrame(resolve))
  })

let world
let goblin
let rigHelper

// The world's key light comes from the gas giant, which is *behind* the runner
// — great for the landscape, but it leaves the hero a silhouette, so the scene
// gets a three-point rig on top of it.
//
// Note for anyone tempted by light layers here: three tests a light's layers
// against the *camera's*, not each object's, so `light.layers.set(1)` does not
// give you a hero-only rig — it just switches the light off. These are plain
// scene lights, kept soft enough that the flats don't blow out.
function lightTheHero() {
  const key = new THREE.DirectionalLight('#ffe6c8', 2.4)
  key.position.set(2.6, 3.1, 3.4)
  const fill = new THREE.DirectionalLight('#7fd4ff', 0.95)
  fill.position.set(-3.2, 1.4, 1.8)
  const rim = new THREE.DirectionalLight('#ffb45c', 1.7)
  rim.position.set(-1.4, 2.0, -3.6)

  for (const light of [key, fill, rim]) scene.add(light)
  return { key, fill, rim }
}

async function build() {
  await step('raising the flats', 0.12)
  // Metals need something to reflect before anything else looks right.
  scene.environment = createEnvironment(renderer)
  world = createWorld({ scene, renderer, quality: 1 })

  await step('sculpting the goblin', 0.4)
  goblin = createGoblin({ renderer, quality: 1 })
  scene.add(goblin.group)
  lightTheHero()

  await step('hanging the kit', 0.86)
  rigHelper = new THREE.SkeletonHelper(goblin.mesh)
  rigHelper.visible = false
  rigHelper.material.linewidth = 2
  scene.add(rigHelper)

  document.getElementById('s-bones').textContent = goblin.stats.bones
  document.getElementById('s-tris').textContent = goblin.stats.triangles.toLocaleString()
  document.getElementById('s-sim').textContent = goblin.stats.accessories

  // A handle for poking at the scene from the console — this is a showcase,
  // and half the fun is scrubbing the mixer or dumping the skin weights.
  window.spaceGoblin = { scene, camera, renderer, world, goblin, director }

  await step('ready', 1)
  boot.classList.add('gone')
  setTimeout(() => boot.remove(), 700)
}

// ---- director -------------------------------------------------------------

const director = {
  speed: RUN_SPEED,
  target: RUN_SPEED,
  nextStrike: 6.5,
  clock: 0,
  fighting: false,

  strike() {
    if (this.fighting) return
    this.fighting = true
    this.target = 0
    goblin.playCombo()
    // The combo clip is 2.1s; start running out of it a little early so the
    // world is already moving when his feet start again.
    setTimeout(() => {
      this.target = RUN_SPEED
      this.fighting = false
      this.nextStrike = this.clock + 7 + Math.random() * 4
    }, 1750)
  },

  update(dt) {
    this.clock += dt
    if (!this.fighting && this.clock > this.nextStrike) this.strike()
    // Ease into and out of the fight — an instant stop reads as a bug.
    const rate = this.target > this.speed ? 2.6 : 5.5
    this.speed = lerp(this.speed, this.target, clamp(dt * rate, 0, 1))
  },
}

// ---- camera work ----------------------------------------------------------

const CAMERAS = [
  { name: 'CHASE', pos: [1.62, 1.02, 1.92], target: [0, 0.76, 0], fov: 38, orbit: 0.05 },
  { name: 'LOW', pos: [1.06, 0.34, 1.58], target: [0, 0.7, 0.04], fov: 44, orbit: 0.09 },
  { name: 'FACE', pos: [0.5, 1.06, 0.84], target: [0.02, 0.99, 0.05], fov: 32, orbit: 0.03 },
  { name: 'WIDE', pos: [2.9, 1.55, 3.2], target: [0, 0.82, 0], fov: 40, orbit: 0.04 },
]
let camIndex = 0
let camBlend = 1
const camFrom = { pos: new THREE.Vector3(), target: new THREE.Vector3(), fov: 40 }
const camTo = { pos: new THREE.Vector3(), target: new THREE.Vector3(), fov: 40 }
let userDriving = false

function applyPreset(i, instant = false) {
  camIndex = i
  const p = CAMERAS[i]
  camFrom.pos.copy(camera.position)
  camFrom.target.copy(controls.target)
  camFrom.fov = camera.fov
  camTo.pos.fromArray(p.pos)
  camTo.target.fromArray(p.target)
  camTo.fov = p.fov
  camBlend = instant ? 1 : 0
  userDriving = false
  btnCam.textContent = `CAMERA · ${p.name}`
  if (instant) {
    camera.position.copy(camTo.pos)
    controls.target.copy(camTo.target)
    camera.fov = camTo.fov
    camera.updateProjectionMatrix()
  }
}

// A slow drift plus a touch of handheld float, so a still screenshot never
// looks like a locked-off render.
let driftT = 0
function updateCamera(dt) {
  if (camBlend < 1) {
    camBlend = clamp(camBlend + dt * 1.5, 0, 1)
    const k = camBlend * camBlend * (3 - 2 * camBlend)
    camera.position.lerpVectors(camFrom.pos, camTo.pos, k)
    controls.target.lerpVectors(camFrom.target, camTo.target, k)
    camera.fov = lerp(camFrom.fov, camTo.fov, k)
    camera.updateProjectionMatrix()
    return
  }
  if (userDriving) return
  driftT += dt
  const preset = CAMERAS[camIndex]
  const a = driftT * preset.orbit
  const base = camTo.pos
  const r = Math.hypot(base.x, base.z)
  camera.position.set(
    Math.sin(Math.atan2(base.x, base.z) + a) * r + Math.sin(driftT * 0.8) * 0.012,
    base.y + Math.sin(driftT * 0.55) * 0.03,
    Math.cos(Math.atan2(base.x, base.z) + a) * r + Math.cos(driftT * 0.7) * 0.012,
  )
}

controls.addEventListener('start', () => {
  userDriving = true
})

// ---- UI -------------------------------------------------------------------

const btnStrike = document.getElementById('btn-strike')
const btnCam = document.getElementById('btn-cam')
const btnSlow = document.getElementById('btn-slow')
const btnRig = document.getElementById('btn-rig')

let slowMo = false

btnStrike.addEventListener('click', () => goblin && director.strike())
btnCam.addEventListener('click', () => applyPreset((camIndex + 1) % CAMERAS.length))
btnSlow.addEventListener('click', () => {
  slowMo = !slowMo
  btnSlow.classList.toggle('on', slowMo)
})
btnRig.addEventListener('click', () => {
  if (!rigHelper) return
  rigHelper.visible = !rigHelper.visible
  btnRig.classList.toggle('on', rigHelper.visible)
})
window.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    e.preventDefault()
    goblin && director.strike()
  }
  if (e.key === 'c') applyPreset((camIndex + 1) % CAMERAS.length)
})

// ---- resize ---------------------------------------------------------------

function resize() {
  const w = window.innerWidth
  const h = window.innerHeight
  renderer.setSize(w, h)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}
window.addEventListener('resize', resize)
resize()

// ---- loop -----------------------------------------------------------------

const clock = new THREE.Clock()
const fpsEl = document.getElementById('s-fps')
let fpsAccum = 0
let fpsFrames = 0

function frame() {
  requestAnimationFrame(frame)
  // A backgrounded tab hands back multi-second deltas; clamping keeps both the
  // cloth solver and the animation from teleporting.
  const raw = Math.min(clock.getDelta(), 1 / 20)
  const dt = slowMo ? raw * 0.22 : raw

  if (goblin) {
    director.update(dt)
    // Tie the stride rate to the ground speed so the feet don't skate — but
    // never slow the combo down, which plays at its authored tempo.
    goblin.mixer.timeScale = director.fighting ? 1 : clamp(director.speed / RUN_SPEED, 0.4, 1.15)
    goblin.update(dt, { speed: director.speed })
    world.update(dt, director.speed)
  }

  updateCamera(raw)
  controls.update()
  renderer.render(scene, camera)

  fpsAccum += raw
  fpsFrames++
  if (fpsAccum > 0.5) {
    fpsEl.textContent = Math.round(fpsFrames / fpsAccum)
    fpsAccum = 0
    fpsFrames = 0
  }
}

applyPreset(0, true)
build().then(() => {
  clock.getDelta()
  frame()
})
