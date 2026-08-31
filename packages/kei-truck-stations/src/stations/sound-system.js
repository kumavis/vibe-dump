import * as THREE from 'three'
import {
  mm, deg, slab, rod, extrusion, truss, T, X, HALF_W,
  addGates, addJack, subframe, subframeHull, stay, latch,
  foldPanel, foldPanelHull, hingeZ,
} from './common.js'

// ---------------------------------------------------------------------------
// SOUND SYSTEM — the bed is the riser, the flanks are the stacks
//
// The crowd stands behind the truck. The cargo deck is the DJ's floor, already
// 660 mm up, which is a riser nobody had to build. Two trays glide out of the
// flanks carrying the subs; the mid-tops ride up a pair of poles and tip
// upright at the top; a crank-up mast lies flat down the centre and swings up
// to fly a wing of lights over the whole thing; and a three-panel booth stands
// off the tail with its fascia facing the crowd.
//
// EVERY BOX HERE IS REAL, AND THAT DECIDED THE MECHANISM THREE TIMES OVER.
//
// FIRST: not one powered speaker in this class has a usable mounting point on
// its base, sides or back. The complete inventory of threaded features on a
// modern active PA cabinet is a pole socket in the top — rated for compression
// only, never a tie-down — sometimes M8 or M10 inserts, and cast handle
// recesses. So the subs travel in plywood wells with hardwood battens hooking
// into the cast side handles, and the strap only has to stop them rocking
// rather than lifting. The tops are Yamaha DZR10s specifically because M10 x 8
// plus M8 x 2 is the one flypoint pattern here rich enough to BOLT a yoke to —
// which is what lets them tip up on a trunnion instead of being lifted by hand.
//
// SECOND: NO CRANK-UP MAST IN THIS CLASS COLLAPSES BELOW 1120 mm. The K&M 24730
// stows at 1405, the 24740 at 1715, the Manfrotto 087NWB at 1670. There is no
// mast that stands on this deck with the truck legal to drive. So the mast lies
// FLAT down the centre channel, captured in split shaft collars on a hinged
// plate — K&M ship no column flange, so collars are the only fixing anyway —
// and swings up before it cranks.
//
// THIRD, and this is the one that shaped the trays: tray 60 + DXS15XLF 587 + a
// DZR10 standing on it is 1149 mm, 29 over the ceiling. Lying on its side the
// top box measures 345 and the stack is 992, which fits. But a box lying on a
// sub cannot simply tip upright in place — swing it about any pin and a corner
// dips 400 mm into the cabinet underneath it. So it goes UP FIRST and TIPS
// SECOND: a pair of K&M 21336 distance rods either side of the sub raise the
// yoke 530 mm clear, and only then does the box rotate. Both moves are in the
// step list in that order, and the auditor checks the arc.
//
// WEIGHT IS STILL THE BINDING CONSTRAINT. The deck has 2.7 m^2 and 1120 mm of
// headroom, which is generous; it has 350 kg of payload, which is not. The
// whole module comes to about 347 kg. That is why the power station is a
// DELTA 2 Max and not a Pro 3: the Pro 3 is 4096 Wh and 51.5 kg, and 51.5 kg is
// not available. Roughly two and a half hours, honestly stated.
//
// THE LOAD PATH, end to end. Box -> well -> tray -> slides at the inboard end
// and drop legs at the outboard -> ground and subframe. Subframe -> spreader
// plates -> the deck's own cross bearers -> chassis. Chassis -> four screw jacks
// -> ground. Nothing anywhere is held up by a hinge alone.
// ---------------------------------------------------------------------------

const FLOOR = mm(110) // module floor above the cargo deck

// --- the trays ---------------------------------------------------------------
// 570 wide each, and that number is not free: the sub is 450, the lift columns
// have to stand outboard of it, and the two trays plus the mast's centre channel
// have to close on the bed's 1410. 570 + 570 + 270 = 1410, exactly.
const TRAY_T = mm(60)
const TRAY_L = mm(1360)
const TRAY_W = mm(570)
const TRAY_TRAVEL = mm(610) // LAMP 3509-24, 632 mm of stroke
const TRAY_CX = mm(240)
const TRAY_CZ = mm(420)

// Yamaha DXS15XLF, as installed: 600 deep in X because it faces the crowd,
// 450 across the tray, 587 tall. Yamaha DZR10: 345 x 315 x 537.
const SUB = { d: mm(600), w: mm(450), h: mm(587) }
const TOP = { d: mm(345), w: mm(315), h: mm(537) }
const SUB_CX = -mm(370) // sub centred on the tray's aft half
const SUB_TOP = TRAY_T + SUB.h // 647 — the shelf the top box travels on

// K&M 21336 distance rod: M20 male base, Ø35 upper tube, 945 -> 1475, 35 kg.
// A pair per side, one either side of the sub, feet in M20 bosses recessed
// 50 mm into the tray pan so the collapsed head lands at 955 rather than 1005.
const COL_X = -mm(330)
const COL_Z = mm(255) // outboard of the sub's 225, inboard of the tray's 285
const COL_BASE = mm(10)
const COL_STOW = mm(945)
const COL_RISE = mm(530) // 945 -> 1475, the rod's real travel
const PIN_Y = COL_BASE + COL_STOW // 955 — the trunnion, and the yoke's pin

