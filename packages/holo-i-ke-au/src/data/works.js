// The works (DATA.md "Works, dated"): what was built on the land and when,
// from works/<island>.geojson to what the island draws (features/works.js)
// and what its settlements keep off (features/settlements.js, towns.js).
// Pure functions on plain data, so the decode runs in the works' worker
// (works-worker.js) or, failing that, on the main thread.
//
// One island's file becomes, all at once and every year together:
//
// - the washes: each `land`, `range` and `field` polygon triangulated
//   (earcut) and then cut along a grid of WASH_CELL, so the wash can follow
//   the ground between its corners (each vertex looks the ground up in the
//   vertex shader, as the boundaries do); the cuts fall on the same grid
//   lines for every triangle, so neighbours meet at the same vertices and
//   no crack opens between them. Every vertex carries its polygon's years.
// - the boundaries of the military land, its rings split to EDGE_STEP with
//   the distance along them, for the dashes.
// - the ribbons: runways, roads, piers and breakwaters, rail, each a
//   polyline resampled to RIBBON_STEP with its width in world units and its
//   years, and again thinned to COARSE_STEP for the island zoom; a road's
//   stretch through a `tunnel` of its own work is left out, and a work with
//   `built` grows along its length over those years.
// - the blocks: one building each, at a point or fitted to a footprint
//   (the polygon's principal axes), with its storeys, its use and its
//   years (BLOCK_STRIDE floats each); across a `built` span each comes up
//   in a year of its own.
// - the names: the military land's, an airfield's and each named road's,
//   one item each with its place, its years and its size (the larger first).
// - what the settlements keep off (WorksExclusion): the military land, the
//   ranges, the fields and the blocks' footprints, and the runways, roads,
//   rail, piers and breakwaters as strips of their width, each from the year
//   it was taken or begun to the year after its `to`; and the same index
//   asked for the trees (TREELESS: what a tree never stands on in its years).
//
// Years: a work stands from its `from` (fading in over the year before, so
// in its `from` it is whole) to its `to` (fading out over the year after,
// so in its `to` it still stands, and is gone after); with `built`, it
// comes in across those years instead. workSpan() gives the four years,
// workWeight() the CPU copy of what the shaders make of them.

import { Earcut } from 'three/src/extras/Earcut.js'
import { Projection } from '../geo.js'

// world units (100 m)
const WASH_CELL = 1.5
const EDGE_STEP = 1.5
const RIBBON_STEP = 0.25
// and the ribbons again, coarser, for the island zoom: a point about every 100 m
const COARSE_STEP = 1

/** The vocabulary (DATA.md): each kind's parts. */
export const PARTS = {
  military: ['land', 'runway', 'pier', 'block', 'range'],
  airport: ['field', 'runway', 'block'],
  highway: ['road', 'tunnel'],
  rail: ['line'],
  harbour: ['breakwater', 'pier'],
}
/** A road's drawn width by its class, metres, where it gives neither its width nor its lanes. */
export const ROAD_WIDTH = { interstate: 24, state: 12, county: 8 }

/** A road's or a tunnel's width in metres: its own, else its lanes' (as the bake reckons them), else its class's. */
function roadWidth(p, fallback) {
  const lanes = Number(p.lanes)
  return Number(p.width) || (lanes > 0 ? lanes * 3.6 + 2 : 0) || ROAD_WIDTH[p.class] || fallback
}
// widths when the file gives none, metres
const WIDTH = { runway: 45, pier: 15, breakwater: 12, road: 10, line: 3.5, tunnel: 12 }
/** The washes' tones, as the shader indexes them. */
export const TONE = { land: 0, range: 1, field: 2 }
/** The ribbons' looks, one batch each. */
export const LOOKS = ['runway', 'road', 'stone', 'rail']
/** A block's `use` (DATA.md), as its record codes it (1 + the index; 0 none or another). */
export const USES = ['hangar', 'barracks', 'hospital', 'warehouse', 'industrial', 'office', 'school', 'church', 'residential', 'tower']
/** Floats a block takes: x, z, dir, L, W, storeys, use, and its four years. */
export const BLOCK_STRIDE = 11
/** The parts no tree stands on while they do (the land, a range and the roads and rail have trees beside and on them). */
export const TREELESS = new Set(['block', 'runway', 'field', 'pier', 'breakwater'])

// A block's kit (buildings.js worksKits) by its `use` first (DATA.md
// "Accepted extensions"), and the storeys a use stands at where the file
// gives none: Tripler a tall concrete block, a base's chapel a church, its
// quarters houses. A block with no use, or another, goes by its storeys
// and its size.
const USE_KIND = { hangar: 'hangar', barracks: 'barracks', hospital: 'block', office: 'block', school: 'block', tower: 'tower', warehouse: 'low', industrial: 'low', church: 'church', residential: 'house' }
const USE_STOREYS = { barracks: 2, hospital: 6, office: 4, school: 2, tower: 12 }

