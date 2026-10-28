// ---------------------------------------------------------------------------
// Race data: how a race file is written, and what the rules read from it.
//
// A race file (data/races/*.js) is plain data: names, colours, the classic
// army list, (F11a) the roster and each unit's cost, and each unit's stat
// line, weapons and ability flags. defineRace checks it and normalises it
// into the unit types the rules read as `u.t`: the stat line parsed into
// flat numbers (so `u.t.M` still works), every flag a boolean, plus the
// fields derived from the rest. Abilities are flags here,
// each read by exactly one rules module; the ability text is card copy and
// nothing reads it. The result is frozen, and it is consensus data: RULES_ID
// (core/version.js) hashes the rule-bearing part of it.
//
// What is presentation and never changes play: `name`, `short`, `icon`,
// `look`, `abilities` and a weapon's `name` and `fx`. Names still have to
// stay exactly as they are: they appear in the battle log, which the parity
// corpus pins.
//
//   defineRace({ key, name, short, icon,
//                look: { team, dark, alt, gore: [a, b], voice, models, anim },
//                army: [unitKey…], roster: [unitKey…], armies?: { [name]: counts },
//                units: { [key]: UnitDef } })
//   UnitDef = { name, short, role, ai, models, base, pts, cost,
//               stats: 'M7 WS4 BS4 S3 T3 W1 A1 Ld6 Sv6 OC2',
//               ranged: Weapon | null, melee: Weapon, abilities: [text…],
//               (V3c) spells?: [Spell…] in ranged's place,
//               fly?, big?, hero?, wrecker?, burrow?, chargeAfterAdvance?,
//               noCharge?, brawler?, climb?, vehicle?, swarm?: { min }, swoop?: { chargeS },
//               transport?: Transport }
//   Weapon  = { name, range?, shots?, S, AP, D, assault?, heavy?, indirect?,
//               blast?, scenery?, poison?, corrodes?, spell?, mesmerize?,
//               ward?, snare?, resolve?, fx? }
//   Transport = { capacity, maxBase, fire, deck, wreck: false | { hx, hy, hz },
//                 siege?, enclosed? }      (F9a, DESIGN §4.2.5)
//
// (V3c, DESIGN §2.8) A caster's spells: `spells`, one to nine weapons each
// with its cast value (`spell`, 2D6 ≥ it), given instead of `ranged`; the
// unit's `ranged` is its first spell, the very record (so every rule that
// reads a unit's ranged weapon reads that one, as before there were
// several), and a `shoot` command's `sp` names the one it casts
// (core/commands.js). A spell either strikes as a weapon does (a template
// erupting under its target: blast, S, AP, D; scenery 0 wrecks nothing) or
// carries exactly one effect, which strikes by its own rules and needs no
// S, AP or D: mesmerize (D3 mortal wounds, the target mesmerized), snare
// (the target can't move or charge until the end of its next turn), ward
// (a friend saves at +1 until the caster's next turn) or resolve (a friend
// takes no morale test and re-rolls a failed charge until then). A ward or
// resolve spell is cast on a friend (core/actions/shoot.js allySpell).
//
// Derived, unless the unit sets them itself:
//   hero     = role is Hero                 noCharge = role is Artillery
//   brawler  = !ranged || wrecker           (what the AI fears in melee)
//   climb    = !big && !fly && !vehicle      (F7a: climbs ladders; F9a:
//                                            no vehicle climbs)
//   move     = fly ? 'fly' : wrecker ? 'wreck' : burrow ? 'burrow' : 'walk'
//   deployRow = Artillery ? 'back' : hero ? 'mid' : 'front'
//   eye      = big ? 1.9 : fly ? 1.5 : 0.95    (line-of-sight heights)
//   chest    = big ? 1.0 : fly ? 1.0 : 0.55
//
// (F11a, DESIGN §4.2.8) The army builder's data. `cost` is what a unit costs
// to field at full strength: a whole multiple of 5, with no default (the
// obvious one, pts × models, prices the classic matchup unfairly; `pts`
// stays the AI's own appraisal). `roster` lists each of the race's units
// exactly once, in the builder's order, and is append-only: a list of
// counts carries one digit per roster entry, so the order is what a list
// means. `army` (the classic list, unchanged) must be in roster order, so
// the classic preset expands to exactly `army`. `armies` holds the race's
// presets by name, each a count string (LIST: one digit per roster entry,
// no trailing zeros, no longer than the roster); the frozen race always
// has `classic`, derived from `army`, which a race file may not give by
// hand. core/army.js reads all of it; the rules read only `army` there.
//
// (F9a, DESIGN §4.2.5) Vehicles. `vehicle` marks a hull: one model (`models:
// 1`), big, and never a climber (its derived climb is false, and a def that
// sets climb on a vehicle is refused); it keeps to the ground (core/actions/
// move.js groundOnly, the plans' mode setup, is the one rules reader).
// `transport` makes a vehicle carry riders: `capacity` the models it holds
// (a whole number from 1 to 12: the War-Cart's two squads), `maxBase` the
// largest base it takes aboard (> 0), `fire` the rider units that may shoot
// from its deck (a whole number ≥ 0: F9c's firing decks; nothing reads it in
// F9a), `deck` the deck's height over the hull's floor (≥ 0), `wreck` the
// box a destroyed hull leaves (half-sizes { hx, hy, hz }, each > 0) or false
// for none, and `siege` and `enclosed` (F9d's towers, F5b's Beetle) optional
// booleans. A transport is a vehicle. core/actions/transport.js is the one
// rules reader of `transport` (sim/flag-lint.mjs's one-reader rows); the
// normalised type carries it frozen only where the def gives it, so every
// other unit's type is as it was but for its derived `vehicle: false`.
// ---------------------------------------------------------------------------

