import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Tilt City — a low-poly miniature town. Cars & trucks pick a destination,
// pathfind along a street grid, stop at red lights and behind other vehicles,
// then on arrival pick a new goal. A faked tilt-shift look (steep camera +
// CSS blur bands + toy colors) sells the "miniature" feel.
// ---------------------------------------------------------------------------

// --- Grid configuration ---------------------------------------------------
const GRID = 6 // GRID x GRID intersections
const SPACING = 12 // world units between intersections
const ROAD_W = 3.5 // road width
const HALF = (SPACING * (GRID - 1)) / 2 // center the city on origin
const LANE = 0.9 // lane offset from road centerline
const VEHICLE_COUNT = 20

// Convert grid index (i,j) -> world (x,z) of an intersection node
const nodeX = (i) => i * SPACING - HALF
const nodeZ = (j) => j * SPACING - HALF

// --- Renderer / scene / camera --------------------------------------------
const app = document.getElementById('app')
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
app.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xafe3f0)
scene.fog = new THREE.Fog(0xafe3f0, 70, 160)

const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 500)
// Steep, near-top-down angle for the miniature look
const CAM_R = 60
const CAM_Y = 78
camera.position.set(CAM_R, CAM_Y, CAM_R)
camera.lookAt(0, 0, 0)

// --- Lights ---------------------------------------------------------------
scene.add(new THREE.HemisphereLight(0xffffff, 0x8899aa, 0.8))
const sun = new THREE.DirectionalLight(0xfff2d6, 1.1)
sun.position.set(40, 80, 30)
sun.castShadow = true
sun.shadow.mapSize.set(2048, 2048)
const s = HALF + SPACING
sun.shadow.camera.left = -s
sun.shadow.camera.right = s
sun.shadow.camera.top = s
sun.shadow.camera.bottom = -s
sun.shadow.camera.near = 1
sun.shadow.camera.far = 200
scene.add(sun)

// --- Ground ---------------------------------------------------------------
const groundSize = SPACING * (GRID + 1)
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(groundSize, groundSize),
  new THREE.MeshStandardMaterial({ color: 0x6fbf73 }) // toy grass green
)
ground.rotation.x = -Math.PI / 2
ground.position.y = -0.05
ground.receiveShadow = true
scene.add(ground)

// --- Roads ----------------------------------------------------------------
// One thin dark box per row and per column.
const roadMat = new THREE.MeshStandardMaterial({ color: 0x40444c })
const roadLen = SPACING * (GRID - 1) + ROAD_W
const roadGeo = new THREE.BoxGeometry(roadLen, 0.1, ROAD_W)
for (let j = 0; j < GRID; j++) {
  const r = new THREE.Mesh(roadGeo, roadMat) // horizontal road (along X)
  r.position.set(0, 0, nodeZ(j))
  r.receiveShadow = true
  scene.add(r)
  const c = new THREE.Mesh(roadGeo, roadMat) // vertical road (along Z)
  c.position.set(nodeX(j), 0, 0)
  c.rotation.y = Math.PI / 2
  c.receiveShadow = true
  scene.add(c)
}

// --- Buildings (in each block between roads) ------------------------------
const buildingMat = [
  0xff8a5b, 0xffd166, 0x06d6a0, 0x4cc9f0, 0xf15bb5, 0xe5e5e5, 0xc77dff,
].map((c) => new THREE.MeshStandardMaterial({ color: c }))
const boxGeo = new THREE.BoxGeometry(1, 1, 1) // shared unit cube, scaled per instance

