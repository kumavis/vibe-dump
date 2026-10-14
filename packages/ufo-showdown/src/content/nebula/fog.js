// The nebula fog: a thick, slowly swirling cloud over the whole field, with
// clear pools of light wherever something shines.
//
// It covers the full screen every frame, so it's built small. A dark base and
// a few dozen baked cloud sprites make the cloud layer, at a seventh of world
// resolution. The clouds drift a few units a second, so that layer is only
// repainted about twenty times a second. Each frame scales it onto a canvas
// at a quarter resolution, cuts the pools out with destination-out (they need
// the finer grain), and puts the result on screen in one scaled-up drawImage.
// The upscale's smoothing is what makes it soft: fog has no hard edges to
// lose. Measured under headless SwiftShader, that one full-screen blit is
// most of what the fog costs.
//
// A light is { x, y, r, a = 1, rim? }: `r` is the pool's radius in world
// units, `a` how much it clears, `rim` a colour the fog glows at its edge.

import { hexA } from '../../stars.js'

const TAU = Math.PI * 2
const FS = 0.25 // fog pixels per world unit, where the pools are cut
const CS = 1 / 7 // …and for the cloud layer, which is all soft blur anyway
const M = 32 // margin round the field, so the screen shake never shows an edge
const REPAINT = 1 / 20 // seconds between repaints of the cloud layer

// Wisps are added with 'lighter', so these are the colours the fog glows.
const WISPS = ['#ff4fb0', '#38b6ff', '#8f5cff', '#2fe0c0', '#ff5fd2', '#5a7dff']

let cv = null // what goes on screen: the clouds with the pools cut out
let fx = null
let clv = null // the cloud layer, repainted now and then
let clx = null
let paintedAt = -1
let bw = 0
let bh = 0
let base = null
let clouds = []
let sprites = null
let pool = null
const rims = new Map()

// A small seeded random, so the fog has the same shape every time it rolls in.
function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function canvasOf(w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

// One cloud: a string of soft blobs along a lazy S-curve, thickest in the
// middle, so turned and stacked they read as streamers rather than balls.
function bakeWisp(color, rnd) {
  const s = 128
  const c = canvasOf(s, s)
  const x = c.getContext('2d')
  const bend = rnd() * TAU
  const n = 9
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1) - 0.5
    const px = s / 2 + u * s * 0.6
    const py = s / 2 + Math.sin(u * 5 + bend) * s * 0.09 + (rnd() - 0.5) * s * 0.06
    const r = s * (0.1 + rnd() * 0.1) * (1.25 - Math.abs(u) * 1.3)
    const g = x.createRadialGradient(px, py, 0, px, py, r)
    g.addColorStop(0, hexA(color, 0.3))
    g.addColorStop(0.45, hexA(color, 0.15))
    g.addColorStop(1, hexA(color, 0))
    x.fillStyle = g
    x.fillRect(0, 0, s, s)
  }
  // a brighter heart, so the cloud has somewhere to glow from
  const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s * 0.2)
  g.addColorStop(0, hexA(color, 0.22))
  g.addColorStop(1, hexA(color, 0))
  x.fillStyle = g
  x.fillRect(0, 0, s, s)
  return c
}

// Darker drifts cut into the glow (painted normally, not added), which is
// what gives the fog depth instead of an even haze.
function bakeShade(rnd) {
  const s = 128
  const c = canvasOf(s, s)
  const x = c.getContext('2d')
  for (let i = 0; i < 6; i++) {
    const px = s / 2 + (rnd() - 0.5) * s * 0.4
    const py = s / 2 + (rnd() - 0.5) * s * 0.2
    const r = s * (0.16 + rnd() * 0.12)
    const g = x.createRadialGradient(px, py, 0, px, py, r)
    g.addColorStop(0, 'rgba(8,4,26,0.4)')
    g.addColorStop(1, 'rgba(8,4,26,0)')
    x.fillStyle = g
    x.fillRect(0, 0, s, s)
  }
  return c
}

