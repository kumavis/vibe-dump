// Controlled irregularity — the gap between computer output and something a
// hand or a plant made.
//
// Four sources, deliberately different in kind, because one uniform jitter
// applied to every point reads as a shaken photograph rather than an unsteady
// hand:
//   • the curl field displaces each point by the ROTATED gradient of a scalar
//     potential. A rotated gradient is divergence-free, so the field swirls the
//     glyph without locally inflating or collapsing it: neighbouring strokes
//     lean together instead of tearing apart.
//   • tremor is 1-D noise along the stroke pushed PERPENDICULAR to the local
//     tangent — the pen wavers across its path, never along it, which is the
//     difference between a shaky hand and a stuttering one.
//   • wander moves and turns each stroke RIGIDLY: a mis-aimed stroke is still a
//     cleanly drawn stroke.
//   • endpoint jitter tapers to nothing at the middle — imprecise landings.
//
// Determinism is the whole game here: the same seed and character must give
// bit-identical points. That is also why nothing below draws from `ctx.rng` —
// the layout stage already takes a variable number of values from that stream,
// so its position at this point in the pipeline depends on unrelated controls.
// Local mulberry32 streams, seeded from ctx.seed and the character, do not.
import { clamp, smoothstep, mulberry32, hashString, makeNoise2D } from '../../geom/path.js'
import { recomputeBounds, recomputeLengths, EM } from '../skeleton.js'

const DEG = Math.PI / 180
const GRAD_H = 0.06 // finite-difference step for the curl gradient, in field cells
// Calibrated so nzField reads directly as a displacement in em fractions: the
// measured RMS of |∇ψ|/√octaves at GRAD_H is ≈1.05 per field cell.
const CURL_GAIN = 0.95
const CURL_CAP = 2.2 // hard ceiling on |displacement| in units of nzField, so a rare steep cell cannot fling a point
const TREMOR_SLOW = 0.72 // split between the slow waver and the fine chatter riding on it
const TREMOR_FINE_MUL = 2.7 // irrational-ish ratio: the two octaves never lock into one beat
const LANE_SPAN = 71.3 // how far apart in the lattice two strokes' tremor lanes can sit
const FAST_OCTAVES = 2 // thumbnails do not resolve the fine octaves anyway

