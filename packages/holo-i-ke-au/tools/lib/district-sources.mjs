// Where a district pack's inputs come from (DATA.md, "District packs"), and
// how to fetch them into the downloads directory. Downloads are untrusted
// data: nothing here executes them, the bake only parses them.
//
// A district is a box on one island, baked finer than its island pack from
// the best open elevation there is. For Nuʻuanu that is the 2022–23 Oʻahu
// lidar, published by the USGS at its original 0.5 m as 500 m GeoTIFF tiles
// in UTM zone 4; the box needs about 560 of them (about 1.4 GB). The sea
// floor comes from NOAA's 1/9 arc-second topobathymetric DEM, which holds the
// reef flats and the dredged harbour; GMRT, as the island packs use, stands
// by for any gap in it. The rest is what the island bake and the layers bake
// already read: the Rainfall Atlas, the State geologic map (here only its
// fill unit), and the Government Survey maps of 1881 and 1899 as the State
// serves them, georeferenced, from its Historic_Maps image services; plus
// the State's stream lines, to check the routed streams against.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fetchTo } from './fetch.mjs'
import { fetchManyTo } from './fetch-many.mjs'
import { packGrid } from './geo.mjs'
import { utm4 } from './layers-raster.mjs'
import { VECTORS } from './layers-sources.mjs'
import { BATHY, downloadRain, gmrtUrl } from './sources.mjs'

// ---------------------------------------------------------------------------
// The districts

export const DISTRICT_LONG_SIDE = 2048

