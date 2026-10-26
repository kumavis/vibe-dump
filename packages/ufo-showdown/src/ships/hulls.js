// The six hulls the store sells. Each is drawn nose up, centred on (0, 0), in
// the same units as art.js `drawShip`: about 64 wide and 70 tall, with the
// engine flames hanging below.
//
// A hull is
//   engines  [x, y, halfWidth, length] per flame, drawn under the hull
//   lights   [x, y] of the right wingtip light (the left one mirrors it)
//   grads    gradients it needs for a paint, made once per paint
//   draw     wings and their panels, coat(wings), fuselage, coat(fuselage),
//            then nozzles, guns and cockpit, so the paint's pattern lands on
//            the metal and never over the detail
//
// Silhouettes have to survive the HUD's 0.32 scale, where a ship is twenty
// pixels across: the Comet is an arrow, the Twinfang a fork, the Bulwark a
// brick, the Lancer a sword and the Phoenix a bird.

import { coat, sheen, linear, glow, stamp, TAU } from './paint.js'
import { hexA } from '../stars.js'

// ---------------------------------------------------------------- shapes
//
// A shape is a list of points: [x, y] starts it or draws a straight line,
// [cx, cy, x, y] a quadratic and [c1x, c1y, c2x, c2y, x, y] a cubic curve.
// Everything is wound clockwise, so the surfaces of a hull can be merged into
// one path and painted in one go without the overlaps cancelling out.

function trace(path, pts, mx = 1, move = true) {
  const [x0, y0] = pts[0]
  if (move) path.moveTo(x0 * mx, y0)
  else path.lineTo(x0 * mx, y0)
  for (let i = 1; i < pts.length; i++) {
    const s = pts[i]
    if (s.length === 2) path.lineTo(s[0] * mx, s[1])
    else if (s.length === 4) path.quadraticCurveTo(s[0] * mx, s[1], s[2] * mx, s[3])
    else path.bezierCurveTo(s[0] * mx, s[1], s[2] * mx, s[3], s[4] * mx, s[5])
  }
}

// The same outline walked from its far end back to its start.
function reverse(pts) {
  const out = [pts[pts.length - 1].slice(-2)]
  for (let i = pts.length - 1; i > 0; i--) {
    const s = pts[i]
    const prev = pts[i - 1].slice(-2)
    if (s.length === 2) out.push(prev)
    else if (s.length === 4) out.push([s[0], s[1], ...prev])
    else out.push([s[2], s[3], s[0], s[1], ...prev])
  }
  return out
}

// A symmetric outline from its right half, traced from the top centre down to
// the bottom centre.
function sym(pts) {
  const p = new Path2D()
  trace(p, pts)
  trace(p, reverse(pts), -1, false)
  p.closePath()
  return p
}

// One part on its own, or (mx = -1) its mirror image, still wound clockwise.
function part(pts, mx = 1) {
  const p = new Path2D()
  trace(p, mx > 0 ? pts : reverse(pts), mx)
  p.closePath()
  return p
}

// A part on the right (wound clockwise) and its mirror image on the left.
function pair(pts) {
  const p = new Path2D()
  trace(p, pts)
  p.closePath()
  trace(p, reverse(pts), -1)
  p.closePath()
  return p
}

function union(...paths) {
  const p = new Path2D()
  for (const q of paths) p.addPath(q)
  return p
}

function rounded(...rects) {
  const p = new Path2D()
  for (const [x, y, w, h, r] of rects) p.roundRect(x, y, w, h, r)
  return p
}

// ---------------------------------------------------------------- shared detail

const METAL = '#56607a'
const GUNMETAL = '#3a4258'
const STEEL = '#c9d2e8'

// Engine nozzles with the white-hot rim the flame comes out of.
function nozzles(ctx, path, rims) {
  ctx.fillStyle = METAL
  ctx.fill(path)
  ctx.fillStyle = '#ffffff'
  ctx.fill(rims)
}

// The glass bubble every hull has somewhere, with its glint.
function canopyGrad(cy, ry) {
  return linear(0, cy - ry * 1.1, 0, cy + ry, [
    [0, '#1b2440'],
    [1, '#3d5a8a'],
  ])
}

function canopy(ctx, grad, cx, cy, rx, ry) {
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.ellipse(cx, cy, rx, ry, 0, 0, TAU)
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.beginPath()
  ctx.ellipse(cx - rx * 0.33, cy - ry * 0.36, rx * 0.29, ry * 0.36, 0, 0, TAU)
  ctx.fill()
}

