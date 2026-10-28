// Construction sites, discarding stacks and refunds that never vanish. OWNER: sim.
//
// A player placement no longer pays anything: it creates a construction site that couriers
// supply (from producers' outputs or storage, highest logistics priority). Cancelling a
// site refunds every delivered item; demolition refunds 50% and overfills storage rather
// than losing items; discardItems destroys an unreserved stack.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fillTerrain, paintResource } from './helpers.mjs'
import {
  I_WOOD, I_STONE, I_PLANK, ITEM_SHIFT, ITEM_COUNT,
  B_HEARTH, B_STOREHOUSE, B_LUMBER_LODGE, B_SAWMILL, B_QUARRY, B_SPRITE_DEN, B_WARD_TOWER, B_WARDEN_HALL,
  BF_STORAGE, U_COURIER, U_WARDEN, U_CRAWLER, F_BLIGHT, R_TREE, R_STONE, T_WATER,
  J_NONE, J_TO_PICKUP, J_PICKING, J_TO_DROPOFF, J_DROPPING,
  BS_OUTPUT_FULL, BS_STARVED, P_OK, P_COST, SITE_HP_FRAC, SITE_RAISE_TICKS,
  EV_BUILDING_BUILT, EV_BUILDING_LOST,
} from '../src/constants.js'
import { BUILDINGS, B_FLAGS, B_HP, B_STORAGE } from '../src/content.js'
import { createContext, stepSim } from '../src/context.js'
import {
  placeBuilding, canPlace, demolishBuilding, destroyBuilding, addItems, reserveOut, freeSpaceIn,
  recomputeStock, discardItems, refundCost, siteProgress, payCost,
} from '../src/buildings.js'
import { spawnUnit } from '../src/units.js'
import { damageBuilding, enqueueTraining, cancelTraining } from '../src/combat.js'

// ------------------------------------------------------------------ helpers
function mk(opts = {}) {
  return createContext({ w: 64, h: 64, seed: 1, generate: false, waves: false, maxUnits: 4096, maxBuildings: 1024, ...opts })
}
function run(ctx, n, each) { for (let i = 0; i < n; i++) { stepSim(ctx); if (each) each(ctx) } }
function runUntil(ctx, pred, max = 3000, each) {
  for (let i = 0; i < max; i++) { if (pred()) return i; stepSim(ctx); if (each) each(ctx) }
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
/** Every unit of `item` in the world: building inventories + courier cargo. */
function total(ctx, item) {
  const B = ctx.buildings, U = ctx.units
  let t = 0
  for (let b = 0; b < B.hi; b++) if (B.alive[b]) t += B.inv[(b << ITEM_SHIFT) | item]
  for (let u = 0; u < U.hi; u++) if (U.alive[u] && U.cargoItem[u] === item) t += U.cargoQty[u]
  return t
}
function events(ctx, from, type) {
  const r = ctx.events, out = []
  for (let n = from; n < r.written; n++) { const s = n & r.mask; if (r.type[s] === type) out.push([r.a[s], r.b[s]]) }
  return out
}

/**
 * Invariants: no negative inventory, every reservation owned by exactly one live courier job,
 * totals consistent, sites never oversubscribed, ctx.stock/caps equal a recompute. Storage
 * may be OVERFILLED (refunds), so only reservations are checked against free space there.
 */
function checkInvariants(ctx) {
  const pool = ctx.buildings, units = ctx.units
  const ownOut = new Map(), ownIn = new Map()
  let jobs = 0
  for (let u = 0; u < units.hi; u++) {
    if (!units.alive[u] || units.type[u] !== U_COURIER || units.job[u] === J_NONE) continue
    jobs++
    const j = units.job[u], item = units.jobItem[u], q = units.jobQty[u]
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
      assert.ok(pool.inv[k] >= 0 && pool.resIn[k] >= 0 && pool.resOut[k] >= 0, `non-negative (b${b} item ${i})`)
      assert.ok(pool.resOut[k] <= pool.inv[k], `resOut <= inv (b${b} item ${i})`)
      assert.equal(pool.resOut[k], ownOut.get(k) || 0, `resOut owned by jobs (b${b} item ${i})`)
      assert.equal(pool.resIn[k], ownIn.get(k) || 0, `resIn owned by jobs (b${b} item ${i})`)
      if (pool.site[b]) {
        const need = BUILDINGS[t].cost.reduce((a, e) => a + (e.item === i ? e.qty : 0), 0)
        assert.ok(pool.inv[k] + pool.resIn[k] <= need, `site never oversubscribed (b${b} item ${i})`)
        assert.equal(pool.resOut[k], 0, 'nobody picks up from a site')
      }
      tot += pool.inv[k]; totIn += pool.resIn[k]
    }
    assert.equal(pool.invTotal[b], tot)
    assert.equal(pool.resInTotal[b], totIn)
  }
  assert.equal(recomputeStock(ctx), true, 'incremental stock/caps match recompute')
}

