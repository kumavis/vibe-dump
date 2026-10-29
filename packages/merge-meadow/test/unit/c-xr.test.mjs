import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three'
import { PlayerRig, EYE_HEIGHT, packPose, moveVector } from '../../src/xr/rig.js'
import { makeInteraction } from '../../src/xr/interact.js'
import { makeVRButton, SESSION_INIT } from '../../src/xr/vr-button.js'
import { worldLook, DEFAULT_WORLD } from '../../src/render/scene.js'
import { stage, fakeRenderer } from './c-helpers.mjs'

const near = (a, b, eps = 1e-6) => Math.abs(a - b) < eps

test('pose(): world p/yaw of the body, rig-space head and hands, rounded', () => {
  const rig = new PlayerRig(fakeRenderer(), new THREE.PerspectiveCamera())
  const scene = new THREE.Scene(); scene.add(rig.root)
  rig.root.position.set(1.23456, 0, -2); rig.look(0.5, -0.25)
  const p = rig.pose()
  assert.deepEqual(p.p, [1.235, 0, -2])
  assert.ok(near(p.yaw, 0.5, 1e-4))
  assert.equal(p.head.length, 7)
  assert.deepEqual(p.head.slice(0, 3), [0, EYE_HEIGHT, 0])
  assert.ok(near(Math.hypot(...p.head.slice(3)), 1, 1e-3), 'unit quaternion')
  assert.equal(p.hands[0], null)
  assert.equal(p.hands[1].length, 7, 'desktop synthesises a right hand')
  assert.equal(p.mode, 'desktop'); assert.equal(p.mounted, false)
  const o = new THREE.Object3D(); o.position.set(0.0004, 1, 2); o.quaternion.set(0, 0.70710678, 0, 0.70710678)
  assert.deepEqual(packPose(o), [0, 1, 2, 0, 0.7071, 0, 0.7071])
  // pitch is clamped short of straight up/down
  rig.look(0, -10); assert.ok(near(rig.pitch, -1.45))
})

test('moveVector: forward is -Z at yaw 0, strafe is +X; rotates with yaw', () => {
  const [x0, z0] = moveVector(0, 1, 0); assert.ok(near(x0, 0) && near(z0, -1))
  const [x1, z1] = moveVector(0, 0, 1); assert.ok(near(x1, 1) && near(z1, 0))
  const [x2, z2] = moveVector(Math.PI / 2, 1, 0); assert.ok(near(x2, -1) && near(z2, 0))
})

test('snapTurn pivots around the head; move follows head yaw; teleport places the head', () => {
  const rig = new PlayerRig(fakeRenderer(), new THREE.PerspectiveCamera())
  const scene = new THREE.Scene(); scene.add(rig.root)
  rig.head.position.set(0.45, 1.6, 0.2) // standing off-centre in the room
  scene.updateMatrixWorld(true)
  const before = rig.head.getWorldPosition(new THREE.Vector3())
  rig.snapTurn(-Math.PI / 6)
  const after = rig.head.getWorldPosition(new THREE.Vector3())
  assert.ok(before.distanceTo(after) < 1e-9, 'head drift 0')
  assert.ok(near(rig.root.rotation.y, -Math.PI / 6))
  rig.root.rotation.set(0, 0, 0); rig.root.position.set(0, 0, 0); rig.head.position.set(0, 1.6, 0); rig.head.rotation.set(0, 0, 0)
  rig.move(1, 0, 1, 2)
  assert.ok(near(rig.root.position.z, -2) && near(rig.root.position.x, 0))
  rig.head.position.set(0.5, 1.6, 0)
  rig.teleport(new THREE.Vector3(10, 0, 10))
  assert.ok(near(rig.root.position.x + 0.5, 10) && near(rig.root.position.z, 10))
})

