// The Ion Storm's weather: the cloud deck, the rain, and the lightning that
// strikes the field. The level and the Storm Eye both call strikes down from
// here, so the two share one look and one set of fairness rules.

import { synth } from '../../audio.js'
import { hexA } from '../../stars.js'

const TAU = Math.PI * 2
const rand = (a, b) => a + Math.random() * (b - a)

// A strike crackles for `warn` seconds, then burns for `active`. Its lane is
// `w` wide (main.js hurts a ship within w * 0.4 + 8 of the middle), and no two
// strikes that are still live land within `gap` of each other, so there is
// always a lane wide enough to slip into between them.
const BOLT = { warn: 1.15, active: 0.35, w: 56, gap: 170 }

const BLUE = '#8fd8ff'
const GOLD = '#ffe66b'

// Weather that outlives any one strike: sky flashes, the beacon bolts the
// Storm Eye takes, and the wind it blows (-1 left … 1 right).
export const sky = { flashes: [], zaps: [], wind: 0, flick: 0, rumbleT: 3, drops: [] }

export function resetSky() {
  sky.flashes = []
  sky.zaps = []
  sky.wind = 0
  sky.flick = 0
  sky.rumbleT = rand(2, 4)
  // rain as fractions of the screen, so a resize just stretches it
  sky.drops = Array.from({ length: 90 }, () => ({ u: Math.random(), v: Math.random(), len: rand(14, 30), sp: rand(0.9, 1.4) }))
}
resetSky()

export function updateSky(g, dt) {
  sky.flick = Math.max(0, sky.flick - dt * 3)
  for (const f of sky.flashes) f.life -= dt
  sky.flashes = sky.flashes.filter((f) => f.life > 0)
  for (const z of sky.zaps) z.life -= dt
  sky.zaps = sky.zaps.filter((z) => z.life > 0)
  // the wind dies down unless the Storm Eye keeps blowing
  if (!g.boss || g.boss.dying || !g.boss.gust) sky.wind *= Math.max(0, 1 - dt * 2.5)

  // far-off sheet lightning inside the clouds: harmless, and it never leaves
  // the cloud deck, so it can't be mistaken for a strike
  if ((sky.rumbleT -= dt) <= 0) {
    sky.rumbleT = rand(2.5, 5.5)
    flashAt(rand(0, g.W), 0.55)
    synth.noise({ dur: 1.4, vol: 0.07, freq: 320, to: 50, q: 0.7 }, 'ion-rumble', 1)
  }
}

function flashAt(x, power = 1) {
  sky.flashes.push({ x, life: 0.45, max: 0.45, power })
}

// ---------------------------------------------------------------- strikes

const live = (g) => g.lasers.filter((L) => L.ion)

function roomAt(g, x) {
  return live(g).every((L) => Math.abs(L.x - x) >= BOLT.gap)
}

// Call a bolt down at x. If that lane is too close to another strike it slides
// over to the nearest one that's clear (unless `nudge` is false), and if
// there's no room at all it doesn't come. Returns the strike or null.
export function strike(g, x, { warn = BOLT.warn, nudge = true, from = null } = {}) {
  if (g.phase === 'clear' || g.phase === 'victory' || g.boss?.dying) return null
  const W = g.W
  const offsets = nudge ? [0, 60, -60, 120, -120, 180, -180] : [0]
  let at = null
  for (const d of offsets) {
    const nx = x + d
    if (nx >= 40 && nx <= W - 40 && roomAt(g, nx)) {
      at = nx
      break
    }
  }
  if (at === null) return null
  const L = { ion: true, x: at, y0: 34, w: BOLT.w, warn, warn0: warn, active: BOLT.active, from, track: trackStrike, draw: drawStrike }
  if (from) L.y0 = underside(from, at)
  g.lasers.push(L)
  crackle()
  return L
}

// A boss's strikes come out of the bottom of its cloud where there's cloud
// overhead, and out of the sky either side of it.
function underside(b, x) {
  const u = (x - b.x) / (b.r * 0.95)
  return Math.abs(u) < 1 ? b.y + b.r * 0.5 * Math.sqrt(1 - u * u) : 34
}

