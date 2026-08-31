import * as THREE from 'three'
import { T, X, HALF_W, PACK_CEILING } from '../specs.js'
import { mm, slab, rod, extrusion, truss, hingeLine, deg } from '../build.js'

// ---------------------------------------------------------------------------
// Hardware every module shares
//
// Four things recur across all four stations, and they recur because they are
// the honest answers to the same four questions.
//
//   THE SUBFRAME — what does the module bolt to? Not the deck pan; that is
//   0.8 mm steel over bearers and it dents if you stand a jack on it. A module
//   sits on a bolted aluminium subframe that spans between the deck's cross
//   bearers and spreads every point load into them.
//
//   THE GATES — the truck already has three hinged panels, and ignoring them
//   would be perverse. So each station takes them over as parts of its own rig,
//   and the audit checks them like anything else.
//
//   THE JACKS — a kei truck sits on leaf springs. The instant somebody steps
//   onto a deployed deck the whole vehicle rolls, and nothing inside the module
//   can fix that, because the compliance is underneath it. Four screw jacks at
//   the deck corners take the truck off its springs and turn the tyre contact
//   patches into a rigid support polygon. Every station has them, and the
//   overlay draws the polygon they make.
//
//   THE LEGS — anything that cantilevers past about 600 mm from the deck edge
//   under live load gets a leg. A hinge carries no moment: a horizontal panel
//   held only by its hinge is a lever pulling the hinge apart, and it will
//   either bend the panel or tear out the fasteners. The leg is not optional
//   dressing, it is the second half of the load path.
// ---------------------------------------------------------------------------

/**
 * Where the gate hinge lines sit.
 *
 * A gate is authored standing up from its hinge with its thickness centred on
 * it, so dropping the hinge by half the panel thickness puts the gate's TOP
 * FACE exactly at deck level once it swings to horizontal — which is what makes
 * a dropped gate a flush walkway rather than a 24 mm trip hazard.
 */
export const GATE_Y = -T.gate / 2
export const GATE_Z = HALF_W + T.gate / 2
export const GATE_X = -(T.bedLen / 2 + T.gate / 2)

/** How far below a jack's slide origin its rubber foot sits. */
export const FOOT_DROP = mm(290)

/**
 * Gate poses, in radians of hinge travel.
 *
 * `hang` is 165 degrees rather than a flat 180, and the reason is the rear tyre.
 * The bed's outer face is the widest part of the truck at 737 mm from the
 * centreline; the rear tyre's outer sidewall is at 722. A gate hanging dead
 * vertical would have its inner face 9 mm inboard of the tyre and would foul
 * it. Let it hang out at 15 degrees — which is precisely what the retaining
 * chain on a real drop side is for — and its lower edge kicks 74 mm outboard,
 * clearing the tyre by about 15 mm the whole way down.
 *
 * That is not a modelling fudge to get past the audit. It is the audit finding
 * a real interference and the design answering it the way the truck already
 * does.
 */
export const GATE = {
  shut: 0,
  /** Horizontal: the gate becomes a shelf or a walkway, and needs a leg. */
  flat: Math.PI / 2,
  /** Hanging down the side on its chains, out of the way and clear of the tyre. */
  hang: deg(165),
}

/**
 * Hand the truck's three drop gates to a station's rig.
 *
 * @param {import('../rig.js').Rig} rig
 * @param {object} ctx  { truck, lib }
 * @param {object} pose { left, right, tail } each a key of GATE, plus stages
 */
