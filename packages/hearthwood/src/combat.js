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
  U_COURIER, U_TREANT, UNIT_COUNT, F_PLAYER, F_BLIGHT,
  M_IDLE, M_WAIT_PATH, M_MOVING, M_ARRIVED, M_FAILED,
  O_NONE, O_MOVE, O_ATTACK_MOVE, O_ATTACK, O_HOLD, O_RAID,
  TK_NONE, TK_UNIT, TK_BUILDING,
  BF_TOWER, BF_HALL, BS_OK, BS_IDLE, BS_PAUSED,
  RETARGET_INTERVAL, CHASE_REPATH_TICKS,
  EV_UNIT_TRAINED, EV_CANNOT_AFFORD,
} from './constants.js'
import {
  BUILDINGS, UNITS, B_FLAGS, U_ATTACK, U_RANGE, U_COOLDOWN, U_SIGHT, U_VS_BUILDING, U_FX,
} from './content.js'
import { CellGrid } from './world.js'
import { spawnUnit, despawnUnit, orderMove, stopUnit } from './units.js'
import { destroyBuilding, payCost, refundCost, nearestBuilding } from './buildings.js'

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
/** Player O_NONE / raid leash on unit targets, as a multiple of sight. */
const LEASH = 1.5

/** Must not throw (createContext calls it). @returns {CombatState} */
export function createCombat(ctx) {
  const cap = ctx.units ? ctx.units.capacity : MAX_UNITS
  const w = ctx.world ? ctx.world.w : 256, h = ctx.world ? ctx.world.h : 256
  return {
    scratch: new Int32Array(4096),
    stats: { shots: 0, kills: 0, buildingKills: 0 },
    /** cumulative counters (never reset) */
    totals: { shots: 0, kills: 0, buildingKills: 0, trained: 0 },
    _cap: cap,
    /** Blight-only spatial hash, rebuilt every tickCombat */
    blightGrid: new CellGrid(w, h, UNIT_CELL_SHIFT, cap),
    /** sort buffer for commandGroup */
    _group: new Int32Array(256),
  }
}

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
  if (!(building >= 0 && building < B.capacity && B.alive[building] === 1)) {
    building = nearestBuilding(ctx, u.x[id], u.y[id], null, 0)
  }
  if (building < 0) {
    u.order[id] = O_NONE
    u.orderTile[id] = -1
    return
  }
  u.order[id] = O_RAID
  u.orderTile[id] = B.door[building]
  moveToTile(ctx, id, B.door[building])
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
  despawnUnit(ctx, id, true)
  const C = ctx.combat
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
  if (hp > 0) return false
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

/**
 * Nearest alive unit of `faction` in `grid` within maxR of (x,y), excluding `self`.
 * Ring search with early exit. Ties -> lower id.
 */
function nearestUnitIn(ctx, grid, x, y, maxR, faction, self) {
  const u = ctx.units
  const scr = ctx.combat.scratch
  const alive = u.alive, fac = u.faction, X = u.x, Y = u.y
  const cs = grid.cellSize
  const cx = grid.cellX(x), cy = grid.cellY(y)
  const maxRing = ((maxR / cs) | 0) + 1
  let best = -1, bestD2 = maxR * maxR
  for (let r = 0; r <= maxRing; r++) {
    if (best >= 0) { const lim = (r - 1) * cs; if (lim > 0 && lim * lim > bestD2) break }
    const n = grid.queryRing(cx, cy, r, scr)
    for (let k = 0; k < n; k++) {
      const j = scr[k]
      if (j === self || alive[j] === 0 || fac[j] !== faction) continue
      const dx = X[j] - x, dy = Y[j] - y
      const d2 = dx * dx + dy * dy
      if (d2 < bestD2 || (d2 === bestD2 && (best < 0 || j < best))) { best = j; bestD2 = d2 }
    }
  }
  return best
}

/**
 * Nearest building (point-to-footprint distance) within maxR of (x,y), scanning world.occ
 * in Chebyshev rings with early exit. Ties -> lower id.
 */
