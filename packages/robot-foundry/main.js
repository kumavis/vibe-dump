import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Robot Foundry
// A cube-world where robots wander a grid, pick up scattered blocks and carry
// them to an assembly pad, where the delivered blocks visibly fly into place
// and weld themselves into a brand-new robot that joins the swarm.
//
// There is no population cap. Instead the forge charges more blocks for every
// robot already alive, so the swarm settles wherever the block supply can
// sustain it rather than being culled.
//
// Robots are solid: they shove each other aside, and a hard enough head-on
// collision knocks both of them sprawling and scatters whatever they carried.
// ---------------------------------------------------------------------------

const GRID = 18            // half-extent of the floor in world units
const BASE_FORGE_COST = 4  // blocks the first robots cost to build
const ROBOT_RADIUS = 0.62  // collision radius (robots are solid cylinders)
const BUMP_SPEED = 1.3     // closing speed that counts as a real collision
const BUMP_CHANCE = 0.55   // ...of those, how many actually knock robots over
const BUMP_COOLDOWN = 3.0  // seconds before a robot can be knocked over again

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1a1530)
scene.fog = new THREE.Fog(0x1a1530, 38, 78)

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 200)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.setSize(innerWidth, innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)

// --- Lighting -------------------------------------------------------------
scene.add(new THREE.HemisphereLight(0xbfd4ff, 0x40306a, 0.9))

const sun = new THREE.DirectionalLight(0xfff0d0, 1.5)
sun.position.set(16, 26, 12)
sun.castShadow = true
sun.shadow.mapSize.set(1024, 1024)
const s = sun.shadow.camera
s.left = -GRID - 4; s.right = GRID + 4; s.top = GRID + 4; s.bottom = -GRID - 4
s.near = 1; s.far = 70
scene.add(sun)

// --- Helpers --------------------------------------------------------------
const rand = (a, b) => a + Math.random() * (b - a)
const randCell = () => Math.round(rand(-GRID + 1, GRID - 1))
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
const easeOut = (x) => 1 - Math.pow(1 - x, 3)
const easeOutBack = (x) => 1 + 2.7 * Math.pow(x - 1, 3) + 1.7 * Math.pow(x - 1, 2)
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const wrapAngle = (a) => Math.atan2(Math.sin(a), Math.cos(a))

// --- Shared geometry / materials (reuse everywhere for performance) -------
const cubeGeo = new THREE.BoxGeometry(1, 1, 1)

const BLOCK_COLORS = [0xff6b6b, 0xffd166, 0x06d6a0, 0x4cc9f0, 0xc77dff, 0xff8fab]
const blockMats = BLOCK_COLORS.map(
  (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.55, metalness: 0.05 })
)

// One robot "skin" per block colour, so a robot visibly keeps the hue of the
// blocks it was welded from without allocating a material per robot.
const tint = (hex, other, amt) => new THREE.Color(hex).lerp(new THREE.Color(other), amt)
const bodyMats = BLOCK_COLORS.map((c) => new THREE.MeshStandardMaterial({
  color: tint(c, 0x36406e, 0.55), roughness: 0.45, metalness: 0.35,
}))
const headMats = BLOCK_COLORS.map((c) => new THREE.MeshStandardMaterial({
  color: tint(c, 0xf2f5ff, 0.62), roughness: 0.5, metalness: 0.2,
}))
const limbMats = BLOCK_COLORS.map((c) => new THREE.MeshStandardMaterial({
  color: tint(c, 0x232a4d, 0.72), roughness: 0.6, metalness: 0.2,
}))

const eyeMat = new THREE.MeshStandardMaterial({ color: 0x101020, emissive: 0x66ffe0, emissiveIntensity: 1.2 })
const eyeOffMat = new THREE.MeshStandardMaterial({ color: 0x101020, emissive: 0x0a1a18, emissiveIntensity: 0.3 })
const eyeHurtMat = new THREE.MeshStandardMaterial({ color: 0x200808, emissive: 0xff4d5e, emissiveIntensity: 1.4 })
const antennaMat = new THREE.MeshStandardMaterial({ color: 0x8b93bd, roughness: 0.5, metalness: 0.5 })
const bulbMat = new THREE.MeshStandardMaterial({ color: 0x332200, emissive: 0xffc14d, emissiveIntensity: 1.6 })
const starMat = new THREE.MeshStandardMaterial({ color: 0x453000, emissive: 0xffd166, emissiveIntensity: 1.5 })

// --- Floor: a checkered grid of flat tiles --------------------------------
const floor = new THREE.Group()
const tileGeo = new THREE.BoxGeometry(1, 0.4, 1)
const tileMatA = new THREE.MeshStandardMaterial({ color: 0x2c2750, roughness: 0.9 })
const tileMatB = new THREE.MeshStandardMaterial({ color: 0x352f60, roughness: 0.9 })
for (let x = -GRID; x <= GRID; x++) {
  for (let z = -GRID; z <= GRID; z++) {
    const mat = (x + z) & 1 ? tileMatA : tileMatB
    const tile = new THREE.Mesh(tileGeo, mat)
    tile.position.set(x, -0.2, z)
    tile.receiveShadow = true
    floor.add(tile)
  }
}
scene.add(floor)

// --- Assembly pad: where new robots are forged ----------------------------
const padMat = new THREE.MeshStandardMaterial({
  color: 0xffd166, emissive: 0xff9e00, emissiveIntensity: 0.35, roughness: 0.4,
})
const pad = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 3), padMat)
pad.position.set(0, 0.05, 0)
pad.receiveShadow = true
scene.add(pad)
const PAD = new THREE.Vector3(0, 0, 0)
const PAD_REACH = 1.7 // how close a carrier must get to hand its block over

// brief glow burst on the pad each time something lands on it
let forgeFlash = 0
const flash = (v) => { forgeFlash = Math.max(forgeFlash, v) }

