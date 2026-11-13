// Shapes — the Shang "band that ends in a hook" vocabulary (research/01 §2.2).
//
// Every relief motif on a late-Shang bronze is built from a handful of
// primitives: a band of (nearly) constant width running along a spine with
// squared-round corners, which ends in a curl, a hook, a point or against
// another band. This module gives motif authors those primitives as plain
// geometry ([x, y] arrays, in whatever mm frame the caller works in) plus the
// one function that paints them into a Canvas2D path for ReliefPanel.raise /
// sink. Nothing here touches a panel, so the same spine can be raised as a
// plateau, cut as a groove, or used as a clip.
//
//   spine    — a dense polyline (built with Turtle, or fillet(controlPolygon))
//   shape    — { kind: 'band', pts, w, capA, capB } | { kind: 'poly', pts }
//              | { kind: 'circle', c, r } | { kind: 'ellipse', c, rx, ry, rot }
//              | { kind: 'rrect', c, w, h, r, rot }
//              w is mm, or a function t∈[0,1] (arclength) → mm (tapers)
//   caps     — 'round' | 'flat' | 'square' (squared-round: a short butt
//              extension, the arris rounds in the plateau shoulder) | 'point'
//
// Directions: angles in degrees, 0 = +x, 90 = +y. `dir` +1 = turning left
// (counter-clockwise), -1 = turning right. A motif authored as a right half
// (x outward from the axis) and painted through a mirroring transform keeps
// its handedness — the mirror does the rest.
//
// halfMaskFrame() is the normalised half-mask space of KIT.md: authors place
// anchors in (face units, panel-height fraction) and size things in a face
// module `s`, so a mask re-proportions instead of scaling when the panel's
// aspect changes.

const D2R = Math.PI / 180

// ------------------------------------------------------------ path helpers

/**
 * Begin a new path through pts ([x,y] in mm). closed → a smooth loop.
 * tension 0.5 is classic Catmull-Rom; lower is tighter.
 */
export function smoothPath(ctx, pts, closed = false, tension = 0.5) {
  const n = pts.length
  ctx.beginPath()
  if (n === 0) return
  if (n < 3) {
    ctx.moveTo(pts[0][0], pts[0][1])
    for (let i = 1; i < n; i++) ctx.lineTo(pts[i][0], pts[i][1])
    if (closed) ctx.closePath()
    return
  }
  const get = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))])
  const k = tension / 3
  ctx.moveTo(pts[0][0], pts[0][1])
  const segs = closed ? n : n - 1
  for (let i = 0; i < segs; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2)
    ctx.bezierCurveTo(
      p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k,
      p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k,
      p2[0], p2[1],
    )
  }
  if (closed) ctx.closePath()
}

/** Straight polyline path. */
export function polyPath(ctx, pts, closed = false) {
  ctx.beginPath()
  pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])))
  if (closed) ctx.closePath()
}

// ------------------------------------------------------------ polyline math

export function polyLength(pts) {
  let L = 0
  for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
  return L
}

/** Evenly spaced resampling (keeps both ends). */
export function resample(pts, step = 0.5) {
  if (pts.length < 2) return pts.slice()
  const L = polyLength(pts)
  const n = Math.max(1, Math.ceil(L / step))
  const out = [pts[0].slice()]
  let seg = 1, acc = 0
  let segLen = Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1])
  for (let k = 1; k < n; k++) {
    const target = (k / n) * L
    while (acc + segLen < target && seg < pts.length - 1) {
      acc += segLen
      seg++
      segLen = Math.hypot(pts[seg][0] - pts[seg - 1][0], pts[seg][1] - pts[seg - 1][1])
    }
    const t = segLen > 0 ? (target - acc) / segLen : 0
    const a = pts[seg - 1], b = pts[seg]
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
  }
  out.push(pts[pts.length - 1].slice())
  return out
}

/** Cut `a` mm off the start and `b` mm off the end of a polyline. */
export function trim(pts, a = 0, b = 0) {
  const L = polyLength(pts)
  if (a + b >= L) return []
  return subPath(pts, a, L - b)
}

