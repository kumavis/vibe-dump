// The Asteroid Belt's rocks. Each is a lumpy blob with craters, specks and
// the odd crack, painted once into a sprite and then stamped and spun: a busy
// field has thirty of them, and repainting every crater every frame adds up.
//
// The light stays put while a rock turns. The sprite carries the colour and
// the detail; the shading is one gradient laid over the rock's outline each
// frame, counter-rotated so the sun is always up and to the left.

import { hexA } from '../../stars.js'

const TAU = Math.PI * 2
const rand = (a, b) => a + Math.random() * (b - a)
const RES = 2 // sprites are painted at 2x so they stay crisp on a DPR 2 screen

// light, base, dark, crater floor, speck
export const PALS = [
  { light: '#ffe2b8', base: '#c4946a', dark: '#5a3826', crater: '#94684a', speck: '#e8c49a' }, // sandstone
  { light: '#e6dcff', base: '#9a88c2', dark: '#3a2f62', crater: '#73639e', speck: '#c6b8ea' }, // lilac
  { light: '#d8ecf6', base: '#86a0b6', dark: '#2f4258', crater: '#627c94', speck: '#b4cada' }, // slate
  { light: '#ffd0b0', base: '#cc7752', dark: '#5c2620', crater: '#9c5238', speck: '#f0a07a' }, // rust
]

// Crystal rocks glitter in one of these. Cyan is kept back for power cores,
// so the thing you carry never looks like the thing you shoot.
export const CRYSTAL = ['#ff6bd6', '#b98cff', '#ffcf4a']
export const CORE = '#62f6ff'

// How each size of rock behaves. `next` is what it splits into.
export const SIZES = {
  giant: { r: 78, hp: 12, score: 400, boom: 1.4, drop: 0.35, chunks: 12, lumps: 13, craters: 6, speed: 45, spin: 0.35, next: 'big' },
  big: { r: 52, hp: 5, score: 150, boom: 1.0, drop: 0.06, chunks: 9, lumps: 11, craters: 4, speed: 64, spin: 0.6, next: 'mid' },
  mid: { r: 33, hp: 2, score: 100, boom: 0.7, drop: 0.05, chunks: 6, lumps: 9, craters: 3, speed: 82, spin: 0.9, next: 'small' },
  small: { r: 19, hp: 1, score: 50, boom: 0.45, drop: 0.04, chunks: 4, lumps: 8, craters: 1, speed: 104, spin: 1.4, next: null },
}

// ---------------------------------------------------------------- sprites

// Shapes per size and palette. Only one giant comes per run, so it gets few.
const VARIANTS = { giant: 2, big: 5, mid: 5, small: 5 }
const pool = new Map()

// A sprite for one size / palette / kind, from a small pool of shapes per
// combination, painted the first time it's asked for.
export function rockSprite(size, pal, kind = 'plain', variant = Math.random() * VARIANTS[size]) {
  variant = (variant | 0) % VARIANTS[size]
  const key = `${size}:${pal}:${kind}:${variant}`
  let s = pool.get(key)
  if (!s) {
    s = paintRock(SIZES[size], PALS[pal], kind, variant)
    pool.set(key, s)
  }
  return s
}

// The outline: points jittered around a circle, joined by curves through
// their midpoints so the lumps come out rounded rather than spiky.
// Every sprite the belt will use, so they can be painted a few at a time
// while the mission's banner is up instead of in the middle of the action.
export function* spriteList() {
  for (const size of ['big', 'mid', 'small', 'giant']) {
    for (let pal = 0; pal < PALS.length; pal++) {
      for (let v = 0; v < VARIANTS[size]; v++) {
        yield [size, pal, 'plain', v]
        if (size === 'mid') yield [size, pal, 'crystal', v]
        if (size === 'big') yield [size, pal, 'hot', v]
      }
    }
  }
  for (let v = 0; v < VARIANTS.mid; v++) yield ['mid', 2, 'core', v]
}