// --- Effects: expanding shockwave rings -----------------------------------
const ringGeo = new THREE.RingGeometry(0.35, 0.5, 28)
ringGeo.rotateX(-Math.PI / 2)
const ringPool = []
const rings = []

function spawnRing(x, y, z, color, size = 2.2, life = 0.5) {
  const ring = ringPool.pop() || new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  }))
  ring.material.color.set(color)
  ring.material.opacity = 0.85
  ring.position.set(x, y, z)
  ring.scale.setScalar(0.2)
  ring.userData.age = 0
  ring.userData.size = size
  ring.userData.life = life
  scene.add(ring)
  rings.push(ring)
}

function updateRings(dt) {
  for (let i = rings.length - 1; i >= 0; i--) {
    const ring = rings[i]
    const u = ring.userData
    u.age += dt / u.life
    if (u.age >= 1) {
      scene.remove(ring)
      rings.splice(i, 1)
      ringPool.push(ring)
      continue
    }
    ring.scale.setScalar(0.2 + easeOut(u.age) * u.size)
    ring.material.opacity = 0.85 * (1 - u.age)
  }
}

// --- Effects: spark bursts ------------------------------------------------
const sparkGeo = new THREE.BoxGeometry(0.13, 0.13, 0.13)
const sparkWarmMat = new THREE.MeshStandardMaterial({ color: 0x3a2a00, emissive: 0xffc14d, emissiveIntensity: 1.8 })
const sparkCoolMat = new THREE.MeshStandardMaterial({ color: 0x02282a, emissive: 0x66ffe0, emissiveIntensity: 1.8 })
const sparkPool = []
const sparks = []

function burst(x, y, z, n, warm = true, power = 4) {
  for (let i = 0; i < n; i++) {
    const sp = sparkPool.pop() || new THREE.Mesh(sparkGeo, sparkWarmMat)
    sp.material = warm ? sparkWarmMat : sparkCoolMat
    sp.position.set(x, y, z)
    sp.scale.setScalar(1)
    const a = rand(0, Math.PI * 2)
    const up = rand(0.4, 1)
    sp.userData.vel = new THREE.Vector3(Math.cos(a) * rand(0.4, 1) * power, up * power, Math.sin(a) * rand(0.4, 1) * power)
    sp.userData.age = 0
    sp.userData.life = rand(0.4, 0.75)
    scene.add(sp)
    sparks.push(sp)
  }
}

function updateSparks(dt) {
  for (let i = sparks.length - 1; i >= 0; i--) {
    const sp = sparks[i]
    const u = sp.userData
    u.age += dt
    if (u.age >= u.life) {
      scene.remove(sp)
      sparks.splice(i, 1)
      sparkPool.push(sp)
      continue
    }
    u.vel.y -= 14 * dt
    sp.position.addScaledVector(u.vel, dt)
    sp.rotation.x += dt * 9
    sp.rotation.y += dt * 7
    sp.scale.setScalar(1 - u.age / u.life)
  }
}

// --- Effects: dizzy stars that orbit a knocked-over robot -----------------
const starGeo = new THREE.BoxGeometry(0.14, 0.14, 0.14)
const starPool = []

function takeStars() {
  const ring = starPool.pop() || (() => {
    const g = new THREE.Group()
    for (let i = 0; i < 3; i++) {
      const st = new THREE.Mesh(starGeo, starMat)
      const a = (i / 3) * Math.PI * 2
      st.position.set(Math.cos(a) * 0.42, 0, Math.sin(a) * 0.42)
      g.add(st)
    }
    return g
  })()
  ring.rotation.set(0, 0, 0)
  return ring
}

// --- Blocks ---------------------------------------------------------------
const blocks = []   // lying on the floor, free to be claimed
const debris = []   // airborne / tumbling, not collectible until they settle
const robots = []
const assemblies = []
let nextRobotId = 1

function makeBlock(x, z, matIndex) {
  const m = new THREE.Mesh(cubeGeo, blockMats[matIndex % blockMats.length])
  m.scale.setScalar(0.7)
  m.position.set(x, 0.35, z)
  m.castShadow = true
  m.userData.spin = rand(-1, 1)
  m.userData.matIndex = matIndex % blockMats.length
  return m
}

// the world keeps more blocks around as the swarm grows, so robots stay busy
const blockCapacity = () => Math.min(24 + Math.floor(robots.length * 1.4), 84)

function spawnBlock() {
  if (blocks.length + debris.length >= blockCapacity()) return
  const b = makeBlock(randCell(), randCell(), Math.floor(rand(0, blockMats.length)))
  blocks.push(b)
  scene.add(b)
}

// a block knocked out of a robot's arms: tumbles through the air, bounces,
// then settles back down as something anyone can pick up again
function scatterBlock(matIndex, x, y, z, vx, vy, vz) {
  const b = makeBlock(x, z, matIndex)
  b.position.y = y
  b.userData.vel = new THREE.Vector3(vx, vy, vz)
  b.userData.rot = new THREE.Vector3(rand(-8, 8), rand(-8, 8), rand(-8, 8))
  debris.push(b)
  scene.add(b)
}

function updateDebris(dt) {
  for (let i = debris.length - 1; i >= 0; i--) {
    const b = debris[i]
    const v = b.userData.vel
    v.y -= 22 * dt
    b.position.addScaledVector(v, dt)
    b.rotation.x += b.userData.rot.x * dt
    b.rotation.y += b.userData.rot.y * dt
    b.rotation.z += b.userData.rot.z * dt
    b.userData.rot.multiplyScalar(Math.exp(-1.6 * dt))

    // keep dropped blocks inside the arena
    b.position.x = clamp(b.position.x, -GRID + 0.5, GRID - 0.5)
    b.position.z = clamp(b.position.z, -GRID + 0.5, GRID - 0.5)

    if (b.position.y <= 0.35) {
      b.position.y = 0.35
      if (v.y < -1.4) {
        v.y *= -0.42                       // bounce
        v.x *= 0.6; v.z *= 0.6
        spawnRing(b.position.x, 0.06, b.position.z, BLOCK_COLORS[b.userData.matIndex], 0.9, 0.35)
      } else {
        // settled: rejoin the pool of collectible blocks
        b.rotation.set(0, b.rotation.y, 0)
        delete b.userData.vel
        delete b.userData.rot
        debris.splice(i, 1)
        blocks.push(b)
      }
    }
  }
}

