// The battlefield's dressing, placed (DESIGN §1.1's "Battlefield dressing"):
// where everything that is only looks goes, as plain records, from the
// board's own seed and the table as the match made it. No three.js, no DOM:
// sim/dressing-check.mjs runs it in Node against the core's own chunks, nav
// grid, objectives and zones.
//
// Its rules (the section's six):
//   - it is the view's alone, and seeded: every number here is a hash of
//     the dressing seed (dressSeed: the board seed, the mission and the
//     terrain set), never Math.random and never the match's dice, so both
//     players of an online match, and every replay, see the same place,
//     and the match is the same with the dressing drawn or not;
//   - on the mat, three classes and no others: flat decals (painted into
//     the mat: anywhere), low clutter (LOW tall at most: only on a walkable
//     nav cell, CLEAR or more from every rules piece's footprint, outside
//     every objective's range and both deployment zones) and anything
//     taller, only inside a rules piece's footprint; off the mat, anything;
//   - each item gets one try at its place: one that breaks a rule is
//     dropped, never nudged, so the list a board gets is the seed's alone;
//   - the quality only ever drops items from the end of a list, never
//     reorders one (view/dressing/index.js), so it decides nothing here.
// Angles and lengths go through core/dmath.js (the same bits on every
// engine), so two peers on two browsers place the same items.
import { sin, cos, hypot } from '../../core/dmath.js'

// the low clutter's height cap and its clearance from a rules piece
export const LOW = 0.3
export const CLEAR = 1
// the most debris a board gets (the draw budget's triangles)
export const DEBRIS = 900
export const TREES = 380

