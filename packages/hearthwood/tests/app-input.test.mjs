// App module: input.js driven through fake event targets (no DOM).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createInput } from '../src/input.js'
import { createGame, setupStart } from '../src/game.js'
import { Camera } from '../src/camera.js'
import { createOverlay } from '../src/overlay.js'
import {
  B_HEARTH, B_STOREHOUSE, B_SAWMILL, B_WARDEN_HALL, U_WARDEN, U_COURIER, U_CRAWLER, F_BLIGHT,
  O_MOVE, O_ATTACK_MOVE, O_ATTACK, O_HOLD, O_NONE, P_OK, TILE, I_WOOD, I_STONE, MAX_UNITS,
} from '../src/constants.js'

class FakeTarget {
  constructor() { this.l = new Map(); this.style = {} }
  addEventListener(t, f) { if (!this.l.has(t)) this.l.set(t, []); this.l.get(t).push(f) }
  removeEventListener(t, f) { const a = this.l.get(t); if (a) this.l.set(t, a.filter((x) => x !== f)) }
  fire(t, e = {}) { for (const f of this.l.get(t) || []) f({ preventDefault() {}, ...e }) }
  count() { let n = 0; for (const a of this.l.values()) n += a.length; return n }
  getBoundingClientRect() { return { left: 0, top: 0, width: 640, height: 400 } }
}

/** 64x64 grass world, hearth in the middle, stocked; camera 640x400 at zoom 1 centred on (32,32). */
function setup() {
  const game = createGame({ w: 64, h: 64, seed: 3, waves: false, start: false,
    context: { generate: false, maxUnits: 4096, maxBuildings: 1024 } })
  const ctx = game.ctx
  setupStart(ctx)
  const hearth = ctx.buildings.typeList[B_HEARTH][0]
  const camera = new Camera(64, 64)
  camera.resize(640, 400, 1)
  camera.centerOn(32, 32)
  const overlay = createOverlay(MAX_UNITS)
  const canvas = new FakeTarget()
  const keys = new FakeTarget()
  const toasts = []
  let t = 1000
  const input = createInput(canvas, game, camera, overlay, {
    keyTarget: keys, onToast: (m, k) => toasts.push([m, k]), now: () => (t += 500), noEdgePan: true,
  })
  // world (tile units) -> CSS px
  const S = (wx, wy) => ({ clientX: (wx - camera.x) * camera.scale + 320, clientY: (wy - camera.y) * camera.scale + 200 })
  const click = (wx, wy, button = 0, extra = {}) => {
    const p = { ...S(wx, wy), button, pointerId: 1, ...extra }
    canvas.fire('pointermove', p)
    canvas.fire('pointerdown', p)
    canvas.fire('pointerup', p)
  }
  const key = (code, extra = {}) => { keys.fire('keydown', { code, ...extra }); keys.fire('keyup', { code }) }
  return { game, ctx, hearth, camera, overlay, canvas, keys, input, toasts, S, click, key, setTime: (v) => { t = v } }
}