/** Hearth at (30,30) (door 31,33) + lodge on a 6x6 grove at (10,10) (lodge 16,12, door 17,14) + rock at (40,10). */
function base() {
  const ctx = mk()
  const h = placeBuilding(ctx, B_HEARTH, 30, 30, { free: true })
  paintResource(ctx, 10, 10, 6, 6, R_TREE)
  const lodge = placeBuilding(ctx, B_LUMBER_LODGE, 16, 12, { free: true })
  paintResource(ctx, 40, 10, 5, 4, R_STONE)
  assert.ok(h >= 0 && lodge >= 0)
  return { ctx, h, lodge }
}

// ------------------------------------------------------------------ placement

test('player placement makes a construction site: nothing paid, no behaviour, highest-priority requester', () => {
  const { ctx, h, lodge } = base()
  const stock0 = Array.from(ctx.stock)
  const cap0 = ctx.storeCap, cour0 = ctx.courierCap
  assert.equal(canPlace(ctx, B_SAWMILL, 24, 20), P_OK, 'empty storage: still placeable')
  assert.equal(canPlace(ctx, B_STOREHOUSE, 24, 20), P_OK)
  const saw = placeBuilding(ctx, B_SAWMILL, 24, 20)
  const st = placeBuilding(ctx, B_STOREHOUSE, 24, 40)
  const den = placeBuilding(ctx, B_SPRITE_DEN, 36, 40)
  const lodgeSite = placeBuilding(ctx, B_LUMBER_LODGE, 10, 16) // on the grove's south edge
  for (const b of [saw, st, den, lodgeSite]) {
    assert.ok(b >= 0)
    assert.equal(ctx.buildings.site[b], 1)
    assert.equal(ctx.buildings.hp[b], B_HP[ctx.buildings.type[b]] * SITE_HP_FRAC, 'sites start at reduced HP')
    assert.ok(ctx.log.sitePos[b] >= 0, 'in the site list')
    assert.equal(ctx.log.reqPos[b], -1, 'not an ordinary requester')
    assert.equal(ctx.log.provPos[b], -1, 'not a provider')
    assert.equal(ctx.log.sKey[b], -1, 'not storage')
  }
  assert.deepEqual(Array.from(ctx.stock), stock0, 'nothing paid')
  assert.equal(ctx.storeCap, cap0, 'a storehouse site adds no capacity')
  assert.equal(ctx.courierCap, cour0, 'a den site adds no courier cap')
  // footprint and door occupied at once
  assert.equal(ctx.world.occ[ctx.world.idx(24, 20)], saw)
  assert.equal(ctx.world.pass[ctx.world.idx(25, 21)], 0)
  // the site accepts exactly its cost
  assert.equal(freeSpaceIn(ctx, saw, I_WOOD), 15)
  assert.equal(freeSpaceIn(ctx, saw, I_STONE), 5)
  assert.equal(freeSpaceIn(ctx, saw, I_PLANK), 0)
  assert.equal(freeSpaceIn(ctx, st, I_WOOD), 20, 'a storehouse site is not storage')
  assert.equal(addItems(ctx, saw, I_WOOD, 100, false), 15, 'clamped to the cost')
  assert.equal(siteProgress(ctx, saw), 0.9 * 15 / 20)
  // a site lodge on trees does not fell anything
  run(ctx, 120)
  assert.equal(inv(ctx, lodgeSite, I_WOOD), 0)
  assert.equal(ctx.buildings.status[lodgeSite], BS_STARVED)
  // free placement (hamlet, stress, tests) is still built at once
  const built = placeBuilding(ctx, B_STOREHOUSE, 50, 50, { free: true })
  assert.equal(ctx.buildings.site[built], 0)
  assert.equal(ctx.storeCap, cap0 + B_STORAGE[B_STOREHOUSE])
  assert.notEqual(canPlace(ctx, B_WARDEN_HALL, 4, 50), P_COST, 'canPlace never reports cost')
  void h; void lodge
  checkInvariants(ctx)
})

