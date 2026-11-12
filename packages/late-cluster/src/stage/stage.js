// The stage: one 16:9 canvas (logical 1280×720, letterboxed in its container, DPR-aware and capped),
// drawn every frame from a Show: set (world coords) → segment back layer → puppets (costume, head
// occluder, 3D head, collar) in depth order → set front → audience → segment front layer → chrome →
// chimera's glow pass. Heads are rendered by one shared WebGL renderer (engine/heads.js).
import { GLHeads } from '../engine/heads.js'
import { Glow, label, labelBlock, occlude, rectPath, panel as drawPanel, P } from '../kit/draw.js'
import { buildSet, drawSetBack, drawSetFront, drawAudience, drawSignOverlay, drawInstrument, drawProp, WORLD } from './set.js'
import { drawCostume } from './costumes.js'
import { caption, chyron, laughCaption, builtCounter, disclaimer } from './chrome.js'
import { tvFrame, ticker } from '../kit/props.js'
import { clamp, unlerp, noise1, hash01 } from '../kit/ease.js'
import { lookFor } from '../looks.js'
import { CAST } from '../cast.js'

export const W = 1280, H = 720
const MAX_TILE = 1100

export class Stage {
  constructor(canvas, wrap) {
    this.canvas = canvas
    this.wrap = wrap
    this.ctx = canvas.getContext('2d', { alpha: false })
    this.gl = new GLHeads()
    this.glow = new Glow(2.2, 0.8, 4)
    this.S = buildSet()
    this.maxDpr = Math.min(2, window.devicePixelRatio || 1)
    this.k = 1
    this.glowOn = true
    this.stats = { ms: 0, frames: 0, heads: 0, quality: 0 }
    this._slow = 0
    this._fast = 0
    this.resize()
    new ResizeObserver(() => this.resize()).observe(wrap)
  }

  resize() {
    const b = this.wrap.getBoundingClientRect()
    let cw = b.width, ch = (b.width * 9) / 16
    if (ch > b.height) {
      ch = b.height
      cw = (ch * 16) / 9
    }
    cw = Math.max(16, Math.floor(cw))
    ch = Math.max(9, Math.floor(ch))
    const c = this.canvas
    c.style.width = cw + 'px'
    c.style.height = ch + 'px'
    c.style.left = Math.floor((b.width - cw) / 2) + 'px'
    c.style.top = Math.floor((b.height - ch) / 2) + 'px'
    const dpr = Math.min(this.maxDpr, window.devicePixelRatio || 1)
    const bw = Math.min(2560, Math.round(cw * dpr))
    const bh = Math.round((bw * 9) / 16)
    if (c.width !== bw || c.height !== bh) {
      c.width = bw
      c.height = bh
    }
    this.k = bw / W
    this.css = { w: cw, h: ch, x: Math.floor((b.width - cw) / 2), y: Math.floor((b.height - ch) / 2) }
  }

  /** adapt quality to frame time (ms of our own work per frame) */
  budget(ms) {
    const s = this.stats
    s.ms = s.ms ? s.ms * 0.95 + ms * 0.05 : ms
    s.frames++
    if (s.frames < 90) return
    if (s.ms > 19) this._slow++
    else this._slow = 0
    if (s.ms < 9) this._fast++
    else this._fast = 0
    if (this._slow > 45) {
      this._slow = 0
      s.frames = 0
      if (this.maxDpr > 1.01) {
        this.maxDpr = Math.max(1, this.maxDpr - 0.25)
        this.resize()
      } else if (this.glowOn) this.glowOn = false
      s.quality--
      console.info(`stage: frame time ${s.ms.toFixed(1)} ms → dpr ${this.maxDpr}, glow ${this.glowOn}`)
    } else if (this._fast > 240 && (this.maxDpr < Math.min(2, window.devicePixelRatio || 1) || !this.glowOn)) {
      this._fast = 0
      s.frames = 0
      if (!this.glowOn) this.glowOn = true
      else {
        this.maxDpr = Math.min(window.devicePixelRatio || 1, this.maxDpr + 0.25)
        this.resize()
      }
      s.quality++
    }
  }

  /** stage units */
  screen() {
    this.ctx.setTransform(this.k, 0, 0, this.k, 0, 0)
  }

