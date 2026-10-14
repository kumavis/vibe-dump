// Everything the store sells, what it costs in stars, and what it does to a
// ship. Prices are in stars; a mission pays out roughly one star per hundred
// points (see `starReward`), so a first ship upgrade is a few missions away and
// the Solid Gold paint job is something to save up for.
//
// Pure data and arithmetic — no DOM, no canvas — so the store screen, the
// game loop and the checks can all lean on the same numbers.

import { PLAYER_COLORS } from './art.js'
import { MAX_SLOTS } from './powers.js'

// ---------------------------------------------------------------- ships
//
// `stats` is read by the game when a mission starts:
//   speed     multiplier on movement speed (1 = Striker)
//   hitR      radius of the part of the ship a bullet has to touch (default 10)
//   lives     extra lives on top of the usual three
//   lifeShield  every life starts with a shield
//   twin      every laser is fired as a side-by-side pair
//   pierce    each laser passes through this many saucers before it stops
//   phoenix   once per mission a crash turns into a nova blast instead
export const SHIPS = [
  {
    id: 'striker',
    name: 'Striker',
    price: 0,
    blurb: 'The trusty all-rounder you start with.',
    perks: ['Balanced speed and firepower'],
    stats: {},
  },
  {
    id: 'comet',
    name: 'Comet',
    price: 600,
    blurb: 'A needle-nosed speedster that slips between bullets.',
    perks: ['+25% speed', 'Smaller target for bullets'],
    stats: { speed: 1.25, hitR: 7 },
  },
  {
    id: 'twinfang',
    name: 'Twinfang',
    price: 900,
    blurb: 'Two cannons side by side — twice the lasers.',
    perks: ['Every laser fires as a pair', 'A little slower'],
    stats: { twin: true, speed: 0.95 },
  },
  {
    id: 'bulwark',
    name: 'Bulwark',
    price: 1200,
    blurb: 'A flying fortress. Slow, but very hard to knock out.',
    perks: ['+1 life', 'Every life starts with a shield', '−15% speed, bigger target'],
    stats: { lives: 1, lifeShield: true, speed: 0.85, hitR: 12 },
  },
  {
    id: 'lancer',
    name: 'Lancer',
    price: 1600,
    blurb: 'Its lasers punch straight through a line of saucers.',
    perks: ['Lasers pierce 2 extra saucers'],
    stats: { pierce: 2 },
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    price: 2500,
    blurb: 'Legend says it cannot be stopped. Well — once.',
    perks: ['Once per mission, a crash becomes a nova blast'],
    stats: { phoenix: true },
  },
]

// ---------------------------------------------------------------- paint
//
// `team` is each player's own colour (P1 cyan, P2 pink). A pattern is drawn
// over the base colours by the ship art; `rainbow` and `galaxy` animate.
export const PAINTS = [
  { id: 'team', name: 'Team Colors', price: 0 },
  { id: 'ruby', name: 'Ruby', price: 150, colors: { main: '#ff4d5e', dark: '#9e1b2c', light: '#ffd3d8', flame: '#ff9a8a' } },
  { id: 'emerald', name: 'Emerald', price: 150, colors: { main: '#3ee08a', dark: '#16794a', light: '#d4ffe6', flame: '#8affc0' } },
  { id: 'sunburst', name: 'Sunburst', price: 200, colors: { main: '#ffb02e', dark: '#a35a00', light: '#fff0c2', flame: '#ffd27a' } },
  { id: 'midnight', name: 'Midnight', price: 200, colors: { main: '#6a6ff0', dark: '#262470', light: '#dadcff', flame: '#a5a8ff' } },
  { id: 'stripes', name: 'Racing Stripes', price: 300, pattern: 'stripes', colors: { main: '#f4f6ff', dark: '#3b4466', light: '#ffffff', flame: '#9ff0ff', accent: '#ff3b5c' } },
  { id: 'checker', name: 'Checker Flag', price: 300, pattern: 'checker', colors: { main: '#e9ecf5', dark: '#2a2d3a', light: '#ffffff', flame: '#ffe23d', accent: '#14161f' } },
  { id: 'camo', name: 'Space Camo', price: 350, pattern: 'camo', colors: { main: '#6f8a4f', dark: '#33421f', light: '#c9dba8', flame: '#c6ff8a', accent: '#a39260' } },
  { id: 'flames', name: 'Hot Rod Flames', price: 450, pattern: 'flames', colors: { main: '#2b2b3a', dark: '#14141e', light: '#7a7a95', flame: '#ff8a2e', accent: '#ff5a1f' } },
  { id: 'galaxy', name: 'Galaxy', price: 600, pattern: 'galaxy', colors: { main: '#4b2a99', dark: '#1a0f40', light: '#c9b3ff', flame: '#ff9ad3', accent: '#ffffff' } },
  { id: 'rainbow', name: 'Rainbow', price: 800, pattern: 'rainbow', colors: { main: '#ff5f8f', dark: '#7a2bbf', light: '#fff4c2', flame: '#9ff0ff' } },
  { id: 'gold', name: 'Solid Gold', price: 1500, pattern: 'gold', colors: { main: '#ffd54a', dark: '#9a6a00', light: '#fff6c9', flame: '#fff1a0', accent: '#ffffff' } },
]