function makeShape(r, n) {
  const pts = []
  for (let i = 0; i < n; i++) {
    const a = ((i + rand(-0.3, 0.3)) / n) * TAU
    const rr = r * rand(0.84, 1.08)
    pts.push([Math.cos(a) * rr, Math.sin(a) * rr])
  }
  const mid = (i) => {
    const p = pts[i % n]
    const q = pts[(i + 1) % n]
    return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
  }
  const path = new Path2D()
  let m = mid(n - 1)
  path.moveTo(m[0], m[1])
  for (let i = 0; i < n; i++) {
    m = mid(i)
    path.quadraticCurveTo(pts[i][0], pts[i][1], m[0], m[1])
  }
  path.closePath()
  return { pts, path }
}

function paintRock(S, pal, kind, variant) {
  const r = S.r
  const { pts, path } = makeShape(r, S.lumps)
  const R = Math.ceil(r * 1.3) // room for crystals poking out of the edge
  const c = document.createElement('canvas')
  c.width = c.height = R * 2 * RES
  const x = c.getContext('2d')
  x.scale(RES, RES)
  x.translate(R, R)

  x.fillStyle = pal.base
  x.fill(path)
  x.save()
  x.clip(path)
  // mottling, so the face isn't one flat colour
  for (let i = 0; i < 6; i++) {
    x.fillStyle = hexA(i % 2 ? pal.light : pal.dark, 0.13)
    x.beginPath()
    x.ellipse(rand(-r, r) * 0.6, rand(-r, r) * 0.6, r * rand(0.25, 0.55), r * rand(0.2, 0.45), rand(0, TAU), 0, TAU)
    x.fill()
  }
  for (let i = 0; i < r * 1.1; i++) {
    x.fillStyle = Math.random() < 0.6 ? hexA(pal.speck, 0.7) : hexA(pal.dark, 0.45)
    x.beginPath()
    x.arc(rand(-r, r), rand(-r, r), rand(0.5, 1.4) * (r > 30 ? 1.2 : 0.8), 0, TAU)
    x.fill()
  }
  // craters, kept apart and away from the rim
  const placed = []
  for (let tries = 0; placed.length < S.craters && tries < 40; tries++) {
    const cr = r * rand(0.13, placed.length ? 0.22 : 0.28)
    const a = rand(0, TAU)
    const d = rand(0, r * 0.62 - cr * 0.5)
    const cx = Math.cos(a) * d
    const cy = Math.sin(a) * d
    if (placed.some(([px, py, pr]) => Math.hypot(px - cx, py - cy) < pr + cr + 2)) continue
    placed.push([cx, cy, cr])
    crater(x, cx, cy, cr, pal)
  }
  if (r > 30) {
    // a crack or two running in from the edge
    x.strokeStyle = hexA(pal.dark, 0.6)
    x.lineWidth = 1.4
    x.lineCap = 'round'
    for (let k = 0; k < (r > 60 ? 2 : 1); k++) {
      let [px, py] = pts[(Math.random() * pts.length) | 0]
      let a = Math.atan2(-py, -px)
      x.beginPath()
      x.moveTo(px, py)
      for (let s = 0; s < 4; s++) {
        a += rand(-0.6, 0.6)
        px += Math.cos(a) * r * 0.16
        py += Math.sin(a) * r * 0.16
        x.lineTo(px, py)
      }
      x.stroke()
    }
  }
  if (kind === 'core' || kind === 'hot') veins(x, r, kind === 'core' ? CORE : '#ff7a2e')
  x.restore()

  x.lineWidth = Math.max(1.6, r * 0.05)
  x.strokeStyle = pal.dark
  x.stroke(path)

  let col = null
  if (kind === 'crystal') {
    // clusters of gems growing out of the rim, and one out of the face
    col = CRYSTAL[variant % CRYSTAL.length]
    const n = r > 40 ? 4 : 3
    const start = (Math.random() * pts.length) | 0
    for (let k = 0; k < n; k++) {
      const [px, py] = pts[(start + Math.round((k * pts.length) / n)) % pts.length]
      const a = Math.atan2(py, px)
      const base = Math.hypot(px, py) * 0.62
      for (const [da, l] of [[-0.42, 0.62], [0.38, 0.7], [0, 1]]) gem(x, a + da, base, r * 0.46 * l, r * 0.15, col)
    }
    gem(x, rand(0, TAU), r * 0.02, r * 0.3, r * 0.13, col)
  }
  return { canvas: c, R, path, r, pts, col }
}