/** A block's kind and storeys: by its use, else by its storeys and its footprint's area (m²; 0 for a point). */
export function blockKind(use, storeys, area) {
  const st = storeys || USE_STOREYS[use] || 0
  const byUse = USE_KIND[use]
  if (byUse === 'barracks') return { kind: st >= 3 ? 'barracks3' : 'barracks2', storeys: st }
  if (byUse) return { kind: byUse, storeys: st }
  if (storeys >= 4) return { kind: 'block', storeys }
  if (storeys === 3) return { kind: 'barracks3', storeys }
  if (storeys === 2) return { kind: 'barracks2', storeys }
  if (storeys === 1) return { kind: area && area < 900 ? 'low' : 'hangar', storeys }
  return { kind: area > 2500 ? 'hangar' : 'barracks2', storeys }
}
/** Each kind's size as built, metres along and across (buildings.js worksKits), and a block given as a point drawn at BLOCK_POINT_S: the ground it keeps. */
const BLOCK_SIZE = { hangar: [60, 48], barracks2: [56, 16], barracks3: [56, 16], low: [26, 14], block: [30, 22], tower: [29, 18], church: [25, 45], house: [9.8, 8.6] }
/** World units per metre a block given as a point is drawn at: a little over life. */
export const BLOCK_POINT_S = 0.013
const LOOK_OF = { runway: 'runway', road: 'road', pier: 'stone', breakwater: 'stone', line: 'rail' }

const NEVER = 1e5

/**
 * A work's years: [in0, in1, out0, out1], fading in from in0 to in1 and out
 * from out0 to out1 (kit.js aSpan's convention). Without `built`, whole in
 * its `from` and still standing in its `to`; with it, coming in across
 * those years.
 */
export function workSpan(p) {
  const from = Number.isFinite(p?.from) ? p.from : null
  const to = Number.isFinite(p?.to) ? p.to : null
  const b = builtOf(p)
  let a0
  let a1
  if (b) {
    a0 = Math.min(b[0], from ?? b[0])
    a1 = Math.max(b[1], a0 + 1)
  } else if (from !== null) {
    a0 = from - 1
    a1 = from
  } else {
    a0 = -NEVER
    a1 = -NEVER + 1
  }
  return to !== null ? [a0, a1, to, to + 1] : [a0, a1, NEVER, NEVER + 1]
}

const smooth = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** How much of a work shows in a (fractional) year: the shaders' weight, on the CPU. */
export function workWeight(span, y) {
  return smooth(span[0], span[1], y) * (1 - smooth(span[2], span[3], y))
}

/** A work's years of building, [start, end], or null. */
function builtOf(p) {
  return Array.isArray(p?.built) && p.built.length === 2 && p.built.every(Number.isFinite) ? [...p.built].sort((x, y) => x - y) : null
}

/** The years a work keeps the settlements off its ground: from when it was taken or begun to the year after its `to`. */
function keepOff(p, span) {
  const from = Number.isFinite(p?.from) ? p.from : null
  const start = builtOf(p) ? Math.floor(span[0]) : from !== null ? from : -NEVER
  const end = Number.isFinite(p?.to) ? p.to + 1 : Infinity
  return [start, end]
}

// --- geometry --------------------------------------------------------------------

/** A Polygon's or MultiPolygon's polygons, each a list of rings of [lon, lat]. */
function polygonsOf(g) {
  if (!g) return []
  if (g.type === 'Polygon') return [g.coordinates]
  if (g.type === 'MultiPolygon') return g.coordinates
  return []
}

/** A LineString's or MultiLineString's lines. */
function linesOf(g) {
  if (!g) return []
  if (g.type === 'LineString') return [g.coordinates]
  if (g.type === 'MultiLineString') return g.coordinates
  return []
}

function pointsOf(g) {
  if (!g) return []
  if (g.type === 'Point') return [g.coordinates]
  if (g.type === 'MultiPoint') return g.coordinates
  return []
}

/** A ring in world units, without its closing point. */
function worldRing(ring, proj) {
  const out = ring.map((c) => proj.toWorld(c))
  if (out.length > 1) {
    const a = out[0]
    const b = out[out.length - 1]
    if (Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9) out.pop()
  }
  return out
}

function ringArea(r) {
  let a = 0
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += (r[j][0] - r[i][0]) * (r[j][1] + r[i][1])
  return a / 2
}

/** Even-odd over every ring of a polygon (flat x, z arrays). */
export function insideRings(rings, x, z) {
  let c = false
  for (const r of rings) {
    const n = r.length / 2
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const ax = r[i * 2]
      const az = r[i * 2 + 1]
      const bx = r[j * 2]
      const bz = r[j * 2 + 1]
      if (az > z !== bz > z && x < ((bx - ax) * (z - az)) / (bz - az) + ax) c = !c
    }
  }
  return c
}

/** One plane of Sutherland–Hodgman: keep the side of axis (0 x, 1 z) where sign·(v − c) ≥ 0. */
function clipPlane(poly, axis, c, sign) {
  const out = []
  const n = poly.length
  for (let i = 0; i < n; i++) {
    const p = poly[i]
    const q = poly[(i + 1) % n]
    const dp = (p[axis] - c) * sign
    const dq = (q[axis] - c) * sign
    if (dp >= 0) out.push(p)
    if (dp >= 0 !== dq >= 0) {
      const t = dp / (dp - dq)
      out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t])
    }
  }
  return out
}

/**
 * A polygon's rings (world, [x, z]) as triangles cut to the grid: earcut,
 * then each triangle clipped to every cell it meets. Vertices are shared
 * within the polygon (by position, to a few centimetres).
 */
