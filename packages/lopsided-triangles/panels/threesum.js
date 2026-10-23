// Chapter 1: the textbook 3SUM sweep, and why a polynomial factor is a
// different kind of speedup from a logarithmic one.

import { $, el, svg, fmt, signed, rng, randInt, reducedMotion, tooltip, onWidth } from '../util.js'
import { frame, linear, niceTicks, axisX, mtext } from '../chart.js'

let N = 14

function zeroTriples(a) {
  let count = 0
  for (let i = 0; i < a.length; i++)
    for (let j = i + 1; j < a.length; j++)
      for (let k = j + 1; k < a.length; k++) if (a[i] + a[j] + a[k] === 0) count++
  return count
}

// Distinct integers in [−90, 90], sorted, with exactly `want` zero triples.
function numbers(r, want) {
  for (let tries = 0; tries < 5000; tries++) {
    const s = new Set()
    if (want === 1) {
      const x = randInt(r, -90, -10)
      const y = randInt(r, 1, 80)
      const z = -(x + y)
      if (z < -90 || z > 90 || new Set([x, y, z]).size < 3) continue
      s.add(x).add(y).add(z)
    }
    while (s.size < N) s.add(randInt(r, -90, 90))
    const a = [...s].sort((p, q) => p - q)
    if (zeroTriples(a) === want) return a
  }
  return Array.from({ length: N }, (_, i) => 2 * i + 1)
}

export function initThreeSum() {
  const row = $('#ts-row')
  if (!row) return
  const readout = $('#ts-readout')
  const meter = $('#ts-meter')
  const runBtn = $('#ts-run')
  const stepBtn = $('#ts-step')
  const newBtn = $('#ts-new')
  const plant = $('#ts-plant')
  const r = rng(20261005)
  N = row.clientWidth && row.clientWidth < 520 ? 10 : 14
  const maxSteps = ((N - 1) * (N - 2)) / 2

  let a = []
  let i = 0
  let j = 1
  let k = N - 1
  let steps = 0
  let state = 'ready' // ready · running · found · none
  let timer = 0
  let tiles = []

  row.style.setProperty('--n', N)

  function reset(nums) {
    stop()
    a = nums
    i = 0
    j = 1
    k = N - 1
    steps = 0
    state = 'ready'
    tiles = a.map((x) => el('div', { class: 'ts-tile' }, signed(x)))
    row.replaceChildren(...tiles)
    render()
  }

  const sumText = () =>
    `${signed(a[i])} + ${signed(a[j])} + ${signed(a[k])} = ${signed(a[i] + a[j] + a[k])}`

  function render() {
    tiles.forEach((t, idx) => {
      t.className = 'ts-tile'
      t.querySelectorAll('.ts-ptr').forEach((p) => p.remove())
      if (state === 'none') {
        t.classList.add('done')
        return
      }
      if (state === 'found' && (idx === i || idx === j || idx === k)) t.classList.add('hit')
      else if (idx === i) t.classList.add('i')
      else if (idx === j) t.classList.add('j')
      else if (idx === k) t.classList.add('k')
      if (idx < i) t.classList.add('done')
      if (idx === i) t.append(el('span', { class: 'ts-ptr bot' }, 'i'))
      if (idx === j) t.append(el('span', { class: 'ts-ptr top' }, 'j'))
      if (idx === k) t.append(el('span', { class: 'ts-ptr top' }, 'k'))
    })
    meter.style.width = `${(100 * steps) / maxSteps}%`
    const stepWord = `${steps} step${steps === 1 ? '' : 's'}`
    if (state === 'found') {
      readout.replaceChildren(
        el('span', { class: 'm' }, sumText()),
        '. ',
        el('span', { class: 'ok' }, 'A zero triple'),
        `, found after ${stepWord}.`,
      )
    } else if (state === 'none') {
      readout.replaceChildren(
        `No three of these numbers sum to zero. Checked in ${stepWord}, out of at most ${maxSteps}.`,
      )
    } else {
      const s = a[i] + a[j] + a[k]
      readout.replaceChildren(
        el('span', { class: 'm' }, sumText()),
        ...(s < 0 ? [' is below zero, so ', el('var', {}, 'j'), ' moves right.'] : s > 0 ? [' is above zero, so ', el('var', {}, 'k'), ' moves left.'] : ['.']),
        el('br'),
        el('span', { style: 'color:var(--ink-3)' }, `${stepWord} so far.`),
      )
    }
    runBtn.textContent = state === 'running' ? 'Pause' : 'Run'
    const over = state === 'found' || state === 'none'
    runBtn.disabled = over
    stepBtn.disabled = over
  }

  function step() {
    if (state === 'found' || state === 'none') return
    const s = a[i] + a[j] + a[k]
    steps++
    if (s === 0) {
      state = 'found'
      stop()
      render()
      return
    }
    if (s < 0) j++
    else k--
    if (j >= k) {
      i++
      j = i + 1
      k = N - 1
      if (i > N - 3) {
        state = 'none'
        stop()
      }
    }
    render()
  }

  function stop() {
    clearInterval(timer)
    timer = 0
    if (state === 'running') state = 'ready'
  }

  runBtn.addEventListener('click', () => {
    if (state === 'running') {
      stop()
      render()
      return
    }
    state = 'running'
    render()
    timer = setInterval(step, reducedMotion() ? 60 : 170)
  })
  stepBtn.addEventListener('click', () => {
    if (state === 'running') stop()
    step()
  })
  newBtn.addEventListener('click', () => reset(numbers(r, plant.checked ? 1 : 0)))
  plant.addEventListener('change', () => reset(numbers(r, plant.checked ? 1 : 0)))

  reset(numbers(r, 1))
}

