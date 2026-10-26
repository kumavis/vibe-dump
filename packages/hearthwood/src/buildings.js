// Building placement, inventories, production, storage/stock, dens, shrine tiers.
// OWNER: sim implementer. Contract: ARCHITECTURE.md §9.
//
// INVENTORY RULE: buildings.inv / resIn / resOut / invTotal / resInTotal and ctx.stock
// are written ONLY by the inventory helpers in this file (addItems, takeItems,
// reserveOut, releaseOut, reserveIn, releaseIn, payCost, refundCost). Every other
// module calls these helpers. They keep ctx.stock in sync:
//   ctx.stock[item] = sum over alive BF_STORAGE buildings of (inv - resOut)

import {
  BUILDING_COUNT, ITEM_SHIFT, ITEM_STRIDE, ITEM_COUNT, CHUNK_SHIFT, CHUNK,
  BF_STORAGE, BF_PRODUCER, BF_EXTRACTOR, BF_DEN, BF_SHRINE, BF_CORE,
  BS_OK, BS_STARVED, BS_OUTPUT_FULL, BS_DEPLETED, BS_PAUSED, BS_NO_STOCK, BS_IDLE,
  P_OK, P_BLOCKED, P_DOOR, P_NO_RESOURCE, P_COST, P_TIER, P_UNIQUE, P_NOT_BUILDABLE, P_OOB,
  U_COURIER, FX_BUILD, FX_DESTROY,
  EV_BUILDING_LOST, EV_TIER_UP, EV_WIN, EV_LOSE, EV_COURIER_SPAWNED,
} from './constants.js'
import {
  BUILDINGS, TIERS, WIN_TIER, B_FLAGS, B_STORAGE, B_TIER, B_OUT_ITEM, B_SLOT_CAP, B_IN_QTY, B_W, B_H,
} from './content.js'
import { registerBuilding, unregisterBuilding } from './logistics.js'
import { spawnUnit } from './units.js'

/** @typedef {import('./context.js').Ctx} Ctx */
/** @typedef {{item:number, qty:number}} ItemQty */

// ------------------------------------------------------------------ derived per-type tables
// Flat lookups so tickBuildings never touches content objects in the hot loop.

/** recipe work ticks per cycle (producers) */
const P_TICKS = new Int32Array(BUILDING_COUNT)
/** output qty per cycle */
const P_OUT_QTY = new Int32Array(BUILDING_COUNT)
/** recipe input items: IN_ITEMS[type*4 + k], k < IN_N[type] */
const IN_ITEMS = new Uint8Array(BUILDING_COUNT * 4)
const IN_N = new Uint8Array(BUILDING_COUNT)
/** extractor resource + reach */
const EX_RES = new Uint8Array(BUILDING_COUNT)
const EX_REACH = new Uint8Array(BUILDING_COUNT)
/** courier cap contributed while alive */
const T_COURIER_CAP = new Int32Array(BUILDING_COUNT)
/** den spawn ticks */
const DEN_TICKS = new Int32Array(BUILDING_COUNT)
/** storage types in pay/refund order (ascending type: Hearth first, then Storehouse) */
const STORAGE_TYPES = []
for (let t = 1; t < BUILDING_COUNT; t++) {
  const d = BUILDINGS[t]
  if (d.recipe) {
    P_TICKS[t] = d.recipe.ticks
    P_OUT_QTY[t] = d.recipe.outputs.length ? d.recipe.outputs[0].qty : 0
    IN_N[t] = d.recipe.inputs.length
    for (let k = 0; k < d.recipe.inputs.length; k++) IN_ITEMS[t * 4 + k] = d.recipe.inputs[k].item
  }
  if (d.extractor) { EX_RES[t] = d.extractor.res; EX_REACH[t] = d.extractor.reach }
  T_COURIER_CAP[t] = d.courierCap
  if (d.courierSpawn) DEN_TICKS[t] = d.courierSpawn.ticks
  if (d.flags & BF_STORAGE) STORAGE_TYPES.push(t)
}

