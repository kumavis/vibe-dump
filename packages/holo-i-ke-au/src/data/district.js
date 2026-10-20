// The district packs (DATA.md "District packs"): districts/manifest.json and
// each district's features.json, read behind the first frame, and the pack
// itself decoded in its own worker when the camera comes down to it
// (render/district.js decides when).
//
// The features that are rastered onto the pack's grid (loʻi, fishponds, the
// village) each get an index into the aux map's alpha (DIST_INDEX), and every
// feature keeps its span of years, so the renderer can weigh each one in the
// chosen year.

import { UNIT } from '../config.js'
import { DIST_INDEX } from '../render/shaders/common.glsl.js'
import { decodeImage } from './image.js'
import { deriveDistrict } from './district-decode.js'

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

/** A feature's span of years: [from, to], with open ends as ±Infinity. */
export function spanOf(p) {
  return [Number.isFinite(p?.from) ? p.from : -Infinity, Number.isFinite(p?.to) ? p.to : Infinity]
}

/** Whether a feature applies in a (fractional) year: its to year is the last it holds, whole. */
export function holds(p, year) {
  const [a, b] = spanOf(p)
  return year >= a && year < b + 1
}

function describeDistrict(d, features, data, warn) {
  const proj = data.proj
  const rect = proj.rect(d.bounds)
  const [W, H] = d.size
  const [west, south, east, north] = d.bounds
  const abs = (f) => data.abs(`districts/${f}`)
  const toGrid = ([lon, lat]) => [((lon - west) / (east - west)) * W, ((north - lat) / (north - south)) * H]
  // the rastered features, indexed by kind
  const next = { loi: DIST_INDEX.loi, pond: DIST_INDEX.pond, other: DIST_INDEX.other }
  const limit = { loi: DIST_INDEX.pond - 1, pond: DIST_INDEX.other - 1, other: DIST_INDEX.max }
  const raster = []
  const byIndex = new Map()
  for (const f of features.features || []) {
    const p = f.properties || {}
    const kind = p.kind === 'loi' ? 'loi' : p.kind === 'fishpond' ? 'pond' : p.kind === 'village' ? 'other' : null
    const g = f.geometry
    if (!kind || g?.type !== 'Polygon') continue
    if (next[kind] > limit[kind]) {
      warn(`district ${d.id}: more ${p.kind} features than the aux map has room for; ${p.name} is not drawn`)
      continue
    }
    const index = next[kind]++
    raster.push({ index, kind: kind === 'other' ? p.kind : kind, rings: g.coordinates.map((r) => r.map(toGrid)) })
    byIndex.set(index, f)
  }
  const patches = (d.patches || []).filter((p) => p.file).map((p) => ({ ...p, url: abs(p.file) }))
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
    patches,
    // the patches are one mask here (decode.js); the latest until rules it
    patchUntil: patches.length ? Math.max(...patches.map((p) => (Number.isFinite(p.until) ? p.until : -Infinity))) : -Infinity,
    features,
    raster,
    byIndex,
    sources: d.sources || [],
  }
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
    return {
      heightUrl: d.heightUrl,
      rainUrl: d.rainUrl,
      patchUrls: [...new Set(d.patches.map((p) => p.url))],
      W: d.W,
      H: d.H,
      scale: d.scale,
      offset: d.offset,
      mx: d.mx,
      mz: d.mz,
      rect: { x0: d.rect.x0, z0: d.rect.z0, x1: d.rect.x1, z1: d.rect.z1 },
      features: d.raster.map((f) => ({ index: f.index, kind: f.kind, rings: f.rings })),
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
    if (m.log) return
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
      const patchPx = []
      for (const u of job.patchUrls) {
        const p = await decodeImage(u).catch(() => null)
        if (p && p.W === job.W && p.H === job.H) patchPx.push(p.px)
      }
      const out = deriveDistrict({ ...job, heightPx: hi.px, rainPx, patchPx })
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
