// Cloud-optimised GeoTIFF windows read by HTTP range through curl: the land of
// a battle box from Copernicus GLO-30 (DATA.md §7), and NOAA's CUDEM tiles for
// Pearl Harbor's harbour and south shore, which are tiled GeoTIFFs too.
//
// The curl-backed geotiff.js client is R1's (research/R1-terrain-data.md §2.2;
// r1-scripts/curlclient.mjs and downloads/R1/poc-script/poc-box.mjs in the
// research scratchpad), with retries added: curl honours the machine's proxy
// and Node's fetch does not. geotiff is pinned at 2.1.3 (ENGINEERING.md §0):
// the client is written against its 2.x BaseClient.
//
// What a window read does, after R1 and the POC:
// - GLO-30 tiles are PixelIsPoint (GTRasterTypeGeoKey 2): the tiepoint is the
//   centre of pixel (0, 0), so cell edges sit half a cell west and north of it
//   (geotiff.js's getBoundingBox ignores this). The shift is applied whenever
//   the raster type says so; a PixelIsArea raster (CUDEM) is left alone.
// - An overview is chosen whose cell is at most `maxCell` degrees (half a
//   texel, DATA.md §7); where no overview is that fine, the full resolution.
//   Overviews cover the full image's extent, so their cell edges are computed
//   from the full image's.
// - A window is returned as a grid { west, north, dx, dy, W, H, data } in the
//   convention of tools/lib/raster.mjs (rows north to south, cell edges),
//   NaN where the raster has its nodata value, so resampleGrid and the
//   half-land binning of tools/bake-box.mjs read it directly.
// - Every window read is cached in the downloads directory as raw Float32
//   with a JSON header and recorded in the ledger (fetch.mjs) with its URL,
//   date, size and SHA-256, like every other download: --download reads,
//   --bake only loads.
import { execFile } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { BaseClient, BaseResponse, fromCustomClient } from 'geotiff'
import { sha256, today } from './fetch.mjs'

export const tally = { requests: 0, bytes: 0 }

class CurlResponse extends BaseResponse {
  constructor(status, headers, body) {
    super()
    this._status = status
    this._headers = headers
    this._body = body
  }
  get status() {
    return this._status
  }
  getHeader(name) {
    return this._headers[name.toLowerCase()]
  }
  async getData() {
    return this._body.buffer.slice(this._body.byteOffset, this._body.byteOffset + this._body.byteLength)
  }
}

function curlOnce(args) {
  return new Promise((res, rej) =>
    execFile('curl', args, { encoding: 'buffer', maxBuffer: 1 << 30 }, (e, so, se) => (e ? rej(new Error(String(se || '').trim() || e.message)) : res(so))),
  )
}

/** A geotiff.js client whose every range request is a curl process (headers and body both to stdout). */
export class CurlClient extends BaseClient {
  async request({ headers = {} } = {}) {
    const args = ['-sS', '--retry', '4', '--retry-delay', '2', '--max-time', '300', '-D', '-', '-o', '-']
    for (const [k, v] of Object.entries(headers)) args.push('-H', `${k}: ${v}`)
    args.push(this.url)
    let out
    for (let attempt = 1; ; attempt++) {
      try {
        out = await curlOnce(args)
        break
      } catch (e) {
        if (attempt >= 4) throw e
        await new Promise((r) => setTimeout(r, 2000 * attempt))
      }
    }
    // Split off the last header block: a proxy adds "HTTP/1.1 200 Connection established" first.
    let o = 0
    let status = 0
    let hdrs = {}
    for (;;) {
      const end = out.indexOf('\r\n\r\n', o)
      if (end < 0) throw new Error(`no HTTP header from ${this.url}`)
      const lines = out.subarray(o, end).toString('latin1').split('\r\n')
      status = +lines[0].split(' ')[1]
      hdrs = {}
      for (const l of lines.slice(1)) {
        const i = l.indexOf(':')
        if (i > 0) hdrs[l.slice(0, i).trim().toLowerCase()] = l.slice(i + 1).trim()
      }
      o = end + 4
      if (!(status === 100 || (status === 200 && /connection established/i.test(lines[0])))) break
    }
    const body = out.subarray(o)
    tally.requests++
    tally.bytes += body.length
    if (status >= 400) throw new Error(`HTTP ${status} for ${this.url}`)
    return new CurlResponse(status, hdrs, body)
  }
}

/**
 * Open a COG by URL. Returns { url, tiff, levels }: levels[0] is the full
 * image, then each overview, each with its size, its cell in degrees and
 * its outer edges (west, north) after the PixelIsPoint shift.
 */
