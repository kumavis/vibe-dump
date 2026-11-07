#!/usr/bin/env node
// The towers' record for Holo i ke Au (DATA.md, "Towers, dated"): for each
// area of Honolulu and the towns of the other islands, how many buildings of
// ten storeys or 30 m and over stand today, and what share of them stood by
// each year; for each island the share alone, for its towers outside the
// areas. The settlements (features/settlements.js, towns.js) let a year hold
// that share of the lots the zoning, the density and the value would raise a
// tower on, and no more than the count.
//
//   node packages/holo-i-ke-au/tools/bake-towers.mjs --all        download, bake, check, delete the downloads
//   node packages/holo-i-ke-au/tools/bake-towers.mjs --download   about 210 MB (nearly all of it the two ACS tables), a few minutes
//   node packages/holo-i-ke-au/tools/bake-towers.mjs --bake       write public/data/towers.json
//   node packages/holo-i-ke-au/tools/bake-towers.mjs --check      tools/check-data.mjs, which holds towers.json to its contract
//   node packages/holo-i-ke-au/tools/bake-towers.mjs --clean      delete the downloads directory
//
// Options:
//   --downloads DIR   where raw downloads go (default: $HOLO_TOWERS_DOWNLOADS, else
//                     <os tmpdir>/holo-i-ke-au-bake/towers-downloads). Keep it outside the repo.
//
// What each part rests on:
// - Today's count on Oʻahu: the City's building footprints (HoLIS, DPP), with
//   a height from the NGA lidar of 2005 and 2009 (maxht_m, metres) or from the
//   City's own later heights (gis_height, feet); a footprint of 30 m (100 ft)
//   and over is a tower, and footprints whose centres lie within 30 m of a
//   taller one's are one building (a tower and its podium, a tower drawn in
//   two). The towers CTBUH lists as completed from 2010 on, more than 40 m
//   from any of those, are added: the lidar is older than them.
// - Today's count on the other islands: OpenStreetMap's buildings of ten
//   levels or 30 m and over, over boxes round each town (the counties publish
//   no heights).
// - The share by year: the Census Bureau's American Community Survey,
//   2019–2023 five-year, table B25127 (occupied housing units by the year the
//   structure was built and the units in it), the units in structures of 50
//   or more, by tract, the tracts taken by where their internal point falls;
//   its bands (before 1940, 1940–59, 1960–79, 1980–99, 2000–19, 2020 on)
//   split into decades by the same tracts' B25034 (all units by decade
//   built). Where CTBUH dates fifteen or more of an area's towers (downtown,
//   Waikīkī, Kakaʻako), the mean of that share and the share of CTBUH's
//   towers completed by the year: the survey counts homes (it sees neither
//   the office towers nor the hotels, and the apartments of the boom came
//   early), CTBUH the tallest (which came late). Nothing stands before 1955.
//
// The areas are drawn by hand below, round the neighbourhoods as the City's
// own plans name them; their rings go into towers.json as they are. The bake
// reads nothing of public/data and writes only public/data/towers.json. Like
// `npm run thumbnails`, a by-hand step whose output is committed.
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { Ledger, fetchTo, sleep } from './lib/fetch.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const PKG = resolve(HERE, '..')
const OUT = join(PKG, 'public', 'data', 'towers.json')
const log = (...m) => console.log(...m)

