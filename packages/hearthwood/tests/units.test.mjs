// Units suite: movement layer, combat, towers, training halls, Blight waves.
// OWNER: units implementer. Run: node --test tests/units.test.mjs

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { makeCtx, fillTerrain, run, runUntil } from './helpers.mjs'
import {
  T_WATER, T_GRASS, U_COURIER, U_WARDEN, U_TREANT, U_CRAWLER, U_HUSK, U_WISP, F_PLAYER, F_BLIGHT,
  M_IDLE, M_WAIT_PATH, M_MOVING, M_ARRIVED, M_FAILED,
  O_NONE, O_MOVE, O_ATTACK_MOVE, O_ATTACK, O_HOLD, O_RAID, TK_UNIT, TK_BUILDING,
  B_HEARTH, B_WARD_TOWER, B_WARDEN_HALL, B_LUMBER_LODGE, B_STOREHOUSE, B_SAWMILL,
  I_WOOD, I_PLANK, I_GLOWCAP, ITEM_SHIFT,
  FX_ARROW, FX_DEATH, FX_SPAWN, EV_BUILDING_LOST, EV_UNIT_TRAINED, EV_WAVE_WARNING, EV_WAVE_SPAWNED,
  EV_CANNOT_AFFORD, TRAIN_QUEUE,
} from '../src/constants.js'
import { UNITS, WAVES, U_SPEED, U_HP } from '../src/content.js'
import {
  spawnUnit, despawnUnit, orderMove, stopUnit, tickUnits, unitsInRect, unitAt, unitTile,
} from '../src/units.js'
import {
  commandMove, commandAttackMove, commandAttack, commandHold, commandStop, commandRaid, commandGroup,
  damageUnit, damageBuilding, enqueueTraining, cancelTraining, tickCombat,
} from '../src/combat.js'
import { wavePoints, spawnWave, tickWaves, createWaves } from '../src/waves.js'
import { placeBuilding, addItems } from '../src/buildings.js'

const tileOf = (ctx, id) => [Math.floor(ctx.units.x[id]), Math.floor(ctx.units.y[id])]
function countFx(ctx, kind) {
  let n = 0
  for (let k = ctx.fx.first(); k < ctx.fx.written; k++) if (ctx.fx.kind[k & ctx.fx.mask] === kind) n++
  return n
}
function countEv(ctx, type) {
  let n = 0
  for (let k = ctx.events.since(0); k < ctx.events.written; k++) if (ctx.events.type[k & ctx.events.mask] === type) n++
  return n
}
function lastEv(ctx, type) {
  for (let k = ctx.events.written - 1; k >= ctx.events.since(0); k--) {
    const s = k & ctx.events.mask
    if (ctx.events.type[s] === type) return { a: ctx.events.a[s], b: ctx.events.b[s], tick: ctx.events.tick[s] }
  }
  return null
}

// ------------------------------------------------------------------ movement

test('a unit follows a path around a wall and arrives at the goal centre', () => {
  const ctx = makeCtx()
  // water wall x=30, y=5..58 with the only gaps at the map top/bottom rows
  fillTerrain(ctx, 30, 5, 1, 54, T_WATER)
  const id = spawnUnit(ctx, U_WARDEN, 20.5, 30.5)
  assert.ok(id >= 0)
  assert.equal(ctx.units.mstate[id], M_IDLE)
  orderMove(ctx, id, 40, 30)
  assert.ok(ctx.units.mstate[id] === M_WAIT_PATH || ctx.units.mstate[id] === M_MOVING)
  const sp = U_SPEED[U_WARDEN]
  let maxStep = 0, ticks = 0
  while (ctx.units.mstate[id] !== M_ARRIVED && ticks < 3000) {
    run(ctx, 1); ticks++
    const u = ctx.units
    const step = Math.hypot(u.x[id] - u.px[id], u.y[id] - u.py[id])
    if (step > maxStep) maxStep = step
    assert.ok(Math.abs(u.vx[id] - (u.x[id] - u.px[id])) < 1e-6)
    const [tx, ty] = tileOf(ctx, id)
    assert.equal(ctx.world.pass[ctx.world.idx(tx, ty)], 1, `never on an unwalkable tile (tick ${ticks})`)
  }
  assert.equal(ctx.units.mstate[id], M_ARRIVED)
  assert.equal(ctx.units.x[id], 40.5)
  assert.equal(ctx.units.y[id], 30.5)
  assert.equal(ctx.units.path[id], null)
  assert.ok(maxStep <= sp + 1e-5, `moves at most speed per tick (${maxStep})`)
  // detour around the wall is much longer than the straight 20 tiles
  assert.ok(ticks > 40 / sp, `took a detour (${ticks} ticks)`)
  // sticky arrival
  run(ctx, 5)
  assert.equal(ctx.units.mstate[id], M_ARRIVED)
  stopUnit(ctx, id)
  assert.equal(ctx.units.mstate[id], M_IDLE)
  assert.equal(ctx.units.goal[id], -1)
})

