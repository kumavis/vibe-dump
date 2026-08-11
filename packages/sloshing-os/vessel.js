// vessel.js — the liquid heart of SloshOS.
//
// Every piece of glass on the desktop (windows, title bars, the dock tube,
// the background tube) is a "vessel": a clipped glass shape containing a
// liquid whose free surface is a 1-D damped wave field. Dragging a container
// feeds its acceleration into the field, so the liquid piles up against the
// motion and rings afterwards — i.e. it sloshes.

// ---------------------------------------------------------------------------
// 1-D slosh field
// ---------------------------------------------------------------------------

export class SloshSim {
  constructor(n = 48, opts = {}) {
    this.n = n
    this.h = new Float32Array(n) // surface offset, px (+ = up)
    this.v = new Float32Array(n) // surface velocity, px/s
    this.wave = opts.wave ?? 90       // stiffness between columns
    this.damping = opts.damping ?? 1.35
    this.maxAmp = opts.maxAmp ?? 26
    this.tiltGain = opts.tiltGain ?? 0.055 // response to horizontal accel
    this.heaveGain = opts.heaveGain ?? 0.03 // response to vertical accel
    this.t = Math.random() * 100
  }

  // ax, ay: container acceleration in px/s² (screen coords, y down).
  step(dt, ax = 0, ay = 0) {
    const { n, h, v } = this
    this.t += dt
    const damp = Math.exp(-this.damping * dt)

    // ambient life so a resting vessel still shimmers
    const amb = Math.sin(this.t * 1.7) * 1.2 + Math.sin(this.t * 0.63 + 2) * 0.8

    for (let i = 0; i < n; i++) {
      const t01 = i / (n - 1)
      const left = h[i > 0 ? i - 1 : 0]
      const right = h[i < n - 1 ? i + 1 : n - 1]
      let acc = this.wave * (left + right - 2 * h[i])
      acc += ax * this.tiltGain * (0.5 - t01) * this.wave      // pile away from accel
      acc += ay * this.heaveGain * Math.cos(t01 * Math.PI * 2) * this.wave // splash mode
      acc += amb * Math.sin(t01 * Math.PI * 3 + this.t) * 0.6
      v[i] = (v[i] + acc * dt) * damp
    }
    let mean = 0
    for (let i = 0; i < n; i++) {
      h[i] += v[i] * dt
      mean += h[i]
    }
    mean /= n
    const cap = this.maxAmp
    for (let i = 0; i < n; i++) {
      h[i] -= mean // conserve volume
      if (h[i] > cap) h[i] = cap
      if (h[i] < -cap) h[i] = -cap
    }
  }

  splash(x01, amount) {
    const { n, h } = this
    const c = x01 * (n - 1)
    for (let i = 0; i < n; i++) {
      const d = (i - c) / 3
      h[i] += amount * Math.exp(-d * d)
    }
  }

  heightAt(x01) {
    const { n, h } = this
    const f = Math.min(Math.max(x01, 0), 1) * (n - 1)
    const i = Math.floor(f)
    const j = Math.min(i + 1, n - 1)
    return h[i] + (h[j] - h[i]) * (f - i)
  }

  velAt(x01) {
    const { n, v } = this
    const f = Math.min(Math.max(x01, 0), 1) * (n - 1)
    const i = Math.floor(f)
    const j = Math.min(i + 1, n - 1)
    return v[i] + (v[j] - v[i]) * (f - i)
  }

  slopeAt(x01, spanPx) {
    const d = 0.05
    return (this.heightAt(x01 + d) - this.heightAt(x01 - d)) / (2 * d * spanPx)
  }
}

// ---------------------------------------------------------------------------
// Liquid body rendering
// ---------------------------------------------------------------------------
// region: { x0, x1, level, bottom } in canvas px. The free surface sits at
// level - sim.height. Caller is expected to have clipped to the glass shape.

export function surfaceY(sim, region, x) {
  const x01 = (x - region.x0) / (region.x1 - region.x0)
  return region.level - sim.heightAt(x01)
}