/** Offering qty per (tier, item): OFFER_QTY[(tier << ITEM_SHIFT) | item]. */
const OFFER_QTY = new Int32Array(TIERS.length * ITEM_STRIDE)
for (let t = 0; t < TIERS.length; t++) {
  const off = TIERS[t].offering
  if (off) for (const e of off) OFFER_QTY[(t << ITEM_SHIFT) | e.item] += e.qty
}

/** Number of recipe input items of a building type (for UI / logistics). */
export function recipeInputCount(type) { return IN_N[type] }
/** k-th recipe input item of a building type. */
export function recipeInputItem(type, k) { return IN_ITEMS[type * 4 + k] }
/** Offering qty needed for `item` to advance from `tier` (0 if none). */
export function offeringQty(tier, item) { return tier >= 0 && tier < TIERS.length ? OFFER_QTY[(tier << ITEM_SHIFT) | item] : 0 }

// Building currently being destroyed: refundCost must not deposit into it.
let dyingBuilding = -1

// ------------------------------------------------------------------ placement

/**
 * Validate a placement. Checks in this order and returns the first failure:
 * P_NOT_BUILDABLE (only when opts.free is false), P_TIER, P_UNIQUE, P_OOB, P_BLOCKED
 * (world.areaFree), P_DOOR (door tile in bounds, walkable, not inside the footprint),
 * P_NO_RESOURCE (extractor: world.countResource(...) === 0), P_COST (unless opts.free).
 * Pure: no side effects. O(footprint + reach area).
 * @param {Ctx} ctx
 * @param {number} type B_*
 * @param {number} tx footprint top-left
 * @param {number} ty
 * @param {{free?:boolean}} [opts] free: skip cost and buildable checks (start hamlet, stress, tests)
 * @returns {number} P_*
 */
export function canPlace(ctx, type, tx, ty, opts) {
  if (!(type >= 1 && type < BUILDING_COUNT)) return P_NOT_BUILDABLE
  const free = !!(opts && opts.free)
  const d = BUILDINGS[type]
  if (!free && !d.buildable) return P_NOT_BUILDABLE
  if (!free && B_TIER[type] > ctx.tier) return P_TIER
  if (d.unique && ctx.buildings.typeCount[type] > 0) return P_UNIQUE
  const world = ctx.world
  const w = B_W[type], h = B_H[type]
  tx |= 0; ty |= 0
  if (tx < 0 || ty < 0 || tx + w > world.w || ty + h > world.h) return P_OOB
  if (!world.areaFree(tx, ty, w, h)) return P_BLOCKED
  const door = world.doorTile(type, tx, ty)
  if (door < 0 || world.pass[door] !== 1) return P_DOOR
  if (B_FLAGS[type] & BF_EXTRACTOR) {
    if (world.countResource(tx, ty, w, h, EX_REACH[type], EX_RES[type]) === 0) return P_NO_RESOURCE
  }
  if (!free && !canAfford(ctx, d.cost)) return P_COST
  return P_OK
}

/**
 * Place a building: canPlace -> payCost (unless free) -> pool.alloc -> set tx/ty/door
 * -> world.occupy -> pool.linkChunk -> ctx.courierCap += courierCap ->
 * if BF_STORAGE: ctx.storeCap += storage -> logistics.registerBuilding -> fx FX_BUILD.
 * @param {Ctx} ctx
 * @returns {number} building id, or -1 if canPlace failed (nothing changed)
 */
export function placeBuilding(ctx, type, tx, ty, opts) {
  tx |= 0; ty |= 0
  if (canPlace(ctx, type, tx, ty, opts) !== P_OK) return -1
  const pool = ctx.buildings
  if (pool.count >= pool.capacity) return -1
  const free = !!(opts && opts.free)
  if (!free && !payCost(ctx, BUILDINGS[type].cost)) return -1
  const b = pool.alloc(type)
  if (b < 0) return -1
  const world = ctx.world
  pool.tx[b] = tx
  pool.ty[b] = ty
  const door = world.doorTile(type, tx, ty)
  pool.door[b] = door
  world.occupy(tx, ty, B_W[type], B_H[type], b, door)
  pool.linkChunk(b, world.chunkOfXY(tx, ty))
  ctx.courierCap += T_COURIER_CAP[type]
  if (B_FLAGS[type] & BF_STORAGE) ctx.storeCap += B_STORAGE[type]
  registerBuilding(ctx, b)
  const cx = tx + B_W[type] * 0.5, cy = ty + B_H[type] * 0.5
  ctx.fx.emit(FX_BUILD, cx, cy, cx, cy, ctx.tick)
  return b
}

