// Shared test helpers. ARCHITECT-OWNED. Implementers may import these but put any
// module-specific helpers inside their own *.test.mjs files.
//
// Conventions (ARCHITECTURE.md §18):
//  - node --test, files named tests/<area>.test.mjs, `import { test } from 'node:test'`
//    and `import assert from 'node:assert/strict'`.
//  - No DOM. Sim modules are pure ES modules over ctx; build a tiny ctx with makeCtx().
//  - makeCtx defaults to a 64x64 all-grass map (generate:false), waves disabled, small pools.
//  - Deterministic: never Math.random in tests; vary ctx seed instead.

import { createContext, stepSim } from '../src/context.js'
import { R_NONE } from '../src/constants.js'
import { RESOURCES } from '../src/content.js'

/**
 * Tiny context for unit tests.
 * @param {Parameters<typeof createContext>[0]} [opts]
 */
export function makeCtx(opts = {}) {
  return createContext({
    w: 64, h: 64, seed: 1, generate: false, waves: false,
    maxUnits: 4096, maxBuildings: 1024,
    ...opts,
  })
}

/** Set terrain on a rect (inclusive top-left, exclusive size). */
export function fillTerrain(ctx, tx, ty, w, h, terrain) {
  const world = ctx.world
  for (let y = ty; y < ty + h; y++) for (let x = tx; x < tx + w; x++) world.setTerrain(world.idx(x, y), terrain)
}

/** Paint a resource on a rect; amount defaults to RESOURCES[res].amount. */
export function paintResource(ctx, tx, ty, w, h, res, amount) {
  const world = ctx.world
  const amt = amount ?? (res === R_NONE ? 0 : RESOURCES[res].amount)
  for (let y = ty; y < ty + h; y++) for (let x = tx; x < tx + w; x++) world.setResource(world.idx(x, y), res, amt)
}

/** Run n sim ticks. */
export function run(ctx, n) {
  for (let i = 0; i < n; i++) stepSim(ctx)
}

/**
 * Step until pred(ctx) is true. @returns {number} ticks taken, or -1 if maxTicks elapsed first.
 */
export function runUntil(ctx, pred, maxTicks = 2000) {
  for (let i = 0; i < maxTicks; i++) {
    if (pred(ctx)) return i
    stepSim(ctx)
  }
  return pred(ctx) ? maxTicks : -1
}

/** Alive ids of a pool as a plain array (test convenience only — allocates). */
export function aliveIds(pool) {
  const out = []
  for (let i = 0; i < pool.hi; i++) if (pool.alive[i]) out.push(i)
  return out
}

/** Packed tile -> [tx, ty] (test convenience). */
export function unpack(ctx, i) {
  return [ctx.world.tileX(i), ctx.world.tileY(i)]
}
