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
// - clock: a harbour clock tower, drawn only where the gazetteer has its place;
// - shed: warehouses, sawtooth works and hangars, where the zoning of now
//   says industrial (DATA.md "Zoning, for the settlements"), a farm's shed
//   on agricultural land.
//
// And apart from the town's, the works' own (worksKits): hangars, barracks,
// low blocks and concrete blocks, where the works file has a base's or an
// airfield's buildings (features/works.js).
//
// No two faces of a model lie in one plane where they overlap, since two
// such faces fight over the depth buffer and flicker as the camera moves: a
// lanai's floor starts where the plinth ends rather than on top of it, a
// false front stands on its wall rather than over it, a door stands a hand's
// breadth proud of its wall, and every model fits its lot (settlements.js
// scales what would not, so neighbours never meet).

import { Builder, MAT, col, indexed } from './kit.js'
import { hale } from './structures.js'

// metres of plinth under every model, for the fall of a lot (at the
// smallest scale a kind is drawn at, more than the fall its lot may take)
const FOOT = 4

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
 * to `lo` at its edge, on two posts or more. The floor starts at `from` (the
 * plinth's front edge, where there is one: a floor laid over the plinth's
 * top at the same height would fight it for every pixel they share).
 */
function lanai(B, width, W, depth, floor, hi, lo, roofC, postC, { posts = 2, x = 0, from = W / 2 } = {}) {
  const z0 = W / 2
  const z1 = z0 + depth
  if (z1 - from > 0.05) B.box(x, floor - 0.35, (from + z1) / 2, width, 0.35, z1 - from, postC, MAT.wood)
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

/**
 * A dark doorway on the front face (z = W/2) of a box, `w` wide, `h` high:
 * a shallow dark block standing 30 cm proud of the wall, its sides dark as
 * its face. (As a sheet 3 cm off the wall it fought the wall from a
 * kilometre off, and at 12 cm still did from the low views: the depth
 * buffer's step there is several centimetres of the drawn scale.)
 */
function door(B, W, w, h, y0 = 0, x = 0) {
  B.box(x, y0, W / 2 + 0.15, w, h, 0.3, col(P.dark, 0), MAT.plain)
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

/**
 * Kauhale: which hale stand round the yard, and where (metres from its
 * middle, x along the street and z across it; a turn; a size). Each yard
 * keeps within the four lots it is given (settlements.js), about 21 by 23
 * metres at the scale they are drawn, and no two paepae meet: two platforms
 * of one height overlapping would fight over every pixel they share.
 */
export const KAUHALE = [
  [[-3.0, -4.0, 0.06, 0], [5.6, -2.8, 1.64, 2], [-3.4, 4.6, 0.12, 3]],
  [[-1.6, -2.6, 0.15, 0], [4.2, 4.4, 1.45, 3]],
  [[-4.2, -4.2, -0.05, 1], [4.6, -3.6, 1.6, 2], [-4.8, 4.0, 1.5, 2], [3.6, 4.4, 0.08, 3]],
  [[0.2, -3.5, 0.04, 1], [-4.0, 4.0, -0.06, 2], [4.6, 3.6, 1.62, 3]],
]

/**
 * A single thatched house of the town, on a low paepae toward the back of
 * its lot, and its small cookhouse at the front corner, turned to the lane.
 */
function thatchHouse(rand, v) {
  const B = new Builder()
  B.at(0, 0, -2.2, 0, 1)
  hale(B, rand, 6.8 + v * 0.6, 4.6, 5.2, true, FOOT)
  B.done()
  B.at(v ? -2.6 : 2.6, 0, 4.6, Math.PI / 2, 1)
  hale(B, rand, 3.6, 2.8, 3.4, false, FOOT)
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
    lanai(B, L, W, 2.2, 0.6, 3.3, 2.7, roof, post, { from: W / 2 + 0.2 })
    door(B, W, 1.1, 2.1, 0.6)
  } else if (v === 1) {
    const L = 8
    const W = 6.5
    plinth(B, L + 0.4, W + 0.4, 0.5, col(P.plinth, 0.1, rand))
    B.box(0, 0.5, 0, L, 5.8, W, wall, MAT.clap)
    gable(B, L, W, 6.3, 2.4, 0.5, roof, wall, { wallMat: MAT.clap })
    // (the upper lanai's roof well under the gable's eaves, never along them)
    lanai(B, L, W, 2.0, 3.4, 5.8, 5.4, roof, post)
    lanai(B, L, W, 2.0, 0.5, 3.4, 3.1, roof, post, { from: W / 2 + 0.2 })
  } else {
    const L = 9.6
    const W = 7
    plinth(B, L + 0.4, W + 0.4, 0.6, col(P.plinth, 0.1, rand))
    B.box(0, 0.6, 0, L, 2.9, W, wall, MAT.clap)
    hip(B, L, W, 3.5, 2.2, 0.5, roof)
    lanai(B, L - 1.5, W, 2.3, 0.6, 3.2, 2.6, roof, post, { posts: 3, from: W / 2 + 0.2 })
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
    const L = 10.4
    const W = 8
    const wall = col(P.coral, 0.06, rand)
    plinth(B, L + 0.4, W + 0.4, 0.4, col(P.plinth, 0.1, rand))
    B.box(0, 0.4, 0, L, 6.4, W, wall, MAT.masonry)
    hip(B, L, W, 6.8, 2.0, 0.4, col(P.shingle, 0.1, rand))
    lanai(B, L, W, 2.2, 3.6, 6.4, 6.0, col(P.shingle, 0.1, rand), col(P.post, 0.1, rand), { posts: 3 })
    lanai(B, L, W, 2.2, 0.4, 3.6, 3.2, col(P.shingle, 0.1, rand), col(P.post, 0.1, rand), { posts: 3, from: W / 2 + 0.2 })
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
    // (an L: a wing forward on one side, its own gable to the street; the
    // wing's walls, foot and top stand a little off the main block's, never
    // in its planes)
    B.box(-1.5, 0.9, -1, 7, 3.1, 6, wall, MAT.clap)
    gable(B, 7, 6, 4.0, 2.5, 0.5, roof, wall, { wallMat: MAT.clap, x: -1.5, z: -1 })
    B.box(2.6, 0.85, 1.05, 4, 3.1, 6.9, wall, MAT.clap)
    gable(B, 4, 6.9, 3.95, 2.0, 0.45, roof, wall, { wallMat: MAT.clap, alongZ: true, x: 2.6, z: 1.05 })
    // (its porch stands on the plinth: no floor of its own over the plinth's top)
    lanai(B, 4.5, 4, 2.0, 0.9, 3.7, 3.2, roof, post, { x: -2.3, from: 4.2 })
  } else {
    const L = 9
    const W = 7.5
    B.box(0, 0.9, 0, L, 3.1, W, wall, MAT.clap)
    if (v === 0) gable(B, L, W, 4.0, 2.7, 0.5, roof, wall, { wallMat: MAT.clap })
    else hip(B, L, W, 4.0, 2.4, 0.55, roof)
    lanai(B, L, W, 2.4, 0.9, 3.8, 3.2, roof, post, { posts: 3, from: 4.2 })
    door(B, W, 1.0, 2.2, 0.9)
  }
  return B
}

/**
 * Stores in a row, each with its false front to the street and an awning
 * over the walk: two in a row, or one wider. The false front stands on its
 * wall's top, not over the wall's face.
 */
function storeRow(rand, n, w = 5.8) {
  const B = new Builder()
  const D = 12
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
    const a = [x - w / 2 + 0.075, 0.3 + h - 0.2, D / 2 - 0.6]
    const b = [x + w / 2 - 0.075, 0.3 + h - 0.2, D / 2 - 0.6]
    const c = [x + w / 2 - 0.075, 0.3 + h - 1.3, -D / 2 - 0.4]
    const d = [x - w / 2 + 0.075, 0.3 + h - 1.3, -D / 2 - 0.4]
    B.quad(a, b, c, d, col(P.iron, 0.1, rand), MAT.roof)
    // the false front, standing above the roof on the wall's top
    B.box(x, 0.3 + h, D / 2 - 0.175, w - 0.15, 1.4 + rand() * 1.0, 0.35, fc, MAT.clap)
    door(B, D, 1.6, 2.4, 0.3, x)
  }
  lanai(B, n * w, D, 2.6, 0.3, 3.4, 3.1, awning, post, { posts: n + 1, from: D / 2 + 0.2 })
  return B
}

