// Combat: orders, targeting, attacks, towers, damage, training halls.
// OWNER: units implementer. Contract: ARCHITECTURE.md §12.
//
// Scale notes:
//  - Player soldiers and towers look for Blight through a private Blight-only CellGrid
//    (rebuilt at the start of tickCombat, O(units), skipped when no Blight is alive), so a
//    crowd of couriers near the base never pollutes their scans.
//  - Blight look for player units through ctx.unitGrid (couriers are valid prey) with an
//    expanding ring search that stops as soon as nothing closer can exist.
//  - Building scans walk world.occ in Chebyshev rings around the attacker (exact point-to-
//    footprint distance, early exit) and are throttled to every 4th tick per unit.
//  - Retargeting with a live target is staggered by (tick + id) % RETARGET_INTERVAL.
//  - Damage is instant; fx are cosmetic. No allocation per tick.

import {
  MAX_UNITS, UNIT_CELL_SHIFT, TRAIN_QUEUE, BUILDING_COUNT,
  U_COURIER, U_TREANT, UNIT_COUNT, F_PLAYER, F_BLIGHT, B_HEARTH, FX_ARROW,
  M_IDLE, M_WAIT_PATH, M_MOVING, M_ARRIVED, M_FAILED,
  O_NONE, O_MOVE, O_ATTACK_MOVE, O_ATTACK, O_HOLD, O_RAID,
  TK_NONE, TK_UNIT, TK_BUILDING,
  BF_TOWER, BF_HALL, BS_OK, BS_IDLE, BS_PAUSED,
  RETARGET_INTERVAL, CHASE_REPATH_TICKS,
  EV_UNIT_TRAINED, EV_CANNOT_AFFORD, EV_BUILDING_ATTACKED, EV_COURIERS_LOST, TICK_RATE,
} from './constants.js'
import {
  BUILDINGS, UNITS, B_FLAGS, U_ATTACK, U_RANGE, U_COOLDOWN, U_SIGHT, U_VS_BUILDING, U_FX, U_SPEED,
} from './content.js'
import { CellGrid } from './world.js'
import { spawnUnit, despawnUnit, orderMove, stopUnit } from './units.js'
import { destroyBuilding, payCost, refundCost, nearestBuilding, buildingApproach, onBuildingRing } from './buildings.js'

/** @typedef {import('./context.js').Ctx} Ctx */

/**
 * @typedef {Object} CombatState  ctx.combat — private scratch for combat.js
 * @property {Int32Array} scratch query buffer for grid lookups
 * @property {{shots:number, kills:number, buildingKills:number}} stats  per-tick counters
 */

// ------------------------------------------------------------------ derived tables

/** Tower stats per building type (0 = not a tower). */
const TW_RANGE = new Float32Array(BUILDING_COUNT)
const TW_ATTACK = new Float32Array(BUILDING_COUNT)
const TW_COOLDOWN = new Uint16Array(BUILDING_COUNT)
const TW_FX = new Uint8Array(BUILDING_COUNT)
/** Bitmask of unit types a hall type can train. */
const HALL_TRAINS = new Uint32Array(BUILDING_COUNT)
const TOWER_TYPES = []
const HALL_TYPES = []
for (let t = 1; t < BUILDING_COUNT; t++) {
  const d = BUILDINGS[t]
  if (d.tower) {
    TW_RANGE[t] = d.tower.range; TW_ATTACK[t] = d.tower.attack
    TW_COOLDOWN[t] = d.tower.cooldown; TW_FX[t] = d.tower.fx
  }
  if (d.trains) for (const ut of d.trains) HALL_TRAINS[t] |= 1 << ut
  if (B_FLAGS[t] & BF_TOWER) TOWER_TYPES.push(t)
  if (B_FLAGS[t] & BF_HALL) HALL_TYPES.push(t)
}
const U_TRAIN_TICKS = new Int32Array(UNIT_COUNT)
const U_TIER = new Uint8Array(UNIT_COUNT)
for (let t = 1; t < UNIT_COUNT; t++) { U_TRAIN_TICKS[t] = UNITS[t].trainTicks; U_TIER[t] = UNITS[t].tier }

/** Square-spiral offsets for commandGroup, ring by ring, nearest first inside a ring. */
const SPIRAL_R = 24
const SPIRAL_N = (2 * SPIRAL_R + 1) * (2 * SPIRAL_R + 1)
const SPIRAL_DX = new Int8Array(SPIRAL_N)
const SPIRAL_DY = new Int8Array(SPIRAL_N)
{
  const tmp = []
  for (let dy = -SPIRAL_R; dy <= SPIRAL_R; dy++) for (let dx = -SPIRAL_R; dx <= SPIRAL_R; dx++) {
    const ring = Math.max(Math.abs(dx), Math.abs(dy))
    tmp.push([ring, dx * dx + dy * dy, dy, dx])
  }
  tmp.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2] || a[3] - b[3])
  for (let k = 0; k < tmp.length; k++) { SPIRAL_DX[k] = tmp[k][3]; SPIRAL_DY[k] = tmp[k][2] }
}

/** Ticks between building scans for a unit with no target (staggered by id). */
const BSCAN_MASK = 3
/** Idle Blight (O_NONE, no target, standing) re-raid every 128 ticks, staggered by id. */
const BLIGHT_RERAID_MASK = 127

