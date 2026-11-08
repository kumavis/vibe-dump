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
  // (F9a: the Acorn War-Cart appended, so every list written before it
  // means what it meant)
  roster: ['elder', 'oakguard', 'nutkin', 'grenadier', 'glider', 'trebuchet', 'warcart'],
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
      // (the Skirmish prices after the parapets, DESIGN's note of that name)
      // v6's 50, judged after F7b's parapets and kept: at 50 its fit moves
      // with the seed by more than its band (33 to 56 at Skirmish N over
      // seven seeds); 40, tuned on two seeds, fell outside its band on 5555; 45,
      // fitted on four pooled seeds, failed the rule fixed before its runs
      // on the standing seed 1111 (30 ± 7, 2 past its band of 13; 50 is 4
      // past its), so v6's 50 stays as that rule's default, not as the
      // price that judged better (45 held every gate 50 held, and two more)
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
    // (F9a, DESIGN §4.2.5) the clan's transport: a giant acorn cup on spiked
    // wheels, pushed by its crew. Round (one disc, base 1.5: no footprint),
    // M8, turning freely; its deck carries two squads (12 models, bases up
    // to 0.45: the Nutkin and the Grenadiers make 11), loaded at the
    // deployment by the autoload (core/actions/transport.js). Destroyed, it
    // leaves a burning wreck the size of its cup (`wreck`'s half-sizes), and
    // its riders bail out. (F9c) `fire` is the deck's two firing slots: two
    // rider units a turn shoot from it (core/actions/transport.js
    // fireSlots), from `deckY` 0.7" over its floor (where the figure's
    // riders stand: its 0.09" lift and the deck's 0.62, view/models/
    // warcart.js), their range from its edge; `deck` is the deck's radius,
    // which the view packs them on. None in a Skirmish, at most two a side
    // in a Field or Grand battle (the Vehicle slot, data/mission.js).
    warcart: {
      name: 'Acorn War-Cart', short: 'War-Cart', role: 'Vehicle', ai: 'transport', models: 1, base: 1.5, pts: 120,
      // (F9a, fitted at Field by sim/army-sim.mjs, §4.2.8.2: seeds 1111 and
      // 2222 at a trial 60, 46 ± 16 and 33 ± 13 points, so 40; judged on
      // 4444 at 40, both sets: 58 ± 12, inside its band, every unit in
      // its own, the score 48.3% open and 52.9% fortified. Its riders
      // stepped off to shoot once an enemy was in reach (core/ai/policy.js,
      // with no firing deck before F9c); kept aboard they fitted the cart
      // about 0 and the Nutkin 20 under. Its price at Field; at Grand
      // data/mission.js's `prices` say 150. F9c's firing deck, its riders
      // shooting from aboard, re-fits it.)
      // ((F9c) Re-fitted with its riders shooting from the deck (seeds
      // 1111, 2222 and 3333 pooled at 40, N 2,700): 4 ± 9, so the fit's 5;
      // the Howdah beside it −52 ± 11, the floor. But at 5 (the Howdah 5)
      // the Bushtails won the Field score gate away on both seeds, 55.2%
      // open and 60.0% fortified on 1111, 56.1% fortified on 4444 (band 5),
      // and at 10 still 57.7% fortified on 1111. At 15 both score gates
      // pass on both seeds (54.4% and 54.4% on 1111, 54.5% and 54.2% on
      // 4444) with the cart inside its band on each (30 ± 21 and −8 ± 18)
      // and the Howdah in its own; at 20 the scores sit nearer even (51.9%
      // and 52.9%, 54.1% and 53.2%) but the cart misses its band on 4444
      // (−17 ± 18, band 36) and the Howdah on 1111; kept at 40 (the Howdah
      // 20) they pass too, but both hulls miss their bands on 4444 and the
      // Howdah on 1111. So 15, the lowest price the score gates take,
      // nearest the fit. The points bind 876 of 1,000 Bushtail lists at 15
      // (993 at 40). Grand keeps its 150.)
      cost: 15,
      stats: 'M8 WS5 BS4 S5 T7 W10 A3 Ld8 Sv3 OC0', big: true, wrecker: true, vehicle: true,
      transport: { capacity: 12, maxBase: 0.45, fire: 2, deck: 1.4, deckY: 0.7, wreck: { hx: 1.4, hy: 0.6, hz: 1.4 } },
      ranged: { name: 'Bolt thrower', range: 24, shots: 2, S: 6, AP: 2, D: 2, heavy: true, fx: 'bolt' },
      melee: { name: 'Spiked wheels', S: 5, AP: 1, D: 1 },
      abilities: [
        'Transport — carries two squads (12 models) on its deck; a unit boards or steps off it as its move.',
        'Firing deck — up to two squads aboard shoot from its deck each turn, from the deck’s height (it sees over walls), their range from its edge; they count as having moved, or advanced, when it has.',
        'Riders — ride along, can’t be shot or charged, and hold no objectives.',
        'Spiked wheels — ploughs through anything breakable in its way.',
        'Heavy — −1 to hit after moving.',
        'Burning wreck — destroyed, it leaves a wreck; each rider bails out, a 1 is a mortal wound.',
      ],
    },
  },
}
