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
// no rule of the battle does. (F8b) A list may also carry `prices`, its
// own price for some units (DESIGN §4.2.8.2's fallback; core/army.js
// priceOf, the one reader): what a list costs in that battle, the unit's
// `cost` for the rest. `classic` is the Skirmish: its board and depth
// are the ruleset's own BOARD and its rounds ROUNDS (core/rules.js, which
// the constants hash too; sim/data-check.mjs holds them equal), and every
// battle before F8b was fought on it. (F8b, DESIGN §4.2.3) `field` and
// `grand` are the larger battles, 60×40 at 1,000 points and 80×56 at 1,500,
// each fought on the `open` set (core/terrain/sets.js: the classic pieces,
// their counts scaled with the table's area) or (F7a) `fortified`, and taking its race's ×2 and
// ×3 presets (data/races/: '224222' and '336333', every race's). (F19a)
// `keg` is a Skirmish fought round a powder keg: classic's board, zones,
// rounds, points and list rules, on the `keg` set alone (classic's pieces
// with the keg at the centre), its four objectives clustered round the keg.
//
// Every mission is checked as this module loads (checkMission, as the
// terrain sets are): a slip in a new one fails at once, on every board.
import { BOARD, ROUNDS } from '../core/rules.js'
import { deepFreeze } from '../core/util.js'
import { SETS } from '../core/terrain/sets.js'
import { ROLES, RACES } from './schema.js'

