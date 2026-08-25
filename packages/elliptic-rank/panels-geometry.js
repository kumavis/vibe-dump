// Panels 1-5: the geometric half of the tour — the shape of a cubic, the
// chord-and-tangent group law, runaway rational points, torsion cycles, and
// the Mordell-Weil lattice.

import { Plot, curveBranches, scanComponents, heat, mixHex } from './viz.js'
import {
  curve, q, Q, add, onCurve, fmtQ, torsionOrder, combine, naiveHeight, xDigits,
} from './curve.js'

const $ = (sel, root = document) => root.querySelector(sel)
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)]

/** Re-render on resize, and once on first layout. */
function live(canvas, draw) {
  let raf = 0
  const go = () => {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(draw)
  }
  new ResizeObserver(go).observe(canvas)
  go()
  return go
}

const fmtNum = (v, d = 2) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(d)

// ═════════════════════════════════════════════ 1. the shape of a cubic

export function initShape() {
  const cv = $('#cv-shape')
  const map = $('#cv-shape-map')
  if (!cv || !map) return
  const plot = new Plot(cv, { square: true, pad: { l: 34, r: 14, t: 14, b: 24 } })
  const mplot = new Plot(map, { pad: { l: 30, r: 12, t: 12, b: 22 } })
  const slA = $('#sl-a')
  const slB = $('#sl-b')
  const ro = $('#ro-shape')

  let A = -3
  let B = 1

  const disc = (a, b) => -16 * (4 * a * a * a + 27 * b * b)

  function drawCurve() {
    plot.resize().setView(-4.2, 4.6, -6, 6)
    plot.clear()
    plot.grid()
    plot.axes({ xCount: 5, yCount: 5 })
    const d = disc(A, B)
    // Sampled directly rather than through curveBranches, because the sliders
    // hand us fractional A and B that never become integer a-invariants.
    const f = (x) => x * x * x + A * x + B
    const segs = scanComponents(-4.2, 4.6, 1400, (x) => {
      const v = f(x)
      if (v < 0) return null
      const w = Math.sqrt(v)
      return [w, -w]
    })
    const singular = Math.abs(d) < 1e-9
    const col = singular ? '#ff7ba8' : '#5ee7ff'
    plot.clip()
    for (const s of segs) plot.path(s, { color: col, width: 2.2 })
    // Mark the real roots of x^3 + Ax + B.
    for (const r of realCubicRoots(A, B)) plot.dot(r, 0, { r: 3, fill: col, width: 1.5 })
    plot.unclip()
    if (singular) {
      plot.text(-4.0, 5.3, 'Δ = 0 — singular, not an elliptic curve', {
        color: '#ff7ba8', font: '11px ui-monospace, monospace',
      })
    }
    const pieces = realCubicRoots(A, B).length === 3 ? 2 : 1
    ro.innerHTML = [
      `<span><span class="k">Δ =</span> <b class="${singular ? 'bad' : 'good'}">${fmtNum(d, 3)}</b></span>`,
      `<span><span class="k">4A³+27B² =</span> <b>${fmtNum(4 * A ** 3 + 27 * B * B, 3)}</b></span>`,
      `<span><span class="k">real components:</span> <b>${singular ? '—' : pieces}</b></span>`,
      `<span><span class="k">status:</span> <b class="${singular ? 'bad' : 'good'}">${singular ? 'degenerate' : 'smooth'}</b></span>`,
    ].join('')
  }

  function drawMap() {
    mplot.resize().setView(-6, 6, -6, 6)
    mplot.clear()
    const b = mplot.box
    const ctx = mplot.ctx
    // Shade the region 4A^3 + 27B^2 < 0 (two real components).
    ctx.save()
    ctx.beginPath()
    ctx.rect(b.x, b.y, b.w, b.h)
    ctx.clip()
    const img = ctx.createImageData(Math.ceil(b.w), Math.ceil(b.h))
    for (let py = 0; py < img.height; py++) {
      for (let px = 0; px < img.width; px++) {
        const a = mplot.wx(b.x + px)
        const bb = mplot.wy(b.y + py)
        const v = 4 * a * a * a + 27 * bb * bb
        const i = (py * img.width + px) * 4
        const t = Math.max(0, Math.min(1, Math.abs(v) / 400))
        if (v < 0) {
          img.data[i] = 24; img.data[i + 1] = 52; img.data[i + 2] = 78
          img.data[i + 3] = 90 + 90 * (1 - t)
        } else {
          img.data[i] = 16; img.data[i + 1] = 18; img.data[i + 2] = 36
          img.data[i + 3] = 40 + 50 * (1 - t)
        }
      }
    }
    ctx.putImageData(img, Math.round(b.x), Math.round(b.y))
    ctx.restore()
    mplot.axes({ xCount: 4, yCount: 4, xLabel: 'A', yLabel: 'B' })
    // The cusp curve 4A^3 + 27B^2 = 0.
    const up = []
    const dn = []
    for (let i = 0; i <= 240; i++) {
      const a = -6 + (i / 240) * 6
      const s = Math.sqrt(Math.max(0, (-4 * a * a * a) / 27))
      up.push([a, s])
      dn.push([a, -s])
    }
    mplot.path(up, { color: '#ff7ba8', width: 1.6 })
    mplot.path(dn, { color: '#ff7ba8', width: 1.6 })
    mplot.dot(A, B, { r: 5, fill: '#ffc766', stroke: '#06070f', width: 2 })
  }

  const redraw = () => { drawCurve(); drawMap() }

  const sync = () => {
    slA.value = String(A)
    slB.value = String(B)
    $('#out-a').textContent = fmtNum(A)
    $('#out-b').textContent = fmtNum(B)
    redraw()
  }

  slA.addEventListener('input', () => { A = +slA.value; sync() })
  slB.addEventListener('input', () => { B = +slB.value; sync() })
  $$('#panel-shape .presets button').forEach((btn) =>
    btn.addEventListener('click', () => {
      const [a, b2] = btn.dataset.ab.split(',').map(Number)
      A = a
      B = b2
      sync()
    }),
  )

  // Drag the marker around the (A, B) plane.
  let dragging = false
  const pick = (ev) => {
    const r = map.getBoundingClientRect()
    A = Math.max(-6, Math.min(6, mplot.wx(ev.clientX - r.left)))
    B = Math.max(-6, Math.min(6, mplot.wy(ev.clientY - r.top)))
    A = Math.round(A * 50) / 50
    B = Math.round(B * 50) / 50
    sync()
  }
  map.addEventListener('pointerdown', (e) => { dragging = true; map.setPointerCapture(e.pointerId); pick(e) })
  map.addEventListener('pointermove', (e) => dragging && pick(e))
  map.addEventListener('pointerup', () => { dragging = false })
  map.addEventListener('pointercancel', () => { dragging = false })

  live(cv, redraw)
  live(map, drawMap)
  sync()
}

