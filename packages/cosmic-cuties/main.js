import * as THREE from 'three'
import { Face, makeFaceMesh } from './faces.js'
import {
  toonRamp,
  planetTexture,
  sunTexture,
  glowTexture,
  ringTexture,
  flameTexture,
  bubbleTexture,
  starfield,
  nebulaSky,
  orbitLine,
  outline,
} from './art.js'

/* =========================================================================
 * Cosmic Cuties
 * A storybook solar system. Every planet has a face and a temperament, a
 * nosy UFO tours the neighbourhood, and Bonk — a meteor with a grin — spends
 * his day pretending to flatten planets and swerving away at the last second.
 * ========================================================================= */

const TAU = Math.PI * 2
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

// ---------------------------------------------------------------------------
// The cast
// ---------------------------------------------------------------------------

const PLANETS = [
  { name: 'Pip', radius: 0.5, orbit: 6.0, speed: 0.55, incl: 0.1, pattern: 'craters', color: 0xc0aee2, accent: 0x8f79bd, mood: 'surprise' },
  { name: 'Bloom', radius: 0.8, orbit: 8.6, speed: 0.4, incl: 0.05, pattern: 'swirl', color: 0xffb27a, accent: 0xff8f5c, mood: 'love' },
  { name: 'Terra', radius: 0.95, orbit: 11.4, speed: 0.33, incl: 0.12, pattern: 'continents', color: 0x62c4ff, accent: 0x74d98d, mood: 'happy', moon: true },
  { name: 'Rusty', radius: 0.7, orbit: 14.4, speed: 0.27, incl: 0.08, pattern: 'craters', color: 0xff7f5c, accent: 0xc94f3c, mood: 'hmph' },
  { name: 'Jumbo', radius: 1.7, orbit: 18.2, speed: 0.19, incl: 0.03, pattern: 'bands', color: 0xffd489, accent: 0xdd9a55, mood: 'laugh' },
  { name: 'Ringo', radius: 1.3, orbit: 22.4, speed: 0.15, incl: 0.14, pattern: 'bands', color: 0xf6e3a1, accent: 0xd0b070, mood: 'smug', rings: true },
  { name: 'Chilly', radius: 1.0, orbit: 26.0, speed: 0.11, incl: 0.09, pattern: 'swirl', color: 0x86e6e0, accent: 0x4fb2c2, mood: 'sleepy' },
]

const IDLE_MOODS = ['content', 'happy', 'laugh', 'love', 'smug', 'surprise', 'cool']
const POKE_LINES = ['hi!!', 'hehe!', 'boop!', 'howdy!', 'eee!', 'that tickles']
const SCARE_LINES = ['eeeek!', 'aaah!', 'not again!', 'oh no oh no', 'mercy!']
const HUFF_LINES = ['RUDE!', 'hmph!', 'not funny!', 'every time...', 'go away Bonk']
const TEASE_LINES = ['psych!', 'gotcha!', 'just kidding!!', 'nyeh heh heh', 'too slow!']
const UFO_LINES = ['beep boop', 'hi there!', 'nice planet!', 'blorp!', 'just visiting']

// ---------------------------------------------------------------------------
// Renderer, scene, camera
// ---------------------------------------------------------------------------

const canvas = document.querySelector('#scene')
const statusEl = document.querySelector('#status')

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.setSize(innerWidth, innerHeight)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x140c29)

const camera = new THREE.PerspectiveCamera(46, innerWidth / innerHeight, 0.5, 900)

const ramp = toonRamp()

scene.add(nebulaSky())
scene.add(starfield())

scene.add(new THREE.AmbientLight(0xb9a6ff, 1.15))
const sunLight = new THREE.PointLight(0xffd9a0, 260, 300, 1.6)
scene.add(sunLight)
const fill = new THREE.DirectionalLight(0xa9c8ff, 0.7)
fill.position.set(-1, 1.4, 2)
scene.add(fill)

