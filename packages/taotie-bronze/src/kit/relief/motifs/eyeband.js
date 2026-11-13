// Eye-and-diagonal band (目雷纹 / 斜角目雷纹) — research/01 §4.10.
//
// A horizontal band 10–20 mm high with repeated eyes (臣 or round), each
// flanked by diagonal strips of leiwen at about 45°, alternating in mirrored
// pairs: eye — "\" — "/" — eye. Typical of ding / gui necks and gu middles in
// Yinxu I–II. Built here as raised eye sockets with boss eyes and narrow
// raised diagonal ribs; the triangles between the ribs take the leiwen
// ground (drawMotif fills it). Symmetric by construction about the band centre.

import { E, R, Sheet, makeFrame, renderSheet, reliefSchema, withRelief, motifRng, rectClip } from './_strokes.js'

export const schema = {
  eyes: R(1, 12, 1, 4, 'Eyes'),
  eye: E(['chen', 'round'], 'chen', 'Eye'),
  eyeSize: R(0.6, 1.4, 0.05, 1, 'Eye size'),
  slope: R(30, 60, 1, 45, 'Diagonal angle', '°'),
  rib: R(0.06, 0.2, 0.01, 0.1, 'Rib width (× H)'),
  ...reliefSchema({ motif: 1.1, boss: 2.2, groove: 0.35, lineWeight: 0.45, echoInset: 0.8, carving: 'none' }),
}

export const presets = {
  chen: {},
  round: { eye: 'round', eyes: 5 },
  flush: { style: 'flush', relief: { motif: 0.35, boss: 1.1, groove: 0.35 } },
}

export function draw(panel, rect, params) {
  const p = withRelief(params)
  const f = makeFrame(rect)
  const A = f.A
  const S = new Sheet(f, { rng: motifRng('eyeband', rect, p), wobble: 0.003 * p.irregularity })
  const n = Math.max(1, p.eyes | 0)
  const U = A / n
  const rib = p.rib
  const dx = 1 / Math.tan((p.slope * Math.PI) / 180) // run of a diagonal over the band height
  const er = 0.17 * p.eyeSize
  const ew = p.eye === 'chen' ? er * 1.6 : er // half-length of the eye socket
  for (let i = 0; i < n; i++) {
    const cx = (i + 0.5) * U
    // eye socket (an almond plateau) + boss + canthus hooks
    if (p.eye === 'chen') {
      S.plateau.push({ kind: 'ellipse', c: f.map([cx, 0.5]), rx: f.unit * ew * 1.15, ry: f.unit * er * 1.35, rot: 0 })
      S.band([[cx - ew * 1.1, 0.5], [cx - ew * 1.5, 0.5], [cx - ew * 1.5, 0.36]], rib * 0.9)
      S.band([[cx + ew * 1.1, 0.5], [cx + ew * 1.5, 0.5], [cx + ew * 1.5, 0.36]], rib * 0.9)
    } else {
      S.circle([cx, 0.5], er * 1.45)
    }
    S.boss([cx, 0.5], er, { kind: p.eye === 'chen' ? 'oval' : 'round', aspect: 1.5, pupil: 'dot', base: 'plateau' })
  }
  // diagonals: between eye i and i+1 a "\" then a "/" meeting low at the midpoint
  const top = 0.94, bot = 0.06
  for (let i = 0; i <= n; i++) {
    const m = i * U // midpoint between eyes (band ends at i = 0 and i = n)
    const run = Math.min(dx * (top - bot), U / 2 - ew * 1.6)
    if (i > 0) S.band([[m - run, top], [m - 0.02, bot]], rib, 'flat')
    if (i < n) S.band([[m + 0.02, bot], [m + run, top]], rib, 'flat')
  }
  renderSheet(panel, S, p, { clip: rectClip(rect) })
  return S
}

export default {
  name: 'eyeband', label: 'Eye-and-diagonal band', schema, presets, draw,
  symmetric: false, plaque: { w: 180, h: 18 },
  groundOptions: (p, rect) => ({ pitch: Math.max(0.7, Math.min(1.6, rect.h * 0.06)) }),
}
