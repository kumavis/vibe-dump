// ReliefPanel — the 2D height field of one mould section.
//
// A Shang founder carved décor into clay mould sections: motifs were cut as
// flat-topped bands with steep, softly rounded walls, eyes were scooped as
// domes, and line work was incised with a stylus. Each of those is a distance
// profile measured from a drawn outline, so the panel's one primitive is:
// "fill some paths → signed distance to their outline → profile → combine".
//
// Field layout: Float32Array, row-major, row 0 = panel bottom (y = 0 mm),
// values in mm above the ground. Same orientation as THREE.DataTexture, so a
// baked map needs no flip.

import { createCanvas, context2d } from '../util/canvas.js'
import { signedDistance } from './edt.js'
import { Rng } from '../util/rng.js'
import { bakeRelief } from './bake.js'
import { leiwenFill } from './leiwen.js'

const PROBE_MAX = 1024 // longest side of the low-res pass that finds a draw's bounding box
const MARGIN_PX = 4 // antialias + gradient stencil around a mask's bbox

/**
 * Cross-section profiles: (s, w) → 0..1, where s is the distance inside the
 * drawn outline in mm and w the shoulder width (or radius) in mm.
 * Add your own here or pass a function as `opts.profile`.
 */
export const PROFILES = {
  // Flat top, steep wall rounding over into the top: the wall is steep at the
  // foot (the mould was cut vertically) and the arris is softened (the wax/clay
  // model was burnished, and the casting skin rounds any knife edge).
  plateau(s, w) {
    if (s <= 0) return 0
    if (s >= w) return 1
    const t = 1 - s / w
    return 1 - t * t * Math.sqrt(t)
  },
  // spherical cap: eyeballs and bosses were scooped with a round tool
  dome(s, w) {
    if (s <= 0) return 0
    const t = Math.min(s / w, 1)
    return Math.sqrt(1 - (1 - t) * (1 - t))
  },
  // rounded crest along the medial axis: thread relief, raised lines
  ridge(s, w) {
    if (s <= 0) return 0
    const t = Math.min(s / w, 1)
    return 1 - (1 - t) * (1 - t)
  },
  // round-bottomed groove (a stylus with a rounded tip)
  u(s, w) {
    if (s <= 0) return 0
    const t = Math.min(s / w, 1)
    return Math.sqrt(1 - (1 - t) * (1 - t))
  },
  // knife cut
  v(s, w) {
    if (s <= 0) return 0
    return Math.min(s / w, 1)
  },
}

// Profiles whose natural width is "all the way to the medial axis"
const WIDTH_IS_MAX = new Set(['dome', 'ridge', 'v'])

export class ReliefPanel {
  /** Default `maxSize` (px per side) when a caller passes none. */
  static maxSize = 4096
  /** Hard cap on any panel side, even an explicit maxSize: the app lowers it on phones. */
  static maxSizeCap = Infinity

  /**
   * @param {{width:number,height:number,ppmm?:number,maxSize?:number,seed?:number}} o
   *   width/height in mm; ppmm pixels per mm (clamped so neither side exceeds maxSize)
   */
  constructor({ width, height, ppmm = 8, maxSize = ReliefPanel.maxSize, seed = 1 } = {}) {
    if (!(width > 0 && height > 0)) throw new Error('ReliefPanel: width and height (mm) required')
    this.width = width
    this.height = height
    maxSize = Math.min(maxSize, ReliefPanel.maxSizeCap)
    this.ppmm = Math.min(ppmm, maxSize / width, maxSize / height)
    this.cols = Math.max(2, Math.round(width * this.ppmm))
    this.rows = Math.max(2, Math.round(height * this.ppmm))
    // pixels are square; recompute ppmm from the rounded grid so mm ↔ px is exact in x
    this.ppmm = this.cols / width
    this.field = new Float32Array(this.cols * this.rows)
    this.groove = new Float32Array(this.cols * this.rows) // 0..1: inside a sunk line
    this.seed = seed
    this.rng = new Rng(seed)
    this.stats = { ops: 0, ms: 0 }
    this._canvas = null
    this._probeCanvas = null
  }

  // ---------------------------------------------------------------- drawing

  /** Raise a region: field = max(field, height·profile). Motif plateaus, bosses. */
  raise(draw, { height = 1.2, shoulder, profile = 'plateau' } = {}) {
    const fn = this._profile(profile)
    this._apply(draw, profile, shoulder, 0.5, (i, p) => {
      const v = height * p
      if (v > this.field[i]) this.field[i] = v
    }, fn)
    return this
  }

