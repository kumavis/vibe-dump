// Hyperspace Run art: the tunnel, the rings, the signs at a fork, the bombs,
// the saucers' warnings and the finish gate. All plain canvas paths, centred
// on (x, y), leaving the context as they found it. The few things drawn many
// times a frame with gradients (bomb bodies, glows) are drawn once into a
// small canvas and stamped.
//
// A ring is a hoop seen from above at a slant, so it's an ellipse. Its far
// (upper) half is drawn behind the ships and its near (lower) half in front of
// them, which is all it takes for a ship to look like it flies through.

import { hexA } from '../../stars.js'
import { drawShip, drawStar, PLAYER_COLORS } from '../../art.js'
import { SQUASH } from './course.js'

const TAU = Math.PI * 2
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

// Ring colours steer clear of the players' cyan and pink, so a ring never
// looks like it belongs to one of them. Trails take turns in the first two;
// at a fork the safe lane is green, the middle lane violet and the gold lane
// orange and gold.
export const RING_PALS = [
  { main: '#3cf2c8', light: '#dafff5', dark: '#0d6e60', back: '#1fa98c' },
  { main: '#b48cff', light: '#f0e6ff', dark: '#46238f', back: '#7c55d6' },
  { main: '#a8f04a', light: '#f2ffd6', dark: '#41700c', back: '#73b52a' },
  { main: '#ff9d4a', light: '#ffe8d1', dark: '#94400c', back: '#d06a24' },
]
export const GOLD_PAL = { main: '#ffd54a', light: '#fff8d2', dark: '#9a6200', back: '#d9a21e' }
const MISS_PAL = { main: '#8d91b5', light: '#d7d9ee', dark: '#3a3d5c', back: '#5f6386' }
export const LANE_COL = { gold: '#ffd54a', mid: '#b48cff', safe: '#a8f04a' }

