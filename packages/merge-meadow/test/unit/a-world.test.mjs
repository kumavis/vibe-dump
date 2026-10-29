import test from 'node:test'
import assert from 'node:assert/strict'
import { seeded, fork } from './a-helpers.mjs'
import { World } from '../../src/core/world.js'
import { watch } from '../../src/doc/watch.js'
import { applyOps } from '../../src/doc/ops.js'

// a world mirroring a handle through watch(), with lifecycle logging
function mirrored (h, opts) {
  const w = new World(opts)
  const log = []
  w.registerComponent('transform', { order: -100, add: (e) => log.push(`add transform ${e.id}`), remove: (e) => log.push(`remove transform ${e.id}`) })
  w.registerComponent('representation', {
    add: (e, d) => log.push(`add rep ${e.id} ${d.kind}`),
    change: (e, d, prev) => log.push(`change rep ${e.id} ${prev.kind}->${d.kind}`),
    remove: (e) => log.push(`remove rep ${e.id}`),
  })
  watch(h, ({ doc, patches, initial }) => (initial ? w.load(doc) : w.applyPatches(doc, patches)))
  return { w, log }
}

test('reconcile from real patches: add (in component order), nested edit, delete', () => {
  const h = seeded()
  const { w, log } = mirrored(h)
  assert.equal(w.entities.size, 14)
  // transform (-100) is added before representation (10) for every entity
  const i = log.indexOf('add transform trex-1'); const j = log.indexOf('add rep trex-1 billboard')
  assert.ok(i >= 0 && j > i)
  log.length = 0
  applyOps(h, [{ op: 'spawn', id: 'dolly', preset: 'sheep', at: [3, 0, 3] }])
  assert.deepEqual(log, ['add transform dolly', 'add rep dolly billboard'])
  assert.ok(w.has('dolly', 'brain') && w.get('dolly').c.tags.prey)
  log.length = 0
  applyOps(h, [{ op: 'set', id: 'dolly', component: 'representation', patch: { size: 4 } }])
  assert.deepEqual(log, ['change rep dolly billboard->billboard'])
  assert.equal(w.get('dolly').c.representation.size, 4)
  log.length = 0
  applyOps(h, [{ op: 'replace', id: 'dolly', component: 'representation', data: { kind: 'critter', rig: 'quadruped' } }])
  assert.deepEqual(log, ['change rep dolly billboard->critter'])
  log.length = 0
  applyOps(h, [{ op: 'set', id: 'dolly', component: 'body', patch: { speed: 1 } }])
  assert.deepEqual(log, [], 'unrelated component edits do not touch representation handlers')
  const e = w.get('dolly')
  applyOps(h, [{ op: 'despawn', id: 'dolly' }])
  assert.deepEqual(log, ['remove rep dolly', 'remove transform dolly'], 'removed in reverse order')
  assert.equal(w.get('dolly'), undefined)
  assert.ok(![...w.query('brain')].includes(e))
})

test('reconcile: a preset edit dirties every instance; a new preset resolves waiting instances', () => {
  const h = seeded()
  const { w } = mirrored(h)
  applyOps(h, [{ op: 'set', id: 'sheep-2', component: 'body', patch: { speed: 2 } }])
  applyOps(h, [{ op: 'definePreset', name: 'sheep', preset: { extends: 'creature', components: { tags: { prey: true, woolly: true }, body: { speed: 6, radius: 0.6 }, representation: { kind: 'billboard', image: 'emoji:🐏', size: 1.2 } } } }])
  for (const id of ['sheep-1', 'sheep-2', 'sheep-3']) assert.equal(w.get(id).c.tags.woolly, true, id)
  assert.equal(w.get('sheep-1').c.body.speed, 6)
  assert.equal(w.get('sheep-2').c.body.speed, 2, 'own override still wins')
  assert.equal(String(w.get('sheep-1').c.representation.image), 'emoji:🐏', 'doc-backed strings are ImmutableString: compare with String()')
  // an instance of a preset that does not exist yet picks it up when it is defined
  applyOps(h, [{ op: 'spawn', id: 'w1', preset: 'sheep' }, { op: 'set', id: 'w1', component: 'tags', patch: {} }])
  h.change((d) => { d.entities.w1.preset = d.entities['trex-1'].preset; d.entities.w1.preset = 'wolf' }) // test-only direct write: preset name not yet defined
  assert.equal(w.get('w1').c.brain, undefined)
  applyOps(h, [{ op: 'definePreset', name: 'wolf', preset: { extends: 'creature', components: { tags: { predator: true } } } }])
  assert.equal(w.get('w1').c.tags.predator, true)
  assert.ok(w.get('w1').c.brain)
})