test('placement: hotkey ghost, valid click places a construction site (nothing paid), invalid click toasts', async () => {
  const env = setup()
  const { ctx, overlay, key, click, toasts, input } = env
  env.canvas.fire('pointermove', env.S(20.2, 20.2))
  key('Digit6') // storehouse
  assert.equal(overlay.ghostType, B_STOREHOUSE)
  input.update(1 / 60)
  assert.deepEqual([overlay.ghostTx, overlay.ghostTy], [19, 19])
  assert.equal(overlay.ghostReason, P_OK)
  const wood = ctx.stock[I_WOOD], stone = ctx.stock[I_STONE]
  click(20.2, 20.2)
  assert.equal(ctx.buildings.typeCount[B_STOREHOUSE], 1)
  const st = ctx.buildings.typeList[B_STOREHOUSE][0]
  assert.equal(ctx.buildings.site[st], 1, 'placed as a construction site')
  assert.equal(ctx.stock[I_WOOD], wood, 'placement pays nothing up front')
  assert.equal(ctx.stock[I_STONE], stone)
  assert.equal(overlay.ghostType, 0, 'placement ends without Shift')
  // Shift keeps placing; invalid spot (on the hearth) toasts the reason
  const saws = ctx.buildings.typeCount[B_SAWMILL] // the hamlet already has one
  key('Digit4')
  click(32, 32, 0, { shiftKey: true })
  assert.equal(ctx.buildings.typeCount[B_SAWMILL], saws)
  assert.match(toasts.at(-1)[0], /blocked/)
  assert.equal(toasts.at(-1)[1], 'bad')
  click(12.5, 40.5, 0, { shiftKey: true })
  click(16.5, 40.5, 0, { shiftKey: true })
  assert.equal(ctx.buildings.typeCount[B_SAWMILL], saws + 2)
  assert.equal(overlay.ghostType, B_SAWMILL)
  // same hotkey toggles placement off; right-click cancels too
  key('Digit4')
  assert.equal(overlay.ghostType, 0)
  key('Digit4')
  click(10, 10, 2)
  assert.equal(overlay.ghostType, 0)
  // Hearth is not buildable
  input.beginPlace(B_HEARTH)
  assert.equal(overlay.ghostType, 0)
})

test('box select takes player soldiers only; click selects a courier; right-click moves', async () => {
  const env = setup()
  const { ctx, overlay, canvas, S, input } = env
  const { spawnUnit } = await import('../src/units.js')
  const w = [0, 1, 2, 3].map((i) => spawnUnit(ctx, U_WARDEN, 24 + i * 0.7, 24.5))
  const enemy = spawnUnit(ctx, U_CRAWLER, 52.5, 8.5, F_BLIGHT) // out of everyone's sight
  env.game.tickN(1)
  // drag a box around the wardens plus a courier (and later a crawler) inside it
  const c = spawnUnit(ctx, U_COURIER, 25.5, 25.2)
  env.game.tickN(1)
  const scout = spawnUnit(ctx, U_CRAWLER, 27.5, 27.5, F_BLIGHT)
  ctx.units.hp[scout] = 1e9 // survive the wardens' first volley
  env.game.tickN(1)
  assert.equal(ctx.units.alive[scout], 1)
  canvas.fire('pointerdown', { ...S(23, 23), button: 0, pointerId: 1 })
  canvas.fire('pointermove', { ...S(25, 24) })
  canvas.fire('pointermove', { ...S(28, 28) })
  assert.equal(overlay.dragActive, true)
  canvas.fire('pointerup', { ...S(28, 28), button: 0, pointerId: 1 })
  assert.equal(overlay.dragActive, false)
  const sel = Array.from(overlay.sel.subarray(0, overlay.selCount)).sort((a, b) => a - b)
  assert.deepEqual(sel, w.slice().sort((a, b) => a - b), 'wardens only: no courier, no blight')
  // right-click on empty ground: group move with distinct goals
  env.click(40.5, 30.5, 2)
  const goals = new Set()
  for (const id of w) { assert.equal(ctx.units.order[id], O_MOVE); goals.add(ctx.units.orderTile[id]) }
  assert.equal(goals.size, 4)
  assert.equal(overlay.pingKind, 0)
  // right-click on the crawler: attack it
  env.click(ctx.units.x[enemy], ctx.units.y[enemy], 2)
  for (const id of w) { assert.equal(ctx.units.order[id], O_ATTACK); assert.equal(ctx.units.target[id], enemy) }
  // H holds, X stops
  env.key('KeyH')
  for (const id of w) assert.equal(ctx.units.order[id], O_HOLD)
  env.key('KeyX')
  for (const id of w) assert.equal(ctx.units.order[id], O_NONE)
  // single click picks the courier
  env.click(ctx.units.x[c], ctx.units.y[c])
  assert.equal(overlay.selCount, 1)
  assert.equal(overlay.sel[0], c)
  // couriers ignore orders (filtered before reaching combat)
  env.click(40.5, 40.5, 2)
  assert.equal(ctx.units.order[c], O_NONE)
  input.dispose()
})