/**
 * Remove a building from the world. Order: logistics.unregisterBuilding ->
 * refund `refundFrac` of its cost (floor per item) via refundCost -> if storage: subtract
 * its (inv - resOut) from ctx.stock and its capacity from ctx.storeCap (contents are LOST) ->
 * ctx.courierCap -= courierCap -> world.vacate -> pool.free.
 * If `killed`: fx FX_DESTROY + event EV_BUILDING_LOST; if BF_CORE: ctx.lost = true + EV_LOSE.
 * Couriers/units referencing it notice lazily through the generation check.
 * (A refund never lands in the building being destroyed.)
 * @param {Ctx} ctx
 * @param {number} b building id (must be alive)
 * @param {number} [refundFrac=0]
 * @param {boolean} [killed=false] destroyed by enemies (vs. demolished by the player)
 */
export function destroyBuilding(ctx, b, refundFrac = 0, killed = false) {
  const pool = ctx.buildings
  if (b < 0 || b >= pool.capacity || !pool.alive[b]) return
  const type = pool.type[b]
  const flags = B_FLAGS[type]
  unregisterBuilding(ctx, b)
  if (refundFrac > 0) {
    dyingBuilding = b
    refundCost(ctx, BUILDINGS[type].cost, refundFrac)
    dyingBuilding = -1
  }
  if (flags & BF_STORAGE) {
    const o = b << ITEM_SHIFT
    const stock = ctx.stock
    for (let i = 1; i < ITEM_COUNT; i++) stock[i] -= pool.inv[o + i] - pool.resOut[o + i]
    ctx.storeCap -= B_STORAGE[type]
  }
  ctx.courierCap -= T_COURIER_CAP[type]
  const tx = pool.tx[b], ty = pool.ty[b]
  const door = pool.door[b]
  ctx.world.vacate(tx, ty, B_W[type], B_H[type], door)
  // Leave the dead slot's inventory as-is (alloc resets it); readers check alive/gen.
  pool.free(b)
  if (killed) {
    const cx = tx + B_W[type] * 0.5, cy = ty + B_H[type] * 0.5
    ctx.fx.emit(FX_DESTROY, cx, cy, cx, cy, ctx.tick)
    ctx.events.emit(EV_BUILDING_LOST, type, door, ctx.tick)
    if (flags & BF_CORE) {
      if (!ctx.lost) ctx.events.emit(EV_LOSE, 0, 0, ctx.tick)
      ctx.lost = true
    }
  }
}

/**
 * Player demolition: 50% refund. Refuses the Hearth.
 * @returns {boolean} true if demolished
 */
export function demolishBuilding(ctx, b) {
  const pool = ctx.buildings
  if (b < 0 || b >= pool.capacity || !pool.alive[b]) return false
  if (B_FLAGS[pool.type[b]] & BF_CORE) return false
  destroyBuilding(ctx, b, 0.5, false)
  return true
}

// ------------------------------------------------------------------ inventory helpers

/**
 * Put items into b. If fromReserved, consumes `qty` of resIn first (courier drop-off of a
 * reserved job) and always succeeds; otherwise clamps to freeSpaceIn-style capacity
 * (storage: storage - invTotal - resInTotal; others: slot cap - inv - resIn for that item,
 * output slots included). Updates invTotal, resInTotal and ctx.stock when storage.
 * @returns {number} quantity actually added
 */
export function addItems(ctx, b, item, qty, fromReserved) {
  if (qty <= 0) return 0
  const pool = ctx.buildings
  const k = (b << ITEM_SHIFT) | item
  const type = pool.type[b]
  const storage = B_FLAGS[type] & BF_STORAGE
  let q = qty
  if (fromReserved) {
    let r = pool.resIn[k]
    if (r > q) r = q
    pool.resIn[k] -= r
    pool.resInTotal[b] -= r
  } else {
    const space = storage
      ? B_STORAGE[type] - pool.invTotal[b] - pool.resInTotal[b]
      : B_SLOT_CAP[(type << ITEM_SHIFT) | item] - pool.inv[k] - pool.resIn[k]
    if (space < q) q = space
    if (q <= 0) return 0
  }
  pool.inv[k] += q
  pool.invTotal[b] += q
  if (storage) ctx.stock[item] += q
  return q
}

