// Where the works' geometry comes from (DATA.md, "Works, dated"), and how to
// fetch it into the downloads directory. Downloads are untrusted data:
// nothing here executes them, the bake only parses them.
//
// Every vector layer is an ArcGIS feature or map service, fetched as GeoJSON
// in WGS84 through fetchTo, so the ledger (fetched.json) records each URL,
// date, size and SHA-256; the layer description and, where one publishes the
// service, its ArcGIS Online item (title, terms, credit) are fetched beside
// the pages, and the manifest's `sources` take their dates from the ledger.
//
// - Military land held today: the State GIS's Department of Defense Lands
//   (2025, digitized from the Hawaiʻi Military Land Use Master Plan of 2021).
//   The State's older military-installations layer is no longer served; its
//   federal-lands layer is dissolved by island and owner, so it cannot tell a
//   base from a park, and is not used.
// - Military land given up before 1986: the Corps of Engineers' Formerly Used
//   Defense Sites property polygons, whose descriptions also date many of
//   them; NAS Barbers Point (closed 1999, not a FUDS) is the Kalaeloa district
//   of the State's Community Development Authority layer, which was drawn
//   round the former station; Kahoʻolawe is the island itself, from the
//   State's ahupuaʻa layer.
// - Airports: the State DOT's airports layer (the fields) and the FAA's
//   runway polygons and airport list (the runways, as centrelines with their
//   published widths).
// - Highways: the State DOT's HPMS road centrelines, by route and milepost;
//   the Pali road of 1898 from the City's street centrelines (Oahu Roads).
// - Harbours: the State DOT's commercial harbours, and NOAA's charted shoreline
//   construction (breakwaters, piers, wharves) at harbour and approach scale,
//   over a box round each harbour.
// - Rail: traced by hand from the State's georeferenced
//   historic sheets (works-traced.mjs); `--sheets` exports those sheets with
//   the traced lines drawn back over them.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fetchText, fetchTo, sleep } from './fetch.mjs'

const ITEM = 'https://www.arcgis.com/sharing/rest/content/items'
const ITEM_PAGE = 'https://www.arcgis.com/home/item.html?id='
const STATE_TERMS =
  'State of Hawaiʻi Statewide GIS Program open data under the State of Hawaiʻi Terms of Use (the contents are public domain); ' +
  'no warranty; for planning, not a legal survey'

/** The box every query is limited to: the main islands, with sea round them (the archipelago pack, padded). */
export const HAWAII_BOX = [-160.3, 18.85, -154.75, 22.3]

/**
 * The vector layers. `key` names the field the dates table joins on; `where`
 * limits the query; `box` limits it to a box (HAWAII_BOX if true); `offset` is
 * the maxAllowableOffset in degrees (about a metre, far under the 10 m the bake
 * simplifies to), `page` the page size.
 */
