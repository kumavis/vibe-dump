// The --bake step for the patches (DATA.md, "Patches, on any pack"): from the
// works in patch-works.mjs and the downloads, one mask per work and pack, and
// public/data/patches/manifest.json listing them all. Writes only
// public/data/patches/ and the district's patch-<work>.png files beside its
// pack; never the island packs, the district manifest or features.json.
//
// Raise (today's sea that was reef, bar, lagoon or shore):
// - The dredged ground is found on the CUDEM (about 3 m cells): inside a
//   work's zone, deeper than the group's `cut`, not in a passage, and not
//   natural deep water (what stays of the water deeper than the cut once
//   everything narrower than NATURAL_WIDTH is opened away, where it reaches
//   the deep sea: the fore-reef past a channel's mouth), unless today's chart
//   keeps it dredged; then opened by `open` metres so natural grooves and
//   holes drop out, and pieces under `minArea` dropped.
// - On each pack it meets, the texels it touches, grown by about 20 m (the
//   channel walls; two texels on the island pack, where GMRT's 61 m nodes
//   smooth a cut into its sides) and kept to today's sea and the zones, are
//   the footprint. Today's heights are the pack's own from here on.
// - The footprint is laid back at the reef that rims it: a smooth surface held
//   on the rim (sea texels round it that are neither cut nor passage nor
//   deeper than the cut) at the CUDEM's depth of the reef there, away from
//   the cut's walls, and free where it meets land, a passage or deep water,
//   so the old reef edge stands sharp against a passage as the surveys draw
//   it. Over a bar it is never shallower than the bar's surveyed depth, and
//   the fore-reef beside the bar is rim too, so the passage runs out over its
//   bar rather than ending at a wall. A canal dug through land is laid at its
//   `level` instead.
// - The manifest's `depth` is the shallowest of that surface over the patch,
//   and each texel's weight is what takes today's height there to the surface
//   under the app's mix (h + (depth − h)·w): (t − h)/(depth − h). So 255 is a
//   texel raised all the way to `depth`, and the weights carry the rest of the
//   reef's relief; they fall to nothing where today's floor already meets it,
//   and fade in over EDGE_METRES where the zones end across open water.
//
// Lower (today's land that was water or reef):
// - The shapes of the work (the 1881 sea, an old island's outline, the fill
//   unit, the work's region) are combined at sample level and averaged onto
//   the pack, kept to today's land standing above the work's `level`; low
//   land between the footprint and today's water (a seawall the fill polygon
//   stops short of) goes with it; and the edge is feathered a texel or two.
//
// Works are shared out so that no texel's weights within one kind add up to
// more than one: raise groups claim their texels in order, lower works in
// order, and the waterfront patch takes only what the dated works leave.
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { Ledger } from './fetch.mjs'
import { KX, KZ, bboxOf } from './geo.mjs'
import { distanceTo, readPack } from './layers-raster.mjs'
import { readPNG, writeGreyPNG } from './png.mjs'
import { resampleGrid } from './raster.mjs'
import { CUDEM, ENC, FILL, MAPS, cudemTiles, patchPaths, raiseBox } from './patch-sources.mjs'
import { BARS, HISTORIES, LOWER_WORKS, OLD_SHORES, PASSAGES, RAISE_GROUPS, feature } from './patch-works.mjs'
import { boxBlur, components, cudemMosaic, dilate, erode, gridOfRaster, packWindow, polygonCover, reduceMask, sampleMask, spreadFromRim } from './patch-raster.mjs'

const GROW_METRES = 20 // the footprint is grown this far round the cut cells (at least a texel; two on the island pack)
const WALL_METRES = 25 // the reef the rim is read from starts this far from a cut
const NATURAL_WIDTH = 500 // water deeper than a group's cut and wider than this, open to the deep sea, is natural
const DEEP_SEA = -20 // ... where it reaches water this deep
const NATURAL_PAD = 800 // metres of sea floor read round a group's zones, to find the deep sea
const EDGE_METRES = 30 // a group's raise fades in over this from the outer edge of its zones (two texels on the island pack)
const TOUCH = 0.02 // a texel is touched by a cut when this share of it is cut
const SEAWALL_METRES = 15 // low land this close to both a lower patch and today's water goes with it
const SEAWALL_BELOW = 5 // ... if it stands lower than this
const round = (v, d) => Math.round(v * 10 ** d) / 10 ** d

