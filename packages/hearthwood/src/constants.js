// Hearthwood shared constants. ARCHITECT-OWNED: implementers must not edit.
// Plain integers and frozen lookup arrays only. No imports, no side effects.
//
// Coordinate conventions (see ARCHITECTURE.md §3):
//   tile coords   tx, ty   integers, 0..w-1 / 0..h-1
//   world coords  x, y     floats in TILE UNITS (1.0 = one tile). Tile centre = tx + 0.5.
//   pixels        px = x * TILE * camera.zoom (render only; the sim never sees pixels)
//   packed tile   i = (ty << world.shift) | tx   (map width is a power of two)

// ---------------------------------------------------------------- grid / time
export const TILE = 32 // CSS px per tile at zoom 1
export const CHUNK_SHIFT = 5
export const CHUNK = 1 << CHUNK_SHIFT // 32 tiles per chunk side
export const CHUNK_MASK = CHUNK - 1
export const TICK_RATE = 20 // sim ticks per second
export const TICK_MS = 1000 / TICK_RATE // 50 ms
export const MAX_STEPS_PER_FRAME = 8 // fixed-step loop guard against spiral of death
export const SPEEDS = Object.freeze([0, 1, 2, 4]) // HUD speed buttons (0 = paused)

export const MAP_W = 256
export const MAP_H = 256
export const MAP_W_LARGE = 512
export const MAP_H_LARGE = 512

// ---------------------------------------------------------------- terrain (world.terrain)
export const T_GRASS = 0
export const T_MOSS = 1
export const T_DIRT = 2
export const T_WATER = 3 // impassable
export const T_CLIFF = 4 // impassable (mossy stone ridges)
export const TERRAIN_COUNT = 5
export const TERRAIN_WALKABLE = Object.freeze([1, 1, 1, 0, 0])
export const TERRAIN_NAMES = Object.freeze(['grass', 'moss', 'dirt', 'water', 'cliff'])

// ---------------------------------------------------------------- tile resources (world.res)
// Resource tiles are WALKABLE. Buildings may sit on them (an extractor's footprint
// tiles count toward its reach).
export const R_NONE = 0
export const R_TREE = 1
export const R_STONE = 2
export const R_ORE = 3
export const R_GLOWCAP = 4
export const R_MOONSTONE = 5
export const RES_COUNT = 6
export const RES_NAMES = Object.freeze(['none', 'tree', 'stone', 'ore', 'glowcap', 'moonstone'])

// ---------------------------------------------------------------- items
// Item 0 is "none". Per-building inventories are strided by ITEM_STRIDE.
export const I_NONE = 0
export const I_WOOD = 1
export const I_STONE = 2
export const I_ORE = 3
export const I_GLOWCAP = 4
export const I_MOONSTONE = 5
export const I_PLANK = 6
export const I_INGOT = 7
export const I_TOOL = 8
export const I_CHARM = 9
export const I_RELIC = 10
export const ITEM_COUNT = 11 // valid item ids are 1..ITEM_COUNT-1
export const ITEM_SHIFT = 4
export const ITEM_STRIDE = 1 << ITEM_SHIFT // 16: inv index = (b << ITEM_SHIFT) | item

/** Item yielded by harvesting a tile resource: RES_ITEM[R_TREE] === I_WOOD. */
export const RES_ITEM = Object.freeze([I_NONE, I_WOOD, I_STONE, I_ORE, I_GLOWCAP, I_MOONSTONE])

// ---------------------------------------------------------------- building types
export const B_NONE = 0
export const B_HEARTH = 1
export const B_STOREHOUSE = 2
export const B_LUMBER_LODGE = 3
export const B_QUARRY = 4
export const B_MINE = 5
export const B_GLOWCAP_GROVE = 6
export const B_MOONSTONE_DELVE = 7
export const B_SAWMILL = 8
export const B_FORGE = 9
export const B_WORKSHOP = 10
export const B_LOOM = 11
export const B_ENCHANTERY = 12
export const B_SPRITE_DEN = 13
export const B_WARDEN_HALL = 14
export const B_WARD_TOWER = 15
export const B_SHRINE = 16
export const BUILDING_COUNT = 17

// Building behaviour flags (content.B_FLAGS[type]); a type may carry several.
export const BF_STORAGE = 1 // holds any item; counts toward global stock; low-priority sink / last-resort provider
export const BF_PRODUCER = 2 // has a recipe with outputs (extractors included)
export const BF_EXTRACTOR = 4 // recipe consumes tile resources in reach instead of inputs
export const BF_REQUESTER = 8 // pulls inputs via logistics (crafters + shrine)
export const BF_TOWER = 16 // stationary attacker
export const BF_DEN = 32 // spawns couriers
export const BF_HALL = 64 // trains soldiers
export const BF_SHRINE = 128 // tier-progress sink
export const BF_CORE = 256 // the Hearth: losing it loses the game

