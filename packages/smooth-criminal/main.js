import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createFigure } from './figure.js'
import { MOVES, LOOP, moveAt, samplePose } from './dance.js'

// Where the loop starts. Parked so the routine opens on the lean — which is
// also what the gallery's screenshot pass catches a beat later.
const START = 6.7

// ---------------------------------------------------------------------------
// Renderer / scene / camera
// ---------------------------------------------------------------------------
const app = document.getElementById('app')
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.05
app.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background = gradientTexture('#1a1220', '#07060a')
scene.fog = new THREE.Fog('#07060a', 3.6, 10)

const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
camera.position.set(3.3, 1.5, 1.2)

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 0.6, 0)
controls.enableDamping = true
controls.dampingFactor = 0.06
controls.autoRotate = true // turntable
controls.autoRotateSpeed = 0.55
controls.minDistance = 2.0
controls.maxDistance = 7.5
controls.maxPolarAngle = Math.PI * 0.49
controls.enablePan = false

// ---------------------------------------------------------------------------
// The diorama: a little round dance floor on a plinth — checkered tiles, a ring
// of slim posts with a deco rail, one pendant lamp burning a hole in the dark.
// ---------------------------------------------------------------------------
const STAGE_R = 1.35
const COLUMN_R = 1.32
const LAMP_Y = 1.75

const brass = new THREE.MeshStandardMaterial({ color: '#8a6a34', roughness: 0.34, metalness: 0.9 })
const stone = new THREE.MeshStandardMaterial({ color: '#20191f', roughness: 0.72, metalness: 0.15 })

const diorama = new THREE.Group()
scene.add(diorama)

const plinth = new THREE.Mesh(new THREE.CylinderGeometry(STAGE_R + 0.06, STAGE_R + 0.16, 0.36, 64), stone)
plinth.position.y = -0.18
plinth.receiveShadow = true
diorama.add(plinth)

const rim = new THREE.Mesh(new THREE.TorusGeometry(STAGE_R + 0.06, 0.018, 10, 96).rotateX(Math.PI / 2), brass)
diorama.add(rim)

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(STAGE_R, 96).rotateX(-Math.PI / 2),
  new THREE.MeshStandardMaterial({ map: checkerTexture(), roughness: 0.28, metalness: 0.16 }),
)
floor.position.y = 0.002
floor.receiveShadow = true
diorama.add(floor)

// Six posts around the floor, running straight up out of frame into the dark —
// tall enough to fill the top corners without a cornice closing over the
// dancer's head — plus a low deco rail at hip height.
for (let i = 0; i < 6; i++) {
  // Phase chosen so the opening camera angle looks through a gap, not a post.
  const a = (i / 6) * Math.PI * 2 + Math.PI * (5 / 18)
  const col = new THREE.Group()
  col.position.set(Math.cos(a) * COLUMN_R, 0, Math.sin(a) * COLUMN_R)
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.021, 0.028, 2.1, 12), stone)
  shaft.position.y = 1.05
  shaft.castShadow = true
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.055, 0.05, 12), brass)
  base.position.y = 0.027
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.028, 12), brass)
  collar.position.y = 0.38
  col.add(shaft, base, collar)
  diorama.add(col)
}
for (const [y, tube] of [[0.36, 0.016], [0.24, 0.008]]) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(COLUMN_R, tube, 8, 96).rotateX(Math.PI / 2), brass)
  ring.position.y = y
  diorama.add(ring)
}

// Pendant lamp on a rod that disappears up into the dark.
const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.1, 8), stone)
rod.position.y = LAMP_Y + 0.55
diorama.add(rod)
const shade = new THREE.Mesh(
  new THREE.ConeGeometry(0.15, 0.17, 24, 1, true),
  new THREE.MeshStandardMaterial({ color: '#241a1a', roughness: 0.5, metalness: 0.6, side: THREE.DoubleSide }),
)
shade.position.y = LAMP_Y + 0.06
diorama.add(shade)
const bulb = new THREE.Mesh(
  new THREE.SphereGeometry(0.045, 16, 12),
  new THREE.MeshBasicMaterial({ color: '#ffe6bd' }),
)
bulb.position.y = LAMP_Y
diorama.add(bulb)

