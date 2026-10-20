// Raster tools for the era layers: reading a pack back, putting polygons
// and the CAH land cover onto its grid, and the few image operations the
// rules need (distance, blur, slope).
//
// Everything works on a pack's own grid (DATA.md, "Texel registration"):
// texel (i, j) covers lon west + i·dLon .. west + (i+1)·dLon and lat
// north − j·dLat .. north − (j+1)·dLat, row 0 north. Polygons and the CAH
// cells are taken as area: each texel is split into s × s samples and the
// value is the share of samples inside, so nothing is a point sample.
import { readPNG } from './png.mjs'
import { KX, KZ, gridFromBounds } from './geo.mjs'

/** Area in m² of a GeoJSON polygon or multipolygon (lon/lat), holes subtracted, in the shared projection. */
export function polygonArea(geometry) {
  const polys = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.type === 'MultiPolygon' ? geometry.coordinates : []
  let total = 0
  for (const poly of polys) {
    poly.forEach((ring, r) => {
      let a = 0
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) a += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1]
      total += (r === 0 ? 1 : -1) * Math.abs(a / 2) * KX * KZ
    })
  }
  return total
}

let geotiff
async function GeoTIFF() {
  geotiff ||= await import('geotiff')
  return geotiff
}

// ---------------------------------------------------------------------------
// A pack, read back from public/data

/**
 * Height in metres, land mask, rain in mm (NaN where the pack has no rain
 * image), and the grid helpers, for one manifest pack entry.
 */
export function readPack(dataDir, pack) {
  const [W, H] = pack.size
  const grid = gridFromBounds(pack.bounds, W, H)
  const img = readPNG(`${dataDir}/${pack.height.file}`)
  if (img.width !== W || img.height !== H) throw new Error(`${pack.id}: height image ${img.width}x${img.height}, manifest says ${W}x${H}`)
  const N = W * H
  const metres = new Float32Array(N)
  const land = new Uint8Array(N)
  for (let o = 0; o < N; o++) {
    metres[o] = (img.data[o * 3] * 256 + img.data[o * 3 + 1]) * pack.height.scale + pack.height.offset
    land[o] = metres[o] > 0 ? 1 : 0
  }
  // (the encoding clamps at 300 mm, so a 0 on land is "300 mm or less", the dry coasts)
  const rain = new Float32Array(N).fill(NaN)
  if (pack.rain) {
    const r = readPNG(`${dataDir}/${pack.rain.file}`)
    for (let o = 0; o < N; o++) if (land[o]) rain[o] = 300 * Math.pow(40, r.data[o] / 255)
  }
  return {
    id: pack.id,
    W,
    H,
    N,
    grid,
    metres,
    land,
    rain,
    hasRain: !!pack.rain,
    texelMetres: grid.metresPerTexel[0],
    texelKm2: (grid.metresPerTexel[0] * grid.metresPerTexel[1]) / 1e6,
  }
}

/** Samples per texel side so that a sample is at most about `metres` across. */
export const samplesFor = (texelMetres, metres, max = 8) => Math.max(2, Math.min(max, Math.ceil(texelMetres / metres)))

// ---------------------------------------------------------------------------
// Polygons onto the grid

/**
 * Walk every polygon of `features` over a sample grid of s × s samples per
 * texel, calling span(feature, row, x0, x1) for each run of samples inside
 * (even-odd within a feature, so holes stay holes; features are independent).
 */
