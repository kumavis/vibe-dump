// Drawing Simville.
//
// The town is a "dollhouse": buildings get floors, walls and furniture but no
// roof, so you can watch somebody move around inside the Kettle. Everything
// static is painted once into an offscreen canvas and blitted each frame; only
// the water, the people, the speech bubbles and the light change.

import { BUILDINGS, MAP_H, MAP_W, PROPS, T, TILE, doorOf, mulberry32 } from './town.js'
import { clamp, lerp, mixHex } from './util.js'

const C = {
  grass: '#79a857',
  grass2: '#6e9e4f',
  grassEdge: '#5e8b43',
  path: '#cbb491',
  pathSpeck: '#bda482',
  plaza: '#d8c6a5',
  plazaLine: '#c9b492',
  water: '#4b86a6',
  waterDeep: '#3d7191',
  shallow: '#6ba7bd',
  reed: '#5f8f52',
  floor: '#e6d6b8',
  floorAlt: '#dccaa9',
  wall: '#8d6b4d',
  wallTop: '#a98664',
  door: '#5f4327',
  dock: '#a9865c',
  trunk: '#6b4a2f',
  leaf: '#3f7f46',
  leafHi: '#4f9552',
  leafLo: '#2f6237',
}

const FLOWER_COLORS = ['#f2e05a', '#f08fb0', '#ffffff', '#b98cf0']

// Timber per building kind, so the town doesn't read as one long terrace.
const WALLS = {
  cafe: { base: '#9c6242', top: '#bb7f54' },
  library: { base: '#877a83', top: '#a3959d' },
  workshop: { base: '#6f7078', top: '#8b8c94' },
  market: { base: '#8d6b4d', top: '#a98664' },
  studio: { base: '#84806a', top: '#a09b81' },
  watch: { base: '#65768a', top: '#8091a3' },
  home: { base: '#8d6b4d', top: '#a98664' },
}

// The twelve tools, drawn small. Each one gets a silhouette you can tell apart
// at a glance at this size — that's the whole requirement, since a tool on the
// ground is a clue and a tool in somebody's hand is a different clue.
// Everything is drawn around (0, 0) at roughly 14px, and the caller scales it.
const TOOL_ART = {
  rod: (g) => {
    g.strokeStyle = '#a97c4e'
    g.lineWidth = 1.6
    g.beginPath()
    g.moveTo(-6, 5)
    g.lineTo(6, -6)
    g.stroke()
    g.strokeStyle = 'rgba(230,240,255,.85)'
    g.lineWidth = 0.8
    g.beginPath()
    g.moveTo(6, -6)
    g.lineTo(7, 3)
    g.stroke()
  },
  axe: (g) => {
    g.strokeStyle = '#8a5f37'
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(-5, 6)
    g.lineTo(3, -4)
    g.stroke()
    g.fillStyle = '#b9c2cc'
    g.beginPath()
    g.moveTo(2, -6)
    g.lineTo(8, -7)
    g.lineTo(7, -1)
    g.lineTo(1, -2)
    g.closePath()
    g.fill()
  },
  broom: (g) => {
    g.strokeStyle = '#a97c4e'
    g.lineWidth = 1.8
    g.beginPath()
    g.moveTo(-4, -7)
    g.lineTo(2, 3)
    g.stroke()
    g.fillStyle = '#d8b46a'
    g.beginPath()
    g.moveTo(0, 2)
    g.lineTo(6, 6)
    g.lineTo(2, 8)
    g.closePath()
    g.fill()
  },
  can: (g) => {
    g.fillStyle = '#7f9aa8'
    g.fillRect(-5, -2, 8, 7)
    g.strokeStyle = '#7f9aa8'
    g.lineWidth = 1.6
    g.beginPath()
    g.moveTo(3, 0)
    g.lineTo(8, -4)
    g.stroke()
    g.beginPath()
    g.arc(-1, -3, 3.2, Math.PI, 0)
    g.stroke()
  },
  teapot: (g) => {
    g.fillStyle = '#c2763f'
    g.beginPath()
    g.ellipse(-1, 1, 5, 4.2, 0, 0, Math.PI * 2)
    g.fill()
    g.strokeStyle = '#c2763f'
    g.lineWidth = 1.5
    g.beginPath()
    g.moveTo(4, 0)
    g.lineTo(8, -3)
    g.stroke()
    g.fillStyle = '#8f5428'
    g.fillRect(-2, -5, 3, 2)
  },
  spanner: (g) => {
    g.strokeStyle = '#aab3bd'
    g.lineWidth = 2.4
    g.beginPath()
    g.moveTo(-5, 5)
    g.lineTo(4, -4)
    g.stroke()
    g.lineWidth = 1.4
    g.beginPath()
    g.arc(5, -5, 3, 0.6, 5.2)
    g.stroke()
  },
  brushes: (g) => {
    for (let i = 0; i < 3; i++) {
      g.strokeStyle = '#a97c4e'
      g.lineWidth = 1.4
      g.beginPath()
      g.moveTo(-4 + i * 3, 6)
      g.lineTo(-2 + i * 3, -5)
      g.stroke()
      g.fillStyle = ['#c6553f', '#4a9fd8', '#f2c14e'][i]
      g.fillRect(-3 + i * 3, -7, 2.4, 3)
    }
  },
  ledger: (g) => {
    g.fillStyle = '#8b6fc4'
    g.fillRect(-6, -5, 11, 9)
    g.fillStyle = '#efe7d6'
    g.fillRect(-4, -4, 8, 7)
    g.strokeStyle = 'rgba(0,0,0,.25)'
    g.lineWidth = 0.7
    for (let i = 0; i < 3; i++) {
      g.beginPath()
      g.moveTo(-3, -2 + i * 2)
      g.lineTo(3, -2 + i * 2)
      g.stroke()
    }
  },
  pin: (g) => {
    g.fillStyle = '#e0c79a'
    g.beginPath()
    g.roundRect?.(-7, -2, 14, 4, 2)
    if (!g.roundRect) g.rect(-7, -2, 14, 4)
    g.fill()
    g.fillStyle = '#a97c4e'
    g.fillRect(-9, -1, 3, 2)
    g.fillRect(6, -1, 3, 2)
  },
  scales: (g) => {
    g.strokeStyle = '#c9a227'
    g.lineWidth = 1.5
    g.beginPath()
    g.moveTo(0, 5)
    g.lineTo(0, -4)
    g.moveTo(-6, -4)
    g.lineTo(6, -4)
    g.stroke()
    g.fillStyle = '#c9a227'
    for (const x of [-6, 6]) {
      g.beginPath()
      g.arc(x, -1, 2.6, 0, Math.PI)
      g.fill()
    }
  },
  ladder: (g) => {
    g.strokeStyle = '#b08350'
    g.lineWidth = 1.6
    g.beginPath()
    g.moveTo(-4, 7)
    g.lineTo(-2, -7)
    g.moveTo(3, 7)
    g.lineTo(5, -7)
    g.stroke()
    g.lineWidth = 1.2
    for (let i = 0; i < 3; i++) {
      g.beginPath()
      g.moveTo(-3.4 + i * 0.5, 4 - i * 4)
      g.lineTo(4.4 - i * 0.5, 4 - i * 4)
      g.stroke()
    }
  },
  bucket: (g) => {
    g.fillStyle = '#9aa7b2'
    g.beginPath()
    g.moveTo(-5, -2)
    g.lineTo(5, -2)
    g.lineTo(3.5, 6)
    g.lineTo(-3.5, 6)
    g.closePath()
    g.fill()
    g.strokeStyle = '#7d8893'
    g.lineWidth = 1.2
    g.beginPath()
    g.arc(0, -2, 5, Math.PI, 0)
    g.stroke()
  },
}

