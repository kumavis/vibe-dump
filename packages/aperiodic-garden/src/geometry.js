// Turning the board into triangles.
//
// Every kite becomes a little plinth: a flat top, a chamfer under it, and a
// skirt of earth dropping away. The chamfer is applied *only* along edges that
// are on a tile's outline, never between two kites of the same tile — so each
// hat reads as one physical piece pressed into the garden, and the aperiodic
// seam pattern is drawn by the light in the grooves rather than by an overlay.
//
// The whole terrain is rebuilt from scratch on each placement. At three hundred
// tiles that is ~2,400 kites and ~50k triangles, which costs a few milliseconds
// once a turn — far cheaper than the bookkeeping an incremental rebuild would
// need, because placing a tile also changes the skirts of everything it touches.

import { KEY_A, KEY_B, KEY_K, cart, kiteCentre, kiteCorners, neighbourKeys } from './hat.js'
import { WATER, PLAINS, FOREST, HILLS, VILLAGE, PEAK } from './board.js'
import { BIOME_LIFT } from './tiles.js'
import { topColour, edgeColour, EARTH_TOP, EARTH_LOW, SNOW_LINE, shade } from './palette.js'

const biomeLift = (b) => BIOME_LIFT[b]
const BIOME_LIFT_W = BIOME_LIFT[WATER]

/** Lattice units → world units, and the vertical exaggeration on top of that. */
export const W = 0.42
export const YS = 1.6

/** How far a tile-outline edge is pulled in, in lattice units, and how deep the
 *  chamfer below it runs. Together they draw the seam between tiles. */
const INSET = 0.17
const BEVEL = 0.075
const SKIRT = 0.3

export const worldY = (elev) => elev * W * YS

/** Deterministic per-cell noise — same garden, same trees, every reload. */
export function cellHash(key, salt) {
  let h = (key * 374761393 + salt * 2246822519) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

// --- small vector helpers ---------------------------------------------------

function offsetLine(p, q, d) {
  // inward normal of a CCW polygon edge p→q is (-(qy-py), qx-px), normalised
  const dx = q[0] - p[0]
  const dy = q[1] - p[1]
  const len = Math.hypot(dx, dy) || 1
  const nx = -dy / len
  const ny = dx / len
  return [p[0] + nx * d, p[1] + ny * d, dx, dy]
}

function intersect(l1, l2) {
  const [x1, y1, dx1, dy1] = l1
  const [x2, y2, dx2, dy2] = l2
  const den = dx1 * dy2 - dy1 * dx2
  if (Math.abs(den) < 1e-9) return [x1, y1]
  const t = ((x2 - x1) * dy2 - (y2 - y1) * dx2) / den
  return [x1 + dx1 * t, y1 + dy1 * t]
}

/**
 * Pull the polygon in along the edges flagged in `bnd`. Corner i is where the
 * (possibly offset) lines of edges i−1 and i cross, so a corner between an
 * offset edge and a kept edge slides along the kept edge instead of shrinking
 * the whole kite.
 */
function insetPolygon(pts, bnd, d) {
  const lines = []
  for (let e = 0; e < 4; e++) {
    lines.push(offsetLine(pts[e], pts[(e + 1) % 4], bnd[e] ? d : 0))
  }
  const out = []
  for (let i = 0; i < 4; i++) out.push(intersect(lines[(i + 3) % 4], lines[i]))
  return out
}

// --- the mesh builder -------------------------------------------------------

class Buf {
  constructor() {
    this.pos = []
    this.nrm = []
    this.col = []
  }
  get count() {
    return this.pos.length / 3
  }
  tri(a, b, c, ca, cb, cc) {
    // flat face normal
    const ux = b[0] - a[0]
    const uy = b[1] - a[1]
    const uz = b[2] - a[2]
    const vx = c[0] - a[0]
    const vy = c[1] - a[1]
    const vz = c[2] - a[2]
    let nx = uy * vz - uz * vy
    let ny = uz * vx - ux * vz
    let nz = ux * vy - uy * vx
    const l = Math.hypot(nx, ny, nz) || 1
    nx /= l
    ny /= l
    nz /= l
    this.pos.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2])
    this.nrm.push(nx, ny, nz, nx, ny, nz, nx, ny, nz)
    pushCol(this.col, ca)
    pushCol(this.col, cb)
    pushCol(this.col, cc)
  }
  quad(a, b, c, d, ct, cb) {
    this.tri(a, b, c, ct, ct, cb)
    this.tri(a, c, d, ct, cb, cb)
  }
}

const SRGB = new Float32Array(256)
for (let i = 0; i < 256; i++) {
  const c = i / 255
  SRGB[i] = c < 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}
