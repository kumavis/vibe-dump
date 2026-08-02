import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {
  SITE, HOUSE, COURSE, EAVE_Y, RIDGE_Y, CHIMNEY, COLORS, SHIFT_SECONDS, PREROLL_SECONDS,
} from './src/config.js'
import { buildPlan } from './src/plan.js'
import { buildSite, buildSky, buildLights } from './src/site.js'
import {
  buildPallet, buildSupplyPile, buildMixer, buildScaffold, buildCone,
  buildToolCrate, buildTimberStack, buildDumpster, buildPrivy, buildSpoilHeap, buildSign,
} from './src/props.js'
import { createSim } from './src/sim.js'
import { createUI } from './src/ui.js'
import { drawBlueprint } from './src/blueprint.js'

// ---------------------------------------------------------------------------
// Brick Crew — a robot gang puts up a brick house, one course at a time.
//
// Nothing here is faked: every brick on the wall was carried there by a robot
// that took it off a pallet. The blueprint in the site office reads the same
// numbers the sim runs on, so the drawing and the building always agree.
//
// ?seed=N reseeds the house dressing and the crew.
// ---------------------------------------------------------------------------

const params = new URLSearchParams(location.search)
const SEED = (parseInt(params.get('seed'), 10) || 20250801) >>> 0

/** Small deterministic PRNG (mulberry32). */
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
scene.fog = new THREE.Fog(0xb9d4e6, 58, 210)

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 400)
// Low enough to read the wall face and the crew on the scaffold, rather than
// looking down onto the decking.
camera.position.set(13.6, 5.9, 12.5)

const controls = new OrbitControls(camera, canvas)
controls.target.set(0.3, 1.7, 1.5)
controls.enableDamping = true
controls.dampingFactor = 0.07
controls.maxPolarAngle = Math.PI * 0.487
controls.minDistance = 5
controls.maxDistance = 42
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

ui.setLoading(0.3, 'putting up the hoarding…')

// --- yard ------------------------------------------------------------------

const yard = new THREE.Group()
scene.add(yard)

const pallets = SITE.pallets.map((p) => {
  const pal = buildPallet(rng)
  pal.group.position.set(p.x, 0, p.z)
  pal.group.rotation.y = (rng() - 0.5) * 0.3
  pal.pos = p
  yard.add(pal.group)
  return pal
})

const stack = buildSupplyPile(rng)
stack.group.position.set(SITE.stack.x, 0, SITE.stack.z)
yard.add(stack.group)

const mixer = buildMixer(rng)
mixer.group.position.set(SITE.mixer.x, 0, SITE.mixer.z)
mixer.group.rotation.y = -0.5
yard.add(mixer.group)

const scaffold = buildScaffold()
yard.add(scaffold.group)

const timber = buildTimberStack(rng)
timber.position.set(SITE.timber.x, 0, SITE.timber.z)
yard.add(timber)

const skip = buildDumpster(rng)
skip.position.set(SITE.dumpster.x, 0, SITE.dumpster.z)
skip.rotation.y = 0.4
yard.add(skip)

const privy = buildPrivy(rng)
privy.position.set(SITE.privy.x, 0, SITE.privy.z)
yard.add(privy)

const spoil = buildSpoilHeap(rng)
spoil.position.set(-7.4, 0, -4.4)
yard.add(spoil)

for (const [x, z, r] of [[-3.2, -4.8, 0], [4.9, -3.6, 0], [-6.2, 1.4, 0]]) {
  const crate = buildToolCrate(rng)
  crate.position.set(x, 0, z)
  crate.rotation.y += r
  yard.add(crate)
}
for (let i = 0; i < 9; i++) {
  const cone = buildCone(rng)
  const a = (i / 9) * Math.PI * 2
  cone.position.set(Math.cos(a) * (5.6 + rng() * 2.4), 0, 4.4 + Math.sin(a) * 2.2)
  yard.add(cone)
}
const sign = buildSign('BRICK CREW\nHARD HATS ON SITE')
sign.position.set(SITE.gate.x + 3.4, 0, SITE.gate.z - 0.4)
sign.rotation.y = -0.35
yard.add(sign)