/** The packs patches go on: the oahu island pack and the districts on it. */
export function patchPacks(data) {
  const islands = JSON.parse(readFileSync(join(data, 'manifest.json'), 'utf8'))
  const out = []
  const oahu = islands.packs.find((p) => p.id === 'oahu')
  out.push({ id: 'oahu', kind: 'island', entry: oahu, dataDir: data, file: (w) => `patches/oahu-${w}.png` })
  const dPath = join(data, 'districts', 'manifest.json')
  if (existsSync(dPath)) {
    for (const d of JSON.parse(readFileSync(dPath, 'utf8')).districts) {
      if (d.island !== 'oahu') continue
      out.push({ id: d.id, kind: 'district', entry: d, dataDir: join(data, 'districts'), file: (w) => `districts/${d.id}/patch-${w}.png` })
    }
  }
  return out
}

const meets = (a, b) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1]
const boxOfGeoms = (geoms) => geoms.reduce((b, g) => bboxOf(g, b), [Infinity, Infinity, -Infinity, -Infinity])
const padBox = ([w, s, e, n], m) => [w - m / KX, s - m / KZ, e + m / KX, n + m / KZ]

// ---------------------------------------------------------------------------
// Raise

/** A group on the CUDEM: the mosaic, its cut cells and natural deep water (0/1 per cell), and the reef beside the cut (metres, NaN elsewhere). */
async function findCuts(g, tiles, enc, log) {
  const zones = g.zones.map((z) => z.geometry)
  const box = padBox(boxOfGeoms(zones), NATURAL_PAD)
  const raster = await cudemMosaic(tiles, box)
  if (!raster) throw new Error(`${g.id}: no CUDEM under it`)
  const grid = gridOfRaster(raster)
  const { W, H } = raster
  const step = raster.cellMetres
  const inZone = sampleMask(zones, grid, 1)
  const inPassage = sampleMask(PASSAGES.map((p) => p.geometry), grid, 1)
  // natural deep water: what stays of the water deeper than the cut once
  // everything narrower than NATURAL_WIDTH is opened away, where it reaches
  // the deep sea. The fore-reef past the reef edge is that; a dredged channel
  // or basin is narrower, or shut off from the sea by its own narrow mouth
  let deep = new Uint8Array(W * H)
  for (let o = 0; o < W * H; o++) deep[o] = raster.data[o] < g.cut ? 1 : 0
  const wide = dilate(erode(deep, W, H, NATURAL_WIDTH / 2, step), W, H, NATURAL_WIDTH / 2, step)
  const pieces = components(wide, W, H)
  const open = new Uint8Array(pieces.n + 1)
  for (let o = 0; o < W * H; o++) if (wide[o] && raster.data[o] < DEEP_SEA) open[pieces.label[o]] = 1
  // but what the chart keeps dredged is cut, whatever is round it: the
  // charted channel across a bar runs out where the natural sea floor is
  // already deep on one side
  const inEnc = enc.length ? sampleMask(enc.filter((f) => meets(bboxOf(f), box)), grid, 1) : new Uint8Array(W * H)
  const natural = new Uint8Array(W * H)
  let nat = 0
  for (let o = 0; o < W * H; o++) if (wide[o] && open[pieces.label[o]] && !inEnc[o]) (natural[o] = 1), nat++
  let cut = new Uint8Array(W * H)
  for (let o = 0; o < W * H; o++) cut[o] = inZone[o] && !inPassage[o] && !natural[o] && deep[o] ? 1 : 0
  deep = null
  cut = dilate(erode(cut, W, H, g.open, step), W, H, g.open, step)
  for (let o = 0; o < W * H; o++) if (!inZone[o] || inPassage[o] || natural[o]) cut[o] = 0
  const { label, sizes } = components(cut, W, H)
  const cellArea = step * step
  let kept = 0
  for (let o = 0; o < W * H; o++) {
    if (!cut[o]) continue
    if (sizes[label[o]] * cellArea < g.minArea) cut[o] = 0
    else kept++
  }
  log(`  ${g.id}: ${(kept * cellArea / 1e6).toFixed(3)} km² cut below ${g.cut} m on the CUDEM (and ${((nat * cellArea) / 1e6).toFixed(1)} km² of natural deep water round it left alone)`)
  // the reef beside the cut: the CUDEM's sea away from the cut's walls and
  // from the passages, which the rim of a coarse texel would otherwise average in
  const walls = dilate(cut, W, H, WALL_METRES, step)
  const reef = new Float32Array(W * H)
  for (let o = 0; o < W * H; o++) reef[o] = !walls[o] && !inPassage[o] && raster.data[o] < 0 ? raster.data[o] : NaN
  return { raster, cut, reef, natural }
}

