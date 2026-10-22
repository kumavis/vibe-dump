#!/usr/bin/env node
// The table's bake (DATA.md §§1–3 and 11; ENGINEERING.md §§12–13): the
// relief of the whole theatre as one pack, table/height.png, on the
// azimuthal equidistant projection centred at 141.5° E 7° N; the coast as
// table/coast.json; and manifest.json, which describes both.
//
//   node tools/bake-table.mjs --all            download, bake, check, clean (DATA.md §11)
//   node tools/bake-table.mjs --download       ETOPO 2022 60″ in bands either side of 180°, Natural Earth zips
//   node tools/bake-table.mjs --bake           the pack, the coast and the manifest, from the downloads
//   node tools/bake-table.mjs --check          tools/check-data.mjs's packs module (and core)
//   node tools/bake-table.mjs --preview DIR    hillshaded pictures of the committed pack with the coast drawn
//   node tools/bake-table.mjs --clean          delete this bake's downloads
//   --downloads DIR (or $PACIFIC_THEATRE_DOWNLOADS) moves the downloads, which stay outside the repository.
//
// How the pack is made (DATA.md §2):
// - The grid is regular in projected space: 2048 texels across the bounding
//   rectangle of the theatre box (78° E – 155° W, 42° S – 56° N) as projected,
//   square texels of about 6.9 km, rows as many as the rectangle needs; the
//   rectangle's corners reach past the box, so the lon/lat envelope of the
//   whole rectangle is what is fetched (R1 §5.2).
// - Land is decided by Natural Earth alone: a texel is land where the land
//   and minor-island polygons cover at least half of it, measured on a 4 × 4
//   grid of samples in each texel. ETOPO never decides land (it paints Salmon
//   Bank and reef flats as land; R1 §3.3).
// - Heights are ETOPO 2022's 60″ surface at stride 2, every cell binned
//   forward into the texel its centre projects to, weighted by cos φ (its true
//   area), land cells and sea cells apart (a cell is land where the Natural
//   Earth samples say so at its centre). A land texel takes its land cells'
//   mean (each cell no lower than 0 m, the texel no lower than 0.5 m); a sea
//   texel its sea cells' mean, each clamped to −1 m or deeper.
// - Encoded `metres = (R·256 + G)·0.5 − 11000` (the trench to the Himalaya in
//   the rectangle's corner).
// The coast (DATA.md §3): Natural Earth 10 m land, minor islands and the
// closed rings of its reef lines as polygons, clipped to the envelope, merged
// at 180°, simplified, each with its kind, its Natural Earth id and its area;
// the strokes from the two coastline layers; no Natural Earth name string.
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ETOPO, ETOPO60_URL, downloadEtopo60, readEtopo60 } from './lib/etopo.mjs'
import { Ledger, downloadsDir } from './lib/fetch.mjs'
import { TableProjection, densifyLonLat } from './lib/geo.mjs'
import * as ne from './lib/ne.mjs'
import { encodePNG, readPNG } from './lib/png.mjs'
import { cropRGB, decodeHeights, drawLine, drawMark, hillshadeRGB, shrinkRGB } from './lib/raster.mjs'
import { simplifyLine, simplifyPolygon } from './lib/simplify.mjs'

const PKG = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(PKG, 'public/data')

export const PROJECTION = { kind: 'aeqd', lon0: 141.5, lat0: 7.0, unit: 1000 }
export const BOUNDS = [78, -42, 205, 56]
export const WIDTH = 2048
export const ENC = { scale: 0.5, offset: -11000 }
const STRIDE = 2 // ETOPO 60″ cells taken: every second row and column (about 3.7 km)
const SUPER = 4 // Natural Earth samples per texel side
const COAST_TOL = 1500 // metres: Douglas–Peucker tolerance for coast.json (vertices about 1.5 km apart; the texel is 6.9 km)
const COAST_DIGITS = 3 // decimals of a degree in coast.json (110 m; 4, 11 m, for islets smaller than COAST_FINE_KM2)
const COAST_FINE_KM2 = 50 // about a texel
const DENSIFY_KM = 50 // longer edges (the clip along the envelope) get points so they do not chord across the azimuthal table

