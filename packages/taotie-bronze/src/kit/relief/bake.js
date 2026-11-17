// ReliefMap — a baked snapshot of a ReliefPanel, and the one source every
// consumer reads: geometry displacement (macro), shading (normalTexture) and
// corrosion (dataTexture). Because burial corrosion is driven by geometry —
// carbonates grow where water stands, in the leiwen grooves and against the
// motif walls, and handling polishes the arrises first — the patina masks are
// *derived* from the relief here rather than painted.

import * as THREE from 'three'

export class ReliefMap {
  /** Applied to textures built after it is set; the app raises it to the GPU max. */
  static anisotropy = 4

  constructor({ cols, rows, widthMM, heightMM, ppmm, data, groove, cavity }) {
    this.width = cols // pixels
    this.height = rows
    this.widthMM = widthMM
    this.heightMM = heightMM
    this.ppmm = ppmm
    this.data = data // Float32Array, mm, row 0 = bottom
    this.groove = groove || null // Float32Array 0..1
    this.cavityOpts = { small: 0.8, large: 4, kSmall: 0.3, kLarge: 0.9, kEdge: 0.12, ...cavity }
    let min = Infinity
    let max = -Infinity
    for (let i = 0; i < data.length; i++) {
      const v = data[i]
      if (v < min) min = v
      if (v > max) max = v
    }
    if (max - min < 1e-6) max = min + 1e-6
    this.min = min
    this.max = max
    this._tex = {}
    this._macro = new Map()
    this._channels = null
  }

  /** Bilinear height in mm at panel UV (0..1, v up). */
  sample(u, v) {
    return bilinear(this.data, this.width, this.height, u, v)
  }

  /** R: height normalised over [min,max]. Linear data, mip-mapped. */
  get heightTexture() {
    if (!this._tex.height) {
      const { data, min, max } = this
      const n = data.length
      const px = new Uint8Array(n * 4)
      const k = 255 / (max - min)
      for (let i = 0; i < n; i++) {
        const h = (data[i] - min) * k
        px[i * 4] = px[i * 4 + 1] = px[i * 4 + 2] = h
        px[i * 4 + 3] = 255
      }
      this._tex.height = this._texture(px)
    }
    return this._tex.height
  }

  /**
   * Tangent-space normal (+x along panel x/u, +y along panel y/v) from a Sobel
   * gradient measured in mm per mm, so a 1 mm wall over 0.5 mm reads as the
   * slope it really has.
   */
  get normalTexture() {
    if (!this._tex.normal) {
      const { data, width: w, height: h, ppmm } = this
      const px = new Uint8Array(w * h * 4)
      const s = ppmm / 8 // Sobel weights sum to 8 px of run
      for (let y = 0; y < h; y++) {
        const ym = y > 0 ? y - 1 : 0
        const yp = y < h - 1 ? y + 1 : h - 1
        for (let x = 0; x < w; x++) {
          const xm = x > 0 ? x - 1 : 0
          const xp = x < w - 1 ? x + 1 : w - 1
          const a = data[ym * w + xm], b = data[ym * w + x], c = data[ym * w + xp]
          const d = data[y * w + xm], f = data[y * w + xp]
          const g = data[yp * w + xm], hh = data[yp * w + x], k = data[yp * w + xp]
          const dx = (c + 2 * f + k - a - 2 * d - g) * s
          const dy = (g + 2 * hh + k - a - 2 * b - c) * s
          const il = 1 / Math.sqrt(dx * dx + dy * dy + 1)
          const o = (y * w + x) * 4
          px[o] = (0.5 - 0.5 * dx * il) * 255 + 0.5
          px[o + 1] = (0.5 - 0.5 * dy * il) * 255 + 0.5
          px[o + 2] = (0.5 + 0.5 * il) * 255 + 0.5
          px[o + 3] = 255
        }
      }
      this._tex.normal = this._texture(px)
    }
    return this._tex.normal
  }

  /** R height01 · G cavity · B edge/convexity · A groove. */
  get dataTexture() {
    if (!this._tex.data) {
      const { height01, cavity, edge, groove } = this.channels()
      const n = height01.length
      const px = new Uint8Array(n * 4)
      for (let i = 0; i < n; i++) {
        px[i * 4] = height01[i] * 255 + 0.5
        px[i * 4 + 1] = cavity[i] * 255 + 0.5
        px[i * 4 + 2] = edge[i] * 255 + 0.5
        px[i * 4 + 3] = groove[i] * 255 + 0.5
      }
      this._tex.data = this._texture(px)
    }
    return this._tex.data
  }

  /**
   * The derived masks as Float32Arrays (0..1). Cavity compares the field to two
   * blurred copies: the small one finds leiwen grooves and incised lines, the
   * large one the ground pockets between motif bands — the two scales at which
   * burial soil and carbonates actually collect.
   */
  channels() {
    if (this._channels) return this._channels
    const { data, width: w, height: h, ppmm, min, max } = this
    const o = this.cavityOpts
    const n = w * h
    const bs = blur(data, w, h, Math.max(1, Math.round(o.small * ppmm)))
    const bl = blur(data, w, h, Math.max(1, Math.round(o.large * ppmm)))
    const height01 = new Float32Array(n)
    const cavity = new Float32Array(n)
    const edge = new Float32Array(n)
    const groove = new Float32Array(n)
    const k = 1 / (max - min)
    for (let i = 0; i < n; i++) {
      const v = data[i]
      height01[i] = (v - min) * k
      const ds = v - bs[i]
      const dl = v - bl[i]
      cavity[i] = clamp01(1 - Math.max(0, -ds) / o.kSmall - Math.max(0, -dl) / o.kLarge)
      edge[i] = clamp01(ds / o.kEdge)
      groove[i] = this.groove ? this.groove[i] : 0
    }
    this._channels = { height01, cavity, edge, groove }
    return this._channels
  }