// Blend two #rrggbb colours, giving #rrggbb back (so hexA still works on it).
export function mixHex(a, b, k) {
  const p = parseInt(a.slice(1), 16)
  const q = parseInt(b.slice(1), 16)
  const ch = (s) => Math.round(((p >> s) & 255) + (((q >> s) & 255) - ((p >> s) & 255)) * k)
  return '#' + ((1 << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).slice(1)
}

// ---------------------------------------------------------------- the tunnel

// Hyperspace streaks: light pouring out of the tunnel's mouth far ahead and
// rushing past, fanning out and speeding up as it comes closer. `z` is how
// far along its ray a streak is (0 at the mouth, 1 at the bottom of the
// screen), `a` the ray's angle out from straight down.
export function makeStreak(fresh) {
  const r = Math.random
  return {
    a: (r() * 2 - 1) * 1.25,
    z: fresh ? r() : r() * 0.08,
    len: 0.1 + r() * 0.22,
    k: 0.25 + r() * 0.45,
    w: 0.8 + r() * 1.8,
    sp: 0.5 + r() * 0.6,
    hot: r() < 0.35,
  }
}

// How a streak moves: slow out of the mouth, faster as it nears.
export function moveStreak(l, v, H, dt) {
  l.z += ((v * l.sp) / H) * (0.25 + l.z * 1.6) * dt
}

// Where a point `z` along a ray at angle `a` is on screen. The tunnel's mouth
// is just above the top of the screen, in the middle.
function rayAt(W, H, a, z) {
  const ox = W / 2
  const oy = -H * 0.14
  const d = z * z * Math.max(W, H) * 1.25 + z * H * 0.12
  return [ox + Math.sin(a) * d * 1.05, oy + Math.cos(a) * d * 0.95]
}

// The glow of the tunnel's mouth is a soft gradient, so it's painted into a
// small canvas and stretched over the top of the screen: a full-screen
// gradient every frame costs more than most of the race. It's repainted only
// when its colours have moved on (heat changes slowly) or the window's shape
// changes. It covers the top 70% of the screen and has faded out by then.
let sky = null
function skyLayer(c1, c2, aspect) {
  const key = c1 + c2 + aspect.toFixed(2)
  if (sky?.key === key) return sky.c
  const w = 192
  const h = Math.round((w / aspect) * 0.7)
  const c = sky?.c ?? document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')
  g.clearRect(0, 0, w, h)
  const R = Math.max(w, h / 0.7) * 0.8
  const mouth = g.createRadialGradient(w / 2, -h * 0.14, 0, w / 2, -h * 0.14, R)
  mouth.addColorStop(0, hexA('#ffffff', 0.32))
  mouth.addColorStop(0.08, hexA(c1, 0.3))
  mouth.addColorStop(0.4, hexA(c2, 0.11))
  mouth.addColorStop(0.8, hexA(c2, 0))
  g.fillStyle = mouth
  g.fillRect(0, 0, w, h)
  sky = { key, c }
  return c
}

// The hyperspace tunnel, behind everything the level draws. `hs` is
// { lines, D, v, heat, fade }: D is the distance travelled (the chevrons on
// the walls are fixed to the course, so they rush past at its speed), v its
// speed, heat 0..1 how far through the race (the light warms from cyan and
// violet to pink and orange), and fade 1..0 as the ships drop out of
// hyperspace at the finish.
export function drawHyperspace(ctx, W, H, hs, t) {
  const { D, v, heat, fade } = hs
  if (fade <= 0.01) return
  const c1 = mixHex('#38d6ff', '#ff5fb8', heat)
  const c2 = mixHex('#8a5cff', '#ffb02e', heat)
  const rush = clamp((v - 280) / 380, 0, 1)
  ctx.save()

  // the bright mouth of the tunnel far ahead: one soft picture, painted small
  // and stretched over the top of the screen. (No wash over the whole sky:
  // the starfield's own big gradients already fill most of a frame's
  // budget.)
  ctx.globalAlpha = fade
  ctx.drawImage(skyLayer(c1, c2, W / H), 0, 0, W, H * 0.7)
  ctx.globalCompositeOperation = 'lighter'

  // the tunnel's ribs: hoops of light swelling out of the mouth and past
  const RIB = 620
  const ph = (D % RIB) / RIB
  for (let i = 0; i < 3; i++) {
    const z = (i + ph) / 3
    const [, y] = rayAt(W, H, 0, z)
    const rr = z * z * Math.max(W, H) * 1.25 + z * H * 0.12
    ctx.strokeStyle = hexA(i % 2 ? c1 : c2, 0.22 * z * (1 - z * 0.6) * (0.6 + rush * 0.6))
    ctx.lineWidth = 1 + z * 5
    ctx.beginPath()
    ctx.ellipse(W / 2, y - rr * 0.95, rr * 1.05, rr * 0.95, 0, 0, Math.PI)
    ctx.stroke()
  }

  // streaks: a long faint tail and a short bright head. They're sorted into
  // a few batches by colour and nearness and each batch is stroked at once:
  // a stroke call apiece costs more than all their pixels.
  ctx.lineCap = 'round'
  const cols = [c1, c2, '#ffffff']
  const batches = []
  for (const l of hs.lines) {
    const z1 = l.z
    const z0 = Math.max(0, z1 - l.len * (0.5 + rush))
    const zh = z1 - (z1 - z0) * 0.3
    const near = z1 < 0.3 ? 0 : z1 < 0.65 ? 1 : 2
    const key = (l.hot ? 0 : Math.abs(l.a) > 0.6 ? 1 : 2) * 3 + near
    const b = (batches[key] ??= { tail: new Path2D(), head: new Path2D(), col: cols[(key / 3) | 0], near })
    const [x0, y0] = rayAt(W, H, l.a, z0)
    const [xh, yh] = rayAt(W, H, l.a, zh)
    const [x1, y1] = rayAt(W, H, l.a, z1)
    b.tail.moveTo(x0, y0)
    b.tail.lineTo(xh, yh)
    b.head.moveTo(xh, yh)
    b.head.lineTo(x1, y1)
  }
  for (const b of batches) {
    if (!b) continue
    const k = [0.3, 0.65, 1][b.near]
    ctx.strokeStyle = b.col
    ctx.globalAlpha = 0.24 * k * fade
    ctx.lineWidth = 1 + k * 1.6
    ctx.stroke(b.tail)
    ctx.globalAlpha = 0.75 * k * fade
    ctx.lineWidth = 1.4 + k * 2
    ctx.stroke(b.head)
  }
  ctx.globalAlpha = fade

  // the walls: a glowing band down each side with chevrons rushing past
  const bw = clamp(W * 0.028, 16, 30)
  for (const side of [-1, 1]) {
    const x0 = side < 0 ? 0 : W
    const inner = x0 - side * bw
    const glow = ctx.createLinearGradient(x0, 0, x0 - side * bw * 4, 0)
    glow.addColorStop(0, hexA(c2, 0.55))
    glow.addColorStop(0.25, hexA(c2, 0.22))
    glow.addColorStop(1, hexA(c2, 0))
    ctx.fillStyle = glow
    ctx.fillRect(side < 0 ? 0 : W - bw * 4, 0, bw * 4, H)
    ctx.strokeStyle = hexA(c1, 0.22)
    ctx.lineWidth = 9
    ctx.beginPath()
    ctx.moveTo(inner, 0)
    ctx.lineTo(inner, H)
    ctx.stroke()
    ctx.strokeStyle = hexA('#ffffff', 0.55 + 0.25 * Math.sin(t * 9))
    ctx.lineWidth = 2
    ctx.stroke()
    // chevrons, brighter down where the ships are
    const CH = 74
    const mid = x0 - side * bw * 0.5
    const far = new Path2D()
    const close = new Path2D()
    for (let y = (D % CH) - CH; y < H + CH; y += CH) {
      const p = y > H * 0.5 ? close : far
      p.moveTo(mid - bw * 0.32, y + bw * 0.22)
      p.lineTo(mid, y - bw * 0.14)
      p.lineTo(mid + bw * 0.32, y + bw * 0.22)
    }
    ctx.lineWidth = 3
    ctx.lineJoin = 'round'
    ctx.strokeStyle = hexA(c1, 0.4)
    ctx.stroke(far)
    ctx.strokeStyle = hexA('#ffffff', 0.62)
    ctx.stroke(close)
  }
  ctx.restore()
}

// ---------------------------------------------------------------- rings

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

  // chasing lights round the rim (the lit ones and the dim ones each filled
  // in one go)
  if (!r.miss) {
    const n = r.gold ? 14 : 10
    const lit = new Path2D()
    const dim = new Path2D()
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * TAU + t * 0.9
      const sn = Math.sin(ang)
      if (sn >= 0 !== front) continue
      const on = Math.sin(t * 9 - i * 1.3) > 0.2
      const bx = r.x + Math.cos(ang) * rx
      const by = r.y + sn * ry - tube * 0.1
      const rr = (on ? 2.6 : 1.8) * s
      const p = on ? lit : dim
      p.moveTo(bx + rr, by)
      p.arc(bx, by, rr, 0, TAU)
    }
    ctx.globalAlpha = alpha * (front ? 1 : 0.7)
    ctx.fillStyle = '#ffffff'
    ctx.fill(lit)
    ctx.globalAlpha = alpha * 0.55 * (front ? 1 : 0.7)
    ctx.fillStyle = pal.light
    ctx.fill(dim)
    ctx.globalAlpha = alpha
  }

  // a gold ring wears a star on top, so it reads as a prize from far away
  if (r.gold && !front && !r.miss) {
    const bob = Math.sin(t * 4) * 3
    ctx.save()
    ctx.translate(r.x, r.y - ry - 14 * s + bob)
    ctx.rotate(Math.sin(t * 2) * 0.15)
    ctx.globalCompositeOperation = 'lighter'
    ctx.fillStyle = hexA(GOLD_PAL.main, 0.35)
    ctx.beginPath()
    ctx.arc(0, 0, 17 * s, 0, TAU)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
    drawStar(ctx, 0, 0, 12 * s, GOLD_PAL.main)
    drawStar(ctx, 0, -1.5 * s, 6 * s, '#fff8d2')
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

// ---------------------------------------------------------------- forks

// A lane's badge, floating over its entry ring: one to three stars for how
// much the lane is worth, in the lane's colour.
export function drawSign(ctx, x, y, s, tier, type, t, a = 1) {
  const col = LANE_COL[type]
  const w = (18 + tier * 20) * s
  const h = 28 * s
  const pulse = 0.5 + 0.5 * Math.sin(t * 6 + x)
  ctx.save()
  ctx.globalAlpha = a
  ctx.translate(x, y)
  ctx.globalCompositeOperation = 'lighter'
  ctx.fillStyle = hexA(col, 0.16 + 0.12 * pulse)
  ctx.beginPath()
  ctx.roundRect(-w / 2 - 7 * s, -h / 2 - 7 * s, w + 14 * s, h + 14 * s, 14 * s)
  ctx.fill()
  ctx.globalCompositeOperation = 'source-over'
  ctx.fillStyle = 'rgba(12,8,36,0.85)'
  ctx.strokeStyle = col
  ctx.lineWidth = 2.5 * s
  ctx.beginPath()
  ctx.roundRect(-w / 2, -h / 2, w, h, 9 * s)
  ctx.fill()
  ctx.stroke()
  for (let i = 0; i < tier; i++) {
    const sx = (i - (tier - 1) / 2) * 20 * s
    drawStar(ctx, sx, 1 * s, 9 * s, col)
    drawStar(ctx, sx, 0, 4 * s, '#ffffff')
  }
  ctx.restore()
}

// Glowing chevrons from the end of the trail to a lane's entry ring, lit one
// after another towards the lane like runway lights. (x0, y0) is the near
// end, (x1, y1) the far.
export function drawArrow(ctx, x0, y0, x1, y1, col, t, a = 1) {
  const dx = x1 - x0
  const dy = y1 - y0
  const len = Math.hypot(dx, dy)
  if (len < 30) return
  const ang = Math.atan2(dy, dx)
  const n = Math.max(2, Math.min(4, Math.floor(len / 50)))
  ctx.save()
  ctx.lineJoin = 'round'
  for (let i = 0; i < n; i++) {
    const k = (i + 0.8) / (n + 0.6)
    const lit = Math.max(0, Math.sin(t * 9 - i * 1.5))
    ctx.save()
    ctx.translate(x0 + dx * k, y0 + dy * k)
    ctx.rotate(ang)
    ctx.globalAlpha = a
    ctx.globalCompositeOperation = 'lighter'
    ctx.drawImage(glow(col), -22, -22, 44, 44)
    ctx.globalCompositeOperation = 'source-over'
    // a fat arrowhead, pointing on towards the lane
    ctx.beginPath()
    ctx.moveTo(-9, -14)
    ctx.lineTo(9, 0)
    ctx.lineTo(-9, 14)
    ctx.lineTo(-3, 0)
    ctx.closePath()
    ctx.fillStyle = lit > 0.5 ? mixHex(col, '#ffffff', lit * 0.7) : col
    ctx.fill()
    ctx.strokeStyle = 'rgba(12,8,36,0.7)'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.restore()
  }
  ctx.restore()
}

// The line marking one lane off from the next, painted on the course.
export function drawDivider(ctx, x, y0, y1, t, a = 1) {
  const top = Math.max(-20, y1)
  const bot = y0
  if (bot <= top) return
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  ctx.globalAlpha = a
  ctx.lineCap = 'round'
  ctx.strokeStyle = 'rgba(255,90,122,0.13)'
  ctx.lineWidth = 12
  ctx.beginPath()
  ctx.moveTo(x, bot)
  ctx.lineTo(x, top)
  ctx.stroke()
  // the dashes are fixed to the course, so they count off the distance
  ctx.setLineDash([18, 22])
  ctx.lineDashOffset = -(bot - y0)
  ctx.strokeStyle = 'rgba(255,200,215,0.55)'
  ctx.lineWidth = 3
  ctx.stroke()
  ctx.restore()
}

// Words painted on the course in light, flying by with it.
export function drawPaint(ctx, text, x, y, col, big, font, a = 1) {
  ctx.save()
  ctx.font = `${big ? 44 : 30}px ${font}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.lineJoin = 'round'
  ctx.globalAlpha = a * 0.5
  ctx.strokeStyle = hexA(col, 0.5)
  ctx.lineWidth = 10
  ctx.strokeText(text, x, y)
  ctx.globalAlpha = a * 0.85
  ctx.fillStyle = col
  ctx.fillText(text, x, y)
  ctx.restore()
}

// ---------------------------------------------------------------- the finish

// A checkered hoop the width of the tunnel, drawn in halves like a ring.
export function drawFinishHalf(ctx, f, front, W, t, font) {
  const rx = W / 2 - 22
  const ry = 46
  const a0 = front ? 0 : Math.PI
  const a1 = front ? Math.PI : TAU
  ctx.save()
  ctx.globalAlpha = f.alpha ?? 1
  if (!front) {
    ctx.globalCompositeOperation = 'lighter'
    ctx.fillStyle = hexA('#ffd54a', 0.08 + 0.05 * Math.sin(t * 6))
    ctx.beginPath()
    ctx.ellipse(f.x, f.y, rx, ry, 0, 0, TAU)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
    drawPaint(ctx, 'Finish', f.x, f.y - ry - 34, '#ffffff', true, font, f.alpha ?? 1)
  }
  ctx.globalCompositeOperation = 'lighter'
  ctx.strokeStyle = hexA('#ffd54a', 0.4)
  ctx.lineWidth = 34
  ctx.beginPath()
  ctx.ellipse(f.x, f.y, rx, ry, 0, a0, a1)
  ctx.stroke()
  ctx.globalCompositeOperation = 'source-over'
  // two rows of checks, the second half a check along
  const tube = 18
  ctx.lineWidth = tube / 2
  for (const [dy, off] of [[-tube / 4, 0], [tube / 4, 16]]) {
    ctx.beginPath()
    ctx.ellipse(f.x, f.y + dy, rx, ry, 0, a0, a1)
    ctx.setLineDash([])
    ctx.strokeStyle = '#ffffff'
    ctx.stroke()
    ctx.setLineDash([16, 16])
    ctx.lineDashOffset = off
    ctx.strokeStyle = '#1a1830'
    ctx.stroke()
  }
  ctx.setLineDash([])
  ctx.strokeStyle = '#ffd54a'
  ctx.lineWidth = 3
  for (const dy of [-tube / 2, tube / 2]) {
    ctx.beginPath()
    ctx.ellipse(f.x, f.y + dy, rx, ry, 0, a0, a1)
    ctx.stroke()
  }
  ctx.restore()
}

// ---------------------------------------------------------------- bombs

// A spiky space mine: a dark ball with glowing studs and a light on top that
// blinks faster as it comes down to the ships. The body is drawn once per
// size and stamped (turned to its spin).
const bodies = new Map()
function bombBody(r) {
  let c = bodies.get(r)
  if (c) return c
  const R = r * 1.7
  c = document.createElement('canvas')
  c.width = c.height = Math.ceil(R * 4)
  c.R = R
  const g = c.getContext('2d')
  g.scale(2, 2)
  g.translate(R, R)
  // spikes with glowing studs on their tips
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU
    const ca = Math.cos(a)
    const sa = Math.sin(a)
    g.strokeStyle = '#6d4a99'
    g.lineWidth = r * 0.22
    g.lineCap = 'round'
    g.beginPath()
    g.moveTo(ca * r * 0.7, sa * r * 0.7)
    g.lineTo(ca * r * 1.32, sa * r * 1.32)
    g.stroke()
    g.fillStyle = '#ff7bd8'
    g.beginPath()
    g.arc(ca * r * 1.36, sa * r * 1.36, r * 0.17, 0, TAU)
    g.fill()
    g.fillStyle = '#ffe0f4'
    g.beginPath()
    g.arc(ca * r * 1.36 - r * 0.05, sa * r * 1.36 - r * 0.05, r * 0.07, 0, TAU)
    g.fill()
  }
  const body = g.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r)
  body.addColorStop(0, '#a77ae6')
  body.addColorStop(0.45, '#4b2a8a')
  body.addColorStop(1, '#170a33')
  g.fillStyle = body
  g.beginPath()
  g.arc(0, 0, r, 0, TAU)
  g.fill()
  // a band round the middle
  g.save()
  g.clip()
  g.fillStyle = 'rgba(255,123,216,0.35)'
  g.fillRect(-r, -r * 0.16, r * 2, r * 0.32)
  g.restore()
  g.strokeStyle = 'rgba(255,170,230,0.6)'
  g.lineWidth = 1.5
  g.beginPath()
  g.arc(0, 0, r - 0.75, 0, TAU)
  g.stroke()
  bodies.set(r, c)
  return c
}

const glows = new Map()
function glow(color) {
  let c = glows.get(color)
  if (c) return c
  c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, hexA(color, 0.9))
  grad.addColorStop(0.35, hexA(color, 0.35))
  grad.addColorStop(1, hexA(color, 0))
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  glows.set(color, c)
  return c
}

// `e` is { x, y, r, spin, warn, seed, moving?, fall? }.
export function drawBomb(ctx, e, t) {
  const r = e.r
  const warn = e.warn ?? 0
  const rate = 5 + warn * 9
  const blink = Math.sin(t * rate + e.seed * 7) > 0.1
  ctx.save()
  ctx.translate(e.x, e.y)
  // a dashed warning ring once it's down where the ships fly
  if (warn > 0) {
    ctx.strokeStyle = hexA('#ff5a7a', warn * (0.35 + 0.2 * Math.sin(t * 10 + e.seed)))
    ctx.lineWidth = 3
    ctx.beginPath()
    const R = r * 1.9
    for (let i = 0; i < 9; i++) {
      const a0 = (i / 9) * TAU + t * 1.3
      ctx.moveTo(Math.cos(a0) * R, Math.sin(a0) * R)
      ctx.arc(0, 0, R, a0, a0 + TAU / 18)
    }
    ctx.stroke()
  }
  // sliding in: thruster puffs behind it, chevrons ahead
  if (e.moving) {
    ctx.globalCompositeOperation = 'lighter'
    ctx.drawImage(glow('#9ff0ff'), -e.moving * r * 1.9 - 12, -12, 24, 24)
    ctx.globalCompositeOperation = 'source-over'
    ctx.strokeStyle = hexA('#ffb36a', 0.8)
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    for (let i = 0; i < 2; i++) {
      const cx = e.moving * (r * 2.1 + i * 11)
      ctx.beginPath()
      ctx.moveTo(cx - e.moving * 5, -7)
      ctx.lineTo(cx + e.moving * 2, 0)
      ctx.lineTo(cx - e.moving * 5, 7)
      ctx.stroke()
    }
  }
  if (blink) {
    ctx.globalCompositeOperation = 'lighter'
    const G = r * (3.2 + warn)
    ctx.drawImage(glow('#ff3b6b'), -G, -G, G * 2, G * 2)
    ctx.globalCompositeOperation = 'source-over'
  }
  const s = 1 + (e.fall ?? 0) * 0.4
  ctx.save()
  ctx.rotate(e.spin ?? 0)
  ctx.scale(s, s)
  const c = bombBody(r)
  ctx.drawImage(c, -c.R, -c.R, c.R * 2, c.R * 2)
  ctx.restore()
  // the light on top
  ctx.fillStyle = blink ? '#ffffff' : '#ff3b6b'
  ctx.beginPath()
  ctx.arc(0, -r * 0.1, r * 0.3, 0, TAU)
  ctx.fill()
  if (blink) {
    ctx.fillStyle = '#ff3b6b'
    ctx.beginPath()
    ctx.arc(0, -r * 0.1, r * 0.18, 0, TAU)
    ctx.fill()
  }
  ctx.restore()
}

// ---------------------------------------------------------------- saucers

// A streaker's warning: a red line straight down the screen where it's about
// to come, and a flashing sign at the top. `e` is { x, warnT, warn0 }.
export function drawStreakWarn(ctx, e, H, t) {
  const k = 1 - e.warnT / e.warn0 // 0 → 1 as it gets closer
  const on = Math.sin(t * (14 + k * 16)) > -0.2
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  ctx.fillStyle = `rgba(255,60,80,${0.06 + 0.1 * k})`
  ctx.fillRect(e.x - 34, 0, 68, H)
  ctx.strokeStyle = `rgba(255,110,120,${on ? 0.75 : 0.3})`
  ctx.lineWidth = 3
  ctx.setLineDash([16, 12])
  ctx.lineDashOffset = t * 260
  ctx.beginPath()
  ctx.moveTo(e.x, 70)
  ctx.lineTo(e.x, H)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.globalCompositeOperation = 'source-over'
  // the warning sign: a red triangle with a "!" in it
  const y = 92
  const s = 1 + 0.15 * Math.sin(t * 20)
  ctx.translate(e.x, y)
  ctx.scale(s, s)
  ctx.fillStyle = on ? '#ff3b5c' : '#9e1b2c'
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 3
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(0, -20)
  ctx.lineTo(21, 16)
  ctx.lineTo(-21, 16)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(-2.5, -9, 5, 14)
  ctx.beginPath()
  ctx.arc(0, 10, 3, 0, TAU)
  ctx.fill()
  ctx.restore()
}

// A saucer going flat out leaves a smear of light behind it.
export function drawMotion(ctx, e, len) {
  const vx = e.vx || 0
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const g = ctx.createLinearGradient(e.x, e.y, e.x, e.y - len)
  g.addColorStop(0, 'rgba(255,170,150,0.5)')
  g.addColorStop(1, 'rgba(255,90,90,0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.moveTo(e.x - e.r * 0.9, e.y)
  ctx.lineTo(e.x + e.r * 0.9, e.y)
  ctx.lineTo(e.x + e.r * 0.3 - vx * 0.05, e.y - len)
  ctx.lineTo(e.x - e.r * 0.3 - vx * 0.05, e.y - len)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

// A parked saucer's gun warming up: a swelling orange glow under it.
export function drawCharge(ctx, x, y, k, t) {
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const G = 10 + k * 26 + Math.sin(t * 40) * 2
  ctx.drawImage(glow('#ffb02e'), x - G, y - G, G * 2, G * 2)
  ctx.fillStyle = hexA('#fff1c2', 0.5 + k * 0.5)
  ctx.beginPath()
  ctx.arc(x, y, 3 + k * 4, 0, TAU)
  ctx.fill()
  ctx.restore()
}

// ---------------------------------------------------------------- the map icon

// The tunnel rushing away, the trail splitting round a bomb into a gold lane
// and a green one, and a little ship about to pick.
export function drawIcon(ctx, w, h) {
  ctx.save()
  const sky = ctx.createLinearGradient(0, 0, 0, h)
  sky.addColorStop(0, '#1a0d4f')
  sky.addColorStop(1, '#0b0726')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, w, h)
  const mouth = ctx.createRadialGradient(w / 2, -6, 0, w / 2, -6, 50)
  mouth.addColorStop(0, 'rgba(56,214,255,0.55)')
  mouth.addColorStop(1, 'rgba(138,92,255,0)')
  ctx.fillStyle = mouth
  ctx.fillRect(0, 0, w, h)
  // streaks fanning out from far ahead
  ctx.lineCap = 'round'
  for (let i = 0; i < 14; i++) {
    const u = (i / 13) * 2 - 1
    const y0 = 2 + ((i * 7) % 12)
    ctx.strokeStyle = i % 3 ? 'rgba(159,240,255,0.45)' : 'rgba(200,170,255,0.5)'
    ctx.lineWidth = i % 4 ? 0.7 : 1.1
    ctx.beginPath()
    ctx.moveTo(w / 2 + u * 10, y0)
    ctx.lineTo(w / 2 + u * 46, y0 + 14 + (i % 3) * 5)
    ctx.stroke()
  }
  // the walls
  for (const x of [2.5, w - 2.5]) {
    ctx.strokeStyle = 'rgba(138,92,255,0.8)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, h)
    ctx.stroke()
  }

  const half = (r, front) => {
    const ry = r.rx * 0.34
    const a0 = front ? 0 : Math.PI
    const lw = r.rx * 0.22
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
  const rings = [
    { x: 22, y: 12, rx: 8, pal: GOLD_PAL },
    { x: 58, y: 13, rx: 8, pal: RING_PALS[2] },
    { x: 40, y: 34, rx: 13, pal: RING_PALS[0] },
  ]
  for (const r of rings) half(r, false)
  for (const r of rings.slice(0, 2)) half(r, true)
  drawStar(ctx, 22, 5, 3, GOLD_PAL.main)
  // chevrons from the near ring out to each lane
  ctx.strokeStyle = '#ffd54a'
  ctx.lineWidth = 1.4
  ctx.lineJoin = 'round'
  for (const [x, y, d] of [[31, 24, -1], [49, 24, 1]]) {
    ctx.strokeStyle = d < 0 ? '#ffd54a' : '#a8f04a'
    ctx.beginPath()
    ctx.moveTo(x - 3, y + 1)
    ctx.lineTo(x + d * 1.5, y - 3)
    ctx.lineTo(x + 3, y + 1)
    ctx.stroke()
  }
  // the bomb where the trail splits (drawn in plain paths: the stamped one
  // would blur at icon size)
  ctx.strokeStyle = '#6d4a99'
  ctx.lineWidth = 1
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU + 0.3
    ctx.beginPath()
    ctx.moveTo(40 + Math.cos(a) * 2.5, 15 + Math.sin(a) * 2.5)
    ctx.lineTo(40 + Math.cos(a) * 5, 15 + Math.sin(a) * 5)
    ctx.stroke()
    ctx.fillStyle = '#ff7bd8'
    ctx.beginPath()
    ctx.arc(40 + Math.cos(a) * 5.1, 15 + Math.sin(a) * 5.1, 0.7, 0, TAU)
    ctx.fill()
  }
  ctx.fillStyle = '#4b2a8a'
  ctx.beginPath()
  ctx.arc(40, 15, 3.6, 0, TAU)
  ctx.fill()
  ctx.fillStyle = '#ff3b6b'
  ctx.beginPath()
  ctx.arc(40, 14.6, 1.2, 0, TAU)
  ctx.fill()
  drawShip(ctx, 40, 38, PLAYER_COLORS[0], { scale: 0.3, thrust: 1, t: 0.3 })
  half(rings[2], true)
  ctx.restore()
}
