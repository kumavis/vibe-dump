// Everything on screen is drawn with plain canvas paths — no image files.
// Each function draws centred on (x, y) in world units and leaves the context
// as it found it.

import { hexA } from './stars.js'

const TAU = Math.PI * 2

export const PLAYER_COLORS = [
  { main: '#38d6ff', dark: '#1475b8', light: '#d6f8ff', flame: '#7fe8ff', name: 'P1' },
  { main: '#ff5fb8', dark: '#b3237a', light: '#ffe0f2', flame: '#ff9ad3', name: 'P2' },
]

export const POWERS = {
  shield: { color: '#4da6ff', label: 'Shield', blurb: 'blocks one hit' },
  triple: { color: '#ff9d2e', label: 'Triple shot', blurb: 'three lasers' },
  rapid: { color: '#ffe23d', label: 'Rapid fire', blurb: 'shoot faster' },
  speed: { color: '#4dff88', label: 'Speed', blurb: 'zoom!' },
  heart: { color: '#ff4d7a', label: 'Heart', blurb: 'extra life' },
  nova: { color: '#c77dff', label: 'Nova', blurb: 'blasts everything' },
}

// ---------------------------------------------------------------- player ship

export function drawShip(ctx, x, y, pal, { tilt = 0, t = 0, thrust = 0.5, scale = 1 } = {}) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)
  ctx.rotate(tilt * 0.12)

  // engine flames
  const f = 12 + 5 * Math.sin(t * 40) + 14 * thrust
  for (const ex of [-9, 9]) {
    const g = ctx.createLinearGradient(0, 20, 0, 22 + f)
    g.addColorStop(0, '#ffffff')
    g.addColorStop(0.35, pal.flame)
    g.addColorStop(1, hexA(pal.flame, 0))
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.moveTo(ex - 5, 20)
    ctx.quadraticCurveTo(ex, 22 + f * 1.15, ex + 5, 20)
    ctx.closePath()
    ctx.fill()
  }

  ctx.scale(1 - Math.abs(tilt) * 0.22, 1)

  // wings
  ctx.fillStyle = pal.dark
  ctx.beginPath()
  ctx.moveTo(0, -14)
  ctx.lineTo(32, 13)
  ctx.lineTo(30, 24)
  ctx.lineTo(11, 19)
  ctx.lineTo(-11, 19)
  ctx.lineTo(-30, 24)
  ctx.lineTo(-32, 13)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = pal.main
  for (const s of [-1, 1]) {
    ctx.beginPath()
    ctx.moveTo(s * 14, 4)
    ctx.lineTo(s * 30, 15)
    ctx.lineTo(s * 29, 20)
    ctx.lineTo(s * 14, 13)
    ctx.closePath()
    ctx.fill()
  }

  // engine pods
  ctx.fillStyle = '#56607a'
  for (const ex of [-9, 9]) {
    ctx.beginPath()
    ctx.roundRect(ex - 5, 8, 10, 14, 3)
    ctx.fill()
  }
  ctx.fillStyle = '#ffffff'
  for (const ex of [-9, 9]) ctx.fillRect(ex - 3, 20, 6, 2)

  // fuselage
  const bg = ctx.createLinearGradient(-12, 0, 12, 0)
  bg.addColorStop(0, pal.dark)
  bg.addColorStop(0.42, pal.light)
  bg.addColorStop(1, pal.main)
  ctx.fillStyle = bg
  ctx.beginPath()
  ctx.moveTo(0, -36)
  ctx.bezierCurveTo(9, -24, 12, -4, 10, 20)
  ctx.lineTo(-10, 20)
  ctx.bezierCurveTo(-12, -4, -9, -24, 0, -36)
  ctx.closePath()
  ctx.fill()

  // cockpit
  const cg = ctx.createLinearGradient(0, -20, 0, 4)
  cg.addColorStop(0, '#1b2440')
  cg.addColorStop(1, '#3d5a8a')
  ctx.fillStyle = cg
  ctx.beginPath()
  ctx.ellipse(0, -8, 5.5, 11, 0, 0, TAU)
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.beginPath()
  ctx.ellipse(-1.8, -12, 1.6, 4, 0, 0, TAU)
  ctx.fill()

  // wingtip lights
  const blink = Math.sin(t * 6) > 0
  ctx.fillStyle = blink ? '#ffffff' : pal.main
  ctx.beginPath()
  ctx.arc(-31, 14, 2.2, 0, TAU)
  ctx.arc(31, 14, 2.2, 0, TAU)
  ctx.fill()

  ctx.restore()
}

