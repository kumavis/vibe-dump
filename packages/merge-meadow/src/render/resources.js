// Ref-counted GPU resources keyed by content (design §8). Kinds never create a
// geometry, material or texture directly: they acquire one by key, record the key
// on obj.userData.res, and the reconciler releases every recorded key on dispose,
// so leaks are impossible to write by forgetting a dispose() call. 300 sheep
// share one texture and one material; 300 boxes share one unit geometry.
import * as THREE from 'three'

export const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Twemoji Mozilla",sans-serif'

// ---- pure key functions (the design's key format; unit-tested in Node) ------------
export const SHAPES = ['box', 'sphere', 'cone', 'cylinder', 'capsule']
export const normShape = (s) => (SHAPES.includes(String(s)) ? String(s) : 'box')
export const texKey = (image) => 'tex:' + String(image)
export const spriteMatKey = (image, color) => `spritemat:${String(image)}:${normColor(color, '#ffffff')}`
export const geoKey = (shape) => 'geo:' + normShape(shape)
export const gltfKey = (url) => 'gltf:' + String(url)
// flat/vc are part of the key because flat-shaded vertex-coloured critters and
// smooth primitives of the same colour must not share a material
export function stdMatKey (d = {}) {
  return `mat:std:${normColor(d.color, '#cccccc')}:${num(d.roughness, 0.8)}:${num(d.metalness, 0)}:${d.flat ? 1 : 0}:${d.vc ? 1 : 0}`
}

const num = (v, d) => (Number.isFinite(+v) && v !== null && v !== '' ? +v : d)

