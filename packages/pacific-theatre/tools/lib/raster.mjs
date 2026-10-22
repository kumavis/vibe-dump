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

// ---------------------------------------------------------------------------
// Added by the bake workflow: the previews of `--preview DIR` (DATA.md §11),
// pictures for a person to look at, never shipped. After R1's
// r1-scripts/preview.mjs (a hillshade over a hypsometric and bathymetric tint).

/** Decode a pack's RGB PNG data (value = R·256 + G) to metres. */
export function decodeHeights(img, scale, offset) {
  const { width: W, height: H, data, channels } = img
  const m = new Float32Array(W * H)
  for (let i = 0; i < W * H; i++) m[i] = (data[i * channels] * 256 + data[i * channels + 1]) * scale + offset
  return m
}

const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
function ramp(stops, v) {
  if (v <= stops[0][0]) return stops[0][1]
  for (let i = 1; i < stops.length; i++) if (v <= stops[i][0]) return lerp3(stops[i - 1][1], stops[i][1], (v - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0]))
  return stops[stops.length - 1][1]
}
const LAND = [[0, [96, 128, 72]], [50, [120, 150, 84]], [300, [170, 170, 110]], [1000, [176, 140, 100]], [2500, [150, 120, 110]], [5000, [235, 235, 235]]]
const SEA = [[-11000, [8, 16, 48]], [-6000, [16, 36, 90]], [-3000, [30, 70, 130]], [-200, [60, 120, 170]], [-20, [110, 170, 200]], [-1, [150, 205, 220]]]

/**
 * A hillshaded RGB picture of a height grid (metres, row 0 north): land
 * tinted by height, sea by depth, lit from the north-west. cell: metres per
 * texel [x, z]; exag: the vertical exaggeration of the shading.
 */
export function hillshadeRGB(m, W, H, { cell = [1, 1], exag = 1 } = {}) {
  const rgb = new Uint8Array(W * H * 3)
  const L = [-0.5, 0.6, -0.62] // toward the light: west, up, north (z grows south)
  const ll = Math.hypot(...L)
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const k = j * W + i
      const v = m[k]
      const dx = ((m[j * W + Math.min(W - 1, i + 1)] - m[j * W + Math.max(0, i - 1)]) * exag) / (2 * cell[0])
      const dz = ((m[Math.min(H - 1, j + 1) * W + i] - m[Math.max(0, j - 1) * W + i]) * exag) / (2 * cell[1])
      // normal of y = h(x, z): (−dh/dx, 1, −dh/dz)
      const nl = Math.hypot(dx, 1, dz)
      const sh = Math.max(0, (-dx * L[0] + L[1] - dz * L[2]) / (nl * ll))
      const base = v > 0 ? ramp(LAND, v) : ramp(SEA, v)
      const f = v > 0 ? 0.35 + 0.9 * sh : 0.6 + 0.5 * sh
      rgb[k * 3] = Math.max(0, Math.min(255, base[0] * f))
      rgb[k * 3 + 1] = Math.max(0, Math.min(255, base[1] * f))
      rgb[k * 3 + 2] = Math.max(0, Math.min(255, base[2] * f))
    }
  }
  return rgb
}

/** Draw a line of colour c (RGB) into rgb (W × H), in pixel coordinates, by Bresenham. */
export function drawLine(rgb, W, H, x0, y0, x1, y1, c) {
  let x = Math.round(x0)
  let y = Math.round(y0)
  const xe = Math.round(x1)
  const ye = Math.round(y1)
  const dx = Math.abs(xe - x)
  const dy = -Math.abs(ye - y)
  const sx = x < xe ? 1 : -1
  const sy = y < ye ? 1 : -1
  let err = dx + dy
  for (let guard = 0; guard < 1e6; guard++) {
    if (x >= 0 && y >= 0 && x < W && y < H) {
      const k = (y * W + x) * 3
      rgb[k] = c[0]
      rgb[k + 1] = c[1]
      rgb[k + 2] = c[2]
    }
    if (x === xe && y === ye) break
    const e2 = 2 * err
    if (e2 >= dy) {
      err += dy
      x += sx
    }
    if (e2 <= dx) {
      err += dx
      y += sy
    }
  }
}

/** Draw a small cross (a marker) of colour c at pixel (x, y). */
export function drawMark(rgb, W, H, x, y, c, r = 4) {
  drawLine(rgb, W, H, x - r, y, x + r, y, c)
  drawLine(rgb, W, H, x, y - r, x, y + r, c)
}

/** A crop of an RGB picture, enlarged by an integer factor (nearest), for looking closely. */
export function cropRGB(rgb, W, H, x0, y0, w, h, factor = 1) {
  x0 = Math.max(0, Math.min(W - 1, Math.round(x0)))
  y0 = Math.max(0, Math.min(H - 1, Math.round(y0)))
  w = Math.min(w, W - x0)
  h = Math.min(h, H - y0)
  const ow = w * factor
  const oh = h * factor
  const out = new Uint8Array(ow * oh * 3)
  for (let j = 0; j < oh; j++) {
    const sy = y0 + Math.floor(j / factor)
    for (let i = 0; i < ow; i++) {
      const s = (sy * W + x0 + Math.floor(i / factor)) * 3
      const d = (j * ow + i) * 3
      out[d] = rgb[s]
      out[d + 1] = rgb[s + 1]
      out[d + 2] = rgb[s + 2]
    }
  }
  return { rgb: out, W: ow, H: oh }
}

/** A box-filtered reduction of an RGB picture by an integer factor (for an overview of a large preview). */
export function shrinkRGB(rgb, W, H, factor) {
  const ow = Math.floor(W / factor)
  const oh = Math.floor(H / factor)
  const out = new Uint8Array(ow * oh * 3)
  for (let j = 0; j < oh; j++)
    for (let i = 0; i < ow; i++)
      for (let c = 0; c < 3; c++) {
        let s = 0
        for (let b = 0; b < factor; b++) for (let a = 0; a < factor; a++) s += rgb[((j * factor + b) * W + i * factor + a) * 3 + c]
        out[(j * ow + i) * 3 + c] = s / (factor * factor)
      }
  return { rgb: out, W: ow, H: oh }
}
