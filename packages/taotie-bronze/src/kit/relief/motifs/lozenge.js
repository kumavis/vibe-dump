// Lattice grounds — atlas entry for relief/lozenge.js (research/04 § Grounds).
// A regular lattice of lozenges (or squares) laid over the field and cut off by
// the motif: nested rings (Met gui 62.217 lower field), lozenge-and-spiral,
// lozenge-and-dot, squared spirals in a square lattice. `demo` raises a dummy
// rounded band first so the cut-off is visible.

import { lozengeFill } from '../lozenge.js'
import { roundStroke, carve } from '../rounded.js'

const E = (options, def, label) => ({ type: 'enum', options, default: def, label })
const R = (min, max, step, def, label, unit) => ({ type: 'range', min, max, step, default: def, label, ...(unit ? { unit } : {}) })

export const schema = {
  lattice: E(['diagonal', 'square'], 'diagonal', 'Lattice'),
  size: R(3, 30, 0.5, 9, 'Cell width', 'mm'),
  aspect: R(0.5, 2, 0.05, 1, 'Cell height : width'),
  fill: E(['nested', 'squared', 'spiral', 'dot', 'plain'], 'nested', 'Cell fill'),
  pitch: R(0.5, 2.5, 0.05, 0.9, 'Ring pitch', 'mm'),
  line: R(0.3, 0.7, 0.02, 0.48, 'Groove : pitch'),
  depth: R(0.1, 1, 0.05, 0.4, 'Depth', 'mm'),
  levels: R(0, 3, 1, 2, 'Halvings at the motif'),
  clip: { type: 'bool', default: true, label: 'Cut off at the motif' },
  outline: { type: 'bool', default: true, label: 'Lattice lines' },
  demo: { type: 'bool', default: true, label: 'Dummy motif' },
  seed: R(0, 99, 1, 0, 'Seed'),
}

export const presets = {
  // Met gui 62.217, lower field beside the jaw: one big nested lozenge, ~9 rings at ≈ 1 mm, cut by the motif
  'met-gui-nested': { size: 19, pitch: 1.0, levels: 1, fill: 'nested' },
  'lozenge-spiral': { size: 9, aspect: 0.78, fill: 'spiral', pitch: 0.9, levels: 0 },
  'lozenge-dot': { size: 7, aspect: 0.8, fill: 'dot', pitch: 0.9, levels: 1 },
  'lozenge-nested-fine': { size: 8, fill: 'nested', pitch: 0.7, levels: 1 },
  // the orthogonal twin: 回 cells (squared spirals in a square lattice)
  'square-squared': { lattice: 'square', size: 9, fill: 'squared', pitch: 0.75 },
  'square-nested': { lattice: 'square', size: 10, fill: 'nested', pitch: 0.7, levels: 1 },
}

export function draw(panel, rect, p) {
  if (p.demo) {
    const s = Math.min(rect.w / 60, rect.h / 30)
    const P = (pts) => pts.map(([x, y]) => [rect.x + x * s, rect.y + y * s])
    const band = roundStroke(P([[4, 4], [4, 20], [30, 20], [30, 12], [18, 12]]), { width: 6 * s, round: 0.5, inner: 0.15, end: 'spiral', spiral: { turns: 1, dir: 1 } })
    carve(panel, [band], { height: 1.2, contour: { inset: 0.8, line: 0.45 }, fill: { kind: 'lines', pitch: 1.1, line: 0.42 } })
  }
  lozengeFill(panel, { rect, margin: 0.6 }, {
    lattice: p.lattice, size: [p.size, p.size * p.aspect], fill: p.fill, pitch: p.pitch, line: p.line, depth: p.depth,
    levels: p.levels, clip: p.clip, outline: p.outline, seed: p.seed,
  })
}

export default { name: 'lozenge', label: 'Lattice ground (lozenge / 回)', schema, presets, draw, symmetric: false, ground: false, plaque: { w: 60, h: 30 } }
