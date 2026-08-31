import * as THREE from 'three'
import {
  mm, deg, slab, rod, extrusion, T, X, HALF_W,
  addGates, addJack, subframe, subframeHull, foldPanel, foldPanelHull,
  hingeX, hingeZ, legGeometry, latch, REST,
} from './common.js'
import { bellows, cloth, roundedSlab } from '../build.js'

// ---------------------------------------------------------------------------
// CABIN — a hard-sided camper that packs inside the cab's own silhouette
//
// THE PROBLEM EVERYONE HITS FIRST: an adult is 1800 mm and a kei bed is 1940 by
// 1410. One person fits lengthwise with 70 mm to spare at each end, which is
// not sleeping, it is being stored. Two people side by side lengthwise get
// 705 mm each, which is a shoulder width, so nobody can turn over. And crosswise
// is 1410, which is 400 mm short of a person.
//
// THE ANSWER, and it is the same one every truck camper has used since the
// 1960s: the bed does not live on the truck bed. A CABOVER BUNK slides forward
// over the cab roof — which is 1120 mm above the deck, exactly the height of
// the packed box — and gains 950 mm of length that the vehicle already had and
// was not using. Extended, the bunk is 2820 x 1280: two adults, lengthwise,
// with room to roll over.
//
// It is a real cantilever and it wants checking. Two adults at 150 kg with
// their mass 475 mm out gives 700 Nm at the root; split between two 100 x 50 x 3
// aluminium side rails, each sees 350 Nm against a section modulus of about
// 26 cm^3, so 13.5 MPa against 6061-T6's 240 MPa yield. Comfortable by a factor
// of seventeen, which is what you want, because deflection governs long before
// stress does and a bunk that visibly sags is a bunk nobody sleeps in. The pads
// that touch the cab roof are there to stop it swaying, not to carry it: a kei
// cab roof is 0.7 mm steel and it carries nothing.
//
// THE SECOND PROBLEM: 900 mm of packed headroom is a crawl space. So the roof
// pops. A hard lid rises 880 mm on four corner guides with a canvas bellows
// filling the gap, and the standing height inside goes from 900 to 1780 — which
// is enough for a lot of people and honestly short for the rest, and saying so
// is better than rounding it up to 2000.
//
// THE THIRD: living in a 2.7 m^2 box is grim. So the kerbside wall is a GULLWING
// — the entire 1940 x 1010 panel hinges at its top edge and lifts to become a
// porch roof, and the drop side plus a fold-out deck make the porch floor under
// it. The inside and the outside become one room, which is the entire reason to
// camp.
//
// Packed, the whole thing is 1940 x 1410 x 1100 above the deck: 1760 mm overall,
// and 20 mm under the cab roof — the tightest packing of the four, and the
// reason the lid sits inside the shell rather than on it. It looks like a work
// truck with a canopy, which is the point.
// ---------------------------------------------------------------------------

const FLOOR = mm(90)
const BOX = { h: mm(1010), t: mm(40) } // hard shell, floor to lid
const LID_RISE = mm(880)
const BUNK_Y = mm(880) // bunk deck above the module floor
// The module stops 40 mm short of the truck's own torii guard at x = 930, which
// is why nothing here is symmetric about the deck centre.
const BOX_CX = -mm(20)
const BUNK_L = mm(1850)
const BUNK_W = mm(1280)
const SLIDE_L = mm(1200)
const SLIDE_TRAVEL = mm(950)
const PORCH_D = mm(500)
const PANEL_T = mm(34)
const HALF = HALF_W - mm(20)

export default {
  id: 'cabin',
  title: 'Cabin',
  tagline: 'a 1940 mm bed cannot sleep two — so the bunk goes over the cab',
  build,
}

