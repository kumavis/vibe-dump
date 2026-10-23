// Geometry for the works bake: lines and polygons in lon/lat, measured in the
// shared projection (geo.mjs), simplified with Douglas–Peucker, carved with
// hand-drawn zones on a fine raster, clipped to a pack's box, and turned
// from a runway's rectangle into its centreline.
import { KX, KZ } from './geo.mjs'

export const xy = ([lon, lat]) => [lon * KX, lat * KZ]
const dist2Seg = (p, a, b) => {
  const dx = b[0] - a[0]
  const dz = b[1] - a[1]
  const l2 = dx * dx + dz * dz
  let t = l2 > 0 ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dz) / l2 : 0
  t = Math.max(0, Math.min(1, t))
  const ex = a[0] + t * dx - p[0]
  const ez = a[1] + t * dz - p[1]
  return ex * ex + ez * ez
}

/** Douglas–Peucker on an open polyline of [lon, lat]; tol in metres; endpoints kept. */
export function simplifyLine(coords, tol) {
  const n = coords.length
  if (n <= 2) return coords.slice()
  const P = coords.map(xy)
  const keep = new Uint8Array(n)
  keep[0] = keep[n - 1] = 1
  const stack = [[0, n - 1]]
  const t2 = tol * tol
  while (stack.length) {
    const [a, b] = stack.pop()
    let best = -1
    let bd = t2
    for (let i = a + 1; i < b; i++) {
      const d = dist2Seg(P[i], P[a], P[b])
      if (d > bd) {
        bd = d
        best = i
      }
    }
    if (best >= 0) {
      keep[best] = 1
      stack.push([a, best], [best, b])
    }
  }
  return coords.filter((_, i) => keep[i])
}

/** Signed area of a ring in m² (positive counter-clockwise in lon/lat, as RFC 7946 wants outer rings). */
export function ringArea(ring) {
  let a = 0
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) a += ring[j][0] * KX * ring[i][1] * KZ - ring[i][0] * KX * ring[j][1] * KZ
  return a / 2
}

export const polygonsOf = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [])
export const linesOf = (g) => (g.type === 'LineString' ? [g.coordinates] : g.type === 'MultiLineString' ? g.coordinates : [])

/** Area of a Polygon or MultiPolygon in m² (holes subtracted). */
export function areaOf(g) {
  let a = 0
  for (const p of polygonsOf(g)) p.forEach((r, i) => (a += (i ? -1 : 1) * Math.abs(ringArea(r))))
  return a
}

export function lengthOf(coords) {
  let L = 0
  for (let i = 1; i < coords.length; i++) {
    const [x0, z0] = xy(coords[i - 1])
    const [x1, z1] = xy(coords[i])
    L += Math.hypot(x1 - x0, z1 - z0)
  }
  return L
}

export function bboxOfCoords(g, into = [Infinity, Infinity, -Infinity, -Infinity]) {
  const v = (c) => {
    if (typeof c[0] === 'number') {
      if (c[0] < into[0]) into[0] = c[0]
      if (c[1] < into[1]) into[1] = c[1]
      if (c[0] > into[2]) into[2] = c[0]
      if (c[1] > into[3]) into[3] = c[1]
    } else c.forEach(v)
  }
  v(g.coordinates)
  return into
}

export function inRing(ring, x, y) {
  let c = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    if (ring[i][1] > y !== ring[j][1] > y && x < ((ring[j][0] - ring[i][0]) * (y - ring[i][1])) / (ring[j][1] - ring[i][1]) + ring[i][0]) c = !c
  }
  return c
}

/** Is [lon, lat] inside a Polygon or MultiPolygon (holes excluded)? */
export function inPolygon(g, [x, y]) {
  for (const p of polygonsOf(g)) if (inRing(p[0], x, y) && !p.slice(1).some((h) => inRing(h, x, y))) return true
  return false
}

/** Metres from a point to the nearest edge of a polygon geometry. */
export function edgeDistance(g, pt) {
  const p = xy(pt)
  let best = Infinity
  for (const poly of polygonsOf(g)) for (const r of poly) for (let i = 1; i < r.length; i++) best = Math.min(best, dist2Seg(p, xy(r[i - 1]), xy(r[i])))
  return Math.sqrt(best)
}

// ---------------------------------------------------------------------------
// Rasters, for carving a layer's polygon with a hand-drawn zone

/** A grid of square cells of `cell` metres over a box [w, s, e, n]. */
export function cellGrid([w, s, e, n], cell) {
  const dLon = cell / KX
  const dLat = cell / KZ
  const W = Math.ceil((e - w) / dLon) + 2
  const H = Math.ceil((n - s) / dLat) + 2
  const w0 = w - dLon
  const n0 = n + dLat
  return { W, H, dLon, dLat, w: w0, n: n0, lon: (i) => w0 + (i + 0.5) * dLon, lat: (j) => n0 - (j + 0.5) * dLat }
}