const r4 = (v) => Math.round(v * 1e4) / 1e4
const r3 = (v) => Math.round(v * 1e3) / 1e3
const log = (s) => console.log(s)

/**
 * The table's grid: the projected rectangle of the theatre box, WIDTH texels
 * across, square texels, centred; its lon/lat envelope (what the rectangle's
 * edges reach). The same computation as tools/fake-data.mjs's, finer.
 */
export function tableGeometry() {
  const proj = new TableProjection(PROJECTION)
  let ex = [Infinity, Infinity, -Infinity, -Infinity]
  const grow = (lon, lat) => {
    const [x, z] = proj.toWorld([lon, lat])
    ex = [Math.min(ex[0], x), Math.min(ex[1], z), Math.max(ex[2], x), Math.max(ex[3], z)]
  }
  for (let l = BOUNDS[0]; l <= BOUNDS[2] + 1e-9; l += 0.01) grow(l, BOUNDS[1]), grow(l, BOUNDS[3])
  for (let a = BOUNDS[1]; a <= BOUNDS[3] + 1e-9; a += 0.01) grow(BOUNDS[0], a), grow(BOUNDS[2], a)
  const W = WIDTH
  const texel = (ex[2] - ex[0]) / W
  const H = Math.ceil((ex[3] - ex[1]) / texel - 1e-9)
  const cx = (ex[0] + ex[2]) / 2
  const cz = (ex[1] + ex[3]) / 2
  const extent = [cx - (W * texel) / 2, cz - (H * texel) / 2, cx + (W * texel) / 2, cz + (H * texel) / 2].map(r4)
  let env = [Infinity, Infinity, -Infinity, -Infinity]
  const N = 4000
  for (let k = 0; k <= N; k++) {
    const t = k / N
    for (const [x, z] of [
      [extent[0] + (extent[2] - extent[0]) * t, extent[1]],
      [extent[0] + (extent[2] - extent[0]) * t, extent[3]],
      [extent[0], extent[1] + (extent[3] - extent[1]) * t],
      [extent[2], extent[1] + (extent[3] - extent[1]) * t],
    ]) {
      const [lon, lat] = proj.toLonLat(x, z)
      env = [Math.min(env[0], lon), Math.min(env[1], lat), Math.max(env[2], lon), Math.max(env[3], lat)]
    }
  }
  // rounded outward to a thousandth of a degree
  const envelope = [Math.floor(env[0] * 1e3) / 1e3, Math.floor(env[1] * 1e3) / 1e3, Math.ceil(env[2] * 1e3) / 1e3, Math.ceil(env[3] * 1e3) / 1e3]
  const tx = (extent[2] - extent[0]) / W
  return { proj, W, H, extent, envelope, texelKm: tx }
}

// ---------------------------------------------------------------------------
// Natural Earth, prepared once for the mask and the coast

/** Polygons of the land, minor-island and reef layers, shifted, oriented, clipped to the envelope and merged at 180°: { kind: [{ rings, id }] }. */
async function nePolygons(dir, envelope) {
  const out = {}
  const stats = {}
  for (const { name, kind } of ne.NE_POLYGONS) {
    const recs = await ne.readLayer(dir, name)
    let items = []
    for (const r of recs) {
      // the reefs are lines in Natural Earth 10 m: their closed rings are taken as reef polygons
      const polys = kind === 'reef' ? ne.linesOf(r.geometry).filter((l) => l.length >= 4 && l[0][0] === l[l.length - 1][0] && l[0][1] === l[l.length - 1][1]).map((l) => [l]) : ne.polygonsOf(r.geometry)
      polys.forEach((p, pi) => {
        const s = ne.shiftPolygon(ne.orientPolygon(p), envelope)
        if (!s) return
        const id = `${name}:${r.index}${polys.length > 1 ? `.${pi}` : ''}`
        for (const c of ne.clipPolygonToRect(s, envelope)) items.push({ rings: c, id })
      })
    }
    const m = ne.mergeAtMeridian(items)
    items = m.items
    out[kind] = items
    stats[kind] = { polygons: items.length, mergedAt180: m.merged, vertices: items.reduce((a, it) => a + it.rings.reduce((b, r) => b + r.length, 0), 0) }
  }
  return { polys: out, stats }
}

