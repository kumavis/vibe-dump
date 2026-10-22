// Everything the app reads, from one base URL (config.js dataBase): the pack
// manifest and its images, the boundary files, and the gazetteer. Nothing is
// fetched from anywhere else.
//
// Packs decode in a small pool of workers. The archipelago is decoded first,
// during boot; the islands follow in the background, nearest first, and take
// over from the archipelago as the camera comes to them (render/world.js).

import { UNIT } from '../config.js'
import { Projection } from '../geo.js'
import { decodeImage } from './image.js'
import { derivePack } from './decode.js'

async function getJSON(url, fallback, warn) {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    if (fallback === undefined) throw new Error(`${url}: ${err.message}`)
    warn?.(`${url}: ${err.message} (carrying on without it)`)
    return fallback
  }
}

// a file that is one list may also come wrapped, { eras: [...] }
const list = (v, key) => (Array.isArray(v) ? v : Array.isArray(v?.[key]) ? v[key] : [])

/** The manifest, boundaries and gazetteer: everything but the pack images. */
export async function loadData(base, warn = console.warn) {
  const abs = (p) => new URL(p, new URL(base, location.href)).href
  const manifest = await getJSON(abs('manifest.json'))
  const [moku, ahupuaa, eras, places, events, sources, polities] = await Promise.all([
    getJSON(abs('boundaries/moku.geojson'), null, warn),
    getJSON(abs('boundaries/ahupuaa.geojson'), null, warn),
    getJSON(abs('eras.json'), [], warn),
    getJSON(abs('places.json'), [], warn),
    getJSON(abs('events.json'), [], warn),
    getJSON(abs('sources.json'), [], warn),
    getJSON(abs('polities.json'), { polities: [], byEra: {} }, warn),
  ])
  const proj = new Projection(manifest.projection || {})
  const packs = (manifest.packs || []).map((d) => describePack(d, proj, abs))
  return {
    base,
    abs,
    manifest,
    proj,
    packs,
    moku,
    ahupuaa,
    eras: list(eras, 'eras'),
    places: list(places, 'places'),
    events: list(events, 'events'),
    sources: list(sources, 'sources'),
    polities: { polities: polities?.polities || [], byEra: polities?.byEra || {} },
  }
}

/** A manifest entry, placed in the world. */
function describePack(d, proj, abs) {
  const rect = proj.rect(d.bounds)
  const [W, H] = d.size
  return {
    id: d.id,
    kind: d.kind,
    name: d.name || d.id,
    desc: d,
    rect,
    W,
    H,
    // metres per texel from the bounds, so that the texels land exactly where
    // the projection puts them (the manifest's own figure is for reference)
    mx: ((rect.x1 - rect.x0) * UNIT) / W,
    mz: ((rect.z1 - rect.z0) * UNIT) / H,
    heightUrl: abs(d.height.file),
    rainUrl: d.rain?.file ? abs(d.rain.file) : null,
    scale: d.height.scale ?? 0.25,
    offset: d.height.offset ?? -6000,
    sources: d.sources || [],
    data: null,
  }
}

/** Decodes packs in a few workers; falls back to the main thread if workers can't decode images. */
export class PackDecoder {
  constructor(n = 2, warn = console.warn) {
    this.warn = warn
    this.jobs = new Map()
    this.next = 1
    this.workers = []
    this.free = []
    this.queue = []
    try {
      for (let i = 0; i < n; i++) {
        const w = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' })
        w.onmessage = (e) => this.message(w, e.data)
        w.onerror = (e) => {
          // a worker that dies takes its job with it: redo that one here
          e.preventDefault?.()
          this.fallback = true
          for (const [job, j] of this.jobs) if (j.worker === w) this.mainThread(job, j)
        }
        this.workers.push(w)
        this.free.push(w)
      }
    } catch (err) {
      this.fallback = true
    }
  }

  decode(pack) {
    return new Promise((resolve, reject) => {
      const job = this.next++
      const j = { pack, resolve, reject }
      this.jobs.set(job, j)
      if (this.fallback || !this.workers.length) this.mainThread(job, j)
      else {
        this.queue.push(job)
        this.pump()
      }
    })
  }

  pump() {
    while (this.free.length && this.queue.length) {
      const job = this.queue.shift()
      const j = this.jobs.get(job)
      const w = this.free.pop()
      j.worker = w
      const p = j.pack
      w.postMessage({ job, heightUrl: p.heightUrl, rainUrl: p.rainUrl, W: p.W, H: p.H, scale: p.scale, offset: p.offset, mx: p.mx, mz: p.mz })
    }
  }

  message(w, m) {
    const j = this.jobs.get(m.job)
    if (!j) return
    if (m.warn) return this.warn(m.warn)
    this.jobs.delete(m.job)
    this.free.push(w)
    if (m.ok) j.resolve(m)
    else if (/OffscreenCanvas|getContext|createImageBitmap/i.test(m.message)) {
      // (no canvas in workers here: decode on the main thread instead)
      this.fallback = true
      this.jobs.set(m.job, j)
      this.mainThread(m.job, j)
    } else j.reject(new Error(m.message))
    this.pump()
  }

  async mainThread(job, j) {
    try {
      const p = j.pack
      const hi = await decodeImage(p.heightUrl)
      if (hi.W !== p.W || hi.H !== p.H) throw new Error(`${p.heightUrl} is ${hi.W}×${hi.H}, the manifest says ${p.W}×${p.H}`)
      let rainPx = null
      if (p.rainUrl) rainPx = await decodeImage(p.rainUrl).then((r) => (r.W === p.W && r.H === p.H ? r.px : null)).catch(() => null)
      const out = derivePack({ heightPx: hi.px, rainPx, W: p.W, H: p.H, scale: p.scale, offset: p.offset, mx: p.mx, mz: p.mz })
      this.jobs.delete(job)
      j.resolve(out)
    } catch (err) {
      this.jobs.delete(job)
      j.reject(err)
    }
  }

  dispose() {
    for (const w of this.workers) w.terminate()
  }
}
