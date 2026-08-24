// Cubic-Bézier and polyline geometry. Everything downstream works on flat
// Float64Array point buffers (x0,y0,x1,y1,…), so this module is the only place
// that knows about Bézier control points.

export const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v)
export const lerp = (a, b, t) => a + (b - a) * t
export const smoothstep = (t) => t * t * (3 - 2 * t)

/** Point on a cubic segment given as 8 flat numbers starting at `o`. */
export function cubicAt(c, o, t) {
  const mt = 1 - t
  const a = mt * mt * mt
  const b = 3 * mt * mt * t
  const d = 3 * mt * t * t
  const e = t * t * t
  return [
    a * c[o] + b * c[o + 2] + d * c[o + 4] + e * c[o + 6],
    a * c[o + 1] + b * c[o + 3] + d * c[o + 5] + e * c[o + 7],
  ]
}

/** Rough arc length of one cubic segment, by chord/control-polygon averaging. */
function cubicLength(c, o) {
  const chord = Math.hypot(c[o + 6] - c[o], c[o + 7] - c[o + 1])
  const poly =
    Math.hypot(c[o + 2] - c[o], c[o + 3] - c[o + 1]) +
    Math.hypot(c[o + 4] - c[o + 2], c[o + 5] - c[o + 3]) +
    Math.hypot(c[o + 6] - c[o + 4], c[o + 7] - c[o + 5])
  return (chord + poly) / 2
}

/**
 * Flatten a stroke stored as [x0,y0, (c1,c2,end)…] into `n` points spaced
 * uniformly in arc length. Uniform spacing matters: every deformation operator
 * assumes point index ≈ position along the stroke.
 */
export function flattenStroke(cubics, n) {
  const segs = (cubics.length - 2) / 6
  // dense sample first, then resample by arc length
  const per = 16
  const dense = new Float64Array((segs * per + 1) * 2)
  dense[0] = cubics[0]
  dense[1] = cubics[1]
  let w = 2
  for (let s = 0; s < segs; s++) {
    const o = s * 6 // start of this segment's [c1x,c1y,c2x,c2y,ex,ey]
    const c = [cubics[o], cubics[o + 1], cubics[o + 2], cubics[o + 3], cubics[o + 4], cubics[o + 5], cubics[o + 6], cubics[o + 7]]
    for (let k = 1; k <= per; k++) {
      const [x, y] = cubicAt(c, 0, k / per)
      dense[w++] = x
      dense[w++] = y
    }
  }
  return resample(dense, n)
}

/** Total length of a flat polyline buffer. */
export function polylineLength(p) {
  let L = 0
  for (let i = 2; i < p.length; i += 2) L += Math.hypot(p[i] - p[i - 2], p[i + 1] - p[i - 1])
  return L
}

/** Resample a flat polyline to exactly `n` points, uniform in arc length. */
export function resample(p, n) {
  const m = p.length / 2
  if (m < 2) {
    const out = new Float64Array(n * 2)
    for (let i = 0; i < n; i++) {
      out[i * 2] = p[0] || 0
      out[i * 2 + 1] = p[1] || 0
    }
    return out
  }
  const cum = new Float64Array(m)
  for (let i = 1; i < m; i++) {
    cum[i] = cum[i - 1] + Math.hypot(p[i * 2] - p[i * 2 - 2], p[i * 2 + 1] - p[i * 2 - 1])
  }
  const total = cum[m - 1]
  const out = new Float64Array(n * 2)
  if (total === 0) {
    for (let i = 0; i < n; i++) {
      out[i * 2] = p[0]
      out[i * 2 + 1] = p[1]
    }
    return out
  }
  let j = 0
  for (let i = 0; i < n; i++) {
    const target = (total * i) / (n - 1)
    while (j < m - 2 && cum[j + 1] < target) j++
    const seg = cum[j + 1] - cum[j]
    const t = seg > 0 ? (target - cum[j]) / seg : 0
    out[i * 2] = lerp(p[j * 2], p[j * 2 + 2], t)
    out[i * 2 + 1] = lerp(p[j * 2 + 1], p[j * 2 + 3], t)
  }
  return out
}

/** Cumulative normalised arc length (0..1) for each point of a polyline. */
export function arcParam(p) {
  const m = p.length / 2
  const s = new Float64Array(m)
  for (let i = 1; i < m; i++) s[i] = s[i - 1] + Math.hypot(p[i * 2] - p[i * 2 - 2], p[i * 2 + 1] - p[i * 2 - 1])
  const total = s[m - 1] || 1
  for (let i = 0; i < m; i++) s[i] /= total
  return s
}

/** Unit tangent at each point (central differences, endpoints one-sided). */
export function tangents(p, out) {
  const m = p.length / 2
  const t = out && out.length === m * 2 ? out : new Float64Array(m * 2)
  for (let i = 0; i < m; i++) {
    const a = Math.max(0, i - 1)
    const b = Math.min(m - 1, i + 1)
    let dx = p[b * 2] - p[a * 2]
    let dy = p[b * 2 + 1] - p[a * 2 + 1]
    const L = Math.hypot(dx, dy) || 1
    t[i * 2] = dx / L
    t[i * 2 + 1] = dy / L
  }
  return t
}