// --- the areas -------------------------------------------------------------------
// [lon, lat] rings. Honolulu's lie inside the Nuʻuanu district's inner box
// (DATA.md "District packs"), so the district's scatter alone places their
// lots; Salt Lake and Pearlridge lie wholly outside it, on the island's.
export const AREAS = [
  { id: 'downtown', name: 'Downtown and Chinatown', island: 'oahu', ring: [[-157.8715, 21.312], [-157.8665, 21.3195], [-157.86, 21.3175], [-157.8545, 21.3125], [-157.853, 21.3065], [-157.859, 21.301], [-157.866, 21.304], [-157.869, 21.3075]] },
  { id: 'kakaako', name: 'Kakaʻako and Ala Moana', island: 'oahu', ring: [[-157.859, 21.301], [-157.853, 21.3065], [-157.847, 21.301], [-157.84, 21.2955], [-157.836, 21.2915], [-157.84, 21.2895], [-157.8445, 21.288], [-157.852, 21.2905], [-157.86, 21.296]] },
  { id: 'waikiki', name: 'Waikīkī', island: 'oahu', ring: [[-157.8445, 21.288], [-157.84, 21.2895], [-157.836, 21.289], [-157.83, 21.2875], [-157.824, 21.2855], [-157.819, 21.281], [-157.816, 21.276], [-157.8175, 21.2728], [-157.8235, 21.2728], [-157.83, 21.2745], [-157.838, 21.279], [-157.844, 21.283]] },
  { id: 'makiki', name: 'Makiki, Punchbowl and Pāwaʻa', island: 'oahu', ring: [[-157.8545, 21.3125], [-157.853, 21.318], [-157.846, 21.317], [-157.838, 21.311], [-157.832, 21.302], [-157.83, 21.295], [-157.836, 21.2915], [-157.84, 21.2955], [-157.847, 21.301], [-157.853, 21.3065]] },
  { id: 'moiliili', name: 'McCully and Mōʻiliʻili', island: 'oahu', ring: [[-157.836, 21.289], [-157.836, 21.2915], [-157.83, 21.295], [-157.823, 21.299], [-157.815, 21.2955], [-157.812, 21.287], [-157.816, 21.28], [-157.819, 21.281], [-157.824, 21.2855], [-157.83, 21.2875]] },
  { id: 'salt-lake', name: 'Salt Lake', island: 'oahu', ring: [[-157.93, 21.348], [-157.923, 21.364], [-157.905, 21.362], [-157.9, 21.348], [-157.915, 21.342]] },
  { id: 'pearlridge', name: 'ʻAiea and Pearlridge', island: 'oahu', ring: [[-157.95, 21.373], [-157.944, 21.393], [-157.922, 21.393], [-157.92, 21.376], [-157.935, 21.37]] },
  { id: 'hilo', name: 'Hilo', island: 'hawaii', ring: [[-155.105, 19.705], [-155.105, 19.74], [-155.05, 19.74], [-155.05, 19.705]], osm: [[-155.105, 19.705, -155.0775, 19.74], [-155.0775, 19.705, -155.05, 19.74]] },
  { id: 'kailua-kona', name: 'Kailua-Kona', island: 'hawaii', ring: [[-156.01, 19.6], [-156.01, 19.66], [-155.965, 19.66], [-155.965, 19.6]], osm: [[-156.01, 19.6, -155.9875, 19.63], [-155.9875, 19.6, -155.965, 19.63], [-156.01, 19.63, -155.9875, 19.66], [-155.9875, 19.63, -155.965, 19.66]] },
  { id: 'kahului', name: 'Kahului and Wailuku', island: 'maui', ring: [[-156.525, 20.87], [-156.525, 20.905], [-156.44, 20.905], [-156.44, 20.87]], osm: [[-156.525, 20.87, -156.5038, 20.8875], [-156.5038, 20.87, -156.4825, 20.8875], [-156.4825, 20.87, -156.4613, 20.8875], [-156.4613, 20.87, -156.44, 20.8875], [-156.525, 20.8875, -156.5038, 20.905], [-156.5038, 20.8875, -156.4825, 20.905], [-156.4825, 20.8875, -156.4613, 20.905], [-156.4613, 20.8875, -156.44, 20.905]] },
  { id: 'kihei', name: 'Kīhei and Wailea', island: 'maui', ring: [[-156.48, 20.67], [-156.48, 20.79], [-156.42, 20.79], [-156.42, 20.67]], osm: [[-156.48, 20.67, -156.45, 20.73], [-156.45, 20.67, -156.42, 20.73], [-156.48, 20.73, -156.45, 20.79], [-156.45, 20.73, -156.42, 20.79]] },
  { id: 'kaanapali', name: 'Kāʻanapali', island: 'maui', ring: [[-156.7, 20.905], [-156.7, 20.945], [-156.675, 20.945], [-156.675, 20.905]], osm: [[-156.7, 20.905, -156.675, 20.945]] },
]
// the island packs each county's tracts stand for, for the islands' own shares
const COUNTIES = { 15003: ['oahu'], 15009: ['maui', 'molokai', 'lanai', 'kahoolawe'], 15005: ['molokai'], 15001: ['hawaii'], 15007: ['kauai', 'niihau'] }
const FIRST = 1955 // no tower stands before this (the record's first year)
const CTBUH_MIN = 15 // dated towers an area needs before CTBUH's share is taken with the survey's
const UNITS_MIN = 100 // units in structures of 50 or more an area needs for its own share; else its island's