// The colours a ship is drawn with: { id, name, main, dark, light, flame,
// accent, pattern }. `playerId` picks the team colour for `team`.
export function resolvePaint(paintId, playerId = 0) {
  const paint = PAINTS.find((p) => p.id === paintId) ?? PAINTS[0]
  const team = PLAYER_COLORS[playerId] ?? PLAYER_COLORS[0]
  const colors = paint.colors ?? team
  return {
    id: paint.id,
    name: paint.name,
    main: colors.main,
    dark: colors.dark,
    light: colors.light,
    flame: colors.flame,
    accent: colors.accent ?? colors.light,
    pattern: paint.pattern ?? null,
  }
}

// ---------------------------------------------------------------- upgrades
//
// Each upgrade has levels; `prices[i]` buys level i + 1.
export const UPGRADES = [
  {
    id: 'cargo',
    name: 'Cargo Bay',
    blurb: 'Room to carry more power-ups at once.',
    prices: [400, 900],
    describe: (lvl) => `${MAX_SLOTS + lvl} power-up slots`,
  },
  {
    id: 'armor',
    name: 'Hull Armor',
    blurb: 'Thicker plating: start every mission with extra lives.',
    prices: [400, 800, 1400],
    describe: (lvl) => (lvl ? `+${lvl} ${lvl === 1 ? 'life' : 'lives'}` : 'No armor'),
  },
  {
    id: 'magnet',
    name: 'Bubble Magnet',
    blurb: 'Pulls power-up bubbles toward your ship.',
    prices: [250, 500, 900],
    describe: (lvl) => ['No magnet', 'Small pull', 'Big pull', 'Super pull'][lvl],
  },
  {
    id: 'drones',
    name: 'Helper Drones',
    blurb: 'Little robots that fly beside you and shoot at saucers.',
    prices: [500, 1000, 1800],
    describe: (lvl) => ['No drones', '1 drone', '2 drones', '2 turbo drones'][lvl],
  },
]

// How far (world units) a magnet reaches, by level.
export const MAGNET_RADIUS = [0, 130, 200, 290]

// Drones by level: how many fly with each ship and how often each one fires.
export const DRONES = [
  { count: 0, delay: 0 },
  { count: 1, delay: 0.55 },
  { count: 2, delay: 0.55 },
  { count: 2, delay: 0.3 },
]

// ---------------------------------------------------------------- starter power-ups
//
// Owned starters are loaded into a ship's slots when a mission begins, at the
// level bought, and can be switched off in the store. Applied in this order, so
// with more starters than slots the shield is the one that stays.
export const STARTERS = [
  { id: 'speed', prices: [250, 500, 900] },
  { id: 'rapid', prices: [350, 700, 1200] },
  { id: 'triple', prices: [350, 700, 1200] },
  { id: 'shield', prices: [300, 600, 1000] },
]

// ---------------------------------------------------------------- stars
//
// What a finished run pays. Roughly a star per hundred points, cut by 15% for
// every ship lost along the way (never below a quarter of it), plus a bonus for
// actually clearing the mission. Losing still pays — just less.
export const DEATH_PENALTY = 0.15
export const MAX_PENALTY = 0.75

export function starReward({ score, deaths = 0, cleared = false, difficulty = 1 }) {
  const base = Math.max(0, Math.floor(score / 100))
  const penalty = Math.min(MAX_PENALTY, deaths * DEATH_PENALTY)
  const kept = Math.round(base * (1 - penalty))
  const clearBonus = cleared ? 20 + difficulty * 10 : 0
  return { base, deaths, penalty, kept, clearBonus, total: kept + clearBonus }
}

// What a ship flies with, from its hull and the hangar's upgrades.
export function loadout(save, playerId) {
  const equip = save.equip[playerId] ?? save.equip[0]
  const ship = SHIPS.find((s) => s.id === equip.ship) ?? SHIPS[0]
  const st = ship.stats
  const up = save.upgrades
  return {
    ship: ship.id,
    paint: resolvePaint(equip.paint, playerId),
    speed: st.speed ?? 1,
    hitR: st.hitR ?? 10,
    lives: 3 + (st.lives ?? 0) + (up.armor ?? 0),
    lifeShield: !!st.lifeShield,
    twin: !!st.twin,
    pierce: st.pierce ?? 0,
    phoenix: !!st.phoenix,
    slots: MAX_SLOTS + (up.cargo ?? 0),
    magnet: MAGNET_RADIUS[up.magnet ?? 0],
    drones: DRONES[up.drones ?? 0],
    starters: STARTERS.filter((s) => (save.starters[s.id] ?? 0) > 0 && save.startersOn[s.id] !== false).map((s) => ({
      type: s.id,
      level: save.starters[s.id],
    })),
  }
}