  /** world units through the show's camera */
  worldT(cam) {
    const k = this.k, z = cam.zoom
    this.ctx.setTransform(k * z, 0, 0, k * z, k * (640 - cam.x * z), k * (360 - cam.y * z))
  }

  /**
   * Draw a frame of `show`. o: { overlay(ctx) (stage units, after chrome), captions: bool }
   */
  draw(show, o = {}) {
    const ctx = this.ctx
    const t = show.t
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // ---- set, back
    this.worldT(show.cam)
    drawSetBack(ctx, this.S, show)
    // push the set back a little: the heads are the stars
    const dim = (show.setNow ?? show.set).dim ?? 0.34
    if (dim > 0) {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.globalAlpha = dim
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
      ctx.globalAlpha = 1
    }
    // ---- the ots graphics panel's frame, then the segment's back layer
    this.screen()
    if (show.panel && show.module.autoPanel !== false) drawPanel(ctx, show.panel, { color: P.sky, appear: 1 })
    this.call(show, 'drawBack', ctx)
    for (const m of show.monitors) tvFrame(ctx, m.rect.x, m.rect.y, m.rect.w, m.rect.h, { ...m, t })

    // ---- puppets
    const ps = [...show.puppets.values()].filter((p) => p.visible && p.screen && p.head)
    ps.sort((a, b) => (a.place.z ?? 0) - (b.place.z ?? 0) || a.screen.y - b.screen.y)
    this.stats.heads = ps.length
    for (const p of ps) this.drawPuppet(show, p)
    this.screen()
    for (const m of show.monitors) tvFrame.glass(ctx, m.rect.x, m.rect.y, m.rect.w, m.rect.h, { ...m, t })

    // ---- set, front
    this.worldT(show.cam)
    drawSetFront(ctx, this.S, show)
    this.screen()
    drawAudience(ctx, this.S, show, show.audience)
    this.call(show, 'drawFront', ctx)

    // ---- chrome
    const lane = show.layout?.lane
    if (lane?.text) ticker(ctx, lane.y, lane.text, t, { tag: lane.tag, color: P.coral })
    if (show.builtNow) builtCounter(ctx, show.builtNow, t)
    const disc = show.disclaimerNow
    if (disc) disclaimer(ctx, disc.text, disc.alpha)
    for (const c of show._frame.chyrons) {
      const id = c.spec.id
      const spec = id ? { name: show.puppets.get(id)?.name ?? CAST[id]?.name ?? id, title: CAST[id]?.title, handle: CAST[id]?.handle ?? lookFor(id).handle, color: lookFor(id).color, parody: !!CAST[id]?.guest, ...c.spec } : c.spec
      const inU = unlerp(c.from, c.from + 0.6, t), outU = unlerp(c.to - 0.5, c.to, t)
      if (t >= c.from && t <= c.to) chyron(ctx, spec, inU, outU, (show.captionNow && (o.captions ?? true) ? 478 : 560) - (lane?.text ? 46 : 0))
    }
    const signVisible = this.signInFrame(show)
    if (!signVisible) drawSignOverlay(ctx, show)
    if (o.captions ?? true) {
      // the captions rise above a ticker lane or the disclaimer footer
      const lift = Math.max(lane?.text ? 46 : 0, disc ? 34 * disc.alpha : 0)
      if (show.captionNow) caption(ctx, show.captionNow, lift)
      else if (show.laughing > 0.05) laughCaption(ctx, show.signText === 'APPLAUSE' ? 'APPLAUSE' : 'LAUGHTER', show.laughing, lift)
    }
    if (o.overlay) o.overlay(ctx)

    // ---- no WebGL: say so on the stage
    if (!this.gl.ok) {
      occlude(ctx, rectPath(340, 300, 600, 80), '#000', 0.85)
      labelBlock(ctx, this.gl.failed ? 'THE HEADS NEED WEBGL, WHICH THIS BROWSER HAS TURNED OFF.' : 'RECONNECTING THE HEADS…', 640, 340, 560, { size: 16, align: 'center', color: P.amber, ls: 0.12 })
    }

    if (this.glowOn) this.glow.apply(this.canvas, ctx, this.k)
  }

