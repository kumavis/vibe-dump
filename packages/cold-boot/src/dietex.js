// Procedural die artwork. Every block of the floorplan is painted with the
// texture its circuitry really has under a microscope: standard-cell logic is a
// fine noisy weave of cell rows, SRAM is a dead-regular grid of bitcell arrays
// split into sub-arrays by decoder spines, PHYs are rows of identical lane
// slices with big analog structures, and the GPU is a tiled array of execution
// units. The geometry comes from the floorplan; only the fill is invented.
//
// It rasterises straight into a pixel buffer: the same picture through
// canvas fillRect() is millions of calls and takes over a minute under a
// software renderer.

import { rng } from './util.js'

function hsl2rgb(h, s, l) {
  h = (((h % 360) + 360) % 360) / 360
  s /= 100
  l /= 100
  const k = (n) => (n + h * 12) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return [f(0) * 255, f(8) * 255, f(4) * 255]
}

const C = {
  base: [20, 16, 38],
  sram: [34, 50, 94],
  sramLine: [58, 82, 150],
  sramHi: [86, 113, 192],
  sramGutter: [26, 31, 61],
  phy: [61, 47, 24],
  phyLine: [160, 122, 52],
  phyDark: [90, 69, 32],
  phyHi: [226, 180, 92],
  gpu: [20, 48, 44],
  gpuCell: [31, 74, 66],
  ring: [141, 134, 214],
  ringBg: [33, 28, 64],
  moat: [5, 3, 14],
  seal: [138, 122, 74],
}

class Raster {
  constructor(W, H) {
    this.W = W
    this.H = H
    this.d = new Uint8ClampedArray(W * H * 4)
    for (let i = 3; i < this.d.length; i += 4) this.d[i] = 255
  }
  // Alpha-blended rectangle fill; coordinates are clipped and rounded.
  rect(x, y, w, h, c, a = 1) {
    const x0 = Math.max(0, Math.round(x))
    const y0 = Math.max(0, Math.round(y))
    const x1 = Math.min(this.W, Math.round(x + w))
    const y1 = Math.min(this.H, Math.round(y + h))
    if (x1 <= x0 || y1 <= y0) return
    const d = this.d
    const r = c[0]
    const g = c[1]
    const b = c[2]
    if (a >= 1) {
      for (let yy = y0; yy < y1; yy++) {
        let i = (yy * this.W + x0) * 4
        for (let xx = x0; xx < x1; xx++, i += 4) {
          d[i] = r
          d[i + 1] = g
          d[i + 2] = b
        }
      }
    } else {
      const ia = 1 - a
      for (let yy = y0; yy < y1; yy++) {
        let i = (yy * this.W + x0) * 4
        for (let xx = x0; xx < x1; xx++, i += 4) {
          d[i] = d[i] * ia + r * a
          d[i + 1] = d[i + 1] * ia + g * a
          d[i + 2] = d[i + 2] * ia + b * a
        }
      }
    }
  }
  stroke(x, y, w, h, c, t = 1, a = 1) {
    this.rect(x, y, w, t, c, a)
    this.rect(x, y + h - t, w, t, c, a)
    this.rect(x, y, t, h, c, a)
    this.rect(x + w - t, y, t, h, c, a)
  }
  // Multiply a region by smooth low-frequency brightness noise — placement
  // density, metal fill, the slight colour drift a real die photo has.
  mottle(x, y, w, h, r, amt = 0.25, scale = 60, hueShift = null) {
    const gx = Math.max(2, Math.ceil(w / scale) + 2)
    const gy = Math.max(2, Math.ceil(h / scale) + 2)
    const grid = new Float32Array(gx * gy)
    for (let i = 0; i < grid.length; i++) grid[i] = r()
    const tint = hueShift ? new Float32Array(gx * gy).map(() => r()) : null
    const x0 = Math.max(0, Math.round(x))
    const y0 = Math.max(0, Math.round(y))
    const x1 = Math.min(this.W, Math.round(x + w))
    const y1 = Math.min(this.H, Math.round(y + h))
    const d = this.d
    for (let yy = y0; yy < y1; yy++) {
      const fy = (yy - y) / scale
      const iy = Math.floor(fy)
      const ty = fy - iy
      const sy = ty * ty * (3 - 2 * ty)
      for (let xx = x0; xx < x1; xx++) {
        const fx = (xx - x) / scale
        const ix = Math.floor(fx)
        const tx = fx - ix
        const sx = tx * tx * (3 - 2 * tx)
        const k = iy * gx + ix
        const v = (grid[k] * (1 - sx) + grid[k + 1] * sx) * (1 - sy) + (grid[k + gx] * (1 - sx) + grid[k + gx + 1] * sx) * sy
        const m = 1 + (v - 0.5) * 2 * amt
        const i = (yy * this.W + xx) * 4
        if (tint) {
          const t = (tint[k] * (1 - sx) + tint[k + 1] * sx) * (1 - sy) + (tint[k + gx] * (1 - sx) + tint[k + gx + 1] * sx) * sy
          const w2 = (t - 0.5) * hueShift
          d[i] = d[i] * m * (1 + w2)
          d[i + 1] = d[i + 1] * m
          d[i + 2] = d[i + 2] * m * (1 - w2)
        } else {
          d[i] *= m
          d[i + 1] *= m
          d[i + 2] *= m
        }
      }
    }
  }
}

