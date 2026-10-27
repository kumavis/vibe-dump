// Reviewer repros, round 2 (correctness lens). Each test asserts the CORRECT behaviour, so a
// failing test here is a confirmed bug.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { makeCtx, run } from './helpers.mjs'
import {
  B_HEARTH, B_LUMBER_LODGE, B_SAWMILL, U_COURIER, I_WOOD, I_STONE, I_PLANK, R_TREE,
} from '../src/constants.js'
import { placeBuilding, addItems } from '../src/buildings.js'
import { spawnUnit } from '../src/units.js'
import { paintResource } from './helpers.mjs'

// Storage full of stone (quarries push their surplus there and nothing but construction
// consumes stone) while stored wood is under CRAFT_RESERVE: the pull pass skips wood for every
// crafter ("construction first"), but the push pass cannot refill storage because it is full.
// The Sawmill (and Forge) never get wood again even though the Lodge next door sits full.
test('review r2: crafters still pull from producers when storage is full and wood < reserve', () => {
  const ctx = makeCtx({ w: 64, h: 64 })
  const hearth = placeBuilding(ctx, B_HEARTH, 30, 30, { free: true })
  addItems(ctx, hearth, I_STONE, 485, false)
  addItems(ctx, hearth, I_WOOD, 15, false) // 500/500, wood under the 40 reserve
  paintResource(ctx, 40, 20, 3, 3, R_TREE)
  const lodge = placeBuilding(ctx, B_LUMBER_LODGE, 38, 22, { free: true })
  const mill = placeBuilding(ctx, B_SAWMILL, 34, 22, { free: true })
  assert.ok(lodge >= 0 && mill >= 0)
  addItems(ctx, lodge, I_WOOD, 20, false)
  for (let k = 0; k < 4; k++) spawnUnit(ctx, U_COURIER, 31.5 + k * 0.1, 33.5)
  run(ctx, 20 * 60) // 1 minute
  const planks = ctx.buildings.inv[(mill << 4) | I_PLANK]
  assert.ok(planks > 0, `sawmill made ${planks} planks in 1 min; lodge holds ${ctx.buildings.inv[(lodge << 4) | I_WOOD]} wood; stock wood=${ctx.stock[I_WOOD]}`)
})

// An enemy across water (or a cliff) inside sight: acquire() does not check reachability, the
// chase orderMove fails at once (PATH_NONE by region), the next tick sees M_FAILED with
// goal === chaseTile and clears the target, the tick after re-acquires the same enemy... The
// unit never gets back to the "no target: pursue the order" branch: an attack-move column
// halts on the riverbank for as long as the enemy stays in sight.
test('review r2: attack-move is not wedged by an unreachable enemy across water', async () => {
  const { T_WATER, U_WARDEN, U_CRAWLER, F_BLIGHT } = await import('../src/constants.js')
  const { O_NONE } = await import('../src/constants.js')
  const { commandAttackMove } = await import('../src/combat.js')
  const { fillTerrain } = await import('./helpers.mjs')
  const ctx = makeCtx({ w: 64, h: 64 })
  fillTerrain(ctx, 30, 0, 5, 64, T_WATER) // river x = 30..34, full height
  const w = spawnUnit(ctx, U_WARDEN, 28.5, 10.5)
  const c = spawnUnit(ctx, U_CRAWLER, 35.5, 30.5, F_BLIGHT) // 7 tiles from the warden's lane
  commandAttackMove(ctx, w, 28, 50)
  run(ctx, 20 * 60) // 1 min; the walk is ~40 tiles at 0.095 t/tick ≈ 21 s
  const U = ctx.units
  assert.ok(U.alive[c], 'crawler is out of reach and alive')
  assert.ok(Math.abs(U.y[w] - 50.5) < 1.5, `warden stuck at (${U.x[w].toFixed(1)}, ${U.y[w].toFixed(1)}), order ${U.order[w]}, mstate ${U.mstate[w]}`)
})

// orderMove to the tile a unit already stands on returns M_ARRIVED without walking to the tile
// centre. A melee attacker standing on its target's door tile but > U_RANGE from the footprint
// (separation in a crowd pushes crawlers there; 3 of 16 sat like this in a door crowd) re-issues
// orderMove(door) every tick, "arrives" instantly, never closes the last 0.05 tile, never hits.
test('review r2: a raider on the door tile but just out of melee range still attacks', async () => {
  const { B_STOREHOUSE, U_CRAWLER, F_BLIGHT } = await import('../src/constants.js')
  const { B_HP } = await import('../src/content.js')
  const { commandRaid } = await import('../src/combat.js')
  const ctx = makeCtx({ w: 64, h: 64 })
  const s = placeBuilding(ctx, B_STOREHOUSE, 30, 30, { free: true }) // footprint 30..31 x 30..31, door (31,32)
  const c = spawnUnit(ctx, U_CRAWLER, 31.5, 32.95, F_BLIGHT) // on the door tile, 0.95 from the rect (range 0.9)
  commandRaid(ctx, c, s)
  run(ctx, 20 * 10)
  assert.ok(ctx.buildings.hp[s] < B_HP[B_STOREHOUSE], `no damage after 10 s; crawler at (${ctx.units.x[c]}, ${ctx.units.y[c]}) mstate ${ctx.units.mstate[c]}`)
})

// A requester whose provider sits in a region with no idle courier (a lodge + sawmill the
// player built across a river: canPlace never checks reachability from the Hearth) makes
// findIdleCourier return -1, and pullPass treats that as "couriers ran out": it returns false,
// which also skips the push pass. With <= LOG_REQ_PER_TICK requesters that requester is visited
// every tick, so the push pass never runs again and no surplus ever reaches storage.
test('review r2: an unreachable requester/provider pair does not starve the push pass', async () => {
  const { T_WATER } = await import('../src/constants.js')
  const { fillTerrain } = await import('./helpers.mjs')
  const ctx = makeCtx({ w: 64, h: 64 })
  fillTerrain(ctx, 40, 0, 2, 64, T_WATER) // river x = 40..41
  const hearth = placeBuilding(ctx, B_HEARTH, 20, 30, { free: true })
  paintResource(ctx, 26, 26, 3, 3, R_TREE)
  const lodge = placeBuilding(ctx, B_LUMBER_LODGE, 29, 27, { free: true }) // home side, nobody consumes wood here
  addItems(ctx, lodge, I_WOOD, 20, false)
  // across the river
  paintResource(ctx, 50, 20, 3, 3, R_TREE)
  const lodge2 = placeBuilding(ctx, B_LUMBER_LODGE, 53, 21, { free: true })
  const mill2 = placeBuilding(ctx, B_SAWMILL, 48, 24, { free: true })
  assert.ok(hearth >= 0 && lodge >= 0 && lodge2 >= 0 && mill2 >= 0)
  addItems(ctx, lodge2, I_WOOD, 20, false)
  addItems(ctx, hearth, I_WOOD, 45, false) // above CRAFT_RESERVE, so the island sawmill does pull
  for (let k = 0; k < 4; k++) spawnUnit(ctx, U_COURIER, 21.5 + k * 0.1, 33.5)
  run(ctx, 20 * 30)
  assert.ok(ctx.stock[I_WOOD] > 45, `home lodge holds ${ctx.buildings.inv[(lodge << 4) | I_WOOD]} wood, Hearth got ${ctx.stock[I_WOOD]}; idle couriers ${ctx.log.idleCount}`)
})
