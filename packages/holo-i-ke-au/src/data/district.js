// The district packs (DATA.md "District packs"): districts/manifest.json and
// each district's features.json, read behind the first frame, and the pack
// itself decoded in its own worker when the camera comes down to it
// (render/district.js decides when).
//
// The features that are rastered onto the pack's grid (loʻi, fishponds, the
// village) each get an index into the aux map's alpha (DIST_INDEX), and every
// feature keeps its span of years, so the renderer can weigh each one in the
// chosen year; where a kind has more features than indices (Koʻolaupoko's
// forty loʻi), those of the same years share one.
//
// A district's patches are those its own manifest lists and those
// patches/manifest.json lists for its pack (data/patches.js), any number of
// each kind, each with its own until; the decode lays them all on the grid.

import { UNIT, DIST_PATCHES } from '../config.js'
import { DIST_INDEX } from '../render/shaders/common.glsl.js'
import { decodeImage } from './image.js'
import { deriveDistrict } from './district-decode.js'
import { describePatch, decodeMasks } from './patches.js'

// (lower patches are told apart by a bit each, district-decode.js patchMap)
const MAX_LOWER = 24

async function getJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

/** districts/manifest.json and the features of each district, or [] when there are none. */
export async function loadDistricts(data, warn = console.warn) {
  let man
  try {
    man = await getJSON(data.abs('districts/manifest.json'))
  } catch {
    // (a data set with no districts: the islands are as close as it goes)
    return []
  }
  const out = []
  for (const d of man.districts || []) {
    try {
      let features = { type: 'FeatureCollection', features: [] }
      if (d.features) {
        try {
          features = await getJSON(data.abs(`districts/${d.features}`))
        } catch (err) {
          warn(`districts/${d.features}: ${err.message} (the district is drawn without its features)`)
        }
      }
      out.push(describeDistrict(d, features, data, warn))
    } catch (err) {
      warn(`district ${d.id}: ${err.message}`)
    }
  }
  return out
}

/** The crop a loʻi names (DATA.md "Crops, on the era layers"): 'taro', 'rice', or null for the class its island's map gives. */
export function cropOf(p) {
  return p?.kind === 'loi' && (p.crop === 'taro' || p.crop === 'rice') ? p.crop : null
}

/** A feature's span of years: [from, to], with open ends as ±Infinity. */
export function spanOf(p) {
  return [Number.isFinite(p?.from) ? p.from : -Infinity, Number.isFinite(p?.to) ? p.to : Infinity]
}

/** Whether a feature applies in a (fractional) year: its to year is the last it holds, whole. */
export function holds(p, year) {
  const [a, b] = spanOf(p)
  return year >= a && year < b + 1
}

/**
 * The feature of a district's aux index that holds a year (its properties),
 * or null: of the loʻi on one outline, the one whose years hold it.
 */
export function holding(d, index, year) {
  for (const p of d.members.get(index) || []) if (holds(p, year)) return p
  return null
}

/** Bounding box of a feature's outer ring, lon/lat. */
function boxOf(f) {
  const r = f.geometry.coordinates[0]
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (const [x, y] of r) {
    x0 = Math.min(x0, x)
    y0 = Math.min(y0, y)
    x1 = Math.max(x1, x)
    y1 = Math.max(y1, y)
  }
  return [x0, y0, x1, y1]
}

/** How much two boxes are one: their overlap over their union. */
function sameBox(a, b) {
  const w = Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0]))
  const h = Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]))
  const u = (a[2] - a[0]) * (a[3] - a[1]) + (b[2] - b[0]) * (b[3] - b[1]) - w * h
  return u > 0 ? (w * h) / u : 0
}