import { deepFreeze } from '../core/util.js'
import squirrel from './races/squirrel.js'
import serpent from './races/serpent.js'

export const STATS = Object.freeze(['M', 'WS', 'BS', 'S', 'T', 'W', 'A', 'Ld', 'Sv', 'OC'])
// (F9a: and Vehicle, the hulls, the army builder's slot of its own: none in
// a Skirmish, at most two in a Field or Grand battle, data/mission.js)
export const ROLES = Object.freeze(['Troops', 'Elite', 'Fast', 'Hero', 'Monster', 'Artillery', 'Vehicle'])
// the AI's unit roles (the order the AI plays its units in is its own:
// core/ai/policy.js's ORDER; F9a's transport, a hull carrying riders, plays
// first there)
export const AI_ROLES = Object.freeze(['melee', 'raider', 'line', 'shooter', 'hero', 'artillery', 'transport'])
// unit flags; each is a boolean on every normalised type
export const FLAGS = Object.freeze(['fly', 'big', 'hero', 'wrecker', 'burrow', 'chargeAfterAdvance', 'noCharge', 'brawler', 'climb', 'vehicle'])

const UNIT_KEYS = new Set(['name', 'short', 'role', 'ai', 'models', 'base', 'pts', 'cost', 'stats', 'ranged', 'spells', 'melee', 'abilities',
  ...FLAGS, 'move', 'deployRow', 'eye', 'chest', 'swarm', 'swoop', 'transport'])
// (F9a) a transport's fields: the numbers, then the optional booleans
const TRANSPORT_KEYS = new Set(['capacity', 'maxBase', 'fire', 'deck', 'wreck', 'siege', 'enclosed'])
const WEAPON_NUMS = ['range', 'shots', 'S', 'AP', 'D', 'blast', 'scenery', 'poison', 'spell']
const WEAPON_BOOLS = ['assault', 'heavy', 'indirect', 'corrodes', 'mesmerize', 'ward', 'snare', 'resolve']
// (V3c) a spell's effects, each struck by its own rules (at most one a spell)
const EFFECTS = ['mesmerize', 'ward', 'snare', 'resolve']
const WEAPON_KEYS = new Set(['name', 'fx', ...WEAPON_NUMS, ...WEAPON_BOOLS])
const MOVES = ['walk', 'fly', 'wreck', 'burrow']
const ROWS = ['front', 'mid', 'back']
const COLOUR = /^#[0-9a-f]{6}$/i
// a race's or unit's key: it names the race in a seat and the unit in an army
// list, and becomes part of URLs and, later, of a lobby a peer writes
const KEY = /^[a-z][a-z0-9-]*$/
// (F11a) an army list as counts: one digit per roster entry, in roster
// order, no trailing zeros (so every army has exactly one spelling, and one
// field carries a preset's name or a list: a name starts with a letter).
// core/army.js passes it on as its LIST. (Frozen, as every exported table
// is: a pattern's lastIndex is state, and nothing may write it.)
export const LIST = Object.freeze(/^[0-9]*[1-9]$/)

