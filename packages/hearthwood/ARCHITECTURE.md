# Hearthwood — Architecture (the implementers' bible)

Woodland-fantasy automation RTS. Factorio production chains + StarCraft selection and
base defence, skinned like a night-elf grove (mossy stone, bark, amber hearth-glow,
teal glowcaps, purple Blight). Top-down Canvas 2D, single player, 60 fps with thousands
of buildings and units. **Scale decides every data-layout question.**

Transport is by **sprite couriers**: ground units that auto-path from a provider's door
to a requester's door carrying at most 5 of ONE item. No belts.

Core loop: Hearth + stock + 8 couriers → place extractors on resources (Lumber Lodge,
Quarry, Bog Mine, Glowcap Grove, Moonstone Delve) and crafters (Sawmill, Ember Forge,
Tinker Workshop, Glowloom, Starbloom Enchantery) → couriers haul everything → surplus
lands in storage (Hearth, Storehouses) → construction is paid instantly from total
storage stock → offerings at the Moonwell Shrine raise the tier (unlocks) → 5 relics =
win. Blight raids from the map edges scale with time and factory size; Wardens
(archers), Treants (tanks) and Ward Towers defend. Losing the Hearth loses the game.

Production chain (content.js is authoritative):

```
tree  -> Lumber Lodge   -> wood ─┬─ Sawmill (1 wood -> 1 plank, 40t)
stone -> Quarry         -> stone │   Ember Forge (2 ore + 1 wood -> 1 ingot, 90t)
ore   -> Bog Mine       -> ore ──┘   Tinker Workshop (2 plank + 1 ingot -> 1 tool, 120t)   [tier 1]
glowcap -> Glowcap Grove [t1]        Glowloom (2 glowcap + 1 plank -> 1 charm, 100t)        [tier 1]
moonstone -> Moonstone Delve [t2]    Enchantery (1 tool + 2 charm + 2 moonstone -> relic)   [tier 2]
Shrine offerings: t0->1: 20 plank + 10 ingot · t1->2: 10 tool + 10 charm · t2->3: 5 relic (win)
```

---

## 1. Files and ownership

| file | owner | status |
| --- | --- | --- |
| `src/constants.js`, `src/content.js`, `src/rng.js` | **architect** | complete, frozen |
| `src/fx.js` (FxRing, EventRing), `src/overlay.js` (createOverlay) | **architect** | complete, frozen |
| `src/context.js` (createContext, stepSim, stepSimN) | **architect** | complete, frozen |
| `tests/helpers.mjs`, `tests/helpers.test.mjs`, `tests/index.js` | **architect** | complete, frozen |
| `index.html`, `style.css`, `package.json`, `vite.config.js` | architect → **app** may extend html body/css | |
| `src/world.js`, `src/mapgen.js`, `src/path.js`, `tests/world.test.mjs`, `tests/path.test.mjs` | **world** | world.js partly pre-implemented |
| `src/entities.js`, `src/buildings.js`, `src/logistics.js`, `tests/sim.test.mjs` | **sim** | entities.js pre-implemented |
| `src/units.js`, `src/combat.js`, `src/waves.js`, `tests/units.test.mjs` | **units** | stubs |
| `src/render.js`, `src/sprites.js`, `src/minimap.js` | **render** | stubs |
| `src/main.js`, `src/game.js`, `src/camera.js`, `src/input.js`, `src/ui.js` | **app** | camera.js + main.js skeleton pre-implemented |

Rules:
- Never edit a file you do not own. If you need a contract change, keep working against
  the current contract and list the request in your final report; the integrator reconciles.
- You may add PRIVATE helpers/fields inside your files. You may add new files inside your
  area if you list them (prefix them with your area, e.g. `src/render-chunks.js`).
- Pre-implemented code in your files is yours: rewrite/optimise freely, but keep every
  exported name, signature, field name/type and documented semantic.
- Every exported function/class in the stubs is part of the contract. Keep signatures exact.

## 2. Hard rules (performance + determinism)

1. Plain ES modules, no TypeScript, no npm deps beyond root `vite`/`playwright`. No assets,
   no CDNs: every pixel is procedural.
2. Simulation state lives in typed arrays (SoA pools, world arrays). No per-entity objects,
   no per-tick allocations in hot loops (no `[]`, `{}`, closures, `.map/.filter`, spread,
   template strings) — preallocate scratch buffers on your state object.
3. Integer tile math: packed tiles `i = (ty << world.shift) | tx`; `tx = i & world.mask`,
   `ty = i >> world.shift`. Positions are Float32 tile units (tile centre = tx + 0.5).
4. Fixed timestep: 20 ticks/s (`TICK_MS` = 50). The sim never reads wall-clock time.
5. Randomness in the sim: **only `ctx.rng`** (`RNG` from rng.js). Never `Math.random` in
   sim code. Mapgen uses its own `new RNG(seed)` / `hash2` / `fbm`. Render decoration uses
   `hash2(tx, ty)` so it is stable per tile.
6. Iteration order is always ascending id (or documented list order); ties break toward
   the lower id. Two runs with the same seed and same commands must be identical.
7. No DOM access at import time in any module (Node imports every file in tests).
8. Speed: at 4× the sim runs 4 ticks/frame, so a tick must cost ≤ ~3 ms with 5k units +
   2k buildings. Target budgets per tick: units ≤ 1 ms, logistics ≤ 0.6 ms, combat ≤ 0.6 ms,
   path ≤ 1 ms (budgeted), buildings ≤ 0.3 ms.

## 3. Coordinates and ids

| quantity | type | notes |
| --- | --- | --- |
| tile coords `tx, ty` | int | 0..w-1 / 0..h-1 |
| packed tile | int | `(ty << shift) \| tx`; -1 = none |
| world coords `x, y` | float, tile units | unit positions; tile centre = `tx + 0.5` |
| chunk index | int | `(ty >> 5) * chunksW + (tx >> 5)`; chunks are 32×32 tiles |
| unit/building id | int | pool slot index, stable while alive |
| generation | uint16 | `pool.gen[id]`, bumped on free. Store `(id, gen)` for any reference that may outlive a tick and validate with `pool.isAlive(id, gen)` |
| inventory index | int | `(b << ITEM_SHIFT) \| item`, ITEM_STRIDE = 16 |
| content index | int | `BUILDINGS[type]`, `UNITS[type]`; index 0 is **null** |

Map width must be a power of two (256 default, 512 large); height a multiple of 32.
Pixels exist only in render/input: `sx = (x - cam.x) * TILE * cam.zoom + cam.viewW / 2`.

## 4. The context object

`createContext(opts)` (context.js) builds the one mutable `ctx` passed to every system.
Modules never import each other's state; they import each other's FUNCTIONS (table in §15)
and reach state through `ctx`.

