// clock.js — the weight-driven skeleton clock on the back wall.
//
// No plates and no dial. A narrow vertical spine, rounded-end bridges reaching
// out to each arbor, and the train stacked up that spine where all of it is
// visible at once. At the bottom hangs a bare ring — no numerals, twelve small
// petals cut into the band — and the hands float a few millimetres in front of
// it with nothing behind them but open gearing. A dial would hide the only
// thing worth modelling.
//
// What it hangs on: two quartz chunks, cleaved rather than cut, carrying a
// little violet light of their own. Their cords are thin and nearly black on
// purpose. An earlier pass wrapped them in gold chain and the room's neon
// turned every turn of it into a hot pink line readable from the desk.
//
// The entire lit surface of the prop is the last two millimetres of each hand.

import * as THREE from 'three'
import { MAT, PALETTE, box, cyl, cable, glowSprite, ensureColors, edgeDirt } from './materials.js'

const TAU = Math.PI * 2
const rnd = (a, b) => a + Math.random() * (b - a)

const RING_OUT = 0.085 // 170mm across, and 10mm of that is band
const RING_IN = 0.0745
const DROP = 0.2 // ring centre below the wall mount

// The prop is built in flat layers so nothing has to be depth-sorted: spine at
// the back, train in front of it, bridges in front of that, ring, then hands.
const SPINE_Z = -0.0105
const WHEEL_Z = -0.004
const BRIDGE_Z = 0.002
const RING_Z = 0.01
const MARK_Z = 0.0138
const CORD_TOP = -0.083 // the eyelets under the ring, where the weights hang

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

/** A bar with half-round ends, running from the origin along +x. The frame is
 *  nothing but these: every arbor gets one reaching out to it. */
function stadium(len, half, depth, segments) {
  const s = new THREE.Shape()
  s.moveTo(0, half)
  s.lineTo(len, half)
  s.absarc(len, 0, half, Math.PI / 2, -Math.PI / 2, true)
  s.lineTo(0, -half)
  s.absarc(0, 0, half, -Math.PI / 2, Math.PI / 2, true)
  return edgeDirt(new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: segments }), 0.12)
}

/**
 * A wheel with a finely serrated rim and a web cut away to three or four
 * spokes, each opening a petal. The first pass at this left too much web and
 * the great wheel read as a flower cut into a disc — which is a dial, which is
 * the one thing this clock is not allowed to have. The openings have to win.
 */
function lotusWheel(radius, teeth, spokes, detail) {
  const shape = new THREE.Shape()
  const root = radius * 0.965
  const tip = radius * 1.035
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * TAU
    const b = ((i + 0.5) / teeth) * TAU
    shape[i === 0 ? 'moveTo' : 'lineTo'](Math.cos(a) * root, Math.sin(a) * root)
    shape.lineTo(Math.cos(b) * tip, Math.sin(b) * tip)
  }

  // Each opening is a petal sampled along its length rather than drawn with
  // two arcs: at this width the arc version bulges past its own tips.
  const steps = Math.max(7, detail * 2)
  const r0 = radius * 0.26
  const r1 = radius * 0.86
  const w = (Math.PI / spokes) * 0.82
  const at = (u, sign) => {
    const r = r0 + (r1 - r0) * u
    return { r, d: sign * w * Math.sin(Math.PI * u) ** 0.75 }
  }
  for (let i = 0; i < spokes; i++) {
    const a = (i / spokes) * TAU + Math.PI / 2
    const hole = new THREE.Path()
    for (let s = 0; s <= steps; s++) {
      const p = at(s / steps, 1)
      const x = Math.cos(a + p.d) * p.r
      const y = Math.sin(a + p.d) * p.r
      s === 0 ? hole.moveTo(x, y) : hole.lineTo(x, y)
    }
    for (let s = steps - 1; s >= 1; s--) {
      const p = at(s / steps, -1)
      hole.lineTo(Math.cos(a + p.d) * p.r, Math.sin(a + p.d) * p.r)
    }
    shape.holes.push(hole)
  }
  const arbor = new THREE.Path()
  arbor.absarc(0, 0, radius * 0.12, 0, TAU, true)
  shape.holes.push(arbor)

  return edgeDirt(
    new THREE.ExtrudeGeometry(shape, { depth: 0.0035, bevelEnabled: false, curveSegments: Math.max(6, detail * 2) }),
    0.16,
  )
}

