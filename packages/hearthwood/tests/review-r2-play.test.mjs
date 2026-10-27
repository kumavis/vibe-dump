// Round-2 playability fixes: Hearth ward, Blight target priority, combat alerts, defence hint.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { makeCtx, run } from './helpers.mjs'
import {
  B_HEARTH, B_STOREHOUSE, U_COURIER, U_CRAWLER, F_BLIGHT, EV_BUILDING_ATTACKED, EV_COURIERS_LOST,
  EV_WAVE_WARNING, TICK_RATE,
} from '../src/constants.js'
import { WAVES } from '../src/content.js'
import { placeBuilding } from '../src/buildings.js'
import { spawnUnit } from '../src/units.js'
import { damageUnit, damageBuilding } from '../src/combat.js'
import { HINTS, hintIndex, eventMessage } from '../src/app-hud.js'

function events(ctx, from, type) {
  const out = []
  for (let n = from; n < ctx.events.written; n++) {
    const s = n & ctx.events.mask
    if (ctx.events.type[s] === type) out.push([ctx.events.a[s], ctx.events.b[s]])
  }
  return out
}

test('review r2 play: the Hearth wards off a lone crawler on its own', () => {
  const ctx = makeCtx({ w: 64, h: 64 })
  const h = placeBuilding(ctx, B_HEARTH, 30, 30, { free: true })
  const c = spawnUnit(ctx, U_CRAWLER, 31.5, 36.5, F_BLIGHT) // 4.5 from the Hearth centre
  const gen = ctx.units.gen[c]
  run(ctx, 20 * 10)
  assert.equal(ctx.units.isAlive(c, gen), false, 'crawler killed by the Hearth ward') // slot may be a rescue courier now
  assert.ok(ctx.buildings.hp[h] > 0)
})

test('review r2 play: Blight goes for a building in sight before a courier', () => {
  const ctx = makeCtx({ w: 64, h: 64 })
  const s = placeBuilding(ctx, B_STOREHOUSE, 20, 20, { free: true })
  const k = spawnUnit(ctx, U_COURIER, 25.5, 25.5)
  const c = spawnUnit(ctx, U_CRAWLER, 24.5, 24.5, F_BLIGHT) // courier 1.4 away, storehouse ~3.5
  run(ctx, 20 * 5)
  assert.equal(ctx.units.alive[k], 1, 'courier untouched')
  assert.ok(ctx.buildings.hp[s] < 500, 'storehouse took the hits')
  assert.equal(ctx.units.alive[c], 1)
})

test('review r2 play: building-attacked and couriers-lost events carry a tile and are throttled', () => {
  const ctx = makeCtx({ w: 64, h: 64 })
  const s = placeBuilding(ctx, B_STOREHOUSE, 20, 20, { free: true })
  const w0 = ctx.events.written
  damageBuilding(ctx, s, 1); damageBuilding(ctx, s, 1)
  const att = events(ctx, w0, EV_BUILDING_ATTACKED)
  assert.equal(att.length, 1, 'one alert per chunk window')
  assert.equal(att[0][0], B_STOREHOUSE)
  assert.equal(att[0][1], ctx.buildings.door[s])
  const m = eventMessage(ctx, EV_BUILDING_ATTACKED, att[0][0], att[0][1])
  assert.match(m.msg, /Storehouse under attack/)
  assert.equal(m.tile, ctx.buildings.door[s])
  const a = spawnUnit(ctx, U_COURIER, 10.5, 10.5), b = spawnUnit(ctx, U_COURIER, 11.5, 10.5)
  damageUnit(ctx, a, 100); damageUnit(ctx, b, 100)
  run(ctx, 1)
  const lost = events(ctx, w0, EV_COURIERS_LOST)
  assert.equal(lost.length, 1)
  assert.equal(lost[0][0], 2)
  assert.match(eventMessage(ctx, EV_COURIERS_LOST, 2, lost[0][1]).msg, /2 couriers slain/)
})

test('review r2 play: the defence hint jumps the queue at the first wave warning', () => {
  const ctx = makeCtx({ w: 64, h: 64 })
  ctx.waves.enabled = true
  assert.equal(HINTS[hintIndex(ctx)].id, 'quarry')
  ctx.tick = WAVES.firstTick - WAVES.warnTicks
  assert.equal(HINTS[hintIndex(ctx)].id, 'tower')
  assert.match(eventMessage(ctx, EV_WAVE_WARNING, 1, 30 * TICK_RATE).msg, /Ward Tower \[8\]/)
})
