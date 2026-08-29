import { Paper } from './origami.js'

// ---------------------------------------------------------------------------
// The crane's crease pattern — researched against the real orizuru this time.
//
// Facts about the traditional crane the first pattern got wrong:
//
//   * The finished crane is bilaterally symmetric about the plane that holds
//     the neck and the tail. Its body ridge — the fold the wings hang from —
//     runs ALONG the neck–tail axis: corner to corner, on the diagonal. The
//     old pattern creased the body edge-to-edge (y = 0), 45° off that axis,
//     which tented the sheet ACROSS the neck–tail line and canted the neck
//     and tail to opposite sides. That is the fold that was in the wrong
//     place, and why the result read as a crumpled lump from every angle.
//
//   * Neck, tail and head are INSIDE REVERSE FOLDS, not simple flap folds.
//     A reverse fold tucks the point between the two body flanks: the crease
//     runs through the ridge as a chevron (a V of two arms meeting ON the
//     ridge), and the ridge continues through the flap with its parity
//     flipped — mountain becomes valley. A single straight crease (the old
//     pattern) just swings the corner out of the symmetry plane.
//
// So: spine along the BL→TR diagonal, and a chevron vertex on that diagonal
// for tail, neck and head. Every interior vertex is then a symmetric
// degree-4 origami vertex (sectors θ, 180−θ, 180−θ, θ) — rigidly foldable,
// with exactly one nontrivial branch: the reverse fold. Wing creases run
// parallel to the spine and meet nothing, so they stay free hinges.
//
// The four corners keep their roles: TR → neck+head, BL → tail, TL/BR → the
// wings — same assignment as the bird base, where those two thin points and
// two big flaps are exactly two opposite corner pairs of the square.
// ---------------------------------------------------------------------------

// Proportions are tuned to what the eye measures on a finished crane, using
// the traditional crease pattern (004_traditional_Crane.fold, flat-folder's
// examples) as the reference. Its beak joint sits 11.5% in from the corner —
// kept exactly (head apex 0.77). Its neck JOINT sits 25% in, but that number
// does NOT transfer: a real crane's neck is four layers of paper standing
// entirely proud of a body the bird base has already narrowed, while a
// single sheet buries the base of every flap inside the body wedge. Only the
// part clearing the wings reads as neck. So the neck joint moves most of the
// way to the centre of the sheet (apex 0.1): the flap is then 1.73x the body
// it grows out of, which is what finally reads as a crane's neck rather than
// a bump. It stops at 0.1 rather than dead centre because the joint and the
// wing band are coupled — see wingBandProblems below.
//
// The stance: a long neck climbing steeply (40° chevron → ~77° from the
// body line), a long tail trailing low behind (22° → ~42°), the beak
// dipping ~25° below level (52°), and the wings folded down past level so
// the neck stands clear of them. A reverse-folded flap always opens exactly
// as wide as the body it comes out of (the parity flip mirrors the
// dihedral), so slim blade-like points need a deeply folded body: the tent
// holds dihedral 40° all the way through, and the last step is purely the
// wings folding down and apart — which is also how the real crane ends.
//
// The arm angles in STEPS below are unchanged by any of this: closure at a
// symmetric degree-4 vertex depends only on its sector angle and the ridge
// angle arriving at it, never on where along the ridge it sits. Moving a
// joint re-proportions the bird without disturbing the fold.
export const GEOM = {
  tailApex: -0.42,
  neckApex: 0.1,
  headApex: 0.77,
  thetaNeck: 40,
  thetaTail: 22,
  thetaHead: 52,
  wing: 0.84,
}

// A wing hinge is the line y = x ± wing; a chevron arm leaves its apex on the
// diagonal and climbs in |y − x| until it exits the sheet. If an arm reaches
// |y − x| = wing before the edge, the two creases CROSS, and a crossing is not
// rigidly foldable — the fold stops closing and the paper stretches at that
// vertex instead. (It survives on screen because the mesh is welded, which is
// exactly why it needs a check: it looks plausible while being wrong.) Moving
// a joint changes how far its arms reach, so the two constants are coupled:
// this reports the violation instead of letting it render quietly.
function armReach(apex, dirDeg) {
  const rad = (dirDeg * Math.PI) / 180
  const dx = Math.cos(rad)
  const dy = Math.sin(rad)
  let t = Infinity
  if (dx > 1e-12) t = Math.min(t, (1 - apex) / dx)
  if (dx < -1e-12) t = Math.min(t, (-1 - apex) / dx)
  if (dy > 1e-12) t = Math.min(t, (1 - apex) / dy)
  if (dy < -1e-12) t = Math.min(t, (-1 - apex) / dy)
  return Math.abs(t * (dy - dx))
}

export function wingBandProblems(g = GEOM) {
  const arms = [
    ['neck', g.neckApex, 45 + g.thetaNeck],
    ['neck', g.neckApex, 45 - g.thetaNeck],
    ['head', g.headApex, 45 + g.thetaHead],
    ['head', g.headApex, 45 - g.thetaHead],
    ['tail', g.tailApex, 225 - g.thetaTail],
    ['tail', g.tailApex, 225 + g.thetaTail],
  ]
  const problems = []
  for (const [name, apex, dir] of arms) {
    const reach = armReach(apex, dir)
    if (reach > g.wing - 1e-9) {
      problems.push(`${name} chevron arm reaches |y-x| = ${reach.toFixed(3)}, crossing the wing hinge at ${g.wing}`)
    }
  }
  return problems
}

