// The battles' check (DATA.md §9 and §10, ENGINEERING.md §5 and §12): every
// boxes/<id>/battle.json for the frozen boxes in tools/check/ids.json, its
// cites resolved through public/data/sources.json (the battles' fragment of
// the ledger, sources-battles.json, was merged into it at the integration;
// a fragment, if one comes back, is still held to the ledger's schema).
//
// What it holds the record to:
// - the clock: the frozen zone, name and span; the other clocks each box must
//   name (Midway's three, Guadalcanal's two inside one document, Samar's TROM
//   hour, Pearl Harbor's Tokyo and GCT); every t parsing on the box clock, the
//   tracks, groups, stops and moments inside it, events and fates allowed past
//   it (Kaga sinks at 19:25, after Midway's clock closes at 18:00);
// - every sourceClock conversion recomputed (common.mjs), and a fix or event
//   whose first source keeps another clock (Nagumo's Tokyo time, the carriers'
//   zone +10, South Dakota's zone −12, Bishop's Point's GCT) refused without
//   its sourceClock and sourceZone (R5 §10.1: the commonest error is a beat
//   copied without conversion);
// - units: the frozen kits and their sides, tracks with two fixes and a
//   precision each, stations with a guide that resolves and no cycle, parked
//   aircraft at a site, events of the vocabulary with a cause where it asks,
//   counts as ranges, damage shares, hangarHazard on every carrier, fates that
//   agree with their events, and the box holding every track with 10 km to
//   spare (a warning: the frozen Midway bounds stop short of TF 16 and TF 17);
// - the owner's rules (DESIGN.md §3.5, R8 §5): fixed units whose causes no
//   role can be, the hospital ship never a target, tokkō units and groups
//   never a role, no role among Pearl Harbor's first-wave level bombers, no
//   role naming a person, the Samar clock ending before the St. Lo beat and
//   the Shikishima unit outside it;
// - groups: launch, route, attack, recovery in order and inside the clock (or
//   an off-box entry on the box's edge), the attack profile of the vocabulary,
//   `reached` inside the count, losses as ranges, every scripted count the
//   group causes within what reached;
// - sites (R10 D11): the kinds below, inside the box, buildings with people
//   never targets; Pearl Harbor's airfields, hangars, drydocks, quays, AA
//   positions and its barracks and hospital, the berths at their precisions;
// - stops and moments: windows, durations, time scales, checkpoints, starts
//   relative to a unit or site the record has at that minute, objectives,
//   beats, the record's hits, after-cards with an opened source;
// - the copy and voice rules on every user-facing string (common.mjs), counts
//   only in tellings and typed fields, the words for the dead (R8 §3.6);
// - routes.json, when it exists: a fleet route of the battle's event that
//   names box units agrees with their tracks at the battle's start (20 km).
//
// Against test-data (the fixtures) the content rules that only the real
// battles carry (hangarHazard, reached, each box's own clocks and rules) are
// warnings, and the structure is held as for the real files.

import {
  checkIds,
  checkVocab,
  battleClock,
  battleTime,
  checkSourceClock,
  checkZone,
  checkCopy,
  checkNoNumbers,
  checkVoice,
  checkJapaneseNames,
  checkScoreLine,
  kmBetween,
  instant,
  wrapLon,
} from './common.mjs'

// --- vocabularies the battles add (not frozen in ids.json; documented in research/battles.md)
export const SITE_KINDS = ['airfield', 'hangar', 'ramp', 'seaplane-base', 'drydock', 'quay', 'aa', 'fuel-tanks', 'radar', 'building', 'barracks', 'hospital', 'command-post', 'landmark']
/** Sites that hold people: terrain, never a target (DESIGN.md §7.4). */
export const PEOPLE_SITES = ['building', 'barracks', 'hospital', 'command-post']
export const FATE_KINDS = ['sunk', 'scuttled', 'capsized', 'beached', 'damaged', 'undamaged', 'withdrew', 'lost', 'returned']
export const OBJECTIVE_KINDS = ['dive', 'torpedo', 'level', 'gunnery', 'helm', 'intercept', 'cap', 'escort', 'sortie', 'aa']
/** DATA.md §9's kinds that carry a cause, with ids.json's (the two lists differ; the union holds). */
const CAUSE_KINDS = ['hit', 'torpedo-hit', 'near-miss', 'opens-fire', 'torpedoes-fired', 'illuminated', 'launches', 'scuttled']
/** Kinds that carry nothing but a time and sources (DATA.md §9). */
const BARE_KINDS = ['sinks', 'explodes', 'dead-in-water']
/** A unit's fate events, which the HUD prints: each carries the record's own line (or hud: false). */
const FATE_LINE_KINDS = ['sinks', 'scuttled', 'explodes', 'abandoned']
const SINKING = { sunk: ['sinks', 'explodes'], scuttled: ['scuttled', 'sinks'], capsized: ['sinks'] }

/** Sources that keep a clock other than the record's own, by id (R2 §3, R4 §2.1, R5 §2, R10 §2). */
const SOURCE_ZONES = [
  { id: 'nagumo-1947', zone: '+09:00' },
  { id: 'pha-exhibit-8', zone: '+09:00' },
  { id: 'jm-97', zone: '+09:00' },
  { id: 'cv5-midway-1942', zone: '-10:00' },
  { id: 'cv6-midway-1942', zone: '-10:00' },
  { id: 'cv8-midway-1942', zone: '-10:00' },
  { id: 'ctf16-midway-1942', zone: '-10:00' },
  { id: 'comcrupac-midway-1942', zone: '-10:00' },
  { id: 'ar-south-dakota-1942', zone: '+12:00' },
  { id: 'wdr-south-dakota-1942', zone: '+12:00' },
  { id: /^lundgren-/, zone: '+12:00' },
  { id: 'oni-cn-guadalcanal-1944', where: /Part III/, zone: '+12:00' },
  { id: 'pha-exhibit-119', zone: '+00:00' },
]

/** Each box's own rules (DATA.md §7, §9; R4, R5, R10). */
const BOX_RULES = {
  midway: { others: ['+09:00', '-10:00'], moments: 9 },
  'ironbottom-sound': { others: ['+12:00', '+09:00'], moments: 4, crossesMidnight: true },
  samar: { others: ['+08:00'], moments: 5, stLo: true },
  'pearl-harbor': {
    others: ['+09:00', '+00:00'],
    moments: 5,
    fixed: ['arizona', 'oklahoma', 'utah'],
    hospital: ['solace'],
    tokkoKit: 'type-a-midget',
    sites: ['airfield', 'hangar', 'drydock', 'quay', 'aa', 'barracks', 'hospital'],
    berths: { 'berth-f3': 'schematic', 'berth-f4': 'schematic', 'berth-f5': 'schematic', 'berth-f6': 'chart', 'berth-f7': 'chart', 'berth-f8': 'chart' },
  },
}

