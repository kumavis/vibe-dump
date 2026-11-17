// Ridge work — décor drawn entirely in FAT, ROUND-TOPPED RIDGES (§ Ridge work in KIT.md).
//
// Some Anyang bronzes draw a whole unit not as plates with incised lines but as raised threads about as wide as the
// grooves between them, every figure several such ridges running parallel: squared spirals filling slanted cells,
// multi-ridge bands with nested corners, hooked coil eyes, columns of S/C scrolls, border bundles. The hanging blade
// of the Nezu Dasikong lei (reference/nezu-fanglei-dasikong, photo-34 / photo-03) is the type specimen.
//
// Everything here is vector work on CENTRE LINES in panel mm. A primitive maps its control geometry through an
// optional point transform (design space → panel mm: a blade warp, a mirror, a vessel's arc mapping) and THEN builds
// its ridges in panel space — offsets, spiral rings, scroll radii — so a ridge stays round-topped and of constant
// width however hard the layout is warped ("warp the paths, not the pixels"). Ridges are collected in a RidgeWork and
// written by flush(): ONE panel.sink for every groove (the footprint of all ridges minus the ridges themselves: the
// groove channel is recorded, so inlay paste and cavity patina land in the grooves) + ONE panel.raise (or add) per
// ridge width with a round crown profile + one sink for eye slits. Deterministic: no randomness at all.

import { leiwenFill } from './leiwen.js'
import { Rng } from '../util/rng.js'

const TAU = Math.PI * 2
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]]
const len = (a) => Math.hypot(a[0], a[1])
const unit = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l] }
const dot = (a, b) => a[0] * b[0] + a[1] * b[1]
const cross = (a, b) => a[0] * b[1] - a[1] * b[0]
const left = (d) => [-d[1], d[0]]
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const IDENTITY = (p) => [p[0], p[1]]

/** Defaults of the ridge profile (mm). groove: how far the grooves between ridges sink BELOW the surrounding ground. */
export const RIDGE_DEFAULTS = Object.freeze({ width: 0.78, pitch: 1.4, height: 0.6, groove: 0.3, crown: 1, mode: 'raise' })

/**
 * Resolve a ridge profile. width = ridge foot width, pitch = ridge + groove (centre to centre), height = crest above
 * the ground, groove = groove floor below the ground (0: ridges stand on the plain ground), crown 1 = semicircular
 * (elliptic) section … 0 = parabolic (or 'round' | 'parabolic'), mode 'raise' (max into the field) | 'add' (on top of
 * whatever is there, e.g. a plateau). width is clamped to 0.85 × pitch so neighbouring ridges never touch.
 */
export function ridgeProfile(o = {}) {
  const r = { ...RIDGE_DEFAULTS }
  for (const k of Object.keys(RIDGE_DEFAULTS)) if (o[k] != null) r[k] = o[k]
  r.pitch = Math.max(0.2, r.pitch)
  r.width = Math.max(0.1, Math.min(r.width, r.pitch * 0.85))
  r.fn = crownProfile(r.crown)
  return r
}

/** (s, w) → 0..1 cross-section for panel.raise: s = mm in from the ridge edge, w = half width. */
export function crownProfile(crown = 1) {
  const c = typeof crown === 'string' ? (crown === 'parabolic' ? 0 : 1) : Math.max(0, Math.min(1, crown))
  return (s, w) => {
    if (s <= 0) return 0
    const u = 1 - Math.min(s / w, 1)
    return c * Math.sqrt(1 - u * u) + (1 - c) * (1 - u * u)
  }
}

// ------------------------------------------------------------------ path geometry (panel space)

/** Subdivide segments longer than `step` (original vertices flagged as corners), then map through T. */
function mapPath(ctrl, T, step) {
  if (T === IDENTITY) return { pts: ctrl.map((p) => [p[0], p[1]]), corner: ctrl.map(() => true) }
  const pts = [], corner = []
  for (let i = 0; i < ctrl.length - 1; i++) {
    const a = ctrl[i], b = ctrl[i + 1]
    const k = Math.max(1, Math.ceil(len(sub(b, a)) / step))
    for (let j = 0; j < k; j++) { pts.push(T(lerp(a, b, j / k))); corner.push(j === 0) }
  }
  pts.push(T(ctrl[ctrl.length - 1])); corner.push(true)
  return { pts, corner }
}

function cumLen(P) {
  const c = [0]
  for (let i = 1; i < P.length; i++) c.push(c[i - 1] + len(sub(P[i], P[i - 1])))
  return c
}
function pointAt(P, cum, s) {
  if (s <= 0) return P[0].slice()
  let i = 1
  while (i < P.length - 1 && cum[i] < s) i++
  const t = (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1)
  return lerp(P[i - 1], P[i], Math.min(1, Math.max(0, t)))
}

/**
 * Round the corners of an open polyline: at every flagged interior vertex a circular arc of radius rad(i) (mm),
 * shrunk where the neighbouring segments are too short (half of a segment shared with the next corner). Dense
 * (mapped) points between corners are kept, so a warped straight line stays curved.
 */