export async function openCog(url) {
  const tiff = await fromCustomClient(new CurlClient(url), { allowFullFile: false, blockSize: 65536 })
  const n = await tiff.getImageCount()
  const img0 = await tiff.getImage(0)
  const W0 = img0.getWidth()
  const H0 = img0.getHeight()
  const [ox, oy] = img0.getOrigin()
  const [rx, ry] = img0.getResolution() // ry < 0
  const keys = img0.getGeoKeys() || {}
  const pixelIsPoint = keys.GTRasterTypeGeoKey === 2
  const west = pixelIsPoint ? ox - rx / 2 : ox
  const north = pixelIsPoint ? oy - ry / 2 : oy
  const nd = img0.getGDALNoData()
  const levels = []
  for (let i = 0; i < n; i++) {
    const image = i === 0 ? img0 : await tiff.getImage(i)
    const W = image.getWidth()
    const H = image.getHeight()
    levels.push({ index: i, image, W, H, dx: (rx * W0) / W, dy: (-ry * H0) / H, west, north })
  }
  return { url, tiff, levels, pixelIsPoint, nodata: nd, W0, H0, west, north, east: west + rx * W0, south: north + ry * H0 }
}

/** The coarsest level whose cell (its larger side, in degrees) is at most maxCell; the full image if none is. */
export function pickLevel(cog, maxCell) {
  let best = cog.levels[0]
  for (const L of cog.levels) if (Math.max(L.dx, L.dy) <= maxCell + 1e-12 && L.dx > best.dx) best = L
  return best
}

/**
 * Read the cells of a COG that meet bounds [w, s, e, n] (in the raster's own
 * longitudes), at the level pickLevel chooses for maxCell (or `level`),
 * padded by `pad` cells. Returns the grid, or null when the window misses.
 */
export async function readWindow(cog, bounds, { maxCell = 0, level = null, pad = 1 } = {}) {
  const L = level !== null ? cog.levels[level] : pickLevel(cog, maxCell)
  const [w, s, e, n] = bounds
  const c0 = Math.max(0, Math.floor((w - L.west) / L.dx) - pad)
  const c1 = Math.min(L.W, Math.ceil((e - L.west) / L.dx) + pad)
  const r0 = Math.max(0, Math.floor((L.north - n) / L.dy) - pad)
  const r1 = Math.min(L.H, Math.ceil((L.north - s) / L.dy) + pad)
  if (c1 <= c0 || r1 <= r0) return null
  const before = tally.bytes
  const [r] = await L.image.readRasters({ window: [c0, r0, c1, r1] })
  const W = c1 - c0
  const H = r1 - r0
  const data = new Float32Array(W * H)
  const nd = cog.nodata
  for (let i = 0; i < W * H; i++) {
    const v = r[i]
    data[i] = (nd !== null && nd !== undefined && v === nd) || !Number.isFinite(v) || v < -1e5 ? NaN : v
  }
  return {
    west: L.west + c0 * L.dx,
    north: L.north - r0 * L.dy,
    dx: L.dx,
    dy: L.dy,
    W,
    H,
    data,
    level: L.index,
    levelSize: [L.W, L.H],
    bytes: tally.bytes - before,
  }
}

// ---------------------------------------------------------------------------
// The cache in the downloads directory

/** Write a grid as file (raw little-endian Float32) and file + '.json' (its header), and put it in the ledger. */
export function saveGrid(ledger, file, grid, info) {
  mkdirSync(dirname(file), { recursive: true })
  const { data, ...head } = grid
  writeFileSync(file, Buffer.from(data.buffer, data.byteOffset, data.byteLength))
  writeFileSync(file + '.json', JSON.stringify({ ...head, ...info }, null, 1) + '\n')
  ledger.put(file, { ...info, fetched: today(), bytes: statSync(file).size, sha256: sha256(file) })
}

/** A grid saveGrid wrote, or null when it is not on disk (or does not match its ledger entry's size). */
export function loadGrid(ledger, file) {
  if (!existsSync(file) || !existsSync(file + '.json')) return null
  const known = ledger.get(file)
  if (!known || known.bytes !== statSync(file).size) return null
  const head = JSON.parse(readFileSync(file + '.json', 'utf8'))
  const buf = readFileSync(file)
  const data = new Float32Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength))
  if (data.length !== head.W * head.H) return null
  return { ...head, data }
}

/**
 * A window from the cache, or read from the COG at url and cached. key names
 * the cache file; the ledger entry records the URL, the window and the level.
 * Returns the grid (null when the window misses the raster) and whether it
 * came from the cache.
 */
export async function cachedWindow(ledger, file, url, bounds, opts = {}) {
  const known = ledger.get(file)
  if (known && known.url === url && JSON.stringify(known.window) === JSON.stringify(bounds)) {
    const g = loadGrid(ledger, file)
    if (g) return { grid: g, cached: true }
  }
  const cog = await openCog(url)
  const grid = await readWindow(cog, bounds, opts)
  if (!grid) return { grid: null, cached: false }
  saveGrid(ledger, file, grid, { url, window: bounds, level: grid.level, rangeBytes: grid.bytes, pixelIsPoint: cog.pixelIsPoint })
  return { grid, cached: false }
}
