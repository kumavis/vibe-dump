// The pen. Everything upstream decides where the ink goes; this decides how
// much of it there is, filling `stroke.w[i]` — the half-width in em units.
//
// The models below are a stack of independent multipliers on one base weight,
// which is what makes them composable: a broad-nib contrast, an optical
// horizontal/vertical correction, a pressure envelope, and a handful of
// weight-by-stroke rules all multiply into the same number. Every model is the
// identity at its default, so the default pen is an honest monoline.
//
// Two things are deliberately *not* decided here: the terminals (capsFor()
// hands them to the outline stage, which is the only place that can draw them)
// and the stroke geometry itself, which the nib never touches.
import { clamp, lerp, smoothstep, tangents, makeNoise2D } from '../geom/path.js'
import { evalCurve, flatCurve } from './curve.js'
import { EM } from './skeleton.js'

const MIN_W = 0.5 // contract floor: a zero-width stroke is a hole in the glyph
const MAX_W_FRAC = 0.45 // and a half-width past ~half the em is a blob, not a stroke
const HV_GAIN = 0.45 // ±45% between a pure horizontal and a pure vertical at full contrast
const CLASS_MIX = 0.55 // how much of the h/v decision comes from the stroke class vs. the local tangent
const PRESS_SPAN = 0.45 // taper confined to the first/last 45% of the arc, so the middle stays full
const ORDER_GAIN = 0.5
const LEN_REF = 340 // median stroke length across the corpus, in em units
const LEN_LO = 0.2
const LEN_HI = 3
const LEN_GAIN = 0.5
const DEPTH_GAIN = 0.4
const GRAY_REF = 3800 // median *total* skeleton length of a glyph — the "already correct" weight
const GRAY_SPAN_LO = 0.62 // 一 and 臓 bracket the corpus at ≈4.7× and ≈0.62× of that reference
const GRAY_SPAN_HI = 4.7
const GRAY_LO = 0.35
// The rail has to clear that bracket, or "full equal-ink" quietly stops short on
// the one glyph that asks for the most of it: 一 wants 4.69x and used to be cut
// to 3.5x, landing at 75% of everyone else's ink at nbGrayNorm 1.
const GRAY_HI = GRAY_SPAN_HI
const GRAY_FLOOR = 120 // a glyph shorter than this is a single tick; do not divide by it
const HOOK_EM = 100 // a はね flick is about this long whatever the stroke is
const HOOK_SPAN_LO = 0.06
const HOOK_SPAN_HI = 0.35
const HOOK_SWELL = 0.55
const HOOK_TIP = 0.75
const WOBBLE_GAIN = 0.6

const CAPS = ['butt', 'round', 'pointed', 'wedge', 'slab', 'bulb', 'split']
const CAP_OPTIONS = [
  { value: 'butt', label: 'Butt — cut square' },
  { value: 'round', label: 'Round' },
  { value: 'pointed', label: 'Pointed' },
  { value: 'wedge', label: 'Wedge — angled cut' },
  { value: 'slab', label: 'Slab — squared overhang' },
  { value: 'bulb', label: 'Bulb — swollen head' },
  { value: 'split', label: 'Split — dry brush' },
]
const CAP_SET = new Set(CAPS)