// --- Build a small voxel robot --------------------------------------------
// Every animated piece hangs off a pivot group so limbs rotate from the joint
// instead of sliding around.
function makeRobot(colorIndex) {
  const ci = colorIndex % BLOCK_COLORS.length
  const g = new THREE.Group()
  g.rotation.order = 'YXZ' // yaw first, so lean/roll layer on top of facing

  const torso = new THREE.Mesh(cubeGeo, bodyMats[ci])
  torso.scale.set(0.9, 1.0, 0.7)
  torso.position.y = 0.95
  torso.castShadow = true
  g.add(torso)

  const headPivot = new THREE.Group()
  headPivot.position.y = 1.5
  g.add(headPivot)

  const head = new THREE.Mesh(cubeGeo, headMats[ci])
  head.scale.set(0.7, 0.55, 0.6)
  head.position.y = 0.25
  head.castShadow = true
  headPivot.add(head)

  // glowing eyes
  const eyeGeo = new THREE.BoxGeometry(0.14, 0.14, 0.08)
  const eyes = []
  for (const dx of [-0.16, 0.16]) {
    const eye = new THREE.Mesh(eyeGeo, eyeMat)
    eye.position.set(dx, 0.28, 0.32)
    headPivot.add(eye)
    eyes.push(eye)
  }

  // antenna with a blinking bulb
  const antenna = new THREE.Group()
  antenna.position.y = 0.5
  headPivot.add(antenna)
  const stalk = new THREE.Mesh(cubeGeo, antennaMat)
  stalk.scale.set(0.06, 0.32, 0.06)
  stalk.position.y = 0.16
  antenna.add(stalk)
  const bulb = new THREE.Mesh(cubeGeo, bulbMat)
  bulb.scale.setScalar(0.15)
  bulb.position.y = 0.38
  antenna.add(bulb)

  // arms on shoulder pivots
  const arms = []
  for (const dx of [-0.55, 0.55]) {
    const pivot = new THREE.Group()
    pivot.position.set(dx, 1.35, 0)
    const arm = new THREE.Mesh(cubeGeo, limbMats[ci])
    arm.scale.set(0.2, 0.6, 0.2)
    arm.position.y = -0.3
    pivot.add(arm)
    g.add(pivot)
    arms.push(pivot)
  }

  // legs on hip pivots
  const legs = []
  for (const dx of [-0.26, 0.26]) {
    const pivot = new THREE.Group()
    pivot.position.set(dx, 0.55, 0)
    const leg = new THREE.Mesh(cubeGeo, limbMats[ci])
    leg.scale.set(0.24, 0.5, 0.24)
    leg.position.y = -0.25
    leg.castShadow = true
    pivot.add(leg)
    g.add(pivot)
    legs.push(pivot)
  }

  // the block currently held out in front in both hands
  const carried = new THREE.Mesh(cubeGeo, blockMats[0])
  carried.scale.setScalar(0.5)
  carried.position.set(0, 1.12, 0.62)
  carried.visible = false
  carried.castShadow = true
  g.add(carried)

  g.userData = {
    id: nextRobotId++,
    state: 'birth',
    colorIndex: ci,
    torso, headPivot, head, eyes, antenna, bulb, arms, legs, carried,
    // the pieces a delivered block can turn into, in the order they weld on
    parts: [
      { obj: legs[0], base: legs[0].scale.clone(), at: new THREE.Vector3(-0.26, 0.3, 0), size: 0.3 },
      { obj: legs[1], base: legs[1].scale.clone(), at: new THREE.Vector3(0.26, 0.3, 0), size: 0.3 },
      { obj: torso, base: torso.scale.clone(), at: new THREE.Vector3(0, 0.95, 0), size: 0.85 },
      { obj: headPivot, base: headPivot.scale.clone(), at: new THREE.Vector3(0, 1.75, 0), size: 0.62 },
      { obj: arms[0], base: arms[0].scale.clone(), at: new THREE.Vector3(-0.55, 1.05, 0), size: 0.3 },
      { obj: arms[1], base: arms[1].scale.clone(), at: new THREE.Vector3(0.55, 1.05, 0), size: 0.3 },
    ],
    target: null,
    carrying: false,
    carriedIndex: 0,
    delivered: 0,
    speed: rand(2.2, 3.2),
    phase: rand(0, 10),
    stride: rand(0, 10),
    age: 0,
    moveAmt: 0,
    turnRate: 0,
    prevX: 0, prevZ: 0,
    vel: new THREE.Vector3(),
    knock: new THREE.Vector3(),
    spin: 0,
    stunT: 0, stunDur: 1,
    bumpCooldown: 1.5,
    blinkT: rand(1, 5),
    hopT: rand(4, 12),
    hop: 0,
    emote: null, emoteT: 0, emoteDur: 1,
    wander: null,
    pause: 0,
    birthT: 0,
    stars: null,
  }
  return g
}

function setPartsVisible(r, v) {
  for (const p of r.userData.parts) p.obj.visible = v
}

// a piece that just welded on lands oversized and squashes back to size
const POP_TIME = 0.22
function popPart(part) {
  part.obj.visible = true
  part.obj.userData.popT = POP_TIME
}

