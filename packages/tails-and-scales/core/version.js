// Which rules a match is played under.
//
// RULES_ID is a hash of the rule-bearing data, computed at load: every race
// with its army and unit types (stat lines, weapons, flags and the derived
// fields; from F11a each unit's `cost`, and the race's `roster`, as an
// array, so its order is in the hash, and its presets, `armies`), minus
// what is only presentation (`name`, `short`, `icon`, `look`, `abilities`
// text and a weapon's `fx`), plus the table constants, the phase order, the
// terrain sets (core/terrain/sets.js: the feature table, the centre rule
// and the spacing rules every board is scattered by) and the missions
// (data/mission.js: the board, the objectives, the default rounds, the
// deployment depth, the sets, the army's name and, from F11a, the list
// rules, `list`, less its `size`: the battle size's name, which the
// refusals and the builder print as they print a race's name and a unit's
// short one, is presentation like them), and (F19a) the hazards
// (data/hazards.js: the powder keg's hit points and its blast's profile,
// less its name and look). A stat or price retune changes
// it, so a match started under other rules can be told apart instead of
// silently playing differently (a peer whose prices or rosters differ
// opens it as 'skew', never as a desync); a renamed unit, race or size
// doesn't (refusal text is a peer's own: the Folder's error and a refused
// entry's why are local, and stateHash leaves them out).
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
import { HAZARDS } from '../data/hazards.js'
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
// zone), so they go in whole, but for (F11a) the one name a mission holds:
// its list's `size`, presentation, left out by that key alone (a list is a
// mission's record, never a map keyed by a name). (F19a) The hazards are a
// map keyed by name, as the races are: each record loses its presentation
// (`name`, `fx`), never its key.
const listRules = ({ size, ...rules }) => rules
const missionRules = (m) => (m.list ? { ...m, list: listRules(m.list) } : m)
export function rulesData({ races = RACES, constants = CONSTANTS, phases = PHASES.map((p) => p.key), sets = SETS, missions = MISSIONS, hazards = HAZARDS } = {}) {
  return { races: mapVals(races, ({ units, ...r }) => ({ ...strip(r), units: mapVals(units, strip) })), constants, phases, sets, missions: mapVals(missions, missionRules), hazards: mapVals(hazards, strip) }
}

export const rulesId = (opts) => cyrb53(canonicalJSON(rulesData(opts))).toString(36)

export const RULES_ID = rulesId()

// (1: the rules as R0 recorded them, unchanged through the refactor; 2: F4's
// round-limit vote, the vote command and setup.overtime 'vote'; 3: F10b's
// pilot, the AI playing a set of a seat's units; 4: F8a's missions, the
// setup naming the mission that chooses the board and refusing a field it
// doesn't know; 5: F11a's army lists: the setup's seats name a preset or
// a list of counts, which newState builds the armies from; 6: F7a's
// height: the nav's floor, links and ledges, and the rules' height
// branches; 7: F8b's missions field and grand, the open set (the scatter's
// area scale) and the fight guard, max(30, 2·units + 2); 8: F17's lobbing
// from height, a blast or indirect weapon reaching √(R² + 2hR) from h above
// its target, in shotInfo and the AI's shot value alike: code, no rules
// data, so RULES_ID stays; 9: F18's shooting into a fight, any ranged
// weapon at a target locked in combat, a volley's misses straying into the
// shooter's own units there by their share of the fight's models, and the
// AI's shot value net of its friendly fire: code, no rules data, so
// RULES_ID stays; 10: F19a's powder keg, a chunk whose breaking is a blast
// at its place (a template's, acid's or a wrecker's walk setting it off, a
// keg under a keg's blast going off in turn: §4.1 rule 28), the `keg` set
// and mission, and the AI's keg terms; and with it the tower ring's fix,
// `fortified`'s `largeCentre` (the rock box where the ring stood on Field
// and Grand boards): RULES_ID moves with the hazards, the set and the
// mission; 11: F9a's transports: riders aboard a vehicle, embark and
// disembark, the deployment's autoload, a hull's wreck and the bail-out,
// and the AI's transports (built on 7 as 9, beside F7b's 8, and renumbered
// at its merge onto 10: F7b, unlanded, takes the next number free); RULES_ID
// moves with the War-Cart, the Vehicle role and slot and the transport
// record; 12: the V3 rules landed together, each built as 11 on 10: V3c's
// spells, three a caster (the race data's `spells`, so RULES_ID moves), the
// `shoot` command's `sp`, Barkskin's ward, Root Snare's snare and Cold
// Blood's resolve on a unit (stateHash's UNIT_EXTRAS beside F9a's aboard)
// and their ends, Venom Mist's template that spares the scenery, and the
// AI's choice of spell and target)
export const CORE_VERSION = 12
