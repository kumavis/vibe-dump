// textures.js — every texture in the book, drawn with Canvas 2D. No assets.

import * as THREE from 'three'
import { W, H, OVERHANG } from './dims.js'

export const SERIF = '"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif'

// mulberry32: tiny seeded RNG so every texture is identical on every load.
export function seeded(seed) {
  let a = seed >>> 0 || 1
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function hashString(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

function canvas(w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

// A grey noise tile (mean 128) with a little low-frequency mottling; drawn over
// paper with 'overlay' it lightens and darkens without shifting the tint.
let grainCache = null
function grainTile() {
  if (grainCache) return grainCache
  const size = 256
  const c = canvas(size, size)
  const g = c.getContext('2d')
  const img = g.createImageData(size, size)
  const rnd = seeded(7)
  // coarse value-noise lattice for mottling
  const N = 8
  const lattice = Array.from({ length: (N + 1) * (N + 1) }, () => rnd() - 0.5)
  const lat = (i, j) => lattice[(j % N) * (N + 1) + (i % N)]
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const fx = (x / size) * N
      const fy = (y / size) * N
      const ix = Math.floor(fx)
      const iy = Math.floor(fy)
      const tx = fx - ix
      const ty = fy - iy
      const sx = tx * tx * (3 - 2 * tx)
      const sy = ty * ty * (3 - 2 * ty)
      const m =
        (lat(ix, iy) * (1 - sx) + lat(ix + 1, iy) * sx) * (1 - sy) +
        (lat(ix, iy + 1) * (1 - sx) + lat(ix + 1, iy + 1) * sx) * sy
      const v = 128 + (rnd() - 0.5) * 46 + m * 26
      const i = (y * size + x) * 4
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v
      img.data[i + 3] = 255
    }
  }
  g.putImageData(img, 0, 0)
  grainCache = c
  return c
}

function luminance(hex) {
  const c = new THREE.Color(hex)
  return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b
}

// Paper: tint + grain + fibres + gutter shade. `spineRight` puts the gutter on
// the canvas's right edge (a left page).
function drawPaper(g, w, h, tint, ink, seed, spineRight) {
  g.fillStyle = tint
  g.fillRect(0, 0, w, h)
  const dark = luminance(tint) < 0.3
  // grain
  g.save()
  g.globalCompositeOperation = 'overlay'
  g.globalAlpha = dark ? 0.32 : 0.42
  g.fillStyle = g.createPattern(grainTile(), 'repeat')
  g.fillRect(0, 0, w, h)
  g.restore()
  // fibres: short, faint, slightly curved strokes
  const rnd = seeded(seed)
  g.save()
  g.lineCap = 'round'
  const fibres = Math.round((w * h) / 5000)
  for (let i = 0; i < fibres; i++) {
    const x = rnd() * w
    const y = rnd() * h
    const len = (6 + rnd() * 26) * (w / 1024)
    const a = rnd() * Math.PI * 2
    const bend = (rnd() - 0.5) * 0.9
    g.strokeStyle = rnd() < 0.55 ? ink : dark ? '#ffffff' : '#fffaf0'
    g.globalAlpha = 0.025 + rnd() * 0.035
    g.lineWidth = (0.5 + rnd() * 1.1) * (w / 1024)
    g.beginPath()
    g.moveTo(x, y)
    g.quadraticCurveTo(
      x + Math.cos(a + bend) * len * 0.5,
      y + Math.sin(a + bend) * len * 0.5,
      x + Math.cos(a) * len,
      y + Math.sin(a) * len,
    )
    g.stroke()
  }
  g.restore()
  // gutter: a soft shade near the spine plus a faint crease line
  const gx = spineRight ? w : 0
  const gw = w * 0.16
  const grad = g.createLinearGradient(gx, 0, spineRight ? w - gw : gw, 0)
  grad.addColorStop(0, `rgba(0,0,0,${dark ? 0.32 : 0.2})`)
  grad.addColorStop(0.35, `rgba(0,0,0,${dark ? 0.1 : 0.07})`)
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = grad
  g.fillRect(spineRight ? w - gw : 0, 0, gw, h)
  // outer edge + top/bottom: barely darker, like handled card
  const ox = spineRight ? 0 : w
  const ow = w * 0.035
  const og = g.createLinearGradient(ox, 0, spineRight ? ow : w - ow, 0)
  og.addColorStop(0, 'rgba(0,0,0,0.07)')
  og.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = og
  g.fillRect(spineRight ? 0 : w - ow, 0, ow, h)
  for (const [y0, y1] of [
    [0, h * 0.02],
    [h, h * 0.98],
  ]) {
    const vg = g.createLinearGradient(0, y0, 0, y1)
    vg.addColorStop(0, 'rgba(0,0,0,0.06)')
    vg.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = vg
    g.fillRect(0, Math.min(y0, y1), w, Math.abs(y1 - y0))
  }
}

// Fit `text` into maxW: shrink a little, then break into two lines.
function fitLines(g, text, size, minScale, maxW, style) {
  const font = (s) => `${style}${Math.round(s)}px ${SERIF}`
  g.font = font(size)
  let wpx = g.measureText(text).width
  if (wpx <= maxW) return { lines: [text], size }
  const shrunk = (size * maxW) / wpx
  if (shrunk >= size * minScale) return { lines: [text], size: shrunk }
  // two lines, split at the space nearest the middle
  const words = text.split(' ')
  let best = null
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ')
    const b = words.slice(i).join(' ')
    g.font = font(size)
    const m = Math.max(g.measureText(a).width, g.measureText(b).width)
    if (!best || m < best.m) best = { a, b, m }
  }
  if (!best) return { lines: [text], size: shrunk }
  const s2 = Math.min(size * 0.86, (size * maxW) / best.m)
  return { lines: [best.a, best.b], size: s2 }
}

