// The Gloomtopus: a big cosmic octopus with a head full of stars, glowing
// spots, golden eyes with sideways pupils and eight curly arms. All of it is
// measured from (b.x, b.y), the line where the arms join the head, in units
// of R, its head's radius.
//
// The head is baked once into a sprite (at twice the size, so it stays crisp
// on a sharp screen). The face and arms are drawn live, since they move.

import { hexA } from '../../stars.js'
import { glow } from './draw.js'

const TAU = Math.PI * 2
const SPRITE = 2 // sprite pixels per unit

export const ARMS = 8
export const ARM_FILL = ['#7c34d6', '#b04ee0', '#ff86dc']
const SUCKER = '#ffc8f0'
const SUCKER_IN = '#c24ea8'
const EDGE = '#2c0f5c'

// Where the head and face sit, as fractions of R.
export const HEAD = { y: -0.95, rx: 1, ry: 0.98 }
export const EYE = { x: 0.4, y: -0.5, r: 0.25 }
export const MOUTH = { y: -0.17 }

// Glowing spots on the head: [x, y, size, colour]. Kept clear of the eyes.
export const SPOTS = [
  [-0.55, -1.3, 0.085, '#9ffcff'],
  [0.45, -1.52, 0.07, '#ff9be6'],
  [0.05, -1.74, 0.055, '#9ffcff'],
  [-0.16, -1.1, 0.045, '#ff9be6'],
  [0.72, -1.0, 0.075, '#9ffcff'],
  [-0.78, -0.88, 0.06, '#ff9be6'],
  [0.28, -1.16, 0.05, '#9ffcff'],
  [-0.4, -1.66, 0.05, '#9ffcff'],
  [0.64, -1.36, 0.04, '#ff9be6'],
]

// ---------------------------------------------------------------- arms

// Where arm i joins the head: spread under it, the outer ones a touch higher.
export function armRoot(b, i, R) {
  const u = (i / (ARMS - 1)) * 2 - 1
  return [b.x + u * R * 0.62, b.y - R * 0.02 - Math.abs(u) * R * 0.1]
}

// The centre line of arm i at rest, as N+1 points from root to tip: hanging
// down and fanned out, the outer arms curling up at the ends, and a lazy
// wave running down each one. `raise` (0..1) lifts it up and out (how an arm
// rears before it strikes); `wild` speeds the wave up.
const N = 10
export function armPose(b, i, R, t, raise = 0, wild = 0) {
  const u = (i / (ARMS - 1)) * 2 - 1
  const side = u < 0 ? -1 : 1
  const [rx, ry] = armRoot(b, i, R)
  const len = R * (1.55 + 0.3 * (1 - Math.abs(u))) * (1 - raise * 0.12)
  const rest = Math.PI / 2 - u * 1.15
  const up = Math.PI / 2 - side * 2.35
  const th0 = rest + (up - rest) * raise
  const curl = (0.9 + Math.abs(u) * 1.2) * (1 - raise * 0.6)
  const sp = 1.7 + wild * 4
  const pts = [[rx, ry]]
  let x = rx
  let y = ry
  for (let k = 1; k <= N; k++) {
    const s = k / N
    const th = th0 - side * curl * s * s + (0.32 + raise * 0.2) * Math.sin(t * sp + i * 0.8 - s * 4) * s
    x += (Math.cos(th) * len) / N
    y += (Math.sin(th) * len) / N
    pts.push([x, y])
  }
  return pts
}