// Where a ray from `from` at `angleDeg` (CCW from +x) first leaves the square
// [-1,1]². Chevron arms must run all the way to the paper's edge: an arm that
// stopped inside the sheet would dead-end a crease at an unfoldable vertex.
function rayToEdge(from, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180
  const dx = Math.cos(rad)
  const dy = Math.sin(rad)
  let t = Infinity
  if (dx > 1e-12) t = Math.min(t, (1 - from[0]) / dx)
  if (dx < -1e-12) t = Math.min(t, (-1 - from[0]) / dx)
  if (dy > 1e-12) t = Math.min(t, (1 - from[1]) / dy)
  if (dy < -1e-12) t = Math.min(t, (-1 - from[1]) / dy)
  return [from[0] + t * dx, from[1] + t * dy]
}

export function buildCrane(g = GEOM) {
  const nA = [g.neckApex, g.neckApex]
  const hA = [g.headApex, g.headApex]
  const tA = [g.tailApex, g.tailApex]
  const p = new Paper(1)
  // The diagonal, split once but tagged in four runs: the body spine between
  // the tail and neck apexes, and the ridge continuing through each flap.
  // Separate ids because a reverse fold flips the ridge's fold sign at the
  // apex — the flap's ridge always folds by minus the incoming ridge angle.
  p.crease('spine', tA, nA, { segment: true })
  p.crease('tailRidge', [-1, -1], tA, { segment: true })
  p.crease('neckRidge', nA, hA, { segment: true })
  p.crease('headRidge', hA, [1, 1], { segment: true })
  // Reverse-fold chevrons. The two arms of a chevron share one fold id; the
  // left arm is written apex→edge and the right one edge→apex so that one
  // signed angle folds the pair mirror-symmetrically under the engine's
  // "positive lifts the left of a→b" convention.
  p.crease('neckFold', nA, rayToEdge(nA, 45 + g.thetaNeck), { segment: true })
  p.crease('neckFold', rayToEdge(nA, 45 - g.thetaNeck), nA, { segment: true })
  p.crease('headFold', hA, rayToEdge(hA, 45 + g.thetaHead), { segment: true })
  p.crease('headFold', rayToEdge(hA, 45 - g.thetaHead), hA, { segment: true })
  p.crease('tailFold', tA, rayToEdge(tA, 225 - g.thetaTail), { segment: true })
  p.crease('tailFold', rayToEdge(tA, 225 + g.thetaTail), tA, { segment: true })
  // Wing hinges, parallel to the spine on each side. They must clear every
  // chevron arm — see wingBandProblems above for why a crossing is fatal.
  for (const problem of wingBandProblems(g)) console.warn(`origami-crane: ${problem}`)
  p.crease('wingL', [1 - g.wing, 1], [-1, g.wing - 1])
  p.crease('wingR', [1, 1 - g.wing], [g.wing - 1, -1])
  // Root = a body-flank triangle near the middle, biased into the TL half so
  // the choice (and with it every fold's frame) is deterministic.
  return p.build(([cx, cy]) => -(Math.abs(cx) + Math.abs(cy)) + (cy > cx ? 0.001 : 0))
}

export const FOLD_IDS = [
  'spine',
  'tailRidge',
  'neckRidge',
  'headRidge',
  'neckFold',
  'tailFold',
  'headFold',
  'wingL',
  'wingR',
]

// ---------------------------------------------------------------------------
// The fold sequence, in the order the paper crane is actually taught: crease
// the body diagonal, reverse-fold neck / tail / head, then spread the wings.
//
// Angles are degrees. At every step the whole set satisfies the rigid-fold
// closure at every interior vertex to ~1e-8 (solved numerically against this
// exact mesh by minimizing the engine's weld spread), so the settled paper is
// a true rigid origami state — no stretch, no tear. Mid-transition blends are NOT
// rigid states: real paper also bends while a reverse fold pops through, and
// the engine's welded vertices flex the same way.
//
// The reverse-fold pattern in the numbers: at each chevron the outgoing
// ridge is exactly minus the incoming one (mountain → valley), and the arm
// angle is the one closure then allows.
// ---------------------------------------------------------------------------
const S = -140 // the body stays deeply folded (dihedral 40°) — that's what keeps the points slim

export const STEPS = [
  { name: 'a flat square', spine: 0, tailRidge: 0, neckRidge: 0, headRidge: 0, neckFold: 0, tailFold: 0, headFold: 0, wingL: 0, wingR: 0 },
  { name: 'mountain-fold the diagonal', spine: S, tailRidge: S, neckRidge: S, headRidge: S, neckFold: 0, tailFold: 0, headFold: 0, wingL: 0, wingR: 0 },
  { name: 'reverse-fold the neck', spine: S, tailRidge: S, neckRidge: -S, headRidge: -S, neckFold: -148.84, tailFold: 0, headFold: 0, wingL: 0, wingR: 0 },
  { name: 'reverse-fold the tail', spine: S, tailRidge: -S, neckRidge: -S, headRidge: -S, neckFold: -148.84, tailFold: -142.7, headFold: 0, wingL: 0, wingR: 0 },
  { name: 'reverse-fold a beak', spine: S, tailRidge: -S, neckRidge: -S, headRidge: S, neckFold: -148.84, tailFold: -142.7, headFold: 154.74, wingL: 0, wingR: 0 },
  { name: 'spread the wings', spine: S, tailRidge: -S, neckRidge: -S, headRidge: S, neckFold: -148.84, tailFold: -142.7, headFold: 154.74, wingL: 80, wingR: 80 },
]
