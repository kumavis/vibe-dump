// Source rasters and resampling onto pack grids.
//
// Copied from holo-i-ke-au's tools/lib/raster.mjs (b480c27): axisWeights,
// readAsciiGrid (GMRT's ESRI ASCII), resampleGrid and fillThroughMask, as
// they were. Its DemMosaic read USGS 3DEP tiles, which cover only the United
// States; a box's land comes from Copernicus GLO-30 COG windows instead
// (tools/lib/cog.mjs, the bake workflow's), so it and its lazy geotiff import
// are gone. resampleGrid takes any grid with { W, H, bounds, dLon, dLat }
// (tools/lib/geo.mjs gridFromBounds), a box's east beyond 180 included as
// long as the source grid's longitudes are continuous with it.
//
// Resampling is separable and area-true: along each axis a target texel is a
// span of source cells, weighted by overlap (a box filter) when the texel is
// at least one source cell wide, and by bilinear weights at its centre when
// it is narrower (upsampling). Nothing is point-sampled, so coastlines and
// ridges do not alias.
import { readFileSync } from 'node:fs'

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
