// Procedural park: a convex boundary carved into irregular Voronoi cells.
// Cells are plots, shared cell borders are the walkable trail network.
// Deterministic from a seed so saves can regenerate identical geometry.

import { Delaunay } from 'd3-delaunay'

export function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const R = 29 // nominal park radius; gate sits at +z (south)

// Convex blob boundary: a 24-gon with gentle radius variation.
function makeBoundary(rng) {
  const n = 24
  const wob = 0.5 + rng() * 1.5
  const phase = rng() * Math.PI * 2
  const pts = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const r = R + Math.sin(a * 2 + phase) * wob + Math.sin(a * 3 + phase * 1.7) * wob * 0.5
    pts.push([Math.sin(a) * r, Math.cos(a) * -r]) // start north, go clockwise
  }
  return pts
}

// Boundary winds so that interior points sit on the positive-cross side.
function pointInConvex(poly, x, z) {
  for (let i = 0; i < poly.length; i++) {
    const [ax, az] = poly[i]
    const [bx, bz] = poly[(i + 1) % poly.length]
    if ((bx - ax) * (z - az) - (bz - az) * (x - ax) < 0) return false
  }
  return true
}

// Sutherland–Hodgman clip of an arbitrary polygon against a convex one.
function clipPoly(subject, clip) {
  let out = subject
  for (let i = 0; i < clip.length && out.length; i++) {
    const [ax, az] = clip[i]
    const [bx, bz] = clip[(i + 1) % clip.length]
    const inside = ([x, z]) => (bx - ax) * (z - az) - (bz - az) * (x - ax) >= 0
    const cross = (p, q) => {
      const dx = q[0] - p[0]
      const dz = q[1] - p[1]
      const denom = (bx - ax) * dz - (bz - az) * dx
      const t = denom === 0 ? 0 : ((bx - ax) * (p[1] - az) - (bz - az) * (p[0] - ax)) / -denom
      return [p[0] + dx * t, p[1] + dz * t]
    }
    const next = []
    for (let j = 0; j < out.length; j++) {
      const p = out[j]
      const q = out[(j + 1) % out.length]
      if (inside(p)) {
        next.push(p)
        if (!inside(q)) next.push(cross(p, q))
      } else if (inside(q)) {
        next.push(cross(p, q))
      }
    }
    out = next
  }
  return out
}

function polyArea(poly) {
  let a = 0
  for (let i = 0; i < poly.length; i++) {
    const [x1, z1] = poly[i]
    const [x2, z2] = poly[(i + 1) % poly.length]
    a += x1 * z2 - x2 * z1
  }
  return Math.abs(a) / 2
}

function polyCentroid(poly) {
  let x = 0
  let z = 0
  for (const [px, pz] of poly) {
    x += px
    z += pz
  }
  return [x / poly.length, z / poly.length]
}

// Distance from centroid to the nearest edge — "roominess" of the cell.
function inradius(poly, [cx, cz]) {
  let best = Infinity
  for (let i = 0; i < poly.length; i++) {
    const [ax, az] = poly[i]
    const [bx, bz] = poly[(i + 1) % poly.length]
    const dx = bx - ax
    const dz = bz - az
    const len2 = dx * dx + dz * dz
    const t = len2 ? Math.max(0, Math.min(1, ((cx - ax) * dx + (cz - az) * dz) / len2)) : 0
    const px = ax + dx * t
    const pz = az + dz * t
    best = Math.min(best, Math.hypot(cx - px, cz - pz))
  }
  return best
}

