// Rig models in the doc (design §17.3, §17.5; ARCHITECTURE §6.1): defineModel /
// removeModel, their inverses, rig representation validation, the seed library,
// read.js, ImmutableString storage.
import test from 'node:test'
import assert from 'node:assert/strict'
import { seeded, empty, fork, heads, A } from './a-helpers.mjs'
import { applyOps, validateOps, changeDoc, OP_NAMES } from '../../src/doc/ops.js'
import { plain, modelData, docSummary, entityData } from '../../src/doc/read.js'
import { MODEL_LIBRARY, LIBRARY_ORDER, ensureLibraryOps, resolveRepresentation } from '../../src/doc/models.js'
import { PRESETS } from '../../src/doc/presets.js'

const pony = { extends: 'horse', stride: 1.2, nodes: [{ name: 'body', s: [0.4, 0.45, 1.0] }], animations: { walk: { tracks: { 'tail.rz': 'sin(phase*tau)*9' } } } }

test('seed: doc.models holds the library at rev 1; the seed presets stay billboards', () => {
  const doc = seeded().doc()
  assert.deepEqual(Object.keys(doc.models).sort(), Object.keys(MODEL_LIBRARY).sort())
  for (const n of LIBRARY_ORDER) assert.equal(plain(doc.models[n].rev), 1, n)
  assert.ok(doc.models.horse.rev instanceof A.Counter, 'rev is a Counter: concurrent redefinitions sum')
  for (const p of ['trex', 'sheep', 'horse']) assert.equal(PRESETS[p].components.representation.kind, 'billboard', p)
  assert.equal(entityData(doc, 'horse-1').effective.representation.kind, 'billboard')
  assert.deepEqual(ensureLibraryOps(doc), [], 'a seeded doc needs nothing')
  // the library reads back exactly
  const lib = JSON.parse(JSON.stringify(MODEL_LIBRARY))
  for (const n of LIBRARY_ORDER) { const m = plain(doc.models[n]); delete m.rev; assert.deepEqual(m, lib[n], n) }
})

test('doc storage: names, extends, anchors, expression strings and clip references are ImmutableString', () => {
  const doc = seeded().doc()
  const h = doc.models.horse
  assert.ok(h.extends instanceof A.ImmutableString)
  assert.ok(h.nodes[0].name instanceof A.ImmutableString)
  assert.ok(doc.models.quadruped.nodes[0].children[0].children[0].anchor instanceof A.ImmutableString, 'saddle anchor')
  assert.ok(doc.models.quadruped.animations.walk.tracks['leg_fl.rx'] instanceof A.ImmutableString, 'expression')
  assert.equal(typeof doc.models.quadruped.animations.attack.tracks['head.rx'][1][1], 'number', 'keyframes stay numbers')
  assert.ok(doc.models.trex.controller.states.attack instanceof A.ImmutableString, 'a controller clip reference')
  assert.ok(doc.models.quadruped.controller.states.idle[0] instanceof A.ImmutableString, 'a clip reference in a layer list')
  assert.ok(doc.models.horse.nodes[0].color instanceof A.ImmutableString)
  assert.equal(A.getConflicts(doc.models, 'horse'), undefined)
})

test('defineModel: validated before the change, rev increments, the inverse undoes it', () => {
  const h = seeded()
  const r = applyOps(h, [{ op: 'defineModel', name: 'pony', model: pony }])
  assert.deepEqual(r.results, [true])
  assert.deepEqual(r.inverse, [{ op: 'removeModel', name: 'pony' }])
  assert.equal(plain(h.doc().models.pony.rev), 1)
  assert.equal(modelData(h.doc(), 'pony').stride, 1.2)
  // redefine: rev moves on, the inverse restores the old content (without rev)
  const r2 = applyOps(h, [{ op: 'defineModel', name: 'pony', model: { ...pony, stride: 1.4, rev: 99, chain: ['x'], name: 'ignored' } }])
  assert.equal(plain(h.doc().models.pony.rev), 2, 'rev is computed, never taken from the op')
  assert.equal(h.doc().models.pony.chain, undefined, 'resolver extras are dropped')
  assert.equal(h.doc().models.pony.name, undefined)
  assert.deepEqual(r2.inverse[0].op, 'defineModel')
  assert.equal(r2.inverse[0].model.stride, 1.2)
  assert.equal(r2.inverse[0].model.rev, undefined)
  applyOps(h, r2.inverse)
  assert.equal(modelData(h.doc(), 'pony').stride, 1.2)
  assert.equal(plain(h.doc().models.pony.rev), 3)
  applyOps(h, r.inverse)
  assert.equal(h.doc().models.pony, undefined, 'undo of the first define removes it')
  // define diff-merges: a concurrent edit of another clip survives a redefine
  applyOps(h, [{ op: 'defineModel', name: 'pony', model: pony }])
  const b = fork(h)
  applyOps(h, [{ op: 'defineModel', name: 'pony', model: { ...pony, stride: 2 } }])
  applyOps(b, [{ op: 'defineModel', name: 'pony', model: { ...pony, animations: { ...pony.animations, run: { tracks: { 'mane.rz': 't' } } } } }])
  h.merge(b)
  const m = modelData(h.doc(), 'pony', { raw: true })
  assert.equal(m.stride, 2); assert.equal(m.animations.run.tracks['mane.rz'], 't')
  assert.equal(m.rev, 3, 'two concurrent redefinitions of rev 1 sum to 3 (a revision neither peer had)')
})

