// Bowstrings (弦纹) and plain raised borders — research/01 §4.6, §5.1.
//
// 1–3 thin raised ribs (1–2 mm wide, 0.5–1 mm high, 3–6 mm apart; ×2 on
// monumental pieces), rounded or flat-topped, running the length of the
// rect. They separate registers and bound décor bands; on "plain" vessels
// they are the only décor. kind 'border' is one broad flat raised band (the
// plain fillet framing a fangding wall or a gu ring); 'step' a single raised
// shelf with a sharp lower edge (the plain ring above a foot).
// Horizontal unless the rect is taller than wide (or `vertical`).

import { E, R } from './_strokes.js'

export const schema = {
  kind: E(['bowstrings', 'border', 'step'], 'bowstrings', 'Kind'),
  count: R(1, 4, 1, 2, 'Ribs'),
  width: R(0.6, 5, 0.1, 1.5, 'Rib width', 'mm'),
  height: R(0.3, 2.5, 0.05, 0.8, 'Rib height', 'mm'),
  spacing: R(2, 12, 0.1, 4.5, 'Spacing (centre to centre)', 'mm'),
  profile: E(['round', 'flat'], 'round', 'Rib top'),
  vertical: { type: 'bool', default: false, label: 'Vertical' },
}

export const presets = {
  'two-bowstrings': {},
  'three-bowstrings': { count: 3, spacing: 4 },
  'single-bowstring': { count: 1 },
  // monumental (Houmuwu-scale): ribs 2–4 mm wide, 1–2 mm high
  monumental: { count: 2, width: 3.2, height: 1.6, spacing: 9, profile: 'flat' },
  // a gu waist: three close ribs either side of the waist (Met 1985.214.4)
  'gu-waist': { count: 3, width: 1.6, height: 1.1, spacing: 3.4 },
  border: { kind: 'border', width: 4, height: 0.9 },
  step: { kind: 'step', width: 5, height: 1.2 },
}

export const presetPlaques = { border: { w: 160, h: 14 }, step: { w: 160, h: 14 } }

const flatTop = (w) => (s) => (s <= 0 ? 0 : Math.min(1, Math.sqrt(Math.min(1, s / Math.min(0.45, w * 0.3)))))
const round = (s, w) => (s <= 0 ? 0 : Math.sqrt(1 - (1 - Math.min(1, s / w)) ** 2))

export function draw(panel, rect, p) {
  const vert = p.vertical || rect.h > rect.w * 1.5
  const span = vert ? rect.w : rect.h
  const c = vert ? rect.x + rect.w / 2 : rect.y + rect.h / 2
  const strip = (ctx, a, w) => {
    ctx.beginPath()
    if (vert) ctx.rect(a - w / 2, rect.y, w, rect.h)
    else ctx.rect(rect.x, a - w / 2, rect.w, w)
    ctx.fill()
  }
  if (p.kind === 'border') {
    const w = Math.min(p.width, span)
    panel.raise((ctx) => strip(ctx, c, w), { height: p.height, profile: flatTop(w) })
    return
  }
  if (p.kind === 'step') {
    // a shelf: flat top, rounded upper arris, crisp lower one
    const w = Math.min(p.width, span)
    panel.raise((ctx) => strip(ctx, c, w), { height: p.height, profile: (s, ww) => (s <= 0 ? 0 : Math.min(1, s / Math.min(0.6, w * 0.25))) })
    return
  }
  const n = p.count | 0
  const sp = Math.min(p.spacing, n > 1 ? (span - p.width) / (n - 1) : p.spacing)
  const c0 = c - (sp * (n - 1)) / 2
  panel.raise((ctx) => { for (let i = 0; i < n; i++) strip(ctx, c0 + i * sp, p.width) }, {
    height: p.height,
    shoulder: p.profile === 'flat' ? Math.min(0.4, p.width * 0.3) : p.width / 2,
    profile: p.profile === 'flat' ? 'plateau' : round,
  })
}

export default { name: 'bands', label: 'Bowstrings & borders', schema, presets, presetPlaques, draw, symmetric: false, ground: false, plaque: { w: 160, h: 16 } }