/** Real roots of x^3 + Ax + B (float). */
function realCubicRoots(A, B) {
  const disc = -(4 * A * A * A + 27 * B * B)
  const out = []
  if (disc > 0) {
    const m = 2 * Math.sqrt(-A / 3)
    const th = Math.acos((3 * B) / (A * m)) / 3
    for (let k = 0; k < 3; k++) out.push(m * Math.cos(th - (2 * Math.PI * k) / 3))
  } else {
    const s = Math.sqrt((B * B) / 4 + (A * A * A) / 27)
    out.push(Math.cbrt(-B / 2 + s) + Math.cbrt(-B / 2 - s))
  }
  return out.filter((v) => Number.isFinite(v))
}

// ═════════════════════════════════════════════ 2. the group law

export function initGroup() {
  const cv = $('#cv-group')
  if (!cv) return
  const plot = new Plot(cv, { pad: { l: 36, r: 16, t: 16, b: 26 } })
  const ro = $('#ro-group')
  const A = -4
  const B = 1
  const VIEW = { x0: -3.2, x1: 5.2, y0: -9, y1: 9 }

  const f = (x) => x * x * x + A * x + B
  const yOf = (x, sign) => sign * Math.sqrt(Math.max(0, f(x)))

  // Sample the real locus once; used both for drawing and for snapping drags.
  const samples = []
  for (let i = 0; i <= 2000; i++) {
    const x = VIEW.x0 + (i / 2000) * (VIEW.x1 - VIEW.x0)
    if (f(x) < 0) continue
    samples.push([x, yOf(x, 1)], [x, yOf(x, -1)])
  }

  let mode = 'add'
  let P = snapX(3, 1)
  let Qp = snapX(0, 1)

  function snapX(x, sign) {
    // Nearest sample with the requested branch sign, so points stay on-curve.
    let best = null
    let bd = Infinity
    for (const s of samples) {
      if (sign > 0 ? s[1] < 0 : s[1] > 0) continue
      const d = Math.abs(s[0] - x)
      if (d < bd) { bd = d; best = s }
    }
    return best ? { x: best[0], y: best[1] } : { x, y: yOf(x, sign) }
  }

  function nearestOnCurve(wx, wy) {
    let best = samples[0]
    let bd = Infinity
    const sx = plot.box.w / (VIEW.x1 - VIEW.x0)
    const sy = plot.box.h / (VIEW.y1 - VIEW.y0)
    for (const s of samples) {
      const dx = (s[0] - wx) * sx
      const dy = (s[1] - wy) * sy
      const d = dx * dx + dy * dy
      if (d < bd) { bd = d; best = s }
    }
    return { x: best[0], y: best[1] }
  }

  /** Float group law on y^2 = x^3 + Ax + B. Returns null for the point at infinity. */
  function groupAdd(p, r) {
    if (!p) return r
    if (!r) return p
    if (Math.abs(p.x - r.x) < 1e-12) {
      if (Math.abs(p.y + r.y) < 1e-9) return null
      const lam = (3 * p.x * p.x + A) / (2 * p.y)
      const x3 = lam * lam - 2 * p.x
      return { x: x3, y: lam * (p.x - x3) - p.y, lam }
    }
    const lam = (r.y - p.y) / (r.x - p.x)
    const x3 = lam * lam - p.x - r.x
    return { x: x3, y: lam * (p.x - x3) - p.y, lam }
  }

  function draw() {
    plot.resize().setView(VIEW.x0, VIEW.x1, VIEW.y0, VIEW.y1)
    plot.clear()
    plot.grid()
    plot.axes({ xCount: 6, yCount: 5 })
    plot.clip()

    // the curve
    const segs = scanComponents(VIEW.x0, VIEW.x1, 1600, (x) => {
      const v = f(x)
      if (v < 0) return null
      const w = Math.sqrt(v)
      return [w, -w]
    })
    for (const s of segs) plot.path(s, { color: '#5ee7ff', width: 2.2 })

    const Qeff = mode === 'double' ? P : mode === 'inverse' ? { x: P.x, y: -P.y } : Qp
    const S = groupAdd(P, Qeff)

    if (mode === 'inverse') {
      // A vertical line: the third intersection is the point at infinity.
      plot.segment(P.x, VIEW.y0, P.x, VIEW.y1, { color: '#ffc766', width: 1.4, dash: [5, 4] })
      plot.text(P.x, VIEW.y1 - 0.7, '  ↑ meets the curve at O', { color: '#ffc766' })
    } else if (S) {
      // Chord (or tangent), drawn right across the frame.
      const lam = S.lam
      const x0 = VIEW.x0
      const x1 = VIEW.x1
      const y0 = P.y + lam * (x0 - P.x)
      const y1 = P.y + lam * (x1 - P.x)
      plot.segment(x0, y0, x1, y1, { color: 'rgba(255,199,102,0.85)', width: 1.4, dash: [5, 4] })
      // R = the third intersection = -(P+Q)
      plot.dot(S.x, -S.y, { r: 4.5, fill: 'rgba(6,7,15,0.9)', stroke: '#ffc766', width: 1.8 })
      plot.text(S.x, -S.y, ' R', { color: '#ffc766', dy: S.y > 0 ? 12 : -10 })
      plot.segment(S.x, -S.y, S.x, S.y, { color: 'rgba(183,232,138,0.6)', width: 1.2, dash: [3, 3] })
      plot.dot(S.x, S.y, { r: 5.5, fill: '#b7e88a', stroke: '#06070f', width: 2 })
      plot.text(S.x, S.y, mode === 'double' ? ' 2P' : ' P+Q', { color: '#b7e88a', dy: S.y > 0 ? -11 : 13 })
    }

    plot.dot(P.x, P.y, { r: 6, fill: '#ff7ba8', stroke: '#06070f', width: 2 })
    plot.text(P.x, P.y, ' P', { color: '#ff7ba8', dy: -12, font: '12px ui-monospace, monospace' })
    if (mode === 'add') {
      plot.dot(Qp.x, Qp.y, { r: 6, fill: '#a78bfa', stroke: '#06070f', width: 2 })
      plot.text(Qp.x, Qp.y, ' Q', { color: '#a78bfa', dy: -12, font: '12px ui-monospace, monospace' })
    } else if (mode === 'inverse') {
      plot.dot(P.x, -P.y, { r: 6, fill: '#a78bfa', stroke: '#06070f', width: 2 })
      plot.text(P.x, -P.y, ' −P', { color: '#a78bfa', dy: 12, font: '12px ui-monospace, monospace' })
    }
    plot.unclip()

    const pt = (p) => (p ? `(${fmtNum(p.x, 3)}, ${fmtNum(p.y, 3)})` : 'O')
    ro.innerHTML = [
      `<span><span class="k">curve</span> <b>y² = x³ − 4x + 1</b></span>`,
      `<span><span class="k">P =</span> <b class="bad">${pt(P)}</b></span>`,
      mode === 'add' ? `<span><span class="k">Q =</span> <b>${pt(Qp)}</b></span>` : '',
      mode === 'inverse'
        ? `<span><span class="k">P + (−P) =</span> <b class="hot">O</b> <span class="k">— the point at infinity</span></span>`
        : `<span><span class="k">${mode === 'double' ? '2P' : 'P + Q'} =</span> <b class="good">${pt(S)}</b></span>`,
    ].join('')
  }

  // dragging
  let grab = null
  const toWorld = (ev) => {
    const r = cv.getBoundingClientRect()
    return { x: plot.wx(ev.clientX - r.left), y: plot.wy(ev.clientY - r.top) }
  }
  cv.addEventListener('pointerdown', (ev) => {
    const w = toWorld(ev)
    const sx = plot.box.w / (VIEW.x1 - VIEW.x0)
    const sy = plot.box.h / (VIEW.y1 - VIEW.y0)
    const dist = (p) => Math.hypot((p.x - w.x) * sx, (p.y - w.y) * sy)
    const dP = dist(P)
    const dQ = mode === 'add' ? dist(Qp) : Infinity
    if (Math.min(dP, dQ) > 40) return
    grab = dP <= dQ ? 'P' : 'Q'
    cv.setPointerCapture(ev.pointerId)
    ev.preventDefault()
  })
  cv.addEventListener('pointermove', (ev) => {
    if (!grab) return
    const w = toWorld(ev)
    const p = nearestOnCurve(w.x, w.y)
    if (grab === 'P') P = p
    else Qp = p
    draw()
  })
  const release = () => { grab = null }
  cv.addEventListener('pointerup', release)
  cv.addEventListener('pointercancel', release)

  $$('#panel-group .presets button').forEach((btn) =>
    btn.addEventListener('click', () => {
      $$('#panel-group .presets button').forEach((b) => b.classList.remove('on'))
      btn.classList.add('on')
      mode = btn.dataset.op
      draw()
    }),
  )

  live(cv, draw)
}

