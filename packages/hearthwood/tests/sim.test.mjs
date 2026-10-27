// Sim suite: entity pools, buildings/production, inventories, logistics scheduler and
// courier jobs. OWNER: sim implementer.
//
// The suite drives the real stepSim over the real module graph.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fillTerrain, paintResource } from './helpers.mjs'
import {
  I_WOOD, I_STONE, I_PLANK, I_INGOT, ITEM_SHIFT, ITEM_COUNT,
  B_HEARTH, B_STOREHOUSE, B_LUMBER_LODGE, B_SAWMILL, B_SHRINE, B_SPRITE_DEN, B_GLOWCAP_GROVE, B_QUARRY,
  BF_STORAGE, BF_REQUESTER, U_COURIER, T_WATER, R_TREE, R_STONE,
  J_NONE, J_TO_PICKUP, J_PICKING, J_TO_DROPOFF, J_DROPPING,
  BS_OUTPUT_FULL, BS_STARVED, BS_OK,
  P_OK, P_OOB, P_BLOCKED, P_DOOR, P_NO_RESOURCE, P_COST, P_TIER, P_UNIQUE, P_NOT_BUILDABLE,
  LOG_REQ_PER_TICK, LOG_PUSH_PER_TICK, EV_TIER_UP, EV_COURIER_SPAWNED,
} from '../src/constants.js'
import { BUILDINGS, B_FLAGS, B_SLOT_CAP, B_IN_QTY, B_STORAGE } from '../src/content.js'

import { stepSim, createContext } from '../src/context.js'
import {
  placeBuilding, canPlace, demolishBuilding, destroyBuilding, addItems, takeItems, availableOut, freeSpaceIn,
  setPaused, recomputeStock, buildingAtTile, nearestBuilding, payCost, canAfford, tickBuildings,
} from '../src/buildings.js'
import { tickLogistics } from '../src/logistics.js'
import { spawnUnit, despawnUnit, tickUnits } from '../src/units.js'

// ------------------------------------------------------------------ helpers
function mk(opts = {}) {
  return createContext({ w: 64, h: 64, seed: 1, generate: false, waves: false, maxUnits: 4096, maxBuildings: 1024, ...opts })
}
function run(ctx, n) { for (let i = 0; i < n; i++) stepSim(ctx) }
function runUntil(ctx, pred, max = 3000) {
  for (let i = 0; i < max; i++) { if (pred()) return i; stepSim(ctx) }
  return pred() ? max : -1
}
const inv = (ctx, b, item) => ctx.buildings.inv[(b << ITEM_SHIFT) | item]
const resIn = (ctx, b, item) => ctx.buildings.resIn[(b << ITEM_SHIFT) | item]
const resOut = (ctx, b, item) => ctx.buildings.resOut[(b << ITEM_SHIFT) | item]
function couriers(ctx, n, x, y) {
  const ids = []
  for (let i = 0; i < n; i++) ids.push(spawnUnit(ctx, U_COURIER, x + (i % 5) * 0.3, y + ((i / 5) | 0) * 0.3))
  return ids
}
/** Lodge on a 6x6 tree grove: grove at (gx,gy), lodge immediately right of it. */
function lodgeOnGrove(ctx, gx, gy) {
  paintResource(ctx, gx, gy, 6, 6, R_TREE)
  const id = placeBuilding(ctx, B_LUMBER_LODGE, gx + 6, gy + 2, { free: true })
  assert.ok(id >= 0, 'lodge placed')
  return id
}

/**
 * Global invariants: reservations never exceed stock/space, every reservation is owned
 * by exactly one courier job, counts match.
 */