test('reconcile: a group toggle layers last and moves the entity between queries', () => {
  const h = seeded()
  const { w } = mirrored(h)
  const thinking = w.query('brain', '!dead')
  const e = w.get('trex-1')
  assert.ok(thinking.has(e))
  applyOps(h, [{ op: 'addGroup', id: 'trex-1', group: 'dead' }])
  assert.ok(!thinking.has(e), 'the dead group removes brain')
  assert.ok(e.groups.has('dead'))
  assert.equal(e.c.tags.dead, true)
  assert.equal(String(e.c.representation.tint), '#555555')
  applyOps(h, [{ op: 'removeGroup', id: 'trex-1', group: 'dead' }])
  assert.ok(thinking.has(e))
  assert.equal(e.c.representation.tint, undefined)
})

test('reconcile: a component def change refreshes defs, lifecycle order follows the def', () => {
  const h = seeded()
  const w = new World()
  watch(h, ({ doc, patches, initial }) => (initial ? w.load(doc) : w.applyPatches(doc, patches)))
  const rev = w.defsRev
  assert.equal(w.componentOrder('representation'), 10, 'unregistered: the doc def order')
  applyOps(h, [{ op: 'defineComponent', name: 'representation', def: { order: -500, description: 'looks' } }])
  assert.ok(w.defsRev > rev)
  assert.equal(w.componentOrder('representation'), -500)
  w.registerComponent('representation', { order: 3 })
  assert.equal(w.componentOrder('representation'), 3, 'a registered handler wins')
  // unknown components are data: queryable before anyone registers them
  applyOps(h, [{ op: 'set', id: 'sheep-1', component: 'hunger', patch: { rate: 2 } }])
  assert.deepEqual([...w.query('hunger')].map((e) => e.id), ['sheep-1'])
  const added = []
  w.registerComponent('hunger', { add: (e, d) => added.push([e.id, d.rate]) })
  assert.deepEqual(added, [['sheep-1', 2]], 'late registration sees existing data')
})

test('reconcile: remote merges, frozen data, multiple handlers per component', () => {
  const h = seeded()
  const { w } = mirrored(h)
  const order = []
  w.registerComponent('light', { order: 5, add: () => order.push('b') })
  w.registerComponent('light', { order: -5, add: () => order.push('a') })
  assert.deepEqual(order, ['b', 'a'], 'late registration fires add for the lamp that already has a light')
  order.length = 0
  applyOps(h, [{ op: 'set', id: 'rock-1', component: 'light', patch: { kind: 'point' } }])
  assert.deepEqual(order, ['a', 'b'])
  const b = fork(h)
  applyOps(b, [{ op: 'set', id: 'sheep-3', component: 'tags', patch: { remote: true } }])
  h.merge(b)
  assert.equal(w.get('sheep-3').c.tags.remote, true)
  const c = w.get('sheep-3').c
  assert.ok(Object.isFrozen(c.tags) && Object.isFrozen(c.body))
  assert.throws(() => { 'use strict'; c.body.speed = 99 }, TypeError)
})