export function roundPath(P, corner, rad, step = 0.3) {
  const n = P.length
  if (n < 3) return P.map((p) => p.slice())
  const cum = cumLen(P)
  const C = []
  for (let i = 1; i < n - 1; i++) if (!corner || corner[i]) C.push(i)
  const R = typeof rad === 'function' ? rad : () => rad
  const out = [P[0].slice()]
  let s = 0
  const emit = (s0, s1) => { for (let j = 0; j < n; j++) if (cum[j] > s0 + 1e-9 && cum[j] < s1 - 1e-9) out.push(P[j].slice()) }
  C.forEach((i, k) => {
    const prev = k ? C[k - 1] : 0, next = k < C.length - 1 ? C[k + 1] : n - 1
    const la = (cum[i] - Math.max(s, cum[prev])) * (k ? 0.5 : 1)
    const lb = (cum[next] - cum[i]) * (k < C.length - 1 ? 0.5 : 1)
    const din = unit(sub(P[i], P[i - 1])), dout = unit(sub(P[i + 1], P[i]))
    const turn = Math.acos(Math.max(-1, Math.min(1, dot(din, dout))))
    const r = R(i, k)
    if (turn < 1e-3 || !(r > 0)) return
    const half = (Math.PI - turn) / 2
    const t = Math.max(0, Math.min(r / Math.tan(half), la, lb))
    if (t < 1e-4) return
    const s0 = cum[i] - t, s1 = cum[i] + t
    emit(s, s0)
    const p1 = pointAt(P, cum, s0), p2 = pointAt(P, cum, s1)
    const d1 = unit(sub(P[i], p1)), sg = Math.sign(cross(d1, unit(sub(p2, P[i])))) || 1
    const rr = t * Math.tan(half)
    const c = [p1[0] + left(d1)[0] * sg * rr, p1[1] + left(d1)[1] * sg * rr]
    const a0 = Math.atan2(p1[1] - c[1], p1[0] - c[0])
    let da = Math.atan2(p2[1] - c[1], p2[0] - c[0]) - a0
    while (da > Math.PI) da -= TAU
    while (da < -Math.PI) da += TAU
    const m = Math.max(2, Math.ceil((Math.abs(da) * rr) / step))
    const end = [c[0] + Math.cos(a0 + da) * rr, c[1] + Math.sin(a0 + da) * rr]
    const fix = sub(p2, end) // a mapped (curved) segment: blend onto the true tangent point
    for (let j = 0; j <= m; j++) {
      const a = a0 + (da * j) / m
      out.push([c[0] + Math.cos(a) * rr + fix[0] * (j / m), c[1] + Math.sin(a) * rr + fix[1] * (j / m)])
    }
    s = s1
  })
  emit(s, cum[n - 1])
  out.push(P[n - 1].slice())
  return out
}

/** Offset an open polyline by `o` mm to its left (o(s) may be a function of arc length); back-tracking points (an
 *  inner offset tighter than its corner) are dropped, so nested corners never loop. */
export function offsetPath(P, o) {
  const n = P.length
  const cum = cumLen(P)
  const f = typeof o === 'function' ? o : () => o
  const out = []
  let last = null
  for (let i = 0; i < n; i++) {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)]
    const t = unit(sub(b, a)), nl = left(t), d = f(cum[i])
    const q = [P[i][0] + nl[0] * d, P[i][1] + nl[1] * d]
    if (last && dot(sub(q, last), t) <= 1e-6 && i < n - 1) continue
    out.push(q)
    last = q
  }
  return out
}

/** points of a half turn from a to b bulging toward `dir` (a U-turn joining two parallel ridges) */
function uTurn(a, b, dir, step = 0.3) {
  const m = lerp(a, b, 0.5), r = len(sub(b, a)) / 2
  const u = sub(a, m), d = unit(dir)
  const k = Math.max(4, Math.ceil((Math.PI * r) / step))
  const out = []
  for (let j = 1; j < k; j++) {
    const ph = (Math.PI * j) / k
    out.push([m[0] + u[0] * Math.cos(ph) + d[0] * r * Math.sin(ph), m[1] + u[1] * Math.cos(ph) + d[1] * r * Math.sin(ph)])
  }
  return out
}

function signedArea(V) {
  let a = 0
  for (let i = 0; i < V.length; i++) a += cross(V[i], V[(i + 1) % V.length])
  return a / 2
}
function intersect(p, d, q, e) {
  const den = cross(d, e)
  if (Math.abs(den) < 1e-9) return null
  const t = cross(sub(q, p), e) / den
  return [p[0] + d[0] * t, p[1] + d[1] * t]
}

// ------------------------------------------------------------------ the work batch

/**
 * A batch of ridges for one panel. opts: ridge profile (RIDGE_DEFAULTS), transform (design → panel mm; default
 * identity), step (mm: how finely control paths are subdivided before a non-identity transform, 1.5).
 * Every primitive takes per-call profile overrides (width, pitch, height, groove, crown, mode) and `transform`
 * (null = the points are already panel mm). Call flush() once at the end.
 */
