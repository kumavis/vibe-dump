// Chapter 3: a small lopsided graph and the thin product that counts its
// triangles, then what the three ways of computing wanted entries cost.

import { $, el, svg, fmt, rng, tooltip, dec, onWidth } from '../util.js'
import { frame, linear, mtext } from '../chart.js'

const NA = 8
const NM = 3

function makeGraph() {
  const r = rng(7)
  // a fixed, hand-checked instance: varied common-neighbour counts
  for (let attempt = 0; attempt < 500; attempt++) {
    const X = Array.from({ length: NA }, () => Array.from({ length: NM }, () => (r() < 0.45 ? 1 : 0)))
    const Y = Array.from({ length: NM }, () => Array.from({ length: NA }, () => (r() < 0.45 ? 1 : 0)))
    const XY = X.map((row) => Array.from({ length: NA }, (_, b) => row.reduce((s, x, c) => s + x * Y[c][b], 0)))
    const W = []
    const seen = new Set()
    while (W.length < 6) {
      const a = Math.floor(r() * NA)
      const b = Math.floor(r() * NA)
      if (seen.has(`${a},${b}`)) continue
      seen.add(`${a},${b}`)
      W.push([a, b])
    }
    const counts = W.map(([a, b]) => XY[a][b])
    const has = (k) => counts.includes(k)
    if (has(0) && has(1) && has(2) && X.every((row) => row.some(Boolean)) && Y.every((row) => row.some(Boolean))) {
      W.sort((p, q) => p[0] - q[0] || p[1] - q[1])
      return { X, Y, XY, W }
    }
  }
  throw new Error('no instance')
}

