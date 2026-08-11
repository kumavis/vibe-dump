// ring.js — the Hydro Clock: an analog clock whose bezel is a circular glass
// tube half-filled with glittery liquid. The liquid is a single pendulum
// degree of freedom: drag the window and the whole arc swings and rings.

export class HydroClock {
  constructor(w, h, opts = {}) {
    this.opts = opts
    this.resize(w, h)
    this.theta = 0      // angular offset of the liquid arc from the bottom
    this.omega = 0
    this.halfArc = 1.15 // half angular extent of the liquid
    this.t = Math.random() * 10
    this.glitter = Array.from({ length: 26 }, () => ({
      a: (Math.random() - 0.5) * 2,      // angle within the arc (-1..1 of halfArc)
      r01: Math.random(),                // radial position within tube
      phase: Math.random() * Math.PI * 2,
      spin: 1 + Math.random() * 3,
      va: 0,
    }))
  }

  resize(w, h) {
    this.w = w
    this.h = h
    this.cx = w / 2
    this.cy = h / 2
    this.R = this.opts.R ?? Math.min(w, h) / 2 - 10   // tube centerline radius
    this.T = this.opts.T ?? Math.max(14, this.R * 0.3) // tube thickness
  }

  step(dt, ax) {
    this.t += dt
    // driven, damped pendulum
    const drive = -ax * 0.004
    this.omega += (-Math.sin(this.theta) * 14 - this.omega * 1.6 + drive) * dt
    this.theta += this.omega * dt
    this.theta = Math.max(-1.2, Math.min(1.2, this.theta))
    for (const g of this.glitter) {
      g.va += (this.omega * 2 - g.va) * Math.min(1, 3 * dt) + (Math.random() - 0.5) * 1.4 * dt
      g.a += g.va * dt
      if (g.a < -0.94) { g.a = -0.94; g.va = Math.abs(g.va) * 0.4 }
      if (g.a > 0.94) { g.a = 0.94; g.va = -Math.abs(g.va) * 0.4 }
    }
  }

  draw(ctx) {
    const { cx, cy, R, T } = this
    const bottom = Math.PI / 2 // screen-down

    // ---- glass ring shell (behind liquid) ----
    ctx.lineCap = 'round'
    let g = ctx.createLinearGradient(cx, cy - R, cx, cy + R)
    g.addColorStop(0, 'rgba(255,255,255,0.5)')
    g.addColorStop(0.5, 'rgba(210,240,255,0.18)')
    g.addColorStop(1, 'rgba(170,225,255,0.35)')
    ctx.strokeStyle = g
    ctx.lineWidth = T
    ctx.beginPath()
    ctx.arc(cx, cy, R, 0, Math.PI * 2)
    ctx.stroke()

    // ---- liquid arc ----
    const a0 = bottom + this.theta - this.halfArc
    const a1 = bottom + this.theta + this.halfArc
    g = ctx.createLinearGradient(cx, cy, cx, cy + R + T / 2)
    g.addColorStop(0, '#3aa9dd')
    g.addColorStop(0.75, '#1173b8')
    g.addColorStop(1, '#064a86')
    ctx.strokeStyle = g
    ctx.lineWidth = T - 5
    ctx.globalAlpha = 0.9
    ctx.beginPath()
    ctx.arc(cx, cy, R, a0, a1)
    ctx.stroke()
    ctx.globalAlpha = 1

    // meniscus glints at both free surfaces
    for (const a of [a0, a1]) {
      const x = cx + Math.cos(a) * R
      const y = cy + Math.sin(a) * R
      ctx.fillStyle = 'rgba(255,255,255,0.85)'
      ctx.beginPath()
      ctx.ellipse(x, y, (T - 5) / 2, 2.2, a + Math.PI / 2, 0, Math.PI * 2)
      ctx.fill()
    }

    // glitter inside the arc
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    for (const p of this.glitter) {
      const a = bottom + this.theta + p.a * this.halfArc
      const rr = R - (T - 5) / 2 + 3 + p.r01 * (T - 11)
      const x = cx + Math.cos(a) * rr
      const y = cy + Math.sin(a) * rr
      const tw = 0.5 + 0.5 * Math.sin(this.t * p.spin * 2.4 + p.phase)
      ctx.globalAlpha = 0.2 + 0.8 * tw * tw
      ctx.fillStyle = tw > 0.6 ? '#ffffff' : '#a8ecff'
      ctx.beginPath()
      ctx.arc(x, y, 1 + tw, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()

    // ---- ring specular highlights (over liquid) ----
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.arc(cx, cy, R + T * 0.28, -Math.PI * 0.85, -Math.PI * 0.35)
    ctx.stroke()
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(cx, cy, R - T * 0.3, Math.PI * 0.2, Math.PI * 0.5)
    ctx.stroke()
    // rims
    ctx.strokeStyle = 'rgba(255,255,255,0.75)'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.arc(cx, cy, R + T / 2, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(cx, cy, R - T / 2, 0, Math.PI * 2)
    ctx.stroke()

    // ---- hour ticks as tiny bubbles on the ring ----
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2
      const x = cx + Math.cos(a) * R
      const y = cy + Math.sin(a) * R
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.beginPath()
      ctx.arc(x, y, i % 3 === 0 ? 2.4 : 1.4, 0, Math.PI * 2)
      ctx.fill()
    }

    // ---- time = glossy marker bubbles riding the ring ----
    const now = new Date()
    const s = now.getSeconds() + now.getMilliseconds() / 1000
    const m = now.getMinutes() + s / 60
    const hr = (now.getHours() % 12) + m / 60
    const marker = (frac, rad, deep) => {
      const a = frac * Math.PI * 2 - Math.PI / 2
      const x = cx + Math.cos(a) * R
      const y = cy + Math.sin(a) * R
      const mg = ctx.createRadialGradient(x - rad * 0.35, y - rad * 0.35, rad * 0.1, x, y, rad)
      mg.addColorStop(0, '#ffffff')
      mg.addColorStop(0.45, deep === '#e56a10' ? '#ffc37a' : '#9fdcff')
      mg.addColorStop(1, deep)
      ctx.shadowColor = 'rgba(3,40,80,0.45)'
      ctx.shadowBlur = 5
      ctx.fillStyle = mg
      ctx.beginPath()
      ctx.arc(x, y, rad, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
    }
    marker(hr / 12, T * 0.34, '#0b62aa')   // hour: big bubble
    marker(m / 60, T * 0.22, '#1470b8')    // minute: small bubble
    marker(s / 60, T * 0.12, '#e56a10')    // second: orange droplet
  }
}
