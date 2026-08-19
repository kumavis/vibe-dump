// Build the current design into a real TrueType file, hand it to the browser's
// font machinery, and let it set type with it.
//
// This is the proof view's honest mode: instead of the engine drawing each glyph
// itself, the text is rendered by the same rasteriser that will render the
// downloaded .ttf on the desktop — so anything the font export gets wrong shows
// up here immediately rather than after an install.
import { buildGlyph, EM } from '../engine/pipeline.js'
import { glyphContours } from './exporter.js'

let counter = 0
let cached = null // { key, family, face }

/**
 * Register a subset font covering exactly `chars`. Returns the CSS family name,
 * or null when the browser has no FontFace support.
 */
export async function ensureLiveFont(app, chars, key) {
  if (typeof FontFace === 'undefined') return null
  if (cached && cached.key === key) return cached.family
  const upm = EM
  const glyphs = []
  for (const ch of chars) {
    const rec = app.corpus.byChar.get(ch)
    if (!rec) continue
    let contours
    try {
      const skel = buildGlyph(rec, app.P, { quality: 1 })
      contours = glyphContours(skel, app.P).map((poly) => {
        const out = new Float64Array(poly.length)
        for (let i = 0; i < poly.length; i += 2) {
          out[i] = poly[i]
          out[i + 1] = upm - poly[i + 1] // font units are y-up
        }
        return out
      })
    } catch {
      continue
    }
    if (contours.length) glyphs.push({ unicode: ch.codePointAt(0), advance: Math.round(upm * (app.P.ftAdvance ?? 1)), contours })
  }
  if (!glyphs.length) return null

  const { buildTTF } = await import('../font/ttf.js')
  const bytes = buildTTF({
    unitsPerEm: upm,
    ascent: Math.round(upm * 0.88),
    descent: -Math.round(upm * 0.12),
    familyName: 'Kanji Lathe Live',
    styleName: 'Regular',
    version: '1.000',
    glyphs,
  })

  // A fresh family name per build; the old face is dropped so the browser cannot
  // serve a stale cache for a design that has since changed.
  const family = 'KanjiLatheLive' + ++counter
  const face = new FontFace(family, bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))
  await face.load()
  document.fonts.add(face)
  if (cached?.face) document.fonts.delete(cached.face)
  cached = { key, family, face, glyphs: glyphs.length, bytes: bytes.length }
  return family
}

export const liveFontInfo = () => (cached ? { glyphs: cached.glyphs, bytes: cached.bytes } : null)
