// Where the towns' dated streets come from (DATA.md, "Streets, dated"), and
// how to fetch them into the downloads directory. Downloads are untrusted
// data: nothing here executes them, the bake only parses them.
//
// Two kinds of input per town:
//
// - today's street centrelines, from each county's own layer as the State GIS
//   serves it (Transportation MapServer layers 3–6), cut to the town's box;
// - the dated sheets the State GIS serves georeferenced (its Historic_Maps and
//   SoH_Maps image services), exported over the same box at SHEET_PIXEL metres
//   in lon/lat, with their alpha, so the bake can tell where a sheet has no
//   ground at all. Each street is then looked for on each sheet
//   (streets-bake.mjs).
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fetchTo } from './fetch.mjs'

const TRANSPORT = 'https://geodata.hawaii.gov/arcgis/rest/services/Transportation/MapServer'
const STATE_TERMS = 'State of Hawaiʻi Statewide GIS Program open data (no restrictions stated; credit the Statewide GIS Program and the county)'

// The centreline layers. `keep(attrs)` says which segments are streets: named
// ones (a county's unnamed segments are driveways, parking aisles and ramps),
// and none of the freeways and their ramps, which the works draw (DATA.md
// "Works, dated"). `arterial(attrs)` picks out the through roads, drawn wider.
const named = (a) => typeof a.fullname === 'string' && a.fullname.trim().length > 0
export const CENTRELINES = {
  oahu: {
    id: 'state-gis-oahu-roads',
    service: `${TRANSPORT}/3`,
    fields: 'objectid,fullname,street_cla',
    asOf: 2024,
    // street_cla: 2 freeways, 6 their ramps, 5 jeep trails; 8 the highways and main roads
    keep: (a) => named(a) && ![2, 5, 6].includes(a.street_cla) && !/\bFWY\b|\bRAMP\b|\bEXIT\b/.test(a.fullname),
    arterial: (a) => a.street_cla === 8,
    note: 'Street Centerlines for the Island of Oahu as of August 2024, from the City and County of Honolulu’s Land Information System',
  },
  kauai: {
    id: 'state-gis-kauai-roads',
    service: `${TRANSPORT}/4`,
    fields: 'objectid,fullname,roadclass',
    asOf: 2023,
    keep: (a) => named(a),
    arterial: (a) => /\bHWY\b/.test(a.fullname),
    note: 'Road Centerlines for the island of Kauaʻi as of November 2023, from the County of Kauaʻi',
  },
  maui: {
    id: 'state-gis-maui-roads',
    service: `${TRANSPORT}/5`,
    fields: 'objectid,fullname,mtfcc',
    asOf: 2025,
    keep: (a) => named(a) && !['S1630', 'S1640', 'S1780'].includes(a.mtfcc),
    arterial: (a) => /\bHWY\b/.test(a.fullname) || ['S1100', 'S1200'].includes(a.mtfcc),
    note: 'Road Centerline dataset of Maui County as of April 2025, from the County of Maui',
  },
  hawaii: {
    id: 'state-gis-hawaii-roads',
    service: `${TRANSPORT}/6`,
    fields: 'objectid,fullname,class',
    asOf: 2024,
    keep: (a) => named(a),
    arterial: (a) => /^A3/.test(a.class || '') || /\bHWY\b/.test(a.fullname),
    note: 'County of Hawaiʻi Centerlines as of February 2024, from the County’s Planning Department',
  },
}
// Molokaʻi is Maui County's
CENTRELINES.molokai = CENTRELINES.maui

const HM = 'https://geodata.hawaii.gov/arcgis/rest/services/Historic_Maps'
const SM = 'https://geodata.hawaii.gov/arcgis/rest/services/SoH_Maps'

