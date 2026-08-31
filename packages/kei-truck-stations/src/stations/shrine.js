import * as THREE from 'three'
import {
  mm, deg, slab, rod, extrusion, T, X,
  addGates, addJack, subframe, subframeHull, foldPanel, foldPanelHull, hingeX, hingeZ, REST,
} from './common.js'
import { lathe, cloth, shrineRoofPlane, roundedSlab } from '../build.js'

// ---------------------------------------------------------------------------
// HOKORA — a wayside shrine that folds flat
//
// The hard problem, and the one worth reading this file for: a Japanese shrine
// roof is a CURVED surface, and a folding structure is made of FLAT panels.
//
// The answer is the one Japanese carpenters have always used. A real hiwadabuki
// roof is not a curved sheet; it is straight boards laid over curved rafters,
// and the curve lives in the rafter line rather than in the material. So the
// roof here is a chain of three flat facets per slope, hinged along the ridge
// direction, and the sori is in the ANGLES rather than in any panel: 40, 28 and
// 16 degrees from horizontal, stepping down by twelve degrees at every joint.
// Concave off the ridge, flattening to the eave. That is the curve, discretised
// exactly the way the timber does it.
//
// And because every step is the same twelve degrees, every joint after the first
// travels the same 168 degrees from stowed to deployed, so the fan opens on one
// motion — from the inside out, which is how a roll has to unroll.
//
// Everything else follows from a small number of hard facts:
//
//   The torii is 1850 mm tall because that is how long a pillar can lie on a
//   1940 mm deck. Its pillars are 1240 apart because they have to lie OUTBOARD
//   of the shrine — which turns out fine, since 0.67 is inside the range real
//   torii use, and being wider than the shrine is the point of a gate.
//
//   The shrine walls are only 390 mm because two 390 mm walls folding inward
//   onto a 900 mm floor leave a 120 mm channel down the middle, and the ridge
//   posts need that channel. Wall height is set by the packing, not by taste —
//   and a hokora is a small thing anyway.
//
//   The pillars sweep an 1850 mm arc through the entire volume above the deck.
//   They get away with it only because they lie in the planes z = +/-620 and
//   the shrine lives inside z = +/-450. Lateral separation is what makes a
//   long sweep survivable; there is no amount of deploy-ordering that would
//   have saved it.
//
// This is the lightest of the four modules by a wide margin, and that is not an
// accident either: it is almost entirely thin panels and hollow posts. A shrine
// is mostly roof, and roof is mostly air.
// ---------------------------------------------------------------------------

const FLOOR = mm(90)
const DAIS = mm(150) // shrine floor above the cargo deck
const SHRINE = { x0: -mm(435), x1: mm(835), z: mm(430) } // 1270 x 860
const WALL_H = mm(378)
const WALL_T = mm(28)

const TORII = { x: -mm(930), z: mm(620), h: mm(1850), post: mm(120) }

// The posts sit clear of where the back wall lands when it folds down: the wall
// covers x in [445, 835], so a post at 650 is straight through it.
const POST_X = [-mm(250), mm(400)]
const POST_HOUSING = mm(480)
const POST_STAGE = mm(330)
const RIDGE_Y = DAIS + POST_HOUSING + POST_STAGE * 3 // 1620 above the deck

const FACET_T = mm(24)
const ROOF_LEN = mm(1500) // along the ridge, gable overhangs included

// THREE flat facets per slope whose angles step down by twelve degrees: the
// sori curve, discretised.
//
// THREE, not four, and all the same length — both of which the audit decided.
//
// A chain of panels folding the same way is a ROLL, and in a roll each wrap
// reaches back over the one before it. With four facets, the fourth folded back
// lands on the SECOND, which is not a parent, not a child, and not a contact the
// design wants. Three facets is one wrap fewer and the reach never gets that
// far. Equal lengths matter for the same reason: make each facet longer than
// the one it folds onto and the extra length is exactly how far it overshoots
// into its grandparent.
//
// Three segments is still a curve. A shrine roof is boards over rafters, and
// the eye reads the rafter line, not the board count.
const FACET_LEN = [mm(300), mm(300), mm(300)]
const FACET_ANGLE = [deg(40), deg(28), deg(16)]
const FACET_GAP = FACET_T + mm(14)

const CHOCHIN_H = mm(420) // 尺丸, and 40 mm of it when collapsed for the road
const OFFER_X = -mm(260) //  the offering platform, on the dais inside the open face

export default {
  id: 'hokora',
  title: 'Hokora',
  tagline: 'a curved shrine roof, built from flat panels that fold',
  build,
}

