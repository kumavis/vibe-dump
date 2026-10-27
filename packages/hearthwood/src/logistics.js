// Incremental logistics scheduler + courier job state machine.
// OWNER: sim implementer. Contract: ARCHITECTURE.md §10.
//
// Indexes (all typed arrays, built incrementally by register/unregisterBuilding):
//   reqList/reqPos     dense list of BF_REQUESTER buildings (round-robin pull cursor)
//   provList/provPos   dense list of BF_PRODUCER buildings (round-robin push cursor)
//   provider buckets   per (item, chunk of the DOOR tile) doubly-linked lists of producers
//                      whose B_OUT_ITEM is that item: pHead[(chunk << ITEM_SHIFT) | item]
//   storage buckets    per chunk of the DOOR tile, doubly-linked lists of BF_STORAGE buildings
//   idleGrid/idleList  idle couriers, rebuilt every tick by the courier state machine
//
// Per tick (tickLogistics): courier FSM over every courier (ascending id), then the
// pull pass (≤ LOG_REQ_PER_TICK requester visits), then the push pass
// (≤ LOG_PUSH_PER_TICK producer visits). Every job reserves stock at the provider
// (resOut) and space at the requester (resIn) at assignment, and takes
// min(availableOut, freeSpaceIn), so nothing can be oversubscribed.

import {
  MAX_BUILDINGS, MAX_UNITS, UNIT_CELL_SHIFT, ITEM_SHIFT, ITEM_STRIDE, CHUNK, CHUNK_SHIFT,
  BF_STORAGE, BF_PRODUCER, BF_REQUESTER, BF_SHRINE,
  U_COURIER, M_IDLE, M_ARRIVED, M_FAILED,
  J_NONE, J_TO_PICKUP, J_PICKING, J_TO_DROPOFF, J_DROPPING,
  COURIER_CAP, LOG_REQ_PER_TICK, LOG_PUSH_PER_TICK, LOG_RADIUS_CHUNKS, IDLE_RADIUS_CELLS,
  PICK_TICKS, DROP_TICKS,
} from './constants.js'
import { B_FLAGS, B_OUT_ITEM, B_SLOT_CAP, B_IN_QTY, TIERS, WIN_TIER, ITEMS, BUILDINGS } from './content.js'
import { CellGrid } from './world.js'
import {
  addItems, takeItems, reserveOut, releaseOut, reserveIn, releaseIn, availableOut, freeSpaceIn,
  recipeInputCount, recipeInputItem,
} from './buildings.js'
import { orderMove, stopUnit } from './units.js'

/** @typedef {import('./context.js').Ctx} Ctx */

// Shrine offering items per tier, flattened: OFFER_ITEMS[tier*4 + k], k < OFFER_N[tier].
const OFFER_ITEMS = new Uint8Array(TIERS.length * 4)
const OFFER_N = new Uint8Array(TIERS.length)
for (let t = 0; t < TIERS.length; t++) {
  const off = TIERS[t].offering
  if (!off) continue
  OFFER_N[t] = off.length
  for (let k = 0; k < off.length; k++) OFFER_ITEMS[t * 4 + k] = off[k].item
}

/** Score penalty for a provider that cannot fill the whole load. */
const PARTIAL_PENALTY = 64

/**
 * Construction reserve for RAW items that buildings cost (heartwood, mossstone). Without it
 * the starting Sawmill (30 logs/min) out-eats the starting Lumber Lodge (24/min), turns every
 * log in the Hearth into planks and the player can never afford anything that costs wood.
 *  - while stored stock is below the reserve, crafters do not pull that item at all, so
 *    producers' output flows to storage (push pass) until the reserve is back;
 *  - crafters never pull it out of storage below the reserve.
 * Shrine offerings are exempt.
 */
export const CRAFT_RESERVE = new Int32Array(ITEM_STRIDE)
for (let t = 1; t < BUILDINGS.length; t++) {
  for (const e of BUILDINGS[t].cost) if (ITEMS[e.item].raw) CRAFT_RESERVE[e.item] = 40
}

/** Push any producer holding a courier load once idle couriers exceed this share (1/n). */
const IDLE_SHARE = 4

