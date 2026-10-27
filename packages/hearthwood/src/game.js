// Game: owns the sim context, the fixed-timestep accumulator, speed/pause, the starting
// hamlet and the window.__hw debug API. OWNER: app implementer. Contract: ARCHITECTURE.md §17.
// No DOM access at import time (window is touched only inside installDebugApi).

import { createContext, stepSim } from './context.js'
import {
  TICK_MS, MAX_STEPS_PER_FRAME, F_PLAYER, F_BLIGHT, U_COURIER, P_OK,
  B_HEARTH, B_LUMBER_LODGE, B_SAWMILL, B_STOREHOUSE, B_QUARRY, BF_STORAGE, I_WOOD, I_PLANK,
  MAP_W, MAP_H, ITEM_COUNT,
} from './constants.js'
import { START, B_W, B_H, B_FLAGS, B_DOOR_DX, B_DOOR_DY } from './content.js'
import { placeBuilding, addItems, canPlace } from './buildings.js'
import { spawnUnit } from './units.js'

/** @typedef {import('./context.js').Ctx} Ctx */

/**
 * @typedef {Object} Game
 * @property {Ctx} ctx
 * @property {number} speed        1, 2 or 4
 * @property {boolean} paused
 * @property {number} acc          ms of sim time not yet simulated
 * @property {number} alpha        acc / TICK_MS after the last advance(), in [0,1)
 * @property {(dtMs:number) => number} advance  add real time * speed, run up to MAX_STEPS_PER_FRAME
 *           stepSim calls (dropping the excess), return alpha. Paused -> runs nothing, alpha unchanged.
 * @property {(n:number) => void} tickN          run n ticks synchronously regardless of pause
 * @property {(s:number) => void} setSpeed       0 pauses; 1/2/4 unpause at that speed
 * @property {() => void} togglePause
 * @property {(seed?:number) => void} reset      new context (same size), setupStart, keep speed
 */

/** Wall-clock guard for one advance(): stop stepping once a frame has spent this long simulating. */
const ADVANCE_WALL_MS = 45
const now = typeof performance !== 'undefined' ? () => performance.now() : () => Date.now()

/**
 * @param {{seed?:number, w?:number, h?:number, waves?:boolean, start?:boolean}} [opts]
 *   start (default true) runs setupStart on the new context
 * @returns {Game}
 */
export function createGame(opts = {}) {
  const w = opts.w ?? MAP_W
  const h = opts.h ?? MAP_H
  const waves = opts.waves ?? true
  const doStart = opts.start ?? true

  const make = (seed) => {
    const ctx = createContext({ w, h, seed, waves, ...(opts.context || {}) })
    if (doStart) setupStart(ctx)
    return ctx
  }

  /** @type {Game & {seed:number, hearth:number, droppedMs:number, steps:number, endPaused:boolean, onReset:Array<(g:Game)=>void>}} */
  const game = {
    ctx: /** @type {Ctx} */ (/** @type {any} */ (null)),
    seed: (opts.seed ?? 1) >>> 0,
    speed: 1,
    paused: false,
    acc: 0,
    alpha: 0,
    /** total sim ms thrown away by the spiral-of-death guard (debug) */
    droppedMs: 0,
    /** ticks run by the last advance() */
    steps: 0,
    /** set once the game auto-paused on win/lose, so the player can resume (sandbox) */
    endPaused: false,
    hearth: -1,
    /** callbacks run after reset() replaced ctx (UI cursors, renderer caches) */
    onReset: [],

    advance(dtMs) {
      game.steps = 0
      const ctx = game.ctx
      if ((ctx.won || ctx.lost) && !game.endPaused) {
        game.endPaused = true
        game.paused = true
      }
      if (game.paused) return game.alpha
      if (!(dtMs > 0)) return game.alpha
      game.acc += dtMs * game.speed
      let steps = 0
      const t0 = now()
      while (game.acc >= TICK_MS && steps < MAX_STEPS_PER_FRAME) {
        stepSim(ctx)
        game.acc -= TICK_MS
        steps++
        if (now() - t0 > ADVANCE_WALL_MS) break
      }
      if (game.acc >= TICK_MS) {
        // could not keep up: drop whole ticks rather than spiral
        const keep = game.acc % TICK_MS
        game.droppedMs += game.acc - keep
        game.acc = keep
      }
      game.steps = steps
      game.alpha = game.acc / TICK_MS
      return game.alpha
    },

    tickN(n) {
      const ctx = game.ctx
      for (let i = 0; i < n; i++) stepSim(ctx)
    },

    setSpeed(s) {
      if (!(s > 0)) { game.paused = true; return }
      game.speed = s >= 4 ? 4 : s >= 2 ? 2 : 1
      game.paused = false
    },

    togglePause() { game.paused = !game.paused },

    reset(seed) {
      if (seed !== undefined && seed !== null) game.seed = seed >>> 0
      game.ctx = make(game.seed)
      game.hearth = game.ctx.buildings.typeCount[B_HEARTH] > 0 ? game.ctx.buildings.typeList[B_HEARTH][0] : -1
      game.acc = 0
      game.alpha = 0
      game.endPaused = false
      for (let i = 0; i < game.onReset.length; i++) game.onReset[i](game)
    },
  }
  game.ctx = make(game.seed)
  game.hearth = game.ctx.buildings.typeCount[B_HEARTH] > 0 ? game.ctx.buildings.typeList[B_HEARTH][0] : -1
  return game
}