| field | type | written by | notes |
| --- | --- | --- | --- |
| `tick` | int | stepSim | incremented at END of the tick |
| `seed` | uint32 | createContext | |
| `rng` | RNG | any sim system | the only sim randomness |
| `world` | World | world.js methods only | §5 |
| `path` | PathService | units.js (request/poll), stepSim (update) | §7 |
| `units` | UnitPool | units.js (+ field owners in §8) | §8 |
| `buildings` | BuildingPool | buildings.js (+ field owners in §8) | §8 |
| `unitGrid` | CellGrid | tickUnits (rebuild) | all alive units; read by combat, render, input |
| `log` | LogisticsState | logistics.js | public: `jobCount, idleCount, busyCount, stats` |
| `combat` | CombatState | combat.js | private |
| `waves` | WaveState | waves.js | public: `number, nextTick, nextPoints, warned, enabled, lastSide, lastTile` |
| `stock` | Int32Array[16] | buildings.js inventory helpers only | unreserved items in storage |
| `storeCap` | int | buildings.js | total storage capacity |
| `courierCap` | int | buildings.js | `courierCapExtra` + sum of `courierCap` of alive buildings (Hearth 12, Den +10) |
| `courierCapExtra` | int | game.js (`stress`) | cap bonus not tied to a building; buildings.js adds it, never resets it |
| `tier` | int | buildings.js (shrine) | 0..WIN_TIER (3) |
| `won`, `lost` | bool | buildings.js | game.js pauses / UI shows banner |
| `fx` | FxRing | combat, units, buildings | cosmetic; renderer reads |
| `events` | EventRing | buildings, combat, waves | HUD reads with its own cursor |
| `stats` | `{tickMs,lastTickMs,ticks}` | stepSim | EMA of stepSim wall time |

`createContext({w, h, seed, generate=true, mapgen, path, maxUnits, maxBuildings, waves=true})`.
With `generate:false` the map is all grass and `world.start` = map centre (tests).
`createLogistics`, `createCombat`, `createWaves` are called inside createContext and **must
never throw** — keep them allocation-only.

## 5. World (world.js) — owner: world

`new World(w=256, h=256)`. Arrays (size = w*h unless noted):

| field | type | meaning | writers |
| --- | --- | --- | --- |
| `terrain` | Uint8Array | `T_GRASS/MOSS/DIRT/WATER/CLIFF`; water+cliff impassable | `setTerrain` |
| `res` | Uint8Array | `R_*` resource type (walkable!), `R_NONE` when depleted | `setResource`, `takeResource` |
| `resAmt` | Uint16Array | units left on the tile | same |
| `occ` | Int32Array | building id on the tile, -1 none | `occupy`, `vacate` |
| `doorCount` | Uint8Array | how many building doors use this tile | `occupy`, `vacate` |
| `pass` | Uint8Array | 1 walkable = terrain walkable AND occ < 0 (doors are walkable) | derived inside World |
| `chunkVersion` | Uint32Array[chunkCount] | bumped when terrain or resource TYPE changes in the chunk | World |
| `navVersion` | number | bumped whenever any `pass` changes | World |
| `start` | packed | Hearth centre tile, set by mapgen | mapgen / createContext |
| `w,h,shift,mask,size,chunksW,chunksH,chunkCount,seed` | ints | geometry | constructor |

Pre-implemented methods (keep semantics): `idx, tileX, tileY, inBounds, walkable(i),
walkableXY, chunkOf(i), chunkOfXY, setTerrain(i,t), setResource(i,r,amt),
takeResource(i,amount)→taken, occupy(tx,ty,w,h,id,doorTile), vacate(tx,ty,w,h,doorTile),
areaFree(tx,ty,w,h)→bool (in bounds, walkable, unoccupied, not a door tile),
doorTile(type,tx,ty)→packed|-1`.

To implement:
- `countResource(tx,ty,w,h,reach,res)` → count of `res` tiles with amt > 0 in the footprint
  expanded by `reach` (clipped). Used by canPlace (extractor validity) and the ghost.
- `findResource(tx,ty,w,h,reach,res,hint)` → `hint` if still valid and inside the rect,
  else first match row-major, else -1. Extractors store the result in `buildings.workTile`.
- `nearestWalkable(tx,ty,maxR)` → packed | -1 (square spiral, deterministic order).
- `edgeTile(side,t)` → walkable tile on/near edge `side` (0 N, 1 E, 2 S, 3 W) at fraction t.

Doors: every building type has a door offset (`BUILDINGS[t].door`, also `B_DOOR_DX/DY`)
outside the footprint, touching its bottom edge (`[floor(w/2), h]`). The door tile must
be walkable at placement and stays clear forever after because `areaFree` rejects door
tiles. Couriers and trained units path to door tiles; Blight attacking a building path to its door when
it is in their region, else to any reachable tile on the ring around the footprint (`buildingApproach`).

Rendering invalidation: renderer caches terrain per chunk and rebakes when
`world.chunkVersion[c] - world.chunkResVersion[c]` (own + 4 neighbours) changes.
`takeResource` bumps chunkVersion AND chunkResVersion only when a tile depletes (tree
felled) and appends the tile to `world.resLog`; the terrain cache repaints such tiles in
place (clip rect: ground, wash, water, cliffs, overlapping decals) instead of re-baking.
`occupy` / `vacate` log their rect in `world.navLog*`, so PathService patches region labels
locally (one change since the last labelling) instead of re-flooding the map.

## 6. CellGrid (world.js) — owner: world

Uniform spatial hash rebuilt by counting sort; used for `ctx.unitGrid` (all units, 4×4-tile
cells, `UNIT_CELL_SHIFT = 2`) and `ctx.log.idleGrid` (idle couriers).

