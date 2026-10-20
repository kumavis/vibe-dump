#!/usr/bin/env node
// Checks the hand-written gazetteer against the rules in DATA.md §4.
//
//   node packages/holo-i-ke-au/tools/check-data.mjs [data-dir]
//
// Reads public/data/{eras,places,events,sources,polities}.json and, when it
// exists, public/data/boundaries/moku.geojson (only for its mokuKey values).
// Pass another directory to check a copy (the default is public/data).
// No dependencies. Exits 1 with a list of problems, or prints counts when clean.
// Warnings are printed but do not fail the check.

import { readFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const DATA = process.argv[2] ? resolve(process.argv[2]) : join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'data')

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
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December'

const problems = []
const warnings = []
const bad = (where, msg) => problems.push(`${where}: ${msg}`)
const warn = (where, msg) => warnings.push(`${where}: ${msg}`)

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
if (problems.length) finish()
for (const [name, v] of [['eras.json', eras], ['places.json', places], ['events.json', events], ['sources.json', sources]]) {
  if (!Array.isArray(v)) bad(name, 'must be an array')
}
if (!polities || typeof polities !== 'object' || Array.isArray(polities)) bad('polities.json', 'must be an object')
if (problems.length) finish()

let mokuKeys
let mokuFrom
const mokuPath = join(DATA, 'boundaries', 'moku.geojson')
if (existsSync(mokuPath)) {
  try {
    const g = JSON.parse(readFileSync(mokuPath, 'utf8'))
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
  if (warnings.length) console.log(`  warnings  ${warnings.length}`)
}
