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
    // farther than off a War-Cart). (F9c) `fire` is the deck's three
    // firing slots: three rider units a turn shoot from it, all round (no
    // arcs: its facing turns its footprint only), from `deckY` 1.65" over
    // its floor at its deck point (deckAt, its body's centre: the figure's
    // 0.09" lift and its shell's top, view/models/howdah.js), their range
    // from its nearest disc; `deck` is the deck's radius, which the view
    // packs them on. Destroyed, it leaves a burning
    // wreck along its facing. None in a Skirmish, at most two a side in a
    // Field or Grand battle (the Vehicle slot, data/mission.js).
    howdah: {
      name: 'Shell-Back Howdah', short: 'Howdah', role: 'Vehicle', ai: 'transport', models: 1, base: 1.25, pts: 140,
      // (F9b, fitted at Field by sim/army-sim.mjs, §4.2.8.2: seeds 1111,
      // 2222 and 3333 at a trial 50, −3 ± 13, −27 ± 18 and −16 ± 14 points,
      // −13 ± 8 pooled, so first the floor, 5. As the AI plays it the
      // Howdah is worth little for itself: its riders, kept from shooting
      // until they step off (no firing deck before F9c:
      // core/actions/transport.js fireSlots), ride at M6, and it fights and
      // shoots little. ((F9b's sweep) But once the AI drove it forward (its
      // anti-bunching by its body disc, core/ai/score.js), at 5 the Coil's
      // lists took it all but free, the points binding only 676 of 1,000 of
      // them, and the Field score gate failed: the Bushtails 44.9% ± 1.6
      // on open (its band 5), 45.1% fortified, seed 1111. Priced 20, the
      // points bind 834 of 1,000 again and both seeds pass both score
      // gates: 47.4% and 47.7% on 1111, 47.4% and 49.7% on 4444, the
      // Howdah itself fitted −13 ± 17 and −4 ± 15, inside its band (at 25:
      // 49.6% and 49.7% on 1111, 48.4% and 52.0% on 4444, the Howdah
      // −5 ± 15 there, outside its band of 30; at 50, 52.1% and 54.7%,
      // the Howdah 17 ± 13 against its 50). Its price at Field; at Grand
      // data/mission.js's `prices` keep it at 5 (the War-Cart's test there
      // turned the other way). F9c's firing deck re-fits it, as it does
      // the War-Cart.)
      // ((F9c) Re-fitted with its riders shooting from the deck (seeds
      // 1111, 2222 and 3333 pooled at 20, N 2,700): −52 ± 11, so the floor,
      // 5, again. Its riders' guns are short (Javelins 8", Venom spit 12")
      // and the AI keeps a gunned rider aboard and the hull back (rule 10),
      // so it shoots from its deck little. At 20 it now misses its band on
      // both seeds (−24 ± 15 on 1111, −43 ± 19 on 4444, the War-Cart at
      // 40); at 5, with the War-Cart at its 15 (data/races/squirrel.js),
      // both Field score gates pass on both seeds (54.4% and 54.4% on
      // 1111, 54.5% and 54.2% on 4444) and it lies inside its band on each
      // (−21 ± 29, −55 ± 30). F9b priced it 20 to bind the Coil's lists and
      // the score gate with them; here the score gates pass at the floor
      // and a higher price, the cart at 15, only moves them further toward
      // the Bushtails (at 20, the cart at 40, the Bushtails gain 3 points on
      // 4444 over the floor). **Departs** as F9b's floor did from "points
      // must be what binds": they bind 676 of 1,000 Coil lists at 5 (834
      // at 20). Grand and the Powder Field keep 5.)
      cost: 5,
      stats: 'M6 WS4 BS4 S6 T8 W14 A3 Ld8 Sv3 OC0', big: true, wrecker: true, vehicle: true,
      footprint: { discs: [[0, 2, 0.95], [0, 0, 1.25], [0, -2, 0.95]], turn: 0.25, rev: 2 },
      transport: { capacity: 12, maxBase: 0.45, fire: 3, deck: 1.6, deckY: 1.65, deckAt: [0, 0], wreck: { hx: 1.2, hy: 0.7, hz: 2.9 } },
      ranged: { name: 'Venom lobber', range: 18, shots: 1, blast: 1.6, S: 5, AP: 1, D: 1, fx: 'spit' },
      melee: { name: 'Coil crush', S: 6, AP: 1, D: 2 },
      abilities: [
        'Transport — carries two squads (12 models) under its shell; a unit boards or steps off it as its move.',
        'Riders — ride along, can’t be shot or charged, and hold no objectives; they step off at its head or tail.',
        'Firing deck — up to three squads aboard shoot from its shell each turn, all round, from the shell’s height (it sees over walls), their range from its edge; they count as having moved, or advanced, when it has.',
        'Long hull — drives forward, backs up at half speed, and turns only where its whole body has room to swing.',
        'Coil crush — ploughs through anything breakable in its way.',
        'Burning wreck — destroyed, it leaves a wreck; each rider bails out, a 1 is a mortal wound.',
      ],
    },
  },
}
