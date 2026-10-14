// skin.js — what every SloshOS app is built on: a custom-shaped skin (no
// title bar — a pair of jelly orbs minimise and close it, Winamp style) that
// you can grab anywhere, fling, and bounce off the screen edges and the
// taskbar. Its liquid chambers feel every jolt, including being sucked down
// into the taskbar when minimised.
//
// Each skin is a wrapper div holding one canvas (painted body + liquid +
// overlays) and an invisible hit div clipped to the silhouette, so clicks on
// the transparent corners fall through to whatever is underneath.

import { Fluid } from './fluid.js'
import { Grid, clipPath } from './sdf.js'
import { Painter, withShadow, hex } from './skinart.js'
import { circle } from './sdf.js'

export const RES = Math.min(2, window.devicePixelRatio || 1)
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

let zTop = 20
const all = []
export const skins = all

// shared desktop facts: how much of the top the goo bar owns, and who to
// tell when focus or window state changes
export const desk = { ceil: 0, onFocus: null, onState: null }

// safe-area insets (notches, home bars), read through a probe element since
// env() is only visible to CSS
export const safe = { t: 0, l: 0, r: 0, b: 0 }
const probe = document.createElement('div')
probe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;' +
  'padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)'
document.documentElement.appendChild(probe)
export function readSafe() {
  const cs = getComputedStyle(probe)
  safe.t = parseFloat(cs.paddingTop) || 0
  safe.r = parseFloat(cs.paddingRight) || 0
  safe.b = parseFloat(cs.paddingBottom) || 0
  safe.l = parseFloat(cs.paddingLeft) || 0
}
readSafe()

