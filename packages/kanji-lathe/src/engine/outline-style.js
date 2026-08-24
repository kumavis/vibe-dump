// Render modes that survive being turned into a font.
//
// A canvas mode can do anything — glow, gradients, halftone dots. An installed
// font gets exactly one lever: filled contours under the non-zero winding rule.
// That is less limiting than it sounds, because the engine still has the
// centreline and the per-point width when the outline is built. A hollow glyph
// is not the outer shape "inset" — a genuinely hard problem — it is the same
// stroke outlined a second time at a narrower width, wound backwards so the fill
// rule punches it out. Concentric rings are the same trick repeated.
import { strokeOutline } from './outline.js'

export const FONT_STYLES = [
  { value: 'auto', label: 'Follow the render mode' },
  { value: 'solid', label: 'Solid' },
  { value: 'hollow', label: 'Hollow' },
  { value: 'contour', label: 'Contour rings' },
  { value: 'skeleton', label: 'Skeleton (hairline)' },
]

// Which canvas modes have an honest outline equivalent. Everything absent from
// this table flattens to solid — a gradient or a glow has no meaning in a glyf
// table, and silently exporting a solid glyph beats exporting nothing.
const FROM_RENDER_MODE = {
  hollow: 'hollow',
  contour: 'contour',
  skeleton: 'skeleton',
  wire: 'skeleton',
}

/** Modes the exporter should warn about, because the font cannot carry them. */
export const LOSSY_MODES = new Set(['ribbon', 'order', 'component', 'xray', 'hatch', 'letterpress', 'neon', 'dot'])

export const resolveStyle = (P) => {
  const chosen = P.rdFontStyle || 'auto'
  return chosen === 'auto' ? FROM_RENDER_MODE[P.rdMode] || 'solid' : chosen
}

const HAIRLINE = 11 // em units at 1024upm — thin, but still there at text sizes
const MIN_CORE = 7 // below this the inner contour is thinner than the rasteriser can hold

/** Reverse a closed polygon's direction, which flips how the fill rule reads it. */
function reversed(poly) {
  const n = poly.length
  const out = new Float64Array(n)
  for (let i = 0; i < n; i += 2) {
    out[n - 2 - i] = poly[i]
    out[n - 1 - i] = poly[i + 1]
  }
  return out
}

const scaled = (widths, k, floor) => {
  const out = new Float64Array(widths.length)
  for (let i = 0; i < widths.length; i++) out[i] = Math.max(floor, widths[i] * k)
  return out
}

const inset = (widths, by, floor) => {
  const out = new Float64Array(widths.length)
  for (let i = 0; i < widths.length; i++) out[i] = Math.max(floor, widths[i] - by)
  return out
}

const minOf = (w) => {
  let m = Infinity
  for (let i = 0; i < w.length; i++) if (w[i] < m) m = w[i]
  return m
}

/**
 * Contours for one stroke in the chosen style. Returns polygons wound so that
 * filling the whole glyph with the non-zero rule gives the intended shape.
 */
export function styledStroke(pts, widths, caps, style, { wallRatio = 0.34, minWall = 9, rings = 3 } = {}) {
  const opts = { ...caps, join: 'round', miterLimit: 3, capScale: 1 }
  if (style === 'skeleton') {
    return strokeOutline(pts, scaled(widths, 0, HAIRLINE), { ...opts, capStart: 'round', capEnd: 'round' })
  }
  if (style !== 'hollow' && style !== 'contour') return strokeOutline(pts, widths, opts)

  const wall = Math.max(minWall, minOf(widths) * wallRatio)
  const out = strokeOutline(pts, widths, opts)
  const count = style === 'hollow' ? 1 : Math.max(1, Math.min(6, rings))

  for (let r = 1; r <= count; r++) {
    const w = inset(widths, wall * (2 * r - 1), 0)
    // Once the core is thinner than the rasteriser can hold, further rings are
    // noise: stop rather than emit slivers that fill in at text sizes.
    if (minOf(w) < MIN_CORE) break
    const holes = strokeOutline(pts, w, { ...opts, capStart: 'round', capEnd: 'round' })
    for (const poly of holes) out.push(r % 2 === 1 ? reversed(poly) : poly)
    if (style === 'hollow') break
  }
  return out
}
