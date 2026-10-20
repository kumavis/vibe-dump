// The --bake step for a district pack (DATA.md, "District packs"): heights
// from the lidar, sea floor from the CUDEM, rain from the atlas, the breaches
// that let the streams through, and the shoreline patches. Writes only
// public/data/districts/manifest.json and the district's own images and
// supporting files; features.json beside them is hand-written and is left
// alone.
//
// What the sources turned out to hold, and what this does about it:
// - The lidar's zero is the survey's geoid (GEOID12B, labelled NAVD88), which
//   here lies about 0.72 m below local mean sea level: flat ground below
//   20 m stands that much higher than in the CUDEM, which is on mean sea
//   level, and the water the contractor flattened sits at +0.6 to +0.8 m.
//   The bake subtracts the shift (and re-measures it every time).
// - Water inside the coast (the Ala Wai, the tidal reaches of the streams,
//   lagoons) is flattened to the water level of the day it was flown, which
//   here lies between 0.35 m below and 0.1 m above mean sea level. A cell
//   therefore counts as land only above +0.2 m, so that water reads as water;
//   otherwise the land and sea rules are the island packs' (a texel is land
//   when at least half its area is land, and holds the mean of its land).
// - The survey left out the windward face of the pali: 112 of the 676 500 m
//   squares over the box have no tile, all of them either open sea or the
//   cliffs past the crest. There the heights are the CUDEM's own land, which
//   its spatial metadata says is the 2013 NOAA Oʻahu lidar on the lower
//   slopes and the USGS 1/3 arc-second DEM (about 10 m) on the cliffs, moved
//   to meet the lidar along the seam (the difference along the seam is spread
//   over the gap as a smooth correction). The windward drop is there, but
//   softer than the lidar side.
// - The streams are routed, not baked; the State's stream lines are fetched
//   only to check that each named trunk keeps to its mapped course.
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { OFFSET, SCALE } from './bake-run.mjs'
import { carveBreaches, streamReport } from './district-water.mjs'
import { accumulateLidar, readGeoWindow, squaresOver } from './district-raster.mjs'
import { buildPatches } from './district-maps.mjs'
import {
  CUDEM,
  LIDAR,
  STREAMS,
  cudemTilesFor,
  districtGrid,
  districtPaths,
  fetchedOf,
  gmrtRequest,
  readJson,
  utmExtent,
} from './district-sources.mjs'
import { Ledger } from './fetch.mjs'
import { writeGreyPNG, writePNG } from './png.mjs'
import { distanceTo } from './layers-raster.mjs'
import { fillThroughMask, readAsciiGrid, resampleGrid } from './raster.mjs'
import { BATHY, RAIN, findRainGrid, paths as islandPaths } from './sources.mjs'

// The survey's zero below local mean sea level, metres: the median of
// (lidar − CUDEM) over texels of flat ground below 20 m that both hold,
// measured on these downloads; every bake measures it again and stops if the
// two disagree by more than SHIFT_TOLERANCE.
export const LIDAR_SHIFT = 0.72
const SHIFT_TOLERANCE = 0.1
// A lidar cell is land when it stands more than this above mean sea level.
export const LAND_ABOVE = 0.2
const LAND_MIN = Math.floor(-OFFSET / SCALE) + 1 // smallest value that decodes > 0 m
const SEA_MAX = Math.round((-1 - OFFSET) / SCALE) // sea is never shallower than -1 m
const FLAT_SEA = -1
// A texel joins the gap (no lidar, filled from the CUDEM's land) when part of
// it has no lidar cell, the CUDEM puts it over GAP_MIN_METRES, and it lies at
// least GAP_FROM_SEA metres from the CUDEM's own sea.
const GAP_MIN_METRES = 2
const GAP_FROM_SEA = 150

const rainByte = (mm) => Math.round(Math.min(1, Math.max(0, Math.log(mm / 300) / Math.log(40))) * 255)
const RAIN_FILL_METRES = 2000

const round = (v, d) => Math.round(v * 10 ** d) / 10 ** d

function median(a) {
  if (!a.length) return NaN
  const s = Float64Array.from(a).sort()
  return s[Math.floor(s.length / 2)]
}

/**
 * Spread the lidar − CUDEM difference along the seam over the gap: solve
 * Laplace's equation for the correction on the gap texels, with the seam
 * differences fixed where the gap meets full lidar texels (and free at the
 * edges of the box). Successive over-relaxation from the seam median.
 */
