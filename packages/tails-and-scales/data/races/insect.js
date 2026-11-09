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
// fitted at Skirmish against both older races by sim/army-sim.mjs
// (§4.2.8.2), after the balance (DESIGN §4.2.12 Q31) moved the stats marked
// (Q31) below: the fit's seeds 1111, 2222 and 3333 pooled (N 7,200 a pair),
// the I–W pair's fit the check, the table judged on 1111 and 5555 (N 2,400
// a pair each), each unit's figures beside it.
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
      // (F5a, fitted: 73 ± 3 against the Bushtails, 73 ± 3 against the
      // Serpents, so 75 (band 15), the Windfolk 84 ± 3; judged 70 ± 5, 74 ± 5
      // and 88 ± 5 on 1111, 82 ± 6, 78 ± 5 and 75 ± 5 on 5555, in band each)
      name: 'Spinethrower Brood', short: 'Spinethrowers', role: 'Troops', ai: 'shooter', models: 6, base: 0.3, pts: 8, cost: 75,
      // (Q31) OC 2 -> 3: a climber that holds the works' objectives the burrowers can't reach (the balance's probes)
      stats: 'M6 WS4 BS4 S3 T3 W1 A1 Ld6 Sv5 OC3',
      ranged: { name: 'Spine volleys', range: 15, shots: 2, S: 3, AP: 1, D: 1, fx: 'sting' },
      melee: CLAWS,
      abilities: ['Spine volleys — shorter than a slingshot, and they go through bark.'],
    },
    delver: {
      // (swarm's `min`: half the squad. Eight at base 0.25 make a disc of r
      // 1.011, inside the squads' 1.18 every lane is measured for.)
      // (Q30) ai 'melee', not 'line': a swarm whose rule is a melee re-roll seeks the fight.
      // (Q31) S 3 -> 4 (and the claws'), A 2 -> 3, Sv 6 -> 4, W 1 -> 2, pts 6 -> 10: a blast took
      // the whole squad (84% of the Delvers fielded died, most to templates); W2 is what lifts the fit (55 -> 80-90)
      // and makes the points, not the 36 models, bind the Hive's lists (888 of 1,000)
      // (F5a, fitted: 82 ± 4 and 86 ± 4, the mean 84, the Windfolk 89 ± 4; at
      // 85 the models still bind 235 to 364 of 1,000 lists, so 90 (band 18),
      // inside the band; judged 85 ± 6, 81 ± 6, 91 ± 6 on 1111 and 96 ± 7,
      // 89 ± 6, 84 ± 6 on 5555, in band each)
      name: 'Delver Swarm', short: 'Delvers', role: 'Troops', ai: 'melee', models: 8, base: 0.25, pts: 10, cost: 90, burrow: true, swarm: { min: 4 },
      stats: 'M5 WS4 BS6 S4 T3 W2 A3 Ld6 Sv4 OC2',
      ranged: null,
      melee: { name: 'Digging claws', S: 4, AP: 0, D: 1 },
      abilities: [
        'Burrow — tunnels under walls, hedges, trees and rough ground (never rock, nor a fortification) and comes up where it can stand.',
        'Swarm — in a fight, re-rolls wound rolls of 1 while 4 or more of it still stand.',
      ],
    },
    deepguard: {
      // (F5a, fitted: 81 ± 4 and 74 ± 3, so 75 (band 15), the Windfolk 64 ±
      // 3; judged 75 ± 5, 76 ± 5, 69 ± 6 on 1111; on 5555 94 ± 7 against the
      // Bushtails, outside its band, 77 ± 6 and 62 ± 6)
      name: 'Deepguard', short: 'Deepguard', role: 'Elite', ai: 'melee', models: 4, base: 0.36, pts: 24, cost: 75, burrow: true,
      // (Q31) Sv 3 -> 4: the burrowers' weight moved off the classic board, where they pass under everything
      stats: 'M5 WS3 BS5 S5 T5 W2 A2 Ld8 Sv4 OC1',
      ranged: null,
      melee: { name: 'Scythe forelegs', S: 5, AP: 2, D: 1 },
      abilities: ['Burrow — tunnels under walls, hedges, trees and rough ground (never rock, nor a fortification) and comes up where it can stand.', 'Old chitin — the Hive’s doorstep, and it bites.'],
    },
    hopper: {
      // (F5a, fitted: 70 ± 3 and 73 ± 3, the mean 71.5, the Windfolk 72 ± 3;
      // priced 65 (band 13), the fit's lower 5, for the Hive's fortified
      // battles, where 4444 had it short; judged 66 ± 5, 61 ± 5 on 1111 and
      // 66 ± 5 against the Serpents on 5555, but 83 ± 6 against the Windfolk
      // on 1111 and 78 ± 6 against the Bushtails on 5555, outside its band:
      // the fit's 70 would have held both)
      name: 'Hopper Lancers', short: 'Hoppers', role: 'Fast', ai: 'raider', models: 4, base: 0.3, pts: 14, cost: 65,
      // (Q31) T 3 -> 4, Sv 5 -> 4, OC 1 -> 2: 97% of them died, most to shooting, for 58 kills in 120 battles
      stats: 'M10 WS3 BS4 S4 T4 W1 A2 Ld7 Sv4 OC2',
      ranged: { name: 'Barbed spines', range: 8, shots: 1, S: 4, AP: 1, D: 1, assault: true, fx: 'sting' },
      melee: { name: 'Leg-spurs', S: 4, AP: 1, D: 1 },
      abilities: ['Spring — may shoot after Advancing.'],
    },
    boilback: {
      // (F5a, fitted: 39 ± 4 and 47 ± 4, so 45 (band 14), the Windfolk 59 ±
      // 4; judged 44 ± 7, 51 ± 7, 51 ± 7 on 1111 and 39 ± 8, 35 ± 7, 58 ± 7
      // on 5555, in band each)
      name: 'Boilback Bombardier', short: 'Boilback', role: 'Artillery', ai: 'artillery', models: 1, base: 1.0, pts: 95, cost: 45, big: true,
      stats: 'M4 WS6 BS4 S3 T6 W7 A2 Ld7 Sv3 OC0',
      ranged: { name: 'Boiling glob', range: 30, shots: 1, blast: 2.6, S: 5, AP: 2, D: 1, indirect: true, heavy: true, scenery: 2, fx: 'glob' },
      melee: { name: 'Crushing legs', S: 4, AP: 0, D: 1 },
      abilities: ['Indirect — fires without line of sight at −1 to hit.', 'Heavy — −1 to hit after moving.', 'Scalding — whatever it lands on, it lands on hot.'],
    },
    hivemother: {
      // (F5a) at 60, as the older heroes: the fit's race-level edge is -2.2 ±
      // 28.6 points against the Bushtails and -2.9 ± 25.9 against the
      // Serpents, so no handicap; the classic list costs 485
      name: 'Hivemother Kesh', short: 'Hivemother', role: 'Hero', ai: 'hero', models: 1, base: 0.45, pts: 85, cost: 60, hero: true,
      stats: 'M5 WS3 BS3 S5 T5 W5 A3 Ld9 Sv4 OC1',
      // (V3c) three spells, one cast a shooting phase, the player's pick:
      // the first is her ranged weapon (data/schema.js)
      spells: [
        // (Q31) S 4 -> 5, AP 1 -> 2: Upwelling strikes as the Elder's Thornburst does
        { name: 'Upwelling', spell: 6, range: 18, shots: 1, blast: 2.4, S: 5, AP: 2, D: 1, scenery: 2, fx: 'mandibles' },
        { name: 'Hive Hum', spell: 5, range: 12, resolve: true, fx: 'hum' },
        { name: 'Resin Snare', spell: 7, range: 18, snare: true, fx: 'resin' },
      ],
      melee: { name: 'Queenly mandibles', S: 5, AP: 2, D: 2 },
      abilities: ['Spells — casts one of the three above a turn, each on 2D6 ≥ its number; Upwelling erupts under the target, no scatter.', `Hive-song — friends within ${AURA}" use her Ld 9.`],
    },
  },
}
