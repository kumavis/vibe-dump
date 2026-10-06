// ---------------------------------------------------------------------------
// The ruleset. Everything a rules lawyer would want to argue about lives here:
// the stat lines, the armies, and the dice pipeline every attack runs through
//
//   hit roll (WS/BS) → wound roll (S vs T) → armour save (Sv − AP, +1 in cover)
//   → damage, one model at a time.
//
// Distances are inches; one world unit is one inch on the table.
// ---------------------------------------------------------------------------

import { draw } from './core/rng.js'

export const BOARD = { W: 40, H: 28, deploy: 8 }
export const ENGAGE = 1 // inches, base edge to base edge, that counts as "in combat"
export const CHARGE_RANGE = 12
export const OBJECTIVE_RANGE = 3
export const ROUNDS = 5
export const AURA = 6 // heroes lend their Leadership to friends this close

export const SIDES = [
  { key: 'squirrel', name: 'Bushtail Clans', short: 'Bushtails', color: '#ec8a34', dark: '#7a3d12', icon: '🐿️' },
  { key: 'snake', name: 'Coil of Ssithra', short: 'Serpents', color: '#46c27a', dark: '#14532d', icon: '🐍' },
]

export const PHASES = [
  { key: 'move', name: 'Movement' },
  { key: 'shoot', name: 'Shooting' },
  { key: 'charge', name: 'Charge' },
  { key: 'fight', name: 'Fight' },
  { key: 'morale', name: 'Morale' },
]

