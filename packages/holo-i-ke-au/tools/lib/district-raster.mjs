// Raster work for the district packs: the lidar tiles (UTM, 0.5 m) area-
// averaged onto a lon/lat pack grid, the CUDEM sea floor read over the box,
// and the inverse of the UTM projection that both need.
//
// Registration is as everywhere in the bake (DATA.md, "Texel registration"):
// texel (i, j) covers lon west + i·dLon .. west + (i+1)·dLon and lat
// north − j·dLat .. north − (j+1)·dLat, row 0 north. Every 0.5 m lidar cell
// counts toward the one texel its centre falls in, so a texel of about 6 m is
// the mean of some 150 cells: area-true to a quarter of a cell, with no
// point sampling. The lidar is in NAD83(PA11) and the grid in WGS 84; the two
// differ here by about a metre, a sixth of a texel, and are taken as one.
import { availableParallelism } from 'node:os'
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads'
import { utm4 } from './layers-raster.mjs'

let geotiff
async function GeoTIFF() {
  geotiff ||= await import('geotiff')
  return geotiff
}

/** UTM zone 4 (E, N) back to [lon, lat], by Newton's method on the forward projection (to well under a millimetre). */
export function utm4Inverse(E, N) {
  let lon = -159 + (E - 500000) / 104000
  let lat = N / 110700
  for (let k = 0; k < 10; k++) {
    const [e, n] = utm4(lon, lat)
    const dE = E - e
    const dN = N - n
    if (Math.abs(dE) < 1e-5 && Math.abs(dN) < 1e-5) break
    const h = 1e-6
    const [e1, n1] = utm4(lon + h, lat)
    const [e2, n2] = utm4(lon, lat + h)
    const a = (e1 - e) / h
    const b = (e2 - e) / h
    const c = (n1 - n) / h
    const d = (n2 - n) / h
    const det = a * d - b * c
    lon += (d * dE - b * dN) / det
    lat += (a * dN - c * dE) / det
  }
  return [lon, lat]
}

/** Fractional texel coordinates [u, v] of a UTM point on a grid (u east, v south, in texels from the north-west corner). */
function texelOf(grid, E, N) {
  const [lon, lat] = utm4Inverse(E, N)
  return [(lon - grid.bounds[0]) / grid.dLon, (grid.bounds[3] - lat) / grid.dLat]
}

/**
 * Area-average the lidar onto the grid. `squares` is every 500 m square over
 * the box ({ E, N } south-west corners), with `name` set where the survey
 * published a tile, found at tilePath(name); a square with no tile counts as
 * all no-data. In this survey the ocean is no-data (the DEM is clipped at the
 * shoreline the contractor drew), and water inside the coast is flattened to
 * its surface. Cell values less `shift` are metres above mean sea level (the
 * survey's zero sits below it; see district-bake.mjs), and a cell is land
 * when it has data and stands more than `landAbove` over the sea. Returns
 * per texel the share of cells that are land (`landFrac`), the mean of those
 * cells less `shift` (`landMean`, metres above mean sea level), the share
 * with any data (`dataFrac`), and a histogram of cell values near the shift
 * (centimetre bins from shift − 1 m), which is how the water levels were
 * found. The squares are shared out over worker threads (decoding the tiles
 * is most of the time).
 */
