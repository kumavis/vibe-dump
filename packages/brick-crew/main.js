import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import {
  SITE, YARD, PLOTS, DEPOT, COURSE, COLORS, SHIFT_SECONDS, PREROLL_SECONDS,
  HOUSE_TYPES, PAINT, MATERIALS, KIT_LEAD_SECONDS, DAY_SECONDS, houseGeom,
} from './src/config.js'
import { orders } from './src/orders.js'
import { buildPlan } from './src/plan.js'
import { buildSite, buildSky, buildLights } from './src/site.js'
import {
  buildStock, buildDrop, buildMixer, buildScaffold, buildCone, buildToolCrate,
  buildDumpster, buildPrivy, buildSpoilHeap, buildSign, buildRoadArrow,
} from './src/props.js'
import { setGeom, setObstacles } from './src/nav.js'
import { createSim } from './src/sim.js'
import { createTruckRig } from './src/fitout.js'
import { createDepot } from './src/depot.js'
import { createUI } from './src/ui.js'
import { drawBlueprint } from './src/blueprint.js'

// ---------------------------------------------------------------------------
// Brick Crew — a robot gang works its way down a street.
//
// On each plot they raise a brick house course by course, fetching the right
// material for whatever they are setting; the joiners bring the furniture in;
// the decorators put a coat on it; and then the whole outfit moves next door and
// starts a different house. At the head of the street is the builders'
// merchant, where the crews are kitted out and the material comes from — the
// arrow on the road runs you up to it.
//
// ?seed=N reseeds the street.
// ---------------------------------------------------------------------------

const params = new URLSearchParams(location.search)
const SEED = (parseInt(params.get('seed'), 10) || 20250801) >>> 0

function makeRng(seed) {
  let a = seed >>> 0
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// --- renderer --------------------------------------------------------------

const canvas = document.getElementById('scene')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.02
renderer.outputColorSpace = THREE.SRGBColorSpace

const scene = new THREE.Scene()
scene.fog = new THREE.Fog(0xb9d4e6, 70, 240)

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 500)
camera.position.set(13.6, 5.9, 12.5)

const controls = new OrbitControls(camera, canvas)
controls.target.set(0.3, 1.7, 1.5)
controls.enableDamping = true
controls.dampingFactor = 0.07
controls.maxPolarAngle = Math.PI * 0.487
controls.minDistance = 5
controls.maxDistance = 60
controls.autoRotate = true
controls.autoRotateSpeed = 0.28

function resize() {
  renderer.setSize(innerWidth, innerHeight, false)
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
}
addEventListener('resize', resize)
resize()

// --- stage -----------------------------------------------------------------

const rng = makeRng(SEED)
const ui = createUI({
  onSheetOpen: () => (controls.autoRotate = false),
  onSheetClose: () => {},
})
ui.setLoading(0.06, 'pegging out…')

const sky = buildSky()
scene.add(sky.mesh)
const lights = buildLights()
scene.add(lights.group)
const site = buildSite(rng)
scene.add(site.group)

ui.setLoading(0.26, 'putting up the hoarding…')

// the two arrows on the tarmac, and the places they run between
// the merchant is up the road in -X, the site back down it in +X
const toDepot = buildRoadArrow("BUILDERS' MERCHANT", -1)
toDepot.group.position.set(SITE.arrow.x, 0, SITE.arrow.z)
scene.add(toDepot.group)

const depot = createDepot({ origin: DEPOT, rng })
scene.add(depot.group)

const toSite = buildRoadArrow('BACK TO SITE', +1)
toSite.group.position.set(DEPOT.x + 10.5, 0, DEPOT.z)
scene.add(toSite.group)

ui.setLoading(0.44, 'opening the merchant…')

// --- the street ------------------------------------------------------------
//
// Each plot gets two groups at its position on the road: the house, which stays
// standing once it is finished, and the working site, which packs up and
// follows the crew next door.

/** A unit window frame: four bars round an empty middle, so you can see through it. */
function frameGeometry() {
  const bar = 0.09
  const parts = [
    new THREE.BoxGeometry(1, bar, 1).translate(0, (1 - bar) / 2, 0),
    new THREE.BoxGeometry(1, bar, 1).translate(0, -(1 - bar) / 2, 0),
    new THREE.BoxGeometry(bar, 1 - bar * 2, 1).translate((1 - bar) / 2, 0, 0),
    new THREE.BoxGeometry(bar, 1 - bar * 2, 1).translate(-(1 - bar) / 2, 0, 0),
    // a glazing bar down the middle
    new THREE.BoxGeometry(bar * 0.6, 1 - bar * 2, 0.55).translate(0, 0, 0),
  ]
  return mergeGeometries(parts)
}
const FRAME_GEO = frameGeometry()

