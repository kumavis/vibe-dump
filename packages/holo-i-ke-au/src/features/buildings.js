// The town's buildings, era by era, as kits: a handful of variants of each
// kind, built once in metres the way structures.js builds a hale and drawn
// instanced, many to a draw call (settlements.js places them and says which
// stands in which year).
//
// Each model stands on its ground at the origin, its front (the side the
// street is on) toward +z, its length along x, over a plinth that reaches
// FOOT metres down so a sloping lot never shows daylight under it. Colours
// are the repo's muted ones: limewash and cream, faded sage and ochre, iron
// and shingle greys, coral and brick, never a saturated paint. What the
// shader adds (kit.js): thatch courses, clapboard, masonry coursing, storeys
// of glazing on the blocks and towers, the ribs of an iron roof.
//
// The kinds, in the order the years bring them:
//
// - kauhale: two to four thatched hale on their paepae round a yard, as the
//   village at Kou is drawn (index.js), before about 1820;
// - hale: a single thatched house in the town of the early kingdom, which
//   held on beside the frame houses into the 1870s;
// - frame: the frame house of the 1820s to 1850s, a gable roof and a lanai;
// - adobe: adobe and coral block, whitewashed, a hipped roof;
// - cottage: the wood-frame house of the later kingdom, a porch in front;
// - store: false-fronted stores in a row along a street, an awning over the walk;
// - block: two- and three-storey masonry downtown;
// - bungalow: the territory's, low and broad-eaved, on short posts;
// - midrise: downtown's offices of the 1910s on, five to eight storeys;
// - house: the suburbs since the 1950s, low hipped roofs and a carport;
// - walkup: three- and four-storey apartments;
// - tower: towers, the height set per instance by the density (settlements.js);
// - church and spire: a church with a square tower, and one with a spire;
// - clock: a harbour clock tower, drawn only where the gazetteer has its place.

import { Builder, MAT, col, indexed } from './kit.js'
import { hale } from './structures.js'

// metres of plinth under every model, for the fall of a lot
const FOOT = 3

export const TOWN_PALETTE = {
  limewash: '#d6d0c0',
  cream: '#ccbf9f',
  paleGrey: '#b6b1a4',
  sage: '#959d86',
  ochre: '#b59967',
  duskRed: '#8f6152',
  paleBlue: '#98a5a4',
  shingle: '#6c665c',
  iron: '#6e706c',
  ironRed: '#7f5446',
  ironGreen: '#6f7a6a',
  coral: '#cbc1a8',
  adobe: '#b39b78',
  brick: '#97684f',
  stoneGrey: '#a19b90',
  concrete: '#c2bdb1',
  concreteWarm: '#c9bea6',
  glass: '#6a7f88',
  dark: '#4b4743',
  post: '#8a7b66',
  plinth: '#77706a',
  asphalt: '#6d6a66',
}
const P = TOWN_PALETTE

// --- pieces --------------------------------------------------------------------

/** Plinth: the ground floor's footing, from FOOT under the ground to `top`. */
function plinth(B, L, W, top, c, x = 0, z = 0) {
  B.box(x, -FOOT, z, L, top + FOOT, W, c, MAT.stone)
}

/**
 * A gable roof over an L × W box whose walls stop at `y`, its ridge `rise`
 * above, along x (or along z with `alongZ`), eaves `o` beyond the walls on
 * the slopes and `oe` beyond the gable ends; the gable ends filled in the
 * wall colour. (The eaves fall below `y` on the slope's line, so the roof
 * meets the wall tops.)
 */
