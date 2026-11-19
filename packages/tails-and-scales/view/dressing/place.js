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
  // (and the mat's own clutter, its debris, tufts and flowers, wholly on it)
  const onMat = (x, z, r) => Math.abs(x) <= W / 2 - r && Math.abs(z) <= H / 2 - r
  const clutter = (x, z, r, h) => onMat(x, z, r) && ok(x, z, r, h)
  return { boxes, near, offMat, inPiece, lowOk, ok, onMat, clutter }
}

// what a rules piece is dressed as
const STONE = new Set(['rock', 'parapet'])
const WOOD = new Set(['crate', 'deck', 'stair', 'post', 'ladder', 'cart', 'keg', 'hulk'])
// the works: a rampart's, bastion's or keep's deck and stair (earth or
// stone, not a timber platform's), and a stone wall's blocks
const WORKS = new Set(['earth', 'stone'])
const GREEN = new Set(['floor', 'tree', 'hedge', 'mushroom', 'stump'])
const ASH = new Set(['crater', 'pyre'])
export function groupOf(c) {
  if ((c.kind === 'deck' || c.kind === 'stair' || c.kind === 'parapet') && WORKS.has(c.look?.material)) return 'fort'
  if (c.kind === 'block') return c.look?.piece === 'log' ? 'wood' : 'fort'
  if (STONE.has(c.kind)) return 'stone'
  if (WOOD.has(c.kind)) return 'wood'
  if (GREEN.has(c.kind)) return 'green'
  if (ASH.has(c.kind)) return 'ash'
  return 'stone'
}
// a piece that stands on the ground (not a parapet on a deck)
const grounded = (c) => c.shape.y - c.shape.hy < 0.05

