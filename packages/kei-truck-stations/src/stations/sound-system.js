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
// flanks carrying the subs; the mid-tops ride up a pair of posts and tip
// upright at the top; a scaffold T lies flat down the centre channel and swings
// up to hang lights over the whole thing; and a three-panel booth stands off the
// tail with its fascia facing the crowd.
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
// SECOND: THERE ARE NO AMPLIFIERS ON THIS TRUCK, and that is a finding rather
// than an omission. Every box is active and every box is self-contained. The
// PRX918XLF carries 2000 W of fanless Class D with 6-band parametric EQ, delay
// and a selectable crossover already in the cabinet; the DZR10 carries 2000 W
// bi-amped behind a 96 kHz FIR crossover. There is no rack amp, no outboard
// DSP, no speakON cable and no processing rack anywhere in the build — the
// mixer's XLR outs go straight to the subs and the subs' thru feeds the tops.
// What the boxes do NOT provide is mains: not one of them has an AC thru, so
// four cabinets need four outlets, and that is why the list carries two
// earth-leakage cord reels and a distribution block instead of an amp rack.
//
// THIRD, and this is the one that shaped the trays: MAXIMISING THE SUB EVICTED
// THE MID-TOP FROM ITS ROOF. A 610 mm tray takes the biggest 18 in the class,
// a JBL PRX918XLF at 591 wide and 693 tall — an octave lower than the pair of
// 15s it replaces for 1.4 kg more. But tray 60 plus 693 plus a DZR10 lying on
// it is 1098, which is 88 over the packing ceiling. So the top does not ride on
// the sub at all: it travels flat in its own bay forward of it and winds up a
// pair of K&M distance rods before it tips. Both moves are in the step list in
// that order, and the auditor checks the arc.
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
// 610 wide each, and that number is the loudspeaker's. A JBL PRX918XLF is 591
// across; the deck is 1410; 610 + 610 + a 190 mm centre channel closes it
// exactly, and the channel is what the light mast lies in.
const TRAY_T = mm(60)
const TRAY_L = mm(1360)
const TRAY_W = mm(610)
const TRAY_TRAVEL = mm(610) // LAMP 3509-24, 632 mm of stroke
const TRAY_CX = mm(240)
const TRAY_CZ = mm(400)

// JBL PRX918XLF, as installed: 654 deep in X because it faces the crowd, 591
// across the tray, 693 tall. Yamaha DZR10: 345 x 315 x 537.
const SUB = { d: mm(654), w: mm(591), h: mm(693) }
const TOP = { d: mm(345), w: mm(315), h: mm(537) }
const SUB_CX = -mm(353) // sub on the tray's aft half

// THE 18-INCH BOX EVICTED THE MID-TOP FROM ITS ROOF. Tray 60 plus a DXS15XLF's
// 587 plus a DZR10 lying on it was 992, and that fitted. The same sum with a
// PRX918XLF's 693 is 1098, which is 1208 above the deck and 88 over the ceiling
// — and lying the top on its back instead of its side only buys 30 of it. So
// the mid-top travels FORWARD of the sub, flat in the tray's own bay, and goes
// up a pair of posts instead of off the sub's roof.
const POST_X = mm(466) //  the lift posts, either side of the mid-top's bay
const POST_Z = mm(230)
const POST_H = mm(945)
const CARRIAGE_Y = mm(368) // the trunnion, level with the lying box's upper inserts
const CARRIAGE_RISE = mm(527)
const TOP_LIE_X = mm(330) // the box's lying centre
const TOP_LIE_Y = TRAY_T + TOP.d / 2