function seamCorrection(gap, seamDiff, W, H, sweeps = 3000) {
  const N = W * H
  const corr = new Float32Array(N)
  const vals = []
  for (let o = 0; o < N; o++) if (seamDiff[o] === seamDiff[o]) vals.push(seamDiff[o])
  const start = median(vals) || 0
  const ids = []
  for (let o = 0; o < N; o++) {
    if (gap[o]) {
      corr[o] = start
      ids.push(o)
    } else if (seamDiff[o] === seamDiff[o]) corr[o] = seamDiff[o]
  }
  const fixed = (o) => !gap[o] && seamDiff[o] === seamDiff[o]
  const omega = 1.9
  for (let s = 0; s < sweeps; s++) {
    let change = 0
    for (const o of ids) {
      const x = o % W
      let sum = 0
      let n = 0
      if (x > 0 && (gap[o - 1] || fixed(o - 1))) (sum += corr[o - 1]), n++
      if (x < W - 1 && (gap[o + 1] || fixed(o + 1))) (sum += corr[o + 1]), n++
      if (o >= W && (gap[o - W] || fixed(o - W))) (sum += corr[o - W]), n++
      if (o < N - W && (gap[o + W] || fixed(o + W))) (sum += corr[o + W]), n++
      if (!n) continue
      const next = corr[o] + omega * (sum / n - corr[o])
      change = Math.max(change, Math.abs(next - corr[o]))
      corr[o] = next
    }
    if (change < 1e-3) break
  }
  return corr
}