export const DISTRICTS = {
  nuuanu: {
    id: 'nuuanu',
    name: 'Nuʻuanu',
    island: 'oahu',
    // West: Kalihi Kai and the east side of Keʻehi lagoon (Kalihi's ahupuaʻa
    // reaches 157.891 W), so Sand Island and Mokauea are whole. East: past
    // Mānoa's east ridge and 1.4 km past the Pali lookout (157.793 W). South:
    // the reef flat off Kakaʻako and Waikīkī and a little deep water beyond
    // it. North: 1.6 km past the lookout (21.367 N), over the windward drop;
    // Kalihi's head (21.385 N) is cut by a few hundred metres. About 12.3 by
    // 12.4 km.
    bbox: [-157.897, 21.269, -157.779, 21.381],
    longSide: DISTRICT_LONG_SIDE,
    // Cut through what the bare earth keeps across the trunks: the reservoir
    // in upper Nuʻuanu and its dam, and the crossings of the lower channels.
    // Found by --find-breaches on a bake without them (each runs from the
    // lowest texel of the pond on the trunk, over the spill, to the first
    // texel below it) and carved in this order.
    breaches: [
      { name: 'Nuʻuanu Stream at 21.3576 N 157.8036 W', why: 'the reservoir in upper Nuʻuanu: its basin and dam stand in the bare earth, and the trunk ponded 4.8 m deep here', points: [[-157.80361, 21.357566], [-157.803842, 21.357457], [-157.804016, 21.357238], [-157.804074, 21.35702], [-157.804074, 21.356801], [-157.804132, 21.356582], [-157.80419, 21.356363], [-157.80419, 21.356145], [-157.80419, 21.355926], [-157.80419, 21.355707], [-157.80419, 21.355488], [-157.80419, 21.35527], [-157.80419, 21.355051], [-157.80419, 21.354832], [-157.80419, 21.354613], [-157.80419, 21.354395], [-157.804248, 21.354176], [-157.804422, 21.353957], [-157.804654, 21.353738], [-157.804886, 21.35352], [-157.805118, 21.353301], [-157.80535, 21.353082], [-157.805524, 21.352863], [-157.80564, 21.352645], [-157.805872, 21.352426], [-157.806104, 21.352207], [-157.806335, 21.351988], [-157.806567, 21.35177], [-157.806683, 21.351551], [-157.806625, 21.351332], [-157.806741, 21.351113], [-157.806973, 21.350895], [-157.807147, 21.350676], [-157.807321, 21.350457], [-157.807437, 21.350348]] },
      { name: 'Nuʻuanu Stream at 21.3546 N 157.8042 W', why: 'the reservoir in upper Nuʻuanu: its basin and dam stand in the bare earth, and the trunk ponded 4.3 m deep here', points: [[-157.80419, 21.354559], [-157.80419, 21.35434], [-157.804306, 21.354121], [-157.80448, 21.353902], [-157.804712, 21.353684], [-157.804944, 21.353465], [-157.805176, 21.353246], [-157.805408, 21.353027], [-157.805524, 21.352809], [-157.805698, 21.35259], [-157.80593, 21.352371], [-157.806162, 21.352152], [-157.806393, 21.351934], [-157.806567, 21.351715], [-157.806683, 21.351496], [-157.806625, 21.351277], [-157.806799, 21.351059], [-157.807031, 21.35084], [-157.807147, 21.350621], [-157.807379, 21.350402], [-157.807437, 21.350348]] },
      { name: 'Nuʻuanu Stream at 21.3535 N 157.8049 W', why: 'the reservoir in upper Nuʻuanu: its basin and dam stand in the bare earth, and the trunk ponded 2.5 m deep here', points: [[-157.804886, 21.35352], [-157.805118, 21.353301], [-157.80535, 21.353082], [-157.805524, 21.352863], [-157.80564, 21.352645], [-157.805814, 21.35248]] },
      { name: 'Nuʻuanu Stream at 21.3524 N 157.8059 W', why: 'the reservoir in upper Nuʻuanu: its basin and dam stand in the bare earth, and the trunk ponded 3.8 m deep here', points: [[-157.805872, 21.352426], [-157.806104, 21.352207], [-157.806335, 21.351988], [-157.806567, 21.35177], [-157.806683, 21.351551], [-157.806625, 21.351332], [-157.806741, 21.351113], [-157.806973, 21.350895], [-157.807147, 21.350676], [-157.807321, 21.350457], [-157.807379, 21.350402]] },
      { name: 'Nuʻuanu Stream at 21.3346 N 157.8332 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 3.8 m deep behind it', points: [[-157.833245, 21.334598], [-157.833476, 21.334434], [-157.833708, 21.334215], [-157.83394, 21.333996], [-157.833998, 21.333887]] },
      { name: 'Nuʻuanu Stream at 21.3339 N 157.8343 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.0 m deep behind it', points: [[-157.834288, 21.333887], [-157.83452, 21.333941], [-157.834752, 21.333996]] },
      { name: 'Nuʻuanu Stream at 21.3331 N 157.8385 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.3 m deep behind it', points: [[-157.838464, 21.333121], [-157.838696, 21.333066], [-157.838928, 21.333066], [-157.839044, 21.333012]] },
      { name: 'Nuʻuanu Stream at 21.3316 N 157.8410 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.0 m deep behind it', points: [[-157.841016, 21.331645], [-157.841248, 21.33148], [-157.84148, 21.331426], [-157.841712, 21.331371], [-157.841944, 21.331262], [-157.842118, 21.331043]] },
      { name: 'Nuʻuanu Stream at 21.3291 N 157.8432 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 3.0 m deep behind it', points: [[-157.843219, 21.329074], [-157.843451, 21.328855], [-157.843509, 21.328746]] },
      { name: 'Nuʻuanu Stream at 21.3209 N 157.8516 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 1.8 m deep behind it', points: [[-157.851571, 21.320871], [-157.851802, 21.320871], [-157.852034, 21.320816], [-157.85215, 21.320707]] },
      { name: 'Kapālama Stream at 21.3510 N 157.8360 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.0 m deep behind it', points: [[-157.83597, 21.351004], [-157.836202, 21.350895], [-157.83626, 21.35084]] },
      { name: 'Kapālama Stream at 21.3464 N 157.8488 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 1.8 m deep behind it', points: [[-157.848787, 21.346355], [-157.848961, 21.346301]] },
      { name: 'Kapālama Stream at 21.3394 N 157.8656 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.0 m deep behind it', points: [[-157.865605, 21.33941], [-157.865837, 21.339191], [-157.865895, 21.339082]] },
      { name: 'Kalihi Stream at 21.3649 N 157.8415 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.0 m deep behind it', points: [[-157.84148, 21.364895], [-157.841712, 21.364676], [-157.841828, 21.364566]] },
      { name: 'Kalihi Stream at 21.3372 N 157.8755 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.8 m deep behind it', points: [[-157.875522, 21.337168], [-157.875754, 21.337059], [-157.875986, 21.336949], [-157.876218, 21.336785], [-157.876276, 21.33673]] },
      { name: 'Kalihi Stream at 21.3369 N 157.8760 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.3 m deep behind it', points: [[-157.876044, 21.336895], [-157.876218, 21.336785]] },
      { name: 'Kalihi Stream at 21.3366 N 157.8765 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 4.5 m deep behind it', points: [[-157.87645, 21.336566], [-157.876682, 21.336348], [-157.876914, 21.336129], [-157.877146, 21.33591], [-157.877204, 21.335691], [-157.87732, 21.335582], [-157.877552, 21.335527], [-157.877784, 21.335527]] },
      { name: 'Kalihi Stream at 21.3355 N 157.8779 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.3 m deep behind it', points: [[-157.8779, 21.335527], [-157.878132, 21.335363], [-157.878364, 21.335145], [-157.878596, 21.33498], [-157.878828, 21.334926], [-157.879059, 21.334762], [-157.879291, 21.334543], [-157.879523, 21.334324], [-157.879755, 21.334215], [-157.879987, 21.334215], [-157.880219, 21.33427], [-157.880451, 21.334434], [-157.880683, 21.334652], [-157.880915, 21.334707], [-157.881147, 21.334598], [-157.881263, 21.334488]] },
      { name: 'Mānoa Stream at 21.3242 N 157.8020 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 3.0 m deep behind it', points: [[-157.801986, 21.324152], [-157.802102, 21.323934], [-157.802276, 21.323715], [-157.802392, 21.323496], [-157.802508, 21.323277], [-157.802334, 21.323059], [-157.802334, 21.32284], [-157.80245, 21.322621], [-157.802508, 21.322402], [-157.802682, 21.322184], [-157.80274, 21.321965], [-157.802798, 21.32191]] },
      { name: 'Mānoa Stream at 21.3236 N 157.8024 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.3 m deep behind it', points: [[-157.802392, 21.323551], [-157.802508, 21.323332], [-157.802334, 21.323113], [-157.802334, 21.322895], [-157.802392, 21.322676], [-157.802508, 21.322457], [-157.802566, 21.322293]] },
    ],
    // Trunks the check follows, by their names in the State's stream layer
    // (Mānoa is a tributary of the Ala Wai system there). Each starts on its
    // mapped main stem and must keep to the mapped lines down to tidewater.
    streams: [
      { name: 'Nuʻuanu Stream', stream: 'Nuuanu', trib: 'Nuuanu' },
      { name: 'Kapālama Stream', stream: 'Kapalama', trib: 'Kapalama' },
      { name: 'Kalihi Stream', stream: 'Kalihi', trib: 'Kalihi' },
      { name: 'Mānoa Stream', stream: 'Ala Wai', trib: 'Manoa' },
    ],
  },
}

