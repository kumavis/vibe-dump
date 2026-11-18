// Profile of revolution — the turning template of a round Shang vessel.
//
// A round vessel's clay model was turned against a template, so a list of
// (radius, height) points really is how such a vessel was specified
// (research/03 §1 tables). A Profile is the OUTER surface, bottom → top, in mm,
// y = 0 on the ground. It is evaluated by ARC LENGTH s, so décor addressed by
// register keeps its proportions over a bulging belly or a flaring trumpet.
//
//   join 'corner' (research 'C'): a carination / step — the curve breaks there,
//        the normal splits, and it is usually a register boundary and a
//        horizontal mould joint.
//   join 'smooth' ('S', default) and 'lip' ('L'): centripetal Catmull-Rom
//        through the point (no overshoot at tight shoulders).
//
// Bowstrings (弦纹) are real profile features: `ridges` displaces the dense
// outline along its normal, so they show in silhouette and cast shadow.
//
// A measured silhouette table [[r_mm, y_mm], …] (dense, noisy) is consumed by
// profileFromTable(): resampled, Gaussian-smoothed between auto-detected
// corners, never splined through every wobble.

const JOIN = { C: 'corner', c: 'corner', corner: 'corner', L: 'lip', l: 'lip', lip: 'lip', S: 'smooth', s: 'smooth', smooth: 'smooth' }

function normPoint(p) {
  if (Array.isArray(p)) return { r: +p[0], y: +p[1], join: JOIN[p[2]] || 'smooth', name: p[3] ?? (typeof p[2] === 'string' && !JOIN[p[2]] ? p[2] : null) }
  return { r: +p.r, y: +p.y, join: JOIN[p.join] || (p.corner ? 'corner' : 'smooth'), name: p.name ?? null }
}

/** centripetal Catmull-Rom between p1 and p2 (Barry–Goldman), n steps, appends excluding p1 */
function crSpan(p0, p1, p2, p3, n, out) {
  const d = (a, b) => Math.max(1e-6, Math.pow(Math.hypot(b[0] - a[0], b[1] - a[1]), 0.5))
  const t0 = 0, t1 = t0 + d(p0, p1), t2 = t1 + d(p1, p2), t3 = t2 + d(p2, p3)
  for (let k = 1; k <= n; k++) {
    const t = t1 + ((t2 - t1) * k) / n
    const q = [0, 0]
    for (let c = 0; c < 2; c++) {
      const A1 = ((t1 - t) / (t1 - t0)) * p0[c] + ((t - t0) / (t1 - t0)) * p1[c]
      const A2 = ((t2 - t) / (t2 - t1)) * p1[c] + ((t - t1) / (t2 - t1)) * p2[c]
      const A3 = ((t3 - t) / (t3 - t2)) * p2[c] + ((t - t2) / (t3 - t2)) * p3[c]
      const B1 = ((t2 - t) / (t2 - t0)) * A1 + ((t - t0) / (t2 - t0)) * A2
      const B2 = ((t3 - t) / (t3 - t1)) * A2 + ((t - t1) / (t3 - t1)) * A3
      q[c] = ((t2 - t) / (t2 - t1)) * B1 + ((t - t1) / (t2 - t1)) * B2
    }
    out.push(q)
  }
}

function smoothstep(a, b, x) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** Ridge cross-section 0..1 at signed distance d from its centre line, half-width hw. */
function ridgeShape(shape, d, hw) {
  const a = Math.abs(d) / hw
  if (a >= 1) return 0
  if (shape === 'flat') return smoothstep(1, 0.6, a)
  if (shape === 'v') return 1 - a
  if (shape === 'step') return 1
  return Math.sqrt(1 - a * a) // 'round': half-round bead, crisp at its foot
}

