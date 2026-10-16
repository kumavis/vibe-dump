// Chapter 9: the pruned recursion, run for real. A 243 + 16 + 243 lopsided
// graph, its 243×243 product as one tile with L = 6 and m = 2, a wanted set
// you choose, and every answer checked against a direct count.

import { $, el, svg, fmt, color, fitCanvas, onResize, onTheme, rng, tooltip } from '../util.js'
import { frame, linear } from '../chart.js'
import { createEngine, L, M } from '../engine.js'
import { TERMS, choose } from '../algo.js'

const N0 = 81
const N = 243
const D = 16
const LEAVES = 1e6
const ALPHA = [1, 18, 81] // leaves of order d under one entry
const BETA = [98415, 354294, 531441] // leaves of order d in the whole run

const PATTERNS = [
  ['clear', 'Clear'],
  ['one', 'One entry'],
  ['p01', '1% at random'],
  ['p25', 'A quarter (the paper’s density)'],
  ['block', 'One block'],
  ['all', 'All of it'],
]

function makeGraph(seed) {
  const r = rng(seed)
  const X = new Float64Array(N * D)
  const Y = new Float64Array(D * N)
  for (let i = 0; i < X.length; i++) X[i] = r() < 0.28 ? 1 : 0
  for (let i = 0; i < Y.length; i++) Y[i] = r() < 0.28 ? 1 : 0
  const XY = new Float64Array(N * N)
  for (let I = 0; I < N; I++)
    for (let J = 0; J < N; J++) {
      let s = 0
      for (let c = 0; c < D; c++) s += X[I * D + c] * Y[c * N + J]
      XY[I * N + J] = s
    }
  return { X, Y, XY }
}

// A worker when the browser allows one, the page itself otherwise.
function engineClient() {
  let worker = null
  try {
    worker = new Worker(new URL('../worker.js', import.meta.url), { type: 'module' })
  } catch {
    worker = null
  }
  let local = null
  let nextId = 1
  const waiting = new Map()
  if (worker) {
    worker.onmessage = (ev) => {
      const cb = waiting.get(ev.data.id)
      waiting.delete(ev.data.id)
      if (cb) cb(ev.data)
    }
    worker.onerror = () => {
      // fall back to the page for anything still pending
      worker = null
      for (const [, cb] of waiting) cb({ type: 'error', message: 'worker failed' })
      waiting.clear()
    }
  }
  const viaPage = (msg) =>
    new Promise((resolve) =>
      setTimeout(() => {
        if (!local) local = createEngine()
        try {
          if (msg.type === 'load') resolve({ type: 'loaded', ...local.load(msg.X, msg.Y) })
          else resolve({ type: 'result', ...local.run(msg.entries) })
        } catch (err) {
          resolve({ type: 'error', message: String(err) })
        }
      }, 0),
    )
  return (msg) => {
    if (!worker) return viaPage(msg)
    const id = nextId++
    return new Promise((resolve) => {
      waiting.set(id, (out) => (out.type === 'error' && out.message === 'worker failed' ? viaPage(msg).then(resolve) : resolve(out)))
      worker.postMessage({ ...msg, id })
    })
  }
}