function crater(x, cx, cy, cr, pal) {
  // a lighter raised rim, then the bowl with its near wall in shadow
  x.fillStyle = hexA(pal.light, 0.4)
  x.beginPath()
  x.ellipse(cx - cr * 0.08, cy - cr * 0.1, cr * 1.14, cr * 1.06, 0, 0, TAU)
  x.fill()
  x.fillStyle = pal.crater
  x.beginPath()
  x.ellipse(cx, cy, cr, cr * 0.92, 0, 0, TAU)
  x.fill()
  x.save()
  x.clip()
  x.fillStyle = hexA(pal.dark, 0.55)
  x.beginPath()
  x.ellipse(cx - cr * 0.32, cy - cr * 0.34, cr, cr * 0.92, 0, 0, TAU)
  x.fill()
  x.restore()
}

// Glowing cracks: a core rock leaks light, a hot rock is about to burst.
function veins(x, r, col) {
  x.lineCap = 'round'
  x.lineJoin = 'round'
  const lines = []
  for (let k = 0; k < 5; k++) {
    let a = (k / 5) * TAU + rand(-0.4, 0.4)
    let px = Math.cos(a) * r * 0.12
    let py = Math.sin(a) * r * 0.12
    const line = [[px, py]]
    for (let s = 0; s < 4; s++) {
      a += rand(-0.5, 0.5)
      px += Math.cos(a) * r * 0.24
      py += Math.sin(a) * r * 0.24
      line.push([px, py])
    }
    lines.push(line)
  }
  for (const [w, style] of [[r * 0.22, hexA(col, 0.28)], [r * 0.1, col], [r * 0.035, '#ffffff']]) {
    x.strokeStyle = style
    x.lineWidth = w
    for (const line of lines) {
      x.beginPath()
      for (const [px, py] of line) x.lineTo(px, py)
      x.stroke()
    }
  }
  const g = x.createRadialGradient(0, 0, 0, 0, 0, r * 0.4)
  g.addColorStop(0, '#ffffff')
  g.addColorStop(0.4, col)
  g.addColorStop(1, hexA(col, 0))
  x.fillStyle = g
  x.beginPath()
  x.arc(0, 0, r * 0.4, 0, TAU)
  x.fill()
}

// One gem: a six-sided crystal seen side-on, its base buried in the rock,
// with a lit face and a shadowed face so it reads as a solid prism.
function gem(x, a, base, len, w, col) {
  const tip = base + len
  const sh = base + len - w * 1.1 // where the point starts
  x.save()
  x.rotate(a)
  x.lineJoin = 'round'
  x.fillStyle = darken(col, 0.62)
  x.beginPath()
  x.moveTo(base, -w)
  x.lineTo(sh, -w)
  x.lineTo(tip, 0)
  x.lineTo(sh, w)
  x.lineTo(base, w)
  x.closePath()
  x.fill()
  x.fillStyle = col
  x.beginPath()
  x.moveTo(base, -w)
  x.lineTo(sh, -w)
  x.lineTo(tip, 0)
  x.lineTo(base, 0)
  x.closePath()
  x.fill()
  x.fillStyle = mixWhite(col, 0.55)
  x.beginPath()
  x.moveTo(base, -w)
  x.lineTo(sh, -w)
  x.lineTo(tip, 0)
  x.lineTo(sh, -w * 0.45)
  x.lineTo(base, -w * 0.45)
  x.closePath()
  x.fill()
  x.strokeStyle = darken(col, 0.35)
  x.lineWidth = 1.2
  x.beginPath()
  x.moveTo(base, -w)
  x.lineTo(sh, -w)
  x.lineTo(tip, 0)
  x.lineTo(sh, w)
  x.lineTo(base, w)
  x.stroke()
  x.fillStyle = '#ffffff'
  x.beginPath()
  x.arc(sh - w * 0.2, -w * 0.62, Math.max(0.8, w * 0.16), 0, TAU)
  x.fill()
  x.restore()
}

function darken(hex, k = 0.45) {
  const n = parseInt(hex.slice(1), 16)
  const f = (v) => Math.round(v * k)
  return `rgb(${f((n >> 16) & 255)},${f((n >> 8) & 255)},${f(n & 255)})`
}