/**
 * Remove items from b. If fromReserved, consumes `qty` of resOut too (courier pickup);
 * otherwise only takes from the unreserved part (inv - resOut).
 * @returns {number} quantity actually removed
 */
export function takeItems(ctx, b, item, qty, fromReserved) {
  if (qty <= 0) return 0
  const pool = ctx.buildings
  const k = (b << ITEM_SHIFT) | item
  const storage = B_FLAGS[pool.type[b]] & BF_STORAGE
  let q = qty
  if (fromReserved) {
    if (q > pool.resOut[k]) q = pool.resOut[k]
    if (q > pool.inv[k]) q = pool.inv[k]
    if (q <= 0) return 0
    pool.resOut[k] -= q
    pool.inv[k] -= q
    pool.invTotal[b] -= q
    // stock unchanged: reserved items were already excluded from it
  } else {
    const avail = pool.inv[k] - pool.resOut[k]
    if (q > avail) q = avail
    if (q <= 0) return 0
    pool.inv[k] -= q
    pool.invTotal[b] -= q
    if (storage) ctx.stock[item] -= q
  }
  return q
}

/** resOut += qty (caller ensured availableOut >= qty). Storage: ctx.stock[item] -= qty. */
export function reserveOut(ctx, b, item, qty) {
  const pool = ctx.buildings
  pool.resOut[(b << ITEM_SHIFT) | item] += qty
  if (B_FLAGS[pool.type[b]] & BF_STORAGE) ctx.stock[item] -= qty
}
/** resOut -= qty. Storage: ctx.stock[item] += qty. */
export function releaseOut(ctx, b, item, qty) {
  const pool = ctx.buildings
  const k = (b << ITEM_SHIFT) | item
  if (qty > pool.resOut[k]) qty = pool.resOut[k]
  if (qty <= 0) return
  pool.resOut[k] -= qty
  if (B_FLAGS[pool.type[b]] & BF_STORAGE) ctx.stock[item] += qty
}
/** resIn += qty, resInTotal += qty (caller ensured freeSpaceIn >= qty). */
export function reserveIn(ctx, b, item, qty) {
  const pool = ctx.buildings
  pool.resIn[(b << ITEM_SHIFT) | item] += qty
  pool.resInTotal[b] += qty
}
/** resIn -= qty, resInTotal -= qty. */
export function releaseIn(ctx, b, item, qty) {
  const pool = ctx.buildings
  const k = (b << ITEM_SHIFT) | item
  if (qty > pool.resIn[k]) qty = pool.resIn[k]
  if (qty <= 0) return
  pool.resIn[k] -= qty
  pool.resInTotal[b] -= qty
}

/** inv - resOut for (b, item). Pure. */
export function availableOut(ctx, b, item) {
  const pool = ctx.buildings
  const k = (b << ITEM_SHIFT) | item
  return pool.inv[k] - pool.resOut[k]
}

/**
 * How many more of `item` b will ACCEPT as a logistics destination, net of reservations. Pure.
 *  - BF_STORAGE: storage - invTotal - resInTotal (any item)
 *  - BF_SHRINE: (TIERS[ctx.tier].offering qty for item) - inv - resIn, 0 if not in the offering or won
 *  - recipe input item: B_SLOT_CAP - inv - resIn
 *  - anything else (outputs, non-inputs): 0
 */
export function freeSpaceIn(ctx, b, item) {
  const pool = ctx.buildings
  const type = pool.type[b]
  const f = B_FLAGS[type]
  if (f & BF_STORAGE) return B_STORAGE[type] - pool.invTotal[b] - pool.resInTotal[b]
  const k = (b << ITEM_SHIFT) | item
  if (f & BF_SHRINE) {
    if (ctx.won || ctx.tier >= WIN_TIER) return 0
    const need = OFFER_QTY[(ctx.tier << ITEM_SHIFT) | item]
    if (need === 0) return 0
    return need - pool.inv[k] - pool.resIn[k]
  }
  const tk = (type << ITEM_SHIFT) | item
  if (B_IN_QTY[tk] > 0) return B_SLOT_CAP[tk] - pool.inv[k] - pool.resIn[k]
  return 0
}

