import * as THREE from 'three'

// ───────────────────────────────────────────────────────────────────────────
// Onsen Winter — a low-poly miniature diorama of a Japanese hot-spring ryokan
// in the snow. Steam rises from the pools and catches warm lantern light at
// night; snow falls; a gentle day/night cycle shifts sky, sun/moon and ambient
// light while the camera slowly orbits the toy-sized scene.
// ───────────────────────────────────────────────────────────────────────────

const canvas = document.getElementById('scene')
const phaseEl = document.getElementById('phase')
const timeEl = document.getElementById('time')

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setClearColor(0x0a0e1a)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const scene = new THREE.Scene()
scene.fog = new THREE.Fog(0x10182c, 14, 38)

const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)

// Group everything so we keep things tidy and at "miniature" scale.
const world = new THREE.Group()
scene.add(world)

// ── Lighting ────────────────────────────────────────────────────────────────
// Hemisphere = soft sky/ground bounce, sun/moon = key directional light.
const hemi = new THREE.HemisphereLight(0xbcd4ff, 0x2a2620, 0.5)
scene.add(hemi)

const sun = new THREE.DirectionalLight(0xffffff, 1.0)
sun.castShadow = true
sun.shadow.mapSize.set(1024, 1024)
sun.shadow.camera.near = 1
sun.shadow.camera.far = 40
sun.shadow.camera.left = -12
sun.shadow.camera.right = 12
sun.shadow.camera.top = 12
sun.shadow.camera.bottom = -12
scene.add(sun)
scene.add(sun.target)

// Warm point lights placed at lanterns/windows — these are what tint the steam
// at night. We track their world positions + colors to drive the steam shader.
const warmLights = []
function addWarmLight(x, y, z, color, intensity, distance) {
  const l = new THREE.PointLight(color, intensity, distance, 2)
  l.position.set(x, y, z)
  world.add(l)
  warmLights.push(l)
  return l
}

// ── Shared materials (reused across many meshes for performance) ─────────────
const mat = {
  snow: new THREE.MeshStandardMaterial({ color: 0xeef3fb, roughness: 0.95 }),
  ice: new THREE.MeshStandardMaterial({ color: 0xbfe0ec, roughness: 0.4, metalness: 0.1 }),
  water: new THREE.MeshStandardMaterial({
    color: 0x2e6f78, roughness: 0.25, metalness: 0.2,
    transparent: true, opacity: 0.9, emissive: 0x123034, emissiveIntensity: 0.4,
  }),
  wood: new THREE.MeshStandardMaterial({ color: 0x5a3a28, roughness: 0.8 }),
  darkWood: new THREE.MeshStandardMaterial({ color: 0x3a2418, roughness: 0.85 }),
  roof: new THREE.MeshStandardMaterial({ color: 0x39424f, roughness: 0.7 }),
  roofSnow: new THREE.MeshStandardMaterial({ color: 0xe8eef6, roughness: 0.9 }),
  plaster: new THREE.MeshStandardMaterial({ color: 0xd9cdb5, roughness: 0.9 }),
  window: new THREE.MeshStandardMaterial({
    color: 0xffd28a, emissive: 0xffb24d, emissiveIntensity: 1.2, roughness: 0.5,
  }),
  lantern: new THREE.MeshStandardMaterial({
    color: 0xff7a3c, emissive: 0xff6a2a, emissiveIntensity: 1.6, roughness: 0.6,
  }),
  pine: new THREE.MeshStandardMaterial({ color: 0x234634, roughness: 0.9 }),
  pineSnow: new THREE.MeshStandardMaterial({ color: 0xdfe8f2, roughness: 0.95 }),
  rock: new THREE.MeshStandardMaterial({ color: 0x55595f, roughness: 0.95 }),
  trunk: new THREE.MeshStandardMaterial({ color: 0x402a1d, roughness: 0.9 }),
}

// ── Shared geometries ────────────────────────────────────────────────────────
const geo = {
  box: new THREE.BoxGeometry(1, 1, 1),
  cone: new THREE.ConeGeometry(1, 1, 6),
  cyl: new THREE.CylinderGeometry(1, 1, 1, 10),
  ico: new THREE.IcosahedronGeometry(1, 0),
}

