import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { buildEnvironment, configureRenderer } from './src/env.js'
import { buildTruck } from './src/truck.js'
import { materials } from './src/materials.js'
import { Rig, staticHull } from './src/rig.js'
import { T, X, PACK_CEILING, PACK_CEILING_LEGAL, TRUCK_MM } from './src/specs.js'
import { STATIONS } from './src/stations/index.js'
import { buildOverlay } from './src/overlay.js'
import { mountUI } from './src/ui.js'

const canvas = document.getElementById('scene')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
configureRenderer(renderer)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 300)
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.minDistance = 2.6
controls.maxDistance = 24
controls.maxPolarAngle = Math.PI * 0.495

buildEnvironment(scene, renderer)
const lib = materials()
const truck = buildTruck()
scene.add(truck.group)

// Bed origin: the frame every fold-out module is authored in. Same axes as the
// truck, lifted to the cargo deck surface.
const bedOrigin = new THREE.Group()
bedOrigin.position.set(0, T.deckH, 0)
scene.add(bedOrigin)

/**
 * The static world, as collision hulls.
 *
 * These are WORLD-space, and so is everything rig.audit() compares them
 * against: a rig's hulls come from part.group.matrixWorld, which already
 * carries bedOrigin's 660 mm lift. The truck's own hulls are authored with y
 * measured from the ground and the truck sits at the origin, so they are world
 * hulls as they stand and must NOT be rebased.
 *
 * The ground is a slab whose top face is exactly the tarmac, so a panel that
 * sweeps below grade is caught by the same test that catches two panels
 * sharing space.
 */
const statics = [
  staticHull('ground', { c: [0, -5, 0], s: [80, 10, 80], mates: [] }),
  ...truck.hulls.map((h) => staticHull(h.id, { c: h.c, s: h.s })),
]

// --- the current station ----------------------------------------------------

let current = null

function load(stationId) {
  if (current) {
    bedOrigin.remove(current.rig.root)
    disposeTree(current.rig.root)
    current.overlay.dispose()
  }
  const def = STATIONS.find((s) => s.id === stationId) ?? STATIONS[0]
  const rig = new Rig(def.id)
  const meta = def.build({ rig, lib, truck })
  bedOrigin.add(rig.root)
  rig.setProgress(0)

  // The audit runs once, on load, and the answer goes straight into the HUD.
  // It is the whole reason to build the modules as a joint tree rather than as
  // a keyframed animation: a keyframed fold can lie, and this cannot.
  const report = rig.audit({ samples: 110, statics })
  const overlay = buildOverlay({ rig, lib, statics, report })
  bedOrigin.add(overlay.group)

  current = { def, rig, meta, report, overlay }
  return current
}

function disposeTree(root) {
  root.traverse((o) => {
    if (o.isMesh || o.isLine) o.geometry?.dispose()
  })
}

// --- deployment clock -------------------------------------------------------

const state = {
  t: 0,
  playing: true,
  dir: 1,
  speed: 0.16,
  orbit: true,
  xray: false,
}

function setProgress(t) {
  state.t = Math.min(1, Math.max(0, t))
  current.rig.setProgress(state.t)
  current.overlay.update(state.t)
}

// --- resize / loop ----------------------------------------------------------

function resize() {
  const w = innerWidth
  const h = innerHeight
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}
addEventListener('resize', resize)

const ui = mountUI({
  stations: STATIONS,
  state,
  onStation: (id) => {
    const c = load(id)
    setProgress(state.t)
    ui.describe(c)
    return c
  },
  onProgress: (t) => {
    state.playing = false
    setProgress(t)
    ui.tick(state.t, current)
  },
  camera,
  controls,
  truck,
  specs: { T, X, PACK_CEILING, PACK_CEILING_LEGAL, TRUCK_MM },
})

ui.describe(load(STATIONS[0].id))
setProgress(0)
ui.frame('three-quarter')
resize()

let last = performance.now()
let orbitAngle = 0
renderer.setAnimationLoop((now) => {
  const dt = Math.min(0.05, (now - last) / 1000)
  last = now

  if (state.playing) {
    let t = state.t + state.dir * state.speed * dt
    if (t >= 1) {
      t = 1
      state.dir = -1
      state.hold = (state.hold ?? 0) + dt
      if (state.hold < 2.5) t = 1
      else {
        state.hold = 0
      }
    } else if (t <= 0) {
      t = 0
      state.dir = 1
    }
    setProgress(t)
    ui.tick(state.t, current)
  }

  if (state.orbit && !controls.dragging) {
    orbitAngle += dt * 0.06
    const r = Math.hypot(camera.position.x - controls.target.x, camera.position.z - controls.target.z)
    camera.position.x = controls.target.x + Math.cos(orbitAngle) * r
    camera.position.z = controls.target.z + Math.sin(orbitAngle) * r
    camera.lookAt(controls.target)
  }

  controls.update()
  renderer.render(scene, camera)
})

controls.addEventListener('start', () => {
  controls.dragging = true
  state.orbit = false
  ui.syncOrbit()
})
controls.addEventListener('end', () => {
  controls.dragging = false
})

document.getElementById('boot')?.classList.add('gone')

// A handle for the console and for the screenshot harness.
window.kei = {
  scene, camera, controls, renderer, truck, bedOrigin, state,
  get station() {
    return current
  },
  setProgress,
  /** Swap station AND refresh the panel, so the console and the UI agree. */
  load: (id) => {
    const c = load(id)
    ui.describe(c)
    setProgress(state.t)
    return c
  },
  audit: () => current.rig.audit({ samples: 240, statics }),
  view(px, py, pz, tx = 0, ty = 1.1, tz = 0) {
    state.orbit = false
    camera.position.set(px, py, pz)
    controls.target.set(tx, ty, tz)
    camera.lookAt(controls.target)
    controls.update()
  },
}
