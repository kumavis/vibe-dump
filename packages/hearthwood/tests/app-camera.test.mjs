// App module: camera math + pure input/HUD helpers. No DOM.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Camera, CAMERA_MARGIN } from '../src/camera.js'
import { TILE, ZOOM_MIN, ZOOM_MAX, ZOOM_TIER_NEAR, ZOOM_TIER_FAR, B_SAWMILL, B_HEARTH, B_ENCHANTERY, B_SHRINE, B_WARD_TOWER } from '../src/constants.js'
import { ghostOrigin, nextSpeed, hotkeyType } from '../src/input.js'

function cam(w = 256, h = 256) {
  const c = new Camera(w, h)
  c.resize(1280, 800, 2)
  c.centerOn(w / 2, h / 2)
  return c
}

test('screenToWorld and worldToScreen are inverses', () => {
  const c = cam()
  c.zoomAt(100, 100, 1.7)
  const p = { x: 0, y: 0 }, q = { x: 0, y: 0 }
  for (const [sx, sy] of [[0, 0], [640, 400], [1279, 799], [13.5, 702.25]]) {
    c.screenToWorld(sx, sy, p)
    c.worldToScreen(p.x, p.y, q)
    assert.ok(Math.abs(q.x - sx) < 1e-6 && Math.abs(q.y - sy) < 1e-6)
  }
  c.worldToScreen(c.x, c.y, q)
  assert.deepEqual([q.x, q.y], [640, 400])
  assert.equal(c.scale, TILE * c.zoom)
})

test('zoomAt keeps the world point under the cursor fixed and clamps zoom', () => {
  const c = cam()
  const before = c.screenToWorld(300, 200, { x: 0, y: 0 })
  c.zoomAt(300, 200, 1.15)
  const after = c.screenToWorld(300, 200, { x: 0, y: 0 })
  assert.ok(Math.abs(before.x - after.x) < 1e-9 && Math.abs(before.y - after.y) < 1e-9)
  for (let i = 0; i < 100; i++) c.zoomAt(640, 400, 2)
  assert.equal(c.zoom, ZOOM_MAX)
  assert.equal(c.tier, ZOOM_TIER_NEAR)
  for (let i = 0; i < 100; i++) c.zoomAt(640, 400, 0.5)
  assert.equal(c.zoom, ZOOM_MIN)
  assert.equal(c.tier, ZOOM_TIER_FAR)
})

test('clamp keeps the view on the map with at most CAMERA_MARGIN tiles of overhang', () => {
  const c = cam()
  c.centerOn(-1000, -1000)
  const r = c.visibleRect({ x0: 0, y0: 0, x1: 0, y1: 0 })
  assert.ok(Math.abs(r.x0 + CAMERA_MARGIN) < 1e-9 && Math.abs(r.y0 + CAMERA_MARGIN) < 1e-9)
  c.panBy(1e7, 1e7)
  c.visibleRect(r)
  assert.ok(Math.abs(r.x1 - (256 + CAMERA_MARGIN)) < 1e-9 && Math.abs(r.y1 - (256 + CAMERA_MARGIN)) < 1e-9)
  // zoomed out so far the whole map width fits: centred on x; y still clamped (200 tiles tall view)
  c.setZoom(ZOOM_MIN)
  c.centerOn(3, 250)
  assert.equal(c.x, 128)
  assert.equal(c.y, 256 - 100 + CAMERA_MARGIN)
  c.resize(1280, 1280, 1)
  assert.equal(c.y, 128)
  // NaN never sticks
  c.setZoom(1)
  c.centerOn(NaN, NaN)
  assert.ok(Number.isFinite(c.x) && Number.isFinite(c.y))
})

test('visibleRect matches the viewport size', () => {
  const c = cam()
  c.setZoom(2)
  const r = c.visibleRect({ x0: 0, y0: 0, x1: 0, y1: 0 })
  assert.ok(Math.abs((r.x1 - r.x0) - 1280 / 64) < 1e-9)
  assert.ok(Math.abs((r.y1 - r.y0) - 800 / 64) < 1e-9)
})

test('ghostOrigin centres footprints on the cursor tile', () => {
  const o = { x: 0, y: 0 }
  assert.deepEqual(ghostOrigin(B_SAWMILL, 10.3, 20.9, o), { x: 9, y: 20 }) // 2x2 covers 9..10 / 20..21
  assert.deepEqual(ghostOrigin(B_ENCHANTERY, 10.3, 20.9, o), { x: 9, y: 19 }) // 3x3 centred on 10 / 20
  assert.deepEqual(ghostOrigin(B_WARD_TOWER, 10.9, 20.1, o), { x: 10, y: 20 })
})

test('nextSpeed walks 1/2/4 and saturates', () => {
  assert.equal(nextSpeed(1, 1), 2)
  assert.equal(nextSpeed(2, 1), 4)
  assert.equal(nextSpeed(4, 1), 4)
  assert.equal(nextSpeed(4, -1), 2)
  assert.equal(nextSpeed(1, -1), 1)
})

test('hotkeyType maps KeyboardEvent.code to building types', () => {
  assert.equal(hotkeyType('Digit4'), B_SAWMILL)
  assert.equal(hotkeyType('Digit0'), B_SHRINE)
  assert.equal(hotkeyType('Numpad4'), B_SAWMILL)
  assert.equal(hotkeyType('KeyE'), B_ENCHANTERY)
  assert.equal(hotkeyType('KeyW'), 0)
  assert.equal(hotkeyType('KeyH'), 0)
  assert.notEqual(hotkeyType('Digit1'), B_HEARTH)
})
