// Turning the board into triangles.
//
// The ground is flat: every kite's top face sits at y = 0. Each one becomes a
// little plinth — a flat top, a chamfer under it, a shelf of soil, and a skirt
// dropping away at the garden's rim. The chamfer is applied *only* along edges
// that are on a tile's outline, never between two kites of the same tile, so
// each hat reads as one physical piece pressed into the garden and the aperiodic
// seam pattern is drawn by the light in the grooves rather than by an overlay.
//
// The river is drawn on top of that ground rather than cut into it: a dark bank
// ribbon with a narrower band of water inside, running from each of a tile's
// river crossings to its hub. A crossing always lands on the midpoint of a long
// kite edge, and the tile across that edge draws its own branch to the same
// point — so the two halves meet exactly, and the line runs on unbroken.
//
// The whole thing is rebuilt from scratch on each placement. At three hundred
// tiles that is ~2,400 kites, which costs a few milliseconds once a turn — far
// cheaper than the bookkeeping an incremental rebuild would need, because
// placing a tile also changes the skirts of everything it touches.

import {
  KEY_A,
  KEY_B,
  KEY_K,
  PORT_SIDE,
  cart,
  kiteCentre,
  kiteCorners,
  longEdgeFrame,
  longEdgeMid,
  neighbourKeys,
  worldSide,
} from './hat.js'
import { PLAINS, FOREST, HILLS, VILLAGE, SCREE } from './board.js'
import { topColour, edgeColour, EARTH_TOP, EARTH_LOW, RIVER_BANK, shade } from './palette.js'
import { hasLandmarkModel } from './landmarks.js'

/** Lattice units → world units. */
export const W = 0.42

/** How far a tile-outline edge is pulled in, in lattice units, and how deep the
 *  chamfer below it runs. Together they draw the seam between tiles. */
const INSET = 0.17
const BEVEL = 0.07
const SKIRT = 0.3

/** Half-widths of the river's water and its bank, in world units. */
const WATER_W = 0.055
const BANK_W = 0.092
const BANK_Y = 0.004
const WATER_Y = 0.011

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
  return [p[0] + (-dy / len) * d, p[1] + (dx / len) * d, dx, dy]
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
  for (let e = 0; e < 4; e++) lines.push(offsetLine(pts[e], pts[(e + 1) % 4], bnd[e] ? d : 0))
  const out = []
  for (let i = 0; i < 4; i++) out.push(intersect(lines[(i + 3) % 4], lines[i]))
  return out
}

// --- the mesh builder -------------------------------------------------------