  /** Cut into the current surface: field -= depth·profile. Incised lines, leiwen grooves. */
  sink(draw, { depth = 0.5, shoulder, profile = 'u' } = {}) {
    const fn = this._profile(profile)
    this._apply(draw, profile, shoulder, 0.25, (i, p) => {
      this.field[i] -= depth * p
      if (p > this.groove[i]) this.groove[i] = p
    }, fn)
    return this
  }

  /** Stand on top of what is there: field += height·profile. Thread relief on a plateau. */
  add(draw, { height = 0.3, shoulder, profile = 'ridge' } = {}) {
    const fn = this._profile(profile)
    this._apply(draw, profile, shoulder, 0.25, (i, p) => {
      this.field[i] += height * p
    }, fn)
    return this
  }

  /**
   * Coverage of the drawn paths without touching the field.
   * @returns {{data: Float32Array, cols: number, rows: number, ppmm: number}} full-panel, row 0 = bottom
   */
  mask(draw) {
    const out = new Float32Array(this.cols * this.rows)
    const r = this._rasterize(draw)
    if (r) {
      const { cov, x0, y0, bw, bh } = r
      for (let y = 0; y < bh; y++) {
        const fy = y0 + y
        if (fy < 0 || fy >= this.rows) continue
        for (let x = 0; x < bw; x++) {
          const fx = x0 + x
          if (fx < 0 || fx >= this.cols) continue
          out[fy * this.cols + fx] = cov[y * bw + x]
        }
      }
    }
    return { data: out, cols: this.cols, rows: this.rows, ppmm: this.ppmm }
  }

  /**
   * Pack leiwen into the ground.
   * @param leiwenOpts see leiwen.js
   * @param {{avoid?: 'raised'|{data:Float32Array}|null, margin?: number, rect?: {x,y,w,h}}} o
   */
  fillGround(leiwenOpts = {}, { avoid = 'raised', margin = 0.6, rect } = {}) {
    return leiwenFill(this, { rect: rect ?? { x: 0, y: 0, w: this.width, h: this.height }, avoid, margin }, leiwenOpts)
  }

  /**
   * Bilateral symmetry: copy the left half of `rect` (default: whole panel)
   * onto its right half. Taotie are drawn as half masks and mirrored, exactly
   * as the mould carver worked to a centre line.
   */
  mirrorX(rect) {
    const { cols, field, groove } = this
    const r = rect ?? { x: 0, y: 0, w: this.width, h: this.height }
    const x0 = Math.max(0, Math.round(r.x * this.ppmm))
    const x1 = Math.min(cols, Math.round((r.x + r.w) * this.ppmm))
    const y0 = Math.max(0, Math.round(r.y * this.ppmm))
    const y1 = Math.min(this.rows, Math.round((r.y + r.h) * this.ppmm))
    const half = (x1 - x0) >> 1
    for (let y = y0; y < y1; y++) {
      const row = y * cols
      for (let i = 0; i < half; i++) {
        field[row + x1 - 1 - i] = field[row + x0 + i]
        groove[row + x1 - 1 - i] = groove[row + x0 + i]
      }
    }
    return this
  }

  /** Height in mm at panel coordinates (nearest pixel). */
  heightAt(xmm, ymm) {
    const x = Math.min(this.cols - 1, Math.max(0, Math.floor(xmm * this.ppmm)))
    const y = Math.min(this.rows - 1, Math.max(0, Math.floor(ymm * this.ppmm)))
    return this.field[y * this.cols + x]
  }

  /** Snapshot the field into a ReliefMap (textures, cavity, macro). */
  bake(opts = {}) {
    return bakeRelief(this, opts)
  }

  // ------------------------------------------------------------- internals

  _profile(profile) {
    if (typeof profile === 'function') return profile
    const fn = PROFILES[profile]
    if (!fn) throw new Error(`ReliefPanel: unknown profile "${profile}"`)
    return fn
  }

  _apply(draw, profileName, shoulder, defaultShoulder, combine, fn) {
    const t0 = performance.now()
    const r = this._rasterize(draw)
    if (!r) return
    const { cov, x0, y0, bw, bh } = r
    const sd = signedDistance(cov, bw, bh)
    const inv = 1 / this.ppmm
    let w = shoulder ?? (WIDTH_IS_MAX.has(profileName) ? null : defaultShoulder)
    if (w == null) {
      // width "to the medial axis": the deepest inside point of this draw
      let m = 0
      for (let i = 0; i < sd.length; i++) if (sd[i] > m) m = sd[i]
      w = Math.max(m * inv, 1e-3)
    }
    const { cols, rows } = this
    for (let y = 0; y < bh; y++) {
      const fy = y0 + y
      if (fy < 0 || fy >= rows) continue
      for (let x = 0; x < bw; x++) {
        const fx = x0 + x
        if (fx < 0 || fx >= cols) continue
        const s = sd[y * bw + x]
        if (s <= 0) continue
        combine(fy * cols + fx, fn(s * inv, w))
      }
    }
    this.stats.ops++
    this.stats.ms += performance.now() - t0
  }

