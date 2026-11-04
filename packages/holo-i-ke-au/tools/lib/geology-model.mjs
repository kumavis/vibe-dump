// The stages: the islands as they stood at each age, modelled on the
// seafloor grid (DATA.md "Geology: the making of the islands"). Nothing here
// is a survey; every rule is written into the manifest beside the stage.
//
// The model, in short (DATA.md "How to bake the geology" says it at length):
//
// - The base. The sea floor with the volcanoes taken off: the seafloor pack
//   outside the ridge (deeper than −4,000 m and away from it), carried under
//   the ridge by a harmonic fill. Where a volcano is not yet born, or a debris
//   field not yet laid, the stage is the base.
// - The profile. One shield profile, fitted to the living shields (Mauna Loa's
//   south-west and west flanks, Kīlauea's south flank, from the seafloor pack
//   itself): a constant slope above sea level and a slope per 500 m of depth
//   below it, down to the base. Each volcano gets it at its own summit,
//   stretched by direction so that it crosses −2,000 m (lifted by the
//   subsidence since the stage) where the volcano's flank crosses −2,000 m
//   today: the rift zones keep their reach and the islands their shape.
// - Subsidence. Each volcano sinks at r0 while its shield grows and at
//   r0·exp(−τ/τ0) after, τ the time since the shield's end, fitted to the
//   measured rates (about 2.6 mm a year at Hawaiʻi, falling to near zero at
//   Oʻahu and Kauaʻi). At a stage the volcano stands higher than today by what
//   it has sunk since; the lift is a smooth field over the ridge, tapering to
//   nothing at the base.
// - A complete shield at stage A: below −2,000 m today, the sea floor as it is
//   now, lifted; above, the profile at its summit (its height today plus the
//   lift) blended toward today's lifted surface by the share of its erosion
//   still to come, (A / shield end)², fast at first as on the young islands. A shield still growing at
//   A: the profile alone, its height above the base the cube root of the
//   share of the shield's time already built (self-similar growth); within
//   15% of its full height, today's shape lowered by the height still to grow.
// - Landslides: before its age, a slide's scar is the profile and its debris
//   on the deep floor is the base; after, the scar and the debris are today's.
// - The shoreline: today's sea level, cut at 0 m (land ≥ 0.25 m, sea ≤ −1 m).
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ISLANDS, KX, KZ } from './geo.mjs'

const ISLAND_NAME = Object.fromEntries(ISLANDS.map((i) => [i.id, i.name]))

// ---------------------------------------------------------------------------
// The volcanoes, until the research's volcanoes.json lands (it replaces this
// table entry by entry, by id). Ages in Ma: the main shield building. Summits
// are the highest point of each volcano today (Koʻolau's at its caldera under
// Kāneʻohe Bay, with the height of the ridge above it). Approximate, from
// Clague and Dalrymple 1987, Sherrod et al. 2007 and Clague and Sherrod 2014.
export const FALLBACK_VOLCANOES = [
  { id: 'niihau', name: 'Niʻihau', island: 'Niʻihau', summit: [-160.106, 21.907], shield: { from: 6.0, to: 4.9 } },
  { id: 'kauai', name: 'Kauaʻi', island: 'Kauaʻi', summit: [-159.53, 22.07], shield: { from: 5.1, to: 4.0 }, subsidence: 0 },
  { id: 'waianae', name: 'Waiʻanae', island: 'Oʻahu', summit: [-158.15, 21.47], shield: { from: 3.9, to: 3.05 } },
  { id: 'koolau', name: 'Koʻolau', island: 'Oʻahu', summit: [-157.8, 21.4], shield: { from: 3.0, to: 2.6 }, subsidence: 0 },
  { id: 'penguin-bank', name: 'Penguin Bank', island: 'Penguin Bank', summit: [-157.55, 21.0], shield: { from: 2.3, to: 2.0 } },
  { id: 'west-molokai', name: 'West Molokaʻi', island: 'Molokaʻi', summit: [-157.21, 21.16], shield: { from: 1.9, to: 1.75 } },
  { id: 'east-molokai', name: 'East Molokaʻi', island: 'Molokaʻi', summit: [-156.88, 21.13], shield: { from: 1.76, to: 1.5 } },
  { id: 'west-maui', name: 'West Maui', island: 'Maui', summit: [-156.593, 20.89], shield: { from: 2.0, to: 1.3 } },
  { id: 'lanai', name: 'Lānaʻi', island: 'Lānaʻi', summit: [-156.91, 20.8], shield: { from: 1.5, to: 1.28 } },
  { id: 'kahoolawe', name: 'Kahoʻolawe', island: 'Kahoʻolawe', summit: [-156.58, 20.55], shield: { from: 1.25, to: 1.03 } },
  { id: 'haleakala', name: 'Haleakalā', island: 'Maui', summit: [-156.253, 20.71], shield: { from: 1.3, to: 0.95 }, subsidence: 0.8 },
  { id: 'kohala', name: 'Kohala', island: 'Hawaiʻi', summit: [-155.72, 20.09], shield: { from: 0.6, to: 0.3 } },
  { id: 'mauna-kea', name: 'Mauna Kea', island: 'Hawaiʻi', summit: [-155.468, 19.821], shield: { from: 0.6, to: 0.25 } },
  { id: 'hualalai', name: 'Hualālai', island: 'Hawaiʻi', summit: [-155.866, 19.692], shield: { from: 0.5, to: 0.13 } },
  { id: 'mauna-loa', name: 'Mauna Loa', island: 'Hawaiʻi', summit: [-155.603, 19.475], shield: { from: 0.6, to: 0 }, subsidence: 2.6 },
  { id: 'kilauea', name: 'Kīlauea', island: 'Hawaiʻi', summit: [-155.287, 19.406], shield: { from: 0.3, to: 0 }, subsidence: 2.6 },
  { id: 'kamaehuakanaloa', name: 'Kamaʻehuakanaloa', island: 'Kamaʻehuakanaloa', summit: [-155.27, 18.92], shield: { from: 0.3, to: 0 } },
]

// The slides the stages need, until landslides.geojson lands: sketched from
// the published maps (Moore et al. 1989; Normark et al. 1993; Satake et al.
// 2002), precision `sketch`. The research's fields replace these by id.
export const FALLBACK_LANDSLIDES = [
  {
    id: 'nuuanu', name: 'Nuʻuanu', volcano: 'koolau', age: 2.1, precision: 'sketch',
    // the debris on the sea floor, out to the Hawaiian Arch
    field: [[-157.68, 21.47], [-157.9, 21.75], [-157.6, 22.25], [-157.1, 22.95], [-156.45, 23.2], [-156.0, 22.85], [-156.35, 22.25], [-156.95, 21.75], [-157.38, 21.38]],
    // the flank it took: windward Oʻahu from Makapuʻu to Kahuku, from the pali out over the shelf
    scar: [[-157.63, 21.29], [-157.72, 21.32], [-157.8, 21.36], [-157.86, 21.42], [-157.93, 21.5], [-157.99, 21.6], [-158.02, 21.7], [-157.85, 21.85], [-157.55, 21.75], [-157.4, 21.5], [-157.48, 21.3]],
  },
  {
    id: 'wailau', name: 'Wailau', volcano: 'east-molokai', age: 1.5, precision: 'sketch',
    field: [[-157.05, 21.22], [-157.05, 21.55], [-156.85, 22.1], [-156.35, 22.25], [-156.25, 21.8], [-156.55, 21.3], [-156.72, 21.18]],
    scar: [[-157.0, 21.17], [-156.9, 21.15], [-156.8, 21.15], [-156.72, 21.16], [-156.62, 21.25], [-156.75, 21.38], [-156.95, 21.33]],
  },
]

