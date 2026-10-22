// Natural Earth 10 m for the table (DATA.md §§2–3): the land, minor-island and
// reef polygons that decide the table's land texels and fill coast.json, and
// the coastline lines its strokes come from. Read with the pure-JS
// `shapefile` package (0.6.6, pinned in ENGINEERING.md §0), as R1 proved
// (research/R1-terrain-data.md §4; r1-scripts/nestat.mjs, nepip.mjs in the
// research scratchpad).
//
// What this module does to the shapes, in order:
// 1. Each ring or line is moved whole by 0 or +360° so that it lies in the
//    table's continuous longitudes (the envelope's west edge to its east edge,
//    which pass 180). Natural Earth never lets a ring cross ±180 (it splits
//    there), so a whole-ring shift keeps every ring continuous; a per-vertex
//    wrap would tear the rings that cross the far side of the world.
// 2. Rings are oriented: outer counter-clockwise, holes clockwise (RFC 7946;
//    DATA.md §12), whatever the shapefile's own winding.
// 3. Polygons are clipped to the envelope by four half-planes; a ring cut by
//    an edge is re-closed along it by pairing the crossings in order, so a
//    cut never leaves a zero-width bridge and every piece is a valid polygon.
// 4. Natural Earth's splits at 180° are merged back: the edges a polygon has
//    on the meridian are taken out, and the boundary along it is kept only
//    where land lies on one side alone, so the halves of Fiji's Taveuni or of
//    Chukotka become one ring again (R1 §4).
// 5. Lines are clipped to the envelope, and line ends that meet on the
//    meridian after the shift are joined.
//
// Downloads (the zips) go through tools/lib/fetch.mjs's curl and ledger;
// `unzip` unpacks them beside the zip in the downloads directory. No Natural
// Earth name string is ever written out (DATA.md §3).
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import { fetchTo } from './fetch.mjs'

const require = createRequire(import.meta.url)
const shapefile = require('shapefile')

export const NE = {
  base: 'https://naciscdn.org/naturalearth/10m/physical',
  page: 'https://www.naturalearthdata.com/',
  terms: 'https://www.naturalearthdata.com/about/terms-of-use/',
  licence: 'public domain (Natural Earth)',
}
/** The layers the table uses: polygons with their coast.json kind, and the stroke lines. */
export const NE_POLYGONS = [
  { name: 'ne_10m_land', kind: 'land' },
  { name: 'ne_10m_minor_islands', kind: 'island' },
  { name: 'ne_10m_reefs', kind: 'reef' },
]
export const NE_LINES = [{ name: 'ne_10m_coastline' }, { name: 'ne_10m_minor_islands_coastline' }]
export const neUrl = (name) => `${NE.base}/${name}.zip`

/** Fetch and unpack every layer into dir/ne/<name>/. Returns the zips' ledger entries by name. */
export function downloadNE(ledger, dir, log = () => {}) {
  const out = {}
  for (const { name } of [...NE_POLYGONS, ...NE_LINES]) {
    const zip = join(dir, 'ne', `${name}.zip`)
    const r = fetchTo(ledger, neUrl(name), zip)
    if (!r.ok) throw new Error(`Natural Earth ${name}: HTTP ${r.status}`)
    const into = join(dir, 'ne', name)
    if (!r.cached || !existsSync(join(into, `${name}.shp`))) {
      mkdirSync(into, { recursive: true })
      const u = spawnSync('unzip', ['-q', '-o', zip, '-d', into], { encoding: 'utf8' })
      if (u.status !== 0) throw new Error(`unzip ${name}: ${u.stderr}`)
    }
    out[name] = ledger.get(zip)
    log(`  natural earth ${name}: ${r.cached ? 'cached' : 'fetched'}`)
  }
  return out
}

/** Every record of a layer: [{ index, geometry, properties }]. */
export async function readLayer(dir, name) {
  const shp = join(dir, 'ne', name, `${name}.shp`)
  if (!existsSync(shp)) throw new Error(`${shp} is missing (run --download)`)
  const src = await shapefile.open(shp, join(dir, 'ne', name, `${name}.dbf`), { encoding: 'utf-8' })
  const out = []
  for (let i = 0, r = await src.read(); !r.done; r = await src.read(), i++) {
    if (r.value.geometry) out.push({ index: i, geometry: r.value.geometry, properties: r.value.properties || {} })
  }
  return out
}