export function drawShieldBubble(ctx, x, y, t, color) {
  const r = 42 + Math.sin(t * 6) * 1.5
  const g = ctx.createRadialGradient(x, y, r * 0.55, x, y, r)
  g.addColorStop(0, hexA(color, 0))
  g.addColorStop(0.8, hexA(color, 0.18))
  g.addColorStop(1, hexA(color, 0.5))
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(x, y, r, 0, TAU)
  ctx.fill()
  ctx.strokeStyle = hexA('#ffffff', 0.55)
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(x, y, r, t * 2, t * 2 + 1.2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(x, y, r, t * 2 + Math.PI, t * 2 + Math.PI + 0.7)
  ctx.stroke()
}

// ---------------------------------------------------------------- aliens

// A little alien head of radius `s`. The bosses wear their rank: a cap, an
// eye patch, a moustache, a third eye, a crown.
export function drawAlien(ctx, x, y, s, skin, o = {}) {
  const { angry = false, cap = null, patch = false, mustache = false, third = false, crown = false, t = 0, hurt = 0 } = o
  ctx.save()
  ctx.translate(x, y)
  if (hurt > 0) ctx.translate(Math.sin(t * 90) * 2 * hurt, 0)

  // antennae
  if (!cap && !crown) {
    ctx.strokeStyle = skin
    ctx.lineWidth = Math.max(1.5, s * 0.1)
    ctx.fillStyle = skin
    for (const d of [-1, 1]) {
      const wob = Math.sin(t * 4 + d) * s * 0.1
      ctx.beginPath()
      ctx.moveTo(d * s * 0.3, -s * 0.8)
      ctx.quadraticCurveTo(d * s * 0.5, -s * 1.3, d * s * 0.62 + wob, -s * 1.45)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(d * s * 0.62 + wob, -s * 1.45, s * 0.16, 0, TAU)
      ctx.fill()
    }
  }

  // head: wide brain-dome tapering to the chin
  const hg = ctx.createRadialGradient(-s * 0.3, -s * 0.4, s * 0.1, 0, 0, s * 1.2)
  hg.addColorStop(0, lighten(skin, 0.35))
  hg.addColorStop(1, skin)
  ctx.fillStyle = hg
  ctx.beginPath()
  ctx.moveTo(0, s * 1.05)
  ctx.bezierCurveTo(s * 0.55, s * 1.0, s * 1.05, s * 0.3, s * 1.0, -s * 0.2)
  ctx.bezierCurveTo(s * 0.95, -s * 0.95, -s * 0.95, -s * 0.95, -s * 1.0, -s * 0.2)
  ctx.bezierCurveTo(-s * 1.05, s * 0.3, -s * 0.55, s * 1.0, 0, s * 1.05)
  ctx.closePath()
  ctx.fill()

  // eyes
  const blink = (t * 0.7 + x * 0.013) % 3 < 0.08
  for (const d of [-1, 1]) {
    if (patch && d === 1) continue
    ctx.save()
    ctx.translate(d * s * 0.42, s * 0.05)
    ctx.rotate(d * (angry ? 0.25 : 0.45))
    ctx.fillStyle = '#10131f'
    ctx.beginPath()
    ctx.ellipse(0, 0, s * 0.33, blink ? s * 0.03 : s * 0.21, 0, 0, TAU)
    ctx.fill()
    if (!blink) {
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(-s * 0.1, -s * 0.07, s * 0.07, 0, TAU)
      ctx.fill()
    }
    ctx.restore()
  }
  if (patch) {
    ctx.fillStyle = '#10131f'
    ctx.beginPath()
    ctx.ellipse(s * 0.42, s * 0.05, s * 0.28, s * 0.24, 0, 0, TAU)
    ctx.fill()
    ctx.strokeStyle = '#10131f'
    ctx.lineWidth = s * 0.07
    ctx.beginPath()
    ctx.moveTo(-s * 0.9, -s * 0.45)
    ctx.lineTo(s * 0.95, s * 0.2)
    ctx.stroke()
  }
  if (third) {
    ctx.fillStyle = '#10131f'
    ctx.beginPath()
    ctx.ellipse(0, -s * 0.38, s * 0.16, s * 0.2, 0, 0, TAU)
    ctx.fill()
    ctx.fillStyle = '#ff3b3b'
    ctx.beginPath()
    ctx.arc(0, -s * 0.38, s * 0.07, 0, TAU)
    ctx.fill()
  }
  if (angry) {
    ctx.strokeStyle = darken(skin, 0.55)
    ctx.lineWidth = s * 0.12
    ctx.lineCap = 'round'
    for (const d of [-1, 1]) {
      ctx.beginPath()
      ctx.moveTo(d * s * 0.7, -s * 0.28)
      ctx.lineTo(d * s * 0.18, -s * 0.12)
      ctx.stroke()
    }
  }

  // mouth
  ctx.strokeStyle = darken(skin, 0.6)
  ctx.lineWidth = Math.max(1, s * 0.07)
  ctx.lineCap = 'round'
  ctx.beginPath()
  if (hurt > 0.3) {
    ctx.ellipse(0, s * 0.62, s * 0.12, s * 0.14, 0, 0, TAU)
    ctx.fillStyle = darken(skin, 0.7)
    ctx.fill()
  } else if (angry) {
    ctx.arc(0, s * 0.85, s * 0.22, Math.PI * 1.2, Math.PI * 1.8)
    ctx.stroke()
  } else {
    ctx.arc(0, s * 0.45, s * 0.22, Math.PI * 0.2, Math.PI * 0.8)
    ctx.stroke()
  }

  if (mustache) {
    ctx.fillStyle = '#3a2410'
    for (const d of [-1, 1]) {
      ctx.beginPath()
      ctx.moveTo(0, s * 0.5)
      ctx.quadraticCurveTo(d * s * 0.35, s * 0.32, d * s * 0.62, s * 0.58)
      ctx.quadraticCurveTo(d * s * 0.3, s * 0.62, 0, s * 0.58)
      ctx.closePath()
      ctx.fill()
    }
  }

  if (cap) {
    // peaked officer's cap with a gold star
    ctx.fillStyle = cap
    ctx.beginPath()
    ctx.moveTo(-s * 0.95, -s * 0.55)
    ctx.quadraticCurveTo(-s * 1.0, -s * 1.25, 0, -s * 1.3)
    ctx.quadraticCurveTo(s * 1.0, -s * 1.25, s * 0.95, -s * 0.55)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#14141e'
    ctx.beginPath()
    ctx.ellipse(0, -s * 0.55, s * 1.08, s * 0.16, 0, 0, Math.PI)
    ctx.fill()
    ctx.fillStyle = '#ffd54a'
    ctx.fillRect(-s * 0.95, -s * 0.66, s * 1.9, s * 0.1)
    drawStar(ctx, 0, -s * 0.95, s * 0.22, '#ffd54a')
  }
  if (crown) {
    ctx.fillStyle = '#ffd54a'
    ctx.beginPath()
    ctx.moveTo(-s * 0.7, -s * 0.62)
    ctx.lineTo(-s * 0.78, -s * 1.3)
    ctx.lineTo(-s * 0.38, -s * 0.95)
    ctx.lineTo(0, -s * 1.45)
    ctx.lineTo(s * 0.38, -s * 0.95)
    ctx.lineTo(s * 0.78, -s * 1.3)
    ctx.lineTo(s * 0.7, -s * 0.62)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#ff3b6b'
    ctx.beginPath()
    ctx.arc(0, -s * 0.85, s * 0.1, 0, TAU)
    ctx.fill()
  }
  ctx.restore()
}

export function drawStar(ctx, x, y, r, color, points = 5, inner = 0.45) {
  ctx.fillStyle = color
  ctx.beginPath()
  for (let i = 0; i < points * 2; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / points
    const rr = i % 2 ? r * inner : r
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr)
  }
  ctx.closePath()
  ctx.fill()
}

