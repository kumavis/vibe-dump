import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createGoblin } from '../src/character.js'
import { createEnvironment } from '../src/env.js'

// ---------------------------------------------------------------------------
// Rig turntable
//
// The same character as the main scene, on a neutral stage. This started life
// as a dev tool and is shipped because it is the honest view: judging a figure
// inside a dark, fogged, backlit environment judges two things at once, and
// half of what is interesting here — the skeleton, the clips, the way the kit
// trails the run — is invisible at distance.
// ---------------------------------------------------------------------------

const app = document.getElementById('app')
const boot = document.getElementById('boot')
const bootStep = document.getElementById('boot-step')
const bootFill = document.getElementById('boot-fill')

// ---- renderer / stage -----------------------------------------------------

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.0
renderer.outputColorSpace = THREE.SRGBColorSpace
app.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color('#15171c')
scene.fog = new THREE.Fog('#15171c', 4.5, 11)

const camera = new THREE.PerspectiveCamera(34, 1, 0.02, 60)
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.08
controls.minDistance = 0.35
controls.maxDistance = 6
controls.enablePan = false

// Neutral three-point rig: warm key, cool fill, warm rim.
scene.add(new THREE.HemisphereLight('#cfe3ff', '#2a2119', 0.75))
const key = new THREE.DirectionalLight('#fff2e0', 3.0)
key.position.set(2.5, 3.4, 3.0)
key.castShadow = true
key.shadow.mapSize.set(2048, 2048)
key.shadow.camera.top = 1.7
key.shadow.camera.bottom = -0.3
key.shadow.camera.left = -1.4
key.shadow.camera.right = 1.4
key.shadow.bias = -0.0006
key.shadow.radius = 3
scene.add(key)
const fill = new THREE.DirectionalLight('#9fd0ff', 1.15)
fill.position.set(-3, 1.6, 1.5)
scene.add(fill)
const rim = new THREE.DirectionalLight('#ffcf9a', 2.1)
rim.position.set(-1.2, 2.2, -3.4)
scene.add(rim)

// A shadow-catching disc, and a grid so the scale stays legible.
const floor = new THREE.Mesh(
  new THREE.CircleGeometry(3.2, 64),
  new THREE.MeshStandardMaterial({ color: '#33343a', roughness: 1, metalness: 0 }),
)
floor.rotation.x = -Math.PI / 2
floor.receiveShadow = true
scene.add(floor)

const grid = new THREE.GridHelper(3.2, 16, 0x4a5058, 0x2c3036)
grid.position.y = 0.001
grid.material.transparent = true
grid.material.opacity = 0.5
scene.add(grid)

// ---- build ----------------------------------------------------------------

const step = (label, fraction) =>
  new Promise((resolve) => {
    bootStep.textContent = label
    bootFill.style.width = `${Math.round(fraction * 100)}%`
    requestAnimationFrame(() => requestAnimationFrame(resolve))
  })

let goblin
let rigHelper
let axesGroup

// Enough bones to read the rig's conventions without turning the model into a
// hedgehog: red = X, green = Y, blue = Z, and every one of them is world-
// aligned in the bind pose.
const AXIS_BONES = [
  'hips', 'chest', 'head', 'jaw',
  'upperarmL', 'forearmL', 'handL', 'upperarmR', 'forearmR', 'handR',
  'thighL', 'shinL', 'footL', 'thighR', 'shinR', 'footR',
  'earL1', 'earR1', 'tail2',
]

async function build() {
  await step('lighting the stage', 0.15)
  scene.environment = createEnvironment(renderer)

  await step('sculpting the goblin', 0.45)
  goblin = createGoblin({ renderer, quality: 1 })
  scene.add(goblin.group)

  await step('hanging the kit', 0.85)
  rigHelper = new THREE.SkeletonHelper(goblin.mesh)
  rigHelper.visible = false
  scene.add(rigHelper)

  axesGroup = new THREE.Group()
  for (const name of AXIS_BONES) {
    const bone = goblin.byName[name]
    if (!bone) continue
    const axes = new THREE.AxesHelper(0.07)
    axes.material.depthTest = false
    axes.material.transparent = true
    axes.renderOrder = 999
    axes.visible = false
    bone.add(axes)
    axesGroup.add(axes)
  }

  document.getElementById('s-bones').textContent = goblin.stats.bones
  document.getElementById('s-tris').textContent = goblin.stats.triangles.toLocaleString()
  document.getElementById('s-sim').textContent = goblin.stats.accessories
  document.getElementById('s-build').textContent = `${Math.round(goblin.stats.buildMs)} ms`

  window.spaceGoblin = { scene, camera, renderer, goblin }

  await step('ready', 1)
  boot.classList.add('gone')
  setTimeout(() => boot.remove(), 700)
}

// ---- views ----------------------------------------------------------------

