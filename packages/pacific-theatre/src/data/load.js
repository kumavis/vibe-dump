// Everything the app reads, from one base URL (config.js dataBase): the table
// pack's manifest, the gazetteer and the record around it, and, on demand, a
// battle box's pack, its battle.json and the kits. Nothing is fetched from
// anywhere else (DATA.md §0).
//
// Adapted from holo-i-ke-au's data/load.js (b480c27): getJSON and its "carry on
// without it" fallback, and PackDecoder (a small worker pool with a
// main-thread fallback), are kept; the file list, describePack and the
// normalisation are new.
//
// Longitudes are normalised here and nowhere else (ENGINEERING §3): every
// coordinate of the places, events, routes, fronts, labels and coast is
// wrapped about the table's lon0 once, as it arrives, and every coordinate of
// a battle.json about its box's lon0, so a polygon written across 180° in
// either convention reaches the renderers continuous, and no other module
// sees a raw longitude.

import { TABLE, BOX } from '../config.js'
import { wrapLon, projectionFor, TangentProjection, placement } from '../geo.js'
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

// a file that is one list may also come wrapped, { chapters: [...] }
const list = (v, key) => (Array.isArray(v) ? v : Array.isArray(v?.[key]) ? v[key] : [])

const isPair = (a) => Array.isArray(a) && a.length >= 2 && typeof a[0] === 'number' && typeof a[1] === 'number'

/** Wrap every [lon, lat] in a (nested) coordinate array about lon0, in place. */
export function wrapCoords(c, lon0) {
  if (!Array.isArray(c)) return
  if (isPair(c)) {
    c[0] = wrapLon(c[0], lon0)
    return
  }
  for (const x of c) wrapCoords(x, lon0)
}

/** A GeoJSON geometry (or Feature, or FeatureCollection), wrapped in place. */
export function wrapGeometry(g, lon0) {
  if (!g) return
  if (g.type === 'FeatureCollection') for (const f of g.features || []) wrapGeometry(f, lon0)
  else if (g.type === 'Feature') wrapGeometry(g.geometry, lon0)
  else if (g.type === 'GeometryCollection') for (const x of g.geometries || []) wrapGeometry(x, lon0)
  else if (g.coordinates) wrapCoords(g.coordinates, lon0)
}

// the keys under which a hand-written file carries [lon, lat] (or rings of them)
const COORD_KEYS = new Set(['coordinates', 'lonlat', 'points', 'polygon', 'target', 'centre'])

/** Every coordinate under COORD_KEYS anywhere in obj, wrapped about lon0, in place (battle.json, routes). */
export function wrapDeep(obj, lon0) {
  if (Array.isArray(obj)) {
    for (const x of obj) if (x && typeof x === 'object') wrapDeep(x, lon0)
    return
  }
  if (!obj || typeof obj !== 'object') return
  for (const [k, v] of Object.entries(obj)) {
    if (COORD_KEYS.has(k) && Array.isArray(v)) wrapCoords(v, lon0)
    else if (v && typeof v === 'object') wrapDeep(v, lon0)
  }
}

/** A box's bounds, wrapped as a continuous range: west about lon0, east the same width on from it. */
function wrapBounds(b, lon0) {
  const w = wrapLon(b[0], lon0)
  return [w, b[1], w + (b[2] - b[0]), b[3]]
}

/**
 * A manifest entry, placed in its scene's world. The table's pack covers the
 * manifest's projected `extent` (its grid is regular in projected space); a
 * box's covers its lon/lat `bounds` through its tangent plane. Texel sizes in
 * metres come from the rectangle the renderer draws, so the texels land
 * exactly where the projection puts them.
 */
