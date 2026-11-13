// Small Shang birds (鸟纹) — research/01 §4.7.
//
// Small, compact, in profile, facing the centre line; length : height ≈
// 1.3–2 : 1. Hooked beak, round eye (or a small 臣), a SHORT crest (one hook
// or a small T), the wing as a hooked band along the back, the tail turned
// DOWN into a short hook or a fork, one leg with a forward claw. Used like
// kui, in mirrored pairs in narrow neck / foot bands 8–20 mm high.
// Not the long-plumed Western Zhou phoenix (§7 avoid 5): no trailing plumes.
//
// Authored facing +x in a frame of height 1; centred along the rect if the
// rect is longer than the bird.

import { E, R, Pen, Sheet, makeFrame, renderSheet, reliefSchema, withRelief, motifRng, rectClip } from './_strokes.js'

export const schema = {
  arrangement: E(['pair', 'single'], 'pair', 'Arrangement'),
  facing: E(['right', 'left'], 'right', 'Facing (single)'),
  crest: E(['hook', 't', 'none'], 'hook', 'Crest'),
  tail: E(['hook', 'fork'], 'hook', 'Tail'),
  eye: E(['round', 'chen'], 'round', 'Eye'),
  length: R(1.3, 2.2, 0.05, 1.7, 'Length : height'),
  bandWidth: R(0.1, 0.22, 0.01, 0.15, 'Band width (× H)'),
  centreGap: R(0, 15, 0.5, 1.5, 'Gap at centre line', 'mm'),
  ...reliefSchema({ motif: 1.2, boss: 2.4, groove: 0.36, lineWeight: 0.45, echoInset: 0.8, carving: 'sparse' }),
}

export const presets = {
  pair: {},
  single: { arrangement: 'single' },
  't-crest': { crest: 't', tail: 'hook' },
  flush: { style: 'flush', relief: { motif: 0.4, boss: 1.2, groove: 0.35 } },
}

export const presetPlaques = { single: { w: 40, h: 22 } }

/** Marks of one bird facing +x, occupying [x0, x0 + L·1] of a frame of height 1. */
export function buildBird(S, A, p) {
  const L = Math.min(A, p.length)
  const x0 = Math.max(0, A - L - 0.02) // pressed toward the front (the centre line)
  const X = (t) => x0 + t * L // t: 0 tail end → 1 beak tip
  const bw = p.bandWidth
  const sq = 0.5
  // body: a compact teardrop, breast forward, rump high
  const by = 0.46
  const body = []
  for (let i = 0; i <= 48; i++) {
    const a = (i / 48) * Math.PI * 2
    const front = Math.cos(a) > 0
    const rx = (front ? 0.15 : 0.2) * L
    const ry = Math.sin(a) > 0 ? 0.23 : 0.2
    body.push([X(0.58) + Math.cos(a) * rx, by + Math.sin(a) * ry - (front ? 0 : 0.03 * Math.cos(a))])
  }
  S.poly(body)
  // neck + head
  const hc = [X(0.8), 0.72]
  const hr = 0.16
  S.band([[X(0.68), by + 0.08], [hc[0] - 0.03, hc[1] - 0.05]], 0.18)
  S.circle(hc, hr)
  // beak: hooked, tip turned down
  const bk = new Pen(hc[0] + hr * 0.7, hc[1] + 0.02, -5, 0.006).fd(Math.max(0.05, 0.1 * L)).arc(-120, 0.05)
  S.taper(bk.pts, 0.14, 0.03, 0.3)
  // eye
  S.boss(hc, 0.075, { kind: p.eye === 'chen' ? 'oval' : 'round', pupil: 'dot', base: 'plateau', aspect: 1.4 })
  // crest
  if (p.crest === 'hook') {
    const c = new Pen(hc[0] - 0.03, hc[1] + hr * 0.8, 105, 0.006).fd(0.07).arc(90, 0.04).fd(0.02)
    S.taper(c.pts, bw * 0.9, bw * 0.45, 0.4)
  } else if (p.crest === 't') {
    S.band([[hc[0], hc[1] + hr * 0.8], [hc[0], 0.96 - bw * 0.4]], bw * 0.7, 'flat')
    const t = new Pen(hc[0] - 0.08, 0.96 - bw * 0.4 - 0.04, 90, 0.006).fd(0.02).arc(-90, 0.02).fd(0.12).arc(-90, 0.02).fd(0.02)
    S.band(t.pts, bw * 0.7)
  }
  // wing: a hooked band riding the back, its tip curling down over the rump
  const wg = new Pen(X(0.7), by + 0.1, 188, 0.006).fd(0.24 * L).arc(70, 0.07).fd(0.04).arc(110, 0.035)
  S.taper(wg.pts, bw * 1.1, bw * 0.5, 0.55)
  // tail: from the rump, back and DOWN, the end hooking forward (or forked)
  const tl = new Pen(X(0.44), by, 192, 0.006).fd(0.2 * L).arc(62, 0.16).fd(Math.max(0.02, by - 0.3)).arc(150, 0.04)
  S.taper(tl.pts, bw * 1.5, bw * 0.55, 0.35)
  if (p.tail === 'fork') {
    const t2 = new Pen(X(0.4), by + 0.02, 195, 0.006).fd(0.16 * L).arc(-50, 0.05).fd(0.02)
    S.taper(t2.pts, bw * 0.9, bw * 0.4, 0.5)
  }
  // leg + claw, toes forward
  const lg = new Pen(X(0.56), by - 0.12, -95, 0.006).fd(by - 0.12 - 0.12).arc(95, 0.04).fd(0.08).arc(-110, 0.03)
  S.taper(lg.pts, bw * 0.75, bw * 0.4, 0.6)
  return S
}

export function draw(panel, rect, params) {
  const p = withRelief(params)
  const pair = p.arrangement === 'pair'
  const gap = pair ? Math.min(p.centreGap, rect.w * 0.1) : 0
  const r = pair ? { x: rect.x, y: rect.y, w: rect.w / 2 - gap / 2, h: rect.h } : rect
  const f = makeFrame(r, { flip: !pair && p.facing === 'left' })
  const S = new Sheet(f, { rng: motifRng('bird', rect, p), wobble: 0.003 * p.irregularity })
  buildBird(S, f.A, p)
  renderSheet(panel, S, p, { clip: rectClip(pair ? { ...rect, w: rect.w / 2 } : rect) })
  return S
}

export default {
  name: 'bird', label: 'Bird (Shang)', schema, presets, presetPlaques, draw,
  symmetric: (p) => p.arrangement !== 'single', facing: true, plaque: { w: 80, h: 22 },
  groundOptions: (p, rect) => ({ pitch: Math.max(0.8, Math.min(2, rect.h * 0.05)) }),
}