// --- the downloads ---------------------------------------------------------------
const CCH = 'https://services.arcgis.com/tNJpAOha4mODLkXz/arcgis/rest/services/Structures_Facilities/FeatureServer/0'
const CTBUH = 'https://www.skyscrapercenter.com/city/honolulu'
const ACS = (t) => `https://www2.census.gov/programs-surveys/acs/summary_file/2023/table-based-SF/data/5YRData/acsdt5y2023-${t}.dat`
const GAZ = 'https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2023_Gazetteer/2023_gaz_tracts_15.txt'
const OSM = (b) => `https://api.openstreetmap.org/api/0.6/map?bbox=${b.join(',')}`

function download(ledger, dir) {
  const q = (off) =>
    `${CCH}/query?` +
    new URLSearchParams({ where: 'gis_height >= 100 OR maxht_m >= 30', outFields: 'objectid,structurename,gis_height,maxht_m', returnGeometry: 'false', returnCentroid: 'true', outSR: '4326', f: 'json', resultOffset: String(off), resultRecordCount: '1000' })
  for (let off = 0; ; off += 1000) {
    const f = join(dir, `cch-footprints-${off}.json`)
    const r = fetchTo(ledger, q(off), f)
    if (!r.ok) throw new Error(`footprints: HTTP ${r.status}`)
    const n = JSON.parse(readFileSync(f, 'utf8')).features?.length ?? 0
    log(`  footprints from ${off}: ${n}`)
    if (n < 1000) break
  }
  fetchTo(ledger, `${CCH}?f=json`, join(dir, 'cch-footprints-layer.json'))
  for (const [url, f] of [[CTBUH, 'ctbuh-honolulu.html'], [ACS('b25127'), 'acs-b25127.dat'], [ACS('b25034'), 'acs-b25034.dat'], [GAZ, 'gaz-tracts-15.txt']]) {
    const r = fetchTo(ledger, url, join(dir, f))
    if (!r.ok) throw new Error(`${f}: HTTP ${r.status}`)
    log(`  ${f}${r.cached ? ' (kept)' : ''}`)
  }
  for (const a of AREAS)
    for (const [i, b] of (a.osm || []).entries()) {
      const r = fetchTo(ledger, OSM(b), join(dir, `osm-${a.id}-${i}.xml`))
      if (!r.ok) throw new Error(`osm ${a.id} ${i}: HTTP ${r.status}`)
      if (!r.cached) sleep(1500)
      log(`  osm ${a.id} ${i}${r.cached ? ' (kept)' : ''}`)
    }
}

// --- the bake --------------------------------------------------------------------
const inside = (ring, x, y) => {
  let c = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}
const areaOf = (x, y) => AREAS.find((a) => inside(a.ring, x, y)) ?? null
const metres = (a, b) => Math.hypot((a[0] - b[0]) * 111320 * Math.cos((21.3 * Math.PI) / 180), (a[1] - b[1]) * 110574)

