// goobar.js — the taskbar is a slab of goo hanging off the top of the screen.
// Task pills, the start orb and the tray float embedded in it; its underside
// is a live wave that skins splash when they're flung into the top edge; and
// drips keep growing along that underside, necking, pinching off and falling
// down across the whole desktop.
//
// The goo isn't simulated particle-by-particle like the skins' liquids — it's
// a 1-D wave plus procedural drips, re-sampled every frame into a hex lattice
// of "particles" and fed through the same metaball shader (goo.js), so it is
// the same glossy stuff as everything else and drips merge into the slab
// with proper necks.

import { Goo, rgb } from './goo.js'

export const GOO_D = 60 // rest depth of the slab, CSS px
const S = 7 // lattice spacing
const COLS = 6 // wave columns
const rand = (a, b) => a + Math.random() * (b - a)
const smooth = (a, b, t) => {
  const k = Math.min(1, Math.max(0, (t - a) / (b - a)))
  return k * k * (3 - 2 * k)
}

export class GooBar {
  constructor(res, top = 0) {
    this.res = res
    this.top = top // safe-area inset: the slab hangs below a notch
    const max = 9000
    this.src = {
      n: 0, max, s: S, splat: S * 2,
      x: new Float32Array(max), y: new Float32Array(max),
      vx: new Float32Array(max), vy: new Float32Array(max),
      tint: new Float32Array(max), scale: new Float32Array(max),
    }
    this.goo = new Goo(res, { overlay: true })
    this.vessel = this.goo.add({
      fluid: this.src, x: 0, y: 0, w: innerWidth, h: innerHeight, full: true, pad: 0,
      inside: () => -1,
      // only shade where goo can be: the slab band, hanging drips, falling drops
      clip: () => this.clipRects(),
      look: { a: rgb('#7b3dff'), b: rgb('#36f0ff'), glow: rgb('#a8f8ff'), glowAmt: 0.6, caustics: 0.35, alpha: 0.9, alphaEdge: 0.97, deep: 0.55, foam: 0.6, foamSpeed: 1600 },
    })
    // WebGL: the renderer's own canvas is the overlay. Without it, the flat
    // fallback gets copied onto a plain 2-D canvas instead.
    this.view = this.goo.gl ? this.goo.canvas : document.createElement('canvas')
    this.view.id = 'goobar'
    document.body.appendChild(this.view)
    this.obstacles = []
    this.drops = []
    this.drips = []
    this.t = 0
    this.resize()
  }

  resize() {
    this.W = innerWidth
    this.H = innerHeight
    this.vessel.w = this.W
    this.vessel.h = this.H
    // one tile the size of the screen: keep it inside the texture limit. The
    // goo is soft, so 1.5x is plenty even on a 3x phone.
    const cap = (this.goo.maxTex || 4096) - 2
    this.goo.setRes(Math.min(this.res, 1.5, cap / this.W, cap / this.H))
    this.goo.finalize()
    const c = this.view
    if (!this.goo.gl) {
      c.width = this.goo.W
      c.height = this.goo.H
      this.vctx = c.getContext('2d')
    }
    c.style.width = this.W + 'px'
    c.style.height = this.H + 'px'
    // keep the wave across resizes (stretched to the new width)
    const n = Math.ceil(this.W / COLS) + 2
    const oh = this.wh, ov = this.wv
    this.wh = new Float32Array(n)
    this.wv = new Float32Array(n)
    if (oh) {
      for (let i = 0; i < n; i++) {
        const j = Math.min(oh.length - 1, Math.round((i / n) * oh.length))
        this.wh[i] = oh[j]
        this.wv[i] = ov[j]
      }
    }
    // drip sites spread along the underside, one per ~120 px. Existing drips
    // keep their state and slide to their new homes.
    const count = Math.max(4, Math.round(this.W / 120))
    const old = this.drips
    this.drips = Array.from({ length: count }, (_, k) => {
      const home = ((k + 0.5) / count) * this.W
      const prev = old[k]
      if (prev) return Object.assign(prev, { home, x: home + (prev.x - prev.home) })
      // start mid-life so the bar is already dripping on the first frame
      const d = this.newDrip(home, home + rand(-30, 30), 0)
      d.state = 'grow'
      d.L = rand(0.1, 0.85) * d.Lmax
      return d
    })
  }

