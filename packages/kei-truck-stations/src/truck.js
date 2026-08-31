import * as THREE from 'three'
import { materials } from './materials.js'
import { T, X, TRUCK_MM } from './specs.js'
import { mm, slab, rod, profile, roundedSlab, lathe, hingeLine, taperByHeight, smoothstep, quad, piecewise } from './build.js'

// ---------------------------------------------------------------------------
// The truck
//
// Built in BED-X / GROUND-Y coordinates: x is the same axis the modules use
// (0 at the centre of the cargo deck, +X toward the cab), y is measured from
// the tarmac, z is lateral with +Z to the driver's right. So the deck surface
// is the plane y = T.deckH, and a module sitting at bed-origin is just this
// group with a 655 mm lift.
//
// HOW THE CAB IS BUILT, because it is the one non-obvious decision here.
//
// A cab-over kei cab is a shell with a big hole in the front. So rather than
// stacking boxes, the cab body is ONE extrusion of its side silhouette across
// the cab width — and the windshield aperture is part of that silhouette's
// outline, not a box laid on top. Follow the outline up the front panel, back
// along the windscreen rake, along the roof, down the rear: the glass opening
// is simply the piece of outline you didn't draw. The A-pillars are then two
// thin members bridging that rake at the extreme left and right, exactly as
// they are on the truck. The side windows are a hole in the same silhouette,
// which extrudes into a lateral tunnel through the cab — which is what a pair
// of opposite side windows physically is.
//
// The wheel arch is a notch in the bottom of that same outline, so the arch
// radius and the tyre radius are related by construction rather than by eye.
//
// THE GATES ARE NOT BUILT HERE. A kei truck's three-way-open bed is the first
// mechanism of every module — the sides drop and become the deck edge, the
// deck rail, or nothing at all, depending on the station. So the gates are
// handed out as geometry (`gateGeometry`) and each station's rig owns them as
// hinged parts, which means the collision audit checks them like everything
// else instead of treating them as scenery.
// ---------------------------------------------------------------------------

// The cab's widest point across the shoulders, and where its faces sit.
const CAB_W = T.bodyW
const SILL = T.sill
const ARCH_R = T.tyreR + mm(60) // arch clears the tyre with 60 mm of bump travel
const WS_BASE_X = X.nose - T.windshieldSetback // windscreen base, 190 mm back
const ROOF_FRONT = WS_BASE_X - (T.roofFront - T.windshieldBase) * Math.tan(T.windshieldRake)

/**
 * The cab's tumblehome: how much narrower it is at a given height.
 *
 * 1.0 across the shoulders, falling to roofW/bodyW at the header, with a small
 * tuck under the sill where the rocker rolls inward. Applied to the extruded
 * silhouette after the fact — see taperByHeight().
 */
function tumble(y) {
  const up = smoothstep(T.beltline, T.roofFront, y)
  const under = smoothstep(mm(520), mm(300), y)
  return 1 - (1 - T.roofW / T.bodyW) * up - 0.06 * under
}

/**
 * The x of the front face at a given height — the nose is raked and convex, so
 * anything applied to it (grille, lamps, plate) has to ask where the face is
 * rather than assume a plane.
 */
const faceX = piecewise([
  [mm(300), X.nose - mm(40)],
  [mm(380), X.nose - mm(8)],
  [mm(470), X.nose],
  [T.bumperTop, X.nose - mm(10)],
  [mm(700), X.nose - mm(30)],
  [mm(870), X.nose - mm(90)],
  [T.windshieldBase, WS_BASE_X],
])

export function buildTruck() {
  const lib = materials()
  const group = new THREE.Group()
  group.name = 'truck'

  group.add(chassis(lib))
  group.add(cab(lib))
  group.add(bed(lib))
  group.add(wheels(lib))

  return {
    group,
    /** Geometry for the drop-side gates, authored about their hinge lines. */
    gateGeometry: {
      side: () => sideGate(lib),
      tail: () => tailGate(lib),
    },
    /** Where each gate's hinge line sits, in BED coordinates. */
    gateHinge: {
      side: (sign) => [0, 0, sign * (T.bedWid / 2 + T.gate / 2)],
      tail: [-(T.bedLen / 2 + T.gate / 2), 0, 0],
    },
    /** Static collision hulls for the parts of the truck a module can hit. */
    hulls: truckHulls(),
  }
}