function checkInvariants(ctx) {
  const pool = ctx.buildings, units = ctx.units
  const ownOut = new Map(), ownIn = new Map()
  let jobs = 0
  for (let u = 0; u < units.hi; u++) {
    if (!units.alive[u] || units.type[u] !== U_COURIER || units.job[u] === J_NONE) continue
    jobs++
    const j = units.job[u], item = units.jobItem[u], q = units.jobQty[u]
    assert.ok(q > 0 && q <= 5, 'job qty within courier cap')
    if (j === J_TO_PICKUP || j === J_PICKING) {
      if (pool.isAlive(units.jobSrc[u], units.jobSrcGen[u])) {
        const k = (units.jobSrc[u] << ITEM_SHIFT) | item
        ownOut.set(k, (ownOut.get(k) || 0) + q)
      }
    } else assert.equal(units.cargoQty[u], q, 'carrying exactly the reserved qty')
    if (pool.isAlive(units.jobDst[u], units.jobDstGen[u])) {
      const k = (units.jobDst[u] << ITEM_SHIFT) | item
      ownIn.set(k, (ownIn.get(k) || 0) + q)
    }
  }
  assert.equal(ctx.log.jobCount, jobs, 'jobCount matches couriers with jobs')
  for (let b = 0; b < pool.hi; b++) {
    if (!pool.alive[b]) continue
    const t = pool.type[b]
    let tot = 0, totIn = 0
    for (let i = 1; i < ITEM_COUNT; i++) {
      const k = (b << ITEM_SHIFT) | i
      assert.ok(pool.inv[k] >= 0 && pool.resIn[k] >= 0 && pool.resOut[k] >= 0, 'non-negative')
      assert.ok(pool.resOut[k] <= pool.inv[k], `resOut <= inv (b${b} item ${i})`)
      assert.equal(pool.resOut[k], ownOut.get(k) || 0, `resOut owned by jobs (b${b} item ${i})`)
      assert.equal(pool.resIn[k], ownIn.get(k) || 0, `resIn owned by jobs (b${b} item ${i})`)
      if (!(B_FLAGS[t] & BF_STORAGE) && B_IN_QTY[(t << ITEM_SHIFT) | i] > 0) {
        assert.ok(pool.inv[k] + pool.resIn[k] <= B_SLOT_CAP[(t << ITEM_SHIFT) | i], 'input never oversubscribed')
      }
      tot += pool.inv[k]; totIn += pool.resIn[k]
    }
    assert.equal(pool.invTotal[b], tot)
    assert.equal(pool.resInTotal[b], totIn)
    if (B_FLAGS[t] & BF_STORAGE) assert.ok(tot + totIn <= B_STORAGE[t], 'storage never oversubscribed')
  }
  assert.equal(recomputeStock(ctx), true, 'incremental stock/caps match recompute')
}

// ------------------------------------------------------------------ pools

test('pools: alloc lowest id, free bumps gen, type lists and chunk lists stay consistent', () => {
  const ctx = mk()
  const p = ctx.buildings
  const a = p.alloc(B_SAWMILL), b = p.alloc(B_SAWMILL), c = p.alloc(B_LUMBER_LODGE)
  assert.deepEqual([a, b, c], [0, 1, 2])
  assert.equal(p.typeCount[B_SAWMILL], 2)
  p.linkChunk(a, 0); p.linkChunk(b, 0); p.linkChunk(c, 1)
  const g = p.gen[a]
  p.free(a)
  assert.equal(p.isAlive(a, g), false)
  assert.equal(p.typeCount[B_SAWMILL], 1)
  assert.equal(p.typeList[B_SAWMILL][0], b)
  assert.equal(p.chunkHead[0], b)
  assert.equal(p.alloc(B_HEARTH), a)
  assert.equal(p.gen[a], (g + 1) & 0xffff)
  assert.equal(p.count, 3)
})

// ------------------------------------------------------------------ placement