/** A group's footprint on one pack, over a window of the pack: the texels (F), the zone each is in, and the CUDEM's reef under each. */
function raiseFootprint(g, P, cuts, passageCover, claimed) {
  const zones = g.zones.map((z) => z.geometry)
  const win = packWindow(P.grid, padBox(boxOfGeoms(zones), 100), 3)
  if (!win) return null
  const { grid, i0, j0, W, H } = win
  const zoneCover = g.zones.map((z) => polygonCover([z.geometry], grid, 4))
  const zoneOf = new Int8Array(W * H).fill(-1)
  for (let o = 0; o < W * H; o++) {
    let best = 0
    zoneCover.forEach((c, k) => {
      if (c[o] > best) (best = c[o]), (zoneOf[o] = k)
    })
  }
  const PW = P.W
  const at = (o) => (j0 + Math.floor(o / W)) * PW + i0 + (o % W)
  let seed
  let natural = null
  if (g.packSea) {
    // the pack's own water inside the zones
    seed = new Uint8Array(W * H)
    for (let o = 0; o < W * H; o++) seed[o] = zoneOf[o] >= 0 && zoneCover[zoneOf[o]][o] >= 0.5 && P.metres[at(o)] <= 0 ? 1 : 0
  } else {
    const cover = resampleGrid({ ...cuts.raster, data: Float32Array.from(cuts.cut) }, grid)
    natural = resampleGrid({ ...cuts.raster, data: Float32Array.from(cuts.natural) }, grid)
    seed = new Uint8Array(W * H)
    for (let o = 0; o < W * H; o++) seed[o] = cover[o] > TOUCH ? 1 : 0
    // (on the island pack GMRT's 61 m nodes smooth a cut over a texel or two either side)
    seed = dilate(seed, W, H, P.kind === 'island' ? 2 : Math.max(1, Math.round(GROW_METRES / P.texelMetres)), 1)
  }
  const F = new Uint8Array(W * H)
  let n = 0
  for (let o = 0; o < W * H; o++) {
    const p = at(o)
    if (seed[o] && zoneOf[o] >= 0 && P.metres[p] <= 0 && !passageCover[p] && !claimed[p] && !(natural && natural[o] >= 0.5)) {
      F[o] = 1
      n++
    }
  }
  if (!n) return null
  // the CUDEM's sea under each texel (the mean of its cells below sea level)
  let rimDepth = null
  if (cuts) rimDepth = resampleGrid({ ...cuts.raster, data: cuts.reef }, grid)
  return { win, F, zoneOf, zoneCover, at, rimDepth }
}

