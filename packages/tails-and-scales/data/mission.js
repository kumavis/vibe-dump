// The missions a battle can be fought for (DESIGN §1.1): where the
// objectives stand, how many rounds a battle lasts when its setup names
// none, and how deep each seat's deployment zone runs from its edge.
//
// Consensus data, like the races: RULES_ID (core/version.js) hashes every
// mission whole (but for its list's `size`, a name), so a match started
// under a mission whose objectives have since moved is told apart instead
// of silently playing another battle.
// (F8a) A setup names its mission (`setup.mission`, `classic` when it names
// none: core/index.js fullSetup), and the mission chooses the board: its
// size, how deep each seat's deployment zone runs from its edge, the
// objectives, the rounds a battle lasts when its setup names none, the
// terrain sets it may be fought on (the first the default) and `army`, the
// name of the preset an army takes when its seat names none. (F11a) And
// `list`, the army builder's rules for the armies a seat may name instead
// (DESIGN §4.2.8.3): the points limit, the most units and models, the most
// of any one unit (`perKind`), each role's slot [min, max], and `size`, the
// battle size's name the refusals and the builder call it by ("a Skirmish
// army has at most 36"; F8b names Field and Grand). core/army.js reads it;
// no rule of the battle does. There is one mission yet, `classic`: its board and depth are the
// ruleset's own BOARD and its rounds ROUNDS (core/rules.js, which the
// constants hash too; sim/data-check.mjs holds them equal). F8b adds
// `field` and `grand` (DESIGN §4.2.3).
//
// Every mission is checked as this module loads (checkMission, as the
// terrain sets are): a slip in a new one fails at once, on every board.
import { BOARD, ROUNDS } from '../core/rules.js'
import { deepFreeze } from '../core/util.js'
import { SETS } from '../core/terrain/sets.js'
import { ROLES } from './schema.js'

// A registry with no prototype, so a mission named like an Object.prototype
// member (from a URL, or a lobby a peer writes) finds nothing.
export const MISSIONS = deepFreeze(Object.assign(Object.create(null), {
  classic: {
    board: { W: 40, H: 28 },
    deploy: BOARD.deploy,
    rounds: ROUNDS,
    army: 'classic',
    // (F11a) a Skirmish: 500 points, exactly one hero, at least one Troops
    // unit, at most 3 of any one unit (the classic lists cost 485 and 495)
    list: {
      size: 'Skirmish', points: 500, units: 10, models: 36, perKind: 3,
      roles: { Hero: [1, 1], Troops: [1, 6], Elite: [0, 2], Fast: [0, 2], Monster: [0, 1], Artillery: [0, 1] },
    },
    sets: ['classic'],
    // the centre, and one pair in each half, the table's point mirror
    objectives: [
      { x: 0, z: 0 },
      { x: -9, z: 8 },
      { x: 9, z: -8 },
      { x: -9, z: -8 },
      { x: 9, z: 8 },
    ],
  },
}))

// A mission the rules can play, or an Error naming what is wrong with it:
// its board's sides even whole numbers (a whole number of nav cells, the
// centre on a cell's edge), each seat's zone more than 6" short of the
// centre line, every objective 1" inside the board, outside both zones and
// with its point mirror in the list (both seats rely on that fairness, as
// on the terrain's mirror), whole rounds, sets that exist, an army's name
// and (F11a) a sane `list` (checkListRules, below).
export function checkMission(name, m) {
  const bad = (why) => {
    throw new Error(`mission "${name}": ${why}`)
  }
  const even = (n) => Number.isInteger(n) && n > 0 && n % 2 === 0
  const { W, H } = m.board ?? {}
  if (!even(W) || !even(H)) bad(`its board is ${W}×${H}, not two even whole numbers of inches`)
  if (!(m.deploy > 0) || !(m.deploy < W / 2 - 6)) bad(`a zone ${m.deploy}" deep leaves under 6" to the centre line of a board ${W}" wide`)
  if (!Number.isInteger(m.rounds) || m.rounds < 1) bad(`a battle of ${m.rounds} rounds`)
  if (!Array.isArray(m.sets) || !m.sets.length || !m.sets.every((s) => typeof s === 'string' && s in SETS)) bad(`its sets ${JSON.stringify(m.sets)} aren't terrain sets (there are ${Object.keys(SETS).join(', ')})`)
  if (typeof m.army !== 'string' || !m.army) bad('its army has no name')
  checkListRules(m.list, bad)
  if (!Array.isArray(m.objectives) || !m.objectives.length) bad('it has no objectives')
  for (const o of m.objectives) {
    const at = `the objective at (${o.x}, ${o.z})`
    if (!Number.isFinite(o.x) || !Number.isFinite(o.z)) bad(`${at} isn't on the board`)
    if (Math.abs(o.x) > W / 2 - 1 || Math.abs(o.z) > H / 2 - 1) bad(`${at} is less than 1" inside the board`)
    if (!(Math.abs(o.x) < W / 2 - m.deploy)) bad(`${at} is in a deployment zone`)
    if (!m.objectives.some((p) => p.x === -o.x && p.z === -o.z)) bad(`${at} has no point mirror`)
  }
}

