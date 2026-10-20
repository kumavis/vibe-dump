// Where every input comes from, and how to fetch it into the downloads
// directory. Downloads are untrusted data: nothing here executes them, they
// are only parsed by the bake.
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fetchText, fetchTo, sleep } from './fetch.mjs'
import { ARCHIPELAGO, ISLANDS, bboxOf, islandId, packGrid } from './geo.mjs'

// ---------------------------------------------------------------------------
// Source descriptions (the manifest and the boundary files carry these inline)

export const DEM = {
  id: 'usgs-3dep-1as',
  title: 'USGS 3D Elevation Program (3DEP) 1 arc-second DEM, 1x1 degree tiles',
  base: 'https://prd-tnm.s3.amazonaws.com/StagedProducts/Elevation/1/TIFF',
  url: 'https://prd-tnm.s3.amazonaws.com/StagedProducts/Elevation/1/TIFF/current/',
  licence: 'public domain (U.S. Geological Survey)',
}

export const BATHY = {
  id: 'gmrt',
  title: 'Global Multi-Resolution Topography (GMRT) synthesis, topo layer (multibeam bathymetry with GEBCO fill)',
  url: 'https://www.gmrt.org/services/GridServer',
  licence: 'CC BY 4.0; cite Ryan, W.B.F. et al. (2009), Global Multi-Resolution Topography synthesis, Geochem. Geophys. Geosyst. 10, Q03014, doi:10.1029/2008GC002332',
}

export const RAIN = {
  id: 'rainfall-atlas-hawaii-2013',
  title: 'Rainfall Atlas of Hawaiʻi, statewide mean annual rainfall grid (mm), ASCII grid',
  url: 'https://atlas.uhtapis.org/rainfall/assets/files/GISLayers/StateASCIIGrids_mm.zip',
  page: 'https://rainfall.geography.hawaii.edu/downloads',
  licence: 'free to use with citation: Giambelluca, T.W., Q. Chen, A.G. Frazier, J.P. Price, Y.-L. Chen, P.-S. Chu, J.K. Eischeid and D.M. Delparte, 2013: Online Rainfall Atlas of Hawaiʻi. Bull. Amer. Meteor. Soc. 94, 313-316, doi:10.1175/BAMS-D-11-00228.1',
}

export const BOUNDARY_SERVICE = 'https://geodata.hawaii.gov/arcgis/rest/services/HistoricCultural/MapServer'
export const BOUNDARY_LAYERS = {
  ahupuaa: {
    layer: 1,
    id: 'hawaii-gis-ahupuaa',
    title: 'State of Hawaiʻi GIS, Ahupuaa (Historic Land Divisions), HistoricCultural MapServer layer 1',
    metadata: 'https://files.hawaii.gov/dbedt/op/gis/data/ahupuaa.pdf',
  },
  moku: {
    layer: 3,
    id: 'hawaii-gis-moku',
    title: 'State of Hawaiʻi GIS, Moku (Historic Land Divisions), HistoricCultural MapServer layer 3',
    metadata: 'https://files.hawaii.gov/dbedt/op/gis/data/moku.pdf',
  },
}
export const BOUNDARY_LICENCE =
  'State of Hawaiʻi Statewide GIS Program open data; the layer carries the disclaimer that it does not show legal boundaries'

// ---------------------------------------------------------------------------
// Layout of the downloads directory

export const paths = (dir) => ({
  boundaries: join(dir, 'boundaries'),
  dem: join(dir, 'dem'),
  bathy: join(dir, 'bathy'),
  rain: join(dir, 'rain'),
  rainZip: join(dir, 'rain', 'StateASCIIGrids_mm.zip'),
  rainDir: join(dir, 'rain', 'extracted'),
  notes: join(dir, 'notes.json'),
})

const PAGE = 100

