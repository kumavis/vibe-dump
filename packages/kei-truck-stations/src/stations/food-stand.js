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
// THE FINDING THAT REDESIGNED THIS MODULE: the cook cannot stand on the deck.
//
// The deck is 660 mm up and the packing ceiling is 1120 mm above it, so anything
// tall enough to stand under is taller than the cab roof. The first version of
// this station had a 900 mm galley with a serving sill at 1560 and the cook
// working inside it, and that only works if the cook is 1.4 m tall. So the cook
// works from the TARMAC, which is also how a Fukuoka yatai has always worked,
// and the whole galley inverts: a low box on the deck with almost nothing
// underneath it and everything standing on top.
//
// The heights fall straight out of that:
//
//   WORKTOP 970 mm above the tarmac — 310 above the deck. Where the hands of
//   somebody standing on the ground are.
//   CUSTOMER COUNTER 1030 above the tarmac. Sixty millimetres above the worktop,
//   which is the step a yatai counter has always had: high enough that the
//   customer is not looking into the prep, low enough to lean on.
//   CANOPY 2500 above the tarmac, on a frame that folds up off the deck —
//   because a 970 mm box has nowhere to hang a roof from, and a roof at
//   970 mm is a table.
//
// The griddle is RECESSED 130 mm into the worktop to bring its plate to 970,
// which leaves 120 mm under the well. No drawer fits there, which is why the
// tanks and the fridge stand on the deck behind the worktop as a back wall
// rather than living under it.
//
// The deck plan closes at exactly 1410 mm across, with nothing spare:
//   300 counter leaf | 450 worktop and griddle | 520 tank and fridge bay | 140 rail
//
// AND THE GAS BOTTLE IS NOT ON THE DECK. Regulation wants it outdoors, upright,
// vented at low level because propane sinks, and 2 m from any flame. On a
// 1940 mm deck with a griddle on it there is no 2 m, so it hangs in a vented
// locker off the rear crossmember. That is the rule deciding the shape, not a
// styling choice.
//
// NOBODY STANDS ON THE FOLD-OUTS EITHER. A 2 m fold-out at the 4 kPa assembly
// live load is 1580 kg — four and a half times the whole payload — and it would
// tip the truck about its kerbside wheels. The truck holds the kitchen; the
// pavement holds the queue.
// ---------------------------------------------------------------------------

const FLOOR = mm(60) //        thin subframe: every millimetre is worktop height
const WORKTOP = FLOOR + mm(250) // 310 above the deck, 970 above the tarmac
const GALLEY = {
  x0: -mm(120), x1: mm(920), // 1040 long, stopping clear of the truck's torii guard
  z0: -mm(405), z1: mm(45), //  450 of worktop and griddle
}
const BAY = { z0: mm(45), z1: mm(565), h: mm(500) } // tanks and fridge, standing
const COUNTER_Y = mm(370) //   1030 above the tarmac — the customer's hands
const COUNTER_D = mm(430)
const COUNTER_W = mm(1500)
const COUNTER_X = mm(180)
const COUNTER_Z = -mm(680)
const PANEL_T = mm(34)

// The stall frame. Two posts lie flat along the deck and swing up at the ends of
// the counter; a header folds off one of them and swings across to the other,
// exactly the way the shrine's torii carries its own lintel. 1750 mm is the
// longest post that will lie on a 1940 mm deck once its hinge and its foot are
// accounted for.
const POST_X = mm(870)
const POST_Z = -mm(580)
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
// fits. A rigid 1.1 m awning has nowhere on this deck to lie flat — the worktop
// is 450 wide and has a griddle in it, the bay behind is 520 and is full of
// tanks. A roller tube 1700 long and 150 across stows on the header and takes no
// deck at all, which is exactly why real shop awnings are built that way.
const AWNING_OUT = mm(1300)
const AWNING_W = mm(1500)

export default {
  id: 'yatai',
  title: 'Yatai',
  tagline: 'the cook stands on the road, so the galley is a low box',
  build,
}

