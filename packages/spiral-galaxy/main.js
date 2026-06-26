import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Spiral Galaxy
// A particle-based rotating spiral galaxy with an exaggerated central black
// hole, occasional supernovae, twinkling stars + nebula mist, and a recurring
// picture-in-picture tour of procedurally generated planets connected by an
// SVG line to a point in the galaxy.
// ---------------------------------------------------------------------------

const TWO_PI = Math.PI * 2

// ===========================================================================
// MAIN GALAXY SCENE
// ===========================================================================
const canvas = document.getElementById('scene')
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
})
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x000000, 0)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 2000)
// High vantage point looking down onto the disk so the spiral FACE is visible
// (not an edge-on sliver). Roughly a ~50° downward three-quarter view.
camera.position.set(0, 175, 130)
camera.lookAt(0, 0, 0)

// The whole galaxy lives in one group so it can be spun cheaply. The disk sits
// in the XZ plane; the elevated camera supplies the pleasing three-quarter tilt,
// so the group itself needs no extra rotation (which previously cancelled the
// camera angle and produced a near-edge-on view).
const galaxy = new THREE.Group()
galaxy.rotation.x = 0
scene.add(galaxy)

// --- A reusable soft radial sprite texture (used for star + halo glow) ------
function makeGlowTexture(inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)') {
  const size = 128
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, inner)
  g.addColorStop(0.35, inner)
  g.addColorStop(1, outer)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

const starTexture = makeGlowTexture()
const haloTexture = makeGlowTexture('rgba(255,240,210,0.9)', 'rgba(120,90,255,0)')

// ---------------------------------------------------------------------------
// Spiral arm star field
// ---------------------------------------------------------------------------
const STAR_COUNT = 9000
const ARMS = 4
const RADIUS = 90

const starGeo = new THREE.BufferGeometry()
const positions = new Float32Array(STAR_COUNT * 3)
const colors = new Float32Array(STAR_COUNT * 3)
const sizes = new Float32Array(STAR_COUNT)
const seeds = new Float32Array(STAR_COUNT) // per-star phase for twinkle

// Color palette running from hot blue-white core to warm reddish rim.
const cInner = new THREE.Color(0xfff3d0)
const cMid = new THREE.Color(0x8fb4ff)
const cOuter = new THREE.Color(0xff7bb0)

for (let i = 0; i < STAR_COUNT; i++) {
  // Bias toward the center for a dense bulge, sparse rim.
  const t = Math.pow(Math.random(), 0.55)
  const radius = t * RADIUS

  // Logarithmic spiral: angle grows with radius; snap into one of N arms.
  const arm = Math.floor(Math.random() * ARMS)
  const armAngle = (arm / ARMS) * TWO_PI
  const swirl = radius * 0.16
  // Scatter tightens near the core, loosens at the edges.
  const spread = 0.18 + 0.4 * t
  const scatter = (Math.random() - 0.5) * spread
  const angle = armAngle + swirl + scatter

  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius
  // Disk thickness: puffy bulge, thin rim.
  const y = (Math.random() - 0.5) * (10 * (1 - t) + 1.5)

  positions[i * 3] = x
  positions[i * 3 + 1] = y
  positions[i * 3 + 2] = z

  // Color by radius with a little jitter.
  const col = cInner.clone().lerp(cMid, Math.min(1, t * 1.6))
  if (t > 0.55) col.lerp(cOuter, (t - 0.55) / 0.45)
  col.offsetHSL((Math.random() - 0.5) * 0.04, 0, (Math.random() - 0.5) * 0.1)
  colors[i * 3] = col.r
  colors[i * 3 + 1] = col.g
  colors[i * 3 + 2] = col.b

  sizes[i] = 1.5 + Math.random() * 3.5 + (1 - t) * 2
  seeds[i] = Math.random() * TWO_PI
}

starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
starGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
starGeo.setAttribute('seed', new THREE.BufferAttribute(seeds, 1))

// Custom shader points: round, additive, size attenuated, twinkling.
const starMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uTex: { value: starTexture },
    uScale: { value: 1 },
  },
  vertexShader: /* glsl */ `
    attribute float size;
    attribute float seed;
    uniform float uTime;
    uniform float uScale;
    varying vec3 vColor;
    varying float vTwinkle;
    void main() {
      vColor = color;
      // Twinkle: per-star sine, never fully off.
      vTwinkle = 0.55 + 0.45 * sin(uTime * 2.2 + seed * 5.0);
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * uScale * (300.0 / -mv.z);
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D uTex;
    varying vec3 vColor;
    varying float vTwinkle;
    void main() {
      float a = texture2D(uTex, gl_PointCoord).a;
      gl_FragColor = vec4(vColor * vTwinkle, a * vTwinkle);
    }
  `,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  vertexColors: true,
})