function mesh(geometry, material, x, y, z) {
  const m = new THREE.Mesh(geometry, material)
  m.position.set(x, y, z)
  m.castShadow = true
  m.receiveShadow = true
  return m
}

// ── Ground: snowy island base ────────────────────────────────────────────────
const base = mesh(geo.cyl, mat.snow, 0, -0.5, 0)
base.scale.set(13, 1, 13)
base.receiveShadow = true
base.castShadow = false
world.add(base)

// ── River: a band of dark water cutting across the diorama ────────────────────
const river = mesh(geo.box, mat.water, 0, 0.02, 6.5)
river.scale.set(26, 0.1, 4.2)
river.rotation.y = 0.18
river.castShadow = false
world.add(river)

// Snowy banks framing the river
const bank1 = mesh(geo.box, mat.snow, 0, 0.18, 4.0)
bank1.scale.set(26, 0.5, 1.4)
bank1.rotation.y = 0.18
world.add(bank1)
const bank2 = mesh(geo.box, mat.snow, 0, 0.18, 9.0)
bank2.scale.set(26, 0.5, 1.4)
bank2.rotation.y = 0.18
world.add(bank2)

// ── Arched bridge over the river ─────────────────────────────────────────────
function buildBridge() {
  const g = new THREE.Group()
  const seg = 7
  for (let i = 0; i < seg; i++) {
    const t = (i / (seg - 1) - 0.5) * 2 // -1..1
    const plank = mesh(geo.box, mat.darkWood, t * 2.4, 0.9 - t * t * 0.9, 0)
    plank.scale.set(0.6, 0.18, 1.6)
    g.add(plank)
  }
  // railings
  for (const side of [-0.8, 0.8]) {
    for (let i = 0; i < seg; i++) {
      const t = (i / (seg - 1) - 0.5) * 2
      const post = mesh(geo.box, mat.wood, t * 2.4, 1.25 - t * t * 0.9, side)
      post.scale.set(0.1, 0.5, 0.1)
      g.add(post)
    }
  }
  // The deck spans the group's local X. The river runs along world X, so turn
  // the bridge a quarter turn to lay it ACROSS the water (bank to bank), then
  // add the river's own 0.18 skew so it lines up with the banks.
  g.position.set(0, 0, 6.5)
  g.rotation.y = 0.18 + Math.PI / 2
  g.scale.setScalar(0.9)
  return g
}
world.add(buildBridge())

// ── Ryokan bathhouse building ────────────────────────────────────────────────
function buildRyokan() {
  const g = new THREE.Group()

  // main body
  const body = mesh(geo.box, mat.plaster, 0, 1.1, 0)
  body.scale.set(5.2, 2.2, 3.4)
  g.add(body)

  // wooden base trim
  const trim = mesh(geo.box, mat.darkWood, 0, 0.25, 0)
  trim.scale.set(5.4, 0.5, 3.6)
  g.add(trim)

  // curved-feel roof: wide low pyramid + upturned eaves via stacked boxes
  const roof = mesh(geo.cone, mat.roof, 0, 3.0, 0)
  roof.rotation.y = Math.PI / 4
  roof.scale.set(4.6, 1.6, 3.4)
  g.add(roof)
  // snow cap on the roof
  const roofSnow = mesh(geo.cone, mat.roofSnow, 0, 3.18, 0)
  roofSnow.rotation.y = Math.PI / 4
  roofSnow.scale.set(4.2, 1.3, 3.1)
  roofSnow.castShadow = false
  g.add(roofSnow)
  // upturned eave ridge
  const eave = mesh(geo.box, mat.darkWood, 0, 2.25, 0)
  eave.scale.set(5.8, 0.18, 4.0)
  g.add(eave)

  // glowing windows along the front (facing +z toward camera path)
  const winY = [0.9, 1.6]
  const winX = [-1.6, -0.55, 0.55, 1.6]
  for (const y of winY) {
    for (const x of winX) {
      const w = mesh(geo.box, mat.window, x, y, 1.72)
      w.scale.set(0.6, 0.5, 0.08)
      w.castShadow = false
      g.add(w)
    }
  }
  // soft interior glow light from the windows
  addWarmLightLocal(g, 0, 1.3, 2.6, 0xffb24d, 2.2, 9)

  // hanging lanterns at the entrance corners
  for (const x of [-2.4, 2.4]) {
    const lant = mesh(geo.cyl, mat.lantern, x, 1.5, 2.0)
    lant.scale.set(0.22, 0.42, 0.22)
    lant.castShadow = false
    g.add(lant)
    const cap = mesh(geo.box, mat.darkWood, x, 1.78, 2.0)
    cap.scale.set(0.3, 0.08, 0.3)
    g.add(cap)
    addWarmLightLocal(g, x, 1.5, 2.2, 0xff7a30, 1.6, 6)
  }

  g.position.set(-1.5, 0, -2.5)
  g.rotation.y = 0.12
  return g
}