// The stages, oldest first: ids, ages and confidence as volcanoes.json's
// stagesProposed gives them (which replaces this table when it is there,
// its rule kept beside the bake's own as `proposed`).
export const STAGES = [
  { id: 'kauai-alone', label: 'Kauaʻi and Niʻihau, complete and alone', age: 4.2, agePrecision: 0.3, confidence: 'soft' },
  { id: 'waianae', label: 'Waiʻanae grown beside them', age: 3.0, agePrecision: 0.1, confidence: 'soft' },
  { id: 'koolau-whole', label: 'the Koʻolau shield whole', age: 2.0, agePrecision: 0.1, confidence: 'soft' },
  { id: 'koolau-after-nuuanu', label: 'after the Nuʻuanu avalanche', age: 1.8, agePrecision: 0.1, confidence: 'soft' },
  { id: 'maui-nui', label: 'Maui Nui, one island', age: 1.2, agePrecision: 0.1, confidence: 'soft' },
  { id: 'maui-nui-parting', label: 'Maui Nui parting', age: 0.6, agePrecision: 0.1, confidence: 'soft' },
  { id: 'hawaii-rising', label: 'Hawaiʻi rising', age: 0.3, agePrecision: 0.05, confidence: 'soft' },
  { id: 'present', label: 'today', age: 0, agePrecision: 0, confidence: 'firm', reuse: true },
]

/** The stage list: the research's proposal where it exists, with the labels above. */
export function stageList(research) {
  if (!research.stagesProposed) return STAGES
  const mine = Object.fromEntries(STAGES.map((s) => [s.id, s]))
  return research.stagesProposed.map((p) => ({
    id: p.id,
    label: mine[p.id]?.label ?? p.id,
    age: p.age,
    agePrecision: p.agePrecision,
    confidence: p.confidence,
    proposed: p.rule,
    reuse: p.age === 0,
  }))
}

// The plate over the hotspot (DATA.md "Geology": the drift), until
// volcanoes.json's `hotspot` replaces it.
const FALLBACK_HOTSPOT = {
  position: [-155.27, 19.17],
  positionNote: 'between Kīlauea and Kamaʻehuakanaloa, the midpoint of their summits',
  speed: 10,
  speedUnit: 'cm/yr',
  azimuth: 305,
  azimuthUnit: 'degrees, compass, the direction the plate carries a volcano',
}

/** The manifest's hotspot: the research's, with the displacement written out. */
export function hotspotEntry(research) {
  const h = { ...(research.hotspot || FALLBACK_HOTSPOT) }
  const az = h.azimuth
  const v = h.speed
  const back = ((az + 180) % 360) * Math.PI / 180
  const r = (x) => Math.round(x * 1e4) / 1e4
  h.displacement = {
    formula:
      'a stage at age A (Ma) is drawn moved by A × speed toward the bearing azimuth + 180° (the islands slide back along the plate\'s path as the age runs down): ' +
      'x_m += 1e4 · A · speed · sin(azimuth + 180°), z_m −= 1e4 · A · speed · cos(azimuth + 180°), speed in cm a year, x east and z south in metres in the shared projection (DATA.md §1); ' +
      'the whole stage image moves as one, since the plate carries every volcano on it together',
    metresPerMa: Math.round(v * 1e4),
    bearingDeg: (az + 180) % 360,
    xMetresPerMa: Math.round(v * 1e4 * Math.sin(back)),
    zMetresPerMa: Math.round(-v * 1e4 * Math.cos(back)),
  }
  if (!research.hotspot) h.note = 'the fallback, until volcanoes.json gives the hotspot'
  return { h, r }
}

// ---------------------------------------------------------------------------
// Research files

function summitOf(v) {
  const s = v.summit
  if (!s) return null
  if (Array.isArray(s)) return { lon: s[0], lat: s[1], height: s[2] }
  if (Array.isArray(s.coordinates)) return { lon: s.coordinates[0], lat: s.coordinates[1], height: s.height ?? s.coordinates[2] }
  return { lon: s.lon ?? s.lng, lat: s.lat, height: s.height ?? s.metres }
}

const num = (x) => (typeof x === 'number' && Number.isFinite(x) ? x : x && typeof x === 'object' && typeof x.value === 'number' ? x.value : null)

function ringOf(g) {
  if (!g) return null
  if (Array.isArray(g) && typeof g[0][0] === 'number') return [g]
  if (g.type === 'Polygon') return [g.coordinates[0]]
  if (g.type === 'MultiPolygon') return g.coordinates.map((p) => p[0])
  if (g.type === 'Feature') return ringOf(g.geometry)
  return null
}

/** Volcanoes and slides: the research's where they exist, else the fallback tables. */
export function readResearch(gdir, log) {
  const used = { volcanoes: 'fallback', landslides: 'fallback' }
  const vols = new Map(FALLBACK_VOLCANOES.map((v) => [v.id, { ...v, summit: { lon: v.summit[0], lat: v.summit[1] }, from: 'fallback', sources: v.sources || [] }]))
  const vf = join(gdir, 'volcanoes.json')
  let doc = null
  if (existsSync(vf)) {
    const j = JSON.parse(readFileSync(vf, 'utf8'))
    doc = Array.isArray(j) ? null : j
    const list = Array.isArray(j) ? j : j.volcanoes || []
    let n = 0
    for (const r of list) {
      const s = summitOf(r)
      const from = num(r.shield?.from)
      const to = num(r.shield?.to) ?? (r.status === 'active' || r.status === 'submarine' ? 0 : null)
      if (!r.id || !s || from == null || to == null) continue
      vols.set(r.id, {
        id: r.id, name: r.name, island: ISLAND_NAME[r.island] || r.island || r.name, summit: { lon: s.lon, lat: s.lat }, shield: { from, to },
        subsidence: num(r.subsidence?.rate ?? r.subsidence), subsidenceRaw: r.subsidence && typeof r.subsidence === 'object' ? r.subsidence : null, sources: (r.sources || []).map((x) => (typeof x === 'string' ? x : x.id)).filter(Boolean),
        from: 'volcanoes.json',
      })
      n++
    }
    used.volcanoes = `volcanoes.json (${n} of ${list.length} with summit and shield ages)`
  }
  const slides = new Map(FALLBACK_LANDSLIDES.map((s) => [s.id, { ...s, field: [s.field], scar: [s.scar], from: 'fallback', sources: [] }]))
  const lf = join(gdir, 'landslides.geojson')
  if (existsSync(lf)) {
    const fc = JSON.parse(readFileSync(lf, 'utf8'))
    let n = 0
    for (const f of fc.features || []) {
      const p = f.properties || {}
      const age = num(p.age)
      const field = ringOf(f.geometry)
      if (!p.id || age == null || !field) continue
      slides.set(p.id, {
        id: p.id, name: p.name, volcano: p.volcano, age, precision: p.precision, field, scar: ringOf(p.scar),
        sources: (p.sources || []).map((x) => (typeof x === 'string' ? x : x.id)).filter(Boolean), from: 'landslides.geojson',
      })
      n++
    }
    used.landslides = `landslides.geojson (${n} fields with an age)`
  }
  log(`  volcanoes from ${used.volcanoes}; slides from ${used.landslides}`)
  return {
    subsidenceRule: doc?.subsidenceRule || null,
    hotspot: doc?.hotspot || null,
    stagesProposed: Array.isArray(doc?.stagesProposed) ? doc.stagesProposed : null, volcanoes: [...vols.values()], byId: Object.fromEntries([...vols].map(([k, v]) => [k, v])), slides: [...slides.values()], slideById: Object.fromEntries(slides), used }
}