function gable(B, L, W, y, rise, o, roofC, wallC, { alongZ = false, wallMat = MAT.plain, roofMat = MAT.roof, x = 0, z = 0, oe = o * 0.6 } = {}) {
  // build along x, then map (x, z) → (z, x) and keep the winding outward
  const map = alongZ ? (p) => [x + p[2], p[1], z + p[0]] : (p) => [x + p[0], p[1], z + p[2]]
  const Lr = alongZ ? W : L
  const Wr = alongZ ? L : W
  const s = rise / (Wr / 2)
  const ye = y - s * o
  const ox = Lr / 2 + oe
  const oz = Wr / 2 + o
  const e1 = map([-ox, ye, -oz])
  const e2 = map([ox, ye, -oz])
  const r1 = map([-ox, y + rise, 0])
  const r2 = map([ox, y + rise, 0])
  const f1 = map([-ox, ye, oz])
  const f2 = map([ox, ye, oz])
  const q = alongZ ? (a, b, c, d, cc, m) => B.quad(d, c, b, a, cc, m) : (a, b, c, d, cc, m) => B.quad(a, b, c, d, cc, m)
  const t = alongZ ? (a, b, c, cc, m) => B.tri(c, b, a, cc, m) : (a, b, c, cc, m) => B.tri(a, b, c, cc, m)
  q(e1, r1, r2, e2, roofC, roofMat)
  q(f2, r2, r1, f1, roofC.map((v) => v * 0.84), roofMat)
  const gx = Lr / 2
  t(map([-gx, y, -Wr / 2]), map([-gx, y, Wr / 2]), map([-gx, y + rise, 0]), wallC, wallMat)
  t(map([gx, y, Wr / 2]), map([gx, y, -Wr / 2]), map([gx, y + rise, 0]), wallC, wallMat)
}

/** A hipped roof over an L × W box (L ≥ W) whose walls stop at `y`. */
function hip(B, L, W, y, rise, o, roofC, { roofMat = MAT.roof, x = 0, z = 0 } = {}) {
  const s = rise / (W / 2)
  const ye = y - s * o
  const X = L / 2 + o
  const Z = W / 2 + o
  const rx = Math.max(0, (L - W) / 2)
  const E = (sx, sz) => [x + sx * X, ye, z + sz * Z]
  const R = (sx) => [x + sx * rx, y + rise, z]
  const shade = roofC.map((v) => v * 0.84)
  B.quad(E(-1, -1), R(-1), R(1), E(1, -1), roofC, roofMat)
  B.quad(E(1, 1), R(1), R(-1), E(-1, 1), shade, roofMat)
  B.tri(E(-1, 1), R(-1), E(-1, -1), roofC.map((v) => v * 0.92), roofMat)
  B.tri(E(1, -1), R(1), E(1, 1), roofC.map((v) => v * 0.92), roofMat)
}

/** A pyramid cap on a square of side `a` at height y, `h` high. */
function pyramid(B, a, y, h, c, x = 0, z = 0, mat = MAT.roof) {
  const k = a / 2
  const top = [x, y + h, z]
  const E = (sx, sz) => [x + sx * k, y, z + sz * k]
  B.tri(E(-1, -1), top, E(1, -1), c, mat)
  B.tri(E(1, 1), top, E(-1, 1), c.map((v) => v * 0.84), mat)
  B.tri(E(-1, 1), top, E(-1, -1), c.map((v) => v * 0.92), mat)
  B.tri(E(1, -1), top, E(1, 1), c.map((v) => v * 0.92), mat)
}

/**
 * A lanai or porch along the front (+z) of a box W deep: its floor at
 * `floor`, `depth` out, `width` across, under a lean-to from `hi` at the wall
 * to `lo` at its edge, on two posts or more.
 */
function lanai(B, width, W, depth, floor, hi, lo, roofC, postC, { posts = 2, x = 0 } = {}) {
  const z0 = W / 2
  const z1 = z0 + depth
  B.box(x, floor - 0.35, (z0 + z1) / 2, width, 0.35, depth, postC, MAT.wood)
  const a = [x - width / 2 - 0.2, hi, z0]
  const b = [x + width / 2 + 0.2, hi, z0]
  const c = [x + width / 2 + 0.2, lo, z1 + 0.3]
  const d = [x - width / 2 - 0.2, lo, z1 + 0.3]
  B.quad(a, d, c, b, roofC, MAT.roof)
  for (let k = 0; k < posts; k++) {
    const px = x - width / 2 + 0.3 + ((width - 0.6) * k) / Math.max(1, posts - 1)
    B.box(px, floor, z1 - 0.2, 0.28, lo - floor, 0.28, postC, MAT.wood)
  }
}

/** A dark doorway on the front face (z = W/2) of a box, `w` wide, `h` high. */
function door(B, W, w, h, y0 = 0, x = 0) {
  const z = W / 2 + 0.03
  B.quad([x - w / 2, y0, z], [x + w / 2, y0, z], [x + w / 2, y0 + h, z], [x - w / 2, y0 + h, z], col(P.dark, 0), MAT.plain)
}

