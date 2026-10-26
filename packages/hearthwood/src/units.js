// Generic unit layer: spawn/despawn, movement along PathService paths, separation,
// unit spatial grid, picking. OWNER: units implementer. Contract: ARCHITECTURE.md §11.
//
// Hot path notes (tickUnits runs over every unit every tick):
//  - one fused pass per unit: px/py snapshot, path poll, path following, blocked-tile
//    eject, soft separation, then staging into ctx.unitGrid. Allocation-free.
//  - separation reads LAST tick's ctx.unitGrid (the cell index is still intact while the
//    new one is being staged: CellGrid.add only writes the pending arrays until build()).
//  - paths are shared immutable Int32Arrays from PathService; never mutated here.

import {
  M_IDLE, M_WAIT_PATH, M_MOVING, M_ARRIVED, M_FAILED,
  J_NONE, U_COURIER, FX_SPAWN, FX_DEATH, SEPARATION_RADIUS, SEPARATION_PUSH,
} from './constants.js'
import { U_SPEED, U_FACTION, U_RADIUS } from './content.js'
import { PATH_PENDING, PATH_NONE } from './path.js'
import { abortJob } from './logistics.js'

/** @typedef {import('./context.js').Ctx} Ctx */

/** Max tiles a unit stuck inside a footprint is moved to reach a walkable tile. */
const EJECT_RADIUS = 8
/** Module scratch for grid queries (temporary per call; never holds state between calls). */
let SCR = new Int32Array(8192)
function scratch(n) {
  if (SCR.length < n) SCR = new Int32Array(n)
  return SCR
}

/** Tick-local counters (debug / tests). Reset at the start of every tickUnits. */
export const unitStats = { moved: 0, arrived: 0, repaths: 0, ejected: 0, separated: 0 }

/**
 * Allocate a unit at world position (x,y) in tile units. hp = max, px/py = x/y,
 * mstate M_IDLE, order O_NONE, job J_NONE. Emits FX_SPAWN.
 * Does NOT add to ctx.unitGrid until the next tickUnits.
 * @param {Ctx} ctx
 * @param {number} type U_*
 * @param {number} x
 * @param {number} y
 * @param {number} [faction] defaults to UNITS[type].faction
 * @returns {number} id or -1 if the pool is full
 */
export function spawnUnit(ctx, type, x, y, faction) {
  const u = ctx.units
  const f = faction === undefined || faction === null ? U_FACTION[type] : faction
  const id = u.alloc(type, f)
  if (id < 0) return -1
  const w = ctx.world
  // keep inside the map (tile units)
  if (!(x >= 0)) x = 0.5; else if (x >= w.w) x = w.w - 0.5
  if (!(y >= 0)) y = 0.5; else if (y >= w.h) y = w.h - 0.5
  u.x[id] = u.px[id] = x
  u.y[id] = u.py[id] = y
  ctx.fx.emit(FX_SPAWN, x, y, x, y, ctx.tick)
  return id
}

/**
 * Remove a unit. If it is a courier with job !== J_NONE, calls logistics.abortJob first.
 * Emits FX_DEATH when `died`. Safe to call during any system's loop (the slot is freed
 * immediately; grids are rebuilt next tick, so grid readers must check alive).
 * @param {Ctx} ctx
 * @param {number} id
 * @param {boolean} [died=false]
 */
export function despawnUnit(ctx, id, died = false) {
  const u = ctx.units
  if (id < 0 || id >= u.capacity || !u.alive[id]) return
  if (u.type[id] === U_COURIER && u.job[id] !== J_NONE) abortJob(ctx, id)
  if (died) ctx.fx.emit(FX_DEATH, u.x[id], u.y[id], u.x[id], u.y[id], ctx.tick)
  u.mstate[id] = M_IDLE
  u.goal[id] = -1
  u.pathJob[id] = -1
  u.free(id) // nulls path, bumps gen
}