const stars = new THREE.Points(starGeo, starMat)
galaxy.add(stars)

// ---------------------------------------------------------------------------
// Nebula mist — large, faint, slowly drifting additive sprites
// ---------------------------------------------------------------------------
const mistGroup = new THREE.Group()
const mistColors = [0x4422aa, 0xaa2266, 0x2266aa, 0x6633aa, 0xaa4466]
for (let i = 0; i < 26; i++) {
  const tex = makeGlowTexture('rgba(255,255,255,0.5)', 'rgba(255,255,255,0)')
  const mat = new THREE.SpriteMaterial({
    map: tex,
    color: mistColors[i % mistColors.length],
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0.16,
  })
  const s = new THREE.Sprite(mat)
  const r = 8 + Math.random() * RADIUS * 0.95
  const a = Math.random() * TWO_PI
  s.position.set(Math.cos(a) * r, (Math.random() - 0.5) * 8, Math.sin(a) * r)
  const scale = 30 + Math.random() * 55
  s.scale.set(scale, scale, 1)
  s.userData.spin = (Math.random() - 0.5) * 0.0006
  s.userData.angle = a
  s.userData.radius = r
  mistGroup.add(s)
}
galaxy.add(mistGroup)

// ---------------------------------------------------------------------------
// Central black hole: dark core + bright accretion-disk + lensing halo
// ---------------------------------------------------------------------------
const blackHole = new THREE.Group()
galaxy.add(blackHole)

// Pure-black event-horizon sphere (occludes what's behind it).
const coreMat = new THREE.MeshBasicMaterial({ color: 0x000000 })
const core = new THREE.Mesh(new THREE.SphereGeometry(6.5, 32, 32), coreMat)
blackHole.add(core)

// Glowing accretion disk — a thin ring with a fiery gradient texture.
function makeDiskTexture() {
  const w = 256
  const h = 32
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0.0, 'rgba(255,210,120,0)')
  g.addColorStop(0.5, 'rgba(255,230,180,1)')
  g.addColorStop(0.55, 'rgba(255,150,90,1)')
  g.addColorStop(1.0, 'rgba(120,40,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}
const diskMat = new THREE.MeshBasicMaterial({
  map: makeDiskTexture(),
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  side: THREE.DoubleSide,
})
const disk = new THREE.Mesh(new THREE.RingGeometry(7, 17, 96), diskMat)
disk.rotation.x = -Math.PI / 2
blackHole.add(disk)

// Bright lensing halo behind the core (additive sprite).
const haloMat = new THREE.SpriteMaterial({
  map: haloTexture,
  color: 0xfff0d0,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  opacity: 0.9,
})
const halo = new THREE.Sprite(haloMat)
halo.scale.set(42, 42, 1)
blackHole.add(halo)

// ===========================================================================
// SUPERNOVAE — expanding additive shell + bright flash, at random arm points
// ===========================================================================
const novaShellGeo = new THREE.SphereGeometry(1, 24, 24)
const supernovae = []

function pickArmPoint() {
  // Pick a random radius/arm to place an event somewhere in the disk.
  const t = Math.pow(Math.random(), 0.5)
  const radius = 18 + t * (RADIUS - 18)
  const arm = Math.floor(Math.random() * ARMS)
  const angle = (arm / ARMS) * TWO_PI + radius * 0.16 + (Math.random() - 0.5) * 0.5
  return new THREE.Vector3(
    Math.cos(angle) * radius,
    (Math.random() - 0.5) * 4,
    Math.sin(angle) * radius,
  )
}

function spawnSupernova() {
  const pos = pickArmPoint()
  const group = new THREE.Group()
  group.position.copy(pos)

  // Expanding shell.
  const shellMat = new THREE.MeshBasicMaterial({
    color: 0xaad6ff,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 1,
  })
  const shell = new THREE.Mesh(novaShellGeo, shellMat)
  group.add(shell)

  // Bright central flash sprite.
  const flash = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: starTexture,
      color: 0xffffff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  )
  flash.scale.set(20, 20, 1)
  group.add(flash)

  galaxy.add(group)
  supernovae.push({ group, shell, flash, life: 0, dur: 2.6 })
}

