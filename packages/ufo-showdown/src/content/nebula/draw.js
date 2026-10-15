// The nebula's small art: the soft glows everything that shines through the
// fog is made of, the lurker saucer, the luminous crystals and the map icon.
// The Gloomtopus has a file of its own (octoart.js). Same rules as
// ../../art.js: plain canvas paths, centred on (x, y), leaving the context as
// they found it.

import { hexA } from '../../stars.js'

const TAU = Math.PI * 2

// ---------------------------------------------------------------- glows

// A soft round glow, baked once per colour and stamped at any size. The hints
// that shine through the fog are all made of these, added with 'lighter'.
const glows = new Map()
export function glow(color, core = true) {
  const key = color + core
  let c = glows.get(key)
  if (!c) {
    const s = 96
    c = document.createElement('canvas')
    c.width = c.height = s
    const g = c.getContext('2d')
    const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
    if (core) {
      grad.addColorStop(0, '#ffffff')
      grad.addColorStop(0.12, '#ffffff')
      grad.addColorStop(0.3, hexA(color, 0.9))
    } else grad.addColorStop(0, hexA(color, 0.8))
    grad.addColorStop(0.55, hexA(color, 0.28))
    grad.addColorStop(1, hexA(color, 0))
    g.fillStyle = grad
    g.fillRect(0, 0, s, s)
    glows.set(key, c)
  }
  return c
}

// Stamp a glow of radius r. Call inside a 'lighter' block for the shine.
export function stamp(ctx, color, x, y, r, a = 1, core = true) {
  if (a <= 0.01 || r <= 0.5) return
  ctx.globalAlpha = Math.min(1, a)
  ctx.drawImage(glow(color, core), x - r, y - r, r * 2, r * 2)
}

// A four-point twinkle, the sparkle on crystals and cloaks.
export function twinkle(ctx, x, y, r, color = '#ffffff') {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x, y - r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.quadraticCurveTo(x, y, x, y + r)
  ctx.quadraticCurveTo(x, y, x - r, y)
  ctx.quadraticCurveTo(x, y, x, y - r)
  ctx.fill()
}

// ---------------------------------------------------------------- the lurker

const PINK = '#ff5fd2'

// The lens-shaped hull, pointed at the ends.
function lens(ctx, r) {
  ctx.beginPath()
  ctx.moveTo(-r * 1.15, 0)
  ctx.quadraticCurveTo(0, -r * 0.5, r * 1.15, 0)
  ctx.quadraticCurveTo(0, r * 0.52, -r * 1.15, 0)
}