/** Begin following a resolved path (path[0] is the start tile). */
function startPath(u, id, p) {
  if (p.length <= 1) { // [from]: already there
    u.path[id] = null
    u.mstate[id] = M_ARRIVED
    return
  }
  u.path[id] = p
  u.pathIdx[id] = 1
  u.pathJob[id] = -1
  u.mstate[id] = M_MOVING
}

/** Request a path from the unit's current tile to goal[id] and set mstate accordingly. */
function requestPath(ctx, u, id, from) {
  const g = u.goal[id]
  u.path[id] = null
  if (from === g) { u.mstate[id] = M_ARRIVED; u.pathJob[id] = -1; return }
  const job = ctx.path.request(from, g)
  const r = ctx.path.poll(job)
  if (r === PATH_PENDING) { u.pathJob[id] = job; u.mstate[id] = M_WAIT_PATH }
  else if (r === PATH_NONE) { u.pathJob[id] = -1; u.mstate[id] = M_FAILED }
  else startPath(u, id, r)
}

/**
 * Low-level movement command used by EVERY brain (logistics, combat, waves, UI via combat).
 * Sets goal = packed (tx,ty) (clamped to the map), clears path, then:
 *  - unit already on the goal tile -> mstate = M_ARRIVED immediately
 *  - goal tile not walkable -> M_FAILED immediately
 *  - else pathJob = ctx.path.request(currentTile, goal); polls once; if a path is already
 *    available -> M_MOVING (pathIdx = 1), PATH_NONE -> M_FAILED, else M_WAIT_PATH.
 * Re-issuing the same goal while M_MOVING/M_WAIT_PATH toward it is a no-op (cheap to spam).
 * Does not change `order`, `job` or targets.
 */
export function orderMove(ctx, id, tx, ty) {
  const u = ctx.units
  if (id < 0 || id >= u.capacity || !u.alive[id]) return
  const w = ctx.world
  tx |= 0; ty |= 0
  if (tx < 0) tx = 0; else if (tx >= w.w) tx = w.w - 1
  if (ty < 0) ty = 0; else if (ty >= w.h) ty = w.h - 1
  const g = (ty << w.shift) | tx
  const ms = u.mstate[id]
  if ((ms === M_MOVING || ms === M_WAIT_PATH) && u.goal[id] === g) return
  u.goal[id] = g
  u.path[id] = null
  u.pathJob[id] = -1
  const cur = unitTile(ctx, id)
  if (cur === g) { u.mstate[id] = M_ARRIVED; return }
  if (w.pass[g] !== 1) { u.mstate[id] = M_FAILED; return }
  requestPath(ctx, u, id, cur)
}

/** Stop in place: mstate = M_IDLE, path = null, goal = -1. Does not change order/job. */
export function stopUnit(ctx, id) {
  const u = ctx.units
  if (id < 0 || id >= u.capacity || !u.alive[id]) return
  u.mstate[id] = M_IDLE
  u.path[id] = null
  u.goal[id] = -1
  u.pathJob[id] = -1
}

/**
 * Per tick, FIRST unit system (after ctx.path.update()):
 *  1. for every alive unit: px = x, py = y
 *  2. M_WAIT_PATH: poll; path -> M_MOVING, PATH_NONE -> M_FAILED
 *  3. M_MOVING: advance by UNITS speed toward the centre of path[pathIdx]; snapping and
 *     carrying leftover distance to the next waypoint; if the next waypoint tile became
 *     unwalkable (and is not the goal) re-request from the current tile; on the last
 *     waypoint -> M_ARRIVED, path = null. vx/vy = displacement this tick.
 *  4. unit standing on an unwalkable tile (building placed on it): nudge to world.nearestWalkable
 *  5. soft separation for non-courier units that are not M_MOVING
 *  6. rebuild ctx.unitGrid with every alive unit
 * Budget: O(units). No allocation.
 * @param {Ctx} ctx
 */
