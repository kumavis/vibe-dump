// Pure HUD helpers for ui.js (formatting, tutorial hints, event -> toast text).
// OWNER: app implementer. No DOM; safe to import and test in Node.

import {
  TICK_RATE, ITEM_COUNT, I_WOOD, I_STONE, I_ORE, I_PLANK, I_INGOT, I_GLOWCAP, I_TOOL, I_CHARM,
  I_MOONSTONE, I_RELIC, B_QUARRY, B_STOREHOUSE, B_SPRITE_DEN, B_WARD_TOWER, B_WARDEN_HALL, B_FORGE,
  B_SHRINE, EV_WAVE_WARNING, EV_WAVE_SPAWNED, EV_BUILDING_LOST, EV_TIER_UP, EV_WIN, EV_LOSE,
  EV_UNIT_TRAINED, EV_CANNOT_AFFORD, ITEM_SHIFT, EV_BUILDING_ATTACKED, EV_COURIERS_LOST,
} from './constants.js'
import { BUILDINGS, UNITS, TIERS, WIN_TIER, ITEMS, WAVES } from './content.js'

/** Ticks -> "m:ss" (negative clamps to 0:00). */
export function fmtClock(ticks) {
  let s = Math.ceil(ticks / TICK_RATE)
  if (!(s > 0)) s = 0
  const m = (s / 60) | 0
  s -= m * 60
  return m + ':' + (s < 10 ? '0' : '') + s
}

/** Compact count: 999, 1.2k, 34k, 1.2M. */
export function fmtCount(n) {
  if (n < 1000) return String(n | 0)
  if (n < 10000) return (Math.floor(n / 100) / 10) + 'k'
  if (n < 1e6) return ((n / 1000) | 0) + 'k'
  return (Math.floor(n / 1e5) / 10) + 'M'
}

/** Escape text for innerHTML. */
export function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => (c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&quot;'))
}

/** Items always listed in the stock bar, by tier (others appear once nonzero). */
const STOCK_BY_TIER = [
  [I_WOOD, I_STONE, I_ORE, I_PLANK, I_INGOT],
  [I_WOOD, I_STONE, I_ORE, I_PLANK, I_INGOT, I_GLOWCAP, I_TOOL, I_CHARM],
  [I_WOOD, I_STONE, I_ORE, I_PLANK, I_INGOT, I_GLOWCAP, I_TOOL, I_CHARM, I_MOONSTONE, I_RELIC],
]

/** Whether `item` belongs in the stock bar right now. */
export function stockVisible(ctx, item) {
  if (ctx.stock[item] > 0) return true
  const t = ctx.tier > 2 ? 2 : ctx.tier
  return STOCK_BY_TIER[t].indexOf(item) >= 0
}

/** Alive Shrine id or -1. */
export function shrineId(ctx) {
  const B = ctx.buildings
  return B.typeCount[B_SHRINE] > 0 ? B.typeList[B_SHRINE][0] : -1
}

/**
 * Offering progress for the current tier: [{item, have, need}] (have = Shrine inv), [] when won.
 * @returns {{item:number, have:number, need:number}[]}
 */
export function offeringProgress(ctx) {
  const t = TIERS[ctx.tier]
  if (!t || !t.offering) return []
  const s = shrineId(ctx)
  const out = []
  for (const e of t.offering) {
    const have = s >= 0 ? ctx.buildings.inv[(s << ITEM_SHIFT) | e.item] : 0
    out.push({ item: e.item, have: Math.min(have, e.qty), need: e.qty })
  }
  return out
}

const k = (hk) => '<kbd>' + hk + '</kbd>'

/**
 * Tutorial strip: ordered steps; the first not-yet-done one is shown.
 * html is trusted static markup.
 */
