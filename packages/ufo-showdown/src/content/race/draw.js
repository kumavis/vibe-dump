// Ring Race art: the hoops, the buoys and space junk, the warp streaks and
// the sparkles. All plain canvas paths, centred on (x, y), leaving the context
// as they found it.
//
// A ring is a hoop seen from above at a slant, so it's an ellipse. Its far
// (upper) half is drawn behind the ships and its near (lower) half in front of
// them, which is all it takes for a ship to look like it flies through.

import { hexA } from '../../stars.js'
import { drawShip, drawStar, PLAYER_COLORS } from '../../art.js'
import { SQUASH } from './patterns.js'

const TAU = Math.PI * 2

// Ring colours steer clear of the players' cyan and pink, so a ring never
// looks like it belongs to one of them.
export const RING_PALS = [
  { main: '#3cf2c8', light: '#dafff5', dark: '#0d6e60', back: '#1fa98c' },
  { main: '#b48cff', light: '#f0e6ff', dark: '#46238f', back: '#7c55d6' },
  { main: '#a8f04a', light: '#f2ffd6', dark: '#41700c', back: '#73b52a' },
  { main: '#ff9d4a', light: '#ffe8d1', dark: '#94400c', back: '#d06a24' },
]
export const GOLD_PAL = { main: '#ffd54a', light: '#fff8d2', dark: '#9a6200', back: '#d9a21e' }
const MISS_PAL = { main: '#8d91b5', light: '#d7d9ee', dark: '#3a3d5c', back: '#5f6386' }

// How big and how solid a ring looks at height y: it fades in at the top and
// grows as it comes closer, reaching full size just above the ships.
export function depth(y, top) {
  const k = Math.max(0, Math.min(1, (y + 40) / (top + 10)))
  const e = k * k * (3 - 2 * k)
  return { s: 0.5 + 0.5 * e, a: Math.max(0, Math.min(1, (y + 70) / 110)) }
}

// One half of a ring: `front` false is the far half (behind the ships), true
// the near half. `r` is { x, y, rx, gold, pal, miss, alpha, flash }: `flash`
// (1..0) is the white-hot moment just after a ship flies through.
export function drawRingHalf(ctx, r, front, t, top) {
  const { s, a } = depth(r.y, top)
  const alpha = a * (r.alpha ?? 1)
  if (alpha <= 0.01) return
  const pal = r.miss ? MISS_PAL : r.gold ? GOLD_PAL : RING_PALS[r.pal % RING_PALS.length]
  const rx = r.rx * s
  const ry = rx * SQUASH
  const tube = (r.gold ? 10 : 8) * s
  const a0 = front ? 0 : Math.PI
  const a1 = front ? Math.PI : TAU
  const arc = (dy, grow = 0) => {
    ctx.beginPath()
    ctx.ellipse(r.x, r.y + dy, rx + grow, ry + grow * SQUASH, 0, a0, a1)
  }

  ctx.save()
  ctx.globalAlpha = alpha
  ctx.lineCap = 'butt'

  if (!front) {
    // the gate itself: a faint glowing skin across the opening
    ctx.globalCompositeOperation = 'lighter'
    ctx.fillStyle = hexA(r.flash ? pal.light : pal.main, r.miss ? 0.03 : 0.07 + 0.04 * Math.sin(t * 5 + r.x) + (r.flash ?? 0) * 0.3)
    ctx.beginPath()
    ctx.ellipse(r.x, r.y, rx, ry, 0, 0, TAU)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
  }

  // soft glow round the tube
  if (!r.miss) {
    ctx.globalCompositeOperation = 'lighter'
    ctx.strokeStyle = hexA(pal.main, front ? 0.32 : 0.22)
    ctx.lineWidth = tube * 2.8
    arc(0)
    ctx.stroke()
    ctx.globalCompositeOperation = 'source-over'
  }

  // the tube: a dark underside, the colour, and a shine along the top. The far
  // half is the inside of the hoop, so it's a shade darker.
  ctx.strokeStyle = pal.dark
  ctx.lineWidth = tube
  arc(tube * 0.22)
  ctx.stroke()
  ctx.strokeStyle = front ? pal.main : pal.back
  ctx.lineWidth = tube * 0.72
  arc(0)
  ctx.stroke()
  ctx.strokeStyle = hexA('#ffffff', front ? 0.85 : 0.45)
  ctx.lineWidth = tube * 0.24
  arc(-tube * 0.2)
  ctx.stroke()
  if (r.flash > 0) {
    ctx.strokeStyle = hexA('#ffffff', r.flash)
    ctx.lineWidth = tube * 0.9
    arc(0)
    ctx.stroke()
  }

  // chasing lights round the rim
  if (!r.miss) {
    const n = r.gold ? 14 : 10
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * TAU + t * 0.9
      const sn = Math.sin(ang)
      if (sn >= 0 !== front) continue
      const on = Math.sin(t * 9 - i * 1.3) > 0.2
      const bx = r.x + Math.cos(ang) * rx
      const by = r.y + sn * ry - tube * 0.1
      ctx.fillStyle = on ? '#ffffff' : pal.light
      ctx.globalAlpha = alpha * (on ? 1 : 0.55) * (front ? 1 : 0.7)
      ctx.beginPath()
      ctx.arc(bx, by, (on ? 2.6 : 1.8) * s, 0, TAU)
      ctx.fill()
    }
    ctx.globalAlpha = alpha
  }

  // a gold ring wears a star on top, so it reads as a prize from far away
  if (r.gold && !front && !r.miss) {
    const bob = Math.sin(t * 4) * 3
    ctx.save()
    ctx.translate(r.x, r.y - ry - 16 * s + bob)
    ctx.rotate(Math.sin(t * 2) * 0.15)
    ctx.globalCompositeOperation = 'lighter'
    ctx.fillStyle = hexA(GOLD_PAL.main, 0.35)
    ctx.beginPath()
    ctx.arc(0, 0, 20 * s, 0, TAU)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
    drawStar(ctx, 0, 0, 14 * s, GOLD_PAL.main)
    drawStar(ctx, 0, -1.5 * s, 7 * s, '#fff8d2')
    ctx.restore()
  }
  ctx.restore()
}

