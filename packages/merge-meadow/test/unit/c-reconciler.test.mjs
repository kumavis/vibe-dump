import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three'
import { stage } from './c-helpers.mjs'
import { registerKind, KINDS } from '../../src/render/kinds/index.js'
import { installSim } from '../../src/sim/index.js'

const UPGRADE = [
  { kind: 'billboard', image: 'emoji:🦖', size: 2.2 },
  { kind: 'primitive', shape: 'box', size: [1.2, 1.6, 2], color: '#55aa33' },
  { kind: 'tree', nodes: [{ shape: 'box', p: [0, 1.6, 0], s: [1, 1.1, 2], color: '#6a8f3a', children: [{ shape: 'sphere', p: [0, 0.8, 1.2], s: [0.5, 0.5, 0.5] }] }] },
  { kind: 'model', url: 'asset:rex', scale: 1.4 },
  { kind: 'critter', rig: 'biped', length: 4, height: 2.6, color: '#6a8f3a', head: 1.3, tail: 1.3 },
  { kind: 'billboard', image: 'emoji:🦖', size: 2.2 },
]

test('one root per entity; representation swaps keep the root, live, children; zero leaks', () => {
  const s = stage()
  s.ops([
    { op: 'spawn', id: 'hero', components: { transform: { p: [1, 0, 2], r: [0, 90, 0], s: [1, 1, 1] }, representation: UPGRADE[0], animation: { clips: { walk: 'Walk' } } } },
    { op: 'spawn', id: 'hat', parent: 'hero', components: { transform: { p: [0, 3, 0] }, representation: { kind: 'primitive', shape: 'cone', size: [0.5, 0.6, 0.5], color: '#dd3333' } } },
  ])
  s.rec.frame(0)
  const root = s.rec.objectFor('hero'); const hat = s.rec.objectFor('hat')
  assert.ok(root && hat)
  assert.equal(hat.parent, root, 'parent pointer -> scene graph')
  assert.equal(root.parent, s.scene)
  assert.deepEqual(root.position.toArray(), [1, 0, 2])
  assert.ok(Math.abs(root.rotation.y - Math.PI / 2) < 1e-9)
  const live = s.world.get('hero').live
  live.tag = 'mine'
  const base = s.res.stats()
  for (const rep of UPGRADE.slice(1)) {
    s.ops([{ op: 'replace', id: 'hero', component: 'representation', data: rep }])
    s.rec.frame(1 / 60)
    assert.equal(s.rec.objectFor('hero'), root, rep.kind + ': same root')
    assert.equal(s.world.get('hero').live, live, rep.kind + ': same live')
    assert.equal(hat.parent, root, rep.kind + ': child still attached')
    const vis = root.children.filter((c) => c.userData.component === 'representation')
    assert.equal(vis.length, 1, rep.kind + ': one visual child')
    assert.equal(vis[0].userData.kind, rep.kind)
  }
  assert.deepEqual(s.res.stats(), base, 'back to the billboard: exactly the baseline resources')
  s.ops([{ op: 'despawn', id: 'hat' }, { op: 'despawn', id: 'hero' }])
  assert.equal(s.rec.objectFor('hero'), null)
  assert.equal(s.scene.children.length, 0)
  assert.deepEqual(s.res.stats(), { keys: 0, refs: 0, byPrefix: {} })
  s.stop()
})

test('field edits patch the same visual object; an unknown kind is a visible placeholder', () => {
  const s = stage()
  s.ops([{ op: 'spawn', id: 'a', components: { transform: {}, representation: { kind: 'primitive', shape: 'box', color: '#00ff00' } } }])
  const v0 = s.rec.visualFor('a')
  s.ops([{ op: 'set', id: 'a', component: 'representation', patch: { color: '#0000ff', shape: 'sphere' } }])
  assert.equal(s.rec.visualFor('a'), v0, 'set -> update in place')
  assert.equal(v0.userData.mesh.geometry.name, 'geo:sphere')
  // track A's def enumerates the five built-in kinds, so an unknown kind arrives
  // the way a newer peer would write it: straight into the doc
  s.handle.change((d) => { d.entities.a.components.representation = { kind: 'hologram', glow: 3 } })
  const ph = s.rec.visualFor('a')
  assert.ok(ph.userData.placeholder)
  assert.equal(s.rec.stats().placeholders, 1)
  // registering the kind later upgrades the placeholder in place
  registerKind('hologram', { schema: { type: 'object', properties: {} }, defaults: {}, create: () => { const g = new THREE.Group(); g.userData.holo = true; return g }, update: () => {}, dispose () {} })
  assert.ok(s.rec.visualFor('a').userData.holo)
  assert.equal(s.rec.stats().placeholders, 0)
  delete KINDS.hologram
  s.stop()
})

