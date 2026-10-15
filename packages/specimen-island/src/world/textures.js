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

// Paint that has been left out in the jungle for a decade: rust blooms eat
// through the colour, streak down from the edges and pit what is left.
export function rustedPaint(tint = [84, 104, 70]) {
  return cached('rusted' + tint.join(), () => {
    const size = 256
    const n = fractal(size, 61, 5, 4)
    const bloom = fractal(size, 67, 4, 3)
    const pit = fractal(size, 71, 2, 48)
    const streak = fractal(size, 73, 3, 16)
    return toTexture(
      paint(size, (x, y, i) => {
        const fade = 0.72 + 0.28 * n[i] // sun-bleached, uneven
        let c = [tint[0] * fade, tint[1] * fade, tint[2] * fade]
        // rust runs down: sample the streak field stretched vertically
        const run = streak[(Math.floor(y / 6) * size + x) % streak.length]
        const r = Math.max(0, Math.min(1, (bloom[i] - 0.5) * 4.5 + (run - 0.55) * 2.2 + (pit[i] > 0.7 ? 0.6 : 0)))
        const rust = [120 + 60 * n[i], 58 + 30 * n[i], 28 + 12 * n[i]]
        c = c.map((v, k) => v * (1 - r) + rust[k] * r)
        const dirt = 0.82 + 0.18 * pit[i]
        return c.map((v) => v * dirt)
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

// Painted text on a plank or plate — signs around the preserve. The first line
// is the title and the rest are smaller. Every line is measured: the board
// widens to fit (within limits), then a line that still does not fit inside
// the margins shrinks, and wraps onto two lines rather than shrinking to
// nothing. Returns the texture and the board size in metres.
const SIGN_FONT = '"Trebuchet MS", "Segoe UI", sans-serif'
const SIGN_PX = 240 // texels per metre of board
export function signBoard(lines, { bg = '#6b5236', fg = '#efe6c8', minWidth = 1.6, maxWidth = 3.4, minHeight = 0.85, maxHeight = 1.5 } = {}) {
  const probe = makeCanvas(8, 8).getContext('2d')
  const measure = (text, size) => {
    probe.font = `bold ${size}px ${SIGN_FONT}`
    return probe.measureText(text).width
  }
  const mx = 0.1 * SIGN_PX
  const my = 0.09 * SIGN_PX
  const nominal = (i) => (i === 0 ? 0.3 : 0.17) * SIGN_PX
  // widen the board for the widest line at its nominal size
  const want = Math.max(...lines.map((ln, i) => measure(ln, nominal(i)))) / SIGN_PX + 0.2
  const width = Math.min(maxWidth, Math.max(minWidth, want))
  const avail = width * SIGN_PX - 2 * mx
  // fit each line: shrink, or wrap at the space nearest the middle
  const rows = []
  lines.forEach((ln, i) => {
    const size = nominal(i)
    const w = measure(ln, size)
    if (w <= avail) return rows.push({ text: ln, size })
    const fit = (size * avail) / w
    const spaces = [...ln.matchAll(/ /g)].map((m) => m.index)
    if (fit < size * 0.72 && spaces.length) {
      const cut = spaces.reduce((b, k) => (Math.abs(k - ln.length / 2) < Math.abs(b - ln.length / 2) ? k : b))
      const parts = [ln.slice(0, cut), ln.slice(cut + 1)]
      const s2 = Math.min(size * 0.9, ...parts.map((t) => (size * 0.9 * avail) / Math.max(1, measure(t, size * 0.9))))
      for (const t of parts) rows.push({ text: t, size: s2 })
    } else rows.push({ text: ln, size: Math.floor(fit) })
  })
  // the board grows to hold the rows, then everything scales to fit it
  const lead = 1.18
  const textH = rows.reduce((a, r) => a + r.size * lead, 0)
  const height = Math.min(maxHeight, Math.max(minHeight, (textH + 2 * my) / SIGN_PX + 0.1))
  const hpx = Math.round(height * SIGN_PX)
  const wpx = Math.round(width * SIGN_PX)
  const k = Math.min(1, (hpx - 2 * my) / textH)
  for (const r of rows) r.size = Math.floor(r.size * k)

  const c = makeCanvas(wpx, hpx)
  const ctx = c.getContext('2d')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, wpx, hpx)
  const rand = mulberry32(lines.join('').length * 977)
  for (let i = 0; i < (400 * wpx) / 512; i++) {
    ctx.fillStyle = `rgba(0,0,0,${rand() * 0.15})`
    ctx.fillRect(rand() * wpx, rand() * hpx, rand() * 40, 2)
  }
  // a painted border, a hand's width in from the edge
  ctx.strokeStyle = fg
  ctx.globalAlpha = 0.55
  ctx.lineWidth = 4
  ctx.strokeRect(mx * 0.45, my * 0.45, wpx - mx * 0.9, hpx - my * 0.9)
  ctx.globalAlpha = 1
  ctx.fillStyle = fg
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const used = rows.reduce((a, r) => a + r.size * lead, 0)
  let y = (hpx - used) / 2
  for (const r of rows) {
    ctx.font = `bold ${r.size}px ${SIGN_FONT}`
    ctx.fillText(r.text, wpx / 2, y + (r.size * lead) / 2, avail)
    y += r.size * lead
  }
  // weathering
  for (let i = 0; i < (60 * wpx) / 512; i++) {
    ctx.fillStyle = `rgba(40,30,20,${rand() * 0.35})`
    ctx.beginPath()
    ctx.arc(rand() * wpx, rand() * hpx, rand() * 14, 0, Math.PI * 2)
    ctx.fill()
  }
  return { texture: toTexture(c, { repeat: false }), width, height, rows }
}

// The field lab's pad: weathered concrete, a yellow ring and a white H.
export function helipad() {
  return cached('helipad', () => {
    const rand = mulberry32(61)
    const c = makeCanvas(512, 512)
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#7a7a74'
    ctx.fillRect(0, 0, 512, 512)
    for (let i = 0; i < 3000; i++) {
      ctx.fillStyle = `rgba(${rand() < 0.5 ? '40,40,30' : '200,200,190'},${rand() * 0.12})`
      ctx.fillRect(rand() * 512, rand() * 512, rand() * 6, rand() * 6)
    }
    ctx.strokeStyle = '#d8c850'
    ctx.lineWidth = 18
    ctx.beginPath()
    ctx.arc(256, 256, 210, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = '#e8e4d8'
    ctx.fillRect(160, 130, 50, 252)
    ctx.fillRect(302, 130, 50, 252)
    ctx.fillRect(160, 230, 192, 50)
    // grime and cracks
    ctx.strokeStyle = 'rgba(30,30,20,0.5)'
    ctx.lineWidth = 2
    for (let i = 0; i < 14; i++) {
      ctx.beginPath()
      let x = rand() * 512
      let y = rand() * 512
      ctx.moveTo(x, y)
      for (let k = 0; k < 6; k++) ctx.lineTo((x += (rand() - 0.5) * 60), (y += (rand() - 0.5) * 60))
      ctx.stroke()
    }
    return toTexture(c, { repeat: false })
  })
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