/** Candidates examined before a target search may settle for "close enough" (crowds). */
const CROWD_SCAN = 32
/** "Close enough" distance squared (tiles²) for the crowd shortcut. */
const NEAR_ENOUGH2 = 1
/** Candidates examined before a target search settles for the best one so far. */
const CROWD_CAP = 192
/** Candidates examined with nothing in range before a search gives up (retried later). */
const CROWD_GIVEUP = 512

/** Player O_NONE / raid leash on unit targets, as a multiple of sight. */
const LEASH = 1.5

/** Must not throw (createContext calls it). @returns {CombatState} */
export function createCombat(ctx) {
  const cap = ctx.units ? ctx.units.capacity : MAX_UNITS
  const w = ctx.world ? ctx.world.w : 256, h = ctx.world ? ctx.world.h : 256
  return {
    scratch: new Int32Array(cap), // a ring query can return every unit: never truncate
    stats: { shots: 0, kills: 0, buildingKills: 0 },
    /** cumulative counters (never reset) */
    totals: { shots: 0, kills: 0, buildingKills: 0, trained: 0 },
    _cap: cap,
    /** Blight-only spatial hash, rebuilt every tickCombat */
    blightGrid: new CellGrid(w, h, UNIT_CELL_SHIFT, cap),
    /** sort buffer for commandGroup */
    _group: new Int32Array(256),
    // alerts: EV_BUILDING_ATTACKED at most once per ALERT_CHUNK_TICKS per chunk and once per
    // ALERT_GAP_TICKS overall; courier deaths are summed into one EV_COURIERS_LOST per LOST_TICKS
    alertAt: new Int32Array(ctx.world ? ctx.world.chunkCount : 64),
    alertNext: 0,
    lostCount: 0,
    lostTile: -1,
    lostNext: 0,
  }
}

const ALERT_CHUNK_TICKS = 15 * TICK_RATE
const ALERT_GAP_TICKS = 3 * TICK_RATE
const LOST_TICKS = 10 * TICK_RATE

// ------------------------------------------------------------------ small helpers

function isCombatant(u, id) {
  return id >= 0 && id < u.capacity && u.alive[id] === 1 && u.type[id] !== U_COURIER
}

function clearTarget(u, id) {
  u.target[id] = -1
  u.targetGen[id] = 0
  u.targetKind[id] = TK_NONE
}

/** Walkable tile for an order destination: the tile itself, else the nearest walkable one. */
function resolveGoal(ctx, tx, ty) {
  const w = ctx.world
  tx |= 0; ty |= 0
  if (tx < 0) tx = 0; else if (tx >= w.w) tx = w.w - 1
  if (ty < 0) ty = 0; else if (ty >= w.h) ty = w.h - 1
  const i = (ty << w.shift) | tx
  if (w.pass[i] === 1) return i
  const n = w.nearestWalkable(tx, ty, 6)
  return n >= 0 ? n : i
}

function moveToTile(ctx, id, tile) {
  const w = ctx.world
  orderMove(ctx, id, tile & w.mask, tile >> w.shift)
}

// ------------------------------------------------------------------ player/AI commands
// All commands ignore dead ids and couriers (U_COURIER units are logistics-only).

/** order = O_MOVE to (tx,ty): walk there ignoring enemies, then O_NONE. */
export function commandMove(ctx, id, tx, ty) {
  const u = ctx.units
  if (!isCombatant(u, id)) return
  const g = resolveGoal(ctx, tx, ty)
  u.order[id] = O_MOVE
  u.orderTile[id] = g
  clearTarget(u, id)
  moveToTile(ctx, id, g)
}

/** order = O_ATTACK_MOVE: walk, engage enemies within sight, resume afterwards. */
export function commandAttackMove(ctx, id, tx, ty) {
  const u = ctx.units
  if (!isCombatant(u, id)) return
  const g = resolveGoal(ctx, tx, ty)
  u.order[id] = O_ATTACK_MOVE
  u.orderTile[id] = g
  clearTarget(u, id)
  moveToTile(ctx, id, g)
}

/** order = O_ATTACK on a specific target. kind = TK_UNIT | TK_BUILDING. */
export function commandAttack(ctx, id, kind, target) {
  const u = ctx.units
  if (!isCombatant(u, id)) return
  if (kind === TK_UNIT) {
    if (!(target >= 0 && target < u.capacity && u.alive[target] === 1)) return
    if (u.faction[target] === u.faction[id]) return
    u.order[id] = O_ATTACK
    u.target[id] = target
    u.targetGen[id] = u.gen[target]
    u.targetKind[id] = TK_UNIT
    u.orderTile[id] = unitTileOf(ctx, target)
  } else if (kind === TK_BUILDING) {
    const b = ctx.buildings
    if (!(target >= 0 && target < b.capacity && b.alive[target] === 1)) return
    if (u.faction[id] !== F_BLIGHT) return // every building belongs to the player
    u.order[id] = O_ATTACK
    u.target[id] = target
    u.targetGen[id] = b.gen[target]
    u.targetKind[id] = TK_BUILDING
    u.orderTile[id] = b.door[target]
  } else return
  u.repathAt[id] = 0 // first tickCombat chases immediately if out of range
}

/** order = O_HOLD: stop and only fire at enemies within range. */
export function commandHold(ctx, id) {
  const u = ctx.units
  if (!isCombatant(u, id)) return
  u.order[id] = O_HOLD
  u.orderTile[id] = -1
  clearTarget(u, id)
  stopUnit(ctx, id)
}