// ---- S3: the lanes ------------------------------------------------------
// The ways the armies would walk, found on a grid of the view's own (CELL
// tails a cell) over the table as made: a cell is shut where a rules piece
// stands (its box and a little more) or the nav grid says nobody walks
// (read, never asked to plan); open ground costs least, a corridor between
// pieces and rough ground more, and a seeded noise lets a lane wander as
// worn tracks do. A* in plain arithmetic, ties broken by the cell's index,
// so every engine finds the same lanes. They run between the objectives (a
// tree spanning them), in from each army's edge to its nearest objective,
// from the objective nearest the cart track out to it, and from each
// ladder's foot to its nearest objective; where lanes share ground the wear
// adds up, and a lane through a gap or at a ladder's foot wears hardest.
const CELL = 0.5
function lanesOf(ctx, R, seed, trackSide) {
  const { W, H, edges, objectives, nav } = ctx
  const nx = Math.round(W / CELL), nz = Math.round(H / CELL), N = nx * nz
  const cx = (i) => -W / 2 + ((i % nx) + 0.5) * CELL, cz = (i) => -H / 2 + (Math.floor(i / nx) + 0.5) * CELL
  const at = (x, z) => {
    const ix = Math.floor((x + W / 2) / CELL), iz = Math.floor((z + H / 2) / CELL)
    return ix < 0 || iz < 0 || ix >= nx || iz >= nz ? -1 : iz * nx + ix
  }
  const shut = new Uint8Array(N), cost = new Float64Array(N), clear = new Float64Array(N)
  for (let i = 0; i < N; i++) {
    const x = cx(i), z = cz(i)
    let c = 9
    for (const b of R.near(x, z)) c = Math.min(c, boxDist(b, x, z))
    clear[i] = c
    const j = nav.index(x, z)
    const walk = j >= 0 && !nav.hard[j] && !nav.soft[j] && !(nav.hasHeight && nav.floor[j] > 0.01)
    if (c < 0.3 || !walk) shut[i] = 1
    cost[i] = 1 + 2.4 * Math.max(0, 1 - c / 1.6) + (j >= 0 && nav.diff[j] ? 1.4 : 0) + 0.9 * noise(seed ^ 0x1a7e, x / 5, z / 5)
  }
  // the nearest open cell to a point (a spiral out, at most 6 tails)
  const open = (x, z) => {
    for (let d = 0; d <= 12; d++) {
      for (let a = -d; a <= d; a++) {
        for (const [dx, dz] of [[a, -d], [a, d], [-d, a], [d, a]]) {
          const i = at(x + dx * CELL, z + dz * CELL)
          if (i >= 0 && !shut[i]) return i
        }
      }
    }
    return -1
  }
  const g = new Float64Array(N), from = new Int32Array(N), seen = new Uint32Array(N)
  let gen = 0
  const DIRS = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, Math.SQRT2], [1, -1, Math.SQRT2], [-1, 1, Math.SQRT2], [-1, -1, Math.SQRT2]]
  const find = (a, b) => {
    if (a < 0 || b < 0) return null
    gen++
    const heap = [], push = (f, i) => {
      heap.push([f, i])
      let k = heap.length - 1
      while (k > 0) {
        const up = (k - 1) >> 1
        if (heap[up][0] < f || (heap[up][0] === f && heap[up][1] < i)) break
        ;[heap[k], heap[up]] = [heap[up], heap[k]]
        k = up
      }
    }
    const pop = () => {
      const top = heap[0], last = heap.pop()
      if (heap.length) {
        heap[0] = last
        let k = 0
        for (;;) {
          const l = 2 * k + 1, r = l + 1
          let m = k
          if (l < heap.length && (heap[l][0] < heap[m][0] || (heap[l][0] === heap[m][0] && heap[l][1] < heap[m][1]))) m = l
          if (r < heap.length && (heap[r][0] < heap[m][0] || (heap[r][0] === heap[m][0] && heap[r][1] < heap[m][1]))) m = r
          if (m === k) break
          ;[heap[k], heap[m]] = [heap[m], heap[k]]
          k = m
        }
      }
      return top
    }
    const bx = b % nx, bz = Math.floor(b / nx)
    const hOf = (i) => hypot((i % nx) - bx, Math.floor(i / nx) - bz)
    seen[a] = gen
    g[a] = 0
    from[a] = -1
    push(hOf(a), a)
    while (heap.length) {
      const [f, i] = pop()
      if (i === b) break
      if (f - hOf(i) > g[i] + 1e-9) continue
      const ix = i % nx, iz = Math.floor(i / nx)
      for (const [dx, dz, len] of DIRS) {
        const jx = ix + dx, jz = iz + dz
        if (jx < 0 || jz < 0 || jx >= nx || jz >= nz) continue
        const j = jz * nx + jx
        if (shut[j]) continue
        const ng = g[i] + len * (cost[i] + cost[j]) * 0.5
        if (seen[j] === gen && ng >= g[j]) continue
        seen[j] = gen
        g[j] = ng
        from[j] = i
        push(ng + hOf(j), j)
      }
    }
    if (seen[b] !== gen) return null
    const cells = []
    for (let i = b; i >= 0; i = from[i]) cells.push(i)
    return cells.reverse()
  }
  // a lane's points: the cells' centres, smoothed twice (Chaikin), each
  // with its wear: more in a narrow gap, more yet at its `hard` ends
  const lane = (cells, w, hardA = false, hardB = false) => {
    let pts = cells.map((i) => [cx(i), cz(i), clear[i]])
    for (let k = 0; k < 2; k++) {
      const next = [pts[0]]
      for (let i = 0; i < pts.length - 1; i++) {
        const [a, b] = [pts[i], pts[i + 1]]
        next.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25, Math.min(a[2], b[2])], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75, Math.min(a[2], b[2])])
      }
      next.push(pts[pts.length - 1])
      pts = next
    }
    const n = pts.length
    return { w, pts: pts.map(([x, z, c], i) => [x, z, Math.min(2, 1 + 0.8 * Math.max(0, 1 - c / 1.4) + (hardA ? Math.max(0, 1 - i / 8) : 0) + (hardB ? Math.max(0, 1 - (n - 1 - i) / 8) : 0))]) }
  }
  const out = { paths: [], roads: [], spur: null }
  const r = stream(seed, 'lanes')
  const objs = objectives.map((o) => open(o.x, o.z))
  // the tree spanning the objectives (Prim's, from the first)
  if (objs.length > 1) {
    const inT = [0]
    while (inT.length < objs.length) {
      let best = null
      for (const a of inT) for (let b = 0; b < objs.length; b++) {
        if (inT.includes(b)) continue
        const d = hypot(objectives[a].x - objectives[b].x, objectives[a].z - objectives[b].z)
        if (!best || d < best[2]) best = [a, b, d]
      }
      inT.push(best[1])
      const cells = find(objs[best[0]], objs[best[1]])
      if (cells) out.paths.push(lane(cells, 0.8))
    }
  }
  const nearestObj = (x, z) => objectives.reduce((m, o, k) => (hypot(o.x - x, o.z - z) < hypot(objectives[m].x - x, objectives[m].z - z) ? k : m), 0)
  // each army's road in from its own edge
  for (const s of [0, 1]) {
    const sx = edges[s], z = (r() - 0.5) * H * 0.5, x = sx * (W / 2 - 0.3)
    const cells = find(open(x, z), objs[nearestObj(x, z)])
    if (!cells) continue
    out.paths.push(lane(cells, 1.0, true))
    const [x0, z0] = [cx(cells[0]), cz(cells[0])]
    out.roads.push({ x: sx * W / 2, z: z0, sx, from: [x0, z0] })
  }
  // the spur out to the cart track
  {
    const sz = trackSide, k = objectives.reduce((m, o, j) => (o.z * sz > objectives[m].z * sz ? j : m), 0)
    const x = objectives[k].x + (r() - 0.5) * 4, z = sz * (H / 2 - 0.3)
    const cells = find(objs[k], open(x, z))
    if (cells) {
      out.paths.push(lane(cells, 0.7, false, true))
      out.spur = { x: cx(cells[cells.length - 1]), z: sz * H / 2, sz }
    }
  }
  // each ladder's foot, worn hardest, to its nearest objective
  for (const c of ctx.chunks) {
    if (!c.link?.foot) continue
    const f = c.link.foot, a = open(f.x, f.z)
    const cells = find(a, objs[nearestObj(f.x, f.z)])
    if (cells) out.paths.push(lane(cells, 0.7, true))
  }
  // the cells a lane covers (no clutter stands on a lane)
  const worn = new Uint8Array(N)
  for (const pth of out.paths) for (const [x, z] of pth.pts) {
    for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) {
      const i = at(x + dx * CELL * 0.8, z + dz * CELL * 0.8)
      if (i >= 0) worn[i] = 1
    }
  }
  out.worn = (x, z) => {
    const i = at(x, z)
    return i >= 0 && worn[i] === 1
  }
  return out
}