// The pop when a ship flies through: a bright copy of the ring that swells and
// fades, with a flash across its opening.
export function drawBurst(ctx, f) {
  const k = f.t / f.max
  const pal = f.gold ? GOLD_PAL : RING_PALS[f.pal % RING_PALS.length]
  const rx = f.rx * (1 + k * 0.55)
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  if (k < 0.4) {
    ctx.fillStyle = hexA(pal.light, (0.4 - k) * 0.9)
    ctx.beginPath()
    ctx.ellipse(f.x, f.y, f.rx, f.rx * SQUASH, 0, 0, TAU)
    ctx.fill()
  }
  ctx.globalAlpha = 1 - k
  ctx.strokeStyle = pal.main
  ctx.lineWidth = 10 * (1 - k) + 2
  ctx.beginPath()
  ctx.ellipse(f.x, f.y, rx, rx * SQUASH, 0, 0, TAU)
  ctx.stroke()
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 3 * (1 - k) + 1
  ctx.stroke()
  ctx.restore()
}

// Little four-pointed twinkles: the confetti of a ring well flown.
export function drawSparkles(ctx, list) {
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  for (const p of list) {
    const k = Math.max(0, p.life / p.max)
    const s = p.size * (0.4 + 0.6 * k)
    ctx.globalAlpha = Math.min(1, k * 1.6)
    ctx.fillStyle = p.color
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(p.rot)
    ctx.beginPath()
    ctx.moveTo(0, -s)
    ctx.quadraticCurveTo(0, 0, s, 0)
    ctx.quadraticCurveTo(0, 0, 0, s)
    ctx.quadraticCurveTo(0, 0, -s, 0)
    ctx.quadraticCurveTo(0, 0, 0, -s)
    ctx.fill()
    ctx.restore()
  }
  ctx.restore()
}

// Warp streaks fanning out from a point above the screen: the feel of going
// fast without anything to dodge. `lines` are { u, y, len, k, col }: u is the
// lateral spread (-1..1), k how bright. `boost` (0..1) is the rush, `fade`
// (1..0) the race winding down.
export function drawSpeedLines(ctx, lines, W, H, boost, fade = 1) {
  const cx = W / 2
  const spread = W * 0.62
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  ctx.lineCap = 'round'
  const at = (u, y) => cx + u * spread * (0.3 + (0.7 * Math.max(0, y)) / H)
  for (const l of lines) {
    // a long faint tail and a short bright head, like a star smeared by speed
    const len = l.len * (1 + boost * 0.8)
    const y0 = l.y - len
    const yh = l.y - len * 0.22
    ctx.globalAlpha = l.k * (0.45 + boost * 0.4) * fade
    ctx.strokeStyle = l.col
    ctx.lineWidth = l.w
    ctx.beginPath()
    ctx.moveTo(at(l.u, y0), y0)
    ctx.lineTo(at(l.u, yh), yh)
    ctx.stroke()
    ctx.globalAlpha = Math.min(1, l.k * (2.4 + boost * 1.4)) * fade
    ctx.lineWidth = l.w + 0.6
    ctx.beginPath()
    ctx.moveTo(at(l.u, yh), yh)
    ctx.lineTo(at(l.u, l.y), l.y)
    ctx.stroke()
  }
  ctx.restore()
}

