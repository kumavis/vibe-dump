import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Robot Foundry
// A cube-world where robots wander a grid, pick up scattered blocks, carry them
// to an assembly pad, and build a brand-new robot block-by-block. The new robot
// then joins the swarm and starts collecting too. Population grows up to a cap,
// then the oldest robot is recycled to keep it lively (and cheap).
// ---------------------------------------------------------------------------

const GRID = 18           // half-extent of the floor in world units
const MAX_ROBOTS = 14     // population cap (recycle oldest beyond this)
const MAX_BLOCKS = 26     // scattered blocks present at once
const BLOCKS_PER_ROBOT = 5 // blocks a robot must deliver to forge a new one

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1a1530)
scene.fog = new THREE.Fog(0x1a1530, 38, 70)

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

// --- Shared geometry / materials (reuse everywhere for performance) -------
const cubeGeo = new THREE.BoxGeometry(1, 1, 1)

const BLOCK_COLORS = [0xff6b6b, 0xffd166, 0x06d6a0, 0x4cc9f0, 0xc77dff, 0xff8fab]
const blockMats = BLOCK_COLORS.map(
  (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.55, metalness: 0.05 })
)

const robotBodyMat = new THREE.MeshStandardMaterial({ color: 0x9aa7d8, roughness: 0.45, metalness: 0.35 })
const robotHeadMat = new THREE.MeshStandardMaterial({ color: 0xe8edff, roughness: 0.5, metalness: 0.2 })
const eyeMat = new THREE.MeshStandardMaterial({ color: 0x101020, emissive: 0x66ffe0, emissiveIntensity: 1.2 })
const legMat = new THREE.MeshStandardMaterial({ color: 0x5b6594, roughness: 0.6 })

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

// --- Helpers --------------------------------------------------------------
const rand = (a, b) => a + Math.random() * (b - a)
const randCell = () => Math.round(rand(-GRID + 1, GRID - 1))

function makeBlock(x, z, matIndex) {
  const m = new THREE.Mesh(cubeGeo, blockMats[matIndex % blockMats.length])
  m.scale.setScalar(0.7)
  m.position.set(x, 0.35, z)
  m.castShadow = true
  m.userData.spin = rand(-1, 1)
  return m
}

// --- Build a small voxel robot --------------------------------------------
function makeRobot() {
  const g = new THREE.Group()

  const body = new THREE.Mesh(cubeGeo, robotBodyMat)
  body.scale.set(0.9, 1.0, 0.7)
  body.position.y = 0.95
  body.castShadow = true
  g.add(body)

  const head = new THREE.Mesh(cubeGeo, robotHeadMat)
  head.scale.set(0.7, 0.55, 0.6)
  head.position.y = 1.75
  head.castShadow = true
  g.add(head)

  // glowing eyes
  const eyeGeo = new THREE.BoxGeometry(0.14, 0.14, 0.08)
  for (const dx of [-0.16, 0.16]) {
    const eye = new THREE.Mesh(eyeGeo, eyeMat)
    eye.position.set(dx, 1.78, 0.32)
    g.add(eye)
  }

  // legs (animated bob targets)
  const legs = []
  for (const dx of [-0.28, 0.28]) {
    const leg = new THREE.Mesh(cubeGeo, legMat)
    leg.scale.set(0.22, 0.45, 0.22)
    leg.position.set(dx, 0.3, 0)
    leg.castShadow = true
    g.add(leg)
    legs.push(leg)
  }

  // a slot above the head to display the block currently carried
  const carried = new THREE.Mesh(cubeGeo, blockMats[0])
  carried.scale.setScalar(0.5)
  carried.position.y = 2.35
  carried.visible = false
  g.add(carried)

  g.userData = {
    state: 'seek',          // seek -> carry -> deliver
    target: null,           // block being pursued
    carriedBlock: carried,  // display mesh for held block
    legs,
    delivered: 0,           // blocks dropped at the pad
    speed: rand(2.2, 3.2),
    phase: rand(0, 10),
    age: 0,
  }
  return g
}

// --- World state ----------------------------------------------------------
const blocks = []
const robots = []
const assemblies = [] // in-progress robots being built on the pad

function spawnBlock() {
  if (blocks.length >= MAX_BLOCKS) return
  const b = makeBlock(randCell(), randCell(), Math.floor(rand(0, blockMats.length)))
  blocks.push(b)
  scene.add(b)
}

function spawnRobot(at) {
  const r = makeRobot()
  if (at) r.position.copy(at)
  else r.position.set(randCell(), 0, randCell())
  robots.push(r)
  scene.add(r)
  // recycle oldest if over cap
  if (robots.length > MAX_ROBOTS) {
    const old = robots.shift()
    scene.remove(old)
  }
  updateCount()
}

function updateCount() {
  const el = document.getElementById('count')
  if (el) el.textContent = `Population: ${robots.length}`
}