// ---------------------------------------------------------------------------
// Grid helpers

function gridGeom(grid) {
  const [w, s, e, n] = grid.bounds
  const dLon = (e - w) / grid.W
  const dLat = (n - s) / grid.H
  return {
    ...grid,
    dLon,
    dLat,
    lonAt: (i) => w + (i + 0.5) * dLon,
    latAt: (j) => n - (j + 0.5) * dLat,
    col: (lon) => (lon - w) / dLon - 0.5,
    row: (lat) => (n - lat) / dLat - 0.5,
    tx: grid.mpt[0],
    tz: grid.mpt[1],
  }
}

/** Rasterise rings (lon/lat) into a mask (even-odd, texel centres). */
function rasterRings(g, rings) {
  const m = new Uint8Array(g.W * g.H)
  if (!rings) return m
  for (let j = 0; j < g.H; j++) {
    const lat = g.latAt(j)
    const xs = []
    for (const r of rings) {
      for (let a = 0, b = r.length - 1; a < r.length; b = a++) {
        const [x1, y1] = r[a]
        const [x2, y2] = r[b]
        if ((y1 > lat) !== (y2 > lat)) xs.push(x1 + ((lat - y1) / (y2 - y1)) * (x2 - x1))
      }
    }
    xs.sort((p, q) => p - q)
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const i0 = Math.max(0, Math.ceil(g.col(xs[k])))
      const i1 = Math.min(g.W - 1, Math.floor(g.col(xs[k + 1])))
      for (let i = i0; i <= i1; i++) m[j * g.W + i] = 1
    }
  }
  return m
}

/** Separable box blur of a float field, radius r texels, n passes (≈ Gaussian). */
function blur(src, W, H, r, n = 3) {
  let a = Float32Array.from(src)
  const b = new Float32Array(W * H)
  for (let pass = 0; pass < n; pass++) {
    for (let j = 0; j < H; j++) {
      let s = 0
      const row = j * W
      for (let i = -r; i <= r; i++) s += a[row + Math.min(W - 1, Math.max(0, i))]
      for (let i = 0; i < W; i++) {
        b[row + i] = s / (2 * r + 1)
        s += a[row + Math.min(W - 1, i + r + 1)] - a[row + Math.max(0, i - r)]
      }
    }
    for (let i = 0; i < W; i++) {
      let s = 0
      for (let j = -r; j <= r; j++) s += b[Math.min(H - 1, Math.max(0, j)) * W + i]
      for (let j = 0; j < H; j++) {
        a[j * W + i] = s / (2 * r + 1)
        s += b[Math.min(H - 1, j + r + 1) * W + i] - b[Math.max(0, j - r) * W + i]
      }
    }
  }
  return a
}

// ---------------------------------------------------------------------------
// The base: the sea floor without the volcanoes

const RIDGE_DEPTH = -4000 // shallower than this is ridge, or a block, or an older seamount
const RIDGE_PAD_KM = 12

export function baseField(present, grid) {
  const g = gridGeom(grid)
  const F = 8 // coarse cells of 8x8 texels (~3.7 km)
  const cw = Math.ceil(g.W / F)
  const ch = Math.ceil(g.H / F)
  const coarse = new Float32Array(cw * ch)
  const known = new Uint8Array(cw * ch)
  const buf = []
  for (let cj = 0; cj < ch; cj++) {
    for (let ci = 0; ci < cw; ci++) {
      buf.length = 0
      for (let j = cj * F; j < Math.min(g.H, (cj + 1) * F); j++) for (let i = ci * F; i < Math.min(g.W, (ci + 1) * F); i++) buf.push(present[j * g.W + i])
      buf.sort((p, q) => p - q)
      coarse[cj * cw + ci] = buf[Math.floor(buf.length * 0.25)]
      known[cj * cw + ci] = buf[buf.length - 1] < RIDGE_DEPTH ? 1 : 0
    }
  }
  // pad the ridge mask
  const pad = Math.ceil((RIDGE_PAD_KM * 1000) / (g.tx * F))
  const ridge = new Uint8Array(cw * ch)
  for (let cj = 0; cj < ch; cj++) for (let ci = 0; ci < cw; ci++) if (!known[cj * cw + ci]) {
    for (let dj = -pad; dj <= pad; dj++) for (let di = -pad; di <= pad; di++) {
      if (di * di + dj * dj > pad * pad) continue
      const a = ci + di
      const b = cj + dj
      if (a >= 0 && b >= 0 && a < cw && b < ch) ridge[b * cw + a] = 1
    }
  }
  // harmonic fill under the ridge (Jacobi, from the mean of the known floor)
  let mean = 0
  let nk = 0
  for (let o = 0; o < cw * ch; o++) if (!ridge[o]) { mean += coarse[o]; nk++ }
  mean /= nk
  const v = Float32Array.from(coarse, (x, o) => (ridge[o] ? mean : x))
  const tmp = new Float32Array(cw * ch)
  for (let it = 0; it < 4000; it++) {
    for (let cj = 0; cj < ch; cj++) for (let ci = 0; ci < cw; ci++) {
      const o = cj * cw + ci
      if (!ridge[o]) { tmp[o] = v[o]; continue }
      const l = v[cj * cw + Math.max(0, ci - 1)]
      const r = v[cj * cw + Math.min(cw - 1, ci + 1)]
      const u = v[Math.max(0, cj - 1) * cw + ci]
      const d = v[Math.min(ch - 1, cj + 1) * cw + ci]
      tmp[o] = (l + r + u + d) / 4
    }
    v.set(tmp)
  }
  const sm = blur(v, cw, ch, 2, 2)
  // back to the full grid, bilinear, and never above today's floor
  const B = new Float32Array(g.W * g.H)
  for (let j = 0; j < g.H; j++) {
    const y = Math.min(ch - 1.001, Math.max(0, (j + 0.5) / F - 0.5))
    const y0 = Math.floor(y)
    const ty = y - y0
    for (let i = 0; i < g.W; i++) {
      const x = Math.min(cw - 1.001, Math.max(0, (i + 0.5) / F - 0.5))
      const x0 = Math.floor(x)
      const tx = x - x0
      const a = sm[y0 * cw + x0] * (1 - tx) + sm[y0 * cw + x0 + 1] * tx
      const b = sm[(y0 + 1) * cw + x0] * (1 - tx) + sm[(y0 + 1) * cw + x0 + 1] * tx
      const o = j * g.W + i
      B[o] = Math.min(present[o], a * (1 - ty) + b * ty)
    }
  }
  return B
}

// ---------------------------------------------------------------------------
// The profile, fitted to the living shields

