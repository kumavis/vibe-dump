// Chapter 10: Lemma 11 at full size (after Figure 7 of the paper). Every
// count is drawn as a power of D relative to M, the number of entries in a
// tile, so the picture keeps its shape as m runs into the thousands.

import { $, el, svg, fmt, dec, tooltip, onWidth } from '../util.js'
import { frame, linear, niceTicks, mtext } from '../chart.js'
import { orderCounts, logSumExp } from '../algo.js'

const LOG4_10 = Math.log(10) / Math.log(4)
const mFromSlider = (v) => Math.max(1, Math.round(Math.exp((v / 1000) * Math.log(2000))))

export function initScale() {
  const box = $('#scale-chart')
  if (!box) return
  const mIn = $('#sc-m')
  const cIn = $('#sc-c')
  const kIn = $('#sc-k')
  const mOut = $('#sc-m-out')
  const cOut = $('#sc-c-out')
  const kOut = $('#sc-k-out')
  const tilesBox = $('#scale-tiles')
  box.style.position = 'relative'
  const tip = tooltip(box)

  const legend = el(
    'div',
    { class: 'legend' },
    el('span', {}, el('i', { style: 'color:var(--wanted)' }), 'charge each wanted entry for its own: ', el('span', { class: 'm', html: '|<var>U</var>|·<var>α</var><sub><var>d</var></sub>' })),
    el('span', {}, el('i', { style: 'color:var(--accent)' }), 'take every leaf of that order: ', el('span', { class: 'm', html: '<var>β</var><sub><var>d</var></sub>' })),
  )
  box.before(legend)

  function draw() {
    const m = mFromSlider(Number(mIn.value))
    const c = Number(cIn.value)
    const kappa = Number(kIn.value)
    const L = Math.round(c * m)
    const lnD = m * Math.log(4)
    const { alpha, beta, M } = orderCounts(L, m)
    const lnU = M - kappa * lnD
    const toD = (ln) => (ln - M) / lnD // a count as a power of D, relative to M
    const charged = alpha.map((a) => toD(lnU + a))
    const all = beta.map((b) => toD(b))
    const mins = charged.map((v, d) => Math.min(v, all[d]))
    const total = toD(logSumExp(charged.map((v, d) => Math.min(lnU + alpha[d], beta[d]))))
    const gamma = -total
    const D10 = (m * Math.log10(4))

    mOut.innerHTML = `${fmt(m)} <span style="color:var(--ink-3);font-weight:400">(<var>D</var> ≈ 10<sup>${fmt(Math.floor(D10))}</sup>)</span>`
    cOut.innerHTML = `${dec(c, 1)} <span style="color:var(--ink-3);font-weight:400">(<var>L</var> = ${fmt(L)})</span>`
    kOut.textContent = dec(kappa, 2)

    const refs = [
      { y: 0, label: 'M, one leaf per entry of the tile', strong: true },
      { y: -kappa, label: '|U|, one per wanted entry' },
      { y: 1 - kappa, label: '|U|·D, each wanted entry directly' },
      { y: LOG4_10 - kappa, label: '|U|·10^{m}, each entry on its own' },
    ]
    const ys = [...charged, ...all, ...refs.map((r) => r.y)]
    const yMin = Math.min(...ys) - 0.12
    const yMax = Math.max(...ys) + 0.12
    const W = Math.max(300, box.clientWidth)
    const narrow = W < 640
    const H = narrow ? 330 : 390
    const mg = { l: 54, r: narrow ? 12 : 236, t: 16, b: 46 }
    const x = linear([0, m], [mg.l, W - mg.r])
    const y = linear([yMin, yMax], [H - mg.b, mg.t])
    const root = frame(box, W, H)
    root.setAttribute('aria-label', `Leaf counts by order for m = ${m}, L = ${L}: the wanted entries need at most M divided by D to the ${gamma.toFixed(4)} leaves`)
    const g = svg('g')
    root.append(g)

    // grid and axes
    for (const t of niceTicks(yMin, yMax, 6)) {
      g.append(
        svg('line', { x1: mg.l, x2: W - mg.r, y1: y(t), y2: y(t), stroke: 'var(--rule)', 'stroke-width': 1 }),
        mtext({ x: mg.l - 8, y: y(t) + 4, 'text-anchor': 'end', 'font-size': 12, fill: 'var(--ink-3)', 'font-family': 'var(--sans)' }, t === 0 ? 'M' : `D^{${trim(t)}}M`),
      )
    }
    for (const t of niceTicks(0, m, 6)) {
      g.append(
        svg('line', { x1: x(t), x2: x(t), y1: H - mg.b, y2: H - mg.b + 4, stroke: 'var(--rule-2)' }),
        svg('text', { x: x(t), y: H - mg.b + 18, 'text-anchor': 'middle', 'font-size': 12, fill: 'var(--ink-3)', 'font-family': 'var(--sans)', text: fmt(t) }),
      )
    }
    g.append(
      svg('line', { x1: mg.l, x2: W - mg.r, y1: H - mg.b, y2: H - mg.b, stroke: 'var(--rule-2)' }),
      mtext({ class: 'label', x: mg.l + (W - mg.l - mg.r) / 2, y: H - 6, 'text-anchor': 'middle' }, 'leaf order d'),
    )

    // the bound: the smaller curve at each order, shaded
    const pts = (arr) => arr.map((v, d) => `${x(d).toFixed(1)},${y(v).toFixed(1)}`)
    const area = `M${x(0)},${y(yMin)} L${pts(mins).join(' L')} L${x(m)},${y(yMin)} Z`
    g.append(svg('path', { d: area, fill: 'var(--ink)', opacity: 0.07 }))

    // reference lines; their labels sit in the right margin, nudged apart,
    // or on a narrow screen just above each line at the left
    const placed = refs.map((r) => ({ ...r, ly: y(r.y) + (narrow ? -5 : 4) })).sort((a, b) => a.ly - b.ly)
    for (let i = 1; i < placed.length; i++) if (placed[i].ly - placed[i - 1].ly < 15) placed[i].ly = placed[i - 1].ly + 15
    for (const r of placed) {
      g.append(svg('line', { x1: mg.l, x2: W - mg.r, y1: y(r.y), y2: y(r.y), stroke: r.strong ? 'var(--ink-2)' : 'var(--ink-3)', 'stroke-width': r.strong ? 1.4 : 1, 'stroke-dasharray': r.strong ? null : '1 3' }))
      if (!narrow && Math.abs(r.ly - 4 - y(r.y)) > 1) g.append(svg('line', { x1: W - mg.r, x2: W - mg.r + 6, y1: y(r.y), y2: r.ly - 4, stroke: 'var(--ink-3)', 'stroke-width': 1 }))
      g.append(mtext({ class: narrow ? 'halo' : null, x: narrow ? mg.l + 6 : W - mg.r + 8, y: r.ly, 'font-size': narrow ? 11 : 12, fill: r.strong ? 'var(--ink)' : 'var(--ink-2)', 'font-family': 'var(--sans)', 'font-weight': r.strong ? 600 : 400 }, narrow ? r.label.split(',')[0] : r.label))
    }

    // the two curves
    const line = (arr, stroke) => svg('polyline', { points: pts(arr).join(' '), fill: 'none', stroke, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' })
    g.append(line(charged, 'var(--wanted)'), line(all, 'var(--accent)'))

    // the total of Lemma 11
    const ty = y(total)
    g.append(
      svg('line', { x1: mg.l, x2: W - mg.r, y1: ty, y2: ty, stroke: 'var(--accent)', 'stroke-width': 1.2, 'stroke-dasharray': '6 3' }),
      mtext({ class: 'halo', x: W - mg.r - 6, y: ty + 16, 'text-anchor': 'end', 'font-size': 12.5, fill: 'var(--accent-ink)', 'font-weight': 600, 'font-family': 'var(--sans)' }, `${narrow ? 'total' : 'sum of the shaded minimum'}: D^{${dec(total, 4)}}M`),
    )

    // tiles
    const tile = (label, value, note, key) =>
      el('div', { class: `tile ${key ? 'tile--key' : ''}` }, el('span', { class: 'tile__label', html: label }), el('span', { class: 'tile__value', html: value }), note ? el('span', { class: 'tile__note', html: note }) : null)
    const pow = (e) => `<var>D</var><sup>${dec(e, 4)}</sup>`
    tilesBox.replaceChildren(
      tile('leaves needed, at most', gamma > 0 ? `<var>M</var> / ${pow(gamma)}` : `<var>M</var> · ${pow(-gamma)}`, gamma > 0 ? 'fewer than one per entry of the tile' : 'more than one per entry: no saving', true),
      tile('the paper’s proof', `<var>M</var> / <var>D</var><sup>1/18</sup>`, 'for <var>L</var> = 19<var>m</var>, splitting at order <var>m</var>/9'),
      tile('each wanted entry directly', `<var>M</var> · ${pow(1 - kappa)}`, '|<var>U</var>| inner products of length <var>D</var>'),
      tile('every leaf in the run', `<var>M</var> · ${pow(toD(L * Math.log(10)))}`, `10<sup><var>L</var></sup> multiplications`),
    )

    // hover: snap to the nearest order
    const hair = svg('line', { y1: mg.t, y2: H - mg.b, stroke: 'var(--ink-3)', 'stroke-width': 1, opacity: 0 })
    const dA = svg('circle', { r: 4, fill: 'var(--wanted)', stroke: 'var(--panel)', 'stroke-width': 2, opacity: 0 })
    const dB = svg('circle', { r: 4, fill: 'var(--accent)', stroke: 'var(--panel)', 'stroke-width': 2, opacity: 0 })
    g.append(hair, dA, dB)
    const hit = svg('rect', { x: mg.l, y: mg.t, width: W - mg.l - mg.r, height: H - mg.t - mg.b, fill: 'transparent' })
    g.append(hit)
    hit.addEventListener('pointermove', (ev) => {
      const pt = root.getBoundingClientRect()
      const sx = ((ev.clientX - pt.left) / pt.width) * W
      const d = Math.max(0, Math.min(m, Math.round(x.invert(sx))))
      const px = x(d)
      hair.setAttribute('x1', px)
      hair.setAttribute('x2', px)
      dA.setAttribute('cx', px)
      dA.setAttribute('cy', y(charged[d]))
      dB.setAttribute('cx', px)
      dB.setAttribute('cy', y(all[d]))
      for (const n of [hair, dA, dB]) n.setAttribute('opacity', 1)
      const s = pt.width / W
      const powEl = (e) => el('span', { class: 'm', html: `<var>D</var><sup>${dec(e, 3)}</sup><var>M</var>` })
      tip.show(px * s, y(Math.max(charged[d], all[d])) * s, [
        el('div', {}, el('b', {}, `order ${fmt(d)}`)),
        el('div', {}, el('span', { class: 'k', style: 'background:var(--wanted)' }), 'charged: ', powEl(charged[d])),
        el('div', {}, el('span', { class: 'k', style: 'background:var(--accent)' }), 'all of this order: ', powEl(all[d])),
      ])
    })
    hit.addEventListener('pointerleave', () => {
      tip.hide()
      for (const n of [hair, dA, dB]) n.setAttribute('opacity', 0)
    })
  }

  for (const n of [mIn, cIn, kIn]) n.addEventListener('input', draw)
  mIn.value = String(Math.round((Math.log(200) / Math.log(2000)) * 1000))
  onWidth(box, draw)
  draw()
}

// a tick value without trailing zeros, with a true minus sign
function trim(t) {
  const s = String(Math.round(t * 100) / 100)
  return s.startsWith('-') ? `−${s.slice(1)}` : s
}