export async function bakeDistrict({ dir, data, d, breaches: breachArg, log }) {
  const t0 = Date.now()
  const ledger = new Ledger(dir)
  const p = districtPaths(dir, d.id)
  const grid = districtGrid(d)
  const { W, H } = grid
  const N = W * H
  const texel = grid.metresPerTexel[0]
  const outDir = join(data, 'districts', d.id)
  mkdirSync(outDir, { recursive: true })
  log(`${d.id}: ${W}x${H} at ${texel.toFixed(2)} m over ${grid.bounds.join(', ')}`)

  // --- lidar
  const tiles = JSON.parse(readFileSync(p.lidarTiles, 'utf8'))
  const squares = squaresOver(utmExtent(grid.bounds), tiles)
  const lidar = await cachedLidar(p, squares, grid, log)
  log(`  lidar: ${lidar.read} tiles read, ${lidar.missing} squares with none (${((Date.now() - t0) / 1000).toFixed(0)} s)`)

  // --- CUDEM: sea floor, the datum check, and the gap
  const cudemTiles = cudemTilesFor(dir, d, grid.bounds)
    .map((t) => t.name)
    .filter((n) => existsSync(p.cudemTile(n)))
  const cudemAll = new Float32Array(N).fill(NaN)
  const cudemSea = new Float32Array(N).fill(NaN)
  for (const name of cudemTiles) {
    const win = await readGeoWindow(p.cudemTile(name), grid.bounds)
    if (!win) continue
    const all = resampleGrid(win, grid)
    const seaOnly = { ...win, data: win.data.map((v) => (v < 0 ? v : NaN)) }
    const sea = resampleGrid(seaOnly, grid)
    for (let o = 0; o < N; o++) {
      if (all[o] === all[o] && cudemAll[o] !== cudemAll[o]) cudemAll[o] = all[o]
      if (sea[o] === sea[o] && cudemSea[o] !== cudemSea[o]) cudemSea[o] = sea[o]
    }
  }
  const diffs = []
  for (let o = 0; o < N; o += 3) {
    if (lidar.landFrac[o] > 0.999 && cudemAll[o] > 0.5 && lidar.landMean[o] > 0.5 && lidar.landMean[o] < 20) diffs.push(lidar.landMean[o] - cudemAll[o])
  }
  const residual = median(diffs)
  log(`  datum: lidar less ${LIDAR_SHIFT} m stands ${residual.toFixed(3)} m over the CUDEM on ${diffs.length} flat texels`)
  if (!(Math.abs(residual) <= SHIFT_TOLERANCE)) throw new Error(`the lidar's datum shift moved: residual ${residual} m against the CUDEM (expected within ${SHIFT_TOLERANCE})`)

  const cudemSeaMask = new Uint8Array(N)
  for (let o = 0; o < N; o++) cudemSeaMask[o] = cudemAll[o] <= 0 ? 1 : 0
  const fromSea = distanceTo(cudemSeaMask, W, H, texel)
  const gap = new Uint8Array(N)
  let gapTexels = 0
  for (let o = 0; o < N; o++) {
    if (lidar.dataFrac[o] < 0.999 && cudemAll[o] > GAP_MIN_METRES && fromSea[o] > GAP_FROM_SEA) {
      gap[o] = 1
      gapTexels++
    }
  }
  // seam: full lidar texels beside the gap carry their difference to the CUDEM
  const seamDiff = new Float32Array(N).fill(NaN)
  for (let o = 0; o < N; o++) {
    if (gap[o] || lidar.landFrac[o] < 0.999 || !(cudemAll[o] > 0)) continue
    const x = o % W
    if ((x > 0 && gap[o - 1]) || (x < W - 1 && gap[o + 1]) || (o >= W && gap[o - W]) || (o < N - W && gap[o + W])) seamDiff[o] = lidar.landMean[o] - cudemAll[o]
  }
  const corr = gapTexels ? seamCorrection(gap, seamDiff, W, H) : new Float32Array(N)
  const seamVals = [...seamDiff].filter((v) => v === v)
  log(`  gap: ${gapTexels} texels (${((gapTexels / N) * 100).toFixed(1)}%) from the CUDEM, seam difference median ${median(seamVals).toFixed(2)} m over ${seamVals.length} texels`)

  // --- land and sea
  let gmrt = null
  if (existsSync(p.gmrt) && statSync(p.gmrt).size > 0) gmrt = resampleGrid(readAsciiGrid(p.gmrt, { min: OFFSET, max: 5000 }), grid)
  const metres = new Float32Array(N)
  const land = new Uint8Array(N)
  let nLand = 0
  let seaFromCudem = 0
  let seaFromGmrt = 0
  let seaInland = 0
  let seaFlat = 0
  for (let o = 0; o < N; o++) {
    let frac = lidar.landFrac[o]
    let mean = lidar.landMean[o]
    if (gap[o]) {
      // the part without lidar is land at the CUDEM's height, corrected
      const missing = 1 - lidar.dataFrac[o]
      const fill = cudemAll[o] + corr[o]
      mean = (frac * mean + missing * fill) / (frac + missing)
      frac += missing
    }
    if (frac >= 0.5) {
      land[o] = 1
      nLand++
      metres[o] = Math.max(LAND_MIN * SCALE + OFFSET, mean)
    } else {
      let b = cudemSea[o]
      if (b === b) seaFromCudem++
      else if (cudemAll[o] === cudemAll[o]) {
        // water inside the coast that the CUDEM holds as land (a canal, a
        // tidal stream, a lagoon narrower than its cells): a flat water surface
        b = FLAT_SEA
        seaInland++
      } else if (gmrt && gmrt[o] === gmrt[o]) {
        b = gmrt[o]
        seaFromGmrt++
      } else {
        b = FLAT_SEA
        seaFlat++
      }
      metres[o] = Math.min(FLAT_SEA, Math.max(OFFSET, b))
    }
  }
  log(`  land ${((nLand / N) * 100).toFixed(1)}%; sea from the CUDEM ${seaFromCudem}, water inside the coast ${seaInland}, GMRT ${seaFromGmrt}, flat ${seaFlat} texels`)

  // --- rain (before the breaches, which change no land/sea)
  const rainFile = findRainGrid(dir)
  if (!rainFile) throw new Error('no Rainfall Atlas grid in the downloads; run --download')
  const rainGrid = readAsciiGrid(rainFile)
  const rain = resampleGrid(rainGrid, grid)
  let covered = 0
  for (let o = 0; o < N; o++) {
    if (!land[o]) rain[o] = NaN
    else if (rain[o] === rain[o]) covered++
  }
  const filled = fillThroughMask(rain, land, W, H, Math.ceil(RAIN_FILL_METRES / texel))
  const rainCoverage = nLand ? (covered + filled) / nLand : 0
  const rainGrey = new Uint8Array(N)
  for (let o = 0; o < N; o++) rainGrey[o] = land[o] && rain[o] === rain[o] ? rainByte(rain[o]) : 0
  writeGreyPNG(join(outDir, 'rain.png'), W, H, rainGrey)
  log(`  rain: ${rainFile.split('/').pop()}, ${(rainCoverage * 100).toFixed(1)}% of land (${filled} texels filled from the nearest atlas cell)`)

  // --- breaches
  const breaches = breachArg || d.breaches || []
  const carved = carveBreaches(metres, land, grid, breaches)
  for (const b of carved) log(`  breach ${b.name}: ${b.texels} texels, cut up to ${b.maxCut.toFixed(1)} m`)

  // --- height image
  const rgb = new Uint8Array(N * 3)
  let min = Infinity
  let max = -Infinity
  for (let o = 0; o < N; o++) {
    let v = land[o] ? Math.max(LAND_MIN, Math.round((metres[o] - OFFSET) / SCALE)) : Math.min(SEA_MAX, Math.round((metres[o] - OFFSET) / SCALE))
    v = Math.max(0, Math.min(65535, v))
    rgb[o * 3] = v >> 8
    rgb[o * 3 + 1] = v & 255
    const m = v * SCALE + OFFSET
    metres[o] = m
    if (m < min) min = m
    if (m > max) max = m
  }
  writePNG(join(outDir, 'height.png'), W, H, rgb)

  // --- streams, on the baked heights
  const rainMm = new Float32Array(N)
  for (let o = 0; o < N; o++) rainMm[o] = land[o] ? 300 * Math.pow(40, rainGrey[o] / 255) : 0
  const mappedStreams = JSON.parse(readFileSync(p.streams, 'utf8'))
  const streams = streamReport(metres, land, grid, rainMm, d.streams || [], mappedStreams)
  for (const s of streams) log(`  stream ${s.name}: ${s.summary}`)

  // --- patches
  const patches = await buildPatches({ dir, d, grid, land, metres, outDir, ledger, log })

  // --- provenance
  const lidarMeta = existsSync(p.lidarMeta) ? readFileSync(p.lidarMeta, 'utf8') : ''
  const beg = /<begdate>(\d{8})/.exec(lidarMeta)?.[1]
  const end = /<enddate>(\d{8})/.exec(lidarMeta)?.[1]
  const iso = (s) => (s ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}` : null)
  const gmrtMeta = readJson(p.gmrtMeta) || {}
  const sources = [
    {
      id: LIDAR.id,
      title: LIDAR.title,
      url: `${LIDAR.base}/`,
      fetched: fetchedOf(ledger, tiles.map((t) => p.lidarTile(t.name))),
      licence: LIDAR.licence,
      ...(beg ? { collected: `${iso(beg)} to ${iso(end)}` } : {}),
      note:
        `${lidar.read} tiles (${tiles[0].name} … ${tiles[tiles.length - 1].name}, part ${[...new Set(tiles.map((t) => t.part))].join(', ')}); ` +
        `every 0.5 m cell counts toward the texel its centre falls in. The survey's zero is ${LIDAR_SHIFT} m below mean sea level ` +
        `(measured against the CUDEM on flat ground; residual ${residual.toFixed(2)} m) and is moved to it. A cell is land above ` +
        `+${LAND_ABOVE} m, because water inside the coast is flattened to the level of the day it was flown (−0.35 to +0.1 m); ` +
        `a texel is land when at least half its cells are, and holds their mean (never below ${LAND_MIN * SCALE + OFFSET} m). ` +
        `${lidar.missing} of the ${squares.length} squares over the box have no tile: open sea, and the windward face of the pali (see the CUDEM)`,
    },
    {
      id: CUDEM.id,
      title: CUDEM.title,
      url: CUDEM.page,
      fetched: fetchedOf(ledger, cudemTiles.map((n) => p.cudemTile(n))),
      licence: CUDEM.licence,
      note:
        `tile ${cudemTiles.join(', ')}, about 3 m cells. Sea texels: the area-weighted mean of the cells below mean sea level, never shallower than ${FLAT_SEA} m ` +
        `(${seaFromCudem} texels; the reef flats from topobathymetric lidar, the harbour and channels from NOAA surveys); ${seaInland} texels of water inside ` +
        `the coast that the CUDEM holds as land (the Ala Wai, the tidal reaches of the streams, lagoons) are a flat ${FLAT_SEA} m. Land: ${gapTexels} texels ` +
        `(${((gapTexels / N) * 100).toFixed(1)}% of the pack) on the windward face of the pali, where the lidar has no tile, are the CUDEM's land there ` +
        `(the 2013 NOAA Oʻahu lidar on the lower slopes, the USGS 1/3 arc-second DEM on the cliffs, per its spatial metadata) plus a smooth correction ` +
        `that meets the lidar along the seam (seam difference median ${median(seamVals).toFixed(1)} m)`,
    },
  ]
  if (gmrt && seaFromGmrt) {
    const le = ledger.get(p.gmrt)
    sources.push({
      id: BATHY.id,
      title: `${BATHY.title}${gmrtMeta.gmrt_version ? `, version ${gmrtMeta.gmrt_version}` : ''}`,
      url: le?.url ?? gmrtRequest(grid).url,
      fetched: le?.fetched,
      licence: BATHY.licence,
      note: `the fallback for sea texels the CUDEM leaves empty: ${seaFromGmrt} texels`,
    })
  }
  sources.push({
    id: RAIN.id,
    title: RAIN.title,
    url: RAIN.url,
    fetched: ledger.get(islandPaths(dir).rainZip)?.fetched,
    licence: RAIN.licence,
    note: `${rainFile.split('/').pop()}, ${rainGrid.dx} degree cells; interpolated onto the pack (the cells are 40 times the texel), 0 over sea, encoded r = ln(mm/300)/ln(40)`,
  })
  sources.push(...patches.sources)
  sources.push({
    id: STREAMS.id,
    title: STREAMS.title,
    url: STREAMS.service,
    fetched: ledger.get(p.streams)?.fetched,
    licence: STREAMS.licence,
    note: `${mappedStreams.features.length} lines; ${STREAMS.note}`,
  })

  const entry = {
    id: d.id,
    name: d.name,
    island: d.island,
    parent: d.island,
    bounds: grid.bounds,
    size: [W, H],
    metresPerTexel: grid.metresPerTexel.map((v) => round(v, 4)),
    height: { file: `${d.id}/height.png`, scale: SCALE, offset: OFFSET },
    rain: { file: `${d.id}/rain.png` },
    patches: patches.entries,
    features: `${d.id}/features.json`,
    ...(patches.files.length ? { files: patches.files } : {}),
    breaches: carved.map((b) => ({ name: b.name, points: b.points, ...(b.why ? { why: b.why } : {}), texels: b.texels, cutMetres: round(b.maxCut, 1) })),
    streams: streams.map((s) => ({ name: s.name, ...s.result })),
    stats: {
      landFraction: round(nLand / N, 4),
      minMetres: min,
      maxMetres: max,
      rainCoverage: round(rainCoverage, 4),
      lidarShare: round((nLand - countGapLand(gap, land)) / Math.max(1, nLand), 4),
      datumShiftMetres: LIDAR_SHIFT,
    },
    sources,
  }

  const manifestPath = join(data, 'districts', 'manifest.json')
  const existing = readJson(manifestPath)
  const districts = (existing?.districts || []).filter((x) => x.id !== d.id)
  districts.push(entry)
  districts.sort((a, b) => (a.id < b.id ? -1 : 1))
  writeFileSync(manifestPath, JSON.stringify({ projection: { lat0: 20.5, lon0: -157.5 }, districts }, null, 2) + '\n')
  log(`wrote ${manifestPath} (${((Date.now() - t0) / 1000).toFixed(0)} s)`)
}

