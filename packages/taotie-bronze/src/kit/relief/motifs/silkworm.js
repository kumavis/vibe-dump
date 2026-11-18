// Silkworm (蚕纹) — research/01 §4.9.
//
// A short, fat, slightly curved band with 4–8 transverse segments, a round
// head with two small eyes. Narrow bands around feet and lips; usually a
// row of them, all one way or facing the centre (compose.frieze).

import { E, R, Sheet, makeFrame, renderSheet, reliefSchema, withRelief, motifRng, rectClip } from './_strokes.js'

export const schema = {
  facing: E(['right', 'left'], 'right', 'Facing'),
  segments: R(3, 9, 1, 6, 'Segments'),
  bend: R(-0.25, 0.25, 0.01, 0.1, 'Bend'),
  girth: R(0.35, 0.7, 0.01, 0.5, 'Girth (× H)'),
  ...reliefSchema({ motif: 1.2, boss: 2, groove: 0.38, lineWeight: 0.5, echoInset: 0.8, carving: 'none' }),
}

export const presets = { standard: {}, straight: { bend: 0, segments: 7 }, flush: { style: 'flush', relief: { motif: 0.35, boss: 1, groove: 0.35 } } }

export function draw(panel, rect, params) {
  const p = withRelief(params)
  const f = makeFrame(rect, { flip: p.facing === 'left' })
  const S = new Sheet(f, { rng: motifRng('silkworm', rect, p), wobble: 0.003 * p.irregularity })
  const A = f.A
  const g = p.girth
  const hr = g * 0.55
  const x0 = g * 0.5 + 0.04, x1 = A - hr * 2 - 0.02
  const Y = (t) => 0.5 - p.bend * Math.sin(Math.PI * t) + p.bend * 0.5
  const spine = []
  for (let i = 0; i <= 60; i++) { const t = i / 60; spine.push([x0 + (x1 - x0) * t, Y(t)]) }
  S.taper(spine, g * 0.75, g, 0.0)
  const hc = [A - hr - 0.02, Y(1) + 0.02]
  S.circle(hc, hr)
  S.boss([hc[0] + hr * 0.25, hc[1] + hr * 0.35], hr * 0.22, { kind: 'round', pupil: 'none', base: 'plateau' })
  S.boss([hc[0] + hr * 0.25, hc[1] - hr * 0.35], hr * 0.22, { kind: 'round', pupil: 'none', base: 'plateau' })
  // transverse segment grooves
  const n = p.segments | 0
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 1)
    const x = x0 + (x1 - x0) * t
    const w = (g * (0.75 + 0.25 * t)) / 2 * 0.9
    S.line([[x - 0.03, Y(t) + w], [x + 0.03, Y(t)], [x - 0.03, Y(t) - w]])
  }
  S.line([[hc[0] - hr * 0.95, hc[1] + hr * 0.7], [hc[0] - hr * 0.95, hc[1] - hr * 0.7]])
  renderSheet(panel, S, p, { clip: rectClip(rect) })
  return S
}

export default { name: 'silkworm', label: 'Silkworm', schema, presets, draw, symmetric: false, facing: true, plaque: { w: 60, h: 18 } }
