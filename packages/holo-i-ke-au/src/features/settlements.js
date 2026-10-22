// Settlements by era (DESIGN.md §5.4): at the near zoom buildings come from
// the settlement layer's density for the chosen year (DATA.md "Era layers",
// people per km² on a log scale at four keyframes), not only from
// features.json, and their kind follows the era. Density sets how close and
// how large; the era sets what; a house's value, with the density, sets which
// of the era's kinds, the humbler or the finer. The village at Kou keeps its
// own hale, placed from its outline (index.js), and the scatter yields to it
// while it stands.
//
// Two scatters share the rules here (Scatter): the district's (Settlements,
// below), worked out once over its 6 m ground when the district arrives, and
// every island's (towns.js), worked out tile by tile over the island pack's
// coarser ground around the camera, so a painted mask is all a settled place
// needs. Inside a district's bounds the district places its own; the island's
// yield to it (PART).
//
// This is modelled placement from a modelled density: nothing here is a
// surveyed building. The landmarks are the exceptions, and only where the
// gazetteer has their place or the density peaks: the church of 1842 (at
// `kawaiahao` if the gazetteer has it, else where the town is densest), a
// clock tower at the harbour from 1926 (only if the gazetteer has
// `aloha-tower`); no other building is named.
//
// How it is worked out:
//
// - The density. The island's settlement masks are read (four PNGs, about
//   68 m a texel on Oʻahu, 150 m on Hawaiʻi), and sampled at any point
//   bilinearly with a stable noise over them, so a coarse texel breaks into
//   hamlets and gaps rather than a square of even scatter. The year is placed
//   on the keyframes as the land overlay places it (overlay/land.js: by the
//   manifest's eras, linearly in the bytes, which is geometric in people),
//   and thinned before 1450 as the overlay thins it. The Māhele keyframe has
//   no town in it, so the towns of 1853 are put back (townTerm).
// - The lots. The land is laid with lots on a street grid aligned to the
//   shore: a tile of 500 m takes the direction away from the sea, so the grid
//   runs mauka–makai and along the shore as Honolulu's does, blocks of four
//   lots by two between streets. Each lot has a rank in an ordered dither
//   (Bayer), so the lots that fill at any density are evenly spread, and the
//   same lots fill again whenever the density comes back to the same value:
//   the same place and year always give the same town. A kauhale takes four
//   lots, a yard of its own, ranked on a dither of its own.
// - The weight of the ground. Flat ground near the coast and the streams
//   draws more than slopes away from both; a lot is refused where the ground
//   of the year is water (the patches lower the made land and raise the
//   dredged channels before their dates), on a loʻi or a fishpond or the
//   village while it stands, on a stream, or where its footprint falls more
//   than a few metres.
// - The value (valueAt). Modelled, unless the layers ever carry a value mask
//   (`layers/<island>/<keyframe>-value.png`, 0..255): rising with the
//   density, the nearness of the coast, of a harbour and of a town's core,
//   and with the years, it decides within an era between the humbler kinds
//   and the finer: thatch against frame and coral block in the 1850s,
//   cottages against stores and masonry in the 1890s, bungalows against
//   offices in the territory, walk-ups and houses against towers now.
// - Zoning, for the years after 1960 (DATA.md "Zoning, for the
//   settlements"): where the island has `now-zoning.png` its class decides
//   what the modern era builds, towers only in the high-rise, downtown and
//   resort classes, offices and shops in the commercial, sheds in the
//   industrial, nothing residential on agricultural, conservation, military,
//   institutional or park land; and from 1964 the State Land Use District
//   keeps conservation land empty and the rural and agricultural sparse.
//   Density and value still set how many and how fine; where the raster is
//   absent, they set it all.
// - The years. Each lot is asked, year by sampled year (every four years from
//   contact, and at every date a patch or a feature changes), whether a
//   building stands on it and of which kind; the answers become instances,
//   each with the span of years it stands, which the shader fades by an
//   eased year (kit.js aSpan): density changes ease, kinds crossfade at their
//   boundaries (the one going and the one coming dithered over complementary
//   pixels, never both on one), and a change forced by the ground (a loʻi
//   laid, a reef filled) is never crossed fading.
//
// The kinds by era (buildings.js), each lot moving on at its own time, the
// densest first: kauhale before about 1820, each hale on its own ground;
// thatch beside frame houses, adobe and coral block to about 1860, a church
// with a tower where the town is densest; wood-frame cottages,
// false-fronted stores along the streets and masonry blocks downtown to
// about 1900, church spires; bungalows and downtown's mid-rise to about 1960;
// then the suburbs, walk-ups and towers, a tower's height following the
// density, and the old downtown's lots gone up to office towers.
//
// Nothing flickers: every model fits its lot with a gap to the next (fit),
// stands a hand's breadth over the highest ground sampled under it (LIFT)
// on a plinth reaching down past the lowest, and no two instances ever share
// a footprint at once.
//
// What it costs: the instances are drawn by kind and variant, one draw call
// each, at most MAX_DRAWN at once, all of them near the camera and fewer of
// each tile further out (as the trees, vegetation.js), within a reach that
// grows with the camera's distance. Placed buildings are held to about
// MAX_PLACED in any year. The streets are ribbons on the ground (ribbons.js),
// one batch per epoch, crossfading; the trees step back from what is built
// (kit.js uTownClear).

import * as THREE from 'three'
import { S, Y, objectMaterial } from './kit.js'
import { buildKits, KAUHALE, TOWER_H, TOWN_PALETTE } from './buildings.js'
import { decodeImage } from '../data/image.js'
import { decodeGrey, settlementCodec } from '../data/layers.js'
import { holds, spanOf } from '../data/district.js'
import { patchLevel, fromHalf, ihash } from '../data/district-decode.js'
import { distanceTransform, blur } from '../data/decode.js'
import { EARLY } from '../overlay/land.js'
import { geometryPoint } from '../geo.js'
import { DISTRICT } from '../config.js'

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
export const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

// --- the grid -------------------------------------------------------------------

// world units (100 m): a lot along the shore and mauka, the streets between
// blocks of four lots by two, and the tile over which the grid keeps one
// direction
export const LU = 0.36
export const LV = 0.4
const GU = 0.14
const GV = 0.14
const BU = 4 * LU + GU
const BV = 2 * LV + GV
export const GRID_TILE = 5
const LOTS_PER_KM2 = (8 / (BU * BV)) * 100
// people per km² at which every lot of the grid would hold a house, filled in
// proportion below it (fill): about a household or two a lot, at the scale
// the buildings are drawn
const PROP = 5000
// what a building keeps clear of its lot's edges (so neighbours never touch),
// and how far over the highest ground sampled under it its footing stands
// (metres of ground, at the near exaggeration: a hand's breadth)
const GAP = 0.012
export const LIFT = Y(0.15)
// a lot's front may reach this far into its street, short of its middle
const FRONT = LV / 2 + GV / 2 - GAP

// Where a district meets its island (towns.js): the district places its own
// lots no nearer its edge than PART + PART_GAP; the island's lots further in
// than PART yield to it, dithered out over the pixels the district's take
// in, while it is down. Between them a strip no lot of either stands on.
export const PART = 3.5
export const PART_GAP = 0.8

// the kinds: scale on the ground (sh) and up (sv), world units per metre;
// the fall a footprint may take (metres); the era's grid or a loose scatter;
// how far the early town's lots turn off the grid (radians, either way of it)
const HALE_S = S * 1.4 // (as index.js draws Kou's)
const TOWN_S = S * 1.25
export const KINDS = {
  kauhale: { sh: HALE_S, sv: HALE_S, relief: 2.5, loose: true },
  hale: { sh: TOWN_S, sv: TOWN_S, relief: 3, jitter: 0.2 },
  frame: { sh: TOWN_S, sv: TOWN_S, relief: 3, jitter: 0.3 },
  adobe: { sh: TOWN_S, sv: TOWN_S, relief: 3, jitter: 0.3 },
  cottage: { sh: TOWN_S, sv: TOWN_S, relief: 3.5 },
  store: { sh: TOWN_S, sv: TOWN_S, relief: 3 },
  block: { sh: TOWN_S, sv: TOWN_S, relief: 3 },
  bungalow: { sh: TOWN_S * 0.92, sv: TOWN_S * 0.92, relief: 4 },
  midrise: { sh: S, sv: S * 0.8, relief: 4 },
  house: { sh: TOWN_S * 0.9, sv: TOWN_S * 0.9, relief: 6 },
  walkup: { sh: S * 0.75, sv: S * 0.75, relief: 5 },
  tower: { sh: S * 0.48, sv: S * 0.58, relief: 6 },
  shed: { sh: TOWN_S * 0.9, sv: TOWN_S * 0.9, relief: 4 },
  church: { sh: S * 0.85, sv: S * 0.85, relief: 3 },
  spire: { sh: TOWN_S * 0.9, sv: TOWN_S * 0.9, relief: 3 },
  clock: { sh: S * 0.7, sv: S * 0.7, relief: 3 },
}
export const KIND_NAMES = Object.keys(KINDS)
// the lot paved under the city's kinds (model metres: the lot, less its gap, over the kind's scale)
export const PADS = Object.fromEntries(['walkup', 'tower'].map((k) => [k, [(LU - 2 * GAP) / KINDS[k].sh, (LV - 2 * GAP) / KINDS[k].sh]]))
export const KIND = Object.fromEntries(KIND_NAMES.map((k, i) => [k, i]))
const LANDMARK = new Set(['church', 'spire', 'clock'])

// The zoning classes of DATA.md "Zoning, for the settlements", and the State
// Land Use Districts.
export const ZONE = { none: 0, houses: 1, lowrise: 2, highrise: 3, commercial: 4, downtown: 5, industrial: 6, resort: 7, agricultural: 8, conservation: 9, military: 10, institutional: 11, parks: 12 }
export const LUD = { urban: 1, rural: 2, agricultural: 3, conservation: 4 }
// the zoning applies to the modern era's kinds (after 1960), the Land Use
// Districts from 1964 (DATA.md)
const ZONING_FROM = 1960
const LUD_FROM = 1964
// The people who work where few live, as a density the fill reads (people
// per km²): the census of now counts residents, and a business district, a
// resort strip or an industrial estate would otherwise come out emptier than
// the 1930s left it. Modelled, as the old downtown's towers are (CORE_BYTE).
export const ZONE_FLOOR = { [ZONE.downtown]: 9000, [ZONE.resort]: 8000, [ZONE.commercial]: 4000, [ZONE.industrial]: 3500, [ZONE.institutional]: 1500, [ZONE.military]: 800, [ZONE.agricultural]: 120 }

// the years: sampled every STEP from contact, sparsely before it (only the
// thinning before 1450 changes anything there)
const STEP = 4
const PRE = [1100, 1200, 1300, 1400, 1450, 1600, 1700]
// the crossfade between kinds or densities (years either side of a moment
// each lot draws for itself between two samples, so a year shows few lots
// caught half-faded), and a fade forced by the ground (inside the years the
// ground allows)
const SOFT = 0.6
const HARD = 2.5
// far ends of a span that never closes
const NEVER = 1e5

// the old downtown's office towers (see scatterLot): at least the density, as
// a byte, whose towers stand about 80 m, and up to about 130 m
const CORE_BYTE = 232
const CORE_UNTIL = 1936

// the Māhele keyframe's towns (see townTerm): from this year on a keyframe
// with no towns of its own borrows the next keyframe's
const TOWN_FROM = 1800

export const BAYER = (() => {
  let M = [[0]]
  for (let k = 0; k < 3; k++) {
    const n = M.length
    const N = Array.from({ length: 2 * n }, () => new Array(2 * n))
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const v = 4 * M[y][x]
        N[y][x] = v
        N[y][x + n] = v + 2
        N[y + n][x] = v + 3
        N[y + n][x + n] = v + 1
      }
    }
    M = N
  }
  return M
})()

// the yards' own ordered dither (a kauhale takes a yard of four lots)
const YARD_BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]

/** A smooth value noise from the integer hash, for the density's upsampling. */
export function vnoise(x, z, seed) {
  const i = Math.floor(x)
  const j = Math.floor(z)
  const fx = x - i
  const fz = z - j
  const ux = fx * fx * (3 - 2 * fx)
  const uz = fz * fz * (3 - 2 * fz)
  const a = ihash(i, j, seed)
  const b = ihash(i + 1, j, seed)
  const c = ihash(i, j + 1, seed)
  const d = ihash(i + 1, j + 1, seed)
  return a + (b - a) * ux + (c - a + (a - b + d - c) * ux) * uz
}

export function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Point in polygon (a ring of [x, z]). */
export function inside(poly, x, z) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i]
    const b = poly[j]
    if (a[1] > z !== b[1] > z && x < ((b[0] - a[0]) * (z - a[1])) / (b[1] - a[1]) + a[0]) c = !c
  }
  return c
}

