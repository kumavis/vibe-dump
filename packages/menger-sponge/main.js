import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { createSponge, resolve, MAX_DEPTH, CHARGE_IN, GLOW_IDLE } from './sponge.js'
import { createBorgMaterial, makeBorgEnv, makeBackdrop, PALETTE, U } from './material.js'

const { clamp } = THREE.MathUtils

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ---------------------------------------------------------------------------
// Cycle timing
//
// The gallery screenshots this app 1200 ms after networkidle, so the opening
// pose has to carry the card on its own. We start near the END of the 2→3
// deployment: the level-3 hole lattice already reads unmistakably as a Menger
// sponge, but the last pistons are still seating, so it is visibly a machine
// mid-move rather than a static render. Earlier in that leg (t ≈ 0.4) the
// in-flight sub-cubes plug the level-2 holes and the whole thing collapses into
// undifferentiated greeble noise — precisely the frame not to ship.
//
// Whatever the first second renders at, the pose stays good: on a software
// rasteriser the driver barely advances and we sit on the start pose; at
// 60 fps we arrive at level 3 and settle into its dwell.
// ---------------------------------------------------------------------------
const START_DEPTH = 2.87
const FIRST_LEG = 5.0 // seconds for the opening leg (the rest use TRANSITION)
const DWELL = [1.1, 0.85, 0.85, 1.5] // seconds parked at depth 0,1,2,3
const TRANSITION = [2.6, 2.2, 2.0] // seconds for leg 0→1, 1→2, 2→3
const CAM_DIST = 3.0 // orbit radius for a unit sponge at fov 40
// The sponge is centred on the origin but the HUD footer eats the bottom of the
// frame, so the orbit target sits slightly BELOW the model. That lifts it in
// frame and evens out the dead space above and below it.
const FRAME_LIFT = 0.07

// ---------------------------------------------------------------------------
// HUD readout — text is only written when the state key actually changes, so
// the bar costs nothing per frame; only the progress bar's transform ticks, and
// even that is quantised to whole percent.
// ---------------------------------------------------------------------------
const hud = {
  level: document.getElementById('level-label'),
  phase: document.getElementById('phase'),
  count: document.getElementById('cube-count'),
  unit: document.getElementById('cube-unit'),
  fill: document.getElementById('progress-fill'),
  pips: Array.from(document.querySelectorAll('#level-pips .pip')),
}

let hudKey = ''
let hudPct = -1

function updateHud({ from, to, phase, progress, paused }) {
  const key = `${from}|${to}|${phase}|${paused}`
  if (key !== hudKey) {
    hudKey = key
    hud.level.textContent = from === to ? `LEVEL ${from}` : `LEVEL ${from} → ${to}`
    hud.phase.textContent = paused ? 'PAUSED' : phase
    hud.phase.className = paused ? 'is-paused' : from === to ? 'is-hold' : 'is-move'
    // During a morph the finer level's cubes physically exist, so the count
    // jumps up the moment the block starts compressing.
    const cubes = 20 ** Math.max(from, to)
    hud.count.textContent = cubes.toLocaleString('en-US')
    hud.unit.textContent = cubes === 1 ? 'cube' : 'cubes'
    for (let i = 0; i < hud.pips.length; i++) {
      hud.pips[i].className = 'pip' + (i === from ? ' on' : i === to ? ' next' : '')
    }
  }
  const pct = Math.round(clamp(progress, 0, 1) * 100)
  if (pct !== hudPct) {
    hudPct = pct
    hud.fill.style.transform = `scaleX(${pct / 100})`
  }
}

// ---------------------------------------------------------------------------
// WebGL guard — boot() is a hoisted declaration so this can sit up top and
// still wrap context creation.
// ---------------------------------------------------------------------------
function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return !!(
      (window.WebGL2RenderingContext && c.getContext('webgl2')) ||
      (window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')))
    )
  } catch {
    return false
  }
}

// WebGL is still WebGL when it is running on the CPU, so this cannot go in the
// availability guard — it only tells us how much fill we can afford. The masked
// RENDERER string is always "WebKit WebGL"; the real name needs the debug
// extension, which some browsers withhold. Unknown means "assume hardware" and
// let the frame-cost governor find out.
function isSoftwareRenderer(renderer) {
  try {
    const gl = renderer.getContext()
    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    if (!ext) return false
    const name = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '')
    return /swiftshader|llvmpipe|softpipe|software|basic render|paravirtual/i.test(name)
  } catch {
    return false
  }
}

