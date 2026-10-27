// The wargames' check (ROUND-3.md §6; DESIGN.md §7.3–7.4; R8 §5): every
// wargames/<id>.json, a what-if with the real forces fought in a compressed
// arena beside a box's record. For the real data, each of ids.json's
// `wargames` (samar, midway, ironbottom-sound) must be here; for the fixtures
// (test-data) whatever scenario a fixture writer left is held to the same
// rules against the fixture box, and none is required.
//
// What it holds a scenario to:
// - the frame: its id the file's name and a frozen scenario id, its box a
//   frozen box with a battle file, the title, the contract's label word for
//   word, durationS (600, ten minutes);
// - the arena: a centre and a radius inside the box's frozen bounds, all of it
//   at sea in the box's own pack (a ship cannot start on land), the two sides'
//   bearings reciprocal, the separation inside the arena;
// - each side (`japan`, `usa`): every ship a unit id of the box's battle file
//   on that side, its kit in kits/ships.json, never a fixed, hospital or tokkō
//   unit, no ship on both sides; the guide one of the ships; the screen radius;
//   the formation (when given) naming only the side's own ships; the aircraft on
//   deck per carrier (a carrier of the side, a kit of kits/aircraft.json on the
//   side's side, a count, a profile of the vocabulary that the kit's type can
//   fly, how many are airborne at the start) and at most 30 aircraft in the
//   air at once; `first` one of the side's ships or an aircraft kit it has
//   (airborne at the start, so the cut lands in the air), and `firstStation`
//   one the unit offers by ROUND-2.md §3's rule; the admiral's parameters in
//   range, a launch interval exactly when the side has aircraft;
// - the goals (the main goal and every phase's): a kind and a type of the
//   frozen vocabularies, a count, and satisfiable by the forces (no more
//   carriers to sink than the other side has, no more ships to keep afloat
//   than one's own, a hit of a weapon one's side carries, a reach by units it
//   has); 5–7 phases per side, each with a title, a text and a timer, ordered
//   and inside durationS;
// - the footnote one sentence; the sources in sources.json, one at least
//   opened;
// - the voice (DESIGN.md §7.3–7.4, DATA.md §10, R8 §5) on every user-facing
//   string: nothing that says what the app does not draw, no slur, no glory
//   word, none of the never-list (kill, score, win, enemy, victory, defeat,
//   destroyed, saved, what if, avenged, hero), no count of people and no
//   word for the dead beside a number, Japanese names family name first and
//   in capitals with the kanji at a card's first mention, "tokkō (special
//   attack)" where tokkō is named, and no ship named that the scenario does
//   not field. Every string in the file, notes too, is held to the slur,
//   glory and never-list rules.
//
// The fields beyond §6's example that the three scenarios carry (all optional
// here, documented in research/content-3.md): side `side`, `ja`, `leader`,
// `firstStation`, `headingDeg`, `formation`, `maxAirborne`; aircraft
// `airborne` and `note`; goal `weapon` (shell | torpedo | bomb), `by` (the
// side's own units that must make it: aircraft or a ship type), `types` (the
// ship types the goal counts, widening `type`), `rangeM` (a reach),
// `outOfAction` (a sink that a burning carrier, launching stopped, also
// satisfies) and `also` (more terms of a main goal, all of which must hold);
// admiral `waveSize`; arena `separationM`, `skyAt` (the battle-clock time whose sky,
// sun or moon and weather the arena borrows from the box), `night`, `starShells`,
// `visibilityM` and `note`; scenario `ja`.

import { existsSync, readdirSync } from 'node:fs'
import { checkVocab, checkCopy, checkVoice, checkJapaneseNames, checkScoreLine, wrapLon, battleClock, battleTime } from './common.mjs'
import { stationsOf, JAPANESE_NAMES } from './battle.mjs'
import { readPNG } from '../lib/png.mjs'

/** ROUND-3.md §1: the door and the end card carry it word for word. */
export const LABEL = 'A wargame played with the real forces. The record is on the other side of the table.'
export const SIDES = { japan: 'jp', usa: 'us' }
export const WEAPONS = ['shell', 'torpedo', 'bomb']
export const FORMATIONS = ['circle', 'columns']
/** What each kit type may fly in the arena (the attack profiles of ids.json). */
export const PROFILES_BY_TYPE = {
  fighter: ['cap', 'escort', 'strafe', 'dive'],
  dive: ['dive', 'strafe', 'search'],
  torpedo: ['torpedo', 'dive', 'level', 'strafe', 'search'],
  level: ['level', 'torpedo', 'search'],
  bomber: ['level', 'torpedo', 'search'],
  patrol: ['search'],
}
/** The ship types a carrier's aircraft fly from. */
const CARRIER_TYPES = ['cv', 'cvl', 'cve']
/** ROUND-3.md §1: at most 30 aircraft a side in the air at once. */
const MAX_AIRBORNE = 30

