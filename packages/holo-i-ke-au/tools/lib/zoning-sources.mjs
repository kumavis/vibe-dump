// Where the zoning rasters' inputs come from (DATA.md, "Zoning, for the
// settlements"), and how to fetch them into the downloads directory.
// Downloads are untrusted data: nothing here executes them, the bake only
// parses them.
//
// Each county publishes its own zoning as an ArcGIS feature service, and the
// State GIS mirrors all four (ParcelsZoning MapServer layers 2, 3, 29 and
// 33), but the mirrors are snapshots of 2023 to 2025. The bake reads the
// counties' own layers, which their planning departments keep current, and
// takes the State Land Use Districts from the State GIS, which is where the
// Land Use Commission's boundaries are published.
//
// Every layer is fetched as GeoJSON in WGS84, paged, through fetchTo, so the
// ledger (fetched.json) records each URL, date, size and SHA-256. The pages
// and the layer description sit where layers-sources.mjs puts its own
// (vectors/<key>-page-NNNNNN.geojson, vectors/<key>-layer.json), so its
// readVector reads them back; the ArcGIS Online item (title, licence,
// credits) goes beside them as vectors/<key>-item.json.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { fetchText, fetchTo } from './fetch.mjs'
import { readVector } from './layers-sources.mjs'

export { readVector }

const ITEM = 'https://www.arcgis.com/sharing/rest/content/items'
const ITEM_PAGE = 'https://www.arcgis.com/home/item.html?id='

/**
 * The layers. `field` holds the class code; `name` (when there is one) the
 * class's own name; `offset` is the maxAllowableOffset in degrees (about 2 m,
 * far below a texel), `page` the page size (at or under each service's
 * maxRecordCount). `item` is the ArcGIS Online item that publishes the
 * service, which carries its licence text and credits.
 */
export const LAYERS = {
  honolulu: {
    id: 'honolulu-zoning',
    county: 'City and County of Honolulu',
    title: 'City and County of Honolulu, Zoning (Land Use Ordinance zoning districts), Zoning_Reg FeatureServer layer 0',
    service: 'https://services.arcgis.com/tNJpAOha4mODLkXz/arcgis/rest/services/Zoning_Reg/FeatureServer/0',
    item: '8068469b47834d3ca4bc299d4079f35f',
    hub: 'https://honolulu-cchnl.opendata.arcgis.com/',
    fields: 'objectid,zone_class,zoning_description,zoning_label',
    field: 'zone_class',
    name: 'zoning_description',
    page: 1000,
    offset: 0.00002,
    note:
      'the Land Use Ordinance (ROH Chapter 21) districts as the Department of Planning and Permitting maps them in HOLIS; ' +
      'the State-administered Kakaʻako and Aloha Tower districts and the Waikīkī and Kakaʻako precincts are classes of their own',
  },
  honoluluHeight: {
    id: 'honolulu-zoning-height',
    county: 'City and County of Honolulu',
    title: 'City and County of Honolulu, Zoning Map Height Limit, Zoning_Reg FeatureServer layer 2',
    service: 'https://services.arcgis.com/tNJpAOha4mODLkXz/arcgis/rest/services/Zoning_Reg/FeatureServer/2',
    item: '8068469b47834d3ca4bc299d4079f35f',
    fields: 'objectid,height_label,height_label_source',
    field: 'height_label',
    page: 1000,
    offset: 0.00002,
    note:
      'the height limits of the zoning maps, in feet (a bonus height in brackets); read only to tell tower blocks from walk-ups ' +
      'in the medium-density apartment districts',
  },
  maui: {
    id: 'maui-county-zoning',
    county: 'County of Maui',
    title: 'County of Maui Department of Planning, Maui County Zoning Districts (PLDB.PL.MauiCountyZoningDistrict), FeatureServer layer 0',
    service: 'https://services3.arcgis.com/fsrDo0QMPlK9CkZD/arcgis/rest/services/Maui_County_Zoning_Districts/FeatureServer/0',
    item: '8a9b0fdba5494c648dec8902cd574132',
    fields: 'OBJECTID,ZONE_CLASS,COMMUNITY_PLAN,Island,LASTUPDATE',
    field: 'ZONE_CLASS',
    domain: true, // ZONE_CLASS is a coded value; its names come from the layer's domain
    page: 1000,
    offset: 0.00002,
    note:
      'Maui County Code Title 19 districts on Maui, Molokaʻi and Lānaʻi (the layer has none on Kahoʻolawe); a three-digit ' +
      'code whose names are the layer’s coded-value domain; much land is still in the Interim district that holds land never ' +
      'comprehensively zoned',
  },
  hawaii: {
    id: 'hawaii-county-zoning',
    county: 'County of Hawaiʻi',
    title: 'County of Hawaiʻi Planning Department, Hawaii County Zoning (Zoning_COH FeatureServer layer 9)',
    service: 'https://services1.arcgis.com/C2LPusZs5OXNGFDn/arcgis/rest/services/Zoning_COH/FeatureServer/9',
    item: 'c854c958632d408cbfa40398725a63fa',
    metadata: 'https://gis.hawaiicounty.gov/public/downloads/plhyperlinks/MetadataFiles/Zoning.pdf',
    fields: 'OBJECTID,ZONE,DISTRICT,ORDINANCE',
    field: 'ZONE',
    page: 1000,
    offset: 0.00002,
    note:
      'Hawaiʻi County Code Chapter 25 districts; the code is the district and its minimum lot or land area per unit ' +
      '(RS-10 is single-family on 10,000 square feet, A-20a agricultural on 20 acres); the zone definitions are in the layer description',
  },
  kauai: {
    id: 'kauai-county-zoning',
    county: 'County of Kauaʻi',
    title: 'County of Kauaʻi Planning Department (Kauaʻi GIS), Zoning FeatureServer layer 0',
    service: 'https://services1.arcgis.com/0DaVqrPt2eyXUS9g/arcgis/rest/services/Zoning/FeatureServer/0',
    item: 'afc3493f5e004109b7c01d721fcb13d0',
    hub: 'https://kauai-open-data-kauaigis.hub.arcgis.com/',
    fields: 'OBJECTID,ZONING,DESCRIPTION',
    field: 'ZONING',
    name: 'DESCRIPTION',
    page: 1000,
    offset: 0.00002,
    note:
      'Kauaʻi Comprehensive Zoning Ordinance districts on Kauaʻi (the layer has none on Niʻihau); a code such as R-6/ST-P ' +
      'is a district with an overlay after the slash, and the district before it decides the class',
  },
  slud: {
    id: 'hawaii-gis-state-land-use-districts',
    county: 'State of Hawaiʻi',
    title: 'State of Hawaiʻi GIS, State Land Use Districts (ParcelsZoning MapServer layer 20)',
    service: 'https://geodata.hawaii.gov/arcgis/rest/services/ParcelsZoning/MapServer/20',
    item: '7b6e118ffe5d4370923dde14ed1ea6e3',
    metadata: 'https://files.hawaii.gov/dbedt/op/gis/data/slud.pdf',
    fields: 'objectid,ludcode,island',
    field: 'ludcode',
    page: 1000,
    offset: 0.00002,
    note:
      'the Land Use Commission’s district boundaries for the eight main islands as of December 2020, under HRS Chapter 205 ' +
      '(in force since 1961); amendments under 15 acres after 2016 are not in the layer, and it is not the official boundary',
  },
}

