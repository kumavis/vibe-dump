// Tree roots as plain numbers (no three.js): the flare at the foot of a
// trunk, and the buttress fins of the jungle giants. world/vegetation.js
// turns them into geometry. Everything is in a plant's own units (before its
// instance scale) and heights are measured from where the ground meets the
// trunk, so they hold whatever the plant's `sink`.

// The steepest ground a root is built for (rise over run). The foot of every
// trunk and the underside of every fin reach this far below the ground, so
// ground falling away from a tree never shows them floating. Canopy,
// broadleaf and pine thin out where the island's slope grid passes 0.65 and
// are gone by 1.0 (island.js computeDensities), but the drawn ground under a
// trunk can be steeper than its grid cell: up to 1.5 under the odd pine on
// the seeds tried. A tree right on the lip of a cliff can still show the rim
// of its foot.
export const ROOT_SLOPE = 1.5

// Root flares, per plant: `r` the foot of the trunk's own taper, `flare` how
// much wider (× r) it grows by height above the ground (linear between, held
// past the ends), and `rings` the heights each LOD cuts it at. A flared trunk
// carries on up from its last ring; LOD2 (a few pixels wide) has none. Every
// other ring, the top one first, is turned by `turn` of a side, `toes`
// splays every other corner out at the ground (an even-sided trunk only),
// and `rag` (× its height) lifts or drops each corner of a ring above the
// ground, so the flare's creases don't run level round the trunk like the
// edge of a plinth. The palm's ring of roots is a separate collar, tucked
// into its trunk.
export const FOOT = {
  canopy: { r: 0.55, flare: [[-2.3, 2.7], [0, 1.55], [0.35, 1.32], [1, 1.12], [2.4, 1]], rings: [[-2.3, 0, 0.35, 1], [-2.3, 0.3], []], turn: 0.5, toes: 0, rag: 0.45 },
  broadleaf: { r: 0.3, flare: [[-1.3, 2.3], [0, 1.55], [0.45, 1.22], [1.4, 1]], rings: [[-1.3, 0, 0.45, 1.1], [-1.3, 0.3], []], turn: 0, toes: 0.22, rag: 0 },
  pine: { r: 0.25, flare: [[-0.8, 2.05], [0, 1.5], [0.5, 1.15], [1.2, 1]], rings: [[-0.8, 0, 0.5], [-0.8, 0.3], []], turn: 0.5, toes: 0, rag: 0 },
  palm: { r: 0.2, flare: [[-0.9, 2.45], [0, 1.6], [0.3, 1.2], [0.6, 0.82]], rings: [[-0.9, 0, 0.3, 0.6], [-0.9, 0, 0.6], []], turn: 0, toes: 0.2, rag: 0 },
}

// The flare (× the trunk's radius) at height u above the ground.
export function flare(profile, u) {
  if (u <= profile[0][0]) return profile[0][1]
  for (let i = 1; i < profile.length; i++) {
    const [u1, k1] = profile[i]
    if (u <= u1) {
      const [u0, k0] = profile[i - 1]
      return k0 + ((k1 - k0) * (u - u0)) / (u1 - u0)
    }
  }
  return profile[profile.length - 1][1]
}

// Buttresses: the ranges each canopy tree's fins are drawn from. A fin leaves
// the trunk `rise` above the ground (`inner` out from its axis, inside the
// bark), sweeps down and out along a hollow curve (`bow`, the power of its
// fall) and curls sideways (`swing`, of its reach) to `dive` below the ground
// `reach` out; then carries on under it for `tail` to a point. `thick` is
// its thickness, halved, along its underside, `deep` how far that lies below
// the ground at the trunk.
export const BUTTRESS = { count: [4, 5], inner: 0.4, reach: [2, 3], rise: [1.4, 2.4], bow: [1.7, 2.6], swing: 0.25, thick: [0.22, 0.3], dive: 0.15, tail: 0.6, deep: 0.25 }

// One fin's cross-sections from inside the trunk out to its buried point,
// `segs` along its curve and one more for the tail: at each, `r` out along
// the fin and `lat` sideways, the heights of its sharp top edge (`top`) and
// of its underside (`keel`), and the half-width `w` at the underside. The
// underside falls away at ROOT_SLOPE, below any ground that falls slower.
export function buttress(f, segs, B = BUTTRESS) {
  const out = []
  for (let i = 0; i <= segs + 1; i++) {
    const tail = i > segs
    const s = Math.min(1, i / segs)
    const r = tail ? f.reach + B.tail : B.inner + (f.reach - B.inner) * s
    const keel = -B.deep - ROOT_SLOPE * r
    const d = r - B.inner
    out.push({
      r,
      lat: (f.swing * d * d) / f.reach,
      top: tail ? keel : f.rise * Math.pow(1 - s, f.bow) - B.dive * s,
      keel,
      w: tail ? 0 : f.thick * (1 - 0.8 * s),
    })
  }
  return out
}
