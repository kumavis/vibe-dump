// ringtoss.js — the water ring-toss toy, as a candy-plastic skin. Two pump
// buttons fire jets into a tank of real particle water; the rings sink
// slowly, get carried by the flow, and thread onto a peg if they come down
// over its tip. Puzzle: every pink ring on the pink peg, every gold ring on
// the gold peg. Shaking the whole toy counts too.

import { Skin, buttonSprites, RES } from './skin.js'
import { rect, circle, capsule, blend, ring } from './sdf.js'
import { hex } from './skinart.js'
import { rgb } from './goo.js'
import { DT } from './fluid.js'
import { drawText, textWidth } from './pixelfont.js'
import { Bubbles, Glitter } from './fx.js'

const W = 300, H = 440
const TANK = { x: 32, y: 62, w: 236, h: 270 }
const SHAPE = blend(30, rect(14, 16, 272, 402, 58), capsule(92, 420, 208, 420, 16))
const FLOOR = TANK.h - 6
const R = 15, RI = 9, PEG = 2.6, STACK = 6.5
const PEGS = [
  { x: 74, tip: 156, color: 0 },
  { x: 162, tip: 156, color: 1 },
]
const COLORS = [
  { base: '#ff3d9a', light: '#ffc2e0', dark: '#9c0b52', name: '♥' },
  { base: '#ffcc1a', light: '#fff4b0', dark: '#a87800', name: '★' },
]
const NOZZLES = [
  { x: 18, y: FLOOR - 8, dx: 0.42, dy: -0.91 },
  { x: TANK.w - 18, y: FLOOR - 8, dx: -0.42, dy: -0.91 },
]