// The left-to-right shading of a fuselage: shadow, highlight, paint.
function bodyGrad(pal, x0, x1) {
  return linear(x0, 0, x1, 0, [
    [0, pal.dark],
    [0.42, pal.light],
    [1, pal.main],
  ])
}

// ---------------------------------------------------------------- Striker
//
// The trusty one: today's ship from art.js `drawShip`, path for path.

const striker = {
  id: 'striker',
  engines: [[-9, 20, 5, 1], [9, 20, 5, 1]],
  lights: [31, 14],
  wings: sym([[0, -14], [32, 13], [30, 24], [11, 19], [0, 19]]),
  panels: pair([[14, 4], [30, 15], [29, 20], [14, 13]]),
  pods: rounded([-14, 8, 10, 14, 3], [4, 8, 10, 14, 3]),
  rims: rounded([-12, 20, 6, 2, 0], [6, 20, 6, 2, 0]),
  fus: sym([[0, -36], [9, -24, 12, -4, 10, 20], [0, 20]]),
  grads: (pal) => ({ fus: bodyGrad(pal, -12, 12), shade: sheen(-12, 12), canopy: canopyGrad(-8, 11) }),
  draw(ctx, pal, c, t) {
    ctx.fillStyle = pal.dark
    ctx.fill(this.wings)
    ctx.fillStyle = pal.main
    ctx.fill(this.panels)
    coat(ctx, this.wings, pal, c, t)
    nozzles(ctx, this.pods, this.rims)
    ctx.fillStyle = c.fus
    ctx.fill(this.fus)
    coat(ctx, this.fus, pal, c, t, c.shade)
    canopy(ctx, c.canopy, 0, -8, 5.5, 11)
  },
}

// ---------------------------------------------------------------- Comet
//
// A needle with barbed, swept-back wings and one big engine: an arrow.

const comet = {
  id: 'comet',
  engines: [[0, 23, 6, 1.35]],
  lights: [25, 23],
  wings: union(
    sym([[0, -12], [5, -9], [26, 21], [25, 26], [9, 17], [0, 17]]),
    // little canards up front, the fast-plane tell
    pair([[3, -24], [11, -14], [10.5, -10.5], [3, -15]]),
  ),
  panels: pair([[7.5, -4.5], [25, 20.5], [23, 22], [7, 0]]),
  pods: rounded([-5.5, 16, 11, 8, 3]),
  rims: rounded([-4, 22, 8, 2, 0]),
  fus: sym([[0, -38], [2.5, -30, 7, -14, 7, 2], [6, 23], [0, 23]]),
  grads: (pal) => ({ fus: bodyGrad(pal, -7, 7), shade: sheen(-7, 7), canopy: canopyGrad(-12, 10) }),
  draw(ctx, pal, c, t) {
    ctx.fillStyle = pal.dark
    ctx.fill(this.wings)
    ctx.fillStyle = pal.main
    ctx.fill(this.panels)
    coat(ctx, this.wings, pal, c, t)
    ctx.fillStyle = c.fus
    ctx.fill(this.fus)
    coat(ctx, this.fus, pal, c, t, c.shade)
    nozzles(ctx, this.pods, this.rims)
    canopy(ctx, c.canopy, 0, -12, 3.8, 9.5)
  },
}

// ---------------------------------------------------------------- Twinfang
//
// Two fuselages, each with a cannon in its nose, either side of a short
// cockpit pod: a fork with its prongs forward.

const POD = [[14, -33], [18, -26, 20, -14, 20, 0], [20, 18], [20, 23, 15, 23], [13, 23], [8, 23, 8, 18], [8, 0], [8, -14, 10, -26, 14, -33]]