// --- chassis ---------------------------------------------------------------

function chassis(lib) {
  const g = new THREE.Group()
  g.name = 'chassis'

  // Ladder frame. Rails 580 mm apart on centres — narrow, because the whole
  // point of a kei frame is to leave the maximum deck width outboard of it.
  const railZ = mm(290)
  const railTop = T.deckH - mm(55)
  const railH = mm(95)
  const railY = railTop - railH / 2
  for (const s of [-1, 1]) {
    g.add(slab([X.nose - mm(120) - X.rear, railH, mm(45)], lib.frame, { pos: [(X.nose - mm(120) + X.rear) / 2, railY, s * railZ] }))
  }
  // Crossmembers: under the headboard, over the rear axle, at the tail.
  for (const x of [X.bedFrontOuter - mm(60), X.axleRear, X.bedRearOuter + mm(70), mm(300)]) {
    g.add(slab([mm(55), mm(60), railZ * 2], lib.frame, { pos: [x, railY, 0] }))
  }

  // Rear beam axle with leaf springs. The springs are the reason a fold-out
  // module needs jacks: the truck rocks on them the moment anyone steps on a
  // deployed deck, and no amount of structure in the module fixes that.
  g.add(rod([X.axleRear, T.tyreR, -T.trackRear / 2], [X.axleRear, T.tyreR, T.trackRear / 2], mm(32), lib.frame))
  const diff = lathe([[0, -mm(90)], [mm(100), -mm(55)], [mm(110), 0], [mm(100), mm(55)], [0, mm(90)]], lib.frame, { seg: 16 })
  diff.rotation.x = Math.PI / 2 // a lathe spins about Y; the axle runs along Z
  diff.position.set(X.axleRear, T.tyreR, 0)
  g.add(diff)
  for (const s of [-1, 1]) {
    const z = s * mm(430)
    for (let leaf = 0; leaf < 3; leaf++) {
      const half = mm(360) - leaf * mm(55)
      const y = T.tyreR + mm(46) + leaf * mm(9)
      g.add(slab([half * 2, mm(8), mm(52)], lib.frame, { pos: [X.axleRear, y, z] }))
    }
    g.add(slab([mm(22), mm(90), mm(30)], lib.frame, { pos: [X.axleRear - mm(360), T.tyreR + mm(85), z] }))
    g.add(slab([mm(22), mm(90), mm(30)], lib.frame, { pos: [X.axleRear + mm(360), T.tyreR + mm(85), z] }))
  }

  // Front axle tie bar.
  g.add(rod([X.axleFront, T.tyreR, -T.trackFront / 2 + mm(60)], [X.axleFront, T.tyreR, T.trackFront / 2 - mm(60)], mm(24), lib.frame))

  // Propshaft: the Hijet carries its engine under the seat and drives the rear
  // wheels, so there is a shaft down the middle and it is visible from the side.
  g.add(rod([X.axleRear + mm(60), T.tyreR + mm(70), 0], [mm(900), T.deckH - mm(190), 0], mm(21), lib.frame))

  // Fuel tank left of the frame under the deck; exhaust and silencer right.
  g.add(roundedSlab(mm(520), mm(230), mm(300), mm(40), lib.galv, { pos: [mm(250), railY - mm(10), mm(-410)] }))
  g.add(rod([mm(880), T.deckH - mm(230), mm(160)], [mm(-80), T.deckH - mm(250), mm(300)], mm(19), lib.galv))
  g.add(roundedSlab(mm(420), mm(130), mm(180), mm(55), lib.galv, { pos: [mm(-260), T.deckH - mm(255), mm(320)] }))
  g.add(rod([mm(-470), T.deckH - mm(255), mm(320)], [X.rear + mm(30), T.deckH - mm(240), mm(390)], mm(17), lib.galv))

  // Spare wheel, slung under the deck ahead of the rear axle.
  const spare = new THREE.Mesh(new THREE.CylinderGeometry(T.tyreR * 0.94, T.tyreR * 0.94, T.tyreW, 20), lib.tire)
  spare.position.set(mm(430), T.deckH - mm(215), mm(240))
  spare.castShadow = true
  g.add(spare)

  return g
}