function addBuilding(cx, cz, color) {
  const w = 3 + Math.random() * 3
  const d = 3 + Math.random() * 3
  const h = 2 + Math.random() * 9
  const m = new THREE.Mesh(boxGeo, color)
  m.scale.set(w, h, d)
  m.position.set(
    cx + (Math.random() - 0.5) * 2,
    h / 2,
    cz + (Math.random() - 0.5) * 2
  )
  m.castShadow = true
  m.receiveShadow = true
  scene.add(m)
}
for (let i = 0; i < GRID - 1; i++) {
  for (let j = 0; j < GRID - 1; j++) {
    const cx = (nodeX(i) + nodeX(i + 1)) / 2
    const cz = (nodeZ(j) + nodeZ(j + 1)) / 2
    const n = 1 + (Math.random() < 0.5 ? 1 : 0)
    for (let k = 0; k < n; k++) {
      addBuilding(cx, cz, buildingMat[(i + j + k) % buildingMat.length])
    }
  }
}

// --- Traffic lights -------------------------------------------------------
// Each interior intersection has a light cycling NS-green / EW-green.
// Phase: which axis is currently allowed to go.
const lightGeoBox = new THREE.BoxGeometry(0.4, 2.4, 0.4)
const poleMat = new THREE.MeshStandardMaterial({ color: 0x333333 })
const greenMat = new THREE.MeshStandardMaterial({
  color: 0x18d23a,
  emissive: 0x0a7d1c,
})
const redMat = new THREE.MeshStandardMaterial({
  color: 0xff2a2a,
  emissive: 0x8a0000,
})
const bulbGeo = new THREE.SphereGeometry(0.45, 12, 12)

const lights = [] // { i, j, x, z, nsGreen, bulbs:[mesh,mesh,...] }
const CYCLE = 5.0 // seconds each phase lasts
for (let i = 0; i < GRID; i++) {
  for (let j = 0; j < GRID; j++) {
    const x = nodeX(i)
    const z = nodeZ(j)
    const light = { i, j, x, z, nsGreen: (i + j) % 2 === 0, bulbs: [] }
    // small pole + bulb on a corner of the intersection
    const pole = new THREE.Mesh(lightGeoBox, poleMat)
    pole.position.set(x + 2, 1.2, z + 2)
    pole.castShadow = true
    scene.add(pole)
    const bulb = new THREE.Mesh(bulbGeo, greenMat)
    bulb.position.set(x + 2, 2.6, z + 2)
    scene.add(bulb)
    light.bulbs.push(bulb)
    lights.push(light)
  }
}
// quick lookup of light by intersection index
const lightAt = (i, j) => lights[i * GRID + j]

function updateLights(t) {
  const phaseNS = Math.floor(t / CYCLE) % 2 === 0
  for (const L of lights) {
    // alternate base phase by checkerboard so neighbors differ a bit
    const base = (L.i + L.j) % 2 === 0
    L.nsGreen = base ? phaseNS : !phaseNS
    const mat = L.nsGreen ? greenMat : redMat
    for (const b of L.bulbs) b.material = mat
  }
}

// Can a vehicle pass through intersection (i,j) while travelling along `axis`?
// axis 'z' = north/south movement, 'x' = east/west movement.
function canGo(i, j, axis) {
  const L = lightAt(i, j)
  if (!L) return true
  return axis === 'z' ? L.nsGreen : !L.nsGreen
}

// --- Vehicles -------------------------------------------------------------
// A vehicle travels node-to-node along the grid. Its "route" is a list of
// intersection indices. We follow them in order, choosing lane offset so cars
// keep to the right and don't collide head-on.
const carBody = new THREE.BoxGeometry(1.6, 0.7, 0.9)
const carCabin = new THREE.BoxGeometry(0.9, 0.5, 0.85)
const truckBody = new THREE.BoxGeometry(2.6, 1.0, 1.0)
const truckCabin = new THREE.BoxGeometry(0.8, 0.8, 1.0)
const wheelGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.0, 8)
const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 })

const carColors = [
  0xff5252, 0xffb703, 0x2ec4b6, 0x3a86ff, 0xff006e, 0x8338ec, 0xfb5607,
  0xffffff, 0x06d6a0,
].map((c) => new THREE.MeshStandardMaterial({ color: c }))