function build(ctx) {
  const { rig, lib } = ctx

  rig.setStages([
    'kerb side down, jacks in',
    'first stall post rises',
    'second post rises',
    'header swings across, counter drops',
    'awning rolls out over the kerb',
    'arms, valance, flue, prep shelf',
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
      {
        c: [(GALLEY.x0 + GALLEY.x1) / 2, (FLOOR + WORKTOP) / 2, (GALLEY.z0 + GALLEY.z1) / 2],
        s: [GALLEY.x1 - GALLEY.x0, WORKTOP - FLOOR, GALLEY.z1 - GALLEY.z0],
        tag: 'worktop',
      },
      {
        c: [(GALLEY.x0 + GALLEY.x1) / 2, FLOOR + BAY.h / 2, (BAY.z0 + BAY.z1) / 2],
        s: [GALLEY.x1 - GALLEY.x0, BAY.h, BAY.z1 - BAY.z0],
        tag: 'tank + fridge bay',
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
      mates: ['header', 'awning', 'valance', 'awning-arm-l', 'awning-arm-r'],
      note: 'the awning is a cantilever; the arm is what makes it a triangle',
    })
    rig.attach(arm.id, armStrut(lib, mm(1120)))
  }

  const valance = rig.add({
    id: 'valance',
    parent: 'awning',
    label: 'valance + noren rail',
    // Stowed lying back OVER the rolled cassette, not hanging under it: hanging,
    // it folds straight through the header beam it is bolted to.
    pivot: [0, mm(30), mm(40)],
    joint: 'hinge',
    axis: [1, 0, 0],
    range: [0, deg(96)],
    window: [0.86, 1],
    mass: 6,
    com: [0, -mm(170), 0],
    hulls: [{ c: [0, 0, mm(180)], s: [AWNING_W - mm(200), mm(40), mm(340)], tag: 'valance' }],
    mates: ['awning', 'awning-arm-l', 'awning-arm-r'],
  })
  rig.attach(valance.id, valancePanel(lib))

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

  // --- flue and prep shelf -------------------------------------------------
  const flue = rig.add({
    id: 'flue',
    parent: 'floor',
    label: 'extract flue',
    pivot: [mm(700), FLOOR + mm(80), mm(300)],
    joint: 'telescope',
    axis: [0, 1, 0],
    range: [0, mm(620)],
    window: [0.86, 1],
    mass: 16,
    com: [0, mm(210), 0],
    hulls: [{ c: [0, mm(210), 0], s: [mm(200), mm(420), mm(200)], tag: 'flue' }],
    mates: ['floor'],
    note: 'the flexible duct compresses to a quarter of its length, which is what lets it telescope',
  })
  rig.attach(flue.id, fluePipe(lib))

  const shelf = rig.add({
    id: 'back-shelf',
    parent: 'floor',
    label: 'prep shelf',
    pivot: [mm(400), FLOOR + BAY.h - mm(20), BAY.z1 + mm(30)],
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
      ['subframe + galley carcass (fabricated)', 44],
      ['IKK TKO18321 griddle + Iwatani plate', 41],
      ['water hardware: 2 tanks, 3 bowls, pump, taps', 9],
      ['water itself, 40 L supply + 40 L waste', 80],
      ['fridge + LiFePO4 and inverter', 27],
      ['LP gas: bottle, locker, regulator, hose', 28],
      ['extract: hood, duct, 200 mm fan', 16],
      ['stall frame: posts, header, cassette, arms', 35],
      ['counter, noren, chochin, boards', 25],
      ['stabiliser jacks (4)', 18],
    ],
    notes: [
      'The cook stands on the tarmac, not on the deck. 1120 mm of packing headroom means anything you can stand under is taller than the cab roof — so the galley is a low box and the worktop is 970 mm above the road.',
      'The customer counter sits 60 mm above the worktop. That step is what a yatai counter has always had: high enough that the customer is not looking into the prep, low enough to lean on.',
      'This is a 40 L water vehicle, and the payload decided that, not the menu. 40 L supply plus 40 L waste is 80 kg — 23% of the payload. The 80 L tier is 160 kg; the 200 L tier is 400 kg, which is more than the truck can carry empty.',
      'Three bowls, not two: two wash compartments and a SEPARATE hand-wash basin. The separate basin is the requirement most often missed.',
      'The gas bottle is outside the body in a vented locker off the rear crossmember, because the rule wants it upright, vented at low level, and 2 m from any flame — and on a 1940 mm deck with a griddle on it, 2 m does not exist.',
      'The awning is a roller cassette rather than a folding panel. Nothing else fits: the worktop is 450 mm wide with a griddle in it and the bay behind is full of tanks.',
    ],
  }
}

