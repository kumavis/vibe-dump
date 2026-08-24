// The Skeleton is the mutable working copy every deformation operator edits.
//
// A stroke is a flat Float64Array of uniformly arc-length-spaced points plus a
// parallel half-width array. Operators only ever move points, set widths, or
// trim the ends — nothing downstream needs to know which operator ran.
import { flattenStroke, polylineLength, bbox, tangents, hashString } from '../geom/path.js'
import { classifyByGeometry } from '../data/strokes.js'
import { EM } from '../data/loader.js'

export { EM }

/**
 * Number of samples for a stroke. Long and multi-cornered strokes get more, so
 * a ㇟ keeps its corners while a dot does not waste points.
 */
function sampleCount(record, stroke, density) {
  const segs = (stroke.cubics.length - 2) / 6
  const base = 10 + segs * 7
  return Math.max(6, Math.min(240, Math.round(base * density)))
}

/**
 * Detect corner points: places where the tangent turns sharply. Operators that
 * smooth or round strokes use this to know what to preserve or attack.
 */
function findCorners(pts, thresholdDeg = 32) {
  const m = pts.length / 2
  const t = tangents(pts)
  const out = []
  const cos = Math.cos((thresholdDeg * Math.PI) / 180)
  for (let i = 2; i < m - 2; i++) {
    // compare the incoming and outgoing directions over a small window
    const ax = pts[i * 2] - pts[i * 2 - 4]
    const ay = pts[i * 2 + 1] - pts[i * 2 - 3]
    const bx = pts[i * 2 + 4] - pts[i * 2]
    const by = pts[i * 2 + 5] - pts[i * 2 + 1]
    const la = Math.hypot(ax, ay) || 1
    const lb = Math.hypot(bx, by) || 1
    const d = (ax * bx + ay * by) / (la * lb)
    if (d < cos) out.push(i)
  }
  void t
  // thin out neighbours so one physical corner yields one index
  const thinned = []
  for (const i of out) if (!thinned.length || i - thinned[thinned.length - 1] > 2) thinned.push(i)
  return thinned
}

/**
 * Build a fresh Skeleton for `record`. Cheap enough to rebuild on every
 * parameter change (≈0.3 ms for a 20-stroke kanji at default density).
 */
export function buildSkeleton(record, { density = 1 } = {}) {
  const strokes = record.strokes.map((s) => {
    const n = sampleCount(record, s, density)
    const pts = flattenStroke(s.cubics, n)
    const corners = findCorners(pts)
    return {
      i: s.index,
      type: s.type,
      base: s.base,
      variant: s.variant,
      name: s.name,
      // untyped tail entries get their family from their own shape
      cls: s.cls || classifyByGeometry(pts, n),
      hook: s.hook,
      group: s.group,
      ancestry: s.ancestry,
      n,
      pts, // flat [x,y,…], mutated in place by operators
      ref: pts.slice(), // pristine copy — legibility scoring and "ghost" render
      w: new Float64Array(n), // half-widths, filled by the nib stage
      corners,
      t0: 0, // arc-length trim from the start (0..1)
      t1: 1, // arc-length trim from the end
      alive: true,
      len: polylineLength(pts),
      refLen: 0,
      // direction of the chord, handy for rhythm/parallel grouping
      angle: Math.atan2(pts[pts.length - 1] - pts[1], pts[pts.length - 2] - pts[0]),
    }
  })
  for (const s of strokes) s.refLen = s.len

  const groups = record.groups.map((g) => ({ ...g, bbox: null, xform: null }))

  const skel = {
    char: record.char,
    record,
    em: EM,
    strokes,
    groups,
    strokeCount: strokes.length,
    seed: hashString(record.char),
    // scratch space shared by operators that need per-render caches
    scratch: {},
  }
  recomputeBounds(skel)
  return skel
}