/**
 * Logistics state, ctx.log. Public READ-ONLY fields for HUD/__hw: jobCount, idleCount,
 * busyCount, stats. Everything else is private to logistics.js (prefix-free names are
 * fine, but no other module may read them).
 * @typedef {Object} LogisticsState
 * @property {number} jobCount     couriers with job !== J_NONE
 * @property {number} idleCount    couriers with job === J_NONE (as of this tick's rebuild)
 * @property {number} busyCount    = jobCount
 * @property {CellGrid} idleGrid   idle couriers, rebuilt each tick in tickLogistics
 * @property {{assigned:number, pullVisits:number, pushVisits:number, aborted:number, providerScans:number}} stats  per-tick counters (reset each tick)
 */

/**
 * Allocate logistics state for a world. Must not throw and must not touch ctx fields
 * other than reading ctx.world sizes (createContext calls it before pools are filled).
 * @param {Ctx} ctx
 * @returns {LogisticsState}
 */
export function createLogistics(ctx) {
  const w = ctx.world
  const maxB = ctx.buildings ? ctx.buildings.capacity : MAX_BUILDINGS
  const maxU = ctx.units ? ctx.units.capacity : MAX_UNITS
  const chunkCount = w.chunkCount
  return {
    jobCount: 0,
    idleCount: 0,
    busyCount: 0,
    idleGrid: new CellGrid(w.w, w.h, UNIT_CELL_SHIFT, maxU),
    /** per-tick counters (reset at the start of tickLogistics) + cumulative totals */
    stats: {
      assigned: 0, pullVisits: 0, pushVisits: 0, aborted: 0, providerScans: 0, rerouted: 0, lost: 0, delivered: 0,
      totalAssigned: 0, totalDelivered: 0, totalAborted: 0, totalLost: 0,
    },
    _maxBuildings: maxB,
    // requester round-robin
    reqList: new Int32Array(maxB),
    reqPos: new Int32Array(maxB).fill(-1),
    reqCount: 0,
    reqCursor: 0,
    // producer round-robin (push pass)
    provList: new Int32Array(maxB),
    provPos: new Int32Array(maxB).fill(-1),
    provCount: 0,
    provCursor: 0,
    // provider buckets: key = (chunk << ITEM_SHIFT) | item
    pHead: new Int32Array(chunkCount * ITEM_STRIDE).fill(-1),
    pNext: new Int32Array(maxB).fill(-1),
    pPrev: new Int32Array(maxB).fill(-1),
    pKey: new Int32Array(maxB).fill(-1),
    // storage buckets: key = door chunk
    sHead: new Int32Array(chunkCount).fill(-1),
    sNext: new Int32Array(maxB).fill(-1),
    sPrev: new Int32Array(maxB).fill(-1),
    sKey: new Int32Array(maxB).fill(-1),
    storageCount: 0,
    // per storage chunk: largest freeSpaceIn of its storages, rebuilt once per tick before the
    // push pass (an upper bound during the pass: reservations only shrink free space)
    sChunkFree: new Int32Array(chunkCount),
    // idle couriers this tick (ascending id)
    idleList: new Int32Array(maxU),
    idleListLen: 0,
    idleScan: 0,
    // grid query scratch (a single cell can hold many idle couriers)
    scratch: new Int32Array(maxU),
  }
}

// ------------------------------------------------------------------ indexes

/**
 * Index a freshly placed building: requester round-robin list (BF_REQUESTER), push list
 * (BF_PRODUCER), per-item provider chunk buckets (recipe output item, keyed by the DOOR
 * tile's chunk), storage chunk buckets (BF_STORAGE). Called by buildings.placeBuilding.
 * O(1).
 */
export function registerBuilding(ctx, b) {
  const L = ctx.log
  const pool = ctx.buildings
  const type = pool.type[b]
  const f = B_FLAGS[type]
  const door = pool.door[b]
  const chunk = door >= 0 ? ctx.world.chunkOf(door) : pool.chunk[b]
  if ((f & BF_REQUESTER) && L.reqPos[b] < 0) {
    L.reqPos[b] = L.reqCount
    L.reqList[L.reqCount++] = b
  }
  if ((f & BF_PRODUCER) && L.provPos[b] < 0) {
    L.provPos[b] = L.provCount
    L.provList[L.provCount++] = b
    const item = B_OUT_ITEM[type]
    if (item > 0 && chunk >= 0 && L.pKey[b] < 0) {
      const key = (chunk << ITEM_SHIFT) | item
      const head = L.pHead[key]
      L.pNext[b] = head
      L.pPrev[b] = -1
      if (head >= 0) L.pPrev[head] = b
      L.pHead[key] = b
      L.pKey[b] = key
    }
  }
  if ((f & BF_STORAGE) && chunk >= 0 && L.sKey[b] < 0) {
    const head = L.sHead[chunk]
    L.sNext[b] = head
    L.sPrev[b] = -1
    if (head >= 0) L.sPrev[head] = b
    L.sHead[chunk] = b
    L.sKey[b] = chunk
    L.storageCount++
  }
}

