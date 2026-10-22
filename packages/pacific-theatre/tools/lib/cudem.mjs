// NOAA NCEI's CUDEM 1/9″ topobathymetry for Pearl Harbor's harbour and south
// shore (DATA.md §7; R10 D2, §11.3): the two tiles the Hawaiian district bake
// used, downloaded whole into the downloads directory and deleted by
// --clean, read in strips and binned into the box's texels.
//
// The tile list, the tile naming (0.25° squares named for their north-west
// corner, ncei19_n21x50_w158x00) and the source description are
// holo-i-ke-au's tools/lib/district-sources.mjs (b480c27, on
// origin/claude/funny-cannon-vy1pyf). What R10 and this module found of the
// tiles: 8112 × 8112 Float32 cells of 1/9″ (about 3.4 m), PixelIsArea, nodata
// −9999, internally tiled 256 × 256 with DEFLATE (so a strip is read
// without the rest), heights on mean sea level, land above 0 and the harbour
// floor below it.
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fromFile } from 'geotiff'
import { fetchTo } from './fetch.mjs'

export const CUDEM = {
  id: 'noaa-cudem-hawaii-ninth',
  title: 'NOAA NCEI Continuously Updated Digital Elevation Model (CUDEM), 1/9 arc-second topobathymetric tiles, Hawaiʻi (2021v1)',
  base: 'https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/dem/NCEI_ninth_Topobathy_Hawaii_9428',
  list: 'https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/dem/NCEI_ninth_Topobathy_Hawaii_9428/urllist9428.txt',
  url: 'https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/dem/NCEI_ninth_Topobathy_Hawaii_9428/index.html',
  licence: 'public domain (US government work, NOAA NCEI)',
  citation:
    'Amante, C. J., M. Love, K. Carignan, M. G. Sutherland, M. MacFerrin and E. Lim (2023), Continuously Updated Digital Elevation Models (CUDEMs) to Support Coastal Inundation Modeling, Remote Sensing 15(6), 1702, doi:10.3390/rs15061702',
}

/** The tiles of the list that meet bounds [w, s, e, n] (in the tiles' own longitudes, west of 0). */
export function cudemTilesFor(listText, [w, s, e, n]) {
  const out = []
  for (const url of listText.split(/\s+/)) {
    const m = /\/tiles\/(ncei19_n(\d+)x(\d+)_w(\d+)x(\d+)_\w+)\.tif$/.exec(url)
    if (!m) continue
    const north = Number(m[2]) + Number(m[3]) / 100
    const west = -(Number(m[4]) + Number(m[5]) / 100)
    if (west >= e || west + 0.25 <= w || north <= s || north - 0.25 >= n) continue
    out.push({ name: m[1], url, west, north })
  }
  return out.sort((a, b) => a.name.localeCompare(b.name))
}

/** Fetch the list and the tiles named (or, with names null, every tile meeting bounds). Returns the tiles with their files. */
export function downloadCudem(ledger, dir, { names = null, bounds = null } = {}, log = () => {}) {
  const listFile = join(dir, 'cudem', 'urllist9428.txt')
  const r = fetchTo(ledger, CUDEM.list, listFile, { force: true })
  if (!r.ok) throw new Error(`CUDEM tile list: HTTP ${r.status}`)
  let tiles = cudemTilesFor(readFileSync(listFile, 'utf8'), bounds || [-180, -90, 180, 90])
  if (names) tiles = tiles.filter((t) => names.includes(t.name))
  if (names && tiles.length !== names.length) throw new Error(`CUDEM: the list lacks ${names.filter((n) => !tiles.some((t) => t.name === n)).join(', ')}`)
  for (const t of tiles) {
    t.file = join(dir, 'cudem', `${t.name}.tif`)
    const f = fetchTo(ledger, t.url, t.file, { maxTime: 1800 })
    if (!f.ok) throw new Error(`CUDEM ${t.name}: HTTP ${f.status}`)
    log(`  cudem ${t.name}: ${f.cached ? 'cached' : 'fetched'} (${(ledger.get(t.file).bytes / 1e6).toFixed(1)} MB)`)
  }
  return tiles
}