function build(ctx) {
  const { rig, lib } = ctx

  rig.setStages([
    'tailgate down, jacks in',
    'torii pillars rise',
    'kasagi and nuki swing across',
    'nuki across, shrine walls up',
    'ridge posts telescope',
    'the roof unrolls',
  ])

  const base = rig.add({
    id: 'floor',
    parent: null,
    label: 'subframe + dais',
    joint: 'fixed',
    static: true,
    mass: 40 + 22,
    com: [mm(200), FLOOR, 0],
    hulls: [
      ...subframeHull(FLOOR),
      { c: [mm(200), DAIS - mm(30), 0], s: [SHRINE.x1 - SHRINE.x0, mm(60), SHRINE.z * 2], tag: 'dais' },
      // The offering platform and everything standing on it. In the hull set
      // because it is 300 mm tall and sits under the arc of two 1850 mm pillars.
      { c: [OFFER_X, DAIS + mm(200), 0], s: [mm(320), mm(400), mm(780)], tag: 'offerings' },
    ],
  })
  rig.attach(base.id, subframe(lib, { height: FLOOR, skin: lib.hinoki }))
  rig.attach(base.id, dais(lib))

  addGates(rig, ctx, { left: 'hang', right: 'hang', tail: 'flat', stage: 0 })
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      addJack(rig, lib, { id: `jack-${sx > 0 ? 'f' : 'r'}${sz > 0 ? 'r' : 'l'}`, at: [sx * mm(880), -mm(70), sz * mm(660)], stage: 0 })
    }
  }

  // --- the torii -----------------------------------------------------------
  for (const [n, sz] of [['l', -1], ['r', 1]]) {
    const pillar = rig.add({
      id: `pillar-${n}`,
      parent: 'floor',
      label: 'torii pillar',
      pivot: [TORII.x, FLOOR + mm(170), sz * TORII.z],
      joint: 'hinge',
      axis: [0, 0, 1],
      range: [0, Math.PI / 2],
      stage: 1,
      mass: 15,
      com: [TORII.h / 2, 0, 0],
      hulls: [{ c: [TORII.h / 2, 0, 0], s: [TORII.h, TORII.post, TORII.post], tag: 'pillar' }],
      mates: ['floor', 'ground'],
      note: 'sweeps 1850 mm; survivable only because it lies outboard of the shrine',
    })
    rig.attach(pillar.id, toriiPillar(lib))
  }

  // Kasagi and nuki fold against the pillars and swing across once they are up.
  // Carrying the beams on the pillars rather than loose on the deck is what
  // makes the whole gate one assembly: nothing has to be lifted into place.
  const kasagi = rig.add({
    id: 'kasagi',
    parent: 'pillar-r',
    label: 'kasagi (top lintel)',
    // Folded back ALONG its pillar, and swung across once the pillar is up. The
    // axis is the pillar's local Y: rotating about the pillar's own long axis
    // would only twist the beam, and rotating about local Z would swing it in
    // the wrong plane entirely.
    pivot: [TORII.h - mm(110), mm(80), -mm(75)],
    joint: 'hinge',
    axis: [0, 1, 0],
    range: [0, -Math.PI / 2],
    stage: 2,
    mass: 11,
    com: [-mm(620), 0, 0],
    hulls: [{ c: [-mm(620), 0, 0], s: [mm(1400), mm(150), mm(190)], tag: 'kasagi' }],
    mates: ['pillar-r', 'pillar-l'],
  })
  rig.attach(kasagi.id, kasagiBeam(lib))

  const nuki = rig.add({
    id: 'nuki',
    parent: 'pillar-r',
    label: 'nuki (tie beam)',
    // BOTH beams hinge off the same pillar, 630 mm apart up its length, and
    // swing the same way. Hang one off each pillar and their arcs cross at
    // 45 degrees — two beams sweeping the same gap from opposite ends is the
    // one interference in this design that no offset fixes, only a shared
    // pivot does.
    pivot: [TORII.h * 0.64, -mm(80), -mm(75)],
    joint: 'hinge',
    axis: [0, 1, 0],
    range: [0, -Math.PI / 2],
    window: [0.42, 0.60],
    // A stage after the kasagi, not alongside it. Both beams swing across the
    // same gap from opposite pillars, and their arcs cross at 45 degrees — the
    // one place in this design where deploy ORDER, not geometry, is the fix.
    stage: 3,
    mass: 7,
    com: [-mm(570), 0, 0],
    hulls: [{ c: [-mm(570), 0, 0], s: [mm(1240), mm(110), mm(130)], tag: 'nuki' }],
    mates: ['pillar-r', 'pillar-l'],
  })
  rig.attach(nuki.id, nukiBeam(lib))

  // --- the shrine body -----------------------------------------------------
  // Back wall folds first and lies underneath; the two side walls fold on top
  // of it. Their pins are a panel thickness higher for exactly that reason.
  const back = rig.add({
    id: 'wall-back',
    parent: 'floor',
    label: 'back wall',
    pivot: [SHRINE.x1, DAIS, 0],
    joint: 'hinge',
    axis: [0, 0, 1],
    rest: REST.FLAT_AFT,
    range: [0, -Math.PI / 2],
    stage: 3,
    mass: 8,
    com: [WALL_H / 2, 0, 0],
    hulls: foldPanelHull(WALL_H, SHRINE.z * 2 - mm(20), WALL_T, 'wall', -1),
    mates: ['floor'],
  })
  rig.attach(back.id, foldPanel(lib, WALL_H, SHRINE.z * 2 - mm(20), WALL_T, { face: lib.vermilion, anchorY: -1 }))

  for (const [n, sz] of [['l', -1], ['r', 1]]) {
    const wall = rig.add({
      id: `wall-${n}`,
      parent: 'floor',
      label: 'side wall',
      pivot: [mm(200), DAIS + WALL_T + mm(6), sz * SHRINE.z],
      joint: 'hinge',
      axis: [1, 0, 0],
      rest: REST.UP_ALONG_X,
      // Stowed LYING FLAT (t = 0) and erect at the end, so the travel runs the
      // other way from the panels that stow upright.
      range: [-sz * Math.PI / 2, 0],
      stage: 3,
      mass: 11,
      com: [WALL_H / 2, 0, 0],
      hulls: foldPanelHull(WALL_H, SHRINE.x1 - SHRINE.x0 - mm(30), WALL_T, 'wall', -1),
      mates: ['floor', 'wall-back'],
      note: '390 mm tall because two of them have to fold onto a 900 mm floor and leave the posts a channel',
    })
    rig.attach(wall.id, foldPanel(lib, WALL_H, SHRINE.x1 - SHRINE.x0 - mm(30), WALL_T, { face: lib.vermilion, anchorY: -1 }))
  }

  // --- ridge posts ---------------------------------------------------------
  // One rigid assembly per stage, carrying both posts and (at the top) the
  // ridge beam. 150 mm of engagement stays inside the stage below at full
  // height — 1.9 times the 80 mm section.
  rig.attach('floor', postHousings(lib))
  let parent = 'floor'
  let pivot = [0, DAIS + mm(20), 0]
  for (let k = 1; k <= 3; k++) {
    const id = `post-${k}`
    rig.add({
      id,
      parent,
      label: `ridge post (stage ${k})`,
      pivot,
      joint: 'telescope',
      axis: [0, 1, 0],
      range: [0, POST_STAGE],
      stage: 4,
      mass: k === 3 ? 12 : 6,
      com: [mm(200), POST_HOUSING / 2, 0],
      hulls: POST_X.map((x) => ({ c: [x, POST_HOUSING / 2, 0], s: [mm(88), POST_HOUSING, mm(88)], tag: `post ${k}` })),
      mates: ['floor', 'post-1', 'post-2', 'post-3'],
    })
    rig.attach(id, postStage(lib, k))
    parent = id
    pivot = [0, 0, 0]
  }
  rig.attach('post-3', ridgeBeam(lib))

  // --- the roof ------------------------------------------------------------
  // Three facets a side, each folded back 180 degrees onto the one before it.
  // The pins alternate faces down the chain, which is what stacks them cleanly;
  // see foldPanel() for why that alternation is not optional.
  for (const [n, sz] of [['l', -1], ['r', 1]]) {
    let facetParent = 'post-3'
    // The two slopes start 120 mm either side of the centreline rather than on
    // it, and the reason is the packing: the hinge offsets step outward down the
    // chain, so a folded stack sits proud of its own ridge line by the sum of
    // them. Starting the slopes apart leaves that stack somewhere to go, and the
    // gap between them is the ridge beam, which a shrine roof has anyway.
    let facetPivot = [0, POST_HOUSING + mm(40), sz * mm(120)]
    for (let k = 0; k < FACET_LEN.length; k++) {
      const id = `roof-${n}${k + 1}`
      const first = k === 0
      const anchorY = k % 2 === 0 ? -1 : 1
      rig.add({
        id,
        parent: facetParent,
        label: `roof facet ${k + 1}`,
        pivot: facetPivot,
        joint: 'hinge',
        // Facet 1 folds about the world X axis, which is the ridge. Every facet
        // after it folds about its PARENT's local Z — because the rest applied
        // to facet 1 turned the chain's local X into the slope direction, and
        // hinging a roof panel about its own slope is a twist, not a fold.
        axis: first ? [1, 0, 0] : [0, 0, 1],
        rest: first ? [[0, 1, 0], sz > 0 ? -Math.PI / 2 : Math.PI / 2] : null,
        // The first facet drops from flat by 40 degrees, in whichever sense
        // takes it down-and-outboard on its own side. Every joint after it
        // unrolls from folded-back and stops twelve degrees SHALLOWER than its
        // parent — and shallower is the same sign on both slopes, because each
        // one is already measured in its own parent's frame.
        range: first ? [0, sz * FACET_ANGLE[0]] : [Math.PI, deg(12)],
        stage: 5,
        // Explicit, staggered windows rather than one shared stage. A roll fold
        // whose joints all open together has its outer panels sweeping
        // back across its inner ones; a roll unrolls from the inside out, one
        // joint at a time, and this is what saying so looks like.
        window: [0.58 + k * 0.135, 0.72 + k * 0.135],
        mass: 9,
        com: [FACET_LEN[k] / 2, 0, 0],
        hulls: foldPanelHull(FACET_LEN[k], ROOF_LEN, FACET_T, `facet ${k + 1}`, anchorY),
        mates: [facetParent],
        note: `${Math.round((FACET_ANGLE[k] * 180) / Math.PI)}° below horizontal`,
      })
      rig.attach(id, roofFacet(lib, k, sz, anchorY))
      facetParent = id
      // The hinge gap GROWS down the chain. A stack of panels folding onto each
      // other needs its pins stepped clear of the accumulated thickness, not set
      // at a constant offset — with a constant one, panel k+2 rides only two
      // sheets above panel k and clips it as the joints swing through. Stepping
      // the offsets costs 80 mm of packed height and buys the clearance the
      // sweep needs.
      const gap = FACET_GAP * (k + 1)
      facetPivot = [FACET_LEN[k], anchorY < 0 ? gap : -gap, 0]
    }
  }

  // --- what makes it a shrine ----------------------------------------------
  //
  // THE FITTINGS WERE HUNG IN MID-AIR, AND MID-AIR MOVES. Everything on a shrine
  // hangs: the bell on its rope, the lanterns on their bails, the shide off the
  // shimenawa. That is fine at 1620 mm of ridge and absurd at 170, which is
  // where the ridge sits with the posts nested — the bell was ending up 530 mm
  // BELOW the cargo deck, swinging through the chassis, and the lanterns a
  // further 400 below that.
  //
  // The fix is the one the objects themselves suggest. A chochin is not rigid:
  // it collapses to about 40 mm between its two rings, which is exactly how it
  // travels. A 鈴緒 coils. So both are soft goods driven off the post extension —
  // the lanterns concertina open and the rope pays out as the ridge rises, and
  // packed they are a pair of discs and a coil tucked under the ridge beam at
  // 530 above the deck. The bell is the one rigid piece and it simply hangs on a
  // short strap, 210 below the beam instead of 700.
  //
  // The offering set moved too. It was bolted to the tail gate, which spends the
  // entire journey VERTICAL — so a 250 mm offertory box, a pair of lanterns and
  // two open ceramic vases travelled sticking straight out the back of the truck
  // at right angles. They now stand on a low platform on the deck in front of
  // the shrine, where the tail gate drops to let you reach them.
  rig.attach('kasagi', shimenawa(lib))
  rig.attach('floor', offerings(lib))
  const face = shrineFace(lib)
  rig.attach('post-3', face)

  return {
    /**
     * Soft goods: the paper and the rope, which the joint tree cannot express.
     * Both are driven by how far the ridge posts have gone up, not by the global
     * progress, so they stay right if the stage windows are ever retimed.
     */
    update(_t, r) {
      const q = r.parts.get('post-3')?.q ?? 0
      const u = Math.min(1, Math.max(0, q / POST_STAGE))
      const collapsed = mm(40) / CHOCHIN_H
      for (const c of face.userData.chochin) c.scale.y = collapsed + (1 - collapsed) * u
      face.userData.rope.scale.y = 0.02 + 0.98 * u
    },
    massBudget: [
      ['subframe + dais', 62],
      ['torii: pillars, kasagi, nuki', 48],
      ['shrine walls (3)', 30],
      ['ridge posts + beam', 24],
      ['roof: 6 folding facets', 54],
      ['fittings: bell, chochin, offerings, power', 16],
      ['stabiliser jacks (4)', 18],
    ],
    notes: [
      'The roof curve is in the ANGLES, not the panels: three flat facets a side at 40°, 28° and 16°, stepping down twelve degrees at every joint. That is how a real roof does it too — straight boards over curved rafters.',
      'Three facets, not four, and all the same length. A chain folding the same way is a roll, and in a roll each wrap reaches back over the one before it: with four, the fourth lands on the second. The audit found that, and the fix was one wrap fewer.',
      'The torii is 1850 mm tall because that is the longest pillar that will lie on a 1940 mm deck, and 1240 mm wide because the pillars have to stow outboard of the shrine. Both numbers are the truck, not the drawing.',
      'The pillars sweep an 1850 mm arc across the entire deck. Nothing but lateral separation saves that — they lie in the planes z = ±620 and the shrine stays inside ±450.',
      'The lightest of the four by a long way. A shrine is mostly roof, and roof is mostly air.',
    ],
  }
}

