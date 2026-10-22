// Where the patch bake's data comes from (DATA.md, "Patches, on any pack"),
// and how to fetch it into the downloads directory. Downloads are untrusted
// data: nothing here executes them, the bake only parses them.
//
// - NOAA's 1/9 arc-second CUDEM, the tiles under the harbour works: the sea
//   floor the dredged ground is found on (flat floors and straight walls well
//   below the reef flat round them). The district bake reads the same tiles.
// - The State geologic map's fill unit over the whole of Oʻahu, as the
//   district bake reads it for its own box: where the made ground is.
// - NOAA ENC Direct's dredged areas at harbour scale: today's maintained
//   channels. Ground inside them counts as cut wherever it lies (the test
//   for natural deep water would otherwise take a channel's run across a
//   bar for the fore-reef), and the bake reports how much of them the raise
//   patches cover.
// - The State's georeferenced Government Survey sheet of 1881 and the 1938
//   map, exported over each harbour, for `--sheets` only: the passages, bars,
//   zones and old shores in patch-works.mjs were traced on them, and the
//   sheets draw those shapes back over them so a reader can see the tracing.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fetchTo } from './fetch.mjs'
import { CUDEM, FILL, SURVEY_MAPS } from './district-sources.mjs'
import { bboxOf } from './geo.mjs'
import { RAISE_GROUPS } from './patch-works.mjs'

export { CUDEM, FILL }

export const ENC = {
  id: 'noaa-enc-direct-dredged-areas',
  title: 'NOAA Office of Coast Survey, ENC Direct to GIS, harbour-scale Dredged_Area (DRGARE) polygons over Oʻahu',
  service: 'https://encdirect.noaa.gov/arcgis/rest/services/encdirect/enc_harbour/MapServer/228',
  licence: 'public domain (NOAA); not for navigation',
  note: 'today’s maintained channels and basins with their charted depths: ground inside them counts as cut, and the raise patches are checked against them',
}

export const MAPS = {
  1881: SURVEY_MAPS[1881],
  1899: SURVEY_MAPS[1899],
  1938: SURVEY_MAPS[1938],
}

/** The island the patches cover, for the vector queries (the oahu pack's box). */
export const OAHU_BOX = [-158.31, 21.23, -157.62, 21.74]

// Tracing sheets: [west, south, east, north] and degrees a pixel (square in
// degrees: the ImageServer widens a lon/lat export to make its pixels square).
export const SHEETS = [
  { id: 'pearl-entrance', bbox: [-157.975, 21.295, -157.95, 21.335], px: 0.00003, years: [1881, 1899] },
  { id: 'pearl-lochs', bbox: [-157.97, 21.348, -157.93, 21.375], px: 0.00004, years: [1881, 1938] },
  { id: 'ahua-keehi', bbox: [-157.965, 21.295, -157.885, 21.34], px: 0.00005, years: [1881, 1938] },
  { id: 'honolulu-harbour', bbox: [-157.895, 21.285, -157.855, 21.325], px: 0.00003, years: [1881, 1938] },
  { id: 'kewalo-waikiki', bbox: [-157.865, 21.266, -157.81, 21.3], px: 0.00004, years: [1881, 1938] },
]

export const patchPaths = (dir) => ({
  cudemList: join(dir, 'cudem', 'urllist.txt'),
  cudemTile: (name) => join(dir, 'cudem', `${name}.tif`),
  fill: join(dir, 'vectors', 'fill-oahu.geojson'),
  fillLayer: join(dir, 'vectors', 'fill-layer.json'),
  enc: join(dir, 'enc', 'dredged-harbour.geojson'),
  sheet: (id, year) => join(dir, 'maps', `${id}-${year}.png`),
  sheetInfo: (id, year) => join(dir, 'maps', `${id}-${year}.json`),
})

/** The box every raise group's zones fall in, padded, for picking CUDEM tiles. */
export function raiseBox(pad = 0.01) {
  const b = [Infinity, Infinity, -Infinity, -Infinity]
  for (const g of RAISE_GROUPS) if (!g.packSea) for (const z of g.zones) bboxOf(z.geometry, b)
  return [b[0] - pad, b[1] - pad, b[2] + pad, b[3] + pad]
}

