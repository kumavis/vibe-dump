// ---------------------------------------------------------------------------
// Getting about the site.
//
// A robot is always on one of four kinds of surface: the dirt, the lower
// scaffold deck, the upper deck, or a roof slope. This module turns "I am here,
// I need to be there" into a list of waypoints that respects those surfaces —
// walking round the house rather than through it, up the ladder rather than
// through the air, and out along the slope once the rafters are on.
//
// A waypoint is { x, y, z, climb }. `climb` marks a ladder move, which the sim
// plays at a different speed and with a different pose.
// ---------------------------------------------------------------------------

import { HOUSE, DECKS, SCAFFOLD } from './config.js'
import { roofTopY, slopeZ } from './plan.js'

/** The house itself is the only thing on the ground you cannot walk through. */
const KX = HOUSE.w / 2 + 0.3
const KZ = HOUSE.d / 2 + 0.3
/** Corners are pushed out slightly so a path hugging the wall doesn't graze it. */
const CX = KX + 0.35
const CZ = KZ + 0.35
const CORNERS = [
  [CX, CZ],
  [CX, -CZ],
  [-CX, -CZ],
  [-CX, CZ],
]

const RX = SCAFFOLD.rx
const RZ = SCAFFOLD.rz
/** Ring legs, in order, as [x0, z0, x1, z1]. u runs anticlockwise from the SW. */
const LEGS = [
  [-RX, RZ, RX, RZ],
  [RX, RZ, RX, -RZ],
  [RX, -RZ, -RX, -RZ],
  [-RX, -RZ, -RX, RZ],
]
const LEG_LEN = LEGS.map(([x0, z0, x1, z1]) => Math.hypot(x1 - x0, z1 - z0))
const LEG_START = LEG_LEN.reduce((acc, l) => (acc.push(acc[acc.length - 1] + l), acc), [0])
const RING_P = LEG_START[4]

/** Where the ladder meets each deck. */
const LADDER = SCAFFOLD.ladder

// --- ground ----------------------------------------------------------------

/** Segment vs. axis-aligned box, slab method. Grazing the edge doesn't count. */
function segHitsHouse(ax, az, bx, bz) {
  const hx = KX - 0.02
  const hz = KZ - 0.02
  const dx = bx - ax
  const dz = bz - az
  let t0 = 0
  let t1 = 1
  // Liang–Barsky: clip the parameter range against each slab in turn.
  const clip = (p, q) => {
    if (Math.abs(p) < 1e-9) return q >= 0
    const r = q / p
    if (p < 0) {
      if (r > t1) return false
      if (r > t0) t0 = r
    } else {
      if (r < t0) return false
      if (r < t1) t1 = r
    }
    return true
  }
  if (!clip(-dx, ax + hx)) return false
  if (!clip(dx, hx - ax)) return false
  if (!clip(-dz, az + hz)) return false
  if (!clip(dz, hz - az)) return false
  return t0 < t1
}

/**
 * Walk the dirt from A to B, going round the house when the straight line
 * would cut through it. Only ever a handful of corners, so brute-forcing the
 * candidate routes is cheaper than any cleverness.
 */
export function groundPath(ax, az, bx, bz) {
  if (!segHitsHouse(ax, az, bx, bz)) return [{ x: bx, y: 0, z: bz }]
  let best = null
  for (let start = 0; start < 4; start++) {
    for (const dir of [1, -1]) {
      for (let n = 1; n <= 3; n++) {
        const pts = []
        let idx = start
        for (let k = 0; k < n; k++) {
          pts.push(CORNERS[idx])
          idx = (idx + dir + 4) % 4
        }
        let ok = !segHitsHouse(ax, az, pts[0][0], pts[0][1])
        for (let k = 0; ok && k < pts.length - 1; k++) {
          ok = !segHitsHouse(pts[k][0], pts[k][1], pts[k + 1][0], pts[k + 1][1])
        }
        const last = pts[pts.length - 1]
        ok = ok && !segHitsHouse(last[0], last[1], bx, bz)
        if (!ok) continue
        let len = Math.hypot(pts[0][0] - ax, pts[0][1] - az)
        for (let k = 0; k < pts.length - 1; k++) {
          len += Math.hypot(pts[k + 1][0] - pts[k][0], pts[k + 1][1] - pts[k][1])
        }
        len += Math.hypot(bx - last[0], bz - last[1])
        if (!best || len < best.len) best = { len, pts }
      }
    }
  }
  const out = best ? best.pts.map(([x, z]) => ({ x, y: 0, z })) : []
  out.push({ x: bx, y: 0, z: bz })
  return out
}

// --- scaffold ring ---------------------------------------------------------

/** Perimeter coordinate of the nearest point on the ring to (x, z). */
export function ringU(x, z) {
  let bestD = Infinity
  let bestU = 0
  for (let i = 0; i < 4; i++) {
    const [x0, z0, x1, z1] = LEGS[i]
    const dx = x1 - x0
    const dz = z1 - z0
    const l2 = dx * dx + dz * dz
    let t = ((x - x0) * dx + (z - z0) * dz) / l2
    t = Math.max(0, Math.min(1, t))
    const px = x0 + dx * t
    const pz = z0 + dz * t
    const d = (px - x) ** 2 + (pz - z) ** 2
    if (d < bestD) {
      bestD = d
      bestU = LEG_START[i] + t * LEG_LEN[i]
    }
  }
  return bestU
}

