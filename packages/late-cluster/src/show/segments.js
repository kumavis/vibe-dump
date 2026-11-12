// Finding and loading segments: modules and cues are bundled (lazy chunks via import.meta.glob);
// audio and telemetry are fetched from public/ by the relative paths in cues.json. Everything is
// cached per id, so preloading the next segment while this one plays is just calling load() early.
import RUNDOWN from '../rundown.js'
import { loadTele } from '../engine/tele.js'

const MODULES = import.meta.glob('../segments/*/index.js')
const CUES = import.meta.glob('../segments/*/cues.json', { import: 'default' })

const key = (id, file) => `../segments/${id}/${file}`
const asset = (p) => new URL(p, document.baseURI).href

/** the running order (ids); segments without an index.js yet are kept (shown as "in production") */
export const rundown = () => RUNDOWN.slice()

export const hasSegment = (id) => !!MODULES[key(id, 'index.js')]

const cache = new Map()

/** the segment module and its cues (cues null if not rendered yet) */
export function loadMeta(id) {
  const k = `meta:${id}`
  if (!cache.has(k)) {
    cache.set(k, (async () => {
      const mod = (await MODULES[key(id, 'index.js')]()).default ?? {}
      let cues = mod.cues ?? null
      if (!cues && CUES[key(id, 'cues.json')]) cues = await CUES[key(id, 'cues.json')]()
      if (!cues) console.info(`segment ${id}: no cues.json yet — it plays silent, with idle heads, for ${mod.duration ?? 30}s`)
      return { id, module: { id, ...mod }, cues }
    })())
  }
  return cache.get(k)
}

/** meta + telemetry + the audio file's bytes (not decoded: decoding needs the AudioContext) */
export function load(id, { audio = true } = {}) {
  const k = `full:${id}:${audio}`
  if (!cache.has(k)) {
    const p = (async () => {
      const meta = await loadMeta(id)
      const c = meta.cues
      const [tele, bytes] = await Promise.all([
        c?.tele ? loadTele(asset(c.tele)).catch((e) => (console.warn(`segment ${id}: telemetry failed to load (${e.message}); heads will idle`), null)) : null,
        audio && c?.audio ? fetch(asset(c.audio)).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(`HTTP ${r.status}`)))).catch((e) => (console.warn(`segment ${id}: audio failed to load (${e.message}); playing silent`), null)) : null,
      ])
      return { ...meta, tele, bytes }
    })()
    p.catch(() => cache.delete(k))
    cache.set(k, p)
  }
  return cache.get(k)
}

/**
 * Seconds of decoder delay at the head of a decoded mp3. Browsers that read the LAME/Xing gapless
 * header trim it (decoded length ≈ cues.duration); otherwise the extra length is the encoder delay
 * (+ padding), and we skip at most the usual LAME delay. cues.audioLead overrides.
 */
export function audioLead(cues, buffer) {
  if (typeof cues?.audioLead === 'number') return cues.audioLead
  if (!buffer || !cues?.duration) return 0
  const extra = buffer.duration - cues.duration
  return extra > 0.004 ? Math.min(extra, 1105 / buffer.sampleRate) : 0
}
