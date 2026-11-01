// Track B's editor pieces for rigs (design §17.5, ARCHITECTURE §6.3), the pure
// parts in Node: the kind switcher's rig ops, the critter -> rig convert, the
// Fork op shape, x-json field edits (model-backed and inline), preview args.
import test from 'node:test'
import assert from 'node:assert/strict'
import { switchKindOps, switcherKinds, pickModel, rigData, convertCritterOps, critterModel, REMOVED_KINDS } from '../../src/editor/kind-switcher.js'
import { forkOps, rigFieldOps, exactPatch, setModelOps, modelBody, uniqueModelName, previewArg, PREVIEW_STATES } from '../../src/editor/rig-ops.js'
import { presetComponents } from '../../src/editor/component-ops.js'
import { OP_NAMES } from '../../src/doc/ops.js'
import { seeded, read, applyOps, KINDS } from './d-helpers.mjs'

const WITH_CRITTER = { ...KINDS, critter: { schema: { type: 'object', properties: { rig: { enum: ['quadruped', 'biped'] }, color: { type: 'string' } } } } }

test('kind switcher offers rig and never critter, even when a registry still has it', () => {
  assert.ok(switcherKinds(KINDS).includes('rig'))
  assert.ok(!switcherKinds(WITH_CRITTER).includes('critter'))
  assert.ok(REMOVED_KINDS.has('critter'))
  assert.deepEqual(switcherKinds(WITH_CRITTER), [...switcherKinds(KINDS)])
})

test('pickModel: the asked model, else quadruped, else the first; none -> inline', () => {
  assert.equal(pickModel(['horse', 'quadruped', 'biped'], 'horse'), 'horse')
  assert.equal(pickModel(['horse', 'quadruped', 'biped'], 'nope'), 'quadruped')
  assert.equal(pickModel(['serpent', 'bird']), 'bird')
  assert.equal(pickModel([]), '')
})

test('switchKindOps to rig: one replace referencing the model (default quadruped), carried colour, inline layers dropped', () => {
  const bb = { kind: 'billboard', image: 'emoji:🐎', size: 2, color: '#884422', tint: '#ff0000' }
  const op = switchKindOps('horse-1', bb, 'rig', KINDS)
  assert.equal(op.op, 'replace'); assert.equal(op.component, 'representation')
  assert.deepEqual(op.data, { kind: 'rig', model: 'quadruped', color: '#884422', scale: 1, tint: '#ff0000', image: null, size: null })
  const horse = switchKindOps('horse-1', bb, 'rig', KINDS, { model: 'horse' })
  assert.equal(horse.data.model, 'horse')
  // a tree's nodes would carry by shape; pointing at a model drops them (nulled: the current look had them)
  const tree = switchKindOps('t1', { kind: 'tree', nodes: [{ shape: 'box' }] }, 'rig', KINDS, { model: 'biped' })
  assert.equal(tree.data.model, 'biped'); assert.equal(tree.data.nodes, null)
  // with an inherited billboard look, the own tree's nodes are simply not written
  const inh = switchKindOps('t1', { kind: 'tree', nodes: [{ shape: 'box' }] }, 'rig', KINDS, { model: 'biped', inherited: { kind: 'billboard', image: 'emoji:🌳' } })
  assert.ok(!('nodes' in inh.data)); assert.equal(inh.data.image, null)
  // no models at all: an inline rig keeps the tree's nodes
  const inline = rigData({ kind: 'tree', nodes: [{ shape: 'box' }] }, '', KINDS)
  assert.equal(inline.kind, 'rig'); assert.ok(!('model' in inline)); assert.deepEqual(inline.nodes, [{ shape: 'box' }])
})