// One page of a spread. side: 'left' | 'right'. Canvas ≈ 1024 × 1434 (H/W).
// The near strip (z > 0.45, the bottom 18 % of the canvas) carries the text.
export function drawPage(mod, side, width = 1024) {
  const w = width
  const h = Math.round((width * H) / W)
  const c = canvas(w, h)
  const g = c.getContext('2d')
  const pal = mod.palette || {}
  const tint = pal.paper || '#efe6d4'
  const ink = pal.ink || '#3b322a'
  const left = side === 'left'
  drawPaper(g, w, h, tint, ink, hashString(`${mod.id}:${side}`), left)

  g.fillStyle = ink
  g.textAlign = 'center'
  g.textBaseline = 'alphabetic'
  const strip = h * (1 - 0.25 / H) // canvas y where the near strip starts
  const cx = w / 2
  const maxW = w * 0.82
  const setSpacing = (em, px) => {
    if ('letterSpacing' in g) g.letterSpacing = `${(em * px).toFixed(1)}px`
  }

  if (left) {
    if (mod.label) {
      const s = h * 0.03
      g.globalAlpha = 0.72
      g.font = `${Math.round(s)}px ${SERIF}`
      setSpacing(0.08, s)
      g.textAlign = 'left'
      g.fillText(String(mod.label), w * 0.085, h * 0.075)
      g.textAlign = 'center'
    }
    const t = fitLines(g, mod.title || '', h * 0.05, 0.84, maxW, '')
    const pali = mod.pali || ''
    const ps = h * 0.024
    const lineH = t.size * 1.18
    const block = t.lines.length * lineH + (pali ? ps * 1.9 : 0)
    // centre the title block in the strip, nudged toward the page's middle
    let y = strip + (h - strip - block) / 2 + t.size * 0.9 - h * 0.006
    g.globalAlpha = 0.9
    g.font = `${Math.round(t.size)}px ${SERIF}`
    setSpacing(0.03, t.size)
    for (const line of t.lines) {
      g.fillText(line, cx, y)
      y += lineH
    }
    if (pali) {
      g.globalAlpha = 0.68
      g.font = `italic ${Math.round(ps)}px ${SERIF}`
      setSpacing(0.04, ps)
      g.fillText(pali, cx, y - lineH + t.size * 0.3 + ps * 1.75)
    }
  } else {
    const t = fitLines(g, mod.line || '', h * 0.036, 0.84, maxW, '')
    const lineH = t.size * 1.3
    const block = t.lines.length * lineH
    let y = strip + (h - strip - block) / 2 + t.size * 0.95 - h * 0.006
    g.globalAlpha = 0.86
    g.font = `${Math.round(t.size)}px ${SERIF}`
    setSpacing(0.02, t.size)
    for (const line of t.lines) {
      g.fillText(line, cx, y)
      y += lineH
    }
  }
  g.globalAlpha = 1
  return c
}

