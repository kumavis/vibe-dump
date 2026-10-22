// ETOPO 2022 over OPeNDAP: the table's relief (the 60 arc-second surface, in
// bands either side of 180°, stitched into one continuous grid) and a box's
// sea floor where GMRT fails (the 15 arc-second tiles). DATA.md §§2, 7, 11.
//
// The DAP2 reader is R1's (research/R1-terrain-data.md §1.1;
// r1-scripts/dods.mjs and tablebudget.mjs in the research scratchpad): the
// DDS text, "\nData:\n", then XDR big-endian, [n][n] then n values (an Int16
// travels as a 4-byte integer), then each map as [n][n] Float64. What R1
// established about the grids, and this module relies on:
// - 60″: one file, 10800 × 21600 Float32, cell-registered, `lat` ascending
//   from the south, so index row i is centred on −90 + (i + ½)/60 and column j
//   on −180 + (j + ½)/60; _FillValue −99999; heights on EGM2008.
// - 15″: 288 tiles of 3600 × 3600, each named for its north-west corner
//   (N00E150 holds 15° S–0°, 150–165° E), `lat` ascending inside a tile.
// - OPeNDAP subsets are in index space ([start:stride:stop]), exact, and need
//   curl -g so the brackets are not globbed. One request cannot cross 180°,
//   so a range past it is two pieces, the eastern shifted by +360.
//
// Every subset goes through tools/lib/fetch.mjs's curl and ledger into the
// downloads directory; the readers only parse what is on disk.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fetchTo } from './fetch.mjs'

export const ETOPO = {
  doi: '10.25921/fd45-gt74',
  base: 'https://www.ngdc.noaa.gov/thredds/dodsC/global/ETOPO2022',
  page: 'https://www.ncei.noaa.gov/products/etopo-global-relief-model',
  licence: 'public domain (US government work, NOAA NCEI)',
  citation: 'NOAA National Centers for Environmental Information (2022), ETOPO 2022 15 Arc-Second Global Relief Model, doi:10.25921/fd45-gt74',
}
export const ETOPO60_URL = `${ETOPO.base}/60s/60s_surface_elev_netcdf/ETOPO_2022_v1_60s_N90W180_surface.nc`
const FILL = -99999

// ---------------------------------------------------------------------------
// DAP2

/** Parse a .dods (DAP2 binary) holding one Grid with two Float64 maps (lat, lon). */
export function readDods(buf) {
  const marker = Buffer.from('\nData:\n')
  const at = buf.indexOf(marker)
  if (at < 0) throw new Error(`not a DAP2 response: ${buf.subarray(0, 300).toString()}`)
  const dds = buf.subarray(0, at).toString('utf8')
  const m = dds.match(/(Float32|Float64|Int16|Int32|UInt16)\s+\w+\[(\w+) = (\d+)\]\[(\w+) = (\d+)\]/)
  if (!m) throw new Error(`no grid in the DDS: ${dds.slice(0, 300)}`)
  const type = m[1]
  const ny = +m[3]
  const nx = +m[5]
  let o = at + marker.length
  const n = buf.readUInt32BE(o)
  o += 8
  if (n !== nx * ny) throw new Error(`DAP2 count ${n} is not ${nx} × ${ny}`)
  const [size, read] = {
    Float32: [4, (p) => buf.readFloatBE(p)],
    Float64: [8, (p) => buf.readDoubleBE(p)],
    Int16: [4, (p) => buf.readInt32BE(p)],
    UInt16: [4, (p) => buf.readUInt32BE(p)],
    Int32: [4, (p) => buf.readInt32BE(p)],
  }[type]
  const z = new Float32Array(n)
  for (let i = 0; i < n; i++, o += size) {
    const v = read(o)
    z[i] = v === FILL || !Number.isFinite(v) ? NaN : v
  }
  const map = () => {
    const k = buf.readUInt32BE(o)
    o += 8
    const a = new Float64Array(k)
    for (let i = 0; i < k; i++, o += 8) a[i] = buf.readDoubleBE(o)
    return a
  }
  const lat = map()
  const lon = map()
  return { dds, type, nx, ny, z, lat, lon }
}

// ---------------------------------------------------------------------------
// The 60″ surface for the table

const N60 = { rows: 10800, cols: 21600, cell: 1 / 60 }

/**
 * The OPeNDAP requests for envelope [w, s, e, n] (e may exceed 180) at the
 * given stride, in bands of at most maxBytes, aligned so that the stitched
 * grid is regular: every index a multiple of the stride, the eastern piece's
 * columns counted on from 21600.
 */