/** A masonry block of two or three storeys, flat-roofed behind a parapet and cornice. */
function masonryBlock(rand, v) {
  const B = new Builder()
  const storeys = [2, 3, 3][v]
  const L = [11, 10.5, 11.2][v]
  const W = [12, 13, 11][v]
  const h = 0.4 + storeys * 3.7
  const wall = col([P.brick, P.stoneGrey, P.concreteWarm][v], 0.07, rand)
  plinth(B, L + 0.3, W + 0.3, 0.4, col(P.plinth, 0.1, rand))
  B.box(0, 0.4, 0, L, h - 0.4, W, wall, MAT.windows)
  // cornice and parapet (the parapet's top is the roof seen from above)
  B.box(0, h, 0, L + 0.5, 0.45, W + 0.5, wall.map((c) => c * 0.86), MAT.masonry)
  B.box(0, h + 0.45, 0, L, 0.6, W, wall.map((c) => c * 0.95), MAT.masonry)
  if (v === 2) lanai(B, L, W, 2.5, 0.4, 4.0, 3.8, col(P.iron, 0.1, rand), col(P.dark, 0.1, rand), { posts: 4, from: W / 2 + 0.15 })
  return B
}

/** The territory's bungalow: low, broad eaves, a lanai under the same roof, on short posts. */
function bungalow(rand, v) {
  const B = new Builder()
  const wall = col([P.cream, P.sage, P.paleGrey][v], 0.07, rand)
  const roof = col([P.ironGreen, P.iron, P.ironRed][v], 0.1, rand)
  const L = [9.8, 10, 10.2][v]
  const W = [8.6, 9.5, 8][v]
  plinth(B, L, W, 0.8, col(P.plinth, 0.1, rand))
  B.box(0, 0.8, 0, L, 2.8, W, wall, MAT.clap)
  if (v === 1) {
    gable(B, L, W, 3.6, 2.0, 0.8, roof, wall, { wallMat: MAT.clap })
    lanai(B, 6, W, 2.6, 0.8, 3.4, 2.9, roof, col(P.limewash, 0.05, rand), { x: -1.5 })
  } else {
    hip(B, L + 1.2, W + 2.4, 3.6, 1.8, 0.7, roof, { z: 1.2 })
    B.box(0, 0.8, W / 2 + 1.25, L - 0.4, 0.2, 2.3, col(P.post, 0.1, rand), MAT.wood)
  }
  return B
}