test('defineModel with a bad expression (or a bad target, or a cycle) leaves the heads unchanged', () => {
  const h = seeded()
  const before = heads(h)
  const bad = (model, re, name = 'pony') => {
    assert.throws(() => applyOps(h, [{ op: 'defineModel', name, model }]), (e) => re.test(e.message) && Array.isArray(e.problems), String(re))
    assert.deepEqual(heads(h), before)
  }
  bad({ ...pony, animations: { walk: { tracks: { 'tail.rz': 'sin(phase*tau)*speeed' } } } }, /model pony: animations\.walk\.tracks\["tail\.rz"\]: unknown identifier 'speeed' at column 16/)
  bad({ ...pony, animations: { walk: { tracks: { 'tial.rz': '1' } } } }, /no node named "tial"/)
  bad({ extends: 'pony', nodes: [] }, /cycle/)
  bad({ extends: 'unicorn' }, /extends unknown model "unicorn"/)
  bad({ nodes: [{ name: 'x' }] }, /bad model name/, 'bad name')
  bad('horse', /model must be/)
  // a batch: the second op sees the first
  applyOps(h, [{ op: 'defineModel', name: 'pony', model: pony }, { op: 'defineModel', name: 'foal', model: { extends: 'pony', stride: 0.8 } }])
  assert.deepEqual(modelData(h.doc(), 'foal').chain, ['quadruped', 'horse', 'pony', 'foal'])
  // redefining a base so that a model built on it breaks is refused
  const before2 = heads(h)
  assert.throws(() => applyOps(h, [{ op: 'defineModel', name: 'quadruped', model: { nodes: [{ name: 'mane', shape: 'box' }] } }]), /breaks horse, which extends it/)
  assert.deepEqual(heads(h), before2)
})

test('removeModel: refused while another model extends it; the inverse restores it', () => {
  const h = seeded()
  const before = heads(h)
  assert.throws(() => applyOps(h, [{ op: 'removeModel', name: 'quadruped' }]), /extended by horse, sheep/)
  assert.throws(() => applyOps(h, [{ op: 'removeModel', name: 'nope' }]), /no model nope/)
  assert.deepEqual(heads(h), before)
  // in a batch, removing the dependents first makes it fine
  const r = applyOps(h, [{ op: 'removeModel', name: 'horse' }, { op: 'removeModel', name: 'sheep' }, { op: 'removeModel', name: 'quadruped' }])
  assert.deepEqual(Object.keys(h.doc().models).sort(), ['biped', 'bird', 'serpent', 'trex'])
  assert.deepEqual(r.inverse.map((o) => [o.op, o.name]), [['defineModel', 'quadruped'], ['defineModel', 'sheep'], ['defineModel', 'horse']], 'bases come back first')
  applyOps(h, r.inverse)
  assert.deepEqual(Object.keys(h.doc().models).sort(), Object.keys(MODEL_LIBRARY).sort())
  assert.deepEqual(modelData(h.doc(), 'horse', { raw: true }).nodes, JSON.parse(JSON.stringify(MODEL_LIBRARY.horse.nodes)))
  // ensureLibraryOps puts a removed library model back, never an edited one over
  applyOps(h, [{ op: 'removeModel', name: 'bird' }, { op: 'defineModel', name: 'serpent', model: { ...JSON.parse(JSON.stringify(MODEL_LIBRARY.serpent)), stride: 2 } }])
  const ops = ensureLibraryOps(h.doc())
  assert.deepEqual(ops.map((o) => o.name), ['bird'])
  applyOps(h, ops)
  assert.equal(modelData(h.doc(), 'serpent').stride, 2)
})