// ---------------------------------------------------------------------------
// Builders
// ---------------------------------------------------------------------------

const pickables = []

/** A body is a position-only group (so its face can billboard) + a spinning mesh. */
function makeBody({ radius, material, faceSize = 256, expression = 'content', faceScale = 1.5 }) {
  const group = new THREE.Group()
  const geo = new THREE.SphereGeometry(radius, 42, 32)
  const mesh = new THREE.Mesh(geo, material)
  mesh.add(outline(geo))
  group.add(mesh)

  const face = new Face({ size: faceSize, expression })
  const faceMesh = makeFaceMesh(face, radius * faceScale)
  group.add(faceMesh)

  return { group, mesh, face, faceMesh, radius }
}

function buildSun() {
  const body = makeBody({
    radius: 2.9,
    material: new THREE.MeshBasicMaterial({ map: sunTexture() }),
    faceSize: 512,
    expression: 'happy',
    faceScale: 1.15,
  })
  body.face.setBase('happy')

  for (const [scale, opacity] of [[9, 0.55], [15, 0.2]]) {
    const halo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture(),
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    )
    halo.scale.setScalar(scale)
    body.group.add(halo)
  }

  body.mesh.userData.body = body
  pickables.push(body.mesh)
  scene.add(body.group)
  return body
}

function buildPlanet(def, index) {
  const material = new THREE.MeshToonMaterial({
    map: planetTexture(def.pattern, def.color, def.accent, index + 3),
    gradientMap: ramp,
  })
  const body = makeBody({ radius: def.radius, material, expression: def.mood })
  body.face.setBase(def.mood)
  scene.add(orbitLine(def.orbit, def.incl))

  Object.assign(body, {
    def,
    name: def.name,
    orbitR: def.orbit,
    orbitSpeed: def.speed,
    angle: (index / PLANETS.length) * TAU + 0.7,
    incl: def.incl,
    spin: 0.25 + Math.random() * 0.3,
    hop: 0,
    hopVel: 0,
    shake: 0,
    idleTimer: 3 + Math.random() * 8,
    pos: new THREE.Vector3(),
  })

  if (def.rings) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(def.radius * 1.5, def.radius * 2.5, 96),
      new THREE.MeshBasicMaterial({
        map: ringTexture(def.color, def.accent),
        transparent: true,
        side: THREE.DoubleSide,
      }),
    )
    // RingGeometry's UVs are radial-ish; remap u to the radius so the banded
    // texture reads as concentric rings.
    const pos = ring.geometry.attributes.position
    const uv = ring.geometry.attributes.uv
    const v = new THREE.Vector3()
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)
      const t = (v.length() - def.radius * 1.5) / (def.radius * 1.0)
      uv.setXY(i, t, 0.5)
    }
    ring.rotation.set(-Math.PI / 2 + 0.34, 0, 0.18)
    body.group.add(ring)
  }

  if (def.moon) {
    const moonGeo = new THREE.SphereGeometry(def.radius * 0.3, 20, 16)
    const moon = new THREE.Mesh(
      moonGeo,
      new THREE.MeshToonMaterial({ map: planetTexture('craters', 0xe9e4f5, 0xb9b0d0, 9), gradientMap: ramp }),
    )
    moon.add(outline(moonGeo))
    const moonFace = new Face({ size: 128, expression: 'sleepy' })
    const moonFaceMesh = makeFaceMesh(moonFace, def.radius * 0.42)
    const moonPivot = new THREE.Group()
    moonPivot.add(moon)
    moonPivot.add(moonFaceMesh)
    body.group.add(moonPivot)
    body.moon = { pivot: moonPivot, mesh: moon, face: moonFace, faceMesh: moonFaceMesh, dist: def.radius * 2.2, angle: Math.random() * TAU }
  }

  body.mesh.userData.body = body
  pickables.push(body.mesh)
  scene.add(body.group)
  return body
}