  /**
   * Run `draw` once against a low-res probe (recording every call), find the
   * bounding box of what it painted, then replay the recording at full
   * resolution into a canvas the size of that box only. Recording rather than
   * calling draw twice keeps draw functions free to consume randomness.
   */
  _rasterize(draw) {
    const { cols, rows, ppmm } = this
    const scale = Math.max(1, Math.ceil(Math.max(cols, rows) / PROBE_MAX))
    const pw = Math.ceil(cols / scale)
    const ph = Math.ceil(rows / scale)
    if (!this._probeCanvas) this._probeCanvas = createCanvas(pw, ph)
    const probe = this._probeCanvas
    probe.width = pw
    probe.height = ph
    const pctx = context2d(probe)
    resetContext(pctx)
    pctx.setTransform(ppmm / scale, 0, 0, -ppmm / scale, 0, rows / scale)
    const ops = []
    draw(recorder(pctx, ops))
    if (!ops.length) return null

    const img = pctx.getImageData(0, 0, pw, ph).data
    let minX = pw, minY = ph, maxX = -1, maxY = -1
    for (let y = 0; y < ph; y++) {
      const row = y * pw * 4
      for (let x = 0; x < pw; x++) {
        if (img[row + x * 4 + 3] !== 0) {
          if (x < minX) minX = x
          if (x > maxX) maxX = x
          if (y < minY) minY = y
          if (y > maxY) maxY = y
        }
      }
    }
    if (maxX < 0) return null
    // probe rows run top-down; convert to field pixels (row 0 = bottom)
    const x0 = Math.max(-MARGIN_PX, minX * scale - MARGIN_PX - scale)
    const x1 = Math.min(cols + MARGIN_PX, (maxX + 1) * scale + MARGIN_PX + scale)
    const yTop = minY * scale - MARGIN_PX - scale // canvas row of bbox top
    const yBot = (maxY + 1) * scale + MARGIN_PX + scale
    const y0 = Math.max(-MARGIN_PX, rows - yBot) // field row of bbox bottom
    const y1 = Math.min(rows + MARGIN_PX, rows - yTop)
    const bw = x1 - x0
    const bh = y1 - y0

    if (!this._canvas) this._canvas = createCanvas(bw, bh)
    const cv = this._canvas
    cv.width = bw
    cv.height = bh
    const ctx = context2d(cv)
    resetContext(ctx)
    // mm → canvas px: cx = x·ppmm − x0 ; cy = y1 − y·ppmm
    ctx.setTransform(ppmm, 0, 0, -ppmm, -x0, y1)
    replay(ctx, ops)
    const data = ctx.getImageData(0, 0, bw, bh).data
    const cov = new Float32Array(bw * bh)
    for (let r = 0; r < bh; r++) {
      const src = r * bw * 4
      const dst = (bh - 1 - r) * bw
      for (let x = 0; x < bw; x++) cov[dst + x] = data[src + x * 4 + 3] / 255
    }
    return { cov, x0, y0, bw, bh }
  }
}

function resetContext(ctx) {
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = 1
  ctx.fillStyle = '#fff'
  ctx.strokeStyle = '#fff'
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.miterLimit = 4
  ctx.lineWidth = 1
}

/**
 * A pass-through proxy that records every method call and property write.
 * Draw functions must not call setTransform/resetTransform (they would undo
 * the mm scaling); use save/translate/rotate/scale/restore instead.
 */
function recorder(ctx, ops) {
  return new Proxy(ctx, {
    get(t, k) {
      const v = t[k]
      if (typeof v === 'function') {
        return (...args) => {
          ops.push([k, args])
          return v.apply(t, args)
        }
      }
      return v
    },
    set(t, k, v) {
      ops.push([k, v, true])
      t[k] = v
      return true
    },
  })
}

function replay(ctx, ops) {
  for (const op of ops) {
    if (op[2]) ctx[op[0]] = op[1]
    else ctx[op[0]](...op[1])
  }
}