function pushCol(arr, hex) {
  arr.push(SRGB[(hex >> 16) & 255], SRGB[(hex >> 8) & 255], SRGB[hex & 255])
}

/**
 * Build every triangle of the garden.
 * Returns { land, water, props } — land and water as raw typed-array bundles,
 * props as a flat list the instancers consume.
 */
export function buildGarden(game, opts = {}) {
  const board = game.board
  const land = new Buf()
  const water = new Buf()
  const props = []
  const nb = [0, 0, 0, 0]
  const bnd = [false, false, false, false]
  const nb2 = [-1, -1, -1, -1]

  for (const key of board.filled) {
    const a = KEY_A(key)
    const b = KEY_B(key)
    const k = KEY_K(key)
    const biome = board.biome.get(key)
    const owner = board.owner.get(key)
    const elev = game.elev.get(key) ?? 0
    const jit = game.jitter.get(key) ?? 0.5
    // Finished ground stays visibly finished: a sealed region keeps a small
    // permanent lift in tone, long after its celebration has faded.
    const done = board.sealed.has(board.find(key))
    const jitter = done ? Math.min(1, jit + 0.55) : jit

    const pts = kiteCorners(a, b, k).map(([p, q]) => {
      const [x, y] = cart(p, q)
      return [x * W, y * W]
    })

    neighbourKeys(a, b, k, nb)
    for (let e = 0; e < 4; e++) {
      // polygon edge e runs from corner e to corner e+1, which is side (e+1)%4
      const side = (e + 1) % 4
      const nkey = nb[side]
      const filled = board.filled.has(nkey)
      bnd[e] = !(filled && board.owner.get(nkey) === owner)
      nb2[e] = filled ? board.biome.get(nkey) : -1
    }

    const inner = insetPolygon(pts, bnd, INSET * W)

    // Heights are sampled at the *corners*, not once per kite, so the ground
    // rolls and the mountain is a cone rather than a stack of plateaux. Two
    // kites of the same biome share their corner samples exactly, so they join
    // seamlessly; a change of biome makes a clean step, which is the look.
    const lift = biome === WATER ? BIOME_LIFT_W : biomeLift(biome)
    const cy = inner.map((p) => worldY(game.groundAt(p[0] / W, p[1] / W) + lift))
    const oy = pts.map((p) => worldY(game.groundAt(p[0] / W, p[1] / W) + lift))

    // --- top face ----------------------------------------------------------
    const drop = biome === WATER ? 0.055 : 0
    const v = inner.map((p, i) => [p[0], cy[i] - drop, p[1]])
    // Colour corner by corner off that corner's own height, so the snowline
    // crosses a face as a soft curve instead of stopping at a kite boundary.
    const vc =
      biome === WATER
        ? [0x2b4a4e, 0x2b4a4e, 0x2b4a4e, 0x2b4a4e]
        : cy.map((y) => topColour(biome, y / (W * YS), jitter))
    // reverse winding: CCW in lattice XY is CW seen from +Y once y→z
    land.tri(v[0], v[2], v[1], vc[0], vc[2], vc[1])
    land.tri(v[0], v[3], v[2], vc[0], vc[3], vc[2])

    if (biome === WATER) {
      const wc = 0xffffff
      const wv = inner.map((p, i) => [p[0], cy[i] + 0.008, p[1]])
      water.tri(wv[0], wv[2], wv[1], wc, wc, wc)
      water.tri(wv[0], wv[3], wv[2], wc, wc, wc)
    }

    // --- chamfer and skirt --------------------------------------------------
    const ec = edgeColour(biome, elev, jitter)
    const earthTop = shade(EARTH_TOP, 0.9 + jit * 0.2)

    // A shelf at the foot of the chamfer, covering the kite's *whole* footprint.
    // Neighbouring tiles' shelves meet edge to edge, so the seam between two
    // pieces is a groove full of soil rather than a slot you can see sky through.
    if (bnd[0] || bnd[1] || bnd[2] || bnd[3]) {
      const sh = pts.map((p, i) => [p[0], oy[i] - BEVEL, p[1]])
      land.tri(sh[0], sh[2], sh[1], earthTop, earthTop, earthTop)
      land.tri(sh[0], sh[3], sh[2], earthTop, earthTop, earthTop)
    }
    for (let e = 0; e < 4; e++) {
      const i0 = e
      const i1 = (e + 1) % 4
      let r0 = oy[i0] - BEVEL
      let r1 = oy[i1] - BEVEL
      if (bnd[e]) {
        land.quad(
          [inner[i0][0], cy[i0], inner[i0][1]],
          [inner[i1][0], cy[i1], inner[i1][1]],
          [pts[i1][0], r1, pts[i1][1]],
          [pts[i0][0], r0, pts[i0][1]],
          ec,
          ec,
        )
      } else {
        r0 = oy[i0]
        r1 = oy[i1]
      }
      // How far down does the neighbour's surface sit? Same ground function,
      // its own biome lift — so the wall lands exactly on the neighbour's top.
      let b0
      let b1
      if (nb2[e] >= 0) {
        const nl = nb2[e] === WATER ? BIOME_LIFT_W : biomeLift(nb2[e])
        b0 = worldY(game.groundAt(pts[i0][0] / W, pts[i0][1] / W) + nl) - (bnd[e] ? BEVEL : 0) - 0.004
        b1 = worldY(game.groundAt(pts[i1][0] / W, pts[i1][1] / W) + nl) - (bnd[e] ? BEVEL : 0) - 0.004
      } else {
        b0 = r0 - SKIRT
        b1 = r1 - SKIRT
      }
      if (b0 >= r0 - 1e-4 && b1 >= r1 - 1e-4) continue
      // A step *inside* a tile is a bank of the same ground, not a cut edge, so
      // it takes the biome's own shade; only the outside of a piece shows soil.
      const wallTop = bnd[e] ? earthTop : shade(ec, 0.86)
      const wallLow = bnd[e] ? EARTH_LOW : shade(ec, 0.66)
      land.quad(
        [pts[i0][0], r0, pts[i0][1]],
        [pts[i1][0], r1, pts[i1][1]],
        [pts[i1][0], Math.min(b1, r1), pts[i1][1]],
        [pts[i0][0], Math.min(b0, r0), pts[i0][1]],
        wallTop,
        wallLow,
      )
    }

    // --- what grows on it ---------------------------------------------------
    if (!opts.noProps) scatter(props, key, biome, inner, cy, jit, elev)
  }

  // --- tarns ----------------------------------------------------------------
  // Pockets no hat can ever fill. Nothing was invented to plug them: they are
  // drawn as sunken water sitting in the seam between the pieces around them.
  for (const key of board.dead) {
    const a = KEY_A(key)
    const b = KEY_B(key)
    const k = KEY_K(key)
    const pts = kiteCorners(a, b, k).map(([p, q]) => {
      const [x, y] = cart(p, q)
      return [x * W, y * W]
    })
    const all = [true, true, true, true]
    const inner = insetPolygon(pts, all, INSET * W)
    const cy = inner.map((p) => worldY(game.groundAt(p[0] / W, p[1] / W) - 0.26))
    const bed = 0x24393f
    const v = inner.map((p, i) => [p[0], cy[i] - 0.05, p[1]])
    land.tri(v[0], v[2], v[1], bed, bed, bed)
    land.tri(v[0], v[3], v[2], bed, bed, bed)
    const wv = inner.map((p, i) => [p[0], cy[i], p[1]])
    water.tri(wv[0], wv[2], wv[1], 0xffffff, 0xffffff, 0xffffff)
    water.tri(wv[0], wv[3], wv[2], 0xffffff, 0xffffff, 0xffffff)
  }

  // --- pennants -------------------------------------------------------------
  // One per sealed region, so a finished meadow reads as finished for the rest
  // of the run rather than only for the second its flash lasts.
  for (const [root, cell] of board.landmarks) {
    if (!board.filled.has(cell)) continue
    const [x, z] = kiteCentre(KEY_A(cell), KEY_B(cell), KEY_K(cell))
    props.push({
      type: PROP_PENNANT,
      x: x * W,
      y: worldY(game.elev.get(cell) ?? 0),
      z: z * W,
      s: 1,
      rot: cellHash(cell, 3) * Math.PI * 2,
      tint: cellHash(cell, 4),
      biome: board.biome.get(cell),
    })
  }

  return { land, water, props }
}

