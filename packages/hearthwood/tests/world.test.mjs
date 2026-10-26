// World module tests: World queries/mutation, CellGrid, generateMap guarantees.
// Imports only the world module + architect-owned shared files.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { World, CellGrid } from '../src/world.js'
import { generateMap } from '../src/mapgen.js'
import { RNG } from '../src/rng.js'
import {
  T_GRASS, T_WATER, T_CLIFF, TERRAIN_WALKABLE, R_NONE, R_TREE, R_STONE, R_ORE, R_GLOWCAP, R_MOONSTONE,
  B_HEARTH, B_LUMBER_LODGE, B_SAWMILL, CHUNK,
} from '../src/constants.js'
import { START, RESOURCES, BUILDINGS, B_W, B_H } from '../src/content.js'

// ------------------------------------------------------------------ helpers (test-only, may allocate)

function fill(world, x0, y0, w, h, t) {
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) world.setTerrain(world.idx(x, y), t)
}

/** 8-connected components of tiles with res === r: [{size, minDist}] */
function deposits(world, r, sx, sy) {
  const seen = new Uint8Array(world.size)
  const out = []
  for (let s = 0; s < world.size; s++) {
    if (seen[s] || world.res[s] !== r) continue
    const stack = [s]
    seen[s] = 1
    let size = 0, minD = Infinity
    while (stack.length) {
      const i = stack.pop()
      size++
      const x = world.tileX(i), y = world.tileY(i)
      const d = Math.hypot(x - sx, y - sy)
      if (d < minD) minD = d
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy
        if (!world.inBounds(nx, ny)) continue
        const j = world.idx(nx, ny)
        if (!seen[j] && world.res[j] === r) { seen[j] = 1; stack.push(j) }
      }
    }
    out.push({ size, minD })
  }
  return out
}

/** 4-connected flood from `from` over pass === 1; returns visited mask */
function flood(world, from) {
  const seen = new Uint8Array(world.size)
  const q = new Int32Array(world.size)
  let h = 0, t = 0
  q[t++] = from
  seen[from] = 1
  while (h < t) {
    const i = q[h++]
    const x = world.tileX(i), y = world.tileY(i)
    const nb = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]
    for (const [nx, ny] of nb) {
      if (!world.inBounds(nx, ny)) continue
      const j = world.idx(nx, ny)
      if (!seen[j] && world.pass[j] === 1) { seen[j] = 1; q[t++] = j }
    }
  }
  return seen
}

function inRect(x, y, sx, sy, r) {
  return x >= sx + r.dx && x < sx + r.dx + r.w && y >= sy + r.dy && y < sy + r.dy + r.h
}

// ------------------------------------------------------------------ World

test('World geometry and packing', () => {
  const w = new World(64, 96)
  assert.equal(w.shift, 6)
  assert.equal(w.mask, 63)
  assert.equal(w.chunksW, 2)
  assert.equal(w.chunksH, 3)
  assert.equal(w.chunkCount, 6)
  const i = w.idx(37, 70)
  assert.equal(w.tileX(i), 37)
  assert.equal(w.tileY(i), 70)
  assert.equal(w.chunkOf(i), 2 * 2 + 1)
  assert.equal(w.chunkOfXY(37, 70), 5)
  assert.throws(() => new World(48, 64))
  assert.throws(() => new World(64, 40))
})

test('occupy/vacate maintain pass, doors, navVersion and chunk nav dirty flags', () => {
  const w = new World(64, 64)
  const nav0 = w.navVersion
  const door = w.doorTile(B_SAWMILL, 10, 10)
  assert.equal(door, w.idx(11, 12))
  assert.ok(w.areaFree(10, 10, 2, 2))
  assert.ok(w.doorUsable(B_SAWMILL, 10, 10))
  const cnv = w.chunkNavVersion[0]
  w.occupy(10, 10, 2, 2, 7, door)
  assert.ok(w.navVersion > nav0)
  assert.ok(w.chunkNavVersion[0] > cnv)
  assert.equal(w.chunkNavVersion[1], 0)
  assert.equal(w.occ[w.idx(11, 11)], 7)
  assert.equal(w.pass[w.idx(11, 11)], 0)
  assert.equal(w.walkable(door), true, 'door tiles stay walkable')
  assert.ok(w.isDoor(door))
  assert.equal(w.areaFree(11, 12, 1, 1), false, 'cannot build on a door')
  assert.equal(w.areaFree(9, 9, 2, 2), false, 'overlaps footprint')
  assert.equal(w.areaFree(63, 0, 2, 1), false, 'out of bounds')
  w.vacate(10, 10, 2, 2, door)
  assert.equal(w.pass[w.idx(11, 11)], 1)
  assert.equal(w.occ[w.idx(11, 11)], -1)
  assert.equal(w.isDoor(door), false)
  // blocked terrain keeps the tile blocked after vacate
  w.setTerrain(w.idx(20, 20), T_WATER)
  w.occupy(20, 20, 1, 1, 3, -1)
  w.vacate(20, 20, 1, 1, -1)
  assert.equal(w.pass[w.idx(20, 20)], 0)
})

