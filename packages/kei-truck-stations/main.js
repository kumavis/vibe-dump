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

/** The truck's own extent, which every station's deployed box is unioned with. */
const TRUCK_BOX = (() => {
  const b = new THREE.Box3()
  const v = new THREE.Vector3()
  for (const h of truck.hulls) {
    b.expandByPoint(v.set(h.c[0] - h.s[0] / 2, h.c[1] - h.s[1] / 2, h.c[2] - h.s[2] / 2))
    b.expandByPoint(v.set(h.c[0] + h.s[0] / 2, h.c[1] + h.s[1] / 2, h.c[2] + h.s[2] / 2))
  }
  return b
})()

/** World AABB of a rig at full deployment — the thing the camera has to fit. */
function deployedBox(rig) {
  const before = rig.t ?? 0
  rig.setProgress(1)
  const b = TRUCK_BOX.clone()
  const v = new THREE.Vector3()
  for (const { obb } of rig.worldHulls()) {
    const e = obb.rotation.elements
    const hs = obb.halfSize
    const hx = Math.abs(e[0]) * hs.x + Math.abs(e[3]) * hs.y + Math.abs(e[6]) * hs.z
    const hy = Math.abs(e[1]) * hs.x + Math.abs(e[4]) * hs.y + Math.abs(e[7]) * hs.z
    const hz = Math.abs(e[2]) * hs.x + Math.abs(e[5]) * hs.y + Math.abs(e[8]) * hs.z
    b.expandByPoint(v.set(obb.center.x - hx, obb.center.y - hy, obb.center.z - hz))
    b.expandByPoint(v.set(obb.center.x + hx, obb.center.y + hy, obb.center.z + hz))
  }
  rig.setProgress(before)
  return b
}

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

  current = { def, rig, meta, report, overlay, bounds: deployedBox(rig) }
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
 * THE PANEL IS PART OF THE VIEWPORT, so the camera treats it as one.
 *
 * 384 px of fixed chrome down the left edge does two things to a 3D view, and
 * both have to be answered or the subject sits half under the panel with dead
 * space beside it.
 *
 *   1. It moves the CENTRE. A negative view offset shifts the frustum by half
 *      the panel width, which puts the middle of the scene in the middle of the
 *      space you can actually see.
 *   2. It narrows the FRAME. The visible strip is 70 per cent of the window on a
 *      laptop and can be a third of it in a side panel, so the distance that fit
 *      the deployed module in the whole window does not fit it in what is left.
 *
 * So the fit is computed rather than tuned: take the module's deployed bounding
 * box, project its eight corners onto the camera's own axes, and solve for the
 * distance at which the tallest and the widest of them just clear the frustum —
 * using the horizontal half-angle of the VISIBLE strip, not of the window. It
 * re-runs on resize, on a panel toggle and on every station change, because a
 * 3.6 m light mast and a 2.1 m shrine roof want different distances.
 *
 * It only runs while the view is on autopilot. The moment somebody drags or
 * picks a named view, auto-orbit goes off and the camera is theirs.
 */
/**
 * How much of the window the panel is standing on, and from which edge.
 *
 * Below 760 px the panel stops being a left rail and becomes a bottom sheet —
 * so the inset is vertical there, not horizontal. Reading the rect rather than
 * re-testing the breakpoint means the CSS stays the single source of truth for
 * where the panel is; get that wrong and the narrow layout pushes the truck to
 * a dot in the corner while the fit solves for a viewport that is not there.
 */
function panelInset() {
  const panelEl = document.querySelector('.panel')
  if (!panelEl || panelEl.classList.contains('hidden')) return { x: 0, y: 0 }
  const r = panelEl.getBoundingClientRect()
  const bottomSheet = r.width > innerWidth * 0.7
  return bottomSheet ? { x: 0, y: Math.min(r.height, innerHeight * 0.7) } : { x: Math.min(r.width, innerWidth * 0.7), y: 0 }
}

const _f = { c: new THREE.Vector3(), dir: new THREE.Vector3(), right: new THREE.Vector3(), up: new THREE.Vector3(), p: new THREE.Vector3() }

function fitToSubject() {
  if (!current?.bounds) return
  const b = current.bounds
  const h = innerHeight
  const inset = panelInset()
  const usableW = Math.max(200, innerWidth - inset.x)
  const usableH = Math.max(200, h - inset.y)
  b.getCenter(_f.c)

  _f.dir.copy(camera.position).sub(controls.target)
  if (_f.dir.lengthSq() < 1e-6) _f.dir.set(-1, 0.5, 1)
  _f.dir.normalize()
  // A world-up cross product degenerates when the camera looks straight down.
  _f.right.crossVectors(Math.abs(_f.dir.y) > 0.99 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 1, 0), _f.dir).normalize()
  _f.up.crossVectors(_f.dir, _f.right).normalize()

  let mx = 0
  let my = 0
  let mz = 0
  for (let i = 0; i < 8; i++) {
    _f.p.set(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z).sub(_f.c)
    mx = Math.max(mx, Math.abs(_f.p.dot(_f.right)))
    my = Math.max(my, Math.abs(_f.p.dot(_f.up)))
    mz = Math.max(mz, _f.p.dot(_f.dir))
  }
  // Half-angles of the strip you can actually see, not of the window.
  const vHalf = (camera.fov * Math.PI) / 360
  const vv = Math.atan(Math.tan(vHalf) * (usableH / h))
  const hh = Math.atan(Math.tan(vHalf) * (usableW / h))
  const d = Math.max(my / Math.tan(vv), mx / Math.tan(hh)) * 1.07 + mz

  controls.target.copy(_f.c)
  camera.position.copy(_f.c).addScaledVector(_f.dir, Math.min(Math.max(d, controls.minDistance), controls.maxDistance))
  camera.lookAt(controls.target)
  controls.update()
}

function resize() {
  const w = innerWidth
  const h = innerHeight
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  const inset = panelInset()
  // A negative x moves the frustum left, so the subject moves right, out from
  // under a left rail; a positive y moves it down, so the subject rides above a
  // bottom sheet.
  if (inset.x > 0 || inset.y > 0) camera.setViewOffset(w, h, -inset.x / 2, inset.y / 2, w, h)
  else camera.clearViewOffset()
  camera.updateProjectionMatrix()
  if (state.orbit) fitToSubject()
}
addEventListener('resize', resize)

const ui = mountUI({
  stations: STATIONS,
  state,
  onStation: (id) => {
    const c = load(id)
    setProgress(state.t)
    ui.describe(c)
    if (state.orbit) fitToSubject()
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
// Collapsing the panel changes how much window the scene actually has, so both
// the view offset and the fit have to follow it. Watching the class is less
// coupling than a callback and cannot get out of step with the CSS.
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