export function scanPolygons(features, grid, s, span) {
  const { W, H, bounds, dLon, dLat } = grid
  const [west, , , north] = bounds
  const SW = W * s
  const SH = H * s
  const kx = s / dLon
  const ky = s / dLat
  for (const f of features) {
    const g = f.geometry
    if (!g) continue
    const polys = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : []
    // edges in sample space, with their row range
    const ex0 = []
    const ey0 = []
    const ex1 = []
    const ey1 = []
    let ymin = Infinity
    let ymax = -Infinity
    for (const poly of polys) {
      for (const ring of poly) {
        for (let i = 0; i < ring.length - 1; i++) {
          const x0 = (ring[i][0] - west) * kx
          const y0 = (north - ring[i][1]) * ky
          const x1 = (ring[i + 1][0] - west) * kx
          const y1 = (north - ring[i + 1][1]) * ky
          if (y0 === y1) continue
          ex0.push(x0)
          ey0.push(y0)
          ex1.push(x1)
          ey1.push(y1)
          if (y0 < ymin) ymin = y0
          if (y1 < ymin) ymin = y1
          if (y0 > ymax) ymax = y0
          if (y1 > ymax) ymax = y1
        }
      }
    }
    const n = ex0.length
    if (!n) continue
    const r0 = Math.max(0, Math.ceil(ymin - 0.5))
    const r1 = Math.min(SH - 1, Math.floor(ymax - 0.5))
    if (r1 < r0) continue
    // bucket edges by the first sample row whose centre they reach
    const order = new Int32Array(n)
    const top = new Float64Array(n)
    for (let e = 0; e < n; e++) {
      order[e] = e
      top[e] = Math.min(ey0[e], ey1[e])
    }
    order.sort((a, b) => top[a] - top[b])
    let next = 0
    let active = []
    const xs = []
    for (let row = r0; row <= r1; row++) {
      const yc = row + 0.5
      while (next < n && top[order[next]] <= yc) active.push(order[next++])
      xs.length = 0
      const keep = []
      for (const e of active) {
        const a = ey0[e]
        const b = ey1[e]
        if (Math.max(a, b) < yc) continue // finished
        keep.push(e)
        if ((a <= yc) !== (b <= yc)) xs.push(ex0[e] + ((yc - a) * (ex1[e] - ex0[e])) / (b - a))
      }
      active = keep
      if (xs.length < 2) continue
      xs.sort((a, b) => a - b)
      for (let k = 0; k + 1 < xs.length; k += 2) {
        const x0 = Math.max(0, Math.ceil(xs[k] - 0.5))
        const x1 = Math.min(SW, Math.ceil(xs[k + 1] - 0.5))
        if (x1 > x0) span(f, row, x0, x1)
      }
    }
  }
}

/**
 * Share of each texel covered by the union of the polygons (0..1).
 * `filter(feature)` picks features; s is samples per texel side.
 */
export function coverage(features, grid, s, filter = () => true) {
  const { W, H } = grid
  const SW = W * s
  const bits = new Uint8Array(SW * H * s)
  scanPolygons(features.filter(filter), grid, s, (f, row, x0, x1) => bits.fill(1, row * SW + x0, row * SW + x1))
  return reduceSamples(bits, grid, s)
}

/** Mean over each texel's samples of a per-sample byte/float buffer. */
function reduceSamples(buf, grid, s) {
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
        for (let a = 0; a < s; a++) t += buf[o + a]
        out[j * W + i] += t * inv
      }
    }
  }
  return out
}

/**
 * Per-texel mean of value(feature) over the samples inside some feature,
 * and the share of samples inside any feature. Later features win where
 * features overlap. Returns { mean, cover }.
 */
export function featureMean(features, grid, s, value) {
  const { W, H } = grid
  const SW = W * s
  const val = new Float32Array(SW * H * s)
  const hit = new Uint8Array(SW * H * s)
  scanPolygons(features, grid, s, (f, row, x0, x1) => {
    const v = value(f)
    val.fill(v, row * SW + x0, row * SW + x1)
    hit.fill(1, row * SW + x0, row * SW + x1)
  })
  const cover = reduceSamples(hit, grid, s)
  const sum = reduceSamples(val, grid, s)
  const mean = new Float32Array(W * H)
  for (let o = 0; o < W * H; o++) mean[o] = cover[o] > 0 ? sum[o] / cover[o] : NaN
  return { mean, cover }
}

/** Index of the feature under each texel centre (-1 for none). */
export function featureIndex(features, grid) {
  const { W, H } = grid
  const idx = new Int32Array(W * H).fill(-1)
  const at = new Map(features.map((f, k) => [f, k]))
  scanPolygons(features, grid, 1, (f, row, x0, x1) => idx.fill(at.get(f), row * W + x0, row * W + x1))
  return idx
}

// ---------------------------------------------------------------------------
// UTM zone 4 (NAD83, GRS 1980), forward, by Krüger's series (as in the
// usual Karney formulation), accurate to millimetres well beyond the zone,
// which matters because the CAH grid stretches zone 4 out to Hawaiʻi Island.

const A = 6378137
const F = 1 / 298.257222101
const K0 = 0.9996
const LON0 = -159
const N_ = F / (2 - F)
const AA = (A / (1 + N_)) * (1 + N_ ** 2 / 4 + N_ ** 4 / 64)
const ALPHA = [
  N_ / 2 - (2 / 3) * N_ ** 2 + (5 / 16) * N_ ** 3,
  (13 / 48) * N_ ** 2 - (3 / 5) * N_ ** 3,
  (61 / 240) * N_ ** 3,
]
const E = Math.sqrt(F * (2 - F))

