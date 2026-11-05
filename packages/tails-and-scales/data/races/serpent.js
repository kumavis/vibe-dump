// ── Coil of Ssithra: thick-skinned, venomous, and in no hurry ──
// Plain data, normalised and checked by defineRace (data/schema.js). Names,
// shorts and weapon names appear in the battle log: change them only on
// purpose.
import { AURA } from '../../core/rules.js'

export default {
  key: 'serpent', name: 'Coil of Ssithra', short: 'Serpents', icon: '\u{1F40D}',
  look: { team: '#46c27a', dark: '#14532d', alt: '#4aa8e8', gore: ['#3f8f4a', '#d9cf86'], voice: 'hiss', models: 'serpent', anim: 'serpent' },
  army: ['hierophant', 'brute', 'scaleguard', 'scaleguard', 'spitter', 'sidewinder', 'engine'],
  // (F11a) the army builder's order of the race's units, each once: a list
  // of counts (core/army.js) carries one digit per entry, in this order, so
  // the roster is append-only (a new unit goes at the end; data-check pins
  // its start). `army` above, the classic list, is in roster order. (F9b
  // appends the Howdah.)
  roster: ['hierophant', 'brute', 'scaleguard', 'spitter', 'sidewinder', 'engine', 'howdah'],
  // (F8b) the presets of the larger battles, as counts in roster order: the
  // classic list twice over for a Field battle, three times for a Grand one
  // (data/mission.js names them; sim/data-check.mjs holds each legal there)
  armies: { field: '224222', grand: '336333' },
  units: {
    scaleguard: {
      name: 'Scaleguard', short: 'Scaleguard', role: 'Troops', ai: 'line', models: 6, base: 0.32, pts: 10, cost: 70,
      stats: 'M5 WS3 BS5 S4 T4 W1 A1 Ld7 Sv4 OC2',
      ranged: { name: 'Javelins', range: 8, shots: 1, S: 4, AP: 0, D: 1, fx: 'javelin' },
      melee: { name: 'Serpent spears', S: 4, AP: 1, D: 1 },
      abilities: ['Shield wall — the Coil’s steady line.'],
    },
    spitter: {
      name: 'Venom Spitters', short: 'Spitters', role: 'Troops', ai: 'shooter', models: 5, base: 0.32, pts: 12, cost: 65,
      stats: 'M5 WS4 BS3 S3 T4 W1 A1 Ld7 Sv5 OC1',
      ranged: { name: 'Venom spit', range: 12, shots: 2, S: 2, AP: 1, D: 1, poison: 4, fx: 'spit' },
      melee: { name: 'Fangs', S: 3, AP: 0, D: 1, poison: 4 },
      abilities: ['Poison 4+ — always wounds on a 4+, however tough the target.'],
    },
    sidewinder: {
      name: 'Sidewinder Stalkers', short: 'Sidewinders', role: 'Fast', ai: 'melee', models: 4, base: 0.34, pts: 24, cost: 65, chargeAfterAdvance: true,
      stats: 'M10 WS3 BS5 S4 T4 W2 A2 Ld7 Sv5 OC1',
      ranged: null,
      melee: { name: 'Twin sickles', S: 4, AP: 1, D: 1 },
      abilities: ['Sidewind — may charge after Advancing.'],
    },
    brute: {
      name: 'Constrictor Brute', short: 'Brute', role: 'Monster', ai: 'melee', models: 1, base: 0.95, pts: 125, cost: 100, big: true, wrecker: true,
      stats: 'M6 WS3 BS6 S6 T6 W9 A4 Ld8 Sv4 OC4',
      ranged: null,
      melee: { name: 'Crushing coils', S: 7, AP: 2, D: 2 },
      abilities: ['Wrecker — moves straight through walls, trees and crates, smashing them flat (rocks still stop it).'],
    },
    engine: {
      name: 'Basilisk Venom Engine', short: 'Venom Engine', role: 'Artillery', ai: 'artillery', models: 1, base: 1.05, pts: 100, cost: 65, big: true,
      stats: 'M4 WS6 BS4 S3 T6 W7 A1 Ld7 Sv3 OC0',
      ranged: { name: 'Acid globe', range: 30, shots: 1, blast: 2.6, S: 5, AP: 2, D: 2, poison: 3, indirect: true, heavy: true, scenery: 4, corrodes: true, fx: 'acid' },
      melee: { name: 'Crew hooks', S: 3, AP: 0, D: 1 },
      abilities: ['Indirect — fires without line of sight at −1 to hit.', 'Heavy — −1 to hit after moving.', 'Acid — Poison 3+, and it eats stone.'],
    },
    hierophant: {
      name: 'Hierophant Ssithra', short: 'Hierophant', role: 'Hero', ai: 'hero', models: 1, base: 0.45, pts: 85, cost: 60, hero: true,
      stats: 'M5 WS3 BS3 S4 T5 W5 A3 Ld9 Sv4 OC1',
      // (V3c) three spells, one cast a shooting phase, the player's pick:
      // the first is her ranged weapon as it always was (data/schema.js)
      spells: [
        { name: 'Mesmerize', spell: 7, range: 18, mesmerize: true, fx: 'gaze' },
        { name: 'Cold Blood', spell: 5, range: 12, resolve: true, fx: 'coil' },
        { name: 'Venom Mist', spell: 6, range: 18, shots: 1, blast: 3, S: 2, AP: 0, D: 1, poison: 2, scenery: 0, fx: 'mist' },
      ],
      melee: { name: 'Fang staff', S: 5, AP: 2, D: 2, poison: 3 },
      abilities: ['Spells — casts one of the three above a turn, each on 2D6 ≥ its number; a Mesmerized target can’t shoot or charge next turn and hits at −1 in melee.', `Coiled will — friends within ${AURA}" use her Ld 9.`],
    },
    // (F9b, DESIGN §4.2.5) the Coil's transport: a great serpent carrying a
    // long tortoise-shell howdah on its back. Long, so a footprint of three
    // discs front to back (its head r 0.95 2" ahead, its body r 1.25, its
    // `base`, where it stands, and its tail r 0.95 2" behind: 5.9 × 2.5",
    // 6.14" on the diagonals, its bounding R 3.07) and a facing: it drives
    // forward, backs up at half speed (rev 2) and pivots where its 6" body
    // has room, at 0.25" a 45° pivot (core/nav.js hullReach). M6. Its deck,
    // the long shell, carries two squads (12 models, bases up to 0.45),
    // loaded at the deployment by the autoload, its riders stepping off
    // within 3" of any of its discs (so at its head or tail, about 2"
    // farther than off a War-Cart); `fire` is the deck's three firing
    // slots, F9c's: nothing reads it yet. Destroyed, it leaves a burning
    // wreck along its facing. None in a Skirmish, at most two a side in a
    // Field or Grand battle (the Vehicle slot, data/mission.js).
    howdah: {
      name: 'Shell-Back Howdah', short: 'Howdah', role: 'Vehicle', ai: 'transport', models: 1, base: 1.25, pts: 140,
      // (F9b, fitted at Field by sim/army-sim.mjs, §4.2.8.2: seeds 1111,
      // 2222 and 3333 at a trial 50, −3 ± 13, −27 ± 18 and −16 ± 14 points,
      // −13 ± 8 pooled, so the floor, 5. As the AI plays it the Howdah is
      // worth about nothing: its riders, kept from shooting until they step
      // off (no firing deck before F9c: core/actions/transport.js
      // fireSlots), ride at M6, barely ahead of their own feet, and it
      // fights and shoots little for itself. Judged on 4444 at 5: the
      // score 50.2% open and 54.1% fortified, the Howdah 37 ± 27. Its
      // price at Field; at Grand data/mission.js's `prices` keep it at 5
      // (the War-Cart's test there turned the other way). F9c's firing
      // deck re-fits it, as it does the War-Cart.)
      cost: 5,
      stats: 'M6 WS4 BS4 S6 T8 W14 A3 Ld8 Sv3 OC0', big: true, wrecker: true, vehicle: true,
      footprint: { discs: [[0, 2, 0.95], [0, 0, 1.25], [0, -2, 0.95]], turn: 0.25, rev: 2 },
      transport: { capacity: 12, maxBase: 0.45, fire: 3, deck: 1.6, deckAt: [0, 0], wreck: { hx: 1.2, hy: 0.7, hz: 2.9 } },
      ranged: { name: 'Venom lobber', range: 18, shots: 1, blast: 1.6, S: 5, AP: 1, D: 1, fx: 'spit' },
      melee: { name: 'Coil crush', S: 6, AP: 1, D: 2 },
      abilities: [
        'Transport — carries two squads (12 models) under its shell; a unit boards or steps off it as its move.',
        'Riders — ride along, can’t be shot or charged, and hold no objectives; they step off at its head or tail.',
        'Long hull — drives forward, backs up at half speed, and turns only where its whole body has room to swing.',
        'Coil crush — ploughs through anything breakable in its way.',
        'Burning wreck — destroyed, it leaves a wreck; each rider bails out, a 1 is a mortal wound.',
      ],
    },
  },
}