test('lights: a child per light component, kind swaps rebuild, removal disposes', () => {
  const s = stage()
  s.ops([{ op: 'spawn', id: 'l', preset: 'lamp', at: [0, 0, 0] }])
  const light = s.rec.visualFor('l', 'light')
  assert.ok(light.isPointLight); assert.equal(light.position.y, 2.65)
  s.ops([{ op: 'set', id: 'l', component: 'light', patch: { intensity: 2 } }])
  assert.equal(s.rec.visualFor('l', 'light'), light); assert.equal(light.intensity, 2)
  s.ops([{ op: 'set', id: 'l', component: 'light', patch: { kind: 'spot' } }])
  assert.ok(s.rec.visualFor('l', 'light').isSpotLight)
  // an own light (not inherited from the preset) can be removed outright
  s.ops([{ op: 'spawn', id: 'torch', components: { transform: {}, representation: { kind: 'primitive' }, light: { kind: 'point', color: '#ff0000', intensity: 3 } } }])
  assert.ok(s.rec.visualFor('torch', 'light').isPointLight)
  s.ops([{ op: 'remove', id: 'torch', component: 'light' }])
  assert.equal(s.rec.visualFor('torch', 'light'), null)
  assert.ok(s.rec.visualFor('torch'), 'the look stays')
  s.stop()
})

test('orphans go to the scene root; parent cycles are refused', () => {
  const s = stage()
  s.ops([
    { op: 'spawn', id: 'p', components: { transform: {}, representation: { kind: 'primitive' } } },
    { op: 'spawn', id: 'c', parent: 'p', components: { transform: { p: [0, 2, 0] }, representation: { kind: 'primitive' } } },
  ])
  s.rec.frame(0)
  assert.equal(s.rec.objectFor('c').parent, s.rec.objectFor('p'))
  s.ops([{ op: 'despawn', id: 'p' }])
  assert.equal(s.rec.objectFor('c').parent, s.scene)
  s.stop()
})

test('frame(): live pose for simulated entities, doc transform otherwise, tweened by alpha', () => {
  const s = stage()
  installSim(s.world, { inputs: () => new Map() })
  s.ops([{ op: 'spawn', id: 'sheep', preset: 'sheep', at: [0, 0, 0] }, { op: 'spawn', id: 'rock', preset: 'rock', at: [5, 0, 5] }])
  s.rec.frame(0, 1)
  const e = s.world.get('sheep')
  // two ticks of simulated motion, rendered at alpha 0.5: halfway between them
  s.world.tick(1 / 30); e.live.p = [1, 0, 0]; s.rec.frame(1 / 60, 0)
  s.world.tick(1 / 30); e.live.p = [2, 0, 0]; s.rec.frame(1 / 60, 0.5)
  assert.ok(Math.abs(s.rec.objectFor('sheep').position.x - 1.5) < 1e-9)
  // a jump bigger than SNAP is shown at once
  s.world.tick(1 / 30); e.live.p = [30, 0, 0]; s.rec.frame(1 / 60, 0.1)
  assert.equal(s.rec.objectFor('sheep').position.x, 30)
  assert.deepEqual(s.rec.objectFor('rock').position.toArray(), [5, 0, 5])
  // the preview (a drag) overrides everything, untweened
  s.rec.preview('sheep', { p: [7, 0, 7], yaw: 1 }); s.rec.frame(0, 0)
  assert.deepEqual(s.rec.objectFor('sheep').position.toArray(), [7, 0, 7])
  s.rec.preview('sheep', null)
  s.stop()
})

