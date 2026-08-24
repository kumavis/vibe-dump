// Nonlinear region compression — the em stops being a uniform grid.
//
// Every axis warp here is a SEPARABLE monotone remap, x' = fx(x) and y' = fy(y) over
// the glyph's *current* bbox (so it composes after layout surgery). Each axis map
// is the normalised integral of a strictly positive density d(u): a band with high
// density is handed more space, its neighbours less. The integral of something
// positive is strictly increasing, so no parameter value can fold the glyph over
// itself — the worst a wild setting does is squeeze a band very thin.
import { clamp } from '../../geom/path.js'
import { flatCurve, monotoneRemap } from '../curve.js'
import { recomputeBounds, recomputeLengths } from '../skeleton.js'

const PROF = 128 // density-profile resolution, independent of the ink histogram
const MAX_BANDS = 48
const TILT_GAIN = 1.2 // log-density swing from the centre to either end (2× end to end)
const BUMP_GAIN = 2.0
const QUAD_GAIN = 1.5
const INK_FLOOR = 0.06 // an empty band still keeps this share of the average width
const LOG_TERM = 2.0 // ceilings keep exp() tame however the terms stack up
const LOG_TOTAL = 3.0
const BLUR_SPAN = 0.35 // widest blur, as a fraction of the axis, at wpSmooth = 1

export const params = [
  {
    id: 'wpTopBottom',
    label: 'Top / bottom',
    group: 'Region warp',
    type: 'range',
    min: -1,
    max: 1,
    step: 0.01,
    default: 0,
    bipolar: true,
    hint: 'Hand more of the em to the top half (negative) or the bottom half (positive).',
  },
  {
    id: 'wpLeftRight',
    label: 'Left / right',
    group: 'Region warp',
    type: 'range',
    min: -1,
    max: 1,
    step: 0.01,
    default: 0,
    bipolar: true,
    hint: 'Hand more of the em to the left half (negative) or the right half (positive).',
  },
  {
    id: 'wpCenterEdge',
    label: 'Centre / edge',
    group: 'Region warp',
    type: 'range',
    min: -1,
    max: 1,
    step: 0.01,
    default: 0,
    bipolar: true,
    hint: 'Let the middle of the glyph breathe (positive) or push the space out to the edges (negative).',
  },
  {
    id: 'wpEqualize',
    label: 'Equalise density',
    group: 'Density equalise',
    type: 'range',
    min: -1,
    max: 1,
    step: 0.01,
    default: 0,
    bipolar: true,
    hint: 'At +1 crowded bands are given room and empty bands shrink until ink is spread evenly; at −1 the existing contrast is amplified instead.',
  },
  {
    id: 'wpEqualizeAxis',
    label: 'Equalise axis',
    group: 'Density equalise',
    type: 'select',
    default: 'both',
    options: [
      { value: 'both', label: 'Both' },
      { value: 'x', label: 'Horizontal' },
      { value: 'y', label: 'Vertical' },
    ],
    when: (P) => P.wpEqualize !== 0,
    hint: 'Which axis the ink-density measurement drives.',
  },
  {
    id: 'wpBands',
    label: 'Density bands',
    group: 'Density equalise',
    type: 'range',
    min: 8,
    max: MAX_BANDS,
    step: 1,
    default: 16,
    when: (P) => P.wpEqualize !== 0,
    hint: 'Resolution of the ink histogram — few bands read the coarse layout, many chase individual strokes.',
  },
  {
    id: 'wpSmooth',
    label: 'Histogram blur',
    group: 'Density equalise',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0.15,
    when: (P) => P.wpEqualize !== 0,
    hint: 'Blur the measured density before using it; higher values respond to whole regions rather than single strokes.',
  },
  {
    id: 'wpCurveX',
    label: 'Density profile X',
    group: 'Region warp',
    type: 'curve',
    default: flatCurve(0.5),
    hint: 'Hand-drawn density along x — raised sections of the curve get more room. Flat is neutral.',
  },
  {
    id: 'wpCurveY',
    label: 'Density profile Y',
    group: 'Region warp',
    type: 'curve',
    default: flatCurve(0.5),
    hint: 'Hand-drawn density along y — raised sections of the curve get more room. Flat is neutral.',
  },
  {
    id: 'wpQuadrant',
    label: 'Directional squeeze',
    group: 'Region warp',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    hint: 'Compress the glyph toward one side along a rotated axis, leaving the perpendicular direction untouched.',
  },
  {
    id: 'wpAngle',
    label: 'Squeeze angle',
    group: 'Region warp',
    type: 'range',
    min: 0,
    max: 360,
    step: 1,
    default: 0,
    unit: '°',
    when: (P) => P.wpQuadrant > 0,
    hint: 'Direction the squeeze pushes ink toward.',
  },
  {
    id: 'wpStrength',
    label: 'Warp amount',
    group: 'Region warp',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 1,
    hint: 'Master wet/dry for the whole warp module.',
  },
]