test('mount adopts the rig into the seat; dismount keeps the world pose; a vanished seat drops the rider', () => {
  const rig = new PlayerRig(fakeRenderer(), new THREE.PerspectiveCamera())
  const scene = new THREE.Scene(); scene.add(rig.root)
  const horse = new THREE.Group(); horse.position.set(5, 0, 0); horse.rotation.y = 1; scene.add(horse)
  const seat = new THREE.Group(); seat.position.y = 1.4; horse.add(seat)
  assert.ok(rig.mount(seat))
  assert.equal(rig.root.parent, seat); assert.deepEqual(rig.root.position.toArray(), [0, 0, 0])
  rig.move(1, 0, 1); assert.deepEqual(rig.root.position.toArray(), [0, 0, 0], 'riding: the mount moves, not the rig')
  assert.equal(rig.pose().mounted, true)
  assert.ok(near(rig.pose().p[1], 1.4, 1e-3))
  rig.dismount()
  assert.equal(rig.root.parent, scene)
  assert.ok(near(rig.root.position.x, 5) && rig.root.position.y === 0)
  assert.ok(near(rig.root.rotation.y, 1), 'keeps the mount\'s heading')
  rig.mount(seat); horse.removeFromParent(); rig.update()
  assert.equal(rig.mountedOn, null); assert.equal(rig.root.parent, scene)
})

test('session start/end: headset owns the camera, then the desktop eye returns', () => {
  const r = fakeRenderer(); const rig = new PlayerRig(r, new THREE.PerspectiveCamera())
  rig.look(0, 0.3)
  r.xr.dispatch('sessionstart')
  assert.deepEqual(rig.head.position.toArray(), [0, 0, 0])
  rig.head.position.set(0.1, 1.7, 0.2) // what the headset left behind
  r.xr.dispatch('sessionend')
  assert.deepEqual(rig.head.position.toArray(), [0, EYE_HEIGHT, 0])
  assert.ok(near(rig.head.rotation.x, 0.3))
})

// a scripted pointer: what pointers.update() would produce for one controller
function fakePointers (kind = 'xr') {
  const p = { id: kind === 'xr' ? 'xr-1' : 'mouse', kind, active: true, ray: new THREE.Raycaster(), matrix: new THREE.Matrix4(), down: false, pressed: false, released: false, squeeze: false, squeezed: false, dragPx: 0, hand: { index: 1, grip: new THREE.Group() } }
  const queue = []
  return {
    p,
    aim (origin, target) {
      const dir = target.clone().sub(origin).normalize()
      p.ray.set(origin, dir)
      p.matrix.lookAt(new THREE.Vector3(), dir.clone().negate(), new THREE.Vector3(0, 1, 0)).setPosition(origin)
    },
    queue: (ev) => queue.push(ev),
    update () {
      p.pressed = p.released = p.squeezed = false
      for (const ev of queue.splice(0)) { if (ev === 'down') { p.pressed = p.down = true } if (ev === 'up') { p.released = true; p.down = false } if (ev === 'squeeze') p.squeezed = true }
    },
    list: () => [p],
    get: (id) => (id === p.id ? p : null),
  }
}

function setup (kind, opts = {}) {
  const s = stage()
  s.ops([
    { op: 'spawn', id: 'sheep', preset: 'sheep', at: [0, 0, -5] },
    { op: 'spawn', id: 'horse', preset: 'horse', at: [1.5, 0, 0] },
  ])
  const rig = new PlayerRig(fakeRenderer({ presenting: kind === 'xr' }), new THREE.PerspectiveCamera())
  s.scene.add(rig.root)
  const P = fakePointers(kind)
  const commits = []
  const ia = makeInteraction({ world: s.world, reconciler: s.rec, pointers: P, rig, commit: (ops, m) => commits.push({ ops, m }), ...opts })
  // the app's order: interaction, then the reconciler, then render
  const frame = (dt = 1 / 60) => { ia.update(dt); s.rec.frame(dt); s.scene.updateMatrixWorld(true) }
  frame(0)
  return { ...s, rig, P, ia, commits, frame }
}