const twinfang = {
  id: 'twinfang',
  engines: [[-14, 23, 4.5, 1], [14, 23, 4.5, 1]],
  lights: [31, 16],
  wings: sym([[0, -2], [22, 0], [31, 11], [31, 21], [20, 21], [0, 21]]),
  panels: pair([[21, 5], [30, 13], [30, 19], [21, 17]]),
  podL: part(POD, -1),
  podR: part(POD),
  center: sym([[0, -20], [5, -14, 8, -8, 8, 0], [8, 18], [0, 18]]),
  barrels: rounded([-16.75, -36.5, 5.5, 20, 2.2], [11.25, -36.5, 5.5, 20, 2.2]),
  muzzles: rounded([-17.6, -38.2, 7.2, 4.6, 1.6], [10.4, -38.2, 7.2, 4.6, 1.6]),
  nozzle: rounded([-18.5, 19, 9, 5, 2], [9.5, 19, 9, 5, 2]),
  rims: rounded([-17, 23, 6, 1.6, 0], [11, 23, 6, 1.6, 0]),
  grads: (pal) => ({
    left: bodyGrad(pal, -20, -8),
    right: bodyGrad(pal, 8, 20),
    center: bodyGrad(pal, -8, 8),
    shadeL: sheen(-20, -8),
    shadeR: sheen(8, 20),
    shade: sheen(-8, 8),
    canopy: canopyGrad(-4, 9),
  }),
  draw(ctx, pal, c, t) {
    ctx.fillStyle = pal.dark
    ctx.fill(this.wings)
    ctx.fillStyle = pal.main
    ctx.fill(this.panels)
    coat(ctx, this.wings, pal, c, t)
    // each pod gets its own shading, so the pair reads as two round hulls
    ctx.fillStyle = c.left
    ctx.fill(this.podL)
    coat(ctx, this.podL, pal, c, t, c.shadeL)
    ctx.fillStyle = c.right
    ctx.fill(this.podR)
    coat(ctx, this.podR, pal, c, t, c.shadeR)
    ctx.fillStyle = c.center
    ctx.fill(this.center)
    coat(ctx, this.center, pal, c, t, c.shade)
    nozzles(ctx, this.nozzle, this.rims)
    ctx.fillStyle = GUNMETAL
    ctx.fill(this.barrels)
    ctx.fillStyle = STEEL
    ctx.fill(this.muzzles)
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.fillRect(-15.6, -33.5, 1.3, 15)
    ctx.fillRect(12.4, -33.5, 1.3, 15)
    canopy(ctx, c.canopy, 0, -4, 4.5, 9)
  },
}

// ---------------------------------------------------------------- Bulwark
//
// Wide, flat-nosed and plated, with shoulder guns and four engines: a brick
// that flies.

const bulwark = {
  id: 'bulwark',
  engines: [[-6.5, 26, 5, 0.9], [6.5, 26, 5, 0.9], [-23, 27, 4, 0.75], [23, 27, 4, 0.75]],
  lights: [31.6, 10],
  wings: sym([[0, -14], [18, -12], [30.5, -4.5], [33.6, 0.5], [33.6, 21], [29, 27], [12, 26], [0, 26]]),
  plates: pair([[15, -6], [28, -0.5], [28, 19], [25, 23], [15, 22]]),
  // thick bumpers down the wingtips
  bumpers: pair([[29.8, -2.7], [33.6, 0.5], [33.6, 21], [29.8, 25]]),
  fus: sym([[0, -31], [7, -31], [12, -24], [13, -4], [13, 26], [0, 26]]),
  ram: sym([[0, -32.5], [7.5, -32.5], [12.6, -24.6], [9.5, -22], [0, -25]]),
  guns: rounded([-25, -20, 6, 15, 2], [19, -20, 6, 15, 2]),
  gunTips: rounded([-25.5, -21.5, 7, 4, 1.5], [18.5, -21.5, 7, 4, 1.5]),
  nozzle: rounded([-12, 20, 11, 6.5, 2.5], [1, 20, 11, 6.5, 2.5], [-27.5, 22, 9, 5, 2], [18.5, 22, 9, 5, 2]),
  rims: rounded([-9.5, 25.5, 6, 1.6, 0], [3.5, 25.5, 6, 1.6, 0], [-26, 26, 6, 1.4, 0], [20, 26, 6, 1.4, 0]),
  rivets: (() => {
    const p = new Path2D()
    for (const [x, y] of [[17.5, -2.5], [26.5, 1.5], [17.5, 19.5], [26.5, 19.5], [10.5, -14], [10.5, 3], [10.5, 18]]) {
      for (const s of [-1, 1]) {
        p.moveTo(s * x + 1, y)
        p.arc(s * x, y, 1, 0, TAU)
      }
    }
    return p
  })(),
  grads: (pal) => ({
    fus: bodyGrad(pal, -13, 13),
    shade: sheen(-13, 13),
    visor: linear(0, -21, 0, -14, [
      [0, '#1b2440'],
      [1, '#3d5a8a'],
    ]),
  }),
  draw(ctx, pal, c, t) {
    ctx.fillStyle = pal.dark
    ctx.fill(this.wings)
    ctx.fillStyle = pal.main
    ctx.fill(this.plates)
    ctx.fillStyle = pal.light
    ctx.fill(this.bumpers)
    coat(ctx, this.wings, pal, c, t)
    ctx.fillStyle = c.fus
    ctx.fill(this.fus)
    ctx.fillStyle = pal.dark
    ctx.fill(this.ram)
    coat(ctx, this.fus, pal, c, t, c.shade)
    // seams between the armour plates
    ctx.strokeStyle = 'rgba(0,0,0,0.3)'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    for (const s of [-1, 1]) {
      ctx.moveTo(s * 12, -9)
      ctx.lineTo(s * 4, -7)
      ctx.moveTo(s * 13, 10)
      ctx.lineTo(s * 4, 11)
      ctx.moveTo(s * 15.5, 10)
      ctx.lineTo(s * 28, 10.5)
    }
    ctx.stroke()
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.fill(this.rivets)
    nozzles(ctx, this.nozzle, this.rims)
    ctx.fillStyle = GUNMETAL
    ctx.fill(this.guns)
    ctx.fillStyle = STEEL
    ctx.fill(this.gunTips)
    // a slit visor, not a bubble: this one is all armour
    ctx.fillStyle = c.visor
    ctx.beginPath()
    ctx.roundRect(-7, -20.5, 14, 6.5, 3.25)
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.beginPath()
    ctx.roundRect(-5, -19, 5, 1.8, 0.9)
    ctx.fill()
  },
}

