// Panels 6-7: the analytic half — counting points modulo p, and the running
// product that Birch and Swinnerton-Dyer watched on EDSAC II.

import { Plot, mixHex } from './viz.js'
import { curve, primesUpTo, countPointsModP } from './curve.js'
import { byRank } from './leaderboard.js'

const $ = (sel, root = document) => root.querySelector(sel)
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)]

function live(canvas, draw) {
  let raf = 0
  const go = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw) }
  new ResizeObserver(go).observe(canvas)
  go()
  return go
}

// A rank-0 curve to anchor the bottom of the slider: conductor 11, the
// smallest conductor of any elliptic curve over Q, with E(Q) = Z/5.
const RANK0 = {
  r: 0,
  ainvs: ['0', '-1', '1', '-10', '-20'],
  label: 'y² + y = x³ − x² − 10x − 20',
  cond: '11',
  submitter: '',
  commentary: 'Conductor 11 — the smallest conductor there is. Rank 0: only five rational points exist, and they are all torsion.',
}

const rowFor = (r) => (r === 0 ? RANK0 : byRank(r))

/** Pretty Weierstrass equation from a-invariants, with big numbers shortened. */
export function eqString(ainvs, { short = true } = {}) {
  const [a1, a2, a3, a4, a6] = ainvs.map(String)
  const shorten = (s) => {
    if (!short) return s
    const neg = s.startsWith('-')
    const b = neg ? s.slice(1) : s
    return b.length > 22 ? `${neg ? '−' : ''}${b.slice(0, 10)}…${b.slice(-6)} (${b.length} digits)` : (neg ? '−' : '') + b
  }
  const term = (c, t) => {
    if (c === '0') return ''
    const neg = c.startsWith('-')
    const mag = neg ? c.slice(1) : c
    const coef = mag === '1' && t ? '' : shorten(mag)
    return ` ${neg ? '−' : '+'} ${coef}${t}`
  }
  const lhs = `y²${term(a1, 'xy')}${term(a3, 'y')}`.replace('y² + ', 'y² + ').replace(/^y² \+ /, 'y² + ')
  const rhs = `x³${term(a2, 'x²')}${term(a4, 'x')}${term(a6, '')}`
  return `${lhs} = ${rhs}`
}

// ═════════════════════════════════════════════ 6. a_p across the primes