export const params = [
  {
    id: 'nzField',
    label: 'Curl field',
    group: 'Curl field',
    type: 'range',
    min: 0,
    max: 0.12,
    step: 0.001,
    default: 0,
    unit: 'em',
    hint: 'Displace every point along the rotated gradient of a noise potential. Divergence-free, so the glyph swirls and drifts without strokes pulling apart.',
  },
  {
    id: 'nzFieldScale',
    label: 'Field scale',
    group: 'Curl field',
    type: 'range',
    min: 0.5,
    max: 12,
    step: 0.1,
    default: 3,
    when: (P) => (P.nzField ?? 0) > 0,
    hint: 'Spatial frequency of the field. Low values push the whole glyph one way; high values curl every stroke separately.',
  },
  {
    id: 'nzFieldOctaves',
    label: 'Field octaves',
    group: 'Curl field',
    type: 'range',
    min: 1,
    max: 4,
    step: 1,
    default: 2,
    when: (P) => (P.nzField ?? 0) > 0,
    hint: 'fBm detail. One octave is a smooth drift, four adds fine turbulence on top.',
  },
  {
    id: 'nzTremor',
    label: 'Tremor',
    group: 'Hand',
    type: 'range',
    min: 0,
    max: 0.05,
    step: 0.0005,
    default: 0,
    unit: 'em',
    hint: 'Hand tremor: noise along each stroke, displaced across its own tangent, so the line wavers rather than the image shaking.',
  },
  {
    id: 'nzTremorFreq',
    label: 'Tremor frequency',
    group: 'Hand',
    type: 'range',
    min: 1,
    max: 40,
    step: 0.5,
    default: 8,
    when: (P) => (P.nzTremor ?? 0) > 0,
    hint: 'Cycles along a stroke. Low is a slow drunken sway, high is a fine buzz.',
  },
  {
    id: 'nzWander',
    label: 'Wander',
    group: 'Hand',
    type: 'range',
    min: 0,
    max: 0.06,
    step: 0.001,
    default: 0,
    unit: 'em',
    hint: 'Shift each stroke bodily by a random offset. The stroke keeps its shape — only its aim is off.',
  },
  {
    id: 'nzWanderRot',
    label: 'Wander rotation',
    group: 'Hand',
    type: 'range',
    min: 0,
    max: 20,
    step: 0.1,
    default: 0,
    unit: '°',
    hint: 'Turn each stroke about its own midpoint by a random angle.',
  },
  {
    id: 'nzEndpointJit',
    label: 'Endpoint jitter',
    group: 'Hand',
    type: 'range',
    min: 0,
    max: 0.08,
    step: 0.001,
    default: 0,
    unit: 'em',
    hint: 'Jitter only the two ends of each stroke, fading to nothing at its middle — the stroke starts and lands imprecisely.',
  },
  {
    id: 'nzOrderDecay',
    label: 'Order decay',
    group: 'Variation',
    type: 'range',
    min: -1,
    max: 1,
    step: 0.01,
    default: 0,
    bipolar: true,
    hint: 'Scale all the noise above by stroke order: positive gets shakier as the glyph is written, negative settles down.',
  },
  {
    id: 'nzGlyphVariance',
    label: 'Glyph variance',
    group: 'Variation',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 1,
    hint: 'How much the randomness differs per character. At 0 every glyph is distorted identically — a warped lens; at 1 each has its own hand.',
  },
  {
    id: 'nzSeed',
    label: 'Seed',
    group: 'Variation',
    type: 'seed',
    default: 1,
    hint: 'Everything in this stage is a deterministic function of this seed and the character.',
  },
]

const rd = (v, dflt, lo, hi) => (typeof v === 'number' && Number.isFinite(v) ? clamp(v, lo, hi) : dflt)

// Points are copied out before they are touched so tangents and field samples
// all read the same untouched geometry; 240 is the skeleton's own sample cap.
let srcBuf = new Float64Array(240 * 2)
let arcBuf = new Float64Array(240)

/**
 * fBm potential. Successive octaves are offset off the lattice origin so they
 * cannot line up there, and the sum is left un-normalised — only its gradient
 * is used, and that is normalised by octave count at the call site.
 */
function fbm(nse, x, y, oct) {
  let sum = 0
  let amp = 1
  let f = 1
  for (let k = 0; k < oct; k++) {
    sum += amp * nse(x * f + k * 19.7, y * f + k * 31.3)
    amp *= 0.5
    f *= 2
  }
  return sum
}

// Fallback lattice for callers that hand us no ctx (the pipeline always does).
let loose = null
let looseSeed = NaN
const noiseFor = (seed) => {
  if (loose && looseSeed === seed) return loose
  looseSeed = seed
  loose = makeNoise2D(seed)
  return loose
}