/** The part of a polyline between arclengths l0 and l1 (mm). */
export function subPath(pts, l0, l1) {
  const out = []
  let acc = 0
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i]
    const d = Math.hypot(b[0] - a[0], b[1] - a[1])
    const s0 = acc, s1 = acc + d
    if (s1 >= l0 && s0 <= l1 && d > 0) {
      const t0 = Math.max(0, (l0 - s0) / d), t1 = Math.min(1, (l1 - s0) / d)
      if (!out.length) out.push([a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0])
      out.push([a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1])
    }
    acc = s1
  }
  return out
}

/** Sample a Catmull-Rom spline through control points into an even polyline (free-hand curves: buffalo horns, leaves). */
export function spline(pts, step = 0.4, tension = 0.5) {
  const n = pts.length
  if (n < 3) return resample(pts, step)
  const get = (i) => pts[Math.max(0, Math.min(n - 1, i))]
  const k = tension / 3
  const out = [pts[0].slice()]
  for (let i = 0; i < n - 1; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2)
    const c1 = [p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k]
    const c2 = [p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k]
    const m = Math.max(4, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / (step * 0.5)))
    for (let j = 1; j <= m; j++) {
      const t = j / m, u = 1 - t
      out.push([
        u * u * u * p1[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p2[0],
        u * u * u * p1[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p2[1],
      ])
    }
  }
  return resample(out, step)
}

/** Unit normals (left of travel) at each vertex, averaged over the two adjacent segments. */
export function normals(pts) {
  const n = pts.length
  const out = new Array(n)
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)]
    let dx = b[0] - a[0], dy = b[1] - a[1]
    const l = Math.hypot(dx, dy) || 1
    dx /= l
    dy /= l
    out[i] = [-dy, dx]
  }
  return out
}

/** Direction (deg) of travel at the end (or start, atStart) of a polyline. */
export function headingAt(pts, atStart = false) {
  const n = pts.length
  const [a, b] = atStart ? [pts[0], pts[Math.min(1, n - 1)]] : [pts[Math.max(0, n - 2)], pts[n - 1]]
  return Math.atan2(b[1] - a[1], b[0] - a[0]) / D2R
}

/**
 * Round the corners of a control polygon: a straight run, a short fillet, a
 * straight run — the Shang "squared-round" corner. r is mm (number, or an
 * array per vertex; Infinity = as round as the neighbouring segments allow).
 * Each fillet is clamped to half of each adjacent segment so consecutive
 * corners of a tight spiral never overlap.
 */
export function fillet(pts, r, { closed = false, step = 0.35 } = {}) {
  const n = pts.length
  if (n < 3) return pts.map((p) => p.slice())
  const out = []
  const rad = (i) => (Array.isArray(r) ? r[i] ?? 0 : r)
  const idx = closed ? [...Array(n).keys()] : [...Array(n).keys()].slice(1, n - 1)
  if (!closed) out.push(pts[0].slice())
  for (const i of idx) {
    const v = pts[i], a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n]
    const la = Math.hypot(a[0] - v[0], a[1] - v[1]), lb = Math.hypot(b[0] - v[0], b[1] - v[1])
    const ri = rad(i)
    if (!(ri > 0) || la < 1e-6 || lb < 1e-6) {
      out.push(v.slice())
      continue
    }
    const d1 = [(a[0] - v[0]) / la, (a[1] - v[1]) / la], d2 = [(b[0] - v[0]) / lb, (b[1] - v[1]) / lb]
    const cos = Math.max(-1, Math.min(1, d1[0] * d2[0] + d1[1] * d2[1]))
    const th = Math.acos(cos) // interior angle
    if (th > Math.PI - 1e-3) {
      out.push(v.slice())
      continue
    }
    const tanH = Math.tan(th / 2)
    let t = ri / tanH
    // closed polygons and interior vertices share each segment with the next corner
    const ca = closed || i - 1 > 0 ? 0.5 : 1, cb = closed || i + 1 < n - 1 ? 0.5 : 1
    t = Math.min(t, la * ca, lb * cb)
    const re = t * tanH
    const p1 = [v[0] + d1[0] * t, v[1] + d1[1] * t], p2 = [v[0] + d2[0] * t, v[1] + d2[1] * t]
    const bis = [d1[0] + d2[0], d1[1] + d2[1]]
    const bl = Math.hypot(bis[0], bis[1]) || 1
    const cd = re / Math.sin(th / 2)
    const c = [v[0] + (bis[0] / bl) * cd, v[1] + (bis[1] / bl) * cd]
    let a0 = Math.atan2(p1[1] - c[1], p1[0] - c[0]), a1 = Math.atan2(p2[1] - c[1], p2[0] - c[0])
    let da = a1 - a0
    while (da > Math.PI) da -= 2 * Math.PI
    while (da < -Math.PI) da += 2 * Math.PI
    const k = Math.max(2, Math.ceil((Math.abs(da) * re) / step))
    for (let j = 0; j <= k; j++) {
      const aa = a0 + (da * j) / k
      out.push([c[0] + Math.cos(aa) * re, c[1] + Math.sin(aa) * re])
    }
  }
  if (!closed) out.push(pts[n - 1].slice())
  return out
}

