// Balance data for Dino Trails: species (with roominess + market rarity),
// buildings, fences, and economy constants.

export const ECON = {
  startMoney: 2500,
  startFame: 40,
  ticket: 12,
  ticketMin: 6,
  ticketMax: 26,
  staffBase: 20,
  dayMs: 14000,
  fastMult: 3,
  bankruptcyAt: -3000,
  marketSlots: 3,
  marketRefreshDays: 5,
  // Support-system pressure: the gate shed feeds a small park for free;
  // beyond that, every mouthful without depot capacity costs a premium.
  baseFeedCapacity: 30,
  overflowFeedMult: 1.8,
  rangerCoverage: 2, // dangerous dinos (fer >= 3) per station
  treatCost: 250,
}

// minR: minimum cell inradius ("roominess") the species accepts.
// always: ranch stock, purchasable any time at list price.
// weight: odds in the rotating traveling-market slots (always-stock excluded).
// loves: terrain preference — neighbors of that terrain make it much happier.
export const SPECIES = {
  parasaur: {
    name: 'Parasaurolophus', icon: '🎺', cost: 450, food: 12,
    pop: 3, irr: 2, fer: 1, social: 'herd', minR: 1.2, always: true,
    desc: 'A cheerful honker. Fits almost anywhere and complains about nothing.',
  },
  stego: {
    name: 'Stegosaurus', icon: '🌵', cost: 900, food: 18,
    pop: 5, irr: 3, fer: 2, social: 'herd', minR: 1.6, always: true,
    desc: 'Slow, photogenic, needs a bit of lawn to trundle.',
  },
  pachy: {
    name: 'Pachycephalosaurus', icon: '🪨', cost: 750, food: 14,
    pop: 4, irr: 5, fer: 2, social: 'herd', minR: 1.2, weight: 0.18,
    desc: 'Headbutts fences, rocks, and occasionally opinions.',
  },
  anky: {
    name: 'Ankylosaurus', icon: '🛡️', cost: 1100, food: 20,
    pop: 6, irr: 3, fer: 2, social: 'herd', minR: 1.6, weight: 0.17,
    desc: 'A living tank with a club tail. Placid, until it is not.',
  },
  trike: {
    name: 'Triceratops', icon: '🦬', cost: 1400, food: 22,
    pop: 7, irr: 4, fer: 2, social: 'herd', minR: 1.8, weight: 0.15,
    desc: 'Grumpy alone, majestic in a herd. Wants real acreage.',
  },
  ptero: {
    name: 'Pteranodon', icon: '🪁', cost: 1600, food: 16,
    pop: 9, irr: 4, fer: 2, social: 'herd', minR: 1.3, weight: 0.13,
    desc: 'Circles its territory all day. Guests crane their necks; wallets open.',
  },
  dilo: {
    name: 'Dilophosaurus', icon: '🎭', cost: 2000, food: 26,
    pop: 8, irr: 6, fer: 3, social: 'solo', minR: 1.7, weight: 0.12,
    desc: 'Dramatic, venomous, lives alone by mutual agreement.',
  },
  raptor: {
    name: 'Velociraptor', icon: '🗡️', cost: 2800, food: 30,
    pop: 10, irr: 7, fer: 3, social: 'herd', minR: 1.5, weight: 0.1,
    desc: 'Clever girl. Tests fences daily; happier with the pack.',
  },
  carno: {
    name: 'Carnotaurus', icon: '😈', cost: 3400, food: 38,
    pop: 12, irr: 7, fer: 3, social: 'solo', minR: 1.9, weight: 0.07,
    desc: 'The horned sprinter. Fast, furious, photogenic.',
  },
  brachio: {
    name: 'Brachiosaurus', icon: '🌴', cost: 5200, food: 48,
    pop: 14, irr: 2, fer: 2, social: 'herd', minR: 3.5, weight: 0.05,
    desc: 'A four-story neck. Only the big back-country cells will do.',
  },
  spino: {
    name: 'Spinosaurus', icon: '🌊', cost: 6000, food: 55,
    pop: 16, irr: 6, fer: 4, social: 'solo', minR: 3.0, weight: 0.04, loves: 'water',
    desc: 'The sailed fisher-king. Miserable without a pond next door.',
  },
  trex: {
    name: 'T-Rex', icon: '👑', cost: 9000, food: 75,
    pop: 20, irr: 8, fer: 4, social: 'solo', minR: 3.3, weight: 0.04,
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
  depot: {
    name: 'Feed Depot', icon: '🌾', cost: 500, upkeep: 15,
    desc: 'Feeds 60 appetite. Beyond capacity, feed is imported at a heavy premium and dinos go hungry.',
  },
  ranger: {
    name: 'Ranger Station', icon: '🎯', cost: 600, upkeep: 24,
    desc: 'Covers 2 dangerous dinos: halves their escape risk and recaptures runaways within 2 days.',
  },
  generator: {
    name: 'Generator', icon: '🔌', cost: 800, upkeep: 20,
    desc: 'Powers electric fences (they idle at steel strength without it) and keeps stands open through outages.',
  },
  clinic: {
    name: 'Vet Clinic', icon: '🩺', cost: 550, upkeep: 16,
    desc: 'Sick dinosaurs are treated overnight for free. Without it, illness lingers or costs a call-out fee.',
  },
  survey: {
    name: 'Guest Services', icon: '🎪', cost: 400, upkeep: 10,
    desc: 'Surveys departing guests: unlocks the guest-mood report in the Books — who left hungry, empty-handed or uncomfortable.',
  },
  research: {
    name: 'Research Post', icon: '🔭', cost: 700, upkeep: 18,
    desc: 'Behavior scientists on staff: unlocks exact happiness readings for every dinosaur instead of keeper guesswork.',
  },
}

// Guests buy once per need, not at every stand they pass.
export const SALE = { kiosk: 6, gift: 9 }

export const DISASTERS = {
  outage: {
    name: 'Power Outage', icon: '⚡', days: 3,
    desc: 'Electric fences sag to steel and stands go dark — unless a generator hums.',
  },
  storm: {
    name: 'Thunderstorm', icon: '⛈️', days: 1,
    desc: 'Gale winds wreck gardens and keep guests home.',
  },
  heatwave: {
    name: 'Heatwave', icon: '🥵', days: 3,
    desc: 'Tempers grill. Dinos with a pond next door stay cool.',
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
