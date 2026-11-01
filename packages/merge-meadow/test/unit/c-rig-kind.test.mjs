// Track C, rigs (design §17, ARCHITECTURE §6.2): the rig kind and its `tree`
// alias, template sharing, re-keying on a model edit, and the reconciler's
// per-instance variables and preview state.
import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three'
import { KINDS } from '../../src/render/kinds/index.js'
import { makeResources, stdMatKey, tintColor } from '../../src/render/resources.js'
import { MODEL_LIBRARY, resolveModel, resolveRepresentation } from '../../src/doc/models.js'
import { stage } from './c-helpers.mjs'

const near = (a, b, eps = 1e-9, msg) => assert.ok(Math.abs(a - b) <= eps, `${msg ?? ''} ${a} != ${b}`)
const LIB = { models: MODEL_LIBRARY }
const ctxOf = (res, doc = LIB) => ({ res, entity: { id: 'e', c: {}, live: {} }, assets: () => ({}), doc: () => doc, changed () {} })
const vars0 = () => ({ t: 0, st: 0, phase: 0, speed: 0, gait: 0, turn: 0, hp: 1, rand: 0.5, idx: 1 })
const poseOf = (root) => { const o = []; root.traverse((g) => { o.push(...g.position.toArray(), ...g.rotation.toArray().slice(0, 3), ...g.scale.toArray()) }); return o }
function walk (k, o, state, n, v = vars0(), dt = 1 / 30, speed = 1.5) {
  for (let i = 0; i < n; i++) { v.t += dt; v.st += dt; v.speed = speed; v.phase += speed * dt; v.gait = speed / 4; k.animate(o, state, null, dt, v) }
  return v
}

test('every library model builds, every track drives a built bone, anchors come from nodes', () => {
  const res = makeResources({ document: null }); const ctx = ctxOf(res)
  for (const name of Object.keys(MODEL_LIBRARY)) {
    const o = KINDS.rig.create({ kind: 'rig', model: name }, ctx)
    assert.equal(o.userData.missing, undefined, name)
    assert.ok(o.userData.key.startsWith(`model:${name}:${resolveModel(MODEL_LIBRARY, name).revs.join('.')}:`), o.userData.key)
    assert.equal(o.userData.key, resolveRepresentation({ models: MODEL_LIBRARY }, { kind: 'rig', model: name }).key, 'the kind and track A agree on the key')
    const bones = o.userData.bones
    for (const n of o.userData.tpl.evaluator.nodes) assert.ok(bones.has(n), `${name}: track node ${n} built`)
    assert.deepEqual(o.userData.tpl.evaluator.errors, [], name)
    const a = KINDS.rig.anchors(o)
    assert.ok(a.seat?.isObject3D && a.head?.isObject3D, name + ' seat + head anchors')
    const rest = poseOf(o)
    walk(KINDS.rig, o, 'walk', 20)
    assert.notDeepEqual(poseOf(o), rest, name + ' walks')
    KINDS.rig.dispose(o, ctx); res.releaseAll(o)
  }
  assert.equal(res.stats().keys, 0)
})

test('instances of one model share one template (resolved + compiled once) and geometry', () => {
  const res = makeResources({ document: null }); const ctx = ctxOf(res)
  const a = KINDS.rig.create({ kind: 'rig', model: 'horse' }, ctx)
  const b = KINDS.rig.create({ kind: 'rig', model: 'horse', color: '#888888', scale: 2 }, ctx)
  assert.equal(a.userData.tpl, b.userData.tpl); assert.equal(res.refs(a.userData.key), 2)
  assert.equal(b.scale.x, 2)
  assert.notEqual(a.userData.ctl, b.userData.ctl, 'the controller is per instance')
  const geos = new Set(); for (const o of [a, b]) o.traverse((m) => { if (m.isMesh) geos.add(m.geometry) })
  assert.ok(geos.size <= 5, 'unit shapes only: ' + geos.size)
  for (const o of [a, b]) res.releaseAll(o)
  assert.equal(res.stats().keys, 0)
})

