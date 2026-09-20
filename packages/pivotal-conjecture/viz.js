// A small canvas layer shared by every panel. Two jobs: device-pixel handling,
// and the handful of marks a string diagram needs — wires, cups and caps,
// boxes, beads and arrowheads.
//
// Strokes go down in two passes, a wide pale one under a narrow dark one, which
// is what gives the lines their slightly wet look against the paper. It costs
// nothing and it keeps the diagrams reading as drawings rather than as plots,
// which is the right register for this subject: string diagrams are things
// people draw by hand.

export const INK = {
  paper: '#f6f2e7',
  panel: '#fbf8f1',
  ink: '#1e1c19',
  soft: '#5d574c',
  faint: '#a9a094',
  rule: 'rgba(60, 52, 40, 0.14)',
  indigo: '#2d4a78',
  verm: '#b03a24',
  teal: '#18685c',
  ochre: '#9a6d10',
  plum: '#6a3d78',
}

export class Sheet {
  constructor(canvas, { pad = 18 } = {}) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.pad = pad
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

  /** Paper, plus the faint squared rule the whole page is drawn on. */
  clear({ grid = 26, ruled = true } = {}) {
    const { ctx } = this
    ctx.clearRect(0, 0, this.w, this.h)
    ctx.fillStyle = INK.panel
    ctx.fillRect(0, 0, this.w, this.h)
    if (ruled) {
      ctx.save()
      ctx.strokeStyle = 'rgba(60, 52, 40, 0.07)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = grid; x < this.w; x += grid) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, this.h) }
      for (let y = grid; y < this.h; y += grid) { ctx.moveTo(0, y + 0.5); ctx.lineTo(this.w, y + 0.5) }
      ctx.stroke()
      ctx.restore()
    }
    return this
  }

  /** A pen stroke through screen-space points, optionally as a smooth spline. */
  stroke(pts, { color = INK.ink, width = 2.2, dash = null, alpha = 1, smooth = true, close = false } = {}) {
    if (!pts || pts.length < 2) return this
    const { ctx } = this
    const trace = () => {
      ctx.beginPath()
      ctx.moveTo(pts[0][0], pts[0][1])
      if (smooth && pts.length > 2) {
        for (let i = 1; i < pts.length - 1; i++) {
          const mx = (pts[i][0] + pts[i + 1][0]) / 2
          const my = (pts[i][1] + pts[i + 1][1]) / 2
          ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my)
        }
        ctx.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1])
      } else {
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
      }
      if (close) ctx.closePath()
    }
    ctx.save()
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    if (dash) ctx.setLineDash(dash)
    ctx.globalAlpha = alpha * 0.3
    ctx.strokeStyle = color
    ctx.lineWidth = width + 1.6
    trace()
    ctx.stroke()
    ctx.globalAlpha = alpha
    ctx.lineWidth = width
    trace()
    ctx.stroke()
    ctx.restore()
    return this
  }

  fillPath(pts, { color = INK.ink, alpha = 1, smooth = false } = {}) {
    if (!pts || pts.length < 3) return this
    const { ctx } = this
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(pts[0][0], pts[0][1])
    if (smooth) {
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i][0] + pts[i + 1][0]) / 2
        const my = (pts[i][1] + pts[i + 1][1]) / 2
        ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my)
      }
    } else {
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
    }
    ctx.closePath()
    ctx.fill()
    ctx.restore()
    return this
  }

  disc(x, y, r, { fill = INK.paper, stroke = INK.ink, width = 2, alpha = 1 } = {}) {
    const { ctx } = this
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    if (fill) { ctx.fillStyle = fill; ctx.fill() }
    if (stroke && width > 0) { ctx.lineWidth = width; ctx.strokeStyle = stroke; ctx.stroke() }
    ctx.restore()
    return this
  }

  /** A morphism box sitting on a wire. */
  box(x, y, w, h, label, { color = INK.ink, fill = INK.paper, font = '13px ui-monospace, monospace' } = {}) {
    const { ctx } = this
    ctx.save()
    ctx.fillStyle = fill
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.rect(x - w / 2, y - h / 2, w, h)
    ctx.fill()
    ctx.stroke()
    if (label) {
      ctx.fillStyle = color
      ctx.font = font
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(label, x, y + 0.5)
    }
    ctx.restore()
    return this
  }

  /** Direction marker on a wire: `dir` is the unit tangent to point along. */
  arrow(x, y, dx, dy, { color = INK.ink, size = 7 } = {}) {
    const len = Math.hypot(dx, dy) || 1
    const ux = dx / len
    const uy = dy / len
    const px = -uy
    const py = ux
    this.fillPath(
      [
        [x + ux * size, y + uy * size],
        [x - ux * size * 0.55 + px * size * 0.62, y - uy * size * 0.55 + py * size * 0.62],
        [x - ux * size * 0.55 - px * size * 0.62, y - uy * size * 0.55 - py * size * 0.62],
      ],
      { color },
    )
    return this
  }

  text(x, y, str, { color = INK.ink, font = '12px ui-monospace, monospace', align = 'left', baseline = 'middle', halo = null } = {}) {
    const { ctx } = this
    ctx.save()
    ctx.font = font
    ctx.textAlign = align
    ctx.textBaseline = baseline
    if (halo) {
      ctx.lineWidth = 4
      ctx.strokeStyle = halo
      ctx.lineJoin = 'round'
      ctx.strokeText(str, x, y)
    }
    ctx.fillStyle = color
    ctx.fillText(str, x, y)
    ctx.restore()
    return this
  }

  /** Width of a string in the given font, for laying labels out by hand. */
  measure(str, font = '12px ui-monospace, monospace') {
    this.ctx.save()
    this.ctx.font = font
    const w = this.ctx.measureText(str).width
    this.ctx.restore()
    return w
  }
}

