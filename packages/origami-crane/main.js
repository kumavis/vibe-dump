import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Paper } from './origami.js'

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
camera.position.set(2.8, 1.5, 2.7)

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 0.28, 0)
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
scene.add(new THREE.HemisphereLight('#fff4e2', '#2a2336', 0.65))

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
ground.position.y = -0.46
ground.receiveShadow = true
scene.add(ground)

// ---------------------------------------------------------------------------
// Build the crane crease pattern by SPLITTING the square plane along fold lines.
//
// Sheet axes: x = nose→tail, y = wing→wing. The spine (y = 0) folds the sheet
// into a shallow tent (the two wings); vertical creases lift the nose into a
// neck + head and the back into a tail. Splitting tags every cut as a crease;
// the fan-triangulation diagonals stay flat (angle 0).
// ---------------------------------------------------------------------------
const NECK = 0.4
const TAIL = -0.46
const HEAD = 0.74

const paper = new Paper(1)
  .crease('spine', [-1, 0], [1, 0])
  .crease('neck', [NECK, -1], [NECK, 1])
  .crease('tail', [TAIL, -1], [TAIL, 1])
  .crease('head', [HEAD, -1], [HEAD, 1])
  // Root = a top-half triangle in the body band, so the wings open symmetrically.
  .build(([cx, cy]) => (cy > 0 ? 100 : 0) - Math.abs(cx) - Math.abs(cy - 0.4))

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
scene.add(craneRoot)

// ---------------------------------------------------------------------------
// Steps — target dihedral angles (degrees) for each fold line. Flat → crane.
// ---------------------------------------------------------------------------
const STEPS = [
  { name: 'a flat square', spine: 0, neck: 0, tail: 0, head: 0 },
  { name: 'valley-fold the spine', spine: 70, neck: 0, tail: 0, head: 0 },
  { name: 'open the wings', spine: 104, neck: 0, tail: 0, head: 0 },
  { name: 'lift the neck and tail', spine: 104, neck: 116, tail: 108, head: 0 },
  { name: 'reverse-fold the head', spine: 104, neck: 116, tail: 108, head: 96 },
  { name: 'a paper crane', spine: 104, neck: 118, tail: 110, head: 98 },
]
const LAST = STEPS.length - 1
const a = { ...STEPS[LAST] } // live angles (deg); start on the finished crane

const baseMatrix = new THREE.Matrix4()
function updatePaper() {
  // Tilt the root by -spine/2 so both wings open symmetrically about the spine.
  baseMatrix.makeRotationX(-degToRad(a.spine) / 2)
  paper.solve((id) => degToRad(a[id]), baseMatrix)
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
const INTRO = 2.6
let stepIndex = LAST
let phase = 'intro'
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

// ---------------------------------------------------------------------------
// Loop
// ---------------------------------------------------------------------------
const clock = new THREE.Clock()
function tick() {
  const dt = Math.min(clock.getDelta(), 0.05)
  const target = STEPS[phase === 'intro' ? LAST : stepIndex]
  const k = 1 - Math.pow(0.0012, dt) // frame-rate-independent smoothing
  for (const id of ['spine', 'neck', 'tail', 'head']) a[id] = lerp(a[id], target[id], k)
  updatePaper()

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
