// Raster work for the patches: the CUDEM read over a box as one lon/lat
// mosaic, polygons onto a grid at sample level (so shapes can be combined
// before they are averaged), windows of a pack's grid, and the few image
// operations the masks need (grow and shrink, connected pieces, and a smooth
// surface spread over a footprint from its rim).
//
// Registration is the bake's everywhere (DATA.md, "Texel registration"):
// texel (i, j) covers lon west + i·dLon .. west + (i+1)·dLon and lat
// north − j·dLat .. north − (j+1)·dLat, row 0 north.
import { KX, KZ, gridFromBounds } from './geo.mjs'
import { readGeoWindow } from './district-raster.mjs'
import { distanceTo, scanPolygons } from './layers-raster.mjs'

/** The CUDEM tiles that meet `bounds`, read as one grid on their shared 1/9″ lattice ({ west, north, dx, dy, W, H, data }, NaN where none). */
export async function cudemMosaic(files, bounds) {
  const wins = []
  for (const f of files) {
    const w = await readGeoWindow(f, bounds, 2)
    if (w) wins.push(w)
  }
  if (!wins.length) return null
  const dx = wins[0].dx
  const dy = wins[0].dy
  const west = Math.min(...wins.map((w) => w.west))
  const north = Math.max(...wins.map((w) => w.north))
  const east = Math.max(...wins.map((w) => w.west + w.W * dx))
  const south = Math.min(...wins.map((w) => w.north - w.H * dy))
  const W = Math.round((east - west) / dx)
  const H = Math.round((north - south) / dy)
  const data = new Float32Array(W * H).fill(NaN)
  for (const w of wins) {
    const ox = (w.west - west) / dx
    const oy = (north - w.north) / dy
    if (Math.abs(ox - Math.round(ox)) > 0.01 || Math.abs(oy - Math.round(oy)) > 0.01 || Math.abs(w.dx / dx - 1) > 1e-6) throw new Error('CUDEM tiles are not on one lattice')
    for (let r = 0; r < w.H; r++) {
      const row = (r + Math.round(oy)) * W + Math.round(ox)
      for (let c = 0; c < w.W; c++) {
        const v = w.data[r * w.W + c]
        if (v === v && data[row + c] !== data[row + c]) data[row + c] = v
      }
    }
  }
  return { west, north, dx, dy, W, H, data, cellMetres: Math.sqrt(dx * KX * dy * KZ) }
}

/** A raster ({ west, north, dx, dy, W, H }) as a grid scanPolygons can walk. */
export function gridOfRaster(r) {
  return gridFromBounds([r.west, r.north - r.H * r.dy, r.west + r.W * r.dx, r.north], r.W, r.H)
}

/** A window of a pack's grid around a box (with `pad` texels), clipped to the pack: { grid, i0, j0, W, H }, or null if they do not meet. */
export function packWindow(packGrid, [w, s, e, n], pad = 2) {
  const g = packGrid
  const i0 = Math.max(0, Math.floor((w - g.bounds[0]) / g.dLon) - pad)
  const i1 = Math.min(g.W, Math.ceil((e - g.bounds[0]) / g.dLon) + pad)
  const j0 = Math.max(0, Math.floor((g.bounds[3] - n) / g.dLat) - pad)
  const j1 = Math.min(g.H, Math.ceil((g.bounds[3] - s) / g.dLat) + pad)
  if (i1 <= i0 || j1 <= j0) return null
  const W = i1 - i0
  const H = j1 - j0
  const bounds = [g.bounds[0] + i0 * g.dLon, g.bounds[3] - j1 * g.dLat, g.bounds[0] + i1 * g.dLon, g.bounds[3] - j0 * g.dLat]
  return { grid: gridFromBounds(bounds, W, H), i0, j0, W, H }
}

const asFeatures = (geoms) => geoms.map((g) => (g.type === 'Feature' ? g : { type: 'Feature', properties: {}, geometry: g }))

/** The union of some polygons at sample level: s × s samples a texel, 1 inside. */
export function sampleMask(geoms, grid, s) {
  const SW = grid.W * s
  const bits = new Uint8Array(SW * grid.H * s)
  scanPolygons(asFeatures(geoms), grid, s, (f, row, x0, x1) => bits.fill(1, row * SW + x0, row * SW + x1))
  return bits
}

/** Share of each texel's samples that are set. */
export function reduceMask(bits, grid, s) {
  const { W, H } = grid
  const SW = W * s
  const out = new Float32Array(W * H)
  const inv = 1 / (s * s)
  for (let j = 0; j < H; j++) {
    for (let b = 0; b < s; b++) {
      const base = (j * s + b) * SW
      for (let i = 0; i < W; i++) {
        let t = 0
        const o = base + i * s
        for (let a = 0; a < s; a++) t += bits[o + a]
        out[j * W + i] += t * inv
      }
    }
  }
  return out
}

/** Share of each texel inside the union of some polygons. */
export function polygonCover(geoms, grid, s = 4) {
  return reduceMask(sampleMask(geoms, grid, s), grid, s)
}