/** Axis-aligned bounds of a flat point buffer. */
export function bbox(p, from = 0, to = p.length) {
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (let i = from; i < to; i += 2) {
    if (p[i] < x0) x0 = p[i]
    if (p[i] > x1) x1 = p[i]
    if (p[i + 1] < y0) y0 = p[i + 1]
    if (p[i + 1] > y1) y1 = p[i + 1]
  }
  return { x0, y0, x1, y1 }
}

/** One Chaikin corner-cutting pass, preserving both endpoints. */
export function chaikin(p, keepEnds = true) {
  const m = p.length / 2
  if (m < 3) return p.slice()
  const out = new Float64Array(p.length)
  out[0] = p[0]
  out[1] = p[1]
  out[p.length - 2] = p[p.length - 2]
  out[p.length - 1] = p[p.length - 1]
  for (let i = 1; i < m - 1; i++) {
    out[i * 2] = 0.25 * p[i * 2 - 2] + 0.5 * p[i * 2] + 0.25 * p[i * 2 + 2]
    out[i * 2 + 1] = 0.25 * p[i * 2 - 1] + 0.5 * p[i * 2 + 1] + 0.25 * p[i * 2 + 3]
  }
  if (!keepEnds) {
    out[0] = lerp(p[0], out[2], 0.5)
    out[1] = lerp(p[1], out[3], 0.5)
  }
  return out
}

/** Ramer–Douglas–Peucker simplification of a closed or open flat polyline. */
export function simplify(p, tol) {
  const m = p.length / 2
  if (m < 3) return p.slice()
  const keep = new Uint8Array(m)
  keep[0] = keep[m - 1] = 1
  const stack = [[0, m - 1]]
  const tol2 = tol * tol
  while (stack.length) {
    const [a, b] = stack.pop()
    if (b - a < 2) continue
    const ax = p[a * 2]
    const ay = p[a * 2 + 1]
    const bx = p[b * 2]
    const by = p[b * 2 + 1]
    const dx = bx - ax
    const dy = by - ay
    const L2 = dx * dx + dy * dy
    let best = -1
    let bestD = 0
    for (let i = a + 1; i < b; i++) {
      const px = p[i * 2] - ax
      const py = p[i * 2 + 1] - ay
      let d2
      if (L2 === 0) d2 = px * px + py * py
      else {
        const t = clamp((px * dx + py * dy) / L2, 0, 1)
        const ex = px - t * dx
        const ey = py - t * dy
        d2 = ex * ex + ey * ey
      }
      if (d2 > bestD) {
        bestD = d2
        best = i
      }
    }
    if (bestD > tol2 && best > 0) {
      keep[best] = 1
      stack.push([a, best], [best, b])
    }
  }
  const out = []
  for (let i = 0; i < m; i++) if (keep[i]) out.push(p[i * 2], p[i * 2 + 1])
  return Float64Array.from(out)
}

/** Signed area of a closed flat polygon (positive = counter-clockwise in y-up). */
export function signedArea(p) {
  let a = 0
  const m = p.length / 2
  for (let i = 0, j = m - 1; i < m; j = i++) {
    a += p[j * 2] * p[i * 2 + 1] - p[i * 2] * p[j * 2 + 1]
  }
  return a / 2
}

/** Flat point buffer → SVG path data. `closed` appends Z. */
export function toPathData(p, closed = false, prec = 2) {
  if (p.length < 4) return ''
  const f = (v) => {
    const s = v.toFixed(prec)
    return s.replace(/\.?0+$/, '') || '0'
  }
  let d = `M${f(p[0])} ${f(p[1])}`
  for (let i = 2; i < p.length; i += 2) d += `L${f(p[i])} ${f(p[i + 1])}`
  return closed ? d + 'Z' : d
}

/** Deterministic 32-bit PRNG so every render of a seed looks identical. */
export function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Cheap string hash for seeding per-glyph variation. */
export function hashString(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * Smooth 2-D value noise on a lattice, seeded. Used for hand tremor and the
 * curl-noise displacement field. Returns values in −1..1.
 */
export function makeNoise2D(seed) {
  const rnd = mulberry32(seed)
  const SIZE = 256
  const grid = new Float64Array(SIZE * SIZE)
  for (let i = 0; i < grid.length; i++) grid[i] = rnd() * 2 - 1
  return function noise(x, y) {
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const xf = x - xi
    const yf = y - yi
    const u = smoothstep(xf)
    const v = smoothstep(yf)
    const g = (a, b) => grid[(((a % SIZE) + SIZE) % SIZE) * SIZE + (((b % SIZE) + SIZE) % SIZE)]
    const a = lerp(g(xi, yi), g(xi + 1, yi), u)
    const b = lerp(g(xi, yi + 1), g(xi + 1, yi + 1), u)
    return lerp(a, b, v)
  }
}