test('validateOps: a rig look must name a model that resolves, or carry valid inline nodes', () => {
  const h = seeded()
  const doc = h.doc()
  const ok = (ops, kinds) => assert.doesNotThrow(() => validateOps(doc, ops, kinds ? { kinds } : {}), JSON.stringify(ops))
  const no = (ops, re) => assert.throws(() => validateOps(doc, ops), re, JSON.stringify(ops))
  ok([{ op: 'replace', id: 'horse-1', component: 'representation', data: { kind: 'rig', model: 'horse' } }])
  ok([{ op: 'replace', id: 'horse-1', component: 'representation', data: { kind: 'rig', model: 'horse' } }], { billboard: {}, rig: {} })
  no([{ op: 'replace', id: 'horse-1', component: 'representation', data: { kind: 'rig', model: 'unicorn' } }], /representation\.model: no model "unicorn"/)
  ok([{ op: 'defineModel', name: 'unicorn', model: { extends: 'horse' } }, { op: 'replace', id: 'horse-1', component: 'representation', data: { kind: 'rig', model: 'unicorn' } }])
  no([{ op: 'removeModel', name: 'trex' }, { op: 'spawn', components: { representation: { kind: 'rig', model: 'trex' } } }], /no model "trex"/)
  // inline (what `tree` is an alias for)
  ok([{ op: 'spawn', components: { representation: { kind: 'tree', nodes: [{ name: 'trunk', shape: 'cylinder' }], animations: { sway: { tracks: { 'trunk.rz': 'sin(t)*3' } } }, controller: { states: { idle: 'sway' } } } } }])
  no([{ op: 'spawn', components: { representation: { kind: 'tree', nodes: [{ name: 'trunk' }], animations: { sway: { tracks: { 'trunk.rz': 'sin(x)' } } } } } }], /representation\.animations\.sway\.tracks\["trunk\.rz"\]: unknown identifier 'x'/)
  no([{ op: 'spawn', components: { representation: { kind: 'rig', nodes: [{ name: 'a' }], animations: { c: { tracks: { 'b.rx': '1' } } } } } }], /no node named "b"/)
  no([{ op: 'spawn', components: { representation: { kind: 'tree', nodes: [{ shape: 'teapot' }] } } }], /shape/)
  // the seed's own tree looks still validate
  ok(Object.entries(PRESETS).map(([name, preset]) => ({ op: 'definePreset', name, preset })))
  // a set patch is checked as the look it makes: the tree-1 look has unnamed nodes, so a track has nothing to target
  no([{ op: 'set', id: 'tree-1', component: 'representation', patch: { animations: { sway: { tracks: { 'trunk.rz': 'sin(t)' } } } } }], /no node named "trunk"/)
  ok([{ op: 'set', id: 'tree-1', component: 'representation', patch: { nodes: [{ name: 'trunk', shape: 'cylinder' }, { shape: 'cone' }], animations: { sway: { tracks: { 'trunk.rz': 'sin(t)' } } } } }])
  ok([{ op: 'set', id: 'horse-1', component: 'representation', patch: { kind: 'rig', model: 'horse', image: null } }])
  no([{ op: 'set', id: 'horse-1', component: 'representation', patch: { kind: 'rig', model: 'pegasus' } }], /no model "pegasus"/)
  // a doc seeded before `rig` was in the kind enum still takes one (the built-in kinds always validate)
  const old = empty()
  applyOps(old, [{ op: 'defineComponent', name: 'representation', def: { description: 'x', order: 10, defaults: { kind: 'billboard' }, schema: { type: 'object', required: ['kind'], properties: { kind: { enum: ['billboard', 'critter'] } } } } }])
  assert.doesNotThrow(() => validateOps(old.doc(), [{ op: 'spawn', components: { representation: { kind: 'tree', nodes: [] } } }]))
  assert.throws(() => validateOps(old.doc(), [{ op: 'spawn', components: { representation: { kind: 'rig', model: 'horse' } } }]), /no model "horse"/, 'that doc has no library yet')
  assert.doesNotThrow(() => applyOps(old, ensureLibraryOps(old.doc())))
  assert.doesNotThrow(() => validateOps(old.doc(), [{ op: 'spawn', components: { representation: { kind: 'rig', model: 'horse' } } }]))
})

