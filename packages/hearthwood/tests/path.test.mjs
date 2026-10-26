// Path module tests: MinHeap, A* optimality + corner rule, budgeted PathService,
// dedupe, cache identity + navVersion revalidation, LRU bound, regions, ring expiry.
// Imports only the world module + architect-owned shared files.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { World } from '../src/world.js'
import { MinHeap, findPathSync, pathCost, PathService, PATH_PENDING, PATH_NONE } from '../src/path.js'
import { generateMap } from '../src/mapgen.js'
import { RNG } from '../src/rng.js'
import { T_GRASS, T_WATER, T_CLIFF, COST_STRAIGHT, COST_DIAG, PATH_RING } from '../src/constants.js'

// ------------------------------------------------------------------ helpers (test-only)

function fill(world, x0, y0, w, h, t) {
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) world.setTerrain(world.idx(x, y), t)
}

/** Reference Dijkstra (simple O(n^2)-ish with array scan; small maps only), same move rules. */
function dijkstra(world, from, to) {
  const n = world.size
  const dist = new Float64Array(n).fill(Infinity)
  const done = new Uint8Array(n)
  dist[from] = 0
  // bucket queue by cost
  const buckets = new Map()
  const push = (i, d) => { if (!buckets.has(d)) buckets.set(d, []); buckets.get(d).push(i) }
  push(from, 0)
  let d = 0
  const maxD = n * COST_DIAG + 1
  while (d <= maxD) {
    const b = buckets.get(d)
    if (!b || b.length === 0) { buckets.delete(d); d++; continue }
    const i = b.pop()
    if (done[i] || dist[i] !== d) continue
    done[i] = 1
    if (i === to) return d
    const x = world.tileX(i), y = world.tileY(i)
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue
      const nx = x + dx, ny = y + dy
      if (!world.walkableXY(nx, ny)) continue
      if (dx && dy && (!world.walkableXY(x + dx, y) || !world.walkableXY(x, y + dy))) continue
      const nd = d + (dx && dy ? COST_DIAG : COST_STRAIGHT)
      const j = world.idx(nx, ny)
      if (nd < dist[j]) { dist[j] = nd; push(j, nd) }
    }
  }
  return -1
}

/** Assert a path is a legal 8-connected walk without corner cutting. */
function assertLegal(world, p, from, to) {
  assert.equal(p[0], from)
  assert.equal(p[p.length - 1], to)
  for (let k = 1; k < p.length; k++) {
    const ax = world.tileX(p[k - 1]), ay = world.tileY(p[k - 1]), bx = world.tileX(p[k]), by = world.tileY(p[k])
    const dx = bx - ax, dy = by - ay
    assert.ok(Math.abs(dx) <= 1 && Math.abs(dy) <= 1 && (dx || dy), 'adjacent steps')
    assert.ok(world.walkable(p[k]), 'walkable step')
    if (dx && dy) assert.ok(world.walkableXY(ax + dx, ay) && world.walkableXY(ax, ay + dy), 'no corner cutting')
  }
}

/** Serpentine maze: horizontal walls every 4 rows with a gap alternating left/right. */
function maze(world) {
  for (let y = 3; y < world.h - 1; y += 4) {
    const gapLeft = ((y - 3) / 4) % 2 === 0
    for (let x = 0; x < world.w; x++) {
      if (gapLeft ? x < 2 : x >= world.w - 2) continue
      world.setTerrain(world.idx(x, y), T_CLIFF)
    }
  }
}

function drain(ps, job, budget = 6000, maxUpdates = 10000) {
  let r = ps.poll(job), n = 0
  while (r === PATH_PENDING && n < maxUpdates) { ps.update(budget); r = ps.poll(job); n++ }
  return { r, n }
}

// ------------------------------------------------------------------ MinHeap