/**
 * Remove a building from every index. Called by buildings.destroyBuilding BEFORE the
 * slot is freed. O(1) amortised (O(bucket length) for bucket unlink is acceptable).
 * Does NOT scan couriers: jobs referencing b are repaired lazily (gen check).
 */
export function unregisterBuilding(ctx, b) {
  const L = ctx.log
  let pos = L.reqPos[b]
  if (pos >= 0) {
    const last = L.reqList[--L.reqCount]
    L.reqList[pos] = last
    L.reqPos[last] = pos
    L.reqPos[b] = -1
    if (L.reqCursor >= L.reqCount) L.reqCursor = 0
  }
  pos = L.provPos[b]
  if (pos >= 0) {
    const last = L.provList[--L.provCount]
    L.provList[pos] = last
    L.provPos[last] = pos
    L.provPos[b] = -1
    if (L.provCursor >= L.provCount) L.provCursor = 0
  }
  const pk = L.pKey[b]
  if (pk >= 0) {
    const p = L.pPrev[b], n = L.pNext[b]
    if (p >= 0) L.pNext[p] = n; else L.pHead[pk] = n
    if (n >= 0) L.pPrev[n] = p
    L.pNext[b] = L.pPrev[b] = L.pKey[b] = -1
  }
  const sk = L.sKey[b]
  if (sk >= 0) {
    const p = L.sPrev[b], n = L.sNext[b]
    if (p >= 0) L.sNext[p] = n; else L.sHead[sk] = n
    if (n >= 0) L.sPrev[n] = p
    L.sNext[b] = L.sPrev[b] = L.sKey[b] = -1
    L.storageCount--
  }
}

// ------------------------------------------------------------------ jobs

function clearJob(units, u) {
  units.job[u] = J_NONE
  units.jobSrc[u] = -1
  units.jobDst[u] = -1
  units.jobItem[u] = 0
  units.jobQty[u] = 0
  units.jobTimer[u] = 0
  units.cargoItem[u] = 0
  units.cargoQty[u] = 0
}

/**
 * Release every reservation held by courier `u`'s job and set job = J_NONE, cargo lost.
 * Called by units.despawnUnit when a courier dies mid-job. Safe for idle couriers.
 */
export function abortJob(ctx, u) {
  const units = ctx.units
  const L = ctx.log
  const j = units.job[u]
  if (j === J_NONE) { units.cargoItem[u] = 0; units.cargoQty[u] = 0; return }
  const pool = ctx.buildings
  const item = units.jobItem[u], qty = units.jobQty[u]
  const src = units.jobSrc[u], dst = units.jobDst[u]
  if (j === J_TO_PICKUP || j === J_PICKING) {
    if (pool.isAlive(src, units.jobSrcGen[u])) releaseOut(ctx, src, item, qty)
  }
  if (pool.isAlive(dst, units.jobDstGen[u])) releaseIn(ctx, dst, item, qty)
  clearJob(units, u)
  L.jobCount--
  if (L.jobCount < 0) L.jobCount = 0
  L.busyCount = L.jobCount
  L.stats.aborted++
  L.stats.totalAborted++
}

/** Move courier u to building b's door. */
function moveToDoor(ctx, u, b) {
  const world = ctx.world
  const door = ctx.buildings.door[b]
  orderMove(ctx, u, door & world.mask, door >> world.shift)
}

function assign(ctx, u, src, dst, item, q) {
  const units = ctx.units
  const pool = ctx.buildings
  const L = ctx.log
  reserveOut(ctx, src, item, q)
  reserveIn(ctx, dst, item, q)
  units.jobSrc[u] = src
  units.jobSrcGen[u] = pool.gen[src]
  units.jobDst[u] = dst
  units.jobDstGen[u] = pool.gen[dst]
  units.jobItem[u] = item
  units.jobQty[u] = q
  units.jobTimer[u] = 0
  units.cargoItem[u] = 0
  units.cargoQty[u] = 0
  units.job[u] = J_TO_PICKUP
  L.jobCount++
  L.busyCount = L.jobCount
  L.idleCount--
  L.stats.assigned++
  L.stats.totalAssigned++
  moveToDoor(ctx, u, src)
}