export function ringPoint(u) {
  let v = ((u % RING_P) + RING_P) % RING_P
  for (let i = 0; i < 4; i++) {
    if (v <= LEG_LEN[i] || i === 3) {
      const t = Math.min(1, v / LEG_LEN[i])
      const [x0, z0, x1, z1] = LEGS[i]
      return { x: x0 + (x1 - x0) * t, z: z0 + (z1 - z0) * t }
    }
    v -= LEG_LEN[i]
  }
  return { x: LEGS[0][0], z: LEGS[0][1] }
}

const mod = (v, m) => ((v % m) + m) % m

/**
 * Waypoints along the decking from one perimeter position to another, going
 * whichever way round is shorter. Corners in between become waypoints so the
 * robot turns at the corner instead of cutting across thin air.
 */
export function ringWalk(y, u0, u1) {
  const fwd = mod(u1 - u0, RING_P)
  const dir = fwd <= RING_P - fwd ? 1 : -1
  const dist = dir === 1 ? fwd : RING_P - fwd
  const hits = []
  for (let i = 0; i < 4; i++) {
    const cu = LEG_START[i]
    const d = dir === 1 ? mod(cu - u0, RING_P) : mod(u0 - cu, RING_P)
    if (d > 1e-3 && d < dist - 1e-3) hits.push({ d, cu })
  }
  hits.sort((a, b) => a.d - b.d)
  const out = hits.map(({ cu }) => {
    const p = ringPoint(cu)
    return { x: p.x, y, z: p.z }
  })
  const end = ringPoint(u1)
  out.push({ x: end.x, y, z: end.z })
  return out
}

// --- roof ------------------------------------------------------------------

/** World position of a point `sd` up the slope on `side`, at x. */
export function roofPoint(x, side, sd) {
  const zAbs = slopeZ(sd)
  return { x, y: roofTopY(zAbs), z: side * zAbs }
}

/** Where the decking meets the slope — the step-across point at the eave. */
function eavePoint(x, side) {
  return roofPoint(x, side, 0)
}

// --- the router ------------------------------------------------------------

const LADDER_U = ringU(LADDER.x, LADDER.z)

/**
 * Full route from a robot's current stance to a target stance.
 * `from` and `to` are both { level, x, y, z, side?, sd? } where level is
 * 0 (dirt), 1 (lower deck), 2 (upper deck) or 'roof'.
 */
export function route(from, to) {
  const wps = []
  let cur = { ...from }

  // Same slope? Straight across it — a line between two points on a plane
  // stays on that plane.
  if (cur.level === 'roof' && to.level === 'roof' && to.side === cur.side) {
    wps.push({ ...roofPoint(to.x, to.side, to.sd), roof: to.side })
    return wps
  }

  // Otherwise come off the roof first, down to the eave and onto the decking.
  if (cur.level === 'roof') {
    wps.push({ ...roofPoint(cur.x, cur.side, 0), roof: cur.side })
    wps.push({ x: cur.x, y: DECKS[2].y, z: cur.side * RZ })
    cur = { level: 2, x: cur.x, y: DECKS[2].y, z: cur.side * RZ }
  }

  const targetDeck = to.level === 'roof' ? 2 : to.level

  // Down the ladder, one flight at a time.
  while (cur.level > targetDeck) {
    const u = ringU(cur.x, cur.z)
    for (const p of ringWalk(DECKS[cur.level].y, u, LADDER_U)) wps.push(p)
    const nextY = cur.level - 1 === 0 ? 0 : DECKS[cur.level - 1].y
    wps.push({ x: LADDER.x, y: nextY, z: LADDER.z, climb: true })
    cur = { level: cur.level - 1, x: LADDER.x, y: nextY, z: LADDER.z }
  }

  // Up the ladder.
  while (cur.level < targetDeck) {
    if (cur.level === 0) {
      for (const p of groundPath(cur.x, cur.z, LADDER.x, LADDER.z)) wps.push(p)
    } else {
      const u = ringU(cur.x, cur.z)
      for (const p of ringWalk(DECKS[cur.level].y, u, LADDER_U)) wps.push(p)
    }
    wps.push({ x: LADDER.x, y: DECKS[cur.level + 1].y, z: LADDER.z, climb: true })
    cur = { level: cur.level + 1, x: LADDER.x, y: DECKS[cur.level + 1].y, z: LADDER.z }
  }

  if (to.level === 'roof') {
    // Walk the top deck round to the target's bay, step across at the eave,
    // then out along the slope.
    const u = ringU(cur.x, cur.z)
    const target = ringU(to.x, to.side * RZ)
    for (const p of ringWalk(DECKS[2].y, u, target)) wps.push(p)
    wps.push({ ...eavePoint(to.x, to.side), roof: to.side })
    wps.push({ ...roofPoint(to.x, to.side, to.sd), roof: to.side })
    return wps
  }

  if (targetDeck === 0) {
    for (const p of groundPath(cur.x, cur.z, to.x, to.z)) wps.push(p)
  } else {
    const u = ringU(cur.x, cur.z)
    for (const p of ringWalk(DECKS[targetDeck].y, u, ringU(to.x, to.z))) wps.push(p)
  }
  return wps
}

/** Which surface a finished route leaves the robot standing on. */
export function stanceOf(to) {
  if (to.level === 'roof') {
    return { level: 'roof', side: to.side, sd: to.sd, x: to.x, y: to.y, z: to.z, tilt: to.tilt ?? 0 }
  }
  return { level: to.level, x: to.x, y: to.y, z: to.z }
}