/** People the record names (R4, R5, R8 §4.1, R10): a role never names them; Japanese names stand family name first. */
export const JAPANESE_NAMES = [
  ['Nagumo', 'Chūichi'], ['Yamaguchi', 'Tamon'], ['Tomonaga', 'Jōichi'], ['Kobayashi', 'Michio'], ['Abe', 'Hiroaki'], ['Kimura', 'Koreo'],
  ['Kondō', 'Nobutake'], ['Iwabuchi', 'Sanji'], ['Kimura', 'Susumu'], ['Hashimoto', 'Shintarō'], ['Takama', 'Tamotsu'], ['Kurita', 'Takeo'],
  ['Ugaki', 'Matome'], ['Suzuki', 'Yoshio'], ['Shiraishi', 'Kazutaka'], ['Hayakawa', 'Mikio'], ['Seki', 'Yukio'], ['Fuchida', 'Mitsuo'],
  ['Murata', 'Shigeharu'], ['Itaya', 'Shigeru'], ['Kitajima', 'Ichirō'], ['Shiga', 'Yoshio'], ['Takahashi', 'Kakuichi'], ['Sakamoto', 'Akira'],
  ['Kusumi', 'Tadashi'], ['Egusa', 'Takashige'], ['Shimazaki', 'Shigekazu'], ['Makino', 'Saburō'], ['Iida', 'Fusata'], ['Nōno', 'Sumio'],
  ['Shindō', 'Saburō'], ['Yoshioka', 'Masamitsu'], ['Sakamaki', 'Kazuo'], ['Nishikaichi', 'Shigenori'], ['Genda', 'Minoru'], ['Tokuno', 'Horishi'],
  ['Koyanagi', 'Tomiji'], ['Ōtani', 'Tonosuke'], ['Kaku', 'Tomeo'], ['Yamamoto', 'Isoroku'], ['Hashimoto', 'Toshio'],
].map(([family, given]) => ({ family, given }))
export const US_NAMES = [
  'McClusky', 'Gallaher', 'Leslie', 'Holmberg', 'Thach', 'Massey', 'Waldron', 'Lindsey', 'Henderson', 'Sweeney', 'Spruance', 'Fletcher', 'Kroeger',
  'Weber', 'Bassett', 'Adams', 'Gatch', 'Fraser', 'Stormes', 'Fellows', 'Sprague', 'Evans', 'Kintberger', 'Hathaway', 'Copeland', 'Vieweg', 'Fowler',
  'Welch', 'Taylor', 'Sanders', 'Sterling', 'Rasmussen', 'Thacker', 'Sedberry', 'Taussig', 'Kimmel', 'Outerbridge', 'Nimitz', 'Stump', 'Ofstie',
  'Huxtable', 'Hagen', 'Kinkaid', 'Gay',
]
const PERSON_WORDS = [...new Set([...JAPANESE_NAMES.map((n) => n.family), ...US_NAMES, 'Best', 'Lee', 'Davis'])]

// ---------------------------------------------------------------------------

const isRange = (v) => Array.isArray(v) && v.length === 2 && v.every((x) => Number.isInteger(x) && x >= 0) && v[0] <= v[1]
const isLonLat = (c) => Array.isArray(c) && c.length === 2 && c.every(Number.isFinite) && Math.abs(c[1]) <= 90
const fmt = (s) => `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(Math.round(s % 60)).padStart(2, '0')}`

/** Destination from [lon, lat] by a compass bearing and metres (equirectangular; boxes are small). */
function offset([lon, lat], bearingDeg, m) {
  const b = (bearingDeg * Math.PI) / 180
  const dlat = (m * Math.cos(b)) / 110574
  const dlon = (m * Math.sin(b)) / (111320 * Math.cos((lat * Math.PI) / 180))
  return [lon + dlon, lat + dlat]
}

export default function check(ctx) {
  const boxes = ctx.frozen.boxes
  const ledger = loadLedger(ctx)
  let any = false
  for (const [boxId, frozen] of Object.entries(boxes)) {
    const rel = `boxes/${boxId}/battle.json`
    const battle = ctx.load(rel)
    if (battle === undefined) {
      ctx.warn(rel, 'not here yet')
      continue
    }
    if (!battle || typeof battle !== 'object' || Array.isArray(battle)) {
      ctx.bad(rel, 'must be an object')
      continue
    }
    any = true
    checkBattle(ctx, rel, boxId, frozen, battle, ledger)
  }
  if (!any) ctx.warn('boxes/*/battle.json', 'no battle files to check')
}

// --- the ledger -------------------------------------------------------------------

function loadLedger(ctx) {
  const ids = new Map()
  const frag = ctx.load('sources-battles.json')
  const V = ctx.vocab
  if (frag !== undefined && frag !== null) {
    if (!Array.isArray(frag)) ctx.bad('sources-battles.json', 'must be an array (sources.json’s schema)')
    else {
      checkIds(ctx, frag, 'sources-battles.json')
      for (const s of frag) {
        const at = `sources-battles.json ${s.id}`
        for (const k of ['title', 'author', 'url', 'access', 'language', 'licence']) if (s[k] === undefined || s[k] === '') ctx.bad(at, `has no ${k}`)
        if (!(Number.isInteger(s.year) || typeof s.year === 'string')) ctx.bad(at, 'has no year')
        if (typeof s.opened !== 'boolean') ctx.bad(at, 'opened must be true or false')
        if (s.access !== undefined) checkVocab(ctx, at, 'access', s.access, 'sourceAccess')
        if (s.language !== undefined) checkVocab(ctx, at, 'language', s.language, 'sourceLanguage')
        if (s.licence !== undefined) checkVocab(ctx, at, 'licence', s.licence, 'sourceLicence')
        if (s.read !== undefined) checkVocab(ctx, at, 'read', s.read, 'sourceRead')
        else if (s.opened) ctx.warn(at, 'opened: true and no read')
        if (s.opened === false && s.read && s.read !== 'title') ctx.bad(at, `read: ${s.read} but opened: false`)
        if (s.licence === 'copyright-cite-only' && s.url && s.url !== '—' && /archive\.org\/details\/husno/.test(s.url)) ctx.bad(at, 'links an unlicensed upload of a copyright work (DATA.md §4)')
        if (typeof s.tertiary !== 'boolean') ctx.warn(at, 'has no tertiary flag')
        ids.set(s.id, s)
      }
      ctx.count('battle sources', frag.length)
    }
  }
  // the ledger: since the integration the fragment is merged into sources.json (gazetteer.mjs holds its schema)
  const main = ctx.load('sources.json')
  if (Array.isArray(main)) for (const s of main) if (s?.id && !ids.has(s.id)) ids.set(s.id, s)
  return ids
}

// --- one battle ---------------------------------------------------------------------

