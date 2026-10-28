// Review repros (construction sites), fixed: findProvider site mode scores producers and storage
// together, so a site beside a full Hearth no longer sends couriers on long walks to a lodge
// for 1-3 logs; and the site pass may hold at most half the fleet, so the pull/push passes keep
// running while sites are open.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { paintResource } from './helpers.mjs'
import { I_WOOD, I_STONE, I_PLANK, ITEM_SHIFT, B_HEARTH, B_LUMBER_LODGE, B_SPRITE_DEN, U_COURIER, J_TO_PICKUP, R_TREE } from '../src/constants.js'
import { createContext, stepSim } from '../src/context.js'
import { placeBuilding, addItems } from '../src/buildings.js'
import { spawnUnit } from '../src/units.js'

function setup() {
  const ctx = createContext({ w: 64, h: 64, seed: 1, generate: false, waves: false, maxUnits: 512, maxBuildings: 256 })
  const h = placeBuilding(ctx, B_HEARTH, 30, 30, { free: true }) // door (31,33)
  paintResource(ctx, 4, 4, 6, 6, R_TREE)
  const lodge = placeBuilding(ctx, B_LUMBER_LODGE, 10, 6, { free: true }) // ~45 tiles from the site
  addItems(ctx, h, I_WOOD, 200, false)
  addItems(ctx, h, I_STONE, 50, false)
  addItems(ctx, lodge, I_WOOD, 2, false) // a couple of logs waiting in the lodge's output
  for (let i = 0; i < 6; i++) spawnUnit(ctx, U_COURIER, 31.5 + (i % 3) * 0.3, 34.5)
  stepSim(ctx) // couriers settle idle
  return { ctx, h, lodge }
}

test('a site beside a full Hearth is not supplied 1-2 logs at a time from a distant lodge', () => {
  const { ctx, h, lodge } = setup()
  const site = placeBuilding(ctx, B_SPRITE_DEN, 34, 36) // 30 wood + 10 stone, 4 tiles from the Hearth
  assert.ok(site >= 0 && ctx.buildings.site[site] === 1)
  const U = ctx.units
  // a lodge trip = a courier whose J_TO_PICKUP job for this site names the lodge as source
  // (counted once per job: on the tick its (src, qty) pair first appears for that courier)
  const last = new Map()
  let lodgeTrips = 0, lodgeItems = 0
  for (let t = 0; t < 3000 && ctx.buildings.site[site]; t++) {
    stepSim(ctx)
    for (let u = 0; u < U.hi; u++) {
      const on = U.alive[u] && U.job[u] === J_TO_PICKUP && U.jobDst[u] === site
      const k = on ? U.jobSrc[u] + ':' + U.jobQty[u] : ''
      if (on && last.get(u) !== k && U.jobSrc[u] === lodge) { lodgeTrips++; lodgeItems += U.jobQty[u] }
      last.set(u, k)
    }
  }
  assert.equal(ctx.buildings.site[site], 0, 'site completes')
  // Expected: wood comes from the Hearth 4 tiles away in full loads (200 in stock). Actual:
  // lodge pickups of 1-2 logs, each a ~90-tile round trip.
  assert.equal(lodgeTrips, 0, `site sent ${lodgeTrips} courier(s) to the distant lodge for ${lodgeItems} log(s) while the Hearth held ${ctx.stock[I_WOOD]}+ wood`)
})

test('the first site job for wood goes to the adjacent full Hearth, not to a distant lodge for 2 logs', () => {
  const { ctx, h, lodge } = setup()
  const site = placeBuilding(ctx, B_SPRITE_DEN, 34, 36)
  stepSim(ctx) // site pass runs
  const U = ctx.units
  const woodJobs = []
  for (let u = 0; u < U.hi; u++) if (U.alive[u] && U.job[u] && U.jobDst[u] === site && U.jobItem[u] === I_WOOD) woodJobs.push([U.jobSrc[u], U.jobQty[u]])
  // today: [[lodge, 2], [hearth, 5], ...] — the 2-log lodge pickup is the bug
  assert.ok(!woodJobs.some(([s]) => s === lodge), `no lodge job: ${JSON.stringify(woodJobs)}`)
  assert.ok(ctx.buildings.inv[(h << ITEM_SHIFT) | I_WOOD] >= 150)
})

test('open sites leave couriers for the pull pass: a Sawmill beside 200 stored wood is not starved for minutes', async () => {
  const { B_SAWMILL, B_WARDEN_HALL, BS_STARVED } = await import('../src/constants.js')
  const { ctx } = setup()
  const saw = placeBuilding(ctx, B_SAWMILL, 24, 34, { free: true }) // 6 tiles from the Hearth, input empty
  addItems(ctx, ctx.buildings.typeList[B_HEARTH][0], I_STONE, 50, false) // 100 stone: enough for all three
  const sites = [placeBuilding(ctx, B_WARDEN_HALL, 36, 26), placeBuilding(ctx, B_WARDEN_HALL, 36, 36), placeBuilding(ctx, B_WARDEN_HALL, 22, 24)]
  assert.ok(saw >= 0 && sites.every((b) => b >= 0 && ctx.buildings.site[b] === 1))
  let open = 0, pullTicks = 0, starved = 0
  for (let t = 0; t < 4000 && sites.some((b) => ctx.buildings.site[b]); t++) {
    stepSim(ctx)
    open++
    if (ctx.log.stats.pullVisits > 0) pullTicks++
    if (ctx.buildings.status[saw] === BS_STARVED) starved++
  }
  // 200 wood sit in the Hearth next to the Sawmill the whole time. Before the site share cap it
  // was BS_STARVED for the whole ~2650 ticks (pull pass ran on ~130). Its normal duty cycle
  // with no sites at all is ~54% starved (it out-eats one courier's deliveries), so sites
  // must not push it much beyond that.
  assert.ok(open > 300, `sites stayed open ${open} ticks`)
  assert.ok(sites.every((b) => ctx.buildings.site[b] === 0), 'all three halls raised')
  assert.ok(pullTicks > open * 0.2, `pull pass ran on only ${pullTicks}/${open} ticks`)
  assert.ok(starved < open * 0.7, `sawmill starved ${starved}/${open} ticks`)
  const planks = ctx.stock[I_PLANK] + ctx.buildings.inv[(saw << ITEM_SHIFT) | I_PLANK]
  assert.ok(planks >= 10, `sawmill made ${planks} planks while the sites were open`)
})