export function drawTool(g, id, cx, cy, scale = 1) {
  const art = TOOL_ART[id]
  if (!art) return
  g.save()
  g.translate(cx, cy)
  g.scale(scale, scale)
  g.lineCap = 'round'
  g.lineJoin = 'round'
  art(g)
  g.restore()
}

export class Renderer {
  constructor(canvas, sim) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.sim = sim
    this.static = null
    this.view = { scale: 1, ox: 0, oy: 0, dpr: 1 }
    this.hover = null
    this.showNames = true
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = this.canvas.getBoundingClientRect()
    const w = Math.max(320, Math.floor(rect.width))
    const h = Math.max(240, Math.floor(rect.height))
    this.canvas.width = Math.floor(w * dpr)
    this.canvas.height = Math.floor(h * dpr)

    // The map is much wider than most windows, so fitting it whole leaves big
    // empty bands. Fill the frame instead, but never crop more than two tiles
    // off an edge — that outermost ring is deliberately nothing but trees, and
    // a third tile in starts eating Yusef's cottage. Whatever gap is left over
    // gets forest painted into it.
    const cover = Math.max(w / (MAP_W * TILE), h / (MAP_H * TILE))
    const maxCrop = Math.min(w / ((MAP_W - 4) * TILE), h / ((MAP_H - 4) * TILE))
    const scale = Math.min(cover, maxCrop)
    this.view = {
      dpr,
      scale,
      ox: (w - MAP_W * TILE * scale) / 2,
      oy: (h - MAP_H * TILE * scale) / 2,
      w,
      h,
    }
    this.#buildStatic()
    this.#buildSurround()
  }

  // Forest for whatever the map doesn't cover, so the letterbox reads as the
  // wood the town sits in rather than as a bar at the top of the screen.
  #buildSurround() {
    const { w, h, dpr, ox, oy, scale } = this.view
    const c = document.createElement('canvas')
    c.width = Math.ceil(w * dpr)
    c.height = Math.ceil(h * dpr)
    const g = c.getContext('2d')
    g.scale(dpr, dpr)
    g.fillStyle = '#22331f'
    g.fillRect(0, 0, w, h)

    const rng = mulberry32(0xf0e57)
    const mapW = MAP_W * TILE * scale
    const mapH = MAP_H * TILE * scale
    const step = Math.max(14, 22 * scale)
    for (let y = -step; y < h + step; y += step * 0.72) {
      for (let x = -step; x < w + step; x += step * 0.8) {
        const px = x + rng() * step * 0.7
        const py = y + rng() * step * 0.7
        // Skip the middle — the map goes over it — but keep a band of trees
        // just inside the seam so the edge isn't a straight line.
        const inside =
          px > ox + step && px < ox + mapW - step && py > oy + step && py < oy + mapH - step
        if (inside) continue
        const r = (7 + rng() * 5) * Math.max(0.55, scale)
        g.fillStyle = 'rgba(8,16,8,.35)'
        g.beginPath()
        g.arc(px + 2, py + r * 0.5, r, 0, Math.PI * 2)
        g.fill()
        g.fillStyle = rng() < 0.4 ? '#24522c' : '#2c6134'
        g.beginPath()
        g.arc(px, py, r, 0, Math.PI * 2)
        g.fill()
        g.fillStyle = 'rgba(120,180,110,.14)'
        g.beginPath()
        g.arc(px - r * 0.3, py - r * 0.35, r * 0.45, 0, Math.PI * 2)
        g.fill()
      }
    }
    this.surround = c
  }

  toWorld(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect()
    const { scale, ox, oy } = this.view
    return {
      x: (clientX - rect.left - ox) / scale / TILE,
      y: (clientY - rect.top - oy) / scale / TILE,
    }
  }

  pickAgent(clientX, clientY) {
    const p = this.toWorld(clientX, clientY)
    let best = null
    let bestD = 1.6
    for (const a of this.sim.agents) {
      const d = Math.hypot(a.x - p.x, a.y - p.y + 0.4)
      if (d < bestD) {
        bestD = d
        best = a
      }
    }
    return best
  }

  // ------------------------------------------------------------- static ---

  #buildStatic() {
    const { scale, dpr } = this.view
    const px = MAP_W * TILE * scale * dpr
    const py = MAP_H * TILE * scale * dpr
    const c = document.createElement('canvas')
    c.width = Math.ceil(px)
    c.height = Math.ceil(py)
    const g = c.getContext('2d')
    g.scale(scale * dpr, scale * dpr)
    g.imageSmoothingEnabled = false

    const rng = mulberry32(this.sim.town.seed ^ 0x5eed)
    const tiles = this.sim.town.tiles
    const jitter = new Float32Array(MAP_W * MAP_H)
    for (let i = 0; i < jitter.length; i++) jitter[i] = rng()

    // Ground pass.
    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const i = y * MAP_W + x
        const t = tiles[i]
        const j = jitter[i]
        const X = x * TILE
        const Y = y * TILE
        switch (t) {
          case T.GRASS:
          case T.GRASS2:
          case T.TREE:
          case T.FLOWER:
          case T.REED:
            g.fillStyle = t === T.GRASS2 || j > 0.8 ? C.grass2 : C.grass
            g.fillRect(X, Y, TILE, TILE)
            if (j < 0.18) {
              g.fillStyle = C.grassEdge
              g.fillRect(X + 4 + j * 30, Y + 8 + j * 20, 5, 2)
            }
            break
          case T.PATH:
            g.fillStyle = C.path
            g.fillRect(X, Y, TILE, TILE)
            g.fillStyle = C.pathSpeck
            g.fillRect(X + 3 + j * 14, Y + 4 + j * 12, 3, 2)
            g.fillRect(X + 14 - j * 10, Y + 16 - j * 9, 2, 2)
            break
          case T.PLAZA:
            g.fillStyle = C.plaza
            g.fillRect(X, Y, TILE, TILE)
            g.strokeStyle = C.plazaLine
            g.lineWidth = 1
            g.strokeRect(X + 0.5, Y + 0.5, TILE - 1, TILE - 1)
            break
          case T.WATER:
            g.fillStyle = C.waterDeep
            g.fillRect(X, Y, TILE, TILE)
            break
          case T.SHALLOW:
            g.fillStyle = C.shallow
            g.fillRect(X, Y, TILE, TILE)
            break
          case T.DOCK:
            g.fillStyle = C.dock
            g.fillRect(X, Y, TILE, TILE)
            g.fillStyle = 'rgba(0,0,0,.14)'
            g.fillRect(X, Y + 7, TILE, 2)
            g.fillRect(X, Y + 17, TILE, 2)
            break
          case T.FLOOR:
          case T.DOOR:
            g.fillStyle = (x + y) % 2 ? C.floor : C.floorAlt
            g.fillRect(X, Y, TILE, TILE)
            break
          case T.WALL:
            g.fillStyle = C.wall
            g.fillRect(X, Y, TILE, TILE)
            break
          default:
            g.fillStyle = C.grass
            g.fillRect(X, Y, TILE, TILE)
        }
      }
    }

    // Reeds and flowers sit on top of their grass.
    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const i = y * MAP_W + x
        const j = jitter[i]
        const X = x * TILE
        const Y = y * TILE
        if (tiles[i] === T.REED) {
          g.strokeStyle = C.reed
          g.lineWidth = 1.5
          for (let k = 0; k < 4; k++) {
            const bx = X + 4 + k * 5 + j * 3
            g.beginPath()
            g.moveTo(bx, Y + TILE - 2)
            g.quadraticCurveTo(bx + 2, Y + 10, bx + (j > 0.5 ? 4 : -3), Y + 3)
            g.stroke()
          }
        } else if (tiles[i] === T.FLOWER) {
          const col = FLOWER_COLORS[Math.floor(j * FLOWER_COLORS.length) % FLOWER_COLORS.length]
          for (let k = 0; k < 3; k++) {
            g.fillStyle = col
            g.beginPath()
            g.arc(X + 5 + k * 7 + j * 3, Y + 7 + ((k * 9 + j * 20) % 12), 1.9, 0, Math.PI * 2)
            g.fill()
          }
        }
      }
    }

    this.#drawBuildings(g, jitter)

    // Trees last on the ground layer so their canopies overlap the walls a
    // little and the town looks nestled into the wood rather than stamped on it.
    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const i = y * MAP_W + x
        if (tiles[i] !== T.TREE) continue
        this.#drawTree(g, x * TILE + TILE / 2, y * TILE + TILE / 2, jitter[i])
      }
    }

    for (const p of PROPS) this.#drawProp(g, p)

    this.static = c
  }

  #drawTree(g, cx, cy, j) {
    const r = 9 + j * 4
    g.fillStyle = 'rgba(30,45,25,.22)'
    g.beginPath()
    g.ellipse(cx + 3, cy + r * 0.7, r * 0.95, r * 0.42, 0, 0, Math.PI * 2)
    g.fill()
    g.fillStyle = C.trunk
    g.fillRect(cx - 1.6, cy - 1, 3.2, r * 0.8)
    g.fillStyle = C.leafLo
    g.beginPath()
    g.arc(cx, cy, r, 0, Math.PI * 2)
    g.fill()
    g.fillStyle = C.leaf
    g.beginPath()
    g.arc(cx - r * 0.18, cy - r * 0.2, r * 0.8, 0, Math.PI * 2)
    g.fill()
    g.fillStyle = C.leafHi
    g.beginPath()
    g.arc(cx - r * 0.34, cy - r * 0.38, r * 0.4, 0, Math.PI * 2)
    g.fill()
  }

  #drawBuildings(g, jitter) {
    for (const b of BUILDINGS) {
      const X = b.x * TILE
      const Y = b.y * TILE
      const W = b.w * TILE
      const H = b.h * TILE

      // Drop shadow so the walls read as having height.
      g.fillStyle = 'rgba(30,30,40,.18)'
      g.fillRect(X + 5, Y + 7, W, H)

      // Wall ring, with a lighter top edge. Each kind gets its own timber so
      // the town doesn't read as one long terrace.
      const wall = WALLS[b.kind] ?? WALLS.home
      g.fillStyle = wall.base
      g.fillRect(X, Y, W, H)
      g.fillStyle = wall.top
      g.fillRect(X, Y, W, 6)
      g.fillRect(X, Y, 6, H)
      g.fillStyle = 'rgba(0,0,0,.16)'
      g.fillRect(X, Y + H - 6, W, 6)
      g.fillRect(X + W - 6, Y, 6, H)

      // Interior.
      const ix = X + TILE
      const iy = Y + TILE
      const iw = W - TILE * 2
      const ih = H - TILE * 2
      g.fillStyle = C.floor
      g.fillRect(ix, iy, iw, ih)
      g.fillStyle = 'rgba(0,0,0,.05)'
      for (let s = 0; s < iw; s += TILE) g.fillRect(ix + s, iy, 1, ih)
      g.fillStyle = 'rgba(255,255,255,.25)'
      g.fillRect(ix, iy, iw, 3)

      this.#drawFurniture(g, b, ix, iy, iw, ih)

      // Doorway: a gap in the wall with a step outside it.
      const d = doorOf(b)
      g.fillStyle = C.door
      g.fillRect(d.x * TILE + 3, d.y * TILE + 3, TILE - 6, TILE - 6)
      g.fillStyle = 'rgba(255,240,210,.35)'
      g.fillRect(d.x * TILE + 6, d.y * TILE + 6, TILE - 12, TILE - 12)

      // Name plate.
      g.save()
      g.font = `600 ${b.kind === 'home' ? 9 : 11}px ui-sans-serif, system-ui, sans-serif`
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      const label = b.name.toUpperCase()
      const lw = g.measureText(label).width
      const lx = X + W / 2
      const ly = Y + 12
      g.fillStyle = 'rgba(46,32,20,.82)'
      roundRect(g, lx - lw / 2 - 6, ly - 8, lw + 12, 16, 8)
      g.fill()
      g.fillStyle = '#f4e6cf'
      g.fillText(label, lx, ly + 0.5)
      g.restore()
    }
  }

  // Furniture is placed against the walls and sized off the room, so a building
  // can be moved or resized in town.js without anything ending up outside it.
  // Nothing here blocks movement — people walk over it, which at this scale
  // reads as walking around it.
  #drawFurniture(g, b, ix, iy, iw, ih) {
    const warm = '#b98d5c'
    const dark = '#8a6238'
    const cloth = '#c6553f'
    const box = (x, y, w, h, fill) => {
      g.fillStyle = 'rgba(0,0,0,.16)'
      g.fillRect(x + 2, y + 3, w, h)
      g.fillStyle = fill
      g.fillRect(x, y, w, h)
      g.fillStyle = 'rgba(255,255,255,.2)'
      g.fillRect(x, y, w, 2)
    }
    const rug = (x, y, w, h, fill) => {
      g.fillStyle = fill
      g.fillRect(x, y, w, h)
      g.strokeStyle = 'rgba(0,0,0,.12)'
      g.lineWidth = 2
      g.strokeRect(x + 3, y + 3, w - 6, h - 6)
    }
    const round = (x, y, r, fill) => {
      g.fillStyle = 'rgba(0,0,0,.16)'
      g.beginPath()
      g.arc(x + 2, y + 3, r, 0, Math.PI * 2)
      g.fill()
      g.fillStyle = fill
      g.beginPath()
      g.arc(x, y, r, 0, Math.PI * 2)
      g.fill()
    }
    const R = ix + iw
    const B = iy + ih

    switch (b.kind) {
      case 'cafe':
        rug(ix + iw * 0.3, iy + ih * 0.35, iw * 0.42, ih * 0.4, 'rgba(198,85,63,.18)')
        box(ix, B - 20, iw * 0.62, 18, warm) // the counter
        for (let i = 0; i < 4; i++) g.fillRect(ix + 8 + i * (iw * 0.14), B - 26, 7, 7) // things on it
        box(ix, iy, 26, 20, '#6d5a4a') // the ovens
        g.fillStyle = '#e8a34a'
        g.fillRect(ix + 5, iy + 6, 16, 9)
        for (let i = 0; i < 3; i++) round(ix + 30 + i * 26, iy + 14, 9, dark) // tables
        box(R - 22, iy + 4, 18, ih * 0.5, '#9a7b55') // shelving
        break
      case 'library':
        rug(ix + iw * 0.45, iy + ih * 0.3, iw * 0.4, ih * 0.45, 'rgba(139,111,196,.16)')
        for (let i = 0; i < 5; i++) {
          box(ix, iy + 4 + i * ((ih - 10) / 5), iw * 0.42, 9, dark)
          g.fillStyle = ['#c25c4e', '#4f8fa8', '#d8b455', '#7a9c5c'][i % 4]
          for (let k = 0; k < 6; k++) g.fillRect(ix + 3 + k * 7, iy + 5 + i * ((ih - 10) / 5), 4, 6)
        }
        box(R - 34, B - 26, 30, 22, warm) // the desk
        round(R - 52, iy + 16, 10, '#9a7b55') // reading table
        break
      case 'workshop':
        box(ix, iy, iw, 14, dark) // the long bench
        for (let i = 0; i < 6; i++) {
          g.fillStyle = ['#8d939c', '#b8712f', '#6f7680'][i % 3]
          g.fillRect(ix + 5 + i * (iw / 6.4), iy + 3, 9, 8)
        }
        box(ix + 4, B - 30, 30, 26, '#6f7680') // something half apart
        g.fillStyle = '#3f444c'
        g.fillRect(ix + 11, B - 24, 16, 14)
        box(R - 44, B - 24, 38, 20, warm)
        round(R - 22, iy + ih * 0.5, 11, '#8d939c') // a wheel of some kind
        round(R - 22, iy + ih * 0.5, 4, '#5a6068')
        break
      case 'market':
        for (let i = 0; i < 3; i++) {
          for (let k = 0; k < 2; k++) {
            const x = ix + 2 + i * (iw / 3)
            const y = iy + 2 + k * (ih / 2)
            box(x, y, iw / 3 - 8, ih / 2 - 10, '#96714f')
            const goods = ['#b9613f', '#5b8a9c', '#c99a3e', '#6e8f55'][(i * 2 + k) % 4]
            g.fillStyle = goods
            for (let n = 0; n < 3; n++) g.fillRect(x + 4 + n * 8, y + 4, 6, 6)
            g.fillStyle = 'rgba(255,255,255,.22)'
            for (let n = 0; n < 3; n++) g.fillRect(x + 4 + n * 8, y + 4, 6, 2)
          }
        }
        break
      case 'studio':
        rug(ix + 4, B - ih * 0.5, iw * 0.5, ih * 0.45, 'rgba(63,179,166,.16)')
        box(ix + 6, iy + 6, 4, ih - 16, warm) // easel legs
        box(ix + 2, iy + 10, 22, 20, '#efe7d6') // the canvas on it
        g.fillStyle = '#3fb3a6'
        g.fillRect(ix + 6, iy + 16, 14, 9)
        for (let i = 0; i < 3; i++) box(R - 30 + i * 8, iy + 4, 6, ih * 0.55, '#d9d2c4') // stacked canvases
        box(ix + iw * 0.45, B - 16, 26, 12, dark) // the table of jars
        for (let i = 0; i < 4; i++) {
          g.fillStyle = ['#c6553f', '#f2c14e', '#4a9fd8', '#5fa878'][i]
          g.fillRect(ix + iw * 0.45 + 3 + i * 6, B - 20, 4, 5)
        }
        break
      case 'watch':
        box(ix, iy + 4, iw * 0.55, 20, dark) // the desk
        g.fillStyle = '#efe7d6'
        g.fillRect(ix + 6, iy + 8, 14, 10) // the log book
        box(R - 26, iy, 22, ih, '#7c6b58') // the cabinet of paperwork
        for (let i = 0; i < 4; i++) {
          g.fillStyle = 'rgba(0,0,0,.2)'
          g.fillRect(R - 24, iy + 6 + i * (ih / 4.4), 18, 2)
        }
        round(ix + iw * 0.45, B - 16, 9, warm)
        break
      default: {
        // A cottage: bed, table, hearth. The bedding is keyed off the id so the
        // six of them aren't the same room six times.
        const hue = [...b.id].reduce((n, ch) => n + ch.charCodeAt(0), 0) % 360
        box(ix, iy, iw * 0.45, 18, '#9a7b55')
        g.fillStyle = `hsl(${hue} 42% 58%)`
        g.fillRect(ix + 2, iy + 2, iw * 0.45 - 4, 9)
        round(R - 18, B - 16, 9, warm)
        box(R - 20, iy, 16, 12, '#6d5a4a')
        g.fillStyle = '#e8a34a'
        g.fillRect(R - 17, iy + 4, 10, 5)
        rug(ix + iw * 0.3, B - ih * 0.45, iw * 0.4, ih * 0.35, `hsl(${hue} 34% 52% / .2)`)
        break
      }
    }
  }

  #drawProp(g, p) {
    const cx = p.x * TILE + TILE / 2
    const cy = p.y * TILE + TILE / 2
    g.save()
    switch (p.kind) {
      case 'well':
        g.fillStyle = 'rgba(30,30,40,.22)'
        g.beginPath()
        g.ellipse(cx + 2, cy + 10, 16, 6, 0, 0, Math.PI * 2)
        g.fill()
        g.fillStyle = '#8d8478'
        g.beginPath()
        g.ellipse(cx, cy + 4, 15, 9, 0, 0, Math.PI * 2)
        g.fill()
        g.fillStyle = '#31506b'
        g.beginPath()
        g.ellipse(cx, cy + 3, 10, 5.5, 0, 0, Math.PI * 2)
        g.fill()
        g.fillStyle = '#7a5334'
        g.fillRect(cx - 13, cy - 16, 3, 18)
        g.fillRect(cx + 10, cy - 16, 3, 18)
        g.fillStyle = '#9c6b41'
        g.fillRect(cx - 17, cy - 20, 34, 6)
        break
      case 'bench': {
        g.fillStyle = 'rgba(30,30,40,.2)'
        g.fillRect(cx - 14, cy + 4, 30, 5)
        g.fillStyle = '#8b6039'
        g.fillRect(cx - 15, cy - 4, 30, 8)
        g.fillStyle = '#a4764a'
        g.fillRect(cx - 15, cy - 4, 30, 3)
        g.fillStyle = '#6f4a2b'
        g.fillRect(cx - 15, p.dir === 'N' ? cy + 3 : cy - 10, 30, 6)
        break
      }
      case 'lamp':
        g.fillStyle = 'rgba(30,30,40,.22)'
        g.beginPath()
        g.ellipse(cx + 2, cy + 8, 6, 3, 0, 0, Math.PI * 2)
        g.fill()
        g.fillStyle = '#4a4a52'
        g.fillRect(cx - 1.6, cy - 16, 3.2, 24)
        g.fillStyle = '#5d5d66'
        g.beginPath()
        g.moveTo(cx - 6, cy - 16)
        g.lineTo(cx + 6, cy - 16)
        g.lineTo(cx + 3, cy - 24)
        g.lineTo(cx - 3, cy - 24)
        g.closePath()
        g.fill()
        break
      case 'stall': {
        const hue = p.hue ?? 10
        g.fillStyle = 'rgba(30,30,40,.2)'
        g.fillRect(cx - 20, cy + 6, 42, 6)
        g.fillStyle = '#8b6039'
        g.fillRect(cx - 20, cy - 4, 40, 12)
        g.fillStyle = `hsl(${hue} 55% 55%)`
        g.beginPath()
        g.moveTo(cx - 24, cy - 6)
        g.lineTo(cx + 24, cy - 6)
        g.lineTo(cx + 18, cy - 20)
        g.lineTo(cx - 18, cy - 20)
        g.closePath()
        g.fill()
        g.fillStyle = `hsl(${hue} 55% 70%)`
        for (let i = 0; i < 4; i++) g.fillRect(cx - 22 + i * 12, cy - 12, 5, 6)
        break
      }
      case 'crate':
        g.fillStyle = 'rgba(30,30,40,.2)'
        g.fillRect(cx - 8, cy + 3, 18, 5)
        g.fillStyle = '#a2743f'
        g.fillRect(cx - 9, cy - 8, 18, 14)
        g.strokeStyle = '#7b5628'
        g.lineWidth = 1.5
        g.strokeRect(cx - 9, cy - 8, 18, 14)
        g.beginPath()
        g.moveTo(cx - 9, cy - 1)
        g.lineTo(cx + 9, cy - 1)
        g.stroke()
        break
      case 'planter':
        g.fillStyle = '#9a6a42'
        g.fillRect(cx - 10, cy - 2, 20, 10)
        g.fillStyle = '#4b8c48'
        g.beginPath()
        g.arc(cx - 4, cy - 4, 6, 0, Math.PI * 2)
        g.arc(cx + 4, cy - 5, 5, 0, Math.PI * 2)
        g.fill()
        g.fillStyle = '#f0e06a'
        g.beginPath()
        g.arc(cx + 5, cy - 8, 2, 0, Math.PI * 2)
        g.fill()
        break
      case 'logs': {
        g.fillStyle = 'rgba(30,30,40,.22)'
        g.fillRect(cx - 11, cy + 3, 24, 5)
        for (let i = 0; i < 3; i++) {
          g.fillStyle = '#7a5433'
          g.fillRect(cx - 11 + i * 8, cy - 6, 7, 10)
          g.fillStyle = '#c49a68'
          g.beginPath()
          g.ellipse(cx - 7.5 + i * 8, cy - 6, 3.5, 1.6, 0, 0, Math.PI * 2)
          g.fill()
          g.strokeStyle = '#8f6c45'
          g.lineWidth = 0.8
          g.beginPath()
          g.arc(cx - 7.5 + i * 8, cy - 6, 1.6, 0, Math.PI * 2)
          g.stroke()
        }
        break
      }
      case 'boat':
        g.fillStyle = 'rgba(10,30,45,.3)'
        g.beginPath()
        g.ellipse(cx, cy + 4, 15, 6, 0, 0, Math.PI * 2)
        g.fill()
        g.fillStyle = '#9d6f43'
        g.beginPath()
        g.ellipse(cx, cy, 14, 6, 0, 0, Math.PI * 2)
        g.fill()
        g.fillStyle = '#c49a68'
        g.beginPath()
        g.ellipse(cx, cy - 1, 11, 4, 0, 0, Math.PI * 2)
        g.fill()
        break
    }
    g.restore()
  }

  // -------------------------------------------------------------- frame ---

  draw(t) {
    const ctx = this.ctx
    const { scale, ox, oy, dpr, w, h } = this.view
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)

    // Outside the map: the wood the town sits in.
    ctx.drawImage(this.surround, 0, 0, w, h)

    ctx.save()
    ctx.translate(ox, oy)
    ctx.drawImage(this.static, 0, 0, MAP_W * TILE * scale, MAP_H * TILE * scale)
    ctx.scale(scale, scale)

    this.#drawWater(ctx, t)
    this.#drawAgents(ctx, t)
    ctx.restore()

    // Night falls on the whole frame, surrounding forest included — darkening
    // only the map leaves the town in dusk inside a wood in full daylight.
    const amb = ambient(this.sim.time)
    this.#drawNight(ctx, amb)

    ctx.save()
    ctx.translate(ox, oy)
    ctx.scale(scale, scale)
    // Lamps and windows go back on top of the dark, in map space.
    if (amb.dark > 0.01) this.#drawGlow(ctx, t, amb)
    // Bubbles last, so what somebody is saying stays readable at midnight.
    this.#drawBubbles(ctx)
    ctx.restore()

    // A soft vignette pulls the eye into the square.
    const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.72)
    vg.addColorStop(0, 'rgba(0,0,0,0)')
    vg.addColorStop(1, 'rgba(8,10,16,.42)')
    ctx.fillStyle = vg
    ctx.fillRect(0, 0, w, h)
  }

  #drawWater(ctx, t) {
    const tiles = this.sim.town.tiles
    ctx.save()
    ctx.globalAlpha = 0.5
    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const tile = tiles[y * MAP_W + x]
        if (tile !== T.WATER && tile !== T.SHALLOW) continue
        const X = x * TILE
        const Y = y * TILE
        const wobble = Math.sin(t * 0.0013 + x * 0.6 + y * 0.42)
        ctx.fillStyle = tile === T.WATER ? C.water : C.shallow
        ctx.fillRect(X, Y, TILE, TILE)
        if (wobble > 0.55) {
          ctx.fillStyle = 'rgba(214,240,255,.5)'
          ctx.fillRect(X + 4 + wobble * 5, Y + 9, 10, 2)
        }
      }
    }
    ctx.restore()
  }

  // People and dropped tools share one depth-sorted pass, so somebody standing
  // below a bucket is drawn in front of it.
  #drawAgents(ctx, t) {
    const order = [
      ...this.sim.agents.map((a) => ({ y: a.y, agent: a })),
      ...this.sim.toolsOnGround().map((o) => ({ y: o.y, tool: o })),
    ].sort((p, q) => p.y - q.y)
    for (const item of order) {
      if (item.agent) this.#drawAgent(ctx, item.agent, t)
      else this.#drawGroundTool(ctx, item.tool, t)
    }
  }

  #drawGroundTool(ctx, o, t) {
    const cx = o.x * TILE + TILE / 2
    const cy = o.y * TILE + TILE / 2
    ctx.fillStyle = 'rgba(20,25,35,.22)'
    ctx.beginPath()
    ctx.ellipse(cx, cy + 5, 8, 3.2, 0, 0, Math.PI * 2)
    ctx.fill()
    // A slow bob, so a thing lying in the grass still catches the eye.
    drawTool(ctx, o.def.id, cx, cy + Math.sin(t * 0.0016 + o.x) * 0.7, 0.82)
  }

  #drawAgent(ctx, a, t) {
    const cx = a.x * TILE + TILE / 2
    const cy = a.y * TILE + TILE / 2
    const selected = this.sim.selected === a.id
    const hovered = this.hover === a.id

    if (a.asleep) {
      ctx.fillStyle = 'rgba(20,25,35,.22)'
      ctx.beginPath()
      ctx.ellipse(cx, cy + 4, 12, 5, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = a.def.color
      roundRect(ctx, cx - 11, cy - 4, 22, 9, 4.5)
      ctx.fill()
      ctx.fillStyle = a.def.skin
      ctx.beginPath()
      ctx.arc(cx - 12, cy - 1, 4.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = 'rgba(255,255,255,.75)'
      ctx.font = '700 9px ui-sans-serif, system-ui, sans-serif'
      const zz = Math.floor(t / 700) % 3
      ctx.fillText('z'.repeat(zz + 1), cx + 6, cy - 10 - zz * 2)
      return
    }

    const walking = a.path.length > 0
    const bob = walking ? Math.sin(a.walkPhase * 2.4) * 1.6 : Math.sin(t * 0.0022 + a.x) * 0.5
    const swing = walking ? Math.sin(a.walkPhase * 2.4) * 3.4 : 0
    const y = cy + bob

    // Shadow.
    ctx.fillStyle = 'rgba(20,25,35,.26)'
    ctx.beginPath()
    ctx.ellipse(cx, cy + 9, 7.5, 3.2, 0, 0, Math.PI * 2)
    ctx.fill()

    if (selected || hovered) {
      ctx.strokeStyle = selected ? '#ffd982' : 'rgba(255,255,255,.55)'
      ctx.lineWidth = selected ? 2.2 : 1.4
      const pulse = selected ? 1 + Math.sin(t * 0.005) * 0.08 : 1
      ctx.beginPath()
      ctx.ellipse(cx, cy + 9, 11 * pulse, 5 * pulse, 0, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Legs.
    ctx.fillStyle = '#42423f'
    ctx.fillRect(cx - 4, y + 3, 3, 6 + swing * 0.3)
    ctx.fillRect(cx + 1, y + 3, 3, 6 - swing * 0.3)

    // Body.
    ctx.fillStyle = a.def.color
    roundRect(ctx, cx - 6, y - 6, 12, 11, 3.5)
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,.2)'
    roundRect(ctx, cx - 6, y - 6, 12, 4, 3)
    ctx.fill()

    // Arms.
    ctx.fillStyle = a.def.skin
    ctx.fillRect(cx - 8.5, y - 4 + swing * 0.4, 2.8, 7)
    ctx.fillRect(cx + 5.7, y - 4 - swing * 0.4, 2.8, 7)

    // Head, hair, face.
    ctx.fillStyle = a.def.skin
    ctx.beginPath()
    ctx.arc(cx, y - 11, 5.4, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = a.def.hair
    ctx.beginPath()
    ctx.arc(cx, y - 12.4, 5.4, Math.PI * (a.facing === 'n' ? 0.05 : 0.95), Math.PI * (a.facing === 'n' ? 1.95 : 2.05))
    ctx.fill()
    if (a.facing !== 'n') {
      ctx.fillStyle = '#2a2320'
      const dx = a.facing === 'e' ? 1.4 : a.facing === 'w' ? -1.4 : 0
      ctx.fillRect(cx - 2.2 + dx, y - 11.4, 1.5, 1.8)
      ctx.fillRect(cx + 0.8 + dx, y - 11.4, 1.5, 1.8)
    }

    // What they're carrying, tucked under the trailing arm.
    if (a.carrying) {
      const side = a.facing === 'w' ? -1 : 1
      drawTool(ctx, a.carrying, cx + side * 9, y + 1, 0.62)
    }

    // Looking for something, said without words — a model isn't speaking for
    // them here and the grammar shouldn't either.
    if (a.wants && !a.bubble) {
      const bx = cx
      const by = cy - 24 + Math.sin(t * 0.004) * 1.2
      ctx.save()
      ctx.fillStyle = 'rgba(253,250,244,.94)'
      ctx.strokeStyle = a.frustration > 0.5 ? '#e8734a' : a.def.color
      ctx.lineWidth = 1.4
      roundRect(ctx, bx - 15, by - 10, 30, 19, 7)
      ctx.fill()
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(bx - 4, by + 12, 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      drawTool(ctx, a.wants, bx - 5, by, 0.52)
      ctx.fillStyle = '#26221d'
      ctx.font = '700 11px ui-sans-serif, system-ui, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('?', bx + 6, by + 4)
      ctx.restore()
    }

    if (this.showNames) {
      ctx.save()
      ctx.font = '600 8.5px ui-sans-serif, system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.lineWidth = 2.6
      ctx.strokeStyle = 'rgba(12,16,22,.72)'
      ctx.strokeText(a.firstName, cx, cy + 20)
      ctx.fillStyle = selected ? '#ffe7ae' : 'rgba(255,255,255,.88)'
      ctx.fillText(a.firstName, cx, cy + 20)
      ctx.restore()
    }
  }

  // Dark, across the whole frame and in screen space.
  #drawNight(ctx, amb) {
    const { w, h } = this.view
    if (amb.dark > 0.01) {
      ctx.save()
      // A multiply pass first, which deepens the greens instead of greying
      // them, then a thin blue veil over the top for the moonlight.
      ctx.globalCompositeOperation = 'multiply'
      ctx.fillStyle = mixHex('#ffffff', '#38477e', amb.dark)
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = `rgba(14,20,52,${amb.dark * 0.42})`
      ctx.fillRect(0, 0, w, h)
      ctx.restore()
    }
    if (amb.tintA > 0.01) {
      ctx.save()
      ctx.globalCompositeOperation = 'soft-light'
      ctx.fillStyle = amb.tint
      ctx.globalAlpha = amb.tintA
      ctx.fillRect(0, 0, w, h)
      ctx.restore()
    }
  }

  // Lamps, and windows with somebody still up behind them.
  #drawGlow(ctx, t, amb) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    const flicker = 0.93 + Math.sin(t * 0.004) * 0.04

    for (const p of PROPS) {
      if (p.kind !== 'lamp') continue
      const cx = p.x * TILE + TILE / 2
      const cy = p.y * TILE + TILE / 2 - 20
      const r = 64 * flicker
      const grad = ctx.createRadialGradient(cx, cy, 1, cx, cy, r)
      grad.addColorStop(0, `rgba(255,222,158,${0.72 * amb.dark})`)
      grad.addColorStop(0.3, `rgba(255,188,104,${0.22 * amb.dark})`)
      grad.addColorStop(1, 'rgba(255,170,80,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fill()
    }

    for (const b of BUILDINGS) {
      // A building is lit if anybody in it is still awake. Kept tight to the
      // room — a wide falloff per building adds up to a haze over the town.
      const lit = this.sim.agents.some(
        (a) => !a.asleep && a.x > b.x && a.x < b.x + b.w - 1 && a.y > b.y && a.y < b.y + b.h - 1,
      )
      if (!lit) continue
      const cx = (b.x + b.w / 2) * TILE
      const cy = (b.y + b.h / 2) * TILE
      const r = Math.max(b.w, b.h) * TILE * 0.4
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r)
      grad.addColorStop(0, `rgba(255,206,132,${0.3 * amb.dark})`)
      grad.addColorStop(0.55, `rgba(255,190,110,${0.1 * amb.dark})`)
      grad.addColorStop(1, 'rgba(255,190,110,0)')
      ctx.fillStyle = grad
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2)
    }
    ctx.restore()
  }

  #drawBubbles(ctx) {
    for (const a of this.sim.agents) {
      if (!a.bubble) continue
      const cx = a.x * TILE + TILE / 2
      const cy = a.y * TILE + TILE / 2
      drawBubble(ctx, cx, cy - 22, a.bubble.text, a.def.color)
    }
  }
}