// ---------------------------------------------------------------- saucers

export const SAUCERS = {
  scout: { hull: ['#eef4fb', '#9fb1c6', '#4a5a72'], dome: '#9ff0ff', skin: '#7ee05a', light: '#ffe23d' },
  zigzag: { hull: ['#efe2ff', '#a27bff', '#4b2a99'], dome: '#ffd0f4', skin: '#ffa63d', light: '#ff7bd8' },
  diver: { hull: ['#ffd9d2', '#ff5a4f', '#7d1622'], dome: '#ffe9a8', skin: '#b8ff5a', light: '#ffffff', angry: true },
  gunner: { hull: ['#fff0c2', '#ffb02e', '#874800'], dome: '#b6fff0', skin: '#5ae0c8', light: '#ff4d4d', angry: true },
  zorb: { hull: ['#f2f8ff', '#8fb0d0', '#34465f'], dome: '#a8f4ff', skin: '#6fdc4a', light: '#ffe23d' },
  blorp: { hull: ['#ffd6e6', '#c2367a', '#4a0c33'], dome: '#ffe0a8', skin: '#b78cff', light: '#ff5a5a', angry: true },
}

export function drawSaucer(ctx, x, y, r, kind, t, { flash = 0, tilt = 0, alien = {} } = {}) {
  const c = SAUCERS[kind]
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(tilt)

  // tractor glow underneath
  const gg = ctx.createRadialGradient(0, r * 0.3, 0, 0, r * 0.3, r * 0.9)
  gg.addColorStop(0, hexA(c.light, 0.35))
  gg.addColorStop(1, hexA(c.light, 0))
  ctx.fillStyle = gg
  ctx.beginPath()
  ctx.ellipse(0, r * 0.35, r * 0.9, r * 0.45, 0, 0, TAU)
  ctx.fill()

  // glass dome with the pilot inside
  const dr = r * 0.52
  const dy = -r * 0.12
  ctx.save()
  ctx.beginPath()
  ctx.ellipse(0, dy, dr, dr * 1.02, 0, Math.PI, TAU)
  ctx.closePath()
  ctx.clip()
  ctx.fillStyle = hexA(c.dome, 0.28)
  ctx.fillRect(-dr, dy - dr * 1.1, dr * 2, dr * 1.2)
  drawAlien(ctx, 0, dy - dr * 0.38, dr * 0.42, c.skin, { angry: c.angry, t, ...alien })
  ctx.restore()
  const glass = ctx.createLinearGradient(-dr, dy - dr, dr, dy)
  glass.addColorStop(0, 'rgba(255,255,255,0.45)')
  glass.addColorStop(0.4, hexA(c.dome, 0.12))
  glass.addColorStop(1, hexA(c.dome, 0.3))
  ctx.fillStyle = glass
  ctx.beginPath()
  ctx.ellipse(0, dy, dr, dr * 1.02, 0, Math.PI, TAU)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'
  ctx.lineWidth = Math.max(1.2, r * 0.04)
  ctx.beginPath()
  ctx.ellipse(0, dy, dr * 0.8, dr * 0.82, 0, Math.PI * 1.15, Math.PI * 1.4)
  ctx.stroke()

  // the disc
  const hg = ctx.createLinearGradient(0, -r * 0.3, 0, r * 0.35)
  hg.addColorStop(0, c.hull[0])
  hg.addColorStop(0.5, c.hull[1])
  hg.addColorStop(1, c.hull[2])
  ctx.fillStyle = hg
  ctx.beginPath()
  ctx.ellipse(0, 0, r, r * 0.32, 0, 0, TAU)
  ctx.fill()
  ctx.fillStyle = hexA(c.hull[2], 0.55)
  ctx.beginPath()
  ctx.ellipse(0, r * 0.06, r * 0.98, r * 0.14, 0, 0, Math.PI)
  ctx.fill()
  ctx.fillStyle = c.hull[2]
  ctx.beginPath()
  ctx.ellipse(0, r * 0.25, r * 0.42, r * 0.12, 0, 0, TAU)
  ctx.fill()

  // running lights chase around the rim
  const n = 7
  for (let i = 0; i < n; i++) {
    const u = (i / (n - 1)) * 2 - 1
    const on = Math.sin(t * 8 - i * 0.9) > 0.2
    ctx.fillStyle = on ? c.light : hexA(c.light, 0.3)
    ctx.beginPath()
    ctx.arc(u * r * 0.8, r * 0.1 + (1 - u * u) * r * 0.06, Math.max(1.6, r * 0.055), 0, TAU)
    ctx.fill()
  }

  if (kind === 'gunner') {
    ctx.fillStyle = '#4a3a2a'
    ctx.fillRect(-r * 0.12, r * 0.25, r * 0.24, r * 0.32)
    ctx.fillStyle = '#ff4d4d'
    ctx.fillRect(-r * 0.09, r * 0.52, r * 0.18, r * 0.08)
  }

  if (flash > 0) {
    ctx.globalAlpha = Math.min(1, flash) * 0.75
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.ellipse(0, 0, r, r * 0.32, 0, 0, TAU)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(0, dy, dr, dr * 1.02, 0, Math.PI, TAU)
    ctx.fill()
  }
  ctx.restore()
}

