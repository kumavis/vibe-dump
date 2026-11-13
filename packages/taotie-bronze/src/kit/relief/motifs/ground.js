// STATUS: first pass — leiwen ground on its own, as an atlas entry, so the
// leiwen specialist can tune the packing without a mask in the way.

export const schema = {
  pitch: { type: 'range', min: 0.8, max: 3, step: 0.05, default: 1.6, label: 'Pitch', unit: 'mm' },
  cellMin: { type: 'range', min: 3, max: 12, step: 0.5, default: 6, label: 'Cell min', unit: 'mm' },
  cellMax: { type: 'range', min: 6, max: 24, step: 0.5, default: 14, label: 'Cell max', unit: 'mm' },
  roundness: { type: 'range', min: 0, max: 1, step: 0.05, default: 0.25, label: 'Roundness' },
  jitter: { type: 'range', min: 0, max: 0.3, step: 0.01, default: 0.08, label: 'Jitter' },
  mode: { type: 'enum', options: ['sunk', 'thread'], default: 'sunk', label: 'Mode' },
  depth: { type: 'range', min: 0.1, max: 1.2, step: 0.05, default: 0.45, label: 'Depth', unit: 'mm' },
}

export const presets = {
  fine: { pitch: 1.2, cellMin: 4, cellMax: 10 },
  standard: {},
  'thread-relief': { mode: 'thread', depth: 0.35, pitch: 1.8 },
}

/** Whole-rect ground (it carries its own symmetry, so nothing to mirror). */
export function draw(panel, rect, p) {
  panel.fillGround(
    { pitch: p.pitch, cell: [p.cellMin, Math.max(p.cellMin, p.cellMax)], roundness: p.roundness, jitter: p.jitter, mode: p.mode, depth: p.depth },
    { rect, avoid: 'raised', margin: 0.6 },
  )
}

export default { name: 'leiwen', label: 'Leiwen ground', schema, presets, draw, symmetric: false, ground: false, plaque: { w: 120, h: 80 } }