// A row of strikes stepping across the field, one after another, from a
// random side. The gaps between them are the safe spots.
export function walk(g, { step = 215, delay = 0.42, from = null } = {}) {
  const dir = Math.random() < 0.5 ? 1 : -1
  const x0 = dir > 0 ? rand(60, 130) : g.W - rand(60, 130)
  for (let i = 0; i < 12; i++) {
    const x = x0 + dir * i * step
    if (x < 40 || x > g.W - 40) break
    g.later(i * delay, () => strike(g, x, { nudge: false, from }))
  }
}

// Runs every frame for each strike (main.js calls it before ticking the
// warning down), so it's where a strike notices it has just landed.
function trackStrike(L, g) {
  if (L.from && !L.from.dying) L.y0 = underside(L.from, L.x)
  if (L.warn > 0) {
    if (!L.crackled && L.warn < L.warn0 * 0.45) {
      L.crackled = true
      crackle()
    }
    return
  }
  if (!L.landed) {
    L.landed = true
    thunder()
    flashAt(L.x, 1)
    sky.flick = 1
    g.splash(L.x, g.H - 26, BLUE)
    g.sparks(L.x, g.H - 30, '#ffffff', 8)
  }
  // anything caught in the lane gets fried too — saucers included
  for (const e of g.enemies) {
    if (e.dead || e.y < L.y0 - 20 || Math.abs(e.x - L.x) > L.w * 0.4 + e.r * 0.6) continue
    e.dead = true
    g.explode(e.x, e.y, BLUE, 0.9)
    g.popText(e.x, e.y - 26, 'Zapped!', '#cfeeff', 14, 0.8)
    g.sfx.pop(0.7)
    if (Math.random() < 0.15) g.dropBubble(e.x, e.y)
  }
}

// ---------------------------------------------------------------- sounds

function crackle() {
  synth.noise({ dur: 0.22, vol: 0.13, freq: 7000, to: 2400, q: 0.5 }, 'ion-crackle', 0.07)
  synth.tone({ type: 'square', from: 1900, to: 2600, dur: 0.05, vol: 0.025 }, 'ion-crackle2', 0.07)
}

export function thunder(big = 0) {
  synth.noise({ dur: 1 + big * 0.4, vol: 0.45 + big * 0.15, freq: 2400, to: 60, q: 0.9 }, 'ion-thunder', 0.12)
  synth.tone({ type: 'sawtooth', from: 120, to: 36, dur: 0.55, vol: 0.13 + big * 0.06 }, 'ion-thunder2', 0.12)
}

// ---------------------------------------------------------------- bolt art

// A jagged line from (x0, y0) to (x1, y1), jittering at most `jag` to either
// side, with a couple of short forks.
export function boltPath(x0, y0, x1, y1, jag, forks = 2, seg = 34) {
  const path = new Path2D()
  const dx = x1 - x0
  const dy = y1 - y0
  const len = Math.hypot(dx, dy)
  const n = Math.max(2, Math.round(len / seg))
  const nx = -dy / len
  const ny = dx / len
  const pts = [[x0, y0]]
  for (let i = 1; i < n; i++) {
    const k = i / n
    const off = rand(-jag, jag)
    pts.push([x0 + dx * k + nx * off, y0 + dy * k + ny * off])
  }
  pts.push([x1, y1])
  path.moveTo(x0, y0)
  for (const [x, y] of pts) path.lineTo(x, y)
  for (let f = 0; f < forks; f++) {
    let [x, y] = pts[1 + ((Math.random() * (n - 2)) | 0)]
    const side = Math.random() < 0.5 ? -1 : 1
    path.moveTo(x, y)
    for (let s = 0; s < 3; s++) {
      x += (dx / len) * rand(14, 26) + nx * side * rand(4, jag * 0.9)
      y += (dy / len) * rand(14, 26) + ny * side * rand(4, jag * 0.9)
      path.lineTo(x, y)
    }
  }
  return path
}