export function districtGrid(d) {
  return packGrid(d.bbox, { padMetres: 0, longSide: d.longSide })
}

// ---------------------------------------------------------------------------
// Sources

export const LIDAR = {
  id: 'usgs-3dep-opr-hi-noaamauioahu-2020-b20',
  title: 'USGS 3D Elevation Program lidar HI_NOAAMauiOahu_2020_B20, bare-earth DEM at its original 0.5 m, 500 m GeoTIFF tiles (NAD83(PA11) / UTM zone 4N)',
  project: 'HI_NOAAMauiOahu_2020_B20',
  base: 'https://prd-tnm.s3.amazonaws.com/StagedProducts/Elevation/OPR/Projects/HI_NOAAMauiOahu_2020_B20',
  parts: ['HI_NOAAMauiOahu_1_B20', 'HI_NOAAMauiOahu_2_B20', 'HI_NOAAMauiOahu_3_B20'],
  licence: 'public domain (U.S. Geological Survey, 3D Elevation Program); collected for NOAA',
  cell: 0.5,
  tile: 500,
}

export const CUDEM = {
  id: 'noaa-ncei-cudem-ninth-hawaii',
  title: 'NOAA NCEI Continuously Updated DEM (CUDEM), 1/9 arc-second topobathymetric tiles, Hawaiʻi (Digital Coast 9428), WGS 84, mean sea level',
  base: 'https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/dem/NCEI_ninth_Topobathy_Hawaii_9428',
  list: 'https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/dem/NCEI_ninth_Topobathy_Hawaii_9428/urllist9428.txt',
  page: 'https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/dem/NCEI_ninth_Topobathy_Hawaii_9428/index.html',
  licence:
    'public domain (NOAA National Centers for Environmental Information); cite Amante, C.J., Love, M., Carignan, K., Sutherland, M.G., ' +
    'MacFerrin, M. and Lim, E. (2023), Continuously Updated Digital Elevation Models (CUDEMs) to Support Coastal Inundation Modeling, ' +
    'Remote Sensing 15(6), 1702, doi:10.3390/rs15061702',
}

