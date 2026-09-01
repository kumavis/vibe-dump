import * as THREE from 'three'
import {
  mm, deg, slab, rod, extrusion, X, HALF_W,
  addGates, addJack, subframe, subframeHull, foldPanelHull,
  hingeX, hingeZ, legGeometry, REST,
} from './common.js'
import { bellows, cloth, lathe, roundedSlab } from '../build.js'

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
// THE THIRD: living in 2.4 m^2 is grim, and the fix is the only one that costs
// no packing volume at all. THE KERBSIDE WALL FALLS OUT AND BECOMES THE FLOOR.
// It is hinged at the floor line rather than at the top, so it drops through 90
// degrees to a 1740 x 1050 deck standing level with the cabin floor on two legs
// to the tarmac — 1.83 m^2 of room added, entirely outside the chassis, by a
// panel the truck was already carrying. Interior 2.43 plus deck 1.83 is 4.26
// square metres, which is a 75% larger house for four kilograms of legs.
//
// THAT IS THE WHOLE IDEA, AND IT IS WORTH BEING PRECISE ABOUT WHY IT PACKS. A
// fold-out that stows as a panel costs its own thickness in the load space; a
// fold-out that stows as a WALL costs nothing, because the wall had to exist
// anyway. The deck's 40 mm is 40 mm the shell was already spending. The legs and
// the canopy poles are recessed into that 40 mm, flush with the skin, so they
// are free too. Everything else in the outdoor room is fabric in a bag.
//
// The room gets a roof the same way: two poles telescope up off the deck's outer
// edge and a canopy unrolls to them from a keder rail on the raised lid. Fabric
// spans 1.0 m of ground for 4 kg. A hard porch roof — which is what the gullwing
// this replaces was — costs 24 kg and a 1.0 m swept arc, and shelters the same
// ground.
//
// WITH THE KERB WALL DOWN, THE LID IS CARRIED ON THAT SIDE BY THE TWO CORNER
// COLUMNS and the top rails of the front and rear walls. The wall panel sits
// between those columns rather than being structure itself, which is why it can
// be hinged at all — and why it is 1740 wide rather than 1850.
//
// Packed, the whole thing is 1940 x 1410 x 1100 above the deck: 1760 mm overall,
// and 20 mm under the cab roof — the tightest packing of the four, and the
// reason the lid sits inside the shell rather than on it. It looks like a work
// truck with a canopy, which is the point.
// ---------------------------------------------------------------------------

const FLOOR = mm(90)
const BOX = { h: mm(1010), t: mm(40) } // hard shell, floor to lid
const LID_RISE = mm(880)
// The canvas skirt is shorter than the lid's travel by the 90 mm the lid parks
// down inside the shell: top rail at 1100 above the deck, lid underside at 1890
// with the roof up.
const SKIRT_H = LID_RISE - mm(90)
// THE BUNK DROPS BEFORE IT SLIDES, and the two numbers that force it are 1120
// and 1780. Packed, the bunk deck has to be under the packing ceiling, so it
// tucks right up beneath the parked lid at 870 above the cargo deck. Deployed,
// the half of it that goes over the cab has to be ABOVE the cab roof, which is
// 1780 above the road — so it has to end up at 1220 above the deck, 530 mm
// lower relative to a lid that has itself risen 880. A bunk bolted to the lid at
// a fixed offset can satisfy one of those and never both: at the packed offset
// it deploys 630 mm above the cab roof, floating, and at the deployed offset it
// packs down through the galley worktop.
const BUNK_DROP = mm(530)
// The module stops 40 mm short of the truck's own torii guard at x = 930, which
// is why nothing here is symmetric about the deck centre.
const BOX_CX = -mm(20)
const BUNK_L = mm(1850)
const BUNK_W = mm(1280)
const SLIDE_L = mm(1200)
const SLIDE_TRAVEL = mm(950)
const PANEL_T = mm(34)
const HALF = HALF_W - mm(20)
// The kerb wall, which is also the deck. Its depth is the shell's height plus
// its own thickness, so standing up it exactly fills the opening from the floor
// line to the lid sill, and lying down its top face lands flush with the cabin
// floor rather than 40 mm proud of it.
const DECK_D = BOX.h + BOX.t
const DECK_W = mm(1740) // between the corner columns, not across them
const DECK_LEG = mm(601) // + 129 of screw foot and pad = 730, the pin height
// The canopy poles. 860 + 680 stows inside the 1050 panel with the leg lying in
// the lane beside it, and stands the hem 1520 above the deck at a 20 degree fall
// from the lid rail — a pitch that sheds rain, and headroom you only stoop under
// in the last 300 mm of the floor.
const POLE_H = mm(860)
const POLE_RISE = mm(680)

export default {
  id: 'cabin',
  title: 'Cabin',
  tagline: 'the wall you drive with is the floor you camp on',
  build,
}