export async function accumulateLidar(
  squares,
  grid,
  tilePath,
  { shift = 0, landAbove = 0, cell = 0.5, size = 500, threads = Math.min(4, availableParallelism()), log = () => {} } = {},
) {
  const { W, H } = grid
  const N = W * H
  const cells = new Uint32Array(N)
  const nData = new Uint32Array(N)
  const nLand = new Uint32Array(N)
  const sum = new Float64Array(N)
  const hist = new Float64Array(HIST_BINS)
  const chunks = Array.from({ length: threads }, (_, k) => squares.filter((_, q) => q % threads === k))
  const files = Object.fromEntries(squares.filter((s) => s.name).map((s) => [s.name, tilePath(s.name)]))
  let done = 0
  const t0 = Date.now()
  await Promise.all(
    chunks.map(
      (chunk) =>
        new Promise((resolveChunk, reject) => {
          const w = new Worker(new URL(import.meta.url), {
            workerData: { job: 'lidar', squares: chunk, files, grid: { W, H, bounds: grid.bounds, dLon: grid.dLon, dLat: grid.dLat }, shift, landAbove, cell, size },
          })
          w.on('message', (m) => {
            if (m.progress) {
              done++
              if (done % 100 === 0) log(`  lidar: ${done}/${squares.length} squares (${((Date.now() - t0) / 1000).toFixed(0)} s)`)
              return
            }
            for (let o = 0; o < N; o++) {
              cells[o] += m.cells[o]
              nData[o] += m.nData[o]
              nLand[o] += m.nLand[o]
              sum[o] += m.sum[o]
            }
            for (let k = 0; k < HIST_BINS; k++) hist[k] += m.hist[k]
            resolveChunk()
          })
          w.on('error', reject)
          w.on('exit', (code) => code && reject(new Error(`lidar worker exited with ${code}`)))
        }),
    ),
  )
  const landFrac = new Float32Array(N)
  const dataFrac = new Float32Array(N)
  const landMean = new Float32Array(N)
  let empty = 0
  for (let o = 0; o < N; o++) {
    if (!cells[o]) {
      empty++
      continue
    }
    landFrac[o] = nLand[o] / cells[o]
    dataFrac[o] = nData[o] / cells[o]
    landMean[o] = nLand[o] ? sum[o] / nLand[o] - shift : 0
  }
  if (empty) throw new Error(`${empty} texels received no lidar cell: the squares do not cover the box`)
  const read = squares.filter((s) => s.name).length
  return { landFrac, landMean, dataFrac, hist, histFrom: shift - 1, read, missing: squares.length - read }
}

const HIST_BINS = 200

/** One worker's share: accumulate its squares onto private arrays. */
async function accumulateSquares({ squares, files, grid, shift, landAbove, cell, size }, progress) {
  const { fromFile } = await GeoTIFF()
  const { W, H } = grid
  const N = W * H
  const cells = new Uint32Array(N)
  const nData = new Uint32Array(N)
  const nLand = new Uint32Array(N)
  const sum = new Float64Array(N)
  const hist = new Float64Array(HIST_BINS)
  const hist0 = shift - 1
  const land0 = shift + landAbove
  const n = Math.round(size / cell)
  for (const sq of squares) {
    let data = null
    let nodata = NaN
    if (sq.name) {
      const im = await (await fromFile(files[sq.name])).getImage()
      const [ox, oy] = im.getOrigin()
      const [rx, ry] = im.getResolution()
      if (
        im.getWidth() !== n ||
        im.getHeight() !== n ||
        Math.abs(ox - sq.E) > 1e-6 ||
        Math.abs(oy - (sq.N + size)) > 1e-6 ||
        Math.abs(rx - cell) > 1e-9 ||
        Math.abs(ry + cell) > 1e-9 ||
        im.getSamplesPerPixel() !== 1 ||
        (im.geoKeys?.GTRasterTypeGeoKey ?? 1) !== 1
      ) {
        throw new Error(`${sq.name}: unexpected grid (origin ${ox},${oy} res ${rx},${ry} size ${im.getWidth()}x${im.getHeight()})`)
      }
      ;[data] = await im.readRasters()
      nodata = im.getGDALNoData()
    }
    // the projection is affine to well under a millimetre across 500 m, so
    // texel coordinates are bilinear between the square's corners
    const [uTL, vTL] = texelOf(grid, sq.E, sq.N + size)
    const [uTR, vTR] = texelOf(grid, sq.E + size, sq.N + size)
    const [uBL, vBL] = texelOf(grid, sq.E, sq.N)
    const [uBR, vBR] = texelOf(grid, sq.E + size, sq.N)
    for (let r = 0; r < n; r++) {
      const fy = (r + 0.5) / n
      const uL = uTL + (uBL - uTL) * fy
      const vL = vTL + (vBL - vTL) * fy
      const du = (uTR + (uBR - uTR) * fy - uL) / n
      const dv = (vTR + (vBR - vTR) * fy - vL) / n
      let u = uL + du / 2
      let v = vL + dv / 2
      const row = r * n
      for (let c = 0; c < n; c++, u += du, v += dv) {
        if (u < 0 || v < 0 || u >= W || v >= H) continue
        const o = Math.floor(v) * W + Math.floor(u)
        cells[o]++
        if (!data) continue
        const h = data[row + c]
        if (h === nodata || h !== h) continue
        nData[o]++
        if (h > land0) {
          nLand[o]++
          sum[o] += h
        }
        const b = Math.floor((h - hist0) * 100)
        if (b >= 0 && b < HIST_BINS) hist[b]++
      }
    }
    progress()
  }
  return { cells, nData, nLand, sum, hist }
}