// General Blorp's war saucer: the regular disc plus two cannon pods that the
// sweeping lasers come out of.
export function drawBlorp(ctx, b, t) {
  const r = b.r
  for (const d of [-1, 1]) {
    const px = b.x + d * b.podX
    const py = b.y + b.podY
    ctx.fillStyle = '#5a1438'
    ctx.fillRect(b.x + d * r * 0.55 - 6, b.y, 12, b.podY)
    const pg = ctx.createRadialGradient(px - 8, py - 8, 2, px, py, 34)
    pg.addColorStop(0, '#ffb3d1')
    pg.addColorStop(0.5, '#c2367a')
    pg.addColorStop(1, '#3a0828')
    ctx.fillStyle = pg
    ctx.beginPath()
    ctx.arc(px, py, 30, 0, TAU)
    ctx.fill()
    const charge = b.charge || 0
    ctx.fillStyle = hexA('#ff5a5a', 0.4 + 0.6 * charge)
    ctx.beginPath()
    ctx.arc(px, py + 18, 9 + charge * 6 + Math.sin(t * 30) * charge * 2, 0, TAU)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(px, py + 18, 3 + charge * 4, 0, TAU)
    ctx.fill()
  }
  drawSaucer(ctx, b.x, b.y, r, 'blorp', t, {
    flash: b.flash,
    tilt: b.tilt,
    alien: { cap: '#3f7a3a', mustache: true, hurt: b.hurt },
  })
}

