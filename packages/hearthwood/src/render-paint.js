// Paint helpers shared by sprite baking (bake time only — these may allocate).
// OWNER: render implementer. No DOM access at import time.

export const TAU = Math.PI * 2

/** Woodland-fantasy palette (ARCHITECTURE.md §16.3 + derived shades). */
export const PAL = Object.freeze({
  bark: '#6b4a2f', barkD: '#45301e', barkL: '#8d6844',
  moss: '#6fae6a', mossD: '#3e6b45', mossL: '#9fd38f',
  deep: '#0b1410',
  amber: '#ffb54a', amberL: '#ffe0a0', ember: '#ff7a3a',
  teal: '#46e3cf', tealD: '#1f8f86',
  moon: '#c8d4ff', moonD: '#7f8fc8',
  blight: '#a24bd1', blightD: '#55246e', blightL: '#d58cff',
  stone: '#8a968c', stoneD: '#58635b', stoneL: '#b5c0b3',
  leaf: '#2f6b3a', leafD: '#1c4426', leafL: '#5aa25a',
  thatch: '#b39255', thatchD: '#7f6436',
  plank: '#c9a06a', plankD: '#8f6a3e',
  iron: '#9aa6b0', ironD: '#5d666e',
  gold: '#f2c35a',
})

// ---------------------------------------------------------------- colour
export function hexToRgb(h) {
  const n = parseInt(h.slice(1, 7), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
function hx(v) { const s = Math.max(0, Math.min(255, Math.round(v))).toString(16); return s.length < 2 ? '0' + s : s }
export function rgbToHex(r, g, b) { return '#' + hx(r) + hx(g) + hx(b) }
/** Linear mix of two hex colours. */
export function mix(a, b, t) {
  const A = hexToRgb(a), B = hexToRgb(b)
  return rgbToHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t)
}
/** t > 0 lightens toward white, t < 0 darkens toward black. */
export function shade(h, t) { return t >= 0 ? mix(h, '#ffffff', t) : mix(h, '#000000', -t) }
export function rgba(h, a) { const c = hexToRgb(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')' }
/** Packed little-endian ABGR uint32 for ImageData Uint32 views. */
export function abgr(h, a = 255) { const c = hexToRgb(h); return ((a << 24) | (c[2] << 16) | (c[1] << 8) | c[0]) >>> 0 }

// ---------------------------------------------------------------- shapes
export function rr(g, x, y, w, h, r) {
  r = Math.max(0, Math.min(r, w / 2, h / 2))
  g.beginPath()
  g.moveTo(x + r, y)
  g.arcTo(x + w, y, x + w, y + h, r)
  g.arcTo(x + w, y + h, x, y + h, r)
  g.arcTo(x, y + h, x, y, r)
  g.arcTo(x, y, x + w, y, r)
  g.closePath()
}
export function circle(g, x, y, r, fill) {
  g.beginPath(); g.arc(x, y, Math.max(0.01, r), 0, TAU); g.fillStyle = fill; g.fill()
}
export function ell(g, x, y, rx, ry, fill) {
  g.beginPath(); g.ellipse(x, y, Math.max(0.01, rx), Math.max(0.01, ry), 0, 0, TAU); g.fillStyle = fill; g.fill()
}
export function poly(g, pts, fill, stroke, lw) {
  g.beginPath()
  g.moveTo(pts[0], pts[1])
  for (let i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1])
  g.closePath()
  if (fill) { g.fillStyle = fill; g.fill() }
  if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw || 1; g.stroke() }
}
export function line(g, x0, y0, x1, y1, col, lw) {
  g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.strokeStyle = col; g.lineWidth = lw; g.stroke()
}
export function lin(g, x0, y0, x1, y1, stops) {
  const gr = g.createLinearGradient(x0, y0, x1, y1)
  for (let i = 0; i < stops.length; i += 2) gr.addColorStop(stops[i], stops[i + 1])
  return gr
}
export function rad(g, x, y, r0, r1, stops) {
  const gr = g.createRadialGradient(x, y, Math.max(0, r0), x, y, Math.max(0.01, r1))
  for (let i = 0; i < stops.length; i += 2) gr.addColorStop(stops[i], stops[i + 1])
  return gr
}
/** Soft radial glow blob. */
export function glowBlob(g, x, y, r, col, a = 0.8) {
  g.fillStyle = rad(g, x, y, 0, r, [0, rgba(col, a), 0.45, rgba(col, a * 0.35), 1, rgba(col, 0)])
  g.fillRect(x - r, y - r, r * 2, r * 2)
}