const FAMILIES = {
  masonry: { roughness: 0.94, metalness: 0 },
  timber: { roughness: 0.88, metalness: 0 },
  tile: { roughness: 0.66, metalness: 0.05 },
  frame: { roughness: 0.6, metalness: 0.05 },
  glass: {
    roughness: 0.08, metalness: 0.25, transparent: true, opacity: 0.42,
    side: THREE.DoubleSide, depthWrite: false,
  },
}

const _m4 = new THREE.Matrix4()
const _q = new THREE.Quaternion()
const _e = new THREE.Euler()
const _v = new THREE.Vector3()
const _s = new THREE.Vector3()
const _c = new THREE.Color()
const ZERO = new THREE.Vector3(0, 0, 0)

let plan = null
let sim = null
let meshes = null
let mortarMesh = null
let scaffold = null
let stocks = null
let drops = null
let mixer = null
let truckRig = null
let houseGroup = null
let workGroup = null
let plotIndex = -1
let day = 0
let toppingFlag = null
// The robot the camera is riding along with. Declared up here because
// startPlot() clears it, and startPlot runs during module init.
let followed = null
const standing = [] // finished houses left on the street

function makeFamily(count, opts, family) {
  const mesh = new THREE.InstancedMesh(
    family === 'frame' ? FRAME_GEO : new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial(opts),
    Math.max(1, count),
  )
  if (family === 'glass') mesh.renderOrder = 2
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.frustumCulled = false
  for (let i = 0; i < mesh.count; i++) {
    _m4.compose(ZERO, _q.identity(), ZERO)
    mesh.setMatrixAt(i, _m4)
  }
  mesh.instanceMatrix.needsUpdate = true
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  return mesh
}

/** Reveal one plan item (or one mortar bed) at its final transform. */
function reveal(item, isMortar) {
  if (isMortar) {
    const i = plan.mortar.indexOf(item)
    _v.set(item.pos[0], item.pos[1], item.pos[2])
    _s.set(item.size[0], item.size[1], item.size[2])
    _m4.compose(_v, _q.identity(), _s)
    mortarMesh.setMatrixAt(i, _m4)
    mortarMesh.instanceMatrix.needsUpdate = true
    return
  }
  const mesh = meshes[item.family]
  _e.set(item.euler[0], item.euler[1], 0, 'YXZ')
  _q.setFromEuler(_e)
  _v.set(item.pos[0], item.pos[1], item.pos[2])
  _s.set(item.size[0], item.size[1], item.size[2])
  _m4.compose(_v, _q, _s)
  mesh.setMatrixAt(item.slot, _m4)
  mesh.instanceMatrix.needsUpdate = true
}

/** A decorator has finished a patch: those bricks take the new colour. */
function paintPatch(patch) {
  const mesh = meshes.masonry
  _c.setHex(plan.paint.color)
  for (const slot of patch.slots) mesh.setColorAt(slot, _c)
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  // the joints go with them, a shade lighter
  const p = sim ? sim.painting : { done: 0, total: 1 }
  mortarMesh.material.color
    .setHex(COLORS.mortar)
    .lerp(_c.setHex(plan.paint.color).offsetHSL(0, -0.1, 0.14), p.done / Math.max(1, p.total))
}

function paintFamily(mesh, list, family) {
  for (const it of list) {
    if (it.family !== family) continue
    mesh.setColorAt(it.slot, _c.setHex(it.color))
  }
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
}

// --- topping-out flag ------------------------------------------------------

function buildTopOut() {
  const g = new THREE.Group()
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 1.0, 8),
    new THREE.MeshStandardMaterial({ color: 0x8f6538, roughness: 0.9 }),
  )
  pole.position.y = 0.5
  g.add(pole)
  for (let i = 0; i < 3; i++) {
    const leaf = new THREE.Mesh(
      new THREE.ConeGeometry(0.24 - i * 0.06, 0.3, 7),
      new THREE.MeshStandardMaterial({ color: 0x3f7d4e, roughness: 0.95 }),
    )
    leaf.position.y = 0.66 + i * 0.16
    g.add(leaf)
  }
  const flag = new THREE.Mesh(
    new THREE.PlaneGeometry(0.42, 0.24),
    new THREE.MeshStandardMaterial({ color: 0xf0b429, roughness: 0.9, side: THREE.DoubleSide }),
  )
  flag.position.set(0.21, 0.9, 0)
  g.add(flag)
  g.traverse((o) => (o.castShadow = true))
  return g
}