test('orderMove edge cases: same tile, unwalkable goal, unreachable goal, idempotent re-issue', () => {
  const ctx = makeCtx()
  const id = spawnUnit(ctx, U_COURIER, 10.3, 10.7)
  orderMove(ctx, id, 10, 10)
  assert.equal(ctx.units.mstate[id], M_ARRIVED)
  fillTerrain(ctx, 20, 20, 1, 1, T_WATER)
  orderMove(ctx, id, 20, 20)
  assert.equal(ctx.units.mstate[id], M_FAILED)
  // a sealed pocket: ring of water around (50,50)
  fillTerrain(ctx, 47, 47, 7, 1, T_WATER); fillTerrain(ctx, 47, 53, 7, 1, T_WATER)
  fillTerrain(ctx, 47, 47, 1, 7, T_WATER); fillTerrain(ctx, 53, 47, 1, 7, T_WATER)
  orderMove(ctx, id, 50, 50)
  run(ctx, 3)
  assert.equal(ctx.units.mstate[id], M_FAILED)
  // re-issuing after failure retries (and goes somewhere reachable now)
  orderMove(ctx, id, 30, 10)
  const job = ctx.units.pathJob[id]
  const st = ctx.units.mstate[id]
  assert.ok(st === M_WAIT_PATH || st === M_MOVING)
  orderMove(ctx, id, 30, 10) // same goal while moving: no-op
  assert.equal(ctx.units.pathJob[id], job)
  assert.equal(ctx.units.mstate[id], st)
  assert.ok(runUntil(ctx, (c) => c.units.mstate[id] === M_ARRIVED, 1000) >= 0)
  // clamped goal outside the map
  orderMove(ctx, id, 999, -5)
  assert.equal(ctx.units.goal[id], ctx.world.idx(63, 0))
})

test('a building placed on the path forces a re-path; a building placed on a unit ejects it', () => {
  const ctx = makeCtx()
  const id = spawnUnit(ctx, U_COURIER, 5.5, 20.5)
  orderMove(ctx, id, 40, 20)
  run(ctx, 15)
  assert.equal(ctx.units.mstate[id], M_MOVING)
  // a storehouse right across the straight line ahead
  const s = placeBuilding(ctx, B_STOREHOUSE, 20, 19, { free: true })
  assert.ok(s >= 0)
  assert.ok(runUntil(ctx, (c) => {
    const [tx, ty] = tileOf(c, id)
    assert.equal(c.world.pass[c.world.idx(tx, ty)], 1)
    return c.units.mstate[id] === M_ARRIVED
  }, 2000) >= 0)
  assert.equal(ctx.units.x[id], 40.5)

  const v = spawnUnit(ctx, U_WARDEN, 10.5, 40.5)
  run(ctx, 1)
  const b = placeBuilding(ctx, B_SAWMILL, 10, 40, { free: true })
  assert.ok(b >= 0)
  assert.equal(ctx.world.pass[ctx.world.idx(10, 40)], 0)
  run(ctx, 1)
  const [tx, ty] = tileOf(ctx, v)
  assert.equal(ctx.world.pass[ctx.world.idx(tx, ty)], 1, 'ejected onto a walkable tile')
})