// ------------------------------------------------------------------ the softlock

test('storage FULL + wood only in a lodge: couriers carry the lodge output straight to the site, which completes and produces', () => {
  const { ctx, h, lodge } = base()
  addItems(ctx, h, I_STONE, 500, false)
  assert.equal(freeSpaceIn(ctx, h, I_WOOD), 0, 'storage full')
  addItems(ctx, lodge, I_WOOD, 20, false)
  run(ctx, 1)
  assert.equal(ctx.buildings.status[lodge], BS_OUTPUT_FULL)
  assert.equal(ctx.stock[I_WOOD], 0, 'nothing "affordable"')
  couriers(ctx, 4, 31.5, 34.5)
  const q = placeBuilding(ctx, B_QUARRY, 41, 11) // 15 wood
  assert.ok(q >= 0)
  const w0 = total(ctx, I_WOOD)
  let lodgeToSite = 0
  const watch = (c) => {
    const U = c.units
    for (let u = 0; u < U.hi; u++) {
      if (U.alive[u] && U.job[u] === J_TO_PICKUP && U.jobSrc[u] === lodge && U.jobDst[u] === q) lodgeToSite++
    }
  }
  run(ctx, 1, watch)
  assert.ok(ctx.log.stats.siteVisits >= 1)
  assert.equal(resOut(ctx, lodge, I_WOOD), 15, 'three courier loads reserved at the lodge in one visit')
  assert.equal(resIn(ctx, q, I_WOOD), 15)
  checkInvariants(ctx)
  const ticks = runUntil(ctx, () => ctx.buildings.site[q] === 0, 2000, (c) => { watch(c); checkInvariants(c) })
  assert.ok(ticks >= 0, 'site completed')
  assert.ok(ticks < 900, `completed within ${ticks} ticks`)
  assert.ok(lodgeToSite > 0, 'wood came from the lodge output')
  assert.equal(ctx.stock[I_WOOD], 0, 'storage never held any wood')
  // the cost was consumed: wood in the world dropped by exactly 15 (+ whatever the lodge felled)
  assert.ok(total(ctx, I_WOOD) <= w0 - 15 + 20)
  assert.equal(inv(ctx, q, I_WOOD), 0, 'delivered cost consumed')
  // it is now a working quarry
  assert.ok(ctx.log.provPos[q] >= 0, 'registered as a producer')
  assert.equal(ctx.log.sitePos[q], -1)
  assert.ok(ctx.buildings.hp[q] > B_HP[B_QUARRY] * SITE_HP_FRAC)
  assert.ok(runUntil(ctx, () => inv(ctx, q, I_STONE) > 0, 400) >= 0, 'the quarry produces stone')
  checkInvariants(ctx)
})

test('completion applies caps, indexes the building and emits EV_BUILDING_BUILT; sites draw storage to zero', () => {
  const { ctx, h, lodge } = base()
  ctx.buildings.paused[lodge] = 1
  addItems(ctx, h, I_WOOD, 50, false) // below CRAFT_RESERVE+cost: sites ignore the reserve
  addItems(ctx, h, I_STONE, 20, false)
  couriers(ctx, 6, 31.5, 34.5)
  const cap0 = ctx.storeCap, cour0 = ctx.courierCap
  const st = placeBuilding(ctx, B_STOREHOUSE, 24, 40) // 20 wood + 10 stone
  const den = placeBuilding(ctx, B_SPRITE_DEN, 36, 40) // 30 wood + 10 stone
  const ev0 = ctx.events.written
  assert.ok(runUntil(ctx, () => !ctx.buildings.site[st] && !ctx.buildings.site[den], 3000, checkInvariants) >= 0)
  assert.equal(ctx.stock[I_WOOD], 0, 'storage drawn down to zero')
  assert.equal(ctx.stock[I_STONE], 0)
  assert.equal(ctx.storeCap, cap0 + B_STORAGE[B_STOREHOUSE])
  assert.equal(ctx.courierCap, cour0 + BUILDINGS[B_SPRITE_DEN].courierCap)
  assert.ok(ctx.log.sKey[st] >= 0, 'storehouse indexed as storage')
  const built = events(ctx, ev0, EV_BUILDING_BUILT)
  assert.deepEqual(built.map((e) => e[0]).sort(), [B_STOREHOUSE, B_SPRITE_DEN].sort())
  assert.equal(built.find((e) => e[0] === B_STOREHOUSE)[1], ctx.buildings.door[st])
  // the raise takes SITE_RAISE_TICKS after the last delivery
  const s2 = placeBuilding(ctx, B_WARD_TOWER, 20, 40)
  addItems(ctx, s2, I_STONE, 15, false); addItems(ctx, s2, I_WOOD, 10, false); addItems(ctx, s2, I_PLANK, 5, false)
  run(ctx, SITE_RAISE_TICKS - 1)
  assert.equal(ctx.buildings.site[s2], 1, 'still raising')
  assert.ok(siteProgress(ctx, s2) > 0.9)
  run(ctx, 1)
  assert.equal(ctx.buildings.site[s2], 0)
  assert.equal(ctx.buildings.invTotal[s2], 0)
  checkInvariants(ctx)
})

