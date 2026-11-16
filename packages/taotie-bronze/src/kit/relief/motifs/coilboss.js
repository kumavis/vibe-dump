// Coiled-serpent boss 盘蛇枚 — atlas entry for relief/coilboss.js (Eastern Zhou bells; Nezu bo 90120).
// A serpent wound ≈ 2 turns into a low dome, each turn a rounded ridge stepped up on the last, the inner turns
// hatched by close oblique ribs, a small beast head on the crown looking out.

import { coilBoss } from '../coilboss.js'

const R = (min, max, step, def, label, unit) => ({ type: 'range', min, max, step, default: def, label, ...(unit ? { unit } : {}) })

export const schema = {
  count: R(1, 3, 1, 1, 'Bosses in a row'),
  r: R(6, 30, 0.5, 17, 'Radius', 'mm'),
  height: R(2, 20, 0.5, 11, 'Height', 'mm'),
  turns: R(1, 3.5, 0.1, 2.1, 'Turns'),
  gap: R(0.05, 0.4, 0.01, 0.16, 'Gap between turns (× pitch)'),
  ridge: R(0, 0.3, 0.01, 0.13, 'Turn swell (× height)'),
  striate: { type: 'bool', default: true, label: 'Hatched body' },
  hatch: R(0.4, 1.6, 0.05, 0.75, 'Hatching pitch', 'mm'),
  head: { type: 'bool', default: true, label: 'Beast head' },
  rot: R(-180, 180, 5, 0, 'Rotation', '°'),
}

export const presets = {
  // Nezu bo 90120 (detail-boss.jpg): ≈ 34 mm across, ≈ 11 mm proud (inferred scale)
  'nezu-bo': {},
  'plain-coil': { head: false, turns: 2.6, striate: false },
  row: { count: 3, r: 12, height: 8, hatch: 0.6 },
}

export function draw(panel, rect, p) {
  const n = Math.max(1, Math.round(p.count))
  const r = Math.min(p.r, rect.h / 2 - 1, rect.w / n / 2 - 1)
  for (let i = 0; i < n; i++) {
    const c = [rect.x + (rect.w * (i + 0.5)) / n, rect.y + rect.h / 2]
    coilBoss(panel, {
      c, r, height: Math.min(p.height, r * 0.9), turns: p.turns, gap: p.gap, ridge: p.ridge, rot: p.rot + i * 35,
      striate: p.striate ? { pitch: p.hatch } : false, head: p.head ? {} : false, hand: i % 2 ? -1 : 1,
    })
  }
}

export default { name: 'coilboss', label: 'Coiled-serpent boss', schema, presets, draw, symmetric: false, ground: false, plaque: { w: 40, h: 40 }, presetPlaques: { row: { w: 90, h: 32 } } }
