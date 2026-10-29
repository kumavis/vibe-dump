import test from 'node:test'
import assert from 'node:assert/strict'
import { keyAction, isTextTarget } from '../../src/editor/keys.js'
import { aheadOf, groundHit, focusPose, pitchOfQuat, lookDelta, nearestMount, forwardOf } from '../../src/editor/spatial.js'

const k = (key, extra = {}) => keyAction({ key, target: { tagName: 'CANVAS' }, ...extra })

test('keys: the editor bindings, and text fields keep theirs', () => {
  assert.equal(k('z', { ctrlKey: true }), 'undo')
  assert.equal(k('Z', { metaKey: true, shiftKey: true }), 'redo')
  assert.equal(k('y', { ctrlKey: true }), 'redo')
  assert.equal(k('Tab'), 'toggleMode'); assert.equal(k('e'), 'mount'); assert.equal(k('F'), 'focus'); assert.equal(k('g'), 'grab')
  assert.equal(k('Delete'), 'delete'); assert.equal(k('Backspace'), 'delete'); assert.equal(k('/'), 'search'); assert.equal(k('Escape'), 'escape')
  assert.equal(k('w'), null); assert.equal(k('e', { altKey: true }), null); assert.equal(k('e', { repeat: true }), null)
  const input = { tagName: 'INPUT', type: 'text' }
  assert.equal(keyAction({ key: 'z', ctrlKey: true, target: input }), null, 'native undo inside a field')
  assert.equal(keyAction({ key: 'Tab', target: { tagName: 'TEXTAREA' } }), null)
  assert.equal(keyAction({ key: 'Escape', target: input }), 'escape')
  assert.equal(isTextTarget({ tagName: 'INPUT', type: 'checkbox' }), false)
  assert.equal(isTextTarget({ tagName: 'DIV', isContentEditable: true }), true)
})

test('spatial: ahead of a pose, ground hits, a focus pose that looks at its target', () => {
  assert.deepEqual(forwardOf(0).map((x) => Math.round(x)), [-0, -1])
  assert.deepEqual(aheadOf({ p: [0, 5, 10], yaw: 0 }, 6), [0, 0, 4])
  assert.deepEqual(aheadOf({ p: [0, 0, 0], yaw: Math.PI / 2 }, 2, () => 1.5), [-2, 1.5, 0])
  assert.deepEqual(groundHit({ x: 0, y: 10, z: 0 }, { x: 0, y: -1, z: -1 }), [0, 0, -10])
  assert.equal(groundHit([0, 10, 0], [0, 1, 0]), null, 'looking at the sky')
  assert.equal(groundHit([0, 10, 0], [1, -0.0001, 0]), null, 'too far')
  const f = focusPose([4, 0, -4], { yaw: 0, dist: 8, height: 3 })
  assert.deepEqual(f.p, [4, 3, 4])
  assert.ok(Math.abs(f.yaw) < 1e-9, 'straight ahead'); assert.ok(f.pitch < 0, 'looking down')
  const s = Math.SQRT1_2
  assert.ok(Math.abs(pitchOfQuat([0, 0, 0, 1])) < 1e-9)
  assert.ok(Math.abs(pitchOfQuat([s, 0, 0, s]) - Math.PI / 2) < 1e-6, 'a +90° pitch looks straight up')
  assert.deepEqual(lookDelta({ yaw: 3, pitch: 0 }, { yaw: -3, pitch: -0.5 }).dPitch, -0.5)
  assert.ok(Math.abs(lookDelta({ yaw: 3, pitch: 0 }, { yaw: -3, pitch: 0 }).dYaw - (2 * Math.PI - 6)) < 1e-9, 'the short way round')
})

test('spatial: nearestMount picks the closest live mount in range', () => {
  const e = (id, p, c = { mount: {} }) => ({ id, c, live: { p } })
  const list = [e('far', [10, 0, 0]), e('near', [1, 0, 1]), e('dead', [0.5, 0, 0], { mount: {}, tags: { dead: true } }), e('rock', [0, 0, 0], {})]
  assert.equal(nearestMount(list, [0, 0, 0]), 'near')
  assert.equal(nearestMount(list, [0, 0, 0], { maxDist: 1 }), null)
  assert.equal(nearestMount(list, [0, 0, 0], { exclude: (x) => x.id === 'near' }), null)
})