test('hall/tower sites neither train nor shoot', () => {
  const { ctx, h } = base()
  addItems(ctx, h, I_WOOD, 100, false); addItems(ctx, h, I_PLANK, 30, false)
  const hall = placeBuilding(ctx, B_WARDEN_HALL, 20, 40)
  assert.equal(enqueueTraining(ctx, hall, U_WARDEN), false)
  const tw = placeBuilding(ctx, B_WARD_TOWER, 40, 40)
  spawnUnit(ctx, U_CRAWLER, 41.5, 42.5, F_BLIGHT) // well inside a tower's 6.5-tile range
  run(ctx, 60, (c) => assert.equal(c.buildings.target[tw], -1, 'a tower site never acquires a target'))
  assert.equal(ctx.buildings.site[tw], 1)
  assert.equal(ctx.buildings.trainLen[hall], 0)
})

// ------------------------------------------------------------------ cancel / destroy

test('cancelling a site refunds 100% of deliveries, releases reservations, reroutes cargo; nothing vanishes', () => {
  const { ctx, h, lodge } = base()
  // the lodge stops felling so the wood total is fixed
  ctx.buildings.paused[lodge] = 1
  addItems(ctx, h, I_WOOD, 100, false)
  addItems(ctx, h, I_STONE, 20, false)
  couriers(ctx, 6, 31.5, 34.5)
  const saw = placeBuilding(ctx, B_SAWMILL, 24, 20)
  const W = 100, S = 20
  assert.ok(runUntil(ctx, () => inv(ctx, saw, I_WOOD) >= 5 && ctx.log.jobCount > 0 &&
    ctx.units.job.some((j, u) => ctx.units.alive[u] && (j === J_TO_DROPOFF || j === J_DROPPING) && ctx.units.jobDst[u] === saw), 2000, checkInvariants) >= 0)
  const delivered = inv(ctx, saw, I_WOOD), deliveredS = inv(ctx, saw, I_STONE)
  const stock0 = ctx.stock[I_WOOD]
  assert.equal(demolishBuilding(ctx, saw), true)
  assert.equal(ctx.lastRefund[I_WOOD], delivered, 'refund = everything delivered')
  assert.equal(ctx.stock[I_WOOD], stock0 + delivered)
  assert.equal(ctx.lastRefund[I_STONE], deliveredS)
  run(ctx, 1)
  checkInvariants(ctx)
  let carrying = 0
  for (let u = 0; u < ctx.units.hi; u++) {
    if (ctx.units.alive[u] && ctx.units.cargoQty[u] > 0) { carrying++; assert.equal(ctx.units.jobDst[u], h, 'cargo rerouted to the Hearth') }
  }
  assert.ok(carrying > 0)
  assert.ok(runUntil(ctx, () => ctx.log.jobCount === 0, 2000, checkInvariants) >= 0)
  assert.equal(total(ctx, I_WOOD), W + 0, 'no wood vanished (lodge paused)')
  assert.equal(total(ctx, I_STONE), S)
  assert.equal(ctx.stock[I_WOOD], W)
})

