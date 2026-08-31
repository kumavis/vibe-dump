import * as THREE from 'three'
import {
  mm, deg, slab, rod, extrusion, truss, T, X, HALF_W,
  addGates, addJack, subframe, subframeHull, foldPanel, foldPanelHull,
  hingeX, hingeZ, stay, latch, legGeometry, REST,
} from './common.js'
import { cloth, lathe, roundedSlab, profile } from '../build.js'

// ---------------------------------------------------------------------------
// YATAI — the bed is the kitchen, and the table is a road behind it
//
// THE FINDING THAT SHAPED THIS MODULE: the cook cannot stand on the deck.
//
// The deck is 660 mm up and the packing ceiling is 1120 mm above it, so anything
// tall enough to stand under is taller than the cab roof. So the cook works from
// the TARMAC with the kerb gate down, which is also how a Fukuoka yatai has
// always worked — and once that is settled, the bed does not need a galley built
// on it. THE BED IS THE GALLEY. The equipment simply stands on the deck and the
// heights come out right on their own:
//
//   GRIDDLE PLATE 850 above the road. An IKK TKO18321 is 190 mm tall and the
//   deck is 660, and 850 is where you want a teppan — below the elbow, so you
//   are looking down onto it.
//   COUNTER TOP 980. The one thing that does need a carcass, because a drop-in
//   gastronorm needs something to drop into: 320 mm of it, and the 120 mm pans hang
//   clear of the deck with the plumbing under them.
//   FRIDGE TOP 1070, TANK TOP 1160. Stores stand along the off side as a back
//   wall, which is exactly where a wall is useful.
//
// AND THE SERVING IS OFF THE BACK. A counter down the kerb side puts the queue
// where the cook is working; a table off the tail puts it behind the truck,
// facing the kitchen, out of the way of the road. Three 700 mm leaves stand
// against the tail in a 135 mm stack and fall aft into a 2100 x 900 communal
// table at 720 — a table height, with stools, which is what a yatai is.
//
// NO EXTRACT. This one is a deletion rather than a design: an open-air stall
// with the sky over the griddle does not need the hood, the grease filter, the
// 150 mm duct and the 200 mm 有圧換気扇 that a CLOSED kitchen car needs, and
// carrying them anyway costs 16 kg and ¥48,873. The canopy is a canopy, not a
// ceiling; the smoke goes up.
//
// The deck plan closes across 1410 with the lanes doing different jobs:
//   185 kerb strip and post lane | 400 working line | 410 aisle | 400 stores
//
// AND THE GAS BOTTLE IS NOT ON THE DECK. Regulation wants it outdoors, upright,
// vented at low level because propane sinks, and 2 m from any flame. On a
// 1940 mm deck with a griddle on it there is no 2 m, so it hangs in a vented
// locker off the rear crossmember, offset to the off side so the table clears
// it.
//
// NOBODY STANDS ON THE FOLD-OUTS. A 2 m fold-out at the 4 kPa assembly live load
// is 1580 kg — four and a half times the whole payload. The table takes people
// LEANING on it and it has legs to the ground for that; the truck holds the
// kitchen and the pavement holds the queue.
// ---------------------------------------------------------------------------

const FLOOR = mm(60) //        thin subframe: every millimetre is worktop height

// The deck plan. Four lanes across 1410, each doing a different job.
const POST_Z = -mm(580) //     the stall posts lie in the kerb strip, outboard of everything
// The kerb lane stops at -385 and not a millimetre outboard of it. The header
// sweeps its 1850 mm arc in the plane z = -460 on the way across — the posts
// stand at -580 and the beam is offset 120 inboard of them — and the awning
// cassette rides that arc 60 mm wider still, to -400. Putting the sink counter
// where the header swings is how the first draft of this layout collected 34
// interferences, and the last 4 mm of them was the counter's outboard lip.
const KERB = { z0: -mm(385), z1: mm(45) } //  the working line: sink counter, then griddle
const BACK = { z0: mm(45), z1: mm(565) } //   stores: hand basin, fridge, two tanks
const SINK_H = mm(250) //      970 above the road at the rim, and 46 of clearance under a 180 bowl
const STORE_H = mm(500) //     the tallest thing standing on the deck

const COUNTER_Y = mm(370) //   1030 above the tarmac — the cook's pass, chest height
const COUNTER_D = mm(430)
const COUNTER_W = mm(1500)
const COUNTER_X = mm(180)
const COUNTER_Z = -mm(680)
const PANEL_T = mm(34)

// THE SERVING TABLE. Three leaves standing against the tail in a 135 mm stack,
// falling aft into 2100 x 900 at 720 above the road.
//
// The hinge is 320 above the module floor, on a pair of short posts at the tail,
// and both of those numbers are forced. 320 puts the top at 1040 above the road,
// which is the height a yatai counter has always been. And it has to be up there
// anyway: the leaves stack face to face, so the outer one swings on a radius
// 80 mm larger than the inner one and dips below the pin on the way over. Hinge
// the stack at deck level and the third leaf goes 61 mm into the cargo floor,
// which is exactly what the audit said the first time.
//
// 700 mm leaves, because the stack has to clear the 1120 ceiling: 320 + 700 is
// 1020, and 320 + 900 would be 1220. The leg that lies on a 700 leaf is then
// 680, which is 320 short of the road — so the last 320 telescopes, the same
// answer the sound module's tray legs reached from the same direction.
// Offset 100 mm to the off side, and that is not a styling choice either: the
// header sweeps in the plane z = -460 and its awning cassette in z = -520 to
// -400, so a 900 mm table on the centreline puts its kerb-side edge and its legs
// straight through both. A hundred and forty over clears the legs by 60.
const TABLE_X = -mm(840) //    the hinge line, just forward of the deck's aft edge
const TABLE_Z = mm(140)
const TABLE_Y = FLOOR + mm(320) // 1040 above the road: the height a yatai counter is
const TABLE_L = mm(700) //     each leaf
const TABLE_W = mm(900)
const TABLE_T = mm(40)
const LEG_LEN = mm(680) //     hinged leg...
const LEG_DROP = mm(320) //    ...and the foot that telescopes out of it