// ---------------------------------------------------------------- obstacles

// A striped navigation buoy with a blinking beacon, or a tumbling old
// satellite. `b` is { x, y, r, kind, rot, t, hit }.
export function drawBuoy(ctx, b, t, warn) {
  ctx.save()
  ctx.translate(b.x, b.y)

  // a soft warning halo once it's down where the ships fly
  if (warn > 0) {
    ctx.strokeStyle = hexA('#ff6a4a', warn * (0.28 + 0.16 * Math.sin(t * 8 + b.x)))
    ctx.lineWidth = 3
    ctx.setLineDash([7, 7])
    ctx.lineDashOffset = -t * 20
    ctx.beginPath()
    ctx.arc(0, 0, b.r + 16, 0, TAU)
    ctx.stroke()
    ctx.setLineDash([])
  }

  ctx.rotate(b.rot)
  if (b.kind === 'sat') drawSat(ctx, b, t)
  else drawFloat(ctx, b, t)
  ctx.restore()
}

function drawFloat(ctx, b, t) {
  const r = b.r
  // mast and beacon
  ctx.strokeStyle = '#c9cfe6'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(0, -r * 0.8)
  ctx.lineTo(0, -r - 11)
  ctx.stroke()
  const blink = !b.hit && Math.sin(t * 7 + b.x * 0.1) > 0
  if (blink) {
    ctx.globalCompositeOperation = 'lighter'
    const g = ctx.createRadialGradient(0, -r - 13, 0, 0, -r - 13, 16)
    g.addColorStop(0, 'rgba(255,90,90,0.9)')
    g.addColorStop(1, 'rgba(255,60,60,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(0, -r - 13, 16, 0, TAU)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
  }
  ctx.fillStyle = blink ? '#ffffff' : '#ff4d5e'
  ctx.beginPath()
  ctx.arc(0, -r - 13, 4, 0, TAU)
  ctx.fill()

  // the ball, with a white band round its middle
  const g = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r)
  g.addColorStop(0, '#ffe2c4')
  g.addColorStop(0.45, '#ff7a3d')
  g.addColorStop(1, '#a3300f')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, TAU)
  ctx.fill()
  ctx.save()
  ctx.clip()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.fillRect(-r, -r * 0.2, r * 2, r * 0.4)
  ctx.fillStyle = '#ff4d5e'
  for (let i = -2; i <= 2; i++) ctx.fillRect(i * r * 0.45 - r * 0.1, -r * 0.2, r * 0.2, r * 0.4)
  ctx.restore()
  // rivets and a shine
  ctx.fillStyle = 'rgba(80,20,10,0.55)'
  for (const a of [-2.4, -0.7, 0.7, 2.4]) {
    ctx.beginPath()
    ctx.arc(Math.cos(a) * r * 0.62, Math.sin(a) * r * 0.62 + (a > 0 ? 3 : -3), 1.6, 0, TAU)
    ctx.fill()
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.arc(0, 0, r * 0.72, Math.PI * 1.1, Math.PI * 1.4)
  ctx.stroke()
  ctx.strokeStyle = 'rgba(40,10,0,0.5)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, TAU)
  ctx.stroke()
}