/** Packed tile under a unit. */
function unitTileOf(ctx, u) {
  const world = ctx.world
  let tx = Math.floor(ctx.units.x[u]), ty = Math.floor(ctx.units.y[u])
  if (tx < 0) tx = 0; else if (tx >= world.w) tx = world.w - 1
  if (ty < 0) ty = 0; else if (ty >= world.h) ty = world.h - 1
  return (ty << world.shift) | tx
}

/**
 * Courier carrying cargo lost its destination: find the nearest storage (same region as the
 * courier) with room for the whole load, reserve it and walk there; else drop the cargo.
 */
function reroute(ctx, u, exclude) {
  const units = ctx.units
  const L = ctx.log
  const qty = units.cargoQty[u]
  const item = units.cargoItem[u]
  let s = -1
  if (qty > 0 && item > 0) {
    s = nearestStorage(ctx, unitTileOf(ctx, u), qty, exclude, null)
  }
  if (s < 0) {
    // cargo lost (job counts are recomputed by the courier pass that called us)
    clearJob(units, u)
    stopUnit(ctx, u)
    L.stats.lost++
    L.stats.totalLost++
    return
  }
  reserveIn(ctx, s, item, qty)
  units.jobDst[u] = s
  units.jobDstGen[u] = ctx.buildings.gen[s]
  units.jobQty[u] = qty
  units.jobTimer[u] = 0
  units.job[u] = J_TO_DROPOFF
  L.stats.rerouted++
  moveToDoor(ctx, u, s)
}

// ------------------------------------------------------------------ searches

/**
 * Nearest storage (by Manhattan door distance from `fromTile`) in the same region with
 * freeSpaceIn >= need, excluding building `exclude`. Unlimited radius (whole map), rings
 * of chunks over the storage buckets. Ties -> lower id. With `chunkFree` (L.sChunkFree, valid
 * only inside the push pass) chunks whose best storage has less than `need` free are skipped
 * whole, so a late game of nearly full storage does not walk every storage per visit.
 * @returns {number} building id or -1
 */
function nearestStorage(ctx, fromTile, need, exclude, chunkFree) {
  const L = ctx.log
  if (L.storageCount === 0) return -1
  const world = ctx.world
  const pool = ctx.buildings
  const path = ctx.path
  const cw = world.chunksW, chh = world.chunksH
  const shift = world.shift, mask = world.mask
  const fx = fromTile & mask, fy = fromTile >> shift
  const cx = fx >> CHUNK_SHIFT, cy = fy >> CHUNK_SHIFT
  const rMax = cw > chh ? cw : chh
  const sHead = L.sHead, sNext = L.sNext
  let best = -1, bestScore = 0x7fffffff
  for (let r = 0; r <= rMax; r++) {
    if (best >= 0 && (r - 1) * CHUNK > bestScore) break
    const y0 = cy - r, y1 = cy + r, x0 = cx - r, x1 = cx + r
    for (let yy = y0; yy <= y1; yy++) {
      if (yy < 0 || yy >= chh) continue
      const step = (yy === y0 || yy === y1) ? 1 : (x1 - x0)
      for (let xx = x0; xx <= x1; xx += step) {
        if (xx >= 0 && xx < cw && (chunkFree === null || chunkFree[yy * cw + xx] >= need)) {
          for (let s = sHead[yy * cw + xx]; s >= 0; s = sNext[s]) {
            if (s === exclude) continue
            L.stats.providerScans++
            if (freeSpaceIn(ctx, s, 0) < need) continue
            const d = pool.door[s]
            const dx = (d & mask) - fx, dy = (d >> shift) - fy
            const score = (dx < 0 ? -dx : dx) + (dy < 0 ? -dy : dy)
            if (score > bestScore || (score === bestScore && s > best)) continue
            if (!path.sameRegion(d, fromTile)) continue
            best = s; bestScore = score
          }
        }
        if (step === 0) break
      }
    }
  }
  return best
}

