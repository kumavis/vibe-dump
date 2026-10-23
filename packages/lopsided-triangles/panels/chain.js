// Chapter 11: how much of the matrix saving survives each reduction (after
// Figure 8 of the paper). One series, so one colour and direct labels.

import { $, el, svg, tooltip, onWidth } from '../util.js'
import { frame, linear, mtext } from '../chart.js'

const STAGES = [
  { name: 'Thin matrix product', ref: 'Corollary 26, at D = n^{1/18}', delta: 0.063 / 18, result: 'n^{2−0.0035} per instance', keeps: null },
  { name: 'Exact Triangle', ref: 'Theorem 19', delta: 0.00175, result: 'O(n^{2.9983})', keeps: 'keeps half of the matrix saving' },
  { name: '3SUM', ref: 'Theorem 22', delta: 0.000875, result: 'O(n^{1.9992})', keeps: 'keeps half of Exact Triangle’s' },
  { name: 'APSP, (min,+)-product', ref: 'Theorem 22', delta: 0.00175 / 3, result: 'O(n^{2.99942})', keeps: 'keeps a third of Exact Triangle’s' },
]

export function initChain() {
  const box = $('#chain-chart')
  if (!box) return
  box.style.position = 'relative'
  const tip = tooltip(box)

  function draw() {
    const W = Math.max(300, box.clientWidth)
    const narrow = W < 520
    const rowH = 66
    const m = { l: 12, r: 12, t: 8, b: 42 }
    const H = m.t + STAGES.length * rowH + m.b
    const x = linear([0, 40], [m.l, W - m.r - (narrow ? 64 : 80)]) // δ in units of 10⁻⁴
    const root = frame(box, W, H)
    root.setAttribute('aria-label', 'Bar chart of the saving in the exponent at each step: matrix 0.0035, Exact Triangle 0.00175, 3SUM 0.000875, APSP 0.00058')
    const g = svg('g')
    root.append(g)
    for (let t = 0; t <= 40; t += narrow ? 20 : 10) {
      g.append(
        svg('line', { x1: x(t), x2: x(t), y1: m.t, y2: H - m.b, stroke: 'var(--rule)', 'stroke-width': 1 }),
        svg('text', { x: x(t), y: H - m.b + 18, 'text-anchor': 'middle', 'font-size': 12, fill: 'var(--ink-3)', 'font-family': 'var(--sans)', text: t === 0 ? '0' : (t / 1e4).toFixed(3) }),
      )
    }
    g.append(mtext({ class: 'label', x: m.l + (x(40) - m.l) / 2, y: H - 6, 'text-anchor': 'middle' }, 'saving δ in the exponent'))
    STAGES.forEach((st, i) => {
      const top = m.t + rowH * i
      const cy = top + 44
      const h = 18
      const x1 = x(st.delta * 1e4)
      const rr = 4
      g.append(
        svg('text', { class: 'label--strong', x: m.l, y: top + 16, text: st.name }),
        mtext({ x: W - m.r, y: top + 16, 'text-anchor': 'end', 'font-size': 14, fill: 'var(--ink)', 'font-family': 'var(--serif)' }, st.result),
        svg('path', { d: `M${m.l},${cy - h / 2} H${x1 - rr} Q${x1},${cy - h / 2} ${x1},${cy - h / 2 + rr} V${cy + h / 2 - rr} Q${x1},${cy + h / 2} ${x1 - rr},${cy + h / 2} H${m.l} Z`, fill: 'var(--accent)' }),
        svg('text', { x: x1 + 8, y: cy + 4.5, 'font-size': 12.5, fill: 'var(--ink)', 'font-weight': 600, 'font-family': 'var(--sans)', text: st.delta.toFixed(st.delta < 0.001 ? 6 : 5).replace(/0+$/, '') }),
      )
      // the reference is mathematics; the note after it is prose, set plainly
      const subLine = mtext({ class: 'label', x: m.l, y: top + 31, 'font-size': 12 }, st.ref)
      if (!narrow && st.keeps) subLine.append(svg('tspan', { text: ` · ${st.keeps}` }))
      g.append(subLine)
      const hit = svg('rect', { x: 0, y: top, width: W, height: rowH, fill: 'transparent' })
      hit.addEventListener('pointermove', () => {
        const pt = root.getBoundingClientRect()
        const s = pt.width / W
        tip.show(x1 * s, (cy - h / 2) * s, [el('div', {}, el('b', {}, st.name)), el('div', {}, `δ = ${st.delta.toPrecision(3)}`), st.keeps ? el('div', {}, st.keeps) : null].filter(Boolean))
      })
      hit.addEventListener('pointerleave', () => tip.hide())
      g.append(hit)
    })
  }
  onWidth(box, draw)
  draw()
}