// The stall frame. Two posts lie flat along the deck and swing up at the ends of
// the counter; a header folds off one of them and swings across to the other,
// exactly the way the shrine's torii carries its own lintel. 1750 mm is the
// longest post that will lie on a 1940 mm deck once its hinge and its foot are
// accounted for.
const POST_X = mm(870)
const POST_LEN = mm(1750)
// The two posts lie STACKED and rise SEPARATELY, and both of those are the
// audit's doing. Stacked, because they share the same 1750 mm of deck length
// and cannot both have it. Separately, because they swing in the same vertical
// plane about pivots 1740 mm apart, so their quarter-discs overlap in the
// middle — and post A carries the whole folded header assembly round with it.
// A rises clear over B; B waits until A is vertical.
const POST_YB = FLOOR + mm(220)
const POST_YA = POST_YB + mm(80)
const HEADER_LEN = mm(1850)

// The awning is a CASSETTE, not a folding panel, and that is the only thing that
// fits. A rigid 1.1 m awning has nowhere on this deck to lie flat. A roller tube
// 1700 long and 150 across stows on the header and takes no deck at all, which
// is exactly why real shop awnings are built that way.
const AWNING_OUT = mm(1300)
const AWNING_W = mm(1500)

export default {
  id: 'yatai',
  title: 'Yatai',
  tagline: 'the bed is the kitchen; the table is a road behind it',
  build,
}

