// The Government Survey's registered maps of the towns (DATA.md, "Streets,
// dated"): scans that no service has georeferenced, read here by placing
// each on today's streets and then as any other sheet.
//
// The maps are the Survey's own, as OHA's Kīpuka database serves them: one
// 1-bit scan at 400 dpi in a PDF, rendered here with pdftoppm. Each is
// placed over its town by the turn, scale and shift that lay its ink
// closest on today's streets:
//
// - first by a search over turns (TURN degrees either way of its own, by 1°)
//   and scales (SCALE either way of its printed scale, by 2%), each turn and
//   scale's shift found at once by a cross-correlation (an FFT) of the map's
//   ink with today's centrelines, both at COARSE metres a pixel, the
//   centrelines blurred a pixel either way;
// - then near the best of those by a finer search (by 0.2° and 0.5%, and
//   shifts by FINE metres), each scored by how near the map's ink lies to a
//   centreline (a sample of its ink pixels, through a distance map);
// - and then, warped onto the town's grid, by the bake's own shift search
//   and its cells (streets-bake.mjs register), as every sheet is.
//
// A map is placed on the streets that are there today, so a street it draws
// and today's map has lost pulls on nothing; most of a town's streets of the
// 1880s and 1890s are still where they were, and the search needs only most.
// The transform found is written into the manifest beside the sheet.
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fetchTo } from './fetch.mjs'

const KIPUKA = 'https://kipukadatabase.com/Docs/RegMaps'
export const REGISTERED_LICENCE =
  'the map is a public-domain survey of the Hawaiian Government; the scan is served by the Office of Hawaiian Affairs’ Kīpuka database, which states no licence for it'

// metres a pixel of the scan as rendered (finer than the bake's 2.5 m, so a
// thin line survives into it), of the coarse search, of the fine one's shifts
const RENDER = 1.0
const COARSE_M = 16
const FINE = 4
const TURN = 12
const SCALE = 0.08
// the cells either way a map cell's ink is weighed against (lineCells)
const LINE_R = 3
// and the mean ink about it over which a cell is a texture, not a line
const DENSE = 0.08
// a map pixel darker than this is ink, for the search
const INK = 160

/**
 * The maps, by town. `scale`: the map's printed scale (a denominator), which
 * with the render's dpi gives the metres a pixel to start from; `turn`: the
 * degrees the map's top stands clockwise of north, to start from; `mask`:
 * parts of the sheet (fractions of its width and height, [x0, y0, x1, y1])
 * that are not the town (insets, a title, a legend), left out of the search
 * and of the reading; `texture`: the share of ink over which a patch is read
 * as a texture, not streets (streets-bake.mjs untexture; false for a map with
 * no hachures, whose dense blocks are streets and buildings); `seed`: places
 * read off the map (render pixels, the place, its lon and lat) that the
 * search starts from, in place of its coarse search.
 */
export const REGISTERED = [
  {
    key: 'rm867', town: 'honolulu', year: 1881, rm: 867, file: '0867.pdf', scale: 6000, turn: 0, source: 'hgs-rm-867', mask: [[0.55, 0, 1, 0.3]], texture: 0.35,
    // (read off the map at 152 dpi, to tens of metres; the search then finds the place)
    seed: [
      [1770, 2460, 'King St and Fort St', -157.862095, 21.309194],
      [2050, 2255, 'Beretania St and Fort St (Fort Street Church)', -157.859314, 21.311268],
      [3168, 3300, 'King St and Victoria St', -157.848821, 21.301509],
      [3775, 3290, 'Beretania St and Piikoi St', -157.843237, 21.301577],
    ],
  },
  {
    key: 'rm1397', town: 'honolulu', year: 1888, rm: 1397, file: '1397WIDE.pdf', scale: 1200, turn: 0, source: 'hgs-rm-1397', mask: [[0.72, 0.7, 1, 1]], texture: false,
    seed: [
      [1835, 1800, 'King St and Fort St', -157.862095, 21.309194],
      [1840, 2095, 'Merchant St and Fort St', -157.862818, 21.308806],
      [3845, 1610, 'King St and Punchbowl St', -157.858085, 21.305073],
      [3770, 2225, 'Queen St and Punchbowl St', -157.859793, 21.304202],
    ],
  },
  // (the next two are read but not yet placed: the search alone does not find them, and no seed has been read off them)
  { skip: true, key: 'rm1910', town: 'honolulu', year: 1897, rm: 1910, file: '1910.pdf', scale: 12000, turn: 0, source: 'hgs-rm-1910', mask: [[0, 0.64, 0.33, 1], [0.28, 0.75, 0.75, 1]] },
  { skip: true, key: 'rm1561', town: 'hilo', year: 1891, rm: 1561, file: '1561WIDEencaps.pdf', scale: 2400, turn: 0, coarse: 8, source: 'hgs-rm-1561', mask: [[0.76, 0.55, 1, 1]] },
  { key: 'rm1137', town: 'lahaina', year: 1883, rm: 1137, file: '1137WIDE.pdf', scale: 6000, turn: 0, source: 'hgs-rm-1137', mask: [[0.65, 0.7, 1, 1]] },
]