/** The never-list (ROUND-3.md §1, DESIGN.md §7.4, R8 §5.1 9 and §5.2 d): machines, not people; no celebration. */
export const NEVER = /\b(kill(?:s|ed|ing|er|ers)?|scor(?:e|es|ed|ing)|win(?:s|ning|ner|ners)?|enem(?:y|ies)|victor(?:y|ies|ious)|defeat(?:s|ed)?|destroyed|mission accomplished|saved|what if|alternate history|avenged|heroe?s?|heroic|glor(?:y|ious)|sacrific(?:e|es|ed))\b/i
/** Words for people dying, never in the wargame's own voice (its strings speak of ships and aircraft). */
const DEAD_WORDS = /\b(killed|dead|died|casualt(?:y|ies)|wounded|survivors?)\b/i
const PEOPLE = '(?:men|sailors|crews?|crewmen|soldiers|marines|airmen|aircrew|aviators|pilots|people|officers|lives|dead|souls|survivors)'
const NUMBER_WORDS = 'one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundreds?|thousands?|dozens?'
/** A count of people, in digits or words, a couple of words before the people. */
const PEOPLE_COUNT = new RegExp(`(?:\\b(?:${NUMBER_WORDS})\\b|\\d[\\d,.]*)\\s+(?:[\\w’'-]+\\s+){0,2}${PEOPLE}\\b`, 'i')
const WORD_NUMBERS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 }
const CJK = /[\u3040-\u30ff\u3400-\u9fff]/
/** The record's Japanese family names with their given names (two Kimuras, two Hashimotos). */
const FAMILIES = [...JAPANESE_NAMES.reduce((m, { family, given }) => m.set(family, [...(m.get(family) || []), given]), new Map())]

const isLonLat = (c) => Array.isArray(c) && c.length === 2 && c.every(Number.isFinite) && Math.abs(c[1]) <= 90
const isInt = (v) => Number.isInteger(v)
const num = (v, lo, hi) => Number.isFinite(v) && v >= lo && v <= hi
const angleDiff = (a, b) => Math.abs((((a - b) % 360) + 540) % 360 - 180)
const upper = (s) => s.toLocaleUpperCase('en')
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export default function check(ctx) {
  const dir = ctx.path('wargames')
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.json')).sort() : []
  const expected = ctx.test ? [] : ctx.ids.wargames || []
  for (const id of expected) if (!files.includes(`${id}.json`)) ctx.bad(`wargames/${id}.json`, 'is missing (ROUND-3.md §2 names it)')
  if (!files.length) {
    if (!ctx.test) ctx.warn('wargames/', 'no scenario files')
    return
  }
  const ledger = new Map((ctx.load('sources.json') || []).filter((s) => s?.id).map((s) => [s.id, s]))
  const kits = {
    ships: new Map((ctx.load('kits/ships.json') || []).filter((k) => k?.id).map((k) => [k.id, k])),
    aircraft: new Map((ctx.load('kits/aircraft.json') || []).filter((k) => k?.id).map((k) => [k.id, k])),
  }
  const packs = new Map()
  for (const f of files) {
    const rel = `wargames/${f}`
    const W = ctx.load(rel)
    if (!W || typeof W !== 'object' || Array.isArray(W)) {
      if (W !== null) ctx.bad(rel, 'must be an object')
      continue
    }
    checkScenario(ctx, rel, f.replace(/\.json$/, ''), W, { ledger, kits, packs })
    // (the app opens a box's wargame from its manifest entry: a scenario no entry names has no door)
    const entry = (ctx.list('boxes/manifest.json', 'boxes') || []).find((b) => b.id === W.box)
    if (entry && entry.wargame !== rel) ctx.warn(rel, `boxes/manifest.json ${W.box} does not name it (wargame: "${rel}"): the battle offers no door to it`)
    ctx.count('wargames')
  }
}

// --- one scenario -----------------------------------------------------------------