// The sheets, by island, oldest first. `old`: a sheet of the whole island at
// 1:60,000 or so, its streets drawn small and its georeferencing loose (the
// bake searches further for its shift and needs it on later sheets too).
// `lock`: the raster of a mosaic to read (islands_1900s holds one sheet per
// island; hawaii_topos_1911 one per quadrangle, of different years).
// `source`: the id in sources.json.
const S2000 = { year: 2000, service: `${SM}/USGS_topos_2000/ImageServer` }
export const SHEETS = {
  oahu: [
    { year: 1881, service: `${HM}/Oahu_1881/ImageServer`, source: 'hgs-1881-oahu', old: true },
    { year: 1899, service: `${HM}/Oahu_1899/ImageServer`, source: 'hgs-1899-oahu', old: true },
    { year: 1902, service: `${HM}/islands_1900s/ImageServer`, lock: 8, source: 'hgs-1902-oahu-donn', old: true },
    // (a grey scan, its contours a lighter grey than its streets' lines: only the darkest is ink)
    { year: 1927, service: `${SM}/oahu_topo_1927/ImageServer`, source: 'usgs-topo-1927-oahu', ink: 0.45 },
    { year: 1938, service: `${HM}/Oahu_1938/ImageServer`, source: 'state-gis-oahu-1938' },
    { year: 1943, service: `${SM}/Oahu_1943/ImageServer`, source: 'state-gis-oahu-1943' },
    { ...S2000, source: 'usgs-topo-2000-oahu' },
  ],
  maui: [
    { year: 1903, service: `${HM}/islands_1900s/ImageServer`, lock: 5, source: 'hgs-1903-maui-donn', old: true },
    // (the quadrangles of 1910 to 1924 on the other islands are scanned light: their lines are ink at a lighter grey than most sheets')
    { year: 1924, service: `${SM}/maui_topo_1924/ImageServer`, source: 'usgs-topo-1924-maui', ink: 0.8 },
    { ...S2000, source: 'usgs-topo-2000-islands' },
  ],
  molokai: [
    { year: 1897, service: `${HM}/islands_1900s/ImageServer`, lock: 6, source: 'hgs-1897-molokai-dodge', old: true },
    { year: 1922, service: `${SM}/molokai_topo_1922/ImageServer`, source: 'usgs-topo-1922-molokai', ink: 0.8 },
    { ...S2000, source: 'usgs-topo-2000-islands' },
  ],
  hawaii: [
    { year: 1901, service: `${HM}/islands_1900s/ImageServer`, lock: 1, source: 'hgs-1901-hawaii-donn', old: true },
    // (the quadrangle's own year, by town: TOWNS sets it)
    { year: null, service: `${SM}/hawaii_topos_1911/ImageServer`, source: 'usgs-topo-1911-hawaii', ink: 0.8 },
    { ...S2000, source: 'usgs-topo-2000-islands' },
  ],
  kauai: [
    { year: 1903, service: `${HM}/islands_1900s/ImageServer`, lock: 3, source: 'hgs-1903-kauai-donn', old: true },
    { year: 1910, service: `${SM}/kauai_topo_1910/ImageServer`, source: 'usgs-topo-1910-kauai', ink: 0.8 },
    { year: 1963, service: `${SM}/kauai_topo_1963/ImageServer`, source: 'usgs-topo-1963-kauai' },
    { ...S2000, source: 'usgs-topo-2000-islands' },
  ],
}