function buildUfo() {
  const group = new THREE.Group()
  const hull = new THREE.Group()
  group.add(hull)

  const saucerGeo = new THREE.SphereGeometry(1, 32, 20)
  const saucer = new THREE.Mesh(
    saucerGeo,
    new THREE.MeshToonMaterial({ map: planetTexture('swirl', 0xd6ddff, 0x9aa8e6, 5), gradientMap: ramp }),
  )
  saucer.scale.set(1.55, 0.42, 1.55)
  saucer.add(outline(saucerGeo, 1.06))
  hull.add(saucer)

  const rimGeo = new THREE.TorusGeometry(1.5, 0.16, 12, 48)
  const rim = new THREE.Mesh(rimGeo, new THREE.MeshToonMaterial({ color: 0xb0bdf5, gradientMap: ramp }))
  rim.rotation.x = Math.PI / 2
  hull.add(rim)

  // Blinking landing lights around the rim.
  const lights = []
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 12, 10),
      new THREE.MeshBasicMaterial({ color: 0xfff3a8 }),
    )
    bulb.position.set(Math.cos(a) * 1.5, -0.1, Math.sin(a) * 1.5)
    hull.add(bulb)
    lights.push(bulb)
  }

  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.85, 28, 18, 0, TAU, 0, Math.PI / 2),
    new THREE.MeshPhongMaterial({
      color: 0x9ff0ff,
      transparent: true,
      opacity: 0.4,
      shininess: 90,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  )
  dome.position.y = 0.12
  hull.add(dome)

  // The pilot's face floats inside the dome and stays level while the saucer tilts.
  const face = new Face({ size: 256, expression: 'alien' })
  face.setBase('alien')
  const faceMesh = makeFaceMesh(face, 0.78)
  group.add(faceMesh)

  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 2.6, 7, 28, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0x9ff8d8,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  )
  beam.position.y = -3.6
  group.add(beam)

  scene.add(group)
  return { group, hull, lights, beam, face, faceMesh, radius: 1.1, t: Math.random() * 20, beamTimer: 6, beamOn: 0, prev: new THREE.Vector3() }
}