// --- geometry ---------------------------------------------------------------

function dais(lib) {
  const g = new THREE.Group()
  const L = SHRINE.x1 - SHRINE.x0
  g.add(slab([L, mm(60), SHRINE.z * 2], lib.hinoki, { pos: [mm(200), DAIS - mm(30), 0] }))
  // A moulded edge, and the step up onto it at the front.
  g.add(slab([L + mm(50), mm(22), SHRINE.z * 2 + mm(50)], lib.hinoki, { pos: [mm(200), DAIS - mm(56), 0] }))
  g.add(slab([mm(220), mm(46), SHRINE.z * 2 - mm(200)], lib.hinoki, { pos: [SHRINE.x0 - mm(120), FLOOR + mm(23), 0] }))
  // Base stones for the torii pillars: the pillars hinge 150 mm above the
  // module floor, and something has to be under them.
  for (const sz of [-1, 1]) {
    g.add(slab([mm(300), mm(170), mm(300)], lib.aluDark, { anchor: [0, -1, 0], pos: [TORII.x, FLOOR, sz * TORII.z] }))
  }
  return g
}

function toriiPillar(lib) {
  const g = new THREE.Group()
  // Slight entasis: a real torii pillar tapers, and the taper is most of what
  // stops it reading as a length of box section.
  const p = lathe(
    [[mm(72), 0], [mm(70), TORII.h * 0.35], [mm(64), TORII.h * 0.72], [mm(58), TORII.h - mm(60)], [mm(52), TORII.h]],
    lib.vermilion,
    { seg: 14 },
  )
  p.rotation.z = -Math.PI / 2 // authored up +Y; the part lies along +X
  g.add(p)
  g.add(slab([mm(60), mm(190), mm(190)], lib.vermilionDeep, { pos: [mm(30), 0, 0] }))
  return g
}