const FIT = [
  { id: 'mauna-loa', sectors: [[200, 280]], why: 'the south-west rift and the Kona flank, away from Hualālai, Mauna Kea and Kīlauea' },
  { id: 'kilauea', sectors: [[145, 215]], why: 'the south flank, from the summit to the toe of the Hilina bench' },
]
const BAND = 500
const SUB_BANDS = 12 // 0 .. −6,000 m

export const PROFILE_NOTE =
  'z(d) at distance d from a summit of height h: above sea level h − d·tan(α); below it, the slope of each 500 m band of depth; ' +
  'down to the base. Fitted to the median heights by distance on the sectors named, from the seafloor pack.'

export function fitProfile(present, grid, volcanoes, log) {
  const g = gridGeom(grid)
  const byId = Object.fromEntries(volcanoes.map((v) => [v.id, v]))
  const fits = []
  let num = 0
  let den = 0
  const bandTan = Array.from({ length: SUB_BANDS }, () => [])
  for (const f of FIT) {
    const v = byId[f.id]
    const sx = (v.summit.lon - g.bounds[0]) * KX
    const sz = (g.bounds[3] - v.summit.lat) * KZ
    const bins = new Map()
    const R = 140000
    const i0 = Math.max(0, Math.floor(g.col(v.summit.lon) - R / g.tx))
    const i1 = Math.min(g.W - 1, Math.ceil(g.col(v.summit.lon) + R / g.tx))
    const j0 = Math.max(0, Math.floor(g.row(v.summit.lat) - R / g.tz))
    const j1 = Math.min(g.H - 1, Math.ceil(g.row(v.summit.lat) + R / g.tz))
    let h = -Infinity
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const dx = (i + 0.5) * g.tx - sx
      const dz = (j + 0.5) * g.tz - sz
      const d = Math.hypot(dx, dz)
      if (d > R) continue
      const z = present[j * g.W + i]
      if (d < 3000 && z > h) h = z
      const brg = ((Math.atan2(dx, -dz) * 180) / Math.PI + 360) % 360
      if (!f.sectors.some(([a, b]) => brg >= a && brg <= b)) continue
      const k = Math.floor(d / 1000)
      if (!bins.has(k)) bins.set(k, [])
      bins.get(k).push(z)
    }
    const prof = [...bins.keys()].sort((a, b) => a - b).map((k) => {
      const zs = bins.get(k).sort((a, b) => a - b)
      return { d: (k + 0.5) * 1000, z: zs[zs.length >> 1] }
    })
    // subaerial: least squares through the summit
    let coast = null
    for (const p of prof) {
      if (p.z > 0) { num += (h - p.z) * p.d; den += p.d * p.d }
      else if (coast == null) coast = p.d
    }
    // submarine: where the median profile first crosses each band edge
    const cross = []
    for (let b = 0; b <= SUB_BANDS; b++) {
      const level = -b * BAND
      const p = prof.find((q) => q.d >= (coast ?? 0) && q.z <= level)
      cross.push(p ? p.d : null)
    }
    for (let b = 0; b < SUB_BANDS; b++) {
      if (cross[b] != null && cross[b + 1] != null && cross[b + 1] > cross[b]) bandTan[b].push(BAND / (cross[b + 1] - cross[b]))
    }
    fits.push({ volcano: f.id, summitMetres: Math.round(h), sectorsDeg: f.sectors, why: f.why, coastKm: coast && Math.round(coast / 100) / 10, crossKm: cross.map((c) => (c == null ? null : Math.round(c / 100) / 10)) })
  }
  const tanA = num / den
  // a band neither shield reaches takes the band above it
  const sub = []
  for (let b = 0; b < SUB_BANDS; b++) {
    const t = bandTan[b].length ? bandTan[b].reduce((s, x) => s + x, 0) / bandTan[b].length : sub[b - 1]
    sub.push(t)
  }
  // the slope only eases with depth (a band read steeper than the one above it is noise in the medians), then smoothed
  for (let b = 1; b < SUB_BANDS; b++) sub[b] = Math.min(sub[b], sub[b - 1])
  const raw = sub.slice()
  for (let b = 0; b < SUB_BANDS; b++) sub[b] = (raw[Math.max(0, b - 1)] + 2 * raw[b] + raw[Math.min(SUB_BANDS - 1, b + 1)]) / 4
  // cumulative horizontal distance from sea level down to each 10 m level
  const STEP = 10
  const NL = (SUB_BANDS * BAND) / STEP
  const Dsub = new Float64Array(NL + 1)
  for (let k = 1; k <= NL; k++) Dsub[k] = Dsub[k - 1] + STEP / sub[Math.min(SUB_BANDS - 1, Math.floor(((k - 0.5) * STEP) / BAND))]
  const dsub = (z) => {
    const k = Math.min(NL, Math.max(0, -z / STEP))
    const k0 = Math.floor(k)
    return k0 >= NL ? Dsub[NL] : Dsub[k0] + (k - k0) * (Dsub[k0 + 1] - Dsub[k0])
  }
  const zsub = (d) => {
    // inverse of dsub; below the deepest level, the deepest level
    if (d <= 0) return 0
    if (d >= Dsub[NL]) return -SUB_BANDS * BAND
    let lo = 0
    let hi = NL
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1
      if (Dsub[mid] <= d) lo = mid
      else hi = mid
    }
    return -(lo + (d - Dsub[lo]) / (Dsub[hi] - Dsub[lo])) * STEP
  }
  /** height at distance d (m) from a summit of height h */
  const at = (h, d) => {
    if (h > 0) {
      const d0 = h / tanA
      return d <= d0 ? h - d * tanA : zsub(d - d0)
    }
    return zsub(dsub(h) + d)
  }
  /** distance from a summit of height h down to level z (z ≤ h) */
  const dist = (h, z) => {
    if (h > 0) return z >= 0 ? (h - z) / tanA : h / tanA + dsub(z)
    return dsub(z) - dsub(h)
  }
  const deg = (t) => Math.round((Math.atan(t) * 180) / Math.PI * 100) / 100
  const entry = {
    rule: PROFILE_NOTE,
    subaerialSlopeDeg: deg(tanA),
    submarine: sub.map((t, b) => ({ fromMetres: -b * BAND, toMetres: -(b + 1) * BAND, slopeDeg: deg(t) })),
    fittedTo: fits,
  }
  log(`  profile: ${entry.subaerialSlopeDeg}° above sea level; below, ${entry.submarine.map((s) => s.slopeDeg).join(', ')}° per 500 m band`)
  return { entry, at, dist, tanA }
}

// ---------------------------------------------------------------------------
// Subsidence

// The measured rates the curve is fitted to, until volcanoes.json gives its
// own `subsidence` (mm a year) per volcano.
export const SUBSIDENCE_CALIBRATION = [
  { volcano: 'mauna-loa', rate: 2.6, what: 'Hawaiʻi: drowned reefs off Kona and Hilo and the HSDP cores, about 2.4–2.6 mm a year (Moore 1987; Ludwig et al. 1991)' },
  { volcano: 'haleakala', rate: 0.8, what: 'Maui: the relative sea-level trend at Kahului less Honolulu\'s (NOAA tide gauges), under 1 mm a year' },
  { volcano: 'koolau', rate: 0, what: 'Oʻahu: about stable, if anything rising a few hundredths of a millimetre a year on the flexural arch (Ludwig et al. 1991; Grigg and Jones 1997)' },
  { volcano: 'kauai', rate: 0, what: 'Kauaʻi: about stable' },
]