function buildMeteor() {
  const group = new THREE.Group()

  // A lumpy rock: displace an icosahedron's vertices a little.
  const geo = new THREE.IcosahedronGeometry(0.9, 2)
  const pos = geo.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const n = Math.sin(v.x * 3.1) * Math.cos(v.y * 2.7) * Math.sin(v.z * 3.6)
    v.multiplyScalar(1 + n * 0.16)
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  geo.computeVertexNormals()

  const rock = new THREE.Mesh(
    geo,
    new THREE.MeshToonMaterial({ map: planetTexture('craters', 0xb3a1c4, 0x84719b, 12), gradientMap: ramp }),
  )
  rock.add(outline(geo, 1.07))
  group.add(rock)

  const face = new Face({ size: 256, expression: 'mischief' })
  face.setBase('mischief')
  const faceMesh = makeFaceMesh(face, 1.45)
  group.add(faceMesh)

  // Tail flame, pointed backwards along the direction of travel.
  const flame = new THREE.Mesh(
    new THREE.ConeGeometry(0.62, 3.2, 22, 1, true),
    new THREE.MeshBasicMaterial({
      map: flameTexture(),
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  )
  group.add(flame)

  scene.add(group)
  return { group, rock, face, faceMesh, flame }
}

// ---------------------------------------------------------------------------
// Ember trail behind the meteor
// ---------------------------------------------------------------------------

function buildTrail(count = 220) {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const points = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      size: 0.85,
      map: glowTexture('rgba(255,220,150,0.95)', 'rgba(255,120,40,0)'),
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  )
  scene.add(points)
  return {
    points,
    count,
    cursor: 0,
    life: new Float32Array(count),
    vel: new Float32Array(count * 3),
    hot: new THREE.Color(0xffd58a),
    cold: new THREE.Color(0xff5522),
  }
}

function emitEmber(trail, at, speed) {
  const i = trail.cursor
  trail.cursor = (trail.cursor + 1) % trail.count
  const p = trail.points.geometry.attributes.position
  p.setXYZ(i, at.x + (Math.random() - 0.5) * 0.6, at.y + (Math.random() - 0.5) * 0.6, at.z + (Math.random() - 0.5) * 0.6)
  trail.vel[i * 3] = (Math.random() - 0.5) * 1.2
  trail.vel[i * 3 + 1] = (Math.random() - 0.5) * 1.2 + 0.3
  trail.vel[i * 3 + 2] = (Math.random() - 0.5) * 1.2
  trail.life[i] = clamp(0.4 + speed * 0.02, 0.4, 1.1)
}

function updateTrail(trail, dt) {
  const p = trail.points.geometry.attributes.position
  const c = trail.points.geometry.attributes.color
  const col = new THREE.Color()
  for (let i = 0; i < trail.count; i++) {
    if (trail.life[i] <= 0) {
      c.setXYZ(i, 0, 0, 0)
      continue
    }
    trail.life[i] -= dt
    p.setXYZ(
      i,
      p.getX(i) + trail.vel[i * 3] * dt,
      p.getY(i) + trail.vel[i * 3 + 1] * dt,
      p.getZ(i) + trail.vel[i * 3 + 2] * dt,
    )
    const t = clamp(trail.life[i], 0, 1)
    col.copy(trail.cold).lerp(trail.hot, t)
    c.setXYZ(i, col.r * t, col.g * t, col.b * t)
  }
  p.needsUpdate = true
  c.needsUpdate = true
}

// ---------------------------------------------------------------------------
// Speech bubbles
// ---------------------------------------------------------------------------

const bubbles = []

function speak(target, text, { offset = 1.6, life = 2.1 } = {}) {
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: bubbleTexture(text), transparent: true, depthWrite: false, depthTest: false }),
  )
  sprite.renderOrder = 30
  scene.add(sprite)
  bubbles.push({ sprite, target, offset, life, age: 0, total: life })
}

function updateBubbles(dt) {
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i]
    b.age += dt
    const t = b.age / b.total
    if (t >= 1) {
      scene.remove(b.sprite)
      b.sprite.material.map.dispose()
      b.sprite.material.dispose()
      bubbles.splice(i, 1)
      continue
    }
    const popIn = clamp(b.age / 0.18, 0, 1)
    const scale = (1 + (1 - popIn) * -0.3) * 2.0
    b.sprite.scale.set(scale * 2, scale, 1)
    b.sprite.material.opacity = t > 0.75 ? 1 - (t - 0.75) / 0.25 : popIn
    b.sprite.position.copy(b.target.position)
    b.sprite.position.y += b.offset + b.age * 0.7 + scale * 0.5
  }
}

let lastStatus = ''
function say(text) {
  if (text === lastStatus) return
  lastStatus = text
  statusEl.textContent = text
}

// ---------------------------------------------------------------------------
// Assemble the neighbourhood
// ---------------------------------------------------------------------------

const sun = buildSun()
Object.assign(sun, { name: 'the sun', hop: 0, hopVel: 0 })
const planets = PLANETS.map(buildPlanet)
const ufo = buildUfo()
const meteor = buildMeteor()
const trail = buildTrail()

const bonk = {
  pos: new THREE.Vector3(26, 6, 10),
  vel: new THREE.Vector3(-4, 0, 2),
  state: 'wander',
  timer: 1.2,
  target: planets[3],
  roam: new THREE.Vector3(16, 7, -14),
  swerveDir: new THREE.Vector3(),
  spin: new THREE.Vector3(0.6, 0.9, 0.4),
}

// ---------------------------------------------------------------------------
// Camera rig: drag to orbit, wheel to zoom, drifts on its own when left alone
// ---------------------------------------------------------------------------

const rig = { yaw: 0.55, pitch: 0.34, dist: 47, tYaw: 0.55, tPitch: 0.34, tDist: 47 }
let dragging = false
let dragMoved = 0
const pointer = new THREE.Vector2()
const lastPointer = new THREE.Vector2()

