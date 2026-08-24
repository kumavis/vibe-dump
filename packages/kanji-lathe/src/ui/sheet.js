// The specimen sheet: a page of the corpus rendered live at thumbnail size.
//
// A thousand glyphs is far too much to build synchronously, so the sheet paints
// in slices across animation frames and can be interrupted by the next edit.
import { fitCanvas } from './canvas-util.js'
import { renderGlyph } from '../render/canvas.js'

export function createSheet(canvas, statusEl, app) {
  let job = null
  let raf = 0
  let lastShape = null

  function start() {
    const set = app.sheet.set || 'kanji'
    const pool = set === 'kana' ? app.corpus.kana : set === 'all' ? app.corpus.chars : app.corpus.kanji
    const from = Math.max(1, app.sheet.from | 0)
    const count = Math.max(1, Math.min(1200, app.sheet.count | 0))
    const cell = Math.max(28, Math.min(260, app.sheet.cell | 0))
    // Asking for characters past the core is a request for the rest of them.
    if (set !== 'kana' && from - 1 + count > pool.length && !app.corpus.extended) {
      statusEl.textContent = 'loading the rest of the characters…'
      app.loadExtended()
    }
    const records = pool.slice(from - 1, from - 1 + count)
    const wrapW = canvas.parentElement.clientWidth - 24
    const cols = Math.max(1, Math.floor(wrapW / cell))
    const rows = Math.ceil(records.length / cols)
    const m = fitCanvas(canvas, cols * cell, rows * cell)
    const g = canvas.getContext('2d')
    g.setTransform(1, 0, 0, 1, 0, 0)
    // Only wipe the sheet when its geometry actually changed. Repainting cell by
    // cell over the previous image is what stops the page strobing white every
    // time a slider moves.
    const shape = `${set}x${cols}x${cell}x${m.w}x${m.h}x${records.length}`
    if (shape !== lastShape) {
      g.clearRect(0, 0, m.w, m.h)
      lastShape = shape
    }
    job = { records, cols, cell, dpr: m.dpr, g, i: 0, errors: 0, t0: performance.now() }
    schedule()
  }

  function schedule() {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(step)
  }

  function step() {
    if (!job) return
    const budget = 12 // ms per frame, so the panel stays responsive while it paints
    const t = performance.now()
    const { records, cols, cell, dpr, g } = job
    // Thumbnails are ~90px: relaxation iterations there are invisible, so ask
    // the pipeline for reduced quality and get most of the frames back.
    const quality = cell < 120 ? 0.45 : 0.8
    while (job.i < records.length && performance.now() - t < budget) {
      const idx = job.i++
      const rec = records[idx]
      const cx = (idx % cols) * cell * dpr
      const cy = Math.floor(idx / cols) * cell * dpr
      const pad = cell * dpr * 0.07
      g.save()
      g.beginPath()
      g.rect(cx, cy, cell * dpr, cell * dpr)
      g.clip()
      g.clearRect(cx, cy, cell * dpr, cell * dpr)
      try {
        const skel = app.glyphFor(rec, quality)
        renderGlyph(g, skel, app.P, skel.ctx, { x: cx + pad, y: cy + pad, w: cell * dpr - pad * 2, h: cell * dpr - pad * 2 })
      } catch (err) {
        // one unlucky glyph should cost one cell, not the whole sheet
        job.errors++
        g.fillStyle = '#e2574c22'
        g.fillRect(cx + pad, cy + pad, cell * dpr - pad * 2, cell * dpr - pad * 2)
      }
      g.restore()
    }
    statusEl.textContent =
      job.i >= records.length
        ? `${records.length} glyphs · ${Math.round(performance.now() - job.t0)} ms` + (job.errors ? ` · ${job.errors} failed` : '')
        : `${job.i} / ${records.length}…`
    if (job.i < records.length) schedule()
    else job = null
  }

  return {
    draw: start,
    stop() {
      cancelAnimationFrame(raf)
      job = null
    },
  }
}