function build(ctx) {
  const { rig, lib } = ctx

  rig.setStages([
    'kerb side down, jacks in',
    'roof pops, bellows unfold',
    'gullwing lifts',
    'porch deck out, legs down',
    'bunk slides over the cab',
  ])

  const base = rig.add({
    id: 'floor',
    parent: null,
    label: 'subframe + shell',
    joint: 'fixed',
    static: true,
    mass: 38 + 62,
    com: [0, FLOOR + BOX.h * 0.4, mm(120)],
    hulls: [
      ...subframeHull(FLOOR),
      // Three walls; the kerbside is the gullwing and is its own part.
      { c: [mm(905), FLOOR + BOX.h / 2, 0], s: [BOX.t, BOX.h, HALF * 2], tag: 'front wall' },
      { c: [-mm(945), FLOOR + BOX.h / 2, 0], s: [BOX.t, BOX.h, HALF * 2], tag: 'rear wall' },
      { c: [BOX_CX, FLOOR + BOX.h / 2, HALF - BOX.t / 2], s: [mm(1850), BOX.h, BOX.t], tag: 'off-side wall' },
    ],
  })
  rig.attach(base.id, subframe(lib, { height: FLOOR }))
  rig.attach(base.id, shell(lib))
  rig.attach(base.id, interior(lib))

  addGates(rig, ctx, { left: 'flat', right: 'hang', tail: 'flat', stage: 0 })
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      addJack(rig, lib, { id: `jack-${sx > 0 ? 'f' : 'r'}${sz > 0 ? 'r' : 'l'}`, at: [sx * mm(880), -mm(70), sz * mm(660)], stage: 0 })
    }
  }

  // --- pop-top -------------------------------------------------------------
  // A hard lid on four corner guides rather than scissor arms. A scissor is a
  // closed kinematic loop and a nicer mechanism, but four guided corners is what
  // hard-wall pop-ups actually use, it holds the lid parallel without a
  // synchronising linkage, and it is honest about where the load goes.
  const lid = rig.add({
    id: 'lid',
    parent: 'floor',
    label: 'pop-top roof',
    // The lid sits INSIDE the top 110 mm of the shell, not on top of it. Parked
    // on top it is 1210 mm above the deck, which is 90 mm over the cab roof and
    // straight into the packing ceiling — the readout catches it immediately.
    pivot: [BOX_CX, FLOOR + BOX.h - mm(110), 0],
    joint: 'telescope',
    axis: [0, 1, 0],
    range: [0, LID_RISE],
    stage: 1,
    mass: 44,
    com: [0, mm(60), 0],
    hulls: [{ c: [0, mm(55), 0], s: [mm(1850), mm(110), mm(1370)], tag: 'lid' }],
    mates: ['floor', 'bunk', 'bunk-slide'],
    note: 'standing height goes from 900 to 1780 mm',
  })
  rig.attach(lid.id, popTop(lib))

  // --- gullwing ------------------------------------------------------------
  // The kerbside wall, hinged at its TOP edge on the lid's sill, opening to a
  // porch roof. 1940 x 1010 is a big panel and it sweeps a 1010 mm radius arc
  // through the whole space outboard of the truck — which is empty, and has to
  // stay empty until this is up. Hence the porch deck comes AFTER it.
  const wing = rig.add({
    id: 'gullwing',
    parent: 'floor',
    label: 'gullwing wall / porch roof',
    pivot: [BOX_CX, FLOOR + BOX.h - mm(30), -(HALF - BOX.t / 2)],
    joint: 'hinge',
    axis: [1, 0, 0],
    range: [0, deg(104)],
    stage: 2,
    mass: 32,
    com: [0, -BOX.h / 2, 0],
    // Authored hanging down from its pin, which is how it stows.
    hulls: [{ c: [0, -BOX.h / 2, 0], s: [mm(1850), BOX.h, BOX.t], tag: 'gullwing' }],
    mates: ['floor', 'lid', 'gate-left'],
    note: 'the wall becomes the roof; a 1.0 m panel needs 1.0 m of clear sweep',
  })
  rig.attach(wing.id, gullwingPanel(lib))

  // The props are hinged on the BODY, not on the panel. Hanging them off the
  // gullwing means their stowed position rides with it and their sweep has to
  // be reasoned about in a frame that is itself rotating; hinged on the wall
  // they stow flat inside the shell and simply lean out. It is also where a gas
  // strut actually goes.
  for (const [n, sx] of [['f', 1], ['r', -1]]) {
    const prop = rig.add({
      id: `wing-prop-${n}`,
      parent: 'floor',
      label: 'gullwing prop',
      pivot: [BOX_CX + sx * mm(740), FLOOR + mm(120), -mm(560)],
      joint: 'hinge',
      axis: [1, 0, 0],
      range: [0, -deg(23)],
      stage: 3,
      mass: 1.6,
      com: [0, mm(250), 0],
      hulls: [{ c: [0, mm(250), 0], s: [mm(44), mm(500), mm(44)], tag: 'prop' }],
      mates: ['gullwing', 'floor', 'lid'],
      note: 'a gas strut: it has to get longer, so it is modelled as one',
    })
    rig.attach(prop.id, propStrut(lib, mm(500)))

    // The rod. A gas strut is a linear actuator with both ends pinned, which is
    // a closed kinematic loop and not something a joint TREE can express. What
    // a tree can express is the same two motions in series — a hinge and a
    // telescope — which puts the free end exactly where the strut's rod end
    // goes, and stows to the 500 mm the cylinder actually is.
    rig.add({
      id: `wing-rod-${n}`,
      parent: `wing-prop-${n}`,
      label: 'strut rod',
      pivot: [0, mm(500), 0],
      joint: 'telescope',
      axis: [0, 1, 0],
      range: [0, mm(500)],
      stage: 3,
      mass: 0.8,
      com: [0, -mm(250), 0],
      hulls: [{ c: [0, -mm(250), 0], s: [mm(26), mm(500), mm(26)], tag: 'rod' }],
      mates: [`wing-prop-${n}`, 'gullwing', 'floor', 'lid'],
    })
    rig.attach(`wing-rod-${n}`, slab([mm(26), mm(500), mm(26)], lib.chrome, { anchor: [0, 1, 0] }))
  }

  // --- porch ---------------------------------------------------------------
  // The dropped kerb gate gives 285 mm of ledge; a fold-out panel doubles it to
  // 985, which is a porch you can put a chair on. Legs at the outer edge,
  // because a 985 mm cantilever off a gate hinge is a lever, not a floor.
  // The porch stows lying FLAT ON THE CABIN FLOOR, pointing inboard, and swings
  // 180 degrees out over the dropped gate. Folding it against the gate instead
  // would be the obvious move and it does not work: a 700 mm panel folded onto
  // a 285 mm gate overhangs by 415 mm whichever way you fold it, and once the
  // gate is down that overhang is inside the truck. The floor is the only flat
  // 700 mm the module has, and it is free because it is the walking space.
  const porch = rig.add({
    id: 'porch',
    parent: 'floor',
    label: 'porch deck',
    pivot: [BOX_CX, FLOOR, -(HALF - BOX.t - mm(20))],
    joint: 'hinge',
    axis: [1, 0, 0],
    rest: REST.UP_ALONG_X,
    // Stands against the inside of the kerb wall and swings down to horizontal.
    range: [0, -Math.PI / 2],
    stage: 3,
    mass: 24,
    com: [PORCH_D / 2, 0, 0],
    hulls: foldPanelHull(PORCH_D, mm(1780), PANEL_T, 'porch'),
    mates: ['gate-left', 'floor'],
    note: 'nobody stands on the fold-outs at crowd density — this is a doorstep, not a stage',
  })
  rig.attach(porch.id, foldPanel(lib, PORCH_D, mm(1780), PANEL_T))
  rig.attach(porch.id, hingeZ(lib, mm(1780)))

  // NO LEGS, and that is the design rather than an omission. The dropped gate
  // is a 285 mm shelf at deck level and the porch lands on spacers on top of
  // it, so the gate carries the porch from 717 to 1002 mm out and only the last
  // 123 mm is free cantilever. A leg long enough to reach the tarmac from
  // 750 mm up cannot stow on a 500 mm panel anyway, and every arrangement that
  // makes it fit has it sweeping back through the truck on the way down.
  rig.attach('gate-left', porchSpacers(lib))

  // --- the bunk ------------------------------------------------------------
  const bunk = rig.add({
    id: 'bunk',
    parent: 'lid',
    label: 'bunk deck',
    pivot: [0, -mm(120), 0],
    joint: 'fixed',
    stage: 0,
    mass: 26,
    com: [0, 0, 0],
    hulls: [{ c: [0, -mm(40), 0], s: [BUNK_L, mm(80), BUNK_W], tag: 'bunk' }],
    mates: ['lid', 'floor'],
  })
  rig.attach(bunk.id, bunkDeck(lib))

  const slideOut = rig.add({
    id: 'bunk-slide',
    parent: 'bunk',
    label: 'cabover extension',
    pivot: [BUNK_L / 2 - SLIDE_L, -mm(40), 0],
    joint: 'slide',
    axis: [1, 0, 0],
    range: [0, SLIDE_TRAVEL],
    stage: 4,
    mass: 22 + 12,
    com: [SLIDE_L / 2, 0, 0],
    hulls: [{ c: [SLIDE_L / 2, 0, 0], s: [SLIDE_L, mm(80), BUNK_W - mm(60)], tag: 'cabover' }],
    mates: ['bunk', 'lid', 'cab', 'floor'],
    note: '950 mm over the cab: 700 Nm at the root, 13.5 MPa in the side rails',
  })
  rig.attach(slideOut.id, bunkSlide(lib))

  return {
    massBudget: [
      ['subframe', 36],
      ['hard shell: composite walls + floor', 54],
      ['pop-top lid, bellows and guides', 35],
      ['gullwing wall + props', 24],
      ['porch deck + spacers', 16],
      ['bunk deck + cabover slides', 49],
      ['stabiliser jacks (4)', 18],
      ['fitted kit — see the bill of materials', 88],
      ['water, 20 L', 20],
    ],
    notes: [
      'An adult is 1800 mm and the bed is 1940 × 1410. One person fits lengthwise; two do not. So the bunk slides 950 mm out over the cab roof and becomes 2820 × 1280.',
      'That cantilever is real: two adults at 475 mm out is 700 Nm at the root, 13.5 MPa in a pair of 100 × 50 × 3 aluminium rails against 240 MPa yield. The pads on the cab roof stop it swaying; a 0.7 mm steel cab roof carries nothing.',
      'The pop-top takes standing height from 900 to 1780 mm. That is enough for a lot of people and short for the rest, which is worth saying rather than rounding up to 2000.',
      'Four guided corners rather than scissor arms. A scissor is the nicer mechanism but it is a closed loop; four guides hold the lid parallel with no synchronising linkage.',
      'The shell is 3 mm aluminium composite on 40 × 40 extrusion, not plywood. Plywood walls and floor come to about 90 kg on this footprint and the fitted kit is 88 — one of the two had to give, and it was not the fridge.',
      'Water is 20 L, one tank. A second 20 L tank is 40 kg of water and 40 kg is the entire margin, so the spare tank on the list is exactly that: a spare, filled at the tap, not carried full.',
      'The porch has no legs: it lands on the dropped gate, which carries it for all but the last 123 mm. A leg that reached the tarmac could not stow on a 500 mm panel.',
      'Packed it is 1010 mm above the deck — 1670 overall, 110 under the cab roof. It should look like a work truck with a canopy until it opens.',
    ],
  }
}