test('cancelling with storage FULL overfills the Hearth: delivered items and in-flight cargo both survive', () => {
  const { ctx, h, lodge } = base()
  ctx.buildings.paused[lodge] = 1
  addItems(ctx, lodge, I_WOOD, 20, false)
  addItems(ctx, h, I_STONE, 500, false)
  couriers(ctx, 1, 31.5, 34.5) // one courier: one load delivered while the next is in flight
  const q = placeBuilding(ctx, B_QUARRY, 41, 11)
  assert.ok(runUntil(ctx, () => inv(ctx, q, I_WOOD) >= 5 &&
    ctx.units.job.some((j, u) => ctx.units.alive[u] && j === J_TO_DROPOFF && ctx.units.jobDst[u] === q), 2000) >= 0)
  const w0 = total(ctx, I_WOOD)
  assert.equal(w0, 20)
  demolishBuilding(ctx, q)
  assert.ok(ctx.buildings.invTotal[h] > B_STORAGE[B_HEARTH], 'the Hearth is overfilled')
  assert.ok(runUntil(ctx, () => ctx.log.jobCount === 0, 2000, checkInvariants) >= 0)
  assert.equal(total(ctx, I_WOOD), 20, 'all 20 wood still exist (refund + rerouted cargo + lodge remainder)')
  assert.equal(ctx.log.stats.totalLost, 0, 'no cargo dropped')
})

test('a site destroyed by damage loses its deliveries and strands no courier', () => {
  const { ctx, h, lodge } = base()
  ctx.buildings.paused[lodge] = 1
  addItems(ctx, h, I_WOOD, 100, false); addItems(ctx, h, I_STONE, 20, false)
  couriers(ctx, 4, 31.5, 34.5)
  const saw = placeBuilding(ctx, B_SAWMILL, 24, 20)
  assert.ok(runUntil(ctx, () => inv(ctx, saw, I_WOOD) >= 5, 2000) >= 0)
  const lost = inv(ctx, saw, I_WOOD) + inv(ctx, saw, I_STONE)
  const before = total(ctx, I_WOOD) + total(ctx, I_STONE)
  const ev0 = ctx.events.written
  // half HP: a hit for the full site HP kills it (a built Sawmill would survive it)
  damageBuilding(ctx, saw, B_HP[B_SAWMILL] * SITE_HP_FRAC)
  assert.equal(ctx.buildings.alive[saw], 0)
  assert.equal(events(ctx, ev0, EV_BUILDING_LOST).length, 1)
  assert.equal(total(ctx, I_WOOD) + total(ctx, I_STONE), before - lost, 'delivered items are lost')
  run(ctx, 1)
  checkInvariants(ctx)
  assert.ok(runUntil(ctx, () => ctx.log.jobCount === 0, 2000, checkInvariants) >= 0, 'every courier finishes or reroutes')
  assert.equal(ctx.log.stats.totalLost, 0)
})

// ------------------------------------------------------------------ discard

test('discardItems destroys only the unreserved stack and keeps stock consistent', () => {
  const { ctx, h, lodge } = base()
  addItems(ctx, h, I_WOOD, 50, false)
  reserveOut(ctx, h, I_WOOD, 5) // promised to a courier
  assert.equal(ctx.stock[I_WOOD], 45)
  assert.equal(discardItems(ctx, h, I_WOOD, 10), 10)
  assert.equal(ctx.stock[I_WOOD], 35)
  assert.equal(discardItems(ctx, h, I_WOOD), 35, 'default: the whole unreserved stack')
  assert.equal(inv(ctx, h, I_WOOD), 5, 'reserved items untouched')
  assert.equal(resOut(ctx, h, I_WOOD), 5)
  assert.equal(ctx.stock[I_WOOD], 0)
  assert.equal(ctx.buildings.invTotal[h], 5)
  assert.equal(discardItems(ctx, h, I_WOOD), 0)
  assert.equal(discardItems(ctx, h, 0), 0, 'item 0 is nothing')
  assert.equal(recomputeStock(ctx), true)
  // a full lodge output can be dumped and it resumes felling
  addItems(ctx, lodge, I_WOOD, 20, false)
  run(ctx, 1)
  assert.equal(ctx.buildings.status[lodge], BS_OUTPUT_FULL)
  assert.equal(discardItems(ctx, lodge, I_WOOD), 20)
  run(ctx, 1)
  assert.notEqual(ctx.buildings.status[lodge], BS_OUTPUT_FULL)
  // a site's delivered items
  const saw = placeBuilding(ctx, B_SAWMILL, 24, 20)
  addItems(ctx, saw, I_WOOD, 8, false)
  assert.equal(discardItems(ctx, saw, I_WOOD), 8)
  assert.equal(freeSpaceIn(ctx, saw, I_WOOD), 15, 'room to deliver again')
  assert.equal(recomputeStock(ctx), true)
})

