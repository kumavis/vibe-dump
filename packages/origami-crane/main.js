import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const { degToRad, lerp, clamp } = THREE.MathUtils

// ---------------------------------------------------------------------------
// Renderer / scene / camera
// ---------------------------------------------------------------------------
const app = document.getElementById('app')
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.12
app.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background = makeGradientBackground('#241a2e', '#0b0a12')
scene.fog = new THREE.Fog('#0f0b16', 6, 13)

const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
camera.position.set(2.9, 1.45, 2.5)

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 0.42, 0)
controls.enableDamping = true
controls.dampingFactor = 0.06
controls.autoRotate = true // turntable
controls.autoRotateSpeed = 0.5
controls.minDistance = 2.2
controls.maxDistance = 7
controls.maxPolarAngle = Math.PI * 0.52
controls.enablePan = false

// ---------------------------------------------------------------------------
// Lighting
// ---------------------------------------------------------------------------
scene.add(new THREE.HemisphereLight('#fff4e2', '#2a2336', 0.65))

const key = new THREE.DirectionalLight('#ffe9cf', 2.1)
key.position.set(3.2, 5.0, 2.4)
key.castShadow = true
key.shadow.mapSize.set(2048, 2048)
key.shadow.camera.near = 1
key.shadow.camera.far = 16
key.shadow.camera.left = -3
key.shadow.camera.right = 3
key.shadow.camera.top = 3
key.shadow.camera.bottom = -3
key.shadow.bias = -0.0004
key.shadow.radius = 6
scene.add(key)

const rim = new THREE.DirectionalLight('#9fd0ff', 0.5)
rim.position.set(-3, 2, -3)
scene.add(rim)

// Shadow-catcher ground: only the soft shadow shows over the gradient.
const ground = new THREE.Mesh(
  new THREE.CircleGeometry(7, 64).rotateX(-Math.PI / 2),
  new THREE.ShadowMaterial({ opacity: 0.32 }),
)
ground.position.y = -0.02
ground.receiveShadow = true
scene.add(ground)

// ---------------------------------------------------------------------------
// Paper crane rig
//
// Built from one square (a diamond in plan): corners Front(+x), Back(-x),
// Left(+z), Right(-z). The two halves become wings (hinged on the F–B spine);
// slim flaps on the spine become the neck (+ head) and tail. Every hinge angle
// is 0 in the flat state, so the model starts as a true flat square.
// ---------------------------------------------------------------------------
const paperMat = new THREE.MeshStandardMaterial({
  color: '#efe6d4',
  roughness: 0.82,
  metalness: 0.0,
  side: THREE.DoubleSide,
  flatShading: true,
})
const edgeMat = new THREE.LineBasicMaterial({ color: 0x7c6b4f, transparent: true, opacity: 0.45 })

function panel(points) {
  // Triangle-fan from a list of [x,y,z] points.
  const pos = []
  for (let i = 1; i < points.length - 1; i++) {
    pos.push(...points[0], ...points[i], ...points[i + 1])
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.computeVertexNormals()
  const mesh = new THREE.Mesh(geo, paperMat)
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 1), edgeMat))
  return mesh
}

const NX = 0.3 // neck hinge along the spine
const TX = 0.32 // tail hinge along the spine
const Y = 0.006 // tiny lift so spine flaps never z-fight the wings

const crane = new THREE.Group()
scene.add(crane)

// Wings — the two halves of the diamond, hinged on the X (F–B) spine.
const leftWing = new THREE.Group()
leftWing.add(panel([[1, 0, 0], [0, 0, 1], [-1, 0, 0]]))
crane.add(leftWing)

const rightWing = new THREE.Group()
rightWing.add(panel([[1, 0, 0], [0, 0, -1], [-1, 0, 0]]))
crane.add(rightWing)

// Neck — slim flap on the front of the spine, with a reverse-folding head.
const neck = new THREE.Group()
neck.position.set(NX, 0, 0)
neck.add(panel([[0, Y, 0.1], [1 - NX, Y, 0], [0, Y, -0.1]]))
crane.add(neck)

const head = new THREE.Group()
head.position.set(1 - NX, Y, 0)
head.add(panel([[0, 0, 0.07], [0.3, 0, 0], [0, 0, -0.07]]))
neck.add(head)

// Tail — slim flap on the back of the spine.
const tail = new THREE.Group()
tail.position.set(-TX, 0, 0)
tail.add(panel([[0, Y, 0.16], [-(1 - TX), Y, 0], [0, Y, -0.16]]))
crane.add(tail)