/** Leafy canopy: overlapping lobes with a dark base, mid body and lit top-left. */
export function canopy(g, cx, cy, rx, ry, base, rng, lobes = 7) {
  const dark = shade(base, -0.45), mid = base, lit = shade(base, 0.28)
  ell(g, cx + rx * 0.06, cy + ry * 0.12, rx, ry, dark)
  for (let i = 0; i < lobes; i++) {
    const a = (i / lobes) * TAU + rng.float() * 0.5
    const lx = cx + Math.cos(a) * rx * 0.55, ly = cy + Math.sin(a) * ry * 0.5
    circle(g, lx, ly, Math.min(rx, ry) * (0.45 + rng.float() * 0.15), mid)
  }
  ell(g, cx, cy, rx * 0.7, ry * 0.7, mid)
  for (let i = 0; i < lobes - 2; i++) {
    const a = Math.PI * (1.05 + rng.float() * 0.9)
    const lx = cx + Math.cos(a) * rx * 0.38, ly = cy + Math.sin(a) * ry * 0.38
    circle(g, lx, ly, Math.min(rx, ry) * (0.22 + rng.float() * 0.1), lit)
  }
}

/** Trodden earth / moss pad under a building footprint. */
export function pad(g, x, y, w, h, col) {
  g.fillStyle = rgba(shade(col, -0.35), 0.55)
  rr(g, x + 1, y + 1, w - 2, h - 2, Math.min(w, h) * 0.22); g.fill()
  g.fillStyle = rgba(col, 0.6)
  rr(g, x + w * 0.06, y + h * 0.06, w * 0.88, h * 0.88, Math.min(w, h) * 0.2); g.fill()
}

/** Plank wall with vertical boards. */
export function wall(g, x, y, w, h, col, detail) {
  g.fillStyle = lin(g, 0, y, 0, y + h, [0, shade(col, 0.08), 1, shade(col, -0.25)])
  g.fillRect(x, y, w, h)
  if (detail) {
    const n = Math.max(2, Math.round(w / (h * 0.32)))
    g.strokeStyle = rgba(shade(col, -0.5), 0.55); g.lineWidth = Math.max(1, w * 0.012)
    for (let i = 1; i < n; i++) { const xx = x + (w * i) / n; g.beginPath(); g.moveTo(xx, y); g.lineTo(xx, y + h); g.stroke() }
  }
  g.fillStyle = rgba('#000000', 0.25); g.fillRect(x, y, w, Math.max(1, h * 0.1))
}

/** Stone wall with offset blocks. */
export function stoneWall(g, x, y, w, h, col, detail, rng) {
  g.fillStyle = lin(g, 0, y, 0, y + h, [0, shade(col, 0.05), 1, shade(col, -0.3)])
  g.fillRect(x, y, w, h)
  if (!detail) return
  const rows = 3, bh = h / rows
  g.strokeStyle = rgba(shade(col, -0.55), 0.6); g.lineWidth = Math.max(1, h * 0.03)
  for (let r = 0; r < rows; r++) {
    const yy = y + r * bh
    g.beginPath(); g.moveTo(x, yy); g.lineTo(x + w, yy); g.stroke()
    const bw = bh * 1.6, off = (r & 1) * bw * 0.5
    for (let xx = x + off; xx < x + w; xx += bw) { g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx, yy + bh); g.stroke() }
  }
  for (let i = 0; i < 4; i++) ell(g, x + rng.float() * w, y + rng.float() * h * 0.3, w * 0.06, h * 0.05, rgba(PAL.moss, 0.55))
}

/**
 * Gable roof seen in 3/4 view: front slope from eave (y0) up to ridge (yr), plus a sliver of
 * back slope above the ridge. kind: 'shingle' | 'thatch' | 'leaf' | 'slate'.
 */
export function roof(g, x, y0, w, yr, col, kind, detail, rng) {
  const eave = w * 0.06
  const back = (y0 - yr) * 0.22
  // back slope
  poly(g, [x - eave * 0.5, yr + 1, x + w + eave * 0.5, yr + 1, x + w - w * 0.08, yr - back, x + w * 0.08, yr - back], shade(col, 0.18))
  // front slope
  g.fillStyle = lin(g, 0, yr, 0, y0, [0, shade(col, 0.12), 1, shade(col, -0.22)])
  g.beginPath()
  if (kind === 'leaf') {
    g.moveTo(x - eave, y0)
    g.quadraticCurveTo(x + w * 0.5, y0 + (y0 - yr) * 0.25, x + w + eave, y0)
    g.quadraticCurveTo(x + w * 0.9, yr + (y0 - yr) * 0.2, x + w * 0.5, yr - back * 1.4)
    g.quadraticCurveTo(x + w * 0.1, yr + (y0 - yr) * 0.2, x - eave, y0)
  } else {
    g.moveTo(x - eave, y0); g.lineTo(x + w + eave, y0); g.lineTo(x + w, yr); g.lineTo(x, yr)
  }
  g.closePath(); g.fill()
  if (detail) {
    const rows = kind === 'thatch' ? 4 : 5
    g.lineWidth = Math.max(1, w * 0.012)
    g.strokeStyle = rgba(shade(col, -0.55), 0.5)
    for (let r = 1; r < rows; r++) {
      const yy = yr + ((y0 - yr) * r) / rows
      const inset = kind === 'leaf' ? w * 0.08 * (1 - r / rows) : 0
      g.beginPath(); g.moveTo(x + inset, yy); g.lineTo(x + w - inset, yy); g.stroke()
      if (kind === 'shingle' || kind === 'slate') {
        const step = w / (6 + r)
        for (let xx = x + (r & 1) * step * 0.5; xx < x + w; xx += step) {
          g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx, yy - (y0 - yr) / rows); g.stroke()
        }
      }
    }
    if (kind === 'thatch' || kind === 'leaf') {
      for (let i = 0; i < 6; i++) {
        ell(g, x + rng.float() * w, yr + rng.float() * (y0 - yr), w * 0.07, (y0 - yr) * 0.06, rgba(PAL.moss, 0.6))
      }
    }
  }
  // ridge
  line(g, x - eave * 0.2, yr, x + w + eave * 0.2, yr, shade(col, -0.45), Math.max(1.5, w * 0.025))
  // eave shadow line
  line(g, x - eave, y0, x + w + eave, y0, rgba('#000000', 0.35), Math.max(1, w * 0.02))
}