function build(ctx) {
  const { rig, lib } = ctx

  rig.setStages([
    'gates down, jacks in',
    'roof pops, bellows unfold',
    'the kerb wall falls out and becomes the deck',
    'deck legs down, poles up, bunk drops to cab height',
    'poles telescope, canopy unrolls, bunk over the cab',
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
      // Three walls. The kerb side is the fold-down deck and is its own part.
      { c: [mm(905), FLOOR + BOX.h / 2, 0], s: [BOX.t, BOX.h, HALF * 2], tag: 'front wall' },
      { c: [-mm(945), FLOOR + BOX.h / 2, 0], s: [BOX.t, BOX.h, HALF * 2], tag: 'rear wall' },
      { c: [BOX_CX, FLOOR + BOX.h / 2, HALF - BOX.t / 2], s: [mm(1850), BOX.h, BOX.t], tag: 'off-side wall' },
      // The furniture is in the hull set too. It was not, and the packing check
      // was correspondingly blind: the galley worktop started at 810 and the
      // bunk deck hangs at 790, so the two were 40 mm inside each other and
      // nothing said so. A fitted interior is structure.
      { c: [BOX_CX, FLOOR + mm(330), mm(410)], s: [mm(1800), mm(660), mm(470)], tag: 'galley run' },
      { c: [BOX_CX, FLOOR + mm(225), -mm(390)], s: [mm(1800), mm(450), mm(480)], tag: 'bench / lower berth' },
    ],
  })
  rig.attach(base.id, subframe(lib, { height: FLOOR }))
  rig.attach(base.id, shell(lib))
  rig.attach(base.id, interior(lib))

  // The kerb gate HANGS. It used to be held flat to carry the porch, and there
  // is nothing left for it to carry: the deck lands 90 mm above it and stands on
  // its own legs. Held flat it would be a 285 mm shelf 50 mm under the deck,
  // which is a shin at the exact height of a shin.
  addGates(rig, ctx, { left: 'hang', right: 'hang', tail: 'flat', stage: 0 })
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
  const top = popTop(lib)
  rig.attach(lid.id, top)
  const sail = canopy(lib)
  rig.attach(lid.id, sail)

  // --- the kerb wall, which is the deck ------------------------------------
  // Hinged at the FLOOR line and falling outboard, not hinged at the top and
  // lifting. That single change is the whole redesign, and three things fall out
  // of it at once.
  //
  // It doubles the house. Standing up it is a 1740 x 1050 wall; lying down it is
  // a 1740 x 1050 floor, level with the cabin floor and continuous with it, so
  // the inside and the outside are one room at one height rather than a room and
  // a step.
  //
  // It costs no packing volume. The panel is the wall; the wall had to be there.
  // A porch that stows as a porch spends its own thickness on the load space
  // twice over — once for the panel and once for the clearance to swing it.
  //
  // And the face that ends up underfoot is the face that spent the drive looking
  // INTO the cabin, which is the right way round: the walking surface travels
  // clean and dry and the road-facing skin becomes the underside. The legs and
  // the poles live in routed channels at mid-thickness, between the two.
  //
  // What it needs in exchange is real support. 1050 mm of cantilever off a hinge
  // with two adults on it is not a doorstep, it is a floor, so it gets two legs
  // to the tarmac rather than the gas stays a porch would use.
  const deck = rig.add({
    id: 'kerb-deck',
    parent: 'floor',
    label: 'kerb wall / fold-down deck',
    // The pin is 40 below the floor line so the panel's TOP face — the walking
    // surface — arrives exactly at floor level. Pin it at the floor line instead
    // and the deck lands 40 proud, which is a trip hazard in the doorway.
    pivot: [BOX_CX, FLOOR - BOX.t, -HALF],
    joint: 'hinge',
    axis: [1, 0, 0],
    rest: REST.UP_ALONG_X,
    // Outboard is -Z, and a positive turn about +X carries +Y toward +Z. So the
    // travel is negative: the wall falls away from the truck, not into it.
    range: [0, -Math.PI / 2],
    stage: 2,
    mass: 30,
    com: [DECK_D / 2, 0, 0],
    // foldPanelHull inflates by 6 mm, so it is handed 34 to describe the 40 mm
    // panel exactly. Six millimetres of courtesy is not free here: the bunk deck
    // is 1280 wide in a 1290 clear opening, and the inflated hull spends 5 of
    // the 5 it has on each side.
    hulls: foldPanelHull(DECK_D, DECK_W, BOX.t - mm(6), 'kerb wall / deck', -1),
    // The lid parks INSIDE the top 110 mm of the shell, so the wall's top edge
    // is inside the lid's footprint whenever the roof is down — which is why the
    // roof pops first and why this pair is declared.
    mates: ['floor', 'lid', 'gate-left'],
    note: '1740 x 1050 of floor, outside the chassis, from a panel already on the truck',
  })
  rig.attach(deck.id, deckPanel(lib))
  rig.attach(deck.id, hingeZ(lib, DECK_W))

  for (const [n, sz] of [['f', 1], ['r', -1]]) {
    // THE LEGS. Pinned at mid-thickness rather than on the underside, which is
    // not fussiness: pinned on the face, a 44 mm leg stows 22 mm proud of the
    // skin and the truck is 24 mm over its own body line. At mid-thickness it
    // sits in a routed channel and the wall is flat.
    rig.add({
      id: `deck-leg-${n}`,
      parent: 'kerb-deck',
      label: 'deck leg',
      pivot: [DECK_D - mm(70), BOX.t / 2, sz * mm(700)],
      joint: 'hinge',
      axis: [0, 0, 1],
      // Authored hanging along -Y, which is straight down once the deck is over.
      // A quarter turn the other way lays it back along the panel toward the
      // hinge, which is DOWN the wall while the wall is standing.
      range: [-Math.PI / 2, 0],
      stage: 3,
      mass: 2.6,
      com: [0, -DECK_LEG / 2, 0],
      hulls: [{ c: [0, -DECK_LEG / 2, 0], s: [mm(44), DECK_LEG, mm(44)], tag: 'leg' }],
      mates: ['kerb-deck', 'floor', 'gate-left', 'lid'],
    })
    rig.attach(`deck-leg-${n}`, legGeometry(lib, DECK_LEG, { section: mm(40), foot: mm(130) }))

    // THE CANOPY POLES, on the same edge and in the same channels, swinging the
    // other way. 860 mm is all that stows on a 1050 panel once the leg is lying
    // in the lane beside it, and the canopy wants 1540, so it telescopes.
    rig.add({
      id: `canopy-pole-${n}`,
      parent: 'kerb-deck',
      label: 'canopy pole',
      pivot: [DECK_D - mm(70), BOX.t / 2, sz * mm(790)],
      joint: 'hinge',
      axis: [0, 0, 1],
      // Authored standing up +Y — vertical the moment the deck is down — and
      // laid back along the panel by a quarter turn for transit.
      range: [Math.PI / 2, 0],
      stage: 3,
      mass: 1.4,
      com: [0, POLE_H / 2, 0],
      hulls: [{ c: [0, POLE_H / 2, 0], s: [mm(44), POLE_H, mm(44)], tag: 'pole' }],
      mates: ['kerb-deck', 'floor', 'gate-left', 'lid'],
    })
    rig.attach(`canopy-pole-${n}`, polePart(lib, POLE_H, mm(22)))

    rig.add({
      id: `canopy-mast-${n}`,
      parent: `canopy-pole-${n}`,
      label: 'pole extension',
      pivot: [0, POLE_H, 0],
      joint: 'telescope',
      axis: [0, 1, 0],
      range: [0, POLE_RISE],
      stage: 4,
      mass: 0.9,
      com: [0, -POLE_RISE / 2, 0],
      hulls: [{ c: [0, -POLE_RISE / 2, 0], s: [mm(38), POLE_RISE, mm(38)], tag: 'pole' }],
      mates: [`canopy-pole-${n}`, 'kerb-deck', 'floor', 'gate-left', 'lid'],
    })
    rig.attach(`canopy-mast-${n}`, polePart(lib, POLE_RISE, mm(19), { anchor: -1 }))
  }

  // --- the bunk ------------------------------------------------------------
  const bunk = rig.add({
    id: 'bunk',
    parent: 'lid',
    label: 'bunk deck',
    pivot: [0, -mm(120), 0],
    joint: 'telescope',
    axis: [0, 1, 0],
    // Down the same four corner guides the lid came up. It rides them to 1220
    // above the deck, which puts the cabover's underside 20 mm over the cab roof
    // — enough for the anti-sway pads and nothing more.
    range: [0, -BUNK_DROP],
    // An explicit window, not a stage. Stages overlap by 28% so the fold reads
    // as one continuous move, and here the overlap is the whole problem: start
    // sliding while the bunk is still 200 mm high and the cabover drives into
    // the torii guard. The drop finishes before the slide begins, full stop.
    window: [0.55, 0.75],
    mass: 26,
    com: [0, 0, 0],
    // The mattress is in the hull. It was not, and 110 mm of foam that the
    // packing check cannot see is 110 mm of foam that ends up inside the lid.
    hulls: [{ c: [0, mm(15), 0], s: [BUNK_L, mm(190), BUNK_W], tag: 'bunk + mattress' }],
    mates: ['lid', 'floor'],
    note: 'packs under the lid at 870; drops to 1220 so the cabover clears the cab roof',
  })
  rig.attach(bunk.id, bunkDeck(lib))

  const slideOut = rig.add({
    id: 'bunk-slide',
    parent: 'bunk',
    label: 'cabover extension',
    // 20 below the bunk deck's own origin, and those 20 mm are load-bearing in
    // the drawing sense. At 40 the extension's 100 mm side rails ran from 1770
    // to 1870 above the road against a cab roof at 1780 — ten millimetres of
    // aluminium inside the cab — and its plywood underside came out at exactly
    // the same height as the bunk deck's, so 0.3 m² of two down-facing ply
    // surfaces sat at one depth and shimmered against each other.
    pivot: [BUNK_L / 2 - SLIDE_L, -mm(20), 0],
    joint: 'slide',
    axis: [1, 0, 0],
    range: [0, SLIDE_TRAVEL],
    window: [0.8, 1],
    mass: 22 + 12,
    com: [SLIDE_L / 2, 0, 0],
    hulls: [{ c: [SLIDE_L / 2, 0, 0], s: [SLIDE_L, mm(80), BUNK_W - mm(60)], tag: 'cabover' }],
    // 'cab' is NOT declared here any more. It used to be, and it was hiding the
    // fault above: the cabover was 150 mm inside the cab roof and the mate said
    // so was fine. It now clears by 20 and the auditor is allowed to check.
    mates: ['bunk', 'lid', 'floor'],
    note: '950 mm over the cab: 700 Nm at the root, 13.5 MPa in the side rails',
  })
  rig.attach(slideOut.id, bunkSlide(lib))

  return {
    massBudget: [
      ['subframe', 36],
      ['hard shell: composite walls + floor', 54],
      ['pop-top lid, bellows and guides', 35],
      ['kerb wall / fold-down deck', 30],
      ['deck legs, canopy poles, feet', 8],
      ['canopy: sheet, rail, hem bar, guys', 6],
      ['bunk deck + cabover slides', 49],
      ['stabiliser jacks (4)', 18],
      ['fitted kit — see the bill of materials', 84],
      ['water, 20 L', 20],
    ],
    notes: [
      'An adult is 1800 mm and the bed is 1940 × 1410. One person fits lengthwise; two do not. So the bunk slides 950 mm out over the cab roof and becomes 2820 × 1280.',
      'That cantilever is real: two adults at 475 mm out is 700 Nm at the root, 13.5 MPa in a pair of 100 × 50 × 3 aluminium rails against 240 MPa yield. The pads on the cab roof stop it swaying; a 0.7 mm steel cab roof carries nothing.',
      'The pop-top takes standing height from 900 to 1780 mm. That is enough for a lot of people and short for the rest, which is worth saying rather than rounding up to 2000.',
      'The galley worktop finishes at 750 mm and nothing on it stands proud, because the bunk deck hangs at 790 with the lid down. That one clearance decides three purchases: a folding tap, a drop-in bowl instead of the over-counter one the catalogue pushes, and a hob that travels in the locker — which is what Iwatani ask for anyway, since the cartridge sits in the body.',
      'The aisle between the galley and the bench is 335 mm. That is not a mistake and it is not fixable: 1290 mm of interior width minus a 450 mm galley run minus a 480 mm seat is what is left. It is also the entire reason the kerb wall lifts — the room is outside.',
      'Four guided corners rather than scissor arms. A scissor is the nicer mechanism but it is a closed loop; four guides hold the lid parallel with no synchronising linkage.',
      'The shell is 3 mm aluminium composite on 40 × 40 extrusion, not plywood. Plywood walls and floor come to about 90 kg on this footprint and the fitted kit is 84 — one of the two had to give, and it was not the fridge.',
      'The bill of materials totals 98 kg and 84 of it is fitted. The difference is the WAVE 2 air conditioner: it survived the first pass and then did not survive the check, because a Seitz S4 window weighs 8.5 kg rather than the 5.5 that was assumed, and two of them took the margin. The line stays on the list with its price, because the trade is the decision.',
      'The whole outdoor room costs 4 kg over the gullwing and porch it replaces, and gives 1.83 m² of floor instead of 0.89 m² of porch. That is the only line in this project where more space came out cheaper.',
      'Water is 20 L, one tank. A second 20 L tank is 40 kg of water and 40 kg is the entire margin, so the spare tank on the list is exactly that: a spare, filled at the tap, not carried full.',
      'THE KERB WALL IS THE FLOOR. Hinged at the floor line rather than the top, it falls outboard to a 1740 × 1050 deck level with the cabin floor — 1.83 m² of room outside the chassis from a panel the truck was carrying anyway. Interior 2.43 plus deck 1.83 is 4.26 m², against 2.43 for the box on its own.',
      'And it costs nothing to pack, which is the point of doing it this way. A fold-out that stows as a panel spends its own thickness on the load space; a fold-out that stows as a WALL spends nothing, because the wall existed. The legs and the poles are routed into that 40 mm skin, flush, so they are free too — and everything else in the outdoor room is fabric in a bag.',
      'It has legs to the tarmac, not stays. 1050 mm of cantilever with two adults on it is a floor, not a doorstep: a hinge and a gas strut would be carrying about 1.5 kN·m between them, and a deck that visibly moves underfoot is a deck nobody stands on.',
      'The 1050 is the shell height plus the panel thickness, so standing up it exactly fills the opening from the floor line to the lid sill, and lying down its top face lands FLUSH with the cabin floor instead of 40 mm proud of it. A 40 mm step in a doorway is the one you catch.',
      'With the kerb wall down the lid is carried on that side by the two corner columns and the top rails of the front and rear walls. That is why the panel is 1740 wide and sits between the columns rather than being structure itself — a wall you intend to drop cannot also be holding the roof up.',
      'The roof over the deck is a canopy, not a gullwing. Two poles telescope up off the outer edge and a sheet unrolls to them from a keder rail on the raised lid: 1.0 m of sheltered ground for 6 kg, where the hard porch roof this replaces was 24 kg and swept a 1.0 m arc through the space it was trying to shelter.',
      'Packed it is 1010 mm above the deck — 1670 overall, 110 under the cab roof. It should look like a work truck with a canopy until it opens.',
    ],
    // Soft goods, outside the collision audit because nothing about a rolled
    // sheet is a rigid body. The canopy tracks the pole extension: it unrolls as
    // the masts rise, and the roll beside the rail shrinks by exactly as much.
    update(_t, r) {
      const q = r.parts.get('canopy-mast-f')?.q ?? 0
      const u = Math.min(1, Math.max(0, q / POLE_RISE))
      const { roll, bag } = sail.userData
      roll.scale.y = Math.max(0.004, u)
      bag.scale.set(1 - 0.86 * u, 1, 1 - 0.86 * u)
      // The bellows concertina with the roof rather than standing at full
      // height with it down, which is both what fabric does and the only way
      // the packed box does not have 790 mm of canvas hanging through it.
      const lift = r.parts.get('lid')?.q ?? 0
      top.userData.skirt.scale.y = Math.max(0.015, Math.min(1, lift / LID_RISE))
    },
  }
}