export function drawLiquid(ctx, sim, region, opts = {}) {
  const { x0, x1, level, bottom } = region
  const steps = opts.steps ?? 40
  const deep = opts.deep ?? '#053a7c'
  const mid = opts.mid ?? '#0d6fbe'
  const top = opts.top ?? '#5fd2ee'

  ctx.beginPath()
  ctx.moveTo(x0 - 4, surfaceY(sim, region, x0))
  for (let i = 1; i <= steps; i++) {
    const x = x0 + ((x1 - x0) * i) / steps
    ctx.lineTo(x, surfaceY(sim, region, x))
  }
  ctx.lineTo(x1 + 4, bottom + 8)
  ctx.lineTo(x0 - 4, bottom + 8)
  ctx.closePath()

  const g = ctx.createLinearGradient(0, level - 22, 0, bottom)
  g.addColorStop(0, top)
  g.addColorStop(0.28, mid)
  g.addColorStop(1, deep)
  ctx.globalAlpha = opts.alpha ?? 0.88
  ctx.fillStyle = g
  ctx.fill()
  ctx.globalAlpha = 1

  // caustic shimmer in the body of the liquid
  if (opts.caustics !== false) {
    ctx.save()
    ctx.clip() // clip to the liquid body we just built
    ctx.globalCompositeOperation = 'lighter'
    const t = sim.t
    for (let k = 0; k < 3; k++) {
      const cx = x0 + (x1 - x0) * (0.2 + 0.3 * k + 0.08 * Math.sin(t * 0.7 + k * 2.1))
      const cy = level + (bottom - level) * (0.35 + 0.18 * Math.sin(t * 0.5 + k))
      const r = (x1 - x0) * (0.16 + 0.05 * Math.sin(t + k * 1.7))
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
      cg.addColorStop(0, 'rgba(140,230,255,0.14)')
      cg.addColorStop(1, 'rgba(140,230,255,0)')
      ctx.fillStyle = cg
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2)
    }
    ctx.restore()
  }

  // meniscus: bright edge right on the surface, soft glow just under it
  ctx.beginPath()
  ctx.moveTo(x0, surfaceY(sim, region, x0))
  for (let i = 1; i <= steps; i++) {
    const x = x0 + ((x1 - x0) * i) / steps
    ctx.lineTo(x, surfaceY(sim, region, x))
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'
  ctx.lineWidth = 1.4
  ctx.stroke()
  ctx.strokeStyle = 'rgba(170,240,255,0.35)'
  ctx.lineWidth = 4
  ctx.stroke()
}

// ---------------------------------------------------------------------------
// Glass overlay — the "hyper photo real" part: rim light, fresnel edge,
// a curved gloss sheet across the top and a hot specular blob.
// ---------------------------------------------------------------------------

export function glassOverlay(ctx, path, w, h, opts = {}) {
  ctx.save()
  ctx.clip(path)

  // fresnel: thick soft inner edge
  ctx.strokeStyle = 'rgba(180,235,255,0.28)'
  ctx.lineWidth = 10
  ctx.stroke(path)
  // inner rim light
  ctx.strokeStyle = 'rgba(255,255,255,0.75)'
  ctx.lineWidth = 2.5
  ctx.stroke(path)

  // curved gloss sheet over the upper portion
  if (opts.gloss !== false) {
    const gh = h * (opts.glossDepth ?? 0.42)
    ctx.beginPath()
    ctx.moveTo(-w * 0.1, 0)
    ctx.lineTo(w * 1.1, 0)
    ctx.lineTo(w * 1.1, gh * 0.55)
    ctx.quadraticCurveTo(w * 0.5, gh * 1.45, -w * 0.1, gh * 0.55)
    ctx.closePath()
    const g = ctx.createLinearGradient(0, 0, 0, gh * 1.2)
    g.addColorStop(0, `rgba(255,255,255,${opts.glossAlpha ?? 0.4})`)
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fill()
  }

  // hot specular blob, top-left
  const sx = w * (opts.specX ?? 0.2)
  const sy = h * (opts.specY ?? 0.14)
  const sr = Math.min(w, h) * 0.2
  const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr)
  sg.addColorStop(0, 'rgba(255,255,255,0.75)')
  sg.addColorStop(0.5, 'rgba(255,255,255,0.12)')
  sg.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = sg
  ctx.beginPath()
  ctx.ellipse(sx, sy, sr * 1.4, sr * 0.7, -0.35, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()

  // outer rim
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'
  ctx.lineWidth = 1.5
  ctx.stroke(path)
}

