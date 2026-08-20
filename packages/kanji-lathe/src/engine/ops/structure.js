// Per-stroke shape surgery, and the rhythm of stacked parallel strokes.
//
// Two different things share this stage because they are the two halves of one
// question: what a stroke *is* — straight, bowed, faceted, filleted — and where
// it *sits* relative to its parallel neighbours. The first half is a pure
// per-stroke pass over the points; the second moves whole strokes rigidly and
// never touches their shape, so the two halves never fight over the same point.
//
// House rules for everything below: no-op at the default, bounded at the
// extremes, and endpoint-preserving unless the control is explicitly about the
// endpoints (curl and shorten are; nothing else is).
import { clamp, chaikin, mulberry32 } from '../../geom/path.js'
import { recomputeBounds, recomputeLengths, EM } from '../skeleton.js'

const BOW_ADD = 0.75 // most a single straighten = −1 pass may add to a point's offset, in chord lengths
const ENTASIS_GAIN = 0.09 // mid-stroke bulge as a fraction of the stroke's own length
const TENSION_PASSES = 6 // six 3-tap passes ≈ a wide Gaussian; more just melts the stroke
const CRISP_WINDOW = 0.08 // tangent arm as a fraction of the stroke's samples
const CRISP_PULL = 0.25 // cap the corner's travel, in em, when the legs are near-parallel
const CRISP_MIN_SIN = 0.15 // below ≈9° between the legs there is no corner to sharpen
const CURL_SWEEP = Math.PI * 0.5 // end-to-end twist at full curl
const TAPER_GAIN = 1.1 // log of the sampling exponent at full taper shift
const SHORTEN_GAIN = 0.35 // ±35% of the stroke's own axis
const RHYTHM_GAIN = 1.2 // log of the power-curve exponent at full rhythm
const PARALLEL_SIN = Math.sin((20 * Math.PI) / 180)
const OVERLAP_MIN = 0.25 // share of the shorter stroke two neighbours must share to count as stacked
const EVEN_JITTER = 0.85 // gap randomisation at stEvenness = −1; < 1 keeps every gap positive