/** Fetch the layer description and every feature of a boundary layer, paged. */
export function downloadBoundaryLayer(ledger, dir, key, log) {
  const { layer } = BOUNDARY_LAYERS[key]
  const base = `${BOUNDARY_SERVICE}/${layer}`
  const out = paths(dir).boundaries
  mkdirSync(out, { recursive: true })
  const meta = fetchTo(ledger, `${base}?f=json`, join(out, `${key}-layer.json`), { force: true })
  if (!meta.ok) throw new Error(`layer ${layer}: HTTP ${meta.status}`)
  const count = JSON.parse(fetchText(`${base}/query?where=1%3D1&returnCountOnly=true&f=json`)).count
  if (!(count > 0)) throw new Error(`layer ${layer}: no features`)
  // Drop stale pages from an earlier run with a different count.
  for (const f of readdirSync(out)) if (f.startsWith(`${key}-page-`)) rmSync(join(out, f))
  const pages = []
  for (let off = 0; off < count; off += PAGE) {
    const url =
      `${base}/query?where=1%3D1&outFields=*&outSR=4326&f=geojson&orderByFields=objectid` +
      `&resultOffset=${off}&resultRecordCount=${PAGE}`
    const file = join(out, `${key}-page-${String(off).padStart(5, '0')}.geojson`)
    const r = fetchTo(ledger, url, file, { force: true })
    if (!r.ok) throw new Error(`layer ${layer} page ${off}: HTTP ${r.status}`)
    pages.push(file)
  }
  const n = readBoundaryLayer(dir, key).features.length
  if (n !== count) throw new Error(`layer ${layer}: got ${n} features, server count ${count}`)
  log(`  ${key}: layer ${layer}, ${count} features in ${pages.length} pages`)
  return count
}

/** All pages of a downloaded boundary layer, as one FeatureCollection, plus the layer JSON. */
export function readBoundaryLayer(dir, key) {
  const out = paths(dir).boundaries
  const files = readdirSync(out).filter((f) => f.startsWith(`${key}-page-`)).sort()
  const features = []
  for (const f of files) {
    const fc = JSON.parse(readFileSync(join(out, f), 'utf8'))
    if (fc.type !== 'FeatureCollection' || !Array.isArray(fc.features)) throw new Error(`${f}: not a FeatureCollection`)
    features.push(...fc.features)
  }
  const layer = JSON.parse(readFileSync(join(out, `${key}-layer.json`), 'utf8'))
  return { type: 'FeatureCollection', features, layer }
}

// ---------------------------------------------------------------------------
// Pack grids. They are derived from the ahupuaʻa polygons (the extent of each
// island's ahupuaʻa, padded by 2 km of sea), so download and bake agree. The
// ahupuaʻa layer, not the moku layer, because its `mokupuni` is per polygon:
// the moku layer files Kahoʻolawe and Molokini inside one Honuaʻula feature
// whose mokupuni reads "Molokini", which would stretch no pack or the wrong one.

// Ignore polygon parts smaller than this when measuring an island's extent,
// so that a far offshore islet listed under an island cannot stretch its
// pack. Islets inside the padded box are baked anyway, from the DEM.
const MIN_PART_KM2 = 1

function ringAreaKm2(ring) {
  // planar shoelace in the local projection, km²
  let a = 0
  const k = Math.cos((21 * Math.PI) / 180) * 111.32
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += (ring[j][0] * k) * (ring[i][1] * 110.574) - (ring[i][0] * k) * (ring[j][1] * 110.574)
  }
  return Math.abs(a / 2)
}

export function islandExtents(dir) {
  const ahupuaa = readBoundaryLayer(dir, 'ahupuaa')
  const ext = {}
  for (const f of ahupuaa.features) {
    const id = islandId(f.properties.mokupuni)
    if (!id) continue
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
    for (const p of polys) {
      if (ringAreaKm2(p[0]) < MIN_PART_KM2) continue
      ext[id] = bboxOf({ coordinates: p[0] }, ext[id])
    }
  }
  for (const i of ISLANDS) if (!ext[i.id]) throw new Error(`no ahupuaʻa polygons found for ${i.name}`)
  return ext
}

export const ISLAND_LONG_SIDE = 1024
export const ARCHIPELAGO_WIDTH = 2048

