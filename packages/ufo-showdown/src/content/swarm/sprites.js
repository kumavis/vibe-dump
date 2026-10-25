// The swarm's art. A horde of a hundred and seventy bugs is only affordable if
// each one is a single drawImage, so every look a bug can have (its palette,
// how far it leans and where its wings are in the beat) is painted once into a
// little canvas and stamped from then on. Same rules as ../../art.js: plain
// canvas paths, centred on the bug, no image files.

import { hexA } from '../../stars.js'

const TAU = Math.PI * 2
const RES = 2 // painted at 2x so they stay crisp on a DPR 2 screen

// Each flock flies in one colour, so a screen full of bugs still reads as a
// handful of groups rather than confetti.
export const PALS = [
  { hull: ['#f2ffd9', '#8be05a', '#2f6b1f'], light: '#eaff6b', wing: '#d8ffe0', eye: '#ff5fb8' }, // lime
  { hull: ['#ffe3f4', '#ff5fb8', '#7a1550'], light: '#ffd0f0', wing: '#ffe0f4', eye: '#7dff5a' }, // pink
  { hull: ['#fff3c9', '#ffb02e', '#7a4300'], light: '#ffe23d', wing: '#fff3c4', eye: '#38d6ff' }, // amber
  { hull: ['#e0fbff', '#38d6ff', '#0f4f7a'], light: '#b8f6ff', wing: '#dcf9ff', eye: '#ffb02e' }, // cyan
  { hull: ['#f1e6ff', '#a27bff', '#4b2a99'], light: '#ff9be6', wing: '#ece2ff', eye: '#ffe23d' }, // violet
]
export const LIME = 0
export const PINK = 1
export const AMBER = 2
export const CYAN = 3
export const VIOLET = 4

const SPIT = { hull: ['#ffe0d8', '#ff5a4f', '#7d1622'], light: '#ffe23d', wing: '#ffe6de', eye: '#ffe23d' }
const BEETLE = { shell: ['#b6fff4', '#2fc7b4', '#1d3f8f', '#170c45'], hull: ['#f3e8ff', '#9b7bff', '#3a2380'], light: '#ffe23d', wing: '#e0fff8', eye: '#ff3b6b' }

// A bug leans into a turn: five baked leans, picked by the nearest.
export const TILTS = [-0.32, -0.16, 0, 0.16, 0.32]
export const tiltIndex = (t) => (t < -0.24 ? 0 : t < -0.08 ? 1 : t < 0.08 ? 2 : t < 0.24 ? 3 : 4)

// The wing beat: up, level, down, level.
const FLAP = [0, 1, 2, 1]
export const FRAMES = FLAP.length

// ---------------------------------------------------------------- the cache

const BOX = { swarmlet: 22, spitter: 25, beetle: 58 }
const PAINT = { swarmlet: paintSwarmlet, spitter: paintSpitter, beetle: paintBeetle }
const cache = { swarmlet: [], spitter: [], beetle: [] }

// The sprite for one look. Nested arrays rather than string keys: this runs
// for every bug every frame.
export function bugSprite(kind, pal, tilt, frame) {
  const a = (cache[kind][pal] ??= [])
  const b = (a[tilt] ??= [])
  return (b[frame] ??= bake(kind, pal, tilt, frame))
}

// The same bug in solid white, for the flash when a tougher one takes a hit.
export function whiteOf(spr) {
  if (spr.white) return spr.white
  const c = document.createElement('canvas')
  c.width = spr.width
  c.height = spr.height
  const x = c.getContext('2d')
  x.drawImage(spr, 0, 0)
  x.globalCompositeOperation = 'source-in'
  x.fillStyle = '#ffffff'
  x.fillRect(0, 0, c.width, c.height)
  c.box = spr.box
  spr.white = c
  return c
}

function bake(kind, pal, tilt, frame) {
  const box = BOX[kind]
  const c = document.createElement('canvas')
  c.width = c.height = Math.ceil(box * 2 * RES)
  c.box = box
  const x = c.getContext('2d')
  x.scale(RES, RES)
  x.translate(box, box)
  x.rotate(TILTS[tilt])
  PAINT[kind](x, kind === 'swarmlet' ? PALS[pal] : kind === 'spitter' ? SPIT : BEETLE, FLAP[frame], frame)
  return c
}

