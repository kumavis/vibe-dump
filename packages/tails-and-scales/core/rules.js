// ---------------------------------------------------------------------------
// The ruleset. Everything a rules lawyer would want to argue about lives here:
// the table, the turn, and the dice pipeline every attack runs through
//
//   hit roll (WS/BS) → wound roll (S vs T) → armour save (Sv − AP, +1 in cover)
//   → damage, one model at a time.
//
// The races, their stat lines and armies are data: data/races/*.js, checked
// and normalised by data/schema.js. This is consensus code (core/): pure, and
// every die comes off the match's own stream.
//
// Distances are tails, the table's own unit (LENGTH, below); one world unit
// is one tail on the table.
// ---------------------------------------------------------------------------

import { draw } from './rng.js'

export const BOARD = Object.freeze({ W: 40, H: 28, deploy: 8 })
export const ENGAGE = 1 // inches, base edge to base edge, that counts as "in combat"
export const CHARGE_RANGE = 12
export const OBJECTIVE_RANGE = 3
export const ROUNDS = 5
export const AURA = 6 // heroes lend their Leadership to friends this close

// (the units rename, DESIGN's Units section) The table's unit of length,
// named in one place: the tail, a world unit exactly, so no number is ever
// converted. Copy says it two ways: `tails(n)`, the word, in prose (a log
// line, an ability, a hint, a refusal, the help: "6.3 tails", "1 tail",
// "D6+1 tails"), and `tl(n)`, the mark, where room is tight (a dice row, a
// tooltip, a label, the card: "6.3t"). A number prints as given when it is
// a string (a caller's toFixed(1), a dice expression) and otherwise to at
// most one decimal; the word is singular only for exactly "1".
// Presentation only: RULES_ID hashes CONSTANTS, not this, and no rule
// reads it.
export const LENGTH = Object.freeze({ one: 'tail', many: 'tails', mark: 't' })
const shown = (n) => (typeof n === 'string' ? n : String(+(+n).toFixed(1)))
export const tails = (n) => {
  const s = shown(n)
  return `${s} ${s === '1' ? LENGTH.one : LENGTH.many}`
}
export const tl = (n) => `${shown(n)}${LENGTH.mark}`

export const PHASES = Object.freeze([
  { key: 'move', name: 'Movement' },
  { key: 'shoot', name: 'Shooting' },
  { key: 'charge', name: 'Charge' },
  { key: 'fight', name: 'Fight' },
  { key: 'morale', name: 'Morale' },
].map(Object.freeze))

// ── Dice ────────────────────────────────────────────────────────────────────
// every die comes off the match's own stream, G.rng
export const d6 = (G) => 1 + Math.floor(draw(G.rng) * 6)
export const roll = (G, n) => Array.from({ length: n }, () => d6(G))
export const passes = (dice, need) => dice.filter((d) => d >= need).length
export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)

// Probability one D6 makes `need`+ (need > 6 never does).
export const pD6 = (need) => (need > 6 ? 0 : need <= 1 ? 1 : (7 - need) / 6)

// Probability 2D6 totals at least `need`. (S1, DESIGN §4.2.2) A whole
// `need` from 0 to 13 is read off a table the same loop filled, so the
// same doubles; any other number is counted afresh.
const count2D6 = (need) => {
  let ok = 0
  for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b >= need) ok++
  return ok / 36
}
const P2D6 = Object.freeze(Array.from({ length: 14 }, (_, need) => count2D6(need)))
export function p2D6(need) {
  return Number.isInteger(need) && need >= 0 && need < P2D6.length ? P2D6[need] : count2D6(need)
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

// (V3c) The save a unit rolls against: its own, one better while it is
// warded (Barkskin: core/actions/shoot.js's ward), which every save it makes
// reads (a volley's, a template's, a stray's, a keg's, a fight's) and the
// AI's appraisal with them (expected, below). saveNeed still never asks
// better than 2+.
export const svOf = (u) => (u.warded ? u.t.Sv - 1 : u.t.Sv)

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
// ((V3c) against the save the target rolls: svOf's)
export function expected(n, need, weapon, target, cover) {
  const t = target.t
  const pHit = pD6(need)
  const pWound = pD6(woundNeed(weapon.S, t.T, weapon.poison))
  const pFail = 1 - pD6(saveNeed(svOf(target), weapon.AP, cover))
  const wounds = n * pHit * pWound * pFail
  const perModel = Math.min(weapon.D, t.W) / t.W
  const kills = Math.min(target.alive, wounds * perModel)
  return { wounds, kills, value: kills * t.pts }
}