export class RidgeWork {
  constructor(panel, opts = {}) {
    this.panel = panel
    this.profile = ridgeProfile(opts)
    this.T = opts.transform || IDENTITY
    this.step = opts.step ?? 1.5
    this.lines = []
    this.slits = []
    this.bosses = []
    this.plateaus = []
    this.stats = { lines: 0, ms: 0 }
  }

  /** A view sharing this batch whose transform is `this.T ∘ f` (f maps the new design space into the current one). */
  view(f) {
    const v = Object.create(this)
    const T = this.T
    v.T = T === IDENTITY ? f : (p) => T(f(p))
    return v
  }
  /** mirror about x = axis (design space): draw a half, then draw it again through work.mirror() */
  mirror(axis = 0) { return this.view((p) => [2 * axis - p[0], p[1]]) }

  _prof(o) { return o && Object.keys(o).some((k) => k in RIDGE_DEFAULTS) ? ridgeProfile({ ...this.profile, ...pickProfile(o) }) : this.profile }
  _tf(o) { return o && o.transform === null ? IDENTITY : (o && o.transform) || this.T }
  /** orientation of T at p: +1 keeps handedness, −1 mirrors */
  _det(T, p) {
    if (T === IDENTITY) return 1
    const a = T(p), b = T([p[0] + 0.5, p[1]]), c = T([p[0], p[1] + 0.5])
    return Math.sign(cross(sub(b, a), sub(c, a))) || 1
  }
  _push(pts, P) {
    if (pts.length < 2) return
    this.lines.push({ pts, width: P.width, pitch: P.pitch, height: P.height, groove: P.groove, crown: P.crown, mode: P.mode, fn: P.fn })
  }

  /** one ridge along a path (design space) */
  line(path, o = {}) { return this.ridgeBand(path, { ...o, ridges: 1 }) }

  /**
   * n parallel ridges swept along a polyline, corners NESTED (each ridge's arc concentric; the innermost has radius
   * `bend`), ends 'square' | 'round' (nested U-turns: ridge i joins ridge n−1−i) | 'hook' (the bundle turns
   * `hookAngle`° toward `dir` and ends in U-turns) | 'spiral' (the bundle rolls `turns` into a coil and ends in U-turns).
   * dir +1 curls to the LEFT of travel in design space. taper: [a, b] scales the spacing from start to end (ridge
   * width stays; spacing never drops under 1.2 × width). closed: true closes the path. → panel-space centre lines.
   */
  ridgeBand(path, o = {}) {
    const P = this._prof(o), T = this._tf(o)
    const n = Math.max(1, Math.round(o.ridges ?? 3))
    const pitch = P.pitch, half = ((n - 1) / 2) * pitch
    const bend = o.bend ?? Math.max(pitch * 0.5, P.width)
    let ctrl = path
    if (o.closed) { const m = lerp(path[0], path[1], 0.5); ctrl = [m, ...path.slice(1), path[0], m] }
    const { pts, corner } = mapPath(ctrl, T, this.step)
    const det = this._det(T, path[0])
    let C = roundPath(pts, corner, half + bend)
    const curl = (Cp, kind, dir) => {
      const E = Cp[Cp.length - 1], d = unit(sub(E, Cp[Cp.length - 2]))
      const sg = dir * det, nl = left(d)
      const R0 = kind === 'spiral'
        ? Math.max(half + bend, half + pitch * 0.9 + n * pitch * (o.turns ?? 0.75))
        : half + (o.hookBend ?? bend)
      const c = [E[0] + nl[0] * sg * R0, E[1] + nl[1] * sg * R0]
      const th0 = Math.atan2(E[1] - c[1], E[0] - c[0])
      const sweep = kind === 'spiral' ? TAU * (o.turns ?? 0.75) : ((o.hookAngle ?? 180) * Math.PI) / 180
      const out = []
      for (let ph = 0.25 / R0; ph <= sweep; ph += 0.3 / R0) {
        const r = kind === 'spiral' ? R0 - (n * pitch * ph) / TAU : R0
        if (r < half + pitch * 0.7) break
        out.push([c[0] + Math.cos(th0 + sg * ph) * r, c[1] + Math.sin(th0 + sg * ph) * r])
      }
      return out
    }
    const start = o.start ?? 'square', end = o.end ?? 'square'
    if (end === 'hook' || end === 'spiral') C = C.concat(curl(C, end, o.dir ?? 1))
    if (start === 'hook' || start === 'spiral') C = curl(C.slice().reverse(), start, -(o.startDir ?? o.dir ?? 1)).reverse().concat(C)
    const L = cumLen(C)[C.length - 1] || 1
    const tp = o.taper || [1, 1], minK = (P.width * 1.2) / pitch
    const scale = (s) => Math.max(minK, tp[0] + (tp[1] - tp[0]) * (s / L))
    let R = []
    for (let i = 0; i < n; i++) {
      const off = (i - (n - 1) / 2) * pitch
      R.push(off === 0 ? C.map((p) => p.slice()) : offsetPath(C, (s) => off * scale(s)))
    }
    let PL = P
    if (o.plateau) {
      // a FIGURE: the bundle stands on its own low plateau, ringed by a sunk channel; its ridges are cut into the top
      const pl = { height: 1, margin: P.pitch - P.width, shoulder: null, channel: P.pitch * 0.6, channelDepth: 0.5, ...(o.plateau === true ? {} : o.plateau) }
      const Wp = 2 * half + P.width + 2 * pl.margin
      this.plateaus.push({ pts: C, width: Wp, height: pl.height, shoulder: pl.shoulder ?? Math.min(Wp / 2, Math.max(0.35, pl.height * 0.5)), channel: pl.channel, channelDepth: pl.channelDepth, cap: o.closed ? 'round' : [start, end].every((e) => e === 'square' || e === 'flat') ? 'butt' : 'round' })
      PL = { ...P, mode: 'add' }
    }
    if (o.closed) { for (const r of R) this._push(r, PL); return R }
    const dEnd = unit(sub(C[C.length - 1], C[C.length - 2])), dStart = unit(sub(C[0], C[1]))
    const roundEnd = end !== 'square' && end !== 'flat', roundStart = start !== 'square' && start !== 'flat'
    const out = []
    const used = new Set()
    for (let i = 0; i < n; i++) {
      if (used.has(i)) continue
      const j = n - 1 - i
      if (j <= i) { out.push(R[i]); continue }
      used.add(j)
      const a = R[i], b = R[j]
      if (roundEnd) {
        let line = [...a, ...uTurn(a[a.length - 1], b[b.length - 1], dEnd), ...b.slice().reverse()]
        if (roundStart) line = [...line, ...uTurn(b[0], a[0], dStart), a[0].slice()]
        out.push(line)
      } else if (roundStart) {
        out.push([...b.slice().reverse(), ...uTurn(b[0], a[0], dStart), ...a])
      } else { out.push(a, b) }
    }
    for (const r of out) this._push(r, PL)
    return out
  }

