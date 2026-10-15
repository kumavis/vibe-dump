import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { buildBoard } from './board.js'
import { buildDie } from './die.js'
import { FLOORPLAN } from './floorplan.js'
import dieUrl from './assets/raptor-lake-die.jpg'
import { STEPS, STAGES } from './steps.js'
import { Timeline } from './timeline.js'
import { Director } from './camera.js'
import { UI } from './ui.js'
import { MODE_COLORS, smooth } from './util.js'

const canvas = document.getElementById('gl')
// No WebGL: say so (index.html's inline script owns the message) rather than
// leave the boot screen pulsing forever. The main view goes through the
// composer's non-multisampled target, so canvas MSAA would buy nothing.
let renderer
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
} catch (err) {
  window.__coldbootNoGl?.()
  throw err
}
// A software rasterizer (SwiftShader, llvmpipe — also how the gallery thumbnail
// is shot) takes many seconds per frame at DPR 2, so it renders at DPR 1.
const gl = renderer.getContext()
const glInfo = gl.getExtension('WEBGL_debug_renderer_info')
const softwareGL = /SwiftShader|llvmpipe|softpipe|Software/i.test(String(gl.getParameter(glInfo ? glInfo.UNMASKED_RENDERER_WEBGL : gl.RENDERER)))
const pixelRatio = () => Math.min(softwareGL ? 1 : 2, window.devicePixelRatio || 1)
renderer.setPixelRatio(pixelRatio())
// Post-processing renders into half-float targets; a few devices can't.
const glExt = renderer.extensions
const floatRT = renderer.capabilities.isWebGL2
  ? glExt.has('EXT_color_buffer_float') || glExt.has('EXT_color_buffer_half_float')
  : glExt.has('OES_texture_half_float') && glExt.has('EXT_color_buffer_half_float')
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.05
renderer.outputColorSpace = THREE.SRGBColorSpace

const scene = new THREE.Scene()
scene.background = new THREE.Color('#05060b')
scene.fog = new THREE.Fog('#05060b', 600, 1400)
// Image-based lighting. It lives in a render target, so it has to be baked
// again if the GL context is lost and restored (mobile browsers do that).
function bakeEnvironment() {
  if (!floatRT) return // PMREM renders into half-float targets too
  const pmrem = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment(renderer)
  scene.environment = pmrem.fromScene(room, 0.04).texture
  room.dispose?.()
  pmrem.dispose()
}
bakeEnvironment()
canvas.addEventListener('webglcontextrestored', bakeEnvironment)

const camera = new THREE.PerspectiveCamera(40, 1, 0.3, 4000)

// Lights: a cool key from above-front, a warm rim, and a dim fill so the board
// reads in silhouette even when nothing is glowing.
scene.add(new THREE.HemisphereLight('#8090c0', '#0a0a10', 0.35))
const key = new THREE.DirectionalLight('#dfe6ff', 1.4)
key.position.set(-120, 260, 180)
scene.add(key)
const rim = new THREE.DirectionalLight('#ffb070', 0.55)
rim.position.set(220, 80, -200)
scene.add(rim)

// Ask for the die photo first, so the download overlaps building the scene.
// (The callback is always asynchronous: `die` and `trueColor` exist by then.)
new THREE.TextureLoader().load(dieUrl, (t) => {
  die.setPhoto(t)
  die.setTrueColor(trueColor)
})

const maxTex = renderer.capabilities.maxTextureSize
const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy())
const board = buildBoard({ anisotropy: aniso })
scene.add(board.group)
// The procedural die is only a stand-in until the photo arrives.
const die = buildDie(FLOORPLAN, { maxTexture: Math.min(2048, maxTex), anisotropy: aniso })
die.group.position.copy(board.socketWorld)
// In the socket the die's long axis runs along the DIMM slots and its DDR PHY
// edge (the top of the photo) faces the DIMMs.
die.group.rotation.y = -Math.PI / 2
scene.add(die.group)
die.group.updateMatrixWorld(true)
const dieCenter = board.socketWorld.clone()