// Every sprite the level will use, so they can be painted a few per frame
// during the intro instead of all at once on the first busy frame.
export function* spriteList() {
  for (let f = 0; f < FRAMES; f++) {
    for (let p = 0; p < PALS.length; p++) yield ['swarmlet', p, 2, f]
  }
  for (let t = 0; t < TILTS.length; t++) {
    for (let f = 0; f < FRAMES; f++) {
      for (let p = 0; p < PALS.length; p++) if (t !== 2) yield ['swarmlet', p, t, f]
      yield ['spitter', 0, t, f]
      yield ['beetle', 0, t, f]
    }
  }
}

export function stampBug(ctx, spr, x, y) {
  const b = spr.box
  ctx.drawImage(spr, x - b, y - b, b * 2, b * 2)
}

// ---------------------------------------------------------------- glows

// A soft round glow per colour, stamped at any size. Telegraphs (a spitter
// winding up, a flock about to dive) are made of these, added with 'lighter'.
const glows = new Map()
function glowSprite(color) {
  let c = glows.get(color)
  if (!c) {
    const s = 64
    c = document.createElement('canvas')
    c.width = c.height = s
    const x = c.getContext('2d')
    const grad = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
    grad.addColorStop(0, '#ffffff')
    grad.addColorStop(0.15, hexA(color, 0.95))
    grad.addColorStop(0.5, hexA(color, 0.3))
    grad.addColorStop(1, hexA(color, 0))
    x.fillStyle = grad
    x.fillRect(0, 0, s, s)
    glows.set(color, c)
  }
  return c
}

export function stampGlow(ctx, color, x, y, r, a = 1) {
  if (a <= 0.01 || r <= 0.5) return
  ctx.globalAlpha = Math.min(1, a)
  ctx.drawImage(glowSprite(color), x - r, y - r, r * 2, r * 2)
  ctx.globalAlpha = 1
}

// ---------------------------------------------------------------- the swarmlet

// A bug-saucer no bigger than a ship's wingtip: a little disc with a glass
// head full of big compound eyes, two buzzing wings, antennae and a stinger.
function paintSwarmlet(x, P, flap, frame, r = 13) {
  // the tractor glow underneath
  const gg = x.createRadialGradient(0, r * 0.38, 0, 0, r * 0.38, r)
  gg.addColorStop(0, hexA(P.light, 0.42))
  gg.addColorStop(1, hexA(P.light, 0))
  x.fillStyle = gg
  x.beginPath()
  x.ellipse(0, r * 0.42, r, r * 0.5, 0, 0, TAU)
  x.fill()

  wings(x, P, flap, r)

  // antennae
  x.strokeStyle = P.hull[2]
  x.lineWidth = 1.2
  x.lineCap = 'round'
  for (const d of [-1, 1]) {
    x.beginPath()
    x.moveTo(d * r * 0.16, -r * 0.62)
    x.quadraticCurveTo(d * r * 0.2, -r * 1.05, d * r * 0.5, -r * 1.15)
    x.stroke()
  }
  x.fillStyle = P.light
  for (const d of [-1, 1]) {
    x.beginPath()
    x.arc(d * r * 0.5, -r * 1.15, 1.6, 0, TAU)
    x.fill()
  }

  head(x, P, r)
  disc(x, P, r, frame, 3)

  // the stinger
  x.fillStyle = P.hull[2]
  x.beginPath()
  x.moveTo(-r * 0.16, r * 0.3)
  x.lineTo(r * 0.16, r * 0.3)
  x.lineTo(0, r * 0.68)
  x.closePath()
  x.fill()
}

// The spitter is a bigger, redder swarmlet with a proper gun of a stinger
// and a scowl. It's the only small bug that shoots.
function paintSpitter(x, P, flap, frame) {
  const r = 15
  paintSwarmlet(x, P, flap, frame, r)
  x.fillStyle = '#3a0c14'
  x.beginPath()
  x.roundRect(-r * 0.17, r * 0.25, r * 0.34, r * 0.5, 2)
  x.fill()
  x.fillStyle = P.light
  x.beginPath()
  x.arc(0, r * 0.74, 2.2, 0, TAU)
  x.fill()
  // brows over the eyes
  x.strokeStyle = '#3a0c14'
  x.lineWidth = 1.6
  for (const d of [-1, 1]) {
    x.beginPath()
    x.moveTo(d * r * 0.42, -r * 0.62)
    x.lineTo(d * r * 0.08, -r * 0.44)
    x.stroke()
  }
}