test('attack-move: A arms only with soldiers selected; Esc order is placement -> arm -> selection', async () => {
  const env = setup()
  const { ctx, overlay, key, input } = env
  const { spawnUnit } = await import('../src/units.js')
  key('KeyA')
  assert.equal(overlay.attackMoveArmed, 0, 'no soldiers: A pans instead')
  const ids = [spawnUnit(ctx, U_WARDEN, 20.5, 20.5), spawnUnit(ctx, U_WARDEN, 21.5, 20.5)]
  env.game.tickN(1)
  input.selectUnits(Int32Array.from(ids), 2, false)
  key('KeyA')
  assert.equal(overlay.attackMoveArmed, 1)
  env.click(40.5, 40.5)
  for (const id of ids) assert.equal(ctx.units.order[id], O_ATTACK_MOVE)
  assert.equal(overlay.attackMoveArmed, 0)
  assert.equal(overlay.pingKind, 1)
  // Esc chain
  key('KeyA')
  input.beginPlace(B_STOREHOUSE)
  assert.equal(overlay.attackMoveArmed, 0, 'placing disarms attack-move')
  key('KeyA')
  assert.equal(overlay.ghostType, 0, 'arming cancels placement')
  input.beginPlace(B_STOREHOUSE)
  key('Escape')
  assert.equal(overlay.ghostType, 0)
  assert.equal(overlay.selCount, 2)
  key('KeyA')
  key('Escape')
  assert.equal(overlay.attackMoveArmed, 0)
  assert.equal(overlay.selCount, 2)
  key('Escape')
  assert.equal(overlay.selCount, 0)
})

test('control groups: Ctrl+digit stores id/gen, Shift+digit recalls and drops the dead, double tap centres', async () => {
  const env = setup()
  const { ctx, overlay, key, input, camera } = env
  const { spawnUnit, despawnUnit } = await import('../src/units.js')
  const ids = [spawnUnit(ctx, U_WARDEN, 10.5, 50.5), spawnUnit(ctx, U_WARDEN, 11.5, 50.5), spawnUnit(ctx, U_WARDEN, 12.5, 50.5)]
  env.game.tickN(1)
  input.selectUnits(Int32Array.from(ids), 3, false)
  key('Digit3', { ctrlKey: true })
  assert.deepEqual(input.groups[3], [ids[0], ctx.units.gen[ids[0]], ids[1], ctx.units.gen[ids[1]], ids[2], ctx.units.gen[ids[2]]])
  assert.equal(overlay.ghostType, 0, 'Ctrl+3 does not start placement')
  input.clearSelection()
  despawnUnit(ctx, ids[1], true)
  spawnUnit(ctx, U_WARDEN, 30.5, 30.5) // reuses the slot with a new generation
  env.setTime(10_000)
  key('Digit3', { shiftKey: true })
  assert.deepEqual(Array.from(overlay.sel.subarray(0, overlay.selCount)), [ids[0], ids[2]])
  const cx = camera.x
  env.setTime(10_100)
  key('Digit3', { shiftKey: true })
  assert.notEqual(camera.x, cx, 'double tap recentres')
  assert.ok(Math.abs(camera.y - 50.5) < 1e-6 || camera.y < 50.5) // clamped near the group
})