/** The coastline lines, shifted, clipped to the envelope and joined at 180°: [{ pts, id }]. Also the reef lines, apart. */
async function neLines(dir, envelope) {
  const strokes = []
  for (const { name } of ne.NE_LINES) {
    const recs = await ne.readLayer(dir, name)
    for (const r of recs) {
      const lines = ne.linesOf(r.geometry)
      lines.forEach((l, li) => {
        const s = ne.shiftLine(l, envelope)
        if (!s) return
        for (const piece of ne.clipLineToRect(s, envelope)) strokes.push({ pts: piece, id: `${name}:${r.index}${lines.length > 1 ? `.${li}` : ''}` })
      })
    }
  }
  const j = ne.joinAtMeridian(strokes)
  const reefs = []
  for (const r of await ne.readLayer(dir, 'ne_10m_reefs')) {
    for (const l of ne.linesOf(r.geometry)) {
      const s = ne.shiftLine(l, envelope)
      if (!s) continue
      for (const piece of ne.clipLineToRect(s, envelope)) reefs.push({ pts: piece, id: `ne_10m_reefs:${r.index}` })
    }
  }
  return { strokes: j.items, joinedAt180: j.joined, reefs }
}

// ---------------------------------------------------------------------------
// The land mask: Natural Earth's land and minor islands, scan-converted on
// the projected grid, SUPER × SUPER samples per texel (each sample's centre
// inside a polygon by the even-odd rule over the layer's rings)

function rasterise(items, geo, mask) {
  const { proj, W, H, extent } = geo
  const SW = W * SUPER
  const SH = H * SUPER
  const sx = SW / (extent[2] - extent[0])
  const sz = SH / (extent[3] - extent[1])
  const rows = new Array(SH)
  for (let r = 0; r < SH; r++) rows[r] = []
  for (const { rings } of items) {
    for (const ring of rings) {
      const pts = densifyLonLat(ring, 20).map((p) => {
        const [x, z] = proj.toWorld(p)
        return [(x - extent[0]) * sx, (z - extent[1]) * sz]
      })
      for (let i = 0; i + 1 < pts.length; i++) {
        const [ax, ay] = pts[i]
        const [bx, by] = pts[i + 1]
        if (ay === by) continue
        const y0 = Math.min(ay, by)
        const y1 = Math.max(ay, by)
        const r0 = Math.max(0, Math.ceil(y0 - 0.5))
        const r1 = Math.min(SH - 1, Math.ceil(y1 - 0.5) - 1)
        for (let r = r0; r <= r1; r++) {
          const yc = r + 0.5
          rows[r].push(ax + ((yc - ay) * (bx - ax)) / (by - ay))
        }
      }
    }
  }
  for (let r = 0; r < SH; r++) {
    const xs = Float64Array.from(rows[r]).sort()
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const c0 = Math.max(0, Math.ceil(xs[k] - 0.5))
      const c1 = Math.min(SW - 1, Math.ceil(xs[k + 1] - 0.5) - 1)
      for (let c = c0; c <= c1; c++) mask[r * SW + c] = 1
    }
    rows[r] = null
  }
}

// ---------------------------------------------------------------------------
// --download

