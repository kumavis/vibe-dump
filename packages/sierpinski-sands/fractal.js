import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

// ---------------------------------------------------------------------------
// The pyramid
//
// Everything here works in "unit space": a block is a square-based pyramid
// whose base is the square [-0.5, 0.5]² at y = 0 and whose apex sits at y = H.
// H is the Great Pyramid's own ratio (146.6 m tall over a 230.4 m base), which
// is squatter than the tetrahedron people usually reach for and reads far more
// like Giza.
//
// The recursion is the square-base Sierpinski pyramid: every block becomes five
// half-scale blocks — four in the base quadrants, one riding on the flat square
// left at half height. Block count is 5^depth.
// ---------------------------------------------------------------------------
export const PYRAMID_H = 0.636
export const MAX_DEPTH = 4
const TIERS = 7 // stone courses per block — the ledges the sand pours off

// Base-centre offsets of the five children, in the parent's own unit space.
// The apex child goes last, so `index % 5 === 4` is always the capstone.
const CHILDREN = [
  [-0.25, 0, -0.25],
  [0.25, 0, -0.25],
  [-0.25, 0, 0.25],
  [0.25, 0, 0.25],
  [0, PYRAMID_H * 0.5, 0],
]

// Half-width and top height of stone course `i` (0 = the widest, at the bottom).
const tierHalf = (i) => (1 - i / TIERS) * 0.5
const tierTop = (i) => ((i + 1) / TIERS) * PYRAMID_H

// A deterministic hash → [0,1). Used for weathering so a rebuild always erodes
// the block exactly the same way.
function hash3(x, y, z) {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453
  return s - Math.floor(s)
}

/**
 * Geometry for one block: a stepped ziggurat whose outer envelope is the
 * pyramid. Steps matter twice over — they give the silhouette its quarried,
 * ancient read, and they give the sand horizontal ledges to sheet off.
 */
export function makeBlockGeometry() {
  const courses = []
  for (let i = 0; i < TIERS; i++) {
    const y0 = i === 0 ? 0 : tierTop(i - 1)
    const y1 = tierTop(i)
    const w = tierHalf(i) * 2
    const box = new THREE.BoxGeometry(w, y1 - y0, w)
    box.translate(0, (y0 + y1) * 0.5, 0)
    courses.push(box)
  }
  const geo = mergeGeometries(courses, false)
  courses.forEach((c) => c.dispose())

  // Weathering: nudge every vertex a hair off true. The blocks are flat-shaded,
  // so this alone breaks up the machined look of stacked boxes — edges chip,
  // faces catch the sun at slightly different angles.
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    pos.setXYZ(
      i,
      x + (hash3(x, y, z) - 0.5) * 0.012,
      y + (hash3(y, z, x) - 0.5) * 0.008,
      z + (hash3(z, x, y) - 0.5) * 0.012,
    )
  }
  geo.computeVertexNormals()
  geo.computeBoundingSphere()
  return geo
}

/**
 * Every recursion depth, precomputed. `depths[d]` is a Float32Array of
 * `5^d * 4` values — (x, y, z, scale) per block, base-centre in unit space.
 *
 * The ordering is the load-bearing part: block `i` at depth `d+1` is always a
 * child of block `floor(i / 5)` at depth `d`. The split animation leans on that
 * to look up a block's parent without storing any links.
 */
export function buildDepths(maxDepth) {
  const depths = [Float32Array.from([0, 0, 0, 1])]
  for (let d = 0; d < maxDepth; d++) {
    const parents = depths[d]
    const n = parents.length / 4
    const next = new Float32Array(n * 5 * 4)
    for (let p = 0; p < n; p++) {
      const px = parents[p * 4]
      const py = parents[p * 4 + 1]
      const pz = parents[p * 4 + 2]
      const ps = parents[p * 4 + 3]
      for (let k = 0; k < 5; k++) {
        const o = CHILDREN[k]
        const b = (p * 5 + k) * 4
        next[b] = px + ps * o[0]
        next[b + 1] = py + ps * o[1]
        next[b + 2] = pz + ps * o[2]
        next[b + 3] = ps * 0.5
      }
    }
    depths.push(next)
  }
  return depths
}

/**
 * Pick a spot on a block's surface for sand to come off: a run along the outer
 * lip of one stone course, which is where a sheet of it would spill over.
 * `along` is the centre of the run, normalised to [-1, 1] across that edge.
 *
 * Picking the spot and sampling grains on it are separate calls on purpose —
 * a hundred grains sharing one spot fall as a curtain, whereas a hundred
 * independent samples just fog the whole monument evenly.
 */
export function pickLedge(out) {
  out.tier = Math.min(TIERS - 1, (Math.random() * TIERS) | 0)
  out.side = (Math.random() * 4) | 0
  out.along = Math.random() * 2 - 1
  return out
}

/**
 * A grain on that spot, in unit-block space, plus the outward horizontal normal
 * of the edge it is about to go over. `spread` widens the run along the edge.
 */
export function ledgeGrain(spot, spread, outPos, outNormal) {
  const half = tierHalf(spot.tier)
  // Hug the lip, with a little scatter inwards so the sheet has thickness.
  const lip = half * (0.9 + Math.random() * 0.1)
  const t = Math.max(-1, Math.min(1, spot.along + (Math.random() - 0.5) * spread))
  const along = t * half
  const y = tierTop(spot.tier)
  if (spot.side === 0) {
    outPos.set(along, y, -lip)
    outNormal.set(0, 0, -1)
  } else if (spot.side === 1) {
    outPos.set(along, y, lip)
    outNormal.set(0, 0, 1)
  } else if (spot.side === 2) {
    outPos.set(-lip, y, along)
    outNormal.set(-1, 0, 0)
  } else {
    outPos.set(lip, y, along)
    outNormal.set(1, 0, 0)
  }
}