// --- geometry ---------------------------------------------------------------

function shell(lib) {
  const g = new THREE.Group()
  const y = FLOOR + BOX.h / 2
  const skin = lib.ply
  // Front (cab end), rear, and off-side walls. The kerb side is the gullwing.
  g.add(slab([BOX.t, BOX.h, HALF * 2], skin, { pos: [mm(905), y, 0] }))
  g.add(slab([BOX.t, BOX.h, HALF * 2], skin, { pos: [-mm(945), y, 0] }))
  g.add(slab([mm(1850), BOX.h, BOX.t], skin, { pos: [BOX_CX, y, HALF - BOX.t / 2] }))
  // Corner extrusions, which is what a sandwich-panel body is actually held
  // together by.
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      g.add(extrusion([BOX_CX + sx * mm(925), FLOOR, sz * (HALF - mm(20))], [BOX_CX + sx * mm(925), FLOOR + BOX.h, sz * (HALF - mm(20))], mm(56), lib.aluDark))
    }
  }
  // A door in the rear wall, and a window in the off-side.
  g.add(slab([mm(16), mm(760), mm(560)], lib.aluDark, { pos: [-mm(966), FLOOR + mm(400), mm(180)] }))
  g.add(slab([mm(16), mm(300), mm(700)], lib.glass, { pos: [0, FLOOR + mm(700), HALF - mm(6)] }))
  // The four guides the lid runs on, standing proud inside the corners.
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      g.add(slab([mm(70), mm(240), mm(70)], lib.alu, { pos: [BOX_CX + sx * mm(840), FLOOR + BOX.h - mm(120), sz * (HALF - mm(90))] }))
    }
  }
  return g
}