/** order = O_NONE and stopUnit. */
export function commandStop(ctx, id) {
  const u = ctx.units
  if (!isCombatant(u, id)) return
  u.order[id] = O_NONE
  u.orderTile[id] = -1
  clearTarget(u, id)
  stopUnit(ctx, id)
}

/**
 * order = O_RAID toward a building: orderTile = its door; used by waves.js.
 * Blight-only. When the target dies the unit re-targets the nearest building.
 */
export function commandRaid(ctx, id, building) {
  const u = ctx.units
  if (!isCombatant(u, id) || u.faction[id] !== F_BLIGHT) return
  const B = ctx.buildings
  clearTarget(u, id)
  const from = unitTileOf(ctx, id)
  let goal = -1
  if (building >= 0 && building < B.capacity && B.alive[building] === 1) goal = buildingApproach(ctx, building, from)
  if (goal < 0) {
    // no (reachable) target given: the nearest building this raider can actually get at
    building = nearestBuilding(ctx, u.x[id], u.y[id], null, 0, from)
    if (building >= 0) goal = buildingApproach(ctx, building, from)
  }
  if (building < 0 || goal < 0) {
    u.order[id] = O_NONE
    u.orderTile[id] = -1
    return
  }
  u.order[id] = O_RAID
  u.orderTile[id] = goal
  setBuildingTarget(ctx, id, building)
  u.repathAt[id] = 0
  moveToTile(ctx, id, goal)
}

/**
 * Issue one order to a group, spreading destinations over walkable tiles in a square
 * spiral around (tx,ty) so units do not stack (1 unit per tile, Treants first).
 * @param {Int32Array} ids
 * @param {number} count
 * @param {number} order O_MOVE or O_ATTACK_MOVE
 */
export function commandGroup(ctx, ids, count, tx, ty, order) {
  const u = ctx.units
  const C = ctx.combat
  const world = ctx.world
  if (count > ids.length) count = ids.length
  if (C._group.length < count) C._group = new Int32Array(count)
  const keys = C._group
  // sort key: treants first, then ascending id (ids < 2^20 because MAX_UNITS = 32768)
  let n = 0
  for (let k = 0; k < count; k++) {
    const id = ids[k]
    if (!isCombatant(u, id)) continue
    keys[n++] = (u.type[id] === U_TREANT ? 0 : 1 << 20) | id
  }
  if (n === 0) return
  keys.subarray(0, n).sort()
  const anchor = resolveGoal(ctx, tx, ty)
  const ax = anchor & world.mask, ay = anchor >> world.shift
  const pass = world.pass
  let s = 0
  for (let k = 0; k < n; k++) {
    const id = keys[k] & 0xfffff
    let tile = anchor
    while (s < SPIRAL_N) {
      const x = ax + SPIRAL_DX[s], y = ay + SPIRAL_DY[s]
      s++
      if (x < 0 || y < 0 || x >= world.w || y >= world.h) continue
      const i = (y << world.shift) | x
      if (pass[i] !== 1 || !ctx.path.sameRegion(anchor, i)) continue
      tile = i
      break
    }
    const gx = tile & world.mask, gy = tile >> world.shift
    if (order === O_ATTACK_MOVE) commandAttackMove(ctx, id, gx, gy)
    else commandMove(ctx, id, gx, gy)
  }
}

function unitTileOf(ctx, id) {
  const w = ctx.world
  let tx = ctx.units.x[id] | 0, ty = ctx.units.y[id] | 0
  if (tx < 0) tx = 0; else if (tx >= w.w) tx = w.w - 1
  if (ty < 0) ty = 0; else if (ty >= w.h) ty = w.h - 1
  return (ty << w.shift) | tx
}

// ------------------------------------------------------------------ damage

/**
 * Apply damage; on hp <= 0 despawn (died = true) and count the kill.
 * @returns {boolean} true if the unit died
 */
export function damageUnit(ctx, id, amount) {
  const u = ctx.units
  if (!(id >= 0 && id < u.capacity && u.alive[id] === 1)) return false
  const hp = u.hp[id] - amount
  u.hp[id] = hp
  if (hp > 0) return false
  const courier = u.type[id] === U_COURIER
  const C = ctx.combat
  if (C && courier) { C.lostCount++; C.lostTile = unitTileOf(ctx, id) }
  despawnUnit(ctx, id, true)
  if (C) { C.stats.kills++; C.totals.kills++ }
  return true
}

/**
 * Apply damage to a building; on hp <= 0 call buildings.destroyBuilding(ctx, b, 0, true).
 * @returns {boolean} true if destroyed
 */
export function damageBuilding(ctx, b, amount) {
  const B = ctx.buildings
  if (!(b >= 0 && b < B.capacity && B.alive[b] === 1)) return false
  const hp = B.hp[b] - amount
  B.hp[b] = hp
  if (hp > 0) {
    const C = ctx.combat
    const tick = ctx.tick
    if (C && tick >= C.alertNext) {
      const ch = B.chunk[b]
      if (ch >= 0 && ch < C.alertAt.length && tick >= C.alertAt[ch]) {
        C.alertAt[ch] = tick + ALERT_CHUNK_TICKS
        C.alertNext = tick + ALERT_GAP_TICKS
        ctx.events.emit(EV_BUILDING_ATTACKED, B.type[b], B.door[b], tick)
      }
    }
    return false
  }
  destroyBuilding(ctx, b, 0, true)
  const C = ctx.combat
  if (C) { C.stats.buildingKills++; C.totals.buildingKills++ }
  return true
}