// The Mothership: a long hull, two gun turrets, a pair of hangar bays, and
// the Commander in a glass bubble slung underneath — shielded until both
// turrets are gone. Its geometry is shared with the hit tests in main.js.
export const MOTHER = { coreY: 58, coreR: 56, turretX: 0.32, turretY: 40, bayX: 0.17 }

export function drawMothership(ctx, m, t) {
  const { x, y, w } = m
  const hw = w / 2
  const { coreY, coreR, bayX } = MOTHER
  ctx.save()
  ctx.translate(x, y)

  // engine nacelles underneath
  for (const d of [-1, 1]) {
    const nx = d * hw * 0.62
    ctx.fillStyle = '#2a2350'
    ctx.beginPath()
    ctx.roundRect(nx - 26, 18, 52, 36, 12)
    ctx.fill()
    ctx.fillStyle = hexA('#7dfcff', 0.55 + 0.3 * Math.sin(t * 20 + d))
    ctx.beginPath()
    ctx.ellipse(nx, 54, 18, 5, 0, 0, TAU)
    ctx.fill()
  }

  // antenna mast
  ctx.strokeStyle = '#8f86bd'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(0, -60)
  ctx.lineTo(0, -92)
  ctx.stroke()
  ctx.fillStyle = Math.sin(t * 5) > 0 ? '#ff4d4d' : '#5a1f2a'
  ctx.beginPath()
  ctx.arc(0, -94, 4.5, 0, TAU)
  ctx.fill()

  // upper deck
  const ug = ctx.createLinearGradient(0, -66, 0, 0)
  ug.addColorStop(0, '#c4bce6')
  ug.addColorStop(1, '#5f5596')
  ctx.fillStyle = ug
  ctx.beginPath()
  ctx.ellipse(0, -22, hw * 0.5, 42, 0, Math.PI, TAU)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = m.rage ? '#ff7a7a' : '#ffe9a8'
  for (let wx = -hw * 0.34; wx <= hw * 0.34; wx += 22) ctx.fillRect(wx - 5, -44, 10, 7)

  // main hull
  const hg = ctx.createLinearGradient(0, -58, 0, 58)
  hg.addColorStop(0, '#a49bcf')
  hg.addColorStop(0.45, '#5a4f8f')
  hg.addColorStop(1, '#1f1840')
  ctx.fillStyle = hg
  ctx.beginPath()
  ctx.ellipse(0, 0, hw, 58, 0, 0, TAU)
  ctx.fill()

  // window rows
  for (let row = 0; row < 2; row++) {
    const yy = -8 + row * 16
    const span = hw * (row ? 0.78 : 0.88)
    for (let wx = -span; wx <= span; wx += 26) {
      if (Math.abs(wx) < coreR * 0.9 && row) continue
      const lit = Math.sin(wx * 0.37 + row * 2 + t * 1.5) > -0.3
      ctx.fillStyle = lit ? (m.rage ? '#ff7a7a' : '#ffe9a8') : '#3a315f'
      ctx.fillRect(wx - 6, yy - 3, 12, 6)
    }
  }

  // rim lights chase around the lower edge
  const n = 20
  for (let i = 0; i < n; i++) {
    const a = Math.PI * (0.04 + (0.92 * i) / (n - 1))
    const on = Math.sin(t * 6 - i * 0.7) > 0
    ctx.fillStyle = on ? (m.rage ? '#ff4d4d' : '#7dfcff') : 'rgba(125,252,255,0.25)'
    ctx.beginPath()
    ctx.arc(-Math.cos(a) * hw * 0.96, Math.sin(a) * 50, 3.5, 0, TAU)
    ctx.fill()
  }

  // hangar bays — the doors slide open when saucers launch
  const open = m.hangarOpen || 0
  for (const d of [-1, 1]) {
    const bx = d * w * bayX
    ctx.fillStyle = '#0a0716'
    ctx.fillRect(bx - 32, 34, 64, 18)
    ctx.fillStyle = hexA('#ffcc55', 0.2 + 0.6 * open)
    ctx.fillRect(bx - 28, 37, 56, 13)
    ctx.fillStyle = '#3a315f'
    ctx.fillRect(bx - 32, 34, 64 * (1 - open) * 0.5, 18)
    ctx.fillRect(bx + 32 - 64 * (1 - open) * 0.5, 34, 64 * (1 - open) * 0.5, 18)
  }

  // turrets
  for (const tur of m.turrets) {
    const tx = tur.ox
    const ty = tur.oy
    if (tur.hp > 0) {
      ctx.save()
      ctx.translate(tx, ty)
      ctx.rotate(tur.aim - Math.PI / 2)
      ctx.fillStyle = '#2a2350'
      ctx.fillRect(-7, 10, 14, 34)
      ctx.fillStyle = '#ff5a5a'
      ctx.fillRect(-5, 40, 10, 6)
      ctx.restore()
      const tg = ctx.createRadialGradient(tx - 10, ty - 10, 3, tx, ty, 34)
      tg.addColorStop(0, '#ffd6a0')
      tg.addColorStop(0.5, '#e0662f')
      tg.addColorStop(1, '#5a1f12')
      ctx.fillStyle = tg
      ctx.beginPath()
      ctx.arc(tx, ty, 30, 0, TAU)
      ctx.fill()
      ctx.fillStyle = '#ffe23d'
      ctx.beginPath()
      ctx.arc(tx, ty, 9 + Math.sin(t * 8) * 1.5, 0, TAU)
      ctx.fill()
      if (tur.flash > 0) {
        ctx.fillStyle = hexA('#ffffff', Math.min(1, tur.flash) * 0.8)
        ctx.beginPath()
        ctx.arc(tx, ty, 30, 0, TAU)
        ctx.fill()
      }
    } else {
      ctx.fillStyle = '#1a1430'
      ctx.beginPath()
      ctx.arc(tx, ty, 24, 0, TAU)
      ctx.fill()
      ctx.fillStyle = hexA('#ff7a2e', 0.4 + 0.3 * Math.sin(t * 13 + tx))
      ctx.beginPath()
      ctx.arc(tx, ty, 10, 0, TAU)
      ctx.fill()
    }
  }

  // the Commander's bubble
  ctx.fillStyle = '#3a315f'
  ctx.beginPath()
  ctx.ellipse(0, coreY - coreR * 0.72, coreR * 0.78, 12, 0, 0, TAU)
  ctx.fill()
  ctx.save()
  ctx.beginPath()
  ctx.arc(0, coreY, coreR, 0, TAU)
  ctx.clip()
  ctx.fillStyle = 'rgba(30, 60, 70, 0.75)'
  ctx.fillRect(-coreR, coreY - coreR, coreR * 2, coreR * 2)
  drawAlien(ctx, 0, coreY + 8, 26, '#59d6b0', { angry: true, third: true, crown: true, t, hurt: m.hurt })
  const glass = ctx.createRadialGradient(-coreR * 0.35, coreY - coreR * 0.4, 4, 0, coreY, coreR)
  glass.addColorStop(0, 'rgba(255,255,255,0.4)')
  glass.addColorStop(0.5, 'rgba(160,255,240,0.08)')
  glass.addColorStop(1, 'rgba(160,255,240,0.35)')
  ctx.fillStyle = glass
  ctx.fillRect(-coreR, coreY - coreR, coreR * 2, coreR * 2)
  ctx.restore()
  ctx.strokeStyle = 'rgba(200,255,250,0.7)'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.arc(0, coreY, coreR, 0, TAU)
  ctx.stroke()
  ctx.strokeStyle = 'rgba(255,255,255,0.75)'
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.arc(0, coreY, coreR * 0.8, Math.PI * 0.95, Math.PI * 1.25)
  ctx.stroke()

  if (m.coreFlash > 0) {
    ctx.fillStyle = hexA('#ffffff', Math.min(1, m.coreFlash) * 0.6)
    ctx.beginPath()
    ctx.arc(0, coreY, coreR, 0, TAU)
    ctx.fill()
  }

  // hex shield over the bubble while the turrets stand
  if (m.shield > 0) {
    ctx.save()
    ctx.globalAlpha = m.shield
    const sr = coreR + 12
    const sg = ctx.createRadialGradient(0, coreY, sr * 0.6, 0, coreY, sr)
    sg.addColorStop(0, 'rgba(90,200,255,0.05)')
    sg.addColorStop(1, 'rgba(90,200,255,0.5)')
    ctx.fillStyle = sg
    ctx.beginPath()
    ctx.arc(0, coreY, sr, 0, TAU)
    ctx.fill()
    ctx.clip()
    ctx.strokeStyle = `rgba(150,230,255,${0.3 + 0.15 * Math.sin(t * 5)})`
    ctx.lineWidth = 1.5
    const hs = 13
    const dx = hs * Math.sqrt(3)
    for (let row = 0, gy = coreY - sr; gy < coreY + sr + hs; row++, gy += hs * 1.5) {
      for (let gx = -sr - dx; gx < sr + dx; gx += dx) {
        hexPath(ctx, gx + (row % 2) * dx * 0.5, gy, hs * 0.92)
        ctx.stroke()
      }
    }
    ctx.restore()
  }

  if (m.flash > 0) {
    ctx.fillStyle = hexA('#ffffff', Math.min(1, m.flash) * 0.25)
    ctx.beginPath()
    ctx.ellipse(0, 0, hw, 58, 0, 0, TAU)
    ctx.fill()
  }
  ctx.restore()
}