// seed the world
for (let i = 0; i < MAX_BLOCKS; i++) spawnBlock()
spawnRobot(new THREE.Vector3(4, 0, 4))
spawnRobot(new THREE.Vector3(-4, 0, -3))
updateCount()

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

// move a group toward an xz target; returns true when arrived
const _dir = new THREE.Vector3()
function moveToward(obj, tx, tz, speed, dt) {
  _dir.set(tx - obj.position.x, 0, tz - obj.position.z)
  const dist = _dir.length()
  if (dist < 0.12) return true
  _dir.normalize()
  const step = Math.min(speed * dt, dist)
  obj.position.x += _dir.x * step
  obj.position.z += _dir.z * step
  // face direction of travel (smoothly)
  const targetRot = Math.atan2(_dir.x, _dir.z)
  let diff = targetRot - obj.rotation.y
  diff = Math.atan2(Math.sin(diff), Math.cos(diff))
  obj.rotation.y += diff * Math.min(1, dt * 10)
  return false
}

// --- Per-robot AI ---------------------------------------------------------
function updateRobot(r, dt, t) {
  const u = r.userData
  u.age += dt

  // walking leg bob
  const moving = u.state !== 'idle'
  const bob = moving ? Math.sin(t * 10 + u.phase) * 0.12 : 0
  u.legs[0].position.y = 0.3 + bob
  u.legs[1].position.y = 0.3 - bob
  // gentle body bounce
  r.children[0].position.y = 0.95 + Math.abs(bob) * 0.4

  if (u.state === 'seek') {
    if (!u.target || u.target.userData.removed) {
      u.target = claimBlock(r)
    }
    if (!u.target) return // nothing to grab; wait for spawns
    const arrived = moveToward(r, u.target.position.x, u.target.position.z, u.speed, dt)
    if (arrived) {
      // pick it up
      const blk = u.target
      const idx = blocks.indexOf(blk)
      if (idx !== -1) blocks.splice(idx, 1)
      scene.remove(blk)
      blk.userData.removed = true
      u.carriedBlock.material = blk.material
      u.carriedBlock.visible = true
      u.state = 'carry'
      u.target = null
    }
  } else if (u.state === 'carry') {
    // little hop animation of carried block
    u.carriedBlock.position.y = 2.35 + Math.sin(t * 8 + u.phase) * 0.08
    const arrived = moveToward(r, PAD.x, PAD.z, u.speed, dt)
    if (arrived) {
      u.carriedBlock.visible = false
      u.delivered++
      depositToAssembly(u.carriedBlock.material)
      u.state = 'seek'
    }
  }
}

// --- Assembly: stack delivered blocks into a new robot --------------------
function depositToAssembly(mat) {
  // find or create an in-progress assembly
  let a = assemblies.find((x) => x.parts.length < BLOCKS_PER_ROBOT)
  if (!a) {
    a = { parts: [], group: new THREE.Group() }
    a.group.position.copy(PAD)
    scene.add(a.group)
    assemblies.push(a)
  }
  // place this block as the next layer of a forming robot
  const i = a.parts.length
  const cube = new THREE.Mesh(cubeGeo, mat)
  cube.castShadow = true
  cube.scale.setScalar(0.6)
  // stack with a tiny wobble so it reads as "under construction"
  cube.position.set(rand(-0.15, 0.15), 0.6 + i * 0.62, rand(-0.15, 0.15))
  cube.userData.born = performance.now()
  a.group.add(cube)
  a.parts.push(cube)

  if (a.parts.length >= BLOCKS_PER_ROBOT) {
    // forge complete: flash, remove scaffold, spawn a real robot here
    scene.remove(a.group)
    assemblies.splice(assemblies.indexOf(a), 1)
    spawnRobot(PAD.clone().add(new THREE.Vector3(rand(-2, 2), 0, rand(-2, 2))))
    // keep the world stocked with blocks to gather
    for (let k = 0; k < BLOCKS_PER_ROBOT; k++) spawnBlock()
  }
}

// pop-in animation for freshly placed assembly cubes
function animateAssemblies(now) {
  for (const a of assemblies) {
    for (const c of a.parts) {
      const age = (now - c.userData.born) / 220
      if (age < 1) {
        const e = 1 - Math.pow(1 - age, 3) // ease-out
        c.scale.setScalar(0.6 * (0.2 + 0.8 * e))
      } else {
        c.scale.setScalar(0.6)
      }
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

// occasionally replenish blocks so robots never starve
let blockTimer = 0

// --- Camera: slow turntable orbit ----------------------------------------
let camAngle = 0
function updateCamera(dt) {
  camAngle += dt * 0.12
  const r = 30
  camera.position.set(Math.cos(camAngle) * r, 19, Math.sin(camAngle) * r)
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
  if (blockTimer > 1.5) { blockTimer = 0; spawnBlock() }

  for (const r of robots) updateRobot(r, dt, t)
  animateBlocks(t)
  animateAssemblies(now)
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