test('idle soldiers separate softly; couriers never separate', () => {
  const ctx = makeCtx()
  const a = spawnUnit(ctx, U_WARDEN, 30.5, 30.5)
  const b = spawnUnit(ctx, U_WARDEN, 30.5, 30.5)
  const c1 = spawnUnit(ctx, U_COURIER, 20.5, 20.5)
  const c2 = spawnUnit(ctx, U_COURIER, 20.5, 20.5)
  run(ctx, 40)
  const u = ctx.units
  const d = Math.hypot(u.x[a] - u.x[b], u.y[a] - u.y[b])
  assert.ok(d > 0.4, `wardens pushed apart (${d})`)
  assert.equal(u.x[c1], u.x[c2])
  assert.equal(u.y[c1], u.y[c2])
})

test('picking: unitsInRect and unitAt use the grid and filter faction/couriers', () => {
  const ctx = makeCtx()
  const w = spawnUnit(ctx, U_WARDEN, 10.5, 10.5)
  const c = spawnUnit(ctx, U_COURIER, 11.5, 10.5)
  const e = spawnUnit(ctx, U_CRAWLER, 12.5, 12.5)
  spawnUnit(ctx, U_WARDEN, 40.5, 40.5)
  run(ctx, 1)
  const out = new Int32Array(16)
  let n = unitsInRect(ctx, 14, 14, 9, 9, F_PLAYER, false, out)
  assert.deepEqual([...out.subarray(0, n)], [w])
  n = unitsInRect(ctx, 9, 9, 14, 14, F_PLAYER, true, out)
  assert.deepEqual([...out.subarray(0, n)].sort(), [w, c].sort())
  n = unitsInRect(ctx, 9, 9, 14, 14, -1, true, out)
  assert.equal(n, 3)
  assert.equal(unitAt(ctx, 12.4, 12.4, 1, -1), e)
  assert.equal(unitAt(ctx, 12.4, 12.4, 1, F_PLAYER), -1)
  assert.equal(unitAt(ctx, 11.2, 10.5, 1, F_PLAYER), c)
  assert.equal(unitTile(ctx, w), ctx.world.idx(10, 10))
  despawnUnit(ctx, w, true)
  assert.equal(ctx.units.alive[w], 0)
  assert.ok(countFx(ctx, FX_DEATH) >= 1)
  assert.ok(countFx(ctx, FX_SPAWN) >= 4)
  assert.equal(unitAt(ctx, 10.5, 10.5, 0.5, F_PLAYER), -1, 'dead ids filtered even before the grid rebuild')
})

// ------------------------------------------------------------------ combat

/** Two armies on a 64x64 field, positions jittered with ctx.rng. Returns a fingerprint. */
function battle(seed) {
  const ctx = makeCtx({ seed })
  const rng = ctx.rng
  for (let k = 0; k < 10; k++) spawnUnit(ctx, U_WARDEN, 12 + rng.float() * 6, 24 + rng.float() * 16)
  for (let k = 0; k < 3; k++) spawnUnit(ctx, U_TREANT, 19 + rng.float() * 2, 28 + rng.float() * 8)
  for (let k = 0; k < 26; k++) spawnUnit(ctx, U_CRAWLER, 44 + rng.float() * 8, 22 + rng.float() * 20)
  for (let k = 0; k < 6; k++) spawnUnit(ctx, U_WISP, 50 + rng.float() * 4, 26 + rng.float() * 12)
  const u = ctx.units
  for (let i = 0; i < u.hi; i++) {
    if (!u.alive[i]) continue
    if (u.faction[i] === F_PLAYER) commandAttackMove(ctx, i, 50, 32)
    else commandAttackMove(ctx, i, 14, 32)
  }
  const ticks = runUntil(ctx, (c) => c.units.factionCount[F_PLAYER] === 0 || c.units.factionCount[F_BLIGHT] === 0, 4000)
  const parts = [ticks, u.factionCount[F_PLAYER], u.factionCount[F_BLIGHT], ctx.combat.totals.shots, ctx.combat.totals.kills]
  for (let i = 0; i < u.hi; i++) if (u.alive[i]) parts.push(i, u.hp[i].toFixed(3), u.x[i].toFixed(4), u.y[i].toFixed(4))
  return { ctx, ticks, fp: parts.join(',') }
}