export function tickUnits(ctx) {
  const u = ctx.units
  const world = ctx.world
  const pathSvc = ctx.path
  const grid = ctx.unitGrid
  const pass = world.pass, shift = world.shift, mask = world.mask, W = world.w, H = world.h
  const alive = u.alive, type = u.type, X = u.x, Y = u.y, PX = u.px, PY = u.py, VX = u.vx, VY = u.vy
  const mstate = u.mstate, paths = u.path, pathIdx = u.pathIdx, goal = u.goal, pathJob = u.pathJob
  const hi = u.hi
  const st = unitStats
  st.moved = st.arrived = st.repaths = st.ejected = st.separated = 0
  // scratch for separation queries
  const scr = scratch(8192)
  const sepR = SEPARATION_RADIUS, sepPush = SEPARATION_PUSH
  const doSep = grid.count > 0 // grid from last tick has something in it

  grid.clear()
  for (let i = 0; i < hi; i++) {
    if (alive[i] === 0) continue
    let x = X[i], y = Y[i]
    PX[i] = x; PY[i] = y
    let ms = mstate[i]

    // ---- 2. waiting for a path
    if (ms === M_WAIT_PATH) {
      const r = pathSvc.poll(pathJob[i])
      if (r !== PATH_PENDING) {
        if (r === PATH_NONE) { mstate[i] = M_FAILED; pathJob[i] = -1 }
        else startPath(u, i, r)
        ms = mstate[i]
      }
    }

    // ---- 3. follow the path
    if (ms === M_MOVING) {
      const p = paths[i]
      if (p === null) { mstate[i] = M_IDLE; ms = M_IDLE }
      else {
        let rem = U_SPEED[type[i]]
        let k = pathIdx[i]
        const last = p.length - 1
        st.moved++
        while (rem > 0) {
          const wp = p[k]
          if (k < last && pass[wp] !== 1) {
            // next waypoint got built over: re-path from where we stand
            st.repaths++
            pathIdx[i] = k
            let cx = x | 0, cy = y | 0
            if (cx >= W) cx = W - 1
            if (cy >= H) cy = H - 1
            X[i] = x; Y[i] = y
            requestPath(ctx, u, i, (cy << shift) | cx)
            ms = mstate[i]
            k = -1
            break
          }
          const wx = (wp & mask) + 0.5, wy = (wp >> shift) + 0.5
          const dx = wx - x, dy = wy - y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d <= rem) {
            x = wx; y = wy; rem -= d; k++
            if (k > last) {
              paths[i] = null
              mstate[i] = M_ARRIVED
              ms = M_ARRIVED
              st.arrived++
              break
            }
          } else {
            const f = rem / d
            x += dx * f; y += dy * f
            rem = 0
          }
        }
        if (k >= 0) pathIdx[i] = k
      }
    }

    // ---- 4. eject from blocked tiles (a building was placed on top of the unit)
    {
      let cx = x | 0, cy = y | 0
      if (cx >= W) cx = W - 1
      if (cy >= H) cy = H - 1
      if (pass[(cy << shift) | cx] !== 1) {
        const t = world.nearestWalkable(cx, cy, EJECT_RADIUS)
        if (t >= 0) {
          st.ejected++
          x = (t & mask) + 0.5; y = (t >> shift) + 0.5
          X[i] = x; Y[i] = y
          if (ms === M_MOVING || ms === M_WAIT_PATH) { requestPath(ctx, u, i, t); ms = mstate[i] }
        }
      }
    }

    // ---- 5. soft separation (soldiers/blight standing or fighting; couriers never)
    const t = type[i]
    if (doSep && t !== U_COURIER && ms !== M_MOVING) {
      const n = grid.queryRect(x - 1, y - 1, x + 1, y + 1, scr)
      const ri = U_RADIUS[t]
      let ax = 0, ay = 0
      for (let q = 0; q < n; q++) {
        const j = scr[q]
        if (j === i || alive[j] === 0) continue
        const tj = type[j]
        if (tj === U_COURIER) continue
        let md = ri + U_RADIUS[tj]
        if (md < sepR) md = sepR
        let dx = x - X[j], dy = y - Y[j]
        let d2 = dx * dx + dy * dy
        if (d2 >= md * md) continue
        if (d2 < 1e-8) { // exactly stacked: split deterministically by id
          dx = i < j ? -0.01 : 0.01
          dy = ((i ^ j) & 1) === 0 ? 0.007 : -0.007
          d2 = dx * dx + dy * dy
        }
        const d = Math.sqrt(d2)
        const o = (md - d) / (md * d)
        ax += dx * o; ay += dy * o
      }
      if (ax !== 0 || ay !== 0) {
        const len = Math.sqrt(ax * ax + ay * ay)
        const mag = (len < 1 ? len : 1) * sepPush / len
        const nx = x + ax * mag, ny = y + ay * mag
        if (nx >= 0 && ny >= 0 && nx < W && ny < H && pass[((ny | 0) << shift) | (nx | 0)] === 1) {
          x = nx; y = ny
          st.separated++
        }
      }
    }

    X[i] = x; Y[i] = y
    VX[i] = X[i] - PX[i]; VY[i] = Y[i] - PY[i] // from the stored Float32 values
    // ---- 6. stage into the new grid
    grid.add(i, x, y)
  }
  grid.build()
}