// ═════════════════════════════════════════════ 3. runaway rational points

const E37 = curve([0, 0, 1, -1, 0])
const P37 = { x: q(0n), y: q(0n) }

export function initRational() {
  const cv = $('#cv-rational')
  const hv = $('#cv-height')
  if (!cv || !hv) return
  const plot = new Plot(cv, { pad: { l: 34, r: 14, t: 14, b: 24 } })
  const hplot = new Plot(hv, { pad: { l: 30, r: 12, t: 14, b: 24 } })
  const ro = $('#ro-rational')
  const sl = $('#sl-n')
  const MAX = 24

  // Precompute nP exactly, once.
  const pts = []
  let acc = null
  for (let n = 1; n <= MAX; n++) {
    acc = add(E37, acc, P37)
    pts.push({ n, P: acc, dig: xDigits(acc), h: naiveHeight(acc) })
  }

  let n = 1
  let timer = 0

  function draw() {
    plot.resize().setView(-1.9, 6.6, -12, 12)
    plot.clear()
    plot.grid()
    plot.axes({ xCount: 5, yCount: 5 })
    plot.clip()
    // curve y^2 + y = x^3 - x  →  (2y+1)^2 = 4x^3 - 4x + 1
    // y^2 + y = x^3 - x  rewritten as  (2y + 1)^2 = 4x^3 - 4x + 1
    const segs = scanComponents(-1.9, 6.6, 1600, (x) => {
      const v = 4 * x * x * x - 4 * x + 1
      if (v < 0) return null
      const w = Math.sqrt(v)
      return [(w - 1) / 2, (-w - 1) / 2]
    })
    for (const s of segs) plot.path(s, { color: 'rgba(94,231,255,0.75)', width: 2 })

    let visible = 0
    for (let i = 0; i < n; i++) {
      const p = pts[i]
      const x = Q.toNumber(p.P.x)
      const y = Q.toNumber(p.P.y)
      if (x < -1.9 || x > 6.6 || y < -12 || y > 12) continue
      visible++
      const t = i / Math.max(1, MAX - 1)
      plot.dot(x, y, {
        r: i === n - 1 ? 6 : 4,
        fill: mixHex('#ff7ba8', '#ffc766', t),
        stroke: '#06070f',
        width: 1.6,
        alpha: i === n - 1 ? 1 : 0.85,
      })
      if (i === n - 1 || i < 4) plot.text(x, y, ` ${p.n}P`, { color: '#e9edff', dy: -11, font: '10px ui-monospace, monospace' })
    }
    plot.unclip()
    plot.text(-1.8, 11.2, `${visible} of ${n} points fall inside this window`, {
      color: 'rgba(150,163,205,0.8)', font: '10px ui-monospace, monospace',
    })

    // height bars
    hplot.resize()
    const maxDig = Math.max(...pts.map((p) => p.dig))
    hplot.setView(0.4, MAX + 0.6, 0, maxDig * 1.08)
    hplot.clear()
    hplot.grid({ xCount: 6, yCount: 4 })
    hplot.axes({ xCount: 6, yCount: 4, xLabel: 'n', yLabel: 'digits in x(nP)' })
    hplot.clip()
    for (let i = 0; i < MAX; i++) {
      const p = pts[i]
      const on = i < n
      hplot.cell(p.n - 0.38, 0, 0.76, p.dig, on ? heat(p.dig / maxDig) : 'rgba(120,140,200,0.13)', on ? 0.95 : 1)
    }
    // the n^2 envelope through the last computed point
    const k = pts[MAX - 1].dig / (MAX * MAX)
    const env = []
    for (let i = 1; i <= MAX; i++) env.push([i, k * i * i])
    hplot.path(env, { color: '#ffc766', width: 1.5, dash: [4, 3] })
    hplot.unclip()

    const cur = pts[n - 1]
    ro.innerHTML =
      `<div><span class="k">${cur.n}P =</span> <b class="frac">(${fmtQ(cur.P.x)}, ${fmtQ(cur.P.y)})</b></div>` +
      `<div style="margin-top:6px"><span class="k">digits in x(nP)</span> <b class="hot">${cur.dig}</b>` +
      `<span class="k"> · naive height h =</span> <b>${cur.h.toFixed(3)}</b>` +
      `<span class="k"> · h/n² =</span> <b class="cy">${(cur.h / (cur.n * cur.n)).toFixed(4)}</b>` +
      `<span class="k"> · on curve:</span> <b class="good">${onCurve(E37, cur.P) ? 'verified' : 'FAIL'}</b></div>`
    sl.value = String(n)
    $('#out-n').textContent = String(n)
  }

  const set = (v) => { n = Math.max(1, Math.min(MAX, v)); draw() }
  $('#rat-step').addEventListener('click', () => set(n % MAX + 1))
  $('#rat-reset').addEventListener('click', () => { clearInterval(timer); timer = 0; set(1) })
  $('#rat-run').addEventListener('click', (e) => {
    if (timer) { clearInterval(timer); timer = 0; e.target.textContent = 'run ▸'; return }
    e.target.textContent = 'pause ▮▮'
    set(1)
    timer = setInterval(() => {
      if (n >= MAX) { clearInterval(timer); timer = 0; e.target.textContent = 'run ▸'; return }
      set(n + 1)
    }, 420)
  })
  sl.addEventListener('input', () => set(+sl.value))

  live(cv, draw)
  live(hv, draw)
}