export const params = [
  {
    id: 'stStraighten',
    label: 'Straighten',
    group: 'Stroke shape',
    type: 'range',
    min: -1,
    max: 1,
    step: 0.01,
    default: 0,
    bipolar: true,
    hint: 'Pull each stroke onto its own chord (positive) or bow it away from the chord (negative). The endpoints never move.',
  },
  {
    id: 'stTension',
    label: 'Tension',
    group: 'Stroke shape',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    hint: 'Chaikin smoothing — corners soften and the stroke relaxes toward its own chord.',
  },
  {
    id: 'stCrisp',
    label: 'Crispness',
    group: 'Stroke shape',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    hint: 'The opposite of tension: extend the two legs of each corner to where they would meet and pull the corner out to that point.',
  },
  {
    id: 'stEntasis',
    label: 'Entasis',
    group: 'Stroke shape',
    type: 'range',
    min: -0.5,
    max: 0.5,
    step: 0.005,
    default: 0,
    bipolar: true,
    hint: 'Classical swelling: long strokes bow outward at the middle, short ones barely move. Negative hollows them instead.',
  },
  {
    id: 'stShorten',
    label: 'Stroke length',
    group: 'Stroke shape',
    type: 'range',
    min: -1,
    max: 1,
    step: 0.01,
    default: 0,
    bipolar: true,
    hint: 'Scale every stroke along its own axis about its own midpoint — negative retracts strokes away from each other, positive lets them overrun.',
  },
  {
    id: 'stCornerRound',
    label: 'Corner rounding',
    group: 'Corners',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    hint: 'Fillet the turns of ㇕-family strokes — a brush turning a corner without stopping.',
  },
  {
    id: 'stCornerRadius',
    label: 'Corner radius',
    group: 'Corners',
    type: 'range',
    min: 0,
    max: 0.15,
    step: 0.002,
    default: 0.04,
    unit: 'em',
    when: (P) => P.stCornerRound > 0,
    hint: 'How far back along each leg the fillet starts.',
  },
  {
    id: 'stAngleQuant',
    label: 'Angle quantise',
    group: 'Quantise',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    hint: 'Snap every local direction to a fixed set of angles and rebuild the stroke from them — constructivist faceting.',
  },
  {
    id: 'stAngleSteps',
    label: 'Angle steps',
    group: 'Quantise',
    type: 'range',
    min: 3,
    max: 24,
    step: 1,
    default: 8,
    when: (P) => P.stAngleQuant > 0,
    hint: 'Directions available around the circle. 4 is a plus sign, 8 an octagon, 24 nearly free.',
  },
  {
    id: 'stGridSnap',
    label: 'Grid snap',
    group: 'Quantise',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    hint: 'Pull every point onto a lattice over the em square — pixel-font logic applied to a brush.',
  },
  {
    id: 'stGridN',
    label: 'Grid divisions',
    group: 'Quantise',
    type: 'range',
    min: 2,
    max: 48,
    step: 1,
    default: 12,
    when: (P) => P.stGridSnap > 0,
    hint: 'Lattice cells across the em.',
  },
  {
    id: 'stCurl',
    label: 'Curl',
    group: 'Stroke shape',
    type: 'range',
    min: -1,
    max: 1,
    step: 0.01,
    default: 0,
    bipolar: true,
    hint: 'Rotate each point about the stroke midpoint by an angle that grows with distance along the stroke — it twists like a ribbon.',
  },
  {
    id: 'stTaperShift',
    label: 'Sample bias',
    group: 'Stroke shape',
    type: 'range',
    min: -1,
    max: 1,
    step: 0.01,
    default: 0,
    bipolar: true,
    hint: 'Bunch the samples toward the start (negative) or the end (positive) of each stroke, moving where the pen puts its width detail.',
  },
  {
    id: 'stHRhythm',
    label: 'Horizontal rhythm',
    group: 'Rhythm',
    type: 'range',
    min: -1,
    max: 1,
    step: 0.01,
    default: 0,
    bipolar: true,
    hint: 'Redistribute stacks of parallel 横 strokes along a power curve: positive crowds them toward the bottom, negative toward the top.',
  },
  {
    id: 'stVRhythm',
    label: 'Vertical rhythm',
    group: 'Rhythm',
    type: 'range',
    min: -1,
    max: 1,
    step: 0.01,
    default: 0,
    bipolar: true,
    hint: 'The same for rows of parallel 縦 strokes: positive crowds them to the right, negative to the left.',
  },
  {
    id: 'stEvenness',
    label: 'Evenness',
    group: 'Rhythm',
    type: 'range',
    min: -1,
    max: 1,
    step: 0.01,
    default: 0,
    bipolar: true,
    hint: 'At +1 every gap in a stack is exactly equal — 間隔を等しく, the oldest rule in the book. At −1 the gaps are randomised instead.',
  },
]

// Per-stroke scratch, grown on demand. One glyph is processed at a time and
// every buffer is consumed before the stroke loop advances, so one set is enough.
const buf = {
  s: new Float64Array(256), // normalised arc parameter per point
  a: new Float64Array(512), // rebuilt / resampled point buffer
  cnt: new Float64Array(32), // candidates inside each component
  c: new Float64Array(32), // cross-axis position of each stroke in a stack
  t: new Float64Array(32), // its target position, 0..1 across the stack
  g: new Float64Array(32),
}
const need = (key, len) => (buf[key].length < len ? (buf[key] = new Float64Array(len)) : buf[key])

const rd = (v, d, lo, hi) => clamp(Number.isFinite(v) ? v : d, lo, hi)

/** Normalised arc parameter for each point; returns the total length. */
function arcInto(p, n, out) {
  out[0] = 0
  for (let i = 1; i < n; i++) {
    out[i] = out[i - 1] + Math.hypot(p[i * 2] - p[i * 2 - 2], p[i * 2 + 1] - p[i * 2 - 1])
  }
  const total = out[n - 1]
  const inv = total > 1e-9 ? 1 / total : 0
  for (let i = 0; i < n; i++) out[i] *= inv
  return total
}