// Where the top box sits while it travels, and therefore where the pin has to
// be. Lying centre is fixed by the sub; the pin is fixed by the rods; the
// deployed pose falls out of the quarter turn and is not a free choice.
const TOP_LIE_X = SUB_CX
const TOP_LIE_Y = SUB_TOP + TOP.d / 2

// K&M 24730 crank-up stand: 1405 stowed, 3000 extended, 40 kg rated, Ø35 spigot.
const MAST_X = mm(600)
const MAST_Y = mm(420) // axis height on its hinged collar plate
const MAST_STOW = mm(1405)
const MAST_CRANK = mm(900) // of the 1595 available — see the notes
// STAGE EVOLUTION TRUSS4/100/22I: 220 mm square, 1 m, Ø35 chords, pin and R-clip.
const WING_L = mm(1000)
const WING_S = mm(220)
const WING_OFF = mm(185) // half the stagger — see lightWing()

const BOOTH_X = -mm(940) // hinge line of the booth's lower panel
const BOOTH_PANEL = mm(475)
const BOOTH_W = mm(1300)
const PANEL_T = mm(32)

export default {
  id: 'sound-system',
  title: 'Sound System',
  tagline: 'the deck is the riser, the flanks are the stacks',
  crowd: 'behind the tail',
  build,
}