function updatePartPops(r, dt) {
  for (const p of r.userData.parts) {
    const pu = p.obj.userData
    if (!pu.popT) continue
    pu.popT = Math.max(0, pu.popT - dt)
    p.obj.scale.copy(p.base).multiplyScalar(1 + 0.55 * (pu.popT / POP_TIME))
  }
}

function setEmote(u, kind, dur) {
  u.emote = kind
  u.emoteT = dur
  u.emoteDur = dur
}

// --- World state ----------------------------------------------------------
function addRobot(colorIndex, at) {
  const r = makeRobot(colorIndex)
  r.position.copy(at)
  r.rotation.y = rand(0, Math.PI * 2)
  r.userData.prevX = r.position.x
  r.userData.prevZ = r.position.z
  robots.push(r)
  scene.add(r)
  updateHud()
  return r
}

// No population cap. Instead every robot alive makes the next one pricier, so
// the swarm keeps growing but slows down on its own instead of running away
// with the frame rate.
const forgeCost = () => BASE_FORGE_COST + Math.floor(robots.length / 4)

function updateHud() {
  const el = document.getElementById('count')
  if (el) el.textContent = `Population: ${robots.length}`
  const f = document.getElementById('forge')
  if (f) {
    const a = assemblies.find((x) => x.state === 'collect')
    const have = a ? a.parts.length : 0
    const need = a ? a.cost : forgeCost()
    f.textContent = `Forge: ${have} / ${need} blocks`
  }
}

// seed the world
for (let i = 0; i < 24; i++) spawnBlock()
{
  const seedA = addRobot(2, new THREE.Vector3(4, 0, 4))
  const seedB = addRobot(3, new THREE.Vector3(-4, 0, -3))
  for (const r of [seedA, seedB]) r.userData.scaleIn = true
}
updateHud()

// --- Find nearest unclaimed block ----------------------------------------
function claimBlock(robot) {
  let best = null
  let bestD = Infinity
  for (const b of blocks) {
    if (b.userData.claimed) continue
    const d = b.position.distanceToSquared(robot.position)
    if (d < bestD) { bestD = d; best = b }
  }
  if (best) best.userData.claimed = true
  return best
}

function releaseTarget(u) {
  if (u.target) u.target.userData.claimed = false
  u.target = null
}

// move a robot toward an xz target; returns true when arrived
const _dir = new THREE.Vector3()
function moveToward(r, tx, tz, speed, dt, stopAt = 0.14) {
  const u = r.userData
  _dir.set(tx - r.position.x, 0, tz - r.position.z)
  const dist = _dir.length()
  if (dist < stopAt) { u.vel.set(0, 0, 0); return true }
  _dir.normalize()
  const step = Math.min(speed * dt, dist)
  r.position.x += _dir.x * step
  r.position.z += _dir.z * step
  u.vel.set(_dir.x * speed, 0, _dir.z * speed)
  // face direction of travel (smoothly)
  const diff = wrapAngle(Math.atan2(_dir.x, _dir.z) - r.rotation.y)
  r.rotation.y += diff * Math.min(1, dt * 8)
  u.turnRate = diff
  return false
}

// --- Per-robot AI ---------------------------------------------------------
function updateRobot(r, dt, t) {
  const u = r.userData
  u.age += dt
  u.bumpCooldown = Math.max(0, u.bumpCooldown - dt)

  // measure how fast the robot actually moved last frame (including shoves)
  const spd = Math.hypot(r.position.x - u.prevX, r.position.z - u.prevZ) / Math.max(dt, 1e-4)
  u.prevX = r.position.x
  u.prevZ = r.position.z
  const want = u.state === 'stun' ? 0 : clamp(spd / u.speed, 0, 1)
  u.moveAmt += (want - u.moveAmt) * Math.min(1, dt * 9)
  u.stride += Math.min(spd, u.speed * 1.6) * dt * 3.2

  switch (u.state) {
    case 'birth': updateBirth(r, dt); break
    case 'stun': updateStun(r, dt); break
    case 'seek': updateSeek(r, dt); break
    case 'carry': updateCarry(r, dt); break
    case 'cheer': updateCheer(r, dt); break
    case 'wander': updateWander(r, dt); break
  }

  // stay on the plate
  r.position.x = clamp(r.position.x, -GRID + 0.6, GRID - 0.6)
  r.position.z = clamp(r.position.z, -GRID + 0.6, GRID - 0.6)

  poseRobot(r, dt, t)
}

function updateBirth(r, dt) {
  const u = r.userData
  u.birthT += dt
  u.vel.set(0, 0, 0)
  if (u.birthT > 1.05) {
    u.state = 'seek'
    u.hop = 0.35 // spring off the pad on the first step
    for (const e of u.eyes) e.material = eyeMat
  }
}

function updateStun(r, dt) {
  const u = r.userData
  u.stunT -= dt
  r.position.x += u.knock.x * dt
  r.position.z += u.knock.z * dt
  u.knock.multiplyScalar(Math.exp(-4.5 * dt))
  u.vel.copy(u.knock)
  r.rotation.y += u.spin * dt
  u.spin *= Math.exp(-2.2 * dt)
  if (u.stunT <= 0) {
    for (const e of u.eyes) e.material = eyeMat
    if (u.stars) { r.remove(u.stars); starPool.push(u.stars); u.stars = null }
    r.rotation.x = 0
    r.rotation.z = 0
    u.state = 'seek'
    setEmote(u, 'shake', 0.45) // shake it off before getting back to work
  }
}