test('MinHeap pops in key order, honours tie keys, reports full, grows', () => {
  const h = new MinHeap(64)
  const rng = new RNG(5)
  const ref = []
  for (let i = 0; i < 64; i++) { const k = rng.int(20); ref.push(k); assert.ok(h.push(i, k)) }
  assert.equal(h.push(99, 0), false, 'full')
  ref.sort((a, b) => a - b)
  let last = -1
  for (let i = 0; i < 64; i++) {
    assert.equal(h.peekKey(), ref[i])
    const v = h.pop()
    assert.ok(v >= 0)
    assert.ok(ref[i] >= last)
    last = ref[i]
  }
  assert.equal(h.pop(), -1)
  // ties: smaller tie first
  h.clear()
  h.push(1, 5, 9); h.push(2, 5, 3); h.push(3, 5, 7); h.push(4, 4, 100)
  assert.deepEqual([h.pop(), h.pop(), h.pop(), h.pop()], [4, 2, 3, 1])
  h.grow()
  assert.equal(h.capacity, 128)
  for (let i = 0; i < 128; i++) assert.ok(h.push(i, 128 - i))
  assert.equal(h.pop(), 127)
})

// ------------------------------------------------------------------ A*

test('findPathSync: straight, diagonal, trivial and impossible cases', () => {
  const w = new World(64, 64)
  const a = w.idx(5, 5)
  assert.deepEqual([...findPathSync(w, a, a)], [a])
  const p = findPathSync(w, a, w.idx(15, 5))
  assert.equal(p.length, 11)
  assert.equal(pathCost(w, p), 100)
  const d = findPathSync(w, a, w.idx(10, 10))
  assert.equal(d.length, 6)
  assert.equal(pathCost(w, d), 5 * COST_DIAG)
  // octile: 10 across, 4 down -> 4 diagonals + 6 straights
  assert.equal(pathCost(w, findPathSync(w, a, w.idx(15, 9))), 4 * COST_DIAG + 6 * COST_STRAIGHT)
  // goal unwalkable
  w.setTerrain(w.idx(20, 20), T_WATER)
  assert.equal(findPathSync(w, a, w.idx(20, 20)), null)
  // goal sealed off
  fill(w, 40, 40, 5, 1, T_CLIFF); fill(w, 40, 44, 5, 1, T_CLIFF); fill(w, 40, 40, 1, 5, T_CLIFF); fill(w, 44, 40, 1, 5, T_CLIFF)
  assert.equal(findPathSync(w, a, w.idx(42, 42)), null)
  assert.equal(findPathSync(w, a, w.idx(42, 42), 50), null)
})

test('findPathSync never cuts corners and treats a blocked start as walkable', () => {
  const w = new World(32, 32)
  // two blocks touching diagonally: (10,10) and (11,11) blocked; going (10,11)->(11,10) diagonal is illegal
  w.setTerrain(w.idx(10, 10), T_CLIFF)
  w.setTerrain(w.idx(11, 11), T_CLIFF)
  const p = findPathSync(w, w.idx(10, 11), w.idx(11, 10))
  assertLegal(w, p, w.idx(10, 11), w.idx(11, 10))
  assert.ok(p.length > 2)
  // a full diagonal wall is impassable
  const w2 = new World(32, 32)
  for (let k = 0; k < 32; k++) w2.setTerrain(w2.idx(k, 31 - k), T_CLIFF)
  assert.equal(findPathSync(w2, w2.idx(2, 2), w2.idx(30, 30)), null)
  // start inside a blocked tile (unit standing in a fresh building's edge) still paths out;
  // only the start tile itself is exempt, so the centre of a 3x3 footprint is stuck
  // (units.js ejects such units with world.nearestWalkable first)
  const w3 = new World(32, 32)
  w3.occupy(5, 5, 3, 3, 1, -1)
  const q = findPathSync(w3, w3.idx(7, 6), w3.idx(20, 6))
  assert.ok(q)
  assert.equal(q[0], w3.idx(7, 6))
  assert.equal(findPathSync(w3, w3.idx(6, 6), w3.idx(20, 6)), null)
  for (let k = 1; k < q.length; k++) assert.ok(w3.walkable(q[k]))
})

test('A* is optimal around random obstacles (vs reference Dijkstra)', () => {
  const rng = new RNG(99)
  for (let trial = 0; trial < 25; trial++) {
    const w = new World(32, 32)
    const density = 0.15 + rng.float() * 0.25
    for (let i = 0; i < w.size; i++) if (rng.float() < density) w.setTerrain(i, rng.chance(0.5) ? T_WATER : T_CLIFF)
    for (let k = 0; k < 6; k++) {
      const a = rng.int(w.size), b = rng.int(w.size)
      if (!w.walkable(a) || !w.walkable(b)) continue
      const ref = dijkstra(w, a, b)
      const p = findPathSync(w, a, b)
      if (ref < 0) { assert.equal(p, null); continue }
      assert.ok(p, `trial ${trial}: path exists`)
      assertLegal(w, p, a, b)
      assert.equal(pathCost(w, p), ref, `trial ${trial}: optimal cost`)
    }
  }
})

