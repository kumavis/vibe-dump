// The single-glyph stage: one big character, an optional reference ghost, and
// click-to-inspect on individual strokes.
import { fitCanvas, squareBox } from './canvas-util.js'
import { renderGlyph } from '../render/canvas.js'
import { trimmedPoints } from '../engine/skeleton.js'

export function createStage(canvas, app) {
  let box = { x: 0, y: 0, w: 1, h: 1 }
  let dpr = 1

  function draw() {
    const rect = canvas.parentElement.getBoundingClientRect()
    const m = fitCanvas(canvas, rect.width, rect.height)
    dpr = m.dpr
    const g = canvas.getContext('2d')
    g.setTransform(1, 0, 0, 1, 0, 0)
    g.clearRect(0, 0, m.w, m.h)
    const skel = app.glyph()
    if (!skel) return
    box = squareBox(m.w, m.h, Math.round(38 * dpr))
    renderGlyph(g, skel, app.P, skel.ctx, box)

    const hot = app.hotStroke
    if (hot != null && skel.strokes[hot]) drawHighlight(g, skel.strokes[hot], box, skel.em, dpr)
  }

  function drawHighlight(g, s, b, em, scale) {
    const pts = trimmedPoints(s)
    if (pts.length < 4) return
    g.save()
    g.strokeStyle = '#e2574c'
    g.lineWidth = 2 * scale
    g.lineCap = 'round'
    g.lineJoin = 'round'
    g.globalAlpha = 0.95
    g.beginPath()
    for (let i = 0; i < pts.length; i += 2) {
      const x = b.x + (pts[i] / em) * b.w
      const y = b.y + (pts[i + 1] / em) * b.h
      i ? g.lineTo(x, y) : g.moveTo(x, y)
    }
    g.stroke()
    g.fillStyle = '#e2574c'
    g.beginPath()
    g.arc(b.x + (pts[0] / em) * b.w, b.y + (pts[1] / em) * b.h, 4 * scale, 0, Math.PI * 2)
    g.fill()
    g.restore()
  }

  // Hovering the stage picks the nearest stroke, which is how you find out what
  // a component is called without hunting through the list.
  canvas.addEventListener('pointermove', (ev) => {
    const skel = app.glyph()
    if (!skel) return
    const r = canvas.getBoundingClientRect()
    const px = (ev.clientX - r.left) * dpr
    const py = (ev.clientY - r.top) * dpr
    let best = -1
    let bestD = (18 * dpr) ** 2
    for (const s of skel.strokes) {
      if (!s.alive) continue
      for (let i = 0; i < s.n; i++) {
        const x = box.x + (s.pts[i * 2] / skel.em) * box.w
        const y = box.y + (s.pts[i * 2 + 1] / skel.em) * box.h
        const d = (x - px) ** 2 + (y - py) ** 2
        if (d < bestD) {
          bestD = d
          best = s.i
        }
      }
    }
    app.setHotStroke(best < 0 ? null : best)
  })
  canvas.addEventListener('pointerleave', () => app.setHotStroke(null))

  return { draw }
}