test('canPlace reports reasons in contract order; place/demolish pay and refund', () => {
  const ctx = mk()
  assert.equal(canPlace(ctx, B_HEARTH, 30, 30), P_NOT_BUILDABLE)
  const h = placeBuilding(ctx, B_HEARTH, 30, 30, { free: true })
  assert.ok(h >= 0)
  assert.equal(ctx.courierCap, 12)
  assert.equal(ctx.storeCap, 500)
  assert.equal(canPlace(ctx, B_HEARTH, 10, 10, { free: true }), P_UNIQUE)
  assert.equal(canPlace(ctx, B_GLOWCAP_GROVE, 10, 10), P_TIER)
  assert.equal(canPlace(ctx, B_SAWMILL, 63, 10, { free: true }), P_OOB)
  assert.equal(canPlace(ctx, B_SAWMILL, 31, 31, { free: true }), P_BLOCKED)
  // footprint on the hearth's door tile is blocked
  assert.equal(canPlace(ctx, B_SAWMILL, 31, 33, { free: true }), P_BLOCKED)
  fillTerrain(ctx, 11, 12, 1, 1, T_WATER)
  assert.equal(canPlace(ctx, B_SAWMILL, 10, 10, { free: true }), P_DOOR)
  assert.equal(canPlace(ctx, B_SAWMILL, 10, 62, { free: true }), P_DOOR) // door off the map
  assert.equal(canPlace(ctx, B_LUMBER_LODGE, 20, 20, { free: true }), P_NO_RESOURCE)
  assert.equal(canPlace(ctx, B_SAWMILL, 20, 20), P_COST)
  assert.equal(canPlace(ctx, B_SAWMILL, 20, 20, { free: true }), P_OK)

  addItems(ctx, h, I_WOOD, 100, false)
  addItems(ctx, h, I_STONE, 50, false)
  assert.equal(ctx.stock[I_WOOD], 100)
  const s = placeBuilding(ctx, B_SAWMILL, 20, 20) // costs 15 wood + 5 stone
  assert.ok(s >= 0)
  assert.equal(ctx.stock[I_WOOD], 85)
  assert.equal(ctx.stock[I_STONE], 45)
  assert.equal(buildingAtTile(ctx, 21, 21), s)
  assert.equal(ctx.world.pass[ctx.world.idx(20, 20)], 0)
  assert.equal(ctx.buildings.door[s], ctx.world.idx(21, 22))
  assert.equal(nearestBuilding(ctx, 19, 19, 4, 0), s)
  assert.equal(nearestBuilding(ctx, 19, 19, 4, BF_STORAGE), h)

  assert.equal(demolishBuilding(ctx, h), false, 'hearth cannot be demolished')
  assert.equal(demolishBuilding(ctx, s), true)
  assert.equal(ctx.stock[I_WOOD], 85 + 7)
  assert.equal(ctx.stock[I_STONE], 45 + 2)
  assert.equal(buildingAtTile(ctx, 21, 21), -1)
  assert.equal(ctx.world.pass[ctx.world.idx(20, 20)], 1)
  assert.equal(recomputeStock(ctx), true)
})

test('payCost is all-or-nothing, Hearth first; destroyed storage loses its contents', () => {
  const ctx = mk()
  const h = placeBuilding(ctx, B_HEARTH, 30, 30, { free: true })
  const s = placeBuilding(ctx, B_STOREHOUSE, 20, 20, { free: true })
  addItems(ctx, h, I_WOOD, 10, false)
  addItems(ctx, s, I_WOOD, 30, false)
  addItems(ctx, s, I_STONE, 3, false)
  const cost = [{ item: I_WOOD, qty: 20 }, { item: I_STONE, qty: 5 }]
  assert.equal(canAfford(ctx, cost), false)
  assert.equal(payCost(ctx, cost), false)
  assert.equal(ctx.stock[I_WOOD], 40)
  assert.equal(payCost(ctx, [{ item: I_WOOD, qty: 20 }]), true)
  assert.equal(inv(ctx, h, I_WOOD), 0, 'hearth drained first')
  assert.equal(inv(ctx, s, I_WOOD), 20)
  assert.equal(ctx.storeCap, 700)
  destroyBuilding(ctx, s, 0, true)
  assert.equal(ctx.stock[I_WOOD], 0)
  assert.equal(ctx.stock[I_STONE], 0)
  assert.equal(ctx.storeCap, 500)
  assert.equal(recomputeStock(ctx), true)
})

// ------------------------------------------------------------------ production

test('a lumber lodge fells trees into wood and stops at the output cap without over-harvesting', () => {
  const ctx = mk()
  const l = lodgeOnGrove(ctx, 10, 10)
  const world = ctx.world
  const treeTotal = () => { let t = 0; for (let i = 0; i < world.size; i++) if (world.res[i] === R_TREE) t += world.resAmt[i]; return t }
  const t0 = treeTotal()
  run(ctx, 50)
  assert.equal(inv(ctx, l, I_WOOD), 1, 'one wood per 50 ticks')
  run(ctx, 100)
  assert.equal(inv(ctx, l, I_WOOD), 3)
  assert.equal(t0 - treeTotal(), 3, 'one tree unit per wood')
  run(ctx, 50 * 25)
  assert.equal(inv(ctx, l, I_WOOD), 20)
  assert.equal(ctx.buildings.status[l], BS_OUTPUT_FULL)
  assert.equal(t0 - treeTotal(), 20, 'no harvesting while the output is full')
  assert.ok(ctx.buildings.workTile[l] >= 0)
})