/** Kasagi: the top lintel, with its shimaki underbeam and upturned ends. */
function kasagiBeam(lib) {
  const g = new THREE.Group()
  const L = mm(1400)
  const beam = new THREE.Group()
  beam.position.x = -L / 2 // authored along -X, folded back along its pillar
  beam.add(slab([L, mm(96), mm(190)], lib.vermilion, { pos: [0, mm(40), 0] }))
  beam.add(slab([L - mm(90), mm(70), mm(150)], lib.vermilionDeep, { pos: [0, -mm(26), 0] }))
  // The ends rise: a myojin torii's kasagi is never a straight stick.
  for (const s of [-1, 1]) {
    beam.add(slab([mm(220), mm(84), mm(180)], lib.vermilion, { pos: [s * (L / 2 - mm(80)), mm(66), 0], rot: [0, 0, -s * deg(9)] }))
  }
  g.add(beam)
  return g
}

function nukiBeam(lib) {
  const g = new THREE.Group()
  const L = mm(1240)
  g.add(slab([L, mm(96), mm(130)], lib.vermilionDeep, { pos: [-L / 2, 0, 0] }))
  g.add(slab([mm(120), mm(150), mm(150)], lib.vermilion, { pos: [-L, 0, 0] }))
  return g
}

function postHousings(lib) {
  const g = new THREE.Group()
  for (const x of POST_X) {
    g.add(slab([mm(110), POST_HOUSING, mm(110)], lib.hinoki, { anchor: [0, -1, 0], pos: [x, DAIS, 0] }))
    g.add(slab([mm(150), mm(30), mm(150)], lib.copperTrim, { pos: [x, DAIS + POST_HOUSING, 0] }))
  }
  return g
}