function mixWhite(hex, k) {
  const n = parseInt(hex.slice(1), 16)
  const f = (v) => Math.round(v + (255 - v) * k)
  return `rgb(${f((n >> 16) & 255)},${f((n >> 8) & 255)},${f(n & 255)})`
}

// Soft round glows, one per colour, stamped behind crystals and cores.
const halos = new Map()
export function halo(col) {
  let c = halos.get(col)
  if (!c) {
    c = document.createElement('canvas')
    c.width = c.height = 128
    const x = c.getContext('2d')
    const g = x.createRadialGradient(64, 64, 0, 64, 64, 64)
    g.addColorStop(0, hexA(col, 0.75))
    g.addColorStop(0.35, hexA(col, 0.32))
    g.addColorStop(1, hexA(col, 0))
    x.fillStyle = g
    x.fillRect(0, 0, 128, 128)
    halos.set(col, c)
  }
  return c
}

export function drawHalo(ctx, x, y, r, col, a = 1) {
  ctx.globalAlpha = a
  ctx.drawImage(halo(col), x - r, y - r, r * 2, r * 2)
  ctx.globalAlpha = 1
}

// ---------------------------------------------------------------- drawing

// Draw one rock: `o` needs x, y, rot, k (scale) and spr; flash is optional.
export function drawRock(ctx, o) {
  const s = o.spr
  const r = s.r
  ctx.save()
  ctx.translate(o.x, o.y)
  ctx.scale(o.k, o.k)
  ctx.rotate(o.rot)
  ctx.drawImage(s.canvas, -s.R, -s.R, s.R * 2, s.R * 2)
  // the sun is up and to the left in world space; turn it into the rock's frame
  const cs = Math.cos(o.rot)
  const sn = Math.sin(o.rot)
  const lx = -0.42 * r
  const ly = -0.5 * r
  const gx = lx * cs + ly * sn
  const gy = -lx * sn + ly * cs
  const g = ctx.createRadialGradient(gx, gy, r * 0.05, gx, gy, r * 1.9)
  g.addColorStop(0, 'rgba(255,255,255,0.32)')
  g.addColorStop(0.3, 'rgba(255,255,255,0)')
  g.addColorStop(0.55, 'rgba(12,6,34,0.05)')
  g.addColorStop(1, 'rgba(12,6,34,0.72)')
  ctx.fillStyle = g
  ctx.fill(s.path)
  if (o.flash > 0) {
    ctx.fillStyle = `rgba(255,255,255,${Math.min(1, o.flash) * 0.55})`
    ctx.fill(s.path)
  }
  ctx.restore()
}

// ---------------------------------------------------------------- the enemy types

const pickPal = () => (Math.random() * PALS.length) | 0

export const typeOf = (size, kind) => (kind === 'crystal' ? 'belt-crystal' : kind === 'core' ? 'belt-core-rock' : `belt-rock-${size}`)

// Add a rock to the field. `o` can set anything on it: velocity (vx, vy),
// palette, scale k, a `trail` for meteors, `grav` for rocks tossed upward, a
// `hot` fuse for rocks that burst into pebbles.
export function spawnRock(g, size, x, y, o = {}) {
  const S = SIZES[size]
  const kind = o.kind ?? 'plain'
  const pal = o.pal ?? pickPal()
  const k = o.k ?? rand(0.9, 1.1)
  return g.spawn(typeOf(size, kind), x, y, {
    size,
    kind,
    pal,
    k,
    r: S.r * k,
    spr: rockSprite(size, pal, kind),
    rot: rand(0, TAU),
    spin: rand(-1, 1) * S.spin,
    vx: 0,
    vy: S.speed,
    ...o,
  })
}

// Rocks from somewhere else (a g.spawn with no fields) still get a body.
function ensureBody(e, size, kind) {
  if (e.spr) return
  e.size = size
  e.kind = kind
  e.pal = pickPal()
  e.k = e.k ?? 1
  e.spr = rockSprite(size, e.pal, kind)
  e.rot = rand(0, TAU)
  e.spin = rand(-1, 1) * SIZES[size].spin
  e.vx = e.vx ?? 0
  e.vy = e.vy ?? SIZES[size].speed
}