test('A* routes optimally around a building wall', () => {
  const w = new World(64, 64)
  // a wall of buildings x=30..31, y=10..49 with doors; go from left to right side
  for (let y = 10; y < 50; y += 2) w.occupy(30, y, 2, 2, y, -1)
  const a = w.idx(20, 30), b = w.idx(40, 30)
  const p = findPathSync(w, a, b)
  assertLegal(w, p, a, b)
  assert.equal(pathCost(w, p), dijkstra(w, a, b))
  for (let k = 0; k < p.length; k++) assert.equal(w.occ[p[k]], -1)
})

// ------------------------------------------------------------------ PathService

test('request resolves trivial cases immediately', () => {
  const w = new World(64, 64)
  const ps = new PathService(w)
  const a = w.idx(3, 3)
  const j0 = ps.request(a, a)
  const p0 = ps.poll(j0)
  assert.deepEqual([...p0], [a])
  assert.equal(ps.poll(ps.request(a, a)), p0, 'single-tile paths are cached too')
  w.setTerrain(w.idx(9, 9), T_WATER)
  assert.equal(ps.poll(ps.request(a, w.idx(9, 9))), PATH_NONE, 'unwalkable goal')
  assert.equal(ps.poll(ps.request(a, -1)), PATH_NONE, 'invalid tile')
  assert.equal(ps.poll(ps.request(a, w.size)), PATH_NONE)
  // sealed region: rejected without any expansion
  fill(w, 40, 40, 6, 1, T_CLIFF); fill(w, 40, 45, 6, 1, T_CLIFF); fill(w, 40, 40, 1, 6, T_CLIFF); fill(w, 45, 40, 1, 6, T_CLIFF)
  const exp0 = ps.stats.expansions
  const j = ps.request(a, w.idx(42, 42))
  assert.equal(ps.poll(j), PATH_NONE)
  assert.equal(ps.pending(), 0)
  ps.update()
  assert.equal(ps.stats.expansions, exp0)
  assert.equal(ps.poll(12345678), PATH_NONE, 'unknown job')
  assert.equal(ps.poll(-1), PATH_NONE)
})

test('request queues, dedupes identical pending pairs, update resolves', () => {
  const w = new World(64, 64)
  const ps = new PathService(w)
  const a = w.idx(1, 1), b = w.idx(60, 50)
  const j1 = ps.request(a, b)
  assert.equal(ps.poll(j1), PATH_PENDING)
  const j2 = ps.request(a, b)
  assert.equal(j2, j1, 'deduped onto the same job')
  const j3 = ps.request(b, a)
  assert.notEqual(j3, j1)
  assert.equal(ps.pending(), 2)
  assert.equal(ps.stats.misses, 2)
  ps.update()
  const p = ps.poll(j1)
  assert.ok(p.length > 1)
  assertLegal(w, p, a, b)
  assert.equal(pathCost(w, p), dijkstra(w, a, b))
  const q = ps.poll(j3)
  assertLegal(w, q, b, a)
  assert.equal(ps.pending(), 0)
  assert.equal(ps.stats.found, 2)
  // after completion the same pair is a cache hit with a NEW job id
  const j4 = ps.request(a, b)
  assert.notEqual(j4, j1)
  assert.equal(ps.poll(j4), p)
})