// A stealth saucer: a dark lens of a hull with one big eye in its dome. It
// lights up pink only when it's about to shoot. `e.cloak` (0..1) fades it to a
// ripple of bent light; `e.big` is the Shroud, with fins and a second eye.
export function drawLurker(ctx, e, t) {
  const r = e.r
  const lit = e.glow || 0
  const cloak = e.cloak || 0
  const solid = 1 - cloak * 0.92
  ctx.save()
  ctx.translate(e.x, e.y)
  ctx.rotate(e.tilt || 0)

  if (lit > 0.02) {
    ctx.globalCompositeOperation = 'lighter'
    ctx.globalAlpha = lit * 0.7
    ctx.drawImage(glow(PINK, false), -r * 1.6, -r * 1.4, r * 3.2, r * 3.2)
    ctx.globalCompositeOperation = 'source-over'
  }

  if (solid > 0.03) {
    ctx.globalAlpha = solid
    if (e.big) {
      // the Shroud's swept fins
      ctx.fillStyle = '#2a1c5e'
      for (const d of [-1, 1]) {
        ctx.beginPath()
        ctx.moveTo(d * r * 0.5, -r * 0.1)
        ctx.quadraticCurveTo(d * r * 1.1, -r * 0.55, d * r * 1.45, -r * 0.62)
        ctx.quadraticCurveTo(d * r * 1.05, -r * 0.2, d * r * 0.95, r * 0.02)
        ctx.fill()
      }
    }
    // dome
    const dr = r * 0.48
    const dg = ctx.createLinearGradient(0, -dr * 1.2, 0, 0)
    dg.addColorStop(0, '#6d5fb0')
    dg.addColorStop(1, '#241650')
    ctx.fillStyle = dg
    ctx.beginPath()
    ctx.ellipse(0, -r * 0.08, dr, dr, 0, Math.PI, TAU)
    ctx.fill()
    // the eye (two on the Shroud), glancing about
    const ey = -r * 0.24
    const look = Math.sin(t * 1.3) * dr * 0.2
    const eyes = e.big ? [-dr * 0.42, dr * 0.42] : [0]
    const ew = e.big ? 0.36 : 0.62
    for (const ex of eyes) {
      ctx.fillStyle = '#12082a'
      ctx.beginPath()
      ctx.ellipse(ex, ey, dr * ew, dr * 0.42, 0, 0, TAU)
      ctx.fill()
      ctx.fillStyle = lit > 0.1 ? PINK : '#8a3a8f'
      ctx.beginPath()
      ctx.ellipse(ex + look * ew, ey, dr * ew * 0.45, dr * 0.3 * (0.4 + 0.6 * Math.max(lit, 0.5)), 0, 0, TAU)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(ex + look * ew - dr * 0.08, ey - dr * 0.08, dr * 0.08, 0, TAU)
      ctx.fill()
    }

    const hg = ctx.createLinearGradient(0, -r * 0.3, 0, r * 0.3)
    hg.addColorStop(0, '#8d80c8')
    hg.addColorStop(0.45, '#3d2d7a')
    hg.addColorStop(1, '#140b33')
    ctx.fillStyle = hg
    lens(ctx, r)
    ctx.fill()
    ctx.strokeStyle = hexA(PINK, 0.25 + 0.6 * lit)
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(-r * 1.1, 0.5)
    ctx.quadraticCurveTo(0, r * 0.3, r * 1.1, 0.5)
    ctx.stroke()
    const lights = e.big ? [-0.86, -0.45, 0.45, 0.86] : [-0.72, 0.72]
    for (const u of lights) {
      ctx.fillStyle = lit > 0.1 || Math.sin(t * 3 + u * 2) > 0.6 ? PINK : '#5a2a6e'
      ctx.beginPath()
      ctx.arc(u * r, r * 0.06 + (1 - u * u) * r * 0.08, 2.6, 0, TAU)
      ctx.fill()
    }
  }

  if (cloak > 0.05) {
    // the cloak: light bending round where the hull is, in a slow ripple
    ctx.globalAlpha = cloak * (0.3 + 0.18 * Math.sin(t * 4))
    ctx.strokeStyle = '#d8ecff'
    ctx.lineWidth = 1.6
    ctx.setLineDash([9, 13])
    ctx.lineDashOffset = -t * 36
    lens(ctx, r)
    ctx.stroke()
    ctx.beginPath()
    ctx.ellipse(0, -r * 0.08, r * 0.48, r * 0.48, 0, Math.PI * 1.05, Math.PI * 1.95)
    ctx.stroke()
    ctx.setLineDash([])
  }

  if (e.flash > 0) {
    ctx.globalAlpha = Math.min(1, e.flash) * 0.75
    ctx.fillStyle = '#ffffff'
    lens(ctx, r)
    ctx.fill()
  }
  ctx.restore()
}

// A cloaked lurker as crystal light shows it: its outline traced in bright
// pink-white, drawn over the fog.
export function drawLurkerOutline(ctx, e, a) {
  ctx.save()
  ctx.translate(e.x, e.y)
  ctx.rotate(e.tilt || 0)
  ctx.globalAlpha = Math.min(1, a)
  ctx.strokeStyle = '#ffd6f4'
  ctx.lineWidth = 2
  lens(ctx, e.r)
  ctx.stroke()
  ctx.beginPath()
  ctx.ellipse(0, -e.r * 0.08, e.r * 0.48, e.r * 0.48, 0, Math.PI, TAU)
  ctx.stroke()
  ctx.restore()
}

// ---------------------------------------------------------------- crystals

// A luminous crystal: a cluster of glowing quartz shards fanned out of one
// bright heart. The shards are baked once (at twice the size, so they stay
// crisp on a sharp screen); each frame just rocks the sprite gently and winks
// sparkles round it.
const CW = 92
const CH = 78
const BASE = 0.86 // where the heart sits, down the sprite
let crystal = null