/** Downtown's offices from the 1910s: five to eight storeys, a cornice. */
function midrise(rand, v) {
  const B = new Builder()
  const storeys = [6, 8][v]
  const L = [13.6, 13][v]
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
  const L = 11.5
  const W = 9
  plinth(B, L, W, 0.3, col(P.plinth, 0.1, rand))
  B.box(-1.5, 0.3, 0, L - 3, 2.7, W, wall, MAT.plain)
  hip(B, L - 3, W, 3.0, 1.3, 0.7, roof, { x: -1.5 })
  // the carport, a flat roof on two posts
  B.box(L / 2 - 1.5, 2.6, 0.4, 3.2, 0.25, W - 1.2, roof.map((c) => c * 0.9), MAT.plain)
  B.box(L / 2 - 0.1, 0.3, W / 2 - 1, 0.25, 2.3, 0.25, wall, MAT.plain)
  // (and an annex behind, on its own footing to the ground)
  if (v === 1) B.box(-3.2, -FOOT, -W / 2 - 1.4, 4.4, FOOT + 2.7, 2.8, wall.map((c) => c * 0.95), MAT.plain)
  return B
}

/** Three- and four-storey walk-ups, the walkways along the front. */
function walkup(rand, v) {
  const B = new Builder()
  const storeys = [3, 4][v]
  const L = 18.4
  const W = 10
  const h = storeys * 3.1
  const wall = col([P.concrete, P.cream][v], 0.06, rand)
  // (its plinth well over its paving: the two tops never within the depth buffer's step)
  plinth(B, L, W + 2, 0.6, col(P.plinth, 0.1, rand))
  B.box(0, 0.6, -0.8, L, h, W - 1.6, wall, MAT.windows)
  for (let k = 1; k <= storeys; k++) B.box(0, 0.6 + k * 3.1 - 0.3, W / 2 - 0.4, L - 0.3, 0.3, 1.6, wall.map((c) => c * 0.9), MAT.plain)
  hip(B, L, W - 1.6, h + 0.6, 1.2, 0.4, col(P.iron, 0.1, rand), { z: -0.8 })
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
    B.box(0, -FOOT * 3, 0, 29, FOOT * 3 + 6, 18, wall.map((c) => c * 0.9), MAT.masonry)
    B.box(0, 6, 0, 27, TOWER_H - 6, 13, glassy, MAT.windows)
    B.box(0, TOWER_H, 0, 27.6, 1.2, 13.6, wall.map((c) => c * 0.85), MAT.plain)
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

/**
 * Sheds, where the zoning of now says industrial or military, or a farm's
 * on agricultural land: a warehouse under a low gable of iron, a works under
 * a sawtooth roof, a hangar's broad low vault (as a shallow gable). Iron,
 * concrete and paint gone chalky in the sun.
 */
function shed(rand, v) {
  const B = new Builder()
  const wall = col([P.concrete, P.paleGrey, P.stoneGrey][v], 0.08, rand)
  const roof = col([P.iron, P.ironGreen, P.iron][v], 0.1, rand)
  const L = [12, 12.2, 11.6][v]
  const W = [12.5, 12, 13][v]
  plinth(B, L + 0.3, W + 0.3, 0.25, col(P.plinth, 0.1, rand))
  if (v === 1) {
    // the sawtooth: three bays, each a steep glazed face and a long slope behind
    const h = 4.6
    B.box(0, 0.25, 0, L, h, W, wall, MAT.plain)
    const n = 3
    const bw = W / n
    for (let k = 0; k < n; k++) {
      const z0 = -W / 2 + k * bw
      const z1 = z0 + bw
      const y0 = 0.25 + h
      const y1 = y0 + 2.2
      const xa = -L / 2
      const xb = L / 2
      // the slope, from the low back to the high front of the bay; the glazed face; the bay's two ends
      B.quad([xa, y0, z0], [xa, y1, z1], [xb, y1, z1], [xb, y0, z0], roof, MAT.roof)
      B.quad([xa, y1, z1], [xa, y0, z1], [xb, y0, z1], [xb, y1, z1], col(P.glass, 0.05, rand), MAT.plain)
      B.tri([xa, y0, z0], [xa, y0, z1], [xa, y1, z1], wall, MAT.plain)
      B.tri([xb, y0, z1], [xb, y0, z0], [xb, y1, z1], wall, MAT.plain)
    }
    door(B, W, 3.6, 3.4, 0.25)
  } else {
    const h = v === 0 ? 5.2 : 3.8
    B.box(0, 0.25, 0, L, h, W, wall, MAT.clap)
    gable(B, L, W, 0.25 + h, v === 0 ? 1.6 : 2.6, 0.4, roof, wall, { alongZ: true, wallMat: MAT.clap, roofMat: MAT.roof })
    door(B, W, v === 0 ? 4.2 : 6.5, v === 0 ? 4.0 : 3.4, 0.25)
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
  // the tower at the front, its top stepped in, a low cap; its foot stands
  // proud of the nave's front, so their faces never share a plane
  B.box(0, 0.75, W / 2 - 3.6, 9, 22.05, 8.4, wall, MAT.masonry)
  B.box(0, 22.8, W / 2 - 3.6, 9.6, 0.8, 9, wall.map((c) => c * 0.88), MAT.masonry)
  for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) B.box(sx * 4, 23.6, W / 2 - 3.6 + sz * 3.5, 1.2, 1.4, 1.2, wall, MAT.masonry)
  // (on the tower's front)
  door(B, 2 * (W / 2 - 3.6 + 4.2), 2.2, 4, 0.8)
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
  B.box(0, 0.75, W / 2 - 1.3, 4.5, 14.05, 4.9, wall, MAT.clap)
  pyramid(B, 4.8, 14.8, 12, roof, 0, W / 2 - 1.3)
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

// --- the works' buildings (features/works.js) ----------------------------------------
//
// What a base or an airfield put up, drawn where the works file has a
// `block`: poured concrete and corrugated iron, the walls the colour of the
// concrete, the roofs grey and green iron. Each is built at a size of its own
// in metres and fitted to the block's footprint where the file gives one.

/** A hangar: a broad low vault of iron over concrete walls, its doors across the front. */
function hangar(rand) {
  const B = new Builder()
  const wall = col(P.concrete, 0.05, rand)
  const roof = col([P.iron, P.ironGreen][rand() < 0.5 ? 0 : 1], 0.06, rand)
  const L = 60
  const W = 48
  const h = 9
  plinth(B, L + 0.6, W + 0.6, 0.3, col(P.plinth, 0.08, rand))
  B.box(0, 0.3, 0, L, h, W, wall, MAT.plain)
  // (the vault as three facets a side, the ridge along the length)
  const top = 0.3 + h
  const steps = [[W / 2 + 0.4, top - 0.2], [W / 3, top + 3.2], [W / 6, top + 5], [0, top + 5.6]]
  for (let k = 0; k + 1 < steps.length; k++) {
    const [z0, y0] = steps[k]
    const [z1, y1] = steps[k + 1]
    B.quad([-L / 2 - 0.4, y0, z0], [L / 2 + 0.4, y0, z0], [L / 2 + 0.4, y1, z1], [-L / 2 - 0.4, y1, z1], roof, MAT.roof)
    B.quad([L / 2 + 0.4, y0, -z0], [-L / 2 - 0.4, y0, -z0], [-L / 2 - 0.4, y1, -z1], [L / 2 + 0.4, y1, -z1], roof.map((v) => v * 0.86), MAT.roof)
  }
  // the vault's ends, filled in the wall's colour from the wall's top up to it
  const vy = (z) => {
    for (let k = 0; k + 1 < steps.length; k++) {
      const [za, ya] = steps[k]
      const [zb, yb] = steps[k + 1]
      if (z <= za && z >= zb) return ya + ((yb - ya) * (za - z)) / (za - zb)
    }
    return top
  }
  const zs = [W / 2, W / 3, W / 6, 0]
  for (const sx of [-1, 1]) {
    const x = (sx * L) / 2
    for (let k = 0; k + 1 < zs.length; k++) {
      for (const sz of [1, -1]) {
        const za = sz > 0 ? zs[k] : -zs[k + 1]
        const zb = sz > 0 ? zs[k + 1] : -zs[k]
        const a = [x, top, za]
        const b = [x, top, zb]
        const c = [x, vy(Math.abs(zb)), zb]
        const d = [x, vy(Math.abs(za)), za]
        if (sx > 0) B.quad(a, b, c, d, wall, MAT.plain)
        else B.quad(d, c, b, a, wall, MAT.plain)
      }
    }
  }
  // the doors: a dark opening most of the front's width
  door(B, W, L * 0.8, h - 1.2, 0.3)
  return B
}

/** Barracks of two or three storeys: a long concrete block, its storeys of windows, a hipped iron roof. */
function barracks(rand, storeys) {
  const B = new Builder()
  const wall = col([P.concrete, P.concreteWarm, P.limewash][Math.floor(rand() * 3)], 0.05, rand)
  const L = 56
  const W = 16
  const h = storeys * 3.4
  plinth(B, L + 0.4, W + 0.4, 0.6, col(P.plinth, 0.08, rand))
  B.box(0, 0.6, 0, L, h, W, wall, MAT.windows)
  hip(B, L, W, 0.6 + h, 2.6, 0.9, col([P.ironRed, P.ironGreen, P.iron][Math.floor(rand() * 3)], 0.08, rand))
  door(B, W, 2.4, 2.6, 0.6)
  return B
}

/** A low block of one storey (a shop, an office, a mess hall): concrete under a low iron gable. */
function lowBlock(rand) {
  const B = new Builder()
  const wall = col(P.concrete, 0.06, rand)
  const L = 26
  const W = 14
  plinth(B, L + 0.4, W + 0.4, 0.4, col(P.plinth, 0.08, rand))
  B.box(0, 0.4, 0, L, 4.2, W, wall, MAT.clap)
  gable(B, L, W, 4.6, 1.6, 0.5, col(P.iron, 0.08, rand), wall, { wallMat: MAT.clap })
  door(B, W, 3.2, 3, 0.4)
  return B
}

/** A flat-roofed block of four storeys (stretched for more: a tower), its parapet the roof seen from above. */
function concreteBlock(rand) {
  const B = new Builder()
  const wall = col(P.concrete, 0.05, rand)
  const L = 30
  const W = 22
  const h = 4 * 3.6
  plinth(B, L + 0.4, W + 0.4, 0.5, col(P.plinth, 0.08, rand))
  B.box(0, 0.5, 0, L, h, W, wall, MAT.windows)
  B.box(0, 0.5 + h, 0, L + 0.4, 0.8, W + 0.4, wall.map((c) => c * 0.88), MAT.plain)
  return B
}

/**
 * The works' kits, by kind: a hangar, barracks of two and of three storeys,
 * a low block, and a block of four storeys whose instances stretch to their
 * own. Each as buildKits gives a kind's: geometry, half extents, extents and
 * top, and `L`, `W`, the size it was built at, for fitting to a footprint.
 */
export function worksKits(rand) {
  const kit = (B, L, W, storeys = 1) => {
    const g = indexed(B.geometry())
    g.computeBoundingBox()
    const ob = g.boundingBox
    return { geometry: g, hx: Math.max(-ob.min.x, ob.max.x), hz: Math.max(-ob.min.z, ob.max.z), box: [ob.min.x, ob.max.x, ob.min.z, ob.max.z], top: ob.max.y, tris: g.index.count / 3, L, W, storeys }
  }
  return {
    hangar: kit(hangar(rand), 60, 48),
    barracks2: kit(barracks(rand, 2), 56, 16, 2),
    barracks3: kit(barracks(rand, 3), 56, 16, 3),
    low: kit(lowBlock(rand), 26, 14),
    block: kit(concreteBlock(rand), 30, 22, 4),
  }
}

// --- the kits --------------------------------------------------------------------

/**
 * Each kind with its variants' geometry (indexed) and footprint: `hx`, `hz`
 * the half extents in model metres, and `box` the extents on each side
 * ([x0, x1, z0, z1]: a model reaches further toward its street than behind),
 * so settlements.js can fit them to a lot and clear the ground under them.
 * `pads` gives, for the kinds that have one, the lot's size in their own
 * metres: the city's lots are paved to their edges, the paving's top 20 cm
 * over the highest ground under the lot (and the footing's lift), never in
 * the ground's plane.
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
      // (its top under the plinth's, its foot under the building's: no face of it in theirs)
      const deep = FOOT * (kind === 'tower' ? 3 : 1) + 0.25
      if (pads[kind]) B.box(0, -deep, 0, pads[kind][0], deep + 0.2, pads[kind][1], col(P.concrete, 0.05, rand).map((c) => c * 0.88), MAT.plain)
      const g = indexed(B.geometry())
      return { geometry: g, hx: Math.max(-ob.min.x, ob.max.x), hz: Math.max(-ob.min.z, ob.max.z), box: [ob.min.x, ob.max.x, ob.min.z, ob.max.z], top: ob.max.y, tris: g.index.count / 3 }
    })
  }
  add('kauhale', HALE_SIZES.map((h) => kauhaleHale(rand, h)))
  add('hale', [0, 1].map((v) => thatchHouse(rand, v)))
  add('frame', [0, 1, 2].map((v) => frameHouse(rand, v)))
  add('adobe', [0, 1].map((v) => adobeHouse(rand, v)))
  add('cottage', [0, 1, 2].map((v) => cottage(rand, v)))
  add('store', [[2, 5.8], [1, 9.4]].map(([n, w]) => storeRow(rand, n, w)))
  add('block', [0, 1, 2].map((v) => masonryBlock(rand, v)))
  add('bungalow', [0, 1, 2].map((v) => bungalow(rand, v)))
  add('midrise', [0, 1].map((v) => midrise(rand, v)))
  add('house', [0, 1, 2].map((v) => suburbHouse(rand, v)))
  add('walkup', [0, 1].map((v) => walkup(rand, v)))
  add('tower', [0, 1, 2].map((v) => tower(rand, v)))
  add('shed', [0, 1, 2].map((v) => shed(rand, v)))
  add('church', [towerChurch(rand)])
  add('spire', [spireChurch(rand)])
  add('clock', [clockTower(rand)])
  return out
}