export const LAYERS = {
  dod: {
    id: 'state-gis-dod-lands',
    title: 'State of Hawaiʻi GIS, Department of Defense Lands (ParcelsZoning MapServer layer 34)',
    service: 'https://geodata.hawaii.gov/arcgis/rest/services/ParcelsZoning/MapServer/34',
    item: '345d822d2e024178a829c039698211cd',
    metadata: 'https://files.hawaii.gov/dbedt/op/gis/data/dod_lands.pdf',
    fields: 'objectid,base_name,county',
    key: 'base_name',
    where: '1=1',
    page: 200,
    offset: 0.00001,
    licence: STATE_TERMS,
    note: 'base and facility boundaries as of October 2025, digitized by the Governor’s Office of Recovery and Resilience from the maps of the Hawaiʻi Military Land Use Master Plan (2021) and the TMK parcels; the land held today, not when it was taken',
  },
  fuds: {
    id: 'usace-fuds',
    title: 'U.S. Army Corps of Engineers, Formerly Used Defense Sites (FUDS) property polygons, FY24 (fuds FeatureServer layer 4)',
    service: 'https://services7.arcgis.com/n1YM8pTrFmm7L4hs/arcgis/rest/services/fuds/FeatureServer/4',
    item: '3f8354667d5b4b1b8ad7a6e00c3cf3b1',
    fields: 'OBJECTID,FEATURENAME,FUDSUNIQUEPROPERTYNUMBER,FEATUREDESCRIPTION,CURRENTOWNER,COUNTY,STATUS',
    key: 'FUDSUNIQUEPROPERTYNUMBER',
    where: "STATE='HI'",
    page: 200,
    offset: 0.00001,
    licence: 'public domain (U.S. Army Corps of Engineers); no usage constraints, preliminary findings, not every property has a polygon',
    note: 'properties the Defense Department held and gave up before October 1986, with a short history of each in FEATUREDESCRIPTION; the bounds of the property as the Corps maps it today',
  },
  hcda: {
    id: 'state-gis-hcda-districts',
    title: 'State of Hawaiʻi GIS, Hawaii Community Development Authority Districts (AdminBnd MapServer layer 22)',
    service: 'https://geodata.hawaii.gov/arcgis/rest/services/AdminBnd/MapServer/22',
    item: 'bf379600c2ff433cbfddceac02deac82',
    metadata: 'https://files.hawaii.gov/dbedt/op/gis/data/hcda_districts.pdf',
    fields: 'objectid,district,acres',
    key: 'district',
    where: "district='Kalaeloa'",
    page: 50,
    offset: 0.00001,
    licence: STATE_TERMS,
    note: 'the Kalaeloa Community Development District, drawn round the former Naval Air Station Barbers Point',
  },
  island: {
    id: 'state-gis-ahupuaa',
    title: 'State of Hawaiʻi GIS, Ahupuaa (Historic Land Divisions), HistoricCultural MapServer layer 1',
    service: 'https://geodata.hawaii.gov/arcgis/rest/services/HistoricCultural/MapServer/1',
    metadata: 'https://files.hawaii.gov/dbedt/op/gis/data/ahupuaa.pdf',
    fields: 'objectid,mokupuni,ahupuaa',
    key: 'mokupuni',
    where: "mokupuni LIKE 'Kaho%'",
    page: 20,
    offset: 0.00001,
    licence: STATE_TERMS,
    note: 'the outline of Kahoʻolawe, one unit of the layer, for the island the Navy held whole',
  },
  airports: {
    id: 'state-gis-airports',
    title: 'State of Hawaiʻi GIS, Airports (Infrastructure MapServer layer 13), from the State DOT Airports Division',
    service: 'https://geodata.hawaii.gov/arcgis/rest/services/Infrastructure/MapServer/13',
    item: '7585917a3bb845beb4f2f4b848c203c8',
    metadata: 'https://files.hawaii.gov/dbedt/op/gis/data/airports.pdf',
    fields: 'objectid,airport_code,airport_name',
    key: 'airport_code',
    where: '1=1',
    page: 100,
    offset: 0.00001,
    licence: STATE_TERMS,
    note: 'the State airports as of March 2019, one or more polygons each; the field as it is today',
  },
  harbours: {
    id: 'state-gis-commercial-harbors',
    title: 'State of Hawaiʻi GIS, Commercial Harbors (Infrastructure MapServer layer 1), from the State DOT Harbors Division',
    service: 'https://geodata.hawaii.gov/arcgis/rest/services/Infrastructure/MapServer/1',
    item: 'cf77f4efd6a74493a0bc2dad96c54031',
    metadata: 'https://files.hawaii.gov/dbedt/op/gis/data/harbors_commercial.pdf',
    fields: 'objectid,harbor_name',
    key: 'harbor_name',
    where: '1=1',
    page: 50,
    offset: 0.00001,
    licence: STATE_TERMS,
    note: 'the ten commercial harbours as of February 2019; read for their names and extents, which bound the charted works the bake takes',
  },
  hpms: {
    id: 'state-gis-hpms',
    title: 'State of Hawaiʻi GIS, Highway Performance Monitoring System roads, 2024 (Transportation MapServer layer 12), from the State DOT',
    service: 'https://geodata.hawaii.gov/arcgis/rest/services/Transportation/MapServer/12',
    item: 'd90ec964a6a54cb397a58a584243f3ab',
    metadata: 'https://files.hawaii.gov/dbedt/op/gis/data/hpms.pdf',
    fields: 'objectid,island,route_id,route_name,bmp,emp,f_system_t,facility_type_t,ownership_t,through_lanes',
    key: 'route_id',
    where: '1=1',
    page: 1000,
    offset: 0.00001,
    licence: STATE_TERMS,
    note: 'road centrelines with their route, begin and end mileposts, functional system, owner and through lanes, as submitted to the Federal Highway Administration in 2025; today’s alignment',
  },
  oahuRoads: {
    id: 'state-gis-oahu-roads',
    title: 'State of Hawaiʻi GIS, Oahu Roads (Transportation MapServer layer 3), from the City and County of Honolulu',
    service: 'https://geodata.hawaii.gov/arcgis/rest/services/Transportation/MapServer/3',
    fields: 'objectid,fullname,owner',
    key: 'fullname',
    where: "fullname IN ('NUUANU PALI DR','OLD PALI RD')",
    page: 200,
    offset: 0.00001,
    licence: STATE_TERMS,
    note: 'street centrelines by name; read for Nuʻuanu Pali Drive and Old Pali Road, the alignment of the Nuʻuanu Pali Road of 1898 in the valley',
  },
  faaRunways: {
    id: 'faa-runways',
    title: 'Federal Aviation Administration, Aeronautical Information Services, Runways (Runways FeatureServer layer 0)',
    service: 'https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/Runways/FeatureServer/0',
    item: '4d8fa46181aa470d809776c57a8ab1f6',
    fields: 'OBJECTID,AIRPORT_ID,DESIGNATOR,LENGTH,WIDTH,DIM_UOM,COMP_CODE',
    key: 'DESIGNATOR',
    where: '1=1',
    box: true,
    page: 500,
    offset: 0,
    licence: 'public (U.S. Federal Aviation Administration); not for navigation',
    note: 'each runway as a rectangle with its designator, length and width in feet; the bake keeps the long axis as the centreline and the published width',
  },
  faaAirports: {
    id: 'faa-airports',
    title: 'Federal Aviation Administration, Aeronautical Information Services, Airports (US_Airport FeatureServer layer 0)',
    service: 'https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/US_Airport/FeatureServer/0',
    item: 'e747ab91a11045e8b3f8a3efd093d3b5',
    fields: 'OBJECTID,GLOBAL_ID,IDENT,NAME,TYPE_CODE,MIL_CODE,OPERSTATUS',
    key: 'IDENT',
    where: '1=1',
    box: true,
    page: 500,
    offset: 0,
    licence: 'public (U.S. Federal Aviation Administration); not for navigation',
    note: 'read only to join each runway to its airport’s identifier',
  },
  encLines: {
    id: 'noaa-enc-shoreline-construction',
    title: 'NOAA Office of Coast Survey, ENC Direct to GIS, Shoreline_Construction (SLCONS) lines and areas at harbour and approach scale',
    service: 'https://encdirect.noaa.gov/arcgis/rest/services/encdirect',
    fields: 'CATSLC,OBJNAM,DSNM,CONDTN',
    key: 'CATSLC',
    licence: 'public domain (NOAA); not for navigation',
    note: 'breakwaters, piers, wharves and moles as charted today, queried over a box round each harbour; they carry no names, so the bake joins them by box and category',
    enc: [
      { scale: 'harbour', layer: 85, geom: 'line' },
      { scale: 'harbour', layer: 138, geom: 'area' },
      { scale: 'approach', layer: 89, geom: 'line' },
      { scale: 'approach', layer: 143, geom: 'area' },
    ],
  },

}