function postStage(lib, k) {
  const g = new THREE.Group()
  const s = mm(92) - k * mm(6)
  for (const x of POST_X) {
    g.add(slab([s, POST_HOUSING, s], lib.hinoki, { anchor: [0, -1, 0], pos: [x, 0, 0] }))
    g.add(slab([s + mm(14), mm(22), s + mm(14)], lib.copperTrim, { pos: [x, mm(11), 0] }))
  }
  return g
}

/** The ridge beam, plus the gable-end bargeboards the facets hang off. */
function ridgeBeam(lib) {
  const g = new THREE.Group()
  g.add(slab([mm(1050), mm(90), mm(150)], lib.hinoki, { pos: [mm(75), POST_HOUSING + mm(20), 0] }))
  // Katsuogi: the short billets that lie across a shrine ridge.
  for (let i = -1; i <= 1; i++) {
    const k = lathe([[mm(46), 0], [mm(54), mm(90)], [mm(46), mm(180)]], lib.copperTrim, { seg: 10 })
    k.rotation.x = Math.PI / 2
    k.position.set(mm(75) + i * mm(380), POST_HOUSING + mm(90), -mm(90))
    g.add(k)
  }
  // Chigi: the crossed finials at each gable.
  for (const s of [-1, 1]) {
    for (const t of [-1, 1]) {
      g.add(rod(
        [mm(75) + s * mm(560), POST_HOUSING + mm(10), 0],
        [mm(75) + s * mm(700), POST_HOUSING + mm(420), t * mm(150)],
        mm(26), lib.gold,
      ))
    }
  }
  return g
}

