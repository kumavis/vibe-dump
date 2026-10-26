// Integration suite (integrator-owned): whole-game runs through the real module graph —
// mapgen + hamlet + every system — plus the placement enclosure guard.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { makeCtx } from './helpers.mjs'
import { createGame } from '../src/game.js'
import { canPlace, placeBuilding, addItems, recomputeStock } from '../src/buildings.js'
import { spawnUnit } from '../src/units.js'
import {
  P_OK, P_ENCLOSE, PLACE_REASONS, B_HEARTH, B_STOREHOUSE, B_SAWMILL, B_WARD_TOWER, B_LUMBER_LODGE,
  B_QUARRY, B_MINE, B_FORGE, B_SHRINE, B_GLOWCAP_GROVE, B_WORKSHOP, B_LOOM, B_MOONSTONE_DELVE,
  B_ENCHANTERY, R_TREE, R_STONE, R_ORE, R_GLOWCAP, R_MOONSTONE, I_WOOD, I_STONE, I_PLANK,
  U_COURIER, F_PLAYER, ITEM_STRIDE,
} from '../src/constants.js'

function stockMatches(ctx) {
  const before = Array.from(ctx.stock)
  const cap = ctx.storeCap, cc = ctx.courierCap
  recomputeStock(ctx)
  return before.every((v, i) => v === ctx.stock[i]) && cap === ctx.storeCap && cc === ctx.courierCap
}

function stateHash(ctx) {
  let h = 2166136261 >>> 0
  const mix = (v) => { h = Math.imul(h ^ (v | 0), 16777619) }
  const U = ctx.units, B = ctx.buildings
  for (let i = 0; i < U.hi; i++) if (U.alive[i]) { mix(i); mix(U.x[i] * 4096); mix(U.y[i] * 4096); mix(U.hp[i]); mix(U.job[i]) }
  for (let i = 0; i < B.hi; i++) if (B.alive[i]) { mix(i); mix(B.hp[i]); mix(B.progress[i]) }
  for (let i = 0; i < ITEM_STRIDE; i++) mix(ctx.stock[i])
  return h >>> 0
}

test('P_ENCLOSE: a placement that seals an existing door is refused; free placement is not checked', () => {
  const ctx = makeCtx()
  const f = { free: true }
  const st = placeBuilding(ctx, B_STOREHOUSE, 2, 2, f)
  addItems(ctx, st, I_WOOD, 100, false); addItems(ctx, st, I_STONE, 60, false); addItems(ctx, st, I_PLANK, 30, false)
  placeBuilding(ctx, B_SAWMILL, 30, 30, f) // door (31,32)
  assert.ok(placeBuilding(ctx, B_WARD_TOWER, 30, 32, f) >= 0) // left of the door
  assert.ok(placeBuilding(ctx, B_WARD_TOWER, 32, 32, f) >= 0) // right of the door
  // (31,33) is the only way out of the sawmill door now
  assert.equal(canPlace(ctx, B_WARD_TOWER, 31, 33), P_ENCLOSE)
  assert.equal(PLACE_REASONS[P_ENCLOSE], 'would wall in a door')
  assert.equal(canPlace(ctx, B_WARD_TOWER, 31, 33, f), P_OK)
  // ordinary open ground is unaffected, including packing buildings side by side
  assert.equal(canPlace(ctx, B_WARD_TOWER, 10, 40), P_OK)
  assert.equal(canPlace(ctx, B_SAWMILL, 34, 30), P_OK)
})

test('opening hamlet: couriers haul lodge -> sawmill and the Hearth gains planks', () => {
  const game = createGame({ seed: 20261026, waves: false })
  const ctx = game.ctx
  const B = ctx.buildings
  assert.equal(B.typeCount[B_HEARTH], 1)
  assert.equal(B.typeCount[B_LUMBER_LODGE], 1)
  assert.equal(B.typeCount[B_SAWMILL], 1)
  assert.equal(ctx.units.typeCount[U_COURIER], 8)
  const plank0 = ctx.stock[I_PLANK]
  game.tickN(600)
  assert.ok(ctx.log.stats.totalDelivered >= 20, 'deliveries ' + ctx.log.stats.totalDelivered)
  assert.ok(ctx.stock[I_PLANK] > plank0, 'plank stock grows')
  assert.equal(ctx.log.stats.totalLost, 0)
  assert.ok(stockMatches(ctx))
})