/** Last line of defence: one non-finite coordinate would poison every later stage. */
function sanitize(s) {
  const p = s.pts
  for (let i = 0; i < p.length; i++) if (!Number.isFinite(p[i])) p[i] = s.ref[i]
}

// ── per-stroke shape ─────────────────────────────────────────────────────────

/**
 * Straighten and entasis in one pass — both are displacements scaled by the
 * same sin(πs) hump, which is what pins the endpoints down.
 *
 * Straighten moves each point along the line to its chord point, so +1 lands on
 * the chord at mid-stroke and −1 doubles the existing deviation. Entasis pushes
 * along the chord normal instead, on whichever side faces away from the glyph
 * centre: a column bulges outward, never into its neighbour.
 */
function bow(s, sArr, straighten, entasis, len, cx, cy) {
  const p = s.pts
  const n = s.n
  const x0 = p[0]
  const y0 = p[1]
  const dx = p[(n - 1) * 2] - x0
  const dy = p[(n - 1) * 2 + 1] - y0
  const L = Math.hypot(dx, dy)
  if (L < 1e-6) return
  let nx = 0
  let ny = 0
  const bulge = entasis * ENTASIS_GAIN * len
  if (bulge !== 0) {
    nx = -dy / L
    ny = dx / L
    if (nx * (x0 + dx * 0.5 - cx) + ny * (y0 + dy * 0.5 - cy) < 0) {
      nx = -nx
      ny = -ny
    }
  }
  for (let i = 1; i < n - 1; i++) {
    const t = sArr[i]
    const hump = Math.sin(Math.PI * t)
    let ox = p[i * 2] - (x0 + dx * t)
    let oy = p[i * 2 + 1] - (y0 + dy * t)
    if (straighten !== 0) {
      // scaling the offset from the chord: 0 at +1 (dead straight), doubled at −1
      let k = 1 - straighten * hump
      if (k > 1) {
        // cap what one pass may add, so re-running the stage cannot double the
        // bow again and again; well clear of anything a real stroke reaches
        const d = Math.hypot(ox, oy)
        if (d * (k - 1) > BOW_ADD * L) k = 1 + (BOW_ADD * L) / Math.max(d, 1e-9)
      }
      ox *= k
      oy *= k
    }
    if (bulge !== 0) {
      ox += nx * bulge * hump
      oy += ny * bulge * hump
    }
    p[i * 2] = x0 + dx * t + ox
    p[i * 2 + 1] = y0 + dy * t + oy
  }
}

/** Fractional Chaikin: k full passes, then a partial blend into pass k+1. */
function soften(s, amount, quality) {
  const total = amount * (quality < 1 ? TENSION_PASSES / 2 : TENSION_PASSES)
  const k = Math.floor(total)
  const f = total - k
  let cur = s.pts
  for (let i = 0; i < k; i++) cur = chaikin(cur)
  if (f > 1e-4) {
    const nxt = chaikin(cur)
    for (let i = 0; i < cur.length; i++) cur[i] += (nxt[i] - cur[i]) * f
  }
  if (cur !== s.pts) s.pts.set(cur)
}

/**
 * Sharpen the detected corners. Each corner has two legs; extend both to their
 * intersection and drag the corner out to it, with a tent falloff so the window
 * edges stay put. Near-parallel legs are left alone — their intersection is
 * arbitrarily far away and there is no corner there to sharpen anyway.
 */