// ---------------------------------------------------------------- Lancer
//
// A long lance with a glowing tip, a cone guard where it meets the hull, and
// forward-swept wings: a sword, point first.

const lancer = {
  id: 'lancer',
  engines: [[-5.5, 22, 4.2, 1], [5.5, 22, 4.2, 1]],
  lights: [30, -4],
  wings: sym([[0, 2], [27, -7], [31, -5], [30, 2], [11, 20], [0, 20]]),
  panels: pair([[11, 0], [27, -5], [28.5, -2.5], [12, 6]]),
  fus: union(sym([[0, -13], [6, -9, 9, 0, 9, 8], [8, 23], [0, 23]]), sym([[0, -18], [9, -16], [14, -8], [11, -4], [0, -7]])),
  guard: sym([[0, -18], [9, -16], [14, -8], [11, -4], [0, -7]]),
  shaft: rounded([-1.8, -33, 3.6, 18, 1.8]),
  bands: rounded([-2.4, -27, 4.8, 2.2, 1], [-2.4, -22, 4.8, 2.2, 1]),
  tip: sym([[0, -38.5], [3.6, -32.5], [0, -29.5]]),
  nozzle: rounded([-10, 16, 9, 7, 2.5], [1, 16, 9, 7, 2.5]),
  rims: rounded([-8.5, 22, 6, 1.6, 0], [2.5, 22, 6, 1.6, 0]),
  grads: (pal) => ({
    fus: bodyGrad(pal, -10, 10),
    shade: sheen(-10, 10),
    guard: bodyGrad(pal, -14, 14),
    canopy: canopyGrad(3, 8),
  }),
  draw(ctx, pal, c, t) {
    ctx.fillStyle = pal.dark
    ctx.fill(this.wings)
    ctx.fillStyle = pal.main
    ctx.fill(this.panels)
    coat(ctx, this.wings, pal, c, t)
    // the lance goes in first, so the guard sits over its root
    ctx.fillStyle = STEEL
    ctx.fill(this.shaft)
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.fillRect(-0.9, -32, 0.8, 16)
    ctx.fillStyle = pal.main
    ctx.fill(this.bands)
    ctx.fillStyle = c.fus
    ctx.fill(this.fus)
    ctx.fillStyle = c.guard
    ctx.fill(this.guard)
    coat(ctx, this.fus, pal, c, t, c.shade)
    ctx.strokeStyle = hexA(pal.light, 0.7)
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(-12.5, -6)
    ctx.quadraticCurveTo(0, -10, 12.5, -6)
    ctx.stroke()
    nozzles(ctx, this.nozzle, this.rims)
    canopy(ctx, c.canopy, 0, 3, 4.5, 8)
    // the tip glows: that's what punches through a row of saucers
    const a0 = ctx.globalAlpha
    ctx.globalAlpha = a0 * (0.75 + 0.25 * Math.sin(t * 7))
    stamp(ctx, glow(pal.flame), 0, -34, 9)
    ctx.globalAlpha = a0
    ctx.fillStyle = pal.light
    ctx.fill(this.tip)
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.moveTo(0, -37.5)
    ctx.lineTo(1.4, -33)
    ctx.lineTo(0, -31)
    ctx.closePath()
    ctx.fill()
  },
}