// Scratch reused across glyphs: this runs over a thousand cards per render pass
// and the profiles are consumed before apply() returns, so one set is enough.
const buf = {
  d: new Float64Array(PROF),
  dq: new Float64Array(PROF),
  cumQ: new Float64Array(PROF + 1),
  hx: new Float64Array(MAX_BANDS),
  hy: new Float64Array(MAX_BANDS),
  tmp: new Float64Array(MAX_BANDS),
  pre: new Float64Array(MAX_BANDS + 1),
  cumX: new Float64Array(PROF + 1),
  cumY: new Float64Array(PROF + 1),
}

const num = (v, lo, hi, dflt) => (typeof v === 'number' && Number.isFinite(v) ? clamp(v, lo, hi) : dflt)

/** A curve that is flat at any height is the identity, so skip it entirely. */
function curveRemap(c) {
  if (!Array.isArray(c) || c.length < 2) return null
  let lo = Infinity
  let hi = -Infinity
  for (const v of c) {
    if (!Number.isFinite(v)) return null
    if (v < lo) lo = v
    if (v > hi) hi = v
  }
  return hi - lo < 1e-6 ? null : monotoneRemap(c)
}

function liveBounds(skel) {
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (const s of skel.strokes) {
    if (!s.alive) continue
    const p = s.pts
    for (let i = 0; i < p.length; i += 2) {
      const x = p[i]
      const y = p[i + 1]
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue
      if (x < x0) x0 = x
      if (x > x1) x1 = x
      if (y < y0) y0 = y
      if (y > y1) y1 = y
    }
  }
  return x0 === Infinity ? null : { x0, y0, x1, y1 }
}

/** Bucket polyline arc length into `bands` along each axis — the glyph's own ink density. */
function inkHistogram(skel, bands, x0, invW, y0, invH, hx, hy) {
  hx.fill(0, 0, bands)
  hy.fill(0, 0, bands)
  const last = bands - 1
  for (const s of skel.strokes) {
    if (!s.alive) continue
    const p = s.pts
    for (let i = 2; i < p.length; i += 2) {
      const dx = p[i] - p[i - 2]
      const dy = p[i + 1] - p[i - 1]
      const L = Math.hypot(dx, dy)
      // A non-finite point upstream would otherwise put an Infinity in one band,
      // which makes the mean infinite and every log(ratio) a NaN — one bad point
      // would poison the whole profile and take the entire glyph with it. The
      // rest of the module skips non-finite points, so skip them here too.
      if (!(L > 0 && L < Infinity)) continue
      // segments are short (points are arc-spaced) so the midpoint band is exact enough
      let bx = (((p[i] + p[i - 2]) * 0.5 - x0) * invW * bands) | 0
      let by = (((p[i + 1] + p[i - 1]) * 0.5 - y0) * invH * bands) | 0
      if (bx < 0) bx = 0
      else if (bx > last) bx = last
      if (by < 0) by = 0
      else if (by > last) by = last
      hx[bx] += L
      hy[by] += L
    }
  }
}

const clampI = (i, n) => (i < 0 ? 0 : i > n - 1 ? n - 1 : i)