// M move · WS/BS skill (x+) · S strength · T toughness · W wounds per model
// A attacks per model · Ld leadership · Sv save (x+) · OC objective control
// Weapon AP is written as a positive number: AP 2 makes a 3+ save a 5+.
export const TYPES = {
  // ── Bushtail Clans: quick, many, and very fond of things that go bang ──
  nutkin: {
    side: 0, name: 'Nutkin Skirmishers', short: 'Nutkin', role: 'Troops', models: 6, base: 0.3, pts: 7,
    M: 7, WS: 4, BS: 4, S: 3, T: 3, W: 1, A: 1, Ld: 6, Sv: 6, OC: 2,
    ranged: { name: 'Slingshots', range: 18, shots: 2, S: 3, AP: 0, D: 1, assault: true, fx: 'acorn' },
    melee: { name: 'Twig knives', S: 3, AP: 0, D: 1 },
    abilities: ['Scurry — may shoot after Advancing.'],
  },
  grenadier: {
    side: 0, name: 'Acorn Grenadiers', short: 'Grenadiers', role: 'Troops', models: 5, base: 0.3, pts: 11,
    M: 6, WS: 4, BS: 4, S: 3, T: 3, W: 1, A: 1, Ld: 7, Sv: 5, OC: 1,
    ranged: { name: 'Blasting acorns', range: 12, shots: 2, blast: 1.6, S: 4, AP: 1, D: 1, scenery: 1, fx: 'bomb' },
    melee: { name: 'Twig knives', S: 3, AP: 0, D: 1 },
    abilities: ['Blast — lobs 2 templates; a miss scatters D6+1".'],
  },
  oakguard: {
    side: 0, name: 'Oak Guard', short: 'Oak Guard', role: 'Elite', models: 5, base: 0.34, pts: 22,
    M: 5, WS: 3, BS: 5, S: 4, T: 4, W: 2, A: 2, Ld: 8, Sv: 3, OC: 1,
    ranged: null,
    melee: { name: 'Pinecone halberds', S: 5, AP: 2, D: 1 },
    abilities: ['Bark shields — the clan’s anvil. No guns, all heart.'],
  },
  glider: {
    side: 0, name: 'Glider Wing', short: 'Gliders', role: 'Fast', models: 4, base: 0.32, pts: 15,
    M: 12, fly: true, WS: 3, BS: 4, S: 3, T: 3, W: 1, A: 2, Ld: 7, Sv: 5, OC: 1,
    ranged: { name: 'Thorn darts', range: 10, shots: 2, S: 3, AP: 1, D: 1, assault: true, fx: 'dart' },
    melee: { name: 'Hooked claws', S: 4, AP: 1, D: 1 },
    abilities: ['Fly — moves over scenery and enemy units.', 'Swoop — may shoot after Advancing.'],
  },
  trebuchet: {
    side: 0, name: 'Pinecone Trebuchet', short: 'Trebuchet', role: 'Artillery', models: 1, base: 1.05, pts: 95,
    M: 3, WS: 6, BS: 4, S: 3, T: 5, W: 7, A: 2, Ld: 7, Sv: 4, OC: 0, big: true,
    ranged: { name: 'Flaming pinecone', range: 36, shots: 1, blast: 3, S: 6, AP: 1, D: 2, indirect: true, heavy: true, scenery: 3, fx: 'pinecone' },
    melee: { name: 'Crew mallets', S: 3, AP: 0, D: 1 },
    abilities: ['Indirect — fires without line of sight at −1 to hit.', 'Heavy — −1 to hit after moving.'],
  },
  elder: {
    side: 0, name: 'Elder Chitterwick', short: 'Elder', role: 'Hero', models: 1, base: 0.42, pts: 80, hero: true,
    M: 6, WS: 3, BS: 3, S: 4, T: 4, W: 5, A: 3, Ld: 9, Sv: 4, OC: 1,
    ranged: { name: 'Thornburst', spell: 6, range: 18, shots: 1, blast: 2.4, S: 5, AP: 2, D: 1, scenery: 2, fx: 'thorns' },
    melee: { name: 'Rootwood staff', S: 5, AP: 1, D: 2 },
    abilities: [`Spell — cast on 2D6 ≥ 6: thorns erupt under the target, no scatter.`, `Grey whiskers — friends within ${AURA}" use his Ld 9.`],
  },

  // ── Coil of Ssithra: thick-skinned, venomous, and in no hurry ──
  scaleguard: {
    side: 1, name: 'Scaleguard', short: 'Scaleguard', role: 'Troops', models: 6, base: 0.32, pts: 10,
    M: 5, WS: 3, BS: 5, S: 4, T: 4, W: 1, A: 1, Ld: 7, Sv: 4, OC: 2,
    ranged: { name: 'Javelins', range: 8, shots: 1, S: 4, AP: 0, D: 1, fx: 'javelin' },
    melee: { name: 'Serpent spears', S: 4, AP: 1, D: 1 },
    abilities: ['Shield wall — the Coil’s steady line.'],
  },
  spitter: {
    side: 1, name: 'Venom Spitters', short: 'Spitters', role: 'Troops', models: 5, base: 0.32, pts: 12,
    M: 5, WS: 4, BS: 3, S: 3, T: 4, W: 1, A: 1, Ld: 7, Sv: 5, OC: 1,
    ranged: { name: 'Venom spit', range: 12, shots: 2, S: 2, AP: 1, D: 1, poison: 4, fx: 'spit' },
    melee: { name: 'Fangs', S: 3, AP: 0, D: 1, poison: 4 },
    abilities: ['Poison 4+ — always wounds on a 4+, however tough the target.'],
  },
  sidewinder: {
    side: 1, name: 'Sidewinder Stalkers', short: 'Sidewinders', role: 'Fast', models: 4, base: 0.34, pts: 24,
    M: 10, WS: 3, BS: 5, S: 4, T: 4, W: 2, A: 2, Ld: 7, Sv: 5, OC: 1,
    ranged: null,
    melee: { name: 'Twin sickles', S: 4, AP: 1, D: 1 },
    abilities: ['Sidewind — may charge after Advancing.'],
  },
  brute: {
    side: 1, name: 'Constrictor Brute', short: 'Brute', role: 'Monster', models: 1, base: 0.95, pts: 125, big: true,
    M: 6, WS: 3, BS: 6, S: 6, T: 6, W: 9, A: 4, Ld: 8, Sv: 4, OC: 4,
    ranged: null,
    melee: { name: 'Crushing coils', S: 7, AP: 2, D: 2 },
    abilities: ['Wrecker — moves straight through walls, trees and crates, smashing them flat (rocks still stop it).'],
    wrecker: true,
  },
  engine: {
    side: 1, name: 'Basilisk Venom Engine', short: 'Venom Engine', role: 'Artillery', models: 1, base: 1.05, pts: 100, big: true,
    M: 4, WS: 6, BS: 4, S: 3, T: 6, W: 7, A: 1, Ld: 7, Sv: 3, OC: 0,
    ranged: { name: 'Acid globe', range: 30, shots: 1, blast: 2.6, S: 5, AP: 2, D: 2, poison: 3, indirect: true, heavy: true, scenery: 4, fx: 'acid' },
    melee: { name: 'Crew hooks', S: 3, AP: 0, D: 1 },
    abilities: ['Indirect — fires without line of sight at −1 to hit.', 'Heavy — −1 to hit after moving.', 'Acid — Poison 3+, and it eats stone.'],
  },
  hierophant: {
    side: 1, name: 'Hierophant Ssithra', short: 'Hierophant', role: 'Hero', models: 1, base: 0.45, pts: 85, hero: true,
    M: 5, WS: 3, BS: 3, S: 4, T: 5, W: 5, A: 3, Ld: 9, Sv: 4, OC: 1,
    ranged: { name: 'Mesmerize', spell: 7, range: 18, mesmerize: true, fx: 'gaze' },
    melee: { name: 'Fang staff', S: 5, AP: 2, D: 2, poison: 3 },
    abilities: ['Spell — cast on 2D6 ≥ 7: the target suffers D3 mortal wounds and is Mesmerized — it can’t shoot or charge next turn and hits at −1 in melee.', `Coiled will — friends within ${AURA}" use her Ld 9.`],
  },
}