// A tapered arm along a centre line, w0 wide at the root and w1 at the tip,
// with a row of suckers down its `side` (1 or -1). `fill` is a fillStyle.
export function drawArm(ctx, pts, w0, w1, fill, { side = 1, suckers = true, from = 0 } = {}) {
  const n = pts.length
  if (n < 2) return
  const L = []
  const Rt = []
  const nx = []
  const ny = []
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)]
    const c = pts[Math.min(n - 1, i + 1)]
    const dx = c[0] - a[0]
    const dy = c[1] - a[1]
    const d = Math.hypot(dx, dy) || 1
    nx.push(-dy / d)
    ny.push(dx / d)
    const w = w0 + (w1 - w0) * (i / (n - 1))
    L.push([pts[i][0] + nx[i] * w, pts[i][1] + ny[i] * w])
    Rt.push([pts[i][0] - nx[i] * w, pts[i][1] - ny[i] * w])
  }
  ctx.beginPath()
  ctx.moveTo(L[0][0], L[0][1])
  for (let i = 1; i < n - 1; i++) ctx.quadraticCurveTo(L[i][0], L[i][1], (L[i][0] + L[i + 1][0]) / 2, (L[i][1] + L[i + 1][1]) / 2)
  ctx.lineTo(L[n - 1][0], L[n - 1][1])
  // a rounded tip
  const [tx, ty] = pts[n - 1]
  const ta = Math.atan2(ny[n - 1], nx[n - 1])
  ctx.arc(tx, ty, Math.max(1, w1), ta, ta + Math.PI, true)
  for (let i = n - 2; i > 0; i--) ctx.quadraticCurveTo(Rt[i][0], Rt[i][1], (Rt[i][0] + Rt[i - 1][0]) / 2, (Rt[i][1] + Rt[i - 1][1]) / 2)
  ctx.lineTo(Rt[0][0], Rt[0][1])
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
  ctx.strokeStyle = EDGE
  ctx.lineWidth = 2
  ctx.stroke()
  if (!suckers) return
  // suckers, every other point down the underside
  const dots = []
  for (let i = Math.max(2, from); i < n - 1; i += 1) {
    const w = w0 + (w1 - w0) * (i / (n - 1))
    if (w < 3.5) break
    const o = -side * w * 0.42
    dots.push([pts[i][0] + nx[i] * o, pts[i][1] + ny[i] * o, w * 0.42])
  }
  ctx.fillStyle = SUCKER
  ctx.beginPath()
  for (const [x, y, r] of dots) {
    ctx.moveTo(x + r, y)
    ctx.arc(x, y, r, 0, TAU)
  }
  ctx.fill()
  ctx.fillStyle = SUCKER_IN
  ctx.beginPath()
  for (const [x, y, r] of dots) {
    ctx.moveTo(x + r * 0.45, y)
    ctx.arc(x, y, r * 0.45, 0, TAU)
  }
  ctx.fill()
}

// The arms' colour, deep violet at the head to pink at the tips.
export function armFill(ctx, y0, y1) {
  const g = ctx.createLinearGradient(0, y0, 0, y1)
  g.addColorStop(0, ARM_FILL[0])
  g.addColorStop(0.45, ARM_FILL[1])
  g.addColorStop(1, ARM_FILL[2])
  return g
}

// The glow round an arm that's out to get you, so it reads over the fog.
export function armGlow(ctx, pts, w, color, a) {
  ctx.globalCompositeOperation = 'lighter'
  ctx.globalAlpha = a
  ctx.strokeStyle = color
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.lineWidth = w
  ctx.beginPath()
  ctx.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
  ctx.stroke()
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = 1
}

// ---------------------------------------------------------------- the head

let head = null
let headR = 0
let iris = null

// The sprite's box, in units of R from the root line: the head and a soft
// halo round it, baked in so it costs nothing to draw.
const BOX = { w: 2.8, top: 2.3, h: 2.75 }