export function addGates(rig, ctx, { left = 'hang', right = 'hang', tail = 'hang', stage = 0 } = {}) {
  const sideHull = (sign) => [
    { c: [0, T.bedSide / 2, 0], s: [T.bedLen - mm(90), T.bedSide, T.gate], tag: 'gate' },
  ]
  for (const [key, sign] of [
    ['left', -1],
    ['right', 1],
  ]) {
    const pose = key === 'left' ? left : right
    const part = rig.add({
      id: `gate-${key}`,
      parent: null,
      label: `${key} drop side`,
      pivot: [0, GATE_Y, sign * GATE_Z],
      joint: 'hinge',
      axis: [1, 0, 0],
      // The right gate swings to +Z as the hinge angle grows; the left has to
      // go the other way, so its travel is negated rather than mirrored — a
      // mirrored transform would flip the panel's normals.
      range: [0, sign * GATE[pose]],
      stage,
      hulls: sideHull(sign),
      mates: ['deck', 'floor', 'ground'],
      note: pose === 'flat' ? 'held horizontal by a drop leg' : '',
    })
    rig.attach(part.id, ctx.truck.gateGeometry.side())
  }
  const t = rig.add({
    id: 'gate-tail',
    parent: null,
    label: 'tailgate',
    pivot: [GATE_X, GATE_Y, 0],
    joint: 'hinge',
    axis: [0, 0, 1],
    range: [0, GATE[tail]],
    stage,
    hulls: [{ c: [0, T.bedSide / 2, 0], s: [T.gate, T.bedSide, T.bedWid + T.gate * 2], tag: 'gate' }],
    mates: ['deck', 'floor', 'ground'],
  })
  rig.attach(t.id, ctx.truck.gateGeometry.tail())
}

/**
 * The bolted aluminium subframe every module stands on, and the deck surface
 * that is its top face.
 *
 * `height` is how far the module floor sits above the cargo deck. Everything a
 * station packs is measured from that face, so it is the one number that trades
 * module floor thickness against packing headroom.
 */
export function subframe(lib, { height = mm(110), inset = mm(10), skin = null } = {}) {
  const g = new THREE.Group()
  const L = T.bedLen - inset * 2
  const W = T.bedWid - inset * 2
  const sec = mm(60)

  // Perimeter and two longitudinal rails, on 40 x 60 extrusion.
  for (const z of [-W / 2 + sec / 2, -mm(230), mm(230), W / 2 - sec / 2]) {
    g.add(extrusion([-L / 2, height - sec / 2, z], [L / 2, height - sec / 2, z], sec, lib.aluDark))
  }
  // Cross bearers land over the truck's own deck bearers, which is the whole
  // point of a subframe: point loads reach the chassis, not the deck pan.
  for (let i = -3; i <= 3; i++) {
    g.add(extrusion([i * mm(300), height - sec / 2, -W / 2], [i * mm(300), height - sec / 2, W / 2], mm(45), lib.aluDark))
  }
  // Spreader plates and bolts at the four corners, into the deck's own tie-downs.
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      g.add(slab([mm(150), mm(10), mm(150)], lib.galv, { pos: [sx * (L / 2 - mm(90)), mm(6), sz * (W / 2 - mm(90))] }))
    }
  }
  g.add(slab([L, mm(22), W], skin ?? lib.ply, { pos: [0, height - mm(11), 0] }))
  return g
}

/** The collision hull the subframe above occupies. */
export function subframeHull(height = mm(110), inset = mm(10)) {
  return [{ c: [0, height / 2, 0], s: [T.bedLen - inset * 2, height, T.bedWid - inset * 2], tag: 'subframe' }]
}

/**
 * A screw jack: a leg that winds down from the subframe to the ground.
 *
 * `drop` is how far the foot travels; the packed leg has to be shorter than the
 * deck height or it would ground out on the way to site, so the jack is a
 * telescope that stows inside its own housing.
 */
export function addJack(rig, lib, { id, parent = null, at, stage, drop = null, label }) {
  // The screw stows in a housing slung UNDER the deck edge, not standing on it,
  // so the retracted jack does not occupy the deck's own volume — and so the
  // truck can be driven with the jacks aboard. `at[1]` is therefore negative,
  // and the travel is whatever is left between there and the tarmac once the
  // foot's own 288 mm of hardware is accounted for.
  const travel = drop ?? T.deckH + at[1] - FOOT_DROP
  const part = rig.add({
    id,
    parent,
    label: label ?? 'stabiliser jack',
    pivot: at,
    joint: 'slide',
    axis: [0, -1, 0],
    range: [0, travel],
    stage,
    mass: 4.4,
    com: [0, -travel / 2, 0],
    footprint: [0, -FOOT_DROP, 0],
    hulls: [{ c: [0, -mm(150), 0], s: [mm(76), mm(300), mm(76)], tag: 'jack' }],
    mates: ['ground', 'gate-left', 'gate-right', 'gate-tail'],
    note: 'takes the truck off its springs',
  })
  const g = new THREE.Group()
  g.add(slab([mm(58), mm(280), mm(58)], lib.galv, { pos: [0, -mm(140), 0] }))
  g.add(slab([mm(170), mm(22), mm(170)], lib.aluDark, { pos: [0, -FOOT_DROP + mm(20), 0] }))
  g.add(slab([mm(190), mm(16), mm(190)], lib.rubberFoot, { pos: [0, -FOOT_DROP + mm(4), 0] }))
  const crank = rod([mm(30), -mm(20), 0], [mm(130), -mm(20), 0], mm(9), lib.steelRod)
  g.add(crank)
  rig.attach(id, g)
  // The housing the jack winds out of is static, so it is drawn on the parent.
  return part
}

