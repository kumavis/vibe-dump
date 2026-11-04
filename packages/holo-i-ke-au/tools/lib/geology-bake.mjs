// The --bake and --stages steps of the geology bake: the seafloor pack from
// the downloads, then the stages, modelled from the seafloor pack alone, then
// geology/manifest.json. Writes only the manifest's own keys (seafloor,
// stages, subsidence, profile, hotspot) and the images under
// geology/seafloor/ and geology/stages/.
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { Ledger } from './fetch.mjs'
import { writePNG, readPNG } from './png.mjs'
import { DemMosaic, readAsciiGrid, resampleGrid } from './raster.mjs'
import { BATHY, DEM } from './sources.mjs'
import { geologyPaths, readGeologyNotes, seafloorGrid, gmrtRequest } from './geology-sources.mjs'
import { PROFILE_NOTE, buildStage, hotspotEntry, stageList, fitProfile, fitSubsidence, landStats, readResearch } from './geology-model.mjs'

// Height encoding (DATA.md §2), the same as every pack.
export const SCALE = 0.25
export const OFFSET = -6000
// The contract's floor for land: at least 0.2 m, so a land texel decodes > 0
// at any encoding; with 0.25 m steps the smallest land value is 0.25 m.
const LAND_MIN = Math.floor(-OFFSET / SCALE) + 1
const SEA_MAX = Math.round((-1 - OFFSET) / SCALE)
// GMRT cells deeper than this are spikes (nothing in the box is deeper than
// about 5,900 m, the Hawaiian Deep); they are treated as gaps.
const BATHY_MIN = OFFSET
// The stages are smooth models: written in the pack encoding (0.25 m, −6000 m)
// but rounded to 4 m, which is finer than anything the model knows and keeps
// them small (the low byte then moves in steps of 16).
export const STAGE_SCALE = 0.25
export const STAGE_STEP = 4
// and to 8 m on the deep floor, below this, where a stage is today's floor smoothed
export const STAGE_DEEP = -2500

const round = (v, d) => Math.round(v * 10 ** d) / 10 ** d

export const geologyDir = (data) => join(data, 'geology')

function readManifest(data) {
  const f = join(geologyDir(data), 'manifest.json')
  return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : {}
}

function writeManifest(data, m) {
  // keep the research's keys and their order; ours after them, in a fixed order
  const ours = ['seafloor', 'subsidence', 'profile', 'hotspot', 'stages']
  const out = {}
  for (const [k, v] of Object.entries(m)) if (!ours.includes(k)) out[k] = v
  for (const k of ours) if (m[k] !== undefined) out[k] = m[k]
  writeFileSync(join(geologyDir(data), 'manifest.json'), JSON.stringify(out, null, 2) + '\n')
}

/** Encode metres into split-byte RGB, land ≥ LAND_MIN, sea ≤ −1 m. */
export function encodeHeights(metres, land, scale, offset) {
  const N = metres.length
  const rgb = new Uint8Array(N * 3)
  const landMin = Math.floor(-offset / scale) + 1
  const seaMax = Math.floor((-1 - offset) / scale)
  for (let o = 0; o < N; o++) {
    let v = Math.round((metres[o] - offset) / scale)
    v = land[o] ? Math.max(landMin, v) : Math.min(seaMax, v)
    v = Math.max(0, Math.min(65535, v))
    rgb[o * 3] = v >> 8
    rgb[o * 3 + 1] = v & 255
  }
  return rgb
}

/** Decode a split-byte height PNG into metres. */
export function decodeHeights(file, scale, offset) {
  const png = readPNG(file)
  if (png.channels !== 3) throw new Error(`${file}: not RGB`)
  const N = png.width * png.height
  const m = new Float32Array(N)
  for (let o = 0; o < N; o++) m[o] = (png.data[o * 3] * 256 + png.data[o * 3 + 1]) * scale + offset
  return { width: png.width, height: png.height, metres: m, png }
}