function checkBattle(ctx, rel, boxId, frozen, B, ledger) {
  const rules = ctx.test ? {} : BOX_RULES[boxId] || {}
  const need = ctx.test ? ctx.warn : ctx.bad
  const people = { japanese: JAPANESE_NAMES }

  // --- the header
  if (B.id !== boxId) ctx.bad(rel, `id “${B.id}”; the box is ${boxId}`)
  if (B.event !== frozen.event) ctx.bad(rel, `event “${B.event}”; frozen ${frozen.event}`)
  if (typeof B.title !== 'string' || !B.title) ctx.bad(rel, 'has no title')
  if (!B.ja?.kanji || !B.ja?.romaji) need(rel, 'needs ja.kanji and ja.romaji (the battle’s Japanese name and its reading)')
  for (const t of [B.title]) text(ctx, `${rel} title`, t, { people })

  // --- the clock
  const c = B.clock || {}
  if (c.zone !== frozen.clock.zone) ctx.bad(`${rel} clock`, `zone ${c.zone}; frozen ${frozen.clock.zone}`)
  if (c.id !== undefined && c.id !== frozen.clock.id) ctx.bad(`${rel} clock`, `id ${c.id}; frozen ${frozen.clock.id}`)
  if (c.name !== frozen.clock.name) ctx.bad(`${rel} clock`, `name “${c.name}”; frozen “${frozen.clock.name}”`)
  for (const k of ['from', 'to']) {
    const a = instant(ctx, `${rel} clock.${k}`, c[k])
    const b = instant(ctx, `frozen ${boxId} clock.${k}`, frozen.clock[k])
    if (a !== null && b !== null && a !== b) ctx.bad(`${rel} clock.${k}`, `${c[k]}; frozen ${frozen.clock[k]}`)
  }
  const clock = battleClock(ctx, rel, c)
  if (!clock) return
  if (!Array.isArray(c.others)) need(`${rel} clock`, 'has no others (the source clocks the record uses)')
  for (const [i, o] of (c.others || []).entries()) {
    const at = `${rel} clock.others[${i}]`
    if (!o.name) ctx.bad(at, 'has no name')
    if (!o.rule) ctx.bad(at, 'has no rule')
    checkZone(ctx, `${at} zone`, o.zone)
    if (o.id && !(o.id in ctx.frozen.clocks)) ctx.bad(at, `id ${o.id} is not a frozen clock`)
    if (o.id && ctx.frozen.clocks[o.id] && ctx.frozen.clocks[o.id] !== o.zone) ctx.bad(at, `zone ${o.zone}; the frozen ${o.id} is ${ctx.frozen.clocks[o.id]}`)
  }
  for (const z of rules.others || []) if (!(c.others || []).some((o) => o.zone === z)) ctx.bad(`${rel} clock.others`, `has no clock at ${z} (DATA.md §9; R4 §2.1, R5 §2, R10 §2)`)
  text(ctx, `${rel} clock.note`, c.note, { numbers: false, people })
  if (rules.crossesMidnight && clock.duration > 0) {
    const fromDay = new Date(clock.fromMs + clock.off).getUTCDate()
    const toDay = new Date(clock.toMs + clock.off).getUTCDate()
    if (fromDay === toDay) ctx.bad(`${rel} clock`, 'is meant to cross midnight')
  }

  const T = (at, t, inside = true) => battleTime(ctx, at, clock, t, { inside })
  const outside = (at, t) => T(at, t, false)

  // --- ids
  const units = checkIds(ctx, B.units || [], `${rel} units`)
  const groups = checkIds(ctx, B.groups || [], `${rel} groups`)
  const sites = checkIds(ctx, B.sites || [], `${rel} sites`)
  const moments = checkIds(ctx, B.moments || [], `${rel} moments`)
  for (const id of units.keys()) if (groups.has(id) || sites.has(id)) ctx.bad(`${rel} ${id}`, 'is both a unit and a group or site')
  for (const id of groups.keys()) if (sites.has(id)) ctx.bad(`${rel} ${id}`, 'is both a group and a site')
  const thing = (id) => units.get(id) || groups.get(id) || sites.get(id)
  const src = sourceRef(ctx, ledger)

  // --- weather
  const w = B.weather
  if (!w) need(rel, 'has no weather')
  else {
    if (!(Number.isFinite(w.wind?.fromDeg) && Number.isFinite(w.wind?.kn))) ctx.bad(`${rel} weather`, 'needs wind.fromDeg and wind.kn')
    if (!Number.isFinite(w.visibilityM)) ctx.bad(`${rel} weather`, 'needs visibilityM')
    if (w.cloud && !(w.cloud.cover >= 0 && w.cloud.cover <= 1)) ctx.bad(`${rel} weather.cloud`, 'cover is 0..1')
    for (const [i, s] of (w.squalls || []).entries()) {
      const at = `${rel} weather.squalls[${i}]`
      const a = T(at, s.from)
      const b = T(at, s.to, false)
      if (a !== null && b !== null && b < a) ctx.bad(at, 'ends before it begins')
      if (!Array.isArray(s.polygon) || s.polygon.length < 4 || !s.polygon.every(isLonLat)) ctx.bad(at, 'needs a closed polygon of [lon, lat]')
      if (s.velocity && !(Number.isFinite(s.velocity.towardDeg) && Number.isFinite(s.velocity.kn))) ctx.bad(at, 'velocity needs towardDeg and kn')
    }
    text(ctx, `${rel} weather.note`, w.note, { numbers: false, people })
    for (const s of w.sources || []) src(`${rel} weather`, s)
  }

  // --- sides
  if (!B.sides || typeof B.sides !== 'object') ctx.bad(rel, 'has no sides')
  else for (const [k, v] of Object.entries(B.sides)) if (!v?.name) ctx.bad(`${rel} sides.${k}`, 'has no name')

  // --- sites
  const bounds = frozen.bounds
  const holds = boxHolder(ctx, rel, frozen)
  for (const s of B.sites || []) {
    const at = `${rel} site ${s.id}`
    if (!SITE_KINDS.includes(s.kind)) ctx.bad(at, `kind “${s.kind}” is not one of ${SITE_KINDS.join(' | ')}`)
    if (!isLonLat(s.lonlat)) ctx.bad(at, 'needs lonlat')
    else holds(at, s.lonlat, 0)
    if (!ctx.vocab.battleSides.includes(s.side)) ctx.bad(at, `side “${s.side}” is not one of ${ctx.vocab.battleSides.join(' | ')}`)
    if (typeof s.target !== 'boolean') ctx.bad(at, 'needs target: true or false')
    if (PEOPLE_SITES.includes(s.kind) && s.target !== false) ctx.bad(at, `a ${s.kind} holds people: target must be false (DESIGN.md §7.4)`)
    if (s.precision) checkVocab(ctx, at, 'precision', s.precision, 'trackPrecision')
    if (!s.name) ctx.bad(at, 'has no name')
    if (!(s.sources || []).length) need(at, 'has no sources')
    for (const x of s.sources || []) src(at, x)
    text(ctx, `${at} note`, s.note, { numbers: true, people })
    for (const [i, e] of (s.events || []).entries()) event(`${at} events[${i}]`, e, s, true)
    ctx.count('sites')
  }
  if (rules.sites) for (const k of rules.sites) if (![...sites.values()].some((s) => s.kind === k)) ctx.bad(`${rel} sites`, `has no ${k} (R10 D11, DATA.md §9)`)
  if (rules.berths) {
    for (const [id, p] of Object.entries(rules.berths)) {
      const s = sites.get(id)
      if (!s) ctx.bad(`${rel} sites`, `has no ${id}`)
      else if (s.precision !== p) ctx.bad(`${rel} site ${id}`, `precision ${s.precision}; R10 D14 has ${p}`)
    }
  }

  // --- units
  const fixedIds = new Set([...units.values()].filter((u) => u.fixed).map((u) => u.id))
  const posCache = new Map()
  const posAt = (u, tS, depth = 0) => unitPosAt(u, tS, depth, units, sites, clock, posCache)
  const offBoxUnits = new Set([...groups.values()].filter((g) => g.offBox && g.from).map((g) => g.from))
  for (const u of units.values()) if (u.offBox) offBoxUnits.add(u.id)
  const allEvents = []

  for (const u of B.units || []) {
    if (typeof u?.id !== 'string') continue
    const at = `${rel} unit ${u.id}`
    ctx.count('units')
    const kitShip = ctx.frozen.kits.ships[u.kit]
    const kitAir = ctx.frozen.kits.aircraft[u.kit]
    const kit = kitShip || kitAir
    if (!kit) ctx.bad(at, `kit “${u.kit}” is not a frozen kit`)
    else if (kit.side !== u.side) ctx.bad(at, `side ${u.side}; kit ${u.kit} is ${kit.side}`)
    if (!ctx.vocab.battleSides.includes(u.side)) ctx.bad(at, `side “${u.side}” is not one of ${ctx.vocab.battleSides.join(' | ')}`)
    if (!u.name) ctx.bad(at, 'has no name')
    if (u.side === 'jp' && kitShip && !u.ja) need(at, 'a Japanese ship needs its ja name')
    if (kitAir && !u.station?.parked) ctx.bad(at, 'an aircraft unit is a parked aircraft: station.parked at a site')
    if (!u.track && !u.station) ctx.bad(at, 'has neither a track nor a station')
    if (u.track) track(at, u)
    if (u.station) station(at, u)
    for (const [i, e] of (u.events || []).entries()) {
      event(`${at} events[${i}]`, e, u)
      allEvents.push({ unit: u, e })
    }
    const type = kitShip?.type
    if ((type === 'cv' || type === 'cve' || type === 'cvl') && !ctx.test) {
      if (!Array.isArray(u.hangarHazard) || !u.hangarHazard.length) ctx.bad(at, 'a carrier needs hangarHazard by the clock (ENGINEERING.md §5)')
    }
    for (const [i, h] of (u.hangarHazard || []).entries()) {
      const hat = `${at} hangarHazard[${i}]`
      outside(hat, h.t)
      if (!(h.h >= 0 && h.h <= 1)) ctx.bad(hat, 'h is 0..1')
      checkSourceClock(ctx, hat, h, clock)
      for (const x of h.sources || []) src(hat, x)
    }
    if (u.hospital) {
      if (u.target !== false) ctx.bad(at, 'a hospital unit has target: false (DATA.md §9)')
    }
    if (u.tokko !== undefined && u.tokko !== true) ctx.bad(at, 'tokko is true or absent')
    if (kitShip?.tokko && u.tokko !== true) ctx.bad(at, `kit ${u.kit} is tokkō: the unit carries tokko: true`)
    if (kitShip?.hospital && !u.hospital) ctx.bad(at, `kit ${u.kit} is a hospital ship: the unit carries hospital: true`)
    if (u.fate) fate(at, u)
    for (const x of u.sources || []) src(at, x)
    text(ctx, `${at} note`, u.note, { numbers: true, people })
    text(ctx, `${at} kitNote`, u.kitNote, { numbers: false, people })
  }
  for (const id of rules.fixed || []) if (!units.get(id)?.fixed) ctx.bad(`${rel} unit ${id}`, 'must carry fixed: true (DESIGN.md §3.5, R8 D1)')
  for (const id of rules.hospital || []) if (!units.get(id)?.hospital) ctx.bad(`${rel} unit ${id}`, 'must carry hospital: true and target: false')
  if (rules.tokkoKit) {
    const tk = [...units.values()].filter((u) => u.kit === rules.tokkoKit)
    if (!tk.length) ctx.bad(`${rel} units`, `has no ${rules.tokkoKit} (R10 D9)`)
  }

  // --- groups
  for (const g of B.groups || []) {
    if (typeof g?.id !== 'string') continue
    const at = `${rel} group ${g.id}`
    ctx.count('groups')
    const kit = ctx.frozen.kits.aircraft[g.kit]
    if (!kit) ctx.bad(at, `kit “${g.kit}” is not a frozen aircraft kit`)
    else if (kit.side !== g.side) ctx.bad(at, `side ${g.side}; kit ${g.kit} is ${kit.side}`)
    if (!ctx.vocab.battleSides.includes(g.side)) ctx.bad(at, `side “${g.side}” is not one of ${ctx.vocab.battleSides.join(' | ')}`)
    if (!g.name) ctx.bad(at, 'has no name')
    if (!(Number.isInteger(g.count) && g.count > 0)) ctx.bad(at, 'count is a whole number above 0')
    if (/tokk[oō]|kamikaze|special attack/i.test(`${g.id} ${g.attack?.profile || ''}`) && !g.tokko) ctx.bad(at, 'a group named for a tokkō attack carries tokko: true')
    const tokkoOutside = g.tokko === true && boxId === 'samar'
    const inside = !tokkoOutside
    let tLaunch = null
    if (g.offBox) {
      if (!g.enter) ctx.bad(at, 'an off-box group needs enter { t, lonlat, headingDeg, altM }')
      else {
        tLaunch = T(`${at} enter`, g.enter.t, inside)
        if (!isLonLat(g.enter.lonlat)) ctx.bad(`${at} enter`, 'needs lonlat')
        else edge(`${at} enter`, g.enter.lonlat)
        if (!Number.isFinite(g.enter.headingDeg) || !Number.isFinite(g.enter.altM)) ctx.bad(`${at} enter`, 'needs headingDeg and altM')
        checkSourceClock(ctx, `${at} enter`, g.enter, clock)
      }
      if (g.launch) outside(`${at} launch`, g.launch)
    } else {
      if (!g.launch) ctx.bad(at, 'has no launch (or offBox and enter)')
      else tLaunch = T(`${at} launch`, g.launch, inside)
    }
    if (g.from !== undefined && g.from !== null && !thing(g.from)) ctx.bad(at, `from “${g.from}” is neither a unit nor a site`)
    if (!g.from && !g.offBox) ctx.bad(at, 'has no from')
    if (g.launchSource) checkSourceClock(ctx, `${at} launchSource`, g.launchSource, clock)
    let last = tLaunch
    for (const [i, p] of (g.route || []).entries()) {
      const pat = `${at} route[${i}]`
      const s = T(pat, p.t, inside)
      if (!isLonLat(p.lonlat)) ctx.bad(pat, 'needs lonlat')
      else if (!g.offBox || i > 0) holds(pat, p.lonlat, 0)
      if (!Number.isFinite(p.altM)) ctx.bad(pat, 'needs altM')
      if (p.precision) checkVocab(ctx, pat, 'precision', p.precision, 'trackPrecision')
      if (s !== null && last !== null && s < last) ctx.bad(pat, 'is earlier than the point before it')
      if (s !== null) last = s
      checkSourceClock(ctx, pat, p, clock)
      if (p.source) src(pat, p.source)
    }
    const a = g.attack
    if (!a) ctx.bad(at, 'has no attack')
    else {
      const aat = `${at} attack`
      checkVocab(ctx, aat, 'profile', a.profile, 'attackProfiles')
      const s = T(aat, a.t, inside)
      if (s !== null && last !== null && s < last) ctx.bad(aat, 'is earlier than the launch or the route')
      if (s !== null) last = s
      if (a.target !== undefined && a.target !== null) {
        for (const id of [a.target].flat()) if (!thing(id)) ctx.bad(aat, `target “${id}” is not a unit, group or site`)
      } else if (!['cap', 'search', 'escort'].includes(a.profile)) ctx.bad(aat, 'has no target')
      if (['dive', 'torpedo', 'level', 'strafe'].includes(a.profile) && a.target) {
        if (!isRange(a.reached)) need(aat, 'needs reached: [low, high], how many reached the release in the record (ENGINEERING.md §5)')
      }
      if (a.reached !== undefined) {
        if (!isRange(a.reached)) ctx.bad(aat, 'reached is a range [low, high] of whole numbers')
        else if (a.reached[1] > g.count) ctx.bad(aat, `reached ${a.reached[1]} is more than the count ${g.count}`)
      }
      if (a.window) {
        const w0 = T(`${aat} window`, a.window[0], inside)
        const w1 = T(`${aat} window`, a.window[1], inside)
        if (w0 !== null && w1 !== null && w1 < w0) ctx.bad(aat, 'window ends before it begins')
      }
      checkSourceClock(ctx, aat, a, clock)
      for (const x of a.sources || []) src(aat, x)
    }
    for (const [i, l] of (g.lossesBy || []).entries()) {
      const lat = `${at} lossesBy[${i}]`
      if (!(units.has(l.by) || groups.has(l.by) || sites.has(l.by))) ctx.bad(lat, `by “${l.by}” is not a unit, group or site`)
      if (!isRange(l.count)) ctx.bad(lat, 'count is a range')
      if (l.t) T(lat, l.t, inside)
    }
    for (const [i, l] of (g.losses || []).entries()) {
      if (!isRange(l)) ctx.bad(`${at} losses[${i}]`, 'is a range [low, high]')
      else if (l[1] > g.count) ctx.bad(`${at} losses[${i}]`, `${l[1]} is more than the count ${g.count}`)
    }
    if (g.recover) {
      const s = T(`${at} recover`, g.recover.t, false)
      if (s !== null && last !== null && s < last) ctx.bad(`${at} recover`, 'is before the attack')
      if (g.recover.to && !thing(g.recover.to)) ctx.bad(`${at} recover`, `to “${g.recover.to}” is not a unit or site`)
      checkSourceClock(ctx, `${at} recover`, g.recover, clock)
    }
    if (!(g.sources || []).length) need(at, 'has no sources')
    for (const x of g.sources || []) src(at, x)
    tellings(at, g.tellings)
    text(ctx, `${at} note`, g.note, { numbers: true, people })
    if (tokkoOutside && a) {
      const s = T(`${at} attack`, a.t, false)
      if (s !== null && s <= clock.duration) ctx.bad(`${at} attack`, 'the Shikishima unit stays outside the Samar clock (DATA.md §7, R8 D3)')
    }
  }
  // what each group causes stays within what reached
  for (const { unit, e } of allEvents) {
    const g = groups.get(e.by)
    if (!g || !isRange(e.count) || !isRange(g.attack?.reached)) continue
    if (['hit', 'torpedo-hit', 'near-miss'].includes(e.kind) && e.count[1] > g.attack.reached[1]) ctx.bad(`${rel} unit ${unit.id} event ${e.t}`, `${e.count[1]} hits by ${g.id}, more than the ${g.attack.reached[1]} that reached`)
  }

  // --- the owner's rules on causes and roles
  const roleCauses = new Set()
  for (const m of B.moments || []) {
    if (m?.role?.group) roleCauses.add(m.role.group)
    if (m?.role?.unit) roleCauses.add(m.role.unit)
  }
  for (const { unit, e } of allEvents) {
    if (fixedIds.has(unit.id) && e.by && roleCauses.has(e.by)) ctx.bad(`${rel} unit ${unit.id} event ${e.t}`, `a fixed unit’s event names ${e.by}, a cause a player role is (DATA.md §10)`)
    const tgt = e.target && units.get(e.target)
    if (tgt?.hospital && ['hit', 'torpedo-hit', 'torpedoes-fired', 'opens-fire'].includes(e.kind)) ctx.bad(`${rel} unit ${unit.id} event ${e.t}`, `${tgt.id} is a hospital ship: never a target`)
    if (unit.hospital && ['hit', 'torpedo-hit', 'near-miss'].includes(e.kind)) ctx.bad(`${rel} unit ${unit.id} event ${e.t}`, 'a hospital ship takes no hits')
  }

  // --- stops
  let lastStop = -Infinity
  for (const [i, s] of (B.stops || []).entries()) {
    const at = `${rel} stops[${i}]`
    ctx.count('stops')
    const tS = T(at, s.t)
    if (tS !== null && tS < lastStop) ctx.bad(at, 'stops run in time order')
    if (tS !== null) lastStop = tS
    if (!s.text) ctx.bad(at, 'has no text')
    text(ctx, `${at} text`, s.text, { numbers: true, people, card: s.text })
    if (s.ja) text(ctx, `${at} ja`, s.ja, { numbers: true, people, card: s.ja })
    const cam = s.camera
    if (!cam) ctx.bad(at, 'has no camera')
    else {
      if (typeof cam.target === 'string') {
        if (!thing(cam.target)) ctx.bad(`${at} camera`, `target “${cam.target}” is not a unit, group or site`)
      } else if (!isLonLat(cam.target)) ctx.bad(`${at} camera`, 'target is an id or [lon, lat]')
      for (const k of ['bearingDeg', 'pitch', 'distanceM']) if (!Number.isFinite(cam[k])) ctx.bad(`${at} camera`, `needs ${k}`)
    }
    if (s.moment && !moments.has(s.moment)) ctx.bad(at, `moment “${s.moment}” is not in moments`)
    for (const x of s.sources || []) src(at, x)
    tellings(at, s.tellings)
  }
  if (!ctx.test && (B.stops || []).length < 6) ctx.bad(`${rel} stops`, 'a battle walks in at least six stops')

  // --- moments
  if (rules.moments && (B.moments || []).length < rules.moments) ctx.bad(`${rel} moments`, `${(B.moments || []).length}; v1 has ${rules.moments} (DESIGN.md §3.4)`)
  for (const m of B.moments || []) {
    if (typeof m?.id !== 'string') continue
    ctx.count('moments')
    moment(`${rel} moment ${m.id}`, m)
  }

  // --- the box's own sources
  if (!(B.sources || []).length) ctx.bad(rel, 'cites no sources')
  for (const x of B.sources || []) src(`${rel} sources`, x)
  if ((B.sources || []).length && !(B.sources || []).some((x) => opened(ledger, x))) ctx.bad(`${rel} sources`, 'none of them was opened')
  tellings(rel, B.tellings)
  text(ctx, `${rel} note`, B.note, { numbers: true, people })

  // --- per-box rules
  if (rules.stLo) stLo()
  routesAgree(ctx, rel, B, units, clock, posAt)

  // ===========================================================================

  function edge(at, ll) {
    // an off-box group enters on the box's edge: inside the bounds and within 15 km of one edge
    const lon = wrapLon(ll[0], frozen.lon0)
    const w = wrapLon(bounds[0], frozen.lon0)
    const e = w + (bounds[2] - bounds[0])
    const kx = 111.32 * Math.cos((ll[1] * Math.PI) / 180)
    const d = Math.min((lon - w) * kx, (e - lon) * kx, (ll[1] - bounds[1]) * 110.574, (bounds[3] - ll[1]) * 110.574)
    if (d < -0.5) ctx.bad(at, `enters outside the box (${(-d).toFixed(1)} km beyond its edge)`)
    else if (d > 15) ctx.bad(at, `enters ${d.toFixed(1)} km inside the box; an off-box group enters on its edge`)
  }

  function track(at, u) {
    const fixes = u.track
    if (!Array.isArray(fixes) || fixes.length < 2) {
      ctx.bad(at, 'a track has two or more fixes (DATA.md §9)')
      return
    }
    let last = null
    for (const [i, f] of fixes.entries()) {
      const fat = `${at} track[${i}]`
      const s = T(fat, f.t)
      if (s !== null && last !== null && s <= last) ctx.bad(fat, 'fixes run forward in time')
      if (!isLonLat(f.lonlat)) ctx.bad(fat, 'needs lonlat')
      else if (!offBoxUnits.has(u.id)) holds(fat, f.lonlat, 10)
      checkVocab(ctx, fat, 'precision', f.precision, 'trackPrecision')
      if (!(Number.isFinite(f.courseDeg) && f.courseDeg >= 0 && f.courseDeg < 360)) ctx.bad(fat, 'courseDeg is 0..360')
      if (!(Number.isFinite(f.speedKn) && f.speedKn >= 0 && f.speedKn <= 40)) ctx.bad(fat, 'speedKn is 0..40')
      if (!f.source) ctx.bad(fat, 'has no source')
      else src(fat, f.source)
      checkSourceClock(ctx, fat, f, clock)
      foreignClock(fat, f, [f.source])
      text(ctx, `${fat} sourceNote`, f.sourceNote, { numbers: false, people })
      if (s !== null && last !== null && isLonLat(f.lonlat) && isLonLat(fixes[i - 1].lonlat)) {
        const km = kmBetween(fixes[i - 1].lonlat, f.lonlat)
        const kn = km / 1.852 / ((s - last) / 3600)
        const cap = Math.max(f.speedKn, fixes[i - 1].speedKn, 4) * 1.6 + 6
        if (kn > cap) ctx.warn(fat, `the leg from the fix before needs ${kn.toFixed(1)} knots against ${fixes[i - 1].speedKn}–${f.speedKn} in the fixes`)
      }
      if (s !== null) last = s
    }
    ctx.count('track fixes', fixes.length)
  }

  function station(at, u) {
    const st = u.station
    if (st.parked !== undefined) {
      if (!sites.has(st.parked)) ctx.bad(`${at} station`, `parked at “${st.parked}”, not a site`)
      if (st.lonlat && !isLonLat(st.lonlat)) ctx.bad(`${at} station`, 'lonlat is [lon, lat]')
      if (st.lonlat && sites.get(st.parked)?.lonlat && kmBetween(st.lonlat, sites.get(st.parked).lonlat) > 3) ctx.bad(`${at} station`, `is more than 3 km from ${st.parked}`)
      return
    }
    if (!units.has(st.guide)) ctx.bad(`${at} station`, `guide “${st.guide}” is not a unit`)
    if (st.guide === u.id) ctx.bad(`${at} station`, 'a unit is not its own guide')
    if (!(Number.isFinite(st.bearingDeg) && st.bearingDeg >= 0 && st.bearingDeg < 360)) ctx.bad(`${at} station`, 'bearingDeg is 0..360')
    if (!(Number.isFinite(st.rangeM) && st.rangeM >= 0)) ctx.bad(`${at} station`, 'rangeM is metres')
    if (st.precision) checkVocab(ctx, `${at} station`, 'precision', st.precision, 'trackPrecision')
    else need(`${at} station`, 'has no precision')
    if (st.source) src(`${at} station`, st.source)
    // no cycle
    const seen = new Set([u.id])
    let g = units.get(st.guide)
    while (g?.station?.guide && !g.track) {
      if (seen.has(g.id)) {
        ctx.bad(`${at} station`, `guides run in a circle through ${g.id}`)
        break
      }
      seen.add(g.id)
      g = units.get(g.station.guide)
    }
  }

  function event(at, e, owner, isSite = false) {
    ctx.count('events')
    if (!e || typeof e !== 'object') return ctx.bad(at, 'is not an object')
    checkVocab(ctx, at, 'kind', e.kind, 'battleEventKinds')
    outside(at, e.t)
    const needsBy = CAUSE_KINDS.includes(e.kind) || ctx.vocab.battleEventsWithCause.includes(e.kind)
    if (needsBy && !e.by) ctx.bad(at, `a ${e.kind} carries by (its cause: a group or unit id)`)
    if (e.by && !(units.has(e.by) || groups.has(e.by))) ctx.bad(at, `by “${e.by}” is not a unit or group`)
    if (e.by && e.by === owner.id && ['hit', 'torpedo-hit', 'near-miss'].includes(e.kind)) ctx.bad(at, 'a unit does not hit itself')
    if (['hit', 'torpedo-hit', 'near-miss'].includes(e.kind)) {
      if (!isRange(e.count)) ctx.bad(at, 'count is a range [low, high] of whole numbers')
      if (e.kind !== 'near-miss' && !isSite && !(Number.isFinite(e.damage) && e.damage >= 0 && e.damage <= 1.5)) ctx.bad(at, 'damage is the share of the target’s fatal (0..1.5)')
      if (!e.where) ctx.bad(at, 'has no where')
    }
    if (e.kind === 'torpedoes-fired') {
      if (!(Number.isInteger(e.count) && e.count > 0)) ctx.bad(at, 'count is how many torpedoes ran')
      if (!(Number.isFinite(e.speedKn) && e.speedKn > 0)) ctx.bad(at, 'speedKn is the setting they ran at')
      if (!units.has(e.target)) ctx.bad(at, `target “${e.target}” is not a unit`)
    }
    if (e.kind === 'smoke-screen') {
      if (!isLonLat(e.lonlat) || !Number.isFinite(e.lengthM) || !Number.isFinite(e.durationS)) ctx.bad(at, 'a smoke-screen carries lonlat, lengthM and durationS')
    }
    if (e.kind === 'illuminated' && e.by && !units.has(e.by)) ctx.bad(at, 'illuminated by a ship')
    if (BARE_KINDS.includes(e.kind) && (e.count !== undefined || e.damage !== undefined || e.by !== undefined)) ctx.bad(at, `a ${e.kind} carries only its time and sources: whether it happens is the damage model’s call`)
    if (e.target !== undefined && e.kind !== 'torpedoes-fired' && typeof e.target === 'string' && !thing(e.target)) ctx.bad(at, `target “${e.target}” is not a unit, group or site`)
    if (!(e.sources || []).length) ctx.bad(at, 'has no sources')
    for (const x of e.sources || []) src(at, x)
    checkSourceClock(ctx, at, e, clock)
    foreignClock(at, e, (e.sources || []).slice(0, 1))
    tellings(at, e.tellings)
    text(ctx, `${at} text`, e.text, { numbers: true, people, card: e.text })
    // a fate's line is the record's own, never the HUD's fallback ("Oglala: sinks", eventLine's WORDS)
    if (!isSite && FATE_LINE_KINDS.includes(e.kind) && !e.text && e.hud !== false) ctx.bad(at, `a ${e.kind} event has no text, so the HUD would print “${owner.name || owner.id}: ${e.kind}”; give it its line (or hud: false)`)
    text(ctx, `${at} note`, e.note, { numbers: true, people })
    text(ctx, `${at} byNote`, e.byNote, { numbers: false, people })
  }

  function fate(at, u) {
    const f = u.fate
    if (!FATE_KINDS.includes(f.kind)) ctx.bad(`${at} fate`, `kind “${f.kind}” is not one of ${FATE_KINDS.join(' | ')}`)
    if (f.t) outside(`${at} fate`, f.t)
    const want = SINKING[f.kind]
    if (want && f.t) {
      const tf = outside(`${at} fate`, f.t)
      const ev = (u.events || []).find((e) => want.includes(e.kind) && Math.abs((outside(`${at} fate`, e.t) ?? NaN) - tf) <= 60)
      if (!ev) ctx.bad(`${at} fate`, `${f.kind} at ${f.t} has no ${want.join(' or ')} event at that minute`)
    }
    for (const x of f.sources || []) src(`${at} fate`, x)
    tellings(`${at} fate`, f.tellings)
    text(ctx, `${at} fate.note`, f.note, { numbers: true, people })
  }

  function tellings(at, list) {
    if (list === undefined) return
    if (!Array.isArray(list)) return ctx.bad(at, 'tellings is a list')
    for (const [i, t] of list.entries()) {
      const tat = `${at} tellings[${i}]`
      if (!t?.source || !t?.says) ctx.bad(tat, 'needs source and says')
      else src(tat, t.source)
      text(ctx, `${tat} says`, t.says, { numbers: false, people, quote: t.quote === true })
    }
  }

  function foreignClock(at, item, cites) {
    if (item.sourceClock) return
    for (const c of cites) {
      const id = typeof c === 'string' ? c : c?.id
      const where = typeof c === 'object' ? c?.where || '' : ''
      const z = SOURCE_ZONES.find((r) => (r.id instanceof RegExp ? r.id.test(id) : r.id === id) && (!r.where || r.where.test(where)))
      if (z && z.zone !== clock.zone) ctx.bad(at, `its source ${id} keeps ${z.zone}: give sourceClock and sourceZone (R5 §10)`)
    }
  }

  function moment(at, m) {
    const r = m.role || {}
    if (!m.title) ctx.bad(at, 'has no title')
    text(ctx, `${at} title`, m.title, { numbers: true, people })
    checkVocab(ctx, `${at} role`, 'kind', r.kind, 'roleKinds')
    if (!ctx.vocab.battleSides.includes(r.side)) ctx.bad(`${at} role`, `side “${r.side}” is not one of ${ctx.vocab.battleSides.join(' | ')}`)
    for (const k of ['pilot', 'person', 'captain', 'commander']) if (r[k] !== undefined) ctx.bad(`${at} role`, `has a ${k}: the player is never a named person (R8 §5.1)`)
    if (r.name) {
      for (const n of PERSON_WORDS) if (new RegExp(`\\b${n}\\b`).test(r.name)) ctx.bad(`${at} role`, `name names a person (“${n}”): the player is never a named person`)
      text(ctx, `${at} role.name`, r.name, { numbers: true, people })
    }
    let roleKit = null
    let owner = null
    if (r.kind === 'ship') {
      owner = units.get(r.unit)
      if (!owner) ctx.bad(`${at} role`, `unit “${r.unit}” is not a unit`)
      if (r.group) ctx.bad(`${at} role`, 'a ship role names a unit, not a group')
      roleKit = owner?.kit
      if (owner && !ctx.frozen.kits.ships[owner.kit]) ctx.bad(`${at} role`, `${r.unit} is not a ship`)
    } else if (r.kind === 'aircraft') {
      owner = groups.get(r.group)
      if (!owner) ctx.bad(`${at} role`, `group “${r.group}” is not a group`)
      roleKit = owner?.kit
      if (owner?.attack?.profile === 'level' && owner.wave === 1 && boxId === 'pearl-harbor') ctx.bad(`${at} role`, `${owner.id} is among the first wave’s level bombers: never a role (DESIGN.md §3.5)`)
      if (owner && owner.namedCrews !== undefined && owner.namedCrews !== true) ctx.bad(`group ${owner.id}`, 'namedCrews is true or absent')
      // the player never flies the leader (k 0) nor a named crew's aircraft: such a moment flies a spare, which starts at the moment's start
      if (owner && (owner.namedCrews || (owner.count ?? 0) < 2) && !m.start) ctx.bad(`${at} role`, `${owner.id} has no aircraft the player may fly (its leader${owner.namedCrews ? ' and its named crews' : ''} stay on the record), so the moment flies a spare and needs a start`)
    }
    if (r.kit === undefined) ctx.warn(`${at} role`, 'names no kit')
    else if (roleKit && r.kit !== roleKit) ctx.bad(`${at} role`, `kit ${r.kit}; the ${r.kind === 'ship' ? 'unit' : 'group'} flies ${roleKit}`)
    if (owner) {
      if (owner.side !== r.side) ctx.bad(`${at} role`, `side ${r.side}; ${owner.id} is ${owner.side}`)
      if (owner.tokko) ctx.bad(`${at} role`, `${owner.id} is a tokkō unit: never a role`)
      if (owner.hospital) ctx.bad(`${at} role`, `${owner.id} is a hospital ship: never a role`)
      if (owner.fixed) ctx.bad(`${at} role`, `${owner.id} has a fixed fate: never a role`)
      for (const { unit, e } of allEvents) if (unit.fixed && e.by === owner.id) ctx.bad(`${at} role`, `${owner.id} causes ${unit.id}’s fixed fate at ${e.t}: never a role`)
    }
    // the window
    const t0 = T(`${at} t`, m.t)
    if (!(Number.isFinite(m.durationS) && m.durationS > 0)) ctx.bad(at, 'durationS is real seconds above 0')
    const scales = ctx.vocab.timeScales[r.kind] || []
    if (!scales.includes(m.timeScale)) ctx.bad(at, `timeScale ${m.timeScale}; a ${r.kind} moment runs at ${scales.join(' or ')}`)
    const ok = { gunnery: 2, torpedo: 3, helm: 3, sortie: 3, aa: 2 }
    if (r.kind === 'ship' && m.objective?.kind && ok[m.objective.kind] && ok[m.objective.kind] !== m.timeScale) ctx.warn(at, `a ${m.objective.kind} moment runs at ${ok[m.objective.kind]}× (DATA.md §9); this one at ${m.timeScale}×`)
    const maxS = r.kind === 'aircraft' ? 4 : 8
    if (m.maxTimeScale === undefined) need(at, 'has no maxTimeScale')
    else if (!(Number.isFinite(m.maxTimeScale) && m.maxTimeScale >= m.timeScale && m.maxTimeScale <= maxS)) ctx.bad(at, `maxTimeScale is from timeScale to ${maxS} for ${r.kind === 'aircraft' ? 'an aircraft' : 'a ship'}`)
    let t1 = null
    if (t0 !== null && Number.isFinite(m.durationS) && Number.isFinite(m.timeScale)) {
      t1 = t0 + m.durationS * m.timeScale
      if (t1 > clock.duration) ctx.bad(at, `its checkpoint ${clock.label(t1)} falls after the clock (${clock.label(clock.duration)})`)
      const cp = (m.checkpoints || [])[0]
      if (cp) {
        const c1 = T(`${at} checkpoints[0]`, cp.t)
        if (c1 !== null && Math.abs(c1 - t1) > 1) ctx.bad(`${at} checkpoints[0]`, `${cp.t}; t + durationS × timeScale is ${fmt(t1 + (clock.fromMs - clock.day0) / 1000)}`)
        text(ctx, `${at} checkpoints[0] text`, cp.text, { numbers: true, people })
      }
    }
    // the start
    if (r.kind === 'aircraft') {
      const s = m.start
      if (!s) ctx.bad(at, 'an aircraft moment has a start relative to a unit or site')
      else {
        const from = units.get(s.from) || sites.get(s.from)
        if (!from) ctx.bad(`${at} start`, `from “${s.from}” is not a unit or site`)
        for (const [k, lo, hi] of [['bearingDeg', 0, 360], ['rangeM', 0, 60000], ['altM', 10, 10000], ['speedMs', 30, 200], ['headingDeg', 0, 360]]) {
          if (!(Number.isFinite(s[k]) && s[k] >= lo && s[k] <= hi)) ctx.bad(`${at} start`, `${k} is ${lo}..${hi}`)
        }
        if (from && units.has(s.from) && t0 !== null && !posAt(from, t0)) ctx.bad(`${at} start`, `${s.from} has no position at ${m.t} (its track or station does not cover it)`)
      }
    } else if (r.kind === 'ship' && owner && t0 !== null) {
      if (!posAt(owner, t0)) ctx.bad(`${at} start`, `${owner.id} has no position at ${m.t}: a ship starts on its own track`)
      if (m.start && m.start.from && m.start.from !== owner.id) ctx.bad(`${at} start`, 'a ship starts on its own track')
    }
    // the objective
    const o = m.objective
    if (!o) ctx.bad(at, 'has no objective')
    else {
      if (!OBJECTIVE_KINDS.includes(o.kind)) ctx.bad(`${at} objective`, `kind “${o.kind}” is not one of ${OBJECTIVE_KINDS.join(' | ')}`)
      for (const id of [o.target ?? []].flat()) {
        if (!thing(id)) ctx.bad(`${at} objective`, `target “${id}” is not a unit, group or site`)
        const x = thing(id)
        if (x?.hospital || x?.target === false) ctx.bad(`${at} objective`, `${id} is never a target`)
        if (x?.tokko && o.kind !== 'sortie') ctx.bad(`${at} objective`, `${id} is a tokkō unit: no moment’s purpose is to shoot one down`)
      }
      if (!o.text) ctx.bad(`${at} objective`, 'has no text')
      text(ctx, `${at} objective.text`, o.text, { numbers: false, people })
      checkScoreLine(ctx, `${at} objective.text`, o.text)
      if (/\b(men|crew|lives|people)\b/i.test(o.text || '')) ctx.bad(`${at} objective.text`, 'an objective names no people: scores are in sortie terms')
    }
    // beats
    let lb = -Infinity
    for (const [i, b] of (m.beats || []).entries()) {
      const bat = `${at} beats[${i}]`
      const s = T(bat, b.t)
      if (s !== null && t0 !== null && s < t0) ctx.bad(bat, 'is before the moment begins')
      if (s !== null && s < lb) ctx.bad(bat, 'beats run in time order')
      if (s !== null) lb = s
      text(ctx, `${bat} text`, b.text, { numbers: true, people, card: b.text })
    }
    if (!(m.beats || []).length) ctx.warn(at, 'has no beats')
    // the record
    const rec = m.record
    if (!rec) ctx.bad(at, 'has no record (what the record gives the player’s unit or group)')
    else {
      for (const [i, h] of (rec.hits || []).entries()) {
        const hat = `${at} record.hits[${i}]`
        if (!thing(h.unit)) ctx.bad(hat, `unit “${h.unit}” is not a unit, group or site`)
        if (!isRange(h.count)) ctx.bad(hat, 'count is a range')
        if (!Array.isArray(h.window) || h.window.length !== 2) ctx.bad(hat, 'window is [from, to]')
        else for (const t of h.window) T(hat, t, false)
      }
      for (const k of Object.keys(rec)) if (!['hits', 'torpedoes', 'aircraft', 'returned', 'time', 'losses', 'note', 'damageTaken', 'rounds', 'claims', 'track'].includes(k)) ctx.warn(`${at} record`, `unexpected field ${k}`)
      if (rec.aircraft && !(isRange(rec.aircraft.count))) ctx.bad(`${at} record.aircraft`, 'count is a range')
      if (rec.losses && !isRange(rec.losses.count)) ctx.bad(`${at} record.losses`, 'count is a range')
      text(ctx, `${at} record.note`, rec.note, { numbers: false, people })
    }
    if (m.score) for (const k of Object.keys(m.score)) if (!ctx.vocab.scoreFields.includes(k)) ctx.bad(`${at} score`, `field ${k} is not one of ${ctx.vocab.scoreFields.join(' | ')}`)
    // the after-card: the record only, in R8's words
    const af = m.after
    if (!af) ctx.bad(at, 'has no after')
    else {
      if (!af.text) ctx.bad(`${at} after`, 'has no text')
      const card = [af.text, ...(af.tellings || []).map((t) => t.says)].join(' ')
      text(ctx, `${at} after.text`, af.text, { numbers: true, people, after: true, card })
      if (af.ja) text(ctx, `${at} after.ja`, af.ja, { numbers: true, people, after: true, card: af.ja })
      checkScoreLine(ctx, `${at} after.text`, af.text)
      for (const [re, why] of [
        [/\bkilled\b/i, 'crews “lost their lives” (R8 §3.6)'],
        [/\bshot down\b/i, 'aircraft “did not return” where the record does not know (R8 §3.6)'],
        [/\bdestroy(ed|s)?\b/i, 'a ship “sank”, “was lost”, “capsized” (R8 §3.6)'],
        [/\byou\b/i, 'the after text is the record’s, never the player’s (DATA.md §9)'],
      ])
        if (re.test(af.text || '')) ctx.bad(`${at} after.text`, `“${(af.text.match(re) || [])[0]}”: ${why}`)
      if (!(af.sources || []).length) ctx.bad(`${at} after`, 'cites no source')
      for (const x of af.sources || []) src(`${at} after`, x)
      if ((af.sources || []).length && !(af.sources || []).some((x) => opened(ledger, x))) ctx.bad(`${at} after`, 'needs at least one opened source')
      tellings(`${at} after`, af.tellings)
    }
    for (const x of m.sources || []) src(at, x)
    tellings(at, m.tellings)
  }

  function stLo() {
    const stlo = [...units.values()].find((u) => /^St\.? Lo$/.test(u.name))
    if (!stlo) return ctx.bad(`${rel} units`, 'has no St. Lo')
    const tokkoGroups = new Set([...groups.values()].filter((g) => g.tokko).map((g) => g.id))
    const hit = (stlo.events || []).find((e) => tokkoGroups.has(e.by))
    if (!hit) return ctx.bad(`${rel} unit ${stlo.id}`, 'has no hit by the Shikishima unit (the record’s beat; the box closes before it)')
    const s = outside(`${rel} unit ${stlo.id}`, hit.t)
    if (s !== null && s <= clock.duration) ctx.bad(`${rel} clock`, `ends at ${clock.label(clock.duration)}, not before the St. Lo beat at ${hit.t} (DATA.md §10)`)
    if (!tokkoGroups.size) ctx.bad(`${rel} groups`, 'the Shikishima unit is a group with tokko: true')
  }
}

