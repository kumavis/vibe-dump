// Hearthwood content tables. ARCHITECT-OWNED: implementers must not edit.
// Readable object tables (for UI/tooling) plus flat typed lookup arrays derived
// at module load (for hot loops). Treat everything here as READ-ONLY; typed
// arrays cannot be frozen, so do not write into them.
//
// Indexing: ITEMS[id], BUILDINGS[type], UNITS[type]. Index 0 of BUILDINGS and
// UNITS is null (the NONE sentinel) so a stray 0 throws instead of silently
// reading a real type. Loop `for (let t = 1; t < BUILDING_COUNT; t++)`.

import {
  I_NONE, I_WOOD, I_STONE, I_ORE, I_GLOWCAP, I_MOONSTONE, I_PLANK, I_INGOT, I_TOOL, I_CHARM, I_RELIC, ITEM_COUNT,
  R_NONE, R_TREE, R_STONE, R_ORE, R_GLOWCAP, R_MOONSTONE, RES_COUNT,
  B_HEARTH, B_STOREHOUSE, B_LUMBER_LODGE, B_QUARRY, B_MINE, B_GLOWCAP_GROVE, B_MOONSTONE_DELVE,
  B_SAWMILL, B_FORGE, B_WORKSHOP, B_LOOM, B_ENCHANTERY, B_SPRITE_DEN, B_WARDEN_HALL, B_WARD_TOWER, B_SHRINE,
  BUILDING_COUNT,
  BF_STORAGE, BF_PRODUCER, BF_EXTRACTOR, BF_REQUESTER, BF_TOWER, BF_DEN, BF_HALL, BF_SHRINE, BF_CORE,
  U_COURIER, U_WARDEN, U_TREANT, U_CRAWLER, U_HUSK, U_WISP, UNIT_COUNT,
  F_PLAYER, F_BLIGHT,
  COURIER_CAP, OUTPUT_CAP, INPUT_BATCHES, TICK_RATE, ITEM_SHIFT, ITEM_STRIDE,
  FX_ARROW, FX_BOLT, FX_HIT,
} from './constants.js'

/** @typedef {{item:number, qty:number}} ItemQty */
/** @typedef {{item:number, qty:number, cap:number}} SlotDef  cap = buffer limit for that item in the building */
/**
 * @typedef {Object} RecipeDef
 * @property {SlotDef[]} inputs   empty for extractors
 * @property {SlotDef[]} outputs  exactly one entry in this content set
 * @property {number} ticks       work ticks per cycle
 */
/**
 * @typedef {Object} BuildingDef
 * @property {number} id
 * @property {string} key            stable snake-case id
 * @property {string} name
 * @property {string} desc           tooltip one-liner
 * @property {string} glyph          one character for far-zoom / minimap legends
 * @property {string} color          base palette hint for sprite baking (CSS colour)
 * @property {number} w              footprint width in tiles
 * @property {number} h              footprint height in tiles
 * @property {[number,number]} door  door tile offset from footprint top-left; always OUTSIDE the footprint, edge-adjacent
 * @property {number} hp
 * @property {ItemQty[]} cost        paid instantly from global stock on placement
 * @property {'core'|'storage'|'extract'|'craft'|'logistics'|'military'|'special'} category
 * @property {number} tier           ctx.tier must be >= this to place
 * @property {string|null} hotkey    single key (lowercase) or null
 * @property {boolean} buildable     false only for the Hearth
 * @property {boolean} unique        at most one alive (Hearth, Shrine)
 * @property {RecipeDef|null} recipe
 * @property {{res:number, reach:number}|null} extractor  reach = tiles beyond the footprint edge
 * @property {number} storage        0 = not storage; else total item capacity (all items summed)
 * @property {number} courierCap     added to ctx.courierCap while alive
 * @property {{ticks:number, cost:ItemQty[]}|null} courierSpawn
 * @property {number[]|null} trains  unit types a hall can train
 * @property {{range:number, attack:number, cooldown:number, fx:number}|null} tower
 * @property {boolean} shrine
 * @property {number} flags          BF_* bitmask (derived)
 */
