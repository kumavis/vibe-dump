// Pillow eye boss — atlas entry for relief/rounded.js pillowBoss (research/04 § Eyes).
// A convex rounded rectangle, steep at the foot, softly domed, with a short sunk
// slit pupil: the eye of the Met fangyi, the Met gui and the Met fangding.

import { pillowBoss } from '../rounded.js'
import { leiwenFill } from '../leiwen.js'

const E = (options, def, label) => ({ type: 'enum', options, default: def, label })
const R = (min, max, step, def, label, unit) => ({ type: 'range', min, max, step, default: def, label, ...(unit ? { unit } : {}) })

export const schema = {
  w: R(3, 40, 0.1, 14.4, 'Width', 'mm'),
  h: R(3, 40, 0.1, 13.5, 'Height', 'mm'),
  round: R(0, 1, 0.01, 0.42, 'Roundness (1 = ellipse)'),
  height: R(0.5, 8, 0.1, 2.4, 'Relief', 'mm'),
  crown: R(0, 1, 0.05, 0.9, 'Crown (0 flat top … 1 domed)'),
  slit: { type: 'bool', default: true, label: 'Slit pupil' },
  slitLen: R(0.1, 0.8, 0.01, 0.33, 'Slit length (× width)'),
  slitWidth: R(0.3, 3, 0.05, 0.95, 'Slit width', 'mm'),
  slitY: R(-0.3, 0.3, 0.01, -0.07, 'Slit offset (× height)'),
  ring: { type: 'bool', default: false, label: 'Sunk ring' },
  ground: E(['leiwen-big', 'leiwen', 'none'], 'leiwen-big', 'Ground'),
  pitch: R(0.5, 2, 0.01, 0.72, 'Ground pitch', 'mm'),
}

export const presets = {
  // Met fangyi 1974.268.2 main mask (face-long-main: 14.4 × 13.5 mm, slit 4.8 × 0.95, left of and below centre)
  'met-fangyi': {},
  // Met fangyi lid / foot friezes: the small square boss of the kui (≈ 5.5 × 5 mm)
  'met-fangyi-kui': { w: 5.6, h: 5, round: 0.5, height: 1.5, slitLen: 0.45, slitWidth: 0.6, slitY: 0, pitch: 0.6 },
  // Met gui 62.217: a broader, rounder oval with a short slit (by eye, ≈ 1:1.35)
  'met-gui': { w: 15, h: 11, round: 0.75, crown: 1, slitLen: 0.22, slitWidth: 0.9, slitY: 0 },
  // Met fangding (detail-mask-long): wide rounded rectangle, slit across the middle
  'met-fangding': { w: 16, h: 11, round: 0.55, crown: 0.75, slitLen: 0.28, slitWidth: 0.8, slitY: 0, pitch: 0.9 },
  ringed: { w: 12, h: 10, round: 0.6, ring: true, slitLen: 0.3 },
}

export function draw(panel, rect, p) {
  const c = [rect.x + rect.w / 2, rect.y + rect.h / 2]
  pillowBoss(panel, {
    c, w: p.w, h: p.h, round: p.round, height: p.height, crown: p.crown,
    slit: p.slit ? { len: p.w * p.slitLen, width: p.slitWidth, depth: Math.min(0.9, p.height * 0.3), offset: [-p.w * 0.035, p.h * p.slitY] } : false,
    ring: p.ring ? { gap: 0.9, line: 0.45, depth: 0.35 } : false,
  })
  if (p.ground === 'leiwen-big') leiwenFill(panel, { rect, margin: 0.5 }, { pitch: p.pitch, depth: 0.3, line: 0.5, cell: [6, 11], pairs: 0, maxAspect: 1.35, jitter: 0.05 })
  else if (p.ground === 'leiwen') leiwenFill(panel, { rect, margin: 0.5 }, { pitch: p.pitch, depth: 0.3 })
}

export default { name: 'pillow', label: 'Pillow eye boss', schema, presets, draw, symmetric: false, ground: false, plaque: { w: 34, h: 30 } }