// Building status (buildings.status[b]) — drives the little status icon + HUD text.
export const BS_OK = 0 // working or ready
export const BS_STARVED = 1 // waiting for inputs
export const BS_OUTPUT_FULL = 2 // output buffer full, waiting for pickup
export const BS_DEPLETED = 3 // extractor has no resource tiles left in reach
export const BS_PAUSED = 4 // player paused it
export const BS_NO_STOCK = 5 // den/hall cannot afford its next unit
export const BS_IDLE = 6 // nothing to do (empty training queue, courier cap reached)
export const STATUS_NAMES = Object.freeze(['ok', 'starved', 'output full', 'depleted', 'paused', 'no stock', 'idle'])

// ---------------------------------------------------------------- unit types
export const U_NONE = 0
export const U_COURIER = 1
export const U_WARDEN = 2
export const U_TREANT = 3
export const U_CRAWLER = 4
export const U_HUSK = 5
export const U_WISP = 6
export const UNIT_COUNT = 7

export const F_PLAYER = 0
export const F_BLIGHT = 1
export const FACTION_COUNT = 2

// Movement layer state (units.mstate) — owned by units.js, read by every brain.
export const M_IDLE = 0 // standing, no goal
export const M_WAIT_PATH = 1 // path requested, waiting on PathService
export const M_MOVING = 2 // following units.path[id]
export const M_ARRIVED = 3 // reached goal tile centre; sticky until next orderMove/stopUnit
export const M_FAILED = 4 // no path exists; sticky until next orderMove/stopUnit
export const MSTATE_NAMES = Object.freeze(['idle', 'waiting', 'moving', 'arrived', 'failed'])

// High-level order (units.order) — owned by combat.js. Couriers keep O_NONE.
export const O_NONE = 0 // idle: auto-acquire enemies within sight (player soldiers), else stand
export const O_MOVE = 1 // move to orderTile ignoring enemies, then O_NONE
export const O_ATTACK_MOVE = 2 // move to orderTile, engage anything in sight on the way, resume after
export const O_ATTACK = 3 // attack a specific target (target/targetGen/targetKind)
export const O_HOLD = 4 // never move; fire at anything within range
export const O_RAID = 5 // Blight: attack-move toward orderTile (a building door), hit buildings & units
export const ORDER_NAMES = Object.freeze(['idle', 'move', 'attack-move', 'attack', 'hold', 'raid'])

// Target kinds (units.targetKind, buildings.targetKind is implicitly TK_UNIT)
export const TK_NONE = 0
export const TK_UNIT = 1
export const TK_BUILDING = 2

// Courier job state (units.job) — owned by logistics.js.
export const J_NONE = 0 // idle, available for assignment
export const J_TO_PICKUP = 1 // walking to jobSrc door
export const J_PICKING = 2 // at jobSrc door, jobTimer counting down
export const J_TO_DROPOFF = 3 // carrying cargo, walking to jobDst door
export const J_DROPPING = 4 // at jobDst door, jobTimer counting down
export const JOB_NAMES = Object.freeze(['idle', 'to pickup', 'picking', 'to dropoff', 'dropping'])

// ---------------------------------------------------------------- placement results (canPlace)
export const P_OK = 0
export const P_OOB = 1 // footprint outside the map (an off-map door is P_DOOR, see canPlace)
export const P_BLOCKED = 2 // footprint on water/cliff/building/door tile
export const P_DOOR = 3 // door tile off the map, not walkable or occupied
export const P_NO_RESOURCE = 4 // extractor with zero matching resource tiles in reach
export const P_COST = 5 // cannot afford
export const P_TIER = 6 // tier too low
export const P_UNIQUE = 7 // unique building already exists
export const P_NOT_BUILDABLE = 8 // e.g. the Hearth
export const P_ENCLOSE = 9 // would wall a building door into a pocket couriers cannot reach (player placement only)
export const PLACE_REASONS = Object.freeze([
  'ok', 'out of bounds', 'blocked', 'door blocked', 'needs resource nearby',
  'cannot afford', 'tier locked', 'only one allowed', 'not buildable', 'would wall in a door',
])

// ---------------------------------------------------------------- pools
export const MAX_UNITS = 32768
export const MAX_BUILDINGS = 16384
export const TRAIN_QUEUE = 5 // per-hall training queue slots

// ---------------------------------------------------------------- logistics
export const COURIER_CAP = 5 // also UNITS[U_COURIER].cargo
export const OUTPUT_CAP = 20 // default output buffer per produced item
export const INPUT_BATCHES = 3 // input cap = max(2*COURIER_CAP, qty*INPUT_BATCHES)
export const LOG_REQ_PER_TICK = 48 // K: requester visits per tick (pull pass)
export const LOG_PUSH_PER_TICK = 48 // provider visits per tick (push-to-storage pass)
export const LOG_RADIUS_CHUNKS = 3 // provider ring search radius in chunks (Chebyshev)
export const IDLE_RADIUS_CELLS = 24 // idle-courier ring search radius in unit-grid cells
export const PICK_TICKS = 4
export const DROP_TICKS = 4