// ------------------------------------------------------------------ placement helpers

/**
 * Place `type` with its top-left as close to (tx,ty) as possible (square rings out to maxR).
 * Deterministic scan order. @returns {number} id or -1
 */
export function placeNear(ctx, type, tx, ty, maxR, opts) {
  for (let r = 0; r <= maxR; r++) {
    for (let dy = -r; dy <= r; dy++) {
      const edge = dy === -r || dy === r
      const step = edge ? 1 : 2 * r
      for (let dx = -r; dx <= r; dx += step) {
        const x = tx + dx, y = ty + dy
        if (canPlace(ctx, type, x, y, opts) === P_OK) {
          const id = placeBuilding(ctx, type, x, y, opts)
          if (id >= 0) return id
        }
        if (step === 0) break
      }
    }
  }
  return -1
}

/** Walkable spawn point near a building's door: k-th slot of a small fan, door centre fallback. */
function doorSpot(ctx, b, k, out) {
  const B = ctx.buildings, world = ctx.world
  const door = B.door[b]
  const dx = door & world.mask, dy = door >> world.shift
  // 4 x 2 block centred under the door: columns -2..1, rows 0..1
  const col = (k & 3) - 2 + ((k >> 3) & 1), row = (k >> 2) & 1
  const tx = dx + col, ty = dy + row
  const ox = ((k * 37) % 7 - 3) * 0.06, oy = ((k * 53) % 5 - 2) * 0.06
  if (world.walkableXY(tx, ty)) { out.x = tx + 0.5 + ox; out.y = ty + 0.5 + oy }
  else { out.x = dx + 0.5 + ox; out.y = dy + 0.5 + oy }
  return out
}

const _spot = { x: 0, y: 0 }

/**
 * Build the opening hamlet on ctx (fresh, generated map): Hearth centred on world.start
 * (START.hearth offset), START.buildings with {free:true}, START.stock into the Hearth via
 * addItems, START.couriers spawned around the Hearth door. Returns the Hearth id.
 * Deterministic. Must leave the first second showing couriers hauling wood to the Sawmill.
 * @param {Ctx} ctx
 * @returns {number} hearth building id
 */
