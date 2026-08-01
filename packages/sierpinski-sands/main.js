import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { MAX_DEPTH, PYRAMID_H, buildDepths, ledgeGrain, makeBlockGeometry, pickLedge } from './fractal.js'
import {
  HeatHazeShader,
  PALETTE,
  SUN_DIR,
  SandVeil,
  duneHeight,
  makeDunes,
  makeSky,
  makeSphinx,
} from './desert.js'

const { clamp, lerp } = THREE.MathUtils
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Scratch objects, up here because boot() runs during module evaluation.
const _mat = new THREE.Matrix4()
const _lp = new THREE.Vector3()
const _ln = new THREE.Vector3()

// World scale: the depth-0 monument is a 3-unit square base, Giza-proportioned.
const SIZE = 3.0
const HEIGHT = PYRAMID_H * SIZE
const BASE_Y = -0.16 // the risen pyramid stands a little into the sand
const BURY = HEIGHT + 0.5 // how far under it waits before an emergence

// ---------------------------------------------------------------------------
// The cycle
//
// buried → rises out of the sand at depth 0 → then, once per level, a rumble
// (sand sheeting off every ledge) followed by the split into 5^(d+1) blocks →
// holds at full depth → sinks back under and starts over. Reassembling itself
// down at depth 0 happens under the sand, where nobody can see the seam.
// ---------------------------------------------------------------------------
const PLAN = []
{
  let t = 0
  const add = (kind, dur, depth) => {
    PLAN.push({ kind, dur, depth, start: t })
    t += dur
  }
  add('buried', 0.7, 0)
  add('rise', 4.2, 0)
  add('hold', 1.6, 0)
  for (let d = 0; d < MAX_DEPTH; d++) {
    add('rumble', 1.3, d)
    add('split', 2.4, d)
    add('hold', d === MAX_DEPTH - 1 ? 3.6 : 1.5, d + 1)
  }
  add('sink', 3.0, MAX_DEPTH)
}
const CYCLE = PLAN[PLAN.length - 1].start + PLAN[PLAN.length - 1].dur

// Where the clock starts.
//
// The frame to ship is roughly three quarters of the way through the 2 → 3
// split: 125 blocks have separated far enough that the recursion is
// unmistakable, the ledges are still shedding the sheets of sand the rumble
// shook loose, and the monument is visibly mid-move rather than posed. Settled
// depths read as a still; the top of a split reads as undifferentiated rubble.
//
// The gallery screenshots 1200 ms after networkidle. Measured, that lands
// anywhere from 0.6 s to 1.7 s of cycle after the first frame — it depends on
// how fast the machine gets through shader compilation — so the clock opens
// early enough that the whole of that window falls inside the split, which is
// also why the split is the longest leg in the plan. Overshooting only ever
// lands on the settled depth 3: a duller card, never a broken one.
const SPLIT_2 = PLAN.find((s) => s.kind === 'split' && s.depth === 2)
const START_T = SPLIT_2.start + 0.35
const WARMUP = 2.6 // seconds of sand history simulated before the first frame
// Reduced motion gets a settled frame instead — nothing in flight to freeze.
const REST_T = PLAN.filter((s) => s.kind === 'hold').pop().start + 1.0

// ---------------------------------------------------------------------------
// HUD
// ---------------------------------------------------------------------------
const hud = {
  level: document.getElementById('level-label'),
  phase: document.getElementById('phase'),
  count: document.getElementById('block-count'),
  unit: document.getElementById('block-unit'),
  fill: document.getElementById('progress-fill'),
  pips: Array.from(document.querySelectorAll('#level-pips .pip')),
}
let hudKey = ''
let hudPct = -1

function updateHud(st, paused) {
  const key = `${st.from}|${st.to}|${st.phase}|${paused}`
  if (key !== hudKey) {
    hudKey = key
    hud.level.textContent = st.from === st.to ? `DEPTH ${st.from}` : `DEPTH ${st.from} → ${st.to}`
    hud.phase.textContent = paused ? 'PAUSED' : st.phase
    hud.phase.className = paused ? 'is-paused' : st.from === st.to ? 'is-hold' : 'is-move'
    // Mid-split the finer blocks physically exist, so the count steps up the
    // moment the parent starts coming apart.
    const blocks = 5 ** Math.max(st.from, st.to)
    hud.count.textContent = blocks.toLocaleString('en-US')
    hud.unit.textContent = blocks === 1 ? 'block' : 'blocks'
    for (let i = 0; i < hud.pips.length; i++) {
      hud.pips[i].className = 'pip' + (i === st.from ? ' on' : i === st.to ? ' next' : '')
    }
  }
  const pct = Math.round(clamp(st.progress, 0, 1) * 100)
  if (pct !== hudPct) {
    hudPct = pct
    hud.fill.style.transform = `scaleX(${pct / 100})`
  }
}