// --- geometry ---------------------------------------------------------------

function shell(lib) {
  const g = new THREE.Group()
  const y = FLOOR + BOX.h / 2
  const skin = lib.ply
  // Front (cab end), rear, and off-side walls. The kerb side is the deck.
  // The end walls run BETWEEN the off-side wall and the kerb panel rather than
  // across the full width, which is both the joinery and the fix: full width
  // they finished on exactly the plane the side wall finishes on, and two white
  // ply faces pointing the same way at one depth is a corner that shimmers.
  g.add(slab([BOX.t, BOX.h, HALF * 2 - BOX.t * 2], skin, { pos: [mm(905), y, 0] }))
  g.add(slab([BOX.t, BOX.h, HALF * 2 - BOX.t * 2], skin, { pos: [-mm(945), y, 0] }))
  g.add(slab([mm(1850), BOX.h, BOX.t], skin, { pos: [BOX_CX, y, HALF - BOX.t / 2] }))
  // Corner extrusions, which is what a sandwich-panel body is actually held
  // together by.
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      g.add(extrusion([BOX_CX + sx * mm(925), FLOOR, sz * (HALF - mm(20))], [BOX_CX + sx * mm(925), FLOOR + BOX.h, sz * (HALF - mm(20))], mm(56), lib.aluDark))
    }
  }
  // A door in the rear wall, and a Seitz S4 in the off-side: 900 x 450 of
  // acrylic double glazing in its own frame, which is a real camper window with
  // a flyscreen and a blackout pleat already inside it. It is 5.5 kg, which is a
  // lot for a hole in a wall, and it is why there are two of these and not four.
  g.add(slab([mm(16), mm(760), mm(560)], lib.aluDark, { pos: [-mm(966), FLOOR + mm(400), mm(180)] }))
  // THE WINDOW WAS THIN IN THE WRONG AXIS. slab() takes [x, y, z], and the
  // off-side wall is the one that is thin in Z — so a frame written 20 x 510 x
  // 960 is not a window in that wall, it is a 960 mm panel standing at right
  // angles to it, sticking straight out over the traffic side. It rendered as a
  // slab hanging in the air off the shell's front corner.
  g.add(slab([mm(960), mm(510), mm(20)], lib.aluDark, { pos: [BOX_CX + mm(300), FLOOR + mm(610), HALF + mm(8)] }))
  g.add(slab([mm(900), mm(450), mm(14)], lib.glass, { pos: [BOX_CX + mm(300), FLOOR + mm(610), HALF + mm(8)] }))
  // The four guides the lid runs on, standing proud inside the corners.
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      g.add(slab([mm(70), mm(240), mm(70)], lib.alu, { pos: [BOX_CX + sx * mm(840), FLOOR + BOX.h - mm(120), sz * (HALF - mm(90))] }))
    }
  }
  return g
}