function tessellate(rings, cell = WASH_CELL) {
  const flat = []
  const holes = []
  rings.forEach((r, k) => {
    if (k) holes.push(flat.length / 2)
    for (const [x, z] of r) flat.push(x, z)
  })
  const tri = Earcut.triangulate(flat, holes, 2)
  const pos = []
  const index = []
  const seen = new Map()
  const vert = (x, z) => {
    const key = Math.round(x * 2000) * 1e8 + Math.round(z * 2000)
    let i = seen.get(key)
    if (i === undefined) {
      i = pos.length / 2
      seen.set(key, i)
      pos.push(x, z)
    }
    return i
  }
  for (let t = 0; t < tri.length; t += 3) {
    const P = [tri[t], tri[t + 1], tri[t + 2]].map((i) => [flat[i * 2], flat[i * 2 + 1]])
    const x0 = Math.min(P[0][0], P[1][0], P[2][0])
    const x1 = Math.max(P[0][0], P[1][0], P[2][0])
    const z0 = Math.min(P[0][1], P[1][1], P[2][1])
    const z1 = Math.max(P[0][1], P[1][1], P[2][1])
    const i0 = Math.floor(x0 / cell)
    const i1 = Math.floor(x1 / cell)
    const j0 = Math.floor(z0 / cell)
    const j1 = Math.floor(z1 / cell)
    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        let poly = P
        if (i0 !== i1) poly = clipPlane(clipPlane(poly, 0, i * cell, 1), 0, (i + 1) * cell, -1)
        if (poly.length >= 3 && j0 !== j1) poly = clipPlane(clipPlane(poly, 1, j * cell, 1), 1, (j + 1) * cell, -1)
        if (poly.length < 3) continue
        const ids = poly.map(([x, z]) => vert(x, z))
        for (let k = 1; k + 1 < ids.length; k++) {
          const a = ids[0]
          const b = ids[k]
          const c = ids[k + 1]
          if (a === b || b === c || a === c) continue
          const ar = (pos[b * 2] - pos[a * 2]) * (pos[c * 2 + 1] - pos[a * 2 + 1]) - (pos[c * 2] - pos[a * 2]) * (pos[b * 2 + 1] - pos[a * 2 + 1])
          if (Math.abs(ar) < 1e-9) continue
          index.push(a, b, c)
        }
      }
    }
  }
  return { pos, index, tri, flat }
}

/** A polyline resampled to about `step` world units. */
function resample(pts, step) {
  const out = [pts[0]]
  for (let i = 0; i + 1 < pts.length; i++) {
    const [ax, az] = pts[i]
    const [bx, bz] = pts[i + 1]
    const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / step))
    for (let k = 1; k <= n; k++) out.push([ax + ((bx - ax) * k) / n, az + ((bz - az) * k) / n])
  }
  return out
}

/** The distance from (x, z) to segment a–b. */
function segDist(x, z, ax, az, bx, bz) {
  const dx = bx - ax
  const dz = bz - az
  const L2 = dx * dx + dz * dz
  const t = L2 > 0 ? Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / L2)) : 0
  return Math.hypot(x - ax - dx * t, z - az - dz * t)
}

/** A block's ground kept, as WorksExclusion holds it: the box of half extents hx, hz about (x, z), its length along `dir`. */
function boxRing(x, z, dir, hx, hz, start, end) {
  const c = Math.cos(dir)
  const s = Math.sin(dir)
  const ring = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => [x + u * hx * c - v * hz * s, z + u * hx * s + v * hz * c])
  return { rings: [Float32Array.from(ring.flat())], box: boxOf([ring]), start, end, part: 'block' }
}

/** A footprint's principal axes: centre, turn, length and width (world units), from a ring. */
function footprint(ring) {
  let cx = 0
  let cz = 0
  for (const [x, z] of ring) {
    cx += x / ring.length
    cz += z / ring.length
  }
  let sxx = 0
  let szz = 0
  let sxz = 0
  for (const [x, z] of ring) {
    sxx += (x - cx) ** 2
    szz += (z - cz) ** 2
    sxz += (x - cx) * (z - cz)
  }
  const th = 0.5 * Math.atan2(2 * sxz, sxx - szz)
  const ux = [Math.cos(th), Math.sin(th)]
  let u0 = Infinity
  let u1 = -Infinity
  let v0 = Infinity
  let v1 = -Infinity
  for (const [x, z] of ring) {
    const u = (x - cx) * ux[0] + (z - cz) * ux[1]
    const v = -(x - cx) * ux[1] + (z - cz) * ux[0]
    u0 = Math.min(u0, u)
    u1 = Math.max(u1, u)
    v0 = Math.min(v0, v)
    v1 = Math.max(v1, v)
  }
  const mu = (u0 + u1) / 2
  const mv = (v0 + v1) / 2
  return { x: cx + mu * ux[0] - mv * ux[1], z: cz + mu * ux[1] + mv * ux[0], dir: th, L: u1 - u0, W: v1 - v0 }
}