export function registeredFor(town) {
  return REGISTERED.filter((r) => r.town === town.id && !r.skip)
}

const pdfPath = (dir, r) => join(dir, 'registered', r.file)
const pngPath = (dir, r) => join(dir, 'registered', `${r.key}.png`)
// the dpi at which a pixel of the map is RENDER metres on the ground
// (never under 100 dpi, so the 400 dpi scan's thinnest lines still render dark)
const dpiOf = (r) => Math.max(100, Math.round((r.scale * 0.0254) / RENDER))

/** Fetch each map's PDF and render its page in grey at RENDER metres a pixel. */
export function downloadRegistered(ledger, dir, town, log) {
  for (const r of registeredFor(town)) {
    const pdf = pdfPath(dir, r)
    const res = fetchTo(ledger, `${KIPUKA}/${r.file}`, pdf, { maxTime: 900 })
    if (!res.ok) throw new Error(`registered map ${r.rm}: HTTP ${res.status}`)
    const png = pngPath(dir, r)
    if (!existsSync(png)) {
      mkdirSync(join(dir, 'registered'), { recursive: true })
      const out = spawnSync('pdftoppm', ['-r', String(dpiOf(r)), '-gray', '-png', '-singlefile', '-f', '1', '-l', '1', pdf, png.replace(/\.png$/, '')], { encoding: 'utf8' })
      if (out.status !== 0) throw new Error(`pdftoppm on RM ${r.rm}: ${out.stderr || out.error}`)
    }
    log(`  ${town.id}: registered map ${r.rm} (${r.year}) at ${dpiOf(r)} dpi`)
  }
}

export const registeredPaths = { pdf: pdfPath, png: pngPath, dpi: dpiOf }

// --- an FFT -------------------------------------------------------------------------

function fft1(re, im, n, inv) {
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1
    for (; j & bit; bit >>= 1) j ^= bit
    j ^= bit
    if (i < j) {
      let t = re[i]
      re[i] = re[j]
      re[j] = t
      t = im[i]
      im[i] = im[j]
      im[j] = t
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const a = ((inv ? 2 : -2) * Math.PI) / len
    const wr = Math.cos(a)
    const wi = Math.sin(a)
    for (let i = 0; i < n; i += len) {
      let cr = 1
      let ci = 0
      for (let k = 0; k < len / 2; k++) {
        const ur = re[i + k]
        const ui = im[i + k]
        const vr = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci
        const vi = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr
        re[i + k] = ur + vr
        im[i + k] = ui + vi
        re[i + k + len / 2] = ur - vr
        im[i + k + len / 2] = ui - vi
        const t = cr * wr - ci * wi
        ci = cr * wi + ci * wr
        cr = t
      }
    }
  }
}

/** A 2-D FFT in place over N×N (rows, then columns). */
function fft2(re, im, N, inv) {
  const rr = new Float64Array(N)
  const ri = new Float64Array(N)
  for (let y = 0; y < N; y++) {
    const o = y * N
    fft1(re.subarray(o, o + N), im.subarray(o, o + N), N, inv)
  }
  for (let x = 0; x < N; x++) {
    for (let y = 0; y < N; y++) {
      rr[y] = re[y * N + x]
      ri[y] = im[y * N + x]
    }
    fft1(rr, ri, N, inv)
    for (let y = 0; y < N; y++) {
      re[y * N + x] = rr[y]
      im[y * N + x] = ri[y]
    }
  }
}

// --- the search ---------------------------------------------------------------------

