// New-world templates (design §18.2, ARCHITECTURE §7). Every template seeds the
// same library — component defs, presets (with their `icon`) and the rig model
// library — and differs only in the world settings and the entities it places.
// templateOps(name, { title }) is the op list a fresh handle is seeded with
// through the one write path; seed.js's seedDoc writes the same world directly.
// Plain data in, plain ops out: no three, no DOM.
import { DEFAULT_WORLD } from './schema.js'
import { COMPONENT_DEFS, PRESETS } from './presets.js'
import { ZOO_PRESETS } from './presets-zoo.js'
import { ensureLibraryOps } from './models.js'

const own = (o, k) => (o != null && typeof o === 'object' && Object.prototype.hasOwnProperty.call(o, k) ? o[k] : undefined)

export const TEMPLATES = Object.freeze({
  blank: Object.freeze({ title: 'Blank meadow', description: 'Ground, sky and one lamp. Every preset is in the palette; the field is yours.', icon: '🟩' }),
  meadow: Object.freeze({ title: 'Animal meadow', description: 'Trees, rocks, a T-rex hunting sheep, a horse to ride, a wizard by the lamp and a few zodiac animals.', icon: '🦖' }),
})
export const TEMPLATE_ORDER = Object.freeze(['meadow', 'blank'])
export const DEFAULT_TEMPLATE = 'meadow'
export const isTemplate = (name) => typeof name === 'string' && !!own(TEMPLATES, name)

// [id, preset, [x, y, z], yawDeg, scale?]. Positions are fixed (not random) so
// every fresh world, and the gallery thumbnail, opens on the same composition.
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
].map((r) => Object.freeze(r.map((x) => (Array.isArray(x) ? Object.freeze(x) : x)))))

// yaw (degrees) that faces `from` towards `to`: the sim's forward is +z (yaw = atan2(vx, vz))
export function yawToward (from, to) {
  const deg = Math.atan2(to[0] - from[0], to[2] - from[2]) * 180 / Math.PI
  return Math.round(((deg % 360) + 360) % 360)
}

const LAMP = STARTER.find((r) => r[0] === 'lamp-1')[2]
const WIZARD_AT = [3, 0, 10]
// harmless zodiac animals spread over the open meadow (clear of the starter's trees and rocks)
const ZOO_SPOTS = Object.freeze([
  ['rabbit-1', 'rabbit', [-10, 0, 0], 70],
  ['goat-1', 'goat', [11, 0, -1], 250],
  ['pig-1', 'pig', [-9, 0, 11], 20],
  ['dog-1', 'dog', [0, 0, -9], 180],
  ['rooster-1', 'rooster', [8, 0, 11], 300],
])

const ENTITIES = Object.freeze({
  blank: Object.freeze([['lamp-1', 'lamp', [0, 0, 4], 0, 1]]),
  meadow: Object.freeze([
    ...STARTER,
    ['wizard-1', 'wizard', WIZARD_AT, yawToward(WIZARD_AT, LAMP), 1],
    ...ZOO_SPOTS.map(([id, preset, p, yaw]) => [id, preset, p, yaw, 1]),
  ]),
})
const WORLD = Object.freeze({ blank: DEFAULT_WORLD, meadow: DEFAULT_WORLD })

export const NAMES = Object.freeze({ tree: 'Tree', rock: 'Rock', lamp: 'Lamp', trex: 'T-rex', sheep: 'Sheep', horse: 'Horse' })
export const displayName = (preset) => own(NAMES, preset) ?? (String(preset).charAt(0).toUpperCase() + String(preset).slice(1))

// the preset library every template seeds: the core presets win a name clash
export function libraryPresets () {
  return { ...ZOO_PRESETS, ...PRESETS }
}

const extendsOf = (p) => {
  const e = p?.extends
  return (Array.isArray(e) ? e : e == null ? [] : [e]).map(String).filter(Boolean)
}
// preset names, bases first (validateOps reads the batch in order); unknown
// bases are left to validation; ties keep name order so the ops are stable
export function presetOrder (presets) {
  const names = Object.keys(presets).sort()
  const out = []; const seen = new Set()
  const visit = (n, depth = 0) => {
    if (seen.has(n) || depth > 16) return
    seen.add(n)
    for (const b of extendsOf(presets[n])) if (own(presets, b)) visit(b, depth + 1)
    out.push(n)
  }
  for (const n of names) visit(n)
  return out
}

// the entities a template places: [{ id, preset, p, yaw, s, name }]; an entity
// whose preset the library does not have is left out (never a refused batch)
export function templateEntities (name, presets = libraryPresets()) {
  const list = own(ENTITIES, name)
  if (!list) throw new RangeError(`unknown template ${JSON.stringify(name)} (one of ${Object.keys(TEMPLATES).join(', ')})`)
  return list.filter(([, preset]) => !!own(presets, preset)).map(([id, preset, p, yaw, s = 1]) => ({ id, preset, p: [...p], yaw, s, name: displayName(preset) }))
}

export function templateWorld (name) {
  const w = own(WORLD, name)
  if (!w) throw new RangeError(`unknown template ${JSON.stringify(name)}`)
  return { bounds: w.bounds, ground: { ...w.ground }, sky: { ...w.sky }, disabledSystems: {} }
}

export function templateOps (name = DEFAULT_TEMPLATE, { title } = {}) {
  if (!isTemplate(name)) throw new RangeError(`unknown template ${JSON.stringify(name)} (one of ${Object.keys(TEMPLATES).join(', ')})`)
  const presets = libraryPresets()
  return [
    { op: 'setMeta', patch: { title: title ?? TEMPLATES[name].title, created: Date.now() } },
    { op: 'setWorld', patch: templateWorld(name) },
    ...Object.entries(COMPONENT_DEFS).map(([n, def]) => ({ op: 'defineComponent', name: n, def })),
    // models before presets: a rig look is validated against doc.models (bases first)
    ...ensureLibraryOps({ models: {} }),
    ...presetOrder(presets).map((n) => ({ op: 'definePreset', name: n, preset: presets[n] })),
    ...templateEntities(name, presets).map(({ id, preset, p, yaw, s, name: label }) => ({ op: 'spawn', id, preset, name: label, components: { transform: { p, r: [0, yaw, 0], s: [s, s, s] } } })),
  ]
}