// --- cab -------------------------------------------------------------------

/**
 * The side silhouette of the cab, in (x, y), walked as an explicit loop:
 * front valance, raked nose, windscreen aperture, crowned roof, rear panel,
 * sill, wheel arch, and back to the start.
 *
 * The windscreen is the piece of outline that ISN'T drawn — the walk jumps
 * straight from the cowl to the header, leaving an aperture that the glass and
 * the A-pillars then fill. And the nose is a chain of short segments rather
 * than one plane, because a kei front is convex: it bulges out at bumper height
 * and falls away above and below.
 */
function cabOutline() {
  const p = []
  const push = (x, y) => p.push([x, y])

  push(X.nose - mm(40), mm(300)) //          bottom of the front valance
  push(X.nose - mm(8), mm(380))
  push(X.nose, mm(470)) //                   the nose-most point of the truck
  push(X.nose - mm(10), T.bumperTop)
  push(X.nose - mm(30), mm(700))
  push(X.nose - mm(90), mm(870))
  push(WS_BASE_X, T.windshieldBase) //       cowl: the base of the glass
  push(ROOF_FRONT, T.roofFront) //           header: the top of it, 29.6 deg back
  push(ROOF_FRONT - mm(200), mm(1762)) //    roof, crowning up over the seats
  push(X.cabRear + mm(320), T.H)
  push(X.cabRear + mm(70), T.H - mm(8))
  push(X.cabRear, T.H - mm(80)) //           rear roof radius
  push(X.cabRear, SILL) //                   straight down the back panel

  // Wheel arch: an arc of ARCH_R about the front axle centre, entered and left
  // at its exact intersection with the sill so the arch is a true circular cut.
  const cy = T.tyreR
  const dx = Math.sqrt(Math.max(0, ARCH_R * ARCH_R - (SILL - cy) * (SILL - cy)))
  const a0 = Math.acos(-dx / ARCH_R)
  push(X.axleFront - dx, SILL)
  for (let i = 0; i <= 14; i++) {
    const ang = a0 + (i / 14) * (Math.PI - 2 * a0) // a0 -> pi - a0, over the top
    push(X.axleFront + Math.cos(ang) * ARCH_R, cy + Math.sin(ang) * ARCH_R)
  }
  push(X.axleFront + dx, SILL)
  push(X.nose - mm(40), SILL) //             sill forward to the valance
  return p
}

/**
 * The side-window aperture, as a hole in the same silhouette.
 *
 * Its front edge is RAKED, parallel to the A-pillar and inset behind it. That is
 * how the real window is shaped, and it is also the only way the hole fits: a
 * rectangle reaching the same x at the top would punch straight out through the
 * windscreen rake, because the cab gets shorter the higher you go.
 */
function windowHole() {
  const pillarX = (y) => WS_BASE_X - (y - T.windshieldBase) * Math.tan(T.windshieldRake)
  const inset = mm(70)
  const x0 = X.cabRear + mm(80) // rear edge, 80 mm of body behind it
  const y0 = T.beltline
  const y1 = T.windowTop
  const xf0 = pillarX(y0) - inset
  const xf1 = pillarX(y1) - inset
  const r = mm(50)
  return [
    [x0, y0 + r],
    [x0 + r, y0],
    [xf0 - r, y0],
    [xf0, y0 + r * 0.8],
    [xf1, y1 - r * 0.8],
    [xf1 - r, y1],
    [x0 + r, y1],
    [x0, y1 - r],
  ]
}

