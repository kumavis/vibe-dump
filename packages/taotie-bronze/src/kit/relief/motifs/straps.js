// Crossing straps with pyramidal studs (十字帯 + 乳丁) — atlas entry (research/04 § Straps and studs).
// Western Zhou hu (the Nezu phoenix fanghu 90097-98): broad flat straps divide the belly into four cartouches, a
// horizontal strap round the belly and a vertical one down each face; a four-sided pyramid (a lozenge in plan, taller
// than wide) stands on every crossing and a three-sided one (a level top facet, the apex pointing down) where the
// vertical strap leaves the shoulder band. On the vessel the studs are GEOMETRY (nezu-fanghu/sculpture.js
// studGeometry); in the atlas they are drawn as relief: a 'ridge' profile over a lozenge / triangle is a pyramid.

import { rrectPath } from '../ribbon.js'

const R = (min, max, step, def, label, unit) => ({ type: 'range', min, max, step, default: def, label, ...(unit ? { unit } : {}) })

export const schema = {
  strap: R(10, 60, 1, 32, 'Strap width', 'mm'),
  lift: R(0, 3, 0.1, 0, 'Strap lift', 'mm'),
  edge: R(0, 3, 0.1, 2.8, 'Cartouche channel', 'mm'),
  studW: R(10, 80, 1, 50, 'Diamond width', 'mm'),
  studH: R(10, 90, 1, 58, 'Diamond height', 'mm'),
  studRise: R(1, 30, 0.5, 8, 'Stud rise (relief)', 'mm'),
  triangle: { type: 'bool', default: true, label: 'Triangle stud at the top' },
  radius: R(0, 30, 1, 12, 'Cartouche corner radius', 'mm'),
}

export const presets = {
  'nezu-fanghu': {},
  'plain-cross': { triangle: false, studRise: 6, studW: 36, studH: 36 },
}

export function draw(panel, rect, p) {
  const cx = rect.x + rect.w / 2, cy = rect.y + rect.h * 0.42
  const half = p.strap / 2
  // the cartouches: four rounded rectangles cut round by a channel; the straps are what is left between them
  const fields = [
    [rect.x + 3, cy + half, cx - half, rect.y + rect.h - 14], [cx + half, cy + half, rect.x + rect.w - 3, rect.y + rect.h - 14],
    [rect.x + 3, rect.y + 3, cx - half, cy - half], [cx + half, rect.y + 3, rect.x + rect.w - 3, cy - half],
  ]
  const rr = (ctx, f, r) => { ctx.beginPath(); rrectPath(f, r).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath() }
  if (p.lift > 0) panel.raise((ctx) => { ctx.fillRect(rect.x, rect.y, rect.w, rect.h); for (const f of fields) { rr(ctx, f, p.radius); ctx.fill() } }, { height: p.lift, shoulder: 1, profile: 'plateau' })
  if (p.edge > 0) panel.sink((ctx) => { ctx.lineWidth = p.edge; for (const f of fields) { rr(ctx, f, p.radius); ctx.stroke() } }, { depth: 1.6, shoulder: p.edge * 0.45, profile: 'u' })
  // the diamond on the crossing (taller than wide), the triangle under the top band
  panel.raise((ctx) => {
    ctx.beginPath(); ctx.moveTo(cx, cy + p.studH / 2); ctx.lineTo(cx + p.studW / 2, cy); ctx.lineTo(cx, cy - p.studH / 2); ctx.lineTo(cx - p.studW / 2, cy); ctx.closePath(); ctx.fill()
  }, { height: p.studRise, profile: 'ridge' })
  if (p.triangle) {
    const ty = rect.y + rect.h - 4, tw = p.strap * 1.35
    panel.raise((ctx) => { ctx.beginPath(); ctx.moveTo(cx - tw / 2, ty); ctx.lineTo(cx + tw / 2, ty); ctx.lineTo(cx, ty - tw * 0.55); ctx.closePath(); ctx.fill() }, { height: p.studRise * 0.75, profile: 'ridge' })
  }
}

export default { name: 'straps', label: 'Crossing straps & pyramidal studs', schema, presets, draw, symmetric: false, ground: false, plaque: { w: 150, h: 130 } }