/** One box blur of fractional radius via prefix sums — O(n) whatever the radius. */
function boxPass(src, n, r, dst, pre) {
  pre[0] = 0
  for (let i = 0; i < n; i++) pre[i + 1] = pre[i] + src[i]
  const ri = Math.floor(r)
  const f = r - ri
  const denom = 2 * ri + 1 + 2 * f
  for (let i = 0; i < n; i++) {
    let lo = i - ri
    let hi = i + ri
    let sum = 0
    // replicate the end samples so the blur does not eat away at the extremes
    if (lo < 0) {
      sum += src[0] * -lo
      lo = 0
    }
    if (hi > n - 1) {
      sum += src[n - 1] * (hi - n + 1)
      hi = n - 1
    }
    sum += pre[hi + 1] - pre[lo]
    if (f > 0) sum += f * (src[clampI(i - ri - 1, n)] + src[clampI(i + ri + 1, n)])
    dst[i] = sum / denom
  }
}

function blurHist(h, n, amount, tmp, pre) {
  const r = amount * n * BLUR_SPAN
  if (!(r > 1e-3)) return
  boxPass(h, n, r, tmp, pre)
  boxPass(tmp, n, r, h, pre) // two box passes ≈ a Gaussian, still linear
}

/** Histogram sampled at u ∈ 0..1, linear between band centres. */
function histAt(h, bands, u) {
  const t = u * bands - 0.5
  if (t <= 0) return h[0]
  if (t >= bands - 1) return h[bands - 1]
  const i = t | 0
  return h[i] + (h[i + 1] - h[i]) * (t - i)
}

/**
 * Compose the density terms for one axis and integrate them into a CDF. Terms are
 * summed in log space, so they multiply — order never matters and d stays > 0.
 */
function buildCdf(cum, tilt, bump, eqAmt, hist, bands) {
  const d = buf.d
  let mean = 0
  if (eqAmt !== 0) {
    for (let k = 0; k < bands; k++) mean += hist[k]
    mean /= bands
  }
  const useInk = eqAmt !== 0 && mean > 1e-9 && mean < Infinity
  for (let k = 0; k < PROF; k++) {
    const u = (k + 0.5) / PROF
    const c = 2 * u - 1
    let e = tilt * TILT_GAIN * c + bump * BUMP_GAIN * (0.5 - c * c)
    if (useInk) {
      // space proportional to ink is exactly the condition for uniform density
      const ratio = (histAt(hist, bands, u) + INK_FLOOR * mean) / (mean * (1 + INK_FLOOR))
      e += eqAmt * clamp(Math.log(ratio), -LOG_TERM, LOG_TERM)
    }
    d[k] = Math.exp(clamp(e, -LOG_TOTAL, LOG_TOTAL))
  }
  return integrate(d, cum)
}

function integrate(d, cum) {
  let total = 0
  cum[0] = 0
  for (let k = 0; k < PROF; k++) {
    total += d[k]
    cum[k + 1] = total
  }
  const inv = 1 / Math.max(total, 1e-12)
  for (let k = 1; k < PROF; k++) cum[k] *= inv
  cum[PROF] = 1
  return cum
}

const evalCdf = (cum, u) => {
  const x = clamp(u, 0, 1) * PROF
  const i = x >= PROF ? PROF - 1 : x | 0
  return cum[i] + (cum[i + 1] - cum[i]) * (x - i)
}

/** CDF, then the user curve, each blended by the master wet/dry — monotone throughout. */
function remapAt(cum, curve, u0, s) {
  const u = clamp(u0, 0, 1)
  let t = u + s * (evalCdf(cum, u) - u)
  if (curve) t += s * (curve(t) - t)
  return t
}

