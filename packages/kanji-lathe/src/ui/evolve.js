// Evolve: nine variants around the current design. Pick one, it becomes the
// parent, and the other eight are re-rolled around it — directed search through
// a parameter space far too large to slider your way across.
import { fitCanvas, squareBox } from './canvas-util.js'
import { renderGlyph } from '../render/canvas.js'
import { mutate } from '../params.js'
import { buildGlyph } from '../engine/pipeline.js'
import { mulberry32 } from '../geom/path.js'

export function createEvolve(gridEl, app) {
  let population = []
  let seed = 12345
  const cells = []

  for (let i = 0; i < 9; i++) {
    const btn = document.createElement('button')
    btn.className = 'evolve__cell'
    const canvas = document.createElement('canvas')
    btn.appendChild(canvas)
    const tag = document.createElement('span')
    tag.className = 'evolve__tag'
    btn.appendChild(tag)
    btn.addEventListener('click', () => {
      if (i === 4) return
      app.setAll(population[i])
      repopulate()
    })
    gridEl.appendChild(btn)
    cells.push({ btn, canvas, tag })
  }

  function repopulate() {
    seed = (seed * 1664525 + 1013904223) >>> 0
    const rnd = mulberry32(seed)
    population = []
    for (let i = 0; i < 9; i++) {
      population.push(i === 4 ? app.P : mutate(app.P, app.evolveAmount, rnd))
    }
    draw()
  }

  function draw() {
    if (!population.length) repopulate()
    const rec = app.record
    for (let i = 0; i < 9; i++) {
      const { btn, canvas, tag } = cells[i]
      btn.classList.toggle('is-parent', i === 4)
      const r = btn.getBoundingClientRect()
      if (r.width < 4) continue
      const m = fitCanvas(canvas, r.width, r.height, 1.5)
      const g = canvas.getContext('2d')
      g.setTransform(1, 0, 0, 1, 0, 0)
      g.clearRect(0, 0, m.w, m.h)
      const P = population[i]
      try {
        const skel = buildGlyph(rec, P, { quality: 0.5 })
        renderGlyph(g, skel, P, skel.ctx, squareBox(m.w, m.h, 10 * m.dpr))
      } catch {
        g.fillStyle = '#e2574c22'
        g.fillRect(0, 0, m.w, m.h)
      }
      tag.textContent = i === 4 ? 'parent' : 'variant ' + (i < 4 ? i + 1 : i)
    }
  }

  return { draw, repopulate }
}