function hash(i, s = 0) {
  let h = (i * 374761393 + s * 668265263) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

// --- the decode -----------------------------------------------------------------------

function ribbonBatch() {
  return { seg: [], info: [], end: [], span: [], grow: [], n: 0 }
}

/** A polyline's segments into a batch, those `cut` says to leave out left out, with the distance along it. */
function pushLine(B, pts, w, span, growing, cut) {
  let total = 0
  for (let i = 0; i + 1 < pts.length; i++) total += Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1])
  let s = 0
  for (let i = 0; i + 1 < pts.length; i++) {
    const [ax, az] = pts[i]
    const [bx, bz] = pts[i + 1]
    const L = Math.hypot(bx - ax, bz - az)
    if (L < 1e-6) continue
    if (!cut((ax + bx) / 2, (az + bz) / 2)) {
      B.seg.push(ax, az, bx, bz)
      B.info.push(w, w, s, s + L)
      B.end.push(total)
      B.span.push(...span)
      B.grow.push(growing ? 1 : 0)
      B.n++
    }
    s += L
  }
  return total
}

/** A resampled polyline thinned to a point about every `step` (its ends kept). */
function thin(pts, step) {
  const out = [pts[0]]
  let d = 0
  for (let i = 1; i < pts.length; i++) {
    d += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
    if (d >= step * 0.9 || i === pts.length - 1) {
      out.push(pts[i])
      d = 0
    }
  }
  return out
}

/**
 * One island's works file, decoded (see the head of this file). `fc` is the
 * FeatureCollection; `opts` { lat0, lon0 } the projection. Every array
 * comes back typed, so it can be handed over without a copy (transfers).
 */
