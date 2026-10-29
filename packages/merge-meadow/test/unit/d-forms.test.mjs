import test from 'node:test'
import assert from 'node:assert/strict'
import { objectModel, fieldModel, inferSchema, defaultFor } from '../../src/editor/forms.js'
import { COMPONENT_DEFS } from '../../src/doc/presets.js'

const byKey = (m, k) => m.fields.find((f) => f.key === k)

test('forms: transform -> three vec fields whose elements patch by index', () => {
  const m = fieldModel(COMPONENT_DEFS.transform.schema, { p: [1, 2, 3], r: [0, 90, 0], s: [1, 1, 1] })
  assert.deepEqual(m.fields.map((f) => [f.key, f.widget]), [['p', 'vec'], ['r', 'vec'], ['s', 'vec']])
  assert.deepEqual(byKey(m, 'p').items.map((i) => i.path), [['p', 0], ['p', 1], ['p', 2]])
  assert.deepEqual(byKey(m, 'r').items.map((i) => i.value), [0, 90, 0])
  assert.equal(m.add, null)
})

test('forms: numbers get sliders only for small ranges; enums are selects; inherited flags missing values', () => {
  const m = fieldModel(COMPONENT_DEFS.body.schema, { speed: 6 })
  const speed = byKey(m, 'speed')
  assert.equal(speed.widget, 'number'); assert.equal(speed.slider, true); assert.equal(speed.inherited, false); assert.equal(speed.min, 0); assert.equal(speed.max, 60)
  assert.equal(byKey(m, 'accel').slider, false, 'a 0-500 span is a number box, not a slider')
  assert.equal(byKey(m, 'radius').inherited, true)
  const brain = fieldModel(COMPONENT_DEFS.brain.schema, { idle: 'wander', drives: {} })
  assert.equal(byKey(brain, 'idle').widget, 'select')
  assert.deepEqual(byKey(brain, 'idle').options, ['wander', 'idle'])
})

test('forms: x-hidden is skipped, x-filter and x-json are JSON boxes, x-immutable is flagged', () => {
  const h = fieldModel(COMPONENT_DEFS.health.schema, { max: 30, armor: 0, hits: { 'p:1': 5 } })
  assert.deepEqual(h.fields.map((f) => f.key), ['max', 'armor'], 'the damage ledger is not a form field')
  const a = fieldModel(COMPONENT_DEFS.attack.schema, { damage: 25, match: { tags: ['prey'] } })
  assert.equal(byKey(a, 'match').widget, 'json'); assert.equal(byKey(a, 'match').filter, true)
  assert.equal(byKey(a, 'acts').widget, 'list')
  const r = fieldModel(COMPONENT_DEFS.rider.schema, { mount: 'horse-1', seat: 0 })
  assert.equal(byKey(r, 'mount').widget, 'text'); assert.equal(byKey(r, 'mount').immutable, true)
  assert.equal(byKey(r, 'seat').integer, true)
  const tree = fieldModel({ type: 'object', properties: { nodes: { type: 'array', 'x-json': true } } }, { nodes: [{ shape: 'box' }] })
  assert.equal(byKey(tree, 'nodes').widget, 'json')
})

test('forms: maps (brain.drives, tags) list their entries as removable fields with an add row', () => {
  const brain = fieldModel(COMPONENT_DEFS.brain.schema, { drives: { hunt: { act: 'pursue', weight: 2, match: { tags: ['prey'] } } } })
  const drives = byKey(brain, 'drives')
  assert.equal(drives.widget, 'object')
  const hunt = drives.children.fields.find((f) => f.key === 'hunt')
  assert.equal(hunt.removable, true)
  assert.deepEqual(hunt.path, ['drives', 'hunt'])
  const weight = hunt.children.fields.find((f) => f.key === 'weight')
  assert.deepEqual(weight.path, ['drives', 'hunt', 'weight'])
  assert.deepEqual(drives.children.add.path, ['drives'])
  assert.equal(drives.children.add.itemSchema.required[0], 'act')
  const tags = fieldModel(COMPONENT_DEFS.tags.schema, { prey: true, creature: true })
  assert.deepEqual(tags.fields.map((f) => [f.key, f.widget, f.removable]), [['creature', 'checkbox', true], ['prey', 'checkbox', true]])
  assert.deepEqual(tags.add.path, [])
  assert.equal(defaultFor(tags.add.itemSchema), true, 'a new tag is on')
})

test('forms: unknown components and undeclared keys are still editable (inferred)', () => {
  const m = objectModel(undefined, { glow: 2, hue: '#ff0000', axis: [0, 1, 0], label: 'hi', blob: [{ a: 1 }] })
  assert.deepEqual(Object.fromEntries(m.fields.map((f) => [f.key, f.widget])), { axis: 'vec', blob: 'json', glow: 'number', hue: 'color', label: 'text' })
  const extra = fieldModel(COMPONENT_DEFS.perception.schema, { radius: 15, fov: 90 })
  assert.equal(byKey(extra, 'fov').removable, true)
  assert.equal(inferSchema([1, 2]).minItems, 2)
  const closed = fieldModel(COMPONENT_DEFS.on.schema.additionalProperties, { add: ['dead'], weird: 1 })
  assert.equal(byKey(closed, 'weird'), undefined, 'additionalProperties: false hides nothing it should show and shows nothing it forbids')
})

test('forms: defaultFor builds schema defaults', () => {
  assert.deepEqual(defaultFor(COMPONENT_DEFS.transform.schema.properties.p), [0, 0, 0])
  assert.equal(defaultFor({ enum: ['a', 'b'] }), 'a')
  assert.deepEqual(defaultFor({ type: 'object', required: ['act'], properties: { act: { enum: ['pursue'] }, weight: { type: 'number' } } }), { act: 'pursue' })
})