// 'M7 WS4 BS4 S3 T3 W1 A1 Ld6 Sv6 OC2' → { M: 7, WS: 4, … }: every stat once,
// each a whole number.
export function parseStats(line) {
  const out = {}
  for (const tok of String(line).trim().split(/\s+/)) {
    const m = /^([A-Za-z]+)(\d+)$/.exec(tok)
    if (!m || !STATS.includes(m[1])) throw new Error(`bad stat "${tok}" in "${line}"`)
    if (m[1] in out) throw new Error(`${m[1]} given twice in "${line}"`)
    out[m[1]] = Number(m[2])
  }
  const missing = STATS.filter((k) => !(k in out))
  if (missing.length) throw new Error(`"${line}" lacks ${missing.join(', ')}`)
  return out
}

function weapon(w, where, melee) {
  const bad = (why) => new Error(`${where}: ${why}`)
  if (!w || typeof w !== 'object') throw bad('must be a weapon object')
  for (const k of Object.keys(w)) if (!WEAPON_KEYS.has(k)) throw bad(`unknown field "${k}"`)
  if (typeof w.name !== 'string' || !w.name) throw bad('needs a name')
  if (w.fx !== undefined && typeof w.fx !== 'string') throw bad('fx is a string')
  for (const k of WEAPON_NUMS) if (w[k] !== undefined && !(Number.isFinite(w[k]) && w[k] >= 0)) throw bad(`${k} must be a number ≥ 0`)
  for (const k of WEAPON_BOOLS) if (w[k] !== undefined && typeof w[k] !== 'boolean') throw bad(`${k} must be true or false`)
  for (const k of ['shots', 'S', 'AP', 'D', 'scenery', 'poison', 'spell']) if (w[k] !== undefined && !Number.isInteger(w[k])) throw bad(`${k} must be a whole number`)
  const strike = ['S', 'AP', 'D']
  if (melee) {
    for (const k of strike) if (w[k] === undefined) throw bad(`a melee weapon needs ${k}`)
    for (const k of ['range', 'shots', 'blast', 'spell', 'indirect', 'heavy', 'assault', ...EFFECTS]) if (w[k] !== undefined) throw bad(`a melee weapon has no ${k}`)
  } else {
    if (w.range === undefined) throw bad('a ranged weapon needs a range')
    // a spell's effect (mesmerize, (V3c) ward, snare, resolve) strikes with
    // its own rules; anything else rolls to hit
    const effects = EFFECTS.filter((k) => w[k])
    if (effects.length > 1) throw bad(`a spell has one effect, not ${effects.join(' and ')}`)
    if (!effects.length) for (const k of ['shots', ...strike]) if (w[k] === undefined) throw bad(`a ranged weapon needs ${k}`)
    if (effects.length && !w.spell) throw bad(`${effects[0]} is a spell: give it a cast value`)
  }
  return { ...w }
}