export const ARMIES = [
  ['elder', 'oakguard', 'nutkin', 'nutkin', 'grenadier', 'glider', 'trebuchet'],
  ['hierophant', 'brute', 'scaleguard', 'scaleguard', 'spitter', 'sidewinder', 'engine'],
]

// ── Dice ────────────────────────────────────────────────────────────────────
// every die comes off the match's own stream, G.rng
export const d6 = (G) => 1 + Math.floor(draw(G.rng) * 6)
export const roll = (G, n) => Array.from({ length: n }, () => d6(G))
export const passes = (dice, need) => dice.filter((d) => d >= need).length
export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)

// Probability one D6 makes `need`+ (need > 6 never does).
export const pD6 = (need) => (need > 6 ? 0 : need <= 1 ? 1 : (7 - need) / 6)

// Probability 2D6 totals at least `need`.
export function p2D6(need) {
  let ok = 0
  for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b >= need) ok++
  return ok / 36
}

// The classic strength-versus-toughness table.
export function woundNeed(S, T, poison) {
  let n
  if (S >= 2 * T) n = 2
  else if (S > T) n = 3
  else if (S === T) n = 4
  else if (2 * S <= T) n = 6
  else n = 5
  return poison ? Math.min(n, poison) : n
}

// Armour save after AP and cover. Above 6 means no save at all.
export function saveNeed(Sv, AP, cover) {
  return Math.max(2, Sv + AP - (cover ? 1 : 0))
}

// Modified hit roll: a 1 always misses, a 6 always hits.
export const hitNeed = (skill, mod) => clamp(skill + mod, 2, 6)

// How many attacks a unit throws with a weapon. Blast templates are one per
// model up to the weapon's count; everything else is per model.
export function attackCount(unit, weapon, melee) {
  const alive = unit.alive
  if (melee) return alive * unit.t.A
  if (weapon.blast) return Math.min(weapon.shots, alive)
  return alive * weapon.shots
}

// Average models killed by `n` attacks, for the AI and for the hover preview.
export function expected(n, need, weapon, target, cover) {
  const t = target.t
  const pHit = pD6(need)
  const pWound = pD6(woundNeed(weapon.S, t.T, weapon.poison))
  const pFail = 1 - pD6(saveNeed(t.Sv, weapon.AP, cover))
  const wounds = n * pHit * pWound * pFail
  const perModel = Math.min(weapon.D, t.W) / t.W
  const kills = Math.min(target.alive, wounds * perModel)
  return { wounds, kills, value: kills * t.pts }
}
