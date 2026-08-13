// ---------------------------------------------------------------------------
// Getting about the plot.
//
// A robot is always on one of a few surfaces: the dirt, a scaffold lift, a roof
// slope, or the floor inside the house. This module turns "I am here, I need to
// be there" into waypoints that respect those surfaces — round the house rather
// than through the wall, up the ladder rather than through the air, out along
// the slope once the rafters are on, and in through the front door when the
// furniture arrives.
//
// Everything is plot-local. A waypoint is { x, y, z, climb, roof }.
// ---------------------------------------------------------------------------

import { roofTopY, slopeZ } from './config.js'

let G = null // current house geometry
let HOUSE_BOX = null
let RX = 0
let RZ = 0
let LEGS = []
let LEG_LEN = []
let LEG_START = []
let RING_P = 0
let LADDER = { x: 0, z: 0 }
let LADDER_U = 0
let DOOR = { x: 0, outZ: 0, inZ: 0 }

const mod = (v, m) => ((v % m) + m) % m

/** Point the router at the house currently being built on this plot. */
export function setGeom(geom, doorway) {
  G = geom
  HOUSE_BOX = { x: 0, z: 0, hw: geom.w / 2 + 0.3, hd: geom.d / 2 + 0.3 }
  RX = geom.scaffold.rx
  RZ = geom.scaffold.rz
  LEGS = [
    [-RX, RZ, RX, RZ],
    [RX, RZ, RX, -RZ],
    [RX, -RZ, -RX, -RZ],
    [-RX, -RZ, -RX, RZ],
  ]
  LEG_LEN = LEGS.map(([x0, z0, x1, z1]) => Math.hypot(x1 - x0, z1 - z0))
  LEG_START = LEG_LEN.reduce((acc, l) => (acc.push(acc[acc.length - 1] + l), acc), [0])
  RING_P = LEG_START[4]
  LADDER = geom.scaffold.ladder
  LADDER_U = ringU(LADDER.x, LADDER.z)
  DOOR = {
    x: doorway ? doorway.x : 0,
    outZ: geom.d / 2 + 0.95,
    inZ: geom.d / 2 - geom.t - 0.45,
  }
}

// --- ground ----------------------------------------------------------------
//
// The plot's own house is not the only thing in the way: the finished houses
// further down the street and the site office are solid too. They all go in as
// axis-aligned boxes and the router works a small visibility graph over their
// corners, which is cheap at this scale and always finds a way round.

let EXTRA = []
const CORNER_MARGIN = 0.55

/** Obstacles other than the house on this plot, in plot-local coordinates. */
export function setObstacles(list) {
  EXTRA = list.map((b) => ({ x: b.x, z: b.z, hw: b.hw, hd: b.hd }))
}

const allBoxes = () => (HOUSE_BOX ? [HOUSE_BOX, ...EXTRA] : EXTRA)
const inside = (b, x, z) => Math.abs(x - b.x) < b.hw && Math.abs(z - b.z) < b.hd

/** Segment vs. one box, slab method. Grazing an edge doesn't count. */
function segHitsBox(ax, az, bx, bz, b) {
  const hx = b.hw - 0.02
  const hz = b.hd - 0.02
  const dx = bx - ax
  const dz = bz - az
  const rx = ax - b.x
  const rz = az - b.z
  let t0 = 0
  let t1 = 1
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
  if (!clip(-dx, rx + hx)) return false
  if (!clip(dx, hx - rx)) return false
  if (!clip(-dz, rz + hz)) return false
  if (!clip(dz, hz - rz)) return false
  return t0 < t1
}

function blocked(ax, az, bx, bz, skip) {
  for (const b of allBoxes()) {
    if (skip.has(b)) continue
    if (segHitsBox(ax, az, bx, bz, b)) return true
  }
  return false
}

/**
 * Walk the dirt from A to B, going round whatever is in the way. Boxes that
 * already contain one of the endpoints are ignored, or a robot standing beside
 * a wall could never set off.
 */
export function groundPath(ax, az, bx, bz) {
  const bs = allBoxes()
  const skip = new Set(bs.filter((b) => inside(b, ax, az) || inside(b, bx, bz)))
  if (!blocked(ax, az, bx, bz, skip)) return [{ x: bx, y: 0, z: bz }]

  // nodes: start, every corner of every box still in play, then the target
  const nodes = [{ x: ax, z: az }]
  for (const b of bs) {
    if (skip.has(b)) continue
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        nodes.push({ x: b.x + sx * (b.hw + CORNER_MARGIN), z: b.z + sz * (b.hd + CORNER_MARGIN) })
      }
    }
  }
  nodes.push({ x: bx, z: bz })
  const goal = nodes.length - 1

  const n = nodes.length
  const dist = new Float64Array(n).fill(Infinity)
  const prev = new Int16Array(n).fill(-1)
  const seen = new Uint8Array(n)
  dist[0] = 0
  for (;;) {
    let u = -1
    let best = Infinity
    for (let i = 0; i < n; i++) if (!seen[i] && dist[i] < best) (best = dist[i]), (u = i)
    if (u < 0 || u === goal) break
    seen[u] = 1
    for (let v = 0; v < n; v++) {
      if (seen[v] || v === u) continue
      if (blocked(nodes[u].x, nodes[u].z, nodes[v].x, nodes[v].z, skip)) continue
      const d = dist[u] + Math.hypot(nodes[v].x - nodes[u].x, nodes[v].z - nodes[u].z)
      if (d < dist[v]) {
        dist[v] = d
        prev[v] = u
      }
    }
  }

  if (!isFinite(dist[goal])) return [{ x: bx, y: 0, z: bz }] // hemmed in; go straight
  const out = []
  for (let v = goal; v > 0; v = prev[v]) out.push({ x: nodes[v].x, y: 0, z: nodes[v].z })
  out.reverse()
  return out
}