function checkScenario(ctx, rel, fileId, W, env) {
  const { ledger, kits } = env
  // --- the frame
  if (W.id !== fileId) ctx.bad(rel, `id “${W.id}”; the file is ${fileId}.json`)
  if (!ctx.test && !(ctx.ids.wargames || []).includes(W.id)) ctx.bad(rel, `id “${W.id}” is not a frozen scenario id (${(ctx.ids.wargames || []).join(', ')})`)
  const frozen = ctx.frozen.boxes[W.box]
  if (!frozen) return ctx.bad(rel, `box “${W.box}” is not a frozen box (${Object.keys(ctx.frozen.boxes).join(', ')})`)
  const battle = ctx.load(`boxes/${W.box}/battle.json`)
  if (!battle || !Array.isArray(battle.units)) return ctx.bad(rel, `boxes/${W.box}/battle.json is not here to draw the forces from`)
  if (typeof W.title !== 'string' || !W.title.trim()) ctx.bad(rel, 'has no title')
  // (the rules §6 does not list are warnings against the fixtures, so a fixture writer's minimal scenario passes)
  const need = ctx.test ? ctx.warn : ctx.bad
  if (W.label !== LABEL) need(`${rel} label`, `must be ROUND-3.md §1's words exactly: “${LABEL}”`)
  if (W.ja !== undefined && !(W.ja?.kanji && W.ja?.romaji)) ctx.bad(`${rel} ja`, 'needs kanji and romaji')
  if (!isInt(W.durationS) || W.durationS < 120 || W.durationS > 1800) ctx.bad(`${rel} durationS`, `${W.durationS}: a whole number of seconds, two to thirty minutes`)
  else if (!ctx.test && W.durationS !== 600) ctx.warn(`${rel} durationS`, `${W.durationS}; ROUND-3.md §1 says ten minutes`)
  const duration = isInt(W.durationS) ? W.durationS : 600

  // --- the arena
  checkArena(ctx, rel, W, frozen, env)
  if (W.arena?.skyAt !== undefined) battleTime(ctx, `${rel} arena.skyAt`, battleClock(ctx, `boxes/${W.box}/battle.json`, battle.clock), W.arena.skyAt)

  // --- the forces
  const units = new Map(battle.units.map((u) => [u.id, u]))
  const sides = W.sides || {}
  const keys = Object.keys(sides)
  if (keys.length !== 2 || !keys.every((k) => k in SIDES)) ctx.bad(`${rel} sides`, `must be exactly japan and usa (ROUND-3.md §6); has ${keys.join(', ') || 'none'}`)
  const forces = {}
  const seen = new Map()
  for (const key of Object.keys(SIDES)) {
    const S = sides[key]
    if (!S || typeof S !== 'object') {
      ctx.bad(`${rel} sides.${key}`, 'is missing')
      continue
    }
    forces[key] = checkForces(ctx, `${rel} sides.${key}`, key, S, units, kits, seen)
  }
  const J = sides.japan
  const U = sides.usa
  if (J && U && Number.isFinite(J.bearingDeg) && Number.isFinite(U.bearingDeg) && angleDiff(J.bearingDeg, U.bearingDeg) < 179) {
    ctx.bad(`${rel} sides`, `bearings ${J.bearingDeg}° and ${U.bearingDeg}° are not reciprocal: each side stands on its bearing from the centre, the other on the opposite one`)
  }

  // --- the start, laid out from the formations (when both sides give one)
  if (J?.formation && U?.formation && W.arena?.radiusM) checkStart(ctx, rel, W)

  // --- the goals, the phases, the admiral, the first unit
  for (const key of Object.keys(SIDES)) {
    const S = sides[key]
    const own = forces[key]
    const other = forces[key === 'japan' ? 'usa' : 'japan']
    if (!S || !own || !other) continue
    const at = `${rel} sides.${key}`
    checkGoal(ctx, `${at} goal`, S.goal, own, other, { main: true, duration })
    for (const [i, g] of (Array.isArray(S.goal?.also) ? S.goal.also : []).entries()) checkGoal(ctx, `${at} goal.also[${i}]`, g, own, other, { main: true, also: true, duration })
    checkPhases(ctx, at, S.phases, own, other, duration)
    checkAdmiral(ctx, `${at} admiral`, S.admiral, own)
    checkFirst(ctx, at, S, own, kits)
  }

  // --- the footnote and the sources
  if (typeof W.footnote !== 'string' || !W.footnote.trim()) ctx.bad(`${rel} footnote`, 'is missing')
  else {
    const n = sentences(W.footnote)
    if (n !== 1) ctx.bad(`${rel} footnote`, `is ${n} sentences; ROUND-3.md §6 asks for one`)
  }
  if (!Array.isArray(W.sources) || !W.sources.length) need(`${rel} sources`, 'has none')
  else {
    for (const [i, s] of W.sources.entries()) {
      const id = typeof s === 'string' ? s : s?.id
      if (!id) ctx.bad(`${rel} sources[${i}]`, 'has no id')
      else if (!ledger.has(id)) ctx.bad(`${rel} sources[${i}]`, `source “${id}” is not in sources.json`)
      else ctx.count('wargame source citations')
    }
    if (!W.sources.some((s) => { const x = ledger.get(typeof s === 'string' ? s : s?.id); return x?.opened === true && x.read !== 'title' })) need(`${rel} sources`, 'none of them was opened')
  }

  // --- the voice
  checkWords(ctx, rel, W, battle)
}

// --- the arena ----------------------------------------------------------------------

function checkArena(ctx, rel, W, frozen, env) {
  const A = W.arena
  const at = `${rel} arena`
  if (!A || typeof A !== 'object') return ctx.bad(at, 'is missing')
  if (!isLonLat(A.centre)) return ctx.bad(at, 'centre must be [lon, lat]')
  if (!num(A.radiusM, 500, 10000)) return ctx.bad(at, `radiusM ${A.radiusM}: 500 to 10,000 m`)
  if (!ctx.test && A.radiusM !== 3000) ctx.warn(at, `radiusM ${A.radiusM}; ROUND-3.md §1's arena is 6 km across`)
  if (A.separationM !== undefined && !num(A.separationM, 1000, 2 * A.radiusM)) ctx.bad(at, `separationM ${A.separationM}: 1,000 m to the arena's width`)
  for (const k of ['night', 'starShells']) if (A[k] !== undefined && typeof A[k] !== 'boolean') ctx.bad(at, `${k} must be true or false`)
  if (A.visibilityM !== undefined && !num(A.visibilityM, 200, 80000)) ctx.bad(at, `visibilityM ${A.visibilityM}: 200 m to 80 km`)
  // inside the box's frozen bounds
  const [w, s, e, n] = frozen.bounds
  const lon = wrapLon(A.centre[0], frozen.lon0)
  const lat = A.centre[1]
  const dLat = A.radiusM / 110574
  const dLon = A.radiusM / (111320 * Math.cos((lat * Math.PI) / 180))
  if (lon - dLon < w || lon + dLon > e || lat - dLat < s || lat + dLat > n) return ctx.bad(at, `the circle of ${A.radiusM} m round ${A.centre.join(', ')} leaves the box ${W.box} (${frozen.bounds.join(', ')})`)
  // all of it at sea in the box's pack
  const pack = packOf(ctx, W.box, env.packs)
  if (!pack) return ctx.warn(at, `the ${W.box} pack is not here: the arena is not checked for land`)
  let samples = 0
  let land = 0
  let shoal = 0
  const step = Math.max(50, A.radiusM / 40)
  for (let dy = -A.radiusM; dy <= A.radiusM; dy += step) {
    for (let dx = -A.radiusM; dx <= A.radiusM; dx += step) {
      if (dx * dx + dy * dy > A.radiusM * A.radiusM) continue
      const h = pack.height(lon + dx / (111320 * Math.cos((lat * Math.PI) / 180)), lat + dy / 110574)
      if (h === null) continue
      samples++
      if (h >= 0) land++
      else if (h > -15) shoal++
    }
  }
  if (land) ctx.bad(at, `${land} of ${samples} samples inside the arena are land in the ${W.box} pack: a ship cannot start or steam there`)
  else if (shoal) ctx.warn(at, `${shoal} of ${samples} samples inside the arena are shallower than 15 m`)
  ctx.count('wargame arena samples at sea', samples - land)
}