export function initModP() {
  const cv = $('#cv-modp')
  if (!cv) return
  const plot = new Plot(cv, { pad: { l: 40, r: 16, t: 18, b: 28 } })
  const ro = $('#ro-modp')
  const slR = $('#sl-rank')
  const slP = $('#sl-plimit')

  let rank = 0
  let limit = 1500
  let data = null
  const cache = new Map()

  function compute() {
    const key = `${rank}:${limit}`
    if (cache.has(key)) { data = cache.get(key); return }
    const row = rowFor(rank)
    const E = curve(row.ainvs)
    const pts = []
    let sum = 0
    for (const p of primesUpTo(limit)) {
      const n = countPointsModP(E, p)
      if (n === null) continue
      const ap = p + 1 - n
      pts.push([p, ap / (2 * Math.sqrt(p))])
      sum += ap / (2 * Math.sqrt(p))
    }
    data = { row, pts, mean: pts.length ? sum / pts.length : 0 }
    cache.set(key, data)
  }

  function draw() {
    plot.resize().setView(0, limit, -1.12, 1.12)
    plot.clear()
    plot.grid({ xCount: 6, yCount: 4 })
    plot.clip()
    // The Hasse band is exactly [-1, 1] in these units.
    plot.segment(0, 1, limit, 1, { color: 'rgba(255,123,168,0.5)', width: 1.2, dash: [5, 4] })
    plot.segment(0, -1, limit, -1, { color: 'rgba(255,123,168,0.5)', width: 1.2, dash: [5, 4] })
    plot.segment(0, 0, limit, 0, { color: 'rgba(140,155,210,0.4)', width: 1 })

    const col = mixHex('#5ee7ff', '#ff7ba8', Math.min(1, rank / 31))
    for (const [p, v] of data.pts) plot.dot(p, v, { r: 1.9, fill: col, width: 0, alpha: 0.72 })
    plot.segment(0, data.mean, limit, data.mean, { color: '#ffc766', width: 1.8 })
    plot.unclip()
    plot.axes({ xCount: 6, yCount: 4, xLabel: 'p', yLabel: 'aₚ / 2√p' })
    plot.text(limit * 0.985, 1.0, 'Hasse bound  +2√p', {
      color: 'rgba(255,123,168,0.9)', align: 'right', dy: -8, font: '10px ui-monospace, monospace',
    })
    plot.text(limit * 0.985, -1.0, '−2√p', {
      color: 'rgba(255,123,168,0.9)', align: 'right', dy: 12, font: '10px ui-monospace, monospace',
    })
    plot.text(limit * 0.02, data.mean, `mean ${data.mean.toFixed(3)}`, {
      color: '#ffc766', dy: data.mean > 0 ? 12 : -10, font: '10px ui-monospace, monospace',
    })

    const row = data.row
    const eq = row.label || eqString(row.ainvs)
    const condDigits = row.cond ? String(row.cond).length : null
    ro.innerHTML =
      `<div><span class="k">rank</span> <b class="hot">${rank}</b>` +
      `<span class="k"> · smallest known curve of this rank</span></div>` +
      `<div class="frac" style="margin-top:4px"><b>${eq}</b></div>` +
      `<div style="margin-top:6px">` +
      `<span class="k">good primes counted</span> <b>${data.pts.length}</b>` +
      `<span class="k"> · mean of aₚ/2√p</span> <b class="${data.mean < -0.1 ? 'bad' : 'cy'}">${data.mean.toFixed(4)}</b>` +
      (condDigits ? `<span class="k"> · conductor</span> <b>${condDigits <= 12 ? row.cond : `${condDigits} digits`}</b>` : '') +
      `</div>` +
      (row.commentary ? `<div style="margin-top:6px" class="k">${escapeHtml(row.commentary).slice(0, 240)}</div>` : '')
  }

  const refresh = () => { compute(); draw() }

  slR.addEventListener('input', () => {
    rank = +slR.value
    $('#out-rank').textContent = String(rank)
    refresh()
  })
  slP.addEventListener('input', () => {
    limit = +slP.value
    $('#out-plimit').textContent = String(limit)
    refresh()
  })

  compute()
  live(cv, draw)
}

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

// ═════════════════════════════════════════════ 7. the EDSAC product

const BSD_PICKS = [0, 1, 2, 3, 5, 8, 31]

// Distinguishable per-rank colours; the sequential ramp put ranks 0 to 3 in
// four indistinguishable shades of cyan.
const SERIES_COLORS = ['#5ee7ff', '#b7e88a', '#ffc766', '#ff7ba8', '#a78bfa', '#7ee0c0', '#ff9f6e', '#c3a1ff']