// --- geometry ---------------------------------------------------------------

/**
 * The galley: a low worktop with the griddle recessed into it, and behind it a
 * bay of tanks and a fridge standing on the deck as a back wall.
 *
 * Everything here is sized to the bill of materials — the griddle well is
 * 605 x 368 because an IKK TKO18321 is 595 x 358, the tank wells are 405 x 505
 * because a Suiko HLT-50 is 400 x 500, and the fridge cradle is 593 x 345
 * because that is the Yamazen. That is what makes the packing check mean
 * anything: with invented boxes it is a drawing, not a check.
 */
function galley(lib) {
  const g = new THREE.Group()
  const w = GALLEY.x1 - GALLEY.x0
  const cx = (GALLEY.x0 + GALLEY.x1) / 2
  const cz = (GALLEY.z0 + GALLEY.z1) / 2

  // Worktop carcass: 250 mm of ply box, and 120 mm of usable void under the
  // griddle well, which is why nothing lives under this counter.
  g.add(slab([w, WORKTOP - FLOOR - mm(24), GALLEY.z1 - GALLEY.z0], lib.ply, { pos: [cx, (FLOOR + WORKTOP) / 2 - mm(12), cz] }))
  g.add(slab([w + mm(30), mm(24), GALLEY.z1 - GALLEY.z0 + mm(30)], lib.stainless, { pos: [cx, WORKTOP - mm(12), cz] }))

  // The griddle, recessed 130 mm so its plate lands at working height. The well
  // is lined: bare ply against a cast-iron gas griddle is a fire.
  const gx = mm(180)
  g.add(slab([mm(605), mm(130), mm(368)], lib.trim, { pos: [gx, WORKTOP - mm(65), cz - mm(20)] }))
  g.add(slab([mm(595), mm(30), mm(358)], lib.griddle, { pos: [gx, WORKTOP - mm(14), cz - mm(20)] }))
  for (let i = 0; i < 3; i++) {
    // Eighteen-hole takoyaki plate on the left bay, iron sheet on the other two.
    const px = gx - mm(190) + i * mm(190)
    if (i === 0) {
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 6; c++) {
          const d = new THREE.Mesh(new THREE.SphereGeometry(mm(19), 8, 5, 0, Math.PI * 2, 0, Math.PI / 2), lib.trim)
          d.rotation.x = Math.PI
          d.position.set(px - mm(60) + r * mm(46), WORKTOP + mm(1), cz - mm(150) + c * mm(52))
          g.add(d)
        }
      }
    } else {
      g.add(slab([mm(170), mm(8), mm(330)], lib.trim, { pos: [px, WORKTOP + mm(4), cz - mm(20)] }))
    }
  }

  // Three bowls: two wash compartments and a separate hand-wash at the serving
  // end. The separate one is the requirement people miss.
  for (const [bx, bw, bd] of [[mm(700), mm(450), mm(390)], [mm(-40), mm(320), mm(230)]]) {
    g.add(slab([bw, mm(30), bd], lib.stainless, { pos: [bx, WORKTOP - mm(15), cz] }))
    g.add(slab([bw - mm(40), mm(150), bd - mm(40)], lib.trim, { pos: [bx, WORKTOP - mm(90), cz] }))
    g.add(rod([bx - bw / 2 + mm(60), WORKTOP, cz + bd / 2 - mm(40)], [bx - bw / 2 + mm(60), WORKTOP + mm(220), cz + bd / 2 - mm(40)], mm(11), lib.chrome))
  }

  // The bay behind: two 50 L tanks in ply wells, and the fridge in its cradle.
  const bcz = (BAY.z0 + BAY.z1) / 2
  g.add(slab([w, mm(30), BAY.z1 - BAY.z0], lib.ply, { pos: [cx, FLOOR + BAY.h, bcz] }))
  for (let i = 0; i < 2; i++) {
    const tx = -mm(20) + i * mm(430)
    g.add(slab([mm(400), mm(500), mm(380)], lib.rubberFoot, { anchor: [0, -1, 0], pos: [tx, FLOOR, bcz - mm(50)] }))
    g.add(slab([mm(430), mm(60), mm(410)], lib.ply, { anchor: [0, -1, 0], pos: [tx, FLOOR, bcz - mm(50)] }))
    // Cam straps over the shoulder: a rotomoulded tank has no fixings at all.
    for (const sy of [mm(180), mm(400)]) {
      g.add(slab([mm(420), mm(26), mm(400)], lib.aluDark, { pos: [tx, FLOOR + sy, bcz - mm(50)] }))
    }
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(mm(50), mm(50), mm(30), 12), lib.aluDark)
    cap.position.set(tx, FLOOR + mm(515), bcz - mm(50))
    g.add(cap)
  }
  g.add(slab([mm(593), mm(345), mm(410)], lib.stainless, { anchor: [0, -1, 0], pos: [mm(650), FLOOR, bcz] }))
  g.add(slab([mm(623), mm(50), mm(440)], lib.ply, { anchor: [0, -1, 0], pos: [mm(650), FLOOR, bcz] }))

  // Back rail, and a menu board on the crew side.
  g.add(extrusion([GALLEY.x0, FLOOR + mm(900), BAY.z1 + mm(60)], [GALLEY.x1, FLOOR + mm(900), BAY.z1 + mm(60)], mm(44), lib.alu))
  for (const bx of [GALLEY.x0 + mm(60), GALLEY.x1 - mm(60)]) {
    g.add(rod([bx, FLOOR + BAY.h, BAY.z1 + mm(60)], [bx, FLOOR + mm(900), BAY.z1 + mm(60)], mm(22), lib.alu))
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
  lamp.position.set(mm(300), WORKTOP + mm(180), GALLEY.z0 - mm(120))
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

/** Valance panel with the shop's name lit into it. */
function valancePanel(lib) {
  const g = new THREE.Group()
  const w = AWNING_W - mm(200)
  // Authored running +Z from the pin, so it stows lying back over the cassette
  // and the quarter turn drops it down the awning's leading edge.
  g.add(slab([w, mm(30), mm(340)], lib.canvasIndigo, { anchor: [0, 0, -1] }))
  g.add(extrusion([-w / 2, 0, mm(16)], [w / 2, 0, mm(16)], mm(38), lib.alu))
  g.add(slab([w - mm(160), mm(20), mm(150)], lib.ledWarm, { pos: [0, -mm(18), mm(190)] }))
  // A noren at each end, which is what frames the stall.
  for (const sx of [-1, 1]) {
    const n = cloth(mm(430), mm(620), mm(20), lib.noren, { nx: 6, ny: 5 })
    n.rotation.x = -Math.PI / 2
    n.position.set(sx * (w / 2 - mm(230)), mm(10), mm(650))
    g.add(n)
  }
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

/** The flue: hood, telescoping duct, fan housing and a rain cap. */
function fluePipe(lib) {
  const g = new THREE.Group()
  g.add(slab([mm(700), mm(160), mm(300)], lib.stainless, { anchor: [0, -1, 0], pos: [0, 0, 0] }))
  g.add(rod([0, mm(160), 0], [0, mm(560), 0], mm(85), lib.galv))
  g.add(slab([mm(300), mm(250), mm(300)], lib.galv, { pos: [0, mm(300), 0] }))
  g.add(rod([0, mm(560), 0], [0, mm(590), 0], mm(120), lib.galv))
  g.add(slab([mm(300), mm(20), mm(300)], lib.galv, { pos: [0, mm(615), 0] }))
  return g
}