if (!isMainThread && workerData?.job === 'lidar') {
  const r = await accumulateSquares(workerData, () => parentPort.postMessage({ progress: 1 }))
  parentPort.postMessage(r, [r.cells.buffer, r.nData.buffer, r.nLand.buffer, r.sum.buffer, r.hist.buffer])
}

/** Every 500 m square over a UTM extent, with the tile that covers it if the survey has one. */
export function squaresOver(extent, tiles, size = 500) {
  const [e0, n0, e1, n1] = extent
  const byCorner = new Map(tiles.map((t) => [`${t.E},${t.N}`, t]))
  const out = []
  for (let E = Math.floor(e0 / size) * size; E < e1; E += size) {
    for (let N = Math.floor(n0 / size) * size; N < n1; N += size) {
      const t = byCorner.get(`${E},${N}`)
      out.push({ E, N, name: t ? t.name : null })
    }
  }
  return out
}

/**
 * A window of a geographic GeoTIFF (the CUDEM tiles) over bounds, as the
 * generic grid raster.mjs resamples: { west, north, dx, dy, W, H, data },
 * with no-data as NaN.
 */
export async function readGeoWindow(file, bounds, marginCells = 4) {
  const { fromFile } = await GeoTIFF()
  const im = await (await fromFile(file)).getImage()
  let [ox, oy] = im.getOrigin()
  const [rx, ry] = im.getResolution()
  // pixel-is-point georeferencing puts the tie point on the first cell's centre
  if (im.geoKeys?.GTRasterTypeGeoKey === 2) {
    ox -= rx / 2
    oy -= ry / 2
  }
  const dx = rx
  const dy = -ry
  const [w, s, e, n] = bounds
  const c0 = Math.max(0, Math.floor((w - ox) / dx) - marginCells)
  const c1 = Math.min(im.getWidth(), Math.ceil((e - ox) / dx) + marginCells)
  const r0 = Math.max(0, Math.floor((oy - n) / dy) - marginCells)
  const r1 = Math.min(im.getHeight(), Math.ceil((oy - s) / dy) + marginCells)
  if (c1 <= c0 || r1 <= r0) return null
  const [raw] = await im.readRasters({ window: [c0, r0, c1, r1] })
  const nodata = im.getGDALNoData()
  const data = new Float32Array(raw.length)
  for (let k = 0; k < raw.length; k++) {
    const v = raw[k]
    data[k] = v === nodata || !Number.isFinite(v) || v < -12000 ? NaN : v
  }
  return {
    west: ox + c0 * dx,
    north: oy - r0 * dy,
    dx,
    dy,
    W: c1 - c0,
    H: r1 - r0,
    data,
    info: { size: [im.getWidth(), im.getHeight()], nodata, citation: im.geoKeys?.GTCitationGeoKey, epsg: im.geoKeys?.GeographicTypeGeoKey },
  }
}