// --- props ------------------------------------------------------------------

/** A point inside the kite, from its two triangles, deterministic in (key, i). */
function pointIn(inner, key, i) {
  const r0 = cellHash(key, i * 7 + 1)
  const r1 = cellHash(key, i * 7 + 2)
  const r2 = cellHash(key, i * 7 + 3)
  const t = r0 < 0.5 ? [inner[0], inner[1], inner[2]] : [inner[0], inner[2], inner[3]]
  let u = r1
  let v = r2
  if (u + v > 1) {
    u = 1 - u
    v = 1 - v
  }
  const x = t[0][0] + (t[1][0] - t[0][0]) * u + (t[2][0] - t[0][0]) * v
  const z = t[0][1] + (t[1][1] - t[0][1]) * u + (t[2][1] - t[0][1]) * v
  // nudge towards the middle so nothing straddles a seam
  const cx = (inner[0][0] + inner[1][0] + inner[2][0] + inner[3][0]) / 4
  const cz = (inner[0][1] + inner[1][1] + inner[2][1] + inner[3][1]) / 4
  return [cx + (x - cx) * 0.82, cz + (z - cz) * 0.82]
}

export const PROP_CONIFER = 0
export const PROP_BROADLEAF = 1
export const PROP_ROCK = 2
export const PROP_HOUSE = 3
export const PROP_BUSH = 4
export const PROP_PENNANT = 5