// --- zoning ---------------------------------------------------------------------

/**
 * Where the layers' manifest lists an island's zoning (DATA.md "Zoning, for
 * the settlements"): { zoning, lud }, each a file under layers/ or null. The
 * manifest may give them under a top-level `zoning` key by island (with or
 * without an `islands` level), or in the island's own entry; any of them may
 * be missing, and then so is the raster.
 */
export function zoningFiles(m, island) {
  const top = m?.zoning
  const e = top?.islands?.[island] ?? top?.[island] ?? m?.islands?.[island]?.zoning ?? m?.islands?.[island]?.layers?.now?.zoning ?? null
  if (!e) return { zoning: null, lud: null }
  const file = (v) => (typeof v === 'string' ? v : v?.file || null)
  return { zoning: file(e.zoning ?? e.now ?? (e.file ? e : null)), lud: file(e.lud) }
}

/**
 * An island's zoning and Land Use District rasters, decoded, or nulls: read
 * from the data's own layers/manifest.json, or from the manifest under
 * ?zoning=<base> (the tools' test rasters, tools/fake-data.mjs). A raster
 * may be smaller than the pack (half its resolution, DATA.md): it is read by
 * where a point falls across the pack's bounds, nearest texel.
 */
export async function loadZoning(app, m, island) {
  let base = null
  let man = m
  const q = app.params?.get('zoning')
  if (q) {
    try {
      base = new URL(q.endsWith('/') ? q : `${q}/`, location.href)
      const res = await fetch(new URL('layers/manifest.json', base))
      man = res.ok ? await res.json() : null
    } catch {
      man = null
    }
  }
  const files = zoningFiles(man, island)
  const read = async (f) => {
    if (!f) return null
    try {
      const url = base ? new URL(`layers/${f}`, base).href : app.data.abs(`layers/${f}`)
      return await decodeGrey(decodeImage, url)
    } catch (err) {
      app.warn(`zoning ${island}: ${f}: ${err.message} (the settlements go by density and value there)`)
      return null
    }
  }
  const [zoning, lud] = await Promise.all([read(files.zoning), read(files.lud)])
  return { zoning, lud, files }
}

/** A class raster's value at world (x, z) over a rect, nearest texel; 0 off it or without one. */
export function classAt(img, r, x, z) {
  if (!img) return 0
  const i = Math.floor(((x - r.x0) / (r.x1 - r.x0)) * img.W)
  const j = Math.floor(((z - r.z0) / (r.z1 - r.z0)) * img.H)
  if (i < 0 || j < 0 || i >= img.W || j >= img.H) return 0
  return img.px[j * img.W + i]
}

// --- the rules every scatter shares -------------------------------------------------

/**
 * The machinery both scatters share: the keyframes and the year's place on
 * them, the density at a point, the fill and the kind of a lot in a year,
 * where its building stands and the span of years it stands. A scatter sets
 * `crop` (the grid its bytes are on: x0, z0, sx, sz, w, h) and `bytes` (one
 * array per keyframe, and `values` too where a value mask exists), `kits`,
 * and `years()`'s breaks.
 */
export class Scatter {
  constructor(app) {
    this.app = app
    this.sites = 0
  }

  /** The keyframes, the codec, and each era's year on them, from layers/manifest.json. */
  setLayers(m) {
    const K = [...(m.keyframes || [])].filter((k) => Number.isFinite(k.year)).sort((a, b) => a.year - b.year)
    const enc = m.encoding?.settlement || {}
    const dMax = enc.dMax ?? 50000
    this.d0 = enc.d0 ?? 2
    this.L = Math.log(1 + dMax / this.d0)
    this.codec = settlementCodec(this.d0, dMax)
    this.keyframes = K
    const at = (id) => K.find((k) => k.id === id)?.year
    // (the year an era's settlement stands at, as the manifest maps it: LandOverlay.eraYear)
    this.eraYears = this.app.timeline.eras.map((era) => {
      const spec = m.eras?.[era.id]?.settlement
      if (spec?.keyframe && at(spec.keyframe) !== undefined) return at(spec.keyframe)
      if (spec?.from && at(spec.from) !== undefined && at(spec.to) !== undefined) return at(spec.from) + (at(spec.to) - at(spec.from)) * (spec.t ?? 0)
      return era.year
    })
    this.lut = new Float32Array(256 * 8 + 1)
    for (let k = 0; k <= 256 * 8; k++) this.lut[k] = this.d0 * (Math.exp((k / 8 / 255) * this.L) - 1)
  }

  /** Each keyframe's settlement file and value file (or null) for an island's entry. */
  layerFiles(entry) {
    return this.keyframes.map((k) => ({ settlement: entry.layers?.[k.id]?.settlement?.file || null, value: entry.layers?.[k.id]?.value?.file || null }))
  }

  /** The keyframe position (0 the first keyframe, 1 the second, …) of a timeline year, as LandOverlay.position. */
  kpAt(year) {
    const tl = this.app.timeline
    const Yr = this.eraYears
    const K = this.keyframes
    let ly = year
    if (Yr.length > 1) {
      const v = clamp(tl.sAtYear(year), 0, Yr.length - 1)
      const i = Math.min(Yr.length - 2, Math.floor(v))
      ly = Yr[i] + (Yr[i + 1] - Yr[i]) * (v - i)
    }
    if (ly <= K[0].year) return 0
    for (let i = 0; i + 1 < K.length; i++) if (ly <= K[i + 1].year) return i + (ly - K[i].year) / (K[i + 1].year - K[i].year)
    return K.length - 1
  }

  /** Bilinear over the crop at world (x, z), each of `arrays` into `out`, with `noise` added where it is above half a byte. */
  sample(arrays, x, z, out, noise) {
    const c = this.crop
    const fx = clamp((x - c.x0) / c.sx - 0.5, 0, c.w - 1.001)
    const fz = clamp((z - c.z0) / c.sz - 0.5, 0, c.h - 1.001)
    const i = fx | 0
    const j = fz | 0
    const tx = fx - i
    const tz = fz - j
    const q = j * c.w + i
    for (let k = 0; k < arrays.length; k++) {
      const b = arrays[k]
      const top = b[q] + (b[q + 1] - b[q]) * tx
      const bot = b[q + c.w] + (b[q + c.w + 1] - b[q + c.w]) * tx
      const v = top + (bot - top) * tz
      out[k] = v > 0.5 ? v + noise : 0
    }
    return out
  }

  /** The density bytes at world (x, z) for each keyframe, into `out`: bilinear, with a stable noise over the coarse texels (hamlets and gaps, not an even scatter). */
  bytesAt(x, z, out) {
    const n = (vnoise(x / 1.7, z / 1.7, 71) - 0.5) * 26 + (vnoise(x / 0.55, z / 0.55, 72) - 0.5) * 12
    return this.sample(this.bytes, x, z, out, n)
  }

  /** People per km² from a (fractional) byte. */
  people(v) {
    if (v <= 0) return 0
    if (v < 256) return this.lut[Math.round(v * 8)]
    return this.d0 * (Math.exp((v / 255) * this.L) - 1)
  }

  /**
   * The Māhele keyframe spreads each island's people of 1853 by the kuleana
   * parcels and the contact weights alone (methods.mahele.settlement.rule),
   * with no town: Honolulu, which by then held most of Oʻahu's people (Ellis
   * already gives the town of the 1820s six or seven thousand), comes out as
   * thin as the countryside, and Lahaina, Hilo and Kailua with it. A keyframe
   * after TOWN_FROM with no towns of its own therefore borrows the towns of
   * the next keyframe that has them (the end of the kingdom: their centre,
   * spread and share, the bake's own assumption) and puts their people into
   * the same soft discs, taking them from the layer's spread. `rule` says how
   * many: 'island' gives each town its share of the island's figure (as the
   * district has always done: Oʻahu's 1853 census puts 11,455 of its 19,126
   * in Honolulu); 'district' its share of its census district's, the
   * district's part of the island taken as the later keyframe's (the bake's
   * shares are of districts, and a whole island's would put two thirds of
   * Maui in its three towns). These are this file's assumptions, as the
   * bake's are for 1896; a historian with Schmitt (RESEARCH.md §9) could set
   * them. Only the texels within four spreads of a town are touched.
   */
  townTerm(m, island, rule = 'island') {
    const K = this.keyframes
    const proj = this.app.data.proj
    const c = this.crop
    const islandRect = this.islandRect
    this.townTerms = []
    K.forEach((kf, k) => {
      const own = m.methods?.[kf.id]?.settlement
      if (kf.year < TOWN_FROM || !own || own.towns?.length) return
      const later = K.slice(k + 1).find((q) => m.methods?.[q.id]?.settlement?.towns?.length)
      const people = own.populations?.[island]
      if (!later || !Number.isFinite(people)) return
      const lm = m.methods[later.id].settlement
      const towns = lm.towns
        .map((t) => ({ ...t, xz: proj.toWorld([t.lon, t.lat]) }))
        .filter((t) => t.xz[0] > islandRect.x0 && t.xz[0] < islandRect.x1 && t.xz[1] > islandRect.z0 && t.xz[1] < islandRect.z1 && (t.share || 0) > 0)
      if (!towns.length) return
      // each town's people, and what the spread gives up for them
      const laterPeople = m.islands?.[island]?.layers?.[later.id]?.settlement?.stats?.people
      for (const t of towns) {
        let frac = 1
        if (rule === 'district') {
          const dist = (lm.districts || []).find((d) => d.name === t.district)
          frac = dist && laterPeople ? clamp(dist.pop / laterPeople, 0.05, 1) : 0.25
        }
        t.people = people * (t.share || 0) * frac
      }
      const share = Math.min(0.9, towns.reduce((s, t) => s + t.people, 0) / people)
      const b = Float32Array.from(this.bytes[k])
      // (the spread, less the towns' share, everywhere; then each disc added where it reaches)
      const lift = new Float32Array(c.w * c.h)
      for (const t of towns) {
        const s = (t.sigma || 1500) / 1000 // km
        const R = (4 * s * 1000) / 100 // world units
        const i0 = clamp(Math.floor((t.xz[0] - R - c.x0) / c.sx), 0, c.w - 1)
        const i1 = clamp(Math.ceil((t.xz[0] + R - c.x0) / c.sx), 0, c.w - 1)
        const j0 = clamp(Math.floor((t.xz[1] - R - c.z0) / c.sz), 0, c.h - 1)
        const j1 = clamp(Math.ceil((t.xz[1] + R - c.z0) / c.sz), 0, c.h - 1)
        const peak = t.people / (2 * Math.PI * s * s)
        for (let j = j0; j <= j1; j++) {
          for (let i = i0; i <= i1; i++) {
            const x = c.x0 + (i + 0.5) * c.sx
            const z = c.z0 + (j + 0.5) * c.sz
            const r2 = ((x - t.xz[0]) ** 2 + (z - t.xz[1]) ** 2) / 100 // km²
            lift[j * c.w + i] += peak * Math.exp(-r2 / (2 * s * s))
          }
        }
      }
      for (let q = 0; q < b.length; q++) {
        if (b[q] <= 0 && lift[q] <= 0) continue
        // (the layer is 0 over the sea: a disc never reaches out over it)
        if (b[q] <= 0) continue
        const d = this.codec.decode(b[q]) * (1 - share) + lift[q]
        b[q] = (255 * Math.log(1 + Math.max(0, d) / this.d0)) / this.L
      }
      this.bytes[k] = b
      this.townTerms.push({ keyframe: kf.id, from: later.id, towns: towns.map((t) => t.name), people: Math.round(people * share) })
    })
  }

  /**
   * The sampled years, from the timeline's first to its last, with `breaks`
   * (the dates where the ground or a feature changes) among them, and per
   * sample the keyframes either side, the thinning before 1450 and the eras'
   * weights. Sets Ys, isBreak, samples, edges (the breaks in order) and
   * epochAt (each sample's stretch between breaks).
   */
  years(breaks) {
    const tl = this.app.timeline
    const y0 = tl.yearAt(0)
    const y1 = tl.yearAt(tl.max)
    const br = new Set([...breaks].filter((y) => y > y0 && y <= y1))
    const contact = this.keyframes[0].year
    const ys = new Set([y0, ...PRE.filter((y) => y > y0 && y < contact), ...br])
    for (let y = contact; y <= y1; y += STEP) ys.add(y)
    ys.add(y1)
    this.Ys = [...ys].filter((y) => y >= y0 && y <= y1).sort((a, b) => a - b)
    this.isBreak = this.Ys.map((y) => br.has(y))
    this.edges = [...br].sort((a, b) => a - b)
    this.epochAt = this.Ys.map((y) => this.epochOfYear(y))
    this.samples = this.Ys.map((y) => {
      const kp = this.kpAt(y)
      const a = Math.min(this.keyframes.length - 2, Math.floor(kp))
      // (each era's weight, eased over twenty years about its turn)
      const turns = [1820, 1860, 1900, 1960].map((t) => smooth(t - 10, t + 10, y))
      const w = [1 - turns[0], turns[0] - turns[1], turns[1] - turns[2], turns[2] - turns[3], turns[3]]
      return { y, a, t: kp - a, early: 25.5 * (1 - smooth(EARLY[0], EARLY[1], y)), w }
    })
  }

