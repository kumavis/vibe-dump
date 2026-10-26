// App module: game loop (fixed timestep, speed, pause, reset), starting hamlet, stress, __hw.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createGame, setupStart, stress, installDebugApi, placeNear } from '../src/game.js'
import {
  TICK_MS, MAX_STEPS_PER_FRAME, B_HEARTH, B_LUMBER_LODGE, B_SAWMILL, B_STOREHOUSE, U_COURIER, U_WARDEN,
  I_WOOD, J_NONE, R_TREE, ITEM_SHIFT, F_PLAYER,
} from '../src/constants.js'
import { START } from '../src/content.js'
import { makeCtx, paintResource, run, aliveIds } from './helpers.mjs'

/** Small all-grass game (no mapgen) with no hamlet. */
function smallGame(extra = {}) {
  return createGame({ w: 64, h: 64, seed: 7, waves: false, start: false,
    context: { generate: false, maxUnits: 4096, maxBuildings: 1024 }, ...extra })
}

/** Grass ctx with the START grove painted, like mapgen would. */
function hamletCtx(seed = 1) {
  const ctx = makeCtx({ seed })
  const w = ctx.world
  const sx = w.tileX(w.start), sy = w.tileY(w.start)
  const g = START.grove
  paintResource(ctx, sx + g.dx, sy + g.dy, g.w, g.h, R_TREE)
  return ctx
}

test('advance: fixed 50 ms ticks, accumulator and alpha', () => {
  const g = smallGame()
  assert.equal(g.speed, 1)
  assert.equal(g.advance(TICK_MS), 0)
  assert.equal(g.ctx.tick, 1)
  const a = g.advance(TICK_MS * 0.25)
  assert.equal(g.ctx.tick, 1)
  assert.ok(Math.abs(a - 0.25) < 1e-9)
  g.advance(TICK_MS * 0.8) // 1.05 ticks accumulated -> one step
  assert.equal(g.ctx.tick, 2)
  assert.ok(g.alpha >= 0 && g.alpha < 1)
  // 60 fps for one simulated second = 20 ticks (+- one for the carried remainder)
  const t0 = g.ctx.tick
  for (let i = 0; i < 60; i++) g.advance(1000 / 60)
  assert.ok(Math.abs(g.ctx.tick - t0 - 20) <= 1, `ran ${g.ctx.tick - t0}`)
})

test('advance: speed multiplies, pause stops, huge dt is capped and dropped', () => {
  const g = smallGame()
  g.setSpeed(4)
  g.advance(TICK_MS)
  assert.equal(g.ctx.tick, 4)
  g.setSpeed(0)
  assert.equal(g.paused, true)
  const alpha = g.alpha
  assert.equal(g.advance(1000), alpha)
  assert.equal(g.ctx.tick, 4)
  g.togglePause()
  assert.equal(g.paused, false)
  assert.equal(g.speed, 4) // setSpeed(0) keeps the previous speed
  g.advance(10_000)
  assert.equal(g.ctx.tick, 4 + MAX_STEPS_PER_FRAME)
  assert.ok(g.acc < TICK_MS, 'excess time is dropped, not carried')
  assert.ok(g.droppedMs > 0)
  g.setSpeed(2)
  assert.equal(g.speed, 2)
  assert.equal(g.paused, false)
})

test('tickN runs while paused; won/lost auto-pause once', () => {
  const g = smallGame()
  g.setSpeed(0)
  g.tickN(5)
  assert.equal(g.ctx.tick, 5)
  g.setSpeed(1)
  g.ctx.won = true
  g.advance(TICK_MS)
  assert.equal(g.paused, true)
  g.paused = false // player chose "keep building"
  g.advance(TICK_MS)
  assert.equal(g.paused, false)
  assert.equal(g.ctx.tick, 6)
})

test('reset replaces ctx, keeps speed, runs onReset hooks', () => {
  const g = smallGame()
  g.setSpeed(2)
  g.tickN(3)
  const old = g.ctx
  let calls = 0
  g.onReset.push(() => calls++)
  g.reset(99)
  assert.notEqual(g.ctx, old)
  assert.equal(g.ctx.tick, 0)
  assert.equal(g.ctx.seed, 99)
  assert.equal(g.speed, 2)
  assert.equal(calls, 1)
})

test('setupStart builds the hamlet: hearth on start, lodge + sawmill, stock, couriers', () => {
  const ctx = hamletCtx()
  const w = ctx.world
  const hearth = setupStart(ctx)
  assert.ok(hearth >= 0)
  const B = ctx.buildings
  assert.equal(B.type[hearth], B_HEARTH)
  assert.equal(B.tx[hearth], w.tileX(w.start) + START.hearth.dx)
  assert.equal(B.ty[hearth], w.tileY(w.start) + START.hearth.dy)
  assert.equal(B.typeCount[B_LUMBER_LODGE], 1)
  assert.equal(B.typeCount[B_SAWMILL], 1)
  for (const e of START.stock) {
    assert.equal(ctx.stock[e.item], e.qty)
    assert.equal(B.inv[(hearth << ITEM_SHIFT) | e.item], e.qty)
  }
  assert.equal(ctx.units.typeCount[U_COURIER], START.couriers)
  for (const id of aliveIds(ctx.units)) {
    assert.equal(w.walkableXY(ctx.units.x[id] | 0, ctx.units.y[id] | 0), true, 'couriers spawn on walkable tiles')
    assert.equal(ctx.units.faction[id], F_PLAYER)
  }
})

