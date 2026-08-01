import * as THREE from 'three'
import { makeEnvMap } from './src/env.js'
import { createEye } from './src/eye.js'
import { createCloud } from './src/cloud.js'
import { createRadiance } from './src/radiance.js'
import { createTentacles } from './src/tentacles.js'
import { createSky } from './src/sky.js'
import { createTimeline, PHASES } from './src/timeline.js'

// ---------------------------------------------------------------------------
// Eye of Provenance
//
// A thick cast-gold triangle rides a cloud. When it shuts its eye, light breaks
// out from behind it and a corona of gold petals unfurls. Every so often the
// thing behind the gold is not the thing you expected, and what comes out is
// not petals.
//
// Interaction is deliberately thin. Parallax follows the pointer on a desktop
// and device tilt on a phone — but only where tilt costs nothing, i.e. where
// DeviceOrientationEvent has no requestPermission gate. We never prompt.
//
// Clicking the emblem advances it to the next of its three states, and does so
// through a blink, because the eye already owns that gesture and shut lids hide
// every seam a jump would otherwise show.
// ---------------------------------------------------------------------------

const { clamp, lerp } = THREE.MathUtils
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const EYE_Y = 0.78 // world height of the triangle's centroid
// Half-extents the camera must always keep in frame. The width figure is
// deliberately smaller than the corona's actual radius: on a portrait phone the
// outer petal tips are allowed to run off the sides, because framing for them
// shrinks the emblem to a postage stamp.
const FIT_H = 3.75
const FIT_W = 3.1

// --- renderer --------------------------------------------------------------
const canvas = document.getElementById('scene')
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: 'high-performance',
})
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.12

// Headless Chromium renders this app through SwiftShader when the gallery
// screenshots it, and phones are not much better. Detect the software path and
// spend the fill rate somewhere other than resolution.
function isSoftwareRenderer() {
  try {
    const gl = renderer.getContext()
    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    const name = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : ''
    return /swiftshader|llvmpipe|software|mesa offscreen|angle \(google/i.test(name)
  } catch {
    return false
  }
}
const lowPower = isSoftwareRenderer()
// Not 1.0 even on the software path: the gallery screenshots at a device pixel
// ratio of 2, so rendering at 1 and letting the browser upscale ships a soft
// card. 1.5 keeps the triangle's edge — the most important edge in the picture
// — crisp, and this scene has no post-processing to pay for it with.
const maxPixelRatio = lowPower ? 1.5 : 2
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPixelRatio))

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 200)

const envMap = makeEnvMap(renderer)
scene.environment = envMap

// --- lights ----------------------------------------------------------------
scene.add(new THREE.HemisphereLight(0x6d5cff, 0x120a1e, 0.45))

const key = new THREE.DirectionalLight(0xfff1d4, 1.35)
key.position.set(-3.2, 4.0, 5.2)
scene.add(key)

const rim = new THREE.DirectionalLight(0x86a6ff, 0.55)
rim.position.set(4.2, -1.4, -3.6)
scene.add(rim)

// The light the radiance itself throws forward onto the gold and the petals.
const backlight = new THREE.PointLight(0xffc271, 0, 16, 2)
backlight.position.set(0, EYE_Y, -1.4)
scene.add(backlight)

// --- world -----------------------------------------------------------------
const sky = createSky()
scene.add(sky.group)

const world = new THREE.Group()
scene.add(world)

const cloud = createCloud({ puffCount: lowPower ? 80 : 178 })
cloud.mesh.position.set(0, -1.36, 0.1)
world.add(cloud.mesh)

// Everything that belongs to the artifact hangs off one pivot, so parallax can
// counter-rotate it as a unit.
const shrine = new THREE.Group()
shrine.position.y = EYE_Y
world.add(shrine)

// Everything here is large, additive and overlapping, which is exactly what a
// CPU rasteriser hates. On the software path the fan thins out and the halo
// stops covering the whole viewport.
const radiance = createRadiance(envMap, {
  beamCount: lowPower ? 20 : 30,
  haloScale: lowPower ? 10 : 13,
})
shrine.add(radiance.group)

const tentacles = createTentacles(envMap, { count: lowPower ? 7 : 9 })
shrine.add(tentacles.group)

const eye = createEye(envMap)
shrine.add(eye.group)