export const HINTS = Object.freeze([
  { id: 'quarry', html: `Sprite couriers haul goods on their own. Build a <b>Quarry</b> ${k('2')} on the grey rocks south-west of the Hearth.`,
    done: (c) => c.buildings.typeCount[B_QUARRY] > 0 },
  { id: 'store', html: `<b>Storehouses</b> ${k('6')} buffer surplus — construction is paid from everything in storage. Heartwood low? Add a <b>Lumber Lodge</b> ${k('1')}.`,
    done: (c) => c.buildings.typeCount[B_STOREHOUSE] > 0 },
  { id: 'den', html: `A <b>Sprite Den</b> ${k('7')} turns planks into more couriers.`,
    done: (c) => c.buildings.typeCount[B_SPRITE_DEN] > 0 },
  { id: 'tower', html: `The Blight raids from the map edges. <b>Ward Towers</b> ${k('8')} and a <b>Warden Hall</b> ${k('9')} stop raids.`,
    done: (c) => c.buildings.typeCount[B_WARD_TOWER] > 0 || c.buildings.typeCount[B_WARDEN_HALL] > 0 },
  { id: 'forge', html: `Dig bog iron with a <b>Bog Mine</b> ${k('3')}, smelt ingots in an <b>Ember Forge</b> ${k('5')}.`,
    done: (c) => c.buildings.typeCount[B_FORGE] > 0 },
  { id: 'shrine', html: `Raise the <b>Moonwell Shrine</b> ${k('0')} and offer 20 planks + 10 ingots to reach the Grove.`,
    done: (c) => c.tier >= 1 },
  { id: 'grove', html: `Grove tier: <b>Glowcap Groves</b>, <b>Workshops</b> and <b>Glowlooms</b> unlock. Offer 10 tools + 10 charms.`,
    done: (c) => c.tier >= 2 },
  { id: 'oldwood', html: `Old Wood: delve <b>moonstone</b> and enchant 5 <b>Starbloom Relics</b> to awaken the forest.`,
    done: (c) => c.won || c.tier >= WIN_TIER },
])

const TOWER_HINT = HINTS.findIndex((h) => h.id === 'tower')
/** Defence jumps the queue from the first wave warning on: wave 1 must not beat the tutorial. */
const DEFENCE_URGENT_TICK = WAVES.firstTick - WAVES.warnTicks

/** No Ward Tower and no Warden Hall yet. */
function undefended(ctx) { return !HINTS[TOWER_HINT].done(ctx) }

/** Index of the hint to show, or -1 when the tutorial is finished. */
export function hintIndex(ctx) {
  if (ctx.tick >= DEFENCE_URGENT_TICK && undefended(ctx)) return TOWER_HINT
  for (let i = 0; i < HINTS.length; i++) if (!HINTS[i].done(ctx)) return i
  return -1
}

const SIDES = ['north', 'east', 'south', 'west']

/**
 * HUD message for an EventRing entry, or null to stay silent.
 * @returns {{msg:string, kind:'good'|'bad'|'info', tile?:number}|null}
 */
export function eventMessage(ctx, type, a, b) {
  switch (type) {
    case EV_WAVE_WARNING: {
      const tip = undefended(ctx) ? ' — build a Ward Tower [8]' : ''
      return { msg: `The Blight stirs — wave ${a} in ${Math.round(b / TICK_RATE)} s${tip}`, kind: 'bad' }
    }
    case EV_WAVE_SPAWNED: {
      const W = ctx.waves
      const side = W && W.lastSide >= 0 ? ' from the ' + SIDES[W.lastSide & 3] : ''
      const tile = W && W.lastTile >= 0 ? W.lastTile : undefined
      return { msg: `Wave ${a}: ${b} Blight emerge${side}!`, kind: 'bad', tile }
    }
    case EV_BUILDING_ATTACKED: return { msg: `${BUILDINGS[a] ? BUILDINGS[a].name : 'A building'} under attack!`, kind: 'bad', tile: b }
    case EV_COURIERS_LOST: return { msg: a === 1 ? 'A courier was slain' : `${a} couriers slain`, kind: 'bad', tile: b }
    case EV_BUILDING_LOST: return { msg: `${BUILDINGS[a] ? BUILDINGS[a].name : 'A building'} was destroyed`, kind: 'bad', tile: b }
    case EV_TIER_UP: return { msg: `The grove grows: ${TIERS[a] ? TIERS[a].name : 'tier ' + a}`, kind: 'good' }
    case EV_WIN: return { msg: 'Five relics glow — the forest awakens!', kind: 'good' }
    case EV_LOSE: return { msg: 'The Hearth has fallen…', kind: 'bad' }
    case EV_UNIT_TRAINED: return { msg: `${UNITS[a] ? UNITS[a].name : 'Unit'} ready`, kind: 'info' }
    case EV_CANNOT_AFFORD: {
      const name = b === 1 ? (UNITS[a] ? UNITS[a].name : 'unit') : (BUILDINGS[a] ? BUILDINGS[a].name : 'building')
      return { msg: `Not enough stock for ${name}`, kind: 'bad' }
    }
    default: return null
  }
}

/** "20 wood, 10 stone" style cost text (names from ITEMS). */
export function costText(cost) {
  if (!cost || cost.length === 0) return 'free'
  let s = ''
  for (let i = 0; i < cost.length; i++) s += (i ? ', ' : '') + cost[i].qty + ' ' + ITEMS[cost[i].item].name
  return s
}

export const ITEM_IDS = Object.freeze(Array.from({ length: ITEM_COUNT - 1 }, (_, i) => i + 1))
