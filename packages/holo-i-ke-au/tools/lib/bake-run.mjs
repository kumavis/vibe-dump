// The --bake step: boundaries, then every pack, then manifest.json.
// Writes only manifest.json, boundaries/ and the pack directories under
// public/data/; the gazetteer files beside them are not touched.
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { bakeBoundaries } from './boundaries.mjs'
import { Ledger } from './fetch.mjs'
import { LAT0, LON0 } from './geo.mjs'
import { writeGreyPNG, writePNG } from './png.mjs'
import { DemMosaic, fillThroughMask, readAsciiGrid, resampleGrid } from './raster.mjs'
import { BATHY, DEM, RAIN, bathyFile, bathyMetaFile, findRainGrid, packGrids, paths, readNotes, tilesFor } from './sources.mjs'

// Height encoding (DATA.md §2): metres = (R*256 + G) * SCALE + OFFSET.
export const SCALE = 0.25
export const OFFSET = -6000
const LAND_MIN = Math.floor(-OFFSET / SCALE) + 1 // smallest value that decodes > 0 m
const SEA_MAX = Math.round((-1 - OFFSET) / SCALE) // -1 m: sea is never shallower than this
const FLAT_SEA = -1
// Nothing within the packs is deeper than about 5,800 m (the Hawaiian Deep).
// GMRT's archipelago grid holds two spikes near -10,000 m; values below this
// are treated as gaps and filled from their neighbours by the area average.
const BATHY_MIN = OFFSET

// Rain encoding (DATA.md §2): r = ln(mm / 300) / ln(40), clamped 0..1, as a byte.
const rainByte = (mm) => Math.round(Math.min(1, Math.max(0, Math.log(mm / 300) / Math.log(40))) * 255)
// A pack gets a rain image only if the atlas covers at least this share of its land.
const RAIN_MIN_COVERAGE = 0.5
// Land texels just inside the DEM coastline but outside the atlas grid's own
// coastline take the nearest atlas value, up to this far inland.
const RAIN_FILL_METRES = 2000

const round = (v, d) => Math.round(v * 10 ** d) / 10 ** d

function latestFetched(ledger, files) {
  const ds = files.map((f) => ledger.get(f)?.fetched).filter(Boolean).sort()
  return ds[ds.length - 1]
}

