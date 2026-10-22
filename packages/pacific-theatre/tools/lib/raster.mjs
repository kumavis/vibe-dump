// Source rasters and resampling onto pack grids.
//
// Resampling is separable and area-true: along each axis a target texel is a
// span of source cells, weighted by overlap (a box filter) when the texel is
// at least one source cell wide, and by bilinear weights at its centre when
// it is narrower (upsampling). Nothing is point-sampled, so coastlines and
// ridges do not alias.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

let geotiff
async function GeoTIFF() {
  geotiff ||= await import('geotiff')
  return geotiff
}

const ARCSEC = 1 / 3600

/**
 * Weights along one axis. Target cell i spans [a0 + i*step, a0 + (i+1)*step)
 * in source-cell units (source cell k spans [k, k+1)). Returns, per target
 * cell, { ks: source indices, ws: weights } with weights summing to 1.
 */
export function axisWeights(n, a0, step) {
  const out = new Array(n)
  for (let i = 0; i < n; i++) {
    const a = a0 + i * step
    const b = a + step
    const ks = []
    const ws = []
    if (step >= 1) {
      for (let k = Math.floor(a); k < b; k++) {
        const w = Math.min(b, k + 1) - Math.max(a, k)
        if (w > 1e-9) {
          ks.push(k)
          ws.push(w / step)
        }
      }
    } else {
      const p = a + step / 2 - 0.5 // centre, relative to source cell centres
      const k = Math.floor(p)
      const t = p - k
      ks.push(k, k + 1)
      ws.push(1 - t, t)
    }
    out[i] = { ks, ws }
  }
  return out
}

// ---------------------------------------------------------------------------
// USGS 3DEP 1 arc-second tiles as one global arc-second mosaic.
//
// Each tile is 3600 cells plus a 6-cell overlap ring (3612 x 3612), pixel-is-
// area, NAD83 geographic, Float32, nodata -999999. Global cell (gx, gy) is the
// arc-second cell whose west edge is lon = gx/3600 - 180 and whose north edge
// is lat = 90 - gy/3600. Ocean is nodata or exactly 0 in these tiles (in
// blocks that follow the source surveys), with a thin fringe of small
// negative values offshore; land is everything finite and > 0.

export class DemMosaic {
  constructor() {
    this.tiles = new Map()
    this.info = []
  }

  static async load(demDir, log = () => {}) {
    const { fromFile } = await GeoTIFF()
    const m = new DemMosaic()
    const files = readdirSync(demDir).filter((f) => /^USGS_1_n\d+w\d+\.tif$/.test(f)).sort()
    for (const f of files) {
      const [, N, Wd] = /n(\d+)w(\d+)/.exec(f).map(Number)
      const tiff = await fromFile(join(demDir, f))
      const im = await tiff.getImage()
      const [ox, oy] = im.getOrigin()
      const [rx, ry] = im.getResolution()
      const W = im.getWidth()
      const H = im.getHeight()
      const pad = Math.round((-Wd - ox) / ARCSEC)
      const ok =
        Math.abs(rx - ARCSEC) < 1e-9 &&
        Math.abs(ry + ARCSEC) < 1e-9 &&
        Math.abs(ox - (-Wd - pad * ARCSEC)) < 1e-7 &&
        Math.abs(oy - (N + pad * ARCSEC)) < 1e-7 &&
        W === 3600 + 2 * pad &&
        H === 3600 + 2 * pad &&
        im.getSamplesPerPixel() === 1
      if (!ok) throw new Error(`${f}: unexpected grid (origin ${ox},${oy} res ${rx},${ry} size ${W}x${H})`)
      const [data] = await im.readRasters()
      const nodata = im.getGDALNoData()
      m.tiles.set(`${N},${Wd}`, { data, W, pad, nodata, gxW: (180 - Wd) * 3600, gyN: (90 - N) * 3600 })
      m.info.push({ tile: `n${N}w${Wd}`, file: f, size: `${W}x${H}`, pad, nodata, epsg: im.geoKeys?.GeographicTypeGeoKey })
      log(`  read ${f} (${W}x${H}, nodata ${nodata})`)
    }
    return m
  }

  /** Fill out[0..n) with the values of global row gy from column gx0; NaN where no data. */
  fetchRow(gy, gx0, n, out) {
    out.fill(NaN)
    const cy = Math.floor(gy / 3600)
    const N = 90 - cy
    let i = 0
    while (i < n) {
      const gx = gx0 + i
      const cx = Math.floor(gx / 3600)
      const Wd = 180 - cx
      const end = Math.min(n, (cx + 1) * 3600 - gx0)
      const t = this.tiles.get(`${N},${Wd}`)
      if (t) {
        const row = gy - t.gyN + t.pad
        const base = row * t.W - t.gxW + t.pad
        const d = t.data
        const nd = t.nodata
        for (let k = i; k < end; k++) {
          const v = d[base + gx0 + k]
          out[k] = v === nd || !Number.isFinite(v) ? NaN : v
        }
      }
      i = end
    }
  }

