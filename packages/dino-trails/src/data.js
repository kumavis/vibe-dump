// Balance data for Dino Trails: species (with roominess + market rarity),
// buildings, fences, and economy constants.

export const ECON = {
  startMoney: 2500,
  startFame: 40,
  ticket: 12,
  staffBase: 20,
  dayMs: 14000,
  fastMult: 3,
  bankruptcyAt: -3000,
  marketSlots: 3,
  marketRefreshDays: 5,
}

// minR: minimum cell inradius ("roominess") the species accepts.
// weight: market appearance odds — rare dinos are events, not catalog items.
export const SPECIES = {
  parasaur: {
    name: 'Parasaurolophus', icon: '🎺', cost: 450, food: 12,
    pop: 3, irr: 2, fer: 1, social: 'herd', minR: 1.4, weight: 0.22,
    desc: 'A cheerful honker. Fits almost anywhere and complains about nothing.',
  },
  stego: {
    name: 'Stegosaurus', icon: '🌵', cost: 900, food: 18,
    pop: 5, irr: 3, fer: 2, social: 'herd', minR: 2.0, weight: 0.18,
    desc: 'Slow, photogenic, needs a bit of lawn to trundle.',
  },
  trike: {
    name: 'Triceratops', icon: '🛡️', cost: 1400, food: 22,
    pop: 7, irr: 4, fer: 2, social: 'herd', minR: 2.2, weight: 0.16,
    desc: 'Grumpy alone, majestic in a herd. Wants real acreage.',
  },
  dilo: {
    name: 'Dilophosaurus', icon: '🎭', cost: 2000, food: 26,
    pop: 8, irr: 6, fer: 3, social: 'solo', minR: 2.0, weight: 0.14,
    desc: 'Dramatic, venomous, lives alone by mutual agreement.',
  },
  raptor: {
    name: 'Velociraptor', icon: '🗡️', cost: 2800, food: 30,
    pop: 10, irr: 7, fer: 3, social: 'herd', minR: 1.8, weight: 0.13,
    desc: 'Clever girl. Tests fences daily; happier with the pack.',
  },
  brachio: {
    name: 'Brachiosaurus', icon: '🌴', cost: 5200, food: 48,
    pop: 14, irr: 2, fer: 2, social: 'herd', minR: 3.2, weight: 0.09,
    desc: 'A four-story neck. Only the big back-country cells will do.',
  },
  trex: {
    name: 'T-Rex', icon: '👑', cost: 9000, food: 75,
    pop: 20, irr: 8, fer: 4, social: 'solo', minR: 3.0, weight: 0.08,
    desc: 'The main event. Demands room, solitude and electric fencing.',
  },
}

export const FENCES = [
  { name: 'Timber', strength: 1, cost: 0, desc: 'Holds in the polite ones.' },
  { name: 'Steel', strength: 3, cost: 500, desc: 'Raptor-rated.' },
  { name: 'Electrified', strength: 4, cost: 1200, desc: 'T-Rex proof.' },
]

export const BUILDINGS = {
  paddock: {
    name: 'Paddock', icon: '🦕', cost: 200, upkeep: 5,
    desc: 'Fence the whole cell. Bigger cells hold bigger dinos — and more of them.',
  },
  kiosk: {
    name: 'Snack Kiosk', icon: '🌭', cost: 350, upkeep: 18,
    desc: 'Earns per guest walking the adjacent trails. Placement is everything.',
  },
  gift: {
    name: 'Gift Stand', icon: '🧸', cost: 650, upkeep: 28,
    desc: 'Bigger margins than snacks, hungrier for foot traffic.',
  },
  garden: {
    name: 'Garden', icon: '🌳', cost: 150, upkeep: 4,
    desc: 'Calms neighboring dinosaurs and nudges park fame.',
  },
  restroom: {
    name: 'Restroom', icon: '🚻', cost: 250, upkeep: 8,
    desc: 'Comfy guests spread the word. Fame insurance.',
  },
}

export const TERRAIN = {
  meadow: { name: 'Meadow', color: 0x92cf6b, priceMult: 1.0 },
  forest: { name: 'Forest', color: 0x5da05a, priceMult: 1.1 },
  rock: { name: 'Rocky', color: 0xb8ab90, priceMult: 0.7 },
  water: { name: 'Pond', color: 0x6fc8e8, priceMult: 0 },
}

// Dynamic land pricing: size + terrain + yesterday's adjacent footfall.
export function cellPrice(cell, traffic = 0) {
  return Math.round((60 + cell.area * 7 + traffic * 2.5) * TERRAIN[cell.terrain].priceMult)
}

export function fmtMoney(n) {
  const sign = n < 0 ? '-' : ''
  return `${sign}$${Math.abs(Math.round(n)).toLocaleString('en-US')}`
}

export function fmtShort(n) {
  const sign = n < 0 ? '-' : ''
  const v = Math.abs(n)
  if (v >= 1e6) return `${sign}$${(v / 1e6).toFixed(1)}m`
  if (v >= 10000) return `${sign}$${(v / 1000).toFixed(1)}k`
  return `${sign}$${Math.round(v).toLocaleString('en-US')}`
}
