// Where the geology bake's inputs come from (DATA.md "Geology: the making of
// the islands", "How to bake the geology"), and how to fetch them into the
// downloads directory. Downloads are untrusted data: nothing here executes
// them, the bake only parses them.
//
// Two sources, both the ones the island packs already read: the GMRT
// synthesis for the sea floor (one request over the whole seafloor box, at
// about its texel size) and the USGS 3DEP 1 arc-second tiles for the land.
// Every one-degree cell in the box is asked for; the USGS publishes a tile
// only where there is land, so most of them answer 404 and are sea.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fetchTo, sleep } from './fetch.mjs'
import { packGrid } from './geo.mjs'
import { BATHY, DEM, tilesFor } from './sources.mjs'

// The box the contract asks for: the Nuʻuanu debris field out to the Hawaiian
// Arch north-east of Oʻahu, the Kaʻena and Waiʻanae fields west of it, the
// ʻĀlika fields south-west of Hawaiʻi, and Kaʻula, Lehua and Nihoa's bank in
// the north-west. [west, south, east, north], degrees.
export const SEAFLOOR_BBOX = [-162, 17.5, -153, 24.5]
export const SEAFLOOR_LONG_SIDE = 2048

/** The seafloor grid: square texels in the shared projection, 2048 on the long side. */
export function seafloorGrid() {
  return packGrid(SEAFLOOR_BBOX, { padMetres: 0, longSide: SEAFLOOR_LONG_SIDE })
}

export const geologyPaths = (dir) => ({
  dem: join(dir, 'dem'),
  gmrt: join(dir, 'gmrt-seafloor.asc'),
  gmrtMeta: join(dir, 'gmrt-seafloor.json'),
  notes: join(dir, 'notes.json'),
})

export function gmrtRequest(grid) {
  const { bounds, dLon, dLat, metresPerTexel } = grid
  const b = [bounds[0] - 2 * dLon, bounds[1] - 2 * dLat, bounds[2] + 2 * dLon, bounds[3] + 2 * dLat]
  const mres = Math.round(metresPerTexel[0])
  const [w, s, e, n] = b
  const q = `minlongitude=${w.toFixed(5)}&maxlongitude=${e.toFixed(5)}&minlatitude=${s.toFixed(5)}&maxlatitude=${n.toFixed(5)}`
  return {
    bounds: b,
    mres,
    url: `${BATHY.url}?${q}&layer=topo&format=esriascii&mresolution=${mres}`,
    // no `layer` here: layer=topo would make the metadata endpoint send the grid
    metaUrl: `${BATHY.url}/metadata?${q}&format=esriascii&mresolution=${mres}&mformat=json`,
  }
}

export function readGeologyNotes(dir) {
  const f = geologyPaths(dir).notes
  return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : {}
}

export function downloadGeology(ledger, dir, log) {
  const p = geologyPaths(dir)
  mkdirSync(p.dem, { recursive: true })
  const grid = seafloorGrid()
  log(`seafloor grid ${grid.W}x${grid.H} at ${grid.metresPerTexel[0].toFixed(1)} m, bounds ${grid.bounds.join(', ')}`)

  log('DEM tiles (USGS 3DEP 1 arc-second), every one-degree cell in the box:')
  const tiles = []
  const unpublished = []
  for (const name of tilesFor(grid.bounds)) {
    const file = join(p.dem, `USGS_1_${name}.tif`)
    const r = fetchTo(ledger, `${DEM.base}/current/${name}/USGS_1_${name}.tif`, file)
    if (r.ok) {
      tiles.push(name)
      log(`  ${name}: ${r.cached ? 'cached' : 'fetched'}`)
    } else unpublished.push(name)
  }
  log(`  ${tiles.length} tiles; ${unpublished.length} cells have no tile in current/ (no land)`)

  log('bathymetry (GMRT), one grid over the box:')
  const req = gmrtRequest(grid)
  let r
  for (let attempt = 1; ; attempt++) {
    try {
      r = fetchTo(ledger, req.url, p.gmrt, { maxTime: 900, emptyRetries: 10 })
      break
    } catch (e) {
      if (attempt >= 3) throw new Error(`GMRT failed: ${String(e.message).slice(0, 200)}; run --download again (finished files are kept)`)
      log(`  GMRT: ${String(e.message).slice(0, 120)}; retrying in 60 s`)
      sleep(60000)
    }
  }
  if (!r.ok) throw new Error(`GMRT answered HTTP ${r.status}; run --download again`)
  log(`  ${r.cached ? 'cached' : 'fetched'} at ~${req.mres} m`)
  try {
    fetchTo(ledger, req.metaUrl, p.gmrtMeta, { maxTime: 120 })
  } catch (e) {
    log(`  GMRT metadata unavailable (${String(e.message).slice(0, 120)}); the version is left out of the title`)
  }
  writeFileSync(p.notes, JSON.stringify({ tiles, unpublished }, null, 2) + '\n')
}
