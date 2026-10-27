// Pausing the Blight director from the HUD: the countdown and the elapsed-time strength
// scaling freeze while enabled=false and resume exactly where they stopped.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { makeCtx } from './helpers.mjs'
import { stepSimN } from '../src/context.js'
import { wavePoints } from '../src/waves.js'
import { placeBuilding } from '../src/buildings.js'
import { WAVES } from '../src/content.js'
import { B_HEARTH, EV_WAVE_SPAWNED, EV_WAVE_WARNING, TICK_RATE } from '../src/constants.js'
import { HINTS, hintIndex } from '../src/app-hud.js'

function countEv(ctx, type) {
  let n = 0
  for (let k = ctx.events.since(0); k < ctx.events.written; k++) if (ctx.events.type[k & ctx.events.mask] === type) n++
  return n
}

test('a paused director freezes the countdown and spawns nothing, then resumes where it stopped', () => {
  const ctx = makeCtx({ waves: true })
  placeBuilding(ctx, B_HEARTH, 30, 30, { free: true })
  const W = ctx.waves
  assert.equal(W.enabled, true)
  assert.equal(W.pausedTicks, 0)

  // run 100 ticks live: the clock counts down
  stepSimN(ctx, 100)
  const leftBefore = W.nextTick - ctx.tick
  assert.equal(leftBefore, WAVES.firstTick - 100)
  const pointsBefore = wavePoints(ctx, 1)

  // pause for long enough that wave 1 (and more) would otherwise have spawned
  W.enabled = false
  const pausedFor = WAVES.firstTick + 60 * TICK_RATE
  stepSimN(ctx, pausedFor)
  assert.equal(W.number, 0, 'no wave while paused')
  assert.equal(countEv(ctx, EV_WAVE_SPAWNED), 0)
  assert.equal(countEv(ctx, EV_WAVE_WARNING), 0, 'no warning while paused')
  assert.equal(W.nextTick - ctx.tick, leftBefore, 'countdown is frozen, not skipped')
  assert.equal(W.pausedTicks, pausedFor)
  assert.equal(wavePoints(ctx, 1), pointsBefore, 'paused minutes do not strengthen the next wave')

  // resume: the countdown continues from where it stopped and wave 1 arrives on schedule
  W.enabled = true
  stepSimN(ctx, leftBefore - WAVES.warnTicks + 1)
  assert.equal(countEv(ctx, EV_WAVE_WARNING), 1)
  assert.equal(W.number, 0)
  stepSimN(ctx, WAVES.warnTicks)
  assert.equal(W.number, 1)
  assert.equal(countEv(ctx, EV_WAVE_SPAWNED), 1)
  assert.equal(W.pausedTicks, pausedFor, 'pausedTicks only grows while paused')
})

test('the defence hint does not jump the queue while waves are paused', () => {
  const ctx = makeCtx({ w: 64, h: 64 })
  assert.equal(ctx.waves.enabled, false, 'makeCtx starts paused')
  ctx.tick = WAVES.firstTick - WAVES.warnTicks
  assert.notEqual(HINTS[hintIndex(ctx)].id, 'tower')
  ctx.waves.enabled = true
  assert.equal(HINTS[hintIndex(ctx)].id, 'tower')
  // once a wave has come, defence stays urgent for an undefended grove even mid-pause toggles
  ctx.waves.number = 1
  ctx.tick = 0
  assert.equal(HINTS[hintIndex(ctx)].id, 'tower')
  ctx.waves.enabled = false
  assert.notEqual(HINTS[hintIndex(ctx)].id, 'tower')
})