export function initRun() {
  const xyCv = $('#run-xy')
  if (!xyCv) return
  const iceCv = $('#run-icicle')
  const xyCap = $('#run-xy-cap')
  const patBox = $('#run-patterns')
  const goBtn = $('#run-go')
  const tilesBox = $('#run-tiles')
  const ordersBox = $('#run-orders')
  const readout = $('#run-readout')
  const panel = $('#panel-run')

  const call = engineClient()
  let seed = 16
  let graph = makeGraph(seed)
  let wanted = new Uint8Array(N * N)
  let pattern = 'p25'
  let result = null
  let pending = 0
  let loaded = null
  const r = rng(243)

  goBtn.textContent = 'New random graph'

  const patBtns = PATTERNS.map(([key, label]) => {
    const b = el('button', { type: 'button', role: 'radio', 'aria-checked': 'false' }, label)
    b.addEventListener('click', () => {
      setPattern(key)
      runNow()
    })
    patBox.append(b)
    return [key, b]
  })

  function setPattern(key) {
    pattern = key
    wanted = new Uint8Array(N * N)
    if (key === 'one') wanted[100 * N + 150] = 1
    if (key === 'p01' || key === 'p25') {
      const p = key === 'p01' ? 0.01 : 0.25
      for (let i = 0; i < wanted.length; i++) wanted[i] = r() < p ? 1 : 0
    }
    if (key === 'block') for (let I = N0; I < 2 * N0; I++) for (let J = N0; J < 2 * N0; J++) wanted[I * N + J] = 1
    if (key === 'all') wanted.fill(1)
    patBtns.forEach(([k, b]) => b.setAttribute('aria-checked', String(k === key)))
    drawXY()
  }

  // ── the product, with the wanted entries in orange
  let xyScale = 2
  function drawXY() {
    const size = Math.min(xyCv.parentElement.clientWidth, 520)
    xyCv.style.width = `${size}px`
    xyCv.style.height = `${size}px`
    const { ctx } = fitCanvas(xyCv, size, size)
    xyScale = size / N
    const img = new ImageData(N, N)
    const paper = rgb(color('paper'))
    const ink = rgb(color('ink-3'))
    const wnt = rgb(color('wanted'))
    let max = 1
    for (const v of graph.XY) if (v > max) max = v
    for (let i = 0; i < N * N; i++) {
      const v = graph.XY[i] / max
      let c
      if (wanted[i]) c = wnt
      else c = mix(paper, ink, 0.08 + 0.5 * v)
      img.data[i * 4] = c[0]
      img.data[i * 4 + 1] = c[1]
      img.data[i * 4 + 2] = c[2]
      img.data[i * 4 + 3] = 255
    }
    const off = document.createElement('canvas')
    off.width = N
    off.height = N
    off.getContext('2d').putImageData(img, 0, 0)
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(off, 0, 0, size, size)
    // the nine block products, each labelled with its set Q
    ctx.strokeStyle = color('paper')
    ctx.lineWidth = 2
    for (let k = 1; k < 3; k++) {
      ctx.beginPath()
      ctx.moveTo((k * size) / 3, 0)
      ctx.lineTo((k * size) / 3, size)
      ctx.moveTo(0, (k * size) / 3)
      ctx.lineTo(size, (k * size) / 3)
      ctx.stroke()
    }
    const qs = ['{1,2}', '{1,3}', '{1,4}', '{1,5}', '{1,6}', '{2,3}', '{2,4}', '{2,5}', '{2,6}']
    ctx.font = `11px ${getComputedStyle(document.body).getPropertyValue('--sans')}`
    ctx.textBaseline = 'top'
    for (let i = 0; i < 9; i++) {
      const x = ((i % 3) * size) / 3 + 5
      const y = (Math.floor(i / 3) * size) / 3 + 4
      const t = `Q = ${qs[i]}`
      ctx.fillStyle = color('paper')
      ctx.fillRect(x - 2, y - 1, ctx.measureText(t).width + 4, 14)
      ctx.fillStyle = color('ink-2')
      ctx.fillText(t, x, y)
    }
  }

  // ── the recursion, one row per level, shaded by the share of calls made
  function drawIcicle() {
    const width = Math.min(iceCv.parentElement.clientWidth, 520)
    const height = width
    iceCv.style.width = `${width}px`
    iceCv.style.height = `${height}px`
    const { ctx } = fitCanvas(iceCv, width, height)
    ctx.clearRect(0, 0, width, height)
    const left = 66
    const top = 6
    const rowH = (height - top - 8) / (L + 1)
    const plotW = width - left - 4
    const sans = getComputedStyle(document.body).getPropertyValue('--sans')
    const mono = getComputedStyle(document.body).getPropertyValue('--mono')
    const base = rgb(color('panel-2'))
    const acc = mix(base, rgb(color('accent')), 0.78)
    const labels = ['root', '10 calls', '100', '1,000', '10,000', '100,000', '10⁶ leaves']
    ctx.font = `12px ${sans}`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'right'
    for (let d = 0; d <= L; d++) {
      const y = top + d * rowH
      const h = rowH - 6
      ctx.fillStyle = color('ink-3')
      ctx.fillText(labels[d], left - 8, y + h / 2)
      const bins = d === 0 ? [result ? 1 : 0] : result ? result.bins[d - 1] : new Float32Array(Math.min(10 ** d, 1000))
      const bw = plotW / bins.length
      for (let i = 0; i < bins.length; i++) {
        const f = bins[i]
        const c = mix(base, acc, f)
        ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`
        const x0 = Math.floor(left + i * bw)
        const x1 = Math.floor(left + (i + 1) * bw)
        ctx.fillRect(x0, y, Math.max(1, x1 - x0 - (bins.length <= 100 ? 1 : 0)), h)
      }
      if (d === 1) {
        ctx.font = `${width < 420 ? 9 : 10.5}px ${mono}`
        ctx.textAlign = 'center'
        for (let i = 0; i < 10; i++) {
          const f = bins[i]
          ctx.fillStyle = f > 0.5 ? '#ffffff' : color('ink-2')
          if (width >= 360 || i % 2 === 0) ctx.fillText(TERMS[i], left + (i + 0.5) * bw, y + h / 2)
        }
        ctx.font = `12px ${sans}`
        ctx.textAlign = 'right'
      }
    }
  }

  // ── numbers
  function renderStats() {
    if (!result) return
    const { n, leaves, byOrder, mismatches, ms } = result
    const tile = (label, value, note, key) =>
      el('div', { class: `tile ${key ? 'tile--key' : ''}` }, el('span', { class: 'tile__label', html: label }), el('span', { class: 'tile__value', html: value }), note ? el('span', { class: 'tile__note', html: note }) : null)
    const share = n ? 1 - leaves / (n * 100) : 0
    tilesBox.replaceChildren(
      tile('wanted entries', fmt(n), `of ${fmt(N * N)} in <var>XY</var>`),
      tile('leaves the pruned run visits', fmt(leaves), `${((100 * leaves) / LEAVES).toFixed(1)}% of all 10<sup>6</sup>`, true),
      tile('if no leaf were shared', fmt(n * 100), n ? `sharing saves ${(100 * share).toFixed(0)}%` : '100 per entry'),
      tile('direct inner products', fmt(n * D), `${D} multiplications per entry`),
    )
    readout.innerHTML =
      n === 0
        ? 'No entries wanted, so the pruned recursion makes no calls at all. Drag across the product to add some.'
        : (mismatches === 0
            ? `<span class="ok">✓ All ${fmt(n)} answers match</span> a direct count of common neighbours.`
            : `<span class="no">✗ ${fmt(mismatches)} answers disagree with a direct count.</span>`) +
          ` The pruned recursion took ${ms < 10 ? ms.toFixed(1) : Math.round(ms)} ms, after a one-time encoding of ${loaded ? Math.round(loaded) : '…'} ms.` +
          (pattern === 'block' ? ' One block lives in one product, and leaves are shared only across products, so here every entry pays for all 100 of its leaves.' : '')
    drawOrders(byOrder, n)
  }

  // by order: what was visited, against the two caps of Lemma 11
  const ordersTip = tooltip(ordersBox)
  ordersBox.style.position = 'relative'
  let lastOrders = null
  function drawOrders(byOrder, n) {
    lastOrders = [byOrder, n]
    const W = Math.max(300, ordersBox.clientWidth)
    const H = 236
    const m = { l: W < 520 ? 96 : 128, r: 18, t: 30, b: 34 }
    const lo = 1
    const hi = 2e6
    const x = linear([Math.log10(lo), Math.log10(hi)], [m.l, W - m.r])
    const root = frame(ordersBox, W, H)
    root.setAttribute('aria-label', `Leaves visited by order: ${byOrder.map((v, d) => `order ${d}: ${v}`).join(', ')}`)
    const g = svg('g')
    root.append(g)
    for (let e = 0; e <= 6; e++) {
      if (W < 520 && e % 2) continue
      const px = x(e)
      g.append(
        svg('line', { x1: px, x2: px, y1: m.t - 4, y2: H - m.b, stroke: 'var(--rule)', 'stroke-width': 1 }),
        svg('text', { x: px, y: H - m.b + 18, 'text-anchor': 'middle', 'font-size': 12, fill: 'var(--ink-3)', 'font-family': 'var(--sans)', text: e === 0 ? '1' : e <= 3 ? fmt(10 ** e) : '' }),
      )
      if (e > 3) {
        const t = svg('text', { x: px, y: H - m.b + 18, 'text-anchor': 'middle', 'font-size': 12, fill: 'var(--ink-3)', 'font-family': 'var(--sans)' }, svg('tspan', { text: '10' }), svg('tspan', { dy: -5, 'font-size': 9, text: e }))
        g.append(t)
      }
    }
    g.append(
      svg('text', { class: 'label', x: m.l, y: 14, text: W < 520 ? 'leaves of each order (log scale)' : 'leaves of each order, on a scale of powers of ten' }),
    )
    const band = (H - m.t - m.b) / 3
    const ramp = ['var(--order-0)', 'var(--order-1)', 'var(--order-2)']
    for (let d = 0; d < 3; d++) {
      const cy = m.t + band * d + band / 2
      const h = 18
      const v = byOrder[d]
      g.append(
        svg('text', { class: 'label--strong', x: m.l - 12, y: cy - 2, 'text-anchor': 'end', text: `order ${d}` }),
        svg('text', { class: 'label', x: m.l - 12, y: cy + 13, 'text-anchor': 'end', 'font-size': 11.5, text: d === 0 ? 'private' : `feeds ${choose(L - M + d, d)} each` }),
      )
      if (v > 0) {
        const x1 = x(Math.log10(v))
        const rr = Math.min(4, (x1 - m.l) / 2)
        g.append(svg('path', { d: `M${m.l},${cy - h / 2} H${x1 - rr} Q${x1},${cy - h / 2} ${x1},${cy - h / 2 + rr} V${cy + h / 2 - rr} Q${x1},${cy + h / 2} ${x1 - rr},${cy + h / 2} H${m.l} Z`, fill: ramp[d] }))
      }
      // the two caps
      const capA = n * ALPHA[d]
      const capB = BETA[d]
      // |W|·α_d labelled above the bar, β_d below, so close caps never collide
      const tick = (val, label, above, dash) => {
        if (val < lo) return
        const px = x(Math.log10(val))
        g.append(
          svg('line', { x1: px, x2: px, y1: cy - h / 2 - 4, y2: cy + h / 2 + 4, stroke: 'var(--ink)', 'stroke-width': 1.5, 'stroke-dasharray': dash ? '3 2' : null }),
          svg('text', { x: px, y: above ? cy - h / 2 - 7 : cy + h / 2 + 14, 'text-anchor': 'middle', 'font-size': 11, fill: 'var(--ink-2)', 'font-family': 'var(--sans)' }, svg('tspan', { text: label[0], 'font-style': 'italic', 'font-family': 'var(--mathit)', 'font-size': 12.5 }), svg('tspan', { dy: 3, 'font-size': 9, text: label[1] })),
        )
      }
      tick(capB, ['β', String(d)], false, false)
      if (n > 0) tick(capA, ['|W|α', String(d)], true, true)
      const hit = svg('rect', { x: 0, y: cy - band / 2, width: W, height: band, fill: 'transparent' })
      hit.addEventListener('pointermove', () => {
        const pt = root.getBoundingClientRect()
        const s = pt.width / W
        ordersTip.show(x(Math.log10(Math.max(v, 1))) * s, (cy - h / 2) * s, [
          el('div', {}, el('b', {}, fmt(v)), ` leaves of order ${d} visited`),
          el('div', {}, `no sharing: ${fmt(capA)}`),
          el('div', {}, `all of order ${d}: ${fmt(capB)}`),
        ])
      })
      hit.addEventListener('pointerleave', () => ordersTip.hide())
      g.append(hit)
    }
  }

  // ── running
  async function load() {
    panel.classList.add('busy')
    const out = await call({ type: 'load', X: graph.X, Y: graph.Y })
    loaded = out.ms
  }
  async function runNow() {
    const ticket = ++pending
    const entries = []
    for (let i = 0; i < wanted.length; i++) if (wanted[i]) entries.push(i)
    panel.classList.add('busy')
    if (loaded == null) await load()
    const out = await call({ type: 'run', entries: Int32Array.from(entries) })
    if (ticket !== pending) return
    panel.classList.remove('busy')
    if (out.type === 'error') {
      readout.textContent = `The run failed: ${out.message}`
      return
    }
    result = out
    renderStats()
    drawIcicle()
  }

  goBtn.addEventListener('click', async () => {
    seed++
    graph = makeGraph(seed)
    loaded = null
    drawXY()
    await load()
    runNow()
  })

  // ── painting wanted entries, and reading entries on hover
  let painting = false
  const at = (ev) => {
    const rect = xyCv.getBoundingClientRect()
    const J = Math.floor(((ev.clientX - rect.left) / rect.width) * N)
    const I = Math.floor(((ev.clientY - rect.top) / rect.height) * N)
    return I >= 0 && I < N && J >= 0 && J < N ? [I, J] : null
  }
  const paint = (ev) => {
    const p = at(ev)
    if (!p) return
    const [I, J] = p
    for (let di = -3; di <= 3; di++)
      for (let dj = -3; dj <= 3; dj++) {
        const a = I + di
        const b = J + dj
        if (a >= 0 && a < N && b >= 0 && b < N) wanted[a * N + b] = 1
      }
    if (pattern !== 'clear') {
      pattern = 'clear'
      patBtns.forEach(([k, b]) => b.setAttribute('aria-checked', 'false'))
    }
    drawXY()
  }
  xyCv.addEventListener('pointerdown', (ev) => {
    painting = true
    xyCv.setPointerCapture(ev.pointerId)
    paint(ev)
  })
  xyCv.addEventListener('pointermove', (ev) => {
    if (painting) paint(ev)
    const p = at(ev)
    if (!p) return
    const [I, J] = p
    const blockQ = ['{1,2}', '{1,3}', '{1,4}', '{1,5}', '{1,6}', '{2,3}', '{2,4}', '{2,5}', '{2,6}'][Math.floor(I / N0) * 3 + Math.floor(J / N0)]
    const k = graph.XY[I * N + J]
    xyCap.innerHTML =
      `<var>a</var><sub>${I + 1}</sub>, <var>b</var><sub>${J + 1}</sub>: ${k} common neighbour${k === 1 ? '' : 's'}` +
      ` · block (${Math.floor(I / N0) + 1}, ${Math.floor(J / N0) + 1}), computed under <var>Q</var> = ${blockQ}` +
      (wanted[I * N + J] ? ' · <b style="color:var(--wanted-ink)">wanted</b>' : '')
  })
  const stop = () => {
    if (!painting) return
    painting = false
    runNow()
  }
  xyCv.addEventListener('pointerup', stop)
  xyCv.addEventListener('pointercancel', stop)
  xyCv.addEventListener('pointerleave', () => {
    xyCap.innerHTML = 'The product <var>XY</var>, 243×243, in nine blocks. Drag to add wanted entries.'
  })

  onResize(panel, () => {
    drawXY()
    drawIcicle()
    if (lastOrders) drawOrders(...lastOrders)
  })
  onTheme(() => {
    drawXY()
    drawIcicle()
  })

  setPattern('p25')
  drawIcicle()
  // start once the page has painted, so the first frame never waits on it
  requestAnimationFrame(() => setTimeout(runNow, 50))
}

function rgb(css) {
  const c = css.trim()
  if (c.startsWith('#')) {
    const h = c.length === 4 ? c.slice(1).split('').map((x) => x + x).join('') : c.slice(1, 7)
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
  }
  const m = c.match(/\d+(\.\d+)?/g)
  return m ? m.slice(0, 3).map(Number) : [128, 128, 128]
}
function mix(a, b, t) {
  return [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * t))
}