// ---- cover --------------------------------------------------------------------

const CLOTH = '#2b2320'
const GILT = '#d2b67e'

function drawCloth(g, w, h, seed) {
  g.fillStyle = CLOTH
  g.fillRect(0, 0, w, h)
  // weave: alternating faint warp and weft threads
  const step = Math.max(2, Math.round(w / 340))
  g.globalAlpha = 0.07
  g.fillStyle = '#000000'
  for (let x = 0; x < w; x += step * 2) g.fillRect(x, 0, step, h)
  g.globalAlpha = 0.035
  g.fillStyle = '#f0dcc0'
  for (let y = 0; y < h; y += step * 2) g.fillRect(0, y, w, step)
  g.globalAlpha = 1
  g.save()
  g.globalCompositeOperation = 'overlay'
  g.globalAlpha = 0.35
  g.fillStyle = g.createPattern(grainTile(), 'repeat')
  g.fillRect(0, 0, w, h)
  g.restore()
  // rubbed edges and corners: a touch lighter where hands go
  const rnd = seeded(seed)
  const edge = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.hypot(w, h) * 0.55)
  edge.addColorStop(0, 'rgba(255,235,210,0)')
  edge.addColorStop(1, 'rgba(255,235,210,0.07)')
  g.fillStyle = edge
  g.fillRect(0, 0, w, h)
  for (let i = 0; i < 40; i++) {
    g.globalAlpha = 0.02 + rnd() * 0.03
    g.fillStyle = rnd() < 0.5 ? '#000' : '#e8d5b8'
    const r = (20 + rnd() * 90) * (w / 1024)
    g.beginPath()
    g.arc(rnd() * w, rnd() * h, r, 0, Math.PI * 2)
    g.fill()
  }
  g.globalAlpha = 1
}

// A brush ensō: a ring of overlapping dabs, heavy where the brush lands, thinning
// and breaking up toward the tail, with a gap left open.
function drawEnso(g, cx, cy, r, width, color, seed, alpha = 1) {
  const rnd = seeded(seed)
  const start = -Math.PI * 0.62
  const sweep = Math.PI * 1.84
  const steps = 900
  g.save()
  g.fillStyle = color
  for (let i = 0; i < steps; i++) {
    const t = i / steps
    const a = start + sweep * t
    const wob = Math.sin(t * 9.0 + 1.3) * 0.012 + Math.sin(t * 23.0) * 0.005
    const rr = r * (1 + wob + (t > 0.85 ? (t - 0.85) * 0.12 : 0))
    // width: quick swell, long body, dry tapering tail
    const body = Math.min(1, t / 0.06) * (1 - Math.pow(t, 3) * 0.75)
    const ww = width * (0.35 + 0.65 * body)
    const dry = t > 0.7 ? (t - 0.7) / 0.3 : 0
    if (rnd() < dry * 0.55) continue
    g.globalAlpha = alpha * (0.12 + 0.1 * (1 - dry))
    const x = cx + Math.cos(a) * rr + (rnd() - 0.5) * ww * 0.3
    const y = cy + Math.sin(a) * rr + (rnd() - 0.5) * ww * 0.3
    g.beginPath()
    g.ellipse(x, y, ww * 0.5, ww * (0.36 + rnd() * 0.12), a, 0, Math.PI * 2)
    g.fill()
  }
  g.restore()
}

function stamped(g, draw) {
  // blind-stamp: a dark lip below, a faint highlight above, then the gilt
  g.save()
  g.translate(0, 2)
  draw('rgba(0,0,0,0.55)')
  g.translate(0, -3)
  draw('rgba(255,236,205,0.10)')
  g.restore()
  draw(GILT)
}

