// solder.js — the soldering station, its iron, and the litter around both.
//
// Set dressing with one switch. The station starts cold on purpose: the rest
// of the room is already lit when the reveal lands, so this is the one thing
// left for the viewer to turn on themselves, and the tip has to ramp rather
// than snap or the click reads as a light switch instead of 40 watts of
// element waking up.
//
// Everything here is built around the iron's axis: pointAt(s) walks up it, and
// the tip, barrel, ferrule, handle and cable exit are all just distances along
// that one line.

import * as THREE from 'three'
import {
  MAT,
  PALETTE,
  box,
  cyl,
  cable,
  glowSprite,
  glowTexture,
  contactDarken,
  edgeDirt,
  tintGeometry,
  ensureColors,
  jitter,
} from './materials.js'

const UP = new THREE.Vector3(0, 1, 0)
// y = 0 is the desk surface in this module's local space, so the contact plane
// the dirt passes measure against is simply the origin plane.
const DESK = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)

const RAMP = 1.5
const COLD_C = 25
const HOT_C = 350

// The iron rests in the spring at 35 degrees above horizontal, mouth toward
// the viewer. B is where the spring's narrow end sits; d walks up the barrel.
const IRON_ORIGIN = new THREE.Vector3(0.005, 0.016, -0.025)
const IRON_DIR = new THREE.Vector3(0, Math.sin(0.611), Math.cos(0.611))

const smootherstep = (k) => k * k * k * (k * (k * 6 - 15) + 10)

// --- the readout ------------------------------------------------------------
// Seven segments drawn by hand rather than a font, because a font at this
// pixel size gives you a smudge and segments give you a display.

const SEGMENTS = {
  0: 'abcdef',
  1: 'bc',
  2: 'abged',
  3: 'abgcd',
  4: 'fgbc',
  5: 'afgcd',
  6: 'afgecd',
  7: 'abc',
  8: 'abcdefg',
  9: 'abcdfg',
}

const segRect = {
  a: (x, y, w, h, t) => [x + t, y, w - 2 * t, t],
  b: (x, y, w, h, t) => [x + w - t, y + t, t, h / 2 - 1.5 * t],
  c: (x, y, w, h, t) => [x + w - t, y + h / 2 + 0.5 * t, t, h / 2 - 1.5 * t],
  d: (x, y, w, h, t) => [x + t, y + h - t, w - 2 * t, t],
  e: (x, y, w, h, t) => [x, y + h / 2 + 0.5 * t, t, h / 2 - 1.5 * t],
  f: (x, y, w, h, t) => [x, y + t, t, h / 2 - 1.5 * t],
  g: (x, y, w, h, t) => [x + t, y + h / 2 - 0.5 * t, w - 2 * t, t],
}

