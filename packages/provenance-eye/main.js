import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

const { clamp, lerp } = THREE.MathUtils

// ---------------------------------------------------------------------------
// The Eye of Provenance: a thick golden eye-in-triangle enthroned on a cloud.
// Closing the eye blooms sunbeams + gold petals from behind the triangle.
// Occasionally the eye goes alien instead — slit pupil, tentacles — winks,
// and returns to normal. Gentle parallax from pointer / device tilt.
//
// URL param ?pose=bloom|alien freezes the scene in that state (also handy
// for screenshots): the ambient director loop is skipped entirely.
// ---------------------------------------------------------------------------

// -- easing ------------------------------------------------------------------
const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3)
const easeInQuad = (x) => x * x
const easeOutBack = (x, s = 1.4) => 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2)
const rand = (a, b) => a + Math.random() * (b - a)

// ---------------------------------------------------------------------------
// Renderer / scene / camera
// ---------------------------------------------------------------------------
const app = document.getElementById('app')
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.08
app.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.fog = new THREE.Fog('#bcd6f0', 9.5, 19)

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
const rig = new THREE.Group() // parallax moves the rig, camera stays put inside
rig.add(camera)
camera.position.set(0, 0.15, 6.4)
scene.add(rig)
const LOOK_AT = new THREE.Vector3(0, -0.3, 0)

const pmrem = new THREE.PMREMGenerator(renderer)
scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture
pmrem.dispose()

// ---------------------------------------------------------------------------
// Lights
// ---------------------------------------------------------------------------
scene.add(new THREE.HemisphereLight('#bdd8ff', '#ffe7c2', 0.85))

const sun = new THREE.DirectionalLight('#fff1d6', 2.4)
sun.position.set(3.5, 4.5, 5.5)
sun.castShadow = true
sun.shadow.mapSize.set(1024, 1024)
sun.shadow.camera.left = -3.2
sun.shadow.camera.right = 3.2
sun.shadow.camera.top = 3.2
sun.shadow.camera.bottom = -3.5
sun.shadow.camera.near = 1
sun.shadow.camera.far = 16
sun.shadow.radius = 5
sun.shadow.bias = -0.0008
sun.shadow.normalBias = 0.03
scene.add(sun)

// ---------------------------------------------------------------------------
// Sky dome + drifting background clouds
// ---------------------------------------------------------------------------
const sky = new THREE.Mesh(
  new THREE.SphereGeometry(40, 32, 24),
  new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uZenith: { value: new THREE.Color('#3d6fc2') },
      uMid: { value: new THREE.Color('#82b4e8') },
      uHorizon: { value: new THREE.Color('#ffe2b4') },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uZenith;
      uniform vec3 uMid;
      uniform vec3 uHorizon;
      varying vec3 vDir;
      void main() {
        float h = normalize(vDir).y;
        vec3 col = mix(uHorizon, uMid, smoothstep(-0.06, 0.28, h));
        col = mix(col, uZenith, smoothstep(0.28, 0.8, h));
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  })
)
scene.add(sky)

const puffGeo = new THREE.SphereGeometry(1, 24, 18)
const puffMat = new THREE.MeshStandardMaterial({
  color: '#ffffff',
  roughness: 1,
  metalness: 0,
  envMapIntensity: 0.35,
})

function makeCloud(puffs, { shadows = false } = {}) {
  const g = new THREE.Group()
  for (const [x, y, z, r] of puffs) {
    const m = new THREE.Mesh(puffGeo, puffMat)
    m.position.set(x, y, z)
    m.scale.setScalar(r)
    m.castShadow = shadows
    m.receiveShadow = shadows
    g.add(m)
  }
  return g
}