function hexPath(ctx, x, y, r) {
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 6 + (i * Math.PI) / 3
    ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r)
  }
  ctx.closePath()
}

// ---------------------------------------------------------------- bubbles

export function drawBubble(ctx, x, y, r, type, t) {
  const col = POWERS[type].color
  const wob = Math.sin(t * 5)
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(1 + wob * 0.05, 1 - wob * 0.05)

  const g = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.05, 0, 0, r)
  g.addColorStop(0, 'rgba(255,255,255,0.35)')
  g.addColorStop(0.5, hexA(col, 0.14))
  g.addColorStop(0.86, hexA(col, 0.32))
  g.addColorStop(1, hexA(col, 0.8))
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, TAU)
  ctx.fill()
  ctx.strokeStyle = hexA(col, 0.95)
  ctx.lineWidth = Math.max(1.5, r * 0.07)
  ctx.stroke()

  drawIcon(ctx, type, r * 0.52, col)

  ctx.strokeStyle = 'rgba(255,255,255,0.85)'
  ctx.lineWidth = Math.max(1.5, r * 0.1)
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.arc(0, 0, r * 0.72, Math.PI * 1.08, Math.PI * 1.38)
  ctx.stroke()
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.beginPath()
  ctx.arc(-r * 0.2, -r * 0.62, r * 0.07, 0, TAU)
  ctx.fill()
  ctx.restore()
}