test('rig update: colour, tint and scale patch in place; another model or a re-key rebuilds; stale() sees a rev bump', () => {
  const res = makeResources({ document: null })
  let doc = { models: { ...MODEL_LIBRARY, sheep: { ...MODEL_LIBRARY.sheep, rev: 1 } } }
  const ctx = ctxOf(res); ctx.doc = () => doc
  const d0 = { kind: 'rig', model: 'sheep', color: '#ffffff' }
  const o = KINDS.rig.create(d0, ctx)
  const meshes = []; o.traverse((m) => { if (m.isMesh) meshes.push(m) })
  const d1 = { ...d0, color: '#ff0000', tint: '#555555', scale: 1.5 }
  assert.equal(KINDS.rig.update(o, d1, d0, ctx), undefined)
  const after = []; o.traverse((m) => { if (m.isMesh) after.push(m) })
  assert.deepEqual(after, meshes, 'the same meshes'); assert.equal(o.scale.x, 1.5)
  assert.ok(res.has(stdMatKey({ color: tintColor(tintColor('#f4f0e8', '#ff0000'), '#555555') })), 'node colour x look colour x tint')
  assert.equal(res.has(stdMatKey({ color: '#f4f0e8' })), false, 'the old material is released')
  assert.equal(KINDS.rig.update(o, { ...d1, model: 'horse' }, d1, ctx), false)
  assert.equal(KINDS.rig.stale(o, d1, ctx), false)
  doc = { models: { ...doc.models, sheep: { ...doc.models.sheep, rev: 2 } } }
  assert.equal(KINDS.rig.stale(o, d1, ctx), true, 'a redefined model re-keys the look')
  assert.equal(KINDS.rig.update(o, d1, d1, ctx), false)
  res.releaseAll(o); assert.equal(res.stats().keys, 0)
})

test('an unknown model renders a placeholder that rebuilds once the model exists', () => {
  const res = makeResources({ document: null })
  let doc = { models: {} }
  const ctx = ctxOf(res); ctx.doc = () => doc
  const d = { kind: 'rig', model: 'griffin' }
  const o = KINDS.rig.create(d, ctx)
  assert.equal(o.userData.missing, true); assert.match(o.userData.error, /unknown model "griffin"/)
  KINDS.rig.animate(o, 'walk', null, 0.1, vars0()) // no-op, no throw
  assert.equal(KINDS.rig.stale(o, d, ctx), false)
  doc = { models: { griffin: MODEL_LIBRARY.bird } }
  assert.equal(KINDS.rig.stale(o, d, ctx), true)
  res.releaseAll(o)
  const n = KINDS.rig.create(d, ctx); assert.equal(n.userData.missing, undefined)
  res.releaseAll(n); assert.equal(res.stats().keys, 0)
})

test('a halted (dead, no die clip) rig keeps its pose when the dead tint patches it', () => {
  const res = makeResources({ document: null }); const ctx = ctxOf(res)
  const d = { kind: 'rig', nodes: [{ name: 'body', shape: 'box', p: [0, 1, 0] }], animations: { idle: { tracks: { 'body.rz': '30 + 0*t' } } } }
  const o = KINDS.rig.create(d, ctx)
  const v = walk(KINDS.rig, o, 'idle', 3)
  const body = o.userData.bones.get('body')
  near(body.rotation.z, Math.PI / 6)
  KINDS.rig.animate(o, 'die', null, 0.1, v)
  assert.equal(o.userData.ctl.halted, true)
  assert.equal(KINDS.rig.update(o, { ...d, tint: '#555555' }, d, ctx), undefined)
  near(body.rotation.z, Math.PI / 6, 1e-9, 'not snapped back to rest')
  res.releaseAll(o)
})