// The towns: the centres the settlement layers make towns of (layers
// manifest, methods.kingdom.settlement.towns) and the gazetteer's towns
// beside them, each a box over its streets of today. A box may overlap no
// other; a street is the town's whose box holds its middle.
export const TOWNS = [
  { id: 'honolulu', name: 'Honolulu', island: 'oahu', bounds: [-157.935, 21.255, -157.765, 21.37] },
  { id: 'kailua-oahu', name: 'Kailua', island: 'oahu', bounds: [-157.78, 21.37, -157.7, 21.425] },
  { id: 'kaneohe', name: 'Kāneʻohe', island: 'oahu', bounds: [-157.835, 21.385, -157.78, 21.44] },
  { id: 'hilo', name: 'Hilo', island: 'hawaii', bounds: [-155.115, 19.68, -155.045, 19.74], quad: { lock: 68, year: 1912 } },
  { id: 'kailua-kona', name: 'Kailua', island: 'hawaii', bounds: [-156.0, 19.62, -155.965, 19.66], quad: { lock: 15, year: 1924 } },
  // (Lahaina lies across the neat line of the Mala and Launiupoko sheets of 1924, Wailuku and Kahului across the Wailuku and Pāʻia sheets':
  // each read inside its own neat line, which the State's mosaic overlays with the next sheet's margin)
  { id: 'lahaina', name: 'Lahaina', island: 'maui', bounds: [-156.69, 20.855, -156.66, 20.895], quads: { 1924: [{ lock: 10, neat: [-156.75, 20.875, -156.625, 21] }, { lock: 7, neat: [-156.75, 20.75, -156.625, 20.875] }] } },
  { id: 'wailuku-kahului', name: 'Wailuku and Kahului', island: 'maui', bounds: [-156.52, 20.865, -156.44, 20.905], quads: { 1924: [{ lock: 14, neat: [-156.625, 20.875, -156.5, 21] }, { lock: 12, neat: [-156.5, 20.875, -156.375, 21] }] } },
  { id: 'kaunakakai', name: 'Kaunakakai', island: 'molokai', bounds: [-157.03, 21.08, -157.005, 21.095] },
  { id: 'lihue', name: 'Līhuʻe', island: 'kauai', bounds: [-159.385, 21.955, -159.345, 21.995] },
  { id: 'koloa', name: 'Kōloa', island: 'kauai', bounds: [-159.475, 21.895, -159.455, 21.915] },
  { id: 'hanapepe', name: 'Hanapēpē', island: 'kauai', bounds: [-159.6, 21.9, -159.578, 21.92] },
  { id: 'waimea-kauai', name: 'Waimea', island: 'kauai', bounds: [-159.68, 21.945, -159.655, 21.97] },
]

/** A town's sheets, oldest first, with their years settled (a Hawaiʻi town's quadrangle by its own year). */
export function townSheets(town) {
  return SHEETS[town.island].map((s) => {
    if (s.year !== null) return town.quads?.[s.year] ? { ...s, quads: town.quads[s.year] } : s
    return { ...s, year: town.quad.year, lock: town.quad.lock }
  })
}

// the sheets are exported at this many metres a pixel, over the box and this margin (metres)
export const SHEET_PIXEL = 2.5
export const SHEET_MARGIN = 500
// and in tiles of at most this many pixels a side (the services cap an export at 4100)
const TILE_PX = 3600

const KX = (lat) => Math.cos((lat * Math.PI) / 180) * 111320
const KY = 110574

/** The box and margin as a grid of SHEET_PIXEL metres in lon/lat: its bounds, size and tiles. */
export function sheetGrid(town) {
  const [w, s, e, n] = town.bounds
  const lat = (s + n) / 2
  const dLon = SHEET_MARGIN / KX(lat)
  const dLat = SHEET_MARGIN / KY
  const b = [w - dLon, s - dLat, e + dLon, n + dLat]
  const W = Math.ceil(((b[2] - b[0]) * KX(lat)) / SHEET_PIXEL)
  const H = Math.ceil(((b[3] - b[1]) * KY) / SHEET_PIXEL)
  const tiles = []
  for (let ty = 0; ty < H; ty += TILE_PX) {
    for (let tx = 0; tx < W; tx += TILE_PX) {
      const tw = Math.min(TILE_PX, W - tx)
      const th = Math.min(TILE_PX, H - ty)
      const tb = [b[0] + ((b[2] - b[0]) * tx) / W, b[3] - ((b[3] - b[1]) * (ty + th)) / H, b[0] + ((b[2] - b[0]) * (tx + tw)) / W, b[3] - ((b[3] - b[1]) * ty) / H]
      tiles.push({ x: tx, y: ty, w: tw, h: th, bounds: tb })
    }
  }
  return { bounds: b, W, H, lat, tiles }
}