// --- the kinds -------------------------------------------------------------------

/**
 * The hale of a kauhale, four sizes from the sleeping house down to the
 * cookhouse, each on its own paepae reaching FOOT down, as a platform on a
 * slope is built up on its low side. Each stands on its own ground
 * (settlements.js), so a kauhale can sit on a valley's side or beside the
 * loʻi as Kou's do (index.js). (Kou's have an imu beside them; at the
 * scatter's distances its stones would be a hundred triangles under a pixel.)
 */
const HALE_SIZES = [
  [8.2, 5.0, 5.6],
  [7.0, 4.6, 5.0],
  [6.0, 4.2, 4.6],
  [5.2, 4.0, 4.4],
]
function kauhaleHale(rand, [L, W, H]) {
  const B = new Builder()
  hale(B, rand, L, W, H, true, FOOT)
  return B
}

/** Kauhale: which hale stand round the yard, and where (metres from its middle; a turn; a size). */
export const KAUHALE = [
  [[0, 0, 0.3, 0], [9.5, 3.5, 1.9, 2], [-3.5, 9.0, 2.6, 3]],
  [[0, 0, 1.2, 0], [-9.5, -2.5, 1.0, 3]],
  [[0, 0, 0.0, 1], [9.0, -4.5, 1.6, 2], [-8.5, 4.5, 0.4, 2], [3.0, 10.0, 1.4, 3]],
  [[0, 0, 2.2, 1], [0.5, 9.5, 2.0, 2], [9.0, 5.0, 0.6, 3]],
]

/** A single thatched house of the town, on a low paepae, a cookhouse behind. */
function thatchHouse(rand, v) {
  const B = new Builder()
  B.at(0, 0, 0, Math.PI / 2, 1)
  hale(B, rand, 7.2 + v, 4.8, 5.2, true, FOOT)
  B.done()
  B.at(v ? -4.5 : 4.5, 0, -6.5, 0, 1)
  hale(B, rand, 4.4, 3.4, 3.6, false, FOOT)
  B.done()
  return B
}

/** Frame houses of the early kingdom: limewashed boards, shingle gables, a lanai. */
function frameHouse(rand, v) {
  const B = new Builder()
  const wall = col([P.limewash, P.cream, P.paleGrey][v], 0.06, rand)
  const roof = col(P.shingle, 0.1, rand)
  const post = col(P.post, 0.1, rand)
  if (v === 0) {
    const L = 9
    const W = 7
    plinth(B, L + 0.4, W + 0.4, 0.6, col(P.plinth, 0.1, rand))
    B.box(0, 0.6, 0, L, 3.0, W, wall, MAT.clap)
    gable(B, L, W, 3.6, 2.6, 0.5, roof, wall, { wallMat: MAT.clap })
    lanai(B, L, W, 2.2, 0.6, 3.3, 2.7, roof, post)
    door(B, W, 1.1, 2.1, 0.6)
  } else if (v === 1) {
    const L = 8
    const W = 6.5
    plinth(B, L + 0.4, W + 0.4, 0.5, col(P.plinth, 0.1, rand))
    B.box(0, 0.5, 0, L, 5.8, W, wall, MAT.clap)
    gable(B, L, W, 6.3, 2.4, 0.5, roof, wall, { wallMat: MAT.clap })
    lanai(B, L, W, 2.0, 3.4, 6.0, 5.6, roof, post)
    lanai(B, L, W, 2.0, 0.5, 3.4, 3.1, roof, post)
  } else {
    const L = 10
    const W = 7
    plinth(B, L + 0.4, W + 0.4, 0.6, col(P.plinth, 0.1, rand))
    B.box(0, 0.6, 0, L, 2.9, W, wall, MAT.clap)
    hip(B, L, W, 3.5, 2.2, 0.6, roof)
    lanai(B, L - 1.5, W, 2.3, 0.6, 3.2, 2.6, roof, post, { posts: 3 })
  }
  return B
}