export class Buf {
  constructor() {
    this.pos = []
    this.nrm = []
    this.col = []
  }
  get count() {
    return this.pos.length / 3
  }
  tri(a, b, c, ca, cb, cc) {
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
    pushCol(this.col, cb ?? ca)
    pushCol(this.col, cc ?? ca)
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

// --- rivers -----------------------------------------------------------------

/**
 * The polyline a river branch follows inside one tile: from the midpoint of the
 * crossed edge, out along the edge's normal, bending through the port kite, to
 * the tile's hub.
 *
 * Two tiles sharing an edge start at the same midpoint *and* leave along the
 * same line, in opposite directions — which is what makes the two halves read as
 * one river rather than two ribbons meeting at an angle. The normal segment is
 * short; past it the curve is free to swing toward the kite's centre and on to
 * the hub.
 */
const EXIT = 0.16 * W

export function branchPath(cells, orient, slot, hub, steps = 10) {
  const key = cells[slot]
  const a = KEY_A(key)
  const b = KEY_B(key)
  const k = KEY_K(key)
  const side = worldSide(PORT_SIDE[slot], orient >= 6)
  const { mid, nx, ny } = longEdgeFrame(a, b, k, side)
  const [cx, cz] = kiteCentre(a, b, k)
  const p0 = [mid[0] * W, mid[1] * W]
  const p1 = [p0[0] + nx * EXIT, p0[1] + ny * EXIT]
  const p2 = [cx * W, cz * W]
  const out = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const u = 1 - t
    const w0 = u * u * u
    const w1 = 3 * u * u * t
    const w2 = 3 * u * t * t
    const w3 = t * t * t
    out.push([
      w0 * p0[0] + w1 * p1[0] + w2 * p2[0] + w3 * hub[0],
      w0 * p0[1] + w1 * p1[1] + w2 * p2[1] + w3 * hub[1],
    ])
  }
  return out
}

/**
 * A tile the water arrives at and stops. One crossing is the test — except for
 * a water works, which also takes the water in and lets none out, but takes it
 * into a cistern rather than into a pond, and has its own model to say so.
 */
const isLake = (t) => t.ports.size === 1 && t.kind !== 'waterworks'

/** The centre of a placement, where its river branches meet. */
export function hubOf(cells) {
  let x = 0
  let z = 0
  for (const key of cells) {
    const [cx, cz] = kiteCentre(KEY_A(key), KEY_B(key), KEY_K(key))
    x += cx
    z += cz
  }
  return [(x / cells.length) * W, (z / cells.length) * W]
}

/**
 * A flat band along a polyline.
 *
 * The offsets are worked out once per *point*, from the direction through it
 * rather than the direction of each segment. Taking them per segment gives every
 * quad its own two corners, and on the outside of a bend those corners do not
 * line up: the bank came out with a row of little teeth down it wherever the
 * river turned. Sharing one offset between the quads either side leaves no gap
 * to show.
 */
function ribbon(buf, path, y, halfWidth, colour, taperTo = 1) {
  const n = path.length
  if (n < 2) return
  const off = []
  for (let i = 0; i < n; i++) {
    const p = path[Math.max(0, i - 1)]
    const q = path[Math.min(n - 1, i + 1)]
    let dx = q[0] - p[0]
    let dz = q[1] - p[1]
    const len = Math.hypot(dx, dz) || 1
    dx /= len
    dz /= len
    const w = halfWidth * (1 - (1 - taperTo) * (i / (n - 1)))
    off.push([-dz * w, dx * w])
  }
  for (let i = 0; i < n - 1; i++) {
    const p = path[i]
    const q = path[i + 1]
    const o0 = off[i]
    const o1 = off[i + 1]
    const a = [p[0] + o0[0], y, p[1] + o0[1]]
    const b = [q[0] + o1[0], y, q[1] + o1[1]]
    const c = [q[0] - o1[0], y, q[1] - o1[1]]
    const d = [p[0] - o0[0], y, p[1] - o0[1]]
    // wound so the face normal comes out +Y; the mirror of this faces the floor
    // and is culled, which reads as the river simply not being drawn
    buf.tri(a, b, c, colour)
    buf.tri(a, c, d, colour)
  }
}

/** A lake: a disc with its rim pushed about a little, so it reads as water
 *  rather than as a coin. Wobbled off the cell key, so a garden reloads the
 *  same. */
const LAKE_R = 0.3 * W

function pool(buf, centre, y, r, colour, key, seg = 14) {
  const rad = (i) => r * (0.78 + 0.42 * cellHash(key, (i % seg) * 37 + 5))
  for (let i = 0; i < seg; i++) {
    const a0 = (i / seg) * Math.PI * 2
    const a1 = ((i + 1) / seg) * Math.PI * 2
    const r0 = rad(i)
    const r1 = rad(i + 1)
    buf.tri(
      [centre[0], y, centre[1]],
      [centre[0] + Math.cos(a1) * r1, y, centre[1] + Math.sin(a1) * r1],
      [centre[0] + Math.cos(a0) * r0, y, centre[1] + Math.sin(a0) * r0],
      colour,
    )
  }
}

function disc(buf, centre, y, r, colour, seg = 10) {
  for (let i = 0; i < seg; i++) {
    const a0 = (i / seg) * Math.PI * 2
    const a1 = ((i + 1) / seg) * Math.PI * 2
    buf.tri(
      [centre[0], y, centre[1]],
      [centre[0] + Math.cos(a1) * r, y, centre[1] + Math.sin(a1) * r],
      [centre[0] + Math.cos(a0) * r, y, centre[1] + Math.sin(a0) * r],
      colour,
    )
  }
}

// --- the garden -------------------------------------------------------------

/**
 * Build every triangle of the garden.
 * Returns { land, water, props, branches } — land and water as raw vertex
 * bundles, props as a flat list the instancers consume, and branches as the
 * river's polylines so the wildlife can follow them.
 */
export function buildGarden(game, opts = {}) {
  const board = game.board
  const land = new Buf()
  const water = new Buf()
  const props = []
  const nb = [0, 0, 0, 0]
  const bnd = [false, false, false, false]
  const empty = [false, false, false, false]

  // Tiles that stand a building of their own. Worked out before the ground
  // loop, because the middle of such a tile has to be left *clear*: the
  // scatterer would fill the same ground with cottages and boulders and bury
  // the thing the tile was laid for.
  const landmarks = []
  const cleared = new Set()
  for (let i = 0; i < board.tiles.length; i++) {
    const t = board.tiles[i]
    // A dealt lake is labelled 'stream' like any other one-crossing tile — the
    // label is what the HUD prints, and a lake tile *is* a stream tile that
    // happens to end. What makes it a lake is the single crossing, which is the
    // same test the pool below is drawn on, so ask that instead of the label.
    const kind = hasLandmarkModel(t.kind) ? t.kind : isLake(t) ? 'lake' : null
    if (!kind) continue
    const [hx, hz] = hubOf(t.cells)
    landmarks.push({ id: i, kind, x: hx, z: hz, rot: (t.orient % 6) * (Math.PI / 3), tile: t })
    for (const c of t.cells) {
      const [cx, cz] = kiteCentre(KEY_A(c), KEY_B(c), KEY_K(c))
      // wide enough that the scatterer's cottages stop at the edge of the
      // works rather than standing in its channels
      if (Math.hypot(cx * W - hx, cz * W - hz) < W * 0.88) cleared.add(c)
    }
  }

  for (const key of board.filled) {
    const a = KEY_A(key)
    const b = KEY_B(key)
    const k = KEY_K(key)
    const biome = board.biome.get(key)
    const owner = board.owner.get(key)
    const jit = game.jitter.get(key) ?? 0.5
    const done = board.sealed.has(board.find(key))
    // Finished ground stays visibly finished, long after its flash has faded.
    const jitter = done ? Math.min(1, jit + 0.5) : jit

    const pts = kiteCorners(a, b, k).map(([p, q]) => {
      const [x, y] = cart(p, q)
      return [x * W, y * W]
    })

    neighbourKeys(a, b, k, nb)
    for (let e = 0; e < 4; e++) {
      // polygon edge e runs from corner e to corner e+1, which is side (e+1)%4
      const nkey = nb[(e + 1) % 4]
      const filled = board.filled.has(nkey)
      bnd[e] = !(filled && board.owner.get(nkey) === owner)
      empty[e] = !filled
    }

    const inner = insetPolygon(pts, bnd, INSET * W)
    const tc = topColour(biome, jitter)
    const ec = edgeColour(biome, jitter)
    const earth = shade(EARTH_TOP, 0.9 + jit * 0.2)

    // top face — reverse winding: CCW in lattice XY is CW seen from +Y once y→z
    const v = inner.map((p) => [p[0], 0, p[1]])
    land.tri(v[0], v[2], v[1], tc)
    land.tri(v[0], v[3], v[2], tc)

    let anyBoundary = false
    for (let e = 0; e < 4; e++) {
      if (!bnd[e]) continue
      anyBoundary = true
      const i0 = e
      const i1 = (e + 1) % 4
      land.quad(
        [inner[i0][0], 0, inner[i0][1]],
        [inner[i1][0], 0, inner[i1][1]],
        [pts[i1][0], -BEVEL, pts[i1][1]],
        [pts[i0][0], -BEVEL, pts[i0][1]],
        ec,
        ec,
      )
    }

    if (anyBoundary) {
      // A shelf at the foot of the chamfer, covering the kite's whole footprint.
      // Neighbouring tiles' shelves meet edge to edge, so the seam between two
      // pieces is a groove full of soil rather than a slot you see sky through.
      const sh = pts.map((p) => [p[0], -BEVEL, p[1]])
      land.tri(sh[0], sh[2], sh[1], earth)
      land.tri(sh[0], sh[3], sh[2], earth)
    }

    for (let e = 0; e < 4; e++) {
      if (!empty[e]) continue
      const i0 = e
      const i1 = (e + 1) % 4
      land.quad(
        [pts[i0][0], -BEVEL, pts[i0][1]],
        [pts[i1][0], -BEVEL, pts[i1][1]],
        [pts[i1][0], -SKIRT, pts[i1][1]],
        [pts[i0][0], -SKIRT, pts[i0][1]],
        earth,
        EARTH_LOW,
      )
    }

    if (!opts.noProps && !cleared.has(key)) scatter(props, key, biome, inner, jit)
  }

  // --- the river ------------------------------------------------------------
  const branches = []
  // which way the water leaves each tile, so a landmark that has to line up with
  // the stream — a water works gathers it, a boat floats on it — can be turned to
  // face it instead of taking the tile's own arbitrary orientation
  const flow = new Map()
  for (let ti = 0; ti < board.tiles.length; ti++) {
    const t = board.tiles[ti]
    if (t.ports.size === 0) continue
    const hub = hubOf(t.cells)
    for (const slot of t.ports) {
      const path = branchPath(t.cells, t.orient, slot, hub)
      if (!flow.has(ti)) {
        const end = path[path.length - 1]
        flow.set(ti, Math.atan2(end[1] - hub[1], end[0] - hub[0]))
      }
      branches.push(path)
      ribbon(land, path, BANK_Y, BANK_W, RIVER_BANK)
      ribbon(water, path, WATER_Y, WATER_W, 0xffffff)
    }
    // A tile with one crossing is a lake: the water arrives and stops there,
    // which is the only way a river is allowed to end. Drawn as a pool big
    // enough to read as one, so a dead end never looks like a mistake.
    if (isLake(t)) {
      pool(land, hub, BANK_Y, LAKE_R + BANK_W * 0.7, RIVER_BANK, t.cells[0])
      pool(water, hub, WATER_Y, LAKE_R, 0xffffff, t.cells[0])
    } else {
      disc(land, hub, BANK_Y, BANK_W, RIVER_BANK)
      disc(water, hub, WATER_Y, WATER_W, 0xffffff)
    }
  }

  // --- pennants -------------------------------------------------------------
  for (const [, cell] of board.landmarks) {
    if (!board.filled.has(cell)) continue
    const [x, z] = kiteCentre(KEY_A(cell), KEY_B(cell), KEY_K(cell))
    props.push({
      type: PROP_PENNANT,
      x: x * W,
      y: 0,
      z: z * W,
      s: 1,
      rot: cellHash(cell, 3) * Math.PI * 2,
      tint: cellHash(cell, 4),
      biome: board.biome.get(cell),
    })
  }

  // A model built facing +x, turned by `rot` about y. Lattice y is world z, and
  // a turn that goes anticlockwise in the lattice goes clockwise seen from above
  // once it gets there, so the flow angle comes back negated.
  for (const l of landmarks) {
    if (flow.has(l.id)) l.rot = -flow.get(l.id)
    delete l.tile
  }

  return { land, water, props, branches, landmarks }
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
  const cx = (inner[0][0] + inner[1][0] + inner[2][0] + inner[3][0]) / 4
  const cz = (inner[0][1] + inner[1][1] + inner[2][1] + inner[3][1]) / 4
  // nudge towards the middle so nothing straddles a seam or stands in the river
  return [cx + (x - cx) * 0.78, cz + (z - cz) * 0.78]
}

export const PROP_CONIFER = 0
export const PROP_BROADLEAF = 1
export const PROP_ROCK = 2
export const PROP_HOUSE = 3
export const PROP_BUSH = 4
export const PROP_PENNANT = 5

function scatter(out, key, biome, inner, jit) {
  const push = (type, i, scale) => {
    const [x, z] = pointIn(inner, key, i)
    out.push({ type, key, x, y: 0, z, s: scale, rot: cellHash(key, i * 13 + 5) * Math.PI * 2, tint: cellHash(key, i * 13 + 6) })
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
      push(PROP_ROCK, 0, 0.55 + cellHash(key, 19) * 0.7)
      if (jit > 0.45) push(PROP_ROCK, 1, 0.55 + cellHash(key, 38) * 0.7)
      if (jit > 0.35) push(PROP_BUSH, 5, 0.6 + jit * 0.5)
      break
    }
    case VILLAGE: {
      const n = 1 + (jit > 0.62 ? 1 : 0)
      for (let i = 0; i < n; i++) push(PROP_HOUSE, i * 2, 0.85 + cellHash(key, i * 23) * 0.35)
      if (jit < 0.4) push(PROP_CONIFER, 6, 0.6)
      break
    }
    case SCREE: {
      const n = 1 + Math.floor(jit * 2.4)
      for (let i = 0; i < n; i++) push(PROP_ROCK, i, 0.6 + cellHash(key, i * 19) * 0.9)
      break
    }
    default:
      break
  }
}