/**
 * The galley down the off-side wall, and the bench that becomes the lower bed.
 *
 * Every box in here is the size of the box on the invoice, which is the only
 * reason the layout means anything. The worktop is at 720 rather than a
 * domestic 850, because the shell is 1010 tall and the counter has to live
 * inside it with the lid DOWN: 720 plus a 40 mm top is 760, and the packed
 * interior is 900.
 *
 * Nothing here is screwed to its own case. The ENGEL runs in a ply cradle on
 * heavy slides; the DELTA 2 sits in a well with a strap through its handle
 * apertures; the Iwatani drops into a 3 mm rebate with a retaining bar, because
 * a cassette stove has four rubber feet and a gas cartridge and belongs to
 * neither the counter nor the road.
 */
function interior(lib) {
  const g = new THREE.Group()
  // 640, not a domestic 850, and not the 720 this started at either. THE BUNK
  // DECK SETS IT. Packed, the bunk hangs off the lid at 790 to 870 above the
  // cargo deck and it spans the full width, so the worktop's top face has to
  // finish below 790 — and NOTHING may stand proud of it. That is the whole
  // reason the hob lives in the locker and the basin is a drop-in rather than
  // the over-counter bowl the catalogue wants to sell you.
  const TOP = FLOOR + mm(640)
  const Z = mm(410) // centreline of the galley run, off-side

  // Counter carcass and worktop, 1780 long down the off-side wall.
  g.add(slab([mm(1780), mm(600), mm(450)], lib.ply, { anchor: [0, -1, 0], pos: [BOX_CX, FLOOR, Z] }))
  g.add(slab([mm(1800), mm(40), mm(470)], lib.ply, { pos: [BOX_CX, TOP, Z] }))

  // Iwatani タフまる CB-ODX-1, 341 x 129 x 283, in the open locker under the
  // worktop. It is not fixed to anything and it is not meant to be: Iwatani's
  // own instruction is DO NOT ENCLOSE, because the cartridge sits in the body
  // and heats. It is lifted out and used on the porch, which is also the only
  // place on this vehicle where an open flame belongs.
  g.add(slab([mm(283), mm(129), mm(341)], lib.aluDark, { pos: [mm(560), FLOOR + mm(150), Z - mm(30)] }))
  g.add(slab([mm(300), mm(10), mm(360)], lib.ply, { pos: [mm(560), FLOOR + mm(80), Z - mm(30)] }))

  // A 300 mm drop-in bowl, 100 deep, recessed clean into the worktop. The
  // over-counter version of the same basin stands 100 mm proud, and there is no
  // 100 mm to be had under a bunk deck sitting 40 mm above the top.
  const bowl = lathe([[mm(150), mm(20)], [mm(146), -mm(80)], [mm(40), -mm(100)], [0, -mm(100)]], lib.stainless, { seg: 20, open: true })
  bowl.position.set(mm(60), TOP + mm(3), Z)
  g.add(bowl)
  // Folding tap: it lies down inside the bowl's rim for travel, which is what
  // every galley tap on a boat does and for exactly this reason.
  g.add(rod([mm(60) - mm(200), TOP, Z], [mm(60) - mm(200), TOP + mm(20), Z], mm(14), lib.chrome))
  g.add(rod([mm(60) - mm(200), TOP + mm(16), Z], [mm(60) - mm(60), TOP + mm(10), Z], mm(12), lib.chrome))

  // ENGEL MHD14F-D — 442 wide, 284 deep, 398 tall and 11.5 kg, on slides under
  // the worktop. The 680 mm void is sized off that 398 and not the other way
  // round; the first draft had this box 100 mm shorter and 150 mm deeper than it
  // is, and a three-sided cradle cut to those numbers would not take the fridge.
  g.add(slab([mm(442), mm(398), mm(284)], lib.aluDark, { pos: [-mm(300), FLOOR + mm(230), Z + mm(40)] }))
  g.add(slab([mm(20), mm(300), mm(240)], lib.trim, { pos: [-mm(300) - mm(231), FLOOR + mm(230), Z + mm(40)] }))

  // EcoFlow DELTA 2 — 400 x 281 x 211, in a strapped well.
  g.add(slab([mm(211), mm(281), mm(400)], lib.trim, { pos: [-mm(760), FLOOR + mm(190), Z] }))
  g.add(slab([mm(50), mm(30), mm(300)], lib.ledCyan, { pos: [-mm(760) - mm(110), FLOOR + mm(250), Z] }))

  // Food-grade 20 L tank, 350 x 416 x 178 — the narrow deep one, not the fat
  // kerosene can it is easy to buy by mistake. One carried, one spare and empty.
  for (const dx of [-mm(880), -mm(680)]) {
    g.add(slab([mm(178), mm(416), mm(350)], lib.paint, { pos: [mm(600) + dx, FLOOR + mm(215), Z + mm(30)] }))
  }

  // The bench down the kerb side: locker below, cushion on top. It is the lower
  // berth as well, which is what a tri-fold mattress buys you.
  g.add(slab([mm(1800), mm(340), mm(480)], lib.ply, { anchor: [0, -1, 0], pos: [BOX_CX, FLOOR, -mm(390)] }))
  g.add(slab([mm(1800), mm(110), mm(480)], lib.canvasIndigo, { pos: [BOX_CX, FLOOR + mm(395), -mm(390)] }))

  // 12 V strip over the galley, and the lamp that actually lights the render.
  g.add(slab([mm(1400), mm(22), mm(60)], lib.ledWarm, { pos: [BOX_CX, FLOOR + mm(690), Z + mm(215)] }))
  const lamp = new THREE.PointLight(0xffc98a, 6, 4, 2)
  lamp.position.set(BOX_CX, FLOOR + mm(860), mm(60))
  g.add(lamp)
  return g
}