export function moveRock(e, dt, g) {
  if (e.grav) e.vy = Math.min(e.vmax ?? 160, e.vy + e.grav * dt)
  // pieces flung sideways ease back into the drift
  if (e.damp) e.vx *= Math.max(0, 1 - e.damp * dt)
  e.x += e.vx * dt
  e.y += e.vy * dt
  e.spin = Math.max(-2.5, Math.min(2.5, e.spin))
  e.rot += e.spin * dt
  // bounce softly off the sides so the field doesn't leak away
  const m = e.r * 0.6
  if (e.x < m && e.vx < 0) e.vx = -e.vx * 0.6
  if (e.x > g.W - m && e.vx > 0) e.vx = -e.vx * 0.6
}

// A meteor's tail: a tapered flame streaming back from the rock.
function drawTrail(ctx, e, t) {
  const sp = Math.hypot(e.vx, e.vy) || 1
  const ux = e.vx / sp
  const uy = e.vy / sp
  const len = e.r * 6.5
  const w = e.r * (0.9 + 0.12 * Math.sin(t * 40 + e.seed))
  const tx = e.x - ux * len
  const ty = e.y - uy * len
  ctx.globalCompositeOperation = 'lighter'
  drawHalo(ctx, e.x, e.y, e.r * 2.6, '#ff7a3a', 0.85)
  for (const [k, c0, c1] of [[1, 'rgba(255,140,60,0.7)', 'rgba(255,60,40,0)'], [0.45, 'rgba(255,240,190,0.9)', 'rgba(255,170,80,0)']]) {
    const g = ctx.createLinearGradient(e.x, e.y, tx, ty)
    g.addColorStop(0, c0)
    g.addColorStop(1, c1)
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.moveTo(e.x - uy * w * k, e.y + ux * w * k)
    ctx.lineTo(e.x - ux * len * k, e.y - uy * len * k)
    ctx.lineTo(e.x + uy * w * k, e.y - ux * w * k)
    ctx.closePath()
    ctx.fill()
  }
  ctx.globalCompositeOperation = 'source-over'
}

function drawRockEnemy(e, g, ctx) {
  if (e.trail) drawTrail(ctx, e, g.time)
  if (e.hot != null) {
    // a hot rock glows faster and faster as its fuse runs out
    const k = Math.max(0, e.hot)
    const pulse = 0.55 + 0.45 * Math.sin(g.time * (10 + 18 / (k + 0.3)))
    ctx.globalCompositeOperation = 'lighter'
    drawHalo(ctx, e.x, e.y, e.r * 2.1, '#ff6a2e', pulse)
    ctx.globalCompositeOperation = 'source-over'
  }
  drawRock(ctx, e)
}

// A rock is done: knock out a few chunks and, if it's big enough, two
// smaller rocks that fly apart from where it was.
function splitRock(e, g) {
  const S = SIZES[e.size]
  burstDebris(e.x, e.y, e.r, e.pal, S.chunks, e.vx, e.vy)
  if (!S.next) return
  const sp = Math.max(60, Math.hypot(e.vx, e.vy))
  const dir = Math.atan2(e.vy, e.vx)
  for (const d of [-1, 1]) {
    const a = dir + d * rand(0.45, 0.8)
    spawnRock(g, S.next, e.x + d * e.r * 0.35, e.y + rand(-4, 4), {
      pal: e.pal,
      vx: Math.cos(a) * sp * rand(0.95, 1.2),
      vy: Math.max(40, Math.sin(a) * sp * rand(0.95, 1.2)),
      damp: 0.5,
      entered: e.entered,
      flash: 0.6,
    })
  }
}

function burstHot(e, g) {
  // a hot rock that wasn't shot in time pops into a fan of glowing pebbles
  e.gone = true
  burstDebris(e.x, e.y, e.r, e.pal, 8, e.vx, e.vy)
  g.explode(e.x, e.y, '#ff7a2e', 1)
  g.sfx.pop(1)
  const tg = g.nearestPlayer(e.x, e.y)
  const a = tg ? Math.atan2(tg.y - e.y, tg.x - e.x) : Math.PI / 2
  g.fan(e.x, e.y, 5, 1.3, 190, '#ff9a4d', a)
}

