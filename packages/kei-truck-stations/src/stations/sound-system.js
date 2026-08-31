import * as THREE from 'three'
import {
  mm, deg, slab, rod, extrusion, truss, T, X, HALF_W,
  addGates, addJack, subframe, subframeHull, legGeometry, telescope,
  foldPanel, foldPanelHull, hingeZ, hingeX, stay, latch,
} from './common.js'

// ---------------------------------------------------------------------------
// SOUND SYSTEM — the bed becomes a stage, the sides become speaker stacks
//
// The crowd stands behind the truck. The cargo deck is the DJ's floor, already
// 660 mm up, which is a riser you did not have to build. Two trays glide out of
// the flanks carrying the bass bins; poles lift the tops above head height; a
// mast telescopes out of the headboard and throws a wing of lights across the
// whole thing; and a three-panel booth stands up off the tail with its fascia
// facing the crowd.
//
// WHAT DECIDED THIS DESIGN: not space, WEIGHT.
//
// A kei truck's cargo deck is 2.7 m^2 and 1120 mm of headroom under the cab
// roof, which is a lot of room. Its payload is 350 kg, which is not. Two 15"
// bass bins, two tops, poles, a mast, a booth, four jacks and the subframe come
// to 317 kg before a single cable, and the DJ standing on the deck is another
// 75. So the deck holds the sound and the ground holds the people — and there
// is no third bass bin, however much the design would like one.
//
// That constraint is why the bins SLIDE rather than swing. A swing arm long
// enough to lift 41 kg from the deck centre out past the bed edge is a crane
// arm, and a crane arm on this truck is 20 kg of the budget spent on getting
// something 600 mm sideways. A pair of heavy-duty drawer slides do the same job
// for 8 kg, they carry the load in shear the whole way, and — this is the part
// that matters — the tray never leaves its supports, so there is no moment in
// the deployment where somebody is holding 41 kg at arm's length.
//
// THE LOAD PATH, end to end. Bin -> tray -> (slides at the inboard end, drop
// legs at the outboard) -> ground and subframe. Subframe -> spreader plates ->
// the deck's own cross bearers -> chassis. Chassis -> four screw jacks ->
// ground. Nothing anywhere is held up by a hinge alone.
// ---------------------------------------------------------------------------

const FLOOR = mm(110) // module floor above the cargo deck
const TRAY_T = mm(60)
const TRAY_L = mm(1360)
const TRAY_W = mm(570)
const TRAY_TRAVEL = mm(610)
const TRAY_CX = mm(240) // tray centre in x, packed
const TRAY_CZ = mm(385) // ...and in z, for the right-hand tray

const BIN = { l: mm(450), w: mm(550), h: mm(600) }
const TOP = { l: mm(400), w: mm(480), h: mm(320) }
// Two stages of 420, because one stage cannot both stow inside a 600 mm housing
// and rise 840: the overlap would go negative long before the box got up.
const POLE_STAGE = mm(420)
const POLE_HOUSING = mm(600)

const MAST_X = mm(810)
const MAST_HOUSING = mm(800) // retracted length, sitting on the module floor
// Three stages of 560 in an 800 mm housing. At full extension each stage still
// has 240 mm inside the one below — 1.6 times the 150 mm section, comfortably
// past the 1.5 rule of thumb that keeps a telescope from hinging at the joint.
const MAST_STAGE = mm(560)
const MAST_SECTION = mm(150)
const ARM_L = mm(700)

