import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const { degToRad, clamp } = THREE.MathUtils

// ---------------------------------------------------------------------------
// Renderer / scene / camera
// ---------------------------------------------------------------------------
const app = document.getElementById('app')
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.15
app.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background = makeGradientBackground('#0e3a4d', '#03101a')

const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
camera.position.set(4.0, 2.0, 4.4)

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 0, 0)
controls.enableDamping = true
controls.dampingFactor = 0.06
controls.autoRotate = true // turntable
controls.autoRotateSpeed = 0.45
controls.minDistance = 3.2
controls.maxDistance = 11
controls.maxPolarAngle = Math.PI * 0.62
controls.minPolarAngle = Math.PI * 0.2
controls.enablePan = false

// ---------------------------------------------------------------------------
// Lighting — sun raking down through the water surface
// ---------------------------------------------------------------------------
scene.add(new THREE.HemisphereLight('#bfeeff', '#08222e', 0.8))

const key = new THREE.DirectionalLight('#dff6ff', 1.7)
key.position.set(2.6, 6.0, 2.0)
key.castShadow = true
key.shadow.mapSize.set(2048, 2048)
key.shadow.camera.near = 1
key.shadow.camera.far = 18
key.shadow.camera.left = -3
key.shadow.camera.right = 3
key.shadow.camera.top = 3
key.shadow.camera.bottom = -3
key.shadow.bias = -0.0005
key.shadow.radius = 7
scene.add(key)

const rim = new THREE.DirectionalLight('#3fb8d6', 0.6)
rim.position.set(-3, 1.5, -3.5)
scene.add(rim)

// ---------------------------------------------------------------------------
// The cube of water
// ---------------------------------------------------------------------------
const H = 1.5 // half-extent of the cube
const cube = new THREE.Group()
scene.add(cube)

const waterMat = new THREE.MeshPhysicalMaterial({
  color: '#2a8fb0',
  transparent: true,
  opacity: 0.16,
  roughness: 0.18,
  metalness: 0.0,
  transmission: 0.6,
  thickness: 2 * H,
  ior: 1.33,
  side: THREE.DoubleSide,
  depthWrite: false,
})
const waterBox = new THREE.Mesh(new THREE.BoxGeometry(2 * H, 2 * H, 2 * H), waterMat)
waterBox.renderOrder = 10 // draw the glassy faces over the pod for a tinted look
cube.add(waterBox)

// Bright edges so the cube reads as a crisp tank.
const edges = new THREE.LineSegments(
  new THREE.EdgesGeometry(new THREE.BoxGeometry(2 * H, 2 * H, 2 * H)),
  new THREE.LineBasicMaterial({ color: '#9be9f7', transparent: true, opacity: 0.5 }),
)
edges.renderOrder = 11
cube.add(edges)

// The water's top surface — a subdivided sheet that ripples with travelling
// waves. Kept translucent so it reads as a water line without hiding the pod.
const WAVE_AMP = 0.055
const surfaceGeo = new THREE.PlaneGeometry(2 * H, 2 * H, 56, 56).rotateX(-Math.PI / 2)
const surface = new THREE.Mesh(
  surfaceGeo,
  new THREE.MeshStandardMaterial({
    color: '#a9e8ff',
    transparent: true,
    opacity: 0.36,
    roughness: 0.12,
    metalness: 0.0,
    side: THREE.DoubleSide,
    depthWrite: false,
  }),
)
surface.position.y = H - WAVE_AMP
surface.renderOrder = 9
cube.add(surface)

// Precompute each vertex's horizontal position; only its height animates.
const surfPos = surfaceGeo.attributes.position
const surfXZ = []
for (let i = 0; i < surfPos.count; i++) surfXZ.push([surfPos.getX(i), surfPos.getZ(i)])

function updateWaves(t) {
  for (let i = 0; i < surfPos.count; i++) {
    const [x, z] = surfXZ[i]
    // A few crossing sine trains → a lively but cheap water surface.
    const h =
      Math.sin(x * 3.0 + t * 1.5) * 0.02 +
      Math.sin(z * 2.3 - t * 1.1) * 0.022 +
      Math.sin((x + z) * 2.1 + t * 2.0) * 0.012 +
      Math.sin((x - z) * 4.4 - t * 0.8) * 0.008
    surfPos.setY(i, h)
  }
  surfPos.needsUpdate = true
  surfaceGeo.computeVertexNormals()
}