/**
 * Hand-cut irregularity: displace a polyline along its normals by a smooth,
 * seeded wobble (two incommensurate sines with random phase). amp in mm
 * (research/01 §7: ±0.05–0.1 mm), wavelength in mm.
 */
export function wobble(pts, rng, amp = 0.08, wavelength = 14) {
  if (!rng || !(amp > 0) || pts.length < 3) return pts
  const ph1 = rng.range(0, 6.283), ph2 = rng.range(0, 6.283)
  const k1 = 6.283 / wavelength, k2 = 6.283 / (wavelength * 0.43)
  const nrm = normals(pts)
  let acc = 0
  return pts.map((p, i) => {
    if (i) acc += Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1])
    const d = amp * (0.7 * Math.sin(acc * k1 + ph1) + 0.3 * Math.sin(acc * k2 + ph2))
    return [p[0] + nrm[i][0] * d, p[1] + nrm[i][1] * d]
  })
}

// ------------------------------------------------------------ Turtle

/**
 * Build a band's control polygon the way a carver thinks: go forward, turn,
 * go forward, curl in. Every vertex carries its own fillet radius.
 *
 *   const t = new Turtle([x, y], 0)          // heading 0 = +x
 *   t.fwd(20).turn(90, 4).fwd(10).curl({ dir: 1, size: [12, 10], pitch: 6, turns: 1.25, r: 3 })
 *   const spine = t.spine()                   // filleted, evenly resampled polyline
 */
