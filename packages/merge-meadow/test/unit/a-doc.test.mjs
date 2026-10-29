import test from 'node:test'
import assert from 'node:assert/strict'
import { seeded, A } from './a-helpers.mjs'
import { SCHEMA_VERSION, IMMUTABLE_KEYS, newId, isName, initDoc, migrate } from '../../src/doc/schema.js'
import { COMPONENT_DEFS, PRESETS, effectiveComponents } from '../../src/doc/presets.js'
import { seedDoc, STARTER } from '../../src/doc/seed.js'
import { plain, entityData, listEntities, presetData, hp, docSummary } from '../../src/doc/read.js'
import { validateComponent, validateFilter, validateSystemMeta, validateSchema } from '../../src/doc/validate.js'
import { validateOps } from '../../src/doc/ops.js'

test('schema helpers', () => {
  assert.equal(SCHEMA_VERSION, 1)
  assert.ok(IMMUTABLE_KEYS.includes('kind') && IMMUTABLE_KEYS.includes('act') && Object.isFrozen(IMMUTABLE_KEYS))
  assert.match(newId(), /^e-[a-z0-9]{5}$/)
  assert.match(newId('T-Rex!'), /^t-rex-[a-z0-9]{5}$/)
  assert.ok(isName('hunt') && isName('_x-1') && !isName('1x') && !isName('a b') && !isName('') && !isName(3))
  let d = A.change(A.init(), (x) => initDoc(x, { title: 'T' }))
  assert.equal(plain(d.meta.title), 'T')
  assert.deepEqual(Object.keys(d).sort(), ['assets', 'components', 'entities', 'meta', 'presets', 'schema', 'systems', 'world'])
  d = A.change(d, (x) => migrate(x))
  assert.equal(d.schema, 1)
})

test('seedDoc: vocabulary, presets and the starter meadow, all valid against their own defs', () => {
  const h = seeded('Meadow')
  const doc = h.doc()
  const s = docSummary(doc)
  assert.equal(s.title, 'Meadow')
  assert.deepEqual(s.presets, Object.keys(PRESETS).sort())
  assert.deepEqual(s.components, Object.keys(COMPONENT_DEFS).sort())
  const count = (p) => STARTER.filter((x) => x[1] === p).length
  assert.deepEqual([count('tree'), count('rock'), count('lamp'), count('trex'), count('sheep'), count('horse')], [6, 2, 1, 1, 3, 1])
  for (const [id, , p] of STARTER) { assert.ok(p.every((x) => Math.abs(x) <= 15), id); assert.ok(doc.entities[id]) }
  assert.equal(s.entities, STARTER.length)
  // every preset re-validates as an op against the seeded defs
  assert.doesNotThrow(() => validateOps(doc, Object.entries(PRESETS).map(([name, preset]) => ({ op: 'definePreset', name, preset }))))
  assert.doesNotThrow(() => validateOps(doc, Object.entries(COMPONENT_DEFS).map(([name, def]) => ({ op: 'defineComponent', name, def }))))
  // representation.kind is the enum of the five kinds; billboards are emoji
  assert.deepEqual(plain(doc.components.representation.schema.properties.kind.enum), ['billboard', 'primitive', 'tree', 'model', 'critter'])
  assert.equal(entityData(doc, 'trex-1').effective.representation.image, 'emoji:🦖')
  assert.equal(entityData(doc, 'horse-1').effective.mount.seats[0].anchor, 'seat')
  // strings in the doc are ImmutableString, the seed's plain JS stays plain
  assert.ok(doc.presets.sheep.components.brain.drives.flee.act instanceof A.ImmutableString)
  assert.ok(Object.isFrozen(PRESETS.trex.components))
})

test('effective components: preset chain -> own -> groups, null removes, groups strip and tint', () => {
  const h = seeded()
  const doc = h.doc()
  const c = plain(effectiveComponents(doc, 'trex-1'))
  assert.deepEqual(c.tags, { creature: true, predator: true })
  assert.deepEqual(Object.keys(c.brain.drives), ['hunt'])
  assert.equal(c.brain.idle, 'wander', 'merged from creature')
  assert.deepEqual(c.transform.p, [-6, 0, -6])
  h.change((d) => { d.entities['trex-1'].groups.dead = true })
  const dead = plain(effectiveComponents(h.doc(), 'trex-1'))
  for (const k of ['brain', 'attack', 'perception', 'body']) assert.equal(dead[k], undefined, k)
  assert.equal(dead.tags.dead, true)
  assert.equal(dead.representation.tint, '#555555')
  assert.equal(dead.representation.image, 'emoji:🦖', 'tint merges into whatever look it has')
  // structural sharing: an untouched inherited component is the doc's own object
  assert.equal(effectiveComponents(h.doc(), 'sheep-1').representation, h.doc().presets.sheep.components.representation)
  assert.notEqual(effectiveComponents(h.doc(), 'sheep-1').perception, h.doc().presets.sheep.components.perception, 'two layers merge into a fresh object')
})

test('read: listEntities filters on effective components; rows are fresh plain copies', () => {
  const doc = seeded().doc()
  assert.deepEqual(listEntities(doc, { tags: ['prey'] }).map((r) => r.id), ['horse-1', 'sheep-1', 'sheep-2', 'sheep-3'])
  assert.deepEqual(listEntities(doc, { has: 'mount' }).map((r) => r.id), ['horse-1'])
  assert.deepEqual(listEntities(doc, { preset: 'creature' }).length, 5)
  assert.deepEqual(listEntities(doc, { name: 'Lamp' }).map((r) => r.id), ['lamp-1'])
  const row = entityData(doc, 'sheep-1')
  assert.equal(typeof row.name, 'string')
  assert.equal(typeof row.effective.representation.kind, 'string')
  row.effective.tags.mutated = true
  assert.equal(entityData(doc, 'sheep-1').effective.tags.mutated, undefined)
  assert.equal(entityData(doc, 'nope'), null)
  const p = presetData(doc, 'trex')
  assert.deepEqual(p.chain, ['trex', 'creature'])
  assert.equal(presetData(doc, 'nope'), null)
  assert.equal(hp(null), null)
  assert.equal(hp(row.effective.health), 30)
})