function build(ctx) {
  const { rig, lib } = ctx

  rig.setStages([
    'kerb side down, jacks in',
    'table falls out of the tail, first post rises',
    'second leaf out, second post rises',
    'third leaf, header across, pass drops',
    'table legs down, awning rolls out',
    'arms, valance, prep shelf',
  ])

  const base = rig.add({
    id: 'floor',
    parent: null,
    label: 'subframe + galley',
    joint: 'fixed',
    static: true,
    mass: 44 + 78,
    com: [mm(400), FLOOR + mm(220), mm(80)],
    hulls: [
      ...subframeHull(FLOOR),
      // The kitchen, as three lanes of things standing on the deck. Not one box:
      // the sink counter is the only carcass on this truck and everything else
      // is a machine with feet.
      { c: [-mm(300), FLOOR + SINK_H / 2, (KERB.z0 + KERB.z1) / 2], s: [mm(1000), SINK_H, KERB.z1 - KERB.z0], tag: 'sink counter' },
      { c: [mm(557), FLOOR + mm(95), (KERB.z0 + KERB.z1) / 2], s: [mm(595), mm(190), mm(358)], tag: 'griddle' },
      { c: [-mm(630), FLOOR + mm(120), (BACK.z0 + BACK.z1) / 2], s: [mm(340), mm(240), mm(320)], tag: 'hand basin' },
      { c: [-mm(164), FLOOR + mm(205), (BACK.z0 + BACK.z1) / 2], s: [mm(593), mm(410), mm(345)], tag: 'fridge' },
      { c: [mm(333), FLOOR + STORE_H / 2, (BACK.z0 + BACK.z1) / 2], s: [mm(400), STORE_H, mm(380)], tag: 'supply tank' },
      { c: [mm(733), FLOOR + STORE_H / 2, (BACK.z0 + BACK.z1) / 2], s: [mm(400), STORE_H, mm(380)], tag: 'waste tank' },
      { c: [TABLE_X, (FLOOR + TABLE_Y) / 2, TABLE_Z], s: [mm(90), TABLE_Y - FLOOR, mm(850)], tag: 'table posts' },
    ],
  })
  rig.attach(base.id, subframe(lib, { height: FLOOR }))
  rig.attach(base.id, galley(lib))

  addGates(rig, ctx, { left: 'hang', right: 'flat', tail: 'hang', stage: 0 })
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      addJack(rig, lib, { id: `jack-${sx > 0 ? 'f' : 'r'}${sz > 0 ? 'r' : 'l'}`, at: [sx * mm(880), -mm(70), sz * mm(660)], stage: 0 })
    }
  }

  // --- the stall frame -----------------------------------------------------
  // Two posts lying along the deck, one stacked on the other so they can share
  // the same 1750 mm of length, swinging up at the ends of the counter.
  for (const [n, sx, py, win] of [
    ['a', -1, POST_YA, [0.14, 0.34]],
    ['b', 1, POST_YB, [0.35, 0.54]],
  ]) {
    const post = rig.add({
      id: `post-${n}`,
      parent: 'floor',
      label: 'stall post',
      window: win,
      pivot: [sx * POST_X, py, POST_Z],
      joint: 'hinge',
      axis: [0, 0, 1],
      // Post A lies toward +X and stands up by a quarter turn. Post B lies the
      // other way, which needs BOTH a half turn at rest (so its geometry points
      // -X to begin with) and the opposite joint sense. Give it only the
      // opposite sense and it rotates straight down through the tarmac, which
      // the audit reports as 954 mm of ground.
      rest: sx > 0 ? [[0, 1, 0], Math.PI] : null,
      range: [0, sx < 0 ? Math.PI / 2 : -Math.PI / 2],
      stage: 1,
      mass: 9,
      com: [POST_LEN / 2, 0, 0],
      hulls: [{ c: [POST_LEN / 2, 0, 0], s: [POST_LEN, mm(64), mm(64)], tag: 'post' }],
      mates: ['floor', 'post-a', 'post-b'],
      note: '1750 mm — the longest post that lies on a 1940 mm deck',
    })
    rig.attach(post.id, stallPost(lib))
  }

  // The header folds along post A and swings across to post B once it is up —
  // the same move the shrine's torii uses to carry its own lintel, and for the
  // same reason: nothing then has to be lifted into place by hand.
  // `rest` is a half turn about Z, which is what makes the header's deployed
  // frame line up with the world's: its geometry is authored along +X, the rest
  // turns it to lie back down the post, and the quarter turn brings it across
  // with +X on world +X, +Y up and +Z outboard. Everything hung on it — the
  // arms, the awning cassette, the valance — can then be written in plain truck
  // axes instead of in a frame that is upside down and back to front.
  const header = rig.add({
    id: 'header',
    parent: 'post-a',
    label: 'header beam',
    // The 120 mm offset in post-local Z is the one that matters. Post-local Z is
    // world Z whichever way the post is lying, so it separates the header — and
    // everything hung on it — from the posts in a direction that does not change
    // as they rotate. Without it the awning cassette and the arms sweep a circle
    // centred on post A's top and pass straight through the post below it.
    pivot: [POST_LEN - mm(60), mm(110), mm(120)],
    joint: 'hinge',
    rest: [[0, 0, 1], Math.PI],
    axis: [0, 0, 1],
    range: [0, Math.PI / 2],
    window: [0.55, 0.72],
    mass: 12,
    com: [HEADER_LEN / 2, 0, 0],
    hulls: [{ c: [HEADER_LEN / 2, 0, 0], s: [HEADER_LEN, mm(80), mm(90)], tag: 'header' }],
    mates: ['post-a', 'post-b'],
  })
  rig.attach(header.id, headerBeam(lib))
  rig.attach(header.id, lanterns(lib))

  // --- the awning ----------------------------------------------------------
  const awning = rig.add({
    id: 'awning',
    parent: 'header',
    label: 'cassette awning',
    // The cassette sits ON TOP of the header, not beside it. Beside it there is
    // 48 mm between the posts and the counter and the roller is 170 across;
    // above it there is nothing at all, because the posts stop at the beam.
    pivot: [HEADER_LEN / 2 + mm(75), mm(90), 0],
    joint: 'slide',
    // Out toward the KERB, which is -Z. The customers are on that side; the
    // crew walkway is on the other.
    axis: [0, 0, -1],
    range: [0, AWNING_OUT],
    window: [0.72, 0.88],
    mass: 22,
    com: [0, 0, AWNING_OUT / 2],
    // The HULL IS THE LEADING RAIL, not the canvas. A rig part is a rigid body
    // and the rail is the only rigid thing that moves; the fabric between it and
    // the roller is soft goods, updated separately, and soft goods are not what
    // an interference check is about. Give the part a hull the size of the
    // deployed awning and it collides with the whole truck while still rolled up.
    hulls: [{ c: [0, -mm(30), 0], s: [AWNING_W, mm(120), mm(120)], tag: 'leading rail' }],
    mates: ['header'],
    note: 'a roller, not a folding panel — there is no flat 1.1 m left on the deck',
  })
  rig.attach(awning.id, awningRail(lib))

  // The canvas itself hangs off the header and is stretched to wherever the rail
  // has got to.
  const canvas = awningFabric(lib)
  canvas.position.set(HEADER_LEN / 2 + mm(75), mm(90), 0)
  rig.attach('header', canvas)

  // LATERAL ARMS, which is the mechanism a shop awning actually uses: they lie
  // ALONG the header and swing out horizontally about a vertical pin, rather
  // than hanging under it and swinging down. That matters for more than
  // authenticity — an arm that stows perpendicular to the header sticks 1.1 m
  // out into space and rides round with the header as it swings across, sweeping
  // a 2 m arc through the counter, the tailgate and the deck. Lying along the
  // beam it sweeps nothing at all.
  for (const [n, sx] of [['l', -1], ['r', 1]]) {
    const arm = rig.add({
      id: `awning-arm-${n}`,
      parent: 'header',
      label: 'lateral arm',
      pivot: [HEADER_LEN / 2 + sx * mm(700), sx > 0 ? -mm(70) : 0, 0],
      joint: 'hinge',
      axis: [0, 1, 0],
      // Authored along +X or -X, whichever points back along the beam; a quarter
      // turn takes each one out over the kerb.
      rest: sx > 0 ? [[0, 1, 0], Math.PI] : null,
      range: [0, sx > 0 ? -Math.PI / 2 : Math.PI / 2],
      window: [0.86, 1],
      mass: 4,
      com: [mm(560), 0, 0],
      hulls: [{ c: [mm(560), 0, 0], s: [mm(1120), mm(50), mm(50)], tag: 'arm' }],
      mates: ['header', 'awning', 'awning-arm-l', 'awning-arm-r'],
      note: 'the awning is a cantilever; the arm is what makes it a triangle',
    })
    rig.attach(arm.id, armStrut(lib, mm(1120)))
  }

  // NO RIGID VALANCE. It used to be a hinged panel stowed lying back over the
  // rolled cassette, and stowed is where it did the damage: 340 mm of panel
  // reaching inboard from z = -460 put it at -110, straight across the lane the
  // serving table has to fall through. It is also, in every real shop awning,
  // FABRIC — a scalloped skirt sewn to the leading rail. So it hangs off the
  // rail as soft goods, rolls into the cassette with the canvas, and stops being
  // a part with an envelope.

  // --- the counter ---------------------------------------------------------
  const counter = rig.add({
    id: 'counter',
    parent: 'floor',
    label: 'customer counter',
    pivot: [COUNTER_X, COUNTER_Y, COUNTER_Z],
    joint: 'hinge',
    axis: [1, 0, 0],
    rest: REST.UP_ALONG_X,
    // NEGATIVE, so it falls outboard over the kerb. Positive drops it inboard,
    // straight through the galley and the stall frame.
    range: [0, -Math.PI / 2],
    window: [0.55, 0.74],
    mass: 19,
    com: [COUNTER_D / 2, 0, 0],
    hulls: foldPanelHull(COUNTER_D, COUNTER_W, PANEL_T, 'counter'),
    mates: ['floor', 'gate-left'],
    note: '1030 above the tarmac, 60 above the worktop — the step a yatai counter has',
  })
  rig.attach(counter.id, counterTop(lib))

  for (const [n, sx] of [['l', -1], ['r', 1]]) {
    const br = rig.add({
      id: `counter-bracket-${n}`,
      parent: 'counter',
      label: 'counter bracket',
      pivot: [mm(280), PANEL_T / 2, sx * mm(560)],
      joint: 'hinge',
      axis: [0, 0, 1],
      range: [Math.PI, Math.PI + deg(140)],
      window: [0.74, 0.88],
      mass: 1.8,
      com: [mm(170), 0, 0],
      hulls: [{ c: [mm(175), 0, 0], s: [mm(350), mm(40), mm(40)], tag: 'bracket' }],
      mates: ['counter', 'floor'],
    })
    rig.attach(br.id, armStrut(lib, mm(350)))
  }

  // --- the serving table ---------------------------------------------------
  // Three leaves in a carpenter's-rule chain off the tail, exactly the trick the
  // DJ booth uses for its fascia and for the same reason: a 2100 mm table has to
  // arrive from a 135 mm stack. The pins alternate faces down the chain — +t,
  // -t, +t — and each leaf is anchored to put the right face on its own pin.
  //
  // The rest is a quarter turn about Z, which stands the first leaf UP out of a
  // panel authored flat; the joint then adds another quarter and the total half
  // turn lays it back down pointing AFT. Get the rest and the range the same
  // sign and it goes forward over the griddle instead.
  const leaf1 = rig.add({
    id: 'table-a',
    parent: 'floor',
    label: 'serving table (first leaf)',
    pivot: [TABLE_X, TABLE_Y, TABLE_Z],
    joint: 'hinge',
    axis: [0, 0, 1],
    rest: [[0, 0, 1], Math.PI / 2],
    range: [0, Math.PI / 2],
    window: [0.15, 0.31],
    mass: 15,
    com: [TABLE_L / 2, 0, 0],
    hulls: foldPanelHull(TABLE_L, TABLE_W, TABLE_T, 'leaf', -1),
    mates: ['floor', 'gate-tail'],
    note: 'the stack stands 1020 off the deck packed, 100 under the cab roof',
  })
  rig.attach(leaf1.id, foldPanel(lib, TABLE_L, TABLE_W, TABLE_T, { face: lib.ply, anchorY: -1 }))
  rig.attach(leaf1.id, hingeZ(lib, TABLE_W))

  const leaf2 = rig.add({
    id: 'table-b',
    parent: 'table-a',
    label: 'serving table (second leaf)',
    // The pin sits on the leaf's UPPER face. The first leaf's local +Y points
    // down once it is over, so a pin at +t puts the second leaf 40 mm under the
    // first — which reads as a tidy stack on paper and as a panel through the
    // table posts in the audit.
    pivot: [TABLE_L, -TABLE_T, 0],
    joint: 'hinge',
    axis: [0, 0, 1],
    // UNFOLDS OVER THE TOP, not under. A leaf on a 700 mm arm sweeps a half
    // circle to get in line with its neighbour, and half of that circle is below
    // the plane it ends up in — 700 below a table that is only 380 above the
    // deck, which is 320 mm inside the cargo floor. Swing it the other way and
    // the same fold happens in open air above the tail.
    range: [-Math.PI, 0],
    window: [0.31, 0.46],
    mass: 15,
    com: [TABLE_L / 2, 0, 0],
    hulls: foldPanelHull(TABLE_L, TABLE_W, TABLE_T, 'leaf', -1),
    mates: ['table-a'],
  })
  rig.attach(leaf2.id, foldPanel(lib, TABLE_L, TABLE_W, TABLE_T, { face: lib.ply, anchorY: -1 }))
  rig.attach(leaf2.id, hingeZ(lib, TABLE_W))

  // THE THIRD LEAF DRAWS OUT RATHER THAN FOLDING, and that is the whole answer
  // to a problem two rounds of pin-stepping did not solve. A leaf on a 700 mm
  // arm sweeps a half circle to get in line, and the leaf folded onto IT rides
  // that circle too — straight across the first leaf, 171 mm into it, whichever
  // way the pins are stepped. A draw-leaf sweeps nothing: it starts nested under
  // the second leaf and slides aft on a pair of rails, which is how an extending
  // dining table has worked for four hundred years.
  const leaf3 = rig.add({
    id: 'table-c',
    parent: 'table-b',
    label: 'serving table (draw leaf)',
    pivot: [0, TABLE_T + mm(6), 0],
    joint: 'slide',
    axis: [1, 0, 0],
    range: [0, TABLE_L],
    window: [0.48, 0.64],
    mass: 15,
    com: [TABLE_L / 2, 0, 0],
    hulls: [{ c: [TABLE_L / 2, mm(4), 0], s: [TABLE_L, TABLE_T + mm(6), TABLE_W - mm(60)], tag: 'draw leaf' }],
    mates: ['table-b'],
    note: 'nests under the second leaf and draws 700 aft on a pair of rails',
  })
  rig.attach(leaf3.id, drawLeaf(lib))
  rig.attach(leaf3.id, tableLamps(lib))

  // Two leg pairs, under the first joint and under the far end. With the tail
  // bracket that is supports at 0, 700 and 2100, so the longest span is 1400 —
  // which a 40 mm ply top on a 60 x 30 aluminium edge carries with people
  // leaning on it. They fold flat along the leaf they hang from, and 680 mm of
  // leg fits on a 700 mm leaf, which is the whole reason the leaves are 700.
  //
  // They hang OUTBOARD of the top, at 480 either side of a 900 table rather than
  // under it. Not for the knee room it happens to give: with the leaves stacked
  // face to face there is no gap between them, so a 46 mm leg folded onto a leaf
  // is a 46 mm leg inside the next one. Beside the stack it has somewhere to be.
  for (const [id, parent] of [
    ['table-leg-a', 'table-b'],
    ['table-leg-b', 'table-c'],
  ]) {
    for (const sz of [-1, 1]) {
      const leg = rig.add({
        id: `${id}${sz > 0 ? 'r' : 'l'}`,
        parent,
        label: 'table leg',
        pivot: [TABLE_L - mm(20), 0, sz * (TABLE_W / 2 + mm(30))],
        joint: 'hinge',
        axis: [0, 0, 1],
        // Authored pointing +Y in the leaf's frame, which is DOWN once the leaf
        // is over; a quarter turn lays it back along its own leaf.
        //
        // BOTH legs stow at their leaf's far end and BOTH lie back the same way
        // in their own frame — which points them in OPPOSITE directions in the
        // world, because the two leaves are folded 180 degrees onto each other.
        // Stow them at opposite ends instead and they point the same way, land
        // in the same place, and the audit reports 46 mm of leg inside leg.
        range: [Math.PI / 2, 0],
        window: [0.7, 0.84],
        mass: 2.4 + 1.1,
        com: [0, LEG_LEN / 2, 0],
        hulls: [{ c: [0, LEG_LEN / 2, 0], s: [mm(46), LEG_LEN, mm(46)], tag: 'leg' }],
        mates: [parent],
      })
      const gl = legGeometry(lib, LEG_LEN, { section: mm(46), foot: mm(0.1) })
      gl.rotation.x = Math.PI // legGeometry hangs along -Y; the leaf's down is +Y
      rig.attach(leg.id, gl)

      // The last 320 telescopes, because 680 is what fits on a 700 mm leaf and
      // 1000 is what it takes to reach the road from a 1040 mm counter.
      const foot = rig.add({
        id: `${leg.id}-foot`,
        parent: leg.id,
        label: 'adjustable foot',
        // NESTED, not hung off the end. The foot's origin sits 380 mm back up
        // the leg so that retracted it is inside the tube; author it at the tip
        // and the packed leg is 1000 long instead of 680, which is 320 mm of leg
        // sweeping through the deck on the way round.
        pivot: [0, LEG_LEN - mm(380), 0],
        joint: 'telescope',
        axis: [0, 1, 0],
        range: [0, LEG_DROP],
        window: [0.84, 0.94],
        mass: 1.2,
        com: [0, mm(180), 0],
        footprint: [0, mm(380), 0],
        hulls: [{ c: [0, mm(190), 0], s: [mm(36), mm(380), mm(36)], tag: 'foot' }],
        note: 'the leg is 680 and the drop is 1000 — the difference telescopes',
        mates: ['ground', leg.id, parent],
      })
      const gf = new THREE.Group()
      gf.add(slab([mm(36), mm(380), mm(36)], lib.aluDark, { anchor: [0, -1, 0] }))
      gf.add(slab([mm(140), mm(16), mm(140)], lib.aluDark, { pos: [0, mm(388), 0] }))
      gf.add(slab([mm(160), mm(14), mm(160)], lib.rubberFoot, { pos: [0, mm(400), 0] }))
      rig.attach(foot.id, gf)
    }
  }

  // The two short posts the whole table hinges off, standing at the tail.
  rig.attach('floor', tablePosts(lib))

  // --- prep shelf ----------------------------------------------------------

  const shelf = rig.add({
    id: 'back-shelf',
    parent: 'floor',
    label: 'prep shelf',
    pivot: [mm(400), FLOOR + STORE_H - mm(20), BACK.z1 + mm(30)],
    joint: 'hinge',
    axis: [1, 0, 0],
    rest: REST.DOWN_ALONG_X,
    range: [0, -Math.PI / 2],
    window: [0.86, 1],
    mass: 7,
    com: [mm(190), 0, 0],
    hulls: foldPanelHull(mm(380), mm(1000), mm(28), 'shelf'),
    mates: ['floor'],
  })
  rig.attach(shelf.id, foldPanel(lib, mm(380), mm(1000), mm(28), { face: lib.stainless }))

  return {
    bom: 'yatai',
    update(t, r) {
      const out = r.get('awning')?.q ?? 0
      canvas.scale.z = Math.max(0.02, out / AWNING_OUT)
    },
    massBudget: [
      ['subframe + sink counter (fabricated)', 32],
      ['IKK TKO18321 griddle + Iwatani plate', 41],
      ['water hardware: 2 tanks, hand basin, pump, tap', 7],
      ['water itself, 20 L supply + 20 L waste', 40],
      ['fridge + LiFePO4 and inverter', 27],
      ['LP gas: bottle, locker, regulator, hose', 28],
      ['stall frame: posts, header, cassette, arms', 29],
      ['serving table: 3 leaves, 4 legs, tail posts', 58],
      ['cook’s pass, noren, chochin, boards', 22],
      ['stabiliser jacks (4)', 18],
    ],
    notes: [
      'The cook stands on the tarmac, not on the deck. 1120 mm of packing headroom means anything you can stand under is taller than the cab roof — so the bed itself is the galley, and the equipment simply stands on it.',
      'Nothing is built up to a working height except the prep counter, because a drop-in gastronorm needs something to drop into. The griddle plate lands at 850 above the road on its own feet, the fridge top at 1070, the tank tops at 1160.',
      'The serving is off the BACK. A counter down the kerb side puts the queue where the cook is working; 1400 mm of table off the tail plus a 700 mm draw leaf puts it behind the truck, facing the kitchen, off the road.',
      'The third leaf DRAWS instead of folding. A leaf on a 700 mm arm sweeps a half circle to get in line, and the leaf folded onto it rides that circle straight across the first one — 171 mm into it, whichever way the pins are stepped. An extending dining table has solved this for four hundred years.',
      'No extract. An open-air stall with the sky over the griddle does not need the hood, the grease filter, the 150 mm duct and the 200 mm 有圧換気扇 that a closed kitchen car needs. That deletion, the galley carcass it made unnecessary and a valance that turned out to be fabric are 34 of the 58 kg the table costs.',
      'ONE BASIN, NOT THREE, and it is worth being exact about why. The 三槽シンク — two wash compartments plus a separate hand-wash — is a FIXED-PREMISES rule, and the 40 / 80 / 200 L supply tiers are the 自動車営業 (kitchen-car) tiers. A 露店 is neither. What a stall has to carry is a hand-wash basin with running water at the cook, and that is all; the bowls, the tongs and the plates go back dirty to a licensed 基地施設 and are washed there.',
      'That single correction is the cheapest 40 kg in the whole project. Two stainless wash bowls, two taps and half the water come off, and the tanks now run 20 L supply and 20 L waste instead of 40 and 40 — 40 kg of payload handed back, which is more than the serving table costs. The 基地施設 is not optional in exchange: no premises, no licence.',
      'The menu follows from it. A stall permit is a 直前加熱 permit — reheat and assemble, serve straight into disposable containers, no raw handling and no holding. Takoyaki, yakisoba, karaage, oden. Which is a yatai menu, so the restriction costs nothing at all.',
      'The gas bottle is outside the body in a vented locker off the rear crossmember, because the rule wants it upright, vented at low level, and 2 m from any flame — and on a 1940 mm deck with a griddle on it, 2 m does not exist.',
    ],
  }
}