/** The map's ink as a fraction per cell of `cell` pixels, and the mask's cells left out. */
function inkCells(img, cell, mask) {
  const w = Math.ceil(img.width / cell)
  const h = Math.ceil(img.height / cell)
  const out = new Float32Array(w * h)
  for (let y = 0; y < img.height; y++) {
    const fy = y / img.height
    for (let x = 0; x < img.width; x++) {
      if (img.grey[y * img.width + x] >= INK) continue
      const fx = x / img.width
      if (mask.some(([a, b, c, d]) => fx >= a && fx < c && fy >= b && fy < d)) continue
      out[Math.floor(y / cell) * w + Math.floor(x / cell)] += 1 / (cell * cell)
    }
  }
  return { w, h, a: out, cell }
}

/**
 * A map's lines, not its textures: each cell's ink less the mean of the
 * cells round it (LINE_R either way), never under nothing, and nothing
 * where that mean passes DENSE, so hachured slopes, stippled reefs and
 * shaded blocks weigh nothing against a street's lines, which stand out from
 * the paper beside them.
 */
function lineCells(c) {
  const { w, h, a } = c
  const R = LINE_R
  // (a summed-area table, for the means)
  const sat = new Float64Array((w + 1) * (h + 1))
  for (let y = 0; y < h; y++) {
    let row = 0
    for (let x = 0; x < w; x++) {
      row += a[y * w + x]
      sat[(y + 1) * (w + 1) + x + 1] = sat[y * (w + 1) + x + 1] + row
    }
  }
  const out = new Float32Array(w * h)
  for (let y = 0; y < h; y++) {
    const y0 = Math.max(0, y - R)
    const y1 = Math.min(h, y + R + 1)
    for (let x = 0; x < w; x++) {
      const x0 = Math.max(0, x - R)
      const x1 = Math.min(w, x + R + 1)
      const sum = sat[y1 * (w + 1) + x1] - sat[y0 * (w + 1) + x1] - sat[y1 * (w + 1) + x0] + sat[y0 * (w + 1) + x0]
      const mean = sum / ((x1 - x0) * (y1 - y0))
      // (a texture, hachures or stipple or lettering, is dense over a wide patch: none of it)
      out[y * w + x] = mean > DENSE ? 0 : Math.max(0, a[y * w + x] - mean)
    }
  }
  return { ...c, a: out }
}

/** Today's centrelines over the town's grid at `res` metres a pixel, a line a pixel wide, blurred a pixel either way. */
function streetRaster(segs, grid, res, pxM) {
  const k = res / pxM
  const W = Math.ceil(grid.W / k)
  const H = Math.ceil(grid.H / k)
  const a = new Float32Array(W * H)
  for (const g of segs) {
    for (let i = 1; i < g.px.length; i++) {
      const [x0, y0] = g.px[i - 1]
      const [x1, y1] = g.px[i]
      const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / k) + 1
      for (let q = 0; q <= n; q++) {
        const x = Math.floor((x0 + ((x1 - x0) * q) / n) / k)
        const y = Math.floor((y0 + ((y1 - y0) * q) / n) / k)
        if (x >= 0 && y >= 0 && x < W && y < H) a[y * W + x] = 1
      }
    }
  }
  const b = new Float32Array(W * H)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let s = 0
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const X = x + dx
      const Y = y + dy
      if (X >= 0 && Y >= 0 && X < W && Y < H) s += a[Y * W + X] * (dx || dy ? 0.5 : 1)
    }
    b[y * W + x] = Math.min(1, s)
  }
  return { W, H, a: b, k }
}

/** A distance map (metres, 3-4 chamfer) to the nearest street pixel of a raster. */
function distanceMap(r, res) {
  const { W, H } = r
  const d = new Float32Array(W * H).fill(1e9)
  for (let i = 0; i < W * H; i++) if (r.a[i] >= 0.99) d[i] = 0
  const pass = (x, y, dx, dy, c) => {
    const X = x + dx
    const Y = y + dy
    if (X < 0 || Y < 0 || X >= W || Y >= H) return
    const v = d[Y * W + X] + c
    if (v < d[y * W + x]) d[y * W + x] = v
  }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    pass(x, y, -1, 0, 3)
    pass(x, y, 0, -1, 3)
    pass(x, y, -1, -1, 4)
    pass(x, y, 1, -1, 4)
  }
  for (let y = H - 1; y >= 0; y--) for (let x = W - 1; x >= 0; x--) {
    pass(x, y, 1, 0, 3)
    pass(x, y, 0, 1, 3)
    pass(x, y, 1, 1, 4)
    pass(x, y, -1, 1, 4)
  }
  for (let i = 0; i < d.length; i++) d[i] = (d[i] / 3) * res
  return d
}