function wings(x, P, flap, r) {
  const lift = [-0.95, -0.42, 0.12][flap]
  for (const d of [-1, 1]) {
    x.save()
    x.translate(d * r * 0.26, -r * 0.36)
    x.scale(d, 1)
    x.rotate(lift)
    x.fillStyle = hexA(P.wing, 0.5)
    x.strokeStyle = 'rgba(255,255,255,0.8)'
    x.lineWidth = 0.9
    x.beginPath()
    x.ellipse(r * 0.56, 0, r * 0.62, r * 0.26, 0, 0, TAU)
    x.fill()
    x.stroke()
    x.strokeStyle = hexA(P.hull[2], 0.45)
    x.beginPath()
    x.moveTo(r * 0.06, 0)
    x.lineTo(r * 1.05, -r * 0.04)
    x.stroke()
    x.restore()
  }
}

// The glass head: two huge compound eyes looking out of a bubble.
function head(x, P, r) {
  const dr = r * 0.56
  const dy = -r * 0.12
  x.fillStyle = hexA(P.wing, 0.3)
  x.beginPath()
  x.ellipse(0, dy, dr, dr * 1.05, 0, Math.PI, TAU)
  x.closePath()
  x.fill()
  for (const d of [-1, 1]) {
    const ex = d * dr * 0.42
    const ey = dy - dr * 0.42
    x.fillStyle = P.eye
    x.beginPath()
    x.ellipse(ex, ey, dr * 0.42, dr * 0.48, d * 0.3, 0, TAU)
    x.fill()
    x.fillStyle = hexA('#1a0b2e', 0.35)
    x.beginPath()
    x.ellipse(ex + d * dr * 0.08, ey + dr * 0.1, dr * 0.24, dr * 0.3, d * 0.3, 0, TAU)
    x.fill()
    x.fillStyle = '#ffffff'
    x.beginPath()
    x.arc(ex - dr * 0.12, ey - dr * 0.18, Math.max(1, dr * 0.13), 0, TAU)
    x.fill()
  }
  x.strokeStyle = 'rgba(255,255,255,0.75)'
  x.lineWidth = 1
  x.beginPath()
  x.ellipse(0, dy, dr * 0.82, dr * 0.86, 0, Math.PI * 1.12, Math.PI * 1.4)
  x.stroke()
}

function disc(x, P, r, frame, lights) {
  const hg = x.createLinearGradient(0, -r * 0.3, 0, r * 0.32)
  hg.addColorStop(0, P.hull[0])
  hg.addColorStop(0.5, P.hull[1])
  hg.addColorStop(1, P.hull[2])
  x.fillStyle = hg
  x.beginPath()
  x.ellipse(0, 0, r, r * 0.34, 0, 0, TAU)
  x.fill()
  x.fillStyle = hexA(P.hull[2], 0.55)
  x.beginPath()
  x.ellipse(0, r * 0.07, r * 0.97, r * 0.16, 0, 0, Math.PI)
  x.fill()
  // running lights take turns with the wing beat
  for (let i = 0; i < lights; i++) {
    const u = lights === 1 ? 0 : (i / (lights - 1)) * 2 - 1
    const on = (i + frame) % 2 === 0
    x.fillStyle = on ? P.light : hexA(P.light, 0.3)
    x.beginPath()
    x.arc(u * r * 0.64, r * 0.1 + (1 - u * u) * r * 0.06, Math.max(1.3, r * 0.08), 0, TAU)
    x.fill()
  }
}

// ---------------------------------------------------------------- the beetle