function shard(x, a, len, w, shade, lit) {
  x.save()
  x.rotate(a)
  const h = w * 0.62 // where the sides start to taper to the point
  // two facets either side of the ridge, one lit and one in shade
  x.fillStyle = shade
  x.beginPath()
  x.moveTo(0, 3)
  x.lineTo(-w / 2, -2)
  x.lineTo(-w / 2, -len + h)
  x.lineTo(0, -len)
  x.closePath()
  x.fill()
  x.fillStyle = lit
  x.beginPath()
  x.moveTo(0, 3)
  x.lineTo(w / 2, -2)
  x.lineTo(w / 2, -len + h)
  x.lineTo(0, -len)
  x.closePath()
  x.fill()
  x.strokeStyle = 'rgba(20,10,60,0.55)'
  x.lineWidth = 1.2
  x.beginPath()
  x.moveTo(-w / 2, -2)
  x.lineTo(-w / 2, -len + h)
  x.lineTo(0, -len)
  x.lineTo(w / 2, -len + h)
  x.lineTo(w / 2, -2)
  x.stroke()
  x.strokeStyle = 'rgba(255,255,255,0.9)'
  x.lineWidth = 1.3
  x.beginPath()
  x.moveTo(0, 0)
  x.lineTo(0, -len)
  x.stroke()
  // a glint up the lit face
  x.fillStyle = 'rgba(255,255,255,0.6)'
  x.beginPath()
  x.moveTo(w * 0.12, -len * 0.22)
  x.lineTo(w * 0.32, -len * 0.26)
  x.lineTo(w * 0.32, -len * 0.58)
  x.lineTo(w * 0.12, -len * 0.66)
  x.closePath()
  x.fill()
  x.restore()
}

function bakeCrystal() {
  const s = 2
  const c = document.createElement('canvas')
  c.width = CW * s
  c.height = CH * s
  const x = c.getContext('2d')
  x.scale(s, s)
  x.translate(CW / 2, CH * BASE)
  // back to front: the short outer shards, then the inner, the tallest last
  shard(x, -0.95, 27, 13, '#4a33b8', '#a58cff')
  shard(x, 0.92, 25, 12, '#1d7fae', '#86eaff')
  shard(x, -0.45, 42, 17, '#2a7fd0', '#a6f6ff')
  shard(x, 0.42, 38, 16, '#5a3fd8', '#c9b4ff')
  shard(x, 0.04, 56, 21, '#2f9fe0', '#d4fcff')
  // the heart they grow out of
  const g = x.createRadialGradient(0, 0, 0, 0, 0, 16)
  g.addColorStop(0, '#ffffff')
  g.addColorStop(0.45, 'rgba(200,250,255,0.85)')
  g.addColorStop(1, 'rgba(125,252,255,0)')
  x.fillStyle = g
  x.beginPath()
  x.arc(0, 0, 16, 0, TAU)
  x.fill()
  crystal = c
}

// (x, y) is the middle of the cluster.
export function drawCrystal(ctx, x, y, t, s = 1) {
  if (!crystal) bakeCrystal()
  const pulse = 0.75 + 0.25 * Math.sin(t * 3.2)
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(s, s)
  ctx.globalCompositeOperation = 'lighter'
  ctx.globalAlpha = 0.55 * pulse
  ctx.drawImage(glow('#7dfcff', false), -54, -54, 108, 108)
  ctx.globalAlpha = 0.35 * pulse
  ctx.drawImage(glow('#c9a4ff', false), -34, -30, 68, 68)
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = 1
  ctx.save()
  ctx.translate(0, 22)
  ctx.rotate(Math.sin(t * 0.9) * 0.12)
  ctx.drawImage(crystal, -CW / 2, -CH * BASE, CW, CH)
  ctx.restore()
  // sparkles winking in and out round it
  for (let i = 0; i < 5; i++) {
    const k = Math.sin(t * 2.4 + i * 1.7)
    if (k < 0.2) continue
    const a = t * 0.7 + (i * TAU) / 5
    twinkle(ctx, Math.cos(a) * 40, -4 + Math.sin(a) * 30, 3 + 5 * k, i % 2 ? '#ffffff' : '#dffcff')
  }
  ctx.restore()
}