test('XR: trigger grabs with the controller pose, previews every frame, commits <= 10 Hz, release unpins', () => {
  const calls = []
  const ownership = {
    canGrab: () => true,
    pinOps: (id) => { calls.push('pin'); return [{ op: 'pin', id, owner: 'p_c', ifOwner: '' }] },
    unpinOps: (id, { transform } = {}) => [...(transform ? [{ op: 'transform', id, ...transform }] : []), { op: 'unpin', id, ifOwner: 'p_c' }],
  }
  const t = setup('xr', { ownership })
  t.P.aim(new THREE.Vector3(0, 1.3, 0), new THREE.Vector3(0, 0.6, -5))
  t.P.queue('down'); t.frame()
  assert.equal(t.ia.selected, 'sheep'); assert.equal(t.ia.grabbing, 'sheep')
  assert.deepEqual(t.commits.map((c) => c.ops[0].op), ['pin'])
  // sweep the controller 1 m right over 1 s at 60 fps
  for (let i = 1; i <= 60; i++) { t.P.p.matrix.setPosition(i / 60, 1.3, 0); t.frame(1 / 60) }
  const drags = t.commits.filter((c) => c.m.message.startsWith('drag'))
  assert.ok(drags.length >= 8 && drags.length <= 11, `~10 Hz, got ${drags.length}`)
  assert.equal(drags[0].ops[0].op, 'transform')
  const root = t.rec.objectFor('sheep')
  assert.ok(near(root.position.x, 1, 1e-3), 'preview follows the controller exactly')
  assert.ok(near(t.world.get('sheep').live.p[0], 1, 1e-3), 'owned: the sim continues from the dragged pose')
  t.P.queue('up'); t.frame()
  assert.equal(t.ia.grabbing, null)
  const last = t.commits.at(-1).ops
  assert.deepEqual(last.map((o) => o.op), ['transform', 'unpin'], 'final transform and unpin in one change')
  assert.ok(near(last[0].p[0], 1, 1e-3)); assert.equal(typeof last[0].yaw, 'number')
  t.stop()
})

test('a refused grab reports "held by X" and writes nothing', () => {
  const seen = []
  const t = setup('xr', { canGrab: (id) => (id === 'sheep' ? 'held by Bea' : true), onSelect: (id, info) => seen.push([id, info.refused ?? null]) })
  t.P.aim(new THREE.Vector3(0, 1.3, 0), new THREE.Vector3(0, 0.6, -5))
  t.frame(); t.P.queue('down'); t.frame()
  assert.equal(t.ia.grabbing, null)
  assert.deepEqual(seen[0], ['sheep', 'held by Bea'])
  assert.equal(t.commits.length, 0)
  t.stop()
})

test('a drag whose pin went to another peer aborts on release and writes nothing', () => {
  const t = setup('xr', { ownership: { canGrab: () => true, pinOps: () => [], unpinOps: () => [] } })
  t.P.aim(new THREE.Vector3(0, 1.3, 0), new THREE.Vector3(0, 0.6, -5))
  t.P.queue('down'); t.frame()
  t.handle.change((d) => { d.entities.sheep.owner = 'p_other' }) // someone else's pin wins the race
  t.commits.length = 0
  t.P.queue('up'); t.frame()
  assert.equal(t.commits.length, 0)
  t.stop()
})

test('a drag that lost its pin to a concurrent grab stops committing and writes nothing, even after the winner let go', () => {
  let t = null
  const ownership = {
    canGrab: () => true,
    pinOps: (id) => [{ op: 'pin', id, owner: 'p_c', ifOwner: '' }],
    unpinOps: (id, { transform } = {}) => (String(t.world.get(id).owner) === 'p_c' ? [...(transform ? [{ op: 'transform', id, ...transform }] : []), { op: 'unpin', id, ifOwner: 'p_c' }] : []),
    pinnedToMe: (id) => String(t.world.get(id)?.owner ?? '') === 'p_c',
  }
  const refused = []
  t = setup('xr', { ownership, onSelect: (id, info) => { if (info.refused) refused.push(info.refused) } })
  t.P.aim(new THREE.Vector3(0, 1.3, 0), new THREE.Vector3(0, 0.6, -5))
  t.P.queue('down'); t.frame()
  // before the pin lands nothing is committed
  for (let i = 1; i <= 12; i++) { t.P.p.matrix.setPosition(i / 60, 1.3, 0); t.frame(1 / 60) }
  assert.equal(t.commits.filter((c) => c.m.message.startsWith('drag')).length, 0, 'no drag commits before the pin is mine')
  t.handle.change((d) => { d.entities.sheep.owner = 'p_c' }) // my pin landed
  for (let i = 13; i <= 30; i++) { t.P.p.matrix.setPosition(i / 60, 1.3, 0); t.frame(1 / 60) }
  assert.ok(t.commits.some((c) => c.m.message.startsWith('drag')), 'drags commit once the pin is mine')
  t.handle.change((d) => { d.entities.sheep.owner = 'p_other' }) // the merge: the other grab won
  t.commits.length = 0
  t.P.p.matrix.setPosition(0.8, 1.3, 0); t.frame(1 / 60)
  assert.equal(t.ia.grabbing, null, 'the drag aborted locally')
  assert.match(refused.at(-1), /held by p_other/)
  t.handle.change((d) => { d.entities.sheep.owner = '' }) // the winner let go
  t.P.queue('up'); t.frame()
  assert.equal(t.commits.length, 0, 'nothing written: no drag, no release over the winner\'s pose')
  t.stop()
})

