// A tiny paper-folding engine.
//
// Every flap is a flat polygon, described in the coordinates it has when the
// whole sheet is lying open. A flap may hang off a parent by a hinge — a
// straight edge it shares with that parent — and carries an angle: 0° lies
// open and flat, 180° is folded right over onto the parent. World transforms
// compose down the tree, so a fan of flaps folded onto each other opens like
// a real paper fan: each one swings out off the edge of the one before.
//
// The camera is orthographic and looks straight down. Orthographic projection
// of a plane is affine, so every flap is drawn as an ordinary SVG <g> with a
// matrix() transform — text and all — and folding is just that matrix
// squashing toward the hinge. When a flap swings past 90° its back faces the
// viewer and the back side is shown instead. Flaps are painted back to front
// by height; anything off the table casts a soft shadow onto it.
//
// Coordinates: x right, y down (SVG), z toward the viewer.

const DEG = Math.PI / 180
const SVGNS = 'http://www.w3.org/2000/svg'

// Light from the upper left, a little in front.
const L = normalize([-0.38, -0.56, 0.74])
// How far a lifted flap's shadow slides per unit of height.
const SHADOW_SLIDE = [0.34, 0.5]
// Paper has thickness: a folded flap sits this far above what it folded onto,
// so stacked layers sort the right way round.
const PAPER = 0.6

function normalize(v) {
  const l = Math.hypot(...v)
  return v.map((c) => c / l)
}

// 3×4 affine matrices, row-major: [m00 m01 m02 m03  m10 m11 m12 m13  m20 m21 m22 m23].
export const IDENTITY = Object.freeze([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0])

export function mul(a, b) {
  const o = new Array(12)
  for (let r = 0; r < 3; r++) {
    const a0 = a[r * 4], a1 = a[r * 4 + 1], a2 = a[r * 4 + 2], a3 = a[r * 4 + 3]
    o[r * 4] = a0 * b[0] + a1 * b[4] + a2 * b[8]
    o[r * 4 + 1] = a0 * b[1] + a1 * b[5] + a2 * b[9]
    o[r * 4 + 2] = a0 * b[2] + a1 * b[6] + a2 * b[10]
    o[r * 4 + 3] = a0 * b[3] + a1 * b[7] + a2 * b[11] + a3
  }
  return o
}

// Rotation by `t` radians about the line through (px, py, 0) with in-plane unit
// direction (ux, uy), then a nudge of `lift` along z. Rodrigues with uz = 0.
function hinge(px, py, ux, uy, t, lift) {
  const c = Math.cos(t), s = Math.sin(t), k = 1 - c
  const r00 = c + ux * ux * k, r01 = ux * uy * k, r02 = uy * s
  const r10 = uy * ux * k, r11 = c + uy * uy * k, r12 = -ux * s
  const r20 = -uy * s, r21 = ux * s, r22 = c
  return [
    r00, r01, r02, px - (r00 * px + r01 * py),
    r10, r11, r12, py - (r10 * px + r11 * py),
    r20, r21, r22, -(r20 * px + r21 * py) + lift,
  ]
}

// Which way to turn so the flap swings *up* off the table, toward the viewer:
// a quarter turn has to carry its centroid to +z.
function upward(h, c) {
  const [p, q] = h
  const ux = q[0] - p[0], uy = q[1] - p[1]
  return ux * (c[1] - p[1]) - uy * (c[0] - p[0]) >= 0 ? 1 : -1
}

function centroid(poly) {
  let x = 0, y = 0
  for (const [px, py] of poly) { x += px; y += py }
  return [x / poly.length, y / poly.length]
}

export const ease = {
  out: (t) => 1 - Math.pow(1 - t, 3),
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  // a soft overshoot, like paper springing open past flat and settling
  back: (t) => {
    const c1 = 1.2, c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  },
}

