// Canvas charts for the Books panel. Colors were validated (CVD + contrast)
// against the panel surface #252b38: series blue #3987e5, orange #d95926.

import { fmtShort } from './data.js'

export const CHART = {
  blue: '#3987e5',
  orange: '#d95926',
  ink: '#e8ecf4',
  muted: '#8d97ab',
  grid: 'rgba(255,255,255,0.08)',
  baseline: 'rgba(255,255,255,0.22)',
}

function prep(canvas) {
  const dpr = Math.min(devicePixelRatio || 1, 2)
  const w = canvas.clientWidth || 300
  const h = canvas.clientHeight || 140
  canvas.width = w * dpr
  canvas.height = h * dpr
  const ctx = canvas.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w, h)
  ctx.font = '11px system-ui, sans-serif'
  return { ctx, w, h }
}

function niceScale(min, max) {
  if (min === max) {
    min -= 1
    max += 1
  }
  const span = max - min
  const step = Math.pow(10, Math.floor(Math.log10(span / 3)))
  const mult = span / 3 / step > 5 ? 5 : span / 3 / step > 2 ? 2 : 1
  const s = step * mult
  return { lo: Math.floor(min / s) * s, hi: Math.ceil(max / s) * s, step: s }
}

const PAD = { l: 44, r: 10, t: 10, b: 20 }

// points: [{ d, v }]. Returns a hit-test fn for tooltips.
export function lineChart(canvas, points, { color = CHART.blue, fmt = fmtShort } = {}) {
  const { ctx, w, h } = prep(canvas)
  if (!points.length) return () => null
  const vals = points.map((p) => p.v)
  const { lo, hi, step } = niceScale(Math.min(0, ...vals), Math.max(...vals))
  const X = (i) => PAD.l + (i / Math.max(1, points.length - 1)) * (w - PAD.l - PAD.r)
  const Y = (v) => PAD.t + (1 - (v - lo) / (hi - lo)) * (h - PAD.t - PAD.b)

  ctx.fillStyle = CHART.muted
  ctx.strokeStyle = CHART.grid
  ctx.lineWidth = 1
  for (let v = lo; v <= hi + 1e-9; v += step) {
    const y = Y(v)
    ctx.beginPath()
    ctx.moveTo(PAD.l, y)
    ctx.lineTo(w - PAD.r, y)
    ctx.stroke()
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    ctx.fillText(fmt(v), PAD.l - 6, y)
  }
  if (lo < 0) {
    ctx.strokeStyle = CHART.baseline
    ctx.beginPath()
    ctx.moveTo(PAD.l, Y(0))
    ctx.lineTo(w - PAD.r, Y(0))
    ctx.stroke()
  }
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  const every = Math.ceil(points.length / 5)
  points.forEach((p, i) => {
    if (i % every === 0) ctx.fillText(`D${p.d}`, X(i), h - PAD.b + 6)
  })

  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.lineJoin = ctx.lineCap = 'round'
  ctx.beginPath()
  points.forEach((p, i) => (i ? ctx.lineTo(X(i), Y(p.v)) : ctx.moveTo(X(i), Y(p.v))))
  ctx.stroke()
  const last = points[points.length - 1]
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(X(points.length - 1), Y(last.v), 3.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = CHART.ink
  ctx.textAlign = 'right'
  ctx.textBaseline = 'bottom'
  ctx.fillText(fmt(last.v), w - PAD.r, Y(last.v) - 6)

  return (px) => {
    const i = Math.round(((px - PAD.l) / (w - PAD.l - PAD.r)) * (points.length - 1))
    if (i < 0 || i >= points.length) return null
    return { x: X(i), y: Y(points[i].v), label: `Day ${points[i].d} · ${fmt(points[i].v)}` }
  }
}

// days: [{ d, inc, exp }] — paired bars, blue income / orange expenses.
export function barChart(canvas, days) {
  const { ctx, w, h } = prep(canvas)
  if (!days.length) return () => null
  const maxV = Math.max(1, ...days.flatMap((p) => [p.inc, p.exp]))
  const { lo, hi, step } = niceScale(0, maxV)
  const Y = (v) => PAD.t + (1 - (v - lo) / (hi - lo)) * (h - PAD.t - PAD.b)

  ctx.fillStyle = CHART.muted
  ctx.strokeStyle = CHART.grid
  for (let v = lo; v <= hi + 1e-9; v += step) {
    const y = Y(v)
    ctx.beginPath()
    ctx.moveTo(PAD.l, y)
    ctx.lineTo(w - PAD.r, y)
    ctx.stroke()
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    ctx.fillText(fmtShort(v), PAD.l - 6, y)
  }

  const slot = (w - PAD.l - PAD.r) / days.length
  const barW = Math.min(14, Math.max(3, slot / 2 - 3))
  const groups = []
  days.forEach((p, i) => {
    const cx = PAD.l + slot * i + slot / 2
    for (const [v, color, off] of [
      [p.inc, CHART.blue, -barW / 2 - 1],
      [p.exp, CHART.orange, barW / 2 + 1],
    ]) {
      const y = Y(v)
      const bh = Y(lo) - y
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.roundRect(cx + off - barW / 2, y, barW, Math.max(1, bh), [4, 4, 0, 0])
      ctx.fill()
    }
    groups.push({ cx, d: p.d, inc: p.inc, exp: p.exp })
    if (days.length <= 8 || i % 2 === 0) {
      ctx.fillStyle = CHART.muted
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillText(`D${p.d}`, cx, h - PAD.b + 6)
    }
  })

  return (px) => {
    let best = null
    for (const g of groups) {
      if (!best || Math.abs(g.cx - px) < Math.abs(best.cx - px)) best = g
    }
    if (!best || Math.abs(best.cx - px) > slot) return null
    return {
      x: best.cx,
      y: PAD.t,
      label: `Day ${best.d} · in ${fmtShort(best.inc)} / out ${fmtShort(best.exp)}`,
    }
  }
}

// Wires a chart's hit-test fn to a floating tooltip element.
export function attachTooltip(canvas, tipEl, hitFnRef) {
  const show = (e) => {
    const rect = canvas.getBoundingClientRect()
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
    const hit = hitFnRef.fn?.(x)
    if (!hit) {
      tipEl.hidden = true
      return
    }
    tipEl.textContent = hit.label
    tipEl.hidden = false
    const parent = tipEl.offsetParent?.getBoundingClientRect() ?? rect
    let left = rect.left - parent.left + hit.x - tipEl.offsetWidth / 2
    left = Math.max(4, Math.min(parent.width - tipEl.offsetWidth - 4, left))
    tipEl.style.left = `${left}px`
    tipEl.style.top = `${rect.top - parent.top - 26}px`
  }
  const hide = () => {
    tipEl.hidden = true
  }
  canvas.addEventListener('pointermove', show)
  canvas.addEventListener('pointerdown', show)
  canvas.addEventListener('pointerleave', hide)
}
