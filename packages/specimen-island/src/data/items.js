// Inventory items, starting kit and loot tables.

export const ITEMS = {
  pistolDart: { name: 'Pistol darts', max: 36 },
  rifleDart: { name: 'Rifle darts', max: 16 },
  rifleRound: { name: 'Rifle rounds', max: 20 },
  shell: { name: 'Shells', max: 16 },
  stone: { name: 'Stones', max: 8 },
  flare: { name: 'Flares', max: 5 },
  medkit: { name: 'Medkits', max: 4 },
  jumboDart: { name: 'Jumbo darts', max: 4 }, // jumbo syringe cartridges
  fuelcan: { name: 'Fuel can', max: 1, key: true },
  circuit: { name: 'Relay circuit board', max: 1, key: true },
}

export const START_KIT = {
  weapons: ['scanner', 'pistol', 'camera'],
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
  // the keeper's shed at Paddock C's gate; the Field Lab's cold store restocks
  // the darts while the lab has power
  jumboRack: { weapons: ['syringe'], items: { jumboDart: 4 }, flag: 'jumboSyringe' },
}

// Random supply crates scattered at towers and wrecks. A crate is packed when
// it is opened, from what the player can still carry: each entry with room in
// the pack is weighted by `w`, more so the emptier that stack is; ammunition
// for a gun not found yet (`for`) keeps just a fraction of `w` and no boost.
// `n` is the [min, max] amount.
export const LOOT = [
  { item: 'pistolDart', w: 3, n: [5, 9] },
  { item: 'rifleDart', w: 3, n: [3, 5], for: 'rifle' },
  { item: 'shell', w: 1.5, n: [3, 6], for: 'shotgun' },
  { item: 'rifleRound', w: 1.5, n: [3, 5], for: 'hunting' },
  { item: 'medkit', w: 2.2, n: [1, 2] },
  { item: 'flare', w: 1.6, n: [1, 2] },
  { item: 'stone', w: 1, n: [2, 4] },
]

export const CRATE = {
  picks: [2, 3], // different things in one crate
  lowBoost: 1.6, // extra weight for an empty stack vs a nearly full one
  unownedAmmo: 0.35, // weight factor (on `w`, no boost) for ammo of a gun not yet carried
  bundleKeep: 0.5, // a fixed bundle that fits less than this share of itself is topped up from LOOT
}