  /** a border bundle: ridgeBand with square ends (closed: true for a closed outline) */
  ridgeBorder(path, o = {}) { return this.ridgeBand(path, { ridges: 3, start: 'square', end: 'square', ...o }) }

  /**
   * A squared spiral of ridge filling an arbitrary CONVEX quadrilateral (4 corners in design space, any order round
   * the outline; the spiral travels them in that order from corner `start`, dir −1 reverses). Every ring is the quad
   * inset by whole pitches (edges stay parallel to the cell's own slanted sides), corners rounded by
   * `corner` (mm, or [4] per quad corner; default 2 × pitch) shrinking by one pitch per ring down to `cornerMin`;
   * the first ring sits `margin` (pitch/2) inside the quad, so two cells sharing a side are one pitch apart.
   * turns: number of rings (with no explicit pitch, pitch is fitted so `turns` rings fill the cell);
   * hook: length of the inward hook that ends the spiral (default 0.9 pitch); hole: keep this much of the centre clear
   * (mm of inset); tail: a straight lead-in this long before the start corner.
   */
  quadSpiral(quad, o = {}) {
    let P = this._prof(o)
    const T = this._tf(o)
    let V = quad.map(T)
    const k0 = ((o.start ?? 0) % 4 + 4) % 4
    V = [0, 1, 2, 3].map((i) => V[(k0 + i) % 4])
    const cornerIn = Array.isArray(o.corner) ? [0, 1, 2, 3].map((i) => o.corner[(k0 + i) % 4]) : null
    if (o.dir === -1) { V = [V[0], V[3], V[2], V[1]]; if (cornerIn) cornerIn.splice(1, 3, cornerIn[3], cornerIn[2], cornerIn[1]) }
    const ccw = signedArea(V) > 0
    const E = V.map((a, k) => {
      const d = unit(sub(V[(k + 1) % 4], a))
      return { a, d, n: ccw ? left(d) : [d[1], -d[0]] }
    })
    const lineAt = (m, ins) => { const e = E[((m % 4) + 4) % 4]; return [[e.a[0] + e.n[0] * ins, e.a[1] + e.n[1] * ins], e.d] }
    const valid = (ins) => {
      const Q = [0, 1, 2, 3].map((k) => { const [p, d] = lineAt(k - 1, ins), [q, e] = lineAt(k, ins); return intersect(p, d, q, e) })
      if (Q.some((q) => !q)) return false
      for (let k = 0; k < 4; k++) if (dot(sub(Q[(k + 1) % 4], Q[k]), E[k].d) <= 0) return false
      return true
    }
    let lo = 0, hi = 0.5 * Math.min(...E.map((e, k) => len(sub(V[(k + 1) % 4], e.a))))
    for (let it = 0; it < 30; it++) { const m = (lo + hi) / 2; if (valid(m)) lo = m; else hi = m }
    const Dmax = lo
    const m0 = o.margin ?? P.pitch / 2
    if (o.turns && o.pitch == null) {
      const pitch = Math.max(P.width * 1.25, (Dmax - m0 - (o.hole ?? 0)) / (o.turns + 0.25))
      P = ridgeProfile({ ...P, pitch, width: pitch * (P.width / P.pitch) })
    }
    const pitch = P.pitch
    const inset = (m) => m0 + Math.floor(m / 4) * pitch
    const mMax = o.turns ? Math.round(o.turns * 4) : 4000
    const limit = Dmax - (o.hole ?? 0)
    const X = (m) => { const [p, d] = lineAt(m, inset(m)), [q, e] = lineAt(m + 1, inset(m + 1)); return intersect(p, d, q, e) }
    const first = (() => { const [p, d] = lineAt(3, m0), [q, e] = lineAt(0, m0); return intersect(p, d, q, e) })()
    if (!first || m0 > limit) return []
    const verts = [first]
    const minSeg = o.minSeg ?? pitch * 0.45
    let m = 0
    for (; m < mMax; m++) {
      if (inset(m + 1) > limit) break
      const v = X(m)
      if (!v || dot(sub(v, verts[verts.length - 1]), E[m % 4].d) < minSeg) break
      verts.push(v)
    }
    // the centre hook: a short run along the next edge
    const hookLen = o.hook ?? pitch * 0.9
    if (hookLen > 0 && verts.length > 1 && m < mMax) {
      const last = verts[verts.length - 1], d = E[m % 4].d
      const v = X(m)
      const along = v ? dot(sub(v, last), d) : 0
      const L = Math.min(hookLen, along > 0 ? along : hookLen * 0.6)
      if (L > P.width * 0.5) verts.push([last[0] + d[0] * L, last[1] + d[1] * L])
    }
    if (o.tail) { const d = E[0].d; verts.unshift([first[0] - d[0] * o.tail, first[1] - d[1] * o.tail]) }
    const base = o.corner ?? pitch * 2, rMin = o.cornerMin ?? P.width * 0.6
    const off = o.tail ? 1 : 0
    // vertex j (after the start) sits near quad corner j % 4 (the start corner is 0)
    const rad = (i) => {
      const j = i - off
      const c = cornerIn ? cornerIn[j % 4] : base
      return Math.max(rMin, c - Math.floor(Math.max(0, j - 1) / 4) * pitch)
    }
    const pts = roundPath(verts, null, rad)
    this._push(pts, P)
    return pts
  }