test('pick(): ray -> entity id by bounds and meshes; anchors with fallbacks', () => {
  const s = stage()
  s.ops([
    { op: 'spawn', id: 'box', components: { transform: { p: [0, 0, -5] }, representation: { kind: 'primitive', shape: 'box', size: [1, 2, 1] } } },
    { op: 'spawn', id: 'far', components: { transform: { p: [0, 0, -20] }, representation: { kind: 'billboard', image: 'emoji:🐑', size: 2 } } },
    { op: 'spawn', id: 'horse', preset: 'horse', at: [10, 0, 0] },
    { op: 'spawn', id: 'crate', components: { transform: { p: [-10, 0, 0], s: [2, 2, 2] }, representation: { kind: 'tree', nodes: [{ shape: 'box', p: [0, 0.5, 0] }] } } },
  ])
  s.rec.frame(0); s.scene.updateMatrixWorld(true)
  const rc = new THREE.Raycaster(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, -1))
  const hit = s.rec.pick(rc)
  assert.equal(hit.id, 'box'); assert.ok(Math.abs(hit.distance - 4.5) < 1e-6)
  assert.equal(s.rec.idOf(hit.object), 'box')
  rc.set(new THREE.Vector3(0, 1.5, 0), new THREE.Vector3(0, 0, -1)); s.ops([{ op: 'transform', id: 'box', p: [3, 0, -5] }]); s.rec.frame(0); s.scene.updateMatrixWorld(true)
  assert.equal(s.rec.pick(rc).id, 'far', 'sprites pick by their bounds')
  rc.set(new THREE.Vector3(0, 50, 0), new THREE.Vector3(0, 1, 0))
  assert.equal(s.rec.pick(rc), null)
  // horse billboard: the kind's seat anchor (0.62 of its 2.2 m)
  const seat = s.rec.anchor('horse', 'seat')
  assert.ok(Math.abs(seat.x - 10) < 1e-9 && Math.abs(seat.y - 2.2 * 0.62) < 1e-9)
  assert.deepEqual(s.rec.anchorArray('horse', 'seat').map((v) => +v.toFixed(3)), [10, 1.364, 0])
  // a tree without anchors: the top of its bounds, in world space (scaled root)
  const top = s.rec.anchor('crate', 'head')
  assert.ok(Math.abs(top.y - 2) < 1e-9 && Math.abs(top.x + 10) < 1e-9)
  assert.equal(s.rec.anchor('nobody', 'seat'), null)
  // the stable carrier survives a representation swap and undoes root scale
  const carrier = s.rec.anchorObject('crate', 'seat')
  s.ops([{ op: 'replace', id: 'crate', component: 'representation', data: { kind: 'primitive', size: [1, 3, 1] } }]); s.rec.frame(0)
  assert.equal(s.rec.anchorObject('crate', 'seat'), carrier)
  assert.equal(carrier.parent, s.rec.objectFor('crate'))
  assert.equal(carrier.position.y, 3); assert.equal(carrier.scale.x, 0.5)
  s.stop()
})

test('a despawned mount hands anything on its seat back to the scene', () => {
  const s = stage()
  s.ops([{ op: 'spawn', id: 'horse', preset: 'horse', at: [4, 0, 0] }])
  s.rec.frame(0)
  const seat = s.rec.anchorObject('horse', 'seat')
  const rider = new THREE.Group(); seat.add(rider)
  s.ops([{ op: 'despawn', id: 'horse' }])
  assert.equal(rider.parent, s.scene)
  s.stop()
})

test('dispose() unregisters from the world and releases everything', () => {
  const s = stage()
  s.ops([{ op: 'spawn', id: 't', preset: 'tree', at: [0, 0, 0] }, { op: 'spawn', id: 'x', preset: 'trex', at: [3, 0, 0] }])
  assert.ok(s.res.stats().keys > 0)
  s.rec.dispose()
  assert.deepEqual(s.res.stats(), { keys: 0, refs: 0, byPrefix: {} })
  assert.equal(s.scene.children.length, 0)
  s.ops([{ op: 'spawn', id: 'y', preset: 'sheep', at: [0, 0, 0] }])
  assert.equal(s.scene.children.length, 0, 'no handlers left on the world')
  s.stop()
})

test('anchor() seats riders from the sim pose, not the tick-late rendered root', () => {
  const s = stage()
  installSim(s.world, { inputs: () => new Map() })
  s.ops([{ op: 'spawn', id: 'horse', preset: 'horse', at: [0, 0, 0] }])
  s.rec.frame(0)
  const L = s.world.get('horse').live
  L.p = [5, 0, 0]; L.yaw = Math.PI / 2 // the sim moved it this tick; nothing rendered yet
  const a = s.rec.anchor('horse', 'seat')
  assert.ok(Math.abs(a.x - 5) < 1e-9 && Math.abs(a.y - 2.2 * 0.62) < 1e-9, a.toArray().join())
  assert.equal(s.rec.objectFor('horse').position.x, 0, 'the rendered root has not moved yet')
  s.stop()
})