export function apply(skel, P, ctx) {
  const field = rd(P.nzField, 0, 0, 0.12)
  const tremor = rd(P.nzTremor, 0, 0, 0.05)
  const wander = rd(P.nzWander, 0, 0, 0.06)
  const wanderRot = rd(P.nzWanderRot, 0, 0, 20) * DEG
  const endJit = rd(P.nzEndpointJit, 0, 0, 0.08)
  if (!(field || tremor || wander || wanderRot || endJit)) return

  const em = skel.em || EM
  const decay = rd(P.nzOrderDecay, 0, -1, 1)
  const variance = rd(P.nzGlyphVariance, 1, 0, 1)
  const freq = rd(P.nzTremorFreq, 8, 1, 40)
  const fieldK = rd(P.nzFieldScale, 3, 0.5, 12) / em
  const quality = ctx && Number.isFinite(ctx.quality) ? ctx.quality : 1
  const oct = Math.min(quality < 1 ? FAST_OCTAVES : 4, Math.round(rd(P.nzFieldOctaves, 2, 1, 4)))

  const base = (ctx && Number.isFinite(ctx.seed) ? ctx.seed : rd(P.nzSeed, 1, -2147483648, 2147483647)) | 0
  const glyph = hashString(skel.char || '')
  const nse = ctx && typeof ctx.noise === 'function' ? ctx.noise : noiseFor(base & 1023)

  // Glyph variance crossfades a stream shared by every character against one
  // keyed to this character. Quadrature weights keep the amplitude flat across
  // the fade, so "half independent" does not also mean "half as shaky".
  const wS = 1 - variance
  const wG = variance
  const mixNorm = 1 / Math.max(1e-6, Math.hypot(wS, wG))
  const rngS = mulberry32((base ^ 0x9e3779b9) >>> 0)
  const rngG = mulberry32((base ^ glyph ^ 0x85ebca6b) >>> 0)
  const draw = () => {
    const a = rngS() * 2 - 1
    const b = rngG() * 2 - 1
    return clamp((a * wS + b * wG) * mixNorm, -1, 1)
  }

  // The field gets the same treatment, but as a second sampling frame rather
  // than a second stream: the curl of a blend of potentials is the blend of
  // their curls, so the crossfade is still divergence-free.
  const ox = ((glyph & 1023) / 1024) * 251 + 7
  const oy = (((glyph >>> 10) & 1023) / 1024) * 251 + 3
  const pot = (x, y) => {
    let v = 0
    if (wS > 0) v += wS * fbm(nse, x, y, oct)
    if (wG > 0) v += wG * fbm(nse, x + ox, y + oy, oct)
    return v * mixNorm
  }
  // Each octave halves in amplitude but doubles in frequency, so every one of
  // them contributes equally to the gradient — hence √oct, not the fBm sum.
  const curlK = (field * em * CURL_GAIN) / Math.sqrt(oct)
  const curlCap = field * em * CURL_CAP
  const invH2 = 1 / (2 * GRAD_H)

  const strokes = skel.strokes
  const count = skel.strokeCount || strokes.length || 1

  for (let si = 0; si < strokes.length; si++) {
    const s = strokes[si]
    // Draw for dead strokes too, and always the same eight values: a stroke
    // dropped upstream, or a control left at zero, must not reshuffle the
    // randomness of every stroke after it.
    const wAng = draw()
    const wRad = draw()
    const wRot = draw()
    const aAng = draw()
    const aRad = draw()
    const bAng = draw()
    const bRad = draw()
    const lane = draw()
    if (!s || !s.alive) continue
    const n = s.n
    if (!(n > 1)) continue

    // Order decay: 1 at the middle of the writing order, 1±decay at the ends.
    const k = count > 1 ? clamp((s.i ?? si) / (count - 1), 0, 1) : 0.5
    const gain = clamp(1 + decay * (2 * k - 1), 0, 2)
    if (gain === 0) continue

    const pts = s.pts
    if (srcBuf.length < n * 2) srcBuf = new Float64Array(n * 2)
    if (arcBuf.length < n) arcBuf = new Float64Array(n)
    const src = srcBuf
    const arc = arcBuf

    let x0 = Infinity
    let y0 = Infinity
    let x1 = -Infinity
    let y1 = -Infinity
    arc[0] = 0
    for (let i = 0; i < n; i++) {
      const x = pts[i * 2]
      const y = pts[i * 2 + 1]
      src[i * 2] = x
      src[i * 2 + 1] = y
      if (x < x0) x0 = x
      if (x > x1) x1 = x
      if (y < y0) y0 = y
      if (y > y1) y1 = y
      if (i > 0) arc[i] = arc[i - 1] + Math.hypot(x - src[i * 2 - 2], y - src[i * 2 - 1])
    }
    if (!Number.isFinite(x0) || !Number.isFinite(y0) || !Number.isFinite(x1) || !Number.isFinite(y1)) continue
    const total = arc[n - 1]
    // a degenerate (zero-length) stroke still has a well-defined index ramp
    const invTot = total > 1e-9 ? 1 / total : 0

    const cx = (x0 + x1) / 2
    const cy = (y0 + y1) / 2
    const rot = wRot * wanderRot * gain
    const cos = Math.cos(rot)
    const sin = Math.sin(rot)
    const wr = wander * em * gain * Math.sqrt(Math.abs(wRad))
    const offX = Math.cos(wAng * Math.PI) * wr
    const offY = Math.sin(wAng * Math.PI) * wr

    const endAmp = endJit * em * gain
    const asx = Math.cos(aAng * Math.PI) * Math.sqrt(Math.abs(aRad)) * endAmp
    const asy = Math.sin(aAng * Math.PI) * Math.sqrt(Math.abs(aRad)) * endAmp
    const aex = Math.cos(bAng * Math.PI) * Math.sqrt(Math.abs(bRad)) * endAmp
    const aey = Math.sin(bAng * Math.PI) * Math.sqrt(Math.abs(bRad)) * endAmp

    const tremAmp = tremor * em * gain
    const curlAmp = curlK * gain
    const curlLim = curlCap * gain
    const laneX = lane * LANE_SPAN
    const laneY = lane * LANE_SPAN * 0.37 + si * 0.61

    for (let i = 0; i < n; i++) {
      const px = src[i * 2]
      const py = src[i * 2 + 1]
      let dx = 0
      let dy = 0

      if (curlAmp) {
        const u = px * fieldK
        const v = py * fieldK
        const gx = (pot(u + GRAD_H, v) - pot(u - GRAD_H, v)) * invH2
        const gy = (pot(u, v + GRAD_H) - pot(u, v - GRAD_H)) * invH2
        // quarter-turn of ∇ψ — the 2-D curl of a scalar potential
        let fx = gy * curlAmp
        let fy = -gx * curlAmp
        const m = Math.hypot(fx, fy)
        if (m > curlLim) {
          const f = curlLim / m
          fx *= f
          fy *= f
        }
        dx += fx
        dy += fy
      }

      if (tremAmp || endAmp) {
        const sp = invTot ? arc[i] * invTot : i / (n - 1)
        if (tremAmp) {
          const a = i > 0 ? i - 1 : 0
          const b = i < n - 1 ? i + 1 : n - 1
          const tx = src[b * 2] - src[a * 2]
          const ty = src[b * 2 + 1] - src[a * 2 + 1]
          const L = Math.hypot(tx, ty) || 1
          const u = sp * freq + laneX
          const w =
            nse(u, laneY) * TREMOR_SLOW + nse(u * TREMOR_FINE_MUL + 5.5, laneY + 0.5) * (1 - TREMOR_SLOW)
          const d = (w * tremAmp) / L
          dx -= ty * d
          dy += tx * d
        }
        if (endAmp) {
          // 1 at the end, 0 from the midpoint inwards, with no kink at either
          const ws = 1 - smoothstep(Math.min(1, sp * 2))
          const we = 1 - smoothstep(Math.min(1, (1 - sp) * 2))
          dx += asx * ws + aex * we
          dy += asy * ws + aey * we
        }
      }

      const rx = px - cx
      const ry = py - cy
      const nx = cx + rx * cos - ry * sin + offX + dx
      const ny = cy + rx * sin + ry * cos + offY + dy
      pts[i * 2] = Number.isFinite(nx) ? nx : px
      pts[i * 2 + 1] = Number.isFinite(ny) ? ny : py
    }
  }

  recomputeBounds(skel)
  recomputeLengths(skel)
}