export function decodeWorks(fc, { lat0 = 20.5, lon0 = -157.5 } = {}) {
  const t0 = Date.now()
  const proj = new Projection({ lat0, lon0 })
  const feats = []
  const wash = { pos: [], span: [], tone: [], index: [] }
  const edges = { seg: [], s: [], span: [] }
  const ribbons = Object.fromEntries(LOOKS.map((l) => [l, { fine: ribbonBatch(), coarse: ribbonBatch(), length: 0 }]))
  const blocks = []
  const labels = []
  const excl = { polys: [], lines: [] }
  const counts = {}
  const all = (fc?.features || []).filter((f) => f?.properties && f.geometry)
  // the tunnels first: a road leaves out its stretch through one of its own work's
  const tunnels = []
  for (const f of all) {
    const p = f.properties
    if (p.part !== 'tunnel') continue
    for (const line of linesOf(f.geometry)) {
      const pts = line.map((c) => proj.toWorld(c))
      tunnels.push({ group: p.group ?? null, pts, hw: roadWidth(p, WIDTH.tunnel) / 200 + 0.05 })
    }
  }
  // (within its width of the tunnel and between its portals: a road the bake cut at the portals keeps its ends)
  const inTunnel = (group, x, z, hw) => {
    for (const t of tunnels) {
      if (t.group !== group && t.group !== null && group !== null) continue
      const n = t.pts.length
      for (let i = 0; i + 1 < n; i++) {
        const [ax, az] = t.pts[i]
        const [bx, bz] = t.pts[i + 1]
        const dx = bx - ax
        const dz = bz - az
        const u = ((x - ax) * dx + (z - az) * dz) / Math.max(1e-12, dx * dx + dz * dz)
        if ((i === 0 && u < 0) || (i === n - 2 && u > 1)) continue
        if (segDist(x, z, ax, az, bx, bz) < Math.max(t.hw, hw)) return true
      }
    }
    return false
  }
  // the runways of each work, for the blocks that stand beside them
  const runwaysOf = new Map()
  for (const f of all) {
    const p = f.properties
    const kind = String(p.kind || '')
    const part = String(p.part || '')
    if (!PARTS[kind]?.includes(part)) continue
    counts[kind] = (counts[kind] || 0) + 1
    const span = workSpan(p)
    const [start, end] = keepOff(p, span)
    const meta = { i: feats.length, id: p.id ?? null, kind, part, group: p.group ?? null, name: p.name ?? null, owner: p.owner ?? null, from: p.from ?? null, to: p.to ?? null, built: p.built ?? null, span, box: [Infinity, Infinity, -Infinity, -Infinity], rep: null, size: 0 }
    const grow = (x0, z0, x1 = x0, z1 = z0) => {
      const b = meta.box
      b[0] = Math.min(b[0], x0)
      b[1] = Math.min(b[1], z0)
      b[2] = Math.max(b[2], x1)
      b[3] = Math.max(b[3], z1)
    }
    if (part === 'land' || part === 'range' || part === 'field') {
      let best = null
      for (const poly of polygonsOf(f.geometry)) {
        const rings = poly.map((r) => worldRing(r, proj)).filter((r) => r.length >= 3)
        if (!rings.length) continue
        const area = Math.abs(ringArea(rings[0])) - rings.slice(1).reduce((s, r) => s + Math.abs(ringArea(r)), 0)
        const tes = tessellate(rings)
        const base = wash.pos.length / 2
        for (let k = 0; k < tes.pos.length; k += 2) {
          wash.pos.push(tes.pos[k], tes.pos[k + 1])
          wash.span.push(...span)
          wash.tone.push(TONE[part])
        }
        for (const v of tes.index) wash.index.push(base + v)
        const flatRings = rings.map((r) => Float32Array.from(r.flat()))
        for (const r of rings) for (const [x, z] of r) grow(x, z)
        // the dashed boundary, the military land's alone
        if (part === 'land') {
          for (const r of rings) {
            let s = 0
            for (let i = 0; i < r.length; i++) {
              const [ax, az] = r[i]
              const [bx, bz] = r[(i + 1) % r.length]
              const L = Math.hypot(bx - ax, bz - az)
              if (L < 1e-6) continue
              const n = Math.max(1, Math.ceil(L / EDGE_STEP))
              for (let q = 0; q < n; q++) {
                edges.seg.push(ax + ((bx - ax) * q) / n, az + ((bz - az) * q) / n, ax + ((bx - ax) * (q + 1)) / n, az + ((bz - az) * (q + 1)) / n)
                edges.s.push(s + (L * q) / n, s + (L * (q + 1)) / n)
                edges.span.push(...span)
              }
              s += L
            }
          }
        }
        excl.polys.push({ rings: flatRings, box: boxOf(rings), start, end, part })
        meta.size += area
        // (its name where the polygon is widest: the centroid if it falls inside, else the largest triangle's)
        if (!best || area > best.area) best = { area, rings: flatRings, tes }
      }
      if (best) {
        meta.rep = labelPoint(best)
        if (p.name && part !== 'range') labels.push({ name: p.name, alt: p.alt ?? null, kind: part, x: meta.rep[0], z: meta.rep[1], span, size: meta.size, i: meta.i })
      }
    } else if (LOOK_OF[part]) {
      const look = LOOK_OF[part]
      const metres = part === 'road' ? roadWidth(p, WIDTH.road) : part === 'line' ? Math.max(3, Number(p.width) || WIDTH.line) : Number(p.width) || WIDTH[part]
      const w = metres / 100
      const growing = !!builtOf(p)
      const R = ribbons[look]
      let longest = null
      for (const line of linesOf(f.geometry)) {
        if (line.length < 2) continue
        const raw = line.map((c) => proj.toWorld(c))
        const pts = resample(raw, RIBBON_STEP)
        const cut = (x, z) => part === 'road' && tunnels.length > 0 && inTunnel(meta.group, x, z, w / 2)
        const total = pushLine(R.fine, pts, w, span, growing, cut)
        pushLine(R.coarse, thin(pts, COARSE_STEP), w, span, growing, cut)
        R.length += total
        for (const [x, z] of raw) grow(x, z)
        meta.size += total
        if (!longest || total > longest.total) longest = { total, pts }
        if (part === 'runway') {
          if (!runwaysOf.has(meta.group)) runwaysOf.set(meta.group, [])
          runwaysOf.get(meta.group).push(raw)
        }
        // (a strip the settlements keep off: the ribbon's width and a margin)
        excl.lines.push({ pts: Float32Array.from(raw.flat()), hw: w / 2 + 0.06, box: boxOf([raw], w / 2 + 0.06), start, end, part })
      }
      if (longest) {
        const mid = alongAt(longest.pts, longest.total / 2)
        meta.rep = mid
        if (p.name && part === 'road') labels.push({ name: p.name, alt: p.alt ?? null, kind: 'road', x: mid[0], z: mid[1], span, size: longest.total, i: meta.i })
      }
    } else if (part === 'block') {
      const storeys = Number.isFinite(p.storeys) ? Math.max(1, Math.round(p.storeys)) : 0
      const use = USES.indexOf(p.use) + 1
      meta.use = use ? p.use : null
      const put = (x, z, dir, L, W) => {
        blocks.push({ x, z, dir, L, W, storeys, use, span: [...span], keep: [start, end], group: meta.group, i: meta.i })
        grow(x, z)
        meta.rep ??= [x, z]
      }
      for (const poly of polygonsOf(f.geometry)) {
        const ring = worldRing(poly[0], proj)
        if (ring.length < 3) continue
        const fp = footprint(ring)
        put(fp.x, fp.z, fp.dir, fp.L, fp.W)
        // (the ground kept is the building drawn, its footprint's box, which holds the footprint: no tree in an L's corner stands through its roof)
        excl.polys.push(boxRing(fp.x, fp.z, fp.dir, fp.L / 2, fp.W / 2, start, end))
      }
      for (const c of pointsOf(f.geometry)) {
        const [x, z] = proj.toWorld(c)
        put(x, z, null, 0, 0)
      }
    }
    // (a tunnel is not drawn: the road comes out beyond it)
    feats.push(meta)
  }
  // a block with no footprint of its own lines up with the nearest runway of its work, if one is near
  for (const b of blocks) {
    if (b.dir !== null) continue
    let best = 8
    b.dir = 0
    for (const raw of runwaysOf.get(b.group) || []) {
      for (let i = 0; i + 1 < raw.length; i++) {
        const d = segDist(b.x, b.z, raw[i][0], raw[i][1], raw[i + 1][0], raw[i + 1][1])
        if (d < best) {
          best = d
          b.dir = Math.atan2(raw[i + 1][1] - raw[i][1], raw[i + 1][0] - raw[i][0])
        }
      }
    }
    // (and keeps the ground its kit stands on, from the settlements and the trees)
    const [Lm, Wm] = BLOCK_SIZE[blockKind(USES[b.use - 1], b.storeys, 0).kind]
    excl.polys.push(boxRing(b.x, b.z, b.dir, (Lm * BLOCK_POINT_S) / 2, (Wm * BLOCK_POINT_S) / 2, b.keep[0], b.keep[1]))
  }
  // across a `built` span each block comes up in a year of its own
  blocks.forEach((b, k) => {
    if (!builtOf(feats[b.i])) return
    const [a0, a1] = b.span
    const w = Math.min(1, a1 - a0)
    const t = a0 + (a1 - a0 - w) * hash(k, 17)
    b.span[0] = t
    b.span[1] = t + w
  })
  const B = new Float32Array(blocks.length * BLOCK_STRIDE)
  blocks.forEach((b, k) => B.set([b.x, b.z, b.dir, b.L, b.W, b.storeys, b.use, ...b.span], k * BLOCK_STRIDE))
  const F32 = (a) => Float32Array.from(a)
  const out = {
    feats,
    wash: { pos: F32(wash.pos), span: F32(wash.span), tone: F32(wash.tone), index: Uint32Array.from(wash.index) },
    edges: { seg: F32(edges.seg), s: F32(edges.s), span: F32(edges.span) },
    ribbons: Object.fromEntries(LOOKS.map((l) => {
      const R = ribbons[l]
      const pack = (B) => ({ seg: F32(B.seg), info: F32(B.info), end: F32(B.end), span: F32(B.span), grow: F32(B.grow), n: B.n })
      return [l, { fine: pack(R.fine), coarse: pack(R.coarse), n: R.fine.n, length: R.length }]
    })),
    blocks: B,
    labels: labels.sort((a, b) => b.size - a.size),
    excl,
    counts,
    ms: Date.now() - t0,
  }
  return out
}