function packOf(ctx, boxId, cache) {
  if (cache.has(boxId)) return cache.get(boxId)
  let pack = null
  const b = ctx.list('boxes/manifest.json', 'boxes').find((x) => x.id === boxId)
  if (b?.height?.file && Array.isArray(b.bounds) && ctx.exists(b.height.file)) {
    try {
      const img = readPNG(ctx.path(b.height.file))
      const [w, s, e, n] = b.bounds
      const lon0 = b.projection?.lon0 ?? (w + e) / 2
      pack = {
        height(lon, lat) {
          const u = wrapLon(lon, lon0)
          const i = Math.floor(((u - w) / (e - w)) * img.width)
          const j = Math.floor(((n - lat) / (n - s)) * img.height)
          if (i < 0 || j < 0 || i >= img.width || j >= img.height) return null
          const k = (j * img.width + i) * img.channels
          return (img.data[k] * 256 + img.data[k + 1]) * b.height.scale + b.height.offset
        },
      }
    } catch (err) {
      ctx.warn(`boxes/manifest.json ${boxId}`, `the pack does not decode for the wargame check: ${err.message}`)
    }
  }
  cache.set(boxId, pack)
  return pack
}

// --- the forces ---------------------------------------------------------------------

/** One side's forces: returns { key, code, ships: [{ id, unit, kit, type }], aircraft: [...], byType } for the goals. */
function checkForces(ctx, at, key, S, units, kits, seen) {
  const code = SIDES[key]
  if (S.side !== undefined && S.side !== code) ctx.bad(at, `side “${S.side}”; ${key} is ${code}`)
  if (typeof S.name !== 'string' || !S.name.trim()) ctx.bad(at, 'has no name')
  if (S.leader !== undefined && (typeof S.leader !== 'string' || !S.leader.trim())) ctx.bad(`${at} leader`, 'must be a string')
  const out = { key, code, ships: [], aircraft: [], shipIds: new Set() }
  if (!Array.isArray(S.ships) || !S.ships.length) ctx.bad(at, 'has no ships (unit ids of the box’s battle file)')
  for (const [i, id] of (S.ships || []).entries()) {
    const where = `${at} ships[${i}]`
    if (out.shipIds.has(id)) {
      ctx.bad(where, `“${id}” is listed twice`)
      continue
    }
    if (seen.has(id)) ctx.bad(where, `“${id}” is on both sides`)
    seen.set(id, key)
    const u = units.get(id)
    if (!u) {
      ctx.bad(where, `“${id}” is not a unit of the box’s battle file`)
      continue
    }
    const uSide = /^(jp|japan)$/i.test(u.side) ? 'jp' : /^(us|usa)$/i.test(u.side) ? 'us' : u.side
    if (uSide !== code) ctx.bad(where, `“${id}” is on the ${u.side} side in the record; ${key} is ${code}`)
    if (u.fixed || u.hospital || u.tokko || u.target === false) ctx.bad(where, `“${id}” is a fixed, hospital or tokkō unit: never in a wargame (DESIGN.md §3.5)`)
    const kit = kits.ships.get(u.kit)
    if (!kit) {
      ctx.bad(where, `“${id}”’s kit “${u.kit}” is not in kits/ships.json`)
      continue
    }
    if (kit.hospital || kit.tokko) ctx.bad(where, `“${id}”’s kit is a hospital or tokkō kit`)
    out.shipIds.add(id)
    out.ships.push({ id, unit: u, kit, type: kit.type })
    ctx.count('wargame ships')
  }
  if (!out.shipIds.has(S.guide)) ctx.bad(`${at} guide`, `“${S.guide}” is not one of the side’s ships`)
  if (!num(S.screenM, 200, 3000)) ctx.bad(`${at} screenM`, `${S.screenM}: the screen ring radius, 200 to 3,000 m`)
  if (!num(S.bearingDeg, 0, 360)) ctx.bad(`${at} bearingDeg`, `${S.bearingDeg}: a bearing in degrees`)
  if (S.headingDeg !== undefined && !num(S.headingDeg, 0, 360)) ctx.bad(`${at} headingDeg`, `${S.headingDeg}: a course in degrees`)
  if (S.formation !== undefined) checkFormation(ctx, `${at} formation`, S.formation, out, S.guide)

  // the aircraft on deck, per carrier
  if (!Array.isArray(S.aircraft)) ctx.bad(`${at} aircraft`, 'must be a list (empty when the side has none)')
  let airborne = 0
  for (const [i, a] of (Array.isArray(S.aircraft) ? S.aircraft : []).entries()) {
    const where = `${at} aircraft[${i}]`
    const carrier = out.ships.find((x) => x.id === a?.carrier)
    if (!carrier) ctx.bad(where, `carrier “${a?.carrier}” is not one of the side’s ships`)
    else if (!CARRIER_TYPES.includes(carrier.type) && !(carrier.kit.aircraft || carrier.kit.catapult)) ctx.bad(where, `“${a.carrier}” (${carrier.type}) carries no aircraft`)
    const kit = kits.aircraft.get(a?.kit)
    if (!kit) {
      ctx.bad(where, `kit “${a?.kit}” is not in kits/aircraft.json`)
      continue
    }
    if (kit.side && kit.side !== code) ctx.bad(where, `kit “${a.kit}” is a ${kit.side} kit; ${key} is ${code}`)
    if (carrier && !CARRIER_TYPES.includes(carrier.type) && kit.type !== 'patrol') ctx.bad(where, `“${a.carrier}” (${carrier.type}) carries float planes only, not a ${kit.type} (${a.kit})`)
    if (kit.tokko) ctx.bad(where, `kit “${a.kit}” is a tokkō kit: never a wargame unit`)
    if (!isInt(a.count) || a.count < 1) ctx.bad(where, `count ${a.count}: a whole number of aircraft`)
    checkVocab(ctx, where, 'profile', a.profile, 'attackProfiles')
    const can = PROFILES_BY_TYPE[kit.type]
    if (can && !can.includes(a.profile)) ctx.bad(where, `a ${kit.type} (${a.kit}) does not fly the ${a.profile} profile (${can.join(', ')})`)
    const up = a.airborne ?? 0
    if (!isInt(up) || up < 0 || up > a.count) ctx.bad(where, `airborne ${a.airborne}: 0 to the count (${a.count})`)
    else airborne += up
    if (isInt(a.count)) out.aircraft.push({ kit: a.kit, type: kit.type, profile: a.profile, count: a.count, airborne: up, kitData: kit })
    ctx.count('wargame aircraft on deck', isInt(a.count) ? a.count : 0)
  }
  const cap = Math.min(MAX_AIRBORNE, S.maxAirborne ?? MAX_AIRBORNE)
  if (S.maxAirborne !== undefined && !(isInt(S.maxAirborne) && S.maxAirborne >= 1 && S.maxAirborne <= MAX_AIRBORNE)) ctx.bad(`${at} maxAirborne`, `${S.maxAirborne}: at most ${MAX_AIRBORNE} aircraft a side in the air at once (ROUND-3.md)`)
  if (airborne > cap) ctx.bad(`${at} aircraft`, `${airborne} airborne at the start; at most ${cap} in the air at once`)
  out.byType = (t) => (t === 'ship' ? out.ships.length : t === 'aircraft' ? out.aircraft.reduce((a, x) => a + x.count, 0) : out.ships.filter((x) => x.type === t).length)
  return out
}