// ---------------------------------------------------------------------------
// WebGL guard
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

// WebGL on the CPU is still WebGL, so this can't gate the fallback — it only
// says how much fill we can afford. CI screenshots this under SwiftShader.
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
  // Renderer
  // -------------------------------------------------------------------------
  const app = document.getElementById('app')
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.02
  app.appendChild(renderer.domElement)

  // Software GL (SwiftShader, which is what the gallery screenshots under) gets
  // a cheaper scene — but it keeps its shadows. Noon light with no cast shadow
  // flattens the monument into a decal, and that is the whole picture.
  const soft = isSoftwareRenderer(renderer)
  const Q = soft
    ? { dpr: 1, dunes: 100, sand: 9000, bloom: false, shadowMap: 1024, rate: 0.9 }
    : {
        dpr: Math.min(window.devicePixelRatio || 1, 1.6),
        dunes: 320,
        sand: 9000,
        bloom: true,
        shadowMap: 2048,
        rate: 1,
      }
  renderer.setPixelRatio(Q.dpr)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = soft ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap

  // -------------------------------------------------------------------------
  // Scene
  // -------------------------------------------------------------------------
  const scene = new THREE.Scene()
  // Enough haze to stack the dunes into distance, not enough to bleach the
  // monument — the stone has to stay a different colour from the sand.
  scene.fog = new THREE.FogExp2(0xd9bd8c, 0.0042)

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 900)
  // Low and off to one side: from below its own height the monument reads as
  // monumental, and there is room for the sphinx to sit clear of it.
  camera.position.set(3.0, 1.9, 6.6)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 1.0, 0)
  controls.enableDamping = true
  controls.dampingFactor = 0.06
  controls.enablePan = false
  controls.minDistance = 4.5
  controls.maxDistance = 26
  // Never let the camera drop under the sand or climb into a plan view.
  controls.minPolarAngle = 0.35
  controls.maxPolarAngle = Math.PI * 0.495
  controls.autoRotate = !reduceMotion
  controls.autoRotateSpeed = 0.34

  const sky = makeSky()
  // Drawn after the desert rather than before it: the sky writes no depth, so
  // ordering it last lets the ground reject the two thirds of the sphere it
  // covers. On a software rasteriser that overdraw is most of a frame.
  sky.renderOrder = 1
  scene.add(sky)

  const dunes = makeDunes(Q.dunes)
  scene.add(dunes)

  const sun = new THREE.DirectionalLight(0xfff0d2, 2.7)
  sun.position.copy(SUN_DIR).multiplyScalar(42)
  {
    sun.castShadow = true
    sun.shadow.mapSize.set(Q.shadowMap, Q.shadowMap)
    const c = sun.shadow.camera
    c.left = -7.5
    c.right = 7.5
    c.top = 7.5
    c.bottom = -7.5
    c.near = 20
    c.far = 70
    c.updateProjectionMatrix()
    sun.shadow.bias = -0.0009
    sun.shadow.normalBias = 0.02
  }
  scene.add(sun)
  scene.add(sun.target)
  scene.add(new THREE.HemisphereLight(0xbcd8f0, 0xc8a468, 1.15))
  scene.add(new THREE.AmbientLight(0xffe9c4, 0.18))

  // The sphinx: off the pyramid's corner, facing out into the open desert the
  // way its model does at Giza, with its plinth already half taken by the sand.
  const sphinx = makeSphinx()
  const sx = -3.3
  const sz = 1.3
  sphinx.scale.setScalar(0.72)
  sphinx.position.set(sx, duneHeight(sx, sz) - 0.06, sz)
  // Local +X is its gaze. Pointing it down +X sets it staring across the court
  // at the monument, and — since the sun also comes from +X — puts the lit side
  // of its face towards the camera instead of the shadowed one.
  sphinx.rotation.y = 0
  scene.add(sphinx)

  scene.add(makeRubble())

  // -------------------------------------------------------------------------
  // The monument
  //
  // One InstancedMesh sized for the deepest level; every frame rewrites the
  // matrices for however many blocks the current state calls for.
  // -------------------------------------------------------------------------
  const depths = buildDepths(MAX_DEPTH)
  const capacity = depths[MAX_DEPTH].length / 4
  const blockGeo = makeBlockGeometry()
  const blockMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.92,
    metalness: 0,
    flatShading: true,
  })
  const blocks = new THREE.InstancedMesh(blockGeo, blockMat, capacity)
  blocks.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  blocks.castShadow = true
  blocks.receiveShadow = true
  blocks.frustumCulled = false

  // Quarried stone is never one colour. A stable per-slot tint keeps the
  // silhouette from flattening into a single tan mass.
  {
    const c = new THREE.Color()
    for (let i = 0; i < capacity; i++) {
      const n = Math.sin(i * 12.9898) * 43758.5453
      const r = n - Math.floor(n)
      c.copy(PALETTE.stone).offsetHSL((r - 0.5) * 0.02, (r - 0.5) * 0.06, (r - 0.5) * 0.13)
      blocks.setColorAt(i, c)
    }
    blocks.instanceColor.needsUpdate = true
  }

  const monument = new THREE.Group()
  monument.scale.setScalar(SIZE)
  monument.add(blocks)
  scene.add(monument)

  // Mirror of what's currently on screen, in unit space: (x, y, z, scale) per
  // live block. The sand sampler draws its origins straight out of this.
  const activeBuf = new Float32Array(capacity * 4)
  let activeCount = 0

  const veil = new SandVeil({ capacity: Q.sand, pixelScale: 32 })
  scene.add(veil.points)

  // -------------------------------------------------------------------------
  // Composer
  // -------------------------------------------------------------------------
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  if (Q.bloom) {
    composer.addPass(
      new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.3, 0.75, 0.86),
    )
  }
  const heat = new ShaderPass(HeatHazeShader)
  heat.uniforms.uAmp.value = reduceMotion ? 0.0032 : 0.011
  composer.addPass(heat)
  composer.addPass(new OutputPass())

  function resize() {
    const w = window.innerWidth
    const h = window.innerHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
    composer.setSize(w, h)
  }
  window.addEventListener('resize', resize)

  // -------------------------------------------------------------------------
  // Resolution governor
  //
  // This scene is fill-bound, not geometry-bound: measured on a software
  // rasteriser, frame time tracks pixel count almost exactly. So when frames
  // get slow the fix is fewer pixels, and rendering below the display's
  // resolution costs less than any feature this piece would have to give up.
  //
  // It holds full resolution for the first few seconds no matter what. The
  // gallery screenshots at 1200 ms, and a card shot through a half-resolution
  // buffer looks like a mistake — whereas a viewer who stays past the grace
  // period would rather have the frame rate.
  // -------------------------------------------------------------------------
  const SCALES = [1, 0.78, 0.6]
  const GRACE = 4 // seconds of full-resolution rendering before any stepping
  let scaleIdx = 0
  let frameAvg = 1 / 60
  let lastStep = 0

  function govern(dt, elapsed) {
    frameAvg += (dt - frameAvg) * 0.1
    if (elapsed < GRACE || elapsed - lastStep < 1.5) return
    const next =
      frameAvg > 0.09 && scaleIdx < SCALES.length - 1
        ? scaleIdx + 1
        : frameAvg < 0.028 && scaleIdx > 0
          ? scaleIdx - 1
          : scaleIdx
    if (next === scaleIdx) return
    scaleIdx = next
    lastStep = elapsed
    const p = Q.dpr * SCALES[scaleIdx]
    renderer.setPixelRatio(p)
    composer.setPixelRatio(p)
    resize()
  }

  // -------------------------------------------------------------------------
  // State at a moment in the cycle
  // -------------------------------------------------------------------------
  const easeInOut = (u) => u * u * (3 - 2 * u)
  const easeOut = (u) => 1 - (1 - u) ** 3
  const easeIn = (u) => u * u * u
  // Blocks near the ground let go first and the release ripples up the
  // monument, so a split reads as something coming apart under its own weight.
  const STAGGER = 0.45

  function stateAt(time) {
    const t = ((time % CYCLE) + CYCLE) % CYCLE
    let seg = PLAN[0]
    let idx = 0
    for (let i = 0; i < PLAN.length; i++) {
      if (t >= PLAN[i].start) {
        seg = PLAN[i]
        idx = i
      }
    }
    const u = clamp((t - seg.start) / seg.dur, 0, 1)
    const st = {
      idx,
      kind: seg.kind,
      from: seg.depth,
      to: seg.depth,
      progress: u,
      split: -1, // eased split progress, or -1 when not splitting
      rise: 1,
      shake: 0,
      phase: 'SETTLED',
      time,
    }
    switch (seg.kind) {
      case 'buried':
        st.rise = 0
        st.phase = 'BURIED'
        break
      case 'rise':
        st.rise = easeOut(u)
        st.phase = 'RISING'
        break
      case 'rumble':
        // Builds, with a stutter in it — the ground arguing with itself.
        st.shake = u ** 1.7 * (0.78 + 0.22 * Math.sin(time * 41))
        st.to = seg.depth + 1
        st.phase = 'RUMBLING'
        break
      case 'split':
        st.to = seg.depth + 1
        st.split = u
        st.shake = 0.55 * (1 - u) ** 2
        st.phase = 'SPLITTING'
        break
      case 'sink':
        st.rise = 1 - easeIn(u)
        st.phase = 'SINKING'
        break
      default:
        st.phase = 'SETTLED'
    }
    return st
  }

  // -------------------------------------------------------------------------
  // Writing the blocks
  //
  // Holding a depth is a straight copy. A split walks the finer level instead:
  // block i's parent is always floor(i / 5), so each of the five children can
  // be flown from sitting exactly inside the parent out to its own corner. At
  // u = 0 the five are nested in the parent's shell — each a hair smaller than
  // the last so coplanar faces can't fight — and the monument looks untouched
  // until the stone actually starts to move.
  // -------------------------------------------------------------------------
  function writeBlocks(st) {
    const m = _mat
    const splitting = st.split >= 0
    const fine = depths[splitting ? st.from + 1 : st.from]
    const coarse = depths[st.from]
    const n = fine.length / 4
    const jitter = st.shake * 0.006

    for (let i = 0; i < n; i++) {
      const b = i * 4
      let x = fine[b]
      let y = fine[b + 1]
      let z = fine[b + 2]
      let s = fine[b + 3]

      if (splitting) {
        const p = ((i / 5) | 0) * 4
        const py = coarse[p + 1]
        const ps = coarse[p + 3]
        const delay = (py / PYRAMID_H) * STAGGER
        const u = easeInOut(clamp((st.split - delay) / (1 - STAGGER), 0, 1))
        const nest = ps * (1 - (i % 5) * 0.004)
        x = lerp(coarse[p], x, u)
        y = lerp(py, y, u)
        z = lerp(coarse[p + 2], z, u)
        s = lerp(nest, s, u)
      }

      if (jitter > 0) {
        x += Math.sin(st.time * 47 + i * 1.7) * jitter
        y += Math.sin(st.time * 61 + i * 3.1) * jitter * 0.6
        z += Math.cos(st.time * 53 + i * 2.3) * jitter
      }

      activeBuf[b] = x
      activeBuf[b + 1] = y
      activeBuf[b + 2] = z
      activeBuf[b + 3] = s
      m.makeScale(s, s, s)
      m.setPosition(x, y, z)
      blocks.setMatrixAt(i, m)
    }

    activeCount = n
    blocks.count = n
    blocks.instanceMatrix.needsUpdate = true
    monument.position.y = BASE_Y - (1 - st.rise) * BURY
  }

  // -------------------------------------------------------------------------
  // Sand
  //
  // Grains are sampled off the lip of a random stone course on a random live
  // block, converted to world space, and rejected if that lip is still under
  // the desert — which is what makes the emergence work without any special
  // case: sand only pours off the part that has actually surfaced.
  // -------------------------------------------------------------------------
  // Grains come in runs. A run holds one block and one ledge for a few dozen
  // grains and staggers their release over a third of a second, which is the
  // difference between a curtain pouring off an edge and an even fog of dust.
  const spot = { tier: 0, side: 0, along: 0, block: 0, left: 0, stream: 0 }

  function sampleGrain(pos, vel) {
    if (activeCount === 0) return false
    // A run also ends when its block index falls off the end of a shallower
    // level, which happens the moment a depth change resizes the live set.
    if (spot.left <= 0 || spot.block >= activeCount * 4) {
      pickLedge(spot)
      spot.block = ((Math.random() * activeCount) | 0) * 4
      spot.left = 10 + ((Math.random() * 22) | 0)
      spot.stream = 0.12 + Math.random() * 0.3 // how long this run keeps pouring
    }
    spot.left--
    const b = spot.block
    const bs = activeBuf[b + 3]
    ledgeGrain(spot, 0.5, _lp, _ln)
    const x = (activeBuf[b] + _lp.x * bs) * SIZE
    const y = (activeBuf[b + 1] + _lp.y * bs) * SIZE + monument.position.y
    const z = (activeBuf[b + 2] + _lp.z * bs) * SIZE
    if (y < duneHeight(x, z) + 0.05) return false
    pos.set(x, y, z)
    // A sheet doesn't leap — it slides over the edge and lets go.
    const push = 0.04 + Math.random() * 0.13
    vel.set(_ln.x * push, -0.02 - Math.random() * 0.06, _ln.z * push)
    return Math.random() * spot.stream
  }

  let emitAcc = 0
  let lastIdx = -1

  function emitSand(st, dt) {
    // A split throws everything loose at once; that's one hard sheet, not a
    // rate. Fired on the segment change so a rewound clock re-fires it.
    if (st.idx !== lastIdx) {
      lastIdx = st.idx
      if (st.kind === 'split') veil.emit(Math.round(3400 * Q.rate), st.time, sampleGrain, 0.14)
    }

    let rate = 0
    switch (st.kind) {
      case 'rise':
        rate = 2300
        break
      case 'rumble':
        rate = 300 + 3400 * st.shake ** 2
        break
      case 'split':
        rate = 2600 * (1 - st.progress) ** 1.2
        break
      case 'hold':
        rate = 90 // the desert never actually stops taking it back
        break
      case 'sink':
        rate = 800
        break
    }
    emitAcc += rate * Q.rate * dt
    const n = Math.min(1200, emitAcc | 0)
    emitAcc -= n
    if (n > 0) veil.emit(n, st.time, sampleGrain, dt)
  }

  // -------------------------------------------------------------------------
  // Loop
  // -------------------------------------------------------------------------
  let simTime = reduceMotion ? REST_T : START_T
  let paused = reduceMotion
  const camBase = camera.position.clone()

  // Warm start: replay the couple of seconds before the opening frame so the
  // first painted frame already has sand in the air where it belongs, instead
  // of a monument mid-split under a clear sky.
  if (!reduceMotion) {
    const step = 1 / 60
    for (let t = START_T - WARMUP; t < START_T; t += step) {
      const st = stateAt(t)
      writeBlocks(st)
      emitSand(st, step)
    }
  }
  {
    const st = stateAt(simTime)
    writeBlocks(st)
    veil.update(simTime)
    updateHud(st, paused)
  }

  addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault()
      paused = !paused
      controls.autoRotate = !paused && !reduceMotion
    }
  })

  const clock = new THREE.Clock()
  renderer.setAnimationLoop(() => {
    // Generous clamp: it only exists to swallow the jump after a backgrounded
    // tab. Clamping it near a frame's length instead would put a slow renderer
    // into slow motion — the cycle has to run at the same speed everywhere.
    const dt = Math.min(clock.getDelta(), 0.2)
    govern(dt, clock.getElapsedTime())
    if (!paused) simTime += dt

    const st = stateAt(simTime)
    writeBlocks(st)
    if (!paused) emitSand(st, dt)
    veil.update(simTime)
    updateHud(st, paused)

    // Keep the rattle off the controls: restore the clean position, let them
    // integrate, then displace the camera for this frame only.
    camera.position.copy(camBase)
    controls.update()
    camBase.copy(camera.position)
    if (st.shake > 0.001 && !reduceMotion) {
      const a = st.shake * 0.055
      camera.position.x += Math.sin(simTime * 71.3) * a
      camera.position.y += Math.sin(simTime * 96.1) * a * 0.8
      camera.position.z += Math.cos(simTime * 63.7) * a
      camera.rotateZ(Math.sin(simTime * 44.9) * st.shake * 0.006)
    }

    heat.uniforms.uTime.value = simTime
    composer.render()
  })
}

// Half-buried offcuts scattered around the court — the quarry's leftovers, and
// a bit of scale next to a monument that keeps changing size.
function makeRubble() {
  const group = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({
    color: 0xb59a72,
    roughness: 0.96,
    metalness: 0,
    flatShading: true,
  })
  // All kept off the near foreground — a half-buried slab a couple of metres
  // from the lens reads as a smudge, not as scale.
  const spots = [
    [-2.6, 2.6, 0.26],
    [2.9, -3.6, 0.22],
    [-2.2, -3.9, 0.18],
    [4.6, 0.9, 0.24],
    [-5.2, -2.4, 0.16],
    [4.4, 3.4, 0.2],
  ]
  for (const [x, z, s] of spots) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(s * 1.6, s, s * 1.15), mat)
    m.position.set(x, duneHeight(x, z) - s * 0.45, z)
    m.rotation.set((Math.sin(x) * 0.12), Math.sin(x * z) * Math.PI, Math.cos(z) * 0.1)
    m.castShadow = true
    m.receiveShadow = true
    group.add(m)
  }
  return group
}