  /**
   * Resample onto a pack grid, keeping land and sea apart: per texel, the
   * area-weighted land fraction, and the area-weighted mean height of the
   * land part alone. (A plain average would let a cliff's height smear the
   * coastline seaward and let sea pull low coasts under.)
   */
  resample(grid) {
    const { W, H, bounds, dLon, dLat } = grid
    const xw = axisWeights(W, (bounds[0] + 180) * 3600, dLon * 3600)
    const yw = axisWeights(H, (90 - bounds[3]) * 3600, dLat * 3600)
    let gxMin = Infinity
    let gxMax = -Infinity
    for (const { ks } of xw) {
      gxMin = Math.min(gxMin, ks[0])
      gxMax = Math.max(gxMax, ks[ks.length - 1])
    }
    const span = gxMax - gxMin + 1
    const row = new Float32Array(span)
    const landFrac = new Float32Array(W * H)
    const landMean = new Float32Array(W * H)
    const aW = new Float64Array(W)
    const aL = new Float64Array(W)
    const aH = new Float64Array(W)
    // flatten x weights for speed
    const xOff = new Int32Array(W + 1)
    for (let i = 0; i < W; i++) xOff[i + 1] = xOff[i] + xw[i].ks.length
    const xk = new Int32Array(xOff[W])
    const xv = new Float64Array(xOff[W])
    for (let i = 0; i < W; i++) {
      xw[i].ks.forEach((k, u) => {
        xk[xOff[i] + u] = k - gxMin
        xv[xOff[i] + u] = xw[i].ws[u]
      })
    }
    for (let j = 0; j < H; j++) {
      aW.fill(0)
      aL.fill(0)
      aH.fill(0)
      const { ks, ws } = yw[j]
      for (let t = 0; t < ks.length; t++) {
        this.fetchRow(ks[t], gxMin, span, row)
        const wy = ws[t]
        for (let i = 0; i < W; i++) {
          let sl = 0
          let sh = 0
          for (let u = xOff[i]; u < xOff[i + 1]; u++) {
            const v = row[xk[u]]
            if (v > 0) {
              sl += xv[u]
              sh += xv[u] * v
            }
          }
          aW[i] += wy
          aL[i] += wy * sl
          aH[i] += wy * sh
        }
      }
      for (let i = 0; i < W; i++) {
        const o = j * W + i
        landFrac[o] = aL[i] / aW[i]
        landMean[o] = aL[i] > 0 ? aH[i] / aL[i] : 0
      }
    }
    return { landFrac, landMean }
  }
}

// ---------------------------------------------------------------------------
// Generic lon/lat grids: { west, north, dx, dy (degrees, positive), W, H, data (NaN = none) }

/**
 * ESRI ASCII grid (the Rainfall Atlas and GMRT both ship it). Rows run north
 * to south; the nodata value, and anything outside [min, max], become NaN.
 */
export function readAsciiGrid(file, { min = -Infinity, max = Infinity } = {}) {
  const text = readFileSync(file, 'latin1')
  const head = {}
  let pos = 0
  for (let n = 0; n < 6; n++) {
    const end = text.indexOf('\n', pos)
    const [k, v] = text.slice(pos, end).trim().split(/\s+/)
    head[k.toLowerCase()] = Number(v)
    pos = end + 1
  }
  const W = head.ncols
  const H = head.nrows
  const cell = head.cellsize
  const nodata = head.nodata_value
  const isCenter = 'xllcenter' in head
  const west = isCenter ? head.xllcenter - cell / 2 : head.xllcorner
  const south = isCenter ? head.yllcenter - cell / 2 : head.yllcorner
  const data = new Float32Array(W * H)
  let i = 0
  const n = text.length
  let p = pos
  while (i < W * H && p < n) {
    while (p < n && text.charCodeAt(p) <= 32) p++
    let q = p
    while (q < n && text.charCodeAt(q) > 32) q++
    if (q > p) {
      const v = Number(text.slice(p, q))
      data[i++] = v === nodata || !Number.isFinite(v) || v < min || v > max ? NaN : v
    }
    p = q
  }
  if (i !== W * H) throw new Error(`${file}: expected ${W * H} values, read ${i}`)
  return { west, north: south + H * cell, dx: cell, dy: cell, W, H, data, header: head }
}

/** Area-weighted mean of the valid source cells under each texel (NaN if none). */
export function resampleGrid(src, grid) {
  const { W, H, bounds, dLon, dLat } = grid
  const xw = axisWeights(W, (bounds[0] - src.west) / src.dx, dLon / src.dx)
  const yw = axisWeights(H, (src.north - bounds[3]) / src.dy, dLat / src.dy)
  const out = new Float32Array(W * H)
  for (let j = 0; j < H; j++) {
    const { ks: kys, ws: wys } = yw[j]
    for (let i = 0; i < W; i++) {
      const { ks, ws } = xw[i]
      let sw = 0
      let sv = 0
      for (let t = 0; t < kys.length; t++) {
        const ky = kys[t]
        if (ky < 0 || ky >= src.H) continue
        for (let u = 0; u < ks.length; u++) {
          const kx = ks[u]
          if (kx < 0 || kx >= src.W) continue
          const v = src.data[ky * src.W + kx]
          if (v === v) {
            const w = wys[t] * ws[u]
            sw += w
            sv += w * v
          }
        }
      }
      out[j * W + i] = sw > 0 ? sv / sw : NaN
    }
  }
  return out
}

/**
 * Fill NaN texels where mask is set from their nearest filled neighbour,
 * moving only through masked texels and at most maxSteps texels away.
 * Returns the number of texels filled.
 */
export function fillThroughMask(values, mask, W, H, maxSteps) {
  let frontier = []
  for (let o = 0; o < W * H; o++) if (mask[o] && values[o] === values[o]) frontier.push(o)
  let filled = 0
  for (let step = 0; step < maxSteps && frontier.length; step++) {
    const next = []
    for (const o of frontier) {
      const x = o % W
      const y = (o - x) / W
      const v = values[o]
      const nb = [x > 0 ? o - 1 : -1, x < W - 1 ? o + 1 : -1, y > 0 ? o - W : -1, y < H - 1 ? o + W : -1]
      for (const q of nb) {
        if (q >= 0 && mask[q] && values[q] !== values[q]) {
          values[q] = v
          next.push(q)
          filled++
        }
      }
    }
    frontier = next
  }
  return filled
}