function updateSeek(r, dt) {
  const u = r.userData
  if (!u.target || u.target.userData.removed) {
    releaseTarget(u)
    u.target = claimBlock(r)
  }
  if (!u.target) {
    u.state = 'wander'
    u.wander = new THREE.Vector3(randCell(), 0, randCell())
    return
  }
  // occasional skip-hop while walking
  u.hopT -= dt
  if (u.hopT <= 0) { u.hopT = rand(5, 14); u.hop = 0.3 }

  const arrived = moveToward(r, u.target.position.x, u.target.position.z, u.speed, dt, 0.72)
  if (arrived) {
    const blk = u.target
    const idx = blocks.indexOf(blk)
    if (idx !== -1) blocks.splice(idx, 1)
    scene.remove(blk)
    blk.userData.removed = true
    u.carriedIndex = blk.userData.matIndex
    u.carried.material = blockMats[u.carriedIndex]
    u.carried.visible = true
    u.carrying = true
    u.state = 'carry'
    u.target = null
    setEmote(u, 'grab', 0.3)
  }
}

function updateCarry(r, dt) {
  const u = r.userData
  const arrived = moveToward(r, PAD.x, PAD.z, u.speed, dt, PAD_REACH)
  if (arrived) {
    u.carried.visible = false
    u.carrying = false
    u.delivered++
    depositToAssembly(u.carriedIndex)
    u.state = 'cheer'
    setEmote(u, 'cheer', 0.6)
    u.hop = 0.34
  }
}

function updateCheer(r, dt) {
  const u = r.userData
  u.vel.set(0, 0, 0)
  r.rotation.y += dt * 7.5 // a quick victory spin
  u.emoteT -= dt
  if (u.emoteT <= 0) {
    u.emote = null
    u.state = 'seek'
  }
}

function updateWander(r, dt) {
  const u = r.userData
  if (u.pause > 0) {
    u.pause -= dt
    u.vel.set(0, 0, 0)
    if (u.pause <= 0) u.state = 'seek'
    return
  }
  if (!u.wander || moveToward(r, u.wander.x, u.wander.z, u.speed * 0.55, dt, 0.5)) {
    u.wander = null
    u.pause = rand(0.8, 2.0)
    setEmote(u, Math.random() < 0.5 ? 'stretch' : 'look', u.pause)
  }
  // give up wandering the moment a block shows up
  if (blocks.some((b) => !b.userData.claimed)) u.state = 'seek'
}