function boxOf(rings, pad = 0) {
  let x0 = Infinity
  let z0 = Infinity
  let x1 = -Infinity
  let z1 = -Infinity
  for (const r of rings) {
    for (const [x, z] of r) {
      x0 = Math.min(x0, x)
      z0 = Math.min(z0, z)
      x1 = Math.max(x1, x)
      z1 = Math.max(z1, z)
    }
  }
  return [x0 - pad, z0 - pad, x1 + pad, z1 + pad]
}

/** The point `d` along a polyline. */
function alongAt(pts, d) {
  let s = 0
  for (let i = 0; i + 1 < pts.length; i++) {
    const L = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1])
    if (s + L >= d && L > 0) {
      const t = (d - s) / L
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t]
    }
    s += L
  }
  return pts[pts.length - 1]
}

/** Where a polygon's name goes: its centroid if inside it, else the middle of its largest triangle. */
function labelPoint({ rings, tes }) {
  const r = rings[0]
  let A = 0
  let cx = 0
  let cz = 0
  const n = r.length / 2
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const f = r[j * 2] * r[i * 2 + 1] - r[i * 2] * r[j * 2 + 1]
    A += f
    cx += (r[j * 2] + r[i * 2]) * f
    cz += (r[j * 2 + 1] + r[i * 2 + 1]) * f
  }
  if (Math.abs(A) > 1e-9) {
    cx /= 3 * A
    cz /= 3 * A
    if (insideRings(rings, cx, cz)) return [cx, cz]
  }
  let best = null
  let ba = -1
  const { tri, flat } = tes
  for (let t = 0; t < tri.length; t += 3) {
    const [a, b, c] = [tri[t], tri[t + 1], tri[t + 2]]
    const ar = Math.abs((flat[b * 2] - flat[a * 2]) * (flat[c * 2 + 1] - flat[a * 2 + 1]) - (flat[c * 2] - flat[a * 2]) * (flat[b * 2 + 1] - flat[a * 2 + 1]))
    if (ar > ba) {
      ba = ar
      best = [(flat[a * 2] + flat[b * 2] + flat[c * 2]) / 3, (flat[a * 2 + 1] + flat[b * 2 + 1] + flat[c * 2 + 1]) / 3]
    }
  }
  return best || [r[0], r[1]]
}

/** The buffers of a decode, to hand over without a copy. */
export function transfers(out) {
  const list = [out.wash.pos, out.wash.span, out.wash.tone, out.wash.index, out.edges.seg, out.edges.s, out.edges.span, out.blocks]
  for (const R of Object.values(out.ribbons)) for (const B of [R.fine, R.coarse]) list.push(B.seg, B.info, B.end, B.span, B.grow)
  for (const p of out.excl.polys) list.push(...p.rings)
  for (const l of out.excl.lines) list.push(l.pts)
  return [...new Set(list.map((a) => a.buffer))]
}

// --- what the settlements keep off ------------------------------------------------------

const CELL = 4 // world units: the index's cells

/**
 * The ground an island's works keep the settlements off, by year: the
 * military land, the fields, the ranges and the blocks' footprints, and the
 * runways, roads and rail as strips of their width. test() is asked of a
 * building's footprint (as settlements.js allows() samples it).
 */