/**
 * Place a map on the town's grid. img: { width, height, grey }; segs: the
 * town's segments in grid pixels (streets-bake.mjs readSegments); pxM: the
 * grid's metres a pixel. Returns the transform from map pixels to grid
 * pixels as { a, b, c, d, e, f } (gx = a u + b v + c, gy = d u + e v + f),
 * with what it was found as.
 */
export function placeMap(img, r, segs, grid, pxM, log) {
  const t0 = Date.now()
  // (metres a map pixel, by the printed scale and the render)
  const m0 = (r.scale * 0.0254) / dpiOf(r)
  if (r.seed) return refine(img, r, segs, grid, pxM, log, seedTransform(r.seed, grid, pxM), m0, t0, { score: null })
  // the map's ink in cells of about COARSE metres
  const COARSE = r.coarse ?? COARSE_M
  const cellPx = Math.max(1, Math.round(COARSE / m0))
  const ink = lineCells(inkCells(img, cellPx, r.mask || []))
  const S = streetRaster(segs, grid, COARSE, pxM)
  const N = 1 << Math.ceil(Math.log2(Math.max(S.W + ink.w * 1.3, S.H + ink.h * 1.3)))
  // the streets' transform, once (zero mean, so a shift is not paid for covering more of them)
  const Mre = new Float64Array(N * N)
  const Mim = new Float64Array(N * N)
  let mean = 0
  for (const v of S.a) mean += v
  mean /= S.a.length
  for (let y = 0; y < S.H; y++) for (let x = 0; x < S.W; x++) Mre[y * N + x] = S.a[y * S.W + x] - mean
  fft2(Mre, Mim, N, false)
  let best = { score: -Infinity }
  const re = new Float64Array(N * N)
  const im = new Float64Array(N * N)
  for (let dt = -TURN; dt <= TURN; dt += 1) {
    for (let ds = -SCALE; ds <= SCALE + 1e-9; ds += 0.02) {
      const th = ((r.turn + dt) * Math.PI) / 180
      const sc = (m0 * cellPx * (1 + ds)) / COARSE
      // the map's cells, turned and scaled into a canvas at COARSE metres (its centre at the canvas's)
      re.fill(0)
      im.fill(0)
      const cx = ink.w / 2
      const cy = ink.h / 2
      const c = Math.cos(th)
      const s = Math.sin(th)
      let sum = 0
      let sum2 = 0
      for (let y = 0; y < ink.h; y++) {
        for (let x = 0; x < ink.w; x++) {
          const v = ink.a[y * ink.w + x]
          if (!v) continue
          const u = (x - cx) * sc
          const w = (y - cy) * sc
          const X = Math.round(u * c - w * s + N / 2)
          const Y = Math.round(u * s + w * c + N / 2)
          if (X < 0 || Y < 0 || X >= N || Y >= N) continue
          re[Y * N + X] += v
          sum += v
          sum2 += v * v
        }
      }
      fft2(re, im, N, false)
      // the correlation: streets × conj(map)
      for (let i = 0; i < N * N; i++) {
        const ar = Mre[i]
        const ai = Mim[i]
        const br = re[i]
        const bi = -im[i]
        re[i] = ar * br - ai * bi
        im[i] = ar * bi + ai * br
      }
      fft2(re, im, N, true)
      let pk = -Infinity
      let at = 0
      for (let i = 0; i < N * N; i++) if (re[i] > pk) {
        pk = re[i]
        at = i
      }
      const score = pk / Math.sqrt(sum2 || 1)
      if (score > best.score) {
        let dx = at % N
        let dy = Math.floor(at / N)
        if (dx > N / 2) dx -= N
        if (dy > N / 2) dy -= N
        best = { score, th, sc, dx, dy, dt, ds }
      }
    }
  }
  // the coarse transform, map pixels to grid pixels: centre of the map's cells to canvas centre N/2, then the shift
  const coarse = (b) => {
    const k = S.k // grid pixels per COARSE pixel
    const c = Math.cos(b.th)
    const s = Math.sin(b.th)
    const f = (b.sc / cellPx) * k
    const ox = (ink.w / 2) * cellPx
    const oy = (ink.h / 2) * cellPx
    // canvas X = (u - ox) * f/k * c - ... + N/2 ; streets pixel = canvas + d ; grid = streets * k
    return {
      a: f * c,
      b: -f * s,
      d: f * s,
      e: f * c,
      c: (N / 2 + b.dx) * k - f * (c * ox - s * oy),
      f: (N / 2 + b.dy) * k - f * (s * ox + c * oy),
    }
  }
  let T = coarse(best)
  log(`    RM ${r.rm}: coarse turn ${(best.th * 180 / Math.PI).toFixed(1)}°, scale ×${(1 + best.ds).toFixed(2)}, score ${best.score.toFixed(3)} (${Math.round((Date.now() - t0) / 1000)} s)`)
  return refine(img, r, segs, grid, pxM, log, T, m0, t0, best)
}