function build(ctx) {
  const { rig, lib } = ctx

  // ORDER MATTERS, AND THE AUDITOR PROVES IT. The mast has to be up and cranked
  // before the booth stands, because the wings folded against the column sweep a
  // 1436 mm radius over the aft deck on their way up and the booth is in it. The
  // tops have to rise before they tip. The counter has to come over before the
  // end cheeks fold up under it. Run the fold backwards and every one of those
  // reads the other way round, which is exactly what packing up is.
  rig.setStages([
    'sides down, jacks in',
    'trays glide out, mast swings up',
    'legs down, mast cranks',
    'feet out, booth fascia stands',
    'fascia extends, lift columns rise',
    'counter over, tops tip upright',
    'end cheeks up, light wings open',
  ])

  // --- what stays put ------------------------------------------------------
  const base = rig.add({
    id: 'floor',
    parent: null,
    label: 'subframe + stage floor',
    joint: 'fixed',
    static: true,
    mass: 36,
    com: [0, FLOOR / 2, 0],
    hulls: subframeHull(FLOOR),
  })
  rig.attach(base.id, subframe(lib, { height: FLOOR }))
  rig.attach(base.id, stageFloorDetail(lib))
  rig.attach(base.id, mastPlinth(lib))

  addGates(rig, ctx, { left: 'hang', right: 'hang', tail: 'flat', stage: 0 })

  // Four jacks at the deck corners. Their spread — 1800 x 1380 — is the support
  // polygon that everything else is checked against.
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      addJack(rig, lib, {
        id: `jack-${sx > 0 ? 'f' : 'r'}${sz > 0 ? 'r' : 'l'}`,
        at: [sx * mm(880), -mm(70), sz * mm(660)],
        stage: 0,
      })
    }
  }

  // --- the trays -----------------------------------------------------------
  for (const [side, sz] of [['l', -1], ['r', 1]]) {
    const tray = rig.add({
      id: `tray-${side}`,
      parent: 'floor',
      label: `${side === 'l' ? 'left' : 'right'} speaker tray`,
      pivot: [TRAY_CX, FLOOR, sz * TRAY_CZ],
      joint: 'slide',
      axis: [0, 0, sz],
      range: [0, TRAY_TRAVEL],
      stage: 1,
      mass: 24 + 45, // tray, slides and legs, plus the bass bin in its well
      com: [SUB_CX, TRAY_T + SUB.h / 2, 0],
      hulls: [
        { c: [0, TRAY_T / 2, 0], s: [TRAY_L, TRAY_T, TRAY_W], tag: 'tray' },
        { c: [SUB_CX, TRAY_T + SUB.h / 2, 0], s: [SUB.d, SUB.h, SUB.w], tag: 'DXS15XLF + well' },
        // The two lift columns are part of the tray: they stand on it and ride
        // out with it. Same part, so the audit doesn't police them against the
        // sub they straddle — but the 30 mm clearance is in the numbers above.
        { c: [COL_X, (COL_BASE + PIN_Y) / 2, COL_Z], s: [mm(60), COL_STOW, mm(60)], tag: 'lift column' },
        { c: [COL_X, (COL_BASE + PIN_Y) / 2, -COL_Z], s: [mm(60), COL_STOW, mm(60)], tag: 'lift column' },
      ],
      mates: [`gate-${side === 'l' ? 'left' : 'right'}`],
      note: 'LAMP 3509-24 over-travel slides; the load stays in shear the whole way out',
    })
    rig.attach(tray.id, trayGeometry(lib))

    // Two drop legs along the tray's outboard edge.
    //
    // They stow LYING FLAT inside a rebate in the tray's own 60 mm thickness,
    // which is the only place on this module a 620 mm leg will go: under the
    // tray is the subframe, above it is the bass bin, and standing one upright
    // beside the bin puts it straight through the lift column. Lying in the edge
    // of the thing it holds up is where a fold-down leg belongs anyway.
    //
    // A leg that stows within a 1360 mm tray cannot also be the 840 mm it needs
    // to reach the tarmac from 800 mm up, so the last 180 mm telescopes. That is
    // not a flourish — it is the arithmetic, and it is why real trailer legs
    // have an adjustable foot.
    for (const [n, lx] of [['a', -mm(650)], ['b', mm(20)]]) {
      const leg = rig.add({
        id: `tray-leg-${side}${n}`,
        parent: `tray-${side}`,
        label: 'tray leg',
        pivot: [lx, mm(30), sz * mm(250)],
        joint: 'hinge',
        axis: [0, 0, 1],
        // Stowed pointing along the tray; a quarter turn drops it plumb.
        range: [0, -Math.PI / 2],
        stage: 2,
        mass: 3.2,
        com: [mm(310), 0, 0],
        hulls: [{ c: [mm(310), 0, 0], s: [mm(620), mm(48), mm(48)], tag: 'leg' }],
        mates: [`tray-${side}`],
      })
      rig.attach(leg.id, legStrut(lib, mm(620)))

      // The foot NESTS inside the leg when stowed — its origin is 200 mm back
      // from the leg's end, not at it. Author it hanging off the end instead and
      // the packed leg is 820 mm long, which puts it through the back of the cab.
      const foot = rig.add({
        id: `tray-foot-${side}${n}`,
        parent: `tray-leg-${side}${n}`,
        label: 'adjustable foot',
        pivot: [mm(420), 0, 0],
        joint: 'telescope',
        axis: [1, 0, 0],
        range: [0, mm(180)],
        stage: 3,
        mass: 1.1,
        com: [mm(120), 0, 0],
        footprint: [mm(380), 0, 0],
        hulls: [{ c: [mm(100), 0, 0], s: [mm(200), mm(38), mm(38)], tag: 'foot' }],
        mates: ['ground', `tray-leg-${side}${n}`, `tray-${side}`],
      })
      rig.attach(foot.id, footPad(lib))
    }

    // THE MID-TOP GOES UP, THEN TIPS — in that order, and the order is forced.
    //
    // It travels lying on its side on the sub, because tray 60 + sub 587 + a box
    // standing on it is 1149 mm against a 1120 ceiling; lying, the stack is 992.
    // The yoke pin sits 37 mm below the box's top face, bolted through the upper
    // side inserts. Rotate about that pin where it stands and the box's far
    // bottom corner swings on a 436 mm radius — 130 mm INTO the sub. So the pin
    // rises 530 mm on the pair of distance rods first, which puts the lowest
    // point of the arc at 1049, and the sub's top is at 647.
    const lift = rig.add({
      id: `top-lift-${side}`,
      parent: `tray-${side}`,
      label: 'mid-top lift columns',
      pivot: [COL_X, PIN_Y, 0],
      joint: 'telescope',
      axis: [0, 1, 0],
      range: [0, COL_RISE],
      stage: 4,
      mass: 4.5 + 2.27 * 2,
      com: [0, -mm(300), 0],
      // The inner tubes only. Retracted they live inside the outer columns,
      // which belong to the tray — hence the mate.
      hulls: [
        { c: [0, -mm(415), COL_Z], s: [mm(45), mm(830), mm(45)], tag: 'Ø35 inner' },
        { c: [0, -mm(415), -COL_Z], s: [mm(45), mm(830), mm(45)], tag: 'Ø35 inner' },
      ],
      mates: [`tray-${side}`],
      note: '300 mm of engagement left in the collars at full extension',
    })
    rig.attach(lift.id, topYoke(lib))

    const tip = rig.add({
      id: `top-${side}`,
      parent: `top-lift-${side}`,
      label: 'mid-top (tip upright)',
      pivot: [0, 0, 0],
      joint: 'hinge',
      axis: [0, 0, 1],
      range: [0, Math.PI / 2],
      stage: 5,
      mass: 17.9,
      com: [-mm(40), -mm(135.5), 0],
      hulls: [
        { c: [TOP_LIE_X - COL_X, TOP_LIE_Y - PIN_Y, 0], s: [TOP.h, TOP.d, TOP.w], tag: 'DZR10' },
      ],
      mates: [`top-lift-${side}`, `tray-${side}`],
      note: 'lands 1947 mm over the road, aimed down 8° at the crowd',
    })
    rig.attach(tip.id, topBox(lib))
  }

  // --- the mast ------------------------------------------------------------
  // The 24730 cannot stand on this deck: 1405 stowed against a 1120 ceiling. It
  // lies flat down the 270 mm centre channel between the trays, its column
  // clamped in two split shaft collars on a plate that hinges off a plinth at
  // the headboard, and swings up through a quarter turn before a single crank
  // handle does the rest.
  const swing = rig.add({
    id: 'mast-swing',
    parent: 'floor',
    label: 'light mast (swing up)',
    pivot: [MAST_X, FLOOR + MAST_Y, 0],
    joint: 'hinge',
    axis: [0, 0, 1],
    // Authored lying aft along -X; a quarter turn the negative way stands it up.
    range: [0, -Math.PI / 2],
    stage: 1,
    mass: 12,
    com: [-MAST_STOW / 2, 0, 0],
    hulls: [{ c: [-MAST_STOW / 2, 0, 0], s: [MAST_STOW, mm(120), mm(120)], tag: 'K&M 24730' }],
    mates: ['floor'],
    note: 'braced back to the truck’s torii — a frame crossmember, not the deck ply',
  })
  rig.attach(swing.id, mastColumn(lib))

  const crank = rig.add({
    id: 'mast-crank',
    parent: 'mast-swing',
    label: 'mast (crank up)',
    pivot: [-MAST_STOW, 0, 0],
    joint: 'telescope',
    axis: [-1, 0, 0],
    range: [0, MAST_CRANK],
    stage: 2,
    mass: 8,
    com: [mm(700), 0, 0],
    hulls: [{ c: [mm(700), 0, 0], s: [mm(1400), mm(96), mm(96)], tag: 'inner section' }],
    // Nested sections share space by design when retracted.
    mates: ['mast-swing', 'floor'],
  })
  rig.attach(crank.id, mastInner(lib))

  // The wing of lights: two 1 m box trusses that stow lying down the mast and
  // swing out to a 2 m span. They are STAGGERED 370 mm fore-and-aft, because two
  // 220 mm trusses cannot both fold flat against a 120 mm column on the same
  // line — one has to pass the other. The stagger is the design, not a slip.
  for (const [side, sz] of [['l', -1], ['r', 1]]) {
    const arm = rig.add({
      id: `light-arm-${side}`,
      parent: 'mast-crank',
      label: 'light wing',
      pivot: [0, sz * WING_OFF, 0],
      joint: 'hinge',
      axis: [0, 1, 0],
      // Authored pointing back down the mast; a quarter turn brings it out
      // square. Right hand rule about +Y sends +X to -Z, so the sign follows
      // the side — get it backwards and both wings fold onto the same flank.
      range: [0, -sz * (Math.PI / 2)],
      stage: 6,
      mass: 5 + 2.2 + (side === 'l' ? 2.7 : 0) + 0.6 * 3 + 0.35 * 5,
      com: [WING_L * 0.45, 0, 0],
      hulls: [{ c: [WING_L / 2, 0, 0], s: [WING_L, WING_S, WING_S], tag: 'TRUSS4 + fixtures' }],
      mates: ['mast-crank', 'mast-swing'],
      note: 'fixtures recessed inside the 220 mm truss so the wing folds with them on',
    })
    rig.attach(arm.id, lightWing(lib, side === 'l'))
  }

  // --- the booth -----------------------------------------------------------
  // Three panels in a carpenter's-rule chain, folding out of a 96 mm stack into
  // a 950 mm fascia with a counter on top. The pin alternates faces down the
  // chain — +t, -t, +t — and each panel is anchored to put the right face on
  // its own pin. See foldPanel() in common.js for why that alternation is the
  // whole game.
  const lower = rig.add({
    id: 'booth-lower',
    parent: 'floor',
    label: 'booth fascia (lower)',
    pivot: [BOOTH_X, FLOOR, 0],
    joint: 'hinge',
    axis: [0, 0, 1],
    range: [0, Math.PI / 2],
    stage: 3,
    mass: 10,
    com: [BOOTH_PANEL / 2, 0, 0],
    hulls: foldPanelHull(BOOTH_PANEL, BOOTH_W, PANEL_T, 'fascia', -1),
    mates: ['floor', 'gate-tail'],
  })
  rig.attach(lower.id, foldPanel(lib, BOOTH_PANEL, BOOTH_W, PANEL_T, { face: lib.aluDark, anchorY: -1 }))
  rig.attach(lower.id, hingeZ(lib, BOOTH_W))
  rig.attach(lower.id, fasciaLights(lib))

  const upper = rig.add({
    id: 'booth-upper',
    parent: 'booth-lower',
    label: 'booth fascia (upper)',
    pivot: [BOOTH_PANEL, PANEL_T, 0],
    joint: 'hinge',
    axis: [0, 0, 1],
    range: [Math.PI, 0],
    stage: 4,
    mass: 10,
    com: [BOOTH_PANEL / 2, 0, 0],
    hulls: foldPanelHull(BOOTH_PANEL, BOOTH_W, PANEL_T, 'fascia', 1),
    mates: ['booth-lower'],
  })
  rig.attach(upper.id, foldPanel(lib, BOOTH_PANEL, BOOTH_W, PANEL_T, { face: lib.aluDark, anchorY: 1 }))
  rig.attach(upper.id, hingeZ(lib, BOOTH_W))
  rig.attach(upper.id, latch(lib, [mm(70), -PANEL_T, BOOTH_W / 2 - mm(110)]))
  rig.attach(upper.id, latch(lib, [mm(70), -PANEL_T, -BOOTH_W / 2 + mm(110)]))

  const counter = rig.add({
    id: 'counter',
    parent: 'booth-upper',
    label: 'DJ counter',
    pivot: [BOOTH_PANEL, -PANEL_T, 0],
    joint: 'hinge',
    axis: [0, 0, 1],
    // Folded back onto the upper at rest; three quarters of a turn brings it to
    // square, pointing back over the deck at the DJ.
    range: [Math.PI, Math.PI * 1.5],
    stage: 5,
    mass: 12,
    com: [BOOTH_PANEL / 2, 0, 0],
    hulls: foldPanelHull(BOOTH_PANEL, BOOTH_W, PANEL_T, 'counter', -1),
    mates: ['booth-upper'],
    note: 'lands 982 mm above the stage floor — standing height for the DJ',
  })
  rig.attach(counter.id, foldPanel(lib, BOOTH_PANEL, BOOTH_W, PANEL_T, { anchorY: -1 }))
  rig.attach(counter.id, hingeZ(lib, BOOTH_W))
  rig.attach(counter.id, decks(lib))

  // The counter is a 475 mm shelf on the end of a 950 mm cantilever, and its
  // hinge carries no moment. A prop underneath would work but has nowhere flat
  // to stow; two triangular END CHEEKS do the same job better and stow perfectly,
  // because a right triangle folded flat onto the fascia is still a flat panel.
  // They also give the counter a moment connection rather than a pinned one,
  // and — not incidentally — a booth with cheeks looks like a booth.
  for (const [n, sz] of [['l', -1], ['r', 1]]) {
    const cheek = rig.add({
      id: `cheek-${n}`,
      parent: 'booth-upper',
      label: 'booth end cheek',
      pivot: [0, -PANEL_T, sz * (BOOTH_W / 2 - mm(30))],
      joint: 'hinge',
      axis: [1, 0, 0],
      // Lying flat on the fascia at rest, reaching INBOARD across its face; a
      // quarter turn stands each one up in the plane the counter needs holding
      // in. THE SIGN OF THAT QUARTER TURN IS WHICH SIDE THE BRACKET ENDS UP ON,
      // and it was the wrong one: the cheeks stood up reaching AFT, out over the
      // crowd, where a bracket holds up nothing at all. The counter cantilevers
      // forward toward the DJ, so its support has to be forward too. Free to
      // check and easy to get backwards — the counter's hull runs x -940 to -465
      // and the cheeks now run with it instead of away from it.
      range: [0, -sz * Math.PI / 2],
      stage: 6,
      mass: 3,
      com: [BOOTH_PANEL * 0.4, 0, sz * -BOOTH_PANEL * 0.25],
      // Two boxes rather than one, so the hull follows the triangle instead of
      // enclosing the counter it is meant to sit under.
      hulls: [
        { c: [BOOTH_PANEL * 0.5, 0, sz * -mm(60)], s: [BOOTH_PANEL, mm(36), mm(120)], tag: 'cheek' },
        { c: [BOOTH_PANEL * 0.78, 0, sz * -mm(210)], s: [BOOTH_PANEL * 0.44, mm(36), mm(180)], tag: 'cheek' },
      ],
      mates: ['booth-upper', 'counter', 'booth-lower'],
    })
    rig.attach(cheek.id, cheekPanel(lib, sz))
  }

  return {
    massBudget: [
      ['subframe + stage floor', 36],
      ['trays, slides, drop legs and feet', 48],
      ['subwoofers (2) + capture wells', 90],
      ['mid-tops (2), lift columns, yokes', 55],
      ['mast, plinth, wings and fixtures', 44],
      ['booth: fascia, counter, cheeks', 28],
      ['stabiliser jacks (4)', 18],
      ['power station, control, cable', 28],
    ],
    notes: [
      'Weight, not space, is the binding constraint: the deck has 2.7 m² and 1120 mm of headroom, and 350 kg of payload. The build lands at 347.',
      'Nothing on this module hangs off a speaker cabinet. The subs are captured in wells with battens into the cast handle apertures; only the DZR10s are bolted, and only because their M10 × 8 pattern is rated for it.',
      'The tops rise BEFORE they tip. Tip first and the box’s trailing corner swings 130 mm into the sub it is standing on — the auditor catches it, and so does a tape measure.',
      'The mast is cranked to 900 of its 1595 mm of travel, which puts the fixtures 3.5 m over the road and the top chord at 3.6. Wind it to the stop for 4.3 m if the site and the wind allow; the stand is rated 40 kg and the wing pair weighs 21.',
      'Four jacks take the truck off its leaf springs. Without them the whole vehicle rolls the moment the DJ shifts weight — and the DJ’s own 75 kg is carried by the jacks, not the axles.',
      'Two hours and a half at 800 W from the DELTA 2 Max. The 4096 Wh Pro 3 would double it and cost 51.5 kg, which this module does not have.',
    ],
  }
}