// The visible beam, plus the warm pool it lays on the tiles.
const beam = new THREE.Mesh(
  new THREE.ConeGeometry(1.28, LAMP_Y - 0.02, 40, 1, true),
  new THREE.MeshBasicMaterial({
    map: beamTexture(),
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  }),
)
beam.position.y = (LAMP_Y - 0.02) / 2 + 0.01
diorama.add(beam)

const pool = new THREE.Mesh(
  new THREE.CircleGeometry(1.34, 64).rotateX(-Math.PI / 2),
  new THREE.MeshBasicMaterial({
    map: glowTexture(),
    transparent: true,
    opacity: 0.2,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }),
)
pool.position.y = 0.006
diorama.add(pool)

// Dust hanging in the beam.
const DUST = 220
const dustPos = new Float32Array(DUST * 3)
const dustVel = new Float32Array(DUST)
for (let i = 0; i < DUST; i++) {
  const a = Math.random() * Math.PI * 2
  const r = Math.sqrt(Math.random()) * 0.95
  dustPos[i * 3] = Math.cos(a) * r
  dustPos[i * 3 + 1] = Math.random() * LAMP_Y
  dustPos[i * 3 + 2] = Math.sin(a) * r
  dustVel[i] = 0.008 + Math.random() * 0.022
}
const dustGeo = new THREE.BufferGeometry()
dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
const dust = new THREE.Points(
  dustGeo,
  new THREE.PointsMaterial({
    size: 0.016,
    map: glowTexture(),
    color: '#ffddb0',
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  }),
)
scene.add(dust)

// ---------------------------------------------------------------------------
// Lighting — one hard warm key from the lamp (this is the shadow caster), a
// cool rim to carve the silhouette out of the dark, and barely any fill.
// ---------------------------------------------------------------------------
scene.add(new THREE.HemisphereLight('#6a5c80', '#0d0912', 0.5))

const spot = new THREE.SpotLight('#fff1de', 32, 6.5, 0.62, 0.5, 1.4)
spot.position.set(0, LAMP_Y, 0)
spot.target.position.set(0, 0, 0)
spot.castShadow = true
spot.shadow.mapSize.set(2048, 2048)
spot.shadow.camera.near = 0.4
spot.shadow.camera.far = 5
spot.shadow.bias = -0.0009
spot.shadow.radius = 3
scene.add(spot, spot.target)

// The pendant hangs dead centre, so its shadow pools straight down and the
// lean has nothing to throw. This raking rim light is what puts a long shadow
// across the tiles.
const rimLight = new THREE.DirectionalLight('#7fb6ff', 1.6)
rimLight.position.set(-2.4, 1.9, -2.6)
rimLight.castShadow = true
rimLight.shadow.mapSize.set(1024, 1024)
rimLight.shadow.camera.near = 0.5
rimLight.shadow.camera.far = 8
rimLight.shadow.camera.left = -1.8
rimLight.shadow.camera.right = 1.8
rimLight.shadow.camera.top = 1.8
rimLight.shadow.camera.bottom = -1.8
rimLight.shadow.bias = -0.0012
rimLight.shadow.radius = 3
scene.add(rimLight)

const warmFill = new THREE.DirectionalLight('#ffcfa8', 0.3)
warmFill.position.set(2.6, 0.9, 2.2)
scene.add(warmFill)

// ---------------------------------------------------------------------------
// The dancer
// ---------------------------------------------------------------------------
const figure = createFigure()
scene.add(figure.root)

// ---------------------------------------------------------------------------
// HUD — a segment per move, sized by how long the move runs.
// ---------------------------------------------------------------------------
const nameEl = document.getElementById('move-name')
const barEl = document.getElementById('bar')
const playBtn = document.getElementById('play')
const slowBtn = document.getElementById('slow')