// ------------------------------------------------------------------ training

/**
 * Queue a unit at a Warden Hall: checks BUILDINGS[type].trains includes unitType,
 * ctx.tier >= UNITS[unitType].tier, trainLen < TRAIN_QUEUE, then payCost(UNITS cost).
 * On payment failure emits EV_CANNOT_AFFORD (a = unitType, b = 1).
 * @returns {boolean}
 */
export function enqueueTraining(ctx, b, unitType) {
  const B = ctx.buildings
  if (!(b >= 0 && b < B.capacity && B.alive[b] === 1)) return false
  if (B.site[b]) return false // a hall under construction trains nothing
  if (!(unitType > 0 && unitType < UNIT_COUNT)) return false
  if ((HALL_TRAINS[B.type[b]] & (1 << unitType)) === 0) return false
  if (ctx.tier < U_TIER[unitType]) return false
  const len = B.trainLen[b]
  if (len >= TRAIN_QUEUE) return false
  if (!payCost(ctx, UNITS[unitType].cost)) {
    ctx.events.emit(EV_CANNOT_AFFORD, unitType, 1, ctx.tick)
    return false
  }
  B.trainQ[b * TRAIN_QUEUE + len] = unitType
  B.trainLen[b] = len + 1
  if (len === 0) B.progress[b] = 0
  return true
}

/** Remove the LAST queued unit and refund its full cost. @returns {boolean} */
export function cancelTraining(ctx, b) {
  const B = ctx.buildings
  if (!(b >= 0 && b < B.capacity && B.alive[b] === 1)) return false
  const len = B.trainLen[b]
  if (len === 0) return false
  const t = B.trainQ[b * TRAIN_QUEUE + len - 1]
  B.trainQ[b * TRAIN_QUEUE + len - 1] = 0
  B.trainLen[b] = len - 1
  if (len === 1) { B.progress[b] = 0; B.status[b] = BS_IDLE }
  refundCost(ctx, UNITS[t].cost, 1)
  return true
}

function tickHalls(ctx) {
  const B = ctx.buildings
  const world = ctx.world
  for (let h = 0; h < HALL_TYPES.length; h++) {
    const bt = HALL_TYPES[h]
    const list = B.typeList[bt]
    const cnt = B.typeCount[bt]
    for (let k = 0; k < cnt; k++) {
      const b = list[k]
      if (B.site[b]) continue // construction site: buildings.js owns its status/progress
      const len = B.trainLen[b]
      if (len === 0) { B.status[b] = BS_IDLE; B.progress[b] = 0; continue }
      if (B.paused[b]) { B.status[b] = BS_PAUSED; continue }
      B.status[b] = BS_OK
      const o = b * TRAIN_QUEUE
      const ut = B.trainQ[o]
      if (B.progress[b] < U_TRAIN_TICKS[ut]) B.progress[b]++
      if (B.progress[b] < U_TRAIN_TICKS[ut]) continue
      const door = B.door[b]
      const id = spawnUnit(ctx, ut, (door & world.mask) + 0.5, (door >> world.shift) + 0.5, F_PLAYER)
      if (id < 0) continue // pool full: hold at completion
      for (let q = 1; q < len; q++) B.trainQ[o + q - 1] = B.trainQ[o + q]
      B.trainQ[o + len - 1] = 0
      B.trainLen[b] = len - 1
      B.progress[b] = 0
      if (len - 1 === 0) B.status[b] = BS_IDLE
      const r = B.rally[b]
      if (r >= 0) commandMove(ctx, id, r & world.mask, r >> world.shift)
      ctx.combat.totals.trained++
      ctx.events.emit(EV_UNIT_TRAINED, ut, id, ctx.tick)
    }
  }
}

// ------------------------------------------------------------------ searches

// nearestUnitIn query + scan state (module scratch; never held across calls). Typed slots
// rather than module `let`s or double arguments: a double written to a script-context slot
// or passed to a non-inlined call is boxed into a fresh HeapNumber every time.
//   _SF: [0] bestD2, [1] reach2 (always-acceptable distance^2), [2] qx, [3] qy, [4] maxR
//   _SI: [0] best, [1] seen, [2] stop, [3] fromTile (-1 = no reachability filter)
const _SF = new Float64Array(5)
const _SI = new Int32Array(4)

/** Set the next nearestUnitIn query. fromTile >= 0 skips candidates farther than sqrt(reach2)
 * that stand in another walk region (across water or a cliff): they can be seen, not reached. */
function unitQuery(x, y, maxR, fromTile, reach) {
  _SF[2] = x; _SF[3] = y; _SF[4] = maxR; _SF[1] = reach * reach
  _SI[3] = fromTile
}