export function utm4(lon, lat) {
  const phi = (lat * Math.PI) / 180
  const lam = ((lon - LON0) * Math.PI) / 180
  const t = Math.sinh(Math.atanh(Math.sin(phi)) - E * Math.atanh(E * Math.sin(phi)))
  const xi = Math.atan2(t, Math.cos(lam))
  const eta = Math.atanh(Math.sin(lam) / Math.sqrt(1 + t * t))
  let x = eta
  let y = xi
  for (let j = 1; j <= 3; j++) {
    x += ALPHA[j - 1] * Math.cos(2 * j * xi) * Math.sinh(2 * j * eta)
    y += ALPHA[j - 1] * Math.sin(2 * j * xi) * Math.cosh(2 * j * eta)
  }
  return [500000 + K0 * AA * x, K0 * AA * y]
}

// ---------------------------------------------------------------------------
// The CAH land cover onto a pack grid

/**
 * Sample the CAH raster under every texel (s × s samples, positions
 * interpolated from the exact projection of the texel corners, which is
 * affine to well under a metre across one texel) and sum, per texel, the
 * weights each `groups[name]` gives the 48 classes. Returns
 * { [name]: Float32Array of the mean weight }, plus `valid`, the share of
 * samples that fell on a mapped class.
 */
export async function sampleCah(tifPath, grid, s, groups) {
  const { fromFile } = await GeoTIFF()
  const tiff = await fromFile(tifPath)
  const im = await tiff.getImage()
  const [ox, oy] = im.getOrigin()
  const [rx, ry] = im.getResolution()
  const TW = im.getWidth()
  const TH = im.getHeight()
  const { W, H, bounds, dLon, dLat } = grid
  const [west, , , north] = bounds
  // corner projections
  const CE = new Float64Array((W + 1) * (H + 1))
  const CN = new Float64Array((W + 1) * (H + 1))
  let e0 = Infinity, e1 = -Infinity, n0 = Infinity, n1 = -Infinity
  for (let j = 0; j <= H; j++) {
    for (let i = 0; i <= W; i++) {
      const [e, n] = utm4(west + i * dLon, north - j * dLat)
      CE[j * (W + 1) + i] = e
      CN[j * (W + 1) + i] = n
      if (e < e0) e0 = e
      if (e > e1) e1 = e
      if (n < n0) n0 = n
      if (n > n1) n1 = n
    }
  }
  const c0 = Math.max(0, Math.floor((e0 - ox) / rx) - 1)
  const c1 = Math.min(TW, Math.ceil((e1 - ox) / rx) + 1)
  const r0 = Math.max(0, Math.floor((n1 - oy) / ry) - 1)
  const r1 = Math.min(TH, Math.ceil((n0 - oy) / ry) + 1)
  const [data] = await im.readRasters({ window: [c0, r0, c1, r1] })
  const ww = c1 - c0
  const wh = r1 - r0
  const names = Object.keys(groups)
  const tables = names.map((k) => {
    const t = new Float32Array(65536)
    for (const [v, w] of Object.entries(groups[k])) t[Number(v)] = w
    return t
  })
  const out = Object.fromEntries(names.map((k) => [k, new Float32Array(W * H)]))
  const arrs = names.map((k) => out[k])
  const valid = new Float32Array(W * H)
  const inv = 1 / (s * s)
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const o = j * W + i
      const q = j * (W + 1) + i
      const eA = CE[q], eB = CE[q + 1], eC = CE[q + W + 1], eD = CE[q + W + 2]
      const nA = CN[q], nB = CN[q + 1], nC = CN[q + W + 1], nD = CN[q + W + 2]
      const acc = new Float32Array(names.length)
      let nv = 0
      for (let b = 0; b < s; b++) {
        const v = (b + 0.5) / s
        for (let a = 0; a < s; a++) {
          const u = (a + 0.5) / s
          const e = (1 - v) * ((1 - u) * eA + u * eB) + v * ((1 - u) * eC + u * eD)
          const n = (1 - v) * ((1 - u) * nA + u * nB) + v * ((1 - u) * nC + u * nD)
          const c = Math.floor((e - ox) / rx) - c0
          const r = Math.floor((n - oy) / ry) - r0
          if (c < 0 || r < 0 || c >= ww || r >= wh) continue
          const cls = data[r * ww + c]
          if (cls < 1 || cls > 48) continue
          nv++
          for (let k = 0; k < names.length; k++) acc[k] += tables[k][cls]
        }
      }
      valid[o] = nv * inv
      if (nv) for (let k = 0; k < names.length; k++) arrs[k][o] = acc[k] / nv
    }
  }
  return { ...out, valid }
}