/**
 * Warm LED down both long edges of the last leaf, run inside the aluminium edge
 * channel rather than stood on the top. Anything standing proud of a leaf is
 * something the next leaf folds onto, so the table lights itself from its own
 * rim.
 */
/** The draw leaf: a top on two rails, nesting under the leaf it slides out of. */
function drawLeaf(lib) {
  const g = new THREE.Group()
  g.add(slab([TABLE_L, TABLE_T, TABLE_W - mm(60)], lib.ply, { anchor: [-1, -1, 0], pos: [0, mm(6), 0] }))
  for (const sz of [-1, 1]) {
    g.add(extrusion([0, mm(30), sz * (TABLE_W / 2 - mm(90))], [TABLE_L, mm(30), sz * (TABLE_W / 2 - mm(90))], mm(40), lib.alu))
  }
  g.add(slab([mm(36), TABLE_T + mm(40), TABLE_W - mm(60)], lib.alu, { pos: [TABLE_L - mm(18), mm(6), 0] }))
  return g
}

function tablePosts(lib) {
  const g = new THREE.Group()
  for (const sz of [-1, 1]) {
    const z = TABLE_Z + sz * mm(380)
    g.add(slab([mm(90), TABLE_Y - FLOOR, mm(90)], lib.aluDark, { anchor: [0, -1, 0], pos: [TABLE_X, FLOOR, z] }))
    g.add(slab([mm(200), mm(16), mm(200)], lib.galv, { pos: [TABLE_X, FLOOR + mm(8), z] }))
    g.add(rod([TABLE_X, TABLE_Y - mm(40), z], [TABLE_X + mm(300), FLOOR + mm(20), z], mm(16), lib.steelRod))
  }
  g.add(extrusion([TABLE_X, TABLE_Y, TABLE_Z - mm(380)], [TABLE_X, TABLE_Y, TABLE_Z + mm(380)], mm(70), lib.alu))
  return g
}

