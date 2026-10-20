#!/usr/bin/env node
// Checks the hand-written gazetteer against the rules in DATA.md §4,
// "Routes" and "District packs".
//
//   node packages/holo-i-ke-au/tools/check-data.mjs [data-dir]
//
// Reads public/data/{eras,places,events,sources,polities,routes}.json and, when
// it exists, public/data/boundaries/moku.geojson (for its mokuKey values, and
// for the coastline the routes must keep to the sea of), and each district's
// features.json named in districts/manifest.json (or, with no manifest,
// districts/*/features.json), with boundaries/ahupuaa.geojson for the heiau rule.
// Pass another directory to check a copy (the default is public/data); a copy
// without routes.json is checked without routes.
// No dependencies. Exits 1 with a list of problems, or prints counts when clean.
// Warnings are printed but do not fail the check.

import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const DEFAULT_DATA = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'data')
const DATA = process.argv[2] ? resolve(process.argv[2]) : DEFAULT_DATA

// ---------------------------------------------------------------------------
// The moku keys. Normally read from boundaries/moku.geojson (property mokuKey,
// written by the bake). This list is the fallback when that file is absent.
// It was taken from the State GIS moku layer on the date below; each key is
// `islandId:name`, where islandId is the pack id and name is the moku's
// spelling in the SHPD-corrected ahupuaʻa layer. The layer's own verbatim
// fields are kept beside each key so every key traces to an objectid.
// Layer 3 query: https://geodata.hawaii.gov/arcgis/rest/services/HistoricCultural/MapServer/3/query?where=1%3D1&outFields=*&returnGeometry=false&f=json
const MOKU_FETCHED = '2026-10-20'
const MOKU_LAYER = [
  // [objectid, moku (verbatim), mokupuni (verbatim), key]
  [1, 'Kona', "Ni'ihau", 'niihau:Kona'],
  [2, 'Koʻolau', "Kaua'i", 'kauai:Koʻolau'],
  [3, "Halele'a", "Kaua'i", 'kauai:Haleleʻa'],
  [4, 'Nāpali', "Kaua'i", 'kauai:Nāpali'],
  [5, 'Kona', "Kaua'i", 'kauai:Kona'],
  [6, 'Puna', "Kaua'i", 'kauai:Puna'],
  [7, 'Kona', "Moloka'i", 'molokai:Kona'],
  [8, 'Koʻolau', "Moloka'i", 'molokai:Koʻolau'],
  [9, 'Koʻolauloa', "O'ahu", 'oahu:Koʻolauloa'],
  [10, 'Waialua', "O'ahu", 'oahu:Waialua'],
  [11, 'Waiʻanae', "O'ahu", 'oahu:Waiʻanae'],
  [12, "Ko'olaupoko", "O'ahu", 'oahu:Koʻolaupoko'],
  [13, 'ʻEwa', "O'ahu", 'oahu:ʻEwa'],
  [14, 'Kona', "O'ahu", 'oahu:Kona'],
  [15, 'Lāhainā', "Lana'i", 'lanai:Lāhainā'],
  [16, 'Hilo', "Hawai'i", 'hawaii:Hilo'],
  [17, 'Puna', "Hawai'i", 'hawaii:Puna'],
  [18, 'Hāmākua', "Hawai'i", 'hawaii:Hāmākua'],
  [19, 'Kohala', "Hawai'i", 'hawaii:Kohala'],
  [20, 'Kona', "Hawai'i", 'hawaii:Kona'],
  [21, 'Kaʻū', "Hawai'i", 'hawaii:Kaʻū'],
  [22, 'Honuaʻula', 'Molokini', 'maui:Honuaʻula'], // holds Maui's Honuaʻula, all of Kahoʻolawe, and Molokini
  [23, 'Kāʻanapali', 'Maui', 'maui:Kāʻanapali'],
  [24, 'Pūʻali Komohana', 'Maui', 'maui:Pūʻali Komohana'],
  [25, 'Hāmākualoa', 'Maui', 'maui:Hāmākualoa'],
  [26, 'Hāmākuapoko', 'Maui', 'maui:Hāmākuapoko'],
  [27, 'Lāhainā', 'Maui', 'maui:Lāhainā'],
  [28, 'Koʻolau', 'Maui', 'maui:Koʻolau'],
  [29, 'Kula', 'Maui', 'maui:Kula'],
  [30, 'Hāna', 'Maui', 'maui:Hāna'],
  [31, 'Kipahulu', 'Maui', 'maui:Kīpahulu'],
  [32, 'Kahikinui', 'Maui', 'maui:Kahikinui'],
  [33, 'Kaupō', 'Maui', 'maui:Kaupō'],
]

// ---------------------------------------------------------------------------
// Vocabularies (DATA.md §4)
const PLACE_KINDS = new Set(['valley', 'bay', 'beach', 'heiau', 'puuhonua', 'fishpond', 'peak', 'pali', 'town', 'ahupuaa', 'moku', 'island',
  'channel', 'sea', 'landmark', 'other', 'burial', 'shrine'])
const RESTRICTED_KINDS = new Set(['heiau', 'puuhonua', 'burial', 'shrine'])
const PLACE_PRECISION = ['exact', 'ahupuaa', 'moku', 'island', 'sea'] // finest first
const DATE_PRECISION = new Set(['day', 'month', 'year', 'decade', 'generation', 'century'])
const EVENT_KINDS = new Set(['arrival', 'battle', 'founding', 'construction', 'eruption', 'epidemic', 'law', 'treaty', 'voyage', 'death',
  'protest', 'restoration', 'other'])
const ZOOMS = new Set(['far', 'island', 'near'])
const CONFIDENCE = new Set(['firm', 'soft', 'contested'])
const ACCESS = new Set(['open', 'print', 'paywalled'])
const ISLANDS = new Set(['hawaii', 'maui', 'kahoolawe', 'lanai', 'molokai', 'oahu', 'kauai', 'niihau'])
const BOX = { south: 18.5, north: 22.5, west: -161, east: -154.5 } // the main islands, with sea around
// routes (DATA.md "Routes")
const ROUTE_KINDS = new Set(['voyage', 'fleet', 'ship', 'trade', 'schematic'])
const POINT_PRECISION = new Set(['journal', 'narrative', 'schematic'])
const DIRECTIONS = new Set(['oneway', 'return'])
const ROUTE_CONFIDENCE_KEYS = new Set(['date', 'place', 'course'])
// how far a route's end may lie from the place it names, km, by the place's precision
// (the shore of a long ahupuaʻa like Wailua lies eight km from its centroid)
const END_RADIUS = { exact: 3, ahupuaa: 10, moku: 30, island: 90, sea: 60 }
const LANDING_KM = 20 // a route may end at a landing this far from the battle its event is about
const ROUTE_END_KM = 1.5 // a route may touch land this close to either end (a landing, a harbour)
const COAST_TOLERANCE_M = 200 // and elsewhere this far inside the simplified coastline
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
// district packs (DATA.md "District packs")
const FEATURE_KINDS = new Set(['loi', 'fishpond', 'village', 'heiau', 'trail', 'stream', 'force', 'line', 'label'])
const FEATURE_PRECISION = new Set(['exact', 'mapped', 'inferred', 'schematic'])
// the sides a force moves for: DATA.md names oahu and hawaii (1795); maui is Kahekili's army of 1783
const FORCE_ROLES = new Set(['oahu', 'hawaii', 'maui'])
const LINE_ROLES = new Set(['advance', 'stand', 'retreat'])
const COARSE = new Set(['ahupuaa', 'moku', 'island']) // what a heiau may be held at
const HEIAU_CENTROID_KM = 0.3 // a heiau at ahupuaʻa precision stands at its ahupuaʻa's centroid, within this
// the box tools/lib/district-sources.mjs bakes, used only when districts/manifest.json is absent
const FALLBACK_DISTRICTS = { nuuanu: { island: 'oahu', bounds: [-157.897, 21.269, -157.779, 21.381] } }
// stop cameras: bearing in compass degrees, pitch 0..1, distance in world units (100 m) within the
// camera rig's range (src/config.js MIN_DISTANCE and MAX_DISTANCE)
const CAMERA_DISTANCE = [8, 9000]
const NEAR_CAMERA_MAX = 150 // 15 km: a near stop standing farther back than this is suspect
const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December'