// Standard-cell logic: rows of cells of random width and slightly varied tone,
// plus the odd hard macro (a register file, a small SRAM).
function logic(R, x, y, w, h, r, hsl, opts = {}) {
  const [hh, ss, ll] = hsl
  const rowH = opts.rowH || Math.max(2, Math.min(w, h) / 70)
  // Pre-compute a small palette for this block — per-cell colour picks from it.
  const pal = []
  for (let i = 0; i < 12; i++) pal.push(hsl2rgb(hh + (r() - 0.5) * 22, ss, Math.max(4, ll + (r() - 0.5) * 12)))
  R.rect(x, y, w, h, hsl2rgb(hh, ss, Math.max(3, ll - 7)))
  for (let yy = y; yy < y + h; yy += rowH) {
    let xx = x
    while (xx < x + w) {
      const cw = rowH * (0.7 + r() * 4.5)
      R.rect(xx, yy, Math.min(cw, x + w - xx) - 0.6, rowH - 0.7, pal[(r() * pal.length) | 0])
      xx += cw
    }
  }
  R.mottle(x, y, w, h, r, opts.mottle ?? 0.28, Math.max(20, Math.min(w, h) / 3), 0.25)
  const macros = opts.macros ?? Math.round((w * h) / 26000)
  for (let i = 0; i < macros; i++) {
    const mw = w * (0.08 + r() * 0.16)
    const mh = h * (0.06 + r() * 0.14)
    sram(R, x + r() * (w - mw), y + r() * (h - mh), mw, mh, r, { cols: 1 + ((r() * 2) | 0), rows: 1, tone: 0.8 })
  }
}

// SRAM: sub-arrays of bitcells (fine stripes), separated by decoder/sense-amp
// gutters. `cols`/`rows` = how many sub-arrays.
function sram(R, x, y, w, h, r, opts = {}) {
  const cols = opts.cols || Math.max(1, Math.round(w / 60))
  const rows = opts.rows || Math.max(1, Math.round(h / 60))
  const tone = opts.tone ?? 1
  R.rect(x, y, w, h, C.sramGutter)
  const gx = Math.max(1, w * 0.035)
  const gy = Math.max(1, h * 0.035)
  const cw = (w - gx * (cols + 1)) / cols
  const ch = (h - gy * (rows + 1)) / rows
  const step = Math.max(2, Math.min(cw, ch) / 22)
  const base = C.sram.map((v) => v * tone)
  const line = C.sramLine.map((v) => v * tone)
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const sx = x + gx + i * (cw + gx)
      const sy = y + gy + j * (ch + gy)
      R.rect(sx, sy, cw, ch, base)
      if (opts.vertical) for (let xx = sx; xx < sx + cw; xx += step) R.rect(xx, sy, step * 0.5, ch, line)
      else for (let yy = sy; yy < sy + ch; yy += step) R.rect(sx, yy, cw, step * 0.5, line)
      // word-line drivers down the middle of each sub-array
      if (opts.vertical) R.rect(sx, sy + ch / 2 - step, cw, step * 1.2, C.sramHi, 0.35 * tone)
      else R.rect(sx + cw / 2 - step, sy, step * 1.2, ch, C.sramHi, 0.35 * tone)
    }
  }
  R.mottle(x, y, w, h, r, 0.12, Math.max(30, Math.min(w, h) / 2))
}