// ---------------------------------------------------------------------------
// Rings and their orientation

export function ringArea(ring) {
  let a = 0
  for (let i = 0; i < ring.length - 1; i++) a += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]
  return a / 2
}

const closeRing = (r) => (r.length && (r[0][0] !== r[r.length - 1][0] || r[0][1] !== r[r.length - 1][1]) ? [...r, r[0]] : r)

/** Outer counter-clockwise, holes clockwise. */
export function orientPolygon(rings) {
  return rings.map((r, i) => {
    const c = closeRing(r)
    const ccw = ringArea(c) > 0
    return (i === 0) === ccw ? c : c.slice().reverse()
  })
}

/** The polygons of a GeoJSON geometry, as lists of rings. */
export function polygonsOf(g) {
  if (!g) return []
  if (g.type === 'Polygon') return [g.coordinates]
  if (g.type === 'MultiPolygon') return g.coordinates
  return []
}
/** The lines of a GeoJSON geometry. */
export function linesOf(g) {
  if (!g) return []
  if (g.type === 'LineString') return [g.coordinates]
  if (g.type === 'MultiLineString') return g.coordinates
  if (g.type === 'Polygon') return g.coordinates
  if (g.type === 'MultiPolygon') return g.coordinates.flat()
  return []
}

/**
 * The shift (0 or 360) that puts coordinates whose longitudes span [a, b]
 * (within −180..180) where they overlap the envelope [w, e] most; null when
 * neither does.
 */
export function shiftFor(a, b, w, e) {
  const over = (x0, x1) => Math.max(0, Math.min(x1, e) - Math.max(x0, w)) + (x0 <= e && x1 >= w ? 1e-9 : 0)
  const o0 = over(a, b)
  const o1 = over(a + 360, b + 360)
  if (o0 <= 0 && o1 <= 0) return null
  return o1 > o0 ? 360 : 0
}

const lonSpan = (pts) => {
  let a = Infinity
  let b = -Infinity
  for (const p of pts) {
    if (p[0] < a) a = p[0]
    if (p[0] > b) b = p[0]
  }
  return [a, b]
}

/** A polygon moved whole into the envelope's longitudes (its outer ring decides), or null when it misses. */
export function shiftPolygon(rings, envelope) {
  const [a, b] = lonSpan(rings[0])
  const s = shiftFor(a, b, envelope[0], envelope[2])
  if (s === null) return null
  return s ? rings.map((r) => r.map(([x, y]) => [x + s, y])) : rings
}

export function shiftLine(pts, envelope) {
  const [a, b] = lonSpan(pts)
  const s = shiftFor(a, b, envelope[0], envelope[2])
  if (s === null) return null
  return s ? pts.map(([x, y]) => [x + s, y]) : pts
}

// ---------------------------------------------------------------------------
// Clipping a polygon by a half-plane, re-closing along the cut

const inRing = (r, x, y) => {
  let c = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    if (r[i][1] > y !== r[j][1] > y && x < ((r[j][0] - r[i][0]) * (y - r[i][1])) / (r[j][1] - r[i][1]) + r[i][0]) c = !c
  }
  return c
}

/** Group closed, oriented rings into polygons: each clockwise ring goes into the smallest outer that holds it. */
export function groupRings(rings) {
  const outers = []
  const holes = []
  for (const r of rings) {
    if (r.length < 4) continue
    const a = ringArea(r)
    if (a > 0) outers.push({ ring: r, area: a, holes: [] })
    else if (a < 0) holes.push(r)
  }
  outers.sort((p, q) => p.area - q.area)
  for (const h of holes) {
    // a vertex of the hole that is not on an outer's edge decides; any will do for disjoint rings
    const [x, y] = h[Math.floor(h.length / 2)]
    const o = outers.find((p) => inRing(p.ring, x, y))
    if (o) o.holes.push(h)
  }
  return outers.map((o) => [o.ring, ...o.holes])
}

/**
 * Clip one oriented polygon to the half-plane where coordinate `axis` (0 lon,
 * 1 lat) is >= value (keep = 1) or <= value (keep = −1). Returns a list of
 * oriented polygons.
 */