/** The reef surface over a group's footprint, and its share among the zones as weights. */
function raiseWeights(g, P, fp, passageCover, taken) {
  const { win, F, zoneOf, zoneCover, at } = fp
  const { W, H, grid } = win
  const N = W * H
  let t
  if (typeof g.level === 'number') {
    t = new Float32Array(N).fill(NaN)
    for (let o = 0; o < N; o++) if (F[o]) t[o] = g.level
  } else {
    // the rim: today's sea round the footprint, neither cut nor passage
    const isFixed = new Uint8Array(N)
    const fixed = new Float32Array(N)
    const bars = BARS.filter((b) => (g.bars || []).includes(b.id)).map((b) => ({ ...b, cover: polygonCover([b.geometry], grid, 4) }))
    const onBar = (o) => bars.some((b) => b.cover[o] > 0)
    for (let o = 0; o < N; o++) {
      const p = at(o)
      if (F[o] || taken[p] || passageCover[p] || P.metres[p] > 0) continue
      // the rim's depth from the CUDEM where it has sea there: on the island
      // pack GMRT smooths the cut into the reef beside it, and the reef the
      // cut goes back to is the reef the fine survey sees
      const v = fp.rimDepth && fp.rimDepth[o] === fp.rimDepth[o] ? Math.min(-1, fp.rimDepth[o]) : P.metres[p]
      // natural water deeper than the cut (the fore-reef past a channel's
      // mouth) is no reef to lay it back at: the edge there stays free, but
      // on a bar, whose seaward face it is, it holds the surface down
      if (!(v > g.cut) && !onBar(o)) continue
      isFixed[o] = 1
      fixed[o] = v
    }
    t = spreadFromRim(F, isFixed, fixed, W, H, -1.5)
    // over a bar, never shallower than the bar's surveyed depth (and where
    // the sea floor beside it is deeper, as off the reef edge, that depth)
    for (const b of bars) for (let o = 0; o < N; o++) if (F[o] && b.cover[o] >= 0.5) t[o] = Math.min(t[o], b.depth)
  }
  // a soft edge where the zones end across open water (a channel's mouth on
  // the fore-reef), so the laid-back ground meets today's in a ramp of a few
  // texels rather than a step; not where one zone meets another, of this
  // group or the next, and not at a passage, whose edge the surveys draw sharp
  const anyZone = polygonCover(RAISE_GROUPS.flatMap((x) => x.zones.map((z) => z.geometry)), grid, 4)
  const outside = new Uint8Array(N)
  for (let o = 0; o < N; o++) outside[o] = anyZone[o] >= 0.5 ? 0 : 1
  const fromEdge = distanceTo(outside, W, H, 1)
  const R = P.kind === 'island' ? 2 : Math.max(2, Math.round(EDGE_METRES / P.texelMetres))
  const taper = (o) => Math.min(1, fromEdge[o] / R)
  // weights per zone
  const out = []
  g.zones.forEach((z, k) => {
    let depth = -Infinity
    for (let o = 0; o < N; o++) if (F[o] && zoneOf[o] === k && P.metres[at(o)] < t[o]) depth = Math.max(depth, t[o])
    if (depth === -Infinity) return
    depth = Math.ceil(depth * 100) / 100
    const w = new Float32Array(N)
    let on = 0
    let raise = 0
    for (let o = 0; o < N; o++) {
      if (!F[o] || zoneOf[o] !== k) continue
      const h = P.metres[at(o)]
      if (!(h < t[o])) continue
      let v = Math.min(1, (t[o] - h) / (depth - h)) * (g.packSea ? 1 : taper(o))
      // a canal laid at a level takes its edge texels by their share of the corridor
      if (g.packSea) v *= Math.min(1, zoneCover[k][o] * 2)
      if (v <= 0) continue
      w[o] = v
      on++
      raise += v * (depth - h)
    }
    if (on) out.push({ zone: z, depth, w, on, meanRaise: raise / on })
  })
  return out
}

// ---------------------------------------------------------------------------
// Lower

