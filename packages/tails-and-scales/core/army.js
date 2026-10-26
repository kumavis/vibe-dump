// The armies a setup's seats name (F11a, DESIGN §4.2.8): a preset of the
// seat's race, or a list of unit counts, checked against its mission's list
// rules (data/mission.js `list`: the points limit, the most units and
// models, each role's slot, the most of one unit).
//
//   setup.seats[i].army   absent (or null): the mission's preset, mission.army
//                         a preset's name: one of race.armies' keys (defineRace
//                         derives 'classic' from the race's army, so it is
//                         always there)
//                         a list: LIST, one digit per roster entry, in roster
//                         order, no trailing zeros; missing entries are 0
//
// Consensus code: core/index.js's fullSetup refuses a setup whose army
// armyOf refuses, and newState builds each seat's units from armyOf's keys,
// seat 0's then seat 1's, each in roster order (§4.1 rules 6 and 23). The
// classic preset expands to exactly the race's `army`, so a setup naming no
// army, 'classic' or its counts ('112111') makes the classic battle unit
// for unit. Nothing else in the core reads a list: no new state, nothing in
// stateHash or the trace.
//
// Pure, and it draws nothing: it imports only the race data, the missions
// and core/util.js, so the layers above the consensus code may import it
// (sim/boundaries.mjs: a door on the present/, view/, input/, ui/ and app/
// surfaces, and match/'s), and the Muster screen asks the same checkList
// the fold refuses by. ("Only" is its own imports, which boundaries' PURE
// rule holds: data/mission.js loads core/rules.js for BOARD and ROUNDS,
// and rules.js imports the dice's `draw`, so core/rng.js is in the graph a
// door's importer loads, but nothing on any path from here calls it.)
// Every check is whole-number arithmetic in a fixed order, so every peer
// refuses the same setups with the same text.
//
//   LIST                      the count string's pattern
//   armyOf(setup, seat)       → { preset: name | null, counts: [per roster
//                             entry], keys: [unit key…] }; throws why not
//   checkList(race, rules, counts)   → null | why: the first rule broken
//   priceOf(race, key, rules) what one unit costs under the list rules:
//                             (F8b) the mission's own price where its list
//                             names one (`rules.prices`), else the unit's cost
//   listCost(race, counts, rules)   Σ counts[i] × the roster entry's price
//                             (rules left out: its cost, the classic battle's)
//   unitPrice(setup, u)       (F8b) what unit u (a match's: its race and key)
//                             costs in the battle `setup` is fought (its
//                             mission's list's prices): the card's, the
//                             roster's and the group card's price
//   listText(counts)          the canonical digits (trailing zeros dropped)
//   keysOf(race, list)        unit keys in roster order, for the UI and the
//                             desync report
//   autoList(race, rules, seed, { troops })   a random legal list: a
//                             client's tool, never called by the fold
import { RACES, ROLES, LIST } from '../data/schema.js'
import { MISSIONS } from '../data/mission.js'
import { mulberry32 } from './util.js'

export { LIST }

// a preset's name: it starts with a letter, so it never reads as a list
const NAME = /^[a-z][a-z0-9-]*$/

// A value as a refusal shows it: JSON's text where it has one, cut short
// (an army is a seat's field, which any peer may write), or its type. The
// cut is at 47 UTF-16 units, one fewer where the 47th would leave half a
// surrogate pair (an emoji), so the text never holds a lone surrogate.
function shown(v) {
  let text
  try {
    text = JSON.stringify(v)
  } catch {
    text = undefined
  }
  if (typeof text !== 'string') return typeof v
  if (text.length <= 48) return text
  const cut = /[\ud800-\udbff]/.test(text[46]) ? 46 : 47
  return `${text.slice(0, cut)}…`
}

// counts a list's tools take: whole numbers, at least 0 (a missing or null
// one is 0), or why not
const countsWhy = (counts) => {
  if (!Array.isArray(counts)) return `a list's counts are an array, not ${shown(counts)}`
  const bad = counts.find((n) => n != null && !(Number.isInteger(n) && n >= 0))
  return bad === undefined ? null : `a list's counts are whole numbers from 0, not ${shown(bad)}`
}

// The list rules' size, as the refusals name it ("a Skirmish army"): the
// mission's list's `size`, or a battle's for a list that has none.
const sizeOf = (rules) => rules.size ?? 'battle'
const units = (n, what) => `${n} ${what} unit${n === 1 ? '' : 's'}`