/** Rasterize polygons onto a grid (cell centres inside). */
export function rasterize(geoms, grid, into = new Uint8Array(grid.W * grid.H)) {
  const { W, H } = grid
  for (const g of geoms)
    for (const poly of polygonsOf(g)) {
      for (let j = 0; j < H; j++) {
        const y = grid.lat(j)
        const xs = []
        for (const r of poly)
          for (let i = 0, k = r.length - 1; i < r.length; k = i++) {
            const [xa, ya] = r[i]
            const [xb, yb] = r[k]
            if (ya > y !== yb > y) xs.push(xa + ((y - ya) * (xb - xa)) / (yb - ya))
          }
        xs.sort((a, b) => a - b)
        for (let q = 0; q + 1 < xs.length; q += 2) {
          const i0 = Math.max(0, Math.ceil((xs[q] - grid.w) / grid.dLon - 0.5))
          const i1 = Math.min(W - 1, Math.floor((xs[q + 1] - grid.w) / grid.dLon - 0.5))
          for (let i = i0; i <= i1; i++) into[j * W + i] = 1
        }
      }
    }
  return into
}

/**
 * Trace a 0/1 mask into polygons along cell edges (outer rings counter-clockwise,
 * holes clockwise), collinear vertices dropped. Returns a MultiPolygon geometry.
 */
export function traceMask(mask, grid) {
  const { W, H } = grid
  const at = (i, j) => (i >= 0 && j >= 0 && i < W && j < H ? mask[j * W + i] : 0)
  // directed edges with the inside on the left, keyed by their start corner
  const next = new Map()
  const key = (i, j) => j * (W + 1) + i
  const add = (a, b) => {
    const k = key(...a)
    if (!next.has(k)) next.set(k, [])
    next.get(k).push(b)
  }
  for (let j = 0; j < H; j++)
    for (let i = 0; i < W; i++) {
      if (!at(i, j)) continue
      // corners: (i, j) top-left .. (i+1, j+1) bottom-right; image y grows south, so "left" is mirrored
      if (!at(i, j - 1)) add([i + 1, j], [i, j]) // top edge, east to west
      if (!at(i - 1, j)) add([i, j], [i, j + 1]) // west edge, north to south
      if (!at(i, j + 1)) add([i, j + 1], [i + 1, j + 1]) // bottom edge, west to east
      if (!at(i + 1, j)) add([i + 1, j + 1], [i + 1, j]) // east edge, south to north
    }
  const rings = []
  for (const [k0, list] of next) {
    while (list.length) {
      const start = [k0 % (W + 1), Math.floor(k0 / (W + 1))]
      const ring = [start]
      let cur = list.pop()
      let prev = start
      while (!(cur[0] === start[0] && cur[1] === start[1])) {
        ring.push(cur)
        const outs = next.get(key(...cur))
        // at a pinch corner prefer the turn that keeps the inside on the left
        let pick = 0
        if (outs.length > 1) {
          const dx = cur[0] - prev[0]
          const dy = cur[1] - prev[1]
          pick = outs.findIndex((o) => (o[0] - cur[0]) * dy - (o[1] - cur[1]) * dx > 0)
          if (pick < 0) pick = 0
        }
        prev = cur
        cur = outs.splice(pick, 1)[0]
      }
      rings.push(ring)
    }
  }
  const toLL = (c) => [grid.w + c[0] * grid.dLon, grid.n - c[1] * grid.dLat]
  const cleaned = rings.map((r) => {
    const out = []
    for (let i = 0; i < r.length; i++) {
      const a = r[(i + r.length - 1) % r.length]
      const b = r[i]
      const c = r[(i + 1) % r.length]
      if ((b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]) !== 0) out.push(toLL(b))
    }
    out.push(out[0])
    return out
  })
  const outers = cleaned.filter((r) => ringArea(r) > 0).map((r) => [r])
  for (const h of cleaned.filter((r) => ringArea(r) < 0)) {
    const o = outers.find((p) => inRing(p[0], h[0][0] + 1e-9, h[0][1] + 1e-9) || inRing(p[0], ...h[Math.floor(h.length / 2)]))
    if (o) o.push(h)
  }
  return { type: 'MultiPolygon', coordinates: outers }
}

/**
 * Carve polygons: keep what lies inside every `within` zone and outside every
 * `outside` zone, on a raster of `cell` metres. Returns a MultiPolygon.
 */
