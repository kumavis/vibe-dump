#!/usr/bin/env node
// The battle boxes' bake (DATA.md §§2, 7 and 11; ENGINEERING.md §§12–13): one
// height pack per box in its own tangent plane, boxes/<id>/height.png, and
// its entry in boxes/manifest.json with the placement on the table.
//
//   node tools/bake-box.mjs --all                    every v1 box: download, bake, check, clean
//   node tools/bake-box.mjs midway --all             one box, every step
//   node tools/bake-box.mjs <id>... --download       GLO-30 windows by range, GMRT, ETOPO 15″ (and CUDEM for pearl-harbor)
//   node tools/bake-box.mjs <id>... --bake           the packs and the manifest entries, from the downloads
//   node tools/bake-box.mjs --check                  tools/check-data.mjs's packs module (and core)
//   node tools/bake-box.mjs <id>... --preview DIR    hillshaded pictures of the committed packs with the coast drawn
//   node tools/bake-box.mjs <id>... --clean          delete the boxes' downloads
//   --downloads DIR (or $PACIFIC_THEATRE_DOWNLOADS) moves the downloads, which stay outside the repository.
//
// How a pack is made (DATA.md §7):
// - The grid is the frozen box of tools/check/ids.json: its bounds, widened by
//   less than a texel so the texels are square in the box's tangent plane at
//   its lat0 (tools/lib/geo.mjs packGrid with the frozen long side), which
//   gives exactly the frozen size; the widening is reported.
// - Land comes from Copernicus GLO-30 only: windows of its COGs read by HTTP
//   range through curl at the overview whose cell is at most half a texel,
//   shifted half a cell for PixelIsPoint, area-weighted into texels; a texel
//   is land where at least half of it is GLO-30 land (a cell above 0 m) and
//   then holds the land cells' mean, at least 0.25 m. A missing tile is ocean.
// - Sea comes from GMRT's `topo` grid at about the texel (ESRI ASCII, spaced
//   retries), area-weighted, or from ETOPO 2022 15″ where GMRT failed; a sea
//   texel is never shallower than −1 m, and GMRT's land is never used.
// - Pearl Harbor (R10 D1–D2): NOAA's CUDEM 1/9″ over the harbour and the
//   south shore (the two tiles), land and harbour floor alike, by the same
//   half-land rule; GLO-30 and GMRT elsewhere. Then the shore is set back to
//   7 December 1941 from the dated works of tools/lib/oahu-1941.mjs: every
//   work dated after 1941 is undone, at the texel, on its authors' word.
// - Encoded `metres = (R·256 + G)·0.25 − 11000`.
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { cachedWindow, loadGrid } from './lib/cog.mjs'
import { CUDEM, binCudemTile, downloadCudem } from './lib/cudem.mjs'
import { ETOPO, downloadEtopo15, etopo15Requests, readEtopo15 } from './lib/etopo.mjs'
import { Ledger, downloadsDir, fetchTo } from './lib/fetch.mjs'
import { TableProjection, packGrid, placement, tangentK } from './lib/geo.mjs'
import { GMRT, downloadGmrt, gmrtRequests, readGmrt } from './lib/gmrt.mjs'
import * as works from './lib/oahu-1941.mjs'
import { encodePNG, readPNG } from './lib/png.mjs'
import { axisWeights, cropRGB, decodeHeights, drawLine, drawMark, hillshadeRGB, resampleGrid } from './lib/raster.mjs'

const PKG = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(PKG, 'public/data')
const IDS = JSON.parse(readFileSync(join(PKG, 'tools/check/ids.json'), 'utf8'))
const TABLE_PROJECTION = { kind: 'aeqd', lon0: 141.5, lat0: 7.0, unit: 1000 }

export const ENC = { scale: 0.25, offset: -11000 }
const LAND_MIN = 0.25 // a land texel stands at least this high (DATA.md §7)
const SEA_MAX = -1 // a sea texel is never shallower (DATA.md §7)
const CUDEM_FULL = 0.98 // a texel takes CUDEM where at least this share of its cells have data
// Sea floor deeper than 1000 m is stored to 2 m, deeper than 50 m to 1 m, and
// above that to the encoding's 0.25 m: the deep floor is never seen through
// the water, and its low byte is most of a box's file (Midway: 3.2 MB to 1.9).
const SEA_STEPS = [
  [-1000, 2],
  [-50, 1],
]

/** The Copernicus GLO-30 source, its notice and liability sentence verbatim from DATA.md §7 and NOTICE.md. */
export const GLO30 = {
  id: 'glo-30',
  title: 'Copernicus DEM GLO-30',
  url: 'https://copernicus-dem-30m.s3.amazonaws.com/',
  licence: 'attribution',
  notice:
    'produced using Copernicus WorldDEM-30 © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved',
  liability: 'The organisations in charge of the Copernicus programme by law or by delegation do not incur any liability for any use of the Copernicus WorldDEM-30',
  terms: 'https://dataspace.copernicus.eu/explore-data/data-collections/copernicus-contributing-missions/collections-description/COP-DEM',
}
const GLO30_TILELIST = 'https://copernicus-dem-30m.s3.amazonaws.com/tileList.txt'
const OSM = {
  id: 'osm',
  title: 'OpenStreetMap',
  url: 'https://www.openstreetmap.org/copyright',
  licence: 'odbl',
  credit: '© OpenStreetMap contributors',
}

/** What the frozen ids do not carry: the box's display name and, for Pearl Harbor, the CUDEM tiles and the year the shore is set to. */
const BOXES = {
  midway: { name: 'Midway' },
  'pearl-harbor': { name: 'Pearl Harbor', cudem: ['ncei19_n21x50_w158x00_2021v1', 'ncei19_n21x50_w158x25_2021v1'], shoreYear: 1941 },
  'ironbottom-sound': { name: 'Ironbottom Sound' },
  samar: { name: 'Samar' },
}