function cab(lib) {
  const g = new THREE.Group()
  g.name = 'cab'
  const halfW = CAB_W / 2

  // The shell: one extrusion, windscreen aperture in the outline, side windows
  // as a lateral tunnel, then squeezed into its tumblehome.
  const shell = profile(cabOutline(), CAB_W, lib.paint, { anchorZ: 0, holes: [windowHole()] })
  taperByHeight(shell.geometry, tumble)
  g.add(shell)

  // Interior, seen through the glass. Dark, low-detail, and entirely there to
  // stop the cab reading as a solid block at dusk.
  const dark = lib.trim
  const seatX = X.axleFront + mm(60)
  g.add(slab([mm(820), mm(30), CAB_W - mm(240)], dark, { pos: [seatX - mm(80), mm(620), 0] }))
  g.add(slab([mm(240), mm(150), CAB_W - mm(300)], dark, { pos: [WS_BASE_X - mm(190), mm(1060), 0] })) // dash
  for (const s of [-1, 1]) {
    g.add(slab([mm(430), mm(90), mm(440)], dark, { pos: [seatX - mm(120), mm(770), s * mm(330)] }))
    g.add(slab([mm(90), mm(500), mm(440)], dark, { pos: [seatX - mm(350), mm(1040), s * mm(330)] }))
  }
  const steering = new THREE.Mesh(new THREE.TorusGeometry(mm(150), mm(14), 8, 18), dark)
  steering.position.set(WS_BASE_X - mm(300), mm(1130), -mm(310))
  steering.rotation.set(Math.PI / 2 - 0.5, 0, 0)
  g.add(steering)

  // --- glass ---------------------------------------------------------------
  // The windscreen is a trapezoid, not a rectangle: the cab narrows with height,
  // so the glass narrows with it. Built from the same tumble() the shell uses.
  const gb = (halfW - mm(40)) * tumble(T.windshieldBase)
  const gt = (halfW - mm(40)) * tumble(T.roofFront)
  const bx = WS_BASE_X - mm(18)
  const tx = ROOF_FRONT - mm(14)
  g.add(quad(
    [bx, T.windshieldBase + mm(10), -gb],
    [bx, T.windshieldBase + mm(10), gb],
    [tx, T.roofFront - mm(20), gt],
    [tx, T.roofFront - mm(20), -gt],
    lib.glass,
  ))
  // A-pillars bridging the rake at each side, plus the header and cowl rails.
  for (const s of [-1, 1]) {
    g.add(rod([WS_BASE_X, T.windshieldBase, s * gb], [ROOF_FRONT, T.roofFront, s * gt], mm(34), lib.paint))
  }
  g.add(rod([ROOF_FRONT, T.roofFront, -gt], [ROOF_FRONT, T.roofFront, gt], mm(30), lib.paint))
  g.add(rod([WS_BASE_X, T.windshieldBase, -gb], [WS_BASE_X, T.windshieldBase, gb], mm(26), lib.paint))
  // Two wipers parked low across the glass, which is most of what says "cab".
  for (const s of [-1, 1]) {
    g.add(rod([bx - mm(14), T.windshieldBase + mm(30), s * mm(40)], [bx - mm(62), T.windshieldBase + mm(140), s * mm(480)], mm(8), lib.trim))
  }

  // Side glass, built from the very same polygon as the hole it fills, so the
  // two can never drift apart.
  for (const s of [-1, 1]) {
    const z = s * (halfW * tumble(mm(1350)) - mm(16))
    const pane = profile(windowHole(), mm(6), lib.glass, { anchorZ: 0 })
    pane.position.z = z
    g.add(pane)
    // A seal drawn as a slightly larger polygon behind the glass, so the
    // aperture reads as a window rather than as a hole punched in a box.
    const seal = profile(windowHole(), mm(4), lib.trim, { anchorZ: 0 })
    seal.scale.set(1.012, 1.012, 1)
    seal.position.set(-X.cabRear * 0.012 - mm(6), -T.beltline * 0.012, z + s * mm(6))
    g.add(seal)
  }

  // --- front face ----------------------------------------------------------
  // One wide grille band with the headlamps integrated at its outer ends, which
  // is how every modern kei truck's face is laid out. It is raked with the nose.
  const gy = (T.grilleTop + T.grilleBottom) / 2
  const gh = T.grilleTop - T.grilleBottom
  const noseRake = Math.atan2(faceX(mm(870)) - faceX(T.windshieldBase), T.windshieldBase - mm(870))
  const bandW = (halfW - mm(40)) * tumble(gy)
  const band = slab([mm(30), gh, bandW * 2], lib.trim, { pos: [faceX(gy) + mm(4), gy, 0] })
  band.rotation.z = -noseRake
  g.add(band)
  g.add(slab([mm(20), gh * 0.34, bandW * 1.55], lib.paintDark, { pos: [faceX(gy) + mm(12), gy, 0], rot: [0, 0, -noseRake] }))
  for (const s of [-1, 1]) {
    const z = s * (bandW - mm(150))
    const lamp = roundedSlab(mm(26), gh * 0.86, mm(300), mm(24), lib.headlamp)
    const lampMount = new THREE.Group()
    lampMount.position.set(faceX(gy) + mm(10), gy, z)
    lampMount.rotation.z = -noseRake
    lampMount.add(lamp)
    g.add(lampMount)
    const marker = new THREE.Mesh(new THREE.CylinderGeometry(mm(38), mm(38), mm(16), 14), lib.lampAmber)
    marker.rotation.z = Math.PI / 2 - noseRake
    marker.position.set(faceX(gy) + mm(16), gy, z - s * mm(105))
    g.add(marker)
  }

  // Bumper: body-coloured upper, black lower valance with its own grille, and
  // the plate offset to one side the way JDM plates are.
  const by = (T.bumperTop + T.bumperBottom) / 2
  const bw = (halfW - mm(10)) * tumble(by)
  g.add(roundedSlab(mm(70), T.bumperTop - T.bumperBottom, bw * 2, mm(26), lib.paint, { pos: [faceX(by) - mm(24), by, 0] }))
  g.add(slab([mm(40), mm(120), bw * 1.15], lib.bumper, { pos: [faceX(by) - mm(6), T.bumperBottom - mm(30), 0] }))
  g.add(slab([mm(24), mm(90), bw * 0.85], lib.trim, { pos: [faceX(by) + mm(12), by + mm(30), 0] }))
  g.add(slab([mm(12), mm(165), mm(330)], lib.chrome, { pos: [faceX(by) + mm(20), by - mm(10), mm(-250)] }))

  // Roof ribs — three raised strips, clearly visible head-on and the reason a
  // kei roof reads as pressed steel rather than as a slab.
  for (let i = -1; i <= 1; i++) {
    const rz = i * mm(340) * tumble(T.H)
    g.add(slab([mm(240), mm(14), mm(150)], lib.paint, { pos: [ROOF_FRONT - mm(150), T.H - mm(28), rz] }))
  }

  // --- sides ---------------------------------------------------------------
  for (const s of [-1, 1]) {
    const zBelt = s * (halfW * tumble(T.beltline) + mm(3))
    const zSill = s * (halfW * tumble(mm(700)) + mm(3))
    // Door shut lines.
    g.add(slab([mm(9), T.beltline - SILL, mm(6)], lib.trim, { pos: [X.doorFront, (SILL + T.beltline) / 2, zSill] }))
    g.add(slab([mm(9), T.windowTop - SILL, mm(6)], lib.trim, { pos: [X.cabRear + mm(45), (SILL + T.windowTop) / 2, zBelt] }))
    // Handle, near the rear of a front-hinged door.
    g.add(slab([mm(130), mm(36), mm(24)], lib.paintDark, { pos: [X.cabRear + mm(230), T.beltline - mm(60), zBelt + s * mm(8)] }))
    // Mirror: a big head on a stalk off the door's front upper corner, standing
    // ~195 mm proud of the body. It is the single most kei-truck detail there is.
    const zBody = s * halfW * tumble(T.mirrorY)
    const zMir = s * (halfW + T.mirrorReach)
    g.add(rod([X.doorFront - mm(30), T.beltline + mm(40), zBody], [X.doorFront + mm(10), T.mirrorY, zMir], mm(16), lib.trim))
    const head = roundedSlab(mm(130), mm(215), mm(56), mm(26), lib.paintDark, { pos: [X.doorFront + mm(20), T.mirrorY + mm(60), zMir] })
    head.rotation.y = Math.PI / 2
    g.add(head)
    // Side repeater and the mud flap behind the front wheel.
    g.add(slab([mm(80), mm(32), mm(10)], lib.lampAmber, { pos: [X.axleFront + mm(300), mm(760), zSill] }))
    g.add(slab([mm(14), mm(190), mm(210)], lib.bumper, { pos: [X.axleFront - ARCH_R - mm(15), mm(280), s * mm(590)] }))
  }

  return g
}

