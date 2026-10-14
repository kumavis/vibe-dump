// Pictures for the store: paint swatches, the upgrade badges and a handful of
// inline SVG icons for the chrome. Same rules as ../art.js — plain canvas
// paths, centred on (x, y), and the context is left as it was found.

import { drawBubble, drawIcon } from '../art.js'
import { drawShipModel, drawDrone } from '../ships.js'
import { hexA } from '../stars.js'

const TAU = Math.PI * 2

// ---------------------------------------------------------------- svg

const svg = (body, extra = '') => `<svg viewBox="0 0 24 24" aria-hidden="true"${extra}>${body}</svg>`

export const SVG = {
  star: svg('<path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.5L12 17.3l-5.9 3.2 1.3-6.5L2.5 9.4l6.6-.8z" fill="currentColor"/>'),
  lock: svg('<path d="M7 10V7.5a5 5 0 0 1 10 0V10h.5A1.5 1.5 0 0 1 19 11.5v8a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-8A1.5 1.5 0 0 1 6.5 10zm2.4 0h5.2V7.5a2.6 2.6 0 0 0-5.2 0z" fill="currentColor"/>'),
  check: svg('<path d="M4.5 12.5l4.8 4.8L19.5 7" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>'),
  heart: svg('<path d="M12 21s-7.4-4.5-9.5-9.1C1 8.5 3.1 4.6 6.8 4.6c2.2 0 3.7 1.2 5.2 3.1 1.5-1.9 3-3.1 5.2-3.1 3.7 0 5.8 3.9 4.3 7.3C19.4 16.5 12 21 12 21z" fill="currentColor"/>'),
  ship: svg('<path d="M12 1.8c2.2 2.4 3.3 5.7 3.3 9.8v2.5l5.7 4.2-.6 2.6-5.6-1.7H9.2l-5.6 1.7-.6-2.6 5.7-4.2v-2.5c0-4.1 1.1-7.4 3.3-9.8z" fill="currentColor"/><path d="M10 20.4h4l-2 2.6z" fill="currentColor" opacity=".6"/>'),
  palette: svg('<path d="M12 2.8c-5.2 0-9.4 3.9-9.4 8.9 0 5.2 4.3 9.5 9.6 9.5 1.2 0 1.9-.8 1.9-1.8 0-.5-.2-.9-.5-1.3-.3-.3-.5-.8-.5-1.3 0-1 .8-1.8 1.8-1.8h2.2c3 0 5.4-2.4 5.4-5.4 0-3.9-4.5-6.8-10.5-6.8zM6.8 13a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2zm2.6-4.4a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2zm5.2 0a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2zm3.1 3.5a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2z" fill="currentColor" fill-rule="evenodd"/>'),
  up: svg('<path d="M12 2.5l8 8.6h-4.6v10.4H8.6V11.1H4z" fill="currentColor"/>'),
  bolt: svg('<path d="M13.6 1.8L4.4 13.6h6.2l-1.4 8.6 10.4-12.6h-6.4z" fill="currentColor"/>'),
}

// ---------------------------------------------------------------- paint swatches

// A paint job as a shiny round chip, with its pattern on top. The ship art
// paints the real hull; this is what reads at card size.
export function drawSwatch(ctx, x, y, r, paint, t = 0) {
  ctx.save()
  ctx.shadowColor = hexA(paint.main, 0.6)
  ctx.shadowBlur = r * 0.45
  ctx.fillStyle = paint.dark
  ctx.beginPath()
  ctx.arc(x, y, r, 0, TAU)
  ctx.fill()
  ctx.shadowBlur = 0

  ctx.save()
  ctx.beginPath()
  ctx.arc(x, y, r, 0, TAU)
  ctx.clip()
  const g = ctx.createLinearGradient(x - r, y - r, x + r, y + r)
  g.addColorStop(0, paint.light)
  g.addColorStop(0.42, paint.main)
  g.addColorStop(1, paint.dark)
  ctx.fillStyle = g
  ctx.fillRect(x - r, y - r, r * 2, r * 2)
  PATTERNS[paint.pattern]?.(ctx, x, y, r, paint, t)
  // a soft dome of light, so every swatch reads as a shiny hull
  const gl = ctx.createRadialGradient(x - r * 0.38, y - r * 0.48, 0, x - r * 0.38, y - r * 0.48, r * 0.9)
  gl.addColorStop(0, 'rgba(255,255,255,0.6)')
  gl.addColorStop(0.5, 'rgba(255,255,255,0.12)')
  gl.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gl
  ctx.fillRect(x - r, y - r, r * 2, r * 2)
  ctx.restore()

  const lw = Math.max(1.5, r * 0.07)
  ctx.strokeStyle = 'rgba(255,255,255,0.75)'
  ctx.lineWidth = lw
  ctx.beginPath()
  ctx.arc(x, y, r - lw / 2, 0, TAU)
  ctx.stroke()
  ctx.restore()
}