/** What you see through the open side: a bench, a galley, a lantern. */
function interior(lib) {
  const g = new THREE.Group()
  g.add(slab([mm(1700), mm(60), mm(520)], lib.ply, { pos: [0, FLOOR + mm(420), mm(380)] }))
  g.add(slab([mm(1700), mm(420), mm(60)], lib.ply, { pos: [0, FLOOR + mm(210), mm(120)] }))
  g.add(slab([mm(620), mm(560), mm(480)], lib.aluDark, { pos: [mm(600), FLOOR + mm(280), mm(360)] }))
  g.add(slab([mm(640), mm(40), mm(500)], lib.stainless, { pos: [mm(600), FLOOR + mm(580), mm(360)] }))
  g.add(slab([mm(240), mm(30), mm(300)], lib.stainless, { pos: [mm(420), FLOOR + mm(600), mm(360)] }))
  const lamp = new THREE.PointLight(0xffc98a, 7, 4, 2)
  lamp.position.set(-mm(200), FLOOR + mm(880), mm(100))
  g.add(lamp)
  g.add(slab([mm(300), mm(26), mm(120)], lib.ledWarm, { pos: [-mm(200), FLOOR + mm(930), mm(300)] }))
  return g
}

/** The pop-top: lid, bellows, and the sleeves that run on the guides. */
function popTop(lib) {
  const g = new THREE.Group()
  g.add(slab([mm(1850), mm(70), mm(1370)], lib.ply, { anchor: [0, -1, 0], pos: [0, mm(20), 0] }))
  g.add(slab([mm(1880), mm(30), mm(1400)], lib.aluDark, { pos: [0, mm(105), 0] }))
  // Bellows on all four sides, authored hanging down from the lid so they
  // stretch as it rises — which is exactly what the fabric does.
  for (const sz of [-1, 1]) {
    const b = bellows(mm(1810), LID_RISE, mm(70), lib.canvasCream, { pleats: 9 })
    b.position.set(0, -LID_RISE / 2 + mm(10), sz * (HALF - mm(45)))
    g.add(b)
  }
  for (const sx of [-1, 1]) {
    const b = bellows(mm(1320), LID_RISE, mm(70), lib.canvasCream, { pleats: 7 })
    b.rotation.y = Math.PI / 2
    b.position.set(sx * mm(900), -LID_RISE / 2 + mm(10), 0)
    g.add(b)
  }
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      g.add(slab([mm(92), mm(300), mm(92)], lib.alu, { pos: [sx * mm(840), -mm(140), sz * (HALF - mm(90))] }))
    }
  }
  return g
}

