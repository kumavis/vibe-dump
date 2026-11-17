// Composed friezes and registers — the compose.js layout helpers shown as
// Motif Atlas plaques (research/01 §5). Each preset is a small, honest piece
// of a mould section: what an artifact author would assemble per wall.
//
//   kui-frieze      a neck band: kui pair facing the centre line (§4.1, §5.1)
//   bird-frieze     the same with small Shang birds (§4.7)
//   cicada-row      cicadas marching toward the centre (§4.2)
//   whorl-kui       shoulder band whorl – kui – whorl … (§4.4)
//   eye-band        目雷纹 between bowstrings (§4.10)
//   neck-belly      kui frieze / bowstrings / taotie / bowstrings / bird frieze
//   blade-row       gu / zun trumpet: rising blades over a cicada frieze (§4.3)
//   houmuwu-wall    a fangding wall: plain field framed by kui friezes, vertical
//                   kui up the sides (Houmuwu ding)
//   boss-belly      gui: eye band over a boss-in-lozenge belly
//   fangyi-face     Met fangyi half-wall pair: kui band / taotie / kui band

import { E } from './_strokes.js'
import { frieze, register, frame } from '../compose.js'

const LAYOUTS = ['kui-frieze', 'bird-frieze', 'cicada-row', 'whorl-kui', 'eye-band', 'neck-belly', 'blade-row', 'houmuwu-wall', 'boss-belly', 'fangyi-face']

export const schema = {
  layout: E(LAYOUTS, 'neck-belly', 'Layout'),
  style: E(['relief', 'flush'], 'relief', 'Style (V relief / IV flush)'),
  fit: { type: 'bool', default: true, label: 'Keep natural proportions' },
}

export const presets = Object.fromEntries(LAYOUTS.map((l) => [l, { layout: l }]))

/** Plaque sizes (mm) matching each layout's real proportions. */
export const presetPlaques = {
  'kui-frieze': { w: 200, h: 34 },
  'bird-frieze': { w: 160, h: 26 },
  'cicada-row': { w: 180, h: 22 },
  'whorl-kui': { w: 220, h: 26 },
  'eye-band': { w: 180, h: 30 },
  'neck-belly': { w: 200, h: 150 },
  'blade-row': { w: 170, h: 150 },
  'houmuwu-wall': { w: 240, h: 118 },
  'boss-belly': { w: 180, h: 120 },
  'fangyi-face': { w: 150, h: 170 },
}

const BOW = { kind: 'bowstrings', count: 2, width: 1.4, height: 0.8, spacing: 3.6 }

/** Fit a layout's natural proportions inside rect (centred), unless `fit` is false. */
function fitted(rect, layout) {
  const nat = presetPlaques[layout]
  if (!nat) return rect
  const k = Math.min(rect.w / nat.w, rect.h / nat.h)
  const w = nat.w * k, h = nat.h * k
  return { x: rect.x + (rect.w - w) / 2, y: rect.y + (rect.h - h) / 2, w, h }
}

export function draw(panel, outer, p) {
  const rect = p.fit === false ? outer : fitted(outer, p.layout)
  const st = { style: p.style }
  switch (p.layout) {
    case 'kui-frieze':
      return frieze(panel, rect, { unit: 'kui', count: 2, facing: 'centre', params: st })
    case 'bird-frieze':
      return frieze(panel, rect, { unit: 'bird', count: 4, facing: 'centre', gap: 2, params: st })
    case 'cicada-row':
      return frieze(panel, rect, { unit: { motif: 'cicada', params: { length: 2.8 } }, count: 6, facing: 'centre', gap: 3, params: st })
    case 'whorl-kui': {
      const w = { motif: 'whorl', w: rect.h * 0.98 }
      return frieze(panel, rect, { unit: [w, { motif: 'kui', params: { quills: 1, crest: 'hook' } }], count: 5, facing: 'centre', centre: w, gap: 1.5, params: st })
    }
    case 'eye-band':
      return register(panel, rect, [{ motif: 'eyeband', params: { ...st, eyes: 4 } }], { separator: BOW, edges: true })
    case 'neck-belly':
      return register(panel, rect, [
        { weight: 0.2, frieze: { unit: 'kui', count: 2, facing: 'centre', params: st } },
        { weight: 0.62, motif: 'taotie', preset: 'T1-classic', params: st },
        { weight: 0.18, frieze: { unit: 'bird', count: 4, facing: 'centre', gap: 2, params: st } },
      ], { separator: BOW })
    case 'blade-row':
      return register(panel, rect, [
        { weight: 0.8, blades: { count: 4, direction: 'rising', gap: 3, params: st } },
        { weight: 0.2, frieze: { unit: { motif: 'cicada', params: { length: 2.8 } }, count: 6, facing: 'centre', gap: 3, params: st } },
      ], { separator: { kind: 'bowstrings', count: 2, width: 1.3, height: 0.8, spacing: 3.2 }, edges: false })
    case 'houmuwu-wall': {
      // proportions of the Houmuwu long wall (~110 × 80 cm): frieze ≈ 0.2 of the
      // wall height, side columns ≈ 0.14 of its width (here at 1:4.6 scale)
      const t = rect.h * 0.2, s = rect.w * 0.14
      return frame(panel, rect, {
        width: { t, b: t, l: s, r: s },
        top: { unit: 'kui', count: 2, facing: 'centre', params: { quills: 2, tail: 'forked', marks: 'c-marks', square: 0.9, ...st }, ground: { pitch: 1.3 } },
        sides: 'kui', sideHeads: 'down', params: { ...st, quills: 1, crest: 'hook' }, ground: { pitch: 1.3 },
      })
    }
    case 'boss-belly':
      return register(panel, rect, [
        { weight: 0.18, motif: 'eyeband', params: { ...st, eyes: 4 } },
        { weight: 0.82, motif: 'boss', params: st },
      ], { separator: BOW, edges: true })
    case 'fangyi-face': {
      // two half-wall mould sections meeting at a centre flange: drawn whole,
      // the taotie and both friezes centred on the rect's axis
      return register(panel, rect, [
        { weight: 0.17, frieze: { unit: 'kui', count: 2, facing: 'centre', params: { ...st, eye: 'square', pupil: 'slit', centreGap: 6 } } },
        { weight: 0.64, motif: 'taotie', preset: 'fangyi-body', params: st },
        { weight: 0.19, frieze: { unit: 'kui', count: 2, facing: 'centre', params: { ...st, eye: 'square', pupil: 'slit', centreGap: 6 } } },
      ], { separator: { kind: 'line', width: 1.2, height: 0.7 } })
    }
  }
  return null
}

export default {
  name: 'frieze', label: 'Friezes & registers (composed)', schema, presets, presetPlaques, draw,
  symmetric: false, ground: false, plaque: { w: 200, h: 150 },
}
