// Where the crop classes' data come from (DATA.md, "Crops, on the era
// layers"), and how to fetch them into the downloads directory. Downloads are
// untrusted data: nothing here executes them, the bake only parses them.
//
// The field layers the era layers read (the Traditional Agriculture zones,
// the geologic units, the Land Commission Awards, the 1900 cane and
// pineapple, the 2020 agricultural baseline) are fetched exactly as
// layers-sources.mjs fetches them, so the loʻi, dryland and cane terms are
// the cultivation masks' own; to them this adds the 1978–80 Agricultural Land
// Use Maps (grazing and coffee, read back to 1896) and the golf courses, and
// the CAH land cover for its developed open space (lawns). Everything goes
// through fetchTo, so the ledger records each URL, date, size and SHA-256.
import { existsSync } from 'node:fs'
import { CAH, VECTORS, cahSource, downloadCah, downloadVector, layerPaths, readVector, vectorSource } from './layers-sources.mjs'

export { readVector, layerPaths, CAH }

const STATE_GIS = 'https://geodata.hawaii.gov/arcgis/rest/services'
const STATE_LICENCE = 'State of Hawaiʻi Statewide GIS Program open data; no warranty of positional or thematic accuracy'

/** The era layers' field inputs this bake reads, by their key in layers-sources.mjs. */
export const FIELD_KEYS = ['tradAg', 'geology', 'lca', 'sugar1900', 'pine1900', 'ag2020']

/** Layers only the crops read. */
export const CROP_VECTORS = {
  alum: {
    id: 'hawaii-gis-alum-1980',
    title: 'State of Hawaiʻi GIS, Agricultural Land Use Maps (ALUM), 1978–80, LandUseLandCover MapServer layer 5',
    service: `${STATE_GIS}/LandUseLandCover/MapServer/5`,
    metadata: 'https://files.hawaii.gov/dbedt/op/gis/data/alum.pdf',
    licence: STATE_LICENCE,
    note:
      'the State Department of Agriculture’s 1:24,000 maps of 1978–80, digitised by the Office of State Planning; COMMODITY ' +
      'codes A-1 grazing, A-2 dairy, F field crops, O orchards (O-5 coffee), P pineapple, S sugarcane, W wetlands; Kauaʻi, ' +
      'Oʻahu, Maui, Molokaʻi, Lānaʻi and Hawaiʻi only (not Niʻihau or Kahoʻolawe)',
    fields: 'objectid,commodity',
    offset: 0.00003,
  },
  golf: {
    id: 'hawaii-gis-golf-courses',
    title: 'State of Hawaiʻi GIS, Golf Courses (Infrastructure MapServer layer 14), points',
    service: `${STATE_GIS}/Infrastructure/MapServer/14`,
    metadata: 'https://files.hawaii.gov/dbedt/op/gis/data/golf_courses.pdf',
    licence: `${STATE_LICENCE}; credit the Hawaii State Golf Association`,
    note: 'locations of golf courses as of August 2023 (before the Maui fires), from the Hawaii State Golf Association’s list, geocoded and moved by eye on imagery; points, with the number of holes',
    fields: 'objectid,name,island,type,numholes',
  },
}

/** Fetch every input: the CAH land cover, the field layers, and the crops' own. */
export function downloadAll(ledger, dir, log) {
  log('land cover (USGS Carbon Assessment of Hawaiʻi), for developed open space:')
  downloadCah(ledger, dir, log)
  log('the era layers’ field inputs:')
  for (const key of FIELD_KEYS) downloadVector(ledger, dir, key, log)
  log('agricultural land use 1978–80 and golf courses:')
  for (const key of Object.keys(CROP_VECTORS)) downloadVector(ledger, dir, key, log, CROP_VECTORS)
}

export const downloaded = (dir) =>
  existsSync(layerPaths(dir).cahTif) && [...FIELD_KEYS, ...Object.keys(CROP_VECTORS)].every((k) => existsSync(`${layerPaths(dir).vectors}/${k}-layer.json`))

/** A manifest source entry for any layer this bake read. */
export function sourceOf(ledger, dir, key, extra = {}) {
  if (key === 'cah') return cahSource(ledger, dir, extra)
  return CROP_VECTORS[key] ? vectorSource(ledger, dir, key, extra, CROP_VECTORS) : vectorSource(ledger, dir, key, extra)
}

/** Every key the bake reads, with its definition (for the check: ids and titles). */
export const ALL_KEYS = [...FIELD_KEYS, ...Object.keys(CROP_VECTORS)]
export const definitionOf = (key) => CROP_VECTORS[key] || VECTORS[key]

/** The CAH value table (layers-sources.mjs reads it; re-exported for the class check). */
export { readCahClasses } from './layers-sources.mjs'