test('the sawmill consumes wood and produces planks', () => {
  const ctx = mk()
  const s = placeBuilding(ctx, B_SAWMILL, 20, 20, { free: true })
  assert.equal(freeSpaceIn(ctx, s, I_WOOD), 10)
  assert.equal(freeSpaceIn(ctx, s, I_PLANK), 0, 'outputs are not destinations')
  assert.equal(addItems(ctx, s, I_WOOD, 12, false), 10, 'input clamps to its slot cap')
  run(ctx, 1)
  assert.equal(inv(ctx, s, I_WOOD), 9)
  run(ctx, 39)
  assert.equal(inv(ctx, s, I_PLANK), 1)
  run(ctx, 400)
  assert.equal(inv(ctx, s, I_PLANK), 10)
  assert.equal(inv(ctx, s, I_WOOD), 0)
  assert.equal(ctx.buildings.status[s], BS_STARVED)
  assert.equal(availableOut(ctx, s, I_PLANK), 10)
  assert.equal(takeItems(ctx, s, I_PLANK, 4, false), 4)
  setPaused(ctx, s, true)
  addItems(ctx, s, I_WOOD, 5, false)
  run(ctx, 100)
  assert.equal(inv(ctx, s, I_WOOD), 5, 'paused building does not work')
})

// ------------------------------------------------------------------ courier jobs

test('a courier moves 5 wood lodge -> sawmill with exact reservations at each state', () => {
  const ctx = mk()
  const l = lodgeOnGrove(ctx, 10, 10) // lodge at (16,12), door (17,14)
  setPaused(ctx, l, true)
  addItems(ctx, l, I_WOOD, 5, false)
  const s = placeBuilding(ctx, B_SAWMILL, 26, 12, { free: true }) // door (27,14)
  const [u] = couriers(ctx, 1, 20.5, 18.5)
  const U = ctx.units

  run(ctx, 1)
  assert.equal(U.job[u], J_TO_PICKUP)
  assert.equal(U.jobSrc[u], l)
  assert.equal(U.jobDst[u], s)
  assert.equal(U.jobItem[u], I_WOOD)
  assert.equal(U.jobQty[u], 5)
  assert.equal(resOut(ctx, l, I_WOOD), 5)
  assert.equal(availableOut(ctx, l, I_WOOD), 0)
  assert.equal(resIn(ctx, s, I_WOOD), 5)
  assert.equal(ctx.buildings.resInTotal[s], 5)
  assert.equal(ctx.log.jobCount, 1)
  assert.equal(ctx.log.idleCount, 0)
  checkInvariants(ctx)

  assert.ok(runUntil(ctx, () => U.job[u] === J_PICKING, 1000) >= 0, 'reaches the lodge')
  assert.equal(inv(ctx, l, I_WOOD), 5)
  assert.equal(resOut(ctx, l, I_WOOD), 5)
  assert.equal(U.cargoQty[u], 0)
  const door = ctx.buildings.door[l]
  assert.equal(Math.floor(U.x[u]), door & ctx.world.mask)
  assert.equal(Math.floor(U.y[u]), door >> ctx.world.shift)

  assert.ok(runUntil(ctx, () => U.job[u] === J_TO_DROPOFF, 100) >= 0)
  assert.equal(inv(ctx, l, I_WOOD), 0)
  assert.equal(resOut(ctx, l, I_WOOD), 0)
  assert.equal(U.cargoItem[u], I_WOOD)
  assert.equal(U.cargoQty[u], 5)
  assert.equal(resIn(ctx, s, I_WOOD), 5)
  checkInvariants(ctx)

  assert.ok(runUntil(ctx, () => U.job[u] === J_DROPPING, 1000) >= 0, 'reaches the sawmill')
  assert.equal(resIn(ctx, s, I_WOOD), 5)
  assert.equal(inv(ctx, s, I_WOOD), 0)

  assert.ok(runUntil(ctx, () => U.job[u] === J_NONE, 100) >= 0)
  assert.equal(inv(ctx, s, I_WOOD), 5)
  assert.equal(resIn(ctx, s, I_WOOD), 0)
  assert.equal(ctx.buildings.resInTotal[s], 0)
  assert.equal(U.cargoQty[u], 0)
  assert.equal(ctx.log.jobCount, 0)
  assert.equal(ctx.log.stats.totalDelivered, 5)
  checkInvariants(ctx)

  run(ctx, 45)
  assert.ok(inv(ctx, s, I_PLANK) >= 1, 'sawmill turned delivered wood into planks')
})