// The accumulation reads 1.3 GB of tiles; its result is kept in the downloads
// directory, keyed by everything it depends on, so a re-bake from the same
// downloads (to change a patch or a breach) takes seconds.
async function cachedLidar(p, squares, grid, log) {
  const key = createHash('sha256')
    .update(JSON.stringify({ squares, bounds: grid.bounds, W: grid.W, H: grid.H, shift: LIDAR_SHIFT, landAbove: LAND_ABOVE, v: 1 }))
    .digest('hex')
    .slice(0, 16)
  const file = join(p.root, 'cache', `lidar-${key}.bin`)
  const N = grid.W * grid.H
  if (existsSync(file)) {
    const buf = readFileSync(file)
    const head = JSON.parse(buf.subarray(0, buf.readUInt32LE(0) + 4).subarray(4).toString('utf8'))
    let off = buf.readUInt32LE(0) + 4
    const take = () => {
      const a = new Float32Array(buf.buffer.slice(buf.byteOffset + off, buf.byteOffset + off + N * 4))
      off += N * 4
      return a
    }
    log(`  lidar: from the cache (${file})`)
    return { ...head, landFrac: take(), landMean: take(), dataFrac: take() }
  }
  const r = await accumulateLidar(squares, grid, p.lidarTile, { shift: LIDAR_SHIFT, landAbove: LAND_ABOVE, log })
  const head = Buffer.from(JSON.stringify({ read: r.read, missing: r.missing, histFrom: r.histFrom, hist: [...r.hist] }))
  const len = Buffer.alloc(4)
  len.writeUInt32LE(head.length)
  mkdirSync(join(p.root, 'cache'), { recursive: true })
  writeFileSync(file, Buffer.concat([len, head, Buffer.from(r.landFrac.buffer), Buffer.from(r.landMean.buffer), Buffer.from(r.dataFrac.buffer)]))
  return r
}

function countGapLand(gap, land) {
  let n = 0
  for (let o = 0; o < gap.length; o++) if (gap[o] && land[o]) n++
  return n
}

