// Struct-of-arrays entity pools. OWNER: sim implementer.
// The architect implemented the layout and alloc/free because every module reads
// these arrays directly; the owner may add PRIVATE arrays (prefix _) but must not
// rename, retype or repurpose any documented array. Full field docs: ARCHITECTURE.md §8.
//
// Ids are slot indices (stable while alive). A slot's `gen` increments on free, so a
// stored (id, gen) pair detects reuse: pool.isAlive(id, gen).
// Iterate alive entities with: for (let i = 0; i < pool.hi; i++) if (pool.alive[i]) ...
// Never cache a typed array across calls in a way that would break if the pool were
// recreated (pools are fixed-capacity and never reallocate, but tests recreate ctx).

import {
  MAX_UNITS, MAX_BUILDINGS, ITEM_STRIDE, TRAIN_QUEUE, UNIT_COUNT, BUILDING_COUNT, FACTION_COUNT,
  M_IDLE, O_NONE, TK_NONE, J_NONE, BS_OK,
} from './constants.js'
import { U_HP, B_W, B_H, B_HP } from './content.js'

function makeFreeList(capacity) {
  const ids = new Int32Array(capacity)
  for (let k = 0; k < capacity; k++) ids[k] = capacity - 1 - k // pop order 0,1,2,...
  return ids
}

export class UnitPool {
  /** @param {number} [capacity=MAX_UNITS] */
  constructor(capacity = MAX_UNITS) {
    const n = capacity
    /** @readonly */ this.capacity = n
    /** alive units */ this.count = 0
    /** 1 + highest id ever allocated: iteration bound */ this.hi = 0
    // identity
    this.alive = new Uint8Array(n)
    this.gen = new Uint16Array(n)
    this.type = new Uint8Array(n) // U_*
    this.faction = new Uint8Array(n) // F_*
    // kinematics (tile units). px/py = position at the START of the current tick (render lerp from).
    this.x = new Float32Array(n)
    this.y = new Float32Array(n)
    this.px = new Float32Array(n)
    this.py = new Float32Array(n)
    this.vx = new Float32Array(n) // displacement during the last tick (facing / separation)
    this.vy = new Float32Array(n)
    this.hp = new Float32Array(n)
    // movement layer (units.js)
    this.mstate = new Uint8Array(n) // M_*
    /** @type {(Int32Array|null)[]} shared immutable paths from PathService */
    this.path = new Array(n).fill(null)
    this.pathIdx = new Int32Array(n) // index into path of the NEXT waypoint
    this.goal = new Int32Array(n).fill(-1) // packed goal tile, -1 none
    this.pathJob = new Int32Array(n).fill(-1) // PathService job id while M_WAIT_PATH
    // orders / combat (combat.js, waves.js)
    this.order = new Uint8Array(n) // O_*
    this.orderTile = new Int32Array(n).fill(-1) // packed destination of the order
    this.target = new Int32Array(n).fill(-1) // unit id or building id per targetKind
    this.targetGen = new Uint16Array(n)
    this.targetKind = new Uint8Array(n) // TK_*
    this.cooldown = new Uint16Array(n) // ticks until next attack allowed
    this.repathAt = new Int32Array(n) // earliest tick a chase may re-path
    // courier job (logistics.js)
    this.job = new Uint8Array(n) // J_*
    this.jobSrc = new Int32Array(n).fill(-1) // provider building id
    this.jobSrcGen = new Uint16Array(n)
    this.jobDst = new Int32Array(n).fill(-1) // requester building id
    this.jobDstGen = new Uint16Array(n)
    this.jobItem = new Uint8Array(n) // I_*
    this.jobQty = new Uint8Array(n) // reserved quantity for this job
    this.jobTimer = new Uint16Array(n) // PICKING / DROPPING countdown
    this.cargoItem = new Uint8Array(n) // I_* carried (0 none)
    this.cargoQty = new Uint8Array(n)
    // bookkeeping
    this.typeCount = new Int32Array(UNIT_COUNT)
    this.factionCount = new Int32Array(FACTION_COUNT)
    this._free = makeFreeList(n)
    this._freeTop = n
  }