export function initBSD() {
  const cv = $('#cv-bsd')
  if (!cv) return
  const plot = new Plot(cv, { pad: { l: 46, r: 16, t: 18, b: 28 } })
  const ro = $('#ro-bsd')
  const picks = $('#bsd-picks')
  const LIMIT = 30000

  const chosen = new Set([0, 1, 2, 3])
  const runs = new Map() // rank -> { E, primes, i, logProd, series: [[loglogX, logProd]] }
  let primes = null
  let raf = 0
  let running = false

  function reset() {
    cancelAnimationFrame(raf)
    running = false
    primes = primes || primesUpTo(LIMIT)
    runs.clear()
    for (const r of chosen) {
      const row = rowFor(r)
      runs.set(r, { row, E: curve(row.ainvs), i: 0, logProd: 0, series: [], done: false })
    }
    draw()
  }

  /** Advance every selected curve by a chunk of primes. */
  function stepChunk(budget) {
    let did = 0
    for (const [, st] of runs) {
      if (st.done) continue
      const chunk = Math.min(budget, primes.length - st.i)
      const end = st.i + chunk
      for (; st.i < end; st.i++) {
        const p = primes[st.i]
        const n = countPointsModP(st.E, p)
        // Bad primes contribute no Euler factor to the product.
        if (n !== null) st.logProd += Math.log(n / p)
        // Dense at the start — log log X moves fast down there — then coarse.
        if (p > 10 && (st.i < 220 || (st.i & 63) === 0)) {
          st.series.push([Math.log(Math.log(p)), st.logProd])
        }
      }
      if (st.i >= primes.length) {
        st.done = true
        st.series.push([Math.log(Math.log(primes[primes.length - 1])), st.logProd])
      }
      did++
    }
    return did > 0 && [...runs.values()].some((s) => !s.done)
  }

  function slope(series) {
    // Least-squares slope over the upper half of the range, where the
    // asymptotic (log X)^r behaviour has had a chance to show up.
    const pts = series.filter((s) => s[0] > (series.length ? series[series.length - 1][0] * 0.72 : 0))
    if (pts.length < 4) return null
    let sx = 0, sy = 0, sxx = 0, sxy = 0
    for (const [x, y] of pts) { sx += x; sy += y; sxx += x * x; sxy += x * y }
    const n = pts.length
    const d = n * sxx - sx * sx
    return Math.abs(d) < 1e-12 ? null : (n * sxy - sx * sy) / d
  }

  function draw() {
    const all = [...runs.values()]
    const xs = all.flatMap((s) => s.series.map((p) => p[0]))
    const ys = all.flatMap((s) => s.series.map((p) => p[1]))
    const x0 = Math.log(Math.log(11))
    const x1 = Math.log(Math.log(LIMIT))
    const y1 = Math.max(1, ...ys) * 1.12
    const y0 = Math.min(-0.4, ...ys) * 1.12
    void xs
    plot.resize().setView(x0, x1, y0, y1)
    plot.clear()
    plot.grid({ xCount: 5, yCount: 5 })
    plot.clip()
    for (const st of all) {
      const r = st.row.r
      const col = SERIES_COLORS[r % SERIES_COLORS.length]
      plot.path(st.series, { color: col, width: 2 })
      const last = st.series[st.series.length - 1]
      if (last) {
        plot.dot(last[0], last[1], { r: 3.5, fill: col, width: 0 })
        plot.text(last[0], last[1], ` r=${r}`, { color: col, dx: -34, dy: -9, font: '10px ui-monospace, monospace' })
      }
    }
    plot.unclip()
    plot.axes({
      xCount: 5, yCount: 5,
      xLabel: 'log log X',
      yLabel: 'log ∏ Nₚ/p',
      fmt: (v) => String(+v.toFixed(2)),
    })

    const rows = all
      .sort((a, b) => a.row.r - b.row.r)
      .map((st) => {
        const s = slope(st.series)
        const col = SERIES_COLORS[st.row.r % SERIES_COLORS.length]
        const pct = ((st.i / primes.length) * 100).toFixed(0)
        return `<span><span class="k">rank</span> <b style="color:${col}">${st.row.r}</b>` +
          `<span class="k"> → measured slope</span> <b class="${s !== null && Math.abs(s - st.row.r) < 1.2 ? 'good' : 'cy'}">${s === null ? '…' : s.toFixed(2)}</b>` +
          `<span class="k"> (${pct}%)</span></span>`
      })
      .join('')
    ro.innerHTML =
      `<div class="k" style="margin-bottom:6px">the product ∏ Nₚ/p should grow like (log X)^r, so on these axes the slope is the rank</div>` +
      `<div style="display:flex;flex-wrap:wrap;gap:6px 20px">${rows}</div>`
  }

  function loop() {
    const more = stepChunk(320)
    draw()
    if (more && running) raf = requestAnimationFrame(loop)
    else stop()
  }

  function start() {
    if (running) return
    running = true
    $('#bsd-run').textContent = 'pause ▮▮'
    loop()
  }

  function stop() {
    cancelAnimationFrame(raf)
    running = false
    $('#bsd-run').textContent = 'run to 30 000 ▸'
  }

  BSD_PICKS.forEach((r) => {
    const b = document.createElement('button')
    b.textContent = `rank ${r}`
    if (chosen.has(r)) b.classList.add('on')
    b.addEventListener('click', () => {
      if (chosen.has(r)) {
        if (chosen.size === 1) return
        chosen.delete(r)
        b.classList.remove('on')
      } else {
        chosen.add(r)
        b.classList.add('on')
      }
      // Changing the selection restarts the sweep; leaving it paused here
      // silently stranded the newly picked curve at zero primes.
      reset()
      start()
    })
    picks.appendChild(b)
  })

  $('#bsd-run').addEventListener('click', () => (running ? stop() : start()))
  $('#bsd-reset').addEventListener('click', () => { reset(); stop() })

  reset()
  live(cv, draw)
  // Start immediately: an empty pair of axes says nothing, and the first few
  // thousand primes arrive fast enough to look like the machine is thinking.
  start()
}

export { rowFor, RANK0 }
