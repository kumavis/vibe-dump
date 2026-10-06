// The race data against the rules it replaced (DESIGN §2.8, R2).
//
// The legacy code is the R0 commit (sim/lib.mjs's LEGACY_REF), whose
// rules.js holds TYPES, SIDES and ARMIES. It is a fixed anchor, not the
// PIN: the PIN moves at every deliberate re-record (N0, F4, F5, F7) to code
// that has none of this, so this check never follows it.
//
// 1. Every unit type the race data normalises (data/compat.js's TYPES view)
//    deep-equals the legacy TYPES, minus `side`, plus its key, race and AI
//    role and the derived fields. The expected flags are computed with the
//    legacy code's own tests, each of which must still be in its source word
//    for word: Sidewind ability text (charge after advancing), role Artillery
//    (no charge), the AI's brawler key test, `fx === 'acid'` (corrodes),
//    moveMode, the deploy rows, the eye and chest heights. So a flag that
//    drifted from the test it replaced fails here, by unit and field.
// 2. The races: names, shorts, icons, colours, the death voice and gore, and
//    armies as the legacy SIDES, ARMIES and killModel had them; every race's
//    voice is a sound sfx.js can play; the AI roles are the ones ai.js
//    orders by.
// 3. defineRace refuses malformed race data (one broken field at a time),
//    and the registry refuses two races with one key.
// 4. Seats: makeSeats seats any race in either seat, gives the edge by seat
//    and never by race, and refuses a race name that is only an
//    Object.prototype member ('toString', '__proto__', …): seat races come
//    from a URL now and from a lobby a peer writes later.
// 5. RULES_ID (core/version.js) moves when anything rule-bearing changes (a
//    stat, a weapon, a flag, the army, a constant, the phase order, a unit
//    or race whose key happens to be a presentation word, the terrain sets:
//    a feature's weight or footprint, the centre rule, the pair count, a
//    spacing rule, a feature table reordered, a new set) and stays put when
//    only presentation does (names, shorts, icon, ability text, look, a
//    weapon's name or fx).
// 6. Every table core/ and data/ export is deeply frozen: no module-level
//    mutable state in consensus code (DESIGN §1.2, §4.1 rule 13).
// 7. The terrain sets: checkSet (core/terrain/recipes.js, which sets.js runs
//    on every set as it loads) passes classic and refuses a set with a broken
//    field, one at a time: a feature or centre piece that doesn't exist, a
//    radius, weight or threshold out of range, falling thresholds, bad
//    pairs, an unknown mirror, a spacing rule that isn't a number, an unknown
//    or missing field. So a slip in a new set (F7's `fortified`) fails at
//    load, not only on the boards whose draws reach it.
// 8. Every core/ and data/ module loads as the only entry of a fresh Node
//    process. core/ has import cycles (match.js with units.js and deploy.js,
//    for the seat helpers; queries.js with actions/, for canAct). They are
//    harmless while no module uses an imported binding as it loads; one that
//    does (a frozen table built from an imported function, `export const x
//    = alive`) throws a TDZ error that only some entry points reach. A
//    control cycle that does it must fail from the entry that reaches it.
//
//   node sim/data-check.mjs
//
// Exit 0 when everything holds, else 1.
import { readFileSync, readdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { pathToFileURL } from 'node:url'
import { isDeepStrictEqual } from 'node:util'
import { execFile } from 'node:child_process'
import { PKG } from './oracle/pin.mjs'
import { legacyDir, LEGACY_REF, pool, CPUS } from './lib.mjs'

const LEGACY = legacyDir()
const imp = (dir, f) => import(pathToFileURL(join(dir, f)).href)
const legacy = await imp(LEGACY, 'rules.js')
const legacyMain = readFileSync(join(LEGACY, 'main.js'), 'utf8')
const legacyAi = readFileSync(join(LEGACY, 'ai.js'), 'utf8')
const { TYPES, ARMIES, SIDES, CLASSIC } = await imp(PKG, 'data/compat.js')
const { RACES, AI_ROLES, defineRace, raceRegistry } = await imp(PKG, 'data/schema.js')
const { RULES_ID, rulesId, rulesData, CONSTANTS } = await imp(PKG, 'core/version.js')
const { SETS } = await imp(PKG, 'core/terrain/sets.js')
const { checkSet } = await imp(PKG, 'core/terrain/recipes.js')
const { makeSeats } = await imp(PKG, 'core/match.js')
const raw = { squirrel: (await imp(PKG, 'data/races/squirrel.js')).default, serpent: (await imp(PKG, 'data/races/serpent.js')).default }

let failed = 0
const check = (ok, what, why = '') => {
  if (!ok) failed++
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}${!ok && why ? `: ${why}` : ''}`)
  return ok
}
// the first path where two values differ, for a readable failure
function diffPath(a, b, path = '') {
  if (isDeepStrictEqual(a, b)) return null
  if (a && b && typeof a === 'object' && typeof b === 'object' && Array.isArray(a) === Array.isArray(b)) {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      const d = diffPath(a[k], b[k], `${path}.${k}`)
      if (d) return d
    }
  }
  return `${path || '(top)'}: got ${JSON.stringify(a)}, legacy ${JSON.stringify(b)}`
}
// a table literal out of an ai.js (it exports neither)
const literal = (src, name) => {
  const m = new RegExp(`const ${name} = ([\\[{][\\s\\S]*?[\\]}])\\n`).exec(src)
  if (!m) throw new Error(`ai.js has no "const ${name} = …"`)
  return Function(`return ${m[1]}`)()
}

// ── 1. unit types ───────────────────────────────────────────────────────────
console.log(`1. unit types against the legacy TYPES of the R0 code (${LEGACY_REF.slice(0, 12)})`)
// The legacy tests the flags replace, as the R0 source has them. Each is
// restated below as a function of a legacy type, so the source must hold it
// verbatim for the restatement to stand for it.
const LEGACY_TESTS = [
  [legacyMain, "u.t.role === 'Artillery' || u.mesmerized", 'canCharge: no charge for artillery'],
  [legacyMain, "u.flags.advanced && !u.t.abilities?.some((a) => a.startsWith('Sidewind'))", 'canCharge: Sidewind may charge after advancing'],
  [legacyMain, "if (sel?.t.abilities?.some((a) => a.startsWith('Sidewind'))) adv.textContent", 'the Advance button text'],
  [legacyMain, "{ acid: w.fx === 'acid' }", 'blastLands: acid eats stone'],
  [legacyMain, "return u.t.fly ? 'fly' : u.t.wrecker ? 'wreck' : 'walk'", 'moveMode'],
  [legacyMain, "const back = list.filter((u) => u.t.role === 'Artillery')\n    const mid = list.filter((u) => u.t.hero)", 'deployArmies rows'],
  [legacyMain, 'const eyeY = (u) => (u.t.big ? 1.9 : u.t.fly ? 1.5 : 0.95)', 'eye height'],
  [legacyMain, 'const chestY = (u) => (u.t.big ? 1.0 : u.t.fly ? 1.0 : 0.55)', 'chest height'],
  [legacyAi, "const brawler = !e.t.ranged || e.t.wrecker || e.key === 'sidewinder' || e.key === 'oakguard'", "the AI's brawler test"],
  [legacyAi, 'const role = ROLE[u.key]', "the AI's role table"],
]
// (missing text means LEGACY_REF no longer names the R0 commit)
const legacySays = (src, text, what) => check(src.includes(text), `the R0 code says ${what}`, `"${text}" not found: sim/lib.mjs's LEGACY_REF must name the R0 commit`)
for (const [src, text, what] of LEGACY_TESTS) legacySays(src, text, what)
const ROLE = literal(legacyAi, 'ROLE')
const legacyRace = (side) => CLASSIC[side]
function expected(key, L) {
  const { side, ...rest } = L
  const acid = (w) => (w && w.fx === 'acid' ? { ...w, corrodes: true } : w)
  return {
    ...rest,
    key, race: legacyRace(side), ai: ROLE[key],
    ranged: acid(L.ranged), melee: acid(L.melee),
    fly: !!L.fly, big: !!L.big, hero: !!L.hero, wrecker: !!L.wrecker, burrow: false,
    chargeAfterAdvance: !!L.abilities?.some((a) => a.startsWith('Sidewind')),
    noCharge: L.role === 'Artillery',
    brawler: !!(!L.ranged || L.wrecker || key === 'sidewinder' || key === 'oakguard'),
    move: L.fly ? 'fly' : L.wrecker ? 'wreck' : 'walk',
    deployRow: L.role === 'Artillery' ? 'back' : L.hero ? 'mid' : 'front',
    eye: L.big ? 1.9 : L.fly ? 1.5 : 0.95,
    chest: L.big ? 1.0 : L.fly ? 1.0 : 0.55,
  }
}
const legacyKeys = Object.keys(legacy.TYPES).sort(), keys = Object.keys(TYPES).sort()
check(isDeepStrictEqual(keys, legacyKeys), `the same ${legacyKeys.length} unit keys`, `got ${keys.join(',')}`)
for (const key of legacyKeys) {
  const L = legacy.TYPES[key], t = TYPES[key]
  if (!t) continue
  const why = [diffPath(t, expected(key, L))]
  // the derivations stand on their own, without the explicit flags: hero is
  // role Hero, no unit sits in two deploy rows, and the schema's brawler rule
  // gives what ai.js's key test gave
  if (!!L.hero !== (L.role === 'Hero')) why.push(`legacy hero ${L.hero} but role ${L.role}`)
  if (L.role === 'Artillery' && L.hero) why.push('both artillery and hero: two deploy rows')
  if (!!(!L.ranged || L.wrecker) !== !!(!L.ranged || L.wrecker || key === 'sidewinder' || key === 'oakguard')) why.push('brawler = !ranged || wrecker misses the key test')
  if (!(Object.isFrozen(t) && Object.isFrozen(t.melee) && (!t.ranged || Object.isFrozen(t.ranged)))) why.push('not frozen')
  const flags = ['ai', 'brawler', 'noCharge', 'chargeAfterAdvance', 'move', 'deployRow'].map((k) => `${k} ${t[k]}`).join(', ')
  check(!why.some(Boolean), `${key.padEnd(11)} ${t.name.padEnd(22)} ${flags}${t.ranged?.corrodes ? ', corrodes' : ''}`, why.filter(Boolean).join('; '))
}

// ── 2. races ────────────────────────────────────────────────────────────────
console.log('\n2. races against the legacy SIDES, ARMIES and killModel')
// killModel's death voice and gore, by side, as the R0 source has them (no
// trace shows either, so parity can't see a typo in a race's look)
const LEGACY_LOOK = [{ voice: 'squeak', gore: ['#cf6d2a', '#f1dcb5'] }, { voice: 'hiss', gore: ['#3f8f4a', '#d9cf86'] }]
legacySays(legacyMain, 'if (u.side === 0) sfx.squeak()\n  else sfx.hiss()', 'killModel: the death voice by side')
legacySays(legacyMain, "u.side === 0 ? ['#cf6d2a', '#f1dcb5'] : ['#3f8f4a', '#d9cf86']", 'killModel: the gore colours by side')
for (const side of [0, 1]) {
  const r = RACES[CLASSIC[side]], L = legacy.SIDES[side]
  const got = { name: r.name, short: r.short, icon: r.icon, color: r.look.team, dark: r.look.dark, voice: r.look.voice, gore: r.look.gore }
  const wantSide = { name: L.name, short: L.short, icon: L.icon, color: L.color, dark: L.dark }
  const want = { ...wantSide, ...LEGACY_LOOK[side] }
  check(!diffPath(got, want), `seat ${side}: ${r.name}`, diffPath(got, want))
  check(isDeepStrictEqual(r.army, legacy.ARMIES[side]) && isDeepStrictEqual(ARMIES[side], legacy.ARMIES[side]), `seat ${side}: the army`, `got ${r.army.join(',')}`)
  check(Object.values(r.units).every((t) => legacy.TYPES[t.key]?.side === side), `seat ${side}: every unit was side ${side}'s`)
  const view = { name: SIDES[side].name, short: SIDES[side].short, icon: SIDES[side].icon, color: SIDES[side].color, dark: SIDES[side].dark }
  check(!diffPath(view, wantSide), `seat ${side}: the classic SIDES view`, diffPath(view, wantSide))
}
// killModel plays sfx[look.voice](), and sfx.js's proxy turns a name it
// lacks into silence: so every race's voice must be one of the kit's sounds
const kit = [...(/^const S = \{\n([\s\S]*?)^\}/m.exec(readFileSync(join(PKG, 'sfx.js'), 'utf8'))?.[1] ?? '').matchAll(/^ {2}(\w+)\(/gm)].map((m) => m[1])
const mute = Object.values(RACES).filter((r) => !kit.includes(r.look.voice))
check(kit.length && !mute.length, `every race's voice is a sound sfx.js plays (${Object.values(RACES).map((r) => `${r.key} ${r.look.voice}`).join(', ')})`, kit.length ? mute.map((r) => `${r.key}: no "${r.look.voice}" in ${kit.join(', ')}`).join('; ') : "no `const S = {` kit in sfx.js")
const order = literal(readFileSync(join(PKG, 'ai.js'), 'utf8'), 'ORDER')
check(isDeepStrictEqual(order, literal(legacyAi, 'ORDER')), "ai.js's ORDER is unchanged")
check(isDeepStrictEqual([...AI_ROLES].sort(), [...order].sort()), 'the schema accepts exactly the AI roles ai.js orders by', `${AI_ROLES} v ${order}`)

// ── 3. validation ───────────────────────────────────────────────────────────
console.log('\n3. defineRace refuses malformed data')
const breakIt = (what, edit, want) => {
  const def = structuredClone(raw.serpent)
  edit(def)
  let err = null
  try {
    defineRace(def)
  } catch (e) {
    err = e.message
  }
  check(err && want.test(err), what, err ? `wrong error: ${err}` : 'accepted')
}
check(!!defineRace(structuredClone(raw.serpent)), 'an unbroken copy is accepted')
breakIt('an unknown unit field', (d) => (d.units.brute.wreckker = true), /unit brute: unknown field "wreckker"/)
breakIt('a stat missing', (d) => (d.units.brute.stats = 'M6 WS3 BS6 S6 T6 W9 A4 Ld8 Sv4'), /unit brute.*lacks OC/)
breakIt('a stat given twice', (d) => (d.units.brute.stats += ' M7'), /M given twice/)
breakIt('a flag that is not a boolean', (d) => (d.units.sidewinder.chargeAfterAdvance = 'yes'), /chargeAfterAdvance must be true or false/)
breakIt('an unknown role', (d) => (d.units.brute.role = 'Beast'), /role must be one of/)
breakIt('an unknown AI role', (d) => (d.units.brute.ai = 'berserk'), /ai must be one of/)
breakIt('a weapon without strength', (d) => delete d.units.engine.ranged.S, /ranged: a ranged weapon needs S/)
breakIt('a melee weapon with a range', (d) => (d.units.brute.melee.range = 2), /melee: a melee weapon has no range/)
breakIt('an army listing a unit the race lacks', (d) => d.army.push('nutkin'), /army lists "nutkin"/)
breakIt('an army listing an Object.prototype name', (d) => d.army.push('constructor'), /army lists "constructor"/)
breakIt('an army listing __proto__', (d) => d.army.push('__proto__'), /army lists "__proto__"/)
breakIt('a colour that is not #rrggbb', (d) => (d.look.alt = 'green'), /look.alt must be a #rrggbb colour/)
breakIt('a unit key that is not lower-case', (d) => (d.units.Brute = d.units.brute), /unit key "Brute" must be lower-case/)
breakIt('a unit keyed __proto__', (d) => Object.defineProperty(d.units, '__proto__', { value: d.units.brute, enumerable: true }), /unit key "__proto__" must be lower-case/)
let dupErr = null
try {
  raceRegistry([raw.squirrel, raw.serpent, structuredClone(raw.serpent)])
} catch (e) {
  dupErr = e.message
}
check(dupErr && /two races use the key "serpent"/.test(dupErr), 'the registry refuses two races with one key', dupErr ?? 'accepted')
check(isDeepStrictEqual(raceRegistry([raw.squirrel, raw.serpent]), RACES), 'the registry of the two race files is RACES')

// ── 4. seats ────────────────────────────────────────────────────────────────
console.log('\n4. seats')
const seatError = (races, ctrl = ['ai', 'ai']) => {
  try {
    makeSeats(races, ctrl)
    return null
  } catch (e) {
    return e.message
  }
}
const pairs = Object.keys(RACES).flatMap((a) => Object.keys(RACES).map((b) => [a, b]))
check(pairs.every((p) => !seatError(p)), `makeSeats seats every race in either seat (${pairs.length} pairings)`, pairs.map(seatError).find(Boolean))
check(pairs.every((p) => isDeepStrictEqual(makeSeats(p, ['human', 'ai']).map((s) => s.edge), [-1, 1])), 'the edge follows the seat (−1 then +1), whatever the races')
check(Object.getPrototypeOf(RACES) === null && Object.values(RACES).every((r) => Object.getPrototypeOf(r.units) === null), 'RACES and every race\'s units have no prototype')
for (const name of ['toString', '__proto__', 'constructor', 'hasOwnProperty', 'valueOf', '']) {
  for (const seat of [0, 1]) {
    const races = seat ? ['serpent', name] : [name, 'serpent']
    const err = seatError(races)
    check(err && new RegExp(`seat ${seat}: no race`).test(err), `makeSeats refuses race ${JSON.stringify(name)} in seat ${seat}`, err ?? 'accepted')
  }
}
check(/controller "robot"/.test(seatError(['squirrel', 'serpent'], ['human', 'robot']) ?? ''), 'makeSeats refuses an unknown controller')

// ── 5. RULES_ID ─────────────────────────────────────────────────────────────
console.log(`\n5. RULES_ID (${RULES_ID})`)
check(typeof RULES_ID === 'string' && RULES_ID === rulesId(), 'is a string and recomputes the same')
// the classic terrain set with one edit (a copy: the real one is frozen)
const classic = (edit) => {
  const c = structuredClone(SETS.classic)
  edit(c)
  return rulesId({ sets: { ...SETS, classic: c } })
}
const variant = (race, edit) => {
  const def = structuredClone(raw[race])
  edit(def)
  return rulesId({ races: { ...RACES, [race]: defineRace(def) } })
}
const moves = [
  ['a stat (Scaleguard M5 → M6)', () => variant('serpent', (d) => (d.units.scaleguard.stats = d.units.scaleguard.stats.replace('M5', 'M6')))],
  ['a weapon (Slingshots S3 → S4)', () => variant('squirrel', (d) => (d.units.nutkin.ranged = { ...d.units.nutkin.ranged, S: 4 }))],
  ['a range (Acid globe 30" → 31")', () => variant('serpent', (d) => (d.units.engine.ranged.range = 31))],
  ['a flag (Brute loses wrecker)', () => variant('serpent', (d) => (d.units.brute.wrecker = false))],
  ['a flag (Scaleguard may charge after advancing)', () => variant('serpent', (d) => (d.units.scaleguard.chargeAfterAdvance = true))],
  ['corrodes (the Acid globe stops eating stone)', () => variant('serpent', (d) => delete d.units.engine.ranged.corrodes)],
  ['the AI role (Oak Guard as line)', () => variant('squirrel', (d) => (d.units.oakguard.ai = 'line'))],
  ['points (Nutkin 7 → 8)', () => variant('squirrel', (d) => (d.units.nutkin.pts = 8))],
  ['a base (Brute 0.95 → 1)', () => variant('serpent', (d) => (d.units.brute.base = 1))],
  ['the army order', () => variant('squirrel', (d) => d.army.reverse())],
  ['a constant (AURA 6 → 7)', () => rulesId({ constants: { ...CONSTANTS, AURA: 7 } })],
  ['the board (deploy 8 → 9)', () => rulesId({ constants: { ...CONSTANTS, BOARD: { ...CONSTANTS.BOARD, deploy: 9 } } })],
  ['the phase order', () => rulesId({ phases: ['move', 'charge', 'shoot', 'fight', 'morale'] })],
  // the terrain sets (R3): every number in them places scenery
  ['a terrain feature weight (classic ruin 4 → 5)', () => classic((c) => (c.kinds[0][2] = 5))],
  ['a terrain feature footprint (classic wall 3.6 → 3.7)', () => classic((c) => (c.kinds[1][1] = 3.7))],
  ['the terrain feature order (classic wall before ruin)', () => classic((c) => c.kinds.unshift(...c.kinds.splice(1, 1)))],
  ['the centre rule (classic tower under 0.55 → 0.6)', () => classic((c) => (c.centre[0][1] = 0.6))],
  ['the feature pairs (classic 6 + D3 → 7 + D3)', () => classic((c) => (c.pairs[0] = 7))],
  ['a spacing rule (classic gap 2.1 → 2.0)', () => classic((c) => (c.gap = 2.0))],
  ['the forest kept out of deployment no more', () => classic((c) => (c.notInDeploy = []))],
  ['a new terrain set', () => rulesId({ sets: { ...SETS, fortified: structuredClone(SETS.classic) } })],
]
for (const [what, id] of moves) check(id() !== RULES_ID, `moves on ${what}`)
check(rulesData().sets === SETS, 'hashes the terrain sets (core/terrain/sets.js)')
// a unit or race whose key is a presentation word is rules all the same:
// RULES_ID strips fields from records, never keys from the race and unit maps
const retune = (t) => (t.stats = t.stats.replace('M6', 'M7'))
const withUnit = (key, edit = () => {}) => variant('serpent', (d) => {
  d.units[key] = structuredClone(d.units.brute)
  edit(d.units[key])
})
const withRace = (key, edit = () => {}) => {
  const def = { ...structuredClone(raw.serpent), key }
  edit(def.units.brute)
  return rulesId({ races: { ...RACES, [key]: defineRace(def) } })
}
check(withUnit('fx', retune) !== withUnit('fx'), 'moves on a retune of a unit keyed "fx"')
check(withRace('look') !== RULES_ID, 'moves on a race keyed "look" (added)')
check(withRace('look', retune) !== withRace('look'), 'moves on a retune of a race keyed "look"')
const stays = [
  ['a unit name', () => variant('serpent', (d) => (d.units.brute.name = 'Constrictor Bruiser'))],
  ['a unit short', () => variant('squirrel', (d) => (d.units.elder.short = 'Elder C.'))],
  ['a race name and short', () => variant('serpent', (d) => Object.assign(d, { name: 'Coil of Ssss', short: 'Snakes' }))],
  ['the icon', () => variant('squirrel', (d) => (d.icon = '*'))],
  ['ability text', () => variant('serpent', (d) => (d.units.sidewinder.abilities = ['Slither.']))],
  ['the look', () => variant('serpent', (d) => (d.look = { ...d.look, team: '#000000', voice: 'squeak' }))],
  ['a weapon name', () => variant('squirrel', (d) => (d.units.trebuchet.ranged = { ...d.units.trebuchet.ranged, name: 'Pinecone of doom' }))],
  ['a weapon fx', () => variant('serpent', (d) => (d.units.engine.ranged.fx = 'bomb'))],
  // the control for the set edits above: a copy of the sets hashes the same
  ['an unchanged copy of the terrain sets', () => classic(() => {})],
]
for (const [what, id] of stays) check(id() === RULES_ID, `stays on ${what}`)

// ── 6. frozen tables ────────────────────────────────────────────────────────
console.log('\n6. every table core/ and data/ export is deeply frozen')
// (not data/races/*.js: a race file's definition is defineRace's input, which
// it copies; RACES holds the frozen copy, and nothing else reads them)
const deepFrozen = (v, seen = new Set()) => !v || typeof v !== 'object' || seen.has(v) ||
  (seen.add(v), Object.isFrozen(v) && Object.values(v).every((x) => deepFrozen(x, seen)))
// every module at any depth under core/ and data/, so a new subdirectory
// can't drop out of the check
const consensus = ['core', 'data'].flatMap((d) => readdirSync(join(PKG, d), { recursive: true }).map((f) => `${d}/${f}`))
  .filter((f) => f.endsWith('.js') && !f.startsWith('data/races/'))
for (const f of consensus) {
  // (a module that doesn't load is section 8's to explain)
  const mod = await imp(PKG, f).catch((e) => check(false, `${f} loads`, e.message))
  if (!mod) continue
  const tables = Object.entries(mod).filter(([, v]) => v && typeof v === 'object')
  const loose = tables.filter(([, v]) => !deepFrozen(v)).map(([k]) => k)
  check(!loose.length, `${f}: ${tables.length ? tables.map(([k]) => k).join(', ') : 'no tables'}`, `not frozen: ${loose.join(', ')}`)
}

// ── 7. Terrain sets ─────────────────────────────────────────────────────────
console.log('\n7. checkSet passes the terrain sets and refuses broken ones')
const setError = (S) => {
  try {
    checkSet('test', S)
    return null
  } catch (e) {
    return e.message
  }
}
for (const name of Object.keys(SETS)) check(setError(SETS[name]) === null, `passes ${name}`, setError(SETS[name]))
const brokenSets = [
  ['a feature that does not exist', /no feature "keep"/, (c) => (c.kinds[0][0] = 'keep')],
  ['a feature named by an Object.prototype member', /no feature "toString"/, (c) => (c.kinds[2][0] = 'toString')],
  ['a feature entry without its weight', /kinds\[1\] must be/, (c) => c.kinds[1].pop()],
  ['a footprint of 0', /radius 0/, (c) => (c.kinds[3][1] = 0)],
  ['a weight that is not a number', /weight 2/, (c) => (c.kinds[4][2] = '2')],
  ['a negative weight', /weight -1/, (c) => (c.kinds[5][2] = -1)],
  ['no features at all', /at least one feature/, (c) => (c.kinds = [])],
  ['a centre piece that does not exist', /no centre piece "keep"/, (c) => (c.centre[0][0] = 'keep')],
  ['a centre threshold above 1', /threshold 1.2/, (c) => (c.centre[1][1] = 1.2)],
  ['centre thresholds that fall', /must rise/, (c) => c.centre.reverse()],
  ['fractional pairs', /pairs must be/, (c) => (c.pairs[1] = 2.5)],
  ['one pair count only', /pairs must be/, (c) => c.pairs.pop()],
  ['attempts that are not a whole number', /attempts/, (c) => (c.attempts = Infinity)],
  ['an unknown mirror', /mirror "line"/, (c) => (c.mirror = 'line')],
  ['a spacing rule that is not a number', /gap NaN/, (c) => (c.gap = NaN)],
  ['notInDeploy naming no feature', /notInDeploy: no feature "orchard"/, (c) => c.notInDeploy.push('orchard')],
  ['a misspelt field', /unknown field "gapp"/, (c) => (c.gapp = 2.1)],
  ['a missing field', /no "selfGap"/, (c) => delete c.selfGap],
]
for (const [what, want, edit] of brokenSets) {
  const c = structuredClone(SETS.classic)
  edit(c)
  const err = setError(c)
  check(err && want.test(err), `refuses ${what}`, err ?? 'accepted')
}

// ── 8. each module loads alone ──────────────────────────────────────────────
console.log('\n8. every core/ and data/ module loads as the only entry of a fresh process')
// null when the module at `file` loads, else the first line of its error
const loadAlone = (file) => new Promise((done) => {
  execFile(process.execPath, ['--input-type=module', '-e', 'await import(process.argv[1])', pathToFileURL(file).href], (err, _, stderr) => {
    done(err ? (stderr.split('\n').find((l) => /Error/.test(l)) ?? `exit ${err.code}`).trim() : null)
  })
})
// the control: b.js's first import is a.js, which reads b's binding as it
// loads, so b.js as the entry fails; a.js as the entry loads b.js first, so
// it passes. A check that loaded every module from one entry would pass both.
const tmp = mkdtempSync(join(tmpdir(), 'ts-load-'))
try {
  writeFileSync(join(tmp, 'a.js'), "import { b } from './b.js'\nexport const early = b + 1\n")
  writeFileSync(join(tmp, 'b.js'), "import { early } from './a.js'\nexport const b = 1\nexport const late = () => early\n")
  writeFileSync(join(tmp, 'package.json'), '{ "type": "module" }\n')
  const [a, b] = await Promise.all([loadAlone(join(tmp, 'a.js')), loadAlone(join(tmp, 'b.js'))])
  check(a === null && /ReferenceError/.test(b ?? ''), 'control: a cycle read too early fails from the entry that reaches it, and only there', `a.js: ${a ?? 'loads'}; b.js: ${b ?? 'loads'}`)
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
const modules = ['core', 'data'].flatMap((d) => readdirSync(join(PKG, d), { recursive: true }).map((f) => `${d}/${f}`)).filter((f) => f.endsWith('.js')).sort()
const loads = await pool(modules, CPUS, (f) => loadAlone(join(PKG, f)))
const broken = modules.filter((f, i) => loads[i] !== null)
check(modules.length > 10 && !broken.length, `${modules.length} modules each load alone`, broken.map((f) => `${f}: ${loads[modules.indexOf(f)]}`).join('; '))

console.log(failed ? `\ndata-check FAILED: ${failed} problem(s)` : '\ndata-check passed: the race data is the legacy data, RULES_ID tracks exactly the rules, and the terrain sets are well formed')
process.exit(failed ? 1 : 0)