  /** The stretch between breaks a year falls in. */
  epochOfYear(y) {
    const E = this.edges
    let e = 0
    while (e < E.length && y >= E[e]) e++
    return e
  }

  /**
   * The share of lots built at a density in a sample's year (before the
   * ground's weight), and the kauhale's own. Before the town a kauhale stands
   * for a few households (about eight people), on a yard of four lots. After
   * it, a house for every household or two at the scale the buildings are
   * drawn (PROP people per km² would build every lot), so a hamlet of a few
   * dozen people and a country town of a thousand read as what they are; and
   * where the town is dense the share rises faster than the density, so a
   * town reads as a town and its outskirts as scattered houses (the layer's
   * towns are soft discs kilometres across, and a fill in proportion alone
   * would spread one even suburb over the plain).
   */
  fill(s, d) {
    const fk = Math.min(1 / 12, d / (8 * LOTS_PER_KM2))
    const w = s.w
    const p = d / PROP
    let f = 0
    if (w[1]) f += w[1] * Math.min(0.8, Math.max(p, 0.8 * (d / 700) ** 2))
    if (w[2]) f += w[2] * Math.min(0.9, Math.max(p, 0.9 * (d / 1300) ** 2.5))
    if (w[3]) f += w[3] * Math.min(0.9, Math.max(p, 0.9 * (d / 2500) ** 1.5))
    if (w[4]) f += w[4] * (d < 6000 ? Math.min(0.85, Math.max(p, 0.85 * (d / 6000) ** 1.2)) : 0.85 - 0.45 * smooth(6000, 15000, d))
    return [f, fk]
  }

  /** The most a lot could fill at a density, in any era (for the lots that never could). */
  fillMax(d) {
    return Math.max(4 * Math.min(1 / 12, d / (8 * LOTS_PER_KM2)), Math.min(0.9, d / PROP), Math.min(0.8, 0.8 * (d / 700) ** 2), Math.min(0.9, 0.9 * (d / 1300) ** 2.5), Math.min(0.9, 0.9 * (d / 2500) ** 1.5), Math.min(0.85, 0.85 * (d / 6000) ** 1.2))
  }

  /**
   * A lot's value in a year (0..1): what a house there is worth, which sets
   * the finer kinds against the humbler. From the value mask where the layers
   * carry one (`l.vb`, its bytes per keyframe, eased between them as the
   * density is); otherwise modelled: the density (from a few dozen people
   * per km² to ten thousand), nearness to the coast (within about 600 m), to
   * a harbour (within about 1.5 km) and to a town's core (within its spread),
   * the years (money came with the trade, the plantations and the visitors),
   * and a lot's own fortune.
   */
  valueAt(l, s, d) {
    if (l.vb) return clamp((l.vb[s.a] + (l.vb[s.a + 1] - l.vb[s.a]) * s.t) / 255, 0, 1)
    const dn = smooth(1.5, 4.0, Math.log10(Math.max(1, d)))
    const era = smooth(1800, 2000, s.y)
    return clamp(0.34 * dn + 0.14 * l.coast + 0.16 * l.harbour + 0.22 * l.centre + 0.1 * era + 0.24 * (l.r8 - 0.5), 0, 1)
  }

  /**
   * What stands on a lot in year y at density d and value v: a kind, by the
   * era (each lot moving on at its own time, after the era's turn and never
   * before it, the densest first), by the density, by the value within the
   * era, and after 1960 by the zoning where there is any. `K`: the lot holds
   * its yard's kauhale. Returns -1 where the zoning or the Land Use District
   * of the year allows nothing.
   */
  kindAt(y, d, v, l, K) {
    const dn = clamp(Math.log10(Math.max(1, d) / 300), -1, 1)
    const t = y - l.lag * (1 - 0.6 * Math.max(0, dn))
    if (y < 1818 || t < 1820) return K ? KIND.kauhale : KIND.hale
    // (the finer share of an era's kinds, from the value)
    const fine = smooth(0.35, 0.8, v)
    if (t < 1860) {
      // thatch against frame against coral block and adobe
      const thatch = (1 - smooth(1820, 1880, t + 12 * dn)) * (1.15 - 0.6 * fine)
      if (l.r2 < thatch) return KIND.hale
      return l.r3 < 0.15 + 0.5 * fine ? KIND.adobe : KIND.frame
    }
    if (t < 1900) {
      // (masonry where the town of the end of the kingdom is densest, the
      // layer's town a soft disc about 1,300 people per km² at its heart, or
      // where its lots are worth most; stores along the streets of value)
      if ((d > 1150 && l.r3 < 0.3) || (d > 450 && l.r3 < 0.42 * smooth(0.6, 0.9, v))) return KIND.block
      if ((d > 700 && l.r3 < 0.55) || (d > 250 && l.r3 < 0.6 * smooth(0.5, 0.8, v))) return KIND.store
      const thatch = (1 - smooth(1820, 1880, t + 12 * dn)) * (1.2 - 0.8 * fine)
      if (l.r2 < thatch) return KIND.hale
      return l.r4 < 0.2 ? KIND.frame : KIND.cottage
    }
    if (t < 1960) {
      if ((d > 4000 && l.r3 < 0.5) || (d > 2000 && l.r3 < 0.45 * smooth(0.65, 0.95, v))) return KIND.midrise
      if ((d > 1800 && l.r3 < 0.6) || (d > 700 && l.r3 < 0.5 * smooth(0.55, 0.85, v))) return KIND.block
      if (((d > 900 && l.r3 < 0.4) || (d > 400 && l.r3 < 0.4 * smooth(0.5, 0.8, v))) && t < 1935) return KIND.store
      return KIND.bungalow
    }
    // now: the zoning of the lot where there is any (and the Land Use District from 1964)
    const z = l.zone
    if (y >= LUD_FROM && l.lud === LUD.conservation) return -1
    if (z) return this.zoneKind(z, t, d, v, l)
    if (y >= LUD_FROM && l.lud === LUD.agricultural) return l.r3 < 0.4 ? KIND.shed : KIND.house
    if (y >= LUD_FROM && l.lud === LUD.rural) return KIND.house
    // (towers where the census is densest, Waikīkī's and downtown's, and on
    // the old downtown's lots (see scatterLot), and where the lots are worth
    // most; walk-ups and houses between. On an island with zoning, a lot it
    // gives no class to (a road, a stream's banks) raises no tower.)
    const tower = l.zoned ? KIND.walkup : KIND.tower
    if (l.core) return tower
    if (d > 20000) return l.r3 < 0.85 ? tower : KIND.walkup
    if (d > 10000) return l.r3 < 0.2 + 0.5 * smooth(10000, 20000, d) + 0.2 * fine ? tower : KIND.walkup
    if (d > 4000) return l.r3 < 0.45 + 0.2 * fine ? (l.r5 < 0.25 * smooth(0.7, 0.95, v) ? tower : KIND.walkup) : KIND.house
    if (d > 2500 && l.r3 < 0.2 + 0.15 * fine) return KIND.walkup
    if (l.r4 < 0.35 && t < 1990) return KIND.bungalow
    return KIND.house
  }

  /**
   * The modern era's kind on a lot in zoning class z (DATA.md: towers only in
   * classes 3, 5 and 7). The density here is the people who live there (the
   * census), so a country town's downtown stays low (Lahaina's Front Street,
   * Hilo's) and a city's goes up; the value picks the finer within each.
   */
  zoneKind(z, t, d, v, l) {
    const fine = smooth(0.35, 0.8, v)
    switch (z) {
      case ZONE.houses:
        return l.r4 < 0.35 && t < 1990 ? KIND.bungalow : KIND.house
      case ZONE.lowrise:
        return l.r3 < 0.55 + 0.35 * fine ? KIND.walkup : KIND.house
      case ZONE.highrise:
        return l.r3 < 0.3 + 0.45 * smooth(4000, 20000, d) + 0.2 * fine ? KIND.tower : KIND.walkup
      case ZONE.commercial:
        if (d > 4000 && l.r3 < 0.25 + 0.45 * fine) return KIND.midrise
        return d < 2000 && l.r4 < 0.35 - 0.25 * fine ? KIND.store : KIND.block
      case ZONE.downtown:
        if (l.core || (d > 6000 && l.r3 < 0.25 + 0.5 * smooth(6000, 15000, d) + 0.2 * fine)) return KIND.tower
        if (d > 5000 && l.r4 < 0.3 + 0.4 * fine) return KIND.midrise
        // (a country town's main street: masonry, and the old false fronts among it)
        return d < 5000 && l.r4 < 0.55 - 0.3 * fine ? KIND.store : KIND.block
      case ZONE.industrial:
      case ZONE.military:
        return KIND.shed
      case ZONE.resort:
        // (the hotels along the strip: towers where the lots are worth most
        // or the people are many, the low-rise behind)
        return l.r3 < 0.15 + 0.45 * smooth(0.5, 0.9, v) + 0.35 * smooth(4000, 15000, d) ? KIND.tower : KIND.walkup
      case ZONE.agricultural:
        return KIND.shed
      case ZONE.institutional:
        return d > 3000 && l.r3 < 0.3 * fine ? KIND.midrise : KIND.block
      case ZONE.conservation:
      case ZONE.parks:
        return -1
      default:
        return KIND.house
    }
  }

  /** Which variant of a kind a lot draws (the resort strip's towers are its hotel slabs). */
  variantOf(l, kind, nv) {
    if (kind === KIND.tower && l.zone === ZONE.resort && l.r6 < 0.75) return 0
    return Math.min(nv - 1, Math.floor(ihash(l.tile, kind, Math.floor(l.rank * 1e6)) * nv))
  }

  /** A tower's height (metres) at a density: 35 m, to 150 m where it is densest. */
  towerHeight(d) {
    return 35 + 115 * smooth(4.0, 4.7, Math.log10(Math.max(1, d)))
  }

  /** A lot's density in a sample, as a byte: the people who live there. */
  byteAt(l, s) {
    return l.b[s.a] + (l.b[s.a + 1] - l.b[s.a]) * s.t - s.early
  }

  /** The byte the fill reads: byte v, or after 1960 the zoning's floor of the people who work there, if more. */
  fillByte(l, s, v) {
    const floor = l.zone && s.w[4] > 0 && s.y >= ZONING_FROM ? ZONE_FLOOR[l.zone] : 0
    if (!floor) return v
    const fb = (255 * Math.log(1 + floor / this.d0)) / this.L + 10 * (l.r6 - 0.5)
    return fb > v ? v + (fb - v) * s.w[4] : v
  }

  /**
   * One lot through the years: for each sample, whether a building stands on
   * it and of which kind, and runs of one kind into instances (`emit`).
   * `allows(pose, relief, epoch)` says whether a footprint may stand and on
   * how high a ground (null if not); `cap(n)` thins a sample to its budget.
   * A yard's kauhale keeps its other three lots empty while it stands
   * (`l.yard`, written by the yard's own lot, which comes first).
   */
  scatterLot(l, allows, cap, emit) {
    const NS = this.Ys.length
    const S_ = this.samples
    const cache = new Map()
    let run = null
    const out = (end) => {
      const r = this.instance(l, run, end)
      if (Array.isArray(r)) for (const q of r) emit(q)
      else emit(r)
      run = null
    }
    // A lot that carried downtown's mid-rise before the war goes up to an
    // office tower after 1960, whatever the census there: the layer of now
    // counts where people live, and the business district, where few do,
    // would otherwise come out emptier than the 1930s left it (where the
    // zoning says otherwise, the zoning has it).
    l.core = false
    if (l.anchor) l.yard = new Uint8Array(NS)
    for (let n = 0; n < NS; n++) {
      const s = S_[n]
      let state = null
      let v = this.byteAt(l, s)
      const core = l.core && s.y >= 1960 && (l.zoned ? l.zone === ZONE.downtown || l.zone === ZONE.highrise : true)
      if (core) v = Math.max(v, CORE_BYTE + 14 * l.r6)
      const vf = this.fillByte(l, s, v)
      const held = l.host?.yard?.[n]
      if (vf > 0 && !held) {
        const d = this.people(v)
        const [F, fk] = this.fill(s, this.people(vf))
        const c = cap(n)
        // (a yard's kauhale, on its own dither: four lots, so four times the share)
        const K = !!l.anchor && l.rankY < 4 * fk * l.w * c
        const val = this.valueAt(l, s, d)
        let kind = -1
        if (core || l.rank < F * l.w * c || K) kind = this.kindAt(s.y, d, val, l, K)
        // (a kauhale only on its yard's lot; a lot that filled by its yard's dither alone stands empty once the kauhale has gone)
        if (kind === KIND.kauhale && !K) kind = KIND.hale
        if (kind >= 0 && kind !== KIND.kauhale && !(core || l.rank < F * l.w * c)) kind = -1
        if (kind >= 0) {
          const nv = kind === KIND.kauhale ? KAUHALE.length : this.kits[KIND_NAMES[kind]].length
          const variant = this.variantOf(l, kind, nv)
          const e = this.epochAt[n]
          const key = kind * 16 + variant
          // (an answer that no epoch changes is kept for all of them)
          let top = cache.get(key * 256 + 255)
          if (top === undefined) top = cache.get(key * 256 + e)
          if (top === undefined) {
            const p = this.pose(l, kind, variant)
            const relief = KINDS[KIND_NAMES[kind]].relief
            let dep = false
            if (p.parts) {
              // (each hale of a kauhale on its own ground)
              top = []
              for (const q of p.parts) {
                const t = allows(q, relief, e)
                dep ||= this.dep
                if (t === null) {
                  top = null
                  break
                }
                top.push(t)
              }
            } else {
              top = allows(p, relief, e)
              dep = this.dep
            }
            cache.set(key * 256 + (dep ? e : 255), top)
          }
          if (top !== null) {
            state = { key, kind, variant, top, d }
            if (kind === KIND.kauhale) l.yard[n] = 1
          }
          if (state && kind === KIND.midrise && s.y <= CORE_UNTIL) l.core = true
        }
      }
      if (run && state && state.key === run.key) {
        run.d = Math.max(run.d, state.d)
        continue
      }
      if (run) out(n)
      if (state) run = { ...state, n0: n }
    }
    if (run) out(NS)
  }