/** The search near a first placement (from the coarse search or the seeds), on a distance map at FINE metres. */
function refine(img, r, segs, grid, pxM, log, T, m0, t0, best) {
  // the fine search: near the coarse, by a sample of the map's ink through a distance map at FINE metres
  const F = streetRaster(segs, grid, FINE, pxM)
  const dist = distanceMap(F, FINE)
  const pts = []
  const step = Math.max(1, Math.floor(Math.sqrt((img.width * img.height) / 400000)))
  for (let y = 0; y < img.height; y += step) {
    const fy = y / img.height
    for (let x = (y * 7) % step; x < img.width; x += step) {
      if (img.grey[y * img.width + x] >= INK) continue
      const fx = x / img.width
      if ((r.mask || []).some(([a, b, c, d]) => fx >= a && fx < c && fy >= b && fy < d)) continue
      pts.push(x, y)
    }
  }
  const sample = []
  for (let i = 0; i < pts.length; i += 2 * Math.max(1, Math.floor(pts.length / 2 / 30000))) sample.push(pts[i], pts[i + 1])
  const scoreT = (t) => {
    let s = 0
    for (let i = 0; i < sample.length; i += 2) {
      const gx = (t.a * sample[i] + t.b * sample[i + 1] + t.c) / F.k
      const gy = (t.d * sample[i] + t.e * sample[i + 1] + t.f) / F.k
      const X = Math.floor(gx)
      const Y = Math.floor(gy)
      if (X < 0 || Y < 0 || X >= F.W || Y >= F.H) continue
      const v = dist[Y * F.W + X]
      s += Math.exp(-(v * v) / (2 * 12 * 12))
    }
    return s / (sample.length / 2)
  }
  // (turned and scaled about the map's middle, then shifted)
  const around = (t, dth, dsc, sx, sy) => {
    const mx = img.width / 2
    const my = img.height / 2
    const gx = t.a * mx + t.b * my + t.c
    const gy = t.d * mx + t.e * my + t.f
    const c = Math.cos(dth) * dsc
    const s = Math.sin(dth) * dsc
    const a = c * t.a - s * t.d
    const b = c * t.b - s * t.e
    const d = s * t.a + c * t.d
    const e = s * t.b + c * t.e
    return { a, b, d, e, c: gx - a * mx - b * my + sx, f: gy - d * mx - e * my + sy }
  }
  let bestF = { s: scoreT(T), t: T }
  const fpx = FINE / pxM
  // (by turns: the shift alone, then the turn and scale alone, finer each round)
  for (const [R, dthStep, dscStep, shR, shStep] of [[1.2, 0.2, 0.005, 10, 1], [1.2, 0.2, 0.005, 6, 1], [0.3, 0.05, 0.0015, 4, 0.5], [0.15, 0.025, 0.00075, 3, 0.25]]) {
    let base = bestF.t
    for (let sy = -shR; sy <= shR; sy++) {
      for (let sx = -shR; sx <= shR; sx++) {
        const t = around(base, 0, 1, sx * fpx * shStep, sy * fpx * shStep)
        const s = scoreT(t)
        if (s > bestF.s) bestF = { s, t }
      }
    }
    base = bestF.t
    for (let dth = -R; dth <= R + 1e-9; dth += dthStep) {
      for (let dsc = -R * 0.025; dsc <= R * 0.025 + 1e-9; dsc += dscStep) {
        const t = around(base, (dth * Math.PI) / 180, 1 + dsc, 0, 0)
        const s = scoreT(t)
        if (s > bestF.s) bestF = { s, t }
      }
    }
  }
  T = bestF.t
  const turn = (Math.atan2(T.d, T.a) * 180) / Math.PI
  const metres = Math.hypot(T.a, T.d) * pxM
  log(`    RM ${r.rm}: placed at turn ${turn.toFixed(2)}°, ${metres.toFixed(3)} m a map pixel (printed ${m0.toFixed(3)}), fine score ${bestF.s.toFixed(3)} (${Math.round((Date.now() - t0) / 1000)} s)`)
  return { ...T, turn: +turn.toFixed(3), metres: +metres.toFixed(4), printed: +m0.toFixed(4), score: +bestF.s.toFixed(4), coarse: best.score === null ? null : +best.score.toFixed(4), seeded: !!r.seed }
}