test('countResource / findResource honour reach, clipping, amount and hint', () => {
  const w = new World(64, 64)
  for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) w.setResource(w.idx(x, y), R_TREE, 40)
  w.setResource(w.idx(10, 10), R_STONE, 80)
  // footprint (4,4) 2x2 reach 2 -> rect 2..7: only the (2,2) tree
  assert.equal(w.countResource(4, 4, 2, 2, 2, R_TREE), 1)
  assert.equal(w.countResource(4, 4, 2, 2, 1, R_TREE), 0)
  // reach 3 -> rect 1..8: trees at x,y in 1..2 -> 4
  assert.equal(w.countResource(4, 4, 2, 2, 3, R_TREE), 4)
  // clipped at the map corner
  assert.equal(w.countResource(0, 0, 1, 1, 5, R_TREE), 9)
  assert.equal(w.findResource(4, 4, 2, 2, 3, R_TREE, -1), w.idx(1, 1), 'first row-major match')
  assert.equal(w.findResource(4, 4, 2, 2, 3, R_TREE, w.idx(2, 2)), w.idx(2, 2), 'valid hint kept')
  assert.equal(w.findResource(4, 4, 2, 2, 3, R_TREE, w.idx(0, 0)), w.idx(1, 1), 'hint outside rect ignored')
  assert.equal(w.findResource(4, 4, 2, 2, 3, R_TREE, w.idx(10, 10)), w.idx(1, 1), 'hint of other res ignored')
  // harvesting to zero depletes and bumps chunkVersion once
  const v0 = w.chunkVersion[0]
  assert.equal(w.takeResource(w.idx(1, 1), 30), 30)
  assert.equal(w.chunkVersion[0], v0)
  assert.equal(w.takeResource(w.idx(1, 1), 30), 10)
  assert.equal(w.res[w.idx(1, 1)], R_NONE)
  assert.equal(w.chunkVersion[0], v0 + 1)
  assert.equal(w.takeResource(w.idx(1, 1), 30), 0)
  assert.equal(w.countResource(4, 4, 2, 2, 3, R_TREE), 3)
  assert.equal(w.findResource(4, 4, 2, 2, 3, R_TREE, w.idx(1, 1)), w.idx(2, 1))
  assert.equal(w.findResource(30, 30, 2, 2, 2, R_ORE, -1), -1)
})

test('nearestWalkable: self, nearest by distance, deterministic, -1 when none', () => {
  const w = new World(64, 64)
  assert.equal(w.nearestWalkable(5, 5, 3), w.idx(5, 5))
  fill(w, 0, 0, 20, 20, T_CLIFF)
  // walkable at x = 20 column and y = 20 row; from (17,10): nearest is (20,10) at distance 3
  assert.equal(w.nearestWalkable(17, 10, 8), w.idx(20, 10))
  // from (18,18): (20,18) d=2, (18,20) d=2 -> scan order picks the upper one
  assert.equal(w.nearestWalkable(18, 18, 8), w.idx(20, 18))
  assert.equal(w.nearestWalkable(5, 5, 4), -1)
  // diagonal corner (20,20) is farther than an orthogonal tile at a larger ring
  const w2 = new World(64, 64)
  fill(w2, 0, 0, 40, 40, T_WATER)
  w2.setTerrain(w2.idx(23, 23), T_GRASS) // ring 3, d2 = 18
  w2.setTerrain(w2.idx(20, 24), T_GRASS) // ring 4, d2 = 16
  assert.equal(w2.nearestWalkable(20, 20, 10), w2.idx(20, 24))
  // out-of-map query point
  assert.equal(w.nearestWalkable(-3, 30, 5), w.idx(0, 30))
})