export class Turtle {
  constructor(start, heading = 0) {
    this.v = [[start[0], start[1]]]
    this.r = [0]
    this.h = heading
    this.marks = {}
  }
  get pos() {
    return this.v[this.v.length - 1]
  }
  /** move `len` mm along the heading, adding a vertex */
  fwd(len) {
    const [x, y] = this.pos
    this.v.push([x + Math.cos(this.h * D2R) * len, y + Math.sin(this.h * D2R) * len])
    this.r.push(0)
    return this
  }
  /** turn by deg (+ left) at the current vertex, which gets fillet radius r */
  turn(deg, r = 0) {
    this.h += deg
    this.r[this.r.length - 1] = r
    return this
  }
  /** set an absolute heading at the current vertex */
  head(deg, r = 0) {
    this.h = deg
    this.r[this.r.length - 1] = r
    return this
  }
  /** straight to an absolute point; the vertex left behind gets radius r */
  to(p, r = 0) {
    this.r[this.r.length - 1] = r
    const [x, y] = this.pos
    this.h = Math.atan2(p[1] - y, p[0] - x) / D2R
    this.v.push([p[0], p[1]])
    this.r.push(0)
    return this
  }
  /** remember the current vertex index under a name (e.g. where the curl begins) */
  mark(name) {
    this.marks[name] = this.v.length - 1
    return this
  }
  /**
   * Curl inward from here: a rectilinear spiral (segments a, b, a−p, b−p, …)
   * whose corners are filleted with r. r ≥ half a segment makes it a round
   * C-scroll; r ≈ 0.5 × band width gives the squared 雷纹 look.
   * @param o {dir: ±1, size: number|[a,b] first two sides (mm), pitch (mm), turns, r (mm), shrink}
   */
  curl({ dir = 1, size = 10, pitch = 4, turns = 1, r = 2, shrink = 1 } = {}) {
    const [a, b] = Array.isArray(size) ? size : [size, size]
    const quarters = Math.max(1, Math.round(turns * 4))
    let la = a, lb = b
    for (let q = 0; q < quarters; q++) {
      const len = q % 2 === 0 ? la : lb
      if (len < pitch * 0.35) break
      this.turn(90 * dir, r)
      this.fwd(len)
      if (q % 2 === 1) {
        la = (la - pitch) * shrink
        lb = (lb - pitch) * shrink
      }
      r = Math.min(r, Math.max(0.2, Math.min(la, lb) * 0.5))
    }
    return this
  }
  /** the filleted, evenly resampled spine */
  spine(step = 0.4) {
    return resample(fillet(this.v, this.r), step)
  }
}

// ------------------------------------------------------------ spines

/** Points along a circular arc. a0, a1 in degrees (any sign of sweep). */
export function arcPts(c, r, a0, a1, step = 0.4) {
  const da = (a1 - a0) * D2R
  const n = Math.max(2, Math.ceil((Math.abs(da) * r) / step))
  const out = []
  for (let i = 0; i <= n; i++) {
    const a = a0 * D2R + (da * i) / n
    out.push([c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r])
  }
  return out
}

/**
 * C-scroll spine (CScroll in §2.2): start on a circle of radius R around c at
 * angle `start`, sweep `sweep` degrees in direction dir, radius shrinking by
 * `shrink` per quarter turn (0.1–0.2 is Shang). Returns the spine outside → in.
 */
export function cScroll(c, R, { start = 0, sweep = 270, dir = 1, shrink = 0.15, step = 0.4 } = {}) {
  const out = []
  const total = Math.abs(sweep) * D2R
  const n = Math.max(4, Math.ceil((total * R) / step))
  for (let i = 0; i <= n; i++) {
    const f = i / n
    const a = (start * D2R) + dir * total * f
    const r = R * Math.pow(1 - shrink, (total * f) / (Math.PI / 2))
    out.push([c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r])
  }
  return out
}

/**
 * Squared spiral spine (SqSpiral in §2.2), centre-out segment lengths
 * p·(1,1,2,2,3,3,…), returned OUTSIDE → IN so it can continue a band.
 * c is the spiral centre, `dir` the turning sense when travelling inward,
 * `startHeading` the direction of the outermost segment.
 */
export function sqSpiral(c, { pitch = 2, turns = 2, dir = 1, rCorner = 0.3, startHeading = 0, step = 0.3 } = {}) {
  const n = Math.max(2, Math.round(turns * 4))
  // build centre-out with the opposite turn, then reverse
  const lens = []
  for (let i = 0; i < n; i++) lens.push(pitch * Math.ceil((i + 1) / 2))
  let h = startHeading + 180 + dir * 90 * (n - 1) // heading of the innermost segment, travelling outward
  // walk outward from the centre: each step turns -dir
  const v = [[c[0], c[1]]]
  let x = c[0], y = c[1]
  for (let i = 0; i < n; i++) {
    x += Math.cos(h * D2R) * lens[i]
    y += Math.sin(h * D2R) * lens[i]
    v.push([x, y])
    h -= dir * 90
  }
  v.reverse()
  return resample(fillet(v, rCorner * pitch), step)
}