const FAR_CLOUDS = []
for (const [x, y, z, s, vx] of [
  [-6.5, 1.1, -5.5, 0.9, 0.055],
  [5.0, -0.6, -7.0, 1.25, 0.04],
  [1.5, 2.1, -8.5, 1.5, 0.07],
  [-3.5, -1.6, -6.2, 0.8, 0.05],
]) {
  const c = makeCloud([
    [0, 0, 0, 0.55],
    [0.6, 0.05, 0.05, 0.42],
    [-0.62, -0.02, 0, 0.45],
    [0.2, 0.28, -0.1, 0.38],
  ])
  c.position.set(x, y, z)
  c.scale.setScalar(s)
  c.userData.vx = vx
  scene.add(c)
  FAR_CLOUDS.push(c)
}

// ---------------------------------------------------------------------------
// The throne cloud
// ---------------------------------------------------------------------------
const world = new THREE.Group() // everything that bobs together
scene.add(world)

const cloud = makeCloud(
  [
    [0, 0, 0, 0.66],
    [0.58, 0.1, 0.16, 0.52],
    [-0.62, 0.06, 0.12, 0.55],
    [1.12, -0.08, 0.02, 0.42],
    [-1.18, -0.1, -0.02, 0.44],
    [0.3, 0.32, -0.12, 0.46],
    [-0.34, 0.3, -0.14, 0.44],
    [0.02, 0.2, 0.4, 0.5],
    [0.8, 0.2, -0.24, 0.38],
    [-0.85, 0.22, -0.22, 0.37],
    [0.05, -0.18, 0.1, 0.6],
    [0.62, -0.2, 0.02, 0.48],
    [-0.6, -0.22, 0.06, 0.5],
  ],
  { shadows: true }
)
cloud.position.set(0, -1.5, 0.12)
cloud.scale.set(1.28, 0.92, 1.05)
world.add(cloud)

// ---------------------------------------------------------------------------
// Gold materials (shared: triangle, lids). Alien mode tints them live.
// ---------------------------------------------------------------------------
const GOLD = new THREE.Color('#f7c34c')
const GOLD_ALIEN = new THREE.Color('#c9c455')
const goldMat = new THREE.MeshStandardMaterial({
  color: GOLD.clone(),
  metalness: 1,
  roughness: 0.24,
  envMapIntensity: 1.05,
  side: THREE.DoubleSide, // lid shells show their inner face mid-blink
  emissive: '#123c17',
  emissiveIntensity: 0,
})

// ---------------------------------------------------------------------------
// The monument: thick rounded gold triangle
// ---------------------------------------------------------------------------
const monument = new THREE.Group()
monument.position.set(0, -0.12, 0)
world.add(monument)

function roundedPolygonShape(points, radius) {
  const shape = new THREE.Shape()
  const n = points.length
  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n]
    const curr = points[i]
    const next = points[(i + 1) % n]
    const toPrev = prev.clone().sub(curr).normalize()
    const toNext = next.clone().sub(curr).normalize()
    const a = curr.clone().addScaledVector(toPrev, radius)
    const b = curr.clone().addScaledVector(toNext, radius)
    if (i === 0) shape.moveTo(a.x, a.y)
    else shape.lineTo(a.x, a.y)
    shape.quadraticCurveTo(curr.x, curr.y, b.x, b.y)
  }
  shape.closePath()
  return shape
}

const TRI_R = 1.35 // circumradius; inradius is half of this
const triPoints = [90, 210, 330].map((deg) => {
  const a = (deg * Math.PI) / 180
  return new THREE.Vector2(Math.cos(a) * TRI_R, Math.sin(a) * TRI_R)
})
const triGeo = new THREE.ExtrudeGeometry(roundedPolygonShape(triPoints, 0.16), {
  depth: 0.42,
  bevelEnabled: true,
  bevelThickness: 0.05,
  bevelSize: 0.05,
  bevelSegments: 4,
  curveSegments: 24,
})
const triangle = new THREE.Mesh(triGeo, goldMat)
triangle.castShadow = true
monument.add(triangle)

// ---------------------------------------------------------------------------
// The eye: ball, iris, pupil, glint, two gold lid shells, lash seam
// ---------------------------------------------------------------------------
const EYE_R = 0.42
const eye = new THREE.Group()
eye.position.set(0, 0, 0.34) // half-sunk into the triangle face
monument.add(eye)

