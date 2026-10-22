// Topology-preserving polygon simplification, written for the boundary bake.
//
// Neighbouring ahupuaʻa share their boundary vertices exactly, and the moku
// layer was dissolved from the ahupuaʻa layer, so its vertices are theirs too.
// Simplifying every ring on its own would give two neighbours two different
// versions of their shared edge (slivers and double lines). Instead, as
// TopoJSON does, every ring of every input layer is cut into arcs at its
// junctions (vertices where three or more distinct edges meet), each distinct
// arc is simplified once with Douglas–Peucker, and every ring that uses an arc
// gets the identical result. Moku and ahupuaʻa lines therefore coincide.
//
// Coordinates are first snapped to a 1e-6 degree grid (about 0.1 m), which is
// what makes the two layers' copies of a vertex compare equal.
import { KX, KZ } from './geo.mjs'

const Q = 1e6
const XOFF = 200 * Q
const YMUL = 1e9

const keyOf = (X, Y) => (X + XOFF) * YMUL + (Y + 90 * Q)
const xOf = (k) => Math.floor(k / YMUL) - XOFF
const yOf = (k) => (k % YMUL) - 90 * Q

/** metres in the shared projection (offsets do not matter for distances) */
const mx = (k) => (xOf(k) / Q) * KX
const mz = (k) => (yOf(k) / Q) * KZ

function segDist2(px, pz, ax, az, bx, bz) {
  const dx = bx - ax
  const dz = bz - az
  const l2 = dx * dx + dz * dz
  let t = l2 > 0 ? ((px - ax) * dx + (pz - az) * dz) / l2 : 0
  t = t < 0 ? 0 : t > 1 ? 1 : t
  const ex = ax + t * dx - px
  const ez = az + t * dz - pz
  return ex * ex + ez * ez
}

/** Douglas–Peucker on an open polyline of keys; endpoints kept. tol in metres. */
export function douglasPeucker(keys, tol) {
  const n = keys.length
  if (n <= 2 || tol <= 0) return keys.slice()
  const xs = new Float64Array(n)
  const zs = new Float64Array(n)
  for (let i = 0; i < n; i++) {
    xs[i] = mx(keys[i])
    zs[i] = mz(keys[i])
  }
  const keep = new Uint8Array(n)
  keep[0] = keep[n - 1] = 1
  const tol2 = tol * tol
  const stack = [[0, n - 1]]
  while (stack.length) {
    const [a, b] = stack.pop()
    let best = -1
    let bestD = tol2
    for (let i = a + 1; i < b; i++) {
      const d = segDist2(xs[i], zs[i], xs[a], zs[a], xs[b], zs[b])
      if (d > bestD) {
        bestD = d
        best = i
      }
    }
    if (best >= 0) {
      keep[best] = 1
      stack.push([a, best], [best, b])
    }
  }
  const out = []
  for (let i = 0; i < n; i++) if (keep[i]) out.push(keys[i])
  return out
}

/** Douglas–Peucker on a closed loop (first key not repeated at the end). */
function simplifyLoop(loop, tol) {
  const n = loop.length
  if (tol <= 0 || n <= 4) return loop.slice()
  // split at the vertex farthest from the first, so both halves are open arcs
  let far = 1
  let farD = -1
  const x0 = mx(loop[0])
  const z0 = mz(loop[0])
  for (let i = 1; i < n; i++) {
    const d = (mx(loop[i]) - x0) ** 2 + (mz(loop[i]) - z0) ** 2
    if (d > farD) {
      farD = d
      far = i
    }
  }
  const a = douglasPeucker(loop.slice(0, far + 1), tol)
  const b = douglasPeucker([...loop.slice(far), loop[0]], tol)
  return [...a, ...b.slice(1, -1)]
}

// ---------------------------------------------------------------------------
// Geometry checks (also used by the checker through the exported helpers)

export function ringSignedArea(ring) {
  // ring: [[lon, lat], ...] closed; positive = counter-clockwise
  let a = 0
  for (let i = 0; i < ring.length - 1; i++) a += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]
  return a / 2
}