  /**
   * How much a kind's model must shrink to keep within its lot with a gap
   * all round (or, for a kauhale, its yard of four), turned by the most its
   * kind turns off the grid and moved by the most it moves: 1 for nearly
   * every model (buildings.js sizes them to their lots).
   */
  fitOf(kind, variant) {
    const key = kind * 16 + variant
    this.fits ??= new Map()
    let f = this.fits.get(key)
    if (f !== undefined) return f
    const name = KIND_NAMES[kind]
    const kd = KINDS[name]
    if (LANDMARK.has(name)) f = 1
    else if (kd.loose) {
      // the yard's hale, turned with the yard by up to 0.2 either way
      let ux = 0
      let uz = 0
      for (const [ox, oz, rot, size] of KAUHALE[variant]) {
        const kit = this.kits[name][size]
        for (const a of [-0.2, 0.2]) {
          const c = Math.cos(rot + a)
          const s = Math.sin(rot + a)
          const ca = Math.cos(a)
          const sa = Math.sin(a)
          const cx = ox * ca + oz * sa
          const cz = -ox * sa + oz * ca
          ux = Math.max(ux, Math.abs(cx) + Math.abs(kit.hx * c) + Math.abs(kit.hz * s))
          uz = Math.max(uz, Math.abs(cz) + Math.abs(kit.hx * s) + Math.abs(kit.hz * c))
        }
      }
      f = Math.min(1, (LU - GAP) / (ux * kd.sh), (LV - GAP) / (uz * kd.sh))
    } else {
      const kit = this.kits[name][variant]
      const [x0, x1, z0, z1] = kit.box
      const j = (kd.jitter || 0) / 2
      const c = Math.cos(j)
      const s = Math.sin(j)
      const hx = Math.max(-x0, x1) * c + Math.max(-z0, z1) * s
      const back = -z0 * c + Math.max(-x0, x1) * s
      const front = z1 * c + Math.max(-x0, x1) * s
      const m = kd.jitter ? 0.03 : 0
      f = Math.min(1, (LU / 2 - GAP - m) / (hx * kd.sh), (LV / 2 - GAP - m) / (back * kd.sh), (FRONT - m) / (front * kd.sh))
    }
    this.fits.set(key, f)
    return f
  }

  /**
   * Where a kind stands on a lot: its centre, turn, half extents (world
   * units) and scale; for a kauhale, each of its hale (`parts`, each with its
   * size), round the middle of its yard.
   */
  pose(l, kind, variant) {
    const name = KIND_NAMES[kind]
    const kd = KINDS[name]
    const f = this.fitOf(kind, variant)
    let x = l.x
    let z = l.z
    let a = l.face
    if (kd.loose) {
      // a kauhale keeps to its yard (the four lots from its own: half a lot
      // along the street, half a lot mauka), its own way round
      const sh = kd.sh * f
      x = l.x + (LU / 2) * l.e[0] + (LV / 2) * l.m[0]
      z = l.z + (LU / 2) * l.e[1] + (LV / 2) * l.m[1]
      a = Math.atan2(l.e[0], l.e[1]) - Math.PI / 2 + (l.r7 - 0.5) * 0.4 + (l.r5 < 0.5 ? 0 : Math.PI)
      const c = Math.cos(a)
      const s = Math.sin(a)
      const parts = KAUHALE[variant].map(([ox, oz, rot, size]) => {
        const kit = this.kits[name][size]
        // (as THREE turns about y: local x to (cos, −sin), local z to (sin, cos))
        return { x: x + (ox * c + oz * s) * sh, z: z + (-ox * s + oz * c) * sh, a: a + rot, size, ax: kit.hx * sh, az: kit.hz * sh, f }
      })
      return { x, z, a, parts, f }
    }
    const kit = this.kits[name][variant]
    if (kd.jitter) {
      // the early town: lots taken up before the grid was ruled
      a += (l.r5 - 0.5) * kd.jitter
      x += (l.r6 - 0.5) * 0.06
      z += (l.r7 - 0.5) * 0.06
    }
    // (a kind paved to its lot's edges asks the ground under all its paving,
    // so no slope pokes up through the paving's edge)
    const pad = PADS[name]
    const ax = pad ? Math.max(kit.hx * kd.sh * f, LU / 2 - GAP) : kit.hx * kd.sh * f
    const az = pad ? Math.max(kit.hz * kd.sh * f, LV / 2 - GAP) : kit.hz * kd.sh * f
    return { x, z, a, ax, az, f }
  }

  /**
   * One instance: a run of samples with one kind on one lot, and the span of
   * years it fades over (a kauhale: one for each of its hale, sharing it).
   */
  instance(l, run, end) {
    const Ys = this.Ys
    const NS = Ys.length
    const name = KIND_NAMES[run.kind]
    const kd = KINDS[name]
    const p = l.landmark ? { x: l.x, z: l.z, a: l.face, f: 1 } : this.pose(l, run.kind, run.variant)
    const span = new Float32Array(4)
    // A soft change between samples n − 1 and n falls at the lot's own
    // moment between them, the same for what goes and what comes, over the
    // same window (inside the two samples where they allow it): so the fade
    // in and the fade out it replaces are one curve, and the shader dithers
    // them over complementary pixels (kit.js), never both on one.
    const soft = (n) => {
      const a = Ys[n - 1]
      const b = Ys[n]
      const h = Math.min(SOFT, (b - a) / 2)
      const t = a + h + ihash(l.tile ?? 0, n, Math.floor((l.rank ?? 0) * 1e6)) * (b - a - 2 * h)
      return [t - h, t + h]
    }
    if (run.n0 === 0) {
      span[0] = -NEVER
      span[1] = -NEVER + 1
    } else if (this.isBreak[run.n0] || l.landmark) {
      span[0] = Ys[run.n0]
      span[1] = Ys[run.n0] + HARD
    } else [span[0], span[1]] = soft(run.n0)
    if (end >= NS) {
      span[2] = NEVER
      span[3] = NEVER + 1
    } else if (this.isBreak[end]) {
      span[2] = Ys[end] - HARD
      span[3] = Ys[end] - 0.01
    } else [span[2], span[3]] = soft(end)
    const stretch = name === 'tower' ? this.towerHeight(run.d) / TOWER_H : 1
    const jit = 0.94 + 0.12 * (l.r5 ?? 0.5)
    const one = (q, variant, top) => {
      const kit = this.kits[name][variant]
      const f = q.f ?? p.f ?? 1
      return {
        kind: run.kind,
        variant,
        site: this.sites,
        x: q.x,
        z: q.z,
        a: q.a,
        y: Y(top) + LIFT,
        sh: kd.sh * f,
        sv: kd.sv * f * stretch,
        stretch,
        span,
        colour: [jit * (0.98 + 0.04 * (l.r6 ?? 0.5)), jit, jit * (0.98 + 0.04 * (l.r7 ?? 0.5))],
        // (the ground it clears of trees: its footprint, a little in)
        rx: kit.hx * kd.sh * f * 0.95,
        rz: kit.hz * kd.sh * f * 0.95,
        landmark: !!l.landmark,
      }
    }
    this.sites++
    if (p.parts) return p.parts.map((q, k) => one(q, q.size, run.top[k]))
    return one(p, run.variant, run.top)
  }

  /**
   * The lots of one grid tile (x0, z0 its corner, GRID_TILE square), on the
   * grid of direction th (radians: the way mauka), in yard order (each
   * yard's own lot first). `pads` says which sides keep a margin from the
   * next tile (its grid turned another way): [west, east, north, south].
   * `keep(x, z)` refuses a lot before anything is asked of it; `seed` is the
   * tile's. Each lot comes with its hashes and its place on the grid.
   */
  tileLots(x0, z0, th, seed, pads, keep) {
    const m = [Math.cos(th), Math.sin(th)]
    const e = [-m[1], m[0]]
    let umin = Infinity
    let umax = -Infinity
    let vmin = Infinity
    let vmax = -Infinity
    for (const [cx, cz] of [[x0, z0], [x0 + GRID_TILE, z0], [x0, z0 + GRID_TILE], [x0 + GRID_TILE, z0 + GRID_TILE]]) {
      const u = cx * e[0] + cz * e[1]
      const v = cx * m[0] + cz * m[1]
      umin = Math.min(umin, u)
      umax = Math.max(umax, u)
      vmin = Math.min(vmin, v)
      vmax = Math.max(vmax, v)
    }
    // (a lot near an edge where the next tile's grid turns another way keeps
    // back far enough that no building of either reaches the other's)
    const P = 0.42
    const ok = (x, z) => x >= x0 && x < x0 + GRID_TILE && z >= z0 && z < z0 + GRID_TILE && !((pads[0] && x < x0 + P) || (pads[1] && x >= x0 + GRID_TILE - P) || (pads[2] && z < z0 + P) || (pads[3] && z >= z0 + GRID_TILE - P))
    const out = []
    for (let bv = Math.floor(vmin / BV) - 1; bv <= Math.ceil(vmax / BV); bv++) {
      for (let bu = Math.floor(umin / BU) - 1; bu <= Math.ceil(umax / BU); bu++) {
        for (let yu = 0; yu < 2; yu++) {
          // a yard: lots (2yu, 0), its own, then (2yu + 1, 0), (2yu, 1), (2yu + 1, 1);
          // its kauhale may stand only if all four are this tile's to give
          const yard = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([du, iv]) => {
            const iu = 2 * yu + du
            const u = bu * BU + GU / 2 + (iu + 0.5) * LU
            const v = bv * BV + GV / 2 + (iv + 0.5) * LV
            const x = u * e[0] + v * m[0]
            const z = u * e[1] + v * m[1]
            return { iu, iv, u, v, x, z, ok: ok(x, z) && keep(x, z) }
          })
          const whole = yard.every((q) => q.ok)
          let host = null
          for (const q of yard) {
            if (!q.ok) continue
            const { iu, iv, u, v, x, z } = q
            const gu = bu * 4 + iu
            const gv = bv * 2 + iv
            const rank = (BAYER[gv & 7][gu & 7] + ihash(gu, gv, seed * 7 + 1)) / 64
            const h = (k) => ihash(gu, gv, seed * 7 + k)
            // the front to the lot's street: makai for the first row, mauka for the second
            const f = iv === 0 ? [-m[0], -m[1]] : m
            const l = { x, z, rank, face: Math.atan2(f[0], f[1]), tile: seed, bu, bv, u, v, e, m, lag: 25 * h(2), r2: h(3), r3: h(4), r4: h(5), r5: h(6), r6: h(7), r7: h(8), r8: h(9) }
            if (q === yard[0] && whole) {
              // (its own dither, over the yards)
              const ya = bu * 2 + yu
              l.anchor = true
              l.rankY = (YARD_BAYER[bv & 3][ya & 3] + ihash(ya, bv, seed * 7 + 11)) / 16
              host = l
            } else if (host) l.host = host
            out.push(l)
          }
        }
      }
    }
    return out
  }
}

// --- the ground the scatters stand on ------------------------------------------------

/**
 * An island pack's ground at world (x, z) in a year: its own heights, with
 * the patches of that year laid on them whole (render/patches.js apply, but
 * by the year asked rather than the one eased to on screen).
 */