const SCLERA = new THREE.Color('#fdf6ea')
const SCLERA_ALIEN = new THREE.Color('#e4f6dd')
const scleraMat = new THREE.MeshStandardMaterial({
  color: SCLERA.clone(),
  roughness: 0.25,
  metalness: 0,
  envMapIntensity: 0.5,
})
const ball = new THREE.Mesh(new THREE.SphereGeometry(EYE_R, 40, 28), scleraMat)
ball.castShadow = true
eye.add(ball)

// gaze group carries iris + pupil so the eye can look around
const gaze = new THREE.Group()
eye.add(gaze)

const IRIS = new THREE.Color('#3a6fc4')
const IRIS_ALIEN = new THREE.Color('#2fd455')
const IRIS_GLOW = new THREE.Color('#0a1e40')
const IRIS_GLOW_ALIEN = new THREE.Color('#128a3a')
const irisMat = new THREE.MeshStandardMaterial({
  color: IRIS.clone(),
  roughness: 0.35,
  metalness: 0.15,
  emissive: IRIS_GLOW.clone(),
  emissiveIntensity: 0.5,
})
const iris = new THREE.Mesh(new THREE.SphereGeometry(0.175, 28, 20), irisMat)
iris.position.set(0, 0, 0.395)
iris.scale.set(1, 1, 0.26)
gaze.add(iris)

const pupilMat = new THREE.MeshStandardMaterial({ color: '#0b0b10', roughness: 0.3 })
const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.075, 24, 16), pupilMat)
pupil.position.set(0, 0, 0.435)
gaze.add(pupil)

const glint = new THREE.Mesh(
  new THREE.SphereGeometry(0.026, 12, 10),
  new THREE.MeshBasicMaterial({ color: '#ffffff' })
)
glint.position.copy(new THREE.Vector3(0.35, 0.35, 0.88).normalize().multiplyScalar(EYE_R + 0.015))
eye.add(glint) // outside the gaze group: a highlight stays put

// Lid shells: spherical caps that swing from behind the gold over the eye.
// rotation.x aims the cap axis: 0 = up, +PI/2 = straight at the camera.
// Caps are generous and the bottom one slightly smaller-radius so that,
// closed, they overlap (top over bottom) instead of gapping or z-fighting.
const TOP_OPEN = -1.35
const TOP_CLOSED = 0.33 // seam lands ~12° below the eye's center — a shut lid, not a grin
const BOT_OPEN = Math.PI + 1.35
const BOT_CLOSED = 2.37
const TOP_CAP = 1.45
const lidTop = new THREE.Mesh(new THREE.SphereGeometry(0.465, 40, 20, 0, Math.PI * 2, 0, TOP_CAP), goldMat)
const lidBot = new THREE.Mesh(new THREE.SphereGeometry(0.455, 40, 16, 0, Math.PI * 2, 0, 1.15), goldMat)
lidTop.castShadow = lidBot.castShadow = true
eye.add(lidTop, lidBot)

// Lash line: a dark ring riding the top lid's rim, so it sweeps with the
// blink and settles into the closed seam.
const lashGeo = new THREE.TorusGeometry(0.465 * Math.sin(TOP_CAP), 0.013, 8, 48)
lashGeo.rotateX(Math.PI / 2)
lashGeo.translate(0, 0.465 * Math.cos(TOP_CAP), 0)
const lash = new THREE.Mesh(lashGeo, new THREE.MeshBasicMaterial({ color: '#3a2506' }))
lidTop.add(lash)

// ---------------------------------------------------------------------------
// Sunbeams (behind the triangle, additive wedges)
// ---------------------------------------------------------------------------
const beamGroup = new THREE.Group()
beamGroup.position.z = -0.6
monument.add(beamGroup)