/**
 * One roof facet: boards running down the slope, a copper batten at the eave
 * edge, and — on the outermost facet — the deep fascia that reads as an eave.
 */
function roofFacet(lib, k, sz, anchorY) {
  const g = new THREE.Group()
  const L = FACET_LEN[k]
  const last = k === FACET_LEN.length - 1
  g.add(foldPanel(lib, L, ROOF_LEN, FACET_T, { face: lib.copperRoof, frame: false, anchorY }))
  // Board lines running down the slope, which is how the real roof is laid.
  for (let i = -6; i <= 6; i++) {
    g.add(slab([L, FACET_T + mm(5), mm(16)], lib.copperTrim, { anchor: [-1, anchorY, 0], pos: [0, 0, i * mm(112)] }))
  }
  g.add(slab([mm(26), FACET_T + mm(16), ROOF_LEN], lib.copperTrim, { anchor: [-1, anchorY, 0], pos: [L - mm(26), 0, 0] }))
  if (last) {
    // The eave fascia, and a row of rafter ends under it.
    g.add(slab([mm(40), mm(120), ROOF_LEN], lib.vermilionDeep, { pos: [L, -anchorY * mm(40), 0] }))
    for (let i = -6; i <= 6; i++) {
      g.add(slab([mm(180), mm(46), mm(46)], lib.hinoki, { pos: [L - mm(90), -anchorY * mm(46), i * mm(112)] }))
    }
  }
  g.add(hingeZ(lib, ROOF_LEN, mm(13)))
  return g
}

/** Shimenawa across the torii, with its shide. */
function shimenawa(lib) {
  const g = new THREE.Group()
  // 大根注連, 1200 long and 110 through the middle — the sizes it is sold at.
  const L = mm(1200)
  const r = cloth(L, mm(110), mm(90), lib.rope, { nx: 14, ny: 2, wave: 0.004 })
  r.position.set(-mm(700), -mm(170), 0)
  g.add(r)
  for (let i = 0; i < 5; i++) {
    const x = -mm(700) - L / 2 + mm(120) + (i * (L - mm(240))) / 4
    const s = cloth(mm(90), mm(230), mm(6), lib.washi, { nx: 3, ny: 4, wave: 0.008 })
    s.position.set(x, -mm(310), 0)
    g.add(s)
  }
  return g
}