export function packGrids(dir) {
  const ext = islandExtents(dir)
  const grids = []
  const all = [Infinity, Infinity, -Infinity, -Infinity]
  for (const i of ISLANDS) {
    const b = ext[i.id]
    all[0] = Math.min(all[0], b[0])
    all[1] = Math.min(all[1], b[1])
    all[2] = Math.max(all[2], b[2])
    all[3] = Math.max(all[3], b[3])
  }
  grids.push({ ...ARCHIPELAGO, kind: 'archipelago', subject: all, grid: packGrid(all, { width: ARCHIPELAGO_WIDTH }) })
  for (const i of ISLANDS) {
    grids.push({ ...i, kind: 'island', subject: ext[i.id], grid: packGrid(ext[i.id], { longSide: ISLAND_LONG_SIDE }) })
  }
  return grids
}

// ---------------------------------------------------------------------------
// DEM tiles

export function tileName(lat, lon) {
  // a 3DEP tile is named for its north-west corner: n22w158 covers 21..22 N, 158..157 W
  return `n${Math.floor(lat) + 1}w${Math.floor(-lon) + 1}`
}

export function tilesFor(bounds) {
  const [w, s, e, n] = bounds
  const names = new Set()
  for (let lat = Math.floor(s); lat <= Math.floor(n); lat++) {
    for (let lon = Math.floor(w); lon <= Math.floor(e); lon++) {
      // the tile containing the point (lon + 0.5, lat + 0.5)
      names.add(tileName(lat + 0.5, lon + 0.5))
    }
  }
  return [...names].sort()
}

/** Download every tile the packs need. Returns { tiles: {name: file}, missing: [{name, note}] }. */
export function downloadDem(ledger, dir, grids, log) {
  // Every bit of land in the archipelago box lies inside some island pack, so
  // the island packs decide the tiles; the rest of the archipelago box is open
  // ocean, where the USGS publishes no tiles, and is baked as sea.
  const need = new Set()
  for (const g of grids) if (g.kind === 'island') for (const t of tilesFor(g.grid.bounds)) need.add(t)
  const tiles = {}
  const missing = []
  for (const name of [...need].sort()) {
    const file = join(paths(dir).dem, `USGS_1_${name}.tif`)
    const url = `${DEM.base}/current/${name}/USGS_1_${name}.tif`
    let r = fetchTo(ledger, url, file)
    if (r.ok) {
      tiles[name] = file
      log(`  ${name}: ${r.cached ? 'cached' : 'fetched'}`)
      continue
    }
    // Not in current/: look for a dated copy under historical/.
    const listing = fetchText(`https://prd-tnm.s3.amazonaws.com/?list-type=2&prefix=StagedProducts/Elevation/1/TIFF/historical/${name}/`)
    const keys = [...listing.matchAll(/<Key>([^<]+\.tif)<\/Key>/g)].map((m) => m[1]).sort()
    if (keys.length) {
      const key = keys[keys.length - 1]
      r = fetchTo(ledger, `https://prd-tnm.s3.amazonaws.com/${key}`, file)
      if (r.ok) {
        tiles[name] = file
        missing.push({ name, note: `not in current/ (HTTP 404); used dated copy ${key}` })
        log(`  ${name}: not in current/, used ${key}`)
        continue
      }
    }
    missing.push({ name, note: 'not in current/ (HTTP 404) and no dated copy under historical/; the USGS publishes no tile here because it holds no land, so it is baked as sea' })
    log(`  ${name}: missing (no tile published; treated as open sea)`)
  }
  return { tiles, missing }
}

// ---------------------------------------------------------------------------
// Bathymetry: one GMRT request per pack, at about the pack's texel size.

// ESRI ASCII, not GeoTIFF: GMRT's GeoTIFF output intermittently comes back as
// an empty 200 for minutes at a time while the same request as ASCII works.
export function gmrtUrl(bounds, mres) {
  const [w, s, e, n] = bounds
  return (
    `${BATHY.url}?minlongitude=${w.toFixed(5)}&maxlongitude=${e.toFixed(5)}` +
    `&minlatitude=${s.toFixed(5)}&maxlatitude=${n.toFixed(5)}&layer=topo&format=esriascii&mresolution=${mres}`
  )
}

/** Where a pack's GMRT grid, and its metadata, live in the downloads. */
export const bathyFile = (dir, id) => join(paths(dir).bathy, `gmrt-${id}.asc`)
export const bathyMetaFile = (dir, id) => join(paths(dir).bathy, `gmrt-${id}.json`)