/**
 * @typedef {Object} UnitDef
 * @property {number} id
 * @property {string} key
 * @property {string} name
 * @property {string} desc
 * @property {string} color
 * @property {number} faction      default faction
 * @property {number} hp
 * @property {number} speed        tiles per tick
 * @property {number} attack       damage per hit (0 = non-combatant)
 * @property {number} range        tiles, measured centre-to-centre (unit) or centre-to-rect (building)
 * @property {number} cooldown     ticks between hits
 * @property {number} sight        tiles; auto-acquire radius
 * @property {number} vsBuilding   damage multiplier against buildings
 * @property {number} fx           FX_* emitted per hit (FX_ARROW / FX_BOLT / FX_HIT)
 * @property {number} cargo        carry capacity (couriers only)
 * @property {number} radius       visual radius in tiles (render + separation)
 * @property {ItemQty[]} cost      training / spawning cost
 * @property {number} trainTicks
 * @property {number} tier
 * @property {number} waveCost     Blight director point cost (0 = never in waves)
 * @property {number} fromWave     first wave this Blight type may appear in
 * @property {number} weight       roster weight for the director
 */

const c = (...pairs) => {
  const out = []
  for (let i = 0; i < pairs.length; i += 2) out.push(Object.freeze({ item: pairs[i], qty: pairs[i + 1] }))
  return Object.freeze(out)
}

// ---------------------------------------------------------------- items
/** @type {ReadonlyArray<{id:number,key:string,name:string,color:string,raw:boolean,res:number}>} */
export const ITEMS = Object.freeze([
  { id: I_NONE, key: 'none', name: '—', color: '#000000', raw: false, res: R_NONE },
  { id: I_WOOD, key: 'wood', name: 'Heartwood', color: '#9b6a3c', raw: true, res: R_TREE },
  { id: I_STONE, key: 'stone', name: 'Mossstone', color: '#93a096', raw: true, res: R_STONE },
  { id: I_ORE, key: 'ore', name: 'Bog Iron', color: '#b0603e', raw: true, res: R_ORE },
  { id: I_GLOWCAP, key: 'glowcap', name: 'Glowcap', color: '#3fe0c8', raw: true, res: R_GLOWCAP },
  { id: I_MOONSTONE, key: 'moonstone', name: 'Moonstone', color: '#c8d4ff', raw: true, res: R_MOONSTONE },
  { id: I_PLANK, key: 'plank', name: 'Planks', color: '#dcae66', raw: false, res: R_NONE },
  { id: I_INGOT, key: 'ingot', name: 'Iron Ingot', color: '#b9c2cc', raw: false, res: R_NONE },
  { id: I_TOOL, key: 'tool', name: 'Tools', color: '#e8b04b', raw: false, res: R_NONE },
  { id: I_CHARM, key: 'charm', name: 'Grove Charm', color: '#7ef0a8', raw: false, res: R_NONE },
  { id: I_RELIC, key: 'relic', name: 'Starbloom Relic', color: '#f6dc84', raw: false, res: R_NONE },
].map(Object.freeze))

/** Tile resource visuals / amounts. RESOURCES[R_*]. amount = units per tile at generation. */
export const RESOURCES = Object.freeze([
  { id: R_NONE, key: 'none', name: '—', item: I_NONE, amount: 0, color: '#000000' },
  { id: R_TREE, key: 'tree', name: 'Elderwood Stand', item: I_WOOD, amount: 40, color: '#2f6b3a' },
  { id: R_STONE, key: 'stone', name: 'Mossy Outcrop', item: I_STONE, amount: 80, color: '#7d8a80' },
  { id: R_ORE, key: 'ore', name: 'Bog Iron Seam', item: I_ORE, amount: 120, color: '#8a4a32' },
  { id: R_GLOWCAP, key: 'glowcap', name: 'Glowcap Ring', item: I_GLOWCAP, amount: 50, color: '#2fd0bb' },
  { id: R_MOONSTONE, key: 'moonstone', name: 'Moonstone Vein', item: I_MOONSTONE, amount: 150, color: '#aab8ff' },
].map(Object.freeze))