// --- camera framing --------------------------------------------------------
// Fit the same content on a 21:9 monitor and a portrait phone by solving the
// distance against whichever of the two half-extents is tighter.
function frameCamera() {
  const w = window.innerWidth
  const h = window.innerHeight
  const aspect = w / h
  camera.aspect = aspect
  const halfV = Math.tan((camera.fov * Math.PI) / 360)
  camera.position.z = Math.max(FIT_H, FIT_W / aspect) / halfV
  camera.updateProjectionMatrix()
  renderer.setSize(w, h, false)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPixelRatio))
}
frameCamera()
window.addEventListener('resize', frameCamera)

// --- parallax --------------------------------------------------------------
// Pointer is authoritative on a desktop; tilt takes over the moment a device
// actually reports orientation, since a phone has no pointer to speak of.
const aim = { x: 0, y: 0 }
const smooth = { x: 0, y: 0 }
let tiltActive = false

window.addEventListener('pointermove', (e) => {
  canvas.style.cursor = emblemHit(e.clientX, e.clientY) ? 'pointer' : 'default'
  if (tiltActive) return
  aim.x = (e.clientX / window.innerWidth) * 2 - 1
  aim.y = (e.clientY / window.innerHeight) * 2 - 1
})
window.addEventListener('pointerleave', () => {
  if (!tiltActive) { aim.x = 0; aim.y = 0 }
})

// Device tilt, but only where it is free. Safari on iOS gates
// `deviceorientation` behind DeviceOrientationEvent.requestPermission(), which
// must be called from a user gesture and puts a modal in front of the art —
// so where that gate exists, we simply do without.
const orientationIsFree =
  typeof window.DeviceOrientationEvent !== 'undefined' &&
  typeof window.DeviceOrientationEvent.requestPermission !== 'function'

if (orientationIsFree) {
  let base = null
  window.addEventListener('deviceorientation', (e) => {
    if (e.beta == null || e.gamma == null) return
    if (!base) base = { beta: e.beta, gamma: e.gamma }
    // Rotate the raw axes into screen space, so tilting "right" is still right
    // when the phone is held sideways.
    const angle = (((screen.orientation && screen.orientation.angle) || window.orientation || 0) * Math.PI) / 180
    const g = e.gamma - base.gamma
    const b = e.beta - base.beta
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    aim.x = clamp((g * cos + b * sin) / 22, -1, 1)
    aim.y = clamp((-g * sin + b * cos) / 22, -1, 1)
    tiltActive = true
  })
}

// --- steering --------------------------------------------------------------
// Click the emblem to advance it to the next state. The hit target is a circle
// sized from the casting's own circumradius rather than the geometry, because
// "roughly on the eye" is the intent and a raycast against a beveled extrusion
// would punish near misses.
const probe = new THREE.Vector3()
const probeTip = new THREE.Vector3()

function emblemHit(clientX, clientY) {
  const w = window.innerWidth
  const h = window.innerHeight
  probe.set(0, 0, 0).applyMatrix4(shrine.matrixWorld).project(camera)
  probeTip.set(0, eye.radius, 0).applyMatrix4(shrine.matrixWorld).project(camera)
  const cx = (probe.x * 0.5 + 0.5) * w
  const cy = (-probe.y * 0.5 + 0.5) * h
  const tx = (probeTip.x * 0.5 + 0.5) * w
  const ty = (-probeTip.y * 0.5 + 0.5) * h
  const reach = Math.hypot(tx - cx, ty - cy) * 1.15
  return Math.hypot(clientX - cx, clientY - cy) <= reach
}

// The blink that covers a jump: slam shut, swap the timeline underneath while
// the lids are together, then let the new beat open them.
const BLINK_SHUT = 0.22 // seconds to close
const BLINK_TOTAL = 0.8 // ... and to be fully out of the way again
const easeInOut = (x) => {
  const k = x < 0 ? 0 : x > 1 ? 1 : x
  return k * k * (3 - 2 * k)
}

let ambNow = 0
let blinkAt = -1
let pendingPhase = null
let livePhase = 'sun'
let forceRelease = false

canvas.addEventListener('click', (e) => {
  if (blinkAt >= 0 || !emblemHit(e.clientX, e.clientY)) return
  // A click during the opening hold is proof enough that someone is here.
  forceRelease = true
  pendingPhase = PHASES[(PHASES.indexOf(livePhase) + 1) % PHASES.length]
  blinkAt = ambNow
})

// --- lids, gaze, colours ---------------------------------------------------
const LID_OPEN_UPPER = 0.48
const LID_OPEN_LOWER = 0.28