function updateSupernovae(dt) {
  for (let i = supernovae.length - 1; i >= 0; i--) {
    const sn = supernovae[i]
    sn.life += dt
    const k = sn.life / sn.dur
    if (k >= 1) {
      galaxy.remove(sn.group)
      sn.shell.material.dispose()
      sn.flash.material.dispose()
      supernovae.splice(i, 1)
      continue
    }
    // Shell expands and fades.
    const r = 1 + k * 28
    sn.shell.scale.setScalar(r)
    sn.shell.material.opacity = (1 - k) * 0.5
    // Flash: quick bloom then fade.
    const f = Math.max(0, 1 - k * 1.6)
    sn.flash.material.opacity = f
    sn.flash.scale.setScalar(8 + f * 34)
  }
}

// ===========================================================================
// PiP PLANET SCENE — a separate WebGL renderer in the corner panel
// ===========================================================================
const pipEl = document.getElementById('pip')
const pipCanvas = document.getElementById('pip-canvas')
const pipNameEl = document.getElementById('pip-name')
const pipTypeEl = document.getElementById('pip-type')
const connectorSvg = document.getElementById('connector')
const connectorLine = document.getElementById('connector-line')

const pipRenderer = new THREE.WebGLRenderer({
  canvas: pipCanvas,
  antialias: true,
  alpha: true,
})
pipRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
pipRenderer.setClearColor(0x000000, 0)

const pipScene = new THREE.Scene()
const pipCamera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
pipCamera.position.set(0, 0, 6)

// Lighting for the planet (a warm key + cool fill).
const keyLight = new THREE.DirectionalLight(0xfff0dd, 2.4)
keyLight.position.set(4, 2, 5)
pipScene.add(keyLight)
pipScene.add(new THREE.AmbientLight(0x335577, 0.35))

// A little starfield behind the planet for depth.
const pipStarsGeo = new THREE.BufferGeometry()
const pipStarPos = new Float32Array(220 * 3)
for (let i = 0; i < 220; i++) {
  pipStarPos[i * 3] = (Math.random() - 0.5) * 40
  pipStarPos[i * 3 + 1] = (Math.random() - 0.5) * 40
  pipStarPos[i * 3 + 2] = -10 - Math.random() * 25
}
pipStarsGeo.setAttribute('position', new THREE.BufferAttribute(pipStarPos, 3))
const pipStars = new THREE.Points(
  pipStarsGeo,
  new THREE.PointsMaterial({ color: 0x99aaff, size: 0.12, transparent: true, opacity: 0.8 }),
)
pipScene.add(pipStars)

// The currently displayed planet group (rebuilt each cycle).
let planetGroup = null

// --- Procedural planet texture generators ---------------------------------
function newCanvas(w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

function rocky() {
  // Cratered rocky/desert world.
  const c = newCanvas(256, 128)
  const ctx = c.getContext('2d')
  const base = `hsl(${20 + Math.random() * 30}, 45%, 45%)`
  ctx.fillStyle = base
  ctx.fillRect(0, 0, 256, 128)
  for (let i = 0; i < 600; i++) {
    const x = Math.random() * 256
    const y = Math.random() * 128
    const r = 1 + Math.random() * 4
    ctx.fillStyle = `hsla(${20 + Math.random() * 40}, 40%, ${25 + Math.random() * 35}%, 0.5)`
    ctx.beginPath()
    ctx.arc(x, y, r, 0, TWO_PI)
    ctx.fill()
  }
  return { map: c, name: 'Rocky World', rings: false, vol: false }
}

function gasGiant() {
  // Horizontal banded gas giant.
  const c = newCanvas(256, 128)
  const ctx = c.getContext('2d')
  const hue = Math.random() * 360
  let y = 0
  while (y < 128) {
    const h = 4 + Math.random() * 12
    const l = 35 + Math.random() * 40
    ctx.fillStyle = `hsl(${hue + (Math.random() - 0.5) * 50}, 55%, ${l}%)`
    ctx.fillRect(0, y, 256, h)
    y += h
  }
  // A great-spot storm.
  ctx.fillStyle = `hsla(${hue + 120}, 70%, 55%, 0.8)`
  ctx.beginPath()
  ctx.ellipse(180, 70, 22, 12, 0, 0, TWO_PI)
  ctx.fill()
  return { map: c, name: 'Gas Giant', rings: Math.random() < 0.5, vol: false }
}

function iceWorld() {
  // Pale icy world with cracks.
  const c = newCanvas(256, 128)
  const ctx = c.getContext('2d')
  ctx.fillStyle = `hsl(${190 + Math.random() * 30}, 35%, 82%)`
  ctx.fillRect(0, 0, 256, 128)
  ctx.strokeStyle = 'rgba(120,160,200,0.6)'
  ctx.lineWidth = 1
  for (let i = 0; i < 40; i++) {
    ctx.beginPath()
    ctx.moveTo(Math.random() * 256, Math.random() * 128)
    for (let j = 0; j < 4; j++) {
      ctx.lineTo(Math.random() * 256, Math.random() * 128)
    }
    ctx.stroke()
  }
  return { map: c, name: 'Ice World', rings: false, vol: false }
}

function volcanic() {
  // Dark crust with glowing lava veins.
  const c = newCanvas(256, 128)
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#2a1410'
  ctx.fillRect(0, 0, 256, 128)
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `hsla(${10 + Math.random() * 30}, 100%, 60%, 0.9)`
    const x = Math.random() * 256
    const y = Math.random() * 128
    const r = 2 + Math.random() * 5
    ctx.beginPath()
    ctx.arc(x, y, r, 0, TWO_PI)
    ctx.fill()
    // glow
    ctx.fillStyle = `hsla(${20}, 100%, 50%, 0.25)`
    ctx.beginPath()
    ctx.arc(x, y, r * 3, 0, TWO_PI)
    ctx.fill()
  }
  return { map: c, name: 'Volcanic World', rings: false, vol: true }
}

