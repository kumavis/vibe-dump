// wallpaper.js — "abstract_aqua_v3_by_sloshboy.jpg", live. Everything a 2004
// DeviantArt wallpaper needed: twisted bundles of light ribbons, an
// anamorphic lens flare, a sci-fi HUD ring, bokeh, a starfield, sparkle
// brushes. Ribbons render at 1x (they're soft); the crisp bits at DPR.

import { drawText } from './pixelfont.js'

const TAU = Math.PI * 2
const rand = (a, b) => a + Math.random() * (b - a)

const BUNDLES = [
  { y0: 0.7, slope: -0.42, amp: 0.1, freq: 0.75, ph: 0.3, n: 30, spread: 2.6, speed: 0.12, c: ['#22e6ff', '#ffffff', '#3d6bff'], a: 0.22 },
  { y0: 0.9, slope: -0.18, amp: 0.13, freq: 1.1, ph: 2.1, n: 24, spread: 3.2, speed: -0.09, c: ['#ff3cc8', '#ffd0f4', '#8a3dff'], a: 0.2 },
  { y0: 0.22, slope: 0.16, amp: 0.06, freq: 0.6, ph: 4.0, n: 16, spread: 2.0, speed: 0.07, c: ['#3dffb4', '#e8fffb', '#22a8ff'], a: 0.12 },
]

export class Wallpaper {
  constructor(res) {
    this.res = res
    this.glow = document.getElementById('wp-glow')
    this.fx = document.getElementById('wp-fx')
    this.stars = Array.from({ length: 140 }, () => ({ x: Math.random(), y: Math.random(), z: Math.random() }))
    this.sparks = Array.from({ length: 46 }, () => ({ x: Math.random(), y: Math.random() * 0.85, s: rand(1.5, 4.5), ph: rand(0, TAU), sp: rand(0.6, 2) }))
    this.bokeh = Array.from({ length: 26 }, () => ({
      x: Math.random(), y: Math.random(), r: rand(8, 46), vy: rand(-6, -2),
      c: ['120,220,255', '255,90,210', '255,255,255', '150,120,255'][(Math.random() * 4) | 0], a: rand(0.04, 0.12), ring: Math.random() < 0.4,
    }))
    this.resize()
  }

  resize() {
    const W = (this.W = innerWidth), H = (this.H = innerHeight)
    this.glow.width = W
    this.glow.height = H
    this.fx.width = Math.round(W * this.res)
    this.fx.height = Math.round(H * this.res)
    this.gctx = this.glow.getContext('2d')
    this.fctx = this.fx.getContext('2d')
    // HUD + flare anchors follow the layout's open spaces
    const tall = H > W
    this.hud = tall ? { x: W * 0.24, y: H * 0.76, r: Math.min(W, H) * 0.22 } : { x: Math.max(210, W * 0.19), y: H * 0.7, r: Math.min(120, H * 0.16) }
    this.flare = tall ? { x: W * 0.82, y: H * 0.08 } : { x: W * 0.8, y: H * 0.72 }
    // ribbon gradients only depend on the width
    this.grads = BUNDLES.map((b) => {
      const g = this.gctx.createLinearGradient(0, 0, W, 0)
      g.addColorStop(0, b.c[0])
      g.addColorStop(0.5, b.c[1])
      g.addColorStop(1, b.c[2])
      return g
    })
    // text that never changes is baked once, into canvases just big enough
    // for it, placed on whole device pixels so the blit is pixel-exact
    const res = this.res
    const bake = (x0, y0, w, h, paint) => {
      const dx = Math.floor(x0 * res), dy = Math.floor(y0 * res)
      const cv = document.createElement('canvas')
      cv.width = Math.max(1, Math.ceil((x0 + w) * res) - dx)
      cv.height = Math.max(1, Math.ceil((y0 + h) * res) - dy)
      const c = cv.getContext('2d')
      c.setTransform(res, 0, 0, res, -dx, -dy)
      paint(c)
      return { cv, dx, dy }
    }
    const { x, y, r } = this.hud
    this.still = [
      bake(x - 29, y - r * 0.2, 60, 8, (c) => drawText(c, 'LIQUID.SYS', x - 29, y - r * 0.2, { px: 1, color: 'rgba(140,230,255,0.75)' })),
      bake(x + r * 0.55, y + r * 1.12, 164, 19, (c) => {
        drawText(c, 'DUCK UPLINK ......... OK', x + r * 0.55, y + r * 1.12, { px: 1, color: 'rgba(140,230,255,0.45)' })
        drawText(c, 'GOO PRESSURE ...... 4.2 BAR', x + r * 0.55, y + r * 1.12 + 11, { px: 1, color: 'rgba(140,230,255,0.45)' })
      }),
      // the artist's signature, as every wallpaper had
      bake(W - 220, H - 40, 220, 40, (c) => {
        c.font = 'italic 600 15px "Brush Script MT", "Segoe Script", cursive'
        c.fillStyle = 'rgba(190,230,255,0.4)'
        c.textAlign = 'right'
        c.fillText('~ sloshboy 2004', W - 18, H - 16)
      }),
    ]
    this.frame = 0
    this.glowDt = 0
  }