test('building selection: click selects, P pauses, Delete demolishes with refund, Hearth refuses', async () => {
  const env = setup()
  const { ctx, overlay, key, click, toasts, hearth } = env
  const { placeBuilding } = await import('../src/buildings.js')
  const saw = placeBuilding(ctx, B_SAWMILL, 20, 40, { free: true })
  assert.ok(saw >= 0)
  click(20.5, 40.5)
  assert.equal(overlay.selBuilding, saw)
  key('KeyP')
  assert.equal(ctx.buildings.paused[saw], 1)
  key('KeyP')
  assert.equal(ctx.buildings.paused[saw], 0)
  const plank = ctx.stock[I_WOOD]
  key('Delete')
  assert.equal(ctx.buildings.alive[saw], 0)
  assert.equal(overlay.selBuilding, -1)
  assert.equal(ctx.stock[I_WOOD], plank + 7) // floor(15 * 0.5)
  assert.match(toasts.at(-1)[0], /Sawmill demolished.*\+7 Heartwood/)
  click(32.5, 32.5)
  assert.equal(overlay.selBuilding, hearth)
  key('Backspace')
  assert.equal(ctx.buildings.alive[hearth], 1)
  assert.match(toasts.at(-1)[0], /Hearth/)
})

test('right-click with a Warden Hall selected sets its rally tile', async () => {
  const env = setup()
  const { ctx, overlay, click } = env
  const { placeBuilding } = await import('../src/buildings.js')
  const hall = placeBuilding(ctx, B_WARDEN_HALL, 40, 20, { free: true })
  click(41, 21)
  assert.equal(overlay.selBuilding, hall)
  click(50.5, 10.5, 2)
  assert.equal(ctx.buildings.rally[hall], ctx.world.idx(50, 10))
})

test('keyboard pan, wheel zoom, speed keys, pause, build-menu toggle, dispose', () => {
  const env = setup()
  const { camera, keys, canvas, input, game, S } = env
  const x0 = camera.x
  keys.fire('keydown', { code: 'KeyD' })
  input.update(0.1)
  keys.fire('keyup', { code: 'KeyD' })
  input.update(0.1)
  assert.ok(Math.abs(camera.x - x0 - 900 * 0.1 / TILE) < 1e-6, 'PAN_SPEED px/s at zoom 1')
  keys.fire('blur')
  const p = S(30, 30)
  const before = camera.screenToWorld(p.clientX, p.clientY, { x: 0, y: 0 })
  canvas.fire('wheel', { ...p, deltaY: -100, deltaMode: 0 })
  assert.ok(Math.abs(camera.zoom - 1.15) < 1e-9)
  const after = camera.screenToWorld(p.clientX, p.clientY, { x: 0, y: 0 })
  assert.ok(Math.abs(before.x - after.x) < 1e-9)
  env.key('Equal'); assert.equal(game.speed, 2)
  env.key('Equal'); assert.equal(game.speed, 4)
  env.key('Minus'); assert.equal(game.speed, 2)
  env.key('Space'); assert.equal(game.paused, true)
  env.key('Space'); assert.equal(game.paused, false)
  assert.equal(input.buildMenuOpen, true)
  env.key('KeyB'); assert.equal(input.buildMenuOpen, false)
  assert.ok(canvas.count() > 0 && keys.count() > 0)
  input.dispose()
  assert.equal(canvas.count(), 0)
  assert.equal(keys.count(), 0)
})

test('update() prunes dead selections and clears state when ctx is replaced', async () => {
  const env = setup()
  const { ctx, overlay, input, game } = env
  const { spawnUnit, despawnUnit } = await import('../src/units.js')
  const a = spawnUnit(ctx, U_WARDEN, 20.5, 20.5), b = spawnUnit(ctx, U_WARDEN, 21.5, 20.5)
  game.tickN(1)
  input.selectUnits(Int32Array.from([a, b]), 2, false)
  despawnUnit(ctx, a, true)
  for (let i = 0; i < 6; i++) input.update(1 / 60)
  assert.deepEqual(Array.from(overlay.sel.subarray(0, overlay.selCount)), [b])
  input.groups[2] = [b, ctx.units.gen[b]]
  game.reset(5)
  input.update(1 / 60)
  assert.equal(overlay.selCount, 0)
  assert.deepEqual(input.groups[2], [])
})