// ---------------------------------------------------------------- recipes helpers
const inSlot = (item, qty) => ({ item, qty, cap: Math.max(2 * COURIER_CAP, qty * INPUT_BATCHES) })
const outSlot = (item, qty) => ({ item, qty, cap: OUTPUT_CAP })
const recipe = (inputs, outputs, ticks) => ({ inputs, outputs, ticks })

const base = {
  recipe: null, extractor: null, storage: 0, courierCap: 0, courierSpawn: null,
  trains: null, tower: null, shrine: false, unique: false, buildable: true, hotkey: null, tier: 0,
}

const defs = [
  null,
  { id: B_HEARTH, key: 'hearth', name: 'Hearth', glyph: 'H', color: '#ffb54a', category: 'core',
    desc: 'Your heart-tree home. Stores goods, houses the first couriers. Lose it and the grove falls.',
    w: 3, h: 3, door: [1, 3], hp: 2000, cost: c(), buildable: false, unique: true,
    storage: 500, courierCap: 12 },
  { id: B_STOREHOUSE, key: 'storehouse', name: 'Storehouse', glyph: 'S', color: '#8a6a44', category: 'storage',
    desc: 'Buffers any goods. Couriers drop surplus here; construction draws from all storage.',
    w: 2, h: 2, door: [1, 2], hp: 500, cost: c(I_WOOD, 20, I_STONE, 10), hotkey: '6', storage: 200 },
  { id: B_LUMBER_LODGE, key: 'lumber_lodge', name: 'Lumber Lodge', glyph: 'L', color: '#6b4a2f', category: 'extract',
    desc: 'Fells elderwood within 3 tiles. Place next to a tree stand.',
    w: 2, h: 2, door: [1, 2], hp: 250, cost: c(I_WOOD, 10), hotkey: '1',
    extractor: { res: R_TREE, reach: 3 }, recipe: recipe([], [outSlot(I_WOOD, 1)], 50) },
  { id: B_QUARRY, key: 'quarry', name: 'Quarry', glyph: 'Q', color: '#7d8a80', category: 'extract',
    desc: 'Cuts mossstone within 2 tiles. Place on a rock outcrop.',
    w: 2, h: 2, door: [1, 2], hp: 300, cost: c(I_WOOD, 15), hotkey: '2',
    extractor: { res: R_STONE, reach: 2 }, recipe: recipe([], [outSlot(I_STONE, 1)], 70) },
  { id: B_MINE, key: 'mine', name: 'Bog Mine', glyph: 'M', color: '#8a4a32', category: 'extract',
    desc: 'Digs bog iron within 2 tiles. Place on an ore seam.',
    w: 2, h: 2, door: [1, 2], hp: 300, cost: c(I_WOOD, 20, I_STONE, 10), hotkey: '3',
    extractor: { res: R_ORE, reach: 2 }, recipe: recipe([], [outSlot(I_ORE, 1)], 80) },
  { id: B_GLOWCAP_GROVE, key: 'glowcap_grove', name: 'Glowcap Grove', glyph: 'G', color: '#2fd0bb', category: 'extract',
    desc: 'Tends glowcaps within 3 tiles. Place in a mushroom ring.',
    w: 2, h: 2, door: [1, 2], hp: 250, cost: c(I_WOOD, 20, I_PLANK, 10), hotkey: 'g', tier: 1,
    extractor: { res: R_GLOWCAP, reach: 3 }, recipe: recipe([], [outSlot(I_GLOWCAP, 1)], 70) },
  { id: B_MOONSTONE_DELVE, key: 'moonstone_delve', name: 'Moonstone Delve', glyph: 'D', color: '#aab8ff', category: 'extract',
    desc: 'Quarries moonstone within 2 tiles. Deep veins lie far from the Hearth.',
    w: 2, h: 2, door: [1, 2], hp: 350, cost: c(I_PLANK, 20, I_STONE, 30, I_INGOT, 5), hotkey: 'm', tier: 2,
    extractor: { res: R_MOONSTONE, reach: 2 }, recipe: recipe([], [outSlot(I_MOONSTONE, 1)], 120) },
  { id: B_SAWMILL, key: 'sawmill', name: 'Sawmill', glyph: 'w', color: '#c08a4a', category: 'craft',
    desc: 'Heartwood → planks.',
    w: 2, h: 2, door: [1, 2], hp: 300, cost: c(I_WOOD, 15, I_STONE, 5), hotkey: '4',
    recipe: recipe([inSlot(I_WOOD, 1)], [outSlot(I_PLANK, 1)], 40) },
  { id: B_FORGE, key: 'forge', name: 'Ember Forge', glyph: 'F', color: '#ff7a3a', category: 'craft',
    desc: '2 bog iron + 1 heartwood → iron ingot.',
    w: 2, h: 2, door: [1, 2], hp: 400, cost: c(I_STONE, 25, I_WOOD, 10), hotkey: '5',
    recipe: recipe([inSlot(I_ORE, 2), inSlot(I_WOOD, 1)], [outSlot(I_INGOT, 1)], 90) },
  { id: B_WORKSHOP, key: 'workshop', name: 'Tinker Workshop', glyph: 'T', color: '#e8b04b', category: 'craft',
    desc: '2 planks + 1 ingot → tools.',
    w: 2, h: 2, door: [1, 2], hp: 350, cost: c(I_PLANK, 20, I_STONE, 20), hotkey: 'k', tier: 1,
    recipe: recipe([inSlot(I_PLANK, 2), inSlot(I_INGOT, 1)], [outSlot(I_TOOL, 1)], 120) },
  { id: B_LOOM, key: 'loom', name: 'Glowloom', glyph: 'C', color: '#7ef0a8', category: 'craft',
    desc: '2 glowcaps + 1 plank → grove charm.',
    w: 2, h: 2, door: [1, 2], hp: 300, cost: c(I_PLANK, 25, I_INGOT, 5), hotkey: 'l', tier: 1,
    recipe: recipe([inSlot(I_GLOWCAP, 2), inSlot(I_PLANK, 1)], [outSlot(I_CHARM, 1)], 100) },
  { id: B_ENCHANTERY, key: 'enchantery', name: 'Starbloom Enchantery', glyph: 'E', color: '#f6dc84', category: 'craft',
    desc: '1 tool + 2 charms + 2 moonstone → starbloom relic.',
    w: 3, h: 3, door: [1, 3], hp: 600, cost: c(I_PLANK, 40, I_INGOT, 20, I_STONE, 40, I_CHARM, 5), hotkey: 'e', tier: 2,
    recipe: recipe([inSlot(I_TOOL, 1), inSlot(I_CHARM, 2), inSlot(I_MOONSTONE, 2)], [outSlot(I_RELIC, 1)], 240) },
  { id: B_SPRITE_DEN, key: 'sprite_den', name: 'Sprite Den', glyph: 'o', color: '#9fe8ff', category: 'logistics',
    desc: 'Coaxes a new sprite courier out of the moss every 6 s for 3 planks. +10 courier cap.',
    w: 2, h: 2, door: [1, 2], hp: 300, cost: c(I_WOOD, 30, I_STONE, 10), hotkey: '7',
    courierCap: 10, courierSpawn: { ticks: 120, cost: c(I_PLANK, 3) } },
  { id: B_WARDEN_HALL, key: 'warden_hall', name: 'Warden Hall', glyph: 'W', color: '#5f8f6a', category: 'military',
    desc: 'Trains Warden archers and, from tier 1, Treants.',
    w: 3, h: 3, door: [1, 3], hp: 900, cost: c(I_WOOD, 40, I_STONE, 30), hotkey: '9',
    trains: [U_WARDEN, U_TREANT] },
  { id: B_WARD_TOWER, key: 'ward_tower', name: 'Ward Tower', glyph: '^', color: '#cfd8c0', category: 'military',
    desc: 'Rune-lit watchtower. Looses arrows at Blight within 6.5 tiles.',
    w: 1, h: 1, door: [0, 1], hp: 350, cost: c(I_STONE, 15, I_WOOD, 10, I_PLANK, 5), hotkey: '8',
    tower: { range: 6.5, attack: 9, cooldown: 18, fx: FX_ARROW } },
  { id: B_SHRINE, key: 'shrine', name: 'Moonwell Shrine', glyph: '*', color: '#c8d4ff', category: 'special',
    desc: 'Offer goods here to raise the grove\'s tier. Five relics awaken the forest.',
    w: 3, h: 3, door: [1, 3], hp: 1200, cost: c(I_STONE, 40, I_PLANK, 20), hotkey: '0', unique: true, shrine: true },
]