export const params = [
  {
    id: 'nbWeight',
    label: 'Weight',
    group: 'Pen',
    type: 'range',
    min: 4,
    max: 90,
    step: 0.5,
    default: 26,
    unit: 'em',
    hint: 'Half-width of every stroke before any of the models below touch it. At the defaults this is the whole pen: a clean monoline.',
  },
  {
    id: 'nbContrast',
    label: 'Nib contrast',
    group: 'Broad nib',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    hint: 'Hold a flat nib at a fixed angle: strokes running along it come out thin, strokes crossing it come out full. 0 is a round pen.',
  },
  {
    id: 'nbNibAngle',
    label: 'Nib angle',
    group: 'Broad nib',
    type: 'range',
    min: 0,
    max: 180,
    step: 1,
    default: 30,
    unit: '°',
    when: (P) => P.nbContrast > 0,
    hint: 'Direction the flat of the nib faces, anticlockwise from the baseline. Strokes parallel to it are the thin ones.',
  },
  {
    id: 'nbNibFloor',
    label: 'Thin limit',
    group: 'Broad nib',
    type: 'range',
    min: 0.05,
    max: 1,
    step: 0.01,
    default: 0.25,
    when: (P) => P.nbContrast > 0,
    hint: 'How thin the thinnest direction is allowed to get, as a fraction of the weight. A real nib has a corner, so strokes never quite vanish.',
  },
  {
    id: 'nbHVContrast',
    label: 'Horizontal/vertical',
    group: 'Broad nib',
    type: 'range',
    min: -1,
    max: 1,
    step: 0.01,
    default: 0,
    bipolar: true,
    hint: 'The classic CJK optical correction: horizontals drawn lighter than verticals, because a horizontal of equal measure reads heavier. Negative inverts it.',
  },
  {
    id: 'nbPressIn',
    label: 'Entry taper',
    group: 'Pressure',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    hint: 'Lift the pen at the start of every stroke — the brush landing rather than stamping.',
  },
  {
    id: 'nbPressOut',
    label: 'Exit taper',
    group: 'Pressure',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    hint: 'Lift the pen at the end of every stroke.',
  },
  {
    id: 'nbPressCurve',
    label: 'Pressure profile',
    group: 'Pressure',
    type: 'curve',
    default: flatCurve(0.5),
    when: (P) => P.nbPressDepth > 0,
    hint: 'Free-hand weight along the stroke, left edge to right edge. Flat at the middle is neutral; raise a section to press harder there.',
  },
  {
    id: 'nbPressDepth',
    label: 'Profile depth',
    group: 'Pressure',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    hint: 'How much of the drawn pressure profile actually reaches the ink.',
  },
  {
    id: 'nbOrderWeight',
    label: 'By stroke order',
    group: 'Weight by stroke',
    type: 'range',
    min: -1,
    max: 1,
    step: 0.01,
    default: 0,
    bipolar: true,
    hint: 'Positive fattens the first strokes and thins the last; negative does the reverse. The glyph gains a written-in direction.',
  },
  {
    id: 'nbOrderCurve',
    label: 'Order profile',
    group: 'Weight by stroke',
    type: 'curve',
    default: flatCurve(0.5),
    when: (P) => P.nbOrderDepth > 0,
    hint: 'Arbitrary weight against stroke order, first stroke at the left edge.',
  },
  {
    id: 'nbOrderDepth',
    label: 'Order depth',
    group: 'Weight by stroke',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    hint: 'How much of the drawn order profile reaches the ink.',
  },
  {
    id: 'nbLenWeight',
    label: 'By stroke length',
    group: 'Weight by stroke',
    type: 'range',
    min: -1,
    max: 1,
    step: 0.01,
    default: 0,
    bipolar: true,
    hint: 'Positive makes long strokes heavier than short ones; negative evens the ink out by making the long ones lighter.',
  },
  {
    id: 'nbDepthWeight',
    label: 'By component depth',
    group: 'Weight by stroke',
    type: 'range',
    min: -1,
    max: 1,
    step: 0.01,
    default: 0,
    bipolar: true,
    hint: 'Weight by how deeply nested the stroke sits in the component tree. Negative lightens the innermost parts, which is how a crowded component keeps breathing.',
  },
  {
    id: 'nbGrayNorm',
    label: 'Grey normalise',
    group: 'Weight by stroke',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    hint: 'Trade weight against total skeleton length so a 3-stroke and a 23-stroke character set to the same colour on the page. 1 is full equal-ink.',
  },
  {
    id: 'nbWDot',
    label: 'Dots',
    group: 'Class weights',
    type: 'range',
    min: 0.3,
    max: 2,
    step: 0.01,
    default: 1,
    hint: 'Weight multiplier for 点 dots and short ticks.',
  },
  {
    id: 'nbWTurn',
    label: 'Turning strokes',
    group: 'Class weights',
    type: 'range',
    min: 0.3,
    max: 2,
    step: 0.01,
    default: 1,
    hint: 'Weight multiplier for the ㇕ family — strokes that change direction mid-flight.',
  },
  {
    id: 'nbWDiag',
    label: 'Falling strokes',
    group: 'Class weights',
    type: 'range',
    min: 0.3,
    max: 2,
    step: 0.01,
    default: 1,
    hint: 'Weight multiplier for 撇 pie and 捺 na — the two diagonals that carry a character.',
  },
  {
    id: 'nbWRise',
    label: 'Rising strokes',
    group: 'Class weights',
    type: 'range',
    min: 0.3,
    max: 2,
    step: 0.01,
    default: 1,
    hint: 'Weight multiplier for 提 rising ticks.',
  },
  {
    id: 'nbHookFlare',
    label: 'Hook flare',
    group: 'Texture',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    hint: 'Swell then taper at the end of every hooked stroke — the はね flick, where the brush loads up before leaving the paper.',
  },
  {
    id: 'nbWobble',
    label: 'Width wobble',
    group: 'Texture',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    hint: 'Irregular thickening and thinning along each stroke — 掠れ, the dry brush running out of ink. Deterministic for a given seed.',
  },
  {
    id: 'nbWobbleFreq',
    label: 'Wobble rate',
    group: 'Texture',
    type: 'range',
    min: 1,
    max: 30,
    step: 0.5,
    default: 8,
    when: (P) => P.nbWobble > 0,
    hint: 'How many swells fit along one stroke. Low is a loaded brush breathing, high is a splitting one.',
  },
  {
    id: 'nbCapStart',
    label: 'Start terminal',
    group: 'Terminals',
    type: 'select',
    default: 'round',
    options: CAP_OPTIONS,
    hint: 'Shape drawn where the stroke begins.',
  },
  {
    id: 'nbCapEnd',
    label: 'End terminal',
    group: 'Terminals',
    type: 'select',
    default: 'round',
    options: CAP_OPTIONS,
    hint: 'Shape drawn where the stroke ends.',
  },
  {
    id: 'nbCapAuto',
    label: 'Automatic exits',
    group: 'Terminals',
    type: 'toggle',
    default: true,
    hint: 'Point the end of hooked and falling strokes regardless of the setting above — those are the strokes a brush leaves the paper on.',
  },
]