/** The pop-top: lid, bellows, and the sleeves that run on the guides. */
function popTop(lib) {
  const g = new THREE.Group()
  // 1840 x 1360, not 1850 x 1370: the lid's own deck stops 5 mm short of the
  // shell's outer faces on every side so the two do not finish on one plane
  // with the roof down. The 1880 x 1400 cap over it is what the eye reads as
  // the roofline anyway, and it still overhangs.
  g.add(slab([mm(1840), mm(70), mm(1360)], lib.ply, { anchor: [0, -1, 0], pos: [0, mm(20), 0] }))
  g.add(slab([mm(1880), mm(30), mm(1400)], lib.aluDark, { pos: [0, mm(105), 0] }))
  // MaxxFan Deluxe 6200K through a 400 mm cut-out. Its FLANGE is 586 x 417, not
  // the 470 square the first draft assumed, and that 116 mm matters: the lid is
  // 1850 x 1370 and it also has to carry two 1050 x 540 solar panels. Turn the
  // panels across the lid — 1050 in Z, 540 each in X — and they take 1080 of the
  // 1850, which leaves 770 for a 586 flange. Lay them along the lid instead and
  // nothing fits. The fan lives in the LID rather than the shell because the
  // shell's roof is the surface that has to pass under 1120 mm.
  g.add(slab([mm(586), mm(60), mm(417)], lib.paint, { pos: [-mm(620), mm(150), 0] }))
  g.add(slab([mm(520), mm(80), mm(380)], lib.paint, { anchor: [0, -1, 0], rot: [0, 0, deg(-12)], pos: [-mm(620), mm(178), 0] }))
  g.add(slab([mm(400), mm(190), mm(400)], lib.aluDark, { pos: [-mm(620), mm(20), 0] }))
  // Two Renogy 100 W flexible panels, bonded to the lid skin and edge-sealed.
  for (const dx of [mm(30), mm(580)]) {
    g.add(slab([mm(540), mm(6), mm(1050)], lib.trim, { pos: [dx, mm(142), 0] }))
    g.add(slab([mm(500), mm(3), mm(1010)], lib.glass, { pos: [dx, mm(147), 0] }))
  }
  // THE SKIRT, and its height is not the lid's travel. The gap the canvas has
  // to close runs from the shell's top rail at 1100 above the deck to the lid's
  // own underside, which is 20 above the lid's origin — 790 mm with the roof
  // fully up, not the 880 the lid rises. Cut at 880 from the lid's centreline
  // the canvas ran 90 mm down INSIDE the 40 mm shell wall, and its pleats swing
  // 35 either way, so a band of fabric and a band of plywood were fighting for
  // the same pixels all the way round the top of the box. That was the dithered
  // stripe under the roofline in every view of this station.
  //
  // And it now concertinas. The skirt hangs from the lid's underside and is
  // scaled by the lid's own extension in update(), so with the roof down it is
  // a 12 mm bundle of folds under the lid rather than 790 mm of taut canvas
  // hanging through the galley.
  const skirt = new THREE.Group()
  skirt.position.y = mm(20)
  g.add(skirt)
  g.userData.skirt = skirt
  for (const sz of [-1, 1]) {
    const b = bellows(mm(1810), SKIRT_H, mm(70), lib.canvasCream, { pleats: 9 })
    b.position.set(0, -SKIRT_H / 2, sz * (HALF - mm(45)))
    skirt.add(b)
  }
  for (const sx of [-1, 1]) {
    const b = bellows(mm(1320), SKIRT_H, mm(70), lib.canvasCream, { pleats: 7 })
    b.rotation.y = Math.PI / 2
    b.position.set(sx * mm(900), -SKIRT_H / 2, 0)
    skirt.add(b)
  }
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      g.add(slab([mm(92), mm(300), mm(92)], lib.alu, { pos: [sx * mm(840), -mm(140), sz * (HALF - mm(90))] }))
    }
  }
  return g
}