export function clipHalfPlane(rings, axis, value, keep) {
  const other = 1 - axis
  // a vertex exactly on the line is nudged off it, so every crossing is an edge's
  for (const r of rings) for (const p of r) if (p[axis] === value) value += keep * 1e-10
  const inside = (p) => keep * (p[axis] - value) >= 0
  const whole = []
  const chains = []
  for (const r of rings) {
    const n = r.length - 1 // closed: r[n] = r[0]
    let firstOut = -1
    let allIn = true
    for (let i = 0; i < n; i++) {
      if (!inside(r[i])) {
        allIn = false
        if (firstOut < 0) firstOut = i
      }
    }
    if (allIn) {
      whole.push(r)
      continue
    }
    // walk from an outside vertex once round, collecting inside runs between crossings
    let cur = null
    for (let k = 0; k < n; k++) {
      const i = (firstOut + k) % n
      const a = r[i]
      const b = r[(i + 1) % n]
      const ia = inside(a)
      const ib = inside(b)
      if (ia !== ib) {
        const t = (value - a[axis]) / (b[axis] - a[axis])
        const x = []
        x[axis] = value
        x[other] = a[other] + t * (b[other] - a[other])
        if (!ia) cur = [x] // entering
        else {
          cur.push(x) // leaving
          chains.push(cur)
          cur = null
        }
      }
      if (ib && cur) cur.push(b)
    }
  }
  if (!chains.length) return groupRings(whole)
  // the crossings in order along the line: the kept boundary runs along it
  // from each exit to the entry that closes the same inside interval
  const ends = []
  chains.forEach((c, ci) => {
    ends.push({ t: c[0][other], ci, entry: true })
    ends.push({ t: c[c.length - 1][other], ci, entry: false })
  })
  ends.sort((p, q) => p.t - q.t)
  const next = new Map() // chain index → chain index that follows it along the line
  for (let k = 0; k + 1 < ends.length; k += 2) {
    const p = ends[k]
    const q = ends[k + 1]
    if (p.entry === q.entry) throw new Error('clipHalfPlane: crossings do not alternate (rings not oriented?)')
    const exit = p.entry ? q : p
    const entry = p.entry ? p : q
    next.set(exit.ci, entry.ci)
  }
  const used = new Uint8Array(chains.length)
  const out = [...whole]
  for (let c0 = 0; c0 < chains.length; c0++) {
    if (used[c0]) continue
    const ring = []
    let c = c0
    while (!used[c]) {
      used[c] = 1
      ring.push(...chains[c])
      c = next.get(c)
    }
    ring.push(ring[0])
    out.push(ring)
  }
  return groupRings(out)
}

/** Clip an oriented polygon to [w, s, e, n]; returns oriented polygons. */
export function clipPolygonToRect(rings, [w, s, e, n]) {
  let polys = [rings]
  for (const [axis, value, keep] of [[0, w, 1], [0, e, -1], [1, s, 1], [1, n, -1]]) {
    const next = []
    for (const p of polys) next.push(...clipHalfPlane(p, axis, value, keep))
    polys = next
  }
  return polys
}

/** Clip a line to [w, s, e, n] (Liang–Barsky per segment); returns the pieces inside. */
export function clipLineToRect(pts, [w, s, e, n]) {
  const out = []
  let cur = null
  for (let i = 0; i + 1 < pts.length; i++) {
    const [x0, y0] = pts[i]
    const [x1, y1] = pts[i + 1]
    const dx = x1 - x0
    const dy = y1 - y0
    let t0 = 0
    let t1 = 1
    let ok = true
    for (const [p, q] of [[-dx, x0 - w], [dx, e - x0], [-dy, y0 - s], [dy, n - y0]]) {
      if (p === 0) {
        if (q < 0) ok = false
      } else {
        const r = q / p
        if (p < 0) t0 = Math.max(t0, r)
        else t1 = Math.min(t1, r)
      }
    }
    if (!ok || t0 > t1) {
      if (cur) out.push(cur)
      cur = null
      continue
    }
    const a = t0 > 0 ? [x0 + t0 * dx, y0 + t0 * dy] : pts[i]
    const b = t1 < 1 ? [x0 + t1 * dx, y0 + t1 * dy] : pts[i + 1]
    if (!cur) cur = [a]
    cur.push(b)
    if (t1 < 1) {
      out.push(cur)
      cur = null
    }
  }
  if (cur) out.push(cur)
  return out.filter((l) => l.length >= 2)
}

// ---------------------------------------------------------------------------
// The merge at 180°

const SEAM_EPS = 1e-7
const key = (p) => `${p[0].toFixed(8)},${p[1].toFixed(8)}`

