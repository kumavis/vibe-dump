// Building placement, inventories, production, storage/stock, dens, shrine tiers.
// OWNER: sim implementer. Contract: ARCHITECTURE.md §9.
//
// INVENTORY RULE: buildings.inv / resIn / resOut / invTotal / resInTotal and ctx.stock
// are written ONLY by the inventory helpers in this file (addItems, takeItems,
// reserveOut, releaseOut, reserveIn, releaseIn, payCost, refundCost, discardItems). Every
// other module calls these helpers. They keep ctx.stock in sync:
//   ctx.stock[item] = sum over alive, BUILT (site == 0) BF_STORAGE buildings of (inv - resOut)
//
// CONSTRUCTION SITES: a player placement (not {free}) allocates the building with
// pool.site[b] = 1. It occupies its footprint and door at once but has no behaviour (not a
// producer/storage/requester/tower/den/hall/shrine, no courierCap/storeCap). Logistics treats
// it as the highest-priority requester of its cost; when every cost item has been delivered
// into its own inventory it raises for SITE_RAISE_TICKS, consumes the items and becomes the
// real building (completeSite).

import {
  BUILDING_COUNT, ITEM_SHIFT, ITEM_STRIDE, ITEM_COUNT, CHUNK_SHIFT, CHUNK,
  BF_STORAGE, BF_PRODUCER, BF_EXTRACTOR, BF_DEN, BF_SHRINE, BF_CORE,
  BS_OK, BS_STARVED, BS_OUTPUT_FULL, BS_DEPLETED, BS_PAUSED, BS_NO_STOCK, BS_IDLE,
  P_OK, P_BLOCKED, P_DOOR, P_NO_RESOURCE, P_TIER, P_UNIQUE, P_NOT_BUILDABLE, P_OOB, P_ENCLOSE,
  U_COURIER, FX_BUILD, FX_DESTROY, B_SPRITE_DEN, SITE_HP_FRAC, SITE_RAISE_TICKS,
  EV_BUILDING_LOST, EV_TIER_UP, EV_WIN, EV_LOSE, EV_COURIER_SPAWNED, EV_BUILDING_BUILT,
} from './constants.js'
import {
  BUILDINGS, TIERS, WIN_TIER, B_FLAGS, B_STORAGE, B_TIER, B_OUT_ITEM, B_SLOT_CAP, B_IN_QTY, B_W, B_H, B_HP,
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
/** construction cost per (type, item): SITE_QTY[(type << ITEM_SHIFT) | item] */
const SITE_QTY = new Int32Array(BUILDING_COUNT * ITEM_STRIDE)
/** cost items per type: SITE_ITEMS[type*4 + k], k < SITE_N[type]; SITE_TOTAL = sum of qty */
const SITE_ITEMS = new Uint8Array(BUILDING_COUNT * 4)
const SITE_N = new Uint8Array(BUILDING_COUNT)
const SITE_TOTAL = new Int32Array(BUILDING_COUNT)
for (let t = 1; t < BUILDING_COUNT; t++) {
  const d = BUILDINGS[t]
  for (const e of d.cost) {
    const k = (t << ITEM_SHIFT) | e.item
    if (SITE_QTY[k] === 0) SITE_ITEMS[t * 4 + SITE_N[t]++] = e.item
    SITE_QTY[k] += e.qty
    SITE_TOTAL[t] += e.qty
  }
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
/** Number of distinct cost items of a building type (construction-site requests). */
export function siteCostCount(type) { return SITE_N[type] }
/** k-th cost item of a building type. */
export function siteCostItem(type, k) { return SITE_ITEMS[type * 4 + k] }
/** Construction cost qty of `item` for a building type (0 if not in the cost). */
export function siteCostQty(type, item) { return SITE_QTY[(type << ITEM_SHIFT) | item] }
/**
 * Construction progress of site b in [0, 1]: delivered share of the cost while materials
 * arrive (0..0.9), then the raise timer (0.9..1). 1 for built buildings. Pure.
 */
export function siteProgress(ctx, b) {
  const pool = ctx.buildings
  if (!pool.site[b]) return 1
  const type = pool.type[b]
  const total = SITE_TOTAL[type]
  let have = 0
  for (let k = 0; k < SITE_N[type]; k++) {
    const item = SITE_ITEMS[type * 4 + k]
    const q = SITE_QTY[(type << ITEM_SHIFT) | item]
    const n = pool.inv[(b << ITEM_SHIFT) | item]
    have += n < q ? n : q
  }
  const deliv = total > 0 ? have / total : 1
  if (deliv < 1) return deliv * 0.9
  return 0.9 + 0.1 * (pool.progress[b] / SITE_RAISE_TICKS)
}

/** Offering qty needed for `item` to advance from `tier` (0 if none). */
export function offeringQty(tier, item) { return tier >= 0 && tier < TIERS.length ? OFFER_QTY[(tier << ITEM_SHIFT) | item] : 0 }

/** Hearth rescue couriers: spawned free while fewer than RESCUE_MIN couriers are alive. */
const RESCUE_MIN = 4 // enough to restart a stalled economy after a wave cuts through the swarm
const RESCUE_TICKS = 200
const DEN_COST = BUILDINGS[B_SPRITE_DEN].courierSpawn.cost
/** Dens hold off while more than this many couriers stand idle (and > 1/IDLE_SHARE of all). */
const DEN_IDLE_MIN = 3
const DEN_IDLE_SHARE = 4

// Building currently being destroyed: refundCost must not deposit into it.
let dyingBuilding = -1

// ------------------------------------------------------------------ placement

/**
 * Validate a placement. Checks in this order and returns the first failure:
 * P_NOT_BUILDABLE (only when opts.free is false), P_TIER, P_UNIQUE, P_OOB, P_BLOCKED
 * (world.areaFree), P_DOOR (door tile in bounds, walkable, not inside the footprint),
 * P_NO_RESOURCE (extractor: world.countResource(...) === 0), P_ENCLOSE (unless opts.free).
 * Cost is NOT checked: a player placement becomes a construction site that couriers supply.
 * Pure: no side effects. O(footprint + reach area).
 * @param {Ctx} ctx
 * @param {number} type B_*
 * @param {number} tx footprint top-left
 * @param {number} ty
 * @param {{free?:boolean}} [opts] free: skip tier/buildable/enclosure checks and build instantly (start hamlet, stress, tests)
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
  if (!free && wouldEnclose(world, tx, ty, w, h, door)) return P_ENCLOSE
  return P_OK
}

// ------------------------------------------------------------------ enclosure check
// A footprint can cut a door off from the rest of the map (doors themselves are protected,
// the corridor to them is not). Before placement every walkable tile orthogonally beside the
// footprint is connected THROUGH it, so the placement disconnects something iff the tiles
// around it fall into more than one component afterwards. We flood-fill (4-connected, which
// equals the pathfinder's 8-connected no-corner-cut rule) inside a window of ENC_R tiles
// around the footprint; a component that reaches an interior window edge counts as open.
// Reject when a closed component holds a door (an existing one or the new building's).
// Pockets larger than the window and bridges cut between two open sides are not detected.
const ENC_R = 12
const ENC_MAX = (2 * ENC_R + 4) * (2 * ENC_R + 4)
const encStamp = new Uint32Array(ENC_MAX)
const encQueue = new Int32Array(ENC_MAX)
let encGen = 0

function wouldEnclose(world, tx, ty, w, h, newDoor) {
  const x0 = tx - ENC_R > 0 ? tx - ENC_R : 0, y0 = ty - ENC_R > 0 ? ty - ENC_R : 0
  const x1 = tx + w + ENC_R < world.w ? tx + w + ENC_R : world.w // exclusive
  const y1 = ty + h + ENC_R < world.h ? ty + h + ENC_R : world.h
  const ww = x1 - x0
  // edges of the window that lie inside the map lead somewhere; map edges do not
  const openL = x0 > 0, openT = y0 > 0, openR = x1 < world.w, openB = y1 < world.h
  const pass = world.pass, doorCount = world.doorCount, shift = world.shift
  // stamps: base+1.. = component ids of this call; footprint tiles are excluded by bounds test
  if (encGen > 0xfffff000) { encStamp.fill(0); encGen = 0 }
  const base = encGen
  let comps = 0, closedDoor = false, open = 0
  // seeds: the four sides of the footprint (corners excluded), door first
  const seeds = 2 * (w + h)
  for (let s = -1; s < seeds; s++) {
    let sx, sy
    if (s < 0) { sx = (newDoor & world.mask); sy = newDoor >> shift }
    else if (s < w) { sx = tx + s; sy = ty - 1 }
    else if (s < 2 * w) { sx = tx + s - w; sy = ty + h }
    else if (s < 2 * w + h) { sx = tx - 1; sy = ty + s - 2 * w }
    else { sx = tx + w; sy = ty + s - 2 * w - h }
    if (sx < x0 || sy < y0 || sx >= x1 || sy >= y1) continue
    const si = (sy << shift) | sx
    if (pass[si] !== 1) continue
    const sl = (sy - y0) * ww + (sx - x0)
    if (encStamp[sl] > base) continue
    const id = base + ++comps
    encStamp[sl] = id
    let head = 0, tail = 0
    encQueue[tail++] = sl
    let reachesEdge = false, hasDoor = false
    while (head < tail) {
      const l = encQueue[head++]
      const lx = l % ww, ly = (l - lx) / ww
      const x = lx + x0, y = ly + y0
      const i = (y << shift) | x
      if (doorCount[i] > 0 || i === newDoor) hasDoor = true
      if ((lx === 0 && openL) || (ly === 0 && openT) || (x === x1 - 1 && openR) || (y === y1 - 1 && openB)) reachesEdge = true
      // 4 neighbours inside the window, walkable, not the footprint
      for (let k = 0; k < 4; k++) {
        const nx = k === 0 ? x - 1 : k === 1 ? x + 1 : x
        const ny = k === 2 ? y - 1 : k === 3 ? y + 1 : y
        if (nx < x0 || ny < y0 || nx >= x1 || ny >= y1) continue
        if (nx >= tx && nx < tx + w && ny >= ty && ny < ty + h) continue
        if (pass[(ny << shift) | nx] !== 1) continue
        const nl = (ny - y0) * ww + (nx - x0)
        if (encStamp[nl] > base) continue
        encStamp[nl] = id
        encQueue[tail++] = nl
      }
    }
    if (reachesEdge) open++
    else if (hasDoor) closedDoor = true
  }
  encGen = base + comps
  // one component (open or a whole small island) = nothing was split
  return comps > 1 && closedDoor
}

/**
 * Place a building: canPlace -> pool.alloc -> set tx/ty/door -> world.occupy ->
 * pool.linkChunk -> logistics.registerBuilding -> fx FX_BUILD.
 *  - opts.free (start hamlet, stress, tests): built at once — ctx.courierCap += courierCap,
 *    BF_STORAGE: ctx.storeCap += storage.
 *  - otherwise: a CONSTRUCTION SITE (pool.site[b] = 1, hp = B_HP * SITE_HP_FRAC, status
 *    BS_STARVED). Nothing is paid; logistics delivers the cost into the site and
 *    tickBuildings completes it (completeSite).
 * @param {Ctx} ctx
 * @returns {number} building id, or -1 if canPlace failed (nothing changed)
 */
export function placeBuilding(ctx, type, tx, ty, opts) {
  tx |= 0; ty |= 0
  if (canPlace(ctx, type, tx, ty, opts) !== P_OK) return -1
  const pool = ctx.buildings
  if (pool.count >= pool.capacity) return -1
  const free = !!(opts && opts.free)
  const b = pool.alloc(type)
  if (b < 0) return -1
  const world = ctx.world
  pool.tx[b] = tx
  pool.ty[b] = ty
  const door = world.doorTile(type, tx, ty)
  pool.door[b] = door
  world.occupy(tx, ty, B_W[type], B_H[type], b, door)
  pool.linkChunk(b, world.chunkOfXY(tx, ty))
  if (free) {
    ctx.courierCap += T_COURIER_CAP[type]
    if (B_FLAGS[type] & BF_STORAGE) ctx.storeCap += B_STORAGE[type]
  } else {
    pool.site[b] = 1
    pool.hp[b] = B_HP[type] * SITE_HP_FRAC
    pool.status[b] = BS_STARVED
  }
  registerBuilding(ctx, b)
  const cx = tx + B_W[type] * 0.5, cy = ty + B_H[type] * 0.5
  ctx.fx.emit(FX_BUILD, cx, cy, cx, cy, ctx.tick)
  return b
}

/**
 * Turn a site whose cost has fully arrived into the real building: consume the delivered
 * cost, clear site, top HP up by the missing (1 - SITE_HP_FRAC) share (damage taken stays),
 * apply courierCap / storeCap, re-index it in logistics as what it now is, FX_BUILD +
 * EV_BUILDING_BUILT(type, door).
 */
function completeSite(ctx, b) {
  const pool = ctx.buildings
  const type = pool.type[b]
  const o = b << ITEM_SHIFT
  for (let k = 0; k < SITE_N[type]; k++) {
    const item = SITE_ITEMS[type * 4 + k]
    takeItems(ctx, b, item, SITE_QTY[(type << ITEM_SHIFT) | item], false)
  }
  unregisterBuilding(ctx, b) // leaves the site list
  pool.site[b] = 0
  pool.progress[b] = 0
  pool.status[b] = BS_OK
  // anything left over (only if more than the cost arrived) now belongs to the building
  if (B_FLAGS[type] & BF_STORAGE) {
    for (let i = 1; i < ITEM_COUNT; i++) ctx.stock[i] += pool.inv[o + i] - pool.resOut[o + i]
  }
  const max = B_HP[type]
  let hp = pool.hp[b] + max * (1 - SITE_HP_FRAC)
  if (hp > max) hp = max
  pool.hp[b] = hp
  ctx.courierCap += T_COURIER_CAP[type]
  if (B_FLAGS[type] & BF_STORAGE) ctx.storeCap += B_STORAGE[type]
  registerBuilding(ctx, b)
  const cx = pool.tx[b] + B_W[type] * 0.5, cy = pool.ty[b] + B_H[type] * 0.5
  ctx.fx.emit(FX_BUILD, cx, cy, cx, cy, ctx.tick)
  ctx.events.emit(EV_BUILDING_BUILT, type, pool.door[b], ctx.tick)
}

/**
 * Remove a building from the world. Order: logistics.unregisterBuilding ->
 * refund -> if storage: subtract its (inv - resOut) from ctx.stock and its capacity from
 * ctx.storeCap -> ctx.courierCap -= courierCap -> world.vacate -> pool.free.
 * Refund: a built building gets `refundFrac` of its cost (floor per item, refundCost) and, on
 * player demolition (not `killed`), ALL of its own unreserved inventory (outputs, inputs, a
 * Storehouse's contents) moved to other storage; a construction SITE gets `refundFrac` of what
 * was DELIVERED into it so far (no caps to undo). With refundFrac 0 or `killed`, contents are
 * lost.
 * Refunds never vanish: storage without room is overfilled (see refundCost). ctx.lastRefund
 * holds what came back (HUD toast).
 * If `killed`: fx FX_DESTROY + event EV_BUILDING_LOST; if BF_CORE: ctx.lost = true + EV_LOSE.
 * Couriers/units referencing it notice lazily through the generation check (a courier
 * carrying cargo for it reroutes to storage).
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
  const site = pool.site[b] !== 0
  unregisterBuilding(ctx, b)
  ctx.lastRefund.fill(0)
  if (refundFrac > 0) {
    dyingBuilding = b
    if (site) {
      const o = b << ITEM_SHIFT
      for (let i = 1; i < ITEM_COUNT; i++) {
        const q = Math.floor(pool.inv[o + i] * refundFrac)
        if (q > 0) ctx.lastRefund[i] += refundItem(ctx, i, q)
      }
    } else {
      refundCost(ctx, BUILDINGS[type].cost, refundFrac)
      // a demolished building's own stock (outputs, crafter inputs, a Storehouse's contents)
      // goes back to storage in full rather than vanishing; items reserved for an in-flight
      // pickup are dropped with the building (that courier's job aborts)
      if (!killed) {
        const o = b << ITEM_SHIFT
        for (let i = 1; i < ITEM_COUNT; i++) {
          const q = pool.inv[o + i] - pool.resOut[o + i]
          if (q > 0) ctx.lastRefund[i] += refundItem(ctx, i, q)
        }
      }
    }
    dyingBuilding = -1
  }
  if (!site) {
    if (flags & BF_STORAGE) {
      const o = b << ITEM_SHIFT
      const stock = ctx.stock
      for (let i = 1; i < ITEM_COUNT; i++) stock[i] -= pool.inv[o + i] - pool.resOut[o + i]
      ctx.storeCap -= B_STORAGE[type]
    }
    ctx.courierCap -= T_COURIER_CAP[type]
  }
  pool.site[b] = 0
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
 * Player demolition: 50% refund of the cost. Refuses the Hearth. On a construction site this
 * is "cancel": 100% of what was delivered comes back. ctx.lastRefund holds the refund.
 * @returns {boolean} true if demolished
 */
export function demolishBuilding(ctx, b) {
  const pool = ctx.buildings
  if (b < 0 || b >= pool.capacity || !pool.alive[b]) return false
  if (B_FLAGS[pool.type[b]] & BF_CORE) return false
  destroyBuilding(ctx, b, pool.site[b] ? 1 : 0.5, false)
  return true
}

/**
 * Destroy up to `qty` (default: all) of the UNRESERVED part (inv - resOut) of `item` in b.
 * Items promised to an in-flight courier job are never touched. Keeps inv, invTotal and
 * ctx.stock consistent (it is takeItems without a destination). Works on storage, producer
 * inputs/outputs, sites and the shrine. Status flags (output full, starved) are recomputed by
 * the next tickBuildings.
 * @returns {number} quantity destroyed
 */
export function discardItems(ctx, b, item, qty) {
  const pool = ctx.buildings
  if (b < 0 || b >= pool.capacity || !pool.alive[b]) return 0
  if (!(item >= 1 && item < ITEM_COUNT)) return 0
  const k = (b << ITEM_SHIFT) | item
  const avail = pool.inv[k] - pool.resOut[k]
  const q = qty == null || qty > avail ? avail : qty | 0
  return takeItems(ctx, b, item, q, false)
}

// ------------------------------------------------------------------ inventory helpers

/**
 * Put items into b. If fromReserved, consumes `qty` of resIn first (courier drop-off of a
 * reserved job) and always succeeds; otherwise clamps to freeSpaceIn-style capacity
 * (site: cost qty - inv - resIn; storage: storage - invTotal - resInTotal; others: slot
 * cap - inv - resIn for that item, output slots included), unless `overflow` is set: then
 * everything is added even past capacity (refunds overfill storage rather than vanish;
 * logistics stops delivering to it until it drains below capacity).
 * Updates invTotal, resInTotal and ctx.stock when (built) storage.
 * @returns {number} quantity actually added
 */
export function addItems(ctx, b, item, qty, fromReserved, overflow) {
  if (qty <= 0) return 0
  const pool = ctx.buildings
  const k = (b << ITEM_SHIFT) | item
  const type = pool.type[b]
  const site = pool.site[b]
  const storage = (B_FLAGS[type] & BF_STORAGE) && !site
  let q = qty
  if (fromReserved) {
    let r = pool.resIn[k]
    if (r > q) r = q
    pool.resIn[k] -= r
    pool.resInTotal[b] -= r
  } else if (!overflow) {
    const space = site
      ? SITE_QTY[(type << ITEM_SHIFT) | item] - pool.inv[k] - pool.resIn[k]
      : storage
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
  const storage = (B_FLAGS[pool.type[b]] & BF_STORAGE) && !pool.site[b]
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
  if ((B_FLAGS[pool.type[b]] & BF_STORAGE) && !pool.site[b]) ctx.stock[item] -= qty
}
/** resOut -= qty. Storage: ctx.stock[item] += qty. */
export function releaseOut(ctx, b, item, qty) {
  const pool = ctx.buildings
  const k = (b << ITEM_SHIFT) | item
  if (qty > pool.resOut[k]) qty = pool.resOut[k]
  if (qty <= 0) return
  pool.resOut[k] -= qty
  if ((B_FLAGS[pool.type[b]] & BF_STORAGE) && !pool.site[b]) ctx.stock[item] += qty
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
 *  - construction site: cost qty of item - inv - resIn (0 for items not in the cost)
 *  - BF_STORAGE: storage - invTotal - resInTotal (any item; negative while overfilled)
 *  - BF_SHRINE: (TIERS[ctx.tier].offering qty for item) - inv - resIn, 0 if not in the offering or won
 *  - recipe input item: B_SLOT_CAP - inv - resIn
 *  - anything else (outputs, non-inputs): 0
 */
export function freeSpaceIn(ctx, b, item) {
  const pool = ctx.buildings
  const type = pool.type[b]
  const f = B_FLAGS[type]
  if (pool.site[b]) {
    const kk = (b << ITEM_SHIFT) | item
    return SITE_QTY[(type << ITEM_SHIFT) | item] - pool.inv[kk] - pool.resIn[kk]
  }
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
 * Deduct cost from (built) storage buildings (Hearth typeList first, then Storehouses in
 * typeList order), unreserved items only. All-or-nothing. Used by dens and training;
 * buildings are no longer paid this way (construction sites).
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
      for (let j = 0; j < n && left > 0; j++) {
        if (pool.site[list[j]]) continue
        left -= takeItems(ctx, list[j], item, left, false)
      }
    }
  }
  return true
}

/**
 * Put `qty` of `item` back into storage, never losing any: first into built storage with free
 * room (Hearth first, then Storehouses, typeList order), then whatever is left OVERFILLS the
 * first built storage in that order (the Hearth) past its capacity. Skips the building being
 * destroyed. Lost only when no built storage exists at all.
 * @returns {number} quantity stored
 */
function refundItem(ctx, item, qty) {
  const pool = ctx.buildings
  let left = qty
  let total = 0
  let first = -1
  for (let s = 0; s < STORAGE_TYPES.length && left > 0; s++) {
    const t = STORAGE_TYPES[s]
    const list = pool.typeList[t]
    const n = pool.typeCount[t]
    for (let j = 0; j < n && left > 0; j++) {
      const b = list[j]
      if (b === dyingBuilding || pool.site[b]) continue
      if (first < 0) first = b
      const q = addItems(ctx, b, item, left, false)
      left -= q
      total += q
    }
  }
  if (left > 0 && first >= 0) total += addItems(ctx, first, item, left, false, true)
  return total
}

/**
 * Add floor(qty * frac) of each cost entry into storage (refundItem: free room first, then
 * overfill the Hearth — refunds never vanish). Records what came back in ctx.lastRefund
 * (reset first). @returns {number} total items refunded
 */
export function refundCost(ctx, cost, frac) {
  ctx.lastRefund.fill(0)
  if (!cost || !(frac > 0)) return 0
  let total = 0
  for (let i = 0; i < cost.length; i++) {
    const item = cost[i].item
    const q = refundItem(ctx, item, Math.floor(cost[i].qty * frac))
    ctx.lastRefund[item] += q
    total += q
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
 * Walkable tile from which an attacker standing at `fromTile` can hit building b: the door
 * when it is in fromTile's region, else the ring tile (any of the 8-neighbourhood ring around
 * the footprint) in that region nearest to fromTile. -1 when no side of b is reachable.
 * O(footprint perimeter); region lookups are O(1).
 */
export function buildingApproach(ctx, b, fromTile) {
  const pool = ctx.buildings
  const world = ctx.world
  const path = ctx.path
  const door = pool.door[b]
  if (door >= 0 && world.pass[door] === 1 && path.sameRegion(door, fromTile)) return door
  const tx = pool.tx[b], ty = pool.ty[b], w = pool.w[b], h = pool.h[b]
  const fx = fromTile & world.mask, fy = fromTile >> world.shift
  const pass = world.pass, shift = world.shift
  let best = -1, bestD = 0x7fffffff
  for (let y = ty - 1; y <= ty + h; y++) {
    if (y < 0 || y >= world.h) continue
    const edgeRow = y === ty - 1 || y === ty + h
    for (let x = tx - 1; x <= tx + w; x += edgeRow ? 1 : w + 1) {
      if (x < 0 || x >= world.w) continue
      const i = (y << shift) | x
      if (pass[i] !== 1) continue
      const d = (x > fx ? x - fx : fx - x) + (y > fy ? y - fy : fy - y)
      if (d >= bestD) continue
      if (!path.sameRegion(i, fromTile)) continue
      best = i; bestD = d
    }
  }
  return best
}

/** True if tile i lies on the 1-tile ring around building b's footprint. Pure, O(1). */
export function onBuildingRing(ctx, b, i) {
  const pool = ctx.buildings
  const x = i & ctx.world.mask, y = i >> ctx.world.shift
  const tx = pool.tx[b], ty = pool.ty[b], w = pool.w[b], h = pool.h[b]
  if (x < tx - 1 || y < ty - 1 || x > tx + w || y > ty + h) return false
  return x === tx - 1 || y === ty - 1 || x === tx + w || y === ty + h
}

/**
 * Nearest alive building (by distance from (x,y) to its footprint rect) whose type flags
 * intersect `flagMask` (0 = any), searching chunk rings out to `maxChunks`. Ties -> lower id.
 * Used by waves (raid targets), combat (blight building targets), logistics (fallback storage).
 * With `fromTile` >= 0 only buildings an attacker at fromTile can reach (buildingApproach)
 * count; the check runs only for candidates that would become the best.
 * @param {number} x world tile units
 * @param {number} y
 * @param {number} [fromTile=-1]
 * @returns {number} id or -1
 */
export function nearestBuilding(ctx, x, y, maxChunks, flagMask, fromTile = -1) {
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
            if (d2 < bestD2 || (d2 === bestD2 && b < best)) {
              if (fromTile >= 0 && buildingApproach(ctx, b, fromTile) < 0) continue
              best = b; bestD2 = d2
            }
          }
        }
        if (step === 0) break
      }
    }
  }
  return best
}

