import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three'
import { KINDS, registerKind, kindDefaults, PLACEHOLDER } from '../../src/render/kinds/index.js'
import { signature } from '../../src/render/kinds/tree.js'
import { makeResources } from '../../src/render/resources.js'
import { validateSchema, validateComponent } from '../../src/doc/validate.js'
import { COMPONENT_DEFS } from '../../src/doc/presets.js'

const NAMES = ['billboard', 'primitive', 'tree', 'model', 'critter']

test('every kind exposes a schema in the supported subset and defaults that validate', () => {
  assert.deepEqual(Object.keys(KINDS).slice(0, 5), NAMES)
  assert.deepEqual([...COMPONENT_DEFS.representation.schema.properties.kind.enum], NAMES, 'track A enum matches the registry')
  for (const n of NAMES) {
    const k = KINDS[n]
    assert.deepEqual(validateSchema(k.schema), [], n + ' schema')
    assert.deepEqual(validateComponent(k.schema, k.defaults), [], n + ' defaults')
    assert.equal(k.defaults.kind, n)
    assert.equal(k.schema.properties.kind['x-hidden'], true, 'kind is switched, never typed')
    for (const f of ['create', 'update', 'dispose']) assert.equal(typeof k[f], 'function')
    const d = kindDefaults(n); d.kind = 'x'
    assert.equal(KINDS[n].defaults.kind, n, 'kindDefaults returns a copy')
  }
  for (const [n, f] of [['billboard', 'image'], ['primitive', 'shape'], ['model', 'url'], ['critter', 'rig']]) assert.equal(KINDS[n].schema.properties[f]['x-immutable'], true, `${n}.${f}`)
  assert.equal(KINDS.tree.schema.properties.nodes['x-json'], true)
  assert.equal(kindDefaults('nope'), null)
})

test('tree signature: shapes, nesting and anchors are structure; poses and colours are not', () => {
  const a = [{ shape: 'box', p: [0, 1, 0], color: '#111111', children: [{ shape: 'sphere', s: [1, 2, 1] }] }]
  const b = [{ shape: 'box', p: [3, 1, 0], r: [0, 90, 0], color: '#ff0000', children: [{ shape: 'sphere', s: [9, 9, 9] }] }]
  assert.equal(signature(a), signature(b))
  assert.equal(signature(a), 'box(sphere())')
  assert.notEqual(signature(a), signature([{ shape: 'box', children: [{ shape: 'cone' }] }]))
  assert.notEqual(signature(a), signature([{ shape: 'box', children: [{ shape: 'sphere' }, { shape: 'box' }] }]))
  assert.notEqual(signature(a), signature([{ shape: 'box', anchor: 'seat', children: [{ shape: 'sphere' }] }]))
  assert.equal(signature([{ shape: 'blob' }]), signature([{ shape: 'box' }]), 'unknown shapes render as boxes')
  assert.equal(signature(null), '')
})

// switch-safe update(): in place returns undefined, structure changes return false
function harness () {
  const res = makeResources({ document: null })
  const ctx = { res, entity: { id: 'e', c: {}, live: {} }, assets: () => ({}), changed () {} }
  const run = (kind, d0, d1) => {
    const k = KINDS[kind]
    const o = k.create({ kind, ...d0 }, ctx)
    const r = k.update(o, { kind, ...d1 }, { kind, ...d0 }, ctx)
    return { o, r, k, done () { k.dispose(o, ctx); res.releaseAll(o) } }
  }
  return { res, ctx, run }
}

test('billboard: image, colour, tint and size patch in place and swap resources', () => {
  const { res, run } = harness()
  const t = run('billboard', { image: 'emoji:🐑', size: 1 }, { image: 'emoji:🦖', size: 3, color: '#ff0000' })
  assert.equal(t.r, undefined)
  assert.ok(t.o.isSprite); assert.equal(t.o.scale.x, 3)
  assert.deepEqual(t.o.userData.res, ['spritemat:emoji:🦖:#ff0000'])
  assert.ok(res.has('tex:emoji:🦖')); assert.equal(res.has('tex:emoji:🐑'), false)
  assert.ok(t.k.anchors(t.o).seat.isObject3D)
  t.k.update(t.o, { kind: 'billboard', image: 'emoji:🦖', size: 3, color: '#ff0000', tint: '#555555' }, { kind: 'billboard', image: 'emoji:🦖', size: 3, color: '#ff0000' }, { res })
  assert.deepEqual(t.o.userData.res, ['spritemat:emoji:🦖:#550000'], 'the dead group tint darkens the colour')
  t.done()
  assert.equal(res.stats().keys, 0)
})