export function createClock({ sfx = null, quality = 1 } = {}) {
  const q = THREE.MathUtils.clamp(quality, 0.35, 1)
  const detail = (n) => Math.max(3, Math.round(n * q))

  const group = new THREE.Group()

  const frameMat = MAT.wood(0x2b1f15) // walnut, matte enough to stay a silhouette
  const ringMat = MAT.wood(0x3a2a1c)
  const brassMat = MAT.metal(0x745a2e, 0.66)
  const steelMat = MAT.metal(0x2f2b36, 0.54)
  const bracketMat = MAT.paint(0x1a1622, { rough: 0.6, metal: 0.35 })
  const podMat = MAT.metal(0x574021, 0.66)
  // Nothing on the suspension is allowed to catch the neon. Non-metal, nearly
  // black, very rough — the cords should read as absence, not as line work.
  const cordMat = MAT.paint(0x140f0b, { rough: 0.94, metal: 0.04 })
  const chainMat = MAT.metal(0x2a2018, 0.8)

  // --- the bracket ----------------------------------------------------------
  // Two slim cantilever arms off a strip on the wall, as on a skeleton clock:
  // the movement stands proud of the plaster so the wall reads behind it.

  const backPlate = box(0.026, 0.14, 0.006, bracketMat, { dirt: 0.2 })
  backPlate.position.set(0, -0.077, 0.004)
  group.add(backPlate)

  for (const y of [-0.024, -0.13]) {
    const arm = cyl(0.0045, 0.0045, 0.031, bracketMat, detail(8))
    arm.rotation.x = Math.PI / 2
    arm.position.set(0, y, 0.0225)
    group.add(arm)
  }

  // Everything below hangs off this. Its origin is the ring centre, which is
  // also the hand arbor — every measurement in the prop is taken from there.
  const body = new THREE.Group()
  body.position.set(0, -DROP, 0.052)
  group.add(body)

  // --- the frame ------------------------------------------------------------

  // The spine runs from the top bracket down behind the great wheel, where the
  // wheel hides its end. It never crosses the lower half of the ring, so you
  // look straight through the ring at nothing but gears.
  const spine = box(0.019, 0.154, 0.007, frameMat, { dirt: 0.22 })
  spine.position.set(0, 0.107, SPINE_Z)
  body.add(spine)

  // --- the train ------------------------------------------------------------

  // Stacked up the spine rather than huddled behind a dial, and zig-zagged so
  // consecutive arbors sit either side of it. Centre distances are exactly
  // r+r: meshing wheels turn in opposite directions at speeds inversely
  // proportional to their radii, and getting that backwards is the single most
  // noticeable way a modelled clock reads as fake.
  // Nothing reaches past the ring's own half-width, so the whole prop stays one
  // column — a wheel that clears that line reads as an ornament stuck on.
  // The great wheel is the dark one on purpose: it sits in the ring opening,
  // and a pale wheel filling that hole is a dial by another name.
  const TRAIN = [
    { r: 0.052, teeth: 40, spokes: 4, x: 0, y: 0, spin: 1 / 75, mat: steelMat },
    { r: 0.03, teeth: 23, spokes: 4, x: 0.028, y: 0.0771, mat: brassMat },
    { r: 0.0225, teeth: 17, spokes: 3, x: -0.0021, y: 0.1201, mat: steelMat },
    { r: 0.0165, teeth: 13, spokes: 3, x: 0.0162, y: 0.1545, mat: brassMat },
  ]

  const wheels = []
  TRAIN.forEach((w, i) => {
    const mesh = new THREE.Mesh(lotusWheel(w.r, w.teeth, w.spokes, detail(6)), w.mat)
    // Half a millimetre of stagger. Coplanar wheels z-fight across the little
    // lens of overlap where their teeth mesh.
    mesh.position.set(w.x, w.y, WHEEL_Z + (i % 2 ? 0.0006 : -0.0006))
    mesh.castShadow = true
    body.add(mesh)
    const prev = wheels[i - 1]
    const rate = i === 0 ? w.spin * TAU : -prev.rate * (TRAIN[i - 1].r / w.r)
    wheels.push({ mesh, rate })
  })

  // A bridge per arbor, each one hung off a pillar a centimetre down the spine
  // so it arrives at its wheel on the slant instead of squaring off like a
  // ladder rung. The great wheel's is the long one: it carries on past the
  // wheel to the ring centre and becomes the cock the hands pivot in.
  const BRIDGES = [
    { from: 0.05, x: 0, y: 0, half: 0.0052 },
    { from: 0.0651, x: 0.028, y: 0.0771, half: 0.0045 },
    { from: 0.1081, x: -0.0021, y: 0.1201, half: 0.004 },
    { from: 0.1425, x: 0.0162, y: 0.1545, half: 0.0036 },
  ]

  for (const b of BRIDGES) {
    const len = Math.max(0.01, Math.hypot(b.x, b.y - b.from))
    const bar = new THREE.Mesh(stadium(len, b.half, 0.004, detail(7)), frameMat)
    bar.position.set(0, b.from, BRIDGE_Z)
    bar.rotation.z = Math.atan2(b.y - b.from, b.x)
    bar.castShadow = true
    body.add(bar)

    // Four pillars, same as before, only now they space the bridges off the
    // spine instead of holding two plates apart.
    const pillar = cyl(0.0028, 0.0028, 0.009, brassMat, detail(6))
    pillar.rotation.x = Math.PI / 2
    pillar.position.set(0, b.from, -0.0025)
    body.add(pillar)
  }

  for (const w of TRAIN) {
    const pin = cyl(0.0016, 0.0016, w.r > 0.05 ? 0.024 : 0.013, brassMat, detail(6))
    pin.rotation.x = Math.PI / 2
    pin.position.set(w.x, w.y, w.r > 0.05 ? 0.005 : -0.0005)
    body.add(pin)
  }

  // --- the ring -------------------------------------------------------------

  const ringShape = new THREE.Shape()
  ringShape.absarc(0, 0, RING_OUT, 0, TAU, false)
  const ringHole = new THREE.Path()
  ringHole.absarc(0, 0, RING_IN, 0, TAU, true)
  ringShape.holes.push(ringHole)

  const ring = new THREE.Mesh(
    edgeDirt(new THREE.ExtrudeGeometry(ringShape, { depth: 0.0038, bevelEnabled: false, curveSegments: detail(48) }), 0.1),
    ringMat,
  )
  ring.position.z = RING_Z
  ring.castShadow = true
  ring.receiveShadow = true
  body.add(ring)

  // Twelve marks cut into the band, the four cardinals longer, because a clock
  // you read by shape needs the quarters findable without counting. A trace of
  // the lotus rather than a lotus dial: they live on the band and leave the
  // opening alone.
  const markMat = MAT.metal(0x4e412a, 0.62)
  const cardinalMat = MAT.metal(0x7a6338, 0.55)
  const markGeo = ensureColors(
    new THREE.ExtrudeGeometry(petalShape(RING_IN + 0.003, RING_OUT - 0.0028, 0.0021), {
      depth: 0.0014,
      bevelEnabled: false,
      curveSegments: detail(5),
    }),
  )
  const cardinalGeo = ensureColors(
    new THREE.ExtrudeGeometry(petalShape(RING_IN + 0.0012, RING_OUT - 0.0012, 0.003), {
      depth: 0.0014,
      bevelEnabled: false,
      curveSegments: detail(5),
    }),
  )
  for (let i = 0; i < 12; i++) {
    const cardinal = i % 3 === 0
    const mark = new THREE.Mesh(cardinal ? cardinalGeo : markGeo, cardinal ? cardinalMat : markMat)
    mark.rotation.z = (i / 12) * TAU
    mark.position.z = MARK_Z
    body.add(mark)
  }

  // Two eyelets under the band. The weights hang off the ring itself, which is
  // where the cords come from on every skeleton clock worth copying.
  const eyeGeo = ensureColors(new THREE.TorusGeometry(0.0026, 0.0009, 3, detail(10)))
  for (const x of [-0.03, 0.03]) {
    const eye = new THREE.Mesh(eyeGeo, chainMat)
    eye.position.set(x, -0.08, RING_Z + 0.0019)
    body.add(eye)
  }

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

  // The minute hand just reaches the band; the hour hand stops out over the
  // great wheel. Both stand clear of the ring so they read as floating.
  const hourHand = makeHand(0.05, 0.0046, PALETTE.pink, 0.006)
  const minHand = makeHand(0.077, 0.0034, PALETTE.violet, 0.0065)
  hourHand.group.position.z = 0.017
  minHand.group.position.z = 0.0192
  body.add(hourHand.group, minHand.group)

  // The lotus seed pod goes on last, over the roots of both hands. Under them
  // it just reads as a disc with a wedge bitten out of it; over them the hands
  // emerge from beneath it the way they do on a real clock.
  const seedPod = new THREE.Mesh(ensureColors(new THREE.CircleGeometry(0.01, detail(12))), podMat)
  seedPod.position.z = 0.0212
  body.add(seedPod)

  // --- the weights ----------------------------------------------------------

  /**
   * A cleaved chunk, not a gem. A low icosahedron with every corner shoved out
   * by a different amount and the whole thing drawn out along the hang, left
   * flat shaded so it is all hard facets meeting at hard edges.
   */
  function crystal(len, girth, rough) {
    const geo = new THREE.IcosahedronGeometry(1, 0)
    const pos = geo.attributes.position
    // The solid arrives non-indexed, so a corner turns up once per face that
    // touches it. Key the perturbation on the position or the faces tear open.
    const corners = new Map()
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = pos.getZ(i)
      const key = `${Math.round(x * 1e3)},${Math.round(y * 1e3)},${Math.round(z * 1e3)}`
      let k = corners.get(key)
      if (k === undefined) {
        k = 1 + rnd(-rough, rough)
        corners.set(key, k)
      }
      pos.setXYZ(i, x * girth * k, y * len * 0.5 * k, z * girth * k)
    }
    const g = geo.index ? geo.toNonIndexed() : geo
    g.computeVertexNormals()
    return ensureColors(g)
  }

  // Transmission plus a trace of emissive: lit from the room and from inside,
  // faintly. No glow sprite — the halo layer is thirteen times its emitter and
  // two of them would out-shout the hand tips from across the room.
  const crystalMat = new THREE.MeshPhysicalMaterial({
    color: 0x241539,
    roughness: 0.5, // cleaved quartz is not polished quartz
    metalness: 0,
    transmission: 0.45,
    thickness: 0.045,
    ior: 1.54,
    transparent: true,
    opacity: 0.8,
    emissive: new THREE.Color(PALETTE.violet),
    emissiveIntensity: 0.045,
    attenuationColor: new THREE.Color(0x2a1050),
    attenuationDistance: 0.035,
  })

  // Two stones, one cord, one barrel — so they are not two falling weights,
  // they are the two ends of the same cord. The heavy one pays out and the
  // light one is hauled up by exactly as much. `dir` is which end each is.
  const weights = []
  const WEIGHT_SPEC = [
    { x: -0.03, len: 0.086, girth: 0.017, hang: 0.14, rough: 0.45, dir: 1 },
    { x: 0.03, len: 0.068, girth: 0.0145, hang: 0.205, rough: 0.34, dir: -1 },
  ]

  // A full run swaps the two hangs: each stone finishes where the other
  // started. Not symmetry for its own sake — it is the one travel that needs
  // no bounds arithmetic of its own, because the pair then never leave the
  // 65mm band between the two hang values, and both of those were already
  // picked clear of everything. So the climbing stone tops out at -0.099,
  // lower than the heavy one already sits at rest (-0.085, against eyelets at
  // -0.083), and the descending one bottoms out at -0.261, 115mm shallower
  // than the old free-fall reached. The old one-way 0.13 does not survive the
  // coupling: run upward it puts the light stone's crown at -0.034, up through
  // the eyelets and inside the ring opening.
  const FALL = Math.abs(WEIGHT_SPEC[1].hang - WEIGHT_SPEC[0].hang)

  // One number for the pair, for the same reason. Part-run at build so the
  // clock is not freshly wound every time the room loads.
  let travel = rnd(0, FALL * 0.7)

  for (const spec of WEIGHT_SPEC) {
    const carrier = new THREE.Group()
    carrier.position.set(spec.x, -spec.hang, 0)
    body.add(carrier)

    const stone = new THREE.Mesh(crystal(spec.len, spec.girth, spec.rough), crystalMat)
    stone.rotation.y = rnd(0, TAU)
    stone.rotation.z = rnd(-0.09, 0.09)
    stone.rotation.x = rnd(-0.07, 0.07)
    stone.castShadow = true
    carrier.add(stone)

    // The wrap. Three or four turns that do not agree with each other: one
    // sits square, one rides up over the shoulder, one has slipped down the
    // taper and is going to keep slipping. A neat cage would be jewellery.
    const turns = q > 0.6 ? 3 : 2
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
        ensureColors(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), detail(14), 0.0009, 3, true)),
        chainMat,
      )
      carrier.add(wrap)
    }

    // The working end, knotted off at the top where it meets the cord.
    const knot = new THREE.Mesh(ensureColors(new THREE.TorusKnotGeometry(0.0035, 0.0009, 20, 3)), chainMat)
    knot.position.y = spec.len * 0.48
    carrier.add(knot)

    // A tail of chain left over, because nobody cuts it to length.
    const tail = cable(
      [
        [0, spec.len * 0.46, 0],
        [spec.girth * 0.9, spec.len * 0.3, spec.girth * 0.4],
        [spec.girth * 1.1, spec.len * 0.12, spec.girth * 0.1],
      ],
      { radius: 0.0009, material: chainMat, segments: 10 },
    )
    carrier.add(tail)

    // The cord up to the eyelet. Rebuilt as the weight moves, which is the
    // only geometry in this prop that changes.
    const cordGeo = ensureColors(new THREE.CylinderGeometry(0.0008, 0.0008, 1, 3, 1, true))
    const cord = new THREE.Mesh(cordGeo, cordMat)
    body.add(cord)

    weights.push({ carrier, cord, spec })
  }

  // Laid downward from the fixed eyelet to wherever the stone is now, rather
  // than grown from a rest length, so it takes a stone travelling up as
  // readily as one travelling down. The climbing stone's cord bottoms out at
  // 23mm, still longer than the heavy one's 14mm at rest, so nothing here ever
  // reaches the 4mm floor or inverts.
  function layCord(w) {
    const drop = w.spec.dir * travel
    const y = -w.spec.hang - drop + w.spec.len * 0.5
    const len = Math.max(0.004, CORD_TOP - y)
    w.cord.scale.y = len
    w.cord.position.set(w.spec.x, y + len / 2, 0)
    w.carrier.position.y = -w.spec.hang - drop
  }
  for (const w of weights) layCord(w)

  // --- interaction ----------------------------------------------------------

  // Sized to the new silhouette: the ring at the bottom, the gear column above
  // it, and nothing wider than the ring anywhere.
  const hit = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.34, 0.075), new THREE.MeshBasicMaterial())
  hit.material.visible = false
  hit.position.set(0, 0.04, 0.004)
  body.add(hit)

  const WIND_TIME = 2.6
  let winding = 0
  let windFrom = 0

  const wind = () => {
    if (winding > 0) return
    winding = WIND_TIME
    windFrom = travel
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
    // what makes a clock look like a movement rather than a gauge.
    const minutes = Math.floor(seconds / 60)
    minHand.group.rotation.z = Math.PI / 2 - (minutes % 60) * (TAU / 60)
    hourHand.group.rotation.z = Math.PI / 2 - ((seconds / 3600) % 12) * (TAU / 12)

    for (const w of wheels) w.mesh.rotation.z += w.rate * dt

    if (winding > 0) {
      winding = Math.max(0, winding - dt)
      // The barrel turns the other way, so the pair reverse together: the heavy
      // stone is hauled back up and the light one pays back down.
      travel = windFrom * (winding / WIND_TIME)
      for (const w of weights) layCord(w)
      // The train runs backwards and fast while somebody is winding it.
      for (const w of wheels) w.mesh.rotation.z -= w.rate * dt * 26
    } else {
      // Clamped at the top of the run, not just tested, so an hour of idle
      // cannot walk either stone out of the band the hangs define.
      travel = Math.min(FALL, travel + dt * 0.0016)
      for (const w of weights) layCord(w)
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
      // Everything else in here is either a MAT.* cache entry or a geometry
      // hanging off the group, and the scene's disposeAll sweeps those.
      crystalMat.dispose()
      hit.material.dispose()
      hit.geometry.dispose()
    },
  }
}