// The first of the list rules `rules` (a mission's `list`) that `counts`
// (one whole number per roster entry, missing ones 0) breaks, as the text
// a refusal carries after "seat i's army: ", or null when the list is
// legal. In order: the points; the units, then the models; each role in
// ROLES order, its minimum then its maximum (F9a: Vehicle last, a slot like
// any, [0, 0] in a Skirmish: "1 Vehicle; none in a Skirmish"); each roster
// entry against perKind. (autoList draws a vehicle like any unit, where its
// slot has room: none at Skirmish, so a Skirmish list draws as it did.)
export function checkList(race, rules, counts) {
  // (only a client can hand it anything but digits: the fold's counts are
  // a count string's)
  const odd = countsWhy(counts)
  if (odd) return odd
  const S = sizeOf(rules)
  const n = (i) => counts[i] ?? 0
  const cost = listCost(race, counts, rules)
  if (cost > rules.points) return `${cost} points, over the ${S} limit of ${rules.points}`
  let unitsIn = 0, models = 0
  const role = Object.create(null)
  for (const r of ROLES) role[r] = 0
  race.roster.forEach((k, i) => {
    const t = race.units[k]
    unitsIn += n(i)
    models += n(i) * t.models
    role[t.role] += n(i)
  })
  if (unitsIn > rules.units) return `${unitsIn} units; a ${S} army has at most ${rules.units}`
  if (models > rules.models) return `${models} models; a ${S} army has at most ${rules.models}`
  for (const r of ROLES) {
    const [min, max] = rules.roles[r], got = role[r]
    if (got < min) return `${got ? units(got, r) : `no ${r} unit`}; a ${S} army needs at least ${min}`
    if (got > max) return max ? `${units(got, r)}; at most ${max} in a ${S}` : `${got === 1 ? `1 ${r}` : units(got, r)}; none in a ${S}`
  }
  for (let i = 0; i < race.roster.length; i++) {
    if (n(i) > rules.perKind) return `${n(i)} ${race.units[race.roster[i]].short}; at most ${rules.perKind} of one unit in a ${S} army`
  }
  return null
}

// (F8b, DESIGN §4.2.8.2's fallback) What unit `key` of `race` costs to
// field under the list rules `rules` (a mission's `list`): the price the
// mission's list sets for it (`prices: { <race>: { <unit>: cost } }`, its
// own table for the units whose worth one table can't hold at every size;
// data/mission.js checks it), else the unit's `cost`. Own fields only (the
// tables are frozen data, but a race or unit named like an Object.prototype
// member must find nothing), and whole numbers either way.
export function priceOf(race, key, rules) {
  const own = rules?.prices && Object.hasOwn(rules.prices, race.key) ? rules.prices[race.key] : null
  return own && Object.hasOwn(own, key) ? own[key] : race.units[key].cost
}

// What a list costs under the list rules `rules`: each roster entry's count
// times the unit's price there (priceOf; `rules` left out, each unit's
// cost).
export const listCost = (race, counts, rules) => race.roster.reduce((sum, k, i) => sum + (counts[i] ?? 0) * priceOf(race, k, rules), 0)

// (F8b) What unit `u` of a match (its race's key and its unit key) costs in
// the battle fought on `setup` (a match's G.setup: its mission, classic when
// it names none): its mission's price for it (priceOf), the price the
// view shows on the card, the roster and the group card, so a Field or
// Grand battle shows its own prices, never the Skirmish's.
export const unitPrice = (setup, u) => priceOf(RACES[u.race], u.key, MISSIONS[setup?.mission ?? 'classic']?.list)

// A list's one spelling: a digit per count, trailing zeros dropped (so a
// list of no units is '', which LIST refuses).
export function listText(counts) {
  for (const n of counts) if (!Number.isInteger(n) || n < 0 || n > 9) throw new Error(`a list's counts are digits from 0 to 9, not ${shown(n)}`)
  return counts.join('').replace(/0+$/, '')
}

// A count string's counts, one per roster entry (missing entries 0).
const countsOf = (race, text) => race.roster.map((k, i) => (i < text.length ? text.charCodeAt(i) - 48 : 0))

// The unit keys a list fields, in roster order: `list` a count string, a
// preset's name of the race or the counts themselves.
export function keysOf(race, list) {
  let counts = list
  if (typeof list === 'string') {
    const text = NAME.test(list) && Object.hasOwn(race.armies, list) ? race.armies[list] : list
    if (!LIST.test(text) || text.length > race.roster.length) throw new Error(`the ${race.name} have no army ${shown(list)}`)
    counts = countsOf(race, text)
  }
  const odd = countsWhy(counts)
  if (odd) throw new Error(odd)
  return race.roster.flatMap((k, i) => Array(counts[i] ?? 0).fill(k))
}