export function bathyRequest(g) {
  const { bounds, dLon, dLat, metresPerTexel } = g.grid
  // two texels of margin so bilinear sampling at the edges stays inside
  const b = [bounds[0] - 2 * dLon, bounds[1] - 2 * dLat, bounds[2] + 2 * dLon, bounds[3] + 2 * dLat]
  const mres = Math.max(50, Math.round(metresPerTexel[0]))
  return { bounds: b, mres, url: gmrtUrl(b, mres) }
}

/**
 * GMRT builds each grid on request and, under load, answers 200 with an
 * empty body; requests are spaced out and retried for several minutes.
 * Returns { files: {packId: file}, failed: [packId] }.
 */
export function downloadBathy(ledger, dir, grids, log) {
  const out = {}
  const failed = []
  let fetchedBefore = false
  for (const g of grids) {
    const req = bathyRequest(g)
    const file = bathyFile(dir, g.id)
    const known = ledger.get(file)
    if (fetchedBefore && !(known && known.url === req.url && known.bytes > 0)) sleep(5000)
    let r
    try {
      r = fetchTo(ledger, req.url, file, { maxTime: 300, emptyRetries: 10 })
    } catch (e) {
      r = { ok: false, status: String(e.message).slice(0, 200) }
    }
    if (!r.cached) fetchedBefore = true
    if (!r.ok) {
      log(`  ${g.id}: GMRT failed (${r.status})`)
      failed.push(g.id)
      continue
    }
    // The grid's own description (GMRT version, node spacing), for provenance.
    // (No `layer` here: layer=topo would make the metadata endpoint send the grid.)
    const [w, s, e, n] = req.bounds
    const metaUrl =
      `${BATHY.url}/metadata?minlongitude=${w.toFixed(5)}&maxlongitude=${e.toFixed(5)}` +
      `&minlatitude=${s.toFixed(5)}&maxlatitude=${n.toFixed(5)}&format=esriascii&mresolution=${req.mres}&mformat=json`
    try {
      fetchTo(ledger, metaUrl, bathyMetaFile(dir, g.id), { maxTime: 120 })
    } catch (e) {
      log(`  ${g.id}: GMRT metadata unavailable (${String(e.message).slice(0, 120)}); the version is left out of the title`)
    }
    out[g.id] = file
    log(`  ${g.id}: ${r.cached ? 'cached' : 'fetched'} at ~${req.mres} m`)
  }
  return { files: out, failed }
}

// ---------------------------------------------------------------------------
// Rain

export function downloadRain(ledger, dir, log) {
  const p = paths(dir)
  const r = fetchTo(ledger, RAIN.url, p.rainZip)
  if (!r.ok) {
    log(`  rain: HTTP ${r.status}; the packs will have no rain`)
    return null
  }
  rmSync(p.rainDir, { recursive: true, force: true })
  mkdirSync(p.rainDir, { recursive: true })
  const u = spawnSync('unzip', ['-q', '-o', p.rainZip, '-d', p.rainDir], { encoding: 'utf8' })
  if (u.status !== 0) throw new Error(`unzip failed: ${u.stderr}`)
  log(`  rain: ${r.cached ? 'cached' : 'fetched'} and unpacked`)
  return p.rainDir
}

/** Find the annual-mean grid in the unpacked rain archive. */
export function findRainGrid(dir) {
  const root = paths(dir).rainDir
  if (!existsSync(root)) return null
  const found = []
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const f = join(d, e.name)
      if (e.isDirectory()) walk(f)
      else found.push(f)
    }
  }
  walk(root)
  const ann = found.filter((f) => /ann/i.test(f.split('/').pop()) && /\.(txt|asc)$/i.test(f) && !/(cv|se|unc|anom)/i.test(f.split('/').pop()))
  return ann.length === 1 ? ann[0] : ann.length ? ann.sort((a, b) => a.length - b.length)[0] : null
}

export function writeNotes(dir, notes) {
  writeFileSync(paths(dir).notes, JSON.stringify(notes, null, 2) + '\n')
}
export function readNotes(dir) {
  const f = paths(dir).notes
  return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : {}
}
