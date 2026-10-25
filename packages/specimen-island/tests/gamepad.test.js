import test from 'node:test'
import assert from 'node:assert/strict'
import { GamepadInput, stick } from '../src/core/gamepad.js'

let pads = []
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { getGamepads: () => pads } })
const makePad = (id = 'Xbox Wireless Controller', index = 0) => ({ id, index, connected: true, mapping: 'standard', axes: [0, 0, 0, 0], buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })) })
const setButton = (pad, i, value) => { pad.buttons[i] = { pressed: value > 0.5, value } }
const setup = () => {
  const pad = makePad()
  pads = [pad]
  const input = new GamepadInput()
  input.poll(1 / 60)
  return { pad, input }
}

test('radial deadzone rejects drift and preserves proportional movement', () => {
  assert.deepEqual(stick(0.1, -0.1), { x: 0, y: 0 })
  assert.ok(stick(0.5, 0).x > 0 && stick(0.5, 0).x < 0.5)
  assert.equal(stick(1, 0).x, 1)
  assert.ok(Math.abs(Math.hypot(...Object.values(stick(1, 1))) - 1) < 1e-12)
})

test('USB and wireless IDs use the same standard mapping, including sparse slots', () => {
  for (const id of ['Xbox 360 Controller (USB)', 'Xbox Wireless Controller (Bluetooth)']) {
    const pad = makePad(id, 2)
    pads = [null, null, pad]
    const input = new GamepadInput()
    input.poll(1 / 60)
    setButton(pad, 7, 0.8)
    input.poll(1 / 60)
    assert.ok(input.actions.has('fire'))
    assert.ok(input.actionEdges.has('fire'))
    input.poll(1 / 60)
    assert.equal(input.actionEdges.size, 0)
    setButton(pad, 7, 0)
    input.poll(1 / 60)
    assert.ok(input.actionReleases.has('fire'))
  }
})

test('all field actions and vehicle controls are reachable', () => {
  const { pad, input } = setup()
  const expected = ['jump', 'crouch', 'reload', 'interact', 'prevWeapon', 'nextWeapon', 'aim', 'fire', 'journal', 'pause', 'sprint', 'flashlight', 'map', 'medkit', 'throwStone', 'throwFlare']
  for (let i = 0; i < 16; i++) {
    setButton(pad, i, 1)
    input.poll(1 / 60)
    assert.ok(input.actions.has(expected[i]), expected[i])
    setButton(pad, i, 0)
    input.poll(1 / 60)
  }
  input.poll(1 / 60, { vehicle: true })
  for (const i of [0, 1, 4]) setButton(pad, i, 1)
  input.poll(1 / 60, { vehicle: true })
  for (const action of ['ascend', 'descend', 'camera']) assert.ok(input.actions.has(action))
  assert.equal(input.actions.has('prevWeapon'), false)
})

test('movement axes are analog in both directions and look is frame-rate independent', () => {
  const { pad, input } = setup()
  pad.axes = [0.6, -0.5, 0.8, -0.5]
  input.poll(1 / 60)
  assert.ok(input.axis('back', 'forward') > 0 && input.axis('back', 'forward') < 1)
  assert.equal(input.axis('left', 'right'), -input.axis('right', 'left'))
  const dx = input.lookDX
  input.poll(1 / 30)
  assert.equal(input.lookDX, dx * 2)
  assert.ok(input.lookDY < 0)
})

test('disconnect clears held actions and reconnect cannot fire until release', () => {
  const { pad, input } = setup()
  setButton(pad, 7, 1)
  pad.axes[1] = -1
  input.poll(1 / 60)
  pads = []
  input.poll(1 / 60)
  assert.equal(input.disconnected, true)
  assert.equal(input.actions.size, 0)
  assert.equal(input.axis('back', 'forward'), 0)
  pads = [pad]
  input.poll(1 / 60)
  assert.equal(input.actions.size, 0)
  setButton(pad, 7, 0)
  input.poll(1 / 60)
  setButton(pad, 7, 1)
  input.poll(1 / 60)
  assert.ok(input.actionEdges.has('fire'))
})

test('menu selection and held buttons do not leak into gameplay', () => {
  const { pad, input } = setup()
  input.poll(1 / 60, { menu: true })
  setButton(pad, 0, 1)
  input.poll(1 / 60, { menu: true })
  assert.ok(input.edges.has(0))
  assert.equal(input.actions.size, 0)
  input.poll(1 / 60)
  assert.equal(input.actions.has('jump'), false)
  setButton(pad, 0, 0)
  input.poll(1 / 60)
  setButton(pad, 0, 1)
  input.poll(1 / 60)
  assert.ok(input.actionEdges.has('jump'))
})

test('focus loss clears controls and focus regain requires button release', () => {
  const { pad, input } = setup()
  setButton(pad, 3, 1)
  pad.axes = [1, 1, 1, 1]
  input.poll(1 / 60, { focused: false })
  assert.equal(input.actions.size, 0)
  assert.equal(input.lookDX, 0)
  assert.equal(input.move.x, 0)
  input.poll(1 / 60)
  assert.equal(input.actions.has('interact'), false)
  assert.equal(input.edges.size, 0)
})

test('unmapped devices and missing or denied APIs fail safely', () => {
  const { pad, input } = setup()
  pad.mapping = ''
  input.poll(1 / 60)
  assert.equal(input.pad, null)
  assert.match(input.status, /without a standard layout/)
  const get = navigator.getGamepads
  for (const api of [undefined, () => { throw new Error('SecurityError') }]) {
    navigator.getGamepads = api
    input.poll(1 / 60)
    assert.equal(input.actions.size, 0)
    assert.match(input.status, /unavailable/)
  }
  navigator.getGamepads = get
})


test('reconnecting in a menu does not activate a held A button', () => {
  const { pad, input } = setup()
  pads = []
  input.poll(1 / 60, { menu: true })
  setButton(pad, 0, 1)
  pads = [pad]
  input.poll(1 / 60, { menu: true })
  assert.equal(input.edges.has(0), false)
  setButton(pad, 0, 0)
  input.poll(1 / 60, { menu: true })
  setButton(pad, 0, 1)
  input.poll(1 / 60, { menu: true })
  assert.equal(input.edges.has(0), true)
})
