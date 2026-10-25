// The race data against the rules it replaced (DESIGN §2.8, R2).
//
// The legacy code is the R0 commit (sim/lib.mjs's LEGACY_REF), whose
// rules.js holds TYPES, SIDES and ARMIES. It is a fixed anchor, not the
// PIN: the PIN moves at every deliberate re-record (N0, F4, F5, F7) to code
// that has none of this, so this check never follows it.
//
// 1. Every unit type the race data normalises (the TYPES view built below
//    from RACES, in the legacy shape) deep-equals the legacy TYPES, minus
//    `side`, plus its key, race and AI
//    role and the derived fields. The expected flags are computed with the
//    legacy code's own tests, each of which must still be in its source word
//    for word: Sidewind ability text (charge after advancing), role Artillery
//    (no charge), the AI's brawler key test, `fx === 'acid'` (corrodes),
//    moveMode, the deploy rows, the eye and chest heights. So a flag that
//    drifted from the test it replaced fails here, by unit and field.
// 2. The races: names, shorts, icons, colours, the death voice and gore, and
//    armies as the legacy SIDES, ARMIES and killModel had them (the classic
//    matchup, data/mission.js's CLASSIC, seat by seat); every race's
//    voice is a sound view/sfx.js can play (its VOICES); the AI roles are
//    the ones the AI orders by (core/ai/policy.js's ORDER since R6a, ai.js's
//    before), in the legacy ai.js's order.
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
//    spacing rule, a feature table reordered, a new set; from R6a the
//    missions: an objective moved, the default rounds, the deployment depth,
//    a new mission) and stays put when only presentation does (names,
//    shorts, icon, ability text, look, a weapon's name or fx). The classic
//    mission's rounds and depth are the ruleset's ROUNDS and BOARD.deploy.
// 6. Every table core/ and data/ export is deeply frozen: no module-level
//    mutable state in consensus code (DESIGN §1.2, §4.1 rule 13). (A
//    module namespace re-exported whole, core/index.js's `q`, counts as
//    frozen when everything in it is: no importer can assign its bindings.)
// 7. The terrain sets: checkSet (core/terrain/recipes.js, which sets.js runs
//    on every set as it loads) passes classic and refuses a set with a broken
//    field, one at a time: a feature or centre piece that doesn't exist, a
//    radius, weight or threshold out of range, falling thresholds, bad
//    pairs, an unknown mirror, a spacing rule that isn't a number, an unknown
//    or missing field. So a slip in a new set (F7's `fortified`) fails at
//    load, not only on the boards whose draws reach it. (F8a) And the
//    missions: checkMission (data/mission.js, run on every mission as it
//    loads) passes each and refuses one with an odd or fractional board, a
//    zone reaching within 6" of the centre line, an objective under 1"
//    inside the board, in a zone or without its point mirror, rounds that
//    aren't whole, a set that doesn't exist, no army's name.
// 8. Every core/, data/ and match/ module loads as the only entry of a
//    fresh Node process. core/ has import cycles (match.js with units.js
//    and deploy.js, for the seat helpers; queries.js with actions/, for
//    canAct). They are harmless while no module uses an imported binding as
//    it loads; one that does (a frozen table built from an imported
//    function, `export const x = alive`) throws a TDZ error that only some
//    entry points reach. A control cycle that does it must fail from the
//    entry that reaches it.
// 9. (R8) The versions a match's start carries: CORE_VERSION a whole number
//    (1 through the refactor), RULES_ID and CORE_VERSION the same through
//    core/index.js as core/version.js computes them, the Folder's cap and
//    simultaneous decisions the spec's (5,000 entries; deploy and
//    roundLimit, §0.2 #3: R8's fixer, round 2), and the Session's
//    start entry carrying exactly those (match/session.js), so a Folder
//    with other ones opens the match read-only (merge-sim checks that
//    side). And stateHash, the fingerprint every single-seat entry
//    carries: it moves when anything §2.6 lists moves (a unit's x by one
//    ulp, a model's wounds, a flag, a chunk's hp or height, each field of
//    the turn, the decision's kind and seats, the dice; a slot at -0 apart
//    from +0) and stays put when only what isn't match state does (G.out,
//    G.onTrace, G.strict, the journal's trace, the nav).
// 10. (R8b) What the large battles need the netplay seams to allow, held:
//    - kinds and fields: KINDS is core/commands.js's RULES' keys, and decode
//      takes any safe whole number or boolean in any field of a known kind,
//      none of them required (a kind's fields missing, a stray one, a
//      boolean: legal() is the one judge of a body), and refuses an array,
//      an object, a string, a fraction or a whole number past 2^53; no
//      module of match/ reads RULES or a kind's field lists;
//    - reserved names: no field of any kind (its `fields`, and F4's `opt`
//      and `bools` when they come) is named as an envelope key (id, s, d,
//      p, h) or `t`, which bodyOf would strip or the kind would shadow
//      (the lint shown to find one planted in a copy);
//    - sizes: MAX_BYTES one constant of at least 1,024, the same for every
//      kind (each kind's entry padded to it decodes, a byte more doesn't);
//      the cap 5,000 entries, junk counted (a start and 4,999 junk entries
//      leave a match live, one more freezes it 'full'); the count exposed
//      (folder.count, session.count, a report's count);
//    - out of band: concede, desync and (N2) final only (match/fold.js's
//      OUT_OF_BAND; the one kind of core's that answers no decision is
//      concede; desync and final the Folder kinds a seat sends, a final
//      only with a head and a hash); in a hotseat battle, every kind from
//      the seat not waited on, from its own device after its head, is
//      refused as not its turn but concede and desync, and its final on the
//      head is never accepted (inert when its hash agrees, a desync when
//      not, stale on another head);
//    - the hash's format: today's stateHash of a few corpus matches pinned
//      under today's CORE_VERSION (a change to what shadowState prints must
//      bump CORE_VERSION and pin anew); UNIT_EXTRAS, a unit field a feature
//      adds, printed only where it isn't its default, in sorted key=value
//      (a doctored table shows a unit at its default hashing as before).
// (The setup's key whitelist, the spec's item 8, comes with F8a/F11, when
// the mission's and the army's keys land.)
// 11. (F11a, DESIGN §4.2.8, §4.2.9) The army builder's data:
//    - prices: every unit has `cost`, a whole multiple of 5 above 0; each
//      race's classic list costs what the v6 table says (485 and 495), at
//      most its mission's limit (500);
//    - rosters: each race's lists each of its units once, and starts with
//      the roster pinned below (ROSTER_PIN: a reorder or an insert would
//      silently change what every recorded and saved list means, so it
//      fails by name; an append passes), its classic army in roster order,
//      and its classic preset expanding to exactly that army;
//    - presets: every preset a count string no longer than the roster, and
//      legal for each mission whose `army` names it; every mission's own
//      preset there, and legal, for every race;
//    - missions: each as shipped passes checkMission, its `list` included;
//      checkMission takes a slot maximum of 10, a [0, 0] slot and a Grand
//      Troops [3, 14], and refuses each broken list rule by name (a
//      perKind of 10, a slot with min > max or max > units, minimums
//      summing past units, fractional points, …);
//    - every race fields a legal list at every mission: autoList on 100
//      seeds, each held to checkList;
//    - RULES_ID moves on a cost, the roster's order, a preset's digits or a
//      new preset, and a mission's list rules (and, section 5, stays on a
//      rename);
//    - defineRace refuses a unit without cost, a cost not a multiple of 5,
//      a roster missing a unit, listing one twice or one the race lacks,
//      an army out of roster order, a preset with trailing zeros, longer
//      than the roster, not a string, and a hand-given classic;
//    - the army/ corpus (sim/baselines/army/*.json, once recorded): every
//      list a setup in it names is legal under today's prices and costs at
//      most 90% of its mission's limit, so a retune of up to 10% keeps the
//      corpus playable (the row says how many lists it checked).
//
//   node sim/data-check.mjs
//
// Exit 0 when everything holds, else 1.
import { readFileSync, readdirSync, mkdtempSync, writeFileSync, rmSync, existsSync } from 'node:fs'
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
const { RACES, AI_ROLES, defineRace, raceRegistry } = await imp(PKG, 'data/schema.js')
const { RULES_ID, rulesId, rulesData, CONSTANTS } = await imp(PKG, 'core/version.js')
const { SETS } = await imp(PKG, 'core/terrain/sets.js')
const { MISSIONS, CLASSIC, checkMission } = await imp(PKG, 'data/mission.js')
const { BOARD, ROUNDS } = await imp(PKG, 'core/rules.js')
const { checkSet } = await imp(PKG, 'core/terrain/recipes.js')
const { makeSeats } = await imp(PKG, 'core/match.js')
const raw = { squirrel: (await imp(PKG, 'data/races/squirrel.js')).default, serpent: (await imp(PKG, 'data/races/serpent.js')).default }