// ---------------------------------------------------------------------------
// Image operations

/**
 * Euclidean distance in metres from every texel to the nearest texel where
 * `src` is set (Felzenszwalb and Huttenlocher's two-pass transform).
 * Infinity where no texel is set.
 */
export function distanceTo(src, W, H, metres) {
  const INF = 1e20
  const f = new Float64Array(Math.max(W, H))
  const d = new Float64Array(Math.max(W, H))
  const v = new Int32Array(Math.max(W, H))
  const z = new Float64Array(Math.max(W, H) + 1)
  const g = new Float64Array(W * H)
  for (let o = 0; o < W * H; o++) g[o] = src[o] ? 0 : INF
  const pass = (n, get, set) => {
    for (let q = 0; q < n; q++) f[q] = get(q)
    let k = 0
    v[0] = 0
    z[0] = -INF
    z[1] = INF
    for (let q = 1; q < n; q++) {
      let sv = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])
      while (sv <= z[k]) {
        k--
        sv = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])
      }
      k++
      v[k] = q
      z[k] = sv
      z[k + 1] = INF
    }
    k = 0
    for (let q = 0; q < n; q++) {
      while (z[k + 1] < q) k++
      d[q] = (q - v[k]) * (q - v[k]) + f[v[k]]
    }
    for (let q = 0; q < n; q++) set(q, d[q])
  }
  for (let i = 0; i < W; i++) pass(H, (q) => g[q * W + i], (q, x) => (g[q * W + i] = x))
  for (let j = 0; j < H; j++) pass(W, (q) => g[j * W + q], (q, x) => (g[j * W + q] = x))
  const out = new Float32Array(W * H)
  for (let o = 0; o < W * H; o++) out[o] = g[o] >= INF / 2 ? Infinity : Math.sqrt(g[o]) * metres
  return out
}

/** Box blur of radius r texels along one axis, in place (edges clamp the window). */
function boxPass(a, W, H, r, horizontal) {
  const n = horizontal ? W : H
  const m = horizontal ? H : W
  const line = new Float64Array(n)
  const pre = new Float64Array(n + 1)
  for (let l = 0; l < m; l++) {
    for (let q = 0; q < n; q++) line[q] = a[horizontal ? l * W + q : q * W + l]
    pre[0] = 0
    for (let q = 0; q < n; q++) pre[q + 1] = pre[q] + line[q]
    for (let q = 0; q < n; q++) {
      const lo = Math.max(0, q - r)
      const hi = Math.min(n, q + r + 1)
      a[horizontal ? l * W + q : q * W + l] = (pre[hi] - pre[lo]) / (2 * r + 1)
    }
  }
}

/**
 * Near-Gaussian blur with standard deviation `sigmaMetres` (three box
 * passes). Values beyond the grid count as 0, so a coast is not lifted.
 */
export function blur(values, W, H, sigmaMetres, texelMetres) {
  const sigma = sigmaMetres / texelMetres
  const out = Float32Array.from(values)
  if (sigma < 0.3) return out
  const r = Math.max(1, Math.round(Math.sqrt((12 * sigma * sigma) / 3 + 1) / 2 - 0.5))
  for (let k = 0; k < 3; k++) {
    boxPass(out, W, H, r, true)
    boxPass(out, W, H, r, false)
  }
  return out
}