function checkFormation(ctx, at, F, own, guide) {
  if (!F || typeof F !== 'object') return ctx.bad(at, 'must be an object')
  if (!FORMATIONS.includes(F.kind)) ctx.bad(at, `kind “${F.kind}” is not one of ${FORMATIONS.join(' | ')}`)
  const listed = []
  if (F.kind === 'circle') {
    if (!num(F.acrossM, 200, 4000)) ctx.bad(at, `acrossM ${F.acrossM}: the inner circle across, 200 to 4,000 m`)
    listed.push(...(F.ring || []), ...(F.screen || []))
    if ((F.ring || []).includes(guide) || (F.screen || []).includes(guide)) ctx.bad(at, 'the guide stands at the centre, not on a ring')
    listed.push(guide)
  } else if (F.kind === 'columns') {
    if (!num(F.intervalM, 100, 1500)) ctx.bad(at, `intervalM ${F.intervalM}: 100 to 1,500 m between ships in a column`)
    for (const [i, c] of (F.columns || []).entries()) {
      if (!Array.isArray(c?.ships) || !c.ships.length) ctx.bad(`${at} columns[${i}]`, 'has no ships')
      if (!(Array.isArray(c?.atM) && c.atM.length === 2 && c.atM.every((v) => num(v, -4000, 4000)))) ctx.bad(`${at} columns[${i}]`, 'atM must be [starboard, ahead] in metres, within 4 km of the guide')
      listed.push(...(c?.ships || []))
    }
  }
  const once = new Set()
  for (const id of listed) {
    if (!own.shipIds.has(id)) ctx.bad(at, `“${id}” is not one of the side’s ships`)
    if (once.has(id)) ctx.bad(at, `“${id}” stands in the formation twice`)
    once.add(id)
  }
  for (const s of own.ships) if (!once.has(s.id)) ctx.bad(at, `“${s.id}” has no place in the formation`)
}

/**
 * Each side's start, by the formation's own rule: the guide on its bearing from the centre at half the
 * separation (5 km when none is given), heading headingDeg (toward the other side when none); a circle's
 * ring evenly round the guide at half acrossM from the bow, its screen evenly at screenM from the bearing
 * of the other side; a column's first ship atM [starboard, ahead] from the guide and the rest astern at
 * intervalM. No two ships within 150 m, and none starting more than 1 km outside the arena (the bound
 * tools/smoke-arena.mjs holds the sim to, ROUND-3.md §3).
 */
export function layout(W) {
  const rad = (d) => (d * Math.PI) / 180
  const v = (deg, m) => [Math.sin(rad(deg)) * m, Math.cos(rad(deg)) * m]
  const sep = W.arena.separationM ?? 5000
  const out = []
  for (const [key, S] of Object.entries(W.sides || {})) {
    const F = S?.formation
    if (!F) continue
    const g = v(S.bearingDeg, sep / 2)
    const h = S.headingDeg ?? (S.bearingDeg + 180) % 360
    const put = (id, d) => out.push({ key, id, p: [g[0] + d[0], g[1] + d[1]] })
    if (F.kind === 'circle') {
      put(S.guide, [0, 0])
      const ring = F.ring || []
      ring.forEach((id, i) => put(id, v(h + (360 * i) / ring.length, (F.acrossM || 0) / 2)))
      const screen = F.screen || []
      screen.forEach((id, i) => put(id, v((S.bearingDeg + 180) % 360 + (360 * i) / screen.length, S.screenM)))
    } else if (F.kind === 'columns') {
      for (const c of F.columns || []) {
        ;(c.ships || []).forEach((id, i) => {
          const a = v(h + 90, c.atM?.[0] ?? 0)
          const b = v(h, (c.atM?.[1] ?? 0) - i * (F.intervalM || 0))
          put(id, [a[0] + b[0], a[1] + b[1]])
        })
      }
    }
  }
  return out
}