// ---- the plan ----------------------------------------------------------
// The whole dressing of one table: `ctx` as rulesOf's, plus `seed`
// (dressSeed's) and `set`. Every list is in the seed's order.
export function plan(ctx) {
  const { seed, W, H, deploy, edges, objectives } = ctx
  const k = scaleOf(W, H), area = (W * H) / (40 * 28)
  const R = rulesOf(ctx)
  const day = dayOf(seed, ctx.set)
  const out = { seed, day, k, W, H, stakes: [], grass: [], trees: [], fields: [], hedgerows: [], track: [], decals: [], debris: [], tufts: [], flowers: [] }
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
  // little, from a few tails out to the haze
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

  // ---- S3: the lanes, painted (ground.js); no clutter stands on one -----
  {
    const L = lanesOf(ctx, R, seed, stream(seed, 'track')() < 0.5 ? -1 : 1)
    out.lanes = L.paths
    out.roads = L.roads
    out.spur = L.spur
    const clutter = R.clutter
    R.clutter = (x, z, rr, h) => !L.worn(x, z) && clutter(x, z, rr, h)
  }

  // the trees: copses and a wood's edge, from 12 tails out (nothing tall near
  // the mat, where the camera stands)
  {
    const r = stream(seed, 'trees')
    const put = (x, z, s, kind) => {
      const d = outside(W, H, x, z)
      if (d < 12 || d > 90 * k) return
      out.trees.push({ x, z, y: lift(seed, W, H, x, z), s, yaw: r() * 6.283, kind, tint: r(), r: 1.4 * s, h: 6 * s })
    }
    // a wood along one side, in two or three stands with open ground
    // between them, from 20 tails back: never one wall of trunks across
    // the view (dressing-check projects it into the battle's views)
    const side = Math.floor(r() * 4)
    const stands = 2 + Math.floor(r() * 2)
    for (let i = 0; i < 170; i++) {
      const j = i % stands, c = -1 + (2 * j + 1) / stands + (r() - 0.5) * 0.12
      const t = c + (r() * 2 - 1) * (0.5 / stands), depth = 20 + r() * 24 * k
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
    const floor = c.kind === 'floor'
    out.decals.push({ kind: groupOf(c), piece: c.kind, x: b.x, z: b.z, hx: b.hx, hz: b.hz, yaw: b.yaw, salt: mix(seed, c.id), r: floor ? (c.look?.r ?? b.hx) : 0, color: floor ? c.look?.color : null, rim: floor ? c.look?.rim : null, cx: c.shape.x, cz: c.shape.z })
    // a ladder's foot, where every climber stands: the heaviest wear
    if (c.link?.foot) out.decals.push({ kind: 'trodden', x: c.link.foot.x, z: c.link.foot.z, hx: 0.75, hz: 0.75, yaw: 0, salt: mix(seed, c.id + 7777), r: 0, heavy: true })
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
        const kind = g === 'stone' || g === 'fort' ? 'pebble' : g === 'wood' ? (r() < 0.6 ? 'stick' : 'pebble') : g === 'ash' ? (r() < 0.5 ? 'stick' : 'pebble') : 'leaf'
        const s = 0.6 + r() * 0.8, h = kind === 'pebble' ? 0.07 * s : kind === 'stick' ? 0.04 : 0.01
        const item = { kind, x, z, s, yaw: r() * 6.283, tilt: r(), tint: r(), r: (kind === 'stick' ? 0.2 : 0.08) * s, h, ash: g === 'ash' }
        if (R.clutter(x, z, item.r, item.h)) out.debris.push(item)
      }
      // a forest's floor and a tree's own ground: litter, twigs, ferns
      if (c.kind === 'floor' || c.kind === 'tree') {
        const m = c.kind === 'floor' ? 44 : 5
        for (let i = 0; i < m; i++) {
          const x = b.x + (r() * 2 - 1) * b.hx, z = b.z + (r() * 2 - 1) * b.hz
          const roll = r(), kind = roll < 0.4 ? 'leaf' : roll < 0.55 ? 'stick' : 'fern'
          const s = kind === 'fern' ? 0.8 + r() * 0.9 : 0.6 + r() * 0.8
          const item = { kind, x, z, s, yaw: r() * 6.283, tilt: r(), tint: r(), r: (kind === 'fern' ? 0.25 : kind === 'stick' ? 0.2 : 0.08) * s, h: kind === 'fern' ? 0.3 * s : 0.04 }
          if (R.clutter(x, z, item.r, item.h)) out.debris.push(item)
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
        if (R.clutter(x, z, item.r, item.h)) list.push(item)
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