function makeVehicle(isTruck) {
  const g = new THREE.Group()
  const col = carColors[(Math.random() * carColors.length) | 0]
  const body = new THREE.Mesh(isTruck ? truckBody : carBody, col)
  body.position.y = isTruck ? 0.6 : 0.45
  body.castShadow = true
  g.add(body)
  const cabin = new THREE.Mesh(
    isTruck ? truckCabin : carCabin,
    isTruck ? carColors[7] : col
  )
  cabin.position.set(isTruck ? -0.8 : -0.1, isTruck ? 1.0 : 0.95, 0)
  cabin.castShadow = true
  g.add(cabin)
  // wheels
  const len = isTruck ? 2.6 : 1.6
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const w = new THREE.Mesh(wheelGeo, wheelMat)
      w.rotation.x = Math.PI / 2
      w.scale.set(1, 0.5, 1)
      w.position.set(sx * len * 0.3, 0.25, sz * 0.5)
      g.add(w)
    }
  }
  return g
}

// A node position with right-hand lane offset depending on travel direction.
// dir is the unit step (dx,dz) in grid indices we are moving toward.
function lanePos(i, j, dirX, dirZ) {
  const x = nodeX(i)
  const z = nodeZ(j)
  // offset perpendicular to travel, to the right (drive on the right)
  // moving +x -> shift +z ; moving -x -> shift -z ; +z -> shift -x ; -z -> +x
  let ox = 0
  let oz = 0
  if (dirX > 0) oz = LANE
  else if (dirX < 0) oz = -LANE
  else if (dirZ > 0) ox = -LANE
  else if (dirZ < 0) ox = LANE
  return new THREE.Vector3(x + ox, 0, z + oz)
}

// Build a route of intersection [i,j] pairs from start to a random goal via a
// simple Manhattan walk (move in X then in Z). Grid is fully connected so any
// monotone-ish path works; we randomize order of axes for variety.
function buildRoute(si, sj) {
  let gi = (Math.random() * GRID) | 0
  let gj = (Math.random() * GRID) | 0
  // ensure the goal is somewhere else
  if (gi === si && gj === sj) gi = (gi + 1) % GRID
  const route = [[si, sj]]
  let ci = si
  let cj = sj
  const xFirst = Math.random() < 0.5
  const stepX = () => {
    while (ci !== gi) {
      ci += gi > ci ? 1 : -1
      route.push([ci, cj])
    }
  }
  const stepZ = () => {
    while (cj !== gj) {
      cj += gj > cj ? 1 : -1
      route.push([ci, cj])
    }
  }
  if (xFirst) {
    stepX()
    stepZ()
  } else {
    stepZ()
    stepX()
  }
  return route
}

const vehicles = []
for (let n = 0; n < VEHICLE_COUNT; n++) {
  const isTruck = Math.random() < 0.3
  const mesh = makeVehicle(isTruck)
  scene.add(mesh)
  const si = (Math.random() * GRID) | 0
  const sj = (Math.random() * GRID) | 0
  const route = buildRoute(si, sj)
  const v = {
    mesh,
    isTruck,
    speed: isTruck ? 5.5 : 7 + Math.random() * 2,
    route,
    seg: 0, // index of current node in route (heading toward seg+1)
    progress: 0, // 0..1 along current segment
    stuck: 0, // seconds spent unable to advance (drives the deadlock breaker)
    pos: lanePos(si, sj, 0, 0),
  }
  v.mesh.position.copy(v.pos)
  vehicles.push(v)
}

// The unit travel direction of a vehicle's current segment (0 vector if it has
// finished its route this frame).
function heading(o) {
  if (o.seg + 1 >= o.route.length) return new THREE.Vector3()
  const [ai, aj] = o.route[o.seg]
  const [bi, bj] = o.route[o.seg + 1]
  return new THREE.Vector3(Math.sign(bi - ai), 0, Math.sign(bj - aj))
}