function flagsOf(d) {
  let f = 0
  if (d.storage > 0) f |= BF_STORAGE
  if (d.recipe && d.recipe.outputs.length) f |= BF_PRODUCER
  if (d.extractor) f |= BF_EXTRACTOR
  if ((d.recipe && d.recipe.inputs.length) || d.shrine) f |= BF_REQUESTER
  if (d.tower) f |= BF_TOWER
  if (d.courierSpawn) f |= BF_DEN
  if (d.trains) f |= BF_HALL
  if (d.shrine) f |= BF_SHRINE
  if (d.category === 'core') f |= BF_CORE
  return f
}

function deepFreeze(o) {
  if (o && typeof o === 'object' && !Object.isFrozen(o)) {
    Object.freeze(o)
    for (const k of Object.keys(o)) deepFreeze(o[k])
  }
  return o
}

/** @type {ReadonlyArray<BuildingDef|null>} */
export const BUILDINGS = deepFreeze(defs.map((d) => (d ? { ...base, ...d, flags: flagsOf({ ...base, ...d }) } : null)))

// ---------------------------------------------------------------- units
const ubase = { cargo: 0, attack: 0, range: 0, cooldown: 0, sight: 0, vsBuilding: 1, fx: 0, cost: c(),
  trainTicks: 0, tier: 0, waveCost: 0, fromWave: 0, weight: 0 }