// --- the piece under the cursor ---------------------------------------------

/**
 * A copy of one placement, drawn exactly where it will land — inline with the
 * garden, not floating above it. What says "not laid yet" is the outline the
 * scene pulses around it, not a height offset the eye has to correct for.
 */
export function buildGhost(cells, tile, orient, ports = tile.ports) {
  const buf = new Buf()
  const water = new Buf()
  const outline = []
  const nb = [0, 0, 0, 0]
  const own = new Set(cells)
  for (let i = 0; i < cells.length; i++) {
    const key = cells[i]
    const a = KEY_A(key)
    const b = KEY_B(key)
    const k = KEY_K(key)
    const pts = kiteCorners(a, b, k).map(([p, q]) => {
      const [x, y] = cart(p, q)
      return [x * W, y * W]
    })
    neighbourKeys(a, b, k, nb)
    const bnd = [false, false, false, false]
    for (let e = 0; e < 4; e++) bnd[e] = !own.has(nb[(e + 1) % 4])
    const inner = insetPolygon(pts, bnd, INSET * W)
    const tc = topColour(tile.biomes[i], 0.55)
    const ec = edgeColour(tile.biomes[i], 0.55)
    const v = inner.map((p) => [p[0], 0, p[1]])
    buf.tri(v[0], v[2], v[1], tc)
    buf.tri(v[0], v[3], v[2], tc)
    for (let e = 0; e < 4; e++) {
      if (!bnd[e]) continue
      const i0 = e
      const i1 = (e + 1) % 4
      buf.quad(
        [inner[i0][0], 0, inner[i0][1]],
        [inner[i1][0], 0, inner[i1][1]],
        [pts[i1][0], -BEVEL, pts[i1][1]],
        [pts[i0][0], -BEVEL, pts[i0][1]],
        ec,
        ec,
      )
      outline.push([pts[i0], pts[i1]])
    }
  }
  // The crossings the *placement* takes, which for a water works is decided by
  // where it is standing — so the preview under the cursor shows the streams it
  // would pick up here, and moving it one spot along redraws them.
  if (ports.size) {
    const hub = hubOf(cells)
    for (const slot of ports) {
      const path = branchPath(cells, orient, slot, hub)
      ribbon(buf, path, BANK_Y, BANK_W, RIVER_BANK)
      ribbon(water, path, WATER_Y, WATER_W, 0xffffff)
    }
    disc(buf, hub, BANK_Y, BANK_W, RIVER_BANK)
    disc(water, hub, WATER_Y, WATER_W * (ports.size === 1 ? 1.5 : 1), 0xffffff)
  }
  return { buf, water, outline }
}

/** The hat's outline as a flat ribbon, for the pulsing edge round the ghost. */
export function outlineRibbon(segments, y, halfWidth, colour) {
  const buf = new Buf()
  for (const [p, q] of segments) {
    let dx = q[0] - p[0]
    let dz = q[1] - p[1]
    const len = Math.hypot(dx, dz) || 1
    dx /= len
    dz /= len
    const a = [p[0] - dz * halfWidth, y, p[1] + dx * halfWidth]
    const b = [q[0] - dz * halfWidth, y, q[1] + dx * halfWidth]
    const c = [q[0] + dz * halfWidth, y, q[1] - dx * halfWidth]
    const d = [p[0] + dz * halfWidth, y, p[1] - dx * halfWidth]
    buf.tri(a, b, c, colour)
    buf.tri(a, c, d, colour)
  }
  return buf
}
