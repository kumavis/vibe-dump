// Review fixes for rigs (design §17): the concurrently created doc.models heals
// to the union, model keys follow content, `__proto__` never passes validation,
// old trees stay editable, a misspelt stub under `extends` is refused.
import test from 'node:test'
import assert from 'node:assert/strict'
import { seeded, fork, heads, A } from './a-helpers.mjs'
import { applyOps, validateOps, splitValidOps, healModels, modelsToHeal } from '../../src/doc/ops.js'
import { plain, modelData } from '../../src/doc/read.js'
import { MODEL_LIBRARY, ensureLibraryOps, resolveRepresentation, validateModel, validateInline, resolveModel } from '../../src/doc/models.js'
import { isName, isId } from '../../src/doc/schema.js'

const lib = () => JSON.parse(JSON.stringify(MODEL_LIBRARY))
const preRig = () => { const h = seeded(); h.change((d) => { delete d.models }); return h }
const merged = (a, b) => { a.merge(b); return a }

test('a pre-rig world: two peers that each create doc.models keep the union after heal (library + agent model)', () => {
  for (let trial = 0; trial < 6; trial++) {
    const base = preRig()
    const a = fork(base); const b = fork(base)
    applyOps(a, ensureLibraryOps(a.doc()), { message: 'model library' }) // main.js on open
    applyOps(b, [{ op: 'defineModel', name: 'blob', model: { nodes: [{ name: 'b', shape: 'sphere', color: '#00ff00' }] } }]) // an agent in local mode
    const [x, y] = trial % 2 ? [a, b] : [b, a]
    merged(x, y)
    const before = Object.keys(x.doc().models)
    const libSize = Object.keys(MODEL_LIBRARY).length
    assert.ok(before.length === 1 || before.length === libSize, `Automerge shows one map whole (${before})`)
    assert.equal(modelsToHeal(x.doc()), libSize + 1 - before.length)
    healModels(x)
    assert.deepEqual(Object.keys(x.doc().models).sort(), [...Object.keys(MODEL_LIBRARY), 'blob'].sort(), 'the union survives')
    assert.equal(modelsToHeal(x.doc()), 0)
    const h0 = heads(x); assert.equal(healModels(x), 0); assert.deepEqual(heads(x), h0, 'nothing to heal: no change')
    // the healed models are real models: they resolve and render
    assert.ok(resolveRepresentation(x.doc(), { kind: 'rig', model: 'horse' }))
    assert.equal(modelData(x.doc(), 'blob').nodes[0].color, '#00ff00')
    // a model removed after the heal is not brought back by the next heal
    applyOps(x, [{ op: 'removeModel', name: 'blob' }])
    healModels(x)
    assert.equal(Object.hasOwn(plain(x.doc().models), 'blob'), false)
    // both peers healing at once converge on the same union
    const p = fork(x); const q = fork(x)
    healModels(p); healModels(q); merged(p, q)
    assert.deepEqual(Object.keys(p.doc().models).sort(), Object.keys(MODEL_LIBRARY).sort())
  }
})