  /**
   * Allocate a slot and reset every field to its default. Does NOT place, path or
   * emit anything — use units.spawnUnit() for that.
   * @returns {number} id, or -1 when full
   */
  alloc(type, faction) {
    if (this._freeTop === 0) return -1
    const i = this._free[--this._freeTop]
    this.alive[i] = 1
    this.type[i] = type
    this.faction[i] = faction
    this.x[i] = this.y[i] = this.px[i] = this.py[i] = this.vx[i] = this.vy[i] = 0
    this.hp[i] = U_HP[type]
    this.mstate[i] = M_IDLE
    this.path[i] = null
    this.pathIdx[i] = 0
    this.goal[i] = -1
    this.pathJob[i] = -1
    this.order[i] = O_NONE
    this.orderTile[i] = -1
    this.target[i] = -1
    this.targetGen[i] = 0
    this.targetKind[i] = TK_NONE
    this.cooldown[i] = 0
    this.repathAt[i] = 0
    this.job[i] = J_NONE
    this.jobSrc[i] = this.jobDst[i] = -1
    this.jobSrcGen[i] = this.jobDstGen[i] = 0
    this.jobItem[i] = this.jobQty[i] = this.jobTimer[i] = 0
    this.cargoItem[i] = this.cargoQty[i] = 0
    this.typeCount[type]++
    this.factionCount[faction]++
    this.count++
    if (i >= this.hi) this.hi = i + 1
    return i
  }

  /** Release a slot (bumps gen). Use units.despawnUnit() from gameplay code. */
  free(id) {
    if (!this.alive[id]) return
    this.alive[id] = 0
    this.gen[id] = (this.gen[id] + 1) & 0xffff
    this.path[id] = null
    this.typeCount[this.type[id]]--
    this.factionCount[this.faction[id]]--
    this.count--
    this._free[this._freeTop++] = id
  }

  isAlive(id, gen) { return id >= 0 && this.alive[id] === 1 && this.gen[id] === gen }
}

export class BuildingPool {
  /**
   * @param {number} chunkCount world.chunkCount (for per-chunk lists)
   * @param {number} [capacity=MAX_BUILDINGS]
   */
  constructor(chunkCount, capacity = MAX_BUILDINGS) {
    const n = capacity
    /** @readonly */ this.capacity = n
    this.count = 0
    this.hi = 0
    this.alive = new Uint8Array(n)
    this.gen = new Uint16Array(n)
    this.type = new Uint8Array(n) // B_*
    // placement
    this.tx = new Int16Array(n) // footprint top-left tile
    this.ty = new Int16Array(n)
    this.w = new Uint8Array(n) // footprint size (copied from content)
    this.h = new Uint8Array(n)
    this.door = new Int32Array(n).fill(-1) // packed door tile
    this.chunk = new Int32Array(n).fill(-1) // chunk of the top-left tile (list membership)
    // state
    this.hp = new Float32Array(n)
    this.status = new Uint8Array(n) // BS_*
    this.paused = new Uint8Array(n) // 1 = player paused
    this.progress = new Int32Array(n) // ticks into current cycle (recipe, den spawn, hall training)
    this.workTile = new Int32Array(n).fill(-1) // extractor: packed tile being harvested
    // inventory: index (b << ITEM_SHIFT) | item  — ONLY buildings.js inventory helpers write these
    this.inv = new Int32Array(n * ITEM_STRIDE) // items physically present
    this.resIn = new Int32Array(n * ITEM_STRIDE) // promised incoming (courier en route to drop)
    this.resOut = new Int32Array(n * ITEM_STRIDE) // promised outgoing (courier en route to pick)
    this.invTotal = new Int32Array(n) // sum over items of inv
    this.resInTotal = new Int32Array(n) // sum over items of resIn
    // military
    this.trainQ = new Uint8Array(n * TRAIN_QUEUE) // unit types, index b*TRAIN_QUEUE + k, k < trainLen
    this.trainLen = new Uint8Array(n)
    this.rally = new Int32Array(n).fill(-1) // packed rally tile for trained units, -1 = door
    this.target = new Int32Array(n).fill(-1) // tower: target unit id
    this.targetGen = new Uint16Array(n)
    this.cooldown = new Uint16Array(n) // tower: ticks until next shot
    // per-type dense lists: ids of alive buildings of type t are typeList[t][0..typeCount[t]-1]
    // in allocation order with swap-remove on free (order is deterministic, not sorted).
    this.typeList = []
    for (let t = 0; t < BUILDING_COUNT; t++) this.typeList.push(new Int32Array(n))
    this.typeCount = new Int32Array(BUILDING_COUNT)
    this.typePos = new Int32Array(n).fill(-1)
    // per-chunk doubly linked lists (head per chunk) keyed by chunk of the top-left tile
    this.chunkCount = chunkCount
    this.chunkHead = new Int32Array(chunkCount).fill(-1)
    this.chunkNext = new Int32Array(n).fill(-1)
    this.chunkPrev = new Int32Array(n).fill(-1)
    this._free = makeFreeList(n)
    this._freeTop = n
  }

