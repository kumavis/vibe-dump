// clock.js — the weight-driven clock on the back wall.
//
// A movement with no case: two brass plates, four pillars, and the train
// running between them where you can watch it. The dial is a lotus seen from
// above and the petal tips are the hour marks, so there are no numerals and
// nothing to read — you tell the time off the shape, which is the only excuse
// for a clock in a room this dark.
//
// It hangs, and what it hangs on is the point: two raw amethyst points wrapped
// in gold chain by somebody who was not being careful about it. The wrapping is
// meant to look wrong. A tidy cage would be jewellery; this is a man who needed
// a weight and had a crystal and some chain.
//
// The entire lit surface of the prop is the last two millimetres of each hand.

import * as THREE from 'three'
import { MAT, PALETTE, box, cyl, cable, glowSprite, ensureColors, edgeDirt } from './materials.js'

const TAU = Math.PI * 2
const rnd = (a, b) => a + Math.random() * (b - a)

const FACE_R = 0.1 // the lotus dial, 200mm across
const PLATE_R = 0.078
const PLATE_GAP = 0.026 // how far apart the two movement plates stand
const DROP = 0.2 // face centre below the wall mount
const FALL = 0.3 // how far a weight travels before it is wound back up

const BRASS = 0xb08a4a
const GOLD = 0xd3ab55

/**
 * A lotus petal as a flat closed shape, tip outward along +x.
 * Two arcs meeting at a point, which is the whole grammar: a petal is a
 * teardrop that has been pinched at both ends rather than one.
 */
function petalShape(inner, outer, halfWidth) {
  const s = new THREE.Shape()
  s.moveTo(inner, 0)
  s.quadraticCurveTo((inner + outer) * 0.5, halfWidth, outer, 0)
  s.quadraticCurveTo((inner + outer) * 0.5, -halfWidth, inner, 0)
  return s
}

/**
 * A wheel whose teeth are petals and whose web is pierced with more of them.
 * At this size the teeth read as a scalloped rim rather than as gearing, which
 * is the intent — a clockmaker would call it wrong and it is the only reason
 * the thing looks like it belongs in this room.
 */
function lotusWheel(radius, teeth, detail) {
  const shape = new THREE.Shape()
  const root = radius * 0.86
  for (let i = 0; i <= teeth; i++) {
    const a0 = (i / teeth) * TAU
    const a1 = ((i + 0.5) / teeth) * TAU
    const p = i === 0 ? 'moveTo' : 'lineTo'
    shape[p](Math.cos(a0) * root, Math.sin(a0) * root)
    shape.quadraticCurveTo(
      Math.cos(a1) * radius * 1.06,
      Math.sin(a1) * radius * 1.06,
      Math.cos(((i + 1) / teeth) * TAU) * root,
      Math.sin(((i + 1) / teeth) * TAU) * root,
    )
  }
  // Pierce the web: a ring of petal-shaped holes and an arbor hole. This is
  // what keeps a wheel from reading as a coin.
  const holes = Math.max(4, Math.round(teeth / 3))
  for (let i = 0; i < holes; i++) {
    const a = (i / holes) * TAU
    const hole = new THREE.Path()
    const r0 = radius * 0.28
    const r1 = radius * 0.66
    const hw = radius * 0.15
    hole.moveTo(Math.cos(a) * r0, Math.sin(a) * r0)
    hole.quadraticCurveTo(
      Math.cos(a + 0.34) * (r0 + r1) * 0.5,
      Math.sin(a + 0.34) * (r0 + r1) * 0.5,
      Math.cos(a) * r1,
      Math.sin(a) * r1,
    )
    hole.quadraticCurveTo(
      Math.cos(a - 0.34) * (r0 + r1) * 0.5,
      Math.sin(a - 0.34) * (r0 + r1) * 0.5,
      Math.cos(a) * r0,
      Math.sin(a) * r0,
    )
    shape.holes.push(hole)
  }
  const arbor = new THREE.Path()
  arbor.absarc(0, 0, radius * 0.12, 0, TAU, true)
  shape.holes.push(arbor)

  return ensureColors(new THREE.ExtrudeGeometry(shape, { depth: 0.0035, bevelEnabled: false, curveSegments: detail }))
}