// The symbol inside each bubble, centred on the origin, `s` is its half-size.
export function drawIcon(ctx, type, s, col) {
  ctx.save()
  ctx.fillStyle = col
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = Math.max(1.2, s * 0.14)
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.beginPath()
  switch (type) {
    case 'shield':
      ctx.moveTo(0, -s)
      ctx.lineTo(s * 0.85, -s * 0.62)
      ctx.lineTo(s * 0.78, s * 0.1)
      ctx.quadraticCurveTo(s * 0.6, s * 0.7, 0, s)
      ctx.quadraticCurveTo(-s * 0.6, s * 0.7, -s * 0.78, s * 0.1)
      ctx.lineTo(-s * 0.85, -s * 0.62)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      break
    case 'triple':
      for (const [ox, a] of [[-0.62, -0.38], [0, 0], [0.62, 0.38]]) {
        ctx.save()
        ctx.translate(ox * s, s * 0.2)
        ctx.rotate(a)
        ctx.beginPath()
        ctx.roundRect(-s * 0.18, -s * 1.0, s * 0.36, s * 1.35, s * 0.18)
        ctx.fill()
        ctx.stroke()
        ctx.restore()
      }
      break
    case 'rapid':
      ctx.moveTo(s * 0.25, -s)
      ctx.lineTo(-s * 0.6, s * 0.12)
      ctx.lineTo(-s * 0.02, s * 0.12)
      ctx.lineTo(-s * 0.3, s)
      ctx.lineTo(s * 0.62, -s * 0.18)
      ctx.lineTo(s * 0.04, -s * 0.18)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      break
    case 'speed':
      for (const oy of [-s * 0.45, s * 0.25]) {
        ctx.beginPath()
        ctx.moveTo(-s * 0.8, oy + s * 0.5)
        ctx.lineTo(0, oy - s * 0.3)
        ctx.lineTo(s * 0.8, oy + s * 0.5)
        ctx.lineTo(s * 0.5, oy + s * 0.75)
        ctx.lineTo(0, oy + s * 0.22)
        ctx.lineTo(-s * 0.5, oy + s * 0.75)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
      }
      break
    case 'heart':
      ctx.moveTo(0, s * 0.9)
      ctx.bezierCurveTo(-s * 1.3, 0, -s * 0.75, -s * 1.05, 0, -s * 0.4)
      ctx.bezierCurveTo(s * 0.75, -s * 1.05, s * 1.3, 0, 0, s * 0.9)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      break
    case 'nova':
      for (let i = 0; i < 16; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 8
        const rr = i % 2 ? s * 0.42 : s * 1.02
        ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr)
      }
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      break
  }
  ctx.restore()
}

// ---------------------------------------------------------------- shots