export async function bakeSeafloor({ dir, data, log }) {
  const ledger = new Ledger(dir)
  const p = geologyPaths(dir)
  const grid = seafloorGrid()
  const { W, H } = grid
  const N = W * H
  log(`seafloor: ${W}x${H} at ${grid.metresPerTexel[0].toFixed(1)} m over ${grid.bounds.join(', ')}`)
  const dem = await DemMosaic.load(p.dem, () => {})
  log(`  DEM: ${dem.info.length} tiles`)
  const { landFrac, landMean } = dem.resample(grid)
  const bathy = resampleGrid(readAsciiGrid(p.gmrt, { min: BATHY_MIN, max: 9000 }), grid)
  const metres = new Float32Array(N)
  const land = new Uint8Array(N)
  let gaps = 0
  let gmrtLand = 0
  for (let o = 0; o < N; o++) {
    if (landFrac[o] >= 0.5) {
      land[o] = 1
      metres[o] = landMean[o]
    } else {
      let b = bathy[o]
      if (b !== b) {
        gaps++
        b = -1
      } else if (b > -1) gmrtLand++
      metres[o] = Math.min(-1, b)
    }
  }
  const rgb = encodeHeights(metres, land, SCALE, OFFSET)
  const out = join(geologyDir(data), 'seafloor')
  mkdirSync(out, { recursive: true })
  writePNG(join(out, 'height.png'), W, H, rgb)
  // stats from the encoded values, as the check reads them
  let min = Infinity
  let max = -Infinity
  let nLand = 0
  for (let o = 0; o < N; o++) {
    const m = (rgb[o * 3] * 256 + rgb[o * 3 + 1]) * SCALE + OFFSET
    if (m < min) min = m
    if (m > max) max = m
    if (m > 0) nLand++
  }
  const notes = readGeologyNotes(dir)
  const meta = existsSync(p.gmrtMeta) ? JSON.parse(readFileSync(p.gmrtMeta, 'utf8')) : {}
  const req = gmrtRequest(grid)
  const gLe = ledger.get(p.gmrt)
  const dFetched = (notes.tiles || []).map((t) => ledger.get(join(p.dem, `USGS_1_${t}.tif`))?.fetched).filter(Boolean).sort()
  const texelKm2 = (grid.metresPerTexel[0] * grid.metresPerTexel[1]) / 1e6
  const entry = {
    bounds: grid.bounds,
    size: [W, H],
    metresPerTexel: grid.metresPerTexel.map((v) => round(v, 4)),
    height: { file: 'seafloor/height.png', scale: SCALE, offset: OFFSET },
    stats: { landFraction: round(nLand / N, 5), landKm2: Math.round(nLand * texelKm2), minMetres: min, maxMetres: max },
    sources: [
      {
        id: BATHY.id,
        title: `${BATHY.title}${meta.gmrt_version ? `, version ${meta.gmrt_version}` : ''}${meta.gmrt_release_date ? ` (${meta.gmrt_release_date})` : ''}`,
        url: gLe?.url ?? req.url,
        fetched: gLe?.fetched,
        licence: BATHY.licence,
        attribution:
          'Ryan, W.B.F., S.M. Carbotte, J.O. Coplan, S. O\'Hara, A. Melkonian, R. Arko, R.A. Weissel, V. Ferrini, A. Goodwillie, ' +
          'F. Nitsche, J. Bonczkowski and R. Zemsky (2009), Global Multi-Resolution Topography synthesis, Geochem. Geophys. Geosyst. 10, ' +
          `Q03014, doi:10.1029/2008GC002332; data from the GMRT synthesis${meta.gmrt_version ? ` ${meta.gmrt_version}` : ''}, ` +
          'gmrt.org, CC BY 4.0. GMRT merges ship multibeam swaths (the Hawaiian surveys among them) gridded at up to 100 m, ' +
          'over GEBCO where no multibeam exists.',
        note:
          `sea texels only, area-weighted from GMRT's ${meta.meters_per_node ?? '?'} m grid (ESRI ASCII) onto ${grid.metresPerTexel[0].toFixed(0)} m texels, ` +
          `never shallower than −1 m (${gmrtLand} sea texels where GMRT itself stands above −1 m, at the coasts and on Nihoa, are −1 m); ` +
          `cells deeper than ${-BATHY_MIN} m are spikes and treated as gaps${gaps ? ` (${gaps} texels with no value are −1 m)` : ''}; land comes from the DEM`,
      },
      {
        id: DEM.id,
        title: DEM.title,
        url: DEM.url,
        fetched: dFetched[dFetched.length - 1],
        licence: DEM.licence,
        note:
          `tiles ${(notes.tiles || []).join(', ')}; the other ${(notes.unpublished || []).length} one-degree cells in the box have no tile ` +
          '(no land; Nihoa, at 23.06° N 161.92° W, lies in n24w162, which the USGS does not publish, so it is sea here); ' +
          'a texel is land where at least half its area is land in the DEM, and then takes the area-weighted mean of the land cells (never below 0.25 m)',
      },
    ],
  }
  const m = readManifest(data)
  m.seafloor = entry
  writeManifest(data, m)
  log(`  land ${nLand} texels (${entry.stats.landKm2} km²), ${min} .. ${max} m; wrote seafloor/height.png`)
}

