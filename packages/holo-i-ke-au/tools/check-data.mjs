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
// districts/*/features.json), with boundaries/ahupuaa.geojson for the heiau rule
// and the district's height image for the loʻi slope rule; mahele.json (the
// class of each ahupuaʻa after the Māhele, joined to boundaries/ahupuaa.geojson
// by gisId) when it exists; and the era map of layers/manifest.json, which must
// name only eras in eras.json, with its crops entry when there is one (each
// class raster read back against its pack's height image and stats, and the
// crops' historical sources held to sources.json).
// Pass another directory to check a copy (the default is public/data); a copy
// without routes.json is checked without routes.
// No dependencies beyond the PNG reader in tools/lib. Exits 1 with a list of
// problems, or prints counts when clean.
// Warnings are printed but do not fail the check.

import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readPNG } from './lib/png.mjs'

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
// how much of a source was read: full, part (some chapters, pages, an abstract) or title (cited, not read)
const READ = new Set(['full', 'part', 'title'])
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
// how a force's people move (DATA.md "District packs"): march walks the line; run is a retreat or a pursuit;
// stand is a post; engage fights along a line; surround closes on the line's end from all sides; leap goes
// over the edge at the line's end. A line (a front) may carry one too.
const BEHAVIOURS = new Set(['march', 'run', 'stand', 'engage', 'surround', 'leap'])
// what a side carried: shares of its people that sum to one, and a whole number of cannon
const ARMS_SHARES = new Set(['spear', 'club', 'dagger', 'sling', 'musket'])
const ARMS_SUM_TOLERANCE = 0.02
// no source read records a firearm in Hawaiian hands before the trading ships of the later 1780s
const FIRST_MUSKETS = 1786
// a leap goes over an edge: its line ends this close to a place of kind pali; a surround closes on the other
// side: its line ends this close to a force or line of the other side shown at the same stop
const LEAP_EDGE_M = 300
const SURROUND_M = 300
// a stop camera may centre a point other than its place (target, [lon, lat]), within this of the place
const CAMERA_TARGET_KM = 15
// mahele.json: the classes after the Māhele, and how much of a unit a class is recorded for
const MAHELE_CLASSES = new Set(['crown', 'government', 'konohiki', 'mixed', 'unknown'])
const MAHELE_PART_CLASSES = new Set(['crown', 'government', 'konohiki'])
const MAHELE_PRECISION = new Set(['whole', 'combined', 'part', 'none'])
// a mapped stream is kept for labels and checks; the app routes the water from the heights
const STREAM_ROLES = new Set(['reference'])
// loʻi lie on the valley floor: the share of a loʻi's texels steeper than LOI_STEEP (rise over run,
// from central differences of the district heights) is aimed under LOI_STEEP_AIM and fails above LOI_STEEP_FAIL
const LOI_STEEP = 0.15
const LOI_STEEP_AIM = 0.05
const LOI_STEEP_FAIL = 0.1
// what grows in a loʻi (DATA.md "Crops, on the era layers"): a loʻi may carry crop with its own years; none is taro.
// Rice first appears at the mahele keyframe (1853), and the record has it in Koʻolaupoko's marsh by 1860.
const CROPS = new Set(['taro', 'rice'])
const FIRST_RICE = 1850
const COARSE = new Set(['ahupuaa', 'moku', 'island']) // what a heiau may be held at
const HEIAU_CENTROID_KM = 0.3 // a heiau at ahupuaʻa precision stands at its ahupuaʻa's centroid, within this
// the box tools/lib/district-sources.mjs bakes, used only when districts/manifest.json is absent
const FALLBACK_DISTRICTS = { nuuanu: { island: 'oahu', bounds: [-157.897, 21.269, -157.779, 21.381] } }
// stop cameras: bearing in compass degrees, pitch 0..1, distance in world units (100 m) within the
// camera rig's range (src/config.js MIN_DISTANCE and MAX_DISTANCE)
const CAMERA_DISTANCE = [8, 9000]
const NEAR_CAMERA_MAX = 150 // 15 km: a near stop standing farther back than this is suspect
const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December'
// The sensitive-site rule is practised, not announced (DESIGN.md §7.4): no user-facing text says what the
// app does not show, place or draw. Tellings quote their sources and are not checked.
const ANNOUNCES = /this app|does not place|not drawn|nothing is drawn|is not shown/i

