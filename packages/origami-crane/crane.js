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

// Chevron half-angles (measured from the ridge, in the flat sheet) set how
// steeply each point rises out of its reverse fold at the final tent opening:
// neck 40° → climbs ~72° from the body line (a forward-leaning blade), tail 30°
// → ~53°, head 52° → the beak breaks ~96° back down off the neck. Apexes
// place the joints on the ridge. A reverse-folded flap always opens exactly
// as wide as the body it comes out of (the parity flip mirrors the dihedral),
// so slim, blade-like points require a deeply folded body — that's why the
// final pose keeps the tent at 60° and flattens only the outer wing strips.
export const GEOM = {
  tailApex: -0.42,
  neckApex: 0.3,
  headApex: 0.72,
  thetaNeck: 40,
  thetaTail: 30,
  thetaHead: 52,
  wing: 0.66,
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
  // Wing hinges, parallel to the spine on each side.
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
const S1 = -140 // tent angle while folding (dihedral 40° — nearly flat, like real folding)
const S2 = -120 // final tent angle (dihedral 60°): steep body, points half-closed into blades

export const STEPS = [
  { name: 'a flat square', spine: 0, tailRidge: 0, neckRidge: 0, headRidge: 0, neckFold: 0, tailFold: 0, headFold: 0, wingL: 0, wingR: 0 },
  { name: 'mountain-fold the diagonal', spine: S1, tailRidge: S1, neckRidge: S1, headRidge: S1, neckFold: 0, tailFold: 0, headFold: 0, wingL: 0, wingR: 0 },
  { name: 'reverse-fold the neck', spine: S1, tailRidge: S1, neckRidge: -S1, headRidge: -S1, neckFold: -148.84, tailFold: 0, headFold: 0, wingL: 0, wingR: 0 },
  { name: 'reverse-fold the tail', spine: S1, tailRidge: -S1, neckRidge: -S1, headRidge: -S1, neckFold: -148.84, tailFold: -145.01, headFold: 0, wingL: 0, wingR: 0 },
  { name: 'reverse-fold a beak', spine: S1, tailRidge: -S1, neckRidge: -S1, headRidge: S1, neckFold: -148.84, tailFold: -145.01, headFold: 154.74, wingL: 0, wingR: 0 },
  { name: 'spread the wings', spine: S2, tailRidge: -S2, neckRidge: -S2, headRidge: S2, neckFold: -132.28, tailFold: -126.87, headFold: 140.86, wingL: 50, wingR: 50 },
]
