// Where the era layers' inputs come from (DATA.md, "Era layers"), and how to
// fetch them into the downloads directory. Downloads are untrusted data:
// nothing here executes them, the bake only parses them.
//
// Vector layers come from ArcGIS REST services as GeoJSON in WGS84, paged;
// the one raster (the USGS Carbon Assessment of Hawaiʻi land cover) is a
// single 30 m GeoTIFF from ScienceBase. Every file goes through fetchTo, so
// the ledger (fetched.json) records its URL, date, size and SHA-256.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { fetchText, fetchTo } from './fetch.mjs'

const STATE_GIS = 'https://geodata.hawaii.gov/arcgis/rest/services'

/** Geologic units that make valley-floor and coastal wet ground (names as the layer spells them). */
export const WET_GROUND = ['Alluvium', 'Lagoon and reef deposits', 'Lagoon deposits', 'Lacustrine deposits', 'Fill']
const STATE_LICENCE = 'State of Hawaiʻi Statewide GIS Program open data; no warranty of positional or thematic accuracy'

/**
 * Vector sources. `where` filters on the server, `offset` is the
 * maxAllowableOffset in degrees (generalisation far below a texel), `page`
 * the page size (under each service's maxRecordCount).
 */
export const VECTORS = {
  sugar1900: {
    id: 'hawaii-gis-sugarcane-1900',
    title: 'State of Hawaiʻi GIS, Historical Sugarcane Lands 1900 (LandUseLandCover MapServer layer 23)',
    service: `${STATE_GIS}/LandUseLandCover/MapServer/23`,
    metadata: 'https://files.hawaii.gov/dbedt/op/gis/data/sugarcane_historical.pdf',
    licence: STATE_LICENCE,
    note:
      'lands in sugar cane in 1900, digitised in 2006 for the State Department of Health from the land utilization maps in ' +
      'the Territorial Planning Board’s Historic Inventory of the Physical, Social, Economic & Industrial Resources of the ' +
      'Territory of Hawaii (First Progress Report, 1939), on USGS 1:24,000 bases; the metadata says final QA/QC was not done',
  },
  pine1900: {
    id: 'hawaii-gis-pineapple-1900',
    title: 'State of Hawaiʻi GIS, Historical Pineapple Lands 1900 (LandUseLandCover MapServer layer 20)',
    service: `${STATE_GIS}/LandUseLandCover/MapServer/20`,
    metadata: 'https://files.hawaii.gov/dbedt/op/gis/data/pineapple_historical.pdf',
    licence: STATE_LICENCE,
    note: 'one polygon, from the same 1939 Territorial Planning Board maps as the cane lands',
  },
  ag2020: {
    id: 'hawaii-gis-agriculture-2020',
    title: 'State of Hawaiʻi GIS, 2020 Agricultural Land Use (Statewide Agricultural Land Use Baseline update), LandUseLandCover MapServer layer 19',
    service: `${STATE_GIS}/LandUseLandCover/MapServer/19`,
    licence: `${STATE_LICENCE}; cite Perroy, R. and Collier, E. (2021), 2020 Update to the Hawaiʻi Statewide Agricultural Land Use Baseline, Hawaiʻi State Department of Agriculture`,
    note: 'commercial agriculture digitised from 2018–2020 WorldView imagery; field crops_2020',
    offset: 0.00003,
  },
  reserves: {
    id: 'hawaii-gis-reserves',
    title: 'State of Hawaiʻi GIS, Reserves (Terrestrial MapServer layer 1), forest reserve units only',
    service: `${STATE_GIS}/Terrestrial/MapServer/1`,
    where: "type LIKE 'fr%'",
    licence: STATE_LICENCE,
    note:
      'boundaries as of March 2026, fitted to the county tax maps; the layer carries no proclamation dates, and the forest ' +
      'reserve system it descends from was proclaimed from 1904 on',
    offset: 0.0001,
  },
  geology: {
    id: 'hawaii-gis-geologic-units',
    title: 'State of Hawaiʻi GIS, Geologic Units (Terrestrial MapServer layer 28), after Sherrod and others (USGS 2007): young lava and wet-ground sediments only',
    service: `${STATE_GIS}/Terrestrial/MapServer/28`,
    where: `(age_group >= 1 AND age_group <= 3) OR name IN (${WET_GROUND.map((n) => `'${n}'`).join(',')})`,
    metadata: 'https://files.hawaii.gov/dbedt/op/gis/data/Geologic_Units.pdf',
    licence: STATE_LICENCE,
    note:
      'flows younger than about 1,500 years, with their age_range (calendar years for historic flows); and the alluvium, ' +
      'lagoon, lacustrine and fill units, the ground under valley-floor and coastal loʻi (much of the fill was laid over ' +
      'ponds and marsh in the 20th century)',
    offset: 0.0001,
  },
  tradAg: {
    id: 'ksbe-traditional-agriculture',
    title: 'Traditional Agriculture: modelled areas of high potential for loʻi, dryland and agroforestry (Kamehameha Schools)',
    service: 'https://services1.arcgis.com/mWZnFht59JsTeUQW/arcgis/rest/services/Traditional_Agriculture/FeatureServer/21',
    licence:
      'no licence stated on the ArcGIS Online item; credit "Natalie Kurashima, 2012. Developed in partnership with Patrick Kirch, ' +
      'University of California at Berkeley, and Kamehameha Schools Land Assets Division"; methods in Kurashima and Kirch (2011), ' +
      'Geospatial modeling of pre-contact Hawaiian production systems on Moloka‘i Island, Journal of Archaeological Science 38:3662–3674',
    note:
      'a published GIS model, not a survey: each zone is where soil, rain, substrate, slope, elevation and water would support the system, ' +
      'checked by its authors against archaeological and ethnohistoric data; it covers Hawaiʻi, Maui County, Oʻahu and Kauaʻi, not Niʻihau',
    offset: 0.00005,
  },
  lca: {
    id: 'oha-kipuka-land-commission-awards',
    title: 'Land Commission Awards, statewide (Office of Hawaiian Affairs, Kīpuka database), parcels under about 100 ha',
    service: 'https://services5.arcgis.com/7nEbFq9LrZLy9uXi/arcgis/rest/services/LCA_State/FeatureServer/0',
    where: 'Shape__Area < 1000000',
    page: 2000,
    licence: 'no licence stated on the ArcGIS Online item; credit "Office of Hawaiian Affairs"; used only as a smoothed density at hundreds of metres, no parcel is redistributed',
    note:
      'Māhele and kuleana awards of 1846–1855 with later grants; the large konohiki and aliʻi awards (whole ahupuaʻa) are left out by ' +
      'the area filter. Coverage differs by island: Hawaiʻi Island is thinly digitised',
    fields: 'FID,source,award,award_year,mokupuni,land_use',
  },
  blockGroups: {
    id: 'census-2020-block-groups',
    title: 'U.S. Census Bureau TIGERweb, Census 2020 block groups for Hawaiʻi with POP100',
    service: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Census2020/MapServer/8',
    where: "STATE='15'",
    licence: 'public domain (U.S. Census Bureau)',
    note: '2020 census resident population (POP100) per block group',
    fields: 'GEOID,COUNTY,TRACT,BLKGRP,POP100,AREALAND',
    offset: 0.0001,
    order: 'OBJECTID',
  },
}

