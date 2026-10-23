// Which rules a match is played under.
//
// RULES_ID is a hash of the rule-bearing data, computed at load: every race
// with its army and unit types (stat lines, weapons, flags and the derived
// fields), minus what is only presentation (`name`, `short`, `icon`,
// `look`, `abilities` text and a weapon's `fx`), plus the table constants,
// the phase order, the terrain sets (core/terrain/sets.js: the feature
// table, the centre rule and the spacing rules every board is scattered
// by) and the missions (data/mission.js: the objectives, the default rounds
// and the deployment depth). A stat retune changes it, so a match started
// under other rules can be told apart instead of silently playing
// differently; a renamed unit doesn't.
//
// CORE_VERSION is the other half: a whole number bumped by hand whenever the
// rules code itself changes what a battle does (an action, the engine, the
// AI, a recipe, dmath), which no data hash can see. The parity corpus forces
// the bump, since any such change breaks a baseline (DESIGN §2.7). A match's
// `start` entry carries both, and a peer whose own differ opens it read-only
// (match/fold.js: 'skew') rather than folding it into another battle.
import { BOARD, ENGAGE, CHARGE_RANGE, OBJECTIVE_RANGE, ROUNDS, AURA, PHASES } from './rules.js'
import { RACES } from '../data/schema.js'
import { MISSIONS } from '../data/mission.js'
import { SETS } from './terrain/sets.js'
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
// rules like any other). The terrain sets and the missions are rules through
// and through (every number in them places scenery, an objective or a
// zone), so they go in whole.
export function rulesData({ races = RACES, constants = CONSTANTS, phases = PHASES.map((p) => p.key), sets = SETS, missions = MISSIONS } = {}) {
  return { races: mapVals(races, ({ units, ...r }) => ({ ...strip(r), units: mapVals(units, strip) })), constants, phases, sets, missions }
}

export const rulesId = (opts) => cyrb53(canonicalJSON(rulesData(opts))).toString(36)

export const RULES_ID = rulesId()

// (1: the rules as R0 recorded them, unchanged through the refactor; 2: F4's
// round-limit vote, the vote command and setup.overtime 'vote'; 3: F10b's
// pilot, the AI playing a set of a seat's units)
export const CORE_VERSION = 3