// ---------------------------------------------------------------------------
// Steps — each is a target set of hinge angles (degrees). Flat → crane.
// ---------------------------------------------------------------------------
const STEPS = [
  { name: 'a flat square', wing: 0, neck: 0, tail: 0, head: 0 },
  { name: 'fold it in half', wing: 84, neck: 0, tail: 0, head: 0 },
  { name: 'open the base', wing: 60, neck: 0, tail: 0, head: 0 },
  { name: 'raise the neck and tail', wing: 58, neck: 62, tail: 70, head: 0 },
  { name: 'reverse-fold the head', wing: 57, neck: 63, tail: 71, head: 70 },
  { name: 'a paper crane', wing: 58, neck: 63, tail: 72, head: 72 },
]
const LAST = STEPS.length - 1

// Live (animated) angles, in degrees. Start already at the finished crane so
// the gallery thumbnail and first impression show a bird, not a blank sheet.
const a = { ...STEPS[LAST] }

function applyAngles() {
  leftWing.rotation.x = -degToRad(a.wing)
  rightWing.rotation.x = degToRad(a.wing)
  neck.rotation.z = degToRad(a.neck)
  tail.rotation.z = -degToRad(a.tail)
  head.rotation.z = -degToRad(a.head)
}

// ---------------------------------------------------------------------------
// Step sequencing
// ---------------------------------------------------------------------------
const DWELL = 2.3 // seconds the fold rests on each step before advancing
const INTRO = 2.6 // seconds the finished crane is shown before folding begins
let stepIndex = LAST
let phase = 'intro' // 'intro' → hold crane, then 'play'/'paused' through the fold
let timer = 0
let playing = true

const stepNum = document.getElementById('step-num')
const stepName = document.getElementById('step-name')
const dotsEl = document.getElementById('dots')
document.getElementById('step-total').textContent = STEPS.length

STEPS.forEach((_, i) => {
  const dot = document.createElement('span')
  dot.className = 'dot'
  dot.addEventListener('click', () => gotoStep(i, true))
  dotsEl.appendChild(dot)
})
const dots = [...dotsEl.children]

function refreshHud() {
  stepNum.textContent = stepIndex + 1
  stepName.textContent = STEPS[stepIndex].name
  dots.forEach((d, i) => d.classList.toggle('active', i === stepIndex))
}

function gotoStep(i, pause) {
  phase = 'play'
  stepIndex = clamp(i, 0, LAST)
  timer = 0
  if (pause) setPlaying(false)
  refreshHud()
}

function setPlaying(v) {
  playing = v
  document.getElementById('play').textContent = v ? '❚❚' : '▶'
}

document.getElementById('next').addEventListener('click', () => gotoStep(stepIndex + 1, true))
document.getElementById('prev').addEventListener('click', () => gotoStep(stepIndex - 1, true))
document.getElementById('play').addEventListener('click', () => {
  if (phase === 'intro') phase = 'play'
  setPlaying(!playing)
})

refreshHud()
applyAngles()

// ---------------------------------------------------------------------------
// Loop
// ---------------------------------------------------------------------------
const clock = new THREE.Clock()

function tick() {
  const dt = Math.min(clock.getDelta(), 0.05)
  const target = STEPS[phase === 'intro' ? LAST : stepIndex]

  // Smoothly ease every hinge toward the current step's target angle.
  const k = 1 - Math.pow(0.0009, dt) // frame-rate-independent smoothing
  for (const key of ['wing', 'neck', 'tail', 'head']) {
    a[key] = lerp(a[key], target[key], k)
  }

  // A little life: once finished, let the wings breathe.
  if (phase !== 'intro' && stepIndex === LAST) {
    a.wing += Math.sin(clock.elapsedTime * 1.6) * 1.1
  }
  applyAngles()

  // Advance the sequence on a timer.
  timer += dt
  if (phase === 'intro') {
    if (timer > INTRO) gotoStep(0, false)
  } else if (playing && timer > DWELL) {
    timer = 0
    stepIndex = stepIndex >= LAST ? 0 : stepIndex + 1
    refreshHud()
  }

  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}
tick()

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeGradientBackground(top, bottom) {
  const c = document.createElement('canvas')
  c.width = 2
  c.height = 256
  const ctx = c.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, 0, 256)
  g.addColorStop(0, top)
  g.addColorStop(1, bottom)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 2, 256)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function resize() {
  const w = window.innerWidth
  const h = window.innerHeight
  renderer.setSize(w, h)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}
window.addEventListener('resize', resize)
resize()