function bakeHead(R) {
  const w = R * BOX.w
  const h = R * BOX.h
  const c = document.createElement('canvas')
  c.width = Math.ceil(w * SPRITE)
  c.height = Math.ceil(h * SPRITE)
  const x = c.getContext('2d')
  x.scale(SPRITE, SPRITE)
  x.translate(w / 2, R * BOX.top) // (0, 0) is the root line

  // a deep glow round it, so it looks lit from within when the fog parts
  const halo = x.createRadialGradient(0, -0.85 * R, R * 0.6, 0, -0.85 * R, R * 1.38)
  halo.addColorStop(0, 'rgba(157,92,255,0.45)')
  halo.addColorStop(1, 'rgba(157,92,255,0)')
  x.fillStyle = halo
  x.fillRect(-w / 2, -R * BOX.top, w, h)

  const dome = () => {
    x.beginPath()
    x.ellipse(0, HEAD.y * R, HEAD.rx * R, HEAD.ry * R, 0, 0, TAU)
  }
  const skirt = () => {
    x.beginPath()
    x.ellipse(0, -0.12 * R, 0.84 * R, 0.32 * R, 0, 0, TAU)
  }
  // a dark outline first; the fills cover its inner half and the seam
  x.strokeStyle = EDGE
  x.lineWidth = 5
  dome()
  x.stroke()
  skirt()
  x.stroke()
  const fill = x.createRadialGradient(-0.32 * R, -1.45 * R, R * 0.1, 0, -0.8 * R, R * 1.5)
  fill.addColorStop(0, '#ec9cff')
  fill.addColorStop(0.35, '#a84ce6')
  fill.addColorStop(0.75, '#6a2bb8')
  fill.addColorStop(1, '#3a1680')
  x.fillStyle = fill
  dome()
  x.fill()
  skirt()
  x.fill()

  // everything on the skin stays inside the head
  x.save()
  dome()
  x.clip()
  // soft darker blotches, so it reads as skin rather than plastic
  x.fillStyle = 'rgba(52,16,110,0.3)'
  for (const [bx, by, br] of [[0.3, -1.35, 0.22], [-0.5, -1.0, 0.18], [0.6, -0.72, 0.15], [-0.15, -1.55, 0.13], [-0.72, -1.38, 0.1]]) {
    x.beginPath()
    x.ellipse(bx * R, by * R, br * R, br * R * 0.8, 0.4, 0, TAU)
    x.fill()
  }
  // a head full of stars: it's a cosmic octopus
  let seed = 7
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  for (let i = 0; i < 26; i++) {
    const a = rnd() * TAU
    const d = Math.sqrt(rnd()) * 0.92
    const sx = Math.cos(a) * d * R
    const sy = HEAD.y * R + Math.sin(a) * d * R * 0.95
    x.fillStyle = `rgba(255,255,255,${0.35 + rnd() * 0.5})`
    x.beginPath()
    x.arc(sx, sy, 0.6 + rnd() * 1.1, 0, TAU)
    x.fill()
  }
  x.restore()

  // the glowing spots
  for (const [sx, sy, sr, col] of SPOTS) {
    x.fillStyle = hexA(col, 0.35)
    x.beginPath()
    x.arc(sx * R, sy * R, sr * R * 1.6, 0, TAU)
    x.fill()
    x.fillStyle = col
    x.beginPath()
    x.arc(sx * R, sy * R, sr * R, 0, TAU)
    x.fill()
    x.fillStyle = '#ffffff'
    x.beginPath()
    x.arc(sx * R - sr * R * 0.25, sy * R - sr * R * 0.25, sr * R * 0.35, 0, TAU)
    x.fill()
  }
  // a sheen across the top, and starlight catching the far edge
  x.fillStyle = 'rgba(255,255,255,0.32)'
  x.beginPath()
  x.ellipse(-0.38 * R, -1.52 * R, 0.3 * R, 0.13 * R, -0.6, 0, TAU)
  x.fill()
  x.strokeStyle = 'rgba(125,252,255,0.35)'
  x.lineWidth = 3
  x.beginPath()
  x.ellipse(0, HEAD.y * R, HEAD.rx * R - 4, HEAD.ry * R - 4, 0, -0.9, 0.5)
  x.stroke()
  // the darker underside where the arms meet
  x.fillStyle = 'rgba(40,10,90,0.35)'
  x.beginPath()
  x.ellipse(0, -0.02 * R, 0.7 * R, 0.16 * R, 0, 0, TAU)
  x.fill()
  head = c
  headR = R
}

