// Line and polygon simplification for the table's coast (DATA.md §3), in
// lon/lat with a local metric, so it works anywhere on the table and across
// 180° (longitudes continuous, past 180 where they fall).
//
// From holo-i-ke-au's tools/lib/simplify.mjs (b480c27), which simplified the
// ahupuaʻa boundaries: its Douglas–Peucker, its ring geometry checks
// (ringSignedArea, ringIntersections) and its repair rule (a ring that
// collapses or crosses itself or a sibling is re-simplified at half the
// tolerance until it is valid, down to the source's own vertices) are kept.
// What changed, as R9 §2.13 asked: the Hawaiian metric (metres per degree
// fixed at 20.5° N) is now taken from each line's own mean latitude; the
// integer keys (which lost precision past 2^53 for longitudes beyond 180) are
// gone, since the coast's polygons share no edges after the merge at 180° and
// need no shared-arc topology; and open lines (the coastline strokes) are
// simplified too.

const DEG = Math.PI / 180

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

/** Metres per degree of longitude and latitude at a line's mean latitude. */
function metricOf(pts) {
  let s = 0
  for (const p of pts) s += p[1]
  const lat = s / Math.max(1, pts.length)
  return [Math.cos(lat * DEG) * 111320, 110574]
}

/** Douglas–Peucker on an open polyline of [lon, lat]; endpoints kept; tol in metres. */
export function douglasPeucker(pts, tol, metric = metricOf(pts)) {
  const n = pts.length
  if (n <= 2 || tol <= 0) return pts.slice()
  const [kx, kz] = metric
  const xs = new Float64Array(n)
  const zs = new Float64Array(n)
  for (let i = 0; i < n; i++) {
    xs[i] = pts[i][0] * kx
    zs[i] = pts[i][1] * kz
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
  for (let i = 0; i < n; i++) if (keep[i]) out.push(pts[i])
  return out
}

/** Douglas–Peucker on a closed ring ([lon, lat] with the first point repeated at the end); returns a closed ring. */
export function simplifyRing(ring, tol) {
  const loop = ring.slice(0, -1)
  const n = loop.length
  if (tol <= 0 || n <= 4) return ring.slice()
  const metric = metricOf(loop)
  // split at the vertex farthest from the first, so both halves are open arcs
  let far = 1
  let farD = -1
  for (let i = 1; i < n; i++) {
    const d = ((loop[i][0] - loop[0][0]) * metric[0]) ** 2 + ((loop[i][1] - loop[0][1]) * metric[1]) ** 2
    if (d > farD) {
      farD = d
      far = i
    }
  }
  const a = douglasPeucker(loop.slice(0, far + 1), tol, metric)
  const b = douglasPeucker([...loop.slice(far), loop[0]], tol, metric)
  const out = [...a, ...b.slice(1, -1)]
  out.push(out[0])
  return out
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
 * Pairs of segments that cross or overlap, among all the closed rings given.
 * Segments that only share an endpoint vertex are allowed (consecutive
 * edges, or rings touching at a vertex). Returns a list of [ringIndex,
 * ringIndex] that intersect, empty if none.
 */
export function ringIntersections(rings) {
  const segs = []
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
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
    for (let x = x0; x <= x1; x++)
      for (let y = y0; y <= y1; y++) {
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

/** A ring is usable: at least three distinct points and some area. */
export function ringOk(ring) {
  if (ring.length < 4) return false
  const keys = new Set(ring.map((p) => `${p[0]},${p[1]}`))
  return keys.size >= 3 && ringSignedArea(ring) !== 0
}

// ---------------------------------------------------------------------------

/**
 * Simplify one polygon ([outer, ...holes], closed rings) with DP at tol
 * metres, then round to `digits` decimals; a polygon whose rings collapse or
 * cross is done again at half the tolerance, down to the rounded source.
 * Holes that collapse are dropped; an outer that collapses drops the polygon
 * (returns null). Returns { rings, tol } (the tolerance that held).
 */
export function simplifyPolygon(rings, tol, { digits = 5 } = {}) {
  const q = 10 ** digits
  const round = (ring) => {
    const out = []
    for (const [x, y] of ring) {
      const p = [Math.round(x * q) / q, Math.round(y * q) / q]
      const last = out[out.length - 1]
      if (!last || last[0] !== p[0] || last[1] !== p[1]) out.push(p)
    }
    if (out.length > 1 && (out[0][0] !== out[out.length - 1][0] || out[0][1] !== out[out.length - 1][1])) out.push(out[0])
    return out
  }
  // a ring keeps its winding: a thin ring simplified to a triangle can turn over
  const sign = (r) => Math.sign(ringSignedArea(r))
  const want = rings.map(sign)
  for (let t = tol; ; t = t < 1 ? 0 : t / 2) {
    const outer = round(simplifyRing(rings[0], t))
    if (!ringOk(outer) || sign(outer) !== want[0]) {
      if (t === 0) return null
      continue
    }
    const holes = rings
      .slice(1)
      .map((h, i) => [round(simplifyRing(h, t)), want[i + 1]])
      .filter(([h, w]) => ringOk(h) && sign(h) === w)
      .map(([h]) => h)
    const all = [outer, ...holes]
    if (!ringIntersections(all).length) return { rings: all, tol: t }
    if (t === 0) return { rings: all, tol: 0, invalid: true }
  }
}

/** Simplify an open line with DP at tol metres and round it; null when it collapses to a point. */
export function simplifyLine(pts, tol, { digits = 5 } = {}) {
  const q = 10 ** digits
  const out = []
  for (const [x, y] of douglasPeucker(pts, tol)) {
    const p = [Math.round(x * q) / q, Math.round(y * q) / q]
    const last = out[out.length - 1]
    if (!last || last[0] !== p[0] || last[1] !== p[1]) out.push(p)
  }
  return out.length >= 2 ? out : null
}