export class WorksExclusion {
  constructor(excl) {
    this.polys = excl.polys
    this.lines = excl.lines
    this.grid = new Map()
    const put = (box, ref) => {
      const i0 = Math.floor(box[0] / CELL)
      const i1 = Math.floor(box[2] / CELL)
      const j0 = Math.floor(box[1] / CELL)
      const j1 = Math.floor(box[3] / CELL)
      for (let j = j0; j <= j1; j++) {
        for (let i = i0; i <= i1; i++) {
          const k = i * 100003 + j
          let a = this.grid.get(k)
          if (!a) this.grid.set(k, (a = []))
          a.push(ref)
        }
      }
    }
    this.polys.forEach((p, i) => put(p.box, i))
    // (a line by its segments, so a road across the island is asked of only where it runs)
    this.lines.forEach((l, i) => {
      const n = l.pts.length / 2
      for (let s = 0; s + 1 < n; s++) {
        const ax = l.pts[s * 2]
        const az = l.pts[s * 2 + 1]
        const bx = l.pts[s * 2 + 2]
        const bz = l.pts[s * 2 + 3]
        put([Math.min(ax, bx) - l.hw, Math.min(az, bz) - l.hw, Math.max(ax, bx) + l.hw, Math.max(az, bz) + l.hw], -1 - (i * 65536 + s))
      }
    })
    this.breaks = new Set()
    for (const s of [...this.polys, ...this.lines]) {
      if (Number.isFinite(s.start) && s.start > -NEVER) this.breaks.add(s.start)
      if (Number.isFinite(s.end)) this.breaks.add(s.end)
    }
    this.seen = new Int32Array(this.polys.length + this.lines.length)
    this.stamp = 0
  }

  get count() {
    return this.polys.length + this.lines.length
  }

  /**
   * A footprint (centre x, z; half extents ax, az along its own axes, turned
   * by a as THREE turns about y) in year `year`: 2 where a work standing then
   * takes its ground, 1 where one does in some other year (so the answer
   * differs by year), 0 where none ever does.
   */
  test(x, z, ax, az, a, year) {
    const r = Math.hypot(ax, az)
    const i0 = Math.floor((x - r) / CELL)
    const i1 = Math.floor((x + r) / CELL)
    const j0 = Math.floor((z - r) / CELL)
    const j1 = Math.floor((z + r) / CELL)
    const c = Math.cos(a)
    const s = -Math.sin(a)
    // (local +x and +z in the world: settlements.js allows)
    const ux = c
    const uz = s
    const vx = -s
    const vz = c
    const stamp = ++this.stamp
    let dep = 0
    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        const refs = this.grid.get(i * 100003 + j)
        if (!refs) continue
        for (const ref of refs) {
          let hit = false
          let shape
          if (ref >= 0) {
            if (this.seen[ref] === stamp) continue
            this.seen[ref] = stamp
            shape = this.polys[ref]
            const b = shape.box
            if (x + r < b[0] || x - r > b[2] || z + r < b[1] || z - r > b[3]) continue
            for (let p = 0; p < 9 && !hit; p++) {
              const fu = p === 0 ? 0 : p < 5 ? [-1, 1, 1, -1][p - 1] : [0, 1, 0, -1][p - 5]
              const fv = p === 0 ? 0 : p < 5 ? [-1, -1, 1, 1][p - 1] : [-1, 0, 1, 0][p - 5]
              hit = insideRings(shape.rings, x + ux * fu * ax + vx * fv * az, z + uz * fu * ax + vz * fv * az)
            }
          } else {
            const q = -1 - ref
            const li = Math.floor(q / 65536)
            const si = q % 65536
            shape = this.lines[li]
            const P = shape.pts
            hit = segHitsBox(P[si * 2] - x, P[si * 2 + 1] - z, P[si * 2 + 2] - x, P[si * 2 + 3] - z, ux, uz, vx, vz, ax + shape.hw, az + shape.hw)
          }
          if (!hit) continue
          dep = 1
          if (year >= shape.start && year < shape.end) return 2
        }
      }
    }
    return dep
  }

  /**
   * The years works of `parts` (a Set) take the ground within `r` of (x, z):
   * [start, end) each, merged where they meet. For a tree: crops.js clips
   * its years by them.
   */
  standing(x, z, r, parts) {
    const i0 = Math.floor((x - r) / CELL)
    const i1 = Math.floor((x + r) / CELL)
    const j0 = Math.floor((z - r) / CELL)
    const j1 = Math.floor((z + r) / CELL)
    const stamp = ++this.stamp
    const spans = []
    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        const refs = this.grid.get(i * 100003 + j)
        if (!refs) continue
        for (const ref of refs) {
          let shape
          let hit
          if (ref >= 0) {
            if (this.seen[ref] === stamp) continue
            this.seen[ref] = stamp
            shape = this.polys[ref]
            if (!parts.has(shape.part)) continue
            const b = shape.box
            if (x + r < b[0] || x - r > b[2] || z + r < b[1] || z - r > b[3]) continue
            hit = insideRings(shape.rings, x, z) || insideRings(shape.rings, x - r, z) || insideRings(shape.rings, x + r, z) || insideRings(shape.rings, x, z - r) || insideRings(shape.rings, x, z + r)
          } else {
            const q = -1 - ref
            shape = this.lines[Math.floor(q / 65536)]
            if (!parts.has(shape.part)) continue
            const si = q % 65536
            const P = shape.pts
            hit = segDist(x, z, P[si * 2], P[si * 2 + 1], P[si * 2 + 2], P[si * 2 + 3]) < shape.hw + r
          }
          if (hit) spans.push([shape.start, shape.end])
        }
      }
    }
    if (spans.length < 2) return spans
    spans.sort((a, b) => a[0] - b[0])
    const out = [spans[0].slice()]
    for (const [a, b] of spans.slice(1)) {
      const last = out[out.length - 1]
      if (a <= last[1]) last[1] = Math.max(last[1], b)
      else out.push([a, b])
    }
    return out
  }

  /**
   * The texels of an N × N grid over `rect` that the works of `parts` cover
   * (any texel whose square they reach), one entry per work with its years:
   * [{ start, end, texels }]. For a district's trees: settlements.js stamps
   * them into its clearing by their weight in the year (worksClear).
   */
  raster(rect, N, parts) {
    const sx = N / (rect.x1 - rect.x0)
    const sz = N / (rect.z1 - rect.z0)
    const tx = 1 / sx
    const tz = 1 / sz
    const half = Math.hypot(tx, tz) / 2
    const ci = (v) => Math.max(0, Math.min(N - 1, v))
    const out = []
    const range = (b, m) => {
      if (b[2] + m < rect.x0 || b[0] - m > rect.x1 || b[3] + m < rect.z0 || b[1] - m > rect.z1) return null
      return [ci(Math.floor((b[0] - m - rect.x0) * sx)), ci(Math.floor((b[2] + m - rect.x0) * sx)), ci(Math.floor((b[1] - m - rect.z0) * sz)), ci(Math.floor((b[3] + m - rect.z0) * sz))]
    }
    for (const p of this.polys) {
      if (!parts.has(p.part)) continue
      const q = range(p.box, 0)
      if (!q) continue
      const [i0, i1, j0, j1] = q
      // (the texels an edge of it crosses, so a thin footprint never slips between the texels' middles, and those it holds the middle of)
      const set = new Set()
      for (const ring of p.rings) {
        const n = ring.length / 2
        for (let k = 0; k < n; k++) {
          const m = (k + 1) % n
          const [ax, az, bx, bz] = [ring[k * 2], ring[k * 2 + 1], ring[m * 2], ring[m * 2 + 1]]
          const e = range([Math.min(ax, bx), Math.min(az, bz), Math.max(ax, bx), Math.max(az, bz)], 0)
          if (!e) continue
          for (let j = e[2]; j <= e[3]; j++) {
            for (let i = e[0]; i <= e[1]; i++) {
              const cx = rect.x0 + (i + 0.5) * tx
              const cz = rect.z0 + (j + 0.5) * tz
              if (segHitsBox(ax - cx, az - cz, bx - cx, bz - cz, 1, 0, 0, 1, tx / 2, tz / 2)) set.add(j * N + i)
            }
          }
        }
      }
      for (let j = j0; j <= j1; j++) {
        for (let i = i0; i <= i1; i++) {
          if (!set.has(j * N + i) && insideRings(p.rings, rect.x0 + (i + 0.5) * tx, rect.z0 + (j + 0.5) * tz)) set.add(j * N + i)
        }
      }
      const texels = [...set]
      if (texels.length) out.push({ start: p.start, end: p.end, texels: Int32Array.from(texels) })
    }
    for (const l of this.lines) {
      if (!parts.has(l.part)) continue
      if (!range(l.box, 0)) continue
      const set = new Set()
      const P = l.pts
      for (let s = 0; s + 3 < P.length; s += 2) {
        const [ax, az, bx, bz] = [P[s], P[s + 1], P[s + 2], P[s + 3]]
        const q = range([Math.min(ax, bx), Math.min(az, bz), Math.max(ax, bx), Math.max(az, bz)], l.hw + half)
        if (!q) continue
        const [i0, i1, j0, j1] = q
        for (let j = j0; j <= j1; j++) {
          for (let i = i0; i <= i1; i++) {
            if (segDist(rect.x0 + (i + 0.5) * tx, rect.z0 + (j + 0.5) * tz, ax, az, bx, bz) <= l.hw + half) set.add(j * N + i)
          }
        }
      }
      if (set.size) out.push({ start: l.start, end: l.end, texels: Int32Array.from(set) })
    }
    return out
  }
}