// 0 at noon, 1 in the dead of night, plus the warm cast of dawn and dusk.
export function ambient(minutes) {
  const h = (((minutes % 1440) + 1440) % 1440) / 60
  let dark
  if (h < 4.5) dark = 0.78
  else if (h < 7) dark = lerp(0.78, 0, (h - 4.5) / 2.5)
  else if (h < 17) dark = 0
  else if (h < 20.5) dark = lerp(0, 0.78, (h - 17) / 3.5)
  else dark = 0.78
  let tint = '#ffb070'
  let tintA = 0
  if (h >= 4.5 && h < 8) tintA = 0.45 * (1 - Math.abs(h - 6.2) / 1.8)
  else if (h >= 16.5 && h < 20.5) {
    tint = '#ff8a4e'
    tintA = 0.5 * (1 - Math.abs(h - 18.5) / 2)
  }
  return { dark, tint, tintA: clamp(tintA, 0, 0.5) }
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

function wrap(ctx, text, maxWidth) {
  const words = String(text).split(/\s+/)
  const lines = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
    if (lines.length >= 4) break
  }
  if (line && lines.length < 5) lines.push(line)
  return lines.slice(0, 5)
}

function drawBubble(ctx, cx, cy, text, accent) {
  ctx.save()
  ctx.font = '500 9.5px ui-sans-serif, system-ui, sans-serif'
  const maxW = 150
  const lines = wrap(ctx, text, maxW)
  const lh = 12
  let w = 0
  for (const l of lines) w = Math.max(w, ctx.measureText(l).width)
  w = Math.min(maxW, w) + 16
  const h = lines.length * lh + 12
  const x = clamp(cx - w / 2, 6, MAP_W * TILE - w - 6)
  const y = cy - h

  ctx.fillStyle = 'rgba(15,18,26,.28)'
  roundRect(ctx, x + 2, y + 3, w, h, 8)
  ctx.fill()
  ctx.fillStyle = 'rgba(253,250,244,.97)'
  roundRect(ctx, x, y, w, h, 8)
  ctx.fill()
  ctx.strokeStyle = accent
  ctx.lineWidth = 1.6
  roundRect(ctx, x, y, w, h, 8)
  ctx.stroke()

  // Tail.
  ctx.beginPath()
  ctx.moveTo(clamp(cx - 5, x + 6, x + w - 16), y + h - 1)
  ctx.lineTo(clamp(cx, x + 8, x + w - 8), y + h + 7)
  ctx.lineTo(clamp(cx + 6, x + 12, x + w - 6), y + h - 1)
  ctx.closePath()
  ctx.fillStyle = 'rgba(253,250,244,.97)'
  ctx.fill()

  ctx.fillStyle = '#26221d'
  ctx.textAlign = 'left'
  lines.forEach((l, i) => ctx.fillText(l, x + 8, y + 15 + i * lh))
  ctx.restore()
}