/** True if ctx.stock covers every entry of cost. Pure. */
export function canAfford(ctx, cost) {
  if (!cost) return true
  const stock = ctx.stock
  for (let i = 0; i < cost.length; i++) {
    const e = cost[i]
    if (stock[e.item] < e.qty) return false
  }
  return true
}

/**
 * Deduct cost from storage buildings (Hearth typeList first, then Storehouses in typeList
 * order), unreserved items only. All-or-nothing.
 * @returns {boolean} false (and nothing changed) if !canAfford
 */
export function payCost(ctx, cost) {
  if (!cost || cost.length === 0) return true
  if (!canAfford(ctx, cost)) return false
  const pool = ctx.buildings
  for (let i = 0; i < cost.length; i++) {
    const item = cost[i].item
    let left = cost[i].qty
    for (let s = 0; s < STORAGE_TYPES.length && left > 0; s++) {
      const t = STORAGE_TYPES[s]
      const list = pool.typeList[t]
      const n = pool.typeCount[t]
      for (let j = 0; j < n && left > 0; j++) left -= takeItems(ctx, list[j], item, left, false)
    }
  }
  return true
}

/**
 * Add floor(qty * frac) of each cost entry into storage with free space (Hearth first).
 * Overflow is lost. @returns {number} total items refunded
 */
export function refundCost(ctx, cost, frac) {
  if (!cost || !(frac > 0)) return 0
  const pool = ctx.buildings
  let total = 0
  for (let i = 0; i < cost.length; i++) {
    const item = cost[i].item
    let left = Math.floor(cost[i].qty * frac)
    for (let s = 0; s < STORAGE_TYPES.length && left > 0; s++) {
      const t = STORAGE_TYPES[s]
      const list = pool.typeList[t]
      const n = pool.typeCount[t]
      for (let j = 0; j < n && left > 0; j++) {
        const b = list[j]
        if (b === dyingBuilding) continue
        const q = addItems(ctx, b, item, left, false)
        left -= q
        total += q
      }
    }
  }
  return total
}

// ------------------------------------------------------------------ queries

/** Building id at a tile or -1 (world.occ). */
export function buildingAtTile(ctx, tx, ty) {
  const world = ctx.world
  tx = Math.floor(tx); ty = Math.floor(ty)
  if (tx < 0 || ty < 0 || tx >= world.w || ty >= world.h) return -1
  return world.occ[(ty << world.shift) | tx]
}

/**
 * Nearest alive building (by distance from (x,y) to its footprint rect) whose type flags
 * intersect `flagMask` (0 = any), searching chunk rings out to `maxChunks`. Ties -> lower id.
 * Used by waves (raid targets), combat (blight building targets), logistics (fallback storage).
 * @param {number} x world tile units
 * @param {number} y
 * @returns {number} id or -1
 */
export function nearestBuilding(ctx, x, y, maxChunks, flagMask) {
  const world = ctx.world
  const pool = ctx.buildings
  const cw = world.chunksW, chh = world.chunksH
  let cx = Math.floor(x) >> CHUNK_SHIFT, cy = Math.floor(y) >> CHUNK_SHIFT
  if (cx < 0) cx = 0; else if (cx >= cw) cx = cw - 1
  if (cy < 0) cy = 0; else if (cy >= chh) cy = chh - 1
  const maxDim = cw > chh ? cw : chh
  let rMax = maxChunks == null ? maxDim : maxChunks | 0
  if (rMax > maxDim) rMax = maxDim
  let best = -1, bestD2 = Infinity
  const head = pool.chunkHead, next = pool.chunkNext
  for (let r = 0; r <= rMax; r++) {
    if (best >= 0) {
      // a footprint keyed in a ring-r chunk can reach back at most 3 tiles toward us
      const lim = (r - 1) * CHUNK - 4
      if (lim > 0 && lim * lim > bestD2) break
    }
    const y0 = cy - r, y1 = cy + r, x0 = cx - r, x1 = cx + r
    for (let yy = y0; yy <= y1; yy++) {
      if (yy < 0 || yy >= chh) continue
      const edgeRow = yy === y0 || yy === y1
      const step = edgeRow ? 1 : (x1 - x0)
      for (let xx = x0; xx <= x1; xx += step) {
        if (xx >= 0 && xx < cw) {
          for (let b = head[yy * cw + xx]; b >= 0; b = next[b]) {
            if (flagMask !== 0 && flagMask != null && (B_FLAGS[pool.type[b]] & flagMask) === 0) continue
            const bx = pool.tx[b], by = pool.ty[b]
            const ex = bx + pool.w[b], ey = by + pool.h[b]
            const dx = x < bx ? bx - x : x > ex ? x - ex : 0
            const dy = y < by ? by - y : y > ey ? y - ey : 0
            const d2 = dx * dx + dy * dy
            if (d2 < bestD2 || (d2 === bestD2 && b < best)) { best = b; bestD2 = d2 }
          }
        }
        if (step === 0) break
      }
    }
  }
  return best
}