  // each site wobbles around its own home, so drips never wander off or clump
  newDrip(home, x = home + rand(-30, 30), wait = rand(0.6, 4)) {
    x = Math.min(this.W - 8, Math.max(8, x))
    return { home, x, L: 0, Lmax: rand(30, 130), speed: rand(9, 26), wait, state: 'wait', sway: rand(0, 6.28) }
  }

  // screen rects (CSS px) the shading pass has to cover this frame
  clipRects() {
    const m = 3 * S
    let bot = this.top + GOO_D + 30
    for (const d of this.drips) if (d.L > 1) bot = Math.max(bot, this.surface(d.x) + d.L)
    const r = [[0, 0, this.W, bot + m]]
    for (const p of this.drops) r.push([p.x - m, p.y - 16 - m, 2 * m, 16 + 2 * m])
    return r
  }

  // bulge the underside down at screen-x (amount ~ px/s of wave velocity)
  splash(x, amount, width = 50) {
    const n = this.wh.length
    const c = x / COLS, w = width / COLS
    for (let i = Math.max(0, Math.floor(c - w * 3)); i < Math.min(n, Math.ceil(c + w * 3)); i++) {
      const d = (i - c) / w
      this.wv[i] += amount * Math.exp(-d * d)
    }
    // hard hits shake drops loose; hovering and gentle bumps only wobble
    const shed = Math.min(8, Math.floor((amount - 60) / 60))
    for (let k = 0; k < shed; k++) {
      const dx = x + (Math.random() - 0.5) * width * 2
      this.drops.push({ x: dx, y: this.surface(dx) + 4, vy: rand(0, 200), r: rand(0.6, 1.05), vx: (Math.random() - 0.5) * 60 })
    }
    for (const d of this.drips) {
      if (Math.abs(d.x - x) < width * 1.5 && d.state === 'grow') d.L += amount * 0.05
    }
  }

  wave(x) {
    const f = Math.max(0, x / COLS)
    const i = Math.min(this.wh.length - 2, Math.floor(f))
    const k = f - i
    return this.wh[i] * (1 - k) + this.wh[i + 1] * k
  }

  // y of the slab's underside at x
  surface(x) {
    const t = this.t
    return this.top + GOO_D + this.wave(x) + Math.sin(x * 0.045 + t * 1.3) * 1.6 + Math.sin(x * 0.11 - t * 2.1) * 0.9
  }

  slope(x) {
    return (this.surface(x + 6) - this.surface(x - 6)) / 12
  }

  blocked(x, y) {
    for (const o of this.obstacles) {
      if (o.r) {
        const dx = x - o.x, dy = y - o.y
        if (dx * dx + dy * dy < (o.r + 3) ** 2) return true
      } else if (x > o.x - 3 && x < o.x + o.w + 3 && y > o.y - 3 && y < o.y + o.h + 3) return true
    }
    return false
  }