export function islandMetres(app, t, x, z, year) {
  let h = t.metresAt(x, z)
  const list = app.patches?.byPack?.get(t.pack.id)
  if (!list) return h
  for (const r of list) {
    if (!(year < r.until)) continue
    const b = r.box
    const tx = (x - b[0]) / (b[2] - b[0])
    const tz = (z - b[1]) / (b[3] - b[1])
    if (tx < 0 || tz < 0 || tx > 1 || tz > 1) continue
    const w = app.patches.maskAt(r.crop, tx, tz)
    if (w > 0) h += ((r.kind === 'raise' ? Math.max(h, r.depthM) : Math.min(h, r.depthM)) - h) * w
  }
  return h
}

/**
 * The places that raise a lot's value (valueAt): the harbours (the
 * gazetteer's bays and the towns on the shore, as roadsteads) and the town
 * cores (the bake's towns of 1896 with their spread, and the gazetteer's
 * towns, a kilometre round), in world units.
 */
export function valuePlaces(app, m) {
  const proj = app.data.proj
  const places = app.data.places || []
  const cores = []
  const harbours = []
  const towns = Object.values(m.methods || {}).flatMap((q) => q?.settlement?.towns || [])
  for (const t of towns) {
    if (!Number.isFinite(t.lon) || !Number.isFinite(t.lat)) continue
    const [x, z] = proj.toWorld([t.lon, t.lat])
    cores.push({ x, z, s: (t.sigma || 1000) / 100 })
  }
  for (const p of places) {
    if (p.kind !== 'town' && p.kind !== 'bay') continue
    const pt = geometryPoint(p.geometry)
    if (!pt) continue
    const [x, z] = proj.toWorld(pt)
    if (p.kind === 'town') cores.push({ x, z, s: 8 })
    harbours.push({ x, z, town: p.kind === 'town' })
  }
  return { cores, harbours }
}

/** A lot's nearness to a town's core (0..1, its spread) and to a harbour (0..1, about 1.5 km). */
export function placeTerms(P, x, z, nearSea) {
  let centre = 0
  for (const c of P.cores) {
    const r2 = (x - c.x) ** 2 + (z - c.z) ** 2
    if (r2 > 16 * c.s * c.s) continue
    centre = Math.max(centre, Math.exp(-r2 / (2 * c.s * c.s)))
  }
  let harbour = 0
  for (const h of P.harbours) {
    const d = Math.hypot(x - h.x, z - h.z)
    if (d > 60) continue
    // (a town counts as a roadstead only where it is on the shore)
    harbour = Math.max(harbour, Math.exp(-d / 15) * (h.town ? nearSea : 1))
  }
  return { centre, harbour }
}

// --- the district's scatter ---------------------------------------------------------

// the district scatter's budget, and what is drawn at once
const MAX_PLACED = 8000
const MAX_DRAWN = 8000
const TILE = 3 // world units: the culling tiles
export const reachFor = (distance) => clamp(distance * 2.6, 40, 110)

// the streets, one ribbon batch per epoch, crossfading by the year
const STREET_EPOCHS = [1850, 1875, 1900, 1930, 1960, 2000]
const STREET_W = 0.1
const PAD_W = 1.0

export class Settlements extends Scatter {
  /**
   * rec: the resident district (render/district.js), read while its decode is
   * still whole; own: the district features' uniforms (index.js), which the
   * buildings share with the trees; ribbons: theirs too, for the streets.
   */
  constructor(app, districts, rec, own, ribbons) {
    super(app)
    this.districts = districts
    this.rec = rec
    this.own = own
    this.ribbons = ribbons
    this.group = new THREE.Group()
    this.group.name = 'settlements'
    this.group.visible = false
    this.ready = false
    this.failed = null
    this.yearNow = app.timeline.year
    own.uYearNow.value = this.yearNow
    this.drawn = 0
    // what the decode holds now and lets go of once the features are built
    // (index.js runs this inside render/district.js arrive()): the streams'
    // lines, for the distance to them
    this.streamLines = rec.data.streams
    this.load().catch((err) => {
      this.failed = err.message
      app.warn(`settlements: ${err.message} (the scatter is not drawn)`)
    })
  }

  // --- the density ------------------------------------------------------------------