function download(dir) {
  const ledger = new Ledger(dir)
  const geo = tableGeometry()
  log(`table ${geo.W}×${geo.H} at ${geo.texelKm.toFixed(3)} km; envelope ${geo.envelope.join(', ')}`)
  log('downloads:')
  ne.downloadNE(ledger, dir, log)
  downloadEtopo60(ledger, dir, geo.envelope, { stride: STRIDE }, log)
}

// ---------------------------------------------------------------------------
// --bake

async function bake(dir) {
  const t0 = Date.now()
  const lap = (s) => log(`[${((Date.now() - t0) / 1000).toFixed(1)} s] ${s}`)
  const ledger = new Ledger(dir)
  const geo = tableGeometry()
  const { proj, W, H, extent, envelope } = geo
  const texel = geo.texelKm
  lap(`table ${W}×${H} at ${texel.toFixed(4)} km, extent ${extent.join(', ')}, envelope ${envelope.join(', ')}`)

  // Natural Earth
  const { polys, stats: neStats } = await nePolygons(dir, envelope)
  lap(`natural earth: ${Object.entries(neStats).map(([k, v]) => `${k} ${v.polygons} polygons (${v.vertices} vertices, ${v.mergedAt180} merged at 180°)`).join('; ')}`)
  const SW = W * SUPER
  const mask = new Uint8Array(SW * H * SUPER)
  const landMask = new Uint8Array(SW * H * SUPER)
  rasterise(polys.land, geo, landMask)
  const islandMask = new Uint8Array(SW * H * SUPER)
  rasterise(polys.island, geo, islandMask)
  for (let i = 0; i < mask.length; i++) mask[i] = landMask[i] | islandMask[i]
  const cover = new Uint8Array(W * H) // samples of 16 that are land
  for (let r = 0; r < H * SUPER; r++) {
    const j = Math.floor(r / SUPER)
    for (let c = 0; c < SW; c++) if (mask[r * SW + c]) cover[j * W + Math.floor(c / SUPER)]++
  }
  lap('natural earth: land and minor islands scan-converted, 4 × 4 samples a texel')

  // ETOPO, binned forward
  const et = readEtopo60(dir, envelope, { stride: STRIDE })
  lap(`etopo 60″: ${et.nx} × ${et.ny} cells at stride ${STRIDE}, lon ${et.lons[0].toFixed(3)} .. ${et.lons[et.nx - 1].toFixed(3)}, lat ${et.lats[0].toFixed(3)} .. ${et.lats[et.ny - 1].toFixed(3)}`)
  const wAll = new Float64Array(W * H)
  const wL = new Float64Array(W * H)
  const zL = new Float64Array(W * H)
  const wS = new Float64Array(W * H)
  const zS = new Float64Array(W * H)
  const isx = SW / (extent[2] - extent[0])
  const isz = (H * SUPER) / (extent[3] - extent[1])
  let binned = 0
  let etopoLandAtSea = 0
  for (let j = 0; j < et.ny; j++) {
    const lat = et.lats[j]
    const w = Math.cos((lat * Math.PI) / 180)
    for (let i = 0; i < et.nx; i++) {
      const z = et.z[j * et.nx + i]
      if (z !== z) continue
      const [x, y] = proj.toWorld([et.lons[i], lat])
      const sc = Math.floor((x - extent[0]) * isx)
      const sr = Math.floor((y - extent[1]) * isz)
      if (sc < 0 || sr < 0 || sc >= SW || sr >= H * SUPER) continue
      const t = Math.floor(sr / SUPER) * W + Math.floor(sc / SUPER)
      wAll[t] += w
      if (mask[sr * SW + sc]) {
        wL[t] += w
        zL[t] += w * Math.max(0, z)
      } else {
        wS[t] += w
        zS[t] += w * Math.min(-1, z)
        if (z > -1) etopoLandAtSea++
      }
      binned++
    }
  }
  lap(`etopo 60″: ${binned} cells binned (${etopoLandAtSea} of them above −1 m where Natural Earth has sea, clamped)`)

  // a texel's ETOPO at its centre, for the rare texel no cell of its kind reached
  const dLat = et.lats[1] - et.lats[0]
  const dLon = et.lons[1] - et.lons[0]
  const etopoAt = (lon, lat) => {
    const fy = Math.max(0, Math.min(et.ny - 1.0001, (lat - et.lats[0]) / dLat))
    const fx = Math.max(0, Math.min(et.nx - 1.0001, (lon - et.lons[0]) / dLon))
    const i = Math.floor(fx)
    const j = Math.floor(fy)
    const a = fx - i
    const b = fy - j
    const Z = et.z
    const n = et.nx
    return (Z[j * n + i] * (1 - a) + Z[j * n + i + 1] * a) * (1 - b) + (Z[(j + 1) * n + i] * (1 - a) + Z[(j + 1) * n + i + 1] * a) * b
  }

  const rgb = new Uint8Array(W * H * 3)
  let nLand = 0
  let min = Infinity
  let max = -Infinity
  let fallbackLand = 0
  let fallbackSea = 0
  const LAND_MIN = 0.5
  for (let t = 0; t < W * H; t++) {
    let m
    if (cover[t] * 2 >= SUPER * SUPER) {
      if (wL[t] > 0) m = Math.max(LAND_MIN, zL[t] / wL[t])
      else {
        const [lon, lat] = proj.toLonLat(extent[0] + ((t % W) + 0.5) * texel, extent[1] + (Math.floor(t / W) + 0.5) * texel)
        m = Math.max(LAND_MIN, etopoAt(lon, lat))
        fallbackLand++
      }
      nLand++
    } else if (wS[t] > 0) m = zS[t] / wS[t]
    else {
      const [lon, lat] = proj.toLonLat(extent[0] + ((t % W) + 0.5) * texel, extent[1] + (Math.floor(t / W) + 0.5) * texel)
      m = Math.min(-1, etopoAt(lon, lat))
      fallbackSea++
    }
    const v = Math.max(0, Math.min(65535, Math.round((m - ENC.offset) / ENC.scale)))
    // a land texel never rounds to 0 m or below, a sea texel never to above −1 m
    const vv = cover[t] * 2 >= SUPER * SUPER ? Math.max(v, Math.round((LAND_MIN - ENC.offset) / ENC.scale)) : Math.min(v, Math.round((-1 - ENC.offset) / ENC.scale))
    rgb[t * 3] = vv >> 8
    rgb[t * 3 + 1] = vv & 255
    const back = vv * ENC.scale + ENC.offset
    if (back < min) min = back
    if (back > max) max = back
  }
  const png = encodePNG(W, H, rgb, 3)
  mkdirSync(join(OUT, 'table'), { recursive: true })
  writeFileSync(join(OUT, 'table/height.png'), png)
  const landFraction = nLand / (W * H)
  lap(`table/height.png: ${(png.length / 1e6).toFixed(2)} MB, land ${(landFraction * 100).toFixed(2)} %, ${min} .. ${max} m (${fallbackLand} land and ${fallbackSea} sea texels from ETOPO at the centre)`)

  // the coast
  const coast = await writeCoast(dir, envelope, polys)
  lap(`table/coast.json: ${(coast.bytes / 1e6).toFixed(2)} MB, ${coast.features} polygons (${coast.vertices} vertices), ${coast.strokes} strokes (${coast.strokeVertices} vertices), ${coast.reefs} reef lines`)

  // the manifest
  const fetchedOf = (files) => files.map((f) => ledger.get(join(dir, f))?.fetched).filter(Boolean).sort().pop()
  const etFiles = (await import('./lib/etopo.mjs')).etopo60Requests(envelope, { stride: STRIDE }).map((r) => r.file)
  const neZips = [...ne.NE_POLYGONS, ...ne.NE_LINES].map(({ name }) => `ne/${name}.zip`)
  const etBytes = etFiles.reduce((s, f) => s + (ledger.get(join(dir, f))?.bytes || 0), 0)
  const manifest = {
    projection: PROJECTION,
    table: {
      id: 'table',
      name: 'The Pacific theatre',
      bounds: BOUNDS,
      envelope,
      size: [W, H],
      extent,
      metresPerTexel: [+(texel * 1000).toFixed(1), +(texel * 1000).toFixed(1)],
      height: { file: 'table/height.png', scale: ENC.scale, offset: ENC.offset },
      coast: 'table/coast.json',
      labels: 'table/labels.json',
      stats: { landFraction: +landFraction.toFixed(4), minMetres: min, maxMetres: max },
      sources: [
        {
          id: 'etopo-2022-60s',
          title: 'ETOPO 2022 60 arc-second surface elevation (Global Relief Model)',
          doi: ETOPO.doi,
          url: ETOPO60_URL,
          page: ETOPO.page,
          fetched: fetchedOf(etFiles),
          licence: ETOPO.licence,
          citation: 'NOAA National Centers for Environmental Information (2022), ETOPO 2022 60 Arc-Second Global Relief Model, doi:10.25921/fd45-gt74',
          note:
            `OPeNDAP subsets at stride ${STRIDE} (every second 60″ cell, about 3.7 km), ${etFiles.length} bands either side of 180° stitched into one grid (${(etBytes / 1e6).toFixed(1)} MB); ` +
            'each cell binned into the texel its centre projects to, weighted by cos φ, land and sea cells apart; heights only: land is decided by Natural Earth; sea never shallower than −1 m',
        },
        {
          id: 'natural-earth-10m',
          title: 'Natural Earth 10 m physical vectors: land, minor islands, reefs, coastline, minor islands coastline',
          url: ne.NE.page,
          files: [...ne.NE_POLYGONS, ...ne.NE_LINES].map(({ name }) => ne.neUrl(name)),
          terms: ne.NE.terms,
          fetched: fetchedOf(neZips),
          licence: ne.NE.licence,
          note:
            'decides the table’s land: a texel is land where the land and minor-island polygons cover at least half of it (4 × 4 samples a texel); ' +
            'coast.json carries the polygons (clipped to the envelope, merged at 180°, simplified) and the coastline strokes; no Natural Earth name is used',
        },
      ],
    },
  }
  writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
  lap(`manifest.json written`)
}