/** Which zoning layer zones each island pack. Kahoʻolawe and Niʻihau are in counties whose layers map nothing there. */
export const COUNTY_OF = {
  oahu: 'honolulu',
  maui: 'maui',
  lanai: 'maui',
  molokai: 'maui',
  kahoolawe: 'maui',
  hawaii: 'hawaii',
  kauai: 'kauai',
  niihau: 'kauai',
}

export const zoningPaths = (dir) => ({ vectors: join(dir, 'vectors') })
const pageFile = (dir, key, off) => join(dir, 'vectors', `${key}-page-${String(off).padStart(6, '0')}.geojson`)
const metaFile = (dir, key) => join(dir, 'vectors', `${key}-layer.json`)
const itemFile = (dir, key) => join(dir, 'vectors', `${key}-item.json`)

/** Fetch one layer's description, its item and every feature, paged; checks the count against the server's. */
export function downloadLayer(ledger, dir, key, log) {
  const L = LAYERS[key]
  mkdirSync(join(dir, 'vectors'), { recursive: true })
  const meta = fetchTo(ledger, `${L.service}?f=json`, metaFile(dir, key), { force: true })
  if (!meta.ok) throw new Error(`${key}: HTTP ${meta.status} for the layer description`)
  const layer = JSON.parse(readFileSync(metaFile(dir, key), 'utf8'))
  if (layer.error) throw new Error(`${key}: ${JSON.stringify(layer.error)}`)
  if (layer.geometryType !== 'esriGeometryPolygon') throw new Error(`${key}: geometry ${layer.geometryType}, expected polygons`)
  for (const f of L.fields.split(',')) if (!layer.fields?.some((x) => x.name === f)) throw new Error(`${key}: the layer has no field ${f}`)
  if (L.item) {
    const it = fetchTo(ledger, `${ITEM}/${L.item}?f=json`, itemFile(dir, key), { force: true })
    if (!it.ok) throw new Error(`${key}: HTTP ${it.status} for the item`)
  }
  const count = JSON.parse(fetchText(`${L.service}/query?where=1%3D1&returnCountOnly=true&f=json`)).count
  if (!(count > 0)) throw new Error(`${key}: no features`)
  for (const f of readdirSync(join(dir, 'vectors'))) if (f.startsWith(`${key}-page-`)) rmSync(join(dir, 'vectors', f))
  const oid = layer.objectIdField || layer.fields.find((f) => f.type === 'esriFieldTypeOID')?.name
  for (let off = 0; off < count; off += L.page) {
    const url =
      `${L.service}/query?where=1%3D1&outFields=${encodeURIComponent(L.fields)}&outSR=4326&f=geojson` +
      `&orderByFields=${oid}&resultOffset=${off}&resultRecordCount=${L.page}&geometryPrecision=6&maxAllowableOffset=${L.offset}`
    const r = fetchTo(ledger, url, pageFile(dir, key, off), { force: true, maxTime: 600 })
    if (!r.ok) throw new Error(`${key} page ${off}: HTTP ${r.status}`)
  }
  // a feature generalised away has no geometry and readVector drops it, so count the pages' own lists
  let n = 0
  for (const f of readdirSync(join(dir, 'vectors')).filter((f) => f.startsWith(`${key}-page-`))) {
    n += JSON.parse(readFileSync(join(dir, 'vectors', f), 'utf8')).features.length
  }
  if (n !== count) throw new Error(`${key}: got ${n} features, server count ${count}`)
  log(`  ${key}: ${count} features`)
  return count
}

