// ── Highwind Aerie: light-boned, sharp-eyed, and seldom on the ground ──
// Plain data, normalised and checked by defineRace (data/schema.js). Names,
// shorts and weapon names appear in the battle log: change them only on
// purpose.
//
// (F5a, DESIGN §4.2.12) The bird-people. Most of them fly (`fly`: the nav's
// circle, over scenery and enemy units, landing where they can stand; no
// cover where they land, core/queries.js inCover), and the hunters among
// them dive (`swoop`: +chargeS to their melee weapon's Strength in the
// fight of the turn they charged, core/actions/fight.js; the card calls it
// Dive, since the Glider Wing's card already says Swoop of its darts). Each
// `cost` is a first guess, fitted at Skirmish against both older races by
// sim/army-sim.mjs before the race is offered (§4.2.8.2).
import { AURA } from '../../core/rules.js'

const FLY = 'Fly — moves over scenery and enemy units; never in cover.'

export default {
  key: 'bird', name: 'Highwind Aerie', short: 'Windfolk', icon: '\u{1F426}',
  look: { team: '#5a7cf0', dark: '#1c2a6e', alt: '#30c8a8', gore: ['#b84a3a', '#efe8d8'], voice: 'screech', models: 'bird', anim: 'bird' },
  army: ['skyseer', 'stormtalon', 'longbill', 'longbill', 'finch', 'kestrel', 'roc'],
  // (F11a) the army builder's order of the race's units, each once: a list
  // of counts (core/army.js) carries one digit per entry, in this order, so
  // the roster is append-only (a new unit goes at the end; data-check pins
  // its start). `army` above, the classic list, is in roster order. (F5b
  // appends the Sky-Basket; one Longbill squad, 6 models, fills it.)
  roster: ['skyseer', 'stormtalon', 'longbill', 'finch', 'kestrel', 'roc'],
  // the presets of the larger battles, as counts in roster order: the
  // classic list twice over for a Field battle, three times for a Grand one
  // (data/mission.js names them; sim/data-check.mjs holds each legal there)
  armies: { field: '224222', grand: '336333' },
  units: {
    longbill: {
      name: 'Longbill Pikes', short: 'Longbills', role: 'Troops', ai: 'line', models: 6, base: 0.32, pts: 9, cost: 65,
      stats: 'M6 WS3 BS4 S4 T3 W1 A1 Ld7 Sv4 OC2',
      ranged: { name: 'Flung quills', range: 10, shots: 1, S: 3, AP: 1, D: 1, fx: 'quill' },
      melee: { name: 'Long bills', S: 4, AP: 1, D: 1 },
      abilities: ['Wading line — the Aerie’s feet on the ground, beaks forward.'],
    },
    finch: {
      name: 'Finch Flock', short: 'Finches', role: 'Troops', ai: 'shooter', models: 6, base: 0.28, pts: 8, cost: 60, fly: true,
      stats: 'M10 WS4 BS4 S2 T2 W1 A1 Ld6 Sv6 OC1',
      ranged: { name: 'Pebble drops', range: 12, shots: 2, S: 3, AP: 0, D: 1, assault: true, fx: 'pebble' },
      melee: { name: 'Tiny beaks', S: 2, AP: 0, D: 1 },
      abilities: [FLY, 'Flit — may shoot after Advancing.'],
    },
    kestrel: {
      name: 'Kestrel Divers', short: 'Kestrels', role: 'Fast', ai: 'melee', models: 4, base: 0.32, pts: 16, cost: 55, fly: true, swoop: { chargeS: 2 },
      stats: 'M14 WS3 BS5 S3 T3 W1 A2 Ld7 Sv5 OC1',
      ranged: null,
      melee: { name: 'Hooked talons', S: 3, AP: 1, D: 1 },
      abilities: [FLY, 'Dive — +2 Strength in the fight on the turn it charges.'],
    },
    stormtalon: {
      name: 'Stormtalon Guard', short: 'Stormtalons', role: 'Elite', ai: 'melee', models: 3, base: 0.38, pts: 30, cost: 95, fly: true, swoop: { chargeS: 1 },
      stats: 'M12 WS3 BS5 S4 T4 W2 A3 Ld8 Sv4 OC1',
      ranged: null,
      melee: { name: 'War-talons', S: 4, AP: 2, D: 1 },
      abilities: [FLY, 'Dive — +1 Strength in the fight on the turn it charges.'],
    },
    roc: {
      name: 'Greatwing Roc', short: 'Roc', role: 'Monster', ai: 'melee', models: 1, base: 0.9, pts: 120, cost: 95, big: true, fly: true, swoop: { chargeS: 1 },
      stats: 'M12 WS3 BS6 S6 T6 W8 A4 Ld8 Sv4 OC3',
      ranged: null,
      melee: { name: 'Rending beak', S: 6, AP: 2, D: 2 },
      abilities: [FLY, 'Dive — +1 Strength in the fight on the turn it charges.', 'Vast — a blast catches it for D3+1 hits.'],
    },
    skyseer: {
      name: 'Skyseer Varra', short: 'Skyseer', role: 'Hero', ai: 'hero', models: 1, base: 0.42, pts: 80, cost: 60, hero: true, fly: true,
      stats: 'M10 WS3 BS3 S4 T4 W5 A3 Ld9 Sv5 OC1',
      // (V3c) three spells, one cast a shooting phase, the player's pick:
      // the first is her ranged weapon (data/schema.js)
      spells: [
        { name: 'Piercing Cry', spell: 7, range: 18, mesmerize: true, fx: 'cry' },
        { name: 'Down Mantle', spell: 5, range: 12, ward: true, fx: 'down' },
        { name: 'Gale', spell: 6, range: 18, snare: true, fx: 'gale' },
      ],
      melee: { name: 'Talon staff', S: 4, AP: 1, D: 2 },
      abilities: [FLY, 'Spells — casts one of the three above a turn, each on 2D6 ≥ its number; a target of the Cry can’t shoot or charge next turn and hits at −1 in melee.', `Far sight — friends within ${AURA}" use her Ld 9.`],
    },
  },
}