export class Profile {
  /**
   * @param {Array<[number,number]|[number,number,string]|[number,number,string,string]|{r,y,join?,name?}>} points
   *        bottom → top on the OUTER surface, mm. A 4th element (or `name`) labels the point for registers.
   * @param {object} [o]
   * @param {Object<string, [number,number]|{y0,y1}|{s0,s1}|{from,to}>} [o.registers] named y-ranges (mm), arc ranges, or point labels
   * @param {Array<{y?:number,s?:number,count?:number,width?:number,height?:number,spacing?:number,shape?:'round'|'flat'|'v'|'step'}>} [o.ridges]
   * @param {number} [o.step]  dense sampling step, mm (default 0.15)
   * @param {'spline'|'polyline'} [o.mode]  polyline = straight between points (measured tables)
   * @param {number} [o.smooth]  polyline mode: Gaussian sigma (mm) applied between corners
   */
  constructor(points, { registers = {}, ridges = [], step = 0.15, mode = 'spline', smooth = 0 } = {}) {
    this.isProfile = true
    this.source = points.map(normPoint)
    if (this.source.length < 2) throw new Error('Profile: need at least two points')
    this.step = step
    this.mode = mode
    this._build(mode, smooth)
    this.labels = {}
    this.source.forEach((p, i) => { if (p.name) this.labels[p.name] = this._srcS[i] })
    this.ridges = []
    this.registers = {}
    for (const rd of ridges) this.addRidges(rd)
    for (const [name, spec] of Object.entries(registers)) this.setRegister(name, spec)
  }

