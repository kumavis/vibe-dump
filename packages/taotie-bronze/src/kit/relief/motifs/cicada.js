// Cicada (蝉纹) — research/01 §4.2.
//
// An elongated triangle, length : width ≈ 2.5–3.5 : 1. At the broad end a
// small squared head between two large round eyes (each ≈ 0.25 of the
// width) set at the corners; behind it the body tapers to a point, carrying
// a spine groove and 3–6 chevrons (∧ cuts pointing at the head), with small
// leg hooks at the sides. Used in rows (a frieze on ding necks and legs, all
// heads one way or facing the centre) and as the fill of blades, head toward
// the blade base.
//
// Authored head toward +x in a local frame of height 1 (the cicada's width);
// `orient` turns it: 'right' | 'left' | 'up' | 'down' (head direction).

import { E, R, Pen, Sheet, makeFrame, renderSheet, reliefSchema, withRelief, motifRng, rectClip } from './_strokes.js'

export const schema = {
  orient: E(['right', 'left', 'up', 'down'], 'right', 'Head toward'),
  facing: E(['auto', 'right', 'left'], 'auto', 'Facing (set by friezes)'),
  length: R(2, 4, 0.05, 3, 'Length : width'),
  chevrons: R(2, 6, 1, 4, 'Chevrons'),
  eyeSize: R(0.6, 1.4, 0.05, 1, 'Eye size'),
  legs: { type: 'bool', default: true, label: 'Leg hooks' },
  concave: R(0, 0.3, 0.01, 0.12, 'Side concavity'),
  ...reliefSchema({ motif: 1.2, boss: 2.4, groove: 0.38, lineWeight: 0.45, echoInset: 0.8, carving: 'sparse' }),
}

export const presets = {
  standard: {},
  'row-unit': { orient: 'right', length: 2.6 },
  'blade-fill': { orient: 'down', length: 3.2, legs: false, chevrons: 5 },
  slender: { length: 3.6, chevrons: 6, eyeSize: 0.85 },
  flush: { style: 'flush', relief: { motif: 0.4, boss: 1.2, groove: 0.35 } },
}

/** Marks of one cicada, head at +x end of a frame of height 1 and length A. */
export function buildCicada(S, A, p) {
  const L = Math.min(A, p.length) // body length used
  const x0 = (A - L) / 2 // centred along the frame
  const xh = x0 + L // head tip
  const c = 0.5
  const headL = 0.3
  const xn = xh - headL // neck
  const er = 0.13 * p.eyeSize
  // head: a squarish block between the eyes
  S.rrect([xh - headL / 2, c], headL, 0.7, 0.1)
  // eyes: round bosses standing on the head's outer corners
  const ey = Math.min(0.5 - er - 0.01, 0.33)
  S.circle([xh - headL * 0.5, c + ey], er * 1.12)
  S.circle([xh - headL * 0.5, c - ey], er * 1.12)
  S.boss([xh - headL * 0.5, c + ey], er, { kind: 'round', base: 'plateau', pupil: 'none' })
  S.boss([xh - headL * 0.5, c - ey], er, { kind: 'round', base: 'plateau', pupil: 'none' })
  // body: a concave-sided triangle from the neck to the tail point
  const body = []
  const wn = 0.42 // half-width at the neck
  const n = 24
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const x = xn + 0.01 - t * (xn + 0.01 - x0)
    const hw = wn * (1 - t) * (1 - p.concave * Math.sin(Math.PI * t)) + 0.012
    body.push([x, c + hw])
  }
  for (let i = n; i >= 0; i--) {
    const t = i / n
    const x = xn + 0.01 - t * (xn + 0.01 - x0)
    const hw = wn * (1 - t) * (1 - p.concave * Math.sin(Math.PI * t)) + 0.012
    body.push([x, c - hw])
  }
  S.poly(body)
  // spine and chevrons, cut into the body
  const bl = xn - 0.04 - x0
  S.line([[xn - 0.1, c], [x0 + bl * 0.12, c]])
  const k = p.chevrons | 0
  for (let i = 0; i < k; i++) {
    const t = 0.12 + (0.7 * (i + 0.5)) / k
    const x = xn - 0.04 - t * bl
    const hw = wn * (1 - t) * (1 - p.concave * Math.sin(Math.PI * t)) * 0.62
    const back = Math.min(0.2, hw * 0.9)
    S.line([[x - back, c + hw], [x, c], [x - back, c - hw]])
  }
  // neck line between head and body
  S.line([[xn - 0.02, c + 0.3], [xn - 0.02, c - 0.3]])
  // leg hooks: small raised hooks off the sides of the front body
  if (p.legs && bl > 1) {
    for (const sgn of [1, -1]) {
      const pen = new Pen(xn - 0.32, c + sgn * (wn * 0.8), sgn * 120, 0.006).fd(0.06).arc(sgn * 70, 0.03)
      S.taper(pen.pts, 0.08, 0.03, 0.3)
    }
  }
  return S
}

const ROT = { right: 0, left: 0, up: 90, down: -90 }

export function draw(panel, rect, params) {
  const p = withRelief(params)
  // in a frieze, `facing` (set by compose.frieze) overrides a horizontal orient
  let orient = p.orient
  if ((orient === 'right' || orient === 'left') && (p.facing === 'left' || p.facing === 'right')) orient = p.facing
  const f = makeFrame(rect, { rot: ROT[orient], flip: orient === 'left' })
  const S = new Sheet(f, { rng: motifRng('cicada', rect, p), wobble: 0.003 * p.irregularity })
  buildCicada(S, f.A, p)
  renderSheet(panel, S, p, { clip: rectClip(rect) })
  return S
}

export function groundOptions(p, rect) {
  return { pitch: Math.max(0.8, Math.min(2.2, Math.min(rect.w, rect.h) * 0.06)) }
}

export default {
  name: 'cicada', label: 'Cicada', schema, presets, draw, groundOptions,
  symmetric: false, facing: true, plaque: { w: 90, h: 30 },
}