// (F9a, DESIGN §4.2.5) A transport record, checked: its fields and no
// other, `capacity` a whole number from 1 to 12, `maxBase` a radius above 0,
// `fire` a whole number from 0, `deck` a height from 0, `wreck` false or a
// box of three half-sizes above 0, `siege` and `enclosed` true or false
// when given. A copy, the wreck's box its own.
function transportOf(tr, where) {
  const bad = (why) => new Error(`${where}, transport: ${why}`)
  if (!tr || typeof tr !== 'object' || Array.isArray(tr)) throw bad('must be { capacity, maxBase, fire, deck, wreck }')
  for (const k of Object.keys(tr)) if (!TRANSPORT_KEYS.has(k)) throw bad(`unknown field "${k}"`)
  if (!Number.isInteger(tr.capacity) || tr.capacity < 1 || tr.capacity > 12) throw bad(`capacity is the models it carries, a whole number from 1 to 12, not ${tr.capacity}`)
  if (!(Number.isFinite(tr.maxBase) && tr.maxBase > 0)) throw bad(`maxBase is the largest base it takes aboard, a radius above 0, not ${tr.maxBase}`)
  if (!Number.isInteger(tr.fire) || tr.fire < 0) throw bad(`fire is the rider units that shoot from the deck, a whole number from 0, not ${tr.fire}`)
  if (!(Number.isFinite(tr.deck) && tr.deck >= 0)) throw bad(`deck is the deck's height, a number from 0, not ${tr.deck}`)
  const w = tr.wreck
  if (w !== false && !(w && typeof w === 'object' && !Array.isArray(w) && Object.keys(w).length === 3 && ['hx', 'hy', 'hz'].every((k) => Number.isFinite(w[k]) && w[k] > 0))) throw bad('wreck is false or the box it leaves, { hx, hy, hz }, each a half-size above 0')
  for (const k of ['siege', 'enclosed']) if (tr[k] !== undefined && typeof tr[k] !== 'boolean') throw bad(`${k} must be true or false`)
  const out = { capacity: tr.capacity, maxBase: tr.maxBase, fire: tr.fire, deck: tr.deck, wreck: w && { hx: w.hx, hy: w.hy, hz: w.hz } }
  for (const k of ['siege', 'enclosed']) if (tr[k] !== undefined) out[k] = tr[k]
  return out
}

function unitType(race, key, def) {
  const where = `race ${race}, unit ${key}`
  const bad = (why) => new Error(`${where}: ${why}`)
  if (!def || typeof def !== 'object') throw bad('must be an object')
  for (const k of Object.keys(def)) if (!UNIT_KEYS.has(k)) throw bad(`unknown field "${k}"`)
  for (const k of ['name', 'short']) if (typeof def[k] !== 'string' || !def[k]) throw bad(`needs a ${k}`)
  if (!ROLES.includes(def.role)) throw bad(`role must be one of ${ROLES.join(', ')}`)
  if (!AI_ROLES.includes(def.ai)) throw bad(`ai must be one of ${AI_ROLES.join(', ')}`)
  if (!Number.isInteger(def.models) || def.models < 1) throw bad('models must be a whole number ≥ 1')
  if (!(Number.isFinite(def.base) && def.base > 0)) throw bad('base must be a radius > 0')
  if (!Number.isInteger(def.pts) || def.pts < 0) throw bad('pts must be a whole number ≥ 0')
  if (!Number.isInteger(def.cost) || def.cost <= 0 || def.cost % 5 !== 0) throw bad(`cost must be a whole multiple of 5 above 0 (what the unit costs to field), not ${def.cost}`)
  if (!Array.isArray(def.abilities) || def.abilities.some((a) => typeof a !== 'string')) throw bad('abilities is a list of card text')
  for (const k of FLAGS) if (def[k] !== undefined && typeof def[k] !== 'boolean') throw bad(`${k} must be true or false`)
  if (def.move !== undefined && !MOVES.includes(def.move)) throw bad(`move must be one of ${MOVES.join(', ')}`)
  if (def.deployRow !== undefined && !ROWS.includes(def.deployRow)) throw bad(`deployRow must be one of ${ROWS.join(', ')}`)
  for (const k of ['eye', 'chest']) if (def[k] !== undefined && !(Number.isFinite(def[k]) && def[k] > 0)) throw bad(`${k} must be a height > 0`)
  if (def.swarm !== undefined && !Number.isInteger(def.swarm?.min)) throw bad('swarm is { min }')
  if (def.swoop !== undefined && !Number.isInteger(def.swoop?.chargeS)) throw bad('swoop is { chargeS }')
  let stats
  try {
    stats = parseStats(def.stats)
  } catch (e) {
    throw bad(e.message)
  }
  // ((V3c) a caster's spells, in ranged's place: its ranged weapon is the
  // first of them, the same frozen record)
  let ranged, spells = null
  if (def.spells !== undefined) {
    if (def.ranged !== undefined) throw bad('a caster gives its spells, not a ranged weapon: its ranged weapon is its first spell')
    if (!Array.isArray(def.spells) || !def.spells.length || def.spells.length > 9) throw bad('spells is a list of one to nine spells')
    spells = def.spells.map((w, i) => weapon(w, `${where}, spell ${i}`, false))
    spells.forEach((w, i) => {
      if (!w.spell) throw bad(`spell ${i} (${w.name}) needs a cast value`)
    })
    ranged = spells[0]
  } else ranged = def.ranged === null ? null : weapon(def.ranged, `${where}, ranged`, false)
  const melee = weapon(def.melee, `${where}, melee`, true)

  const flag = (k, dflt) => (def[k] === undefined ? dflt : def[k])
  const fly = flag('fly', false), big = flag('big', false), wrecker = flag('wrecker', false), burrow = flag('burrow', false)
  const hero = flag('hero', def.role === 'Hero')
  // (F9a) a vehicle is one big model that never climbs; a transport is a
  // vehicle
  const vehicle = flag('vehicle', false)
  if (vehicle && def.models !== 1) throw bad('a vehicle is one model (models: 1)')
  if (vehicle && !big) throw bad('a vehicle is big (big: true)')
  if (vehicle && def.climb === true) throw bad('a vehicle never climbs (climb: true is refused)')
  if (def.transport !== undefined && !vehicle) throw bad('a transport is a vehicle (vehicle: true)')
  const transport = def.transport === undefined ? undefined : transportOf(def.transport, where)
  const t = {
    key, race, name: def.name, short: def.short, role: def.role, ai: def.ai, models: def.models, base: def.base, pts: def.pts, cost: def.cost,
    ...stats,
    ranged, melee, abilities: [...def.abilities],
    fly, big, hero, wrecker, burrow,
    chargeAfterAdvance: flag('chargeAfterAdvance', false),
    noCharge: flag('noCharge', def.role === 'Artillery'),
    brawler: flag('brawler', !ranged || wrecker),
    // (F7a) infantry climb ladders: not big units or fliers, nor (F9a)
    // vehicles; read only by the plans' mode setup (core/actions/move.js
    // climbs)
    climb: flag('climb', !big && !fly && !vehicle),
    vehicle,
    move: def.move ?? (fly ? 'fly' : wrecker ? 'wreck' : burrow ? 'burrow' : 'walk'),
    deployRow: def.deployRow ?? (def.role === 'Artillery' ? 'back' : hero ? 'mid' : 'front'),
    eye: def.eye ?? (big ? 1.9 : fly ? 1.5 : 0.95),
    chest: def.chest ?? (big ? 1.0 : fly ? 1.0 : 0.55),
  }
  if (spells) t.spells = spells
  if (def.swarm) t.swarm = { min: def.swarm.min }
  if (def.swoop) t.swoop = { chargeS: def.swoop.chargeS }
  if (transport) t.transport = transport
  return t
}