function tableLamps(lib) {
  const g = new THREE.Group()
  for (const sz of [-1, 1]) {
    g.add(slab([TABLE_L - mm(80), mm(16), mm(22)], lib.ledWarm, { pos: [TABLE_L / 2, -mm(14), sz * (TABLE_W / 2 - mm(14))] }))
    const lamp = new THREE.PointLight(0xffb96b, 1.8, 2.4, 2)
    lamp.position.set(TABLE_L / 2, -mm(40), sz * (TABLE_W / 2 - mm(20)))
    g.add(lamp)
  }
  return g
}

// --- geometry ---------------------------------------------------------------

/**
 * The kitchen, which is the deck with things standing on it.
 *
 * Everything here is drawn at the size on the invoice — the griddle is
 * 595 x 358 because an IKK TKO18321 is, the tank wells are 405 x 505 because a
 * Suiko HLT-50 is 400 x 500, and the fridge cradle is 593 x 345 because that is
 * the Yamazen. That is what makes the packing check mean anything: with invented
 * boxes it is a drawing, not a check.
 *
 * ONE CARCASS, and only because a drop-in pan needs something to drop into. The
 * prep counter is 320 tall, which puts the top at 980 above the road and leaves
 * the 120 mm gastronorms hanging clear of the deck. The griddle
 * and the fridge and the tanks just stand there, and their working heights come
 * out at 850, 1070 and 1160 without anyone deciding them.
 */