// ═════════════════════════════════════════════ 4. torsion

// One curve for each of the fifteen groups Mazur proved possible. `gen`
// generates the cyclic factor and has exactly the stated order; for the
// ℤ/2 × ℤ/2m groups `gen2` is a point of order 2 outside that cycle, so the two
// together generate the whole subgroup. Every one was found, and its order
// checked, with the exact group law in curve.js.
export const TORSION = [
  { name: 'trivial', label: '0', ainvs: [0, 0, 1, -1, 0], gen: null, order: 1 },
  { name: 'Z/2', label: 'ℤ/2', ainvs: [0, 0, 0, 1, 0], gen: ['0', '0'], order: 2 },
  { name: 'Z/3', label: 'ℤ/3', ainvs: [0, 1, 1, -9, -15], gen: ['5', '9'], order: 3 },
  { name: 'Z/4', label: 'ℤ/4', ainvs: [0, 0, 0, 4, 0], gen: ['2', '4'], order: 4 },
  { name: 'Z/5', label: 'ℤ/5', ainvs: [0, -1, 1, 0, 0], gen: ['0', '0'], order: 5 },
  { name: 'Z/6', label: 'ℤ/6', ainvs: [0, 0, 0, 0, 1], gen: ['2', '3'], order: 6 },
  { name: 'Z/7', label: 'ℤ/7', ainvs: [1, -1, 1, -3, 3], gen: ['-1', '2'], order: 7 },
  { name: 'Z/8', label: 'ℤ/8', ainvs: [1, -9, -27, 0, 0], gen: ['0', '27'], order: 8 },
  { name: 'Z/9', label: 'ℤ/9', ainvs: [-3, -12, -12, 0, 0], gen: ['0', '12'], order: 9 },
  { name: 'Z/10', label: 'ℤ/10', ainvs: [1, 0, 0, -45, 81], gen: ['-6', '15'], order: 10 },
  { name: 'Z/12', label: 'ℤ/12', ainvs: [1, -1, 1, -122, 1721], gen: ['-9', '49'], order: 12 },
  { name: 'Z/2xZ/2', label: 'ℤ/2 × ℤ/2', ainvs: [0, 0, 0, -1, 0], gen: ['-1', '0'], gen2: ['0', '0'], order: 2 },
  { name: 'Z/2xZ/4', label: 'ℤ/2 × ℤ/4', ainvs: [1, 1, 1, -10, -10], gen: ['-2', '3'], gen2: ['-13/4', '9/8'], order: 4 },
  { name: 'Z/2xZ/6', label: 'ℤ/2 × ℤ/6', ainvs: [1, 0, 1, -19, 26], gen: ['-2', '8'], gen2: ['-5', '2'], order: 6 },
  { name: 'Z/2xZ/8', label: 'ℤ/2 × ℤ/8', ainvs: [1, 0, 0, -1070, 7812], gen: ['-26', '148'], gen2: ['31/4', '-31/8'], order: 8 },
]