export class Flap {
  /**
   * @param {object} o
   * @param {number[][]} o.poly    outline, lying open
   * @param {Flap} [o.parent]
   * @param {number[][]} [o.hinge] the edge it turns about (two points)
   * @param {number[][]} [o.liftHinge] an edge to tilt about for hover, which
   *   (unlike the hinge) children don't follow
   * @param {number} [o.angle]     starting fold, degrees
   * @param {SVGGElement} o.el     the drawing; children `.front`, `.back`, `.shade`
   */
  constructor(o) {
    this.poly = o.poly
    this.parent = o.parent ?? null
    this.children = []
    this.c = centroid(o.poly)
    this.depth = this.parent ? this.parent.depth + 1 : 0
    this.angle = o.angle ?? 0
    this.lift = 0
    this.liftTarget = 0
    this.tweens = []
    this.el = o.el
    this.front = o.el.querySelector('.front')
    this.back = o.el.querySelector('.back')
    this.shade = o.el.querySelector('.shade')
    this.shadow = null
    this.hidden = false
    this.gate = null // optional () => boolean: drawn only while it says so
    this.world = IDENTITY
    this.render = IDENTITY
    this.lastKey = ''
    if (this.parent) this.parent.children.push(this)
    this.setHinge(o.hinge ?? null)
    this.setLiftHinge(o.liftHinge ?? null)
  }

  setHinge(h) {
    this.hinge = h
    if (!h) return
    const [p, q] = h
    const l = Math.hypot(q[0] - p[0], q[1] - p[1])
    this.h = { px: p[0], py: p[1], ux: (q[0] - p[0]) / l, uy: (q[1] - p[1]) / l, sign: upward(h, this.c) }
  }

  setLiftHinge(h) {
    this.liftHinge = h
    if (!h) return
    const [p, q] = h
    const l = Math.hypot(q[0] - p[0], q[1] - p[1])
    this.lh = { px: p[0], py: p[1], ux: (q[0] - p[0]) / l, uy: (q[1] - p[1]) / l, sign: upward(h, this.c) }
  }

  /** Animate the fold angle, replacing whatever it was doing. */
  to(angle, opts) {
    this.tweens = []
    return this.then(angle, opts)
  }

  /** Queue a fold after the current one; `delay` counts from when it ends. */
  then(angle, { dur = 400, delay = 0, curve = ease.out, done } = {}) {
    this.tweens.push({ to: angle, dur, delay, curve, done, from: null, at: null })
    return this
  }

  get busy() {
    return this.tweens.length > 0 || Math.abs(this.lift - this.liftTarget) > 0.05
  }

  step(now, dt) {
    const tw = this.tweens[0]
    if (tw && tw.at === null) tw.at = now + tw.delay
    if (tw && now >= tw.at) {
      if (tw.from === null) tw.from = this.angle
      const t = Math.min(1, (now - tw.at) / tw.dur)
      this.angle = tw.from + (tw.to - tw.from) * tw.curve(t)
      if (t >= 1) {
        this.angle = tw.to
        this.tweens.shift()
        tw.done?.()
      }
    }
    if (this.lift !== this.liftTarget) {
      const k = 1 - Math.exp(-dt / 70)
      this.lift += (this.liftTarget - this.lift) * k
      if (Math.abs(this.lift - this.liftTarget) < 0.05) this.lift = this.liftTarget
    }
  }

  compose() {
    let local = IDENTITY
    if (this.h && this.angle !== 0) {
      const { px, py, ux, uy, sign } = this.h
      local = hinge(px, py, ux, uy, sign * this.angle * DEG, PAPER * Math.min(1, Math.abs(this.angle) / 90))
    }
    this.world = this.parent ? (local === IDENTITY ? this.parent.world : mul(this.parent.world, local)) : local
    this.render = this.world
    if (this.lh && this.lift !== 0) {
      const { px, py, ux, uy, sign } = this.lh
      this.render = mul(this.world, hinge(px, py, ux, uy, sign * this.lift * DEG, 0))
    }
    for (const ch of this.children) ch.compose()
  }

  /** Height of the centroid above the table. */
  get z() {
    const m = this.render
    return m[8] * this.c[0] + m[9] * this.c[1] + m[11]
  }
}

/**
 * Owns a set of root flaps and paints them into one SVG layer, back to front,
 * with a shadow layer slipped in between what lies on the table and what is
 * lifted off it.
 */
export class Sheet {
  constructor(layer) {
    this.layer = layer
    this.shadows = document.createElementNS(SVGNS, 'g')
    this.shadows.setAttribute('class', 'shadows')
    this.shadows.setAttribute('filter', 'url(#soft)')
    layer.appendChild(this.shadows)
    this.roots = []
    this.order = ''
    this.last = performance.now()
  }