/** Scan grid.items[a, b) for the nearest unit of `faction`; sets _SI[2] once a crowd shortcut applies. */
function scanSpan(ctx, items, a, b, alive, fac, X, Y, faction, self) {
  const SF = _SF, SI = _SI
  const x = SF[2], y = SF[3], from = SI[3]
  for (let q = a; q < b; q++) {
    const j = items[q]
    if (j === self || alive[j] === 0 || fac[j] !== faction) continue
    const dx = X[j] - x, dy = Y[j] - y
    const d2 = dx * dx + dy * dy
    const bd2 = SF[0], best = SI[0]
    if ((d2 < bd2 || (d2 === bd2 && (best < 0 || j < best))) &&
      (from < 0 || d2 <= SF[1] || ctx.path.sameRegion(unitTileOf(ctx, j), from))) {
      SI[0] = j; SF[0] = d2
    }
    // crowds (a courier pile): any prey within a tile will do; past CROWD_CAP candidates
    // the best so far will; past CROWD_GIVEUP with nothing in range, give up for this scan
    const seen = SI[1] + 1
    SI[1] = seen
    if (seen >= CROWD_SCAN && (SF[0] <= NEAR_ENOUGH2 || (SI[0] >= 0 ? seen >= CROWD_CAP : seen >= CROWD_GIVEUP))) {
      SI[2] = 1
      return
    }
  }
}

/**
 * Nearest alive unit of `faction` in `grid` within maxR of (x,y) (all set by unitQuery),
 * excluding `self`. Ring search reading the grid's cell spans in place (a cell can hold
 * thousands of couriers), skipping cells whose rect is farther than the best so far, with
 * early exit. Ties -> lower id. In a crowd it settles early (see scanSpan), so the result is
 * "a near one" rather than the exact nearest once more than CROWD_SCAN candidates were examined.
 */
function nearestUnitIn(ctx, grid, faction, self) {
  const u = ctx.units
  const alive = u.alive, fac = u.faction, X = u.x, Y = u.y
  const SF = _SF, SI = _SI
  const x = SF[2], y = SF[3], maxR = SF[4]
  const cs = grid.cellSize, cw = grid.cw, ch = grid.ch
  const start = grid.cellStart, items = grid.items
  const cx = grid.cellX(x), cy = grid.cellY(y)
  const maxRing = ((maxR / cs) | 0) + 1
  SI[0] = -1; SF[0] = maxR * maxR; SI[1] = 0; SI[2] = 0
  for (let r = 0; r <= maxRing; r++) {
    if (SI[0] >= 0) { const lim = (r - 1) * cs; if (lim > 0 && lim * lim > SF[0]) break }
    for (let yy = cy - r; yy <= cy + r; yy++) {
      if (yy < 0 || yy >= ch) continue
      const edge = yy === cy - r || yy === cy + r
      const ry0 = yy * cs, ry1 = ry0 + cs
      const ddy = y < ry0 ? ry0 - y : y > ry1 ? y - ry1 : 0
      const step = edge || r === 0 ? 1 : 2 * r
      for (let xx = cx - r; xx <= cx + r; xx += step) {
        if (xx < 0 || xx >= cw) continue
        const rx0 = xx * cs, rx1 = rx0 + cs
        const ddx = x < rx0 ? rx0 - x : x > rx1 ? x - rx1 : 0
        if (ddx * ddx + ddy * ddy > SF[0]) continue // whole cell out of range / farther than best
        const c = yy * cw + xx
        scanSpan(ctx, items, start[c], start[c + 1], alive, fac, X, Y, faction, self)
        if (SI[2] !== 0) return SI[0]
      }
    }
  }
  return SI[0]
}

/**
 * Nearest building (point-to-footprint distance) within maxR of (x,y), scanning world.occ
 * in Chebyshev rings with early exit. Ties -> lower id.
 */
function nearestBuildingIn(ctx, x, y, maxR, fromTile) {
  const world = ctx.world
  const occ = world.occ, shift = world.shift, W = world.w, H = world.h
  const tx = x | 0, ty = y | 0
  const maxRing = Math.ceil(maxR) + 1
  let best = -1, bestD2 = maxR * maxR
  for (let r = 0; r <= maxRing; r++) {
    if (best >= 0 && r >= 1 && (r - 1) * (r - 1) > bestD2) break
    const ya = ty - r, yb = ty + r
    for (let yy = ya; yy <= yb; yy++) {
      if (yy < 0 || yy >= H) continue
      const step = (yy === ya || yy === yb) ? 1 : (r === 0 ? 1 : 2 * r)
      const dy = y < yy ? yy - y : y > yy + 1 ? y - yy - 1 : 0
      for (let xx = tx - r; xx <= tx + r; xx += step) {
        if (xx < 0 || xx >= W) continue
        const b = occ[(yy << shift) | xx]
        if (b < 0) continue
        const dx = x < xx ? xx - x : x > xx + 1 ? x - xx - 1 : 0
        const d2 = dx * dx + dy * dy
        if (d2 < bestD2 || (d2 === bestD2 && (best < 0 || b < best))) {
          if (b !== best && buildingApproach(ctx, b, fromTile) < 0) continue // no side reachable
          best = b; bestD2 = d2
        }
      }
    }
  }
  return best
}

/** Point-to-footprint-rect distance squared. */
function rectD2(B, b, x, y) {
  const bx = B.tx[b], by = B.ty[b]
  const ex = bx + B.w[b], ey = by + B.h[b]
  const dx = x < bx ? bx - x : x > ex ? x - ex : 0
  const dy = y < by ? by - y : y > ey ? y - ey : 0
  return dx * dx + dy * dy
}

// ------------------------------------------------------------------ per tick

/**
 * The Hearth's own ward: a weak bolt so a slow first-timer is not wiped by wave 1 before the
 * hints reach Ward Towers. Kills a crawler in ~4 s, far short of a real defence.
 */
export const HEARTH_WARD = Object.freeze({ range: 5, attack: 8, cooldown: 20, fx: FX_ARROW })