// --- bed -------------------------------------------------------------------

function bed(lib) {
  const g = new THREE.Group()
  g.name = 'bed'
  const halfL = T.bedLen / 2
  const halfW = T.bedWid / 2
  const deck = T.deckH

  // Deck floor: the pressed-and-swaged steel pan, plus the structure below it.
  g.add(slab([T.bedLen + T.gate * 2, mm(14), T.bedWid + T.gate * 2], lib.deckSteel, { pos: [0, deck - mm(7), 0], anchor: [0, 0, 0] }))
  g.add(slab([T.bedLen + T.gate * 2, mm(45), T.bedWid - mm(60)], lib.frame, { pos: [0, deck - mm(38), 0] }))
  // Deck cross-bearers, visible from the side under the lip.
  for (let i = -3; i <= 3; i++) {
    g.add(slab([mm(45), mm(50), T.bedWid + mm(20)], lib.frame, { pos: [i * mm(300), deck - mm(42), 0] }))
  }

  // Corner posts. The gates latch to these, and they are the load path from the
  // gates into the deck — which matters, because two of the four modules use a
  // dropped gate as a working surface rather than as decoration.
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      g.add(slab([mm(45), T.bedSide, mm(45)], lib.galv, { pos: [sx * (halfL - mm(22)), deck, sz * (halfW - mm(22))], anchor: [0, -1, 0] }))
    }
  }

  // Front gate: the same 290 mm stamping as the sides, but fixed.
  const front = gatePanel(lib, T.bedWid + T.gate * 2, T.bedSide, 5)
  front.rotation.y = Math.PI / 2 // length runs along Z for the fore-and-aft gates
  front.position.set(halfL + T.gate / 2, deck, 0)
  g.add(front)

  // The torii: a tubular guard from the headboard up to cab-roof height. It is
  // the strongest hard point on the vehicle — bolted through the deck into the
  // frame crossmember, braced fore-and-aft by the cab — so three of the four
  // modules react their overturning moment into it rather than into the deck.
  const tTop = deck + T.toriiH
  const tR = T.toriiTube / 2
  const tz = halfW - mm(55)
  for (const s of [-1, 1]) {
    g.add(rod([halfL - mm(10), deck + T.bedSide - mm(40), s * tz], [halfL - mm(10), tTop, s * tz], tR, lib.galv))
    g.add(rod([halfL - mm(10), deck + T.bedSide + mm(120), s * tz], [halfL - mm(10), deck + T.bedSide + mm(120), s * (tz - mm(120))], tR * 0.7, lib.galv))
  }
  g.add(rod([halfL - mm(10), tTop, -tz], [halfL - mm(10), tTop, tz], tR, lib.galv))
  g.add(rod([halfL - mm(10), tTop - mm(300), -tz], [halfL - mm(10), tTop - mm(300), tz], tR * 0.8, lib.galv))
  // Gussets where the uprights meet the headboard — the detail that says this
  // frame is structural rather than a luggage rack.
  for (const s of [-1, 1]) {
    g.add(slab([mm(10), mm(150), mm(110)], lib.galv, { pos: [halfL - mm(10), deck + T.bedSide + mm(60), s * (tz - mm(30))] }))
  }

  // Rear face: lamps, plate, tow eye.
  g.add(slab([mm(30), mm(190), T.bedWid + T.gate * 2], lib.paint, { pos: [X.bedRearOuter - mm(15), deck - mm(105), 0] }))
  for (const s of [-1, 1]) {
    g.add(roundedSlab(mm(18), mm(115), mm(190), mm(16), lib.lampRed, { pos: [X.bedRearOuter - mm(32), deck - mm(105), s * mm(530)] }))
  }
  g.add(slab([mm(10), mm(165), mm(330)], lib.chrome, { pos: [X.bedRearOuter - mm(34), deck - mm(105), mm(230)] }))
  g.add(slab([mm(40), mm(50), mm(60)], lib.galv, { pos: [X.bedRearOuter - mm(24), deck - mm(250), 0] }))
  // Rear mud flaps.
  for (const s of [-1, 1]) {
    g.add(slab([mm(14), mm(230), mm(230)], lib.bumper, { pos: [X.axleRear - ARCH_R + mm(10), mm(290), s * mm(600)] }))
  }

  // Hinge knuckles along the three drop-side lines, so the fold is visible even
  // with the gates closed.
  g.add(hingeLine([-halfL + mm(60), deck, halfW + T.gate / 2], [halfL - mm(60), deck, halfW + T.gate / 2], mm(13), lib.hinge))
  g.add(hingeLine([-halfL + mm(60), deck, -halfW - T.gate / 2], [halfL - mm(60), deck, -halfW - T.gate / 2], mm(13), lib.hinge))
  g.add(hingeLine([-halfL - T.gate / 2, deck, -halfW + mm(60)], [-halfL - T.gate / 2, deck, halfW - mm(60)], mm(13), lib.hinge))

  return g
}