  /**
   * Allocate and reset a building slot of `type` (hp = max, w/h from content, empty
   * inventory). Adds it to typeList. Does NOT touch the world or chunk lists —
   * buildings.placeBuilding() does that.
   * @returns {number} id or -1 when full
   */
  alloc(type) {
    if (this._freeTop === 0) return -1
    const i = this._free[--this._freeTop]
    this.alive[i] = 1
    this.type[i] = type
    this.tx[i] = this.ty[i] = 0
    this.w[i] = B_W[type]
    this.h[i] = B_H[type]
    this.door[i] = -1
    this.chunk[i] = -1
    this.hp[i] = B_HP[type]
    this.status[i] = BS_OK
    this.paused[i] = 0
    this.progress[i] = 0
    this.workTile[i] = -1
    const o = i * ITEM_STRIDE
    this.inv.fill(0, o, o + ITEM_STRIDE)
    this.resIn.fill(0, o, o + ITEM_STRIDE)
    this.resOut.fill(0, o, o + ITEM_STRIDE)
    this.invTotal[i] = 0
    this.resInTotal[i] = 0
    this.trainLen[i] = 0
    this.rally[i] = -1
    this.target[i] = -1
    this.targetGen[i] = 0
    this.cooldown[i] = 0
    const list = this.typeList[type]
    this.typePos[i] = this.typeCount[type]
    list[this.typeCount[type]++] = i
    this.count++
    if (i >= this.hi) this.hi = i + 1
    return i
  }

  /** Link building into the per-chunk list of chunk `ci` (sets this.chunk[id]). */
  linkChunk(id, ci) {
    const head = this.chunkHead[ci]
    this.chunkNext[id] = head
    this.chunkPrev[id] = -1
    if (head >= 0) this.chunkPrev[head] = id
    this.chunkHead[ci] = id
    this.chunk[id] = ci
  }

  /** Unlink from its chunk list (no-op if not linked). */
  unlinkChunk(id) {
    const ci = this.chunk[id]
    if (ci < 0) return
    const p = this.chunkPrev[id], nx = this.chunkNext[id]
    if (p >= 0) this.chunkNext[p] = nx; else this.chunkHead[ci] = nx
    if (nx >= 0) this.chunkPrev[nx] = p
    this.chunkNext[id] = this.chunkPrev[id] = -1
    this.chunk[id] = -1
  }

  /** Release a slot: unlinks chunk list, removes from typeList (swap-remove), bumps gen. */
  free(id) {
    if (!this.alive[id]) return
    this.unlinkChunk(id)
    const t = this.type[id]
    const list = this.typeList[t]
    const pos = this.typePos[id]
    const last = list[--this.typeCount[t]]
    list[pos] = last
    this.typePos[last] = pos
    this.typePos[id] = -1
    this.alive[id] = 0
    this.gen[id] = (this.gen[id] + 1) & 0xffff
    this.count--
    this._free[this._freeTop++] = id
  }

  isAlive(id, gen) { return id >= 0 && this.alive[id] === 1 && this.gen[id] === gen }
}