  signInFrame(show) {
    if ((show.setNow ?? show.set).sign === false) return false
    const [x0, y0] = show.toScreen(970 - 125, 64)
    const [x1, y1] = show.toScreen(970 + 125, 110)
    return x1 > 40 && x0 < 1240 && y0 > -10 && y1 < 720
  }

  call(show, name, ctx) {
    const fn = show.module[name]
    if (!fn) return
    ctx.save()
    try {
      fn.call(show.module, ctx, show.t, show)
    } catch (e) {
      show._warn(`${name}() threw: ${e?.message ?? e}`)
      console.error(e)
    }
    ctx.restore()
    this.screen()
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
    ctx.filter = 'none'
  }

  drawPuppet(show, p) {
    const fx = p.fx
    const clip = p.place.clip
    if (!fx) {
      if (clip) this.clipped(clip, () => this.paintPuppet(this.ctx, show, p, true))
      else this.paintPuppet(this.ctx, show, p, true)
      this.drawExtras(show, p)
      return
    }
    // effects: paint the puppet into its own layer, treat the layer, composite it
    const L = this.layer()
    const lc = L.getContext('2d')
    lc.setTransform(1, 0, 0, 1, 0, 0)
    lc.globalCompositeOperation = 'source-over'
    lc.globalAlpha = 1
    lc.clearRect(0, 0, L.width, L.height)
    lc.setTransform(this.k, 0, 0, this.k, 0, 0)
    const holo = fx.kind === 'hologram'
    this.paintPuppet(lc, show, p, !holo)
    const k = this.k
    const { x, y, size } = p.screen
    const t = show.t
    const seed = p.id.length * 7
    // scanlines
    lc.setTransform(1, 0, 0, 1, 0, 0)
    lc.globalCompositeOperation = 'destination-out'
    lc.globalAlpha = (fx.scan ?? (holo ? 0.55 : 0.35))
    lc.fillStyle = '#000'
    const step = Math.max(2, Math.round(3 * k)), off = holo ? Math.floor(t * 40) % step : 0
    const y0 = Math.max(0, Math.floor((y - size) * k)), y1 = Math.min(L.height, Math.ceil((y + size * 1.6) * k))
    for (let yy = y0 + off; yy < y1; yy += step) lc.fillRect(0, yy, L.width, Math.max(1, step * 0.45))

    // how much is there: amount × flicker (pure functions of t)
    let a = fx.amount ?? 1
    if (holo) {
      const fl = fx.flicker ?? 0.5
      const n = noise1(t * 9, seed)
      a *= 1 - fl * 0.35 * (0.5 + 0.5 * n)
      if (fl > 0 && hash01(Math.floor(t * 12), seed) < 0.04 * fl) a *= 0.25 // a dropout
      a *= 0.78
    } else a *= fx.kind === 'monitor' ? 0.92 : 1
    const ctx = this.ctx
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    if (clip) {
      ctx.beginPath()
      ctx.rect(clip.x * k, clip.y * k, clip.w * k, clip.h * k)
      ctx.clip()
    }
    ctx.globalCompositeOperation = holo ? 'lighter' : 'source-over'
    ctx.globalAlpha = Math.max(0, Math.min(1, a))
    // tint (blacks stay black): a monochrome wash towards the tint's hue
    if (holo || fx.tint) ctx.filter = tintFilter(fx.tint ?? '#7fc8ff')
    const gl = holo ? (fx.glitch ?? 1) * (hash01(Math.floor(t * 7), seed + 3) < 0.18 ? 1 : 0) : 0
    if (gl) {
      // a glitch: horizontal bands slip sideways
      const bands = 7
      const by0 = (y - size * 0.6) * k, bh = (size * 2.2 * k) / bands
      ctx.drawImage(L, 0, 0, L.width, by0, 0, 0, L.width, by0)
      for (let i = 0; i < bands; i++) {
        const sy = by0 + i * bh, dx = (hash01(i + Math.floor(t * 7) * 13, seed) - 0.5) * 26 * k
        ctx.drawImage(L, 0, sy, L.width, bh, dx, sy, L.width, bh)
      }
      ctx.drawImage(L, 0, by0 + bands * bh, L.width, L.height - by0 - bands * bh, 0, by0 + bands * bh, L.width, L.height - by0 - bands * bh)
    } else ctx.drawImage(L, 0, 0)
    ctx.restore()
    this.drawExtras(show, p)
  }