export function createClock({ sfx = null, quality = 1 } = {}) {
  const q = THREE.MathUtils.clamp(quality, 0.35, 1)
  const detail = (n) => Math.max(3, Math.round(n * q))

  const group = new THREE.Group()

  const brassMat = MAT.metal(BRASS, 0.44)
  const darkMat = MAT.paint(0x1a1622, { rough: 0.55, metal: 0.4 })
  const goldMat = MAT.metal(GOLD, 0.36)

  // --- the bracket ----------------------------------------------------------
  // Minimal on purpose: the ornament budget belongs to the dial.

  const backPlate = box(0.05, 0.07, 0.008, darkMat, { dirt: 0.2 })
  backPlate.position.set(0, -0.03, 0.004)
  group.add(backPlate)

  const arm = cyl(0.006, 0.006, 0.05, darkMat, detail(8))
  arm.rotation.x = Math.PI / 2
  arm.position.set(0, -0.03, 0.03)
  group.add(arm)

  // Everything below hangs off this, a little forward of the wall.
  const body = new THREE.Group()
  body.position.set(0, -DROP, 0.052)
  group.add(body)

  // --- the movement ---------------------------------------------------------

  const plateGeo = ensureColors(new THREE.CylinderGeometry(PLATE_R, PLATE_R, 0.004, detail(20)))
  for (const z of [-PLATE_GAP / 2, PLATE_GAP / 2]) {
    const plate = new THREE.Mesh(plateGeo, brassMat)
    plate.rotation.x = Math.PI / 2
    plate.position.z = z
    plate.castShadow = true
    plate.receiveShadow = true
    body.add(plate)
  }

  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * TAU + Math.PI / 4
    const pillar = cyl(0.0045, 0.0045, PLATE_GAP, brassMat, detail(6))
    pillar.rotation.x = Math.PI / 2
    pillar.position.set(Math.cos(a) * PLATE_R * 0.8, Math.sin(a) * PLATE_R * 0.8, 0)
    body.add(pillar)
  }

  // The train. Meshing wheels turn in opposite directions at speeds inversely
  // proportional to their radii — getting that backwards is the single most
  // noticeable way a modelled clock reads as fake, and it costs nothing.
  const TRAIN = [
    { r: 0.05, teeth: 16, x: 0, y: 0, spin: 1 / 60 },
    { r: 0.032, teeth: 11, x: 0.072, y: -0.014, spin: 0 },
    { r: 0.022, teeth: 9, x: 0.052, y: 0.05, spin: 0 },
  ]
  const wheels = []
  TRAIN.forEach((w, i) => {
    const mesh = new THREE.Mesh(lotusWheel(w.r, w.teeth, detail(6)), brassMat)
    mesh.position.set(w.x, w.y, -0.0018)
    mesh.castShadow = true
    body.add(mesh)
    // Each wheel takes its speed from the one before it, reversed and scaled.
    const prev = wheels[i - 1]
    const rate = i === 0 ? w.spin * TAU : -prev.rate * (TRAIN[i - 1].r / w.r)
    wheels.push({ mesh, rate })
  })

  // The barrel the chains come off.
  const barrel = cyl(0.016, 0.016, PLATE_GAP * 0.7, brassMat, detail(12))
  barrel.rotation.x = Math.PI / 2
  barrel.position.set(-0.058, -0.03, 0)
  body.add(barrel)

  // --- the dial -------------------------------------------------------------

  const dial = new THREE.Group()
  dial.position.z = PLATE_GAP / 2 + 0.006
  body.add(dial)

  const dialBack = new THREE.Mesh(
    ensureColors(new THREE.CircleGeometry(FACE_R * 0.92, detail(28))),
    MAT.plastic(0x0d0a14, 0.42),
  )
  dialBack.position.z = -0.002
  dial.add(dialBack)

  const rim = new THREE.Mesh(ensureColors(new THREE.TorusGeometry(FACE_R * 0.94, 0.0022, 4, detail(30))), goldMat)
  dial.add(rim)

  // Twelve petals for twelve hours, the four cardinals longer, because a dial
  // you read by shape needs the quarters to be findable without counting.
  const petalMat = MAT.plastic(0x171225, 0.5)
  const petalEdgeMat = MAT.metal(0x6b5a34, 0.5)
  for (let i = 0; i < 12; i++) {
    const cardinal = i % 3 === 0
    const outer = cardinal ? FACE_R * 0.88 : FACE_R * 0.74
    const geo = ensureColors(
      new THREE.ExtrudeGeometry(petalShape(FACE_R * 0.3, outer, cardinal ? 0.019 : 0.014), {
        depth: 0.0022,
        bevelEnabled: false,
        curveSegments: detail(5),
      }),
    )
    const petal = new THREE.Mesh(geo, cardinal ? petalEdgeMat : petalMat)
    petal.rotation.z = (i / 12) * TAU
    dial.add(petal)
  }

  const seedPod = new THREE.Mesh(ensureColors(new THREE.CircleGeometry(FACE_R * 0.13, detail(12))), goldMat)
  seedPod.position.z = 0.004
  dial.add(seedPod)

  // --- the hands, and the only light in the prop -----------------------------

  const handMat = MAT.metal(0x2a2533, 0.4)

  function makeHand(length, width, tipColor, tipLen) {
    const hand = new THREE.Group()
    const shaft = box(length, width, 0.0016, handMat, { dirt: 0.1 })
    shaft.position.x = length / 2
    hand.add(shaft)

    const tip = new THREE.Mesh(
      ensureColors(new THREE.BoxGeometry(tipLen, width * 1.15, 0.002)),
      MAT.emissive(tipColor, 2.2),
    )
    tip.position.x = length - tipLen / 2
    hand.add(tip)

    const glow = glowSprite(tipColor, 0.006, { core: 0.72, mid: 0.2, halo: 0.05 })
    glow.position.x = length - tipLen / 2
    hand.add(glow)
    return { group: hand, glow }
  }

  const hourHand = makeHand(FACE_R * 0.52, 0.005, PALETTE.pink, 0.006)
  const minHand = makeHand(FACE_R * 0.8, 0.0038, PALETTE.violet, 0.007)
  hourHand.group.position.z = 0.006
  minHand.group.position.z = 0.008
  dial.add(hourHand.group, minHand.group)

  // --- the weights ----------------------------------------------------------

  /** A raw six-sided quartz point: a prism with a terminated tip, not a gem. */
  function crystal(len, girth) {
    const profile = [
      new THREE.Vector2(0, -len * 0.5),
      new THREE.Vector2(girth * 0.92, -len * 0.42),
      new THREE.Vector2(girth, -len * 0.1),
      new THREE.Vector2(girth * 0.97, len * 0.22),
      new THREE.Vector2(girth * 0.66, len * 0.4),
      new THREE.Vector2(0, len * 0.5),
    ]
    // Six sides, and no smoothing: quartz is flat faces meeting at hard edges.
    const geo = ensureColors(new THREE.LatheGeometry(profile, 6))
    geo.computeVertexNormals()
    return geo
  }

  const crystalMat = new THREE.MeshPhysicalMaterial({
    color: 0x4a2a7a,
    roughness: 0.22,
    metalness: 0,
    transmission: 0.45,
    thickness: 0.05,
    ior: 1.54,
    transparent: true,
    opacity: 0.92,
    attenuationColor: new THREE.Color(0x2a1050),
    attenuationDistance: 0.06,
  })

  const weights = []
  const WEIGHT_SPEC = [
    { x: -0.058, len: 0.088, girth: 0.019, hang: 0.2 },
    { x: -0.03, len: 0.07, girth: 0.015, hang: 0.31 },
  ]

  for (const spec of WEIGHT_SPEC) {
    const carrier = new THREE.Group()
    carrier.position.set(spec.x, -spec.hang, 0)
    body.add(carrier)

    const stone = new THREE.Mesh(crystal(spec.len, spec.girth), crystalMat)
    stone.rotation.y = rnd(0, TAU)
    stone.rotation.z = rnd(-0.06, 0.06)
    stone.castShadow = true
    carrier.add(stone)

    // The wrap. Three or four turns that do not agree with each other: one
    // sits square, one rides up over the shoulder, one has slipped down the
    // taper and is going to keep slipping. A neat cage would be jewellery.
    const turns = q > 0.6 ? 4 : 3
    for (let i = 0; i < turns; i++) {
      const y = spec.len * (0.3 - i * 0.19) + rnd(-0.006, 0.006)
      const tilt = rnd(-0.34, 0.34)
      const r = spec.girth * rnd(1.04, 1.14)
      const pts = []
      for (let k = 0; k <= 10; k++) {
        const a = (k / 10) * TAU
        pts.push(new THREE.Vector3(Math.cos(a) * r, y + Math.sin(a) * r * Math.sin(tilt), Math.sin(a) * r * Math.cos(tilt)))
      }
      const wrap = new THREE.Mesh(
        ensureColors(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), detail(14), 0.0011, 3, true)),
        goldMat,
      )
      carrier.add(wrap)
    }

    // The working end, knotted off at the top where it meets the hanging chain.
    const knot = new THREE.Mesh(ensureColors(new THREE.TorusKnotGeometry(0.004, 0.0011, 20, 3)), goldMat)
    knot.position.y = spec.len * 0.48
    carrier.add(knot)

    // A tail of chain left over, because nobody cuts it to length.
    const tail = cable(
      [
        [0, spec.len * 0.46, 0],
        [spec.girth * 0.9, spec.len * 0.3, spec.girth * 0.4],
        [spec.girth * 1.1, spec.len * 0.12, spec.girth * 0.1],
      ],
      { radius: 0.0011, material: goldMat, segments: 10 },
    )
    carrier.add(tail)

    // The chain up to the barrel. Rebuilt as the weight falls, which is the
    // only geometry in this prop that changes.
    const chainGeo = ensureColors(new THREE.CylinderGeometry(0.0012, 0.0012, 1, 3, 1, true))
    const chain = new THREE.Mesh(chainGeo, goldMat)
    body.add(chain)

    weights.push({ carrier, chain, spec, fall: rnd(0, FALL * 0.7), winding: 0 })
  }

  function layChain(w) {
    const top = -0.03 // the barrel's local y
    const y = -w.spec.hang - w.fall + w.spec.len * 0.5
    const len = Math.max(0.004, top - y)
    w.chain.scale.y = len
    w.chain.position.set(w.spec.x, y + len / 2, 0)
    w.carrier.position.y = -w.spec.hang - w.fall
  }
  for (const w of weights) layChain(w)

  // --- interaction ----------------------------------------------------------

  const hit = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.26, 0.08), new THREE.MeshBasicMaterial())
  hit.material.visible = false
  hit.position.copy(dial.position)
  body.add(hit)

  let winding = 0

  const wind = () => {
    if (winding > 0) return
    winding = 2.6
    for (const w of weights) w.winding = w.fall
    sfx?.play('latch')
    sfx?.bowl?.({ base: 392, dur: 2.4, gain: 0.045 })
  }

  // --- time -----------------------------------------------------------------
  // Read the host clock once. Constructing a Date every frame to move a hand
  // three ten-thousandths of a degree is not a trade anybody should take.

  const now = new Date()
  let seconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()

  function update(dt, t) {
    seconds += dt

    // The minute hand steps; the hour hand creeps. That difference is most of
    // what makes a clock face look like a movement rather than a gauge.
    const minutes = Math.floor(seconds / 60)
    minHand.group.rotation.z = Math.PI / 2 - (minutes % 60) * (TAU / 60)
    hourHand.group.rotation.z = Math.PI / 2 - ((seconds / 3600) % 12) * (TAU / 12)

    for (const w of wheels) w.mesh.rotation.z += w.rate * dt

    if (winding > 0) {
      winding = Math.max(0, winding - dt)
      const k = 1 - winding / 2.6
      for (const w of weights) {
        w.fall = w.winding * (1 - k)
        layChain(w)
      }
      // The train runs backwards and fast while somebody is winding it.
      for (const w of wheels) w.mesh.rotation.z -= w.rate * dt * 26
    } else {
      for (const w of weights) {
        w.fall += dt * 0.0016
        if (w.fall > FALL) w.fall = FALL
        layChain(w)
      }
    }

    // The two tips breathe, very slightly, and not together.
    minHand.glow.userData.setIntensity(0.85 + Math.sin(t * 0.9) * 0.15)
    hourHand.glow.userData.setIntensity(0.8 + Math.sin(t * 0.7 + 2.1) * 0.14)
  }

  return {
    group,
    update,
    interactives: [
      {
        object: hit,
        label: 'The clock',
        hint: () => (winding > 0 ? 'Winding' : 'Wind it'),
        onClick: wind,
      },
    ],
    dispose() {
      crystalMat.dispose()
    },
  }
}