function galley(lib) {
  const g = new THREE.Group()
  const kz = (KERB.z0 + KERB.z1) / 2
  const bz = (BACK.z0 + BACK.z1) / 2
  const TOP = FLOOR + SINK_H

  // --- the working line, along the kerb ------------------------------------
  // The prep counter: 1000 of stainless-topped ply for plating and portioning,
  // with the battery and the spare plate in the void underneath. THERE IS NO
  // WASHING-UP SINK ON THIS TRUCK, and that is the licence rather than a
  // shortcut — the 三槽シンク is a fixed-premises rule. A stall carries a
  // hand-wash with running water and nothing else; the bowls and the tongs go
  // back to the 基地施設 dirty.
  g.add(slab([mm(1000), SINK_H - mm(24), KERB.z1 - KERB.z0], lib.ply, { pos: [-mm(300), FLOOR + (SINK_H - mm(24)) / 2, kz] }))
  g.add(slab([mm(1030), mm(24), KERB.z1 - KERB.z0 + mm(24)], lib.stainless, { pos: [-mm(300), TOP - mm(12), kz] }))
  // Gastronorm wells sunk into the top instead: batter, cabbage, sauce, and a
  // pan of finished takoyaki under a lamp. Same carcass, no plumbing.
  for (let i = 0; i < 3; i++) {
    const bx = -mm(640) + i * mm(300)
    g.add(slab([mm(250), mm(24), mm(320)], lib.stainless, { pos: [bx, TOP - mm(12), kz] }))
    g.add(slab([mm(224), mm(120), mm(294)], lib.trim, { pos: [bx, TOP - mm(76), kz] }))
  }
  // 12 V battery and inverter, in the void under the counter where they are out
  // of the weather and low in the truck.
  g.add(slab([mm(330), mm(215), mm(175)], lib.trim, { pos: [-mm(740), FLOOR + mm(110), kz] }))

  // The griddle, standing on the deck. 190 mm tall, so the plate is at 850 above
  // the road — below the elbow, which is where you want a teppan.
  const gx = mm(557)
  g.add(slab([mm(595), mm(190), mm(358)], lib.trim, { anchor: [0, -1, 0], pos: [gx, FLOOR, kz] }))
  g.add(slab([mm(575), mm(24), mm(338)], lib.griddle, { pos: [gx, FLOOR + mm(190), kz] }))
  for (let i = 0; i < 3; i++) {
    const px = gx - mm(190) + i * mm(190)
    if (i === 0) {
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 6; c++) {
          const d = new THREE.Mesh(new THREE.SphereGeometry(mm(19), 8, 5, 0, Math.PI * 2, 0, Math.PI / 2), lib.trim)
          d.rotation.x = Math.PI
          d.position.set(px - mm(50) + r * mm(46), FLOOR + mm(203), kz - mm(130) + c * mm(52))
          g.add(d)
        }
      }
    } else {
      g.add(slab([mm(170), mm(8), mm(310)], lib.trim, { pos: [px, FLOOR + mm(206), kz] }))
    }
  }
  // Cutting board, on the counter at the griddle end.
  g.add(slab([mm(600), mm(20), mm(300)], lib.ply, { pos: [mm(120), TOP + mm(10), kz] }))

  // --- the stores, along the off side --------------------------------------
  // THE HAND BASIN, on its own stand with its own tap and its own foot pump.
  // It is the only plumbed fitting in the build and the only one a 露店
  // inspector actually looks for: running water, at the cook, in reach without
  // touching anything else.
  g.add(slab([mm(340), mm(240), mm(320)], lib.ply, { anchor: [0, -1, 0], pos: [-mm(630), FLOOR, bz] }))
  g.add(slab([mm(320), mm(30), mm(230)], lib.stainless, { pos: [-mm(630), FLOOR + mm(240), bz] }))
  g.add(rod([-mm(750), FLOOR + mm(240), bz], [-mm(750), FLOOR + mm(420), bz], mm(10), lib.chrome))

  // The fridge in its cradle, and the waste tank beside it.
  g.add(slab([mm(593), mm(410), mm(345)], lib.stainless, { anchor: [0, -1, 0], pos: [-mm(164), FLOOR, bz] }))
  g.add(slab([mm(623), mm(50), mm(375)], lib.ply, { anchor: [0, -1, 0], pos: [-mm(164), FLOOR, bz] }))

  for (const [tx, tz] of [[mm(333), bz], [mm(733), bz]]) {
    g.add(slab([mm(400), mm(500), mm(380)], lib.rubberFoot, { anchor: [0, -1, 0], pos: [tx, FLOOR, tz] }))
    g.add(slab([mm(430), mm(60), mm(410)], lib.ply, { anchor: [0, -1, 0], pos: [tx, FLOOR, tz] }))
    // Cam straps over the shoulder: a rotomoulded tank has no fixings at all.
    for (const sy of [mm(180), mm(400)]) {
      g.add(slab([mm(420), mm(26), mm(400)], lib.aluDark, { pos: [tx, FLOOR + sy, tz] }))
    }
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(mm(50), mm(50), mm(30), 12), lib.aluDark)
    cap.position.set(tx, FLOOR + mm(515), tz)
    g.add(cap)
  }

  // Back rail along the off side, which is what stops a tank walking off the
  // deck and what the menu board hangs from.
  g.add(extrusion([-mm(800), FLOOR + mm(900), BACK.z1 + mm(10)], [mm(900), FLOOR + mm(900), BACK.z1 + mm(10)], mm(44), lib.alu))
  for (const bx of [-mm(740), mm(840)]) {
    g.add(rod([bx, FLOOR, BACK.z1 + mm(10)], [bx, FLOOR + mm(900), BACK.z1 + mm(10)], mm(22), lib.alu))
  }

  // The gas locker, hung outboard of the tail. It is out here because the rule
  // wants the cylinder outdoors, upright and 2 m from the flame, and 2 m does
  // not exist on this deck.
  const locker = new THREE.Group()
  locker.position.set(X.bedRearOuter - mm(200), -mm(180), mm(300))
  locker.add(slab([mm(380), mm(680), mm(380)], lib.galv, { anchor: [0, 1, 0] }))
  for (let i = 0; i < 4; i++) {
    g.add(slab([mm(300), mm(14), mm(20)], lib.trim, { pos: [X.bedRearOuter - mm(200), -mm(800) + i * mm(30), mm(492)] }))
  }
  // Plinths the stall posts hinge off, 220 mm up so the folded frame rides
  // clear of the deck.
  for (const sx of [-1, 1]) {
    g.add(slab([mm(200), sx < 0 ? POST_YA : POST_YB, mm(200)], lib.aluDark, { anchor: [0, -1, 0], pos: [sx * POST_X, 0, POST_Z] }))
  }
  const bottle = new THREE.Mesh(new THREE.CylinderGeometry(mm(145), mm(145), mm(500), 16), lib.paintDark)
  bottle.position.set(0, -mm(330), 0) // relative to the locker, which is already placed
  locker.add(bottle)
  g.add(locker)

  // A warm lamp under the worktop's front lip, which is what a stall glows with.
  const lamp = new THREE.PointLight(0xffcf9a, 6, 3.4, 2)
  lamp.position.set(mm(300), FLOOR + SINK_H + mm(180), KERB.z0 - mm(120))
  g.add(lamp)
  return g
}