test('tree is an alias of rig: adding animations animates it in place (same root, same meshes)', () => {
  const res = makeResources({ document: null }); const ctx = ctxOf(res, null)
  assert.equal(KINDS.tree.alias, 'rig')
  const nodes = [{ shape: 'cylinder', p: [0, 1, 0], s: [0.3, 2, 0.3], color: '#6b4a2e', children: [{ name: 'crown', shape: 'sphere', p: [0, 1.5, 0], s: [2, 2, 2], color: '#3f8f3f' }] }]
  const d0 = { kind: 'tree', nodes }
  const o = KINDS.tree.create(d0, ctx)
  const meshes = []; o.traverse((m) => { if (m.isMesh) meshes.push(m) })
  const crown = o.userData.bones.get('crown')
  const rest = crown.rotation.z
  KINDS.tree.animate(o, 'idle', null, 0.1, vars0()) // no clips: nothing to do
  assert.equal(crown.rotation.z, rest)
  const d1 = { ...d0, animations: { sway: { tracks: { 'crown.rz': 'sin(t*2)*8' } } } }
  const k0 = o.userData.key
  assert.equal(KINDS.tree.update(o, d1, d0, ctx), undefined, 'patched, not rebuilt')
  assert.notEqual(o.userData.key, k0, 'a new inline template')
  assert.equal(res.has(k0), false, 'the old template is released')
  const after = []; o.traverse((m) => { if (m.isMesh) after.push(m) })
  assert.deepEqual(after, meshes)
  assert.equal(o.userData.bones.get('crown'), crown)
  const v = vars0(); v.t = Math.PI / 4
  KINDS.tree.animate(o, 'idle', null, 0, v)
  near(crown.rotation.z, rest + 8 * Math.PI / 180, 1e-9, 'a tree with one clip and no controller sways')
  // the tree alias ignores `model`; a structure change still rebuilds
  assert.equal(KINDS.tree.update(o, { ...d1, model: 'horse' }, d1, ctx), undefined)
  assert.equal(KINDS.tree.update(o, { kind: 'tree', nodes: [{ shape: 'cone' }] }, d1, ctx), false)
  // taking the animations away hands the crown back to rest
  assert.equal(KINDS.tree.update(o, d0, d1, ctx), undefined)
  KINDS.tree.animate(o, 'idle', null, 0.1, v)
  near(crown.rotation.z, rest)
  // identical inline trees share a template
  const o2 = KINDS.tree.create(d0, ctx)
  assert.equal(o2.userData.tpl, o.userData.tpl)
  res.releaseAll(o); res.releaseAll(o2); assert.equal(res.stats().keys, 0)
})

test('animate without vars keeps its own clock (an older caller)', () => {
  const res = makeResources({ document: null }); const ctx = ctxOf(res)
  const o = KINDS.rig.create({ kind: 'rig', nodes: [{ name: 'a', shape: 'box' }], animations: { idle: { tracks: { 'a.ry': 't*10' } } } }, ctx)
  for (let i = 0; i < 10; i++) KINDS.rig.animate(o, 'idle', null, 0.1)
  near(o.userData.bones.get('a').rotation.y, 10 * Math.PI / 180, 1e-9)
  res.releaseAll(o)
})

// ---- through the reconciler and the doc (track A's ops)

test('reconciler: vars from live (phase from distance, speed from live.v, hp), preview state drives clips with the sim idle', () => {
  const s = stage()
  s.ops([{ op: 'spawn', id: 'h', components: { transform: { p: [0, 0, 0] }, representation: { kind: 'rig', model: 'horse' }, health: { max: 40, armor: 0, hits: { a: 10 } } } }])
  const e = s.world.get('h')
  const obj = s.rec.visualFor('h')
  assert.equal(obj.userData.kind, 'rig'); assert.match(obj.userData.key, /^model:horse:/)
  let seen = null
  const real = obj.userData.ctl
  const orig = KINDS.rig.animate
  KINDS.rig.animate = (...a) => { seen = a; return orig(...a) }
  try {
    s.rec.frame(0.1)
    e.live.anim = 'walk'; e.live.v = [3, 0, 4]
    for (let i = 1; i <= 10; i++) { e.live.p = [i * 0.1, 0, 0]; s.rec.frame(0.1) }
    const v = seen[4]
    near(v.speed, 5, 1e-9, 'speed from live.v (horizontal)')
    near(v.phase, 1 / obj.userData.stride, 1e-6, 'phase = distance / stride')
    near(v.gait, Math.min(1, 5 / obj.userData.runSpeed))
    near(v.hp, 0.75); near(v.st, 0.9, 1e-9, 'since walk began'); near(v.t, 1.1, 1e-9)
    assert.ok(v.rand >= 0 && v.rand < 1 && Number.isInteger(v.idx))
    assert.equal(seen[1], 'walk'); assert.equal(real.state, 'walk')
    // the editor's preview state: forces the state; a previewed gait advances phase with the sim idle
    e.live.anim = 'idle'; e.live.v = [0, 0, 0]
    s.rec.preview('h', { anim: 'run' })
    assert.equal(s.rec.previewState('h'), 'run')
    const p0 = seen[4].phase
    for (let i = 0; i < 5; i++) s.rec.frame(0.1)
    assert.equal(seen[1], 'run')
    assert.ok(seen[4].phase > p0 + 0.5, 'the legs move')
    // a drag preview and its release leave the preview state alone
    s.rec.preview('h', { p: [5, 0, 5], yaw: 0 }); s.rec.frame(0.1)
    s.rec.preview('h', null)
    assert.equal(s.rec.previewState('h'), 'run')
    s.rec.preview('h', null) // the inspector's clear
    assert.equal(s.rec.previewState('h'), null)
    s.rec.frame(0.1); assert.equal(seen[1], 'idle')
  } finally { KINDS.rig.animate = orig }
  s.stop()
})

