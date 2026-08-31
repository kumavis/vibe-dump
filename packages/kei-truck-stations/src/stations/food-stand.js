import * as THREE from 'three'
import {
  mm, deg, slab, rod, extrusion, truss, T, X, HALF_W,
  addGates, addJack, subframe, subframeHull, foldPanel, foldPanelHull,
  hingeX, hingeZ, stay, latch, REST,
} from './common.js'
import { cloth, lathe, roundedSlab, profile } from '../build.js'

// ---------------------------------------------------------------------------
// YATAI — a kitchen car that opens into a street stall
//
// Serving is from the LEFT flank, which in Japan is the kerb side. The whole
// left wall of the galley becomes the stall: an awning swings up and out over
// the pavement, a counter drops to standing height, a valance and a noren hang
// off the awning's leading edge, and four chochin light the lot.
//
// THE HEIGHTS ARE THE DESIGN. There are two counters here and they are at
// different levels, which is the thing that distinguishes a working kitchen car
// from a box with a hole in it:
//
//   The CUSTOMER counter is 1000 mm above the tarmac. The customer is standing
//   on the ground, and 1000 mm is where a person's hands are.
//   The SERVING SILL is 1560 mm above the tarmac — 900 above the module floor,
//   because the cook is standing on the deck, 660 mm up. That is worktop height
//   for the cook and chest height for the customer, and food crosses between
//   them at the sill.
//
// Get that wrong in either direction and it stops working: one counter for both
// means either the cook stoops all night or the customer reaches over their own
// head.
//
// The galley is a hard, enclosed volume with a sink, a water tank and a covered
// prep surface, because a mobile food vehicle in Japan is required to have
// them. It is also, structurally, the module: everything that folds out is
// hung on its walls, which is why it can be a plain welded box and everything
// else can be thin.
//
// AND NOBODY STANDS ON THE FOLD-OUTS. That is not squeamishness. A 2 m
// fold-out deck at the 4 kPa assembly live load is 1580 kg, four and a half
// times a kei truck's entire payload, and it overturns the vehicle about its
// kerbside wheels with a factor of safety around 0.17. So the truck holds the
// kitchen and the pavement holds the queue.
// ---------------------------------------------------------------------------

const FLOOR = mm(100)
const GALLEY = {
  x0: -mm(120), x1: mm(920), //  1040 long, stopping clear of the truck's torii guard
  z0: -mm(560), z1: mm(640), //  1200 wide, offset toward the serving side
  h: mm(900), //                 worktop 900 above the module floor
}
const ROOF_Y = FLOOR + GALLEY.h // 1000 above the deck; 1780 above the tarmac
const AWNING_L = mm(1200)
const AWNING_T = mm(60)
// A NEGATIVE rotation about +X. Turning +Z about +X by a POSITIVE angle takes
// it to -Y, not +Y: the right-hand rule sends +Y to +Z to -Y to -Z. Getting that
// backwards swings the awning down through the galley roof and out under the
// truck, which the audit reports as a 1.2 m panel 200 mm below the deck.
const AWNING_ANGLE = -deg(168) // -Z and 12 degrees above horizontal
const VALANCE = mm(340)
// The valance is inset from the awning's side rails — which is where it looks
// like it belongs anyway, and is also the only place it does not sweep through
// the two struts on its way down.
const VALANCE_W = mm(900)
const COUNTER_Y = mm(340) // 1000 above the tarmac — the customer's hands
const COUNTER_D = mm(450)
const COUNTER_W = mm(1400)
const COUNTER_X = mm(200) // centred on the truck, not on the galley
const PANEL_T = mm(34)

export default {
  id: 'yatai',
  title: 'Yatai',
  tagline: 'two counter heights, because two people are standing on different things',
  build,
}