export const FILL = {
  id: 'hawaii-gis-geologic-units-fill',
  title: 'State of Hawaiʻi GIS, Geologic Units (Terrestrial MapServer layer 28), after Sherrod and others (USGS 2007): the fill unit (Qf) in the district box',
  service: VECTORS.geology.service,
  where: "name = 'Fill'",
  metadata: VECTORS.geology.metadata,
  licence: VECTORS.geology.licence,
  note:
    'artificial fill, mapped by Sherrod and others (2007) from the earlier Oʻahu geologic maps: the made ground of the waterfront, ' +
    'Sand Island, Kakaʻako, Waikīkī and the Ala Wai, and the fill over ponds and marsh behind them. It does not say when, or what lay beneath',
}

export const STREAMS = {
  id: 'hawaii-gis-streams-dar',
  title: 'State of Hawaiʻi GIS, Streams (DAR), FreshWater MapServer layer 1, in the district box',
  service: 'https://geodata.hawaii.gov/arcgis/rest/services/FreshWater/MapServer/1',
  licence: 'State of Hawaiʻi Statewide GIS Program open data; no warranty of positional or thematic accuracy',
  note: 'the Division of Aquatic Resources stream lines (stream_nam, trib_nam); used only to check the routed trunks, never baked',
}

const HISTORIC_MAPS = 'https://geodata.hawaii.gov/arcgis/rest/services/Historic_Maps'
export const SURVEY_MAPS = {
  1881: {
    id: 'hawaii-gis-oahu-1881',
    year: 1881,
    title: 'Hawaiian Government Survey, map of Oʻahu, 1881, as georeferenced by the State of Hawaiʻi GIS (Historic_Maps/Oahu_1881 ImageServer)',
    service: `${HISTORIC_MAPS}/Oahu_1881/ImageServer`,
    licence: 'State of Hawaiʻi Statewide GIS Program open data; the map itself is a public-domain government survey of 1881',
  },
  1899: {
    id: 'hawaii-gis-oahu-1899',
    year: 1899,
    title: 'Hawaiian Government Survey, map of Oʻahu, 1899, as georeferenced by the State of Hawaiʻi GIS (Historic_Maps/Oahu_1899 ImageServer)',
    service: `${HISTORIC_MAPS}/Oahu_1899/ImageServer`,
    licence: 'State of Hawaiʻi Statewide GIS Program open data; the map itself is a public-domain government survey of 1899',
  },
}
// The scans are served in NAD83 / UTM zone 4N (EPSG:26904) at about 10.2 m a
// pixel; they are exported at 5 m over the box and a margin, unresampled
// beyond what the server's nearest-neighbour lookup does.
export const MAP_PIXEL = 5
const MAP_MARGIN = 600

// ---------------------------------------------------------------------------
// Layout of the downloads directory

export const districtPaths = (dir, id) => ({
  root: join(dir, id),
  lidarIndex: (part) => join(dir, id, 'lidar', 'index', `${part}.txt`),
  lidarTile: (name) => join(dir, id, 'lidar', 'tiles', `${name}.tif`),
  lidarMeta: join(dir, id, 'lidar', 'metadata.xml'),
  lidarTiles: join(dir, id, 'lidar', 'tiles.json'),
  cudemList: join(dir, id, 'cudem', 'urllist.txt'),
  cudemTile: (name) => join(dir, id, 'cudem', `${name}.tif`),
  gmrt: join(dir, id, 'bathy', 'gmrt.asc'),
  gmrtMeta: join(dir, id, 'bathy', 'gmrt.json'),
  fill: join(dir, id, 'vectors', 'fill.geojson'),
  streams: join(dir, id, 'vectors', 'streams.geojson'),
  fillLayer: join(dir, id, 'vectors', 'fill-layer.json'),
  map: (year) => join(dir, id, 'maps', `oahu-${year}.png`),
  mapInfo: (year) => join(dir, id, 'maps', `oahu-${year}.json`),
})

// ---------------------------------------------------------------------------
// The box in UTM zone 4, for picking lidar tiles and map exports