test('model keys follow content: concurrent first definitions and remove + redefine re-key', () => {
  const h = seeded()
  const a = fork(h); const b = fork(h)
  const wiz = (color) => ({ extends: 'biped', nodes: [{ name: 'head', children: [{ name: 'hat', shape: 'cone', p: [0, 0.5, 0], s: [0.34, 0.5, 0.34], color }] }] })
  applyOps(a, [{ op: 'defineModel', name: 'mage', model: wiz('#3b2a7a') }])
  applyOps(b, [{ op: 'defineModel', name: 'mage', model: wiz('#ff0000') }])
  const rep = { kind: 'rig', model: 'mage' }
  const ka = resolveRepresentation(a.doc(), rep).key; const kb = resolveRepresentation(b.doc(), rep).key
  assert.match(ka, /^model:mage:1\.1:/); assert.match(kb, /^model:mage:1\.1:/)
  assert.notEqual(ka, kb, 'same revs, different content: different keys')
  merged(a, b); merged(b, a)
  const k = resolveRepresentation(a.doc(), rep).key
  assert.equal(k, resolveRepresentation(b.doc(), rep).key, 'both peers agree after the merge')
  const hat = modelData(a.doc(), 'mage').nodes.flatMap(function f (n) { return [n, ...(n.children ?? []).flatMap(f)] }).find((n) => n.name === 'hat')
  assert.equal(k === ka, hat.color === '#3b2a7a', 'the key names the content that won')
  // remove + redefine: the rev starts again at 1, the key still moves
  const c = seeded()
  applyOps(c, [{ op: 'defineModel', name: 'mage', model: wiz('#3b2a7a') }])
  const k1 = resolveRepresentation(c.doc(), rep).key
  applyOps(c, [{ op: 'removeModel', name: 'mage' }, { op: 'defineModel', name: 'mage', model: wiz('#00ff00') }])
  const k2 = resolveRepresentation(c.doc(), rep).key
  assert.match(k2, /^model:mage:1\.1:/)
  assert.notEqual(k1, k2)
})

test('__proto__ is never a name: refused by validation, never written, never resolved', () => {
  assert.equal(isName('__proto__'), false); assert.equal(isId('__proto__'), false)
  assert.equal(isName('constructor'), true, 'other prototype member names are ordinary names')
  const h = seeded()
  const h0 = heads(h)
  assert.throws(() => applyOps(h, [{ op: 'defineModel', name: '__proto__', model: { nodes: [{ shape: 'box' }] } }]), /bad model name/)
  assert.deepEqual(heads(h), h0)
  const { ok, dropped } = splitValidOps(h.doc(), [{ op: 'defineModel', name: '__proto__', model: { nodes: [{ shape: 'box' }] } }, { op: 'setMeta', patch: { title: 'x' } }])
  assert.equal(ok.length, 1); assert.equal(dropped.length, 1, 'splitValidOps drops it instead of dying in the change')
  assert.throws(() => validateOps(h.doc(), [{ op: 'defineModel', name: 'ghost', model: { extends: '__proto__' } }]), /extends/)
  assert.throws(() => validateOps(h.doc(), [{ op: 'removeModel', name: '__proto__' }]), /no model/)
  assert.throws(() => validateOps(h.doc(), [{ op: 'spawn', components: { representation: { kind: 'rig', model: '__proto__' } } }]), /no model "__proto__"/)
  assert.throws(() => validateOps(h.doc(), [{ op: 'spawn', components: { representation: { kind: 'rig', model: 'constructor' } } }]), /no model "constructor"/)
  assert.equal(resolveModel(lib(), '__proto__'), null)
  assert.equal(resolveModel(lib(), 'toString'), null)
  assert.equal(modelData(h.doc(), '__proto__'), null)
  // an own __proto__ key from JSON (MCP input) stays visible to the validators
  const fromJson = JSON.parse('{"nodes":[{"name":"b","shape":"box"}],"animations":{"__proto__":{"tracks":{"zz.rx":"1"}}}}')
  assert.ok(Object.hasOwn(plain(fromJson).animations, '__proto__'), 'plain keeps an own __proto__ as data')
  assert.match(validateModel(fromJson, lib()).join('\n'), /bad clip name "__proto__"/)
  // a controller state naming a prototype member is not a clip
  assert.match(validateModel({ nodes: [{ name: 'b', shape: 'box' }], animations: { a: { tracks: { 'b.rx': '1' } } }, controller: { states: { idle: 'constructor' } } }, lib()).join('\n'), /no clip named "constructor"/)
})

test('a redefinition drops a clip named like a prototype member; its undo removes it too', () => {
  const h = seeded()
  const m = { nodes: [{ name: 'b', shape: 'box' }], animations: { constructor: { tracks: { 'b.rx': 'sin(t)' } }, toString: { tracks: { 'b.ry': '1' } } } }
  const out = applyOps(h, [{ op: 'defineModel', name: 'thing', model: m }])
  assert.deepEqual(Object.keys(plain(h.doc().models.thing.animations)).sort(), ['constructor', 'toString'])
  applyOps(h, [{ op: 'defineModel', name: 'thing', model: { nodes: m.nodes, animations: {} } }])
  assert.deepEqual(Object.keys(plain(h.doc().models.thing.animations)), [], 'diffInto deletes keys the definition lacks, prototype names included')
  applyOps(h, out.inverse)
  assert.equal(h.doc().models.thing, undefined)
})