// (F11a, DESIGN §4.2.8.3) A mission's list rules, or bad(why): `size` a
// name when given (core/army.js calls a list without one a battle's);
// `points` a whole number above 0; `units` and `models` whole numbers
// within §4.2.1's envelope (24 units, 90 models); `perKind` from 1 to 9 (a
// list carries one digit per roster entry, and perKind bounds each, so
// every count is one digit; a role's slot sums several entries, so it is
// bounded by `units`, not 9); and a slot [min, max] for every role in ROLES
// and no other, whole numbers with 0 ≤ min ≤ max ≤ units, the minimums
// summing to at most `units` (so a Grand Troops [3, 14] and F9a's Skirmish
// Vehicle [0, 0] are both legal).
const LIST_KEYS = ['size', 'points', 'units', 'models', 'perKind', 'roles']
const ENVELOPE = { units: 24, models: 90 }
function checkListRules(l, bad) {
  if (!l || typeof l !== 'object' || Array.isArray(l)) bad('it has no list (the army builder\'s rules)')
  for (const k of Object.keys(l)) if (!LIST_KEYS.includes(k)) bad(`its list takes no field "${k}"`)
  if (l.size !== undefined && (typeof l.size !== 'string' || !l.size)) bad(`its list's size is ${JSON.stringify(l.size)}, not a name`)
  const whole = (n, lo, hi) => Number.isInteger(n) && n >= lo && n <= hi
  if (!whole(l.points, 1, Infinity)) bad(`its list's points limit is ${l.points}, not a whole number above 0`)
  for (const k of ['units', 'models']) if (!whole(l[k], 1, ENVELOPE[k])) bad(`its list's ${k} is ${l[k]}, not a whole number from 1 to ${ENVELOPE[k]}`)
  if (!whole(l.perKind, 1, 9)) bad(`its list's perKind is ${l.perKind}, not a whole number from 1 to 9 (a count is one digit)`)
  const roles = l.roles
  if (!roles || typeof roles !== 'object' || Array.isArray(roles)) bad('its list has no roles (a slot [min, max] per role)')
  for (const k of Object.keys(roles)) if (!ROLES.includes(k)) bad(`its list's roles name "${k}", which is no role (there are ${ROLES.join(', ')})`)
  let mins = 0
  for (const r of ROLES) {
    const slot = roles[r]
    if (!Array.isArray(slot) || slot.length !== 2 || !whole(slot[0], 0, l.units) || !whole(slot[1], slot[0], l.units)) bad(`its list's ${r} slot is ${JSON.stringify(slot)}, not [min, max] with 0 ≤ min ≤ max ≤ ${l.units} units`)
    mins += slot[0]
  }
  if (mins > l.units) bad(`its list's slot minimums sum to ${mins} units, over its ${l.units}`)
}

for (const name of Object.keys(MISSIONS)) checkMission(name, MISSIONS[name])

// The classic matchup: the Bushtails in seat 0, the Coil in seat 1. The
// page's default seat races (app/flow.js names them in every title-screen
// mode's setup unless ?races= picks another pair; data-check pairs the
// legacy sides with them), beside the mission they are fought over.
// Presentation's default, not a rule: a setup names its seats' races
// itself, and createMatch (core/index.js fullSetup) refuses one that doesn't
// rather than fill them in from here; sim/'s corpus setups name theirs too.
// RULES_ID hashes the races' data and the missions, never this pairing.
export const CLASSIC = Object.freeze(['squirrel', 'serpent'])
