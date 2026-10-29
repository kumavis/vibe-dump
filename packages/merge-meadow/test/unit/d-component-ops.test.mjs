import test from 'node:test'
import assert from 'node:assert/strict'
import { patchFor, valueAt, editOps, componentOrigin, removeComponentOps, resetComponentOps, addComponentOps, presetComponents, healOps, representationSchema, sortComponents, expandMoves } from '../../src/editor/component-ops.js'
import { moveOps, withMoves } from '../../src/doc/ops.js'
import { COMPONENT_DEFS } from '../../src/doc/presets.js'
import { seeded, read, applyOps, KINDS } from './d-helpers.mjs'

test('patchFor: nested paths become nested patches; an index rewrites the array with one element changed', () => {
  assert.deepEqual(patchFor(['drives', 'hunt', 'weight'], 3, {}), { drives: { hunt: { weight: 3 } } })
  assert.deepEqual(patchFor(['p', 1], 5, { p: [1, 2, 3] }), { p: [1, 5, 3] })
  assert.deepEqual(patchFor(['seats', 0, 'offset', 2], 0.5, { seats: [{ offset: [0, 1.5, 0] }] }), { seats: [{ offset: [0, 1.5, 0.5] }] })
  assert.deepEqual(patchFor(['speed'], null, { speed: 3 }), { speed: null }, 'null deletes in a set patch')
  assert.throws(() => patchFor([0], 1, {}))
  assert.equal(valueAt({ a: { b: [0, 7] } }, ['a', 'b', 1]), 7)
})

test('editOps: a field edit is one set; the doc keeps the preset value it did not touch', () => {
  const h = seeded()
  const row = read.entityData(h.doc(), 'trex-1')
  const ops = editOps({ row, comp: 'attack', path: ['damage'], value: 40, doc: h.doc(), moveOps })
  assert.deepEqual(ops, [{ op: 'set', id: 'trex-1', component: 'attack', patch: { damage: 40 } }])
  applyOps(h, ops)
  const after = read.entityData(h.doc(), 'trex-1')
  assert.equal(after.effective.attack.damage, 40)
  assert.equal(after.effective.attack.reach, 1.5, 'inherited reach survives the override')
  assert.deepEqual(after.components.attack, { damage: 40 })
})

test('editOps: moving a simulated entity also sends the owner an inbox move; a static one is a plain set', () => {
  const h = seeded()
  const sheep = read.entityData(h.doc(), 'sheep-1')
  const ops = editOps({ row: sheep, comp: 'transform', path: ['p', 0], value: 1, doc: h.doc(), moveOps })
  assert.equal(ops[0].op, 'transform'); assert.deepEqual(ops[0].p, [1, 0, 2])
  assert.equal(ops[1].op, 'push'); assert.equal(ops[1].event.type, 'move')
  applyOps(h, ops)
  assert.deepEqual(read.entityData(h.doc(), 'sheep-1').effective.transform.p, [1, 0, 2])
  assert.equal(Object.keys(read.entityData(h.doc(), 'sheep-1').inbox).length, 1)
  const tree = read.entityData(h.doc(), 'tree-1')
  const t = editOps({ row: tree, comp: 'transform', path: ['p', 2], value: -3, doc: h.doc(), moveOps })
  assert.deepEqual(t, [{ op: 'set', id: 'tree-1', component: 'transform', patch: { p: [-12, 0, -3] } }])
})

test('removeComponentOps: own -> remove; inherited -> a null override via define that writes nothing else', () => {
  const h = seeded()
  const doc = () => h.doc()
  const row = read.entityData(doc(), 'sheep-1')
  const pc = presetComponents(read, doc(), 'sheep')
  assert.equal(pc.body.speed, 6.5); assert.equal(pc.health.max, 30); assert.ok(pc.on.died)
  assert.equal(componentOrigin(row, 'transform', pc), 'own')
  assert.equal(componentOrigin(row, 'brain', pc), 'inherited')
  const ops = removeComponentOps(row, 'brain', pc)
  assert.equal(ops[0].op, 'define')
  applyOps(h, ops)
  const after = read.entityData(doc(), 'sheep-1')
  assert.ok(!('brain' in after.effective), 'the sheep no longer has a brain')
  assert.deepEqual(after.effective.transform, row.effective.transform, 'transform untouched')
  assert.deepEqual(removeComponentOps(after, 'transform', pc), [{ op: 'remove', id: 'sheep-1', component: 'transform' }])
  applyOps(h, [{ op: 'set', id: 'sheep-1', component: 'body', patch: { speed: 7 } }])
  const over = read.entityData(doc(), 'sheep-1')
  assert.equal(componentOrigin(over, 'body', pc), 'override')
  applyOps(h, resetComponentOps(over, 'body'))
  assert.equal(read.entityData(doc(), 'sheep-1').effective.body.speed, 6.5, 'reset shows the preset value again')
})