/** Adobe under thatch, and the two-storey coral block with its verandah. */
function adobeHouse(rand, v) {
  const B = new Builder()
  if (v === 0) {
    const L = 9
    const W = 6
    const wall = col(P.adobe, 0.08, rand)
    plinth(B, L + 0.6, W + 0.6, 0.3, col(P.plinth, 0.1, rand))
    B.box(0, 0.3, 0, L, 2.8, W, wall, MAT.masonry)
    hip(B, L, W, 3.1, 2.8, 0.7, col('#a58a5c', 0.12, rand), { roofMat: MAT.thatch })
    door(B, W, 1.1, 2.0, 0.3)
  } else {
    const L = 11
    const W = 8
    const wall = col(P.coral, 0.06, rand)
    plinth(B, L + 0.4, W + 0.4, 0.4, col(P.plinth, 0.1, rand))
    B.box(0, 0.4, 0, L, 6.4, W, wall, MAT.masonry)
    hip(B, L, W, 6.8, 2.0, 0.5, col(P.shingle, 0.1, rand))
    lanai(B, L, W, 2.2, 3.6, 6.4, 6.0, col(P.shingle, 0.1, rand), col(P.post, 0.1, rand), { posts: 3 })
    lanai(B, L, W, 2.2, 0.4, 3.6, 3.2, col(P.shingle, 0.1, rand), col(P.post, 0.1, rand), { posts: 3 })
  }
  return B
}

/** The wood-frame house of the later kingdom: a porch across the front. */
function cottage(rand, v) {
  const B = new Builder()
  const wall = col([P.limewash, P.sage, P.cream][v], 0.06, rand)
  const roof = col([P.iron, P.ironRed, P.ironGreen][v], 0.08, rand)
  const post = col(P.limewash, 0.05, rand)
  plinth(B, 9.4, 8.4, 0.9, col(P.plinth, 0.1, rand))
  if (v === 1) {
    // (an L: a wing forward on one side, its own gable to the street)
    B.box(-1.5, 0.9, -1, 7, 3.1, 6, wall, MAT.clap)
    gable(B, 7, 6, 4.0, 2.5, 0.5, roof, wall, { wallMat: MAT.clap, x: -1.5, z: -1 })
    B.box(2.6, 0.9, 1.0, 4, 3.1, 7, wall, MAT.clap)
    gable(B, 4, 7, 4.0, 2.0, 0.45, roof, wall, { wallMat: MAT.clap, alongZ: true, x: 2.6, z: 1.0 })
    lanai(B, 4.5, 4, 2.0, 0.9, 3.7, 3.2, roof, post, { x: -2.3 })
  } else {
    const L = 9
    const W = 7.5
    B.box(0, 0.9, 0, L, 3.1, W, wall, MAT.clap)
    if (v === 0) gable(B, L, W, 4.0, 2.7, 0.5, roof, wall, { wallMat: MAT.clap })
    else hip(B, L, W, 4.0, 2.4, 0.55, roof)
    lanai(B, L, W, 2.4, 0.9, 3.8, 3.2, roof, post, { posts: 3 })
    door(B, W, 1.0, 2.2, 0.9)
  }
  return B
}

/** Stores in a row, each with its false front to the street and an awning over the walk. */
function storeRow(rand, n) {
  const B = new Builder()
  const w = 6
  const D = 13
  const fronts = [P.cream, P.limewash, P.ochre, P.paleBlue, P.sage, P.duskRed]
  const awning = col(P.iron, 0.1, rand)
  const post = col(P.post, 0.1, rand)
  plinth(B, n * w + 0.4, D + 0.4, 0.3, col(P.plinth, 0.1, rand))
  for (let k = 0; k < n; k++) {
    const x = (k - (n - 1) / 2) * w
    const fc = col(fronts[Math.floor(rand() * fronts.length)], 0.08, rand)
    const h = 4.2 + rand() * 1.4
    B.box(x, 0.3, 0, w - 0.15, h, D, fc, MAT.clap)
    // the roof behind the front, falling to the back
    const a = [x - w / 2, 0.3 + h - 0.2, D / 2 - 0.6]
    const b = [x + w / 2, 0.3 + h - 0.2, D / 2 - 0.6]
    const c = [x + w / 2, 0.3 + h - 1.3, -D / 2 - 0.4]
    const d = [x - w / 2, 0.3 + h - 1.3, -D / 2 - 0.4]
    B.quad(a, b, c, d, col(P.iron, 0.1, rand), MAT.roof)
    // the false front, standing above the roof
    B.box(x, 0.3 + h - 0.2, D / 2 - 0.2, w - 0.15, 1.6 + rand() * 1.0, 0.35, fc, MAT.clap)
    door(B, D, 1.6, 2.4, 0.3, x)
  }
  lanai(B, n * w, D, 2.6, 0.3, 3.4, 3.1, awning, post, { posts: n + 1 })
  return B
}

