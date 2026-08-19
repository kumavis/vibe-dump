// Whole-glyph distortion — the finished skeleton pushed through a field.
//
// Everything here works in a normalised frame taken from the glyph's CURRENT
// bounding box, so these operators compose on top of whatever the layout, warp
// and stroke stages already did. That frame is deliberately a SQUARE of side
// max(width, height) centred on the bbox, with p,q running −1…1 across it.
// Normalising by the raw bbox instead would turn every rotation of 一 (roughly
// 900 × 40 em units) into a shear and every circle into a sliver.
//
// Composition order, all inside that frame:
//   mirror → scale → superellipse → barrel → twist → bend → polar
//          → perspective → slant → rotate → back to em units → wave
// The field shapes act on the glyph as it sits in its square, the affine
// "camera" operators frame the result, and the wave is surface detail applied
// last — which is why its amplitude is quoted in em rather than frame units.
import { clamp } from '../../geom/path.js'
import { recomputeBounds, recomputeLengths } from '../skeleton.js'

const DEG = Math.PI / 180
const MIN_SIDE = 1e-3
const CORNER = Math.SQRT2 // frame radius at the corners — the unit for radial falloff
const RADIAL_MAX = 1.5 // radial terms stop growing here, so a stray far point can never invert one
const TWIST_MAX = Math.PI // half a turn at the corner when frTwist is ±1
const BARREL_GAIN = 0.5
const KEYSTONE_GAIN = 0.6
// Keeping the bend radius above one frame unit is what stops the far edge of the
// glyph from sweeping through the arc centre and turning inside out.
const BEND_MAX = 1.4
const POLAR_INNER_MIN = 0.02 // the ring radius is exponential in v, and ln(0) is the one real singularity here
const POLAR_V_SLACK = 0.25 // how far outside the frame the polar map still tracks v