function lowerWeights(L, P, shapes, fill, used) {
  const geoms = [...(L.region ? [L.region] : []), ...L.within.map((k) => shapes[k].geometry)]
  const box = L.region ? boxOfGeoms([L.region]) : boxOfGeoms(L.within.map((k) => shapes[k].geometry))
  const win = packWindow(P.grid, box, 3)
  if (!win) return null
  const { grid, i0, j0, W, H } = win
  const N = W * H
  const PW = P.W
  const at = (o) => (j0 + Math.floor(o / W)) * PW + i0 + (o % W)
  const s = P.kind === 'district' ? 2 : 8
  // the shapes that must hold, and those that must not, at sample level
  const and = (a, b) => {
    for (let k = 0; k < a.length; k++) a[k] &= b[k]
    return a
  }
  let bits = null
  for (const g of geoms) bits = bits ? and(bits, sampleMask([g], grid, s)) : sampleMask([g], grid, s)
  if (!bits) bits = new Uint8Array(N * s * s).fill(1)
  for (const k of L.outside || []) {
    const out = sampleMask([shapes[k].geometry], grid, s)
    for (let q = 0; q < bits.length; q++) if (out[q]) bits[q] = 0
  }
  const shape = reduceMask(bits, grid, s)
  const withFill = L.fill ? reduceMask(and(Uint8Array.from(bits), sampleMask(fill, grid, s)), grid, s) : shape
  const land = (o) => P.metres[at(o)] > 0
  const w = new Float32Array(N)
  for (let o = 0; o < N; o++) if (land(o) && P.metres[at(o)] > L.level) w[o] = withFill[o]
  // the seawall rim: low land inside the work's shapes, close to both the
  // footprint and today's water
  const R = Math.max(1, Math.round(SEAWALL_METRES / P.texelMetres))
  const core = new Uint8Array(N)
  const water = new Uint8Array(N)
  for (let o = 0; o < N; o++) {
    core[o] = w[o] >= 0.5 ? 1 : 0
    water[o] = land(o) ? 0 : 1
  }
  const nearCore = dilate(core, W, H, R)
  const nearWater = dilate(water, W, H, R)
  for (let o = 0; o < N; o++) {
    const h = P.metres[at(o)]
    if (land(o) && h > L.level && h < SEAWALL_BELOW && shape[o] >= 0.5 && nearCore[o] && nearWater[o]) w[o] = Math.max(w[o], 1)
  }
  // feathered edge, kept to today's land above the level
  const fr = P.kind === 'district' ? 2 : 1
  const soft = boxBlur(w, W, H, fr)
  for (let o = 0; o < N; o++) {
    const h = P.metres[at(o)]
    w[o] = land(o) && h > L.level ? Math.max(w[o], Math.min(1, soft[o] * 1.5) * (shape[o] > 0 || w[o] > 0 ? 1 : 0.6)) : 0
    // what an earlier work already holds is not given twice
    w[o] = Math.max(0, Math.min(w[o], Math.round((1 - used[at(o)]) * 255) / 255))
  }
  let on = 0
  let lower = 0
  for (let o = 0; o < N; o++) {
    if (w[o] < 1 / 255) {
      w[o] = 0
      continue
    }
    on++
    lower += w[o] * (P.metres[at(o)] - L.level)
  }
  if (!on) return null
  return { win, w, at, on, meanLower: lower / on }
}

// ---------------------------------------------------------------------------

function toBytes(win, w, at, PW, PH) {
  const bytes = new Uint8Array(PW * PH)
  for (let o = 0; o < win.W * win.H; o++) if (w[o] > 0) bytes[at(o)] = Math.max(1, Math.round(w[o] * 255))
  return bytes
}

