// How high an animal can bring its attack to bear, from its body plan alone.
// A blow lands only on a body that overlaps the band [lo, hi] — metres above
// the animal's own feet. Every melee path asks this one question: the
// brain's bites, charges and tail swings, a trampler's feet (and the
// UNDERFOOT readout that warns of them), and a blow on a vehicle's hull. So a
// player up on a roof or a tower is out of reach of whatever cannot stretch
// that far, while a T. rex still takes someone off a low roof.
//
// An attack's `range` (data/species.js) stays its horizontal reach; this is
// the vertical one, measured off the same proportions rig.js builds from.
// Pure — no three.js — so tests/reach.test.js runs it in node.

// The root of the neck, where rig.js puts it: the chest (at the shoulder for
// a quadruped) plus a share of the torso's depth.
const neckBase = (b) => (b.plan === 'quad' ? b.shoulderH + b.torsoH * 0.3 : b.hipH + b.torsoH * 0.4)
const tailBase = (b) => b.hipH + b.torsoH * 0.18

// What delivers each kind of blow, and the highest it can be brought:
//   bite     rears and stretches neck and jaws straight up (a lunge is the
//            same stretch, thrown forward)
//   charge   rams with the head at the shoulder — a charger cannot rear and
//            run — and a toss lifts the horns half-way to upright
//   tail     sweeps flat from the hip (the animator swings it sideways), its
//            top edge a tail's thickness above the root
//   trample  a foot raised to half the hip and brought down
const STRIKE_TOP = {
  bite: (b) => neckBase(b) + b.neck.len + b.head.len,
  charge: (b) => neckBase(b) + b.head.len * Math.SQRT1_2,
  tail: (b) => tailBase(b) + b.tail.r,
  trample: (b) => b.hipH * 0.5,
}
// Below its feet: over a bank or into a ditch, about half a leg's length.
const STRIKE_DOWN = 0.5

// The band an individual of `sp` at `scale` reaches, relative to its feet,
// or null for an animal with no attack.
export function reachBand(sp, scale = 1) {
  const kind = sp.attack?.kind
  if (!kind) return null
  const b = sp.body
  const top = (STRIKE_TOP[kind] || STRIKE_TOP.bite)(b)
  return { lo: -b.hipH * STRIKE_DOWN * scale, hi: top * scale }
}

// Does a band, its owner standing at footY, overlap a body spanning lo..hi?
// `ceil` is the underside of anything over the animal's head (a roof it
// stands under): nothing reaches up through it.
export function inReach(band, footY, lo, hi, ceil = Infinity) {
  return !!band && lo <= Math.min(footY + band.hi, ceil) && hi >= footY + band.lo
}