// Flame tongue rising from `base`, its tip curling a little to the right.
function tongue(ctx, fx, base, wd, hgt) {
  ctx.moveTo(fx - wd / 2, base)
  ctx.bezierCurveTo(fx - wd * 0.55, base - hgt * 0.5, fx + wd * 0.05, base - hgt * 0.62, fx + wd * 0.22, base - hgt)
  ctx.bezierCurveTo(fx + wd * 0.5, base - hgt * 0.58, fx + wd * 0.62, base - hgt * 0.28, fx + wd / 2, base)
}

const RAINBOW = ['#ff4d5e', '#ff9d2e', '#ffe23d', '#4dff88', '#38d6ff', '#6a6ff0', '#c77dff']

const PATTERNS = {
  stripes(ctx, x, y, r, p) {
    ctx.fillStyle = p.accent
    ctx.fillRect(x - r * 0.42, y - r, r * 0.26, r * 2)
    ctx.fillRect(x + r * 0.16, y - r, r * 0.26, r * 2)
  },
  checker(ctx, x, y, r, p) {
    const n = 5
    const s = (r * 2) / n
    ctx.fillStyle = p.accent
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if ((i + j) % 2) ctx.fillRect(x - r + i * s, y - r + j * s, s, s)
  },
  camo(ctx, x, y, r, p) {
    const blobs = [
      [-0.5, -0.42, 0.44, 0.28, 0.5, 'dark'],
      [0.36, -0.56, 0.38, 0.22, -0.4, 'accent'],
      [0.52, 0.2, 0.42, 0.25, 1.1, 'dark'],
      [-0.18, 0.16, 0.36, 0.24, -0.9, 'accent'],
      [-0.58, 0.6, 0.4, 0.2, 0.3, 'light'],
      [0.16, 0.72, 0.32, 0.2, 0.8, 'dark'],
      [0.06, -0.12, 0.18, 0.12, 0.2, 'light'],
    ]
    for (const [bx, by, rx, ry, a, c] of blobs) {
      ctx.fillStyle = p[c]
      ctx.beginPath()
      ctx.ellipse(x + bx * r, y + by * r, rx * r, ry * r, a, 0, TAU)
      ctx.fill()
    }
  },
  flames(ctx, x, y, r, p) {
    const base = y + r * 1.05
    ctx.fillStyle = p.accent
    ctx.beginPath()
    for (const [fx, h] of [[-0.66, 1.0], [-0.22, 1.5], [0.24, 1.2], [0.68, 1.4]]) tongue(ctx, x + fx * r, base, r * 0.62, r * h)
    ctx.fill()
    ctx.fillStyle = p.flame
    ctx.beginPath()
    for (const [fx, h] of [[-0.62, 0.62], [-0.2, 1.0], [0.26, 0.76], [0.7, 0.9]]) tongue(ctx, x + fx * r, base, r * 0.36, r * h)
    ctx.fill()
  },
  galaxy(ctx, x, y, r, p, t) {
    const g = ctx.createRadialGradient(x + r * 0.2, y - r * 0.05, 0, x, y, r)
    g.addColorStop(0, hexA(p.flame, 0.75))
    g.addColorStop(0.45, hexA(p.main, 0.35))
    g.addColorStop(1, hexA(p.dark, 0))
    ctx.fillStyle = g
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
    ctx.strokeStyle = hexA(p.light, 0.45)
    ctx.lineWidth = r * 0.12
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.ellipse(x + r * 0.1, y, r * 0.62, r * 0.26, -0.5, 0.3, 2.6)
    ctx.stroke()
    // a sprinkle of stars, laid out on the golden angle so they never clump
    ctx.fillStyle = p.accent
    for (let i = 0; i < 16; i++) {
      const a = i * 2.39996 + t * 0.2
      const d = r * 0.92 * Math.sqrt((i + 0.5) / 16)
      const s = (i % 4 === 0 ? 0.08 : 0.045) * r * (0.75 + 0.25 * Math.sin(t * 3 + i))
      ctx.beginPath()
      ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, s, 0, TAU)
      ctx.fill()
    }
  },
  rainbow(ctx, x, y, r) {
    const g = ctx.createLinearGradient(x - r, y - r, x + r, y + r)
    RAINBOW.forEach((c, i) => g.addColorStop(i / (RAINBOW.length - 1), c))
    ctx.fillStyle = g
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
  },
  gold(ctx, x, y, r, p) {
    const g = ctx.createLinearGradient(x - r, y - r, x + r * 0.6, y + r)
    g.addColorStop(0, p.light)
    g.addColorStop(0.28, p.main)
    g.addColorStop(0.5, p.dark)
    g.addColorStop(0.68, p.main)
    g.addColorStop(1, p.light)
    ctx.fillStyle = g
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(-0.7)
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.fillRect(-r * 0.1, -r, r * 0.16, r * 2)
    ctx.fillRect(r * 0.14, -r, r * 0.06, r * 2)
    ctx.restore()
  },
}