// The photo is colour-graded to sit in the scene; this shows it as shot.
const trueBtn = document.getElementById('truecolor')
let trueColor = false
function toggleTrueColor() {
  trueColor = !trueColor
  die.setTrueColor(trueColor)
  trueBtn.setAttribute('aria-pressed', String(trueColor))
}
trueBtn.addEventListener('click', toggleTrueColor)
window.addEventListener('keydown', (e) => {
  if ((e.key === 't' || e.key === 'T') && !e.metaKey && !e.ctrlKey && !e.altKey) toggleTrueColor()
})

// Named camera shots. Positions are relative to the things they frame, so
// moving a component moves its shot with it.
const V = (x, y, z) => new THREE.Vector3(x, y, z)
const at = (target, offset, fov = 40) => () => ({ target: target.clone(), pos: target.clone().add(offset), fov })
// A shot framed in the die's own frame (x along the long edge, z towards the
// bottom edge of the photo), so it follows the die however it sits.
const onDie = (target, offset, fov = 40) => () => {
  const t = die.group.localToWorld(target.clone())
  return { target: t, pos: die.group.localToWorld(target.clone().add(offset)), fov }
}
const blockCenter = (id) => die.blocks.get(id).center.clone()
const comp = (id) => board.comps.get(id).anchor.clone()
const mid = (...pts) => pts.reduce((a, p) => a.add(p), V(0, 0, 0)).multiplyScalar(1 / pts.length)
const shots = {
  overview: at(V(0, 0, 8), V(0, 330, 330), 40),
  standby: at(mid(comp('atx24'), comp('pch'), comp('fpanel')).setY(0), V(-30, 150, 170), 40),
  power: at(mid(comp('atx24'), comp('vrm'), comp('pch')).setY(0), V(-20, 230, 220), 40),
  pch: at(mid(comp('pch'), comp('spi')).setY(0), V(-10, 85, 100), 38),
  socket: onDie(V(0, 0, 0), V(0, 62, 72), 38),
  die: onDie(V(0, 0, 0.6), V(0, 30.5, 21.5), 40),
  dieLow: onDie(V(-2, 0, 0), V(-8, 11, 19), 38),
  dieLeft: onDie(V(-5.5, 0, 0.4), V(-3, 17, 13.5), 38),
  dieRight: onDie(V(5.5, 0, 0.4), V(3, 17, 13.5), 38),
  bsp: onDie(blockCenter('pcore0').add(V(0.6, 0, 1.2)), V(-1.5, 7.5, 6), 38),
  sa: onDie(V(-8.5, 0, -0.6), V(-2.5, 11, 10), 38),
  fetch: at(mid(dieCenter.clone(), comp('spi')).setY(0), V(-10, 190, 190), 40),
  dimms: at(V(dieCenter.x + 62, 14, dieCenter.z + 18), V(150, 105, 150), 40),
  memory: at(V(dieCenter.x + 40, 0, dieCenter.z + 5), V(10, 150, 140), 40),
  pcie: at(mid(dieCenter.clone(), comp('nvme'), comp('gpu').setY(0), comp('pch')).setY(0).add(V(12, 0, 6)), V(20, 260, 240), 40),
  attract: onDie(V(0, 0, 0), V(-9, 12, 17), 36),
  imc: onDie(V(-8.2, 0, -3.0), V(-1.5, 10, 9.5), 38),
  llc: onDie(V(-1.5, 0, 0), V(0, 13, 10), 38),
  spd: at(V(30, 0, 5), V(55, 190, 175), 40),
}

// Shots framed on the die itself: the heat-spreader must be off for these.
const DIE_SHOTS = new Set(['die', 'dieLow', 'dieLeft', 'dieRight', 'bsp', 'sa', 'imc', 'llc', 'attract'])

const timeline = new Timeline(STEPS)
const director = new Director(camera, renderer.domElement, shots)
const ui = new UI({ timeline, stages: STAGES, lpLayout: die.lps, onSpeed: (s) => (timeline.speed = s) })

// --- post -------------------------------------------------------------------
// Without float render targets there is no post-processing and no image-based
// lighting: the scene draws straight to the canvas (every material, including
// the custom overlay shaders, tone-maps and encodes sRGB itself) and is darker.
const composer = floatRT ? new EffectComposer(renderer) : null
if (composer) {
  composer.addPass(new RenderPass(scene, camera))
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.7, 0.5, 0.84))
  composer.addPass(new OutputPass())
}
// The picture-in-picture inset goes through the same linear pipeline (minus
// bloom), so materials don't flip shader variants every frame between the two.
const insetCam = new THREE.PerspectiveCamera(40, 1.6, 0.3, 4000)
const insetEl = document.getElementById('inset')
let insetName = null
let insetRect = null // measured when the inset appears and on resize, not every frame
let insetSize = ''
let insetLabel = null
const insetComposer = floatRT ? new EffectComposer(renderer) : null
if (insetComposer) {
  insetComposer.addPass(new RenderPass(scene, insetCam))
  insetComposer.addPass(new OutputPass())
}