test('budget splits a long search across updates and never exceeds the budget', () => {
  const w = new World(64, 64)
  maze(w)
  const ps = new PathService(w, { budget: 200 })
  const a = w.idx(32, 1), b = w.idx(32, 62)
  const job = ps.request(a, b)
  let updates = 0
  while (ps.poll(job) === PATH_PENDING) {
    const used = ps.update()
    assert.ok(used <= 200, `used ${used}`)
    assert.equal(ps.stats.lastUpdateExpansions, used)
    updates++
    if (updates === 1) assert.equal(ps.poll(job), PATH_PENDING, 'still pending after the first slice')
    assert.ok(updates < 1000)
  }
  assert.ok(updates >= 5, `search spanned ${updates} updates`)
  const p = ps.poll(job)
  assertLegal(w, p, a, b)
  assert.equal(pathCost(w, p), dijkstra(w, a, b), 'resumed search is still optimal')
  assert.deepEqual([...p], [...findPathSync(w, a, b)], 'same result as the unbudgeted solver')
  // a FIFO queue: two long jobs, the second starts only after the first finishes
  ps.clear()
  const j1 = ps.request(w.idx(1, 1), w.idx(62, 62))
  const j2 = ps.request(w.idx(62, 1), w.idx(1, 62))
  let sawFirstDoneSecondPending = false
  for (let k = 0; k < 2000 && (ps.poll(j1) === PATH_PENDING || ps.poll(j2) === PATH_PENDING); k++) {
    ps.update(150)
    if (ps.poll(j1) !== PATH_PENDING && ps.poll(j2) === PATH_PENDING) sawFirstDoneSecondPending = true
    assert.ok(!(ps.poll(j1) === PATH_PENDING && ps.poll(j2) !== PATH_PENDING), 'FIFO order')
  }
  assert.ok(sawFirstDoneSecondPending)
  assert.ok(ps.poll(j1).length > 1 && ps.poll(j2).length > 1)
})

test('cache hits return the same Int32Array; navVersion bumps revalidate or invalidate', () => {
  const w = new World(64, 64)
  const ps = new PathService(w)
  const a = w.idx(5, 30), b = w.idx(55, 30)
  const { r: p1 } = drain(ps, ps.request(a, b))
  assert.ok(p1.length > 1)
  const hits0 = ps.stats.hits
  const j = ps.request(a, b)
  assert.equal(ps.poll(j), p1, 'same instance')
  assert.equal(ps.cached(a, b), p1)
  assert.equal(ps.stats.hits, hits0 + 1)
  // passability change OFF the path: lazily revalidated, still the same instance
  const nav0 = w.navVersion
  w.occupy(10, 50, 2, 2, 1, w.idx(11, 52))
  assert.ok(w.navVersion > nav0)
  assert.equal(ps.poll(ps.request(a, b)), p1, 'revalidated after an unrelated change')
  // passability change ON the path: evicted, new search, path avoids the building
  const mid = p1[p1.length >> 1]
  const mx = w.tileX(mid), my = w.tileY(mid)
  w.occupy(mx - 1, my - 1, 3, 3, 2, w.idx(mx, my + 2))
  assert.equal(ps.cached(a, b), null)
  const j2 = ps.request(a, b)
  assert.equal(ps.poll(j2), PATH_PENDING)
  const { r: p2 } = drain(ps, j2)
  assert.notEqual(p2, p1)
  assertLegal(w, p2, a, b)
  for (let k = 0; k < p2.length; k++) assert.equal(w.occ[p2[k]], -1)
  assert.equal(pathCost(w, p2), dijkstra(w, a, b))
  // demolishing the building: old detour stays valid and is reused (allowed to be suboptimal)
  w.vacate(mx - 1, my - 1, 3, 3, w.idx(mx, my + 2))
  assert.equal(ps.poll(ps.request(a, b)), p2)
  // a corner-cutting diagonal introduced by a new building also invalidates
  let diagK = -1
  for (let k = 1; k < p2.length; k++) {
    const dx = w.tileX(p2[k]) - w.tileX(p2[k - 1]), dy = w.tileY(p2[k]) - w.tileY(p2[k - 1])
    if (dx && dy) { diagK = k; break }
  }
  if (diagK > 0) {
    const ax = w.tileX(p2[diagK - 1]), ay = w.tileY(p2[diagK - 1]), dx = w.tileX(p2[diagK]) - ax
    w.occupy(ax + dx, ay, 1, 1, 3, -1)
    assert.equal(ps.cached(a, b), null, 'corner rule re-checked')
  }
})