test('two armies fight to the same outcome twice with the same seed', () => {
  const a = battle(7)
  const b = battle(7)
  assert.ok(a.ticks >= 0, 'the battle ends')
  assert.equal(a.fp, b.fp)
  const u = a.ctx.units
  assert.ok(u.factionCount[F_PLAYER] === 0 || u.factionCount[F_BLIGHT] === 0)
  assert.ok(a.ctx.combat.totals.kills >= 13, `many deaths (${a.ctx.combat.totals.kills})`)
  assert.ok(countFx(a.ctx, FX_ARROW) > 0)
  const c = battle(8)
  assert.ok(c.ticks >= 0)
  assert.notEqual(c.fp, a.fp, 'a different seed gives a different battle')
})

test('a tower kills a crawler in range and ignores one out of range', () => {
  const ctx = makeCtx()
  const t = placeBuilding(ctx, B_WARD_TOWER, 30, 30, { free: true })
  assert.ok(t >= 0)
  const near = spawnUnit(ctx, U_CRAWLER, 34.5, 30.5)
  const far = spawnUnit(ctx, U_CRAWLER, 50.5, 50.5)
  commandHold(ctx, near)
  commandHold(ctx, far)
  const took = runUntil(ctx, (c) => !c.units.alive[near], 400)
  assert.ok(took >= 0, 'near crawler dies')
  assert.ok(took <= 4 * 18 + 5, `in ~4 volleys (${took})`)
  assert.equal(ctx.units.alive[far], 1)
  assert.equal(ctx.units.hp[far], U_HP[U_CRAWLER])
  assert.ok(countFx(ctx, FX_ARROW) >= 4)
  assert.equal(ctx.buildings.alive[t], 1)
})

test('Blight raid damages and destroys a building; idle wardens auto-engage within sight; hold does not chase', () => {
  const ctx = makeCtx()
  const lodge = placeBuilding(ctx, B_STOREHOUSE, 40, 40, { free: true })
  const h = spawnUnit(ctx, U_HUSK, 10.5, 10.5)
  commandRaid(ctx, h, lodge)
  assert.equal(ctx.units.order[h], O_RAID)
  assert.equal(ctx.units.orderTile[h], ctx.buildings.door[lodge])
  assert.ok(runUntil(ctx, (c) => !c.buildings.alive[lodge], 4000) >= 0, 'storehouse destroyed')
  assert.ok(countEv(ctx, EV_BUILDING_LOST) === 1)
  assert.equal(ctx.combat.totals.buildingKills, 1)

  // idle warden picks up a crawler inside sight and kills it
  const ctx2 = makeCtx()
  const w = spawnUnit(ctx2, U_WARDEN, 20.5, 20.5)
  const c = spawnUnit(ctx2, U_CRAWLER, 26.5, 20.5)
  commandHold(ctx2, c)
  run(ctx2, 2)
  assert.equal(ctx2.units.target[w], c)
  assert.ok(runUntil(ctx2, (x) => !x.units.alive[c], 400) >= 0)
  assert.equal(ctx2.units.order[w], O_NONE)

  // holding warden does not walk toward an enemy at sight distance
  const ctx3 = makeCtx()
  const hw = spawnUnit(ctx3, U_WARDEN, 20.5, 20.5)
  const hc = spawnUnit(ctx3, U_CRAWLER, 27.5, 20.5)
  commandHold(ctx3, hw); commandHold(ctx3, hc)
  run(ctx3, 60)
  assert.equal(ctx3.units.x[hw], 20.5)
  assert.equal(ctx3.units.hp[hc], U_HP[U_CRAWLER])
})