const BOOTH_X = -mm(940) // hinge line of the booth's lower panel
const BOOTH_PANEL = mm(475) // lower and upper are the same length, which puts
//                             the fold hinge exactly on the lower's end
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

  rig.setStages([
    'sides down, jacks in',
    'trays glide out',
    'legs down, booth stands',
    'feet out, poles up, booth extends',
    'mast rises, counter over',
    'light wing opens',
  ])

  // --- what stays put ------------------------------------------------------
  const base = rig.add({
    id: 'floor',
    parent: null,
    label: 'subframe + stage floor',
    joint: 'fixed',
    static: true,
    mass: 48,
    com: [0, FLOOR / 2, 0],
    hulls: subframeHull(FLOOR),
  })
  rig.attach(base.id, subframe(lib, { height: FLOOR }))
  rig.attach(base.id, stageFloorDetail(lib))

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
      mass: 16 + 41, // tray plus the bass bin bolted to it
      com: [-mm(220), TRAY_T + BIN.h / 2, 0],
      hulls: [
        { c: [0, TRAY_T / 2, 0], s: [TRAY_L, TRAY_T, TRAY_W], tag: 'tray' },
        { c: [-mm(435), TRAY_T + BIN.h / 2, 0], s: [BIN.l, BIN.h, BIN.w], tag: 'bass bin' },
      ],
      mates: [`gate-${side === 'l' ? 'left' : 'right'}`],
      note: 'heavy-duty slides; load stays in shear the whole way out',
    })
    rig.attach(tray.id, trayGeometry(lib, sz))

    // Two drop legs along the tray's outboard edge.
    //
    // They stow LYING FLAT inside a rebate in the tray's own 60 mm thickness,
    // which is the only place on this module a 620 mm leg will go: under the
    // tray is the subframe, above it is the bass bin, and standing one upright
    // beside the bin puts it straight through the top box. Lying in the edge of
    // the thing it holds up is where a fold-down leg belongs anyway.
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

    // The top box rides a two-stage pole out of a housing on the tray. Each
    // stage is its own part rather than one part that translates a long way —
    // which is not pedantry: a single sliding tube would leave a visible gap
    // between the housing and the mast, and the gap is exactly the engagement
    // that makes a telescope stiff.
    rig.attach(`tray-${side}`, poleHousing(lib))
    let poleParent = `tray-${side}`
    let poleBase = TRAY_T
    for (let k = 1; k <= 2; k++) {
      const id = `pole-${side}-${k}`
      const isTop = k === 2
      rig.add({
        id,
        parent: poleParent,
        label: `speaker pole (stage ${k})`,
        pivot: [k === 1 ? -mm(100) : 0, k === 1 ? poleBase : 0, 0],
        joint: 'telescope',
        axis: [0, 1, 0],
        range: [0, POLE_STAGE],
        stage: 3,
        mass: isTop ? 4 + 13 : 4,
        com: [0, POLE_HOUSING / 2, 0],
        hulls: isTop
          ? [
              { c: [0, POLE_HOUSING / 2, 0], s: [mm(66), POLE_HOUSING, mm(66)], tag: 'pole' },
              { c: [-mm(100), POLE_HOUSING + TOP.h / 2, 0], s: [TOP.l, TOP.h, TOP.w], tag: 'top box' },
            ]
          : [{ c: [0, POLE_HOUSING / 2, 0], s: [mm(76), POLE_HOUSING, mm(76)], tag: 'pole' }],
        mates: [poleParent],
        note: isTop ? 'lifts the mid-top clear of the crowd' : '',
      })
      rig.attach(id, poleStage(lib, k))
      poleParent = id
    }
  }

  // --- the mast ------------------------------------------------------------
  rig.attach(
    'floor',
    (() => {
      const g = new THREE.Group()
      g.add(slab([mm(196), MAST_HOUSING, mm(140)], lib.aluDark, { anchor: [0, -1, 0], pos: [MAST_X, FLOOR, 0] }))
      g.add(slab([mm(230), mm(24), mm(180)], lib.galv, { pos: [MAST_X, FLOOR + MAST_HOUSING, 0] }))
      // Braced back to the truck's own torii, which is the strongest hard point
      // on the vehicle: bolted through the deck into a frame crossmember and
      // triangulated fore-and-aft by the cab behind it.
      for (const s of [-1, 1]) {
        g.add(rod([MAST_X, FLOOR + mm(700), s * mm(80)], [mm(950), FLOOR + mm(980), s * mm(560)], mm(16), lib.steelRod))
      }
      return g
    })(),
  )
  let mastParent = 'floor'
  let mastPivot = [MAST_X, FLOOR + mm(20), 0]
  for (let k = 1; k <= 3; k++) {
    const id = `mast-${k}`
    const sec = MAST_SECTION * Math.pow(0.86, k)
    rig.add({
      id,
      parent: mastParent,
      label: `mast (stage ${k})`,
      pivot: mastPivot,
      joint: 'telescope',
      axis: [0, 1, 0],
      range: [0, MAST_STAGE],
      stage: 4,
      mass: k === 3 ? 9 : 7,
      com: [0, mm(400), 0],
      hulls: [{ c: [0, mm(400), 0], s: [sec, mm(800), sec], tag: `mast ${k}` }],
      // Nested stages share space by design when retracted, and stage 3 is
      // grandchild rather than child of stage 1, so the exemption has to be
      // declared rather than inferred from the tree.
      mates: ['floor', 'mast-1', 'mast-2', 'mast-3'],
      note: k === 1 ? '3 stages, 240 mm of engagement left at full height' : '',
    })
    rig.attach(id, slab([sec, mm(800), sec], k === 3 ? lib.alu : lib.aluDark, { anchor: [0, -1, 0] }))
    rig.attach(id, slab([sec + mm(16), mm(40), sec + mm(16)], lib.galv, { pos: [0, mm(20), 0] }))
    mastParent = id
    mastPivot = [0, 0, 0]
  }

  // The wing of lights. Two half-trusses stow hanging down the mast's flanks and
  // swing up to horizontal, so the whole 1.4 m span is carried in a package
  // 200 mm wide. They swing outboard, which is the only direction that is empty.
  for (const [side, sz] of [['l', -1], ['r', 1]]) {
    const arm = rig.add({
      id: `light-arm-${side}`,
      parent: 'mast-3',
      label: 'light wing',
      pivot: [0, mm(800), sz * mm(215)],
      joint: 'hinge',
      axis: [1, 0, 0],
      // Hanging straight down the mast at rest; a quarter turn brings it level.
      // The sign follows the side: the truss is authored pointing along its own
      // +Z or -Z, and each has to rotate the way that swings it DOWN rather
      // than up — get it backwards and the stowed wings stand 700 mm proud of
      // the mast head, which the packed-envelope readout catches immediately.
      range: [sz * (Math.PI / 2), 0],
      stage: 5,
      mass: 11,
      com: [0, 0, sz * ARM_L * 0.45],
      // Two hulls: the truss and the fixtures slung under it. One box round
      // both would be 420 mm deep, and a 420 mm deep box hanging beside a
      // 129 mm mast is the audit's business rather than the design's.
      hulls: [{ c: [0, -mm(30), sz * (ARM_L * 0.5 + mm(30))], s: [mm(220), mm(220), ARM_L], tag: 'light wing' }],
      note: 'stayed back to a king post — a 700 mm cantilever needs a top chord in tension',
    })
    rig.attach(arm.id, lightWing(lib, sz))
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
    stage: 2,
    mass: 13,
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
    stage: 3,
    mass: 13,
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
    stage: 4,
    mass: 16,
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
      // Lying flat on the fascia at rest, folding IN across its face; a quarter
      // turn stands each one up in the plane the counter needs holding in.
      range: [0, sz * Math.PI / 2],
      stage: 5,
      mass: 4,
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
      ['subframe + stage floor', 48],
      ['trays, slides, legs and feet', 49],
      ['bass bins (2 x active 15")', 82],
      ['poles + mid-tops (2)', 40],
      ['light mast + wing', 48],
      ['booth: fascia, counter, cheeks', 38],
      ['stabiliser jacks (4)', 18],
      ['power, cable, DJ kit', 25],
    ],
    notes: [
      'Weight, not space, is the binding constraint: the deck has 2.7 m² and 1120 mm of headroom, and 350 kg of payload.',
      'The bins slide instead of swinging — the load stays in shear on the slides the whole way out, and nobody ever holds 41 kg at arm’s length.',
      'Four jacks take the truck off its leaf springs. Without them the whole vehicle rolls the moment the DJ shifts weight.',
      'Mast braced back into the truck’s torii guard: bolted through the deck into a frame crossmember, triangulated by the cab.',
      'The budget leaves 2 kg. A DJ is another 75 — which is fine only because, jacked down, the deck’s load reaches the ground through the jacks rather than through the axles.',
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

function trayGeometry(lib, sz) {
  const g = new THREE.Group()
  // Tray pan and its slide rails.
  g.add(slab([TRAY_L, TRAY_T, TRAY_W], lib.aluDark, { anchor: [0, -1, 0] }))
  g.add(slab([TRAY_L - mm(40), mm(8), TRAY_W - mm(40)], lib.alu, { pos: [0, TRAY_T, 0] }))
  for (const s of [-1, 1]) {
    g.add(extrusion([-TRAY_L / 2, TRAY_T / 2, s * (TRAY_W / 2 - mm(30))], [TRAY_L / 2, TRAY_T / 2, s * (TRAY_W / 2 - mm(30))], mm(44), lib.alu))
  }

  // Bass bin: a ported 15", front-loaded, with a recessed handle each end and a
  // grille. Facing the crowd, i.e. toward the tail (-X).
  const bx = -mm(435)
  const bin = new THREE.Group()
  bin.position.set(bx, TRAY_T, 0)
  bin.add(slab([BIN.l, BIN.h, BIN.w], lib.speakerBox, { anchor: [0, -1, 0] }))
  bin.add(slab([mm(24), BIN.h - mm(70), BIN.w - mm(70)], lib.speakerGrille, { pos: [-BIN.l / 2 - mm(6), BIN.h / 2, 0] }))
  // The port slot, which is what makes a bass bin read as a bass bin.
  bin.add(slab([mm(30), mm(110), BIN.w - mm(180)], lib.trim, { pos: [-BIN.l / 2 - mm(10), mm(110), 0] }))
  for (const s of [-1, 1]) {
    bin.add(slab([mm(140), mm(50), mm(22)], lib.aluDark, { pos: [0, BIN.h - mm(120), s * (BIN.w / 2 + mm(4))] }))
  }
  bin.add(slab([BIN.l - mm(60), mm(14), BIN.w - mm(60)], lib.aluDark, { pos: [0, BIN.h, 0] }))
  g.add(bin)
  return g
}

/** The fixed tube on the tray that the pole stages live inside. */
function poleHousing(lib) {
  const g = new THREE.Group()
  g.add(slab([mm(92), POLE_HOUSING, mm(92)], lib.aluDark, { anchor: [0, -1, 0], pos: [-mm(100), TRAY_T, 0] }))
  g.add(slab([mm(240), mm(20), mm(240)], lib.aluDark, { pos: [-mm(100), TRAY_T + mm(10), 0] }))
  return g
}

/** One pole stage; the top one carries the mid-top box. */
function poleStage(lib, k) {
  const g = new THREE.Group()
  const sec = k === 1 ? mm(76) : mm(66)
  g.add(slab([sec, POLE_HOUSING, sec], lib.alu, { anchor: [0, -1, 0] }))
  g.add(slab([sec + mm(14), mm(26), sec + mm(14)], lib.galv, { pos: [0, mm(13), 0] }))
  if (k === 2) {
    const box = new THREE.Group()
    box.position.set(-mm(100), POLE_HOUSING, 0)
    box.rotation.z = deg(-8) // aimed down at the crowd, the way a top box always is
    box.add(slab([TOP.l, TOP.h, TOP.w], lib.speakerBox, { anchor: [0, -1, 0] }))
    box.add(slab([mm(20), TOP.h - mm(50), TOP.w - mm(50)], lib.speakerGrille, { pos: [-TOP.l / 2 - mm(5), TOP.h / 2, 0] }))
    box.add(slab([mm(120), mm(16), mm(120)], lib.aluDark, { pos: [-mm(30), 0, 0] }))
    g.add(box)
  }
  return g
}

/**
 * One half of the light wing: a ladder truss with a short king post above it and
 * a stay to the tip.
 *
 * Authored HANGING DOWN along -Y, because that is how it stows, and the rig
 * rotates it up. A 700 mm cantilever off a mast top carrying moving heads is
 * not something a bolt at the root can hold on its own; the king post turns the
 * bending into a compression in the truss and a tension in the stay.
 */
function lightWing(lib, sz) {
  const g = new THREE.Group()
  const t = truss(ARM_L, mm(160), mm(150), lib.alu, { chord: mm(26) })
  t.rotation.y = sz > 0 ? -Math.PI / 2 : Math.PI / 2
  t.position.y = -mm(80)
  g.add(t)
  // King post and stay.
  const post = mm(210)
  g.add(rod([0, mm(80), 0], [0, mm(80) + post, 0], mm(18), lib.alu))
  g.add(stay(lib, [0, mm(80) + post, 0], [0, mm(80), sz * (ARM_L - mm(40))]))
  // LED battens RECESSED into the truss depth rather than hung under it on
  // yokes. Not a styling choice: an arm that folds down the side of the mast
  // arrives with whatever hangs below the truss pointing straight at the mast,
  // and 280 mm of moving head beside a 129 mm mast section is an interference,
  // not a light rig. Slim battens live inside the 160 mm truss and fold with it.
  for (let i = 0; i < 4; i++) {
    const z = sz * (mm(110) + i * mm(180))
    g.add(slab([mm(150), mm(50), mm(150)], lib.aluDark, { pos: [0, -mm(115), z] }))
    g.add(slab([mm(120), mm(28), mm(130)], i % 2 ? lib.ledMagenta : lib.ledCyan, { pos: [0, -mm(140), z] }))
    const beam = new THREE.PointLight(i % 2 ? 0xff3cae : 0x33e0ff, 5, 7, 2)
    beam.position.set(0, -mm(240), z)
    g.add(beam)
  }
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

/** What is actually on the counter: two decks, a mixer, a pair of monitors. */
function decks(lib) {
  const g = new THREE.Group()
  const y = PANEL_T / 2
  for (const s of [-1, 1]) {
    g.add(slab([mm(300), mm(60), mm(330)], lib.trim, { pos: [mm(240), y + mm(30), s * mm(420)] }))
    const platter = new THREE.Mesh(new THREE.CylinderGeometry(mm(115), mm(115), mm(18), 20), lib.chrome)
    platter.position.set(mm(250), y + mm(68), s * mm(430))
    g.add(platter)
  }
  g.add(slab([mm(280), mm(70), mm(330)], lib.trim, { pos: [mm(240), y + mm(35), 0] }))
  for (let i = 0; i < 6; i++) {
    g.add(slab([mm(30), mm(12), mm(26)], i % 2 ? lib.ledWarm : lib.ledCyan, { pos: [mm(160) + i * mm(30), y + mm(74), 0] }))
  }
  return g
}