/**
 * The gullwing, authored HANGING DOWN from its pin at the top — which is both
 * how it stows and how it is hinged. Panelled outside, lined inside, with a
 * window, because it is a wall for eleven months of the year.
 */
function gullwingPanel(lib) {
  const g = new THREE.Group()
  g.add(slab([mm(1850), BOX.h, BOX.t], lib.ply, { anchor: [0, 1, 0] }))
  g.add(slab([mm(1880), mm(50), BOX.t + mm(14)], lib.aluDark, { pos: [0, -BOX.h + mm(25), 0] }))
  g.add(slab([mm(1880), mm(40), BOX.t + mm(14)], lib.aluDark, { pos: [0, -mm(20), 0] }))
  g.add(slab([mm(900), mm(380), mm(14)], lib.glass, { pos: [mm(400), -mm(360), -BOX.t / 2 - mm(8)] }))
  g.add(hingeX(lib, mm(1850), mm(17)))
  // A string of festoon bulbs along the leading edge, which is what actually
  // turns a propped panel into somewhere to sit.
  for (let i = -4; i <= 4; i++) {
    g.add(slab([mm(60), mm(60), mm(60)], lib.ledWarm, { pos: [i * mm(210), -BOX.h + mm(90), -BOX.t / 2 - mm(30)] }))
  }
  const glow = new THREE.PointLight(0xffc07a, 6, 5, 2)
  glow.position.set(0, -BOX.h + mm(120), -mm(120))
  g.add(glow)
  return g
}