// ---- hashing: every value from (seed, salt, index), never drawn --------
export function hashStr(s) {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193)
  return h >>> 0
}
export function mix(a, b) {
  let h = Math.imul((a ^ Math.imul(b + 0x9e3779b9, 0x27d4eb2d)) >>> 0, 0x85ebca6b)
  h ^= h >>> 13
  h = Math.imul(h, 0xc2b2ae35)
  h ^= h >>> 16
  return h >>> 0
}
// a sequence of values in [0, 1) for one purpose (salt) of one board
export function stream(seed, salt) {
  let x = mix(seed, typeof salt === 'string' ? hashStr(salt) : salt)
  return () => {
    x = (x + 0x6d2b79f5) | 0
    let t = Math.imul(x ^ (x >>> 15), 1 | x)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
// the dressing's seed: the board's, its mission's and its set's
export const dressSeed = ({ board, mission, terrain }) => hashStr(`${board >>> 0}|${mission}|${terrain}|dress`)

// value noise on a lattice, smooth, in [0, 1)
export function noise(seed, x, z) {
  const ix = Math.floor(x), iz = Math.floor(z), fx = x - ix, fz = z - iz
  const at = (a, b) => mix(mix(seed, a + 7919), b + 104729) / 4294967296
  const sx = fx * fx * (3 - 2 * fx), sz = fz * fz * (3 - 2 * fz)
  const a = at(ix, iz), b = at(ix + 1, iz), c = at(ix, iz + 1), d = at(ix + 1, iz + 1)
  return a + (b - a) * sx + (c - a) * sz + (a - b - c + d) * sx * sz
}
const smooth = (x, a, b) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// how much larger than classic's a board is (the stage's fit: its fog and
// shadows scale by the same)
export const scaleOf = (W, H) => Math.max(1, hypot(W, H) / hypot(40, 28))
// how far outside the mat a point is (0 on it)
export const outside = (W, H, x, z) => hypot(Math.max(0, Math.abs(x) - W / 2), Math.max(0, Math.abs(z) - H / 2))
// the ground's height off the mat: flat by the mat, rolling farther out,
// hills at the haze's edge (k the board's scale)
export function lift(seed, W, H, x, z) {
  const k = scaleOf(W, H), d = outside(W, H, x, z)
  if (d < 6) return 0
  const roll = smooth(d, 6, 30) * 1.4 * noise(seed ^ 0x51ed, x / 16, z / 16)
  const hill = smooth(d, 28 * k, 70 * k) * k * (5 + 15 * noise(seed ^ 0xb1d, x / (38 * k), z / (38 * k)))
  return roll + hill
}

// The times of day a board may be fought at (view/dressing/sky.js has
// their colours): never darker than late golden hour; the powder board's
// own, under its smoke
export const DAYS = Object.freeze(['morning', 'noon', 'afternoon'])
export function dayOf(seed, set) {
  if (set === 'powder') return 'smoke'
  const u = stream(seed, 'day')()
  return u < 0.3 ? 'morning' : u < 0.7 ? 'noon' : 'afternoon'
}

// ---- the table's facts, as placement asks them --------------------------
// A rules piece's footprint: its shape's box on the ground (x, z, half
// sizes, yaw), the nav box's when that is larger (never, today: kept for
// a piece whose shape is the smaller)
export function boxOf(c) {
  const s = c.shape, n = c.nav
  if (n && n.hx * n.hz > s.hx * s.hz) return { x: n.x, z: n.z, hx: n.hx, hz: n.hz, yaw: n.yaw ?? 0 }
  return { x: s.x, z: s.z, hx: s.hx, hz: s.hz, yaw: s.yaw ?? 0 }
}
// a point in a box's own frame (yaw about +y, as the nav's raster)
function local(b, x, z) {
  const dx = x - b.x, dz = z - b.z, c = cos(b.yaw), s = sin(b.yaw)
  return [dx * c - dz * s, dx * s + dz * c]
}
// how far a point is from a box (0 inside it)
export function boxDist(b, x, z) {
  const [lx, lz] = local(b, x, z)
  return hypot(Math.max(0, Math.abs(lx) - b.hx), Math.max(0, Math.abs(lz) - b.hz))
}
// whether a disc of radius r lies inside a box
export function boxHolds(b, x, z, r) {
  const [lx, lz] = local(b, x, z)
  return Math.abs(lx) <= b.hx - r && Math.abs(lz) <= b.hz - r
}
// the boxes, bucketed by 4" cells, for the near ones
function buckets(boxes) {
  const B = 4, map = new Map()
  for (const b of boxes) {
    const reach = hypot(b.hx, b.hz) + CLEAR + 1
    for (let i = Math.floor((b.x - reach) / B); i <= Math.floor((b.x + reach) / B); i++) {
      for (let j = Math.floor((b.z - reach) / B); j <= Math.floor((b.z + reach) / B); j++) {
        const key = i * 4096 + j
        if (!map.has(key)) map.set(key, [])
        map.get(key).push(b)
      }
    }
  }
  return (x, z) => map.get(Math.floor(x / B) * 4096 + Math.floor(z / B)) ?? []
}

// The rules of placement over one table: `ctx` is { W, H, deploy, objectives
// [{x, z}], range, chunks (the match's, as made), nav (its grid) }.
export function rulesOf(ctx) {
  const { W, H, deploy, objectives, range, nav } = ctx
  const boxes = ctx.chunks.map(boxOf)
  const near = buckets(boxes)
  const walk = (x, z) => {
    const i = nav.index(x, z)
    return i >= 0 && !nav.hard[i] && !nav.soft[i] && !(nav.hasHeight && nav.floor[i] > 0.01)
  }
  const offMat = (x, z, r) => Math.abs(x) >= W / 2 + r || Math.abs(z) >= H / 2 + r
  const inPiece = (x, z, r) => near(x, z).some((b) => boxHolds(b, x, z, r))
  const lowOk = (x, z, r) => {
    if (Math.abs(x) > W / 2 - deploy - r || Math.abs(z) > H / 2 - r) return false
    for (const o of objectives) if (hypot(x - o.x, z - o.z) < range + r) return false
    for (const b of near(x, z)) if (boxDist(b, x, z) < CLEAR + r) return false
    return walk(x, z) && walk(x + r, z) && walk(x - r, z) && walk(x, z + r) && walk(x, z - r)
  }
  // an item may stand here: off the mat, inside a piece, or low and clear
  const ok = (x, z, r, h) => offMat(x, z, r) || inPiece(x, z, r) || (h <= LOW && lowOk(x, z, r))
  return { boxes, near, offMat, inPiece, lowOk, ok }
}

// what a rules piece is dressed as
const STONE = new Set(['rock', 'parapet'])
const WOOD = new Set(['crate', 'deck', 'stair', 'post', 'ladder', 'cart', 'keg', 'hulk'])
const GREEN = new Set(['floor', 'tree', 'hedge', 'mushroom', 'stump'])
const ASH = new Set(['crater', 'pyre'])
export function groupOf(c) {
  if (c.kind === 'block') return c.look?.piece === 'log' ? 'wood' : 'stone'
  if (STONE.has(c.kind)) return 'stone'
  if (WOOD.has(c.kind)) return 'wood'
  if (GREEN.has(c.kind)) return 'green'
  if (ASH.has(c.kind)) return 'ash'
  return 'stone'
}
// a piece that stands on the ground (not a parapet on a deck)
const grounded = (c) => c.shape.y - c.shape.hy < 0.05

// ---- the plan ----------------------------------------------------------
// The whole dressing of one table: `ctx` as rulesOf's, plus `seed`
// (dressSeed's) and `set`. Every list is in the seed's order.
export function plan(ctx) {
  const { seed, W, H, deploy, edges, objectives } = ctx
  const k = scaleOf(W, H), area = (W * H) / (40 * 28)
  const R = rulesOf(ctx)
  const day = dayOf(seed, ctx.set)
  const out = { day, k, W, H, stakes: [], grass: [], trees: [], fields: [], hedgerows: [], track: [], decals: [], debris: [], tufts: [], flowers: [] }
  const pieces = ctx.chunks.filter(grounded)

  // the boundary stakes: each mat corner and where each zone meets the long
  // edges, off the mat, in the seat's colour
  for (const s of [0, 1]) {
    const sx = edges[s]
    for (const sz of [-1, 1]) {
      out.stakes.push({ x: sx * (W / 2 + 0.55), z: sz * (H / 2 + 0.55), seat: s, r: 0.1, h: 1.4 })
      out.stakes.push({ x: sx * (W / 2 - deploy), z: sz * (H / 2 + 0.55), seat: s, r: 0.1, h: 1.4 })
    }
  }

  // the fields round the board: a patchwork in a seeded grid, turned a
  // little, from a few inches out to the haze
  {
    const r = stream(seed, 'fields')
    const turn = (r() - 0.5) * 0.5, size = 9 * Math.sqrt(k)
    const reach = 120 * k
    const kinds = ['pasture', 'pasture', 'meadow', 'wheat', 'barley', 'plough', 'fallow']
    for (let gx = -reach; gx < reach; gx += size * (1.1 + r() * 0.4)) {
      for (let gz = -reach; gz < reach; gz += size * (0.9 + r() * 0.5)) {
        const x = gx * cos(turn) - gz * sin(turn), z = gx * sin(turn) + gz * cos(turn)
        const w = size * (0.8 + r() * 0.9), d = size * (0.6 + r() * 0.8)
        const kind = kinds[Math.floor(r() * kinds.length)]
        if (outside(W, H, x, z) < 5 + Math.max(w, d) / 2) {
          r()
          continue
        }
        out.fields.push({ x, z, w, d, yaw: turn, kind, rows: r() })
        if (r() < 0.55) out.hedgerows.push({ x, z, w, d, yaw: turn, sides: Math.floor(r() * 16) })
      }
    }
  }
  // a cart track: in from the haze along one long side, bending round the
  // board's corner and away
  {
    const r = stream(seed, 'track')
    const sz = r() < 0.5 ? -1 : 1, off = H / 2 + 4 + r() * 3
    const from = -W / 2 - 60 * k, to = W / 2 + 60 * k
    for (let i = 0; i <= 40; i++) {
      const x = from + ((to - from) * i) / 40
      out.track.push({ x, z: sz * (off + 3 * sin(x / 13 + r() * 0.2) + (Math.abs(x) > W / 2 + 10 ? (Math.abs(x) - W / 2 - 10) * 0.35 : 0)) })
    }
  }

  // the trees: copses and a wood's edge, from 12" out (nothing tall near
  // the mat, where the camera stands)
  {
    const r = stream(seed, 'trees')
    const put = (x, z, s, kind) => {
      const d = outside(W, H, x, z)
      if (d < 12 || d > 90 * k) return
      out.trees.push({ x, z, y: lift(seed, W, H, x, z), s, yaw: r() * 6.283, kind, tint: r(), r: 1.4 * s, h: 6 * s })
    }
    // a wood along one side
    const side = Math.floor(r() * 4)
    for (let i = 0; i < 170; i++) {
      const t = r() * 2 - 1, depth = 16 + r() * 26 * k
      const along = t * (side < 2 ? W / 2 + 40 * k : H / 2 + 40 * k)
      const [x, z] = side === 0 ? [along, -(H / 2 + depth)] : side === 1 ? [along, H / 2 + depth] : side === 2 ? [-(W / 2 + depth), along] : [W / 2 + depth, along]
      put(x, z, 0.75 + r() * 0.6, r() < 0.45 ? 'pine' : 'broad')
    }
    // copses
    const n = Math.round(12 * Math.min(1.5, k))
    for (let c = 0; c < n; c++) {
      const a = r() * 6.283, dist = 14 + r() * 50 * k
      const cx = cos(a) * (W / 2 + dist), cz = sin(a) * (H / 2 + dist)
      const m = 3 + Math.floor(r() * 9), pine = r() < 0.3
      for (let i = 0; i < m; i++) put(cx + (r() - 0.5) * 9, cz + (r() - 0.5) * 9, 0.6 + r() * 0.6, pine ? 'pine' : 'broad')
    }
    // lone trees along the hedgerows
    for (const h of out.hedgerows) if (r() < 0.35) put(h.x + (r() - 0.5) * h.w, h.z + (r() - 0.5) * h.d, 0.7 + r() * 0.5, 'broad')
    out.trees.length = Math.min(out.trees.length, TREES)
  }

  // the grass off the mat: thick along the mat's edge, taller farther out
  {
    const r = stream(seed, 'grass')
    const n = Math.round(1300 * Math.min(1.25, k))
    const per = 2 * (W + H)
    for (let i = 0; i < n; i++) {
      // round the perimeter, then out from it
      let u = r() * per, x, z
      const d = 0.62 + (i % 3 === 0 ? r() * 12 : r() * r() * 3.2)
      if (u < W) [x, z] = [u - W / 2, -(H / 2 + d)]
      else if ((u -= W) < H) [x, z] = [W / 2 + d, u - H / 2]
      else if ((u -= H) < W) [x, z] = [W / 2 - u, H / 2 + d]
      else [x, z] = [-(W / 2 + d), H / 2 - (u - W)]
      const s = (d < 2 ? 0.8 + r() * 1.2 : 1.4 + r() * 2.4)
      out.grass.push({ x, z, y: lift(seed, W, H, x, z), s, yaw: r() * 6.283, tilt: (r() - 0.5) * 0.5, tint: r(), r: 0.06 * s, h: 0.13 * s })
    }
  }

  // ---- S2: the pieces in the ground ------------------------------------
  // each piece's decals: a soft contact shadow, then worn ground thinning
  // outward, in its group's colours (painted into the mat: anywhere)
  for (const c of pieces) {
    const b = boxOf(c)
    out.decals.push({ kind: groupOf(c), piece: c.kind, x: b.x, z: b.z, hx: b.hx, hz: b.hz, yaw: b.yaw, salt: mix(seed, c.id), r: c.kind === 'floor' ? (c.look?.r ?? b.hx) : 0, color: c.kind === 'floor' ? c.look?.color : null })
  }
  // and the objectives' trodden ground (the marker's base stands on it)
  for (const o of objectives) out.decals.push({ kind: 'trodden', x: o.x, z: o.z, hx: 0.95, hz: 0.95, yaw: 0, salt: mix(seed, hashStr(`o${o.x},${o.z}`)), r: 0 })

  // the debris: round each piece, from CLEAR out, thinner the farther (low
  // clutter); inside a forest's footprint, its leaf litter, twigs and ferns
  {
    const r = stream(seed, 'debris')
    for (const c of pieces) {
      const b = boxOf(c), g = groupOf(c)
      const perim = 4 * (b.hx + b.hz)
      const n = Math.min(14, Math.round(perim * (g === 'green' ? 0.6 : 0.8)))
      for (let i = 0; i < n; i++) {
        // a point on the box's edge, then out along its normal
        const u = r() * perim, d = CLEAR + 0.08 + r() * r() * 1.8
        const [lx, lz, nx, nz] = u < 2 * b.hx ? [u - b.hx, -b.hz, 0, -1] : u < 2 * b.hx + 2 * b.hz ? [b.hx, u - 2 * b.hx - b.hz, 1, 0] : u < 4 * b.hx + 2 * b.hz ? [b.hx - (u - 2 * b.hx - 2 * b.hz), b.hz, 0, 1] : [-b.hx, b.hz - (u - 4 * b.hx - 2 * b.hz), -1, 0]
        const ox = lx + nx * d + (r() - 0.5) * 0.6, oz = lz + nz * d + (r() - 0.5) * 0.6
        const cy = cos(b.yaw), sy = sin(b.yaw)
        const x = b.x + ox * cy + oz * sy, z = b.z - ox * sy + oz * cy
        const kind = g === 'stone' ? 'pebble' : g === 'wood' ? (r() < 0.6 ? 'stick' : 'pebble') : g === 'ash' ? (r() < 0.5 ? 'stick' : 'pebble') : 'leaf'
        const s = 0.6 + r() * 0.8, h = kind === 'pebble' ? 0.07 * s : kind === 'stick' ? 0.04 : 0.01
        const item = { kind, x, z, s, yaw: r() * 6.283, tilt: r(), tint: r(), r: (kind === 'stick' ? 0.2 : 0.08) * s, h, ash: g === 'ash' }
        if (R.ok(x, z, item.r, item.h)) out.debris.push(item)
      }
      // a forest's floor and a tree's own ground: litter, twigs, ferns
      if (c.kind === 'floor' || c.kind === 'tree') {
        const m = c.kind === 'floor' ? 26 : 5
        for (let i = 0; i < m; i++) {
          const x = b.x + (r() * 2 - 1) * b.hx, z = b.z + (r() * 2 - 1) * b.hz
          const roll = r(), kind = roll < 0.5 ? 'leaf' : roll < 0.7 ? 'stick' : 'fern'
          const s = kind === 'fern' ? 0.8 + r() * 0.9 : 0.6 + r() * 0.8
          const item = { kind, x, z, s, yaw: r() * 6.283, tilt: r(), tint: r(), r: (kind === 'fern' ? 0.25 : kind === 'stick' ? 0.2 : 0.08) * s, h: kind === 'fern' ? 0.3 * s : 0.04 }
          if (R.ok(x, z, item.r, item.h)) out.debris.push(item)
        }
      }
    }
    // (a cap, cut from the end: the budget's)
    out.debris.length = Math.min(out.debris.length, DEBRIS)
  }

  // the tufts and flowers, in clumps: by the pieces (where no scythe
  // reaches), along the mat's margins, and a few strewn
  {
    const r = stream(seed, 'tufts')
    const nt = Math.min(2800, Math.round(700 * area)), nf = Math.min(560, Math.round(140 * area))
    const clump = (cx, cz, m, list, make) => {
      for (let j = 0; j < m; j++) {
        const x = cx + (r() - 0.5) * 0.8, z = cz + (r() - 0.5) * 0.8
        const item = make(x, z)
        if (R.ok(x, z, item.r, item.h)) list.push(item)
      }
    }
    const tuft = (x, z) => {
      const s = 0.6 + r() * 1.2
      return { x, z, s, tx: (r() - 0.5) * 0.5, tz: (r() - 0.5) * 0.5, tint: r(), r: 0.04 * s, h: 0.13 * s }
    }
    const flower = (x, z) => ({ x, z, tint: r(), r: 0.05, h: 0.08 })
    const spot = () => {
      const u = r()
      if (u < 0.5 && pieces.length) {
        const b = boxOf(pieces[Math.floor(r() * pieces.length)])
        const a = r() * 6.283, d = CLEAR + 0.3 + r() * 1.4
        return [b.x + cos(a) * (hypot(b.hx, b.hz) * 0.8 + d), b.z + sin(a) * (hypot(b.hx, b.hz) * 0.8 + d)]
      }
      if (u < 0.78) return [(r() - 0.5) * (W - 2 * deploy), (r() < 0.5 ? -1 : 1) * (H / 2 - 0.2 - r() * 1.6)]
      return [(r() - 0.5) * W, (r() - 0.5) * H]
    }
    for (let i = 0; out.tufts.length < nt && i < nt; i++) {
      const [x, z] = spot()
      clump(x, z, 3 + Math.floor(r() * 4), out.tufts, tuft)
    }
    out.tufts.length = Math.min(out.tufts.length, nt)
    for (let i = 0; out.flowers.length < nf && i < nf; i++) {
      const [x, z] = spot()
      clump(x, z, 2 + Math.floor(r() * 3), out.flowers, flower)
    }
    out.flowers.length = Math.min(out.flowers.length, nf)
  }
  return out
}

// Every item the plan stands on the ground (decals, fields and the track,
// which are painted, aside), named by its list: what the check holds to
// the placement rules.
export function standing(p) {
  const out = []
  for (const list of ['stakes', 'grass', 'trees', 'debris', 'tufts', 'flowers']) for (const it of p[list]) out.push({ list, ...it })
  return out
}
