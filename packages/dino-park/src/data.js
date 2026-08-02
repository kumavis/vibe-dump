// All game balance lives here: species, buildings, fences, ads, disasters.

export const GRID = { N: 7, PLOT: 6, GAP: 1.6 }
export const CELL = GRID.PLOT + GRID.GAP // center-to-center plot spacing
export const SPAN = GRID.N * CELL - GRID.GAP // edge-to-edge grid width

export const ECON = {
  startMoney: 3000,
  startRep: 50,
  ticketDefault: 10,
  staffBase: 25, // flat daily wages for gate staff
  dayMs: 12000, // one in-game day at 1x speed
  fastMult: 3,
  bankruptcyAt: -3000,
  debtWarningAt: -1000,
}

// Entrance sits south of this plot (row N-1, middle column).
export const GATE = { r: GRID.N - 1, c: Math.floor(GRID.N / 2) }

export const SPECIES = {
  parasaur: {
    name: 'Parasaurolophus', icon: '🎺', cost: 400, food: 12,
    pop: 3, irr: 2, fer: 1, social: 'herd',
    desc: 'A cheerful honker. Loves company, fears nothing, breaks nothing.',
  },
  stego: {
    name: 'Stegosaurus', icon: '🌵', cost: 800, food: 18,
    pop: 5, irr: 3, fer: 2, social: 'herd',
    desc: 'Walks slow, thinks slower. Those plates photograph beautifully.',
  },
  trike: {
    name: 'Triceratops', icon: '🛡️', cost: 1300, food: 22,
    pop: 7, irr: 4, fer: 2, social: 'herd',
    desc: 'A three-horned lawnmower. Grumpy alone, delightful in a herd.',
  },
  dilo: {
    name: 'Dilophosaurus', icon: '🎭', cost: 1800, food: 26,
    pop: 8, irr: 6, fer: 3, social: 'solo',
    desc: 'Dramatic, venomous, allergic to roommates. Guests adore the frills.',
  },
  raptor: {
    name: 'Velociraptor', icon: '🗡️', cost: 2600, food: 30,
    pop: 10, irr: 7, fer: 3, social: 'herd',
    desc: 'Clever girl. Keeps testing the fence. Happier hunting with the pack.',
  },
  brachio: {
    name: 'Brachiosaurus', icon: '🌴', cost: 4800, food: 48,
    pop: 14, irr: 2, fer: 2, social: 'herd',
    desc: 'A gentle four-story neck. Eats a fortune, earns a bigger one.',
  },
  trex: {
    name: 'T-Rex', icon: '👑', cost: 8500, food: 75,
    pop: 20, irr: 8, fer: 4, social: 'solo',
    desc: 'The main event. Demands electric fences and personal space.',
  },
}

export const FENCES = [
  { name: 'Wooden Rails', strength: 1, cost: 0, desc: 'Holds in the polite ones.' },
  { name: 'Chain-link', strength: 2, cost: 250, desc: 'Rattles, but holds.' },
  { name: 'Reinforced Steel', strength: 3, cost: 650, desc: 'Raptor-rated.' },
  { name: 'Electrified', strength: 4, cost: 1300, desc: 'T-Rex proof… while the power is on.' },
]

export const BUILDINGS = {
  paddock: {
    name: 'Paddock', icon: '🦕', cost: 250, upkeep: 5,
    desc: 'A fenced enclosure for up to 3 dinosaurs. Upgrade the fence as they get scarier.',
  },
  shack: {
    name: 'Snack Shack', icon: '🌭', cost: 400, upkeep: 25,
    desc: 'Sells Dino Dogs. Earns per visitor, up to 45 hungry guests a day.',
  },
  gift: {
    name: 'Gift Shop', icon: '🧸', cost: 700, upkeep: 35,
    desc: 'Plush raptors fly off the shelves. Earns per visitor, scales with fame.',
  },
  restroom: {
    name: 'Restroom', icon: '🚻', cost: 250, upkeep: 10,
    desc: 'Comfy guests tell their friends. Big reputation boost; each handles ~60 guests.',
  },
  garden: {
    name: 'Topiary Garden', icon: '🌳', cost: 150, upkeep: 5,
    desc: 'Calms dinosaurs in adjacent paddocks and prettifies the park.',
  },
  fountain: {
    name: 'Fountain Plaza', icon: '⛲', cost: 450, upkeep: 10,
    desc: 'Soothes adjacent dinos and shields them from heatwaves.',
  },
  generator: {
    name: 'Backup Generator', icon: '🔌', cost: 800, upkeep: 20,
    desc: 'Keeps electric fences and food stands humming through power outages.',
  },
  ranger: {
    name: 'Ranger Station', icon: '🎯', cost: 600, upkeep: 30,
    desc: 'Halves escape risk park-wide. Rangers recapture loose dinos within 2 days.',
  },
}

export const ADS = {
  flyers: {
    name: 'Flyer Blitz', icon: '📄', cost: 250, mult: 1.25, days: 3,
    desc: 'Interns staple posters to every lamppost in town.',
  },
  radio: {
    name: 'Radio Spots', icon: '📻', cost: 700, mult: 1.6, days: 4,
    desc: '"DINO PARK DINO PARK DINO PARK — this Sunday-Sunday-Sunday!"',
  },
  tv: {
    name: 'TV Campaign', icon: '📺', cost: 1800, mult: 2.2, days: 5, rep: 3,
    desc: 'A slow-motion brachiosaurus at golden hour. People weep.',
  },
}

export const DISASTERS = {
  outage: {
    name: 'Power Outage', icon: '⚡', days: 3,
    desc: 'Electric fences fail and stands go dark — unless a generator kicks in.',
  },
  storm: {
    name: 'Thunderstorm', icon: '⛈️', days: 1,
    desc: 'Gale winds wreck decorations and keep guests home.',
  },
  heatwave: {
    name: 'Heatwave', icon: '🥵', days: 3,
    desc: 'Cranky, sweaty dinosaurs. Fountains keep neighbors cool.',
  },
}

// How much a locked plot costs, by walking distance from the gate plot.
export function plotPrice(r, c) {
  const dist = Math.abs(r - GATE.r) + Math.abs(c - GATE.c)
  return 150 + dist * 70
}

export function fmtMoney(n) {
  const sign = n < 0 ? '-' : ''
  const v = Math.abs(Math.round(n))
  return `${sign}$${v.toLocaleString('en-US')}`
}

export function fmtShort(n) {
  const sign = n < 0 ? '-' : ''
  const v = Math.abs(n)
  if (v >= 1e6) return `${sign}$${(v / 1e6).toFixed(1)}m`
  if (v >= 10000) return `${sign}$${(v / 1000).toFixed(1)}k`
  return `${sign}$${Math.round(v).toLocaleString('en-US')}`
}
