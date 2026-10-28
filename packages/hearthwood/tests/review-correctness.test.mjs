// Reviewer repros (correctness lens). Each test asserts the CORRECT behaviour, so a
// failing test here is a confirmed bug.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { makeCtx, fillTerrain, run } from './helpers.mjs'
import {
  B_HEARTH, B_STOREHOUSE, B_SPRITE_DEN, B_SAWMILL, U_COURIER, I_PLANK, T_CLIFF, P_OK, I_WOOD, I_STONE, U_CRAWLER, F_BLIGHT, O_NONE,
} from '../src/constants.js'
import { B_HP } from '../src/content.js'
import { placeBuilding, canPlace, addItems } from '../src/buildings.js'
import { spawnUnit } from '../src/units.js'
import { commandRaid } from '../src/combat.js'

// A player plugs a 2-tile pass in a cliff wall with an ordinary (non-free, wouldEnclose-checked)
// building whose door faces into the base. Blight chase buildings by pathing to the DOOR, so a
// building whose door is unreachable can never be attacked, and raids targeting it fail forever.
test('review: Blight can attack a building that plugs a pass even when its door faces inward', () => {
  const ctx = makeCtx({ w: 64, h: 64 })
  // cliff ring 8..55 with a 2-wide gap on the north side at x = 30, 31
  for (let i = 8; i <= 55; i++) {
    for (const [x, y] of [[i, 8], [i, 55], [8, i], [55, i]]) {
      if (y === 8 && (x === 30 || x === 31)) continue
      fillTerrain(ctx, x, y, 1, 1, T_CLIFF)
    }
  }
  const hearth = placeBuilding(ctx, B_HEARTH, 30, 30, { free: true })
  assert.ok(hearth >= 0)
  addItems(ctx, hearth, I_WOOD, 100, false)
  addItems(ctx, hearth, I_STONE, 100, false)
  // ordinary player placement into the pass: footprint (30..31, 7..8), door (31, 9) inside
  assert.equal(canPlace(ctx, B_STOREHOUSE, 30, 7), P_OK)
  const plug = placeBuilding(ctx, B_STOREHOUSE, 30, 7, { free: true }) // built at once (sites start at half HP)
  assert.ok(plug >= 0)
  // a few crawlers north of the plug, raiding
  const ids = []
  for (let k = 0; k < 6; k++) {
    const id = spawnUnit(ctx, U_CRAWLER, 28.5 + k, 3.5, F_BLIGHT)
    commandRaid(ctx, id, -1)
    ids.push(id)
  }
  run(ctx, 2400) // 2 minutes
  const B = ctx.buildings
  const hp = B.alive[plug] ? B.hp[plug] : 0
  let idle = 0
  for (const id of ids) if (ctx.units.alive[id] && ctx.units.order[id] === O_NONE) idle++
  // correct behaviour: the plug (adjacent to reachable ground) gets attacked
  assert.ok(hp < B_HP[B_STOREHOUSE], `plug untouched after 2 min (hp ${hp}); ${idle}/6 crawlers idle in O_NONE`)
})

// Couriers are Blight's preferred prey and the only way goods reach storage; Dens are the only
// courier source and pay 3 planks FROM STORAGE per spawn. Once every courier is dead and storage
// holds < 3 planks, nothing can ever move the planks sitting in the Sawmill: permanent soft-lock.
test('review: economy recovers after a raid kills every courier (planks only in a producer buffer)', () => {
  const ctx = makeCtx({ w: 64, h: 64 })
  const hearth = placeBuilding(ctx, B_HEARTH, 30, 30, { free: true })
  placeBuilding(ctx, B_SPRITE_DEN, 24, 30, { free: true })
  const mill = placeBuilding(ctx, B_SAWMILL, 36, 30, { free: true })
  addItems(ctx, hearth, I_PLANK, 2, false) // one plank short of a courier
  addItems(ctx, mill, I_PLANK, 20, false) // plenty of planks, but in the mill's output buffer
  assert.equal(ctx.units.typeCount[U_COURIER], 0)
  run(ctx, 20 * 60 * 3) // 3 minutes
  assert.ok(ctx.units.typeCount[U_COURIER] > 0, `no courier after 3 min; den status stuck, stock plank=${ctx.stock[I_PLANK]}`)
})

// Playability: the starting Sawmill must not eat the wood the player builds with.
test('review: crafters leave a construction reserve of raw wood in storage', async () => {
  const { CRAFT_RESERVE } = await import('../src/logistics.js')
  const ctx = makeCtx({ w: 64, h: 64 })
  const hearth = placeBuilding(ctx, B_HEARTH, 30, 30, { free: true })
  addItems(ctx, hearth, I_WOOD, CRAFT_RESERVE[I_WOOD] + 12, false)
  placeBuilding(ctx, B_SAWMILL, 36, 30, { free: true })
  for (let k = 0; k < 4; k++) spawnUnit(ctx, U_COURIER, 31.5 + k * 0.1, 33.5)
  let min = Infinity
  for (let t = 0; t < 20 * 60; t++) { run(ctx, 1); if (ctx.stock[I_WOOD] < min) min = ctx.stock[I_WOOD] }
  assert.equal(min, CRAFT_RESERVE[I_WOOD], 'pulled down to the reserve and no further')
  assert.ok(ctx.stock[I_PLANK] > 0, 'the surplus above the reserve became planks')
})

// Scale: separation must not look at couriers (it used to scan every courier in the cell).
test('review: soldier separation ignores couriers and still separates soldiers', async () => {
  const { U_WARDEN } = await import('../src/constants.js')
  const ctx = makeCtx({ w: 64, h: 64 })
  for (let k = 0; k < 500; k++) spawnUnit(ctx, U_COURIER, 20.5, 20.5)
  const a = spawnUnit(ctx, U_WARDEN, 20.5, 20.5)
  const b = spawnUnit(ctx, U_WARDEN, 20.5, 20.5)
  run(ctx, 40)
  const dx = ctx.units.x[a] - ctx.units.x[b], dy = ctx.units.y[a] - ctx.units.y[b]
  assert.ok(Math.hypot(dx, dy) > 0.2, 'stacked wardens pushed apart')
  assert.equal(ctx.sepGrid.count, 2, 'only non-couriers in the separation grid')
})