// --- geometry ---------------------------------------------------------------

function stageFloorDetail(lib) {
  const g = new THREE.Group()
  // Anti-slip strips across the standing area, and a cable trough down the spine.
  for (let i = -2; i <= 2; i++) {
    g.add(slab([mm(120), mm(6), mm(900)], lib.aluDark, { pos: [i * mm(300) - mm(200), FLOOR + mm(3), 0] }))
  }
  g.add(slab([mm(700), mm(26), mm(180)], lib.aluDark, { pos: [mm(500), FLOOR - mm(2), 0] }))
  return g
}

/**
 * The plinth the mast hinges off: a slim tower against the headboard, braced
 * back into the torii guard, which is the strongest hard point on the vehicle —
 * bolted through the deck into a frame crossmember and triangulated by the cab.
 */
function mastPlinth(lib) {
  const g = new THREE.Group()
  const top = FLOOR + MAST_Y - mm(80)
  g.add(slab([mm(200), MAST_Y - mm(80), mm(190)], lib.aluDark, { anchor: [0, -1, 0], pos: [MAST_X, FLOOR, 0] }))
  g.add(slab([mm(260), mm(22), mm(240)], lib.galv, { pos: [MAST_X, top, 0] }))
  for (const s of [-1, 1]) {
    g.add(rod([MAST_X + mm(60), top, s * mm(80)], [MAST_X + mm(330), FLOOR + mm(1040), s * mm(540)], mm(16), lib.steelRod))
    g.add(rod([MAST_X - mm(60), top, s * mm(80)], [MAST_X - mm(300), FLOOR + mm(20), s * mm(150)], mm(14), lib.steelRod))
  }
  return g
}

