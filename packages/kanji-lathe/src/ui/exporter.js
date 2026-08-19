// Export: SVG and PNG for a picture, TrueType for an actual installable font.
//
// Font building is the expensive one — a thousand glyphs through the whole
// pipeline — so it runs in slices and reports progress rather than freezing.
import { buildGlyph, EM } from '../engine/pipeline.js'
import { strokeOutline, polysToPathData } from '../engine/outline.js'
import { capsFor } from '../engine/nib.js'
import { trimmedPoints, trimmedWidths } from '../engine/skeleton.js'
import { buildTTF } from '../font/ttf.js'
import { serialize } from '../params.js'
import { download, toast, squareBox, fitCanvas } from './canvas-util.js'
import { renderGlyph } from '../render/canvas.js'

/** All closed polygons for one finished skeleton, in em coordinates (y down). */
export function glyphContours(skel, P) {
  const polys = []
  for (const s of skel.strokes) {
    if (!s.alive) continue
    const pts = trimmedPoints(s)
    const w = trimmedWidths(s)
    if (pts.length < 4) continue
    const caps = capsFor(s, P)
    for (const poly of strokeOutline(pts, w, { ...caps, join: 'round', miterLimit: 3, capScale: 1 })) {
      if (poly.length >= 6) polys.push(poly)
    }
  }
  return polys
}

export function exportSVG(skel, P) {
  const polys = glyphContours(skel, P)
  const d = polysToPathData(polys)
  const ink = P.rdInk || '#111'
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${EM} ${EM}" width="512" height="512">
  <title>${skel.char} — Kanji Lathe</title>
  <path d="${d}" fill="${ink}" fill-rule="nonzero"/>
</svg>
`
}

export function exportPNG(skel, P, size = 1024) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const g = canvas.getContext('2d')
  g.fillStyle = P.rdPaper || '#0a0a0c'
  g.fillRect(0, 0, size, size)
  renderGlyph(g, skel, P, skel.ctx, squareBox(size, size, size * 0.06))
  return canvas
}

/**
 * Build a real .ttf. Contours are mirrored to y-up font units and every glyph
 * gets the same advance so the result sets as a proper monospaced CJK face.
 */
export async function exportFont(app, count, onProgress) {
  const P = app.P
  const upm = EM
  const advance = Math.round(upm * (P.ftAdvance ?? 1))
  const records = app.corpus.chars.slice(0, count)
  const glyphs = []
  let skipped = 0

  for (let i = 0; i < records.length; i++) {
    const rec = records[i]
    let contours = []
    try {
      const skel = buildGlyph(rec, P, { quality: 1 })
      contours = glyphContours(skel, P).map((poly) => {
        // font units are y-up; the engine works y-down
        const out = new Float64Array(poly.length)
        for (let k = 0; k < poly.length; k += 2) {
          out[k] = poly[k]
          out[k + 1] = upm - poly[k + 1]
        }
        return out
      })
    } catch (err) {
      skipped++
    }
    if (contours.length) glyphs.push({ unicode: rec.char.codePointAt(0), advance, contours })
    else skipped++
    if (i % 25 === 0) {
      onProgress?.(i / records.length)
      // yield so the progress toast actually paints
      await new Promise((r) => setTimeout(r, 0))
    }
  }

  const bytes = buildTTF({
    unitsPerEm: upm,
    ascent: Math.round(upm * 0.88),
    descent: -Math.round(upm * 0.12),
    familyName: 'Kanji Lathe ' + (app.presetName || 'Custom'),
    styleName: 'Regular',
    version: '1.000',
    glyphs,
  })
  return { bytes, count: glyphs.length, skipped }
}

export function wireExport(dom, app) {
  const { btnExport, exportMenu } = dom
  const close = () => {
    exportMenu.hidden = true
  }
  btnExport.addEventListener('click', (ev) => {
    ev.stopPropagation()
    exportMenu.hidden = !exportMenu.hidden
  })
  document.addEventListener('click', close)
  exportMenu.addEventListener('click', (ev) => ev.stopPropagation())

  exportMenu.addEventListener('click', async (ev) => {
    const kind = ev.target?.dataset?.export
    if (!kind) return
    close()
    const stamp = app.char + '-' + (app.presetName || 'custom').toLowerCase().replace(/\s+/g, '-')
    try {
      if (kind === 'svg') {
        download(`kanji-lathe-${stamp}.svg`, exportSVG(app.glyph(), app.P), 'image/svg+xml')
        toast('SVG saved')
      } else if (kind === 'png') {
        exportPNG(app.glyph(), app.P).toBlob((b) => download(`kanji-lathe-${stamp}.png`, b, 'image/png'))
        toast('PNG saved')
      } else if (kind === 'sheet') {
        const canvas = dom.sheetCanvas
        if (!canvas.width) return toast('Open the Specimen tab first', true)
        canvas.toBlob((b) => download('kanji-lathe-specimen.png', b, 'image/png'))
        toast('Specimen saved')
      } else if (kind === 'preset') {
        download('kanji-lathe-preset.json', JSON.stringify({ name: app.presetName || 'Custom', params: app.P }, null, 2), 'application/json')
        toast('Preset saved')
      } else if (kind === 'link') {
        const url = location.origin + location.pathname + '#' + serialize(app.P) + '|' + app.char
        await navigator.clipboard.writeText(url)
        toast('Share link copied')
      } else if (kind === 'ttf250' || kind === 'ttf1000') {
        const n = kind === 'ttf250' ? 250 : 1000
        toast(`Building a ${n}-glyph font…`)
        const { bytes, count, skipped } = await exportFont(app, n, (p) => {
          toast(`Building font… ${Math.round(p * 100)}%`)
        })
        download(`KanjiLathe-${n}.ttf`, new Blob([bytes], { type: 'font/ttf' }), 'font/ttf')
        toast(`Font saved — ${count} glyphs${skipped ? `, ${skipped} skipped` : ''}, ${(bytes.length / 1024) | 0} KiB`)
      }
    } catch (err) {
      toast('Export failed: ' + err.message, true)
    }
  })
  void fitCanvas
}