// --- helpers ---------------------------------------------------------------------

function sourceRef(ctx, ledger) {
  return (at, x) => {
    const id = typeof x === 'string' ? x : x?.id
    if (!id) return ctx.bad(at, 'a source cite has no id')
    if (!ledger.has(id)) ctx.bad(at, `source “${id}” is not in sources.json`)
  }
}

function opened(ledger, x) {
  const s = ledger.get(typeof x === 'string' ? x : x?.id)
  return !!s && s.opened === true && s.read !== 'title'
}

/** Designators that carry digits and are not counts: aircraft and submarine numbers, gun calibres, turret and elevator numbers. */
const ALLOW_MORE = [/\b[A-Z]{1,4}-\d{1,3}[A-Z]?(?=s?\b)/g, /\b\d{1,3}-mm\b/g, /\bNo\.\s?\d{1,2}\b/g]

/** User-facing text: the copy rule, the voice rules, Japanese names, and (numbers) no counts. */
function text(ctx, at, s, { numbers = false, people = null, quote = false, after = false, card = null } = {}) {
  if (s === undefined || s === null) return
  if (typeof s !== 'string') return ctx.bad(at, 'is not text')
  checkCopy(ctx, at, s)
  checkVoice(ctx, at, s, { quote, after, card })
  if (people?.japanese) checkJapaneseNames(ctx, at, s, people.japanese)
  if (numbers) checkNoNumbers(ctx, at, s, { allow: ALLOW_MORE })
}

