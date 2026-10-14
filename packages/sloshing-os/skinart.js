// skinart.js — paints Winamp-skin materials straight from SDFs, per pixel.
// Each part is a distance function plus a material; the bevel profile turns
// distance into a height field, the height field into normals, and normals
// into chrome (environment-mapped horizon), candy plastic (subsurface + hot
// spec), smoked glass or LCD. It runs once per skin at boot — after that a
// skin is a couple of cached bitmaps.

import { bounds } from './sdf.js'

const L = norm3(-0.45, -0.75, 0.62) // light from the top-left (y is down)

function norm3(x, y, z) {
  const l = Math.hypot(x, y, z)
  return [x / l, y / l, z / l]
}
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const mix = (a, b, t) => a + (b - a) * t

export function hex(h) {
  const v = parseInt(h.slice(1), 16)
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255]
}

// Chrome environment: bright sky over a hard dark horizon over warm ground —
// the airbrushed "liquid metal" every 2002 skin was made of.
function chromeEnv(rx, ry, out, tint, hz) {
  const h = ry - hz
  let r, g, b
  if (h < 0) {
    const t = Math.min(1, -h / 1.05)
    const k = Math.pow(t, 0.55)
    r = mix(0.97, 0.38, k); g = mix(0.99, 0.55, k); b = mix(1.0, 0.86, k)
    // a second, softer studio strip high up
    const s = Math.exp(-Math.pow((t - 0.62) / 0.07, 2)) * 0.35
    r += s; g += s; b += s
  } else {
    const t = Math.min(1, h / 1.0)
    const k = Math.pow(t, 0.7)
    r = mix(0.03, 0.58, k); g = mix(0.05, 0.55, k); b = mix(0.11, 0.6, k)
  }
  // side light streak
  const st = Math.exp(-Math.pow((rx + 0.55) / 0.08, 2)) * (h < 0 ? 0.25 : 0.12)
  out[0] = (r + st) * tint[0]
  out[1] = (g + st) * tint[1]
  out[2] = (b + st) * tint[2]
}

const ENV = [0, 0, 0]

export class Painter {
  constructor(w, h, res, margin = 0) {
    this.w = w
    this.h = h
    this.res = res
    this.m = margin
    this.W = Math.ceil((w + margin * 2) * res)
    this.H = Math.ceil((h + margin * 2) * res)
    this.buf = new Float32Array(this.W * this.H * 4) // premultiplied rgba
  }

