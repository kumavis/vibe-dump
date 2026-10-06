// Which rules a match is played under.
//
// RULES_ID is a hash of the rule-bearing data, computed at load: every race
// with its army and unit types (stat lines, weapons, flags and the derived
// fields), minus what is only presentation (`name`, `short`, `icon`,
// `look`, `abilities` text and a weapon's `fx`), plus the table constants
// and the phase order. A stat retune changes it, so a match started under
// other rules can be told apart instead of silently playing differently; a
// renamed unit doesn't. (CORE_VERSION, the manual number for changes to the
// rules code itself, joins it here at R8; the terrain sets join the hash at
// R3 and the mission's objectives when they move to data/.)
import { BOARD, ENGAGE, CHARGE_RANGE, OBJECTIVE_RANGE, ROUNDS, AURA, PHASES } from './rules.js'
import { RACES } from '../data/schema.js'
import { cyrb53, canonicalJSON } from './util.js'

// A record's presentation fields, left out wherever a record has them (a
// race, a unit type, a weapon, the look)
const PRESENTATION = new Set(['name', 'short', 'icon', 'look', 'abilities', 'fx'])
const strip = (v) => Array.isArray(v) ? v.map(strip)
  : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).filter(([k]) => !PRESENTATION.has(k)).map(([k, x]) => [k, strip(x)]))
  : v
const mapVals = (o, f) => Object.fromEntries(Object.entries(o).map(([k, x]) => [k, f(x)]))

export const CONSTANTS = Object.freeze({ BOARD, ENGAGE, CHARGE_RANGE, OBJECTIVE_RANGE, ROUNDS, AURA })

// The data RULES_ID hashes. The arguments exist so sim/data-check.mjs can
// show that a change to the rules moves the hash and a rename doesn't.
// The races and each race's units are maps keyed by race and unit key: only
// their records lose presentation fields, never a key (a unit keyed 'look' is
// rules like any other).
export function rulesData({ races = RACES, constants = CONSTANTS, phases = PHASES.map((p) => p.key) } = {}) {
  return { races: mapVals(races, ({ units, ...r }) => ({ ...strip(r), units: mapVals(units, strip) })), constants, phases }
}

export const rulesId = (opts) => cyrb53(canonicalJSON(rulesData(opts))).toString(36)

export const RULES_ID = rulesId()