// ───────────────────────────────────────── polynomial versus logarithmic

export function initTruly() {
  const box = $('#truly-chart')
  if (!box) return
  const XMAX = 50000
  const poly = (b) => 0.0008 * b
  const logs = (b) => (b <= 1 ? 0 : 2 * Math.log2(b))
  const CROSS = 38038

  const legend = el(
    'div',
    { class: 'legend' },
    el('span', {}, el('i', { style: 'color:var(--accent)' }), 'divide by ', el('span', { class: 'm' }, el('var', {}, 'n'), el('sup', {}, '0.0008')), ' (this paper)'),
    el('span', {}, el('i', { style: 'color:var(--ink-3)' }), 'divide by ', el('span', { class: 'm' }, 'log', el('sup', {}, '2'), el('var', {}, 'n')), ' (a logarithmic shave)'),
  )
  box.before(legend)
  box.style.position = 'relative'
  const tip = tooltip(box)

  function draw() {
    const W = Math.max(300, box.clientWidth)
    const narrow = W < 520
    const H = narrow ? 250 : 320
    const m = { l: 40, r: narrow ? 58 : 84, t: 16, b: 46 }
    const x = linear([0, XMAX], [m.l, W - m.r])
    const y = linear([0, 44], [H - m.b, m.t])
    const root = frame(box, W, H)
    root.setAttribute('aria-label', 'Line chart: the speedup n to the 0.0008 overtakes log squared n when n has about 38,000 bits')
    const g = svg('g')
    root.append(g)

    for (const t of niceTicks(0, 44, 4)) {
      g.append(svg('line', { x1: m.l, x2: W - m.r, y1: y(t), y2: y(t), stroke: 'var(--rule)', 'stroke-width': 1 }))
      g.append(mtext({ x: m.l - 8, y: y(t) + 4, 'text-anchor': 'end', 'font-size': 12, fill: 'var(--ink-3)', 'font-family': 'var(--sans)' }, t === 0 ? '1×' : `2^{${t}}`))
    }
    axisX(g, niceTicks(0, XMAX, narrow ? 3 : 5).map((t) => [t, x(t)]), H - m.b, (t) => (t === 0 ? '0' : `${t / 1000}k`), m.l, W - m.r)
    g.append(mtext({ class: 'label', x: m.l + (W - m.l - m.r) / 2, y: H - 8, 'text-anchor': 'middle' }, 'bits in n, that is log_{2} n'))

    const path = (f) => {
      let d = ''
      for (let b = 2; b <= XMAX; b += 250) d += `${d ? 'L' : 'M'}${x(b).toFixed(1)},${y(f(b)).toFixed(1)}`
      return d
    }
    g.append(
      svg('path', { d: path(logs), fill: 'none', stroke: 'var(--ink-3)', 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }),
      svg('path', { d: path(poly), fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }),
    )
    // direct labels at the right end
    g.append(
      mtext({ class: 'label--strong', x: W - m.r + 8, y: y(poly(XMAX)) + 4 }, 'n^{0.0008}'),
      mtext({ class: 'label', x: W - m.r + 8, y: y(logs(XMAX)) + 4 }, 'log^{2}n'),
    )
    // the crossover
    const cx = x(CROSS)
    const cy = y(poly(CROSS))
    g.append(
      svg('line', { x1: cx, x2: cx, y1: cy, y2: H - m.b, stroke: 'var(--rule-2)', 'stroke-width': 1 }),
      svg('circle', { cx, cy, r: 4.5, fill: 'var(--ink)', stroke: 'var(--panel)', 'stroke-width': 2 }),
      svg('text', { class: 'label halo', x: cx - 10, y: cy - 12, 'text-anchor': 'end', text: narrow ? 'cross at 38,038 bits' : 'they cross at 38,038 bits' }),
    )

    // hover: a crosshair snapping to the pointer's x
    const hair = svg('line', { y1: m.t, y2: H - m.b, stroke: 'var(--ink-3)', 'stroke-width': 1, opacity: 0 })
    const dotP = svg('circle', { r: 4, fill: 'var(--accent)', stroke: 'var(--panel)', 'stroke-width': 2, opacity: 0 })
    const dotL = svg('circle', { r: 4, fill: 'var(--ink-3)', stroke: 'var(--panel)', 'stroke-width': 2, opacity: 0 })
    g.append(hair, dotL, dotP)
    const hit = svg('rect', { x: m.l, y: m.t, width: W - m.l - m.r, height: H - m.t - m.b, fill: 'transparent' })
    g.append(hit)
    hit.addEventListener('pointermove', (ev) => {
      const pt = root.getBoundingClientRect()
      const s = pt.width / W
      const b = Math.max(2, Math.min(XMAX, Math.round(x.invert((ev.clientX - pt.left) / s) / 100) * 100))
      const px = x(b)
      hair.setAttribute('x1', px)
      hair.setAttribute('x2', px)
      dotP.setAttribute('cx', px)
      dotP.setAttribute('cy', y(poly(b)))
      dotL.setAttribute('cx', px)
      dotL.setAttribute('cy', y(logs(b)))
      for (const n of [hair, dotP, dotL]) n.setAttribute('opacity', 1)
      const two = (e) => el('span', {}, '2', el('sup', {}, e.toFixed(1)))
      tip.show(px * s, y(Math.max(poly(b), logs(b))) * s, [
        el('div', {}, el('b', {}, `${fmt(b)} bits`), ` (${fmt(Math.ceil(b * Math.log10(2)))} digits)`),
        el('div', {}, el('span', { class: 'k', style: 'background:var(--accent)' }), 'n', el('sup', {}, '0.0008'), ' = ', two(poly(b))),
        el('div', {}, el('span', { class: 'k', style: 'background:var(--ink-3)' }), 'log', el('sup', {}, '2'), 'n = ', two(logs(b))),
      ])
    })
    hit.addEventListener('pointerleave', () => {
      tip.hide()
      for (const n of [hair, dotP, dotL]) n.setAttribute('opacity', 0)
    })
  }
  onWidth(box, draw)
  draw()
}
