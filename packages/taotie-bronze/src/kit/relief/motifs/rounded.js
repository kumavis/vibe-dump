// Rounded bands — atlas sheets for relief/rounded.js (research/04-motif-inventory.md).
//
// Each preset is a TRACING: control points read in mm off a flattened
// photograph (reference/<id>/faces/*.jpg, 8 px/mm), drawn with the rounded
// vocabulary, at the photograph's scale. `met-fangyi-horn` is the worked
// example of research/04 § How to trace a face; its source crop is
// research/inventory/horn-g-spiral-chain.jpg.
//
// The coordinates below are FACE mm of the source (x from the face's left
// edge, y from its bottom edge) and are shifted onto the rect, so a vessel
// engineer can paste the same numbers into a panel whose origin is that face.

import { roundStroke, roundPlate, carve, pillowBoss } from '../rounded.js'
import { lozengeFill } from '../lozenge.js'
import { leiwenFill } from '../leiwen.js'

const E = (options, def, label) => ({ type: 'enum', options, default: def, label })
const R = (min, max, step, def, label, unit) => ({ type: 'range', min, max, step, default: def, label, ...(unit ? { unit } : {}) })

export const schema = {
  unit: E(['met-fangyi-horn', 'met-fangyi-eye', 'shapes', 'fills', 'met-fangding-band'], 'met-fangyi-horn', 'Traced unit'),
  height: R(0.4, 3, 0.05, 1.2, 'Plateau height', 'mm'),
  depth: R(0.1, 0.8, 0.02, 0.32, 'Groove depth', 'mm'),
  line: R(0.25, 0.9, 0.01, 0.5, 'Line width', 'mm'),
  ground: E(['leiwen-big', 'leiwen', 'lozenge', 'none'], 'leiwen-big', 'Ground'),
  pitch: R(0.5, 2, 0.01, 0.72, 'Ground pitch', 'mm'),
  irregularity: R(0, 2, 0.1, 1, 'Hand irregularity'),
  seed: R(0, 99, 1, 0, 'Seed'),
}

export const presets = {
  'met-fangyi-horn': { unit: 'met-fangyi-horn' },
  'met-fangyi-eye': { unit: 'met-fangyi-eye', height: 2.4 },
  shapes: { unit: 'shapes', ground: 'leiwen', pitch: 0.8 },
  fills: { unit: 'fills', ground: 'none' },
  'met-fangding-band': { unit: 'met-fangding-band', ground: 'leiwen', pitch: 0.9, height: 1.6, line: 0.6 },
}

export const presetPlaques = {
  'met-fangyi-horn': { w: 46, h: 36 },
  'met-fangyi-eye': { w: 34, h: 30 },
  shapes: { w: 132, h: 44 },
  fills: { w: 132, h: 52 },
  'met-fangding-band': { w: 70, h: 40 },
}

/**
 * Met fangyi 1974.268.2, long face (+Z), main mask, the LEFT horn: a fat G —
 * up the outer column, across the top, down the inner column, a short return
 * — whose end rolls into a squared-round block cut with a concentric coil.
 * Face mm of faces/face-long-main.jpg (152 × 100 mm, x 0 at the left edge).
 */
export const MET_FANGYI_HORN = {
  band: {
    ctrl: [[50.4, 57.6], [50.4, 77], [50.4, 83.05], [17.0, 83.05], [17.0, 77], [17.0, 62.8], [22.6, 62.8]],
    width: [9.4, 9.4, 11.1, 10.4, 9.6, 6.4, 6.4],
    round: 0.5, inner: 0.18, start: 'blunt', end: 'flat', capRound: 0.3,
    contour: { inset: [0.6, [1.4, 1.4, 2.5, 2.5, 1.8, 1.6, 1.6]], line: 0.5 },
    ticks: { side: 'right', pitch: 4.2, line: 0.42 },
    fill: { kind: 'spirals', line: 0.5, pitch: 0.95, gap: 0.3, square: 0.3, tail: false, min: 3.6 },
  },
  block: { c: [30.6, 69.8], w: 16, h: 18.6, r: 6, contour: false, fill: { kind: 'coil', pitch: 1.35, line: 0.45, offset: [-1.2, 1.4] } },
  origin: [10, 56], // the plaque's lower-left corner in face mm
}

/** The same mask's left eye: a pillow boss on the ground. Face mm of face-long-main. */
export const MET_FANGYI_EYE = {
  c: [45.1, 36.5], w: 14.4, h: 13.5, round: 0.42, height: 2.4, crown: 0.9,
  slit: { len: 4.8, width: 0.95, depth: 0.7, offset: [-0.5, -0.9] },
  origin: [30, 22],
}

const shift = (pts, dx, dy) => pts.map(([x, y]) => [x + dx, y + dy])