function orient(ax, ay, bx, by, cx, cy) {
  const v = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax)
  return v > 0 ? 1 : v < 0 ? -1 : 0
}
function onSeg(ax, ay, bx, by, cx, cy) {
  return Math.min(ax, bx) <= cx && cx <= Math.max(ax, bx) && Math.min(ay, by) <= cy && cy <= Math.max(ay, by)
}
function segmentsIntersect(a, b, c, d) {
  const o1 = orient(a[0], a[1], b[0], b[1], c[0], c[1])
  const o2 = orient(a[0], a[1], b[0], b[1], d[0], d[1])
  const o3 = orient(c[0], c[1], d[0], d[1], a[0], a[1])
  const o4 = orient(c[0], c[1], d[0], d[1], b[0], b[1])
  if (o1 !== o2 && o3 !== o4) return true
  if (o1 === 0 && onSeg(a[0], a[1], b[0], b[1], c[0], c[1])) return true
  if (o2 === 0 && onSeg(a[0], a[1], b[0], b[1], d[0], d[1])) return true
  if (o3 === 0 && onSeg(c[0], c[1], d[0], d[1], a[0], a[1])) return true
  if (o4 === 0 && onSeg(c[0], c[1], d[0], d[1], b[0], b[1])) return true
  return false
}

/**
 * Pairs of segments that cross or overlap, among all the closed rings given
 * (integer or float coordinates). Segments that only share an endpoint
 * vertex are allowed (consecutive edges, or rings touching at a vertex).
 * Returns a list of [ringIndex, ringIndex] that intersect, empty if none.
 */
export function ringIntersections(rings) {
  const segs = []
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  rings.forEach((r, ri) => {
    for (let i = 0; i < r.length - 1; i++) {
      segs.push([r[i], r[i + 1], ri])
      for (const p of [r[i], r[i + 1]]) {
        if (p[0] < minX) minX = p[0]
        if (p[1] < minY) minY = p[1]
        if (p[0] > maxX) maxX = p[0]
        if (p[1] > maxY) maxY = p[1]
      }
    }
  })
  if (!segs.length) return []
  const cells = Math.max(1, Math.ceil(Math.sqrt(segs.length)))
  const cw = (maxX - minX) / cells || 1
  const ch = (maxY - minY) / cells || 1
  const grid = new Map()
  segs.forEach((s, si) => {
    const x0 = Math.floor((Math.min(s[0][0], s[1][0]) - minX) / cw)
    const x1 = Math.floor((Math.max(s[0][0], s[1][0]) - minX) / cw)
    const y0 = Math.floor((Math.min(s[0][1], s[1][1]) - minY) / ch)
    const y1 = Math.floor((Math.max(s[0][1], s[1][1]) - minY) / ch)
    for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) {
      const k = x * 100003 + y
      let l = grid.get(k)
      if (!l) grid.set(k, (l = []))
      l.push(si)
    }
  })
  const same = (p, q) => p[0] === q[0] && p[1] === q[1]
  const bad = new Map()
  for (const l of grid.values()) {
    for (let i = 0; i < l.length; i++) {
      for (let j = i + 1; j < l.length; j++) {
        const s = segs[l[i]]
        const t = segs[l[j]]
        if (same(s[0], t[0]) || same(s[0], t[1]) || same(s[1], t[0]) || same(s[1], t[1])) {
          // sharing a vertex is fine unless the segments are collinear and overlap
          const shared = same(s[0], t[0]) || same(s[0], t[1]) ? s[0] : s[1]
          const so = same(s[0], shared) ? s[1] : s[0]
          const to = same(t[0], shared) ? t[1] : t[0]
          if (orient(shared[0], shared[1], so[0], so[1], to[0], to[1]) === 0) {
            const dot = (so[0] - shared[0]) * (to[0] - shared[0]) + (so[1] - shared[1]) * (to[1] - shared[1])
            if (dot > 0) bad.set(`${s[2]},${t[2]}`, [s[2], t[2]])
          }
          continue
        }
        if (segmentsIntersect(s[0], s[1], t[0], t[1])) bad.set(`${s[2]},${t[2]}`, [s[2], t[2]])
      }
    }
  }
  return [...bad.values()]
}