function trayGeometry(lib) {
  const g = new THREE.Group()
  // Tray pan and its slide rails.
  g.add(slab([TRAY_L, TRAY_T, TRAY_W], lib.aluDark, { anchor: [0, -1, 0] }))
  g.add(slab([TRAY_L - mm(40), mm(8), TRAY_W - mm(40)], lib.alu, { pos: [0, TRAY_T, 0] }))
  for (const s of [-1, 1]) {
    g.add(extrusion([-TRAY_L / 2, TRAY_T / 2, s * (TRAY_W / 2 - mm(30))], [TRAY_L / 2, TRAY_T / 2, s * (TRAY_W / 2 - mm(30))], mm(44), lib.alu))
  }

  // THE WELL. A DXS15XLF has no base inserts and no flypoints — the only
  // threaded feature on the whole cabinet is the pole socket in its top, and
  // that is a compression fitting. So it is not bolted down at all: it drops
  // into a three-sided plywood well, two hardwood battens hook into the cast
  // side-handle apertures, and one endless ratchet strap over the top stops it
  // rocking. The strap never has to hold 40 kg — the well does.
  const wx = SUB_CX
  const well = new THREE.Group()
  well.position.set(wx, TRAY_T, 0)
  for (const s of [-1, 1]) {
    well.add(slab([SUB.d + mm(40), mm(150), mm(18)], lib.ply, { anchor: [0, -1, 0], pos: [0, 0, s * (SUB.w / 2 + mm(9))] }))
  }
  well.add(slab([mm(18), mm(150), SUB.w + mm(36)], lib.ply, { anchor: [0, -1, 0], pos: [-SUB.d / 2 - mm(9), 0, 0] }))
  g.add(well)

  // Bass bin: a ported 15", front-loaded, facing the crowd (-X).
  const bin = new THREE.Group()
  bin.position.set(wx, TRAY_T, 0)
  bin.add(slab([SUB.d, SUB.h, SUB.w], lib.speakerBox, { anchor: [0, -1, 0] }))
  bin.add(slab([mm(24), SUB.h - mm(90), SUB.w - mm(70)], lib.speakerGrille, { pos: [-SUB.d / 2 - mm(6), SUB.h / 2 + mm(20), 0] }))
  // The port slot, which is what makes a bass bin read as a bass bin.
  bin.add(slab([mm(30), mm(110), SUB.w - mm(180)], lib.trim, { pos: [-SUB.d / 2 - mm(10), mm(90), 0] }))
  for (const s of [-1, 1]) {
    // Cast handle recess — and the batten that hooks into it.
    bin.add(slab([mm(140), mm(50), mm(22)], lib.aluDark, { pos: [0, SUB.h - mm(140), s * (SUB.w / 2 + mm(4))] }))
    bin.add(slab([mm(190), mm(34), mm(26)], lib.plyEdge, { pos: [0, SUB.h - mm(140), s * (SUB.w / 2 + mm(16))] }))
  }
  // Top panel with the Ø35 / M20 dual socket, unused here and capped.
  bin.add(slab([SUB.d - mm(60), mm(14), SUB.w - mm(60)], lib.aluDark, { pos: [0, SUB.h, 0] }))
  bin.add(slab([mm(56), mm(16), mm(56)], lib.galv, { pos: [0, SUB.h + mm(8), 0] }))
  // The strap.
  bin.add(slab([mm(26), SUB.h + mm(30), SUB.w + mm(40)], lib.trim, { pos: [mm(180), SUB.h / 2, 0] }))
  g.add(bin)

  // The two lift columns: Ø35 outer tubes in flanged bosses recessed into the
  // pan, with the split collars that take the yoke's reaction.
  for (const s of [-1, 1]) {
    const cz = s * COL_Z
    g.add(slab([mm(150), mm(16), mm(150)], lib.galv, { pos: [COL_X, TRAY_T, cz] }))
    g.add(rod([COL_X, COL_BASE, cz], [COL_X, PIN_Y, cz], mm(24), lib.alu))
    g.add(slab([mm(66), mm(40), mm(66)], lib.aluDark, { pos: [COL_X, PIN_Y - mm(20), cz] }))
  }
  return g
}

