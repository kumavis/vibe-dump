// Track C, rigs (design §17.4, ARCHITECTURE §6.2): keyframe sampling, additive
// layering with weights, and offsets applied to a built node tree.
import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three'
import { sampleKeys, sampleKeyframes, makeRigEvaluator, applyOffsets, CHANNEL_INDEX } from '../../src/render/rig/evaluator.js'
import { buildNodes } from '../../src/render/kinds/nodes.js'
import { makeResources } from '../../src/render/resources.js'

const near = (a, b, eps = 1e-9, msg) => assert.ok(Math.abs(a - b) <= eps, `${msg ?? ''} ${a} != ${b}`)
const K = [[0, -30], [0.5, 30], [1, -30]]

test('sampler: linear between keys; clamps when once; single key is constant', () => {
  near(sampleKeyframes(K, 0.25), 0)
  near(sampleKeyframes(K, 0.5), 30)
  near(sampleKeyframes(K, 0.75), 0)
  near(sampleKeyframes(K, -1), -30, 1e-9, 'before the first key: held')
  near(sampleKeyframes(K, 7), -30, 1e-9, 'after the last key (once): held')
  near(sampleKeyframes([[0.2, 5], [0.4, 9]], 0.3), 7)
  near(sampleKeyframes([[3, 4]], 99), 4)
  near(sampleKeyframes([], 1), 0)
  near(sampleKeyframes([[0, 0], [1, 10]], 0.5, false, 5), 5, 1e-9, 'a longer duration does not stretch a clamped clip')
  near(sampleKeyframes([[0, 0], [1, 10]], 3, false, 5), 10)
})

test('sampler: wraps when the clip loops, across the seam too', () => {
  near(sampleKeyframes(K, 1.25, true), 0, 1e-9, 'one cycle later')
  near(sampleKeyframes(K, 10.5, true), 30)
  near(sampleKeyframes(K, -0.25, true), 0, 1e-9, 'negative time wraps')
  // keys that do not cover the clip: the seam interpolates last -> first one duration later
  const k = [[0.5, 0], [1.5, 10]]
  near(sampleKeyframes(k, 1.75, true, 2), 7.5, 1e-9, 'between the last key and the wrapped first')
  near(sampleKeyframes(k, 0.25, true, 2), 2.5, 1e-9, 'before the first key, from the previous cycle\'s last')
  near(sampleKeyframes(k, 2.5, true, 2), 0)
  // typed arrays are the evaluator's storage
  near(sampleKeys(Float64Array.of(0, 1), Float64Array.of(0, 2), 0.5, true), 1)
})

const resolved = {
  animations: {
    sway: { loop: true, once: false, tracks: { 'top.rz': 'sin(t*2)*10', 'top.py': [[0, 0], [1, 1], [2, 0]] } },
    puff: { loop: true, once: false, tracks: { 'top.sy': '1 + gait', 'base.rx': 'phase*10' } },
    nod: { loop: false, once: true, duration: 1, tracks: { 'top.rx': 'st*20' } },
    broken: { loop: true, once: false, tracks: { 'top.rz': 'sin(', 'top.ry': '5' } },
  },
}