  /**
   * The hooked eye: a C/D coil of the same ridges round a sunk slit. at (design), w × h mm (panel), angle (deg, in the
   * local frame of the transform), shape 'D' (flat toward +x of the local frame) | 'C' | 'O', turns (default: as many
   * as fit), slit: { len (0.42 w), width (0.75 pitch), depth (height + groove + 0.15) } | false, tail (mm lead-in).
   */
  hookEye(at, o = {}) {
    const P = this._prof(o), T = this._tf(o)
    const c = T(at), det = this._det(T, at)
    let ex = T === IDENTITY ? [1, 0] : unit(sub(T([at[0] + 0.5, at[1]]), c))
    const ang = ((o.angle ?? 0) * Math.PI) / 180 * det
    ex = [ex[0] * Math.cos(ang) - ex[1] * Math.sin(ang), ex[0] * Math.sin(ang) + ex[1] * Math.cos(ang)]
    const ey = left(ex).map((v) => v * det)
    const w = o.w ?? 8, h = o.h ?? 6
    const P4 = (sx, sy) => [c[0] + ex[0] * sx * w / 2 + ey[0] * sy * h / 2, c[1] + ex[1] * sx * w / 2 + ey[1] * sy * h / 2]
    const quad = [P4(-1, 1), P4(1, 1), P4(1, -1), P4(-1, -1)]
    const R = Math.min(w, h) / 2, r = Math.max(P.width, P.pitch * 0.9)
    const shape = o.shape ?? 'D'
    const corner = shape === 'D' ? [R, r, r, R] : shape === 'C' ? [R, R, R, R] : [R * 0.8, R * 0.8, R * 0.8, R * 0.8]
    const slit = o.slit === false ? null : { len: w * 0.42, width: P.pitch * 0.75, depth: P.height + P.groove + 0.15, ...(o.slit || {}) }
    const hole = slit ? slit.width / 2 + P.pitch * 0.45 : 0
    const pts = this.quadSpiral(quad, { ...pickProfile(o), transform: null, corner, hole, tail: o.tail, turns: o.turns, hook: o.hook, start: o.start ?? 0, dir: (o.dir ?? 1) * det })
    if (slit) {
      const L = slit.len / 2
      this.slits.push({ pts: [[c[0] - ex[0] * L, c[1] - ex[1] * L], [c[0] + ex[0] * L, c[1] + ex[1] * L]], width: slit.width, depth: slit.depth })
    }
    return pts
  }