/**
 * A hook: a straight run of `len` mm along `heading`, then a curl of `curl`
 * degrees with radius `radius` (dir ±1). Used for quills, fangs, claw toes,
 * canthus hooks.
 */
export function hookSpine(base, heading, len, { curl = 90, radius = 2, dir = 1, step = 0.3 } = {}) {
  const t = new Turtle(base, heading).fwd(len)
  const out = t.spine(step)
  const h = t.h
  // circle centre to the turning side
  const cx = t.pos[0] + Math.cos((h + 90 * dir) * D2R) * radius
  const cy = t.pos[1] + Math.sin((h + 90 * dir) * D2R) * radius
  const a0 = h - 90 * dir
  const arc = arcPts([cx, cy], radius, a0, a0 + curl * dir, step)
  return out.concat(arc.slice(1))
}

/** S-scroll: two C-scrolls of opposite sense joined by a straight run from a to b. */
export function sScroll(a, b, R, { sweep = 240, shrink = 0.15, step = 0.4 } = {}) {
  const h = Math.atan2(b[1] - a[1], b[0] - a[0]) / D2R
  // scroll at a (travelled backwards), scroll at b
  const ca = [a[0] + Math.cos((h + 90) * D2R) * R, a[1] + Math.sin((h + 90) * D2R) * R]
  const cb = [b[0] + Math.cos((h - 90) * D2R) * R, b[1] + Math.sin((h - 90) * D2R) * R]
  const sa = cScroll(ca, R, { start: h - 90, sweep, dir: -1, shrink, step }).reverse()
  const sb = cScroll(cb, R, { start: h + 90, sweep, dir: -1, shrink, step })
  return sa.concat(resample([a, b], step).slice(1, -1), sb)
}

// ------------------------------------------------------------ width laws

/** Linear taper from w0 (start) to w1 (end) in mm, as a width function. */
export const taper = (w0, w1, from = 0) => (t) => (t < from ? w0 : w0 + (w1 - w0) * ((t - from) / (1 - from)))

/** Constant, then tapering over the last `frac` of the length to `end` × w (a tail, a horn tip). */
export const tail = (w, frac = 0.4, end = 0.35) => (t) => (t < 1 - frac ? w : w * (1 - (1 - end) * ((t - (1 - frac)) / frac)))

// ------------------------------------------------------------ shapes

export const band = (pts, w, capA = 'round', capB = 'round', extra = {}) => ({ kind: 'band', pts, w, capA, capB, ...extra })
export const poly = (pts, extra = {}) => ({ kind: 'poly', pts, ...extra })
export const circle = (c, r, extra = {}) => ({ kind: 'circle', c, r, ...extra })
export const ellipse = (c, rx, ry, rot = 0, extra = {}) => ({ kind: 'ellipse', c, rx, ry, rot, ...extra })
export const rrect = (c, w, h, r, rot = 0, extra = {}) => ({ kind: 'rrect', c, w, h, r, rot, ...extra })

/** Lens / almond between two points-of-a-circle: length L along `rot`, height Hh. */
export function lens(c, L, Hh, rot = 0, step = 0.3) {
  const a = L / 2, b = Hh / 2
  const R = (a * a + b * b) / (2 * b)
  const half = Math.asin(Math.min(1, a / R)) / D2R
  const up = arcPts([0, b - R], R, 90 + half, 90 - half, step)
  const dn = arcPts([0, R - b], R, -90 + half, -90 - half, step)
  const cs = Math.cos(rot * D2R), sn = Math.sin(rot * D2R)
  return up.concat(dn.slice(1, -1)).map(([x, y]) => [c[0] + x * cs - y * sn, c[1] + x * sn + y * cs])
}

/** Apply a point transform to a shape (returns a new shape). Widths/radii are kept. */
export function mapShape(shape, f) {
  const s = { ...shape }
  if (s.pts) s.pts = s.pts.map(f)
  if (s.c) s.c = f(s.c)
  return s
}