test('explicit attack, move ignoring enemies, stop; commands ignore couriers', () => {
  const ctx = makeCtx()
  const w = spawnUnit(ctx, U_TREANT, 10.5, 10.5)
  const e = spawnUnit(ctx, U_CRAWLER, 30.5, 10.5)
  commandHold(ctx, e)
  commandAttack(ctx, w, TK_UNIT, e)
  assert.equal(ctx.units.order[w], O_ATTACK)
  assert.ok(runUntil(ctx, (c) => !c.units.alive[e], 1500) >= 0, 'treant hunts the crawler down')
  run(ctx, 1)
  assert.equal(ctx.units.order[w], O_NONE)
  // move order walks past an enemy without engaging
  const e2 = spawnUnit(ctx, U_CRAWLER, 20.5, 14.5)
  commandHold(ctx, e2)
  commandMove(ctx, w, 20, 20)
  assert.equal(ctx.units.order[w], O_MOVE)
  run(ctx, 5)
  assert.equal(ctx.units.target[w], -1)
  commandStop(ctx, w)
  assert.equal(ctx.units.order[w], O_NONE)
  assert.equal(ctx.units.mstate[w], M_IDLE)
  const cr = spawnUnit(ctx, U_COURIER, 5.5, 5.5)
  commandMove(ctx, cr, 9, 9)
  assert.equal(ctx.units.order[cr], O_NONE)
  assert.equal(ctx.units.mstate[cr], M_IDLE)
  // player cannot attack own buildings / own units
  const t = placeBuilding(ctx, B_WARD_TOWER, 40, 40, { free: true })
  commandAttack(ctx, w, TK_BUILDING, t)
  assert.notEqual(ctx.units.order[w], O_ATTACK)
  assert.equal(damageBuilding(ctx, t, 1e6), true)
  assert.equal(ctx.buildings.alive[t], 0)
  assert.equal(damageUnit(ctx, e2, 1), false)
  assert.equal(damageUnit(ctx, e2, 1e6), true)
})

test('commandGroup spreads goals over distinct walkable tiles, treants first', () => {
  const ctx = makeCtx()
  fillTerrain(ctx, 30, 30, 1, 1, T_WATER)
  const ids = new Int32Array(12)
  for (let k = 0; k < 12; k++) ids[k] = spawnUnit(ctx, k === 7 ? U_TREANT : U_WARDEN, 5.5 + k, 5.5)
  commandGroup(ctx, ids, 12, 30, 30, O_ATTACK_MOVE)
  const goals = new Set()
  for (let k = 0; k < 12; k++) {
    const g = ctx.units.orderTile[ids[k]]
    assert.equal(ctx.units.order[ids[k]], O_ATTACK_MOVE)
    assert.equal(ctx.world.pass[g], 1)
    goals.add(g)
  }
  assert.equal(goals.size, 12)
  const tg = ctx.units.orderTile[ids[7]]
  const d = Math.hypot((tg & 63) - 30, (tg >> 6) - 30)
  assert.ok(d <= 1.5, 'treant gets the spot nearest the target')
  assert.ok(runUntil(ctx, (c) => {
    for (let k = 0; k < 12; k++) if (c.units.order[ids[k]] !== O_NONE) return false
    return true
  }, 2000) >= 0, 'everyone arrives and the order completes')
})