const beamMat = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  uniforms: {
    uIntensity: { value: 0 },
    uInner: { value: new THREE.Color('#fff3c8') },
    uOuter: { value: new THREE.Color('#ffbe45') },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 p = position;
      p.x *= mix(0.12, 1.0, uv.y); // taper: rays widen as they leave the eye
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uIntensity;
    uniform vec3 uInner;
    uniform vec3 uOuter;
    varying vec2 vUv;
    void main() {
      float edge = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x);
      float fade = pow(1.0 - vUv.y, 1.7);
      vec3 col = mix(uInner, uOuter, vUv.y);
      gl_FragColor = vec4(col, uIntensity * fade * edge);
    }
  `,
})
const beamGeo = new THREE.PlaneGeometry(1, 1, 1, 4).translate(0, 0.5, 0)
const N_BEAMS = 11
for (let i = 0; i < N_BEAMS; i++) {
  const b = new THREE.Mesh(beamGeo, beamMat)
  const angle = (i / N_BEAMS) * Math.PI * 2 + 0.35
  b.rotation.z = angle
  const len = rand(3.4, 5.4)
  b.scale.set(rand(0.5, 0.85), len, 1)
  b.userData = { baseLen: len, phase: rand(0, Math.PI * 2) }
  beamGroup.add(b)
}

// backdrop glow sprites (warm for the sun bloom, sickly green for alien mode)
function radialTexture(inner, outer) {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(128, 128, 8, 128, 128, 128)
  g.addColorStop(0, inner)
  g.addColorStop(1, outer)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function makeGlow(inner, scale, z) {
  const m = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: radialTexture(inner, 'rgba(0,0,0,0)'),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0,
    })
  )
  m.scale.setScalar(scale)
  m.position.z = z
  monument.add(m)
  return m
}
const glowWarm = makeGlow('rgba(255,222,150,0.9)', 7.5, -1.1)
const glowAlien = makeGlow('rgba(150,255,175,0.75)', 6.5, -1.0)

// ---------------------------------------------------------------------------
// Sun petals (gold leaves that slide out from behind the triangle)
// ---------------------------------------------------------------------------
const petalGroup = new THREE.Group()
petalGroup.position.z = -0.26
monument.add(petalGroup)

function petalGeometry(len, width) {
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.bezierCurveTo(width * 0.55, len * 0.2, width * 0.5, len * 0.62, 0, len)
  s.bezierCurveTo(-width * 0.5, len * 0.62, -width * 0.55, len * 0.2, 0, 0)
  return new THREE.ExtrudeGeometry(s, {
    depth: 0.045,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2,
    curveSegments: 12,
  })
}

const petalMat = new THREE.MeshStandardMaterial({
  color: '#ffb838',
  metalness: 0.65,
  roughness: 0.33,
  emissive: '#ff8a00',
  emissiveIntensity: 0.55,
  envMapIntensity: 0.8,
})
const petalGeoLong = petalGeometry(1.2, 0.32)
const petalGeoShort = petalGeometry(0.88, 0.26)
const PETALS = []
const N_PETALS = 12
for (let i = 0; i < N_PETALS; i++) {
  const long = i % 2 === 0
  const holder = new THREE.Group()
  holder.rotation.z = (i / N_PETALS) * Math.PI * 2 + Math.PI / 12
  const p = new THREE.Mesh(long ? petalGeoLong : petalGeoShort, petalMat)
  p.castShadow = true
  holder.add(p)
  petalGroup.add(holder)
  PETALS.push({ mesh: p, stagger: (i % 3) * 0.11 + (long ? 0 : 0.06) })
}

// ---------------------------------------------------------------------------
// Tentacles (alien mode): bent cones wiggled in the vertex shader
// ---------------------------------------------------------------------------
const tentacleGroup = new THREE.Group()
tentacleGroup.position.z = -0.3
monument.add(tentacleGroup)

const TENTACLES = []
const N_TENT = 7
for (let i = 0; i < N_TENT; i++) {
  const angle = (i / N_TENT) * Math.PI * 2 + 0.9
  const droop = Math.sin(angle) < -0.3 // pointing down toward the cloud
  const len = droop ? rand(1.1, 1.5) : rand(1.5, 2.2)
  const geo = new THREE.ConeGeometry(rand(0.09, 0.125), len, 10, 36)
  geo.translate(0, len / 2, 0) // base at local origin, tip at +Y
  const mat = new THREE.MeshStandardMaterial({
    color: '#6f36b8',
    roughness: 0.5,
    metalness: 0.1,
    emissive: '#1e0838',
    emissiveIntensity: 0.5,
  })
  const uniforms = {
    uTime: { value: 0 },
    uPhase: { value: rand(0, Math.PI * 2) },
    uLen: { value: len },
  }
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms)
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
         uniform float uTime;
         uniform float uPhase;
         uniform float uLen;`
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         {
           float f = clamp(transformed.y / uLen, 0.0, 1.0);
           float w = f * f * 0.34;
           transformed.x += (sin(uTime * 2.1 + uPhase + f * 5.0) * 0.6
                           + sin(uTime * 3.4 + uPhase * 1.7 + f * 9.0) * 0.25) * w * uLen;
           transformed.z += cos(uTime * 1.8 + uPhase * 1.3 + f * 6.0) * 0.5 * w * uLen;
         }`
      )
  }
  mat.customProgramCacheKey = () => 'tentacle'
  const t = new THREE.Mesh(geo, mat)
  const dir = new THREE.Vector3(Math.cos(angle), Math.sin(angle), rand(0.1, 0.35)).normalize()
  t.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
  t.position.set(Math.cos(angle) * 0.55, Math.sin(angle) * 0.55, 0)
  t.scale.setScalar(0.001)
  tentacleGroup.add(t)
  TENTACLES.push({ mesh: t, uniforms, stagger: i * 0.09 })
}

// ---------------------------------------------------------------------------
// Animation state
// ---------------------------------------------------------------------------
let close = 0 // 0 open .. 1 closed — drives lids, beams, petals
let alienAmt = 0 // 0 normal .. 1 full alien — drives tint, slit pupil, tentacles
let beamAmt = 0 // smoothed follower of `close` (gated off while alien)
let petalAmt = 0 // slower smoothed follower
let winkTilt = 0 // playful roll while the alien eye winks
let busy = false

// -- tiny promise tween pool (ticked from the render loop) -------------------
const tweens = []
function go(dur, fn, ease = easeInOutCubic) {
  return new Promise((resolve) => tweens.push({ t: 0, dur, fn, ease, resolve }))
}
const hold = (dur) => go(dur, () => {}, (x) => x)
function tickTweens(dt) {
  for (let i = tweens.length - 1; i >= 0; i--) {
    const tw = tweens[i]
    tw.t += dt
    const p = Math.min(1, tw.t / tw.dur)
    tw.fn(tw.ease(p))
    if (p >= 1) {
      tweens.splice(i, 1)
      tw.resolve()
    }
  }
}

// -- the two set-pieces -------------------------------------------------------
async function sunEvent() {
  await go(1.15, (p) => (close = p))
  await hold(2.6) // beams + petals bloom via the smoothed followers
  await go(0.95, (p) => (close = 1 - p))
}

async function alienEvent() {
  await go(0.75, (p) => (alienAmt = p), easeOutCubic)
  await hold(2.7) // tentacles writhe, gaze darts
  // the wink: quick shut + a cheeky roll, quick open
  await go(0.16, (p) => {
    close = p
    winkTilt = p * 0.09
  }, easeInQuad)
  await hold(0.13)
  await go(0.24, (p) => {
    close = 1 - p
    winkTilt = (1 - p) * 0.09
  })
  await hold(0.35)
  await go(0.8, (p) => (alienAmt = 1 - p))
}

async function microBlink() {
  await go(0.13, (p) => (close = p), easeInQuad)
  await go(0.19, (p) => (close = 1 - p))
}

// -- ambient director ---------------------------------------------------------
async function director() {
  await hold(2.2) // settle (and let the gallery screenshot catch the open eye)
  for (;;) {
    await hold(rand(4.5, 9))
    busy = true
    if (Math.random() < 0.32) await alienEvent()
    else await sunEvent()
    busy = false
  }
}

async function blinker() {
  for (;;) {
    await hold(rand(3.2, 7))
    if (busy) continue
    busy = true
    await microBlink()
    busy = false
  }
}

// -- frozen poses for screenshots / curiosity ---------------------------------
const pose = new URLSearchParams(location.search).get('pose')
if (pose === 'bloom') {
  close = 1
  beamAmt = 1
  petalAmt = 1
} else if (pose === 'alien') {
  alienAmt = 1
} else if (pose !== 'open') {
  director()
  blinker()
}

window.__eye = {
  sun: () => !busy && ((busy = true), sunEvent().then(() => (busy = false))),
  alien: () => !busy && ((busy = true), alienEvent().then(() => (busy = false))),
  now: () => elapsed, // scene clock (dt is capped, so it dilates on slow devices)
}

// ---------------------------------------------------------------------------
// Pointer / device-tilt parallax
// ---------------------------------------------------------------------------
let px = 0
let py = 0 // pointer, normalized -1..1 (py up)
let lastPointerAt = -10

window.addEventListener('pointermove', (e) => {
  px = (e.clientX / window.innerWidth) * 2 - 1
  py = -((e.clientY / window.innerHeight) * 2 - 1)
  lastPointerAt = elapsed
})

// Device orientation only where it works without a permission prompt
// (iOS 13+ requires one — there we quietly skip it).
if (
  typeof DeviceOrientationEvent !== 'undefined' &&
  typeof DeviceOrientationEvent.requestPermission !== 'function'
) {
  let beta0 = null
  window.addEventListener('deviceorientation', (e) => {
    if (e.beta === null || e.gamma === null) return
    if (beta0 === null) beta0 = e.beta // first reading = neutral hold
    px = clamp(e.gamma / 28, -1, 1)
    py = clamp((beta0 - e.beta) / 24, -1, 1)
    lastPointerAt = elapsed
  })
}

// ---------------------------------------------------------------------------
// Frame loop
// ---------------------------------------------------------------------------
const clock = new THREE.Clock()
let elapsed = 0
const gazeCur = new THREE.Vector2()

function frame() {
  requestAnimationFrame(frame)
  const dt = Math.min(clock.getDelta(), 0.05)
  elapsed += dt
  const t = elapsed

  tickTweens(dt)

  // smoothed followers — beams flash even on micro-blinks, petals take longer
  const alienGate = 1 - THREE.MathUtils.smoothstep(alienAmt, 0.2, 0.5)
  beamAmt += (close * alienGate - beamAmt) * (1 - Math.exp(-8 * dt))
  petalAmt += (close * alienGate - petalAmt) * (1 - Math.exp(-4 * dt))

  // -- eyelids: a resting hood keeps the open eye from looking googly
  const lidAmt = 0.22 + 0.78 * close
  lidTop.rotation.x = lerp(TOP_OPEN, TOP_CLOSED, lidAmt)
  lidBot.rotation.x = lerp(BOT_OPEN, BOT_CLOSED, lidAmt)

  // -- gaze: follow the pointer, wander when it idles, dart when alien
  const wanderMix = clamp((t - lastPointerAt - 3) / 2, 0, 1)
  let gx = lerp(px * 0.32, Math.sin(t * 0.31) * 0.2, wanderMix) + Math.sin(t * 0.83) * 0.02
  let gy = lerp(py * 0.24, Math.cos(t * 0.23) * 0.14, wanderMix) + Math.cos(t * 0.71) * 0.02
  if (alienAmt > 0.4) {
    gx += (Math.sin(t * 8.1) * 0.1 + Math.sin(t * 12.7) * 0.07) * alienAmt
    gy += Math.cos(t * 9.3) * 0.08 * alienAmt
  }
  gazeCur.x += (gx - gazeCur.x) * (1 - Math.exp(-7 * dt))
  gazeCur.y += (gy - gazeCur.y) * (1 - Math.exp(-7 * dt))
  gaze.rotation.y = gazeCur.x
  gaze.rotation.x = -gazeCur.y
  gaze.rotation.z = alienAmt * Math.sin(t * 0.9) * 0.5 // slit slowly rolling: unsettling

  // -- alien transform: tint, dilate, slit
  goldMat.color.lerpColors(GOLD, GOLD_ALIEN, alienAmt * 0.7)
  goldMat.emissiveIntensity = alienAmt * 0.18
  scleraMat.color.lerpColors(SCLERA, SCLERA_ALIEN, alienAmt)
  irisMat.color.lerpColors(IRIS, IRIS_ALIEN, alienAmt)
  irisMat.emissive.lerpColors(IRIS_GLOW, IRIS_GLOW_ALIEN, alienAmt)
  irisMat.emissiveIntensity = 0.5 - alienAmt * 0.15
  iris.scale.set(1 + alienAmt * 0.3, 1 + alienAmt * 0.3, 0.26)
  pupil.scale.set(lerp(1, 0.3, alienAmt), lerp(1, 1.9, alienAmt), 0.18)

  // -- beams, glow, petals
  beamMat.uniforms.uIntensity.value = beamAmt * 0.95
  beamGroup.rotation.z = t * 0.05 + Math.sin(t * 0.4) * 0.03
  for (const b of beamGroup.children) {
    b.scale.y = b.userData.baseLen * (1 + Math.sin(t * 1.3 + b.userData.phase) * 0.06)
  }
  glowWarm.material.opacity = beamAmt * 0.55
  glowAlien.material.opacity = alienAmt * (0.32 + Math.sin(t * 2.7) * 0.08)

  petalGroup.rotation.z = -t * 0.03
  for (const p of PETALS) {
    const ph = clamp((petalAmt - p.stagger) / 0.7, 0, 1)
    const s = Math.max(0.001, easeOutBack(ph))
    p.mesh.scale.setScalar(s)
    // base stays tucked behind the triangle (inradius 0.675) so petals never
    // visibly detach from its silhouette between the corners
    p.mesh.position.y = lerp(0.5, 0.62, ph)
  }

  // -- tentacles
  for (const tc of TENTACLES) {
    tc.uniforms.uTime.value = t
    const g = easeOutBack(clamp((alienAmt * 1.55 - tc.stagger) / 1.0, 0, 1), 1.2)
    tc.mesh.scale.set(Math.max(0.001, clamp(g * 1.6, 0, 1)), Math.max(0.001, g), Math.max(0.001, clamp(g * 1.6, 0, 1)))
  }

  // -- idle drift: the cloud breathes, the monument hovers and sways
  world.position.y = Math.sin(t * 0.5) * 0.05
  cloud.position.y = -1.5 + Math.sin(t * 0.7 + 1.7) * 0.03
  monument.position.y = -0.12 + Math.sin(t * 0.6 + 0.6) * 0.045
  monument.rotation.z = Math.sin(t * 0.34) * 0.012 + winkTilt
  monument.rotation.y = gazeCur.x * 0.22
  monument.scale.setScalar(1 + beamAmt * 0.028)

  for (const c of FAR_CLOUDS) {
    c.position.x += c.userData.vx * dt
    if (c.position.x > 10) c.position.x = -10
  }

  // -- parallax rig
  rig.position.x += (px * 0.5 - rig.position.x) * (1 - Math.exp(-3.5 * dt))
  rig.position.y += (py * 0.32 - rig.position.y) * (1 - Math.exp(-3.5 * dt))
  camera.lookAt(LOOK_AT)

  renderer.render(scene, camera)
}

function resize() {
  const w = window.innerWidth
  const h = window.innerHeight
  renderer.setSize(w, h)
  camera.aspect = w / h
  // vertical fov widens on narrow screens so the monument never clips
  const minHorizontal = 2.0 / 6.4 // half-width the frame must fit at the monument
  camera.fov = Math.max(42, THREE.MathUtils.radToDeg(2 * Math.atan(minHorizontal / camera.aspect)))
  camera.updateProjectionMatrix()
}
window.addEventListener('resize', resize)
resize()
frame()