export function makeRingToss(goo, { onWin, onScore } = {}) {
  const skin = new Skin(goo, { id: 'ringtoss', title: 'Ring Toss', w: W, h: H, shape: SHAPE })
  skin.controls([247, 36], [264, 47], 6)

  const tank = skin.vessel({
    ...TANK,
    inside: rect(4, 4, TANK.w - 8, TANK.h - 8, 30),
    // a deep full tank boils under stiff, heavy settings: softer and lighter
    // water settles back into a calm pool after every pump
    fluid: { spacing: 8, max: 1100, gravity: 1000, tension: 0.9, stiffness: 0.5, nearStiffness: 1 },
    fill: (x, y) => y > 64,
    tint: (x, y) => y / TANK.h,
    look: { a: rgb('#6ff2ff'), b: rgb('#2a7bff'), glow: rgb('#c8f9ff'), glowAmt: 0.3, caustics: 0.6, alpha: 0.55, alphaEdge: 0.85, foam: 1.3 },
  })
  const f = tank.fluid
  f.settle(0.9)
  const bubbles = new Bubbles(f, { rate: 2.5, size: [1, 3] })
  const confetti = new Glitter(f, 70)
  let party = 0

  // ---- rings ----
  const rings = []
  const scatter = [[44, 110], [118, 70], [196, 120], [120, 200], [200, 230], [40, 230]]
  for (let k = 0; k < 6; k++) {
    const [x, y] = scatter[k]
    rings.push({ x, y, vx: 0, vy: 0, color: k % 2, phi: Math.random() * 3, dphi: 0, rot: 0, peg: null, flat: 0 })
  }
  // one of each already home, so the goal reads at a glance
  rings[0].peg = PEGS[0]; rings[0].x = PEGS[0].x; rings[0].y = FLOOR - 8; rings[0].flat = 1
  rings[1].peg = PEGS[1]; rings[1].x = PEGS[1].x; rings[1].y = FLOOR - 8; rings[1].flat = 1

  // ---- pumps ----
  const pumps = [{ env: 0, held: false }, { env: 0, held: false }]
  f.forces.push((fl, dt) => {
    for (let k = 0; k < 2; k++) {
      const p = pumps[k]
      if (p.env < 0.02) continue
      const nz = NOZZLES[k]
      const acc = 17000 * p.env
      for (let i = 0; i < fl.n; i++) {
        // capsule-shaped jet region reaching up from the nozzle
        const rx = fl.x[i] - nz.x, ry = fl.y[i] - nz.y
        const along = rx * nz.dx + ry * nz.dy
        if (along < -6 || along > 120) continue
        const perp = Math.abs(rx * -nz.dy + ry * nz.dx)
        const wdt = 15 + along * 0.22
        if (perp > wdt) continue
        const fo = (1 - perp / wdt) * (1 - Math.max(0, along) / 130)
        fl.vx[i] += nz.dx * acc * fo * dt
        fl.vy[i] += nz.dy * acc * fo * dt
      }
    }
  })
  const pump = (k, on) => {
    const p = pumps[k]
    if (on && !p.held) {
      p.env = 1
      const nz = NOZZLES[k]
      f.impulse(nz.x + nz.dx * 20, nz.y + nz.dy * 20, 34, nz.dx * 420, nz.dy * 420)
    }
    p.held = on
  }

  // ---- ring physics, coupled to the water every substep ----
  const buf = new Int32Array(256)
  const expected = (Math.PI * (R + f.s) ** 2) / (0.866 * f.s * f.s)
  f.hooks.push(() => {
    for (const r of rings) {
      const cnt = f.near(r.x, r.y, R + f.s, buf)
      let svx = 0, svy = 0
      for (let k = 0; k < cnt; k++) { svx += f.vx[buf[k]]; svy += f.vy[buf[k]] }
      const sub = Math.min(1, (cnt / expected) * 1.3)
      // rings are barely denser than water: they drift down, and ride the flow
      const drag = Math.min(1, 9 * DT) * sub
      const g = 1400 * (1 - 0.93 * sub)
      if (cnt) { r.vx += (svx / cnt - r.vx) * drag; r.vy += (svy / cnt - r.vy) * drag }
      r.vy += g * DT
      r.vx *= Math.exp(-0.6 * DT)
      r.vy *= Math.exp(-0.6 * DT)
      r.x += r.vx * DT
      r.y += r.vy * DT

      if (r.peg) {
        const p = r.peg
        const slack = RI - PEG
        if (r.x < p.x - slack) { r.x = p.x - slack; r.vx = Math.abs(r.vx) * 0.3 }
        if (r.x > p.x + slack) { r.x = p.x + slack; r.vx = -Math.abs(r.vx) * 0.3 }
        if (r.y < p.tip - 8) { r.peg = null; continue } // blown off the top
      } else {
        // walls
        const d = f.grid.sample(r.x, r.y) + R * 0.92
        if (d > 0) {
          const n = f.grid.normal(r.x, r.y, [0, 0])
          r.x -= n[0] * d
          r.y -= n[1] * d
          const vn = r.vx * n[0] + r.vy * n[1]
          if (vn > 0) { r.vx -= vn * n[0] * 1.35; r.vy -= vn * n[1] * 1.35 }
        }
        for (const p of PEGS) {
          const dx = r.x - p.x
          const tol = RI - PEG + 1.5
          if (Math.abs(dx) < tol && r.y < p.tip + 6) {
            if (r.y > p.tip - 3 && r.vy > -40) { r.peg = p; r.vx *= 0.3; break }
            // funnel: falling rings close above a tip get nudged onto it
            if (r.y > p.tip - 50 && r.vy > 0) r.x -= dx * 0.04
            continue
          }
          if (r.y > p.tip - 30 && r.y < p.tip && Math.abs(dx) < 14 && r.vy > 0) r.x -= dx * 0.015
          // otherwise the peg (tip ball + shaft) is solid
          const cy = Math.max(p.tip, Math.min(FLOOR, r.y))
          const ex = r.x - p.x, ey = r.y - cy
          const dd = Math.hypot(ex, ey) || 1
          const minD = R + PEG + (cy === p.tip ? 2.5 : 0)
          if (dd < minD) {
            const o = minD - dd
            r.x += (ex / dd) * o
            r.y += (ey / dd) * o
            const vn = (r.vx * ex + r.vy * ey) / dd
            if (vn < 0) { r.vx -= (vn * ex / dd) * 1.3; r.vy -= (vn * ey / dd) * 1.3 }
          }
        }
        r.dphi += (r.vx * 0.0009 + (Math.random() - 0.5) * 0.02) * sub
      }
      r.dphi *= Math.exp(-1.5 * DT)
      r.phi += r.dphi
    }
    // free rings bump each other
    for (let a = 0; a < rings.length; a++) {
      for (let b = a + 1; b < rings.length; b++) {
        const A = rings[a], B = rings[b]
        if (A.peg || B.peg) continue
        const dx = B.x - A.x, dy = B.y - A.y
        const d = Math.hypot(dx, dy) || 1
        const minD = R * 1.8
        if (d < minD) {
          const o = (minD - d) / 2
          A.x -= (dx / d) * o; A.y -= (dy / d) * o
          B.x += (dx / d) * o; B.y += (dy / d) * o
          const rv = (B.vx - A.vx) * dx / d + (B.vy - A.vy) * dy / d
          if (rv < 0) {
            A.vx += (rv * dx / d) * 0.5; A.vy += (rv * dy / d) * 0.5
            B.vx -= (rv * dx / d) * 0.5; B.vy -= (rv * dy / d) * 0.5
          }
        }
      }
    }
    // threaded rings stack up their peg
    for (const p of PEGS) {
      const on = rings.filter((r) => r.peg === p).sort((a, b) => b.y - a.y)
      let floor = FLOOR - 7
      for (const r of on) {
        if (r.y > floor) { r.y = floor; if (r.vy > 0) r.vy = 0 }
        floor = r.y - STACK
      }
    }
  })

  // ---- score + win ----
  let lastScore = -1, won = false, winT = 0
  const score = () => PEGS.map((p) => rings.filter((r) => r.peg === p && r.color === p.color).length)
  const shuffle = () => {
    for (const r of rings) {
      r.peg = null
      r.vx = (Math.random() - 0.5) * 300
      r.vy = -200 - Math.random() * 300
      r.dphi = (Math.random() - 0.5) * 0.4
    }
    pumps[0].env = pumps[1].env = 1
    f.burst(TANK.w / 2, FLOOR, 160, 600)
    won = false
  }

  // ---- buttons ----
  const jelly = (col) => (p, ox, oy, down) => {
    const r = (p.w - 16) / 2
    p.part(circle(ox + r, oy + r, r), { type: 'plastic', color: down ? col.map((c) => c * 0.75) : col, bevel: r * 0.85, pillow: 0.25, alpha: 0.96 })
  }
  const arrow = (dir) => (ctx, x, y) => {
    ctx.fillStyle = 'rgba(255,255,255,0.92)'
    ctx.shadowColor = 'rgba(90,0,40,0.6)'
    ctx.shadowBlur = 3
    ctx.shadowOffsetY = 1
    // a little water-jet glyph: arrow up-and-in
    ctx.beginPath()
    ctx.moveTo(x - 9 * dir, y + 9)
    ctx.lineTo(x + 3 * dir, y - 9)
    ctx.lineTo(x + 7 * dir, y + 3)
    ctx.lineTo(x + 1 * dir, y + 1)
    ctx.lineTo(x - 4 * dir, y + 11)
    ctx.closePath()
    ctx.fill()
  }
  const pink = hex('#ff2f8f')
  skin.button({ x: 80, y: 382, r: 30, sprite: buttonSprites(60, 60, jelly(pink), arrow(1)), press: () => pump(0, true), release: () => pump(0, false) })
  skin.button({ x: 220, y: 382, r: 30, sprite: buttonSprites(60, 60, jelly(pink), arrow(-1)), press: () => pump(1, true), release: () => pump(1, false) })
  skin.button({
    x: 150, y: 405, r: 9,
    sprite: buttonSprites(18, 18, (p, ox, oy, down) => p.part(circle(ox + 9, oy + 9, 9), { type: 'chrome', color: down ? [0.7, 0.75, 0.85] : [1, 1, 1.05], bevel: 6, pillow: 0.6 }),
      (ctx, x, y) => drawText(ctx, '↻', x - 2.5, y - 3.5, { px: 1, color: '#13304d' })),
    press: shuffle,
  })

  addEventListener('keydown', (e) => {
    if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return
    const k = e.key.toLowerCase()
    if (k === 'arrowleft' || k === 'a') pump(0, true)
    if (k === 'arrowright' || k === 'd') pump(1, true)
  })
  addEventListener('keyup', (e) => {
    // macOS drops keyups for keys released while Cmd is down: let go on Cmd-up
    if (e.key === 'Meta') { pump(0, false); pump(1, false); return }
    const k = e.key.toLowerCase()
    if (k === 'arrowleft' || k === 'a') pump(0, false)
    if (k === 'arrowright' || k === 'd') pump(1, false)
  })
  // a keyup we never see (window switched) must not latch a pump on
  addEventListener('blur', () => { pump(0, false); pump(1, false) })

  // ---- paint ----
  const purple = hex('#8a3dff')
  const back = skin.painter()
  back.part(SHAPE, { type: 'plastic', color: purple, bevel: 16, pillow: 0.5, alpha: 0.9 })
  // chrome trim: nameplate, tank bezel, button bezels
  back.part(rect(70, 22, 160, 30, 15), { type: 'chrome', color: [0.95, 0.92, 1.1], bevel: 6, pillow: 0.9 })
  back.part(rect(TANK.x - 7, TANK.y - 7, TANK.w + 14, TANK.h + 14, 40), { type: 'chrome', color: [0.95, 0.92, 1.1], bevel: 5, pillow: 0 })
  back.part(rect(TANK.x, TANK.y, TANK.w, TANK.h, 34), { type: 'glass', color: [0.1, 0.2, 0.4], bevel: 8, recess: true, pillow: 0 })
  for (const x of [80, 220]) back.part(ring(x, 382, 34, 4.5), { type: 'chrome', color: [1, 0.95, 1.1], bevel: 4.5, pillow: 0 })
  back.part(rect(116, 348, 68, 42, 10), { type: 'lcd', color: [0.02, 0.1, 0.12], bevel: 4, recess: true, pillow: 0 })
  back.part(circle(150, 405, 11), { type: 'glass', color: [0.1, 0.03, 0.2], bevel: 3, recess: true, pillow: 0 })
  // nozzles at the tank floor corners
  for (const nz of NOZZLES) {
    back.part(circle(TANK.x + nz.x, TANK.y + nz.y + 4, 7), { type: 'chrome', color: [0.8, 0.85, 1], bevel: 5, pillow: 0 })
  }
  const front = skin.painter()
  front.shine(rect(TANK.x, TANK.y, TANK.w, TANK.h, 34), { bevel: 8, gloss: 0.3, glossAlpha: 0.2 })
  front.shine(SHAPE, { bevel: 14, gloss: 0.05, glossAlpha: 0 })
  skin.bake(back, front, { glow: 'rgba(200,90,255,0.5)', glowBlur: 30 })
  const bctx = skin.back.getContext('2d')
  bctx.setTransform(RES, 0, 0, RES, skin.m * RES, skin.m * RES)
  const title = 'RING TOSS'
  const tx = 150 - textWidth(title, 2) / 2
  drawText(bctx, title, tx, 31, { px: 2, color: 'rgba(255,255,255,0.6)' })
  drawText(bctx, title, tx, 30, { px: 2, color: 'rgba(40,10,70,0.8)' })
  drawText(bctx, 'AQUA★TOYS 2003', 150 - textWidth('AQUA★TOYS 2003', 1) / 2, 424, { px: 1, color: 'rgba(255,255,255,0.4)' })

  // ---- drawing ----
  const drawPeg = (ctx, p) => {
    const g = ctx.createLinearGradient(p.x - PEG, 0, p.x + PEG, 0)
    g.addColorStop(0, '#5d6f95')
    g.addColorStop(0.35, '#ffffff')
    g.addColorStop(0.7, '#a9b9da')
    g.addColorStop(1, '#3a4766')
    ctx.fillStyle = g
    ctx.fillRect(p.x - PEG, p.tip, PEG * 2, FLOOR - p.tip)
    // base
    ctx.fillStyle = '#c9d4ef'
    ctx.beginPath()
    ctx.ellipse(p.x, FLOOR + 1, 13, 4, 0, 0, Math.PI * 2)
    ctx.fill()
    const c = COLORS[p.color]
    const bg = ctx.createRadialGradient(p.x - 2, p.tip - 2, 0.5, p.x, p.tip, 5.5)
    bg.addColorStop(0, '#fff')
    bg.addColorStop(0.35, c.light)
    bg.addColorStop(1, c.dark)
    ctx.fillStyle = bg
    ctx.beginPath()
    ctx.arc(p.x, p.tip, 5.5, 0, Math.PI * 2)
    ctx.fill()
  }
  // a candy torus; part: 0 whole, -1 back half, 1 front half
  const drawRing = (ctx, r, part) => {
    const c = COLORS[r.color]
    const tumble = Math.max(0.28, Math.abs(Math.cos(r.phi)))
    const sx = tumble + (1 - tumble) * r.flat
    const sy = 1 - 0.66 * r.flat
    ctx.save()
    ctx.translate(r.x, r.y)
    if (part) {
      ctx.beginPath()
      ctx.rect(-R - 2, part < 0 ? -R - 2 : 0, R * 2 + 4, R + 2)
      ctx.clip()
    }
    ctx.scale(sx, sy)
    ctx.beginPath()
    ctx.arc(0, 0, R, 0, Math.PI * 2)
    ctx.arc(0, 0, RI, 0, Math.PI * 2, true)
    const g = ctx.createRadialGradient(-4, -6, 1, 0, 0, R)
    g.addColorStop(0, c.light)
    g.addColorStop(0.55, c.base)
    g.addColorStop(1, c.dark)
    ctx.fillStyle = g
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.85)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(0, 0, (R + RI) / 2, Math.PI * 1.05, Math.PI * 1.55)
    ctx.stroke()
    ctx.strokeStyle = c.dark
    ctx.lineWidth = 0.8
    ctx.beginPath()
    ctx.arc(0, 0, R - 0.4, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }

  skin.drawUnder = (ctx, t, dt) => {
    ctx.save()
    ctx.translate(TANK.x, TANK.y)
    for (const p of PEGS) {
      const on = rings.filter((r) => r.peg === p)
      for (const r of on) drawRing(ctx, r, -1)
      drawPeg(ctx, p)
      for (const r of on) drawRing(ctx, r, 1)
    }
    for (const r of rings) if (!r.peg) drawRing(ctx, r, 0)
    ctx.restore()
  }
  skin.drawOver = (ctx, t, dt) => {
    bubbles.draw(ctx, TANK.x, TANK.y)
    if (party > 0) confetti.draw(ctx, TANK.x, TANK.y, t, party)
    // score LCD
    const [a, b] = score()
    const blink = won && Math.sin(t * 10) > 0
    drawText(ctx, `♥${a}/3`, 124, 355, { px: 2, color: blink ? '#fff' : '#ff6fb5', glow: '#ff6fb5' })
    drawText(ctx, `★${b}/3`, 124, 372, { px: 2, color: blink ? '#fff' : '#ffd84a', glow: '#ffd84a' })
  }

  skin.tick = (dt) => {
    for (const r of rings) r.flat += ((r.peg ? 1 : 0) - r.flat) * Math.min(1, 8 * dt)
    for (const p of pumps) {
      const target = p.held ? 0.5 : 0
      p.env += (target - p.env) * Math.min(1, (p.held ? 3 : 5) * dt)
    }
    for (let k = 0; k < 2; k++) {
      if (pumps[k].env > 0.25 && Math.random() < pumps[k].env * 0.9) {
        const nz = NOZZLES[k]
        bubbles.spawn(nz.x + nz.dx * 10 + (Math.random() - 0.5) * 6, nz.y + nz.dy * 10, 1 + Math.random() * 2.5)
      }
    }
    bubbles.ambient(dt, () => [20 + Math.random() * (TANK.w - 40), FLOOR - 4])
    bubbles.step(dt)
    party = Math.max(0, party - dt * 0.4)
    const [a, b] = score()
    const total = a + b
    if (total !== lastScore) {
      if (lastScore >= 0 && total > lastScore) onScore?.(total)
      lastScore = total
    }
    if (total === 6 && !won) {
      won = true
      winT = 0
      party = 1.2
      onWin?.()
      f.burst(TANK.w / 2, FLOOR - 20, 200, 500)
    }
    if (won) {
      winT += dt
      if (winT > 6) shuffle()
    }
  }
  return skin
}