function build(ctx) {
  const { rig, lib } = ctx

  rig.setStages([
    'kerb side down, jacks in',
    'awning swings up and over',
    'counter drops',
    'struts brace the awning',
    'valance, lanterns, flue, shelf',
  ])

  const base = rig.add({
    id: 'floor',
    parent: null,
    label: 'subframe + galley',
    joint: 'fixed',
    static: true,
    mass: 44 + 96,
    com: [mm(400), FLOOR + GALLEY.h * 0.45, mm(40)],
    hulls: [
      ...subframeHull(FLOOR),
      {
        c: [(GALLEY.x0 + GALLEY.x1) / 2, FLOOR + GALLEY.h / 2, (GALLEY.z0 + GALLEY.z1) / 2],
        s: [GALLEY.x1 - GALLEY.x0, GALLEY.h, GALLEY.z1 - GALLEY.z0],
        tag: 'galley',
      },
    ],
  })
  rig.attach(base.id, subframe(lib, { height: FLOOR }))
  rig.attach(base.id, galley(lib))

  addGates(rig, ctx, { left: 'hang', right: 'flat', tail: 'flat', stage: 0 })

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      addJack(rig, lib, { id: `jack-${sx > 0 ? 'f' : 'r'}${sz > 0 ? 'r' : 'l'}`, at: [sx * mm(880), -mm(70), sz * mm(660)], stage: 0 })
    }
  }

  // --- the awning ----------------------------------------------------------
  // It stows lying flat on the galley roof pointing INBOARD, and swings 168
  // degrees to point out over the pavement. That is a 1.2 m panel sweeping a
  // 1.2 m radius arc straight overhead, which is only possible because there is
  // nothing above the galley — the sweep envelope is the constraint that
  // decides where a big panel is allowed to stow, and "on top, facing the wrong
  // way" is very often the only answer that works.
  const awning = rig.add({
    id: 'awning',
    parent: 'floor',
    label: 'awning',
    pivot: [(GALLEY.x0 + GALLEY.x1) / 2, ROOF_Y + AWNING_T / 2, GALLEY.z0],
    joint: 'hinge',
    axis: [1, 0, 0],
    range: [0, AWNING_ANGLE],
    stage: 1,
    mass: 34,
    com: [0, 0, AWNING_L / 2],
    // Authored extending +Z from the pin, so the hull is written the same way.
    hulls: [{ c: [0, 0, AWNING_L / 2], s: [GALLEY.x1 - GALLEY.x0, AWNING_T, AWNING_L], tag: 'awning' }],
    mates: ['floor'],
    note: 'a 1.2 m cantilever; the struts are what hold it, not the hinge',
  })
  rig.attach(awning.id, awningPanel(lib))

  // Two struts. The awning's hinge carries no moment whatsoever, so without
  // these the panel is a 1.2 m lever trying to peel its own hinge off the roof.
  // They land on the galley wall 530 mm below the pin, which gives the couple a
  // real depth — and depth is worth far more here than latch strength, because
  // the couple force goes as 1/depth.
  for (const [n, sx] of [['l', -1], ['r', 1]]) {
    const strut = rig.add({
      id: `awning-strut-${n}`,
      parent: 'awning',
      label: 'awning strut',
      // Pinned at the awning's TIP and lying back along its underside, not
      // pinned near the root and sticking out past the end — which is where a
      // 960 mm strut on a 1200 mm awning ends up if you author it the obvious
      // way round, 480 mm out in mid-air behind the truck.
      pivot: [sx * mm(490), -AWNING_T / 2 - mm(14), mm(1160)],
      joint: 'hinge',
      axis: [1, 0, 0],
      // Stowed flat along the awning's underside; swings down to brace it.
      range: [0, -deg(42)],
      // AFTER the counter, not with it: a strut sweeping down from the awning
      // passes exactly through where the counter is still standing against the
      // wall. Order, not geometry, is the fix.
      stage: 3,
      mass: 3.2,
      com: [0, 0, -mm(480)],
      hulls: [{ c: [0, 0, -mm(480)], s: [mm(44), mm(44), mm(960)], tag: 'strut' }],
      mates: ['awning', 'floor'],
    })
    rig.attach(strut.id, strutRod(lib, mm(960)))
  }

  // --- the counter ---------------------------------------------------------
  // Hinged on the galley's serving wall and dropping from flat-against-it to
  // horizontal. `rest` turns the panel to stand up the wall at rest, so the
  // fold is still a plain quarter turn about the truck's X axis.
  const counter = rig.add({
    id: 'counter',
    parent: 'floor',
    label: 'customer counter',
    pivot: [COUNTER_X, COUNTER_Y, GALLEY.z0 - PANEL_T / 2],
    joint: 'hinge',
    axis: [1, 0, 0],
    rest: REST.UP_ALONG_X,
    range: [0, Math.PI / 2],
    stage: 2,
    mass: 21,
    com: [COUNTER_D / 2, 0, 0],
    hulls: foldPanelHull(COUNTER_D, COUNTER_W, PANEL_T, 'counter'),
    mates: ['floor', 'gate-left'],
    note: '1000 mm above the tarmac — standing height for someone on the ground',
  })
  rig.attach(counter.id, counterTop(lib))

  // Two brackets, not legs. A leg long enough to reach the tarmac from 1000 mm
  // up cannot stow behind a 450 mm counter, and a bracket triangulating back
  // into the galley wall is both shorter and stiffer — it puts the counter's
  // load into the box that is already carrying everything else.
  for (const [n, sx] of [['l', -1], ['r', 1]]) {
    const br = rig.add({
      id: `counter-bracket-${n}`,
      parent: 'counter',
      label: 'counter bracket',
      pivot: [mm(300), PANEL_T / 2, sx * mm(440)],
      joint: 'hinge',
      axis: [0, 0, 1],
      range: [Math.PI, Math.PI + deg(141)],
      stage: 4,
      mass: 2.1,
      com: [mm(190), 0, 0],
      hulls: [{ c: [mm(195), 0, 0], s: [mm(390), mm(40), mm(40)], tag: 'bracket' }],
      mates: ['counter', 'floor'],
    })
    rig.attach(br.id, strutRod(lib, mm(390)))
  }

  // --- valance and soft goods ----------------------------------------------
  // The valance drops off the awning's leading edge. It is the piece that makes
  // the stall read as a stall rather than as a carport: it puts a low horizontal
  // edge at eye level, and everything hangs from it.
  const valance = rig.add({
    id: 'valance',
    parent: 'awning',
    label: 'valance + noren rail',
    // Stows FOLDED BACK over the awning's top rather than continuing past its
    // tip: extended, it would reach 980 mm out in z, which is 275 mm outside
    // the vehicle. The pin sits a panel thickness proud of the awning's upper
    // face so the folded valance lands on it rather than in it.
    pivot: [0, mm(48), AWNING_L],
    joint: 'hinge',
    axis: [1, 0, 0],
    range: [Math.PI, deg(102)],
    stage: 4,
    mass: 9,
    com: [0, 0, VALANCE / 2],
    hulls: [{ c: [0, 0, VALANCE / 2], s: [VALANCE_W, mm(34), VALANCE], tag: 'valance' }],
    mates: ['awning'],
  })
  rig.attach(valance.id, valancePanel(lib))

  // Four chochin on the awning's leading edge, and a noren at each end.
  rig.attach(awning.id, lanterns(lib))

  // --- flue and back shelf -------------------------------------------------
  const flue = rig.add({
    id: 'flue',
    parent: 'floor',
    label: 'extract flue',
    // Retracted, the flue lives INSIDE the galley. Parked proud of the roof it
    // would be standing in the awning's stowed footprint, which is the whole
    // roof — there is nowhere on top of this module that the awning does not
    // already occupy when it is folded.
    pivot: [mm(700), ROOF_Y - mm(420), mm(430)],
    joint: 'telescope',
    axis: [0, 1, 0],
    range: [0, mm(420)],
    stage: 4,
    mass: 5,
    com: [0, mm(200), 0],
    hulls: [{ c: [0, mm(210), 0], s: [mm(190), mm(420), mm(190)], tag: 'flue' }],
    mates: ['floor', 'awning'],
  })
  rig.attach(flue.id, fluePipe(lib))

  // A prep shelf on the crew side, over the dropped right-hand gate. Small,
  // because the crew side is a 500 mm strip and that is all there is.
  const shelf = rig.add({
    id: 'back-shelf',
    parent: 'floor',
    label: 'prep shelf',
    // Hangs DOWN inside the crew side and swings out to worktop height, rather
    // than standing up and swinging down: standing up puts its stowed tip 1240
    // above the deck, which is over the packing ceiling.
    pivot: [mm(400), FLOOR + mm(900), GALLEY.z1 + mm(20)],
    joint: 'hinge',
    axis: [1, 0, 0],
    rest: REST.DOWN_ALONG_X,
    range: [0, -Math.PI / 2],
    stage: 4,
    mass: 7,
    com: [mm(190), 0, 0],
    hulls: foldPanelHull(mm(380), mm(1000), mm(28), 'shelf'),
    mates: ['floor'],
  })
  rig.attach(shelf.id, foldPanel(lib, mm(380), mm(1000), mm(28), { face: lib.stainless }))

  return {
    massBudget: [
      ['subframe', 44],
      ['galley box, sink, tanks', 96],
      ['awning + struts', 40],
      ['valance, noren, lanterns', 14],
      ['customer counter + brackets', 25],
      ['flue + prep shelf', 12],
      ['stabiliser jacks (4)', 18],
      ['griddle, fridge, 80 L water', 82],
    ],
    notes: [
      'Two counter heights: 1000 mm for the customer standing on the tarmac, 1560 mm for the cook standing on the deck. Food crosses at the sill between them.',
      'The galley box IS the structure. Everything that folds out hangs off its walls, which is why the box can be plain welded steel and everything else can be thin.',
      'Nobody stands on the fold-outs. A 2 m fold-out at the 4 kPa assembly live load is 1580 kg — 4.5× the whole payload — and it would tip the truck about its kerbside wheels.',
      'The awning struts land 530 mm below the hinge on purpose. The couple that holds a cantilever goes as 1/depth, so a deep triangle beats a strong latch every time.',
      'An awning is a sail: 1.2 × 1.9 m at 40 mph is about 25 kg of uplift per corner, so the struts are pinned in tension as well as compression and the whole thing comes down in real weather.',
    ],
  }
}