const log = (s) => console.log(s)
const round = (v, d) => Math.round(v * 10 ** d) / 10 ** d

/** A box's grid: the frozen bounds squared in its tangent plane at the frozen long side, which reproduces the frozen size. */
export function boxGrid(id) {
  const f = IDS.boxes[id]
  if (!f) throw new Error(`${id} is not a frozen box (${Object.keys(IDS.boxes).join(', ')})`)
  const g = packGrid(f.bounds, { lat0: f.lat0, longSide: Math.max(...f.size) })
  if (g.W !== f.size[0] || g.H !== f.size[1]) throw new Error(`${id}: the squared grid is ${g.W}×${g.H}, frozen ${f.size.join('×')}`)
  const moved = [(f.bounds[0] - g.bounds[0]) / g.dLon, (f.bounds[1] - g.bounds[1]) / g.dLat, (g.bounds[2] - f.bounds[2]) / g.dLon, (g.bounds[3] - f.bounds[3]) / g.dLat]
  return { ...g, id, frozen: f, moved }
}

// ---------------------------------------------------------------------------
// GLO-30 tiles

const pad2 = (v) => String(Math.abs(v)).padStart(2, '0')
const pad3 = (v) => String(Math.abs(v)).padStart(3, '0')
/** A GLO-30 tile's name from its south-west corner (lon in [−180, 180)). */
export const glo30Name = (lat, lon) => `Copernicus_DSM_COG_10_${lat < 0 ? 'S' : 'N'}${pad2(lat)}_00_${lon < 0 ? 'W' : 'E'}${pad3(lon)}_00_DEM`
export const glo30Url = (name) => `${GLO30.url}${name}/${name}.tif`

/** Every 1° cell the grid (padded by `pad` texels) meets: { name, lat, lon (continuous), off, window (in the tile's own longitudes) }. */
function glo30Cells(grid, pad = 3) {
  const [w0, s0, e0, n0] = grid.bounds
  const w = w0 - pad * grid.dLon
  const e = e0 + pad * grid.dLon
  const s = s0 - pad * grid.dLat
  const n = n0 + pad * grid.dLat
  const out = []
  for (let la = Math.floor(s); la < n; la++) {
    for (let lo = Math.floor(w); lo < e; lo++) {
      const L = ((((lo + 180) % 360) + 360) % 360) - 180
      const off = lo - L
      const win = [Math.max(w, lo) - off, Math.max(s, la), Math.min(e, lo + 1) - off, Math.min(n, la + 1)]
      out.push({ name: glo30Name(la, L), lat: la, lon: lo, off, window: win.map((v) => round(v, 7)) })
    }
  }
  return out
}

function readTileList(ledger, dir) {
  const file = join(dir, 'glo30', 'tileList.txt')
  const r = fetchTo(ledger, GLO30_TILELIST, file)
  if (!r.ok) throw new Error(`GLO-30 tile list: HTTP ${r.status}`)
  return new Set(readFileSync(file, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean))
}

const glo30File = (dir, id, name) => join(dir, 'glo30', id, `${name}.f32`)

// ---------------------------------------------------------------------------
// --download

async function download(dir, id) {
  const ledger = new Ledger(dir)
  const grid = boxGrid(id)
  const meta = BOXES[id]
  log(`${id}: ${grid.W}×${grid.H} at ${grid.metresPerTexel[0].toFixed(2)} m, bounds ${grid.bounds.join(', ')}`)
  const have = readTileList(ledger, dir)
  let bytes = 0
  for (const c of glo30Cells(grid)) {
    if (!have.has(c.name)) {
      log(`  glo-30 ${c.name.slice(22, 36)}: no tile (ocean)`)
      continue
    }
    const r = await cachedWindow(ledger, glo30File(dir, id, c.name), glo30Url(c.name), c.window, { maxCell: grid.dLat / 2, pad: 2 })
    if (r.grid && !r.cached) bytes += r.grid.bytes
    log(`  glo-30 ${c.name.slice(22, 36)}: ${r.cached ? 'cached' : 'read'}${r.grid ? ` ${r.grid.W}×${r.grid.H} at level ${r.grid.level}` : ' (outside)'}`)
  }
  if (bytes) log(`  glo-30: ${(bytes / 1e6).toFixed(1)} MB by range`)
  const g = downloadGmrt(ledger, dir, id, grid, log)
  writeFileSync(join(dir, 'gmrt', `${id}.status.json`), JSON.stringify(g) + '\n')
  downloadEtopo15(ledger, dir, padded(grid, 4), log)
  if (meta.cudem) downloadCudem(ledger, dir, { names: meta.cudem }, log)
}

const padded = (grid, n) => [grid.bounds[0] - n * grid.dLon, grid.bounds[1] - n * grid.dLat, grid.bounds[2] + n * grid.dLon, grid.bounds[3] + n * grid.dLat]

// ---------------------------------------------------------------------------
// Binning GLO-30 windows into texels, by area