test('Warden Hall trains a paid unit, sends it to rally, cancel refunds', () => {
  const ctx = makeCtx()
  const hearth = placeBuilding(ctx, B_HEARTH, 30, 30, { free: true })
  addItems(ctx, hearth, I_WOOD, 100, false)
  addItems(ctx, hearth, I_PLANK, 40, false)
  const hall = placeBuilding(ctx, B_WARDEN_HALL, 20, 20, { free: true })
  assert.ok(hall >= 0)
  assert.equal(enqueueTraining(ctx, hall, U_TREANT), false, 'treant is tier 1')
  assert.equal(enqueueTraining(ctx, hall, U_CRAWLER), false, 'not trainable here')
  assert.equal(enqueueTraining(ctx, hall, U_WARDEN), true)
  assert.equal(ctx.stock[I_WOOD], 85)
  assert.equal(ctx.stock[I_PLANK], 30)
  assert.equal(enqueueTraining(ctx, hall, U_WARDEN), true)
  assert.equal(cancelTraining(ctx, hall), true)
  assert.equal(ctx.stock[I_WOOD], 85, 'full refund')
  assert.equal(ctx.stock[I_PLANK], 30)
  ctx.buildings.rally[hall] = ctx.world.idx(10, 10)
  const ticks = UNITS[U_WARDEN].trainTicks
  run(ctx, ticks - 1)
  assert.equal(ctx.units.typeCount[U_WARDEN], 0)
  run(ctx, 1)
  assert.equal(ctx.units.typeCount[U_WARDEN], 1)
  assert.equal(ctx.buildings.trainLen[hall], 0)
  const ev = lastEv(ctx, EV_UNIT_TRAINED)
  assert.ok(ev && ev.a === U_WARDEN)
  const w = ev.b
  assert.equal(ctx.units.order[w], O_MOVE)
  assert.ok(runUntil(ctx, (c) => c.units.order[w] === O_NONE, 1000) >= 0)
  assert.deepEqual(tileOf(ctx, w), [10, 10])
  // queue cap and affordability
  ctx.tier = 1
  let ok = 0
  for (let k = 0; k < TRAIN_QUEUE + 2; k++) if (enqueueTraining(ctx, hall, U_TREANT)) ok++
  assert.equal(ok, 0, 'no glowcaps -> cannot afford')
  assert.ok(countEv(ctx, EV_CANNOT_AFFORD) >= 1)
  addItems(ctx, hearth, I_GLOWCAP, 200, false)
  addItems(ctx, hearth, I_PLANK, 200, false)
  for (let k = 0; k < TRAIN_QUEUE + 2; k++) if (enqueueTraining(ctx, hall, U_TREANT)) ok++
  assert.equal(ok, TRAIN_QUEUE)
})

// ------------------------------------------------------------------ waves

test('waves escalate in points, units and frequency; warning precedes spawn', () => {
  const ctx = makeCtx({ waves: true })
  placeBuilding(ctx, B_HEARTH, 30, 30, { free: true })
  const W = ctx.waves
  assert.equal(W.nextTick, WAVES.firstTick)
  // points grow with wave number, time and factory size
  const p1 = wavePoints(ctx, 1), p5 = wavePoints(ctx, 5)
  assert.ok(p5 > p1)
  ctx.tick = 20 * 60 * 20
  assert.ok(wavePoints(ctx, 1) > p1, 'time raises points')
  const before = wavePoints(ctx, 1)
  for (let k = 0; k < 20; k++) placeBuilding(ctx, B_WARD_TOWER, 2 + k * 2, 2, { free: true })
  assert.ok(wavePoints(ctx, 1) > before, 'buildings raise points')
  ctx.tick = 0

  // warning, then spawn, driven by tickWaves through stepSim
  W.nextTick = 700
  run(ctx, 700 - WAVES.warnTicks + 1)
  assert.equal(countEv(ctx, EV_WAVE_WARNING), 1)
  assert.equal(W.number, 0)
  run(ctx, WAVES.warnTicks)
  assert.equal(W.number, 1)
  assert.equal(countEv(ctx, EV_WAVE_SPAWNED), 1)
  const first = lastEv(ctx, EV_WAVE_SPAWNED)
  assert.ok(first.b > 0)
  assert.ok(W.lastSide >= 0 && W.lastSide < 4)
  assert.equal(W.nextTick, 700 + WAVES.interval)
  // every spawned unit is Blight on a raid
  let raiders = 0
  for (let i = 0; i < ctx.units.hi; i++) {
    if (!ctx.units.alive[i] || ctx.units.faction[i] !== F_BLIGHT) continue
    raiders++
    assert.ok(ctx.units.order[i] === O_RAID || ctx.units.target[i] >= 0)
  }
  assert.equal(raiders, first.b)

  // later waves: more units, shorter gaps, more groups
  const counts = [first.b]
  let lastGap = WAVES.interval
  for (let n = 2; n <= 12; n++) {
    const t0 = ctx.tick
    counts.push(spawnWave(ctx))
    const gap = W.nextTick - t0
    assert.ok(gap <= lastGap && gap >= WAVES.minInterval)
    lastGap = gap
  }
  assert.equal(W.number, 12)
  assert.ok(counts[11] > counts[0] * 3, `escalates: ${counts.join(',')}`)
  // unit counts wobble with the roster mix (a husk costs 5 crawlers); 3-wave sums still climb
  for (let k = 3; k < counts.length; k += 3) {
    const a = counts[k - 3] + counts[k - 2] + counts[k - 1], b = counts[k] + counts[k + 1] + counts[k + 2]
    assert.ok(b > a, `escalating windows: ${counts.join(',')}`)
  }
  let husk = ctx.units.typeCount[U_HUSK], wisp = ctx.units.typeCount[U_WISP]
  assert.ok(husk > 0 && wisp > 0, 'later rosters unlock husks and wisps')
  // explicit points override; capped at maxUnits
  assert.equal(spawnWave(ctx, 100000), WAVES.maxUnits)
})