/** A masonry block of two or three storeys, flat-roofed behind a parapet and cornice. */
function masonryBlock(rand, v) {
  const B = new Builder()
  const storeys = [2, 3, 3][v]
  const L = [14, 13, 15][v]
  const W = [13, 14, 12][v]
  const h = 0.4 + storeys * 3.7
  const wall = col([P.brick, P.stoneGrey, P.concreteWarm][v], 0.07, rand)
  plinth(B, L + 0.3, W + 0.3, 0.4, col(P.plinth, 0.1, rand))
  B.box(0, 0.4, 0, L, h - 0.4, W, wall, MAT.windows)
  // cornice and parapet
  B.box(0, h, 0, L + 0.5, 0.45, W + 0.5, wall.map((c) => c * 0.86), MAT.masonry)
  B.box(0, h + 0.45, 0, L, 0.6, W, wall.map((c) => c * 0.95), MAT.masonry)
  B.box(0, h + 0.2, 0, L - 1.2, 0.3, W - 1.2, col(P.asphalt, 0.1, rand), MAT.plain)
  if (v === 2) lanai(B, L, W, 2.5, 0.4, 4.0, 3.8, col(P.iron, 0.1, rand), col(P.dark, 0.1, rand), { posts: 4 })
  return B
}

/** The territory's bungalow: low, broad eaves, a lanai under the same roof, on short posts. */
function bungalow(rand, v) {
  const B = new Builder()
  const wall = col([P.cream, P.sage, P.paleGrey][v], 0.07, rand)
  const roof = col([P.ironGreen, P.iron, P.ironRed][v], 0.1, rand)
  const L = [11, 10, 12][v]
  const W = [9, 9.5, 8][v]
  plinth(B, L, W, 0.8, col(P.plinth, 0.1, rand))
  B.box(0, 0.8, 0, L, 2.8, W, wall, MAT.clap)
  if (v === 1) {
    gable(B, L, W, 3.6, 2.0, 0.9, roof, wall, { wallMat: MAT.clap })
    lanai(B, 6, W, 2.6, 0.8, 3.4, 2.9, roof, col(P.limewash, 0.05, rand), { x: -1.5 })
  } else {
    hip(B, L + 1.6, W + 2.6, 3.6, 1.8, 0.9, roof, { z: 1.3 })
    B.box(0, 0.8, W / 2 + 1.3, L - 0.4, 0.2, 2.4, col(P.post, 0.1, rand), MAT.wood)
  }
  return B
}

/** Downtown's offices from the 1910s: five to eight storeys, a cornice. */
function midrise(rand, v) {
  const B = new Builder()
  const storeys = [6, 8][v]
  const L = [15, 14][v]
  const W = [14, 15][v]
  const h = storeys * 3.6
  const wall = col([P.concreteWarm, P.stoneGrey][v], 0.06, rand)
  plinth(B, L + 0.3, W + 0.3, 0.3, col(P.plinth, 0.1, rand))
  B.box(0, 0.3, 0, L, 4.4, W, wall.map((c) => c * 0.9), MAT.masonry)
  B.box(0, 4.7, 0, L, h - 4.4, W, wall, MAT.windows)
  B.box(0, h + 0.3, 0, L + 0.6, 0.6, W + 0.6, wall.map((c) => c * 0.85), MAT.masonry)
  B.box(-L / 4, h + 0.9, -W / 5, 3.5, 2.2, 3.5, wall.map((c) => c * 0.9), MAT.plain)
  return B
}