test('setupStart: couriers start hauling wood to the Sawmill within the first second', () => {
  const ctx = hamletCtx()
  setupStart(ctx)
  const saw = ctx.buildings.typeList[B_SAWMILL][0]
  let hauling = 0
  for (let t = 0; t < 20 && hauling === 0; t++) {
    run(ctx, 1)
    for (const id of aliveIds(ctx.units)) {
      if (ctx.units.job[id] !== J_NONE && ctx.units.jobDst[id] === saw && ctx.units.jobItem[id] === I_WOOD) hauling++
    }
  }
  assert.ok(hauling > 0, 'a courier has a wood job to the sawmill')
  // and someone actually moves
  run(ctx, 20)
  let moved = 0
  for (const id of aliveIds(ctx.units)) if (ctx.units.vx[id] !== 0 || ctx.units.vy[id] !== 0) moved++
  assert.ok(moved > 0)
})

test('setupStart is deterministic: same seed -> identical positions after 300 ticks', () => {
  const a = hamletCtx(5), b = hamletCtx(5)
  setupStart(a); setupStart(b)
  run(a, 300); run(b, 300)
  assert.deepEqual(Array.from(a.units.x.subarray(0, a.units.hi)), Array.from(b.units.x.subarray(0, b.units.hi)))
  assert.deepEqual(Array.from(a.stock), Array.from(b.stock))
})

test('createGame on the real generated map opens with a hauling hamlet', () => {
  const g = createGame({ seed: 20261026 })
  const ctx = g.ctx
  assert.equal(ctx.buildings.typeCount[B_HEARTH], 1)
  assert.equal(ctx.buildings.typeCount[B_LUMBER_LODGE], 1)
  assert.equal(ctx.buildings.typeCount[B_SAWMILL], 1)
  assert.ok(g.hearth >= 0)
  g.tickN(20)
  assert.ok(ctx.log.jobCount > 0, 'jobs within one second')
})

test('placeNear finds the closest valid spot deterministically', () => {
  const ctx = makeCtx()
  const a = placeNear(ctx, B_STOREHOUSE, 10, 10, 4, { free: true })
  assert.ok(a >= 0)
  assert.deepEqual([ctx.buildings.tx[a], ctx.buildings.ty[a]], [10, 10])
  const b = placeNear(ctx, B_STOREHOUSE, 10, 10, 4, { free: true })
  assert.ok(b >= 0)
  assert.notDeepEqual([ctx.buildings.tx[b], ctx.buildings.ty[b]], [10, 10])
})

test('stress places the requested buildings and couriers and raises the cap', () => {
  const g = smallGame()
  setupStart(g.ctx) // no grove: lodge falls back / fails, fine
  const before = g.ctx.buildings.count
  const capExtra = g.ctx.courierCapExtra
  const r = stress(g, { buildings: 60, couriers: 300 })
  assert.equal(r.buildings, 60)
  assert.equal(r.couriers, 300)
  const ctx = g.ctx
  assert.equal(ctx.buildings.count, before + 60)
  assert.ok(ctx.units.typeCount[U_COURIER] <= ctx.courierCap)
  assert.ok(ctx.courierCapExtra > capExtra)
  // every door stays reachable from the hearth's door
  const hd = ctx.buildings.door[ctx.buildings.typeList[B_HEARTH][0]]
  for (const b of aliveIds(ctx.buildings)) assert.ok(ctx.path.sameRegion(hd, ctx.buildings.door[b]), `door of ${b}`)
  g.tickN(40) // the sim survives a crowd
  assert.ok(ctx.log.jobCount > 0)
})

test('installDebugApi works without window and exposes the contract', () => {
  const g = smallGame()
  setupStart(g.ctx)
  const api = installDebugApi(g, { loop: { fps: 60, frameMs: 2 } })
  assert.equal(api.game, g)
  assert.equal(api.ctx, g.ctx)
  assert.equal(api.pools.units, g.ctx.units)
  assert.equal(api.tick(3), 3)
  const s = api.stats()
  for (const k of ['tick', 'tickMs', 'frameMs', 'fps', 'units', 'buildings', 'couriers', 'idle', 'jobs', 'blight', 'pathQueue', 'pathHits', 'pathMisses']) {
    assert.equal(typeof s[k], 'number', k)
  }
  assert.equal(s.fps, 60)
  assert.equal(s.couriers, START.couriers)
  const id = api.spawn(U_WARDEN, 20.5, 20.5)
  assert.ok(id >= 0)
  const b = api.place(B_STOREHOUSE, 5, 5)
  assert.ok(b >= 0)
  const old = api.ctx
  api.reset(3)
  assert.notEqual(api.ctx, old, 'getters follow the replaced ctx')
  api.setSpeed(4)
  assert.equal(g.speed, 4)
})