export function carve(geoms, { within = [], outside = [] }, cell = 4) {
  const box = [Infinity, Infinity, -Infinity, -Infinity]
  for (const g of geoms) bboxOfCoords(g, box)
  const grid = cellGrid(box, cell)
  const m = rasterize(geoms, grid)
  for (const z of within) {
    const zm = rasterize([z], grid)
    for (let i = 0; i < m.length; i++) m[i] &= zm[i]
  }
  for (const z of outside) {
    const zm = rasterize([z], grid)
    for (let i = 0; i < m.length; i++) if (zm[i]) m[i] = 0
  }
  return traceMask(m, grid)
}

/** Union of polygons on a raster of `cell` metres (for joining a base's parcels into one outline). */
export function union(geoms, cell = 4) {
  return carve(geoms, {}, cell)
}

// ---------------------------------------------------------------------------
// Simplify, clip, round

/** Simplify a ring (closed) with Douglas–Peucker, keeping it closed and at least a triangle. */
function simplifyRing(ring, tol) {
  const open = ring.slice(0, -1)
  if (open.length < 4) return ring
  // split at the vertex farthest from the first, so both halves are open lines
  const p0 = xy(open[0])
  let far = 1
  let fd = -1
  open.forEach((c, i) => {
    const [x, z] = xy(c)
    const d = (x - p0[0]) ** 2 + (z - p0[1]) ** 2
    if (d > fd) {
      fd = d
      far = i
    }
  })
  const a = simplifyLine(open.slice(0, far + 1), tol)
  const b = simplifyLine([...open.slice(far), open[0]], tol)
  const out = [...a, ...b.slice(1)]
  return out.length >= 4 ? out : ring
}

/** Simplify a Polygon/MultiPolygon; drop parts and holes smaller than minArea m². */
export function simplifyPolygon(g, tol, minArea = 0) {
  // a layer polygon that crosses or pinches itself is first redrawn through the raster, which gives simple rings
  if (polygonsOf(g).some((p) => p.some((r) => crossesItself(r)))) g = union([g])
  const polys = []
  for (const p of polygonsOf(g)) {
    const outer = simplifySimple(p[0], tol)
    if (Math.abs(ringArea(outer)) < minArea) continue
    const holes = p.slice(1).map((h) => simplifySimple(h, tol)).filter((h) => Math.abs(ringArea(h)) >= minArea)
    polys.push([outer, ...holes])
  }
  return wind({ type: 'MultiPolygon', coordinates: polys })
}

/** Simplify a ring, tightening the tolerance until it no longer crosses itself once rounded as the bake writes it. */
function simplifySimple(ring, tol) {
  for (const t of [tol, tol / 2, tol / 4, 1]) {
    const s = simplifyRing(ring, t)
    if (!crossesItself(s)) return s
  }
  return ring
}

function crossesItself(ring0) {
  const ring = ring0.map(([x, y]) => [Math.round(x * 1e5) / 1e5, Math.round(y * 1e5) / 1e5])
  const o = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]))
  const cross = (a, b, c, d) => o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0
  const n = ring.length - 1
  for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) {
    if (i === 0 && j === n - 1) continue
    if (cross(ring[i], ring[i + 1], ring[j], ring[j + 1])) return true
  }
  return false
}

/** RFC 7946 winding: outer rings counter-clockwise, holes clockwise. Single parts become a Polygon. */
export function wind(g) {
  const polys = polygonsOf(g).map((p) => p.map((r, i) => ((ringArea(r) > 0) === (i === 0) ? r : r.slice().reverse())))
  return polys.length === 1 ? { type: 'Polygon', coordinates: polys[0] } : { type: 'MultiPolygon', coordinates: polys }
}

/** Sutherland–Hodgman: clip a ring to a box [w, s, e, n]. */
function clipRing(ring, [w, s, e, n]) {
  let pts = ring.slice(0, -1)
  const edges = [
    [(p) => p[0] >= w, (a, b) => [w, a[1] + ((b[1] - a[1]) * (w - a[0])) / (b[0] - a[0])]],
    [(p) => p[0] <= e, (a, b) => [e, a[1] + ((b[1] - a[1]) * (e - a[0])) / (b[0] - a[0])]],
    [(p) => p[1] >= s, (a, b) => [a[0] + ((b[0] - a[0]) * (s - a[1])) / (b[1] - a[1]), s]],
    [(p) => p[1] <= n, (a, b) => [a[0] + ((b[0] - a[0]) * (n - a[1])) / (b[1] - a[1]), n]],
  ]
  for (const [inside, cut] of edges) {
    const out = []
    for (let i = 0; i < pts.length; i++) {
      const a = pts[(i + pts.length - 1) % pts.length]
      const b = pts[i]
      if (inside(b)) {
        if (!inside(a)) out.push(cut(a, b))
        out.push(b)
      } else if (inside(a)) out.push(cut(a, b))
    }
    pts = out
    if (!pts.length) return null
  }
  return pts.length >= 3 ? [...pts, pts[0]] : null
}