test('abortJob (courier death) releases both reservations; a dead requester reroutes cargo to storage', () => {
  const ctx = mk()
  const l = lodgeOnGrove(ctx, 10, 10)
  setPaused(ctx, l, true)
  addItems(ctx, l, I_WOOD, 10, false)
  const s = placeBuilding(ctx, B_SAWMILL, 26, 12, { free: true })
  const [u] = couriers(ctx, 1, 20.5, 18.5)
  run(ctx, 1)
  assert.equal(ctx.units.job[u], J_TO_PICKUP)
  despawnUnit(ctx, u, true)
  assert.equal(resOut(ctx, l, I_WOOD), 0)
  assert.equal(resIn(ctx, s, I_WOOD), 0)
  assert.equal(ctx.log.jobCount, 0)
  checkInvariants(ctx)

  const st = placeBuilding(ctx, B_STOREHOUSE, 20, 24, { free: true })
  addItems(ctx, st, I_WOOD, 40, false) // construction reserve met: crafters may pull wood again
  const [v] = couriers(ctx, 1, 20.5, 18.5)
  assert.ok(runUntil(ctx, () => ctx.units.job[v] === J_TO_DROPOFF && ctx.units.jobDst[v] === s, 1000) >= 0)
  assert.equal(demolishBuilding(ctx, s), true)
  run(ctx, 1)
  assert.equal(ctx.units.job[v], J_TO_DROPOFF, 'rerouted, still carrying')
  assert.equal(ctx.units.jobDst[v], st)
  assert.equal(resIn(ctx, st, I_WOOD), 5)
  checkInvariants(ctx)
  assert.ok(runUntil(ctx, () => ctx.units.job[v] === J_NONE, 1000) >= 0)
  // cargo + demolition refund, then the lodge's last load (idle couriers push any full load)
  assert.equal(inv(ctx, st, I_WOOD), 40 + 5 + 7 + 5, 'cargo + demolition refund landed in storage')
  checkInvariants(ctx)
})

// ------------------------------------------------------------------ storage priority