// --- Robot animation ------------------------------------------------------
// Everything visual lives here: walk cycle, head tracking, blinks, emotes,
// the boot-up sequence and the knocked-over flail.
function poseRobot(r, dt, t) {
  const u = r.userData
  const { legs, arms, headPivot, antenna, bulb, torso } = u
  const walk = u.state === 'stun' ? 0 : u.moveAmt
  const swing = Math.sin(u.stride)

  // --- walk cycle -----------------------------------------------------
  legs[0].rotation.x = swing * 0.85 * walk
  legs[1].rotation.x = -swing * 0.85 * walk
  legs[0].rotation.z = 0
  legs[1].rotation.z = 0
  let bob = Math.abs(Math.cos(u.stride)) * 0.07 * walk

  if (u.carrying) {
    // both arms out front, block bouncing in the grip
    const hold = -1.28 + Math.sin(u.stride) * 0.05 * walk
    arms[0].rotation.set(hold, 0, 0.2)
    arms[1].rotation.set(hold, 0, -0.2)
    u.carried.position.y = 1.12 + Math.sin(t * 8 + u.phase) * 0.045
    u.carried.rotation.y += dt * 0.8
  } else {
    arms[0].rotation.set(-swing * 0.7 * walk, 0, 0.06)
    arms[1].rotation.set(swing * 0.7 * walk, 0, -0.06)
  }

  // lean into the walk, and roll into turns
  r.rotation.x = -0.09 * walk
  r.rotation.z = clamp(-u.turnRate * 0.45, -0.28, 0.28) * walk
  u.turnRate *= Math.exp(-6 * dt)
  torso.rotation.z = Math.sin(u.stride) * 0.05 * walk

  // --- head tracking --------------------------------------------------
  let wantHead = 0
  if (u.state === 'seek' && u.target) {
    wantHead = wrapAngle(
      Math.atan2(u.target.position.x - r.position.x, u.target.position.z - r.position.z) - r.rotation.y
    )
  } else if (u.state === 'carry') {
    wantHead = wrapAngle(Math.atan2(PAD.x - r.position.x, PAD.z - r.position.z) - r.rotation.y)
  } else if (u.emote === 'look') {
    wantHead = Math.sin(t * 1.6 + u.phase) * 0.75
  }
  headPivot.rotation.y += (clamp(wantHead, -0.75, 0.75) - headPivot.rotation.y) * Math.min(1, dt * 5)
  headPivot.rotation.x = -0.05 * walk
  headPivot.rotation.z = 0

  // --- antenna: sways with movement, bulb pulses ----------------------
  antenna.rotation.z = -swing * 0.18 * walk + Math.sin(t * 1.7 + u.phase) * 0.05
  const pulse = 0.15 * (1 + Math.sin(t * 3 + u.phase * 2) * 0.25)
  bulb.scale.setScalar(u.state === 'stun' ? 0.15 * (1 + Math.sin(t * 22) * 0.4) : pulse)

  // --- blinking -------------------------------------------------------
  u.blinkT -= dt
  let lid = 1
  if (u.blinkT < 0) {
    lid = 0.14
    if (u.blinkT < -0.1) u.blinkT = rand(2.5, 7)
  }
  for (const e of u.eyes) e.scale.y = lid

  // --- emotes ---------------------------------------------------------
  if (u.emote && u.state !== 'cheer' && u.state !== 'stun') {
    u.emoteT -= dt
    if (u.emoteT <= 0) u.emote = null
  }
  if (u.emote === 'cheer') {
    // arms thrown overhead
    const k = clamp(u.emoteT / 0.6, 0, 1)
    arms[0].rotation.set(-2.6, 0, 0.5 + Math.sin(t * 22) * 0.2)
    arms[1].rotation.set(-2.6, 0, -0.5 - Math.sin(t * 22) * 0.2)
    legs[0].rotation.x = 0.2 * k
    legs[1].rotation.x = -0.2 * k
    bob += Math.abs(Math.sin(t * 16)) * 0.12
  } else if (u.emote === 'grab') {
    // quick scoop as the block is picked up
    const k = clamp(u.emoteT / 0.3, 0, 1)
    arms[0].rotation.x = -0.4 - k * 1.1
    arms[1].rotation.x = -0.4 - k * 1.1
    headPivot.rotation.x = 0.3 * k
  } else if (u.emote === 'stretch') {
    // a slow overhead stretch while idling
    const k = Math.sin((1 - clamp(u.emoteT / u.emoteDur, 0, 1)) * Math.PI)
    arms[0].rotation.set(-2.9 * k, 0, 0.25 * k)
    arms[1].rotation.set(-2.9 * k, 0, -0.25 * k)
    r.rotation.x = -0.18 * k
    headPivot.rotation.x = -0.3 * k
  } else if (u.emote === 'shake') {
    // shrug off a collision
    const k = clamp(u.emoteT / 0.45, 0, 1)
    headPivot.rotation.y += Math.sin(t * 34) * 0.35 * k
    r.rotation.z += Math.sin(t * 28) * 0.1 * k
  }

  // --- hop ------------------------------------------------------------
  if (u.hop > 0) {
    u.hop = Math.max(0, u.hop - dt * 1.6)
    const k = Math.sin(clamp(u.hop / 0.35, 0, 1) * Math.PI)
    bob += k * 0.45
    legs[0].rotation.x = -0.5 * k
    legs[1].rotation.x = -0.5 * k
  }

  // --- knocked over ---------------------------------------------------
  if (u.state === 'stun') {
    const k = clamp(u.stunT / u.stunDur, 0, 1)
    r.rotation.z = Math.sin(t * 21 + u.phase) * 0.4 * k
    r.rotation.x = 0.22 + Math.sin(t * 17) * 0.16 * k
    legs[0].rotation.set(0.7 * k, 0, 0.35 * k)
    legs[1].rotation.set(-0.55 * k, 0, -0.35 * k)
    arms[0].rotation.set(Math.sin(t * 19) * 1.4 * k - 0.5, 0, 0.9 * k)
    arms[1].rotation.set(Math.sin(t * 19 + 2) * 1.4 * k - 0.5, 0, -0.9 * k)
    headPivot.rotation.y = Math.sin(t * 13) * 0.8 * k
    headPivot.rotation.z = 0.3 * k
    bob = -0.14 * k
    if (u.stars) {
      u.stars.rotation.y += dt * 5
      for (let i = 0; i < u.stars.children.length; i++) {
        u.stars.children[i].position.y = Math.sin(t * 7 + i * 2) * 0.09
        u.stars.children[i].rotation.z += dt * 6
      }
    }
  }

  // --- boot-up sequence -----------------------------------------------
  if (u.state === 'birth') {
    const k = clamp(u.birthT / 1.05, 0, 1)
    // flicker the eyes on
    const lit = k > 0.55 || (k > 0.18 && Math.sin(u.birthT * 55) > 0)
    for (const e of u.eyes) e.material = lit ? eyeMat : eyeOffMat
    // rise, wobble, then settle
    bob = Math.sin(k * Math.PI) * 0.18 + Math.sin(u.birthT * 26) * 0.05 * (1 - k)
    r.rotation.z = Math.sin(u.birthT * 19) * 0.14 * (1 - k)
    r.rotation.x = 0
    const armDrop = -1.5 * (1 - easeOut(clamp((k - 0.2) / 0.5, 0, 1)))
    arms[0].rotation.set(armDrop, 0, 0.06)
    arms[1].rotation.set(armDrop, 0, -0.06)
    legs[0].rotation.x = 0
    legs[1].rotation.x = 0
    headPivot.rotation.y = Math.sin(u.birthT * 7) * 0.5 * (1 - k)
    if (u.scaleIn) r.scale.setScalar(clamp(easeOutBack(clamp(k / 0.4, 0, 1)), 0.05, 1.2))
  } else if (u.scaleIn) {
    r.scale.setScalar(1)
    u.scaleIn = false
  }

  // pieces welded on during the forge settle to their real size
  updatePartPops(r, dt)

  r.position.y = bob
}

// --- Collision: robots are solid ------------------------------------------
// A uniform grid keeps neighbour lookups cheap no matter how big the swarm gets.
const cells = new Map()
const CELL = 2

function resolveCollisions() {
  cells.clear()
  for (const r of robots) {
    const key = Math.floor(r.position.x / CELL) + ',' + Math.floor(r.position.z / CELL)
    let list = cells.get(key)
    if (!list) cells.set(key, (list = []))
    list.push(r)
  }

  const minD = ROBOT_RADIUS * 2
  for (const r of robots) {
    const cx = Math.floor(r.position.x / CELL)
    const cz = Math.floor(r.position.z / CELL)
    for (let ox = -1; ox <= 1; ox++) {
      for (let oz = -1; oz <= 1; oz++) {
        const list = cells.get((cx + ox) + ',' + (cz + oz))
        if (!list) continue
        for (const o of list) {
          if (o.userData.id <= r.userData.id) continue // handle each pair once
          const dx = o.position.x - r.position.x
          const dz = o.position.z - r.position.z
          const d2 = dx * dx + dz * dz
          if (d2 >= minD * minD) continue
          const d = Math.sqrt(d2) || 0.0001
          const nx = dx / d
          const nz = dz / d
          const push = (minD - d) * 0.5
          r.position.x -= nx * push; r.position.z -= nz * push
          o.position.x += nx * push; o.position.z += nz * push

          // how fast were they closing on each other along the contact normal?
          const closing = (r.userData.vel.x - o.userData.vel.x) * nx
                        + (r.userData.vel.z - o.userData.vel.z) * nz
          if (
            closing > BUMP_SPEED &&
            r.userData.bumpCooldown <= 0 && o.userData.bumpCooldown <= 0 &&
            r.userData.state !== 'stun' && o.userData.state !== 'stun' &&
            r.userData.state !== 'birth' && o.userData.state !== 'birth' &&
            Math.random() < BUMP_CHANCE
          ) {
            bump(r, o, nx, nz, closing)
          }
        }
      }
    }
  }
}