/** A stall post: 60 mm square tube with a foot plate and a header saddle. */
function stallPost(lib) {
  const g = new THREE.Group()
  g.add(slab([POST_LEN, mm(60), mm(60)], lib.alu, { anchor: [-1, 0, 0] }))
  g.add(slab([mm(30), mm(180), mm(180)], lib.aluDark, { pos: [mm(15), 0, 0] }))
  g.add(slab([mm(120), mm(96), mm(96)], lib.aluDark, { pos: [POST_LEN - mm(60), 0, 0] }))
  g.add(hingeZ(lib, mm(140), mm(15)))
  return g
}

/** The header beam, authored running back along -X from its pin on post A. */
function headerBeam(lib) {
  const g = new THREE.Group()
  g.add(slab([HEADER_LEN, mm(80), mm(90)], lib.alu, { anchor: [-1, 0, 0] }))
  g.add(slab([mm(120), mm(110), mm(120)], lib.aluDark, { pos: [HEADER_LEN - mm(60), 0, 0] }))
  g.add(slab([mm(120), mm(110), mm(120)], lib.aluDark, { pos: [mm(60), 0, 0] }))
  // The awning's roller cassette, sitting on top of the beam.
  const roller = new THREE.Mesh(new THREE.CylinderGeometry(mm(75), mm(75), AWNING_W, 14), lib.aluDark)
  roller.rotation.z = Math.PI / 2
  roller.position.set(HEADER_LEN / 2 + mm(75), mm(90), 0)
  g.add(roller)
  return g
}