test('local entities: same shape, upsert, never touched by doc reconcile', () => {
  const h = seeded()
  const { w, log } = mirrored(h)
  const comps = { transform: { p: [1, 2, 3], r: [0, 0, 0], s: [1, 1, 1] }, tags: { player: true } }
  const e = w.addLocal('player:p_a', { name: 'Ann', components: comps })
  assert.equal(e.local, true)
  assert.ok(!Object.isFrozen(comps.tags), "the caller's objects are copied, not frozen")
  assert.ok(Object.isFrozen(e.c.tags))
  assert.ok(log.includes('add transform player:p_a'))
  w.addLocal('player:p_a', { name: 'Ann', components: { ...comps, representation: { kind: 'billboard' } } })
  assert.ok(log.includes('add rep player:p_a billboard'))
  w.load(h.doc())
  assert.ok(w.get('player:p_a'))
  assert.throws(() => w.addLocal('sheep-1', {}), /doc entity/)
  w.removeLocal('player:p_a')
  assert.equal(w.get('player:p_a'), undefined)
})

test('systems run in order, disabledSystems skip, a throwing system is isolated', () => {
  const h = seeded()
  const { w } = mirrored(h)
  const ran = []
  const origError = console.error; console.error = () => {}
  try {
    w.addSystem({ name: 'b', order: 10, update: () => ran.push('b') })
    w.addSystem({ name: 'a', order: 10, update: () => ran.push('a') })
    w.addSystem({ name: 'boom', order: 5, update: () => { throw new Error('x') } })
    w.addSystem({ name: 'q', order: 1, query: ['brain'], update: (world, dt, set) => ran.push(`q${set.size}`) })
    w.tick(1 / 30)
    assert.deepEqual(ran, ['q5', 'a', 'b'])
    applyOps(h, [{ op: 'setWorld', patch: { disabledSystems: { a: true } } }])
    ran.length = 0
    w.tick(1 / 30)
    assert.deepEqual(ran, ['q5', 'b'])
    assert.equal(w.errors()[0].count, 2)
    assert.equal(w.tickCount, 2)
    assert.ok(Math.abs(w.time - 2 / 30) < 1e-12)
  } finally { console.error = origError }
})

test('ops queue: drainOps drops ops for vanished entities and idempotent duplicates', () => {
  const h = seeded()
  const { w } = mirrored(h)
  w.queueOps({ op: 'addGroup', id: 'sheep-1', group: 'dead' })
  w.queueOps([{ op: 'addGroup', id: 'sheep-1', group: 'dead' }, { op: 'hit', id: 'gone', hitId: 'a:1', amount: 1 }, { op: 'spawn', id: 'n1' }, { op: 'set', id: 'n1', component: 'tags', patch: { a: true } }, { op: 'setWorld', patch: { bounds: 50 } }])
  const ops = w.drainOps()
  assert.deepEqual(ops.map((o) => `${o.op}:${o.id ?? ''}`), ['addGroup:sheep-1', 'spawn:n1', 'set:n1', 'setWorld:'])
  assert.deepEqual(w.drainOps(), [])
  assert.doesNotThrow(() => applyOps(h, ops))
})

test('ownership is injected; rand is deterministic per entity and tick', () => {
  const a = new World({ peerId: 'A' }); const b = new World({ peerId: 'B' })
  assert.equal(a.owns('x'), true)
  assert.equal(a.owner('x'), 'A')
  a.setOwnership({ owns: (id) => id === 'mine', owner: () => 'Z', isHost: () => false })
  assert.equal(a.owns('mine'), true); assert.equal(a.owns('x'), false); assert.equal(a.owner('x'), 'Z'); assert.equal(a.isHost(), false)
  const seq = (w) => [w.rand('e1'), w.rand('e1'), w.rand('e2')]
  assert.deepEqual(seq(a), seq(b))
  const s0 = a.rand('e1')
  a.tick(1 / 30); b.tick(1 / 30)
  assert.deepEqual(seq(a), seq(b))
  assert.notEqual(a.rand('e1'), s0)
  for (let i = 0; i < 1000; i++) { const r = a.rand('q'); assert.ok(r >= 0 && r < 1) }
})