/** @type {ReadonlyArray<UnitDef|null>} */
export const UNITS = deepFreeze([
  null,
  { ...ubase, id: U_COURIER, key: 'courier', name: 'Sprite Courier', color: '#9fe8ff', faction: F_PLAYER,
    desc: 'A will-o-wisp with a satchel. Hauls up to 5 of one good.',
    hp: 20, speed: 0.11, cargo: COURIER_CAP, radius: 0.22, cost: c(I_PLANK, 3), trainTicks: 120 },
  { ...ubase, id: U_WARDEN, key: 'warden', name: 'Warden', color: '#8fdc7a', faction: F_PLAYER,
    desc: 'Hooded archer of the grove. Fragile, long reach.',
    hp: 90, speed: 0.095, attack: 9, range: 5, cooldown: 20, sight: 8, fx: FX_ARROW, radius: 0.3,
    cost: c(I_WOOD, 15, I_PLANK, 10), trainTicks: 160 },
  { ...ubase, id: U_TREANT, key: 'treant', name: 'Treant', color: '#5a7a3a', faction: F_PLAYER,
    desc: 'Walking oak. Soaks blows, crushes husks.',
    hp: 420, speed: 0.055, attack: 22, range: 1.3, cooldown: 36, sight: 6, fx: FX_HIT, radius: 0.48,
    cost: c(I_PLANK, 20, I_GLOWCAP, 10), trainTicks: 300, tier: 1 },
  { ...ubase, id: U_CRAWLER, key: 'crawler', name: 'Blight Crawler', color: '#a24bd1', faction: F_BLIGHT,
    desc: 'Skittering rot-spider. Fast, weak, many.',
    hp: 32, speed: 0.12, attack: 5, range: 0.9, cooldown: 14, sight: 7, fx: FX_HIT, radius: 0.26,
    waveCost: 1, fromWave: 1, weight: 6 },
  { ...ubase, id: U_HUSK, key: 'husk', name: 'Rot Husk', color: '#6b3a7a', faction: F_BLIGHT,
    desc: 'Bloated deadwood brute. Wrecks buildings.',
    hp: 180, speed: 0.06, attack: 16, range: 1.2, cooldown: 32, sight: 6, vsBuilding: 2.5, fx: FX_HIT, radius: 0.45,
    waveCost: 5, fromWave: 5, weight: 2 },
  { ...ubase, id: U_WISP, key: 'wisp', name: 'Gloom Wisp', color: '#d070ff', faction: F_BLIGHT,
    desc: 'Drifting shade that spits blight bolts.',
    hp: 45, speed: 0.09, attack: 7, range: 4, cooldown: 26, sight: 8, vsBuilding: 0.6, fx: FX_BOLT, radius: 0.28,
    waveCost: 2, fromWave: 3, weight: 3 },
])