// --- start a plot ----------------------------------------------------------

function startPlot(first) {
  const carriedClock = sim ? sim.clockT : 0
  followed = null
  ui.setFollow(null)
  sim?.dispose()
  if (workGroup) scene.remove(workGroup)

  plotIndex = (plotIndex + 1) % PLOTS.length
  day++
  // once the street is full, the developer clears it and starts again
  if (plotIndex === 0 && !first) {
    for (const g of standing.splice(0)) scene.remove(g)
  }
  const origin = PLOTS[plotIndex]
  // whatever the orders panel asked for, else the next one down the street
  const geom = houseGeom(orders.takeHouse(day))
  const paint = orders.takePaint(day)

  plan = buildPlan(rng, { geom, day, plotIndex, paint })
  setGeom(geom, plan.doorway)
  refreshObstacles(origin)

  houseGroup = new THREE.Group()
  houseGroup.position.set(origin.x, 0, origin.z)
  houseGroup.userData.plot = plotIndex
  houseGroup.userData.geom = geom
  scene.add(houseGroup)
  standing.push(houseGroup)

  workGroup = new THREE.Group()
  workGroup.position.set(origin.x, 0, origin.z)
  scene.add(workGroup)

  meshes = {}
  for (const [family, opts] of Object.entries(FAMILIES)) {
    const m = makeFamily(plan.familyCount[family], opts, family)
    meshes[family] = m
    houseGroup.add(m)
    paintFamily(m, plan.items, family)
  }
  mortarMesh = makeFamily(plan.mortar.length, { color: COLORS.mortar, roughness: 0.98, metalness: 0 })
  houseGroup.add(mortarMesh)

  const topOut = buildTopOut()
  topOut.position.set(0, geom.ridgeY + 0.2, 0)
  topOut.visible = false
  houseGroup.add(topOut)

  // --- the working site ---------------------------------------------------
  scaffold = buildScaffold(geom)
  workGroup.add(scaffold.group)

  stocks = {}
  drops = {}
  for (const m of MATERIALS) {
    const st = buildStock(m, rng)
    const at = YARD.stacks[m.key]
    st.group.position.set(at.x, 0, at.z)
    workGroup.add(st.group)
    stocks[m.key] = st

    const dp = buildDrop(m, rng)
    const dat = YARD.sources[m.key]
    dp.group.position.set(dat.x, 0, dat.z)
    dp.group.rotation.y = (rng() - 0.5) * 0.3
    workGroup.add(dp.group)
    drops[m.key] = dp

    const label = buildSign(m.label)
    label.scale.setScalar(0.42)
    label.position.set(at.x, 0, at.z - 1.0)
    workGroup.add(label)
  }
  stocks.brick.setCount(24)
  for (const m of MATERIALS) drops[m.key].setCount(drops[m.key].capacity)

  mixer = buildMixer(rng)
  mixer.group.position.set(YARD.mixer.x, 0, YARD.mixer.z)
  mixer.group.rotation.y = -0.5
  workGroup.add(mixer.group)

  const skip = buildDumpster(rng)
  skip.position.set(YARD.dumpster.x, 0, YARD.dumpster.z)
  skip.rotation.y = 0.4
  workGroup.add(skip)

  const privy = buildPrivy(rng)
  privy.position.set(YARD.privy.x, 0, YARD.privy.z)
  workGroup.add(privy)

  const spoil = buildSpoilHeap(rng)
  spoil.position.set(-7.2, 0, -4.4)
  workGroup.add(spoil)

  for (const [x, z] of [[-3.6, -5.0], [5.6, -4.4]]) {
    const crate = buildToolCrate(rng)
    crate.position.set(x, 0, z)
    workGroup.add(crate)
  }
  for (let i = 0; i < 8; i++) {
    const cone = buildCone(rng)
    const a = (i / 8) * Math.PI * 2
    cone.position.set(Math.cos(a) * (5.4 + rng() * 2.2), 0, 5.0 + Math.sin(a) * 2.0)
    workGroup.add(cone)
  }

  truckRig = createTruckRig({ group: workGroup, houseGroup, plan, origin, rng })

  sim = createSim({
    plan,
    rng,
    group: workGroup,
    origin,
    stocks,
    drops,
    scaffold,
    truck: truckRig,
    clock0: carriedClock,
    onPlace: reveal,
    onPaint: paintPatch,
    onBanner: (t, s, a) => ui.banner(t, s, a),
    requestCrew: () => depot.take(),
    onStage: (s) => {
      if (s === 'fitout') topOut.visible = true
    },
    onComplete: () => {},
  })

  toppingFlag = topOut
  if (first) {
    sim.preroll(PREROLL_SECONDS)
    // The site starts mid-shift, so the line has no time to build the first
    // relief crew. It has one standing on the muster bay already — the yard
    // was working before anyone looked at it.
    depot.prime(sim.nextCrew(), orders.roles())
  }

  // frame whichever plot the crew is actually on
  framePlot(origin)
  if (first) {
    camera.position.copy(camGoal.pos)
    controls.target.copy(camGoal.target)
    flying = 0
  } else {
    flying = 1
  }
}