function describeDistrict(d, features, data, warn) {
  const proj = data.proj
  const rect = proj.rect(d.bounds)
  const [W, H] = d.size
  const [west, south, east, north] = d.bounds
  const abs = (f) => data.abs(`districts/${f}`)
  const toGrid = ([lon, lat]) => [((lon - west) / (east - west)) * W, ((north - lat) / (north - south)) * H]
  // The rastered features, indexed by kind: an index each while a kind has
  // room for them all; past that, those of the kind with the same years share
  // one, since an index carries nothing but its weight in the year (each
  // keeps its own seed, so a loʻi's terraces are still its own), and of the
  // same crop, for a loʻi that names one. Loʻi on one outline in years that
  // never meet (a rice loʻi on a taro one: DATA.md "Crops, on the era
  // layers") are one loʻi a texel: they take one index, which stands while
  // any of them holds the year and is drawn as the one that does. Each
  // index keeps its features' properties (members).
  const next = { loi: DIST_INDEX.loi, pond: DIST_INDEX.pond, other: DIST_INDEX.other }
  const limit = { loi: DIST_INDEX.pond - 1, pond: DIST_INDEX.other - 1, other: DIST_INDEX.max }
  const kindOf = (p) => (p.kind === 'loi' ? 'loi' : p.kind === 'fishpond' ? 'pond' : p.kind === 'village' ? 'other' : null)
  const drawn = (features.features || []).filter((f) => kindOf(f.properties || {}) && f.geometry?.type === 'Polygon')
  const share = Object.fromEntries(Object.keys(next).map((k) => [k, drawn.filter((f) => kindOf(f.properties) === k).length > limit[k] - next[k] + 1]))
  const outline = new Map()
  const outlines = []
  for (const f of drawn) {
    if (kindOf(f.properties) !== 'loi') continue
    const box = boxOf(f)
    const [a, b] = spanOf(f.properties)
    const meet = (q) => {
      const [c, e] = spanOf(q.f.properties)
      return a < e + 1 && c < b + 1
    }
    let g = outlines.find((o) => o.some((q) => sameBox(q.box, box) > 0.6) && !o.some(meet))
    if (!g) outlines.push((g = []))
    g.push({ f, box })
    outline.set(f, g)
  }
  const keyOf = (f) => {
    const g = outline.get(f)
    return (g ? g.map((q) => q.f.properties) : [f.properties]).map((p) => `${spanOf(p).join(' ')} ${cropOf(p) ?? ''}`).sort().join('|')
  }
  const bySpan = new Map()
  const byOutline = new Map()
  const raster = []
  const byIndex = new Map()
  const members = new Map()
  // (every rastered feature with its index, where several may share one)
  const rastered = []
  for (const f of drawn) {
    const p = f.properties
    const kind = kindOf(p)
    const seed = DIST_INDEX[kind] + rastered.filter((r) => kindOf(r.f.properties) === kind).length
    const span = `${kind} ${keyOf(f)}`
    const g = outline.get(f)
    let index = share[kind] ? bySpan.get(span) : byOutline.get(g)
    if (index === undefined) {
      if (next[kind] > limit[kind]) {
        warn(`district ${d.id}: more ${p.kind} features in years of their own than the aux map has room for; ${p.name} is not drawn`)
        continue
      }
      index = next[kind]++
      if (share[kind]) bySpan.set(span, index)
      if (g) byOutline.set(g, index)
    }
    raster.push({ index, seed, kind: kind === 'other' ? p.kind : kind, rings: f.geometry.coordinates.map((r) => r.map(toGrid)) })
    if (!byIndex.has(index)) {
      byIndex.set(index, f)
      members.set(index, g ? g.map((q) => q.f.properties) : [p])
    }
    rastered.push({ index, f })
  }
  // its own manifest's patches (DATA.md: kind defaults to lower, depth to -1)
  const own = (d.patches || []).map((p) => describePatch(p, abs, (m) => warn(`district ${d.id}: ${m}`), d.id)).filter(Boolean)
  return {
    id: d.id,
    name: d.name || d.id,
    parent: d.parent || d.island,
    desc: d,
    bounds: d.bounds,
    rect,
    W,
    H,
    // (metres per texel from the bounds, as the island packs: data/load.js)
    mx: ((rect.x1 - rect.x0) * UNIT) / W,
    mz: ((rect.z1 - rect.z0) * UNIT) / H,
    heightUrl: abs(d.height.file),
    rainUrl: d.rain?.file ? abs(d.rain.file) : null,
    scale: d.height.scale ?? 0.25,
    offset: d.height.offset ?? -6000,
    own,
    patches: own,
    features,
    raster,
    // each index's feature (the first of those sharing it) and its features' properties (holding), and every rastered feature with its index
    byIndex,
    members,
    rastered,
    sources: d.sources || [],
  }
}