/** Decimals of a degree for a shape of this size (km²): 3 (110 m) for anything larger than the texel, 4 (11 m) for islets. */
const digitsFor = (km2) => (km2 >= COAST_FINE_KM2 ? COAST_DIGITS : COAST_DIGITS + 1)
const roundTo = (d) => {
  const q = 10 ** d
  return ([x, y]) => [Math.round(x * q) / q, Math.round(y * q) / q]
}
/** The extent of a line in km² (its bounding box), to choose its precision as a polygon's. */
function lineKm2(pts) {
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (const [x, y] of pts) {
    if (x < x0) x0 = x
    if (y < y0) y0 = y
    if (x > x1) x1 = x
    if (y > y1) y1 = y
  }
  return (x1 - x0) * 111.32 * Math.cos(((y0 + y1) / 2) * (Math.PI / 180)) * (y1 - y0) * 110.574
}

async function writeCoast(dir, envelope, polys) {
  const features = []
  let vertices = 0
  let invalid = 0
  let dropped = 0
  for (const kind of ['land', 'island', 'reef']) {
    for (const { rings, id } of polys[kind]) {
      const area = ne.polygonAreaKm2(rings)
      // the coarser precision first; finer where rounding would break the polygon
      let s = null
      let d = digitsFor(area)
      for (; d <= 6; d++) {
        s = simplifyPolygon(rings, COAST_TOL, { digits: d })
        if (s && !s.invalid) break
      }
      if (!s) {
        dropped++
        continue
      }
      if (s.invalid) {
        invalid++
        log(`  warning: ${id} (${kind}, ${area.toPrecision(3)} km²) crosses itself at the source’s own vertices`)
      }
      const out = s.rings.map((r) => densifyLonLat(r, DENSIFY_KM).map(roundTo(d)))
      vertices += out.reduce((a, r) => a + r.length, 0)
      features.push({ type: 'Feature', properties: { kind, ne: id, area: area >= 100 ? Math.round(area) : +area.toPrecision(3) }, geometry: { type: 'Polygon', coordinates: out } })
    }
  }
  if (dropped) log(`  warning: ${dropped} polygons collapsed at every precision and were dropped`)
  // the larger first, so a reader that stops early has the land
  features.sort((a, b) => b.properties.area - a.properties.area)
  const { strokes, reefs } = await neLines(dir, envelope)
  const strokeFeatures = []
  let strokeVertices = 0
  for (const { pts, id } of strokes) {
    const l = simplifyLine(pts, COAST_TOL, { digits: digitsFor(lineKm2(pts)) })
    if (!l) continue
    strokeVertices += l.length
    strokeFeatures.push({ type: 'Feature', properties: { ne: id }, geometry: { type: 'LineString', coordinates: l } })
  }
  const reefFeatures = []
  for (const { pts, id } of reefs) {
    const l = simplifyLine(pts, COAST_TOL, { digits: digitsFor(lineKm2(pts)) })
    if (l) reefFeatures.push({ type: 'Feature', properties: { ne: id }, geometry: { type: 'LineString', coordinates: l } })
  }
  const fc = {
    type: 'FeatureCollection',
    note:
      'Natural Earth 10 m (public domain), clipped to the table’s envelope, its splits at 180° merged (longitudes continuous, past 180 where they fall), ' +
      `simplified at ${COAST_TOL} m. Polygons: kind land (ne_10m_land), island (ne_10m_minor_islands), reef (the closed rings of ne_10m_reefs, which is a line layer); ` +
      'area in km² on the sphere, before simplification; outer rings counter-clockwise. strokes: ne_10m_coastline and ne_10m_minor_islands_coastline. reefs: every ne_10m_reefs line, open or closed.',
    features,
    strokes: { type: 'FeatureCollection', features: strokeFeatures },
    reefs: { type: 'FeatureCollection', features: reefFeatures },
  }
  const text = JSON.stringify(fc)
  writeFileSync(join(OUT, 'table/coast.json'), text + '\n')
  if (invalid) log(`  warning: ${invalid} polygons stay invalid at the source's own vertices`)
  return { bytes: text.length, features: features.length, vertices, strokes: strokeFeatures.length, strokeVertices, reefs: reefFeatures.length }
}

