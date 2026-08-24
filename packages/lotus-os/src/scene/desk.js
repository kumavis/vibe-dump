// desk.js — the bench, its lamp, and everything loose on top of it.
//
// Furniture, so it is modelled in world coordinates instead of around a local
// origin: the top surface has to land at exactly y = 0.75 across x -1.25..1.25
// and z -1.45..-0.68, because every other prop in the room is positioned
// against those numbers. The lamp is built here but its light is not — the
// room affords two shadow casters, so the assembler takes lampTarget and aims
// one of them from the shade.

import * as THREE from 'three'
import {
  MAT,
  PALETTE,
  box,
  cyl,
  cable,
  glowSprite,
  contactDarken,
  edgeDirt,
  tintGeometry,
  ensureColors,
  jitter,
} from './materials.js'

const TOP_Y = 0.75
const THICK = 0.038
const UNDER = TOP_Y - THICK
const X0 = -1.25
const X1 = 1.25
const Z_BACK = -1.45
const Z_FRONT = -0.68
const W = X1 - X0
const D = Z_FRONT - Z_BACK
const CX = (X0 + X1) / 2
const CZ = (Z_BACK + Z_FRONT) / 2

// Legs, inset from the corners so the top overhangs and throws a line of
// shadow down the frame instead of ending flush with it.
const LEG = 0.048
const LEG_INSET = 0.085
const LEG_X = X1 - LEG_INSET
const LEG_ZB = Z_BACK + LEG_INSET
const LEG_ZF = Z_FRONT - LEG_INSET

// Lamp joints, world space. The mouth of the shade is the one that matters —
// everything else is drawn to meet it.
const LAMP_FOOT = new THREE.Vector3(-1.14, TOP_Y, -1.36)
const LAMP_PIVOT = new THREE.Vector3(-1.14, 0.802, -1.36)
const LAMP_ELBOW = new THREE.Vector3(-1.132, 1.235, -1.345)
const SHADE_MOUTH = new THREE.Vector3(-0.915, 1.135, -1.258)
const SHADE_AIM = new THREE.Vector3(-0.84, TOP_Y, -0.94)
const SHADE_LEN = 0.094

// The chair is a foreground occluder rather than furniture. If it swallows too
// much of the hero frame, this is the knob to turn.
const CHAIR = new THREE.Vector3(0.1, 0, 0.56)

const UP = new THREE.Vector3(0, 1, 0)
const FLOOR_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
const DESK_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), -TOP_Y)

const WOBBLE = 1.1