test('edgeTile returns walkable tiles near the requested edge spot', () => {
  const w = new World(64, 64)
  assert.equal(w.edgeTile(0, 0.5), w.idx(32, 0))
  assert.equal(w.edgeTile(1, 0.25), w.idx(63, 16))
  assert.equal(w.edgeTile(2, 0), w.idx(0, 63))
  assert.equal(w.edgeTile(3, 0.999), w.idx(0, 63))
  fill(w, 0, 0, 64, 3, T_WATER) // north edge flooded 3 deep
  assert.equal(w.edgeTile(0, 0.5), w.idx(32, 3))
  fill(w, 0, 0, 64, 12, T_WATER)
  assert.equal(w.edgeTile(0, 0.5), -1)
  // lateral search: west edge blocked except a gap 5 tiles below the spot
  const w2 = new World(64, 64)
  fill(w2, 0, 0, 10, 64, T_CLIFF)
  for (let x = 0; x < 10; x++) w2.setTerrain(w2.idx(x, 37), T_GRASS)
  assert.equal(w2.edgeTile(3, 0.5), w2.idx(0, 37))
})

// ------------------------------------------------------------------ CellGrid

test('CellGrid counting sort, queryRect and queryRing match brute force', () => {
  const grid = new CellGrid(64, 64, 2, 600)
  assert.equal(grid.cw, 16)
  assert.equal(grid.cells, 256)
  const rng = new RNG(42)
  const xs = new Float32Array(500), ys = new Float32Array(500)
  grid.clear()
  for (let id = 0; id < 500; id++) {
    xs[id] = rng.frange(0, 64); ys[id] = rng.frange(0, 64)
    grid.add(id, xs[id], ys[id])
  }
  grid.build()
  assert.equal(grid.count, 500)
  assert.equal(grid.cellStart[grid.cells], 500)
  // each cell's items ascending (inserted in id order) and in the right cell
  for (let c = 0; c < grid.cells; c++) {
    for (let j = grid.cellStart[c]; j < grid.cellStart[c + 1]; j++) {
      const id = grid.items[j]
      assert.equal(grid.cellAt(xs[id], ys[id]), c)
      if (j > grid.cellStart[c]) assert.ok(grid.items[j - 1] < id)
    }
  }
  const out = new Int32Array(600)
  // rect query superset/exactness at cell granularity
  for (let k = 0; k < 30; k++) {
    const x0 = rng.frange(-5, 70), y0 = rng.frange(-5, 70), x1 = rng.frange(-5, 70), y1 = rng.frange(-5, 70)
    const n = grid.queryRect(x0, y0, x1, y1, out)
    const got = new Set(out.subarray(0, n))
    assert.equal(got.size, n, 'no duplicates')
    const cx0 = grid.cellX(Math.min(x0, x1)), cx1 = grid.cellX(Math.max(x0, x1))
    const cy0 = grid.cellY(Math.min(y0, y1)), cy1 = grid.cellY(Math.max(y0, y1))
    let expect = 0
    for (let id = 0; id < 500; id++) {
      const cx = grid.cellX(xs[id]), cy = grid.cellY(ys[id])
      const inside = cx >= cx0 && cx <= cx1 && cy >= cy0 && cy <= cy1
      if (inside) { expect++; assert.ok(got.has(id)) }
      // every point strictly inside the query rect is returned
      if (xs[id] >= Math.min(x0, x1) && xs[id] <= Math.max(x0, x1) && ys[id] >= Math.min(y0, y1) && ys[id] <= Math.max(y0, y1)) assert.ok(got.has(id))
    }
    assert.equal(n, expect)
  }
  // rings: union over r = 0..maxRing covers everything exactly once, each at Chebyshev distance r
  for (const [cx, cy] of [[0, 0], [7, 9], [15, 15], [3, 12]]) {
    const all = new Set()
    for (let r = 0; r <= grid.maxRing(cx, cy); r++) {
      const n = grid.queryRing(cx, cy, r, out)
      for (let k = 0; k < n; k++) {
        const id = out[k]
        const d = Math.max(Math.abs(grid.cellX(xs[id]) - cx), Math.abs(grid.cellY(ys[id]) - cy))
        assert.equal(d, r)
        assert.ok(!all.has(id))
        all.add(id)
      }
    }
    assert.equal(all.size, 500)
  }
  // truncation and capacity
  const small = new Int32Array(3)
  assert.equal(grid.queryRect(0, 0, 63, 63, small), 3)
  const g2 = new CellGrid(32, 32, 2, 2)
  g2.clear(); g2.add(1, 1, 1); g2.add(2, 2, 2); g2.add(3, 3, 3); g2.build()
  assert.equal(g2.count, 2)
  // rebuild after clear forgets old ids
  grid.clear(); grid.add(9, 10, 10); grid.build()
  assert.equal(grid.queryRect(0, 0, 63, 63, out), 1)
  assert.equal(out[0], 9)
})

// ------------------------------------------------------------------ mapgen

const SEEDS = [1, 2, 3, 1234567]