// ---------------------------------------------------------------------------
// --preview DIR: what a person looks at before calling the pack done

function preview(outDir) {
  const m = JSON.parse(readFileSync(join(OUT, 'manifest.json'), 'utf8'))
  const t = m.table
  const proj = new TableProjection(m.projection)
  const [W, H] = t.size
  const heights = decodeHeights(readPNG(join(OUT, t.height.file)), t.height.scale, t.height.offset)
  const cell = (t.extent[2] - t.extent[0]) / W
  const rgb = hillshadeRGB(heights, W, H, { cell: [cell * 1000, cell * 1000], exag: 18 })
  const coast = JSON.parse(readFileSync(join(OUT, t.coast), 'utf8'))
  const px = (lonlat) => {
    const [x, z] = proj.toWorld(lonlat)
    return [(x - t.extent[0]) / cell - 0.5, (z - t.extent[1]) / cell - 0.5]
  }
  for (const f of coast.strokes.features) {
    const c = f.geometry.coordinates
    for (let i = 0; i + 1 < c.length; i++) {
      const a = px(c[i])
      const b = px(c[i + 1])
      drawLine(rgb, W, H, a[0], a[1], b[0], b[1], [20, 20, 20])
    }
  }
  // places a person checks by eye (the record's positions; red where they are)
  const marks = {
    'Salmon Bank (must be sea)': [-176.47, 27.0],
    'Midway': [-177.37, 28.21],
    'Pearl Harbor': [-157.97, 21.36],
    'Savo': [159.81, -9.13],
    'Samar (east coast)': [125.75, 11.5],
    'Tokyo': [139.77, 35.68],
    'Attu': [173.2, 52.9],
  }
  for (const [name, ll] of Object.entries(marks)) {
    const [x, y] = px(ll)
    drawMark(rgb, W, H, x, y, [230, 30, 30])
    const k = Math.round(y) * W + Math.round(x)
    log(`  ${name.padEnd(26)} texel (${Math.round(x)}, ${Math.round(y)}): ${heights[k].toFixed(1)} m`)
  }
  mkdirSync(outDir, { recursive: true })
  const write = (name, img) => {
    writeFileSync(join(outDir, name), encodePNG(img.W, img.H, img.rgb, 3))
    log(`  wrote ${join(outDir, name)} (${img.W}×${img.H})`)
  }
  write('table.png', { rgb, W, H })
  write('table-half.png', shrinkRGB(rgb, W, H, 2))
  const crop = (name, ll, size, factor) => {
    const [x, y] = px(ll)
    write(name, cropRGB(rgb, W, H, x - size / 2, y - size / 2, size, size, factor))
  }
  crop('table-hawaii-midway.png', [-170, 25], 320, 3)
  crop('table-solomons.png', [158, -8], 200, 4)
  crop('table-philippines.png', [123, 12], 260, 3)
  crop('table-japan.png', [137, 36], 300, 3)
  crop('table-aleutians.png', [180, 53], 300, 3)
}

