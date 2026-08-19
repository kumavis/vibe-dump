// Text proof: set real Japanese with the generated glyphs.
//
// Two modes. By default the engine draws every kanji itself, which is fast and
// always matches the stage. Switch on "via real font" and the same design is
// compiled to a TrueType subset and handed to the browser — the text is then set
// by the platform's own rasteriser, which is the only honest preview of what the
// exported file will look like once installed.
import { fitCanvas } from './canvas-util.js'
import { renderGlyph } from '../render/canvas.js'
import { geometryKey } from '../params.js'
import { ensureLiveFont, liveFontInfo } from './live-font.js'

const FALLBACK_FONT = '"Hiragino Mincho ProN", "Yu Mincho", "Noto Serif JP", serif'

export function createProof(canvas, statusEl, app) {
  let raf = 0
  let job = null
  let liveFamily = null
  let liveKey = null

  function layout() {
    const text = app.proof.text || ''
    const size = Math.max(16, Math.min(240, app.proof.size))
    const track = app.proof.track
    const wrapW = Math.max(320, canvas.parentElement.clientWidth - 40)
    const adv = size * (app.P.ftAdvance ?? 1) + track
    const lines = []
    let line = []
    let x = 0
    for (const ch of text) {
      if (ch === '\n') {
        lines.push(line)
        line = []
        x = 0
        continue
      }
      const rec = app.corpus.byChar.get(ch)
      const w = rec ? adv : ch === ' ' ? size * 0.5 : size * (ch.charCodeAt(0) < 0x2e80 ? 0.5 : 1) + track
      if (x + w > wrapW && line.length) {
        lines.push(line)
        line = []
        x = 0
      }
      line.push({ ch, rec, x, w })
      x += w
    }
    lines.push(line)
    return { lines, size, wrapW }
  }

  function start() {
    const { lines, size, wrapW } = layout()
    const lineH = size * 1.55
    const m = fitCanvas(canvas, wrapW + 40, Math.max(200, lines.length * lineH + 60))
    const g = canvas.getContext('2d')
    g.setTransform(1, 0, 0, 1, 0, 0)
    g.fillStyle = app.P.rdPaper || '#0a0a0c'
    g.fillRect(0, 0, m.w, m.h)

    if (app.proof.useFont) {
      drawWithFont(g, lines, size, lineH, m)
      return
    }
    job = { lines, size, lineH, dpr: m.dpr, g, li: 0, ci: 0 }
    schedule()
  }

  /** Compile the design to a font subset, then let the browser set the text. */
  async function drawWithFont(g, lines, size, lineH, m) {
    const chars = [...new Set([...(app.proof.text || '')].filter((c) => app.corpus.byChar.has(c)))]
    const key = geometryKey(app.P) + '|' + chars.join('')
    statusEl.textContent = 'compiling font…'
    try {
      if (key !== liveKey) {
        liveFamily = await ensureLiveFont(app, chars, key)
        liveKey = key
      }
    } catch (err) {
      statusEl.textContent = 'font build failed: ' + err.message
      liveFamily = null
    }
    const info = liveFontInfo()
    statusEl.textContent = liveFamily
      ? `set by the browser from a ${info.glyphs}-glyph, ${(info.bytes / 1024) | 0} KiB TrueType build`
      : 'font unavailable — falling back'
    g.save()
    g.fillStyle = app.P.rdInk || '#e8e8ee'
    g.textBaseline = 'alphabetic'
    for (let li = 0; li < lines.length; li++) {
      for (const it of lines[li]) {
        if (!it.ch.trim()) continue
        const usable = it.rec && liveFamily
        g.font = `${size * m.dpr}px ${usable ? `"${liveFamily}", ` : ''}${FALLBACK_FONT}`
        g.globalAlpha = usable ? 1 : 0.5
        g.fillText(it.ch, (20 + it.x) * m.dpr, (30 + li * lineH + size * 0.85) * m.dpr)
      }
    }
    g.restore()
  }

  function schedule() {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(step)
  }

  function step() {
    if (!job) return
    const t = performance.now()
    const { lines, size, lineH, dpr, g } = job
    const quality = size < 90 ? 0.5 : 1
    while (job.li < lines.length && performance.now() - t < 12) {
      const line = lines[job.li]
      if (job.ci >= line.length) {
        job.li++
        job.ci = 0
        continue
      }
      const it = line[job.ci++]
      const px = (20 + it.x) * dpr
      const py = (30 + job.li * lineH) * dpr
      if (it.rec) {
        try {
          const skel = app.glyphFor(it.rec, quality)
          renderGlyph(g, skel, app.P, skel.ctx, { x: px, y: py, w: size * dpr, h: size * dpr })
        } catch {
          // a broken glyph leaves a hole, not an exception
        }
      } else if (it.ch.trim()) {
        g.save()
        g.fillStyle = app.P.rdInk || '#e8e8ee'
        g.globalAlpha = 0.5
        g.font = `${size * dpr * 0.86}px ${FALLBACK_FONT}`
        g.textBaseline = 'top'
        g.fillText(it.ch, px, py + size * dpr * 0.1)
        g.restore()
      }
    }
    statusEl.textContent = job.li < lines.length ? 'drawing…' : 'drawn by the engine'
    if (job.li < lines.length) schedule()
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