// helper to add a warm light expressed in the building's local space but
// registered with world-space tracking (we read its world position each frame)
function addWarmLightLocal(parentGroup, x, y, z, color, intensity, distance) {
  const l = new THREE.PointLight(color, intensity, distance, 2)
  l.position.set(x, y, z)
  parentGroup.add(l)
  warmLights.push(l)
  return l
}
world.add(buildRyokan())

// ── Hot-spring pools (steam sources) ─────────────────────────────────────────
// Each pool: a rocky rim ring + glowing water disc. Returns its world center.
const steamSources = []
function buildPool(x, z, radius) {
  const g = new THREE.Group()
  // water surface
  const w = mesh(geo.cyl, mat.water, 0, 0.12, 0)
  w.scale.set(radius, 0.12, radius)
  w.castShadow = false
  g.add(w)
  // rock rim
  const rocks = 9
  for (let i = 0; i < rocks; i++) {
    const a = (i / rocks) * Math.PI * 2
    const rr = radius * 1.02
    const r = mesh(geo.ico, mat.rock, Math.cos(a) * rr, 0.1, Math.sin(a) * rr)
    r.scale.setScalar(0.22 + (i % 3) * 0.07)
    g.add(r)
  }
  // faint warm light from the steaming water itself (subtle teal-warm)
  addWarmLightLocal(g, 0, 0.4, 0, 0x6fd0c8, 0.5, radius * 4)
  g.position.set(x, 0, z)
  world.add(g)
  steamSources.push(new THREE.Vector3(x, 0.2, z))
  return g
}
buildPool(2.6, -1.0, 1.2)
buildPool(4.4, 0.6, 0.9)
buildPool(1.4, 1.4, 0.8)
// the river also gently steams
steamSources.push(new THREE.Vector3(-3, 0.2, 6.4))
steamSources.push(new THREE.Vector3(3, 0.2, 6.7))

// ── Pine trees with snow ─────────────────────────────────────────────────────
function buildPine(x, z, scale) {
  const g = new THREE.Group()
  const trunk = mesh(geo.cyl, mat.trunk, 0, 0.4, 0)
  trunk.scale.set(0.12, 0.8, 0.12)
  g.add(trunk)
  for (let i = 0; i < 3; i++) {
    const y = 0.8 + i * 0.55
    const s = 0.95 - i * 0.26
    const tier = mesh(geo.cone, mat.pine, 0, y, 0)
    tier.scale.set(s, 0.7, s)
    g.add(tier)
    const snowTier = mesh(geo.cone, mat.pineSnow, 0, y + 0.12, 0)
    snowTier.scale.set(s * 0.82, 0.4, s * 0.82)
    snowTier.castShadow = false
    g.add(snowTier)
  }
  g.position.set(x, 0, z)
  g.scale.setScalar(scale)
  world.add(g)
}
buildPine(-5.5, -4.5, 1.3)
buildPine(-7.0, -1.5, 1.0)
buildPine(5.8, -5.5, 1.15)
buildPine(7.2, -2.0, 0.9)
buildPine(-6.5, 9.5, 1.0)
buildPine(6.0, 10.0, 1.1)