/** Where volcanoes.json gives a volcano a negative rate (Oʻahu rising on the arch), how much lower it stood at A. */
function upliftOf(volcanoes) {
  const byId = Object.fromEntries(volcanoes.map((v) => [v.id, v]))
  return (id, A) => {
    const raw = byId[id]?.subsidenceRaw
    if (!raw || !(raw.rate < 0)) return 0
    return -raw.rate * 1000 * Math.min(A, raw.since ?? A)
  }
}

/**
 * The subsidence curve. By default fitted to the measured rates per volcano
 * (volcanoes.json `subsidence`, else the table above); with mode 'rule' the
 * research's stated rule (volcanoes.json subsidenceRule) as it stands.
 */
export function fitSubsidence(volcanoes, log, rule, mode = 'fit') {
  if (mode === 'rule' && rule && rule.loadRate > 0 && rule.loadDurationMa > 0) return ruleSubsidence(volcanoes, log, rule)
  const byId = Object.fromEntries(volcanoes.map((v) => [v.id, v]))
  const pts = []
  for (const v of volcanoes) if (v.from === 'volcanoes.json' && v.subsidence != null && v.subsidence >= 0) pts.push({ volcano: v.id, rate: v.subsidence, what: `volcanoes.json, ${v.name}` })
  const cal = pts.length >= 2 ? pts : SUBSIDENCE_CALIBRATION
  // r0: the mean of the rates while a shield is building (τ ≤ 0)
  const active = cal.filter((c) => byId[c.volcano] && byId[c.volcano].shield.to <= 0.01 && c.rate > 0)
  const r0 = active.length ? active.reduce((s, c) => s + c.rate, 0) / active.length : 2.6
  // τ0: least squares on ln(r/r0) = −τ/τ0 over the rates measurably above zero
  let sxx = 0
  let sxy = 0
  for (const c of cal) {
    const v = byId[c.volcano]
    if (!v || v.shield.to <= 0.01 || !(c.rate > 0.05)) continue
    const tau = v.shield.to
    sxx += tau * tau
    sxy += tau * Math.log(c.rate / r0)
  }
  const tau0 = sxx > 0 ? -sxx / sxy : 0.8
  /** metres sunk between age A (Ma) and today by a volcano whose shield ended at te (Ma) */
  const since = (te, A) => {
    // ∫_0^A r(te − t) dt, r(τ) = r0 for τ ≤ 0, r0·exp(−τ/τ0) for τ > 0; r in mm/yr = km/Ma... m: × 1000
    const K = r0 * 1000 // metres per Ma at r0
    let m = 0
    // part of [0, A] with te − t ≤ 0 (t ≥ te): still building
    if (A > te) m += K * (A - Math.max(te, 0))
    // part with te − t > 0: t in [0, min(A, te)]
    const t1 = Math.min(A, te)
    if (t1 > 0) m += K * tau0 * (Math.exp(-(te - t1) / tau0) - Math.exp(-te / tau0))
    return m
  }
  const entry = {
    rule: 'a volcano sinks at r0 while its shield builds and at r0·exp(−τ/τ0) after, τ the time since its shield ended, fitted (least squares on ln r) to the measured rates below; where a volcano rises (Oʻahu on the arch) it stood lower by that uplift; at a stage a volcano stands higher than today by what it has sunk since, a field that blends the volcanoes by distance and tapers to nothing at the base',
    from: 'fitted',
    r0MmPerYear: Math.round(r0 * 100) / 100,
    tau0Ma: Math.round(tau0 * 1000) / 1000,
    totalAfterShieldMetres: Math.round(r0 * tau0 * 1000),
    calibration: cal.map((c) => ({ ...c, tauMa: byId[c.volcano]?.shield.to ?? null })),
    confidence: 'sketch',
  }
  entry.sources = [...new Set(volcanoes.filter((v) => v.subsidenceRaw).flatMap((v) => v.subsidenceRaw.sources || []))]
  if (rule) entry.ruleNotUsed =
    `volcanoes.json's subsidenceRule (${rule.loadRate} mm a year for ${rule.loadDurationMa} Ma after a shield, then ${rule.thermalRate}) lifts every young shield ${Math.round(rule.loadRate * rule.loadDurationMa * 1000)} m, ` +
    'which in this model joins Oʻahu to Penguin Bank and Molokaʻi from 2 Ma and Maui Nui to Oʻahu at 1.2 Ma; the curve fitted to the measured rates is used instead (bake-geology.mjs --subsidence rule draws the rule)'
  log(`  subsidence: r0 ${entry.r0MmPerYear} mm/yr, τ0 ${entry.tau0Ma} Ma, ${entry.totalAfterShieldMetres} m after a shield ends (fitted)`)
  return { entry, since, r0, tau0, uplift: upliftOf(volcanoes) }
}

// ---------------------------------------------------------------------------
// One stage

/**
 * The research's rule (volcanoes.json subsidenceRule): the load rate while a
 * shield builds and for loadDurationMa after it ends, the thermal rate after;
 * and where a volcano's own `subsidence` is negative (Oʻahu rising on the
 * arch) that uplift over its `since`.
 */
function ruleSubsidence(volcanoes, log, rule) {
  const r0 = rule.loadRate
  const r1 = rule.thermalRate ?? 0
  const D = rule.loadDurationMa
  /** metres sunk between age A (Ma) and today by a volcano whose shield ended at te (Ma) */
  const since = (te, A) => {
    // over t in [0, A] (Ma ago): the load rate while t > te − D, the thermal rate after
    const cut = Math.min(A, Math.max(0, te - D))
    return 1000 * (r0 * (A - cut) + r1 * cut)
  }
  const uplift = upliftOf(volcanoes)
  const entry = {
    rule: `a volcano sinks at ${r0} mm a year while its shield builds and for ${D} Ma after it ends (the load), then at ${r1} mm a year (the cooling plate); ` +
      'where volcanoes.json gives a volcano a negative rate (Oʻahu rising on the arch) it stood lower by that uplift over the time given; ' +
      'at a stage a volcano stands higher than today by what it has sunk since, a field that blends the volcanoes by distance and tapers to nothing at the base',
    from: 'volcanoes.json subsidenceRule',
    loadRateMmPerYear: r0,
    loadDurationMa: D,
    thermalRateMmPerYear: r1,
    totalAfterShieldMetres: Math.round(r0 * D * 1000),
    sources: [...new Set([...(rule.loadSources || []), ...(rule.thermalSources || []), ...(rule.oahuSources || [])])],
    confidence: 'soft',
  }
  log(`  subsidence: ${r0} mm/yr for ${D} Ma after a shield, then ${r1} mm/yr (volcanoes.json)`)
  return { entry, since, uplift }
}

// A shield this close to its full height (the cube root of its time built)
// is drawn with today's shape rather than the bare profile.
const NEAR_END = 0.85
const REF = -2000 // the depth the profile is stretched to meet, by direction
const REF_BAND = 600 // below REF − REF_BAND today's floor alone; above REF the profile; between, a blend
const OWN_KM = 130 // a texel belongs to a volcano within this distance, by a distance weighted by its size
const LIFT_TAPER = 2500 // the lift fades to nothing over this much height above the base
const LIFT_BLEND_KM = 30 // the lift field blends neighbouring volcanoes over about this distance
const FEATHER_KM = 8 // a complete shield's surface eases into its profile within this distance of a volcano not yet there
const NDIR = 180

