import test from 'node:test'
import assert from 'node:assert/strict'
import { makeUndo } from '../../src/editor/undo.js'
import { seeded, read, apply } from './d-helpers.mjs'

test('undo: spawn -> undo despawns -> redo brings the same id back', () => {
  const h = seeded(); const applyOps = apply(h)
  const undo = makeUndo({ applyOps })
  const out = applyOps([{ op: 'spawn', preset: 'sheep', at: [1, 0, 1] }])
  const id = out.results[0]
  assert.ok(undo.record(out.inverse, 'spawn sheep'))
  assert.equal(undo.canUndo, true); assert.equal(undo.canRedo, false)
  assert.deepEqual(undo.undo(), { ok: true, message: 'spawn sheep' })
  assert.equal(read.entityData(h.doc(), id), null)
  assert.equal(undo.canRedo, true)
  assert.equal(undo.redo().ok, true)
  assert.equal(read.entityData(h.doc(), id).preset, 'sheep')
  assert.equal(undo.canUndo, true)
})

test('undo: a set is restored field by field; a new record clears redo', () => {
  const h = seeded(); const applyOps = apply(h)
  const undo = makeUndo({ applyOps })
  undo.record(applyOps([{ op: 'set', id: 'trex-1', component: 'body', patch: { speed: 9 } }]).inverse, 'speed')
  undo.undo()
  assert.equal(read.entityData(h.doc(), 'trex-1').effective.body.speed, 6)
  // seed entities own an empty body map (presets.js withOwnMaps): the inverse empties it again
  assert.deepEqual(read.entityData(h.doc(), 'trex-1').components.body, {}, 'the inverse of setting a field removes the field')
  const nb = apply(h)([{ op: 'spawn', id: 'bare', components: {} }])
  undo.record(applyOps([{ op: 'set', id: 'bare', component: 'body', patch: { speed: 9 } }]).inverse, 'speed')
  assert.ok(nb && 'body' in read.entityData(h.doc(), 'bare').components)
  undo.undo()
  assert.ok(!('body' in read.entityData(h.doc(), 'bare').components), 'the inverse of setting a missing component removes it')
  undo.record(applyOps([{ op: 'setName', id: 'trex-1', name: 'Rex' }]).inverse, 'rename')
  assert.equal(undo.canRedo, false)
})

test('undo: edits sharing a key inside the window coalesce to the state before the gesture', () => {
  const h = seeded(); const applyOps = apply(h)
  let t = 0
  const undo = makeUndo({ applyOps, now: () => t, coalesceMs: 500 })
  for (const v of [7, 8, 9]) { t += 100; undo.record(applyOps([{ op: 'set', id: 'sheep-1', component: 'body', patch: { speed: v } }]).inverse, 'speed', { key: 'sheep-1/body/speed' }) }
  t += 2000
  undo.record(applyOps([{ op: 'set', id: 'sheep-1', component: 'body', patch: { speed: 2 } }]).inverse, 'speed', { key: 'sheep-1/body/speed' })
  undo.undo()
  assert.equal(read.entityData(h.doc(), 'sheep-1').effective.body.speed, 9, 'the late edit is its own step')
  undo.undo()
  assert.equal(read.entityData(h.doc(), 'sheep-1').effective.body.speed, 6.5, 'the drag undoes in one step to the preset value')
  assert.equal(undo.canUndo, false)
})

test('undo: an inverse that no longer validates is dropped with an error, not wedged', () => {
  const h = seeded(); const applyOps = apply(h)
  const undo = makeUndo({ applyOps })
  undo.record(applyOps([{ op: 'setName', id: 'rock-1', name: 'Boulder' }]).inverse, 'rename')
  applyOps([{ op: 'despawn', id: 'rock-1' }]) // someone else deletes it
  const r = undo.undo()
  assert.equal(r.ok, false); assert.match(String(r.error.message), /no entity rock-1/)
  assert.equal(undo.canUndo, false)
  assert.equal(undo.record([], 'nothing'), false, 'an empty inverse is not a step')
  let n = 0; const off = undo.onChange(() => n++); undo.clear(); off(); undo.clear()
  assert.equal(n, 1)
})