// --- geometry ---------------------------------------------------------------

function galley(lib) {
  const g = new THREE.Group()
  const w = GALLEY.x1 - GALLEY.x0
  const d = GALLEY.z1 - GALLEY.z0
  const cx = (GALLEY.x0 + GALLEY.x1) / 2
  const cz = (GALLEY.z0 + GALLEY.z1) / 2
  const t = mm(34)

  // Four walls and a roof, in painted steel; the serving wall has a big sill
  // cut into it between the counter and the roof.
  g.add(slab([w, GALLEY.h, t], lib.paint, { pos: [cx, FLOOR + GALLEY.h / 2, GALLEY.z1] }))
  g.add(slab([t, GALLEY.h, d], lib.paint, { pos: [GALLEY.x1, FLOOR + GALLEY.h / 2, cz] }))
  g.add(slab([t, GALLEY.h, d], lib.paint, { pos: [GALLEY.x0, FLOOR + GALLEY.h / 2, cz] }))
  g.add(slab([w, mm(40), d], lib.paintDark, { pos: [cx, ROOF_Y - mm(20), cz] }))

  // Serving wall: solid below the counter line and above the sill, open between.
  const sillLo = COUNTER_Y + mm(120)
  const sillHi = FLOOR + mm(900) - mm(60)
  g.add(slab([w, sillLo - FLOOR, t], lib.paint, { pos: [cx, (FLOOR + sillLo) / 2, GALLEY.z0] }))
  g.add(slab([w, ROOF_Y - sillHi, t], lib.paint, { pos: [cx, (sillHi + ROOF_Y) / 2, GALLEY.z0] }))
  for (const sx of [-1, 1]) {
    g.add(slab([mm(120), sillHi - sillLo, t], lib.paint, { pos: [cx + sx * (w / 2 - mm(60)), (sillLo + sillHi) / 2, GALLEY.z0] }))
  }
  // The sill itself: a stainless lip the food crosses.
  g.add(slab([w, mm(40), mm(150)], lib.stainless, { pos: [cx, sillLo, GALLEY.z0 - mm(30)] }))

  // Inside, seen through the sill: griddle, sink, water tank, and a warm lamp.
  g.add(slab([mm(700), mm(90), mm(520)], lib.griddle, { pos: [mm(120), FLOOR + mm(830), mm(60)] }))
  g.add(slab([mm(620), mm(70), mm(480)], lib.stainless, { pos: [mm(700), FLOOR + mm(840), mm(60)] }))
  g.add(slab([mm(360), mm(150), mm(300)], lib.stainless, { pos: [mm(700), FLOOR + mm(790), mm(60)] }))
  g.add(slab([mm(420), mm(520), mm(380)], lib.stainless, { pos: [mm(800), FLOOR + mm(280), mm(380)] }))
  const lamp = new THREE.PointLight(0xffcf9a, 9, 4.5, 2)
  lamp.position.set(mm(400), ROOF_Y - mm(120), mm(0))
  g.add(lamp)
  g.add(slab([mm(700), mm(24), mm(120)], lib.ledWarm, { pos: [mm(400), ROOF_Y - mm(70), mm(-200)] }))

  // Menu board on the crew-side wall, and a hatch.
  g.add(slab([mm(760), mm(360), mm(16)], lib.trim, { pos: [mm(300), FLOOR + mm(640), GALLEY.z1 + mm(20)] }))
  return g
}