// The three passes that make a bolt glow: a wide haze, a coloured body and a
// white-hot core.
export function strokeBolt(ctx, path, color, a = 1, scale = 1) {
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.strokeStyle = hexA(color, 0.28 * a)
  ctx.lineWidth = 24 * scale
  ctx.stroke(path)
  ctx.strokeStyle = hexA(color, 0.85 * a)
  ctx.lineWidth = 8 * scale
  ctx.stroke(path)
  ctx.strokeStyle = `rgba(255,255,255,${a})`
  ctx.lineWidth = 3 * scale
  ctx.stroke(path)
}

function drawStrike(ctx, L, H, t) {
  if (L.warn > 0) return drawWarning(ctx, L, H, t)
  // a fresh zigzag twenty times a second, so the bolt writhes
  const frame = Math.floor(t * 20)
  if (L.frame !== frame) {
    L.frame = frame
    L.path = boltPath(L.x, L.y0, L.x, H + 10, 15, 2)
  }
  const fade = Math.min(1, L.active / 0.12)
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  // the lane itself lights up: that's the part that hurts
  const lane = ctx.createLinearGradient(L.x - L.w / 2, 0, L.x + L.w / 2, 0)
  lane.addColorStop(0, 'rgba(90,160,255,0)')
  lane.addColorStop(0.5, `rgba(120,190,255,${0.35 * fade})`)
  lane.addColorStop(1, 'rgba(90,160,255,0)')
  ctx.fillStyle = lane
  ctx.fillRect(L.x - L.w / 2, L.y0, L.w, H - L.y0)
  strokeBolt(ctx, L.path, BLUE, fade)
  const gl = glow(BLUE, 60)
  ctx.globalAlpha = fade
  ctx.drawImage(gl, L.x - 90, H - 120, 180, 180)
  ctx.globalAlpha = 1
  ctx.restore()
}

function drawWarning(ctx, L, H, t) {
  // k climbs from 0 to 1 as the strike gets close, and everything with it
  const k = 1 - L.warn / L.warn0
  const blink = 0.5 + 0.5 * Math.sin(t * (16 + k * 26))
  const x0 = L.x - L.w / 2
  ctx.save()
  ctx.fillStyle = `rgba(120,190,255,${0.07 + 0.16 * k + 0.07 * blink})`
  ctx.fillRect(x0, L.y0, L.w, H - L.y0)
  ctx.strokeStyle = `rgba(200,236,255,${0.3 + 0.5 * k})`
  ctx.lineWidth = 2
  ctx.setLineDash([12, 9])
  ctx.lineDashOffset = -t * 90
  ctx.beginPath()
  ctx.moveTo(x0, L.y0)
  ctx.lineTo(x0, H)
  ctx.moveTo(x0 + L.w, L.y0)
  ctx.lineTo(x0 + L.w, H)
  ctx.stroke()
  ctx.setLineDash([])

  // static crackling in the lane, busier as it charges
  ctx.globalCompositeOperation = 'lighter'
  ctx.strokeStyle = `rgba(210,240,255,${0.5 + 0.5 * k})`
  ctx.lineWidth = 2
  ctx.lineJoin = 'round'
  ctx.beginPath()
  const n = 2 + Math.round(k * 5)
  for (let i = 0; i < n; i++) {
    let x = L.x + rand(-L.w * 0.35, L.w * 0.35)
    let y = L.y0 + 40 + Math.random() * (H - L.y0 - 40)
    ctx.moveTo(x, y)
    for (let s = 0; s < 3; s++) {
      x += rand(-9, 9)
      y += rand(6, 12)
      ctx.lineTo(x, y)
    }
  }
  ctx.stroke()
  ctx.restore()

  // a bolt sign hangs under the clouds where it'll come from
  const s = 13 + 5 * k + blink * 2
  boltSign(ctx, L.x, L.y0 + 46, s, 0.6 + 0.4 * blink)
}

// The lightning-bolt glyph in a round badge: used for warnings and beacons.
export function boltSign(ctx, x, y, s, a = 1, fill = GOLD) {
  ctx.save()
  ctx.globalAlpha = a
  ctx.fillStyle = 'rgba(14,10,46,0.8)'
  ctx.beginPath()
  ctx.arc(x, y, s * 1.15, 0, TAU)
  ctx.fill()
  ctx.strokeStyle = fill
  ctx.lineWidth = 2.5
  ctx.stroke()
  boltGlyph(ctx, x, y, s * 0.85, fill)
  ctx.restore()
}