function checkStart(ctx, rel, W) {
  const at = layout(W)
  const R = W.arena.radiusM
  let worst = null
  for (const x of at) {
    const d = Math.hypot(x.p[0], x.p[1])
    if (!worst || d > worst.d) worst = { ...x, d }
  }
  if (worst && worst.d > R + 1000) ctx.bad(`${rel} sides.${worst.key} formation`, `${worst.id} starts ${Math.round(worst.d)} m from the centre, more than 1 km outside the ${R} m arena`)
  else if (worst && worst.d > R) ctx.warn(`${rel} sides.${worst.key} formation`, `${worst.id} starts ${Math.round(worst.d - R)} m outside the arena`)
  for (let i = 0; i < at.length; i++) {
    for (let j = i + 1; j < at.length; j++) {
      const d = Math.hypot(at[i].p[0] - at[j].p[0], at[i].p[1] - at[j].p[1])
      if (d < 150) ctx.bad(`${rel} sides.${at[i].key} formation`, `${at[i].id} and ${at[j].id} start ${Math.round(d)} m apart`)
    }
  }
  ctx.count('wargame ships laid out', at.length)
}

// --- goals, phases, the admiral, the first unit ------------------------------------

const shipType = (t) => t !== 'aircraft'
const typesOf = (g) => (Array.isArray(g.types) && g.types.length ? g.types : [g.type])

function checkGoal(ctx, at, g, own, other, { main = false, also = false, duration = 600 } = {}) {
  if (!g || typeof g !== 'object') return ctx.bad(at, 'is missing')
  checkVocab(ctx, at, 'kind', g.kind, 'wargameGoalKinds')
  checkVocab(ctx, at, 'type', g.type, 'wargameGoalTypes')
  if (g.types !== undefined) {
    checkVocab(ctx, at, 'types', g.types, 'wargameGoalTypes')
    if (!Array.isArray(g.types) || !g.types.includes(g.type)) ctx.bad(at, 'types must be a list that includes type')
  }
  if (!isInt(g.count) || g.count < 1) ctx.bad(at, `count ${g.count}: a whole number, one or more`)
  if (main && !also && (typeof g.text !== 'string' || !g.text.trim())) ctx.bad(at, 'has no text')
  if (!main) {
    if (!isInt(g.withinS) || g.withinS < 15) ctx.bad(at, `withinS ${g.withinS}: the phase's timer in whole seconds`)
  } else if (g.withinS !== undefined && !(isInt(g.withinS) && g.withinS <= duration)) ctx.bad(at, `withinS ${g.withinS} runs past durationS`)
  if (g.weapon !== undefined && !WEAPONS.includes(g.weapon)) ctx.bad(at, `weapon “${g.weapon}” is not one of ${WEAPONS.join(' | ')}`)
  if (g.by !== undefined) checkVocab(ctx, at, 'by', g.by, 'wargameGoalTypes')
  if (g.outOfAction !== undefined && (g.outOfAction !== true || g.kind !== 'sink' || !['cv', 'cvl', 'cve'].includes(g.type))) ctx.bad(at, 'outOfAction belongs on a sink of carriers, as true')
  if (g.also !== undefined && (!main || also || !Array.isArray(g.also))) ctx.bad(at, 'also belongs on a main goal, as a list of goals')
  if (g.kind === 'reach' && !num(g.rangeM, 100, 6000)) ctx.bad(at, `rangeM ${g.rangeM}: a reach needs its range, 100 to 6,000 m`)
  if (g.kind !== 'reach' && g.rangeM !== undefined) ctx.bad(at, 'rangeM belongs on a reach')
  if (!isInt(g.count)) return

  // satisfiable by the forces (ROUND-3.md §6: count ≤ what exists)
  const types = typesOf(g)
  const count = (side, ts) => ts.reduce((a, t) => a + side.byType(t), 0)
  const enemyShips = count(other, types.filter(shipType))
  const ownShips = count(own, types.filter(shipType))
  const ownAircraft = own.aircraft.reduce((a, x) => a + x.count, 0)
  const otherAircraft = other.aircraft.reduce((a, x) => a + x.count, 0)
  switch (g.kind) {
    case 'sink':
      if (!types.every(shipType)) ctx.bad(at, 'a sink counts ships')
      else if (g.count > enemyShips) ctx.bad(at, `sink ${g.count} of ${types.join('/')}: the other side has ${enemyShips}`)
      break
    case 'survive':
      if (!types.every(shipType)) ctx.bad(at, 'a survive counts ships')
      else if (g.count > ownShips) ctx.bad(at, `keep ${g.count} of ${types.join('/')} afloat: the side has ${ownShips}`)
      break
    case 'shoot-down':
      if (g.type !== 'aircraft') ctx.bad(at, 'a shoot-down counts aircraft (type aircraft)')
      else if (g.count > otherAircraft) ctx.bad(at, `shoot down ${g.count}: the other side flies ${otherAircraft}`)
      break
    case 'hit':
      if (!types.every(shipType)) ctx.bad(at, 'a hit counts hits on ships')
      else if (enemyShips < 1) ctx.bad(at, `a hit on ${types.join('/')}: the other side has none`)
      break
    case 'reach': {
      if (types.includes('aircraft')) ctx.bad(at, 'a reach closes on ships')
      else if (enemyShips < 1) ctx.bad(at, `a reach to ${types.join('/')}: the other side has none`)
      const by = g.by || 'ship'
      const have = by === 'aircraft' ? ownAircraft : own.byType(by)
      if (g.count > have) ctx.bad(at, `bring ${g.count} ${by} within range: the side has ${have}`)
      break
    }
  }
  // the weapon and the hands that carry it
  const by = g.by
  if (by && by !== 'aircraft' && g.kind !== 'reach' && own.byType(by) < 1) ctx.bad(at, `by ${by}: the side has none`)
  if (by === 'aircraft' && ownAircraft < 1) ctx.bad(at, 'by aircraft: the side has no aircraft')
  if (g.weapon) {
    const shipsBy = own.ships.filter((s) => !by || by === 'ship' || s.type === by)
    const planes = by && by !== 'aircraft' ? [] : own.aircraft
    const ok =
      g.weapon === 'shell'
        ? by !== 'aircraft' && shipsBy.some((s) => (s.kit.guns || []).some((x) => x.role === 'main'))
        : g.weapon === 'torpedo'
          ? (by !== 'aircraft' && shipsBy.some((s) => (s.kit.torpedoes?.tubes ?? 0) > 0)) || planes.some((p) => p.profile === 'torpedo')
          : planes.some((p) => ['dive', 'level'].includes(p.profile))
    if (!ok) ctx.bad(at, `a ${g.weapon} hit: nothing on the side${by ? ` (by ${by})` : ''} carries one`)
  }
  ctx.count('wargame goals')
}