  /**
   * The slit eye: a raised PILLOWED boss whose outline is a superellipse (an elongated squircle), w × h mm (w the long
   * axis), squareness 0 (ellipse) … 1 (near-rectangle; 0.6 default), angle (deg, local frame of the transform), height
   * (mm, default 2.4 × the ridge height), crown 0..1 (how domed the top is; 0.8), a sunk slit along the long axis
   * slit: { length (0.62 w), width (0.8 pitch), depth (0.55 height) } | false, and ring: { ridges (1), gap (mm between
   * the boss foot and the ring; the profile's groove width) } | false — ridges that follow the same outline.
   * → the outline (panel mm). Drawn by flush() after the ridges (raise = max), so it may sit on a ridge field.
   */
  slitEye(at, o = {}) {
    const P = this._prof(o), T = this._tf(o)
    const c = T(at), det = this._det(T, at)
    let ex = T === IDENTITY ? [1, 0] : unit(sub(T([at[0] + 0.5, at[1]]), c))
    const ang = ((o.angle ?? 0) * Math.PI) / 180 * det
    ex = [ex[0] * Math.cos(ang) - ex[1] * Math.sin(ang), ex[0] * Math.sin(ang) + ex[1] * Math.cos(ang)]
    const ey = left(ex)
    const w = o.w ?? 12, h = o.h ?? 7, sq = Math.max(0, Math.min(0.98, o.squareness ?? 0.6))
    const e = 2 / (1 + sq * 5) // superellipse exponent on |cos|, |sin|: 2/(n/2)… n = 2 (ellipse) → 12 (squarish)
    const shape = (gw) => {
      const out = [], k = 96
      for (let i = 0; i < k; i++) {
        const th = (TAU * i) / k, cs = Math.cos(th), sn = Math.sin(th)
        const x = Math.sign(cs) * Math.pow(Math.abs(cs), e) * (w / 2 + gw), y = Math.sign(sn) * Math.pow(Math.abs(sn), e) * (h / 2 + gw)
        out.push([c[0] + ex[0] * x + ey[0] * y, c[1] + ex[1] * x + ey[1] * y])
      }
      return out
    }
    const outline = shape(0)
    const height = o.height ?? P.height * 2.4
    this.bosses.push({ pts: outline, height, shoulder: Math.min(w, h) / 2, crown: o.crown ?? 0.8 })
    if (o.slit !== false) {
      const sl = { length: w * 0.62, width: P.pitch * 0.8, depth: height * 0.55, ...(o.slit || {}) }
      const L = sl.length / 2
      this.slits.push({ pts: [[c[0] - ex[0] * L, c[1] - ex[1] * L], [c[0] + ex[0] * L, c[1] + ex[1] * L]], width: sl.width, depth: sl.depth })
    }
    if (o.ring) {
      const rg = { ridges: 1, gap: (P.pitch - P.width) * 1.25, ...(o.ring === true ? {} : o.ring) }
      for (let i = 0; i < rg.ridges; i++) {
        const loop = shape(rg.gap + P.width / 2 + i * P.pitch)
        loop.push(loop[0].slice(), loop[1].slice())
        this._push(loop, P)
      }
    }
    return outline
  }

  /**
   * A chain of S/C scrolls along a path (the strip's centre line, design space): `strip` = the strip width (mm, 8), one curled hook every `spacing` mm,
   * each a round spiral of the ridge (`turns`, turns one pitch apart) entered by a tail from
   * the previous unit (ridge width / pitch are the profile's, as everywhere); alternate (true): the hooks curl to alternate sides — an S chain;
   * side ±1: which side the first one curls from.
   */
  scrollChain(path, o = {}) {
    const P = this._prof(o), T = this._tf(o)
    const sw = o.strip ?? 8, step = o.spacing ?? sw * 1.08, rp = P.pitch
    const { pts } = mapPath(path, T, this.step)
    const det = this._det(T, path[0])
    const cum = cumLen(pts), L = cum[cum.length - 1]
    const R = Math.min(sw, step) / 2 - P.width / 2 - 0.05
    const turns = Math.max(0.6, Math.min(o.turns ?? 1.5, (R - rp * 0.55) / rp))
    const count = Math.floor(L / step)
    if (count < 1 || R <= rp) return []
    const s0 = (L - count * step) / 2 + step / 2
    const out = []
    const rng = new Rng(o.seed ?? 7), vary = o.vary ?? 0
    const R0 = R
    for (let i = 0; i < count; i++) {
      const R = R0 * (1 - vary * rng.next()), turnsI = Math.max(0.6, Math.min(turns, (R - rp * 0.55) / rp))
      const s = s0 + i * step + vary * (rng.next() - 0.5) * (step - 2 * R0) * 0.8
      const p = pointAt(pts, cum, s)
      const t = unit(sub(pointAt(pts, cum, s + 0.5), pointAt(pts, cum, s - 0.5))), nl = left(t)
      const hs = (o.side ?? 1) * det * (o.alternate === false || i % 2 === 0 ? 1 : -1)
      const Lp = (a, b) => [p[0] + t[0] * a + nl[0] * b, p[1] + t[1] * a + nl[1] * b]
      const line = []
      const a0 = -(step - R) + rp * 0.75
      if (o.tail !== false && i > 0 && a0 < -0.3) for (let a = a0; a < 0; a += 0.4) line.push(Lp(a, -hs * R))
      if (o.form === 'S' && i > 0 && a0 < -0.3) {
        // the S: the tail leaves the previous unit with a counter-curl, so neighbours interlock
        const rc = rp * 0.95, cc = [a0, -hs * (R - rc)]
        const hook = []
        for (let ph = Math.PI * 0.75; ph >= 0; ph -= 0.3 / rc) hook.push(Lp(cc[0] - rc * Math.sin(ph), cc[1] - hs * rc * Math.cos(ph)))
        line.unshift(...hook)
      }
      const k = Math.ceil((turnsI * TAU * R) / 0.3)
      for (let j = 0; j <= k; j++) {
        const ph = (turnsI * TAU * j) / k
        const r = R - (rp * ph) / TAU, th = -hs * Math.PI / 2 + hs * ph
        line.push(Lp(r * Math.cos(th), r * Math.sin(th)))
      }
      this._push(line, P)
      out.push(line)
    }
    return out
  }