test('wave spawning is deterministic for a seed', () => {
  function sig(seed) {
    const ctx = makeCtx({ seed, waves: true })
    placeBuilding(ctx, B_HEARTH, 30, 30, { free: true })
    let s = ''
    for (let n = 0; n < 6; n++) s += spawnWave(ctx, 30) + ':' + ctx.waves.lastSide + ';'
    for (let i = 0; i < ctx.units.hi; i++) if (ctx.units.alive[i]) s += ctx.units.type[i] + '@' + ctx.units.x[i].toFixed(3) + ','
    return s
  }
  assert.equal(sig(3), sig(3))
  assert.notEqual(sig(3), sig(4))
  // createWaves is allocation-only and never throws
  assert.doesNotThrow(() => createWaves({}))
})

test('raiders eventually kill the hearth and the game is lost (no defence)', () => {
  const ctx = makeCtx({ waves: true })
  const h = placeBuilding(ctx, B_HEARTH, 30, 30, { free: true })
  spawnWave(ctx, 40)
  assert.ok(runUntil(ctx, (c) => c.lost, 6000) >= 0, 'hearth falls')
  assert.equal(ctx.buildings.alive[h], 0)
})

// ------------------------------------------------------------------ scale smoke test

test('scale: 3000 couriers + 1500 soldiers + 500 blight tick within budget', () => {
  const ctx = createBig()
  const u = ctx.units
  // couriers walk long paths, soldiers attack-move into the blight
  for (let i = 0; i < u.hi; i++) {
    if (!u.alive[i]) continue
    if (u.type[i] === U_COURIER) orderMove(ctx, i, (i * 37) & 255, (i * 91) & 255)
    else if (u.faction[i] === F_PLAYER) commandAttackMove(ctx, i, 200, 128)
    else commandAttackMove(ctx, i, 60, 128)
  }
  run(ctx, 30) // warm up paths / JIT
  let tu = 0, tc = 0
  const N = 60
  for (let k = 0; k < N; k++) {
    ctx.path.update()
    let t0 = performance.now(); tickUnits(ctx); tu += performance.now() - t0
    t0 = performance.now(); tickCombat(ctx); tc += performance.now() - t0
    ctx.tick++
  }
  console.log(`# units scale: units=${u.count} tickUnits=${(tu / N).toFixed(3)}ms tickCombat=${(tc / N).toFixed(3)}ms`)
  assert.ok(tu / N < 8 && tc / N < 8, 'generous CI bound')
})

function createBig() {
  const ctx = makeCtx({ w: 256, h: 256, maxUnits: 8192 })
  const rng = ctx.rng
  for (let k = 0; k < 3000; k++) spawnUnit(ctx, U_COURIER, 20 + rng.float() * 216, 20 + rng.float() * 216)
  for (let k = 0; k < 1500; k++) spawnUnit(ctx, k % 5 === 0 ? U_TREANT : U_WARDEN, 60 + rng.float() * 40, 100 + rng.float() * 56)
  for (let k = 0; k < 500; k++) spawnUnit(ctx, k % 4 === 0 ? U_WISP : U_CRAWLER, 160 + rng.float() * 40, 100 + rng.float() * 56)
  return ctx
}