/** How far a work kept off from `start` to `end` (WorksExclusion's years) stands in a year: in over the year before `start`, out over the year before `end`. */
export function keptWeight(start, end, y) {
  // (a work with no `to` keeps it to the end of time)
  return (Number.isFinite(start) ? smooth(start - 1, start, y) : 1) * (Number.isFinite(end) ? 1 - smooth(end - 1, end, y) : 1)
}

/** Whether segment a–b (relative to a box's centre) meets the box of half extents hx, hz along axes u, v (Liang–Barsky). */
function segHitsBox(ax, az, bx, bz, ux, uz, vx, vz, hx, hz) {
  const pa = [ax * ux + az * uz, ax * vx + az * vz]
  const pb = [bx * ux + bz * uz, bx * vx + bz * vz]
  let t0 = 0
  let t1 = 1
  for (let k = 0; k < 2; k++) {
    const h = k ? hz : hx
    const d = pb[k] - pa[k]
    for (const [p, q] of [[-d, pa[k] + h], [d, h - pa[k]]]) {
      if (Math.abs(p) < 1e-12) {
        if (q < 0) return false
        continue
      }
      const t = q / p
      if (p < 0) t0 = Math.max(t0, t)
      else t1 = Math.min(t1, t)
      if (t0 > t1) return false
    }
  }
  return true
}