export function makePark(seed) {
  const rng = mulberry32(seed)
  const boundary = makeBoundary(rng)

  // Jittered-grid seeds with a density gradient: fine near the south gate,
  // coarse in the back country — small starter plots, big premium territory.
  const pts = []
  for (let gx = -R; gx <= R; gx += 7.2) {
    for (let gz = -R; gz <= R; gz += 7.2) {
      const south = (gz + R) / (2 * R) // 1 near gate
      if (south > 0.62 && rng() < 0.35) {
        // split some southern cells: finer, cheaper starter land near the gate
        pts.push([gx + (rng() - 0.5) * 5.2, gz + (rng() - 0.5) * 5.2])
      }
      pts.push([gx + (rng() - 0.5) * 5.2, gz + (rng() - 0.5) * 5.2])
    }
  }
  const inside = pts.filter(([x, z]) => pointInConvex(boundary, x * 1.12, z * 1.12))

  // One relaxation pass keeps cells readable without losing irregularity.
  let points = inside
  for (let pass = 0; pass < 1; pass++) {
    const delaunay = Delaunay.from(points)
    const vor = delaunay.voronoi([-R - 6, -R - 6, R + 6, R + 6])
    points = points.map((p, i) => {
      const cell = vor.cellPolygon(i)
      if (!cell) return p
      const [cx, cz] = polyCentroid(cell.slice(0, -1))
      return [(p[0] + cx) / 2, (p[1] + cz) / 2]
    })
  }

  const delaunay = Delaunay.from(points)
  const vor = delaunay.voronoi([-R - 6, -R - 6, R + 6, R + 6])

  // Clip cells to the boundary; collect shared vertices + edges.
  const vertMap = new Map()
  const verts = []
  const vid = (x, z) => {
    const key = `${x.toFixed(2)}|${z.toFixed(2)}`
    if (!vertMap.has(key)) {
      vertMap.set(key, verts.length)
      verts.push([x, z])
    }
    return vertMap.get(key)
  }

  const cells = []
  const edgeMap = new Map()
  for (let i = 0; i < points.length; i++) {
    const raw = vor.cellPolygon(i)
    if (!raw) continue
    const poly = clipPoly(raw.slice(0, -1), boundary)
    if (poly.length < 3) continue
    const area = polyArea(poly)
    if (area < 6) continue
    const centroid = polyCentroid(poly)
    const ids = poly.map(([x, z]) => vid(x, z))
    const cellIdx = cells.length
    for (let j = 0; j < ids.length; j++) {
      const a = ids[j]
      const b = ids[(j + 1) % ids.length]
      if (a === b) continue
      const key = a < b ? `${a}-${b}` : `${b}-${a}`
      if (!edgeMap.has(key)) edgeMap.set(key, { key, a: Math.min(a, b), b: Math.max(a, b), cells: [] })
      edgeMap.get(key).cells.push(cellIdx)
    }
    cells.push({
      id: cellIdx,
      poly,
      vertIds: ids,
      centroid,
      area,
      inradius: inradius(poly, centroid),
      elev: 0.3 + rng() * 0.14,
      terrain: 'meadow',
      neighbors: [],
    })
  }

  const edges = [...edgeMap.values()]
  for (const e of edges) {
    e.length = Math.hypot(verts[e.a][0] - verts[e.b][0], verts[e.a][1] - verts[e.b][1])
    if (e.cells.length === 2) {
      const [c1, c2] = e.cells
      cells[c1].neighbors.push(c2)
      cells[c2].neighbors.push(c1)
    }
  }

  // Terrain: a couple of ponds (interior, roomy), forest clusters, rock.
  const interior = cells.filter((c) => Math.hypot(c.centroid[0], c.centroid[1]) < R - 8 && c.centroid[1] < 8)
  for (let n = 0; n < 2 && interior.length; n++) {
    const pick = interior[Math.floor(rng() * interior.length)]
    if (pick.terrain === 'meadow') {
      pick.terrain = 'water'
      pick.elev = 0.16
    }
  }
  for (let n = 0; n < 3; n++) {
    const seedCell = cells[Math.floor(rng() * cells.length)]
    if (seedCell.terrain !== 'meadow') continue
    seedCell.terrain = 'forest'
    for (const nb of seedCell.neighbors) {
      if (cells[nb].terrain === 'meadow' && rng() < 0.5) cells[nb].terrain = 'forest'
    }
  }
  for (const c of cells) {
    if (c.terrain === 'meadow' && rng() < 0.1) c.terrain = 'rock'
  }

  // Gate: southmost boundary vertex; guests enter the graph here.
  let gateVertex = 0
  for (let i = 0; i < verts.length; i++) {
    if (verts[i][1] > verts[gateVertex][1]) gateVertex = i
  }

  // Adjacency list for pathfinding along trails.
  const adj = verts.map(() => [])
  for (const e of edges) {
    adj[e.a].push({ to: e.b, len: e.length, key: e.key })
    adj[e.b].push({ to: e.a, len: e.length, key: e.key })
  }

  return { seed, boundary, cells, edges, verts, adj, gateVertex, R }
}

// Uniform-ish random point inside a cell, inset from the fence line.
export function randomPointIn(cell, rng = Math.random, inset = 1.0) {
  const [cx, cz] = cell.centroid
  for (let tries = 0; tries < 12; tries++) {
    const a = rng() * Math.PI * 2
    const r = Math.sqrt(rng()) * Math.max(0.4, cell.inradius - inset)
    const x = cx + Math.cos(a) * r
    const z = cz + Math.sin(a) * r
    return { x, z }
  }
  return { x: cx, z: cz }
}

// Shortest path over trail vertices (small graph — plain Dijkstra).
export function shortestPath(park, from, to) {
  const { adj } = park
  const dist = new Array(adj.length).fill(Infinity)
  const prev = new Array(adj.length).fill(-1)
  const done = new Array(adj.length).fill(false)
  dist[from] = 0
  for (;;) {
    let u = -1
    let best = Infinity
    for (let i = 0; i < adj.length; i++) {
      if (!done[i] && dist[i] < best) {
        best = dist[i]
        u = i
      }
    }
    if (u === -1 || u === to) break
    done[u] = true
    for (const { to: v, len } of adj[u]) {
      if (dist[u] + len < dist[v]) {
        dist[v] = dist[u] + len
        prev[v] = u
      }
    }
  }
  if (dist[to] === Infinity) return null
  const path = []
  for (let v = to; v !== -1; v = prev[v]) path.push(v)
  return path.reverse()
}