const problems = []
const warnings = []
const bad = (where, msg) => problems.push(`${where}: ${msg}`)
const warn = (where, msg) => warnings.push(`${where}: ${msg}`)
const districtCounts = [] // filled by checkDistrict, printed by finish
let ahupuaaCentroids // undefined until read; null when boundaries/ahupuaa.geojson is absent

// ---------------------------------------------------------------------------
// Load
function load(name) {
  const path = join(DATA, name)
  if (!existsSync(path)) { bad(name, 'file is missing'); return null }
  try { return JSON.parse(readFileSync(path, 'utf8')) } catch (e) { bad(name, `does not parse: ${e.message}`); return null }
}
const eras = load('eras.json')
const places = load('places.json')
const events = load('events.json')
const sources = load('sources.json')
const polities = load('polities.json')
// routes.json belongs to public/data; a copy elsewhere (the synthetic test set) may go without
const routes = existsSync(join(DATA, 'routes.json')) || DATA === DEFAULT_DATA ? load('routes.json') : null
if (!routes && DATA !== DEFAULT_DATA) warn('routes.json', 'not in this directory; routes not checked')
if (problems.length) finish()
for (const [name, v] of [['eras.json', eras], ['places.json', places], ['events.json', events], ['sources.json', sources]]) {
  if (!Array.isArray(v)) bad(name, 'must be an array')
}
if (!polities || typeof polities !== 'object' || Array.isArray(polities)) bad('polities.json', 'must be an object')
if (routes && !Array.isArray(routes)) bad('routes.json', 'must be an array')
if (problems.length) finish()

let mokuKeys
let mokuFrom
let mokuGeo = null // the moku polygons, which together are the land
const mokuPath = join(DATA, 'boundaries', 'moku.geojson')
if (existsSync(mokuPath)) {
  try {
    const g = JSON.parse(readFileSync(mokuPath, 'utf8'))
    mokuGeo = g
    mokuKeys = new Set(g.features.map((f) => f.properties?.mokuKey).filter(Boolean))
    mokuFrom = `boundaries/moku.geojson (${mokuKeys.size} mokuKey values)`
    const fallback = new Set(MOKU_LAYER.map((r) => r[3]))
    const extra = [...mokuKeys].filter((k) => !fallback.has(k))
    const gone = [...fallback].filter((k) => !mokuKeys.has(k))
    if (extra.length || gone.length) warn('moku keys', `moku.geojson differs from the list fetched ${MOKU_FETCHED}: new ${extra.join(', ') || 'none'}; missing ${gone.join(', ') || 'none'}. Update MOKU_LAYER.`)
  } catch (e) { bad('boundaries/moku.geojson', `does not parse: ${e.message}`) }
}
if (!mokuKeys) {
  mokuKeys = new Set(MOKU_LAYER.map((r) => r[3]))
  mokuFrom = `the fallback list in this script (State GIS moku layer, fetched ${MOKU_FETCHED})`
}

// ---------------------------------------------------------------------------
// Helpers
function checkIds(list, file) {
  const seen = new Set()
  for (const [i, x] of list.entries()) {
    const at = `${file}[${i}]`
    if (typeof x?.id !== 'string') { bad(at, 'has no id'); continue }
    if (!ID.test(x.id)) bad(`${file} ${x.id}`, 'id is not kebab-case ASCII')
    if (seen.has(x.id)) bad(`${file} ${x.id}`, 'id is not unique')
    seen.add(x.id)
  }
  return new Map(list.filter((x) => typeof x?.id === 'string').map((x) => [x.id, x]))
}

function parseDate(s) {
  // YYYY, YYYY-MM or YYYY-MM-DD; returns { parts, start, end } in fractional years, or null
  const m = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(String(s))
  if (!m) return null
  const y = +m[1]
  const mo = m[2] ? +m[2] : null
  const d = m[3] ? +m[3] : null
  if (mo !== null && (mo < 1 || mo > 12)) return null
  if (d !== null) {
    const dim = new Date(Date.UTC(y, mo, 0)).getUTCDate()
    if (d < 1 || d > dim) return null
  }
  const start = y + (mo ? (mo - 1) / 12 : 0) + (d ? (d - 1) / 365 : 0)
  const end = d ? start + 1 / 365 : mo ? y + mo / 12 : y + 1
  return { parts: m[3] ? 3 : m[2] ? 2 : 1, start, end }
}

