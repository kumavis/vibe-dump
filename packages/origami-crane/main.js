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
// Low, near-profile framing — the crane's silhouette (neck, head, tail, wings)
// reads from the side, not from above.
camera.position.set(2.7, 1.55, 2.95)

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 0.25, 0)
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
// The bird base — the start of every crane — turns the FOUR CORNERS of the
// square into the bird's four points: a neck, a tail, and two wings, all rising
// from a central body. We mirror that directly: one crease cuts across each
// corner, and a sixth reverse-folds the neck's tip into a head.
//
// This is also what keeps the paper whole. Each corner crease lives in its own
// corner and no two creases ever cross inside the sheet, so the panels form a
// TREE hinged along shared edges. A tree of rigid hinges folds with zero
// stretch and can never come apart — there is no over-constrained interior
// vertex to tear open. (The old pattern ran creases straight across each other
// at right angles; such a crossing is not rigidly foldable, which is what split
// the wings off the body and cut the sheet.)
//
// Sheet corners: TR → neck (+head at its tip), BL → tail, TL & BR → the wings.
// A single spine crease across the body (y = 0) folds it into a ridge for some
// depth; it runs only through the central panel and never reaches the corner
// creases, so the pattern stays a non-crossing tree.
// ---------------------------------------------------------------------------
const paper = new Paper(1)
  // Spine: a ridge down the body, giving the folded crane some depth.
  .crease('spine', [-1, 0], [1, 0])
  // Neck: a deep crease across the top-right corner lifts a long point; the two
  // `nk` creases are a PETAL FOLD that pleats that point's sides in to the
  // centreline, narrowing it from a wide flap into a thin neck. Head: reverse-
  // fold the very tip back into a beak.
  .crease('neck', [0.05, 1], [1, 0.05])
  .crease('nkA', [1, 1], [0.367, 0.683], { segment: true })
  .crease('nkB', [1, 1], [0.683, 0.367], { segment: true })
  .crease('head', [0.78, 1], [1, 0.78])
  // Tail: the opposite (bottom-left) corner, petal-folded the same way into a
  // matching thin point.
  .crease('tail', [-1, -0.05], [-0.05, -1])
  .crease('tlA', [-1, -1], [-0.367, -0.683], { segment: true })
  .crease('tlB', [-1, -1], [-0.683, -0.367], { segment: true })
  // The two remaining corners open out into a left and a right wing.
  .crease('wingL', [-0.4, 1], [-1, 0.4])
  .crease('wingR', [1, -0.4], [0.4, -1])
  // Root = the central body panel; it stays put while the points rise.
  .build(([cx, cy]) => -(Math.abs(cx) + Math.abs(cy)))

// The petal folds cross the neck/tail creases, so those vertices are
// over-constrained for the exact tree solve; relaxation settles them (and
// layer offsets give the pleated points their stacked-paper look).
paper.relaxIters = 150

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
  { name: 'a flat square', spine: 0, neck: 0, nkA: 0, nkB: 0, head: 0, tail: 0, tlA: 0, tlB: 0, wingL: 0, wingR: 0 },
  { name: 'fold the bird base', spine: 65, neck: 60, nkA: 0, nkB: 0, head: 0, tail: 60, tlA: 0, tlB: 0, wingL: 40, wingR: 40 },
  { name: 'petal-fold the neck and tail', spine: 65, neck: 120, nkA: 168, nkB: -168, head: 0, tail: 135, tlA: 168, tlB: -168, wingL: 40, wingR: 40 },
  { name: 'reverse-fold the head', spine: 65, neck: 120, nkA: 168, nkB: -168, head: -120, tail: 135, tlA: 168, tlB: -168, wingL: 40, wingR: 40 },
  { name: 'spread the wings', spine: 65, neck: 120, nkA: 168, nkB: -168, head: -120, tail: 135, tlA: 168, tlB: -168, wingL: 72, wingR: 72 },
  { name: 'a paper crane', spine: 66, neck: 122, nkA: 170, nkB: -170, head: -122, tail: 137, tlA: 170, tlB: -170, wingL: 74, wingR: 74 },
]
const LAST = STEPS.length - 1
const a = { ...STEPS[0] } // live angles (deg); start flat and fold from there

// Orient the folded crane to a pleasing pose (belly down, neck up-forward),
// reclined slightly toward the camera so the head and wings read on the turntable.
craneRoot.rotation.set(-1.45, -0.15, 0)
craneRoot.position.y = 0.05

const baseMatrix = new THREE.Matrix4()
function updatePaper() {
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

// ---------------------------------------------------------------------------
// Loop
// ---------------------------------------------------------------------------
const clock = new THREE.Clock()
function tick() {
  const dt = Math.min(clock.getDelta(), 0.05)
  const target = STEPS[stepIndex]
  const k = 1 - Math.pow(0.0012, dt) // frame-rate-independent smoothing
  for (const id of ['spine', 'neck', 'nkA', 'nkB', 'head', 'tail', 'tlA', 'tlB', 'wingL', 'wingR']) a[id] = lerp(a[id], target[id], k)
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