test('addComponentOps / healOps / representationSchema / sortComponents', () => {
  const h = seeded()
  applyOps(h, addComponentOps('rock-1', 'light', COMPONENT_DEFS.light))
  assert.equal(read.entityData(h.doc(), 'rock-1').effective.light.intensity, 6)
  applyOps(h, [{ op: 'hit', id: 'sheep-2', hitId: 'x:1', amount: 50 }, { op: 'addGroup', id: 'sheep-2', group: 'dead' }])
  assert.equal(read.hp(read.entityData(h.doc(), 'sheep-2').effective.health), 0)
  applyOps(h, healOps(read.entityData(h.doc(), 'sheep-2')))
  const healed = read.entityData(h.doc(), 'sheep-2')
  assert.equal(read.hp(healed.effective.health), 30); assert.ok(!healed.groups.includes('dead'))
  const s = representationSchema(COMPONENT_DEFS.representation.schema, KINDS, 'billboard')
  assert.deepEqual(Object.keys(s.properties).sort(), ['color', 'image', 'size', 'tint'])
  assert.deepEqual(sortComponents(['representation', 'body', 'transform', 'tags'], COMPONENT_DEFS), ['transform', 'body', 'tags', 'representation'])
})

test('expandMoves: an undo of a sheep move reaches its owner through the inbox', () => {
  const h = seeded()
  const ops = expandMoves(h.doc(), [{ op: 'transform', id: 'sheep-1', p: [0, 0, 0], r: [0, 10, 0] }, { op: 'transform', id: 'tree-1', p: [1, 0, 1] }, { op: 'setName', id: 'tree-1', name: 'Oak' }], withMoves)
  assert.deepEqual(ops.map((o) => o.op), ['transform', 'transform', 'setName', 'push'], 'moves go at the end')
  assert.equal(ops[3].event.yaw, 10); assert.deepEqual(ops[3].event.p, [0, 0, 0])
})

test('withMoves: every way of writing a simulated entity\'s pose becomes one inbox move', () => {
  const h = seeded()
  const d = h.doc()
  const mv = (ops) => withMoves(d, ops).filter((o) => o.op === 'push').map((o) => o.event)
  assert.deepEqual(mv([{ op: 'define', id: 'sheep-1', entity: { components: { transform: { p: [20, 0, 20] } } } }]), [{ type: 'move', p: [20, 0, 20] }])
  assert.deepEqual(mv([{ op: 'replace', id: 'sheep-1', component: 'transform', data: { p: [1, 0, 1], r: [0, 45, 0], s: [1, 1, 1] } }]), [{ type: 'move', p: [1, 0, 1], yaw: 45 }])
  assert.deepEqual(mv([{ op: 'set', id: 'sheep-1', component: 'transform', patch: { r: [0, 90, 0] } }]), [{ type: 'move', yaw: 90 }], 'yaw only: no stale p')
  assert.deepEqual(mv([{ op: 'set', id: 'sheep-1', component: 'transform', patch: { s: [2, 2, 2] } }]), [], 'scale is a pure rest-pose edit')
  assert.deepEqual(mv([{ op: 'transform', id: 'tree-1', p: [1, 0, 1] }]), [], 'a static entity needs no move')
  assert.deepEqual(mv([{ op: 'transform', id: 'sheep-1', p: [1, 0, 1] }, { op: 'transform', id: 'sheep-1', yaw: 30 }]), [{ type: 'move', p: [1, 0, 1], yaw: 30 }], 'one move per entity')
  assert.deepEqual(mv([{ op: 'transform', id: 'sheep-1', p: [1, 0, 1] }, { op: 'despawn', id: 'sheep-1' }]), [])
  const once = moveOps(d, 'sheep-1', [3, 0, 3], 0)
  assert.equal(withMoves(d, once).length, once.length, 'a batch that already moves it is left alone')
  assert.deepEqual(withMoves(d, [{ op: 'transform', id: 'sheep-1', p: [1, 0, 1] }], { skip: () => true }).length, 1)
})

test('editOps: a yaw-only edit of a simulated entity keeps its live position', () => {
  const h = seeded()
  const rex = read.entityData(h.doc(), 'trex-1')
  const ops = editOps({ row: rex, comp: 'transform', path: ['r', 1], value: 90, doc: h.doc(), moveOps })
  assert.deepEqual(ops, [{ op: 'transform', id: 'trex-1', yaw: 90 }, { op: 'push', id: 'trex-1', event: { type: 'move', yaw: 90 } }])
  const pos = editOps({ row: rex, comp: 'transform', path: ['p', 0], value: 2, doc: h.doc(), moveOps })
  assert.deepEqual(pos.at(-1).event, { type: 'move', p: [2, 0, -6] }, 'a position edit carries no (stale) yaw')
})