  ribbon(ctx, b, g, t, W, H) {
    const steps = 64
    const yAt = (u, i) => {
      const twist = Math.cos(u * Math.PI * 1.3 + t * b.speed * 3 + b.ph)
      return H * (b.y0 + b.slope * u + b.amp * Math.sin(TAU * b.freq * u + b.ph + t * b.speed)) +
        (i - b.n / 2) * b.spread * (0.4 + 2.2 * twist * twist) * (H / 800)
    }
    // soft glow band under the bundle
    ctx.strokeStyle = g
    for (const [lw, a] of [[70, 0.035], [26, 0.06]]) {
      ctx.globalAlpha = a
      ctx.lineWidth = lw * (H / 800)
      ctx.beginPath()
      for (let s = 0; s <= steps; s++) {
        const u = s / steps
        const y = yAt(u, b.n / 2)
        s ? ctx.lineTo(u * W, y) : ctx.moveTo(u * W, y)
      }
      ctx.stroke()
    }
    ctx.lineWidth = 1
    for (let i = 0; i < b.n; i++) {
      ctx.globalAlpha = b.a * (0.35 + 0.65 * Math.sin((i / b.n) * Math.PI))
      ctx.beginPath()
      for (let s = 0; s <= steps; s++) {
        const u = s / steps
        const y = yAt(u, i)
        s ? ctx.lineTo(u * W, y) : ctx.moveTo(u * W, y)
      }
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  }

  // the soft layer drifts slowly enough to redraw at half rate
  render(t, dt) {
    this.glowDt += dt
    if ((this.frame++ & 1) === 0) {
      this.renderGlow(t, this.glowDt)
      this.glowDt = 0
    }
    this.renderFx(t, dt)
  }

  renderGlow(t, dt) {
    const { W, H, gctx: g } = this
    g.clearRect(0, 0, W, H)
    g.globalCompositeOperation = 'lighter'
    for (const b of this.bokeh) {
      b.y += (b.vy * dt) / H
      if (b.y < -0.1) { b.y = 1.1; b.x = Math.random() }
      const x = b.x * W, y = b.y * H
      if (b.ring) {
        g.strokeStyle = `rgba(${b.c},${b.a * 1.6})`
        g.lineWidth = 1.5
        g.beginPath()
        g.arc(x, y, b.r, 0, TAU)
        g.stroke()
        g.fillStyle = `rgba(${b.c},${b.a * 0.5})`
        g.fill()
      } else {
        const rg = g.createRadialGradient(x, y, 0, x, y, b.r)
        rg.addColorStop(0, `rgba(${b.c},${b.a})`)
        rg.addColorStop(0.7, `rgba(${b.c},${b.a * 0.7})`)
        rg.addColorStop(1, `rgba(${b.c},0)`)
        g.fillStyle = rg
        g.fillRect(x - b.r, y - b.r, b.r * 2, b.r * 2)
      }
    }
    BUNDLES.forEach((b, k) => this.ribbon(g, b, this.grads[k], t, W, H))
    // flare core + ghosts
    const fl = this.flare
    const pulse = 1 + Math.sin(t * 0.8) * 0.06
    let rg = g.createRadialGradient(fl.x, fl.y, 0, fl.x, fl.y, 220 * pulse)
    rg.addColorStop(0, 'rgba(255,255,255,0.75)')
    rg.addColorStop(0.08, 'rgba(180,240,255,0.45)')
    rg.addColorStop(0.35, 'rgba(60,140,255,0.12)')
    rg.addColorStop(1, 'rgba(60,140,255,0)')
    g.fillStyle = rg
    g.fillRect(fl.x - 230, fl.y - 230, 460, 460)
    const cx = W / 2, cy = H / 2
    for (const [k, r, col] of [[0.55, 26, '120,255,220'], [0.85, 54, '255,120,230'], [1.25, 16, '255,255,255'], [1.55, 80, '120,180,255']]) {
      const x = fl.x + (cx - fl.x) * k, y = fl.y + (cy - fl.y) * k
      rg = g.createRadialGradient(x, y, r * 0.6, x, y, r)
      rg.addColorStop(0, `rgba(${col},0.05)`)
      rg.addColorStop(0.9, `rgba(${col},0.1)`)
      rg.addColorStop(1, `rgba(${col},0)`)
      g.fillStyle = rg
      g.beginPath()
      g.arc(x, y, r, 0, TAU)
      g.fill()
    }
    g.globalCompositeOperation = 'source-over'
  }

  renderFx(t, dt) {
    const { W, H, fctx: f, res } = this
    const fl = this.flare
    let rg
    f.setTransform(res, 0, 0, res, 0, 0)
    f.clearRect(0, 0, W, H)
    f.globalCompositeOperation = 'lighter'
    // starfield drifting left, keygen style
    for (const s of this.stars) {
      s.x -= (0.004 + s.z * 0.02) * dt
      if (s.x < 0) { s.x = 1; s.y = Math.random() }
      f.fillStyle = `rgba(200,230,255,${0.15 + s.z * 0.5})`
      const sz = 0.6 + s.z * 1.1
      f.fillRect(s.x * W, s.y * H, sz * (1 + s.z * 2), sz)
    }
    // anamorphic streak + rays
    f.save()
    f.translate(fl.x, fl.y)
    f.scale(1, 0.018)
    rg = f.createRadialGradient(0, 0, 0, 0, 0, W * 0.5)
    rg.addColorStop(0, 'rgba(200,245,255,0.9)')
    rg.addColorStop(0.3, 'rgba(90,180,255,0.25)')
    rg.addColorStop(1, 'rgba(90,180,255,0)')
    f.fillStyle = rg
    f.fillRect(-W * 0.5, -W * 0.5, W, W)
    f.restore()
    f.save()
    f.translate(fl.x, fl.y)
    f.rotate(t * 0.03)
    for (let i = 0; i < 14; i++) {
      f.rotate(TAU / 14)
      f.fillStyle = `rgba(190,235,255,${i % 2 ? 0.05 : 0.09})`
      f.beginPath()
      f.moveTo(0, -1.2)
      f.lineTo(160 + (i % 3) * 70, 0)
      f.lineTo(0, 1.2)
      f.fill()
    }
    f.restore()
    // HUD ring
    this.drawHud(f, t)
    // sparkle brush
    for (const s of this.sparks) {
      const tw = Math.max(0, Math.sin(t * s.sp + s.ph))
      if (tw < 0.05) continue
      const x = s.x * W, y = s.y * H, L = s.s * (1 + tw * 2.5)
      f.globalAlpha = tw * 0.9
      f.fillStyle = '#ffffff'
      f.fillRect(x - L, y - 0.5, L * 2, 1)
      f.fillRect(x - 0.5, y - L, 1, L * 2)
      f.fillStyle = 'rgba(160,230,255,0.7)'
      f.fillRect(x - 1.5, y - 1.5, 3, 3)
    }
    f.globalAlpha = 1
    f.globalCompositeOperation = 'source-over'
    f.setTransform(1, 0, 0, 1, 0, 0)
    for (const { cv, dx, dy } of this.still) f.drawImage(cv, dx, dy)
  }

  drawHud(f, t) {
    const { x, y, r } = this.hud
    f.save()
    f.translate(x, y)
    f.strokeStyle = 'rgba(120,220,255,0.28)'
    f.lineWidth = 1
    f.beginPath()
    f.arc(0, 0, r, 0, TAU)
    f.stroke()
    f.beginPath()
    f.arc(0, 0, r * 0.42, 0, TAU)
    f.stroke()
    // ticks
    f.save()
    f.rotate(-t * 0.05)
    for (let i = 0; i < 72; i++) {
      f.rotate(TAU / 72)
      f.fillStyle = i % 6 === 0 ? 'rgba(140,230,255,0.55)' : 'rgba(140,230,255,0.22)'
      f.fillRect(r * 1.04, -0.6, i % 6 === 0 ? 10 : 5, 1.2)
    }
    f.restore()
    // dashed ring
    f.save()
    f.rotate(t * 0.15)
    f.setLineDash([3, 7])
    f.strokeStyle = 'rgba(255,120,230,0.35)'
    f.lineWidth = 2
    f.beginPath()
    f.arc(0, 0, r * 0.86, 0, TAU)
    f.stroke()
    f.restore()
    // thick arcs
    f.save()
    f.rotate(-t * 0.22)
    f.strokeStyle = 'rgba(80,200,255,0.18)'
    f.lineWidth = 7
    for (let k = 0; k < 3; k++) {
      f.beginPath()
      f.arc(0, 0, r * 0.68, (k * TAU) / 3, (k * TAU) / 3 + 1.3)
      f.stroke()
    }
    f.restore()
    // crosshair
    f.strokeStyle = 'rgba(120,220,255,0.2)'
    f.beginPath()
    f.moveTo(-r * 1.25, 0); f.lineTo(-r * 0.5, 0)
    f.moveTo(r * 0.5, 0); f.lineTo(r * 1.25, 0)
    f.moveTo(0, -r * 1.25); f.lineTo(0, -r * 0.5)
    f.moveTo(0, r * 0.5); f.lineTo(0, r * 1.25)
    f.stroke()
    const level = 96 + Math.sin(t * 0.7) * 3
    drawText(f, `${level.toFixed(1)}%`, -17, -r * 0.2 + 12, { px: 1, color: 'rgba(255,140,230,0.8)' })
    f.restore()
  }
}