// "Stop if blocked ahead" rule. We only queue behind a vehicle that is in the
// SAME lane and travelling the SAME direction — i.e. a real car in front of us.
// Oncoming traffic (in the other lane) and crossing traffic at intersections
// are ignored here: matching against them made two cars freeze facing each
// other, which cascaded into the whole grid locking up. Intersection conflicts
// are handled separately by the traffic lights.
function isBlockedAhead(v) {
  const fwd = heading(v)
  if (fwd.lengthSq() === 0) return false
  const LOOK = v.isTruck ? 3.2 : 2.6
  for (const o of vehicles) {
    if (o === v) continue
    const oFwd = heading(o)
    if (oFwd.lengthSq() === 0 || fwd.dot(oFwd) < 0.5) continue // not going our way
    const to = new THREE.Vector3().subVectors(o.pos, v.pos)
    const forward = to.dot(fwd) // distance directly ahead
    if (forward <= 0.001 || forward > LOOK) continue
    // perpendicular (cross-lane) distance — skip cars in a different lane
    const lateral = Math.hypot(to.x - fwd.x * forward, to.z - fwd.z * forward)
    if (lateral > 1.1) continue
    return true
  }
  return false
}

// --- Animation loop -------------------------------------------------------
const clock = new THREE.Clock()
let elapsed = 0

function updateVehicle(v, dt) {
  // reached end of route -> pick a new goal from current intersection
  if (v.seg + 1 >= v.route.length) {
    const [ci, cj] = v.route[v.route.length - 1]
    v.route = buildRoute(ci, cj)
    v.seg = 0
    v.progress = 0
    return
  }

  const [ai, aj] = v.route[v.seg]
  const [bi, bj] = v.route[v.seg + 1]
  const dirX = Math.sign(bi - ai)
  const dirZ = Math.sign(bj - aj)
  const axis = dirX !== 0 ? 'x' : 'z'

  const from = lanePos(ai, aj, dirX, dirZ)
  const to = lanePos(bi, bj, dirX, dirZ)
  const segLen = from.distanceTo(to)

  // Stop conditions: red light at the node we're approaching, or blocked car.
  // Only obey the light when we're near the end of the segment (the stop line).
  const nearEnd = v.progress > 0.78
  const redAhead = nearEnd && !canGo(bi, bj, axis)
  let blocked = isBlockedAhead(v)

  // Deadlock breaker: if a car has been unable to move for a while (and isn't
  // simply waiting at a red light), let it creep past whatever's stopping it so
  // the grid can never permanently lock up.
  if (blocked && !redAhead && v.stuck > 5) blocked = false

  if (!redAhead && !blocked && segLen > 0) {
    v.progress += (v.speed * dt) / segLen
    v.stuck = 0
  } else {
    v.stuck += dt
  }

  if (v.progress >= 1) {
    v.progress = 0
    v.seg++
    v.pos.copy(to)
  } else {
    v.pos.lerpVectors(from, to, Math.max(0, v.progress))
  }

  v.mesh.position.copy(v.pos)
  // face direction of travel (body's long axis is +x)
  if (dirX !== 0 || dirZ !== 0) {
    v.mesh.rotation.y = Math.atan2(-dirZ, dirX)
  }
}

function animate() {
  requestAnimationFrame(animate)
  const dt = Math.min(clock.getDelta(), 0.05)
  elapsed += dt

  updateLights(elapsed)
  for (const v of vehicles) updateVehicle(v, dt)

  // gentle camera drift in a slow circle around the city
  const a = elapsed * 0.04
  camera.position.x = Math.cos(a) * CAM_R
  camera.position.z = Math.sin(a) * CAM_R
  camera.position.y = CAM_Y + Math.sin(elapsed * 0.15) * 3
  camera.lookAt(0, 0, 0)

  renderer.render(scene, camera)
}

// --- Resize ---------------------------------------------------------------
function resize() {
  const w = window.innerWidth
  const h = window.innerHeight
  renderer.setSize(w, h)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}
window.addEventListener('resize', resize)
resize()
animate()