// Check a race definition and normalise it: { key, name, short, icon, look,
// army, roster, armies, units: { [key]: type } }, deeply frozen. Throws,
// naming the race and unit, on anything malformed, so a typo in a race file
// fails at load instead of playing a different game.
export function defineRace(def) {
  if (!def || typeof def !== 'object') throw new Error('defineRace needs a race object')
  const { key } = def
  if (typeof key !== 'string' || !KEY.test(key)) throw new Error(`race key "${key}" must be lower-case letters, digits and dashes`)
  const bad = (why) => new Error(`race ${key}: ${why}`)
  for (const k of Object.keys(def)) if (!['key', 'name', 'short', 'icon', 'look', 'army', 'roster', 'armies', 'units'].includes(k)) throw bad(`unknown field "${k}"`)
  for (const k of ['name', 'short', 'icon']) if (typeof def[k] !== 'string' || !def[k]) throw bad(`needs a ${k}`)
  const look = def.look
  if (!look || typeof look !== 'object') throw bad('needs a look')
  for (const k of ['team', 'dark', 'alt']) if (!COLOUR.test(look[k] ?? '')) throw bad(`look.${k} must be a #rrggbb colour`)
  if (!Array.isArray(look.gore) || look.gore.length !== 2 || !look.gore.every((c) => COLOUR.test(c))) throw bad('look.gore is two #rrggbb colours')
  for (const k of ['voice', 'models', 'anim']) if (typeof look[k] !== 'string' || !look[k]) throw bad(`look.${k} must be named`)
  if (!def.units || typeof def.units !== 'object' || !Object.keys(def.units).length) throw bad('needs units')
  // keyed lookups below (the army list, and every u.t later) must find only
  // the race's own units, never an Object.prototype name like 'constructor'
  const units = Object.create(null)
  for (const [k, u] of Object.entries(def.units)) {
    if (!KEY.test(k)) throw bad(`unit key "${k}" must be lower-case letters, digits and dashes`)
    units[k] = unitType(key, k, u)
  }
  if (!Array.isArray(def.army) || !def.army.length) throw bad('needs an army list')
  for (const k of def.army) if (!units[k]) throw bad(`army lists "${k}", which is not one of its units`)
  const roster = rosterOf(def, units, bad)
  return deepFreeze({
    key, name: def.name, short: def.short, icon: def.icon,
    look: { ...look, gore: [...look.gore] },
    army: [...def.army],
    roster,
    armies: armiesOf(def, roster, bad),
    units,
  })
}

