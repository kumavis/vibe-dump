// ---------------------------------------------------------------------------
// Race data: how a race file is written, and what the rules read from it.
//
// A race file (data/races/*.js) is plain data: names, colours, the army list
// and each unit's stat line, weapons and ability flags. defineRace checks it
// and normalises it into the unit types the rules read as `u.t`: the stat
// line parsed into flat numbers (so `u.t.M` still works), every flag a
// boolean, plus the fields derived from the rest. Abilities are flags here,
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
//                army: [unitKey…], units: { [key]: UnitDef } })
//   UnitDef = { name, short, role, ai, models, base, pts,
//               stats: 'M7 WS4 BS4 S3 T3 W1 A1 Ld6 Sv6 OC2',
//               ranged: Weapon | null, melee: Weapon, abilities: [text…],
//               fly?, big?, hero?, wrecker?, burrow?, chargeAfterAdvance?,
//               noCharge?, brawler?, swarm?: { min }, swoop?: { chargeS } }
//   Weapon  = { name, range?, shots?, S, AP, D, assault?, heavy?, indirect?,
//               blast?, scenery?, poison?, corrodes?, spell?, mesmerize?, fx? }
//
// Derived, unless the unit sets them itself:
//   hero     = role is Hero                 noCharge = role is Artillery
//   brawler  = !ranged || wrecker           (what the AI fears in melee)
//   move     = fly ? 'fly' : wrecker ? 'wreck' : burrow ? 'burrow' : 'walk'
//   deployRow = Artillery ? 'back' : hero ? 'mid' : 'front'
//   eye      = big ? 1.9 : fly ? 1.5 : 0.95    (line-of-sight heights)
//   chest    = big ? 1.0 : fly ? 1.0 : 0.55
// ---------------------------------------------------------------------------

import squirrel from './races/squirrel.js'
import serpent from './races/serpent.js'

export const STATS = Object.freeze(['M', 'WS', 'BS', 'S', 'T', 'W', 'A', 'Ld', 'Sv', 'OC'])
export const ROLES = Object.freeze(['Troops', 'Elite', 'Fast', 'Hero', 'Monster', 'Artillery'])
// the AI's unit roles (the order ai.js sorts its units by is its own)
export const AI_ROLES = Object.freeze(['melee', 'raider', 'line', 'shooter', 'hero', 'artillery'])
// unit flags; each is a boolean on every normalised type
export const FLAGS = Object.freeze(['fly', 'big', 'hero', 'wrecker', 'burrow', 'chargeAfterAdvance', 'noCharge', 'brawler'])

const UNIT_KEYS = new Set(['name', 'short', 'role', 'ai', 'models', 'base', 'pts', 'stats', 'ranged', 'melee', 'abilities',
  ...FLAGS, 'move', 'deployRow', 'eye', 'chest', 'swarm', 'swoop'])
const WEAPON_NUMS = ['range', 'shots', 'S', 'AP', 'D', 'blast', 'scenery', 'poison', 'spell']
const WEAPON_BOOLS = ['assault', 'heavy', 'indirect', 'corrodes', 'mesmerize']
const WEAPON_KEYS = new Set(['name', 'fx', ...WEAPON_NUMS, ...WEAPON_BOOLS])
const MOVES = ['walk', 'fly', 'wreck', 'burrow']
const ROWS = ['front', 'mid', 'back']
const COLOUR = /^#[0-9a-f]{6}$/i
// a race's or unit's key: it names the race in a seat and the unit in an army
// list, and becomes part of URLs and, later, of a lobby a peer writes
const KEY = /^[a-z][a-z0-9-]*$/

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
    for (const k of ['range', 'shots', 'blast', 'spell', 'mesmerize', 'indirect', 'heavy', 'assault']) if (w[k] !== undefined) throw bad(`a melee weapon has no ${k}`)
  } else {
    if (w.range === undefined) throw bad('a ranged weapon needs a range')
    // a mesmerize spell strikes with its own rules; anything else rolls to hit
    if (!w.mesmerize) for (const k of ['shots', ...strike]) if (w[k] === undefined) throw bad(`a ranged weapon needs ${k}`)
    if (w.mesmerize && !w.spell) throw bad('mesmerize is a spell: give it a cast value')
  }
  return { ...w }
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
  const ranged = def.ranged === null ? null : weapon(def.ranged, `${where}, ranged`, false)
  const melee = weapon(def.melee, `${where}, melee`, true)

  const flag = (k, dflt) => (def[k] === undefined ? dflt : def[k])
  const fly = flag('fly', false), big = flag('big', false), wrecker = flag('wrecker', false), burrow = flag('burrow', false)
  const hero = flag('hero', def.role === 'Hero')
  const t = {
    key, race, name: def.name, short: def.short, role: def.role, ai: def.ai, models: def.models, base: def.base, pts: def.pts,
    ...stats,
    ranged, melee, abilities: [...def.abilities],
    fly, big, hero, wrecker, burrow,
    chargeAfterAdvance: flag('chargeAfterAdvance', false),
    noCharge: flag('noCharge', def.role === 'Artillery'),
    brawler: flag('brawler', !ranged || wrecker),
    move: def.move ?? (fly ? 'fly' : wrecker ? 'wreck' : burrow ? 'burrow' : 'walk'),
    deployRow: def.deployRow ?? (def.role === 'Artillery' ? 'back' : hero ? 'mid' : 'front'),
    eye: def.eye ?? (big ? 1.9 : fly ? 1.5 : 0.95),
    chest: def.chest ?? (big ? 1.0 : fly ? 1.0 : 0.55),
  }
  if (def.swarm) t.swarm = { min: def.swarm.min }
  if (def.swoop) t.swoop = { chargeS: def.swoop.chargeS }
  return t
}

function freeze(o) {
  if (o && typeof o === 'object' && !Object.isFrozen(o)) {
    Object.freeze(o)
    for (const v of Object.values(o)) freeze(v)
  }
  return o
}

// Check a race definition and normalise it: { key, name, short, icon, look,
// army, units: { [key]: type } }, deeply frozen. Throws, naming the race and
// unit, on anything malformed, so a typo in a race file fails at load
// instead of playing a different game.
export function defineRace(def) {
  if (!def || typeof def !== 'object') throw new Error('defineRace needs a race object')
  const { key } = def
  if (typeof key !== 'string' || !KEY.test(key)) throw new Error(`race key "${key}" must be lower-case letters, digits and dashes`)
  const bad = (why) => new Error(`race ${key}: ${why}`)
  for (const k of Object.keys(def)) if (!['key', 'name', 'short', 'icon', 'look', 'army', 'units'].includes(k)) throw bad(`unknown field "${k}"`)
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
  return freeze({
    key, name: def.name, short: def.short, icon: def.icon,
    look: { ...look, gore: [...look.gore] },
    army: [...def.army],
    units,
  })
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
  return freeze(Object.assign(Object.create(null), Object.fromEntries(races.map((r) => [r.key, r]))))
}

// Every playable race, by key. Seat races (G.seats[s].race) name one of
// these; a new race file is added to this list.
export const RACES = raceRegistry([squirrel, serpent])