// ---------------------------------------------------------------------------
// Bubbles / plankton drifting up inside the tank
// ---------------------------------------------------------------------------
const MOTES = 160
const moteGeo = new THREE.BufferGeometry()
const motePos = new Float32Array(MOTES * 3)
const moteSpeed = new Float32Array(MOTES)
for (let i = 0; i < MOTES; i++) {
  motePos[i * 3 + 0] = (Math.random() * 2 - 1) * H
  motePos[i * 3 + 1] = (Math.random() * 2 - 1) * H
  motePos[i * 3 + 2] = (Math.random() * 2 - 1) * H
  moteSpeed[i] = 0.04 + Math.random() * 0.12
}
moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3))
const moteMat = new THREE.PointsMaterial({
  color: '#cdf3ff',
  size: 0.03,
  map: makeDiscTexture(),
  transparent: true,
  opacity: 0.55,
  depthWrite: false,
  sizeAttenuation: true,
})
const motes = new THREE.Points(moteGeo, moteMat)
cube.add(motes)

// ---------------------------------------------------------------------------
// Whale builder — a tapered lathe body + pectoral fins, dorsal, and flukes.
// Built facing +Z (snout at +z) so Object3D.lookAt aims it down its travel dir.
// ---------------------------------------------------------------------------
function makeWhale(color) {
  const group = new THREE.Group() // steered by lookAt
  const swim = new THREE.Group() // inner: gentle side-to-side sway
  group.add(swim)

  // Body profile: radius vs. axial position (tail −1 … snout +1).
  const profile = [
    [0.015, -1.0],
    [0.05, -0.85],
    [0.1, -0.62],
    [0.16, -0.34],
    [0.21, -0.05],
    [0.225, 0.16],
    [0.205, 0.44],
    [0.155, 0.7],
    [0.092, 0.88],
    [0.028, 1.0],
  ].map(([r, y]) => new THREE.Vector2(r, y))

  const bodyGeo = new THREE.LatheGeometry(profile, 28)
  bodyGeo.rotateX(Math.PI / 2) // lathe axis y → +z (snout forward)
  bodyGeo.scale(1, 0.82, 1) // flatten a touch vertically

  // Countershading: dark back, pale belly, by world-up (y).
  const back = new THREE.Color(color)
  const belly = new THREE.Color('#d4ecf0')
  const pos = bodyGeo.attributes.position
  const col = new Float32Array(pos.count * 3)
  const c = new THREE.Color()
  for (let i = 0; i < pos.count; i++) {
    const t = clamp((pos.getY(i) / 0.185) * 0.5 + 0.5, 0, 1)
    c.copy(belly).lerp(back, t)
    col[i * 3 + 0] = c.r
    col[i * 3 + 1] = c.g
    col[i * 3 + 2] = c.b
  }
  bodyGeo.setAttribute('color', new THREE.BufferAttribute(col, 3))

  const bodyMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.55,
    metalness: 0.0,
  })
  const finMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.6,
    metalness: 0.0,
    side: THREE.DoubleSide,
  })

  const body = new THREE.Mesh(bodyGeo, bodyMat)
  body.castShadow = true
  swim.add(body)

  // Pectoral fins — flattened triangular blades swept back along the sides.
  const finGeo = new THREE.ConeGeometry(0.085, 0.34, 3)
  finGeo.rotateZ(Math.PI / 2) // point along x
  finGeo.scale(1, 1, 0.16) // flatten into a blade
  for (const side of [1, -1]) {
    const fin = new THREE.Mesh(finGeo, finMat)
    fin.position.set(side * 0.16, -0.04, 0.18)
    fin.rotation.set(degToRad(8), degToRad(side * -26), degToRad(side * -18))
    if (side < 0) fin.scale.x = -1
    fin.castShadow = true
    swim.add(fin)
  }

  // Dorsal ridge — a small swept fin on the back.
  const dorsalGeo = new THREE.ConeGeometry(0.06, 0.16, 3)
  dorsalGeo.scale(0.5, 1, 1)
  const dorsal = new THREE.Mesh(dorsalGeo, finMat)
  dorsal.position.set(0, 0.17, -0.18)
  dorsal.rotation.x = degToRad(-22)
  dorsal.castShadow = true
  swim.add(dorsal)

  // Tail flukes — classic two-lobed silhouette, extruded thin and laid flat.
  const fluke = new THREE.Shape()
  fluke.moveTo(0, 0.03)
  fluke.quadraticCurveTo(0.18, 0.13, 0.34, 0.12)
  fluke.quadraticCurveTo(0.26, 0.0, 0.05, -0.05)
  fluke.quadraticCurveTo(0, -0.02, 0, 0.03)
  fluke.moveTo(0, 0.03)
  fluke.quadraticCurveTo(-0.18, 0.13, -0.34, 0.12)
  fluke.quadraticCurveTo(-0.26, 0.0, -0.05, -0.05)
  fluke.quadraticCurveTo(0, -0.02, 0, 0.03)
  const flukeGeo = new THREE.ExtrudeGeometry(fluke, {
    depth: 0.018,
    bevelEnabled: false,
  })
  flukeGeo.translate(0, 0, -0.009)
  flukeGeo.rotateX(-Math.PI / 2) // lay flat: shape-y → −z (trailing back)

  const flukes = new THREE.Group()
  flukes.position.z = -0.97
  const flukeMesh = new THREE.Mesh(flukeGeo, finMat)
  flukeMesh.castShadow = true
  flukes.add(flukeMesh)
  swim.add(flukes)

  return { group, swim, flukes }
}