// (F11a) The race's roster, checked: every unit once, nothing else, and the
// classic army in its order (each army entry at or after the one before it
// in the roster), so the classic preset's counts expand to exactly `army`.
function rosterOf(def, units, bad) {
  if (!Array.isArray(def.roster) || !def.roster.length) throw bad("needs a roster: each of its units once, in the army builder's order")
  const at = Object.create(null)
  def.roster.forEach((k, i) => {
    if (typeof k !== 'string' || !units[k]) throw bad(`roster lists ${JSON.stringify(k)}, which is not one of its units`)
    if (at[k] !== undefined) throw bad(`roster lists "${k}" twice`)
    at[k] = i
  })
  for (const k of Object.keys(units)) if (at[k] === undefined) throw bad(`roster leaves out "${k}"`)
  def.army.forEach((k, i) => {
    if (i && at[k] < at[def.army[i - 1]]) throw bad(`army is not in roster order: "${k}" comes after "${def.army[i - 1]}"`)
  })
  return [...def.roster]
}

// (F11a) The race's presets by name, as count strings: `classic` derived
// from the army (one digit per roster entry, trailing zeros dropped), then
// any the race file gives (F8b's field and grand), each checked. A registry
// with no prototype, so a preset named 'toString' finds nothing.
function armiesOf(def, roster, bad) {
  const counts = roster.map((k) => def.army.filter((x) => x === k).length)
  const over = counts.findIndex((n) => n > 9)
  if (over >= 0) throw bad(`its army fields ${counts[over]} "${roster[over]}": a list's count of one unit is one digit, 9 at most`)
  const armies = Object.create(null)
  armies.classic = counts.join('').replace(/0+$/, '')
  const given = def.armies ?? {}
  if (given === null || typeof given !== 'object' || Array.isArray(given)) throw bad('armies is a record of presets by name, each a list of counts')
  for (const [name, list] of Object.entries(given)) {
    if (!KEY.test(name)) throw bad(`a preset's name "${name}" must be lower-case letters, digits and dashes`)
    if (name === 'classic') throw bad('armies gives "classic", which is derived from its army')
    if (typeof list !== 'string' || !LIST.test(list)) throw bad(`armies.${name} is ${JSON.stringify(list)}, not a list of counts (a digit per roster entry, no trailing zeros)`)
    if (list.length > roster.length) throw bad(`armies.${name} "${list}" counts ${list.length} kinds of unit; the roster has ${roster.length}`)
    armies[name] = list
  }
  return armies
}

// The registry of the races in `defs`, by key, each through defineRace. Two
// races with one key are refused (a race file copied as the start of another
// and left with the old key would otherwise hide one of them). It has no
// prototype, so a lookup by a name that came from a URL or, later, from a
// lobby a peer wrote ('toString', '__proto__', 'constructor') finds nothing
// instead of an Object.prototype member.
export function raceRegistry(defs) {
  const races = defs.map((d) => defineRace(d))
  const keys = races.map((r) => r.key)
  const twice = keys.find((k, i) => keys.indexOf(k) !== i)
  if (twice !== undefined) throw new Error(`two races use the key "${twice}"`)
  return deepFreeze(Object.assign(Object.create(null), Object.fromEntries(races.map((r) => [r.key, r]))))
}

// Every playable race, by key. Seat races (G.seats[s].race) name one of
// these; a new race file is added to this list.
export const RACES = raceRegistry([squirrel, serpent])