/** Toggle player pause on a building. */
export function setPaused(ctx, b, on) {
  const pool = ctx.buildings
  if (b < 0 || b >= pool.capacity || !pool.alive[b]) return
  pool.paused[b] = on ? 1 : 0
  if (on) pool.status[b] = BS_PAUSED
  else if (pool.status[b] === BS_PAUSED) pool.status[b] = BS_OK
}

const recomputeScratch = new Int32Array(ITEM_STRIDE)

/**
 * Recompute ctx.stock / storeCap / courierCap from scratch (debug + tests):
 * courierCap = ctx.courierCapExtra + sum of BUILDINGS[type].courierCap over alive buildings.
 * @returns {boolean} true if the incremental values already matched
 */
export function recomputeStock(ctx) {
  const pool = ctx.buildings
  const s = recomputeScratch
  s.fill(0)
  let storeCap = 0
  let courierCap = ctx.courierCapExtra | 0
  for (let b = 0; b < pool.hi; b++) {
    if (!pool.alive[b]) continue
    const t = pool.type[b]
    courierCap += T_COURIER_CAP[t]
    if (B_FLAGS[t] & BF_STORAGE) {
      storeCap += B_STORAGE[t]
      const o = b << ITEM_SHIFT
      for (let i = 1; i < ITEM_COUNT; i++) s[i] += pool.inv[o + i] - pool.resOut[o + i]
    }
  }
  let ok = storeCap === ctx.storeCap && courierCap === ctx.courierCap
  for (let i = 0; i < ITEM_STRIDE; i++) if (s[i] !== ctx.stock[i]) ok = false
  ctx.stock.set(s)
  ctx.storeCap = storeCap
  ctx.courierCap = courierCap
  return ok
}

// ------------------------------------------------------------------ per tick

/**
 * Production + dens + shrine for every alive building, in id order. Budget: O(buildings).
 *  - producers (BF_PRODUCER): recipe cycle per ARCHITECTURE.md §9.4, sets status
 *  - dens (BF_DEN): spawn couriers while typeCount[U_COURIER] < ctx.courierCap
 *  - shrine (BF_SHRINE): consume a full offering -> ctx.tier++, EV_TIER_UP / EV_WIN
 * Halls and towers are NOT handled here (combat.js).
 * @param {Ctx} ctx
 */