  // ------------------------------------------------------------- construction
  _build(mode, smooth) {
    const src = this.source
    const runs = []
    let cur = [0]
    for (let i = 1; i < src.length; i++) {
      cur.push(i)
      if (src[i].join === 'corner' && i < src.length - 1) {
        runs.push(cur)
        cur = [i]
      }
    }
    runs.push(cur)
    const pts = []
    const cornerIdx = new Set()
    const srcIdx = new Array(src.length).fill(0)
    for (const run of runs) {
      const P = run.map((i) => [src[i].r, src[i].y])
      if (!pts.length) { pts.push(P[0]); srcIdx[run[0]] = 0 }
      else cornerIdx.add(pts.length - 1)
      for (let k = 0; k < P.length - 1; k++) {
        const a = P[k], b = P[k + 1]
        const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / this.step))
        if (mode === 'polyline' || P.length < 3) {
          for (let q = 1; q <= n; q++) pts.push([a[0] + ((b[0] - a[0]) * q) / n, a[1] + ((b[1] - a[1]) * q) / n])
        } else {
          const p0 = k > 0 ? P[k - 1] : [2 * a[0] - b[0], 2 * a[1] - b[1]]
          const p3 = k + 2 < P.length ? P[k + 2] : [2 * b[0] - a[0], 2 * b[1] - a[1]]
          crSpan(p0, a, b, p3, n, pts)
        }
        srcIdx[run[k + 1]] = pts.length - 1
      }
    }
    if (mode === 'polyline' && smooth > 0) gaussianSmooth(pts, cornerIdx, smooth, this.step)
    this._pts = pts
    this._corners = cornerIdx
    this._srcIdx = srcIdx
    this._finish()
    this._srcS = srcIdx.map((i) => this.S[i])
  }

  _finish() {
    const pts = this._pts
    const n = pts.length
    const S = new Float64Array(n)
    for (let i = 1; i < n; i++) S[i] = S[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
    this.S = S
    this.length = S[n - 1]
    // per-segment unit tangents, then vertex normals (averaged, one-sided at corners)
    const T = []
    for (let i = 0; i < n - 1; i++) {
      const dr = pts[i + 1][0] - pts[i][0], dy = pts[i + 1][1] - pts[i][1]
      const l = Math.hypot(dr, dy) || 1
      T.push([dr / l, dy / l])
    }
    this._T = T
    this.cornerS = [...this._corners].sort((a, b) => a - b).map((i) => S[i])
    let yMin = Infinity, yMax = -Infinity, rMax = 0
    for (const p of pts) { yMin = Math.min(yMin, p[1]); yMax = Math.max(yMax, p[1]); rMax = Math.max(rMax, p[0]) }
    this.bounds = { yMin, yMax, rMax, height: yMax - yMin }
  }

  // ------------------------------------------------------------- evaluation
  _seg(s) {
    const S = this.S
    if (s <= 0) return 0
    if (s >= this.length) return S.length - 2
    let lo = 0, hi = S.length - 1
    while (hi - lo > 1) {
      const m = (lo + hi) >> 1
      if (S[m] <= s) lo = m
      else hi = m
    }
    return lo
  }

  _vtan(i, side) {
    // tangent at dense vertex i; at a corner (or the ends) the one-sided tangent
    const T = this._T
    if (i <= 0) return T[0]
    if (i >= T.length) return T[T.length - 1]
    if (this._corners.has(i)) return side < 0 ? T[i - 1] : T[i]
    const a = T[i - 1], b = T[i]
    const x = a[0] + b[0], y = a[1] + b[1]
    const l = Math.hypot(x, y) || 1
    return [x / l, y / l]
  }

  /**
   * Point at arc length s (mm from the bottom).
   * side: at a corner exactly, -1 = the run below, +1 = the run above (default +1, or -1 at the top end).
   * @returns {{ s, r, y, nr, ny, tr, ty }} outward normal (nr, ny), upward tangent (tr, ty)
   */
  at(s, side = 0) {
    s = Math.min(Math.max(s, 0), this.length)
    const i = this._seg(s)
    const S = this.S
    const a = this._pts[i], b = this._pts[i + 1]
    const f = S[i + 1] > S[i] ? (s - S[i]) / (S[i + 1] - S[i]) : 0
    const sd = side || (s >= this.length ? -1 : 1)
    // exactly on a corner vertex: honour the side
    let ta, tb
    if (f <= 1e-9 && this._corners.has(i)) ta = tb = this._vtan(i, sd)
    else if (f >= 1 - 1e-9 && this._corners.has(i + 1)) ta = tb = this._vtan(i + 1, sd)
    else { ta = this._vtan(i, 1); tb = this._vtan(i + 1, -1) }
    let tr = ta[0] + (tb[0] - ta[0]) * f, ty = ta[1] + (tb[1] - ta[1]) * f
    const l = Math.hypot(tr, ty) || 1
    tr /= l; ty /= l
    return { s, r: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f, nr: ty, ny: -tr, tr, ty }
  }

  /** legacy: t ∈ [0,1] of the length */
  atT(t, side) { return this.at(t * this.length, side) }

  /** First arc length (from the bottom, or from the top) where the outline crosses height y. */
  sAtY(y, { from = 'bottom' } = {}) {
    const P = this._pts
    const n = P.length
    const range = from === 'top' ? [...Array(n - 1).keys()].reverse() : [...Array(n - 1).keys()]
    for (const i of range) {
      const y0 = P[i][1], y1 = P[i + 1][1]
      if ((y0 - y) * (y1 - y) <= 0 && y0 !== y1) {
        const f = (y - y0) / (y1 - y0)
        return this.S[i] + f * (this.S[i + 1] - this.S[i])
      }
    }
    return y <= this.bounds.yMin ? 0 : this.length
  }

  rAtY(y, opts) { return this.at(this.sAtY(y, opts)).r }

  /** Arc length of a labelled source point, a y (number), or {s}. */
  resolveS(x, fallbackFrom) {
    if (x == null) return null
    if (typeof x === 'string') {
      if (!(x in this.labels)) throw new Error(`Profile: no point labelled '${x}'`)
      return this.labels[x]
    }
    if (typeof x === 'object' && 's' in x) return x.s
    return this.sAtY(+x, { from: fallbackFrom })
  }

  /**
   * Name a register: [y0, y1] | {y0, y1} | {s0, s1} | {from: label|y, to: label|y}.
   * Registers are arc ranges; y0/y1 are recorded too.
   */
  setRegister(name, spec) {
    let s0, s1
    if (Array.isArray(spec)) { s0 = this.resolveS(spec[0]); s1 = this.resolveS(spec[1], 'top') }
    else if ('s0' in spec) { s0 = spec.s0; s1 = spec.s1 }
    else if ('y0' in spec) { s0 = this.sAtY(spec.y0); s1 = this.sAtY(spec.y1, { from: 'top' }) }
    else { s0 = this.resolveS(spec.from); s1 = this.resolveS(spec.to, 'top') }
    if (s1 < s0) [s0, s1] = [s1, s0]
    const reg = { name, s0, s1, length: s1 - s0, y0: this.at(s0).y, y1: this.at(s1).y }
    this.registers[name] = reg
    return reg
  }

  register(name) {
    const r = this.registers[name]
    if (!r) throw new Error(`Profile: no register '${name}'`)
    return r
  }

  /**
   * Bowstrings (弦纹) as true geometry: `count` beads of `width` × `height` mm,
   * centre-to-centre `spacing`, centred at height y (or arc s). Displaces the outline outward.
   */
  addRidges({ y, s, count = 1, width = 1.6, height = 1, spacing, shape = 'round' }) {
    const sc = s ?? this.sAtY(y)
    const sp = spacing ?? width * 2.1
    const hw = width / 2
    const centres = []
    for (let k = 0; k < count; k++) centres.push(sc + (k - (count - 1) / 2) * sp)
    // refine the dense outline around the ridges first so the beads are resolved
    const s0 = centres[0] - hw - 0.5, s1 = centres[centres.length - 1] + hw + 0.5
    this._refine(s0, s1, Math.min(this.step, width / 12))
    const P = this._pts
    const disp = P.map((_, i) => {
      const si = this.S[i]
      let h = 0
      for (const c of centres) h = Math.max(h, ridgeShape(shape, si - c, hw) * height)
      return h
    })
    const N = P.map((_, i) => {
      const t = this._vtan(i, 1)
      return [t[1], -t[0]]
    })
    for (let i = 0; i < P.length; i++) if (disp[i]) { P[i] = [P[i][0] + N[i][0] * disp[i], P[i][1] + N[i][1] * disp[i]] }
    const Sold = this.S
    this._finish()
    // the beads lengthen the outline locally: carry every stored arc length across
    const Snew = this.S
    const k = (v) => {
      let lo = 0, hi = Sold.length - 1
      if (v <= 0) return 0
      if (v >= Sold[hi]) return Snew[hi] + (v - Sold[hi])
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (Sold[m] <= v) lo = m; else hi = m }
      const f = Sold[hi] > Sold[lo] ? (v - Sold[lo]) / (Sold[hi] - Sold[lo]) : 0
      return Snew[lo] + f * (Snew[hi] - Snew[lo])
    }
    for (const key of Object.keys(this.labels)) this.labels[key] = k(this.labels[key])
    this._srcS = this._srcS.map(k)
    for (const r of Object.values(this.registers)) { r.s0 = k(r.s0); r.s1 = k(r.s1); r.length = r.s1 - r.s0 }
    for (const r of this.ridges) { r.s0 = k(r.s0); r.s1 = k(r.s1); r.centres = r.centres.map(k) }
    this.ridges.push({ s0: k(s0), s1: k(s1), centres: centres.map(k), width, height, shape, count })
    return this
  }

  _refine(s0, s1, step) {
    const P = this._pts, S = this.S
    const out = [], corners = new Set()
    for (let i = 0; i < P.length; i++) {
      if (this._corners.has(i)) corners.add(out.length)
      out.push(P[i])
      if (i < P.length - 1 && S[i + 1] > s0 && S[i] < s1) {
        const n = Math.ceil((S[i + 1] - S[i]) / step)
        for (let q = 1; q < n; q++) out.push([P[i][0] + ((P[i + 1][0] - P[i][0]) * q) / n, P[i][1] + ((P[i + 1][1] - P[i][1]) * q) / n])
      }
    }
    this._pts = out
    this._corners = corners
    this._finish()
  }

  /** Places where the surface must break or be finely sampled: corners and ridge zones (arc lengths). */
  breaks() {
    const b = new Set(this.cornerS)
    for (const r of this.ridges) { b.add(r.s0); b.add(r.s1) }
    return [...b].filter((s) => s > 1e-6 && s < this.length - 1e-6).sort((a, b) => a - b)
  }

  /**
   * Adaptive arc-length samples on [s0, s1] for a mesh: no more than `maxAngle`
   * (rad) of turning nor `maxLen` mm between rows. Always includes both ends.
   */
  samples(s0, s1, { maxAngle = 0.06, maxLen = 6, minRows = 1 } = {}) {
    const out = [s0]
    const S = this.S
    let i = this._seg(s0) + 1
    let last = s0
    let lastT = this.at(s0, 1)
    for (let guard = 0; guard < 1e6; guard++) {
      const next = i < S.length ? Math.min(S[i], s1) : s1
      if (next - last > maxLen) {
        last += maxLen
        if (s1 - last < maxLen * 0.25) break
        out.push(last)
        lastT = this.at(last, 1)
        continue
      }
      if (next >= s1 - 1e-6) break
      const t = this._vtan(i, -1)
      const ang = Math.acos(Math.min(1, Math.max(-1, t[0] * lastT.tr + t[1] * lastT.ty)))
      if (ang > maxAngle && S[i] - last > 0.02) {
        out.push(S[i])
        last = S[i]
        lastT = this.at(S[i], 1)
      }
      i++
    }
    out.push(s1)
    // enforce minRows by uniform subdivision
    if (out.length - 1 < minRows) {
      const res = []
      for (let k = 0; k <= minRows; k++) res.push(s0 + ((s1 - s0) * k) / minRows)
      return res
    }
    return out
  }

  /**
   * The core surface: a smoothed copy of the outline offset INWARD by d (mm or (s) => mm).
   * Returns a dense polyline [[r, y], …] bottom → top (points whose r < 0 are clamped to the axis).
   */
  offset(d, { smooth = 3 } = {}) {
    const P = this._pts.map((p) => p.slice())
    if (smooth > 0) gaussianSmooth(P, new Set(), smooth, this.step)
    const out = []
    const n = P.length
    for (let i = 0; i < n; i++) {
      const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)]
      const dr = b[0] - a[0], dy = b[1] - a[1]
      const l = Math.hypot(dr, dy) || 1
      const t = typeof d === 'function' ? d(this.S[i], P[i][1]) : d
      out.push([Math.max(0, P[i][0] - (dy / l) * t), P[i][1] + (dr / l) * t, this.S[i]])
    }
    // drop loops: points that move backwards along the original direction
    const clean = [out[0]]
    for (let i = 1; i < n; i++) {
      const p = clean[clean.length - 1]
      const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)]
      if ((out[i][0] - p[0]) * (b[0] - a[0]) + (out[i][1] - p[1]) * (b[1] - a[1]) > 1e-9) clean.push(out[i])
    }
    return clean
  }

  /** Copy scaled by k (both axes), optionally with ridges/registers re-applied. */
  scaled(k) {
    return new Profile(this.source.map((p) => ({ ...p, r: p.r * k, y: p.y * k })), {
      step: this.step,
      mode: this.mode,
      ridges: this.ridges.map((r) => ({ s: r.centres.reduce((a, b) => a + b, 0) / r.centres.length * k, count: r.count, width: r.width * k, height: r.height * k, spacing: r.centres.length > 1 ? (r.centres[1] - r.centres[0]) * k : undefined, shape: r.shape })),
      registers: Object.fromEntries(Object.entries(this.registers).map(([n, r]) => [n, { s0: r.s0 * k, s1: r.s1 * k }])),
    })
  }

  /** Dense outline [[r, y], …] (for silhouettes, debugging, metrics). */
  get points() { return this._pts }
}