export function describePack(d, proj, abs, { normalExag = 2, aoExag = 1.3, land = true } = {}) {
  const rect = d.extent ? { x0: d.extent[0], z0: d.extent[1], x1: d.extent[2], z1: d.extent[3] } : proj.rect(d.bounds)
  const [W, H] = d.size
  if (!d.height || !Number.isFinite(d.height.scale) || !Number.isFinite(d.height.offset)) throw new Error(`pack ${d.id}: height.scale and height.offset are mandatory (DATA.md §2)`)
  return {
    id: d.id,
    kind: d.kind ?? (d.extent ? 'table' : 'box'),
    name: d.name || d.id,
    desc: d,
    rect,
    W,
    H,
    mx: ((rect.x1 - rect.x0) * proj.unit) / W,
    mz: ((rect.z1 - rect.z0) * proj.unit) / H,
    heightUrl: abs(d.height.file),
    rainUrl: d.rain?.file ? abs(d.rain.file) : null,
    scale: d.height.scale,
    offset: d.height.offset,
    normalExag,
    aoExag,
    land,
    sources: d.sources || [],
    data: null,
  }
}

/** A `when`'s zone from its clock (clocks.json), when it names one and carries none (DATA.md §4). */
function resolveZone(when, clocks) {
  if (!when || typeof when !== 'object') return
  if (!when.zone && when.clock && clocks.has(when.clock)) when.zone = clocks.get(when.clock).offset
  for (const alt of when.alt || []) if (!alt.zone && alt.clock && clocks.has(alt.clock)) alt.zone = clocks.get(alt.clock).offset
}

/**
 * The manifest, the gazetteer, the record and the boxes manifest:
 * everything but the pack images. A missing optional file is a warning and
 * an empty list; a missing manifest is an error.
 */
export async function loadData(base, warn = console.warn) {
  const abs = (p) => new URL(p, new URL(base, location.href)).href
  const manifest = await getJSON(abs('manifest.json'))
  if (!manifest.projection || !manifest.table) throw new Error('manifest.json needs a projection and a table (DATA.md §2)')
  const proj = projectionFor(manifest.projection)
  const lon0 = proj.lon0
  const t = manifest.table
  const [chapters, clocks, places, events, sources, routes, frontsManifest, labels, coast, boxesManifest] = await Promise.all([
    getJSON(abs('chapters.json'), [], warn),
    getJSON(abs('clocks.json'), [], warn),
    getJSON(abs('places.json'), [], warn),
    getJSON(abs('events.json'), [], warn),
    getJSON(abs('sources.json'), [], warn),
    getJSON(abs('routes.json'), [], warn),
    getJSON(abs('fronts/manifest.json'), { keyframes: [], lines: null }, warn),
    getJSON(abs(t.labels || 'table/labels.json'), [], warn),
    getJSON(abs(t.coast || 'table/coast.json'), null, warn),
    getJSON(abs('boxes/manifest.json'), { boxes: [] }, warn),
  ])
  const keyframes = list(frontsManifest, 'keyframes')
  // the wargames (ROUND-3 §6): a box's scenario where its manifest entry names one, so a door shows only where a file is
  const boxList = list(boxesManifest, 'boxes')
  const [frontFiles, frontLines, wargameFiles] = await Promise.all([
    Promise.all(keyframes.map((k) => getJSON(abs(k.file), null, warn))),
    frontsManifest?.lines ? getJSON(abs(frontsManifest.lines), null, warn) : null,
    Promise.all(boxList.map((b) => (b.wargame ? getJSON(abs(b.wargame), null, warn) : null))),
  ])

  // --- normalise every longitude, once -------------------------------------
  const P = list(places, 'places')
  const E = list(events, 'events')
  const Rt = list(routes, 'routes')
  const L = list(labels, 'labels')
  for (const p of P) wrapGeometry(p.geometry, lon0)
  for (const e of E) wrapDeep(e, lon0)
  for (const r of Rt) wrapDeep(r, lon0)
  for (const l of L) wrapCoords(l.lonlat, lon0)
  wrapGeometry(coast, lon0)
  wrapGeometry(coast?.strokes, lon0)
  for (const fc of frontFiles) wrapGeometry(fc, lon0)
  wrapGeometry(frontLines, lon0)

  // --- clocks: every when carries the zone its card shows ------------------
  const C = list(clocks, 'clocks')
  const clockById = new Map(C.map((c) => [c.id, c]))
  for (const e of E) resolveZone(e.when, clockById)
  for (const r of Rt) resolveZone(r.when, clockById)

  // --- the table pack and the boxes ------------------------------------------
  const table = describePack(t, proj, abs, { normalExag: TABLE.normalExag, aoExag: TABLE.aoExag, land: false })
  const boxes = boxList.map((b) => {
    const pj = { ...b.projection, kind: 'tangent', unit: b.projection?.unit ?? BOX.unit }
    pj.lon0 = wrapLon(pj.lon0, lon0)
    const desc = { ...b, bounds: wrapBounds(b.bounds, lon0), projection: pj }
    const bproj = new TangentProjection(pj)
    return {
      ...desc,
      proj: bproj,
      exaggeration: b.exaggeration ?? BOX.exaggeration,
      placement: placement({ ...desc, proj: bproj }, proj),
      pack: describePack(desc, bproj, abs, { normalExag: BOX.normalExag, aoExag: BOX.aoExag, land: true }),
    }
  })

  const data = {
    base,
    abs,
    manifest,
    proj,
    table,
    packs: [table],
    chapters: list(chapters, 'chapters'),
    clocks: C,
    clockById,
    places: P,
    events: E,
    sources: list(sources, 'sources'),
    routes: Rt,
    fronts: {
      manifest: frontsManifest,
      keyframes: new Map(keyframes.map((k, i) => [k.id, { ...k, geojson: frontFiles[i] }])),
      lines: frontLines,
    },
    labels: L,
    coast,
    boxes,
    boxById: new Map(boxes.map((b) => [b.id, b])),
    // id → scenario, for the wargames whose file loaded (Battle.loadScenario reads and fills the same map)
    wargames: new Map(wargameFiles.filter((w) => w?.id && w.sides).map((w) => [w.id, w])),
    kits: null,
  }
  data.loadBox = (id, opts) => loadBox(data, id, opts)
  return data
}