/**
 * The yoke that the mid-top hangs in, on the tops of the two distance rods.
 *
 * Authored about the trunnion pin at (0,0,0), with the rods running DOWN from
 * it — which is how a telescope authored along +Y has to be drawn, because the
 * part's origin is the moving end.
 */
function topYoke(lib) {
  const g = new THREE.Group()
  for (const s of [-1, 1]) {
    const cz = s * COL_Z
    g.add(rod([0, mm(20), cz], [0, -mm(830), cz], mm(17), lib.alu))
    // Cheek plate and the stub axle that reaches in to the box's side inserts.
    g.add(slab([mm(150), mm(190), mm(14)], lib.aluDark, { pos: [-mm(20), -mm(40), cz - s * mm(14)] }))
    g.add(rod([0, 0, cz - s * mm(20)], [0, 0, s * (TOP.w / 2 - mm(10))], mm(11), lib.steelRod))
  }
  g.add(slab([mm(90), mm(26), 2 * COL_Z - mm(40)], lib.galv, { pos: [-mm(60), -mm(150), 0] }))
  return g
}

/**
 * The DZR10, authored LYING — grille up, because a quarter turn about +Z sends
 * the box's +Y face to -X, and -X is where the crowd is.
 */
function topBox(lib) {
  const g = new THREE.Group()
  const cx = TOP_LIE_X - COL_X
  const cy = TOP_LIE_Y - PIN_Y
  const b = new THREE.Group()
  b.position.set(cx, cy, 0)
  b.add(slab([TOP.h, TOP.d, TOP.w], lib.speakerBox))
  b.add(slab([TOP.h - mm(60), mm(20), TOP.w - mm(50)], lib.speakerGrille, { pos: [mm(10), TOP.d / 2 + mm(5), 0] }))
  // Bass reflex slot at what becomes the bottom of the front face.
  b.add(slab([mm(90), mm(24), TOP.w - mm(140)], lib.trim, { pos: [-TOP.h / 2 + mm(70), TOP.d / 2 + mm(8), 0] }))
  // The rigging pattern that made this box the one: M10 x 8 in the sides.
  for (const s of [-1, 1]) {
    for (const dx of [-mm(150), mm(0), mm(150)]) {
      b.add(slab([mm(26), mm(26), mm(10)], lib.galv, { pos: [dx, 0, s * (TOP.w / 2 + mm(3))] }))
    }
  }
  // Amp pack and handle on what becomes the back.
  b.add(slab([TOP.h - mm(180), mm(18), TOP.w - mm(120)], lib.aluDark, { pos: [0, -TOP.d / 2 - mm(6), 0] }))
  g.add(b)
  return g
}

