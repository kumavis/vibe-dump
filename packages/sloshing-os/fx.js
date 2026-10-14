// fx.js — things that live in the liquid: rubber ducks that float (real
// buoyancy against the particles, so a jet can launch them), bubbles that rise
// until they leave the liquid, and glitter riding individual particles.

import { DT } from './fluid.js'

// ---------------------------------------------------------------------------
// Rubber duck
// ---------------------------------------------------------------------------

export function drawDuck(ctx, x, y, size, rot, flip = 1) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  ctx.scale(size * flip, size)

  let g = ctx.createRadialGradient(-0.35, -0.25, 0.1, 0, 0.1, 1.35)
  g.addColorStop(0, '#fff6a8')
  g.addColorStop(0.45, '#ffd84a')
  g.addColorStop(1, '#f09a1c')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.ellipse(0, 0.12, 1, 0.72, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(-0.72, -0.1)
  ctx.quadraticCurveTo(-1.25, -0.5, -0.95, 0.15)
  ctx.quadraticCurveTo(-0.85, 0.3, -0.6, 0.3)
  ctx.fill()

  g = ctx.createRadialGradient(0.38, -0.95, 0.05, 0.5, -0.75, 0.75)
  g.addColorStop(0, '#fff8c0')
  g.addColorStop(0.55, '#ffd84a')
  g.addColorStop(1, '#f0a826')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(0.5, -0.72, 0.55, 0, Math.PI * 2)
  ctx.fill()

  g = ctx.createLinearGradient(0.9, -0.85, 1.3, -0.6)
  g.addColorStop(0, '#ff9524')
  g.addColorStop(1, '#e05a0c')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.moveTo(0.92, -0.86)
  ctx.quadraticCurveTo(1.38, -0.82, 1.32, -0.66)
  ctx.quadraticCurveTo(1.26, -0.5, 0.94, -0.58)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#1d1a16'
  ctx.beginPath()
  ctx.arc(0.62, -0.92, 0.09, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(0.65, -0.95, 0.035, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = 'rgba(210,130,20,0.75)'
  ctx.lineWidth = 0.08
  ctx.beginPath()
  ctx.ellipse(-0.1, 0.12, 0.42, 0.3, -0.25, -0.6, Math.PI * 0.75)
  ctx.stroke()
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.beginPath()
  ctx.ellipse(-0.25, -0.22, 0.4, 0.16, -0.35, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

// A rigid round body coupled to a fluid: it shoves particles out of its hull,
// feels buoyancy from how submerged it is, and is dragged along by the local
// flow. buoy > 1 floats, < 1 sinks (slowly — the drag still carries it).
export class Floater {
  constructor(fluid, x, y, r, { buoy = 2.1, drag = 7, push = 0.8, hull = 1 } = {}) {
    this.f = fluid
    this.x = x
    this.y = y
    this.r = r
    this.vx = 0
    this.vy = 0
    this.rot = 0
    this.spin = 0
    this.buoy = buoy
    this.drag = drag
    this.push = push
    this.hull = hull
    this.sub = 0
    this.buf = new Int32Array(256)
    this.n = [0, 0]
    this.expected = (Math.PI * (r + fluid.s) ** 2) / (0.866 * fluid.s * fluid.s)
    fluid.hooks.push(() => this.substep())
  }

  substep() {
    const f = this.f
    const hullR = this.r * this.hull + f.rP
    const reach = this.r + f.s
    const cnt = f.near(this.x, this.y, reach, this.buf)
    let svx = 0, svy = 0
    for (let k = 0; k < cnt; k++) {
      const i = this.buf[k]
      svx += f.vx[i]
      svy += f.vy[i]
      if (this.push <= 0) continue
      const dx = f.x[i] - this.x, dy = f.y[i] - this.y
      const d = Math.hypot(dx, dy)
      if (d < hullR && d > 1e-4) {
        const o = (hullR - d) * this.push
        f.x[i] += (dx / d) * o
        f.y[i] += (dy / d) * o
        this.vx -= (dx / d) * o * 3
        this.vy -= (dy / d) * o * 3
      }
    }
    const sub = Math.min(1, (cnt / this.expected) * 1.25)
    this.sub += (sub - this.sub) * 0.3
    const g = f.gravity
    this.vy += g * DT * (1 - this.buoy * this.sub)
    if (cnt > 0) {
      const k = Math.min(1, this.drag * DT) * this.sub
      this.vx += (svx / cnt - this.vx) * k
      this.vy += (svy / cnt - this.vy) * k
    }
    this.vx *= Math.exp(-0.4 * DT)
    this.vy *= Math.exp(-0.4 * DT)
    this.x += this.vx * DT
    this.y += this.vy * DT
    // glass walls
    const d = f.grid.sample(this.x, this.y) + this.r * 0.9
    if (d > 0) {
      f.grid.normal(this.x, this.y, this.n)
      this.x -= this.n[0] * d
      this.y -= this.n[1] * d
      const vn = this.vx * this.n[0] + this.vy * this.n[1]
      if (vn > 0) {
        this.vx -= vn * this.n[0] * 1.4
        this.vy -= vn * this.n[1] * 1.4
      }
    }
    // airborne ducks tumble, swimming ducks right themselves
    if (this.sub < 0.15) this.spin += this.vx * 0.0006
    else this.spin += (-this.rot * 6 - this.spin * 2.5 + this.vx * 0.004) * DT
    this.spin *= Math.exp(-1.2 * DT)
    this.rot += this.spin * DT * 60
    if (this.rot > Math.PI) this.rot -= Math.PI * 2
    if (this.rot < -Math.PI) this.rot += Math.PI * 2
  }
}

// ---------------------------------------------------------------------------
// Bubbles: rise and wobble while there is liquid around them, pop when not.
// ---------------------------------------------------------------------------

export class Bubbles {
  constructor(fluid, { rate = 2, size = [1, 3] } = {}) {
    this.f = fluid
    this.rate = rate
    this.size = size
    this.list = []
    this.pops = []
    this.acc = 0
    this.buf = new Int32Array(64)
  }

  spawn(x, y, r) {
    if (this.list.length > 90) return
    this.list.push({ x, y, r: r ?? this.size[0] + Math.random() * (this.size[1] - this.size[0]), w: Math.random() * 6, vx: 0 })
  }

  // spawn at random spots along the bottom of the liquid
  ambient(dt, pick) {
    this.acc += dt * this.rate
    while (this.acc > 1) {
      this.acc -= 1
      const p = pick()
      if (p) this.spawn(p[0], p[1])
    }
  }

  step(dt) {
    const f = this.f
    for (let i = this.list.length - 1; i >= 0; i--) {
      const b = this.list[i]
      const cnt = f.near(b.x, b.y, f.s * 1.5, this.buf)
      if (cnt < 2) {
        this.pops.push({ x: b.x, y: b.y, r: b.r, t: 0 })
        this.list.splice(i, 1)
        continue
      }
      let svx = 0
      for (let k = 0; k < cnt; k++) svx += f.vx[this.buf[k]]
      b.vx += (svx / cnt - b.vx) * Math.min(1, 5 * dt)
      b.w += dt * 7
      b.x += (b.vx + Math.sin(b.w) * 14) * dt
      b.y -= (34 + b.r * 16) * dt
    }
    for (let i = this.pops.length - 1; i >= 0; i--) {
      this.pops[i].t += dt
      if (this.pops[i].t > 0.25) this.pops.splice(i, 1)
    }
  }

  draw(ctx, ox, oy) {
    ctx.save()
    ctx.translate(ox, oy)
    ctx.lineWidth = 0.9
    for (const b of this.list) {
      ctx.strokeStyle = 'rgba(255,255,255,0.65)'
      ctx.beginPath()
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
      ctx.stroke()
      ctx.fillStyle = 'rgba(255,255,255,0.8)'
      ctx.beginPath()
      ctx.arc(b.x - b.r * 0.35, b.y - b.r * 0.35, Math.max(0.5, b.r * 0.3), 0, Math.PI * 2)
      ctx.fill()
    }
    for (const p of this.pops) {
      const k = p.t / 0.25
      ctx.strokeStyle = `rgba(255,255,255,${0.7 * (1 - k)})`
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r * (1 + k * 2.5), 0, Math.PI * 2)
      ctx.stroke()
    }
    ctx.restore()
  }
}

// ---------------------------------------------------------------------------
// Glitter: sparkles pinned to random particles, so they swirl with the flow.
// ---------------------------------------------------------------------------

const GLINT = ['#ffffff', '#fff3b0', '#bff6ff', '#ffd0f4']

export class Glitter {
  constructor(fluid, count) {
    this.f = fluid
    this.p = Array.from({ length: count }, () => ({
      i: (Math.random() * fluid.n) | 0,
      ph: Math.random() * 6.28,
      sp: 1.5 + Math.random() * 3.5,
      c: GLINT[(Math.random() * GLINT.length) | 0],
      s: 0.6 + Math.random() * 1.1,
    }))
  }

  draw(ctx, ox, oy, t, boost = 0) {
    const f = this.f
    ctx.save()
    ctx.translate(ox, oy)
    ctx.globalCompositeOperation = 'lighter'
    for (const p of this.p) {
      if (p.i >= f.n) continue
      const x = f.x[p.i], y = f.y[p.i]
      const tw = 0.5 + 0.5 * Math.sin(t * p.sp + p.ph)
      const a = Math.min(1, 0.15 + tw * tw * 0.85 + boost)
      ctx.globalAlpha = a
      ctx.fillStyle = p.c
      const r = p.s * (0.6 + tw * 0.6)
      ctx.fillRect(x - r, y - r, r * 2, r * 2)
      if (tw > 0.86 || boost > 0.3) {
        const L = p.s * 4 * (tw - 0.5) * 2 + boost * 6
        ctx.globalAlpha = (tw - 0.8) * 3 + boost
        ctx.fillRect(x - L, y - 0.4, L * 2, 0.8)
        ctx.fillRect(x - 0.4, y - L, 0.8, L * 2)
      }
    }
    ctx.restore()
  }
}