  step(dt) {
    this.t += dt
    const { wh, wv } = this
    const n = wh.length
    const sub = 3, h = dt / sub
    for (let s = 0; s < sub; s++) {
      for (let i = 0; i < n; i++) {
        const l = wh[i > 0 ? i - 1 : 0], r = wh[i < n - 1 ? i + 1 : n - 1]
        wv[i] += (620 * (l + r - 2 * wh[i]) - 26 * wh[i] - 1.3 * wv[i]) * h
      }
      for (let i = 0; i < n; i++) {
        wh[i] += wv[i] * h
        if (wh[i] > 26) wh[i] = 26
        if (wh[i] < -18) wh[i] = -18
      }
    }
    for (const d of this.drips) {
      if (d.state === 'wait') {
        d.wait -= dt
        if (d.wait <= 0) d.state = 'grow'
      } else if (d.state === 'grow') {
        // heavier drips stretch faster
        d.L += d.speed * dt * (1 + (d.L / d.Lmax) * 1.6)
        if (d.L >= d.Lmax) {
          const tip = this.surface(d.x) + d.L
          this.drops.push({ x: d.x, y: tip, vy: 40, r: 0.8 + 0.45 * Math.min(1, d.Lmax / 70), vx: 0 })
          d.state = 'snap'
          d.L *= 0.4
        }
      } else if (d.state === 'snap') {
        d.L -= 90 * dt
        if (d.L <= 0) Object.assign(d, this.newDrip(d.home))
      }
    }
    for (let i = this.drops.length - 1; i >= 0; i--) {
      const p = this.drops[i]
      p.vy += 1700 * dt
      p.y += p.vy * dt
      p.x += p.vx * dt
      if (p.y > this.H + 30) this.drops.splice(i, 1)
    }
  }

  // re-sample the slab, drips and drops into particles for the shader
  build() {
    const src = this.src
    const { x, y, tint, scale, vy } = src
    let n = 0
    const max = src.max - 400
    const put = (px, py, sc, tn, v = 0) => {
      if (n >= src.max) return
      x[n] = px; y[n] = py; scale[n] = sc; tint[n] = tn; vy[n] = v
      src.vx[n] = 0
      n++
    }
    // the slab: hex rows down to just above the underside, plus one skin
    // particle per column riding the surface exactly, so the edge is smooth
    const deep = this.top + GOO_D
    for (let j = 0, py = 3; py < deep + 32; j++, py += S * 0.866) {
      for (let px = (j & 1) * S * 0.5; px <= this.W + S; px += S) {
        if (n >= max) break
        const sy = this.surface(px)
        if (py > sy - S * 0.55) continue
        if (this.blocked(px, py)) continue
        put(px, py, 1, Math.min(1, py / deep))
      }
    }
    for (let px = 0; px <= this.W + S; px += S * 0.8) {
      const sy = this.surface(px) - S * 0.45
      if (!this.blocked(px, sy)) put(px, sy, 0.95, 1)
    }
    // drips: a tapering neck and a fattening bulb
    for (const d of this.drips) {
      if (d.L <= 1) continue
      const base = this.surface(d.x)
      const k = Math.min(1, d.L / d.Lmax)
      const neck = d.state === 'snap' ? 0.5 : 1 - 0.5 * smooth(0.5, 1, k)
      const sway = Math.sin(this.t * 1.7 + d.sway) * k * 3 - this.slope(d.x) * d.L * 0.4
      const tip = base + d.L
      for (let py = base - S; py < tip - S * 0.4; py += S * 0.45) {
        const u = Math.min(1, Math.max(0, (py - base) / Math.max(6, d.L)))
        const flare = 1 + 0.7 * Math.pow(1 - Math.min(1, u * 2.2), 2)
        put(d.x + sway * Math.max(0, u), py, 0.62 * neck * flare, 1)
      }
      if (d.state === 'grow') {
        const bulb = 0.62 + 0.5 * k
        put(d.x + sway, tip - S * 0.35, bulb * 0.92, 1)
        put(d.x + sway, tip, bulb, 1)
      }
    }
    // falling drops, stretched by their speed
    for (const p of this.drops) {
      const st = Math.min(16, p.vy * 0.012)
      put(p.x, p.y, p.r, 1, p.vy)
      put(p.x, p.y - st * 0.5, p.r * 0.85, 1, p.vy)
      put(p.x, p.y - st, p.r * 0.62, 1, p.vy)
    }
    src.n = n
  }

  render(t) {
    this.build()
    this.goo.render(t)
    if (this.vctx) {
      this.vctx.setTransform(1, 0, 0, 1, 0, 0)
      this.vctx.clearRect(0, 0, this.view.width, this.view.height)
      this.vctx.setTransform(this.goo.res, 0, 0, this.goo.res, 0, 0)
      this.goo.blit(this.vctx, this.vessel, 0, 0)
    }
  }
}
