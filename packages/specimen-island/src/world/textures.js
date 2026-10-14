import * as THREE from 'three'
import { mulberry32 } from '../core/rng.js'

// Procedural canvas textures. Nothing is downloaded — every surface on the
// island is painted here at boot.

function makeCanvas(w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

// Cheap tileable value noise on an integer lattice.
function tileNoise(size, cells, seed) {
  const rand = mulberry32(seed)
  const lat = new Float32Array(cells * cells)
  for (let i = 0; i < lat.length; i++) lat[i] = rand()
  const out = new Float32Array(size * size)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const gx = (x / size) * cells
      const gy = (y / size) * cells
      const x0 = Math.floor(gx)
      const y0 = Math.floor(gy)
      const fx = gx - x0
      const fy = gy - y0
      const sx = fx * fx * (3 - 2 * fx)
      const sy = fy * fy * (3 - 2 * fy)
      const a = lat[(y0 % cells) * cells + (x0 % cells)]
      const b = lat[(y0 % cells) * cells + ((x0 + 1) % cells)]
      const c = lat[((y0 + 1) % cells) * cells + (x0 % cells)]
      const d = lat[((y0 + 1) % cells) * cells + ((x0 + 1) % cells)]
      out[y * size + x] = (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy
    }
  }
  return out
}

function fractal(size, seed, octaves = 4, base = 4) {
  const out = new Float32Array(size * size)
  let amp = 1
  let norm = 0
  for (let o = 0; o < octaves; o++) {
    const n = tileNoise(size, base << o, seed + o * 31)
    for (let i = 0; i < out.length; i++) out[i] += n[i] * amp
    norm += amp
    amp *= 0.5
  }
  for (let i = 0; i < out.length; i++) out[i] /= norm
  return out
}

function toTexture(canvas, { repeat = true, srgb = true } = {}) {
  const t = new THREE.CanvasTexture(canvas)
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  t.needsUpdate = true
  return t
}

function paint(size, fn) {
  const c = makeCanvas(size, size)
  const ctx = c.getContext('2d')
  const img = ctx.createImageData(size, size)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const [r, g, b] = fn(x, y, y * size + x)
      const i = (y * size + x) * 4
      img.data[i] = r
      img.data[i + 1] = g
      img.data[i + 2] = b
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return c
}

const cache = new Map()
function cached(key, fn) {
  if (!cache.has(key)) cache.set(key, fn())
  return cache.get(key)
}

// Near-white grain multiplied over the terrain's vertex colours.
export function terrainDetail() {
  return cached('terrain', () => {
    const size = 256
    const n = fractal(size, 11, 5, 4)
    const g = fractal(size, 23, 2, 32)
    return toTexture(
      paint(size, (x, y, i) => {
        const v = 0.78 + 0.22 * n[i] + (g[i] - 0.5) * 0.18
        const c = Math.max(0, Math.min(255, v * 255))
        return [c, c, c * 0.98]
      }),
    )
  })
}

export function concrete() {
  return cached('concrete', () => {
    const size = 256
    const n = fractal(size, 5, 5, 4)
    const s = fractal(size, 9, 3, 2)
    return toTexture(
      paint(size, (x, y, i) => {
        let v = 150 + 50 * (n[i] - 0.5) - Math.max(0, s[i] - 0.55) * 160
        // water stains running down from the top
        v -= Math.max(0, Math.sin(x * 0.11 + n[i] * 4) - 0.85) * 120 * (1 - y / size)
        const moss = Math.max(0, n[i] - 0.62) * 260
        return [v - moss * 0.4, v + moss * 0.1, v - moss * 0.5]
      }),
    )
  })
}

export function planks(tint = [120, 92, 62]) {
  return cached('planks' + tint.join(), () => {
    const size = 256
    const n = fractal(size, 7, 4, 4)
    const grain = fractal(size, 17, 2, 64)
    return toTexture(
      paint(size, (x, y, i) => {
        const board = Math.floor(y / 32)
        const seam = y % 32 < 2 ? 0.45 : 1
        const shade = 0.75 + 0.25 * ((board * 37) % 7) / 7
        const v = (0.7 + 0.3 * n[i]) * shade * seam * (0.85 + 0.3 * grain[(y * size + ((x * 4) % size)) % grain.length])
        return [tint[0] * v, tint[1] * v, tint[2] * v]
      }),
    )
  })
}