export async function bakePatches({ dir, data, log }) {
  const t0 = Date.now()
  const ledger = new Ledger(dir)
  const p = patchPaths(dir)
  if (!existsSync(p.fill)) throw new Error(`nothing downloaded in ${dir}; run --download first`)
  const tiles = cudemTiles(p.cudemList, raiseBox())
    .map((t) => p.cudemTile(t.name))
    .filter((f) => existsSync(f))
  // today's charted dredged areas: cut ground wherever the chart has them
  const enc = existsSync(p.enc) ? (JSON.parse(readFileSync(p.enc, 'utf8')).features || []).map((f) => f.geometry).filter(Boolean) : []
  if (!enc.length) log('  no ENC dredged areas in the downloads: cut ground is found on the CUDEM alone')
  const fillFc = JSON.parse(readFileSync(p.fill, 'utf8'))
  const fill = fillFc.features.map((f) => f.geometry)
  const shapes = OLD_SHORES

  // data sources, as the manifest lists them
  const fetched = (f) => ledger.get(f)?.fetched
  const DATA_SOURCES = {
    cudem: {
      id: CUDEM.id,
      title: CUDEM.title,
      url: CUDEM.page,
      fetched: tiles.map(fetched).filter(Boolean).sort().pop(),
      licence: CUDEM.licence,
      note: `${tiles.map((f) => f.split('/').pop().replace('.tif', '')).join(', ')}: the sea floor the cut ground is found on, at its 1/9″ cells; the reef surface is spread from the pack’s own heights`,
    },
    fill: {
      id: 'hawaii-gis-geologic-units-fill-oahu',
      title: 'State of Hawaiʻi GIS, Geologic Units (Terrestrial MapServer layer 28), after Sherrod and others (USGS 2007): the fill unit (Qf) on Oʻahu',
      url: FILL.service,
      query: FILL.where,
      fetched: fetched(p.fill),
      licence: FILL.licence,
      metadata: FILL.metadata,
      note: `${fill.length} polygons on Oʻahu; ${FILL.note}`,
    },
    1881: { id: MAPS[1881].id, title: MAPS[1881].title, url: MAPS[1881].service, fetched: Object.keys(ledger.entries).filter((k) => /-1881\.png$/.test(k)).map((k) => ledger.entries[k].fetched).sort().pop(), licence: MAPS[1881].licence },
    enc: { id: ENC.id, title: ENC.title, url: ENC.service, fetched: fetched(p.enc), licence: ENC.licence, note: ENC.note },
    1899: { id: MAPS[1899].id, title: MAPS[1899].title, url: MAPS[1899].service, fetched: Object.keys(ledger.entries).filter((k) => /-1899\.png$/.test(k)).map((k) => ledger.entries[k].fetched).sort().pop(), licence: MAPS[1899].licence },
    1938: { id: MAPS[1938].id, title: MAPS[1938].title, url: MAPS[1938].service, fetched: Object.keys(ledger.entries).filter((k) => /-1938\.png$/.test(k)).map((k) => ledger.entries[k].fetched).sort().pop(), licence: MAPS[1938].licence },
  }
  const history = (id) => {
    const h = HISTORIES[id]
    return h ? { id, title: h.title, url: h.url, fetched: h.fetched, licence: h.licence, note: h.note } : null
  }
  const mapSource = (year, use) => ({ ...DATA_SOURCES[year], note: use })

  const outDir = join(data, 'patches')
  mkdirSync(outDir, { recursive: true })
  const packs = patchPacks(data)
  const entries = []
  const written = new Set()
  for (const pk of packs) {
    const P = { ...readPack(pk.dataDir, pk.entry), kind: pk.kind }
    const PN = P.W * P.H
    log(`${pk.id}: ${P.W}x${P.H} at ${P.texelMetres.toFixed(1)} m`)
    const passageCover = new Uint8Array(PN)
    {
      const pc = polygonCover(PASSAGES.map((x) => x.geometry), P.grid, 4)
      for (let o = 0; o < PN; o++) passageCover[o] = pc[o] > 0 ? 1 : 0
    }

    // --- raise: footprints first (each group claims its texels), then surfaces
    const claimed = new Uint8Array(PN)
    const fps = []
    for (const g of RAISE_GROUPS) {
      if (!meets(boxOfGeoms(g.zones.map((z) => z.geometry)), P.grid.bounds)) continue
      const cuts = g.packSea ? null : (g._cuts ||= await findCuts(g, tiles, enc, log))
      const fp = raiseFootprint(g, P, cuts, passageCover, claimed)
      if (!fp) continue
      for (let o = 0; o < fp.F.length; o++) if (fp.F[o]) claimed[fp.at(o)] = 1
      fps.push({ g, fp })
    }
    for (const { g, fp } of fps) {
      for (const r of raiseWeights(g, P, fp, passageCover, claimed)) {
        const z = r.zone
        const file = pk.file(z.id)
        writeGreyPNG(join(data, file), P.W, P.H, toBytes(fp.win, r.w, fp.at, P.W, P.H))
        written.add(file)
        const km2 = (r.on * P.texelKm2)
        const sources = [
          ...(g.packSea ? [] : [DATA_SOURCES.cudem]),
          ...(!g.packSea && enc.some((f) => meets(bboxOf(f), boxOfGeoms([z.geometry])))
            ? [{ ...DATA_SOURCES.enc, note: 'today’s charted dredged areas here, counted as cut wherever they lie' }]
            : []),
          mapSource(
            1881,
            g.bars?.length || PASSAGES.some((x) => meets(boxOfGeoms([x.geometry]), boxOfGeoms([z.geometry])))
              ? 'the passages kept open and the bars, traced by hand (passages.geojson); reef flat where the cut now runs'
              : g.packSea
                ? 'the Waikīkī wetland the canal was dug through'
                : 'reef flat or lagoon where the cut now runs',
          ),
          ...(BARS.some((b) => (g.bars || []).includes(b.id) && b.sheets?.includes(1899)) ? [mapSource(1899, 'the soundings on the bar')] : []),
          ...(z.sources || []).map((id) => (id === 'hawaii-gis-oahu-1938' ? mapSource(1938, 'the works it shows, which date the patch no later than 1938') : history(id))).filter(Boolean),
        ]
        entries.push({
          id: `${pk.id}-${z.id}`,
          pack: pk.id,
          kind: 'raise',
          depth: r.depth,
          until: z.until,
          file,
          size: [P.W, P.H],
          name: z.name,
          note: z.note,
          sources,
          stats: { texels: r.on, km2: round(km2, 3), meanRaiseMetres: round(r.meanRaise, 2) },
        })
        log(`  raise ${z.id} (until ${z.until}): ${r.on} texels, ${km2.toFixed(3)} km², depth ${r.depth} m, mean raise ${r.meanRaise.toFixed(1)} m`)
      }
    }

    // --- lower: dated works first, then what is left to the waterfront
    const used = new Float32Array(PN)
    for (const L of [...LOWER_WORKS.filter((x) => !x.rest), ...LOWER_WORKS.filter((x) => x.rest)]) {
      if (L.islandOnly && pk.kind !== 'island') continue
      const box = L.region ? boxOfGeoms([L.region]) : boxOfGeoms(L.within.map((k) => shapes[k].geometry))
      if (!meets(box, P.grid.bounds)) continue
      const r = lowerWeights(L, P, shapes, fill, used)
      if (!r) continue
      const bytes = toBytes(r.win, r.w, r.at, P.W, P.H)
      for (let o = 0; o < PN; o++) used[o] += bytes[o] / 255
      const file = pk.file(L.id)
      writeGreyPNG(join(data, file), P.W, P.H, bytes)
      written.add(file)
      const km2 = r.on * P.texelKm2
      const uses = [...L.within, ...(L.outside || [])]
      const sources = [
        ...(L.fill ? [DATA_SOURCES.fill] : []),
        mapSource(1881, uses.some((k) => shapes[k].source === 'hawaii-gis-oahu-1881') ? 'the 1881 shore the fill is cut with, traced by hand' : 'reef or water where the fill now stands'),
        ...(uses.some((k) => shapes[k].source === 'hawaii-gis-oahu-1938') ? [mapSource(1938, 'Sand Island as the 1938 map draws it, traced by hand')] : []),
        ...(L.sheets?.includes(1899) ? [mapSource(1899, 'the same waterfront as the 1881 sheet, within its registration: the filling came after it')] : []),
        ...L.sources.map((id) => (id === 'hawaii-gis-oahu-1938' ? null : history(id))).filter(Boolean),
      ]
      entries.push({
        id: `${pk.id}-${L.id}`,
        pack: pk.id,
        kind: 'lower',
        depth: L.level,
        until: L.until,
        file,
        size: [P.W, P.H],
        name: L.name,
        note: L.note,
        sources,
        stats: { texels: r.on, km2: round(km2, 3), meanLowerMetres: round(r.meanLower, 2) },
      })
      log(`  lower ${L.id} (until ${L.until}): ${r.on} texels, ${km2.toFixed(3)} km², to ${L.level} m, mean lower ${r.meanLower.toFixed(1)} m`)
    }
  }

  // --- what is left over from an earlier bake
  for (const f of readdirSync(outDir)) if (f.endsWith('.png') && !written.has(`patches/${f}`)) rmSync(join(outDir, f))
  for (const pk of packs) {
    if (pk.kind !== 'district') continue
    // a district's own patches (its manifest's) stay; ours from an earlier bake go
    const own = new Set((pk.entry.patches || []).map((q) => q.file.split('/').pop()))
    const dir = join(data, 'districts', pk.id)
    for (const f of readdirSync(dir)) if (/^patch-.*\.png$/.test(f) && !own.has(f) && !written.has(`districts/${pk.id}/${f}`)) rmSync(join(dir, f))
  }

  // --- the passages, as the check and the app may read them
  const passages = {
    type: 'FeatureCollection',
    about: 'natural passages through the reef, kept open: no raise patch may touch them (DATA.md, “Patches, on any pack”)',
    features: PASSAGES.map((x) => feature(x.geometry, { id: x.id, name: x.name, kind: 'passage', source: x.source, note: x.note })),
    bars: BARS.map((b) => feature(b.geometry, { id: b.id, name: b.name, kind: 'bar', depth: b.depth, note: b.note })),
  }
  writeFileSync(join(outDir, 'passages.geojson'), JSON.stringify(passages) + '\n')

  entries.sort((a, b) => (a.pack === b.pack ? a.until - b.until || (a.id < b.id ? -1 : 1) : a.pack === 'oahu' ? -1 : b.pack === 'oahu' ? 1 : a.pack < b.pack ? -1 : 1))
  const manifest = {
    about:
      'Patches that put the shore back where it was before each harbour work (DATA.md, “Patches, on any pack”): raise patches lay dredged ground back ' +
      'at the reef, bar or shore it was cut from, lower patches lay fill back at the reef it was made on. Each applies to years before its `until`. ' +
      'A raise mask’s weights carry the reef’s relief: under the app’s mix h + (depth − h)·w, each texel goes to the reef that rims the cut, which ' +
      'is never shallower than `depth`. Natural passages are in passages.geojson and no raise touches them',
    passages: { file: 'patches/passages.geojson', note: 'the passages kept open (Polygons) and, under `bars`, the bars held at their surveyed depth; lon/lat' },
    patches: entries,
    baked: { tool: 'tools/bake-patches.mjs', works: 'tools/lib/patch-works.mjs' },
  }
  // a cross-check against today's charted channels, for the log
  if (existsSync(p.enc)) encCheck(p.enc, entries, data, log)
  writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
  log(`wrote ${entries.length} patches and ${join(outDir, 'manifest.json')} (${((Date.now() - t0) / 1000).toFixed(0)} s)`)
}

