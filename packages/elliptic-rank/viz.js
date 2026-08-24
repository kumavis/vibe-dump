// Small canvas plotting helper shared by every panel in the tutorial.
// Handles device-pixel scaling, world<->screen transforms, axes and the
// handful of marks the panels draw.

export class Plot {
  constructor(canvas, { pad = { l: 44, r: 16, t: 16, b: 30 }, square = false } = {}) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.pad = pad
    this.square = square
    this.view = { x0: -3, x1: 3, y0: -3, y1: 3 }
    this.resize()
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.w = Math.max(1, Math.round(rect.width))
    this.h = Math.max(1, Math.round(rect.height))
    this.canvas.width = Math.round(this.w * dpr)
    this.canvas.height = Math.round(this.h * dpr)
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    return this
  }

  /** Inner drawing box, in CSS pixels. */
  get box() {
    const { l, r, t, b } = this.pad
    return { x: l, y: t, w: this.w - l - r, h: this.h - t - b }
  }

  setView(x0, x1, y0, y1) {
    this.view = { x0, x1, y0, y1 }
    if (this.square) {
      // Expand the shorter axis so one world unit is one screen unit both ways.
      const bx = this.box
      const sx = bx.w / (x1 - x0)
      const sy = bx.h / (y1 - y0)
      const s = Math.min(sx, sy)
      const cx = (x0 + x1) / 2
      const cy = (y0 + y1) / 2
      const halfW = bx.w / (2 * s)
      const halfH = bx.h / (2 * s)
      this.view = { x0: cx - halfW, x1: cx + halfW, y0: cy - halfH, y1: cy + halfH }
    }
    return this
  }

  sx(x) {
    const b = this.box
    return b.x + ((x - this.view.x0) / (this.view.x1 - this.view.x0)) * b.w
  }

  sy(y) {
    const b = this.box
    return b.y + b.h - ((y - this.view.y0) / (this.view.y1 - this.view.y0)) * b.h
  }

  wx(px) {
    const b = this.box
    return this.view.x0 + ((px - b.x) / b.w) * (this.view.x1 - this.view.x0)
  }

  wy(py) {
    const b = this.box
    return this.view.y0 + ((b.y + b.h - py) / b.h) * (this.view.y1 - this.view.y0)
  }

  clear(fill) {
    const { ctx } = this
    ctx.clearRect(0, 0, this.w, this.h)
    if (fill) {
      ctx.fillStyle = fill
      ctx.fillRect(0, 0, this.w, this.h)
    }
    return this
  }

  /** Nice round tick values covering [lo, hi] with roughly `count` steps. */
  static ticks(lo, hi, count = 6) {
    const span = hi - lo
    if (!(span > 0)) return [lo]
    const raw = span / count
    const mag = Math.pow(10, Math.floor(Math.log10(raw)))
    const norm = raw / mag
    const step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag
    const out = []
    for (let v = Math.ceil(lo / step) * step; v <= hi + step * 1e-9; v += step) {
      out.push(Math.abs(v) < step * 1e-9 ? 0 : v)
    }
    return out
  }

  grid({ color = 'rgba(140,155,210,0.10)', xCount = 6, yCount = 5 } = {}) {
    const { ctx } = this
    const b = this.box
    ctx.save()
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.beginPath()
    for (const t of Plot.ticks(this.view.x0, this.view.x1, xCount)) {
      const px = Math.round(this.sx(t)) + 0.5
      ctx.moveTo(px, b.y)
      ctx.lineTo(px, b.y + b.h)
    }
    for (const t of Plot.ticks(this.view.y0, this.view.y1, yCount)) {
      const py = Math.round(this.sy(t)) + 0.5
      ctx.moveTo(b.x, py)
      ctx.lineTo(b.x + b.w, py)
    }
    ctx.stroke()
    ctx.restore()
    return this
  }

  axes({
    color = 'rgba(170,185,235,0.45)',
    label = 'rgba(150,163,205,0.85)',
    fmt = (v) => (Math.abs(v) >= 1e4 || (v !== 0 && Math.abs(v) < 1e-3) ? v.toExponential(0) : String(+v.toFixed(4))),
    xCount = 6,
    yCount = 5,
    xLabel = '',
    yLabel = '',
  } = {}) {
    const { ctx } = this
    const b = this.box
    ctx.save()
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    // Axis lines: through the origin when it is in view, otherwise the frame.
    const ax = Math.round(this.sx(Math.min(Math.max(0, this.view.x0), this.view.x1))) + 0.5
    const ay = Math.round(this.sy(Math.min(Math.max(0, this.view.y0), this.view.y1))) + 0.5
    ctx.beginPath()
    ctx.moveTo(b.x, ay)
    ctx.lineTo(b.x + b.w, ay)
    ctx.moveTo(ax, b.y)
    ctx.lineTo(ax, b.y + b.h)
    ctx.stroke()

    ctx.fillStyle = label
    ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    for (const t of Plot.ticks(this.view.x0, this.view.x1, xCount)) {
      if (t === 0) continue
      ctx.fillText(fmt(t), this.sx(t), b.y + b.h + 6)
    }
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    for (const t of Plot.ticks(this.view.y0, this.view.y1, yCount)) {
      if (t === 0) continue
      ctx.fillText(fmt(t), b.x - 6, this.sy(t))
    }
    if (xLabel) {
      ctx.textAlign = 'right'
      ctx.textBaseline = 'bottom'
      ctx.fillText(xLabel, b.x + b.w, b.y + b.h - 4)
    }
    if (yLabel) {
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      ctx.fillText(yLabel, b.x + 4, b.y + 2)
    }
    ctx.restore()
    return this
  }

  /** Draw a polyline from an array of [x, y] world points. */
  path(pts, { color = '#5ee7ff', width = 2, dash = null, alpha = 1 } = {}) {
    if (!pts || pts.length < 2) return this
    const { ctx } = this
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.strokeStyle = color
    ctx.lineWidth = width
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    if (dash) ctx.setLineDash(dash)
    ctx.beginPath()
    ctx.moveTo(this.sx(pts[0][0]), this.sy(pts[0][1]))
    for (let i = 1; i < pts.length; i++) ctx.lineTo(this.sx(pts[i][0]), this.sy(pts[i][1]))
    ctx.stroke()
    ctx.restore()
    return this
  }

  segment(x0, y0, x1, y1, opts = {}) {
    return this.path([[x0, y0], [x1, y1]], opts)
  }

  dot(x, y, { r = 4, fill = '#ffd166', stroke = '#0a0c18', width = 2, alpha = 1 } = {}) {
    const { ctx } = this
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.beginPath()
    ctx.arc(this.sx(x), this.sy(y), r, 0, Math.PI * 2)
    ctx.fillStyle = fill
    ctx.fill()
    if (width > 0) {
      ctx.lineWidth = width
      ctx.strokeStyle = stroke
      ctx.stroke()
    }
    ctx.restore()
    return this
  }

  text(x, y, str, { color = '#e8ecff', font = '11px ui-monospace, monospace', align = 'left', baseline = 'middle', dx = 0, dy = 0 } = {}) {
    const { ctx } = this
    ctx.save()
    ctx.fillStyle = color
    ctx.font = font
    ctx.textAlign = align
    ctx.textBaseline = baseline
    ctx.fillText(str, this.sx(x) + dx, this.sy(y) + dy)
    ctx.restore()
    return this
  }

  /** A filled rectangle in world coordinates, used for heat cells. */
  cell(x, y, w, h, fill, alpha = 1) {
    const { ctx } = this
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.fillStyle = fill
    const px = this.sx(x)
    const py = this.sy(y + h)
    ctx.fillRect(px, py, this.sx(x + w) - px, this.sy(y) - py)
    ctx.restore()
    return this
  }

  clip() {
    const b = this.box
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.rect(b.x, b.y, b.w, b.h)
    this.ctx.clip()
    return this
  }

  unclip() {
    this.ctx.restore()
    return this
  }
}