// ---------------------------------------------------------------- pathfinding
export const PATH_BUDGET = 6000 // node expansions per tick, across all queued searches
export const PATH_MAX_EXPANSIONS = 60000 // per search; beyond this -> PATH_NONE
export const PATH_CACHE_SIZE = 4096 // LRU entries
export const PATH_QUEUE_MAX = 8192 // pending searches; beyond this request() fails fast
export const PATH_RING = 16384 // result ring (power of two); jobs older than this read as PATH_NONE
export const COST_STRAIGHT = 10
export const COST_DIAG = 14

// ---------------------------------------------------------------- spatial hash
export const UNIT_CELL_SHIFT = 2 // unit grid cell = 4x4 tiles

// ---------------------------------------------------------------- combat
export const RETARGET_INTERVAL = 8 // a unit re-scans for targets when (tick + id) % this === 0
export const CHASE_REPATH_TICKS = 20 // min ticks between re-paths while chasing
export const SEPARATION_RADIUS = 0.45 // tiles; soft push between idle/fighting soldiers
export const SEPARATION_PUSH = 0.04 // tiles/tick max push

// ---------------------------------------------------------------- render / camera
export const ZOOM_MIN = 0.125
export const ZOOM_MAX = 3
export const ZOOM_TIER_NEAR = 0 // zoom >= ZOOM_MID_BELOW: full sprites
export const ZOOM_TIER_MID = 1 // ZOOM_FAR_BELOW <= zoom < ZOOM_MID_BELOW: simplified sprites
export const ZOOM_TIER_FAR = 2 // zoom < ZOOM_FAR_BELOW: glyph mode (coloured rects / dots)
export const ZOOM_MID_BELOW = 0.6
export const ZOOM_FAR_BELOW = 0.3
export const MINIMAP_REFRESH_TICKS = 20
export const MINIMAP_SIZE = 192 // backing-store px of the minimap image (square)
export const EDGE_PAN_PX = 12
export const PAN_SPEED = 900 // CSS px per second at any zoom

/** Zoom tier for a camera zoom. */
export function zoomTier(zoom) {
  return zoom < ZOOM_FAR_BELOW ? ZOOM_TIER_FAR : zoom < ZOOM_MID_BELOW ? ZOOM_TIER_MID : ZOOM_TIER_NEAR
}

// ---------------------------------------------------------------- fx (cosmetic, ctx.fx)
export const FX_NONE = 0
export const FX_ARROW = 1 // x0,y0 -> x1,y1 (warden, tower)
export const FX_BOLT = 2 // blight wisp bolt
export const FX_HIT = 3 // melee hit spark at x1,y1
export const FX_DEATH = 4 // unit death puff at x0,y0
export const FX_BUILD = 5 // building placed, centre x0,y0
export const FX_DESTROY = 6 // building destroyed, centre x0,y0
export const FX_SPAWN = 7 // unit spawned at x0,y0
export const FX_COUNT = 8
export const FX_LIFE = Object.freeze([0, 6, 8, 6, 20, 16, 30, 12]) // lifetime in ticks
export const FX_CAPACITY = 4096 // power of two

// ---------------------------------------------------------------- events (ctx.events)
export const EV_NONE = 0
export const EV_WAVE_WARNING = 1 // a = wave number, b = ticks until spawn
export const EV_WAVE_SPAWNED = 2 // a = wave number, b = units spawned
export const EV_BUILDING_LOST = 3 // a = building type, b = packed door tile
export const EV_TIER_UP = 4 // a = new tier
export const EV_WIN = 5
export const EV_LOSE = 6 // hearth destroyed
export const EV_UNIT_TRAINED = 7 // a = unit type, b = unit id
export const EV_COURIER_SPAWNED = 8 // a = unit id
export const EV_CANNOT_AFFORD = 9 // a = building or unit type (UI feedback), b = 0 building / 1 unit
export const EV_BUILDING_ATTACKED = 10 // a = building type, b = packed door tile (throttled per chunk)
export const EV_COURIERS_LOST = 11 // a = couriers killed since the last report, b = packed tile of the last death
export const EV_CAPACITY = 1024 // power of two

// ---------------------------------------------------------------- tile packing helpers
/** Packed tile index. `shift` = log2(world.w). */
export function tileIdx(tx, ty, shift) { return (ty << shift) | tx }
/** Tile x from packed index. `mask` = world.w - 1. */
export function tileX(i, mask) { return i & mask }
/** Tile y from packed index. */
export function tileY(i, shift) { return i >> shift }
/** Chunk index for a tile. `chunksW` = world.w >> CHUNK_SHIFT. */
export function chunkOfTile(tx, ty, chunksW) { return (ty >> CHUNK_SHIFT) * chunksW + (tx >> CHUNK_SHIFT) }
/** Inventory index into buildings.inv/resIn/resOut. */
export function invIdx(b, item) { return (b << ITEM_SHIFT) | item }