// ---------------------------------------------------------------- Phoenix
//
// A bird with its wings spread: feathered trailing edges that burn at the
// tips, a fanned tail with the engine in its notch, and embers falling away.

const PHOENIX_WINGS = sym([
  [0, -12],
  [14, -23, 26, -22, 34, -15],
  [29, -9],
  [33, -1],
  [26, 0],
  [28, 8],
  [20, 5.5],
  [21, 14],
  [13, 8.5],
  [0, 10],
])
const PHOENIX_TAIL = sym([[0, 6], [6, 8], [13, 27], [7.5, 23], [5, 30], [0, 21]])

const phoenix = {
  id: 'phoenix',
  engines: [[0, 19, 6, 1.4]],
  lights: [33.5, -14.5],
  wings: PHOENIX_WINGS,
  tail: PHOENIX_TAIL,
  plumage: union(PHOENIX_WINGS, PHOENIX_TAIL),
  feathers: (() => {
    const p = new Path2D()
    for (const s of [-1, 1]) {
      for (const [x, y] of [[29, -9], [26, 0], [20, 5.5]]) {
        p.moveTo(s * 9, -5)
        p.quadraticCurveTo(s * (x * 0.6), y * 0.2 - 4, s * x, y)
      }
      p.moveTo(s * 4, 10)
      p.lineTo(s * 7.5, 23)
    }
    return p
  })(),
  fus: sym([[0, -36], [3, -31, 6, -28, 6, -23], [5, -19], [9, -15, 10, -7, 9, 1], [6, 13], [0, 17]]),
  beak: sym([[0, -37], [3.2, -30.5], [0, -31.5]]),
  grads: (pal) => ({
    // dark at the shoulders, burning at the tips
    wings: linear(-35, 0, 35, 0, [
      [0, '#fff3c4'],
      [0.08, pal.flame],
      [0.26, pal.main],
      [0.5, pal.dark],
      [0.74, pal.main],
      [0.92, pal.flame],
      [1, '#fff3c4'],
    ]),
    tail: linear(0, 6, 0, 30, [
      [0, pal.dark],
      [0.45, pal.main],
      [1, pal.flame],
    ]),
    fus: bodyGrad(pal, -10, 10),
    shade: sheen(-10, 10),
    canopy: canopyGrad(-9, 7),
  }),
  draw(ctx, pal, c, t) {
    ctx.fillStyle = c.tail
    ctx.fill(this.tail)
    ctx.fillStyle = c.wings
    ctx.fill(this.wings)
    coat(ctx, this.plumage, pal, c, t)
    ctx.strokeStyle = hexA(pal.light, 0.45)
    ctx.lineWidth = 1
    ctx.stroke(this.feathers)
    ctx.fillStyle = c.fus
    ctx.fill(this.fus)
    coat(ctx, this.fus, pal, c, t, c.shade)
    ctx.fillStyle = pal.flame
    ctx.fill(this.beak)
    canopy(ctx, c.canopy, 0, -9, 4, 7.5)
    // a fire in its chest
    const a0 = ctx.globalAlpha
    ctx.globalAlpha = a0 * (0.7 + 0.3 * Math.sin(t * 5))
    stamp(ctx, glow(pal.flame), 0, 6, 7)
    // embers peel off the wingtips and fade as they fall behind
    ctx.fillStyle = pal.flame
    for (let i = 0; i < 6; i++) {
      const k = (t * 0.9 + i / 6) % 1
      const s = i % 2 ? 1 : -1
      const x = s * (31 - k * 6 + Math.sin(t * 6 + i) * 1.5)
      const y = -10 + i * 0.5 + k * 30
      const r = 1.6 * (1 - k)
      ctx.globalAlpha = a0 * (1 - k)
      ctx.beginPath()
      ctx.arc(x, y, r + 0.2, 0, TAU)
      ctx.fill()
    }
    ctx.globalAlpha = a0
  },
}

export const HULLS = { striker, comet, twinfang, bulwark, lancer, phoenix }