// THE LIGHT RIG IS A SCAFFOLD GOALPOST, and the research behind it is worth the
// paragraph. The brief was a frame that unfolds onto the cab roof. It cannot: an
// S500P roof is 0.7 mm steel over three hoops with no threaded provision
// anywhere, and the failure mode is not pressure but the overturning moment — a
// 1.5 m mast with 5 kg on top needs one gust to put 75 N·m into a panel that
// oil-cans under a hand. There IS a rated carrier for this truck, a TUFREQ
// KF326A+ at 50 kg through the gutters, and it is a SHELF, not a foundation:
// gutter clamps react vertical load by friction and never contemplate a lever.
// The roof is also 1780 above the road against a 2000 kei limit, so building up
// from it starts you 220 mm from the ceiling.
//
// So the frame clears the roof entirely: one 単管 mast off a base plate
// through-bolted to the front crossmember, and a crossbar 380 above the cab roof
// line. Cheap, rudimentary and certified — φ48.6 scaffold pipe is 労働安全衛生
// 規則 material, and STAGE EVOLUTION's φ48-51 lighting clamps fit it exactly,
// which is the coincidence the whole rig is built on. It replaces ¥85,000 of
// crank-up mast with about ¥1,200 of pipe.
const MAST_X = mm(870)
const MAST_Y = mm(250) // the pipe lies this high — set by the booth stack under it
const MAST_H = mm(1740) // crossbar at 2550 over the road, 770 clear of the cab roof
const BAR_LEN = mm(1400)

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
    'trays glide out',
    'legs down, light frame swings up',
    'feet out, booth fascia stands',
    'fascia extends, mid-tops wind up',
    'counter over, tops tip upright',
    'end cheeks up',
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
  rig.attach(base.id, mastFoot(lib))

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
        // The two lift posts are part of the tray: they stand on it and ride out
        // with it.
        { c: [POST_X, TRAY_T + POST_H / 2, POST_Z], s: [mm(64), POST_H, mm(64)], tag: 'lift post' },
        { c: [POST_X, TRAY_T + POST_H / 2, -POST_Z], s: [mm(64), POST_H, mm(64)], tag: 'lift post' },
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
        footprint: [mm(200), 0, 0],
        hulls: [{ c: [mm(100), 0, 0], s: [mm(200), mm(38), mm(38)], tag: 'foot' }],
        mates: ['ground', `tray-leg-${side}${n}`, `tray-${side}`],
      })
      rig.attach(foot.id, footPad(lib))
    }

    // THE MID-TOP GOES UP, THEN TIPS — in that order, and the order is forced.
    //
    // It travels lying flat in the bay forward of the sub, because an 18-inch
    // box is 693 tall and a DZR10 lying on its roof would be 1208 above the deck
    // against a 1120 ceiling. A carriage winds up the two posts on a strap, and
    // only then does the box rotate: the trunnion is level with the box's upper
    // side inserts, so tipping it where it lies would swing its far bottom
    // corner 86 mm through the tray pan. 527 of lift puts the arc clear.
    //
    // The tip is a real hinge and not a hand lift only because the DZR10 has
    // M10 x 8 and M8 x 2 inserts: a bolted aluminium yoke is possible on this
    // box and on almost nothing else in its class.
    const lift = rig.add({
      id: `top-lift-${side}`,
      parent: `tray-${side}`,
      label: 'mid-top carriage',
      pivot: [POST_X, CARRIAGE_Y, 0],
      joint: 'slide',
      axis: [0, 1, 0],
      range: [0, CARRIAGE_RISE],
      stage: 4,
      mass: 6,
      com: [-mm(60), 0, 0],
      hulls: [
        { c: [0, 0, POST_Z], s: [mm(150), mm(190), mm(90)], tag: 'carriage' },
        { c: [0, 0, -POST_Z], s: [mm(150), mm(190), mm(90)], tag: 'carriage' },
      ],
      mates: [`tray-${side}`],
      note: 'winds up on a 2:1 strap — 20 kg at the handle becomes 10',
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
      com: [TOP_LIE_X - POST_X, TOP_LIE_Y - CARRIAGE_Y, 0],
      hulls: [
        { c: [TOP_LIE_X - POST_X, TOP_LIE_Y - CARRIAGE_Y, 0], s: [TOP.h, TOP.d, TOP.w], tag: 'DZR10' },
      ],
      mates: [`top-lift-${side}`, `tray-${side}`],
      note: 'acoustic centre lands 1665 mm over the road — ear height for a standing crowd',
    })
    rig.attach(tip.id, topBox(lib))
  }

  // --- the light rig -------------------------------------------------------
  // ONE RIGID T, ONE HINGE. The first version folded the crossbar off the mast
  // the way the shrine's torii carries its lintel, and that cannot work here:
  // the yatai's header ends up running fore-and-aft, so a turn about the
  // vertical gets it there, and NO rotation about Z will ever move a vector out
  // of the XY plane. This bar has to end up across the truck. Turning it about
  // the mast's own local Y does that, but then the fixtures — which have to hang
  // DOWN when it is up — sweep through the cab on the way.
  //
  // So nothing folds. A 1740 mm mast with a 1400 mm crossbar across its head,
  // lying flat down the deck with the bar at the tail and the fixtures pointing
  // forward along it, and one quarter turn stands the whole thing up with the
  // fixtures pointing at the floor. That is more rudimentary than the version it
  // replaces in every sense: one moving part, one pipe joint, no crank.
  //
  // The arc is the thing to check, and it clears by geometry rather than by
  // luck: the crossbar is only below the tops of the loaded trays while it is
  // within 20 degrees of flat, and at 20 degrees it is still at x = -765, three
  // hundred millimetres aft of where the trays begin.
  const mast = rig.add({
    id: 'mast',
    parent: 'floor',
    label: 'light T-frame (単管 φ48.6)',
    pivot: [MAST_X, FLOOR + MAST_Y, 0],
    joint: 'hinge',
    axis: [0, 0, 1],
    // Authored lying aft along -X; a quarter turn the negative way stands it up.
    range: [0, -Math.PI / 2],
    // AFTER the trays, not with them. The frame sweeps a 1740 mm arc up the
    // middle of the deck, and while it is within about 25 degrees of flat its
    // crossbar and fixtures are lower than a loaded tray. Once the trays are out
    // the middle of the deck is empty and the arc has nothing to hit.
    stage: 2,
    mass: 8 + 4 + 7,
    com: [-MAST_H * 0.6, 0, 0],
    hulls: [
      { c: [-MAST_H / 2, 0, 0], s: [MAST_H, mm(56), mm(56)], tag: 'mast' },
      { c: [-MAST_H + mm(30), 0, 0], s: [mm(60), mm(56), BAR_LEN], tag: 'crossbar' },
      { c: [-MAST_H + mm(230), 0, 0], s: [mm(400), mm(200), BAR_LEN - mm(160)], tag: 'fixtures' },
    ],
    mates: ['floor'],
    note: '2.08 kg/m of certified scaffold pipe instead of ¥85,000 of crank-up stand',
  })
  rig.attach(mast.id, lightFrame(lib))

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
      ['trays, slides, drop legs and feet', 50],
      ['subwoofers (2 × 18") + capture wells', 93],
      ['mid-tops (2), lift posts, carriages', 58],
      ['light T-frame: pipe, bases, clamps, fixtures', 36],
      ['booth: fascia, counter, cheeks', 28],
      ['stabiliser jacks (4)', 18],
      ['power, control, cable', 28],
    ],
    notes: [
      'NO AMPLIFIERS. Every box on this truck is active — the PRX918XLF carries 2000 W of fanless Class D with 6-band PEQ, delay and a selectable crossover; the DZR10 carries 2000 W bi-amped with a 96 kHz FIR crossover. There is no rack amp, no external processor and no speakON cable anywhere in the build. The passive alternative prices out the same, weighs 13 kg more and gives each box a third of the power.',
      'What IS still needed is the part people forget: NONE of these boxes has an AC thru. They daisy-chain signal and never power, so four boxes means four outlets — two earth-leakage cord reels, which is also how you get two circuits. A steel truck body feeding metal-grilled boxes standing on wet ground is the case the 漏電遮断器 exists for. The hum loop gets lifted at the DI, never at the mains earth.',
      'The 18-inch box was free on payload and expensive on geometry. A PRX918XLF is 0.7 kg heavier than the DXS15XLF it replaces and goes three hertz deeper, but it is 591 across — so the trays grew from 570 to 610 and the deck now closes at 610 + 610 + a 190 mm centre channel, exactly 1410.',
      'And it evicted the mid-top from its roof. Tray 60 plus 693 plus a DZR10 lying on top is 1208 above the deck against a 1120 ceiling. The tops now travel flat in the bay forward of the sub and wind up two posts on a strap.',
      'NOTHING STANDS ON THE CAB ROOF. It is 0.7 mm of steel over three hoops with no threaded provision anywhere, and the failure mode is the overturning moment, not the pressure — a 1.5 m mast with 5 kg on top needs one gust to put 75 N·m into a panel that oil-cans under a hand. There is a rated carrier for this truck, a TUFREQ KF326A+ at 50 kg, and that rating is for distributed vertical load through the gutters: it is a shelf, not a foundation.',
      'So the light frame clears the roof entirely — a rigid T of φ48.6 scaffold pipe off a base plate through-bolted to the front crossmember, standing its crossbar 770 mm above the cab roof line. One moving part, one pipe joint, about ¥1,200 of pipe where the crank-up stand was ¥85,000.',
      'The fixtures never roll on their clamps. They point along the mast toward its foot, which is forward along the deck while the frame is flat and straight down once it is up: the quarter turn that stands the mast up is the same quarter turn that aims the lights.',
      'Four jacks take the truck off its leaf springs. Without them the whole vehicle rolls the moment the DJ shifts weight — and the DJ’s own 75 kg is carried by the jacks, not the axles.',
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
 * The mast's foot: a 大洋製器工業 固定ベース on a steel spreader, through-bolted
 * M10 into the truck's front crossmember with 60 x 60 x 4 backing plates.
 *
 * NOT into the deck boards and never into the tie-down hooks. The mast is a
 * 1.5 m lever with lights on the end and the whole point of clearing the cab
 * roof is that the moment goes into the chassis instead of into 0.7 mm of
 * bodywork — which only holds if the foot is fixed to the chassis too.
 */
function mastFoot(lib) {
  const g = new THREE.Group()
  const y = FLOOR + MAST_Y
  g.add(slab([mm(280), mm(14), mm(280)], lib.galv, { pos: [MAST_X, FLOOR + mm(7), 0] }))
  g.add(slab([mm(121), y - FLOOR - mm(30), mm(121)], lib.aluDark, { anchor: [0, -1, 0], pos: [MAST_X, FLOOR + mm(14), 0] }))
  g.add(slab([mm(150), mm(20), mm(150)], lib.galv, { pos: [MAST_X, y - mm(24), 0] }))
  // Braced back to the torii guard, which is bolted through to a crossmember.
  for (const sx of [-1, 1]) {
    g.add(rod([MAST_X, y, sx * mm(40)], [MAST_X + mm(90), FLOOR + mm(980), sx * mm(520)], mm(16), lib.steelRod))
  }
  return g
}

/**
 * The T: mast, crossbar and the fixtures clamped to it, all one rigid frame.
 *
 * The fixtures point along +X — toward the mast's foot — which is FORWARD along
 * the deck while the frame is flat and straight DOWN once it is up. That is the
 * whole reason nothing has to roll on its clamps: the quarter turn that stands
 * the mast up is the same quarter turn that aims the lights.
 */
function lightFrame(lib) {
  const g = new THREE.Group()
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(mm(24.3), mm(24.3), MAST_H, 14), lib.galv)
  pipe.rotation.z = Math.PI / 2
  pipe.position.x = -MAST_H / 2
  g.add(pipe)
  // 単管用ジョイント part way down, because 2 m is the length pipe comes in.
  g.add(slab([mm(150), mm(56), mm(56)], lib.aluDark, { pos: [-mm(900), 0, 0] }))

  const bx = -MAST_H + mm(30)
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(mm(24.3), mm(24.3), BAR_LEN, 14), lib.galv)
  // ACROSS the mast, which needs saying because a THREE cylinder is built along
  // its own +Y and the mast above it is turned onto X. Left unturned, this bar
  // ran along the mast instead of across it: fore-and-aft over the cab with the
  // frame up, and straight down through the deck with it flat. The fixtures
  // were already authored along Z and were crossing it at ninety degrees.
  bar.rotation.x = Math.PI / 2
  bar.position.set(bx, 0, 0)
  g.add(bar)
  // 直交クランプ where the bar crosses the mast — the rated 500 kg one.
  g.add(slab([mm(110), mm(100), mm(110)], lib.aluDark, { pos: [bx, 0, 0] }))

  // COLOR STRIP12 down the middle, four SLIMPAR12s spread along the bar, each on
  // a φ48–51 stage clamp with a steel safety bond.
  g.add(slab([mm(115), mm(85), mm(1060)], lib.aluDark, { pos: [bx + mm(80), 0, 0] }))
  g.add(slab([mm(90), mm(26), mm(1000)], lib.ledCyan, { pos: [bx + mm(122), 0, 0] }))
  for (let i = 0; i < 4; i++) {
    const z = -BAR_LEN / 2 + mm(180) + i * mm(346)
    g.add(slab([mm(45), mm(110), mm(60)], lib.galv, { pos: [bx + mm(30), 0, z] }))
    g.add(slab([mm(180), mm(193), mm(89)], lib.aluDark, { pos: [bx + mm(170), 0, z] }))
    g.add(slab([mm(30), mm(150), mm(70)], i % 2 ? lib.ledMagenta : lib.ledWarm, { pos: [bx + mm(256), 0, z] }))
    const beam = new THREE.PointLight(i % 2 ? 0xff3cae : 0xffb347, 3.4, 8, 2)
    beam.position.set(bx + mm(340), 0, z)
    g.add(beam)
    g.add(stay(lib, [bx + mm(40), mm(30), z], [bx + mm(160), mm(80), z], { radius: mm(3) }))
  }
  return g
}