test('convertCritterOps: quadruped -> quadruped, biped -> biped, colour (and tint) carried, critter fields nulled', () => {
  const q = convertCritterOps('c1', { kind: 'critter', rig: 'quadruped', length: 1.3, height: 0.9, color: '#97531f', head: 1, tail: 0.5 })
  assert.deepEqual(q, { op: 'replace', id: 'c1', component: 'representation', data: { kind: 'rig', model: 'quadruped', color: '#97531f', rig: null, length: null, height: null, head: null, tail: null } })
  const b = convertCritterOps('c2', { kind: 'critter', rig: 'biped', color: '#335577', tint: '#550000' }, { inherited: { kind: 'billboard', image: 'emoji:🦖', size: 3 } })
  assert.deepEqual(b.data, { kind: 'rig', model: 'biped', color: '#335577', tint: '#550000', image: null, size: null })
  assert.equal(critterModel({ rig: 'weird' }), 'quadruped')
})

test('forkOps: defineModel(newName, resolved with extends flattened) + one replace pointing the entity at it', () => {
  const resolved = { extends: 'quadruped', stride: 1.4, runSpeed: 6, nodes: [{ name: 'hips', shape: 'box' }], animations: { gait: { loop: true, tracks: { 'hips.py': 'sin(phase*tau)*0.02' } } }, controller: { states: { walk: ['gait'] }, blend: 0.2 }, rev: 4, key: 'model:horse:4' }
  const ops = forkOps('h1', { kind: 'rig', model: 'horse', color: '#aa8866', scale: 1.1 }, 'horse-2', resolved, { inherited: { kind: 'billboard', image: 'emoji:🐎' } })
  assert.equal(ops.length, 2)
  assert.deepEqual(ops[0], { op: 'defineModel', name: 'horse-2', model: { extends: '', stride: 1.4, runSpeed: 6, nodes: resolved.nodes, animations: resolved.animations, controller: resolved.controller } })
  assert.ok(!('rev' in ops[0].model) && !('key' in ops[0].model), 'rev is the op\'s, key is the resolver\'s')
  assert.deepEqual(ops[1], { op: 'replace', id: 'h1', component: 'representation', data: { kind: 'rig', model: 'horse-2', color: '#aa8866', scale: 1.1, image: null } })
  // an inline rig forks into the library too; its inline layers leave the entity
  const inl = forkOps('t1', { kind: 'rig', nodes: [{ name: 'a' }], animations: {} }, 'mine', { nodes: [{ name: 'a' }], animations: {}, controller: {} })
  assert.equal(inl[1].data.model, 'mine'); assert.equal(inl[1].data.nodes, null); assert.equal(inl[1].data.animations, null)
  assert.throws(() => forkOps('t1', {}, '', resolved), /name/)
  assert.equal(uniqueModelName('horse', ['horse', 'horse-2']), 'horse-3')
  assert.equal(uniqueModelName('horse-3', ['horse']), 'horse-2')
  assert.match(uniqueModelName('', []), /^model-2$/)
})

test('rigFieldOps: a model-backed look redefines the model; an inline look sets exactly that field', () => {
  const own = { extends: 'quadruped', nodes: [{ name: 'mane' }], animations: { wag: { tracks: { 'tail.ry': 'sin(t*8)*20' } } }, rev: 3 }
  const m = rigFieldOps('h1', { model: 'horse', own }, 'animations', { wag: { tracks: { 'tail.ry': 'sin(t*12)*20' } } })
  assert.deepEqual(m.ops, [{ op: 'defineModel', name: 'horse', model: { extends: 'quadruped', nodes: [{ name: 'mane' }], animations: { wag: { tracks: { 'tail.ry': 'sin(t*12)*20' } } } } }])
  assert.deepEqual(m.candidate, m.ops[0].model)
  const rep = { kind: 'rig', nodes: [{ name: 'a' }], animations: { one: { tracks: { 'a.rx': '1' } }, two: { tracks: { 'a.ry': '2' } } } }
  const i = rigFieldOps('t1', { inline: true, rep }, 'animations', { one: { tracks: { 'a.rx': '3' } } })
  assert.deepEqual(i.ops, [{ op: 'set', id: 't1', component: 'representation', patch: { animations: { two: null, one: { tracks: { 'a.rx': '3' } } } } }], 'a dropped clip is nulled, or set would keep it')
  assert.deepEqual(i.candidate.nodes, rep.nodes)
  assert.throws(() => rigFieldOps('t1', { inline: true, rep }, 'color', '#fff'), /not a rig field/)
  assert.deepEqual(exactPatch({ a: 1, b: { c: 2, d: 3 } }, { b: { c: 2 } }), { a: null, b: { d: null, c: 2 } })
})