export const parsePt = (p) => {
  if (!p) return null
  const rd = (s) => {
    const [a, b] = String(s).split('/')
    return q(BigInt(a), b ? BigInt(b) : 1n)
  }
  return { x: rd(p[0]), y: rd(p[1]) }
}

export function initTorsion() {
  const cv = $('#cv-torsion')
  const rv = $('#cv-torsion-ring')
  if (!cv || !rv) return
  const plot = new Plot(cv, { pad: { l: 34, r: 14, t: 14, b: 24 } })
  const ring = new Plot(rv, { square: true, pad: { l: 10, r: 10, t: 10, b: 10 } })
  const ro = $('#ro-torsion')
  const picks = $('#torsion-picks')

  let idx = 5 // Z/6, the friendliest first look
  let step = 1
  let timer = 0
  let state = null

  function build() {
    const spec = TORSION[idx]
    const E = curve(spec.ainvs)
    const g = parsePt(spec.gen)
    const cycle = []
    if (g) {
      let acc = g
      for (let i = 1; i <= spec.order; i++) {
        cycle.push(acc)
        acc = add(E, acc, g)
      }
    }
    const g2 = parsePt(spec.gen2)
    state = { spec, E, g, g2, cycle, order: torsionOrder(E, g), order2: g2 ? torsionOrder(E, g2) : 0 }
    step = 1
  }

  function draw() {
    const { spec, E, cycle, g2 } = state
    // Fit the view to the torsion points, with a margin.
    const marks = [...cycle.filter(Boolean), ...(g2 ? [g2] : [])]
    const xs = marks.map((p) => Q.toNumber(p.x))
    const ys = marks.map((p) => Q.toNumber(p.y))
    const pad = 1.6
    const x0 = Math.min(-2, ...xs) - pad
    const x1 = Math.max(2, ...xs) + pad
    const yr = Math.max(3, ...ys.map(Math.abs)) * 1.35
    plot.resize().setView(x0, x1, -yr, yr)
    plot.clear()
    plot.grid()
    plot.axes({ xCount: 5, yCount: 5 })
    plot.clip()
    for (const s of curveBranches(E, x0, x1, 1500)) {
      plot.path(s, { color: 'rgba(94,231,255,0.7)', width: 2 })
    }
    for (let i = 0; i < cycle.length; i++) {
      const P = cycle[i]
      if (!P) continue
      const on = i < step
      plot.dot(Q.toNumber(P.x), Q.toNumber(P.y), {
        r: i === step - 1 ? 6.5 : 4.5,
        fill: on ? (i === step - 1 ? '#ffc766' : '#ff7ba8') : 'rgba(120,140,200,0.25)',
        stroke: '#06070f',
        width: 1.8,
      })
      // Only the current point and the generator get a label; on the larger
      // cycles everything else piles up into an unreadable smear.
      if (on && (i === step - 1 || i === 0)) {
        plot.text(Q.toNumber(P.x), Q.toNumber(P.y), ` ${i + 1}P`, {
          color: i === step - 1 ? '#ffc766' : 'rgba(233,237,255,0.7)', dy: -11,
          font: '10px ui-monospace, monospace',
        })
      }
    }
    if (g2) {
      // The extra ℤ/2 factor: a point of order 2 that is not on the cycle.
      plot.dot(Q.toNumber(g2.x), Q.toNumber(g2.y), {
        r: 5.5, fill: '#a78bfa', stroke: '#06070f', width: 1.8,
      })
      plot.text(Q.toNumber(g2.x), Q.toNumber(g2.y), ' Q', {
        color: '#a78bfa', dy: -11, font: '10px ui-monospace, monospace',
      })
    }
    plot.unclip()

    // ring diagram
    ring.resize().setView(-1.35, 1.35, -1.35, 1.35)
    ring.clear()
    const N = spec.order
    const ang = (i) => (Math.PI / 2) - (2 * Math.PI * i) / N
    const circle = []
    for (let i = 0; i <= 90; i++) {
      const a = (i / 90) * Math.PI * 2
      circle.push([Math.cos(a), Math.sin(a)])
    }
    ring.path(circle, { color: 'rgba(140,155,210,0.25)', width: 1.2 })
    const cur = step % N
    for (let i = 0; i < N; i++) {
      const a = ang(i)
      const isO = i === 0
      const isCur = i === cur
      const reached = isO ? step >= N : i <= step
      ring.dot(Math.cos(a), Math.sin(a), {
        r: isO ? 7 : 5.5,
        fill: isCur ? '#ffc766' : reached ? '#ff7ba8' : 'rgba(120,140,200,0.3)',
        stroke: '#06070f',
        width: 2,
      })
      ring.text(Math.cos(a) * 1.19, Math.sin(a) * 1.19, isO ? 'O' : `${i}P`, {
        color: isO ? '#ffc766' : 'rgba(150,163,205,0.9)',
        align: 'center', font: '9.5px ui-monospace, monospace',
      })
    }
    // One sweep from O round to the current point.
    const arc = []
    const t0 = ang(0)
    const t1 = ang(step)
    const steps = Math.max(2, step * 8)
    for (let k = 0; k <= steps; k++) {
      const a = t0 + ((t1 - t0) * k) / steps
      arc.push([Math.cos(a) * 0.86, Math.sin(a) * 0.86])
    }
    if (arc.length > 2) ring.path(arc, { color: '#ffc766', width: 1.8 })

    const P = cycle[step - 1]
    const shown = step >= spec.order ? 'O' : `(${fmtQ(P.x)}, ${fmtQ(P.y)})`
    ro.innerHTML = [
      `<span><span class="k">torsion</span> <b class="hot">${spec.label}</b></span>`,
      `<span><span class="k">|T| =</span> <b>${spec.gen2 ? spec.order * 2 : spec.order}</b></span>`,
      `<span><span class="k">order of P =</span> <b>${state.order}</b></span>`,
      g2
        ? `<span><span class="k">plus Q of order 2 off the cycle:</span> <b class="cy">(${fmtQ(g2.x)}, ${fmtQ(g2.y)})</b></span>`
        : '',
      `<span><span class="k">${step}P =</span> <b class="${step >= spec.order ? 'hot' : 'cy'}">${shown}</b></span>`,
      step >= spec.order ? `<span class="good">back to the identity — the cycle closes</span>` : '',
    ].join('')

    // highlight the matching entry in Mazur's list
    $$('#mazur-list span').forEach((s) =>
      s.classList.toggle('hit', s.dataset.name === spec.name),
    )
  }

  TORSION.forEach((t, i) => {
    const b = document.createElement('button')
    b.textContent = t.label
    b.addEventListener('click', () => {
      clearInterval(timer); timer = 0
      idx = i
      $$('button', picks).forEach((x) => x.classList.remove('on'))
      b.classList.add('on')
      build()
      draw()
    })
    picks.appendChild(b)
  })
  $$('button', picks)[idx].classList.add('on')

  $('#tor-step').addEventListener('click', () => {
    step = step >= state.spec.order ? 1 : step + 1
    draw()
  })
  $('#tor-run').addEventListener('click', (e) => {
    if (timer) { clearInterval(timer); timer = 0; e.target.textContent = 'run ▸'; return }
    e.target.textContent = 'pause ▮▮'
    step = 0
    timer = setInterval(() => {
      step = step >= state.spec.order ? 1 : step + 1
      draw()
    }, 520)
  })

  build()
  live(cv, draw)
  live(rv, draw)
}

