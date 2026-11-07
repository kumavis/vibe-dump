// (F9b, DESIGN §4.2.5 "View, input, UI") A long hull's shape on the table:
// the outline of its footprint, which the view draws where a round unit's
// circle goes. A footprint unit (t.fp, core/footprint.js) is two or three
// discs front to back; what the table shows of it is their convex hull (the
// discs' outline), never its bounding circle (R, 3.07" for the Howdah,
// which would ring a patch of table half again as wide as the hull):
//   - its ring (view/units.js: the selection ring, and a transport's
//     capacity pips along it), and its hit volume, the discs' own
//     cylinders, so a pick finds the hull where it stands and not beside
//     it;
//   - its ghost and a group's ghosts (view/overlay.js), at the heading the
//     move would end on;
//   - its base (view/models/howdah.js's longBase).
// Each is made once per footprint in the hull's own frame, heading 0 (+z
// its front), from its discs there (fp.H[0], the snapped offsets, which at
// heading 0 are the record's own), and turned by the hull's yaw, h·π/4: on
// a diagonal the rules' snapped discs sit up to 0.12" from the turned
// outline (the snap error data-check holds to 0.15"), which the table
// can't show at any zoom it draws. Nothing here draws Math.random; three.js
// draws one for each object's uuid, so every shape is made the first time
// a long hull's view asks for it (a table with no long hull makes none).
//
//   discs0(fp)              [[x, z, r]]: the discs at heading 0, front to back
//   outline(fp, pad, n)     the discs' convex hull grown by `pad`, as
//                           [[x, z]] corners anticlockwise seen from above
//                           (+x to +z): each disc sampled at n points
//   hullShapes(fp)          the shapes a hull's view and its ghosts share:
//                           { ring, ghost, hit, pips(n) } (ring: the band
//                           0.02" to 0.18" outside the discs, as a round
//                           unit's ring is round its disc; ghost: the band
//                           0.12" inside them to their edge, as the round
//                           ghost's; hit: the discs' cylinders, a unit high,
//                           centred on y 0, as the round hit cylinder is;
//                           pips(n): n arcs along the outline just outside
//                           the ring, from the front clockwise)
//   bandGeometry(pts, a, b, open)  a flat band in the table's plane (y 0)
//                           between offsets a and b of the outline pts (b >
//                           a), facing up; `open`, a run of it, not the
//                           whole round
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

export const discs0 = (fp) => fp.H[0].map((d) => [d.ix * fp.cell, d.iz * fp.cell, d.r])

// the convex hull (monotone chain) of points [[x, z]], anticlockwise
function convex(ps) {
  const p = [...ps].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lo = [], hi = []
  for (const q of p) {
    while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 1e-12) lo.pop()
    lo.push(q)
  }
  for (let i = p.length - 1; i >= 0; i--) {
    const q = p[i]
    while (hi.length >= 2 && cross(hi[hi.length - 2], hi[hi.length - 1], q) <= 1e-12) hi.pop()
    hi.push(q)
  }
  return [...lo.slice(0, -1), ...hi.slice(0, -1)]
}

export function outline(fp, pad = 0, n = 48) {
  const ps = []
  for (const [x, z, r] of discs0(fp)) for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2
    ps.push([x + Math.cos(a) * (r + pad), z + Math.sin(a) * (r + pad)])
  }
  return convex(ps)
}

// each corner's outward normal: its two edges' normals, averaged (the
// outline is convex and finely sampled, so a corner turns a few degrees)
// (an open run's ends: their one edge's)
function normals(pts, open = false) {
  const n = pts.length
  return pts.map((p, i) => {
    const a = open && i === 0 ? p : pts[(i + n - 1) % n], b = open && i === n - 1 ? p : pts[(i + 1) % n]
    // (anticlockwise seen from above with x right and z up the page: an
    // edge's outward normal is its direction turned a quarter clockwise)
    const ex1 = p[0] - a[0], ez1 = p[1] - a[1], ex2 = b[0] - p[0], ez2 = b[1] - p[1]
    const l1 = Math.hypot(ex1, ez1) || 1, l2 = Math.hypot(ex2, ez2) || 1
    const nx = ez1 / l1 + ez2 / l2, nz = -ex1 / l1 - ex2 / l2, l = Math.hypot(nx, nz) || 1
    return [nx / l, nz / l]
  })
}

export function bandGeometry(pts, a, b, open = false) {
  const ns = normals(pts, open), pos = [], idx = []
  const m = open ? pts.length : pts.length + 1
  for (let k = 0; k < m; k++) {
    const i = k % pts.length, p = pts[i], q = ns[i]
    pos.push(p[0] + q[0] * a, 0, p[1] + q[1] * a, p[0] + q[0] * b, 0, p[1] + q[1] * b)
  }
  for (let k = 0; k < m - 1; k++) {
    const i0 = 2 * k, i1 = i0 + 1, j0 = i0 + 2, j1 = i0 + 3
    // (faces up: the corners run anticlockwise seen from above)
    idx.push(i0, j0, i1, i1, j0, j1)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

// the shapes, by footprint (each type's t.fp is frozen and shared)
const kept = new WeakMap()
export function hullShapes(fp) {
  if (kept.has(fp)) return kept.get(fp)
  const edge = outline(fp, 0, 48)
  const hit = mergeGeometries(discs0(fp).map(([x, z, r]) => new THREE.CylinderGeometry(r, r, 1, 16).translate(x, 0, z)))
  const pipCache = new Map()
  const s = {
    edge,
    ring: bandGeometry(edge, 0.02, 0.18),
    ghost: bandGeometry(edge, -0.12, 0),
    hit,
    // n arcs along the outline 0.21-0.27" out, from the front (+z) round
    // to the right (+x) as a round hull's pips run, each a gap short
    pips(n) {
      if (pipCache.has(n)) return pipCache.get(n)
      // the corners by bearing from the front, clockwise seen from above
      const bear = (p) => {
        const a = Math.atan2(p[0], p[1])
        return a < 0 ? a + Math.PI * 2 : a
      }
      let start = 0
      edge.forEach((p, i) => (bear(p) < bear(edge[start]) ? (start = i) : 0))
      // clockwise is the outline backwards (it runs anticlockwise)
      const cw = Array.from({ length: edge.length }, (_, k) => edge[(start - k + edge.length) % edge.length])
      const len = [0]
      for (let k = 1; k <= cw.length; k++) len.push(len[k - 1] + Math.hypot(cw[k % cw.length][0] - cw[k - 1][0], cw[k % cw.length][1] - cw[k - 1][1]))
      const L = len[cw.length], gap = Math.min(0.18, L / n / 3)
      const at = (s) => {
        let k = 1
        while (k < cw.length && len[k] < s) k++
        const a = cw[k - 1], b = cw[k % cw.length], f = (s - len[k - 1]) / (len[k] - len[k - 1] || 1)
        return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]
      }
      const out = Array.from({ length: n }, (_, j) => {
        const s0 = (j * L) / n + gap / 2, s1 = ((j + 1) * L) / n - gap / 2, pts = []
        for (let k = 0; k <= 6; k++) pts.push(at(s0 + ((s1 - s0) * k) / 6))
        // (the arc's points run clockwise: reversed, the band faces up)
        pts.reverse()
        return bandGeometry(pts, 0.21, 0.27, true)
      })
      pipCache.set(n, out)
      return out
    },
  }
  kept.set(fp, s)
  return s
}