  /** an offscreen layer the size of the stage canvas (for puppet effects) */
  layer() {
    if (!this._layer) this._layer = document.createElement('canvas')
    const L = this._layer
    if (L.width !== this.canvas.width || L.height !== this.canvas.height) {
      L.width = this.canvas.width
      L.height = this.canvas.height
    }
    return L
  }

  clipped(r, fn) {
    const ctx = this.ctx
    ctx.save()
    ctx.beginPath()
    ctx.rect(r.x, r.y, r.w, r.h)
    ctx.clip()
    try {
      fn()
    } finally {
      ctx.restore()
      this.screen()
    }
  }

  /** instruments and props that belong to a puppet's spot (world units) */
  drawExtras(show, p) {
    const ctx = this.ctx
    if (p.place.instrument) {
      this.worldT(show.cam)
      drawInstrument(ctx, p.place.instrument, p.place.x, p.place.y, show, p.id)
      this.screen()
    }
    if (p.look.prop && !p.place.clip) {
      this.worldT(show.cam)
      drawProp(ctx, p.look.prop, p.place.x + (p.propParams?.side ?? p.look.propSide ?? -1) * 150 * (p.place.scale ?? 1), p.place.y, show, p.propParams ?? {})
      this.screen()
    }
  }

  /** costume back → the head's dark silhouette → the head (additively) → costume front */
  paintPuppet(ctx, show, p, occludeHead) {
    const { x, y, size } = p.screen
    const head = p.head
    const ox = x - size / 2, oy = y - size / 2
    // the costume hangs from the neck
    const nk = head.neck()
    const u = nk.cm * (p.look.bodyScale ?? 0.66)
    const nx = ox + nk.x, ny = oy + nk.y
    const floorY = p.place.floor != null ? show.toScreen(0, p.place.floor)[1] : null
    const turn = Math.cos(p.az) * 0.75
    const anchor = {
      x: nx,
      y: ny,
      u,
      turn,
      sway: p.tilt * 0.6,
      breathe: p.breathe,
      t: show.t,
      bottom: ((p.place.seat != null ? Math.min(H + 40, show.toScreen(0, p.place.seat)[1]) : H + 40) - ny) / u,
      floor: floorY != null ? (floorY - ny) / u : null,
      speaking: p.speaking,
      look: p.look,
      noFill: !occludeHead,
    }
    const costume = p.look.costume
    drawCostume(ctx, 'back', anchor, costume)
    if (occludeHead) {
      const hull = head.hull()
      if (hull.length >= 6) {
        const path = new Path2D()
        const cx = size / 2, cy = size / 2
        for (let i = 0; i < hull.length; i += 2) {
          const hx = ox + cx + (hull[i] - cx) * 1.02, hy = oy + cy + (hull[i + 1] - cy) * 1.02
          i ? path.lineTo(hx, hy) : path.moveTo(hx, hy)
        }
        path.closePath()
        occlude(ctx, path, '#000', 0.94)
      }
    }
    if (this.gl.ok) {
      const k = this.k
      const px = Math.min(MAX_TILE, size * k)
      const src = this.gl.render(head, px)
      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.globalCompositeOperation = 'lighter'
      ctx.imageSmoothingEnabled = true
      ctx.drawImage(this.gl.canvas, src[0], src[1], src[2], src[3], ox * k, oy * k, size * k, size * k)
      ctx.restore()
    }
    drawCostume(ctx, 'front', anchor, costume)
  }
}

const tintCache = new Map()
/** a CSS filter that washes a picture towards a colour's hue (sepia sits near 38°) */
function tintFilter(hex) {
  let f = tintCache.get(hex)
  if (!f) {
    const v = parseInt(hex.slice(1), 16)
    const r = ((v >> 16) & 255) / 255, g = ((v >> 8) & 255) / 255, b = (v & 255) / 255
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn
    let h = 0
    if (d > 0) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4
    h = (h * 60 + 360) % 360
    f = `grayscale(1) sepia(1) saturate(2.6) hue-rotate(${Math.round(h - 38)}deg) brightness(1.15)`
    tintCache.set(hex, f)
  }
  return f
}