export function initLopsided() {
  const svgRoot = $('#lop-svg')
  if (!svgRoot) return
  const mats = $('#lop-mats')
  const readout = $('#lop-readout')
  const { X, Y, XY, W } = makeGraph()
  let sel = W.findIndex(([a, b]) => XY[a][b] === 2)
  if (sel < 0) sel = 0

  const VW = 380
  const VH = 312
  svgRoot.setAttribute('viewBox', `0 0 ${VW} ${VH}`)
  const ax = 46
  const bx = VW - 46
  const mx = VW / 2
  const ay = (i) => 26 + i * ((VH - 52) / (NA - 1))
  const my = (c) => VH / 2 + (c - (NM - 1) / 2) * 64

  function drawGraph() {
    svgRoot.replaceChildren()
    const [sa, sb] = W[sel]
    const common = new Set([...Array(NM).keys()].filter((c) => X[sa][c] && Y[c][sb]))
    const gEdges = svg('g')
    const gHot = svg('g')
    const gQ = svg('g')
    const gNodes = svg('g')
    svgRoot.append(gEdges, gQ, gHot, gNodes)
    for (let a = 0; a < NA; a++)
      for (let c = 0; c < NM; c++)
        if (X[a][c]) {
          const hot = a === sa && common.has(c)
          ;(hot ? gHot : gEdges).append(svg('line', { x1: ax, y1: ay(a), x2: mx, y2: my(c), stroke: hot ? 'var(--accent)' : 'var(--rule-2)', 'stroke-width': hot ? 2.4 : 1 }))
        }
    for (let c = 0; c < NM; c++)
      for (let b = 0; b < NA; b++)
        if (Y[c][b]) {
          const hot = b === sb && common.has(c)
          ;(hot ? gHot : gEdges).append(svg('line', { x1: mx, y1: my(c), x2: bx, y2: ay(b), stroke: hot ? 'var(--accent)' : 'var(--rule-2)', 'stroke-width': hot ? 2.4 : 1 }))
        }
    // query pairs: arcs passing above the middle part
    W.forEach(([a, b], i) => {
      const y1 = ay(a)
      const y2 = ay(b)
      const cy = Math.min(y1, y2) - 70 - i * 6
      const path = svg('path', {
        d: `M${ax},${y1} C${ax + 90},${cy} ${bx - 90},${cy} ${bx},${y2}`,
        fill: 'none',
        stroke: 'var(--wanted)',
        'stroke-width': i === sel ? 2.6 : 1.3,
        'stroke-dasharray': i === sel ? null : '4 3',
        opacity: i === sel ? 1 : 0.55,
        style: 'cursor:pointer',
      })
      const hit = svg('path', { d: path.getAttribute('d'), fill: 'none', stroke: 'transparent', 'stroke-width': 12, style: 'cursor:pointer' })
      hit.addEventListener('click', () => select(i))
      gQ.append(path, hit)
    })
    const node = (x, y, label, kind) => {
      const on = kind === 'sel' || kind === 'common'
      gNodes.append(
        svg('circle', {
          cx: x, cy: y, r: kind === 'm' || kind === 'common' ? 9 : 7,
          fill: kind === 'sel' ? 'var(--wanted)' : kind === 'common' ? 'var(--accent)' : 'var(--paper)',
          stroke: on ? 'none' : 'var(--ink-2)',
          'stroke-width': 1.2,
        }),
        svg('text', {
          x: x + (x < mx ? -14 : x > mx ? 14 : 0),
          y: x === mx ? y - 15 : y + 4,
          'text-anchor': x < mx ? 'end' : x > mx ? 'start' : 'middle',
          'font-family': 'var(--mathit)',
          'font-style': 'italic',
          'font-size': 13,
          fill: on ? 'var(--ink)' : 'var(--ink-2)',
          text: label,
        }),
      )
    }
    for (let a = 0; a < NA; a++) node(ax, ay(a), `a${a + 1}`, a === sa ? 'sel' : '')
    for (let b = 0; b < NA; b++) node(bx, ay(b), `b${b + 1}`, b === sb ? 'sel' : '')
    for (let c = 0; c < NM; c++) node(mx, my(c), `m${c + 1}`, common.has(c) ? 'common' : 'm')
    gNodes.append(
      svg('text', { x: ax, y: VH - 2, 'text-anchor': 'middle', 'font-family': 'var(--sans)', 'font-size': 12, fill: 'var(--ink-3)', text: 'A' }),
      svg('text', { x: mx, y: VH - 2, 'text-anchor': 'middle', 'font-family': 'var(--sans)', 'font-size': 12, fill: 'var(--ink-3)', text: 'middle' }),
      svg('text', { x: bx, y: VH - 2, 'text-anchor': 'middle', 'font-family': 'var(--sans)', 'font-size': 12, fill: 'var(--ink-3)', text: 'B' }),
    )
  }

  function table(rows, cols, cell, rowLab, colLab) {
    const t = el('table', { class: 'mat' })
    t.append(el('tr', {}, el('th'), ...Array.from({ length: cols }, (_, j) => el('th', {}, colLab(j)))))
    for (let i = 0; i < rows; i++) t.append(el('tr', {}, el('th', {}, rowLab(i)), ...Array.from({ length: cols }, (_, j) => cell(i, j))))
    return t
  }

  function drawMats() {
    const [sa, sb] = W[sel]
    const q = new Map(W.map(([a, b], i) => [`${a},${b}`, i]))
    const tX = table(NA, NM, (i, j) => el('td', { class: [X[i][j] ? 'one' : '', i === sa ? 'hl' : ''].join(' ') }, X[i][j]), (i) => `a${i + 1}`, (j) => `m${j + 1}`)
    const tY = table(NM, NA, (i, j) => el('td', { class: [Y[i][j] ? 'one' : '', j === sb ? 'hl' : ''].join(' ') }, Y[i][j]), (i) => `m${i + 1}`, (j) => `b${j + 1}`)
    const tXY = table(
      NA,
      NA,
      (i, j) => {
        const qi = q.get(`${i},${j}`)
        if (qi == null) return el('td', { 'aria-hidden': 'true' }, '')
        return el(
          'td',
          { class: `q ${qi === sel ? 'sel' : ''}`, role: 'button', tabindex: 0, 'aria-label': `query pair a${i + 1}, b${j + 1}`, onclick: () => select(qi), onkeydown: (ev) => (ev.key === 'Enter' || ev.key === ' ') && (ev.preventDefault(), select(qi)) },
          XY[i][j],
        )
      },
      (i) => `a${i + 1}`,
      (j) => `b${j + 1}`,
    )
    const box = (cls, t, cap) => el('div', { class: cls }, cap && cls === 'y' ? el('p', { class: 'mat-cap', html: cap }) : null, t, cap && cls !== 'y' ? el('p', { class: 'mat-cap', html: cap }) : null)
    mats.replaceChildren(
      el(
        'div',
        { class: 'falk' },
        box('y', tY, '<var>Y</var>, 3×8'),
        box('x', tX, '<var>X</var>, 8×3'),
        box('xy', tXY, '<var>XY</var>, wanted entries only'),
      ),
    )
    const terms = [...Array(NM).keys()].map((c) => `${X[sa][c]}·${Y[c][sb]}`)
    const k = XY[sa][sb]
    const common = [...Array(NM).keys()].filter((c) => X[sa][c] && Y[c][sb]).map((c) => `<var>m</var><sub>${c + 1}</sub>`)
    const words = ['No', 'One', 'Two', 'Three']
    readout.innerHTML =
      `Query pair <var>a</var><sub>${sa + 1}</sub>, <var>b</var><sub>${sb + 1}</sub>: ` +
      `(<var>XY</var>)[${sa + 1}, ${sb + 1}] = ${terms.join(' + ')} = <b>${k}</b>. ` +
      (k === 0
        ? 'No common neighbour, so no triangle through this pair.'
        : `${words[k]} common neighbour${k > 1 ? 's' : ''}, ${common.join(' and ')}, close${k > 1 ? '' : 's'} ${k > 1 ? words[k].toLowerCase() : 'one'} triangle${k > 1 ? 's' : ''}.`)
  }

  function select(i) {
    sel = i
    drawGraph()
    drawMats()
  }
  select(sel)
}

