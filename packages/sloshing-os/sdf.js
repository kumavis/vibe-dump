// sdf.js — a tiny 2-D signed-distance toolkit. Every skin silhouette, every
// glass chamber and every liquid container in SloshOS is one of these: a
// function (x, y) → distance in CSS px, negative inside. Smooth unions give the
// skins their melted, biomechanical early-2000s outlines for free.

const len = (x, y) => Math.sqrt(x * x + y * y)

export const circle = (cx, cy, r) => (x, y) => len(x - cx, y - cy) - r

// rounded box from its centre and half-extents
export const box = (cx, cy, hw, hh, r = 0) => (x, y) => {
  const qx = Math.abs(x - cx) - hw + r
  const qy = Math.abs(y - cy) - hh + r
  const mx = qx > 0 ? qx : 0, my = qy > 0 ? qy : 0
  return Math.sqrt(mx * mx + my * my) + Math.min(Math.max(qx, qy), 0) - r
}

// rounded box from its corner, which is how layouts are easier to write
export const rect = (x, y, w, h, r = 0) => box(x + w / 2, y + h / 2, w / 2, h / 2, Math.min(r, w / 2, h / 2))

export const capsule = (ax, ay, bx, by, r) => (x, y) => {
  const px = x - ax, py = y - ay, dx = bx - ax, dy = by - ay
  const h = Math.max(0, Math.min(1, (px * dx + py * dy) / (dx * dx + dy * dy)))
  return len(px - dx * h, py - dy * h) - r
}

// an annulus: the circle of radius R, thickened by `half` either side
export const ring = (cx, cy, R, half) => (x, y) => Math.abs(len(x - cx, y - cy) - R) - half

// cheap ellipse (not exact, fine for gentle aspect ratios)
export const ellipse = (cx, cy, rx, ry) => (x, y) => {
  const k = len((x - cx) / rx, (y - cy) / ry)
  return (k - 1) * Math.min(rx, ry)
}

// isosceles trapezoid, y down: rTop/rBottom are half-widths, hh half-height
export const trapezoid = (cx, cy, rTop, rBottom, hh, round = 0) => {
  const r1 = rTop - round, r2 = rBottom - round, he = hh - round
  const k2x = r2 - r1, k2y = 2 * he
  const k2l = k2x * k2x + k2y * k2y
  return (x, y) => {
    const px = Math.abs(x - cx), py = y - cy
    const cax = px - Math.min(px, py < 0 ? r1 : r2)
    const cay = Math.abs(py) - he
    const t = Math.max(0, Math.min(1, ((r2 - px) * k2x + (he - py) * k2y) / k2l))
    const cbx = px - r2 + k2x * t
    const cby = py - he + k2y * t
    const s = cbx < 0 && cay < 0 ? -1 : 1
    return s * Math.sqrt(Math.min(cax * cax + cay * cay, cbx * cbx + cby * cby)) - round
  }
}

export function smin(a, b, k) {
  const h = Math.max(k - Math.abs(a - b), 0) / k
  return Math.min(a, b) - h * h * k * 0.25
}
export const smax = (a, b, k) => -smin(-a, -b, k)

export const union = (...fs) => (x, y) => {
  let d = Infinity
  for (const f of fs) { const v = f(x, y); if (v < d) d = v }
  return d
}
export const blend = (k, ...fs) => (x, y) => {
  let d = fs[0](x, y)
  for (let i = 1; i < fs.length; i++) d = smin(d, fs[i](x, y), k)
  return d
}
export const subtract = (a, b, k = 0) => (x, y) =>
  k ? smax(a(x, y), -b(x, y), k) : Math.max(a(x, y), -b(x, y))
export const intersect = (a, b) => (x, y) => Math.max(a(x, y), b(x, y))
export const grow = (f, r) => (x, y) => f(x, y) - r
export const shift = (f, dx, dy) => (x, y) => f(x - dx, y - dy)

// ---------------------------------------------------------------------------
// Grid: an SDF baked onto a lattice, for the fluid's thousands of lookups.
// ---------------------------------------------------------------------------

export class Grid {
  constructor(f, w, h, cell = 2) {
    this.w = w
    this.h = h
    this.c = cell
    this.cols = Math.ceil(w / cell) + 1
    this.rows = Math.ceil(h / cell) + 1
    this.d = new Float32Array(this.cols * this.rows)
    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < this.cols; i++) this.d[j * this.cols + i] = f(i * cell, j * cell)
    }
  }

  sample(x, y) {
    const { c, cols, rows, d } = this
    let fx = x / c, fy = y / c, out = 0
    const mx = cols - 1.001, my = rows - 1.001
    if (fx < 0) { out += -fx * c; fx = 0 } else if (fx > mx) { out += (fx - mx) * c; fx = mx }
    if (fy < 0) { out += -fy * c; fy = 0 } else if (fy > my) { out += (fy - my) * c; fy = my }
    const i = fx | 0, j = fy | 0
    const tx = fx - i, ty = fy - j
    const k = j * cols + i
    const a = d[k] + (d[k + 1] - d[k]) * tx
    const b = d[k + cols] + (d[k + cols + 1] - d[k + cols]) * tx
    return a + (b - a) * ty + out
  }

  // unit gradient (outward normal) into out[0], out[1]
  normal(x, y, out) {
    const e = this.c
    const gx = this.sample(x + e, y) - this.sample(x - e, y)
    const gy = this.sample(x, y + e) - this.sample(x, y - e)
    const l = Math.sqrt(gx * gx + gy * gy) || 1
    out[0] = gx / l
    out[1] = gy / l
    return out
  }
}

// Bounding box of the inside of f, scanned on a coarse lattice.
export function bounds(f, w, h, step = 4) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (let y = -step; y <= h + step; y += step) {
    for (let x = -step; x <= w + step; x += step) {
      if (f(x, y) < step) {
        if (x < x0) x0 = x
        if (y < y0) y0 = y
        if (x > x1) x1 = x
        if (y > y1) y1 = y
      }
    }
  }
  return { x0: x0 - step, y0: y0 - step, x1: x1 + step, y1: y1 + step }
}

// A CSS clip-path for pointer hit-testing: the inside of f as a union of
// row runs. Invisible (it only shapes the hit area), so 4px stairs are fine.
export function clipPath(f, w, h, step = 4) {
  let s = ''
  for (let y = 0; y < h; y += step) {
    let run = -1
    for (let x = 0; x <= w; x += step) {
      const inside = x < w && f(x + step / 2, y + step / 2) < 0
      if (inside && run < 0) run = x
      if (!inside && run >= 0) {
        s += `M${run} ${y}H${x}V${y + step}H${run}Z`
        run = -1
      }
    }
  }
  return `path('${s}')`
}