export const params = [
  {
    id: 'frSlant',
    label: 'Slant',
    group: 'Frame',
    type: 'range',
    min: -35,
    max: 35,
    step: 0.5,
    default: 0,
    unit: '°',
    bipolar: true,
    hint: 'Italic shear about the vertical centre of the glyph. Positive leans right.',
  },
  {
    id: 'frRotate',
    label: 'Rotate',
    group: 'Frame',
    type: 'range',
    min: -45,
    max: 45,
    step: 0.5,
    default: 0,
    unit: '°',
    bipolar: true,
    hint: 'Turn the whole glyph about the centre of its bounding box.',
  },
  { id: 'frScaleX', label: 'Scale X', group: 'Frame', type: 'range', min: 0.4, max: 1.6, step: 0.01, default: 1, hint: 'Condense or extend, about the centre.' },
  { id: 'frScaleY', label: 'Scale Y', group: 'Frame', type: 'range', min: 0.4, max: 1.6, step: 0.01, default: 1, hint: 'Flatten or heighten, about the centre.' },
  {
    id: 'frMirror',
    label: 'Mirror',
    group: 'Frame',
    type: 'select',
    default: 'none',
    options: [
      { value: 'none', label: 'None' },
      { value: 'x', label: 'Flip horizontally' },
      { value: 'y', label: 'Flip vertically' },
      { value: 'xy', label: 'Both — half turn' },
    ],
    hint: 'Reflect the glyph in its own frame. Illegible on purpose; useful for lettering and marks.',
  },
  {
    id: 'frSuperellipse',
    label: 'Superellipse',
    group: 'Distortion',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    hint: 'Bend the square em into a superellipse: every point keeps its direction and is rescaled by how much closer the new boundary sits in that direction.',
  },
  {
    id: 'frSuperN',
    label: 'Superellipse exponent',
    group: 'Distortion',
    type: 'range',
    min: 0.4,
    max: 6,
    step: 0.05,
    default: 2,
    when: (P) => (P.frSuperellipse ?? 0) > 0,
    hint: '0.5 an astroid, 1 a diamond, 2 a circle, 6 all but square again.',
  },
  {
    id: 'frTwist',
    label: 'Twist',
    group: 'Distortion',
    type: 'range',
    min: -1,
    max: 1,
    step: 0.01,
    default: 0,
    bipolar: true,
    hint: 'Vortex: each point turns about the centre by an angle proportional to its radius, so the middle stays put and the corners spin.',
  },
  {
    id: 'frBarrel',
    label: 'Barrel',
    group: 'Distortion',
    type: 'range',
    min: -1,
    max: 1,
    step: 0.01,
    default: 0,
    bipolar: true,
    hint: 'Positive bulges the middle outwards, negative pinches it — lens barrel and pincushion.',
  },
  {
    id: 'frPerspective',
    label: 'Perspective',
    group: 'Distortion',
    type: 'range',
    min: -1,
    max: 1,
    step: 0.01,
    default: 0,
    bipolar: true,
    hint: 'Keystone: width grows or shrinks linearly down the glyph, as if it were tipped away from you.',
  },
  {
    id: 'frBend',
    label: 'Bend',
    group: 'Distortion',
    type: 'range',
    min: -1,
    max: 1,
    step: 0.01,
    default: 0,
    bipolar: true,
    hint: 'Set the glyph on an arc, the way text is set on a curve. Positive drops the two ends.',
  },
  {
    id: 'frPolar',
    label: 'Polar wrap',
    group: 'Polar wrap',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    hint: 'Blend towards a log-polar map: horizontal position becomes angle and vertical position becomes radius, so the glyph wraps into a ring.',
  },
  {
    id: 'frPolarArc',
    label: 'Arc',
    group: 'Polar wrap',
    type: 'range',
    min: 30,
    max: 360,
    step: 1,
    default: 360,
    unit: '°',
    when: (P) => (P.frPolar ?? 0) > 0,
    hint: 'How much of the circle the glyph wraps around.',
  },
  {
    id: 'frPolarInner',
    label: 'Inner radius',
    group: 'Polar wrap',
    type: 'range',
    min: 0,
    max: 0.8,
    step: 0.01,
    default: 0.35,
    when: (P) => (P.frPolar ?? 0) > 0,
    hint: 'Radius the foot of the glyph lands on. Small values crush the inside of the ring together.',
  },
  {
    id: 'frWave',
    label: 'Wave',
    group: 'Wave',
    type: 'range',
    min: 0,
    max: 0.25,
    step: 0.005,
    default: 0,
    unit: 'em',
    hint: 'Sinusoidal ripple across the glyph, amplitude in em.',
  },
  { id: 'frWaveFreq', label: 'Wave frequency', group: 'Wave', type: 'range', min: 0.5, max: 8, step: 0.1, default: 2, when: (P) => (P.frWave ?? 0) > 0, hint: 'Cycles across the frame.' },
  {
    id: 'frWaveAngle',
    label: 'Wave angle',
    group: 'Wave',
    type: 'range',
    min: 0,
    max: 360,
    step: 1,
    default: 90,
    unit: '°',
    when: (P) => (P.frWave ?? 0) > 0,
    hint: 'Direction the wave travels in; the ripple displaces the glyph across it.',
  },
]

const num = (v, lo, hi, dflt) => (typeof v === 'number' && Number.isFinite(v) ? clamp(v, lo, hi) : dflt)