/**
 * One stamped gate panel, authored about its HINGE LINE: the panel stands up in
 * +Y from the origin, thickness centred on z = 0, length centred on x = 0.
 *
 * Centring the thickness on the hinge is not cosmetic. It is what lets the gate
 * swing a full 180 degrees and hang flat down the outside of the bed without
 * its own thickness driving it into the deck edge — the offset-equals-thickness
 * rule, at the one place on the truck where it already had to be solved.
 */
function gatePanel(lib, length, height, ribs) {
  const g = new THREE.Group()
  g.add(slab([length, height, T.gate], lib.paint, { anchor: [0, -1, 0] }))
  // Pressed ribs.
  for (let i = 0; i < ribs; i++) {
    const x = (i / (ribs - 1) - 0.5) * (length - mm(220))
    g.add(slab([mm(70), height - mm(70), T.gate + mm(7)], lib.paint, { pos: [x, height / 2, 0] }))
  }
  // Top rail cap, rolled over the edge.
  g.add(rod([-length / 2, height - mm(8), 0], [length / 2, height - mm(8), 0], mm(13), lib.galv))
  // Over-centre latches at both ends: the second load path that actually holds
  // the gate closed, since the hinge alone carries no moment.
  for (const s of [-1, 1]) {
    g.add(slab([mm(60), mm(80), T.gate + mm(20)], lib.galv, { pos: [s * (length / 2 - mm(70)), height - mm(70), 0] }))
  }
  return g
}