/**
 * Best provider of `item` for requester b (door `toDoor`): producers in the item's chunk
 * buckets within LOG_RADIUS_CHUNKS rings first; else storage anywhere on the map.
 * Score = Manhattan door distance + PARTIAL_PENALTY when it cannot fill `want`.
 * @returns {number} building id or -1
 */
function findProvider(ctx, item, b, toDoor, want, reserve) {
  const L = ctx.log
  const world = ctx.world
  const pool = ctx.buildings
  const path = ctx.path
  const cw = world.chunksW, chh = world.chunksH
  const shift = world.shift, mask = world.mask
  const fx = toDoor & mask, fy = toDoor >> shift
  const cx = fx >> CHUNK_SHIFT, cy = fy >> CHUNK_SHIFT
  const inv = pool.inv, resOut = pool.resOut
  const pHead = L.pHead, pNext = L.pNext
  let best = -1, bestScore = 0x7fffffff
  for (let r = 0; r <= LOG_RADIUS_CHUNKS; r++) {
    if (best >= 0 && (r - 1) * CHUNK > bestScore) break
    const y0 = cy - r, y1 = cy + r, x0 = cx - r, x1 = cx + r
    for (let yy = y0; yy <= y1; yy++) {
      if (yy < 0 || yy >= chh) continue
      const step = (yy === y0 || yy === y1) ? 1 : (x1 - x0)
      for (let xx = x0; xx <= x1; xx += step) {
        if (xx >= 0 && xx < cw) {
          for (let p = pHead[((yy * cw + xx) << ITEM_SHIFT) | item]; p >= 0; p = pNext[p]) {
            L.stats.providerScans++
            if (p === b) continue
            const k = (p << ITEM_SHIFT) | item
            const avail = inv[k] - resOut[k]
            if (avail < 1) continue
            const d = pool.door[p]
            const dx = (d & mask) - fx, dy = (d >> shift) - fy
            const score = (dx < 0 ? -dx : dx) + (dy < 0 ? -dy : dy) + (avail < want ? PARTIAL_PENALTY : 0)
            if (score > bestScore || (score === bestScore && p > best)) continue
            if (!path.sameRegion(d, toDoor)) continue
            best = p; bestScore = score
          }
        }
        if (step === 0) break
      }
    }
  }
  if (best >= 0) return best
  // last resort: storage anywhere (skip the scan when no storage holds any unreserved item,
  // or when what is left is the construction reserve)
  if (ctx.stock[item] <= reserve || L.storageCount === 0) return -1
  const rMax = cw > chh ? cw : chh
  const sHead = L.sHead, sNext = L.sNext
  for (let r = 0; r <= rMax; r++) {
    if (best >= 0 && (r - 1) * CHUNK > bestScore) break
    const y0 = cy - r, y1 = cy + r, x0 = cx - r, x1 = cx + r
    for (let yy = y0; yy <= y1; yy++) {
      if (yy < 0 || yy >= chh) continue
      const step = (yy === y0 || yy === y1) ? 1 : (x1 - x0)
      for (let xx = x0; xx <= x1; xx += step) {
        if (xx >= 0 && xx < cw) {
          for (let s = sHead[yy * cw + xx]; s >= 0; s = sNext[s]) {
            L.stats.providerScans++
            if (s === b) continue
            const k = (s << ITEM_SHIFT) | item
            const avail = inv[k] - resOut[k]
            if (avail < 1) continue
            const d = pool.door[s]
            const dx = (d & mask) - fx, dy = (d >> shift) - fy
            const score = (dx < 0 ? -dx : dx) + (dy < 0 ? -dy : dy) + (avail < want ? PARTIAL_PENALTY : 0)
            if (score > bestScore || (score === bestScore && s > best)) continue
            if (!path.sameRegion(d, toDoor)) continue
            best = s; bestScore = score
          }
        }
        if (step === 0) break
      }
    }
  }
  return best
}

/**
 * Nearest idle courier (J_NONE, alive, same region) to packed `tile`, via the idle grid
 * rings up to IDLE_RADIUS_CELLS; fallback: the first still-idle entry of idleList.
 * @returns {number} unit id or -1
 */