// The brood beetle: a jewel-shelled saucer as big as a regular one, with a
// rhino horn, angry eyes, pincers, and an egg hatch in its belly that it
// drops fresh swarmlets out of.
function paintBeetle(x, B, flap, frame) {
  const r = 32
  const gg = x.createRadialGradient(0, r * 0.4, 0, 0, r * 0.4, r)
  gg.addColorStop(0, hexA(B.light, 0.3))
  gg.addColorStop(1, hexA(B.light, 0))
  x.fillStyle = gg
  x.beginPath()
  x.ellipse(0, r * 0.45, r, r * 0.5, 0, 0, TAU)
  x.fill()

  // long membranous wings, out from under the shell
  const lift = [-0.75, -0.3, 0.15][flap]
  for (const d of [-1, 1]) {
    x.save()
    x.translate(d * r * 0.3, -r * 0.3)
    x.scale(d, 1)
    x.rotate(lift)
    x.fillStyle = hexA(B.wing, 0.42)
    x.strokeStyle = 'rgba(255,255,255,0.75)'
    x.lineWidth = 1.2
    x.beginPath()
    x.ellipse(r * 0.62, 0, r * 0.7, r * 0.22, 0, 0, TAU)
    x.fill()
    x.stroke()
    x.strokeStyle = hexA(B.shell[2], 0.4)
    x.beginPath()
    x.moveTo(r * 0.1, 0)
    x.lineTo(r * 1.2, -r * 0.05)
    x.moveTo(r * 0.5, 0)
    x.lineTo(r * 0.95, r * 0.12)
    x.stroke()
    x.restore()
  }

  // pincers under the disc, pointing at whoever is below
  x.fillStyle = B.shell[3]
  for (const d of [-1, 1]) {
    x.beginPath()
    x.moveTo(d * r * 0.18, r * 0.2)
    x.quadraticCurveTo(d * r * 0.42, r * 0.5, d * r * 0.12, r * 0.72)
    x.quadraticCurveTo(d * r * 0.26, r * 0.48, d * r * 0.05, r * 0.26)
    x.closePath()
    x.fill()
  }

  // the horn, curling up off the top of the shell
  x.fillStyle = '#fff1c2'
  x.strokeStyle = '#7a4300'
  x.lineWidth = 1.2
  x.beginPath()
  x.moveTo(-r * 0.1, -r * 0.6)
  x.quadraticCurveTo(-r * 0.12, -r * 1.05, r * 0.16, -r * 1.3)
  x.quadraticCurveTo(r * 0.04, -r * 1.0, r * 0.12, -r * 0.62)
  x.closePath()
  x.fill()
  x.stroke()

  // the shell: two glossy halves meeting down the middle
  const sh = x.createLinearGradient(-r * 0.7, -r * 0.8, r * 0.5, r * 0.1)
  sh.addColorStop(0, B.shell[0])
  sh.addColorStop(0.35, B.shell[1])
  sh.addColorStop(0.75, B.shell[2])
  sh.addColorStop(1, B.shell[3])
  x.fillStyle = sh
  x.beginPath()
  x.ellipse(0, -r * 0.08, r * 0.74, r * 0.66, 0, Math.PI, TAU)
  x.closePath()
  x.fill()
  x.strokeStyle = B.shell[3]
  x.lineWidth = 1.6
  x.beginPath()
  x.moveTo(0, -r * 0.74)
  x.lineTo(0, -r * 0.1)
  x.stroke()
  x.fillStyle = '#ffe23d'
  for (const [sx, sy, sr] of [[-0.42, -0.36, 0.09], [-0.2, -0.52, 0.07], [0.3, -0.42, 0.08], [0.48, -0.22, 0.06], [-0.55, -0.16, 0.06]]) {
    x.beginPath()
    x.arc(sx * r, sy * r, sr * r, 0, TAU)
    x.fill()
  }
  x.strokeStyle = 'rgba(255,255,255,0.6)'
  x.lineWidth = 2
  x.beginPath()
  x.ellipse(0, -r * 0.08, r * 0.6, r * 0.54, 0, Math.PI * 1.1, Math.PI * 1.36)
  x.stroke()

  // angry eyes low on the shell
  for (const d of [-1, 1]) {
    x.fillStyle = '#1a0b2e'
    x.beginPath()
    x.ellipse(d * r * 0.25, -r * 0.2, r * 0.15, r * 0.12, 0, 0, TAU)
    x.fill()
    x.fillStyle = B.eye
    x.beginPath()
    x.ellipse(d * r * 0.25, -r * 0.18, r * 0.1, r * 0.08, 0, 0, TAU)
    x.fill()
    x.strokeStyle = B.shell[3]
    x.lineWidth = 2.4
    x.beginPath()
    x.moveTo(d * r * 0.44, -r * 0.4)
    x.lineTo(d * r * 0.1, -r * 0.27)
    x.stroke()
  }

  disc(x, { hull: B.hull, light: B.light }, r, frame, 5)

  // the egg hatch in its belly
  x.fillStyle = B.shell[3]
  x.beginPath()
  x.ellipse(0, r * 0.26, r * 0.3, r * 0.1, 0, 0, TAU)
  x.fill()
  x.strokeStyle = hexA(B.light, 0.7)
  x.lineWidth = 1.2
  x.stroke()
}
