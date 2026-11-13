// STATUS: first pass — register / panel layout helpers. Extend freely; keep
// the existing function signatures.
//
// A Shang vessel's décor is laid out like its piece-mould: horizontal
// registers, each split by flanges into panels, each panel a mirrored unit on
// a leiwen ground. These helpers do that bookkeeping in panel mm.

import { getMotif, resolveMotifParams } from './motifs/index.js'

/**
 * Draw one motif unit into rect: motif.draw (left half) → leiwen ground on the
 * left half → mirror. Motifs with `symmetric: false` draw the whole rect and
 * are not mirrored; motifs with `ground: false` get no leiwen.
 * @returns the resolved params actually used
 */
export function drawMotif(panel, motif, rect, params = {}, { preset, ground = {}, margin = 0.6 } = {}) {
  const m = getMotif(motif)
  const p = resolveMotifParams(m, params, preset)
  const symmetric = m.symmetric !== false
  m.draw(panel, rect, p)
  if (ground !== false && m.ground !== false) {
    const half = symmetric ? { x: rect.x, y: rect.y, w: rect.w / 2, h: rect.h } : rect
    panel.fillGround(ground, { rect: half, margin })
  }
  if (symmetric) panel.mirrorX(rect)
  return p
}

/** Stack named registers bottom-up: [{ name, h }] (mm) → { name: rect }. */
export function registers(rect, spec) {
  const out = {}
  let y = rect.y
  for (const r of spec) {
    out[r.name] = { x: rect.x, y, w: rect.w, h: r.h }
    y += r.h
  }
  return out
}

/** Inset a rect by mm (number or {l,r,t,b}). */
export function inset(rect, m) {
  const o = typeof m === 'number' ? { l: m, r: m, t: m, b: m } : { l: 0, r: 0, t: 0, b: 0, ...m }
  return { x: rect.x + o.l, y: rect.y + o.b, w: rect.w - o.l - o.r, h: rect.h - o.t - o.b }
}

/** Repeat a motif `count` times across rect (a frieze). */
export function frieze(panel, rect, motif, count, params = {}, opts = {}) {
  const w = rect.w / count
  for (let i = 0; i < count; i++) drawMotif(panel, motif, { x: rect.x + i * w, y: rect.y, w, h: rect.h }, params, opts)
}

/**
 * A row of bosses ("nipples", rupi) from a to b. Shang fangding frame their
 * walls with these, cast as hemispheres standing proud of the ground.
 */
export function bossRow(panel, a, b, { count, radius = 4, height = 3 } = {}) {
  const n = count ?? Math.max(1, Math.floor(Math.hypot(b[0] - a[0], b[1] - a[1]) / (radius * 3)))
  panel.raise((ctx) => {
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : (i + 0.5) / n
      ctx.beginPath()
      ctx.arc(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }, { height, profile: 'dome' })
}

/** A raised border line around (or along one side of) a rect. Thread relief framing a register. */
export function borderLine(panel, rect, { width = 1.2, height = 0.6, sides = 'tb' } = {}) {
  panel.raise((ctx) => {
    ctx.lineWidth = width
    ctx.lineCap = 'butt'
    ctx.beginPath()
    if (sides.includes('b')) { ctx.moveTo(rect.x, rect.y); ctx.lineTo(rect.x + rect.w, rect.y) }
    if (sides.includes('t')) { ctx.moveTo(rect.x, rect.y + rect.h); ctx.lineTo(rect.x + rect.w, rect.y + rect.h) }
    if (sides.includes('l')) { ctx.moveTo(rect.x, rect.y); ctx.lineTo(rect.x, rect.y + rect.h) }
    if (sides.includes('r')) { ctx.moveTo(rect.x + rect.w, rect.y); ctx.lineTo(rect.x + rect.w, rect.y + rect.h) }
    ctx.stroke()
  }, { height, profile: 'ridge' })
}