// Everything but the arms that are off attacking (b.arms[i].busy): those are
// drawn over the fog by octopus.js, so they can always be seen.
//
// o: { t, flash, hurt, puff, charge, chargeColor, angry, blink, look: [x, y],
//      lid, ink }
export function drawOctopus(ctx, b, R, o) {
  if (!head || headR !== R) bakeHead(R)
  const { t, flash = 0, hurt = 0, puff = 0, charge = 0, chargeColor = '#ff7bd8', angry = false, blink = false, look = [0, 0], wild = 0 } = o
  ctx.save()
  if (hurt > 0) ctx.translate(Math.sin(t * 80) * 3 * hurt, 0)

  // the arms at rest, behind the head
  const fill = armFill(ctx, b.y - R * 0.2, b.y + R * 1.9)
  for (let i = 0; i < ARMS; i++) {
    const arm = b.arms?.[i]
    if (arm?.busy) continue
    const pts = armPose(b, i, R, t + (arm?.flinch ?? 0) * 0.2, arm?.raise ?? 0, wild)
    const u = (i / (ARMS - 1)) * 2 - 1
    drawArm(ctx, pts, R * 0.16, R * 0.035, fill, { side: u < 0 ? -1 : 1 })
  }

  // the head, puffing up when it fills with ink
  const s = 1 + puff * 0.14
  ctx.save()
  ctx.translate(b.x, b.y + HEAD.y * R)
  ctx.scale(s, s * (1 + puff * 0.04))
  ctx.translate(0, -HEAD.y * R)
  const hw = R * BOX.w
  ctx.drawImage(head, -hw / 2, -R * BOX.top, hw, R * BOX.h)
  if (flash > 0) {
    // hit: the head blinks pale, the way the saucers flash white
    ctx.globalAlpha = Math.min(1, flash) * 0.4
    ctx.fillStyle = '#f4e6ff'
    ctx.beginPath()
    ctx.ellipse(0, HEAD.y * R, HEAD.rx * R, HEAD.ry * R, 0, 0, TAU)
    ctx.fill()
    ctx.globalAlpha = 1
  }
  ctx.restore()

  // the spots breathe
  ctx.globalCompositeOperation = 'lighter'
  for (let i = 0; i < SPOTS.length; i++) {
    const [sx, sy, sr, col] = SPOTS[i]
    const k = 0.5 + 0.5 * Math.sin(t * 2.2 + i * 1.3)
    ctx.globalAlpha = 0.25 + 0.4 * k
    const rr = sr * R * (2.4 + k)
    ctx.drawImage(glow(col, false), b.x + sx * R * s - rr, b.y + HEAD.y * R + (sy - HEAD.y) * R * s - rr, rr * 2, rr * 2)
  }
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = 1

  drawFace(ctx, b, R, { t, puff, charge, chargeColor, angry, blink, look, lid: o.lid })
  ctx.restore()
}