ui.setLoading(0.52, 'unloading the pallets…')

// --- the building ----------------------------------------------------------
//
// Every brick, rafter and tile in the plan gets one instance in one of three
// InstancedMeshes. Unplaced instances are parked at zero scale, so revealing a
// brick is a single matrix write — no geometry churn as the house goes up.

const FAMILIES = {
  masonry: { roughness: 0.94, metalness: 0 },
  timber: { roughness: 0.88, metalness: 0 },
  tile: { roughness: 0.66, metalness: 0.05 },
}

let plan = null
let sim = null
let meshes = null
let mortarMesh = null
let day = 1

const _m4 = new THREE.Matrix4()
const _q = new THREE.Quaternion()
const _e = new THREE.Euler()
const _v = new THREE.Vector3()
const _s = new THREE.Vector3()
const ZERO = new THREE.Vector3(0, 0, 0)
const building = new THREE.Group()
scene.add(building)

function makeFamily(count, opts) {
  const mesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial(opts),
    Math.max(1, count),
  )
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

/** Bricks are one colour family; a little per-instance variation goes a long way. */
function paintFamily(mesh, items, family) {
  const c = new THREE.Color()
  for (const it of items) {
    if (it.family !== family) continue
    mesh.setColorAt(it.slot, c.setHex(it.color))
  }
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
}

// --- topping-out flag ------------------------------------------------------

const topOut = new THREE.Group()
topOut.visible = false
{
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 1.0, 8),
    new THREE.MeshStandardMaterial({ color: 0x8f6538, roughness: 0.9 }),
  )
  pole.position.y = 0.5
  topOut.add(pole)
  for (let i = 0; i < 3; i++) {
    const leaf = new THREE.Mesh(
      new THREE.ConeGeometry(0.24 - i * 0.06, 0.3, 7),
      new THREE.MeshStandardMaterial({ color: 0x3f7d4e, roughness: 0.95 }),
    )
    leaf.position.y = 0.66 + i * 0.16
    topOut.add(leaf)
  }
  const flag = new THREE.Mesh(
    new THREE.PlaneGeometry(0.42, 0.24),
    new THREE.MeshStandardMaterial({ color: 0xf0b429, roughness: 0.9, side: THREE.DoubleSide }),
  )
  flag.position.set(0.21, 0.9, 0)
  topOut.add(flag)
  topOut.position.set(0, RIDGE_Y + 0.2, 0)
  topOut.traverse((o) => (o.castShadow = true))
  scene.add(topOut)
}

// --- build / rebuild -------------------------------------------------------

function startBuild(newDay, first) {
  day = newDay
  sim?.dispose()
  building.clear()
  plan = buildPlan(rng, day)

  meshes = {}
  for (const [family, opts] of Object.entries(FAMILIES)) {
    const m = makeFamily(plan.familyCount[family], opts)
    meshes[family] = m
    building.add(m)
    paintFamily(m, plan.items, family)
  }
  mortarMesh = makeFamily(plan.mortar.length, { color: COLORS.mortar, roughness: 0.98, metalness: 0 })
  building.add(mortarMesh)

  topOut.visible = false
  scaffold.setDecks(0)
  // A part-loaded stack, so the masons have something to lay from minute one.
  stack.setCount(26)
  pallets.forEach((p) => p.setCount(p.capacity))

  sim = createSim({
    plan,
    rng,
    scene,
    stack,
    pallets,
    scaffold,
    onPlace: reveal,
    onBanner: (t, s, a) => ui.banner(t, s, a),
    onComplete: () => {
      topOut.visible = true
      ui.banner('TOPPED OUT', `${plan.title} — day ${day} complete`, '#8fd14f')
    },
  })
  // Open on a job already under way: nobody wants to arrive at an empty plot.
  if (first) sim.preroll(PREROLL_SECONDS)
}