/**
 * Paint one shape as a filled region into ctx (already in mm). `grow` (mm)
 * dilates it — dissolved masks erase a gap around each island with it.
 */
export function drawShape(ctx, s, grow = 0) {
  switch (s.kind) {
    case 'band':
      return drawBand(ctx, s, grow)
    case 'poly':
      if (s.pts.length < 3) return
      polyPath(ctx, s.pts, true)
      ctx.fill()
      if (grow > 0) {
        ctx.lineWidth = grow * 2
        ctx.lineJoin = 'round'
        ctx.stroke()
      }
      return
    case 'circle':
      ctx.beginPath()
      ctx.arc(s.c[0], s.c[1], s.r + grow, 0, Math.PI * 2)
      ctx.fill()
      return
    case 'ellipse':
      ctx.beginPath()
      ctx.ellipse(s.c[0], s.c[1], s.rx + grow, s.ry + grow, (s.rot || 0) * D2R, 0, Math.PI * 2)
      ctx.fill()
      return
    case 'rrect': {
      const w = s.w + grow * 2, h = s.h + grow * 2, r = Math.min(s.r + grow, w / 2, h / 2)
      ctx.save()
      ctx.translate(s.c[0], s.c[1])
      if (s.rot) ctx.rotate(s.rot * D2R)
      ctx.beginPath()
      ctx.moveTo(-w / 2 + r, -h / 2)
      ctx.arcTo(w / 2, -h / 2, w / 2, h / 2, r)
      ctx.arcTo(w / 2, h / 2, -w / 2, h / 2, r)
      ctx.arcTo(-w / 2, h / 2, -w / 2, -h / 2, r)
      ctx.arcTo(-w / 2, -h / 2, w / 2, -h / 2, r)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
      return
    }
  }
}

function extendEnd(pts, atStart, len) {
  if (len <= 0 || pts.length < 2) return pts
  const h = headingAt(pts, atStart) * D2R
  if (atStart) {
    const p = pts[0]
    return [[p[0] - Math.cos(h) * len, p[1] - Math.sin(h) * len], ...pts]
  }
  const p = pts[pts.length - 1]
  return [...pts, [p[0] + Math.cos(h) * len, p[1] + Math.sin(h) * len]]
}