/** [eMin, nMin, eMax, nMax] of a lon/lat box in UTM zone 4, from its edges sampled every few hundred metres. */
export function utmExtent(bounds) {
  const [w, s, e, n] = bounds
  const out = [Infinity, Infinity, -Infinity, -Infinity]
  for (let k = 0; k <= 40; k++) {
    const t = k / 40
    for (const [lon, lat] of [
      [w + (e - w) * t, s],
      [w + (e - w) * t, n],
      [w, s + (n - s) * t],
      [e, s + (n - s) * t],
    ]) {
      const [E, N] = utm4(lon, lat)
      out[0] = Math.min(out[0], E)
      out[1] = Math.min(out[1], N)
      out[2] = Math.max(out[2], E)
      out[3] = Math.max(out[3], N)
    }
  }
  return out
}

// MGRS 100 km squares in UTM zone 4, latitude band Q (16–24° N): column
// letters A–H for eastings 100–800 km (zone 4 uses the first letter set), row
// letters from A, offset by 5 for an even zone, repeating every 2,000 km.
const COLS = 'ABCDEFGH'
const ROWS = 'ABCDEFGHJKLMNPQRSTUV'
/** South-west corner [E, N] of a lidar tile from its name (…_4QFJ195565.tif: square FJ, 19.5 km E, 56.5 km N within it). */
export function lidarTileCorner(name) {
  const m = /4Q([A-H])([A-V])(\d{3})(\d{3})$/.exec(name)
  if (!m) return null
  const E = (COLS.indexOf(m[1]) + 1) * 100000 + Number(m[3]) * 100
  let N = ((ROWS.indexOf(m[2]) - 5 + 20) % 20) * 100000 + Number(m[4]) * 100
  while (N < 1700000) N += 2000000
  return [E, N]
}

// ---------------------------------------------------------------------------
// Downloads

/** The lidar tiles whose 500 m squares meet the box (one cell of margin). */
export function lidarTilesFor(dir, d, grid) {
  const p = districtPaths(dir, d.id)
  const [e0, n0, e1, n1] = utmExtent(grid.bounds)
  const tiles = []
  for (const part of LIDAR.parts) {
    const text = readFileSync(p.lidarIndex(part), 'utf8')
    for (const url of text.split(/\s+/).filter(Boolean)) {
      const name = /\/([^/]+)\.tif$/.exec(url)?.[1]
      if (!name || !url.startsWith(`${LIDAR.base}/${part}/TIFF/`)) continue
      const c = lidarTileCorner(name)
      if (!c) continue
      if (c[0] + LIDAR.tile < e0 - 1 || c[0] > e1 + 1 || c[1] + LIDAR.tile < n0 - 1 || c[1] > n1 + 1) continue
      tiles.push({ name, part, url, E: c[0], N: c[1] })
    }
  }
  tiles.sort((a, b) => (a.name < b.name ? -1 : 1))
  return tiles
}

export async function downloadLidar(ledger, dir, d, grid, log) {
  const p = districtPaths(dir, d.id)
  for (const part of LIDAR.parts) {
    const r = fetchTo(ledger, `${LIDAR.base}/${part}/0_file_download_links.txt`, p.lidarIndex(part))
    if (!r.ok) throw new Error(`lidar tile list for ${part}: HTTP ${r.status}`)
  }
  const tiles = lidarTilesFor(dir, d, grid)
  if (!tiles.length) throw new Error('no lidar tiles under the box')
  writeFileSync(p.lidarTiles, JSON.stringify(tiles, null, 1) + '\n')
  // one tile's metadata, for the dates of the survey
  const meta = fetchTo(ledger, tiles[0].url.replace('/TIFF/', '/metadata/').replace(/\.tif$/, '.xml'), p.lidarMeta)
  if (!meta.ok) log(`  lidar metadata: HTTP ${meta.status}; the dates are left out`)
  let done = 0
  let fresh = 0
  const t0 = Date.now()
  const res = await fetchManyTo(
    ledger,
    tiles.map((t) => ({ url: t.url, file: p.lidarTile(t.name) })),
    {
      parallel: 6,
      onDone: (r) => {
        done++
        if (!r.cached) fresh++
        if (done % 50 === 0 || done === tiles.length) log(`  lidar: ${done}/${tiles.length} tiles (${fresh} fetched, ${((Date.now() - t0) / 1000).toFixed(0)} s)`)
      },
    },
  )
  const bad = res.filter((r) => !r.ok)
  if (bad.length) throw new Error(`lidar: ${bad.length} tiles failed (${bad.slice(0, 3).map((r) => `${r.status} ${r.url}`).join('; ')})`)
}