function crispen(s, amount, em) {
  const p = s.pts
  const n = s.n
  const w = Math.max(2, Math.round(n * CRISP_WINDOW))
  const maxPull = CRISP_PULL * em
  for (const c of s.corners) {
    const i0 = c - w
    const i1 = c + w
    if (i0 - w < 0 || i1 + w > n - 1) continue
    const ax = p[i0 * 2] - p[(i0 - w) * 2]
    const ay = p[i0 * 2 + 1] - p[(i0 - w) * 2 + 1]
    const bx = p[(i1 + w) * 2] - p[i1 * 2]
    const by = p[(i1 + w) * 2 + 1] - p[i1 * 2 + 1]
    const la = Math.hypot(ax, ay)
    const lb = Math.hypot(bx, by)
    if (la < 1e-9 || lb < 1e-9) continue
    const den = ax * by - ay * bx
    if (Math.abs(den) < CRISP_MIN_SIN * la * lb) continue
    const ex = p[i1 * 2] - p[i0 * 2]
    const ey = p[i1 * 2 + 1] - p[i0 * 2 + 1]
    const t = (ex * by - ey * bx) / den
    const qx = p[i0 * 2] + t * ax
    const qy = p[i0 * 2 + 1] + t * ay
    const kx = qx - p[c * 2]
    const ky = qy - p[c * 2 + 1]
    const d = Math.hypot(kx, ky)
    if (!(d > 1e-9) || d > maxPull) continue
    for (let i = i0 + 1; i < i1; i++) {
      const g = amount * (1 - Math.abs(i - c) / w)
      p[i * 2] += g * (qx - p[i * 2])
      p[i * 2 + 1] += g * (qy - p[i * 2 + 1])
    }
  }
}

/**
 * Fillet each corner with the quadratic through its two shoulders — the corner
 * point is the control point, so the curve leaves and rejoins the stroke exactly
 * tangentially. Windows are clipped to half the gap between corners so two
 * fillets on one ㇟ never chew into each other.
 */
function fillet(s, amount, radius, em, len) {
  const cs = s.corners
  if (!cs.length) return
  const p = s.pts
  const n = s.n
  const spacing = len / Math.max(1, n - 1)
  const w0 = Math.round((radius * em) / Math.max(spacing, 1e-6))
  if (w0 < 1) return
  for (let ci = 0; ci < cs.length; ci++) {
    const c = cs[ci]
    let w = Math.min(w0, c, n - 1 - c)
    if (ci > 0) w = Math.min(w, (c - cs[ci - 1]) >> 1)
    if (ci < cs.length - 1) w = Math.min(w, (cs[ci + 1] - c) >> 1)
    if (w < 1) continue
    const ax = p[(c - w) * 2]
    const ay = p[(c - w) * 2 + 1]
    const bx = p[(c + w) * 2]
    const by = p[(c + w) * 2 + 1]
    const kx = p[c * 2]
    const ky = p[c * 2 + 1]
    const inv = 1 / (2 * w)
    for (let i = c - w + 1; i < c + w; i++) {
      const u = (i - c + w) * inv
      const mt = 1 - u
      const qx = mt * mt * ax + 2 * mt * u * kx + u * u * bx
      const qy = mt * mt * ay + 2 * mt * u * ky + u * u * by
      p[i * 2] += amount * (qx - p[i * 2])
      p[i * 2 + 1] += amount * (qy - p[i * 2 + 1])
    }
  }
}

/**
 * Snap every segment direction to one of `steps` angles and re-integrate the
 * stroke from its start point. That accumulates drift, so the rebuild is then
 * put back on the original chord by the single rotate+scale that maps its end to
 * the real end — a similarity, so the snapped angles all turn together and the
 * faceting survives. If the rebuild curled up on itself the similarity would be
 * a wild magnification; there we spread the endpoint error along the arc instead.
 */