/**
 * A drop side, authored about its hinge line: length along X, thickness centred
 * on Z = 0, standing up in +Y. That is already the natural frame for a part
 * that rotates about the X axis, so there is nothing to wrap or mirror — and
 * nothing gets a negative scale, which would quietly invert the normals and
 * corrupt the audit's orthonormal-basis assumption.
 */
function sideGate(lib) {
  return gatePanel(lib, T.bedLen - mm(90), T.bedSide, 5)
}

/** The tailgate: same panel, turned so its hinge line runs along Z. */
function tailGate(lib) {
  const wrap = new THREE.Group()
  const g = gatePanel(lib, T.bedWid + T.gate * 2, T.bedSide, 4)
  g.rotation.y = Math.PI / 2
  wrap.add(g)
  return wrap
}

// --- wheels ----------------------------------------------------------------

function wheels(lib) {
  const g = new THREE.Group()
  g.name = 'wheels'
  for (const [ax, track] of [
    [X.axleFront, T.trackFront],
    [X.axleRear, T.trackRear],
  ]) {
    for (const s of [-1, 1]) {
      g.add(wheel(lib, ax, s * (track / 2), s))
    }
  }
  return g
}

function wheel(lib, x, z, sign) {
  const g = new THREE.Group()
  g.position.set(x, T.tyreR, z)

  // Tread band plus two shoulder bands, which is enough to give the tyre a
  // rounded profile in silhouette without a lathe.
  const tread = new THREE.Mesh(new THREE.CylinderGeometry(T.tyreR, T.tyreR, T.tyreW * 0.72, 26), lib.tire)
  tread.rotation.x = Math.PI / 2
  tread.castShadow = true
  g.add(tread)
  for (const ss of [-1, 1]) {
    const sh = new THREE.Mesh(new THREE.CylinderGeometry(T.tyreR * 0.965, T.tyreR * 0.88, T.tyreW * 0.14, 26), lib.tire)
    sh.rotation.x = Math.PI / 2
    sh.position.z = ss * T.tyreW * 0.43
    g.add(sh)
  }
  // Sidewall face and steel rim.
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(T.rimR, T.rimR, T.tyreW * 0.6, 22), lib.wheel)
  rim.rotation.x = Math.PI / 2
  g.add(rim)
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(T.rimR * 0.82, T.rimR * 0.86, mm(16), 22), lib.hubcap)
  cap.rotation.x = Math.PI / 2
  cap.position.z = sign * (T.tyreW * 0.5 - mm(6))
  g.add(cap)
  // Four studs — kei trucks run a 4x100 pattern and it is visible at this size.
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4
    const stud = new THREE.Mesh(new THREE.CylinderGeometry(mm(11), mm(11), mm(12), 6), lib.chrome)
    stud.rotation.x = Math.PI / 2
    stud.position.set(Math.cos(a) * mm(50), Math.sin(a) * mm(50), sign * (T.tyreW * 0.5 + mm(2)))
    g.add(stud)
  }
  return g
}