// PHY: `lanes` identical slices along the long axis, each with a big analog
// structure (driver / ESD / decap) and a bump of bright metal.
function phy(R, x, y, w, h, r, opts = {}) {
  const vertical = opts.vertical ?? h > w
  const L = vertical ? h : w
  const T = vertical ? w : h
  const lanes = opts.lanes || Math.max(4, Math.round(L / Math.max(10, T * 0.55)))
  R.rect(x, y, w, h, C.phy)
  const step = L / lanes
  const rect = (u, v, du, dv, c, a) => (vertical ? R.rect(x + v, y + u, dv, du, c, a) : R.rect(x + u, y + v, du, dv, c, a))
  for (let i = 0; i < lanes; i++) {
    const a = i * step
    rect(a + step * 0.08, T * 0.06, step * 0.84, T * 0.18, C.phyLine)
    rect(a + step * 0.12, T * 0.3, step * 0.76, T * 0.34, C.phyDark)
    rect(a + step * 0.3, T * 0.36, step * 0.4, T * 0.2, C.phyHi)
    rect(a + step * 0.1, T * 0.72, step * 0.8, T * 0.2, [255, 220, 150], 0.18)
    rect(a, 0, Math.max(1, step * 0.04), T, [0, 0, 0], 0.35)
  }
  R.mottle(x, y, w, h, r, 0.12, 40)
}

// GPU: a tiled array of execution units, each a register file (SRAM) + ALUs.
function gpu(R, x, y, w, h, r, opts = {}) {
  R.rect(x, y, w, h, C.gpu)
  const cols = opts.cols || 8
  const rows = opts.rows || 4
  const pad = Math.min(w, h) * 0.04
  const cw = (w - pad * 2) / cols
  const ch = (h - pad * 2) / rows
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const cx = x + pad + i * cw
      const cy = y + pad + j * ch
      R.rect(cx + cw * 0.06, cy + ch * 0.06, cw * 0.88, ch * 0.88, C.gpuCell)
      sram(R, cx + cw * 0.12, cy + ch * 0.12, cw * 0.36, ch * 0.76, r, { cols: 1, rows: 2, tone: 0.8 })
      logic(R, cx + cw * 0.52, cy + ch * 0.12, cw * 0.36, ch * 0.76, r, [168, 40, 22], { macros: 0, mottle: 0.15 })
    }
  }
}

function ringBus(R, x, y, w, h) {
  R.rect(x, y, w, h, C.ringBg)
  const vertical = h > w
  const n = 6
  for (let i = 0; i < n; i++) {
    if (vertical) R.rect(x + (w * (i + 0.5)) / n - 0.6, y, 1.2, h, C.ring)
    else R.rect(x, y + (h * (i + 0.5)) / n - 0.6, w, 1.2, C.ring)
  }
}

// One core or cluster from sub-blocks normalised inside its rect.
function internals(R, X, Y, W, H, subs, r, mirror) {
  for (const s of subs) {
    let sx = s.x
    let sy = s.y
    if (mirror?.x) sx = 1 - s.x - s.w
    if (mirror?.y) sy = 1 - s.y - s.h
    const x = X + sx * W
    const y = Y + sy * H
    const w = s.w * W
    const h = s.h * H
    const k = `${s.kind || ''} ${s.id || ''}`.toLowerCase()
    if (/\bl2\b|l1|cache|sram|\brf\b|tlb|btb|uop/.test(k)) {
      const ar = w / Math.max(1, h)
      sram(R, x, y, w, h, r, { cols: Math.max(1, Math.round(ar * 2)), rows: Math.max(1, Math.round(2 / Math.max(0.5, ar))), tone: /l2/.test(k) ? 1 : 0.85, vertical: h > w * 1.5 })
    } else if (/fp|vec|simd|avx/.test(k)) logic(R, x, y, w, h, r, [208, 36, 24])
    else if (/int|alu|exec/.test(k)) logic(R, x, y, w, h, r, [282, 32, 25])
    else if (/fe|front|decode|fetch/.test(k)) logic(R, x, y, w, h, r, [236, 30, 26])
    else if (/mem|load|store|lsu/.test(k)) logic(R, x, y, w, h, r, [200, 26, 22])
    else if (/core/.test(k)) logic(R, x, y, w, h, r, [190, 34, 23])
    else logic(R, x, y, w, h, r, [272, 34, 26])
    R.stroke(x, y, w, h, [0, 0, 0], 1, 0.45)
  }
}