/** CUDEM tiles are 0.25° squares named for their north-west corner (ncei19_n21x50_w158x00). */
export function cudemTilesFor(dir, d, bounds) {
  const p = districtPaths(dir, d.id)
  const [w, s, e, n] = bounds
  const out = []
  for (const url of readFileSync(p.cudemList, 'utf8').split(/\s+/)) {
    const m = /\/tiles\/(ncei19_n(\d+)x(\d+)_w(\d+)x(\d+)_\w+)\.tif$/.exec(url)
    if (!m) continue
    const north = Number(m[2]) + Number(m[3]) / 100
    const west = -(Number(m[4]) + Number(m[5]) / 100)
    if (west >= e || west + 0.25 <= w || north <= s || north - 0.25 >= n) continue
    out.push({ name: m[1], url })
  }
  return out
}

export function downloadCudem(ledger, dir, d, grid, log) {
  const p = districtPaths(dir, d.id)
  const r = fetchTo(ledger, CUDEM.list, p.cudemList, { force: true })
  if (!r.ok) throw new Error(`CUDEM tile list: HTTP ${r.status}`)
  const tiles = cudemTilesFor(dir, d, grid.bounds)
  for (const t of tiles) {
    const f = fetchTo(ledger, t.url, p.cudemTile(t.name), { maxTime: 1800 })
    if (!f.ok) throw new Error(`CUDEM ${t.name}: HTTP ${f.status}`)
    log(`  cudem: ${t.name} ${f.cached ? 'cached' : 'fetched'}`)
  }
  return tiles
}

/** GMRT over the box, at its finest here (about 61 m), for any sea texel the CUDEM leaves empty. */
export function gmrtRequest(grid) {
  const { bounds, dLon, dLat } = grid
  const pad = 8
  const b = [bounds[0] - pad * dLon, bounds[1] - pad * dLat, bounds[2] + pad * dLon, bounds[3] + pad * dLat]
  return { bounds: b, mres: 30, url: gmrtUrl(b, 30) }
}

export function downloadGmrt(ledger, dir, d, grid, log) {
  const p = districtPaths(dir, d.id)
  const req = gmrtRequest(grid)
  try {
    const r = fetchTo(ledger, req.url, p.gmrt, { maxTime: 300, emptyRetries: 10 })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const [w, s, e, n] = req.bounds
    const metaUrl =
      `${BATHY.url}/metadata?minlongitude=${w.toFixed(5)}&maxlongitude=${e.toFixed(5)}` +
      `&minlatitude=${s.toFixed(5)}&maxlatitude=${n.toFixed(5)}&format=esriascii&mresolution=${req.mres}&mformat=json`
    fetchTo(ledger, metaUrl, p.gmrtMeta, { maxTime: 120 })
    log(`  gmrt: ${r.cached ? 'cached' : 'fetched'}`)
  } catch (e) {
    // only a fallback behind the CUDEM; the bake says so if it is needed and missing
    log(`  gmrt: failed (${String(e.message).slice(0, 160)}); sea texels the CUDEM leaves empty will be a flat -1 m`)
  }
}

/** The fill unit of the geologic map, in and around the box, as GeoJSON in WGS 84. */
export function downloadFill(ledger, dir, d, grid, log) {
  const p = districtPaths(dir, d.id)
  const meta = fetchTo(ledger, `${FILL.service}?f=json`, p.fillLayer, { force: true })
  if (!meta.ok) throw new Error(`geologic units: HTTP ${meta.status}`)
  const [w, s, e, n] = grid.bounds
  const m = 0.01
  const url =
    `${FILL.service}/query?where=${encodeURIComponent(FILL.where)}` +
    `&geometry=${[w - m, s - m, e + m, n + m].map((v) => v.toFixed(5)).join(',')}&geometryType=esriGeometryEnvelope&inSR=4326` +
    '&spatialRel=esriSpatialRelIntersects&outFields=*&outSR=4326&geometryPrecision=7&f=geojson'
  const r = fetchTo(ledger, url, p.fill, { force: true })
  if (!r.ok) throw new Error(`fill polygons: HTTP ${r.status}`)
  const fc = JSON.parse(readFileSync(p.fill, 'utf8'))
  if (fc.type !== 'FeatureCollection' || !fc.features?.length) throw new Error('fill polygons: no features')
  log(`  fill: ${fc.features.length} polygons`)
}