function drawBand(ctx, s, grow) {
  let pts = s.pts
  if (!pts || pts.length < 2) return
  const constant = typeof s.w === 'number'
  const wAt = constant ? () => s.w : s.w
  // squared-round caps: a short butt extension
  if (s.capA === 'square') pts = extendEnd(pts, true, wAt(0) * 0.18)
  if (s.capB === 'square') pts = extendEnd(pts, false, wAt(1) * 0.18)
  const roundA = s.capA === 'round', roundB = s.capB === 'round'
  if (constant && s.capA !== 'point' && s.capB !== 'point') {
    ctx.lineWidth = s.w + grow * 2
    ctx.lineJoin = 'round'
    ctx.lineCap = 'butt'
    polyPath(ctx, pts, false)
    ctx.stroke()
  } else {
    // variable width: one quad per segment with shared vertex normals
    const L = polyLength(pts)
    const nrm = normals(pts)
    let acc = 0
    const ws = pts.map((p, i) => {
      if (i) acc += Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1])
      let t = L > 0 ? acc / L : 0
      let w = wAt(t)
      if (s.capA === 'point') w *= Math.min(1, t * L / Math.max(0.5, wAt(0) * 1.2))
      if (s.capB === 'point') w *= Math.min(1, (1 - t) * L / Math.max(0.5, wAt(1) * 1.2))
      return Math.max(0, w / 2 + grow)
    })
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], na = nrm[i - 1], nb = nrm[i], wa = ws[i - 1], wb = ws[i]
      if (wa <= 0 && wb <= 0) continue
      ctx.beginPath()
      ctx.moveTo(a[0] + na[0] * wa, a[1] + na[1] * wa)
      ctx.lineTo(b[0] + nb[0] * wb, b[1] + nb[1] * wb)
      ctx.lineTo(b[0] - nb[0] * wb, b[1] - nb[1] * wb)
      ctx.lineTo(a[0] - na[0] * wa, a[1] - na[1] * wa)
      ctx.closePath()
      ctx.fill()
    }
    // round joins on tight bends, where the outer side of two quads would gap
    for (let i = 1; i < pts.length - 1; i++) {
      const d = nrm[i - 1][0] * nrm[i + 1][0] + nrm[i - 1][1] * nrm[i + 1][1]
      if (d < 0.985 && ws[i] > 0) {
        ctx.beginPath()
        ctx.arc(pts[i][0], pts[i][1], ws[i], 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }
  const capR = (i, w) => {
    ctx.beginPath()
    ctx.arc(pts[i][0], pts[i][1], w / 2 + grow, 0, Math.PI * 2)
    ctx.fill()
  }
  if (roundA) capR(0, wAt(0))
  if (roundB) capR(pts.length - 1, wAt(1))
  if (grow > 0 && !roundA) capR(0, 0)
  if (grow > 0 && !roundB) capR(pts.length - 1, 0)
}

/** Stroke a polyline as an incised / thread line (for sink/add draws). */
export function strokeLine(ctx, pts, width, cap = 'round') {
  if (!pts || pts.length < 2) return
  ctx.lineWidth = width
  ctx.lineCap = cap
  ctx.lineJoin = 'round'
  polyPath(ctx, pts, false)
  ctx.stroke()
}

// ------------------------------------------------------------ half-mask frame

/**
 * The normalised half-mask space of KIT.md for one rect (panel mm).
 *
 * Creature space: origin at the bottom of the central axis, x OUTWARD (mm),
 * y up (mm) — author a right half in it; `apply(ctx)` maps it onto the left
 * half of rect (and flips it upside down for `invert`, a fangyi lid).
 *
 *   s       face module (mm): min(H, hw / faceW). Sizes (band widths, eye
 *           radii, curl radii) are multiples of s, so a tall panel stretches
 *           the layout but keeps curls round and bands even.
 *   P(x, y) anchor: x in face units (× s × spread), y as a fraction of H
 *   u(v)    v × s, in mm
 *   warp    optional taper: x is scaled by taperAt(y) (taper > 0 narrows toward
 *           the top, < 0 toward the bottom), so a trapezoid (gu foot, fangyi lid)
 *           or a blade is filled edge to edge
 */
export function halfMaskFrame(rect, { faceW = 0.66, spread = 1, reserve = 0, invert = false, taper = 0 } = {}) {
  const H = rect.h
  const hw = rect.w / 2
  const s = Math.min(H, hw / (faceW * spread + reserve))
  const f = {
    rect,
    H,
    hw,
    s,
    spread,
    invert,
    taper,
    cx: rect.x + hw,
    X: (x) => x * s * spread,
    Y: (y) => y * H,
    P: (x, y) => [x * s * spread, y * H],
    u: (v) => v * s,
    /** fraction of the half width left at height y (mm): taper > 0 narrows toward the top, < 0 toward the bottom */
    taperAt: (ymm) => {
      const t = Math.max(0, Math.min(1, ymm / H))
      return taper >= 0 ? 1 - taper * t : 1 + taper * (1 - t)
    },
    /** width available at height y (mm) after the taper */
    widthAt: (ymm) => hw * f.taperAt(ymm),
    warp: (p) => (taper ? [p[0] * f.taperAt(p[1]), p[1]] : p),
    /** creature space → panel mm (for callers that need absolute points) */
    toPanel: (p) => {
      const q = f.warp(p)
      return [f.cx - q[0], rect.y + (invert ? H - q[1] : q[1])]
    },
    /** set ctx so creature-space drawing lands on the left half of rect */
    apply(ctx) {
      ctx.translate(f.cx, rect.y)
      ctx.scale(-1, 1)
      if (invert) {
        ctx.translate(0, H)
        ctx.scale(1, -1)
      }
    },
  }
  return f
}