export function apply(skel, P) {
  const s = num(P.wpStrength, 0, 1, 1)
  if (s <= 0) return
  const tb = num(P.wpTopBottom, -1, 1, 0)
  const lr = num(P.wpLeftRight, -1, 1, 0)
  const ce = num(P.wpCenterEdge, -1, 1, 0)
  const eq = num(P.wpEqualize, -1, 1, 0)
  const qd = num(P.wpQuadrant, 0, 1, 0)
  const axis = P.wpEqualizeAxis === 'x' || P.wpEqualizeAxis === 'y' ? P.wpEqualizeAxis : 'both'
  const cvX = curveRemap(P.wpCurveX)
  const cvY = curveRemap(P.wpCurveY)
  const eqX = eq !== 0 && axis !== 'y'
  const eqY = eq !== 0 && axis !== 'x'
  const wantX = lr !== 0 || ce !== 0 || eqX || cvX
  const wantY = tb !== 0 || ce !== 0 || eqY || cvY
  if (!wantX && !wantY && qd <= 0) return

  const b = liveBounds(skel)
  if (!b) return
  const bw = b.x1 - b.x0
  const bh = b.y1 - b.y0
  const doX = wantX && bw > 1e-6
  const doY = wantY && bh > 1e-6
  if (!doX && !doY && qd <= 0) return

  const invW = 1 / Math.max(bw, 1e-6)
  const invH = 1 / Math.max(bh, 1e-6)

  let cdfX = null
  let cdfY = null
  if (doX || doY) {
    const bands = Math.round(num(P.wpBands, 8, MAX_BANDS, 16))
    if ((doX && eqX) || (doY && eqY)) {
      inkHistogram(skel, bands, b.x0, invW, b.y0, invH, buf.hx, buf.hy)
      const smooth = num(P.wpSmooth, 0, 1, 0.15)
      if (doX && eqX) blurHist(buf.hx, bands, smooth, buf.tmp, buf.pre)
      if (doY && eqY) blurHist(buf.hy, bands, smooth, buf.tmp, buf.pre)
    }
    // positive tilt = more room at the far end (right / bottom), y being down
    if (doX) cdfX = buildCdf(buf.cumX, lr, ce, eqX ? eq : 0, buf.hx, bands)
    if (doY) cdfY = buildCdf(buf.cumY, tb, ce, eqY ? eq : 0, buf.hy, bands)
  }

  if (cdfX || cdfY) {
    for (const st of skel.strokes) {
      if (!st.alive) continue
      const p = st.pts
      for (let i = 0; i < p.length; i += 2) {
        const x = p[i]
        const y = p[i + 1]
        if (!Number.isFinite(x) || !Number.isFinite(y)) continue
        if (cdfX) p[i] = b.x0 + remapAt(cdfX, cvX, (x - b.x0) * invW, s) * bw
        if (cdfY) p[i + 1] = b.y0 + remapAt(cdfY, cvY, (y - b.y0) * invH, s) * bh
      }
    }
  }

  if (qd > 0) quadrantSqueeze(skel, qd, num(P.wpAngle, 0, 360, 0), s)

  recomputeBounds(skel)
  recomputeLengths(skel)
}

/**
 * The same monotone remap done along a rotated axis: only the component along
 * (ux, uy) moves, so the map is p → p + f(p·u)·u — injective for the same reason
 * the axis-aligned warps are, and it composes with them without folding.
 */
function quadrantSqueeze(skel, amount, angleDeg, s) {
  const a = (angleDeg * Math.PI) / 180
  const ux = Math.cos(a)
  const uy = Math.sin(a)
  let v0 = Infinity
  let v1 = -Infinity
  for (const st of skel.strokes) {
    if (!st.alive) continue
    const p = st.pts
    for (let i = 0; i < p.length; i += 2) {
      const v = p[i] * ux + p[i + 1] * uy
      if (!Number.isFinite(v)) continue
      if (v < v0) v0 = v
      if (v > v1) v1 = v
    }
  }
  const span = v1 - v0
  if (!(span > 1e-6)) return
  const d = buf.dq
  for (let k = 0; k < PROF; k++) {
    // density falls off along +u, so that end is starved of space and ink piles up there
    d[k] = Math.exp(clamp(-amount * QUAD_GAIN * ((2 * (k + 0.5)) / PROF - 1), -LOG_TOTAL, LOG_TOTAL))
  }
  const cum = integrate(d, buf.cumQ)
  const inv = 1 / span
  for (const st of skel.strokes) {
    if (!st.alive) continue
    const p = st.pts
    for (let i = 0; i < p.length; i += 2) {
      const x = p[i]
      const y = p[i + 1]
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue
      const u = clamp((x * ux + y * uy - v0) * inv, 0, 1)
      const dv = s * (evalCdf(cum, u) - u) * span
      p[i] = x + dv * ux
      p[i + 1] = y + dv * uy
    }
  }
}