test('storage is a low-priority sink and a last-resort provider', () => {
  // (a) a producer holding less than a courier load is never drained into storage
  // (couriers plentiful: the push threshold drops from half the output cap to one load)
  const ctx = mk()
  const l = lodgeOnGrove(ctx, 10, 10)
  setPaused(ctx, l, true)
  addItems(ctx, l, I_WOOD, 4, false)
  const st = placeBuilding(ctx, B_STOREHOUSE, 20, 24, { free: true })
  couriers(ctx, 3, 20.5, 18.5)
  run(ctx, 200)
  assert.equal(inv(ctx, st, I_WOOD), 0)
  assert.equal(ctx.log.stats.totalAssigned, 0)
  // (b) at a full load it is pushed, one courier load at a time
  addItems(ctx, l, I_WOOD, 1, false)
  run(ctx, 1)
  assert.equal(ctx.log.stats.assigned, 1)
  assert.equal(resOut(ctx, l, I_WOOD), 5)
  assert.ok(runUntil(ctx, () => inv(ctx, st, I_WOOD) === 5, 2000) >= 0)
  run(ctx, 300)
  assert.equal(inv(ctx, st, I_WOOD), 5, 'stops pushing once below a load')
  assert.equal(ctx.stock[I_WOOD], 5)
  checkInvariants(ctx)

  // (c) a requester prefers a producer over a nearer storage holding the item
  const ctx2 = mk()
  const l2 = lodgeOnGrove(ctx2, 4, 10) // lodge (10,12), door (11,14)
  setPaused(ctx2, l2, true)
  addItems(ctx2, l2, I_WOOD, 5, false)
  const saw = placeBuilding(ctx2, B_SAWMILL, 40, 20, { free: true })
  const st2 = placeBuilding(ctx2, B_STOREHOUSE, 44, 20, { free: true })
  addItems(ctx2, st2, I_WOOD, 50, false)
  const [u2] = couriers(ctx2, 1, 42.5, 24.5)
  run(ctx2, 1)
  assert.equal(ctx2.units.jobSrc[u2], l2, 'producer first even though storage is closer')
  assert.equal(ctx2.units.jobDst[u2], saw)

  // (d) with no producer, storage supplies; reserving takes it out of the global stock
  const ctx3 = mk()
  const saw3 = placeBuilding(ctx3, B_SAWMILL, 40, 20, { free: true })
  const st3 = placeBuilding(ctx3, B_STOREHOUSE, 30, 30, { free: true })
  addItems(ctx3, st3, I_WOOD, 50, false)
  const [u3] = couriers(ctx3, 1, 35.5, 35.5)
  run(ctx3, 1)
  assert.equal(ctx3.units.jobSrc[u3], st3)
  assert.equal(ctx3.stock[I_WOOD], 45, 'reserved storage stock is not spendable')
  checkInvariants(ctx3)
  assert.ok(runUntil(ctx3, () => inv(ctx3, saw3, I_WOOD) + inv(ctx3, saw3, I_PLANK) >= 5, 2000) >= 0)
  checkInvariants(ctx3)
})

// ------------------------------------------------------------------ contention + scale

test('50 couriers on one provider never oversubscribe (resOut <= inv, inputs <= cap, jobs own every reservation)', () => {
  const ctx = mk()
  const l = lodgeOnGrove(ctx, 6, 6) // lodge (12,8)
  addItems(ctx, l, I_WOOD, 20, false)
  const saws = []
  for (let k = 0; k < 6; k++) saws.push(placeBuilding(ctx, B_SAWMILL, 18 + k * 4, 20, { free: true }))
  assert.ok(saws.every((s) => s >= 0))
  const st = placeBuilding(ctx, B_STOREHOUSE, 30, 40, { free: true })
  couriers(ctx, 50, 24.5, 30.5)
  let maxJobs = 0
  for (let t = 0; t < 2500; t++) {
    stepSim(ctx)
    maxJobs = Math.max(maxJobs, ctx.log.jobCount)
    if (t % 5 === 0 || t < 50) checkInvariants(ctx)
    assert.ok(resOut(ctx, l, I_WOOD) <= inv(ctx, l, I_WOOD))
  }
  checkInvariants(ctx)
  let planks = 0
  for (const s of saws) planks += inv(ctx, s, I_PLANK)
  assert.ok(planks > 0, 'planks were produced')
  assert.ok(maxJobs >= 4, 'several couriers were busy at once')
  assert.ok(st >= 0)
})