/**
 * The kerb wall, authored as foldPanel does it — running along its own +X from
 * the pin, with anchorY -1 so the skin sits on the inboard side of the hinge
 * line. Standing up that +X is up and the panel is a wall; over the top it is
 * outboard and the same face is the floor.
 *
 * WHICH SIDE IS WHICH MATTERS HERE MORE THAN ANYWHERE ELSE IN THE PROJECT, and
 * it comes out the good way round. Rotating outboard puts the panel's INBOARD
 * face upward, so the surface people walk on is the one that spent the drive
 * facing into the cabin — anti-slip battens and drainage falls, kept clean and
 * dry — and the face that took the road grime and the hedges becomes the
 * underside. Every fold-down deck ever built has this property; most of them
 * are detailed for it and the ones that are not are the ones you slip on.
 */
function deckPanel(lib) {
  const g = new THREE.Group()
  const a = [-1, -1, 0]
  // The sandwich panel itself, and the extruded edge that is the deck's beam.
  g.add(slab([DECK_D, BOX.t, DECK_W], lib.ply, { anchor: a }))
  g.add(slab([mm(70), BOX.t + mm(16), DECK_W], lib.aluDark, { anchor: a, pos: [DECK_D - mm(74), -mm(6), 0] }))
  for (const sz of [-1, 1]) {
    g.add(slab([DECK_D - mm(8), BOX.t + mm(10), mm(40)], lib.alu, { anchor: a, pos: [mm(4), -mm(5), sz * (DECK_W / 2 - mm(24))] }))
  }
  // Anti-slip battens across the walking face — which is the INBOARD face while
  // this is a wall, so they double as the cabin's kerb-side lining ribs.
  for (let i = 1; i <= 6; i++) {
    g.add(slab([mm(34), mm(8), DECK_W - mm(120)], lib.aluDark, { pos: [i * mm(145), BOX.t + mm(4), 0] }))
  }
  // The routed channels the legs and poles drop into, flush with the skin.
  for (const sz of [-1, 1]) {
    for (const cz of [mm(700), mm(790)]) {
      g.add(slab([mm(660), mm(10), mm(52)], lib.trim, { pos: [DECK_D - mm(400), mm(6), sz * cz] }))
    }
  }
  g.add(hingeX(lib, DECK_W, mm(17)))
  // No window in this panel, and that is the one thing the gullwing had that
  // this does not. A wall you intend to walk on cannot have glass in it — the
  // face that carries the light is the face that carries the feet. The daylight
  // comes from the off-side Seitz and from the bellows band instead.
  // Festoon along the outer edge: the thing that actually turns a deck into
  // somewhere to sit.
  for (let i = -4; i <= 4; i++) {
    g.add(slab([mm(60), mm(60), mm(60)], lib.ledWarm, { pos: [DECK_D - mm(40), BOX.t + mm(40), i * mm(200)] }))
  }
  const glow = new THREE.PointLight(0xffc07a, 6, 5, 2)
  glow.position.set(DECK_D - mm(120), BOX.t + mm(120), 0)
  g.add(glow)
  return g
}