canvas.addEventListener('pointerdown', (e) => {
  dragging = true
  dragMoved = 0
  lastPointer.set(e.clientX, e.clientY)
  canvas.classList.add('dragging')
  canvas.setPointerCapture(e.pointerId)
})

canvas.addEventListener('pointermove', (e) => {
  if (!dragging) return
  const dx = e.clientX - lastPointer.x
  const dy = e.clientY - lastPointer.y
  dragMoved += Math.abs(dx) + Math.abs(dy)
  lastPointer.set(e.clientX, e.clientY)
  rig.tYaw -= dx * 0.005
  rig.tPitch = clamp(rig.tPitch + dy * 0.004, -0.5, 1.15)
})

function endDrag(e) {
  if (!dragging) return
  dragging = false
  canvas.classList.remove('dragging')
  if (dragMoved < 6) poke(e)
}
canvas.addEventListener('pointerup', endDrag)
canvas.addEventListener('pointercancel', () => {
  dragging = false
  canvas.classList.remove('dragging')
})

canvas.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault()
    rig.tDist = clamp(rig.tDist + e.deltaY * 0.045, 16, 110)
  },
  { passive: false },
)

const raycaster = new THREE.Raycaster()

function poke(e) {
  pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1)
  raycaster.setFromCamera(pointer, camera)
  const hit = raycaster.intersectObjects(pickables, false)[0]
  if (!hit) return
  const body = hit.object.userData.body
  body.hopVel = 4.2
  body.face.set(pick(['love', 'happy', 'surprise', 'laugh']), 1.8)
  speak(body.group, pick(POKE_LINES), { offset: body.radius + 0.8 })
  if (body === sun) say('the sun beams a little brighter')
  else say(`${body.name} says hello`)
}

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
})

// ---------------------------------------------------------------------------
// Per-frame helpers
// ---------------------------------------------------------------------------

const camRight = new THREE.Vector3()
const camUp = new THREE.Vector3()
const tmp = new THREE.Vector3()
const tmp2 = new THREE.Vector3()

/** Park a face plane in front of its body and turn it to the camera. */
function billboard(body, offset = 1.02) {
  tmp.subVectors(camera.position, body.group.position).normalize()
  body.faceMesh.position.copy(tmp).multiplyScalar(body.radius * offset)
  body.faceMesh.quaternion.copy(camera.quaternion)
}

/** Point the eyes at a world position (or straight at the camera if none). */
function gaze(face, from, at) {
  if (!at) {
    face.look.set(0, 0)
    return
  }
  tmp2.subVectors(at, from).normalize()
  face.look.set(clamp(tmp2.dot(camRight) * 1.6, -1, 1), clamp(-tmp2.dot(camUp) * 1.6, -1, 1))
}

// ---------------------------------------------------------------------------
// Bonk's mischief: aim at a planet, dive, then chicken out with a grin
// ---------------------------------------------------------------------------

function scareNeighbours(target) {
  for (const p of planets) {
    if (p === target) continue
    if (p.group.position.distanceTo(target.group.position) < 12) p.face.set('worried', 3)
  }
}

