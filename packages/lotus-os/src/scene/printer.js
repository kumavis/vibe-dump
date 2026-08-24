// printer.js — the small bench FDM printer and the chedi it prints.
//
// A bed-slinger: the bed carries the part front-to-back, the gantry walks up
// the two Z uprights, and the hotend rides left-right along the X beam. The
// print is one LatheGeometry revealed by a clipping plane whose constant only
// ever moves in whole layer steps. That discrete jump — matched by the gantry
// stepping the same amount at the same instant — is the entire reason the
// thing reads as printing rather than as an object fading in.

import * as THREE from 'three'
import {
  MAT,
  PALETTE,
  box,
  cyl,
  cable,
  glowSprite,
  contactDarken,
  decalTexture,
  ensureColors,
  tintGeometry,
} from './materials.js'

// --- the machine, in metres -------------------------------------------------

const FOOT_H = 0.010
const BASE_H = 0.048
const BASE_W = 0.34
const BASE_D = 0.26
const BASE_TOP = FOOT_H + BASE_H
const BASE_FRONT = BASE_D / 2

const EXT = 0.022 // aluminium extrusion cross-section
const UP_X = 0.129
const UP_Z = -0.110
const UP_TOP = 0.420
const CROSS_Y = UP_TOP + EXT / 2

const BED_TOP = 0.104
const BED_W = 0.150
const BED_D = 0.125

const BEAM_Z = -0.062 // X beam, measured from the nozzle axis at z = 0

// --- the print --------------------------------------------------------------

const PLINTH_H = 0.010
const PLINTH_HALF = 0.026
const PRINT_H = 0.090
const LAYERS = 46
const LAYER_H = PRINT_H / LAYERS
const SKIRT_R = 0.032
const SKIRT_SEG = 56
const SKIRT_RAD = 4
const SKIRT_STRIDE = SKIRT_RAD * 6

// Radius/height pairs for the spire, bottom to top: a drum on the plinth, a
// cornice, the bell, the harmika lip, five diminishing rings and the needle.
// Written as plain pairs because the nozzle path samples this array every
// frame and Vector2 lookups here would be nothing but ceremony.
const PROFILE = [
  [0.0000, 0.0100],
  [0.0240, 0.0100],
  [0.0240, 0.0170],
  [0.0215, 0.0190],
  [0.0210, 0.0240],
  [0.0235, 0.0270],
  [0.0230, 0.0300],
  [0.0200, 0.0330],
  [0.0203, 0.0370],
  [0.0195, 0.0420],
  [0.0175, 0.0480],
  [0.0148, 0.0530],
  [0.0118, 0.0580],
  [0.0100, 0.0610],
  [0.0122, 0.0625],
  [0.0120, 0.0655],
  [0.0092, 0.0668],
  [0.0100, 0.0690],
  [0.0072, 0.0703],
  [0.0080, 0.0722],
  [0.0056, 0.0734],
  [0.0063, 0.0751],
  [0.0042, 0.0762],
  [0.0048, 0.0777],
  [0.0030, 0.0787],
  [0.0035, 0.0800],
  [0.0021, 0.0809],
  [0.0014, 0.0835],
  [0.0008, 0.0870],
  [0.0000, 0.0900],
]

// --- the run ----------------------------------------------------------------

const T_WARM = 2.4
const T_SKIRT = 1.8
const T_BUILD = 19.6
const T_FINISH = 2.2
const T_RETRACT = 0.9
const LOOP_RATE = Math.PI * 2 * 1.9 // rad/s around the perimeter
const PARK_X = -0.062
const PARK_Y = BED_TOP + 0.055

const SCREEN_W = 256
const SCREEN_H = 128

const DESK = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
const lerp = THREE.MathUtils.lerp
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const smooth = (x) => x * x * x * (x * (x * 6 - 15) + 10)
const pad2 = (n) => (n < 10 ? `0${n}` : String(n))

/** Outer radius of the model at height h above the plinth's underside. */
const sampleRadius = (h) => {
  for (let i = 1; i < PROFILE.length; i++) {
    const a = PROFILE[i - 1]
    const b = PROFILE[i]
    if (h <= b[1]) {
      const span = b[1] - a[1]
      const k = span <= 0 ? 1 : (h - a[1]) / span
      return a[0] + (b[0] - a[0]) * k
    }
  }
  return 0.0008
}

/** The perimeter of a square, as a radius — the plinth layers trace this. */
const squareRadius = (half, a) => half / Math.max(Math.abs(Math.cos(a)), Math.abs(Math.sin(a)))