const PLANET_BUILDERS = [rocky, gasGiant, iceWorld, volcanic]
let planetIndex = 0

function buildPlanet() {
  // Tear down previous planet.
  if (planetGroup) {
    pipScene.remove(planetGroup)
    planetGroup.traverse((o) => {
      if (o.geometry) o.geometry.dispose()
      if (o.material) {
        if (o.material.map) o.material.map.dispose()
        o.material.dispose()
      }
    })
  }

  planetGroup = new THREE.Group()

  // Cycle deterministically through the planet types so all get shown.
  const spec = PLANET_BUILDERS[planetIndex % PLANET_BUILDERS.length]()
  planetIndex++

  const tex = new THREE.CanvasTexture(spec.map)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.RepeatWrapping

  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(1.6, 48, 48),
    new THREE.MeshStandardMaterial({
      map: tex,
      roughness: spec.vol ? 0.6 : 0.9,
      metalness: 0.05,
      // Volcanic worlds glow from their lava texture.
      emissive: spec.vol ? new THREE.Color(0xff4400) : new THREE.Color(0x000000),
      emissiveMap: spec.vol ? tex : null,
      emissiveIntensity: spec.vol ? 0.9 : 0,
    }),
  )
  planetGroup.add(planet)

  // Soft atmospheric rim glow.
  const atmo = new THREE.Mesh(
    new THREE.SphereGeometry(1.78, 32, 32),
    new THREE.MeshBasicMaterial({
      color: spec.vol ? 0xff6633 : 0x88bbff,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    }),
  )
  planetGroup.add(atmo)

  // Optional ring system.
  if (spec.rings) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(2.1, 3.1, 64),
      new THREE.MeshBasicMaterial({
        color: 0xd8c79a,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    )
    ring.rotation.x = Math.PI / 2.3
    planetGroup.add(ring)
    spec.name = 'Ringed ' + spec.name
  }

  // Optional moons (orbit in the animation loop).
  planetGroup.userData.moons = []
  const moonCount = Math.random() < 0.6 ? 1 + Math.floor(Math.random() * 2) : 0
  for (let i = 0; i < moonCount; i++) {
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(0.22 + Math.random() * 0.12, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xbfc6d4, roughness: 1 }),
    )
    const orbit = 2.4 + i * 0.7
    moon.userData = {
      orbit,
      speed: 0.6 + Math.random() * 0.8,
      phase: Math.random() * TWO_PI,
      tilt: (Math.random() - 0.5) * 0.8,
    }
    planetGroup.userData.moons.push(moon)
    planetGroup.add(moon)
  }

  planetGroup.rotation.z = (Math.random() - 0.5) * 0.5
  pipScene.add(planetGroup)

  // Update labels.
  pipNameEl.textContent = randomDesignation()
  pipTypeEl.textContent = spec.name
}

// Generate a star-catalog-style designation.
function randomDesignation() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const a = letters[Math.floor(Math.random() * 26)]
  const b = letters[Math.floor(Math.random() * 26)]
  return `${a}${b}-${100 + Math.floor(Math.random() * 8999)}`
}