function updateBonk(dt) {
  bonk.timer -= dt
  const speed = bonk.vel.length()

  switch (bonk.state) {
    case 'wander': {
      // Loiter innocently until it is time to pick on somebody.
      tmp.subVectors(bonk.roam, bonk.pos)
      if (tmp.length() < 4) bonk.roam.set((Math.random() - 0.5) * 44, (Math.random() - 0.5) * 16, (Math.random() - 0.5) * 44)
      bonk.vel.addScaledVector(tmp.normalize(), dt * 7)
      bonk.vel.multiplyScalar(1 - dt * 0.9)
      if (bonk.timer <= 0) {
        bonk.target = pick(planets)
        bonk.state = 'aim'
        bonk.timer = 3.2
        meteor.face.set('smug')
        bonk.target.face.set('worried', 4)
        say(`Bonk is sizing up ${bonk.target.name}...`)
      }
      break
    }

    case 'aim': {
      // Slide out to a run-up position on the far side of the target.
      const t = bonk.target.group.position
      tmp.copy(t).sub(sun.group.position).normalize().multiplyScalar(bonk.target.radius + 15)
      tmp.y += 5
      tmp.add(t)
      tmp.sub(bonk.pos)
      bonk.vel.addScaledVector(tmp.normalize(), dt * 16)
      bonk.vel.multiplyScalar(1 - dt * 1.4)
      if (bonk.timer <= 0) {
        bonk.state = 'charge'
        bonk.timer = 5
        meteor.face.set('determined')
        sun.face.set('surprise', 2.5)
        bonk.target.face.set('scared')
        bonk.target.shake = 1
        scareNeighbours(bonk.target)
        speak(bonk.target.group, pick(SCARE_LINES), { offset: bonk.target.radius + 0.9 })
        say(`incoming! Bonk is diving straight at ${bonk.target.name}!`)
      }
      break
    }

    case 'charge': {
      const t = bonk.target.group.position
      tmp.subVectors(t, bonk.pos)
      const dist = tmp.length()
      bonk.vel.addScaledVector(tmp.normalize(), dt * 62)
      bonk.vel.clampLength(0, 34)
      bonk.target.shake = 1
      // The last-minute chicken-out.
      if (dist < bonk.target.radius + 4.6 || bonk.timer <= 0) {
        bonk.state = 'swerve'
        bonk.timer = 1.25
        // Veer sideways-and-up, away from the planet.
        bonk.swerveDir.crossVectors(bonk.vel, new THREE.Vector3(0, 1, 0)).normalize()
        if (Math.random() < 0.5) bonk.swerveDir.negate()
        bonk.swerveDir.y += 0.55
        bonk.swerveDir.normalize()
        meteor.face.set('tease')
        sun.face.set('laugh', 3)
        speak(meteor.group, pick(TEASE_LINES), { offset: 1.9 })
        say(`...and Bonk swerves away at the last second. ${bonk.target.name} is not amused.`)
      }
      break
    }

    case 'swerve': {
      bonk.vel.addScaledVector(bonk.swerveDir, dt * 46)
      bonk.vel.clampLength(0, 26)
      if (bonk.timer <= 0) {
        bonk.state = 'giggle'
        bonk.timer = 2.4
        meteor.face.set('laugh')
        bonk.target.face.set('angry', 2.6)
        bonk.target.shake = 0
        speak(bonk.target.group, pick(HUFF_LINES), { offset: bonk.target.radius + 0.9 })
      }
      break
    }

    case 'giggle': {
      // A victory barrel roll on the way out.
      bonk.vel.multiplyScalar(1 - dt * 2.1)
      bonk.vel.y += dt * 3
      meteor.rock.rotation.z += dt * 7
      if (bonk.timer <= 0) {
        bonk.state = 'wander'
        bonk.timer = 3 + Math.random() * 3
        meteor.face.set('mischief')
        bonk.target.face.set(bonk.target.def.mood)
        say('the neighbourhood catches its breath')
      }
      break
    }
  }

  // Nudge Bonk back home if he drifts off the edge of the picture.
  if (bonk.pos.length() > 46) bonk.vel.addScaledVector(tmp.copy(bonk.pos).normalize(), -dt * 34)

  bonk.pos.addScaledVector(bonk.vel, dt)
  meteor.group.position.copy(bonk.pos)

  meteor.rock.rotation.x += bonk.spin.x * dt * (1 + speed * 0.06)
  meteor.rock.rotation.y += bonk.spin.y * dt * (1 + speed * 0.06)

  // Flame: sits behind him, grows with speed.
  const flameAmount = clamp((speed - 4) / 26, 0, 1)
  meteor.flame.material.opacity = flameAmount * 0.9
  meteor.flame.visible = flameAmount > 0.02
  if (meteor.flame.visible) {
    tmp.copy(bonk.vel).normalize()
    meteor.flame.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tmp)
    meteor.flame.position.copy(tmp).multiplyScalar(-(1.5 + flameAmount * 1.4))
    meteor.flame.scale.set(0.8 + flameAmount * 0.5, 0.6 + flameAmount * 1.5, 0.8 + flameAmount * 0.5)
  }
  if (speed > 6) {
    emitEmber(trail, bonk.pos, speed)
    if (speed > 18) emitEmber(trail, bonk.pos, speed)
  }
}