function bakeSprites() {
  const rnd = rng(1337)
  sprites = { wisps: [], shades: [] }
  for (let i = 0; i < WISPS.length * 2; i++) sprites.wisps.push(bakeWisp(WISPS[i % WISPS.length], rnd))
  for (let i = 0; i < 3; i++) sprites.shades.push(bakeShade(rnd))

  // what a light cuts out: fully clear in the middle, easing off to the edge
  const s = 128
  pool = canvasOf(s, s)
  const x = pool.getContext('2d')
  const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  g.addColorStop(0, 'rgba(0,0,0,1)')
  g.addColorStop(0.42, 'rgba(0,0,0,1)')
  g.addColorStop(0.6, 'rgba(0,0,0,0.8)')
  g.addColorStop(0.78, 'rgba(0,0,0,0.38)')
  g.addColorStop(0.9, 'rgba(0,0,0,0.12)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  x.fillStyle = g
  x.fillRect(0, 0, s, s)
}

// The fog lit up round the edge of a pool, in the colour of what's shining.
function rimSprite(color) {
  let c = rims.get(color)
  if (!c) {
    const s = 128
    c = canvasOf(s, s)
    const x = c.getContext('2d')
    const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
    g.addColorStop(0, hexA(color, 0))
    g.addColorStop(0.55, hexA(color, 0.1))
    g.addColorStop(0.75, hexA(color, 0.32))
    g.addColorStop(1, hexA(color, 0))
    x.fillStyle = g
    x.fillRect(0, 0, s, s)
    rims.set(color, c)
  }
  return c
}

function build(W, H) {
  if (!sprites) bakeSprites()
  bw = W
  bh = H
  cv = canvasOf(Math.ceil((W + 2 * M) * FS), Math.ceil((H + 2 * M) * FS))
  fx = cv.getContext('2d')
  clv = canvasOf(Math.ceil((W + 2 * M) * CS), Math.ceil((H + 2 * M) * CS))
  clx = clv.getContext('2d')
  paintedAt = -1
  // the fog is thickest up where the saucers lurk and thins a touch toward
  // the ships, so the bottom of the screen never feels like a wall
  base = clx.createLinearGradient(0, 0, 0, H)
  base.addColorStop(0, 'rgba(24,12,58,0.95)')
  base.addColorStop(0.45, 'rgba(28,14,66,0.92)')
  base.addColorStop(1, 'rgba(14,20,56,0.86)')

  const rnd = rng(42)
  const n = Math.round((W * H) / 30000)
  clouds = []
  for (let i = 0; i < n; i++) {
    clouds.push({
      img: sprites.wisps[i % sprites.wisps.length],
      u: rnd(),
      v: rnd(),
      size: 380 + rnd() * 380,
      orbit: 30 + rnd() * 80,
      spin: (rnd() < 0.5 ? -1 : 1) * (0.05 + rnd() * 0.07),
      ph: rnd() * TAU,
      rot: rnd() * TAU,
      rotSp: (rnd() - 0.5) * 0.09,
      fall: 5 + rnd() * 9,
      a: 0.6 + rnd() * 0.3,
    })
  }
  for (let i = 0; i < Math.round(n / 4); i++) {
    clouds.push({
      img: sprites.shades[i % sprites.shades.length],
      shade: true,
      u: rnd(),
      v: rnd(),
      size: 420 + rnd() * 300,
      orbit: 20 + rnd() * 50,
      spin: (rnd() < 0.5 ? -1 : 1) * (0.04 + rnd() * 0.05),
      ph: rnd() * TAU,
      rot: rnd() * TAU,
      rotSp: (rnd() - 0.5) * 0.06,
      fall: 4 + rnd() * 6,
      a: 1,
    })
  }
  // shades first, so the glowing wisps sit on top of the dark lanes
  clouds.sort((a, b) => (b.shade ? 1 : 0) - (a.shade ? 1 : 0))
}

const wrap = (v, m) => ((v % m) + m) % m

// The cloud layer at time t: the clouds turn slowly round their own spots
// while the whole nebula drifts down past the ships, the way the stars do.
function paintClouds(W, H, t) {
  clx.setTransform(1, 0, 0, 1, 0, 0)
  clx.globalCompositeOperation = 'source-over'
  clx.globalAlpha = 1
  clx.clearRect(0, 0, clv.width, clv.height)
  clx.setTransform(CS, 0, 0, CS, M * CS, M * CS)
  clx.fillStyle = base
  clx.fillRect(-M, -M, W + 2 * M, H + 2 * M)
  for (const c of clouds) {
    const span = H + c.size
    const x = c.u * W + Math.cos(t * c.spin + c.ph) * c.orbit
    const y = wrap(c.v * span + t * c.fall + Math.sin(t * c.spin + c.ph) * c.orbit * 0.6, span) - c.size / 2
    const a = c.rot + t * c.rotSp
    const cos = Math.cos(a) * CS
    const sin = Math.sin(a) * CS
    clx.globalCompositeOperation = c.shade ? 'source-over' : 'lighter'
    clx.globalAlpha = c.a
    clx.setTransform(cos, sin, -sin, cos, (x + M) * CS, (y + M) * CS)
    clx.drawImage(c.img, -c.size / 2, -c.size / 2, c.size, c.size)
  }
  clx.globalCompositeOperation = 'source-over'
  clx.globalAlpha = 1
}

export function drawFog(ctx, g, lights, amount = 1) {
  if (amount <= 0.002) return
  const W = g.W
  const H = g.H
  if (!cv || W !== bw || H !== bh) build(W, H)
  const t = g.time
  if (paintedAt < 0 || Math.abs(t - paintedAt) >= REPAINT) {
    paintClouds(W, H, t)
    paintedAt = t
  }

  fx.setTransform(1, 0, 0, 1, 0, 0)
  fx.globalCompositeOperation = 'copy'
  fx.globalAlpha = 1
  fx.drawImage(clv, 0, 0, clv.width, clv.height, 0, 0, (clv.width / CS) * FS, (clv.height / CS) * FS)

  fx.setTransform(FS, 0, 0, FS, M * FS, M * FS)
  fx.globalCompositeOperation = 'lighter'
  for (const L of lights) {
    if (!L.rim) continue
    const R = L.r * 1.12
    fx.globalAlpha = Math.min(1, L.a ?? 1)
    fx.drawImage(rimSprite(L.rim), L.x - R, L.y - R, R * 2, R * 2)
  }
  fx.globalCompositeOperation = 'destination-out'
  for (const L of lights) {
    fx.globalAlpha = Math.min(1, L.a ?? 1)
    fx.drawImage(pool, L.x - L.r, L.y - L.r, L.r * 2, L.r * 2)
  }
  fx.globalCompositeOperation = 'source-over'
  fx.globalAlpha = 1

  ctx.save()
  ctx.globalAlpha = Math.min(1, amount)
  ctx.drawImage(cv, 0, 0, cv.width, cv.height, -M, -M, cv.width / FS, cv.height / FS)
  ctx.restore()
}

// How clear the fog is at (x, y), 0 (thick) to 1 (open space): the same
// falloff the pool sprite cuts, so hints can fade out where you can see.
export function clearAt(x, y, lights) {
  let best = 0
  for (const L of lights) {
    const d = Math.hypot(x - L.x, y - L.y) / L.r
    if (d >= 1) continue
    const k = d < 0.42 ? 1 : 1 - (d - 0.42) / 0.58
    best = Math.max(best, k * Math.min(1, L.a ?? 1))
  }
  return best
}