/**
 * A fold-down leg: hinges out from under a deployed panel and reaches the
 * ground. Authored about its hinge, hanging along -Y at full deployment.
 */
export function legGeometry(lib, length, { foot = mm(150), section = mm(50) } = {}) {
  const g = new THREE.Group()
  g.add(slab([section, length, section], lib.alu, { anchor: [0, 1, 0] }))
  g.add(slab([section * 0.6, mm(120), section * 0.6], lib.aluDark, { pos: [0, -length - mm(50), 0] }))
  g.add(slab([foot, mm(18), foot], lib.aluDark, { pos: [0, -length - mm(110), 0] }))
  g.add(slab([foot + mm(20), mm(14), foot + mm(20)], lib.rubberFoot, { pos: [0, -length - mm(122), 0] }))
  // The brace that turns a leg into a triangle. Without it the leg is a pin-
  // ended strut and the panel it holds is still free to swing about its hinge.
  g.add(rod([0, -length * 0.55, 0], [mm(230), -mm(30), 0], mm(14), lib.steelRod))
  return g
}

/** An over-centre latch, drawn where two parts lock to each other. */
export function latch(lib, at, { size = mm(70) } = {}) {
  const g = new THREE.Group()
  g.add(slab([size, size * 0.55, size * 0.35], lib.galv, { pos: at }))
  g.add(rod([at[0] - size * 0.4, at[1], at[2]], [at[0] + size * 0.5, at[1] - size * 0.3, at[2]], mm(7), lib.steelRod))
  return g
}

/** A tension stay: a thin rod with a turnbuckle in the middle. */
export function stay(lib, a, b, { radius = mm(7) } = {}) {
  const g = new THREE.Group()
  g.add(rod(a, b, radius, lib.steelRod, { seg: 6 }))
  const mid = new THREE.Vector3().fromArray(a).lerp(new THREE.Vector3().fromArray(b), 0.5)
  const dir = new THREE.Vector3().fromArray(b).sub(new THREE.Vector3().fromArray(a)).normalize()
  g.add(
    rod(
      mid.clone().addScaledVector(dir, -mm(50)).toArray(),
      mid.clone().addScaledVector(dir, mm(50)).toArray(),
      radius * 2.1,
      lib.galv,
      { seg: 6 },
    ),
  )
  return g
}

/**
 * A telescoping mast or leg, drawn as nested boxes.
 *
 * `stages` sections, each narrower than the last. The rule of thumb that keeps
 * a telescope stiff is at least 1.5 section depths of engagement at full
 * extension, which is why the drawn overlap never goes to zero.
 */
export function telescope(lib, { stages = 3, section = mm(180), length = mm(700), taper = 0.82 } = {}) {
  const g = new THREE.Group()
  let s = section
  for (let i = 0; i < stages; i++) {
    g.add(slab([s, length, s], i === 0 ? lib.aluDark : lib.alu, { anchor: [0, -1, 0], pos: [0, 0, 0] }))
    s *= taper
  }
  return g
}