// --- collision hulls -------------------------------------------------------

/**
 * The parts of the truck a deploying module can actually hit, as world-space
 * boxes for the audit. Deliberately coarse and deliberately generous: the cab
 * is one block, the deck is one slab, the wheels are one box each. A module
 * that only just misses the cab is a module that would have hit it once
 * somebody fitted a real wing mirror.
 */
function truckHulls() {
  const halfW = T.bedWid / 2
  return [
    { id: 'cab', c: [(X.nose + X.cabRear) / 2, (SILL + T.H) / 2, 0], s: [X.nose - X.cabRear, T.H - SILL, T.W] },
    { id: 'torii', c: [T.bedLen / 2 - mm(10), T.deckH + T.toriiH / 2 + T.bedSide / 2, 0], s: [mm(60), T.toriiH - T.bedSide, T.bedWid] },
    { id: 'deck', c: [0, T.deckH - mm(30), 0], s: [T.bedLen + T.gate * 2, mm(60), T.bedWid + T.gate * 2] },
    { id: 'wheel-rl', c: [X.axleRear, T.tyreR, -T.trackRear / 2], s: [T.tyreR * 2, T.tyreR * 2, T.tyreW] },
    { id: 'wheel-rr', c: [X.axleRear, T.tyreR, T.trackRear / 2], s: [T.tyreR * 2, T.tyreR * 2, T.tyreW] },
    { id: 'mirror-l', c: [X.doorFront + mm(20), T.mirrorY + mm(60), -(T.bodyW / 2 + T.mirrorReach)], s: [mm(140), mm(230), mm(70)] },
    { id: 'mirror-r', c: [X.doorFront + mm(20), T.mirrorY + mm(60), T.bodyW / 2 + T.mirrorReach], s: [mm(140), mm(230), mm(70)] },
  ]
}

export { CAB_W, ROOF_FRONT, SILL, ARCH_R, WS_BASE_X }