/** The 24730's outer column, lying aft along -X from its collar plate. */
function mastColumn(lib) {
  const g = new THREE.Group()
  // anchor +1 puts the box's MAX face on the origin, i.e. it runs aft along -X.
  g.add(slab([MAST_STOW, mm(112), mm(112)], lib.aluDark, { anchor: [1, 0, 0] }))
  // Two split shaft collars — K&M ship no column flange, so this is the fixing.
  for (const x of [-mm(120), -mm(560)]) {
    g.add(slab([mm(70), mm(150), mm(150)], lib.galv, { pos: [x, 0, 0] }))
  }
  // The crank handle and its winch drum, at the base end where a hand reaches it.
  g.add(rod([-mm(200), 0, mm(70)], [-mm(200), 0, mm(150)], mm(12), lib.steelRod))
  g.add(slab([mm(40), mm(150), mm(20)], lib.aluDark, { pos: [-mm(200), mm(70), mm(150)] }))
  return g
}

/** The inner section, drawn running back down inside the outer one. */
function mastInner(lib) {
  const g = new THREE.Group()
  // Authored running back DOWN the mast from the head, 1400 long so that at full
  // crank 200 mm is still swallowed by the outer section and at rest it is flush.
  g.add(slab([mm(1400), mm(88), mm(88)], lib.alu, { anchor: [-1, 0, 0] }))
  // Head plate: TRUSS4/BP/22 base plate face-up on the Ø35 spigot.
  g.add(slab([mm(24), mm(300), mm(300)], lib.galv))
  g.add(rod([0, 0, 0], [-mm(90), 0, 0], mm(17), lib.chrome))
  return g
}

/**
 * One wing: a 1 m box truss with its fixtures recessed INSIDE the 220 mm depth,
 * authored along +X so that it stows lying back down the mast.
 *
 * Recessing the fixtures is not a styling choice. A wing that folds against the
 * column arrives with whatever hangs below it pointing straight at the column,
 * and 280 mm of moving head beside a 120 mm mast is an interference rather than
 * a light rig. A SLIMPAR12 is 89 mm deep and its yoke and clamp add 60, so 150
 * of the truss's 220 swallows the lot and the wing folds with the fixtures on.
 */
function lightWing(lib, isLeft) {
  const g = new THREE.Group()
  const t = truss(WING_L, WING_S, WING_S, lib.alu, { chord: mm(35), bays: 5 })
  t.position.y = -WING_S / 2
  g.add(t)
  // Pin-and-R-clip coupler at the root.
  g.add(slab([mm(26), mm(260), mm(260)], lib.galv, { pos: [mm(13), 0, 0] }))

  if (isLeft) {
    // ELIMINATOR MINI PAR BAR — 730 x 89 x 205, four RGBW cans on one bar.
    g.add(slab([mm(730), mm(89), mm(205)], lib.aluDark, { pos: [mm(430), -mm(20), 0] }))
    for (let i = 0; i < 4; i++) {
      const x = mm(160) + i * mm(180)
      g.add(slab([mm(120), mm(40), mm(120)], i % 2 ? lib.ledMagenta : lib.ledCyan, { pos: [x, -mm(72), 0] }))
      const beam = new THREE.PointLight(i % 2 ? 0xff3cae : 0x33e0ff, 2.6, 6, 2)
      beam.position.set(x, -mm(150), 0)
      g.add(beam)
    }
  } else {
    // Three SLIMPAR12s on CCLAMPs, alternating up and down the chord.
    for (let i = 0; i < 3; i++) {
      const x = mm(200) + i * mm(300)
      g.add(slab([mm(60), mm(90), mm(50)], lib.galv, { pos: [x, mm(75), 0] }))
      g.add(slab([mm(193), mm(89), mm(180)], lib.aluDark, { pos: [x, -mm(10), 0] }))
      g.add(slab([mm(150), mm(30), mm(140)], i % 2 ? lib.ledWarm : lib.ledMagenta, { pos: [x, -mm(64), 0] }))
      const beam = new THREE.PointLight(i % 2 ? 0xffb347 : 0xff3cae, 2.6, 6, 2)
      beam.position.set(x, -mm(150), 0)
      g.add(beam)
    }
  }
  // Safety bond per fixture, plus the tip stay back to the coupler plate.
  g.add(stay(lib, [mm(20), mm(100), 0], [WING_L - mm(60), mm(20), 0], { radius: mm(4) }))
  return g
}