/**
 * Bin one CUDEM tile's cells into a box grid by their centres (a texel of
 * 50 m holds about 15 × 15 cells, so binning by centre is exact to a
 * fifteenth of a texel). acc: { n, nLand, sumLand, nSea, sumSea } Float64Arrays
 * of W × H; off: added to the tile's longitudes (360 for a box written east
 * of 180). Returns the cells binned.
 */
export async function binCudemTile(file, grid, acc, { off = 0, rowsPerStrip = 256 } = {}) {
  if (!existsSync(file)) throw new Error(`${file} is missing (run --download)`)
  const tiff = await fromFile(file)
  const img = await tiff.getImage()
  const W = img.getWidth()
  const H = img.getHeight()
  const [ox, oy] = img.getOrigin()
  const [rx, ry] = img.getResolution()
  const keys = img.getGeoKeys() || {}
  const pis = keys.GTRasterTypeGeoKey === 2
  const west = (pis ? ox - rx / 2 : ox) + off
  const north = pis ? oy - ry / 2 : oy
  const dy = -ry
  const nd = img.getGDALNoData()
  const { bounds, dLon, dLat } = grid
  const GW = grid.W
  const GH = grid.H
  // the columns and rows of the tile that fall inside the grid
  const c0 = Math.max(0, Math.floor((bounds[0] - west) / rx))
  const c1 = Math.min(W, Math.ceil((bounds[2] - west) / rx))
  const r0 = Math.max(0, Math.floor((north - bounds[3]) / dy))
  const r1 = Math.min(H, Math.ceil((north - bounds[1]) / dy))
  if (c1 <= c0 || r1 <= r0) return 0
  const ti = new Int32Array(c1 - c0)
  for (let c = c0; c < c1; c++) ti[c - c0] = Math.floor((west + (c + 0.5) * rx - bounds[0]) / dLon)
  // how many of this tile's cells each texel holds (14 or 15 a side, as the
  // grids beat), so a texel is judged full against its own count
  if (acc.expect) {
    const cols = new Int32Array(GW)
    const rows = new Int32Array(GH)
    for (let k = 0; k < c1 - c0; k++) if (ti[k] >= 0 && ti[k] < GW) cols[ti[k]]++
    for (let r = r0; r < r1; r++) {
      const tj = Math.floor((bounds[3] - (north - (r + 0.5) * dy)) / dLat)
      if (tj >= 0 && tj < GH) rows[tj]++
    }
    for (let j = 0; j < GH; j++) if (rows[j]) for (let i = 0; i < GW; i++) if (cols[i]) acc.expect[j * GW + i] += rows[j] * cols[i]
  }
  let n = 0
  for (let a = r0; a < r1; a += rowsPerStrip) {
    const b = Math.min(r1, a + rowsPerStrip)
    const [data] = await img.readRasters({ window: [c0, a, c1, b] })
    const ww = c1 - c0
    for (let r = a; r < b; r++) {
      const tj = Math.floor((bounds[3] - (north - (r + 0.5) * dy)) / dLat)
      if (tj < 0 || tj >= GH) continue
      const row = (r - a) * ww
      for (let k = 0; k < ww; k++) {
        const i = ti[k]
        if (i < 0 || i >= GW) continue
        const v = data[row + k]
        if (v === nd || !(v > -1e4)) continue
        const t = tj * GW + i
        acc.n[t]++
        if (v > 0) {
          acc.nLand[t]++
          acc.sumLand[t] += v
        } else {
          acc.nSea[t]++
          acc.sumSea[t] += v
        }
        n++
      }
    }
  }
  return { cells: n, cellsPerTexel: (dLon / rx) * (dLat / dy), west, north, east: west + W * rx, south: north - H * dy }
}