/**
 * Everything on the street the crew has to walk round: the houses already
 * standing on the other plots, and the site office. Given to the router in the
 * current plot's coordinates.
 */
function refreshObstacles(origin) {
  const boxes = []
  for (const h of standing) {
    if (h.userData.plot === plotIndex) continue
    const g = h.userData.geom
    boxes.push({
      x: h.position.x - origin.x,
      z: h.position.z - origin.z,
      hw: g.w / 2 + 0.4,
      hd: g.d / 2 + 0.4,
    })
  }
  boxes.push({ x: SITE.trailer.x - origin.x, z: SITE.trailer.z - origin.z, hw: 3.3, hd: 2.2 })
  setObstacles(boxes)
}

/**
 * The yard works on the next shift for as long as it has to build it. The
 * roster it builds to is whatever the orders panel is showing — but only at
 * the moment the order goes in. Change it after that and it lands the shift
 * after, which is what the panel's note says.
 */
function orderNextCrew() {
  if (sim.secondsToShiftChange() < KIT_LEAD_SECONDS) depot.prepare(sim.nextCrew(), orders.roles())
}

/**
 * Run the site and the yard forward without drawing anything. Used to check
 * long-running behaviour without waiting out a shift in real time.
 */
function fastForward(seconds) {
  const h = 1 / 20
  for (let t = 0; t < seconds; t += h) {
    orderNextCrew()
    depot.update(h, t)
    sim.update(h)
    if (sim.finished && sim.stageT > 14) startPlot(false)
  }
}

/** Look over the hoarding into a plot, from the road side. */
function framePlot(origin) {
  camGoal.pos.set(origin.x + 12.4, 8.0, origin.z + 15.0)
  camGoal.target.set(origin.x + 0.2, 1.5, origin.z + 0.4)
}

// --- camera moves ----------------------------------------------------------

const camGoal = { pos: new THREE.Vector3(12.4, 8.0, 15.0), target: new THREE.Vector3(0.2, 1.5, 0.4) }
let view = 'site'
let flying = 0

function flyTo(next) {
  view = next
  flying = 1
  controls.autoRotate = false
  if (next === 'depot') {
    camGoal.pos.set(DEPOT.x + 7.0, 16.5, DEPOT.z + 19.0)
    camGoal.target.set(DEPOT.x - 2.0, 2.0, DEPOT.z - 10.5)
    ui.setHint(false)
    ui.banner("BUILDERS' MERCHANT", 'the crews and the material both start here', '#f0b429')
  } else {
    framePlot(PLOTS[plotIndex])
  }
}

ui.setLoading(0.7, 'reading the drawings…')
startPlot(true)
ui.setLoading(0.92, 'signing the crew on…')

// --- picking ---------------------------------------------------------------

const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
let hovering = null
let downAt = null
let sheetSeen = false