/** A gas strut: a tube, a rod, and the eyes at each end. */
/** Spacer blocks on the dropped gate that the porch deck lands on. */
function porchSpacers(lib) {
  const g = new THREE.Group()
  for (let i = -3; i <= 3; i++) {
    g.add(slab([mm(120), mm(90), mm(180)], lib.aluDark, { pos: [i * mm(290), mm(200), 0] }))
  }
  return g
}

function propStrut(lib, length) {
  const g = new THREE.Group()
  g.add(slab([mm(44), length * 0.58, mm(44)], lib.aluDark, { anchor: [0, -1, 0] }))
  g.add(slab([mm(26), length * 0.46, mm(26)], lib.chrome, { anchor: [0, -1, 0], pos: [0, length * 0.56, 0] }))
  g.add(slab([mm(56), mm(46), mm(30)], lib.aluDark, { pos: [0, mm(10), 0] }))
  g.add(slab([mm(56), mm(46), mm(30)], lib.aluDark, { pos: [0, length - mm(10), 0] }))
  return g
}

function bunkDeck(lib) {
  const g = new THREE.Group()
  g.add(slab([BUNK_L, mm(70), BUNK_W], lib.ply, { pos: [0, -mm(35), 0] }))
  for (const sz of [-1, 1]) {
    g.add(slab([BUNK_L, mm(100), mm(50)], lib.aluDark, { pos: [0, -mm(50), sz * (BUNK_W / 2 - mm(25))] }))
  }
  // A mattress, because an empty bunk reads as a shelf.
  g.add(roundedSlab(BUNK_L - mm(120), mm(110), BUNK_W - mm(90), mm(50), lib.canvasIndigo, { pos: [0, mm(55), 0] }))
  for (const sz of [-1, 1]) {
    g.add(roundedSlab(mm(520), mm(120), mm(320), mm(60), lib.canvasCream, { pos: [-BUNK_L / 2 + mm(330), mm(120), sz * mm(300)] }))
  }
  return g
}

/** The cabover extension: deck, side rails, and the pads that rest on the cab. */
function bunkSlide(lib) {
  const g = new THREE.Group()
  g.add(slab([SLIDE_L, mm(60), BUNK_W - mm(80)], lib.ply, { anchor: [-1, 0, 0] }))
  for (const sz of [-1, 1]) {
    // 100 x 50 x 3 rails: the members the cantilever calculation is about.
    g.add(slab([SLIDE_L, mm(100), mm(50)], lib.aluDark, { anchor: [-1, 0, 0], pos: [0, -mm(20), sz * (BUNK_W / 2 - mm(65))] }))
  }
  g.add(roundedSlab(SLIDE_L - mm(160), mm(110), BUNK_W - mm(180), mm(50), lib.canvasIndigo, { pos: [SLIDE_L / 2, mm(85), 0] }))
  for (const sz of [-1, 1]) {
    g.add(slab([mm(160), mm(40), mm(120)], lib.rubberFoot, { pos: [SLIDE_L - mm(140), -mm(90), sz * mm(430)] }))
  }
  // A window in the cabover's front face, which every truck camper has.
  g.add(slab([mm(16), mm(300), mm(760)], lib.glass, { pos: [SLIDE_L - mm(8), mm(120), 0] }))
  return g
}