// ---------------------------------------------------------------------------

/**
 * Simplify the polygons of several FeatureCollections together.
 * layers: array of arrays of features (Polygon or MultiPolygon, lon/lat).
 * Returns { layers: new feature arrays with simplified geometry, stats }.
 */
export function simplifyLayers(layers, tolMetres) {
  // 1. snap and collect rings as key arrays (open: no repeated closing key)
  const ringRefs = [] // { li, fi, pi, ri, keys }
  layers.forEach((feats, li) =>
    feats.forEach((f, fi) => {
      const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
      polys.forEach((poly, pi) =>
        poly.forEach((ring, ri) => {
          const keys = []
          for (const [lon, lat] of ring) {
            const k = keyOf(Math.round(lon * Q), Math.round(lat * Q))
            if (keys[keys.length - 1] !== k) keys.push(k)
          }
          while (keys.length > 1 && keys[0] === keys[keys.length - 1]) keys.pop()
          ringRefs.push({ li, fi, pi, ri, keys })
        }),
      )
    }),
  )

  // 2. junctions: vertices with three or more distinct neighbours
  const nbrs = new Map()
  const addN = (k, n) => {
    let s = nbrs.get(k)
    if (!s) nbrs.set(k, (s = []))
    if (s.length < 3 && !s.includes(n)) s.push(n)
  }
  for (const { keys } of ringRefs) {
    const n = keys.length
    for (let i = 0; i < n; i++) {
      addN(keys[i], keys[(i + n - 1) % n])
      addN(keys[i], keys[(i + 1) % n])
    }
  }
  const isJ = (k) => nbrs.get(k).length >= 3

  // 3. cut rings into arcs; identify each arc canonically
  const arcs = new Map() // id -> { keys (canonical direction), loop, tol, out }
  const lt = (a, b) => a[0] < b[0] || (a[0] === b[0] && a[1] < b[1])
  for (const r of ringRefs) {
    const k = r.keys
    const n = k.length
    r.parts = [] // [{ id, reversed }]
    if (n < 3) continue
    const js = []
    for (let i = 0; i < n; i++) if (isJ(k[i])) js.push(i)
    if (!js.length) {
      // a closed loop: canonical start at its least key, direction toward the lesser neighbour
      let m = 0
      for (let i = 1; i < n; i++) if (k[i] < k[m]) m = i
      let loop = [...k.slice(m), ...k.slice(0, m)]
      if (loop[loop.length - 1] < loop[1]) loop = [loop[0], ...loop.slice(1).reverse()]
      const id = `L${loop[0]}:${loop[1]}`
      const reversed = !(k[(m + 1) % n] === loop[1])
      if (!arcs.has(id)) arcs.set(id, { keys: loop, loop: true, tol: tolMetres })
      r.parts.push({ id, reversed, start: m })
      continue
    }
    for (let q = 0; q < js.length; q++) {
      const a = js[q]
      const b = js[(q + 1) % js.length]
      const seg = []
      for (let i = a; ; i = (i + 1) % n) {
        seg.push(k[i])
        if (i === b && seg.length > 1) break
      }
      const fwd = [seg[0], seg[1]]
      const rev = [seg[seg.length - 1], seg[seg.length - 2]]
      const reversed = lt(rev, fwd)
      const canon = reversed ? seg.slice().reverse() : seg
      const id = `A${canon[0]}:${canon[1]}`
      if (!arcs.has(id)) arcs.set(id, { keys: canon, loop: false, tol: tolMetres })
      r.parts.push({ id, reversed })
    }
  }

  const simplifyArc = (arc) => {
    arc.out = arc.loop ? simplifyLoop(arc.keys, arc.tol) : douglasPeucker(arc.keys, arc.tol)
  }
  for (const arc of arcs.values()) simplifyArc(arc)

  const assemble = (r) => {
    const out = []
    for (const p of r.parts) {
      const arc = arcs.get(p.id)
      let pts = arc.out
      if (arc.loop) {
        pts = p.reversed ? [pts[0], ...pts.slice(1).reverse()] : pts
        out.push(...pts)
      } else {
        pts = p.reversed ? pts.slice().reverse() : pts
        out.push(...(out.length ? pts.slice(1) : pts))
      }
    }
    if (out.length > 1 && out[0] === out[out.length - 1]) out.pop()
    return out
  }
  const toLonLat = (keys) => {
    const ring = keys.map((k) => [xOf(k), yOf(k)])
    ring.push(ring[0])
    return ring
  }

  // 4. repair: a ring that collapses or self-intersects gets its arcs
  // re-simplified at half the tolerance (and its neighbours with it, since
  // they share the arcs), until every ring is valid or the arcs are raw.
  let rounds = 0
  const repaired = new Set()
  const unfixable = new Set()
  for (;;) {
    const failing = []
    // rings grouped per feature, so a hole crossing its shell, or two parts
    // of a MultiPolygon crossing each other, are caught too
    const byFeature = new Map()
    for (const r of ringRefs) {
      if (!r.parts.length) continue
      r.out = assemble(r)
      const key = `${r.li}/${r.fi}`
      let l = byFeature.get(key)
      if (!l) byFeature.set(key, (l = []))
      l.push(r)
    }
    for (const rs of byFeature.values()) {
      const rings = rs.map((r) => toLonLat(r.out))
      const bad = new Set()
      rs.forEach((r, i) => {
        if (new Set(r.out).size < 3 || ringSignedArea(rings[i]) === 0) bad.add(i)
      })
      for (const [a, b] of ringIntersections(rings)) {
        bad.add(a)
        bad.add(b)
      }
      for (const i of bad) if (!unfixable.has(rs[i])) failing.push(rs[i])
    }
    if (!failing.length) break
    rounds++
    for (const r of failing) {
      let changed = 0
      for (const p of r.parts) {
        const arc = arcs.get(p.id)
        if (arc.tol <= 0) continue
        arc.tol = arc.tol < 1 ? 0 : arc.tol / 2
        simplifyArc(arc)
        repaired.add(p.id)
        changed++
      }
      // already at the source's own vertices: the source ring itself is the problem
      if (!changed) unfixable.add(r)
    }
  }

  // 5. rebuild the features; RFC 7946 winding (exterior CCW, holes CW)
  const out = layers.map((feats) => feats.map((f) => ({ ...f, geometry: null, _polys: [] })))
  for (const r of ringRefs) {
    if (!r.parts.length || new Set(r.out).size < 3) continue
    const g = out[r.li][r.fi]
    const ring = toLonLat(r.out).map(([x, y]) => [x / Q, y / Q])
    const ccw = ringSignedArea(ring) > 0
    if ((r.ri === 0) !== ccw) ring.reverse()
    ;(g._polys[r.pi] ||= [])[r.ri] = ring
  }
  let vin = 0
  let vout = 0
  for (const r of ringRefs) {
    vin += r.keys.length
    vout += r.parts.length ? r.out.length : 0
  }
  for (const feats of out) {
    for (const g of feats) {
      const polys = g._polys.filter((p) => p && p[0]).map((p) => p.filter(Boolean))
      delete g._polys
      g.geometry = polys.length === 1 ? { type: 'Polygon', coordinates: polys[0] } : { type: 'MultiPolygon', coordinates: polys }
    }
  }
  const tolHist = {}
  for (const a of arcs.values()) tolHist[a.tol] = (tolHist[a.tol] || 0) + 1
  const invalidInSource = [...unfixable].map((r) => ({ layer: r.li, feature: r.fi, polygon: r.pi, ring: r.ri }))
  return {
    layers: out,
    stats: { rings: ringRefs.length, arcs: arcs.size, verticesIn: vin, verticesOut: vout, repairRounds: rounds, arcsRepaired: repaired.size, arcsByTolerance: tolHist, invalidInSource },
  }
}