/** CTBUH's building records, embedded in its city page as JSON objects. */
function ctbuhRecords(html) {
  const out = new Map()
  const re = /\{"id":(\d+),"name_intl":/g
  for (let m; (m = re.exec(html)); ) {
    let depth = 0
    let j = m.index
    for (; j < html.length; j++) {
      const c = html[j]
      if (c === '"') {
        for (j++; html[j] !== '"'; j++) if (html[j] === '\\') j++
      } else if (c === '{') depth++
      else if (c === '}' && --depth === 0) break
    }
    try {
      const o = JSON.parse(html.slice(m.index, j + 1))
      if (o.latitude && o.longitude) out.set(o.id, o)
    } catch {
      // (a fragment that is not a whole record)
    }
  }
  return [...out.values()]
}

/** The tract rows of an ACS table-based summary file for Hawaiʻi: GEOID → { column: value }. */
function acsRows(file) {
  const lines = readFileSync(file, 'utf8').split('\n')
  const head = lines[0].split('|')
  const out = new Map()
  for (const line of lines) {
    if (!line.startsWith('1400000US15')) continue
    const p = line.split('|')
    const r = {}
    head.forEach((h, i) => (r[h] = Math.max(0, Number(p[i]) || 0)))
    out.set(p[0].slice(9), r)
  }
  return out
}

/** OpenStreetMap's buildings of ten levels or 30 m and over in a file, as [lon, lat, levels, height, name, start]. */
function osmTall(file) {
  const xml = readFileSync(file, 'utf8')
  const nodes = new Map()
  for (const m of xml.matchAll(/<node id="(\d+)"[^>]*?lat="([-\d.]+)" lon="([-\d.]+)"/g)) nodes.set(m[1], [Number(m[3]), Number(m[2])])
  const out = []
  for (const m of xml.matchAll(/<way id="\d+"[^>]*>([\s\S]*?)<\/way>/g)) {
    const body = m[1]
    const tags = Object.fromEntries([...body.matchAll(/<tag k="([^"]+)" v="([^"]*)"/g)].map((t) => [t[1], t[2]]))
    if (!tags.building) continue
    const levels = parseFloat(tags['building:levels']) || 0
    const height = parseFloat(tags.height) || 0
    if (levels < 10 && height < 30) continue
    const pts = [...body.matchAll(/<nd ref="(\d+)"/g)].map((r) => nodes.get(r[1])).filter(Boolean)
    if (!pts.length) continue
    const c = [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length]
    out.push([...c, levels, height, tags.name ?? null, tags.start_date ?? null])
  }
  return out
}

const r3 = (v) => Math.round(v * 1000) / 1000

/** A share series from decade counts ({ 1930: n, 1940: n, …, 2020: n }, a decade's units built in it) and, optionally, dated towers. */
function series(decades, years, end) {
  const total = Object.values(decades).reduce((a, b) => a + b, 0)
  const pts = [FIRST, 1960, 1970, 1980, 1990, 2000, 2010, 2020, end]
  const acs = (y) => {
    if (y <= FIRST) return 0
    let s = 0
    for (const [d, n] of Object.entries(decades)) s += Number(d) + 10 <= y ? n : y > Number(d) ? (n * (y - Number(d))) / 10 : 0
    return total ? s / total : 0
  }
  const dated = years?.length >= CTBUH_MIN ? (y) => (y <= FIRST ? 0 : years.filter((v) => v < y).length / years.length) : null
  let last = 0
  return pts.map((y) => {
    let s = y >= end ? 1 : dated ? (acs(y) + dated(y)) / 2 : acs(y)
    s = Math.max(last, Math.min(1, s))
    last = s
    return [y, r3(s)]
  })
}

function bake(dir, ledger) {
  const fetched = (f) => ledger.get(join(dir, f))?.fetched ?? null
  // today's towers on Oʻahu: the footprints, one building to a cluster
  const prints = []
  for (let off = 0; existsSync(join(dir, `cch-footprints-${off}.json`)); off += 1000)
    for (const f of JSON.parse(readFileSync(join(dir, `cch-footprints-${off}.json`), 'utf8')).features || []) {
      const a = f.attributes
      const h = a.gis_height ? a.gis_height * 0.3048 : a.maxht_m || 0
      if (f.centroid && h >= 30) prints.push({ at: [f.centroid.x, f.centroid.y], h, name: a.structurename })
    }
  prints.sort((a, b) => b.h - a.h)
  const towers = []
  for (const p of prints) if (!towers.some((t) => metres(t.at, p.at) < 30)) towers.push(p)
  // CTBUH: completed, dated, by area; and the later ones the lidar missed
  const ct = ctbuhRecords(readFileSync(join(dir, 'ctbuh-honolulu.html'), 'utf8')).filter((r) => r.status === 'COM' && Number.isInteger(r.completed))
  const dated = new Map()
  const added = new Map()
  for (const r of ct) {
    const at = [Number(r.longitude), Number(r.latitude)]
    const a = areaOf(...at)
    if (!a) continue
    if (!dated.has(a.id)) dated.set(a.id, [])
    dated.get(a.id).push(r.completed)
    if (r.completed >= 2010 && !towers.some((t) => metres(t.at, at) < 40)) added.set(a.id, (added.get(a.id) || 0) + 1)
  }
  // the survey's units in structures of 50 or more, by area and by island, in decades
  const gaz = new Map()
  for (const line of readFileSync(join(dir, 'gaz-tracts-15.txt'), 'utf8').split('\n').slice(1)) {
    const p = line.split('\t')
    if (p.length > 7) gaz.set(p[1], [Number(p[7]), Number(p[6])])
  }
  const b27 = acsRows(join(dir, 'acs-b25127.dat'))
  const b34 = acsRows(join(dir, 'acs-b25034.dat'))
  // (owner and renter columns of each band's 50-or-more line, and B25034's decades)
  const BANDS = { 1930: [8 + 35, 51 + 35], 1940: [36, 79], 1960: [29, 72], 1980: [22, 65], 2000: [15, 58], 2020: [8, 51] }
  const DEC = { 2020: 2, 2010: 3, 2000: 4, 1990: 5, 1980: 6, 1970: 7, 1960: 8, 1950: 9, 1940: 10, 1930: 11 }
  const acc = new Map()
  const add = (key, g) => {
    if (!acc.has(key)) acc.set(key, { bands: {}, dec: {}, tracts: 0 })
    const o = acc.get(key)
    o.tracts++
    for (const [b, [own, rent]] of Object.entries(BANDS)) o.bands[b] = (o.bands[b] || 0) + b27.get(g)[`B25127_E${String(own).padStart(3, '0')}`] + b27.get(g)[`B25127_E${String(rent).padStart(3, '0')}`]
    for (const [d, c] of Object.entries(DEC)) o.dec[d] = (o.dec[d] || 0) + (b34.get(g)?.[`B25034_E${String(c).padStart(3, '0')}`] || 0)
  }
  for (const g of b27.keys()) {
    const at = gaz.get(g)
    if (!at) continue
    const a = areaOf(...at)
    if (a) add(a.id, g)
    else for (const isl of COUNTIES[g.slice(0, 5)] || []) add(`island:${isl}`, g)
  }
  // a band's units into its decades, by the tracts' own mix of all units built in them
  const decades = (o) => {
    const split = (n, a, b) => {
      const s = o.dec[a] + o.dec[b]
      return s ? [(n * o.dec[a]) / s, (n * o.dec[b]) / s] : [n / 2, n / 2]
    }
    const out = { 1930: o.bands[1930] }
    ;[out[1940], out[1950]] = split(o.bands[1940], 1940, 1950)
    ;[out[1960], out[1970]] = split(o.bands[1960], 1960, 1970)
    ;[out[1980], out[1990]] = split(o.bands[1980], 1980, 1990)
    ;[out[2000], out[2010]] = split(o.bands[2000], 2000, 2010)
    out[2020] = o.bands[2020]
    return out
  }
  const END = 2023 // the survey's last year
  const units = (o) => Object.values(o.bands).reduce((a, b) => a + b, 0)
  const islands = {}
  for (const isl of new Set(Object.values(COUNTIES).flat())) {
    const o = acc.get(`island:${isl}`)
    if (!o) continue
    islands[isl] = { share: series(decades(o), null, END), units50: Math.round(units(o)), tracts: o.tracts, sources: ['acs-2023-b25127', 'acs-2023-b25034', 'census-gazetteer-2023-tracts'] }
  }
  const areas = AREAS.map((a) => {
    const o = acc.get(a.id)
    const own = o && units(o) >= UNITS_MIN
    const years = dated.get(a.id) || []
    const out = { id: a.id, name: a.name, island: a.island, ring: a.ring }
    if (a.osm) {
      const tall = a.osm.flatMap((_, i) => osmTall(join(dir, `osm-${a.id}-${i}.xml`))).filter((t) => inside(a.ring, t[0], t[1]))
      const seen = []
      for (const t of tall) if (!seen.some((s) => metres(s, t) < 30)) seen.push(t)
      out.count = seen.length
      out.counted = { by: 'osm-buildings-towns', fetched: fetched(`osm-${a.id}-0.xml`), named: seen.filter((t) => t[4]).map((t) => (t[5] ? `${t[4]} (${t[5]})` : t[4])) }
    } else {
      const lid = towers.filter((t) => inside(a.ring, ...t.at)).length
      out.count = lid + (added.get(a.id) || 0)
      out.counted = { by: 'cch-building-footprints', fetched: fetched('cch-footprints-0.json'), footprints: lid, laterFromCtbuh: added.get(a.id) || 0 }
    }
    out.share = own ? series(decades(o), years, END) : islands[a.island].share
    out.shareFrom = own ? (years.length >= CTBUH_MIN ? 'survey and dated' : 'survey') : 'island'
    out.units50 = o ? Math.round(units(o)) : 0
    if (years.length) out.dated = years.length
    out.sources = [out.counted.by, 'acs-2023-b25127', 'acs-2023-b25034', 'census-gazetteer-2023-tracts', ...(years.length ? ['ctbuh-honolulu'] : [])]
    return out
  })
  const doc = {
    about:
      'When the towers rose: for each area, today’s count of buildings of ten storeys or 30 m and over and the share of them standing by each year; for each island the share alone, for its towers outside the areas. The settlements let a year hold that share of the lots the zoning, the density and the value would raise a tower on, and never more than the count (DATA.md “Towers, dated”).',
    tower: { storeys: 10, metres: 30 },
    rule:
      'count: on Oʻahu the City’s footprints of 30 m and over (lidar of 2005 and 2009, or the City’s later heights), one building to footprints whose centres lie within 30 m, with the towers CTBUH lists as completed from 2010 on that none of them stands within 40 m of; elsewhere OpenStreetMap’s buildings of ten levels or 30 m and over. share: the ACS 2019–2023 units in structures of 50 or more by the year built (B25127), the bands split into decades by the same tracts’ units by decade built (B25034), linear within a decade; where CTBUH dates fifteen or more of an area’s towers, the mean of that and the share of them completed by the year; none before 1955; the island’s own where an area has fewer than a hundred such units.',
    first: FIRST,
    areas,
    islands,
    sources: ['cch-building-footprints', 'ctbuh-honolulu', 'acs-2023-b25127', 'acs-2023-b25034', 'census-gazetteer-2023-tracts', 'osm-buildings-towns'],
    wanted: ['honolulu-building-permits-2005'],
    baked: { tool: 'tools/bake-towers.mjs', fetched: { footprints: fetched('cch-footprints-0.json'), ctbuh: fetched('ctbuh-honolulu.html'), acs: fetched('acs-b25127.dat') } },
  }
  writeFileSync(OUT, JSON.stringify(doc, null, 1) + '\n')
  log(`wrote ${OUT} (${(JSON.stringify(doc).length / 1024).toFixed(1)} KB)`)
  const at = (sh, y) => {
    for (let i = 1; i < sh.length; i++) if (y <= sh[i][0]) return sh[i - 1][1] + ((sh[i][1] - sh[i - 1][1]) * (y - sh[i - 1][0])) / (sh[i][0] - sh[i - 1][0])
    return y < sh[0][0] ? 0 : 1
  }
  log('  area            now   1960  1970  1978  1990  2000  share from')
  for (const a of areas) log(`  ${a.id.padEnd(14)} ${String(a.count).padStart(4)}  ${[1960, 1970, 1978, 1990, 2000].map((y) => String(Math.floor(a.count * at(a.share, y))).padStart(4)).join('  ')}  ${a.shareFrom}`)
}

function parseArgs(argv) {
  const a = { flags: new Set(), downloads: null }
  for (let i = 0; i < argv.length; i++) {
    const v = argv[i]
    if (v === '--downloads') a.downloads = argv[++i]
    else if (v.startsWith('--')) a.flags.add(v.slice(2))
    else throw new Error(`unexpected argument ${v}`)
  }
  a.downloads = resolve(a.downloads || process.env.HOLO_TOWERS_DOWNLOADS || join(tmpdir(), 'holo-i-ke-au-bake', 'towers-downloads'))
  return a
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const f = args.flags
  if (!['download', 'bake', 'check', 'clean', 'all'].some((k) => f.has(k))) {
    console.error('usage: bake-towers.mjs --download | --bake | --check | --clean | --all  [--downloads DIR]')
    process.exit(2)
  }
  const ledger = new Ledger(args.downloads)
  if (f.has('download') || f.has('all')) {
    log(`downloads: ${args.downloads}`)
    download(ledger, args.downloads)
  }
  if (f.has('bake') || f.has('all')) bake(args.downloads, ledger)
  if (f.has('check') || f.has('all')) {
    const r = spawnSync(process.execPath, [join(HERE, 'check-data.mjs')], { stdio: 'inherit' })
    if (r.status !== 0) process.exit(1)
  }
  if (f.has('clean') || f.has('all')) {
    rmSync(args.downloads, { recursive: true, force: true })
    log(`deleted ${args.downloads}`)
  }
}

main()