  /** Write everything collected so far into the panel: one groove sink, one raise/add per ridge width, slit sinks. */
  flush() {
    const t0 = performance.now()
    const panel = this.panel, lines = this.lines
    const stroke = (ctx, l) => { ctx.beginPath(); l.pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke() }
    const pls = this.plateaus
    if (pls.length) {
      // the channel round every figure (one sink), then the plateaus (one raise per height/shoulder)
      const chW = Math.max(...pls.map((q) => q.channel)), chD = Math.max(...pls.map((q) => q.channelDepth))
      if (chD > 0 && chW > 0) panel.sink((ctx) => {
        ctx.lineJoin = 'round'
        for (const q of pls) { ctx.lineCap = q.cap; ctx.lineWidth = q.width + 2 * q.channel; stroke(ctx, q) }
        ctx.globalCompositeOperation = 'destination-out'
        for (const q of pls) { ctx.lineCap = q.cap; ctx.lineWidth = q.width; stroke(ctx, q) }
        ctx.globalCompositeOperation = 'source-over'
      }, { depth: chD, shoulder: chW / 2, profile: 'u' })
      const pg = new Map()
      for (const q of pls) { const k = `${q.height}|${q.shoulder}`; if (!pg.has(k)) pg.set(k, []); pg.get(k).push(q) }
      for (const g of pg.values()) {
        panel.raise((ctx) => { ctx.lineJoin = 'round'; for (const q of g) { ctx.lineCap = q.cap; ctx.lineWidth = q.width; stroke(ctx, q) } }, { height: g[0].height, shoulder: g[0].shoulder, profile: 'plateau' })
      }
    }
    const grooved = lines.filter((l) => l.groove > 0)
    if (grooved.length) {
      let depth = 0, sh = Infinity
      for (const l of grooved) { depth = Math.max(depth, l.groove); sh = Math.min(sh, (l.pitch - l.width) / 2) }
      panel.sink((ctx) => {
        ctx.lineCap = 'round'; ctx.lineJoin = 'round'
        for (const l of grooved) { ctx.lineWidth = l.width + 2 * (l.pitch - l.width); stroke(ctx, l) }
        ctx.globalCompositeOperation = 'destination-out'
        for (const l of lines) { ctx.lineWidth = l.width; stroke(ctx, l) }
        ctx.globalCompositeOperation = 'source-over'
      }, { depth, shoulder: Math.max(0.05, sh), profile: 'u' })
    }
    const groups = new Map()
    for (const l of lines) {
      const key = `${l.width}|${l.height}|${l.mode}|${l.crown}`
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(l)
    }
    for (const g of groups.values()) {
      const { width, height, mode, fn } = g[0]
      const draw = (ctx) => { ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = width; for (const l of g) stroke(ctx, l) }
      if (mode === 'add') panel.add(draw, { height, shoulder: width / 2, profile: fn })
      else panel.raise(draw, { height, shoulder: width / 2, profile: fn })
    }
    for (const b of this.bosses) {
      const cr = b.crown
      panel.raise((ctx) => { ctx.beginPath(); b.pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fill() },
        { height: b.height, shoulder: b.shoulder, profile: (s, w) => { if (s <= 0) return 0; const u = 1 - Math.min(s / w, 1); return cr * Math.sqrt(1 - u * u) + (1 - cr) * (1 - u * u * u * u) } })
    }
    if (this.slits.length) {
      const sl = this.slits
      panel.sink((ctx) => {
        ctx.lineCap = 'round'
        for (const s of sl) { ctx.lineWidth = s.width; ctx.beginPath(); ctx.moveTo(...s.pts[0]); ctx.lineTo(...s.pts[1]); ctx.stroke() }
      }, { depth: Math.max(...sl.map((s) => s.depth)), shoulder: Math.min(...sl.map((s) => s.width)) / 2, profile: 'u' })
    }
    const res = { lines: lines.length, slits: this.slits.length, ms: performance.now() - t0 }
    this.stats.lines += lines.length
    this.stats.ms += res.ms
    lines.length = 0
    this.slits.length = 0
    this.bosses.length = 0
    this.plateaus.length = 0
    return res
  }
}