// ---------------------------------------------------------------- waves
export const WAVES = deepFreeze({
  firstTick: 5 * 60 * TICK_RATE, // first wave at 5:00
  warnTicks: 30 * TICK_RATE, // EV_WAVE_WARNING this long before a wave
  interval: 150 * TICK_RATE, // gap after wave 1
  intervalStep: 5 * TICK_RATE, // gap shrinks by this per wave
  minInterval: 60 * TICK_RATE,
  basePoints: 4,
  pointsPerWave: 3, // * (wave - 1)
  pointsPerMinute: 0.6, // * elapsed minutes
  pointsPerBuilding: 0.15, // * alive building count
  maxUnits: 240, // per wave hard cap
  spread: 4, // tiles; group scatter around the edge spawn point
  groups: 1, // + floor(wave / 4) separate edge groups
  roster: [U_CRAWLER, U_WISP, U_HUSK], // eligibility from UNITS[t].fromWave/waveCost/weight
})

// ---------------------------------------------------------------- tiers
// TIERS[t].offering = what the Shrine needs to advance FROM tier t TO t+1.
// Reaching the last tier (offering null) wins the game.
export const TIERS = deepFreeze([
  { tier: 0, name: 'Clearing', offering: c(I_PLANK, 20, I_INGOT, 10) },
  { tier: 1, name: 'Grove', offering: c(I_TOOL, 10, I_CHARM, 10) },
  { tier: 2, name: 'Old Wood', offering: c(I_RELIC, 5) },
  { tier: 3, name: 'Awakened', offering: null },
])
export const WIN_TIER = TIERS.length - 1

// ---------------------------------------------------------------- start
// All offsets relative to mapgen's start tile (sx, sy) = the Hearth's CENTRE tile.
// Building offsets are footprint TOP-LEFT. Mapgen must carve a walkable clearing of
// radius clearRadius (no water/cliff/resources) and THEN stamp the grove and rocks.
export const START = deepFreeze({
  stock: c(I_WOOD, 150, I_STONE, 80, I_PLANK, 30), // placed in the Hearth's inventory
  couriers: 8, // spawned around the Hearth door
  clearRadius: 10,
  hearth: { dx: -1, dy: -1 },
  buildings: [
    { type: B_LUMBER_LODGE, dx: 4, dy: -5 }, // door (5,-3); reach covers the grove
    { type: B_SAWMILL, dx: -5, dy: -2 }, // door (-4,0)
  ],
  grove: { dx: 6, dy: -8, w: 6, h: 6, res: R_TREE },
  rocks: { dx: -11, dy: 4, w: 5, h: 4, res: R_STONE },
  cameraZoom: 1,
})