function nearestBuildingIn(ctx, x, y, maxR) {
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
        if (d2 < bestD2 || (d2 === bestD2 && (best < 0 || b < best))) { best = b; bestD2 = d2 }
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

function tickTowers(ctx, haveBlight) {
  const B = ctx.buildings
  const u = ctx.units
  const C = ctx.combat
  const grid = C.blightGrid
  const tick = ctx.tick
  const fx = ctx.fx
  for (let h = 0; h < TOWER_TYPES.length; h++) {
    const bt = TOWER_TYPES[h]
    const list = B.typeList[bt]
    const cnt = B.typeCount[bt]
    const range = TW_RANGE[bt], r2 = range * range
    for (let k = 0; k < cnt; k++) {
      const b = list[k]
      if (B.cooldown[b] > 0) B.cooldown[b]--
      if (!haveBlight) { B.target[b] = -1; continue }
      const cx = B.tx[b] + B.w[b] * 0.5, cy = B.ty[b] + B.h[b] * 0.5
      let t = B.target[b]
      if (t >= 0) {
        if (!u.isAlive(t, B.targetGen[b])) t = -1
        else {
          const dx = u.x[t] - cx, dy = u.y[t] - cy
          if (dx * dx + dy * dy > r2) t = -1
        }
      }
      if (t < 0 || (tick + b) % RETARGET_INTERVAL === 0) {
        const n = nearestUnitIn(ctx, grid, cx, cy, range, F_BLIGHT, -1)
        if (n >= 0) t = n
      }
      if (t < 0) { B.target[b] = -1; continue }
      B.target[b] = t
      B.targetGen[b] = u.gen[t]
      if (B.cooldown[b] === 0) {
        fx.emit(TW_FX[bt], cx, cy - 0.4, u.x[t], u.y[t], tick)
        B.cooldown[b] = TW_COOLDOWN[bt]
        C.stats.shots++; C.totals.shots++
        if (damageUnit(ctx, t, TW_ATTACK[bt])) B.target[b] = -1
      }
    }
  }
}

/** Pick a fresh target for unit i. Writes target fields; returns true if one was found. */
function acquire(ctx, i, ord, scanBuildings) {
  const u = ctx.units
  const x = u.x[i], y = u.y[i], t = u.type[i]
  const radius = ord === O_HOLD ? U_RANGE[t] : U_SIGHT[t]
  if (u.faction[i] === F_PLAYER) {
    if (u.factionCount[F_BLIGHT] === 0) return false
    const e = nearestUnitIn(ctx, ctx.combat.blightGrid, x, y, radius, F_BLIGHT, i)
    if (e < 0) return false
    u.target[i] = e; u.targetGen[i] = u.gen[e]; u.targetKind[i] = TK_UNIT
    return true
  }
  // Blight: player units (couriers included) first, else buildings; Husks the other way round.
  const bFirst = U_VS_BUILDING[t] >= 2
  if (bFirst && scanBuildings && ord !== O_HOLD) {
    const b = nearestBuildingIn(ctx, x, y, radius)
    if (b >= 0) { setBuildingTarget(ctx, i, b); return true }
  }
  if (!bFirst || scanBuildings) {
    const e = u.factionCount[F_PLAYER] > 0 ? nearestUnitIn(ctx, ctx.unitGrid, x, y, radius, F_PLAYER, i) : -1
    if (e >= 0) { u.target[i] = e; u.targetGen[i] = u.gen[e]; u.targetKind[i] = TK_UNIT; return true }
  }
  if (!bFirst && scanBuildings) {
    const b = nearestBuildingIn(ctx, x, y, radius)
    if (b >= 0) { setBuildingTarget(ctx, i, b); return true }
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
    const b = nearestBuilding(ctx, u.x[i], u.y[i], null, 0)
    if (b >= 0) {
      u.orderTile[i] = ctx.buildings.door[b]
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
        chaseTile = B.door[tg]
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
    }
    // O_NONE without a target keeps whatever raw orderMove a script gave it (sticky arrival)
  }
}

/** Stop a unit that was chasing (moving or waiting for a path); leaves arrivals alone. */
function halt(ctx, u, i) {
  const ms = u.mstate[i]
  if (ms === M_MOVING || ms === M_WAIT_PATH) stopUnit(ctx, i)
}