function gaussianSmooth(P, corners, sigma, step) {
  // smooth each run between corners separately; run ends fixed
  const idx = [0, ...[...corners].sort((a, b) => a - b), P.length - 1]
  const w = Math.max(1, Math.round((sigma * 2.5) / step))
  const ker = []
  for (let k = -w; k <= w; k++) ker.push(Math.exp(-0.5 * ((k * step) / sigma) ** 2))
  for (let q = 0; q < idx.length - 1; q++) {
    const a = idx[q], b = idx[q + 1]
    const src = P.slice(a, b + 1).map((p) => p.slice())
    for (let i = a + 1; i < b; i++) {
      let sr = 0, sy = 0, sw = 0
      for (let k = -w; k <= w; k++) {
        const j = i + k
        if (j < a || j > b) continue
        const wt = ker[k + w]
        sr += src[j - a][0] * wt; sy += src[j - a][1] * wt; sw += wt
      }
      P[i] = [sr / sw, sy / sw]
    }
  }
}

/** Shorthand: profile(points, opts) ≡ new Profile(points, opts); a Profile passes through. */
export function profile(points, opts) {
  return points?.isProfile ? points : new Profile(points, opts)
}

/**
 * A measured silhouette (the dossier's [[r_mm, y_mm], …], any density, either
 * direction) → Profile. Corners are detected where the outline turns by more than
 * `cornerAngle` degrees within ±`window` mm; the rest is resampled and smoothed.
 * @param {Array<[number,number]>} table
 * @param {object} [o]
 * @param {number} [o.scale]        multiply both coordinates (e.g. normalised H=1 tables → mm)
 * @param {number} [o.height]       rescale so the profile is this tall (mm)
 * @param {number[]|'auto'} [o.corners]  indices into `table` that are carinations, or auto-detect
 * @param {number} [o.cornerAngle]  deg (default 32)
 * @param {number} [o.window]       mm (default 2.5)
 * @param {number} [o.smooth]       Gaussian sigma mm (default 0.8; 0 = raw)
 * @param {boolean} [o.ground]      shift so the lowest point sits on y = 0 (default true)
 * @param {boolean} [o.flipY]       the table's y runs DOWN (image coordinates)
 */