export function etopo60Requests(envelope, { stride = 2, maxBytes = 20e6, pad = 2 } = {}) {
  const [w, s, e, n] = envelope
  const al = (v) => Math.floor(v / stride) * stride
  const i0 = Math.max(0, al(Math.floor((s + 90) * 60) - pad * stride))
  const i1 = Math.min(N60.rows - 1, Math.ceil((n + 90) * 60) + pad * stride)
  // continuous column index J: lon = −180 + (J + ½)/60, J ≥ 21600 east of 180
  const J0 = al(Math.floor((w + 180) * 60) - pad * stride)
  const J1 = Math.ceil((e + 180) * 60) + pad * stride
  const pieces = []
  if (J0 < N60.cols) pieces.push({ name: 'west-of-180', J0, J1: Math.min(J1, N60.cols - 1), off: 0 })
  if (J1 >= N60.cols) pieces.push({ name: 'east-of-180', J0: Math.max(J0, N60.cols), J1, off: N60.cols })
  const reqs = []
  for (const p of pieces) {
    const j0 = p.J0 - p.off
    const j1 = p.J1 - p.off
    const ncols = Math.floor((j1 - j0) / stride) + 1
    const rowsPerBand = Math.max(stride, al(Math.floor(maxBytes / (4 * ncols)) * stride))
    for (let a = i0; a <= i1; a += rowsPerBand) {
      const b = Math.min(i1, a + rowsPerBand - stride)
      const bAligned = a + Math.floor((b - a) / stride) * stride
      reqs.push({
        piece: p.name,
        off: p.off,
        i0: a,
        i1: bAligned,
        j0,
        j1,
        url: `${ETOPO60_URL}.dods?z[${a}:${stride}:${bAligned}][${j0}:${stride}:${j1}]`,
        file: `etopo60/${p.name}-s${stride}-r${a}-${bAligned}-c${j0}-${j1}.dods`,
      })
    }
  }
  return reqs
}

/** Fetch every band of etopo60Requests into dir; returns the requests with their files' paths. */
export function downloadEtopo60(ledger, dir, envelope, opts = {}, log = () => {}) {
  const reqs = etopo60Requests(envelope, opts)
  let bytes = 0
  for (const r of reqs) {
    const path = join(dir, r.file)
    const res = fetchTo(ledger, r.url, path, { globoff: true, maxTime: 900 })
    if (!res.ok) throw new Error(`ETOPO 60″ band ${r.file}: HTTP ${res.status}`)
    bytes += ledger.get(path).bytes
    log(`  etopo 60″ ${r.piece} rows ${r.i0}–${r.i1}: ${res.cached ? 'cached' : 'fetched'}`)
    r.path = path
  }
  log(`  etopo 60″: ${reqs.length} bands, ${(bytes / 1e6).toFixed(1)} MB`)
  return reqs
}

/**
 * The bands read back and stitched: { lats (ascending, one per row), lons
 * (continuous, one per column), nx, ny, z (row-major, row 0 the southernmost) }.
 * Cells are points at their centres; the table bins them forward.
 */
export function readEtopo60(dir, envelope, opts = {}) {
  const reqs = etopo60Requests(envelope, opts)
  const pieces = new Map()
  for (const r of reqs) {
    const g = readDods(readFileSync(join(dir, r.file)))
    if (!pieces.has(r.piece)) pieces.set(r.piece, { off: r.off, bands: [] })
    pieces.get(r.piece).bands.push(g)
  }
  const parts = [...pieces.values()].map((p) => {
    const lats = []
    for (const b of p.bands) lats.push(...b.lat)
    return { lons: Array.from(p.bands[0].lon, (v) => v + (p.off ? 360 : 0)), lats, bands: p.bands }
  })
  const lats = Float64Array.from(parts[0].lats)
  const lons = Float64Array.from(parts.flatMap((p) => p.lons))
  for (const p of parts) if (p.lats.length !== lats.length) throw new Error('ETOPO pieces disagree on their rows')
  const nx = lons.length
  const ny = lats.length
  const z = new Float32Array(nx * ny)
  let col = 0
  for (const p of parts) {
    let row = 0
    for (const b of p.bands) {
      for (let j = 0; j < b.ny; j++) z.set(b.z.subarray(j * b.nx, (j + 1) * b.nx), (row + j) * nx + col)
      row += b.ny
    }
    col += p.lons.length
  }
  return { lats, lons, nx, ny, z, stride: opts.stride ?? 2 }
}