test('scheduler cost per tick is bounded (K visits) at scale', () => {
  const ctx = mk({ w: 256, h: 256, maxUnits: 8192, maxBuildings: 4096 })
  const h = placeBuilding(ctx, B_HEARTH, 92, 72, { free: true })
  addItems(ctx, h, I_WOOD, 400, false)
  let saws = 0
  for (let gy = 0; gy < 15; gy++) for (let gx = 0; gx < 20; gx++) {
    if (placeBuilding(ctx, B_SAWMILL, 8 + gx * 4, 8 + gy * 4, { free: true }) >= 0) saws++
  }
  let lodges = 0
  paintResource(ctx, 100, 10, 60, 4, R_TREE)
  for (let k = 0; k < 20; k++) if (placeBuilding(ctx, B_LUMBER_LODGE, 100 + k * 3, 14, { free: true }) >= 0) lodges++
  for (let k = 0; k < 8; k++) placeBuilding(ctx, B_STOREHOUSE, 100 + k * 4, 40, { free: true })
  assert.equal(saws, 300)
  assert.ok(lodges >= 15)
  ctx.courierCapExtra += 600
  ctx.courierCap += 600
  for (let i = 0; i < 600; i++) spawnUnit(ctx, U_COURIER, 60 + (i % 40) * 0.7, 80 + ((i / 40) | 0) * 0.7)
  let maxPull = 0, maxPush = 0, maxAssigned = 0, maxScans = 0
  let ms = 0
  for (let t = 0; t < 1200; t++) {
    stepSim(ctx)
    const s = ctx.log.stats
    maxPull = Math.max(maxPull, s.pullVisits)
    maxPush = Math.max(maxPush, s.pushVisits)
    maxAssigned = Math.max(maxAssigned, s.assigned)
    maxScans = Math.max(maxScans, s.providerScans)
    assert.ok(s.pullVisits <= LOG_REQ_PER_TICK)
    assert.ok(s.pushVisits <= LOG_PUSH_PER_TICK)
    assert.ok(s.assigned <= s.pullVisits * 3 + s.pushVisits)
  }
  // time the logistics system alone on the warmed-up state
  const t0 = performance.now()
  for (let t = 0; t < 50; t++) tickLogistics(ctx)
  ms = (performance.now() - t0) / 50
  checkInvariants(ctx)
  assert.ok(maxAssigned > 0, 'jobs were assigned')
  console.log('# delivered', ctx.log.stats.totalDelivered, 'assignedTotal', ctx.log.stats.totalAssigned, 'aborted', ctx.log.stats.totalAborted, 'pathq', ctx.path.pending(), JSON.stringify(ctx.path.stats))
  assert.ok(ctx.log.stats.totalDelivered > 0, 'goods were delivered')
  assert.ok(ms < 5, `tickLogistics ${ms.toFixed(3)} ms/tick`)
  console.log(`# scheduler: maxPull=${maxPull} maxPush=${maxPush} maxAssigned=${maxAssigned} maxScans=${maxScans} logistics=${ms.toFixed(3)}ms/tick jobs=${ctx.log.jobCount} idle=${ctx.log.idleCount}`)
})

// ------------------------------------------------------------------ dens + shrine

test('a sprite den spawns couriers for planks up to the courier cap', () => {
  const ctx = mk()
  const h = placeBuilding(ctx, B_HEARTH, 30, 30, { free: true })
  addItems(ctx, h, I_PLANK, 9, false)
  const d = placeBuilding(ctx, B_SPRITE_DEN, 20, 30, { free: true })
  assert.equal(ctx.courierCap, 22)
  const w0 = ctx.events.written
  run(ctx, 120)
  assert.equal(ctx.units.typeCount[U_COURIER], 1)
  assert.equal(ctx.stock[I_PLANK], 6)
  let seen = false
  for (let n = w0; n < ctx.events.written; n++) if (ctx.events.type[n & ctx.events.mask] === EV_COURIER_SPAWNED) seen = true
  assert.ok(seen)
  run(ctx, 600)
  // 3 bought with planks; the Hearth's rescue may coax out a 4th (RESCUE_MIN) once the Den is broke
  const nc = ctx.units.typeCount[U_COURIER]
  assert.ok(nc === 3 || nc === 4, `stops when planks run out (${nc})`)
  assert.equal(ctx.stock[I_PLANK], 0)
  assert.equal(destroyBuilding(ctx, d), undefined)
  assert.equal(ctx.courierCap, 12)
  assert.equal(recomputeStock(ctx), true)
})

test('the shrine pulls its offering from storage and raises the tier', () => {
  const ctx = mk()
  const h = placeBuilding(ctx, B_HEARTH, 30, 30, { free: true })
  addItems(ctx, h, I_PLANK, 25, false)
  addItems(ctx, h, I_INGOT, 10, false)
  const sh = placeBuilding(ctx, B_SHRINE, 20, 20, { free: true })
  assert.ok(B_FLAGS[B_SHRINE] & BF_REQUESTER)
  assert.equal(freeSpaceIn(ctx, sh, I_PLANK), 20)
  assert.equal(freeSpaceIn(ctx, sh, I_WOOD), 0)
  couriers(ctx, 4, 31.5, 34.5)
  const w0 = ctx.events.written
  assert.ok(runUntil(ctx, () => ctx.tier === 1, 4000) >= 0, 'tier reached')
  let ev = -1
  for (let n = w0; n < ctx.events.written; n++) if (ctx.events.type[n & ctx.events.mask] === EV_TIER_UP) ev = ctx.events.a[n & ctx.events.mask]
  assert.equal(ev, 1)
  assert.equal(ctx.stock[I_PLANK], 5)
  assert.equal(ctx.stock[I_INGOT], 0)
  assert.equal(inv(ctx, sh, I_PLANK), 0)
  assert.equal(canPlace(ctx, B_GLOWCAP_GROVE, 4, 4, { free: false }) === P_TIER, false)
  run(ctx, 50)
  checkInvariants(ctx)
})