ui.setLoading(0.72, 'reading the drawings…')
startBuild(1, true)
ui.setLoading(0.9, 'signing the crew on…')

// --- trailer interaction ---------------------------------------------------

const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
let hovering = false
let downAt = null
let sheetSeen = false

function pickTrailer(cx, cy) {
  pointer.set((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1)
  raycaster.setFromCamera(pointer, camera)
  return raycaster.intersectObjects(site.trailerTargets, false).length > 0
}

canvas.addEventListener('pointermove', (e) => {
  if (ui.isSheetOpen()) return
  const hit = pickTrailer(e.clientX, e.clientY)
  if (hit !== hovering) {
    hovering = hit
    site.setTrailerHighlight(hit)
    site.trailerLabel.visible = hit
    canvas.style.cursor = hit ? 'pointer' : ''
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
  if (pickTrailer(e.clientX, e.clientY)) {
    ui.toggleSheet()
    sheetSeen = true
    ui.setHint(false)
  }
})
canvas.addEventListener('pointerleave', () => {
  hovering = false
  site.setTrailerHighlight(false)
  site.trailerLabel.visible = false
})

// --- blueprint state -------------------------------------------------------

const sheetCtx = ui.sheetCanvas.getContext('2d')

/**
 * How far each part of the house has actually got, in courses, so the drawing
 * can ink in what is standing and ghost what isn't. A fractional value means a
 * course is part-laid.
 */
function builtByGroup() {
  const tally = new Map()
  for (let i = 0; i < plan.items.length; i++) {
    const it = plan.items[i]
    if (it.course == null || !it.group) continue
    const key = it.group
    let g = tally.get(key)
    if (!g) tally.set(key, (g = []))
    const c = it.course
    if (!g[c]) g[c] = [0, 0]
    g[c][1]++
    if (sim.isPlaced(i)) g[c][0]++
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
  return {
    title: plan.title,
    house: {
      w: HOUSE.w,
      d: HOUSE.d,
      t: HOUSE.t,
      wallCourses: HOUSE.wallCourses,
      gableCourses: HOUSE.gableCourses,
      eaveY: EAVE_Y,
      ridgeY: RIDGE_Y,
      courseH: COURSE,
    },
    openings: plan.openings,
    chimney: CHIMNEY,
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

  // Fixed-step the sim so the five-minute shift never drifts with frame rate.
  acc += dt
  let steps = 0
  while (acc >= STEP && steps < 8) {
    sim.update(STEP)
    acc -= STEP
    steps++
  }
  if (steps === 8) acc = 0

  site.update(t, dt)
  mixer.update(dt)
  ui.tick(dt)

  if (sim.finished && sim.celebrateT > 16) startBuild(day + 1)

  if (topOut.visible) topOut.rotation.y = Math.sin(t * 0.8) * 0.25

  hudTimer -= dt
  if (hudTimer <= 0) {
    hudTimer = 0.25
    ui.setHud({
      shiftIndex: sim.shiftIndex,
      crewName: sim.crew.name,
      crewAccent: `#${sim.crew.accent.toString(16).padStart(6, '0')}`,
      secondsToShiftChange: sim.secondsToShiftChange(),
      placed: sim.placed,
      total: sim.total,
      phaseLabel: sim.finished ? 'COMPLETE' : sim.phaseLabel,
      etaSeconds: sim.etaSeconds(),
      ratePerMin: sim.ratePerMin(),
      onSite: sim.robots.length,
      day,
    })
  }

  // nudge the user toward the trailer, once
  if (!sheetSeen) {
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

// a debug handle, same as the other apps in this repo
window.brickCrew = { get sim() { return sim }, get plan() { return plan }, scene, camera, controls }