// ---------------------------------------------------------------- upgrade badges

// One picture per upgrade, drawn into a box about 96 × 80 at `s` = 1.
export function drawUpgradeIcon(ctx, id, x, y, s, { paint, ship = 'striker', t = 0 } = {}) {
  ctx.save()
  if (id === 'cargo') cargo(ctx, x, y, s, t)
  else if (id === 'armor') armor(ctx, x, y, s)
  else if (id === 'magnet') magnet(ctx, x, y, s, t)
  else if (id === 'drones') drones(ctx, x, y, s, paint, ship, t)
  ctx.restore()
}

// Four cargo slots: three loaded, one waiting for the next bubble.
function cargo(ctx, x, y, s, t) {
  const box = 30 * s
  const gap = 6 * s
  const types = ['shield', 'triple', 'rapid', null]
  types.forEach((type, i) => {
    const bx = x + (i % 2 ? gap / 2 : -gap / 2 - box)
    const by = y + (i < 2 ? -gap / 2 - box : gap / 2)
    ctx.fillStyle = 'rgba(10, 8, 34, 0.85)'
    ctx.strokeStyle = type ? 'rgba(255,255,255,0.35)' : '#ffd54a'
    ctx.lineWidth = 2 * s
    ctx.setLineDash(type ? [] : [4 * s, 3 * s])
    ctx.beginPath()
    ctx.roundRect(bx, by, box, box, 7 * s)
    ctx.fill()
    ctx.stroke()
    ctx.setLineDash([])
    if (type) drawBubble(ctx, bx + box / 2, by + box / 2, box * 0.38, type, t)
    else {
      ctx.fillStyle = '#ffd54a'
      ctx.fillRect(bx + box / 2 - 7 * s, by + box / 2 - 2 * s, 14 * s, 4 * s)
      ctx.fillRect(bx + box / 2 - 2 * s, by + box / 2 - 7 * s, 4 * s, 14 * s)
    }
  })
}

// A riveted hull plate in the shape of a shield, with a heart for the lives
// it buys.
function plate(ctx, x, y, w) {
  ctx.beginPath()
  ctx.moveTo(x, y - w)
  ctx.lineTo(x + w * 0.88, y - w * 0.62)
  ctx.lineTo(x + w * 0.8, y + w * 0.1)
  ctx.quadraticCurveTo(x + w * 0.62, y + w * 0.72, x, y + w * 1.02)
  ctx.quadraticCurveTo(x - w * 0.62, y + w * 0.72, x - w * 0.8, y + w * 0.1)
  ctx.lineTo(x - w * 0.88, y - w * 0.62)
  ctx.closePath()
}

