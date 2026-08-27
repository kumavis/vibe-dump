import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { buildCrane, STEPS, FOLD_IDS } from './crane.js'

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
scene.fog = new THREE.Fog('#0f0b16', 6, 14)

const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
camera.position.set(3.1, 1.05, 2.3)

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 0.32, 0)
controls.enableDamping = true
controls.dampingFactor = 0.06
controls.autoRotate = true // turntable
controls.autoRotateSpeed = 0.5
controls.minDistance = 2.2
controls.maxDistance = 7
controls.maxPolarAngle = Math.PI * 0.54
controls.enablePan = false

// ---------------------------------------------------------------------------
// Lighting + shadow-catcher ground
// ---------------------------------------------------------------------------
scene.add(new THREE.HemisphereLight('#fff4e2', '#2a2336', 0.85))

const keyLight = new THREE.DirectionalLight('#ffe9cf', 2.1)
keyLight.position.set(3.2, 5.0, 2.4)
keyLight.castShadow = true
keyLight.shadow.mapSize.set(2048, 2048)
keyLight.shadow.camera.near = 1
keyLight.shadow.camera.far = 16
keyLight.shadow.camera.left = -3
keyLight.shadow.camera.right = 3
keyLight.shadow.camera.top = 3
keyLight.shadow.camera.bottom = -3
keyLight.shadow.bias = -0.0004
keyLight.shadow.radius = 6
scene.add(keyLight)

const rim = new THREE.DirectionalLight('#9fd0ff', 0.5)
rim.position.set(-3, 2, -3)
scene.add(rim)

const ground = new THREE.Mesh(
  new THREE.CircleGeometry(7, 64).rotateX(-Math.PI / 2),
  new THREE.ShadowMaterial({ opacity: 0.3 }),
)
ground.position.y = -0.1
ground.receiveShadow = true
scene.add(ground)

// ---------------------------------------------------------------------------
// The crease pattern and fold sequence live in crane.js — spine along the
// neck–tail diagonal, true inside-reverse-fold chevrons for neck, tail and
// head, wing hinges parallel to the spine. See the comments there for why the
// old pattern (edge-to-edge spine, single straight corner creases) put the
// body fold in the wrong place and could never look like a crane.
// ---------------------------------------------------------------------------
const paper = buildCrane()

// Paper mesh (flat-shaded, both sides) + crease lines.
const paperMat = new THREE.MeshStandardMaterial({
  color: '#efe6d4',
  roughness: 0.82,
  metalness: 0.0,
  side: THREE.DoubleSide,
  flatShading: true,
})
const geo = new THREE.BufferGeometry()
const posAttr = new THREE.BufferAttribute(new Float32Array(paper.triangleCount * 9), 3)
posAttr.setUsage(THREE.DynamicDrawUsage)
geo.setAttribute('position', posAttr)
const mesh = new THREE.Mesh(geo, paperMat)
mesh.castShadow = true
mesh.receiveShadow = true

const creaseGeo = new THREE.BufferGeometry()
const creaseAttr = new THREE.BufferAttribute(new Float32Array(paper.creaseLineCount * 6), 3)
creaseAttr.setUsage(THREE.DynamicDrawUsage)
creaseGeo.setAttribute('position', creaseAttr)
const creaseLines = new THREE.LineSegments(
  creaseGeo,
  new THREE.LineBasicMaterial({ color: 0x6f5f45, transparent: true, opacity: 0.5 }),
)
mesh.add(creaseLines)

const craneRoot = new THREE.Group()
craneRoot.add(mesh)
// `keel` levels the tent: a per-frame roll about the body ridge (display X
// after craneRoot's static rotation) computed from the solved geometry, so
// the tent's opening always faces straight up no matter which face the
// solver picked as its fixed root.
const keel = new THREE.Group()
keel.add(craneRoot)
scene.add(keel)

const LAST = STEPS.length - 1
const a = { ...STEPS[0] } // live angles (deg); start flat and fold from there

// Pose: the sheet folds with its ridge along the (1,1,0) diagonal of the
// rest square. craneRoot's static rotation lays that ridge along world X;
// keel then rolls about it so the tent opens upward — crane sitting
// keel-down, wings rising in a V, neck and tail climbing out of it, the
// turntable doing the rest.
craneRoot.rotation.set(Math.PI / 2, 0, -Math.PI / 4)
keel.position.y = 0.02

// The two wing corners are a mirror pair, so the tent's opening direction is
// the average of their offsets from the ridge. Measuring it from the solved
// mesh (rather than deriving it from the fold angles) keeps the pose upright
// regardless of which face the fold solver hangs everything from.
const AXIS_U = new THREE.Vector3(1, 1, 0).normalize() // the ridge, at rest
const AXIS_V = new THREE.Vector3(-1, 1, 0).normalize()
const vidNear = (x, y) => paper.pts.findIndex((p) => Math.abs(p[0] - x) < 1e-6 && Math.abs(p[1] - y) < 1e-6)
const WING_L = vidNear(-1, 1)
const WING_R = vidNear(1, -1)
const IDENTITY = new THREE.Matrix4()
const bis = new THREE.Vector3()
const tmpV = new THREE.Vector3()
function updatePaper() {
  paper.solve((id) => degToRad(a[id]), IDENTITY)
  // Roll the keel so the wing-corner bisector points up (-z in sheet space).
  bis.set(0, 0, 0)
  for (const vid of [WING_L, WING_R]) {
    tmpV.copy(paper.world[vid])
    tmpV.addScaledVector(AXIS_U, -tmpV.dot(AXIS_U))
    bis.add(tmpV)
  }
  if (bis.lengthSq() > 1e-6) {
    keel.rotation.x = -Math.PI / 2 - Math.atan2(bis.z, bis.dot(AXIS_V))
  }
  paper.writePositions(posAttr.array)
  posAttr.needsUpdate = true
  paper.writeCreaseLines(creaseAttr.array)
  creaseAttr.needsUpdate = true
  geo.computeVertexNormals()
  geo.computeBoundingSphere()
}

// ---------------------------------------------------------------------------
// Step sequencing + HUD
// ---------------------------------------------------------------------------
const DWELL = 2.3
let stepIndex = 0 // start on the first step (a flat square) and animate forward
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
  setPlaying(!playing)
})
refreshHud()

// Handle for tooling (step scripts, thumbnail framing). Not part of the UI.
window.__crane = { camera, controls, gotoStep, scene, mesh, craneRoot }

// ---------------------------------------------------------------------------
// Loop
// ---------------------------------------------------------------------------
const clock = new THREE.Clock()
function tick() {
  const dt = Math.min(clock.getDelta(), 0.05)
  const target = STEPS[stepIndex]
  const k = 1 - Math.pow(0.0012, dt) // frame-rate-independent smoothing
  for (const id of FOLD_IDS) a[id] = lerp(a[id], target[id], k)
  updatePaper()

  timer += dt
  if (playing && timer > DWELL) {
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