export const CAH = {
  id: 'usgs-cah-landcover-2017',
  title: 'Carbon Assessment of Hawaii Land Cover Map (CAH_LandCover), 30 m GeoTIFF, NAD83 UTM zone 4',
  item: 'https://www.sciencebase.gov/catalog/item/592dee56e4b092b266efeb6b',
  tif: 'https://www.sciencebase.gov/catalog/file/get/592dee56e4b092b266efeb6b?f=__disk__a3%2Faf%2F26%2Fa3af26fa1c8a0d5dbb2b116c271a10b7bb575540',
  vat: 'https://www.sciencebase.gov/catalog/file/get/592dee56e4b092b266efeb6b?f=__disk__41%2Fed%2F5f%2F41ed5fe363c93b848d5b126bf8353631cdc5ca80',
  bytes: 488231965,
  licence:
    'public domain (U.S. Geological Survey data release); cite Jacobi, J.D., Price, J.P., Fortini, L.B., Gon III, S.M., and Berkowitz, P., ' +
    '2017, Carbon Assessment of Hawaii: U.S. Geological Survey data release, doi:10.5066/F7DB80B9',
  note:
    'land cover from imagery of about 2007–2012, built on the HI-GAP map with NOAA C-CAP (2005) land use and bare ground, Census ' +
    'roads, and corrections against very-high-resolution imagery; 48 classes',
}

export const layerPaths = (dir) => ({
  vectors: join(dir, 'vectors'),
  cah: join(dir, 'cah'),
  cahTif: join(dir, 'cah', 'CAH_LandCover.tif'),
  cahVat: join(dir, 'cah', 'CAH_LandCover.tif.vat.dbf'),
})

const vectorFile = (dir, key, off) => join(layerPaths(dir).vectors, `${key}-page-${String(off).padStart(6, '0')}.geojson`)
const vectorMeta = (dir, key) => join(layerPaths(dir).vectors, `${key}-layer.json`)