export function createPrinter({ sfx = null, quality = 1 } = {}) {
  const group = new THREE.Group()
  const seg = (n) => Math.max(6, Math.round(n * (quality < 1 ? 0.7 : 1)))

  const anodised = MAT.metal(0x24222a, 0.5)
  const slot = MAT.plastic(0x0e0c14, 0.72)
  const shell = MAT.paint(PALETTE.greyMetal, { rough: 0.55, metal: 0.35 })
  const steel = MAT.metal(PALETTE.aluminium, 0.4)
  const bright = MAT.metal(PALETTE.brightMetal, 0.32)
  const darkPlastic = MAT.plastic(0x1a1822, 0.6)
  const midPlastic = MAT.plastic(PALETTE.plastic, 0.62)
  const rubber = MAT.rubber(0x100e16)

  // Materials this module owns, because they carry the clipping plane or a
  // canvas that gets redrawn. Everything else comes off the shared bench.
  const clip = new THREE.Plane(new THREE.Vector3(0, -1, 0), -1000)
  const filament = new THREE.MeshStandardMaterial({
    color: 0x532b8e,
    roughness: 0.58,
    metalness: 0,
    vertexColors: true,
    side: THREE.DoubleSide,
    clippingPlanes: [clip],
    clipShadows: true,
  })
  const freshLayer = new THREE.MeshStandardMaterial({
    color: 0x6a3bb8,
    roughness: 0.44,
    metalness: 0,
    side: THREE.DoubleSide,
  })
  const skirtMat = new THREE.MeshStandardMaterial({ color: 0x46257a, roughness: 0.6, metalness: 0, vertexColors: true })

  // --- base and feet --------------------------------------------------------

  for (const fx of [-0.14, 0.14]) {
    for (const fz of [-0.11, 0.11]) {
      const foot = cyl(0.011, 0.013, FOOT_H, rubber, seg(10))
      foot.position.set(fx, FOOT_H / 2, fz)
      group.add(foot)
      contactDarken(foot, [DESK], { radius: 0.02, floor: 0.24 })
    }
  }

  const base = box(BASE_W, BASE_H, BASE_D, shell, { dirt: 0.22 })
  base.position.set(0, FOOT_H + BASE_H / 2, 0)
  group.add(base)
  contactDarken(base, [DESK], { radius: 0.045, floor: 0.34 })

  // A shallow lid so the base is not one slab, and the dust line lands on it.
  const lid = box(BASE_W - 0.012, 0.006, BASE_D - 0.012, MAT.paint(0x1b1824, { rough: 0.6, metal: 0.3 }), {
    dirt: 0.1,
    tint: 0xb6aec4,
  })
  lid.position.set(0, BASE_TOP + 0.002, 0)
  group.add(lid)

  for (let i = 0; i < 3; i++) {
    const slat = box(0.05, 0.003, 0.002, slot)
    slat.position.set(-0.06, 0.024 + i * 0.008, BASE_FRONT + 0.001)
    group.add(slat)
  }

  const plateMat = new THREE.MeshStandardMaterial({
    map: decalTexture(),
    transparent: true,
    roughness: 0.92,
    metalness: 0,
    vertexColors: true,
    side: THREE.DoubleSide,
  })
  const plate = new THREE.Mesh(tintGeometry(new THREE.PlaneGeometry(0.05, 0.03), 0x9a92a8), plateMat)
  plate.position.set(-0.135, 0.032, BASE_FRONT + 0.0012)
  plate.rotation.z = -0.05
  group.add(plate)

  // --- frame ----------------------------------------------------------------

  const upH = UP_TOP - BASE_TOP

  const tSlot = (w, h, d, x, y, z) => {
    const inset = box(w, h, d, slot, { dirt: 0.05 })
    inset.position.set(x, y, z)
    inset.castShadow = false
    group.add(inset)
    return inset
  }

  for (const sx of [-1, 1]) {
    const upright = box(EXT, upH, EXT, anodised, { dirt: 0.2 })
    upright.position.set(sx * UP_X, BASE_TOP + upH / 2, UP_Z)
    group.add(upright)
    // The channel, faked: one dark groove down the face you can see and one
    // down the outside. Four of them per extrusion would be honest and would
    // also be forty triangles nobody will ever resolve at this size.
    tSlot(0.007, upH - 0.004, 0.0016, sx * UP_X, BASE_TOP + upH / 2, UP_Z + EXT / 2)
    tSlot(0.0016, upH - 0.004, 0.007, sx * (UP_X + EXT / 2), BASE_TOP + upH / 2, UP_Z)

    const bracket = box(0.03, 0.03, 0.026, MAT.paint(0x201d29, { rough: 0.5, metal: 0.5 }), { dirt: 0.2 })
    bracket.position.set(sx * (UP_X - 0.002), BASE_TOP + 0.017, UP_Z + 0.004)
    group.add(bracket)
  }

  const crossbar = box(UP_X * 2 + EXT, EXT, EXT, anodised, { dirt: 0.24 })
  crossbar.position.set(0, CROSS_Y, UP_Z)
  group.add(crossbar)
  tSlot(UP_X * 2 - 0.01, 0.007, 0.0016, 0, CROSS_Y, UP_Z + EXT / 2)
  tSlot(UP_X * 2 - 0.01, 0.0016, 0.007, 0, CROSS_Y + EXT / 2, UP_Z)

  // Lead screws. They do not turn — at 4 mm across, nobody can tell.
  for (const sx of [-1, 1]) {
    const screw = cyl(0.0022, 0.0022, upH - 0.03, bright, seg(8))
    screw.position.set(sx * (UP_X - 0.019), BASE_TOP + upH / 2, UP_Z + 0.006)
    group.add(screw)
  }

  // --- Y axis: rails, carriage, heated bed ----------------------------------

  for (const rx of [-0.072, 0.072]) {
    const rail = cyl(0.005, 0.005, 0.21, bright, seg(10))
    rail.rotation.x = Math.PI / 2
    rail.position.set(rx, 0.070, 0)
    group.add(rail)
    const pillow = box(0.016, 0.016, 0.012, MAT.paint(0x201d29, { rough: 0.5, metal: 0.5 }))
    pillow.position.set(rx, 0.066, -0.098)
    group.add(pillow)
  }

  const bed = new THREE.Group()
  group.add(bed)

  const carriage = box(0.13, 0.014, 0.095, MAT.paint(0x1e1b26, { rough: 0.5, metal: 0.45 }), { dirt: 0.16 })
  carriage.position.set(0, 0.081, 0)
  bed.add(carriage)

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const spring = cyl(0.0034, 0.0034, 0.011, bright, seg(8))
      spring.position.set(sx * 0.05, 0.0935, sz * 0.038)
      bed.add(spring)
    }
  }

  const bedPlate = box(BED_W, 0.005, BED_D, MAT.metal(0x2b2830, 0.46), { dirt: 0.1, tint: 0xa89fb6 })
  bedPlate.position.set(0, 0.1015, 0)
  bed.add(bedPlate)

  const sheet = box(BED_W - 0.004, 0.0012, BED_D - 0.004, MAT.plastic(0x141220, 0.34), { dirt: 0.06, tint: 0x8f88a0 })
  sheet.position.set(0, BED_TOP - 0.0006, 0)
  bed.add(sheet)

  for (const sx of [-1, 1]) {
    const bedClip = box(0.014, 0.004, 0.008, bright)
    bedClip.position.set(sx * 0.042, BED_TOP + 0.001, BED_D / 2 - 0.003)
    bed.add(bedClip)
  }

  // --- the print, sitting on the bed ----------------------------------------

  const printOrigin = new THREE.Object3D()
  printOrigin.position.set(0, BED_TOP, 0)
  bed.add(printOrigin)

  const plinth = box(PLINTH_HALF * 2, PLINTH_H, PLINTH_HALF * 2, filament, { dirt: 0.08, tint: 0xf2ecff })
  plinth.position.set(0, BED_TOP + PLINTH_H / 2, 0)
  bed.add(plinth)

  const latheGeo = new THREE.LatheGeometry(
    PROFILE.map((p) => new THREE.Vector2(p[0], p[1])),
    seg(18),
  )
  tintGeometry(latheGeo, 0xf2ecff, 0.12)
  const spire = new THREE.Mesh(latheGeo, filament)
  spire.castShadow = true
  spire.receiveShadow = true
  spire.position.set(0, BED_TOP, 0)
  bed.add(spire)

  // The top face of whatever has been laid down so far. Without it the
  // clipping plane cuts an open shell and you can see straight through the
  // model, which no print has ever done.
  const capRound = new THREE.Mesh(ensureColors(new THREE.CircleGeometry(1, seg(18))), freshLayer)
  capRound.rotation.x = -Math.PI / 2
  capRound.scale.setScalar(0.02)
  capRound.visible = false
  bed.add(capRound)

  const capSquare = new THREE.Mesh(ensureColors(new THREE.PlaneGeometry(PLINTH_HALF * 2, PLINTH_HALF * 2)), freshLayer)
  capSquare.rotation.x = -Math.PI / 2
  capSquare.visible = false
  bed.add(capSquare)

  const skirtPts = []
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2
    skirtPts.push(new THREE.Vector3(Math.cos(a) * SKIRT_R, 0, Math.sin(a) * SKIRT_R))
  }
  const skirtGeo = ensureColors(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(skirtPts, true), SKIRT_SEG, 0.0008, SKIRT_RAD, true),
  )
  skirtGeo.setDrawRange(0, 0)
  const skirt = new THREE.Mesh(skirtGeo, skirtMat)
  skirt.position.set(0, BED_TOP + 0.0008, 0)
  bed.add(skirt)

  // --- X gantry and the hotend ----------------------------------------------

  const gantry = new THREE.Group()
  gantry.position.y = PARK_Y
  group.add(gantry)

  const beam = box(UP_X * 2 - 0.03, 0.02, 0.02, anodised, { dirt: 0.18 })
  beam.position.set(0, 0.035, BEAM_Z)
  gantry.add(beam)

  // The LED bar under the gantry that every one of these machines has. It is
  // also the only reason you can see the print happen: the printer stands in
  // the cool half of the room, well outside the desk lamp's three metres, and
  // an unlit object slowly appearing inside a dark frame reads as nothing at
  // all. No shadows — the room affords two casters and neither is here.
  const barGeo = ensureColors(new THREE.BoxGeometry(UP_X * 1.5, 0.004, 0.006))
  const barMat = MAT.emissive(0xfff0d8, 0.22).clone()
  const bar = new THREE.Mesh(barGeo, barMat)
  bar.position.set(0, 0.022, BEAM_Z + 0.014)
  gantry.add(bar)

  const barLight = new THREE.PointLight(0xffe9c8, 0, 0.62, 2)
  barLight.castShadow = false
  barLight.position.set(0, 0.014, BEAM_Z + 0.02)
  gantry.add(barLight)
  const BAR_W = 0.95
  const beamSlot = box(UP_X * 2 - 0.04, 0.006, 0.0016, slot)
  beamSlot.position.set(0, 0.035, BEAM_Z + 0.011)
  beamSlot.castShadow = false
  gantry.add(beamSlot)

  for (const sx of [-1, 1]) {
    const endBlock = box(0.028, 0.04, 0.062, MAT.paint(0x1e1b26, { rough: 0.48, metal: 0.5 }), { dirt: 0.2 })
    endBlock.position.set(sx * 0.11, 0.034, -0.086)
    gantry.add(endBlock)
    const nut = cyl(0.006, 0.006, 0.012, bright, seg(8))
    nut.position.set(sx * (UP_X - 0.019), 0.034, UP_Z + 0.006)
    gantry.add(nut)
  }

  // Belt: two thin runs along the beam. Straight is correct here — a belt
  // under tension is the one thing in this room allowed a right angle.
  const belt = box(UP_X * 2 - 0.036, 0.0022, 0.0012, rubber)
  belt.position.set(0, 0.026, BEAM_Z + 0.012)
  belt.castShadow = false
  gantry.add(belt)

  // Everything below is built around the nozzle tip at the carriage origin,
  // so parking the head is one assignment instead of an offset table.
  const head = new THREE.Group()
  head.position.x = PARK_X
  gantry.add(head)

  const carriagePlate = box(0.034, 0.05, 0.007, MAT.paint(0x201d29, { rough: 0.5, metal: 0.5 }), { dirt: 0.14 })
  carriagePlate.position.set(0, 0.034, -0.048)
  head.add(carriagePlate)

  const arm = box(0.026, 0.009, 0.046, MAT.paint(0x201d29, { rough: 0.5, metal: 0.5 }), { dirt: 0.14 })
  arm.position.set(0, 0.048, -0.026)
  head.add(arm)

  const heatsink = cyl(0.0055, 0.0055, 0.02, steel, seg(10))
  heatsink.position.set(0, 0.031, 0)
  head.add(heatsink)

  for (let i = 0; i < 3; i++) {
    const fin = cyl(0.0088, 0.0088, 0.0016, steel, seg(12))
    fin.position.set(0, 0.025 + i * 0.006, 0)
    fin.castShadow = false
    head.add(fin)
  }

  const cap = cyl(0.005, 0.005, 0.005, midPlastic, seg(8))
  cap.position.set(0, 0.0435, 0)
  head.add(cap)

  const heatBreak = cyl(0.003, 0.003, 0.006, bright, seg(8))
  heatBreak.position.set(0, 0.0195, 0)
  head.add(heatBreak)

  const heaterBlock = box(0.017, 0.011, 0.013, MAT.metal(0x5a5460, 0.55), { dirt: 0.12, tint: 0xc9b9a6 })
  heaterBlock.position.set(0, 0.0115, 0)
  head.add(heaterBlock)

  const nozzle = cyl(0.0042, 0.0012, 0.006, MAT.metal(0x8a7a5c, 0.38), seg(10))
  nozzle.position.set(0, 0.003, 0)
  head.add(nozzle)

  const shroudTop = box(0.009, 0.021, 0.015, darkPlastic, { dirt: 0.1 })
  shroudTop.position.set(-0.013, 0.021, -0.001)
  head.add(shroudTop)

  const shroudDuct = box(0.011, 0.007, 0.013, darkPlastic, { dirt: 0.1 })
  shroudDuct.position.set(-0.01, 0.0095, 0.0005)
  head.add(shroudDuct)

  const fanBody = cyl(0.0105, 0.0105, 0.007, darkPlastic, seg(12))
  fanBody.rotation.z = Math.PI / 2
  fanBody.position.set(-0.021, 0.03, -0.004)
  head.add(fanBody)

  const fanSpin = new THREE.Group()
  fanSpin.position.set(-0.0245, 0.03, -0.004)
  head.add(fanSpin)
  const hub = cyl(0.0026, 0.0026, 0.003, midPlastic, seg(8))
  hub.rotation.z = Math.PI / 2
  fanSpin.add(hub)
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2
    const blade = box(0.0016, 0.011, 0.005, midPlastic, { dirt: 0.06 })
    blade.position.set(0, Math.cos(a) * 0.0055, Math.sin(a) * 0.0055)
    blade.rotation.x = a
    blade.castShadow = false
    fanSpin.add(blade)
  }

  const nozzleGlow = glowSprite(PALETTE.sodium, 0.005, { core: 0.7, mid: 0.2, halo: 0.05 })
  nozzleGlow.position.set(0, 0.002, 0)
  nozzleGlow.userData.setIntensity(0)
  head.add(nozzleGlow)

  // --- spool, extruder, filament path ---------------------------------------

  const SPOOL = new THREE.Vector3(-0.148, 0.3, -0.03)

  const spoolArm = box(0.014, 0.03, 0.075, MAT.paint(0x201d29, { rough: 0.5, metal: 0.5 }), { dirt: 0.18 })
  spoolArm.position.set(-0.14, SPOOL.y, -0.062)
  group.add(spoolArm)

  const spoolRod = cyl(0.007, 0.007, 0.062, steel, seg(10))
  spoolRod.rotation.x = Math.PI / 2
  spoolRod.position.copy(SPOOL)
  group.add(spoolRod)

  const spool = new THREE.Group()
  spool.position.copy(SPOOL)
  spool.rotation.x = Math.PI / 2
  group.add(spool)

  const spoolCore = cyl(0.018, 0.018, 0.046, MAT.plastic(0x2a2733, 0.66), seg(14))
  spool.add(spoolCore)
  const winding = cyl(0.046, 0.046, 0.042, MAT.plastic(0x4a2688, 0.72), seg(20))
  spool.add(winding)
  for (const sz of [-1, 1]) {
    const cheek = cyl(0.05, 0.05, 0.0025, MAT.plastic(0x2a2733, 0.62), seg(20))
    cheek.position.y = sz * 0.0223
    spool.add(cheek)
  }

  const extruder = box(0.048, 0.058, 0.046, MAT.paint(0x22202b, { rough: 0.52, metal: 0.4 }), { dirt: 0.2 })
  extruder.position.set(-0.05, 0.392, -0.098)
  group.add(extruder)

  const extruderGear = cyl(0.01, 0.01, 0.008, bright, seg(12))
  extruderGear.rotation.x = Math.PI / 2
  extruderGear.position.set(-0.028, 0.392, -0.072)
  group.add(extruderGear)

  const stepper = cyl(0.019, 0.019, 0.03, MAT.metal(0x1f1d26, 0.55), seg(12))
  stepper.rotation.x = Math.PI / 2
  stepper.position.set(-0.05, 0.392, -0.134)
  group.add(stepper)

  const strand = cable(
    [
      [SPOOL.x, SPOOL.y + 0.048, SPOOL.z],
      [-0.14, 0.372, -0.042],
      [-0.116, 0.386, -0.062],
      [-0.082, 0.398, -0.076],
      [-0.052, 0.418, -0.078],
    ],
    { radius: 0.0013, segments: 22, material: MAT.plastic(0x5a2ea0, 0.6) },
  )
  group.add(strand)

  // The PTFE tube is the one piece of geometry that has to follow a moving
  // part, so it gets rebuilt — but at 12 Hz, not 60. A bowden tube sweeping as
  // the head crosses the bed is worth one small allocation a frame in five.
  const ptfeMat = MAT.plastic(0x4a4652, 0.44)
  let ptfe = null

  const rebuildPtfe = () => {
    const topY = gantry.position.y + 0.05
    const midY = (0.362 + topY) / 2
    const cx = head.position.x
    const pts = [
      new THREE.Vector3(-0.05, 0.362, -0.086),
      new THREE.Vector3(-0.072, 0.362 - (0.362 - topY) * 0.3, -0.052),
      new THREE.Vector3(-0.088, midY, -0.014),
      new THREE.Vector3(cx * 0.5 - 0.03, topY + (midY - topY) * 0.4, -0.006),
      new THREE.Vector3(cx, topY, -0.012),
    ]
    const geo = ensureColors(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 18, 0.0032, 5, false))
    if (ptfe) {
      ptfe.geometry.dispose()
      ptfe.geometry = geo
    } else {
      ptfe = new THREE.Mesh(geo, ptfeMat)
      ptfe.castShadow = true
      group.add(ptfe)
    }
  }
  rebuildPtfe()

  // --- control panel --------------------------------------------------------

  const panel = new THREE.Group()
  panel.position.set(0.098, 0.046, BASE_FRONT + 0.006)
  panel.rotation.x = -0.3
  group.add(panel)

  const panelShell = box(0.084, 0.052, 0.018, MAT.paint(0x1c1926, { rough: 0.55, metal: 0.3 }), { dirt: 0.16 })
  panel.add(panelShell)

  const screenCanvas = document.createElement('canvas')
  screenCanvas.width = SCREEN_W
  screenCanvas.height = SCREEN_H
  // A browser that hands back a null 2d context is rare but not mythical, and
  // a printer with a dead display is a perfectly fine printer.
  let sctx = null
  try {
    sctx = screenCanvas.getContext('2d')
  } catch (err) {
    sctx = null
  }
  const screenTex = new THREE.CanvasTexture(screenCanvas)
  screenTex.colorSpace = THREE.SRGBColorSpace
  const screenMat = new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: true, fog: false })
  const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.064, 0.032), screenMat)
  screenMesh.position.z = 0.0096
  panel.add(screenMesh)

  const screenGlow = glowSprite(PALETTE.periwinkle, 0.012, { core: 0.2, mid: 0.07, halo: 0.025, streak: 0.075 })
  screenGlow.position.set(0, 0, 0.012)
  panel.add(screenGlow)

  const knob = cyl(0.009, 0.009, 0.012, midPlastic, seg(12))
  knob.rotation.x = Math.PI / 2
  knob.position.set(0.152, 0.044, BASE_FRONT + 0.005)
  group.add(knob)
  const knobRidge = cyl(0.0035, 0.0035, 0.0135, darkPlastic, seg(8))
  knobRidge.rotation.x = Math.PI / 2
  knobRidge.position.copy(knob.position)
  group.add(knobRidge)

  const led = (x, color, intensity) => {
    const dot = new THREE.Mesh(new THREE.CircleGeometry(0.0018, 8), MAT.emissive(color, intensity))
    dot.position.set(x, 0.042, BASE_FRONT + 0.0015)
    group.add(dot)
    const halo = glowSprite(color, 0.0045, { core: 0.45, mid: 0.13, halo: 0.035 })
    halo.position.copy(dot.position)
    group.add(halo)
    return { dot, halo }
  }

  const powerLed = led(-0.02, PALETTE.violet, 1.5)
  const heatLed = led(-0.005, PALETTE.amber, 1.8)
  heatLed.halo.userData.setIntensity(0)
  heatLed.dot.visible = false

  // The third one has never lit in the four years this machine has been on the
  // bench. Nobody knows what it is for.
  const deadLed = new THREE.Mesh(ensureColors(new THREE.CircleGeometry(0.0018, 8)), MAT.plastic(0x2a2733, 0.4))
  deadLed.position.set(0.01, 0.042, BASE_FRONT + 0.0015)
  group.add(deadLed)

  // --- hit box --------------------------------------------------------------

  const hitMat = new THREE.MeshBasicMaterial({ visible: false })
  const hit = new THREE.Mesh(new THREE.BoxGeometry(0.376, 0.452, 0.31), hitMat)
  hit.position.set(-0.014, 0.226, 0.002)
  group.add(hit)

  // --- state ----------------------------------------------------------------

  let state = 'idle'
  let phase = 'idle'
  let outcome = 'none'
  let clock = 0
  let layer = 0
  let angle = 0
  let progress = 0
  let heat = 0
  let nozTemp = 24
  let bedTemp = 24
  let baseY = 0
  let screenAcc = 0
  let tubeAcc = 0
  let lastCos = 1
  let servoAt = -10
  let now = 0
  const from = new THREE.Vector3(PARK_X, PARK_Y, 0)
  let retractFrom = 0

  const tipY = (n) => BED_TOP + (n + 1) * LAYER_H

  const setAxes = (x, y, z) => {
    head.position.x = x
    gantry.position.y = y
    bed.position.z = z
  }

  const setStatus = () => {
    if (state === 'retract') return 'CLEARING'
    if (state === 'print') {
      if (phase === 'warm') return 'HEATING'
      if (phase === 'finish') return 'FINISHING'
      return 'PRINTING'
    }
    if (outcome === 'done') return 'DONE'
    if (outcome === 'stopped') return 'STOPPED'
    return 'READY'
  }

  const drawScreen = () => {
    if (!sctx) return
    const status = setStatus()
    sctx.fillStyle = '#160e24'
    sctx.fillRect(0, 0, SCREEN_W, SCREEN_H)

    sctx.font = '600 13px ui-monospace, SFMono-Regular, Menlo, monospace'
    sctx.fillStyle = '#c79bff'
    sctx.fillText('LOTUS-3D', 10, 20)
    const file = 'chedi.gcode'
    sctx.fillStyle = '#7a5cff'
    sctx.fillText(file, SCREEN_W - 10 - sctx.measureText(file).width, 20)

    sctx.font = '600 22px ui-monospace, SFMono-Regular, Menlo, monospace'
    sctx.fillStyle = status === 'STOPPED' ? '#ff2e88' : status === 'DONE' ? '#ff6fe0' : '#c79bff'
    sctx.fillText(status, 10, 50)

    sctx.strokeStyle = '#4a3a6e'
    sctx.lineWidth = 2
    sctx.strokeRect(10, 62, SCREEN_W - 20, 14)
    sctx.fillStyle = '#ff6fe0'
    sctx.fillRect(12, 64, (SCREEN_W - 24) * clamp01(progress), 10)

    sctx.font = '600 13px ui-monospace, SFMono-Regular, Menlo, monospace'
    sctx.fillStyle = '#c79bff'
    sctx.fillText(`LAYER ${pad2(Math.min(layer + 1, LAYERS))}/${LAYERS}`, 10, 96)
    sctx.fillText(`NOZ ${Math.round(nozTemp)}C   BED ${Math.round(bedTemp)}C`, 10, 116)

    sctx.fillStyle = '#38e8ff'
    sctx.fillRect(SCREEN_W - 18, 88, 8, 12)

    // Scanlines, baked here rather than in a shader, same as every other
    // screen in this room.
    sctx.fillStyle = 'rgba(0,0,0,0.24)'
    for (let y = 0; y < SCREEN_H; y += 3) sctx.fillRect(0, y, SCREEN_W, 1)

    screenTex.needsUpdate = true
  }

  const servo = () => {
    if (now - servoAt < 0.55) return
    servoAt = now
    sfx?.play('servo')
  }

  const clearPrint = () => {
    clip.constant = baseY - 0.002
    skirtGeo.setDrawRange(0, 0)
    capRound.visible = false
    capSquare.visible = false
  }

  const beginPrint = () => {
    printOrigin.updateWorldMatrix(true, false)
    baseY = printOrigin.matrixWorld.elements[13]
    clearPrint()
    state = 'print'
    phase = 'warm'
    outcome = 'none'
    clock = 0
    layer = 0
    angle = 0
    progress = 0
    from.set(head.position.x, gantry.position.y, bed.position.z)
    sfx?.startLoop('printer', { freq: 58, gain: 0.02, filter: 480 })
    servo()
    drawScreen()
  }

  const beginRetract = () => {
    state = 'retract'
    phase = 'idle'
    outcome = 'stopped'
    clock = 0
    retractFrom = clip.constant
    from.set(head.position.x, gantry.position.y, bed.position.z)
    sfx?.play('warn')
    drawScreen()
  }

  const start = () => {
    if (state === 'idle') beginPrint()
    else if (state === 'print') beginRetract()
  }

  const coolDown = (dt) => {
    heat += (0 - heat) * Math.min(1, dt * 2.2)
    nozTemp += (24 - nozTemp) * Math.min(1, dt * 0.55)
    bedTemp += (24 - bedTemp) * Math.min(1, dt * 0.4)
  }

  const update = (dt, t) => {
    now = t
    if (state === 'idle') {
      coolDown(dt)
      setAxes(PARK_X, PARK_Y, 0)
    } else if (state === 'retract') {
      clock += dt
      const k = clamp01(clock / T_RETRACT)
      const e = smooth(k)
      // The part sinks back through the bed rather than blinking out. Nothing
      // a real printer does, but it reads as deliberate instead of as a bug.
      clip.constant = lerp(retractFrom, baseY - 0.002, e)
      skirtGeo.setDrawRange(0, Math.floor((1 - k) * SKIRT_SEG) * SKIRT_STRIDE)
      capRound.visible = false
      capSquare.visible = false
      setAxes(lerp(from.x, PARK_X, e), lerp(from.y, PARK_Y, e), lerp(from.z, 0, e))
      coolDown(dt)
      if (k >= 1) {
        state = 'idle'
        clearPrint()
        layer = 0
        progress = 0
        sfx?.stopLoop('printer')
        sfx?.play('latch')
        drawScreen()
      }
    } else {
      clock += dt
      const tSkirtEnd = T_WARM + T_SKIRT
      const tBuildEnd = tSkirtEnd + T_BUILD
      const wasPhase = phase
      phase = clock < T_WARM ? 'warm' : clock < tSkirtEnd ? 'skirt' : clock < tBuildEnd ? 'build' : 'finish'
      if (phase !== wasPhase) {
        from.set(head.position.x, gantry.position.y, bed.position.z)
        if (phase !== 'finish') servo()
      }

      if (phase === 'warm') {
        const k = clock / T_WARM
        nozTemp = lerp(24, 214, Math.min(1, k * 1.3))
        bedTemp = lerp(24, 60, Math.min(1, k * 1.7))
        heat = Math.min(1, k * 1.25)
        const e = smooth(k)
        setAxes(lerp(from.x, SKIRT_R, e), lerp(from.y, tipY(0), e), lerp(from.z, 0, e))
        capRound.visible = false
        capSquare.visible = false
        progress = 0
      } else if (phase === 'skirt') {
        const k = (clock - T_WARM) / T_SKIRT
        angle = k * Math.PI * 2
        skirtGeo.setDrawRange(0, Math.floor(k * SKIRT_SEG) * SKIRT_STRIDE)
        setAxes(Math.cos(angle) * SKIRT_R, tipY(0), -Math.sin(angle) * SKIRT_R)
        heat = 1
        nozTemp = 214 + Math.sin(clock * 3.1) * 1.2
        progress = 0
      } else if (phase === 'build') {
        skirtGeo.setDrawRange(0, SKIRT_SEG * SKIRT_STRIDE)
        const k = (clock - tSkirtEnd) / T_BUILD
        progress = clamp01(k)
        const next = Math.min(LAYERS - 1, Math.floor(k * LAYERS))
        if (next !== layer) {
          layer = next
          // The one line that sells the whole prop: the reveal advances in
          // whole layers, in lockstep with the gantry.
          clip.constant = baseY + (layer + 1) * LAYER_H
        }
        angle += dt * LOOP_RATE
        // One number drives the nozzle, the top face and the clipping plane, so
        // the head can never be tracing a radius the model does not have yet.
        const h = (layer + 1) * LAYER_H
        const model = h <= PLINTH_H ? squareRadius(PLINTH_HALF, angle) : sampleRadius(h)
        // Every third layer runs a tighter loop — the crude read of an infill
        // pass, without simulating one.
        const r = Math.max(0.0018, layer % 3 === 2 ? model * 0.6 : model)
        setAxes(Math.cos(angle) * r, tipY(layer), -Math.sin(angle) * r)
        heat = 1
        nozTemp = 214 + Math.sin(clock * 3.1) * 1.4
        bedTemp = 60 + Math.sin(clock * 0.8) * 0.6

        if (h <= PLINTH_H) {
          capSquare.visible = true
          capRound.visible = false
          capSquare.position.y = BED_TOP + h - 0.0004
        } else {
          capRound.visible = true
          capSquare.visible = false
          capRound.scale.setScalar(Math.max(0.0008, sampleRadius(h)))
          capRound.position.y = BED_TOP + h - 0.0004
        }

        const c = Math.cos(angle)
        if (c * lastCos < 0) servo()
        lastCos = c
      } else {
        const k = clamp01((clock - tBuildEnd) / T_FINISH)
        const e = smooth(Math.min(1, k * 1.25))
        layer = LAYERS - 1
        progress = 1
        clip.constant = baseY + PRINT_H + 0.004
        capRound.visible = false
        capSquare.visible = false
        setAxes(lerp(from.x, PARK_X, e), lerp(from.y, PARK_Y, e), lerp(from.z, 0, e))
        heat = 1 - e
        nozTemp = lerp(214, 120, e)
        bedTemp = lerp(60, 44, e)
        if (clock >= T_WARM + T_SKIRT + T_BUILD + T_FINISH) {
          state = 'idle'
          phase = 'idle'
          outcome = 'done'
          sfx?.stopLoop('printer')
          sfx?.play('latch')
          drawScreen()
        }
      }

      spool.rotation.y -= dt * 0.55 * heat
      fanSpin.rotation.x += dt * 34 * heat
    }

    const barLevel = 0.1 + heat * 0.9
    barLight.intensity = BAR_W * barLevel
    barMat.color.setHex(0xfff0d8).multiplyScalar(0.22 * (0.5 + barLevel * 0.5))

    nozzleGlow.userData.setIntensity(heat * (0.7 + 0.3 * Math.sin(t * 11)))
    const hot = heat > 0.02
    heatLed.dot.visible = hot && (phase !== 'warm' || Math.sin(t * 9) > 0)
    heatLed.halo.userData.setIntensity(heatLed.dot.visible ? 1 : 0)
    powerLed.halo.userData.setIntensity(0.85 + 0.15 * Math.sin(t * 1.7))

    tubeAcc += dt
    if (tubeAcc > 1 / 12) {
      tubeAcc = 0
      if (state !== 'idle') rebuildPtfe()
    }

    screenAcc += dt
    if (screenAcc > 1 / 7) {
      screenAcc = 0
      if (state !== 'idle') drawScreen()
    }
  }

  setAxes(PARK_X, PARK_Y, 0)
  drawScreen()

  return {
    group,
    update,
    start,
    get isPrinting() {
      return state === 'print'
    },
    interactives: [
      {
        object: hit,
        label: 'Printer',
        hint: () =>
          state === 'print' ? 'Printing — click to cancel' : state === 'retract' ? 'Clearing the bed' : 'Start a print',
        onClick: start,
      },
    ],
    dispose() {
      sfx?.stopLoop('printer')
      barMat.dispose()
      barGeo.dispose()
      filament.dispose()
      freshLayer.dispose()
      skirtMat.dispose()
      plateMat.dispose()
      screenMat.dispose()
      screenTex.dispose()
      hitMat.dispose()
      latheGeo.dispose()
      skirtGeo.dispose()
      ptfe?.geometry.dispose()
    },
  }
}