/** A telescoping pole section: a tube with a collar at each end. */
function polePart(lib, length, radius, { anchor = 1 } = {}) {
  const g = new THREE.Group()
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 12), lib.alu)
  tube.position.y = (anchor * length) / 2
  g.add(tube)
  g.add(slab([radius * 2.6, mm(34), radius * 2.6], lib.aluDark, { pos: [0, anchor * mm(20), 0] }))
  g.add(slab([radius * 2.6, mm(34), radius * 2.6], lib.aluDark, { pos: [0, anchor * (length - mm(20)), 0] }))
  return g
}

/**
 * The canopy: a keder rail on the raised lid's kerb edge, and a sheet that
 * unrolls off it to the pole tips.
 *
 * It is drawn rather than jointed because it is fabric — nothing about a rolled
 * sheet is a rigid body and nothing about it can collide. What it does have to
 * do is unroll from the rail rather than appear, so the sheet hangs from a group
 * scaled along its own length and the roll beside it shrinks as the sheet grows.
 *
 * THE SLOPE IS SET BY THE TWO ENDS AND NOTHING ELSE. The rail is 2626 above the
 * road with the lid up; the pole tips are 2270; they are 980 mm apart across the
 * truck. That is a 1043 mm run at 20 degrees — a pitch that sheds rain, and a
 * hem 1520 above the deck, which is headroom everywhere but the last 300 mm.
 */