/** The awning: a light aluminium frame with a stretched skin, plus a batten. */
function awningPanel(lib) {
  const g = new THREE.Group()
  const w = GALLEY.x1 - GALLEY.x0
  g.add(slab([w, AWNING_T, AWNING_L], lib.canvasCream, { anchor: [0, 0, -1] }))
  for (const sx of [-1, 1]) {
    g.add(extrusion([sx * (w / 2 - mm(30)), 0, 0], [sx * (w / 2 - mm(30)), 0, AWNING_L], mm(46), lib.alu))
  }
  g.add(extrusion([-w / 2, 0, AWNING_L - mm(30)], [w / 2, 0, AWNING_L - mm(30)], mm(46), lib.alu))
  for (let i = 1; i < 4; i++) {
    g.add(extrusion([-w / 2, mm(6), (i / 4) * AWNING_L], [w / 2, mm(6), (i / 4) * AWNING_L], mm(28), lib.alu))
  }
  g.add(hingeX(lib, w))
  return g
}

/** Valance panel with a scalloped hem — the low horizontal edge of the stall. */
function valancePanel(lib) {
  const g = new THREE.Group()
  const w = VALANCE_W
  g.add(slab([w, mm(30), VALANCE], lib.canvasIndigo, { anchor: [0, 0, -1] }))
  g.add(extrusion([-w / 2, 0, mm(16)], [w / 2, 0, mm(16)], mm(34), lib.alu))
  g.add(extrusion([-w / 2, 0, VALANCE - mm(20)], [w / 2, 0, VALANCE - mm(20)], mm(30), lib.alu))
  // Shop name, as a lit band.
  g.add(slab([w - mm(180), mm(20), mm(150)], lib.ledWarm, { pos: [0, mm(20), VALANCE * 0.55] }))
  return g
}