function quantise(s, amount, steps, sArr) {
  const p = s.pts
  const n = s.n
  const q = need('a', n * 2)
  const inc = (Math.PI * 2) / steps
  q[0] = p[0]
  q[1] = p[1]
  for (let i = 1; i < n; i++) {
    const dx = p[i * 2] - p[i * 2 - 2]
    const dy = p[i * 2 + 1] - p[i * 2 - 1]
    const L = Math.hypot(dx, dy)
    if (L < 1e-12) {
      q[i * 2] = q[i * 2 - 2]
      q[i * 2 + 1] = q[i * 2 - 1]
      continue
    }
    const a = Math.round(Math.atan2(dy, dx) / inc) * inc
    q[i * 2] = q[i * 2 - 2] + Math.cos(a) * L
    q[i * 2 + 1] = q[i * 2 - 1] + Math.sin(a) * L
  }
  const d0x = q[(n - 1) * 2] - q[0]
  const d0y = q[(n - 1) * 2 + 1] - q[1]
  const d1x = p[(n - 1) * 2] - p[0]
  const d1y = p[(n - 1) * 2 + 1] - p[1]
  const l0 = Math.hypot(d0x, d0y)
  const l1 = Math.hypot(d1x, d1y)
  if (l0 > 1e-6 && l1 > 1e-6 && l0 >= 0.5 * l1) {
    const inv = 1 / (l0 * l0)
    const rx = (d1x * d0x + d1y * d0y) * inv
    const ry = (d1y * d0x - d1x * d0y) * inv
    for (let i = 1; i < n; i++) {
      const vx = q[i * 2] - q[0]
      const vy = q[i * 2 + 1] - q[1]
      q[i * 2] = p[0] + rx * vx - ry * vy
      q[i * 2 + 1] = p[1] + ry * vx + rx * vy
    }
  } else {
    const ex = d1x - d0x
    const ey = d1y - d0y
    for (let i = 1; i < n; i++) {
      q[i * 2] += ex * sArr[i]
      q[i * 2 + 1] += ey * sArr[i]
    }
  }
  for (let i = 1; i < n; i++) {
    p[i * 2] += amount * (q[i * 2] - p[i * 2])
    p[i * 2 + 1] += amount * (q[i * 2 + 1] - p[i * 2 + 1])
  }
}

/** Twist about the point at half arc length: the angle grows with (s − ½). */
function curl(s, amount, sArr) {
  const p = s.pts
  const n = s.n
  let j = 0
  while (j < n - 2 && sArr[j + 1] < 0.5) j++
  const seg = sArr[j + 1] - sArr[j]
  const t = seg > 1e-12 ? (0.5 - sArr[j]) / seg : 0
  const mx = p[j * 2] + (p[j * 2 + 2] - p[j * 2]) * t
  const my = p[j * 2 + 1] + (p[j * 2 + 3] - p[j * 2 + 1]) * t
  const k = amount * CURL_SWEEP
  for (let i = 0; i < n; i++) {
    const a = k * (sArr[i] - 0.5)
    const co = Math.cos(a)
    const si = Math.sin(a)
    const vx = p[i * 2] - mx
    const vy = p[i * 2 + 1] - my
    p[i * 2] = mx + co * vx - si * vy
    p[i * 2 + 1] = my + si * vx + co * vy
  }
}

/**
 * Re-sample the stroke at arc positions u^k instead of u. The points stay on the
 * same polyline and both ends are fixed, so the stroke does not move — only the
 * density of samples along it changes, which is what the pen reads as detail.
 */
function taperShift(s, amount, sArr) {
  const p = s.pts
  const n = s.n
  const out = need('a', n * 2)
  const k = Math.exp(-amount * TAPER_GAIN)
  out[0] = p[0]
  out[1] = p[1]
  let j = 0
  for (let i = 1; i < n - 1; i++) {
    const target = Math.pow(i / (n - 1), k)
    while (j < n - 2 && sArr[j + 1] < target) j++
    const seg = sArr[j + 1] - sArr[j]
    const t = seg > 1e-12 ? clamp((target - sArr[j]) / seg, 0, 1) : 0
    out[i * 2] = p[j * 2] + (p[j * 2 + 2] - p[j * 2]) * t
    out[i * 2 + 1] = p[j * 2 + 1] + (p[j * 2 + 3] - p[j * 2 + 1]) * t
  }
  out[(n - 1) * 2] = p[(n - 1) * 2]
  out[(n - 1) * 2 + 1] = p[(n - 1) * 2 + 1]
  p.set(out.subarray(0, n * 2))
}