// Hawaiian-facing text: an ASCII or curly apostrophe standing where an ʻokina belongs
const FAKE_OKINA = /[A-Za-zāēīōūĀĒĪŌŪ]['‘’`][aeiouāēīōūAEIOUĀĒĪŌŪ]/
// (lookarounds, not \b: an ʻokina is not a word character, so \bIolani would match inside ʻIolani)
const UNMARKED = /(?<![\p{L}ʻ])(Hawaii|Oahu|Kauai|Molokai|Lanai|Niihau|Kahoolawe|Kau|Ewa|Hana|Nuuanu|Waikiki|Iolani)(?![\p{L}ʻ])/u
function checkHawaiian(at, text) {
  if (typeof text !== 'string') return
  if (FAKE_OKINA.test(text)) bad(at, `an apostrophe stands in for an ʻokina near “${text.match(FAKE_OKINA)[0]}”`)
  const u = text.match(UNMARKED)
  if (u) bad(at, `“${u[0]}” without its ʻokina or kahakō`)
}

// Numbers belong in tellings: in summaries and stops only years, decades and days of a month may appear.
const BIG_WORDS = /\b(hundreds?|thousands?|millions?|dozens?|scores of|per ?cent)\b/i
function checkNoNumbers(at, text) {
  if (typeof text !== 'string') return
  const w = text.match(BIG_WORDS)
  if (w) bad(at, `has the number word “${w[0]}”; numbers go in tellings`)
  const re = /\d[\d,.]*/g
  let m
  while ((m = re.exec(text))) {
    const tok = m[0].replace(/[.,]$/, '')
    const after = text.slice(m.index + tok.length, m.index + tok.length + 1)
    const before = text.slice(Math.max(0, m.index - 12), m.index)
    const isYear = /^\d{4}$/.test(tok) && +tok >= 900 && +tok <= 2099
    const isDecade = /^\d{4}$/.test(tok) && after === 's'
    const isDay = /^\d{1,2}$/.test(tok) && +tok >= 1 && +tok <= 31 &&
      (new RegExp(`^ (${MONTHS})\\b`).test(text.slice(m.index + tok.length)) || new RegExp(`(${MONTHS}) $`).test(before))
    const isRange = /^\d{4}$/.test(tok) && /[–-]$/.test(before) // the second year of 1848–49
    const isShortRange = /^\d{2}$/.test(tok) && /\d{4}[–-]$/.test(before)
    if (!(isYear || isDecade || isDay || isRange || isShortRange)) bad(at, `has the number “${tok}”; numbers go in tellings`)
  }
}

// ---------------------------------------------------------------------------
// sources.json
const S = checkIds(sources, 'sources.json')
for (const s of sources) {
  const at = `sources.json ${s.id}`
  if (!s.title) bad(at, 'has no title')
  if (!s.author) bad(at, 'has no author')
  if (!ACCESS.has(s.access)) bad(at, `access “${s.access}” is not open | print | paywalled`)
  if (typeof s.opened !== 'boolean') bad(at, 'opened must be true or false')
  if (s.opened === false && !s.note) bad(at, 'a source not opened must say in note what it is believed to hold')
  if (s.access === 'open' && s.opened && !s.url) bad(at, 'an open source that was read needs its url')
  if ('tertiary' in s && typeof s.tertiary !== 'boolean') bad(at, 'tertiary must be true or false')
  if (s.url && !/^https?:\/\//.test(s.url)) bad(at, 'url is not http(s)')
  if ('year' in s && !Number.isInteger(s.year)) bad(at, 'year must be an integer')
}
const sourceRef = (at, id) => { if (!S.has(id)) bad(at, `cites source “${id}”, which is not in sources.json`) }
const usedSources = new Set()
const useSource = (at, id) => { usedSources.add(id); sourceRef(at, id) }

// ---------------------------------------------------------------------------
// eras.json
const E = checkIds(eras, 'eras.json')
let lastYear = -Infinity
for (const e of eras) {
  const at = `eras.json ${e.id}`
  if (!e.label) bad(at, 'has no label')
  checkHawaiian(`${at} label`, e.label)
  if (!Number.isInteger(e.year)) bad(at, 'year must be an integer')
  if (!(Number.isInteger(e.yearPrecision) && e.yearPrecision >= 0)) bad(at, 'yearPrecision must be a whole number of years (the date has a precision)')
  if (e.year <= lastYear) bad(at, 'eras must be in order of year')
  lastYear = e.year
  if (!Array.isArray(e.sources) || !e.sources.length) bad(at, 'cites no source')
  for (const s of e.sources || []) useSource(at, s)
}

// ---------------------------------------------------------------------------
// places.json
const P = checkIds(places, 'places.json')
const sourceShowsPublicSite = (id) => {
  const s = S.get(id)
  return !!s && /national park|national historic|national register|historic site|historic landmark|state park|state monument|open to the public|open all year/i
    .test(`${s.title} ${s.author} ${s.note || ''}`)
}
for (const p of places) {
  const at = `places.json ${p.id}`
  if (!p.name) bad(at, 'has no name')
  checkHawaiian(`${at} name`, p.name)
  if (!PLACE_KINDS.has(p.kind)) bad(at, `kind “${p.kind}” is not in the vocabulary`)
  if (!PLACE_PRECISION.includes(p.placePrecision)) bad(at, `placePrecision “${p.placePrecision}” is not exact | ahupuaa | moku | island | sea`)
  if (p.island && !ISLANDS.has(p.island)) bad(at, `island “${p.island}” is not a pack id`)
  if (p.moku && p.island && p.island !== 'kahoolawe' && !mokuKeys.has(`${p.island}:${p.moku}`)) bad(at, `moku “${p.island}:${p.moku}” is not a moku key`)
  if (p.island === 'kahoolawe' && p.moku && p.moku !== 'Honuaʻula') bad(at, 'Kahoʻolawe lies in the moku Honuaʻula')
  if (!Array.isArray(p.sources) || !p.sources.length) bad(at, 'cites no source')
  for (const s of p.sources || []) useSource(at, s)
  if (p.alt && !Array.isArray(p.alt)) bad(at, 'alt must be an array')
  // geometry
  const g = p.geometry
  if (!g || !['Point', 'LineString', 'Polygon'].includes(g.type)) bad(at, 'geometry must be a Point, LineString or Polygon')
  else {
    const pts = g.type === 'Point' ? [g.coordinates] : g.type === 'LineString' ? g.coordinates : g.coordinates.flat()
    for (const c of pts) {
      if (!Array.isArray(c) || c.length < 2 || !c.every(Number.isFinite)) { bad(at, 'has a coordinate that is not [lon, lat]'); break }
      const [lon, lat] = c
      if (Math.abs(lat) > 90 || Math.abs(lon) > 180) { bad(at, `coordinate ${c} is out of range (is it [lon, lat]?)`); break }
      const inBox = lat >= BOX.south && lat <= BOX.north && lon >= BOX.west && lon <= BOX.east
      if (!inBox && p.kind !== 'sea' && p.kind !== 'channel') { bad(at, `coordinate ${c} is outside the archipelago box`); break }
    }
  }
  // sensitive sites (DATA.md §4; DESIGN.md §7.4)
  if (p.kind === 'burial') bad(at, 'burials are never placed')
  if (RESTRICTED_KINDS.has(p.kind) && p.placePrecision === 'exact') {
    if (p.landmark !== true) bad(at, `a ${p.kind} may be exact only as an established public landmark ("landmark": true)`)
    else if (!(p.sources || []).some(sourceShowsPublicSite)) bad(at, 'is a landmark but cites no source showing an established public site')
  }
  if (p.landmark === true && !(p.sources || []).some(sourceShowsPublicSite)) warn(at, 'landmark: true without a source naming a park, register or monument')
  if ('landmark' in p && typeof p.landmark !== 'boolean') bad(at, 'landmark must be true or false')
}

// ---------------------------------------------------------------------------
// events.json
const V = checkIds(events, 'events.json')
const usedPlaces = new Set()
const eraSpan = (e) => [e.year - e.yearPrecision, e.year + e.yearPrecision]
for (const ev of events) {
  const at = `events.json ${ev.id}`
  if (!ev.title) bad(at, 'has no title')
  checkHawaiian(`${at} title`, ev.title)
  checkHawaiian(`${at} gloss`, ev.gloss)
  // when
  const w = ev.when
  if (!w) bad(at, 'has no when')
  else {
    if (!DATE_PRECISION.has(w.precision)) bad(at, `date precision “${w.precision}” is not day | month | year | decade | generation | century`)
    const a = parseDate(w.from)
    const b = parseDate(w.to ?? w.from)
    if (!a) bad(at, `when.from “${w.from}” is not YYYY, YYYY-MM or YYYY-MM-DD`)
    if (!b) bad(at, `when.to “${w.to}” is not YYYY, YYYY-MM or YYYY-MM-DD`)
    if (a && b) {
      if (a.start > b.start) bad(at, `when.from ${w.from} is after when.to ${w.to}`)
      const need = w.precision === 'day' ? 3 : w.precision === 'month' ? 2 : 1
      if (a.parts < need || b.parts < need) bad(at, `a ${w.precision}-precision date needs ${need === 3 ? 'YYYY-MM-DD' : 'YYYY-MM'}`)
      if (need === 1 && (a.parts > 1 || b.parts > 1)) warn(at, `a ${w.precision}-precision date is written more finely than its precision`)
      const era = E.get(ev.era)
      if (era) {
        const [lo, hi] = eraSpan(era)
        if (b.end < lo - 1 || a.start > hi + 1) warn(at, `dates ${w.from}–${w.to} fall outside era ${era.id} (${lo}–${hi})`)
      }
    }
  }
  if (!E.has(ev.era)) bad(at, `era “${ev.era}” is not in eras.json`)
  // where
  if (!Array.isArray(ev.where) || !ev.where.length) bad(at, 'has no where')
  for (const x of ev.where || []) {
    if (!P.has(x.place)) bad(at, `where names place “${x.place}”, which is not in places.json`)
    else usedPlaces.add(x.place)
    if (!x.role) bad(at, `where ${x.place} has no role`)
  }
  // zoom, kind
  if (!Array.isArray(ev.zoom) || !ev.zoom.length || !ev.zoom.every((z) => ZOOMS.has(z))) bad(at, 'zoom must be a non-empty list of far | island | near')
  if (!EVENT_KINDS.has(ev.kind)) bad(at, `kind “${ev.kind}” is not in the vocabulary`)
  // summary and stops: Hawaiian spelling, and no numbers outside tellings
  if (!ev.summary) bad(at, 'has no summary')
  checkHawaiian(`${at} summary`, ev.summary)
  checkNoNumbers(`${at} summary`, ev.summary)
  for (const [i, s] of (ev.stops || []).entries()) {
    const sat = `${at} stop ${i + 1}`
    if (!s.text) bad(sat, 'has no text')
    checkHawaiian(sat, s.text)
    checkNoNumbers(sat, s.text)
    if (!P.has(s.place)) bad(sat, `place “${s.place}” is not in places.json`)
    else usedPlaces.add(s.place)
    if (!ZOOMS.has(s.zoom)) bad(sat, `zoom “${s.zoom}” is not far | island | near`)
    if (!Number.isInteger(s.year)) bad(sat, 'year must be an integer')
    if ('camera' in s) checkCamera(sat, s)
  }
  // sources, confidence, tellings
  if (!Array.isArray(ev.sources) || !ev.sources.length) bad(at, 'cites no source')
  for (const s of ev.sources || []) {
    if (typeof s !== 'object' || !s.id) { bad(at, 'a source entry needs an id'); continue }
    useSource(at, s.id)
    if (!s.where) warn(at, `source ${s.id} has no where`)
  }
  if (!ev.sources?.some((s) => S.get(s.id)?.opened)) bad(at, 'none of its sources has been opened')
  if (!ev.confidence || typeof ev.confidence !== 'object') bad(at, 'has no confidence')
  for (const [k, v] of Object.entries(ev.confidence || {})) {
    if (!['date', 'place', 'numbers'].includes(k)) bad(at, `confidence key “${k}” is not date | place | numbers`)
    if (!CONFIDENCE.has(v)) bad(at, `confidence ${k} “${v}” is not firm | soft | contested`)
  }
  for (const t of ev.tellings || []) {
    if (!t.source || !t.says) bad(at, 'a telling needs a source and says')
    else useSource(`${at} telling`, t.source)
  }
  if (ev.confidence?.numbers && !(ev.tellings || []).length) warn(at, 'rates its numbers but has no tellings to show them')
}
if (events.length < 40 || events.length > 60) warn('events.json', `${events.length} events; the brief asks for forty to sixty`)

// ---------------------------------------------------------------------------
// polities.json
const POL = new Map()
if (!Array.isArray(polities.polities)) bad('polities.json', 'polities must be an array')
else {
  const seen = new Set()
  for (const p of polities.polities) {
    const at = `polities.json polity ${p.id}`
    if (!ID.test(p.id || '')) bad(at, 'id is not kebab-case ASCII')
    if (seen.has(p.id)) bad(at, 'id is not unique')
    seen.add(p.id)
    if (!p.name) bad(at, 'has no name')
    checkHawaiian(`${at} name`, p.name)
    if (!/^#[0-9a-fA-F]{6}$/.test(p.colour || '')) bad(at, 'colour must be #rrggbb')
    POL.set(p.id, p)
  }
}
const byEra = polities.byEra || {}
for (const [era, map] of Object.entries(byEra)) {
  const at = `polities.json byEra ${era}`
  if (!E.has(era)) bad(at, 'is not an era in eras.json')
  for (const [key, pid] of Object.entries(map)) {
    if (!mokuKeys.has(key)) bad(at, `key “${key}” is not a moku key in ${mokuFrom}`)
    if (!POL.has(pid)) bad(at, `${key} names polity “${pid}”, which is not in polities`)
  }
  const missing = [...mokuKeys].filter((k) => !(k in map))
  if (missing.length) warn(at, `does not cover ${missing.length} moku: ${missing.slice(0, 6).join(', ')}${missing.length > 6 ? ', …' : ''}`)
}
for (const e of eras) if (!(e.id in byEra)) warn(`polities.json`, `no polity map for era ${e.id}`)
for (const [era, notes] of Object.entries(polities.notes || {})) {
  if (!E.has(era)) bad(`polities.json notes ${era}`, 'is not an era')
  for (const [key, text] of Object.entries(notes)) {
    if (key !== '_' && !mokuKeys.has(key)) bad(`polities.json notes ${era}`, `key “${key}” is not a moku key`)
    checkHawaiian(`polities.json notes ${era} ${key}`, text)
  }
}
for (const [era, ids] of Object.entries(polities.sources || {})) {
  if (!E.has(era)) bad(`polities.json sources ${era}`, 'is not an era')
  for (const s of ids) useSource(`polities.json sources ${era}`, s)
}
for (const e of eras) if (!(polities.sources || {})[e.id]?.length) bad('polities.json', `era ${e.id} has no sources for its polity map`)

// ---------------------------------------------------------------------------
// routes.json (DATA.md "Routes")
const R = routes ? checkIds(routes, 'routes.json') : new Map()
if (routes) checkRoutes()

function checkRoutes() {
  const land = mokuGeo ? landTest(mokuGeo) : null
  if (!land) warn('routes.json', 'no boundaries/moku.geojson, so whether routes keep to the sea is not checked')
  for (const r of routes) {
    const at = `routes.json ${r.id}`
    if (!r.title) bad(at, 'has no title')
    checkHawaiian(`${at} title`, r.title)
    checkHawaiian(`${at} gloss`, r.gloss)
    if (!ROUTE_KINDS.has(r.kind)) bad(at, `kind “${r.kind}” is not voyage | fleet | ship | trade | schematic`)
    if (!POINT_PRECISION.has(r.pointPrecision)) bad(at, `pointPrecision “${r.pointPrecision}” is not journal | narrative | schematic`)
    if (!DIRECTIONS.has(r.direction)) bad(at, `direction “${r.direction}” is not oneway | return`)
    if (r.kind === 'schematic' && r.pointPrecision !== 'schematic') bad(at, 'a schematic kind must have schematic points')

    // when, era, event
    const span = checkWhen(at, r.when, r.era)
    if (!E.has(r.era)) bad(at, `era “${r.era}” is not in eras.json`)
    let ev = null
    if (r.event !== null && r.event !== undefined) {
      ev = V.get(r.event)
      if (!ev) bad(at, `event “${r.event}” is not in events.json`)
    } else if (!('event' in r)) bad(at, 'event must be an event id or null')
    if (ev && span) {
      const a = parseDate(ev.when?.from)
      const b = parseDate(ev.when?.to ?? ev.when?.from)
      if (a && b && (span[1] < a.start - 1 || span[0] > b.end + 1)) warn(at, `its dates do not touch those of event ${ev.id}`)
    }

    // points
    const pts = r.points
    let ok = Array.isArray(pts) && pts.length >= 3
    if (!ok) bad(at, 'points must hold at least three [lon, lat]')
    else {
      for (const [i, c] of pts.entries()) {
        if (!Array.isArray(c) || c.length !== 2 || !c.every(Number.isFinite)) { bad(at, `point ${i} is not [lon, lat]`); ok = false; break }
        const [lon, lat] = c
        if (Math.abs(lat) > 90 || Math.abs(lon) > 180) { bad(at, `point ${i} ${c} is out of range (is it [lon, lat]?)`); ok = false; break }
        if (!(lat >= BOX.south && lat <= BOX.north && lon >= BOX.west && lon <= BOX.east)) bad(at, `point ${i} ${c} is outside the archipelago box`)
        if (i && c[0] === pts[i - 1][0] && c[1] === pts[i - 1][1]) bad(at, `point ${i} repeats the one before it`)
      }
    }
    if (ok && land) {
      for (const h of seaHits(pts, land)) bad(at, `segment ${h.seg} runs over land at ${h.p} (${h.key}, ${h.depth} m in)`)
    }

    // the ends, and the places they name
    for (const [end, idx] of [['from', 0], ['to', -1]]) {
      const id = r[end]
      if (!(end in r)) { bad(at, `${end} must be a place id or null`); continue }
      if (id !== null && !P.has(id)) { bad(at, `${end} names place “${id}”, which is not in places.json`); continue }
      if (id !== null) usedPlaces.add(id)
      if (!ok) continue
      const c = pts.at(idx)
      if (id === null) {
        if (land && land(c)) bad(at, `${end} is null (the open sea) but its end lies on land`)
        continue
      }
      const p = P.get(id)
      const pc = placePoint(p)
      const radius = END_RADIUS[p.placePrecision] ?? 3
      if (pc && kmBetween(c, pc) > radius) bad(at, `its ${end} end lies ${kmBetween(c, pc).toFixed(1)} km from ${id}, more than the ${radius} km a place at ${p.placePrecision} precision allows`)
    }
    if (ev && ok) {
      // the route has to meet its event: name one of its places at an end, pass
      // through one, or end at a landing near one (a battle fought inland)
      const evPoints = (ev.where || []).map((w) => P.get(w.place)).filter(Boolean).map((p) => [p, placePoint(p)]).filter(([, c]) => c)
      const named = [r.from, r.to].some((id) => id && (ev.where || []).some((w) => w.place === id))
      const touches = evPoints.some(([p, c]) => pts.some((q) => kmBetween(q, c) <= (END_RADIUS[p.placePrecision] ?? 3)))
      const landing = [r.from, r.to].map((id) => id && placePoint(P.get(id) || {})).filter(Boolean)
        .some((c) => evPoints.some(([, e]) => kmBetween(c, e) <= LANDING_KM))
      if (!named && !touches && !landing) bad(at, `meets none of the places of its event ${ev.id}`)
      if (Array.isArray(ev.routes) && !ev.routes.includes(r.id)) warn(at, `event ${ev.id} lists routes but not this one`)
    }

    // segments that are only a bearing, inside a journal or narrative route
    if ('schematicSegments' in r) {
      const s = r.schematicSegments
      if (!Array.isArray(s) || !s.every((i) => Number.isInteger(i) && i >= 0 && ok && i < pts.length - 1)) bad(at, 'schematicSegments must list segment indices (0 is points 0 → 1)')
      else if (new Set(s).size !== s.length) bad(at, 'schematicSegments repeats an index')
      if (r.pointPrecision === 'schematic') warn(at, 'schematicSegments on a route that is schematic throughout')
    }

    // waypoints: dated positions along the line
    const wps = r.waypoints || []
    if (!Array.isArray(wps)) bad(at, 'waypoints must be a list')
    let last = -1
    for (const w of Array.isArray(wps) && ok ? wps : []) {
      if (!Number.isInteger(w.at) || w.at < 0 || w.at >= pts.length) { bad(at, `waypoint at ${w.at} is not a point index`); continue }
      if (w.at <= last) bad(at, `waypoint at ${w.at} is out of order or repeated`)
      last = w.at
      if (w.date !== undefined) {
        const d = parseDate(w.date)
        if (!d) bad(at, `waypoint ${w.at} date “${w.date}” is not YYYY, YYYY-MM or YYYY-MM-DD`)
        else if (span && (d.start < span[0] - 1e-6 || d.end > span[1] + 1e-6)) bad(at, `waypoint ${w.at} date ${w.date} lies outside the route’s when`)
      }
      if (w.note !== undefined) {
        checkHawaiian(`${at} waypoint ${w.at}`, w.note)
        checkNoNumbers(`${at} waypoint ${w.at}`, w.note)
      }
    }
    if (r.pointPrecision === 'journal' && wps.filter((w) => w.date).length < 3) bad(at, 'a journal route needs at least three dated waypoints')

    // text
    if (!r.summary) bad(at, 'has no summary')
    checkHawaiian(`${at} summary`, r.summary)
    checkNoNumbers(`${at} summary`, r.summary)
    if (r.pointPrecision === 'schematic' && !/schematic/i.test(r.summary || '')) bad(at, 'a schematic route must say so in its summary')
    if (r.pointPrecision !== 'journal' && /\bjournal\b/i.test(r.gloss || '')) bad(at, 'only a journal route may call itself a journal track')

    // sources, confidence, tellings
    if (!Array.isArray(r.sources) || !r.sources.length) bad(at, 'cites no source')
    for (const s of r.sources || []) {
      if (typeof s !== 'object' || !s.id) { bad(at, 'a source entry needs an id'); continue }
      useSource(at, s.id)
      if (!s.where) warn(at, `source ${s.id} has no where`)
    }
    if (!r.sources?.some((s) => S.get(s.id)?.opened)) bad(at, 'none of its sources has been opened')
    if (r.pointPrecision === 'journal' && !r.sources?.some((s) => S.get(s.id)?.opened && !S.get(s.id)?.tertiary)) bad(at, 'a journal track needs an opened primary source')
    if (!r.confidence || typeof r.confidence !== 'object') bad(at, 'has no confidence')
    for (const [k, v] of Object.entries(r.confidence || {})) {
      if (!ROUTE_CONFIDENCE_KEYS.has(k)) bad(at, `confidence key “${k}” is not date | place | course`)
      if (!CONFIDENCE.has(v)) bad(at, `confidence ${k} “${v}” is not firm | soft | contested`)
    }
    if (r.pointPrecision === 'schematic' && r.confidence?.course === 'firm') bad(at, 'a schematic course cannot be firm')
    for (const t of r.tellings || []) {
      if (!t.source || !t.says) bad(at, 'a telling needs a source and says')
      else useSource(`${at} telling`, t.source)
    }
  }
}

// events may list the routes that belong to them; each must exist and point back
for (const ev of events) {
  if (!('routes' in ev)) continue
  const at = `events.json ${ev.id}`
  if (!Array.isArray(ev.routes) || !ev.routes.length) { bad(at, 'routes must be a non-empty list of route ids'); continue }
  if (!routes) continue
  for (const id of ev.routes) {
    const r = R.get(id)
    if (!r) bad(at, `lists route “${id}”, which is not in routes.json`)
    else if (r.event !== ev.id) bad(at, `lists route ${id}, whose event is ${r.event}`)
  }
}

/** A route's when, as events have it; returns its span in fractional years, or null. */
function checkWhen(at, w, era) {
  if (!w) { bad(at, 'has no when'); return null }
  if (!DATE_PRECISION.has(w.precision)) bad(at, `date precision “${w.precision}” is not day | month | year | decade | generation | century`)
  const a = parseDate(w.from)
  const b = parseDate(w.to ?? w.from)
  if (!a) bad(at, `when.from “${w.from}” is not YYYY, YYYY-MM or YYYY-MM-DD`)
  if (!b) bad(at, `when.to “${w.to}” is not YYYY, YYYY-MM or YYYY-MM-DD`)
  if (!a || !b) return null
  if (a.start > b.start) bad(at, `when.from ${w.from} is after when.to ${w.to}`)
  const need = w.precision === 'day' ? 3 : w.precision === 'month' ? 2 : 1
  if (a.parts < need || b.parts < need) bad(at, `a ${w.precision}-precision date needs ${need === 3 ? 'YYYY-MM-DD' : 'YYYY-MM'}`)
  if (need === 1 && (a.parts > 1 || b.parts > 1)) warn(at, `a ${w.precision}-precision date is written more finely than its precision`)
  const e = E.get(era)
  if (e) {
    const [lo, hi] = eraSpan(e)
    if (b.end < lo - 1 || a.start > hi + 1) warn(at, `dates ${w.from}–${w.to} fall outside era ${e.id} (${lo}–${hi})`)
  }
  return [a.start, b.end]
}

function placePoint(p) {
  const g = p.geometry
  if (!g) return null
  if (g.type === 'Point') return g.coordinates
  const pts = g.type === 'LineString' ? g.coordinates : g.coordinates.flat()
  return [pts.reduce((s, c) => s + c[0], 0) / pts.length, pts.reduce((s, c) => s + c[1], 0) / pts.length]
}

function kmBetween(a, b) {
  const kx = 111.32 * Math.cos((((a[1] + b[1]) / 2) * Math.PI) / 180)
  return Math.hypot((a[0] - b[0]) * kx, (a[1] - b[1]) * 110.574)
}

/** A land test on the moku polygons: (lon, lat) → the moku key it lies in, or null at sea. */
function landTest(fc) {
  const polys = []
  for (const f of fc.features || []) {
    const g = f.geometry
    if (!g) continue
    for (const poly of g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : []) {
      const xs = poly[0].map((c) => c[0])
      const ys = poly[0].map((c) => c[1])
      polys.push({ poly, key: f.properties?.mokuKey, box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] })
    }
  }
  const inRing = (r, x, y) => {
    let c = false
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      if ((r[i][1] > y) !== (r[j][1] > y) && x < ((r[j][0] - r[i][0]) * (y - r[i][1])) / (r[j][1] - r[i][1]) + r[i][0]) c = !c
    }
    return c
  }
  const test = ([x, y]) => {
    for (const p of polys) {
      const [x0, y0, x1, y1] = p.box
      if (x < x0 || x > x1 || y < y0 || y > y1) continue
      if (inRing(p.poly[0], x, y) && !p.poly.slice(1).some((h) => inRing(h, x, y))) return p.key || 'land'
    }
    return null
  }
  // metres to the nearest polygon edge, for the coastline's own tolerance
  test.depth = ([x, y]) => {
    let best = Infinity
    const kx = 111320 * Math.cos((y * Math.PI) / 180)
    for (const p of polys) {
      const [x0, y0, x1, y1] = p.box
      if (x < x0 - 0.05 || x > x1 + 0.05 || y < y0 - 0.05 || y > y1 + 0.05) continue
      for (const r of p.poly) {
        for (let i = 0; i + 1 < r.length; i++) {
          const ax = (r[i][0] - x) * kx
          const ay = (r[i][1] - y) * 110574
          const dx = (r[i + 1][0] - r[i][0]) * kx
          const dy = (r[i + 1][1] - r[i][1]) * 110574
          const t = Math.max(0, Math.min(1, -(ax * dx + ay * dy) / (dx * dx + dy * dy || 1)))
          best = Math.min(best, Math.hypot(ax + t * dx, ay + t * dy))
        }
      }
    }
    return best
  }
  return test
}

/** Samples every ~250 m along a route that lie on land, away from its two ends. */
function seaHits(pts, land) {
  const lens = pts.slice(1).map((c, i) => kmBetween(pts[i], c))
  const total = lens.reduce((s, l) => s + l, 0)
  const hits = []
  let along = 0
  for (let i = 0; i + 1 < pts.length; i++) {
    const n = Math.max(1, Math.ceil(lens[i] / 0.25))
    let reported = false
    for (let s = 0; s <= n && !reported; s++) {
      const d = along + (lens[i] * s) / n
      if (d < ROUTE_END_KM || d > total - ROUTE_END_KM) continue
      const c = [pts[i][0] + ((pts[i + 1][0] - pts[i][0]) * s) / n, pts[i][1] + ((pts[i + 1][1] - pts[i][1]) * s) / n]
      const key = land(c)
      if (!key) continue
      const depth = land.depth(c)
      if (depth <= COAST_TOLERANCE_M) continue
      hits.push({ seg: i, p: c.map((v) => +v.toFixed(4)).join(', '), key, depth: Math.round(depth) })
      reported = true // one report per segment is enough to find it
    }
    along += lens[i]
  }
  return hits
}

// ---------------------------------------------------------------------------
// District packs (DATA.md "District packs"): what stood in a district, and the
// battles as masses and lines
const districts = loadDistricts()
for (const d of districts) checkDistrict(d)
// a near stop whose place lies in a district should frame it with a camera
for (const ev of events) {
  for (const [i, s] of (ev.stops || []).entries()) {
    const p = P.get(s.place)
    const c = p && placePoint(p)
    if (s.zoom !== 'near' || !c || s.camera) continue
    const d = districts.find((x) => x.bounds && inBounds(c, x.bounds))
    if (d) warn(`events.json ${ev.id} stop ${i + 1}`, `a near stop in district ${d.id} has no camera`)
  }
}

function checkCamera(at, s) {
  const c = s.camera
  if (!c || typeof c !== 'object' || Array.isArray(c)) { bad(at, 'camera must be { bearing, pitch, distance }'); return }
  for (const k of Object.keys(c)) if (!['bearing', 'pitch', 'distance'].includes(k)) bad(at, `camera has an unknown key “${k}”`)
  if (!(Number.isFinite(c.bearing) && c.bearing >= 0 && c.bearing < 360)) bad(at, `camera bearing ${c.bearing} is not compass degrees from 0 to under 360`)
  if (!(Number.isFinite(c.pitch) && c.pitch >= 0 && c.pitch <= 1)) bad(at, `camera pitch ${c.pitch} is not within 0..1`)
  if (!(Number.isFinite(c.distance) && c.distance >= CAMERA_DISTANCE[0] && c.distance <= CAMERA_DISTANCE[1])) bad(at, `camera distance ${c.distance} is outside the rig's ${CAMERA_DISTANCE.join('–')} world units`)
  else if (s.zoom === 'near' && c.distance > NEAR_CAMERA_MAX) warn(at, `a near stop's camera stands ${c.distance} units (${c.distance / 10} km) back`)
}

function inBounds([lon, lat], [w, s, e, n]) { return lon >= w && lon <= e && lat >= s && lat <= n }

function loadDistricts() {
  const out = []
  const dir = join(DATA, 'districts')
  const manPath = join(dir, 'manifest.json')
  if (existsSync(manPath)) {
    let man = null
    try { man = JSON.parse(readFileSync(manPath, 'utf8')) } catch (e) { bad('districts/manifest.json', `does not parse: ${e.message}`) }
    if (man && !Array.isArray(man.districts)) bad('districts/manifest.json', 'districts must be a list')
    for (const d of man?.districts || []) {
      const at = `districts/manifest.json ${d.id}`
      const b = d.bounds
      if (!(Array.isArray(b) && b.length === 4 && b.every(Number.isFinite) && b[0] < b[2] && b[1] < b[3])) { bad(at, 'bounds must be [west, south, east, north]'); continue }
      if (!d.features) { warn(at, 'names no features file'); continue }
      out.push({ id: d.id, island: d.island, bounds: b, file: `districts/${d.features}`, from: 'districts/manifest.json' })
    }
  } else if (existsSync(dir)) {
    for (const id of readdirSync(dir)) {
      if (!existsSync(join(dir, id, 'features.json'))) continue
      const fb = FALLBACK_DISTRICTS[id]
      if (!fb) warn(`districts/${id}`, 'no manifest and no fallback box, so its coordinates are not held to a box')
      out.push({ id, island: fb?.island, bounds: fb?.bounds || null, file: `districts/${id}/features.json`, from: 'the fallback box in this script' })
    }
  }
  return out
}

/** Area-weighted centroids of the ahupuaʻa layer, keyed islandId:name (cached in ahupuaaCentroids). */
function ahupuaaCentroid(island, name) {
  if (ahupuaaCentroids === undefined) {
    ahupuaaCentroids = null
    const path = join(DATA, 'boundaries', 'ahupuaa.geojson')
    if (existsSync(path)) {
      ahupuaaCentroids = new Map()
      const g = JSON.parse(readFileSync(path, 'utf8'))
      for (const f of g.features || []) {
        const geo = f.geometry
        if (!geo || !f.properties?.name) continue
        const kx = Math.cos((21 * Math.PI) / 180)
        let A = 0, X = 0, Y = 0
        for (const poly of geo.type === 'Polygon' ? [geo.coordinates] : geo.type === 'MultiPolygon' ? geo.coordinates : []) {
          for (const r of poly) for (let i = 0; i + 1 < r.length; i++) {
            const c = r[i][0] * kx * r[i + 1][1] - r[i + 1][0] * kx * r[i][1]
            A += c; X += (r[i][0] + r[i + 1][0]) * kx * c; Y += (r[i][1] + r[i + 1][1]) * c
          }
        }
        const key = `${f.properties.islandId}:${f.properties.name}`
        const prev = ahupuaaCentroids.get(key) // a name can repeat (two Hālawa on Oʻahu): keep the larger
        if (A && (!prev || Math.abs(A) > prev.area)) ahupuaaCentroids.set(key, { area: Math.abs(A), c: [X / (3 * A) / kx, Y / (3 * A)] })
      }
    }
  }
  return ahupuaaCentroids && ahupuaaCentroids.get(`${island}:${name}`)?.c
}

function segmentsCross(a, b, c, d) {
  const o = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]))
  return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0
}