/** Recompute per-group and whole-glyph bounding boxes from current points. */
export function recomputeBounds(skel) {
  for (const g of skel.groups) {
    let x0 = Infinity
    let y0 = Infinity
    let x1 = -Infinity
    let y1 = -Infinity
    for (let i = g.from; i < g.to; i++) {
      const s = skel.strokes[i]
      if (!s || !s.alive) continue
      const b = bbox(s.pts)
      if (b.x0 < x0) x0 = b.x0
      if (b.y0 < y0) y0 = b.y0
      if (b.x1 > x1) x1 = b.x1
      if (b.y1 > y1) y1 = b.y1
    }
    g.bbox = x0 === Infinity ? null : { x0, y0, x1, y1 }
  }
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (const s of skel.strokes) {
    if (!s.alive) continue
    const b = bbox(s.pts)
    if (b.x0 < x0) x0 = b.x0
    if (b.y0 < y0) y0 = b.y0
    if (b.x1 > x1) x1 = b.x1
    if (b.y1 > y1) y1 = b.y1
  }
  skel.bbox = x0 === Infinity ? { x0: 0, y0: 0, x1: skel.em, y1: skel.em } : { x0, y0, x1, y1 }
  return skel
}

/** Refresh cached polyline lengths after points have moved. */
export function recomputeLengths(skel) {
  for (const s of skel.strokes) if (s.alive) s.len = polylineLength(s.pts)
}

/** Run `fn(x, y, i, stroke)` over every live point; return [x,y] to move it. */
export function mapPoints(skel, fn) {
  for (const s of skel.strokes) {
    if (!s.alive) continue
    for (let i = 0; i < s.n; i++) {
      const r = fn(s.pts[i * 2], s.pts[i * 2 + 1], i, s)
      if (r) {
        s.pts[i * 2] = r[0]
        s.pts[i * 2 + 1] = r[1]
      }
    }
  }
}

/** Apply a 2×3 affine [a,b,c,d,e,f] to the strokes in [from,to). */
export function affineStrokes(skel, from, to, [a, b, c, d, e, f]) {
  for (let k = from; k < to; k++) {
    const s = skel.strokes[k]
    if (!s || !s.alive) continue
    for (let i = 0; i < s.n; i++) {
      const x = s.pts[i * 2]
      const y = s.pts[i * 2 + 1]
      s.pts[i * 2] = a * x + c * y + e
      s.pts[i * 2 + 1] = b * x + d * y + f
    }
  }
}

/** Scale+rotate about a pivot, expressed as an affine for affineStrokes(). */
export function xformAbout(cx, cy, sx, sy, rot = 0) {
  const co = Math.cos(rot)
  const si = Math.sin(rot)
  const a = co * sx
  const b = si * sx
  const c = -si * sy
  const d = co * sy
  return [a, b, c, d, cx - a * cx - c * cy, cy - b * cx - d * cy]
}

/** Points of a stroke after its t0/t1 trim, as a fresh buffer. */
export function trimmedPoints(s) {
  if (s.t0 <= 0 && s.t1 >= 1) return s.pts
  const n = s.n
  const i0 = Math.max(0, Math.min(n - 2, Math.floor(s.t0 * (n - 1))))
  const i1 = Math.min(n - 1, Math.max(i0 + 1, Math.ceil(s.t1 * (n - 1))))
  const out = new Float64Array((i1 - i0 + 1) * 2)
  for (let i = i0; i <= i1; i++) {
    out[(i - i0) * 2] = s.pts[i * 2]
    out[(i - i0) * 2 + 1] = s.pts[i * 2 + 1]
  }
  return out
}

/** Half-widths matching trimmedPoints(). */
export function trimmedWidths(s) {
  if (s.t0 <= 0 && s.t1 >= 1) return s.w
  const n = s.n
  const i0 = Math.max(0, Math.min(n - 2, Math.floor(s.t0 * (n - 1))))
  const i1 = Math.min(n - 1, Math.max(i0 + 1, Math.ceil(s.t1 * (n - 1))))
  return s.w.subarray(i0, i1 + 1)
}