```
new CellGrid(tilesW, tilesH, cellShift, capacity)
fields: shift, cellSize, cw, ch, cells, capacity, count, cellStart: Int32Array(cells+1), items: Int32Array(capacity)
clear(); add(id, x, y); build()          // build is O(count + cells)
cellAt(x, y) -> cell index (clamped)
queryRect(x0, y0, x1, y1, out: Int32Array) -> count   // ids in overlapping cells (superset)
queryRing(cx, cy, r, out) -> count                     // ids in cells at Chebyshev ring r
```
Items of cell c: `items[cellStart[c] .. cellStart[c+1]-1]` in insertion order (ascending id
when added in id order). `clear()`/`add()` only stage ids; `cellStart`/`items` keep answering
queries for the previous `build()` until the next `build()` (tickUnits relies on this: separation
reads last tick's grid while the new one is staged). Readers MUST re-check `alive` and state for every id: units can die
after the grid was built (combat runs after tickUnits).

Nearest search pattern (allocation-free):
```
best = -1; bestD2 = maxR*maxR
for r = 0..maxRing:
  if best >= 0 and (r - 1) * cellSize > sqrt(bestD2): break
  n = grid.queryRing(cx, cy, r, scratch)
  for k < n: id = scratch[k]; filter; d2 = dx*dx + dy*dy; if d2 < bestD2 or (d2 == bestD2 and id < best): best = id, bestD2 = d2
```

## 7. Pathfinding (path.js) — owner: world

**Path format:** shared immutable `Int32Array` of packed tiles; `path[0]` = start tile,
last = goal; length ≥ 1. Never mutate it. Units begin at `pathIdx = 1`.

**Search:** grid A*, 8-connected, octile heuristic with integer costs `COST_STRAIGHT = 10`,
`COST_DIAG = 14`, **no corner cutting** (a diagonal needs both orthogonal neighbours
walkable), binary `MinHeap` over Int32 f-scores, visited stamps (`Uint32Array` generation
per search, no clearing). Start tile is treated as walkable; goal must be walkable.
Optimal: tests compare cost with a reference BFS/Dijkstra.

**Protocol:**
```
job = ctx.path.request(from, to)   // int job id >= 0, never throws
r   = ctx.path.poll(job)           // Int32Array | PATH_PENDING | PATH_NONE (compare by identity)
ctx.path.update(budget?)           // stepSim calls it once per tick, FIRST
```
- `request` resolves immediately (job already done) when: `from === to` (path `[from]`),
  cache hit, goal unwalkable or `!sameRegion(from,to)` (→ PATH_NONE), queue full (→ PATH_NONE).
  Otherwise dedupes onto an existing pending job with the same `(from,to)` key, or enqueues.
- `update(budget)` expands at most `budget` nodes in total (default `PATH_BUDGET = 6000`)
  across the FIFO queue. The active search keeps its open/closed state across ticks
  ("budget splits a long search across ticks"). A search over `PATH_MAX_EXPANSIONS` fails.
- Results live in a ring of `PATH_RING` slots keyed by `job & (PATH_RING-1)` with the job id
  stored for verification; polling a job that was overwritten returns PATH_NONE (caller
  re-requests). Job ids wrap at 2^30.
- **Cache:** key = `from * size + to` (a Number, < 2^53). LRU bounded by
  `PATH_CACHE_SIZE` (Map insertion order: delete+set on hit). Each entry remembers the
  `navVersion` it was validated at. **Lazy invalidation:** on a hit with a stale version,
  walk the path; if every tile is still `pass === 1` re-stamp and return it (possibly
  suboptimal after a demolition — acceptable), else evict and search. Repeated hits return
  the **same Int32Array instance**.
- **Regions:** `sameRegion(a,b)` uses component labels (Int32Array, flood fill with the same
  connectivity rule) recomputed lazily at most once per navVersion. This prevents
  whole-map expansions toward unreachable goals.
- **Seam for hierarchical pathing:** keep `request/poll/update` as the only API; a later
  chunk-portal layer can be slotted inside `update` without touching callers.
- `stats`: `{requests, hits, misses, expansions, found, failed, queued, lastUpdateExpansions}`.

## 8. Entity pools (entities.js) — owner: sim (pre-implemented)

Iterate: `for (let i = 0; i < pool.hi; i++) if (pool.alive[i]) ...`. `alloc` pops the
lowest free id first (deterministic), `free` pushes back (LIFO reuse) and bumps `gen`.

### 8.1 UnitPool (`ctx.units`), capacity `MAX_UNITS = 32768`

| field | type | meaning | written by |
| --- | --- | --- | --- |
| `alive` | Uint8 | 1 alive | pool |
| `gen` | Uint16 | slot generation | pool |
| `type` | Uint8 | `U_*` | pool |
| `faction` | Uint8 | `F_PLAYER` / `F_BLIGHT` | pool |
| `x, y` | Float32 | position (tile units) at END of the current tick | units.js |
| `px, py` | Float32 | position at START of the current tick (render lerp origin) | units.js |
| `vx, vy` | Float32 | displacement during the last tick (facing, separation) | units.js |
| `hp` | Float32 | current HP (max = `U_HP[type]`) | combat.js |
| `mstate` | Uint8 | `M_IDLE / M_WAIT_PATH / M_MOVING / M_ARRIVED / M_FAILED` | units.js |
| `path` | Array<Int32Array\|null> | shared path being followed | units.js |
| `pathIdx` | Int32 | index of the NEXT waypoint | units.js |
| `goal` | Int32 | packed goal tile or -1 | units.js |
| `pathJob` | Int32 | PathService job id while waiting | units.js |
| `order` | Uint8 | `O_*` high-level order | combat.js, waves.js (via commandRaid) |
| `orderTile` | Int32 | packed destination of the order | combat.js |
| `target, targetGen, targetKind` | Int32, Uint16, Uint8 | current attack target (`TK_UNIT` uses unit gen, `TK_BUILDING` building gen) | combat.js |
| `cooldown` | Uint16 | ticks until next attack | combat.js |
| `repathAt` | Int32 | earliest tick a chase may re-path | combat.js |
| `job` | Uint8 | `J_*` courier job state | logistics.js |
| `jobSrc, jobSrcGen` | Int32, Uint16 | provider building | logistics.js |
| `jobDst, jobDstGen` | Int32, Uint16 | requester building | logistics.js |
| `jobItem, jobQty` | Uint8, Uint8 | item and reserved qty | logistics.js |
| `jobTimer` | Uint16 | PICKING/DROPPING countdown | logistics.js |
| `cargoItem, cargoQty` | Uint8, Uint8 | carried goods (render draws icon) | logistics.js |
| `typeCount[UNIT_COUNT]`, `factionCount[2]`, `count`, `hi` | Int32 | bookkeeping | pool |

### 8.2 BuildingPool (`ctx.buildings`), capacity `MAX_BUILDINGS = 16384`

| field | type | meaning | written by |
| --- | --- | --- | --- |
| `alive, gen, type` | Uint8, Uint16, Uint8 | identity | pool |
| `tx, ty` | Int16 | footprint top-left | buildings.js |
| `w, h` | Uint8 | footprint size (from content) | pool |
| `door` | Int32 | packed door tile | buildings.js |
| `chunk` | Int32 | chunk of top-left tile = chunk list membership | pool.linkChunk |
| `hp` | Float32 | max = `B_HP[type]` | combat.js |
| `status` | Uint8 | `BS_*` (status icon / HUD) | buildings.js, combat.js (halls) |
| `paused` | Uint8 | player pause | buildings.setPaused |
| `progress` | Int32 | ticks into current recipe / den spawn / training | buildings.js, combat.js (halls) |
| `workTile` | Int32 | extractor's current resource tile | buildings.js |
| `inv, resIn, resOut` | Int32[cap*16] | items present / promised in / promised out | **buildings.js helpers only** |
| `invTotal, resInTotal` | Int32 | sums for storage capacity | buildings.js helpers |
| `trainQ` | Uint8[cap*TRAIN_QUEUE] | queued unit types (`b*TRAIN_QUEUE + k`) | combat.js |
| `trainLen` | Uint8 | queue length | combat.js |
| `rally` | Int32 | packed rally tile, -1 = door | input.js (via direct write is allowed) |
| `target, targetGen, cooldown` | Int32, Uint16, Uint16 | tower targeting | combat.js |
| `typeList[t]`, `typeCount[t]`, `typePos` | Int32 | dense per-type id lists (alloc order, swap-remove) | pool |
| `chunkHead[c]`, `chunkNext`, `chunkPrev` | Int32 | per-chunk doubly-linked lists | pool (`linkChunk/unlinkChunk`) |

## 9. Buildings (buildings.js) — owner: sim

### 9.1 Placement
`canPlace(ctx,type,tx,ty,{free}) → P_*` checks, in order: `P_NOT_BUILDABLE` (Hearth, unless
free), `P_TIER` (`B_TIER[type] > ctx.tier`, unless free), `P_UNIQUE` (typeCount > 0 for
unique types), `P_OOB` (footprint only), `P_BLOCKED` (`!world.areaFree`), `P_DOOR` (door tile OOB, not
walkable, or occupied), `P_NO_RESOURCE` (extractor and `countResource == 0`), `P_COST`
(unless free), with `P_ENCLOSE` just before `P_COST` (player placement only: the footprint would
split its surroundings so that a door ends up in a closed pocket; local flood fill, see
`wouldEnclose`). Pure.

`placeBuilding(ctx,type,tx,ty,{free}) → id | -1`: canPlace → payCost → `alloc` → tx/ty/door
→ `world.occupy` → `linkChunk(id, world.chunkOfXY(tx,ty))` → caps (`courierCap`,
`storeCap`) → `logistics.registerBuilding` → `fx.emit(FX_BUILD, cx, cy, cx, cy, tick)`.

`destroyBuilding(ctx,b,refundFrac=0,killed=false)` and `demolishBuilding(ctx,b)` (50%,
refuses Hearth): see stub docs. Contents of destroyed storage are lost (subtract from stock).

### 9.2 Inventory helpers — the ONLY writers of inv/resIn/resOut/stock
Invariant: `ctx.stock[i] = Σ over alive storage b of (inv[b,i] - resOut[b,i])`.

| helper | effect |
| --- | --- |
| `addItems(ctx,b,item,qty,fromReserved)` | fromReserved: `resIn -= qty` (+resInTotal), always adds all. Else clamps to capacity (storage: `storage - invTotal - resInTotal`; others: `B_SLOT_CAP - inv - resIn`). `inv += q`, `invTotal += q`, storage: `stock += q`. Returns q |
| `takeItems(ctx,b,item,qty,fromReserved)` | fromReserved: `inv -= qty; resOut -= qty` (stock unchanged). Else `q = min(qty, inv-resOut)`, `inv -= q`, storage: `stock -= q`. Returns q |
| `reserveOut / releaseOut` | `resOut ±= qty`; storage: `stock ∓= qty` |
| `reserveIn / releaseIn` | `resIn ±= qty`, `resInTotal ±= qty` |
| `availableOut(b,item)` | `inv - resOut` |
| `freeSpaceIn(b,item)` | storage: `storage - invTotal - resInTotal`; shrine: current offering qty − inv − resIn (0 if not offered / won); recipe input: `B_SLOT_CAP - inv - resIn`; else 0 |
| `canAfford(cost)`, `payCost(cost)`, `refundCost(cost, frac)` | stock-level; pay from Hearth first then Storehouses (typeList order), unreserved only, all-or-nothing |

`recomputeStock(ctx)` rebuilds stock/storeCap/courierCap from scratch — tests assert it
equals the incremental values after long runs.

### 9.3 Item buffers
Input cap per (type,item): `B_SLOT_CAP[(type<<4)|item]` = `max(2*COURIER_CAP, qty*INPUT_BATCHES)`
(≥ 10). Output cap: `OUTPUT_CAP = 20`. Per-cycle input qty: `B_IN_QTY`. Output item:
`B_OUT_ITEM[type]` (one output per recipe in this content set; output qty from
`BUILDINGS[t].recipe.outputs[0].qty`, always 1 here).

### 9.4 `tickBuildings(ctx)` — ids ascending over `0..hi`
Producer (`BF_PRODUCER`):
```
if paused: status = BS_PAUSED; continue
if progress == 0:                                   // try to start a cycle
  if inv[out] + outQty > outCap: status = BS_OUTPUT_FULL; continue
  extractor: t = world.findResource(footprint, reach, res, workTile); if t < 0: BS_DEPLETED; continue; workTile = t
  crafter:   if any inv[in] < qty: BS_STARVED; continue;  else takeItems(b, in, qty, false) for each input
  progress = 1; status = BS_OK
else:
  if progress < ticks: progress++
  if progress >= ticks:
    extractor: if world.takeResource(workTile, 1) == 0: workTile = findResource(...); if none: BS_DEPLETED, progress = 0; continue  (retry next tick)
    if inv[out] + outQty > outCap: status = BS_OUTPUT_FULL; continue   // hold at `ticks`
    addItems(b, out, outQty, false); progress = 0
```
Den (`BF_DEN`): if paused → BS_PAUSED. If `units.typeCount[U_COURIER] >= ctx.courierCap` →
BS_IDLE, progress = 0. If more than 3 couriers stand idle and they are over a quarter of all
couriers → BS_IDLE (no planks spent on couriers nobody needs). Else progress++; at
`courierSpawn.ticks`: `payCost` → `spawnUnit(U_COURIER, door centre)` + EV_COURIER_SPAWNED,
progress = 0; on failure BS_NO_STOCK and hold.
Hearth (`BF_CORE`) rescue: while fewer than 2 couriers are alive and no Den can pay for one
(no Den, or stock short of the spawn cost), the Hearth spawns a free courier every 200 ticks,
so a raid that wipes the swarm while planks sit in producer buffers is never a soft-lock.
Shrine (`BF_SHRINE`): offering = `TIERS[ctx.tier].offering`; when every `inv >= qty`, take
them, `ctx.tier++`, EV_TIER_UP(a=tier); reaching `WIN_TIER` sets `ctx.won` + EV_WIN.
Halls and towers: combat.js.

## 10. Logistics (logistics.js) — owner: sim

### 10.1 Indexes (private to logistics; built by register/unregisterBuilding)
- `reqList` (Int32Array dense, swap-remove, `reqPos[b]`) of `BF_REQUESTER` buildings + `reqCursor`.
- `provList` (dense) of `BF_PRODUCER` buildings + `provCursor` (push pass).
- Per-item provider buckets: for each (item, chunk of the DOOR tile) a list of producer
  buildings whose `B_OUT_ITEM` is item. Suggested layout: `bucketHead Int32Array(16*chunkCount)`
  + node arrays `nodeB/nodeNext` (one node per producer since one output each).
- Storage buckets per chunk (`BF_STORAGE`), same layout.
- `idleGrid` (CellGrid over idle couriers) + `idleList` (Int32Array) rebuilt every tick.

### 10.2 Courier state machine (every courier, ids ascending, start of tickLogistics)

| state | condition | action → next |
| --- | --- | --- |
| J_NONE | — | count idle, add to idleGrid/idleList |
| J_TO_PICKUP | src dead (gen) | releaseIn(dst) if dst alive → stopUnit → J_NONE |
| J_TO_PICKUP | dst dead | releaseOut(src) → stopUnit → J_NONE |
| J_TO_PICKUP | mstate M_FAILED | releaseOut(src), releaseIn(dst) → J_NONE (stats.aborted++) |
| J_TO_PICKUP | mstate M_IDLE (stopped externally) | orderMove(src door) again |
| J_TO_PICKUP | mstate M_ARRIVED | jobTimer = PICK_TICKS → J_PICKING |
| J_PICKING | src/dst dead | as above → J_NONE |
| J_PICKING | --jobTimer == 0 | `q = takeItems(src,item,jobQty,true)`; cargo = (item,q); orderMove(dst door) → J_TO_DROPOFF |
| J_TO_DROPOFF | dst dead, or M_FAILED | if dst alive releaseIn(dst); **reroute**: nearest storage with `freeSpaceIn ≥ cargoQty` (storage buckets, same region) → reserveIn, jobDst=it, orderMove; none → cargo lost, J_NONE |
| J_TO_DROPOFF | M_ARRIVED | jobTimer = DROP_TICKS → J_DROPPING |
| J_DROPPING | dst dead | reroute as above |
| J_DROPPING | --jobTimer == 0 | `addItems(dst,item,cargoQty,true)`; cargo = 0 → J_NONE (stays where it is) |

`abortJob(ctx,u)` (called by units.despawnUnit): release whatever is still reserved
(TO_PICKUP/PICKING: both sides; TO_DROPOFF/DROPPING: resIn at dst), cargo lost, J_NONE.
Invariant: every live reservation is owned by exactly one courier job.

### 10.3 Scheduler (after the state machine). Early-out if `idleCount == 0`.
**Pull pass** — `visits = min(LOG_REQ_PER_TICK, reqCount)`:
```
b = reqList[reqCursor]; reqCursor = (reqCursor + 1) % reqCount
skip if paused
for each input item of b (shrine: items of the current offering):
  free = freeSpaceIn(b, item); if free <= 0: continue
  if free < COURIER_CAP and inv + resIn >= B_IN_QTY: continue     // not starving: wait for a full load of space
  want = min(free, COURIER_CAP)
  reserve = CRAFT_RESERVE[item] (40 for raw items buildings cost; 0 for the shrine / no storage)
  if stock[item] < reserve: continue           // construction first: let producers refill storage
  src = findProvider(item, b, want)            // producers first, storage last (never below reserve)
  if src < 0: continue
  q = min(want, availableOut(src, item)); storage src: q = min(q, stock[item] - reserve)
  u = findIdleCourier(src.door); if u < 0: stop BOTH passes this tick
  assign(u, src, b, item, q)                   // at most one job per (requester,item) per visit
```
`findProvider`: rings r = 0..LOG_RADIUS_CHUNKS of chunks around b's door chunk over the
item's provider buckets; candidate needs `availableOut ≥ 1` and `path.sameRegion(src.door,
b.door)`; score = Manhattan door distance + (avail < want ? 64 : 0); lowest score wins (ties
→ lower id); stop expanding once `(r-1)*CHUNK > bestScore`. If none: same over storage
buckets with unlimited radius (whole map).

**Push pass** — `visits = min(LOG_PUSH_PER_TICK, provCount)`:
```
p = provList[provCursor]; advance
a = availableOut(p, out); if a < threshold: continue
   // threshold = min(COURIER_CAP, outCap/2) while > 1/4 of couriers idle, else outCap/2