test('primitive: shape, colour and size all patch in place', () => {
  const { res, run } = harness()
  const t = run('primitive', { shape: 'box', size: [1, 2, 1], color: '#00ff00' }, { shape: 'capsule', size: [2, 4, 2], color: '#0000ff' })
  assert.equal(t.r, undefined)
  const m = t.o.userData.mesh
  assert.equal(m.geometry.name, 'geo:capsule'); assert.equal(m.position.y, 2); assert.equal(m.scale.y, 4)
  assert.equal(t.k.anchors(t.o).seat.position.y, 4)
  assert.deepEqual([...t.o.userData.res].sort(), ['geo:capsule', 'mat:std:#0000ff:0.8:0:0:0'])
  t.done(); assert.equal(res.stats().keys, 0)
})

test('tree: same structure patches, new structure rebuilds; node anchors are exposed', () => {
  const { res, run } = harness()
  const n0 = [{ shape: 'box', p: [0, 1, 0], color: '#111111', children: [{ shape: 'sphere', anchor: 'seat', p: [0, 1, 0] }] }]
  const n1 = [{ shape: 'box', p: [0, 2, 0], color: '#222222', children: [{ shape: 'sphere', anchor: 'seat', p: [0, 1.5, 0] }] }]
  const t = run('tree', { nodes: n0 }, { nodes: n1 })
  assert.equal(t.r, undefined)
  assert.equal(t.o.children[0].position.y, 2)
  assert.equal(t.k.anchors(t.o).seat.position.y, 1.5)
  assert.ok(res.has('mat:std:#222222:0.8:0:0:0')); assert.equal(res.has('mat:std:#111111:0.8:0:0:0'), false)
  assert.equal(t.k.update(t.o, { kind: 'tree', nodes: [{ shape: 'cone' }] }, { kind: 'tree', nodes: n1 }, { res }), false)
  t.done(); assert.equal(res.stats().keys, 0)
})

test('critter: colour patches in place, proportions rebuild; anchors ride the bones', () => {
  const { res, run } = harness()
  const t = run('critter', { rig: 'quadruped', color: '#aaaaaa' }, { rig: 'quadruped', color: '#bb5500' })
  assert.equal(t.r, undefined)
  assert.ok(t.o.userData.mesh.isSkinnedMesh)
  const seat = t.k.anchors(t.o).seat
  assert.equal(seat.parent.name, 'hips')
  assert.equal(t.k.update(t.o, { kind: 'critter', rig: 'biped' }, { kind: 'critter', rig: 'quadruped' }, { res }), false)
  assert.equal(t.k.update(t.o, { kind: 'critter', rig: 'quadruped', length: 3 }, { kind: 'critter', rig: 'quadruped' }, { res }), false)
  t.k.animate(t.o, 'run', null, 0.1)
  assert.equal(t.o.userData.anim.clipName, 'run')
  t.done(); assert.equal(res.stats().keys, 0)
})

test('model: a refused url shows the error placeholder; a different url rebuilds', async () => {
  const { res, run } = harness()
  const t = run('model', { url: 'blob:https://x/1' }, { url: 'blob:https://x/1', scale: 2 })
  assert.equal(t.r, undefined); assert.equal(t.o.scale.x, 2)
  assert.match(t.o.userData.error, /refused url/)
  assert.equal(await t.o.userData.ready, false)
  assert.ok(t.o.userData.placeholder?.isMesh)
  assert.equal(t.k.update(t.o, { kind: 'model', url: 'https://a/b.glb' }, { kind: 'model', url: 'blob:https://x/1' }, { res, assets: () => ({}) }), false)
  assert.equal(t.k.update(t.o, { kind: 'model', url: 'blob:https://x/1', tint: '#555555' }, { kind: 'model', url: 'blob:https://x/1' }, { res, assets: () => ({}) }), false, 'tint rebuilds')
  t.done(); assert.equal(res.stats().keys, 0)
})

test('registerKind validates and opens the registry', () => {
  assert.throws(() => registerKind('bad name', {}), /bad kind name/)
  assert.throws(() => registerKind('blob', { create () {} }), /needs update/)
  const k = { schema: { type: 'object', properties: {} }, defaults: {}, create: () => new THREE.Group(), update: () => {}, dispose () {} }
  registerKind('blob', k)
  assert.equal(KINDS.blob, k)
  delete KINDS.blob
  assert.equal(PLACEHOLDER.update(), false, 'placeholders always rebuild')
})