export function profileFromTable(table, { scale = 1, height, corners = 'auto', cornerAngle = 32, window = 2.5, smooth = 0.8, ground = true, flipY = false, ...opts } = {}) {
  let P = table.map((p) => [Math.abs(+p[0]) * scale, (flipY ? -1 : 1) * +p[1] * scale])
  if (P[0][1] > P[P.length - 1][1]) P.reverse()
  if (ground) {
    const y0 = Math.min(...P.map((p) => p[1]))
    P = P.map((p) => [p[0], p[1] - y0])
  }
  if (height) {
    const h = Math.max(...P.map((p) => p[1])) - Math.min(...P.map((p) => p[1]))
    const k = height / h
    P = P.map((p) => [p[0] * k, p[1] * k])
  }
  // drop duplicates
  P = P.filter((p, i) => i === 0 || Math.hypot(p[0] - P[i - 1][0], p[1] - P[i - 1][1]) > 1e-6)
  let C = new Set()
  if (Array.isArray(corners)) C = new Set(corners)
  else if (corners === 'auto') {
    const cum = [0]
    for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]))
    // turning angle between the incoming and outgoing directions, each over `window` mm
    const turn = P.map((_, i) => {
      if (i === 0 || i === P.length - 1) return 0
      const vin = vecBack(P, cum, i, window), vout = vecFwd(P, cum, i, window)
      return Math.acos(Math.max(-1, Math.min(1, vin[0] * vout[0] + vin[1] * vout[1]))) * (180 / Math.PI)
    })
    // local maxima above threshold
    for (let i = 1; i < P.length - 1; i++) {
      if (turn[i] < cornerAngle) continue
      let isMax = true
      for (let j = i - 1; j >= 0 && cum[i] - cum[j] <= window; j--) if (turn[j] > turn[i]) isMax = false
      for (let j = i + 1; j < P.length && cum[j] - cum[i] <= window; j++) if (turn[j] >= turn[i]) isMax = false
      if (isMax) C.add(i)
    }
  }
  const pts = P.map((p, i) => [p[0], p[1], C.has(i) ? 'corner' : 'smooth'])
  const step = opts.step ?? 0.15
  return new Profile(pts, { mode: 'polyline', smooth, step, ...opts })
}

function vecBack(P, cum, i, w) {
  let j = i - 1
  while (j > 0 && cum[i] - cum[j] < w) j--
  const x = P[i][0] - P[j][0], y = P[i][1] - P[j][1]
  const l = Math.hypot(x, y) || 1
  return [x / l, y / l]
}
function vecFwd(P, cum, i, w) {
  let j = i + 1
  while (j < P.length - 1 && cum[j] - cum[i] < w) j++
  const x = P[j][0] - P[i][0], y = P[j][1] - P[i][1]
  const l = Math.hypot(x, y) || 1
  return [x / l, y / l]
}