test('deterministic: same setup, same seed -> identical logistics outcome', () => {
  const sim = () => {
    const ctx = mk({ seed: 7 })
    const l = lodgeOnGrove(ctx, 6, 6)
    addItems(ctx, l, I_WOOD, 20, false)
    for (let k = 0; k < 4; k++) placeBuilding(ctx, B_SAWMILL, 18 + k * 4, 20, { free: true })
    const st = placeBuilding(ctx, B_STOREHOUSE, 30, 40, { free: true })
    paintResource(ctx, 40, 4, 4, 4, R_STONE)
    placeBuilding(ctx, B_QUARRY, 44, 4, { free: true })
    couriers(ctx, 20, 24.5, 30.5)
    run(ctx, 1500)
    const u = ctx.units
    let hash = 0
    for (let i = 0; i < u.hi; i++) hash = (Math.imul(hash, 31) + (u.x[i] * 1000 | 0) + u.job[i] * 7 + u.cargoQty[i]) | 0
    return [hash, ctx.stock[I_STONE], inv(ctx, st, I_WOOD), ctx.log.stats.totalDelivered]
  }
  assert.deepEqual(sim(), sim())
})

test('per-tick cost at target scale (5k couriers, ~2k buildings) stays within budget', () => {
  const ctx = mk({ w: 256, h: 256, maxUnits: 8192, maxBuildings: 4096 })
  const h = placeBuilding(ctx, B_HEARTH, 124, 124, { free: true })
  addItems(ctx, h, I_WOOD, 500, false)
  // tree bands with lodges, interleaved with sawmills and storehouses
  let n = 0
  for (let band = 0; band < 12; band++) {
    const y = 6 + band * 20
    paintResource(ctx, 2, y, 250, 3, R_TREE)
    for (let x = 2; x + 2 < 254; x += 3) if (placeBuilding(ctx, B_LUMBER_LODGE, x, y + 3, { free: true }) >= 0) n++
    for (let x = 2; x + 2 < 254; x += 3) if (placeBuilding(ctx, B_SAWMILL, x, y + 9, { free: true }) >= 0) n++
    for (let x = 4; x + 2 < 254; x += 24) if (placeBuilding(ctx, B_STOREHOUSE, x, y + 14, { free: true }) >= 0) n++
  }
  assert.ok(n >= 1800, `placed ${n}`)
  ctx.courierCapExtra += 5000
  ctx.courierCap += 5000
  for (let i = 0; i < 5000; i++) spawnUnit(ctx, U_COURIER, 2.5 + (i * 7919 % 250), 18.5 + ((i * 104729) % 12) * 20)
  run(ctx, 300) // warm up: jobs in flight, outputs filling
  const now = () => performance.now()
  let tb = 0, tl = 0
  const N = 100
  for (let t = 0; t < N; t++) {
    ctx.path.update()
    stepUnitsOnly(ctx)
    let a = now(); tickBuildings(ctx); tb += now() - a
    a = now(); tickLogistics(ctx); tl += now() - a
    ctx.tick++
  }
  tb /= N; tl /= N
  checkInvariants(ctx)
  console.log(`# scale: buildings=${ctx.buildings.count} couriers=${ctx.units.count} jobs=${ctx.log.jobCount} tickBuildings=${tb.toFixed(3)}ms tickLogistics=${tl.toFixed(3)}ms`)
  assert.ok(tb < 2, `tickBuildings ${tb.toFixed(3)} ms`)
  assert.ok(tl < 4, `tickLogistics ${tl.toFixed(3)} ms`)
})

/** The units system alone. */
function stepUnitsOnly(ctx) { tickUnits(ctx) }