  /**
   * A low-passed copy for geometric displacement on a mesh whose vertices are
   * `sizeMM` apart. Fine leiwen must not alias into the mesh; it lives in the
   * normal map. Returns { cols, rows, data, sample(u, v) } (mm).
   */
  macro(sizeMM) {
    const key = sizeMM.toFixed(3)
    let m = this._macro.get(key)
    if (m) return m
    const { data, width: w, height: h, ppmm } = this
    const step = Math.max(1, Math.round(sizeMM * ppmm))
    const cols = Math.max(2, Math.ceil(w / step))
    const rows = Math.max(2, Math.ceil(h / step))
    let out = new Float32Array(cols * rows)
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let sum = 0
        let cnt = 0
        const ye = Math.min(h, (y + 1) * step)
        const xe = Math.min(w, (x + 1) * step)
        for (let yy = y * step; yy < ye; yy++) {
          for (let xx = x * step; xx < xe; xx++) {
            sum += data[yy * w + xx]
            cnt++
          }
        }
        out[y * cols + x] = sum / cnt
      }
    }
    if (step > 1) out = blur(out, cols, rows, 1, 1)
    m = { cols, rows, sizeMM, data: out, sample: (u, v) => bilinear(out, cols, rows, u, v) }
    this._macro.set(key, m)
    return m
  }

  setAnisotropy(n) {
    for (const t of Object.values(this._tex)) {
      t.anisotropy = n
      t.needsUpdate = true
    }
  }

  dispose() {
    for (const t of Object.values(this._tex)) t.dispose()
    this._tex = {}
  }

  _texture(px) {
    const t = new THREE.DataTexture(px, this.width, this.height, THREE.RGBAFormat, THREE.UnsignedByteType)
    // data, not colour: no sRGB decode
    t.colorSpace = THREE.NoColorSpace
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
    t.magFilter = THREE.LinearFilter
    t.minFilter = THREE.LinearMipmapLinearFilter
    t.generateMipmaps = true
    t.anisotropy = ReliefMap.anisotropy
    t.needsUpdate = true
    return t
  }
}

/** ReliefPanel → ReliefMap. Arrays are copied, so the panel may keep drawing. */
export function bakeRelief(panel, opts = {}) {
  return new ReliefMap({
    cols: panel.cols,
    rows: panel.rows,
    widthMM: panel.width,
    heightMM: panel.height,
    ppmm: panel.ppmm,
    data: Float32Array.from(panel.field),
    groove: Float32Array.from(panel.groove),
    cavity: opts.cavity,
  })
}

function clamp01(x) {
  return x < 0 ? 0 : x > 1 ? 1 : x
}

function bilinear(data, w, h, u, v) {
  const x = Math.min(Math.max(u * w - 0.5, 0), w - 1)
  const y = Math.min(Math.max(v * h - 0.5, 0), h - 1)
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const x1 = Math.min(x0 + 1, w - 1)
  const y1 = Math.min(y0 + 1, h - 1)
  const fx = x - x0
  const fy = y - y0
  const a = data[y0 * w + x0] + (data[y0 * w + x1] - data[y0 * w + x0]) * fx
  const b = data[y1 * w + x0] + (data[y1 * w + x1] - data[y1 * w + x0]) * fx
  return a + (b - a) * fy
}

/** Separable box blur, `passes` times (3 ≈ Gaussian). Edges clamp. */
export function blur(src, w, h, r, passes = 3) {
  let a = Float32Array.from(src)
  let b = new Float32Array(src.length)
  const line = new Float32Array(Math.max(w, h))
  for (let p = 0; p < passes; p++) {
    boxH(a, b, w, h, r, line)
    boxV(b, a, w, h, r, line)
  }
  return a
}

function boxH(src, dst, w, h, r, line) {
  const inv = 1 / (2 * r + 1)
  for (let y = 0; y < h; y++) {
    const row = y * w
    let acc = src[row] * (r + 1)
    for (let i = 1; i <= r; i++) acc += src[row + Math.min(i, w - 1)]
    for (let x = 0; x < w; x++) {
      line[x] = acc * inv
      acc += src[row + Math.min(x + r + 1, w - 1)] - src[row + Math.max(x - r, 0)]
    }
    dst.set(line.subarray(0, w), row)
  }
}

function boxV(src, dst, w, h, r, line) {
  const inv = 1 / (2 * r + 1)
  for (let x = 0; x < w; x++) {
    let acc = src[x] * (r + 1)
    for (let i = 1; i <= r; i++) acc += src[Math.min(i, h - 1) * w + x]
    for (let y = 0; y < h; y++) {
      line[y] = acc * inv
      acc += src[Math.min(y + r + 1, h - 1) * w + x] - src[Math.max(y - r, 0) * w + x]
    }
    for (let y = 0; y < h; y++) dst[y * w + x] = line[y]
  }
}