/** One stationary shooter (tower or Hearth ward) for one tick: retarget, fire on cooldown. */
function shooterStep(ctx, b, range, attack, cd, fxk, haveBlight) {
  const B = ctx.buildings
  const u = ctx.units
  const C = ctx.combat
  const tick = ctx.tick
  if (B.cooldown[b] > 0) B.cooldown[b]--
  if (!haveBlight) { B.target[b] = -1; return }
  const cx = B.tx[b] + B.w[b] * 0.5, cy = B.ty[b] + B.h[b] * 0.5
  let t = B.target[b]
  if (t >= 0) {
    if (!u.isAlive(t, B.targetGen[b])) t = -1
    else {
      const dx = u.x[t] - cx, dy = u.y[t] - cy
      if (dx * dx + dy * dy > range * range) t = -1
    }
  }
  if (t < 0 || (tick + b) % RETARGET_INTERVAL === 0) {
    unitQuery(cx, cy, range, -1, 0)
    const n = nearestUnitIn(ctx, C.blightGrid, F_BLIGHT, -1)
    if (n >= 0) t = n
  }
  if (t < 0) { B.target[b] = -1; return }
  B.target[b] = t
  B.targetGen[b] = u.gen[t]
  if (B.cooldown[b] === 0) {
    ctx.fx.emit(fxk, cx, cy - 0.4, u.x[t], u.y[t], tick)
    B.cooldown[b] = cd
    C.stats.shots++; C.totals.shots++
    if (damageUnit(ctx, t, attack)) B.target[b] = -1
  }
}

function tickTowers(ctx, haveBlight) {
  const B = ctx.buildings
  for (let h = 0; h < TOWER_TYPES.length; h++) {
    const bt = TOWER_TYPES[h]
    const list = B.typeList[bt]
    const cnt = B.typeCount[bt]
    const range = TW_RANGE[bt], attack = TW_ATTACK[bt], cd = TW_COOLDOWN[bt], fxk = TW_FX[bt]
    for (let k = 0; k < cnt; k++) if (!B.site[list[k]]) shooterStep(ctx, list[k], range, attack, cd, fxk, haveBlight)
  }
  const hl = B.typeList[B_HEARTH], hc = B.typeCount[B_HEARTH]
  const W = HEARTH_WARD
  for (let k = 0; k < hc; k++) shooterStep(ctx, hl[k], W.range, W.attack, W.cooldown, W.fx, haveBlight)
}

/** Pick a fresh target for unit i. Writes target fields; returns true if one was found. */
function acquire(ctx, i, ord, scanBuildings) {
  const u = ctx.units
  const x = u.x[i], y = u.y[i], t = u.type[i]
  const radius = ord === O_HOLD ? U_RANGE[t] : U_SIGHT[t]
  if (u.faction[i] === F_PLAYER) {
    if (u.factionCount[F_BLIGHT] === 0) return false
    // ranged soldiers may shoot across water at what is already in range; anything farther
    // must be reachable, or the chase fails and the unit wedges on the bank
    unitQuery(x, y, radius, unitTileOf(ctx, i), U_RANGE[t])
    const e = nearestUnitIn(ctx, ctx.combat.blightGrid, F_BLIGHT, i)
    if (e < 0) return false
    u.target[i] = e; u.targetGen[i] = u.gen[e]; u.targetKind[i] = TK_UNIT
    return true
  }
  // Blight: soldiers first, then buildings, couriers only when nothing else is in sight (a wave
  // that cut through the courier swarm left the economy dead while the towers won the fight).
  // Husks go for buildings before soldiers. Soldiers come from sepGrid (non-couriers only), so
  // a courier pile costs nothing here.
  const bFirst = U_VS_BUILDING[t] >= 2
  const from = unitTileOf(ctx, i)
  if (bFirst && scanBuildings && ord !== O_HOLD) {
    const b = nearestBuildingIn(ctx, x, y, radius, from)
    if (b >= 0) { setBuildingTarget(ctx, i, b); return true }
  }
  if (u.factionCount[F_PLAYER] > 0 && (!bFirst || scanBuildings)) {
    unitQuery(x, y, radius, from, U_RANGE[t])
    const e = nearestUnitIn(ctx, ctx.sepGrid || ctx.unitGrid, F_PLAYER, i)
    if (e >= 0) { u.target[i] = e; u.targetGen[i] = u.gen[e]; u.targetKind[i] = TK_UNIT; return true }
  }
  if (!bFirst && scanBuildings) {
    const b = nearestBuildingIn(ctx, x, y, radius, from)
    if (b >= 0) { setBuildingTarget(ctx, i, b); return true }
  }
  if ((scanBuildings || ord === O_HOLD) && u.typeCount[U_COURIER] > 0) {
    unitQuery(x, y, radius, from, U_RANGE[t])
    const e = nearestUnitIn(ctx, ctx.unitGrid, F_PLAYER, i)
    if (e >= 0) { u.target[i] = e; u.targetGen[i] = u.gen[e]; u.targetKind[i] = TK_UNIT; return true }
  }
  return false
}

function setBuildingTarget(ctx, i, b) {
  const u = ctx.units
  u.target[i] = b
  u.targetGen[i] = ctx.buildings.gen[b]
  u.targetKind[i] = TK_BUILDING
}

