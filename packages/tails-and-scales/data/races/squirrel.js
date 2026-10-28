// ── Bushtail Clans: quick, many, and very fond of things that go bang ──
// Plain data, normalised and checked by defineRace (data/schema.js). Names,
// shorts and weapon names appear in the battle log: change them only on
// purpose.
import { AURA } from '../../core/rules.js'

const KNIVES = { name: 'Twig knives', S: 3, AP: 0, D: 1 }

export default {
  key: 'squirrel', name: 'Bushtail Clans', short: 'Bushtails', icon: '\u{1F43F}\uFE0F',
  look: { team: '#ec8a34', dark: '#7a3d12', alt: '#c75ad6', gore: ['#cf6d2a', '#f1dcb5'], voice: 'squeak', models: 'squirrel', anim: 'squirrel' },
  army: ['elder', 'oakguard', 'nutkin', 'nutkin', 'grenadier', 'glider', 'trebuchet'],
  // (F11a) the army builder's order of the race's units, each once: a list
  // of counts (core/army.js) carries one digit per entry, in this order, so
  // the roster is append-only (a new unit goes at the end; data-check pins
  // its start). `army` above, the classic list, is in roster order.
  roster: ['elder', 'oakguard', 'nutkin', 'grenadier', 'glider', 'trebuchet'],
  // (F8b) the presets of the larger battles, as counts in roster order: the
  // classic list twice over for a Field battle, three times for a Grand one
  // (data/mission.js names them; sim/data-check.mjs holds each legal there)
  armies: { field: '224222', grand: '336333' },
  units: {
    nutkin: {
      name: 'Nutkin Skirmishers', short: 'Nutkin', role: 'Troops', ai: 'shooter', models: 6, base: 0.3, pts: 7, cost: 75,
      stats: 'M7 WS4 BS4 S3 T3 W1 A1 Ld6 Sv6 OC2',
      ranged: { name: 'Slingshots', range: 18, shots: 2, S: 3, AP: 0, D: 1, assault: true, fx: 'acorn' },
      melee: KNIVES,
      abilities: ['Scurry — may shoot after Advancing.'],
    },
    grenadier: {
      name: 'Acorn Grenadiers', short: 'Grenadiers', role: 'Troops', ai: 'shooter', models: 5, base: 0.3, pts: 11, cost: 65,
      stats: 'M6 WS4 BS4 S3 T3 W1 A1 Ld7 Sv5 OC1',
      ranged: { name: 'Blasting acorns', range: 12, shots: 2, blast: 1.6, S: 4, AP: 1, D: 1, scenery: 1, fx: 'bomb' },
      melee: KNIVES,
      abilities: ['Blast — lobs 2 templates; a miss scatters D6+1".'],
    },
    oakguard: {
      name: 'Oak Guard', short: 'Oak Guard', role: 'Elite', ai: 'melee', models: 5, base: 0.34, pts: 22, cost: 105,
      stats: 'M5 WS3 BS5 S4 T4 W2 A2 Ld8 Sv3 OC1',
      ranged: null,
      melee: { name: 'Pinecone halberds', S: 5, AP: 2, D: 1 },
      abilities: ['Bark shields — the clan’s anvil. No guns, all heart.'],
    },
    glider: {
      name: 'Glider Wing', short: 'Gliders', role: 'Fast', ai: 'raider', models: 4, base: 0.32, pts: 15, cost: 55, fly: true,
      stats: 'M12 WS3 BS4 S3 T3 W1 A2 Ld7 Sv5 OC1',
      ranged: { name: 'Thorn darts', range: 10, shots: 2, S: 3, AP: 1, D: 1, assault: true, fx: 'dart' },
      melee: { name: 'Hooked claws', S: 4, AP: 1, D: 1 },
      abilities: ['Fly — moves over scenery and enemy units.', 'Swoop — may shoot after Advancing.'],
    },
    trebuchet: {
      name: 'Pinecone Trebuchet', short: 'Trebuchet', role: 'Artillery', ai: 'artillery', models: 1, base: 1.05, pts: 95, cost: 50, big: true,
      stats: 'M3 WS6 BS4 S3 T5 W7 A2 Ld7 Sv4 OC0',
      ranged: { name: 'Flaming pinecone', range: 36, shots: 1, blast: 3, S: 6, AP: 1, D: 2, indirect: true, heavy: true, scenery: 3, fx: 'pinecone' },
      melee: { name: 'Crew mallets', S: 3, AP: 0, D: 1 },
      abilities: ['Indirect — fires without line of sight at −1 to hit.', 'Heavy — −1 to hit after moving.'],
    },
    elder: {
      name: 'Elder Chitterwick', short: 'Elder', role: 'Hero', ai: 'hero', models: 1, base: 0.42, pts: 80, cost: 60, hero: true,
      stats: 'M6 WS3 BS3 S4 T4 W5 A3 Ld9 Sv4 OC1',
      // (V3c) three spells, one cast a shooting phase, the player's pick:
      // the first is his ranged weapon as it always was (data/schema.js)
      spells: [
        { name: 'Thornburst', spell: 6, range: 18, shots: 1, blast: 2.4, S: 5, AP: 2, D: 1, scenery: 2, fx: 'thorns' },
        { name: 'Barkskin', spell: 5, range: 12, ward: true, fx: 'bark' },
        { name: 'Root Snare', spell: 7, range: 18, snare: true, fx: 'roots' },
      ],
      melee: { name: 'Rootwood staff', S: 5, AP: 1, D: 2 },
      abilities: ['Spells — casts one of the three above a turn, each on 2D6 ≥ its number; Thornburst erupts under the target, no scatter.', `Grey whiskers — friends within ${AURA}" use his Ld 9.`],
    },
  },
}