/** Every fix and point inside the frozen bounds with a margin (km); a warning, for the contract to settle. */
function boxHolder(ctx, rel, frozen) {
  const b = frozen.bounds
  return (at, ll, marginKm) => {
    if (!Array.isArray(ll)) return
    const lon = wrapLon(ll[0], frozen.lon0)
    const w = wrapLon(b[0], frozen.lon0)
    const e = w + (b[2] - b[0])
    const kx = 111.32 * Math.cos((ll[1] * Math.PI) / 180)
    const d = Math.min((lon - w) * kx, (e - lon) * kx, (ll[1] - b[1]) * 110.574, (b[3] - ll[1]) * 110.574)
    if (d < marginKm) {
      ctx.warn(at, `${d < 0 ? `${(-d).toFixed(1)} km outside` : `${d.toFixed(1)} km inside`} the frozen bounds ${JSON.stringify(b)}; DATA.md §7 asks ${marginKm} km to spare`)
      ctx.count('points outside the box margin')
    }
  }
}

/** A unit's [lon, lat] at t (seconds on the clock), from its track, its station or its parking; null where neither covers t. */
function unitPosAt(u, tS, depth, units, sites, clock, cache) {
  if (depth > 12 || !u) return null
  const key = `${u.id}@${tS}`
  if (cache.has(key)) return cache.get(key)
  let p = null
  const fixes = (u.track || []).map((f) => ({ ...f, s: safeParse(clock, f.t) })).filter((f) => f.s !== null && Array.isArray(f.lonlat))
  if (fixes.length >= 2 && tS >= fixes[0].s && tS <= fixes[fixes.length - 1].s) {
    for (let i = 0; i + 1 < fixes.length; i++) {
      const a = fixes[i]
      const b = fixes[i + 1]
      if (tS >= a.s && tS <= b.s) {
        const k = b.s === a.s ? 0 : (tS - a.s) / (b.s - a.s)
        const lb = wrapLon(b.lonlat[0], a.lonlat[0])
        p = [a.lonlat[0] + (lb - a.lonlat[0]) * k, a.lonlat[1] + (b.lonlat[1] - a.lonlat[1]) * k]
        break
      }
    }
  } else if (u.station?.parked) {
    p = u.station.lonlat || sites.get(u.station.parked)?.lonlat || null
  } else if (u.station?.guide && (!fixes.length || tS < fixes[0].s)) {
    const g = units.get(u.station.guide)
    const gp = unitPosAt(g, tS, depth + 1, units, sites, clock, cache)
    if (gp) p = offset(gp, u.station.bearingDeg || 0, u.station.rangeM || 0)
  }
  cache.set(key, p)
  return p
}