const SCLERA_HUMAN = new THREE.Color(0xf2e6d2)
const SCLERA_ALIEN = new THREE.Color(0x123a35)
const SCLERA_EM_HUMAN = new THREE.Color(0x140d06)
const SCLERA_EM_ALIEN = new THREE.Color(0x04231b)
const LID_HUMAN = new THREE.Color(0xf5bf59)
const LID_ALIEN = new THREE.Color(0xa8c08a)
const SEAM_WARM = new THREE.Color(0xffe6a8)
const SEAM_COLD = new THREE.Color(0x8dffcd)
const BACKLIGHT_WARM = new THREE.Color(0xffc271)
const BACKLIGHT_COLD = new THREE.Color(0x5fffc0)

const scratchA = new THREE.Color()
const scratchB = new THREE.Color()

// --- loop ------------------------------------------------------------------
const timeline = createTimeline()
const clock = new THREE.Clock()
// Reduced motion still tells the whole story, just at two-thirds speed and
// without the flailing.
const RATE = reduceMotion ? 0.66 : 1

// There are two clocks here, and keeping them apart is what makes the opening
// frame reliable.
//
//   AMBIENT time runs from the first frame and never stops: cloud drift, beam
//   flicker, star twinkle, the camera's slow breath, parallax damping.
//
//   NARRATIVE time — the beat sheet in timeline.js — is pinned at 0, which its
//   START_OFFSET places on the hero pose, and is not released until the app has
//   proved it can actually animate: six consecutive frames faster than 10 fps.
//
// The proof matters because the gallery's screenshot is not taken when it looks
// like it is. It fires 1200 ms after network idle, but under the software
// rasteriser the build uses, `page.screenshot()` itself blocks on a compositor
// frame for six to fifteen seconds; instrumenting the real capture found the
// app already 10–19 s into its life by the time the shutter came back, never
// the nominal 1.8 — and the first card built this way was a photograph of the
// app resting. A machine that cannot animate now never releases the story, so
// whenever the shutter falls, it falls on the hero pose. On real hardware the
// proof lands inside the first tenth of a second and the hold reads as a
// deliberate two-second opening chord.
//
// It must be a RATE test, not a frame count: eight frames accumulate even at
// 1 fps, and the card comes out mid-fade.
const HOLD_MIN = 2.2 // shortest opening hold, in seconds
const HOLD_MAX = 45 // ... and the longest, comfortably past any screenshot
let fastFrames = 0
let releasedAt = 0
let prevRaw = 0