// Paint the whole die. `fp` is the floorplan, `W`x`H` the canvas size.
export function paintDie(fp, W, H) {
  const R = new Raster(W, H)
  const r = rng(0xd1e)
  // Background "glue" logic everywhere first — anything the floorplan doesn't
  // claim is still full of wiring, buffers and fill.
  logic(R, 0, 0, W, H, r, [250, 22, 14], { macros: 0, rowH: 3 })

  const px = (b) => [b.x * W, b.y * H, b.w * W, b.h * H]
  const order = ['other', 'misc_io', 'system_agent', 'pmu', 'ring', 'llc_slice', 'imc', 'imc_common', 'ddr_phy', 'ddr_phy_channel', 'ddr_phy_common', 'pcie_ctrl', 'pcie_ctrl_cluster', 'pcie_phy', 'pcie_phy_unit', 'dmi', 'display', 'display_phy', 'display_phy_port', 'display_pll', 'fivr', 'media', 'igpu', 'gpu_unslice', 'thunderbolt', 'ecore_cluster', 'pcore']
  const blocks = [...fp.blocks].sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind))
  const pInt = fp.core_internals?.pcore
  const eInt = fp.core_internals?.ecore_cluster
  const moat = Math.max(2, W / 1100)
  for (const b of blocks) {
    const [x, y, w, h] = px(b)
    switch (b.kind) {
      case 'pcore':
        if (pInt?.length) internals(R, x, y, w, h, pInt, r, b.mirror)
        else logic(R, x, y, w, h, r, [272, 34, 26])
        break
      case 'ecore_cluster':
        if (eInt?.length) internals(R, x, y, w, h, eInt, r, b.mirror)
        else logic(R, x, y, w, h, r, [196, 40, 22])
        break
      case 'llc_slice':
        sram(R, x, y, w, h, r, { cols: b.w * W > b.h * H ? 4 : 2, rows: b.w * W > b.h * H ? 2 : 4 })
        break
      case 'ring':
        ringBus(R, x, y, w, h)
        break
      case 'ddr_phy':
      case 'ddr_phy_channel':
      case 'pcie_phy':
      case 'pcie_phy_unit':
      case 'display_phy':
      case 'display_phy_port':
      case 'dmi':
      case 'thunderbolt':
        phy(R, x, y, w, h, r, { lanes: b.lanes || b.units })
        break
      case 'igpu':
        gpu(R, x, y, w, h, r, { cols: b.cols || (w > h ? 8 : 4), rows: b.rows || (w > h ? 4 : 8) })
        break
      case 'media':
        logic(R, x, y, w, h, r, [176, 34, 20])
        break
      case 'imc':
        logic(R, x, y, w, h, r, [30, 34, 20])
        break
      case 'pcie_ctrl':
        logic(R, x, y, w, h, r, [262, 40, 24])
        break
      case 'display':
        logic(R, x, y, w, h, r, [150, 26, 20])
        break
      default:
        logic(R, x, y, w, h, r, [240, 26, 20])
    }
    // Block boundary: a thin dark moat, like the keep-out between macros.
    R.stroke(x, y, w, h, C.moat, moat, 0.85)
  }
  // Seal ring + scribe line around the edge of the die.
  const t = Math.max(3, W / 700)
  R.stroke(W * 0.002, H * 0.004, W * 0.996, H * 0.992, C.seal, t)
  R.stroke(W * 0.006, H * 0.012, W * 0.988, H * 0.976, [200, 180, 120], 1, 0.35)

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  ctx.putImageData(new ImageData(R.d, W, H), 0, 0)
  return canvas
}
