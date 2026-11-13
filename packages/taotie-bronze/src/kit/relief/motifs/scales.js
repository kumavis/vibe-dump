// Scale band (鳞纹) — research/01 §4.11.
//
// Overlapping U / ∩ scales in staggered rows, scale width ≈ 2–4 leiwen
// pitches. In Shang it belongs ON creature bodies (dragons and snakes on pan
// basins, handles, some kui), never as an all-over vessel pattern (that is
// Zhou). Rendered as a raised body band whose top is cut with the scales;
// use it inside a body outline or as a narrow band on a handle.

import { E, R, reliefSchema, withRelief } from './_strokes.js'

export const schema = {
  scale: R(2, 8, 0.1, 3.6, 'Scale width', 'mm'),
  open: E(['down', 'up'], 'down', 'Scales open'),
  body: { type: 'bool', default: true, label: 'Raised body band' },
  ...reliefSchema({ motif: 1.2, boss: 2, groove: 0.38, lineWeight: 0.45, carving: 'none' }),
}

export const presets = { standard: {}, fine: { scale: 2.6 }, 'handle-band': { scale: 3, open: 'up' } }

export function draw(panel, rect, params) {
  const p = withRelief(params)
  const flush = p.style === 'flush'
  const H = flush ? 0.12 : p.relief.motif
  if (p.body) panel.raise((ctx) => { ctx.beginPath(); ctx.rect(rect.x, rect.y, rect.w, rect.h); ctx.fill() }, { height: H, shoulder: Math.min(0.5, H * 0.4) })
  const s = p.scale
  const rh = s * 0.62 // row height
  const sg = p.open === 'down' ? 1 : -1
  panel.sink((ctx) => {
    ctx.save()
    ctx.beginPath(); ctx.rect(rect.x + 0.6, rect.y + 0.6, rect.w - 1.2, rect.h - 1.2); ctx.clip()
    ctx.lineWidth = p.lineWeight
    ctx.lineCap = 'round'
    const rows = Math.ceil(rect.h / rh) + 1
    for (let j = 0; j < rows; j++) {
      const y = rect.y + j * rh
      const off = (j % 2) * s / 2
      for (let x = rect.x - s + off; x < rect.x + rect.w + s; x += s) {
        ctx.beginPath()
        // an arch: the scale's free edge
        ctx.arc(x + s / 2, y, s / 2 - p.lineWeight * 0.3, sg > 0 ? Math.PI : 0, sg > 0 ? 2 * Math.PI : Math.PI)
        ctx.stroke()
      }
    }
    ctx.restore()
  }, { depth: p.relief.groove, shoulder: p.lineWeight / 2, profile: 'u' })
}

export default { name: 'scales', label: 'Scale band', schema, presets, draw, symmetric: false, ground: false, plaque: { w: 120, h: 24 } }