// ---------------------------------------------------------------------------
// Rubber duck
// ---------------------------------------------------------------------------

export function drawDuck(ctx, x, y, size, rot) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  ctx.scale(size, size)

  // body
  let g = ctx.createRadialGradient(-0.35, -0.25, 0.1, 0, 0.1, 1.35)
  g.addColorStop(0, '#fff3a0')
  g.addColorStop(0.45, '#ffd94e')
  g.addColorStop(1, '#eda224')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.ellipse(0, 0.12, 1, 0.72, 0, 0, Math.PI * 2)
  ctx.fill()
  // tail flick
  ctx.beginPath()
  ctx.moveTo(-0.72, -0.1)
  ctx.quadraticCurveTo(-1.25, -0.5, -0.95, 0.15)
  ctx.quadraticCurveTo(-0.85, 0.3, -0.6, 0.3)
  ctx.fill()

  // head
  g = ctx.createRadialGradient(0.38, -0.95, 0.05, 0.5, -0.75, 0.75)
  g.addColorStop(0, '#fff6b8')
  g.addColorStop(0.55, '#ffd94e')
  g.addColorStop(1, '#f0ab28')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(0.5, -0.72, 0.55, 0, Math.PI * 2)
  ctx.fill()

  // beak
  g = ctx.createLinearGradient(0.9, -0.85, 1.3, -0.6)
  g.addColorStop(0, '#ff9524')
  g.addColorStop(1, '#e56a10')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.moveTo(0.92, -0.86)
  ctx.quadraticCurveTo(1.38, -0.82, 1.32, -0.66)
  ctx.quadraticCurveTo(1.26, -0.5, 0.94, -0.58)
  ctx.closePath()
  ctx.fill()

  // eye + glint
  ctx.fillStyle = '#26221c'
  ctx.beginPath()
  ctx.arc(0.62, -0.92, 0.085, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.beginPath()
  ctx.arc(0.645, -0.945, 0.03, 0, Math.PI * 2)
  ctx.fill()

  // wing hint
  ctx.strokeStyle = 'rgba(216,144,28,0.7)'
  ctx.lineWidth = 0.07
  ctx.beginPath()
  ctx.ellipse(-0.1, 0.12, 0.42, 0.3, -0.25, -0.6, Math.PI * 0.75)
  ctx.stroke()

  // body highlight
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.beginPath()
  ctx.ellipse(-0.25, -0.22, 0.4, 0.18, -0.35, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

// A duck bobbing on a slosh field.
export class Duck {
  constructor(x01, size, range) {
    this.x01 = x01
    this.size = size
    this.range = range // optional [min01, max01] swim limits
    this.vx = 0
    this.y = 0
    this.vy = 0
    this.rot = 0
  }

  step(dt, sim, region) {
    const span = region.x1 - region.x0
    const slope = sim.slopeAt(this.x01, span)
    // ducks surf downhill, with drag
    this.vx += slope * 260 * dt
    this.vx *= Math.exp(-1.6 * dt)
    this.x01 += (this.vx * dt) / span
    const margin = (this.size * 1.4) / span
    const lo = Math.max(margin, this.range ? this.range[0] : 0)
    const hi = Math.min(1 - margin, this.range ? this.range[1] : 1)
    if (this.x01 < lo) { this.x01 = lo; this.vx = Math.abs(this.vx) * 0.4 }
    if (this.x01 > hi) { this.x01 = hi; this.vx = -Math.abs(this.vx) * 0.4 }

    const targetY = region.level - sim.heightAt(this.x01) - this.size * 0.28
    this.vy += (targetY - this.y) * 26 * dt
    this.vy *= Math.exp(-4.5 * dt)
    this.y += this.vy * dt

    const targetRot = Math.atan(slope) * 0.8 + this.vx * 0.003
    this.rot += (targetRot - this.rot) * Math.min(1, 8 * dt)
  }

  draw(ctx, region) {
    const x = region.x0 + this.x01 * (region.x1 - region.x0)
    drawDuck(ctx, x, this.y, this.size, this.rot)
    // waterline band across the hull
    ctx.save()
    ctx.globalAlpha = 0.35
    ctx.fillStyle = '#1e88d4'
    ctx.beginPath()
    ctx.ellipse(x, this.y + this.size * 0.42, this.size * 1.15, this.size * 0.22, this.rot * 0.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

// ---------------------------------------------------------------------------
// Glitter — buoyant sparkle flecks pushed around by the surface motion.
// ---------------------------------------------------------------------------

const GLITTER_COLORS = ['#ffffff', '#bff3ff', '#8fe0ff', '#e6d3ff', '#c0ffe8']

export class Glitter {
  constructor(count) {
    this.p = Array.from({ length: count }, () => ({
      x01: Math.random(),
      d01: Math.random(), // depth fraction below surface
      vx: 0,
      vd: 0,
      phase: Math.random() * Math.PI * 2,
      spin: 0.6 + Math.random() * 2.4,
      size: 0.9 + Math.random() * 1.7,
      color: GLITTER_COLORS[(Math.random() * GLITTER_COLORS.length) | 0],
    }))
  }

  step(dt, sim) {
    for (const p of this.p) {
      const push = sim.velAt(p.x01)
      p.vx += -sim.slopeAt(p.x01, 100) * 40 * dt + (Math.random() - 0.5) * 8 * dt
      p.vd += push * -0.004 * dt * 60 + (Math.random() - 0.5) * 0.25 * dt
      p.vd += (0.5 - p.d01) * -0.02 * dt // faint stratification
      p.vx *= Math.exp(-1.1 * dt)
      p.vd *= Math.exp(-1.1 * dt)
      p.x01 += p.vx * dt * 0.01
      p.d01 += p.vd * dt
      if (p.x01 < 0.02) { p.x01 = 0.02; p.vx = Math.abs(p.vx) }
      if (p.x01 > 0.98) { p.x01 = 0.98; p.vx = -Math.abs(p.vx) }
      if (p.d01 < 0.04) { p.d01 = 0.04; p.vd = Math.abs(p.vd) * 0.5 }
      if (p.d01 > 0.96) { p.d01 = 0.96; p.vd = -Math.abs(p.vd) * 0.5 }
    }
  }

  draw(ctx, sim, region) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    for (const p of this.p) {
      const x = region.x0 + p.x01 * (region.x1 - region.x0)
      const sy = region.level - sim.heightAt(p.x01)
      const y = sy + p.d01 * (region.bottom - sy)
      const tw = 0.5 + 0.5 * Math.sin(sim.t * p.spin * 3 + p.phase)
      ctx.globalAlpha = 0.25 + 0.75 * tw * tw
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(x, y, p.size * (0.7 + 0.5 * tw), 0, Math.PI * 2)
      ctx.fill()
      if (tw > 0.85) {
        // star flash
        ctx.globalAlpha = (tw - 0.85) * 4
        ctx.strokeStyle = p.color
        ctx.lineWidth = 0.6
        const r = p.size * 3.2
        ctx.beginPath()
        ctx.moveTo(x - r, y); ctx.lineTo(x + r, y)
        ctx.moveTo(x, y - r); ctx.lineTo(x, y + r)
        ctx.stroke()
      }
    }
    ctx.restore()
  }
}

// ---------------------------------------------------------------------------
// Bubbles — rise from the bottom, wobble, vanish at the surface.
// ---------------------------------------------------------------------------

export class Bubbles {
  constructor(rate = 0.8) {
    this.list = []
    this.rate = rate
    this.acc = 0
  }

  step(dt, sim, region) {
    this.acc += dt * this.rate
    while (this.acc > 1) {
      this.acc -= 1
      this.list.push({
        x01: 0.08 + Math.random() * 0.84,
        y: region.bottom - 2 - Math.random() * 6,
        r: 1 + Math.random() * 2.4,
        w: Math.random() * Math.PI * 2,
      })
    }
    for (let i = this.list.length - 1; i >= 0; i--) {
      const b = this.list[i]
      b.y -= (14 + b.r * 9) * dt
      b.w += dt * 5
      b.x01 += Math.sin(b.w) * 0.0009 + sim.velAt(b.x01) * 0.0004 * dt * 60
      if (b.y < region.level - sim.heightAt(b.x01) + 2) this.list.splice(i, 1)
    }
  }

  draw(ctx, region) {
    ctx.save()
    for (const b of this.list) {
      const x = region.x0 + b.x01 * (region.x1 - region.x0)
      ctx.strokeStyle = 'rgba(220,250,255,0.55)'
      ctx.lineWidth = 0.8
      ctx.beginPath()
      ctx.arc(x, b.y, b.r, 0, Math.PI * 2)
      ctx.stroke()
      ctx.fillStyle = 'rgba(255,255,255,0.65)'
      ctx.beginPath()
      ctx.arc(x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.3, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }
}

// ---------------------------------------------------------------------------
// Curved tube band — a thick liquid-filled glass line along an arbitrary
// polyline. Used by the dock and the background flourish.
// ---------------------------------------------------------------------------

export function tubePath(points, radius) {
  // Build a closed band by offsetting the polyline perpendicular ± radius.
  const n = points.length
  const up = [], down = []
  for (let i = 0; i < n; i++) {
    const a = points[Math.max(0, i - 1)]
    const b = points[Math.min(n - 1, i + 1)]
    let dx = b.x - a.x, dy = b.y - a.y
    const len = Math.hypot(dx, dy) || 1
    dx /= len; dy /= len
    up.push({ x: points[i].x - dy * radius, y: points[i].y + dx * radius })
    down.push({ x: points[i].x + dy * radius, y: points[i].y - dx * radius })
  }
  const dirAt = (i) => {
    const a = points[Math.max(0, i - 1)]
    const b = points[Math.min(n - 1, i + 1)]
    return Math.atan2(b.y - a.y, b.x - a.x)
  }
  const path = new Path2D()
  path.moveTo(up[0].x, up[0].y)
  for (let i = 1; i < n; i++) path.lineTo(up[i].x, up[i].y)
  // round end cap: sweep through the forward direction
  const e = points[n - 1]
  const de = dirAt(n - 1)
  path.arc(e.x, e.y, radius, de + Math.PI / 2, de - Math.PI / 2, true)
  for (let i = n - 2; i >= 0; i--) path.lineTo(down[i].x, down[i].y)
  // round start cap: sweep through the backward direction
  const s = points[0]
  const ds = dirAt(0)
  path.arc(s.x, s.y, radius, ds - Math.PI / 2, ds + Math.PI / 2, true)
  path.closePath()
  return path
}

export function sampleQuadratic(p0, p1, p2, steps) {
  const pts = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, u = 1 - t
    pts.push({
      x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
      y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
    })
  }
  return pts
}

export function sampleCubic(p0, p1, p2, p3, steps) {
  const pts = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, u = 1 - t
    pts.push({
      x: u*u*u*p0.x + 3*u*u*t*p1.x + 3*u*t*t*p2.x + t*t*t*p3.x,
      y: u*u*u*p0.y + 3*u*u*t*p1.y + 3*u*t*t*p2.y + t*t*t*p3.y,
    })
  }
  return pts
}