/** Toggle player pause on a building (no-op on construction sites). */
export function setPaused(ctx, b, on) {
  const pool = ctx.buildings
  if (b < 0 || b >= pool.capacity || !pool.alive[b] || pool.site[b]) return
  pool.paused[b] = on ? 1 : 0
  if (on) pool.status[b] = BS_PAUSED
  else if (pool.status[b] === BS_PAUSED) pool.status[b] = BS_OK
}

const recomputeScratch = new Int32Array(ITEM_STRIDE)

/**
 * Recompute ctx.stock / storeCap / courierCap from scratch (debug + tests):
 * courierCap = ctx.courierCapExtra + sum of BUILDINGS[type].courierCap over alive BUILT
 * buildings (construction sites contribute nothing).
 * @returns {boolean} true if the incremental values already matched
 */
export function recomputeStock(ctx) {
  const pool = ctx.buildings
  const s = recomputeScratch
  s.fill(0)
  let storeCap = 0
  let courierCap = ctx.courierCapExtra | 0
  for (let b = 0; b < pool.hi; b++) {
    if (!pool.alive[b] || pool.site[b]) continue
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

/** True if at least one BUILT Sprite Den exists (a den site makes no couriers). */
function builtDen(pool) {
  const list = pool.typeList[B_SPRITE_DEN]
  for (let j = 0, n = pool.typeCount[B_SPRITE_DEN]; j < n; j++) if (!pool.site[list[j]]) return true
  return false
}

/**
 * Production + dens + shrine for every alive building, in id order. Budget: O(buildings).
 *  - construction sites: wait for the whole cost (BS_STARVED), then raise for
 *    SITE_RAISE_TICKS (BS_OK, progress counts up) and completeSite
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
  const site = pool.site
  for (let b = 0; b < hi; b++) {
    if (pool.alive[b] === 0) continue
    const type = pool.type[b]
    if (site[b]) {
      let ready = true
      const n = SITE_N[type]
      for (let k = 0; k < n; k++) {
        const item = SITE_ITEMS[type * 4 + k]
        if (inv[(b << ITEM_SHIFT) | item] < SITE_QTY[(type << ITEM_SHIFT) | item]) { ready = false; break }
      }
      if (!ready) { pool.status[b] = BS_STARVED; pool.progress[b] = 0; continue }
      pool.status[b] = BS_OK
      if (++pool.progress[b] >= SITE_RAISE_TICKS) completeSite(ctx, b)
      continue
    }
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
      const nc = ctx.units.typeCount[U_COURIER]
      if (nc >= ctx.courierCap) { pool.status[b] = BS_IDLE; pool.progress[b] = 0; continue }
      // plenty of couriers standing around: don't spend planks on more
      const idle = ctx.log ? ctx.log.idleCount : 0
      if (idle > DEN_IDLE_MIN && idle * DEN_IDLE_SHARE > nc) { pool.status[b] = BS_IDLE; continue }
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
    if (f & BF_CORE) {
      // Rescue: Dens pay planks FROM STORAGE, and only couriers fill storage. If a raid wipes
      // out the swarm while storage is short of planks, nothing could ever move again. The
      // Hearth therefore coaxes out a free courier every RESCUE_TICKS while fewer than
      // RESCUE_MIN are alive.
      const n = ctx.units.typeCount[U_COURIER]
      if (n < RESCUE_MIN && n < ctx.courierCap && (!builtDen(pool) || !canAfford(ctx, DEN_COST))) {
        ctx.rescueTimer = (ctx.rescueTimer | 0) + 1
        if (ctx.rescueTimer >= RESCUE_TICKS) {
          ctx.rescueTimer = 0
          const door = pool.door[b]
          const u = spawnUnit(ctx, U_COURIER, (door & world.mask) + 0.5, (door >> world.shift) + 0.5)
          if (u >= 0) ctx.events.emit(EV_COURIER_SPAWNED, u, 0, tick)
        }
      } else ctx.rescueTimer = 0
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