function prepare(ctx) {
  if (ctx.prep) return ctx.prep
  const { present, grid, research } = ctx
  const g = gridGeom(grid)
  const N = g.W * g.H
  const B = baseField(present, grid)
  const vols = research.volcanoes.map((v) => {
    const cx = (v.summit.lon - g.bounds[0]) * KX
    const cz = (g.bounds[3] - v.summit.lat) * KZ
    return { ...v, cx, cz, top: -Infinity, base: 0 }
  })
  // summit heights today: the highest texel within 6 km (the ridge above Koʻolau's drowned caldera, for one)
  for (const v of vols) {
    const r = 6000
    for (let j = Math.max(0, Math.floor((v.cz - r) / g.tz)); j <= Math.min(g.H - 1, Math.ceil((v.cz + r) / g.tz)); j++) {
      for (let i = Math.max(0, Math.floor((v.cx - r) / g.tx)); i <= Math.min(g.W - 1, Math.ceil((v.cx + r) / g.tx)); i++) {
        if (Math.hypot((i + 0.5) * g.tx - v.cx, (j + 0.5) * g.tz - v.cz) <= r) v.top = Math.max(v.top, present[j * g.W + i])
      }
    }
    const o = Math.max(0, Math.min(g.H - 1, Math.round(g.row(v.summit.lat)))) * g.W + Math.max(0, Math.min(g.W - 1, Math.round(g.col(v.summit.lon))))
    v.base = B[o]
    v.size = Math.max(2, (v.top - v.base) / 1000)
  }
  // ownership: nearest summit by distance / size, where the ridge stands above the base
  const owner = new Int16Array(N).fill(-1)
  const dOwn = new Float32Array(N)
  for (let j = 0; j < g.H; j++) for (let i = 0; i < g.W; i++) {
    const o = j * g.W + i
    if (present[o] - B[o] < 100) continue
    const x = (i + 0.5) * g.tx
    const z = (j + 0.5) * g.tz
    let best = Infinity
    let bk = -1
    let bd = 0
    for (let k = 0; k < vols.length; k++) {
      const d = Math.hypot(x - vols[k].cx, z - vols[k].cz)
      if (d > OWN_KM * 1000) continue
      const w = d / vols[k].size
      if (w < best) { best = w; bk = k; bd = d }
    }
    owner[o] = bk
    dOwn[o] = bd
  }
  // slides: scar and deep-floor debris masks
  const slides = research.slides.map((s) => {
    const scar = rasterRings(g, s.scar)
    const field = rasterRings(g, s.field)
    const debris = new Uint8Array(N)
    for (let o = 0; o < N; o++) if (field[o] && !scar[o] && present[o] < -3000 && present[o] - B[o] > 0) debris[o] = 1
    const k = vols.findIndex((v) => v.id === s.volcano)
    return { ...s, k, scarMask: scar, scarSoft: blur(scar, g.W, g.H, Math.max(1, Math.round(1500 / g.tx)), 3), debris }
  })
  // each volcano's reach by direction: where its flank first crosses REF today,
  // outside every scar and inside its own ground; elsewhere, from the directions either side
  for (let k = 0; k < vols.length; k++) {
    const v = vols[k]
    const reach = new Float32Array(NDIR).fill(NaN)
    for (let a = 0; a < NDIR; a++) {
      const th = (a / NDIR) * 2 * Math.PI
      const ux = Math.sin(th)
      const uz = -Math.cos(th)
      for (let d = 500; d < OWN_KM * 1000; d += g.tx / 2) {
        const i = Math.floor((v.cx + ux * d) / g.tx)
        const j = Math.floor((v.cz + uz * d) / g.tz)
        if (i < 0 || j < 0 || i >= g.W || j >= g.H) break
        const o = j * g.W + i
        if (owner[o] !== k && present[o] > REF) break // into a neighbour above REF: no reach this way
        if (slides.some((s) => s.k === k && s.scarMask[o])) break
        if (present[o] <= REF) { reach[a] = d; break }
      }
    }
    // fill the unconstrained directions circularly from their constrained neighbours
    const known = [...reach.keys()].filter((a) => reach[a] === reach[a])
    const out = new Float32Array(NDIR)
    if (!known.length) out.fill(30000)
    else for (let a = 0; a < NDIR; a++) {
      if (reach[a] === reach[a]) { out[a] = reach[a]; continue }
      let p = a
      let q = a
      let dp = 0
      let dq = 0
      while (reach[p] !== reach[p]) { p = (p - 1 + NDIR) % NDIR; dp++ }
      while (reach[q] !== reach[q]) { q = (q + 1) % NDIR; dq++ }
      out[a] = (reach[p] * dq + reach[q] * dp) / (dp + dq)
    }
    // smooth a little, circularly
    // capped about its median (a long submarine ridge, Kaʻena's for one, must not draw the shield out along it), then smoothed over ±16°
    const med = [...out].sort((p, q) => p - q)[NDIR >> 1]
    for (let a = 0; a < NDIR; a++) out[a] = Math.max(0.6 * med, Math.min(1.6 * med, out[a]))
    const sm = new Float32Array(NDIR)
    for (let a = 0; a < NDIR; a++) {
      let s = 0
      for (let t = -8; t <= 8; t++) s += out[(a + t + NDIR) % NDIR]
      sm[a] = s / 17
    }
    v.reach = sm
    v.constrained = known.length
  }
  ctx.prep = { g, B, vols, owner, dOwn, slides }
  return ctx.prep
}

export function stageAge(st) {
  return Math.round(st.age * 1000) / 1000
}