/** The State's stream lines in and around the box, as GeoJSON in WGS 84 (for the check only). */
export function downloadStreams(ledger, dir, d, grid, log) {
  const p = districtPaths(dir, d.id)
  const [w, s, e, n] = grid.bounds
  const m = 0.01
  const url =
    `${STREAMS.service}/query?where=1%3D1&geometry=${[w - m, s - m, e + m, n + m].map((v) => v.toFixed(5)).join(',')}` +
    '&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=objectid,stream_nam,trib_nam,type' +
    '&outSR=4326&geometryPrecision=7&f=geojson'
  const r = fetchTo(ledger, url, p.streams, { force: true })
  if (!r.ok) throw new Error(`streams: HTTP ${r.status}`)
  const fc = JSON.parse(readFileSync(p.streams, 'utf8'))
  if (fc.type !== 'FeatureCollection' || !fc.features?.length) throw new Error('streams: no features')
  log(`  streams: ${fc.features.length} lines`)
}

/** Export a Government Survey map over the box (in its own UTM, at MAP_PIXEL m) as a lossless PNG. */
export function mapExport(grid) {
  const [e0, n0, e1, n1] = utmExtent(grid.bounds)
  const x0 = Math.floor((e0 - MAP_MARGIN) / 100) * 100
  const y0 = Math.floor((n0 - MAP_MARGIN) / 100) * 100
  const x1 = Math.ceil((e1 + MAP_MARGIN) / 100) * 100
  const y1 = Math.ceil((n1 + MAP_MARGIN) / 100) * 100
  return { extent: [x0, y0, x1, y1], size: [(x1 - x0) / MAP_PIXEL, (y1 - y0) / MAP_PIXEL], pixel: MAP_PIXEL, epsg: 26904 }
}

export function downloadMaps(ledger, dir, d, grid, log) {
  const p = districtPaths(dir, d.id)
  const ex = mapExport(grid)
  for (const m of Object.values(SURVEY_MAPS)) {
    const info = fetchTo(ledger, `${m.service}?f=json`, p.mapInfo(m.year), { force: true })
    if (!info.ok) throw new Error(`${m.year} map: HTTP ${info.status}`)
    const url =
      `${m.service}/exportImage?bbox=${ex.extent.join(',')}&bboxSR=${ex.epsg}&imageSR=${ex.epsg}` +
      `&size=${ex.size.join(',')}&format=png&interpolation=RSP_NearestNeighbor&f=image`
    const r = fetchTo(ledger, url, p.map(m.year), { force: true, maxTime: 600 })
    if (!r.ok) throw new Error(`${m.year} map export: HTTP ${r.status}`)
    log(`  map ${m.year}: ${ex.size.join('x')} px at ${ex.pixel} m`)
  }
  return ex
}

export async function downloadDistrict(ledger, dir, d, log) {
  const grid = districtGrid(d)
  mkdirSync(districtPaths(dir, d.id).root, { recursive: true })
  log(`${d.id}: ${grid.W}x${grid.H} over ${grid.bounds.join(', ')}`)
  log('fill (State geologic map), streams (State DAR):')
  downloadFill(ledger, dir, d, grid, log)
  downloadStreams(ledger, dir, d, grid, log)
  log('Government Survey maps (State GIS):')
  downloadMaps(ledger, dir, d, grid, log)
  log('rain (Rainfall Atlas of Hawaiʻi):')
  downloadRain(ledger, dir, log)
  log('sea floor (NOAA CUDEM, GMRT):')
  downloadCudem(ledger, dir, d, grid, log)
  downloadGmrt(ledger, dir, d, grid, log)
  log('lidar (USGS 3DEP, 0.5 m):')
  await downloadLidar(ledger, dir, d, grid, log)
}

/** The fetched date the ledger holds for a file, or the latest of several. */
export function fetchedOf(ledger, files) {
  const ds = files.map((f) => ledger.get(f)?.fetched).filter(Boolean).sort()
  return ds[ds.length - 1]
}

export function readJson(file) {
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null
}