function armor(ctx, x, y, s) {
  const w = 34 * s
  ctx.shadowColor = 'rgba(160, 200, 255, 0.45)'
  ctx.shadowBlur = 14 * s
  const g = ctx.createLinearGradient(x - w, y - w, x + w, y + w)
  g.addColorStop(0, '#ffffff')
  g.addColorStop(0.35, '#b9c7d8')
  g.addColorStop(1, '#4a5a72')
  ctx.fillStyle = g
  plate(ctx, x, y, w)
  ctx.fill()
  ctx.shadowBlur = 0
  ctx.strokeStyle = '#2b3448'
  ctx.lineWidth = 2.5 * s
  ctx.stroke()
  ctx.strokeStyle = 'rgba(255,255,255,0.55)'
  ctx.lineWidth = 1.5 * s
  plate(ctx, x, y + w * 0.04, w * 0.76)
  ctx.stroke()
  ctx.fillStyle = '#5c6a84'
  for (const [rx, ry] of [[-0.62, -0.48], [0.62, -0.48], [-0.5, 0.28], [0.5, 0.28]]) {
    ctx.beginPath()
    ctx.arc(x + rx * w, y + ry * w, 2.4 * s, 0, TAU)
    ctx.fill()
  }
  ctx.save()
  ctx.translate(x, y + w * 0.05)
  drawIcon(ctx, 'heart', 14 * s, '#ff4d7a')
  ctx.restore()
}

// A horseshoe magnet reeling in a bubble on a tractor beam.
function magnet(ctx, x, y, s, t) {
  const legX = 14 * s
  const top = y - 2 * s
  const bend = y + 14 * s
  const bubbleY = y - 30 * s + Math.sin(t * 4) * 2 * s
  ctx.strokeStyle = 'rgba(77, 166, 255, 0.7)'
  ctx.lineWidth = 2.5 * s
  ctx.setLineDash([4 * s, 4 * s])
  ctx.lineDashOffset = -t * 30
  for (const sx of [-1, 1]) {
    ctx.beginPath()
    ctx.moveTo(x + sx * legX, top - 8 * s)
    ctx.quadraticCurveTo(x + sx * legX * 0.6, bubbleY + 8 * s, x + sx * 4 * s, bubbleY + 6 * s)
    ctx.stroke()
  }
  ctx.setLineDash([])

  ctx.lineCap = 'butt'
  ctx.lineWidth = 13 * s
  const g = ctx.createLinearGradient(x - legX, 0, x + legX, 0)
  g.addColorStop(0, '#b3132e')
  g.addColorStop(0.45, '#ff6a7a')
  g.addColorStop(1, '#c41d3a')
  ctx.strokeStyle = g
  ctx.beginPath()
  ctx.moveTo(x - legX, top)
  ctx.lineTo(x - legX, bend)
  ctx.arc(x, bend, legX, Math.PI, 0, true)
  ctx.lineTo(x + legX, top)
  ctx.stroke()
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'
  ctx.lineWidth = 2 * s
  ctx.beginPath()
  ctx.moveTo(x - legX - 3 * s, top + 2 * s)
  ctx.lineTo(x - legX - 3 * s, bend)
  ctx.arc(x, bend, legX + 3 * s, Math.PI, Math.PI * 0.75, true)
  ctx.stroke()
  // the silver pole tips
  for (const sx of [-1, 1]) {
    const tg = ctx.createLinearGradient(x + sx * legX - 6.5 * s, 0, x + sx * legX + 6.5 * s, 0)
    tg.addColorStop(0, '#8fa0b8')
    tg.addColorStop(0.5, '#ffffff')
    tg.addColorStop(1, '#8fa0b8')
    ctx.fillStyle = tg
    ctx.fillRect(x + sx * legX - 6.5 * s, top - 9 * s, 13 * s, 9 * s)
  }
  drawBubble(ctx, x, bubbleY, 11 * s, 'shield', t)
}

// The player's own ship with a helper drone off each wing.
function drones(ctx, x, y, s, paint, ship, t) {
  ctx.save()
  ctx.translate(x, y + 2 * s)
  ctx.scale(0.66 * s, 0.66 * s)
  drawShipModel(ctx, 0, 0, ship, paint, { t, thrust: 0.4 })
  ctx.restore()
  for (const sx of [-1, 1]) {
    ctx.save()
    ctx.translate(x + sx * 34 * s, y + 6 * s + Math.sin(t * 4 + sx) * 2 * s)
    ctx.scale(1.15 * s, 1.15 * s)
    drawDrone(ctx, 0, 0, paint, t)
    ctx.restore()
  }
}
