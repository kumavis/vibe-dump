// The player's ships as the store sells them: six hulls (ships/hulls.js), a
// dozen paint jobs (ships/paint.js) and the little helper drones that fly on
// the wingtips. main.js draws each ship with `drawShipModel` every frame, and
// again as the HUD's life icons, on the home screen and in the store.

import { HULLS } from './ships/hulls.js'
import { paintLook, coat, sheen, cached, paintKey, radial, glow, stamp, TAU } from './ships/paint.js'

// An engine flame one unit wide and one long, stretched to fit each nozzle.
const FLAME = (() => {
  const p = new Path2D()
  p.moveTo(-1, 0)
  p.quadraticCurveTo(0, 1.2, 1, 0)
  p.closePath()
  return p
})()

function flames(ctx, engines, grad, len) {
  ctx.fillStyle = grad
  for (const [ex, ey, hw, k] of engines) {
    ctx.save()
    ctx.translate(ex, ey)
    ctx.scale(hw, len * k)
    ctx.fill(FLAME)
    ctx.restore()
  }
}

// Everything a hull needs to wear a paint, made the first time it does.
function lookFor(hull, pal) {
  return cached(`${hull.id}|${paintKey(pal)}`, () => ({ ...paintLook(pal), ...hull.grads(pal) }))
}

// The HUD's life icons are a handful of pixels across and drawn every frame,
// up to five a player. Below this scale the hull is painted once into a
// sprite at the size it lands on screen and stamped from then on; only the
// flames and the blinking lights stay live.
const ICON_SCALE = 0.5
const ICON_SPAN = 44 // half the sprite's width in hull units; every hull fits

function iconSprite(ctx, hull, paint, look, scale) {
  const m = ctx.getTransform()
  // device pixels per hull unit, rounded up so the stamp only ever shrinks
  const q = Math.max(0.25, Math.ceil(Math.hypot(m.a, m.b) * scale * 4) / 4)
  return cached(`icon|${hull.id}|${paintKey(paint)}|${q}`, () => {
    const c = document.createElement('canvas')
    c.width = c.height = Math.ceil(ICON_SPAN * 2 * q)
    const g = c.getContext('2d')
    g.scale(c.width / (ICON_SPAN * 2), c.height / (ICON_SPAN * 2))
    g.translate(ICON_SPAN, ICON_SPAN)
    // t = 0.4 catches Solid Gold mid-glint and the Galaxy's stars lit
    hull.draw(g, paint, look, 0.4)
    return c
  })
}

// `model` is a ship id from catalog.js SHIPS and `paint` comes from
// `resolvePaint`. opts are art.js drawShip's: `tilt` banks (-1..1), `t` is
// the clock for flicker and blinking, `thrust` (0..1) sets the flame length
// and `scale` the size.
export function drawShipModel(ctx, x, y, model, paint, opts = {}) {
  const { tilt = 0, t = 0, thrust = 0.5, scale = 1 } = opts
  const hull = HULLS[model] ?? HULLS.striker
  const look = lookFor(hull, paint)
  const icon = scale <= ICON_SCALE && !tilt && iconSprite(ctx, hull, paint, look, scale)
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)
  ctx.rotate(tilt * 0.12)

  const len = Math.max(4, 12 + 5 * Math.sin(t * 40) + 14 * thrust)
  flames(ctx, hull.engines, look.flame, len)

  ctx.scale(1 - Math.abs(tilt) * 0.22, 1)
  if (icon) ctx.drawImage(icon, -ICON_SPAN, -ICON_SPAN, ICON_SPAN * 2, ICON_SPAN * 2)
  else hull.draw(ctx, paint, look, t)

  // wingtip lights
  const [lx, ly] = hull.lights
  ctx.fillStyle = Math.sin(t * 6) > 0 ? '#ffffff' : paint.main
  ctx.beginPath()
  ctx.arc(-lx, ly, 2.2, 0, TAU)
  ctx.arc(lx, ly, 2.2, 0, TAU)
  ctx.fill()

  ctx.restore()
}

// ---------------------------------------------------------------- drones

const DRONE_BODY = (() => {
  const p = new Path2D()
  p.arc(0, 0, 7.5, 0, TAU)
  return p
})()

const DRONE_FINS = (() => {
  const p = new Path2D()
  for (const s of [-1, 1]) {
    p.moveTo(s * 6, -1.5)
    p.lineTo(s * 9.8, 2.5)
    p.lineTo(s * 9.3, 6)
    p.lineTo(s * 5, 5)
    p.closePath()
  }
  return p
})()

function droneLook(pal) {
  return cached(`drone|${paintKey(pal)}`, () => ({
    ...paintLook(pal),
    shade: sheen(-7.5, 7.5),
    body: radial(-2.5, -3, 0.5, 0, 0, 8.5, [
      [0, pal.light],
      [0.45, pal.main],
      [1, pal.dark],
    ]),
  }))
}

// A cute helper robot, 15 units across (20 with its fins): a round body, one
// big glowing eye, an antenna and a little thruster. The caller bobs it about.
export function drawDrone(ctx, x, y, paint, t) {
  const look = droneLook(paint)
  const a0 = ctx.globalAlpha
  ctx.save()
  ctx.translate(x, y)

  // thruster
  ctx.save()
  ctx.translate(0, 6.5)
  ctx.scale(3, 7 + 2.5 * Math.sin(t * 37))
  ctx.fillStyle = look.flame
  ctx.fill(FLAME)
  ctx.restore()
  ctx.fillStyle = '#56607a'
  ctx.beginPath()
  ctx.roundRect(-3, 5, 6, 3, 1.5)
  ctx.fill()

  ctx.fillStyle = paint.dark
  ctx.fill(DRONE_FINS)

  // antenna, its tip blinking out of step with the ship's lights
  ctx.strokeStyle = paint.dark
  ctx.lineWidth = 1.3
  ctx.beginPath()
  ctx.moveTo(0, -7)
  ctx.lineTo(1.5, -11)
  ctx.stroke()
  ctx.fillStyle = Math.sin(t * 5 + 1) > 0 ? '#ffffff' : paint.flame
  ctx.beginPath()
  ctx.arc(1.5, -11.5, 1.5, 0, TAU)
  ctx.fill()

  ctx.fillStyle = look.body
  ctx.fill(DRONE_BODY)
  coat(ctx, DRONE_BODY, paint, look, t, look.shade)
  // a bright rim, so even a Midnight or Hot Rod drone shows up against space
  ctx.strokeStyle = paint.flame
  ctx.globalAlpha = a0 * 0.7
  ctx.lineWidth = 1.1
  ctx.stroke(DRONE_BODY)
  ctx.globalAlpha = a0

  // visor and its eye, which looks about and now and then blinks
  ctx.fillStyle = '#1b2440'
  ctx.beginPath()
  ctx.roundRect(-5.5, -3.5, 11, 6.5, 3.25)
  ctx.fill()
  const ex = Math.sin(t * 1.3) * 1.8
  const blink = t % 3.4 < 0.12
  ctx.globalAlpha = a0 * 0.85
  stamp(ctx, glow(paint.flame), ex, -0.25, 5.5)
  ctx.globalAlpha = a0
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.ellipse(ex, -0.25, 1.9, blink ? 0.4 : 2, 0, 0, TAU)
  ctx.fill()

  ctx.restore()
}