// The side panel and timeline sit over the canvas, so the camera's optical
// centre is shifted into the uncovered part of the screen: render a window of
// a larger virtual frustum whose centre lands in the free area.
function resize() {
  const w = window.innerWidth
  const h = window.innerHeight
  // Browser zoom or a move to another screen changes the pixel ratio.
  const pr = pixelRatio()
  if (pr !== renderer.getPixelRatio()) {
    renderer.setPixelRatio(pr)
    composer?.setPixelRatio(pr)
    insetComposer?.setPixelRatio(pr)
  }
  renderer.setSize(w, h, false)
  composer?.setSize(w, h)
  // The free part of the screen: left of a right-hand panel (desktop,
  // landscape phones) and above the timeline, or between the brand block and
  // the stage chips over a bottom sheet (portrait phones).
  const rect = (id) => document.getElementById(id).getBoundingClientRect()
  const panel = rect('panel')
  const tl = rect('timeline')
  let ox = 0
  let top = 0
  let bottom = h
  if (!document.body.classList.contains('intro')) {
    if (panel.left > w * 0.3) {
      ox = w - panel.left
      bottom = tl.top
    } else {
      top = rect('brand').bottom
      bottom = Math.min(panel.top, tl.top, rect('stages').top)
    }
  }
  // Put the optical centre in the middle of that area: render a window of a
  // larger virtual frustum whose centre lands there.
  const d = h / 2 - (top + bottom) / 2
  const fw = w + ox
  const fh = h + 2 * Math.abs(d)
  camera.aspect = fw / fh
  camera.setViewOffset(fw, fh, ox, d > 0 ? 2 * d : 0, w, h)
  camera.updateProjectionMatrix()
  ui.view = { right: w - ox, bottom }
  ui.obstaclesDirty = true
  if (insetName) insetRect = insetEl.getBoundingClientRect()
  director.setFrame((bottom - top) / fh, (w - ox) / fh)
  // Backed-off shots sit farther away; keep the fog where it was relative to them.
  scene.fog.near = 600 * director.backoff
  scene.fog.far = 1400 * director.backoff
  if (director.current && !director.userMoved) {
    if (director.flight) {
      // mid-flight: aim the flight at the shot as framed for the new size
      const s = director.shotFor(director.current)
      director.flight.toPos.copy(s.pos)
      director.flight.toTarget.copy(s.target)
    } else director.go(director.current, { instant: true })
  }
}
window.addEventListener('resize', resize)
resize()

// --- the activity API steps write into ------------------------------------------
const lpModes = die.lps.map(() => 'off')
const A = {
  die: (sel, level, color, style) => die.light(sel, level, color, style),
  ring: (level, color) => die.ringLevel(level, color),
  flow: (key, from, to, rate, color, speed) => die.stream(key, from, to, rate, color, speed),
  board: (id, level, color, style) => board.light(id, level, color, style),
  bus: (name, level, color, opts) => board.bus(name, level, color, opts),
  chips: (fn, color) => board.chips(fn, color),
  dimmPart: (which, level, color) => board.dimmPart(which, level, color),
  lp: (i, mode) => (lpModes[i] = mode),
  lps: (fn) => lpModes.forEach((m, i) => (lpModes[i] = fn(i, die.lps[i]))),
  nP: die.lps.filter((l) => l.kind === 'p').length,
}