// ---------------------------------------------------------------------------
// The UFO's sightseeing tour
// ---------------------------------------------------------------------------

function updateUfo(dt, time) {
  ufo.t += dt
  const t = ufo.t * 0.22
  ufo.prev.copy(ufo.group.position)
  ufo.group.position.set(
    Math.cos(t * 1.1) * 26 + Math.cos(t * 0.37) * 8,
    9 + Math.sin(t * 1.7) * 5,
    Math.sin(t * 0.9) * 24 + Math.sin(t * 0.53) * 9,
  )

  // Bank into the turn.
  tmp.subVectors(ufo.group.position, ufo.prev)
  ufo.hull.rotation.y += dt * 0.9
  ufo.hull.rotation.z = THREE.MathUtils.lerp(ufo.hull.rotation.z, clamp(-tmp.x * 2.2, -0.35, 0.35), 0.05)
  ufo.hull.rotation.x = THREE.MathUtils.lerp(ufo.hull.rotation.x, clamp(tmp.z * 2.2, -0.35, 0.35), 0.05)

  ufo.lights.forEach((bulb, i) => {
    const glow = 0.5 + 0.5 * Math.sin(time * 5 + i * 0.8)
    bulb.material.color.setHSL(0.13 + glow * 0.12, 0.9, 0.55 + glow * 0.3)
  })

  // Every so often, shine a friendly tractor beam on the nearest planet.
  ufo.beamTimer -= dt
  if (ufo.beamOn > 0) {
    ufo.beamOn -= dt
    ufo.beam.material.opacity = clamp(ufo.beamOn, 0, 1) * 0.28 * (0.7 + 0.3 * Math.sin(time * 9))
    ufo.beam.rotation.y += dt * 2
  } else if (ufo.beamTimer <= 0) {
    let near = null
    let best = 14
    for (const p of planets) {
      const d = p.group.position.distanceTo(ufo.group.position)
      if (d < best) {
        best = d
        near = p
      }
    }
    ufo.beamTimer = 7 + Math.random() * 6
    if (near) {
      ufo.beamOn = 2.6
      ufo.face.set('alienGlee', 3)
      near.face.set(pick(['surprise', 'happy', 'love']), 3)
      speak(ufo.group, pick(UFO_LINES), { offset: 1.8 })
      say(`the UFO stops to admire ${near.name}`)
    }
  } else {
    ufo.beam.material.opacity = 0
  }
}

// ---------------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------------

const clock = new THREE.Clock()