// A registry with no prototype, so a mission named like an Object.prototype
// member (from a URL, or a lobby a peer writes) finds nothing.
export const MISSIONS = deepFreeze(Object.assign(Object.create(null), {
  classic: {
    board: { W: 40, H: 28 },
    deploy: BOARD.deploy,
    rounds: ROUNDS,
    army: 'classic',
    // (F11a) a Skirmish: 500 points, exactly one hero, at least one Troops
    // unit, at most 3 of any one unit (the classic lists cost 485 and 495);
    // (F9a) no vehicle (the Skirmish's lanes are too tight for a hull:
    // DESIGN §4.2.5's measurements)
    list: {
      size: 'Skirmish', points: 500, units: 10, models: 36, perKind: 3,
      roles: { Hero: [1, 1], Troops: [1, 6], Elite: [0, 2], Fast: [0, 2], Monster: [0, 1], Artillery: [0, 1], Vehicle: [0, 0] },
    },
    // (F7a) and `fortified`, the fortifications to climb, which F7a adds to
    // every mission's sets (the first stays each mission's default)
    sets: ['classic', 'fortified'],
    // the centre, and one pair in each half, the table's point mirror
    objectives: [
      { x: 0, z: 0 },
      { x: -9, z: 8 },
      { x: 9, z: -8 },
      { x: -9, z: -8 },
      { x: 9, z: 8 },
    ],
  },
  // (F8b) a Field battle: 60×40, zones 12" deep, 6 rounds, 1,000 points
  field: {
    board: { W: 60, H: 40 },
    deploy: 12,
    rounds: 6,
    army: 'field',
    // 1,000 points, one or two heroes, at least 2 Troops units, at most 5
    // of any one unit (the ×2 presets cost 980 and 950 at its prices);
    // (F9a) at most two vehicles
    list: {
      size: 'Field', points: 1000, units: 18, models: 70, perKind: 5,
      roles: { Hero: [1, 2], Troops: [2, 10], Elite: [0, 3], Fast: [0, 3], Monster: [0, 2], Artillery: [0, 2], Vehicle: [0, 2] },
      // (F8b, DESIGN §4.2.8.2's fallback) a Field battle's own prices,
      // fitted by sim/army-sim.mjs on its boards: no one table priced the
      // Brute, the Grenadiers and the artillery at every size, so the
      // races' `cost` stays the Skirmish's and these are the Field's. The
      // heroes carry the race-level handicap (§4.2.8.2 step 3). ((F8b's
      // review) The Nutkin and the Trebuchet moved to the fit pooled over
      // three seeds, 80 → 70 and 40 → 55, and judged on a fourth.)
      prices: {
        squirrel: { elder: 75, oakguard: 115, nutkin: 70, grenadier: 45, glider: 60, trebuchet: 55 },
        serpent: { hierophant: 45, brute: 135, scaleguard: 65, spitter: 50, sidewinder: 70, engine: 45 },
      },
    },
    // (F7a) and `fortified`, as every mission's
    sets: ['open', 'fortified'],
    // the centre, classic's two pairs pushed out to the larger table, and a
    // pair on the centre line toward the long edges
    objectives: [
      { x: 0, z: 0 },
      { x: -11, z: 10 },
      { x: 11, z: -10 },
      { x: -11, z: -10 },
      { x: 11, z: 10 },
      { x: 0, z: -14 },
      { x: 0, z: 14 },
    ],
  },
  // (F8b) a Grand battle: 80×56, zones 14" deep, 7 rounds, 1,500 points
  // (§4.2.1's envelope: the largest board, list and battle the budgets hold)
  grand: {
    board: { W: 80, H: 56 },
    deploy: 14,
    rounds: 7,
    army: 'grand',
    // 1,500 points, one to three heroes, at least 3 Troops units, at most 7
    // of any one unit (the ×3 presets cost 1,350 and 1,485 at its prices);
    // (F9a) at most two vehicles
    list: {
      size: 'Grand', points: 1500, units: 24, models: 90, perKind: 7,
      roles: { Hero: [1, 3], Troops: [3, 14], Elite: [0, 4], Fast: [0, 4], Monster: [0, 3], Artillery: [0, 3], Vehicle: [0, 2] },
      // (F8b, the fallback as at Field) a Grand battle's own prices. The
      // Coil's big units are worth more here than its ×3 preset may cost
      // within 1,500 points, so the units the AI makes least of at this
      // size (the Hierophant past the first, the Venom Engine, the
      // Trebuchet) are priced down to keep both presets legal. ((F8b's
      // review) Kept as shipped: these pass Grand's gates on the seed they
      // were tuned on only, and no table tried passed a seed it wasn't
      // tuned on; the Bushtails' lists are held by their slots and models
      // here, not their points. army-sim reports Grand and judges it not:
      // the Grand rebalance is a ROADMAP item, DESIGN's F8b notes.)
      // ((F9a) The War-Cart at 150 here, its Field 40: one model and one
      // unit, it filled the slots and models the Bushtails' points left
      // over, so at 40 they scored 60.6% on open and 67.0% fortified (seed
      // 1111) and the fit put it at 103 ± 39; at 150 the points bind their
      // lists again (612 of 1,000), open is 47.2%, fortified 57.2%, and
      // every unit sits inside its band, the cart 112 ± 30.)
      prices: {
        squirrel: { elder: 75, oakguard: 130, nutkin: 70, grenadier: 35, trebuchet: 15, warcart: 150 },
        serpent: { hierophant: 10, brute: 170, scaleguard: 85, spitter: 50, sidewinder: 80, engine: 15 },
      },
    },
    // (F7a) and `fortified`, as every mission's
    sets: ['open', 'fortified'],
    // the centre, two diagonal pairs, a pair on the long axis toward the
    // zones and a pair on the centre line toward the long edges
    objectives: [
      { x: 0, z: 0 },
      { x: -14, z: 14 },
      { x: 14, z: -14 },
      { x: -14, z: -14 },
      { x: 14, z: 14 },
      { x: -24, z: 0 },
      { x: 24, z: 0 },
      { x: 0, z: -20 },
      { x: 0, z: 20 },
    ],
  },
  // (F19a) The powder keg: a Skirmish (classic's 40×28, zones 8" deep, 5
  // rounds, 500 points and its list rules, the classic preset) fought for
  // four objectives clustered round a powder keg at the table's centre
  // (data/hazards.js: a 3" blast when it goes off), none at the centre
  // itself: each 2.5" from the keg (a 3-4-5 triangle, so exactly), so a
  // unit holding one from its near side stands in the blast. First come,
  // first served, until somebody sets it off: a template or acid landing
  // near it, or the Brute walking through it.
  keg: {
    board: { W: 40, H: 28 },
    deploy: BOARD.deploy,
    rounds: ROUNDS,
    army: 'classic',
    // ((F9a, at its merge) and a Skirmish's Vehicle slot, [0, 0]: no hull
    // ever stands by the keg, so no keg's blast has met a War-Cart in play)
    list: {
      size: 'Skirmish', points: 500, units: 10, models: 36, perKind: 3,
      roles: { Hero: [1, 1], Troops: [1, 6], Elite: [0, 2], Fast: [0, 2], Monster: [0, 1], Artillery: [0, 1], Vehicle: [0, 0] },
    },
    // (the keg's own set alone: no other set has a keg)
    sets: ['keg'],
    objectives: [
      { x: -2, z: 1.5 },
      { x: 2, z: -1.5 },
      { x: -2, z: -1.5 },
      { x: 2, z: 1.5 },
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
// Vehicle [0, 0] are both legal: every mission names the Vehicle slot, a
// role of ROLES since F9a). (F8b) And `prices`, when given (DESIGN
// §4.2.8.2's fallback: the mission's own price for a unit whose worth one
// table can't hold at every size, core/army.js priceOf): a record by race
// key, each a record by that race's unit keys, each price a whole multiple
// of 5 above 0, as a unit's cost is. RULES_ID hashes it with the mission.
const LIST_KEYS = ['size', 'points', 'units', 'models', 'perKind', 'roles', 'prices']
const record = (v) => !!v && typeof v === 'object' && !Array.isArray(v)
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
  // (read once, here: the army builder's data, sim/flag-lint.mjs's one
  // allowed site outside core/army.js)
  const prices = l.prices
  if (prices === undefined) return
  if (!record(prices)) bad(`its list's prices are ${JSON.stringify(prices)}, not a record of prices by race`)
  for (const r of Object.keys(prices)) {
    // (RACES has no prototype: a race named "toString" is none)
    const race = RACES[r], own = prices[r]
    if (!race) bad(`its list prices "${r}", which is no race (there are ${Object.keys(RACES).join(', ')})`)
    if (!record(own) || !Object.keys(own).length) bad(`its list's prices for ${r} are ${JSON.stringify(own)}, not a record of prices by unit`)
    for (const [k, v] of Object.entries(own)) {
      if (!Object.hasOwn(race.units, k)) bad(`its list prices ${r}'s "${k}", which is no unit of theirs (there are ${Object.keys(race.units).join(', ')})`)
      if (!Number.isInteger(v) || v <= 0 || v % 5 !== 0) bad(`its list prices ${r}'s ${k} at ${JSON.stringify(v)}, not a whole multiple of 5 above 0`)
    }
  }
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