function checkPhases(ctx, at, phases, own, other, duration) {
  if (!Array.isArray(phases)) return ctx.bad(`${at} phases`, 'is missing')
  if (phases.length < 5 || phases.length > 7) (ctx.test ? ctx.warn : ctx.bad)(`${at} phases`, `${phases.length}; ROUND-3.md §2 asks for 5–7 per side`)
  let last = -1
  let lastEnd = 0
  for (const [i, p] of phases.entries()) {
    const where = `${at} phases[${i}]`
    if (!isInt(p?.t) || p.t < 0) {
      ctx.bad(where, `t ${p?.t}: whole seconds from the start`)
      continue
    }
    if (p.t <= last) ctx.bad(where, `t ${p.t} is not after the phase before (${last})`)
    if (i === 0 && p.t !== 0) ctx.warn(where, 'the first phase starts after the clock does')
    if (p.t < lastEnd) ctx.warn(where, `starts at ${p.t} s, before the phase before has run its timer (${lastEnd} s)`)
    last = p.t
    if (typeof p.title !== 'string' || !p.title.trim()) ctx.bad(where, 'has no title')
    if (typeof p.text !== 'string' || !p.text.trim()) ctx.bad(where, 'has no text')
    checkGoal(ctx, `${where} goal`, p.goal, own, other, { duration })
    if (isInt(p.goal?.withinS)) {
      lastEnd = p.t + p.goal.withinS
      if (lastEnd > duration) ctx.bad(where, `t ${p.t} + withinS ${p.goal.withinS} runs past durationS (${duration})`)
    }
    countsAgree(ctx, where, p.text, [p.goal?.count])
    ctx.count('wargame phases')
  }
}

/** The first count in a goal's order (the words after the colon, if any) agrees with the goal's (a heuristic: “two shells” is 2). */
function countsAgree(ctx, at, text, counts) {
  if (typeof text !== 'string') return
  const order = text.includes(':') ? text.slice(text.lastIndexOf(':') + 1) : text
  const m = order.match(new RegExp(`\\b(${Object.keys(WORD_NUMBERS).join('|')})\\b`, 'i'))
  if (m && !counts.includes(WORD_NUMBERS[m[1].toLowerCase()])) ctx.warn(at, `the words say “${m[1]}”; the goal counts ${counts.filter((c) => c !== undefined).join(' or ')}`)
}

function checkAdmiral(ctx, at, A, own) {
  if (!A || typeof A !== 'object') return ctx.bad(at, 'is missing')
  if (!num(A.aggression, 0, 1)) ctx.bad(at, `aggression ${A.aggression}: 0 to 1`)
  if (!num(A.turnAwayAt, 0, 1)) ctx.bad(at, `turnAwayAt ${A.turnAwayAt}: the strength (0 to 1) at which it turns away`)
  if (!num(A.waveGrowth, 0, 2)) ctx.bad(at, `waveGrowth ${A.waveGrowth}: 0 to 2`)
  if (A.waveSize !== undefined && !(isInt(A.waveSize) && A.waveSize >= 0 && A.waveSize <= MAX_AIRBORNE)) ctx.bad(at, `waveSize ${A.waveSize}: 0 to ${MAX_AIRBORNE}`)
  const flies = own.aircraft.length > 0
  if (flies) {
    if (!num(A.launchEveryS, 20, 300)) ctx.bad(at, `launchEveryS ${A.launchEveryS}: a side with aircraft launches in waves`)
    else if (A.launchEveryS < 60 || A.launchEveryS > 90) ctx.warn(at, `launchEveryS ${A.launchEveryS}; ROUND-3.md §1 says every 60–90 s`)
  } else if (A.launchEveryS !== null && A.launchEveryS !== undefined) ctx.bad(at, `launchEveryS ${A.launchEveryS}: the side has no aircraft (null)`)
}

function checkFirst(ctx, at, S, own, kits) {
  const ship = own.ships.find((s) => s.id === S.first)
  const plane = !ship && own.aircraft.find((a) => a.kit === S.first)
  if (!ship && !plane) return ctx.bad(`${at} first`, `“${S.first}” is neither one of the side’s ships nor an aircraft kit it has`)
  if (plane && !own.aircraft.some((a) => a.kit === S.first && a.airborne > 0)) ctx.warn(`${at} first`, `no ${S.first} is airborne at the start: the cut lands on a deck`)
  if (S.firstStation !== undefined) {
    checkVocab(ctx, `${at} firstStation`, 'firstStation', S.firstStation, 'stations')
    const offered = ship ? stationsOf(ship.kit, 'ship') : stationsOf(kits.aircraft.get(S.first), 'aircraft')
    if (!offered.includes(S.firstStation)) ctx.bad(`${at} firstStation`, `“${S.firstStation}” is not a station ${S.first} offers (${offered.join(', ')})`)
  }
  ctx.count('wargame first units')
}