/** Boxes round each harbour for the charted shoreline construction, [w, s, e, n]. */
export const HARBOUR_BOXES = {
  hilo: [-155.10, 19.715, -155.03, 19.76],
  kahului: [-156.49, 20.885, -156.455, 20.91],
  nawiliwili: [-159.37, 21.94, -159.34, 21.965],
  'port-allen': [-159.60, 21.888, -159.58, 21.91],
  kawaihae: [-155.845, 20.02, -155.82, 20.05],
  'barbers-point': [-158.13, 21.31, -158.10, 21.335],
  kaunakakai: [-157.035, 21.07, -157.015, 21.09],
  kaumalapau: [-156.995, 20.78, -156.98, 20.795],
  maalaea: [-156.52, 20.785, -156.505, 20.795],
  honolulu: [-157.905, 21.28, -157.855, 21.33],
  hana: [-155.995, 20.75, -155.98, 20.76],
}

export const worksPaths = (dir) => ({
  vectors: join(dir, 'vectors'),
  sheets: join(dir, 'sheets'),
})
const pageFile = (dir, key, part, off) => join(dir, 'vectors', `${key}${part ? `-${part}` : ''}-page-${String(off).padStart(6, '0')}.geojson`)
const metaFile = (dir, key, part) => join(dir, 'vectors', `${key}${part ? `-${part}` : ''}-layer.json`)
const itemFile = (dir, key) => join(dir, 'vectors', `${key}-item.json`)

