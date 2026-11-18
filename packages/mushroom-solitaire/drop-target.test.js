import { test } from 'node:test'
import assert from 'node:assert/strict'
import { chooseDropTarget } from './drop-target.js'
const rect = (left, top, width = 100, height = 140) => ({ left, top, right: left + width, bottom: top + height, width, height })
const targets = [{ id: 'left', rect: rect(100, 100) }, { id: 'right', rect: rect(220, 100) }]
test('direct destination wins over overlapping neighbors', () => {
  assert.equal(chooseDropTarget({ x: 240, y: 140 }, rect(170, 100), targets)?.id, 'right')
})
test('a gap or a near miss below a pile still lands on that pile', () => {
  assert.equal(chooseDropTarget({ x: 208, y: 160 }, rect(150, 120), targets)?.id, 'left')
  assert.equal(chooseDropTarget({ x: 150, y: 260 }, rect(100, 150), targets)?.id, 'left')
})
test('card overlap counts when the finger is beyond the destination', () => {
  assert.equal(chooseDropTarget({ x: 155, y: 305 }, rect(105, 160), targets)?.id, 'left')
})
test('a distant or tiny accidental overlap does not move the card', () => {
  assert.equal(chooseDropTarget({ x: 10, y: 500 }, rect(0, 400), targets), null)
  assert.equal(chooseDropTarget({ x: 15, y: 370 }, rect(5, 235), targets), null)
  assert.equal(chooseDropTarget({ x: 150, y: 140 }, rect(100, 100), []), null)
})