// --- labels -----------------------------------------------------------------
const tmp = new THREE.Vector3()
function labelItems(st, p) {
  const out = []
  for (const L of st.labels || []) {
    const spec = typeof L === 'string' ? { id: L } : L
    if (spec.from != null && p < spec.from) continue
    if (spec.to != null && p > spec.to) continue
    const c = board.comps.get(spec.id)
    if (c) {
      out.push({ id: spec.id, text: spec.text || c.label || spec.id, pos: c.anchor, hot: spec.hot, color: spec.color })
      continue
    }
    const b = die.blocks.get(spec.id)
    if (b && (spec.always || director.dieCloseness(dieCenter) > 0.45)) {
      tmp.copy(b.center)
      die.group.localToWorld(tmp)
      out.push({ id: spec.id, text: spec.text || b.label || spec.id, pos: tmp.clone().setY(tmp.y + 0.2), hot: spec.hot, color: spec.color })
    }
  }
  return out
}

// --- hover ------------------------------------------------------------------------
// What each kind of block on the die is, for the hover card.
const KIND_INFO = {
  pcore: 'Raptor Cove performance core · 2 hardware threads · 2 MB private L2',
  ecore_cluster: 'Four Gracemont efficiency cores (one thread each) sharing a 4 MB L2',
  llc_slice: 'One 3 MB slice of the 36 MB shared L3 / last-level cache',
  ring: 'The ring bus (“compute fabric”): cores, L3 slices, system agent and GPU all sit on it',
  imc: 'Integrated memory controller: two DDR5 channels',
  ddr_phy: 'DDR5/DDR4 PHY: the analog transceivers memory training tunes',
  pcie_phy: 'PCIe PHY lanes',
  dmi: 'DMI 4.0 ×8 — the CPU’s link to the chipset, and so to the BIOS flash',
  pcie_ctrl: 'DMI and PCIe controllers',
  display: 'Display engine (4 pipes)',
  display_phy: 'Display PHYs',
  igpu: 'Intel UHD Graphics 770 (32 execution units)',
  media: 'Media engine (video encode / decode)',
  system_agent: 'System agent: the uncore glue between the ring and the outside world',
  whole: 'Raptor Lake-S 8P+16E die',
}
const ray = new THREE.Raycaster()
const ndc = new THREE.Vector2()
const diePlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -dieCenter.y)
let hover = null
renderer.domElement.addEventListener('pointermove', (e) => {
  hover = { x: e.clientX, y: e.clientY }
})
renderer.domElement.addEventListener('pointerleave', () => (hover = null))
function hoverInfo() {
  if (!hover || introOn) return null
  ndc.set((hover.x / window.innerWidth) * 2 - 1, -(hover.y / window.innerHeight) * 2 + 1)
  ray.setFromCamera(ndc, camera)
  const hit = new THREE.Vector3()
  if (ray.ray.intersectPlane(diePlane, hit)) {
    const local = die.group.worldToLocal(hit.clone())
    if (Math.abs(local.x) <= die.W / 2 && Math.abs(local.z) <= die.H / 2) {
      const b = die.blockAt(local.x, local.z)
      if (b) {
        const parent = b.parent ? die.blocks.get(b.parent) : null
        return { title: b.label || b.id, sub: parent ? `${parent.label} — ${KIND_INFO[parent.kind] || ''}` : KIND_INFO[b.kind] || '' }
      }
    }
  }
  // board components: nearest anchor on screen
  let best = null
  let bd = 40
  for (const c of board.comps.values()) {
    if (!c.label) continue
    const v = c.anchor.clone().project(camera)
    const sx = ((v.x + 1) / 2) * window.innerWidth
    const sy = ((1 - v.y) / 2) * window.innerHeight
    const d = Math.hypot(sx - hover.x, sy - hover.y)
    if (v.z < 1 && d < bd) {
      bd = d
      best = c
    }
  }
  return best ? { title: best.label } : null
}

const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

// --- intro / attract mode ---------------------------------------------------------
let introOn = true
const intro = document.getElementById('intro')
// While the title card is up, the chrome behind it is invisible: keep it out of
// the tab order and the accessibility tree, so ⏻ is the first stop.
const chrome = ['brand', 'stages', 'panel', 'timeline', 'lps', 'eye', 'inset'].map((id) => document.getElementById(id))
for (const el of chrome) el.inert = true
director.go('attract', { instant: true })
function dismissIntro() {
  if (!introOn) return false
  introOn = false
  intro.classList.add('gone')
  document.body.classList.remove('intro')
  for (const el of chrome) el.inert = false
  const focused = document.activeElement
  intro.inert = true
  if (!focused || focused === document.body || intro.contains(focused)) document.getElementById('play').focus({ preventScroll: true })
  resize()
  return true
}
function startBoot() {
  if (!dismissIntro()) return
  timeline.go(0)
  timeline.play()
}
document.getElementById('power').addEventListener('click', startBoot)