/** Sample a cubic Bézier, for wires that have to bend. */
export function bezier(p0, p1, p2, p3, steps = 48) {
  const out = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const u = 1 - t
    out.push([
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ])
  }
  return out
}

/** Linear blend of two #rrggbb colours. */
export function mix(a, b, t) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16))
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16))
  const p = pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.min(1, Math.max(0, t))))
  return `rgb(${p[0]},${p[1]},${p[2]})`
}

export const lerp = (a, b, t) => a + (b - a) * t

/** Ease used by every animated control on the page. */
export const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

/** Run `fn(progress)` for `ms`, then settle at 1. Returns a cancel function. */
export function animate(ms, fn) {
  let raf = 0
  const start = performance.now()
  const step = (now) => {
    const t = Math.min(1, (now - start) / ms)
    fn(ease(t))
    if (t < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
  return () => cancelAnimationFrame(raf)
}

/** Redraw on resize, and run `fn` once now. */
export function onResize(sheet, fn) {
  const ro = new ResizeObserver(() => { sheet.resize(); fn() })
  ro.observe(sheet.canvas)
  fn()
  return ro
}

export const $ = (s, r = document) => r.querySelector(s)
export const $$ = (s, r = document) => [...r.querySelectorAll(s)]

/** A button row; returns the buttons so callers can restyle the active one. */
export function buttonRow(host, items, onPick, activeIndex = 0) {
  host.innerHTML = ''
  const btns = items.map((item, i) => {
    const b = document.createElement('button')
    b.textContent = item.label
    if (item.title) b.title = item.title
    b.addEventListener('click', () => {
      btns.forEach((o, j) => o.classList.toggle('on', j === i))
      onPick(item, i)
    })
    if (i === activeIndex) b.classList.add('on')
    host.appendChild(b)
    return b
  })
  return btns
}

/** Six significant figures, without an exponent for the sizes on this page. */
export const num = (v, digits = 6) => {
  if (!Number.isFinite(v)) return '—'
  const body = Math.abs(v - Math.round(v)) < 1e-9
    ? String(Math.round(v))
    : v.toFixed(digits).replace(/0+$/, '').replace(/\.$/, '')
  return body.replace(/^-/, '\u2212')
}