/** Scale along the chord about the chord midpoint; a dot with no axis scales evenly. */
function shorten(s, amount) {
  const p = s.pts
  const n = s.n
  const f = amount * SHORTEN_GAIN
  const mx = (p[0] + p[(n - 1) * 2]) * 0.5
  const my = (p[1] + p[(n - 1) * 2 + 1]) * 0.5
  const dx = p[(n - 1) * 2] - p[0]
  const dy = p[(n - 1) * 2 + 1] - p[1]
  const L = Math.hypot(dx, dy)
  if (L < 1e-6) {
    for (let i = 0; i < n; i++) {
      p[i * 2] = mx + (p[i * 2] - mx) * (1 + f)
      p[i * 2 + 1] = my + (p[i * 2 + 1] - my) * (1 + f)
    }
    return
  }
  const ux = dx / L
  const uy = dy / L
  for (let i = 0; i < n; i++) {
    const d = ((p[i * 2] - mx) * ux + (p[i * 2 + 1] - my) * uy) * f
    p[i * 2] += d * ux
    p[i * 2 + 1] += d * uy
  }
}

// ── rhythm of stacked parallel strokes ───────────────────────────────────────

/**
 * A candidate for a stack: live, of the class asked for, and lying within 20°
 * of the axis — the class alone is not enough, since layout and warp may have
 * tilted a 横 well past the point where it still reads as one.
 */
function candidates(skel, cls, vertical, out) {
  out.length = 0
  for (const s of skel.strokes) {
    if (!s.alive || s.n < 2 || s.cls !== cls) continue
    const p = s.pts
    const dx = p[(s.n - 1) * 2] - p[0]
    const dy = p[(s.n - 1) * 2 + 1] - p[1]
    const L = Math.hypot(dx, dy)
    if (!(L > 1e-6)) continue
    if ((vertical ? Math.abs(dx) : Math.abs(dy)) / L > PARALLEL_SIN) continue
    out.push(s)
  }
  return out
}

/**
 * Bucket the candidates by component. This takes a climb rather than a lookup
 * because KanjiVG decomposes more finely than the eye does: 三 is three separate
 * 一 elements, so every stroke's innermost group is a singleton and no stack
 * would ever form. Each stroke therefore walks its ancestry outward to the first
 * component holding two or more candidates, and buckets that nest collapse into
 * the outer one — the smallest component that actually contains a stack.
 *
 * Written into `keys`, parallel to `cand`; -1 means the whole glyph.
 */
function bucketKeys(skel, cand, keys) {
  const gs = skel.groups
  const count = need('cnt', Math.max(1, gs.length))
  for (let g = 0; g < gs.length; g++) {
    let c = 0
    for (const s of cand) if (s.i >= gs[g].from && s.i < gs[g].to) c++
    count[g] = c
  }
  keys.length = cand.length
  for (let a = 0; a < cand.length; a++) {
    const anc = cand[a].ancestry
    let key = -1
    for (let k = anc.length - 1; k >= 0; k--) {
      if (count[anc[k]] >= 2) {
        key = anc[k]
        break
      }
    }
    keys[a] = key
  }
  // ranges from one tree either nest or are disjoint, so widening once is enough
  for (let a = 0; a < keys.length; a++) {
    let best = keys[a]
    for (let b = 0; b < keys.length; b++) {
      const kb = keys[b]
      if (kb === best) continue
      if (kb === -1) best = -1
      else if (best !== -1 && gs[kb].from <= gs[best].from && gs[kb].to >= gs[best].to) best = kb
    }
    keys[a] = best
  }
  return keys
}

/** Extent of a stroke along its own axis, from its chord ends. */
const spanLo = (s, vertical) => Math.min(s.pts[vertical ? 1 : 0], s.pts[(s.n - 1) * 2 + (vertical ? 1 : 0)])
const spanHi = (s, vertical) => Math.max(s.pts[vertical ? 1 : 0], s.pts[(s.n - 1) * 2 + (vertical ? 1 : 0)])