export function corrugated(tint = [150, 150, 140]) {
  return cached('corr' + tint.join(), () => {
    const size = 256
    const n = fractal(size, 3, 5, 4)
    const r = fractal(size, 41, 4, 8)
    return toTexture(
      paint(size, (x, y, i) => {
        const ridge = 0.8 + 0.2 * Math.sin((x / size) * Math.PI * 2 * 16)
        const rust = Math.max(0, r[i] - 0.45) * 2.2
        const v = ridge * (0.75 + 0.25 * n[i])
        return [
          (tint[0] * (1 - rust) + 150 * rust) * v,
          (tint[1] * (1 - rust) + 70 * rust) * v,
          (tint[2] * (1 - rust) + 35 * rust) * v,
        ]
      }),
    )
  })
}

export function paintedMetal(tint = [200, 120, 40]) {
  return cached('paint' + tint.join(), () => {
    const size = 128
    const n = fractal(size, 13, 4, 4)
    const r = fractal(size, 29, 4, 8)
    return toTexture(
      paint(size, (x, y, i) => {
        const chip = r[i] > 0.62 ? 1 : 0
        const v = 0.8 + 0.2 * n[i]
        return chip ? [110 * v, 60 * v, 30 * v] : [tint[0] * v, tint[1] * v, tint[2] * v]
      }),
    )
  })
}

// A soft round sprite for particles and glows.
export function softDot() {
  return cached('dot', () => {
    const c = makeCanvas(64, 64)
    const ctx = c.getContext('2d')
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.4, 'rgba(255,255,255,0.5)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 64, 64)
    return toTexture(c, { repeat: false })
  })
}

// Painted text on a plank or plate — signs around the preserve.
export function signTexture(lines, { bg = '#6b5236', fg = '#efe6c8', w = 512, h = 256 } = {}) {
  const c = makeCanvas(w, h)
  const ctx = c.getContext('2d')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)
  const rand = mulberry32(lines.join('').length * 977)
  for (let i = 0; i < 400; i++) {
    ctx.fillStyle = `rgba(0,0,0,${rand() * 0.15})`
    ctx.fillRect(rand() * w, rand() * h, rand() * 40, 2)
  }
  ctx.fillStyle = fg
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const size = Math.floor(h / (lines.length + 1))
  ctx.font = `bold ${size}px "Trebuchet MS", sans-serif`
  lines.forEach((ln, i) => ctx.fillText(ln, w / 2, (h / (lines.length + 1)) * (i + 1)))
  // weathering
  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = `rgba(40,30,20,${rand() * 0.35})`
    ctx.beginPath()
    ctx.arc(rand() * w, rand() * h, rand() * 14, 0, Math.PI * 2)
    ctx.fill()
  }
  return toTexture(c, { repeat: false })
}

// Dinosaur skin: dorsal colour wrapping to a pale belly (u runs round the
// body, 0 = spine, 0.5 = belly), pattern along v. The top strip (v > 0.95) is
// pure white so horns, teeth and eyes can show their own vertex colour.
export function skinTexture(colors, pattern, seed) {
  return cached('skin' + seed, () => {
    const size = 256
    const n = fractal(size, seed, 4, 4)
    const fine = fractal(size, seed + 3, 2, 32)
    const dor = new THREE.Color(colors.dorsal)
    const bel = new THREE.Color(colors.belly)
    const str = new THREE.Color(colors.stripe)
    const toB = (c) => [c.r * 255, c.g * 255, c.b * 255]
    // THREE.Color stores linear; convert back to sRGB for the canvas
    dor.convertLinearToSRGB()
    bel.convertLinearToSRGB()
    str.convertLinearToSRGB()
    const D = toB(dor)
    const B = toB(bel)
    const S = toB(str)
    return toTexture(
      paint(size, (x, y, i) => {
        if (y < size * 0.05) return [255, 255, 255] // canvas y=0 is texture v=1
        const u = x / size
        const v = 1 - y / size
        const around = Math.abs(u - 0.5) * 2 // 1 at spine, 0 at belly
        const belly = 1 - Math.min(1, Math.max(0, (around - 0.25) / 0.35))
        let col = [0, 1, 2].map((k) => D[k] * (1 - belly) + B[k] * belly)
        let mark = 0
        if (pattern === 'stripes') mark = Math.sin(v * 70 + n[i] * 6) > 0.35 ? 1 : 0
        else if (pattern === 'bands') mark = Math.sin(v * 34 + n[i] * 3) > 0.55 ? 1 : 0
        else if (pattern === 'spots') mark = fine[i] > 0.62 ? 1 : 0
        else mark = n[i] > 0.6 ? 0.7 : 0
        mark *= Math.max(0, around - 0.3) * 1.4
        col = col.map((c, k) => c * (1 - mark) + S[k] * mark)
        const grain = 0.88 + 0.24 * fine[i]
        return col.map((c) => Math.min(255, c * grain))
      }),
    )
  })
}