/** How much of the charted dredged areas inside the raise zones the raise patches cover (outside the passages), and which charted areas lie outside every zone. */
function encCheck(file, entries, data, log) {
  const enc = JSON.parse(readFileSync(file, 'utf8'))
  if (!enc.features?.length) return
  const zones = RAISE_GROUPS.flatMap((g) => g.zones.map((z) => z.geometry))
  const zoneBoxes = zones.map((z) => bboxOf(z))
  const inZones = enc.features.filter((f) => zoneBoxes.some((b) => meets(bboxOf(f.geometry), b)))
  const elsewhere = [...new Set(enc.features.filter((f) => !inZones.includes(f)).map((f) => f.properties.OBJNAM || f.properties.DSNM))]
  for (const pk of patchPacks(data)) {
    const P = readPack(pk.dataDir, pk.entry)
    const mine = entries.filter((e) => e.pack === pk.id && e.kind === 'raise')
    if (!mine.length) continue
    const any = new Uint8Array(P.W * P.H)
    for (const e of mine) {
      const { data: m } = readPNG(join(data, e.file))
      for (let o = 0; o < any.length; o++) if (m[o]) any[o] = 1
    }
    const z = polygonCover(zones, P.grid, 4)
    const c = polygonCover(inZones.map((f) => f.geometry), P.grid, 4)
    const pas = polygonCover(PASSAGES.map((x) => x.geometry), P.grid, 4)
    let n = 0
    let covered = 0
    for (let o = 0; o < any.length; o++) {
      if (c[o] < 0.5 || z[o] < 0.5 || pas[o] > 0 || P.metres[o] > 0) continue
      n++
      if (any[o]) covered++
    }
    if (n) log(`  ${pk.id}: the raise patches cover ${((covered / n) * 100).toFixed(0)}% of the charted dredged areas inside the works’ zones and outside the passages (${n} texels)`)
  }
  if (elsewhere.length) log(`  charted dredged areas outside every zone (not patched): ${elsewhere.join(', ')}`)
}