function findIdleCourier(ctx, tile) {
  const L = ctx.log
  if (L.idleCount <= 0) return -1
  const units = ctx.units
  const world = ctx.world
  const path = ctx.path
  const grid = L.idleGrid
  const scratch = L.scratch
  const gx = (tile & world.mask) + 0.5, gy = (tile >> world.shift) + 0.5
  const cs = grid.cellSize
  let cx = (tile & world.mask) >> grid.shift, cy = (tile >> world.shift) >> grid.shift
  if (cx >= grid.cw) cx = grid.cw - 1
  if (cy >= grid.ch) cy = grid.ch - 1
  let best = -1, bestD2 = Infinity
  const alive = units.alive, job = units.job, type = units.type, ux = units.x, uy = units.y
  // rings beyond every grid edge are empty
  let rEdge = cx > cy ? cx : cy
  if (grid.cw - 1 - cx > rEdge) rEdge = grid.cw - 1 - cx
  if (grid.ch - 1 - cy > rEdge) rEdge = grid.ch - 1 - cy
  const rMax = rEdge < IDLE_RADIUS_CELLS ? rEdge : IDLE_RADIUS_CELLS
  const near2 = cs * cs // inside one cell, "nearest" stops mattering
  for (let r = 0; r <= rMax; r++) {
    if (best >= 0) {
      const lim = (r - 1) * cs
      if (lim > 0 && lim * lim > bestD2) break
      if (bestD2 <= near2) break
    }
    const n = grid.queryRing(cx, cy, r, scratch)
    for (let k = 0; k < n; k++) {
      const u = scratch[k]
      if (alive[u] !== 1 || job[u] !== J_NONE || type[u] !== U_COURIER) continue
      const dx = ux[u] - gx, dy = uy[u] - gy
      const d2 = dx * dx + dy * dy
      if (d2 > bestD2 || (d2 === bestD2 && u > best)) continue
      if (!path.sameRegion(unitTileOf(ctx, u), tile)) continue
      best = u; bestD2 = d2
      // an idle pile on a door can hold thousands: take the first one close enough
      if (d2 <= near2) break
    }
  }
  if (best >= 0) return best
  // fallback: first idle entry still free (pointer only advances past consumed entries)
  const list = L.idleList
  const len = L.idleListLen
  let i = L.idleScan
  while (i < len && (alive[list[i]] !== 1 || job[list[i]] !== J_NONE)) i++
  L.idleScan = i
  const end = i + 256 < len ? i + 256 : len
  for (; i < end; i++) {
    const u = list[i]
    if (alive[u] !== 1 || job[u] !== J_NONE) continue
    if (path.sameRegion(unitTileOf(ctx, u), tile)) return u
  }
  return -1
}

// ------------------------------------------------------------------ per tick

/**
 * Once per tick, after tickBuildings:
 *  1. courier state machine over all couriers (react to M_ARRIVED / M_FAILED, timers, dead refs)
 *  2. rebuild idleGrid + idleCount/jobCount
 *  3. pull pass: up to LOG_REQ_PER_TICK requester visits
 *  4. push pass: up to LOG_PUSH_PER_TICK producer visits (surplus -> storage)
 * Budget: O(couriers) + O(K * ring search). No allocation.
 * @param {Ctx} ctx
 */
export function tickLogistics(ctx) {
  const L = ctx.log
  const st = L.stats
  st.assigned = 0; st.pullVisits = 0; st.pushVisits = 0; st.aborted = 0; st.providerScans = 0
  st.rerouted = 0; st.lost = 0; st.delivered = 0

  courierPass(ctx)
  if (L.idleCount <= 0) return
  // once per tick: per-chunk storage room (push pass) and whether storage can be refilled at all
  const sFree = L.storageCount > 0 ? storageSummary(ctx) : 0
  if (pullPass(ctx, sFree >= COURIER_CAP)) pushPass(ctx, sFree)
}