// '#abc' | '#aabbcc' | anything else -> '#rrggbb' lower-case (or the fallback)
export function normColor (c, fallback = '#ffffff') {
  const s = String(c ?? '').trim().toLowerCase()
  if (/^#[0-9a-f]{6}$/.test(s)) return s
  if (/^#[0-9a-f]{3}$/.test(s)) return '#' + [...s.slice(1)].map((x) => x + x).join('')
  if (/^#[0-9a-f]{8}$/.test(s)) return s.slice(0, 7)
  return fallback
}

// multiply blend: how the `dead` group's grey tint darkens any colour
export function tintColor (color, tint) {
  const c = normColor(color, '#ffffff')
  const t = normColor(tint, '#ffffff')
  if (t === '#ffffff') return c
  let out = '#'
  for (let i = 1; i < 7; i += 2) {
    const v = Math.round((parseInt(c.slice(i, i + 2), 16) * parseInt(t.slice(i, i + 2), 16)) / 255)
    out += v.toString(16).padStart(2, '0')
  }
  return out
}

// ---- URLs: model and image sources (design §8: asset: or https, never blob:/data:)
// blob: only exists in the tab that made it, and data: would put megabytes into
// every peer's permanent doc history, so both are refused here rather than at the
// loader. Same-origin relative paths are allowed (bundled or served beside the app).
export function resolveUrl (url, assets) {
  let s = String(url ?? '').trim()
  if (!s) return null
  if (s.startsWith('asset:')) {
    const a = assets?.[s.slice(6)]
    if (!a?.url) return null
    s = String(a.url).trim()
    if (s.startsWith('asset:')) return null // no indirection chains
  }
  if (/^https:\/\//i.test(s)) return s
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//i.test(s)) return s // local dev and tests
  if (/^(\.{0,2}\/)[^/]/.test(s) && !/^\/\//.test(s)) return s
  return null
}

// ---- bundled Twemoji for the seed glyphs (used only without a colour emoji font) ----
// new URL(literal, import.meta.url) is the one asset form both Vite (emits the
// file) and Node (a file: URL never fetched) understand without a plugin.
export const TWEMOJI = {
  '🦖': new URL('./emoji/1f996.svg', import.meta.url).href,
  '🐑': new URL('./emoji/1f411.svg', import.meta.url).href,
  '🐎': new URL('./emoji/1f40e.svg', import.meta.url).href,
  '🌳': new URL('./emoji/1f333.svg', import.meta.url).href,
  '🪨': new URL('./emoji/1faa8.svg', import.meta.url).href,
  '💡': new URL('./emoji/1f4a1.svg', import.meta.url).href,
  '🐺': new URL('./emoji/1f43a.svg', import.meta.url).href,
  '🧑': new URL('./emoji/1f9d1.svg', import.meta.url).href,
}
// Twemoji file name for a glyph: code points in hex, FE0F (variation selector) dropped
export const codepoints = (glyph) => [...String(glyph)].map((c) => c.codePointAt(0)).filter((c) => c !== 0xfe0f).map((c) => c.toString(16)).join('-')

// ---- colour-emoji probe -------------------------------------------------------------
// A 16 px 🦖 has saturated pixels only when a colour font drew it; a monochrome
// fallback (or tofu) is grey. ~1 ms, once per page. Outside a browser there is no
// font question to answer, so it reports true and nothing falls back.
let probed = null
export function hasColorEmoji (doc = globalThis.document) {
  if (probed !== null) return probed
  if (!doc?.createElement) return (probed = true)
  try {
    const c = doc.createElement('canvas'); c.width = c.height = 16
    const g = c.getContext('2d', { willReadFrequently: true })
    g.font = '14px ' + EMOJI_FONT; g.textBaseline = 'top'; g.fillText('🦖', 0, 0)
    const px = g.getImageData(0, 0, 16, 16).data
    let col = 0
    for (let i = 0; i < px.length; i += 4) if (px[i + 3] > 64 && Math.max(px[i], px[i + 1], px[i + 2]) - Math.min(px[i], px[i + 1], px[i + 2]) > 40) col++
    probed = col > 4
  } catch { probed = true }
  return probed
}
export function setColorEmojiForTests (v) { probed = v }

// glyph drawn with its ink on the bottom edge, so a sprite centred at (0.5, 0)
// stands on the ground instead of floating by the font's descent
function drawGlyph (canvas, glyph, px) {
  const g = canvas.getContext('2d')
  g.clearRect(0, 0, px, px)
  g.font = `${Math.round(px * 0.78)}px ${EMOJI_FONT}`
  g.textAlign = 'center'; g.textBaseline = 'alphabetic'
  const m = g.measureText(glyph)
  g.fillText(glyph, px / 2, px - Math.max(1, m.actualBoundingBoxDescent || 0) - 1)
}

export const emojiStats = { made: 0, svg: 0, ms: 0 }

export function makeResources ({ document: doc = globalThis.document, colorEmoji } = {}) {
  const map = new Map() // key -> { value, refs, dispose, settled }
  const colour = () => (colorEmoji !== undefined ? colorEmoji : hasColorEmoji(doc))

  function emojiTexture (glyph, px = 256) {
    if (!doc?.createElement) { const t = new THREE.Texture(); t.name = 'emoji:' + glyph; return t } // Node
    const t0 = globalThis.performance?.now() ?? 0
    const c = doc.createElement('canvas'); c.width = c.height = px
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace; tex.name = 'emoji:' + glyph
    const svg = !colour() && TWEMOJI[glyph]
    if (svg && typeof globalThis.Image === 'function') {
      // the monochrome glyph shows for the few ms until the SVG decodes
      drawGlyph(c, glyph, px)
      const img = new globalThis.Image()
      img.onload = () => {
        if (tex.userData.disposed) return
        const g = c.getContext('2d'); const s = Math.round(px * 0.92)
        g.clearRect(0, 0, px, px); g.drawImage(img, (px - s) / 2, px - s, s, s)
        tex.needsUpdate = true; emojiStats.svg++
      }
      img.src = svg
    } else drawGlyph(c, glyph, px)
    tex.addEventListener('dispose', () => { tex.userData.disposed = true })
    emojiStats.made++; emojiStats.ms += (globalThis.performance?.now() ?? 0) - t0
    return tex
  }

  // image: 'emoji:<glyph>' or a URL (asset:/https/relative). A refused or missing
  // URL renders as ❓ rather than nothing, so a broken look is visible and pickable.
  function imageTexture (image, assets) {
    const s = String(image ?? '')
    if (s.startsWith('emoji:')) return emojiTexture(s.slice(6) || '❓')
    const url = resolveUrl(s, assets)
    if (!url || !doc?.createElement) return emojiTexture('❓')
    const t = new THREE.TextureLoader().load(url)
    t.colorSpace = THREE.SRGBColorSpace; t.name = url
    return t
  }

  const R = {
    acquire (key, make, dispose = (v) => v?.dispose?.()) {
      let r = map.get(key)
      if (!r) {
        r = { value: make(), refs: 0, dispose, settled: undefined }
        map.set(key, r)
        // async values (a glTF still loading) remember what they landed as, so a
        // release after landing disposes synchronously
        if (typeof r.value?.then === 'function') r.value.then((v) => { r.settled = v }, () => {})
      }
      r.refs++
      return r.value
    },
    release (key) {
      const r = map.get(key)
      if (!r) throw new Error('release of unknown resource ' + key)
      if (--r.refs > 0) return
      map.delete(key)
      if (r.settled !== undefined) r.dispose(r.settled)
      else if (typeof r.value?.then === 'function') r.value.then(r.dispose, () => {})
      else r.dispose(r.value)
    },
    // acquire + record on the object in one call (what kinds use)
    use (obj, key, make, dispose) { (obj.userData.res ||= []).push(key); return R.acquire(key, make, dispose) },
    // replace one recorded key with another (an in-place colour or shape edit)
    swap (obj, oldKey, newKey, make, dispose) {
      if (oldKey === newKey && map.has(oldKey)) return map.get(oldKey).value
      const v = R.acquire(newKey, make, dispose)
      const l = (obj.userData.res ||= [])
      const i = l.indexOf(oldKey)
      if (i >= 0) { l[i] = newKey; R.release(oldKey) } else l.push(newKey)
      return v
    },
    releaseAll (obj) { for (const k of obj.userData.res || []) R.release(k); obj.userData.res = [] },
    has: (key) => map.has(key),
    refs: (key) => map.get(key)?.refs ?? 0,
    keys: () => [...map.keys()],
    stats () {
      let refs = 0; const byPrefix = {}
      for (const [k, r] of map) { refs += r.refs; const p = k.slice(0, k.indexOf(':')); byPrefix[p] = (byPrefix[p] || 0) + 1 }
      return { keys: map.size, refs, byPrefix }
    },
    emojiTexture,
    imageTexture,
    hasColorEmoji: colour,
  }
  return R
}

// ---- shared factories (unit shapes: size is the mesh scale, so a resize never
// rebuilds a geometry and every box in the world shares one) --------------------
const SHAPE_GEO = {
  box: () => new THREE.BoxGeometry(1, 1, 1),
  sphere: () => new THREE.SphereGeometry(0.5, 20, 14),
  cone: () => new THREE.ConeGeometry(0.5, 1, 16),
  cylinder: () => new THREE.CylinderGeometry(0.5, 0.5, 1, 16),
  capsule: () => new THREE.CapsuleGeometry(0.25, 0.5, 4, 12), // 1 m tall, 0.5 m wide
}
export const shapeGeo = (s) => () => { const g = SHAPE_GEO[normShape(s)](); g.name = geoKey(s); return g }
export const stdMat = (d = {}) => () => new THREE.MeshStandardMaterial({
  color: normColor(d.color, '#cccccc'), roughness: num(d.roughness, 0.8), metalness: num(d.metalness, 0), flatShading: !!d.flat, vertexColors: !!d.vc,
})
