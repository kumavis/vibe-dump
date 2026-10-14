// Inventory items, starting kit and loot tables.

export const ITEMS = {
  pistolDart: { name: 'Pistol darts', max: 36 },
  rifleDart: { name: 'Rifle darts', max: 16 },
  rifleRound: { name: 'Rifle rounds', max: 20 },
  shell: { name: 'Shells', max: 16 },
  stone: { name: 'Stones', max: 8 },
  flare: { name: 'Flares', max: 5 },
  medkit: { name: 'Medkits', max: 4 },
  fuelcan: { name: 'Fuel can', max: 1, key: true },
  circuit: { name: 'Relay circuit board', max: 1, key: true },
}

export const START_KIT = {
  weapons: ['scanner', 'pistol'],
  items: { pistolDart: 12, stone: 5, flare: 1, medkit: 1 },
}

// Fixed caches placed at points of interest (see world/structures.js).
export const CACHES = {
  stationLocker: {
    weapons: ['rifle', 'hunting'],
    items: { rifleDart: 6, rifleRound: 5, flare: 2, medkit: 1, pistolDart: 6 },
    flag: 'stationLocker',
  },
  labArmory: {
    weapons: ['shotgun'],
    items: { shell: 6, rifleDart: 6, pistolDart: 12, medkit: 2 },
    flag: 'labArmory',
  },
  hangarCrate: { items: { fuelcan: 1, flare: 1 }, flag: 'hangarCrate' },
  relayHut: { items: { rifleDart: 6, medkit: 1, flare: 1 }, flag: 'relayHut' },
}

// Random supply crates scattered at towers and wrecks.
export const LOOT = [
  { w: 3, items: { pistolDart: 6 } },
  { w: 3, items: { rifleDart: 3 } },
  { w: 1.5, items: { shell: 4 } },
  { w: 1.5, items: { rifleRound: 3 } },
  { w: 2, items: { medkit: 1 } },
  { w: 2, items: { flare: 1, stone: 3 } },
]