async function bakePack(g, ctx) {
  const { dir, out, ledger, dem, rain, rainFile, notes, log } = ctx
  const { grid } = g
  const { W, H } = grid
  const t0 = Date.now()
  const N = W * H

  // terrain
  const { landFrac, landMean } = dem.resample(grid)
  const bFile = bathyFile(dir, g.id)
  const hasBathy = existsSync(bFile) && statSync(bFile).size > 0
  const bathy = hasBathy ? resampleGrid(readAsciiGrid(bFile, { min: BATHY_MIN, max: 5000 }), grid) : null
  const rgb = new Uint8Array(N * 3)
  const land = new Uint8Array(N)
  let nLand = 0
  let min = Infinity
  let max = -Infinity
  let deepest = 0
  for (let o = 0; o < N; o++) {
    let v
    if (landFrac[o] >= 0.5) {
      land[o] = 1
      nLand++
      v = Math.max(LAND_MIN, Math.round((landMean[o] - OFFSET) / SCALE))
    } else {
      const b = bathy && bathy[o] === bathy[o] ? bathy[o] : FLAT_SEA
      v = Math.min(SEA_MAX, Math.round((Math.max(OFFSET, b) - OFFSET) / SCALE))
    }
    v = Math.max(0, Math.min(65535, v))
    rgb[o * 3] = v >> 8
    rgb[o * 3 + 1] = v & 255
    const m = v * SCALE + OFFSET
    if (m < min) min = m
    if (m > max) max = m
    if (m < deepest) deepest = m
  }
  const packDir = join(out, g.id)
  mkdirSync(packDir, { recursive: true })
  writePNG(join(packDir, 'height.png'), W, H, rgb)

  // rain
  let rainEntry = null
  let rainCoverage = 0
  const rainPath = join(packDir, 'rain.png')
  if (rain) {
    const r = resampleGrid(rain, grid)
    let covered = 0
    for (let o = 0; o < N; o++) {
      if (!land[o]) r[o] = NaN
      else if (r[o] === r[o]) covered++
    }
    const texel = grid.metresPerTexel[0]
    const filled = fillThroughMask(r, land, W, H, Math.max(1, Math.ceil(RAIN_FILL_METRES / texel)))
    rainCoverage = nLand ? (covered + filled) / nLand : 0
    if (rainCoverage >= RAIN_MIN_COVERAGE) {
      const grey = new Uint8Array(N)
      for (let o = 0; o < N; o++) grey[o] = land[o] && r[o] === r[o] ? rainByte(r[o]) : 0
      writeGreyPNG(rainPath, W, H, grey)
      rainEntry = { file: `${g.id}/rain.png` }
      if (rainCoverage < 0.999) {
        // say why: the statewide grid starts at its west edge, east of Niʻihau
        let missing = 0
        let west = 0
        for (let o = 0; o < N; o++) {
          if (land[o] && r[o] !== r[o]) {
            missing++
            if (grid.lonAt(o % W) < rain.west) west++
          }
        }
        const why = west >= 0.99 * missing ? ` (west of the atlas grid's edge at ${rain.west}°, which leaves out Niʻihau)` : ''
        rainEntry.note = `${((1 - rainCoverage) * 100).toFixed(1)}% of land has no atlas value and is 0${why}`
      }
    }
  }
  if (!rainEntry) rmSync(rainPath, { force: true })

  // provenance
  const tiles = tilesFor(grid.bounds)
  const used = tiles.filter((t) => existsSync(join(paths(dir).dem, `USGS_1_${t}.tif`)))
  const probed = new Set((readNotes(dir).demMissing || []).map((m) => m.name))
  const unpublished = tiles.filter((t) => !used.includes(t) && probed.has(t))
  const unfetched = tiles.filter((t) => !used.includes(t) && !probed.has(t))
  const sources = [
    {
      id: DEM.id,
      title: DEM.title,
      url: DEM.url,
      fetched: latestFetched(ledger, used.map((t) => join(paths(dir).dem, `USGS_1_${t}.tif`))),
      licence: DEM.licence,
      note:
        `tiles ${used.join(', ')}` +
        (unpublished.length ? `; ${unpublished.join(', ')} not published by the USGS (no land)` : '') +
        (unfetched.length ? `; the other ${unfetched.length} one-degree cells in the box are open ocean outside every island pack and were not fetched` : '') +
        '; NAD83 geographic, metres; ocean (nodata or 0 in the source) and any cell without a tile are baked as sea; ' +
        'a texel is land where at least half its area is land, and then takes the area-weighted mean of the land cells',
    },
  ]
  if (bathy) {
    const mFile = bathyMetaFile(dir, g.id)
    const meta = existsSync(mFile) ? JSON.parse(readFileSync(mFile, 'utf8')) : {}
    const le = ledger.get(bFile)
    sources.push({
      id: BATHY.id,
      title: `${BATHY.title}${meta.gmrt_version ? `, version ${meta.gmrt_version}` : ''}`,
      url: le?.url ?? BATHY.url,
      fetched: le?.fetched,
      licence: BATHY.licence,
      note:
        `sea texels only, area-weighted from a ${meta.meters_per_node ?? '?'} m grid (ESRI ASCII), never shallower than ${FLAT_SEA} m; ` +
        `cells deeper than ${-BATHY_MIN} m are spikes and treated as gaps; land comes from the DEM`,
    })
  } else {
    notes.push(`${g.id}: no bathymetry, sea is a flat ${FLAT_SEA} m`)
  }
  if (rainEntry) {
    const le = ledger.get(paths(dir).rainZip)
    sources.push({
      id: RAIN.id,
      title: RAIN.title,
      url: RAIN.url,
      fetched: le?.fetched,
      licence: RAIN.licence,
      note: `${rainFile.split('/').pop()}, ${rain.dx} degree cells, WGS84; area-weighted onto the pack, 0 over sea, encoded r = ln(mm/300)/ln(40)`,
    })
  }

  const entry = {
    id: g.id,
    kind: g.kind,
    name: g.name,
    bounds: grid.bounds,
    size: [W, H],
    metresPerTexel: grid.metresPerTexel.map((v) => round(v, 4)),
    height: { file: `${g.id}/height.png`, scale: SCALE, offset: OFFSET },
    ...(rainEntry ? { rain: rainEntry } : {}),
    stats: {
      landFraction: round(nLand / N, 4),
      minMetres: min,
      maxMetres: max,
      ...(rain ? { rainCoverage: round(rainCoverage, 4) } : {}),
    },
    sources,
  }
  if (!rainEntry && rain) notes.push(`${g.id}: the Rainfall Atlas covers ${(rainCoverage * 100).toFixed(0)}% of its land, so it has no rain image`)
  log(
    `  ${g.id.padEnd(11)} ${W}x${H} at ${grid.metresPerTexel[0].toFixed(1)} m, land ${((nLand / N) * 100).toFixed(1)}%, ` +
      `${min} .. ${max} m, rain ${rainEntry ? (rainCoverage * 100).toFixed(1) + '% of land' : 'none'} (${((Date.now() - t0) / 1000).toFixed(1)} s)`,
  )
  return entry
}

export async function bake({ dir, out, only, log }) {
  const ledger = new Ledger(dir)
  const grids = packGrids(dir)
  const notes = []
  mkdirSync(out, { recursive: true })

  log('boundaries:')
  const bnd = bakeBoundaries({ dir, ledger, outDir: join(out, 'boundaries'), log })
  notes.push(...bnd.notes)

  log('DEM:')
  const dem = await DemMosaic.load(paths(dir).dem, log)
  const rainFile = findRainGrid(dir)
  const rain = rainFile ? readAsciiGrid(rainFile) : null
  if (rain) log(`rain grid: ${rainFile.split('/').pop()} ${rain.W}x${rain.H}, ${rain.dx} deg, west ${rain.west} north ${rain.north}`)
  else notes.push('no Rainfall Atlas grid in the downloads; no pack has rain')

  const manifestPath = join(out, 'manifest.json')
  const existing = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : null
  log('packs:')
  const packs = []
  for (const g of grids) {
    if (only && !only.includes(g.id)) {
      const old = existing?.packs?.find((p) => p.id === g.id)
      if (old) packs.push(old)
      continue
    }
    packs.push(await bakePack(g, { dir, out, ledger, dem, rain, rainFile, notes, log }))
  }

  const manifest = {
    projection: { lat0: LAT0, lon0: LON0 },
    packs,
    boundaries: { moku: 'boundaries/moku.geojson', ahupuaa: 'boundaries/ahupuaa.geojson' },
  }
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
  log(`wrote ${manifestPath}`)
  for (const n of notes) log(`note: ${n}`)
}