const lerp = (a, b, t) => a + (b - a) * t
const coarse = matchMedia('(pointer: coarse)').matches
const easeIn = (t) => t * t * t
const easeOutBack = (t) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2)
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export class Skin {
  constructor(goo, { id, title, w, h, shape, margin = 44 }) {
    this.goo = goo
    this.id = id
    this.title = title ?? id
    this.state = 'open' // open | min | closed
    this.anim = null
    this.op = 1
    this.home = null
    this.w = w
    this.h = h
    this.shape = shape
    this.m = margin
    this.vessels = []
    this.buttons = []
    this.S = 1
    this.x = this.y = this.px = this.py = 0
    this.vx = this.vy = this.ax = this.ay = 0
    this.tvx = this.tvy = 0 // throw velocity
    this.sk = this.skv = this.st = this.stv = 0
    this.dragging = false
    this.onImpact = null

    const el = (this.el = document.createElement('div'))
    el.className = 'skin'
    el.style.width = w + 'px'
    el.style.height = h + 'px'
    const cv = (this.canvas = document.createElement('canvas'))
    cv.width = Math.ceil((w + margin * 2) * RES)
    cv.height = Math.ceil((h + margin * 2) * RES)
    cv.style.left = cv.style.top = -margin + 'px'
    cv.style.width = w + margin * 2 + 'px'
    cv.style.height = h + margin * 2 + 'px'
    el.appendChild(cv)
    this.ctx = cv.getContext('2d')
    const hit = (this.hit = document.createElement('div'))
    hit.className = 'hit'
    hit.style.clipPath = clipPath(shape, w, h)
    el.appendChild(hit)
    document.getElementById('desktop').appendChild(el)
    this.wireInput()
    all.push(this)
  }

  // ---- building ------------------------------------------------------------

  vessel({ x, y, w, h, inside, fluid = {}, look, fill, tint }) {
    const grid = new Grid(inside, w, h, 2)
    const f = new Fluid(grid, fluid)
    if (fill) f.fill(fill, tint)
    const v = { x, y, w, h, inside, fluid: f, look, skin: this }
    this.goo.add(v)
    this.vessels.push(v)
    return v
  }

  // r → round button, or w/h → rectangular. sprites: { up, down } canvases.
  button(b) {
    b.down = false
    b.squish = 0
    this.buttons.push(b)
    return b
  }

  painter() {
    return new Painter(this.w, this.h, RES, this.m)
  }

  bake(back, front, shadow = {}) {
    this.back = withShadow(back.canvas(), RES, shadow)
    this.front = front ? front.canvas() : null
  }

  // ---- input ---------------------------------------------------------------

  toLocal(cx, cy) {
    return [(cx - this.x) / this.S, (cy - this.y) / this.S]
  }

  // nearest round button within reach; fingers get at least a 14 px radius
  buttonAt(lx, ly) {
    const minR = coarse ? 14 / this.S : 0
    let best = null, bd = Infinity
    for (const b of this.buttons) {
      if (b.r) {
        const d = Math.hypot(lx - b.x, ly - b.y)
        if (d < Math.max(b.r + 3, minR) && d < bd) { best = b; bd = d }
      } else if (lx > b.x && lx < b.x + b.w && ly > b.y && ly < b.y + b.h) return b
    }
    return best
  }

  vesselAt(lx, ly) {
    for (const v of this.vessels) {
      if (v.inside(lx - v.x, ly - v.y) < 0) return v
    }
    return null
  }

  focus() {
    this.el.style.zIndex = ++zTop
    desk.onFocus?.(this)
  }

  // the two jelly orbs every skin carries instead of a title bar
  controls(min, close, r = 6) {
    const orb = (col) => (p, ox, oy, down) => {
      p.part(circle(ox + r, oy + r, r + 1.2), { type: 'chrome', color: [0.9, 0.95, 1.1], bevel: 2, pillow: 0.5 })
      p.part(circle(ox + r, oy + r, r - 0.4), { type: 'plastic', color: down ? col.map((c) => c * 0.7) : col, bevel: r, pillow: 0.2 })
    }
    const ink = (ctx) => { ctx.strokeStyle = 'rgba(60,20,0,0.75)'; ctx.lineWidth = 1.4; ctx.lineCap = 'round' }
    this.button({
      x: min[0], y: min[1], r,
      sprite: buttonSprites(r * 2, r * 2, orb(hex('#ffc21a')), (ctx, x, y) => {
        ink(ctx); ctx.beginPath(); ctx.moveTo(x - r * 0.45, y + 0.5); ctx.lineTo(x + r * 0.45, y + 0.5); ctx.stroke()
      }),
      press: () => this.onMinimize?.(),
    })
    this.button({
      x: close[0], y: close[1], r,
      sprite: buttonSprites(r * 2, r * 2, orb(hex('#ff3d5a')), (ctx, x, y) => {
        ink(ctx)
        const k = r * 0.38
        ctx.beginPath(); ctx.moveTo(x - k, y - k); ctx.lineTo(x + k, y + k); ctx.moveTo(x + k, y - k); ctx.lineTo(x - k, y + k); ctx.stroke()
      }),
      press: () => this.onClose?.(),
    })
  }

  // a miniature of the painted body, for taskbar buttons and desktop icons
  icon(size) {
    const c = document.createElement('canvas')
    c.width = c.height = Math.round(size * RES)
    const ctx = c.getContext('2d')
    const k = Math.min(size / this.w, size / this.h) * 0.94
    const w = this.w * k, h = this.h * k
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(this.back, this.m * RES, this.m * RES, this.w * RES, this.h * RES,
      ((size - w) / 2) * RES, ((size - h) / 2) * RES, w * RES, h * RES)
    this.iconHook?.(ctx, size, k, (size - w) / 2, (size - h) / 2)
    return c
  }

  // ---- window state ----------------------------------------------------------

  animate(kind, to, dur) {
    this.tvx = this.tvy = 0
    this.dragging = false
    this.anim = { kind, t: 0, dur, from: { x: this.x, y: this.y, S: this.S, o: this.op }, to }
    if (kind === 'restore' || kind === 'open') {
      this.state = 'open'
      this.el.style.visibility = ''
      this.focus()
    }
  }

  // slurp down into a point (a taskbar button), keeping where we were
  minimize(cx, cy) {
    if (this.state !== 'open') return
    this.home = { x: this.x, y: this.y, S: this.S }
    const s = 0.05
    this.animate('min', { x: cx - (this.w * s) / 2, y: cy - (this.h * s) / 2, S: s, o: 0.3 }, 0.34)
  }

  restore(fromX, fromY) {
    if (this.state === 'open') { this.focus(); this.stv -= 1.5; return }
    const h = this.home
    if (fromX != null) {
      const s = 0.05
      this.place(fromX - (this.w * s) / 2, fromY - (this.h * s) / 2, s)
      this.op = 0.3
    }
    this.animate(this.state === 'closed' ? 'open' : 'restore', { x: h.x, y: h.y, S: h.S, o: 1 }, 0.42)
  }

  close() {
    if (this.state !== 'open') return
    this.home = { x: this.x, y: this.y, S: this.S }
    const s = this.S * 0.2
    const cx = this.x + (this.w * this.S) / 2, cy = this.y + (this.h * this.S) / 2
    this.animate('close', { x: cx - (this.w * s) / 2, y: cy - (this.h * s) / 2, S: s, o: 0 }, 0.26)
  }

  glide(x, y, S) {
    if (this.state !== 'open') { this.home = { x, y, S }; return }
    this.animate('move', { x, y, S, o: 1 }, 0.6)
  }

  wireInput() {
    const hit = this.hit
    let grabX = 0, grabY = 0, moved = 0, hist = [], last = null, dragId = null
    const pressed = new Map() // pointerId → button, so two thumbs can hold two pumps
    hit.addEventListener('pointerdown', (e) => {
      e.preventDefault()
      if (this.anim) return
      this.focus()
      hit.setPointerCapture(e.pointerId)
      const [lx, ly] = this.toLocal(e.clientX, e.clientY)
      const b = this.buttonAt(lx, ly)
      if (b) {
        pressed.set(e.pointerId, b)
        b.down = true
        b.squish = 1
        b.press?.(lx, ly)
        return
      }
      if (this.dragging) return // a second finger can't steal the drag
      this.dragging = true
      dragId = e.pointerId
      grabX = e.clientX - this.x
      grabY = e.clientY - this.y
      moved = 0
      hist = [[e.clientX, e.clientY, e.timeStamp]]
    })
    hit.addEventListener('pointermove', (e) => {
      const [lx, ly] = this.toLocal(e.clientX, e.clientY)
      const pb = pressed.get(e.pointerId)
      if (pb) { pb.drag?.(lx, ly); return }
      if (this.dragging) {
        if (e.pointerId !== dragId) return
        const S = this.S
        const nx = clamp(e.clientX - grabX, safe.l - this.w * S * 0.6, innerWidth - safe.r - this.w * S * 0.4)
        const ny = clamp(e.clientY - grabY, desk.ceil - this.h * S * 0.3, innerHeight - this.h * S * 0.3)
        moved += Math.hypot(nx - this.x, ny - this.y)
        this.x = nx
        this.y = ny
        hist.push([e.clientX, e.clientY, e.timeStamp])
        if (hist.length > 8) hist.shift()
        return
      }
      // hover: the pointer stirs whatever liquid it passes through
      if (e.pointerType === 'mouse' && last) {
        const dt = Math.max(8, e.timeStamp - last[2]) / 1000
        const v = this.vesselAt(lx, ly)
        if (v) {
          const svx = clamp((lx - last[0]) / dt, -1600, 1600)
          const svy = clamp((ly - last[1]) / dt, -1600, 1600)
          v.fluid.impulse(lx - v.x, ly - v.y, 22, svx * 0.06, svy * 0.06)
        }
      }
      last = [lx, ly, e.timeStamp]
    })
    const up = (e) => {
      const pb = pressed.get(e.pointerId)
      if (pb) {
        pressed.delete(e.pointerId)
        // another finger may still be holding the same button
        if (![...pressed.values()].includes(pb)) {
          pb.down = false
          pb.release?.()
        }
        return
      }
      if (!this.dragging || e.pointerId !== dragId) return
      this.dragging = false
      dragId = null
      const [lx, ly] = this.toLocal(e.clientX, e.clientY)
      if (moved < 5) {
        this.click(lx, ly)
        this.tvx = this.tvy = 0
        return
      }
      // throw: velocity over the last stretch of pointer history, unless the
      // pointer had come to rest before letting go
      const now = e.timeStamp
      const lastH = hist[hist.length - 1]
      const recent = hist.filter((h) => lastH[2] - h[2] < 140)
      const a = recent.length >= 2 ? recent[0] : hist[hist.length - 2]
      if (a && now - lastH[2] < 170 && lastH[2] - a[2] < 300) {
        const dt = Math.max(16, lastH[2] - a[2]) / 1000
        this.tvx = clamp((lastH[0] - a[0]) / dt, -3000, 3000)
        this.tvy = clamp((lastH[1] - a[1]) / dt, -3000, 3000)
      } else {
        this.tvx = this.tvy = 0
      }
    }
    hit.addEventListener('pointerup', up)
    hit.addEventListener('pointercancel', up)
    hit.addEventListener('pointerleave', () => { last = null })
  }

  // a click (no drag) on a chamber drops a plop into it
  click(lx, ly) {
    const v = this.vesselAt(lx, ly)
    if (v) v.fluid.burst(lx - v.x, ly - v.y, 46, 520)
  }

  // ---- motion --------------------------------------------------------------

  place(x, y, S) {
    this.S = S
    this.x = this.px = x
    this.y = this.py = y
    if (this.state !== 'open') this.home = { x, y, S }
  }

  update(dt) {
    if (this.state !== 'open' && !this.anim) return
    if (this.anim) {
      const a = this.anim
      a.t += dt
      const k = Math.min(1, a.t / a.dur)
      const e = a.kind === 'min' || a.kind === 'close' ? easeIn(k) : a.kind === 'move' ? easeInOut(k) : easeOutBack(k)
      this.x = lerp(a.from.x, a.to.x, e)
      this.y = lerp(a.from.y, a.to.y, e)
      this.S = lerp(a.from.S, a.to.S, Math.min(1, e))
      this.op = lerp(a.from.o, a.to.o, Math.min(1, k * 1.2))
      this.el.style.opacity = this.op
      if (k >= 1) {
        this.anim = null
        if (a.kind === 'min' || a.kind === 'close') {
          this.state = a.kind === 'min' ? 'min' : 'closed'
          this.el.style.visibility = 'hidden'
          this.vx = this.vy = this.ax = this.ay = 0
        } else {
          this.stv -= 2.2
        }
        desk.onState?.(this)
      }
    }
    const S = this.S
    if (!this.dragging && !this.anim) {
      this.x += this.tvx * dt
      this.y += this.tvy * dt
      const fr = Math.exp(-2.4 * dt)
      this.tvx *= fr
      this.tvy *= fr
      const maxX = Math.max(safe.l, innerWidth - safe.r - this.w * S)
      const maxY = Math.max(desk.ceil, innerHeight - safe.b - this.h * S)
      // past an edge: bounce if moving out, then ease back in over a few
      // frames rather than snapping (a skin let go deep under the goo)
      const edge = (pos, vel, lo, hi, axis) => {
        if (pos < lo) {
          if (vel < -60) { this.impact(-vel, axis); vel = -vel * 0.55 }
          vel += Math.min(lo - pos, 4) * 40 * dt
          pos = Math.max(pos, lo - 2 - (lo - 2 - pos) * Math.exp(-12 * dt))
        } else if (pos > hi) {
          if (vel > 60) { this.impact(vel, axis); vel = -vel * 0.55 }
          vel += Math.max(hi - pos, -4) * 40 * dt
          pos = Math.min(pos, hi + 2 + (pos - hi - 2) * Math.exp(-12 * dt))
        }
        return [pos, vel]
      }
      ;[this.x, this.tvx] = edge(this.x, this.tvx, safe.l, maxX, 'x')
      ;[this.y, this.tvy] = edge(this.y, this.tvy, desk.ceil, maxY, 'y')
    }
    const nvx = (this.x - this.px) / dt
    const nvy = (this.y - this.py) / dt
    const s = Math.min(1, 16 * dt)
    this.ax += (clamp((nvx - this.vx) / dt, -14000, 14000) - this.ax) * s
    this.ay += (clamp((nvy - this.vy) / dt, -14000, 14000) - this.ay) * s
    this.vx = nvx
    this.vy = nvy
    this.px = this.x
    this.py = this.y

    // jelly: skew follows horizontal jolts, squash follows vertical ones
    this.skv += (-210 * this.sk - 12 * this.skv + this.ax * 0.0028) * dt
    this.sk = clamp(this.sk + this.skv * dt, -0.16, 0.16)
    this.stv += (-210 * this.st - 12 * this.stv + this.ay * 0.0022) * dt
    this.st = clamp(this.st + this.stv * dt, -0.12, 0.12)
    const hw = this.w / 2, hh = this.h / 2
    this.el.style.transform =
      `translate(${this.x}px,${this.y}px) scale(${S}) translate(${hw}px,${hh}px) ` +
      `skewX(${this.sk}rad) scale(${1 - this.st * 0.5},${1 + this.st}) translate(${-hw}px,${-hh}px)`

    const lax = clamp(this.ax / S, -6000, 6000)
    const lay = clamp(this.ay / S, -6000, 6000)
    for (const v of this.vessels) v.fluid.step(dt, lax, lay)
    for (const b of this.buttons) b.squish = b.down ? 1 : b.squish * Math.exp(-14 * dt)
  }

  impact(speed, axis) {
    const k = Math.min(1, speed / 1600)
    if (axis === 'x') this.skv += (Math.random() < 0.5 ? -1 : 1) * 3 * k
    else this.stv -= 3.5 * k
    this.onImpact?.(speed, axis)
  }

  // ---- drawing -------------------------------------------------------------

  draw(t, dt) {
    if (this.state !== 'open' && !this.anim) return
    const { ctx, m } = this
    ctx.setTransform(RES, 0, 0, RES, m * RES, m * RES)
    ctx.clearRect(-m, -m, this.w + m * 2, this.h + m * 2)
    ctx.drawImage(this.back, -m, -m, this.w + m * 2, this.h + m * 2)
    this.drawUnder?.(ctx, t, dt)
    for (const v of this.vessels) this.goo.blit(ctx, v, v.x, v.y)
    this.drawOver?.(ctx, t, dt)
    if (this.front) ctx.drawImage(this.front, -m, -m, this.w + m * 2, this.h + m * 2)
    for (const b of this.buttons) {
      if (!b.sprite) continue
      const img = b.down ? b.sprite.down : b.sprite.up
      const sx = 1 + b.squish * 0.05, sy = 1 - b.squish * 0.07
      const cx = b.r ? b.x : b.x + b.w / 2, cy = b.r ? b.y : b.y + b.h / 2
      const sw = img.width / RES, sh = img.height / RES
      ctx.drawImage(img, cx - (sw * sx) / 2, cy - (sh * sy) / 2 + b.squish * 1.2, sw * sx, sh * sy)
    }
    this.drawTop?.(ctx, t, dt)
  }
}

// A button sprite pair (up / down) from a painter callback plus an optional
// glyph drawn on top in plain canvas.
export function buttonSprites(w, h, paint, glyph) {
  const pad = 8
  const make = (down) => {
    const p = new Painter(w + pad * 2, h + pad * 2, RES, 0)
    paint(p, pad, pad, down)
    const c = withShadow(p.canvas(), RES, { blur: down ? 3 : 7, dy: down ? 1 : 3, color: 'rgba(0,0,20,0.6)' })
    if (glyph) {
      const ctx = c.getContext('2d')
      ctx.setTransform(RES, 0, 0, RES, 0, 0)
      glyph(ctx, pad + w / 2, pad + h / 2 + (down ? 0.6 : 0), down)
    }
    return c
  }
  return { up: make(false), down: make(true) }
}