/**
 * Merge the polygons that touch the meridian x = X from either side (Natural
 * Earth's splits) into whole polygons; the others pass through. items:
 * [{ rings, id }], oriented polygons in continuous longitudes. Returns
 * { items, merged }: a merged polygon's id joins its parts' ids with '+', and
 * merged counts the polygons that met another across the meridian.
 */
export function mergeAtMeridian(items, X = 180) {
  const snap = (p) => (Math.abs(p[0] - X) < SEAM_EPS ? [X, p[1]] : p)
  const seamEdge = (a, b) => a[0] === X && b[0] === X
  const touching = []
  const out = []
  for (const it of items) {
    const rings = it.rings.map((r) => r.map(snap))
    if (rings.some((r) => r.some((p, i) => i + 1 < r.length && seamEdge(p, r[i + 1])))) touching.push({ rings, id: it.id })
    else out.push(it)
  }
  if (!touching.length) return { items: out, merged: 0 }
  const chains = [] // { pts, id }
  const closed = []
  const seam = [] // directed edges on the meridian [y0, y1]
  for (const { rings, id } of touching) {
    for (const r of rings) {
      const n = r.length - 1
      let first = -1
      for (let i = 0; i < n; i++)
        if (seamEdge(r[i], r[i + 1])) {
          first = i
          break
        }
      if (first < 0) {
        closed.push({ pts: r, id })
        continue
      }
      let cur = null
      for (let k = 1; k <= n; k++) {
        const i = (first + k) % n
        const a = r[i]
        const b = r[(i + 1) % n]
        if (seamEdge(a, b)) {
          seam.push([a[1], b[1]])
          if (cur) chains.push({ pts: cur, id }) // (its last point is a, pushed as the previous edge's end)
          cur = null
        } else {
          if (!cur) cur = [a]
          cur.push(b)
        }
      }
      if (cur) chains.push({ pts: cur, id })
    }
  }
  // the meridian's boundary: elementary intervals with land on one side only
  const ys = [...new Set(seam.flat())].sort((a, b) => a - b)
  const segs = []
  for (let k = 0; k + 1 < ys.length; k++) {
    const y0 = ys[k]
    const y1 = ys[k + 1]
    const mid = (y0 + y1) / 2
    let up = 0
    let down = 0
    for (const [a, b] of seam) {
      if (Math.min(a, b) <= mid && Math.max(a, b) >= mid) b > a ? up++ : down++
    }
    // going north along x = X with land on the left is land to the west (up); south is land to the east
    if (up && !down) segs.push({ pts: [[X, y0], [X, y1]], id: null })
    else if (down && !up) segs.push({ pts: [[X, y1], [X, y0]], id: null })
  }
  const pieces = [...chains, ...segs]
  const byStart = new Map()
  pieces.forEach((p, i) => {
    const k = key(p.pts[0])
    if (!byStart.has(k)) byStart.set(k, [])
    byStart.get(k).push(i)
  })
  const used = new Uint8Array(pieces.length)
  const idsOf = new Map() // ring → Set of source ids
  const rings = []
  for (const c of closed) {
    rings.push(c.pts)
    idsOf.set(c.pts, new Set([c.id]))
  }
  for (let p0 = 0; p0 < pieces.length; p0++) {
    if (used[p0]) continue
    const ring = []
    const ids = new Set()
    let p = p0
    for (let guard = 0; guard <= pieces.length; guard++) {
      used[p] = 1
      if (pieces[p].id !== null) ids.add(pieces[p].id)
      ring.push(...(ring.length ? pieces[p].pts.slice(1) : pieces[p].pts))
      const endKey = key(ring[ring.length - 1])
      if (endKey === key(ring[0]) && ring.length > 3) break
      const nextOnes = (byStart.get(endKey) || []).filter((i) => !used[i])
      if (!nextOnes.length) break
      p = nextOnes[0]
    }
    if (key(ring[ring.length - 1]) !== key(ring[0])) ring.push(ring[0])
    else ring[ring.length - 1] = ring[0]
    // collinear points left on the meridian where two intervals met are harmless; drop exact repeats
    const clean = ring.filter((q, i) => i === 0 || q[0] !== ring[i - 1][0] || q[1] !== ring[i - 1][1])
    rings.push(clean)
    idsOf.set(clean, ids)
  }
  const grouped = groupRings(rings).map((poly) => {
    const ids = new Set()
    for (const r of poly) for (const id of idsOf.get(r) || []) ids.add(id)
    return { rings: poly, id: [...ids].sort().join('+') }
  })
  return { items: [...out, ...grouped], merged: touching.length - grouped.length }
}