/** Slope as rise over run, from central differences of the land heights. */
export function slopeOf(metres, land, W, H, texelMetres) {
  const out = new Float32Array(W * H)
  const h = (i, j) => {
    i = Math.max(0, Math.min(W - 1, i))
    j = Math.max(0, Math.min(H - 1, j))
    return Math.max(0, metres[j * W + i])
  }
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      if (!land[j * W + i]) continue
      const gx = (h(i + 1, j) - h(i - 1, j)) / (2 * texelMetres)
      const gy = (h(i, j + 1) - h(i, j - 1)) / (2 * texelMetres)
      out[j * W + i] = Math.hypot(gx, gy)
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// Water: where it runs on a pack

/**
 * Flow routing on the pack's land. Pits are filled by priority flood with a
 * small epsilon (Barnes, Lehman and Mulla 2014), so every land texel drains
 * to the sea; each texel then drains to its lowest neighbour (D8). Returns,
 * per texel, `down` (index, -1 at an outlet), `area` (upstream km²), `flow`
 * (upstream rain volume, m³ a year, from rainMm), and `height` above the
 * first texel downstream where flow reaches `streamFlow` (the height above
 * the nearest drainage; 0 on the stream, Infinity where none is reached),
 * with `streamQ`, the flow of that stream texel, and `streamRain`, the mean
 * rain over its catchment in mm (a wet catchment runs all year).
 */
export function routeWater(metres, land, W, H, texelMetres, rainMm, streamFlow) {
  const N = W * H
  const fill = new Float64Array(N)
  const done = new Uint8Array(N)
  const order = new Int32Array(N)
  let nOrder = 0
  // binary heap of texels keyed by filled height
  const heap = new Int32Array(N)
  let size = 0
  const less = (a, b) => fill[a] < fill[b]
  const push = (o) => {
    let i = size++
    heap[i] = o
    while (i > 0) {
      const p = (i - 1) >> 1
      if (!less(heap[i], heap[p])) break
      ;[heap[i], heap[p]] = [heap[p], heap[i]]
      i = p
    }
  }
  const pop = () => {
    const top = heap[0]
    heap[0] = heap[--size]
    let i = 0
    for (;;) {
      const l = 2 * i + 1
      const r = l + 1
      let m = i
      if (l < size && less(heap[l], heap[m])) m = l
      if (r < size && less(heap[r], heap[m])) m = r
      if (m === i) break
      ;[heap[i], heap[m]] = [heap[m], heap[i]]
      i = m
    }
    return top
  }
  const DX = [1, 1, 0, -1, -1, -1, 0, 1]
  const DY = [0, 1, 1, 1, 0, -1, -1, -1]
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const o = j * W + i
      if (!land[o]) continue
      let edge = i === 0 || j === 0 || i === W - 1 || j === H - 1
      for (let d = 0; d < 8 && !edge; d++) if (!land[(j + DY[d]) * W + i + DX[d]]) edge = true
      if (edge) {
        fill[o] = metres[o]
        done[o] = 1
        push(o)
      }
    }
  }
  const EPS = 1e-3
  while (size) {
    const o = pop()
    order[nOrder++] = o
    const i = o % W
    const j = (o - i) / W
    for (let d = 0; d < 8; d++) {
      const ni = i + DX[d]
      const nj = j + DY[d]
      if (ni < 0 || nj < 0 || ni >= W || nj >= H) continue
      const n = nj * W + ni
      if (!land[n] || done[n]) continue
      done[n] = 1
      fill[n] = Math.max(metres[n], fill[o] + EPS)
      push(n)
    }
  }
  // lowest neighbour by drop per distance, on the filled surface
  const down = new Int32Array(N).fill(-1)
  for (let q = 0; q < nOrder; q++) {
    const o = order[q]
    const i = o % W
    const j = (o - i) / W
    let best = -1
    let bestDrop = 0
    let toSea = false
    for (let d = 0; d < 8; d++) {
      const ni = i + DX[d]
      const nj = j + DY[d]
      if (ni < 0 || nj < 0 || ni >= W || nj >= H) {
        toSea = true
        continue
      }
      const n = nj * W + ni
      if (!land[n]) {
        toSea = true
        continue
      }
      const drop = (fill[o] - fill[n]) / (d & 1 ? Math.SQRT2 : 1)
      if (drop > bestDrop) {
        bestDrop = drop
        best = n
      }
    }
    down[o] = toSea && best < 0 ? -1 : best
  }
  // accumulate, upstream first
  const km2 = (texelMetres * texelMetres) / 1e6
  const area = new Float32Array(N)
  const flow = new Float32Array(N)
  for (let q = nOrder - 1; q >= 0; q--) {
    const o = order[q]
    area[o] += km2
    flow[o] += ((rainMm[o] || 0) / 1000) * km2 * 1e6
    const n = down[o]
    if (n >= 0) {
      area[n] += area[o]
      flow[n] += flow[o]
    }
  }
  // height above the stream it drains to, downstream first
  const height = new Float32Array(N).fill(Infinity)
  const streamQ = new Float32Array(N)
  const streamRain = new Float32Array(N)
  const reach = new Int32Array(N).fill(-1)
  for (let q = 0; q < nOrder; q++) {
    const o = order[q]
    if (flow[o] >= streamFlow) reach[o] = o
    else if (down[o] >= 0) reach[o] = reach[down[o]]
    if (reach[o] >= 0) {
      height[o] = Math.max(0, metres[o] - metres[reach[o]])
      streamQ[o] = flow[reach[o]]
      streamRain[o] = flow[reach[o]] / (area[reach[o]] * 1e3)
    }
  }
  return { down, area, flow, height, streamQ, streamRain }
}

export const smoothstep = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
export const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x)