const VIEWS = {
  // Distances leave headroom for the control bar at the bottom of the frame —
  // a figure whose claws are hidden behind the UI reads as a cropped bug.
  q34: { dir: [0.78, 0.2, 0.72], dist: 2.5, target: [0, 0.64, 0], fov: 34 },
  front: { dir: [0.04, 0.06, 1], dist: 2.55, target: [0, 0.64, 0], fov: 34 },
  left: { dir: [1, 0.06, 0.05], dist: 2.55, target: [0, 0.64, 0], fov: 34 },
  back: { dir: [-0.15, 0.12, -1], dist: 2.55, target: [0, 0.66, 0], fov: 34 },
  head: { dir: [0.6, 0.18, 0.85], dist: 0.62, target: [0, 1.02, 0.03], fov: 32 },
  hands: { dir: [0.35, 0.45, 0.9], dist: 0.95, target: [0, 0.62, 0.12], fov: 34 },
}
let view = 'q34'
let spin = true
let spinAngle = 0

function placeCamera() {
  const v = VIEWS[view]
  const elevation = v.dir[1]
  const r = v.dist / Math.hypot(1, elevation)
  camera.position.set(
    Math.sin(spinAngle) * r,
    controls.target.y + elevation * v.dist,
    Math.cos(spinAngle) * r,
  )
}

function applyView(name, instant = false) {
  view = name
  for (const b of document.querySelectorAll('#views button')) {
    b.classList.toggle('on', b.dataset.view === name)
  }
  const v = VIEWS[name]
  controls.target.fromArray(v.target)
  camera.fov = v.fov
  camera.updateProjectionMatrix()
  // Re-seed the turntable angle from the view, so switching doesn't snap.
  spinAngle = Math.atan2(v.dir[0], v.dir[2])
  if (instant || spin) placeCamera()
}

// ---- playback -------------------------------------------------------------

let clipName = 'run'
let playing = true
let clipTime = 0

function currentDuration() {
  return goblin ? goblin.actions[clipName].getClip().duration : 1
}

function setClip(name) {
  if (!goblin) return
  clipName = name
  clipTime = 0
  for (const b of document.querySelectorAll('#clips button')) {
    b.classList.toggle('on', b.dataset.clip === name)
  }
  for (const action of Object.values(goblin.actions)) action.stop()
  const action = goblin.actions[name]
  action.reset()
  // Everything loops here. The combo is authored as a one-shot for the main
  // scene, but on a turntable you want to watch it over and over.
  action.setLoop(THREE.LoopRepeat, Infinity)
  action.clampWhenFinished = false
  action.play()
  goblin.reset()
}

// ---- UI -------------------------------------------------------------------

const btnPlay = document.getElementById('btn-play')
const btnSpin = document.getElementById('btn-spin')
const btnRig = document.getElementById('btn-rig')
const btnAxes = document.getElementById('btn-axes')
const scrub = document.getElementById('scrub')

for (const b of document.querySelectorAll('#clips button')) {
  b.addEventListener('click', () => setClip(b.dataset.clip))
}
for (const b of document.querySelectorAll('#views button')) {
  b.addEventListener('click', () => applyView(b.dataset.view))
}
btnPlay.addEventListener('click', () => {
  playing = !playing
  btnPlay.textContent = playing ? '❚❚' : '▶'
})
btnSpin.addEventListener('click', () => {
  spin = !spin
  btnSpin.classList.toggle('on', spin)
})
btnRig.addEventListener('click', () => {
  if (!rigHelper) return
  rigHelper.visible = !rigHelper.visible
  btnRig.classList.toggle('on', rigHelper.visible)
})
btnAxes.addEventListener('click', () => {
  if (!axesGroup) return
  const on = !axesGroup.children[0]?.visible
  for (const a of axesGroup.children) a.visible = on
  btnAxes.classList.toggle('on', on)
})
scrub.addEventListener('input', () => {
  if (!goblin) return
  playing = false
  btnPlay.textContent = '▶'
  clipTime = (scrub.value / 1000) * currentDuration()
})
controls.addEventListener('start', () => {
  spin = false
  btnSpin.classList.remove('on')
})
window.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    e.preventDefault()
    btnPlay.click()
  }
})

// ---- loop -----------------------------------------------------------------

function resize() {
  const w = window.innerWidth
  const h = window.innerHeight
  renderer.setSize(w, h)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}
window.addEventListener('resize', resize)

const clock = new THREE.Clock()

function frame() {
  requestAnimationFrame(frame)
  const raw = Math.min(clock.getDelta(), 1 / 20)

  if (goblin) {
    if (playing) {
      clipTime = (clipTime + raw) % currentDuration()
      scrub.value = Math.round((clipTime / currentDuration()) * 1000)
    } else {
      // Park the clip on the scrubbed frame but keep feeding the solver real
      // time — zeroing the mixer rather than the delta, so a paused pose still
      // lets the cape and straps settle instead of freezing them mid-air.
      goblin.mixer.setTime(clipTime)
    }
    goblin.mixer.timeScale = playing ? 1 : 0
    goblin.update(raw, { speed: clipName === 'run' && playing ? 4.8 : 0.3 })
  }

  if (spin) {
    spinAngle += raw * 0.28
    placeCamera()
  }
  controls.update()
  renderer.render(scene, camera)
}

applyView('q34', true)
resize()
build().then(() => {
  setClip('run')
  clock.getDelta()
  frame()
})
