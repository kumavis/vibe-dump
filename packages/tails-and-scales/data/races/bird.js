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
// `cost` is fitted at Skirmish against both older races by
// sim/army-sim.mjs (§4.2.8.2), after the balance (DESIGN §4.2.12 Q31) moved
// the stat marked (Q31) below: the fit's seeds 1111, 2222 and 3333 pooled
// (N 7,200 a pair), the I–W pair's fit the check, the table judged on 1111
// and 5555 (N 2,400 a pair each), each unit's figures beside it.
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
      // (F5a, fitted: 65 ± 3 against the Bushtails, 66 ± 3 against the
      // Serpents, so 65 (band 13), the Hivekin 59 ± 3; judged 63 ± 5, 68 ± 4,
      // 57 ± 5 on 1111 and 66 ± 4, 62 ± 5, 62 ± 5 on 5555, in band each)
      name: 'Longbill Pikes', short: 'Longbills', role: 'Troops', ai: 'line', models: 6, base: 0.32, pts: 9, cost: 65,
      stats: 'M6 WS3 BS4 S4 T3 W1 A1 Ld7 Sv4 OC2',
      ranged: { name: 'Flung quills', range: 10, shots: 1, S: 3, AP: 1, D: 1, fx: 'quill' },
      melee: { name: 'Long bills', S: 4, AP: 1, D: 1 },
      abilities: ['Wading line — the Aerie’s feet on the ground, beaks forward.'],
    },
    finch: {
      // (F5a, fitted: 44 ± 2 and 50 ± 2, the mean 47, the Hivekin 47 ± 2; at
      // 45 4444's check had it 54 ± 4 against the Serpents, outside its band,
      // so 50 (band 10); judged 49 ± 4, 53 ± 4 on 1111 and 43 ± 4, 49 ± 4,
      // 45 ± 4 on 5555, in band, but 35 ± 4 against the Hivekin on 1111)
      name: 'Finch Flock', short: 'Finches', role: 'Troops', ai: 'shooter', models: 6, base: 0.28, pts: 8, cost: 50, fly: true,
      stats: 'M10 WS4 BS4 S2 T2 W1 A1 Ld6 Sv6 OC1',
      ranged: { name: 'Pebble drops', range: 12, shots: 2, S: 3, AP: 0, D: 1, assault: true, fx: 'pebble' },
      melee: { name: 'Tiny beaks', S: 2, AP: 0, D: 1 },
      abilities: [FLY, 'Flit — may shoot after Advancing.'],
    },
    kestrel: {
      // (F5a, fitted: 42 ± 2 and 52 ± 2, the mean 47, so 45 (band 9), the
      // Hivekin 51 ± 3; judged 44 ± 4, 46 ± 4 on 1111 and 52 ± 4, 54 ± 4,
      // 54 ± 4 on 5555, in band, but 55 ± 4 against the Serpents on 1111)
      name: 'Kestrel Divers', short: 'Kestrels', role: 'Fast', ai: 'melee', models: 4, base: 0.32, pts: 16, cost: 45, fly: true, swoop: { chargeS: 2 },
      stats: 'M14 WS3 BS5 S3 T3 W1 A2 Ld7 Sv5 OC1',
      ranged: null,
      melee: { name: 'Hooked talons', S: 3, AP: 1, D: 1 },
      abilities: [FLY, 'Dive — +2 Strength in the fight on the turn it charges.'],
    },
    stormtalon: {
      // (F5a, fitted at A2: 94 ± 4 and 80 ± 4, the mean 87, so 85 (band 17),
      // the Hivekin 75 ± 4; judged 93 ± 6, 74 ± 5, 72 ± 6 on 1111 and 94 ± 5,
      // 82 ± 6, 81 ± 6 on 5555, in band each)
      name: 'Stormtalon Guard', short: 'Stormtalons', role: 'Elite', ai: 'melee', models: 3, base: 0.38, pts: 30, cost: 85, fly: true, swoop: { chargeS: 1 },
      // (Q31) A 3 -> 2: at A3 the Aerie scored 57% and 69% against the Bushtails (round 1, 4444), the Stormtalons fitting 116 ± 3
      stats: 'M12 WS3 BS5 S4 T4 W2 A2 Ld8 Sv4 OC1',
      ranged: null,
      melee: { name: 'War-talons', S: 4, AP: 2, D: 1 },
      abilities: [FLY, 'Dive — +1 Strength in the fight on the turn it charges.'],
    },
    roc: {
      // (F5a, fitted: 97 ± 4 and 103 ± 4, the mean 100, but the Hivekin's
      // 128 ± 5 (and 139 ± 8 on 4444's check) lie outside 100's band, so 120
      // (band 24), inside all three; judged 100 ± 8, 106 ± 7, 117 ± 8 on 1111
      // and 111 ± 7, 100 ± 8, 127 ± 8 on 5555, in band each)
      name: 'Greatwing Roc', short: 'Roc', role: 'Monster', ai: 'melee', models: 1, base: 0.9, pts: 120, cost: 120, big: true, fly: true, swoop: { chargeS: 1 },
      stats: 'M12 WS3 BS6 S6 T6 W8 A4 Ld8 Sv4 OC3',
      ranged: null,
      melee: { name: 'Rending beak', S: 6, AP: 2, D: 2 },
      abilities: [FLY, 'Dive — +1 Strength in the fight on the turn it charges.', 'Vast — a blast catches it for D3+1 hits.'],
    },
    skyseer: {
      // (F5a) 70, above the older heroes' 60: the fit's race-level edge is
      // -60.7 ± 25.9 points against the Bushtails and -24.8 ± 24.5 against the
      // Serpents (the Aerie's), and 70 is as far as the classic list's 500 lets
      // the handicap go
      name: 'Skyseer Varra', short: 'Skyseer', role: 'Hero', ai: 'hero', models: 1, base: 0.42, pts: 80, cost: 70, hero: true, fly: true,
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