/**
 * A box, on demand (ENGINEERING §9 step 1): its pack decoded (in `decoder`,
 * the app's PackDecoder, or a one-off), its battle.json with every longitude
 * wrapped about the box's lon0, and the kits (fetched with the first box and
 * kept). Returns { box, pack (with its decoded data), battle, kits }.
 */
export async function loadBox(data, id, { decoder = null, warn = console.warn } = {}) {
  const box = data.boxById.get(id)
  if (!box) throw new Error(`no box “${id}” in boxes/manifest.json`)
  const own = !decoder
  const dec = decoder || new PackDecoder(1, warn)
  try {
    const [decoded, battle, ships, aircraft] = await Promise.all([
      dec.decode(box.pack),
      box.battle ? getJSON(data.abs(box.battle), null, warn) : null,
      data.kits ? data.kits.ships : getJSON(data.abs('kits/ships.json'), [], warn),
      data.kits ? data.kits.aircraft : getJSON(data.abs('kits/aircraft.json'), [], warn),
    ])
    data.kits ||= { ships: list(ships, 'ships'), aircraft: list(aircraft, 'aircraft') }
    if (battle) wrapDeep(battle, box.proj.lon0)
    // (a fresh copy of the described pack each visit: the terrain lets go of
    // its CPU copies of the normal and land maps once they are on the GPU)
    return { box, pack: { ...box.pack, data: decoded }, battle, kits: data.kits }
  } finally {
    if (own) dec.dispose()
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
      w.postMessage({ job, heightUrl: p.heightUrl, rainUrl: p.rainUrl, W: p.W, H: p.H, scale: p.scale, offset: p.offset, mx: p.mx, mz: p.mz, normalExag: p.normalExag, aoExag: p.aoExag, land: p.land })
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
      const out = derivePack({ heightPx: hi.px, rainPx, W: p.W, H: p.H, scale: p.scale, offset: p.offset, mx: p.mx, mz: p.mz, normalExag: p.normalExag, aoExag: p.aoExag, land: p.land })
      this.jobs.delete(job)
      j.resolve(out)
    } catch (err) {
      this.jobs.delete(job)
      j.reject(err)
    }
  }

  dispose() {
    for (const w of this.workers) w.terminate()
    this.workers = []
    this.free = []
  }
}