// ---------------------------------------------------------------------------
// PiP lifecycle: pick a galaxy point, show panel, draw connector, then hide.
// ---------------------------------------------------------------------------
let pipState = 'idle' // idle | showing
let pipTimer = 3 // seconds until first appearance (early, for the screenshot)
let pipVisibleTime = 0
const pipTargetWorld = new THREE.Vector3() // the highlighted point in the galaxy
const pipTargetLocal = new THREE.Vector3() // its position inside the galaxy group

function showPiP() {
  buildPlanet()
  // Choose a highlighted star location somewhere in the arms.
  pipTargetLocal.copy(pickArmPoint())
  pipEl.classList.add('show')
  connectorLine.classList.add('show')
  pipState = 'showing'
  pipVisibleTime = 0
}

function hidePiP() {
  pipEl.classList.remove('show')
  connectorLine.classList.remove('show')
  pipState = 'idle'
  // Brief gap before the next highlight so the tour cycles through all the
  // planet types reasonably quickly.
  pipTimer = 3 + Math.random() * 2
}

function updateConnector() {
  // Project the highlighted galaxy point to screen space and draw a line
  // from the PiP panel's top-left corner to it.
  pipTargetWorld.copy(pipTargetLocal)
  galaxy.localToWorld(pipTargetWorld)
  const p = pipTargetWorld.clone().project(camera)
  const sx = (p.x * 0.5 + 0.5) * window.innerWidth
  const sy = (-p.y * 0.5 + 0.5) * window.innerHeight

  const rect = pipEl.getBoundingClientRect()
  const px = rect.left + 8
  const py = rect.top + 8

  connectorLine.setAttribute('x1', px)
  connectorLine.setAttribute('y1', py)
  connectorLine.setAttribute('x2', sx)
  connectorLine.setAttribute('y2', sy)
}

// ===========================================================================
// RESIZE
// ===========================================================================
function resize() {
  const w = window.innerWidth
  const h = window.innerHeight
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  camera.updateProjectionMatrix()

  const ps = pipCanvas.clientWidth || 220
  pipRenderer.setSize(ps, ps, false)
  pipCamera.aspect = 1
  pipCamera.updateProjectionMatrix()

  connectorSvg.setAttribute('width', w)
  connectorSvg.setAttribute('height', h)
}
window.addEventListener('resize', resize)
resize()

// ===========================================================================
// ANIMATION LOOP
// ===========================================================================
const clock = new THREE.Clock()
let novaTimer = 3 // first supernova fairly soon

function animate() {
  requestAnimationFrame(animate)
  const dt = Math.min(clock.getDelta(), 0.05)
  const t = clock.elapsedTime

  // Slow galaxy rotation.
  galaxy.rotation.y += dt * 0.05
  starMat.uniforms.uTime.value = t

  // Drift the nebula mist along its orbit + gentle spin.
  mistGroup.children.forEach((s) => {
    s.userData.angle += dt * 0.02
    const r = s.userData.radius
    s.position.x = Math.cos(s.userData.angle) * r
    s.position.z = Math.sin(s.userData.angle) * r
    s.material.rotation += s.userData.spin
  })

  // Black hole: spin the accretion disk, pulse the lensing halo.
  disk.rotation.z += dt * 0.5
  halo.material.opacity = 0.75 + Math.sin(t * 1.5) * 0.15

  // Supernovae.
  novaTimer -= dt
  if (novaTimer <= 0) {
    spawnSupernova()
    novaTimer = 5 + Math.random() * 7
  }
  updateSupernovae(dt)

  // PiP lifecycle.
  pipTimer -= dt
  if (pipState === 'idle' && pipTimer <= 0) {
    showPiP()
  } else if (pipState === 'showing') {
    pipVisibleTime += dt
    if (pipVisibleTime > 7) hidePiP()
  }

  // Animate + render the PiP planet whenever the panel is visible.
  if (pipState === 'showing' && planetGroup) {
    planetGroup.rotation.y += dt * 0.4
    planetGroup.userData.moons.forEach((m) => {
      const o = m.userData
      o.phase += dt * o.speed
      m.position.set(
        Math.cos(o.phase) * o.orbit,
        Math.sin(o.phase) * o.orbit * o.tilt,
        Math.sin(o.phase) * o.orbit,
      )
    })
    pipRenderer.render(pipScene, pipCamera)
    updateConnector()
  }

  renderer.render(scene, camera)
}

animate()
