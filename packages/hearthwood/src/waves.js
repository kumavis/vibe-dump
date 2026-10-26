// Blight wave director. OWNER: units implementer. Contract: ARCHITECTURE.md §13.
//
// Every choice goes through ctx.rng so a seed + command stream replays exactly.
// tickWaves is O(1) except on the spawn tick (O(units spawned) + a few nearestBuilding calls).

import { WAVES, UNITS } from './content.js'
import { TICK_RATE, F_BLIGHT, EV_WAVE_WARNING, EV_WAVE_SPAWNED } from './constants.js'
import { spawnUnit } from './units.js'
import { commandRaid } from './combat.js'
import { nearestBuilding } from './buildings.js'

/** @typedef {import('./context.js').Ctx} Ctx */

const ROSTER = WAVES.roster
const R_N = ROSTER.length
const R_COST = new Int32Array(R_N)
const R_FROM = new Int32Array(R_N)
const R_WEIGHT = new Float64Array(R_N)
for (let k = 0; k < R_N; k++) {
  const d = UNITS[ROSTER[k]]
  R_COST[k] = d.waveCost; R_FROM[k] = d.fromWave; R_WEIGHT[k] = d.weight
}
/** per-pick weight scratch (eligible types only) */
const W_SCRATCH = new Float64Array(R_N)
const TICKS_PER_MIN = 60 * TICK_RATE
/** spawn-point attempts per group before accepting a point in another region */
const ANCHOR_TRIES = 8
/** scatter attempts per unit before falling back to the group anchor */
const SCATTER_TRIES = 4

/**
 * ctx.waves — PUBLIC read-only fields for the HUD:
 * @typedef {Object} WaveState
 * @property {number} number      waves spawned so far (next wave is number + 1)
 * @property {number} nextTick    ctx.tick at which the next wave spawns
 * @property {number} nextPoints  director points the next wave will get (preview, updated each tick)
 * @property {boolean} warned     EV_WAVE_WARNING already emitted for the next wave
 * @property {boolean} enabled    false disables the director (tests, sandbox)
 * @property {number} lastSide    edge (0..3) of the last wave's first group, -1 none
 */

/** Must not throw (createContext calls it). @returns {WaveState} */
export function createWaves(ctx) {
  return { number: 0, nextTick: WAVES.firstTick, nextPoints: WAVES.basePoints, warned: false, enabled: true, lastSide: -1 }
}

/**
 * Points for wave n (1-based) at the current tick and building count:
 *   floor(basePoints + pointsPerWave*(n-1) + pointsPerMinute*minutes + pointsPerBuilding*ctx.buildings.count)
 * Pure.
 */
export function wavePoints(ctx, n) {
  const minutes = ctx.tick / TICKS_PER_MIN
  return Math.floor(WAVES.basePoints + WAVES.pointsPerWave * (n - 1) + WAVES.pointsPerMinute * minutes +
    WAVES.pointsPerBuilding * ctx.buildings.count)
}

/** Gap (ticks) scheduled after wave `number` has spawned. */
export function waveInterval(number) {
  const v = WAVES.interval - WAVES.intervalStep * (number - 1)
  return v > WAVES.minInterval ? v : WAVES.minInterval
}

/**
 * Spawn a wave immediately with `points` (defaults to wavePoints(ctx, number + 1)):
 * pick 1 + floor(n/4) edge groups with ctx.rng, buy units from the roster (weighted by
 * UNITS weight among types with fromWave <= n and cost <= remaining points, cap WAVES.maxUnits),
 * scatter within WAVES.spread of world.edgeTile(side, t), commandRaid each toward
 * buildings.nearestBuilding from the spawn point. Increments number, emits EV_WAVE_SPAWNED,
 * schedules nextTick = tick + max(minInterval, interval - intervalStep*(number-1)).
 * @returns {number} units spawned
 */