// ── helpers ──────────────────────────────────────────────────────────────────

const rd = (v, d, lo, hi) => clamp(Number.isFinite(v) ? v : d, lo, hi)

/** Curve sample as a 0..1 height; Catmull-Rom can overshoot its own handles. */
const cv = (c, t) => {
  const v = evalCurve(c, t)
  return Number.isFinite(v) ? clamp(v, 0, 1) : 0.5
}

const usableCurve = (c) => (Array.isArray(c) && c.length > 1 ? c : null)

// One glyph at a time, one buffer each. Tangent buffers must be exactly n*2 for
// tangents() to write in place, and only a handful of sample counts ever occur.
let arcBuf = new Float64Array(256)
const tanCache = new Map()
const tanFor = (n) => {
  let t = tanCache.get(n)
  if (!t) {
    if (tanCache.size > 48) tanCache.clear()
    t = new Float64Array(n * 2)
    tanCache.set(n, t)
  }
  return t
}

// Fallback lattice for callers that hand us no ctx (the pipeline always does).
let loose = null
const looseNoise = () => (loose ||= makeNoise2D(1))

/** Normalised arc parameter per point; returns the total length. */
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

// ── the pen ──────────────────────────────────────────────────────────────────

/** Fill every live stroke's half-widths. Overwrites, so re-running is free. */
export function applyNib(skel, P, ctx) {
  const p = P || {}
  const em = Number.isFinite(skel.em) && skel.em > 0 ? skel.em : EM
  const maxW = Math.max(MIN_W, em * MAX_W_FRAC) // the floor outranks the ceiling
  const base = rd(p.nbWeight, 26, 4, 90)
  const contrast = rd(p.nbContrast, 0, 0, 1)
  const nibFloor = rd(p.nbNibFloor, 0.25, 0.05, 1)
  const hv = rd(p.nbHVContrast, 0, -1, 1)
  const pressIn = rd(p.nbPressIn, 0, 0, 1)
  const pressOut = rd(p.nbPressOut, 0, 0, 1)
  const pressDepth = rd(p.nbPressDepth, 0, 0, 1)
  const orderAmt = rd(p.nbOrderWeight, 0, -1, 1)
  const orderDepth = rd(p.nbOrderDepth, 0, 0, 1)
  const lenAmt = rd(p.nbLenWeight, 0, -1, 1)
  const depthAmt = rd(p.nbDepthWeight, 0, -1, 1)
  const gray = rd(p.nbGrayNorm, 0, 0, 1)
  const wDot = rd(p.nbWDot, 1, 0.3, 2)
  const wTurn = rd(p.nbWTurn, 1, 0.3, 2)
  const wDiag = rd(p.nbWDiag, 1, 0.3, 2)
  const wRise = rd(p.nbWRise, 1, 0.3, 2)
  const flare = rd(p.nbHookFlare, 0, 0, 1)
  const wobble = rd(p.nbWobble, 0, 0, 1)
  const wobbleFreq = rd(p.nbWobbleFreq, 8, 1, 30)
  const pressCurve = pressDepth > 0 ? usableCurve(p.nbPressCurve) : null
  const orderCurve = orderDepth > 0 ? usableCurve(p.nbOrderCurve) : null

  // The nib is stated anticlockwise from the baseline, but y runs down, so the
  // rotation flips. |sin(tangent − nib)| then needs no atan2 at all.
  const a = (rd(p.nbNibAngle, 30, 0, 180) * Math.PI) / 180
  const nibCos = Math.cos(a)
  const nibSin = Math.sin(a)

  const wantTan = contrast > 0 || hv !== 0
  const perPoint = wantTan || pressIn > 0 || pressOut > 0 || pressCurve || flare > 0 || wobble > 0
  const nse = ctx && typeof ctx.noise === 'function' ? ctx.noise : wobble > 0 ? looseNoise() : null
  const gseed = Number.isFinite(skel.seed) ? skel.seed >>> 0 : 0

  // Grey normalisation. Ink area ≈ 2·w·L, so w ∝ 1/L holds the area constant
  // across the corpus — a 一 becomes a slab and a 鑑 a hairline. That is the
  // mathematically fair reading and it is too much: junction overlaps mean a
  // dense glyph already over-counts its own length. Hence a blend, not a switch.
  let grayF = 1
  if (gray > 0) {
    let total = 0
    for (const s of skel.strokes) if (s.alive && Number.isFinite(s.len)) total += s.len
    grayF = clamp(Math.pow(GRAY_REF / Math.max(GRAY_FLOOR, total), gray), GRAY_LO, GRAY_HI)
  }

  let maxDepth = 0
  if (depthAmt !== 0) for (const g of skel.groups) if (Number.isFinite(g.depth) && g.depth > maxDepth) maxDepth = g.depth

  // A one-stroke glyph has no stroke order, so the ramp and the profile sit at
  // their midpoint. Reading i/1 = 0 instead would hand 一 the full first-stroke
  // bonus and knock it out of colour with every other glyph on the page.
  const last = (skel.strokeCount || skel.strokes.length) - 1

  for (const s of skel.strokes) {
    if (!s.alive || !s.n) continue
    const n = s.n
    const w = s.w

    // ── per-stroke multipliers ──
    let m = base * grayF
    m *= s.cls === 'dot' ? wDot : s.cls === 'turn' ? wTurn : s.cls === 'd' ? wDiag : s.cls === 'r' ? wRise : 1

    const k = last > 0 ? clamp(s.i / last, 0, 1) : 0.5
    if (orderAmt !== 0) m *= 1 + orderAmt * ORDER_GAIN * (1 - 2 * k)
    if (orderCurve) m *= 1 + orderDepth * (2 * cv(orderCurve, k) - 1)

    if (lenAmt !== 0) {
      const r = clamp((Number.isFinite(s.len) ? s.len : LEN_REF) / LEN_REF, LEN_LO, LEN_HI)
      m *= Math.pow(r, lenAmt * LEN_GAIN)
    }
    if (depthAmt !== 0 && maxDepth > 0) {
      const g = s.group >= 0 ? skel.groups[s.group] : null
      const dn = g && Number.isFinite(g.depth) ? clamp(g.depth / maxDepth, 0, 1) : 0
      m *= 1 + depthAmt * DEPTH_GAIN * (2 * dn - 1)
    }
    // the radical hint left by ops/layout.js
    if (Number.isFinite(s.wMul)) m *= clamp(s.wMul, 0.05, 4)
    if (!Number.isFinite(m)) m = base

    if (!perPoint) {
      w.fill(m > MIN_W ? (m < maxW ? m : maxW) : MIN_W)
      continue
    }

    // ── per-point multipliers ──
    if (arcBuf.length < n) arcBuf = new Float64Array(n)
    const arc = arcBuf
    const len = arcInto(s.pts, n, arc)
    const tan = wantTan ? tangents(s.pts, tanFor(n)) : null
    // a flick is a fixed physical length, so it eats less of a long stroke
    const hookSpan = flare > 0 && s.hook ? clamp(HOOK_EM / Math.max(1, len), HOOK_SPAN_LO, HOOK_SPAN_HI) : 0
    const clsDir = s.cls === 'h' ? -1 : s.cls === 'v' ? 1 : 0
    const clsMix = clsDir === 0 ? 0 : CLASS_MIX
    const row = (gseed % 211) + s.i * 3.17

    for (let i = 0; i < n; i++) {
      const u = arc[i]
      let f = 1
      if (tan) {
        const tx = tan[i * 2]
        const ty = tan[i * 2 + 1]
        if (contrast > 0) {
          const sinD = Math.abs(ty * nibCos + tx * nibSin)
          f *= lerp(1, nibFloor + (1 - nibFloor) * sinD, contrast)
        }
        if (hv !== 0) {
          // the class knows what the stroke *is*, the tangent knows what it is
          // doing right here; a ㇕ turning from heng to shu crossfades between them
          const local = Math.abs(ty) - Math.abs(tx)
          f *= 1 + hv * HV_GAIN * (clsMix * clsDir + (1 - clsMix) * local)
        }
      }
      if (pressIn > 0) f *= 1 - pressIn * (1 - smoothstep(u < PRESS_SPAN ? u / PRESS_SPAN : 1))
      if (pressOut > 0) f *= 1 - pressOut * (1 - smoothstep(1 - u < PRESS_SPAN ? (1 - u) / PRESS_SPAN : 1))
      if (pressCurve) f *= 1 + pressDepth * (2 * cv(pressCurve, u) - 1)
      if (hookSpan > 0 && u > 1 - hookSpan) {
        const q = (u - (1 - hookSpan)) / hookSpan
        const q2 = q * q
        f *= 1 + flare * (HOOK_SWELL * Math.sin(Math.PI * Math.pow(q, 0.8)) - HOOK_TIP * q2 * q2)
      }
      if (wobble > 0) f *= 1 + wobble * WOBBLE_GAIN * nse(u * wobbleFreq, row)
      // NaN fails both comparisons and lands on the floor, which is the point
      const v = m * f
      w[i] = v > MIN_W ? (v < maxW ? v : maxW) : MIN_W
    }
  }
  return skel
}