  /** The layers' manifest and the parent island's settlement masks (and value and zoning, where there are any), cut to the district; then everything else. */
  async load() {
    const t0 = performance.now()
    const data = this.app.data
    const res = await fetch(data.abs('layers/manifest.json'))
    if (!res.ok) throw new Error(`layers/manifest.json: HTTP ${res.status}`)
    const m = await res.json()
    const d = this.rec.d
    const entry = m.islands?.[d.parent]
    const pack = this.app.world.islandPacks.find((p) => p.id === d.parent)
    if (!entry || !pack) throw new Error(`no settlement layer for ${d.parent}`)
    this.setLayers(m)
    const files = this.layerFiles(entry)
    if (this.keyframes.length < 2 || files.some((f) => !f.settlement)) throw new Error('the settlement layer lacks a keyframe')
    const grey = (f) => decodeGrey(decodeImage, data.abs(`layers/${f}`))
    const [imgs, vals, zoning] = await Promise.all([
      Promise.all(files.map((f) => grey(f.settlement))),
      files.every((f) => f.value) ? Promise.all(files.map((f) => grey(f.value))).catch(() => null) : null,
      loadZoning(this.app, m, d.parent),
    ])
    for (const [k, img] of [...imgs, ...(vals || [])].entries()) if (img.W !== pack.W || img.H !== pack.H) throw new Error(`a layer of ${d.parent} is ${img.W}×${img.H} (${k}), the pack ${pack.W}×${pack.H}`)
    // the district's box on the island's grid, a texel or two beyond it
    const r = pack.rect
    const dr = d.rect
    const sx = (r.x1 - r.x0) / pack.W
    const sz = (r.z1 - r.z0) / pack.H
    const i0 = clamp(Math.floor((dr.x0 - r.x0) / sx) - 2, 0, pack.W - 1)
    const i1 = clamp(Math.ceil((dr.x1 - r.x0) / sx) + 2, 0, pack.W - 1)
    const j0 = clamp(Math.floor((dr.z0 - r.z0) / sz) - 2, 0, pack.H - 1)
    const j1 = clamp(Math.ceil((dr.z1 - r.z0) / sz) + 2, 0, pack.H - 1)
    const cw = i1 - i0 + 1
    const ch = j1 - j0 + 1
    this.crop = { x0: r.x0 + i0 * sx, z0: r.z0 + j0 * sz, sx, sz, w: cw, h: ch }
    this.islandRect = r
    const cut = (img) => {
      const out = new Float32Array(cw * ch)
      for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) out[j * cw + i] = img.px[(j0 + j) * pack.W + i0 + i]
      return out
    }
    this.bytes = imgs.map(cut)
    this.values = vals ? vals.map(cut) : null
    this.zoning = { ...zoning, rect: r }
    this.places = valuePlaces(this.app, m)
    this.townTerm(m, d.parent, 'island')
    this.loadMs = Math.round(performance.now() - t0)
    // the rest, a second or two of work in all, in slices a frame apart
    const t1 = performance.now()
    if (!(await this.build())) return
    this.buildMs = Math.round(performance.now() - t1)
    this.ready = true
  }

  /** Let a frame through if this slice has run long; false once the district has been let go. */
  async breathe(force = false) {
    if (force || performance.now() - this.slice > 24) {
      await new Promise((r) => setTimeout(r, 0))
      this.slice = performance.now()
    }
    return !this.disposed
  }

  // --- the ground of a year ----------------------------------------------------------

  /** The patches' weights in a year: each raise's and each lower group's, as Districts.yearWeights settles them. */
  patchState(year) {
    const rec = this.rec
    const raise = rec.raise.map((p) => ({ k: year < p.until ? 1 : 0, depth: p.depth }))
    const groups = rec.pmap?.groups || [0]
    const gk = new Float32Array(16)
    const gd = new Float32Array(16).fill(-1)
    for (let g = 0; g < groups.length; g++) {
      const bits = groups[g] || 0
      let first = -1
      rec.lower.forEach((p, i) => {
        if (!(bits & (1 << i))) return
        if (first < 0) first = i
        if (year < p.until && gk[g] < 1) {
          gk[g] = 1
          gd[g] = p.depth
        }
      })
      if (!gk[g] && first >= 0) gd[g] = rec.lower[first].depth
    }
    return { raise, gk, gd }
  }

  /** One texel's ground in a patch state: Districts.texel without the features. */
  groundAt(i, j, st) {
    const rec = this.rec
    const W = rec.d.W
    const c = j * W + i
    let h = rec.metres[c]
    const q = this.districts.patchAt(i, j)
    if (q && q[1] + q[3] > 0) {
      const ra = st.raise[q[2] & 15]
      const rb = st.raise[q[2] >> 4]
      if (ra) h += (Math.max(h, ra.depth) - h) * (q[1] / 255) * ra.k
      if (rb) h += (Math.max(h, rb.depth) - h) * (q[3] / 255) * rb.k
    }
    const r = rec.aux[c * 4]
    if (r) {
      const g = q ? q[0] : 0
      h = patchLevel(h, r, st.gk[g], fromHalf(rec.carve[c * 2]), st.gd[g])
    }
    return h
  }

  texelOf(x, z) {
    const d = this.rec.d
    const r = d.rect
    return [clamp(Math.floor(((x - r.x0) / (r.x1 - r.x0)) * d.W), 0, d.W - 1), clamp(Math.floor(((z - r.z0) / (r.z1 - r.z0)) * d.H), 0, d.H - 1)]
  }

  /** How far (x, z) is inside the district's edge (world units). */
  edgeAt(x, z) {
    const r = this.rec.d.rect
    return Math.min(x - r.x0, r.x1 - x, z - r.z0, r.z1 - z)
  }

  /**
   * Whether a footprint (centre x, z; half extents ax, az along its own axes;
   * turned by a) may stand in epoch `e` (the ground and the features as that
   * stretch of years has them), and the highest ground under it. `this.dep`
   * says afterwards whether the answer could differ in another epoch. Toward
   * the district's edge its ground eases into the island's (DISTRICT.margin),
   * and the footing stands on the higher of the two as they are drawn there,
   * so nothing there is sunk into the island's slope.
   */
  allows(x, z, ax, az, a, relief, e) {
    const ep = this.epochs[e]
    const rec = this.rec
    const aux = rec.aux
    const W = rec.d.W
    const cx = Math.cos(a)
    const sx = -Math.sin(a)
    // (local +x and +z in the world, as THREE turns about y)
    const ux = [cx, sx]
    const uz = [-sx, cx]
    let lo = Infinity
    let hi = -Infinity
    let top = -Infinity
    this.dep = false
    const parent = rec.parent
    const margin = DISTRICT.margin
    for (let p = 0; p < 13; p++) {
      // the centre, the corners and the sides' middles, and the corners again a margin out
      const fu = p === 0 ? 0 : p < 5 ? [-1, 1, 1, -1][p - 1] : p < 9 ? [0, 1, 0, -1][p - 5] : [-1, 1, 1, -1][p - 9]
      const fv = p === 0 ? 0 : p < 5 ? [-1, -1, 1, 1][p - 1] : p < 9 ? [-1, 0, 1, 0][p - 5] : [-1, -1, 1, 1][p - 9]
      const grow = p >= 9 ? 1.25 : 1
      const px = x + (ux[0] * fu * ax + uz[0] * fv * az) * grow
      const pz = z + (ux[1] * fu * ax + uz[1] * fv * az) * grow
      const [i, j] = this.texelOf(px, pz)
      const c = j * W + i
      const f = aux[c * 4 + 3]
      // a loʻi, a fishpond or the village, while it stands
      if (f > 0 && aux[c * 4 + 1] > 0) {
        this.dep = true
        if (ep.features.has(f)) return null
      }
      if (p >= 9) continue
      if (this.streamNear(px, pz)) return null
      if (aux[c * 4] || this.districts.patchAt(i, j)) this.dep = true
      let g = this.groundAt(i, j, ep.state)
      if (g < 0.6) return null
      const raw = rec.metres[c]
      lo = Math.min(lo, raw)
      hi = Math.max(hi, raw)
      const edge = this.edgeAt(px, pz)
      if (parent && edge < margin) {
        const w = smooth(DISTRICT.band, margin, edge)
        g = Math.max(g, islandMetres(this.app, parent, px, pz, ep.year) * (1 - w) + g * w)
        this.dep = true
      }
      top = Math.max(top, g)
    }
    if (hi - lo > relief) return null
    // (and clear of the landmarks standing then)
    for (const L of this.landmarks) {
      if (Math.hypot(x - L.x, z - L.z) >= L.r + Math.max(ax, az) + GAP) continue
      this.dep = true
      if (ep.year >= L.from) return null
    }
    return top
  }

  // --- the ground's weights -------------------------------------------------------

  /**
   * Coarse grids over the district, made once: the distance to the sea of the
   * patched years (for the coast's weight and the grid's direction) and to the
   * streams (for their weight, and to keep houses out of them).
   */
  grounds() {
    const rec = this.rec
    const d = rec.d
    const r = d.rect
    // 24 m: the sea of 1800 (every patch whole) and the distance to it
    const k = 4
    const w = Math.ceil(d.W / k)
    const h = Math.ceil(d.H / k)
    const st = this.patchState(1800)
    const sea = new Uint8Array(w * h)
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) sea[j * w + i] = this.groundAt(Math.min(d.W - 1, i * k + 2), Math.min(d.H - 1, j * k + 2), st) <= 0 ? 1 : 0
    const mx = d.mx * k
    const mz = d.mz * k
    const toSea = distanceTransform(w, h, (c) => sea[c] === 1, mx, mz)
    this.sea = { w, h, k, a: Float32Array.from(toSea) }
    // its broad slope, for the grid: which way is away from the sea
    const broad = blur(Float32Array.from(toSea, (v) => Math.min(v, 3000)), w, h, 12, 3)
    this.broad = { w, h, a: broad }
    // 12 m: the streams, as the decode traced them
    const k2 = 2
    const w2 = Math.ceil(d.W / k2)
    const h2 = Math.ceil(d.H / k2)
    const on = new Uint8Array(w2 * h2)
    const st2 = this.streamLines
    const gx = (x) => clamp(Math.floor(((x - r.x0) / (r.x1 - r.x0)) * w2), 0, w2 - 1)
    const gz = (z) => clamp(Math.floor(((z - r.z0) / (r.z1 - r.z0)) * h2), 0, h2 - 1)
    for (let q = 0; st2 && q < st2.length; ) {
      const n = st2[q++]
      for (let p = 0; p < n; p++, q += 3) {
        if (p + 1 >= n) continue
        const [ax, az, bx, bz] = [st2[q], st2[q + 1], st2[q + 3], st2[q + 4]]
        const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / 0.05))
        for (let s = 0; s <= steps; s++) on[gz(az + ((bz - az) * s) / steps) * w2 + gx(ax + ((bx - ax) * s) / steps)] = 1
      }
    }
    const toStream = distanceTransform(w2, h2, (c) => on[c] === 1, d.mx * k2, d.mz * k2)
    this.stream = { w: w2, h: h2, a: Float32Array.from(toStream) }
    this.streamLines = null
  }

  coarse(g, x, z) {
    const r = this.rec.d.rect
    const i = clamp(Math.floor(((x - r.x0) / (r.x1 - r.x0)) * g.w), 0, g.w - 1)
    const j = clamp(Math.floor(((z - r.z0) / (r.z1 - r.z0)) * g.h), 0, g.h - 1)
    return g.a[j * g.w + i]
  }

  streamNear(x, z) {
    return this.coarse(this.stream, x, z) < 9
  }

  /** The grid's direction over a tile: away from the sea, as the broad distance to it climbs. */
  mauka(x, z) {
    const g = this.broad
    const r = this.rec.d.rect
    const fi = ((x - r.x0) / (r.x1 - r.x0)) * g.w
    const fj = ((z - r.z0) / (r.z1 - r.z0)) * g.h
    const at = (i, j) => g.a[clamp(j, 0, g.h - 1) * g.w + clamp(i, 0, g.w - 1)]
    const i = Math.round(fi)
    const j = Math.round(fj)
    const D = 10
    const dx = at(i + D, j) - at(i - D, j)
    const dz = at(i, j + D) - at(i, j - D)
    if (Math.hypot(dx, dz) < 1e-3) return Math.PI / 2
    // (to a few degrees, so neighbouring tiles that agree share one grid)
    const step = Math.PI / 60
    return Math.round(Math.atan2(dz, dx) / step) * step
  }

  /** The ground's weight at a lot: flat, near the coast or a stream (about 1 on average). */
  weight(x, z) {
    const [i, j] = this.texelOf(x, z)
    const d = this.rec.d
    const m = this.rec.metres
    const at = (a, b) => m[clamp(b, 0, d.H - 1) * d.W + clamp(a, 0, d.W - 1)]
    const g = Math.hypot((at(i + 2, j) - at(i - 2, j)) / (4 * d.mx), (at(i, j + 2) - at(i, j - 2)) / (4 * d.mz))
    const near = Math.max(Math.exp(-this.coarse(this.sea, x, z) / 700), Math.exp(-this.coarse(this.stream, x, z) / 160))
    return (0.55 + 0.8 * near) * (1 - 0.6 * smooth(0.08, 0.35, g))
  }

  // --- the years ------------------------------------------------------------------

  /** The sampled years, the dates where the ground or a feature changes, and the epochs between them. */
  epochYears() {
    const rec = this.rec
    const breaks = new Set()
    for (const p of [...rec.raise, ...rec.lower]) breaks.add(p.until)
    for (const [, f] of rec.d.byIndex) {
      const [a, b] = spanOf(f.properties)
      if (Number.isFinite(a)) breaks.add(a)
      if (Number.isFinite(b)) breaks.add(b + 1)
    }
    for (const L of this.landmarks) breaks.add(L.from)
    this.years(breaks)
    // the epochs: the stretches between breaks, each with its patches and features
    const tl = this.app.timeline
    const y0 = tl.yearAt(0)
    this.epochs = []
    for (let e = 0; e <= this.edges.length; e++) {
      const y = e === 0 ? y0 : this.edges[e - 1]
      const features = new Set()
      for (const [i, f] of rec.d.byIndex) if (holds(f.properties, y)) features.add(i)
      this.epochs.push({ year: y, state: this.patchState(y), features })
    }
  }

  // --- the build --------------------------------------------------------------------

  async build() {
    const rec = this.rec
    const d = rec.d
    const r = d.rect
    const rand = mulberry32(1820)
    this.times = {}
    this.slice = performance.now()
    let tl = performance.now()
    // (each phase's own time, not the frames let through between its slices)
    let work = 0
    const lap = (what) => {
      this.times[what] = Math.round(work + performance.now() - tl)
      work = 0
      tl = performance.now()
    }
    const breathe = async () => {
      const before = performance.now()
      const ok = await this.breathe()
      if (performance.now() - before > 1) {
        work += before - tl
        tl = performance.now()
      }
      return ok
    }
    this.kits = buildKits(rand, PADS)
    lap('kits')
    this.grounds()
    lap('grounds')
    if (!(await breathe())) return false
    // the lots, tile by tile of the grid, kept PART + PART_GAP inside the
    // district's edge (the island's own stand nearer it: towns.js)
    const lots = []
    const nx = Math.ceil((r.x1 - r.x0) / GRID_TILE)
    const nz = Math.ceil((r.z1 - r.z0) / GRID_TILE)
    const ths = new Float32Array(nx * nz)
    for (let tj = 0; tj < nz; tj++) for (let ti = 0; ti < nx; ti++) ths[tj * nx + ti] = this.mauka(r.x0 + (ti + 0.5) * GRID_TILE, r.z0 + (tj + 0.5) * GRID_TILE)
    const thAt = (ti, tj) => (ti < 0 || tj < 0 || ti >= nx || tj >= nz ? NaN : ths[tj * nx + ti])
    const kb = new Float32Array(this.keyframes.length)
    const vb = new Float32Array(this.keyframes.length)
    const inner = PART + PART_GAP
    const Z = this.zoning
    for (let tj = 0; tj < nz; tj++) {
      if (!(await breathe())) return false
      for (let ti = 0; ti < nx; ti++) {
        const tx0 = r.x0 + ti * GRID_TILE
        const tz0 = r.z0 + tj * GRID_TILE
        const th = ths[tj * nx + ti]
        const pads = [thAt(ti - 1, tj) !== th, thAt(ti + 1, tj) !== th, thAt(ti, tj - 1) !== th, thAt(ti, tj + 1) !== th]
        const seed = tj * nx + ti
        const keep = (x, z) => this.edgeAt(x, z) >= inner
        for (const l of this.tileLots(tx0, tz0, th, seed, pads, keep)) {
          // (no lot that could never fill: its most generous fill at its densest keyframe)
          this.bytesAt(l.x, l.z, kb)
          let vmaxB = 0
          for (const v of kb) vmaxB = Math.max(vmaxB, v)
          // (where the zoning of now floors the density, by that floor)
          l.zone = classAt(Z.zoning, Z.rect, l.x, l.z)
          l.lud = classAt(Z.lud, Z.rect, l.x, l.z)
          l.zoned = !!Z.zoning
          const floor = ZONE_FLOOR[l.zone]
          if (floor) vmaxB = Math.max(vmaxB, (255 * Math.log(1 + floor / this.d0)) / this.L + 5)
          const fmax = this.fillMax(this.people(vmaxB))
          if (l.rank >= fmax * 1.5 && !(l.anchor && l.rankY < fmax * 1.5)) continue
          l.w = this.weight(l.x, l.z) * (0.85 + 0.3 * vnoise(l.x / 2.3, l.z / 2.3, 73))
          if (l.rank >= fmax * l.w && !(l.anchor && l.rankY < fmax * l.w)) continue
          l.b = Float32Array.from(kb)
          if (this.values) l.vb = Float32Array.from(this.sample(this.values, l.x, l.z, vb, 0))
          const nearSea = Math.exp(-this.coarse(this.sea, l.x, l.z) / 600)
          const pt = placeTerms(this.places, l.x, l.z, nearSea)
          l.coast = nearSea
          l.harbour = pt.harbour
          l.centre = pt.centre
          lots.push(l)
        }
      }
    }
    this.lotCount = lots.length
    this.gridTiles = { nx, nz }
    this.ths = ths
    lap('lots')
    // the landmarks first (the scatter keeps clear of them), then the years
    this.landmarks = []
    this.epochYears()
    this.placeLandmarks(lots)
    if (this.landmarks.length) this.epochYears()
    lap('landmarks')
    if (!(await this.scatter(lots, breathe))) return false
    lap('scatter')
    this.meshes()
    lap('meshes')
    if (!(await this.streets(breathe))) return false
    lap('streets')
    this.instances = null
    this.clearing()
    return true
  }

  /**
   * The church of 1842 at its gazetteer place, or where the 1853 town is
   * densest; a church or two more where the end of the kingdom's town peaks,
   * standing from when the density there first passes a town's; and the
   * harbour's clock tower of 1926, only at its gazetteer place.
   */
  placeLandmarks(lots) {
    const places = new Map((this.app.data.places || []).map((p) => [p.id, p]))
    const proj = this.app.data.proj
    const K = this.keyframes
    const kAt = (y) => K.findIndex((k) => k.year >= y)
    const add = (kind, x, z, face, from, name) => {
      const kit = this.kits[kind][0]
      const kd = KINDS[kind]
      const e = this.epochOfYear(from)
      if (this.edgeAt(x, z) < PART + PART_GAP) return false
      const top = this.allows(x, z, kit.hx * kd.sh, kit.hz * kd.sh, face, kd.relief + 2, e)
      if (top === null) return false
      this.landmarks.push({ kind, name, x, z, face, from, r: Math.hypot(kit.hx, kit.hz) * kd.sh, top })
      return true
    }
    const lotNear = (x, z) => {
      let best = null
      let bd = Infinity
      for (const l of lots) {
        const dd = Math.hypot(l.x - x, l.z - z)
        if (dd < bd) {
          bd = dd
          best = l
        }
      }
      return best
    }
    // (the town's density at a lot, at a keyframe)
    const at = (l, k) => this.people(l.b[k])
    const kM = Math.max(0, kAt(1853))
    const kB = Math.max(0, kAt(1896))
    const pc = places.get('kawaiahao')
    let placed = false
    if (pc) {
      const [x, z] = proj.toWorld(geometryPoint(pc.geometry))
      const l = lotNear(x, z)
      placed = add('church', x, z, l ? l.face : 0, 1842, 'Kawaiahaʻo')
    }
    if (!placed) {
      // where the town of 1853 is densest, on the layer's own grid (not the
      // noise the scatter lays over it), and the nearest lot there that takes it
      const c = this.crop
      const b = this.bytes[kM]
      let best = -1
      let px = 0
      let pz = 0
      for (let j = 0; j < c.h; j++) {
        for (let i = 0; i < c.w; i++) {
          if (b[j * c.w + i] <= best) continue
          best = b[j * c.w + i]
          px = c.x0 + (i + 0.5) * c.sx
          pz = c.z0 + (j + 0.5) * c.sz
        }
      }
      const near = [...lots].sort((a, q) => Math.hypot(a.x - px, a.z - pz) - Math.hypot(q.x - px, q.z - pz))
      for (const l of near.slice(0, 200)) if ((placed = add('church', l.x, l.z, l.face, 1842, 'Kawaiahaʻo'))) break
    }
    // the generic churches: the 1896 town's peaks, apart from each other and the first
    const byB = [...lots].sort((a, b) => at(b, kB) - at(a, kB))
    let n = 0
    for (const l of byB) {
      if (n >= 2) break
      if (this.landmarks.some((L) => Math.hypot(L.x - l.x, L.z - l.z) < 9)) continue
      // from when the density there first passes 500 people per km²
      let from = null
      for (const s of this.samples) {
        if (s.y < 1840) continue
        const v = l.b[s.a] + (l.b[s.a + 1] - l.b[s.a]) * s.t
        if (this.people(v) > 500) {
          from = s.y
          break
        }
      }
      if (from === null) continue
      if (add(from < 1860 ? 'church' : 'spire', l.x, l.z, l.face, from, null)) n++
    }
    const pt = places.get('aloha-tower')
    if (pt) {
      const [x, z] = proj.toWorld(geometryPoint(pt.geometry))
      const l = lotNear(x, z)
      add('clock', x, z, l ? l.face : 0, 1926, pt.name)
    }
  }

  /** Every lot through the years, into instances with their spans. */
  async scatter(lots, breathe) {
    const NS = this.Ys.length
    const S_ = this.samples
    // first the count, sample by sample, for the budget
    const count = new Float64Array(NS)
    for (let li = 0; li < lots.length; li++) {
      if (li % 512 === 0 && !(await breathe())) return false
      const l = lots[li]
      for (let n = 0; n < NS; n++) {
        const s = S_[n]
        const v = this.fillByte(l, s, this.byteAt(l, s))
        if (v <= 0) continue
        const [F, fk] = this.fill(s, this.people(v))
        if (l.rank < F * l.w || (l.anchor && l.rankY < 4 * fk * l.w)) count[n]++
      }
    }
    this.cap = Array.from(count, (c) => Math.min(1, MAX_PLACED / Math.max(1, c)))
    const inst = []
    const allows = (q, relief, e) => this.allows(q.x, q.z, q.ax, q.az, q.a, relief, e)
    const cap = (n) => this.cap[n]
    const emit = (it) => inst.push(it)
    for (let li = 0; li < lots.length; li++) {
      if (li % 256 === 0 && !(await breathe())) return false
      this.scatterLot(lots[li], allows, cap, emit)
    }
    // the landmarks, standing from their year to the end
    for (const L of this.landmarks) {
      const n0 = this.Ys.findIndex((y) => y >= L.from)
      inst.push(this.instance({ x: L.x, z: L.z, face: L.face, landmark: true, r5: 0.5, r6: 0.5, r7: 0.5 }, { kind: KIND[L.kind], variant: 0, top: L.top, d: 0, n0: Math.max(0, n0) }, NS))
    }
    this.instances = inst
    return true
  }

  /** How far instance i has faded in at a year (the shader's own sum). */
  weightAt(i, y) {
    const s = this.spans
    return smooth(s[i * 4], s[i * 4 + 1], y) * (1 - smooth(s[i * 4 + 2], s[i * 4 + 3], y))
  }

  // --- drawing -------------------------------------------------------------------

  meshes() {
    const rect = this.rec.d.rect
    this.material = objectMaterial(this.app.shared, this.own, { fade: [50, 70], grow: true })
    // the variants, each its own instanced mesh
    this.variants = []
    const byKey = new Map()
    for (const name of KIND_NAMES) {
      this.kits[name].forEach((kit, v) => {
        byKey.set(KIND[name] * 16 + v, this.variants.length)
        this.variants.push({ name, v, kit, n: 0 })
      })
    }
    const N = this.instances.length
    this.N = N
    this.vOf = new Uint16Array(N)
    this.mats = new Float32Array(N * 16)
    this.spans = new Float32Array(N * 4)
    this.stretches = new Float32Array(N)
    this.cols = new Float32Array(N * 3)
    // (what the tools, the streets and the trees' clearing ask of each, kept as
    // arrays: the objects are let go once the streets are laid)
    this.ix = new Float32Array(N)
    this.iz = new Float32Array(N)
    this.ia = new Float32Array(N)
    this.iy = new Float32Array(N)
    this.irx = new Float32Array(N)
    this.irz = new Float32Array(N)
    this.isv = new Float32Array(N)
    this.ish = new Float32Array(N)
    this.ikind = new Uint8Array(N)
    this.ivar = new Uint8Array(N)
    this.isite = new Int32Array(N)
    this.iland = new Uint8Array(N)
    const m4 = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const up = new THREE.Vector3(0, 1, 0)
    const pos = new THREE.Vector3()
    const scl = new THREE.Vector3()
    this.instances.forEach((it, i) => {
      const vi = byKey.get(it.kind * 16 + it.variant)
      this.vOf[i] = vi
      this.variants[vi].n++
      q.setFromAxisAngle(up, it.a)
      pos.set(it.x, it.y, it.z)
      scl.set(it.sh, it.sv, it.sh)
      m4.compose(pos, q, scl)
      m4.toArray(this.mats, i * 16)
      this.spans.set(it.span, i * 4)
      this.stretches[i] = it.stretch
      this.cols.set(it.colour, i * 3)
      this.ix[i] = it.x
      this.iz[i] = it.z
      this.ia[i] = it.a
      this.iy[i] = it.y
      this.irx[i] = it.rx
      this.irz[i] = it.rz
      this.isv[i] = it.sv
      this.ish[i] = it.sh
      this.ikind[i] = it.kind
      this.ivar[i] = it.variant
      this.isite[i] = it.site
      this.iland[i] = it.landmark ? 1 : 0
    })
    for (const vr of this.variants) {
      const cap = Math.max(1, Math.min(vr.n, MAX_DRAWN))
      const g = vr.kit.geometry
      const mesh = new THREE.InstancedMesh(g, this.material, cap)
      mesh.name = `${vr.name}-${vr.v}`
      mesh.count = 0
      mesh.visible = false
      mesh.frustumCulled = false
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(cap * 3), 3)
      mesh.instanceColor.setUsage(THREE.DynamicDrawUsage)
      const aSpan = new THREE.InstancedBufferAttribute(new Float32Array(cap * 4), 4)
      aSpan.setUsage(THREE.DynamicDrawUsage)
      const aStretch = new THREE.InstancedBufferAttribute(new Float32Array(cap), 1)
      aStretch.setUsage(THREE.DynamicDrawUsage)
      g.setAttribute('aSpan', aSpan)
      g.setAttribute('aStretch', aStretch)
      Object.assign(vr, { mesh, cap, aSpan, aStretch })
      this.group.add(mesh)
    }
    // the culling tiles, each one's instances shuffled (the first of them a fair thinning)
    const rand = mulberry32(1842)
    this.tnx = Math.ceil((rect.x1 - rect.x0) / TILE)
    this.tnz = Math.ceil((rect.z1 - rect.z0) / TILE)
    const nT = this.tnx * this.tnz
    const tileOf = new Int32Array(N)
    const counts = new Int32Array(nT)
    this.instances.forEach((it, i) => {
      const tx = clamp(Math.floor((it.x - rect.x0) / TILE), 0, this.tnx - 1)
      const tz = clamp(Math.floor((it.z - rect.z0) / TILE), 0, this.tnz - 1)
      tileOf[i] = tz * this.tnx + tx
      counts[tileOf[i]]++
    })
    this.tStart = new Int32Array(nT + 1)
    for (let t = 0; t < nT; t++) this.tStart[t + 1] = this.tStart[t] + counts[t]
    const fill = this.tStart.slice()
    this.tOrder = new Int32Array(N)
    for (let i = 0; i < N; i++) this.tOrder[fill[tileOf[i]]++] = i
    for (let t = 0; t < nT; t++) {
      for (let a = this.tStart[t + 1] - 1; a > this.tStart[t]; a--) {
        const b = this.tStart[t] + Math.floor(rand() * (a - this.tStart[t] + 1))
        const tmp = this.tOrder[a]
        this.tOrder[a] = this.tOrder[b]
        this.tOrder[b] = tmp
      }
    }
    // (the landmarks are drawn whatever the thinning; a kauhale's hale go
    // together, the first of them deciding for the rest)
    this.always = []
    for (let i = 0; i < N; i++) if (this.iland[i]) this.always.push(i)
    this.frustum = new THREE.Frustum()
    this.pv = new THREE.Matrix4()
    this.box = new THREE.Box3()
    this.key = ''
    this.yearDrawn = NaN
  }

  /** Whether instance i stands at all within a year of y. */
  aliveNear(i, y) {
    const s = this.spans
    return s[i * 4] < y + 1 && s[i * 4 + 3] > y - 1
  }

  /** Refill the draw buffers: the instances standing near the year, in view, within reach, thinned with distance. */
  refresh(camera, R, maxY) {
    const y = this.yearNow
    const p = camera.position
    this.pv.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    this.frustum.setFromProjectionMatrix(this.pv)
    const r = this.rec.d.rect
    const FULL = R * 0.7
    const tiles = []
    const i0 = Math.max(0, Math.floor((p.x - R - r.x0) / TILE))
    const i1 = Math.min(this.tnx - 1, Math.floor((p.x + R - r.x0) / TILE))
    const j0 = Math.max(0, Math.floor((p.z - R - r.z0) / TILE))
    const j1 = Math.min(this.tnz - 1, Math.floor((p.z + R - r.z0) / TILE))
    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        const t = j * this.tnx + i
        if (this.tStart[t + 1] === this.tStart[t]) continue
        const x0 = r.x0 + i * TILE
        const z0 = r.z0 + j * TILE
        this.box.min.set(x0, -0.5, z0)
        this.box.max.set(x0 + TILE, maxY, z0 + TILE)
        const dd = this.box.distanceToPoint(p)
        if (dd > R || !this.frustum.intersectsBox(this.box)) continue
        const f = dd < FULL ? 1 : FULL / dd
        tiles.push(t, Math.round(f * 20))
      }
    }
    const key = tiles.join(',')
    if (key === this.key && Math.abs(y - this.yearDrawn) < 0.5) return
    this.key = key
    this.yearDrawn = y
    // how many stand there now, and the thinning that keeps them in budget
    let want = 0
    const alive = []
    for (let t = 0; t < tiles.length; t += 2) {
      const a = this.tStart[tiles[t]]
      const b = this.tStart[tiles[t] + 1]
      let n = 0
      for (let k = a; k < b; k++) if (this.aliveNear(this.tOrder[k], y)) n++
      alive.push(n)
      want += Math.ceil((n * tiles[t + 1]) / 20)
    }
    const thin = Math.min(1, (MAX_DRAWN - this.always.length) / Math.max(1, want))
    for (const vr of this.variants) vr.c = 0
    const put = (i) => {
      const vr = this.variants[this.vOf[i]]
      if (vr.c >= vr.cap) return
      const c = vr.c++
      vr.mesh.instanceMatrix.array.set(this.mats.subarray(i * 16, i * 16 + 16), c * 16)
      vr.mesh.instanceColor.array.set(this.cols.subarray(i * 3, i * 3 + 3), c * 3)
      vr.aSpan.array.set(this.spans.subarray(i * 4, i * 4 + 4), c * 4)
      vr.aStretch.array[c] = this.stretches[i]
    }
    for (let t = 0; t < tiles.length; t += 2) {
      const take = Math.ceil((alive[t / 2] * tiles[t + 1] * thin) / 20)
      let got = 0
      for (let k = this.tStart[tiles[t]]; k < this.tStart[tiles[t] + 1] && got < take; k++) {
        const i = this.tOrder[k]
        if (this.iland[i] || !this.aliveNear(i, y)) continue
        put(i)
        got++
      }
    }
    for (const i of this.always) if (this.aliveNear(i, y)) put(i)
    this.drawn = 0
    for (const vr of this.variants) {
      vr.mesh.count = vr.c
      vr.mesh.visible = vr.c > 0
      vr.mesh.instanceMatrix.needsUpdate = true
      vr.mesh.instanceColor.needsUpdate = true
      vr.aSpan.needsUpdate = true
      vr.aStretch.needsUpdate = true
      this.drawn += vr.c
    }
  }

  // --- the streets ------------------------------------------------------------------

  /**
   * The street grid of each epoch: every block edge beside a block with
   * buildings of the grid in that year (not the kauhale's scatter), on dry
   * ground off the loʻi and the ponds of the year; and from the 1870s the
   * blocks themselves where they are mostly built, packed earth and then
   * paving under them, so a block reads as a block. A ribbon batch of each
   * per epoch (ribbons.js drapes them on the ground of the moment, drawn a
   * little toward the eye and offset in depth, so they never fight it).
   */
  async streets(breathe) {
    const tl = this.app.timeline
    const top = tl.yearAt(tl.max)
    const R = this.rec.d.rect
    const { nx, nz } = this.gridTiles
    this.streetBatches = []
    for (const ey of STREET_EPOCHS) {
      if (!(await breathe())) return false
      const y = Math.min(ey, top)
      const e = this.epochOfYear(y)
      const ep = this.epochs[e]
      // the blocks with buildings now, by grid tile (each tile its own direction)
      const blocks = new Map()
      for (let i = 0; i < this.N; i++) {
        const kd = KINDS[KIND_NAMES[this.ikind[i]]]
        if (kd.loose || this.iland[i] || this.weightAt(i, y) < 0.5) continue
        const it = { x: this.ix[i], z: this.iz[i] }
        const tx = clamp(Math.floor((it.x - R.x0) / GRID_TILE), 0, nx - 1)
        const tz = clamp(Math.floor((it.z - R.z0) / GRID_TILE), 0, nz - 1)
        const th = this.ths[tz * nx + tx]
        const m = [Math.cos(th), Math.sin(th)]
        const ev = [-m[1], m[0]]
        const u = it.x * ev[0] + it.z * ev[1]
        const v = it.x * m[0] + it.z * m[1]
        const bu = Math.floor(u / BU)
        const bv = Math.floor(v / BV)
        const key = `${tz * nx + tx}:${bu}:${bv}`
        const b = blocks.get(key) || { th, bu, bv, n: 0 }
        b.n++
        blocks.set(key, b)
      }
      const edges = new Map()
      for (const b of blocks.values()) {
        if (b.n < 2) continue
        const m = [Math.cos(b.th), Math.sin(b.th)]
        const ev = [-m[1], m[0]]
        const W = (u, v) => [u * ev[0] + v * m[0], u * ev[1] + v * m[1]]
        const u0 = b.bu * BU
        const u1 = u0 + BU
        const v0 = b.bv * BV
        const v1 = v0 + BV
        for (const [k, a, c] of [
          [`${b.th}:v${b.bv}:${b.bu}`, W(u0, v0), W(u1, v0)],
          [`${b.th}:v${b.bv + 1}:${b.bu}`, W(u0, v1), W(u1, v1)],
          [`${b.th}:u${b.bu}:${b.bv}`, W(u0, v0), W(u0, v1)],
          [`${b.th}:u${b.bu + 1}:${b.bv}`, W(u1, v0), W(u1, v1)],
        ]) edges.set(k, [a, c])
      }
      // a line along the ground, in steps, if all of it is dry and off the loʻi and the ponds of the year
      const drape = (a, c, step) => {
        const n = Math.max(1, Math.ceil(Math.hypot(c[0] - a[0], c[1] - a[1]) / step))
        const pts = []
        for (let s = 0; s <= n; s++) {
          const x = a[0] + ((c[0] - a[0]) * s) / n
          const z = a[1] + ((c[1] - a[1]) * s) / n
          const [i, j] = this.texelOf(x, z)
          const cc = j * this.rec.d.W + i
          const f = this.rec.aux[cc * 4 + 3]
          if (this.groundAt(i, j, ep.state) < 0.4 || (f > 0 && this.rec.aux[cc * 4 + 1] > 0 && ep.features.has(f))) return null
          pts.push([x, z])
        }
        return pts
      }
      const lines = []
      for (const [a, c] of edges.values()) {
        const pts = drape(a, c, 0.4)
        if (pts) lines.push({ pts, width: STREET_W })
      }
      const pads = []
      const full = ey < 1870 ? Infinity : ey < 1950 ? 5 : 4
      for (const b of blocks.values()) {
        if (b.n < full) continue
        const m = [Math.cos(b.th), Math.sin(b.th)]
        const ev = [-m[1], m[0]]
        const v = (b.bv + 0.5) * BV
        const W = (u) => [u * ev[0] + v * m[0], u * ev[1] + v * m[1]]
        // (short of the block's ends by the quarter width a ribbon runs on past them)
        const pts = drape(W(b.bu * BU + 0.32), W((b.bu + 1) * BU - 0.32), 0.3)
        if (pts) pads.push({ pts, width: PAD_W })
      }
      const colour = new THREE.Color(ey < 1910 ? '#9a8668' : ey < 1950 ? '#8a8277' : TOWN_PALETTE.asphalt).toArray()
      const padColour = new THREE.Color(ey < 1910 ? '#a38f6f' : ey < 1950 ? '#a09888' : '#a9a59c').toArray()
      const batch = this.ribbons.add(lines, { mode: 'earth', colour, alpha: 0, minPx: 0.7, lift: 0.004, order: 4 })
      const padBatch = this.ribbons.add(pads, { mode: 'earth', colour: padColour, alpha: 0, minPx: 0, lift: 0.003, order: 3 })
      this.streetBatches.push({ year: ey, batch, padBatch, n: lines.length, pads: pads.length })
    }
    return true
  }

  /** Each epoch's street batch's weight at a year: a tent between its neighbours, the first easing in over 15 years. */
  streetWeights(y) {
    const E = this.streetBatches
    return E.map((s, k) => {
      const prev = k > 0 ? E[k - 1].year : s.year - 15
      const next = k + 1 < E.length ? E[k + 1].year : Infinity
      if (y <= s.year) return k === 0 ? smooth(prev, s.year, y) : clamp((y - prev) / (s.year - prev), 0, 1)
      return next === Infinity ? 1 : clamp((next - y) / (next - s.year), 0, 1)
    })
  }

  // --- the trees' clearing -----------------------------------------------------------

  clearing() {
    const N = 512
    this.clearN = N
    this.clearData = new Uint8Array(N * N)
    const t = new THREE.DataTexture(this.clearData, N, N, THREE.RedFormat, THREE.UnsignedByteType)
    t.minFilter = t.magFilter = THREE.NearestFilter
    t.needsUpdate = true
    this.clearTex = t
    this.own.uTownClear.value = t
    this.yearCleared = NaN
    this.townsCleared = -1
  }

  /** Stamp a footprint (centre, turn, half extents) into the clearing at weight v (0..255). */
  stamp(x, z, a, rx, rz, v) {
    const N = this.clearN
    const D = this.clearData
    const r = this.rec.d.rect
    const sx = N / (r.x1 - r.x0)
    const sz = N / (r.z1 - r.z0)
    const ca = Math.abs(Math.cos(a))
    const sa = Math.abs(Math.sin(a))
    const hx = rx * ca + rz * sa
    const hz = rx * sa + rz * ca
    const i0 = clamp(Math.floor((x - hx - r.x0) * sx), 0, N - 1)
    const i1 = clamp(Math.floor((x + hx - r.x0) * sx), 0, N - 1)
    const j0 = clamp(Math.floor((z - hz - r.z0) * sz), 0, N - 1)
    const j1 = clamp(Math.floor((z + hz - r.z0) * sz), 0, N - 1)
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) if (D[j * N + i] < v) D[j * N + i] = v
  }

  /** What stands in the year, the island's buildings near the edge with it (towns.js), stamped over the district for the trees to keep out of. */
  stampClearing(y) {
    this.clearData.fill(0)
    for (let k = 0; k < this.N; k++) {
      const w = this.weightAt(k, y)
      if (w < 0.02) continue
      this.stamp(this.ix[k], this.iz[k], this.ia[k], this.irx[k], this.irz[k], Math.round(255 * w))
    }
    this.app.towns?.stampInto(this.rec.d.rect, y, (x, z, a, rx, rz, v) => this.stamp(x, z, a, rx, rz, v))
    this.clearTex.needsUpdate = true
    this.yearCleared = y
    this.townsCleared = this.app.towns?.version ?? 0
  }

  // --- every frame -----------------------------------------------------------------

  update(dt, show, distance) {
    const target = this.app.timeline.year
    // the year eases, so a jump grows the town through the years between
    if (dt > 0) {
      this.yearNow += (target - this.yearNow) * (1 - Math.exp(-dt * 2.2))
      if (Math.abs(target - this.yearNow) < 0.05) this.yearNow = target
    } else this.yearNow = target
    this.own.uYearNow.value = this.yearNow
    if (!this.ready) return
    // (`hidden`: the tools' switch, to weigh the town's cost)
    if (this.hidden) show = 0
    this.group.visible = show > 0.001
    const sw = this.streetWeights(this.yearNow)
    this.streetBatches.forEach((s, k) => {
      if (s.batch) s.batch.uniforms.uAlpha.value = 0.5 * sw[k] * show
      if (s.padBatch) s.padBatch.uniforms.uAlpha.value = (s.year < 1910 ? 0.3 : s.year < 1950 ? 0.45 : 0.6) * sw[k] * show
    })
    if (!this.group.visible) return
    const R = reachFor(distance)
    this.material.uniforms.uFadeNear.value = R * 0.75
    this.material.uniforms.uFadeFar.value = R
    const maxY = (this.rec.data?.hi ?? 1000) * this.app.world.uniforms.uVert.value + 3
    this.refresh(this.app.camera, R, maxY)
    if (!(Math.abs(this.yearNow - this.yearCleared) < 0.5) || (this.app.towns?.version ?? 0) !== this.townsCleared) this.stampClearing(this.yearNow)
  }

  // --- for the tools ------------------------------------------------------------------

  /** The instances standing (wholly) in a year, with their kinds, footprints and ground. */
  alive(year = this.yearNow) {
    if (!this.ready) return []
    const out = []
    for (let i = 0; i < this.N; i++) {
      if (this.weightAt(i, year) < 0.999) continue
      const name = KIND_NAMES[this.ikind[i]]
      const kit = this.kits[name][this.ivar[i]]
      out.push({ i, site: this.isite[i], kind: name, variant: this.ivar[i], x: this.ix[i], z: this.iz[i], a: this.ia[i], ax: kit.hx * this.ish[i], az: kit.hz * this.ish[i], box: kit.box.map((v) => v * this.ish[i]), y: this.iy[i], height: kit.top * this.isv[i], landmark: !!this.iland[i] })
    }
    return out
  }

  /**
   * Counts by kind in a year, over the district or within `radius` world
   * units of (x, z): buildings (a kauhale once, however many its hale), and
   * the thatched hale among them.
   */
  census(year = this.yearNow, x = null, z = null, radius = Infinity) {
    return censusOf(this.alive(year), x, z, radius)
  }

  stats() {
    if (!this.ready) return { ready: false, failed: this.failed }
    const n = this.Ys.findIndex((y) => y >= this.yearNow)
    let bytes = this.clearData.byteLength + this.bytes.reduce((s, b) => s + b.byteLength, 0) + this.sea.a.byteLength + this.stream.a.byteLength + this.broad.a.byteLength
    for (const a of [this.mats, this.spans, this.cols, this.stretches, this.vOf, this.ix, this.iz, this.ia, this.iy, this.irx, this.irz, this.isv, this.ish, this.ikind, this.ivar, this.isite, this.iland, this.tOrder, this.tStart]) bytes += a.byteLength
    const c = this.census(this.yearNow)
    return {
      ready: true,
      year: +this.yearNow.toFixed(1),
      lots: this.lotCount,
      instances: this.N,
      placed: c.total,
      drawn: this.drawn,
      by: c.by,
      hale: c.hale,
      landmarks: this.landmarks.map((L) => `${L.name || L.kind} ${L.from}`),
      towns: this.townTerms,
      zoning: { zoning: this.zoning.zoning ? `${this.zoning.zoning.W}×${this.zoning.zoning.H}` : null, lud: this.zoning.lud ? `${this.zoning.lud.W}×${this.zoning.lud.H}` : null },
      value: this.values ? 'mask' : 'modelled',
      cap: +(this.cap[Math.max(0, n)] ?? 1).toFixed(2),
      streets: this.streetBatches.map((s) => `${s.year}:${s.n}/${s.pads}:${(s.batch?.uniforms.uAlpha.value ?? 0).toFixed(2)}`),
      triangles: this.variants.reduce((s, v) => s + v.mesh.count * v.kit.tris, 0),
      loadMs: this.loadMs,
      buildMs: this.buildMs,
      times: this.times,
      cpuMB: +(bytes / 1048576).toFixed(1),
    }
  }

  dispose() {
    this.disposed = true
    for (const vr of this.variants || []) {
      vr.mesh.dispose()
      vr.kit.geometry.dispose()
    }
    this.material?.dispose()
    this.clearTex?.dispose()
    this.own.uTownClear.value = null
  }
}

/** Counts by kind among standing instances (a kauhale once, however many its hale), within `radius` of (x, z). */
export function censusOf(list, x = null, z = null, radius = Infinity) {
  const by = {}
  const sites = new Set()
  let hale = 0
  for (const a of list) {
    if (x !== null && Math.hypot(a.x - x, a.z - z) > radius) continue
    if (a.kind === 'kauhale') hale++
    if (a.kind === 'hale') hale += 2
    if (sites.has(a.site)) continue
    sites.add(a.site)
    by[a.kind] = (by[a.kind] || 0) + 1
  }
  return { by, total: Object.values(by).reduce((s, v) => s + v, 0), hale }
}
