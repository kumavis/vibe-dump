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

/**
 * The deployment clock.
 *
 * One scalar drives everything, so folding IN is not a separate animation — it
 * is the same function of t, read backwards. That is worth stating because it
 * is also the guarantee: the steps cannot come out in the wrong order on the
 * way in, because there is no second ordering to get wrong. The tray legs fold
 * up before the trays slide back, the roof rolls up before its posts drop, and
 * neither is scripted anywhere.
 *
 * `hold` pauses at each end so the deployed state and the stowed state each get
 * a beat to be looked at.
 */
// OPENS DEPLOYED, AND SITS THERE FOR TWELVE SECONDS. Starting stowed and folding
// out reads well on paper and badly in practice: for the first six seconds the
// app is a flat truck bed, which is also exactly what the thumbnail pass
// photographs. Opening on the finished thing and packing it away shows what the
// module IS first and how it stows second.
//
// The opening beat lasts until BOTH three seconds have passed AND the renderer
// has produced two dozen frames. On a GPU that is three seconds. Under a
// software renderer, where the first frames are a second and a half apart, it is
// half a minute — which is right: the fold is worth nothing as a slideshow, and
// the thing standing still is worth a lot. It also makes the opening state
// deterministic for anything photographing the page, which a wall-clock hold
// alone is not when handing over a screenshot itself takes ten seconds.
const WARMUP_FRAMES = 24
const state = {
  t: 1,
  playing: true,
  dir: -1,
  hold: 3,
  speed: 0.17,
  orbit: true,
  xray: false,
}

function setProgress(t) {
  state.t = Math.min(1, Math.max(0, t))
  current.rig.setProgress(state.t)
  // Soft goods. A rig part is a rigid body, and fabric is not: an awning's
  // canvas has to GROW as its rail runs out, and a bellows has to stretch. A
  // station may return an update(t) to move anything the joint tree cannot,
  // which is exactly the set of things that are not structure and so are not
  // in the collision audit either.
  current.meta.update?.(state.t, current.rig)
  current.overlay.update(state.t)
}

// --- resize / loop ----------------------------------------------------------

/**
 * Size the renderer, and CENTRE THE TRUCK IN THE PART OF THE WINDOW YOU CAN SEE.
 *
 * The panel is 384 px of fixed chrome down the left edge, so a subject centred
 * in the canvas is not centred on screen — it sits a third of the way out from
 * under the panel, which is why every screenshot of this app had the truck
 * pushed right and the tail half-hidden. A negative view offset shifts the
 * frustum by half the panel width, which puts the middle of the scene in the
 * middle of the space that is actually visible. Collapse the panel and it
 * clears itself, so the framing is right either way.
 */
function resize() {
  const w = innerWidth
  const h = innerHeight
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  const panelEl = document.querySelector('.panel')
  const shown = panelEl && !panelEl.classList.contains('hidden')
  const pw = shown ? panelEl.getBoundingClientRect().width : 0
  if (pw > 0 && w - pw > 260) camera.setViewOffset(w, h, -pw / 2, 0, w, h)
  else camera.clearViewOffset()
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
setProgress(state.t)
ui.tick(state.t, current)
ui.frame('three-quarter')
resize()
// Collapsing the panel changes how much window the scene actually has, so the
// view offset has to follow it. Watching the class is less coupling than a
// callback and cannot get out of step with the CSS.
{
  const panelEl = document.querySelector('.panel')
  if (panelEl) new MutationObserver(resize).observe(panelEl, { attributes: true, attributeFilter: ['class'] })
}

let last = performance.now()
let booted = false
let frames = 0
renderer.setAnimationLoop((now) => {
  // THE STEP IS REAL TIME, and the clamp is only a guard against a suspended tab.
  //
  // It used to be clamped at a twentieth of a second, which is fine at 60 fps and
  // a lie at anything slower: a software renderer producing a frame every 1.2 s
  // advanced the fold by 0.05 s each time, so the same deployment that takes six
  // seconds on a GPU took two and a half minutes — and the thumbnail pass, which
  // runs under SwiftShader, photographed a truck that was still packed. Clamping
  // at two seconds instead means the fold takes its stated 5.9 s of WALL time
  // wherever it runs, and the only thing the clamp still catches is a tab that
  // was backgrounded for a while.
  const dt = Math.min(2, (now - last) / 1000)
  last = now
  frames += 1

  if (state.playing) {
    if (frames < WARMUP_FRAMES) {
      // Warming up: hold the opening pose and let the clock idle with it.
    } else if (state.hold > 0) {
      state.hold -= dt
    } else {
      let t = state.t + state.dir * state.speed * dt
      if (t >= 1) {
        t = 1
        state.dir = -1
        state.hold = 2.8
      } else if (t <= 0) {
        t = 0
        state.dir = 1
        state.hold = 1.6
      }
      setProgress(t)
    }
    ui.tick(state.t, current)
  }

  // Orbit from WHEREVER the camera is, rather than from a stored angle. A stored
  // angle starts at zero, which snapped the view to dead-ahead on the first
  // frame and threw away the framing the app had just chosen — and did the same
  // again every time someone picked a view or dragged. Reading the angle back
  // out of the camera each frame means the orbit continues from the shot you are
  // looking at, which is the only behaviour that is never surprising.
  if (state.orbit && !controls.dragging) {
    const dx = camera.position.x - controls.target.x
    const dz = camera.position.z - controls.target.z
    const a = Math.atan2(dz, dx) + dt * 0.06
    const r = Math.hypot(dx, dz)
    camera.position.x = controls.target.x + Math.cos(a) * r
    camera.position.z = controls.target.z + Math.sin(a) * r
    camera.lookAt(controls.target)
  }

  controls.update()
  renderer.render(scene, camera)

  // Clear the boot overlay on the FIRST RENDERED FRAME, not when this module
  // finished evaluating. Those are the same instant on a GPU and ten seconds
  // apart under a software renderer, where building the truck, generating the
  // textures and compiling the shadow shaders all happen inside frame one — so
  // the old placement uncovered a black canvas and told anything watching that
  // the app was ready when it was not.
  if (!booted) {
    booted = true
    document.getElementById('boot')?.classList.add('gone')
  }
})

controls.addEventListener('start', () => {
  controls.dragging = true
  state.orbit = false
  ui.syncOrbit()
})
controls.addEventListener('end', () => {
  controls.dragging = false
})

// A handle for the console and for the screenshot harness.
window.kei = {
  scene, camera, controls, renderer, truck, bedOrigin, state,
  get station() {
    return current
  },
  /** Drives the rig AND the panel, so the console and the readout never disagree. */
  setProgress: (t) => {
    setProgress(t)
    ui.tick(state.t, current)
  },
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
