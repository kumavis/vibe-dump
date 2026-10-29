// A new world: schema v1, the seed vocabulary and a starter meadow.
// Positions are fixed (not random) so every fresh world, and the gallery
// thumbnail, opens on the same composition.
import { initDoc, DEFAULT_WORLD } from './schema.js'
import { COMPONENT_DEFS, PRESETS, withOwnMaps } from './presets.js'
import { toDoc, ImmutableString } from './convert.js'

const I = (s) => new ImmutableString(s)

// [id, preset, [x, y, z], yawDeg, scale?]
export const STARTER = Object.freeze([
  ['tree-1', 'tree', [-12, 0, -10], 0, 1.1],
  ['tree-2', 'tree', [10, 0, -12], 40, 0.9],
  ['tree-3', 'tree', [-14, 0, 6], 80, 1.25],
  ['tree-4', 'tree', [13, 0, 8], 120, 1],
  ['tree-5', 'tree', [-4, 0, -14], 160, 1.15],
  ['tree-6', 'tree', [6, 0, 14], 200, 0.95],
  ['rock-1', 'rock', [-7, 0, 3], 30, 1],
  ['rock-2', 'rock', [8, 0, -4], 110, 0.8],
  ['lamp-1', 'lamp', [2, 0, 4], 0, 1],
  ['trex-1', 'trex', [-6, 0, -6], 45, 1],
  ['sheep-1', 'sheep', [6, 0, 2], 200, 1],
  ['sheep-2', 'sheep', [9, 0, 5], 250, 1],
  ['sheep-3', 'sheep', [4, 0, 7], 300, 1],
  ['horse-1', 'horse', [-2, 0, 10], 90, 1],
])

const NAMES = { tree: 'Tree', rock: 'Rock', lamp: 'Lamp', trex: 'T-rex', sheep: 'Sheep', horse: 'Horse' }

// own maps for every inherited object component (presets.js withOwnMaps), so
// the first concurrent edits or hits on a seed entity merge instead of conflicting
export function starterEntity (preset, p, yawDeg = 0, scale = 1, name = NAMES[preset] ?? preset, presets = PRESETS) {
  const { components: own, hollow } = withOwnMaps({ presets }, { preset, components: { transform: { p: [...p], r: [0, yawDeg, 0], s: [scale, scale, scale] } } })
  return {
    name: I(name),
    parent: I(''),
    preset: I(preset),
    owner: I(''),
    components: toDoc(own),
    hollow,
    groups: {},
    inbox: {},
  }
}

export function seedDoc (d, { title = 'Merge Meadow' } = {}) {
  initDoc(d, { title })
  for (const [name, def] of Object.entries(COMPONENT_DEFS)) d.components[name] = toDoc(def)
  for (const [name, preset] of Object.entries(PRESETS)) d.presets[name] = toDoc(preset)
  for (const [id, preset, p, yaw, s] of STARTER) d.entities[id] = starterEntity(preset, p, yaw, s)
  return d
}

// The same new world as an op list, so the app can seed a fresh handle through
// the one write path: applyOps(handle, seedOps({ title })).
export function seedOps ({ title = 'Merge Meadow' } = {}) {
  return [
    { op: 'setMeta', patch: { title, created: Date.now() } },
    { op: 'setWorld', patch: { bounds: DEFAULT_WORLD.bounds, ground: { ...DEFAULT_WORLD.ground }, sky: { ...DEFAULT_WORLD.sky }, disabledSystems: {} } },
    ...Object.entries(COMPONENT_DEFS).map(([name, def]) => ({ op: 'defineComponent', name, def })),
    // creature first: the others extend it, and validation reads the batch in order
    ...Object.keys(PRESETS).sort((a, b) => (a === 'creature' ? -1 : b === 'creature' ? 1 : 0)).map((name) => ({ op: 'definePreset', name, preset: PRESETS[name] })),
    ...STARTER.map(([id, preset, p, yaw, s]) => ({ op: 'spawn', id, preset, name: NAMES[preset] ?? preset, components: { transform: { p: [...p], r: [0, yaw, 0], s: [s, s, s] } } })),
  ]
}
