// The insignia atlas (ENGINEERING.md §6 insigniaAtlas): every national marking
// of DATA.md §8's vocabulary drawn once into one texture, so every aircraft
// shares one material and picks its marking by a per-instance rectangle. The
// markings are the record's (R8 §5.1 rule 10: no flags but the national
// markings on aircraft and carriers' decks at the date). Drawn on a canvas
// at first use; one atlas per page.

import * as THREE from 'three'

const RED = '#b3141f'
const WHITE = '#f2f2ee'
const BLUE = '#1b2d5c'

// [name, column (128 px cells), row, width in cells]
const LAYOUT = [
  ['hinomaru', 0, 0, 1],
  ['hinomaru-white-surround', 1, 0, 1],
  ['star-red-centre', 2, 0, 1],
  ['star-no-red', 3, 0, 1],
  ['roundel-raaf', 4, 0, 1],
  ['roundel-rnzaf', 5, 0, 1],
  ['star-bar-red-outline', 0, 1, 2],
  ['star-bar-blue', 2, 1, 2],
]
const CELL = 128
const W = 1024
const H = 256

function star(g, cx, cy, r) {
  g.beginPath()
  for (let k = 0; k < 10; k++) {
    const a = -Math.PI / 2 + (k * Math.PI) / 5
    const rr = k % 2 ? r * 0.382 : r
    const x = cx + Math.cos(a) * rr
    const y = cy + Math.sin(a) * rr
    if (k) g.lineTo(x, y)
    else g.moveTo(x, y)
  }
  g.closePath()
  g.fill()
}

function disc(g, cx, cy, r, fill) {
  g.fillStyle = fill
  g.beginPath()
  g.arc(cx, cy, r, 0, Math.PI * 2)
  g.fill()
}

function draw(g, name, x0, y0, w) {
  const cx = x0 + w / 2
  const cy = y0 + CELL / 2
  const r = CELL * 0.46
  switch (name) {
    case 'hinomaru':
      disc(g, cx, cy, r * 0.96, RED)
      break
    case 'hinomaru-white-surround':
      disc(g, cx, cy, r, WHITE)
      disc(g, cx, cy, r * 0.78, RED)
      break
    case 'star-red-centre':
    case 'star-no-red':
      disc(g, cx, cy, r, BLUE)
      g.fillStyle = WHITE
      star(g, cx, cy, r * 0.97)
      if (name === 'star-red-centre') disc(g, cx, cy, r * 0.34, RED)
      break
    case 'star-bar-red-outline':
    case 'star-bar-blue': {
      const rr = r * 0.82
      const bh = rr * 0.5
      const outline = name === 'star-bar-red-outline' ? RED : BLUE
      g.fillStyle = outline
      g.fillRect(x0 + 6, cy - bh / 2 - 5, w - 12, bh + 10)
      disc(g, cx, cy, rr + 5, outline)
      g.fillStyle = WHITE
      g.fillRect(x0 + 11, cy - bh / 2, w - 22, bh)
      disc(g, cx, cy, rr, BLUE)
      g.fillStyle = WHITE
      star(g, cx, cy, rr * 0.97)
      break
    }
    case 'roundel-raaf':
    case 'roundel-rnzaf':
      disc(g, cx, cy, r, BLUE)
      disc(g, cx, cy, r * 0.62, WHITE)
      disc(g, cx, cy, r * 0.3, name === 'roundel-raaf' ? RED : BLUE)
      break
    default:
      throw new Error(`insignia: no drawing for “${name}”`)
  }
}

/** The rectangles alone (no canvas): name → [u0, v0, u1, v1] in texture space (v up, as the texture is flipped). */
export function insigniaRects() {
  const rects = {}
  for (const [name, col, row, cells] of LAYOUT) {
    const x0 = col * CELL
    const y0 = row * CELL
    const w = cells * CELL
    rects[name] = [x0 / W, 1 - (y0 + CELL) / H, (x0 + w) / W, 1 - y0 / H]
  }
  return rects
}

let ATLAS = null
/** The one atlas: { texture, rects }. */
export function insigniaAtlas() {
  if (ATLAS) return ATLAS
  const canvas = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(W, H) : Object.assign(document.createElement('canvas'), { width: W, height: H })
  const g = canvas.getContext('2d')
  g.clearRect(0, 0, W, H)
  for (const [name, col, row, cells] of LAYOUT) draw(g, name, col * CELL, row * CELL, cells * CELL)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.anisotropy = 4
  ATLAS = { texture, rects: insigniaRects(), canvas }
  return ATLAS
}