test('LRU bound evicts least recently used entries', () => {
  const w = new World(64, 64)
  const ps = new PathService(w, { cacheSize: 4 })
  const pairs = []
  for (let k = 0; k < 6; k++) pairs.push([w.idx(1, k * 5), w.idx(40, k * 5 + 2)])
  const paths = []
  for (let k = 0; k < 4; k++) paths.push(drain(ps, ps.request(...pairs[k])).r)
  assert.equal(ps.cacheCount(), 4)
  // touch pair 0 so pair 1 becomes the LRU
  assert.equal(ps.cached(...pairs[0]), paths[0])
  drain(ps, ps.request(...pairs[4]))
  assert.equal(ps.cacheCount(), 4)
  assert.equal(ps.cached(...pairs[1]), null, 'LRU evicted')
  assert.equal(ps.cached(...pairs[0]), paths[0], 'recently used kept')
  drain(ps, ps.request(...pairs[5]))
  assert.equal(ps.cached(...pairs[2]), null)
  assert.equal(ps.cacheCount(), 4)
  ps.clear()
  assert.equal(ps.cacheCount(), 0)
  assert.equal(ps.cached(...pairs[0]), null)
})

test('queue overflow, expansion cap and expired ring slots read as PATH_NONE', () => {
  const w = new World(64, 64)
  const ps = new PathService(w, { queueMax: 2 })
  const j1 = ps.request(w.idx(0, 0), w.idx(63, 63))
  const j2 = ps.request(w.idx(0, 1), w.idx(63, 63))
  const j3 = ps.request(w.idx(0, 2), w.idx(63, 63))
  assert.equal(ps.poll(j1), PATH_PENDING)
  assert.equal(ps.poll(j2), PATH_PENDING)
  assert.equal(ps.poll(j3), PATH_NONE, 'queue full fails fast')
  // expansion cap
  const w2 = new World(64, 64)
  maze(w2)
  const ps2 = new PathService(w2, { maxExpansions: 100 })
  const jf = ps2.request(w2.idx(32, 1), w2.idx(32, 62))
  ps2.update()
  assert.equal(ps2.poll(jf), PATH_NONE)
  assert.equal(ps2.stats.failed, 1)
  // ring expiry: a job older than PATH_RING requests is gone
  const ps3 = new PathService(w)
  const old = ps3.request(w.idx(1, 1), w.idx(1, 1))
  assert.notEqual(ps3.poll(old), PATH_NONE)
  for (let k = 0; k < PATH_RING; k++) ps3.request(w.idx(2, 2), w.idx(2, 2))
  assert.equal(ps3.poll(old), PATH_NONE)
  // job ids wrap at 2^30
  ps3.nextJob = (1 << 30) - 1
  const last = ps3.request(w.idx(1, 1), w.idx(1, 1))
  assert.equal(last, (1 << 30) - 1)
  assert.equal(ps3.request(w.idx(1, 1), w.idx(1, 1)), 0)
})

test('a passability change during a search never yields a path through the new obstacle', () => {
  const w = new World(64, 64)
  const ps = new PathService(w, { budget: 30 })
  const a = w.idx(2, 32), b = w.idx(61, 32)
  const job = ps.request(a, b)
  ps.update()
  assert.equal(ps.poll(job), PATH_PENDING)
  // drop a wall across the direct line, leaving a gap at the bottom
  for (let y = 0; y < 60; y += 2) w.occupy(30, y, 2, 2, 100 + y, -1)
  const { r: p } = drain(ps, job, 30)
  assertLegal(w, p, a, b)
  for (let k = 0; k < p.length; k++) assert.equal(w.occ[p[k]], -1)
})