const segs = MOVES.map((m, i) => {
  const el = document.createElement('div')
  el.className = 'seg'
  el.style.flex = String(m.dur)
  el.title = m.name
  el.addEventListener('click', () => {
    clock = MOVES.slice(0, i).reduce((s, x) => s + x.dur, 0)
  })
  barEl.appendChild(el)
  return el
})

let clock = START
let playing = true
let speed = 1

playBtn.addEventListener('click', () => {
  playing = !playing
  playBtn.textContent = playing ? '❚❚' : '▶'
})
slowBtn.addEventListener('click', () => {
  speed = speed === 1 ? 0.5 : 1
  slowBtn.classList.toggle('on', speed !== 1)
})

let hudIndex = -1
function refreshHud() {
  const { index, local, move } = moveAt(clock)
  if (index !== hudIndex) {
    hudIndex = index
    nameEl.textContent = move.name
  }
  segs.forEach((el, i) => {
    el.style.setProperty('--fill', i < index ? '1' : i > index ? '0' : String(local / move.dur))
  })
}

// ---------------------------------------------------------------------------
// Loop
// ---------------------------------------------------------------------------
const timer = new THREE.Clock()
function tick() {
  const dt = Math.min(timer.getDelta(), 0.05)
  if (playing) clock = (clock + dt * speed) % LOOP

  figure.applyPose(samplePose(clock))
  refreshHud()

  // Motes rise through the beam and wrap back to the floor.
  for (let i = 0; i < DUST; i++) {
    let y = dustPos[i * 3 + 1] + dustVel[i] * dt
    if (y > LAMP_Y) y -= LAMP_Y
    dustPos[i * 3 + 1] = y
    dustPos[i * 3] += Math.sin(clock * 0.7 + i) * 0.00035
  }
  dustGeo.attributes.position.needsUpdate = true

  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}
tick()

// ---------------------------------------------------------------------------
// Canvas textures
// ---------------------------------------------------------------------------
function gradientTexture(top, bottom) {
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

// Checkered tiles, darkened toward the edge so the floor sinks into the fog.
function checkerTexture() {
  const S = 512
  const N = 10
  const c = document.createElement('canvas')
  c.width = c.height = S
  const ctx = c.getContext('2d')
  const cell = S / N
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      ctx.fillStyle = (x + y) % 2 ? '#e7dfcd' : '#15131b'
      ctx.fillRect(x * cell, y * cell, cell, cell)
    }
  }
  const vig = ctx.createRadialGradient(S / 2, S / 2, S * 0.18, S / 2, S / 2, S * 0.52)
  vig.addColorStop(0, 'rgba(0,0,0,0)')
  vig.addColorStop(1, 'rgba(0,0,0,0.72)')
  ctx.fillStyle = vig
  ctx.fillRect(0, 0, S, S)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy()
  return tex
}

// Vertical falloff for the light beam: bright at the apex, gone by the floor.
function beamTexture() {
  const c = document.createElement('canvas')
  c.width = 4
  c.height = 128
  const ctx = c.getContext('2d')
  const g = ctx.createLinearGradient(0, 128, 0, 0)
  g.addColorStop(0, 'rgba(255, 208, 150, 0)')
  g.addColorStop(0.55, 'rgba(255, 214, 160, 0.22)')
  g.addColorStop(1, 'rgba(255, 232, 196, 0.7)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 4, 128)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// Soft round blob — the light pool on the floor and every dust mote.
function glowTexture() {
  const S = 128
  const c = document.createElement('canvas')
  c.width = c.height = S
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
  g.addColorStop(0, 'rgba(255,236,205,1)')
  g.addColorStop(0.35, 'rgba(255,215,160,0.42)')
  g.addColorStop(1, 'rgba(255,200,140,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, S, S)
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