// ───────────────────────────────────────── costs, relative to n²

export function initCost() {
  const box = $('#cost-chart')
  if (!box) return
  const nIn = $('#cost-n')
  const eIn = $('#cost-eps')
  const nOut = $('#cost-n-out')
  const eOut = $('#cost-eps-out')
  box.style.position = 'relative'
  const tip = tooltip(box)

  function draw() {
    const lgn = Number(nIn.value)
    const eps = Number(eIn.value) / 1800
    const lgD = eps * lgn
    nOut.innerHTML = `10<sup>${lgn}</sup>`
    eOut.innerHTML = `${pow10(lgD)} <span style="color:var(--ink-3);font-weight:400">(<var>ε</var> = ${eps.toFixed(4)})</span>`
    // log10 of each cost divided by n²
    const rows = [
      { label: 'Each wanted entry directly', short: 'Each entry directly', formula: '|W|·D = n^{2}√D', v: 0.5 * lgD, color: 'var(--wanted)' },
      { label: 'The whole product', short: 'Whole product', formula: 'n^{2+o(1)}, at least n^{2}', v: 0, color: 'var(--ink-3)' },
      { label: 'This paper, Corollary 26', short: 'This paper', formula: 'n^{2}/D^{0.063}', v: -0.063 * lgD, color: 'var(--accent)' },
    ]
    const W = Math.max(300, box.clientWidth)
    const narrow = W < 560
    const rowH = 64
    const m = { l: 12, r: 12, t: 30, b: 36 }
    const H = m.t + rows.length * rowH + m.b
    const ext = Math.max(0.6, ...rows.map((r) => Math.abs(r.v))) * 1.25
    const x = linear([-ext, ext], [m.l, W - m.r])
    const root = frame(box, W, H)
    root.setAttribute('aria-label', 'Operations relative to n squared for three ways of computing the wanted entries')
    const g = svg('g')
    root.append(g)
    // grid: round factors either side of n²
    const step = ext > 3 ? 1 : ext > 1.2 ? 0.5 : 0.25
    const ticks = []
    for (let t = -Math.floor(ext / step) * step; t <= ext + 1e-9; t += step) ticks.push(t)
    const every = narrow && ticks.length > 5 ? 2 : 1
    ticks.forEach((t, i) => {
      const px = x(t)
      g.append(svg('line', { x1: px, x2: px, y1: m.t - 6, y2: H - m.b, stroke: Math.abs(t) < 1e-9 ? 'var(--ink-3)' : 'var(--rule)', 'stroke-width': 1 }))
      if (Math.abs(t) < 1e-9 || i % every === 0) g.append(mtext({ x: px, y: H - m.b + 18, 'text-anchor': 'middle', fill: 'var(--ink-3)', 'font-size': 12, 'font-family': 'var(--sans)' }, factorLabel(t)))
    })
    g.append(
      mtext({ class: 'label', x: x(0), y: m.t - 14, 'text-anchor': 'middle' }, `n^{2} = ${pow10Plain(2 * lgn)}`),
      svg('text', { class: 'label', x: m.l, y: m.t - 14, text: '← fewer' }),
      svg('text', { class: 'label', x: W - m.r, y: m.t - 14, 'text-anchor': 'end', text: 'more →' }),
    )
    rows.forEach((r, i) => {
      const top = m.t + rowH * i
      const cy = top + 40
      const h = 18
      // the label sits on the side of n² the bar does not use
      const labelLeft = r.v <= 0
      const lx = labelLeft ? x(0) + 10 : x(0) - 10
      const anchor = labelLeft ? 'start' : 'end'
      g.append(
        svg('text', { class: 'label--strong', x: lx, y: top + 16, 'text-anchor': anchor, text: narrow ? r.short : r.label }),
        mtext({ class: 'label', x: lx, y: cy + 5, 'text-anchor': anchor, 'font-family': 'var(--serif)', 'font-size': 14 }, r.formula),
      )
      if (Math.abs(r.v) < 1e-9) {
        g.append(svg('rect', { x: x(0) - 2, y: cy - h / 2, width: 4, height: h, rx: 2, fill: r.color }))
      } else {
        const x0 = x(0)
        const x1 = x(r.v)
        const rr = Math.min(4, Math.abs(x1 - x0) / 2)
        const s = r.v > 0 ? 1 : -1
        g.append(svg('path', { d: `M${x0},${cy - h / 2} H${x1 - s * rr} Q${x1},${cy - h / 2} ${x1},${cy - h / 2 + rr} V${cy + h / 2 - rr} Q${x1},${cy + h / 2} ${x1 - s * rr},${cy + h / 2} H${x0} Z`, fill: r.color }))
      }
      const val = r.v === 0 ? '' : r.v > 0 ? `× ${factor(r.v)}` : `÷ ${factor(-r.v)}`
      if (val) g.append(mtext({ class: 'label--strong halo', x: r.v > 0 ? x(r.v) + 8 : x(r.v) - 8, y: cy + 4.5, 'text-anchor': r.v > 0 ? 'start' : 'end' }, val))
      const hit = svg('rect', { x: 0, y: top, width: W, height: rowH, fill: 'transparent' })
      hit.addEventListener('pointermove', () => {
        const pt = root.getBoundingClientRect()
        const sc = pt.width / W
        tip.show(x(r.v) * sc, (cy - h / 2) * sc, [el('div', {}, el('b', { html: pow10(2 * lgn + r.v) }), ' operations'), el('div', {}, r.label)])
      })
      hit.addEventListener('pointerleave', () => tip.hide())
      g.append(hit)
    })
  }

  nIn.addEventListener('input', draw)
  eIn.addEventListener('input', draw)
  onWidth(box, draw)
  draw()
}

function factor(lg) {
  const f = 10 ** lg
  if (f < 10) return f.toFixed(f < 1.995 ? 3 : 2)
  if (f < 1000) return f.toFixed(0)
  return pow10Plain(lg)
}
function factorLabel(t) {
  if (Math.abs(t) < 1e-9) return '1×'
  const f = 10 ** Math.abs(t)
  const s = f >= 100 ? `10^{${Math.abs(t).toFixed(0)}}` : f >= 9.95 ? '10' : f.toFixed(f < 2 ? 2 : 1)
  return t > 0 ? `×${s}` : `÷${s}`
}
function pow10Plain(lg) {
  if (lg < 4) return fmt(10 ** lg)
  const whole = Math.floor(lg)
  const mant = 10 ** (lg - whole)
  return `${mant.toFixed(1)}×10^{${whole}}`
}
function pow10(lg) {
  if (lg < 4) return dec(10 ** lg, lg < 1 ? 2 : 1)
  const whole = Math.floor(lg)
  const mant = 10 ** (lg - whole)
  return `${mant.toFixed(1)}×10<sup>${whole}</sup>`
}