/**
 * Join lines whose ends meet on the meridian x = X (Natural Earth's coastline
 * splits). Its halves do not meet exactly (an end at 179.99998939° against
 * one at 180°, latitudes up to 0.0014° apart at Taveuni), so an end within
 * xTol of the meridian joins the nearest other end there within yTol, the
 * small gap closed by a straight leg. items: [{ pts, id }]; ids joined with '+'.
 */
export function joinAtMeridian(items, X = 180, { xTol = 1e-4, yTol = 0.005 } = {}) {
  const onX = (p) => Math.abs(p[0] - X) < xTol
  const SEAM_EPS = yTol
  const pool = items.map((it) => ({ pts: it.pts.map((p) => (onX(p) ? [X, p[1]] : p)), id: it.id }))
  let joined = 0
  for (let changed = true; changed; ) {
    changed = false
    for (let i = 0; i < pool.length && !changed; i++) {
      const a = pool[i]
      if (!a) continue
      const ae = a.pts[a.pts.length - 1]
      if (!onX(ae)) continue
      for (let j = 0; j < pool.length; j++) {
        const b = pool[j]
        if (!b || j === i) continue
        const bs = b.pts[0]
        const be = b.pts[b.pts.length - 1]
        let pts = null
        if (onX(bs) && Math.abs(bs[1] - ae[1]) < SEAM_EPS) pts = [...a.pts, ...b.pts.slice(1)]
        else if (onX(be) && Math.abs(be[1] - ae[1]) < SEAM_EPS) pts = [...a.pts, ...b.pts.slice().reverse().slice(1)]
        if (pts) {
          pool[i] = { pts, id: a.id === b.id ? a.id : [a.id, b.id].sort().join('+') }
          pool[j] = null
          joined++
          changed = true
          break
        }
      }
    }
  }
  return { items: pool.filter(Boolean), joined }
}

// ---------------------------------------------------------------------------
// Area on the sphere

const R_KM = 6371.0088
/** A ring's area in km² on the sphere (the formula of d3-geo and turf: Σ (λ2 − λ1)(2 + sin φ1 + sin φ2) R²/2). */
export function ringAreaKm2(ring) {
  let a = 0
  const D = Math.PI / 180
  for (let i = 0; i + 1 < ring.length; i++) {
    const [x1, y1] = ring[i]
    const [x2, y2] = ring[i + 1]
    a += (x2 - x1) * D * (2 + Math.sin(y1 * D) + Math.sin(y2 * D))
  }
  return Math.abs((a * R_KM * R_KM) / 2)
}
export const polygonAreaKm2 = (rings) => rings.reduce((s, r, i) => s + (i === 0 ? 1 : -1) * ringAreaKm2(r), 0)

// ---------------------------------------------------------------------------
// Point in polygon over many polygons, with a grid index (for the summits check and the table's preview)

export function polygonIndex(polys, cell = 1) {
  const items = polys.map((rings) => {
    let x0 = Infinity
    let y0 = Infinity
    let x1 = -Infinity
    let y1 = -Infinity
    for (const [x, y] of rings[0]) {
      if (x < x0) x0 = x
      if (y < y0) y0 = y
      if (x > x1) x1 = x
      if (y > y1) y1 = y
    }
    return { rings, box: [x0, y0, x1, y1] }
  })
  const grid = new Map()
  items.forEach((it, k) => {
    for (let i = Math.floor(it.box[0] / cell); i <= Math.floor(it.box[2] / cell); i++)
      for (let j = Math.floor(it.box[1] / cell); j <= Math.floor(it.box[3] / cell); j++) {
        const g = `${i},${j}`
        if (!grid.has(g)) grid.set(g, [])
        grid.get(g).push(k)
      }
  })
  return (x, y) => {
    for (const k of grid.get(`${Math.floor(x / cell)},${Math.floor(y / cell)}`) || []) {
      const { rings, box } = items[k]
      if (x < box[0] || x > box[2] || y < box[1] || y > box[3]) continue
      if (inRing(rings[0], x, y) && !rings.slice(1).some((h) => inRing(h, x, y))) return true
    }
    return false
  }
}