export function setupStart(ctx) {
  const world = ctx.world
  const sx = world.tileX(world.start), sy = world.tileY(world.start)
  const free = { free: true }
  let hearth = placeBuilding(ctx, B_HEARTH, sx + START.hearth.dx, sy + START.hearth.dy, free)
  if (hearth < 0) hearth = placeNear(ctx, B_HEARTH, sx + START.hearth.dx, sy + START.hearth.dy, 12, free)
  if (hearth < 0) return -1
  for (const s of START.buildings) {
    let id = placeBuilding(ctx, s.type, sx + s.dx, sy + s.dy, free)
    if (id < 0) id = placeNear(ctx, s.type, sx + s.dx, sy + s.dy, 8, free)
    // Head start for the opening shot: full output buffers mean the very first scheduler pass
    // sends couriers lodge -> sawmill (pull) AND lodge/sawmill -> Hearth (push of surplus),
    // so the first second already shows goods flowing both ways.
    // (half full, not full: a full buffer shows an 'output full' badge on the very first frame)
    if (id >= 0 && s.type === B_LUMBER_LODGE) addItems(ctx, id, I_WOOD, 10, false)
    if (id >= 0 && s.type === B_SAWMILL) addItems(ctx, id, I_PLANK, 15, false)
  }
  for (const e of START.stock) addItems(ctx, hearth, e.item, e.qty, false)
  for (let k = 0; k < START.couriers; k++) {
    doorSpot(ctx, hearth, k, _spot)
    spawnUnit(ctx, U_COURIER, _spot.x, _spot.y, F_PLAYER)
  }
  return hearth
}

// ------------------------------------------------------------------ stress

/**
 * Stress helper for __hw.stress: place up to `buildings` production clusters (lodge +
 * sawmill + storehouse groups on valid ground, {free:true}) and spawn `couriers` couriers
 * near the Hearth/storehouses (raising ctx.courierCap if needed). Deterministic via ctx.rng.
 *
 * `buildings` counts BUILDINGS (not clusters). Candidates lie on a lattice (pitch 3 x 3)
 * scanned in square rings around the Hearth, so every door opens onto a corridor row and
 * every column keeps a 1-tile alley. Slots cycle lodge / sawmill / lodge / storehouse; a slot
 * whose preferred type is invalid there (lodge without trees) takes the next valid type,
 * and lodge slots on rock become quarries.
 * @param {Game} game
 * @param {{buildings?:number, couriers?:number}} [opts]
 * @returns {{buildings:number, couriers:number}} actually placed/spawned
 */
export function stress(game, opts = {}) {
  const ctx = game.ctx
  const world = ctx.world
  const B = ctx.buildings
  const wantB = Math.max(0, opts.buildings | 0)
  const wantC = Math.max(0, opts.couriers | 0)
  const free = { free: true }
  let placed = 0
  let cx = world.tileX(world.start), cy = world.tileY(world.start)
  if (B.typeCount[B_HEARTH] > 0) {
    const h = B.typeList[B_HEARTH][0]
    cx = B.tx[h] + 1; cy = B.ty[h] + 1
  }
  const PX = 3, PY = 3
  const ox = ctx.rng.int(PX), oy = ctx.rng.int(PY)
  const maxR = Math.ceil(Math.max(world.w, world.h) / Math.min(PX, PY)) + 1
  // lodge (quarry on rock), sawmill, lodge, storehouse: ~half extractors, all with consumers/sinks
  const MIX = [B_LUMBER_LODGE, B_SAWMILL, B_LUMBER_LODGE, B_STOREHOUSE]
  let k = 0
  for (let r = 3; r <= maxR && placed < wantB; r++) {
    for (let gy = -r; gy <= r && placed < wantB; gy++) {
      const edge = gy === -r || gy === r
      const step = edge ? 1 : 2 * r
      for (let gx = -r; gx <= r && placed < wantB; gx += step) {
        const tx = cx + gx * PX + ox, ty = cy + gy * PY + oy
        if (tx >= 1 && ty >= 1 && tx + 3 < world.w && ty + 4 < world.h) {
          // preferred type for this slot, then the rest of the mix as fallbacks
          let id = -1
          for (let j = 0; j < 4 && id < 0; j++) {
            const t = MIX[(k + j) & 3]
            if (canPlace(ctx, t, tx, ty, free) === P_OK) id = placeBuilding(ctx, t, tx, ty, free)
            else if (t === B_LUMBER_LODGE && canPlace(ctx, B_QUARRY, tx, ty, free) === P_OK) id = placeBuilding(ctx, B_QUARRY, tx, ty, free)
          }
          if (id >= 0) { placed++; k++ }
        }
        if (step === 0) break
      }
    }
  }

  // couriers: spread over storage doors (Hearth + storehouses), round robin
  let spawned = 0
  if (wantC > 0) {
    const have = ctx.units.typeCount[U_COURIER]
    const need = have + wantC - ctx.courierCap
    if (need > 0) { ctx.courierCapExtra += need; ctx.courierCap += need }
    const hosts = []
    for (let b = 0; b < B.hi; b++) if (B.alive[b] && (B_FLAGS[B.type[b]] & BF_STORAGE)) hosts.push(b)
    if (hosts.length === 0) for (let b = 0; b < B.hi && hosts.length < 64; b++) if (B.alive[b]) hosts.push(b)
    for (let i = 0; i < wantC; i++) {
      let x, y
      if (hosts.length) {
        const b = hosts[i % hosts.length]
        doorSpot(ctx, b, (i / hosts.length) | 0, _spot)
        x = _spot.x; y = _spot.y
      } else {
        const t = world.nearestWalkable(cx, cy, 16)
        x = (t & world.mask) + 0.5; y = (t >> world.shift) + 0.5
      }
      if (spawnUnit(ctx, U_COURIER, x, y, F_PLAYER) < 0) break
      spawned++
    }
  }
  return { buildings: placed, couriers: spawned }
}