// --- scaffold ring ---------------------------------------------------------

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
  let v = mod(u, RING_P)
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

/** Waypoints along the decking, going whichever way round is shorter. */
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

export function roofPoint(x, side, sd) {
  const zAbs = slopeZ(G, sd)
  return { x, y: roofTopY(G, zAbs), z: side * zAbs }
}

// --- the router ------------------------------------------------------------

/**
 * Full route from a robot's current stance to a target stance.
 * level is 0 (dirt), 1..n (scaffold lift), 'roof', or 'inside' (the floor).
 */
export function route(from, to) {
  const wps = []
  let cur = { ...from }

  // --- indoors: only ever reached through the front door -------------------
  if (cur.level === 'inside' && to.level === 'inside') {
    wps.push({ x: to.x, y: 0, z: to.z })
    return wps
  }
  if (cur.level === 'inside') {
    wps.push({ x: DOOR.x, y: 0, z: DOOR.inZ })
    wps.push({ x: DOOR.x, y: 0, z: DOOR.outZ })
    cur = { level: 0, x: DOOR.x, y: 0, z: DOOR.outZ }
  }
  if (to.level === 'inside') {
    for (const p of routeToGround(cur, { x: DOOR.x, z: DOOR.outZ })) wps.push(p)
    wps.push({ x: DOOR.x, y: 0, z: DOOR.inZ })
    wps.push({ x: to.x, y: 0, z: to.z })
    return wps
  }

  // --- same slope: straight across it --------------------------------------
  if (cur.level === 'roof' && to.level === 'roof' && to.side === cur.side) {
    wps.push({ ...roofPoint(to.x, to.side, to.sd), roof: to.side })
    return wps
  }

  // --- off the roof, down to the eave and onto the decking -----------------
  if (cur.level === 'roof') {
    wps.push({ ...roofPoint(cur.x, cur.side, 0), roof: cur.side })
    wps.push({ x: cur.x, y: G.decks[2].y, z: cur.side * RZ })
    cur = { level: 2, x: cur.x, y: G.decks[2].y, z: cur.side * RZ }
  }

  const targetDeck = to.level === 'roof' ? 2 : to.level

  while (cur.level > targetDeck) {
    const u = ringU(cur.x, cur.z)
    for (const p of ringWalk(G.decks[cur.level].y, u, LADDER_U)) wps.push(p)
    const nextY = cur.level - 1 === 0 ? 0 : G.decks[cur.level - 1].y
    wps.push({ x: LADDER.x, y: nextY, z: LADDER.z, climb: true })
    cur = { level: cur.level - 1, x: LADDER.x, y: nextY, z: LADDER.z }
  }

  while (cur.level < targetDeck) {
    if (cur.level === 0) {
      for (const p of groundPath(cur.x, cur.z, LADDER.x, LADDER.z)) wps.push(p)
    } else {
      const u = ringU(cur.x, cur.z)
      for (const p of ringWalk(G.decks[cur.level].y, u, LADDER_U)) wps.push(p)
    }
    wps.push({ x: LADDER.x, y: G.decks[cur.level + 1].y, z: LADDER.z, climb: true })
    cur = { level: cur.level + 1, x: LADDER.x, y: G.decks[cur.level + 1].y, z: LADDER.z }
  }

  if (to.level === 'roof') {
    const u = ringU(cur.x, cur.z)
    for (const p of ringWalk(G.decks[2].y, u, ringU(to.x, to.side * RZ))) wps.push(p)
    wps.push({ ...roofPoint(to.x, to.side, 0), roof: to.side })
    wps.push({ ...roofPoint(to.x, to.side, to.sd), roof: to.side })
    return wps
  }

  if (targetDeck === 0) {
    for (const p of groundPath(cur.x, cur.z, to.x, to.z)) wps.push(p)
  } else {
    const u = ringU(cur.x, cur.z)
    for (const p of ringWalk(G.decks[targetDeck].y, u, ringU(to.x, to.z))) wps.push(p)
  }
  return wps
}

/** Bring a robot down to a point on the dirt, from wherever it is standing. */
function routeToGround(from, xz) {
  return route(from, { level: 0, x: xz.x, y: 0, z: xz.z })
}

/** Which surface a finished route leaves the robot standing on. */
export function stanceOf(to) {
  if (to.level === 'roof') {
    return { level: 'roof', side: to.side, sd: to.sd, x: to.x, y: to.y, z: to.z, tilt: to.tilt ?? 0 }
  }
  return { level: to.level, x: to.x, y: to.y ?? 0, z: to.z }
}

export function doorPoints() {
  return { ...DOOR }
}