const capOf = (v) => (CAP_SET.has(v) ? v : 'round')

/**
 * Terminals for one stroke, for the outline stage. Automatic exits point the
 * strokes a brush actually lifts off: every hook, and the tail of a pie or na.
 */
export function capsFor(stroke, P) {
  const p = P || {}
  const capStart = capOf(p.nbCapStart)
  const auto = p.nbCapAuto !== false
  if (auto && stroke && (stroke.hook || stroke.cls === 'd')) return { capStart, capEnd: 'pointed' }
  return { capStart, capEnd: capOf(p.nbCapEnd) }
}

/**
 * Cheap readout for the UI: the half-width range the current pen can reach,
 * from the parameters alone. It is a bound, not a census — no glyph exercises
 * every model at once, and the radical hint is not knowable from P.
 */
export function nibDebug(P) {
  const p = P || {}
  const base = rd(p.nbWeight, 26, 4, 90)
  const contrast = rd(p.nbContrast, 0, 0, 1)
  const nibFloor = rd(p.nbNibFloor, 0.25, 0.05, 1)
  const hv = Math.abs(rd(p.nbHVContrast, 0, -1, 1))
  const pressIn = rd(p.nbPressIn, 0, 0, 1)
  const pressOut = rd(p.nbPressOut, 0, 0, 1)
  const pressDepth = rd(p.nbPressDepth, 0, 0, 1)
  const orderAmt = Math.abs(rd(p.nbOrderWeight, 0, -1, 1))
  const orderDepth = rd(p.nbOrderDepth, 0, 0, 1)
  const lenK = rd(p.nbLenWeight, 0, -1, 1) * LEN_GAIN
  const depthAmt = Math.abs(rd(p.nbDepthWeight, 0, -1, 1))
  const gray = rd(p.nbGrayNorm, 0, 0, 1)
  const cls = [1, rd(p.nbWDot, 1, 0.3, 2), rd(p.nbWTurn, 1, 0.3, 2), rd(p.nbWDiag, 1, 0.3, 2), rd(p.nbWRise, 1, 0.3, 2)]
  const flare = rd(p.nbHookFlare, 0, 0, 1)
  const wobble = rd(p.nbWobble, 0, 0, 1) * WOBBLE_GAIN

  let lo = base
  let hi = base
  const span = (a, b) => {
    lo *= a < b ? a : b
    hi *= a < b ? b : a
  }
  span(lerp(1, nibFloor, contrast), 1)
  span(1 - hv * HV_GAIN, 1 + hv * HV_GAIN)
  span(1 - (pressIn > pressOut ? pressIn : pressOut), 1)
  span(1 - pressDepth, 1 + pressDepth)
  span(1 - orderAmt * ORDER_GAIN, 1 + orderAmt * ORDER_GAIN)
  span(1 - orderDepth, 1 + orderDepth)
  span(Math.pow(LEN_LO, lenK), Math.pow(LEN_HI, lenK))
  span(1 - depthAmt * DEPTH_GAIN, 1 + depthAmt * DEPTH_GAIN)
  span(
    clamp(Math.pow(GRAY_SPAN_LO, gray), GRAY_LO, GRAY_HI),
    clamp(Math.pow(GRAY_SPAN_HI, gray), GRAY_LO, GRAY_HI),
  )
  span(Math.min(...cls), Math.max(...cls))
  span(1 - flare * HOOK_TIP, 1 + flare * HOOK_SWELL)
  span(1 - wobble, 1 + wobble)

  const maxW = EM * MAX_W_FRAC
  const min = clamp(Number.isFinite(lo) ? lo : base, MIN_W, maxW)
  const max = clamp(Number.isFinite(hi) ? hi : base, MIN_W, maxW)
  return { base, min, max, ratio: max / Math.max(MIN_W, min), mono: max - min < 1e-6 }
}