test('evaluate: expressions and keyframes per layer, weighted, additive; scale blends from 1', () => {
  const ev = makeRigEvaluator(resolved)
  assert.deepEqual(ev.clips, ['broken', 'nod', 'puff', 'sway'])
  assert.deepEqual([...ev.nodes].sort(), ['base', 'top'])
  assert.equal(ev.errors.length, 1, 'a bad expression is reported, the rest still compiles')
  assert.match(ev.errors[0], /^broken\.top\.rz:/)
  assert.equal(ev.info('nod').once, true); assert.equal(ev.info('sway').duration, 2, 'duration defaults to the last key')
  const vars = { t: Math.PI / 4, st: 0, phase: 0.5, gait: 0.5 }
  const one = ev.evaluate([{ clip: 'sway', weight: 1, time: 0.5, st: 0 }], vars)
  const top = one.get('top')
  near(top[CHANNEL_INDEX.rz], 10); near(top[CHANNEL_INDEX.py], 0.5)
  assert.deepEqual([...one.get('base')], [0, 0, 0, 0, 0, 0, 1, 1, 1], 'an untouched targeted node reads rest')
  const half = ev.evaluate([{ clip: 'sway', weight: 0.5, time: 0.5 }, { clip: 'puff', weight: 0.5, time: 0 }], vars)
  near(half.get('top')[CHANNEL_INDEX.rz], 5)
  near(half.get('top')[CHANNEL_INDEX.sy], 1.25, 1e-9, 'factor 1.5 at weight 0.5 -> 1.25')
  near(half.get('base')[CHANNEL_INDEX.rx], 2.5)
  // layers add: the same channel from two clips sums
  const both = ev.evaluate([{ clip: 'sway', weight: 1, time: 0 }, { clip: 'broken', weight: 1, time: 0 }], vars)
  near(both.get('top')[CHANNEL_INDEX.ry], 5)
  // st is the LAYER's (a once clip clamps its own st), not the instance's
  near(ev.evaluate([{ clip: 'nod', weight: 1, time: 0.5, st: 0.5 }], { ...vars, st: 99 }).get('top')[CHANNEL_INDEX.rx], 10)
  // nothing active / zero weights / unknown clips: the rest pose
  for (const L of [[], [{ clip: 'sway', weight: 0, time: 1 }], [{ clip: 'nope', weight: 1, time: 1 }]]) {
    const r = ev.evaluate(L, vars)
    for (const n of ['top', 'base']) assert.deepEqual([...r.get(n)], [0, 0, 0, 0, 0, 0, 1, 1, 1])
  }
  // a reused output map keeps its buffers (no per-frame allocation)
  const out = new Map(); ev.evaluate([], vars, out); const buf = out.get('top')
  ev.evaluate([{ clip: 'sway', weight: 1, time: 1 }], vars, out)
  assert.equal(out.get('top'), buf)
})

test('applyOffsets: rest + offsets; a clip that stops restores the rest pose exactly', () => {
  const res = makeResources({ document: null })
  const root = new THREE.Group()
  buildNodes(root, [{ name: 'base', shape: 'box', p: [0, 0.5, 0], r: [10, 0, 0], s: [1, 1, 1], children: [{ name: 'top', shape: 'sphere', p: [0, 1, 0], s: [0.5, 0.4, 0.5] }, { name: 'pivot', p: [1, 0, 0] }] }], res, { color: '#ffffff' })
  const bones = root.userData.bones
  const top = bones.get('top'); const base = bones.get('base')
  const restTop = { p: top.position.toArray(), r: top.rotation.toArray().slice(0, 3), s: top.userData.mesh.scale.toArray() }
  const restBase = { p: base.position.toArray(), r: base.rotation.toArray().slice(0, 3) }
  const ev = makeRigEvaluator(resolved)
  const vars = { t: Math.PI / 4, phase: 1, gait: 1 }
  const out = new Map()
  applyOffsets(root, ev.evaluate([{ clip: 'sway', weight: 1, time: 1 }, { clip: 'puff', weight: 1, time: 0 }], vars, out))
  near(top.rotation.z, 10 * Math.PI / 180); near(top.position.y, 2)
  near(top.userData.mesh.scale.y, 0.4 * 2, 1e-9, 's multiplies the node\'s mesh scale')
  near(base.rotation.x, 20 * Math.PI / 180, 1e-9, 'r adds to the rest r (10 + 10)')
  assert.equal(top.scale.y, 1, 'the group (and so the children) are not scaled')
  // many frames later, the layers are gone: rest, exactly, with no drift
  for (let i = 0; i < 50; i++) applyOffsets(root, ev.evaluate([{ clip: 'sway', weight: 1, time: i / 7 }], { ...vars, t: i }, out))
  applyOffsets(root, ev.evaluate([], vars, out))
  assert.deepEqual(top.position.toArray(), restTop.p); assert.deepEqual(top.rotation.toArray().slice(0, 3), restTop.r)
  assert.deepEqual(top.userData.mesh.scale.toArray(), restTop.s)
  assert.deepEqual(base.position.toArray(), restBase.p); assert.deepEqual(base.rotation.toArray().slice(0, 3), restBase.r)
  // a pivot with no mesh scales its group
  const pe = makeRigEvaluator({ animations: { grow: { tracks: { 'pivot.sx': '2' } } } })
  applyOffsets(root, pe.evaluate([{ clip: 'grow', weight: 1, time: 0 }], {}))
  assert.equal(bones.get('pivot').scale.x, 2)
  applyOffsets(null, out); applyOffsets(root, null) // tolerated
  res.releaseAll(root); assert.equal(res.stats().keys, 0)
})