function trayGeometry(lib) {
  const g = new THREE.Group()
  // Tray pan and its slide rails.
  g.add(slab([TRAY_L, TRAY_T, TRAY_W], lib.aluDark, { anchor: [0, -1, 0] }))
  g.add(slab([TRAY_L - mm(40), mm(8), TRAY_W - mm(40)], lib.alu, { pos: [0, TRAY_T, 0] }))
  for (const s of [-1, 1]) {
    g.add(extrusion([-TRAY_L / 2 + mm(4), TRAY_T / 2, s * (TRAY_W / 2 - mm(30))], [TRAY_L / 2 - mm(4), TRAY_T / 2, s * (TRAY_W / 2 - mm(30))], mm(44), lib.alu))
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
  well.add(slab([mm(18), mm(150), SUB.w + mm(40)], lib.ply, { anchor: [0, -1, 0], pos: [-SUB.d / 2 - mm(9), 0, 0] }))
  g.add(well)

  // Bass bin: a ported 15", front-loaded, facing the crowd (-X).
  const bin = new THREE.Group()
  bin.position.set(wx, TRAY_T, 0)
  bin.add(slab([SUB.d, SUB.h, SUB.w], lib.speakerBox, { anchor: [0, -1, 0] }))
  bin.add(slab([mm(24), SUB.h - mm(90), SUB.w - mm(70)], lib.speakerGrille, { pos: [-SUB.d / 2 - mm(8), SUB.h / 2 + mm(20), 0] }))
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

  // The two lift posts, with the winch drum at the foot of one of them.
  for (const s of [-1, 1]) {
    const cz = s * POST_Z
    g.add(slab([mm(150), mm(16), mm(150)], lib.galv, { pos: [POST_X, TRAY_T, cz] }))
    g.add(slab([mm(64), POST_H, mm(64)], lib.alu, { anchor: [0, -1, 0], pos: [POST_X, TRAY_T, cz] }))
    g.add(slab([mm(90), mm(30), mm(90)], lib.aluDark, { pos: [POST_X, TRAY_T + POST_H, cz] }))
  }
  g.add(slab([mm(120), mm(90), mm(70)], lib.aluDark, { pos: [POST_X, TRAY_T + mm(120), POST_Z + mm(70)] }))
  return g
}

/**
 * The carriage and the yoke it carries: two shoes running on the posts, tied by
 * a cross-tie under the box, with the trunnion stubs that bolt into the DZR10's
 * upper side inserts.
 */
function topYoke(lib) {
  const g = new THREE.Group()
  for (const sz of [-1, 1]) {
    const cz = sz * POST_Z
    g.add(slab([mm(150), mm(190), mm(90)], lib.aluDark, { pos: [0, 0, cz] }))
    g.add(rod([0, 0, cz - sz * mm(45)], [0, 0, sz * (TOP.w / 2 - mm(10))], mm(11), lib.steelRod))
  }
  g.add(slab([mm(90), mm(26), 2 * POST_Z - mm(120)], lib.galv, { pos: [-mm(60), -mm(130), 0] }))
  return g
}

/**
 * The DZR10, authored LYING — grille up, because a quarter turn about +Z sends
 * the box's +Y face to -X, and -X is where the crowd is.
 */
function topBox(lib) {
  const g = new THREE.Group()
  const b = new THREE.Group()
  b.position.set(TOP_LIE_X - POST_X, TOP_LIE_Y - CARRIAGE_Y, 0)
  b.add(slab([TOP.h, TOP.d, TOP.w], lib.speakerBox))
  b.add(slab([TOP.h - mm(60), mm(20), TOP.w - mm(50)], lib.speakerGrille, { pos: [mm(10), TOP.d / 2 + mm(5), 0] }))
  b.add(slab([mm(90), mm(24), TOP.w - mm(140)], lib.trim, { pos: [-TOP.h / 2 + mm(70), TOP.d / 2 + mm(8), 0] }))
  for (const sz of [-1, 1]) {
    for (const dx of [-mm(150), mm(0), mm(150)]) {
      b.add(slab([mm(26), mm(26), mm(10)], lib.galv, { pos: [dx, 0, sz * (TOP.w / 2 + mm(3))] }))
    }
  }
  b.add(slab([TOP.h - mm(180), mm(18), TOP.w - mm(120)], lib.aluDark, { pos: [0, -TOP.d / 2 - mm(6), 0] }))
  g.add(b)
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
  // 186, not 380. The screw's own hull is 200 long and the leg reaches the
  // tarmac at 200 past the foot's origin; drawn at 380 the pad face finished
  // 194 mm UNDER the road, which is what the four drop legs were doing in every
  // view while the screw jacks beside them stood on it correctly.
  g.add(slab([mm(186), mm(38), mm(38)], lib.aluDark, { anchor: [-1, 0, 0] }))
  g.add(slab([mm(22), mm(160), mm(160)], lib.aluDark, { pos: [mm(177), 0, 0] }))
  g.add(slab([mm(14), mm(180), mm(180)], lib.rubberFoot, { pos: [mm(193), 0, 0] }))
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
  // 2 mm off the panel's own face. Flush, the stowed cheek's underside sat in
  // exactly the plane of the counter's underside over a fifth of a square metre
  // — the largest coplanar pair in the station.
  geo.translate(0, -mm(2), 0)
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
    // Centred on the panel's crowd-facing surface, which with anchorY -1 is
    // local +PANEL_T. Centred on zero they stood 21 mm proud of the DECK side
    // and were buried behind the face the crowd looks at.
    g.add(slab([mm(40), PANEL_T + mm(10), BOOTH_W - mm(160)], i % 2 ? lib.ledCyan : lib.ledMagenta, { pos: [x, PANEL_T, 0] }))
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