/** A leg strut, authored along +X from its hinge — the frame it stows in. */
function legStrut(lib, length) {
  const g = new THREE.Group()
  g.add(slab([length, mm(48), mm(48)], lib.alu, { anchor: [-1, 0, 0] }))
  g.add(slab([mm(70), mm(64), mm(64)], lib.aluDark, { pos: [mm(20), 0, 0] }))
  // Over-centre lock at the knuckle: a leg on a plain pivot is a hinge, and a
  // hinge carries no moment, so nothing would stop it folding back up under load.
  g.add(rod([mm(40), mm(38), 0], [mm(190), mm(14), 0], mm(9), lib.steelRod))
  return g
}

/** The telescoping foot at the end of a leg. */
function footPad(lib) {
  const g = new THREE.Group()
  g.add(slab([mm(380), mm(38), mm(38)], lib.aluDark, { anchor: [-1, 0, 0] }))
  g.add(slab([mm(22), mm(160), mm(160)], lib.aluDark, { pos: [mm(371), 0, 0] }))
  g.add(slab([mm(14), mm(180), mm(180)], lib.rubberFoot, { pos: [mm(387), 0, 0] }))
  return g
}

/**
 * A triangular end cheek, authored lying FLAT in the XZ plane so that the rig's
 * quarter turn about X stands it up into the XY plane where it does its work.
 *
 * Vertices: the vertical edge on the fascia, the horizontal edge under the
 * counter, and the hypotenuse between them — a plain right triangle, which is
 * the only shape that both carries a corner moment and folds to nothing.
 */
function cheekPanel(lib, sz) {
  const g = new THREE.Group()
  const L = BOOTH_PANEL
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.lineTo(L, 0)
  shape.lineTo(L, -L * 0.92)
  shape.lineTo(L * 0.72, -L * 0.92)
  shape.closePath()
  const geo = new THREE.ExtrudeGeometry(shape, { depth: mm(28), bevelEnabled: false })
  geo.rotateX(Math.PI / 2) // authored in XY, laid down into XZ
  if (sz < 0) geo.scale(1, 1, -1)
  geo.computeVertexNormals()
  const m = new THREE.Mesh(geo, lib.aluDark)
  m.castShadow = true
  m.receiveShadow = true
  g.add(m)
  return g
}

/** LED strip lit into the booth fascia — the face the crowd actually looks at. */
function fasciaLights(lib) {
  const g = new THREE.Group()
  for (let i = 0; i < 5; i++) {
    const x = mm(70) + i * mm(85)
    g.add(slab([mm(40), PANEL_T + mm(10), BOOTH_W - mm(160)], i % 2 ? lib.ledCyan : lib.ledMagenta, { pos: [x, 0, 0] }))
  }
  return g
}

/**
 * What is actually on the counter, and why it is recessed rather than sat on.
 *
 * The DDJ-FLX4 has no mount points at all — four rubber feet, and a 482 mm width
 * that is within a millimetre of nineteen inches and will tempt you to rack it.
 * It has no rack ears and no provision for them. Both it and the MG10XU sit in
 * routed recesses with hinged retaining bars, so the counter can fold with them
 * still in place.
 */
function decks(lib) {
  const g = new THREE.Group()
  const y = PANEL_T / 2
  // Pioneer DDJ-FLX4: 482 x 59 x 273, in a 486 x 277 x 12 recess.
  g.add(slab([mm(273), mm(14), mm(482)], lib.trim, { pos: [mm(230), y - mm(4), -mm(120)] }))
  g.add(slab([mm(273), mm(59), mm(482)], lib.trim, { pos: [mm(230), y + mm(28), -mm(120)] }))
  for (const s of [-1, 1]) {
    const platter = new THREE.Mesh(new THREE.CylinderGeometry(mm(84), mm(84), mm(10), 22), lib.chrome)
    platter.position.set(mm(180), y + mm(60), -mm(120) + s * mm(170))
    g.add(platter)
  }
  for (let i = 0; i < 8; i++) {
    g.add(slab([mm(24), mm(10), mm(20)], i % 2 ? lib.ledWarm : lib.ledCyan, { pos: [mm(310), y + mm(60), -mm(280) + i * mm(45)] }))
  }
  // Yamaha MG10XU: 244 x 71 x 294.
  g.add(slab([mm(294), mm(71), mm(244)], lib.trim, { pos: [mm(240), y + mm(34), mm(320)] }))
  for (let i = 0; i < 5; i++) {
    g.add(slab([mm(18), mm(8), mm(16)], lib.ledCyan, { pos: [mm(200), y + mm(72), mm(240) + i * mm(40)] }))
  }
  // Retaining bars — the reason the counter can fold with the kit aboard.
  for (const zz of [-mm(120), mm(320)]) {
    g.add(rod([mm(90), y + mm(70), zz - mm(260)], [mm(90), y + mm(70), zz + mm(260)], mm(9), lib.chrome))
  }
  return g
}