// ---------------------------------------------------------------------------
// The 15″ tiles for a box

const T15 = 3600
const pad2 = (v) => String(Math.abs(v)).padStart(2, '0')
const pad3 = (v) => String(Math.abs(v)).padStart(3, '0')

/** A 15″ tile's file name from its north-west corner (lon in [−180, 180)). */
export function etopo15Name(north, west) {
  return `ETOPO_2022_v1_15s_${north < 0 ? 'S' : 'N'}${pad2(north)}${west < 0 ? 'W' : 'E'}${pad3(west)}_surface.nc`
}

/**
 * The subsets of the 15″ tiles that cover bounds [w, s, e, n] (continuous
 * longitudes; e may exceed 180), padded by `pad` cells.
 */
export function etopo15Requests(bounds, { pad = 4 } = {}) {
  const [w, s, e, n] = bounds
  const reqs = []
  for (let tn = Math.floor(s / 15) * 15 + 15; tn - 15 < n; tn += 15) {
    for (let tw = Math.floor(w / 15) * 15; tw < e; tw += 15) {
      const wrapped = ((((tw + 180) % 360) + 360) % 360) - 180 // the tile's name; tw is continuous
      const off = tw - wrapped
      const i0 = Math.max(0, Math.floor((s - (tn - 15)) * 240) - pad)
      const i1 = Math.min(T15 - 1, Math.ceil((n - (tn - 15)) * 240) + pad)
      const j0 = Math.max(0, Math.floor((w - tw) * 240) - pad)
      const j1 = Math.min(T15 - 1, Math.ceil((e - tw) * 240) + pad)
      if (i1 < i0 || j1 < j0) continue
      const name = etopo15Name(tn, wrapped)
      reqs.push({
        name,
        off,
        i0,
        i1,
        j0,
        j1,
        url: `${ETOPO.base}/15s/15s_surface_elev_netcdf/${name}.dods?z[${i0}:1:${i1}][${j0}:1:${j1}]`,
        file: `etopo15/${name.replace('.nc', '')}-r${i0}-${i1}-c${j0}-${j1}.dods`,
      })
    }
  }
  return reqs
}

export function downloadEtopo15(ledger, dir, bounds, log = () => {}) {
  const reqs = etopo15Requests(bounds)
  for (const r of reqs) {
    const path = join(dir, r.file)
    const res = fetchTo(ledger, r.url, path, { globoff: true, maxTime: 300 })
    if (!res.ok) throw new Error(`ETOPO 15″ ${r.name}: HTTP ${res.status}`)
    log(`  etopo 15″ ${r.name} [${r.i0}:${r.i1}][${r.j0}:${r.j1}]: ${res.cached ? 'cached' : 'fetched'}`)
  }
  return reqs
}

/**
 * The 15″ subsets over bounds as one grid in the convention of
 * tools/lib/raster.mjs (rows north to south, cell edges, continuous lon),
 * NaN where no tile reached.
 */
export function readEtopo15(dir, bounds) {
  const reqs = etopo15Requests(bounds)
  const parts = reqs.map((r) => ({ r, g: readDods(readFileSync(join(dir, r.file))) }))
  const cell = 1 / 240
  let west = Infinity
  let east = -Infinity
  let south = Infinity
  let north = -Infinity
  for (const { r, g } of parts) {
    west = Math.min(west, g.lon[0] + r.off - cell / 2)
    east = Math.max(east, g.lon[g.nx - 1] + r.off + cell / 2)
    south = Math.min(south, g.lat[0] - cell / 2)
    north = Math.max(north, g.lat[g.ny - 1] + cell / 2)
  }
  const W = Math.round((east - west) / cell)
  const H = Math.round((north - south) / cell)
  const data = new Float32Array(W * H).fill(NaN)
  for (const { r, g } of parts) {
    const c0 = Math.round((g.lon[0] + r.off - cell / 2 - west) / cell)
    for (let j = 0; j < g.ny; j++) {
      const row = Math.round((north - (g.lat[j] + cell / 2)) / cell) // lat ascends in the file; rows run north to south here
      data.set(g.z.subarray(j * g.nx, (j + 1) * g.nx), row * W + c0)
    }
  }
  return { west, north, dx: cell, dy: cell, W, H, data, tiles: reqs.map((r) => r.name) }
}