export function boltGlyph(ctx, x, y, s, fill = GOLD) {
  ctx.fillStyle = fill
  ctx.beginPath()
  ctx.moveTo(x + s * 0.18, y - s)
  ctx.lineTo(x - s * 0.5, y + s * 0.12)
  ctx.lineTo(x - s * 0.02, y + s * 0.12)
  ctx.lineTo(x - s * 0.2, y + s)
  ctx.lineTo(x + s * 0.52, y - s * 0.18)
  ctx.lineTo(x + s * 0.04, y - s * 0.18)
  ctx.closePath()
  ctx.fill()
}

// ---------------------------------------------------------------- sprites
//
// Soft glows and cloud heaps are painted once to a canvas and stamped after
// that: a deck of clouds in gradients every frame would add up.

const glows = new Map()
export function glow(color, r) {
  const key = color + r
  let c = glows.get(key)
  if (!c) {
    c = document.createElement('canvas')
    c.width = c.height = r * 4
    const g = c.getContext('2d')
    const grad = g.createRadialGradient(r * 2, r * 2, 0, r * 2, r * 2, r * 2)
    grad.addColorStop(0, hexA(color, 0.9))
    grad.addColorStop(0.35, hexA(color, 0.45))
    grad.addColorStop(1, hexA(color, 0))
    g.fillStyle = grad
    g.fillRect(0, 0, r * 4, r * 4)
    glows.set(key, c)
  }
  return c
}

// A storm cloud is a heap of overlapping balls, shaded from a pale top to a
// dark belly. The lit version is the same heap caught in a lightning flash.
const DARK = ['#6f69c2', '#3b3488', '#1b1748', 'rgba(190,180,255,0.4)']
const LIT = ['#f2f7ff', '#a9c4ff', '#5a68d8', 'rgba(255,255,255,0.7)']

function heap(w, h) {
  const balls = []
  const n = 5
  for (let i = 0; i < n; i++) {
    const r = h * rand(0.24, 0.3)
    balls.push([w * (0.12 + (0.76 * i) / (n - 1)) + rand(-6, 6), h * 0.7 + rand(-4, 4), r])
  }
  for (let i = 0; i < 3; i++) {
    const r = h * rand(0.3, 0.4)
    balls.push([w * (0.28 + 0.22 * i) + rand(-10, 10), h * rand(0.42, 0.5), r])
  }
  return balls
}

function paintHeap(balls, w, h, pal) {
  const c = document.createElement('canvas')
  c.width = w * 2
  c.height = h * 2
  const g = c.getContext('2d')
  g.scale(2, 2)
  const body = g.createLinearGradient(0, h * 0.1, 0, h)
  body.addColorStop(0, pal[0])
  body.addColorStop(0.45, pal[1])
  body.addColorStop(1, pal[2])
  g.fillStyle = body
  g.beginPath()
  for (const [x, y, r] of balls) {
    g.moveTo(x + r, y)
    g.arc(x, y, r, 0, TAU)
  }
  g.fill()
  // a rim of light on the top of each ball
  g.globalCompositeOperation = 'source-atop'
  for (const [x, y, r] of balls) {
    const hl = g.createRadialGradient(x - r * 0.25, y - r * 0.55, 0, x - r * 0.25, y - r * 0.55, r * 0.9)
    hl.addColorStop(0, pal[3])
    hl.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = hl
    g.fillRect(x - r, y - r, r * 2, r * 2)
  }
  return c
}

let clouds = null
// Three cloud shapes, each with a lit twin.
function cloudSprites() {
  if (!clouds) {
    clouds = []
    for (let i = 0; i < 3; i++) {
      const w = 240
      const h = 120
      const balls = heap(w, h)
      clouds.push({ w, h, dark: paintHeap(balls, w, h, DARK), lit: paintHeap(balls, w, h, LIT) })
    }
  }
  return clouds
}