export function renderMazur() {
  const el = $('#mazur-list')
  if (!el) return
  el.innerHTML =
    'Mazur’s theorem — the complete list of torsion subgroups of an elliptic curve over ℚ: ' +
    TORSION.map((t) => `<span data-name="${t.name}">${t.label}</span>`).join('') +
    ' Fifteen groups, and nothing else, ever.'
}

// ═════════════════════════════════════════════ 5. the Mordell-Weil lattice

const LATTICE = {
  1: { ainvs: [0, 0, 1, -1, 0], gens: [['0', '0']], label: 'y² + y = x³ − x', cond: 37 },
  2: { ainvs: [1, 0, 0, 0, 1], gens: [['0', '1'], ['-1', '1']], label: 'y² + xy = x³ + 1', cond: 433 },
  3: {
    ainvs: [1, -1, 1, -6, 0],
    gens: [['0', '0'], ['-1', '2'], ['-2', '1']],
    label: 'y² + xy + y = x³ − x² − 6x',
    cond: 11197,
  },
}

export function initLattice() {
  const cv = $('#cv-lattice')
  if (!cv) return
  const plot = new Plot(cv, { pad: { l: 34, r: 14, t: 18, b: 26 } })
  const ro = $('#ro-lattice')
  let r = 1
  let cells = []
  let hover = null

  function build() {
    const spec = LATTICE[r]
    const E = curve(spec.ainvs)
    const gens = spec.gens.map(parsePt)
    const K = r === 1 ? 13 : r === 2 ? 7 : 3
    cells = []
    const idx = []
    const rec = (depth, acc) => {
      if (depth === r) { idx.push([...acc]); return }
      for (let v = -K; v <= K; v++) { acc.push(v); rec(depth + 1, acc); acc.pop() }
    }
    rec(0, [])
    for (const c of idx) {
      const P = combine(E, gens, c)
      cells.push({ c, P, h: naiveHeight(P), dig: xDigits(P) })
    }
    return { spec, E, K }
  }

  let ctx = build()

  function draw() {
    const { spec, K } = ctx
    plot.resize()
    plot.clear()
    const maxH = Math.max(...cells.map((c) => c.h), 1)
    // sqrt spreads the shallow middle of the paraboloid across more of the ramp
    const shade = (h) => heat(0.1 + 0.9 * Math.sqrt(h / maxH))
    // Ink that stays legible whether the cell underneath is dark or bright.
    const ink = (h) => (0.1 + 0.9 * Math.sqrt(h / maxH) > 0.55 ? 'rgba(8,10,20,0.82)' : 'rgba(226,233,255,0.72)')
    plot.square = r !== 1
    // On a narrow screen the cells stop being wide enough for a digit count.
    const cellPx = plot.box.w / ((r === 3 ? (2 * K + 1) * (2 * K + 1.4) : 2 * K + 1.2))
    const roomForLabels = cellPx >= 11

    if (r === 1) {
      plot.setView(-K - 0.6, K + 0.6, -1.1, 1.1)
      plot.grid({ yCount: 1, xCount: 8 })
      for (const c of cells) {
        plot.cell(c.c[0] - 0.44, -0.5, 0.88, 1.0, c.c[0] === 0 ? '#2a2f4a' : shade(c.h))
      }
      plot.axes({ xCount: 8, yCount: 1, xLabel: 'n₁' })
      for (const c of cells) {
        if (!roomForLabels && c.c[0] !== 0) continue
        plot.text(c.c[0], 0, c.c[0] === 0 ? 'O' : String(c.dig), {
          color: c.c[0] === 0 ? '#ffc766' : ink(c.h),
          align: 'center', font: 'bold 10px ui-monospace, monospace',
        })
      }
    } else if (r === 2) {
      plot.setView(-K - 0.6, K + 0.6, -K - 0.6, K + 0.6)
      for (const c of cells) {
        plot.cell(c.c[0] - 0.46, c.c[1] - 0.46, 0.92, 0.92, c.c.every((v) => v === 0) ? '#2a2f4a' : shade(c.h))
      }
      plot.axes({ xCount: 7, yCount: 7, xLabel: 'n₁', yLabel: 'n₂' })
      for (const c of cells) {
        if (!roomForLabels && !c.c.every((v) => v === 0)) continue
        plot.text(c.c[0], c.c[1], c.c.every((v) => v === 0) ? 'O' : String(c.dig), {
          color: c.c.every((v) => v === 0) ? '#ffc766' : ink(c.h),
          align: 'center', font: 'bold 9px ui-monospace, monospace',
        })
      }
    } else {
      // rank 3: five slices through n3
      const slices = 2 * K + 1
      plot.setView(-0.5, slices * (2 * K + 1.4), -K - 0.7, K + 1.5)
      for (const c of cells) {
        const off = (c.c[2] + K) * (2 * K + 1.4)
        plot.cell(off + c.c[0] + K - 0.46, c.c[1] - 0.46, 0.92, 0.92,
          c.c.every((v) => v === 0) ? '#2a2f4a' : shade(c.h))
        if (!roomForLabels && !c.c.every((v) => v === 0)) continue
        plot.text(off + c.c[0] + K, c.c[1], c.c.every((v) => v === 0) ? 'O' : String(c.dig), {
          color: c.c.every((v) => v === 0) ? '#ffc766' : ink(c.h),
          align: 'center', font: 'bold 8.5px ui-monospace, monospace',
        })
      }
      for (let s = -K; s <= K; s++) {
        const off = (s + K) * (2 * K + 1.4)
        plot.text(off + K, K + 1.0, `n₃ = ${s}`, {
          color: 'rgba(150,163,205,0.9)', align: 'center', font: '10px ui-monospace, monospace',
        })
      }
    }

    const shown = hover || cells.find((c) => c.c.every((v, i) => v === (i === 0 ? 1 : 0)))
    const coordStr = shown ? shown.c.map((v, i) => `${v >= 0 && i > 0 ? '+' : ''}${v}P${'₁₂₃'[i]}`).join(' ') : ''
    ro.innerHTML =
      `<div><span class="k">curve</span> <b>${spec.label}</b> <span class="k">· conductor</span> <b>${spec.cond}</b> <span class="k">· rank</span> <b class="hot">${r}</b> <span class="k">· ${cells.length} combinations drawn · each cell shows how many digits that solution needs</span></div>` +
      (shown
        ? `<div style="margin-top:6px"><span class="k">${coordStr} =</span> <b class="frac">${shown.P ? `(${fmtQ(shown.P.x)}, ${fmtQ(shown.P.y)})` : 'O'}</b>` +
          `<span class="k"> · ${shown.dig} digit${shown.dig === 1 ? '' : 's'} · naive height</span> <b class="cy">${shown.h.toFixed(2)}</b></div>`
        : '')
  }

  cv.addEventListener('pointermove', (ev) => {
    const rect = cv.getBoundingClientRect()
    const wx = plot.wx(ev.clientX - rect.left)
    const wy = plot.wy(ev.clientY - rect.top)
    const { K } = ctx
    let found = null
    if (r === 1) found = cells.find((c) => Math.abs(c.c[0] - wx) < 0.5 && Math.abs(wy) < 0.55)
    else if (r === 2) found = cells.find((c) => Math.abs(c.c[0] - wx) < 0.5 && Math.abs(c.c[1] - wy) < 0.5)
    else {
      const span = 2 * K + 1.4
      const s = Math.round(wx / span)
      const off = s * span
      found = cells.find(
        (c) => c.c[2] === s - K && Math.abs(off + c.c[0] + K - wx) < 0.5 && Math.abs(c.c[1] - wy) < 0.5,
      )
    }
    if (found !== hover) { hover = found; draw() }
  })
  cv.addEventListener('pointerleave', () => { hover = null; draw() })

  $$('#lattice-picks button').forEach((btn) =>
    btn.addEventListener('click', () => {
      $$('#lattice-picks button').forEach((b) => b.classList.remove('on'))
      btn.classList.add('on')
      r = +btn.dataset.r
      hover = null
      ctx = build()
      draw()
    }),
  )

  live(cv, draw)
}
