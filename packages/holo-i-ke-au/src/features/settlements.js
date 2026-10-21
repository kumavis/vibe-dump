// Settlements by era (DESIGN.md §5.4): at the near zoom the district's
// buildings come from the settlement layer's density for the chosen year
// (DATA.md "Era layers", people per km² on a log scale at four keyframes),
// not only from features.json, and their kind follows the era. Density sets
// how close and how large; the era sets what. The village at Kou keeps its
// own hale, placed from its outline (index.js), and the scatter yields to it
// while it stands.
//
// This is modelled placement from a modelled density: nothing here is a
// surveyed building. The landmarks are the exceptions, and only where the
// gazetteer has their place or the density peaks: the church of 1842 (at
// `kawaiahao` if the gazetteer has it, else where the town is densest), a
// clock tower at the harbour from 1926 (only if the gazetteer has
// `aloha-tower`); no other building is named.
//
// How it is worked out, once, when the district arrives:
//
// - The density. The parent island's settlement masks are read (four PNGs,
//   about 68 m a texel on Oʻahu), cut to the district, and sampled at any
//   point bilinearly with a stable noise over them, so a coarse texel breaks
//   into hamlets and gaps rather than a square of even scatter. The year is
//   placed on the keyframes as the land overlay places it (overlay/land.js:
//   by the manifest's eras, linearly in the bytes, which is geometric in
//   people), and thinned before 1450 as the overlay thins it. The Māhele
//   keyframe has no town in it, so Honolulu's of 1853 is put back (townTerm).
// - The lots. The district is laid with lots on a street grid aligned to the
//   shore: a tile of 500 m takes the direction away from the sea of the
//   patched years, so the grid runs mauka–makai and along the shore as
//   Honolulu's does, blocks of four lots by two between streets. Each lot has
//   a rank in an ordered dither (Bayer), so the lots that fill at any density
//   are evenly spread, and the same lots fill again whenever the density
//   comes back to the same value: the same year always gives the same town.
// - The weight of the ground. Flat ground near the coast and the streams
//   draws more than slopes away from both; a lot is refused where the ground
//   of the year is water (the patches lower the made land and raise the
//   dredged channels before their dates), on a loʻi or a fishpond or the
//   village while it stands, on a stream, or where its footprint falls more
//   than a few metres (the pali).
// - The years. Each lot is asked, year by sampled year (every four years from
//   contact, and at every date a patch or a feature changes), whether a
//   building stands on it and of which kind; the answers become instances,
//   each with the span of years it stands, which the shader fades by an
//   eased year (kit.js aSpan): density changes ease, kinds crossfade at their
//   boundaries, and a change forced by the ground (a loʻi laid, a reef
//   filled) is never crossed fading.
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

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

// --- the grid -------------------------------------------------------------------

// world units (100 m): a lot along the shore and mauka, the streets between
// blocks of four lots by two, and the tile over which the grid keeps one
// direction
const LU = 0.36
const LV = 0.4
const GU = 0.14
const GV = 0.14
const BU = 4 * LU + GU
const BV = 2 * LV + GV
const GRID_TILE = 5
const LOTS_PER_KM2 = (8 / (BU * BV)) * 100

// the kinds: scale on the ground (sh) and up (sv), world units per metre;
// the fall a footprint may take (metres); the era's grid or a loose scatter
const HALE_S = S * 1.4 // (as index.js draws Kou's)
const TOWN_S = S * 1.25
const KINDS = {
  kauhale: { sh: HALE_S, sv: HALE_S, relief: 2.5, loose: true },
  hale: { sh: HALE_S, sv: HALE_S, relief: 3, jitter: 0.35 },
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
  church: { sh: S * 0.85, sv: S * 0.85, relief: 3 },
  spire: { sh: TOWN_S * 0.9, sv: TOWN_S * 0.9, relief: 3 },
  clock: { sh: S * 0.7, sv: S * 0.7, relief: 3 },
}
const KIND_NAMES = Object.keys(KINDS)
// the lot paved under the city's kinds (model metres: the lot over the kind's scale)
const PADS = Object.fromEntries(['walkup', 'tower'].map((k) => [k, [(LU * 0.96) / KINDS[k].sh, (LV * 0.96) / KINDS[k].sh]]))
const KIND = Object.fromEntries(KIND_NAMES.map((k, i) => [k, i]))