/**
 * Walk x across a window and collect the real locus as drawable polylines.
 *
 * `yPair(x)` returns [yUpper, yLower], or null where x is off the curve. A run
 * that both begins and ends because the curve ran out — an oval — comes back as
 * one closed loop, so there is no seam at its tips. A run cut off by the edge of
 * the window instead stays as two open strands, so nothing is drawn joining the
 * top and bottom of an unbounded branch across the frame.
 */
export function scanComponents(x0, x1, samples, yPair) {
  const out = []
  let up = []
  let lo = []
  let openLeft = false
  const flush = (openRight) => {
    if (up.length > 1) {
      if (openLeft || openRight) out.push(up, lo.slice().reverse())
      else out.push([...up, ...lo.slice().reverse(), up[0]])
    }
    up = []
    lo = []
  }
  for (let i = 0; i <= samples; i++) {
    const x = x0 + ((x1 - x0) * i) / samples
    const ys = yPair(x)
    if (!ys) {
      flush(false)
      continue
    }
    if (up.length === 0) openLeft = i === 0
    up.push([x, ys[0]])
    lo.push([x, ys[1]])
  }
  flush(true)
  return out
}

/** The real locus of a Weierstrass curve E, ready to hand to Plot#path. */
export function curveBranches(E, x0, x1, samples = 900) {
  const b2 = Number(E.b2)
  const b4 = Number(E.b4)
  const b6 = Number(E.b6)
  const a1 = Number(E.a1)
  const a3 = Number(E.a3)
  return scanComponents(x0, x1, samples, (x) => {
    // (2y + a1 x + a3)^2 = 4x^3 + b2 x^2 + 2 b4 x + b6
    const v = 4 * x * x * x + b2 * x * x + 2 * b4 * x + b6
    if (v < 0) return null
    const w = Math.sqrt(v)
    const shift = a1 * x + a3
    return [(w - shift) / 2, (-w - shift) / 2]
  })
}

/** Linear interpolation between two #rrggbb colours. */
export function mixHex(a, b, t) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16))
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16))
  const p = pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.min(1, Math.max(0, t))))
  return `rgb(${p[0]},${p[1]},${p[2]})`
}

/** Sequential ramp used for height heat maps. */
export function heat(t) {
  t = Math.min(1, Math.max(0, t))
  const stops = ['#101427', '#1c3a6e', '#2f7fb5', '#57c2c9', '#b7e88a', '#ffd166', '#ff7a5c']
  const s = t * (stops.length - 1)
  const i = Math.min(stops.length - 2, Math.floor(s))
  return mixHex(stops[i], stops[i + 1], s - i)
}

/** Format a big decimal digit string in groups, for very long integers. */
export function groupDigits(s, size = 5) {
  const neg = s.startsWith('-')
  const body = neg ? s.slice(1) : s
  const out = []
  for (let i = 0; i < body.length; i += size) out.push(body.slice(i, i + size))
  return (neg ? '−' : '') + out.join(' ')
}

/** Shorten a huge integer string to head…tail plus a digit count. */
export function elide(s, head = 12, tail = 8) {
  const neg = s.startsWith('-')
  const body = neg ? s.slice(1) : s
  if (body.length <= head + tail + 3) return (neg ? '−' : '') + body
  return `${neg ? '−' : ''}${body.slice(0, head)}…${body.slice(-tail)}`
}

export const observe = (el, fn) => {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && fn(e.target)),
    { rootMargin: '120px' },
  )
  io.observe(el)
  return io
}
