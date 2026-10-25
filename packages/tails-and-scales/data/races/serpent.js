// ── Coil of Ssithra: thick-skinned, venomous, and in no hurry ──
// Plain data, normalised and checked by defineRace (data/schema.js). Names,
// shorts and weapon names appear in the battle log: change them only on
// purpose.
import { AURA } from '../../core/rules.js'

export default {
  key: 'serpent', name: 'Coil of Ssithra', short: 'Serpents', icon: '\u{1F40D}',
  look: { team: '#46c27a', dark: '#14532d', alt: '#4aa8e8', gore: ['#3f8f4a', '#d9cf86'], voice: 'hiss', models: 'serpent', anim: 'serpent' },
  army: ['hierophant', 'brute', 'scaleguard', 'scaleguard', 'spitter', 'sidewinder', 'engine'],
  units: {
    scaleguard: {
      name: 'Scaleguard', short: 'Scaleguard', role: 'Troops', ai: 'line', models: 6, base: 0.32, pts: 10,
      stats: 'M5 WS3 BS5 S4 T4 W1 A1 Ld7 Sv4 OC2',
      ranged: { name: 'Javelins', range: 8, shots: 1, S: 4, AP: 0, D: 1, fx: 'javelin' },
      melee: { name: 'Serpent spears', S: 4, AP: 1, D: 1 },
      abilities: ['Shield wall — the Coil’s steady line.'],
    },
    spitter: {
      name: 'Venom Spitters', short: 'Spitters', role: 'Troops', ai: 'shooter', models: 5, base: 0.32, pts: 12,
      stats: 'M5 WS4 BS3 S3 T4 W1 A1 Ld7 Sv5 OC1',
      ranged: { name: 'Venom spit', range: 12, shots: 2, S: 2, AP: 1, D: 1, poison: 4, fx: 'spit' },
      melee: { name: 'Fangs', S: 3, AP: 0, D: 1, poison: 4 },
      abilities: ['Poison 4+ — always wounds on a 4+, however tough the target.'],
    },
    sidewinder: {
      name: 'Sidewinder Stalkers', short: 'Sidewinders', role: 'Fast', ai: 'melee', models: 4, base: 0.34, pts: 24, chargeAfterAdvance: true,
      stats: 'M10 WS3 BS5 S4 T4 W2 A2 Ld7 Sv5 OC1',
      ranged: null,
      melee: { name: 'Twin sickles', S: 4, AP: 1, D: 1 },
      abilities: ['Sidewind — may charge after Advancing.'],
    },
    brute: {
      name: 'Constrictor Brute', short: 'Brute', role: 'Monster', ai: 'melee', models: 1, base: 0.95, pts: 125, big: true, wrecker: true,
      stats: 'M6 WS3 BS6 S6 T6 W9 A4 Ld8 Sv4 OC4',
      ranged: null,
      melee: { name: 'Crushing coils', S: 7, AP: 2, D: 2 },
      abilities: ['Wrecker — moves straight through walls, trees and crates, smashing them flat (rocks still stop it).'],
    },
    engine: {
      name: 'Basilisk Venom Engine', short: 'Venom Engine', role: 'Artillery', ai: 'artillery', models: 1, base: 1.05, pts: 100, big: true,
      stats: 'M4 WS6 BS4 S3 T6 W7 A1 Ld7 Sv3 OC0',
      ranged: { name: 'Acid globe', range: 30, shots: 1, blast: 2.6, S: 5, AP: 2, D: 2, poison: 3, indirect: true, heavy: true, scenery: 4, corrodes: true, fx: 'acid' },
      melee: { name: 'Crew hooks', S: 3, AP: 0, D: 1 },
      abilities: ['Indirect — fires without line of sight at −1 to hit.', 'Heavy — −1 to hit after moving.', 'Acid — Poison 3+, and it eats stone.'],
    },
    hierophant: {
      name: 'Hierophant Ssithra', short: 'Hierophant', role: 'Hero', ai: 'hero', models: 1, base: 0.45, pts: 85, hero: true,
      stats: 'M5 WS3 BS3 S4 T5 W5 A3 Ld9 Sv4 OC1',
      ranged: { name: 'Mesmerize', spell: 7, range: 18, mesmerize: true, fx: 'gaze' },
      melee: { name: 'Fang staff', S: 5, AP: 2, D: 2, poison: 3 },
      abilities: ['Spell — cast on 2D6 ≥ 7: the target suffers D3 mortal wounds and is Mesmerized — it can’t shoot or charge next turn and hits at −1 in melee.', `Coiled will — friends within ${AURA}" use her Ld 9.`],
    },
  },
}