// ------------------------------------------------------------------ debug api

/**
 * Install window.__hw (see ARCHITECTURE.md §17.3). `extras` may carry renderer, camera,
 * overlay, ui for debugging. Returns the api object (also when window is undefined).
 */
export function installDebugApi(game, extras = {}) {
  const api = {
    game,
    get ctx() { return game.ctx },
    get world() { return game.ctx.world },
    get units() { return game.ctx.units },
    get buildings() { return game.ctx.buildings },
    get pools() { return { units: game.ctx.units, buildings: game.ctx.buildings } },
    get renderer() { return extras.renderer },
    get camera() { return extras.camera },
    get overlay() { return extras.overlay },
    get minimap() { return extras.minimap },
    get ui() { return extras.ui },
    get input() { return extras.input },
    /** run n ticks synchronously (works while paused) @returns {number} ctx.tick */
    tick(n = 1) { game.tickN(n | 0); return game.ctx.tick },
    stress(o = {}) { return stress(game, o) },
    stats() {
      const ctx = game.ctx
      const loop = extras.loop || {}
      const r = extras.renderer && extras.renderer.stats
      const ps = ctx.path && ctx.path.stats
      return {
        tick: ctx.tick,
        tickMs: ctx.stats.tickMs,
        frameMs: loop.frameMs ?? (r ? r.frameMs : 0),
        fps: loop.fps ?? 0,
        units: ctx.units.count,
        buildings: ctx.buildings.count,
        couriers: ctx.units.typeCount[U_COURIER],
        idle: ctx.log ? ctx.log.idleCount : 0,
        jobs: ctx.log ? ctx.log.jobCount : 0,
        blight: ctx.units.factionCount[F_BLIGHT],
        pathQueue: ps ? ps.queued : 0,
        pathHits: ps ? ps.hits : 0,
        pathMisses: ps ? ps.misses : 0,
        speed: game.paused ? 0 : game.speed,
        tier: ctx.tier,
        wave: ctx.waves ? ctx.waves.number : 0,
        stock: Array.from(ctx.stock.subarray(0, ITEM_COUNT)),
      }
    },
    place(type, tx, ty, free = true) { return placeBuilding(game.ctx, type, tx, ty, { free }) },
    spawn(type, x, y, faction) { return spawnUnit(game.ctx, type, x, y, faction) },
    setSpeed(s) { game.setSpeed(s) },
    pause() { game.paused = true },
    resume() { game.paused = false },
    reset(seed) { game.reset(seed); return game.ctx.tick },
    /** centre the camera on a world point (tile units) */
    look(x, y, zoom) {
      const cam = extras.camera
      if (!cam) return
      if (zoom) cam.setZoom ? cam.setZoom(zoom) : (cam.zoom = zoom)
      cam.centerOn(x, y)
    },
    /** building door tile -> [tx, ty] helper for scripts */
    door(b) { const w = game.ctx.world; const d = game.ctx.buildings.door[b]; return [d & w.mask, d >> w.shift] },
    footprint(type) { return [B_W[type], B_H[type], B_DOOR_DX[type], B_DOOR_DY[type]] },
  }
  if (typeof window !== 'undefined') /** @type {any} */ (window).__hw = api
  return api
}