function scatter(out, key, biome, inner, cy, jit, elev) {
  const h = (cy[0] + cy[1] + cy[2] + cy[3]) / 4
  const push = (type, i, scale, extra = 0) => {
    const [x, z] = pointIn(inner, key, i)
    out.push({
      type,
      x,
      y: h,
      z,
      s: scale,
      rot: cellHash(key, i * 13 + 5) * Math.PI * 2,
      tint: cellHash(key, i * 13 + 6),
      extra,
    })
  }
  switch (biome) {
    case FOREST: {
      const n = 3 + Math.floor(jit * 2.6)
      for (let i = 0; i < n; i++) {
        const broad = cellHash(key, i * 31 + 9) < 0.3
        push(broad ? PROP_BROADLEAF : PROP_CONIFER, i, 0.72 + cellHash(key, i * 17) * 0.5)
      }
      break
    }
    case PLAINS: {
      if (jit < 0.22) push(PROP_BROADLEAF, 0, 0.7 + jit)
      if (jit > 0.55) push(PROP_BUSH, 1, 0.7 + cellHash(key, 3) * 0.6)
      break
    }
    case HILLS: {
      const n = jit > 0.45 ? 2 : 1
      for (let i = 0; i < n; i++) push(PROP_ROCK, i, 0.55 + cellHash(key, i * 19) * 0.7)
      if (jit > 0.35) push(PROP_BUSH, 5, 0.6 + jit * 0.5)
      break
    }
    case VILLAGE: {
      const n = 1 + (jit > 0.62 ? 1 : 0)
      for (let i = 0; i < n; i++) push(PROP_HOUSE, i * 2, 0.85 + cellHash(key, i * 23) * 0.35)
      if (jit < 0.4) push(PROP_CONIFER, 6, 0.6)
      break
    }
    case PEAK: {
      if (elev < SNOW_LINE && jit > 0.35) push(PROP_ROCK, 0, 0.7 + jit * 0.7)
      break
    }
    default:
      break
  }
}

// --- ghost ------------------------------------------------------------------

/** A flat, floating copy of one placement, for the piece under the cursor. */
export function buildGhost(cells, biomes, game, lift) {
  const buf = new Buf()
  const nb = [0, 0, 0, 0]
  const own = new Set(cells)
  for (let i = 0; i < cells.length; i++) {
    const key = cells[i]
    const a = KEY_A(key)
    const b = KEY_B(key)
    const k = KEY_K(key)
    const biome = biomes[i]
    const pts = kiteCorners(a, b, k).map(([p, q]) => {
      const [x, y] = cart(p, q)
      return [x * W, y * W]
    })
    neighbourKeys(a, b, k, nb)
    const bnd = [false, false, false, false]
    for (let e = 0; e < 4; e++) bnd[e] = !own.has(nb[(e + 1) % 4])
    const inner = insetPolygon(pts, bnd, INSET * W)
    const bl = BIOME_LIFT[biome]
    const cy = inner.map((p) => worldY(game.groundAt(p[0] / W, p[1] / W) + bl) + lift)
    const oy = pts.map((p) => worldY(game.groundAt(p[0] / W, p[1] / W) + bl) + lift)
    const elev = game.groundAt(
      (pts[0][0] + pts[1][0] + pts[2][0] + pts[3][0]) / 4 / W,
      (pts[0][1] + pts[1][1] + pts[2][1] + pts[3][1]) / 4 / W,
    ) + bl
    const tc = topColour(biome, elev, 0.5)
    const v = inner.map((p, j) => [p[0], cy[j], p[1]])
    buf.tri(v[0], v[2], v[1], tc, tc, tc)
    buf.tri(v[0], v[3], v[2], tc, tc, tc)
    const ec = edgeColour(biome, elev, 0.5)
    for (let e = 0; e < 4; e++) {
      if (!bnd[e]) continue
      const i0 = e
      const i1 = (e + 1) % 4
      buf.quad(
        [inner[i0][0], cy[i0], inner[i0][1]],
        [inner[i1][0], cy[i1], inner[i1][1]],
        [pts[i1][0], oy[i1] - 0.13, pts[i1][1]],
        [pts[i0][0], oy[i0] - 0.13, pts[i0][1]],
        ec,
        shade(ec, 0.7),
      )
    }
  }
  return buf
}

export { Buf }
