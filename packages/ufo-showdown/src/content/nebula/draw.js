// The nebula's own art: the Phantom and its echoes, the lurker saucer, the
// space fireflies and the map icon. Same rules as ../../art.js: plain canvas
// paths, centred on (x, y), leaving the context as they found it.

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

// ---------------------------------------------------------------- the Phantom

// The Phantom is a ghost wearing a flying saucer round its middle: a sheet
// with a ragged, rippling hem, a ring of running lights, and big eyes that
// are the one part of it you can always see through the fog.
//
// `warp` (0..1) squeezes it thin and tall as it teleports away.
export const EYE = { x: 0.25, y: -0.42 }

export function ghostEyes(x, y, r, warp = 0) {
  const sx = 1 - warp * 0.85
  const sy = 1 + warp * 0.5
  return [-1, 1].map((d) => [x + d * EYE.x * r * sx, y + EYE.y * r * sy])
}

export function drawGhost(ctx, x, y, r, t, o = {}) {
  const { alpha = 1, warp = 0, flash = 0, hurt = 0, charge = 0, chargeColor = '#ff7bd8', angry = false, echo = false, blink = false } = o
  const a = alpha * (1 - warp)
  if (a <= 0.01) return
  ctx.save()
  ctx.translate(x, y)
  if (hurt > 0) ctx.translate(Math.sin(t * 90) * 3 * hurt, 0)
  ctx.scale(1 - warp * 0.85, 1 + warp * 0.5)
  ctx.globalAlpha = a

  // a cold aura, so it looks lit from inside when the fog parts
  ctx.globalCompositeOperation = 'lighter'
  ctx.globalAlpha = a * (echo ? 0.25 : 0.4)
  ctx.drawImage(glow('#9d8cff', false), -r * 1.5, -r * 1.6, r * 3, r * 3)
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = a

  // the saucer disc goes on first; its front rim is drawn again over the
  // sheet below, so the ghost looks like it's wearing it
  const dy = r * 0.16
  const ring = (front) => {
    const hg = ctx.createLinearGradient(0, dy - r * 0.26, 0, dy + r * 0.26)
    hg.addColorStop(0, echo ? '#b6a8ee' : '#a99cf0')
    hg.addColorStop(0.5, echo ? '#6b5cc0' : '#5a4aa8')
    hg.addColorStop(1, '#1f1648')
    ctx.fillStyle = hg
    ctx.beginPath()
    if (front) {
      ctx.ellipse(0, dy, r, r * 0.26, 0, 0, Math.PI)
      ctx.ellipse(0, dy, r, r * 0.07, 0, Math.PI, 0, true)
    } else ctx.ellipse(0, dy, r, r * 0.26, 0, 0, TAU)
    ctx.fill()
  }
  ring(false)

  // the sheet
  const top = -r
  const hem = r * 0.62
  const side = r * 0.66
  ctx.beginPath()
  ctx.moveTo(-side - r * 0.06, hem)
  ctx.bezierCurveTo(-side - r * 0.02 + Math.sin(t * 2) * r * 0.03, hem * 0.4, -side, -r * 0.2, -side, top + side)
  ctx.arc(0, top + side, side, Math.PI, TAU)
  ctx.bezierCurveTo(side, -r * 0.2, side + r * 0.02 + Math.sin(t * 2 + 1) * r * 0.03, hem * 0.4, side + r * 0.06, hem)
  const n = 4
  const span = (side + r * 0.06) * 2
  for (let i = 0; i < n; i++) {
    const x0 = side + r * 0.06 - (span * i) / n
    const x1 = side + r * 0.06 - (span * (i + 1)) / n
    const wob = Math.sin(t * 3.2 + i * 1.9) * r * 0.07
    ctx.quadraticCurveTo((x0 + x1) / 2 + wob * 0.5, hem + r * 0.26 + wob, x1, hem)
  }
  ctx.closePath()
  const sg = ctx.createLinearGradient(0, top, 0, hem + r * 0.3)
  sg.addColorStop(0, echo ? 'rgba(236,228,255,0.85)' : 'rgba(248,244,255,0.97)')
  sg.addColorStop(0.45, echo ? 'rgba(206,192,255,0.7)' : 'rgba(222,212,255,0.9)')
  sg.addColorStop(1, 'rgba(150,130,255,0.15)')
  ctx.fillStyle = sg
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'
  ctx.lineWidth = Math.max(1.5, r * 0.025)
  ctx.stroke()

  // a sheen across the top of the head
  ctx.fillStyle = 'rgba(255,255,255,0.45)'
  ctx.beginPath()
  ctx.ellipse(-r * 0.26, top + r * 0.3, r * 0.14, r * 0.07, -0.6, 0, TAU)
  ctx.fill()

  // eyes: dark hollows with a glowing light in each
  const eyeCol = charge > 0.05 ? chargeColor : '#7dfcff'
  for (const d of [-1, 1]) {
    ctx.save()
    ctx.translate(d * EYE.x * r, EYE.y * r)
    ctx.rotate(d * (angry ? 0.35 : 0.12))
    ctx.fillStyle = '#251447'
    ctx.beginPath()
    ctx.ellipse(0, 0, r * 0.13, blink ? r * 0.025 : r * 0.17, 0, 0, TAU)
    ctx.fill()
    if (!blink) {
      ctx.fillStyle = eyeCol
      ctx.beginPath()
      ctx.ellipse(0, r * 0.02, r * 0.075, r * 0.1, 0, 0, TAU)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(-r * 0.025, -r * 0.03, r * 0.032, 0, TAU)
      ctx.fill()
    }
    ctx.restore()
  }
  if (angry) {
    ctx.strokeStyle = '#3a1f6e'
    ctx.lineWidth = r * 0.045
    ctx.lineCap = 'round'
    for (const d of [-1, 1]) {
      ctx.beginPath()
      ctx.moveTo(d * r * 0.42, EYE.y * r - r * 0.22)
      ctx.lineTo(d * r * 0.12, EYE.y * r - r * 0.13)
      ctx.stroke()
    }
  }

  // the mouth: a wobbly grin, or a round "Boo!" when it's about to shoot
  const my = -r * 0.12
  if (charge > 0.05 || hurt > 0.3) {
    const mr = r * (0.05 + 0.07 * Math.max(charge, hurt * 0.6))
    ctx.fillStyle = '#251447'
    ctx.beginPath()
    ctx.ellipse(0, my + r * 0.02, mr * 0.85, mr, 0, 0, TAU)
    ctx.fill()
    if (charge > 0.05) {
      ctx.fillStyle = hexA(chargeColor, 0.5 + 0.5 * charge)
      ctx.beginPath()
      ctx.ellipse(0, my + r * 0.02, mr * 0.5, mr * 0.6, 0, 0, TAU)
      ctx.fill()
    }
  } else {
    ctx.strokeStyle = '#3a1f6e'
    ctx.lineWidth = Math.max(1.5, r * 0.035)
    ctx.lineCap = 'round'
    ctx.beginPath()
    for (let i = 0; i <= 8; i++) {
      const u = i / 8 - 0.5
      ctx.lineTo(u * r * 0.32, my + Math.sin(u * 9 + t * 4) * r * 0.025 + u * u * r * 0.1)
    }
    ctx.stroke()
  }

  // the front of the saucer ring, with lights chasing round it
  ring(true)
  const lights = echo ? 7 : 11
  const lc = charge > 0.05 ? chargeColor : '#7dfcff'
  for (let i = 0; i < lights; i++) {
    const u = (i / (lights - 1)) * 2 - 1
    const on = Math.sin(t * 7 - i * 0.8) > 0.1
    ctx.fillStyle = on ? lc : hexA(lc, 0.3)
    ctx.beginPath()
    ctx.arc(u * r * 0.86, dy + r * 0.1 + (1 - u * u) * r * 0.06, Math.max(1.6, r * 0.04), 0, TAU)
    ctx.fill()
  }

  if (flash > 0) {
    ctx.globalAlpha = a * Math.min(1, flash) * 0.6
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(0, top + side, side, Math.PI, TAU)
    ctx.lineTo(side, hem)
    ctx.lineTo(-side, hem)
    ctx.fill()
  }
  ctx.restore()
}