export function apply(skel, P) {
  const slant = num(P.frSlant, -35, 35, 0) * DEG
  const rot = num(P.frRotate, -45, 45, 0) * DEG
  const sx = num(P.frScaleX, 0.4, 1.6, 1)
  const sy = num(P.frScaleY, 0.4, 1.6, 1)
  const sup = num(P.frSuperellipse, 0, 1, 0)
  const twist = num(P.frTwist, -1, 1, 0)
  const barrel = num(P.frBarrel, -1, 1, 0)
  const persp = num(P.frPerspective, -1, 1, 0)
  const bend = num(P.frBend, -1, 1, 0)
  const polar = num(P.frPolar, 0, 1, 0)
  const wave = num(P.frWave, 0, 0.25, 0)
  const mirror = P.frMirror ?? 'none'
  const flipX = mirror === 'x' || mirror === 'xy'
  const flipY = mirror === 'y' || mirror === 'xy'

  if (!(slant || rot || sup || twist || barrel || persp || bend || polar || wave || flipX || flipY || sx !== 1 || sy !== 1)) return

  recomputeBounds(skel)
  const b = skel.bbox
  const cx = (b.x0 + b.x1) / 2
  const cy = (b.y0 + b.y1) / 2
  const half = Math.max(b.x1 - b.x0, b.y1 - b.y0, MIN_SIDE) / 2
  const inv = 1 / half

  const superN = num(P.frSuperN, 0.4, 6, 2)
  const invSuperN = 1 / superN
  const halfBend = (bend * BEND_MAX) / 2
  const bendR = bend ? 1 / halfBend : 0 // signed arc radius: (frame half-width 1) / halfBend
  const polarArc = num(P.frPolarArc, 30, 360, 360) * DEG
  const lnInner = Math.log(Math.max(num(P.frPolarInner, 0, 0.8, 0.35), POLAR_INNER_MIN))
  const tanSlant = Math.tan(slant)
  const cosRot = Math.cos(rot)
  const sinRot = Math.sin(rot)
  const waveAmp = wave * skel.em
  const waveK = Math.PI * num(P.frWaveFreq, 0.5, 8, 2)
  const waveAngle = num(P.frWaveAngle, 0, 360, 90) * DEG
  const waveCos = Math.cos(waveAngle)
  const waveSin = Math.sin(waveAngle)

  for (const s of skel.strokes) {
    if (!s.alive) continue
    const pts = s.pts
    for (let i = 0; i < s.n; i++) {
      let p = (pts[i * 2] - cx) * inv
      let q = (pts[i * 2 + 1] - cy) * inv

      if (flipX) p = -p
      if (flipY) q = -q
      if (sx !== 1) p *= sx
      if (sy !== 1) q *= sy

      if (sup) {
        const r = Math.hypot(p, q)
        if (r > 1e-9) {
          const ax = Math.abs(p) / r
          const ay = Math.abs(q) / r
          // how far the square boundary sits along this ray, versus the superellipse
          const rSquare = 1 / Math.max(ax, ay)
          const rSuper = 1 / Math.pow(Math.pow(ax, superN) + Math.pow(ay, superN), invSuperN)
          const k = 1 + sup * (rSuper / rSquare - 1)
          p *= k
          q *= k
        }
      }

      if (barrel) {
        const rn = Math.min(Math.hypot(p, q) / CORNER, RADIAL_MAX)
        const f = clamp(1 + barrel * BARREL_GAIN * (0.5 - rn * rn), 0.05, 4)
        p *= f
        q *= f
      }

      if (twist) {
        const a = twist * TWIST_MAX * Math.min(Math.hypot(p, q) / CORNER, RADIAL_MAX)
        const c = Math.cos(a)
        const sn = Math.sin(a)
        const t = p * c - q * sn
        q = p * sn + q * c
        p = t
      }

      if (bendR) {
        // written as R·(1−cos φ) rather than R − (R−q)·cos φ so it stays exact as R → ∞
        const phi = p * halfBend
        const c = Math.cos(phi)
        const sn = Math.sin(phi)
        p = (bendR - q) * sn
        q = bendR * (1 - c) + q * c
      }

      if (polar) {
        const phi = p * 0.5 * polarArc
        const v = clamp((q + 1) * 0.5, -POLAR_V_SLACK, 1 + POLAR_V_SLACK)
        const rho = Math.exp(lnInner * v) // 1 at the head of the glyph, the inner radius at its foot
        p += polar * (rho * Math.sin(phi) - p)
        q += polar * (-rho * Math.cos(phi) - q)
      }

      if (persp) p *= clamp(1 + persp * KEYSTONE_GAIN * clamp(q, -2, 2), 0.05, 3)
      if (tanSlant) p -= tanSlant * q
      if (rot) {
        const t = p * cosRot - q * sinRot
        q = p * sinRot + q * cosRot
        p = t
      }

      let x = cx + p * half
      let y = cy + q * half
      if (waveAmp) {
        const d = Math.sin((p * waveCos + q * waveSin) * waveK) * waveAmp
        x -= waveSin * d
        y += waveCos * d
      }
      // last line of defence: a non-finite coordinate would poison every bbox downstream
      pts[i * 2] = Number.isFinite(x) ? x : cx
      pts[i * 2 + 1] = Number.isFinite(y) ? y : cy
    }
  }

  recomputeBounds(skel)
  recomputeLengths(skel)
}
