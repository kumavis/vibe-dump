// Review fixes for the rig render (design §17.4): a model whose content changed
// under the same revs rebuilds; a bone with no shape keeps scale 1 when animated;
// crossfade sets stay bounded when a state flickers; offsets never go non-finite.
import test from 'node:test'
import assert from 'node:assert/strict'
import { KINDS } from '../../src/render/kinds/index.js'
import { makeResources } from '../../src/render/resources.js'
import { MODEL_LIBRARY } from '../../src/doc/models.js'
import { makeRigController, MAX_OUT } from '../../src/render/rig/controller.js'
import { applyOffsets } from '../../src/render/rig/evaluator.js'
import { seeded, fork } from './a-helpers.mjs'
import { applyOps } from '../../src/doc/ops.js'
import * as THREE from 'three'

const vars0 = () => ({ t: 0, st: 0, phase: 0, speed: 0, gait: 0, turn: 0, hp: 1, rand: 0.5, idx: 1 })
const ctxOf = (res, doc) => ({ res, entity: { id: 'e', c: {}, live: {} }, assets: () => ({}), doc, changed () {} })
const wizard = (head) => ({ extends: 'biped', nodes: [{ name: 'head', children: [head] }] })
const HAT = { name: 'hat', shape: 'cone', p: [0, 0.5, 0], s: [0.34, 0.5, 0.34], color: '#3b2a7a' }
const CROWN = { name: 'crown', shape: 'cylinder', p: [0, 0.3, 0], s: [0.25, 0.1, 0.25], color: '#e8c020' }

test('remove + redefine with no frame between: existing instances go stale and new spawns get the new template', () => {
  const h = seeded()
  applyOps(h, [{ op: 'defineModel', name: 'wizard', model: wizard(HAT) }])
  const res = makeResources({ document: null })
  const ctx = ctxOf(res, () => h.doc())
  const d = { kind: 'rig', model: 'wizard' }
  const w1 = KINDS.rig.create(d, ctx)
  assert.ok(w1.userData.bones.has('hat'))
  // two ops (a backgrounded tab sees both before its next frame), then one in a batch
  applyOps(h, [{ op: 'removeModel', name: 'wizard' }])
  applyOps(h, [{ op: 'defineModel', name: 'wizard', model: wizard(CROWN) }])
  assert.equal(KINDS.rig.stale(w1, d, ctx), true, 'same revs (1.1), new content: stale')
  assert.equal(KINDS.rig.update(w1, d, d, ctx), false, 'update asks for a rebuild')
  const w2 = KINDS.rig.create(d, ctx)
  assert.ok(w2.userData.bones.has('crown') && !w2.userData.bones.has('hat'), 'a new spawn does not reuse the old template')
  res.releaseAll(w1)
  const w1b = KINDS.rig.create(d, ctx)
  assert.ok(w1b.userData.bones.has('crown'), 'the rebuilt look has the new content')
  assert.equal(res.keys().filter((k) => k.startsWith('model:wizard:')).length, 1, 'one template for the model')
  applyOps(h, [{ op: 'removeModel', name: 'wizard' }, { op: 'defineModel', name: 'wizard', model: wizard(HAT) }])
  assert.equal(KINDS.rig.stale(w2, d, ctx), true, 'and again in one batch')
  res.releaseAll(w2); res.releaseAll(w1b)
  assert.equal(res.stats().keys, 0)
})

test('two peers that each define the same name from scratch: the peer whose version lost rebuilds after the merge', () => {
  const base = seeded()
  const a = fork(base); const b = fork(base)
  applyOps(a, [{ op: 'defineModel', name: 'wizard', model: wizard(HAT) }])
  applyOps(b, [{ op: 'defineModel', name: 'wizard', model: wizard(CROWN) }])
  const d = { kind: 'rig', model: 'wizard' }
  const ra = makeResources({ document: null }); const rb = makeResources({ document: null })
  const ca = ctxOf(ra, () => a.doc()); const cb = ctxOf(rb, () => b.doc())
  const oa = KINDS.rig.create(d, ca); const ob = KINDS.rig.create(d, cb)
  a.merge(b); b.merge(a)
  const sa = KINDS.rig.stale(oa, d, ca); const sb = KINDS.rig.stale(ob, d, cb)
  assert.equal(sa !== sb, true, `exactly one side's look is stale (a ${sa}, b ${sb})`)
  const na = sa ? KINDS.rig.create(d, ca) : oa; const nb = sb ? KINDS.rig.create(d, cb) : ob
  assert.equal(na.userData.key, nb.userData.key, 'both peers end on the same key')
  assert.deepEqual([...na.userData.bones.keys()].sort(), [...nb.userData.bones.keys()].sort(), 'and the same bones')
})