/** Reached orderTile (or failed to): finish the order. */
function arrive(ctx, i, ord, failed) {
  const u = ctx.units
  if (ord === O_RAID && !failed) {
    const from = unitTileOf(ctx, i)
    const b = nearestBuilding(ctx, u.x[i], u.y[i], null, 0, from)
    const goal = b >= 0 ? buildingApproach(ctx, b, from) : -1
    if (goal >= 0) {
      u.orderTile[i] = goal
      setBuildingTarget(ctx, i, b)
      return
    }
  }
  u.order[i] = O_NONE
  u.orderTile[i] = -1
  stopUnit(ctx, i)
}

/**
 * After tickLogistics:
 *  1. halls: training progress, spawn at door, send to rally (EV_UNIT_TRAINED)
 *  2. towers: acquire nearest Blight unit in range, fire on cooldown (FX per content)
 *  3. every non-courier unit: cooldown--, order logic, retarget on (tick + id) % RETARGET_INTERVAL,
 *     chase / attack in range, emit fx, apply damage instantly
 * Damage is instant and deterministic (no projectile simulation); fx are cosmetic.
 * Budget: O(combat units * nearby candidates), retargeting staggered.
 * @param {Ctx} ctx
 */
export function tickCombat(ctx) {
  const C = ctx.combat
  const u = ctx.units
  const B = ctx.buildings
  const world = ctx.world
  const tick = ctx.tick
  const fx = ctx.fx
  C.stats.shots = C.stats.kills = C.stats.buildingKills = 0

  // ---- 0. Blight-only grid for player/tower scans
  const haveBlight = u.factionCount[F_BLIGHT] > 0
  const bg = C.blightGrid
  bg.clear()
  const hi = u.hi
  const alive = u.alive, type = u.type, fac = u.faction
  if (haveBlight) {
    for (let i = 0; i < hi; i++) if (alive[i] === 1 && fac[i] === F_BLIGHT) bg.add(i, u.x[i], u.y[i])
  }
  bg.build()

  // ---- 1. halls, 2. towers
  tickHalls(ctx)
  tickTowers(ctx, haveBlight)

  // ---- 3. units
  const X = u.x, Y = u.y, mstate = u.mstate, order = u.order, orderTile = u.orderTile
  const target = u.target, targetGen = u.targetGen, targetKind = u.targetKind
  const cooldown = u.cooldown, repathAt = u.repathAt, goal = u.goal
  const mask = world.mask, shift = world.shift
  for (let i = 0; i < hi; i++) {
    if (alive[i] === 0) continue
    const t = type[i]
    if (t === U_COURIER) continue
    if (cooldown[i] > 0) cooldown[i]--
    let ord = order[i]
    let tg = target[i]
    let kind = targetKind[i]

    // ---- validate target
    if (tg >= 0) {
      const ok = kind === TK_UNIT ? u.isAlive(tg, targetGen[i]) : kind === TK_BUILDING ? B.isAlive(tg, targetGen[i]) : false
      if (!ok) {
        clearTarget(u, i); tg = -1
        if (ord === O_ATTACK) { ord = O_NONE; order[i] = O_NONE; orderTile[i] = -1 }
        if (ord === O_NONE) halt(ctx, u, i) // stop a chase whose prey vanished
      }
    }

    // ---- retarget
    if (ord !== O_MOVE && ord !== O_ATTACK) {
      const blight = fac[i] === F_BLIGHT
      const stag = (tick + i) % RETARGET_INTERVAL === 0
      if (tg < 0 || stag) {
        // player scans are cheap (Blight-only grid); Blight building scans are throttled
        const scanB = blight && (stag || ((tick + i) & BSCAN_MASK) === 0 || mstate[i] === M_ARRIVED)
        if (blight || haveBlight) {
          if (acquire(ctx, i, ord, scanB)) { tg = target[i]; kind = targetKind[i] }
        }
      }
    }

    const ms = mstate[i]
    if (tg >= 0) {
      // ---- engage
      const x = X[i], y = Y[i]
      let d2, tx, ty, chaseTile
      if (kind === TK_UNIT) {
        tx = X[tg]; ty = Y[tg]
        const dx = tx - x, dy = ty - y
        d2 = dx * dx + dy * dy
        let cx = tx | 0, cy = ty | 0
        chaseTile = (cy << shift) | cx
      } else {
        d2 = rectD2(B, tg, x, y)
        tx = B.tx[tg] + B.w[tg] * 0.5; ty = B.ty[tg] + B.h[tg] * 0.5
        // walk to any reachable side of the footprint, not only the door: a building whose
        // door faces into a sealed base must still be attackable from outside
        const gi = goal[i]
        if (gi >= 0 && world.pass[gi] === 1 && onBuildingRing(ctx, tg, gi) &&
          (ms === M_MOVING || ms === M_WAIT_PATH || ms === M_ARRIVED)) chaseTile = gi
        else chaseTile = d2 <= U_RANGE[t] * U_RANGE[t] ? B.door[tg] : buildingApproach(ctx, tg, unitTileOf(ctx, i))
        if (chaseTile < 0) {
          clearTarget(u, i) // no side reachable from here
          if (ord === O_ATTACK) { order[i] = O_NONE; orderTile[i] = -1 }
          if (ord === O_ATTACK || ord === O_NONE) stopUnit(ctx, i)
          continue
        }
      }
      const range = U_RANGE[t]
      if (d2 <= range * range) {
        if (ms === M_MOVING || ms === M_WAIT_PATH) stopUnit(ctx, i)
        if (cooldown[i] === 0) {
          const dmg = kind === TK_BUILDING ? U_ATTACK[t] * U_VS_BUILDING[t] : U_ATTACK[t]
          fx.emit(U_FX[t], x, y, tx, ty, tick)
          cooldown[i] = U_COOLDOWN[t]
          C.stats.shots++; C.totals.shots++
          const killed = kind === TK_UNIT ? damageUnit(ctx, tg, dmg) : damageBuilding(ctx, tg, dmg)
          if (killed) {
            clearTarget(u, i)
            if (ord === O_ATTACK) { order[i] = O_NONE; orderTile[i] = -1 }
          }
        }
      } else if (ord === O_HOLD) {
        clearTarget(u, i)
      } else if (kind === TK_UNIT && ord !== O_ATTACK && d2 > (LEASH * U_SIGHT[t]) * (LEASH * U_SIGHT[t])) {
        clearTarget(u, i) // leash: let it go, resume the order next tick
        if (ord === O_NONE) halt(ctx, u, i)
      } else if (ms === M_FAILED && goal[i] === chaseTile) {
        clearTarget(u, i) // unreachable
        if (ord === O_ATTACK) { order[i] = O_NONE; orderTile[i] = -1 }
        if (ord === O_ATTACK || ord === O_NONE) stopUnit(ctx, i)
      } else if (ms === M_ARRIVED && goal[i] === chaseTile && unitTileOf(ctx, i) === chaseTile) {
        // standing on the chase tile but just out of reach (a crowd pushed it off the tile
        // centre, or the prey sits in a far corner): orderMove would "arrive" again on the
        // spot, so close the last fraction of a tile directly
        closeIn(ctx, i, tg, kind)
      } else if (tick >= repathAt[i] || ms === M_IDLE || ms === M_ARRIVED || ms === M_FAILED) {
        if (goal[i] !== chaseTile || (ms !== M_MOVING && ms !== M_WAIT_PATH)) {
          orderMove(ctx, i, chaseTile & mask, chaseTile >> shift)
        }
        repathAt[i] = tick + CHASE_REPATH_TICKS
      }
      continue
    }

    // ---- no target: pursue the order
    if (ord === O_MOVE || ord === O_ATTACK_MOVE || ord === O_RAID) {
      const ot = orderTile[i]
      if (ot < 0) { order[i] = O_NONE; stopUnit(ctx, i); continue }
      if (ord === O_RAID && world.doorCount[ot] === 0) {
        // the building we were raiding is gone: raid the nearest one from here
        arrive(ctx, i, O_RAID, false)
        if (order[i] === O_RAID && target[i] >= 0) moveToTile(ctx, i, orderTile[i])
        continue
      }
      if (ms === M_ARRIVED || ms === M_FAILED) {
        if (goal[i] === ot) arrive(ctx, i, ord, ms === M_FAILED)
        else moveToTile(ctx, i, ot)
      } else if (ms === M_IDLE || goal[i] !== ot) {
        moveToTile(ctx, i, ot)
      }
    } else if (ord === O_HOLD && (ms === M_MOVING || ms === M_WAIT_PATH)) {
      stopUnit(ctx, i) // hold never walks
    } else if (ord === O_NONE && fac[i] === F_BLIGHT && ms !== M_MOVING && ms !== M_WAIT_PATH &&
      ((tick + i) & BLIGHT_RERAID_MASK) === 0 && B.count > 0) {
      // idle Blight (raid path failed, or it outlived its targets) goes looking again
      commandRaid(ctx, i, -1)
    }
    // O_NONE without a target keeps whatever raw orderMove a script gave it (sticky arrival)
  }

  // ---- 4. courier losses, summed so a wave through the swarm is one toast, not twenty
  if (C.lostCount > 0 && tick >= C.lostNext) {
    ctx.events.emit(EV_COURIERS_LOST, C.lostCount, C.lostTile, tick)
    C.lostCount = 0
    C.lostNext = tick + LOST_TICKS
  }
}