test('discarding from a full Hearth frees room; couriers deliver there again', () => {
  const { ctx, h, lodge } = base()
  addItems(ctx, h, I_STONE, 500, false)
  addItems(ctx, lodge, I_WOOD, 20, false)
  couriers(ctx, 4, 31.5, 34.5)
  run(ctx, 200)
  assert.equal(inv(ctx, h, I_WOOD), 0, 'full storage receives nothing')
  assert.equal(discardItems(ctx, h, I_STONE, 100), 100)
  assert.equal(freeSpaceIn(ctx, h, I_WOOD), 100)
  assert.ok(runUntil(ctx, () => inv(ctx, h, I_WOOD) > 0, 1500, checkInvariants) >= 0, 'push resumes into the freed room')
})

// ------------------------------------------------------------------ refunds

test('demolition refund overfills storage instead of vanishing; logistics stops delivering until it drains', () => {
  const { ctx, h, lodge } = base()
  addItems(ctx, h, I_STONE, 500, false)
  const quarry = placeBuilding(ctx, B_QUARRY, 41, 11, { free: true })
  assert.equal(demolishBuilding(ctx, quarry), true)
  assert.equal(ctx.lastRefund[I_WOOD], 7, 'floor(15 * 0.5)')
  assert.equal(inv(ctx, h, I_WOOD), 7)
  assert.equal(ctx.stock[I_WOOD], 7)
  assert.equal(ctx.buildings.invTotal[h], 507, 'overfilled past 500')
  assert.ok(freeSpaceIn(ctx, h, I_WOOD) < 0)
  assert.equal(recomputeStock(ctx), true)
  // a free storehouse with room takes refunds before the Hearth overfills
  const st = placeBuilding(ctx, B_STOREHOUSE, 24, 40, { free: true })
  const saw = placeBuilding(ctx, B_SAWMILL, 24, 20, { free: true })
  demolishBuilding(ctx, saw)
  assert.equal(inv(ctx, st, I_WOOD), 7)
  assert.equal(inv(ctx, st, I_STONE), 2)
  assert.equal(ctx.buildings.invTotal[h], 507)
  destroyBuilding(ctx, st, 0, true)
  // the lodge's full output is not pushed into an over-full Hearth
  addItems(ctx, lodge, I_WOOD, 20, false)
  couriers(ctx, 4, 31.5, 34.5)
  run(ctx, 300, checkInvariants)
  assert.equal(ctx.buildings.invTotal[h], 507)
  // training cancel refunds overfill too
  addItems(ctx, h, I_PLANK, 0, false)
  payCost(ctx, [{ item: I_WOOD, qty: 7 }]) // as if spent
  assert.equal(ctx.buildings.invTotal[h], 500)
  assert.equal(refundCost(ctx, [{ item: I_WOOD, qty: 15 }, { item: I_PLANK, qty: 10 }], 1), 25)
  assert.equal(ctx.buildings.invTotal[h], 525)
  assert.equal(ctx.lastRefund[I_PLANK], 10)
  assert.equal(recomputeStock(ctx), true)
})

test('a full Hearth and a hall training queue: cancelTraining refunds fully even with no room', () => {
  const { ctx, h } = base()
  const hall = placeBuilding(ctx, B_WARDEN_HALL, 20, 40, { free: true })
  addItems(ctx, h, I_WOOD, 15, false); addItems(ctx, h, I_PLANK, 10, false)
  assert.equal(enqueueTraining(ctx, hall, U_WARDEN), true)
  addItems(ctx, h, I_STONE, 500, false)
  assert.equal(ctx.buildings.invTotal[h], 500)
  assert.equal(cancelTraining(ctx, hall), true)
  assert.equal(ctx.stock[I_WOOD], 15)
  assert.equal(ctx.stock[I_PLANK], 10)
  assert.equal(ctx.buildings.invTotal[h], 525)
  assert.equal(recomputeStock(ctx), true)
})