// In attract mode the die idles in a slow orbit with every core showing a mode
// colour, as a preview of where the walkthrough ends up.
function attract(time) {
  const lpCount = die.lps.length
  for (let i = 0; i < lpCount; i++) {
    const phase = (time * 0.25 + i * 0.07) % 4
    lpModes[i] = phase < 1 ? 'real' : phase < 2 ? 'prot' : phase < 3 ? 'long' : 'wfs'
  }
  die.light('kind:llc_slice', 0.35 + 0.15 * Math.sin(time * 1.3), '#ff6bd5', 'pinned')
  die.light('kind:ddr_phy', 0.5, '#ff8a3d', 'sparkle')
  die.light('kind:imc', 0.35, '#ff8a3d', 'sparkle')
  die.ringLevel(0.7, '#bfb6ff')
  die.stream('a1', 'pcore0', 'imc0', 3, '#7cf2ff', 5)
  const c = director.shotFor('attract')
  const ang = time * 0.06
  const off = c.pos.clone().sub(c.target)
  off.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.sin(ang) * 0.5)
  if (!director.userMoved) {
    camera.position.copy(c.target).add(off)
    director.controls.target.copy(c.target)
  }
}

// --- picture-in-picture inset ----------------------------------------------------
// A second camera rendered into a scissored corner, for steps where the action
// spans both scales at once (a core on the die fetching from a chip on the board).

const insetTarget = new THREE.Vector3()
function renderInset(st, dt) {
  const want = introOn ? null : typeof st.inset === 'object' && st.inset ? st.inset.shot : st.inset || null
  if (want !== insetName) {
    insetName = want
    insetEl.hidden = !want
    ui.obstaclesDirty = true
    if (want) {
      const s = shots[want]()
      insetCam.position.copy(s.pos)
      insetTarget.copy(s.target)
      insetCam.fov = s.fov
      insetRect = insetEl.getBoundingClientRect()
    }
  }
  // steps can share an inset shot but caption it differently
  const label = (typeof st.inset === 'object' && st.inset?.label) || ''
  if (want && label !== insetLabel) {
    insetLabel = label
    insetEl.querySelector('.lbl').textContent = label
    ui.obstaclesDirty = true
  }
  if (!want) return
  const r = insetRect
  if (!r || r.width < 4) return
  const s = shots[want]()
  insetCam.position.lerp(s.pos, Math.min(1, dt * 3))
  insetTarget.lerp(s.target, Math.min(1, dt * 3))
  insetCam.aspect = r.width / r.height
  insetCam.updateProjectionMatrix()
  insetCam.lookAt(insetTarget)
  const H = window.innerHeight
  renderer.setScissorTest(true)
  renderer.setScissor(r.left, H - r.bottom, r.width, r.height)
  renderer.setViewport(r.left, H - r.bottom, r.width, r.height)
  renderer.setClearColor('#070912', 1)
  if (insetComposer) {
    // The scene renders into the inset composer's own target; only its final
    // full-screen pass lands on the canvas, inside this viewport and scissor.
    const size = `${r.width}x${r.height}`
    if (size !== insetSize) {
      insetSize = size
      insetComposer.setSize(r.width, r.height)
    }
    insetComposer.render()
  } else {
    renderer.clear(true, true)
    renderer.render(scene, insetCam)
  }
  renderer.setScissorTest(false)
  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight)
}

// --- loop -------------------------------------------------------------------------
let last = performance.now()
let time = 0
// The page opens in attract mode, with the lid already off.
let lid = 1
// Real-time offsets: each step's start in seconds since the power button. A
// step's `real` may differ between a normal boot (saved memory-training results
// restored) and the first boot with new DIMMs (full training).
let bootKind = 'normal'
const realOf = (st) => (typeof st.real === 'object' ? st.real[bootKind] : st.real || 0)
const clock = { realBase: STEPS.map(() => 0) }
function computeClock() {
  let acc = 0
  STEPS.forEach((st, i) => {
    clock.realBase[i] = acc
    acc += realOf(st)
  })
}
computeClock()
const bootBtn = document.getElementById('bootkind')
bootBtn.addEventListener('click', () => {
  bootKind = bootKind === 'normal' ? 'first' : 'normal'
  bootBtn.innerHTML = bootKind === 'normal' ? '<span class="long">normal boot</span><span class="short">normal</span>' : '<span class="long">first boot · new DIMMs</span><span class="short">1st boot</span>'
  bootBtn.classList.toggle('first', bootKind === 'first')
  computeClock()
})
const resetIndex = STEPS.findIndex((s) => s.isReset)