function pick(cx, cy) {
  pointer.set((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1)
  raycaster.setFromCamera(pointer, camera)
  const arrow = view === 'site' ? toDepot : toSite
  if (raycaster.intersectObject(arrow.hit, false).length) return { kind: 'arrow' }
  if (view === 'site' && raycaster.intersectObjects(site.trailerTargets, false).length) return { kind: 'trailer' }
  if (view === 'site') {
    const hit = raycaster.intersectObjects(sim.hitboxes, false)[0]
    if (hit) return { kind: 'robot', robot: hit.object.userData.robot }
  }
  return null
}

canvas.addEventListener('pointermove', (e) => {
  if (ui.isSheetOpen()) return
  const hit = pick(e.clientX, e.clientY)
  const kind = hit ? hit.kind : null
  if (kind !== hovering) {
    hovering = kind
    site.setTrailerHighlight(kind === 'trailer')
    site.trailerLabel.visible = kind === 'trailer'
    canvas.style.cursor = kind ? 'pointer' : ''
  }
})
canvas.addEventListener('pointerdown', (e) => {
  controls.autoRotate = false
  downAt = [e.clientX, e.clientY]
})
canvas.addEventListener('pointerup', (e) => {
  if (!downAt) return
  const moved = Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1])
  downAt = null
  if (moved > 6) return
  const hit = pick(e.clientX, e.clientY)
  if (!hit) {
    follow(null)
  } else if (hit.kind === 'trailer') {
    ui.toggleSheet()
    sheetSeen = true
    ui.setHint(false)
  } else if (hit.kind === 'arrow') {
    follow(null)
    flyTo(view === 'site' ? 'depot' : 'site')
  } else if (hit.kind === 'robot') {
    follow(hit.robot)
  }
})
canvas.addEventListener('pointerleave', () => {
  hovering = null
  site.setTrailerHighlight(false)
  site.trailerLabel.visible = false
})

/**
 * Ride along with one robot. The camera keeps whatever angle and distance the
 * user has orbited to and just tracks the target, so following never yanks the
 * view about.
 */
ui.onDropFollow(() => follow(null))
ui.onHoldFollow(() => {
  if (!followed) return
  sim.hold(followed)
  ui.setFollow(sim.describe(followed))
})
function follow(r) {
  followed = r && !r.dead ? r : null
  controls.autoRotate = false
  ui.setFollow(followed ? sim.describe(followed) : null)
}

// --- blueprint state -------------------------------------------------------

const sheetCtx = ui.sheetCanvas.getContext('2d')

function builtByGroup() {
  const tally = new Map()
  for (let i = 0; i < plan.items.length; i++) {
    const it = plan.items[i]
    if (it.course == null || !it.group) continue
    let g = tally.get(it.group)
    if (!g) tally.set(it.group, (g = []))
    if (!g[it.course]) g[it.course] = [0, 0]
    g[it.course][1]++
    if (sim.isPlaced(i)) g[it.course][0]++
  }
  const out = {}
  for (const [key, courses] of tally) {
    let v = 0
    for (let c = 0; c < courses.length; c++) {
      const e = courses[c]
      if (!e) continue
      if (e[0] >= e[1]) v = c + 1
      else {
        v = c + e[0] / e[1]
        break
      }
    }
    out[key] = v
  }
  return out
}

function blueprintState() {
  const phases = sim.phaseProgress()
  const roof = phases.find((p) => p.key === 'roof')
  const tiles = phases.find((p) => p.key === 'tiles')
  const g = plan.geom
  return {
    title: plan.title,
    house: {
      w: g.w,
      d: g.d,
      t: g.t,
      wallCourses: g.wallCourses,
      gableCourses: g.gableCourses,
      eaveY: g.eaveY,
      ridgeY: g.ridgeY,
      courseH: COURSE,
    },
    openings: plan.openings,
    chimney: g.chimney,
    furniture: plan.furniture.map((f, i) => ({
      name: f.name, at: f.at, size: f.size, rot: f.rot, done: sim.furnitureDone(i),
    })),
    decor: {
      name: plan.paint.name,
      css: `#${plan.paint.color.toString(16).padStart(6, '0')}`,
      done: sim.painting.done,
      total: sim.painting.total,
    },
    fitout: sim.fitout,
    phases,
    built: builtByGroup(),
    roofDone: roof ? roof.done / Math.max(1, roof.total) : 0,
    tilesDone: tiles ? tiles.done / Math.max(1, tiles.total) : 0,
    placed: sim.placed,
    total: sim.total,
    etaSeconds: sim.etaSeconds(),
    ratePerMin: sim.ratePerMin(),
    shift: {
      index: sim.shiftIndex,
      crewName: sim.crew.name,
      secondsLeft: sim.secondsToShiftChange(),
      lengthSeconds: SHIFT_SECONDS,
    },
    revealed: ui.sheetReveal(),
    day,
  }
}

// --- run loop --------------------------------------------------------------

const clock = new THREE.Clock()
let hudTimer = 0
let hintTimer = 0
const STEP = 1 / 30
let acc = 0

ui.setLoading(1, 'on site')

renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.25)
  const t = clock.elapsedTime

  // The site runs at whatever multiple the orders panel is set to; the camera,
  // the paper and the banners stay on wall time so the place still feels calm
  // when the work is racing. The step cap scales with the multiplier, or ×8
  // would just clip back to ×2 on a busy frame.
  const speed = orders.speed
  acc += dt * speed
  let steps = 0
  const maxSteps = 8 * speed
  while (acc >= STEP && steps < maxSteps) {
    sim.update(STEP)
    acc -= STEP
    steps++
  }
  if (steps === maxSteps) acc = 0

  // one turn of the sun per plot, roughly: low and warm at either end of the
  // day, high and white in the middle. It never gets dark — this is a building
  // site, not a mood piece.
  const dayPhase = (sim.clockT % DAY_SECONDS) / DAY_SECONDS
  const arc = Math.PI * (0.12 + dayPhase * 0.76)
  const elev = Math.sin(arc)
  lights.sun.position.set(Math.cos(arc) * -26, 6 + elev * 20, 12 + Math.cos(arc) * 6)
  const warmth = 1 - elev
  lights.sun.color.setRGB(1, 0.93 - warmth * 0.12, 0.8 - warmth * 0.26)
  lights.sun.intensity = 1.5 + elev * 0.95
  scene.fog.color.setRGB(0.72 + warmth * 0.1, 0.83 - warmth * 0.05, 0.9 - warmth * 0.13)

  site.update(t, dt)
  mixer.update(dt)
  // the yard is part of the site clock — it has a crew to finish in time
  depot.update(dt * speed, t)
  ui.tick(dt)

  orderNextCrew()

  // the plot is handed over; the whole outfit moves next door
  if (sim.finished && sim.stageT > 14) startPlot(false)

  if (toppingFlag && toppingFlag.visible) toppingFlag.rotation.y = Math.sin(t * 0.8) * 0.25

  if (followed) {
    if (followed.dead || !sim.robots.includes(followed)) follow(null)
    else {
      const o = PLOTS[plotIndex]
      camGoal.target.set(o.x + followed.pos.x, followed.pos.y + 0.95, o.z + followed.pos.z)
      controls.target.lerp(camGoal.target, Math.min(1, dt * 3.4))
    }
  }

  // camera easing — plot to plot, and up and down the road
  if (flying > 0) {
    camera.position.lerp(camGoal.pos, Math.min(1, dt * 2.1))
    controls.target.lerp(camGoal.target, Math.min(1, dt * 2.1))
    if (camera.position.distanceTo(camGoal.pos) < 0.6) flying = 0
  } else if (view === 'site' && !followed) {
    controls.target.lerp(camGoal.target, Math.min(1, dt * 0.8))
  }

  hudTimer -= dt
  if (hudTimer <= 0) {
    hudTimer = 0.25
    if (followed) ui.setFollow(sim.describe(followed))
    ui.setHud({
      shiftIndex: sim.shiftIndex,
      crewName: sim.crew.name,
      crewAccent: `#${sim.crew.accent.toString(16).padStart(6, '0')}`,
      secondsToShiftChange: sim.secondsToShiftChange(),
      placed: sim.placed,
      total: sim.total,
      phaseLabel: sim.phaseLabel,
      etaSeconds: sim.etaSeconds(),
      ratePerMin: sim.ratePerMin(),
      onSite: sim.robots.length,
      day,
      plot: plotIndex + 1,
      plots: PLOTS.length,
    })
    // Once the yard has an order on the books the roster is fixed for that
    // crew; say so rather than letting the panel imply otherwise.
    const building = depot.building
    ui.setCrewNote(
      building
        ? `the yard is building ${building} now · edits land the shift after`
        : 'takes effect at the next changeover',
      !!building,
    )
  }

  if (!sheetSeen && view === 'site') {
    hintTimer += dt
    ui.setHint(hintTimer > 4)
  }

  if (ui.isSheetOpen()) {
    const { w, h } = ui.sheetSize()
    drawBlueprint(sheetCtx, w, h, blueprintState())
  }

  controls.update()
  renderer.render(scene, camera)
})

window.brickCrew = {
  get sim() { return sim },
  depot,
  fastForward,
  look: (p, t) => { camGoal.pos.set(p[0], p[1], p[2]); camGoal.target.set(t[0], t[1], t[2]); flying = 1 },
  get origin() { return PLOTS[plotIndex] },
  get houses() { return standing.map((h) => ({ x: h.position.x, z: h.position.z, plot: h.userData.plot, w: h.userData.geom.w, d: h.userData.geom.d })) },
  get plan() { return plan },
  get view() { return view },
  orders,
  follow,
  flyTo,
  scene,
  camera,
  controls,
}