s = nearest storage (storage buckets) with freeSpaceIn >= min(a, COURIER_CAP), same region
u = findIdleCourier(p.door); if u < 0: stop
assign(u, p, s, out, min(a, COURIER_CAP, freeSpaceIn(s)))
```
(The pass is skipped outright when no storage has any free space.)
Storage is therefore the **low-priority sink** (push only when a producer is half full, or
holds a courier load while couriers stand idle)
and **last-resort provider** (pull falls back to it). Storage never requests from storage.

`assign(u,src,dst,item,q)`: `reserveOut(src,item,q)`, `reserveIn(dst,item,q)`, set job
fields + gens, `job = J_TO_PICKUP`, `orderMove(u, door of src)`, jobCount++, idleCount--.
`findIdleCourier(tile)`: ring search in idleGrid (≤ IDLE_RADIUS_CELLS) for `job == J_NONE`
couriers in the same region, nearest wins; fallback: first entry of idleList still idle.

**Oversubscription is impossible** because a job only ever takes
`min(availableOut, freeSpaceIn)` and reserves both immediately.
**Bounded cost**: ≤ K visits × ≤ 3 items × ring search per tick (tests assert pull/push
visit counters never exceed K).

## 11. Units (units.js) — owner: units

Movement state machine (`mstate`):

| from | event | to |
| --- | --- | --- |
| any | `orderMove` to the tile it stands on | M_ARRIVED |
| any | `orderMove`, goal unwalkable | M_FAILED |
| any | `orderMove`, path cached | M_MOVING (pathIdx = 1) |
| any | `orderMove`, otherwise | M_WAIT_PATH (pathJob set) |
| M_WAIT_PATH | poll → path | M_MOVING |
| M_WAIT_PATH | poll → PATH_NONE | M_FAILED |
| M_MOVING | reached centre of last waypoint | M_ARRIVED (path = null) |
| M_MOVING | next waypoint became unwalkable (not the goal) | re-request from current tile → M_WAIT_PATH/M_MOVING |
| any | `stopUnit` | M_IDLE |

M_ARRIVED and M_FAILED are **sticky** until the next orderMove/stopUnit; brains poll them
(no callbacks). `orderMove` with the same goal while MOVING/WAIT_PATH is a no-op.

`tickUnits(ctx)` per tick: snapshot `px=x, py=y` for all units; poll waiting units; move
moving units by `U_SPEED[type]` tiles/tick toward waypoint centres (carry leftover distance
across waypoints); set `vx,vy`; eject units standing on blocked tiles to
`world.nearestWalkable`; soft separation (non-couriers not moving; push ≤
`SEPARATION_PUSH` within `SEPARATION_RADIUS` using unitGrid cells); finally rebuild
`ctx.unitGrid` with every alive unit. Units never block each other or paths.

Couriers do not separate in the sim (the renderer offsets them visually by
`hash2(id)` ±0.2 tile so streams of couriers read as a crowd, not a single dot).

`spawnUnit(ctx,type,x,y,faction?)`, `despawnUnit(ctx,id,died)` (calls
`logistics.abortJob` for couriers with jobs; FX_DEATH when died), `stopUnit`,
`unitsInRect(ctx,x0,y0,x1,y1,faction,includeCouriers,out)`, `unitAt(ctx,x,y,radius,faction)`,
`unitTile(ctx,id)`: see stub docs.

## 12. Combat (combat.js) — owner: units

Orders: `commandMove / commandAttackMove / commandAttack / commandHold / commandStop /
commandRaid / commandGroup` set `order`, `orderTile`, targets and call `orderMove`.
Couriers ignore commands. `commandGroup` spreads goals in a square spiral of walkable tiles
around the target (Treants first, then by id).

`tickCombat(ctx)` order: (1) halls training, (2) towers, (3) units ascending id.

Per non-courier unit:
1. `cooldown > 0` → `cooldown--`.
2. Validate target (gen check against the right pool); invalid → clear (`O_ATTACK` → `O_NONE`).
3. Retarget when target is empty or `(tick + id) % RETARGET_INTERVAL == 0`:
   - player in `O_NONE` / `O_ATTACK_MOVE`: nearest Blight unit within `U_SIGHT`.
   - player in `O_HOLD`: nearest Blight unit within `U_RANGE`.
   - player in `O_MOVE`: never.
   - Blight `O_RAID`: nearest player soldier within sight, else nearest building within
     sight (point-to-rect distance), else nearest courier. Types with `vsBuilding >= 2`
     (Husk) check buildings first.
   - every unit search skips candidates farther than the searcher's `U_RANGE` that stand in
     another walk region (seen across water, never reachable).
   - the Hearth has a weak built-in ward (`HEARTH_WARD` in combat.js) that shoots like a tower.
4. With a target: distance d (unit: centre-to-centre; building: point-to-footprint-rect).
   `d <= U_RANGE` → `stopUnit` (if moving) and, when `cooldown == 0`, hit: damage =
   `U_ATTACK * (building ? U_VS_BUILDING : 1)` applied **instantly**; emit `U_FX[type]`
   (x0,y0 = attacker, x1,y1 = target centre); `cooldown = U_COOLDOWN`. Out of range:
   `O_HOLD` drops the target; otherwise chase with `orderMove` to the target's tile
   (building: its door, or the nearest reachable ring tile via `buildingApproach`) at most every `CHASE_REPATH_TICKS` (`repathAt`). Player `O_NONE`
   leash: drop target beyond `1.5 * sight`.
5. No target: `O_MOVE / O_ATTACK_MOVE / O_RAID` keep walking to `orderTile` (re-issue
   `orderMove` if M_IDLE). On M_ARRIVED: move orders → `O_NONE`; `O_RAID` → raid the
   `nearestBuilding` from here (any type), or `O_NONE` if none. On M_FAILED: same as arrival.
   Blight left standing in `O_NONE` with no target re-raid (`commandRaid(…, -1)`) every 128 ticks,
   staggered by id.

Towers (`BF_TOWER`, `BUILDINGS[t].tower`): from footprint centre, nearest Blight unit within
`range` (retarget staggered like units), fire on `cooldown` with `tower.fx`.

Damage: `damageUnit(ctx,id,amt)` → hp ≤ 0 → `despawnUnit(ctx,id,true)`.
`damageBuilding(ctx,b,amt)` → hp ≤ 0 → `destroyBuilding(ctx,b,0,true)`.

Training: `enqueueTraining(ctx,b,unitType)` validates and pays immediately;
halls run `progress++` on the head of `trainQ`; at `UNITS[t].trainTicks` spawn at the door
centre, shift the queue, `commandMove` to `rally` if set, EV_UNIT_TRAINED; status
BS_IDLE (empty) / BS_PAUSED / BS_OK. `cancelTraining` pops the last entry with full refund.

## 13. Waves (waves.js) — owner: units

`ctx.waves = {number, nextTick, nextPoints, warned, enabled, pausedTicks, lastSide, lastTile}`. `tickWaves`:
update `nextPoints = wavePoints(ctx, number+1)`; at `nextTick - warnTicks` emit
EV_WAVE_WARNING(a=n, b=ticks left) once; at `nextTick` `spawnWave`. While `enabled` is false
(the HUD's pause button beside the countdown, `?peaceful`, tests) the director is frozen rather
than skipped: `nextTick` slides forward a tick per tick and `pausedTicks` grows, so the countdown
and the elapsed-minutes term of `wavePoints` both resume where they stopped. Points formula and
spawning rules are in the stub (WAVES table in content.js). Spawned Blight get
`commandRaid(nearestBuilding from spawn point)`. Interval:
`max(minInterval, interval - intervalStep*(number-1))`. First wave at 4:00, spawned at most 56 tiles from the Hearth. All choices via
`ctx.rng` → deterministic.

## 14. Per-tick order and frame loop

```
stepSim(ctx):                                    (context.js — frozen)
  1 ctx.path.update()          budgeted A* for requests made during the previous tick
  2 tickUnits(ctx)             snapshot px/py, poll, move, arrive, separation, rebuild unitGrid
  3 tickBuildings(ctx)         production, extraction, dens, shrine
  4 tickLogistics(ctx)         courier FSM (sees this tick's arrivals), pull + push scheduler
  5 tickCombat(ctx)            training, towers, units, damage, deaths
  6 tickWaves(ctx)             director
  7 ctx.tick++
```
Commands from input (place, demolish, orders) are applied between ticks, synchronously,
by calling the sim functions directly.

Frame (main.js): `dt` → `input.update(dt)` → `alpha = game.advance(dt)` (accumulator ×
speed, at most `MAX_STEPS_PER_FRAME` ticks, excess dropped) → `renderer.draw(camera,
game.ctx, alpha, overlay)` → `minimap.update(ctx)` + `minimap.draw(camera)` → `ui.update()`.

## 15. Who calls whom (allowed cross-module function imports)

| caller | may import |
| --- | --- |
| buildings.js | logistics: `registerBuilding, unregisterBuilding`; units: `spawnUnit` |
| logistics.js | buildings: inventory helpers, `availableOut, freeSpaceIn, recipeInputCount, recipeInputItem`; units: `orderMove, stopUnit`; world `CellGrid` |
| units.js | logistics: `abortJob`; path: `PATH_PENDING, PATH_NONE` |
| combat.js | units: `spawnUnit, despawnUnit, orderMove, stopUnit`; buildings: `destroyBuilding, payCost, refundCost, nearestBuilding`; world `CellGrid` (private Blight grid) |
| waves.js | units: `spawnUnit`; combat: `commandRaid`; buildings: `nearestBuilding` |
| game.js | context, buildings (`placeBuilding, addItems, canPlace`), units (`spawnUnit`), mapgen via context |
| input.js | buildings (`canPlace, placeBuilding, demolishBuilding, buildingAtTile, setPaused`), units (`unitsInRect, unitAt`), combat (commands), camera, overlay |
| ui.js | content, constants, buildings (`canAfford, setPaused, demolishBuilding`), combat (`enqueueTraining, cancelTraining`), sprites (`itemIconURL, buildingIconURL`), app-hud (pure helpers) |
| render.js / minimap.js / sprites.js | constants, content, rng, each other. **No sim functions** (read ctx fields only) |

Everything may import `constants.js`, `content.js`, `rng.js`, `fx.js`. ESM import cycles
(buildings ↔ logistics ↔ units) are fine because nothing calls an import at module top level.

## 16. Render contract — owner: render

### 16.1 Inputs (read-only)
`draw(camera, ctx, alpha, overlay)`:
- camera: `x, y` (view centre, tile units), `zoom`, `scale` (= TILE*zoom CSS px/tile),
  `viewW, viewH` (CSS px), `dpr`, `tier` (ZOOM_TIER_*), `visibleRect(out)`,
  `worldToScreen(wx,wy,out)`.
- world: `terrain, res, resAmt, w, h, chunksW, chunksH, chunkVersion`.
- buildings: `alive, type, tx, ty, w, h, hp, status, paused, progress, door, chunkHead/chunkNext, inv`
  (fill gauge), `typeList[B_WARD_TOWER]`.
- units: `alive, type, faction, x, y, px, py, vx, hp, mstate, job, cargoItem, cargoQty`; culling via
  `ctx.unitGrid.queryRect` on the visible rect expanded by one cell.
- `ctx.fx` (draw entries with `ctx.tick - tick[i] < FX_LIFE[kind]`), `ctx.tick` (animation clock).
- overlay: §16.5.
Interpolated unit position: `px + (x - px) * alpha`. Buildings don't move.

### 16.2 Layers (back to front)
terrain chunks → resource decals (baked into chunks) → building shadows → buildings (sorted by
footprint bottom, ties by id; status icons; HP bar when damaged; fill gauges at near zoom) →
selection rings → units (shadow, sprite, cargo icon, HP bar if damaged) → fx (arrows, bolts,
hits, puffs) → ghost (footprint tinted green `P_OK` / red otherwise, door marker, extractor
reach rect) → drag box → order ping → optional day/night tint (`ctx.tick` driven, subtle).

Terrain chunk cache: offscreen canvas per (chunk, tier), baked lazily when visible and
`chunkVersion` changed; pixels per tile by tier NEAR 32, MID 12, FAR 4; LRU budget ≈ 96 MB.
Only chunks intersecting the view are iterated. Buildings: iterate chunk lists for the
visible chunk range **extended by one chunk up/left** (lists key on top-left tile). FAR tier:
glyph mode — buildings as category-coloured rects, units as 1–2 px dots (Blight purple).
Allocation-free per frame: preallocate sort/scratch buffers on the renderer.

### 16.3 Sprites (sprites.js)
`bakeSprites({ppt}) → SpriteSet` once in the Renderer constructor (fields documented in the
stub). Palette: bark `#6b4a2f`, moss `#6fae6a`/`#3e6b45`, deep green `#0b1410`, amber glow
`#ffb54a`, teal glowcap `#46e3cf`, moonstone `#c8d4ff`, blight `#a24bd1`. Item colours:
`ITEM_COLOR`. `itemIconURL(item)` / `buildingIconURL(type, px)` serve the DOM HUD (return
`''` in Node).

### 16.4 Minimap (minimap.js)
`new Minimap(canvas, mapW, mapH)`; `update(ctx, force)` refreshes at most every
`MINIMAP_REFRESH_TICKS` (terrain image rebuilt only when chunk versions changed, then
buildings/units as pixels); `draw(camera)` every frame (blit + view rect);
`toWorld(mx, my, cssW, cssH, out)` for minimap clicks (app wires the events).

### 16.5 Overlay (overlay.js, frozen)
`sel/selGen/selCount` (validate gen before drawing), `selBuilding/selBuildingGen`,
`hoverBuilding`, `hoverUnit`, `ghostType/ghostTx/ghostTy/ghostReason`, `dragActive` + drag
corners (world units), `attackMoveArmed`, `cursorX/Y`, `pingX/Y/Tick/Kind`, `showGrid`, `showPaths`.

## 17. App contract — owner: app

### 17.1 HUD (ui.js) — DOM ids from index.html
`#stock` (item dots + `ctx.stock` numbers + `storeCap`), `#couriers` (idle/busy/cap from
`ctx.log` + `units.typeCount[U_COURIER]` + `ctx.courierCap`), `#tier` (tier name + offering
progress from the Shrine's inv), `#wave` (countdown from `ctx.waves.nextTick - ctx.tick`, `.warn`
under 30 s), `#speed` (pause/1×/2×/4×), `#buildmenu` (BUILD_MENU order, hotkey, cost,
locked by tier, tooltip with desc), `#selpanel` (building: name, HP, status, input/output slots
with counts and reservations, recipe progress, pause/demolish, hall queue buttons; unit: name,
HP, order/mstate, courier cargo + job), `#hints` (tutorial strip: build a quarry, storehouses
buffer, dens make couriers, towers stop raids — advance on events/counts), `#toasts` (events
ring). Update DOM only when the rendered string changes; heavy panels ≤ 5 Hz.

### 17.2 Controls (input.js)
Use `KeyboardEvent.code` (layout-independent). Key map (resolves the WASD/A/number clashes):

| input | action |
| --- | --- |
| WASD / arrows / screen edge (`EDGE_PAN_PX`) | pan at `PAN_SPEED` CSS px/s. **Exception:** `KeyA` arms attack-move instead of panning while ≥1 player soldier is selected |
| middle-drag | pan |
| wheel | `camera.zoomAt(cursor, 1.15^±1)` |
| `KeyB` | toggle build menu |
| `Digit0..9` and `HOTKEYS` letters (g k l m e) | start placement of that building (no modifier) |
| Ctrl + `Digit1..9` | assign control group (store id+gen pairs) |
| Shift + `Digit1..9` | recall control group (double-tap recentres camera) |
| left-click (placing) | `placeBuilding`; Shift keeps placing; invalid → toast `PLACE_REASONS[r]` |
| left-click / left-drag (not placing) | select building or units; box selects player soldiers only; a single click may select a courier |
| right-click | soldiers: enemy under cursor → `commandAttack`, else `commandGroup(O_MOVE)`; building selected (hall) → set `rally` |
| `KeyA` then left-click | `commandGroup(O_ATTACK_MOVE)` |
| `KeyH` / `KeyX` | hold / stop selected soldiers |
| `KeyP` | pause/unpause the selected building |
| Esc | cancel placement → attack-move arm → selection |
| Delete / Backspace | `demolishBuilding(selected)` |
| Space | toggle game pause; `Equal`/`Minus` speed up/down |
| minimap click/drag | recentre camera via `minimap.toWorld` |

The ghost re-runs `canPlace` whenever its tile changes (and every 10 frames for cost changes);
`overlay.ghostReason` drives its colour. Extractor ghosts also show the reach rect.

### 17.3 game.js and `window.__hw`
`createGame(opts) → Game` (fields in the stub), `setupStart(ctx) → hearthId` (START table:
Hearth centred on `world.start`, START buildings with `{free:true}`, START.stock into the
Hearth via `addItems(…, false)`, couriers around the door), `stress(game, {buildings,
couriers})`, `installDebugApi(game, extras)`:

```
window.__hw = {
  game, get ctx(), get world(), get units(), get buildings(), get pools() -> {units, buildings},
  tick(n = 1) -> ctx.tick                // synchronous stepSim calls, works while paused
  stress({buildings, couriers}) -> {buildings, couriers}
  stats() -> {tick, tickMs, frameMs, fps, units, buildings, couriers, idle, jobs, blight, pathQueue, pathHits, pathMisses}
  place(type, tx, ty, free = true) -> id
  spawn(type, x, y, faction?) -> id
  setSpeed(s), reset(seed), renderer, camera, overlay
}
```
Getters because `reset` replaces `game.ctx`; renderer/minimap must call `invalidateAll` when
they see a new ctx identity. Thumbnail: the page must show the hamlet with couriers moving
within ~1 s at zoom 1 centred on the Hearth (package.json thumbnail settle 3000 ms).

## 18. Testing conventions

- `node --test tests/` runs every `tests/*.test.mjs` (via `tests/index.js`); run one suite with
  `node --test tests/sim.test.mjs`. Suites: world.test.mjs, path.test.mjs (world), sim.test.mjs
  (sim), units.test.mjs (units). Render/app are verified in the browser by the integrator.
- `import { test } from 'node:test'`, `import assert from 'node:assert/strict'`.
- Build contexts with `makeCtx(opts)` from `tests/helpers.mjs` (64×64 grass, waves off, small
  pools) and helpers `fillTerrain, paintResource, run, runUntil, aliveIds, unpack`.
- Tests must not depend on mapgen except world.test.mjs. Sim/units tests place buildings with
  `placeBuilding(ctx, type, tx, ty, {free:true})` and seed stock with `addItems`.
- Your suite will import other areas' modules through context.js; until integration they may
  still be stubs. Write the tests against the contract anyway; the integrator runs them all.
- End-to-end browser smoke (integrator): `npx vite build && node tests/smoke.playwright.mjs`
  (not picked up by `node --test`; serves dist/, drives Chromium through boot, economy, placement,
  selection, orders, stress, reset and a 512 map; prints JSON, exit 1 on any failure or console error).
- Expected coverage: world — map resource mix + walkable connected clearing + determinism;
  path — optimal around obstacles, budget splits a search across updates, cache returns the same
  Int32Array and revalidates/invalidates after `occupy`; sim — lodge produces wood, courier
  job moves 5 wood lodge→sawmill with exact reservations at each state, sawmill makes planks,
  storage only receives pushed surplus, 50 couriers on 1 provider never oversubscribe
  (`resOut ≤ inv` always), scheduler visits ≤ K per tick, `recomputeStock` matches; units — a
  unit follows a path and arrives, two armies fight to the same outcome twice with the same seed,
  waves escalate in points, a tower kills a crawler in range.

## 19. Risks and seams (integrator checklist)

1. **Inventory helper semantics** (`fromReserved`) between logistics and buildings: a mismatch
   silently drifts `ctx.stock`. Assert `recomputeStock` equality in tests and in `__hw.stats()`
   debug builds.
2. **Path format**: path[0] is the START tile; movement starts at `pathIdx = 1`. A `[from]`
   path means "already there".
3. **Sticky arrival**: brains must react to `M_ARRIVED`/`M_FAILED`, then issue a new
   `orderMove` or `stopUnit`; forgetting leaves units "arrived" forever. `orderMove` is a
   no-op ONLY when `mstate` is M_MOVING or M_WAIT_PATH and `goal` already equals the new
   goal; from M_IDLE/M_ARRIVED/M_FAILED it always re-evaluates (so re-issuing after a
   failure retries).
4. **Unreachable doors** (a door boxed in by later buildings is impossible because doors are
   protected, but water/cliff pockets exist): logistics must filter candidates with
   `ctx.path.sameRegion` or couriers thrash between assign → M_FAILED → abort.
5. **Stale grid ids**: unitGrid is built before combat kills; idleGrid before assignments.
   Always re-check `alive` and `job`.
6. **createContext must never throw**: `createLogistics / createCombat / createWaves` stay
   allocation-only; nothing at module top level may touch DOM or ctx.
7. **Content index 0 is null**: loops start at 1. `B_SLOT_CAP`/`B_IN_QTY` index with
   `(type << ITEM_SHIFT) | item`.
8. **Building lists key on the top-left chunk**, logistics buckets key on the DOOR chunk —
   different on purpose (render culling vs. door distance). Don't mix them.
9. **Context replacement** on `game.reset`: UI/render/minimap must re-read `game.ctx` every
   frame and drop caches on identity change.
10. **Speed 4×** multiplies sim cost; the frame loop caps steps at `MAX_STEPS_PER_FRAME`
    and drops time rather than spiralling.
11. **Courier cap**: dens stop at `ctx.courierCap`. `stress()` raises it by adding to
    `ctx.courierCapExtra` AND `ctx.courierCap` (recomputeStock includes the extra), and
    spawns couriers directly with `spawnUnit`.
12. **One failing import breaks every suite** because tests/index.js imports all files in one
    process and context.js imports every sim module. Keep modules syntax-clean; run
    `node --input-type=module -e "await import('./src/<file>.js')"` before finishing.
13. **Render reads `ctx.buildings.inv`** for fill gauges only; it must never call inventory
    helpers (they mutate).
14. **Event cursors**: the HUD keeps its own `EventRing` cursor and resets it when ctx changes.
