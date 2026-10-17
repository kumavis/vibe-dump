// Chapter 5: Strassen's seven products and the shape of his recursion
// (after Figure 2 of the paper).

import { $, el, svg } from '../util.js'

const v = (name, sub) => `<var>${name}</var><sub>${sub}</sub>`
const a = (s) => v('a', s)
const b = (s) => v('b', s)
const S = (k) => v('S', k)

// Laid out in two columns, S1–S4 on the left and S5–S7 on the right, as in
// the paper; `order` is the reading order a one-column phone layout uses.
const PRODUCTS = [
  [1, `(${a(11)} + ${a(22)})(${b(11)} + ${b(22)})`],
  [5, `(${a(11)} + ${a(12)}) ${b(22)}`],
  [2, `(${a(21)} + ${a(22)}) ${b(11)}`],
  [6, `(${a(21)} − ${a(11)})(${b(11)} + ${b(12)})`],
  [3, `${a(11)} (${b(12)} − ${b(22)})`],
  [7, `(${a(12)} − ${a(22)})(${b(21)} + ${b(22)})`],
  [4, `${a(22)} (${b(21)} − ${b(11)})`],
]

export function initStrassen() {
  const eqs = $('#strassen-eqs')
  const tree = $('#strassen-svg')
  if (!eqs || !tree) return
  for (const [k, rhs] of PRODUCTS) eqs.append(el('span', { html: `${S(k)} = ${rhs}`, style: `--order:${k}` }))
  eqs.append(
    el('span', {}),
    el('span', {
      class: 'full',
      html:
        `<var>AB</var> = ` +
        `<span style="display:inline-grid;grid-template-columns:auto auto;gap:2px 18px;vertical-align:middle;border-left:1.5px solid currentColor;border-right:1.5px solid currentColor;border-radius:6px;padding:4px 10px">` +
        `<span>${S(1)} + ${S(4)} − ${S(5)} + ${S(7)}</span><span>${S(3)} + ${S(5)}</span>` +
        `<span>${S(2)} + ${S(4)}</span><span>${S(1)} − ${S(2)} + ${S(3)} + ${S(6)}</span></span>`,
    }),
  )

  // the recursion tree
  const W = 470
  const H = 300
  tree.setAttribute('viewBox', `0 0 ${W} ${H}`)
  const g = svg('g')
  tree.append(g)
  const box = (x, y, w, h, label, small) => {
    g.append(svg('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 3, fill: 'var(--tikz)', stroke: 'var(--tikz-line)', 'stroke-width': 1 }))
    g.append(
      svg(
        'text',
        { x, y: y + (small ? 3.5 : 4.5), 'text-anchor': 'middle', 'font-family': 'var(--serif)', 'font-size': small ? 10 : 13.5, fill: 'var(--ink)' },
        ...label,
      ),
    )
  }
  const it = (t) => svg('tspan', { 'font-style': 'italic', 'font-family': 'var(--mathit)', text: t })
  const tx = (t) => svg('tspan', { text: t })
  const rootY = 34
  const lvl1 = 116
  const lvl2 = 180
  const leafY = 262
  const xs = Array.from({ length: 7 }, (_, i) => 40 + i * ((W - 80) / 6))
  // edges
  for (const x of xs) g.append(svg('line', { x1: W / 2, y1: rootY + 13, x2: x, y2: lvl1 - 12, stroke: 'var(--ink-3)', 'stroke-width': 1 }))
  for (const x of xs)
    for (let k = 0; k < 7; k++) {
      const cx = x - 21 + k * 7
      g.append(svg('line', { x1: x, y1: lvl1 + 12, x2: cx, y2: lvl2 - 5, stroke: 'var(--ink-3)', 'stroke-width': 0.7 }))
      g.append(svg('rect', { x: cx - 2.5, y: lvl2 - 5, width: 5, height: 9, fill: 'var(--tikz)', stroke: 'var(--tikz-line)', 'stroke-width': 0.7 }))
    }
  box(W / 2, rootY, 64, 26, [it('N'), tx(' × '), it('N')])
  for (const x of xs) box(x, lvl1, 52, 24, [it('N'), tx('/2')], false)
  for (const x of xs) g.append(svg('text', { x, y: lvl2 + 30, 'text-anchor': 'middle', 'font-family': 'var(--serif)', 'font-size': 16, fill: 'var(--ink-3)', text: '⋮' }))
  // the leaves: a dense row
  const leaves = 7 * 7
  for (let i = 0; i < leaves; i++) {
    const x = 34 + i * ((W - 68) / (leaves - 1))
    g.append(svg('rect', { x: x - 2, y: leafY - 5, width: 4, height: 10, rx: 1, fill: 'var(--accent)', opacity: 0.8 }))
  }
  g.append(
    svg('text', { x: W / 2, y: leafY + 26, 'text-anchor': 'middle', 'font-family': 'var(--sans)', 'font-size': 12.5, fill: 'var(--ink-2)' }, tx('7'), svg('tspan', { dy: -6, 'font-size': 9, 'font-style': 'italic', 'font-family': 'var(--mathit)', text: 'L' }), svg('tspan', { dy: 6, text: ' leaves, each a product of two numbers' })),
    svg('text', { x: 8, y: rootY - 6, 'font-family': 'var(--sans)', 'font-size': 12, fill: 'var(--ink-3)', text: '↓ encode' }),
    svg('text', { x: W - 8, y: rootY - 6, 'text-anchor': 'end', 'font-family': 'var(--sans)', 'font-size': 12, fill: 'var(--ink-3)', text: 'decode ↑' }),
  )
}