// ---------------------------------------------------------------- the sky

// Where the n-th puff of a cloud row sits right now: rows drift sideways and
// wrap around, each puff bobbing a little.
function puffs(g, row) {
  const span = g.W + 320
  const out = []
  const n = Math.ceil(span / row.step)
  for (let i = 0; i < n; i++) {
    const x = ((((i * row.step + g.time * row.speed) % span) + span) % span) - 160
    const y = row.y + Math.sin(i * 1.7 + row.y) * 10 + Math.sin(g.time * 0.6 + i) * 3
    const sc = row.scale * (0.85 + ((i * 0.37) % 0.3))
    out.push([x, y, sc, (i + row.kind) % 3])
  }
  return out
}

const BACK_ROW = { y: 6, step: 150, speed: 9, scale: 0.95, kind: 0 }
const FRONT_ROW = { y: -46, step: 175, speed: 16, scale: 0.8, kind: 1 }

function drawRow(ctx, g, row, alpha) {
  const sprites = cloudSprites()
  for (const [x, y, sc, k] of puffs(g, row)) {
    const c = sprites[k]
    const w = c.w * sc
    const h = c.h * sc
    ctx.globalAlpha = alpha
    ctx.drawImage(c.dark, x - w / 2, y - h / 2, w, h)
    // light the clouds near any flash, flickering as it fades
    let lit = 0
    for (const f of sky.flashes) {
      const d = Math.abs(f.x - x)
      if (d > 320) continue
      const k2 = f.life / f.max
      lit = Math.max(lit, f.power * k2 * (0.7 + 0.3 * Math.sin(f.life * 70)) * (1 - d / 320))
    }
    if (lit > 0.02) {
      ctx.globalAlpha = alpha * Math.min(1, lit)
      ctx.drawImage(c.lit, x - w / 2, y - h / 2, w, h)
    }
  }
  ctx.globalAlpha = 1
}

export function drawSkyBack(g, ctx) {
  const { W, H } = g
  // a stormy night: the stars dimmed, a heavy band of cloud across the top
  ctx.fillStyle = 'rgba(10,12,44,0.3)'
  ctx.fillRect(0, 0, W, H)
  if (sky.flick > 0) {
    ctx.fillStyle = `rgba(160,200,255,${0.06 * sky.flick})`
    ctx.fillRect(0, 0, W, H)
  }
  const band = ctx.createLinearGradient(0, 0, 0, 190)
  band.addColorStop(0, 'rgba(14,10,46,0.95)')
  band.addColorStop(0.5, 'rgba(24,18,70,0.55)')
  band.addColorStop(1, 'rgba(24,18,70,0)')
  ctx.fillStyle = band
  ctx.fillRect(0, 0, W, 190)

  // flashes glow through from behind the clouds
  ctx.globalCompositeOperation = 'lighter'
  const gl = glow('#9fc8ff', 64)
  for (const f of sky.flashes) {
    const k = f.life / f.max
    ctx.globalAlpha = f.power * k * (0.6 + 0.4 * Math.sin(f.life * 70))
    ctx.drawImage(gl, f.x - 260, -200, 520, 440)
  }
  ctx.globalAlpha = 1
  ctx.globalCompositeOperation = 'source-over'
  drawRow(ctx, g, BACK_ROW, 1)

  // rain, slanting with the wind
  const slant = 0.16 + sky.wind * 0.9
  ctx.strokeStyle = 'rgba(170,200,255,0.2)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  for (const d of sky.drops) {
    const y = ((d.v * (H + 80) + g.time * 620 * d.sp) % (H + 80)) - 40
    const x = (((d.u * (W + 400) + y * slant) % (W + 400)) + W + 400) % (W + 400) - 200
    ctx.moveTo(x, y)
    ctx.lineTo(x - d.len * slant, y - d.len)
  }
  ctx.stroke()
}

export function drawSkyTop(g, ctx) {
  // the low fringe of the clouds, in front: saucers come out of it and
  // strikes come down through it
  drawRow(ctx, g, FRONT_ROW, 0.92)
}