test('a bone with no shape and a non-unit s: an rx track does not scale its subtree', () => {
  const res = makeResources({ document: null })
  const d = { kind: 'tree', nodes: [{ name: 'pivot', s: [2, 2, 2], children: [{ name: 'arm', shape: 'box', p: [0, 0.5, 0] }] }], animations: { sway: { tracks: { 'pivot.rx': 'sin(t*3)*20' } } } }
  const o = KINDS.tree.create(d, ctxOf(res, () => null))
  const arm = o.userData.bones.get('arm').userData.mesh
  const ws = () => { o.updateMatrixWorld(true); return new THREE.Vector3().setFromMatrixScale(arm.matrixWorld).toArray().map((x) => +x.toFixed(6)) }
  const rest = ws()
  const v = vars0()
  for (let i = 0; i < 10; i++) { v.t += 0.1; v.st += 0.1; KINDS.tree.animate(o, 'idle', null, 0.1, v) }
  assert.notEqual(o.userData.bones.get('pivot').rotation.x, 0, 'the track moves the bone')
  assert.deepEqual(ws(), rest, 'the subtree keeps its world scale')
  assert.deepEqual(o.userData.bones.get('pivot').scale.toArray(), [1, 1, 1])
  res.releaseAll(o)
})

test('a flickering state keeps at most MAX_OUT outgoing sets (1000 alternating switches)', () => {
  const R = { animations: Object.fromEntries(['idle', 'walk', 'run', 'breathe'].map((n) => [n, { loop: true, tracks: {} }])), controller: { states: { idle: ['idle', 'breathe'], walk: ['walk', 'breathe'] }, blend: 0.15 } }
  const c = makeRigController(R)
  let t = 0; let most = 0
  c.set('idle', t)
  for (let i = 0; i < 1000; i++) {
    t += 1 / 30
    c.set(i % 2 ? 'idle' : 'walk', t)
    const L = c.layers(t)
    most = Math.max(most, c.sets)
    const sum = {}; for (const l of L) sum[l.clip] = (sum[l.clip] ?? 0) + l.weight
    assert.ok(Math.abs((sum.idle ?? 0) + (sum.walk ?? 0) - 1) < 1e-9, `weights sum to 1 at switch ${i}`)
    assert.ok(Math.abs(sum.breathe - 1) < 1e-9, 'the shared clip stays at 1')
  }
  assert.ok(most <= MAX_OUT + 1, `at most ${MAX_OUT + 1} sets live (saw ${most})`)
  t += 1; c.layers(t)
  assert.equal(c.sets, 1, 'and the fade settles to one set')
})

test('applyOffsets clamps sums that are not finite (layered clips, huge values)', () => {
  const g = new THREE.Group(); g.userData.rest = { p: [0, 0, 0], r: [0, 0, 0], s: [1, 1, 1] }
  const root = new THREE.Group(); root.add(g); root.userData.bones = new Map([['b', g]])
  applyOffsets(root, new Map([['b', Float64Array.from([Infinity, NaN, -Infinity, 1e300, NaN, -1e300, 1e300, NaN, 1])]]))
  for (const v of [...g.position.toArray(), g.rotation.x, g.rotation.y, g.rotation.z, ...g.scale.toArray()]) assert.ok(Number.isFinite(v), `${v} is finite`)
  assert.equal(g.position.x, 1e4); assert.equal(g.position.y, 0); assert.equal(g.scale.x, 1e3)
})

test('the seed library still builds (sanity for the knee phase change)', () => {
  const res = makeResources({ document: null })
  for (const name of Object.keys(MODEL_LIBRARY)) { const o = KINDS.rig.create({ kind: 'rig', model: name }, ctxOf(res, () => ({ models: MODEL_LIBRARY }))); assert.equal(o.userData.missing, undefined, name); res.releaseAll(o) }
})