// ---------------------------------------------------------------------------
// The pod — each whale loops a confined Lissajous path inside the cube.
// ---------------------------------------------------------------------------
const COLORS = ['#35566b', '#46707f', '#2c4a5c', '#557a8a', '#3c6173']
const SIZES = [0.42, 0.36, 0.3, 0.34, 0.22] // last one is a calf
const POD = SIZES.length

const TMP_A = new THREE.Vector3()
const TMP_B = new THREE.Vector3()
const whales = []

for (let i = 0; i < POD; i++) {
  const scale = SIZES[i]
  const { group, swim, flukes } = makeWhale(COLORS[i % COLORS.length])
  group.scale.setScalar(scale)
  scene.add(group)

  // Keep the whole body inside the tank: amplitude + body reach < H.
  const reach = scale * 1.0 + 0.12
  const ax = clamp(H - reach, 0.2, H) * (0.55 + Math.random() * 0.4)
  const ay = clamp(H - reach, 0.2, H) * (0.3 + Math.random() * 0.3)
  const az = clamp(H - reach, 0.2, H) * (0.55 + Math.random() * 0.4)

  whales.push({
    group,
    swim,
    flukes,
    amp: new THREE.Vector3(ax, ay, az),
    freq: new THREE.Vector3(
      0.5 + Math.random() * 0.4,
      0.7 + Math.random() * 0.5,
      0.42 + Math.random() * 0.4,
    ),
    phase: new THREE.Vector3(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
    ),
    center: new THREE.Vector3(
      (Math.random() * 2 - 1) * 0.15,
      (Math.random() * 2 - 1) * 0.1,
      (Math.random() * 2 - 1) * 0.15,
    ),
    speed: 0.5 + Math.random() * 0.25,
    swayAmp: 0.12 + Math.random() * 0.06,
    flapAmp: 0.4 + Math.random() * 0.2,
  })
}

document.getElementById('pod-count').textContent = POD

// Evaluate a whale's path position at time t into `out`.
function pathAt(w, t, out) {
  out.set(
    w.center.x + w.amp.x * Math.sin(w.freq.x * t + w.phase.x),
    w.center.y + w.amp.y * Math.sin(w.freq.y * t + w.phase.y),
    w.center.z + w.amp.z * Math.sin(w.freq.z * t + w.phase.z),
  )
  return out
}

// ---------------------------------------------------------------------------
// Loop
// ---------------------------------------------------------------------------
const clock = new THREE.Clock()

function tick() {
  const elapsed = clock.elapsedTime
  const dt = Math.min(clock.getDelta(), 0.05)

  for (const w of whales) {
    const t = elapsed * w.speed
    const here = pathAt(w, t, TMP_A)
    const ahead = pathAt(w, t + 0.08, TMP_B)

    w.group.position.copy(here)
    if (ahead.distanceToSquared(here) > 1e-6) w.group.lookAt(ahead)

    // Undulation: body sways, tail flukes flap a quarter-phase behind.
    const beat = t * 3.0
    w.swim.rotation.y = Math.sin(beat) * w.swayAmp
    w.flukes.rotation.x = Math.sin(beat - 0.8) * w.flapAmp
  }

  // Drift the motes upward; recycle them at the floor when they breach the lid.
  const mp = moteGeo.attributes.position
  for (let i = 0; i < MOTES; i++) {
    let y = mp.getY(i) + moteSpeed[i] * dt
    if (y > H) y = -H
    mp.setY(i, y)
  }
  mp.needsUpdate = true

  // Ripple the water's top surface.
  updateWaves(elapsed)

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

function makeDiscTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.4, 'rgba(255,255,255,0.7)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
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
