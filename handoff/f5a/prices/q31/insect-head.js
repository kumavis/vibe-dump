// ── Deepdelve Hive: many, patient, and always nearer than they looked ──
// Plain data, normalised and checked by defineRace (data/schema.js). Names,
// shorts and weapon names appear in the battle log: change them only on
// purpose.
//
// (F5a, DESIGN §4.2.12) The insectoids. Two of their units burrow (`burrow`:
// their move is the nav's burrow mode, core/nav.js, which passes under walls,
// hedges, trees, crates, kegs and rough ground, never under rock or a
// fortification, and ends where a walker could stand), and the Delvers
// swarm (`swarm`: in the fight, while `min` of them still stand, their
// wound rolls of 1 are rolled again, core/actions/fight.js). Each `cost` is
// a first guess, fitted at Skirmish against both older races by
// sim/army-sim.mjs before the race is offered (§4.2.8.2).
import { AURA } from '../../core/rules.js'

const CLAWS = { name: 'Spur-claws', S: 3, AP: 0, D: 1 }

export default {
  key: 'insect', name: 'Deepdelve Hive', short: 'Hivekin', icon: '\u{1F41C}',
  look: { team: '#d23a9a', dark: '#5a1040', alt: '#e6c84a', gore: ['#8aa83a', '#d8d08a'], voice: 'chitter', models: 'insect', anim: 'insect' },
  army: ['hivemother', 'deepguard', 'spinethrower', 'spinethrower', 'delver', 'hopper', 'boilback'],
  // (F11a) the army builder's order of the race's units, each once: a list
  // of counts (core/army.js) carries one digit per entry, in this order, so
  // the roster is append-only (a new unit goes at the end; data-check pins
  // its start). `army` above, the classic list, is in roster order. (F5b
  // appends the Brood Beetle; its two Spinethrower squads, 12 models, fill
  // it, and the autoload takes them first, the Troops in roster order.)
  roster: ['hivemother', 'deepguard', 'spinethrower', 'delver', 'hopper', 'boilback'],
  // the presets of the larger battles, as counts in roster order: the
  // classic list twice over for a Field battle, three times for a Grand one
  // (data/mission.js names them; sim/data-check.mjs holds each legal there)
  armies: { field: '224222', grand: '336333' },
  units: {
    spinethrower: {
      name: 'Spinethrower Brood', short: 'Spinethrowers', role: 'Troops', ai: 'shooter', models: 6, base: 0.3, pts: 8, cost: 70,
      stats: 'M6 WS4 BS4 S3 T3 W1 A1 Ld6 Sv5 OC2',
      ranged: { name: 'Spine volleys', range: 15, shots: 2, S: 3, AP: 1, D: 1, fx: 'sting' },
      melee: CLAWS,
      abilities: ['Spine volleys — shorter than a slingshot, and they go through bark.'],
    },
    delver: {
      // (swarm's `min`: half the squad. Eight at base 0.25 make a disc of r
      // 1.011, inside the squads' 1.18 every lane is measured for.)
      name: 'Delver Swarm', short: 'Delvers', role: 'Troops', ai: 'line', models: 8, base: 0.25, pts: 6, cost: 70, burrow: true, swarm: { min: 4 },
      stats: 'M5 WS4 BS6 S3 T3 W1 A2 Ld6 Sv6 OC2',
      ranged: null,
      melee: { name: 'Digging claws', S: 3, AP: 0, D: 1 },
      abilities: [
        'Burrow — tunnels under walls, hedges, trees and rough ground (never rock, nor a fortification) and comes up where it can stand.',
        'Swarm — in a fight, re-rolls wound rolls of 1 while 4 or more of it still stand.',
      ],
    },
    deepguard: {
      name: 'Deepguard', short: 'Deepguard', role: 'Elite', ai: 'melee', models: 4, base: 0.36, pts: 24, cost: 100, burrow: true,
      stats: 'M5 WS3 BS5 S5 T5 W2 A2 Ld8 Sv3 OC1',
      ranged: null,
      melee: { name: 'Scythe forelegs', S: 5, AP: 2, D: 1 },
      abilities: ['Burrow — tunnels under walls, hedges, trees and rough ground (never rock, nor a fortification) and comes up where it can stand.', 'Old chitin — the Hive’s doorstep, and it bites.'],
    },
    hopper: {
      name: 'Hopper Lancers', short: 'Hoppers', role: 'Fast', ai: 'raider', models: 4, base: 0.3, pts: 14, cost: 55,
      stats: 'M10 WS3 BS4 S4 T3 W1 A2 Ld7 Sv5 OC1',
      ranged: { name: 'Barbed spines', range: 8, shots: 1, S: 4, AP: 1, D: 1, assault: true, fx: 'sting' },
      melee: { name: 'Leg-spurs', S: 4, AP: 1, D: 1 },
      abilities: ['Spring — may shoot after Advancing.'],
    },
    boilback: {
      name: 'Boilback Bombardier', short: 'Boilback', role: 'Artillery', ai: 'artillery', models: 1, base: 1.0, pts: 95, cost: 60, big: true,
      stats: 'M4 WS6 BS4 S3 T6 W7 A2 Ld7 Sv3 OC0',
      ranged: { name: 'Boiling glob', range: 30, shots: 1, blast: 2.6, S: 5, AP: 2, D: 1, indirect: true, heavy: true, scenery: 2, fx: 'glob' },
      melee: { name: 'Crushing legs', S: 4, AP: 0, D: 1 },
      abilities: ['Indirect — fires without line of sight at −1 to hit.', 'Heavy — −1 to hit after moving.', 'Scalding — whatever it lands on, it lands on hot.'],
    },
    hivemother: {
      name: 'Hivemother Kesh', short: 'Hivemother', role: 'Hero', ai: 'hero', models: 1, base: 0.45, pts: 85, cost: 60, hero: true,
      stats: 'M5 WS3 BS3 S5 T5 W5 A3 Ld9 Sv4 OC1',
      // (V3c) three spells, one cast a shooting phase, the player's pick:
      // the first is her ranged weapon (data/schema.js)
      spells: [
        { name: 'Upwelling', spell: 6, range: 18, shots: 1, blast: 2.4, S: 4, AP: 1, D: 1, scenery: 2, fx: 'mandibles' },
        { name: 'Hive Hum', spell: 5, range: 12, resolve: true, fx: 'hum' },
        { name: 'Resin Snare', spell: 7, range: 18, snare: true, fx: 'resin' },
      ],
      melee: { name: 'Queenly mandibles', S: 5, AP: 2, D: 2 },
      abilities: ['Spells — casts one of the three above a turn, each on 2D6 ≥ its number; Upwelling erupts under the target, no scatter.', `Hive-song — friends within ${AURA}" use her Ld 9.`],
    },
  },
}