export function createSolderKit({ sfx = null, quality = 1 } = {}) {
  const group = new THREE.Group()
  const detail = (n) => Math.max(5, Math.round(n * (quality < 1 ? 0.7 : 1)))

  const caseMat = MAT.paint(PALETTE.greyMetal, { rough: 0.52, metal: 0.4 })
  const panelMat = MAT.plastic(0x1a1822, 0.55)
  const slotMat = MAT.plastic(0x0c0a11, 0.82)
  const knobMat = MAT.plastic(0x2f2c37, 0.5)
  const castMat = MAT.paint(0x1e1c22, { rough: 0.62, metal: 0.32 })
  const steel = MAT.metal(PALETTE.aluminium, 0.42)
  const bright = MAT.metal(PALETTE.brightMetal, 0.3)
  const handleMat = MAT.plastic(0x2c2438, 0.6)
  const gripMat = MAT.rubber(0x191521)
  const shroudMat = MAT.plastic(PALETTE.plastic, 0.62)

  // Owned outright rather than pulled from the cache, because these three get
  // mutated every frame and the cache hands the same instance to everyone.
  const tipMat = new THREE.MeshStandardMaterial({
    color: 0x2a2228,
    roughness: 0.46,
    metalness: 0.45,
    emissive: PALETTE.sodium,
    emissiveIntensity: 0,
    vertexColors: true,
  })
  const LED_OFF = new THREE.Color(0x1a0f0b)
  const LED_ON = new THREE.Color(PALETTE.sodium).multiplyScalar(1.7)
  const ledMat = new THREE.MeshBasicMaterial({ color: LED_OFF.clone(), toneMapped: true, fog: false })

  // --- helpers --------------------------------------------------------------

  const strut = (a, b, radius, material, segments = 8) => {
    const dir = new THREE.Vector3().subVectors(b, a)
    const len = dir.length()
    const mesh = cyl(radius, radius, len, material, segments)
    mesh.quaternion.setFromUnitVectors(UP, dir.normalize())
    mesh.position.copy(a).addScaledVector(dir, len / 2)
    return mesh
  }

  const ball = (at, radius, material) => {
    const mesh = new THREE.Mesh(ensureColors(new THREE.SphereGeometry(radius, 6, 4)), material)
    mesh.castShadow = true
    mesh.position.copy(at)
    return mesh
  }

  // A box whose top face slopes from hBack down to hFront, sitting on y = 0.
  // Cheaper than an extrusion and it keeps the vertex-colour pipeline intact.
  const wedge = (w, hBack, hFront, d, material, dirt = 0.2) => {
    const geo = new THREE.BoxGeometry(w, hBack, d)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      if (pos.getY(i) <= 0) continue
      const k = pos.getZ(i) / d + 0.5
      pos.setY(i, THREE.MathUtils.lerp(hBack, hFront, k) - hBack / 2)
    }
    geo.computeVertexNormals()
    geo.translate(0, hBack / 2, 0)
    const mesh = new THREE.Mesh(edgeDirt(geo, dirt), material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    return mesh
  }

  // --- 1. the station base unit --------------------------------------------

  const baseUnit = new THREE.Group()
  baseUnit.position.set(-0.1, 0, 0)
  group.add(baseUnit)

  const chassis = wedge(0.135, 0.07, 0.052, 0.09, caseMat, 0.22)
  baseUnit.add(chassis)
  contactDarken(chassis, [DESK], { radius: 0.026, floor: 0.34 })

  // Slots on the right cheek only: that is the face the camera can see from
  // its seat on the far side of the desk, and vents on a hidden face are
  // triangles spent on nothing.
  for (const vy of [0.018, 0.028, 0.038]) {
    const slot = box(0.0016, 0.0034, 0.046, slotMat, { dirt: 0.06 })
    slot.position.set(0.0676, vy, 0)
    slot.castShadow = false
    baseUnit.add(slot)
  }

  const panel = new THREE.Group()
  panel.position.set(0, 0.028, 0.047)
  // Raked back 15 degrees. The camera looks along the desk at about ten
  // degrees of elevation, so a flat-topped panel would be edge-on and a
  // vertical one would be dead; this splits the difference.
  panel.rotation.x = -0.26
  baseUnit.add(panel)

  const panelPlate = box(0.12, 0.04, 0.005, panelMat, { dirt: 0.14 })
  panel.add(panelPlate)

  const bezel = box(0.036, 0.017, 0.003, MAT.plastic(0x0a0810, 0.3), { dirt: 0.1 })
  bezel.position.set(-0.036, 0.004, 0.003)
  panel.add(bezel)

  // The readout canvas is redrawn while the station heats, so it cannot come
  // from the shared texture cache.
  const readCanvas = document.createElement('canvas')
  readCanvas.width = 200
  readCanvas.height = 88
  const readCtx = readCanvas.getContext('2d')

  const drawReadout = (value) => {
    if (!readCtx) return
    const ctx = readCtx
    ctx.clearRect(0, 0, 200, 88)
    ctx.fillStyle = '#ffffff'
    ctx.globalAlpha = 0.45
    ctx.font = 'bold 13px ui-monospace, monospace'
    ctx.fillText('TEMP', 12, 15)
    ctx.font = 'bold 15px ui-monospace, monospace'
    ctx.fillText('C', 168, 74)
    ctx.save()
    // Real seven-segment glass leans right. Free, and it stops the digits
    // reading as three stacks of rectangles.
    ctx.transform(1, 0, -0.09, 1, 8, 0)
    const glyphs = String(Math.max(0, Math.min(999, Math.round(value)))).padStart(3, ' ')
    for (let i = 0; i < 3; i++) {
      const lit = SEGMENTS[glyphs[i]] ?? ''
      const x = 26 + i * 48
      for (const key of 'abcdefg') {
        ctx.globalAlpha = lit.includes(key) ? 1 : 0.085
        ctx.fillRect(...segRect[key](x, 24, 38, 52, 7))
      }
    }
    ctx.restore()
    ctx.globalAlpha = 1
  }

  drawReadout(COLD_C)
  const readTex = new THREE.CanvasTexture(readCanvas)
  readTex.colorSpace = THREE.SRGBColorSpace
  readTex.anisotropy = 4
  const readMat = new THREE.MeshBasicMaterial({
    map: readTex,
    color: PALETTE.sodium,
    transparent: true,
    opacity: 0.05,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: true,
    fog: false,
  })
  const readout = new THREE.Mesh(new THREE.PlaneGeometry(0.033, 0.0145), readMat)
  readout.position.set(-0.036, 0.004, 0.0053)
  readout.renderOrder = 2
  panel.add(readout)

  const knob = cyl(0.0108, 0.0126, 0.015, knobMat, detail(12))
  knob.rotation.x = Math.PI / 2
  knob.position.set(0.014, 0.001, 0.0105)
  panel.add(knob)

  const pointer = box(0.0018, 0.009, 0.0012, MAT.metal(PALETTE.brightMetal, 0.36), { dirt: 0.05 })
  pointer.position.set(0.014, 0.0055, 0.0182)
  pointer.rotation.z = -0.5
  pointer.castShadow = false
  panel.add(pointer)

  const rockerHousing = box(0.015, 0.011, 0.004, MAT.plastic(0x141220, 0.5), { dirt: 0.1 })
  rockerHousing.position.set(0.044, 0.004, 0.003)
  panel.add(rockerHousing)

  const rocker = box(0.0115, 0.008, 0.0035, MAT.plastic(0x241d2c, 0.44), { dirt: 0.08 })
  rocker.position.set(0.044, 0.0043, 0.0058)
  rocker.rotation.x = -0.22
  panel.add(rocker)

  const led = new THREE.Mesh(new THREE.PlaneGeometry(0.0072, 0.0042), ledMat)
  led.position.set(0.044, 0.0055, 0.0079)
  led.rotation.x = -0.22
  led.renderOrder = 2
  panel.add(led)

  const ledGlow = glowSprite(PALETTE.sodium, 0.005, { core: 0.7, mid: 0.22, halo: 0.07 })
  ledGlow.position.copy(led.position)
  ledGlow.userData.setIntensity(0)
  panel.add(ledGlow)

  // Where the iron's lead plugs in. Sunk half into the cheek so the cable has
  // somewhere honest to end.
  const socket = cyl(0.006, 0.0072, 0.009, castMat, 8)
  socket.rotation.z = Math.PI / 2
  socket.position.set(0.072, 0.024, 0.012)
  baseUnit.add(socket)

  // --- 2. the iron and its spring holder -----------------------------------

  const holder = new THREE.Group()
  holder.position.set(0.005, 0, -0.005)
  group.add(holder)

  const plate = cyl(0.03, 0.034, 0.009, castMat, detail(14))
  plate.position.y = 0.0045
  holder.add(plate)
  contactDarken(plate, [DESK], { radius: 0.02, floor: 0.32 })

  const post = box(0.016, 0.011, 0.016, castMat, { dirt: 0.22 })
  post.position.set(0.01, 0.0145, -0.029)
  holder.add(post)

  // The spring is one tube through a helix rather than a stack of tori: at
  // this radius a stack reads as a stack, and the tube costs about the same.
  const coil = new THREE.Group()
  coil.position.set(0, 0.016, -0.02)
  coil.rotation.x = Math.PI / 2 - 0.611
  holder.add(coil)

  const coilPts = [new THREE.Vector3(0.011, -0.014, -0.005)]
  const coilN = detail(24)
  for (let i = 0; i <= coilN; i++) {
    const k = i / coilN
    const a = k * 3 * Math.PI * 2
    const r = 0.01 + 0.02 * k
    coilPts.push(new THREE.Vector3(Math.cos(a) * r, k * 0.075, Math.sin(a) * r))
  }
  coil.add(cable(coilPts, { radius: 0.0022, segments: detail(56), material: steel }))

  const pointAt = (s) => new THREE.Vector3().copy(IRON_ORIGIN).addScaledVector(IRON_DIR, s)
  const ironQuat = new THREE.Quaternion().setFromUnitVectors(UP, IRON_DIR)

  const along = (s0, s1, rTop, rBottom, material, segments) => {
    const mesh = cyl(rTop, rBottom, s1 - s0, material, segments)
    mesh.quaternion.copy(ironQuat)
    mesh.position.copy(pointAt((s0 + s1) / 2))
    group.add(mesh)
    return mesh
  }

  along(0.006, 0.02, 0.0038, 0.0012, tipMat, 6)

  const chisel = new THREE.Mesh(edgeDirt(new THREE.BoxGeometry(0.007, 0.009, 0.0016), 0.1), tipMat)
  chisel.castShadow = true
  chisel.quaternion.copy(ironQuat)
  chisel.position.copy(pointAt(0.0105))
  group.add(chisel)

  along(0.02, 0.058, 0.0042, 0.004, bright, 8)
  along(0.056, 0.07, 0.0072, 0.0062, steel, 8)
  along(0.07, 0.148, 0.0098, 0.0118, handleMat, detail(10))
  along(0.086, 0.12, 0.0128, 0.0128, gripMat, detail(10))
  along(0.148, 0.163, 0.0058, 0.0076, gripMat, 8)

  const tipAt = pointAt(0.011)
  const tipGlow = glowSprite(PALETTE.sodium, 0.011, { core: 0.8, mid: 0.28, halo: 0.09 })
  tipGlow.position.copy(tipAt)
  tipGlow.userData.setIntensity(0)
  group.add(tipGlow)

  // A single stretched additive sprite above the mouth of the spring. It is
  // not convection, it is a smear that breathes, and at this scale that is
  // indistinguishable from one.
  const shimmerMat = new THREE.SpriteMaterial({
    map: glowTexture(),
    color: PALETTE.sodium,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
    fog: false,
  })
  const shimmer = new THREE.Sprite(shimmerMat)
  shimmer.scale.set(0.03, 0.07, 1)
  shimmer.position.set(0.005, 0.072, -0.012)
  shimmer.renderOrder = 999
  group.add(shimmer)

  // Nothing else in the room is warm on this side of the desk, so the tip gets
  // a light of its own. Tiny range, no shadow — it exists to put a bead of
  // orange on the plate and the nearest coils, not to light anything.
  const tipLight = new THREE.PointLight(PALETTE.sodium, 0, 0.16, 2)
  tipLight.castShadow = false
  tipLight.position.copy(tipAt)
  group.add(tipLight)

  // Brass wool, beside the spring, for the wiping nobody has done lately.
  const potMat = MAT.metal(PALETTE.aluminium, 0.5)
  const pot = cyl(0.024, 0.021, 0.026, potMat, detail(14), { open: true })
  pot.position.set(0.068, 0.013, -0.008)
  group.add(pot)

  const potFloor = new THREE.Mesh(ensureColors(new THREE.CircleGeometry(0.021, detail(14))), potMat)
  potFloor.rotation.x = -Math.PI / 2
  potFloor.position.set(0.068, 0.0015, -0.008)
  potFloor.receiveShadow = true
  group.add(potFloor)

  const woolGeo = new THREE.SphereGeometry(0.021, 8, 5)
  woolGeo.scale(1, 0.6, 1)
  tintGeometry(woolGeo, 0xb0a88f, 0.34)
  const wool = new THREE.Mesh(woolGeo, MAT.metal(PALETTE.copper, 0.74))
  wool.castShadow = true
  wool.position.set(0.068, 0.024, -0.008)
  group.add(wool)

  // --- 3. the iron's lead ---------------------------------------------------
  // Silicone, thick, and coiled from years of being wound round the base. It
  // is the loudest line on the station, so it gets the segment budget.

  const helix = (from, to, radius, turns, samples) => {
    const axis = new THREE.Vector3().subVectors(to, from)
    const len = axis.length()
    const u = axis.clone().divideScalar(len)
    const e1 = new THREE.Vector3().crossVectors(UP, u).normalize()
    const e2 = new THREE.Vector3().crossVectors(u, e1)
    const out = []
    for (let i = 0; i <= samples; i++) {
      const k = i / samples
      const a = k * turns * Math.PI * 2
      const r = radius * (1 - 0.2 * k)
      out.push(
        new THREE.Vector3()
          .copy(from)
          .addScaledVector(u, len * k)
          .addScaledVector(e1, Math.cos(a) * r)
          .addScaledVector(e2, Math.sin(a) * r),
      )
    }
    return out
  }

  const leadPts = [
    pointAt(0.17),
    new THREE.Vector3(0.016, 0.1105, 0.1155),
    new THREE.Vector3(0.03, 0.1, 0.112),
    ...helix(new THREE.Vector3(0.04, 0.086, 0.1), new THREE.Vector3(0.086, 0.028, 0.046), 0.017, 2.6, detail(20)),
    new THREE.Vector3(0.082, 0.0148, 0.053),
    new THREE.Vector3(0.062, 0.0062, 0.063),
    new THREE.Vector3(0.036, 0.006, 0.065),
    new THREE.Vector3(0.01, 0.0062, 0.057),
    new THREE.Vector3(-0.01, 0.0098, 0.041),
    new THREE.Vector3(-0.022, 0.0182, 0.025),
    new THREE.Vector3(-0.028, 0.024, 0.013),
  ]
  const lead = cable(leadPts, { radius: 0.0055, color: 0x191622, segments: detail(78) })
  group.add(lead)
  contactDarken(lead, [DESK], { radius: 0.014, floor: 0.44 })

  // --- 4. the solder spool --------------------------------------------------

  const spool = new THREE.Group()
  spool.position.set(0.145, 0, 0.062)
  jitter(spool, 0.14, 0.008)
  group.add(spool)

  const spoolFoot = box(0.048, 0.005, 0.036, MAT.plastic(0x232029, 0.6), { dirt: 0.2 })
  spoolFoot.position.y = 0.0025
  spool.add(spoolFoot)
  contactDarken(spoolFoot, [DESK], { radius: 0.014, floor: 0.36 })

  for (const sx of [-0.019, 0.019]) {
    const upright = box(0.005, 0.036, 0.024, MAT.plastic(0x232029, 0.6), { dirt: 0.2 })
    upright.position.set(sx, 0.023, 0)
    spool.add(upright)
  }

  const axle = cyl(0.003, 0.003, 0.046, steel, 6)
  axle.rotation.z = Math.PI / 2
  axle.position.y = 0.038
  spool.add(axle)

  const reelMat = MAT.plastic(0x2b2833, 0.58)
  const hub = cyl(0.011, 0.011, 0.02, reelMat, detail(12))
  hub.rotation.z = Math.PI / 2
  hub.position.y = 0.038
  spool.add(hub)

  for (const fx of [-0.011, 0.011]) {
    const flange = cyl(0.03, 0.03, 0.0025, reelMat, detail(14))
    flange.rotation.z = Math.PI / 2
    flange.position.set(fx, 0.038, 0)
    spool.add(flange)
  }

  const woundGeo = ensureColors(new THREE.TorusGeometry(0.021, 0.0088, 6, detail(16)))
  tintGeometry(woundGeo, 0xb6b2bd, 0.16)
  const wound = new THREE.Mesh(woundGeo, MAT.metal(PALETTE.brightMetal, 0.34))
  wound.castShadow = true
  wound.receiveShadow = true
  wound.rotation.y = Math.PI / 2
  wound.position.y = 0.038
  spool.add(wound)

  // The loose end. Whoever pulled it off never cut it back.
  spool.add(
    cable(
      [
        new THREE.Vector3(0.004, 0.0605, -0.004),
        new THREE.Vector3(0.008, 0.062, -0.016),
        new THREE.Vector3(0.006, 0.05, -0.03),
        new THREE.Vector3(-0.004, 0.03, -0.032),
        new THREE.Vector3(-0.016, 0.012, -0.026),
        new THREE.Vector3(-0.03, 0.0012, -0.018),
        new THREE.Vector3(-0.044, 0.0012, -0.024),
      ],
      { radius: 0.0011, segments: detail(18), material: MAT.metal(PALETTE.brightMetal, 0.3) },
    ),
  )

  // --- 5. flux pot and loose components ------------------------------------

  const flux = new THREE.Group()
  flux.position.set(-0.075, 0, 0.112)
  jitter(flux, 0.5, 0.012)
  group.add(flux)

  const fluxBody = cyl(0.0175, 0.018, 0.02, MAT.plastic(0x2e2634, 0.42), detail(12))
  fluxBody.position.y = 0.01
  flux.add(fluxBody)
  contactDarken(fluxBody, [DESK], { radius: 0.014, floor: 0.34 })

  // The lid sits crooked and a couple of millimetres off centre, because a lid
  // put back straight is a lid nobody has opened.
  const fluxLid = cyl(0.0185, 0.0185, 0.007, MAT.paint(0x1d1a24, { rough: 0.44, metal: 0.5 }), detail(12))
  fluxLid.position.set(0.0025, 0.0235, 0)
  fluxLid.rotation.x = 0.05
  flux.add(fluxLid)

  const smear = new THREE.Mesh(ensureColors(new THREE.CircleGeometry(0.011, detail(10))), MAT.plastic(0x4a3a20, 0.36))
  smear.rotation.x = -Math.PI / 2
  smear.position.set(-0.03, 0.0008, 0.014)
  smear.receiveShadow = true
  flux.add(smear)

  const resistor = new THREE.Group()
  resistor.position.set(-0.024, 0, 0.104)
  resistor.rotation.y = 0.7
  group.add(resistor)

  const resBody = cyl(0.0028, 0.0028, 0.0095, MAT.plastic(0x3a3126, 0.5), 8)
  resBody.rotation.z = Math.PI / 2
  resBody.position.y = 0.0028
  resistor.add(resBody)

  for (const bx of [-0.0022, 0.0006, 0.0028]) {
    const band = cyl(0.0031, 0.0031, 0.0012, MAT.plastic(0x120e14, 0.5), 8)
    band.rotation.z = Math.PI / 2
    band.position.set(bx, 0.0028, 0)
    resistor.add(band)
  }

  for (const sign of [1, -1]) {
    const leg = cyl(0.00045, 0.00045, 0.014, bright, 5)
    leg.rotation.z = Math.PI / 2
    leg.rotation.y = 0.18 * sign
    leg.position.set(0.0115 * sign, 0.0026, 0)
    resistor.add(leg)
  }

  const capacitor = new THREE.Group()
  capacitor.position.set(0.02, 0, 0.124)
  capacitor.rotation.y = -1.05
  jitter(capacitor, 0, 0.02)
  group.add(capacitor)

  const capBody = cyl(0.0046, 0.0046, 0.012, MAT.plastic(0x1b1a22, 0.44), detail(10))
  capBody.rotation.z = Math.PI / 2
  capBody.position.y = 0.0046
  capacitor.add(capBody)

  const capTop = cyl(0.0043, 0.0043, 0.0012, MAT.metal(PALETTE.brightMetal, 0.36), detail(10))
  capTop.rotation.z = Math.PI / 2
  capTop.position.set(-0.0064, 0.0046, 0)
  capacitor.add(capTop)

  for (const sign of [1, -1]) {
    const leg = cyl(0.0005, 0.0005, 0.011, bright, 5)
    leg.rotation.z = Math.PI / 2
    leg.rotation.y = 0.12 * sign
    leg.position.set(0.0115, 0.0046 + 0.002 * sign, 0.0016 * sign)
    capacitor.add(leg)
  }

  // --- 6. the fume fan ------------------------------------------------------

  const fan = new THREE.Group()
  fan.position.set(0.098, 0, -0.1)
  // Aimed back across the spring holder: it is drawing fumes off the tip, so
  // it has to be looking at the tip.
  fan.rotation.y = -0.45
  group.add(fan)

  const fanFoot = box(0.09, 0.006, 0.038, shroudMat, { dirt: 0.22 })
  fanFoot.position.y = 0.003
  fan.add(fanFoot)
  contactDarken(fanFoot, [DESK], { radius: 0.016, floor: 0.32 })

  for (const lx of [-0.032, 0.032]) {
    const leg = box(0.009, 0.03, 0.01, shroudMat, { dirt: 0.2 })
    leg.position.set(lx, 0.02, -0.004)
    fan.add(leg)
  }

  const fanBody = new THREE.Group()
  fanBody.position.set(0, 0.093, 0)
  // The nod belongs to the head, not the whole unit — tilt the foot and one
  // corner of it sinks into the desk.
  fanBody.rotation.x = 0.12
  fan.add(fanBody)

  for (const [fx, fy, fw, fh] of [
    [0, 0.0535, 0.115, 0.012],
    [0, -0.0535, 0.115, 0.012],
    [-0.0535, 0, 0.012, 0.095],
    [0.0535, 0, 0.012, 0.095],
  ]) {
    const rail = box(fw, fh, 0.028, shroudMat, { dirt: 0.24 })
    rail.position.set(fx, fy, 0)
    fanBody.add(rail)
  }

  const motor = cyl(0.012, 0.013, 0.024, MAT.plastic(0x1e1c25, 0.5), detail(10))
  motor.rotation.x = Math.PI / 2
  motor.position.z = -0.006
  fanBody.add(motor)

  const rotor = new THREE.Group()
  rotor.position.z = 0.004
  fanBody.add(rotor)

  const rotorHub = cyl(0.009, 0.0095, 0.014, MAT.plastic(0x312e3a, 0.55), 8)
  rotorHub.rotation.x = Math.PI / 2
  rotor.add(rotorHub)

  // Five instances of one blade — five separate meshes here would be five
  // draw calls for a shape nobody can resolve once it is turning.
  const bladeGeo = edgeDirt(new THREE.BoxGeometry(0.034, 0.021, 0.0016), 0.2)
  const blades = new THREE.InstancedMesh(bladeGeo, MAT.plastic(0x312e3a, 0.55), 5)
  blades.castShadow = true
  {
    const m = new THREE.Matrix4()
    const spin = new THREE.Matrix4()
    const out = new THREE.Matrix4()
    const pitch = new THREE.Matrix4().makeRotationX(0.55)
    for (let i = 0; i < 5; i++) {
      spin.makeRotationZ((i / 5) * Math.PI * 2)
      out.makeTranslation(0.026, 0, 0)
      m.multiplyMatrices(spin, out).multiply(pitch)
      blades.setMatrixAt(i, m)
    }
    blades.instanceMatrix.needsUpdate = true
  }
  rotor.add(blades)

  const guardGeo = ensureColors(new THREE.TorusGeometry(0.042, 0.0022, 5, detail(16)))
  const guard = new THREE.Mesh(guardGeo, steel)
  guard.castShadow = true
  guard.position.z = 0.014
  fanBody.add(guard)

  // Four rods across the full diameter read as eight spokes and cost half.
  const spokeGeo = ensureColors(new THREE.CylinderGeometry(0.0016, 0.0016, 0.084, 5))
  const spokes = new THREE.InstancedMesh(spokeGeo, steel, 4)
  spokes.castShadow = true
  spokes.position.z = 0.014
  {
    const m = new THREE.Matrix4()
    for (let i = 0; i < 4; i++) {
      m.makeRotationZ((i / 4) * Math.PI)
      spokes.setMatrixAt(i, m)
    }
    spokes.instanceMatrix.needsUpdate = true
  }
  fanBody.add(spokes)

  // --- 7. helping hands -----------------------------------------------------
  // Aimed at nothing. Whatever was clamped in them has been taken away, which
  // is a cheaper story than modelling the board that used to be there.

  const hands = new THREE.Group()
  hands.position.set(-0.158, 0, 0.098)
  jitter(hands, 0.3, 0)
  group.add(hands)

  const handsBase = cyl(0.029, 0.033, 0.011, castMat, detail(14))
  handsBase.position.y = 0.0055
  hands.add(handsBase)
  contactDarken(handsBase, [DESK], { radius: 0.018, floor: 0.3 })

  const handsCollar = cyl(0.0075, 0.011, 0.012, castMat, detail(10))
  handsCollar.position.y = 0.016
  hands.add(handsCollar)

  const KNUCKLE = new THREE.Vector3(0, 0.024, 0)
  hands.add(ball(KNUCKLE, 0.0072, steel))

  const arms = [
    { elbow: new THREE.Vector3(0.019, 0.058, 0.019), clip: new THREE.Vector3(0.034, 0.05, 0.036) },
    { elbow: new THREE.Vector3(-0.014, 0.068, 0.016), clip: new THREE.Vector3(0.008, 0.056, 0.034) },
  ]
  const AIM = new THREE.Vector3(0.09, 0.042, 0.09)

  for (const arm of arms) {
    hands.add(strut(KNUCKLE, arm.elbow, 0.0022, steel, 6))
    hands.add(ball(arm.elbow, 0.0055, steel))
    hands.add(strut(arm.elbow, arm.clip, 0.0022, steel, 6))

    const clip = new THREE.Group()
    clip.position.copy(arm.clip)
    clip.quaternion.setFromUnitVectors(UP, new THREE.Vector3().subVectors(AIM, arm.clip).normalize())
    hands.add(clip)

    const clipBody = box(0.0055, 0.013, 0.0072, MAT.metal(PALETTE.brightMetal, 0.36), { dirt: 0.16 })
    clipBody.position.y = 0.0055
    clip.add(clipBody)

    for (const sign of [1, -1]) {
      const jaw = box(0.0036, 0.015, 0.0018, MAT.metal(PALETTE.brightMetal, 0.32), { dirt: 0.14 })
      jaw.position.set(0, 0.0185, 0.0024 * sign)
      jaw.rotation.x = -0.11 * sign
      clip.add(jaw)
    }
  }

  // --- the switch -----------------------------------------------------------

  let on = false
  let heat = 0
  let shown = COLD_C
  let redrawIn = 0
  let chimed = true

  const toggle = () => {
    on = !on
    if (on) chimed = false
    sfx?.play('latch')
    rocker.rotation.x = on ? 0.22 : -0.22
    led.rotation.x = rocker.rotation.x
  }

  const update = (dt, t) => {
    // Linear over RAMP seconds, then smoothed for the visuals — an element
    // does not reach setpoint on an exponential and it does not get there in
    // one frame either.
    heat = THREE.MathUtils.clamp(heat + ((on ? 1 : -1) * dt) / RAMP, 0, 1)
    const k = smootherstep(heat)

    tipMat.emissiveIntensity = k * 3.2
    tipGlow.userData.setIntensity(k)
    ledGlow.userData.setIntensity(on ? 1 : 0)
    ledMat.color.copy(LED_OFF).lerp(LED_ON, on ? 1 : 0)
    tipLight.intensity = k * 0.35
    readMat.opacity = 0.05 + 0.9 * k

    shimmerMat.opacity = k * (0.055 + 0.02 * Math.sin(t * 1.13))
    shimmer.scale.set(0.03 * (1 + 0.12 * Math.sin(t * 2.3)), 0.07 * (1 + 0.19 * Math.sin(t * 1.7 + 1.4)), 1)

    if (!chimed && heat >= 1) {
      chimed = true
      sfx?.play('blip')
    }

    // Quantised and throttled: the digits climbing is the point, uploading a
    // canvas sixty times a second is not.
    redrawIn -= dt
    if (redrawIn <= 0) {
      redrawIn = 0.07
      const want = Math.round((COLD_C + (HOT_C - COLD_C) * k) / 5) * 5
      if (want !== shown) {
        shown = want
        drawReadout(shown)
        readTex.needsUpdate = true
      }
    }

    // Half a turn a second. Faster strobes against the frame rate and the
    // blades stop being blades.
    rotor.rotation.z += dt * 3.2
  }

  return {
    group,
    update,
    interactives: [
      {
        object: baseUnit,
        label: 'Soldering station',
        hint: () => (on ? 'Switch it off' : 'Switch it on'),
        onClick: toggle,
      },
    ],
    dispose() {
      // Only what this module owns; the rest of the bench is shared and the
      // assembler clears it.
      readTex.dispose()
      readMat.dispose()
      tipMat.dispose()
      ledMat.dispose()
      shimmerMat.dispose()
    },
  }
}