/** Four chochin on the awning's leading edge and a noren at each end. */
function lanterns(lib) {
  const g = new THREE.Group()
  const w = GALLEY.x1 - GALLEY.x0
  for (let i = 0; i < 4; i++) {
    const x = -w / 2 + mm(180) + (i * (w - mm(360))) / 3
    const l = new THREE.Group()
    l.position.set(x, -mm(60), AWNING_L - mm(120))
    l.add(rod([0, 0, 0], [0, -mm(80), 0], mm(5), lib.trim))
    const body = lathe(
      [[0, -mm(150)], [mm(58), -mm(140)], [mm(96), -mm(60)], [mm(100), 0], [mm(96), mm(60)], [mm(58), mm(140)], [0, mm(150)]],
      lib.washi,
      { seg: 14 },
    )
    body.position.y = -mm(250)
    l.add(body)
    const glow = new THREE.PointLight(0xffb257, 3.4, 2.6, 2)
    glow.position.y = -mm(250)
    l.add(glow)
    g.add(l)
  }
  for (const sx of [-1, 1]) {
    const n = cloth(mm(420), mm(560), mm(20), lib.noren, { nx: 6, ny: 5 })
    n.rotation.y = Math.PI / 2
    n.position.set(sx * (w / 2 - mm(220)), -mm(340), AWNING_L - mm(90))
    g.add(n)
  }
  return g
}

/** The customer counter: a hardwood top with a raised drink rail. */
function counterTop(lib) {
  const g = new THREE.Group()
  g.add(foldPanel(lib, COUNTER_D, COUNTER_W, PANEL_T, { face: lib.hinoki }))
  g.add(hingeZ(lib, COUNTER_W))
  g.add(slab([mm(50), mm(56), COUNTER_W - mm(60)], lib.alu, { pos: [COUNTER_D - mm(30), mm(28), 0] }))
  // Three bowls waiting to be collected, because an empty counter reads as a shelf.
  for (let i = -1; i <= 1; i++) {
    const bowl = lathe([[0, 0], [mm(70), mm(20)], [mm(88), mm(58)], [mm(84), mm(64)], [mm(64), mm(26)], [0, mm(6)]], lib.vermilion, { seg: 16 })
    bowl.position.set(COUNTER_D * 0.45, PANEL_T / 2, i * mm(430))
    g.add(bowl)
  }
  return g
}

/** A brace, authored running BACK along -Z from its pin. */
function strutRod(lib, length) {
  const g = new THREE.Group()
  g.add(slab([mm(40), mm(40), length], lib.alu, { anchor: [0, 0, 1] }))
  g.add(slab([mm(70), mm(70), mm(24)], lib.aluDark, { pos: [0, 0, -mm(12)] }))
  g.add(slab([mm(60), mm(60), mm(24)], lib.aluDark, { pos: [0, 0, -length + mm(12)] }))
  return g
}

function fluePipe(lib) {
  const g = new THREE.Group()
  g.add(rod([0, 0, 0], [0, mm(400), 0], mm(85), lib.galv))
  g.add(rod([0, mm(400), 0], [0, mm(430), 0], mm(120), lib.galv))
  g.add(slab([mm(280), mm(20), mm(280)], lib.galv, { pos: [0, mm(455), 0] }))
  return g
}