export function spawnWave(ctx, points) {
  const W = ctx.waves
  const world = ctx.world
  const rng = ctx.rng
  const B = ctx.buildings
  const n = W.number + 1
  if (points === undefined || points === null) points = wavePoints(ctx, n)
  points = Math.max(0, Math.floor(points))
  const groups = WAVES.groups + Math.floor(n / 4)
  const spread = WAVES.spread
  const maxUnits = WAVES.maxUnits
  const mask = world.mask, shift = world.shift
  let spawned = 0
  let firstSide = -1
  const share = Math.floor(points / groups)
  let extra = points - share * groups

  for (let g = 0; g < groups && spawned < maxUnits; g++) {
    let budget = share + (extra > 0 ? extra : 0)
    extra = 0
    if (budget <= 0) continue
    // ---- choose an edge anchor whose region reaches the nearest building
    let anchor = -1, side = -1, target = -1
    for (let a = 0; a < ANCHOR_TRIES; a++) {
      const s = rng.int(4)
      const t = rng.frange(0.08, 0.92)
      const tile = world.edgeTile(s, t)
      if (tile < 0) continue
      const b = nearestBuilding(ctx, (tile & mask) + 0.5, (tile >> shift) + 0.5, null, 0)
      if (anchor < 0 || b < 0 || ctx.path.sameRegion(tile, B.door[b])) {
        anchor = tile; side = s; target = b
        if (b < 0 || ctx.path.sameRegion(tile, B.door[b])) break
      }
    }
    if (anchor < 0) continue
    if (firstSide < 0) firstSide = side
    const ax = anchor & mask, ay = anchor >> shift

    // ---- buy units
    while (spawned < maxUnits) {
      let any = false
      for (let k = 0; k < R_N; k++) {
        const ok = R_FROM[k] <= n && R_COST[k] > 0 && R_COST[k] <= budget
        W_SCRATCH[k] = ok ? R_WEIGHT[k] : 0
        if (ok && R_WEIGHT[k] > 0) any = true
      }
      if (!any) break
      const k = rng.weighted(W_SCRATCH)
      if (k < 0) break
      budget -= R_COST[k]
      // scatter around the anchor on walkable tiles of the anchor's region
      let tile = anchor
      for (let s = 0; s < SCATTER_TRIES; s++) {
        const x = ax + rng.range(-spread, spread), y = ay + rng.range(-spread, spread)
        if (x < 0 || y < 0 || x >= world.w || y >= world.h) continue
        const i = (y << shift) | x
        if (world.pass[i] === 1 && ctx.path.sameRegion(anchor, i)) { tile = i; break }
      }
      const px = (tile & mask) + 0.2 + rng.float() * 0.6
      const py = (tile >> shift) + 0.2 + rng.float() * 0.6
      const id = spawnUnit(ctx, ROSTER[k], px, py, F_BLIGHT)
      if (id < 0) { g = groups; break } // pool full
      spawned++
      commandRaid(ctx, id, target)
    }
  }

  W.number = n
  W.lastSide = firstSide
  W.warned = false
  W.nextTick = ctx.tick + waveInterval(n)
  W.nextPoints = wavePoints(ctx, n + 1)
  ctx.events.emit(EV_WAVE_SPAWNED, n, spawned, ctx.tick)
  return spawned
}

/**
 * Per tick, last system: if enabled, update nextPoints, emit EV_WAVE_WARNING once at
 * nextTick - warnTicks, spawnWave at nextTick. O(1) except on spawn ticks.
 * @param {Ctx} ctx
 */
export function tickWaves(ctx) {
  const W = ctx.waves
  if (!W.enabled || ctx.won || ctx.lost) return
  W.nextPoints = wavePoints(ctx, W.number + 1)
  const tick = ctx.tick
  if (!W.warned && tick >= W.nextTick - WAVES.warnTicks) {
    W.warned = true
    ctx.events.emit(EV_WAVE_WARNING, W.number + 1, W.nextTick - tick, tick)
  }
  if (tick >= W.nextTick) spawnWave(ctx)
}