// A registry's entry by name, looked up only for a string: an object's own
// toString never runs (MISSIONS and RACES have no prototype, so only an own
// name finds anything).
const byName = (table, name) => (typeof name === 'string' ? table[name] : undefined)

// The army seat `seat` of a filled-in setup takes, or the refusal (§4.2.8.4,
// in its order): the army a string (absent, the mission's preset); a
// preset's name one of the race's; anything else a list of counts no
// longer than the roster; then checkList against the mission's list rules.
// (fullSetup has refused an unknown mission, race or controller first; a
// caller that hasn't is refused here too.)
export function armyOf(setup, seat) {
  const name = setup?.mission ?? 'classic'
  const mission = byName(MISSIONS, name)
  if (!mission) throw new Error(`no mission ${shown(name)}`)
  const rec = setup.seats?.[seat]
  // (fullSetup has refused a race that is no name)
  const race = byName(RACES, rec?.race)
  if (!race) throw new Error(`seat ${seat}: no race ${shown(rec?.race)}`)
  const army = rec.army ?? mission.army
  if (typeof army !== 'string') throw new Error(`seat ${seat}'s army is a preset's name or a list of counts, not ${shown(army)}`)
  let preset = null, text = army
  if (NAME.test(army)) {
    // (race.armies has no prototype: 'toString' is no preset)
    const names = Object.keys(race.armies)
    if (!Object.hasOwn(race.armies, army)) throw new Error(`the ${race.name} have no army ${shown(army)} (there ${names.length === 1 ? 'is' : 'are'} ${names.join(', ')})`)
    preset = army
    text = race.armies[army]
  } else if (!LIST.test(army)) {
    throw new Error(`seat ${seat}'s army ${shown(army)} is neither a preset nor a list of counts`)
  } else if (army.length > race.roster.length) {
    throw new Error(`seat ${seat}'s list ${shown(army)} counts ${army.length} kinds of unit; the ${race.name} muster ${race.roster.length} (${race.roster.join(' ')})`)
  }
  const counts = countsOf(race, text)
  const why = checkList(race, mission.list, counts)
  if (why) throw new Error(`seat ${seat}'s army: ${why}`)
  return { preset, counts, keys: keysOf(race, counts) }
}

// A random legal list for `race` under the list rules `rules` (DESIGN
// §4.2.8.6), as counts: one hero (the race's first Hero in roster order);
// Troops to their slot's minimum, each drawn among the race's Troops; then
// units drawn among those whose one more still passes every cap (points,
// units, models, the role's maximum, perKind), a Troops unit `troops` times
// as likely as another, until none fits. It draws from its own
// mulberry32(seed), never the match's dice: a client builds a Random seat's
// list with it before the start, and the setup records the list, so the
// fold never calls it and changing it needs no bump.
export function autoList(race, rules, seed, { troops = 1.5 } = {}) {
  const rng = mulberry32(seed)
  const counts = race.roster.map(() => 0)
  const roleOf = (i) => race.units[race.roster[i]].role
  const ofRole = (r) => race.roster.reduce((n, k, i) => n + (roleOf(i) === r ? counts[i] : 0), 0)
  let cost = 0, unitsIn = 0, models = 0
  // (each unit at its price under these rules, priceOf)
  const price = race.roster.map((k) => priceOf(race, k, rules))
  const take = (i) => {
    const t = race.units[race.roster[i]]
    counts[i]++
    cost += price[i]
    unitsIn++
    models += t.models
  }
  const fits = (i) => {
    const t = race.units[race.roster[i]]
    return cost + price[i] <= rules.points && unitsIn < rules.units && models + t.models <= rules.models &&
      ofRole(t.role) < rules.roles[t.role][1] && counts[i] < rules.perKind
  }
  const all = race.roster.map((k, i) => i)
  const hero = all.find((i) => roleOf(i) === 'Hero')
  if (hero !== undefined && fits(hero)) take(hero)
  const troopers = all.filter((i) => roleOf(i) === 'Troops')
  while (ofRole('Troops') < rules.roles.Troops[0]) {
    const can = troopers.filter(fits)
    if (!can.length) break
    take(can[Math.floor(rng() * can.length)])
  }
  for (;;) {
    const can = all.filter(fits)
    if (!can.length) break
    const weight = (i) => (roleOf(i) === 'Troops' ? troops : 1)
    let r = rng() * can.reduce((w, i) => w + weight(i), 0)
    let pick = can[can.length - 1]
    for (const i of can) {
      r -= weight(i)
      if (r < 0) {
        pick = i
        break
      }
    }
    take(pick)
  }
  return counts
}
