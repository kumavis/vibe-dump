// A new world: schema v1, the seed vocabulary and a template's entities
// (templates.js, design §18.2). seedOps is the op list the app seeds a fresh
// handle with; seedDoc writes the same world directly into a change callback
// (tests and fixtures). Both default to the Animal meadow template.
import { initDoc } from './schema.js'
import { COMPONENT_DEFS, withOwnMaps } from './presets.js'
import { toDoc, ImmutableString } from './convert.js'
import { libraryDocModels } from './models.js'
import { STARTER, NAMES, templateOps, templateEntities, templateWorld, libraryPresets, presetOrder, DEFAULT_TEMPLATE } from './templates.js'

export { STARTER }

const I = (s) => new ImmutableString(s)

// own maps for every inherited object component (presets.js withOwnMaps), so
// the first concurrent edits or hits on a seed entity merge instead of conflicting
export function starterEntity (preset, p, yawDeg = 0, scale = 1, name = NAMES[preset] ?? preset, presets = libraryPresets()) {
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

export function seedDoc (d, { title = 'Merge Meadow', template = DEFAULT_TEMPLATE } = {}) {
  initDoc(d, { title })
  const w = templateWorld(template)
  d.world = { bounds: w.bounds, ground: toDoc(w.ground), sky: toDoc(w.sky), disabledSystems: {} }
  for (const [name, def] of Object.entries(COMPONENT_DEFS)) d.components[name] = toDoc(def)
  const presets = libraryPresets()
  for (const name of presetOrder(presets)) d.presets[name] = toDoc(presets[name])
  // the rig model library (design §17.3)
  for (const [name, m] of Object.entries(libraryDocModels(toDoc))) d.models[name] = m
  for (const e of templateEntities(template, presets)) d.entities[e.id] = starterEntity(e.preset, e.p, e.yaw, e.s, e.name, presets)
  return d
}

// The same new world as an op list, so the app can seed a fresh handle through
// the one write path: applyOps(handle, seedOps({ title })). Delegates to the
// template (design §18.2); existing callers get the Animal meadow.
export function seedOps ({ title = 'Merge Meadow', template = DEFAULT_TEMPLATE } = {}) {
  return templateOps(template, { title })
}