// ---------------------------------------------------------------- derived flat lookups (hot loops)
export const B_W = new Uint8Array(BUILDING_COUNT)
export const B_H = new Uint8Array(BUILDING_COUNT)
export const B_DOOR_DX = new Int8Array(BUILDING_COUNT)
export const B_DOOR_DY = new Int8Array(BUILDING_COUNT)
export const B_HP = new Float32Array(BUILDING_COUNT)
export const B_FLAGS = new Uint16Array(BUILDING_COUNT)
export const B_STORAGE = new Int32Array(BUILDING_COUNT)
export const B_TIER = new Uint8Array(BUILDING_COUNT)
/** Output item of a producer type (0 if none). One output per recipe in this content set. */
export const B_OUT_ITEM = new Uint8Array(BUILDING_COUNT)
/** Per (type, item) buffer cap for recipe inputs/outputs: index (type << ITEM_SHIFT) | item; 0 = not a slot. */
export const B_SLOT_CAP = new Int32Array(BUILDING_COUNT * ITEM_STRIDE)
/** Per (type, item) recipe quantity per cycle for inputs (positive) — 0 = not an input. Same indexing. */
export const B_IN_QTY = new Int32Array(BUILDING_COUNT * ITEM_STRIDE)

for (let t = 1; t < BUILDING_COUNT; t++) {
  const d = BUILDINGS[t]
  B_W[t] = d.w; B_H[t] = d.h
  B_DOOR_DX[t] = d.door[0]; B_DOOR_DY[t] = d.door[1]
  B_HP[t] = d.hp; B_FLAGS[t] = d.flags; B_STORAGE[t] = d.storage; B_TIER[t] = d.tier
  if (d.recipe) {
    for (const s of d.recipe.inputs) { B_SLOT_CAP[(t << ITEM_SHIFT) | s.item] = s.cap; B_IN_QTY[(t << ITEM_SHIFT) | s.item] = s.qty }
    for (const s of d.recipe.outputs) { B_SLOT_CAP[(t << ITEM_SHIFT) | s.item] = s.cap; B_OUT_ITEM[t] = s.item }
  }
}

export const U_SPEED = new Float32Array(UNIT_COUNT)
export const U_HP = new Float32Array(UNIT_COUNT)
export const U_ATTACK = new Float32Array(UNIT_COUNT)
export const U_RANGE = new Float32Array(UNIT_COUNT)
export const U_COOLDOWN = new Uint16Array(UNIT_COUNT)
export const U_SIGHT = new Float32Array(UNIT_COUNT)
export const U_CARGO = new Uint8Array(UNIT_COUNT)
export const U_FACTION = new Uint8Array(UNIT_COUNT)
export const U_VS_BUILDING = new Float32Array(UNIT_COUNT)
export const U_RADIUS = new Float32Array(UNIT_COUNT)
export const U_FX = new Uint8Array(UNIT_COUNT)
for (let t = 1; t < UNIT_COUNT; t++) {
  const u = UNITS[t]
  U_SPEED[t] = u.speed; U_HP[t] = u.hp; U_ATTACK[t] = u.attack; U_RANGE[t] = u.range
  U_COOLDOWN[t] = u.cooldown; U_SIGHT[t] = u.sight; U_CARGO[t] = u.cargo; U_FACTION[t] = u.faction
  U_VS_BUILDING[t] = u.vsBuilding; U_RADIUS[t] = u.radius; U_FX[t] = u.fx
}

/** CSS colour per item id, for HUD dots and cargo icons. */
export const ITEM_COLOR = Object.freeze(ITEMS.map((i) => i.color))
/** Building types in build-menu order (buildable only). */
export const BUILD_MENU = Object.freeze(
  [B_LUMBER_LODGE, B_QUARRY, B_MINE, B_SAWMILL, B_FORGE, B_STOREHOUSE, B_SPRITE_DEN, B_WARD_TOWER, B_WARDEN_HALL, B_SHRINE,
    B_GLOWCAP_GROVE, B_WORKSHOP, B_LOOM, B_MOONSTONE_DELVE, B_ENCHANTERY])
/** hotkey (lowercase string) -> building type */
export const HOTKEYS = Object.freeze(Object.fromEntries(
  BUILDINGS.filter((d) => d && d.hotkey).map((d) => [d.hotkey, d.id])))

if (ITEM_COUNT > ITEM_STRIDE || RES_COUNT > 16) throw new Error('hearthwood: content exceeds ITEM_STRIDE')