export function downloadAll(ledger, dir, log) {
  log('zoning and land use district layers:')
  for (const key of Object.keys(LAYERS)) downloadLayer(ledger, dir, key, log)
}

export const downloaded = (dir) => Object.keys(LAYERS).every((k) => existsSync(metaFile(dir, k)))

/** The layer JSON and the item JSON of a downloaded layer. */
export function layerMeta(dir, key) {
  const layer = JSON.parse(readFileSync(metaFile(dir, key), 'utf8'))
  const item = existsSync(itemFile(dir, key)) ? JSON.parse(readFileSync(itemFile(dir, key), 'utf8')) : null
  return { layer, item }
}

const plain = (s) =>
  String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, '’')
    .replace(/&[a-z#0-9]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

/** First `n` characters of a text, cut at a sentence end where one falls late enough. */
function clip(s, n) {
  if (s.length <= n) return s
  const cut = s.slice(0, n)
  const end = cut.lastIndexOf('. ')
  return end > n * 0.5 ? cut.slice(0, end + 1) : cut.replace(/\s+\S*$/, '') + ' …'
}

/**
 * A source entry for the manifest: the service, the layer's name and fields,
 * the licence or terms as the item states them, the credit, and the date the
 * ledger recorded for the layer description.
 */
export function layerSource(ledger, dir, key, extra = {}) {
  const L = LAYERS[key]
  const { layer, item } = layerMeta(dir, key)
  const used = new Set(L.fields.split(','))
  const terms = plain(item?.licenseInfo)
  const credit = plain(item?.accessInformation) || plain(layer.copyrightText)
  return {
    id: L.id,
    title: L.title,
    publisher: L.county,
    url: L.service,
    layer: layer.name,
    fields: layer.fields.filter((f) => used.has(f.name)).map((f) => `${f.name} (${f.type.replace('esriFieldType', '')}${f.alias && f.alias.toLowerCase() !== f.name.toLowerCase() ? `, “${f.alias}”` : ''})`),
    classField: L.field,
    ...(L.name ? { nameField: L.name } : {}),
    ...(L.item ? { item: `${ITEM_PAGE}${L.item}` } : {}),
    ...(L.hub ? { hub: L.hub } : {}),
    ...(L.metadata ? { metadata: L.metadata } : {}),
    ...(layer.editingInfo?.dataLastEditDate ? { dataLastEdited: new Date(layer.editingInfo.dataLastEditDate).toISOString().slice(0, 10) } : {}),
    fetched: ledger.get(metaFile(dir, key))?.fetched,
    licence: terms
      ? `terms as the publisher states them: ${clip(terms, 600)}`
      : 'no licence or terms stated on the service or its item; published openly by the county, used here only generalised to a dozen classes at the pack’s texel size, with credit',
    ...(credit ? { credit } : {}),
    note: L.note,
    ...extra,
  }
}

/** Coded-value names of a field, from the layer description ({} when it has no domain). */
export function domainNames(dir, key, field) {
  const { layer } = layerMeta(dir, key)
  const f = layer.fields.find((x) => x.name === field)
  return Object.fromEntries((f?.domain?.codedValues || []).map((c) => [String(c.code), c.name]))
}