// Front cover, outside: covers the whole board (W + overhang) × (H + 2·overhang).
export function drawCover(width = 1024) {
  const w = width
  const h = Math.round((width * (H + 2 * OVERHANG)) / (W + OVERHANG))
  const c = canvas(w, h)
  const g = c.getContext('2d')
  drawCloth(g, w, h, 11)
  // the board's hinge groove near the spine (canvas left)
  g.fillStyle = 'rgba(0,0,0,0.22)'
  g.fillRect(w * 0.045, 0, w * 0.006, h)
  g.fillStyle = 'rgba(255,230,200,0.05)'
  g.fillRect(w * 0.052, 0, w * 0.003, h)
  // a thin blind border
  const inset = w * 0.075
  g.lineWidth = Math.max(1.5, w / 600)
  stamped(g, (col) => {
    g.strokeStyle = col
    g.globalAlpha = col === GILT ? 0.32 : 1
    g.strokeRect(inset + w * 0.02, inset, w - inset * 2 - w * 0.0, h - inset * 2)
    g.globalAlpha = 1
  })
  const cx = w * 0.525
  // ensō
  drawEnso(g, cx, h * 0.39, w * 0.2, w * 0.05, 'rgba(0,0,0,0.6)', 5, 0.9)
  g.save()
  g.translate(0, -2)
  drawEnso(g, cx, h * 0.39, w * 0.2, w * 0.05, GILT, 5, 0.95)
  g.restore()
  // title
  g.textAlign = 'center'
  g.textBaseline = 'alphabetic'
  const ts = h * 0.05
  stamped(g, (col) => {
    g.fillStyle = col
    g.font = `${Math.round(ts)}px ${SERIF}`
    if ('letterSpacing' in g) g.letterSpacing = `${(ts * 0.22).toFixed(1)}px`
    g.fillText('THE JHĀNAS', cx + ts * 0.11, h * 0.685)
  })
  const ss = h * 0.024
  g.globalAlpha = 0.78
  stamped(g, (col) => {
    g.fillStyle = col
    g.font = `italic ${Math.round(ss)}px ${SERIF}`
    if ('letterSpacing' in g) g.letterSpacing = `${(ss * 0.08).toFixed(1)}px`
    g.fillText('a pop-up book', cx, h * 0.735)
  })
  g.globalAlpha = 1
  return c
}

// Back cover, outside: blank cloth, one tiny mark (symmetric, so it reads the
// same from either side).
export function drawBackCover(width = 512) {
  const w = width
  const h = Math.round((width * (H + 2 * OVERHANG)) / (W + OVERHANG))
  const c = canvas(w, h)
  const g = c.getContext('2d')
  drawCloth(g, w, h, 12)
  g.strokeStyle = GILT
  g.globalAlpha = 0.55
  g.lineWidth = Math.max(1, w / 400)
  g.beginPath()
  g.arc(w / 2, h * 0.88, w * 0.022, 0, Math.PI * 2)
  g.stroke()
  g.globalAlpha = 1
  return c
}

// Small tileable cloth for the boards' edges and insides.
export function drawClothTile() {
  const c = canvas(128, 128)
  drawCloth(c.getContext('2d'), 128, 128, 13)
  return c
}

// Stack edges: white with a slightly darker line per leaf (16 leaves per tile,
// v runs across the leaves). Multiplied by the paper-edge colour.
export function drawEdgeTile() {
  const c = canvas(4, 64)
  const g = c.getContext('2d')
  g.fillStyle = '#ffffff'
  g.fillRect(0, 0, 4, 64)
  g.fillStyle = '#d9d0c0'
  for (let i = 0; i < 16; i++) g.fillRect(0, i * 4 + 3, 4, 1)
  return c
}

// Soft pool of light for the table: white centre falling off to black.
export function drawTablePool() {
  const c = canvas(256, 256)
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  grad.addColorStop(0, '#ffffff')
  grad.addColorStop(0.35, '#b8b8b8')
  grad.addColorStop(0.7, '#3a3a3a')
  grad.addColorStop(1, '#000000')
  g.fillStyle = grad
  g.fillRect(0, 0, 256, 256)
  return c
}

// Soft round sprite for THREE.Points.
export function drawDot(size = 64) {
  const c = canvas(size, size)
  const g = c.getContext('2d')
  const r = size / 2
  const grad = g.createRadialGradient(r, r, 0, r, r, r)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.25, 'rgba(255,255,255,0.75)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  return c
}

export function toTexture(c, { srgb = true, repeat = false, anisotropy = 1 } = {}) {
  const t = new THREE.CanvasTexture(c)
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.anisotropy = anisotropy
  t.needsUpdate = true
  return t
}
