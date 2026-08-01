import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Iris textures
//
// Two 512x512 canvases, drawn once at startup: the human-ish gold iris and the
// thing that is wearing it the rest of the time. Both are drawn WITHOUT a pupil
// — the pupil is its own mesh so it can dilate, and so it can squeeze into a
// vertical slit when the alien surfaces without needing a second texture.
//
// A deterministic hash stands in for Math.random so the iris looks the same in
// every screenshot, which matters when a build step photographs the app.
// ---------------------------------------------------------------------------
const SIZE = 512
const C = SIZE / 2

function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

function base(ctx, stops) {
  const g = ctx.createRadialGradient(C, C, SIZE * 0.06, C, C, SIZE * 0.5)
  for (const [t, c] of stops) g.addColorStop(t, c)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, SIZE, SIZE)
}

// Fibres running from the pupil out to the limbus. Slight angular jitter and a
// per-fibre length keeps them from reading as a sunburst.
function fibres(ctx, { count, inner, outer, colors, width, jitter, rand }) {
  ctx.lineCap = 'round'
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + (rand() - 0.5) * jitter
    const len = outer * (0.62 + rand() * 0.38)
    const wob = (rand() - 0.5) * 0.24
    ctx.beginPath()
    ctx.moveTo(C + Math.cos(a) * inner, C + Math.sin(a) * inner)
    ctx.quadraticCurveTo(
      C + Math.cos(a + wob) * (inner + len) * 0.55,
      C + Math.sin(a + wob) * (inner + len) * 0.55,
      C + Math.cos(a + wob * 0.4) * len,
      C + Math.sin(a + wob * 0.4) * len
    )
    ctx.strokeStyle = colors[(rand() * colors.length) | 0]
    ctx.globalAlpha = 0.18 + rand() * 0.5
    ctx.lineWidth = width * (0.4 + rand())
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

// Darker pits scattered around the collarette — the detail that stops an iris
// looking like a gradient.
function crypts(ctx, { count, rMin, rMax, color, rand }) {
  ctx.fillStyle = color
  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 2
    const r = rMin + rand() * (rMax - rMin)
    const s = SIZE * (0.008 + rand() * 0.03)
    ctx.globalAlpha = 0.1 + rand() * 0.35
    ctx.beginPath()
    ctx.ellipse(C + Math.cos(a) * r, C + Math.sin(a) * r, s, s * (0.5 + rand()), a, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

// The dark ring at the outer edge. Without it an iris floats; with it, it sits.
function limbus(ctx, color, softness) {
  const g = ctx.createRadialGradient(C, C, SIZE * (0.5 - softness), C, C, SIZE * 0.5)
  g.addColorStop(0, 'rgba(0,0,0,0)')
  g.addColorStop(1, color)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, SIZE, SIZE)
}

function canvasTexture(draw) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = SIZE
  draw(canvas.getContext('2d'))
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

export function makeIrisTexture() {
  return canvasTexture((ctx) => {
    const rand = rng(0x9e3779b1)
    base(ctx, [
      [0.0, '#ffe9a8'],
      [0.22, '#e8b44e'],
      [0.55, '#a86a1c'],
      [0.82, '#5c3308'],
      [1.0, '#2a1604'],
    ])
    fibres(ctx, {
      count: 260,
      inner: SIZE * 0.13,
      outer: SIZE * 0.48,
      colors: ['#ffe9b5', '#ffca66', '#8a5210', '#3d2205'],
      width: 2.6,
      jitter: 0.05,
      rand,
    })
    crypts(ctx, { count: 90, rMin: SIZE * 0.15, rMax: SIZE * 0.4, color: '#3a1f04', rand })
    // A warm inner corona around the pupil.
    const g = ctx.createRadialGradient(C, C, SIZE * 0.1, C, C, SIZE * 0.26)
    g.addColorStop(0, 'rgba(255,236,180,0.85)')
    g.addColorStop(1, 'rgba(255,200,90,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, SIZE, SIZE)
    limbus(ctx, 'rgba(24,10,2,0.95)', 0.16)
  })
}

export function makeAlienIrisTexture() {
  return canvasTexture((ctx) => {
    const rand = rng(0x2545f491)
    base(ctx, [
      [0.0, '#d8ffe8'],
      [0.18, '#4bf0b0'],
      [0.46, '#0f9c86'],
      [0.76, '#093a55'],
      [1.0, '#04121f'],
    ])
    // Cell walls: a rough hex lattice, because the alien iris should look
    // grown rather than woven.
    ctx.strokeStyle = 'rgba(190,255,235,0.5)'
    ctx.lineWidth = 1.6
    for (let ring = 1; ring <= 6; ring++) {
      const r = (ring / 6.4) * SIZE * 0.5
      const n = 6 + ring * 4
      ctx.beginPath()
      for (let i = 0; i <= n; i++) {
        const a = (i / n) * Math.PI * 2
        const rr = r * (0.9 + rand() * 0.2)
        const x = C + Math.cos(a) * rr
        const y = C + Math.sin(a) * rr
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.globalAlpha = 0.14 + rand() * 0.2
      ctx.stroke()
    }
    ctx.globalAlpha = 1
    fibres(ctx, {
      count: 170,
      inner: SIZE * 0.11,
      outer: SIZE * 0.49,
      colors: ['#c9ffe9', '#31e0b6', '#065f6d', '#02222f'],
      width: 3.4,
      jitter: 0.16,
      rand,
    })
    crypts(ctx, { count: 130, rMin: SIZE * 0.12, rMax: SIZE * 0.44, color: '#021b26', rand })
    const g = ctx.createRadialGradient(C, C, SIZE * 0.08, C, C, SIZE * 0.3)
    g.addColorStop(0, 'rgba(190,255,225,0.9)')
    g.addColorStop(1, 'rgba(60,255,190,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, SIZE, SIZE)
    limbus(ctx, 'rgba(1,12,20,0.98)', 0.2)
  })
}