function courierPass(ctx) {
  const L = ctx.log
  const units = ctx.units
  const pool = ctx.buildings
  const grid = L.idleGrid
  const idleList = L.idleList
  const alive = units.alive, utype = units.type, job = units.job, mstate = units.mstate
  grid.clear()
  let idle = 0, busy = 0
  const hi = units.hi
  for (let u = 0; u < hi; u++) {
    if (alive[u] !== 1 || utype[u] !== U_COURIER) continue
    let j = job[u]
    if (j !== J_NONE) {
      const src = units.jobSrc[u], dst = units.jobDst[u]
      const item = units.jobItem[u]
      const ms = mstate[u]
      if (j === J_TO_PICKUP || j === J_PICKING) {
        const srcOk = pool.isAlive(src, units.jobSrcGen[u])
        const dstOk = pool.isAlive(dst, units.jobDstGen[u])
        if (!srcOk || !dstOk) {
          if (srcOk) releaseOut(ctx, src, item, units.jobQty[u])
          if (dstOk) releaseIn(ctx, dst, item, units.jobQty[u])
          clearJob(units, u)
          stopUnit(ctx, u)
          j = J_NONE
        } else if (j === J_TO_PICKUP) {
          if (ms === M_ARRIVED) {
            units.jobTimer[u] = PICK_TICKS
            job[u] = J_PICKING
          } else if (ms === M_FAILED) {
            releaseOut(ctx, src, item, units.jobQty[u])
            releaseIn(ctx, dst, item, units.jobQty[u])
            clearJob(units, u)
            stopUnit(ctx, u)
            L.stats.aborted++
            L.stats.totalAborted++
            j = J_NONE
          } else if (ms === M_IDLE) {
            moveToDoor(ctx, u, src)
          }
        } else { // J_PICKING
          let t = units.jobTimer[u]
          if (t > 0) t--
          units.jobTimer[u] = t
          if (t === 0) {
            const want = units.jobQty[u]
            const q = takeItems(ctx, src, item, want, true)
            if (q < want) {
              // should not happen (reservation held), but never leak space at dst
              releaseOut(ctx, src, item, want - q)
              releaseIn(ctx, dst, item, want - q)
            }
            if (q <= 0) {
              clearJob(units, u)
              stopUnit(ctx, u)
              j = J_NONE
            } else {
              units.cargoItem[u] = item
              units.cargoQty[u] = q
              units.jobQty[u] = q
              job[u] = J_TO_DROPOFF
              moveToDoor(ctx, u, dst)
            }
          }
        }
      } else if (j === J_TO_DROPOFF) {
        const dstOk = pool.isAlive(dst, units.jobDstGen[u])
        if (!dstOk || ms === M_FAILED) {
          if (dstOk) releaseIn(ctx, dst, item, units.jobQty[u])
          reroute(ctx, u, dstOk ? dst : -1)
          j = job[u]
        } else if (ms === M_ARRIVED) {
          units.jobTimer[u] = DROP_TICKS
          job[u] = J_DROPPING
        } else if (ms === M_IDLE) {
          moveToDoor(ctx, u, dst)
        }
      } else if (j === J_DROPPING) {
        if (!pool.isAlive(dst, units.jobDstGen[u])) {
          reroute(ctx, u, -1)
          j = job[u]
        } else {
          let t = units.jobTimer[u]
          if (t > 0) t--
          units.jobTimer[u] = t
          if (t === 0) {
            addItems(ctx, dst, units.cargoItem[u], units.cargoQty[u], true)
            L.stats.delivered += units.cargoQty[u]
            L.stats.totalDelivered += units.cargoQty[u]
            clearJob(units, u)
            j = J_NONE // stays where it is
          }
        }
      }
    }
    if (j === J_NONE) {
      idleList[idle++] = u
      grid.add(u, units.x[u], units.y[u])
    } else busy++
  }
  grid.build()
  L.idleListLen = idle
  L.idleScan = 0
  L.idleCount = idle
  L.jobCount = busy
  L.busyCount = busy
}

/**
 * @param {boolean} canRefill storage has room for a courier load, so the push pass can bring
 *   stored raw stock back up to CRAFT_RESERVE (otherwise the reserve gate would starve crafters)
 * @returns {boolean} false when couriers ran out (stop both passes).
 */