export function door(g, x, y, w, h, glow) {
  g.fillStyle = glow ? lin(g, 0, y, 0, y + h, [0, PAL.amberL, 1, PAL.amber]) : shade(PAL.barkD, -0.3)
  g.beginPath()
  g.moveTo(x, y + h); g.lineTo(x, y + w * 0.5); g.arc(x + w / 2, y + w * 0.5, w / 2, Math.PI, 0); g.lineTo(x + w, y + h)
  g.closePath(); g.fill()
  g.strokeStyle = PAL.barkD; g.lineWidth = Math.max(1, w * 0.12); g.stroke()
}

export function windowLit(g, x, y, s, col = PAL.amber) {
  g.fillStyle = PAL.barkD; g.fillRect(x - s * 0.1, y - s * 0.1, s * 1.2, s * 1.2)
  g.fillStyle = col; g.fillRect(x, y, s, s)
  g.fillStyle = rgba('#ffffff', 0.45); g.fillRect(x, y, s * 0.45, s * 0.45)
}

export function logPile(g, x, y, s) {
  for (let r = 0; r < 2; r++) for (let i = 0; i < 3 - r; i++) {
    const cx = x + s * (0.18 + i * 0.32 + r * 0.16), cy = y + s * (0.6 - r * 0.28)
    circle(g, cx, cy, s * 0.16, PAL.barkD)
    circle(g, cx, cy, s * 0.12, PAL.plank)
    circle(g, cx, cy, s * 0.05, PAL.plankD)
  }
}

export function crate(g, x, y, s, col = PAL.plank) {
  g.fillStyle = col; g.fillRect(x, y, s, s)
  g.strokeStyle = PAL.plankD; g.lineWidth = Math.max(1, s * 0.1)
  g.strokeRect(x, y, s, s)
  g.beginPath(); g.moveTo(x, y); g.lineTo(x + s, y + s); g.stroke()
}

export function mushroom(g, x, y, s, cap, glow) {
  if (glow) glowBlob(g, x, y - s * 0.5, s * 1.4, cap, 0.5)
  g.fillStyle = '#e8f2e0'; g.fillRect(x - s * 0.12, y - s * 0.45, s * 0.24, s * 0.5)
  g.beginPath(); g.ellipse(x, y - s * 0.45, s * 0.5, s * 0.32, 0, Math.PI, 0); g.closePath()
  g.fillStyle = cap; g.fill()
  circle(g, x - s * 0.18, y - s * 0.58, s * 0.07, rgba('#ffffff', 0.75))
  circle(g, x + s * 0.15, y - s * 0.52, s * 0.05, rgba('#ffffff', 0.6))
}

export function crystal(g, x, y, s, col) {
  poly(g, [x, y - s, x + s * 0.32, y - s * 0.35, x + s * 0.2, y, x - s * 0.2, y, x - s * 0.32, y - s * 0.35], col)
  poly(g, [x, y - s, x + s * 0.32, y - s * 0.35, x, y - s * 0.2], shade(col, 0.4))
  poly(g, [x, y - s, x - s * 0.32, y - s * 0.35, x, y - s * 0.2], shade(col, -0.15))
}

export function banner(g, x, y, w, h, col, emblem) {
  line(g, x, y - h * 0.15, x, y + h, PAL.barkD, Math.max(1, w * 0.18))
  poly(g, [x, y, x + w, y, x + w, y + h * 0.75, x + w * 0.5, y + h * 0.6, x, y + h * 0.75], col)
  if (emblem) circle(g, x + w * 0.5, y + h * 0.3, w * 0.22, emblem)
}