// ---------------------------------------------------------------- the lurker

// A stealth saucer: a dark lens of a hull with one big eye in its dome. It
// lights up pink only when it's about to shoot.
export function drawLurker(ctx, e, t) {
  const r = e.r
  const lit = e.glow || 0
  ctx.save()
  ctx.translate(e.x, e.y)
  ctx.rotate(e.tilt || 0)

  if (lit > 0.02) {
    ctx.globalCompositeOperation = 'lighter'
    ctx.globalAlpha = lit * 0.7
    ctx.drawImage(glow('#ff5fd2', false), -r * 1.6, -r * 1.4, r * 3.2, r * 3.2)
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1
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
  // the eye
  const ey = -r * 0.24
  ctx.fillStyle = '#12082a'
  ctx.beginPath()
  ctx.ellipse(0, ey, dr * 0.62, dr * 0.42, 0, 0, TAU)
  ctx.fill()
  ctx.fillStyle = lit > 0.1 ? '#ff5fd2' : '#8a3a8f'
  ctx.beginPath()
  ctx.ellipse(Math.sin(t * 1.3) * dr * 0.2, ey, dr * 0.28, dr * 0.3 * (0.4 + 0.6 * Math.max(lit, 0.5)), 0, 0, TAU)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(Math.sin(t * 1.3) * dr * 0.2 - dr * 0.08, ey - dr * 0.08, dr * 0.08, 0, TAU)
  ctx.fill()

  // the lens-shaped hull, pointed at the ends
  const hg = ctx.createLinearGradient(0, -r * 0.3, 0, r * 0.3)
  hg.addColorStop(0, '#8d80c8')
  hg.addColorStop(0.45, '#3d2d7a')
  hg.addColorStop(1, '#140b33')
  ctx.fillStyle = hg
  ctx.beginPath()
  ctx.moveTo(-r * 1.15, 0)
  ctx.quadraticCurveTo(0, -r * 0.5, r * 1.15, 0)
  ctx.quadraticCurveTo(0, r * 0.52, -r * 1.15, 0)
  ctx.fill()
  ctx.strokeStyle = hexA('#ff5fd2', 0.25 + 0.6 * lit)
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(-r * 1.1, 0.5)
  ctx.quadraticCurveTo(0, r * 0.3, r * 1.1, 0.5)
  ctx.stroke()
  for (const d of [-1, 1]) {
    ctx.fillStyle = lit > 0.1 || Math.sin(t * 3 + d) > 0.6 ? '#ff5fd2' : '#5a2a6e'
    ctx.beginPath()
    ctx.arc(d * r * 0.72, r * 0.06, 2.6, 0, TAU)
    ctx.fill()
  }

  if (e.flash > 0) {
    ctx.globalAlpha = Math.min(1, e.flash) * 0.75
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.moveTo(-r * 1.15, 0)
    ctx.quadraticCurveTo(0, -r * 0.5, r * 1.15, 0)
    ctx.quadraticCurveTo(0, r * 0.52, -r * 1.15, 0)
    ctx.fill()
  }
  ctx.restore()
}

// ---------------------------------------------------------------- fireflies

// A space firefly: catch one and your light grows big for a while.
export function drawFirefly(ctx, x, y, t, s = 1) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(s, s)
  const pulse = 0.75 + 0.25 * Math.sin(t * 6)
  ctx.globalCompositeOperation = 'lighter'
  ctx.globalAlpha = 0.55 * pulse
  ctx.drawImage(glow('#ffe65a', false), -44, -44, 88, 88)
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = 1
  // wings, fluttering
  const flap = 0.35 + 0.65 * Math.abs(Math.sin(t * 22))
  ctx.fillStyle = 'rgba(220,240,255,0.75)'
  for (const d of [-1, 1]) {
    ctx.save()
    ctx.rotate(d * 0.5)
    ctx.beginPath()
    ctx.ellipse(d * 9, -7, 9, 5 * flap, d * 0.3, 0, TAU)
    ctx.fill()
    ctx.restore()
  }
  // body: a dark head and a glowing tail
  ctx.fillStyle = '#3a2f5a'
  ctx.beginPath()
  ctx.arc(0, -8, 5, 0, TAU)
  ctx.fill()
  const tg = ctx.createRadialGradient(0, 4, 1, 0, 4, 10)
  tg.addColorStop(0, '#ffffff')
  tg.addColorStop(0.4, '#fff59a')
  tg.addColorStop(1, '#ffc93d')
  ctx.fillStyle = tg
  ctx.beginPath()
  ctx.ellipse(0, 4, 7, 10, 0, 0, TAU)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  for (const d of [-1, 1]) {
    ctx.beginPath()
    ctx.arc(d * 2, -9, 1.3, 0, TAU)
    ctx.fill()
  }
  ctx.strokeStyle = '#3a2f5a'
  ctx.lineWidth = 1.5
  ctx.lineCap = 'round'
  for (const d of [-1, 1]) {
    ctx.beginPath()
    ctx.moveTo(d * 2, -12)
    ctx.quadraticCurveTo(d * 4, -18, d * 7, -18)
    ctx.stroke()
  }
  ctx.restore()
}

// ---------------------------------------------------------------- map icon

// Fog in three colours, a ship in its pool of light, and a pair of eyes up
// in the murk.
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

  // the pool of light round the ship
  const px = 30
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
  for (const [sx, sy] of [[24, 36], [37, 39], [27, 48]]) ctx.fillRect(sx, sy, 0.8, 0.8)
  // a tiny ship
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

  // the eyes in the fog
  for (const d of [-1, 1]) {
    const ex = 54 + d * 5
    const ey = 17
    const eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, 7)
    eg.addColorStop(0, 'rgba(125,252,255,0.85)')
    eg.addColorStop(1, 'rgba(125,252,255,0)')
    ctx.fillStyle = eg
    ctx.fillRect(ex - 7, ey - 7, 14, 14)
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.ellipse(ex, ey, 1.6, 2.3, d * 0.3, 0, TAU)
    ctx.fill()
  }
}