// the scatter's budget, and what is drawn at once
const MAX_PLACED = 8000
const MAX_DRAWN = 8000
const TILE = 3 // world units: the culling tiles
const reachFor = (distance) => clamp(distance * 2.6, 40, 110)

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

// the old downtown's office towers (see scatter): at least the density, as a
// byte, whose towers stand about 80 m, and up to about 130 m
const CORE_BYTE = 232
const CORE_UNTIL = 1936

// the Māhele keyframe's town (see townTerm): from this year on a keyframe
// with no towns of its own borrows the next keyframe's
const TOWN_FROM = 1800

// the streets, one ribbon batch per epoch, crossfading by the year
const STREET_EPOCHS = [1850, 1875, 1900, 1930, 1960, 2000]
const STREET_W = 0.1
const PAD_W = 1.0

const BAYER = (() => {
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

/** A smooth value noise from the integer hash, for the density's upsampling. */
function vnoise(x, z, seed) {
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

function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export class Settlements {
  /**
   * rec: the resident district (render/district.js), read while its decode is
   * still whole; own: the district features' uniforms (index.js), which the
   * buildings share with the trees; ribbons: theirs too, for the streets.
   */
  constructor(app, districts, rec, own, ribbons) {
    this.app = app
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

  /** The layers' manifest and the parent island's settlement masks, cut to the district; then everything else. */
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
    const K = [...(m.keyframes || [])].filter((k) => Number.isFinite(k.year)).sort((a, b) => a.year - b.year)
    const files = K.map((k) => entry.layers?.[k.id]?.settlement?.file)
    if (K.length < 2 || files.some((f) => !f)) throw new Error('the settlement layer lacks a keyframe')
    const enc = m.encoding?.settlement || {}
    this.codec = settlementCodec(enc.d0 ?? 2, enc.dMax ?? 50000)
    this.L = Math.log(1 + (enc.dMax ?? 50000) / (enc.d0 ?? 2))
    this.d0 = enc.d0 ?? 2
    this.keyframes = K
    this.manifest = m
    const imgs = await Promise.all(files.map((f) => decodeGrey(decodeImage, data.abs(`layers/${f}`))))
    for (const [k, img] of imgs.entries()) if (img.W !== pack.W || img.H !== pack.H) throw new Error(`${files[k]} is ${img.W}×${img.H}, the pack ${pack.W}×${pack.H}`)
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
    this.bytes = imgs.map((img) => {
      const out = new Float32Array(cw * ch)
      for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) out[j * cw + i] = img.px[(j0 + j) * pack.W + i0 + i]
      return out
    })
    this.townTerm()
    this.eraYears = this.app.timeline.eras.map((era) => this.eraYear(era))
    this.manifest = null
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

  /**
   * The Māhele keyframe spreads each island's people of 1853 by the kuleana
   * parcels and the contact weights alone (methods.mahele.settlement.rule),
   * with no town: Honolulu, which by then held most of Oʻahu's people (Ellis
   * already gives the town of the 1820s six or seven thousand), comes out as
   * thin as the countryside, about 13 people per km² at Kou. A keyframe
   * after TOWN_FROM with no towns of its own therefore borrows the towns of
   * the next keyframe that has them (the end of the kingdom: their centre,
   * spread and share, the bake's own assumption) and puts that share of its
   * own island figure into the same soft disc, taking it from the layer's
   * spread. The share for 1853 is this file's assumption, as the bake's is
   * for 1896; a historian with Schmitt (RESEARCH.md §9) could set it.
   */
  townTerm() {
    const m = this.manifest
    const K = this.keyframes
    const island = this.rec.d.parent
    const pack = this.app.world.islandPacks.find((p) => p.id === island)
    const proj = this.app.data.proj
    this.towns = []
    K.forEach((kf, k) => {
      const own = m.methods?.[kf.id]?.settlement
      if (kf.year < TOWN_FROM || !own || own.towns?.length) return
      const later = K.slice(k + 1).find((q) => m.methods?.[q.id]?.settlement?.towns?.length)
      const people = own.populations?.[island]
      if (!later || !Number.isFinite(people)) return
      const towns = m.methods[later.id].settlement.towns.filter((t) => {
        const [x, z] = proj.toWorld([t.lon, t.lat])
        return x > pack.rect.x0 && x < pack.rect.x1 && z > pack.rect.z0 && z < pack.rect.z1
      })
      if (!towns.length) return
      const share = Math.min(0.9, towns.reduce((s, t) => s + (t.share || 0), 0))
      const { codec } = this
      const c = this.crop
      const b = this.bytes[k]
      for (let j = 0; j < c.h; j++) {
        for (let i = 0; i < c.w; i++) {
          const x = c.x0 + (i + 0.5) * c.sx
          const z = c.z0 + (j + 0.5) * c.sz
          let d = codec.decode(b[j * c.w + i]) * (1 - share)
          for (const t of towns) {
            const [tx, tz] = proj.toWorld([t.lon, t.lat])
            const s = (t.sigma || 1500) / 1000 // km
            const r2 = ((x - tx) ** 2 + (z - tz) ** 2) / 100 // km²
            d += ((people * (t.share || 0)) / (2 * Math.PI * s * s)) * Math.exp(-r2 / (2 * s * s))
          }
          b[j * c.w + i] = (255 * Math.log(1 + Math.max(0, d) / this.d0)) / this.L
        }
      }
      this.towns.push({ keyframe: kf.id, from: later.id, towns: towns.map((t) => t.name), people: Math.round(people * share) })
    })
  }

  /** The year an era's settlement stands at, as the manifest maps it (as LandOverlay.eraYear). */
  eraYear(era) {
    const spec = this.manifest.eras?.[era.id]?.settlement
    const at = (id) => this.keyframes.find((k) => k.id === id)?.year
    if (spec?.keyframe && at(spec.keyframe) !== undefined) return at(spec.keyframe)
    if (spec?.from && at(spec.from) !== undefined && at(spec.to) !== undefined) return at(spec.from) + (at(spec.to) - at(spec.from)) * (spec.t ?? 0)
    return era.year
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

  /** The bytes at world (x, z), bilinear over the crop, for each keyframe, into `out`. */
  bytesAt(x, z, out) {
    const c = this.crop
    const fx = clamp((x - c.x0) / c.sx - 0.5, 0, c.w - 1.001)
    const fz = clamp((z - c.z0) / c.sz - 0.5, 0, c.h - 1.001)
    const i = fx | 0
    const j = fz | 0
    const tx = fx - i
    const tz = fz - j
    const q = j * c.w + i
    // a stable noise over the coarse texels: hamlets and gaps, not an even scatter
    const n = (vnoise(x / 1.7, z / 1.7, 71) - 0.5) * 26 + (vnoise(x / 0.55, z / 0.55, 72) - 0.5) * 12
    for (let k = 0; k < this.bytes.length; k++) {
      const b = this.bytes[k]
      const top = b[q] + (b[q + 1] - b[q]) * tx
      const bot = b[q + c.w] + (b[q + c.w + 1] - b[q + c.w]) * tx
      const v = top + (bot - top) * tz
      out[k] = v > 0.5 ? v + n : 0
    }
    return out
  }

  /** People per km² from a (fractional) byte (by table once the years are laid out). */
  people(v) {
    if (v <= 0) return 0
    if (this.lut && v < 256) return this.lut[Math.round(v * 8)]
    return this.d0 * (Math.exp((v / 255) * this.L) - 1)
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

  /**
   * Whether a footprint (centre x, z; half extents ax, az along its own axes;
   * turned by a) may stand in epoch `e` (the ground and the features as that
   * stretch of years has them), and the highest ground under it. `this.dep`
   * says afterwards whether the answer could differ in another epoch.
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
      const g = this.groundAt(i, j, ep.state)
      if (g < 0.6) return null
      const raw = rec.metres[c]
      lo = Math.min(lo, raw)
      hi = Math.max(hi, raw)
      top = Math.max(top, g)
    }
    if (hi - lo > relief) return null
    // (and clear of the landmarks standing then)
    for (const L of this.landmarks) {
      if (Math.hypot(x - L.x, z - L.z) >= L.r + Math.max(ax, az)) continue
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
  years() {
    const rec = this.rec
    const tl = this.app.timeline
    const y0 = tl.yearAt(0)
    const y1 = tl.yearAt(tl.max)
    const breaks = new Set()
    for (const p of [...rec.raise, ...rec.lower]) if (p.until > y0 && p.until <= y1) breaks.add(p.until)
    for (const [, f] of rec.d.byIndex) {
      const [a, b] = spanOf(f.properties)
      if (Number.isFinite(a) && a > y0 && a <= y1) breaks.add(a)
      if (Number.isFinite(b) && b + 1 > y0 && b + 1 <= y1) breaks.add(b + 1)
    }
    for (const L of this.landmarks) if (L.from > y0 && L.from <= y1) breaks.add(L.from)
    const contact = this.keyframes[0].year
    const ys = new Set([y0, ...PRE.filter((y) => y > y0 && y < contact), ...breaks])
    for (let y = contact; y <= y1; y += STEP) ys.add(y)
    ys.add(y1)
    this.Ys = [...ys].filter((y) => y >= y0 && y <= y1).sort((a, b) => a - b)
    this.isBreak = this.Ys.map((y) => breaks.has(y))
    // the epochs: the stretches between breaks, each with its patches and features
    const edges = [...breaks].sort((a, b) => a - b)
    this.epochs = []
    const epochOf = (y) => {
      let e = 0
      while (e < edges.length && y >= edges[e]) e++
      return e
    }
    for (let e = 0; e <= edges.length; e++) {
      const y = e === 0 ? y0 : edges[e - 1]
      const features = new Set()
      for (const [i, f] of rec.d.byIndex) if (holds(f.properties, y)) features.add(i)
      this.epochs.push({ year: y, state: this.patchState(y), features })
    }
    this.epochAt = this.Ys.map(epochOf)
    this.epochOfYear = epochOf
    // per sample: the keyframes either side and how far, the thinning before 1450, the eras' weights
    this.samples = this.Ys.map((y) => {
      const kp = this.kpAt(y)
      const a = Math.min(this.keyframes.length - 2, Math.floor(kp))
      // (each era's weight, eased over twenty years about its turn)
      const turns = [1820, 1860, 1900, 1960].map((t) => smooth(t - 10, t + 10, y))
      const w = [1 - turns[0], turns[0] - turns[1], turns[1] - turns[2], turns[2] - turns[3], turns[3]]
      return { y, a, t: kp - a, early: 25.5 * (1 - smooth(EARLY[0], EARLY[1], y)), w }
    })
    this.lut = new Float32Array(256 * 8 + 1)
    for (let k = 0; k <= 256 * 8; k++) this.lut[k] = this.d0 * (Math.exp((k / 8 / 255) * this.L) - 1)
  }

  /**
   * The share of lots built at a density in a sample's year (before the
   * ground's weight), and the kauhale's own. Before the town a kauhale stands
   * for a few households (about eight people); after it the share rises
   * faster than the density, so a town reads as a town and its outskirts as
   * scattered houses: the layer's towns are soft discs kilometres across,
   * and a fill in proportion would spread one even suburb over the plain.
   */
  fill(s, d) {
    const fk = Math.min(1 / 12, d / (8 * LOTS_PER_KM2))
    const w = s.w
    let f = w[0] * fk
    if (w[1]) f += w[1] * Math.min(0.8, 0.8 * (d / 700) ** 2)
    if (w[2]) f += w[2] * Math.min(0.9, 0.9 * (d / 1300) ** 2.5)
    if (w[3]) f += w[3] * Math.min(0.9, 0.9 * (d / 2500) ** 1.5)
    if (w[4]) f += w[4] * (d < 6000 ? Math.min(0.85, 0.85 * (d / 6000) ** 1.2) : 0.85 - 0.45 * smooth(6000, 15000, d))
    return [f, fk]
  }

  /** The most a lot could fill at a density, in any era (for the lots that never could). */
  fillMax(d) {
    return Math.max(Math.min(1 / 12, d / (8 * LOTS_PER_KM2)), Math.min(0.8, 0.8 * (d / 700) ** 2), Math.min(0.9, 0.9 * (d / 1300) ** 2.5), Math.min(0.9, 0.9 * (d / 2500) ** 1.5), Math.min(0.85, 0.85 * (d / 6000) ** 1.2))
  }

  /**
   * What stands on a lot in year y at density d: a kind, by the era (each lot
   * moving on at its own time, after the era's turn and never before it, the
   * densest first) and by the density.
   */
  kindAt(y, d, lot, kauhale) {
    const dn = clamp(Math.log10(Math.max(1, d) / 300), -1, 1)
    const t = y - lot.lag * (1 - 0.6 * Math.max(0, dn))
    if (y < 1818 || t < 1820) return kauhale ? KIND.kauhale : KIND.hale
    const thatch = 1 - smooth(1820, 1880, t + 12 * dn)
    if (t < 1860) {
      if (lot.r2 < thatch) return KIND.hale
      return lot.r3 < 0.3 + 0.25 * Math.max(0, dn) ? KIND.adobe : KIND.frame
    }
    if (t < 1900) {
      // (masonry where the town of the end of the kingdom is densest: the
      // layer's town is a soft disc, about 1,300 people per km² at its heart)
      if (d > 1150 && lot.r3 < 0.3) return KIND.block
      if (d > 700 && lot.r3 < 0.55) return KIND.store
      if (lot.r2 < thatch) return KIND.hale
      return lot.r4 < 0.2 ? KIND.frame : KIND.cottage
    }
    if (t < 1960) {
      if (d > 4000 && lot.r3 < 0.5) return KIND.midrise
      if (d > 1800 && lot.r3 < 0.6) return KIND.block
      if (d > 900 && lot.r3 < 0.4 && t < 1935) return KIND.store
      return KIND.bungalow
    }
    // (towers where the census is densest, Waikīkī's and downtown's, and on
    // the old downtown's lots (see scatter); walk-ups and houses between)
    if (lot.core) return KIND.tower
    if (d > 20000) return lot.r3 < 0.85 ? KIND.tower : KIND.walkup
    if (d > 10000) return lot.r3 < 0.2 + 0.5 * smooth(10000, 20000, d) ? KIND.tower : KIND.walkup
    if (d > 4000) return lot.r3 < 0.45 ? KIND.walkup : KIND.house
    if (d > 2500 && lot.r3 < 0.2) return KIND.walkup
    if (lot.r4 < 0.35 && t < 1990) return KIND.bungalow
    return KIND.house
  }

  /** A tower's height (metres) at a density: 35 m, to 150 m where it is densest. */
  towerHeight(d) {
    return 35 + 115 * smooth(4.0, 4.7, Math.log10(Math.max(1, d)))
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
    // the lots, tile by tile of the grid
    const lots = []
    const nx = Math.ceil((r.x1 - r.x0) / GRID_TILE)
    const nz = Math.ceil((r.z1 - r.z0) / GRID_TILE)
    const kb = new Float32Array(this.keyframes.length)
    for (let tj = 0; tj < nz; tj++) {
      if (!(await breathe())) return false
      for (let ti = 0; ti < nx; ti++) {
        const tx0 = r.x0 + ti * GRID_TILE
        const tz0 = r.z0 + tj * GRID_TILE
        const th = this.mauka(tx0 + GRID_TILE / 2, tz0 + GRID_TILE / 2)
        const m = [Math.cos(th), Math.sin(th)]
        const e = [-m[1], m[0]]
        let umin = Infinity
        let umax = -Infinity
        let vmin = Infinity
        let vmax = -Infinity
        for (const [cx, cz] of [[tx0, tz0], [tx0 + GRID_TILE, tz0], [tx0, tz0 + GRID_TILE], [tx0 + GRID_TILE, tz0 + GRID_TILE]]) {
          const u = cx * e[0] + cz * e[1]
          const v = cx * m[0] + cz * m[1]
          umin = Math.min(umin, u)
          umax = Math.max(umax, u)
          vmin = Math.min(vmin, v)
          vmax = Math.max(vmax, v)
        }
        const pad = 0.2
        for (let bv = Math.floor(vmin / BV) - 1; bv <= Math.ceil(vmax / BV); bv++) {
          for (let bu = Math.floor(umin / BU) - 1; bu <= Math.ceil(umax / BU); bu++) {
            for (let iv = 0; iv < 2; iv++) {
              for (let iu = 0; iu < 4; iu++) {
                const u = bu * BU + GU / 2 + (iu + 0.5) * LU
                const v = bv * BV + GV / 2 + (iv + 0.5) * LV
                const x = u * e[0] + v * m[0]
                const z = u * e[1] + v * m[1]
                if (x < tx0 + pad || x >= tx0 + GRID_TILE - pad || z < tz0 + pad || z >= tz0 + GRID_TILE - pad) continue
                if (x < r.x0 + 0.4 || x > r.x1 - 0.4 || z < r.z0 + 0.4 || z > r.z1 - 0.4) continue
                const gu = bu * 4 + iu
                const gv = bv * 2 + iv
                const seed = tj * nx + ti
                const rank = (BAYER[gv & 7][gu & 7] + ihash(gu, gv, seed * 7 + 1)) / 64
                // (no lot that could never fill: its most generous fill at its densest keyframe)
                this.bytesAt(x, z, kb)
                let vmaxB = 0
                for (const v of kb) vmaxB = Math.max(vmaxB, v)
                const fmax = this.fillMax(this.people(vmaxB))
                if (rank >= fmax * 1.5) continue
                const w = this.weight(x, z) * (0.85 + 0.3 * vnoise(x / 2.3, z / 2.3, 73))
                if (rank >= fmax * w) continue
                const h = (k) => ihash(gu, gv, seed * 7 + k)
                // the front to the lot's street: makai for the first row, mauka for the second
                const f = iv === 0 ? [-m[0], -m[1]] : m
                lots.push({
                  x,
                  z,
                  rank,
                  w,
                  b: Float32Array.from(kb),
                  face: Math.atan2(f[0], f[1]),
                  tile: seed,
                  bu,
                  bv,
                  u,
                  v,
                  e,
                  m,
                  lag: 25 * h(2),
                  r2: h(3),
                  r3: h(4),
                  r4: h(5),
                  r5: h(6),
                  r6: h(7),
                  r7: h(8),
                })
              }
            }
          }
        }
      }
    }
    this.lotCount = lots.length
    this.gridTiles = { nx, nz }
    lap('lots')
    // the landmarks first (the scatter keeps clear of them), then the years
    this.landmarks = []
    this.years()
    this.placeLandmarks(lots)
    if (this.landmarks.length) this.years()
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
        const v = l.b[s.a] + (l.b[s.a + 1] - l.b[s.a]) * s.t - s.early
        if (v <= 0) continue
        const [F] = this.fill(s, this.people(v))
        if (l.rank < F * l.w) count[n]++
      }
    }
    this.cap = Array.from(count, (c) => Math.min(1, MAX_PLACED / Math.max(1, c)))
    const inst = []
    for (let li = 0; li < lots.length; li++) {
      if (li % 256 === 0 && !(await breathe())) return false
      const l = lots[li]
      const cache = new Map()
      let run = null
      const emit = (end) => {
        const out = this.instance(l, run, end)
        if (Array.isArray(out)) inst.push(...out)
        else inst.push(out)
        run = null
      }
      // A lot that carried downtown's mid-rise before the war goes up to an
      // office tower after 1960, whatever the census there: the layer of now
      // counts where people live, and the business district, where few do,
      // would otherwise come out emptier than the 1930s left it.
      l.core = false
      for (let n = 0; n < NS; n++) {
        const s = S_[n]
        let state = null
        let v = l.b[s.a] + (l.b[s.a + 1] - l.b[s.a]) * s.t - s.early
        const core = l.core && s.y >= 1960
        if (core) v = Math.max(v, CORE_BYTE + 14 * l.r6)
        if (v > 0) {
          const d = this.people(v)
          const [F, fk] = this.fill(s, d)
          const c = this.cap[n]
          if (core || l.rank < F * l.w * c) {
            const kind = this.kindAt(s.y, d, l, l.rank < fk * l.w * c)
            const nv = kind === KIND.kauhale ? KAUHALE.length : this.kits[KIND_NAMES[kind]].length
            const variant = Math.min(nv - 1, Math.floor(ihash(l.tile, kind, Math.floor(l.rank * 1e6)) * nv))
            const e = this.epochAt[n]
            const key = kind * 16 + variant
            // (an answer that no epoch changes is kept for all of them)
            let top = cache.get(key * 256 + 255)
            if (top === undefined) top = cache.get(key * 256 + e)
            if (top === undefined) {
              const p = this.pose(l, kind, variant)
              const relief = KINDS[KIND_NAMES[kind]].relief
              if (p.parts) {
                // (each hale of a kauhale on its own ground)
                top = []
                let dep = false
                for (const q of p.parts) {
                  const t = this.allows(q.x, q.z, q.ax, q.az, q.a, relief, e)
                  dep ||= this.dep
                  if (t === null) {
                    top = null
                    break
                  }
                  top.push(t)
                }
                this.dep = dep
              } else top = this.allows(p.x, p.z, p.ax, p.az, p.a, relief, e)
              cache.set(key * 256 + (this.dep ? e : 255), top)
            }
            if (top !== null) state = { key, kind, variant, top, d }
            if (state && kind === KIND.midrise && s.y <= CORE_UNTIL) l.core = true
          }
        }
        if (run && state && state.key === run.key) {
          run.d = Math.max(run.d, state.d)
          continue
        }
        if (run) emit(n)
        if (state) run = { ...state, n0: n }
      }
      if (run) emit(NS)
    }
    // the landmarks, standing from their year to the end
    for (const L of this.landmarks) {
      const n0 = this.Ys.findIndex((y) => y >= L.from)
      inst.push(this.instance({ x: L.x, z: L.z, face: L.face, landmark: true, r5: 0.5, r6: 0.5, r7: 0.5 }, { kind: KIND[L.kind], variant: 0, top: L.top, d: 0, n0: Math.max(0, n0) }, NS))
    }
    this.instances = inst
    return true
  }

  /**
   * Where a kind stands on a lot: its centre, turn and half extents (world
   * units); for a kauhale, each of its hale (`parts`, each with its size).
   */
  pose(l, kind, variant) {
    const name = KIND_NAMES[kind]
    const kd = KINDS[name]
    let x = l.x
    let z = l.z
    let a = l.face
    if (kd.loose) {
      // a kauhale keeps to no grid: anywhere on its lot and the street beside, turned as it will
      x += (l.r5 - 0.5) * LU * 0.9 * l.e[0] + (l.r6 - 0.5) * LV * 0.8 * l.m[0]
      z += (l.r5 - 0.5) * LU * 0.9 * l.e[1] + (l.r6 - 0.5) * LV * 0.8 * l.m[1]
      a = l.r7 * Math.PI * 2
      const c = Math.cos(a)
      const s = Math.sin(a)
      const parts = KAUHALE[variant].map(([ox, oz, rot, size]) => {
        const kit = this.kits[name][size]
        // (as THREE turns about y: local x to (cos, −sin), local z to (sin, cos))
        return { x: x + (ox * c + oz * s) * kd.sh, z: z + (-ox * s + oz * c) * kd.sh, a: a + rot, size, ax: kit.hx * kd.sh, az: kit.hz * kd.sh }
      })
      return { x, z, a, parts }
    }
    const kit = this.kits[name][variant]
    if (kd.jitter) {
      // the early town: lots taken up before the grid was ruled
      a += (l.r5 - 0.5) * kd.jitter
      x += (l.r6 - 0.5) * 0.06
      z += (l.r7 - 0.5) * 0.06
    }
    return { x, z, a, ax: kit.hx * kd.sh, az: kit.hz * kd.sh }
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
    const p = l.landmark ? { x: l.x, z: l.z, a: l.face } : this.pose(l, run.kind, run.variant)
    const span = new Float32Array(4)
    // (a soft change between samples n − 1 and n falls at the lot's own moment
    // between them, the same for what goes and what comes)
    const when = (n) => Ys[n - 1] + ihash(l.tile ?? 0, n, Math.floor((l.rank ?? 0) * 1e6)) * (Ys[n] - Ys[n - 1])
    if (run.n0 === 0) {
      span[0] = -NEVER
      span[1] = -NEVER + 1
    } else if (this.isBreak[run.n0] || l.landmark) {
      span[0] = Ys[run.n0]
      span[1] = Ys[run.n0] + HARD
    } else {
      const t = when(run.n0)
      span[0] = Math.max(t - SOFT, Ys[run.n0 - 1])
      span[1] = t + SOFT
    }
    if (end >= NS) {
      span[2] = NEVER
      span[3] = NEVER + 1
    } else if (this.isBreak[end]) {
      span[2] = Ys[end] - HARD
      span[3] = Ys[end] - 0.01
    } else {
      const t = when(end)
      span[2] = t - SOFT
      span[3] = Math.min(t + SOFT, Ys[end])
    }
    const stretch = name === 'tower' ? this.towerHeight(run.d) / TOWER_H : 1
    const jit = 0.94 + 0.12 * (l.r5 ?? 0.5)
    const one = (q, variant, top) => {
      const kit = this.kits[name][variant]
      return {
        kind: run.kind,
        variant,
        site: this.sites,
        x: q.x,
        z: q.z,
        a: q.a,
        y: Y(top),
        sh: kd.sh,
        sv: kd.sv * stretch,
        stretch,
        span,
        colour: [jit * (0.98 + 0.04 * (l.r6 ?? 0.5)), jit, jit * (0.98 + 0.04 * (l.r7 ?? 0.5))],
        // (the ground it clears of trees: its footprint, a little in)
        rx: kit.hx * kd.sh * 0.95,
        rz: kit.hz * kd.sh * 0.95,
        landmark: !!l.landmark,
      }
    }
    this.sites = (this.sites || 0) + 1
    if (p.parts) return p.parts.map((q, k) => one(q, q.size, run.top[k]))
    return one(p, run.variant, run.top)
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
    // (the landmarks are drawn whatever the thinning)
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
   * per epoch (ribbons.js drapes them on the ground of the moment).
   */
  async streets(breathe) {
    const tl = this.app.timeline
    const top = tl.yearAt(tl.max)
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
        const tx = clamp(Math.floor((it.x - this.rec.d.rect.x0) / GRID_TILE), 0, this.gridTiles.nx - 1)
        const tz = clamp(Math.floor((it.z - this.rec.d.rect.z0) / GRID_TILE), 0, this.gridTiles.nz - 1)
        const th = this.mauka(this.rec.d.rect.x0 + (tx + 0.5) * GRID_TILE, this.rec.d.rect.z0 + (tz + 0.5) * GRID_TILE)
        const m = [Math.cos(th), Math.sin(th)]
        const ev = [-m[1], m[0]]
        const u = it.x * ev[0] + it.z * ev[1]
        const v = it.x * m[0] + it.z * m[1]
        const bu = Math.floor(u / BU)
        const bv = Math.floor(v / BV)
        const key = `${tz * this.gridTiles.nx + tx}:${bu}:${bv}`
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
  }

  /** What stands in the year, stamped over the district, for the trees to keep out of. */
  stampClearing(y) {
    const N = this.clearN
    const a = this.clearData
    a.fill(0)
    const r = this.rec.d.rect
    const sx = N / (r.x1 - r.x0)
    const sz = N / (r.z1 - r.z0)
    for (let k = 0; k < this.N; k++) {
      const w = this.weightAt(k, y)
      if (w < 0.02) continue
      const v = Math.round(255 * w)
      const x = this.ix[k]
      const z = this.iz[k]
      const ca = Math.abs(Math.cos(this.ia[k]))
      const sa = Math.abs(Math.sin(this.ia[k]))
      const hx = this.irx[k] * ca + this.irz[k] * sa
      const hz = this.irx[k] * sa + this.irz[k] * ca
      const i0 = clamp(Math.floor((x - hx - r.x0) * sx), 0, N - 1)
      const i1 = clamp(Math.floor((x + hx - r.x0) * sx), 0, N - 1)
      const j0 = clamp(Math.floor((z - hz - r.z0) * sz), 0, N - 1)
      const j1 = clamp(Math.floor((z + hz - r.z0) * sz), 0, N - 1)
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) if (a[j * N + i] < v) a[j * N + i] = v
    }
    this.clearTex.needsUpdate = true
    this.yearCleared = y
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
    if (!(Math.abs(this.yearNow - this.yearCleared) < 0.5)) this.stampClearing(this.yearNow)
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
      const kd = KINDS[name]
      out.push({ i, site: this.isite[i], kind: name, x: this.ix[i], z: this.iz[i], a: this.ia[i], ax: kit.hx * kd.sh, az: kit.hz * kd.sh, y: this.iy[i], height: kit.top * this.isv[i], landmark: !!this.iland[i] })
    }
    return out
  }

  /**
   * Counts by kind in a year, over the district or within `radius` world
   * units of (x, z): buildings (a kauhale once, however many its hale), and
   * the thatched hale among them.
   */
  census(year = this.yearNow, x = null, z = null, radius = Infinity) {
    const by = {}
    const sites = new Set()
    let hale = 0
    for (const a of this.alive(year)) {
      if (x !== null && Math.hypot(a.x - x, a.z - z) > radius) continue
      if (a.kind === 'kauhale') hale++
      if (a.kind === 'hale') hale += 2
      if (sites.has(a.site)) continue
      sites.add(a.site)
      by[a.kind] = (by[a.kind] || 0) + 1
    }
    return { by, total: Object.values(by).reduce((s, v) => s + v, 0), hale }
  }

  stats() {
    if (!this.ready) return { ready: false, failed: this.failed }
    const n = this.Ys.findIndex((y) => y >= this.yearNow)
    let bytes = this.clearData.byteLength + this.bytes.reduce((s, b) => s + b.byteLength, 0) + this.sea.a.byteLength + this.stream.a.byteLength + this.broad.a.byteLength
    for (const a of [this.mats, this.spans, this.cols, this.stretches, this.vOf, this.ix, this.iz, this.ia, this.iy, this.irx, this.irz, this.isv, this.ikind, this.ivar, this.isite, this.iland, this.tOrder, this.tStart]) bytes += a.byteLength
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
      towns: this.towns,
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