/** The suburbs: a single-storey house under a low hipped roof, a carport beside. */
function suburbHouse(rand, v) {
  const B = new Builder()
  const wall = col([P.limewash, P.concreteWarm, P.paleBlue][v], 0.07, rand)
  const roof = col([P.iron, P.shingle, P.ironGreen][v], 0.1, rand)
  if (v === 2) {
    const L = 9
    const W = 8
    plinth(B, L, W, 0.3, col(P.plinth, 0.1, rand))
    B.box(0, 0.3, 0, L, 5.4, W, wall, MAT.plain)
    gable(B, L, W, 5.7, 1.4, 0.6, roof, wall)
    return B
  }
  const L = 14
  const W = 9
  plinth(B, L, W, 0.3, col(P.plinth, 0.1, rand))
  B.box(-1.5, 0.3, 0, L - 3, 2.7, W, wall, MAT.plain)
  hip(B, L - 3, W, 3.0, 1.3, 0.8, roof, { x: -1.5 })
  // the carport, a flat roof on two posts
  B.box(L / 2 - 1.5, 2.6, 0.5, 3.2, 0.25, W - 1, roof.map((c) => c * 0.9), MAT.plain)
  B.box(L / 2 - 0.1, 0.3, W / 2 - 1, 0.25, 2.3, 0.25, wall, MAT.plain)
  if (v === 1) B.box(-3.5, 0.3, -W / 2 - 1.4, 5, 2.4, 2.8, wall.map((c) => c * 0.95), MAT.plain)
  return B
}

/** Three- and four-storey walk-ups, the walkways along the front. */
function walkup(rand, v) {
  const B = new Builder()
  const storeys = [3, 4][v]
  const L = 20
  const W = 10
  const h = storeys * 3.1
  const wall = col([P.concrete, P.cream][v], 0.06, rand)
  plinth(B, L, W + 2, 0.3, col(P.plinth, 0.1, rand))
  B.box(0, 0.3, -0.8, L, h, W - 1.6, wall, MAT.windows)
  for (let k = 1; k <= storeys; k++) B.box(0, 0.3 + k * 3.1 - 0.3, W / 2 - 0.4, L, 0.3, 1.6, wall.map((c) => c * 0.9), MAT.plain)
  hip(B, L, W - 1.6, h + 0.3, 1.2, 0.4, col(P.iron, 0.1, rand), { z: -0.8 })
  return B
}

/**
 * Towers, 60 m tall as built (the instance's y-scale sets the height): a
 * hotel slab, a square tower, and a tower on a podium.
 */
export const TOWER_H = 60
function tower(rand, v) {
  const B = new Builder()
  const wall = col([P.concrete, P.concreteWarm, P.limewash][v], 0.06, rand)
  const glassy = wall.map((c, i) => c * 0.75 + col(P.glass, 0, rand)[i] * 0.25)
  if (v === 0) {
    B.box(0, -FOOT * 3, 0, 32, FOOT * 3 + 6, 18, wall.map((c) => c * 0.9), MAT.masonry)
    B.box(0, 6, 0, 30, TOWER_H - 6, 13, glassy, MAT.windows)
    B.box(0, TOWER_H, 0, 30.6, 1.2, 13.6, wall.map((c) => c * 0.85), MAT.plain)
  } else if (v === 1) {
    B.box(0, -FOOT * 3, 0, 22, FOOT * 3 + 1, 22, wall.map((c) => c * 0.9), MAT.masonry)
    B.box(0, 1, 0, 20, TOWER_H - 1, 20, glassy, MAT.windows)
    B.box(0, TOWER_H, 0, 8, 3, 8, wall.map((c) => c * 0.8), MAT.plain)
  } else {
    B.box(0, -FOOT * 3, 0, 28, FOOT * 3 + 9, 26, wall.map((c) => c * 0.88), MAT.windows)
    B.box(-2, 9, -2, 17, TOWER_H - 9, 16, glassy, MAT.windows)
    B.box(-2, TOWER_H, -2, 17.6, 1.0, 16.6, wall.map((c) => c * 0.85), MAT.plain)
  }
  return B
}

/** A church of coral block with a square tower at its front (the first stood in 1842). */
function towerChurch(rand) {
  const B = new Builder()
  const wall = col(P.coral, 0.04, rand)
  const roof = col(P.shingle, 0.08, rand)
  const L = 24
  const W = 44
  plinth(B, L + 1, W + 1, 0.8, col(P.plinth, 0.08, rand))
  B.box(0, 0.8, -2, L, 9.2, W - 4, wall, MAT.masonry)
  gable(B, L, W - 4, 10, 6.5, 0.6, roof, wall, { alongZ: true, wallMat: MAT.masonry, z: -2 })
  // the tower at the front, its top stepped in, a low cap
  B.box(0, 0.8, W / 2 - 4, 9, 22, 8, wall, MAT.masonry)
  B.box(0, 22.8, W / 2 - 4, 9.6, 0.8, 8.6, wall.map((c) => c * 0.88), MAT.masonry)
  for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) B.box(sx * 4, 23.6, W / 2 - 4 + sz * 3.5, 1.2, 1.4, 1.2, wall, MAT.masonry)
  door(B, W, 2.2, 4, 0.8)
  return B
}