export function draw(panel, rect, params) {
  const p = params
  const lw = p.line
  const carveOpts = { height: p.height, depth: p.depth, irregularity: p.irregularity, seed: p.seed }
  let groundMargin = 0.5
  switch (p.unit) {
    case 'met-fangyi-horn': {
      const H = MET_FANGYI_HORN
      const dx = rect.x - H.origin[0], dy = rect.y - H.origin[1]
      const b = H.band
      const band = roundStroke(shift(b.ctrl, dx, dy), { ...b, contour: { ...b.contour, line: lw }, fill: { ...b.fill, line: lw } })
      const block = roundPlate({ ...H.block, c: [H.block.c[0] + dx, H.block.c[1] + dy] })
      carve(panel, [band, block], carveOpts)
      break
    }
    case 'met-fangyi-eye': {
      const E0 = MET_FANGYI_EYE
      pillowBoss(panel, { ...E0, height: p.height, c: [E0.c[0] + rect.x - E0.origin[0], E0.c[1] + rect.y - E0.origin[1]] })
      break
    }
    case 'shapes': {
      // C, G, S, J, a pointed hook and a rolled end — each a few control points
      const x = rect.x, y = rect.y
      const C = { contour: { inset: 0.9, line: lw }, fill: { kind: 'spirals', line: lw * 0.9, pitch: 0.95, square: 0.25, tail: false, min: 2.6 } }
      const els = [
        // C: open to the right, fat back, flat-ended arms
        roundStroke(shift([[20, 8], [4, 8], [4, 36], [20, 36]], x, y), { width: [6, 8, 8, 6], round: 0.6, inner: 0.2, start: 'blunt', end: 'blunt', ...C }),
        // G: the C whose lower arm turns up and in
        roundStroke(shift([[44, 36], [28, 36], [28, 8], [46, 8], [46, 20], [38, 20]], x, y), { width: [6, 8, 8, 7, 6, 5], round: 0.6, inner: 0.2, start: 'blunt', end: 'round', ...C }),
        // S: two opposite rolled ends on a diagonal body
        roundStroke(shift([[58, 33], [66, 33], [78, 11], [86, 11]], x, y), { width: [5, 7, 7, 5], round: 0.8, inner: 0.3, start: 'spiral', end: 'spiral', spiral: { turns: 0.6, dir: 1, gap: 0.7 }, startSpiral: { turns: 0.6, dir: -1, gap: 0.7 }, contour: { inset: 0.8, line: lw }, fill: { kind: 'lines', line: lw * 0.9, pitch: 1.2 } }),
        // J: a straight shank that hooks round at the bottom, tapering
        roundStroke(shift([[96, 38], [96, 10], [106, 6], [110, 14]], x, y), { width: [5, 6, 5, 3], round: 0.9, inner: 0.4, start: 'blunt', end: 'round', contour: { inset: 0.8, line: lw } }),
        // hook to a point (quill / claw / fang)
        roundStroke(shift([[116, 6], [116, 28], [128, 34], [128, 24]], x, y), { width: [6, 6, 4.5, 1], round: 0.7, inner: 0.3, start: 'blunt', end: 'point', contour: { inset: 0.8, line: lw } }),
      ]
      carve(panel, els, carveOpts)
      break
    }
    case 'fills': {
      // the same C band, cut five ways: contour only · spirals · lines · scales · leiwen (+ ticks on the outside)
      const x = rect.x, y = rect.y
      const kinds = [
        { contour: { inset: 0.9, line: lw }, fill: null },
        { contour: { inset: [2.2, 0.7], line: lw }, ticks: { side: 'left', pitch: 2.6, line: lw * 0.85 }, fill: { kind: 'spirals', line: lw, pitch: 0.95, square: 0.3, tail: false, min: 3 } },
        { contour: { inset: 0.8, line: lw }, fill: { kind: 'lines', line: lw * 0.9, pitch: 1.25 } },
        { contour: { inset: 0.8, line: lw }, fill: { kind: 'scales', line: lw * 0.85, pitch: 2.4 } },
        { contour: { inset: 0.8, line: lw }, fill: { kind: 'leiwen', pitch: 0.8, line: 0.45 } },
      ]
      const els = kinds.map((k, i) => roundStroke(shift([[i * 26 + 22, 6], [i * 26 + 4, 6], [i * 26 + 4, 46], [i * 26 + 22, 46]], x, y), { width: 9, round: 0.55, inner: 0.15, start: 'blunt', end: 'blunt', ...k }))
      carve(panel, els, carveOpts)
      break
    }
    case 'met-fangding-band': {
      // Met fangding (detail-mask-long): a plump, plain plateau whose top carries ONE sunk contour
      // line and a few free incised hooks; the end swells and rolls in. Read by eye (no flattened face).
      const x = rect.x, y = rect.y
      const body = roundStroke(shift([[7, 8], [7, 31], [40, 31], [53, 24], [53, 17]], x, y), {
        width: [9, 11, 10, 9.5, 8.5], round: [0.5, 0.7, 0.9, 0.9, 0.5], inner: 0.25, start: 'blunt', end: 'spiral', spiral: { turns: 0.75, dir: -1, gap: 0.9 },
        contour: { inset: 1.1, line: lw },
      })
      const eye = roundPlate({ c: [x + 26, y + 16], w: 14, h: 10, r: 4, contour: { inset: 1, line: lw } })
      carve(panel, [body, eye], carveOpts)
      pillowBoss(panel, { c: [x + 26, y + 16], w: 8.5, h: 6.4, round: 0.55, height: p.height * 1.6, base: 'field', crown: 0.8, slit: { len: 3, width: 0.7, depth: 0.5 } })
      groundMargin = 0.6
      break
    }
  }
  if (p.ground === 'leiwen-big') leiwenFill(panel, { rect, margin: groundMargin }, { pitch: p.pitch, depth: 0.3, line: 0.5, cell: [6, 11], pairs: 0, maxAspect: 1.35, jitter: 0.05, seed: p.seed })
  else if (p.ground === 'leiwen') leiwenFill(panel, { rect, margin: groundMargin }, { pitch: p.pitch, depth: 0.3, seed: p.seed })
  else if (p.ground === 'lozenge') lozengeFill(panel, { rect, margin: groundMargin }, { size: 9, fill: 'nested', pitch: p.pitch * 1.2, seed: p.seed })
}

export default {
  name: 'rounded', label: 'Rounded bands (traced)', schema, presets, presetPlaques, draw,
  symmetric: false, ground: false, plaque: { w: 46, h: 36 },
}