test('a raid wiping the swarm with only a Den SITE still gets rescue couriers', () => {
  const { ctx, h } = base()
  addItems(ctx, h, I_WOOD, 60, false); addItems(ctx, h, I_STONE, 20, false); addItems(ctx, h, I_PLANK, 30, false)
  const den = placeBuilding(ctx, B_SPRITE_DEN, 36, 40)
  assert.equal(ctx.units.typeCount[U_COURIER], 0)
  assert.ok(runUntil(ctx, () => ctx.units.typeCount[U_COURIER] > 0, 400) >= 0, 'the Hearth coaxes out a courier')
  assert.ok(runUntil(ctx, () => !ctx.buildings.site[den], 4000) >= 0, 'and the den gets built')
  void fillTerrain; void T_WATER; void J_PICKING; void J_DROPPING; void B_FLAGS; void BF_STORAGE
})

test('full storage + the only lodge with wood beyond the producer ring: a site is still supplied', () => {
  const ctx = mk({ w: 256, h: 64 })
  const h = placeBuilding(ctx, B_HEARTH, 20, 30, { free: true })
  addItems(ctx, h, I_STONE, B_STORAGE[B_HEARTH], false) // storage full, no wood in it
  assert.equal(freeSpaceIn(ctx, h, 0), 0)
  paintResource(ctx, 224, 26, 6, 6, R_TREE)
  const far = placeBuilding(ctx, B_LUMBER_LODGE, 220, 28, { free: true }) // ~200 tiles away
  assert.ok(far >= 0)
  addItems(ctx, far, I_WOOD, 10, false)
  couriers(ctx, 4, 21.5, 34.5)
  stepSim(ctx)
  paintResource(ctx, 8, 26, 4, 4, R_TREE)
  const site = placeBuilding(ctx, B_LUMBER_LODGE, 12, 28) // costs wood only
  assert.ok(site >= 0 && ctx.buildings.site[site] === 1)
  const took = runUntil(ctx, () => ctx.buildings.site[site] === 0, 6000)
  assert.ok(took >= 0, 'the site completes from the distant lodge')
})

test('demolishing a built producer or Storehouse returns its own unreserved inventory too', () => {
  const ctx = mk()
  const h = placeBuilding(ctx, B_HEARTH, 30, 30, { free: true })
  paintResource(ctx, 8, 8, 6, 6, R_TREE)
  const lodge = placeBuilding(ctx, B_LUMBER_LODGE, 10, 10, { free: true })
  addItems(ctx, lodge, I_WOOD, 6, false)
  reserveOut(ctx, lodge, I_WOOD, 2) // promised to a courier: dropped with the building
  const sh = placeBuilding(ctx, B_STOREHOUSE, 40, 40, { free: true })
  addItems(ctx, sh, I_STONE, 30, false)
  const wood0 = ctx.stock[I_WOOD]
  assert.ok(demolishBuilding(ctx, lodge))
  // 50% of 10 wood cost + 4 unreserved logs from the output
  assert.equal(ctx.stock[I_WOOD] - wood0, 5 + 4)
  assert.equal(ctx.lastRefund[I_WOOD], 9)
  const stone0 = ctx.stock[I_STONE]
  assert.ok(demolishBuilding(ctx, sh))
  // the Storehouse's 30 stone move to the Hearth, plus 50% of its 10 stone cost
  assert.equal(inv(ctx, h, I_STONE), 30 + 5)
  assert.equal(ctx.stock[I_STONE], stone0 - 30 + 30 + 5)
  assert.equal(ctx.lastRefund[I_STONE], 35)
  const s = ctx.stock.slice(); recomputeStock(ctx)
  assert.deepEqual(Array.from(ctx.stock), Array.from(s))
})

test('tutorial hints count only built buildings, not construction sites', async () => {
  const { HINTS, builtCount } = await import('../src/app-hud.js')
  const ctx = mk()
  placeBuilding(ctx, B_HEARTH, 30, 30, { free: true })
  const tower = HINTS.find((h) => h.id === 'tower')
  const site = placeBuilding(ctx, B_WARD_TOWER, 40, 40)
  assert.ok(site >= 0 && ctx.buildings.site[site] === 1)
  assert.equal(builtCount(ctx, B_WARD_TOWER), 0)
  assert.equal(tower.done(ctx), false, 'a tower site cannot shoot: the defence hint stays up')
  placeBuilding(ctx, B_WARD_TOWER, 44, 40, { free: true })
  assert.equal(builtCount(ctx, B_WARD_TOWER), 1)
  assert.equal(tower.done(ctx), true)
})