const boxParam = (b) =>
  `&geometry=${b.map((v) => v.toFixed(5)).join(',')}&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects`

function queryUrl(service, { where = '1=1', fields = '*', box = null, off = 0, page = 1000, offset = 0, oid = null }) {
  return (
    `${service}/query?where=${encodeURIComponent(where)}${box ? boxParam(box) : ''}&outFields=${encodeURIComponent(fields)}` +
    `&returnGeometry=true&outSR=4326&f=geojson&geometryPrecision=7${offset ? `&maxAllowableOffset=${offset}` : ''}` +
    `${oid ? `&orderByFields=${oid}` : ''}&resultOffset=${off}&resultRecordCount=${page}`
  )
}

/** Fetch one layer: its description, its item, and every feature it gives for the where/box, paged. */
function downloadLayer(ledger, dir, key, log) {
  const L = LAYERS[key]
  mkdirSync(join(dir, 'vectors'), { recursive: true })
  const meta = fetchTo(ledger, `${L.service}?f=json`, metaFile(dir, key), { force: true })
  if (!meta.ok) throw new Error(`${key}: HTTP ${meta.status} for the layer description`)
  const layer = JSON.parse(readFileSync(metaFile(dir, key), 'utf8'))
  if (layer.error) throw new Error(`${key}: ${JSON.stringify(layer.error)}`)
  for (const f of L.fields.split(',')) if (!layer.fields?.some((x) => x.name === f)) throw new Error(`${key}: the layer has no field ${f}`)
  if (L.item) {
    const it = fetchTo(ledger, `${ITEM}/${L.item}?f=json`, itemFile(dir, key), { force: true })
    if (!it.ok) throw new Error(`${key}: HTTP ${it.status} for the item`)
  }
  const box = L.box ? HAWAII_BOX : L.bbox || null
  const countUrl = `${L.service}/query?where=${encodeURIComponent(L.where)}${box ? boxParam(box) : ''}&returnCountOnly=true&f=json`
  const count = JSON.parse(fetchText(countUrl)).count
  if (!(count > 0)) throw new Error(`${key}: no features`)
  for (const f of readdirSync(join(dir, 'vectors'))) if (f.startsWith(`${key}-page-`)) rmSync(join(dir, 'vectors', f))
  const oid = layer.objectIdField || layer.fields.find((f) => f.type === 'esriFieldTypeOID')?.name
  let n = 0
  for (let off = 0; off < count; off += L.page) {
    const url = queryUrl(L.service, { where: L.where, fields: L.fields, box, off, page: L.page, offset: L.offset, oid })
    const r = fetchTo(ledger, url, pageFile(dir, key, null, off), { force: true, maxTime: 600 })
    if (!r.ok) throw new Error(`${key} page ${off}: HTTP ${r.status}`)
    n += JSON.parse(readFileSync(pageFile(dir, key, null, off), 'utf8')).features.length
  }
  if (n !== count) throw new Error(`${key}: got ${n} features, server count ${count}`)
  log(`  ${key}: ${count} features`)
}

/**
 * One query of an ENC Direct map service into one file. Those services take
 * no paging parameters and now and then answer a query with an error, so it
 * is retried; a full answer is refused rather than silently cut short.
 */