test('full game with waves is deterministic and keeps stock bookkeeping exact', () => {
  const run = () => {
    const game = createGame({ seed: 77 })
    const ctx = game.ctx
    ctx.waves.nextTick = 400 // bring the first raid forward
    game.tickN(2400)
    return { hash: stateHash(ctx), ok: stockMatches(ctx), waves: ctx.waves.number, ctx }
  }
  const a = run(), b = run()
  assert.ok(a.waves >= 1, 'a wave spawned')
  assert.ok(a.ok)
  assert.equal(a.hash, b.hash)
})

test('scripted economy climbs every tier and wins (whole production chain + shrine)', () => {
  const game = createGame({ seed: 20261026, waves: false })
  const ctx = game.ctx, B = ctx.buildings, w = ctx.world
  const h = B.typeList[B_HEARTH][0]
  const hx = B.tx[h] + 1, hy = B.ty[h] + 1
  const free = { free: true }
  const place = (type, tx, ty, maxR) => {
    for (let r = 0; r <= maxR; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue
      if (canPlace(ctx, type, tx + dx, ty + dy, free) !== P_OK) continue
      // the player-facing guard (tier lifted so the check is reached): never wall in a door
      const tier = ctx.tier; ctx.tier = 99
      const enclose = canPlace(ctx, type, tx + dx, ty + dy) === P_ENCLOSE
      ctx.tier = tier
      if (enclose) continue
      const id = placeBuilding(ctx, type, tx + dx, ty + dy, free)
      if (ctx.path.sameRegion(B.door[id], B.door[h])) return id
    }
    return -1
  }
  const nearestRes = (res) => {
    let best = -1, bd = Infinity
    for (let i = 0; i < w.size; i++) {
      if (w.res[i] !== res || w.resAmt[i] === 0) continue
      const d = (w.tileX(i) - hx) ** 2 + (w.tileY(i) - hy) ** 2
      if (d < bd) { bd = d; best = i }
    }
    return best
  }
  const onRes = (type, res, n) => { const t = nearestRes(res); for (let k = 0; k < n; k++) assert.ok(place(type, w.tileX(t) - 1, w.tileY(t) - 1, 10) >= 0, 'place ' + type) }
  const near = (type, n) => { for (let k = 0; k < n; k++) assert.ok(place(type, hx + 6, hy + 6, 30) >= 0, 'place ' + type) }
  onRes(B_LUMBER_LODGE, R_TREE, 3); onRes(B_QUARRY, R_STONE, 1); onRes(B_MINE, R_ORE, 4)
  near(B_SAWMILL, 2); near(B_FORGE, 3); near(B_STOREHOUSE, 3); near(B_SHRINE, 1)
  ctx.courierCapExtra += 30; ctx.courierCap += 30
  for (let k = 0; k < 30; k++) spawnUnit(ctx, U_COURIER, hx + 0.5, hy + 2.5, F_PLAYER)
  let t1 = false, t2 = false
  for (let t = 0; t < 20 * 60 * 15 && !ctx.won; t++) {
    game.tickN(1)
    if (ctx.tier >= 1 && !t1) {
      t1 = true
      onRes(B_GLOWCAP_GROVE, R_GLOWCAP, 3); near(B_WORKSHOP, 3); near(B_LOOM, 3); near(B_SAWMILL, 2)
      onRes(B_LUMBER_LODGE, R_TREE, 2); onRes(B_MINE, R_ORE, 2); near(B_FORGE, 2)
    }
    if (ctx.tier >= 2 && !t2) { t2 = true; onRes(B_MOONSTONE_DELVE, R_MOONSTONE, 2); near(B_ENCHANTERY, 2) }
  }
  assert.ok(ctx.won, `won (tier ${ctx.tier} at tick ${ctx.tick})`)
  assert.ok(stockMatches(ctx))
})