function shotAt(st, p) {
  if (!st.shot) return null
  if (typeof st.shot === 'string') return st.shot
  let name = st.shot[0][1]
  for (const [from, s] of st.shot) if (p >= from) name = s
  return name
}

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000)
  last = now
  // Motion (shader time, packets) runs only while playing — Pause freezes the
  // scene — and in the attract loop unless reduced motion is asked for. Level
  // fades and camera moves still use dt.
  const animDt = timeline.playing || (introOn && !reduceMotion) ? dt : 0
  time += animDt
  timeline.update(dt)
  const st = timeline.step
  const p = timeline.p

  die.begin()
  board.begin()
  if (introOn) {
    attract(time)
  } else {
    if (st.lps) A.lps(st.lps(p))
    A.bootKind = bootKind
    st.act?.(p, A, time)
    const s = shotAt(st, p)
    if (s && s !== director.current) director.go(s, { instant: reduceMotion })
  }
  for (let i = 0; i < lpModes.length; i++) die.setLp(i, lpModes[i], lpModes[i] === 'off' ? 0 : 1)

  // Heat-spreader: lifted off whenever the camera is near the die or the step asks.
  const close = director.dieCloseness(dieCenter)
  const insetOnDie = typeof st.inset === 'object' && st.inset && DIE_SHOTS.has(st.inset.shot)
  const wantLid = introOn ? 1 : st.lid === false || insetOnDie || close > 0.25 ? 1 : 0
  lid += (wantLid - lid) * Math.min(1, dt * 3)
  // It lifts a little and fades out rather than hovering over the scene.
  const ls = smooth(Math.min(1, lid * 1.8))
  board.ihs.position.y = board.socketWorld.y - 0.4 + ls * 14
  board.ihs.traverse((o) => {
    for (const m of [].concat(o.material || [])) m.opacity = 1 - ls
  })
  board.ihs.visible = ls < 0.99

  die.update(dt, time, animDt)
  board.update(dt, time, animDt)
  director.update(dt)
  // OrbitControls' lookAt leaves the matrices half-updated until render; labels
  // and hover picking project through them first.
  camera.updateMatrixWorld()

  const real = clock.realBase[timeline.i] + realOf(st) * p
  const resetT = resetIndex >= 0 && timeline.i >= resetIndex ? real - clock.realBase[resetIndex] : null
  ui.frame({ realT: real, resetT, lpModes, step: st, p, time, ctx: { bootKind } })
  ui.labels(introOn ? [] : labelItems(st, p), camera, window.innerWidth, window.innerHeight)
  ui.tip(hoverInfo(), hover?.x ?? 0, hover?.y ?? 0)

  if (composer) composer.render()
  else renderer.render(scene, camera)
  renderInset(st, dt)
  requestAnimationFrame(frame)
}

timeline.on((kind) => {
  // Play (Space) from the intro starts the boot from the top, like ⏻.
  if (kind === 'play' && introOn) {
    startBoot()
    return
  }
  if (kind === 'step' || kind === 'seek') {
    dismissIntro()
    // Re-centre the camera when the user jumps around the timeline. An
    // automatic advance keeps any orbit the user made until the shot changes.
    if (kind === 'seek') director.current = null
  }
})

requestAnimationFrame((t) => {
  last = t
  frame(t)
  // Compile every shader now, behind the boot screen — including the overlays
  // that are still invisible on this first frame — instead of stalling later.
  renderer.setRenderTarget(composer ? composer.readBuffer : null)
  renderer.compile(scene, camera)
  renderer.setRenderTarget(null)
  document.getElementById('boot').classList.add('gone')
  document.body.classList.add('ready')
})

// Exposed for debugging and for scripted screenshots.
window.__coldboot = { timeline, director, die, board, renderer, MODE_COLORS, bootKind: () => bootKind }