/**
 * A panel in a folding chain, authored about its hinge line.
 *
 * `anchorY` is the whole reason this function takes a parameter at all, and it
 * is the single most important number in any fold-out design.
 *
 * A butt hinge's pin sits on the SURFACE the two panels share, not on their
 * centrelines. Take two boards of thickness t, hinged so they are coplanar when
 * open. Panel A spans y in [0, t]. The pin is at (L, t) — the far top corner.
 * Fold panel B through 180 degrees about that pin and it lands on y in [t, 2t]:
 * stacked exactly on top of A, which is what you want. Put the pin on the
 * centrelines instead and the folded panel has to occupy the same space as the
 * panel it folds onto, which is the "folds through itself" failure in its
 * purest form.
 *
 * So along a chain the pin alternates sides — +t, -t, +t — and each panel is
 * anchored to put the correct face on its own pin: anchorY -1 for a panel that
 * sits above its pin, +1 for one that hangs below it. Get the alternation wrong
 * and the audit reports exactly one panel-thickness of interference, which is
 * a useful thing to recognise on sight.
 */
export function foldPanel(lib, length, width, thickness, { face = null, frame = true, anchorY = 0 } = {}) {
  const g = new THREE.Group()
  const a = [-1, anchorY, 0]
  g.add(slab([length, thickness, width], face ?? lib.ply, { anchor: a }))
  if (frame) {
    const e = thickness + mm(5)
    g.add(slab([length, e, mm(34)], lib.alu, { anchor: a, pos: [0, 0, width / 2 - mm(17)] }))
    g.add(slab([length, e, mm(34)], lib.alu, { anchor: a, pos: [0, 0, -width / 2 + mm(17)] }))
    g.add(slab([mm(34), e, width], lib.alu, { anchor: a, pos: [length - mm(34), 0, 0] }))
    g.add(slab([mm(34), e, width], lib.alu, { anchor: a }))
  }
  return g
}

/** The hull a foldPanel occupies, matching it exactly. */
export function foldPanelHull(length, width, thickness, tag = 'panel', anchorY = 0) {
  const t = thickness + mm(6)
  return [{ c: [length / 2, (-anchorY * t) / 2, 0], s: [length, t, width], tag }]
}

/**
 * Rest orientations for panels authored by foldPanel().
 *
 * foldPanel builds a panel that runs along its own +X, is `width` wide along
 * its own Z, and thin in its own Y. That frame is right for a panel hinged
 * about the world Z axis and nothing else, so a panel hinged about world X
 * needs turning first — and it needs turning in BOTH axes, which is the part
 * that catches you out.
 *
 * A single quarter turn about Z stands the panel up correctly but leaves its
 * width lying along world Z, i.e. across the truck instead of along it. A
 * counter meant to be 1740 mm of serving frontage ends up 1740 mm deep and
 * 450 mm wide, sticking out through both sides of the vehicle. The audit
 * reports it as half a metre of interference with the deck, which is exactly
 * what it is.
 *
 * UP_ALONG_X is the cyclic permutation x -> y -> z -> x, a 120 degree turn
 * about (1,1,1): the panel's length goes up, its width goes along the truck,
 * and its thickness goes across. That is the frame a wall, a counter or a
 * shelf hinged on a fore-and-aft line actually wants.
 */
export const REST = {
  /** length -> +Y (up), width -> +X (along the truck), thickness -> +Z. */
  UP_ALONG_X: [[1, 1, 1], (2 * Math.PI) / 3],
  /** length -> -Y (hanging), width -> +X. The mirror of UP_ALONG_X. */
  DOWN_ALONG_X: [[-1, 1, -1], (2 * Math.PI) / 3],
  /** length -> -X (lying aft), width -> -Z. For a panel hinged about world Z. */
  FLAT_AFT: [[0, 1, 0], Math.PI],
  /** length -> +Z (lying outboard), width -> +X. Thickness flips to -Y. */
  FLAT_OUTBOARD: [[1, 0, 1], Math.PI],
  /** A leg authored hanging down -Y, laid along -X instead. */
  LEG_ALONG_X: [[0, 0, 1], -Math.PI / 2],
}

/** Knuckles drawn on a hinge line running along Z at the part's origin. */
export function hingeZ(lib, width, radius = mm(15)) {
  return hingeLine([0, 0, -width / 2], [0, 0, width / 2], radius, lib.hinge)
}

/** Knuckles drawn on a hinge line running along X. */
export function hingeX(lib, length, radius = mm(15)) {
  return hingeLine([-length / 2, 0, 0], [length / 2, 0, 0], radius, lib.hinge)
}

export { mm, deg, slab, rod, extrusion, truss, T, X, HALF_W, PACK_CEILING }