  // Composite one part. mat: { type, color, bevel, recess, pillow, alpha, hz, ... }
  part(f, mat, bbox) {
    const { res, m, W, H, buf } = this
    const bev = mat.bevel ?? 6
    const type = mat.type ?? 'chrome'
    const tint = mat.color ?? [1, 1, 1]
    const pillow = mat.pillow ?? 0.9
    const alpha = mat.alpha ?? 1
    const hz = mat.hz ?? 0.1
    const sign = mat.recess ? -1 : 1
    const bb = bbox || this.box(f)
    const cx = (bb.x0 + bb.x1) / 2, cy = (bb.y0 + bb.y1) / 2
    const hw = Math.max(1, (bb.x1 - bb.x0) / 2), hh = Math.max(1, (bb.y1 - bb.y0) / 2)
    const i0 = Math.max(0, Math.floor((bb.x0 + m) * res) - 1)
    const i1 = Math.min(W - 1, Math.ceil((bb.x1 + m) * res) + 1)
    const j0 = Math.max(0, Math.floor((bb.y0 + m) * res) - 1)
    const j1 = Math.min(H - 1, Math.ceil((bb.y1 + m) * res) + 1)
    const e = 0.5
    const C = [0, 0, 0]
    const coarse = this.coarse(f, i0, i1, j0, j1)
    const band = bev + 1.5

    for (let j = j0; j <= j1; j++) {
      const y = (j + 0.5) / res - m
      for (let i = i0; i <= i1; i++) {
        const x = (i + 0.5) / res - m
        // SDFs are 1-Lipschitz: the coarse sample bounds this pixel's distance
        const d0 = coarse.at(i, j)
        if (d0 > coarse.r + 1) continue
        const d = d0 < -(band + coarse.r) ? -band - 1 : f(x, y)
        const cov = clamp01(0.5 - d * res)
        if (cov <= 0) continue
        const u = -d // depth inside, px
        let nx = 0, ny = 0
        if (u < bev + 1) {
          const gx = f(x + e, y) - f(x - e, y)
          const gy = f(x, y + e) - f(x, y - e)
          const gl = Math.sqrt(gx * gx + gy * gy) || 1
          const t = clamp01(u / bev)
          const q = 1 - t
          let s = q / Math.sqrt(Math.max(0.02, 1 - q * q))
          if (s > 5) s = 5
          s *= sign * (mat.bevelK ?? 1)
          nx = (gx / gl) * s
          ny = (gy / gl) * s
        }
        // pillow: a slow bulge over the whole face, so flat chrome still
        // sweeps from sky through horizon to ground
        nx += pillow * 0.35 * ((x - cx) / hw) * sign
        ny += pillow * ((y - cy) / hh) * sign
        const nl = Math.sqrt(nx * nx + ny * ny + 1)
        nx /= nl; ny /= nl
        const nz = 1 / nl
        // reflection of the view vector (0,0,1)
        const rx = 2 * nz * nx, ry = 2 * nz * ny, rz = 2 * nz * nz - 1
        const rl = rx * L[0] + ry * L[1] + rz * L[2]
        const dif = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2])
        const yrel = (y - bb.y0) / (bb.y1 - bb.y0)
        let a = alpha

        if (type === 'chrome') {
          chromeEnv(rx, ry, ENV, tint, hz)
          const sp = Math.pow(Math.max(0, rl), 50) * 1.2
          C[0] = ENV[0] + sp; C[1] = ENV[1] + sp; C[2] = ENV[2] + sp
        } else if (type === 'plastic') {
          const sp = Math.pow(Math.max(0, rl), 36) * 1.1 + Math.pow(Math.max(0, rl), 6) * 0.12
          const sub = 0.38 * yrel
          const k = 0.32 + 0.72 * dif + sub
          C[0] = tint[0] * k + sp; C[1] = tint[1] * k + sp; C[2] = tint[2] * k + sp
          // translucent bodies get denser at the rim
          if (u < bev) a = Math.min(1, a + (1 - u / bev) * 0.18)
        } else if (type === 'glass') {
          // smoked glass well: dark, a little lifted toward the bottom
          const k = 0.6 + 0.8 * yrel
          const sp = Math.pow(Math.max(0, rl), 30) * 0.9
          C[0] = tint[0] * k + sp; C[1] = tint[1] * k + sp; C[2] = tint[2] * k + sp
        } else if (type === 'lcd') {
          const scan = (j & 1) ? 0.9 : 1
          const k = (0.75 + 0.5 * (1 - yrel)) * scan
          const sp = Math.pow(Math.max(0, rl), 24) * 0.5
          C[0] = tint[0] * k + sp; C[1] = tint[1] * k + sp; C[2] = tint[2] * k + sp
        } else if (type === 'rubber') {
          const k = 0.45 + 0.6 * dif
          const sp = Math.pow(Math.max(0, rl), 12) * 0.25
          C[0] = tint[0] * k + sp; C[1] = tint[1] * k + sp; C[2] = tint[2] * k + sp
        }

        const A = a * cov
        const o = (j * W + i) * 4
        const keep = 1 - A
        buf[o] = clamp01(C[0]) * A + buf[o] * keep
        buf[o + 1] = clamp01(C[1]) * A + buf[o + 1] * keep
        buf[o + 2] = clamp01(C[2]) * A + buf[o + 2] * keep
        buf[o + 3] = A + buf[o + 3] * keep
      }
    }
    return this
  }

  // Glass shine for the front layer: only highlights, everything else clear.
  // A gloss sheet across the top third plus a hot fresnel rim on the bevel.
  shine(f, opts = {}) {
    const { res, m, W, H, buf } = this
    const bev = opts.bevel ?? 6
    const bb = this.box(f)
    const i0 = Math.max(0, Math.floor((bb.x0 + m) * res) - 1)
    const i1 = Math.min(W - 1, Math.ceil((bb.x1 + m) * res) + 1)
    const j0 = Math.max(0, Math.floor((bb.y0 + m) * res) - 1)
    const j1 = Math.min(H - 1, Math.ceil((bb.y1 + m) * res) + 1)
    const gh = (bb.y1 - bb.y0) * (opts.gloss ?? 0.42)
    const ga = opts.glossAlpha ?? 0.3
    const e = 0.5
    for (let j = j0; j <= j1; j++) {
      const y = (j + 0.5) / res - m
      for (let i = i0; i <= i1; i++) {
        const x = (i + 0.5) / res - m
        const d = f(x, y)
        const cov = clamp01(0.5 - d * res)
        if (cov <= 0) continue
        const u = -d
        let A = 0
        // gloss sheet with a curved lower edge
        const xr = (x - bb.x0) / (bb.x1 - bb.x0)
        const edge = bb.y0 + gh * (0.55 + 0.45 * Math.sin(xr * Math.PI))
        if (y < edge && u > 1.5) {
          const t = (y - bb.y0) / (edge - bb.y0)
          A = Math.max(A, ga * (1 - t) * (1 - t) * clamp01((edge - y) / 2))
        }
        if (u < bev) {
          const gx = f(x + e, y) - f(x - e, y)
          const gy = f(x, y + e) - f(x, y - e)
          const gl = Math.sqrt(gx * gx + gy * gy) || 1
          // rim catches light on the top-left inside edge
          const facing = clamp01(-(gx / gl) * L[0] - (gy / gl) * L[1])
          const t = 1 - u / bev
          A = Math.max(A, t * t * (0.18 + 0.75 * facing * facing))
        }
        A *= cov
        if (A <= 0) continue
        const o = (j * W + i) * 4
        const keep = 1 - A
        buf[o] = A + buf[o] * keep
        buf[o + 1] = A + buf[o + 1] * keep
        buf[o + 2] = A + buf[o + 2] * keep
        buf[o + 3] = A + buf[o + 3] * keep
      }
    }
    return this
  }

  // Distance samples on an 8-px lattice over a pixel range, for culling.
  coarse(f, i0, i1, j0, j1) {
    const { res, m } = this
    const c = 8 * res
    const cols = Math.ceil((i1 - i0 + 1) / c) + 1
    const rows = Math.ceil((j1 - j0 + 1) / c) + 1
    const d = new Float32Array(cols * rows)
    for (let b = 0; b < rows; b++) {
      for (let a = 0; a < cols; a++) {
        d[b * cols + a] = f((i0 + (a + 0.5) * c) / res - m, (j0 + (b + 0.5) * c) / res - m)
      }
    }
    return {
      r: (c / res) * 0.75,
      at: (i, j) => d[(((j - j0) / c) | 0) * cols + (((i - i0) / c) | 0)],
    }
  }

  box(f) {
    const m = this.m
    const b = bounds((x, y) => f(x - m, y - m), this.w + m * 2, this.h + m * 2, 3)
    return { x0: b.x0 - m, y0: b.y0 - m, x1: b.x1 - m, y1: b.y1 - m }
  }

  // Punch a part out (for holes that must show the desktop through).
  erase(f) {
    const { res, m, W, H, buf } = this
    for (let j = 0; j < H; j++) {
      const y = (j + 0.5) / res - m
      for (let i = 0; i < W; i++) {
        const x = (i + 0.5) / res - m
        const cov = clamp01(0.5 - f(x, y) * res)
        if (cov <= 0) continue
        const o = (j * W + i) * 4
        const k = 1 - cov
        buf[o] *= k; buf[o + 1] *= k; buf[o + 2] *= k; buf[o + 3] *= k
      }
    }
    return this
  }

  canvas() {
    const c = document.createElement('canvas')
    c.width = this.W
    c.height = this.H
    const ctx = c.getContext('2d')
    const img = ctx.createImageData(this.W, this.H)
    const b = this.buf, d = img.data
    for (let k = 0; k < b.length; k += 4) {
      const a = b[k + 3]
      if (a <= 0) continue
      d[k] = (b[k] / a) * 255
      d[k + 1] = (b[k + 1] / a) * 255
      d[k + 2] = (b[k + 2] / a) * 255
      d[k + 3] = a * 255
    }
    ctx.putImageData(img, 0, 0)
    return c
  }
}

// Wrap a painted body in a drop shadow and a neon halo.
export function withShadow(body, res, { blur = 26, dy = 14, color = 'rgba(0,0,12,0.6)', glow = null, glowBlur = 22 } = {}) {
  const c = document.createElement('canvas')
  c.width = body.width
  c.height = body.height
  const ctx = c.getContext('2d')
  const far = c.width + 50
  const shadowOnly = (col, b, oy) => {
    ctx.save()
    ctx.shadowColor = col
    ctx.shadowBlur = b * res
    ctx.shadowOffsetX = far
    ctx.shadowOffsetY = oy * res
    ctx.drawImage(body, -far, 0)
    ctx.restore()
  }
  if (glow) shadowOnly(glow, glowBlur, 0)
  shadowOnly(color, blur, dy)
  ctx.drawImage(body, 0, 0)
  return c
}