/**
 * Picking: ids of alive units of `faction` (-1 = any) whose position lies inside the
 * world rect (any corner order), using ctx.unitGrid. Couriers are included only when
 * includeCouriers is true.
 * @param {Int32Array} out
 * @returns {number} count written (truncated at out.length)
 */
export function unitsInRect(ctx, x0, y0, x1, y1, faction, includeCouriers, out) {
  if (x1 < x0) { const t = x0; x0 = x1; x1 = t }
  if (y1 < y0) { const t = y0; y0 = y1; y1 = t }
  const u = ctx.units
  const scr = scratch(u.capacity)
  const n = ctx.unitGrid.queryRect(x0, y0, x1, y1, scr)
  const alive = u.alive, X = u.x, Y = u.y, type = u.type, fac = u.faction
  const lim = out.length
  let k = 0
  for (let q = 0; q < n && k < lim; q++) {
    const id = scr[q]
    if (alive[id] === 0) continue
    if (faction >= 0 && fac[id] !== faction) continue
    if (!includeCouriers && type[id] === U_COURIER) continue
    const x = X[id], y = Y[id]
    if (x < x0 || x > x1 || y < y0 || y > y1) continue
    out[k++] = id
  }
  return k
}

/** Nearest alive unit of `faction` (-1 any) within `radius` tiles of (x,y), or -1. */
export function unitAt(ctx, x, y, radius, faction) {
  const u = ctx.units
  const scr = scratch(u.capacity)
  const n = ctx.unitGrid.queryRect(x - radius, y - radius, x + radius, y + radius, scr)
  const alive = u.alive, X = u.x, Y = u.y, fac = u.faction
  let best = -1, bestD2 = radius * radius
  for (let q = 0; q < n; q++) {
    const id = scr[q]
    if (alive[id] === 0) continue
    if (faction >= 0 && fac[id] !== faction) continue
    const dx = X[id] - x, dy = Y[id] - y
    const d2 = dx * dx + dy * dy
    if (d2 < bestD2 || (d2 === bestD2 && (best < 0 || id < best))) { best = id; bestD2 = d2 }
  }
  return best
}

/** Packed tile the unit stands on. */
export function unitTile(ctx, id) {
  const w = ctx.world
  let tx = ctx.units.x[id] | 0, ty = ctx.units.y[id] | 0
  if (tx < 0) tx = 0; else if (tx >= w.w) tx = w.w - 1
  if (ty < 0) ty = 0; else if (ty >= w.h) ty = w.h - 1
  return (ty << w.shift) | tx
}