test('setModelOps and previewArg', () => {
  assert.deepEqual(setModelOps('e', { kind: 'rig', model: 'horse' }, 'sheep'), [{ op: 'set', id: 'e', component: 'representation', patch: { model: 'sheep' } }])
  assert.deepEqual(setModelOps('e', { kind: 'rig', nodes: [{}] }, 'sheep'), [{ op: 'set', id: 'e', component: 'representation', patch: { model: 'sheep', nodes: null } }])
  assert.deepEqual(setModelOps('e', { kind: 'rig', model: 'horse' }, '', { resolved: { nodes: [{ name: 'a' }], animations: {}, controller: { blend: 0.1 }, rev: 2 } }),
    [{ op: 'set', id: 'e', component: 'representation', patch: { model: null, nodes: [{ name: 'a' }], animations: {}, controller: { blend: 0.1 } } }])
  assert.deepEqual(PREVIEW_STATES, ['idle', 'walk', 'run', 'attack', 'die', 'sit'])
  assert.deepEqual(previewArg('walk'), { anim: 'walk' })
  for (const off of ['', 'off', null, 'dance']) assert.equal(previewArg(off), null)
  assert.deepEqual(modelBody({ nodes: [], rev: 9, key: 'k', name: 'x' }), { nodes: [] })
})

test('applied to the seeded doc: switch a sheep to a rig, convert a critter, fork (needs track A\'s defineModel)', { skip: !OP_NAMES.includes('defineModel') && 'track A\'s defineModel op is not in ops.js yet' }, () => {
  const h = seeded()
  const inherited = presetComponents(read, h.doc(), 'sheep').representation
  const sw = switchKindOps('sheep-1', read.entityData(h.doc(), 'sheep-1').effective.representation, 'rig', KINDS, { inherited, model: 'sheep' })
  applyOps(h, [sw])
  const rep = read.entityData(h.doc(), 'sheep-1').effective.representation
  assert.equal(rep.kind, 'rig'); assert.equal(rep.model, 'sheep'); assert.ok(!('image' in rep))
  const models = read.plain(h.doc().models ?? {})
  assert.ok(models.sheep, 'the seed writes the library (ensureLibrary)')
  applyOps(h, [convertCritterOps('sheep-1', { kind: 'critter', rig: 'biped', color: '#123456' }, { inherited })])
  assert.equal(read.entityData(h.doc(), 'sheep-1').effective.representation.model, 'biped')
  const fork = forkOps('sheep-1', read.entityData(h.doc(), 'sheep-1').effective.representation, 'biped-2', { nodes: models.biped.nodes, animations: models.biped.animations ?? {}, controller: models.biped.controller ?? {} }, { inherited })
  applyOps(h, fork)
  assert.ok(h.doc().models['biped-2'])
  assert.equal(read.entityData(h.doc(), 'sheep-1').effective.representation.model, 'biped-2')
})

test('a JSON-box edit of a model keeps every field it does not touch (description included)', () => {
  const h = seeded()
  const before = read.plain(h.doc().models.horse)
  assert.ok(before.description, 'library models carry a description')
  const own = read.modelData(h.doc(), 'horse', { raw: true })
  const { ops } = rigFieldOps('h1', { model: 'horse', own }, 'controller', { ...(own.controller ?? {}), blend: 0.3 })
  applyOps(h, ops)
  const after = read.plain(h.doc().models.horse)
  assert.equal(after.controller.blend, 0.3)
  for (const k of Object.keys(before)) if (k !== 'controller' && k !== 'rev') assert.deepEqual(after[k], before[k], k)
  assert.equal(after.rev, before.rev + 1)
  // the editor's body carries every field the doc's model holds
  assert.equal(modelBody(before).description, before.description)
})
