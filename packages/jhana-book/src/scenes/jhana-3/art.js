// jhana-3/art.js — the pond's painted parts: canvas textures and cut outlines.
// Everything is procedural and seeded, so the page looks the same every load.

import * as THREE from 'three'

const TAU = Math.PI * 2
const smooth = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}

function canvas(w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

function texture(c, { repeat = false, srgb = true } = {}) {
  const t = new THREE.CanvasTexture(c)
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.anisotropy = 4
  return t
}

// ---- the pond outline ----------------------------------------------------------
// A soft, slightly squarish blob in spread coordinates (X = signed distance from
// the spine, Z toward the reader). `scale` < 1 gives the inner contour bands,
// `wob` turns their wobble so the bands are not concentric copies.
export const POND = { cx: 0, cz: -0.115, rx: 0.86, rz: 0.5, X0: -0.95, X1: 0.95, Z0: -0.66, Z1: 0.44 }

export function pondPoint(phi, scale = 1, wob = 0, out = [0, 0]) {
  const c = Math.cos(phi)
  const s = Math.sin(phi)
  // superellipse (n = 3): flatter sides than an ellipse, so it fills the spread
  const sx = Math.sign(c) * Math.abs(c) ** (2 / 3)
  const sz = Math.sign(s) * Math.abs(s) ** (2 / 3)
  const r =
    1 +
    0.035 * Math.cos(3 * phi + 0.7 + wob) +
    0.025 * Math.cos(5 * phi + 1.9 - wob * 1.3) +
    0.014 * Math.cos(8 * phi + 0.4 + wob * 2.1)
  out[0] = POND.cx + POND.rx * scale * sx * r
  out[1] = POND.cz + 0.03 * (1 - scale) + POND.rz * scale * sz * r
  return out
}

// One page's half of the pond as a THREE.Shape in that page's (s, t) panel
// coordinates (s = distance from the spine, t = Z). The blob is star-shaped
// about a centre on the spine, so cos φ ≥ 0 is exactly the right half.
export function pondHalfShape(side, scale = 1, steps = 72) {
  const pts = []
  const p = [0, 0]
  const a0 = side === 'right' ? -Math.PI / 2 : Math.PI / 2
  for (let i = 0; i <= steps; i++) {
    pondPoint(a0 + (Math.PI * i) / steps, scale, 0, p)
    pts.push(new THREE.Vector2(Math.abs(p[0]) * (i === 0 || i === steps ? 0 : 1), p[1]))
  }
  return new THREE.Shape(pts)
}

// ---- pond bed: stacked cut-paper contour bands, painted -------------------------
export function pondBedTexture(w, rnd) {
  const h = Math.round((w * (POND.Z1 - POND.Z0)) / (POND.X1 - POND.X0))
  const c = canvas(w, h)
  const g = c.getContext('2d')
  const px = (X) => ((X - POND.X0) / (POND.X1 - POND.X0)) * w
  const py = (Z) => ((Z - POND.Z0) / (POND.Z1 - POND.Z0)) * h
  const bands = [
    { scale: 1.04, wob: 0, color: '#e6f0ea' },
    { scale: 0.88, wob: 0.9, color: '#c4dcd6' },
    { scale: 0.71, wob: 1.7, color: '#a5c9c6' },
    { scale: 0.52, wob: 2.6, color: '#88b8b8' },
    { scale: 0.31, wob: 3.4, color: '#73a9ad' },
  ]
  const p = [0, 0]
  for (let b = 0; b < bands.length; b++) {
    const band = bands[b]
    g.save()
    if (b > 0) {
      // a soft drop shadow under each band edge: the layers read as cut paper
      g.shadowColor = 'rgba(30, 62, 62, 0.38)'
      g.shadowBlur = w * 0.01
      g.shadowOffsetY = -w * 0.003
    }
    g.fillStyle = band.color
    g.beginPath()
    for (let i = 0; i <= 160; i++) {
      pondPoint((TAU * i) / 160, band.scale, band.wob, p)
      if (i === 0) g.moveTo(px(p[0]), py(p[1]))
      else g.lineTo(px(p[0]), py(p[1]))
    }
    g.closePath()
    g.fill()
    g.restore()
  }
  // paper grain
  const img = g.getImageData(0, 0, w, h)
  const d = img.data
  for (let i = 0; i < d.length; i += 4) {
    const n = (rnd() - 0.5) * 7
    d[i] += n
    d[i + 1] += n
    d[i + 2] += n
  }
  g.putImageData(img, 0, 0)
  return texture(c)
}

// ---- caustics: a tileable cellular (Worley F2 − F1) network ------------------------
// `mode` 'tint' paints pale water with lighter threads (the water plane's own
// map); 'light' paints the threads alone on black, for the additive layer.
export function causticTexture(size, cells, rnd, mode) {
  const fx = new Float32Array(cells * cells)
  const fy = new Float32Array(cells * cells)
  for (let i = 0; i < cells * cells; i++) {
    fx[i] = 0.15 + 0.7 * rnd()
    fy[i] = 0.15 + 0.7 * rnd()
  }
  const c = canvas(size, size)
  const g = c.getContext('2d')
  const img = g.createImageData(size, size)
  const d = img.data
  for (let y = 0; y < size; y++) {
    const v = (y / size) * cells
    const cj = Math.floor(v)
    for (let x = 0; x < size; x++) {
      const u = (x / size) * cells
      const ci = Math.floor(u)
      let f1 = 9
      let f2 = 9
      for (let dj = -1; dj <= 1; dj++) {
        for (let di = -1; di <= 1; di++) {
          const i = ci + di
          const j = cj + dj
          const k = (((j % cells) + cells) % cells) * cells + (((i % cells) + cells) % cells)
          const ddx = i + fx[k] - u
          const ddy = j + fy[k] - v
          const dd = ddx * ddx + ddy * ddy
          if (dd < f1) {
            f2 = f1
            f1 = dd
          } else if (dd < f2) f2 = dd
        }
      }
      const e = Math.sqrt(f2) - Math.sqrt(f1)
      // threads come and go in soft patches (a tileable low-frequency wash)
      const patch = 0.55 + 0.45 * Math.cos((TAU * x) / size + 0.8) * Math.cos((TAU * 2 * y) / size + 0.3)
      const line = (1 - smooth(0, 0.09, e)) ** 2 * patch
      const o = (y * size + x) * 4
      if (mode === 'tint') {
        // pale aqua → a little lighter along the threads
        d[o] = 204 + 30 * line
        d[o + 1] = 230 + 18 * line
        d[o + 2] = 226 + 20 * line
      } else {
        const l = 255 * line
        d[o] = l
        d[o + 1] = l
        d[o + 2] = l
      }
      d[o + 3] = 255
    }
  }
  g.putImageData(img, 0, 0)
  return texture(c, { repeat: true })
}

// ---- a petal: cream at the heart, rose at the tip (u runs base → tip) ------------
export function petalTexture() {
  const c = canvas(256, 64)
  const g = c.getContext('2d')
  const grad = g.createLinearGradient(0, 0, 256, 0)
  grad.addColorStop(0, '#fff7ef')
  grad.addColorStop(0.35, '#fde9ea')
  grad.addColorStop(0.7, '#f6bfcc')
  grad.addColorStop(1, '#ec8fa9')
  g.fillStyle = grad
  g.fillRect(0, 0, 256, 64)
  // a faint midrib and a few veins fanning to the tip, like a pressed petal
  g.strokeStyle = 'rgba(255,255,255,0.35)'
  g.lineWidth = 1.5
  g.beginPath()
  g.moveTo(0, 32)
  g.lineTo(256, 32)
  g.stroke()
  g.strokeStyle = 'rgba(214,110,140,0.12)'
  g.lineWidth = 1
  for (let k = -3; k <= 3; k++) {
    if (!k) continue
    g.beginPath()
    g.moveTo(10, 32 + k * 2)
    g.quadraticCurveTo(120, 32 + k * 8, 250, 32 + k * 1.2)
    g.stroke()
  }
  return texture(c)
}

// The petal outline, unit length (s: 0 → 1 from hinge to tip) and unit width
// (t: −0.5 … 0.5): a narrow heel, a full belly just before the middle and an
// ogee point, as lotus petals are cut in every paper lotus ever folded.
export function petalShape() {
  const s = new THREE.Shape()
  s.moveTo(0, -0.14)
  s.bezierCurveTo(0.07, -0.36, 0.22, -0.5, 0.42, -0.5)
  s.bezierCurveTo(0.66, -0.5, 0.86, -0.25, 1, 0)
  s.bezierCurveTo(0.86, 0.25, 0.66, 0.5, 0.42, 0.5)
  s.bezierCurveTo(0.22, 0.5, 0.07, 0.36, 0, 0.14)
  s.closePath()
  return s
}

// ---- lily pad: faint veins radiating from the notch's root ------------------------
export function padTexture(rnd) {
  const c = canvas(256, 256)
  const g = c.getContext('2d')
  g.fillStyle = '#ffffff'
  g.fillRect(0, 0, 256, 256)
  const rg = g.createRadialGradient(128, 128, 10, 128, 128, 128)
  rg.addColorStop(0, 'rgba(255,255,255,0)')
  rg.addColorStop(0.8, 'rgba(0,40,20,0.05)')
  rg.addColorStop(1, 'rgba(0,40,20,0.14)')
  g.fillStyle = rg
  g.fillRect(0, 0, 256, 256)
  g.strokeStyle = 'rgba(255,255,255,0.4)'
  g.lineWidth = 1.4
  for (let k = 0; k < 15; k++) {
    const a = (TAU * k) / 15 + rnd() * 0.1
    g.beginPath()
    g.moveTo(128, 128)
    g.quadraticCurveTo(128 + 60 * Math.cos(a + 0.08), 128 + 60 * Math.sin(a + 0.08), 128 + 124 * Math.cos(a), 128 + 124 * Math.sin(a))
    g.stroke()
  }
  return texture(c)
}

// A pad of radius R with its notch (a narrow wedge) facing `rot`, centred on 0.
export function padShape(R, rot, notch = 0.32) {
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.absarc(0, 0, R, rot + notch / 2, rot + TAU - notch / 2, false)
  s.lineTo(0, 0)
  return s
}

// ---- seed pod: a disc with its seed holes cut out ---------------------------------
export function podShape(r, cx = 0, cy = 0, half = 0) {
  const s = new THREE.Shape()
  if (half) {
    // the half that lies on one page of a pod centred on the spine
    s.moveTo(cx, cy - r)
    s.absarc(cx, cy, r, -Math.PI / 2, Math.PI / 2, false)
    s.lineTo(cx, cy - r)
  } else s.absarc(cx, cy, r, 0, TAU, false)
  const holes = [[0, 0]]
  for (let k = 0; k < 6; k++) holes.push([0.58 * Math.cos((TAU * k) / 6 + 0.3), 0.58 * Math.sin((TAU * k) / 6 + 0.3)])
  for (const [hx, hy] of holes) {
    if (half && hx * r < 0.22 * r) continue
    const hole = new THREE.Path()
    hole.absarc(cx + hx * r, cy + hy * r, r * 0.13, 0, TAU, true)
    s.holes.push(hole)
  }
  return s
}

// ---- a soft round glow, for sprites and points ------------------------------------
export function glowTexture(size = 128) {
  const c = canvas(size, size)
  const g = c.getContext('2d')
  const h = size / 2
  const grad = g.createRadialGradient(h, h, 0, h, h, h)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.18, 'rgba(255,255,255,0.55)')
  grad.addColorStop(0.5, 'rgba(255,255,255,0.14)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  return texture(c)
}