/** Grow a 0/1 mask by r (in the units of `step`, a texel's size). */
export function dilate(mask, W, H, r, step = 1) {
  if (r <= 0) return Uint8Array.from(mask)
  const d = distanceTo(mask, W, H, step)
  const out = new Uint8Array(W * H)
  for (let o = 0; o < W * H; o++) out[o] = d[o] <= r ? 1 : 0
  return out
}

/** Shrink a 0/1 mask by r. */
export function erode(mask, W, H, r, step = 1) {
  if (r <= 0) return Uint8Array.from(mask)
  const inv = new Uint8Array(W * H)
  for (let o = 0; o < W * H; o++) inv[o] = mask[o] ? 0 : 1
  const d = distanceTo(inv, W, H, step)
  const out = new Uint8Array(W * H)
  for (let o = 0; o < W * H; o++) out[o] = mask[o] && d[o] > r ? 1 : 0
  return out
}

/** Pieces of a 0/1 mask (4-connected): labels (0 = none, 1..n) and the size of each. */
export function components(mask, W, H) {
  const label = new Int32Array(W * H)
  const sizes = [0]
  const q = new Int32Array(W * H)
  let n = 0
  for (let o0 = 0; o0 < W * H; o0++) {
    if (!mask[o0] || label[o0]) continue
    n++
    let qh = 0
    let qt = 0
    q[qt++] = o0
    label[o0] = n
    while (qh < qt) {
      const o = q[qh++]
      const x = o % W
      const nb = [x > 0 ? o - 1 : -1, x < W - 1 ? o + 1 : -1, o >= W ? o - W : -1, o < W * H - W ? o + W : -1]
      for (const p of nb) if (p >= 0 && mask[p] && !label[p]) (label[p] = n), (q[qt++] = p)
    }
    sizes.push(qt)
  }
  return { label, sizes, n }
}

/**
 * A smooth surface over the texels of `F`, held at `fixed` where `isFixed`
 * (the rim) and free elsewhere at its edges: Laplace's equation by
 * successive over-relaxation, 8 neighbours. Pieces of F that touch no fixed
 * texel get `fallback`. Returns a Float32Array (NaN outside F).
 */
export function spreadFromRim(F, isFixed, fixed, W, H, fallback, sweeps = 4000) {
  const N = W * H
  const t = new Float32Array(N).fill(NaN)
  const ids = []
  // seed each piece from the mean of its rim, so the iteration starts close
  const { label, n } = components(F, W, H)
  const sum = new Float64Array(n + 1)
  const cnt = new Uint32Array(n + 1)
  const NB = [-1, 1, -W, W, -W - 1, -W + 1, W - 1, W + 1]
  const inGrid = (o, k) => {
    const x = o % W
    if ((k === 0 || k === 4 || k === 6) && x === 0) return false
    if ((k === 1 || k === 5 || k === 7) && x === W - 1) return false
    const p = o + NB[k]
    return p >= 0 && p < N
  }
  for (let o = 0; o < N; o++) {
    if (!F[o]) continue
    ids.push(o)
    for (let k = 0; k < 8; k++) {
      if (!inGrid(o, k)) continue
      const p = o + NB[k]
      if (isFixed[p]) {
        sum[label[o]] += fixed[p]
        cnt[label[o]]++
      }
    }
  }
  for (const o of ids) t[o] = cnt[label[o]] ? sum[label[o]] / cnt[label[o]] : fallback
  const omega = 1.85
  for (let s = 0; s < sweeps; s++) {
    let change = 0
    for (const o of ids) {
      if (!cnt[label[o]]) continue
      let a = 0
      let wsum = 0
      for (let k = 0; k < 8; k++) {
        if (!inGrid(o, k)) continue
        const p = o + NB[k]
        const w = k < 4 ? 1 : 0.7071
        if (F[p]) (a += w * t[p]), (wsum += w)
        else if (isFixed[p]) (a += w * fixed[p]), (wsum += w)
      }
      if (!wsum) continue
      const next = t[o] + omega * (a / wsum - t[o])
      const d = Math.abs(next - t[o])
      if (d > change) change = d
      t[o] = next
    }
    if (change < 1e-3) break
  }
  return t
}

/** Near-Gaussian blur (three box passes of radius r texels), values beyond the edge counting as 0. */
export function boxBlur(values, W, H, r) {
  const out = Float32Array.from(values)
  if (r < 1) return out
  const line = new Float64Array(Math.max(W, H) + 1)
  for (let pass = 0; pass < 3; pass++) {
    for (const horizontal of [true, false]) {
      const n = horizontal ? W : H
      const m = horizontal ? H : W
      for (let l = 0; l < m; l++) {
        line[0] = 0
        for (let q = 0; q < n; q++) line[q + 1] = line[q] + out[horizontal ? l * W + q : q * W + l]
        const tmp = new Float32Array(n)
        for (let q = 0; q < n; q++) tmp[q] = (line[Math.min(n, q + r + 1)] - line[Math.max(0, q - r)]) / (2 * r + 1)
        for (let q = 0; q < n; q++) out[horizontal ? l * W + q : q * W + l] = tmp[q]
      }
    }
  }
  return out
}