/** The affine transform, map pixels to grid pixels, closest to the seeds (least squares). */
function seedTransform(seed, grid, pxM) {
  const KX = Math.cos((grid.lat * Math.PI) / 180) * 111320
  const KY = 110574
  const rows = seed.map(([u, v, , lon, lat]) => [u, v, ((lon - grid.bounds[0]) * KX) / pxM, ((grid.bounds[3] - lat) * KY) / pxM])
  // normal equations for [a b c] (gx) and [d e f] (gy) over [u v 1]
  const A = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
  const bx = [0, 0, 0]
  const by = [0, 0, 0]
  for (const [u, v, gx, gy] of rows) {
    const q = [u, v, 1]
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) A[i][j] += q[i] * q[j]
      bx[i] += q[i] * gx
      by[i] += q[i] * gy
    }
  }
  const solve = (M, b) => {
    const m = M.map((row, i) => [...row, b[i]])
    for (let c = 0; c < 3; c++) {
      let p = c
      for (let r = c + 1; r < 3; r++) if (Math.abs(m[r][c]) > Math.abs(m[p][c])) p = r
      ;[m[c], m[p]] = [m[p], m[c]]
      for (let r = 0; r < 3; r++) {
        if (r === c) continue
        const f = m[r][c] / m[c][c]
        for (let k = c; k < 4; k++) m[r][k] -= f * m[c][k]
      }
    }
    return [0, 1, 2].map((i) => m[i][3] / m[i][i])
  }
  const [a, b, c] = solve(A, bx)
  const [d, e, f] = solve(A, by)
  return { a, b, c, d, e, f }
}

/**
 * The map warped onto one tile of the town's grid as RGBA: each grid pixel
 * the darkest of the map's pixels under it (so a line thinner than the grid's
 * pixel is kept), transparent outside the map and in its mask.
 */
export function warpTile(img, r, T, t) {
  const det = T.a * T.e - T.b * T.d
  const ia = T.e / det
  const ib = -T.b / det
  const id = -T.d / det
  const ie = T.a / det
  const rgba = new Uint8Array(t.w * t.h * 4)
  // (map pixels to a grid pixel, a side)
  const k = Math.max(1, Math.round(1 / Math.hypot(T.a, T.d)))
  for (let y = 0; y < t.h; y++) {
    for (let x = 0; x < t.w; x++) {
      const gx = t.x + x + 0.5 - T.c
      const gy = t.y + y + 0.5 - T.f
      const u0 = ia * gx + ib * gy
      const v0 = id * gx + ie * gy
      if (u0 < 0 || v0 < 0 || u0 >= img.width || v0 >= img.height) continue
      const fx = u0 / img.width
      const fy = v0 / img.height
      if ((r.mask || []).some(([a, b, c, d]) => fx >= a && fx < c && fy >= b && fy < d)) continue
      let lo = 255
      for (let q = 0; q < k; q++) {
        for (let p = 0; p < k; p++) {
          const fp = (p + 0.5) / k - 0.5
          const fq = (q + 0.5) / k - 0.5
          const u = Math.floor(u0 + fp * ia + fq * ib)
          const v = Math.floor(v0 + fp * id + fq * ie)
          if (u < 0 || v < 0 || u >= img.width || v >= img.height) continue
          lo = Math.min(lo, img.grey[v * img.width + u])
        }
      }
      const o = (y * t.w + x) * 4
      rgba[o] = rgba[o + 1] = rgba[o + 2] = lo
      rgba[o + 3] = 255
    }
  }
  return { width: t.w, height: t.h, rgba }
}