test('upgrading a seed horse to a rig is one replace; resolveRepresentation reads it from the doc', () => {
  const h = seeded()
  applyOps(h, [{ op: 'replace', id: 'horse-1', component: 'representation', data: { kind: 'rig', model: 'horse', color: '#ffffff', scale: 1 } }])
  const rep = entityData(h.doc(), 'horse-1').effective.representation
  assert.equal(rep.kind, 'rig'); assert.equal(rep.model, 'horse')
  const r = resolveRepresentation(h.doc(), h.doc().entities['horse-1'].components.representation)
  assert.equal(r.key, 'model:horse:1.1')
  applyOps(h, [{ op: 'defineModel', name: 'quadruped', model: { ...JSON.parse(JSON.stringify(MODEL_LIBRARY.quadruped)), stride: 1.1 } }])
  assert.equal(resolveRepresentation(h.doc(), rep).key, 'model:horse:1.2')
})

test('read: modelData (resolved, raw) and docSummary.models are fresh plain data', () => {
  const h = seeded()
  const doc = h.doc()
  const m = modelData(doc, 'trex')
  assert.deepEqual(m.chain, ['biped', 'trex'])
  assert.equal(m.name, 'trex'); assert.equal(m.extends, 'biped'); assert.equal(m.rev, 1)
  assert.ok(m.animations.bite && m.nodes.length)
  assert.equal(typeof m.animations.walk.tracks['leg_l.rx'], 'string', 'no ImmutableString leaves read.js')
  m.nodes.length = 0
  assert.ok(modelData(doc, 'trex').nodes.length, 'a fresh copy every call')
  const raw = modelData(doc, 'trex', { raw: true })
  assert.equal(raw.extends, 'biped'); assert.ok(!raw.chain)
  assert.equal(raw.animations.walk.tracks['leg_l.rx'], undefined, 'raw is the stored patch, not the resolution')
  assert.equal(modelData(doc, 'nope'), null)
  const s = docSummary(doc)
  assert.deepEqual(s.models.map((x) => x.name), Object.keys(MODEL_LIBRARY).sort())
  const horse = s.models.find((x) => x.name === 'horse')
  assert.equal(horse.extends, 'quadruped'); assert.equal(horse.rev, 1)
  assert.ok(horse.nodes.includes('mane') && horse.nodes.includes('leg_fl'))
  assert.deepEqual(horse.clips, ['attack', 'breathe', 'die', 'idle', 'run', 'walk'])
})

test('a cycle made by concurrent edits reads as an error and renders nothing, never throws', () => {
  const h = seeded()
  applyOps(h, [{ op: 'defineModel', name: 'x', model: { nodes: [{ name: 'n' }] } }, { op: 'defineModel', name: 'y', model: { nodes: [{ name: 'm' }] } }])
  const b = fork(h)
  applyOps(h, [{ op: 'defineModel', name: 'x', model: { extends: 'y' } }])
  applyOps(b, [{ op: 'defineModel', name: 'y', model: { extends: 'x' } }])
  h.merge(b)
  const doc = h.doc()
  assert.match(modelData(doc, 'x').error, /cycle/)
  assert.match(docSummary(doc).models.find((m) => m.name === 'y').error, /cycle/)
  assert.equal(resolveRepresentation(doc, { kind: 'rig', model: 'x' }), null)
  assert.throws(() => validateOps(doc, [{ op: 'spawn', components: { representation: { kind: 'rig', model: 'x' } } }]), /cycle/)
  // and it can be repaired through the same write path
  applyOps(h, [{ op: 'defineModel', name: 'x', model: { nodes: [{ name: 'n' }] } }])
  assert.equal(modelData(h.doc(), 'y').chain.join(), 'x,y')
})

test('changeDoc handles the model ops on a bare Automerge doc', () => {
  assert.ok(OP_NAMES.includes('defineModel') && OP_NAMES.includes('removeModel'))
  let d = A.from({})
  d = A.change(d, (x) => { changeDoc(x, [{ op: 'defineModel', name: 'a', model: { nodes: [{ name: 'n', shape: 'box' }] } }]) })
  assert.equal(plain(d.models.a.rev), 1)
  d = A.change(d, (x) => { changeDoc(x, [{ op: 'removeModel', name: 'a' }]) })
  assert.deepEqual(plain(d.models), {})
})