export function buildStage(st, ctx, ageOverride) {
  const { research, profile, subsidence } = ctx
  const A = ageOverride ?? stageAge(st)
  const entryBase = {
    id: st.id,
    label: st.label,
    age: A,
    agePrecision: st.agePrecision,
    method: st.reuse ? 'survey' : 'modelled',
    seaLevel: 0,
    confidence: st.confidence,
  }
  if (st.reuse) {
    return {
      reuse: true,
      age: A,
      entry: { ...entryBase, rule: 'today: the seafloor pack (GMRT and 3DEP), a survey, not a model', ...(st.proposed ? { proposed: st.proposed } : {}), sources: ctx.seafloorSources || [] },
    }
  }
  const { g, B, vols, owner, slides } = prepare(ctx)
  const { present } = ctx
  const N = g.W * g.H
  // each volcano at this stage
  const state = vols.map((v) => {
    const { from: ts, to: te } = v.shield
    if (A >= ts) return { kind: 'unborn' }
    const Send = subsidence.since(te, Math.max(te, 0))
    if (A > te) {
      // still building: the profile alone, self-similar
      const Hend = v.top + Send
      const share = Math.cbrt((ts - A) / (ts - te))
      const h = v.base + (Hend - v.base) * share
      if (share >= NEAR_END) {
        // near the end of its shield: today's shape, lowered by the height still to grow (or raised by the sinking to come)
        const lift = Send - (Hend - h) - subsidence.uplift(v.id, A)
        return { kind: 'complete', nearEnd: true, share, h, lift, k: scaleOf(v, profile, h, REF + lift), w: 1 }
      }
      const k = scaleOf(v, profile, Hend, REF + Send)
      return { kind: 'growing', h, k, share }
    }
    const lift = subsidence.since(te, A) - subsidence.uplift(v.id, A)
    const h = v.top + lift
    return { kind: 'complete', h, lift, k: scaleOf(v, profile, h, REF + lift), w: te > 0 ? Math.min(1, A / te) ** 2 : 1 }
  })
  // the lift and the erosion still to come, as smooth fields: the complete shields blended by distance
  const lift = new Float32Array(N)
  const wfield = new Float32Array(N)
  const done = vols.map((v, k) => k).filter((k) => state[k].kind === 'complete')
  const L2 = (LIFT_BLEND_KM * 1000) ** 2
  if (done.length) for (let j = 0; j < g.H; j++) for (let i = 0; i < g.W; i++) {
    const o = j * g.W + i
    const x = (i + 0.5) * g.tx
    const z = (j + 0.5) * g.tz
    let dmin = Infinity
    const d2 = done.map((k) => {
      const d = (x - vols[k].cx) ** 2 + (z - vols[k].cz) ** 2
      if (d < dmin) dmin = d
      return d
    })
    let sw = 0
    let sv = 0
    let ww = 0
    for (let t = 0; t < done.length; t++) {
      const w = Math.exp(-(d2[t] - dmin) / L2)
      sw += w
      sv += w * state[done[t]].lift
      ww += w * state[done[t]].w
    }
    const taper = Math.min(1, Math.max(0, (present[o] - B[o]) / LIFT_TAPER))
    lift[o] = (sv / sw) * taper
    wfield[o] = ww / sw
  }
  // the profiles: the envelope of the complete shields, and of the shields still building
  const Penv = new Float32Array(N).fill(-Infinity)
  const Pgrow = new Float32Array(N).fill(-Infinity)
  for (let k = 0; k < vols.length; k++) {
    const s = state[k]
    if (s.kind === 'unborn') continue
    const v = vols[k]
    const into = s.kind === 'complete' ? Penv : Pgrow
    const R = s.k.max * profile.dist(s.h, -SUB_DEEP)
    const i0 = Math.max(0, Math.floor((v.cx - R) / g.tx))
    const i1 = Math.min(g.W - 1, Math.ceil((v.cx + R) / g.tx))
    const j0 = Math.max(0, Math.floor((v.cz - R) / g.tz))
    const j1 = Math.min(g.H - 1, Math.ceil((v.cz + R) / g.tz))
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const o = j * g.W + i
      const P = profAt(v, s, profile, (i + 0.5) * g.tx, (j + 0.5) * g.tz)
      if (P > into[o]) into[o] = P
    }
  }
  // where the old ground is not there yet: volcanoes not complete, and debris not yet laid
  const happened = slides.map((s) => s.age >= A)
  const absent = new Uint8Array(N)
  for (let o = 0; o < N; o++) {
    const k = owner[o]
    if (k >= 0 && state[k].kind !== 'complete') absent[o] = 1
  }
  for (let s = 0; s < slides.length; s++) {
    if (happened[s]) continue
    const d = slides[s].debris
    for (let o = 0; o < N; o++) if (d[o]) absent[o] = 1
  }
  const feather = featherField(absent, g, FEATHER_KM)
  const Z = new Float32Array(N)
  for (let o = 0; o < N; o++) {
    const k = owner[o]
    if (absent[o]) {
      // the base, under the profiles of whatever stands
      Z[o] = Math.max(B[o], Penv[o], Pgrow[o])
      continue
    }
    if (k < 0 || state[k].kind !== 'complete') {
      Z[o] = Math.max(present[o], Pgrow[o])
      continue
    }
    const P = Math.max(Penv[o], -SUB_DEEP)
    const L = present[o] + lift[o]
    let fill = wfield[o]
    let up = present[o] >= REF ? 1 : present[o] <= REF - REF_BAND ? 0 : (present[o] - (REF - REF_BAND)) / REF_BAND
    // a scar: refilled to the profile before its slide, today's after
    for (let t = 0; t < slides.length; t++) {
      const m = slides[t].scarSoft[o]
      if (m <= 0) continue
      if (happened[t]) fill *= 1 - m
      else {
        fill += (1 - fill) * m
        up = Math.max(up, m)
      }
    }
    const z = L + up * fill * (P - L)
    // ease into the profile toward ground that is not there yet
    Z[o] = Math.max(P + feather[o] * (z - P), Pgrow[o])
  }
  smoothStage(Z, g, present)
  const land = new Uint8Array(N)
  for (let o = 0; o < N; o++) land[o] = Z[o] > 0 ? 1 : 0
  // the rule, written out
  const vs = vols.map((v, k) => ({ v, s: state[k] }))
  const list = (kind) => vs.filter((x) => x.s.kind === kind)
  const fmt = (x) => Math.round(x)
  const rule = [
    `sea level as today (0 m); land ≥ 0.25 m, sea ≤ −1 m.`,
    `Complete shields, or within ${Math.round((1 - NEAR_END) * 100)}% of their full height (${list('complete').map((x) => x.s.nearEnd ? `${x.v.name}, ${Math.round(x.s.share * 100)}% grown (its shield ends at ${x.v.shield.to} Ma), summit ${fmt(x.s.h)} m, today's shape ${x.s.lift >= 0 ? 'raised' : 'lowered'} ${fmt(Math.abs(x.s.lift))} m` : `${x.v.name}, summit ${fmt(x.s.h)} m, lifted ${fmt(x.s.lift)} m, ${Math.round(x.s.w * 100)}% of its erosion still to come`).join('; ') || 'none'}): ` +
      `below ${REF - REF_BAND} m today the sea floor as it is now, lifted by the subsidence since; above ${REF} m the profile at the summit, ` +
      `blended toward today's lifted surface as its erosion runs, by (A / shield end)² of the difference still to go.`,
    `Shields still building (${list('growing').map((x) => `${x.v.name}, summit ${fmt(x.s.h)} m, ${Math.round(x.s.share * 100)}% of its final height above the base`).join('; ') || 'none'}): the profile alone.`,
    `Not yet begun (${list('unborn').map((x) => x.v.name).join(', ') || 'none'}): the base.`,
    `Slides on the volcanoes standing (${slides.map((s, t) => [s, t]).filter(([s]) => s.k < 0 || state[s.k].kind !== 'unborn').map(([s, t]) => `${s.name} ${s.age} Ma ${happened[t] ? 'happened: scar and debris as today' : 'still to come: scar refilled to the profile, debris lifted off'}`).join('; ')}).`,
  ].join(' ')
  const srcs = new Set()
  for (const x of vs) if (x.s.kind !== 'unborn') for (const id of x.v.sources || []) srcs.add(id)
  for (const s of slides) for (const id of s.sources || []) srcs.add(id)
  for (const id of subsidence.entry.sources || []) srcs.add(id)
  for (const id of ['clague-sherrod-2014', 'sherrod-2007-geologic-map']) srcs.add(id)
  if (slides.some((s) => s.from === 'fallback')) srcs.add('moore-1989-prodigious')
  if (st.id.startsWith('maui-nui')) srcs.add('price-elliott-fisk-2004-maui-nui')
  return {
    age: A,
    metres: Z,
    land,
    entry: {
      ...entryBase,
      rule,
      ...(st.proposed ? { proposed: st.proposed } : {}),
      volcanoes: Object.fromEntries(vs.map((x) => [x.v.id, x.s.kind === 'unborn' ? 'unborn' : `${x.s.kind}, summit ${fmt(x.s.h)} m`])),
      inputs: `volcanoes from ${research.used.volcanoes}; slides from ${research.used.landslides}`,
      // the research's ids (sources.json), then the seafloor pack's own provenance, inline
      sources: [...srcs, ...(ctx.seafloorSources || [])],
    },
  }
}