// scattered rocks on the banks
for (let i = 0; i < 8; i++) {
  const a = Math.random() * Math.PI * 2
  const r = 7 + Math.random() * 3
  const rk = mesh(geo.ico, mat.rock, Math.cos(a) * r, 0.1, Math.sin(a) * r)
  rk.scale.setScalar(0.2 + Math.random() * 0.3)
  world.add(rk)
}

// ── Sun / moon billboards in the sky ─────────────────────────────────────────
const sunDisc = new THREE.Mesh(
  new THREE.CircleGeometry(2.2, 24),
  new THREE.MeshBasicMaterial({ color: 0xffe9b0, transparent: true, fog: false }),
)
scene.add(sunDisc)
const moonDisc = new THREE.Mesh(
  new THREE.CircleGeometry(1.4, 24),
  new THREE.MeshBasicMaterial({ color: 0xdfe8ff, transparent: true, fog: false }),
)
scene.add(moonDisc)

// ── Stars (visible at night) ─────────────────────────────────────────────────
const starCount = 220
const starPos = new Float32Array(starCount * 3)
for (let i = 0; i < starCount; i++) {
  // place on a dome above the scene
  const a = Math.random() * Math.PI * 2
  const e = Math.random() * Math.PI * 0.45
  const r = 60
  starPos[i * 3] = Math.cos(a) * Math.cos(e) * r
  starPos[i * 3 + 1] = Math.sin(e) * r + 6
  starPos[i * 3 + 2] = Math.sin(a) * Math.cos(e) * r
}
const starGeo = new THREE.BufferGeometry()
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
const starMat = new THREE.PointsMaterial({
  color: 0xffffff, size: 0.35, transparent: true, opacity: 0, fog: false,
  sizeAttenuation: true,
})
const stars = new THREE.Points(starGeo, starMat)
scene.add(stars)

// ── Steam (custom shader so it tints to warm lantern light) ──────────────────
// Lots of big, very faint, soft-edged puffs that overlap into a continuous
// wispy mass — rather than a few crisp dots. They rise, billow outward into a
// widening plume, and fade in at birth / out near the top.
const STEAM = 1300
const STEAM_RISE = 3.8                          // life height of a puff
const steamPos = new Float32Array(STEAM * 3)
const steamSeed = new Float32Array(STEAM)      // per-particle random phase
const steamSrc = new Float32Array(STEAM * 3)   // origin of each particle

for (let i = 0; i < STEAM; i++) {
  const s = steamSources[i % steamSources.length]
  const jx = (Math.random() - 0.5) * 1.3
  const jz = (Math.random() - 0.5) * 1.3
  steamSrc[i * 3] = s.x + jx
  steamSrc[i * 3 + 1] = s.y
  steamSrc[i * 3 + 2] = s.z + jz
  steamPos[i * 3] = steamSrc[i * 3]
  steamPos[i * 3 + 1] = s.y + Math.random() * STEAM_RISE
  steamPos[i * 3 + 2] = steamSrc[i * 3 + 2]
  steamSeed[i] = Math.random()
}
const steamGeo = new THREE.BufferGeometry()
steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPos, 3))
steamGeo.setAttribute('seed', new THREE.BufferAttribute(steamSeed, 1))

// We pass the warm lights (positions + colors) as uniforms so the vertex shader
// can brighten/tint particles near lanterns and windows.
const MAX_LIGHTS = 12
const lightPosArr = new Float32Array(MAX_LIGHTS * 3)
const lightColArr = new Float32Array(MAX_LIGHTS * 3)

const steamMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uSize: { value: 135 },
    uNight: { value: 0 },            // 0 day → 1 night (controls warm pickup)
    uLightPos: { value: lightPosArr },
    uLightCol: { value: lightColArr },
    uLightCount: { value: 0 },
  },
  transparent: true,
  depthWrite: false,
  blending: THREE.NormalBlending,
  vertexShader: /* glsl */ `
    attribute float seed;
    uniform float uTime;
    uniform float uSize;
    uniform float uNight;
    uniform vec3 uLightPos[${MAX_LIGHTS}];
    uniform vec3 uLightCol[${MAX_LIGHTS}];
    uniform int uLightCount;
    varying float vAlpha;
    varying vec3 vTint;
    void main() {
      vec3 p = position;
      // accumulate warm light from nearby lantern/window sources
      vec3 warm = vec3(0.0);
      for (int i = 0; i < ${MAX_LIGHTS}; i++) {
        if (i >= uLightCount) break;
        float d = distance(p, uLightPos[i]);
        float falloff = 1.0 / (1.0 + d * d * 0.18);
        warm += uLightCol[i] * falloff;
      }
      // base steam is cool white; at night it picks up the warm color
      vec3 cool = vec3(0.85, 0.9, 1.0);
      vTint = mix(cool, cool + warm * 2.2, uNight);
      // life encoded by height above the source (~0.2). Fade IN at birth and
      // OUT near the top so puffs are wispy at both ends, and grow as they rise.
      float life = clamp((p.y - 0.2) / ${STEAM_RISE.toFixed(1)}, 0.0, 1.0);
      float fade = smoothstep(0.0, 0.18, life) * (1.0 - smoothstep(0.45, 1.0, life));
      vAlpha = fade * 0.16;
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_PointSize = uSize * (0.4 + life * 2.6) / -mv.z;
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragmentShader: /* glsl */ `
    varying float vAlpha;
    varying vec3 vTint;
    void main() {
      // very soft round puff — squared falloff kills the hard rim so overlapping
      // puffs read as a continuous cloud instead of distinct dots
      float r = length(gl_PointCoord - 0.5);
      float a = smoothstep(0.5, 0.0, r);
      a = a * a * vAlpha;
      gl_FragColor = vec4(vTint, a);
    }
  `,
})
const steam = new THREE.Points(steamGeo, steamMat)
steam.position.copy(world.position)
world.add(steam)

// ── Snow particles ───────────────────────────────────────────────────────────
const SNOW = 1400
const snowPos = new Float32Array(SNOW * 3)
const snowSeed = new Float32Array(SNOW)
const SNOW_AREA = 28
const SNOW_TOP = 16
for (let i = 0; i < SNOW; i++) {
  snowPos[i * 3] = (Math.random() - 0.5) * SNOW_AREA
  snowPos[i * 3 + 1] = Math.random() * SNOW_TOP
  snowPos[i * 3 + 2] = (Math.random() - 0.5) * SNOW_AREA
  snowSeed[i] = Math.random() * 6.28
}
const snowGeo = new THREE.BufferGeometry()
snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3))
const snowMat = new THREE.PointsMaterial({
  color: 0xffffff, size: 0.12, transparent: true, opacity: 0.9,
  depthWrite: false, fog: true, sizeAttenuation: true,
})
const snow = new THREE.Points(snowGeo, snowMat)
world.add(snow)

// ── Sky colors for the day/night cycle ───────────────────────────────────────
const sky = {
  night: new THREE.Color(0x0a0e1a),
  dawn: new THREE.Color(0x6a4a6a),
  day: new THREE.Color(0x9fc4e8),
  dusk: new THREE.Color(0x9a5a44),
}
const fogCol = scene.fog.color
const _c = new THREE.Color()

// blend across the four phases by cycle position 0..1
function skyColorAt(t, out) {
  // t: 0=midnight, 0.25=dawn, 0.5=noon, 0.75=dusk
  if (t < 0.25) out.copy(sky.night).lerp(sky.dawn, t / 0.25)
  else if (t < 0.5) out.copy(sky.dawn).lerp(sky.day, (t - 0.25) / 0.25)
  else if (t < 0.75) out.copy(sky.day).lerp(sky.dusk, (t - 0.5) / 0.25)
  else out.copy(sky.dusk).lerp(sky.night, (t - 0.75) / 0.25)
  return out
}

// ── Day/night state ──────────────────────────────────────────────────────────
const DAY_LENGTH = 48 // seconds for a full cycle
// Start near dusk so the first frame (and screenshot) shows lit steam.
const CYCLE_START = 0.78
let cycle = CYCLE_START

const tmpVec = new THREE.Vector3()

// Drive the cycle from wall-clock elapsed time rather than accumulating capped
// per-frame deltas. (Capping dt keeps particles from jumping on a stutter, but
// if we also fed that capped dt into the cycle a low/headless frame rate would
// stretch the "48s" day to many minutes and never reach daytime.) Using real
// elapsed time guarantees a true 48s day/night cycle at any frame rate.
function updateDayNight(t) {
  cycle = (CYCLE_START + t / DAY_LENGTH) % 1

  // sun angle: sunrise at t=0.25, sunset at t=0.75
  const sunAngle = (cycle - 0.25) * Math.PI * 2
  const sx = Math.cos(sunAngle)
  const sy = Math.sin(sunAngle)
  const dayAmt = THREE.MathUtils.clamp(sy, 0, 1)        // 0 night → 1 noon
  const night = 1 - THREE.MathUtils.clamp(sy * 2 + 0.2, 0, 1)

  // position the directional light from sun (day) or moon (night)
  if (sy > -0.05) {
    sun.position.set(sx * 18, Math.max(sy, 0.05) * 16 + 2, 8)
    sun.color.setHSL(0.09 + dayAmt * 0.02, 0.5 - dayAmt * 0.2, 0.5 + dayAmt * 0.3)
    sun.intensity = 0.3 + dayAmt * 1.1
  } else {
    // moonlight: from the opposite side, cool + dim
    sun.position.set(-sx * 18, -sy * 14 + 2, 8)
    sun.color.set(0x9db4e8)
    sun.intensity = 0.25
  }
  sun.target.position.set(0, 0, 0)

  // hemisphere/ambient shifts cool at night, neutral by day
  hemi.intensity = 0.18 + dayAmt * 0.55
  hemi.color.setHSL(0.6, 0.4, 0.4 + dayAmt * 0.4)

  // sky + fog color
  skyColorAt(cycle, _c)
  renderer.setClearColor(_c)
  fogCol.copy(_c).multiplyScalar(0.9)

  // sun/moon discs follow their light directions, billboarded to camera
  sunDisc.position.set(sx * 40, sy * 34 + 4, 12)
  sunDisc.visible = sy > -0.15
  sunDisc.material.opacity = THREE.MathUtils.clamp(sy * 3, 0, 1)
  sunDisc.lookAt(camera.position)

  moonDisc.position.set(-sx * 40, -sy * 30 + 6, 12)
  moonDisc.visible = sy < 0.15
  moonDisc.material.opacity = THREE.MathUtils.clamp(-sy * 3, 0, 1)
  moonDisc.lookAt(camera.position)

  // stars fade in at night
  starMat.opacity = night * 0.9

  // emissive windows/lanterns glow stronger at night, dimmer by day
  mat.window.emissiveIntensity = 0.4 + night * 1.4
  mat.lantern.emissiveIntensity = 0.6 + night * 1.6
  // warm point lights dim by day, full at night (base stored at startup)
  for (const l of warmLights) l.intensity = l.userData.base * (0.15 + night)

  // steam shader night factor (warm pickup)
  steamMat.uniforms.uNight.value = night

  // HUD readout
  const hour = Math.floor(cycle * 24)
  const minute = Math.floor((cycle * 24 - hour) * 60)
  timeEl.textContent =
    String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0')
  let phase = 'night'
  if (cycle >= 0.2 && cycle < 0.33) phase = 'dawn'
  else if (cycle >= 0.33 && cycle < 0.7) phase = 'day'
  else if (cycle >= 0.7 && cycle < 0.85) phase = 'dusk'
  phaseEl.textContent = phase
}

// store base intensities so night-scaling above is stable
for (const l of warmLights) l.userData.base = l.intensity

// ── Update steam light uniforms from the tracked warm lights each frame ───────
function updateSteamLights() {
  const n = Math.min(warmLights.length, MAX_LIGHTS)
  for (let i = 0; i < n; i++) {
    warmLights[i].getWorldPosition(tmpVec)
    lightPosArr[i * 3] = tmpVec.x
    lightPosArr[i * 3 + 1] = tmpVec.y
    lightPosArr[i * 3 + 2] = tmpVec.z
    const c = warmLights[i].color
    // scale color contribution by current intensity so day steam stays cool
    const k = warmLights[i].intensity * 0.5
    lightColArr[i * 3] = c.r * k
    lightColArr[i * 3 + 1] = c.g * k
    lightColArr[i * 3 + 2] = c.b * k
  }
  steamMat.uniforms.uLightCount.value = n
  steamMat.uniforms.uLightPos.value = lightPosArr
  steamMat.uniforms.uLightCol.value = lightColArr
  steamMat.uniforms.uLightPos.needsUpdate = true
  steamMat.uniforms.uLightCol.needsUpdate = true
}

// ── Particle animation ───────────────────────────────────────────────────────
function updateSteam(dt, t) {
  const pos = steamGeo.attributes.position.array
  for (let i = 0; i < STEAM; i++) {
    const ix = i * 3
    const iy = ix + 1
    const iz = ix + 2
    pos[iy] += dt * (0.3 + steamSeed[i] * 0.28) // slow, lazy rise
    if (pos[iy] - steamSrc[iy] > STEAM_RISE) pos[iy] = steamSrc[iy] // respawn
    // billow outward into a widening plume + a slow curl, both growing with height
    const h = pos[iy] - steamSrc[iy]
    const ang = steamSeed[i] * 6.2832
    const spread = 0.15 + h * 0.26
    const curlX = Math.sin(t * 0.4 + steamSeed[i] * 6.28 + h)
    const curlZ = Math.cos(t * 0.33 + steamSeed[i] * 6.28 + h)
    pos[ix] = steamSrc[ix] + Math.cos(ang) * spread + curlX * h * 0.12
    pos[iz] = steamSrc[iz] + Math.sin(ang) * spread + curlZ * h * 0.12
  }
  steamGeo.attributes.position.needsUpdate = true
}

function updateSnow(dt, t) {
  const pos = snowGeo.attributes.position.array
  for (let i = 0; i < SNOW; i++) {
    const iy = i * 3 + 1
    pos[iy] -= dt * (0.8 + (i % 5) * 0.15)         // fall
    pos[i * 3] += Math.sin(t + snowSeed[i]) * 0.006 // drift
    if (pos[iy] < 0) {
      pos[iy] = SNOW_TOP
      pos[i * 3] = (Math.random() - 0.5) * SNOW_AREA
      pos[i * 3 + 2] = (Math.random() - 0.5) * SNOW_AREA
    }
  }
  snowGeo.attributes.position.needsUpdate = true
}

// ── Camera: slow gentle orbit, slightly tilted down (diorama view) ───────────
function updateCamera(t) {
  const radius = 17
  const a = t * 0.06
  camera.position.set(
    Math.sin(a) * radius,
    8.5 + Math.sin(t * 0.13) * 0.8,
    Math.cos(a) * radius + 2,
  )
  camera.lookAt(0, 1.5, 1)
}

// ── Resize ───────────────────────────────────────────────────────────────────
function resize() {
  const w = window.innerWidth
  const h = window.innerHeight
  renderer.setSize(w, h, false)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}
window.addEventListener('resize', resize)
resize()

// ── Main loop ────────────────────────────────────────────────────────────────
const clock = new THREE.Clock()
function animate() {
  requestAnimationFrame(animate)
  const dt = Math.min(clock.getDelta(), 0.05)
  const t = clock.elapsedTime

  updateDayNight(t)
  updateCamera(t)
  updateSteamLights()
  updateSteam(dt, t)
  updateSnow(dt, t)
  steamMat.uniforms.uTime.value = t

  renderer.render(scene, camera)
}
animate()