/** Clip a polygon geometry to a box; null if nothing is left. */
export function clipPolygonToBox(g, box) {
  const polys = []
  for (const p of polygonsOf(g)) {
    const o = clipRing(p[0], box)
    if (!o) continue
    polys.push([o, ...p.slice(1).map((h) => clipRing(h, box)).filter(Boolean)])
  }
  return polys.length ? wind({ type: 'MultiPolygon', coordinates: polys }) : null
}

/** Clip a polyline to a box; returns the pieces inside. */
export function clipLineToBox(coords, [w, s, e, n]) {
  const inside = ([x, y]) => x >= w && x <= e && y >= s && y <= n
  const pieces = []
  let cur = []
  for (let i = 0; i < coords.length; i++) {
    if (inside(coords[i])) cur.push(coords[i])
    else if (cur.length) {
      pieces.push(cur)
      cur = []
    }
  }
  if (cur.length) pieces.push(cur)
  return pieces.filter((p) => p.length >= 2)
}

/** Round coordinates to `d` decimals and drop repeated points. */
export function roundGeometry(g, d = 5) {
  const f = 10 ** d
  const r = (c) => [Math.round(c[0] * f) / f, Math.round(c[1] * f) / f]
  const line = (cs) => cs.map(r).filter((c, i, a) => i === 0 || c[0] !== a[i - 1][0] || c[1] !== a[i - 1][1])
  if (g.type === 'Point') return { type: 'Point', coordinates: r(g.coordinates) }
  if (g.type === 'LineString') return { type: 'LineString', coordinates: line(g.coordinates) }
  if (g.type === 'Polygon') return { type: 'Polygon', coordinates: g.coordinates.map(line) }
  if (g.type === 'MultiPolygon') return { type: 'MultiPolygon', coordinates: g.coordinates.map((p) => p.map(line)) }
  throw new Error(`roundGeometry: ${g.type}`)
}

// ---------------------------------------------------------------------------
// Lines

/** Join line pieces end to end into one LineString where their ends meet (within `gap` metres), greedily. */
export function joinLines(pieces, gap = 15) {
  const left = pieces.map((p) => p.slice())
  const close = (a, b) => {
    const [x0, z0] = xy(a)
    const [x1, z1] = xy(b)
    return Math.hypot(x1 - x0, z1 - z0) <= gap
  }
  const out = []
  while (left.length) {
    let line = left.shift()
    let grew = true
    while (grew) {
      grew = false
      for (let i = 0; i < left.length; i++) {
        const p = left[i]
        if (close(line.at(-1), p[0])) line = [...line, ...p.slice(1)]
        else if (close(line.at(-1), p.at(-1))) line = [...line, ...p.slice(0, -1).reverse()]
        else if (close(line[0], p.at(-1))) line = [...p, ...line.slice(1)]
        else if (close(line[0], p[0])) line = [...p.slice().reverse(), ...line.slice(1)]
        else continue
        left.splice(i, 1)
        grew = true
        break
      }
    }
    out.push(line)
  }
  return out.sort((a, b) => lengthOf(b) - lengthOf(a))
}

/** The long axis of a runway rectangle: [lon, lat] ends through its centre, and the rectangle's length and width in metres. */
export function rectangleAxis(g) {
  const ring = polygonsOf(g)[0][0].slice(0, -1)
  const P = ring.map(xy)
  const cx = P.reduce((s, p) => s + p[0], 0) / P.length
  const cz = P.reduce((s, p) => s + p[1], 0) / P.length
  let sxx = 0
  let szz = 0
  let sxz = 0
  for (const [x, z] of P) {
    sxx += (x - cx) ** 2
    szz += (z - cz) ** 2
    sxz += (x - cx) * (z - cz)
  }
  const th = 0.5 * Math.atan2(2 * sxz, sxx - szz)
  const ux = Math.cos(th)
  const uz = Math.sin(th)
  let lo = Infinity
  let hi = -Infinity
  let wlo = Infinity
  let whi = -Infinity
  for (const [x, z] of P) {
    const t = (x - cx) * ux + (z - cz) * uz
    const q = -(x - cx) * uz + (z - cz) * ux
    lo = Math.min(lo, t)
    hi = Math.max(hi, t)
    wlo = Math.min(wlo, q)
    whi = Math.max(whi, q)
  }
  const ll = (t) => [(cx + t * ux) / KX, (cz + t * uz) / KZ]
  return { line: [ll(lo), ll(hi)], length: hi - lo, width: whi - wlo }
}