/** CUDEM tiles (0.25° squares named for their north-west corner) that meet a box. */
export function cudemTiles(listFile, [w, s, e, n]) {
  const out = []
  for (const url of readFileSync(listFile, 'utf8').split(/\s+/)) {
    const m = /\/tiles\/(ncei19_n(\d+)x(\d+)_w(\d+)x(\d+)_\w+)\.tif$/.exec(url)
    if (!m) continue
    const north = Number(m[2]) + Number(m[3]) / 100
    const west = -(Number(m[4]) + Number(m[5]) / 100)
    if (west >= e || west + 0.25 <= w || north <= s || north - 0.25 >= n) continue
    out.push({ name: m[1], url, bounds: [west, north - 0.25, west + 0.25, north] })
  }
  return out
}

const query = (service, where, box) =>
  `${service}/query?where=${encodeURIComponent(where)}&geometry=${box.map((v) => v.toFixed(5)).join(',')}` +
  '&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&outSR=4326&geometryPrecision=7&f=geojson'

/** A lon/lat export of a historic map with square-degree pixels: the request, and the extent it covers. */
export function sheetRequest(sheet, year) {
  const [w, s, e, n] = sheet.bbox
  const W = Math.round((e - w) / sheet.px)
  const H = Math.round((n - s) / sheet.px)
  const extent = [w, n - H * sheet.px, w + W * sheet.px, n]
  const url =
    `${MAPS[year].service}/exportImage?bbox=${extent.map((v) => v.toFixed(6)).join(',')}&bboxSR=4326&imageSR=4326` +
    `&size=${W},${H}&format=png&interpolation=RSP_BilinearInterpolation&f=image`
  return { url, extent, W, H }
}

export function downloadPatches(ledger, dir, log) {
  const p = patchPaths(dir)
  mkdirSync(dir, { recursive: true })

  log('sea floor (NOAA CUDEM):')
  const list = fetchTo(ledger, CUDEM.list, p.cudemList, { force: true })
  if (!list.ok) throw new Error(`CUDEM tile list: HTTP ${list.status}`)
  for (const t of cudemTiles(p.cudemList, raiseBox())) {
    const r = fetchTo(ledger, t.url, p.cudemTile(t.name), { maxTime: 1800 })
    if (!r.ok) throw new Error(`CUDEM ${t.name}: HTTP ${r.status}`)
    log(`  ${t.name} ${r.cached ? 'cached' : 'fetched'}`)
  }

  log('fill (State geologic map), Oʻahu:')
  const meta = fetchTo(ledger, `${FILL.service}?f=json`, p.fillLayer, { force: true })
  if (!meta.ok) throw new Error(`geologic units: HTTP ${meta.status}`)
  const fill = fetchTo(ledger, query(FILL.service, FILL.where, OAHU_BOX), p.fill, { force: true })
  if (!fill.ok) throw new Error(`fill polygons: HTTP ${fill.status}`)
  const fc = JSON.parse(readFileSync(p.fill, 'utf8'))
  if (fc.type !== 'FeatureCollection' || !fc.features?.length) throw new Error('fill polygons: no features')
  log(`  ${fc.features.length} polygons`)

  log('dredged areas (NOAA ENC Direct):')
  const enc = fetchTo(ledger, query(ENC.service, '1=1', OAHU_BOX), p.enc, { force: true })
  if (!enc.ok) log(`  HTTP ${enc.status}: cut ground will be found on the CUDEM alone`)
  else log(`  ${JSON.parse(readFileSync(p.enc, 'utf8')).features?.length ?? 0} polygons`)

  log('historic maps for the tracing sheets (State GIS):')
  for (const sh of SHEETS) {
    for (const year of sh.years) {
      const req = sheetRequest(sh, year)
      const r = fetchTo(ledger, req.url, p.sheet(sh.id, year), { force: !existsSync(p.sheet(sh.id, year)), maxTime: 600 })
      if (!r.ok) throw new Error(`${year} map over ${sh.id}: HTTP ${r.status}`)
      writeFileSync(p.sheetInfo(sh.id, year), JSON.stringify({ sheet: sh.id, year, ...req }) + '\n')
      log(`  ${sh.id} ${year}: ${req.W}x${req.H} px`)
    }
  }
}
