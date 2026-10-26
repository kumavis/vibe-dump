import { test } from 'node:test'
import assert from 'node:assert/strict'
import { makeCtx, fillTerrain, paintResource, aliveIds, unpack } from './helpers.mjs'
import { T_WATER, R_TREE, ITEM_STRIDE, B_SAWMILL, I_WOOD, I_PLANK } from '../src/constants.js'
import { BUILDINGS, B_SLOT_CAP, B_OUT_ITEM, UNITS, TIERS, START } from '../src/content.js'
import { RNG } from '../src/rng.js'

test('makeCtx builds a complete, empty context', () => {
  const ctx = makeCtx()
  assert.equal(ctx.tick, 0)
  assert.equal(ctx.world.w, 64)
  assert.equal(ctx.world.chunkCount, 4)
  assert.equal(ctx.world.pass.every((p) => p === 1), true)
  assert.equal(ctx.units.count, 0)
  assert.equal(ctx.buildings.count, 0)
  assert.equal(ctx.stock.length, ITEM_STRIDE)
  assert.ok(ctx.log && ctx.combat && ctx.waves && ctx.fx && ctx.events && ctx.unitGrid && ctx.path)
  assert.equal(ctx.waves.enabled, false)
  assert.deepEqual(unpack(ctx, ctx.world.start), [32, 32])
})

test('terrain and resource painting go through World and bump versions', () => {
  const ctx = makeCtx()
  const nav0 = ctx.world.navVersion
  fillTerrain(ctx, 0, 0, 2, 1, T_WATER)
  assert.equal(ctx.world.pass[0], 0)
  assert.ok(ctx.world.navVersion > nav0)
  const v0 = ctx.world.chunkVersion[0]
  paintResource(ctx, 4, 4, 2, 2, R_TREE)
  assert.equal(ctx.world.res[ctx.world.idx(5, 5)], R_TREE)
  assert.ok(ctx.world.chunkVersion[0] > v0)
})

test('pools allocate deterministic ids and reuse with a new generation', () => {
  const ctx = makeCtx()
  const a = ctx.units.alloc(1, 0)
  const b = ctx.units.alloc(1, 0)
  assert.deepEqual([a, b], [0, 1])
  const g = ctx.units.gen[a]
  ctx.units.free(a)
  assert.equal(ctx.units.isAlive(a, g), false)
  assert.equal(ctx.units.alloc(2, 0), a)
  assert.equal(ctx.units.gen[a], g + 1)
  assert.deepEqual(aliveIds(ctx.units), [0, 1])
})

test('content tables are consistent', () => {
  assert.equal(B_OUT_ITEM[B_SAWMILL], I_PLANK)
  assert.ok(B_SLOT_CAP[(B_SAWMILL << 4) | I_WOOD] >= 10)
  for (let t = 1; t < BUILDINGS.length; t++) {
    const d = BUILDINGS[t]
    const [dx, dy] = d.door
    const inside = dx >= 0 && dy >= 0 && dx < d.w && dy < d.h
    assert.equal(inside, false, `${d.key} door must be outside its footprint`)
    const adjacent = (dx >= -1 && dx <= d.w && dy >= -1 && dy <= d.h)
    assert.ok(adjacent, `${d.key} door must touch its footprint`)
  }
  assert.equal(UNITS[1].cargo, 5)
  assert.equal(TIERS[TIERS.length - 1].offering, null)
  assert.ok(START.buildings.length >= 2)
})

test('RNG is deterministic', () => {
  const a = new RNG(7), b = new RNG(7)
  for (let i = 0; i < 100; i++) assert.equal(a.nextU32(), b.nextU32())
})