  add(flap) {
    flap.el.__flap = flap
    if (!flap.parent) this.roots.push(flap)
    this.layer.appendChild(flap.el)
    flap.shadow = document.createElementNS(SVGNS, 'polygon')
    flap.shadow.setAttribute('points', flap.poly.map((p) => p.join(',')).join(' '))
    this.shadows.appendChild(flap.shadow)
    return flap
  }

  remove(flap) {
    for (const ch of [...flap.children]) this.remove(ch)
    flap.el.remove()
    flap.shadow?.remove()
    if (flap.parent) flap.parent.children = flap.parent.children.filter((f) => f !== flap)
    else this.roots = this.roots.filter((f) => f !== flap)
  }

  /** Every flap, each one after its parent. */
  *all() {
    const stack = [...this.roots]
    while (stack.length) {
      const f = stack.pop()
      yield f
      stack.push(...f.children)
    }
  }

  get busy() {
    for (const f of this.all()) if (f.busy) return true
    return false
  }

  frame(now = performance.now()) {
    const dt = Math.min(64, now - this.last)
    this.last = now
    for (const f of [...this.all()]) f.step(now, dt)
    // Gather again: a fold finishing this frame may have removed its flaps,
    // and painting a removed flap would put it straight back on the page.
    const flaps = [...this.all()]
    for (const r of this.roots) r.compose()

    const ground = []
    const raised = []
    for (const f of flaps) {
      // Parents come before children here, so a flap can inherit visibility.
      f._shown = !f.hidden && (!f.gate || f.gate()) && (!f.parent || f.parent._shown)
      if (!f._shown) {
        if (f.el.style.display !== 'none') f.el.style.display = 'none'
        if (f.shadow.style.display !== 'none') f.shadow.style.display = 'none'
        continue
      }
      if (f.el.style.display === 'none') f.el.style.display = ''
      f._z = f.z
      ;(f._z > 1 ? raised : ground).push(f)
      this.paint(f)
    }
    const byHeight = (a, b) => a._z - b._z || a.depth - b.depth || a.seq - b.seq
    ground.sort(byHeight)
    raised.sort(byHeight)

    for (const f of ground) f.shadow.style.display = 'none'
    for (const f of raised) {
      f.shadow.style.display = ''
      const m = f.render
      const [sx, sy] = SHADOW_SLIDE
      f.shadow.setAttribute(
        'transform',
        `matrix(${m[0] + sx * m[8]} ${m[4] + sy * m[8]} ${m[1] + sx * m[9]} ${m[5] + sy * m[9]} ${m[3] + sx * m[11]} ${m[7] + sy * m[11]})`,
      )
      f.shadow.style.opacity = Math.min(1, f._z / 40) * 0.3
    }

    const sequence = [...ground, this.shadows, ...raised]
    const key = sequence.map((f) => (f === this.shadows ? '|' : f.seq)).join(',')
    if (key !== this.order) {
      this.order = key
      for (const node of sequence) this.layer.appendChild(node === this.shadows ? node : node.el)
    }
  }

  paint(f) {
    const m = f.render
    const key = m.map((v) => v.toFixed(3)).join(' ')
    if (key === f.lastKey) return
    f.lastKey = key
    f.el.setAttribute('transform', `matrix(${m[0]} ${m[4]} ${m[1]} ${m[5]} ${m[3]} ${m[7]})`)
    // The front face's normal is the third column.
    const nz = m[10]
    const frontUp = nz >= 0
    if (f.front) f.front.style.display = frontUp ? '' : 'none'
    if (f.back) f.back.style.display = frontUp ? 'none' : ''
    if (f.shade) {
      const s = frontUp ? 1 : -1
      const dot = s * (m[2] * L[0] + m[6] * L[1] + m[10] * L[2])
      const light = Math.max(0.5, Math.min(1.16, 1 + (dot - L[2]) * 0.95))
      if (light < 1) {
        f.shade.setAttribute('fill', '#2b1a10')
        f.shade.style.opacity = ((1 - light) * 0.9).toFixed(3)
      } else {
        f.shade.setAttribute('fill', '#fffdf6')
        f.shade.style.opacity = ((light - 1) * 2.2).toFixed(3)
      }
    }
  }
}

let seq = 0
export function nextSeq() {
  return seq++
}