test('a quick drag released before its pin lands commits its transform with a conditional unpin', () => {
  let t = null
  const ownership = {
    canGrab: () => true,
    pinOps: (id) => [{ op: 'pin', id, owner: 'p_c', ifOwner: '' }],
    unpinOps: () => [],
    pinnedToMe: (id) => String(t.world.get(id)?.owner ?? '') === 'p_c',
  }
  t = setup('xr', { ownership })
  t.world.peerId = 'p_c'
  t.P.aim(new THREE.Vector3(0, 1.3, 0), new THREE.Vector3(0, 0.6, -5))
  t.P.queue('down'); t.frame()
  t.P.p.matrix.setPosition(0.5, 1.3, 0); t.frame(1 / 60)
  t.P.queue('up'); t.frame()
  assert.deepEqual(t.commits.at(-1).ops.map((o) => o.op), ['transform', 'unpin'])
  assert.equal(t.commits.at(-1).ops[1].ifOwner, 'p_c')
  t.stop()
})

test('mouse: click selects, drag on the selection moves it on the ground plane', () => {
  const t = setup('mouse')
  const eye = new THREE.Vector3(0, 1.6, 3)
  t.P.aim(eye, new THREE.Vector3(0, 0.6, -5))
  t.P.queue('down'); t.frame(); t.P.queue('up'); t.frame()
  assert.equal(t.ia.selected, 'sheep'); assert.equal(t.ia.grabbing, null)
  t.P.queue('down'); t.frame()
  t.P.p.dragPx = 10; t.P.aim(eye, new THREE.Vector3(2, 0.6, -5)); t.frame()
  assert.equal(t.ia.grabbing, 'sheep')
  t.P.aim(eye, new THREE.Vector3(4, 0.6, -5))
  for (let i = 0; i < 5; i++) t.frame()
  const root = t.rec.objectFor('sheep')
  assert.ok(root.position.x > 1 && near(root.position.y, 0), `on the ground plane, x=${root.position.x}`)
  t.P.queue('up'); t.frame()
  const op = t.commits.at(-1).ops[0]
  assert.equal(op.op, 'transform'); assert.equal(op.yaw, undefined, 'a plane drag never writes rotation')
  // click on nothing clears the selection
  t.P.aim(eye, new THREE.Vector3(0, 30, 3)); t.P.queue('down'); t.frame(); t.P.queue('up'); t.frame()
  assert.equal(t.ia.selected, null)
  t.stop()
})

test('squeeze near a mount rides it (the seat anchor), squeeze again dismounts', () => {
  const mounts = []
  const t = setup('xr', { onMount: (id) => mounts.push(['on', id]), onDismount: (id) => mounts.push(['off', id]) })
  t.P.queue('squeeze'); t.frame()
  assert.equal(t.ia.mounted, 'horse')
  assert.equal(t.rig.root.parent, t.rec.anchorObject('horse', 'seat'))
  t.P.queue('squeeze'); t.frame()
  assert.equal(t.ia.mounted, null); assert.equal(t.rig.root.parent, t.scene)
  assert.deepEqual(mounts, [['on', 'horse'], ['off', 'horse']])
  t.stop()
})

test('scene settings and the VR button degrade cleanly', async () => {
  assert.deepEqual(worldLook(undefined), { bounds: 40, ground: DEFAULT_WORLD.ground.color, sky: DEFAULT_WORLD.sky.color, fogNear: 36, fogFar: 120 })
  assert.equal(worldLook({ bounds: 10, sky: { color: '#000' } }).sky, '#000000')
  const b = makeVRButton({ xr: {} }, { doc: null })
  assert.equal(b.hidden, true)
  assert.equal(await b.supported, false, 'no navigator.xr in Node: unsupported, nothing shown')
  assert.equal(b.hidden, true)
  assert.equal(typeof b.enter, 'function'); assert.equal(b.session, null)
  assert.deepEqual(SESSION_INIT.optionalFeatures, ['local-floor', 'bounded-floor', 'hand-tracking', 'layers'])
})