export function createDesk({ sfx = null, quality = 1 } = {}) {
  const group = new THREE.Group()
  const detail = (n) => Math.max(5, Math.round(n * (quality < 1 ? 0.7 : 1)))

  const wood = MAT.wood(PALETTE.plywood)
  const frame = MAT.paint(PALETTE.wallDark, { rough: 0.54, metal: 0.4 })
  const steel = MAT.metal(PALETTE.aluminium, 0.44)
  const darkPlastic = MAT.plastic(0x232029, 0.52)

  // A cylinder laid between two points. Every arm on the lamp is one of these.
  const strut = (a, b, radius, material, segments = 10) => {
    const dir = new THREE.Vector3().subVectors(b, a)
    const len = dir.length()
    const mesh = cyl(radius, radius, len, material, segments)
    mesh.quaternion.setFromUnitVectors(UP, dir.normalize())
    mesh.position.copy(a).addScaledVector(dir, len / 2)
    return mesh
  }

  const knuckle = (at, radius) => {
    const mesh = new THREE.Mesh(ensureColors(new THREE.SphereGeometry(radius, 8, 5)), steel)
    mesh.castShadow = true
    mesh.position.copy(at)
    return mesh
  }

  // --- the desk itself ------------------------------------------------------

  const topGeo = edgeDirt(tintGeometry(new THREE.BoxGeometry(W, THICK, D), 0x8a8296, 0.2), 0.1)
  const top = new THREE.Mesh(topGeo, wood)
  top.castShadow = true
  top.receiveShadow = true
  top.position.set(CX, TOP_Y - THICK / 2, CZ)
  group.add(top)
  // Against a plane at the underside rather than at the surface: the top face
  // is then outside the radius and keeps its value, so only the belly of the
  // slab goes dark and the front edge gets a gradient instead of a hard line.
  contactDarken(top, [new THREE.Plane(new THREE.Vector3(0, 1, 0), -UNDER)], { radius: 0.022, floor: 0.3 })

  // The front edge takes every knock in the room, so it is the one painted
  // surface wearing the chipped map.
  const lip = box(W, 0.026, 0.018, MAT.paint(PALETTE.greyMetal, { rough: 0.5, metal: 0.4, chipped: true, substrate: PALETTE.aluminium }), {
    dirt: 0.1,
    tint: 0x8e8896,
  })
  lip.position.set(CX, UNDER - 0.009, Z_FRONT - 0.007)
  group.add(lip)

  for (const lx of [X0 + LEG_INSET, LEG_X]) {
    for (const lz of [LEG_ZB, LEG_ZF]) {
      const leg = box(LEG, UNDER, LEG, frame, { dirt: 0.24 })
      leg.position.set(lx, UNDER / 2, lz)
      group.add(leg)
      contactDarken(leg, [FLOOR_PLANE], { radius: 0.18, floor: 0.28 })
    }
  }

  for (const lx of [X0 + LEG_INSET, LEG_X]) {
    const apron = box(0.026, 0.055, LEG_ZF - LEG_ZB, frame, { dirt: 0.2 })
    apron.position.set(lx, UNDER - 0.04, (LEG_ZB + LEG_ZF) / 2)
    group.add(apron)
  }

  const stretcher = box(2 * LEG_X - LEG, 0.045, 0.026, frame, { dirt: 0.2 })
  stretcher.position.set(CX, 0.2, LEG_ZB)
  group.add(stretcher)

  // --- the lamp -------------------------------------------------------------

  const lamp = new THREE.Group()
  group.add(lamp)

  const lampPaint = MAT.paint(0x241f2c, { rough: 0.46, metal: 0.5 })

  const base = cyl(0.076, 0.09, 0.03, lampPaint, detail(16))
  base.position.copy(LAMP_FOOT).setY(TOP_Y + 0.015)
  lamp.add(base)
  contactDarken(base, [DESK_PLANE], { radius: 0.03, floor: 0.4 })

  const collar = cyl(0.026, 0.036, 0.026, lampPaint, detail(12))
  collar.position.copy(LAMP_FOOT).setY(TOP_Y + 0.042)
  lamp.add(collar)

  // The switch. Nobody will see it and it costs twenty-four triangles.
  const switchKnob = cyl(0.007, 0.007, 0.012, steel, 8)
  switchKnob.rotation.z = Math.PI / 2
  switchKnob.position.set(LAMP_FOOT.x + 0.078, TOP_Y + 0.016, LAMP_FOOT.z + 0.012)
  lamp.add(switchKnob)

  lamp.add(strut(LAMP_PIVOT, LAMP_ELBOW, 0.011, lampPaint, detail(10)))
  lamp.add(knuckle(LAMP_PIVOT, 0.017))

  const aimDir = new THREE.Vector3().subVectors(SHADE_AIM, SHADE_MOUTH).normalize()
  const shadeApex = SHADE_MOUTH.clone().addScaledVector(aimDir, -SHADE_LEN)
  lamp.add(strut(LAMP_ELBOW, shadeApex, 0.009, lampPaint, detail(10)))
  lamp.add(knuckle(LAMP_ELBOW, 0.015))

  const shade = new THREE.Group()
  shade.position.copy(SHADE_MOUTH)
  // Local -Y runs down the beam, so the lathe can be built the ordinary way up
  // with its mouth at the origin.
  shade.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), aimDir)
  lamp.add(shade)

  const profile = [
    new THREE.Vector2(0.082, 0),
    new THREE.Vector2(0.078, 0.014),
    new THREE.Vector2(0.05, 0.054),
    new THREE.Vector2(0.026, 0.082),
    new THREE.Vector2(0.014, SHADE_LEN),
  ]
  const shadeGeo = ensureColors(new THREE.LatheGeometry(profile, detail(12)))
  // Warm the vertices near the mouth: light spilling out of a shade wraps the
  // rim, and the gradient is what stops the cone reading as a flat cutout.
  const shadeCol = shadeGeo.attributes.color
  const shadePos = shadeGeo.attributes.position
  for (let i = 0; i < shadeCol.count; i++) {
    const k = 1 - Math.min(1, shadePos.getY(i) / SHADE_LEN)
    shadeCol.setXYZ(i, 0.7 + k * 0.9, 0.66 + k * 0.62, 0.72 + k * 0.28)
  }
  shadeCol.needsUpdate = true
  // The bulb sits inside this cone, so it must not cast — the spotlight the
  // assembler puts at the filament would shadow itself into a dark ring.
  const shadeMat = MAT.paint(0x2b2634, { rough: 0.5, metal: 0.45 }).clone()
  shadeMat.side = THREE.DoubleSide
  // The outside of a shade in a dark room is black, which is true and useless:
  // the lamp then reads as a floating ellipse with no object under it.
  shadeMat.emissive = new THREE.Color(0x35210f)
  shadeMat.emissiveIntensity = 1
  const shadeMesh = new THREE.Mesh(shadeGeo, shadeMat)
  shadeMesh.castShadow = false
  shadeMesh.receiveShadow = true
  shade.add(shadeMesh)

  // A dull disc across the mouth so the interior reads as lit from anywhere
  // below the lamp, which is where the camera spends the whole reveal.
  const wash = new THREE.Mesh(new THREE.CircleGeometry(0.072, detail(12)), MAT.emissive(PALETTE.amber, 0.24))
  wash.rotation.x = Math.PI / 2
  wash.position.y = 0.008
  shade.add(wash)

  const bulbMesh = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 6), MAT.emissive(PALETTE.amber, 1.5))
  bulbMesh.position.y = 0.042
  shade.add(bulbMesh)

  const bulbGlow = glowSprite(PALETTE.amber, 0.03, { core: 0.82, mid: 0.32, halo: 0.13 })
  bulbGlow.position.copy(bulbMesh.position)
  shade.add(bulbGlow)

  const bulbWorld = SHADE_MOUTH.clone().addScaledVector(aimDir, -0.042)

  // --- keyboard -------------------------------------------------------------

  const KB = { w: 0.36, d: 0.13, h: 0.018, cols: 15, rows: 6, margin: 0.012 }
  const TILT = 0.06

  const keyboard = new THREE.Group()
  keyboard.rotation.x = TILT
  // Tilting about the group origin buries the front edge, so lift by exactly
  // what the rotation took away.
  keyboard.position.set(-0.3, TOP_Y + (KB.d / 2) * Math.sin(TILT), -0.83)
  keyboard.rotation.y = -0.035
  group.add(keyboard)

  const kbBody = box(KB.w, KB.h, KB.d, MAT.plastic(0x1a1822, 0.6), { dirt: 0.16 })
  kbBody.position.y = KB.h / 2
  keyboard.add(kbBody)
  contactDarken(kbBody, [DESK_PLANE], { radius: 0.02, floor: 0.42 })

  const pitchX = (KB.w - KB.margin * 2) / KB.cols
  const pitchZ = (KB.d - KB.margin * 2) / KB.rows
  const gap = 0.004
  const capW = pitchX - gap
  const capD = pitchZ - gap
  const fieldX = -KB.w / 2 + KB.margin
  const fieldZ = -KB.d / 2 + KB.margin

  const slots = []
  for (let r = 0; r < KB.rows - 1; r++) {
    for (let c = 0; c < KB.cols; c++) {
      slots.push({ x: fieldX + pitchX * (c + 0.5), z: fieldZ + pitchZ * (r + 0.5), units: 1 })
    }
  }
  // The bottom row is modifiers and a space bar, which is the row that tells
  // you at a glance that the grid is a keyboard and not a waffle iron.
  let u = 0.25
  for (const units of [1.5, 1.25, 1.25, 6.5, 1.25, 1.25, 1.5]) {
    slots.push({ x: fieldX + pitchX * (u + units / 2), z: fieldZ + pitchZ * (KB.rows - 0.5), units })
    u += units
  }

  const capGeo = edgeDirt(new THREE.BoxGeometry(capW, 0.009, capD), 0.22)
  const caps = new THREE.InstancedMesh(capGeo, MAT.plastic(0x2c2936, 0.66), slots.length)
  caps.castShadow = true
  caps.receiveShadow = true
  {
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const p = new THREE.Vector3()
    const s = new THREE.Vector3()
    const c = new THREE.Color()
    slots.forEach((slot, i) => {
      const sy = 0.82 + Math.random() * 0.38
      p.set(slot.x, KB.h + (0.009 * sy) / 2, slot.z)
      s.set((slot.units * pitchX - gap) / capW, sy, 1)
      m.compose(p, q, s)
      caps.setMatrixAt(i, m)
      // A field of identical caps is the single thing that makes a keyboard
      // read as a render. Some are polished by thumbs, some are filthy.
      const k = 0.76 + Math.random() * 0.36
      c.setRGB(k, k * 0.97, k * 1.05)
      caps.setColorAt(i, c)
    })
    caps.instanceMatrix.needsUpdate = true
    caps.instanceColor.needsUpdate = true
  }
  keyboard.add(caps)

  // --- mouse ----------------------------------------------------------------

  const mouseGeo = new THREE.SphereGeometry(0.5, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2)
  mouseGeo.scale(0.062, 0.068, 0.108)
  tintGeometry(mouseGeo, 0x9c96a8, 0.05)
  const mouse = new THREE.Mesh(mouseGeo, darkPlastic)
  mouse.castShadow = true
  mouse.receiveShadow = true
  mouse.position.set(0.03, TOP_Y, -0.8)
  mouse.rotation.y = -0.14
  group.add(mouse)

  const wheel = cyl(0.006, 0.006, 0.005, MAT.rubber(0x0d0b12), 8)
  wheel.rotation.z = Math.PI / 2
  wheel.position.set(0.031, TOP_Y + 0.03, -0.832)
  group.add(wheel)

  group.add(
    cable(
      [
        [0.031, TOP_Y + 0.012, -0.852],
        [0.005, TOP_Y + 0.007, -0.9],
        [-0.062, TOP_Y + 0.005, -0.965],
        [-0.145, TOP_Y + 0.004, -1.055],
        [-0.223, TOP_Y + 0.005, -1.16],
        [-0.272, TOP_Y + 0.003, -1.27],
      ],
      { radius: 0.0035, color: 0x15121c, segments: detail(20) },
    ),
  )

  // --- papers, mug, ring stain ---------------------------------------------

  const paperMat = MAT.plaster(PALETTE.silk)
  const sheets = [
    { w: 0.2, d: 0.272, y: 0.7508, rot: 0.06 },
    { w: 0.196, d: 0.268, y: 0.7516, rot: -0.11 },
    { w: 0.19, d: 0.264, y: 0.7524, rot: 0.19 },
  ]
  for (const sheet of sheets) {
    const geo = tintGeometry(new THREE.PlaneGeometry(sheet.w, sheet.d), 0x413d4a, 0.08)
    const paper = new THREE.Mesh(geo, paperMat)
    paper.receiveShadow = true
    paper.rotation.x = -Math.PI / 2
    paper.rotation.z = sheet.rot
    paper.position.set(0.225, sheet.y, -1.03)
    group.add(paper)
  }

  const mugGroup = new THREE.Group()
  mugGroup.position.set(0.24, 0.7528, -1.02)
  jitter(mugGroup, 0.4, 0.01)
  group.add(mugGroup)

  const mugBody = cyl(0.036, 0.032, 0.098, MAT.plastic(0x35323f, 0.55), detail(14))
  mugBody.position.y = 0.049
  mugGroup.add(mugBody)

  const handleGeo = ensureColors(new THREE.TorusGeometry(0.026, 0.0055, 5, 10, Math.PI * 1.15))
  const handle = new THREE.Mesh(handleGeo, MAT.plastic(0x35323f, 0.55))
  handle.castShadow = true
  handle.rotation.z = -Math.PI * 0.575
  handle.position.set(0.041, 0.052, 0)
  mugGroup.add(handle)

  // Whatever is in there has not been warm since some time yesterday.
  const brew = new THREE.Mesh(ensureColors(new THREE.CircleGeometry(0.031, detail(12))), MAT.plastic(0x120c0a, 0.26))
  brew.rotation.x = -Math.PI / 2
  brew.position.y = 0.079
  mugGroup.add(brew)

  // The stain is where the mug used to live, which is the only reason a ring
  // on a desk reads as a ring and not as a decal.
  const stainMat = new THREE.MeshStandardMaterial({
    color: 0x140f1c,
    roughness: 0.58,
    metalness: 0,
    transparent: true,
    opacity: 0.62,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    vertexColors: true,
  })
  const stain = new THREE.Mesh(ensureColors(new THREE.RingGeometry(0.032, 0.041, detail(18))), stainMat)
  stain.rotation.x = -Math.PI / 2
  stain.position.set(0.108, TOP_Y + 0.0008, -0.938)
  group.add(stain)

  // --- cable management -----------------------------------------------------
  // Four runs down the back-left leg, none of them the same gauge, none of
  // them making a right angle, one of them sagging low enough to be the
  // foreground of a low shot.

  group.add(
    cable(
      [
        [-1.09, TOP_Y + 0.004, -1.402],
        [-1.108, TOP_Y + 0.002, -1.443],
        [-1.132, 0.702, -1.468],
        [-1.158, 0.52, -1.436],
        [-1.176, 0.3, -1.412],
        [-1.184, 0.09, -1.386],
        [-1.13, 0.009, -1.322],
        [-1.036, 0.008, -1.362],
      ],
      { radius: 0.004, color: 0x16131e, segments: detail(24) },
    ),
  )

  group.add(
    cable(
      [
        [-0.278, TOP_Y + 0.003, -1.44],
        [-0.44, 0.736, -1.472],
        [-0.62, 0.61, -1.462],
        [-0.802, 0.548, -1.424],
        [-0.978, 0.606, -1.402],
        [-1.126, 0.44, -1.392],
        [-1.192, 0.2, -1.402],
        [-1.164, 0.022, -1.318],
        [-1.042, 0.01, -1.246],
      ],
      { radius: 0.0075, color: PALETTE.greyMetal, segments: detail(28) },
    ),
  )

  group.add(
    cable(
      [
        [0.71, TOP_Y + 0.002, -1.446],
        [0.22, 0.704, -1.47],
        [-0.3, 0.664, -1.484],
        [-0.71, 0.632, -1.462],
        [-1.05, 0.52, -1.424],
        [-1.196, 0.244, -1.39],
        [-1.208, 0.024, -1.286],
        [-1.11, 0.009, -1.168],
      ],
      { radius: 0.009, color: 0x1f1a28, segments: detail(28) },
    ),
  )

  group.add(
    cable(
      [
        [-0.9, TOP_Y + 0.002, -1.432],
        [-1.02, 0.63, -1.446],
        [-1.128, 0.44, -1.406],
        [-1.172, 0.31, -1.376],
      ],
      { radius: 0.0035, color: 0x2c2733, segments: detail(16) },
    ),
  )

  const tieGeo = ensureColors(new THREE.TorusGeometry(0.042, 0.0035, 5, detail(10)))
  const tie = new THREE.Mesh(tieGeo, MAT.plastic(0x0f0d15, 0.5))
  tie.castShadow = true
  tie.rotation.x = Math.PI / 2
  tie.rotation.z = 0.2
  tie.position.set(-1.176, 0.332, -1.378)
  group.add(tie)

  const tieTail = box(0.004, 0.016, 0.002, MAT.plastic(0x0f0d15, 0.5), { dirt: 0.1 })
  tieTail.position.set(-1.176, 0.312, -1.336)
  tieTail.rotation.x = 0.3
  group.add(tieTail)

  // --- the tool pile --------------------------------------------------------
  // Grouped, overlapping, off-axis. Tools laid out neatly read as a shop
  // display; a pile reads as somebody halfway through something.

  const driver = new THREE.Group()
  driver.position.set(-1.08, TOP_Y + 0.005, -0.87)
  driver.rotation.y = 0.62
  driver.rotation.z = -0.035
  group.add(driver)

  const grip = cyl(0.0105, 0.0118, 0.072, MAT.plastic(0x2a1f38, 0.58), detail(10))
  grip.rotation.z = Math.PI / 2
  grip.position.set(-0.038, 0.006, 0)
  driver.add(grip)

  const shank = cyl(0.0026, 0.0026, 0.086, steel, 8)
  shank.rotation.z = Math.PI / 2
  shank.position.set(0.045, -0.0024, 0)
  driver.add(shank)

  const tip = cyl(0.0009, 0.0026, 0.014, steel, 6)
  tip.rotation.z = Math.PI / 2
  tip.position.set(0.095, -0.0024, 0)
  driver.add(tip)

  const cutters = new THREE.Group()
  cutters.position.set(-1.015, TOP_Y + 0.004, -0.942)
  cutters.rotation.y = -0.42
  group.add(cutters)
  for (const sign of [1, -1]) {
    const arm = box(0.011, 0.007, 0.104, MAT.paint(0x2d2432, { rough: 0.44, metal: 0.6 }), { dirt: 0.24 })
    arm.rotation.y = 0.15 * sign
    arm.position.set(0.004 * sign, 0, 0)
    cutters.add(arm)
  }
  const pivot = cyl(0.006, 0.006, 0.011, steel, 8)
  pivot.position.set(0, 0.002, 0)
  cutters.add(pivot)

  const screwMat = MAT.metal(PALETTE.brightMetal, 0.38)
  for (const [sx, sz, sr] of [
    [-0.985, -0.828, 0.4],
    [-0.947, -0.803, 1.9],
    [-0.998, -0.786, 2.7],
    [-0.934, -0.848, 1.1],
  ]) {
    const screw = cyl(0.0016, 0.003, 0.0095, screwMat, 6)
    screw.rotation.z = Math.PI / 2
    screw.rotation.y = sr
    screw.position.set(sx, TOP_Y + 0.0016, sz)
    group.add(screw)
  }

  group.add(
    cable(
      [
        [-0.902, TOP_Y + 0.0012, -0.932],
        [-0.936, TOP_Y + 0.0015, -0.906],
        [-0.972, TOP_Y + 0.002, -0.888],
        [-0.996, TOP_Y + 0.0015, -0.862],
        [-0.972, TOP_Y + 0.0012, -0.838],
        [-0.938, TOP_Y + 0.0012, -0.848],
      ],
      { radius: 0.0011, color: PALETTE.brightMetal, segments: detail(14), material: MAT.metal(PALETTE.brightMetal, 0.3) },
    ),
  )

  // --- chair back -----------------------------------------------------------
  // It exists to be a black shape across the bottom of the frame. It does not
  // cast, because its shadow would land squarely on the props the lamp is
  // there to show off.

  const chair = new THREE.Group()
  chair.position.copy(CHAIR)
  chair.rotation.y = 0.13
  group.add(chair)

  const backrest = box(0.42, 0.19, 0.05, MAT.cloth(PALETTE.fabric), { dirt: 0.26, tint: 0x8e8a98 })
  backrest.position.set(0, 0.885, 0)
  backrest.rotation.x = 0.15
  backrest.castShadow = false
  chair.add(backrest)

  for (const sign of [1, -1]) {
    const post = cyl(0.016, 0.016, 0.32, MAT.paint(PALETTE.greyMetal, { rough: 0.5, metal: 0.55 }), 8)
    post.position.set(0.176 * sign, 0.72, 0.026)
    post.rotation.x = 0.15
    post.castShadow = false
    chair.add(post)
  }

  // --- the one thing you can touch -----------------------------------------

  const mugRest = { x: mugGroup.rotation.x, z: mugGroup.rotation.z }
  let wobble = 0
  let nudged = false

  const nudge = () => {
    wobble = WOBBLE
    nudged = true
    sfx?.play('latch')
  }

  const update = (dt) => {
    if (wobble <= 0) return
    wobble = Math.max(0, wobble - dt)
    // Quadratic decay, so it settles rather than stopping dead.
    const a = 0.05 * (wobble / WOBBLE) ** 2
    mugGroup.rotation.z = mugRest.z + Math.sin(wobble * 34) * a
    mugGroup.rotation.x = mugRest.x + Math.cos(wobble * 29) * a * 0.6
  }

  return {
    group,
    update,
    lampTarget: { origin: bulbWorld, aim: SHADE_AIM.clone() },
    bulbMesh,
    bulbGlow,
    interactives: [
      {
        object: mugGroup,
        label: 'Mug',
        hint: () => (nudged ? 'Still cold' : 'Cold'),
        onClick: nudge,
      },
    ],
    dispose() {
      // Only the two materials this module made for itself; everything else on
      // the bench is shared and the assembler clears it.
      shadeMat.dispose()
      stainMat.dispose()
    },
  }
}