function bump(a, b, nx, nz, closing) {
  const power = clamp(closing * 0.9, 2.2, 6)
  knockOver(a, -nx, -nz, power)
  knockOver(b, nx, nz, power)

  const mx = (a.position.x + b.position.x) * 0.5
  const mz = (a.position.z + b.position.z) * 0.5
  spawnRing(mx, 0.08, mz, 0xfff0c0, 2.6, 0.45)
  burst(mx, 1.1, mz, 10, true, 3.4)
}

function knockOver(r, nx, nz, power) {
  const u = r.userData
  releaseTarget(u)
  u.state = 'stun'
  u.stunDur = rand(1.1, 1.7)
  u.stunT = u.stunDur
  u.bumpCooldown = BUMP_COOLDOWN
  u.knock.set(nx * power, 0, nz * power)
  u.spin = rand(-7, 7)
  u.emote = null
  u.hop = 0
  for (const e of u.eyes) e.material = eyeHurtMat
  if (!u.stars) {
    u.stars = takeStars()
    u.stars.position.y = 2.45
    r.add(u.stars)
  }
  // whatever it was carrying goes flying
  if (u.carrying) {
    u.carrying = false
    u.carried.visible = false
    const wx = r.position.x + Math.sin(r.rotation.y) * 0.6
    const wz = r.position.z + Math.cos(r.rotation.y) * 0.6
    scatterBlock(
      u.carriedIndex, wx, 1.2, wz,
      nx * rand(1.5, 3.5) + rand(-1, 1), rand(4.5, 7), nz * rand(1.5, 3.5) + rand(-1, 1)
    )
  }
}

// --- Assembly: delivered blocks stack up, then weld into a robot ----------
function assemblySlot(i) {
  // first four stack into a robot-ish silhouette; the rest ring the base in
  // layers, so an expensive robot piles up a proper stockpile
  if (i < 4) return new THREE.Vector3(rand(-0.1, 0.1), 0.6 + i * 0.62, rand(-0.1, 0.1))
  const k = i - 4
  const ring = Math.floor(k / 8)
  const a = (k % 8) * (Math.PI / 4) + ring * 0.4
  return new THREE.Vector3(Math.cos(a) * 1.15, 0.4 + ring * 0.62, Math.sin(a) * 1.15)
}

function depositToAssembly(matIndex) {
  let a = assemblies.find((x) => x.state === 'collect')
  if (!a) {
    a = { parts: [], colors: [], group: new THREE.Group(), state: 'collect', cost: forgeCost(), t: 0, robot: null }
    a.group.position.copy(PAD)
    scene.add(a.group)
    assemblies.push(a)
  }

  const i = a.parts.length
  const cube = new THREE.Mesh(cubeGeo, blockMats[matIndex])
  cube.castShadow = true
  cube.scale.setScalar(0.7)
  cube.position.copy(assemblySlot(i))
  cube.userData.born = performance.now()
  cube.userData.slot = cube.position.clone()
  a.group.add(cube)
  a.parts.push(cube)
  a.colors.push(matIndex)

  flash(0.4)
  spawnRing(PAD.x, 0.32, PAD.z, BLOCK_COLORS[matIndex], 1.6, 0.4)

  if (a.parts.length >= a.cost) startForge(a)
  updateHud()
}

// timings for the weld animation
const FORGE_LIFT = 0.45
const FORGE_FLY = 0.55
const FORGE_STAGGER = 0.13

function startForge(a) {
  a.state = 'forge'
  a.t = 0

  // the new robot inherits the hue of the blocks it is made from
  const tally = new Map()
  for (const c of a.colors) tally.set(c, (tally.get(c) || 0) + 1)
  let colorIndex = a.colors[0]
  let best = 0
  for (const [c, n] of tally) if (n > best) { best = n; colorIndex = c }

  const robot = makeRobot(colorIndex)
  robot.position.copy(PAD)
  robot.rotation.y = 0 // keep local space aligned with the assembly group
  setPartsVisible(robot, false)
  robot.userData.carried.visible = false
  scene.add(robot)
  a.robot = robot

  // Assign each delivered cube the piece it is about to become: limbs first,
  // then any surplus, which showers into the chassis. Expensive robots use a
  // tighter stagger so the weld doesn't drag on.
  const targets = robot.userData.parts
  const stagger = Math.min(FORGE_STAGGER, 1.1 / Math.max(1, a.parts.length - 1))
  for (let i = 0; i < a.parts.length; i++) {
    const cube = a.parts[i]
    const part = i < targets.length ? targets[i] : null
    cube.userData.part = part
    cube.userData.lift = cube.userData.slot.clone().add(
      new THREE.Vector3(rand(-0.5, 0.5), 1.5 + rand(0, 0.6), rand(-0.5, 0.5))
    )
    cube.userData.dest = part
      ? part.at.clone()
      : new THREE.Vector3(rand(-0.3, 0.3), 0.95 + rand(-0.3, 0.3), rand(-0.2, 0.2))
    cube.userData.destScale = part ? part.size : 0.2
    cube.userData.start = FORGE_LIFT + i * stagger
    cube.userData.landed = false
    cube.userData.tumble = new THREE.Vector3(rand(-9, 9), rand(-9, 9), rand(-9, 9))
  }
  a.duration = FORGE_LIFT + (a.parts.length - 1) * stagger + FORGE_FLY + 0.25

  flash(0.7)
  spawnRing(PAD.x, 0.32, PAD.z, 0xffd166, 3.4, 0.6)
}