// --- the voice -----------------------------------------------------------------------

/** Sentences in a text, initials and the usual abbreviations aside. */
export function sentences(text) {
  const t = String(text)
    .replace(/\b(?:St|No|Nos|Mt|Lt|Cdr|Capt|Adm|Ens|Jr|Sr|Gen|Col|Maj|Vol|vol|ch|chs|p|pp|n|nn|e\.g|i\.e|U\.S|cf)\./g, (m) => m.replace(/\./g, '·'))
    .replace(/\b[A-Z]\./g, (m) => m.replace('.', '·'))
    .replace(/\d\.\d/g, (m) => m.replace('.', '·'))
    .trim()
  const ends = t.match(/[.!?](?=\s|$|[”’"')])/g) || []
  return /[.!?][”’"')]*$/.test(t) ? ends.length : ends.length + 1
}

/** Every string in a value, with its path. */
function* strings(v, path = '') {
  if (typeof v === 'string') yield [path, v]
  else if (Array.isArray(v)) for (const [i, x] of v.entries()) yield* strings(x, `${path}[${i}]`)
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) yield* strings(x, path ? `${path}.${k}` : k)
}

function checkWords(ctx, rel, W, battle) {
  // every string, notes too: slurs, glory words, the never-list
  const all = [...strings(W)]
  const card = all.map(([, s]) => s).join(' ')
  for (const [path, s] of all) {
    checkVoice(ctx, `${rel} ${path}`, s, { card })
    const m = s.match(NEVER)
    if (m) ctx.bad(`${rel} ${path}`, `“${m[0]}”: never in the app’s voice (ROUND-3.md §1, DESIGN.md §7.4)`)
  }

  // the user-facing strings, in the order a visitor meets them: the start sheet, the HUD, the end card
  const sheet = [['title', W.title], ['label', W.label]]
  const hud = []
  for (const key of Object.keys(SIDES)) {
    const S = W.sides?.[key]
    if (!S) continue
    sheet.push([`sides.${key}.name`, S.name], [`sides.${key}.leader`, S.leader], [`sides.${key}.goal.text`, S.goal?.text])
    for (const [i, p] of (S.phases || []).entries()) hud.push([`sides.${key}.phases[${i}].title`, p?.title], [`sides.${key}.phases[${i}].text`, p?.text])
    countsAgree(ctx, `${rel} sides.${key}.goal`, S.goal?.text, [S.goal?.count, ...(S.goal?.also || []).map((g) => g?.count)])
  }
  const end = [['footnote', W.footnote]]
  const shown = [...sheet, ...hud, ...end].filter(([, s]) => typeof s === 'string')
  for (const [path, s] of shown) {
    const at = `${rel} ${path}`
    checkCopy(ctx, at, s)
    checkJapaneseNames(ctx, at, s, JAPANESE_NAMES)
    checkScoreLine(ctx, at, s)
    const pc = s.match(PEOPLE_COUNT)
    if (pc) ctx.bad(at, `a count of people (“${pc[0]}”): the wargame speaks of ships and aircraft only`)
    const dw = s.match(DEAD_WORDS)
    if (dw) ctx.bad(at, `“${dw[0]}”: the wargame’s voice is machines, not people (ROUND-3.md §1); crews “lost their lives”, aircraft “did not return”, in the record’s own cards`)
  }

  // Japanese names: the family name in capitals with the given name and the kanji at a card's first mention
  // (the start sheet, whose first mention the HUD's later ones lean on, and the end card on its own)
  for (const [cardName, list] of [['the start sheet', [...sheet, ...hud]], ['the end card', end]]) {
    const texts = list.filter(([, s]) => typeof s === 'string')
    for (const [family, givens] of FAMILIES) {
      const re = new RegExp(`(?<![\\p{L}])${escapeRe(family)}(?![\\p{L}])`, 'iu')
      const first = texts.find(([, s]) => re.test(s))
      if (!first) continue
      const full = new RegExp(`${escapeRe(upper(family))} (?:${givens.map(escapeRe).join('|')}) ${CJK.source}`, 'u')
      if (!full.test(first[1])) ctx.bad(`${rel} ${first[0]}`, `first mention of ${family} on ${cardName}: write “${upper(family)} ${givens.join(' or ')}” with the kanji (DESIGN.md §7.3)`)
      ctx.count('wargame names held to their first mention')
    }
  }

  // tokkō, glossed where it is first named
  const firstTokko = shown.find(([, s]) => /tokk[ōo]/i.test(s))
  if (firstTokko && !/tokk[ōo] \(special attack\)/i.test(firstTokko[1])) ctx.bad(`${rel} ${firstTokko[0]}`, '“tokkō” is written “tokkō (special attack)” where it is first named (DESIGN.md §7.3)')

  // no ship named that the scenario does not field (the box's units of either side)
  const fielded = new Set(Object.values(W.sides || {}).flatMap((S) => S?.ships || []))
  const absent = battle.units.filter((u) => !fielded.has(u.id) && typeof u.name === 'string' && u.name.length > 2)
  for (const [path, s] of [...sheet, ...hud].filter(([, x]) => typeof x === 'string')) {
    for (const u of absent) if (new RegExp(`(?<![\\p{L}])${escapeRe(u.name)}(?![\\p{L}])`, 'u').test(s)) ctx.bad(`${rel} ${path}`, `names ${u.name}, which is not in the scenario’s forces`)
  }
}
