// clock.js — the Hydro Clock: a chrome torus whose glass channel is half full
// of glittering tangerine liquid. The middle is a real hole. Hours, minutes
// and seconds are beads travelling the channel; fling the clock and the
// liquid chases itself round the ring.

import { Skin, RES } from './skin.js'
import { circle, rect, ring, blend, subtract } from './sdf.js'
import { rgb } from './goo.js'
import { drawSeg, drawText, textWidth } from './pixelfont.js'
import { Glitter, Bubbles } from './fx.js'

const W = 260, H = 300
const C = 130
const HOLE = circle(C, C, 52)
const SHAPE = subtract(blend(26, circle(C, C, 126), rect(80, 220, 100, 72, 20)), HOLE)
const CH = 88 // channel centre radius

export function makeClock(goo) {
  const skin = new Skin(goo, { id: 'clock', title: 'Hydro Clock', w: W, h: H, shape: SHAPE })
  // the 1 and 2 o'clock studs are the minimise / close orbs
  const stud = (i) => [C + Math.cos((i / 12) * Math.PI * 2 - Math.PI / 2) * 117.5, C + Math.sin((i / 12) * Math.PI * 2 - Math.PI / 2) * 117.5]
  skin.controls(stud(1), stud(2), 5.5)
  const v = skin.vessel({
    x: 0, y: 0, w: W - 0, h: 260,
    inside: ring(C, C, CH, 18),
    fluid: { spacing: 7, max: 600, gravity: 1300 },
    fill: (x, y) => y > C + 18,
    tint: (x, y) => Math.max(0, Math.min(1, (y - C) / 110)),
    look: { a: rgb('#ffcf33'), b: rgb('#ff5a14'), glow: rgb('#ffb15c'), glowAmt: 0.55, caustics: 0.5, alpha: 0.86 },
  })
  v.fluid.settle()
  const glitter = new Glitter(v.fluid, 36)
  const bubbles = new Bubbles(v.fluid, { rate: 2, size: [0.8, 2] })

  const back = skin.painter()
  back.part(SHAPE, { type: 'chrome', color: [1.08, 0.95, 0.9], bevel: 10, pillow: 0.9 })
  back.part(ring(C, C, 117.5, 8.5), { type: 'chrome', color: [1.05, 1, 1], bevel: 8, pillow: 0 })
  back.part(ring(C, C, CH, 21.5), { type: 'glass', color: [0.08, 0.03, 0.1], bevel: 8, recess: true, pillow: 0 })
  back.part(ring(C, C, 59.5, 7.5), { type: 'chrome', color: [1.05, 1, 1], bevel: 7, pillow: 0 })
  for (let i = 0; i < 12; i++) {
    if (i === 1 || i === 2) continue
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2
    const r = i % 3 === 0 ? 4 : 2.6
    back.part(circle(C + Math.cos(a) * 117.5, C + Math.sin(a) * 117.5, r), { type: 'chrome', color: i % 3 ? [1, 1, 1] : [1.2, 0.85, 0.6], bevel: r, pillow: 0 })
  }
  back.part(rect(90, 240, 80, 32, 10), { type: 'lcd', color: [0.12, 0.05, 0.02], bevel: 4, recess: true, pillow: 0 })
  back.erase(HOLE)
  const front = skin.painter()
  front.shine(ring(C, C, CH, 21.5), { bevel: 8, gloss: 0.4, glossAlpha: 0.22 })
  skin.bake(back, front, { glow: 'rgba(255,140,60,0.45)', glowBlur: 28 })
  const bctx = skin.back.getContext('2d')
  bctx.setTransform(RES, 0, 0, RES, skin.m * RES, skin.m * RES)
  const label = 'HYDRO★TIME'
  drawText(bctx, label, C - textWidth(label, 1) / 2, 278.6, { px: 1, color: 'rgba(255,255,255,0.5)' })
  drawText(bctx, label, C - textWidth(label, 1) / 2, 278, { px: 1, color: 'rgba(60,20,10,0.7)' })

  const bead = (ctx, frac, r, hi, lo) => {
    const a = frac * Math.PI * 2 - Math.PI / 2
    const x = C + Math.cos(a) * CH, y = C + Math.sin(a) * CH
    const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r)
    g.addColorStop(0, '#ffffff')
    g.addColorStop(0.4, hi)
    g.addColorStop(1, lo)
    ctx.shadowColor = 'rgba(0,0,0,0.5)'
    ctx.shadowBlur = 4
    ctx.shadowOffsetY = 1.5
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowColor = 'transparent'
  }

  skin.drawOver = (ctx, t) => {
    glitter.draw(ctx, 0, 0, t)
    bubbles.draw(ctx, 0, 0)
    const now = new Date()
    const s = now.getSeconds() + now.getMilliseconds() / 1000
    const m = now.getMinutes() + s / 60
    const h = (now.getHours() % 12) + m / 60
    ctx.save()
    bead(ctx, h / 12, 10, '#7fe8ff', '#0a5fb8')
    bead(ctx, m / 60, 7, '#f4f8ff', '#7d8db0')
    bead(ctx, s / 60, 4.2, '#ff8a9a', '#c0103a')
    ctx.restore()
    const hh = String(now.getHours()).padStart(2, '0')
    const mm = String(now.getMinutes()).padStart(2, '0')
    const on = '#ffb347'
    drawSeg(ctx, `${hh}${Math.floor(s) % 2 ? ':' : ';'}${mm}`, 102, 247, { w: 9, h: 17, t: 2.6, gap: 5, on, off: 'rgba(255,170,70,0.08)', glow: on })
  }
  skin.tick = (dt) => {
    bubbles.ambient(dt, () => {
      const a = Math.PI * (0.25 + Math.random() * 0.5)
      return [C + Math.cos(a) * (CH + 8), C + Math.sin(a) * (CH + 8)]
    })
    bubbles.step(dt)
  }
  return skin
}