const _from = new THREE.Vector3()
function updateForge(a, dt) {
  a.t += dt
  const robot = a.robot

  for (const cube of a.parts) {
    const cu = cube.userData
    if (cu.landed) continue

    if (a.t < cu.start) {
      // rise off the pad, spinning, waiting its turn
      const k = clamp(a.t / FORGE_LIFT, 0, 1)
      const e = easeOut(k)
      cube.position.lerpVectors(cu.slot, cu.lift, e)
      cube.rotation.x += cu.tumble.x * dt * 0.25
      cube.rotation.y += cu.tumble.y * dt * 0.25
      continue
    }

    const k = clamp((a.t - cu.start) / FORGE_FLY, 0, 1)
    const e = easeInOut(k)
    _from.copy(cu.lift)
    cube.position.lerpVectors(_from, cu.dest, e)
    cube.position.y += Math.sin(k * Math.PI) * 0.35 // little arc on the way in
    cube.scale.setScalar(0.7 + (cu.destScale - 0.7) * e)
    const spin = (1 - e)
    cube.rotation.x += cu.tumble.x * dt * spin
    cube.rotation.y += cu.tumble.y * dt * spin
    cube.rotation.z += cu.tumble.z * dt * spin

    if (k >= 1) {
      cu.landed = true
      cube.visible = false
      const world = cu.dest
      if (cu.part) {
        // the block *becomes* the limb: pop it in oversized, then settle
        popPart(cu.part)
        burst(PAD.x + world.x, world.y, PAD.z + world.z, 5, true, 2.2)
      } else {
        // spare material: absorbed into the chassis in a shower of sparks
        burst(PAD.x + world.x, world.y, PAD.z + world.z, 7, false, 3)
      }
      spawnRing(PAD.x + world.x, 0.32, PAD.z + world.z, 0xffe9a8, 1.1, 0.35)
      flash(0.35)
    }
  }

  // parts that just welded on squash back to their real size
  updatePartPops(robot, dt)

  if (a.t >= a.duration) finishForge(a)
}

function finishForge(a) {
  const robot = a.robot
  // a cheap build (fewer blocks than the robot has pieces) sprouts the
  // leftover limbs in the closing flash
  for (const p of robot.userData.parts) if (!p.obj.visible) popPart(p)
  scene.remove(a.group)
  assemblies.splice(assemblies.indexOf(a), 1)

  // the newborn wakes up and joins the swarm
  robot.userData.prevX = robot.position.x
  robot.userData.prevZ = robot.position.z
  robot.userData.state = 'birth'
  robot.userData.birthT = 0
  robots.push(robot)


  flash(1)
  spawnRing(PAD.x, 0.32, PAD.z, 0x9affe6, 4.5, 0.7)
  burst(PAD.x, 1.4, PAD.z, 16, false, 5)
  updateHud()
}

// pop-in animation for freshly delivered blocks waiting on the pad
function animateAssemblies(now, dt, t) {
  for (let i = assemblies.length - 1; i >= 0; i--) {
    const a = assemblies[i]
    if (a.state === 'forge') { updateForge(a, dt); continue }
    for (let j = 0; j < a.parts.length; j++) {
      const c = a.parts[j]
      const age = (now - c.userData.born) / 220
      c.scale.setScalar(age < 1 ? 0.7 * (0.2 + 0.8 * easeOut(age)) : 0.7)
      c.position.y = c.userData.slot.y + Math.sin(t * 3 + j) * 0.05
      c.rotation.y = t * 0.5 + j
    }
  }
}

// --- Block idle animation -------------------------------------------------
function animateBlocks(t) {
  for (const b of blocks) {
    b.rotation.y = t * 0.6 * b.userData.spin
    b.position.y = 0.35 + Math.sin(t * 2 + b.position.x) * 0.06
  }
}

// Replenish blocks so robots never starve. Supply rises only slightly with the
// swarm — it is the brake on how fast the foundry can keep forging.
let blockTimer = 0
const blockInterval = () => clamp(1.5 / (1 + robots.length * 0.03), 0.55, 1.5)

// --- Camera: slow turntable orbit, easing out as the swarm grows ----------
let camAngle = 0
let camDist = 30
function updateCamera(dt) {
  camAngle += dt * 0.12
  const want = 30 + Math.min(robots.length, 70) * 0.16
  camDist += (want - camDist) * Math.min(1, dt * 0.5)
  camera.position.set(Math.cos(camAngle) * camDist, 19 + (camDist - 30) * 0.35, Math.sin(camAngle) * camDist)
  camera.lookAt(0, 1.5, 0)
}

// --- Main loop ------------------------------------------------------------
const clock = new THREE.Clock()
function loop() {
  requestAnimationFrame(loop)
  const dt = Math.min(clock.getDelta(), 0.05)
  const t = clock.elapsedTime
  const now = performance.now()

  blockTimer += dt
  if (blockTimer > blockInterval()) { blockTimer = 0; spawnBlock() }

  for (const r of robots) updateRobot(r, dt, t)
  resolveCollisions()

  animateBlocks(t)
  updateDebris(dt)
  animateAssemblies(now, dt, t)
  updateRings(dt)
  updateSparks(dt)

  // pad pulses gently, and flares bright when a robot is forged
  if (forgeFlash > 0) forgeFlash = Math.max(0, forgeFlash - dt * 1.6)
  padMat.emissiveIntensity = 0.35 + Math.sin(t * 2) * 0.08 + forgeFlash * 1.6

  updateCamera(dt)
  renderer.render(scene, camera)
}
loop()

// --- Resize ---------------------------------------------------------------
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
})