function drawSat(ctx, b, t) {
  const r = b.r
  // solar panels on struts
  for (const d of [-1, 1]) {
    ctx.strokeStyle = '#9aa3c0'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(d * r * 0.5, 0)
    ctx.lineTo(d * r * 0.95, 0)
    ctx.stroke()
    const px = d > 0 ? r * 0.95 : -r * 0.95 - r * 1.25
    const pg = ctx.createLinearGradient(px, -r * 0.5, px + r * 1.25, r * 0.5)
    pg.addColorStop(0, '#5ab4ff')
    pg.addColorStop(1, '#2443a8')
    ctx.fillStyle = pg
    ctx.beginPath()
    ctx.roundRect(px, -r * 0.48, r * 1.25, r * 0.96, 3)
    ctx.fill()
    ctx.strokeStyle = 'rgba(220,240,255,0.7)'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    for (let i = 1; i < 4; i++) {
      ctx.moveTo(px + (r * 1.25 * i) / 4, -r * 0.48)
      ctx.lineTo(px + (r * 1.25 * i) / 4, r * 0.48)
    }
    ctx.moveTo(px, 0)
    ctx.lineTo(px + r * 1.25, 0)
    ctx.stroke()
  }
  // gold-foil body
  const g = ctx.createLinearGradient(-r * 0.6, -r * 0.6, r * 0.6, r * 0.6)
  g.addColorStop(0, '#fff1a8')
  g.addColorStop(0.5, '#e8a92a')
  g.addColorStop(1, '#8a5500')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.roundRect(-r * 0.58, -r * 0.62, r * 1.16, r * 1.24, 4)
  ctx.fill()
  ctx.strokeStyle = 'rgba(90,50,0,0.6)'
  ctx.lineWidth = 1.5
  ctx.stroke()
  // dish and blinking light
  ctx.fillStyle = '#e9edf8'
  ctx.beginPath()
  ctx.ellipse(0, -r * 0.62, r * 0.42, r * 0.16, 0, Math.PI, TAU)
  ctx.fill()
  const blink = !b.hit && Math.sin(t * 6 + b.y * 0.05) > 0
  ctx.fillStyle = blink ? '#ff4d5e' : '#7a1f2c'
  ctx.beginPath()
  ctx.arc(0, r * 0.1, 3.5, 0, TAU)
  ctx.fill()
}

// The cartoon stars that circle a ship that bumped into something.
export function drawDizzy(ctx, x, y, t, k) {
  ctx.save()
  ctx.globalAlpha = Math.min(1, k * 2)
  for (let i = 0; i < 3; i++) {
    const a = t * 7 + (i * TAU) / 3
    drawStar(ctx, x + Math.cos(a) * 24, y + Math.sin(a) * 7, 6, i % 2 ? '#ffe23d' : '#ffffff')
  }
  ctx.restore()
}

// ---------------------------------------------------------------- the map icon

// Rings stepping away into the distance, a gold one at the far end, and a
// little ship about to fly through the nearest.
export function drawIcon(ctx, w, h) {
  ctx.save()
  const sky = ctx.createLinearGradient(0, 0, 0, h)
  sky.addColorStop(0, '#0b0726')
  sky.addColorStop(1, '#14305a')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, w, h)
  // warp streaks
  ctx.strokeStyle = 'rgba(159,240,255,0.35)'
  ctx.lineWidth = 0.8
  for (let i = 0; i < 9; i++) {
    const u = (i / 8) * 2 - 1
    ctx.beginPath()
    ctx.moveTo(w / 2 + u * 14, 6 + (i % 3) * 4)
    ctx.lineTo(w / 2 + u * 46, h - 4 - (i % 2) * 8)
    ctx.stroke()
  }
  ctx.fillStyle = '#ffffff'
  for (const [sx, sy] of [[8, 8], [70, 12], [16, 30], [74, 38], [56, 6]]) ctx.fillRect(sx, sy, 1, 1)

  const rings = [
    { x: 46, y: 7, rx: 8, pal: GOLD_PAL },
    { x: 34, y: 17, rx: 12, pal: RING_PALS[1] },
    { x: 44, y: 30, rx: 17, pal: RING_PALS[0] },
  ]
  const half = (r, front) => {
    const ry = r.rx * 0.36
    const a0 = front ? 0 : Math.PI
    const lw = r.rx * 0.2
    ctx.lineWidth = lw * 2.2
    ctx.strokeStyle = hexA(r.pal.main, 0.3)
    ctx.beginPath()
    ctx.ellipse(r.x, r.y, r.rx, ry, 0, a0, a0 + Math.PI)
    ctx.stroke()
    ctx.lineWidth = lw
    ctx.strokeStyle = front ? r.pal.main : r.pal.back
    ctx.stroke()
    ctx.lineWidth = lw * 0.35
    ctx.strokeStyle = 'rgba(255,255,255,0.8)'
    ctx.beginPath()
    ctx.ellipse(r.x, r.y - lw * 0.2, r.rx, ry, 0, a0, a0 + Math.PI)
    ctx.stroke()
  }
  for (const r of rings) half(r, false)
  for (const r of rings.slice(0, 2)) half(r, true)
  drawStar(ctx, 46, 1.5, 3, GOLD_PAL.main)
  drawShip(ctx, 44, 33, PLAYER_COLORS[0], { scale: 0.32, thrust: 0.9, t: 0.3 })
  half(rings[2], true)
  ctx.restore()
}