/** Cross-axis coordinate of a stroke's chord midpoint — what the stack sorts on. */
const crossOf = (s, vertical) => (s.pts[vertical ? 0 : 1] + s.pts[(s.n - 1) * 2 + (vertical ? 0 : 1)]) * 0.5

/**
 * Redistribute one run's cross-axis positions. The two extreme strokes are
 * pinned, so the run keeps the extent the rest of the glyph was designed around
 * and only the interior spacing is rewritten.
 *
 * Natural positions are normalised across the run, bent through a power curve
 * (the rhythm), then blended toward perfectly equal spacing — 間隔を等しく, the
 * oldest rule in CJK type — or toward seeded random gaps.
 */
function respace(stack, lo, hi, vertical, rhythm, even, seed) {
  const m = hi - lo
  const c = need('c', m)
  const t = need('t', m)
  for (let j = 0; j < m; j++) c[j] = crossOf(stack[lo + j], vertical)
  const span = c[m - 1] - c[0]
  if (!(span > 1e-3)) return
  const pw = Math.exp(-rhythm * RHYTHM_GAIN)
  for (let j = 0; j < m; j++) t[j] = Math.pow((c[j] - c[0]) / span, pw)
  if (even > 0) {
    for (let j = 0; j < m; j++) t[j] += even * (j / (m - 1) - t[j])
  } else if (even < 0) {
    // random but strictly positive gaps, so the run keeps its order
    const rnd = mulberry32(seed)
    const g = need('g', m)
    let sum = 0
    for (let j = 1; j < m; j++) {
      g[j] = 1 + (rnd() * 2 - 1) * EVEN_JITTER
      sum += g[j]
    }
    const inv = 1 / Math.max(sum, 1e-9)
    let acc = 0
    for (let j = 1; j < m; j++) {
      acc += g[j] * inv
      t[j] += -even * (acc - t[j])
    }
  }
  for (let j = 0; j < m; j++) {
    const d = c[0] + t[j] * span - c[j]
    if (!Number.isFinite(d) || d === 0) continue
    const p = stack[lo + j].pts
    for (let i = vertical ? 0 : 1; i < p.length; i += 2) p[i] += d
  }
}

const cand = []
const keys = []

function rhythmPass(skel, cls, vertical, rhythm, even) {
  candidates(skel, cls, vertical, cand)
  if (cand.length < 3) return
  bucketKeys(skel, cand, keys)
  for (const key of new Set(keys)) {
    const bucket = cand.filter((s, a) => keys[a] === key)
    if (bucket.length < 3) continue
    bucket.sort((a, b) => crossOf(a, vertical) - crossOf(b, vertical))
    // The climb above can escalate to the root when a lone 横 owns its component,
    // which would stack the left half of 語 against its right half. Cut the bucket
    // into runs that actually overlap along their own axis: strokes standing side
    // by side are not stacked on top of each other, whatever the tree says.
    let run = 0
    for (let j = 1; j <= bucket.length; j++) {
      let cut = j === bucket.length
      if (!cut) {
        const a = bucket[j - 1]
        const b = bucket[j]
        const ov = Math.min(spanHi(a, vertical), spanHi(b, vertical)) - Math.max(spanLo(a, vertical), spanLo(b, vertical))
        const shorter = Math.min(spanHi(a, vertical) - spanLo(a, vertical), spanHi(b, vertical) - spanLo(b, vertical))
        cut = ov < OVERLAP_MIN * Math.max(shorter, 1e-6)
      }
      if (!cut) continue
      if (j - run >= 3) {
        respace(bucket, run, j, vertical, rhythm, even, (skel.seed + key * 9176 + run * 31 + (vertical ? 733 : 0)) >>> 0)
      }
      run = j
    }
  }
}

// ── the stage ────────────────────────────────────────────────────────────────