/**
 * A district's patches: its own and those `extra` (patches/manifest.json)
 * lists for it, as many of each kind as the decode can tell apart.
 */
export function districtPatches(d, extra = [], warn = console.warn) {
  const all = [...d.own, ...extra.filter((p) => p.pack === d.id)]
  const lower = all.filter((p) => p.kind === 'lower')
  const raise = all.filter((p) => p.kind === 'raise')
  if (lower.length > MAX_LOWER) warn(`district ${d.id}: ${lower.length} lower patches, ${MAX_LOWER} drawn`)
  if (raise.length > DIST_PATCHES) warn(`district ${d.id}: ${raise.length} raise patches, ${DIST_PATCHES} drawn`)
  return [...raise.slice(0, DIST_PATCHES), ...lower.slice(0, MAX_LOWER)]
}

/** Decodes a district in a worker of its own; on the main thread where workers can't decode images. */
export class DistrictDecoder {
  constructor(warn = console.warn) {
    this.warn = warn
    this.jobs = new Map()
    this.n = 0
    try {
      this.worker = new Worker(new URL('./district-worker.js', import.meta.url), { type: 'module' })
      this.worker.onmessage = (e) => this.message(e.data)
      this.worker.onerror = (e) => {
        e.preventDefault?.()
        this.fallback = true
        for (const [id, j] of this.jobs) this.mainThread(id, j)
      }
    } catch {
      this.fallback = true
    }
  }

  job(d) {
    // each mask once (two patches may share one), and each patch by its mask
    const masks = []
    const at = (p) => {
      let i = masks.findIndex((m) => m.url === p.url)
      if (i < 0) i = masks.push({ url: p.url, size: p.size }) - 1
      return i
    }
    const lower = d.patches.filter((p) => p.kind === 'lower').map(at)
    const raise = d.patches.filter((p) => p.kind === 'raise')
    return {
      heightUrl: d.heightUrl,
      rainUrl: d.rainUrl,
      masks,
      lower,
      raise: raise.map(at),
      raiseDepth: raise.map((p) => p.depth),
      W: d.W,
      H: d.H,
      scale: d.scale,
      offset: d.offset,
      mx: d.mx,
      mz: d.mz,
      rect: { x0: d.rect.x0, z0: d.rect.z0, x1: d.rect.x1, z1: d.rect.z1 },
      features: d.raster.map((f) => ({ index: f.index, seed: f.seed, kind: f.kind, rings: f.rings })),
    }
  }

  decode(d) {
    return new Promise((resolve, reject) => {
      const id = ++this.n
      const j = { d, resolve, reject }
      this.jobs.set(id, j)
      if (this.fallback) this.mainThread(id, j)
      else this.worker.postMessage({ id, ...this.job(d) })
    })
  }

  message(m) {
    const j = this.jobs.get(m.id)
    if (!j) return
    if (m.log) return this.warn(m.log)
    this.jobs.delete(m.id)
    if (m.ok) j.resolve(m.out)
    else if (/OffscreenCanvas|getContext|createImageBitmap/i.test(m.message)) {
      this.fallback = true
      this.jobs.set(m.id, j)
      this.mainThread(m.id, j)
    } else j.reject(new Error(m.message))
  }

  async mainThread(id, j) {
    try {
      const job = this.job(j.d)
      const hi = await decodeImage(job.heightUrl)
      if (hi.W !== job.W || hi.H !== job.H) throw new Error(`${job.heightUrl} is ${hi.W}×${hi.H}, the manifest says ${job.W}×${job.H}`)
      const rainPx = job.rainUrl ? await decodeImage(job.rainUrl).then((r) => (r.W === job.W && r.H === job.H ? r.px : null)).catch(() => null) : null
      const masks = await decodeMasks(job, this.warn)
      const out = deriveDistrict({ ...job, heightPx: hi.px, rainPx, masks })
      this.jobs.delete(id)
      j.resolve(out)
    } catch (err) {
      this.jobs.delete(id)
      j.reject(err)
    }
  }

  dispose() {
    this.worker?.terminate()
  }
}