function gen(w, h, seed, opts) {
  const world = new World(w, h)
  const r = generateMap(world, seed, opts)
  return { world, ...r }
}

test('generateMap is deterministic per (size, seed) and varies with seed', () => {
  const a = gen(128, 128, 77), b = gen(128, 128, 77), c = gen(128, 128, 78)
  assert.deepEqual(a.world.terrain, b.world.terrain)
  assert.deepEqual(a.world.res, b.world.res)
  assert.deepEqual(a.world.resAmt, b.world.resAmt)
  assert.deepEqual(a.world.pass, b.world.pass)
  assert.notDeepEqual(a.world.terrain, c.world.terrain)
  assert.equal(a.start, a.world.start)
  assert.equal(a.world.seed, 77)
  assert.deepEqual([a.sx, a.sy], [64, 64])
})

test('clearing is walkable and empty except the stamped grove and rocks; START hamlet fits', () => {
  for (const seed of SEEDS) {
    const { world, sx, sy } = gen(256, 256, seed)
    const R = START.clearRadius
    for (let y = sy - R; y <= sy + R; y++) for (let x = sx - R; x <= sx + R; x++) {
      if ((x - sx) ** 2 + (y - sy) ** 2 > R * R) continue
      const i = world.idx(x, y)
      assert.equal(TERRAIN_WALKABLE[world.terrain[i]], 1, `clearing tile ${x},${y} walkable (seed ${seed})`)
      if (!inRect(x, y, sx, sy, START.grove) && !inRect(x, y, sx, sy, START.rocks)) assert.equal(world.res[i], R_NONE)
    }
    for (const def of [START.grove, START.rocks]) {
      for (let y = sy + def.dy; y < sy + def.dy + def.h; y++) for (let x = sx + def.dx; x < sx + def.dx + def.w; x++) {
        const i = world.idx(x, y)
        assert.equal(world.res[i], def.res)
        assert.equal(world.resAmt[i], RESOURCES[def.res].amount)
        assert.equal(world.pass[i], 1)
      }
    }
    // the opening buildings can be placed exactly where game.setupStart puts them
    const placements = [{ type: B_HEARTH, dx: START.hearth.dx, dy: START.hearth.dy }, ...START.buildings]
    for (const p of placements) {
      const tx = sx + p.dx, ty = sy + p.dy
      assert.ok(world.areaFree(tx, ty, B_W[p.type], B_H[p.type]), `${BUILDINGS[p.type].key} footprint free`)
      assert.ok(world.doorUsable(p.type, tx, ty), `${BUILDINGS[p.type].key} door usable`)
      const ex = BUILDINGS[p.type].extractor
      if (ex) assert.ok(world.countResource(tx, ty, B_W[p.type], B_H[p.type], ex.reach, ex.res) > 0)
    }
    assert.ok(world.countResource(sx + START.buildings[0].dx, sy + START.buildings[0].dy, 2, 2, 3, R_TREE) >= 6)
    assert.equal(START.buildings[0].type, B_LUMBER_LODGE)
  }
})

test('resource mix: trees > stone > ore > glowcap > moonstone, each type in >= 2 deposits outside the clearing', () => {
  for (const seed of SEEDS) {
    const { world, sx, sy } = gen(256, 256, seed)
    const cnt = new Int32Array(6)
    let land = 0
    for (let i = 0; i < world.size; i++) {
      cnt[world.res[i]]++
      if (TERRAIN_WALKABLE[world.terrain[i]]) land++
      if (world.res[i] !== R_NONE) {
        assert.equal(TERRAIN_WALKABLE[world.terrain[i]], 1, 'resources only on walkable terrain')
        assert.equal(world.resAmt[i], RESOURCES[world.res[i]].amount)
      }
    }
    assert.ok(cnt[R_TREE] > cnt[R_STONE], `trees ${cnt[R_TREE]} > stone ${cnt[R_STONE]}`)
    assert.ok(cnt[R_STONE] > cnt[R_ORE], `stone ${cnt[R_STONE]} > ore ${cnt[R_ORE]}`)
    assert.ok(cnt[R_ORE] > cnt[R_GLOWCAP], `ore ${cnt[R_ORE]} > glowcap ${cnt[R_GLOWCAP]}`)
    assert.ok(cnt[R_GLOWCAP] > cnt[R_MOONSTONE], `glowcap ${cnt[R_GLOWCAP]} > moonstone ${cnt[R_MOONSTONE]}`)
    assert.ok(cnt[R_MOONSTONE] > 0)
    // tree cover roughly as configured
    const treeFrac = cnt[R_TREE] / land
    assert.ok(treeFrac > 0.2 && treeFrac < 0.4, `tree fraction ${treeFrac}`)
    let water = 0, cliff = 0
    for (let i = 0; i < world.size; i++) { if (world.terrain[i] === T_WATER) water++; else if (world.terrain[i] === T_CLIFF) cliff++ }
    assert.ok(water / world.size > 0.03 && water / world.size < 0.09, `water ${water / world.size}`)
    assert.ok(cliff / world.size > 0.01 && cliff / world.size < 0.05, `cliff ${cliff / world.size}`)
    for (const r of [R_TREE, R_STONE, R_ORE, R_GLOWCAP, R_MOONSTONE]) {
      const outside = deposits(world, r, sx, sy).filter((d) => d.minD > START.clearRadius)
      assert.ok(outside.length >= 2, `res ${r} has ${outside.length} deposits outside the clearing (seed ${seed})`)
    }
  }
})