/**
 * The offering set, standing on a low platform on the dais just inside the
 * shrine's open face: saisenbako, a pair of battery lanterns, the sakaki vases
 * and a sanbo.
 *
 * Everything here is drawn at the size it is actually sold at. A 賽銭箱 一尺 is
 * 303 wide, 220 deep and 250 tall, which is deliberately modest — anything
 * larger reads as a collection tin rather than shrine carpentry. The 神前灯籠 is
 * the 250 mm battery pattern, not a stone lantern: a stone one is three figures
 * of kilograms and this truck has 350.
 *
 * IT USED TO BE BOLTED TO THE TAIL GATE, which spends the whole journey
 * vertical — so the box, the lanterns and two open ceramic vases travelled
 * projecting straight out the back of the truck at right angles to the road.
 *
 * On the dais they travel the way they sit, and the tail gate drops to let you
 * reach them. The dais rather than the deck in front of it, because the nuki
 * sweeps a 1240 mm arc down the outside of its pillar on its way across, and
 * that arc passes 208 mm above the deck right through the strip between the
 * shrine's face and the tail. Six hundred millimetres of open deck, and a beam
 * uses all of it.
 *
 * None of it is fastened through its own faces, because none of it has a fixing
 * point. The box drops into a felt-lined well and takes two M6 up through the
 * platform into its internal cleats; the vases sit in counterbored wells and
 * lift out entirely for transit, because a water-filled vase on a moving truck
 * is a spill onto a cashew-lacquered pillar.
 */
function offerings(lib) {
  const g = new THREE.Group()
  g.position.set(OFFER_X, DAIS, 0)

  // The platform, and the felt-lined well the box drops into.
  g.add(slab([mm(320), mm(60), mm(780)], lib.hinoki, { anchor: [0, -1, 0] }))
  g.add(slab([mm(350), mm(16), mm(810)], lib.hinoki, { pos: [0, mm(52), 0] }))

  const box = new THREE.Group()
  box.position.set(-mm(40), mm(60), 0)
  box.add(slab([mm(220), mm(250), mm(303)], lib.hinoki, { anchor: [0, -1, 0] }))
  for (let i = -3; i <= 3; i++) {
    box.add(slab([mm(20), mm(22), mm(260)], lib.trim, { pos: [i * mm(28), mm(258), 0] }))
  }
  box.add(slab([mm(240), mm(18), mm(325)], lib.hinoki, { pos: [0, mm(242), 0] }))
  g.add(box)

  // 神前灯籠, 250 mm: turned base, sill, washi box, roof.
  for (const sz of [-1, 1]) {
    const t = new THREE.Group()
    t.position.set(mm(30), mm(60), sz * mm(330))
    t.add(lathe([[mm(58), 0], [mm(46), mm(40)], [mm(34), mm(120)]], lib.hinoki, { seg: 10 }))
    t.add(slab([mm(130), mm(16), mm(130)], lib.hinoki, { pos: [0, mm(128), 0] }))
    t.add(slab([mm(104), mm(96), mm(104)], lib.washi, { pos: [0, mm(184), 0] }))
    const glow = new THREE.PointLight(0xffb257, 1.6, 1.8, 2)
    glow.position.y = mm(184)
    t.add(glow)
    const roof = lathe([[mm(96), 0], [mm(74), mm(40)], [0, mm(66)]], lib.hinoki, { seg: 10 })
    roof.position.y = mm(232)
    t.add(roof)
    g.add(t)
  }

  // 榊立 三寸 — 55 across, 95 tall, a pair, in counterbored wells.
  for (const sz of [-1, 1]) {
    const v = lathe([[mm(22), 0], [mm(27), mm(20)], [mm(20), mm(70)], [mm(24), mm(95)], [mm(19), mm(95)]], lib.washi, { seg: 12 })
    v.position.set(mm(120), mm(60), sz * mm(170))
    g.add(v)
  }
  // 三宝 六寸 — a 182 mm 折敷 on its cut-out box.
  const sanbo = new THREE.Group()
  sanbo.position.set(mm(120), mm(60), 0)
  sanbo.add(slab([mm(150), mm(70), mm(150)], lib.hinoki, { anchor: [0, -1, 0] }))
  sanbo.add(slab([mm(182), mm(16), mm(182)], lib.hinoki, { pos: [0, mm(78), 0] }))
  g.add(sanbo)
  return g
}

/**
 * A chochin: 尺丸, 300 across and 420 tall, drawn as the paper barrel between its
 * two bamboo rings with the steel bail that is its ONE mount point.
 *
 * Authored HANGING — the group's origin is the hook, the bail runs down from it,
 * and the paper hangs below that in its own group so the fold can concertina it.
 * A chochin collapses to about 40 mm between the rings and that is exactly how
 * it travels; modelling it as a rigid 420 mm object is what put a pair of
 * lanterns 400 mm through the cargo deck with the ridge posts nested.
 *
 * The body cannot be pierced, clamped or taped — a screw into the 輪 splits it —
 * so the lantern hangs from the bail and nothing else.
 */