export function bakeStages({ data, log, subsidenceMode = 'fit' }) {
  const gdir = geologyDir(data)
  const m = readManifest(data)
  if (!m.seafloor) throw new Error('no seafloor in geology/manifest.json; run --bake first')
  const sf = m.seafloor
  const { width: W, height: H, metres: present } = decodeHeights(join(gdir, sf.height.file), sf.height.scale, sf.height.offset)
  const grid = { bounds: sf.bounds, W, H, mpt: sf.metresPerTexel }
  const research = readResearch(gdir, log)
  const profile = fitProfile(present, grid, research.volcanoes, log)
  const subsidence = fitSubsidence(research.volcanoes, log, research.subsidenceRule, subsidenceMode)
  m.profile = profile.entry
  m.subsidence = subsidence.entry
  m.hotspot = hotspotEntry(research).h
  const stages = []
  const keep = new Set()
  const seafloorSources = sf.sources.map(({ id, title, url, licence }) => ({ id, title, url, licence }))
  const ctx = { present, grid, research, profile, subsidence, log, seafloorSources }
  for (const st of stageList(research)) {
    const t0 = Date.now()
    const s = buildStage(st, ctx)
    if (s.reuse) {
      // today's islands are the seafloor pack itself
      stages.push({ ...s.entry, height: { ...sf.height }, stats: landStats(present, null, grid, research.volcanoes, 0) })
      log(`  ${st.id.padEnd(20)} the seafloor pack`)
      continue
    }
    const q = Float32Array.from(s.metres, (z) => {
      const step = z < STAGE_DEEP ? 2 * STAGE_STEP : STAGE_STEP
      return z > 0 ? Math.max(step, Math.round(z / step) * step) : Math.min(-step, Math.round(z / step) * step)
    })
    const rgb = encodeHeights(q, s.land, STAGE_SCALE, OFFSET)
    // stats from the encoded image, as the check reads it
    const dec = new Float32Array(W * H)
    for (let o = 0; o < W * H; o++) dec[o] = (rgb[o * 3] * 256 + rgb[o * 3 + 1]) * STAGE_SCALE + OFFSET
    const file = `stages/${st.id}/height.png`
    mkdirSync(join(gdir, 'stages', st.id), { recursive: true })
    writePNG(join(gdir, file), W, H, rgb)
    keep.add(st.id)
    const stats = landStats(dec, null, grid, research.volcanoes, s.age)
    stages.push({ ...s.entry, height: { file, scale: STAGE_SCALE, offset: OFFSET }, stats })
    const isl = stats.islands.map((i) => `${i.name} ${i.landKm2} km² ${i.highest.metres} m`).join('; ')
    log(`  ${st.id.padEnd(20)} ${s.age} Ma: land ${stats.landKm2} km², ${isl} (${((Date.now() - t0) / 1000).toFixed(1)} s)`)
  }
  // drop stage directories no longer in the list
  const sdir = join(gdir, 'stages')
  if (existsSync(sdir)) for (const d of readdirSync(sdir)) if (!keep.has(d)) rmSync(join(sdir, d), { recursive: true, force: true })
  m.stages = stages
  writeManifest(data, m)
  log(`wrote ${join(gdir, 'manifest.json')}`)
}

export { PROFILE_NOTE }