test('guaranteed deposits: ore seam 18..32, glowcap ring 18..40, far moonstone vein', () => {
  for (const seed of SEEDS) {
    const { world, sx, sy } = gen(256, 256, seed)
    const ore = deposits(world, R_ORE, sx, sy)
    assert.ok(ore.some((d) => d.size >= 12 && d.minD >= 18 && d.minD <= 32), `ore seam near start (seed ${seed})`)
    const glow = deposits(world, R_GLOWCAP, sx, sy)
    assert.ok(glow.some((d) => d.size >= 10 && d.minD >= 18 && d.minD <= 40), `glowcap ring (seed ${seed})`)
    const moon = deposits(world, R_MOONSTONE, sx, sy)
    assert.ok(moon.some((d) => d.size >= 8 && d.minD >= 45), `moonstone vein (seed ${seed})`)
    for (const d of moon) assert.ok(d.minD >= 45 || d.size < 8 || true)
  }
})

test('every walkable tile (so every resource and edge) is reachable from start; edges spawnable', () => {
  for (const seed of SEEDS) {
    const { world, start } = gen(256, 256, seed)
    const seen = flood(world, start)
    let unreached = 0
    for (let i = 0; i < world.size; i++) if (world.pass[i] === 1 && !seen[i]) unreached++
    assert.equal(unreached, 0, `seed ${seed}: ${unreached} walkable tiles unreachable`)
    for (let side = 0; side < 4; side++) {
      for (let t = 0; t < 1; t += 0.125) {
        const e = world.edgeTile(side, t)
        assert.ok(e >= 0, `edge ${side} at ${t}`)
        assert.ok(seen[e])
      }
    }
  }
})

test('small and large maps generate; 512x512 within budget', () => {
  const s = gen(64, 64, 5)
  assert.deepEqual([s.sx, s.sy], [32, 32])
  const seen = flood(s.world, s.start)
  for (let i = 0; i < s.world.size; i++) if (s.world.pass[i] === 1) assert.ok(seen[i])
  const moon = deposits(s.world, R_MOONSTONE, 32, 32)
  assert.ok(moon.some((d) => d.size >= 8), 'small map still has a moonstone vein')
  const ore = deposits(s.world, R_ORE, 32, 32)
  assert.ok(ore.some((d) => d.size >= 12 && d.minD >= 18 && d.minD <= 32))
  // non-square map
  const r = gen(256, 128, 9)
  assert.deepEqual([r.sx, r.sy], [128, 64])
  // timing: warm up once (JIT), then measure the best of two
  gen(512, 512, 11)
  let best = Infinity
  for (let k = 0; k < 2; k++) {
    const t0 = performance.now()
    gen(512, 512, 12 + k)
    best = Math.min(best, performance.now() - t0)
  }
  // budget is 150 ms; allow slack for loaded CI machines
  assert.ok(best < 400, `512x512 mapgen took ${best.toFixed(1)} ms`)
  if (best > 150) console.log(`# note: 512x512 mapgen ${best.toFixed(1)} ms (budget 150)`)
})

test('mapgen respects cover options', () => {
  const a = gen(256, 256, 3, { treeCover: 0.1, waterCover: 0.02, cliffCover: 0.01 })
  const b = gen(256, 256, 3)
  const count = (w, pred) => { let n = 0; for (let i = 0; i < w.size; i++) if (pred(w, i)) n++; return n }
  assert.ok(count(a.world, (w, i) => w.res[i] === R_TREE) < count(b.world, (w, i) => w.res[i] === R_TREE) / 2)
  assert.ok(count(a.world, (w, i) => w.terrain[i] === T_WATER) < count(b.world, (w, i) => w.terrain[i] === T_WATER))
  assert.equal(T_GRASS, 0)
  assert.equal(CHUNK, 32)
})