function rockDef(size) {
  const S = SIZES[size]
  return {
    hp: S.hp,
    r: S.r,
    score: S.score,
    light: '#ffd7a0',
    boom: S.boom,
    drop: S.drop,
    update(e, dt, g) {
      ensureBody(e, size, 'plain')
      moveRock(e, dt, g)
      if (e.hot != null && (e.hot -= dt) <= 0) burstHot(e, g)
    },
    draw: drawRockEnemy,
    onDeath: (e, g) => splitRock(e, g),
  }
}

export const ROCK_ENEMIES = {
  'belt-rock-giant': rockDef('giant'),
  'belt-rock-big': rockDef('big'),
  'belt-rock-mid': rockDef('mid'),
  'belt-rock-small': rockDef('small'),
  // a glittering rock that usually leaves a power-up bubble behind
  'belt-crystal': {
    hp: 3,
    r: 36,
    score: 250,
    light: '#ff9be6',
    boom: 0.8,
    drop: 0.85,
    update(e, dt, g) {
      ensureBody(e, 'mid', 'crystal')
      moveRock(e, dt, g)
      if (Math.random() < dt * 4) g.sparks(e.x + rand(-e.r, e.r), e.y + rand(-e.r, e.r), '#ffffff', 1)
    },
    draw(e, g, ctx) {
      ctx.globalCompositeOperation = 'lighter'
      drawHalo(ctx, e.x, e.y, e.r * 2.4, e.spr.col ?? CRYSTAL[0], 0.5 + 0.2 * Math.sin(g.time * 4 + e.seed))
      ctx.globalCompositeOperation = 'source-over'
      drawRock(ctx, e)
    },
    onDeath(e, g) {
      burstDebris(e.x, e.y, e.r, e.pal, 6, e.vx, e.vy)
      for (const col of CRYSTAL) g.sparks(e.x, e.y, col, 6)
    },
  },
}

// ---------------------------------------------------------------- debris

// Chunks knocked off a rock: a few small tumbling polygons in its colours.
const CHUNKS = [0, 1, 2, 3].map(() => {
  const p = new Path2D()
  const n = 5 + ((Math.random() * 2) | 0)
  for (let i = 0; i < n; i++) {
    const a = ((i + rand(-0.25, 0.25)) / n) * TAU
    const rr = rand(0.6, 1)
    p.lineTo(Math.cos(a) * rr, Math.sin(a) * rr)
  }
  p.closePath()
  return p
})

const debris = []

export function burstDebris(x, y, r, pal = 0, n = 6, vx = 0, vy = 0) {
  const P = PALS[pal] ?? PALS[0]
  for (let i = 0; i < n; i++) {
    const a = rand(0, TAU)
    const sp = rand(50, 190) * (0.7 + r / 90)
    const life = rand(0.5, 0.95)
    debris.push({
      x: x + Math.cos(a) * r * 0.4,
      y: y + Math.sin(a) * r * 0.4,
      vx: Math.cos(a) * sp + vx * 0.5,
      vy: Math.sin(a) * sp + vy * 0.5,
      rot: rand(0, TAU),
      spin: rand(-7, 7),
      s: r * rand(0.1, 0.22),
      life,
      max: life,
      shape: CHUNKS[i % CHUNKS.length],
      fill: Math.random() < 0.5 ? P.base : P.crater,
      edge: P.dark,
    })
  }
  if (debris.length > 220) debris.splice(0, debris.length - 220)
}

export function updateDebris(dt) {
  let j = 0
  for (const d of debris) {
    d.life -= dt
    if (d.life <= 0) continue
    const k = Math.max(0, 1 - 1.6 * dt)
    d.vx *= k
    d.vy *= k
    d.x += d.vx * dt
    d.y += d.vy * dt
    d.rot += d.spin * dt
    debris[j++] = d
  }
  debris.length = j
}

export function clearDebris() {
  debris.length = 0
}

export function drawDebris(ctx) {
  for (const d of debris) {
    ctx.globalAlpha = Math.min(1, (d.life / d.max) * 2)
    ctx.save()
    ctx.translate(d.x, d.y)
    ctx.rotate(d.rot)
    ctx.scale(d.s, d.s)
    ctx.fillStyle = d.fill
    ctx.fill(d.shape)
    ctx.lineWidth = 1.5 / d.s
    ctx.strokeStyle = d.edge
    ctx.stroke(d.shape)
    ctx.restore()
  }
  ctx.globalAlpha = 1
}