function safeParse(clock, t) {
  try {
    return clock.parse(t)
  } catch {
    return null
  }
}

/** routes.json, when it exists: a fleet route of this battle naming box units agrees with their tracks at the start (DATA.md §5). */
function routesAgree(ctx, rel, B, units, clock, posAt) {
  const routes = ctx.load('routes.json')
  if (!Array.isArray(routes)) return
  for (const r of routes) {
    if (r.event !== B.event || r.kind !== 'fleet' || !Array.isArray(r.units)) continue
    const at = `routes.json ${r.id} (against ${rel})`
    // the route's point nearest the battle's start: a waypoint whose t is within the clock, else the last point
    let pt = null
    let best = Infinity
    for (const w of r.waypoints || []) {
      if (!w.t || !Array.isArray(r.points?.[w.at])) continue
      let ms
      try {
        ms = parseIso(w.t)
      } catch {
        continue
      }
      const d = Math.abs(ms - clock.fromMs)
      if (d < best) {
        best = d
        pt = r.points[w.at]
      }
    }
    if (!pt && Array.isArray(r.points) && r.points.length) pt = r.points[r.points.length - 1]
    if (!pt) continue
    for (const id of r.units) {
      const u = units.get(id)
      if (!u) {
        ctx.bad(at, `unit “${id}” is not in ${rel}`)
        continue
      }
      const fixes = (u.track || []).filter((f) => Array.isArray(f.lonlat))
      const p = posAt(u, 0) || fixes[0]?.lonlat
      if (!p) continue
      const km = kmBetween(pt, p)
      if (km > 20) ctx.bad(at, `is ${km.toFixed(1)} km from ${id}’s track at the battle’s start (DATA.md §5 allows 20)`)
    }
  }
}

function parseIso(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?(Z|[+-]\d{2}:\d{2})$/.exec(s)
  if (!m) throw new Error('not an instant')
  const off = m[7] === 'Z' ? 0 : (m[7][0] === '-' ? -1 : 1) * (+m[7].slice(1, 3) * 60 + +m[7].slice(4, 6))
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0)) - off * 60000
}