function pullPass(ctx, canRefill) {
  const L = ctx.log
  const pool = ctx.buildings
  const inv = pool.inv, resIn = pool.resIn
  const count = L.reqCount
  if (count === 0) return true
  const visits = count < LOG_REQ_PER_TICK ? count : LOG_REQ_PER_TICK
  for (let v = 0; v < visits; v++) {
    if (L.reqCursor >= L.reqCount) L.reqCursor = 0
    const b = L.reqList[L.reqCursor]
    L.reqCursor = L.reqCursor + 1 >= L.reqCount ? 0 : L.reqCursor + 1
    L.stats.pullVisits++
    if (pool.paused[b]) continue
    const type = pool.type[b]
    const shrine = (B_FLAGS[type] & BF_SHRINE) !== 0
    let n
    if (shrine) {
      if (ctx.won || ctx.tier >= WIN_TIER) continue
      n = OFFER_N[ctx.tier]
    } else n = recipeInputCount(type)
    const door = pool.door[b]
    for (let k = 0; k < n; k++) {
      const item = shrine ? OFFER_ITEMS[ctx.tier * 4 + k] : recipeInputItem(type, k)
      const free = freeSpaceIn(ctx, b, item)
      if (free <= 0) continue
      if (!shrine && free < COURIER_CAP) {
        const ik = (b << ITEM_SHIFT) | item
        if (inv[ik] + resIn[ik] >= B_IN_QTY[(type << ITEM_SHIFT) | item]) continue // not starving
      }
      const reserve = shrine || L.storageCount === 0 ? 0 : CRAFT_RESERVE[item]
      // construction first: leave producers' output to the push pass, but only while storage
      // can actually take it; full storage would otherwise lock the wood chain for good
      if (reserve > 0 && canRefill && ctx.stock[item] < reserve) continue
      const want = free < COURIER_CAP ? free : COURIER_CAP
      const src = findProvider(ctx, item, b, door, want, reserve)
      if (src < 0) continue
      const avail = availableOut(ctx, src, item)
      let q = want < avail ? want : avail
      if (reserve > 0 && (B_FLAGS[pool.type[src]] & BF_STORAGE) && q > ctx.stock[item] - reserve) q = ctx.stock[item] - reserve
      if (q <= 0) continue
      const u = findIdleCourier(ctx, pool.door[src])
      if (u < 0) {
        if (L.idleCount <= 0) return false
        continue // idle couriers exist, just none in src's region (built across a river)
      }
      assign(ctx, u, src, b, item, q)
      if (L.idleCount <= 0) return false
    }
  }
  return true
}

/**
 * Rebuild L.sChunkFree (largest freeSpaceIn per storage chunk) and return the largest over
 * all storage. O(chunks + storages), once per tick.
 */
function storageSummary(ctx) {
  const L = ctx.log
  const head = L.sHead, next = L.sNext, cf = L.sChunkFree
  let best = 0
  for (let c = 0; c < head.length; c++) {
    let m = 0
    for (let s = head[c]; s >= 0; s = next[s]) {
      const f = freeSpaceIn(ctx, s, 0)
      if (f > m) m = f
    }
    cf[c] = m
    if (m > best) best = m
  }
  return best
}

function pushPass(ctx, sFree) {
  const L = ctx.log
  const pool = ctx.buildings
  const count = L.provCount
  if (count === 0 || L.storageCount === 0) return
  // every storage full: skip the pass instead of scanning all storage per visit
  if (sFree <= 0) return
  // plenty of idle couriers: move any full courier load (the top bar should tick up from the
  // first Quarry load); scarce couriers: leave outputs to consumers until half full
  const loose = L.idleCount * IDLE_SHARE > L.idleCount + L.jobCount
  const visits = count < LOG_PUSH_PER_TICK ? count : LOG_PUSH_PER_TICK
  for (let v = 0; v < visits; v++) {
    if (L.provCursor >= L.provCount) L.provCursor = 0
    const p = L.provList[L.provCursor]
    L.provCursor = L.provCursor + 1 >= L.provCount ? 0 : L.provCursor + 1
    L.stats.pushVisits++
    const type = pool.type[p]
    const out = B_OUT_ITEM[type]
    if (out === 0) continue
    const a = availableOut(ctx, p, out)
    const outCap = B_SLOT_CAP[(type << ITEM_SHIFT) | out]
    if (a <= 0 || a < (loose ? (COURIER_CAP < (outCap >> 1) ? COURIER_CAP : outCap >> 1) : outCap >> 1)) continue
    const need = a < COURIER_CAP ? a : COURIER_CAP
    if (need > sFree) continue // no storage anywhere has room for this load
    const door = pool.door[p]
    const s = nearestStorage(ctx, door, need, p, L.sChunkFree)
    if (s < 0) continue
    const u = findIdleCourier(ctx, door)
    if (u < 0) {
      if (L.idleCount <= 0) return
      continue // none in this producer's region
    }
    let q = need
    const fs = freeSpaceIn(ctx, s, out)
    if (fs < q) q = fs
    if (q <= 0) continue
    assign(ctx, u, p, s, out, q)
    if (L.idleCount <= 0) return
  }
}