function gridSnap(skel, amount, cells, em) {
  const cell = em / cells
  const inv = 1 / cell
  for (const s of skel.strokes) {
    if (!s.alive) continue
    const p = s.pts
    for (let i = 0; i < p.length; i++) {
      if (Number.isFinite(p[i])) p[i] += amount * (Math.round(p[i] * inv) * cell - p[i])
    }
  }
}

export function apply(skel, P, ctx) {
  const straighten = rd(P.stStraighten, 0, -1, 1)
  const tension = rd(P.stTension, 0, 0, 1)
  const crisp = rd(P.stCrisp, 0, 0, 1)
  const entasis = rd(P.stEntasis, 0, -0.5, 0.5)
  const radius = rd(P.stCornerRadius, 0.04, 0, 0.15)
  const round = radius > 0 ? rd(P.stCornerRound, 0, 0, 1) : 0
  const quant = rd(P.stAngleQuant, 0, 0, 1)
  const steps = Math.round(rd(P.stAngleSteps, 8, 3, 24))
  const snap = rd(P.stGridSnap, 0, 0, 1)
  const cells = Math.round(rd(P.stGridN, 12, 2, 48))
  const twist = rd(P.stCurl, 0, -1, 1)
  const taper = rd(P.stTaperShift, 0, -1, 1)
  const hRhythm = rd(P.stHRhythm, 0, -1, 1)
  const vRhythm = rd(P.stVRhythm, 0, -1, 1)
  const even = rd(P.stEvenness, 0, -1, 1)
  const shrink = rd(P.stShorten, 0, -1, 1)

  const early = straighten !== 0 || entasis !== 0
  const late = round > 0 || quant > 0 || twist !== 0 || taper !== 0
  const perStroke = early || late || tension > 0 || crisp > 0 || shrink !== 0
  const rhythm = hRhythm !== 0 || vRhythm !== 0 || even !== 0
  if (!perStroke && !rhythm && snap <= 0) return

  const em = skel.em || EM
  const quality = ctx && Number.isFinite(ctx.quality) ? ctx.quality : 1

  if (perStroke) {
    // entasis needs a reference point to bulge away from; the current bbox
    // centre follows whatever layout and warp have already done to the glyph
    recomputeBounds(skel)
    const cx = (skel.bbox.x0 + skel.bbox.x1) * 0.5
    const cy = (skel.bbox.y0 + skel.bbox.y1) * 0.5
    // Anything that moves interior points re-spaces them, so the arc parameter
    // the late ops read has to be taken again afterwards. bow counts: at the
    // extremes it changes a stroke's arc length by well over half.
    const dirty = early || tension > 0 || crisp > 0
    for (const s of skel.strokes) {
      if (!s.alive || s.n < 2) continue
      const sArr = need('s', s.n)
      let len = 0
      if (early || (late && !dirty)) len = arcInto(s.pts, s.n, sArr)
      if (early) bow(s, sArr, straighten, entasis, len, cx, cy)
      if (tension > 0) soften(s, tension, quality)
      if (crisp > 0) crispen(s, crisp, em)
      if (late && dirty) len = arcInto(s.pts, s.n, sArr)
      if (round > 0) fillet(s, round, radius, em, len)
      if (quant > 0) quantise(s, quant, steps, sArr)
      if (twist !== 0) curl(s, twist, sArr)
      if (taper !== 0) taperShift(s, taper, sArr)
      if (shrink !== 0) shorten(s, shrink)
      sanitize(s)
    }
  }

  if (rhythm) {
    if (hRhythm !== 0 || even !== 0) rhythmPass(skel, 'h', false, hRhythm, even)
    if (vRhythm !== 0 || even !== 0) rhythmPass(skel, 'v', true, vRhythm, even)
  }

  // the lattice has the last word, so nothing after it knocks points back off
  if (snap > 0) gridSnap(skel, snap, cells, em)

  recomputeBounds(skel)
  recomputeLengths(skel)
}