export function tickBuildings(ctx) {
  const pool = ctx.buildings
  const world = ctx.world
  const inv = pool.inv
  const hi = pool.hi
  const tick = ctx.tick
  for (let b = 0; b < hi; b++) {
    if (pool.alive[b] === 0) continue
    const type = pool.type[b]
    const f = B_FLAGS[type]
    if (f & BF_PRODUCER) {
      if (pool.paused[b]) { pool.status[b] = BS_PAUSED; continue }
      const out = B_OUT_ITEM[type]
      const outQty = P_OUT_QTY[type]
      const outCap = B_SLOT_CAP[(type << ITEM_SHIFT) | out]
      const ok = (b << ITEM_SHIFT) | out
      const ticks = P_TICKS[type]
      const extractor = f & BF_EXTRACTOR
      let p = pool.progress[b]
      if (p > ticks) p = ticks
      if (p === 0) {
        if (inv[ok] + outQty > outCap) { pool.status[b] = BS_OUTPUT_FULL; continue }
        if (extractor) {
          // depleted extractors re-scan only every 32 ticks (resources never regrow)
          if (pool.status[b] === BS_DEPLETED && ((tick + b) & 31) !== 0) continue
          const t = world.findResource(pool.tx[b], pool.ty[b], pool.w[b], pool.h[b], EX_REACH[type], EX_RES[type], pool.workTile[b])
          if (t < 0) { pool.status[b] = BS_DEPLETED; pool.workTile[b] = -1; continue }
          pool.workTile[b] = t
        } else {
          const n = IN_N[type]
          let starved = false
          for (let k = 0; k < n; k++) {
            const item = IN_ITEMS[type * 4 + k]
            if (inv[(b << ITEM_SHIFT) | item] < B_IN_QTY[(type << ITEM_SHIFT) | item]) { starved = true; break }
          }
          if (starved) { pool.status[b] = BS_STARVED; continue }
          for (let k = 0; k < n; k++) {
            const item = IN_ITEMS[type * 4 + k]
            takeItems(ctx, b, item, B_IN_QTY[(type << ITEM_SHIFT) | item], false)
          }
        }
        pool.progress[b] = 1
        pool.status[b] = BS_OK
        continue
      }
      if (p < ticks) { p++; pool.progress[b] = p }
      if (p >= ticks) {
        // Output space is checked BEFORE harvesting so a held cycle never harvests twice.
        if (inv[ok] + outQty > outCap) { pool.status[b] = BS_OUTPUT_FULL; continue } // hold at `ticks`
        if (extractor) {
          let wt = pool.workTile[b]
          if (wt < 0 || world.takeResource(wt, 1) === 0) {
            wt = world.findResource(pool.tx[b], pool.ty[b], pool.w[b], pool.h[b], EX_REACH[type], EX_RES[type], wt)
            pool.workTile[b] = wt
            if (wt < 0) { pool.status[b] = BS_DEPLETED; pool.progress[b] = 0 }
            continue // retry harvesting next tick
          }
        }
        addItems(ctx, b, out, outQty, false)
        pool.progress[b] = 0
        pool.status[b] = BS_OK
      }
      continue
    }
    if (f & BF_DEN) {
      if (pool.paused[b]) { pool.status[b] = BS_PAUSED; continue }
      if (ctx.units.typeCount[U_COURIER] >= ctx.courierCap) { pool.status[b] = BS_IDLE; pool.progress[b] = 0; continue }
      const ticks = DEN_TICKS[type]
      if (pool.progress[b] < ticks) pool.progress[b]++
      if (pool.progress[b] >= ticks) {
        if (!payCost(ctx, BUILDINGS[type].courierSpawn.cost)) { pool.status[b] = BS_NO_STOCK; continue }
        const door = pool.door[b]
        const u = spawnUnit(ctx, U_COURIER, (door & world.mask) + 0.5, (door >> world.shift) + 0.5)
        if (u >= 0) ctx.events.emit(EV_COURIER_SPAWNED, u, 0, tick)
        else refundCost(ctx, BUILDINGS[type].courierSpawn.cost, 1)
        pool.progress[b] = 0
      }
      pool.status[b] = BS_OK
      continue
    }
    if (f & BF_SHRINE) {
      if (ctx.won || ctx.tier >= WIN_TIER) { pool.status[b] = BS_IDLE; continue }
      const off = TIERS[ctx.tier].offering
      let full = true
      for (let k = 0; k < off.length; k++) {
        if (inv[(b << ITEM_SHIFT) | off[k].item] < off[k].qty) { full = false; break }
      }
      if (!full) { pool.status[b] = BS_STARVED; continue }
      for (let k = 0; k < off.length; k++) takeItems(ctx, b, off[k].item, off[k].qty, false)
      ctx.tier++
      ctx.events.emit(EV_TIER_UP, ctx.tier, 0, tick)
      if (ctx.tier >= WIN_TIER) {
        ctx.won = true
        ctx.events.emit(EV_WIN, 0, 0, tick)
        pool.status[b] = BS_IDLE
      } else pool.status[b] = BS_OK
    }
  }
}