function canopy(lib) {
  const g = new THREE.Group()
  const RUN = mm(980) - mm(24)
  const DROP = mm(356) + mm(36)
  const L = Math.hypot(RUN, DROP)
  // Inboard of the skin, not on it. The rolled sheet is 150 across and it stows
  // under the lid's own overhang: on the outside face it would be 65 mm past the
  // truck's body line, which is 65 mm of canvas at hedge height on every lane in
  // Japan.
  g.position.set(0, mm(60), -HALF + mm(120))

  // The keder rail, which is the only hard part of the whole outdoor room.
  g.add(slab([DECK_W + mm(60), mm(36), mm(46)], lib.aluDark, { pos: [0, 0, -mm(96)] }))

  const roll = new THREE.Group()
  roll.rotation.x = Math.atan2(RUN, DROP)
  const sheet = cloth(DECK_W, L, mm(55), lib.canvasCream, { nx: 12, ny: 6 })
  sheet.position.y = -L / 2
  sheet.material.side = THREE.DoubleSide
  roll.add(sheet)
  // The hem bar, which is what the poles actually pick up.
  const hem = slab([DECK_W + mm(40), mm(30), mm(30)], lib.aluDark, { pos: [0, -L, 0] })
  roll.add(hem)
  g.add(roll)

  const bag = new THREE.Mesh(new THREE.CylinderGeometry(mm(75), mm(75), DECK_W, 14), lib.canvasCream)
  bag.rotation.z = Math.PI / 2
  bag.position.set(0, -mm(4), 0)
  g.add(bag)

  g.userData = { roll, bag }
  return g
}

function bunkDeck(lib) {
  const g = new THREE.Group()
  g.add(slab([BUNK_L, mm(70), BUNK_W], lib.ply, { pos: [0, -mm(35), 0] }))
  for (const sz of [-1, 1]) {
    g.add(slab([BUNK_L, mm(100), mm(50)], lib.aluDark, { pos: [0, -mm(53), sz * (BUNK_W / 2 - mm(29))] }))
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
    g.add(slab([SLIDE_L, mm(100), mm(50)], lib.aluDark, { anchor: [-1, 0, 0], pos: [0, -mm(24), sz * (BUNK_W / 2 - mm(69))] }))
  }
  g.add(roundedSlab(SLIDE_L - mm(160), mm(110), BUNK_W - mm(180), mm(50), lib.canvasIndigo, { pos: [SLIDE_L / 2, mm(85), 0] }))
  for (const sz of [-1, 1]) {
    // The anti-sway pads REST ON the cab roof: bottom face at 1780 above the
    // road, which is the roof, and not a millimetre lower. They used to hang to
    // 1730, fifty millimetres inside a panel they are supposed to touch.
    g.add(slab([mm(160), mm(40), mm(120)], lib.rubberFoot, { pos: [SLIDE_L - mm(140), -mm(60), sz * mm(430)] }))
  }
  // A window in the cabover's front face, which every truck camper has.
  g.add(slab([mm(16), mm(300), mm(760)], lib.glass, { pos: [SLIDE_L - mm(4), mm(120), 0] }))
  return g
}