function showFallback() {
  document.getElementById('fallback').hidden = false
  document.getElementById('status').hidden = true
  document.getElementById('hud-hint').hidden = true
}

if (!webglAvailable()) {
  showFallback()
} else {
  try {
    boot()
  } catch (err) {
    console.error(err)
    showFallback()
  }
}

function boot() {
  // -------------------------------------------------------------------------
  // Renderer / composer
  //
  // DPR is clamped hard because bloom is a full-resolution multi-pass; 1.6 is
  // crisp on retina without paying a 4x fill cost, and it is the difference
  // between a smooth 8000-instance level 3 and a slideshow.
  // -------------------------------------------------------------------------
  const app = document.getElementById('app')
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
  const dpr = Math.min(window.devicePixelRatio || 1, 1.6)
  renderer.setPixelRatio(dpr)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.85
  renderer.setClearColor(PALETTE.void, 1)
  app.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  scene.environment = makeBorgEnv(renderer)
  // Linear fog, tuned to the unit sponge: it darkens the far side of the
  // lattice so you can read depth through the holes. The band is RELATIVE to
  // the camera (see syncFog) — pinning it to absolute distances meant that any
  // viewport narrow enough to dolly the camera back pushed the whole sponge
  // past the far plane and rendered it as a black silhouette.
  scene.fog = new THREE.Fog(PALETTE.fog, 2.5, 5.4)
  scene.add(makeBackdrop())

  const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 200)
  camera.position.set(1.8, 1.24, 2.05).setLength(CAM_DIST)
  camera.position.y -= FRAME_LIFT // keep the orbit radius, just slide the pair down

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, -FRAME_LIFT, 0)
  controls.enableDamping = true
  controls.dampingFactor = 0.055
  controls.rotateSpeed = 0.7
  controls.zoomSpeed = 0.7
  controls.enablePan = false
  controls.autoRotate = !reduceMotion
  controls.autoRotateSpeed = 0.4
  controls.minDistance = 1.4
  controls.maxDistance = 7
  controls.minPolarAngle = Math.PI * 0.14
  controls.maxPolarAngle = Math.PI * 0.86

  // -------------------------------------------------------------------------
  // Lighting — green everywhere except one cold steel rim. The rim is the only
  // thing separating the silhouette from the void; delete it and the cube
  // merges into the background.
  // -------------------------------------------------------------------------
  scene.add(new THREE.AmbientLight(0x0c1a12, 0.7))
  scene.add(new THREE.HemisphereLight(0x123a22, PALETTE.void, 0.45))

  // Point-light intensities are quoted for the ~5-unit throw to the sponge;
  // with physically-correct decay they are irradiance * d^2, so they look much
  // larger than they are.
  const key = new THREE.PointLight(PALETTE.keyLight, 7.5, 18, 2)
  key.position.set(3.2, 3.0, 2.6)
  const fill = new THREE.PointLight(PALETTE.fillLight, 2.6, 16, 2)
  fill.position.set(-3.4, -1.2, 2.2)
  // The one non-green source in the scene. Turned up as the green ones came
  // down, so the silhouette keeps a cold steel edge and the metal has something
  // to be metal about.
  const rim = new THREE.DirectionalLight(PALETTE.rimLight, 1.3)
  rim.position.set(-2.5, 1.8, -4.0)
  // Sits inside the sponge and shines out through the holes while the lattice
  // reconfigures. It is only a fraction of a unit away from the innermost
  // cubes, so 1/d^2 does the amplifying — keep the raw intensity tiny.
  const core = new THREE.PointLight(PALETTE.coreLight, 0.2, 1.9, 2)
  scene.add(key, fill, rim, core)

  // No shadow maps anywhere: 8000 shadow-casting boxes is not affordable, and
  // the derivative bump plus the baked AO already carry the form.

  // -------------------------------------------------------------------------
  // The sponge
  // -------------------------------------------------------------------------
  const sponge = createSponge(createBorgMaterial())
  scene.add(sponge.mesh)
  U.uHeatFloor.value = GLOW_IDLE // the shader's "nothing is happening" baseline

  // -------------------------------------------------------------------------
  // Post — MSAA render target, bloom, then OutputPass last.
  //
  // `antialias: true` on the renderer is ignored once you render through a
  // composer, and thin emissive seams alias badly without it, hence samples: 4.
  // Everything from RenderPass through the bloom mips stays linear HDR;
  // OutputPass does ACES + sRGB exactly once, at the end.
  // -------------------------------------------------------------------------
  const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 })
  const composer = new EffectComposer(renderer, rt)
  composer.setPixelRatio(dpr)
  composer.addPass(new RenderPass(scene, camera))
  // The threshold is the whole trick: it is applied to LINEAR HDR, before the
  // OutputPass tonemap, and lit gunmetal lands well under 0.5. Only the seam
  // cores — which the shader deliberately pushes above 1.0 — get through. To
  // get glowier, raise the emissive amp in material.js; lowering this instead
  // fogs the panel faces over and the 8000-cube lattice turns back into one
  // luminous brick.
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.46, // strength
    0.45, // radius
    0.5, // threshold
  )
  composer.addPass(bloom)
  composer.addPass(new OutputPass())

  let userHasInteracted = false

  // -------------------------------------------------------------------------
  // Adaptive resolution
  //
  // 8000 greebled cubes through a multi-pass bloom is a lot of fill, and the
  // machines that struggle most are exactly the ones nobody tests on: a
  // software rasteriser (headless CI, a browser with hardware acceleration
  // switched off) can spend seconds on a single frame. So the app measures its
  // own frame cadence and drops the render scale until it keeps up. It never
  // climbs back — an oscillating resolution looks far worse than a fixed soft
  // one — and on any real GPU the first step is never taken at all.
  // -------------------------------------------------------------------------
  // 0.5 is the floor. Below it the lattice's one-pixel seams start dropping out
  // between samples and the sponge stops reading as a sponge, which is worse
  // than a soft frame.
  const SCALE_STEPS = [1, 0.72, 0.5]
  // A software rasteriser is knowable before the first frame, and learning it
  // the slow way costs seconds per frame — long enough that the gallery's
  // screenshot step timed out and shipped a placeholder card instead of this
  // app. So ask up front and start on the floor.
  let scaleIdx = isSoftwareRenderer(renderer) ? SCALE_STEPS.length - 1 : 0
  let slowRun = 0
  let ticks = 0

  function applyScale() {
    const q = dpr * SCALE_STEPS[scaleIdx]
    renderer.setPixelRatio(q)
    composer.setPixelRatio(q) // re-runs setSize on every pass
  }
  applyScale()

  function governFrameCost(raw) {
    if (ticks < 3 || scaleIdx >= SCALE_STEPS.length - 1) return
    // Under ~3 fps something is structurally wrong (almost always software
    // rendering); step down immediately rather than spend ten more seconds
    // confirming it. Merely choppy needs a sustained run, so one GC pause or
    // one alt-tab cannot permanently soften the image.
    if (raw > 0.35) slowRun += 8
    else if (raw > 0.11) slowRun++
    else slowRun = 0
    if (slowRun >= 8) {
      slowRun = 0
      scaleIdx++
      applyScale()
    }
  }

  // The fog band rides with the camera: the near plane sits just in front of
  // the sponge's leading corner (half-diagonal ≈ 0.87) and the far plane well
  // behind it, so the depth cue is identical at every orbit radius — whether
  // the radius came from an aspect-fit dolly or from the user's scroll wheel.
  const _fogV = new THREE.Vector3()
  function syncFog() {
    const d = _fogV.subVectors(camera.position, controls.target).length()
    scene.fog.near = d - 0.5
    scene.fog.far = d + 2.4
  }

  function resize() {
    const w = window.innerWidth
    const h = window.innerHeight
    const a = w / h
    renderer.setSize(w, h)
    composer.setSize(w, h)
    camera.aspect = a
    camera.updateProjectionMatrix()
    // Narrow viewports would clip the sponge horizontally, so dolly back until
    // the horizontal half-extent matches the square case — 1/a exactly, since
    // half-width = d * tan(fov/2) * a. Above a = 1 the vertical extent binds
    // instead and CAM_DIST already covers it, so wide viewports never move.
    // Never fight a user who has already framed their own shot. The dolly runs
    // along the ORBIT offset, not the world origin, so the framing lift
    // survives the resize.
    if (!userHasInteracted) {
      const d = CAM_DIST * clamp(1 / a, 1, 1.9)
      camera.position.sub(controls.target).setLength(d).add(controls.target)
    }
    syncFog()
  }
  window.addEventListener('resize', resize)
  resize()

  // -------------------------------------------------------------------------
  // Cycle driver
  //
  // `depth` walks up to MAX_DEPTH and back down, dwelling at each integer. All
  // of the choreography is a pure function of it, so reversing direction is
  // literally all it takes to get a correct mechanical re-assembly.
  // -------------------------------------------------------------------------
  const state = {
    depth: START_DEPTH,
    dir: +1,
    mode: 'move', // 'move' | 'dwell'
    timer: 0,
    dwellFor: 1,
    paused: false,
    firstLeg: true,
    holdAtNext: false,
  }

  // `leg` is the index of the transition currently being travelled, i.e. the
  // integer level BELOW the current depth. Clamping it here is what keeps the
  // driver inside [0, MAX_DEPTH]: without it, a step past either end walks the
  // depth into a level that does not exist.
  function leg() {
    const raw = state.dir > 0 ? Math.floor(state.depth) : Math.ceil(state.depth) - 1
    return clamp(raw, 0, MAX_DEPTH - 1)
  }

  function arrive(raw) {
    const n = clamp(raw, 0, MAX_DEPTH)
    state.depth = n
    state.firstLeg = false
    state.mode = 'dwell'
    state.timer = DWELL[n]
    state.dwellFor = DWELL[n]
    if (n === MAX_DEPTH) state.dir = -1
    if (n === 0) state.dir = +1
    if (state.holdAtNext) {
      state.holdAtNext = false
      state.paused = true
    }
  }

  function advance(dt) {
    if (state.paused) return
    if (reduceMotion) dt *= 0.5 // keep the morph — it is the piece — but calmer
    if (state.mode === 'dwell') {
      state.timer -= dt
      if (state.timer <= 0) state.mode = 'move'
      return
    }
    const L = leg()
    const dur = state.firstLeg ? FIRST_LEG : TRANSITION[L]
    state.depth += (state.dir * dt) / dur
    if (state.dir > 0 && state.depth >= L + 1) arrive(L + 1)
    else if (state.dir < 0 && state.depth <= L) arrive(L)
  }

  // Translate the driver into the HUD's vocabulary.
  function morphState() {
    if (state.mode === 'dwell') {
      const n = Math.round(state.depth)
      const p = state.dwellFor > 0 ? 1 - state.timer / state.dwellFor : 1
      return { from: n, to: n, phase: 'HOLDING', progress: p, paused: state.paused }
    }
    const L = leg()
    const t = clamp(state.depth - L, 0, 1)
    const up = state.dir > 0
    // The choreography is a pure function of t and is NOT mirrored in t: below
    // CHARGE_IN the block is compressing (charge(t) is the only thing moving),
    // above it the pistons are travelling. Running the cycle backwards reverses
    // the ORDER those phases are seen in, not the t at which they happen — so
    // both branches test the same threshold and only the verb changes.
    const phase = up
      ? t < CHARGE_IN
        ? 'COMPRESSING'
        : 'DEPLOYING'
      : t < CHARGE_IN
        ? 'SEALING'
        : 'RETRACTING'
    return {
      from: up ? L : L + 1,
      to: up ? L + 1 : L,
      phase,
      progress: up ? t : 1 - t,
      paused: state.paused,
    }
  }

  function setPaused(v) {
    state.paused = v
  }

  // Interrupts a hold or reverses an in-flight morph from wherever it is, then
  // parks at the next integer — nothing ever snaps. A step off either end of
  // the range is simply refused: level -1 and level 4 do not exist, and walking
  // the depth into one used to take the whole app down with it.
  function stepLevel(dir) {
    const d = dir >= 0 ? 1 : -1
    if (d < 0 && state.depth <= 0) return
    if (d > 0 && state.depth >= MAX_DEPTH) return
    state.dir = d
    state.mode = 'move'
    state.timer = 0
    state.paused = false
    state.holdAtNext = true
    state.firstLeg = false
  }

  // Everything is a pure function of depth, so a scrub handle costs nothing and
  // gives the curious (and the screenshot harness) a way to inspect any pose.
  window.sponge = {
    get depth() {
      return state.depth
    },
    get level() {
      return resolve(state.depth).L + 1
    },
    setDepth(d) {
      state.depth = clamp(d, 0, MAX_DEPTH)
      state.mode = 'move'
      state.paused = true
      state.firstLeg = false
    },
    pause: () => setPaused(true),
    play: () => setPaused(false),
    step: stepLevel,
  }

  // -------------------------------------------------------------------------
  // Interaction — OrbitControls keeps full ownership of the pointer; the app
  // only observes, which is why a tap can never fight an orbit gesture.
  // -------------------------------------------------------------------------
  let idleTimer = 0
  function nudgeAutoRotate() {
    userHasInteracted = true
    controls.autoRotate = false
    clearTimeout(idleTimer)
    idleTimer = setTimeout(() => {
      controls.autoRotate = !reduceMotion
    }, 2500)
  }
  controls.addEventListener('start', nudgeAutoRotate)
  controls.addEventListener('end', nudgeAutoRotate)

  const canvasEl = renderer.domElement
  let downT = 0
  let downX = 0
  let downY = 0
  canvasEl.addEventListener('pointerdown', (e) => {
    downT = performance.now()
    downX = e.clientX
    downY = e.clientY
  })
  canvasEl.addEventListener('pointerup', (e) => {
    const moved = Math.hypot(e.clientX - downX, e.clientY - downY)
    if (moved < 5 && performance.now() - downT < 350) setPaused(!state.paused)
  })

  window.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
    if (e.code === 'Space') {
      e.preventDefault()
      setPaused(!state.paused)
    } else if (e.code === 'ArrowUp' || e.code === 'ArrowRight') {
      e.preventDefault()
      stepLevel(+1)
    } else if (e.code === 'ArrowDown' || e.code === 'ArrowLeft') {
      e.preventDefault()
      stepLevel(-1)
    }
  })

  // -------------------------------------------------------------------------
  // Loop — dt is clamped so a stalled tab, a slow first shader compile or a
  // breakpoint can never teleport the driver through a whole transition.
  // -------------------------------------------------------------------------
  const clock = new THREE.Clock()
  let rafId = 0

  function tick() {
    rafId = requestAnimationFrame(tick)
    const raw = clock.getDelta()
    ticks++
    governFrameCost(raw)
    const dt = Math.min(raw, 1 / 30)
    advance(dt)

    const elapsed = clock.elapsedTime
    U.uTime.value = elapsed
    U.uPulseDir.value.set(Math.sin(elapsed * 0.23), 0.55, Math.cos(elapsed * 0.23)).normalize()
    U.uPulseGain.value = 0.55 + 0.45 * Math.sin(elapsed * 0.9)

    const { t, lvl } = resolve(state.depth)

    // Emissive budget, normalised by piece count.
    //
    // The seam glow is per-cube, so the total emissive AREA scales with the
    // number of visible cubes: a 400-piece leg puts ~20x the lit surface on
    // screen as a 20-piece leg for the same per-cube brightness. Left
    // un-normalised, the charge/flash peak that reads as hot seams on level 1
    // turns levels 2 and 3 into glowing emerald plastic — the exact inverse of
    // dark metal. So the ABOVE-IDLE part of the heat is divided down as the
    // count goes up; the idle floor is untouched, which is why every settled
    // dwell looks the same at every level.
    U.uHeatGain.value = clamp(Math.pow(20 / lvl.n, 0.25), 0.3, 1)

    sponge.update(state.depth, elapsed)

    // The interior lamp tracks how hard the sponge is working.
    const activity = state.mode === 'move' ? Math.pow(Math.sin(Math.PI * clamp(t, 0, 1)), 0.6) : 0
    core.intensity = 0.14 + 0.5 * activity

    updateHud(morphState())
    controls.update()
    syncFog() // controls.update() can have dollied us (zoom / damping)
    composer.render()
  }

  function start() {
    if (rafId) return
    clock.getDelta() // discard the gap accrued while hidden
    rafId = requestAnimationFrame(tick)
  }
  function stop() {
    if (!rafId) return
    cancelAnimationFrame(rafId)
    rafId = 0
  }
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()))
  renderer.domElement.addEventListener('webglcontextlost', (e) => {
    e.preventDefault()
    stop()
  })

  // Draw one frame synchronously so the very first paint is already a lattice.
  sponge.update(state.depth, 0)
  composer.render()
  start()
}
