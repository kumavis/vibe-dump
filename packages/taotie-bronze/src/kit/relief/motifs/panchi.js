// Panchi 蟠螭 interlace — atlas entry for relief/panchi.js: an Eastern Zhou pattern-block unit tiled in rows
// (Nezu hu 90099), with the plain and twisted cords that bound the bands. Rows alternate mirrored and shifted
// half a block, as the stamped rows of the hu do.

import { panchiBand, ropeCord, plainCord } from '../panchi.js'

const E = (options, def, label) => ({ type: 'enum', options, default: def, label })
const R = (min, max, step, def, label, unit) => ({ type: 'range', min, max, step, default: def, label, ...(unit ? { unit } : {}) })

export const schema = {
  unit: E(['nezu-hu'], 'nezu-hu', 'Unit'),
  rows: R(1, 6, 1, 3, 'Rows'),
  rib: R(0.8, 4, 0.05, 2.2, 'Band width', 'mm'),
  height: R(0.3, 3, 0.05, 1.7, 'Relief', 'mm'),
  section: E(['plateau', 'dome'], 'plateau', 'Band section'),
  shoulder: R(0.3, 2, 0.05, 0.8, 'Shoulder (round section = band / 2)', 'mm'),
  knob: R(0.6, 3, 0.05, 1.35, 'Knob radius', 'mm'),
  alternate: { type: 'bool', default: true, label: 'Alternate rows (mirror, half-block shift)' },
  jitter: R(0, 1, 0.01, 0.35, 'Hand variation per impression', 'mm'),
  wobble: R(0, 0.6, 0.01, 0.14, 'Line drift per impression', 'mm'),
  cords: E(['rope', 'plain', 'none'], 'rope', 'Bounding cords'),
  seed: R(0, 99, 1, 7, 'Seed'),
}

export const presets = {
  // Nezu hu 90099: a 48 × 17.6 mm block of slender (≈ 2.2 mm) round-shouldered strands, dense loops, pellets; coarse ropes
  'nezu-hu': {},
  'nezu-hu-band': { rows: 4, cords: 'rope' },
  'thin-ribs': { rib: 1.6, height: 1.0, shoulder: 0.8, knob: 1.2, cords: 'plain', section: 'dome', wobble: 0 },
}

export function draw(panel, rect, p) {
  const cordH = p.cords === 'none' ? 0 : 5
  const band = { x: rect.x, y: rect.y + cordH, w: rect.w, h: rect.h - 2 * cordH }
  const rows = []
  for (let k = 0; k < p.rows; k++) rows.push({ weight: 1, mirror: p.alternate && k % 2 === 1, shift: p.alternate && k % 2 ? 0.5 : 0 })
  panchiBand(panel, band, { unit: p.unit, rows, rib: p.rib, height: p.height, shoulder: p.shoulder, knob: p.knob, knobHeight: p.height * 1.18, jitter: p.jitter, profile: p.section, wobble: p.wobble, wavelength: 16, swell: 0.08, seed: p.seed })
  if (p.cords !== 'none') {
    for (const y of [rect.y + cordH / 2, rect.y + rect.h - cordH / 2]) {
      if (p.cords === 'rope') ropeCord(panel, { x0: rect.x, x1: rect.x + rect.w, y, width: 3.4, height: 1.6, pitch: 5.5, slant: 58, line: 0.75 })
      else plainCord(panel, { x0: rect.x, x1: rect.x + rect.w, y, width: 2.4, height: 1.2 })
    }
  }
}

export default { name: 'panchi', label: 'Panchi interlace (Eastern Zhou pattern block)', schema, presets, draw, symmetric: false, ground: false, plaque: { w: 96, h: 63 } }
