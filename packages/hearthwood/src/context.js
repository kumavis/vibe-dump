// Composition of the simulation context and the per-tick system order.
// ARCHITECT-OWNED, fully implemented. Implementers must not edit; report needed
// changes to the integrator. Contract: ARCHITECTURE.md §4 and §14.
//
// Modules never import each other's STATE. Every system function takes `ctx` and
// reads/writes only what its contract says. Cross-module FUNCTION imports are
// allowed exactly where ARCHITECTURE.md lists them.

import { MAP_W, MAP_H, MAX_UNITS, MAX_BUILDINGS, ITEM_STRIDE, UNIT_CELL_SHIFT, PATH_CACHE_SIZE } from './constants.js'
import { RNG } from './rng.js'
import { World, CellGrid } from './world.js'
import { generateMap } from './mapgen.js'
import { PathService } from './path.js'
import { UnitPool, BuildingPool } from './entities.js'
import { tickBuildings } from './buildings.js'
import { createLogistics, tickLogistics } from './logistics.js'
import { tickUnits } from './units.js'
import { createCombat, tickCombat } from './combat.js'
import { createWaves, tickWaves } from './waves.js'
import { FxRing, EventRing } from './fx.js'

/**
 * The single mutable game context passed to every system.
 * @typedef {Object} Ctx
 * @property {number} tick            sim ticks elapsed (incremented at the END of stepSim)
 * @property {number} seed
 * @property {RNG} rng                the ONLY randomness the sim may use
 * @property {World} world
 * @property {PathService} path
 * @property {UnitPool} units
 * @property {BuildingPool} buildings
 * @property {CellGrid} unitGrid      all alive units, rebuilt at the end of tickUnits
 * @property {CellGrid} sepGrid       alive NON-courier units, rebuilt with unitGrid (separation)
 * @property {import('./logistics.js').LogisticsState} log
 * @property {import('./combat.js').CombatState} combat
 * @property {import('./waves.js').WaveState} waves
 * @property {Int32Array} stock       [ITEM_STRIDE] unreserved items in storage (buildings.js keeps it)
 * @property {number} storeCap        total storage capacity of alive storage buildings
 * @property {number} courierCap      max couriers = courierCapExtra + sum of BUILDINGS[t].courierCap over alive buildings
 * @property {number} courierCapExtra cap bonus not tied to a building (stress tests, cheats); recomputeStock keeps it
 * @property {number} tier            Shrine tier, 0..WIN_TIER
 * @property {boolean} won
 * @property {boolean} lost
 * @property {FxRing} fx
 * @property {EventRing} events
 * @property {{tickMs:number, lastTickMs:number, ticks:number}} stats  tickMs = EMA of stepSim wall time
 */

/**
 * @param {Object} [opts]
 * @param {number} [opts.w=MAP_W]
 * @param {number} [opts.h=MAP_H]
 * @param {number} [opts.seed=1]
 * @param {boolean} [opts.generate=true]  false -> all-grass map, world.start = centre (tests)
 * @param {Object} [opts.mapgen]          forwarded to generateMap
 * @param {Object} [opts.path]            forwarded to PathService (budget, cacheSize, ...)
 * @param {number} [opts.maxUnits=MAX_UNITS]
 * @param {number} [opts.maxBuildings=MAX_BUILDINGS]
 * @param {boolean} [opts.waves=true]     false -> ctx.waves.enabled = false
 * @returns {Ctx}
 */
export function createContext(opts = {}) {
  const w = opts.w ?? MAP_W
  const h = opts.h ?? MAP_H
  const seed = (opts.seed ?? 1) >>> 0
  const world = new World(w, h)
  world.seed = seed
  if (opts.generate === false) world.start = world.idx(w >> 1, h >> 1)
  else generateMap(world, seed, opts.mapgen)

  const units = new UnitPool(opts.maxUnits ?? MAX_UNITS)
  const buildings = new BuildingPool(world.chunkCount, opts.maxBuildings ?? MAX_BUILDINGS)
  /** @type {Ctx} */
  const ctx = {
    tick: 0,
    seed,
    rng: new RNG((seed ^ 0x5eed1e55) >>> 0),
    world,
    // big maps carry many more distinct door-to-door pairs: give the LRU room for them
    path: new PathService(world, { cacheSize: w * h > MAP_W * MAP_H ? PATH_CACHE_SIZE * 4 : PATH_CACHE_SIZE, ...opts.path }),
    units,
    buildings,
    unitGrid: new CellGrid(w, h, UNIT_CELL_SHIFT, units.capacity),
    /** non-courier units only (soldiers + Blight), rebuilt with unitGrid: separation scans */
    sepGrid: new CellGrid(w, h, UNIT_CELL_SHIFT, units.capacity),
    log: /** @type {any} */ (null),
    combat: /** @type {any} */ (null),
    waves: /** @type {any} */ (null),
    stock: new Int32Array(ITEM_STRIDE),
    storeCap: 0,
    courierCap: 0,
    courierCapExtra: 0,
    tier: 0,
    won: false,
    lost: false,
    fx: new FxRing(),
    events: new EventRing(),
    stats: { tickMs: 0, lastTickMs: 0, ticks: 0 },
  }
  ctx.log = createLogistics(ctx)
  ctx.combat = createCombat(ctx)
  ctx.waves = createWaves(ctx)
  if (opts.waves === false) ctx.waves.enabled = false
  return ctx
}

const now = typeof performance !== 'undefined' ? () => performance.now() : () => Date.now()

/**
 * Advance the simulation exactly one fixed tick (1/TICK_RATE s). Deterministic given
 * ctx state + the inputs (commands) applied between ticks. The ORDER IS THE CONTRACT:
 *   1. path.update()     budgeted A* over queued jobs (requests made last tick)
 *   2. tickUnits         px/py snapshot, poll paths, move, arrive, separation, rebuild unitGrid
 *   3. tickBuildings     production, extraction, den spawns, shrine tiers
 *   4. tickLogistics     courier state machine (reacts to this tick's arrivals), scheduler
 *   5. tickCombat        training, towers, targeting, damage, deaths
 *   6. tickWaves         Blight director
 *   7. ctx.tick++
 * @param {Ctx} ctx
 */
export function stepSim(ctx) {
  const t0 = now()
  ctx.path.update()
  tickUnits(ctx)
  tickBuildings(ctx)
  tickLogistics(ctx)
  tickCombat(ctx)
  tickWaves(ctx)
  ctx.tick++
  const dt = now() - t0
  const s = ctx.stats
  s.lastTickMs = dt
  s.tickMs = s.ticks === 0 ? dt : s.tickMs * 0.9 + dt * 0.1
  s.ticks++
}

/** Run n ticks. */
export function stepSimN(ctx, n) {
  for (let i = 0; i < n; i++) stepSim(ctx)
}