/** A white frame church with a spire over its door. */
function spireChurch(rand) {
  const B = new Builder()
  const wall = col(P.limewash, 0.03, rand)
  const roof = col(P.iron, 0.08, rand)
  const L = 13
  const W = 24
  plinth(B, L + 0.6, W + 0.6, 0.8, col(P.plinth, 0.08, rand))
  B.box(0, 0.8, -1, L, 6.4, W - 2, wall, MAT.clap)
  gable(B, L, W - 2, 7.2, 4.6, 0.5, roof, wall, { alongZ: true, wallMat: MAT.clap, z: -1 })
  B.box(0, 0.8, W / 2 - 1.5, 4.5, 14, 4.5, wall, MAT.clap)
  pyramid(B, 4.8, 14.8, 12, roof, 0, W / 2 - 1.5)
  return B
}

/** A harbour clock tower: a square shaft, the clock stage, a pyramid and a mast. */
function clockTower(rand) {
  const B = new Builder()
  const wall = col(P.concreteWarm, 0.03, rand)
  plinth(B, 14, 14, 0.5, col(P.plinth, 0.08, rand))
  B.box(0, 0.5, 0, 12, 40, 12, wall, MAT.windows)
  B.box(0, 40.5, 0, 13, 6, 13, wall.map((c) => c * 0.93), MAT.masonry)
  pyramid(B, 13, 46.5, 7, col(P.ironGreen, 0.05, rand))
  B.cyl([0, 53.5, 0], [0, 60, 0], 0.25, 0.15, col(P.dark, 0), MAT.plain, 4)
  return B
}

// --- the kits --------------------------------------------------------------------

/**
 * Each kind with its variants' geometry (indexed) and footprint: `hx`, `hz`
 * the half extents in model metres, so settlements.js can fit them to a lot
 * and clear the ground under them. `pads` gives, for the kinds that have one,
 * the lot's size in their own metres: the city's lots are paved to their
 * edges.
 */
export function buildKits(rand, pads = {}) {
  const out = {}
  const add = (kind, builders) => {
    out[kind] = builders.map((B) => {
      // (the footprint is the building's own, not its paving's)
      const own = indexed(B.geometry())
      own.computeBoundingBox()
      const ob = own.boundingBox
      own.dispose()
      if (pads[kind]) B.box(0, -FOOT, 0, pads[kind][0], FOOT + 0.12, pads[kind][1], col(P.concrete, 0.05, rand).map((c) => c * 0.88), MAT.plain)
      const g = indexed(B.geometry())
      return { geometry: g, hx: Math.max(-ob.min.x, ob.max.x), hz: Math.max(-ob.min.z, ob.max.z), top: ob.max.y, tris: g.index.count / 3 }
    })
  }
  add('kauhale', HALE_SIZES.map((h) => kauhaleHale(rand, h)))
  add('hale', [0, 1].map((v) => thatchHouse(rand, v)))
  add('frame', [0, 1, 2].map((v) => frameHouse(rand, v)))
  add('adobe', [0, 1].map((v) => adobeHouse(rand, v)))
  add('cottage', [0, 1, 2].map((v) => cottage(rand, v)))
  add('store', [3, 2].map((n) => storeRow(rand, n)))
  add('block', [0, 1, 2].map((v) => masonryBlock(rand, v)))
  add('bungalow', [0, 1, 2].map((v) => bungalow(rand, v)))
  add('midrise', [0, 1].map((v) => midrise(rand, v)))
  add('house', [0, 1, 2].map((v) => suburbHouse(rand, v)))
  add('walkup', [0, 1].map((v) => walkup(rand, v)))
  add('tower', [0, 1, 2].map((v) => tower(rand, v)))
  add('church', [towerChurch(rand)])
  add('spire', [spireChurch(rand)])
  add('clock', [clockTower(rand)])
  return out
}