const SUB_DEEP = 5800

// What the model knows is coarser than a texel. A stage is smoothed a little
// (about 0.7 km) where the islands stand and their flanks above −2,500 m, and
// more (about 5 km) on the deep floor, where the stage is today's floor and
// nothing in the model sets its detail; this also keeps the stages small.
const SMOOTH_NEAR = 1
const SMOOTH_DEEP = 10
function smoothStage(Z, g) {
  const a = blur(Z, g.W, g.H, SMOOTH_NEAR, 3)
  const b = blur(Z, g.W, g.H, SMOOTH_DEEP, 3)
  for (let o = 0; o < Z.length; o++) {
    const t = Math.min(1, Math.max(0, (-a[o] - 2500) / 1000))
    Z[o] = t * b[o] + (1 - t) * a[o]
  }
}

/** the per-direction stretch that makes the profile meet `ref` where the volcano meets REF today */
function scaleOf(v, profile, h, ref) {
  const D = profile.dist(h, Math.min(ref, h - 50))
  const k = Float32Array.from(v.reach, (r) => Math.max(0.25, Math.min(4, r / D)))
  k.max = Math.max(...k)
  return k
}

function profAt(v, s, profile, x, z) {
  const dx = x - v.cx
  const dz = z - v.cz
  const d = Math.hypot(dx, dz)
  const th = (Math.atan2(dx, -dz) + 2 * Math.PI) % (2 * Math.PI)
  const a = (th / (2 * Math.PI)) * NDIR
  const a0 = Math.floor(a) % NDIR
  const t = a - Math.floor(a)
  const k = s.k[a0] * (1 - t) + s.k[(a0 + 1) % NDIR] * t
  return profile.at(s.h, d / k)
}

/** 0 on absent ground, rising to 1 at `km` from it (a chamfer distance) */
function featherField(absent, g, km) {
  const N = g.W * g.H
  const INF = 1e9
  const d = new Float32Array(N)
  for (let o = 0; o < N; o++) d[o] = absent[o] ? 0 : INF
  const a = g.tx
  const b = Math.SQRT2 * g.tx
  for (let j = 0; j < g.H; j++) for (let i = 0; i < g.W; i++) {
    const o = j * g.W + i
    let v = d[o]
    if (i > 0) v = Math.min(v, d[o - 1] + a)
    if (j > 0) {
      v = Math.min(v, d[o - g.W] + a)
      if (i > 0) v = Math.min(v, d[o - g.W - 1] + b)
      if (i < g.W - 1) v = Math.min(v, d[o - g.W + 1] + b)
    }
    d[o] = v
  }
  for (let j = g.H - 1; j >= 0; j--) for (let i = g.W - 1; i >= 0; i--) {
    const o = j * g.W + i
    let v = d[o]
    if (i < g.W - 1) v = Math.min(v, d[o + 1] + a)
    if (j < g.H - 1) {
      v = Math.min(v, d[o + g.W] + a)
      if (i < g.W - 1) v = Math.min(v, d[o + g.W + 1] + b)
      if (i > 0) v = Math.min(v, d[o + g.W - 1] + b)
    }
    d[o] = v
  }
  const f = new Float32Array(N)
  const K = km * 1000
  for (let o = 0; o < N; o++) f[o] = Math.min(1, d[o] / K)
  return f
}

// ---------------------------------------------------------------------------
// Stats: land, highest point, per island

export const MAUI_NUI_VOLCANOES = new Set(['west-molokai', 'east-molokai', 'lanai', 'west-maui', 'kahoolawe', 'haleakala'])
const MAUI_NUI = new Set(['Molokaʻi', 'Lānaʻi', 'Maui', 'Kahoʻolawe', 'Penguin Bank'])

export function landStats(metres, _land, grid, volcanoes, age) {
  const g = gridGeom(grid)
  const N = g.W * g.H
  const km2 = (g.tx * g.tz) / 1e6
  const comp = new Int32Array(N).fill(-1)
  const comps = []
  let nLand = 0
  let max = -Infinity
  let min = Infinity
  for (let o = 0; o < N; o++) {
    if (metres[o] > max) max = metres[o]
    if (metres[o] < min) min = metres[o]
    if (metres[o] > 0) nLand++
  }
  const stack = []
  for (let o = 0; o < N; o++) {
    if (!(metres[o] > 0) || comp[o] >= 0) continue
    const id = comps.length
    const c = { n: 0, top: -Infinity, at: o }
    comp[o] = id
    stack.push(o)
    while (stack.length) {
      const p = stack.pop()
      c.n++
      if (metres[p] > c.top) { c.top = metres[p]; c.at = p }
      const i = p % g.W
      for (const q of [i > 0 ? p - 1 : -1, i < g.W - 1 ? p + 1 : -1, p - g.W, p + g.W]) {
        if (q >= 0 && q < N && comp[q] < 0 && metres[q] > 0) { comp[q] = id; stack.push(q) }
      }
    }
    comps.push(c)
  }
  // name each island by the volcanoes whose summits stand on it (or nearest its highest point)
  const born = volcanoes.filter((v) => v.shield.from > age)
  const islands = []
  for (let id = 0; id < comps.length; id++) {
    const c = comps[id]
    const area = c.n * km2
    if (area < 5) continue
    const on = []
    for (const v of born) {
      const i = Math.round(g.col(v.summit.lon))
      const j = Math.round(g.row(v.summit.lat))
      // within 5 km of the summit
      let hit = false
      const r = Math.ceil(5000 / g.tx)
      for (let dj = -r; dj <= r && !hit; dj++) for (let di = -r; di <= r && !hit; di++) {
        const a = i + di
        const b = j + dj
        if (a >= 0 && b >= 0 && a < g.W && b < g.H && comp[b * g.W + a] === id) hit = true
      }
      if (hit) on.push(v)
    }
    const ci = c.at % g.W
    const cj = (c.at - ci) / g.W
    if (!on.length) {
      let best = null
      let bd = Infinity
      for (const v of born) {
        const d = Math.hypot((g.col(v.summit.lon) - ci) * g.tx, (g.row(v.summit.lat) - cj) * g.tz)
        if (d < bd) { bd = d; best = v }
      }
      if (best) on.push(best)
    }
    const names = [...new Set(on.map((v) => v.island))]
    const nui = names.filter((n) => MAUI_NUI.has(n))
    const name = nui.length >= 3 ? ['Maui Nui', ...names.filter((n) => !MAUI_NUI.has(n))].join('–') : names.join('–') || 'unnamed'
    islands.push({
      name,
      volcanoes: on.map((v) => v.id),
      landKm2: Math.round(area),
      highest: { metres: Math.round(c.top), lon: Math.round(g.lonAt(ci) * 1e4) / 1e4, lat: Math.round(g.latAt(cj) * 1e4) / 1e4 },
    })
  }
  islands.sort((a, b) => b.landKm2 - a.landKm2)
  return {
    landKm2: Math.round(nLand * km2),
    landFraction: Math.round((nLand / N) * 1e5) / 1e5,
    minMetres: min,
    maxMetres: max,
    islands,
  }
}
