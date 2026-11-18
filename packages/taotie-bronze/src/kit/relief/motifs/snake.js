// Snake (蛇纹) — research/01 §4.8.
//
// A triangular head seen from above with two eyes, and a sinuous body band
// carrying rows of C-hooks; or 'coiled': the body wound into a spiral with
// the head at the centre. Narrow bands, handles, the insides of pan basins.
// Authored head toward +x in a frame of height 1.

import { E, R, Pen, Sheet, makeFrame, renderSheet, reliefSchema, withRelief, motifRng, rectClip } from './_strokes.js'

export const schema = {
  form: E(['sinuous', 'coiled'], 'sinuous', 'Form'),
  facing: E(['right', 'left'], 'right', 'Facing'),
  waves: R(0.5, 3, 0.25, 1.5, 'Waves'),
  amplitude: R(0.05, 0.3, 0.01, 0.18, 'Amplitude (× H)'),
  bandWidth: R(0.15, 0.4, 0.01, 0.26, 'Body width (× H)'),
  marks: E(['c-hooks', 'scales', 'none'], 'c-hooks', 'Body marks'),
  ...reliefSchema({ motif: 1.2, boss: 2.2, groove: 0.36, lineWeight: 0.45, echoInset: 0.8, carving: 'sparse' }),
}

export const presets = {
  sinuous: {},
  coiled: { form: 'coiled', marks: 'none' },
  flush: { style: 'flush', relief: { motif: 0.35, boss: 1.1, groove: 0.35 } },
}
export const presetPlaques = { coiled: { w: 50, h: 50 } }

export function draw(panel, rect, params) {
  const p = withRelief(params)
  const f = makeFrame(rect, { flip: p.facing === 'left' })
  const S = new Sheet(f, { rng: motifRng('snake', rect, p), wobble: 0.003 * p.irregularity })
  const bw = p.bandWidth
  let spine, head, hd
  if (p.form === 'coiled') {
    // from the tail outside, winding in toward the head at the centre
    const cx = f.A / 2
    const pen = new Pen(cx + 0.44, 0.5, 90, 0.006).curl(560, 0.44, 0.55, 1)
    spine = pen.pts
    head = pen.at
    hd = pen.h
  } else {
    spine = []
    const x0 = 0.08, x1 = f.A - 0.42
    for (let i = 0; i <= 120; i++) {
      const t = i / 120
      spine.push([x0 + (x1 - x0) * t, 0.5 + p.amplitude * Math.sin(t * p.waves * Math.PI * 2) * Math.min(1, t * 4)])
    }
    head = spine[spine.length - 1]
    hd = 0
  }
  S.taper(spine, bw * 0.3, bw, 0.0)
  // head: a rounded triangle pointing along hd, two eyes
  const a = (hd * Math.PI) / 180
  const ux = Math.cos(a), uy = Math.sin(a)
  const hl = 0.34, hw = 0.24
  const P = (s, t) => [head[0] + ux * s - uy * t, head[1] + uy * s + ux * t]
  S.poly([P(-0.04, hw * 0.55), P(hl * 0.55, hw), P(hl, hw * 0.25), P(hl * 1.06, 0), P(hl, -hw * 0.25), P(hl * 0.55, -hw), P(-0.04, -hw * 0.55)])
  for (const sg of [1, -1]) S.boss(P(hl * 0.5, sg * hw * 0.55), 0.06, { kind: 'round', pupil: 'none', base: 'plateau' })
  // body marks
  if (p.marks !== 'none' && p.form === 'sinuous') {
    for (let i = 8; i < spine.length - 10; i += 9) {
      const [x, y] = spine[i]
      const r = bw * 0.24
      const arc = []
      if (p.marks === 'c-hooks') for (let k = 0; k <= 10; k++) { const b = Math.PI * (0.35 + 1.3 * k / 10); arc.push([x + Math.cos(b) * r, y + Math.sin(b) * r]) }
      else for (let k = 0; k <= 10; k++) { const b = Math.PI * (1 + k / 10); arc.push([x + Math.cos(b) * r, y + r * 0.6 + Math.sin(b) * r]) }
      S.line(arc)
    }
  }
  renderSheet(panel, S, p, { clip: rectClip(rect) })
  return S
}

export default { name: 'snake', label: 'Snake', schema, presets, presetPlaques, draw, symmetric: false, facing: true, plaque: { w: 110, h: 24 } }
