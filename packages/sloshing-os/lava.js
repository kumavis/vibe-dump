// lava.js — a lava lamp, because no 2003 desktop was complete without one.
// The wax is the same particle liquid as everything else, but each particle
// carries heat: the bulb at the bottom warms it until it floats, it cools on
// the way up and sinks again. Neighbours share heat, so wax rises in blobs.

import { Skin } from './skin.js'
import { trapezoid, blend } from './sdf.js'
import { rgb } from './goo.js'
import { DT, MAXNB } from './fluid.js'

const W = 170, H = 430
const CX = 85
const CAP = trapezoid(CX, 46, 20, 34, 30, 7)
const GLASS = trapezoid(CX, 190, 34, 60, 118, 16)
const WAIST = trapezoid(CX, 330, 58, 44, 24, 6)
const FOOT = trapezoid(CX, 388, 44, 74, 36, 10)
const SHAPE = blend(5, CAP, GLASS, WAIST, FOOT)
const V = { x: CX - 60, y: 72, w: 120, h: 236 }

export function makeLava(goo) {
  const skin = new Skin(goo, { id: 'lava', title: 'Lava Lamp', w: W, h: H, shape: SHAPE })
  skin.controls([CX - 8, 52], [CX + 8, 52], 5)
  const v = skin.vessel({
    ...V,
    inside: trapezoid(60, 118, 29, 55, 113, 13),
    fluid: { spacing: 7, max: 500, gravity: 240, viscosity: 0.6, damping: 1.6, maxSpeed: 260, tension: 1, cohesion: 1.06, stiffness: 0.6, nearStiffness: 1.2 },
    fill: (x, y) => y > V.h - 66,
    look: { a: rgb('#ff2a8a'), b: rgb('#ffe14a'), glow: rgb('#ff8a4a'), glowAmt: 0.75, caustics: 0.06, alpha: 0.97, alphaEdge: 0.99, foam: 0, deep: 0.78 },
  })
  const f = v.fluid
  for (let i = 0; i < f.n; i++) f.heat[i] = Math.random() * 0.3
  // a couple of warm blobs already on their way up for the first frame
  f.settle(0.6)

  f.forces.push((fl, dt) => {
    const { n, x, y, heat, buoy, tint, nbN, nb } = fl
    for (let i = 0; i < n; i++) {
      const depth = y[i] / V.h
      // the bulb is a hot spot in the middle of the floor: wax buds off it
      const bulb = depth > 0.84 ? Math.max(0, 1 - Math.abs(x[i] - V.w / 2) / 30) : 0
      if (bulb > 0) heat[i] += 0.9 * bulb * dt
      else heat[i] -= (0.04 + (1 - depth) * 0.2) * dt
      // share warmth with neighbours so wax moves as blobs
      const c = nbN[i]
      if (c) {
        let s = 0
        for (let k = 0; k < c; k++) s += heat[nb[i * MAXNB + k]]
        heat[i] += (s / c - heat[i]) * 0.9 * dt
      }
      if (heat[i] < 0) heat[i] = 0
      if (heat[i] > 1) heat[i] = 1
      buoy[i] = 1 - heat[i] * 2.4
      tint[i] = heat[i]
    }
  })
  for (let k = 0; k < 240; k++) f.substep(0, 0)

  const back = skin.painter()
  back.part(CAP, { type: 'chrome', color: [0.95, 0.85, 1.15], bevel: 8, pillow: 0.8 })
  back.part(GLASS, { type: 'glass', color: [0.2, 0.05, 0.42], bevel: 10, pillow: 0, alpha: 0.95 })
  back.part(WAIST, { type: 'chrome', color: [0.95, 0.85, 1.15], bevel: 7, pillow: 0.9 })
  back.part(FOOT, { type: 'chrome', color: [0.95, 0.85, 1.15], bevel: 10, pillow: 0.9 })
  const front = skin.painter()
  front.shine(GLASS, { bevel: 12, gloss: 0.3, glossAlpha: 0.18 })
  skin.bake(back, front, { glow: 'rgba(255,80,160,0.5)', glowBlur: 34 })

  skin.drawUnder = (ctx, t) => {
    // the bulb's glow through the liquid
    const flick = 0.85 + Math.sin(t * 7) * 0.04 + Math.sin(t * 2.3) * 0.05
    const g = ctx.createRadialGradient(CX, V.y + V.h + 10, 4, CX, V.y + V.h - 40, 200)
    g.addColorStop(0, `rgba(255,170,90,${0.75 * flick})`)
    g.addColorStop(0.35, `rgba(255,60,140,${0.3 * flick})`)
    g.addColorStop(1, 'rgba(120,40,255,0)')
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.fillStyle = g
    ctx.beginPath()
    for (let y = 72; y <= 308; y += 4) {
      const w = 34 + ((y - 72) / 236) * 26 - 4
      if (y === 72) ctx.moveTo(CX - w, y)
      else ctx.lineTo(CX - w, y)
    }
    for (let y = 308; y >= 72; y -= 4) ctx.lineTo(CX + 34 + ((y - 72) / 236) * 26 - 4, y)
    ctx.fill()
    ctx.restore()
  }
  return skin
}