const problems = []
const warnings = []
const bad = (where, msg) => problems.push(`${where}: ${msg}`)
const warn = (where, msg) => warnings.push(`${where}: ${msg}`)
const districtCounts = [] // filled by checkDistrict, printed by finish
let copyFields = 0 // user-facing texts held to the copy rule
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
// a name the files add (not a source layer's own field) carries the standard ʻokina (U+02BB) and kahakō, nothing else
const NONSTANDARD = /[ʼ‘’'`´ÄËÏÖÜäëïöü]/
// (lookarounds, not \b: an ʻokina is not a word character, so \bIolani would match inside ʻIolani)
const UNMARKED = /(?<![\p{L}ʻ])(Hawaii|Oahu|Kauai|Molokai|Lanai|Niihau|Kahoolawe|Kau|Ewa|Hana|Nuuanu|Waikiki|Iolani)(?![\p{L}ʻ])/u
function checkHawaiian(at, text) {
  if (typeof text !== 'string') return
  if (FAKE_OKINA.test(text)) bad(at, `an apostrophe stands in for an ʻokina near “${text.match(FAKE_OKINA)[0]}”`)
  const u = text.match(UNMARKED)
  if (u) bad(at, `“${u[0]}” without its ʻokina or kahakō`)
}

function checkCopy(at, text) {
  if (typeof text !== 'string') return
  copyFields++
  const m = text.match(ANNOUNCES)
  if (m) bad(at, `says what the app does not show (“${m[0]}”); the rule is practised, not announced (DESIGN.md §7.4)`)
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
  // the app cites only what was read: every source says how much of it was
  if (!READ.has(s.read)) bad(at, `read “${s.read}” is not full | part | title`)
  else if (s.opened === false && s.read !== 'title') bad(at, `a source not opened can only have read “title” (it has “${s.read}”)`)
  else if (s.opened === true && s.read === 'title') bad(at, 'a source opened and read must have read “full” or “part”')
  if (s.opened === false && !s.note) bad(at, 'a source not opened must say in note what it is believed to hold')
  if (s.opened === false && !(typeof s.wanted === 'string' && s.wanted.trim())) bad(at, 'a source not opened must say in wanted what to look for in it, for whoever opens it')
  if (s.read === 'full' && s.wanted !== undefined) bad(at, 'a source read in full has nothing left to want; drop wanted')
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
  checkCopy(`${at} label`, e.label)
  checkCopy(`${at} note`, e.note)
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
  for (const k of ['name', 'note', 'gloss']) checkCopy(`${at} ${k}`, p[k])
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
  for (const k of ['title', 'gloss', 'summary']) checkCopy(`${at} ${k}`, ev[k])
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
    checkCopy(sat, s.text)
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
// the brief asked for forty to sixty; the chapter of Kākuhihewa and Kūaliʻi took it past sixty, so the check allows seventy
if (events.length < 40 || events.length > 70) warn('events.json', `${events.length} events; the check expects forty to seventy`)

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
    checkCopy(`${at} name`, p.name)
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
    checkCopy(`polities.json notes ${era} ${key}`, text)
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
    for (const k of ['title', 'gloss', 'summary']) checkCopy(`${at} ${k}`, r[k])
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
        checkCopy(`${at} waypoint ${w.at}`, w.note)
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
  for (const k of Object.keys(c)) if (!['bearing', 'pitch', 'distance', 'target'].includes(k)) bad(at, `camera has an unknown key “${k}”`)
  if ('target' in c) {
    // the point the camera centres when it is not the stop's place (the place stays the stop's pin)
    const t = c.target
    if (!(Array.isArray(t) && t.length === 2 && t.every(Number.isFinite))) bad(at, 'camera target must be [lon, lat]')
    else if (!(t[1] >= BOX.south && t[1] <= BOX.north && t[0] >= BOX.west && t[0] <= BOX.east)) bad(at, `camera target ${t} is outside the archipelago box`)
    else {
      const p = P.get(s.place)
      const c0 = p && placePoint(p)
      if (c0 && kmBetween(t, c0) > CAMERA_TARGET_KM) bad(at, `camera target lies ${kmBetween(t, c0).toFixed(1)} km from the stop's place, more than ${CAMERA_TARGET_KM} km`)
    }
  }
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
      out.push({ id: d.id, island: d.island, bounds: b, size: d.size, metresPerTexel: d.metresPerTexel, height: d.height, file: `districts/${d.features}`, from: 'districts/manifest.json' })
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

/** A force's or line's arms: shares of spear, club, dagger, sling and musket summing to one, and whole cannon. */
function checkArms(at, a, year) {
  if (!a || typeof a !== 'object' || Array.isArray(a)) { bad(at, 'arms must be { spear, club, dagger, sling, musket, cannon }'); return }
  let sum = 0
  for (const [k, v] of Object.entries(a)) {
    if (k === 'cannon') { if (!(Number.isInteger(v) && v >= 0)) bad(at, `arms cannon ${v} is not a whole number`); continue }
    if (!ARMS_SHARES.has(k)) { bad(at, `arms has an unknown key “${k}” (shares are ${[...ARMS_SHARES].join(', ')}; cannon is a count)`); continue }
    if (!(Number.isFinite(v) && v >= 0 && v <= 1)) { bad(at, `arms ${k} ${v} is not a share from 0 to 1`); continue }
    sum += v
  }
  if (Math.abs(sum - 1) > ARMS_SUM_TOLERANCE) bad(at, `arms shares sum to ${+sum.toFixed(3)}, not one`)
  if (!('cannon' in a)) bad(at, 'arms needs a cannon count (0 for none)')
  if (Number.isInteger(year) && year < FIRST_MUSKETS && ((a.musket || 0) > 0 || (a.cannon || 0) > 0)) warn(at, `carries firearms in ${year}; no source read records them in Hawaiian hands before ${FIRST_MUSKETS}`)
}

function checkDistrict(d) {
  const path = join(DATA, d.file)
  if (!existsSync(path)) { bad(d.file, `is named by ${d.from} but missing`); return }
  let fc
  try { fc = JSON.parse(readFileSync(path, 'utf8')) } catch (e) { bad(d.file, `does not parse: ${e.message}`); return }
  if (fc?.type !== 'FeatureCollection' || !Array.isArray(fc.features)) { bad(d.file, 'must be a GeoJSON FeatureCollection'); return }
  const seen = new Set()
  const kinds = {}
  const steps = {} // event id → [{ at, step, stop }], for the order of steps against stops
  const edgeMoves = [] // forces that leap or surround: where their lines end
  const shownLines = [] // every force and line, for what a surround closes on
  const lois = [] // [at, polygon], for the slope rule
  const outlines = {} // a loʻi's rings as JSON → [{ at, a, b }], its years, for the one-loʻi-a-year rule
  const crops = {} // loʻi by crop, where a crop is given
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
    checkCopy(`${at} name`, p.name)
    checkCopy(`${at} note`, p.note)
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
    // a loʻi's crop: taro or rice, only on a loʻi; rice is dated
    if (p.crop !== undefined) {
      if (p.kind !== 'loi') bad(at, `crop is for a loi only (this is a ${p.kind})`)
      else if (!CROPS.has(p.crop)) bad(at, `crop “${p.crop}” is not ${[...CROPS].join(' | ')}`)
      else crops[p.crop] = (crops[p.crop] || 0) + 1
      if (p.kind === 'loi' && p.crop === 'rice') {
        if (!Number.isInteger(p.from)) bad(at, 'a loʻi in rice needs a from year: when a source read first shows the rice')
        else if (p.from < FIRST_RICE) warn(at, `rice from ${p.from}, before the ${FIRST_RICE}s, when the record first has it`)
      }
    }

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
      if (p.kind === 'loi') {
        lois.push([at, g.coordinates])
        // a second loʻi on the same outline (rice after taro) takes years of its own: the ground holds one loʻi a texel
        const key = JSON.stringify(g.coordinates)
        const [a, b] = [Number.isInteger(p.from) ? p.from : -Infinity, Number.isInteger(p.to) ? p.to : Infinity]
        for (const o of (outlines[key] ||= [])) {
          if (a <= o.b && o.a <= b) bad(at, `shares its outline with ${o.at.split(' ').at(-1)} and their years overlap; a crop on one outline takes years of its own`)
        }
        outlines[key].push({ at, a, b })
      }
    }

    // the battle as masses and lines: a side or a role, a date, an event
    if (p.kind === 'force' || p.kind === 'line') {
      if (p.kind === 'force' && !FORCE_ROLES.has(p.role)) bad(at, `a force's role “${p.role}” is not ${[...FORCE_ROLES].join(' | ')}`)
      if (p.kind === 'line' && !LINE_ROLES.has(p.role)) bad(at, `a line's role “${p.role}” is not advance | stand | retreat`)
      if (p.kind === 'line' && p.side !== undefined && !FORCE_ROLES.has(p.side)) bad(at, `side “${p.side}” is not ${[...FORCE_ROLES].join(' | ')}`)
      const w = typeof p.when === 'string' ? parseDate(p.when) : null
      if (!w || w.parts < 2) bad(at, `a ${p.kind} needs a when, an ISO month or date (YYYY-MM or YYYY-MM-DD)`)
      // how its people move, and what they carry (DATA.md "District packs"): required on a force, checked on a line
      if (p.behaviour === undefined) { if (p.kind === 'force') bad(at, `a force needs a behaviour: ${[...BEHAVIOURS].join(' | ')}`) }
      else if (!BEHAVIOURS.has(p.behaviour)) bad(at, `behaviour “${p.behaviour}” is not ${[...BEHAVIOURS].join(' | ')}`)
      if (p.arms === undefined) { if (p.kind === 'force') bad(at, 'a force needs arms: the shares of what its people carried, and its cannon') }
      else checkArms(at, p.arms, Number.isInteger(p.from) ? p.from : w ? Math.floor(w.start) : null)
      if (g.type === 'LineString' && (p.behaviour === 'leap' || p.behaviour === 'surround')) edgeMoves.push({ at, p, end: g.coordinates.at(-1) })
      if (g.type === 'LineString') shownLines.push({ at, p, coords: g.coordinates })
      if (p.step !== undefined && !(Number.isInteger(p.step) && p.step >= 0)) bad(at, 'step must be a whole number (the order within its event)')
      // the stop of its event at which it shows: an index from 0 into the event's stops
      const hasStop = Number.isInteger(p.stop) && p.stop >= 0
      if (!hasStop) bad(at, `a ${p.kind} needs a stop: the index, from 0, of the stop of its event at which it shows`)
      if (p.event !== undefined) {
        const ev = V.get(p.event)
        if (!ev) bad(at, `event “${p.event}” is not in events.json`)
        else {
          if (w) {
            const a = parseDate(ev.when?.from), b = parseDate(ev.when?.to ?? ev.when?.from)
            if (a && b && (w.end < a.start - 1 / 12 || w.start > b.end + 1 / 12)) bad(at, `when ${p.when} falls outside event ${ev.id} (${ev.when.from}–${ev.when.to})`)
          }
          const stops = ev.stops || []
          if (hasStop && p.stop >= stops.length) bad(at, `stop index ${p.stop} is not a stop of event ${ev.id}, whose stops are indexed 0 to ${stops.length - 1}`)
          else if (hasStop) {
            const y = stops[p.stop].year
            if (Number.isInteger(y) && ((Number.isInteger(p.from) && y < p.from) || (Number.isInteger(p.to) && y > p.to))) bad(at, `shows at stop index ${p.stop} of ${ev.id} (${y}), outside its years ${p.from}–${p.to}`)
            if (Number.isInteger(p.step)) (steps[ev.id] ||= []).push({ at, step: p.step, stop: p.stop })
          }
        }
      } else warn(at, `a ${p.kind} names no event`)
    } else if (p.kind === 'stream') {
      // the app routes water from the heights; a mapped course is kept for its label and for checks
      if (!STREAM_ROLES.has(p.role)) bad(at, `a stream's role “${p.role}” is not ${[...STREAM_ROLES].join(' | ')}`)
      if (!p.name) bad(at, 'a stream needs its name, for its label')
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
  // a leap goes over an edge: its line ends at a place of kind pali
  const edges = places.filter((q) => q.kind === 'pali').map((q) => [q, placePoint(q)]).filter(([, c]) => c)
  const stopsOf = (p) => (Array.isArray(p.stop) ? p.stop : [p.stop])
  for (const m of edgeMoves) {
    if (m.p.behaviour === 'leap') {
      const near = edges.map(([q, c]) => [q, kmBetween(m.end, c) * 1000]).sort((a, b) => a[1] - b[1])[0]
      if (!near) bad(m.at, 'a leap goes over an edge, but no place of kind pali is in the gazetteer')
      else if (near[1] > LEAP_EDGE_M) bad(m.at, `a leap goes over the edge at its line's end, which lies ${Math.round(near[1])} m from ${near[0].id}, more than ${LEAP_EDGE_M} m`)
    } else {
      // a surround closes on the other side: a force or line of another side shown at the same stop, near its end
      const mine = m.p.role
      const others = shownLines.filter((o) => o.p.event === m.p.event && (o.p.kind === 'force' ? o.p.role : o.p.side) !== mine && stopsOf(o.p).some((k) => stopsOf(m.p).includes(k)))
      const d = Math.min(Infinity, ...others.flatMap((o) => o.coords.map((c) => kmBetween(m.end, c) * 1000)))
      if (!(d <= SURROUND_M)) bad(m.at, `a surround closes on the other side, but nothing of another side shown at its stop lies within ${SURROUND_M} m of its line's end${Number.isFinite(d) ? ` (the nearest is ${Math.round(d)} m)` : ''}`)
    }
  }
  // a later step never shows at an earlier stop
  for (const list of Object.values(steps)) {
    for (const a of list) for (const b of list) {
      if (a.step < b.step && a.stop > b.stop) bad(b.at, `step ${b.step} shows at stop index ${b.stop}, before ${a.at.split(' ').at(-1)} (step ${a.step}) at stop index ${a.stop}`)
    }
  }
  const steep = lois.length ? checkLoiSlopes(d, lois) : null
  const moves = {}
  for (const f of fc.features) if (f?.properties?.behaviour) moves[f.properties.behaviour] = (moves[f.properties.behaviour] || 0) + 1
  const armed = fc.features.filter((f) => f?.properties?.arms).length
  const cannon = fc.features.reduce((n, f) => n + (f?.properties?.arms?.cannon || 0), 0)
  districtCounts.push({ id: d.id, n: fc.features.length, kinds, from: d.from, steep, moves, armed, cannon, crops })
}

/**
 * Loʻi lie on the valley floor: for each loʻi polygon, the share of the district texels whose centres
 * fall inside it (even-odd over its rings) that are steeper than LOI_STEEP, the slope as rise over run
 * from central differences of the neighbouring texels' heights (edges clamped). Returns the worst share.
 */
function checkLoiSlopes(d, lois) {
  const where = `districts/${d.height?.file}`
  if (!d.height?.file || !Array.isArray(d.size)) { warn(d.file, 'no height image named in districts/manifest.json, so the loʻi are not held to the valley floor'); return null }
  const path = join(DATA, 'districts', d.height.file)
  if (!existsSync(path)) { warn(where, 'is missing, so the loʻi are not held to the valley floor'); return null }
  let img
  try { img = readPNG(path) } catch (e) { bad(where, `does not decode: ${e.message}`); return null }
  const [W, H] = d.size
  if (img.width !== W || img.height !== H || img.channels !== 3) { bad(where, `is ${img.width}x${img.height} with ${img.channels} channels; the manifest says ${W}x${H}, split-byte RGB`); return null }
  const scale = d.height.scale ?? 0.25
  const offset = d.height.offset ?? -6000
  const [west, south, east, north] = d.bounds
  const dLon = (east - west) / W
  const dLat = (north - south) / H
  // metres per texel in the shared projection (DATA.md §1), as the manifest gives them
  const [mx, mz] = Array.isArray(d.metresPerTexel) ? d.metresPerTexel : [dLon * Math.cos((20.5 * Math.PI) / 180) * 111320, dLat * 110574]
  const h = (i, j) => {
    const o = (Math.max(0, Math.min(H - 1, j)) * W + Math.max(0, Math.min(W - 1, i))) * 3
    return (img.data[o] * 256 + img.data[o + 1]) * scale + offset
  }
  const slope = (i, j) => Math.hypot((h(i + 1, j) - h(i - 1, j)) / (2 * mx), (h(i, j + 1) - h(i, j - 1)) / (2 * mz))
  let worst = { share: 0, at: null }
  for (const [at, rings] of lois) {
    let n = 0
    let steep = 0
    let y0 = Infinity
    let y1 = -Infinity
    for (const r of rings) for (const c of r) { y0 = Math.min(y0, c[1]); y1 = Math.max(y1, c[1]) }
    for (let j = Math.max(0, Math.floor((north - y1) / dLat)); j <= Math.min(H - 1, Math.floor((north - y0) / dLat)); j++) {
      const lat = north - (j + 0.5) * dLat
      const xs = []
      for (const r of rings) {
        for (let a = 0, b = r.length - 1; a < r.length; b = a++) {
          if ((r[a][1] > lat) !== (r[b][1] > lat)) xs.push(((r[b][0] - r[a][0]) * (lat - r[a][1])) / (r[b][1] - r[a][1]) + r[a][0])
        }
      }
      xs.sort((p, q) => p - q)
      for (let k = 0; k + 1 < xs.length; k += 2) {
        const iA = Math.max(0, Math.ceil((xs[k] - west) / dLon - 0.5))
        const iB = Math.min(W - 1, Math.ceil((xs[k + 1] - west) / dLon - 0.5) - 1)
        for (let i = iA; i <= iB; i++) {
          n++
          if (slope(i, j) > LOI_STEEP) steep++
        }
      }
    }
    if (!n) { bad(at, 'covers no texel of the district'); continue }
    const share = steep / n
    const pc = (v) => `${(100 * v).toFixed(1)}%`
    if (share > LOI_STEEP_FAIL) bad(at, `${pc(share)} of its texels are steeper than ${LOI_STEEP * 100}%: loʻi lie on the valley floor (aim under ${pc(LOI_STEEP_AIM)}, fail over ${pc(LOI_STEEP_FAIL)})`)
    else if (share > LOI_STEEP_AIM) warn(at, `${pc(share)} of its texels are steeper than ${LOI_STEEP * 100}% (aim under ${pc(LOI_STEEP_AIM)})`)
    if (share >= worst.share) worst = { share, at }
  }
  return worst
}

// ---------------------------------------------------------------------------
// boundaries/*.geojson: the fields the bake adds carry the standard spelling (DATA.md §3)
for (const key of ['moku', 'ahupuaa']) {
  const path = join(DATA, 'boundaries', `${key}.geojson`)
  if (!existsSync(path)) continue
  let g
  try { g = JSON.parse(readFileSync(path, 'utf8')) } catch (e) { bad(`boundaries/${key}.geojson`, `does not parse: ${e.message}`); continue }
  for (const f of g.features || []) {
    const p = f.properties || {}
    for (const k of ['name', 'island', 'mokuKey']) {
      if (typeof p[k] === 'string' && NONSTANDARD.test(p[k])) bad(`boundaries/${key}.geojson gisId ${p.gisId} ${k}`, `“${p[k]}” is not the standard spelling (ʻokina U+02BB, kahakō as a macron)`)
    }
  }
}

// mahele.json: the class of each ahupuaʻa after the Māhele (RESEARCH.md §12 gives the schema)
let maheleCounts = null
if (existsSync(join(DATA, 'mahele.json'))) checkMahele()

function checkMahele() {
  const m = load('mahele.json')
  if (!m) return
  const list = m.ahupuaa
  if (!Array.isArray(list)) { bad('mahele.json', 'ahupuaa must be a list'); return }
  for (const id of m.sources || []) useSource('mahele.json sources', id)
  const bpath = join(DATA, 'boundaries', 'ahupuaa.geojson')
  let units = null
  if (existsSync(bpath)) {
    try { units = new Map(JSON.parse(readFileSync(bpath, 'utf8')).features.map((f) => [f.properties?.gisId, f.properties])) } catch (e) { bad('boundaries/ahupuaa.geojson', `does not parse: ${e.message}`) }
  } else warn('mahele.json', 'no boundaries/ahupuaa.geojson, so its gisIds are not checked')
  const seen = new Set()
  const counts = {}
  for (const [i, e] of list.entries()) {
    const at = `mahele.json ${e?.gisId ?? `#${i}`}`
    if (!Number.isInteger(e?.gisId)) { bad(at, 'gisId must be a whole number'); continue }
    if (seen.has(e.gisId)) bad(at, 'gisId appears twice')
    seen.add(e.gisId)
    if (units) {
      const u = units.get(e.gisId)
      if (!u) bad(at, 'gisId is not in boundaries/ahupuaa.geojson')
      else {
        if ((u.name ?? null) !== (e.name ?? null)) bad(at, `name “${e.name}” is not the boundary file's “${u.name}”`)
        if (u.islandId !== e.islandId) bad(at, `islandId “${e.islandId}” is not the boundary file's “${u.islandId}”`)
      }
    }
    if (!MAHELE_CLASSES.has(e.class)) { bad(at, `class “${e.class}” is not ${[...MAHELE_CLASSES].join(' | ')}`); continue }
    counts[e.class] = (counts[e.class] || 0) + 1
    if (!MAHELE_PRECISION.has(e.precision)) bad(at, `precision “${e.precision}” is not ${[...MAHELE_PRECISION].join(' | ')}`)
    if (e.class === 'unknown' && !['none', 'part'].includes(e.precision)) bad(at, 'an unknown class has precision none (or part, where only some of its ʻili are recorded)')
    if (e.class !== 'unknown' && e.precision === 'none') bad(at, 'a recorded class needs a precision other than none')
    if (e.awardee !== undefined) {
      if (!['konohiki', 'mixed'].includes(e.class)) bad(at, `an awardee belongs to a konohiki or mixed land, not ${e.class}`)
      const names = Array.isArray(e.awardee) ? e.awardee : [e.awardee]
      if (!names.length || !names.every((n) => typeof n === 'string' && n.trim())) bad(at, 'awardee must be a name or a list of names')
    }
    for (const x of e.parts || []) {
      if (!MAHELE_PART_CLASSES.has(x.class)) bad(at, `a part's class “${x.class}” is not ${[...MAHELE_PART_CLASSES].join(' | ')}`)
      if (!(x.share === null || (Number.isFinite(x.share) && x.share >= 0 && x.share <= 1))) bad(at, `a part's share ${x.share} is not null or 0..1`)
      if ('ili' in x && !(Number.isInteger(x.ili) && x.ili > 0)) bad(at, `a part's ili ${x.ili} is not a whole number`)
    }
    if (e.class === 'mixed' && new Set((e.parts || []).map((x) => x.class)).size < 2) bad(at, 'a mixed land lists the classes recorded within it in parts (two or more)')
    for (const l of e.later || []) {
      if (!['crown', 'government'].includes(l.class)) bad(at, `a later class “${l.class}” is not crown | government`)
      if (!(Number.isInteger(l.year) && l.year > 1848)) bad(at, `a later class needs a year after 1848 (has ${l.year})`)
    }
    for (const d of e.disputed || []) {
      if (!MAHELE_PART_CLASSES.has(d.class)) bad(at, `a disputed class “${d.class}” is not ${[...MAHELE_PART_CLASSES].join(' | ')}`)
      useSource(`${at} disputed`, d.source)
    }
    if (e.class !== 'unknown' && !(e.sources || []).length) bad(at, 'a recorded class cites no source')
    for (const id of e.sources || []) useSource(at, id)
    if ((e.sources || []).length && !e.sources.some((id) => S.get(id)?.opened)) bad(at, 'none of its sources has been opened')
  }
  if (units) {
    const missing = [...units.keys()].filter((g) => !seen.has(g))
    if (missing.length) bad('mahele.json', `has no entry for ${missing.length} ahupuaʻa of the boundary file (gisId ${missing.slice(0, 8).join(', ')}${missing.length > 8 ? ', …' : ''}); an unrecorded one is class unknown`)
  }
  maheleCounts = { n: list.length, counts }
}

// ---------------------------------------------------------------------------
// layers/manifest.json: its era map is keyed by era id, so an era that goes leaves a dangling key
let layerEras = null
let cropCounts = null
if (existsSync(join(DATA, 'layers', 'manifest.json'))) {
  const lm = load('layers/manifest.json')
  if (lm && lm.eras && typeof lm.eras === 'object') {
    layerEras = Object.keys(lm.eras).length
    for (const [id, x] of Object.entries(lm.eras)) {
      if (!E.has(id)) bad(`layers/manifest.json eras ${id}`, 'is not an era in eras.json')
      else if (x.year !== E.get(id).year) warn(`layers/manifest.json eras ${id}`, `year ${x.year} differs from eras.json (${E.get(id).year}); tools/bake-layers.mjs writes the map on its next run`)
    }
    for (const e of eras) if (!(e.id in lm.eras)) bad('layers/manifest.json', `has no era map for ${e.id}`)
  }
  if (lm?.crops) checkCrops(lm)
}

// layers/manifest.json crops (DATA.md "Crops, on the era layers"): a class raster per
// island pack and keyframe, registered on the pack, classes 0–8, stats as the image holds
function checkCrops(lm) {
  const at = 'layers/manifest.json crops'
  const K = lm.crops
  const N_CROP = 8
  const packs = (load('manifest.json')?.packs || []).filter((p) => p.kind === 'island')
  const keyframes = (lm.keyframes || []).map((k) => k.id)
  if (JSON.stringify(K.keyframes) !== JSON.stringify(keyframes)) bad(at, `keyframes ${JSON.stringify(K.keyframes)} are not the layers' ${JSON.stringify(keyframes)}`)
  if (JSON.stringify(Object.keys(K.encoding?.classes || {})) !== JSON.stringify([...Array(N_CROP + 1).keys()].map(String))) bad(at, 'encoding.classes is not the classes 0–8')
  for (const e of eras) if (!keyframes.includes(K.eras?.[e.id]?.keyframe)) bad(at, `era ${e.id} takes no keyframe`)
  for (const id of Object.keys(K.eras || {})) if (!E.has(id)) bad(`${at} eras ${id}`, 'is not an era in eras.json')
  for (const k of keyframes) {
    const m = K.methods?.[k]
    if (!m) { bad(at, `no method for ${k}`); continue }
    if (!['mapped', 'modelled', 'mixed'].includes(m.method)) bad(`${at} methods.${k}`, `method “${m.method}”`)
    if (m.method !== 'mapped' && !(typeof m.rule === 'string' && m.rule.length > 80)) bad(`${at} methods.${k}`, `${m.method} but no rule written out`)
    if (!m.sources?.length) bad(`${at} methods.${k}`, 'no sources')
    for (const id of m.sources || []) if (!K.sources?.[id]) bad(`${at} methods.${k}`, `source ${id} is not among the crops' sources`)
  }
  for (const [id, s] of Object.entries(K.sources || {})) {
    if (!s.title || !s.licence || (!s.url && !(s.sourcesJson && s.opened === false))) bad(`${at} sources ${id}`, 'lacks title, url or licence (only a source not opened may lack its url)')
    if (s.sourcesJson) useSource(`${at} sources`, id)
    if (s.sourcesJson && S.has(id) && S.get(id).opened !== s.opened) bad(`${at} sources ${id}`, 'opened differs from sources.json')
    if (!id.startsWith('holo-') && !(s.sourcesJson && s.opened === false) && !/^\d{4}-\d{2}-\d{2}$/.test(s.fetched || '')) bad(`${at} sources ${id}`, 'a source read or fetched needs its date (fetched)')
  }
  const counts = {}
  for (const pack of packs) {
    const e = K.islands?.[pack.id]
    if (!e) { bad(at, `no entry for the ${pack.id} pack (absent packs are recorded with absent and a reason)`); continue }
    if (e.absent && typeof e.absent === 'string') continue
    if (JSON.stringify(e.size) !== JSON.stringify(pack.size) || JSON.stringify(e.bounds) !== JSON.stringify(pack.bounds)) bad(`${at} ${pack.id}`, 'size or bounds differ from the pack')
    let h
    try { h = readPNG(join(DATA, pack.height.file)) } catch (err) { bad(`${at} ${pack.id}`, `cannot read the pack's height image (${err.message})`); continue }
    const [W, H] = pack.size
    const texelKm2 = (pack.metresPerTexel[0] * pack.metresPerTexel[1]) / 1e6
    for (const k of keyframes) {
      const L = e.layers?.[k]
      if (!L) { if (!e.absent?.[k]) bad(`${at} ${pack.id}`, `no ${k} raster and no absence recorded`); continue }
      const where = `layers/${L.file}`
      if (L.file !== `${pack.id}/${k}-crop.png`) bad(where, `is not named ${pack.id}/${k}-crop.png`)
      if (L.method !== K.methods?.[k]?.method) bad(where, `method differs from methods.${k}`)
      let img
      try { img = readPNG(join(DATA, 'layers', L.file)) } catch (err) { bad(where, err.message); continue }
      if (img.channels !== 1) bad(where, 'is not greyscale')
      if (img.width !== W || img.height !== H) { bad(where, `is ${img.width}x${img.height}, the pack ${W}x${H}`); continue }
      const n = new Array(N_CROP + 1).fill(0)
      let land = 0
      let over = 0
      let sea = 0
      for (let o = 0; o < W * H; o++) {
        const c = img.data[o]
        if (c > N_CROP) { over++; continue }
        if ((h.data[o * 3] * 256 + h.data[o * 3 + 1]) * pack.height.scale + pack.height.offset > 0) { land++; n[c]++ } else if (c) sea++
      }
      if (over) bad(where, `${over} texels outside the classes 0–${N_CROP}`)
      if (sea) bad(where, `${sea} texels with a class over sea`)
      const texels = {}
      const km2 = {}
      for (let c = 1; c <= N_CROP; c++) if (n[c]) { texels[c] = n[c]; km2[c] = Math.round(n[c] * texelKm2 * 100) / 100 }
      const st = { landTexels: land, classedTexels: land - n[0], texels, km2 }
      if (JSON.stringify(st) !== JSON.stringify(L.stats)) bad(where, 'stats differ from what the image holds')
      counts[k] = (counts[k] || 0) + 1
    }
  }
  cropCounts = { rasters: Object.values(counts).reduce((a, b) => a + b, 0), keyframes: Object.keys(counts).length, sources: Object.keys(K.sources || {}).length }
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
  for (const d of districtCounts) {
    console.log(`  district  ${d.id}: ${d.n} features (${fmt(d.kinds)}), box from ${d.from}`)
    if (Object.keys(d.moves || {}).length) console.log(`            behaviour ${fmt(d.moves)}; arms on ${d.armed}, ${d.cannon} cannon in all`)
    if (Object.keys(d.crops || {}).length) console.log(`            loʻi with a crop: ${fmt(d.crops)}`)
    if (d.steep?.at) console.log(`            loʻi on the floor: at most ${(100 * d.steep.share).toFixed(1)}% of a loʻi's texels steeper than ${LOI_STEEP * 100}% (${d.steep.at.split(' ').at(-1)})`)
  }
  const cams = events.reduce((n, e) => n + (e.stops || []).filter((s) => s.camera).length, 0)
  if (cams) console.log(`  cameras   ${cams} stops carry a camera`)
  console.log(`  copy      ${copyFields} user-facing texts, none saying what the app does not show`)
  console.log(`  sources   read ${fmt(count(sources, (s) => s.read))}`)
  if (maheleCounts) console.log(`  mahele    ${maheleCounts.n} ahupuaʻa (${fmt(maheleCounts.counts)})`)
  if (layerEras !== null) console.log(`  layers    era map for ${layerEras} eras, all in eras.json`)
  if (cropCounts) console.log(`  crops     ${cropCounts.rasters} class rasters over ${cropCounts.keyframes} keyframes, registered on their packs, stats as the images hold; ${cropCounts.sources} sources`)
  if (warnings.length) console.log(`  warnings  ${warnings.length}`)
}