/** Step unit i (one tick of its speed) toward the nearest point of its target, staying on walkable tiles. */
function closeIn(ctx, i, tg, kind) {
  const u = ctx.units
  const world = ctx.world
  const x = u.x[i], y = u.y[i]
  let px, py
  if (kind === TK_UNIT) { px = u.x[tg]; py = u.y[tg] } else {
    const B = ctx.buildings
    const bx = B.tx[tg], by = B.ty[tg], ex = bx + B.w[tg], ey = by + B.h[tg]
    px = x < bx ? bx : x > ex ? ex : x
    py = y < by ? by : y > ey ? ey : y
  }
  const dx = px - x, dy = py - y
  const d = Math.sqrt(dx * dx + dy * dy)
  if (d < 1e-6) return
  const sp = U_SPEED[u.type[i]]
  const f = (sp < d ? sp : d) / d
  const nx = x + dx * f, ny = y + dy * f
  if (nx < 0 || ny < 0 || nx >= world.w || ny >= world.h) return
  if (world.pass[((ny | 0) << world.shift) | (nx | 0)] !== 1) return
  u.x[i] = nx; u.y[i] = ny
  u.vx[i] = nx - u.px[i]; u.vy[i] = ny - u.py[i]
}

/** Stop a unit that was chasing (moving or waiting for a path); leaves arrivals alone. */
function halt(ctx, u, i) {
  const ms = u.mstate[i]
  if (ms === M_MOVING || ms === M_WAIT_PATH) stopUnit(ctx, i)
}