function pickProfile(o) {
  const r = {}
  for (const k of Object.keys(RIDGE_DEFAULTS)) if (o[k] != null) r[k] = o[k]
  return r
}

/** new RidgeWork(panel, opts) */
export const ridgeWork = (panel, opts) => new RidgeWork(panel, opts)

// one-shot forms: target = a RidgeWork (collects) or a ReliefPanel (draws and flushes at once)
const once = (method) => (target, geom, o = {}) => {
  if (target instanceof RidgeWork) return target[method](geom, o)
  const w = new RidgeWork(target, o)
  const r = w[method](geom, o)
  w.flush()
  return r
}
export const quadSpiral = once('quadSpiral')
export const ridgeBand = once('ridgeBand')
export const ridgeBorder = once('ridgeBorder')
export const ridgeLine = once('line')
export const hookEye = once('hookEye')
export const scrollChain = once('scrollChain')
export const slitEye = once('slitEye')

/**
 * Fill what the figures leave free inside a region with small squared spirals of the SAME ridge (pitch, width,
 * height) — the leiwen packer in thread mode, so the leftovers between figures read as more ridge work, not as
 * plain ground. Call AFTER flush() (it avoids raised pixels). region as leiwenFill ({ rect, include, avoid,
 * margin }); opts → leiwen opts (cell: [min, max] mm, default [4, 9] × pitch / 1.4 …).
 */
export function ridgeGround(panel, region = {}, opts = {}) {
  const P = ridgeProfile(opts)
  const k = P.pitch / 1.4
  return leiwenFill(panel, { margin: P.pitch - P.width, ...region }, {
    pitch: P.pitch, line: P.width / P.pitch, mode: 'thread', depth: P.height, roundness: 0.35, jitter: 0.03,
    cell: [4 * k, 9 * k], pairs: 0.3, maxAspect: 1.8, fillers: true, ...opts.leiwen, seed: opts.seed ?? 0,
  })
}

// ------------------------------------------------------------------ blade warp

/**
 * Map an upright design rectangle into a tapering blade (and back). The design rect is x ∈ design (default = top),
 * y from the bottom y1 to the top y0; the blade's half width runs from the top's to the bottom's (or 0 at a `tip`
 * [x, y]) as f^power (f = 0 at the bottom, 1 at the top; power < 1 = an ogive, fuller low down), its axis straight from
 * the top centre to the tip / bottom centre (a tip off the top centre leans the blade).
 * → T(p) (design → blade) with T.inverse, T.hw(y), T.cx(y), T.scale(y), T.edgeX(side, inset, y),
 *   T.edge(side, inset, ya, yb, step) (BLADE-space points `inset` mm in from the side's edge, measured square to the
 *   edge; points closer to the axis than `min` (0.4 mm) are dropped) and T.outline(step) (closed blade polygon).
 */
export function bladeWarp({ top = [-50, 50], tip, bottom, y0 = 100, y1 = 0, power = 1, design } = {}) {
  const cT = (top[0] + top[1]) / 2, hT = (top[1] - top[0]) / 2
  const yB = tip ? tip[1] : y1
  const cB = tip ? tip[0] : bottom ? (bottom[0] + bottom[1]) / 2 : cT
  const hB = tip ? 0 : bottom ? (bottom[1] - bottom[0]) / 2 : hT
  const D = design ?? top, cD = (D[0] + D[1]) / 2, hD = (D[1] - D[0]) / 2
  const f = (y) => Math.min(1, Math.max(0, (y - yB) / (y0 - yB)))
  const hw = (y) => hB + (hT - hB) * Math.pow(f(y), power)
  const cx = (y) => cB + (cT - cB) * f(y)
  const T = (p) => [cx(p[1]) + ((p[0] - cD) * hw(p[1])) / hD, p[1]]
  T.inverse = (p) => [cD + ((p[0] - cx(p[1])) * hD) / Math.max(hw(p[1]), 1e-3), p[1]]
  T.hw = hw
  T.cx = cx
  T.scale = (y) => hw(y) / hD
  T.y0 = y0
  T.y1 = yB
  T.edgeX = (side, inset, y) => {
    const e = 0.25, slope = (cx(y + e) - cx(y - e) + side * (hw(y + e) - hw(y - e))) / (2 * e)
    return cx(y) + side * (hw(y) - inset * Math.hypot(1, slope))
  }
  T.edge = (side, inset, ya, yb, step = 2, min = 0.4) => {
    const n = Math.max(1, Math.ceil(Math.abs(yb - ya) / step)), out = []
    for (let i = 0; i <= n; i++) {
      const y = ya + ((yb - ya) * i) / n, x = T.edgeX(side, inset, y)
      if (side * (x - cx(y)) >= min) out.push([x, y])
    }
    return out
  }
  T.outline = (step = 2) => [...T.edge(-1, 0, y0, yB, step, -1), ...T.edge(1, 0, yB, y0, step, -1)]
  return T
}