/**
 * The awning: fabric drawn out of the cassette, plus its leading rail.
 *
 * Authored as a sheet running +Z from the roller, so the slide joint literally
 * pulls it out of the tube.
 */
/** The leading rail: the rigid bar the canvas is pulled out by. */
function awningRail(lib) {
  const g = new THREE.Group()
  g.add(extrusion([-AWNING_W / 2, -mm(30), 0], [AWNING_W / 2, -mm(30), 0], mm(90), lib.alu))
  for (const sx of [-1, 1]) {
    g.add(slab([mm(70), mm(120), mm(70)], lib.aluDark, { pos: [sx * (AWNING_W / 2 - mm(40)), -mm(30), 0] }))
  }
  return g
}

/**
 * The canvas, authored at FULL extension running -Z from the roller, and scaled
 * in Z by how far the rail has actually run out. That is the one thing in this
 * project that is not a rigid body, and it is handled outside the rig on
 * purpose — see the update() hook.
 */
function awningFabric(lib) {
  const g = new THREE.Group()
  const f = new THREE.Mesh(new THREE.PlaneGeometry(AWNING_W, AWNING_OUT, 8, 6), lib.canvasCream)
  const p = f.geometry.attributes.position
  for (let i = 0; i < p.count; i++) {
    // A little slack between the arms, and the fall toward the leading rail.
    const u = (p.getX(i) / AWNING_W) * 2
    const v = (p.getY(i) + AWNING_OUT / 2) / AWNING_OUT
    // Slack between the arms, plus the fall toward the leading rail: a stall
    // awning always sheds outward.
    p.setZ(i, -Math.cos(u * Math.PI) * mm(18) * v - v * mm(230))
  }
  f.geometry.computeVertexNormals()
  f.rotation.x = Math.PI / 2
  f.position.set(0, 0, -AWNING_OUT / 2)
  f.receiveShadow = true
  f.castShadow = true
  g.add(f)
  return g
}


/** Four chochin along the header — one paper 尺3, four vinyl 9号. */
function lanterns(lib) {
  const g = new THREE.Group()
  for (let i = 0; i < 5; i++) {
    const x = mm(220) + (i * (HEADER_LEN - mm(440))) / 4
    const big = i === 2
    const r = big ? mm(190) : mm(130)
    const h = big ? mm(430) : mm(330)
    const l = new THREE.Group()
    l.position.set(x, -mm(60), mm(30))
    l.add(rod([0, 0, 0], [0, -mm(90), 0], mm(5), lib.trim))
    const body = lathe(
      [[0, -h / 2], [r * 0.58, -h * 0.32], [r * 0.96, -h * 0.14], [r, 0], [r * 0.96, h * 0.14], [r * 0.58, h * 0.32], [0, h / 2]],
      lib.washi,
      { seg: 14 },
    )
    body.position.y = -mm(90) - h / 2
    l.add(body)
    const glow = new THREE.PointLight(0xffb257, big ? 4.2 : 2.6, 2.8, 2)
    glow.position.y = -mm(90) - h / 2
    l.add(glow)
    g.add(l)
  }
  return g
}

/** The customer counter: a hinoki top with a raised drink rail and three bowls. */
function counterTop(lib) {
  const g = new THREE.Group()
  g.add(foldPanel(lib, COUNTER_D, COUNTER_W, PANEL_T, { face: lib.hinoki }))
  g.add(hingeZ(lib, COUNTER_W))
  g.add(slab([mm(48), mm(54), COUNTER_W - mm(60)], lib.alu, { pos: [COUNTER_D - mm(28), mm(27), 0] }))
  for (let i = -1; i <= 1; i++) {
    const bowl = lathe([[0, 0], [mm(70), mm(20)], [mm(88), mm(58)], [mm(84), mm(64)], [mm(64), mm(26)], [0, mm(6)]], lib.vermilion, { seg: 16 })
    bowl.position.set(COUNTER_D * 0.42, PANEL_T / 2, i * mm(440))
    g.add(bowl)
  }
  return g
}

/** A strut, authored running along +X from its pin. */
function armStrut(lib, length) {
  const g = new THREE.Group()
  g.add(slab([length, mm(44), mm(44)], lib.alu, { anchor: [-1, 0, 0] }))
  g.add(slab([mm(26), mm(76), mm(76)], lib.aluDark, { pos: [mm(14), 0, 0] }))
  g.add(slab([mm(26), mm(64), mm(64)], lib.aluDark, { pos: [length - mm(14), 0, 0] }))
  return g
}

