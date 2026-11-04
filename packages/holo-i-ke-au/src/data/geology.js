// The prologue's data (DATA.md "Geology: the making of the islands"): the
// geology manifest with its seafloor pack, its stages and the hotspot, the
// debris fields, and the chapters with their steps. The JSON is small and
// read with the gazetteer, so the tour can lay the prologue before chapter 1
// from the start; the height images (each one 2048 split-byte PNG on the
// seafloor's grid) are decoded only while the prologue is open
// (render/geology.js), in a worker, straight to half floats for the GPU and a
// coarse copy in metres for the CPU.
//
// Without a geology/ directory there is no prologue, and nothing else changes.

import { decodeImage } from './image.js'

async function quietJSON(url) {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

/**
 * The geology, placed in the world, or null without one. `abs` resolves a
 * path under the data base; `proj` is the shared projection.
 */
export async function loadGeology(abs, proj, warn = console.warn) {
  const manifest = await quietJSON(abs('geology/manifest.json'))
  if (!manifest?.seafloor?.height?.file) return null
  const [chapters, landslides, volcanoes] = await Promise.all([quietJSON(abs('geology/chapters.json')), quietJSON(abs('geology/landslides.geojson')), quietJSON(abs('geology/volcanoes.json'))])
  const list = Array.isArray(chapters) ? chapters : chapters?.chapters
  if (!Array.isArray(list) || !list.length) {
    warn('geology/manifest.json is here but geology/chapters.json has no chapters: no prologue')
    return null
  }
  const sf = manifest.seafloor
  const rect = proj.rect(sf.bounds)
  const [W, H] = sf.size
  const image = (h) => ({ url: abs(`geology/${h.file}`), scale: h.scale ?? 0.25, offset: h.offset ?? -6000 })
  const seafloor = { rect, W, H, ...image(sf.height), stats: sf.stats || null, sources: sf.sources || [] }
  // the stages by age, oldest first; a stage whose image is the seafloor's own,
  // and the present if none is listed, are drawn from the seafloor pack
  const stages = (manifest.stages || [])
    .filter((s) => s?.id && Number.isFinite(s.age))
    .map((s) => ({ ...s, ...(s.height?.file && s.height.file !== sf.height.file ? image(s.height) : { url: null, seafloor: true }) }))
  if (!stages.some((s) => s.id === 'present')) stages.push({ id: 'present', age: 0, method: 'survey', seafloor: true, url: null })
  stages.sort((a, b) => b.age - a.age)
  // the hotspot: the manifest's, else the one volcanoes.json gives (an object
  // file with `volcanoes` and `hotspot`); its point as lon and lat, or `position`
  const hs = manifest.hotspot || (Array.isArray(volcanoes) ? null : volcanoes?.hotspot) || {}
  const [lon, lat] = Array.isArray(hs.position) ? hs.position : [hs.lon, hs.lat]
  const hotspot = {
    lon,
    lat,
    at: Number.isFinite(lon) && Number.isFinite(lat) ? proj.toWorld([lon, lat]) : null,
    // cm a year, and the compass bearing the plate moves toward
    speed: Number.isFinite(hs.speed) ? hs.speed : 0,
    azimuth: Number.isFinite(hs.azimuth) ? hs.azimuth : 295,
    sources: hs.sources || [],
  }
  const fields = new Map()
  for (const f of landslides?.features || []) {
    const p = f.properties || {}
    if (!p.id || f.geometry?.type !== 'Polygon') continue
    fields.set(p.id, { ...p, ring: f.geometry.coordinates[0], scarRing: p.scar?.type === 'Polygon' ? p.scar.coordinates[0] : null, blocks: (p.blocks || []).filter((b) => b?.coordinates || b?.geometry?.coordinates) })
  }
  return { manifest, seafloor, stages, hotspot, fields, chapters: list, sources: manifest.sources || [] }
}

/**
 * The plate's drift at age A (Ma), in world units: where everything the
 * plate carries stood then, relative to where it is now. A stage at age A is
 * drawn displaced south-east by A × speed along the plate's azimuth turned
 * about (DATA.md "Geology", the drift), so the islands slide north-west as
 * the age runs down and the hotspot stays put. (1 Ma at 1 cm a year is 10 km.)
 */
export function driftAt(hotspot, A) {
  const km = Math.max(0, A) * (hotspot?.speed || 0) * 10
  const az = ((hotspot?.azimuth ?? 295) * Math.PI) / 180
  // the plate moves toward az (x east, z south); back in time is the other way
  return [-Math.sin(az) * km * 10, Math.cos(az) * km * 10]
}

const COARSE = 4

/** Decode one split-byte height image to half floats (the GPU's copy) and a coarse Float32 of metres (the CPU's). */
export function decodeHeights(px, W, H, scale, offset) {
  const half = new Uint16Array(W * H)
  const f32 = new Float32Array(1)
  const u32 = new Uint32Array(f32.buffer)
  const toHalf = (v) => {
    f32[0] = v
    const x = u32[0]
    const sign = (x >>> 16) & 0x8000
    let e = ((x >>> 23) & 0xff) - 127 + 15
    const m = x & 0x7fffff
    if (e <= 0) return sign
    if (e >= 31) return sign | 0x7c00
    // (rounded to the nearest)
    let h = sign | (e << 10) | (m >>> 13)
    if (m & 0x1000) h++
    return h
  }
  const cw = Math.ceil(W / COARSE)
  const ch = Math.ceil(H / COARSE)
  const coarse = new Float32Array(cw * ch)
  let lo = Infinity
  let hi = -Infinity
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const k = j * W + i
      const m = (px[k * 4] * 256 + px[k * 4 + 1]) * scale + offset
      half[k] = toHalf(m)
      if (m < lo) lo = m
      if (m > hi) hi = m
      if (i % COARSE === 0 && j % COARSE === 0) coarse[(j / COARSE) * cw + i / COARSE] = m
    }
  }
  return { half, coarse, cw, ch, lo, hi }
}

