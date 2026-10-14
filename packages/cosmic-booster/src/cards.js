// The set: ten cosmic features that can turn up in any pack, and the black hole
// every pack ends on. Figures are real (rounded); `cf.` names the object each
// card's art is modelled on.

export const SET_NAME = 'Cosmos'
export const SET_SERIES = 'Series I'
export const SET_SIZE = 11

export const RARITY = {
  common: { label: 'Common', glyph: '●', rank: 0 },
  uncommon: { label: 'Uncommon', glyph: '◆', rank: 1 },
  rare: { label: 'Rare', glyph: '★', rank: 2 },
  holo: { label: 'Holo Rare', glyph: '✦', rank: 3 },
}

export const CARDS = [
  {
    id: 'nebula',
    no: 1,
    name: 'Stellar Nursery',
    type: 'Emission Nebula',
    cf: 'cf. M42, Orion',
    rarity: 'common',
    accent: '#ff5d8f',
    stats: [
      ['Distance', '1,344 ly'],
      ['Span', '24 ly'],
      ['Newborn stars', '~2,800'],
    ],
    flavor: 'Where gas and gravity braid new suns out of the dark.',
  },
  {
    id: 'pulsar',
    no: 2,
    name: 'Pulsar',
    type: 'Neutron Star',
    cf: 'cf. Crab Pulsar',
    rarity: 'rare',
    accent: '#7fc8ff',
    stats: [
      ['Distance', '6,500 ly'],
      ['Spin', '30 turns / s'],
      ['Diameter', '~20 km'],
    ],
    flavor: 'A dead star’s heart, still ticking thirty times a second.',
  },
  {
    id: 'ringed',
    no: 3,
    name: 'Ringed Giant',
    type: 'Gas Giant',
    cf: 'cf. Saturn',
    rarity: 'uncommon',
    accent: '#f0c27a',
    stats: [
      ['Light-time', '~80 min'],
      ['Ring span', '280,000 km'],
      ['Ring depth', '~10 m'],
    ],
    flavor: 'Ice ground to glitter, laid in a ring a few metres thick.',
  },
  {
    id: 'supernova',
    no: 4,
    name: 'Supernova',
    type: 'Stellar Explosion',
    cf: 'cf. SN 1054',
    rarity: 'rare',
    accent: '#ff9a4d',
    stats: [
      ['Seen by day', '23 days'],
      ['Debris speed', '1,500 km/s'],
      ['Leaves behind', 'a pulsar'],
    ],
    flavor: 'Song astronomers logged a guest star bright enough to see by day.',
  },
  {
    id: 'galaxy',
    no: 5,
    name: 'Spiral Galaxy',
    type: 'Grand-Design Spiral',
    cf: 'cf. M51, Whirlpool',
    rarity: 'uncommon',
    accent: '#9fb6ff',
    stats: [
      ['Distance', '31 million ly'],
      ['Diameter', '76,000 ly'],
      ['Companion', 'NGC 5195'],
    ],
    flavor: 'Two arms, one embrace — a neighbour’s pull winds the whirl tight.',
  },
  {
    id: 'comet',
    no: 6,
    name: 'Comet',
    type: 'Icy Wanderer',
    cf: 'cf. Hale–Bopp',
    rarity: 'common',
    accent: '#6ff2c0',
    stats: [
      ['Nucleus', '~60 km'],
      ['Orbit', '~2,500 yr'],
      ['Naked-eye', '18 months'],
    ],
    flavor: 'A snowball older than the Earth, unravelling into two tails.',
  },
  {
    id: 'binary',
    no: 7,
    name: 'Binary Star',
    type: 'Mass-Transfer Pair',
    cf: 'cf. Beta Lyrae',
    rarity: 'uncommon',
    accent: '#ff8a5c',
    stats: [
      ['Distance', '~960 ly'],
      ['Orbit', '12.9 days'],
      ['Stars', '2, sharing'],
    ],
    flavor: 'One star pours itself across the gap, and the other drinks.',
  },
  {
    id: 'planetary',
    no: 8,
    name: 'Planetary Nebula',
    type: 'Dying Star’s Shell',
    cf: 'cf. M57, Ring',
    rarity: 'rare',
    accent: '#54d6ff',
    stats: [
      ['Distance', '~2,500 ly'],
      ['Diameter', '~1 ly'],
      ['Ember', '125,000 K'],
    ],
    flavor: 'The Sun’s own future: a cast-off shell round a white-hot ember.',
  },
  {
    id: 'cluster',
    no: 9,
    name: 'Star Cluster',
    type: 'Open Cluster',
    cf: 'cf. Pleiades, M45',
    rarity: 'common',
    accent: '#8fb4ff',
    stats: [
      ['Distance', '444 ly'],
      ['Age', '~100 million yr'],
      ['Members', '1,000+'],
    ],
    flavor: 'Seven sisters to the eye; a thousand siblings to the telescope.',
  },
  {
    id: 'quasar',
    no: 10,
    name: 'Quasar',
    type: 'Active Galactic Nucleus',
    cf: 'cf. 3C 273',
    rarity: 'rare',
    accent: '#c58bff',
    stats: [
      ['Distance', '2.4 billion ly'],
      ['Output', '4 trillion Suns'],
      ['Jet length', '~200,000 ly'],
    ],
    flavor: 'A galaxy’s core outshining the galaxy: a black hole at supper.',
  },
  {
    id: 'blackhole',
    no: 11,
    name: 'Black Hole',
    type: 'Event Horizon',
    cf: 'Holographic chase card',
    rarity: 'holo',
    accent: '#ffcf7a',
    fullArt: true,
    stats: [
      ['Escape speed', '> light'],
      ['Photon sphere', '1.5 r_s'],
      ['Last stable orbit', '3 r_s'],
    ],
    flavor: 'Not a thing but a place, where every path leads inward — even light’s.',
  },
]

export const BY_ID = Object.fromEntries(CARDS.map((c) => [c.id, c]))
export const CHASE = BY_ID.blackhole
export const POOL = CARDS.filter((c) => c !== CHASE)
export const PACK_SIZE = 8

// A pack: seven of the ten, rarest last so the reveal builds, then the chase
// card. Each pull gets its own seed (the art re-rolls palette and layout off
// it), a print number, and a small chance of a foil "starlight" treatment.
export function drawPack(rand = Math.random) {
  const pool = POOL.slice()
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  const picked = pool.slice(0, PACK_SIZE - 1)
  picked.sort((a, b) => RARITY[a.rarity].rank - RARITY[b.rarity].rank || rand() - 0.5)
  const pulls = picked.map((def) => ({
    def,
    seed: rand(),
    print: 1 + Math.floor(rand() * 999),
    foil: RARITY[def.rarity].rank >= 2 ? rand() < 0.45 : rand() < 0.12,
  }))
  pulls.push({ def: CHASE, seed: 0.5, print: 1 + Math.floor(rand() * 250), foil: true })
  return pulls
}