function drawFace(ctx, b, R, { t, puff, charge, chargeColor, angry, blink, look, lid }) {
  const fx = b.x
  const fy = b.y
  // rosy cheeks, puffed out when it's full of ink
  ctx.fillStyle = hexA('#ff7bd8', 0.42 + puff * 0.3)
  for (const d of [-1, 1]) {
    ctx.beginPath()
    ctx.ellipse(fx + d * R * (0.68 + puff * 0.08), fy - R * 0.26, R * (0.12 + puff * 0.06), R * (0.07 + puff * 0.04), 0, 0, TAU)
    ctx.fill()
  }

  // the eyes: dark sockets, glowing gold irises, sideways pupils (an
  // octopus thing) that narrow to slits when it's about to attack
  const er = EYE.r * R
  const wide = charge > 0.05 ? charge : 0
  const lidAmt = blink ? 1 : lid ?? (angry ? 0.36 : 0.3) * (1 - wide * 0.7)
  for (const d of [-1, 1]) {
    const ex = fx + d * EYE.x * R
    const ey = fy + EYE.y * R
    ctx.fillStyle = '#2a0c55'
    ctx.beginPath()
    ctx.arc(ex, ey, er * 1.1, 0, TAU)
    ctx.fill()
    // one gradient made round (0, 0), reused for both eyes every frame
    if (!iris || iris.r !== er) {
      const ig = ctx.createRadialGradient(-er * 0.3, -er * 0.35, er * 0.1, 0, 0, er)
      ig.addColorStop(0, '#fff6b8')
      ig.addColorStop(0.45, '#ffd84a')
      ig.addColorStop(1, '#e08a1c')
      iris = { r: er, g: ig }
    }
    ctx.save()
    ctx.translate(ex, ey)
    ctx.fillStyle = iris.g
    ctx.beginPath()
    ctx.arc(0, 0, er, 0, TAU)
    ctx.fill()
    ctx.restore()
    const px = ex + look[0] * er * 0.32
    const py = ey + look[1] * er * 0.22
    const ph = er * (0.34 - 0.2 * wide)
    ctx.fillStyle = '#1a0838'
    ctx.beginPath()
    ctx.ellipse(px, py, er * 0.58, ph, 0, 0, TAU)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(ex - er * 0.38, ey - er * 0.42, er * 0.2, 0, TAU)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(ex + er * 0.3, ey + er * 0.36, er * 0.08, 0, TAU)
    ctx.fill()

    // the heavy upper lid: sleepy, wide open when it means business, slanted
    // in when it's cross
    if (lidAmt > 0.02) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(ex, ey, er * 1.12, 0, TAU)
      ctx.clip()
      ctx.translate(ex, ey)
      ctx.rotate(angry ? -d * 0.4 : d * 0.08)
      const ly = -er * 1.12 + er * 2.24 * Math.min(1, lidAmt)
      ctx.fillStyle = '#8a3fd6'
      ctx.fillRect(-er * 1.4, -er * 1.4, er * 2.8, ly + er * 1.4)
      ctx.strokeStyle = EDGE
      ctx.lineWidth = Math.max(2, R * 0.03)
      ctx.beginPath()
      ctx.moveTo(-er * 1.3, ly)
      ctx.lineTo(er * 1.3, ly)
      ctx.stroke()
      ctx.restore()
    }
  }
  if (angry) {
    ctx.strokeStyle = EDGE
    ctx.lineWidth = R * 0.06
    ctx.lineCap = 'round'
    for (const d of [-1, 1]) {
      ctx.beginPath()
      ctx.moveTo(fx + d * R * 0.66, fy + EYE.y * R - er * 1.35)
      ctx.lineTo(fx + d * R * 0.16, fy + EYE.y * R - er * 0.95)
      ctx.stroke()
    }
  }

  // a little round mouth, glowing when it's about to spit a spread
  const my = fy + MOUTH.y * R
  const mr = R * (0.06 + 0.06 * charge + 0.02 * Math.sin(t * 3))
  ctx.fillStyle = '#2a0c55'
  ctx.beginPath()
  ctx.ellipse(fx, my, mr, mr * 0.85, 0, 0, TAU)
  ctx.fill()
  ctx.fillStyle = charge > 0.05 ? hexA(chargeColor, 0.5 + 0.5 * charge) : '#c24ea8'
  ctx.beginPath()
  ctx.ellipse(fx, my + mr * 0.15, mr * 0.55, mr * 0.45, 0, 0, TAU)
  ctx.fill()
}

// Head-shaped region tests, used for lasers and ships.
export function inHead(b, R, x, y, k = 1) {
  const dx = (x - b.x) / (HEAD.rx * R * 0.96 * k)
  const dy = (y - (b.y + HEAD.y * R)) / (HEAD.ry * R * 1.02 * k)
  const sx = (x - b.x) / (0.84 * R * k)
  const sy = (y - (b.y - 0.12 * R)) / (0.32 * R * k)
  return dx * dx + dy * dy <= 1 || sx * sx + sy * sy <= 1
}