test('reconciler: defineModel re-keys and rebuilds the looks built on it; tree + animations stays in place; zero leaks', () => {
  const s = stage()
  s.ops([
    { op: 'spawn', id: 'q', components: { transform: {}, representation: { kind: 'rig', model: 'horse' } } },
    { op: 'spawn', id: 't', components: { transform: { p: [3, 0, 0] }, representation: { kind: 'tree', nodes: [{ name: 'trunk', shape: 'cylinder', p: [0, 1, 0], children: [{ name: 'crown', shape: 'sphere', p: [0, 1, 0] }] }] } } },
  ])
  s.rec.frame(0.1)
  const base = s.res.stats()
  const h0 = s.rec.visualFor('q'); const k0 = h0.userData.key
  const t0 = s.rec.visualFor('t'); const tm = []; t0.traverse((m) => { if (m.isMesh) tm.push(m) })
  // a base model edit re-keys the horse built on it
  const quad = resolveModel(MODEL_LIBRARY, 'quadruped')
  s.ops([{ op: 'defineModel', name: 'quadruped', model: { extends: '', stride: 1.2, nodes: quad.nodes, animations: quad.animations, controller: quad.controller } }])
  s.rec.frame(0.1)
  const h1 = s.rec.visualFor('q')
  assert.notEqual(h1, h0, 'rebuilt'); assert.notEqual(h1.userData.key, k0)
  assert.equal(s.res.has(k0), false, 'the old template went with it')
  // an animations patch on a tree: same visual, same meshes, now moving
  s.ops([{ op: 'set', id: 't', component: 'representation', patch: { animations: { sway: { tracks: { 'crown.rz': 'sin(t*3)*10' } } } } }])
  s.rec.frame(0.1); s.rec.frame(0.2)
  assert.equal(s.rec.visualFor('t'), t0)
  const tm1 = []; t0.traverse((m) => { if (m.isMesh) tm1.push(m) }); assert.deepEqual(tm1, tm)
  assert.notEqual(t0.userData.bones.get('crown').rotation.z, 0)
  assert.deepEqual(Object.keys(s.res.stats().byPrefix).sort(), Object.keys(base.byPrefix).sort())
  // swap through every library model and back: nothing left behind
  for (const m of Object.keys(MODEL_LIBRARY)) { s.ops([{ op: 'replace', id: 'q', component: 'representation', data: { kind: 'rig', model: m } }]); s.rec.frame(0.1) }
  s.ops([{ op: 'replace', id: 'q', component: 'representation', data: { kind: 'billboard', image: 'emoji:🐎', size: 2 } }]); s.rec.frame(0.1)
  s.ops([{ op: 'despawn', id: 'q' }, { op: 'despawn', id: 't' }])
  assert.deepEqual(s.res.stats(), { keys: 0, refs: 0, byPrefix: {} })
  s.stop()
})