/** Fetch one vector layer's description and every feature, paged. */
export function downloadVector(ledger, dir, key, log) {
  const L = VECTORS[key]
  mkdirSync(layerPaths(dir).vectors, { recursive: true })
  const meta = fetchTo(ledger, `${L.service}?f=json`, vectorMeta(dir, key), { force: true })
  if (!meta.ok) throw new Error(`${key}: HTTP ${meta.status} for the layer description`)
  const where = encodeURIComponent(L.where || '1=1')
  const count = JSON.parse(fetchText(`${L.service}/query?where=${where}&returnCountOnly=true&f=json`)).count
  if (!(count > 0)) throw new Error(`${key}: no features`)
  for (const f of readdirSync(layerPaths(dir).vectors)) if (f.startsWith(`${key}-page-`)) rmSync(join(layerPaths(dir).vectors, f))
  const page = L.page || 1000
  const layerJson = JSON.parse(readFileSync(vectorMeta(dir, key), 'utf8'))
  const oid = L.order || layerJson.objectIdField || layerJson.fields?.find((f) => f.type === 'esriFieldTypeOID')?.name || 'objectid'
  for (let off = 0; off < count; off += page) {
    const url =
      `${L.service}/query?where=${where}&outFields=${encodeURIComponent(L.fields || '*')}&outSR=4326&f=geojson` +
      `&orderByFields=${oid}&resultOffset=${off}&resultRecordCount=${page}&geometryPrecision=6` +
      (L.offset ? `&maxAllowableOffset=${L.offset}` : '')
    const r = fetchTo(ledger, url, vectorFile(dir, key, off), { force: true, maxTime: 600 })
    if (!r.ok) throw new Error(`${key} page ${off}: HTTP ${r.status}`)
  }
  const n = readVector(dir, key).features.length
  if (n !== count) throw new Error(`${key}: got ${n} features, server count ${count}`)
  log(`  ${key}: ${count} features`)
  return count
}

/** All pages of a downloaded vector layer as one FeatureCollection, plus the layer JSON. */
export function readVector(dir, key) {
  const d = layerPaths(dir).vectors
  const files = existsSync(d) ? readdirSync(d).filter((f) => f.startsWith(`${key}-page-`)).sort() : []
  if (!files.length) throw new Error(`${key}: not downloaded (run --download)`)
  const features = []
  for (const f of files) {
    const fc = JSON.parse(readFileSync(join(d, f), 'utf8'))
    if (fc.type !== 'FeatureCollection' || !Array.isArray(fc.features)) throw new Error(`${f}: not a FeatureCollection`)
    for (const ft of fc.features) if (ft.geometry) features.push(ft)
  }
  const layer = JSON.parse(readFileSync(vectorMeta(dir, key), 'utf8'))
  return { type: 'FeatureCollection', features, layer, pages: files.map((f) => join(d, f)) }
}

/** The CAH raster and its value attribute table. */
export function downloadCah(ledger, dir, log) {
  const p = layerPaths(dir)
  mkdirSync(p.cah, { recursive: true })
  const r = fetchTo(ledger, CAH.tif, p.cahTif, { maxTime: 3600 })
  if (!r.ok) throw new Error(`CAH land cover: HTTP ${r.status}`)
  const v = fetchTo(ledger, CAH.vat, p.cahVat)
  if (!v.ok) throw new Error(`CAH value table: HTTP ${v.status}`)
  log(`  cah: ${r.cached ? 'cached' : 'fetched'} (${(ledger.get(p.cahTif).bytes / 1e6).toFixed(0)} MB)`)
}

export function downloadAll(ledger, dir, log) {
  log('land cover (USGS Carbon Assessment of Hawaiʻi):')
  downloadCah(ledger, dir, log)
  log('vector layers:')
  for (const key of Object.keys(VECTORS)) downloadVector(ledger, dir, key, log)
}

/** A source entry for the manifest, with the date the ledger recorded. */
export function vectorSource(ledger, dir, key, extra = {}) {
  const L = VECTORS[key]
  const layer = JSON.parse(readFileSync(vectorMeta(dir, key), 'utf8'))
  const fetched = ledger.get(vectorMeta(dir, key))?.fetched
  return {
    id: L.id,
    title: L.title,
    url: L.service,
    ...(L.where ? { query: L.where } : {}),
    fetched,
    licence: L.licence,
    ...(layer.copyrightText ? { credit: String(layer.copyrightText).replace(/\s+/g, ' ').trim() } : {}),
    ...(L.metadata ? { metadata: L.metadata } : {}),
    note: L.note,
    ...extra,
  }
}

export function cahSource(ledger, dir, extra = {}) {
  return {
    id: CAH.id,
    title: CAH.title,
    url: CAH.item,
    fetched: ledger.get(layerPaths(dir).cahTif)?.fetched,
    licence: CAH.licence,
    note: CAH.note,
    ...extra,
  }
}

/** Read the CAH value attribute table (a dBASE file) into {value: {detailed, general, ...}}. */
export function readCahClasses(dir) {
  const f = readFileSync(layerPaths(dir).cahVat)
  const n = f.readUInt32LE(4)
  const headerLen = f.readUInt16LE(8)
  const recLen = f.readUInt16LE(10)
  const fields = []
  for (let p = 32; f[p] !== 0x0d; p += 32) {
    fields.push({ name: f.toString('latin1', p, p + 11).replace(/\0.*$/, ''), len: f[p + 16] })
  }
  const out = {}
  for (let i = 0; i < n; i++) {
    let o = headerLen + i * recLen + 1
    const rec = {}
    for (const fd of fields) {
      rec[fd.name] = f.toString('latin1', o, o + fd.len).trim()
      o += fd.len
    }
    out[Number(rec.Value)] = { detailed: rec.Detailed_L, general: rec.General_LC, major: rec.Major_LC_U, moisture: rec.Moisture_Z }
  }
  return out
}
