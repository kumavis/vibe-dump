import { LEXICON } from './lexicon.js'

// The floor plan: where every pair of stones sits. A stone is one world unit
// high and deep; x runs right, z runs toward the viewer, y is up. The island
// under the stones, and the eight places on it, come from island.js.
export { featureAnchor } from './island.js'

// The board is sized from the list. Jukugo's 9 × 8 grid wants ~65 words in
// play at once out of 1,600; a list of a few hundred spread that thin repeats
// itself within minutes. So: about one pair for every eight playable words,
// never fewer than 18 (below that it stops reading as a field), never more
// than Jukugo's 65, on cells of Jukugo's 9:8 shape. ~8% of cells are left
// empty by the layout, hence the 0.92.
const target = Math.max(18, Math.min(65, Math.round(LEXICON.length / 8)))
const cells = target / 0.92
const rows = Math.max(4, Math.round(Math.sqrt(cells / 1.125)))
export const GRID = { cols: Math.max(4, Math.round(cells / rows)), rows }

// The floor shrinks with the grid so a cell stays Jukugo's 4.67 × 3.625: the
// link reach, the deal's neighbourhood and the slab width need no change.
const x1 = (21 * GRID.cols) / 9
const z1 = (14.5 * GRID.rows) / 8
export const BOUNDS = { x0: -x1, x1, z0: -z1, z1 }

// A stone is a slab, 1.5 wide and 1 deep and high: one width for every root,
// wide enough for a five-letter root at a good size. The roll is about the
// x axis, so the width never enters it. The two stones of a word sit 0.12
// apart.
export const SLAB = 1.5
export const GAP = { h: 0.12 }

export function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// One pair per cell, every word left to right: Hawaiian is not written
// top-to-bottom, so Jukugo's vertical words are gone. A pair is 3.12 wide in
// a 4.67 cell, so the sideways jitter is kept small enough (±0.35) that two
// neighbouring words never close up into a row of four stones.
export function layoutPairs(rng) {
  const { cols, rows } = GRID
  const cw = (BOUNDS.x1 - BOUNDS.x0) / cols
  const ch = (BOUNDS.z1 - BOUNDS.z0) / rows
  const pairs = []
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      // A few holes keep the grid from reading as a grid.
      if (rng() < 0.08) continue
      const x = BOUNDS.x0 + (i + 0.5) * cw + (rng() - 0.5) * 0.7
      const z = BOUNDS.z0 + (j + 0.5) * ch + (rng() - 0.5) * 0.9
      pairs.push({ x, z, dir: 'h' })
    }
  }
  return pairs
}

// Stone centres for a pair, first root on the left.
export function tileOffsets() {
  const d = (SLAB + GAP.h) / 2
  return [
    [-d, 0],
    [d, 0],
  ]
}

// The path a root line takes between stones a and b: an octilinear route —
// horizontals, verticals and 45° diagonals, like a transit map — with its
// corners rounded off. The line's key picks one of three styles, so a floor
// full of them doesn't all bend the same way (straight-diagonal-straight,
// diagonal first, or straight first), and one of five parallel lanes. It
// lives with the floor plan because the board needs it as well as the lines:
// a line whose path would cross the upland is never made.
export function linkPath(key, a, b) {
  const lane = (hash(key) % 5) - 2
  const style = hash(key + '#') % 3
  return route(a.x, a.z, b.x, b.z, lane * 0.09, style)
}

const CORNER = 0.45

function route(ax, az, bx, bz, offset, style) {
  const dx = bx - ax
  const dz = bz - az
  const adx = Math.abs(dx)
  const adz = Math.abs(dz)
  const sx = Math.sign(dx) || 1
  const sz = Math.sign(dz) || 1
  let pts
  if (adx >= adz) {
    const run = adx - adz
    const [r0, r1] = style === 0 ? [run / 2, run / 2] : style === 1 ? [0, run] : [run, 0]
    pts = [
      [ax, az],
      [ax + sx * r0, az],
      [bx - sx * r1, bz],
      [bx, bz],
    ]
  } else {
    const run = adz - adx
    const [r0, r1] = style === 0 ? [run / 2, run / 2] : style === 1 ? [0, run] : [run, 0]
    pts = [
      [ax, az],
      [ax, az + sz * r0],
      [bx, bz - sz * r1],
      [bx, bz],
    ]
  }
  // Shift the whole route sideways a little so lines sharing a corridor sit
  // in parallel lanes instead of on top of each other.
  if (offset) {
    const len = Math.hypot(dx, dz) || 1
    const nx = -dz / len
    const nz = dx / len
    pts = pts.map(([x, z]) => [x + nx * offset, z + nz * offset])
  }
  pts = pts.filter((p, i) => i === 0 || Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) > 1e-4)
  return roundCorners(pts, CORNER)
}

function roundCorners(pts, radius) {
  if (pts.length < 3) return pts
  const out = [pts[0]]
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, pz] = pts[i - 1]
    const [cx, cz] = pts[i]
    const [nx, nz] = pts[i + 1]
    const l0 = Math.hypot(cx - px, cz - pz)
    const l1 = Math.hypot(nx - cx, nz - cz)
    const r = Math.min(radius, l0 / 2, l1 / 2)
    const a = [cx + ((px - cx) / l0) * r, cz + ((pz - cz) / l0) * r]
    const b = [cx + ((nx - cx) / l1) * r, cz + ((nz - cz) / l1) * r]
    for (let k = 0; k <= 6; k++) {
      const t = k / 6
      const u = 1 - t
      out.push([u * u * a[0] + 2 * u * t * cx + t * t * b[0], u * u * a[1] + 2 * u * t * cz + t * t * b[1]])
    }
  }
  out.push(pts.at(-1))
  return out
}

function hash(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}