function checkRing(at, ring, outer) {
  if (!Array.isArray(ring) || ring.length < 4) { bad(at, 'a ring needs at least four positions'); return false }
  const first = ring[0], last = ring.at(-1)
  if (first[0] !== last[0] || first[1] !== last[1]) bad(at, 'a ring must close on its first position')
  let area = 0
  for (let i = 0; i + 1 < ring.length; i++) area += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]
  if (!area) bad(at, 'a ring has no area')
  else if (outer && area < 0) warn(at, 'the outer ring runs clockwise; RFC 7946 wants it counter-clockwise')
  const n = ring.length - 1
  for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) {
    if (i === 0 && j === n - 1) continue // the closing edge meets the first
    if (segmentsCross(ring[i], ring[i + 1], ring[j], ring[j + 1])) { bad(at, `the ring crosses itself between positions ${i} and ${j}`); return false }
  }
  return true
}

function checkDistrict(d) {
  const path = join(DATA, d.file)
  if (!existsSync(path)) { bad(d.file, `is named by ${d.from} but missing`); return }
  let fc
  try { fc = JSON.parse(readFileSync(path, 'utf8')) } catch (e) { bad(d.file, `does not parse: ${e.message}`); return }
  if (fc?.type !== 'FeatureCollection' || !Array.isArray(fc.features)) { bad(d.file, 'must be a GeoJSON FeatureCollection'); return }
  const seen = new Set()
  const kinds = {}
  for (const [i, f] of fc.features.entries()) {
    const at = `${d.file} ${f?.id ?? `#${i}`}`
    if (f?.type !== 'Feature' || !f.properties || typeof f.properties !== 'object') { bad(at, 'must be a Feature with properties'); continue }
    if (f.id === undefined) warn(at, 'has no id')
    else {
      if (typeof f.id !== 'string' || !ID.test(f.id)) bad(at, 'id is not kebab-case ASCII')
      if (seen.has(f.id)) bad(at, 'id is not unique')
      seen.add(f.id)
    }
    const p = f.properties
    kinds[p.kind] = (kinds[p.kind] || 0) + 1
    if (!FEATURE_KINDS.has(p.kind)) { bad(at, `kind “${p.kind}” is not loi | fishpond | village | heiau | trail | stream | force | line | label`); continue }
    if (!(p.name === null || (typeof p.name === 'string' && p.name))) bad(at, 'name must be a name or null')
    checkHawaiian(`${at} name`, p.name)
    checkHawaiian(`${at} note`, p.note)
    checkNoNumbers(`${at} name`, p.name)
    checkNoNumbers(`${at} note`, p.note)
    for (const k of ['from', 'to']) if (!(p[k] === null || Number.isInteger(p[k]))) bad(at, `${k} must be a year or null`)
    if (Number.isInteger(p.from) && Number.isInteger(p.to) && p.from > p.to) bad(at, `from ${p.from} is after to ${p.to}`)
    if (!FEATURE_PRECISION.has(p.precision)) bad(at, `precision “${p.precision}” is not exact | mapped | inferred | schematic`)
    if (!Array.isArray(p.sources) || !p.sources.length) bad(at, 'cites no source')
    for (const s of p.sources || []) useSource(at, s)
    if (Array.isArray(p.sources) && p.sources.length && !p.sources.some((s) => S.get(s)?.opened)) bad(at, 'none of its sources has been opened')
    if (p.place !== undefined) {
      if (!P.has(p.place)) bad(at, `place “${p.place}” is not in places.json`)
      else usedPlaces.add(p.place)
    }
    for (const t of p.tellings || []) {
      if (!t.source || !t.says) bad(at, 'a telling needs a source and says')
      else { useSource(`${at} telling`, t.source); checkHawaiian(`${at} telling`, t.says) }
    }
    if (p.kind === 'village' && !(p.tellings || []).length) bad(at, 'a village carries its households in a telling (none here)')

    // geometry: the type the kind wants, valid, inside the district's box
    const g = f.geometry
    const want = ['loi', 'fishpond'].includes(p.kind) ? ['Polygon'] : p.kind === 'village' ? ['Polygon', 'Point'] : ['heiau', 'label'].includes(p.kind) ? ['Point'] : ['LineString']
    if (!g || !want.includes(g.type)) { bad(at, `a ${p.kind} must be a ${want.join(' or ')}`); continue }
    const positions = g.type === 'Point' ? [g.coordinates] : g.type === 'LineString' ? g.coordinates : g.coordinates.flat()
    if (!positions.every((c) => Array.isArray(c) && c.length === 2 && c.every(Number.isFinite))) { bad(at, 'has a position that is not [lon, lat]'); continue }
    if (d.bounds) {
      const out = positions.find((c) => !inBounds(c, d.bounds))
      if (out) bad(at, `position ${out} is outside the district box ${d.bounds.join(', ')}`)
    }
    if (g.type === 'LineString') {
      if (g.coordinates.length < 2) bad(at, 'a line needs at least two positions')
      for (let k = 1; k < g.coordinates.length; k++) if (g.coordinates[k][0] === g.coordinates[k - 1][0] && g.coordinates[k][1] === g.coordinates[k - 1][1]) bad(at, `position ${k} repeats the one before it`)
    }
    if (g.type === 'Polygon') {
      if (!g.coordinates.length) bad(at, 'a polygon needs a ring')
      g.coordinates.forEach((r, k) => checkRing(`${at} ring ${k}`, r, k === 0))
    }

    // the battle as masses and lines: a side or a role, a date, an event
    if (p.kind === 'force' || p.kind === 'line') {
      if (p.kind === 'force' && !FORCE_ROLES.has(p.role)) bad(at, `a force's role “${p.role}” is not ${[...FORCE_ROLES].join(' | ')}`)
      if (p.kind === 'line' && !LINE_ROLES.has(p.role)) bad(at, `a line's role “${p.role}” is not advance | stand | retreat`)
      if (p.kind === 'line' && p.side !== undefined && !FORCE_ROLES.has(p.side)) bad(at, `side “${p.side}” is not ${[...FORCE_ROLES].join(' | ')}`)
      const w = typeof p.when === 'string' ? parseDate(p.when) : null
      if (!w || w.parts < 2) bad(at, `a ${p.kind} needs a when, an ISO month or date (YYYY-MM or YYYY-MM-DD)`)
      if (p.step !== undefined && !(Number.isInteger(p.step) && p.step >= 0)) bad(at, 'step must be a whole number (the order within its event)')
      if (p.event !== undefined) {
        const ev = V.get(p.event)
        if (!ev) bad(at, `event “${p.event}” is not in events.json`)
        else if (w) {
          const a = parseDate(ev.when?.from), b = parseDate(ev.when?.to ?? ev.when?.from)
          if (a && b && (w.end < a.start - 1 / 12 || w.start > b.end + 1 / 12)) bad(at, `when ${p.when} falls outside event ${ev.id} (${ev.when.from}–${ev.when.to})`)
        }
      } else warn(at, `a ${p.kind} names no event`)
    } else if (p.role !== undefined) bad(at, `a ${p.kind} has no role`)

    // heiau: ahupuaʻa precision unless an established public landmark (DATA.md §4, DESIGN.md §7.4)
    if (p.kind === 'heiau') {
      if (!p.placePrecision || p.placePrecision === 'exact') {
        if (p.landmark !== true) bad(at, 'a heiau may be exact only as an established public landmark ("landmark": true); otherwise give placePrecision ahupuaa or coarser')
        else if (!(p.sources || []).some(sourceShowsPublicSite)) bad(at, 'is a landmark but cites no source showing an established public site')
      } else if (!COARSE.has(p.placePrecision)) bad(at, `placePrecision “${p.placePrecision}” is not exact | ahupuaa | moku | island`)
      else if (p.placePrecision === 'ahupuaa') {
        if (!p.ahupuaa) bad(at, 'a heiau at ahupuaʻa precision must name its ahupuaa')
        else {
          const c = ahupuaaCentroid(d.island, p.ahupuaa)
          if (c === undefined && ahupuaaCentroids === null) warn(at, 'no boundaries/ahupuaa.geojson, so its point is not held to the centroid')
          else if (!c) bad(at, `ahupuaa “${p.ahupuaa}” is not in the ${d.island} ahupuaʻa layer`)
          else if (g.type === 'Point' && kmBetween(g.coordinates, c) > HEIAU_CENTROID_KM) bad(at, `stands ${kmBetween(g.coordinates, c).toFixed(2)} km from the ${p.ahupuaa} centroid; a heiau at ahupuaʻa precision is drawn there, never as a found point`)
        }
      }
    }
  }
  districtCounts.push({ id: d.id, n: fc.features.length, kinds, from: d.from })
}