test('validateComponent: JSON-Schema subset', () => {
  const def = { schema: { type: 'object', required: ['a'], additionalProperties: false, properties: {
    a: { type: 'number', minimum: 0, maximum: 10 },
    i: { type: 'integer' },
    s: { type: 'string', maxLength: 3 },
    c: { type: 'string', format: 'color' },
    b: { type: 'boolean' },
    e: { enum: ['x', 'y'] },
    v: { type: 'array', items: { type: 'number' }, minItems: 3, maxItems: 3 },
    n: { type: 'object', properties: { deep: { type: 'string' } } },
    u: { type: ['number', 'array'], items: { type: 'number' } },
    j: { type: 'array', 'x-json': true },
    f: { type: 'object', 'x-filter': true },
    m: { type: 'object', additionalProperties: { type: 'boolean' } },
  } } }
  assert.deepEqual(validateComponent(def, { a: 1, i: 2, s: 'abc', c: '#aabbcc', b: true, e: 'x', v: [1, 2, 3], n: { deep: 'q' }, u: 3, j: [{ any: 'thing' }], f: { tags: ['p'] }, m: { q: true } }), [])
  const p = validateComponent(def, { a: 11, i: 1.5, s: 'abcd', c: 'red', b: 1, e: 'z', v: [1, 2], n: { deep: 1 }, u: 'no', f: { tag: 'p' }, m: { q: 1 }, zz: 1 })
  for (const frag of ['a: 11 > maximum', 'i: expected integer', 's: longer', 'c: expected a #rrggbb', 'b: expected boolean', 'e: must be one of', 'v: fewer than 3', 'n.deep: expected string', 'u: expected number | array', 'f: unknown filter key', 'm.q: expected boolean', 'zz: unknown field']) {
    assert.ok(p.some((x) => x.includes(frag)), `missing ${frag} in ${JSON.stringify(p)}`)
  }
  assert.ok(validateComponent(def, { i: 1 }).some((x) => x.includes('a: required')))
  assert.deepEqual(validateComponent(def, { i: 1, s: null }, { partial: true }), [], 'partial: no required, null deletes')
  assert.deepEqual(validateComponent(undefined, { anything: [1, { x: 'y' }] }), [], 'no def: plain JSON is enough')
  assert.ok(validateComponent(undefined, { bad: NaN }).length)
  assert.deepEqual(validateSchema(def.schema), [])
  assert.ok(validateSchema({ type: 'object', properties: { x: { type: 'date' } }, oneOf: [] }).length === 2)
})

test('validateFilter: structured filters only, checked against component defs', () => {
  const defs = plain(COMPONENT_DEFS)
  assert.deepEqual(validateFilter({ tags: ['prey'], notTags: ['dead'], has: ['health'], not: 'rider', relation: 'targetsMe', where: [{ path: ['body', 'speed'], lt: { path: ['body', 'speed'], of: 'self', mul: 0.5 } }, { path: ['$hp'], gt: 0 }], any: [{ tags: ['a'] }, { relation: 'myRider' }] }, defs), [])
  const p = validateFilter({ tag: 'x', tags: 'not a name!', has: ['nosuchcomp'], relation: 'likes', where: [{ path: 'body.speed', lt: 1 }, { path: ['body'], lt: 1, gt: 2 }, { path: ['$mood'], eq: 1 }], any: [] }, defs)
  for (const frag of ['unknown filter key "tag"', 'bad tag name', 'unknown component "nosuchcomp"', 'unknown relation', 'non-empty list of keys', 'exactly one of', 'unknown root "$mood"', 'any: expected']) {
    assert.ok(p.some((x) => x.includes(frag)), `missing ${frag} in ${JSON.stringify(p)}`)
  }
  assert.deepEqual(validateFilter({ has: ['madeUpLater'] }), [], 'no defs given: names are not checked')
  assert.deepEqual(validateFilter(null), [])
  assert.deepEqual(validateFilter('prey'), ['filter must be an object'])
})

test('validateSystemMeta', () => {
  assert.deepEqual(validateSystemMeta({ order: 950, enabled: true }), [])
  assert.deepEqual(validateSystemMeta({}), [])
  assert.equal(validateSystemMeta({ order: 'x', enabled: 'yes' }).length, 2)
  assert.equal(validateSystemMeta({ order: Infinity }).length, 1)
})

test('seedOps seeds the same world through applyOps (the one write path)', async () => {
  const { repo } = await import('./a-helpers.mjs')
  const { seedOps } = await import('../../src/doc/seed.js')
  const { applyOps } = await import('../../src/doc/ops.js')
  const viaOps = repo.create()
  applyOps(viaOps, seedOps({ title: 'Meadow' }))
  const viaSeed = seeded('Meadow')
  const strip = (doc) => { const x = plain(doc); delete x.meta.created; return JSON.stringify(sortKeys(x)) }
  assert.equal(strip(viaOps.doc()), strip(viaSeed.doc()))
})

function sortKeys (v) {
  if (Array.isArray(v)) return v.map(sortKeys)
  if (v && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map((k) => [k, sortKeys(v[k])]))
  return v
}