// ---------------------------------------------------------------- map icon

// Fog in three colours, a ship in its pool of light, a crystal, and two big
// golden eyes up in the murk with an arm curling out of it.
export function drawNebulaIcon(ctx, w, h) {
  const blob = (x, y, r, color, a) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, hexA(color, a))
    g.addColorStop(1, hexA(color, 0))
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
  }
  ctx.fillStyle = '#1c0f42'
  ctx.fillRect(0, 0, w, h)
  blob(14, 12, 30, '#ff4fb0', 0.55)
  blob(66, 10, 30, '#38b6ff', 0.5)
  blob(44, 26, 26, '#8f5cff', 0.55)
  blob(72, 42, 22, '#2fe0c0', 0.4)
  blob(6, 44, 20, '#5a7dff', 0.45)

  // an arm curling down out of the fog
  ctx.strokeStyle = 'rgba(214,107,255,0.75)'
  ctx.lineCap = 'round'
  for (const [x0, w0, d] of [[62, 3.2, 1], [46, 2.6, -1]]) {
    ctx.lineWidth = w0
    ctx.beginPath()
    ctx.moveTo(x0, 22)
    ctx.bezierCurveTo(x0 + d * 4, 32, x0 + d * 12, 34, x0 + d * 10, 28)
    ctx.stroke()
  }

  // the pool of light round the ship
  const px = 26
  const py = 42
  const g = ctx.createRadialGradient(px, py, 0, px, py, 17)
  g.addColorStop(0, 'rgba(8,5,26,1)')
  g.addColorStop(0.55, 'rgba(8,5,26,0.85)')
  g.addColorStop(1, 'rgba(8,5,26,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = 'rgba(56,214,255,0.35)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(px, py, 13, 0, TAU)
  ctx.stroke()
  ctx.fillStyle = '#ffffff'
  for (const [sx, sy] of [[20, 36], [33, 39], [23, 48]]) ctx.fillRect(sx, sy, 0.8, 0.8)
  ctx.fillStyle = '#1475b8'
  ctx.beginPath()
  ctx.moveTo(px, py - 4)
  ctx.lineTo(px + 6, py + 3)
  ctx.lineTo(px - 6, py + 3)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#38d6ff'
  ctx.beginPath()
  ctx.moveTo(px, py - 7)
  ctx.lineTo(px + 2, py + 3)
  ctx.lineTo(px - 2, py + 3)
  ctx.closePath()
  ctx.fill()

  // a crystal glinting off to the side
  ctx.save()
  ctx.translate(72, 30)
  const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, 8)
  cg.addColorStop(0, 'rgba(125,252,255,0.8)')
  cg.addColorStop(1, 'rgba(125,252,255,0)')
  ctx.fillStyle = cg
  ctx.fillRect(-8, -8, 16, 16)
  ctx.fillStyle = '#c8fbff'
  ctx.beginPath()
  ctx.moveTo(0, -5)
  ctx.lineTo(2, -2)
  ctx.lineTo(2, 3)
  ctx.lineTo(-2, 3)
  ctx.lineTo(-2, -2)
  ctx.closePath()
  ctx.fill()
  ctx.restore()

  // the eyes in the fog: gold, with sideways pupils
  for (const d of [-1, 1]) {
    const ex = 54 + d * 6
    const ey = 15
    const eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, 8)
    eg.addColorStop(0, 'rgba(255,216,74,0.9)')
    eg.addColorStop(1, 'rgba(255,216,74,0)')
    ctx.fillStyle = eg
    ctx.fillRect(ex - 8, ey - 8, 16, 16)
    ctx.fillStyle = '#ffe36b'
    ctx.beginPath()
    ctx.arc(ex, ey, 3, 0, TAU)
    ctx.fill()
    ctx.fillStyle = '#1a0838'
    ctx.beginPath()
    ctx.ellipse(ex, ey + 0.3, 2.2, 0.9, 0, 0, TAU)
    ctx.fill()
  }
}