// ---------------------------------------------------------------------------
// Unused entries (warnings)
for (const p of places) if (!usedPlaces.has(p.id)) warn(`places.json ${p.id}`, 'is not used by any event')
for (const s of sources) if (!usedSources.has(s.id)) warn(`sources.json ${s.id}`, 'is not cited anywhere')

finish()

function finish() {
  for (const w of warnings) console.warn(`warning  ${w}`)
  if (problems.length) {
    console.error(`\ncheck-data: ${problems.length} problem${problems.length === 1 ? '' : 's'}`)
    for (const p of problems) console.error(`  - ${p}`)
    process.exit(1)
  }
  const count = (list, f) => list.reduce((m, x) => ((m[f(x)] = (m[f(x)] || 0) + 1), m), {})
  const fmt = (o) => Object.entries(o).map(([k, v]) => `${k} ${v}`).join(', ')
  console.log('check-data: clean')
  console.log(`  eras      ${eras.length} (${eras[0].id} … ${eras.at(-1).id})`)
  console.log(`  places    ${places.length} (${fmt(count(places, (p) => p.placePrecision))}; landmarks ${places.filter((p) => p.landmark).length})`)
  console.log(`  events    ${events.length} (${fmt(count(events, (e) => e.era))})`)
  console.log(`            with tellings ${events.filter((e) => e.tellings?.length).length}, with stops ${events.filter((e) => e.stops?.length).length}`)
  console.log(`  sources   ${sources.length} (opened ${sources.filter((s) => s.opened).length}, not opened ${sources.filter((s) => !s.opened).length}, tertiary ${sources.filter((s) => s.tertiary).length}; ${fmt(count(sources, (s) => s.access))})`)
  console.log(`  polities  ${POL.size} polities over ${Object.keys(byEra).length} eras; moku keys from ${mokuFrom}`)
  if (routes) {
    console.log(`  routes    ${routes.length} (${fmt(count(routes, (r) => r.pointPrecision))}; ${fmt(count(routes, (r) => r.kind))})`)
    console.log(`            ${routes.reduce((s, r) => s + r.points.length, 0)} points, ${routes.filter((r) => r.event).length} tied to an event, ${routes.filter((r) => r.waypoints?.some((w) => w.date)).length} with dated waypoints${mokuGeo ? '; all at sea between their ends' : ''}`)
  }
  for (const d of districtCounts) console.log(`  district  ${d.id}: ${d.n} features (${fmt(d.kinds)}), box from ${d.from}`)
  const cams = events.reduce((n, e) => n + (e.stops || []).filter((s) => s.camera).length, 0)
  if (cams) console.log(`  cameras   ${cams} stops carry a camera`)
  if (warnings.length) console.log(`  warnings  ${warnings.length}`)
}