test('sameRegion: regions recomputed per navVersion; blocked tiles join their neighbours', () => {
  const w = new World(64, 64)
  const ps = new PathService(w)
  assert.ok(ps.sameRegion(w.idx(0, 0), w.idx(63, 63)))
  fill(w, 32, 0, 1, 64, T_WATER) // river splits the map
  assert.equal(ps.sameRegion(w.idx(0, 0), w.idx(63, 63)), false)
  assert.equal(ps.regionCount, 2)
  // a diagonal-only gap does not connect (no corner cutting)
  w.setTerrain(w.idx(32, 10), T_GRASS)
  assert.ok(ps.sameRegion(w.idx(0, 0), w.idx(63, 63)), 'ford reconnects')
  w.setTerrain(w.idx(32, 10), T_WATER)
  w.setTerrain(w.idx(32, 20), T_GRASS)
  w.setTerrain(w.idx(33, 21), T_WATER)
  w.setTerrain(w.idx(31, 19), T_WATER)
  assert.ok(ps.sameRegion(w.idx(0, 0), w.idx(63, 63)), 'orthogonal ford at 20')
  // blocked start tile (inside a building) belongs to the region of its neighbours
  w.occupy(5, 5, 3, 3, 1, -1)
  assert.ok(ps.sameRegion(w.idx(6, 6), w.idx(10, 10)) === false, 'centre of a 3x3 has no walkable neighbour')
  assert.ok(ps.sameRegion(w.idx(5, 5), w.idx(10, 10)), 'edge tile of the footprint touches walkable land')
  const j = ps.request(w.idx(5, 5), w.idx(10, 10))
  const { r } = drain(ps, j)
  assert.ok(r.length > 1)
  assert.equal(ps.sameRegion(-1, 3), false)
})

test('generated 256 map: service paths match the sync solver and stay within budget', () => {
  const w = new World(256, 256)
  generateMap(w, 4)
  const ps = new PathService(w)
  const rng = new RNG(3)
  const jobs = []
  for (let k = 0; k < 40; k++) {
    const a = w.nearestWalkable(rng.int(256), rng.int(256), 20), b = w.nearestWalkable(rng.int(256), rng.int(256), 20)
    jobs.push([a, b, ps.request(a, b)])
  }
  let updates = 0
  while (jobs.some(([, , j]) => ps.poll(j) === PATH_PENDING) && updates < 10000) {
    assert.ok(ps.update() <= ps.budget)
    updates++
  }
  for (const [a, b, j] of jobs) {
    const p = ps.poll(j)
    const q = findPathSync(w, a, b)
    if (q === null) { assert.equal(p, PATH_NONE); continue }
    assertLegal(w, p, a, b)
    assert.equal(pathCost(w, p), pathCost(w, q))
  }
  // determinism: a second service with the same requests produces identical paths
  const ps2 = new PathService(w)
  for (const [a, b, j] of jobs) {
    const j2 = ps2.request(a, b)
    const { r } = drain(ps2, j2)
    const p = ps.poll(j)
    if (p === PATH_NONE) assert.equal(r, PATH_NONE)
    else assert.deepEqual([...r], [...p])
  }
  assert.equal(T_GRASS, 0)
})

test('incremental region labels after single placements/demolitions match a full relabel', () => {
  const w = new World(64, 64)
  // a few walls with gaps so placements can genuinely split regions
  fill(w, 20, 0, 1, 64, T_CLIFF)
  fill(w, 40, 0, 1, 64, T_CLIFF)
  w.setTerrain(w.idx(20, 30), T_GRASS); w.setTerrain(w.idx(20, 31), T_GRASS)
  w.setTerrain(w.idx(40, 10), T_GRASS)
  const ps = new PathService(w)
  const rng = new RNG(99)
  const placed = []
  let ids = 0
  ps.sameRegion(0, 1) // initial full labelling
  for (let step = 0; step < 400; step++) {
    if (placed.length > 0 && rng.int(3) === 0) {
      const [x, y, bw, bh] = placed.splice(rng.int(placed.length), 1)[0]
      w.vacate(x, y, bw, bh, -1)
    } else {
      const bw = 1 + rng.int(3), bh = 1 + rng.int(3)
      // bias placements toward the gaps so splits and merges happen
      const x = rng.int(3) === 0 ? 19 + rng.int(3) - 1 : rng.int(64 - bw)
      const y = rng.int(3) === 0 ? 29 + rng.int(4) - 1 : rng.int(64 - bh)
      if (x < 0 || y < 0 || !w.areaFree(x, y, bw, bh)) continue
      w.occupy(x, y, bw, bh, ids++, -1)
      placed.push([x, y, bw, bh])
    }
    const ref = new PathService(w)
    for (let k = 0; k < 24; k++) {
      const a = rng.int(w.size), b = rng.int(w.size)
      assert.equal(ps.sameRegion(a, b), ref.sameRegion(a, b), `step ${step}: ${a} vs ${b}`)
    }
  }
  assert.ok(ps.relabels.local > 100, `most changes patched locally (${ps.relabels.local} local, ${ps.relabels.full} full)`)
})