/** Decodes the geology's height images in a worker (or here, where a worker can't). */
export class GeologyDecoder {
  constructor(warn = console.warn) {
    this.warn = warn
    this.jobs = new Map()
    this.next = 1
    try {
      this.worker = new Worker(new URL('./geology-worker.js', import.meta.url), { type: 'module' })
      this.worker.onmessage = (e) => this.message(e.data)
      this.worker.onerror = (e) => {
        e.preventDefault?.()
        this.worker = null
        for (const [id, j] of this.jobs) this.main(id, j)
      }
    } catch {
      this.worker = null
    }
  }

  decode(img, W, H) {
    return new Promise((resolve, reject) => {
      const id = this.next++
      const j = { img, W, H, resolve, reject }
      this.jobs.set(id, j)
      if (this.worker) this.worker.postMessage({ id, url: img.url, W, H, scale: img.scale, offset: img.offset })
      else this.main(id, j)
    })
  }

  message(m) {
    const j = this.jobs.get(m.id)
    if (!j) return
    if (!m.ok && /OffscreenCanvas|getContext|createImageBitmap/i.test(m.message)) {
      this.worker?.terminate()
      this.worker = null
      return this.main(m.id, j)
    }
    this.jobs.delete(m.id)
    if (m.ok) j.resolve(m.out)
    else j.reject(new Error(m.message))
  }

  async main(id, j) {
    try {
      const im = await decodeImage(j.img.url)
      if (im.W !== j.W || im.H !== j.H) throw new Error(`${j.img.url} is ${im.W}×${im.H}, the geology manifest says ${j.W}×${j.H}`)
      this.jobs.delete(id)
      j.resolve(decodeHeights(im.px, j.W, j.H, j.img.scale, j.img.offset))
    } catch (err) {
      this.jobs.delete(id)
      j.reject(err)
    }
  }

  dispose() {
    this.worker?.terminate()
    this.worker = null
  }
}