// ---------------------------------------------------------------------------
// --check and --clean

function check() {
  const r = spawnSync(process.execPath, [join(PKG, 'tools/check-data.mjs'), '--only', 'packs'], { stdio: 'inherit' })
  return r.status ?? 1
}

function clean(dir) {
  const ledger = new Ledger(dir)
  let n = 0
  for (const sub of ['etopo60', 'ne']) {
    const p = join(dir, sub)
    if (existsSync(p)) {
      rmSync(p, { recursive: true, force: true })
      n++
    }
  }
  for (const k of Object.keys(ledger.entries)) if (k.startsWith('etopo60/') || k.startsWith('ne/')) delete ledger.entries[k]
  writeFileSync(ledger.path, JSON.stringify(ledger.entries, null, 2) + '\n')
  log(`clean: removed ${n} download directories from ${dir}`)
}

// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2)
  const has = (f) => args.includes(f)
  const all = has('--all')
  const dir = downloadsDir(args, PKG)
  if (resolve(dir).startsWith(resolve(PKG))) throw new Error('downloads inside the package')
  let code = 0
  if (!args.some((a) => a.startsWith('--')) || has('--help')) {
    log('usage: node tools/bake-table.mjs --all | --download | --bake | --check | --preview DIR | --clean  [--downloads DIR]')
    return
  }
  log(`downloads: ${dir}`)
  if (all || has('--download')) download(dir)
  if (all || has('--bake')) await bake(dir)
  if (all || has('--check')) code = check()
  const pv = args.indexOf('--preview')
  if (pv >= 0) preview(resolve(args[pv + 1] || join(dir, 'previews')))
  if (all || has('--clean')) clean(dir)
  for (const f of ['table/height.png', 'table/coast.json', 'manifest.json']) {
    const p = join(OUT, f)
    if (existsSync(p)) log(`  ${relative(PKG, p)}: ${(statSync(p).size / 1e6).toFixed(2)} MB`)
  }
  process.exitCode = code
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e.stack || e.message)
    process.exitCode = 1
  })
}