export function townPaths(dir, town) {
  return {
    centrelines: (page) => join(dir, town.id, `centrelines-${page}.geojson`),
    sheet: (year, k, lock = null) => join(dir, town.id, `sheet-${year}-${k}${lock ? `-r${lock}` : ''}.png`),
  }
}

/** Today's centrelines over the town's box, a page at a time; returns the files. */
export function downloadCentrelines(ledger, dir, town, log) {
  const L = CENTRELINES[town.island]
  const p = townPaths(dir, town)
  const files = []
  for (let page = 0; ; page++) {
    const url =
      `${L.service}/query?where=1%3D1&geometry=${town.bounds.join(',')}&geometryType=esriGeometryEnvelope&inSR=4326` +
      `&spatialRel=esriSpatialRelIntersects&outFields=${L.fields}&outSR=4326&geometryPrecision=7&orderByFields=objectid` +
      `&resultOffset=${page * 1000}&resultRecordCount=1000&f=geojson`
    const r = fetchTo(ledger, url, p.centrelines(page))
    if (!r.ok) throw new Error(`${town.id} centrelines: HTTP ${r.status}`)
    const fc = JSON.parse(readFileSync(p.centrelines(page), 'utf8'))
    if (fc.type !== 'FeatureCollection') throw new Error(`${town.id} centrelines: not a FeatureCollection`)
    files.push(p.centrelines(page))
    if (fc.features.length < 1000) break
  }
  log(`  ${town.id}: centrelines in ${files.length} page(s)`)
  return files
}

/** Each sheet over the town's box, in tiles, as PNG with its alpha. */
export function downloadSheets(ledger, dir, town, log) {
  const g = sheetGrid(town)
  const p = townPaths(dir, town)
  for (const s of townSheets(town)) {
    g.tiles.forEach((t, k) => {
      // (a sheet read quadrangle by quadrangle: each locked, a file each)
      for (const lock of s.quads ? s.quads.map((q) => q.lock) : [null]) {
        let url =
          `${s.service}/exportImage?bbox=${t.bounds.map((v) => v.toFixed(7)).join(',')}&bboxSR=4326&imageSR=4326` +
          `&size=${t.w},${t.h}&format=png32&interpolation=RSP_NearestNeighbor&f=image`
        const lk = lock ?? s.lock
        if (lk) url += `&mosaicRule=${encodeURIComponent(JSON.stringify({ mosaicMethod: 'esriMosaicLockRaster', lockRasterIds: [lk] }))}`
        const r = fetchTo(ledger, url, p.sheet(s.year, k, lock), { maxTime: 900 })
        if (!r.ok) throw new Error(`${town.id} sheet ${s.year} tile ${k}: HTTP ${r.status}`)
      }
    })
    log(`  ${town.id}: sheet ${s.year} in ${g.tiles.length} tile(s), ${g.W}×${g.H} px`)
  }
}

export function downloaded(dir, town) {
  const p = townPaths(dir, town)
  return existsSync(p.centrelines(0))
}

/** The layer's description for the manifest. */
export function centrelineSource(ledger, dir, island) {
  const L = CENTRELINES[island]
  const files = []
  for (const t of TOWNS.filter((q) => q.island === island)) for (let page = 0; existsSync(townPaths(dir, t).centrelines(page)); page++) files.push(townPaths(dir, t).centrelines(page))
  const fetched = files.map((f) => ledger.get(f)?.fetched).filter(Boolean).sort().pop() || null
  return { id: L.id, url: L.service, fields: L.fields, asOf: L.asOf, licence: STATE_TERMS, fetched, note: L.note }
}

export { STATE_TERMS }