function chochin(lib) {
  const g = new THREE.Group()
  const R = mm(150)
  const H = CHOCHIN_H
  // The bail: a wire loop from the hook down to the top ring.
  g.add(rod([0, 0, 0], [-mm(50), -mm(56), 0], mm(4), lib.steelRod))
  g.add(rod([0, 0, 0], [mm(50), -mm(56), 0], mm(4), lib.steelRod))

  const body = new THREE.Group()
  body.position.y = -mm(70)
  body.add(
    lathe(
      [
        [mm(52), 0],
        [R * 0.86, -H * 0.14],
        [R, -H * 0.46],
        [R * 0.9, -H * 0.78],
        [mm(58), -H],
      ],
      lib.washi,
      { seg: 16, open: true },
    ),
  )
  for (const y of [0, -H]) {
    body.add(lathe([[mm(52), y], [mm(60), y], [mm(60), y - mm(14)], [mm(52), y - mm(14)]], lib.hinoki, { seg: 16 }))
  }
  // Ribs, drawn as a few rings so the paper reads as a chochin and not a drum.
  for (let i = 1; i < 9; i++) {
    const t = i / 9
    const r = mm(52) + (R - mm(52)) * Math.sin(Math.PI * t)
    body.add(lathe([[r + mm(2), -H * t], [r + mm(9), -H * t - mm(7)], [r + mm(2), -H * t - mm(14)]], lib.hinoki, { seg: 16 }))
  }
  const glow = new THREE.PointLight(0xffc07a, 2.2, 2.4, 2)
  glow.position.y = -H * 0.4
  body.add(glow)
  g.add(body)
  g.userData.body = body
  return g
}

/**
 * The face of the shrine, hanging off the ridge beam: the suzu on its short
 * strap, the 鈴緒 below it, and a chochin either side.
 *
 * THE DROPS ARE THE WHOLE PROBLEM HERE. With the ridge posts nested the beam
 * sits 170 mm above the cargo deck, and a bell on 700 mm of strap plus 1200 of
 * rope is then a metre and a half underground. So the rigid piece hangs SHORT —
 * the bell is 210 below the beam, not 700 — and the two things that are not
 * rigid do what they actually do on the road: the rope coils and the lanterns
 * collapse between their rings. Both are driven off the post extension by the
 * station's update(), so packed they are a coil and two discs tucked under the
 * beam at 530 above the deck, and deployed the bell rings at 2.0 m over the road
 * with the rope grab at 840.
 *
 * The bell is a 本坪鈴 四寸: 122 mm across and 1.7 kg, which is small for a public
 * shrine and correct for a hokora at this scale. Size is structural here rather
 * than stylistic. It hangs from the cast eye at its crown — the only attachment
 * provision a one-piece casting has — on an M8 stainless eye bolt taken THROUGH
 * the beam with a nut and a big washer on top, never a wood screw, because the
 * load is not the 1.7 kg bell. It is a child hauling on the 鈴緒, worth about
 * 40 kg dynamic, and that is why the beam carries a steel plate over the eye
 * bolt instead of trusting 檜 end grain.
 */
function shrineFace(lib) {
  const g = new THREE.Group()
  const HOOK = POST_HOUSING - mm(50) // just under the ridge beam
  const x = SHRINE.x0 + mm(60) //      the shrine's face

  // Eye bolt, shackle and the bell itself.
  g.add(rod([x, HOOK, 0], [x, HOOK - mm(70), 0], mm(9), lib.steelRod))
  const bell = lathe(
    [[0, mm(150)], [mm(45), mm(120)], [mm(61), mm(40)], [mm(55), 0], [0, 0]],
    lib.gold,
    { seg: 16 },
  )
  bell.position.set(x, HOOK - mm(220), 0)
  g.add(bell)

  // 鈴緒 紅白, 36 mm x 1200 — a four-shaku rope. 45 mm is the six-shaku size, and
  // putting it on a 1200 mm drop is the kind of mismatch a supplier catches for
  // you at the counter and a drawing never does.
  const rope = new THREE.Group()
  rope.position.set(x, HOOK - mm(220), 0)
  const r = cloth(mm(60), mm(1200), mm(36), lib.rope, { nx: 3, ny: 7, wave: 0.01 })
  r.position.y = -mm(600)
  rope.add(r)
  g.add(rope)

  const chochins = []
  for (const sz of [-1, 1]) {
    const c = chochin(lib)
    c.position.set(x + mm(40), HOOK, sz * mm(440))
    g.add(c)
    chochins.push(c.userData.body)
  }
  g.userData = { rope, chochin: chochins }
  return g
}