function tick() {
  requestAnimationFrame(tick)
  const raw = clock.getElapsedTime()
  const dt = raw - prevRaw
  prevRaw = raw
  fastFrames = dt > 0 && dt < 0.1 ? fastFrames + 1 : 0
  if (!releasedAt && (forceRelease || (fastFrames >= 6 && raw >= HOLD_MIN) || raw >= HOLD_MAX)) releasedAt = raw

  const amb = raw * RATE
  ambNow = amb
  const t = releasedAt ? (raw - releasedAt) * RATE : 0

  // `blink` shuts the lids over any jump; `mute` pulls the corona, the beams
  // and the tentacles back behind the casting on the way in and lets them out
  // again on the way out, so nothing is ever seen appearing or vanishing.
  let blink = 0
  if (blinkAt >= 0) {
    const k = amb - blinkAt
    if (k >= BLINK_TOTAL) {
      blinkAt = -1
    } else {
      blink =
        k < BLINK_SHUT
          ? easeInOut(k / BLINK_SHUT)
          : 1 - easeInOut((k - BLINK_SHUT) / (BLINK_TOTAL - BLINK_SHUT))
      // Swap the beat sheet at the moment the lids meet.
      if (pendingPhase && k >= BLINK_SHUT) {
        timeline.jumpTo(pendingPhase, t)
        pendingPhase = null
      }
    }
  }
  const mute = 1 - blink

  const s = timeline.sample(t)
  const rad = s.rad * mute
  const petal = s.petal * mute
  const reach = s.reach * mute
  livePhase = reach > 0.05 || s.alien > 0.5 ? 'monster' : rad > 0.05 || petal > 0.05 ? 'sun' : 'idle'

  // Parallax — critically damped enough that a flicked mouse glides.
  const damp = reduceMotion ? 0.035 : 0.075
  smooth.x = lerp(smooth.x, aim.x, damp)
  smooth.y = lerp(smooth.y, aim.y, damp)

  const sway = reduceMotion ? 0.25 : 1
  camera.position.x = smooth.x * 1.15 * sway
  camera.position.y = EYE_Y * 0.55 - smooth.y * 0.75 * sway + Math.sin(amb * 0.21) * 0.05 * sway
  camera.lookAt(0, EYE_Y * 0.72, 0)

  // The artifact leans a touch against the camera move, which reads as depth
  // far more strongly than moving the camera alone.
  shrine.rotation.y = -smooth.x * 0.1 * sway
  shrine.rotation.x = smooth.y * 0.06 * sway
  shrine.position.y = EYE_Y + Math.sin(amb * 0.33) * 0.045 * sway
  cloud.mesh.position.x = smooth.x * 0.16 * sway

  // Lids. A blink closes both; a wink sends the upper lid the whole way while
  // the lower barely stirs, and tips the emblem with it. With only one eye on
  // screen that asymmetry is the entire cue.
  const upper = clamp(Math.max(s.lid, s.wink, blink), 0, 1)
  const lower = clamp(Math.max(s.lid, s.wink * 0.35, blink), 0, 1)
  const lid = Math.max(upper, lower)
  eye.lidUpper.rotation.x = -LID_OPEN_UPPER * (1 - upper)
  eye.lidLower.rotation.x = LID_OPEN_LOWER * (1 - lower)
  eye.eye.rotation.z = s.wink * 0.11
  eye.group.rotation.z = s.wink * 0.05

  // Gaze: a slow wander, plus the pointer, plus a pupil that tightens when the
  // light comes up and blows open when the alien is out.
  const wander = reduceMotion ? 0.35 : 1
  eye.gaze.rotation.y = smooth.x * 0.17 + Math.sin(amb * 0.47) * 0.05 * wander
  eye.gaze.rotation.x = smooth.y * 0.12 + Math.sin(amb * 0.31 + 1.7) * 0.035 * wander
  const dilate = lerp(1 - rad * 0.3, 1.25, s.alien)
  eye.pupil.scale.set(dilate * lerp(1, 0.3, s.alien), dilate, 1)

  // Colour crossfades.
  eye.irisMix.value = s.alien
  eye.materials.sclera.color.copy(SCLERA_HUMAN).lerp(SCLERA_ALIEN, s.alien)
  eye.materials.sclera.emissive.copy(SCLERA_EM_HUMAN).lerp(SCLERA_EM_ALIEN, s.alien)
  eye.materials.lid.color.copy(LID_HUMAN).lerp(LID_ALIEN, s.alien * 0.55)

  // The seam only lights up once the lids are nearly together — that blade of
  // light is the whole reason the eye stops just short of shut.
  const seam = rad * THREE.MathUtils.smoothstep(lid, 0.5, 0.95)
  eye.seam.uIntensity.value = seam * 1.5
  eye.seam.uColor.value.copy(SEAM_WARM).lerp(SEAM_COLD, s.alien)

  // The face plate warms through as the light behind it builds, so the metal
  // around the eye is part of the event rather than a bystander.
  scratchA.setRGB(0.2 * rad, 0.1 * rad, 0.025 * rad)
  scratchB.setRGB(0.02 * rad, 0.17 * rad, 0.12 * rad)
  eye.materials.plate.emissive.copy(scratchA.lerp(scratchB, s.alien))
  // The iris catches the light too — otherwise the one dark spot in the frame
  // during full radiance is the thing the frame is about.
  scratchA.setRGB(0.15 * rad, 0.09 * rad, 0.025 * rad)
  scratchB.setRGB(0.02 * rad, 0.15 * rad, 0.11 * rad)
  eye.materials.iris.emissive.copy(scratchA.lerp(scratchB, s.alien))

  backlight.intensity = rad * (reduceMotion ? 7 : 9)
  backlight.color.copy(BACKLIGHT_WARM).lerp(BACKLIGHT_COLD, s.alien)

  radiance.update(amb, { intensity: rad, petalAmount: petal, alien: s.alien })
  tentacles.update(amb, { reach, glow: 0.4 + 0.6 * rad })
  cloud.uniforms.uTime.value = amb
  cloud.uniforms.uGlow.value = rad * 0.8
  cloud.uniforms.uGlowColor.value.copy(BACKLIGHT_WARM).lerp(BACKLIGHT_COLD, s.alien)
  sky.update(amb, { glow: rad, alien: s.alien, pixelRatio: renderer.getPixelRatio() })

  renderer.render(scene, camera)
}

tick()