test('an old tree (repeated and odd names, extra fields, shape aliases, CSS colours) stays editable', () => {
  const h = seeded()
  const nodes = [{ name: 'leg', shape: 'box', p: [0, 0.5, 0] }, { name: 'leg', shape: 'box', p: [0.3, 0.5, 0] }, { name: 'Left Arm', shape: 'cube', color: 'red', label: 'arm' }]
  h.change((d) => { d.entities['tree-1'].components.representation = { kind: 'tree', nodes } }) // as the old validator allowed
  const id = 'tree-1'
  const ok = (ops) => assert.doesNotThrow(() => validateOps(h.doc(), ops), JSON.stringify(ops))
  const moved = JSON.parse(JSON.stringify(nodes)); moved[0].p = [0, 0.6, 0]
  ok([{ op: 'set', id, component: 'representation', patch: { nodes: moved } }])
  ok([{ op: 'replace', id, component: 'representation', data: plain(h.doc().entities[id].components.representation) }])
  // animating it: a track must name exactly one node
  assert.throws(() => validateOps(h.doc(), [{ op: 'set', id, component: 'representation', patch: { animations: { sway: { tracks: { 'leg.rz': 'sin(t)*5' } } } } }]), /2 nodes are named "leg"/)
  const named = JSON.parse(JSON.stringify(nodes)); named[1].name = 'leg2'
  ok([{ op: 'set', id, component: 'representation', patch: { nodes: named, animations: { sway: { tracks: { 'leg.rz': 'sin(t)*5' } } } } }])
  // the renderer keeps both repeated-name nodes (an inline look is not patched by name)
  assert.equal(resolveRepresentation(null, { kind: 'tree', nodes }).nodes.length, 3)
  // inline clips and controller stay strict
  assert.match(validateInline({ nodes, animations: { a: { tracks: { 'leg2.rx': 'sin(x)' } } } }).join('\n'), /no node named "leg2"|unknown identifier/)
  assert.match(validateInline({ nodes: [{ name: 'a' }], controller: { states: { idle: 'nope' } } }).join('\n'), /no clip named "nope"/)
  // models in doc.models stay strict
  assert.match(validateModel({ nodes }, lib()).join('\n'), /duplicate node name "leg"/)
})

test('extends: a stub naming no base node is refused with the nearest name; a new node with a shape is fine', () => {
  const L = lib()
  const staff = { name: 'staff', shape: 'cylinder', p: [0, -0.3, 0.1], s: [0.04, 1.6, 0.04] }
  const v = (nodes) => validateModel({ extends: 'biped', nodes }, L, { name: 'wizard' }).join('\n')
  assert.match(v([{ name: 'right_arm', children: [staff] }]), /"right_arm" is not a node of biped \(did you mean "arm_r"\?\)/)
  assert.match(v([{ name: 'Head', children: [staff] }]), /did you mean "head"/)
  assert.match(v([{ name: 'arm_r', children: [{ name: 'hand_rr', children: [staff] }] }]), /nodes\[0\]\.children\[0\]: "hand_rr" is not a node of biped/)
  assert.match(v([{ name: 'tial', remove: true }]), /remove names "tial", which is not a node of biped/)
  assert.equal(v([{ name: 'arm_r', children: [staff] }]), '')
  assert.equal(v([{ name: 'cape', shape: 'box', p: [0, 1, -0.1] }]), '', 'a new node')
  assert.equal(v([{ name: 'pivot', p: [0, 1, 0], children: [staff] }]), '', 'a new pivot has a position')
  for (const n of Object.keys(L)) assert.deepEqual(validateModel(L[n], L, { name: n }), [], n)
})
