// Generator previews: shaded relief and data layers written as PNGs, so the
// island's shape can be iterated on without a browser.
//
//   node tools/preview.mjs [outdir]

import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { writePNG } from './png.mjs'
import { cellSize } from '../src/gen/grid.js'

export function relief(h, N, opts = {}) {
  const { scale = 1, tint } = opts
  const rgb = new Uint8Array(N * N * 3)
  const dxM = cellSize(N) * 100
  const L = [-0.6, 0.55, -0.58] // light from the north-west, high-ish
  const ll = Math.hypot(...L)
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const c = j * N + i
      const hx = (h[j * N + Math.min(N - 1, i + 1)] - h[j * N + Math.max(0, i - 1)]) / (2 * dxM)
      const hz = (h[Math.min(N - 1, j + 1) * N + i] - h[Math.max(0, j - 1) * N + i]) / (2 * dxM)
      const nx = -hx * 1.6
      const nz = -hz * 1.6
      const nl = Math.hypot(nx, 1, nz)
      const shade = Math.max(0, (nx * L[0] + 1 * L[1] + nz * L[2]) / (nl * ll))
      let r, g, b
      const e = h[c]
      if (e <= 0) {
        const d = Math.min(1, -e / 60)
        r = 40 + 80 * (1 - d)
        g = 90 + 120 * (1 - d)
        b = 150 + 70 * (1 - d)
      } else {
        const t = Math.min(1, e / 1800)
        r = 90 + 120 * t
        g = 140 + 50 * t
        b = 80 + 100 * t
      }
      if (tint) {
        const tc = tint(c)
        if (tc) {
          r = r * (1 - tc[3]) + tc[0] * tc[3]
          g = g * (1 - tc[3]) + tc[1] * tc[3]
          b = b * (1 - tc[3]) + tc[2] * tc[3]
        }
      }
      const s = e > 0 ? 0.35 + 0.85 * shade : 1
      rgb[c * 3] = Math.min(255, r * s * scale)
      rgb[c * 3 + 1] = Math.min(255, g * s * scale)
      rgb[c * 3 + 2] = Math.min(255, b * s * scale)
    }
  }
  return rgb
}

export function ramp(v, N, lo, hi, log = false) {
  const rgb = new Uint8Array(N * N * 3)
  for (let c = 0; c < N * N; c++) {
    let t = log ? (Math.log(v[c]) - Math.log(lo)) / (Math.log(hi) - Math.log(lo)) : (v[c] - lo) / (hi - lo)
    t = Math.max(0, Math.min(1, t))
    // brown → yellow → green → teal → blue
    const stops = [
      [140, 90, 40],
      [220, 200, 90],
      [80, 170, 60],
      [30, 140, 140],
      [30, 60, 170],
    ]
    const f = t * (stops.length - 1)
    const k = Math.min(stops.length - 2, Math.floor(f))
    const u = f - k
    for (let ch = 0; ch < 3; ch++) rgb[c * 3 + ch] = stops[k][ch] * (1 - u) + stops[k + 1][ch] * u
  }
  return rgb
}

export function save(dir, name, N, rgb) {
  mkdirSync(dir, { recursive: true })
  writePNG(join(dir, name), N, N, rgb)
}
