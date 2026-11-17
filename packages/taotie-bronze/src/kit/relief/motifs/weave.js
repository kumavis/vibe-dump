// Woven interlace 蟠螭文 — atlas entry for relief/weave.js: a unit cell (dragon in a G-frame, scroll, crossed ring,
// interlocked-ring chain) tiled over a band or panel, ribbons of n ribs with a real over-under at every crossing.
// Presets: the zones of the Nezu bo 90120 (reference/nezu-bo), each at the panel size it was matched at.

import { weaveFill, WEAVE_PRESETS, WEAVE_UNITS } from '../weave.js'

const E = (options, def, label) => ({ type: 'enum', options, default: def, label })
const R = (min, max, step, def, label, unit) => ({ type: 'range', min, max, step, default: def, label, ...(unit ? { unit } : {}) })

export const schema = {
  zone: E(['custom', ...Object.keys(WEAVE_PRESETS)], 'custom', 'Layout (a bell zone, or custom)'),
  unit: E(Object.keys(WEAVE_UNITS), 'dragon', 'Unit cell (custom)'),
  headVariant: E(['band', 'panel', 'field'], 'band', 'Head (custom)'),
  tilingX: E(['repeat', 'mirror', 'flip', 'rotate'], 'mirror', 'Every second cell along (custom)'),
  tilingY: E(['repeat', 'mirror', 'flip', 'rotate'], 'flip', 'Every second row (custom)'),
  cellW: R(12, 90, 0.5, 40, 'Cell width', 'mm'),
  cellH: R(10, 60, 0.5, 34, 'Cell height', 'mm'),
  scale: R(0.5, 1.6, 0.05, 1, 'Cell size ×'),
  ribs: R(1, 5, 1, 3, 'Ribs per ribbon'),
  rib: R(0.6, 3.5, 0.05, 1.7, 'Rib width', 'mm'),
  groove: R(0.2, 1.4, 0.05, 0.55, 'Groove width', 'mm'),
  height: R(0.3, 3, 0.05, 1.1, 'Relief height', 'mm'),
  depth: R(0.1, 1.2, 0.05, 0.45, 'Groove depth', 'mm'),
  gap: R(0, 1.5, 0.05, 0.55, 'Shadow gap at a crossing', 'mm'),
  ground: R(0, 1.2, 0.05, 0.5, 'Sunk ground (step down between the ribbons)', 'mm'),
  density: R(0, 2, 1, 1, 'Density (nested ribbons in a frame)'),
  head: R(0.4, 1.4, 0.02, 1, 'Head size'),
  ribStyle: E(['ridge', 'cut'], 'ridge', 'Rib section (round ridges on a plateau | flat ribbon, grooves cut)'),
}

// each bell zone as an atlas preset: the zone's layout + its ribbon numbers
const zone = (k) => {
  const z = WEAVE_PRESETS[k]
  return { zone: k, ribs: z.ribs, rib: z.rib, groove: z.groove, ...(z.height ? { height: z.height } : {}), ...(z.depth ? { depth: z.depth } : {}), ...(z.gap ? { gap: z.gap } : {}), ...(z.ground ? { ground: z.ground.depth } : {}) }
}
export const presets = {
  'bo-top-band': zone('bo-top-band'),
  'bo-centre-panel': zone('bo-centre-panel'),
  'bo-band': zone('bo-band'),
  'bo-field': zone('bo-field'),
  'bo-base-band': zone('bo-base-band'),
  'four-ribs': { unit: 'dragon', ribs: 4, rib: 1.4, cellW: 46, cellH: 38, density: 1 },
  'ring-row': { unit: 'ring', tilingX: 'repeat', cellW: 28, cellH: 30 },
}
export const presetPlaques = Object.fromEntries(Object.keys(WEAVE_PRESETS).map((k) => [k, WEAVE_PRESETS[k].plaque]))

export function draw(panel, rect, p) {
  const k = p.scale
  const common = { ribs: p.ribs, rib: p.rib * k, groove: p.groove * k, height: p.height, depth: p.depth, gap: p.gap, ground: p.ground > 0 ? { depth: p.ground } : null, render: { ribStyle: p.ribStyle } }
  if (p.zone !== 'custom' && WEAVE_PRESETS[p.zone]) {
    const z = WEAVE_PRESETS[p.zone]
    const cell = z.cell.map((v) => v * k)
    const params = { ...(z.params || {}), ...(p.unit === 'dragon' ? { nest: z.params?.nest ?? p.density } : {}) }
    if (p.head !== 1) params.head = (params.head ?? 1) * p.head
    if (z.sequence) {
      // a column: centred, one column wide (two columns on the plaque, the second REPEATING the first)
      const cw = cell[0], x0 = rect.x + rect.w / 2 - cw
      for (const dx of [0, cw + 0.5]) weaveFill(panel, { x: x0 + dx, y: rect.y, w: cw, h: rect.h }, { ...z, ...common, cell, params })
      return
    }
    weaveFill(panel, rect, { ...z, ...common, cell, params, count: [Math.max(1, Math.round(rect.w / cell[0])), Math.max(1, Math.round(rect.h / cell[1]))] })
    return
  }
  const cell = [p.cellW * k, p.cellH * k]
  weaveFill(panel, rect, {
    unit: p.unit, cell, tiling: { x: p.tilingX, y: p.tilingY }, ...common,
    params: { nest: p.density, head: p.head, headVariant: p.headVariant, closed: p.unit === 'dragon' && p.tilingX !== 'mirror' },
    count: [Math.max(1, Math.round(rect.w / cell[0])), Math.max(1, Math.round(rect.h / cell[1]))],
  })
}

export default {
  name: 'weave', label: 'Woven interlace (panchi ribbons, over-under)', schema, presets, presetPlaques, draw,
  symmetric: false, ground: false, plaque: { w: 160, h: 70 },
}