// The legacy-shaped views of the race data, as the R0 rules.js had them:
// every unit type by key (the keys are unique across races today: a race
// that reuses one fails here, and its types must then be compared by race),
// the classic matchup's armies, and each classic seat's SIDES record.
const ALL = Object.values(RACES).flatMap((r) => Object.values(r.units))
const TYPES = Object.fromEntries(ALL.map((t) => [t.key, t]))
const ARMIES = CLASSIC.map((r) => RACES[r].army)
const SIDES = CLASSIC.map((r) => ({ name: RACES[r].name, short: RACES[r].short, icon: RACES[r].icon, color: RACES[r].look.team, dark: RACES[r].look.dark }))

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
check(new Set(ALL.map((t) => t.key)).size === ALL.length, 'no two races share a unit key', 'look their types up by race')
check(isDeepStrictEqual(keys, legacyKeys), `the same ${legacyKeys.length} unit keys`, `got ${keys.join(',')}`)
for (const key of legacyKeys) {
  const L = legacy.TYPES[key], t = TYPES[key]
  if (!t) continue
  // ((F11a) `cost`, the army builder's price, is new: the R0 code had none)
  const { cost, ...legacyShaped } = t
  const why = [diffPath(legacyShaped, expected(key, L))]
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
// The seats' look the page paints (ui/theme.js, main.js's SIDES) held to
// that legacy view for the classic matchup (with `mirror` false, F6's flag);
// and a mirror match, which paints seat 1 in its race's alternate colour and
// (F6) names each seat by its edge as well
const { sidesFor, isMirror } = await imp(PKG, 'ui/theme.js')
const seated = (races) => sidesFor(races.map((race, seat) => ({ seat, race })))
const classicWant = SIDES.map((s) => ({ ...s, mirror: false }))
check(isDeepStrictEqual(seated(CLASSIC).map((s) => ({ ...s })), classicWant) && !isMirror(CLASSIC.map((race, seat) => ({ seat, race }))), "ui/theme.js's sidesFor paints the classic seats as the legacy SIDES (and it is no mirror match)", diffPath(seated(CLASSIC).map((s) => ({ ...s })), classicWant))
for (const race of Object.keys(RACES)) {
  const twin = [race, race], r = RACES[race], got = seated(twin)
  const edge = (seat) => ` (${seat ? 'east' : 'west'})`
  const want = [0, 1].map((seat) => ({ name: r.name + edge(seat), short: r.short + edge(seat), icon: r.icon, color: seat ? r.look.alt : r.look.team, dark: r.look.dark, mirror: true }))
  check(isMirror(twin.map((race, seat) => ({ seat, race }))) && isDeepStrictEqual(got.map((s) => ({ ...s })), want) && r.look.alt !== r.look.team, `a mirror match of ${race}: seat 1 in its alternate colour (${r.look.alt}), seat 0 in its own (${r.look.team}), each named by its edge`, diffPath(got.map((s) => ({ ...s })), want) ?? (r.look.alt === r.look.team ? 'the alternate colour is the team colour' : 'isMirror says no'))
}
// a slain model plays sfx.voice(look.voice) (view/units.js), which is
// silence for a name view/sfx.js's VOICES lacks (R7 keyed the voices so;
// the root sfx.js's kit before): so every race's voice must be one of them
const kit = [...(/^const VOICES = \{\n([\s\S]*?)^\}/m.exec(readFileSync(join(PKG, 'view', 'sfx.js'), 'utf8'))?.[1] ?? '').matchAll(/^ {2}(\w+)\(/gm)].map((m) => m[1])
const mute = Object.values(RACES).filter((r) => !kit.includes(r.look.voice))
check(kit.length && !mute.length, `every race's voice is one view/sfx.js plays (${Object.values(RACES).map((r) => `${r.key} ${r.look.voice}`).join(', ')})`, kit.length ? mute.map((r) => `${r.key}: no "${r.look.voice}" in ${kit.join(', ')}`).join('; ') : "no `const VOICES = {` in view/sfx.js")
const { ORDER } = await imp(PKG, 'core/ai/policy.js')
const order = [...ORDER]
check(isDeepStrictEqual(order, literal(legacyAi, 'ORDER')), "the AI's role order (core/ai/policy.js ORDER) is the legacy ai.js's")
check(isDeepStrictEqual([...AI_ROLES].sort(), [...order].sort()), 'the schema accepts exactly the AI roles the AI orders by', `${AI_ROLES} v ${order}`)

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
// the classic mission with one edit (a copy: the real one is frozen)
const mission = (edit) => {
  const m = structuredClone(MISSIONS.classic)
  edit(m)
  return rulesId({ missions: { ...MISSIONS, classic: m } })
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
  // ((F11a) the army stays in roster order, so the roster turns with it)
  ['the army order', () => variant('squirrel', (d) => d.army.reverse() && d.roster.reverse())],
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
  // the missions (R6a): where the objectives stand, the rounds, the zones
  ['an objective moved (classic centre 0,0 → 0,1)', () => mission((m) => (m.objectives[0].z = 1))],
  ['an objective added', () => mission((m) => m.objectives.push({ x: 0, z: 10 }))],
  ['the objectives reordered', () => mission((m) => m.objectives.reverse())],
  ['the default rounds (classic 5 → 6)', () => mission((m) => (m.rounds = 6))],
  ['the deployment depth (classic 8 → 9)', () => mission((m) => (m.deploy = 9))],
  ['a new mission', () => rulesId({ missions: { ...MISSIONS, raid: structuredClone(MISSIONS.classic) } })],
  // (F8a) the board the mission chooses, its sets and its army's name
  ['the board (classic 40×28 → 40×30)', () => mission((m) => (m.board.H = 30))],
  ['the sets a mission is fought on', () => mission((m) => m.sets.push('fortified'))],
  ["the mission's army (classic → field)", () => mission((m) => (m.army = 'field'))],
]
for (const [what, id] of moves) check(id() !== RULES_ID, `moves on ${what}`)
check(rulesData().sets === SETS, 'hashes the terrain sets (core/terrain/sets.js)')
check(rulesData().missions === MISSIONS, 'hashes the missions (data/mission.js)')
check(MISSIONS.classic.rounds === ROUNDS && MISSIONS.classic.deploy === BOARD.deploy, "the classic mission's rounds and depth are the ruleset's ROUNDS and BOARD.deploy")
// (F8a) classic's board is the ruleset's BOARD, so every classic battle
// computes the same doubles as before missions chose the board
check(MISSIONS.classic.board.W === BOARD.W && MISSIONS.classic.board.H === BOARD.H, "the classic mission's board is the ruleset's BOARD (40×28)", JSON.stringify(MISSIONS.classic.board))
// a unit or race whose key is a presentation word is rules all the same:
// RULES_ID strips fields from records, never keys from the race and unit maps
const retune = (t) => (t.stats = t.stats.replace('M6', 'M7'))
const withUnit = (key, edit = () => {}) => variant('serpent', (d) => {
  d.units[key] = structuredClone(d.units.brute)
  // ((F11a) a new unit joins the roster, at its end)
  d.roster.push(key)
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
  // and for the mission edits
  ['an unchanged copy of the missions', () => mission(() => {})],
]
for (const [what, id] of stays) check(id() === RULES_ID, `stays on ${what}`)

// ── 6. frozen tables ────────────────────────────────────────────────────────
console.log('\n6. every table core/ and data/ export is deeply frozen')
// (not data/races/*.js: a race file's definition is defineRace's input, which
// it copies; RACES holds the frozen copy, and nothing else reads them)
const isNamespace = (v) => Object.prototype.toString.call(v) === '[object Module]'
const deepFrozen = (v, seen = new Set()) => !v || typeof v !== 'object' || seen.has(v) ||
  (seen.add(v), (Object.isFrozen(v) || isNamespace(v)) && Object.values(v).every((x) => deepFrozen(x, seen)))
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
console.log('\n7. checkSet passes the terrain sets and refuses broken ones (F8a: checkMission the missions)')
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
// (F8a) the missions, as the sets
const missionError = (m) => {
  try {
    checkMission('test', m)
    return null
  } catch (e) {
    return e.message
  }
}
for (const name of Object.keys(MISSIONS)) check(missionError(MISSIONS[name]) === null, `checkMission passes ${name}`, missionError(MISSIONS[name]))
const brokenMissions = [
  ['a board of odd width', /board is 41×28/, (m) => (m.board.W = 41)],
  ['a board of fractional height', /board is 40×28.5/, (m) => (m.board.H = 28.5)],
  ['no board', /board is undefined×undefined/, (m) => delete m.board],
  ['a zone reaching within 6" of the centre line', /zone 15" deep/, (m) => (m.deploy = 15)],
  ['no zone', /zone 0" deep/, (m) => (m.deploy = 0)],
  ['an objective at the board\'s edge (and its mirror)', /less than 1" inside/, (m) => m.objectives.push({ x: 0, z: 13.5 }, { x: 0, z: -13.5 })],
  ['an objective in a zone (and its mirror)', /in a deployment zone/, (m) => m.objectives.push({ x: 13, z: 0 }, { x: -13, z: 0 })],
  ['an objective without its point mirror', /no point mirror/, (m) => (m.objectives[1].z = 9)],
  ['no objectives', /no objectives/, (m) => (m.objectives = [])],
  ['fractional rounds', /2.5 rounds/, (m) => (m.rounds = 2.5)],
  ['a set that does not exist', /aren't terrain sets/, (m) => m.sets.push('fortified')],
  ['a set named by an Object.prototype member', /aren't terrain sets/, (m) => (m.sets = ['toString'])],
  ['no sets', /aren't terrain sets/, (m) => (m.sets = [])],
  ['no army', /army has no name/, (m) => delete m.army],
]
for (const [what, want, edit] of brokenMissions) {
  const m = structuredClone(MISSIONS.classic)
  edit(m)
  const err = missionError(m)
  check(err && want.test(err), `checkMission refuses ${what}`, err ?? 'accepted')
}

// ── 8. each module loads alone ──────────────────────────────────────────────
console.log('\n8. every core/, data/ and match/ module loads as the only entry of a fresh process')
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
// (match/, R6b: the Session and the stores, pure like the core they fold)
const modules = ['core', 'data', 'match'].flatMap((d) => readdirSync(join(PKG, d), { recursive: true }).map((f) => `${d}/${f}`)).filter((f) => f.endsWith('.js')).sort()
const loads = await pool(modules, CPUS, (f) => loadAlone(join(PKG, f)))
const broken = modules.filter((f, i) => loads[i] !== null)
check(modules.length > 10 && !broken.length, `${modules.length} modules each load alone`, broken.map((f) => `${f}: ${loads[modules.indexOf(f)]}`).join('; '))

// ── 9. The versions and the hash ───────────────────────────────────────────
console.log(`\n9. the versions a start carries, and the match's hash`)
{
  const core = await imp(PKG, 'core/index.js')
  const version = await imp(PKG, 'core/version.js')
  check(Number.isInteger(version.CORE_VERSION) && version.CORE_VERSION >= 1, `CORE_VERSION is a whole number (${version.CORE_VERSION})`)
  check(core.CORE_VERSION === version.CORE_VERSION && core.RULES_ID === version.RULES_ID, 'core/index.js exports the same CORE_VERSION and RULES_ID')
  // (R8's fixer, round 2) the Folder's constants are the spec's: the log's
  // cap (§2.6) and the decisions whose entries carry no hash (§0.2 #3)
  const fold = await imp(PKG, 'match/fold.js')
  check(fold.MAX_ENTRIES === 5000, `the Folder caps the log at 5,000 entries, as §2.6 says (${fold.MAX_ENTRIES})`)
  check(JSON.stringify([...fold.SIMULTANEOUS].sort()) === '["deploy","roundLimit"]', `the Folder's simultaneous decisions are §0.2 #3's, the deployment and F4's vote (${fold.SIMULTANEOUS})`)
  const { LocalStore } = await imp(PKG, 'match/store.js')
  const { Session } = await imp(PKG, 'match/session.js')
  const store = new LocalStore()
  const setup = { board: 4242, dice: 99, seats: [{ race: 'squirrel', ctrl: 'human', dev: 'here' }, { race: 'serpent', ctrl: 'ai' }] }
  const ses = new Session({ store, localSeats: [0], dev: 'here' })
  ses.start(setup)
  const st = store.entries()[0]
  check(st.t === 'start' && st.core === core.CORE_VERSION && st.rules === core.RULES_ID && ses.status === 'live', 'the Session\'s start carries them, and its Folder begins the match', JSON.stringify({ ...st, setup: undefined }))
  // the hash against each field §2.6 lists, each edit made on a fresh fold of
  // the same log (G, a unit u and a breakable chunk c of it)
  const h = core.stateHash(ses.G)
  check(/^[0-9a-z]+$/.test(h) && core.stateHash(ses.G) === h, `is base 36 and reads alike twice (${h})`)
  const fresh = () => {
    const G = new Session({ store: new LocalStore(store.entries()), localSeats: [] }).G
    return [G, G.units[3], G.terrain.chunks.find((x) => x.alive && Number.isFinite(x.hp))]
  }
  const ulp = (x) => x + Math.abs(x) * Number.EPSILON
  const moves = [
    ["a unit's x by one ulp", (G, u) => (u.pos.x = ulp(u.pos.x))],
    ["a unit's z", (G, u) => (u.pos.z += 0.5)],
    ["a unit's radius", (G, u) => (u.r += 0.01)],
    ["a model's wounds", (G, u) => (u.models[0].w -= 1)],
    ["a model's slot", (G, u) => (u.models[0].ox += 0.001)],
    ['a model fallen', (G, u) => (u.models[0].alive = false)],
    ["a unit's count", (G, u) => (u.alive -= 1)],
    ["a unit's losses", (G, u) => (u.lost += 1)],
    ['a unit mesmerized', (G, u) => (u.mesmerized = true)],
    ['a flag', (G, u) => (u.flags.moved = true)],
    ["a chunk's hp", (G, u, c) => (c.hp -= 1)],
    ['a chunk fallen', (G, u, c) => (c.alive = false)],
    ["a chunk's height", (G, u, c) => (c.shape.y -= 0.25)],
    ["the turn's stage", (G) => (G.turn.stage = G.turn.stage === 'over' ? 'battle' : 'over')],
    ["the turn's step", (G) => (G.turn.step = 'phase')],
    ["the turn's round", (G) => (G.turn.round += 1)],
    ["the turn's t", (G) => (G.turn.t += 1)],
    ['who went first', (G) => (G.turn.first = G.turn.first === 1 ? 0 : 1)],
    ['the active seat', (G) => (G.turn.active = G.turn.active === 1 ? 0 : 1)],
    ["the turn's phase", (G) => (G.turn.ph += 1)],
    ['a side wiped', (G) => (G.turn.wiped = G.turn.wiped === 1 ? 0 : 1)],
    ['the score', (G) => (G.turn.vp[1] += 1)],
    ['the overtime', (G) => (G.turn.overtime += 1)],
    ["the decision's seats", (G) => (G.pending = { ...G.pending, seats: [1] })],
    ["the decision's kind", (G) => (G.pending = { ...G.pending, k: G.pending.k === 'phase' ? 'deploy' : 'phase' })],
    ["the dice' count", (G) => (G.rng.n += 1)],
    ["the dice' word", (G) => (G.rng.a ^= 1)],
  ]
  const stays = [
    ['an event in G.out', (G) => G.out.push({ t: 'focus' })],
    ['onTrace', (G) => (G.onTrace = () => {})],
    ['strict', (G) => (G.strict = !G.strict)],
    ['a trace line', (G) => G.journal.trace.push('log 0 x')],
    ['the nav grid', (G) => G.nav.rebuild(G.terrain.chunks)],
  ]
  for (const [what, edit] of moves) {
    const [G, u, c] = fresh(), before = core.stateHash(G)
    edit(G, u, c)
    check(core.stateHash(G) !== before, `moves on ${what}`)
  }
  for (const [what, edit] of stays) {
    const [G, u, c] = fresh(), before = core.stateHash(G)
    edit(G, u, c)
    check(core.stateHash(G) === before, `stays put on ${what}`)
  }
  // the sign of zero, which the rules can tell apart (atan2(0, -0) is pi)
  const [P, pu] = fresh(), [N, nu] = fresh()
  pu.models[0].ox = 0
  nu.models[0].ox = -0
  check(core.stateHash(P) !== core.stateHash(N), 'tells a model slot at -0 from one at +0')
}

// ── 10. What R8 must allow (R8b) ────────────────────────────────────────────
console.log('\n10. the kinds and their fields, the envelope\'s names, the sizes, the kinds out of band, and the hash\'s format (R8b)')
{
  const core = await imp(PKG, 'core/index.js')
  const { RULES } = await imp(PKG, 'core/commands.js')
  const { UNIT_EXTRAS, unitExtras, shadowState } = await imp(PKG, 'core/hash.js')
  const E = await imp(PKG, 'match/envelope.js')
  const F = await imp(PKG, 'match/fold.js')
  const { LocalStore } = await imp(PKG, 'match/store.js')
  const { Session } = await imp(PKG, 'match/session.js')
  const { loadCorpus } = await imp(PKG, 'sim/lib.mjs')
  const { jobSetup } = await imp(PKG, 'sim/run.mjs')
  // kinds and fields
  check(isDeepStrictEqual([...core.KINDS], Object.keys(RULES)), `KINDS is RULES' kinds, in its order (${core.KINDS.join(', ')})`)
  // (an envelope around `body` for seat 0, as its text, decoded; the text
  // written with sorted keys, as encode would, but by hand so a value encode
  // can't write is still handed over)
  const text = (e) => `{${Object.keys(e).sort().map((k) => `${JSON.stringify(k)}:${JSON.stringify(e[k])}`).join(',')}}`
  const dec = (body) => E.decode(text({ id: 'x.0.0', s: 0, d: 'x', p: 'x.0.0', h: 'abc', ...body }))
  const takes = [['none of its fields', {}], ['a stray whole number', { zz: 7 }], ['a boolean', { more: true }], ['2^53 - 1', { zz: 2 ** 53 - 1 }], ['-0', { zz: -0 }]]
  const refuses = [['an array', { zz: [1] }], ['an object', { zz: { a: 1 } }], ['a string', { zz: '1' }], ['a fraction', { zz: 1.5 }], ['2^53', { zz: 2 ** 53 }], ['null', { zz: null }]]
  const wrong = []
  for (const t of core.KINDS) {
    for (const [what, body] of takes) if (dec({ t, ...body }).bad) wrong.push(`${t} with ${what} refused (${dec({ t, ...body }).bad})`)
    for (const [what, body] of refuses) if (!dec({ t, ...body }).bad) wrong.push(`${t} with ${what} decoded`)
  }
  check(!wrong.length, `decode takes any safe whole number or boolean in any field of each of the ${core.KINDS.length} kinds, none required, and refuses an array, an object, a string, a fraction, 2^53 and null`, wrong.slice(0, 4).join('; '))
  const reads = readdirSync(join(PKG, 'match')).filter((f) => f.endsWith('.js') && /\bRULES\b|[\w\])]\.(fields|opt|bools)\b/.test(readFileSync(join(PKG, 'match', f), 'utf8')))
  check(!reads.length, 'no module of match/ reads RULES or a kind\'s field lists (legal() alone judges a body)', reads.join(', '))
  // reserved names
  const RESERVED = [...E.ENVELOPE_KEYS, 't']
  const clashes = (rules) => Object.entries(rules).flatMap(([k, r]) => ['fields', 'opt', 'bools'].flatMap((list) => (r[list] ?? []).filter((f) => RESERVED.includes(f)).map((f) => `${k}.${list} names ${f}`)))
  check(isDeepStrictEqual([...E.ENVELOPE_KEYS], ['id', 's', 'd', 'p', 'h']), `the envelope keeps id, s, d, p and h (${E.ENVELOPE_KEYS.join(', ')})`)
  check(!clashes(RULES).length, 'no field of any kind is named id, s, d, p, h or t (bodyOf would strip it, or the kind shadow it)', clashes(RULES).join('; '))
  const planted = clashes({ ...RULES, vote: { k: 'roundLimit', fields: [], opt: ['h'], bools: ['more', 't'] } })
  check(planted.length === 2, 'control: the lint finds a field named h (opt) and one named t (bools) planted in a copy of RULES', planted.join('; '))
  // sizes
  check(Number.isInteger(E.MAX_BYTES) && E.MAX_BYTES >= 1024, `MAX_BYTES is one whole number of at least 1,024 (${E.MAX_BYTES})`)
  const consts = Object.entries(E).filter(([k, v]) => typeof v === 'number').map(([k]) => k).sort()
  check(isDeepStrictEqual(consts, ['MAX_BYTES', 'MAX_NAME']), `match/envelope.js has no size but MAX_BYTES (and MAX_NAME, a name's): no cap by kind (${consts.join(', ')})`)
  // an entry of kind t whose text is exactly `size` bytes: stray whole
  // numbers make up the length (the last two sized to it)
  const padded = (t, size) => {
    const e = { id: 'x.0.0', s: 0, d: 'x', p: 'x.0.0', h: 'abc', t }
    let k = 0
    while (size - text(e).length > 45) e[`z${k++}`] = 1e15
    for (let a = 1; a <= 15; a++) {
      for (let b = 1; b <= 15; b++) {
        const x = text({ ...e, [`z${k}`]: Number('9'.repeat(a)), [`z${k + 1}`]: Number('9'.repeat(b)) })
        if (x.length === size) return x
      }
    }
    return ''
  }
  const sized = core.KINDS.filter((t) => {
    const at = padded(t, E.MAX_BYTES), over = padded(t, E.MAX_BYTES + 1)
    return at.length !== E.MAX_BYTES || over.length !== E.MAX_BYTES + 1 || E.decode(at).bad || !/^over/.test(E.decode(over).bad ?? '')
  })
  check(!sized.length, `every kind's entry decodes at ${E.MAX_BYTES} bytes and is refused a byte over: one size for every kind`, sized.join(', '))
  {
    const setup = { board: 4242, dice: 99, seats: [{ race: 'squirrel', ctrl: 'human', dev: 'here' }, { race: 'serpent', ctrl: 'ai' }] }
    const f = new F.Folder({ out: null })
    f.push(E.decode(E.encode({ id: 'here.0.0', s: -1, d: 'here', t: 'start', core: core.CORE_VERSION, rules: core.RULES_ID, setup })))
    for (let k = 1; k < 5000; k++) f.push(E.decode(`junk ${k}`))
    const live = f.status, count = f.count
    f.push(E.decode('one more'))
    check(live === 'live' && count === 5000 && f.status === 'full' && f.count === 5001 && f.report?.count === 5001, 'the cap counts junk: a start and 4,999 junk entries leave the match live (count 5,000), the next freezes it full (count 5,001, in the report too)', `${live} at ${count}, then ${f.status} at ${f.count}`)
    const store = new LocalStore()
    const ses = new Session({ store, localSeats: [0], dev: 'here' })
    ses.start(setup)
    store.append('junk')
    check(store.length === 2 && ses.count === 2 && ses.folder.count === 2, `the store's length and the Session's count are the entries folded (${store.length}, ${ses.count})`)
  }
  // out of band
  check(isDeepStrictEqual([...F.OUT_OF_BAND], ['concede', 'desync', 'final']), `the kinds sent out of band are concede, desync and final, and no other (${F.OUT_OF_BAND.join(', ')})`)
  const loose = Object.entries(RULES).filter(([, r]) => !r.k).map(([k]) => k)
  check(isDeepStrictEqual(loose, ['concede']) && loose.every((k) => F.OUT_OF_BAND.includes(k)), `the one kind of core's that answers no decision is concede (${loose.join(', ')})`)
  const own = ['open', 'start', 'desync', 'final'].filter((t) => !dec({ t, at: 'x', mine: 'y' }).bad || !dec({ t, p: 'x', h: 'y' }).bad || !E.decode(text({ id: 'x.0.0', s: 0, d: 'x', t, commit: 'c', core: 1, rules: 'r', setup: {} })).bad)
  check(isDeepStrictEqual(own, ['desync', 'final']), `of the Folder's own kinds a seat sends desync and final alone (${own.join(', ')})`)
  check([{ h: 'y' }, { p: 'x' }].every((half) => /^final takes a [ph]$/.test(E.decode(text({ id: 'x.0.0', s: 0, d: 'x', t: 'final', ...half })).bad ?? '')), 'a final carries a head and a hash, or decode refuses it')
  {
    // a hotseat battle, past its deployment: the seat not waited on sends
    // each kind, from its own device, after its head
    const it = loadCorpus().items.find((x) => x.mode === 'hotseat')
    const setup = jobSetup(it.job), devs = { ...setup, seats: setup.seats.map((x, s) => ({ ...x, dev: `d${s}` })) }
    const fresh = () => {
      const f = new F.Folder({ out: null })
      let n = 0
      const env = (body, s, extra = {}) => E.decode(E.encode(E.envelope(body, { id: `d${Math.max(s, 0)}.${n++}.0`, s, d: `d${Math.max(s, 0)}`, ...extra })))
      f.push(env({ t: 'start', core: core.CORE_VERSION, rules: core.RULES_ID, setup: devs }, -1))
      for (const { s, ...b } of it.job.entries) {
        if (f.G.turn.stage === 'battle' && f.G.pending?.k === 'phase') break
        f.push(env(b, s, { p: f.head(s), h: F.SIMULTANEOUS.includes(f.G.pending.k) ? undefined : core.stateHash(f.G) }))
      }
      return { f, env }
    }
    const { f: probe } = fresh()
    const idle = 1 - probe.G.pending.seats[0]
    const fates = {}
    for (const t of [...core.KINDS, 'desync']) {
      const { f, env } = fresh()
      const body = t === 'desync' ? { t, at: f.accepted.at(-1), mine: 'x' } : { t }
      const oob = F.OUT_OF_BAND.includes(t)
      f.push(env(body, idle, oob ? {} : { p: f.head(idle), h: core.stateHash(f.G) }))
      const r = f.rejected.at(-1)
      fates[t] = f.accepted.at(-1) === `d${idle}.${f.pushed.length - 1}.0` || f.status !== 'live' ? 'taken' : r?.why.split(':')[0]
    }
    const taken = Object.keys(fates).filter((t) => fates[t] !== 'turn')
    check(isDeepStrictEqual(taken.sort(), ['concede', 'desync']) && fates.concede === 'taken' && fates.desync === 'taken', `in a hotseat battle (${it.id}), every kind from the seat not waited on is refused as not its turn but concede and desync, taken out of band`, JSON.stringify(fates))
    // its final, never accepted: on the head with this match's hash it is
    // inert, with another a desync, on another head stale
    const finals = ['agrees', 'apart', 'elsewhere'].map((how) => {
      const { f, env } = fresh()
      const e = env({ t: 'final' }, idle, { p: how === 'elsewhere' ? 'x.0.0' : f.last, h: how === 'apart' ? 'x' : core.stateHash(f.G) })
      f.push(e)
      const r = f.rejected.find((x) => x.id === e.id)
      return `${how}:${f.accepted.includes(e.id) ? 'accepted' : f.status === 'desync' && f.report?.at === e.id && f.report?.by === 'hash' ? 'desync' : r?.why.split(':')[0]}`
    })
    check(isDeepStrictEqual(finals, ['agrees:inert', 'apart:desync', 'elsewhere:stale']), `in a hotseat battle (${it.id}), the idle seat's final is inert on the head with this match's hash, a desync with another, stale elsewhere`, finals.join(', '))
  }
  // the hash's format, pinned under today's CORE_VERSION (a change to what
  // shadowState prints bumps it: pin the new hashes under the new version)
  // (2, F4: the vote added nothing shadowState prints for a battle that
  // never votes, so the corpus's states hash as under 1; a voting match's
  // pending decision carries its votes, printed as the pending line always
  // was; 3, F10b: pilot added a command, nothing shadowState prints; 4, F8a:
  // the setup names its mission, and G.board stays out of the hash; 5,
  // F11a: the seats name their armies, which decide only which units
  // newState makes, and the classic preset makes the classic armies)
  const V1 = {
    '64-89': { end: 'chz79qx8m5' },
    'hotseat-late-8': { 0: '24ujeexicjn', 20: 'xxpycs4cb', 60: '192m554xi18', end: '2dcycb5g9uv' },
    'serpent-random-2': { 0: '23nc969d48c', 10: '1hdl5k2u5af', end: '29rym70iz9j' },
  }
  const PINNED = { 1: V1, 2: V1, 3: V1, 4: V1, 5: V1 }
  const pins = PINNED[core.CORE_VERSION]
  if (!check(!!pins, `stateHash has pinned hashes under CORE_VERSION ${core.CORE_VERSION}`, `pin today's hashes of ${Object.keys(PINNED[1]).join(', ')} under it (the format changed with the version)`)) {
    // (nothing to compare)
  } else {
    const { items } = loadCorpus()
    const apart = []
    for (const [id, want] of Object.entries(pins)) {
      const job = items.find((x) => x.id === id).job, entries = job.entries ?? []
      const G = core.createMatch(jobSetup(job), { out: null })
      for (let k = 0; k <= entries.length; k++) {
        if (want[k] !== undefined && core.stateHash(G) !== want[k]) apart.push(`${id} before entry ${k}: ${core.stateHash(G)}, pinned ${want[k]}`)
        if (k < entries.length) {
          const { s, ...b } = entries[k]
          core.apply(G, s, b)
        }
      }
      if (core.stateHash(G) !== want.end) apart.push(`${id} at its end: ${core.stateHash(G)}, pinned ${want.end}`)
    }
    check(!apart.length, `stateHash of ${Object.values(pins).reduce((n, w) => n + Object.keys(w).length, 0)} corpus matches is the one pinned under CORE_VERSION ${core.CORE_VERSION}`, `${apart.join('; ')}: shadowState's output changed, which bumps CORE_VERSION (§2.6), then pin the new hashes under it`)
  }
  // the extras
  check(Object.isFrozen(UNIT_EXTRAS) && !Object.keys(UNIT_EXTRAS).length, `UNIT_EXTRAS is frozen and names no field yet (${Object.keys(UNIT_EXTRAS).join(', ') || 'none'})`)
  const extras = Object.freeze({ zeta: false, aboard: 0 })
  check(unitExtras({}, extras) === '' && unitExtras({ aboard: 0, zeta: false }, extras) === '' && unitExtras({ aboard: 3 }, extras) === 'aboard=3' && unitExtras({ zeta: true, aboard: -0 }, extras) === 'aboard=-0,zeta=true', 'a unit\'s extras print only where they aren\'t their default, in sorted key=value (-0 apart from 0)')
  {
    const G = new Session({ store: new LocalStore([E.encode({ id: 'here.0.0', s: -1, d: 'here', t: 'start', core: core.CORE_VERSION, rules: core.RULES_ID, setup: { board: 4242, dice: 99, seats: [{ race: 'squirrel', ctrl: 'human', dev: 'here' }, { race: 'serpent', ctrl: 'ai' }] } })]), localSeats: [] }).G
    const before = shadowState(G), plain = shadowState(G, extras)
    G.units[2].aboard = 0
    const held = shadowState(G, extras)
    G.units[2].aboard = 4
    const moved = shadowState(G, extras)
    check(plain === before && held === before && moved !== before && moved.includes(`[aboard=4]`) && shadowState(G) === before, 'a doctored table of extras leaves a match that never uses them, or holds their defaults, hashing as before; a unit off its default moves the hash; a field the table doesn\'t name prints nothing')
  }
}

// ── 11. The army builder's data (F11a) ─────────────────────────────────────
console.log("\n11. the army builder's data: prices, rosters, presets, the missions' list rules (F11a)")
{
  const A = await imp(PKG, 'core/army.js')
  const { fullSetup } = await imp(PKG, 'core/index.js')
  const { LIST } = await imp(PKG, 'data/schema.js')
  const why = (f) => {
    try {
      f()
      return null
    } catch (e) {
      return e.message
    }
  }
  const countsOf = (text) => [...text].map(Number)
  // prices
  const unpriced = ALL.filter((t) => !Number.isInteger(t.cost) || t.cost <= 0 || t.cost % 5 !== 0)
  check(!unpriced.length, `every one of the ${ALL.length} units has a cost, a whole multiple of 5 above 0 (${Object.values(RACES).map((r) => r.roster.map((k) => `${k} ${r.units[k].cost}`).join(', ')).join('; ')})`, unpriced.map((t) => `${t.key}: ${t.cost}`).join(', '))
  // the v6 table's classic lists (DESIGN §4.2.8.2): a retune re-pins them
  // here, and each stays within its mission's limit (army-sim's gate)
  const CLASSIC_COST = { squirrel: 485, serpent: 495 }
  for (const [key, want] of Object.entries(CLASSIC_COST)) {
    const r = RACES[key], cost = A.listCost(r, countsOf(r.armies.classic))
    check(cost === want && cost <= MISSIONS.classic.list.points, `the ${r.short}' classic list ('${r.armies.classic}') costs ${cost}, the v6 table's ${want}, within the Skirmish limit of ${MISSIONS.classic.list.points}`, cost !== want ? 'a price changed: re-pin CLASSIC_COST with the retune (and run sim/army-sim.mjs --check)' : 'over the limit')
  }
  // rosters: each race's as it stood when its first list was recorded. A
  // roster may grow at its end (F9a appends 'warcart', F9b 'howdah'); its
  // first entries never move. A new race pins its own (F5a).
  const ROSTER_PIN = {
    squirrel: ['elder', 'oakguard', 'nutkin', 'grenadier', 'glider', 'trebuchet'],
    serpent: ['hierophant', 'brute', 'scaleguard', 'spitter', 'sidewinder', 'engine'],
  }
  const rosterWhy = (key, roster) => {
    const pin = ROSTER_PIN[key]
    if (!pin) return `no pinned roster for ${key}: pin today's in ROSTER_PIN before any list of it is recorded`
    const at = pin.findIndex((k, i) => roster[i] !== k)
    return at < 0 ? null : `entry ${at} is ${JSON.stringify(roster[at])}, the pin's ${JSON.stringify(pin[at])}: a roster only grows at its end (a reorder or an insert changes what every recorded and saved list means)`
  }
  for (const r of Object.values(RACES)) {
    const keys = Object.keys(r.units)
    const once = r.roster.length === keys.length && new Set(r.roster).size === keys.length && keys.every((k) => r.roster.includes(k))
    check(once, `the ${r.short}' roster lists each of its ${keys.length} units once (${r.roster.join(' ')})`, `roster ${r.roster.join(',')}, units ${keys.join(',')}`)
    check(!rosterWhy(r.key, r.roster), `the ${r.short}' roster starts with its pin (${(ROSTER_PIN[r.key] ?? []).length} entries)`, rosterWhy(r.key, r.roster))
    const order = r.army.map((k) => r.roster.indexOf(k))
    check(order.every((x, i) => !i || x >= order[i - 1]), `the ${r.short}' classic army is in roster order`, r.army.join(','))
    check(isDeepStrictEqual(A.keysOf(r, 'classic'), [...r.army]) && isDeepStrictEqual(A.keysOf(r, r.armies.classic), [...r.army]), `the ${r.short}' classic preset ('${r.armies.classic}') expands to exactly its army`, A.keysOf(r, 'classic').join(','))
  }
  // the pin's own controls: a reorder and an insert fail by name, an append
  // passes
  const pinned = ROSTER_PIN.squirrel
  const swapped = [pinned[0], pinned[2], pinned[1], ...pinned.slice(3)]
  check(/entry 1 is "nutkin", the pin's "oakguard"/.test(rosterWhy('squirrel', swapped) ?? ''), 'control: a roster with two entries swapped fails the pin, naming the first moved', rosterWhy('squirrel', swapped) ?? 'passes')
  check(/entry 1 is "warcart"/.test(rosterWhy('squirrel', [pinned[0], 'warcart', ...pinned.slice(1)]) ?? ''), 'control: a unit inserted inside the roster fails the pin', 'passes')
  check(rosterWhy('squirrel', [...pinned, 'warcart']) === null, 'control: a unit appended at the roster\'s end passes the pin')
  check(/no pinned roster for beetle/.test(rosterWhy('beetle', ['grub']) ?? ''), 'control: a race with no pinned roster fails, asking for one', 'passes')
  // presets: count strings, legal where a mission names them; and every
  // mission's own preset there and legal, for every race
  for (const r of Object.values(RACES)) {
    check(Object.getPrototypeOf(r.armies) === null && Object.hasOwn(r.armies, 'classic'), `the ${r.short}' presets have no prototype and hold classic (${Object.keys(r.armies).join(', ')})`)
    for (const [name, text] of Object.entries(r.armies)) {
      const ok = typeof text === 'string' && LIST.test(text) && text.length <= r.roster.length
      check(ok, `the ${r.short}' preset ${name} ('${text}') is a list of counts no longer than its roster`)
      for (const [m, mission] of Object.entries(MISSIONS)) {
        if (mission.army !== name || !ok) continue
        const broken = A.checkList(r, mission.list, countsOf(text))
        check(broken === null, `the ${r.short}' preset ${name} is legal for the ${m} mission, whose preset it is (${A.listCost(r, countsOf(text))} of ${mission.list.points} points)`, broken)
      }
    }
  }
  for (const [m, mission] of Object.entries(MISSIONS)) {
    const missing = Object.values(RACES).filter((r) => !Object.hasOwn(r.armies, mission.army)).map((r) => r.key)
    check(!missing.length, `every race has the ${m} mission's preset, ${mission.army}`, `missing for ${missing.join(', ')}`)
  }
  // the missions: as shipped, and the list rules checkMission takes and
  // refuses (each edit to a copy of classic's list)
  for (const [m, mission] of Object.entries(MISSIONS)) check(!!mission.list && missionError(mission) === null, `the ${m} mission has list rules and passes checkMission (${mission.list.size ?? 'unsized'}: ${mission.list.points} points, ${mission.list.units} units, ${mission.list.models} models, ${mission.list.perKind} of one unit)`, missionError(mission) ?? 'no list')
  const withList = (edit) => {
    const m = structuredClone(MISSIONS.classic)
    edit(m.list, m)
    return missionError(m)
  }
  const takes = [
    ['a slot maximum of 10 (Troops [1, 10])', (l) => (l.roles.Troops = [1, 10])],
    ['a [0, 0] slot (no Monster)', (l) => (l.roles.Monster = [0, 0])],
    ["Grand's Troops [3, 14] with 24 units", (l) => Object.assign(l, { units: 24, roles: { ...l.roles, Troops: [3, 14] } })],
    ['a list with no size', (l) => delete l.size],
    ['perKind 9', (l) => (l.perKind = 9)],
  ]
  for (const [what, edit] of takes) check(withList(edit) === null, `checkMission takes ${what}`, withList(edit))
  const brokenLists = [
    ['a perKind of 10 (a count is one digit)', /perKind is 10, not a whole number from 1 to 9/, (l) => (l.perKind = 10)],
    ['a perKind of 0', /perKind is 0/, (l) => (l.perKind = 0)],
    ['a slot with min > max', /Troops slot is \[2,1\]/, (l) => (l.roles.Troops = [2, 1])],
    ['a slot with max > units', /Elite slot is \[0,11\], not \[min, max\] with 0 ≤ min ≤ max ≤ 10 units/, (l) => (l.roles.Elite = [0, 11])],
    ['a slot of fractions', /Fast slot is \[0,1.5\]/, (l) => (l.roles.Fast = [0, 1.5])],
    ['a negative minimum', /Hero slot is \[-1,1\]/, (l) => (l.roles.Hero = [-1, 1])],
    ['minimums summing past units', /slot minimums sum to 11 units, over its 10/, (l) => Object.assign(l.roles, { Hero: [1, 1], Troops: [4, 6], Elite: [2, 2], Fast: [2, 2], Monster: [1, 1], Artillery: [1, 1] })],
    ['fractional points', /points limit is 500.5, not a whole number above 0/, (l) => (l.points = 500.5)],
    ['no points', /points limit is 0/, (l) => (l.points = 0)],
    ['units past the envelope', /units is 25, not a whole number from 1 to 24/, (l) => (l.units = 25)],
    ['models past the envelope', /models is 91, not a whole number from 1 to 90/, (l) => (l.models = 91)],
    ['a role without a slot', /Artillery slot is undefined/, (l) => delete l.roles.Artillery],
    ['a role that is no role', /roles name "Beast", which is no role/, (l) => (l.roles.Beast = [0, 1])],
    ['a field the list rules take not', /list takes no field "prices"/, (l) => (l.prices = {})],
    ['a size that is no name', /size is 5, not a name/, (l) => (l.size = 5)],
    ['no list', /has no list/, (l, m) => delete m.list],
  ]
  for (const [what, want, edit] of brokenLists) {
    const err = withList(edit)
    check(err && want.test(err), `checkMission refuses ${what}`, err ?? 'accepted')
  }
  // every race fields a legal list at every mission, autoList on 100 seeds
  for (const [m, mission] of Object.entries(MISSIONS)) {
    for (const r of Object.values(RACES)) {
      const wrong = [], spent = []
      for (let seed = 1; seed <= 100; seed++) {
        const counts = A.autoList(r, mission.list, seed)
        const broken = A.checkList(r, mission.list, counts)
        if (broken) wrong.push(`seed ${seed} '${A.listText(counts)}': ${broken}`)
        spent.push(A.listCost(r, counts))
      }
      check(!wrong.length, `the ${r.name} field a legal list at the ${m} mission on 100 seeds (autoList: ${Math.min(...spent)}-${Math.max(...spent)} of ${mission.list.points} points)`, wrong.slice(0, 3).join('; '))
    }
  }
  // RULES_ID: the prices, the roster's order, the presets, the list rules
  const reroster = (key, roster) => rulesId({ races: { ...RACES, [key]: { ...RACES[key], roster } } })
  const preset = (digits) => variant('serpent', (d) => (d.armies = { field: digits }))
  const armyMoves = [
    ['a cost (Nutkin 75 → 80)', () => variant('squirrel', (d) => (d.units.nutkin.cost = 80))],
    ['a cost (Venom Engine 65 → 60)', () => variant('serpent', (d) => (d.units.engine.cost = 60))],
    // (the race as defineRace made it, its roster alone turned: no race
    // file can turn its roster without its classic army, whose order is
    // the army order's own row in section 5)
    ["the roster's order (Oak Guard after Nutkin)", () => reroster('squirrel', swapped)],
    ['a preset added (field, 224222)', () => preset('224222')],
    ["the mission's points (500 → 505)", () => mission((m) => (m.list.points = 505))],
    ["the mission's most of one unit (3 → 4)", () => mission((m) => (m.list.perKind = 4))],
    ["a role's slot (Hero [1, 1] → [1, 2])", () => mission((m) => (m.list.roles.Hero = [1, 2]))],
    ["the mission's most models (36 → 40)", () => mission((m) => (m.list.models = 40))],
  ]
  for (const [what, id] of armyMoves) check(id() !== RULES_ID, `RULES_ID moves on ${what}`)
  check(preset('224222') !== preset('224221'), "RULES_ID moves on a preset's digits (field 224222 → 224221)")
  check(reroster('squirrel', [...RACES.squirrel.roster]) === RULES_ID, "RULES_ID stays on a copy of the roster (the control for the roster's order)")
  check(variant('squirrel', (d) => (d.units.nutkin.name = 'Nutkin Slingers')) === RULES_ID, 'RULES_ID stays on a unit renamed, its cost and roster place kept')
  // defineRace refuses broken builder data
  breakIt('defineRace refuses a unit without cost', (d) => delete d.units.brute.cost, /unit brute: cost must be a whole multiple of 5 above 0 .*not undefined/)
  breakIt('defineRace refuses a cost of 7 (not a multiple of 5)', (d) => (d.units.brute.cost = 7), /unit brute: cost must be a whole multiple of 5.*not 7/)
  breakIt('defineRace refuses a cost of 0', (d) => (d.units.spitter.cost = 0), /unit spitter: cost must be a whole multiple of 5 above 0/)
  breakIt('defineRace refuses a cost as text', (d) => (d.units.spitter.cost = '65'), /unit spitter: cost must be a whole multiple of 5/)
  breakIt('defineRace refuses no roster', (d) => delete d.roster, /needs a roster/)
  breakIt('defineRace refuses a roster missing a unit', (d) => d.roster.pop(), /roster leaves out "engine"/)
  breakIt('defineRace refuses a roster listing a unit twice', (d) => d.roster.push('brute'), /roster lists "brute" twice/)
  breakIt('defineRace refuses a roster listing a unit the race lacks', (d) => d.roster.push('nutkin'), /roster lists "nutkin", which is not one of its units/)
  breakIt('defineRace refuses a roster listing an Object.prototype name', (d) => d.roster.push('constructor'), /roster lists "constructor", which is not one of its units/)
  breakIt('defineRace refuses an army out of roster order', (d) => d.army.reverse(), /army is not in roster order/)
  breakIt('defineRace refuses an army fielding 10 of one unit (a count is one digit)', (d) => (d.army = Array(10).fill('scaleguard')), /fields 10 "scaleguard": a list's count of one unit is one digit/)
  breakIt('defineRace refuses a preset with trailing zeros', (d) => (d.armies = { field: '2242220' }), /armies\.field is "2242220", not a list of counts/)
  breakIt('defineRace refuses a preset longer than the roster', (d) => (d.armies = { field: '2242221' }), /armies\.field "2242221" counts 7 kinds of unit; the roster has 6/)
  breakIt('defineRace refuses a preset that is no string', (d) => (d.armies = { field: 224222 }), /armies\.field is 224222, not a list of counts/)
  breakIt('defineRace refuses a preset named by no key', (d) => (d.armies = { Field: '224222' }), /a preset's name "Field" must be lower-case/)
  breakIt('defineRace refuses a preset named __proto__', (d) => (d.armies = JSON.parse('{"__proto__": "1"}')), /a preset's name "__proto__" must be lower-case/)
  breakIt('defineRace refuses a classic preset given by hand', (d) => (d.armies = { classic: '112111' }), /armies gives "classic", which is derived from its army/)
  breakIt('defineRace refuses presets that are a list', (d) => (d.armies = ['224222']), /armies is a record of presets by name/)
  check(!!defineRace({ ...structuredClone(raw.serpent), armies: { field: '224222', grand: '336333' } }), "defineRace takes F8b's presets as count strings (field '224222', grand '336333')")
  // the army/ corpus (recorded after F11a's code, in a commit of its own):
  // every list a setup there names, legal under today's prices and within
  // 90% of its mission's limit
  const ARMY = join(PKG, 'sim', 'baselines', 'army')
  const files = existsSync(ARMY) ? readdirSync(ARMY).filter((f) => f.endsWith('.json')).sort() : []
  // (every object with a seats list is a setup, wherever the file keeps it)
  const setupsIn = (v, out = []) => {
    if (Array.isArray(v)) v.forEach((x) => setupsIn(x, out))
    else if (v && typeof v === 'object') {
      if (Array.isArray(v.seats) && v.seats.every((x) => x && typeof x === 'object' && 'race' in x)) out.push(v)
      else Object.values(v).forEach((x) => setupsIn(x, out))
    }
    return out
  }
  let lists = 0
  const wrong = []
  for (const f of files) {
    const setups = setupsIn(JSON.parse(readFileSync(join(ARMY, f), 'utf8')))
    if (!setups.length) wrong.push(`${f}: no setup in it (this row reads every object with a seats list)`)
    for (const setup of setups) {
      const err = why(() => fullSetup(setup))
      if (err) {
        wrong.push(`${f}: its setup is refused today: ${err}`)
        continue
      }
      const s = fullSetup(setup), rules = MISSIONS[s.mission].list
      setup.seats.forEach((x, i) => {
        if (x.army == null) return
        lists++
        const { counts } = A.armyOf(s, i), cost = A.listCost(RACES[x.race], counts)
        if (cost > Math.floor(0.9 * rules.points)) wrong.push(`${f}: seat ${i}'s ${JSON.stringify(x.army)} costs ${cost}, over 90% of the ${s.mission} limit (${Math.floor(0.9 * rules.points)} of ${rules.points})`)
      })
    }
  }
  check(!wrong.length, files.length ? `the army/ corpus: ${lists} lists in ${files.length} files, each legal under today's prices and within 90% of its mission's limit` : 'the army/ corpus: not recorded yet (sim/baselines/army/ has no logs): 0 lists checked', wrong.slice(0, 4).join('; '))
}

console.log(failed ? `\ndata-check FAILED: ${failed} problem(s)` : '\ndata-check passed: the race data is the legacy data, RULES_ID tracks exactly the rules, the terrain sets are well formed, a start carries CORE_VERSION and RULES_ID, stateHash reads exactly the match in a format pinned under its CORE_VERSION, the seams allow what the large battles need, and (F11a) the army builder\'s prices, rosters, presets and list rules hold')
process.exit(failed ? 1 : 0)
