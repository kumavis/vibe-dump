import test from 'node:test'
import assert from 'node:assert/strict'
import { switchKindOps, switchedData, defaultsOf } from '../../src/editor/kind-switcher.js'
import { presetComponents } from '../../src/editor/component-ops.js'
import { seeded, read, applyOps, KINDS } from './d-helpers.mjs'

test('switchKindOps: one replace from the target defaults plus same-typed carried fields', () => {
  const cur = { kind: 'billboard', image: 'emoji:🦖', size: 3, color: '#ff8800', tint: '#555555' }
  const op = switchKindOps('trex-1', cur, 'primitive', KINDS)
  assert.equal(op.op, 'replace'); assert.equal(op.component, 'representation'); assert.equal(op.id, 'trex-1')
  assert.deepEqual(op.data, { shape: 'box', size: [1, 1, 1], color: '#ff8800', roughness: 0.8, metalness: 0, tint: '#555555', kind: 'primitive', image: null })
  assert.equal(op.data.image, null, 'a billboard-only field does not follow (nulled, so a preset value cannot show through)')
})

test('switchKindOps: values out of the target range fall back to its default; kind defaults merge', () => {
  const d = switchedData({ kind: 'primitive', shape: 'box', size: [1, 1, 1], color: '#123456' }, 'critter', KINDS)
  assert.equal(d.kind, 'critter'); assert.equal(d.color, '#123456'); assert.equal(d.rig, 'quadruped'); assert.equal(d.tail, 0.5)
  const big = switchedData({ kind: 'model', url: 'asset:x', scale: 15 }, 'billboard', KINDS)
  assert.equal(big.size, 1.2)
  assert.throws(() => switchedData({ kind: 'billboard' }, 'hologram', KINDS), /unknown representation kind/)
  assert.deepEqual(defaultsOf(KINDS.tree.schema).nodes[0].shape, 'box')
})

test('switchKindOps: applied to the doc it swaps the look and keeps every other component', () => {
  const h = seeded()
  const before = read.entityData(h.doc(), 'sheep-1')
  const inherited = presetComponents(read, h.doc(), 'sheep').representation
  const op = switchKindOps('sheep-1', before.effective.representation, 'critter', KINDS, { inherited })
  assert.equal(op.data.image, null, 'the preset image is nulled out of the new look')
  const { inverse } = applyOps(h, [op], { kinds: KINDS })
  const after = read.entityData(h.doc(), 'sheep-1')
  assert.equal(after.effective.representation.kind, 'critter')
  assert.ok(!('image' in after.effective.representation))
  assert.deepEqual(after.effective.brain, before.effective.brain)
  assert.deepEqual(after.effective.transform, before.effective.transform)
  applyOps(h, inverse)
  assert.equal(read.entityData(h.doc(), 'sheep-1').effective.representation.kind, 'billboard', 'the inverse restores the preset look')
})