function encQuery(ledger, service, { where = '1=1', fields, box }, file, what) {
  const url =
    `${service}/query?where=${encodeURIComponent(where)}${boxParam(box)}&outFields=${encodeURIComponent(fields)}` +
    '&returnGeometry=true&outSR=4326&f=geojson'
  for (let attempt = 1; ; attempt++) {
    const r = fetchTo(ledger, url, file, { force: true, maxTime: 300 })
    if (!r.ok) throw new Error(`${what}: HTTP ${r.status}`)
    const fc = JSON.parse(readFileSync(file, 'utf8'))
    if (!fc.error) {
      if (fc.properties?.exceededTransferLimit || fc.exceededTransferLimit) throw new Error(`${what}: more features than one answer holds`)
      return fc
    }
    if (attempt >= 5) throw new Error(`${what}: ${JSON.stringify(fc.error)}`)
    sleep(3000 * attempt)
  }
}

/** NOAA's charted shoreline construction over each harbour box, at both scales, lines and areas. */
function downloadEnc(ledger, dir, log) {
  const L = LAYERS.encLines
  mkdirSync(join(dir, 'vectors'), { recursive: true })
  for (const f of readdirSync(join(dir, 'vectors'))) if (f.startsWith('encLines-')) rmSync(join(dir, 'vectors', f))
  let total = 0
  for (const e of L.enc) {
    const service = `${L.service}/enc_${e.scale}/MapServer/${e.layer}`
    const part = `${e.scale}-${e.geom}`
    const meta = fetchTo(ledger, `${service}?f=json`, metaFile(dir, 'encLines', part), { force: true })
    if (!meta.ok) throw new Error(`ENC ${part}: HTTP ${meta.status}`)
    for (const [harbour, box] of Object.entries(HARBOUR_BOXES)) {
      const file = pageFile(dir, 'encLines', `${part}-${harbour}`, 0)
      const fc = encQuery(ledger, service, { fields: L.fields, box }, file, `ENC ${part} over ${harbour}`)
      for (const ft of fc.features) Object.assign(ft.properties, { scale: e.scale, harbour })
      writeFileSync(file, JSON.stringify(fc))
      total += fc.features.length
    }
  }
  log(`  encLines: ${total} charted works over ${Object.keys(HARBOUR_BOXES).length} harbours`)
}

export function downloadWorks(ledger, dir, log) {
  log('vector layers:')
  for (const key of Object.keys(LAYERS)) {
    if (key === 'encLines') downloadEnc(ledger, dir, log)
    else downloadLayer(ledger, dir, key, log)
  }
}

/** Every feature of a downloaded layer (all its pages), with the layer description. */
export function readLayer(dir, key) {
  const d = join(dir, 'vectors')
  const files = existsSync(d) ? readdirSync(d).filter((f) => f.startsWith(`${key}-`) && f.includes('-page-')).sort() : []
  if (!files.length) throw new Error(`${key}: not downloaded (run --download)`)
  const features = []
  for (const f of files) {
    const fc = JSON.parse(readFileSync(join(d, f), 'utf8'))
    if (fc.type !== 'FeatureCollection' || !Array.isArray(fc.features)) throw new Error(`${f}: not a FeatureCollection`)
    for (const ft of fc.features) if (ft.geometry) features.push(ft)
  }
  return features
}

const plain = (s) =>
  String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&[a-z#0-9]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

/** A manifest source entry for a layer: what it is, where, its terms and credit, and the date the ledger recorded. */
export function layerSource(ledger, dir, key) {
  const L = LAYERS[key]
  const meta = key === 'encLines' ? metaFile(dir, key, `${L.enc[0].scale}-${L.enc[0].geom}`) : metaFile(dir, key)
  const item = L.item && existsSync(itemFile(dir, key)) ? JSON.parse(readFileSync(itemFile(dir, key), 'utf8')) : null
  return {
    id: L.id,
    title: L.title,
    url: L.service,
    ...(L.item ? { item: `${ITEM_PAGE}${L.item}` } : {}),
    ...(L.metadata ? { metadata: L.metadata } : {}),
    fields: L.fields.split(','),
    licence: L.licence,
    ...(plain(item?.accessInformation) ? { credit: plain(item.accessInformation) } : {}),
    fetched: ledger.get(meta)?.fetched,
    note: L.note,
  }
}

export const downloaded = (dir) => Object.keys(LAYERS).every((k) => existsSync(k === 'encLines' ? metaFile(dir, k, 'harbour-line') : metaFile(dir, k)))