export function drawPlayerShot(ctx, b, pal) {
  ctx.save()
  ctx.translate(b.x, b.y)
  ctx.rotate(Math.atan2(b.vy, b.vx) + Math.PI / 2)
  ctx.fillStyle = hexA(pal.main, 0.35)
  ctx.beginPath()
  ctx.roundRect(-5, -14, 10, 28, 5)
  ctx.fill()
  ctx.fillStyle = pal.light
  ctx.beginPath()
  ctx.roundRect(-2, -11, 4, 22, 2)
  ctx.fill()
  ctx.restore()
}

export function drawEnemyShot(ctx, b, t) {
  const r = b.r
  if (b.kind === 'mine') {
    const blink = b.fuse < 0.8 && Math.sin(t * 30) > 0
    ctx.fillStyle = '#3a1030'
    ctx.beginPath()
    ctx.arc(b.x, b.y, r, 0, TAU)
    ctx.fill()
    ctx.strokeStyle = '#ff7bd8'
    ctx.lineWidth = 3
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3 + t
      ctx.beginPath()
      ctx.moveTo(b.x + Math.cos(a) * r, b.y + Math.sin(a) * r)
      ctx.lineTo(b.x + Math.cos(a) * (r + 6), b.y + Math.sin(a) * (r + 6))
      ctx.stroke()
    }
    ctx.fillStyle = blink ? '#ffffff' : '#ff3b6b'
    ctx.beginPath()
    ctx.arc(b.x, b.y, r * 0.45, 0, TAU)
    ctx.fill()
    return
  }
  const c = glowSprite(b.color, r)
  ctx.drawImage(c, b.x - c.R, b.y - c.R, c.R * 2, c.R * 2)
}

// Soft round glows are drawn once per colour and size, then stamped — a
// gradient per bullet per frame adds up once a boss fills the screen.
const sprites = new Map()
function glowSprite(color, r) {
  const key = color + r
  let c = sprites.get(key)
  if (!c) {
    const R = r * 2.4
    c = document.createElement('canvas')
    c.width = c.height = Math.ceil(R * 4)
    c.R = R
    const g = c.getContext('2d')
    g.scale(2, 2)
    const grad = g.createRadialGradient(R, R, 0, R, R, R)
    grad.addColorStop(0, '#ffffff')
    grad.addColorStop(0.18, '#ffffff')
    grad.addColorStop(0.4, color)
    grad.addColorStop(0.58, hexA(color, 0.4))
    grad.addColorStop(1, hexA(color, 0))
    g.fillStyle = grad
    g.fillRect(0, 0, R * 2, R * 2)
    sprites.set(key, c)
  }
  return c
}

export function drawPuff(ctx, x, y, r) {
  const c = glowSprite('#8a7fb8', 20)
  ctx.drawImage(c, x - r, y - r, r * 2, r * 2)
}

export function drawLaser(ctx, L, h, t) {
  if (L.warn > 0) {
    // a flickering guide line so you know where to not be
    const a = 0.35 + 0.35 * Math.sin(t * 30)
    ctx.fillStyle = `rgba(255, 70, 70, ${a * 0.25})`
    ctx.fillRect(L.x - L.w / 2, L.y0, L.w, h - L.y0)
    ctx.strokeStyle = `rgba(255, 120, 120, ${a + 0.2})`
    ctx.lineWidth = 2
    ctx.setLineDash([12, 10])
    ctx.lineDashOffset = -t * 120
    ctx.beginPath()
    ctx.moveTo(L.x, L.y0)
    ctx.lineTo(L.x, h)
    ctx.stroke()
    ctx.setLineDash([])
    return
  }
  const fade = Math.min(1, L.active * 6)
  const w = L.w * (0.85 + 0.15 * Math.sin(t * 50))
  const g = ctx.createLinearGradient(L.x - w / 2, 0, L.x + w / 2, 0)
  g.addColorStop(0, 'rgba(255,60,90,0)')
  g.addColorStop(0.25, `rgba(255,60,90,${0.65 * fade})`)
  g.addColorStop(0.45, `rgba(255,220,230,${fade})`)
  g.addColorStop(0.55, `rgba(255,220,230,${fade})`)
  g.addColorStop(0.75, `rgba(255,60,90,${0.65 * fade})`)
  g.addColorStop(1, 'rgba(255,60,90,0)')
  ctx.fillStyle = g
  ctx.fillRect(L.x - w / 2, L.y0, w, h - L.y0)
}

// ---------------------------------------------------------------- colour helpers

function mix(hex, target, k) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  const m = (v) => Math.round(v + (target - v) * k)
  return `rgb(${m(r)},${m(g)},${m(b)})`
}
const lighten = (hex, k) => mix(hex, 255, k)
const darken = (hex, k) => mix(hex, 0, k)