function frame() {
  const dt = Math.min(clock.getDelta(), 0.05)
  const time = clock.elapsedTime

  // Camera rig, with a lazy drift whenever the viewer is not dragging.
  if (!dragging) rig.tYaw += dt * 0.035
  rig.yaw += (rig.tYaw - rig.yaw) * Math.min(1, dt * 6)
  rig.pitch += (rig.tPitch - rig.pitch) * Math.min(1, dt * 6)
  rig.dist += (rig.tDist - rig.dist) * Math.min(1, dt * 4)
  camera.position.set(
    Math.cos(rig.yaw) * Math.cos(rig.pitch) * rig.dist,
    Math.sin(rig.pitch) * rig.dist + 3,
    Math.sin(rig.yaw) * Math.cos(rig.pitch) * rig.dist,
  )
  camera.lookAt(0, 0, 0)
  camRight.set(1, 0, 0).applyQuaternion(camera.quaternion)
  camUp.set(0, 1, 0).applyQuaternion(camera.quaternion)

  // Sun: breathes, watches whoever is making trouble.
  sun.mesh.rotation.y += dt * 0.06
  const pulse = 1 + Math.sin(time * 1.3) * 0.015
  sun.mesh.scale.setScalar(pulse)
  sun.hopVel -= dt * 14
  sun.hop = Math.max(0, sun.hop + sun.hopVel * dt)
  sun.group.position.y = sun.hop
  gaze(sun.face, sun.group.position, bonk.state === 'charge' ? bonk.pos : null)
  sun.face.update(dt)
  billboard(sun, 1.02)

  const chasing = bonk.state === 'charge' || bonk.state === 'aim'

  for (const p of planets) {
    p.angle += dt * p.orbitSpeed
    const wobble = p.shake > 0 ? Math.sin(time * 42) * 0.12 * p.shake : 0

    // Hop: a squashy little jump when poked.
    p.hopVel -= dt * 16
    p.hop = Math.max(0, p.hop + p.hopVel * dt)
    if (p.hop === 0 && p.hopVel < 0) p.hopVel = 0

    p.group.position.set(
      Math.cos(p.angle) * p.orbitR + wobble,
      Math.sin(p.angle) * p.orbitR * Math.sin(p.incl) + p.hop,
      Math.sin(p.angle) * p.orbitR * Math.cos(p.incl),
    )
    p.mesh.rotation.y += dt * p.spin
    p.mesh.scale.set(1 + p.hop * 0.06, 1 - p.hop * 0.05, 1 + p.hop * 0.06)
    if (p.shake > 0) p.shake = Math.max(0, p.shake - dt * (bonk.state === 'charge' ? 0 : 1.6))

    // Idle theatrics: pull a random face now and then.
    p.idleTimer -= dt
    if (p.idleTimer <= 0) {
      p.idleTimer = 6 + Math.random() * 10
      if (p.face.hold <= 0 && Math.random() < 0.6) p.face.set(pick(IDLE_MOODS), 2.5)
    }

    // Everybody stares at whatever is most alarming.
    const watch = chasing && (bonk.target === p || bonk.pos.distanceTo(p.group.position) < 18) ? bonk.pos : null
    gaze(p.face, p.group.position, watch)
    p.face.update(dt)
    billboard(p, 1.03)

    if (p.moon) {
      const m = p.moon
      m.angle += dt * 0.9
      m.pivot.position.set(Math.cos(m.angle) * m.dist, Math.sin(m.angle) * m.dist * 0.35, Math.sin(m.angle) * m.dist * 0.6)
      m.mesh.rotation.y += dt * 0.4
      tmp.copy(camera.position).sub(p.group.position).sub(m.pivot.position).normalize()
      m.faceMesh.position.copy(tmp).multiplyScalar(p.def.radius * 0.32)
      m.faceMesh.quaternion.copy(camera.quaternion)
      m.face.update(dt)
    }
  }

  updateBonk(dt)
  updateTrail(trail, dt)
  gaze(meteor.face, bonk.pos, chasing ? bonk.target.group.position : null)
  meteor.face.update(dt)
  tmp.subVectors(camera.position, meteor.group.position).normalize()
  meteor.faceMesh.position.copy(tmp).multiplyScalar(0.95)
  meteor.faceMesh.quaternion.copy(camera.quaternion)

  updateUfo(dt, time)
  gaze(ufo.face, ufo.group.position, null)
  ufo.face.update(dt)
  tmp.subVectors(camera.position, ufo.group.position).normalize()
  // Keep the pilot up inside the glass dome, clear of the hull.
  ufo.faceMesh.position.copy(tmp).multiplyScalar(0.62).setY(0.5)
  ufo.faceMesh.quaternion.copy(camera.quaternion)

  updateBubbles(dt)

  renderer.render(scene, camera)
  requestAnimationFrame(frame)
}

frame()