function binLand(win, off, grid, acc) {
  const { W, H } = grid
  const xw = axisWeights(W, (grid.bounds[0] - (win.west + off)) / win.dx, grid.dLon / win.dx)
  const yw = axisWeights(H, (win.north - grid.bounds[3]) / win.dy, grid.dLat / win.dy)
  const inX = (i) => xw[i].ks.some((k) => k >= 0 && k < win.W)
  const inY = (j) => yw[j].ks.some((k) => k >= 0 && k < win.H)
  let i0 = 0
  while (i0 < W && !inX(i0)) i0++
  let i1 = W - 1
  while (i1 >= i0 && !inX(i1)) i1--
  for (let j = 0; j < H; j++) {
    if (!inY(j)) continue
    const { ks: kys, ws: wys } = yw[j]
    for (let i = i0; i <= i1; i++) {
      const { ks, ws } = xw[i]
      const t = j * W + i
      for (let a = 0; a < kys.length; a++) {
        const ky = kys[a]
        if (ky < 0 || ky >= win.H) continue
        for (let b = 0; b < ks.length; b++) {
          const kx = ks[b]
          if (kx < 0 || kx >= win.W) continue
          const v = win.data[ky * win.W + kx]
          if (v !== v) continue
          const w = wys[a] * ws[b]
          acc.cover[t] += w
          if (v > 0) {
            acc.land[t] += w
            acc.sum[t] += w * v
          }
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// The 1941 shore at Pearl Harbor

/** A polygon test (even-odd over all rings) for a GeoJSON Polygon or MultiPolygon in lon/lat. */
function inside(geom) {
  const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates
  const rings = polys.flat()
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (const r of rings)
    for (const [x, y] of r) {
      x0 = Math.min(x0, x)
      y0 = Math.min(y0, y)
      x1 = Math.max(x1, x)
      y1 = Math.max(y1, y)
    }
  const f = (x, y) => {
    if (x < x0 || x > x1 || y < y0 || y > y1) return false
    let c = false
    for (const r of rings) {
      for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
        if (r[i][1] > y !== r[j][1] > y && x < ((r[j][0] - r[i][0]) * (y - r[i][1])) / (r[j][1] - r[i][1]) + r[i][0]) c = !c
      }
    }
    return c
  }
  f.box = [x0, y0, x1, y1]
  return f
}

/**
 * The share of each texel (4 × 4 samples) where test(lon, lat) holds, over
 * the texels of box [w, s, e, n] (the tiles' own longitudes, west of 0).
 * Calls fn(t, share) for every texel with a share above 0.
 */
function shareOver(grid, off, box, test, fn) {
  const S = 4
  const [w, s, e, n] = box
  const i0 = Math.max(0, Math.floor((w + off - grid.bounds[0]) / grid.dLon) - 1)
  const i1 = Math.min(grid.W - 1, Math.ceil((e + off - grid.bounds[0]) / grid.dLon) + 1)
  const j0 = Math.max(0, Math.floor((grid.bounds[3] - n) / grid.dLat) - 1)
  const j1 = Math.min(grid.H - 1, Math.ceil((grid.bounds[3] - s) / grid.dLat) + 1)
  for (let j = j0; j <= j1; j++)
    for (let i = i0; i <= i1; i++) {
      let k = 0
      for (let b = 0; b < S; b++)
        for (let a = 0; a < S; a++) {
          const lon = grid.bounds[0] + (i + (a + 0.5) / S) * grid.dLon - off
          const lat = grid.bounds[3] - (j + (b + 0.5) / S) * grid.dLat
          if (test(lon, lat)) k++
        }
      if (k) fn(j * grid.W + i, k / (S * S))
    }
}

/**
 * Undo, on the fused heights m (with the land flags), every work of
 * tools/lib/oahu-1941.mjs dated after `year`, at the texel. Lower works
 * (land made after the year): a texel at least half inside the work's shapes
 * and land now goes back to the work's level. Raise works (sea cut after the
 * year): a sea texel at least half inside a zone, deeper than the group's
 * cut, outside the 1881 passages and not natural deep water, goes back to
 * the reef that rims the cut (the median of the zone's sea texels shallower
 * than the cut), never shallower than −1 m. Returns the record of what was
 * done, for the manifest and research/bake.md.
 */
function setShoreTo(year, grid, off, m, land) {
  const done = []
  const shapes = Object.fromEntries(Object.entries(works.OLD_SHORES).map(([k, v]) => [k, inside(v.geometry)]))
  const passages = works.PASSAGES.map((p) => inside(p.geometry))
  const inPassage = (x, y) => passages.some((f) => f(x, y))
  for (const w of works.LOWER_WORKS) {
    if (w.until <= year) continue
    const region = w.region ? inside(w.region) : null
    const within = (w.within || []).map((k) => shapes[k])
    const outside = (w.outside || []).map((k) => shapes[k])
    const box = region ? region.box : within.length ? within[0].box : null
    if (!box) continue
    const test = (x, y) => (!region || region(x, y)) && within.every((f) => f(x, y)) && !outside.some((f) => f(x, y))
    let n = 0
    shareOver(grid, off, box, test, (t, share) => {
      if (share >= 0.5 && land[t]) {
        m[t] = w.level
        land[t] = w.level > 0 ? 1 : 0
        n++
      }
    })
    done.push({ kind: 'lower', id: w.id, name: w.name, until: w.until, level: w.level, texels: n, sources: w.sources, fillUnitSkipped: !!w.fill })
  }
  for (const g of works.RAISE_GROUPS) {
    for (const z of g.zones) {
      if (z.until <= year || g.packSea) continue
      const zone = inside(z.geometry)
      const texels = []
      const rim = []
      shareOver(grid, off, zone.box, (x, y) => zone(x, y) && !inPassage(x, y), (t, share) => {
        if (share < 0.5 || land[t]) return
        if (m[t] < g.cut && m[t] > -20) texels.push(t)
        else if (m[t] >= g.cut) rim.push(m[t])
      })
      rim.sort((a, b) => a - b)
      const reef = rim.length ? Math.min(SEA_MAX, rim[Math.floor(rim.length / 2)]) : SEA_MAX
      for (const t of texels) m[t] = Math.max(m[t], reef)
      done.push({ kind: 'raise', id: z.id, name: z.name, until: z.until, cut: g.cut, reef: round(reef, 2), texels: texels.length, sources: z.sources })
    }
  }
  for (const w of PEARL_1941) {
    if (w.until <= year) continue
    const f = inside(w.geometry)
    let n = 0
    // a dock dug into the yard after the year: its water back to the yard's ground round it
    const ground = []
    shareOver(grid, off, f.box, (x, y) => !f(x, y), (t) => {
      if (land[t]) ground.push(m[t])
    })
    ground.sort((a, b) => a - b)
    const level = ground.length ? ground[Math.floor(ground.length / 2)] : 2
    shareOver(grid, off, f.box, f, (t, share) => {
      if (share >= 0.5 && !land[t]) {
        m[t] = Math.max(LAND_MIN, level)
        land[t] = 1
        n++
      }
    })
    done.push({ kind: 'fill', id: w.id, name: w.name, until: w.until, level: round(level, 2), texels: n, sources: w.sources })
  }
  return done
}

/**
 * Works at Pearl Harbor the Hawaiian patches do not carry (R10 §11.4, §7.2):
 * the graving docks the Navy Yard built after 7 December 1941, identified at
 * R10's points (OpenStreetMap, with their start dates) and traced on the
 * CUDEM itself at its 3.4 m cells: each is a strip along the dock's axis
 * from its head to the waterfront, a little wider than the dock, ending at
 * the waterfront so the channel is not touched. Drydock No. 1 (1919), the
 * third slip east, stays.
 */
const PEARL_1941 = [
  {
    id: 'pearl-drydock-2',
    name: 'Drydock No. 2 at the Navy Yard',
    until: 1942,
    // R10 §7.2: 21.3512, −157.9600 (OSM, built 1942): the middle slip, about 290 m by 45 m on the CUDEM
    geometry: works.corridor([[-157.960741, 21.349912], [-157.959452, 21.352343]], 35, false),
    sources: ['r10-pearl-harbor', 'osm'],
    note: 'R10 §7.2 and §11.4: OpenStreetMap dates the dock 1942, and R10 reads it as under construction on the day (“the new drydock”, Train); its basin is filled back to the yard’s ground',
  },
  {
    id: 'pearl-drydock-3',
    name: 'Drydock No. 3 at the Navy Yard',
    until: 1942,
    // R10 §7.2: 21.3515, −157.9608 (OSM, built 1942): the short western slip, about 140 m by 30 m
    geometry: works.corridor([[-157.961127, 21.350784], [-157.960571, 21.352034]], 30, false),
    sources: ['r10-pearl-harbor', 'osm'],
    note: 'R10 §7.2 and §11.4: OpenStreetMap dates the dock 1942; its basin is filled back to the yard’s ground',
  },
  {
    id: 'pearl-drydock-4',
    name: 'Drydock No. 4 at the Navy Yard',
    until: 1943,
    // R10 §7.2: 21.3468, −157.9652 (OSM, built 1943): the diagonal basin opening on the channel north of Hospital Point, about 330 m by 47 m
    geometry: works.corridor([[-157.963935, 21.347821], [-157.966188, 21.345606]], 35, false),
    sources: ['r10-pearl-harbor', 'osm'],
    note: 'R10 §7.2 and §11.4: OpenStreetMap dates the dock 1943; its basin is filled back to the yard’s ground',
  },
]

/**
 * GMRT's grids carry lone spikes and pits a node wide in deep water: a
 * texel deeper than 50 m that stands more than max(10 m, 5 %) off the median
 * of its 3 × 3 neighbourhood takes that median. On a slope the median is the
 * texel itself, so only lone spikes and pits move; the shallows, where a
 * coral head is real, are left alone. (The straight steps where GMRT's
 * sources meet, such as the one near 159.996° E in Ironbottom Sound, are
 * steps, not spikes, and stay: research/bake.md.) In place; returns the
 * texels changed.
 */
function despike(a, W, H) {
  const out = Float32Array.from(a)
  const win = new Float32Array(9)
  let n = 0
  for (let j = 1; j < H - 1; j++)
    for (let i = 1; i < W - 1; i++) {
      const t = j * W + i
      const v = a[t]
      if (v !== v) continue
      let k = 0
      for (let b = -1; b <= 1; b++)
        for (let c = -1; c <= 1; c++) {
          const u = a[t + b * W + c]
          if (u === u) win[k++] = u
        }
      if (k < 9) continue
      const med = win.slice(0, k).sort()[4]
      if (med < -50 && Math.abs(v - med) > Math.max(10, 0.05 * Math.abs(med))) {
        out[t] = med
        n++
      }
    }
  a.set(out)
  return n
}

const SHORE_NOTE =
  'every dated work of Oʻahu’s harbours later than the year undone at the texel (4 × 4 samples, the half rule): lower works (land made later) back to their level, ' +
  'raise works (sea cut later) back to the reef that rims them, the drydocks of 1942–43 filled to the yard’s ground; the works, dates and shapes are Holo i ke Au’s ' +
  '(tools/lib/oahu-1941.mjs) and R10’s; the geologic map’s fill unit, which the Hawaiian patches also asked for, is not read here (research/bake.md)'

/** The sources a shore record cites, by id, so each resolves inside the manifest. */
function shoreReferences(done) {
  const ids = new Set(done.flatMap((d) => d.sources || []))
  const out = {}
  for (const id of [...ids].sort()) {
    if (works.HISTORIES[id]) out[id] = works.HISTORIES[id]
    else if (works.MAPS[id]) out[id] = works.MAPS[id]
    else if (id === 'osm') out[id] = { title: OSM.title, url: OSM.url, licence: OSM.licence, credit: OSM.credit }
    else if (id === 'r10-pearl-harbor')
      out[id] = { title: 'Pacific Theatre research report R10, Pearl Harbor (research/R10-pearl-harbor.md), §7.2 and §11.4', url: 'research/R10-pearl-harbor.md', licence: 'this repository' }
  }
  return out
}

// ---------------------------------------------------------------------------
// --bake

async function bake(dir, id) {
  const t0 = Date.now()
  const lap = (s) => log(`[${((Date.now() - t0) / 1000).toFixed(1)} s] ${s}`)
  const ledger = new Ledger(dir)
  const grid = boxGrid(id)
  const meta = BOXES[id]
  const f = grid.frozen
  const { W, H } = grid
  const N = W * H
  lap(`${id}: ${W}×${H} at ${grid.metresPerTexel.map((v) => v.toFixed(2)).join(' × ')} m; bounds ${grid.bounds.join(', ')} (widened from the frozen ones by ${grid.moved.map((v) => v.toFixed(3)).join(', ')} texel w, s, e, n)`)

  // land: GLO-30
  const acc = { cover: new Float64Array(N), land: new Float64Array(N), sum: new Float64Array(N) }
  const used = []
  const absent = []
  const have = readTileList(ledger, dir)
  let level = null
  for (const c of glo30Cells(grid)) {
    if (!have.has(c.name)) {
      absent.push(c.name)
      continue
    }
    const win = loadGrid(ledger, glo30File(dir, id, c.name))
    if (!win) throw new Error(`${id}: the GLO-30 window ${c.name} is not in the downloads (run --download)`)
    binLand(win, c.off, grid, acc)
    used.push({ name: c.name, level: win.level, size: [win.W, win.H], fetched: ledger.get(glo30File(dir, id, c.name))?.fetched, bytes: win.rangeBytes })
    level = win.level
  }
  lap(`glo-30: ${used.length} tiles (level ${[...new Set(used.map((u) => u.level))].join(', ')}), ${absent.length} cells without a tile (ocean)`)

  // sea: GMRT, ETOPO 15″ behind it
  const gm = readGmrt(dir, id, grid)
  let gmrt = null
  let despiked = 0
  if (gm) {
    gmrt = new Float32Array(N).fill(NaN)
    const cnt = new Uint8Array(N)
    const acc2 = new Float32Array(N)
    for (const g of gm.grids) {
      const r = resampleGrid(g, grid)
      for (let t = 0; t < N; t++)
        if (r[t] === r[t]) {
          acc2[t] += r[t]
          cnt[t]++
        }
    }
    for (let t = 0; t < N; t++) if (cnt[t]) gmrt[t] = acc2[t] / cnt[t]
    despiked = despike(gmrt, W, H)
  }
  const et = resampleGrid(readEtopo15(dir, padded(grid, 4)), grid)
  lap(`sea: ${gm ? `GMRT ${gm.version ? `version ${gm.version}, ` : ''}${gm.grids.map((g) => `${g.W}×${g.H}`).join(' + ')} at ${(gm.grids[0].dy * 110574).toFixed(0)} m, ${despiked} lone spikes taken out of the deep floor` : 'GMRT missing: ETOPO 15″ throughout'}`)

  // pearl harbor: CUDEM over the harbour and south shore
  let cud = null
  let cudInfo = []
  if (meta.cudem) {
    cud = { expect: new Float64Array(N), n: new Float64Array(N), nLand: new Float64Array(N), sumLand: new Float64Array(N), nSea: new Float64Array(N), sumSea: new Float64Array(N) }
    for (const name of meta.cudem) {
      const file = join(dir, 'cudem', `${name}.tif`)
      const r = await binCudemTile(file, grid, cud, { off: 360 })
      cudInfo.push({ name, ...r, fetched: ledger.get(file)?.fetched, bytes: ledger.get(file)?.bytes })
    }
    lap(`cudem: ${cudInfo.map((c) => `${c.name} ${c.cells} cells`).join(', ')}`)
  }
  const perTexel = cudInfo.length ? cudInfo[0].cellsPerTexel : 0

  // fuse
  const m = new Float32Array(N)
  const land = new Uint8Array(N)
  const from = new Uint8Array(N) // 0 GLO-30 and GMRT, 1 GLO-30 and ETOPO, 2 CUDEM
  let clamped = 0
  let etopoSea = 0
  let nCudem = 0
  for (let t = 0; t < N; t++) {
    if (cud && cud.expect[t] > 0 && cud.n[t] >= CUDEM_FULL * cud.expect[t]) {
      from[t] = 2
      nCudem++
      if (cud.nLand[t] * 2 >= cud.n[t]) {
        land[t] = 1
        m[t] = Math.max(LAND_MIN, cud.sumLand[t] / cud.nLand[t])
      } else {
        const v = cud.sumSea[t] / cud.nSea[t]
        if (v > SEA_MAX) clamped++
        m[t] = Math.min(SEA_MAX, v)
      }
      continue
    }
    if (acc.land[t] >= 0.5) {
      land[t] = 1
      m[t] = Math.max(LAND_MIN, acc.sum[t] / acc.land[t])
    } else {
      let v = gmrt && gmrt[t] === gmrt[t] ? gmrt[t] : NaN
      if (v !== v) {
        v = et[t]
        from[t] = 1
        etopoSea++
      }
      if (v !== v) v = SEA_MAX
      if (v > SEA_MAX) clamped++
      m[t] = Math.min(SEA_MAX, v)
    }
  }
  lap(`fused: ${nCudem ? `${nCudem} texels from CUDEM, ` : ''}${etopoSea} sea texels from ETOPO 15″, ${clamped} sea texels clamped to −1 m`)

  // the shore of the battle's year
  let shore = null
  if (meta.shoreYear) {
    shore = setShoreTo(meta.shoreYear, grid, 360, m, land)
    for (const d of shore) lap(`  ${meta.shoreYear}: ${d.kind} ${d.id} (until ${d.until}): ${d.texels} texels`)
  }

  // encode
  const rgb = new Uint8Array(N * 3)
  let nLand = 0
  let min = Infinity
  let max = -Infinity
  let maxAt = 0
  const landV = Math.round((LAND_MIN - ENC.offset) / ENC.scale)
  const seaV = Math.round((SEA_MAX - ENC.offset) / ENC.scale)
  for (let t = 0; t < N; t++) {
    // the deep sea floor, which no one sees through the water, in coarser steps: a third of the file
    if (!land[t]) for (const [below, step] of SEA_STEPS) if (m[t] < below) {
      m[t] = Math.round(m[t] / step) * step
      break
    }
    let v = Math.max(0, Math.min(65535, Math.round((m[t] - ENC.offset) / ENC.scale)))
    v = land[t] ? Math.max(v, landV) : Math.min(v, seaV)
    if (land[t]) nLand++
    rgb[t * 3] = v >> 8
    rgb[t * 3 + 1] = v & 255
    const back = v * ENC.scale + ENC.offset
    if (back < min) min = back
    if (back > max) {
      max = back
      maxAt = t
    }
  }
  const png = encodePNG(W, H, rgb, 3)
  mkdirSync(join(OUT, 'boxes', id), { recursive: true })
  writeFileSync(join(OUT, 'boxes', id, 'height.png'), png)
  const maxLonLat = [round(grid.lonAt(maxAt % W), 4), round(grid.latAt(Math.floor(maxAt / W)), 4)]
  lap(`boxes/${id}/height.png: ${(png.length / 1e6).toFixed(2)} MB, land ${((nLand / N) * 100).toFixed(2)} %, ${min} .. ${max} m (highest at ${maxLonLat.join(', ')})`)

  // the manifest entry
  const table = new TableProjection(TABLE_PROJECTION)
  const projection = { kind: 'tangent', lon0: f.lon0, lat0: f.lat0, unit: 1 }
  const pl = placement({ projection }, table)
  const sources = []
  const gloFetched = used.map((u) => u.fetched).filter(Boolean).sort().pop()
  sources.push({
    ...GLO30,
    fetched: gloFetched,
    note:
      `${used.length} tiles (${used.map((u) => u.name.slice(22, 36)).join(', ')}) read as windows by HTTP range, ` +
      `at overview level ${level} (cells of ${level ? `${30 * 2 ** level} m` : '30 m, the full resolution'}; the coarsest at most half a texel), shifted half a cell for PixelIsPoint; ` +
      `${absent.length} one-degree cells have no tile (ocean). A texel is land where at least half its area is GLO-30 land (a cell above 0 m), and holds the land cells’ mean, at least ${LAND_MIN} m. GLO-30 is a surface model: canopy and buildings read as terrain` +
      (cud ? '. At Pearl Harbor GLO-30 is used outside the CUDEM tiles only' : ''),
  })
  if (cud) {
    sources.push({
      id: CUDEM.id,
      title: CUDEM.title,
      url: CUDEM.url,
      files: cudInfo.map((c) => `${CUDEM.base}/tiles/${c.name}.tif`),
      fetched: cudInfo.map((c) => c.fetched).filter(Boolean).sort().pop(),
      licence: CUDEM.licence,
      citation: CUDEM.citation,
      note:
        `the harbour and the south shore: the two tiles ${cudInfo.map((c) => c.name).join(' and ')} (1/9″, about 3.4 m), every cell binned into the texel its centre falls in (about ${Math.round(perTexel)} a texel), land and harbour floor alike by the half-land rule, sea never shallower than ${SEA_MAX} m; ` +
        `${nCudem} texels (${((nCudem / N) * 100).toFixed(1)} %) take CUDEM; then set back to the shore of 7 December 1941 from the dated works of Oʻahu (Holo i ke Au's patch works; research/bake.md)`,
    })
  }
  if (gm) {
    const gFetched = gm.files.map((x) => ledger.get(join(dir, x))?.fetched).filter(Boolean).sort().pop()
    sources.push({
      id: GMRT.id,
      title: GMRT.title,
      url: GMRT.url,
      requests: gm.urls,
      fetched: gFetched,
      licence: GMRT.licence,
      credit: GMRT.credit,
      citation: GMRT.citation,
      note:
        `the sea floor: the GridServer’s topo layer as ESRI ASCII${gm.version ? `, GMRT ${gm.version}` : ''}, about ${gm.metres ? Math.round(gm.metres) : Math.round(gm.grids[0].dy * 110574)} m a node${gm.grids.length > 1 ? `, in ${gm.grids.length} requests either side of 180°` : ''}; ` +
        `area-weighted into the sea texels only, never shallower than ${SEA_MAX} m (resampled and clamped); land is never taken from it`,
    })
  }
  if (!gm || etopoSea) {
    sources.push({
      id: 'etopo-2022-15s',
      title: 'ETOPO 2022 15 arc-second surface elevation (Global Relief Model)',
      doi: ETOPO.doi,
      url: ETOPO.page,
      files: etopo15Requests(padded(grid, 4)).map((r) => r.url),
      fetched: etopo15Requests(padded(grid, 4)).map((r) => ledger.get(join(dir, r.file))?.fetched).filter(Boolean).sort().pop(),
      licence: ETOPO.licence,
      citation: ETOPO.citation,
      note: `the sea floor where GMRT has no value (${etopoSea} texels), area-weighted, never shallower than ${SEA_MAX} m`,
    })
  }
  if (cud) {
    sources.push({
      ...OSM,
      note: 'positions of the Navy Yard’s drydocks No. 2 to 4 and their start dates (R10 §7.2), used to take them out of the 1941 shore; the battle’s berths F-6 to F-8 and the wrecks are placed from the same data',
    })
  }
  const seaName = gm ? 'gmrt' : 'etopo15'
  const seaCredit = gm ? 'Sea floor: GMRT (Ryan et al. 2009), CC BY 4.0, resampled.' : 'Sea floor: ETOPO 2022 15″ (NOAA NCEI), public domain, resampled.'
  const credit = cud
    ? `Harbour and south shore: NOAA NCEI CUDEM, public domain, set back to the shore of 1941. Terrain elsewhere produced using Copernicus WorldDEM-30 © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved. ${seaCredit} Positions © OpenStreetMap contributors (ODbL).`
    : `Terrain produced using Copernicus WorldDEM-30 © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved. ${seaCredit}`
  const entry = {
    id,
    name: meta.name,
    event: f.event,
    bounds: grid.bounds,
    size: [W, H],
    metresPerTexel: grid.metresPerTexel.map((v) => round(v, 2)),
    projection,
    placement: { centre: pl.centre.map((v) => round(v, 6)), jacobian: pl.J.map((r) => r.map((v) => +v.toPrecision(12))), convergenceDeg: round(pl.convergenceDeg, 4) },
    height: { file: `boxes/${id}/height.png`, scale: ENC.scale, offset: ENC.offset },
    exaggeration: f.exaggeration,
    sea: seaName,
    battle: `boxes/${id}/battle.json`,
    clock: f.clock.id,
    stats: {
      landFraction: round(nLand / N, 4),
      minMetres: min,
      maxMetres: max,
      maxAt: maxLonLat,
      seaClamped: clamped,
      ...(nCudem ? { cudemTexels: nCudem } : {}),
      boundsWidenedTexels: grid.moved.map((v) => round(v, 3)),
    },
    ...(shore ? { shore: { year: meta.shoreYear, note: SHORE_NOTE, works: shore, references: shoreReferences(shore) } } : {}),
    sources,
    credit,
  }
  const mPath = join(OUT, 'boxes', 'manifest.json')
  const man = existsSync(mPath) ? JSON.parse(readFileSync(mPath, 'utf8')) : { boxes: [] }
  const order = Object.keys(IDS.boxes)
  man.boxes = [...man.boxes.filter((b) => b.id !== id), entry].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
  writeFileSync(mPath, JSON.stringify(man, null, 2) + '\n')
  lap(`boxes/manifest.json: ${id} written (placement ${entry.placement.centre.map((v) => v.toFixed(1)).join(', ')} km, convergence ${entry.placement.convergenceDeg}°)`)
}

// ---------------------------------------------------------------------------
// --preview DIR

/** Places a person checks by eye in each box (red crosses): the summits R1 measured, the islets, the harbour. */
const MARKS = {
  midway: { 'Sand Island': [-177.38, 28.21], 'Eastern Island': [-177.33, 28.215], Kure: [-178.32, 28.42] },
  'pearl-harbor': { 'Ford Island': [-157.9603, 21.3639], 'Kōnāhuanui': [-157.7887, 21.3576], 'Drydock No. 1': [-157.9587, 21.3512], 'Hospital Point': [-157.9682, 21.3487] },
  'ironbottom-sound': { 'Savo (R1’s summit)': [159.8162, -9.1307], Tulagi: [160.15, -9.1] },
  samar: {},
}

function preview(outDir, id) {
  const man = JSON.parse(readFileSync(join(OUT, 'boxes', 'manifest.json'), 'utf8'))
  const b = man.boxes.find((x) => x.id === id)
  if (!b) throw new Error(`${id} is not in boxes/manifest.json (bake it first)`)
  const [W, H] = b.size
  const m = decodeHeights(readPNG(join(OUT, b.height.file)), b.height.scale, b.height.offset)
  const rgb = hillshadeRGB(m, W, H, { cell: b.metresPerTexel, exag: 2 })
  const [w, s, e, n] = b.bounds
  const px = ([lon, lat]) => {
    const L = lon < w - 180 ? lon + 360 : lon
    return [((L - w) / (e - w)) * W - 0.5, ((n - lat) / (n - s)) * H - 0.5]
  }
  const coastPath = join(OUT, 'table', 'coast.json')
  if (existsSync(coastPath)) {
    const coast = JSON.parse(readFileSync(coastPath, 'utf8'))
    for (const fe of coast.strokes.features) {
      const c = fe.geometry.coordinates
      for (let i = 0; i + 1 < c.length; i++) {
        const a = px(c[i])
        const q = px(c[i + 1])
        if ((a[0] < -50 && q[0] < -50) || (a[1] < -50 && q[1] < -50) || (a[0] > W + 50 && q[0] > W + 50) || (a[1] > H + 50 && q[1] > H + 50)) continue
        drawLine(rgb, W, H, a[0], a[1], q[0], q[1], [250, 220, 40])
      }
    }
  }
  // the 1941 works' shapes at Pearl Harbor, so a person can see what was taken out
  if (b.shore) {
    const draw = (geom, c) => {
      for (const ring of geom.type === 'Polygon' ? geom.coordinates : geom.coordinates.flat())
        for (let i = 0; i + 1 < ring.length; i++) {
          const a = px(ring[i])
          const q = px(ring[i + 1])
          drawLine(rgb, W, H, a[0], a[1], q[0], q[1], c)
        }
    }
    for (const wk of works.LOWER_WORKS) if (wk.until > b.shore.year && wk.region) draw(wk.region, [255, 60, 200])
    for (const g of works.RAISE_GROUPS) for (const z of g.zones) if (z.until > b.shore.year && !g.packSea) draw(z.geometry, [60, 255, 200])
    for (const wk of PEARL_1941) if (wk.until > b.shore.year) draw(wk.geometry, [255, 140, 0])
  }
  for (const [name, ll] of Object.entries(MARKS[id] || {})) {
    const [x, y] = px(ll)
    drawMark(rgb, W, H, x, y, [230, 30, 30], 6)
    const k = Math.round(y) * W + Math.round(x)
    log(`  ${id} ${name.padEnd(18)} texel (${Math.round(x)}, ${Math.round(y)}): ${m[k] !== undefined ? m[k].toFixed(2) : 'outside'} m`)
  }
  mkdirSync(outDir, { recursive: true })
  const write = (name, img) => {
    writeFileSync(join(outDir, name), encodePNG(img.W, img.H, img.rgb, 3))
    log(`  wrote ${join(outDir, name)} (${img.W}×${img.H})`)
  }
  write(`box-${id}.png`, { rgb, W, H })
  if (id === 'pearl-harbor') {
    const [x, y] = px([-157.958, 21.36])
    write('box-pearl-harbor-lochs.png', cropRGB(rgb, W, H, x - 160, y - 110, 320, 220, 3))
    const [x2, y2] = px([-157.9, 21.31])
    write('box-pearl-harbor-honolulu.png', cropRGB(rgb, W, H, x2 - 200, y2 - 100, 400, 200, 2))
  }
  if (id === 'midway') {
    const [x, y] = px([-177.36, 28.22])
    write('box-midway-atoll.png', cropRGB(rgb, W, H, x - 60, y - 50, 120, 100, 6))
  }
  if (id === 'ironbottom-sound') {
    const [x, y] = px([159.82, -9.13])
    write('box-ironbottom-savo.png', cropRGB(rgb, W, H, x - 150, y - 120, 300, 240, 3))
  }
}

// ---------------------------------------------------------------------------
// --check, --clean

function check() {
  const r = spawnSync(process.execPath, [join(PKG, 'tools/check-data.mjs'), '--only', 'packs'], { stdio: 'inherit' })
  return r.status ?? 1
}

function clean(dir, ids) {
  const ledger = new Ledger(dir)
  const gone = []
  for (const id of ids) {
    const grid = boxGrid(id)
    const files = [
      ...glo30Cells(grid).map((c) => glo30File(dir, id, c.name)),
      ...gmrtRequests(id, grid).flatMap((r) => [join(dir, r.file), join(dir, r.metaFile)]),
      join(dir, 'gmrt', `${id}.status.json`),
      ...etopo15Requests(padded(grid, 4)).map((r) => join(dir, r.file)),
      ...(BOXES[id].cudem || []).map((n) => join(dir, 'cudem', `${n}.tif`)),
    ]
    for (const p of files) {
      for (const q of [p, p + '.json']) {
        if (existsSync(q)) {
          rmSync(q, { force: true })
          gone.push(q)
        }
        delete ledger.entries[relative(dir, q)]
      }
    }
    rmSync(join(dir, 'glo30', id), { recursive: true, force: true })
  }
  // the shared lists go when every box's downloads are gone
  if (ids.length === Object.keys(BOXES).length) {
    for (const rel of ['glo30/tileList.txt', 'cudem/urllist9428.txt']) {
      rmSync(join(dir, rel), { force: true })
      delete ledger.entries[rel]
    }
  }
  writeFileSync(ledger.path, JSON.stringify(ledger.entries, null, 2) + '\n')
  log(`clean: removed ${gone.length} downloads of ${ids.join(', ')} from ${dir}`)
}

// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2)
  const has = (f) => args.includes(f)
  const all = has('--all')
  const named = args.filter((a, i) => !a.startsWith('--') && !['--preview', '--downloads'].includes(args[i - 1]))
  for (const id of named) if (!BOXES[id]) throw new Error(`no box “${id}” (${Object.keys(BOXES).join(', ')})`)
  const ids = named.length ? named : Object.keys(BOXES)
  if (!args.some((a) => a.startsWith('--')) || has('--help')) {
    log('usage: node tools/bake-box.mjs [<id>...] --all | --download | --bake | --check | --preview DIR | --clean  [--downloads DIR]')
    return
  }
  const dir = downloadsDir(args, PKG)
  log(`downloads: ${dir}`)
  let code = 0
  for (const id of ids) {
    if (all || has('--download')) await download(dir, id)
    if (all || has('--bake')) await bake(dir, id)
  }
  if (all || has('--check')) code = check()
  const pv = args.indexOf('--preview')
  if (pv >= 0) for (const id of ids) preview(resolve(args[pv + 1] || join(dir, 'previews')), id)
  if (all || has('--clean')) clean(dir, ids)
  let total = 0
  for (const id of ids) {
    const p = join(OUT, 'boxes', id, 'height.png')
    if (existsSync(p)) {
      total += statSync(p).size
      log(`  ${relative(PKG, p)}: ${(statSync(p).size / 1e6).toFixed(2)} MB`)
    }
  }
  if (total) log(`  boxes: ${(total / 1e6).toFixed(2)} MB`)
  process.exitCode = code
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e.stack || e.message)
    process.exitCode = 1
  })
}

export { tangentK }
