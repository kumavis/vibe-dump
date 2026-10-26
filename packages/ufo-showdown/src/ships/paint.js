// How a paint job goes onto a hull. `resolvePaint` (catalog.js) hands over
// main / dark / light / flame / accent and maybe a pattern. Each hull paints
// its own base colours, then calls `coat` once per painted surface (wings,
// then fuselage) so the pattern lands on the metal but under the cockpit,
// cannons and engine nozzles that are drawn after it.
//
// Up to sixteen ships and drones are drawn a frame, so nothing here is built
// per frame: gradients, pattern tiles and paths are made once per paint (or
// once per hull and paint) and reused. Every pattern is a CanvasPattern
// filled straight into the surface's own path: no clipping, and no pixels
// painted outside the hull. Animation moves the pattern, not the hull.

import { hexA } from '../stars.js'

export const TAU = Math.PI * 2

// Tile pixels per world unit. The store shows hulls well over life size, so
// the tiles carry more detail than a ship in flight needs.
const RES = 3

// The square a non-repeating picture (stripes, hot rod flames) covers, in
// hull units. Every hull fits inside it.
const SPAN = 46

// One small canvas to mint gradients and patterns from. A CanvasGradient or
// CanvasPattern isn't tied to the context that made it, and it's laid out in
// whatever transform is current when it's used, so a hull's gradients can be
// built once in its own local units and reused every frame, by the game, the
// home screen and the store alike.
let scratchCtx = null
export function scratch() {
  scratchCtx ??= document.createElement('canvas').getContext('2d')
  return scratchCtx
}

const memo = new Map()
export function cached(key, make) {
  let v = memo.get(key)
  if (v === undefined) {
    v = make()
    memo.set(key, v)
  }
  return v
}

// Team Colors resolves to a different palette per player, so a paint is known
// by its colours rather than its id.
export function paintKey(p) {
  return `${p.id}|${p.main}|${p.dark}|${p.light}|${p.flame}|${p.accent}|${p.pattern}`
}

export function linear(x0, y0, x1, y1, stops) {
  const g = scratch().createLinearGradient(x0, y0, x1, y1)
  for (const [o, c] of stops) g.addColorStop(o, c)
  return g
}

export function radial(x0, y0, r0, x1, y1, r1, stops) {
  const g = scratch().createRadialGradient(x0, y0, r0, x1, y1, r1)
  for (const [o, c] of stops) g.addColorStop(o, c)
  return g
}

// Shading laid back over a patterned fuselage, so a checker or camo job still
// reads as a rounded hull rather than a flat sticker. Spans x0..x1.
export function sheen(x0, x1) {
  return cached(`sheen${x0},${x1}`, () =>
    linear(x0, 0, x1, 0, [
      [0, 'rgba(0,0,0,0.32)'],
      [0.42, 'rgba(255,255,255,0.24)'],
      [0.62, 'rgba(255,255,255,0)'],
      [1, 'rgba(0,0,0,0.2)'],
    ]),
  )
}

// A soft round glow, drawn once per colour and stamped: the Lancer's tip, the
// Phoenix's heart, the drones' eyes. No shadowBlur anywhere.
export function glow(color) {
  return cached(`glow${color}`, () => {
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const g = c.getContext('2d')
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
    grad.addColorStop(0, '#ffffff')
    grad.addColorStop(0.2, color)
    grad.addColorStop(0.5, hexA(color, 0.35))
    grad.addColorStop(1, hexA(color, 0))
    g.fillStyle = grad
    g.fillRect(0, 0, 64, 64)
    return c
  })
}

export function stamp(ctx, sprite, x, y, r) {
  ctx.drawImage(sprite, x - r, y - r, r * 2, r * 2)
}

// ---------------------------------------------------------------- tiles

function canvas(w, h) {
  const c = document.createElement('canvas')
  c.width = Math.round(w * RES)
  c.height = Math.round(h * RES)
  const g = c.getContext('2d')
  g.scale(RES, RES)
  return [c, g]
}

// A repeating tile `size` units square, drawn by `draw(g, size)` in units.
function tile(size, draw) {
  const [c, g] = canvas(size, size)
  draw(g, size)
  return scratch().createPattern(c, 'repeat')
}

// A one-off picture over the whole SPAN square, centred on the hull's origin.
function picture(draw) {
  const [c, g] = canvas(SPAN * 2, SPAN * 2)
  g.translate(SPAN, SPAN)
  draw(g)
  return scratch().createPattern(c, 'no-repeat')
}

// Lays a pattern out in hull units: the tile's own pixels scaled down to
// units, then `place` (rotate / move / stretch) on top.
function lay(pattern, place = null, origin = 0) {
  let m = place ?? new DOMMatrix()
  if (origin) m = m.translate(-origin, -origin)
  pattern.setTransform(m.scale(1 / RES))
  return pattern
}

// Small deterministic noise, so every Space Camo hull is the same camo.
function rng(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }
}

// Draws `fn(x, y)` at every wrap of a tile so blobs cross its edges seamlessly.
function wrapped(size, x, y, fn) {
  for (const dx of [-size, 0, size]) for (const dy of [-size, 0, size]) fn(x + dx, y + dy)
}

function checkerTile(pal) {
  return lay(
    tile(12, (g) => {
      g.fillStyle = pal.accent
      g.fillRect(0, 0, 6, 6)
      g.fillRect(6, 6, 6, 6)
    }),
  )
}

function camoTile(pal) {
  const p = tile(34, (g, size) => {
    const r = rng(7)
    for (const [color, n] of [[pal.dark, 5], [pal.accent, 4], [hexA(pal.light, 0.55), 3]]) {
      g.fillStyle = color
      for (let i = 0; i < n; i++) {
        const x = r() * size
        const y = r() * size
        const s = 3 + r() * 3.5
        // a blob is a few overlapping circles, never a clean dot
        for (let k = 0; k < 4; k++) {
          const a = r() * TAU
          const d = s * 0.7
          const rx = s * (0.8 + r() * 0.4)
          wrapped(size, x + Math.cos(a) * d, y + Math.sin(a) * d * 0.7, (bx, by) => {
            g.beginPath()
            g.ellipse(bx, by, rx, s * 0.75, a, 0, TAU)
            g.fill()
          })
        }
      }
    }
  })
  return lay(p)
}

// Deep space with clouds drifting in it, baked into one tile: a dark wash for
// the stars to shine against, and the clouds added on as light.
function nebulaTile(pal) {
  return tile(44, (g, size) => {
    g.fillStyle = hexA(pal.dark, 0.5)
    g.fillRect(0, 0, size, size)
    g.globalCompositeOperation = 'lighter'
    const r = rng(3)
    for (const color of [pal.flame, '#5fd0ff', pal.light, pal.flame]) {
      const x = r() * size
      const y = r() * size
      const s = 9 + r() * 8
      wrapped(size, x, y, (bx, by) => {
        const grad = g.createRadialGradient(bx, by, 0, bx, by, s)
        grad.addColorStop(0, hexA(color, 0.55))
        grad.addColorStop(1, hexA(color, 0))
        g.fillStyle = grad
        g.fillRect(bx - s, by - s, s * 2, s * 2)
      })
    }
  })
}

// Three star layers that fade in and out of step: every star twinkles, and
// it costs three pattern fills instead of a few dozen dots.
function starTiles() {
  return cached('stars', () =>
    [29, 33, 37].map((size, k) => {
      const p = tile(size, (g) => {
        const r = rng(11 + k * 5)
        for (let i = 0; i < 5; i++) {
          const x = r() * size
          const y = r() * size
          const s = 0.5 + r() * 0.7
          wrapped(size, x, y, (bx, by) => {
            const grad = g.createRadialGradient(bx, by, 0, bx, by, s * 2.6)
            grad.addColorStop(0, 'rgba(255,255,255,1)')
            grad.addColorStop(0.35, 'rgba(255,255,255,0.8)')
            grad.addColorStop(1, 'rgba(255,255,255,0)')
            g.fillStyle = grad
            g.fillRect(bx - s * 3, by - s * 3, s * 6, s * 6)
          })
        }
        // one proper four-point twinkle per layer
        wrapped(size, r() * size, r() * size, (bx, by) => {
          g.fillStyle = '#ffffff'
          g.beginPath()
          g.moveTo(bx, by - 3.2)
          g.quadraticCurveTo(bx, by, bx + 3.2, by)
          g.quadraticCurveTo(bx, by, bx, by + 3.2)
          g.quadraticCurveTo(bx, by, bx - 3.2, by)
          g.quadraticCurveTo(bx, by, bx, by - 3.2)
          g.fill()
        })
      })
      return lay(p)
    }),
  )
}

// Racing stripes: a double stripe nose to tail, and a chevron swept back
// across the wings.
function stripesPicture(pal) {
  const p = picture((g) => {
    g.fillStyle = pal.accent
    g.fillRect(-6, -SPAN, 3.6, SPAN * 2)
    g.fillRect(2.4, -SPAN, 3.6, SPAN * 2)
    g.beginPath()
    for (const s of [-1, 1]) {
      g.moveTo(0, -1)
      g.lineTo(s * SPAN, 26)
      g.lineTo(s * SPAN, 30.5)
      g.lineTo(0, 3.5)
      g.closePath()
    }
    g.fill()
  })
  return lay(p, null, SPAN)
}

// Hot rod flames: a solid front that licks back in curling tongues, with a
// pale pinstripe round the edge.
function hotrodPicture(pal) {
  return picture((g) => {
    const yb = -14
    g.beginPath()
    g.moveTo(-SPAN, -SPAN)
    g.lineTo(-SPAN, yb)
    const tongues = [-40, -30, -20, -10, 0, 10, 20, 30, 40]
    const reach = [8, 22, 12, 28, 18, 28, 12, 22, 8]
    tongues.forEach((xi, i) => {
      const tipX = xi * 1.18 // tips curl outwards, as if the air peels them back
      const tipY = yb + reach[i]
      g.bezierCurveTo(xi - 5, yb + reach[i] * 0.5, tipX - 3, tipY - 4, tipX, tipY)
      g.bezierCurveTo(tipX - 1, tipY - 8, xi + 4, yb + reach[i] * 0.35, xi + 5, yb + 2)
    })
    g.lineTo(SPAN, yb)
    g.lineTo(SPAN, -SPAN)
    g.closePath()
    const grad = g.createLinearGradient(0, -40, 0, 16)
    grad.addColorStop(0, '#fff6c0')
    grad.addColorStop(0.35, '#ffd23d')
    grad.addColorStop(0.7, pal.flame)
    grad.addColorStop(1, pal.accent)
    g.fillStyle = grad
    g.fill()
    g.strokeStyle = 'rgba(255,240,190,0.75)'
    g.lineWidth = 0.9
    g.stroke()
  })
}

// Bands of colour, one cycle every 60 units, repeating sideways forever.
function rainbowTile() {
  return cached('rainbow', () => {
    const [c, g] = canvas(60, 1)
    const grad = g.createLinearGradient(0, 0, 60, 0)
    for (let i = 0; i <= 6; i++) grad.addColorStop(i / 6, `hsl(${i * 60},100%,58%)`)
    g.fillStyle = grad
    g.fillRect(0, 0, 60, 1)
    return scratch().createPattern(c, 'repeat')
  })
}

// The glint that sweeps across Solid Gold: a broad band and a thin one
// behind it, alone in a strip far wider than any hull.
function glintTile() {
  return cached('glint', () => {
    const [c, g] = canvas(180, 1)
    const band = (x, w, a) => {
      const grad = g.createLinearGradient(x - w, 0, x + w, 0)
      grad.addColorStop(0, 'rgba(255,255,255,0)')
      grad.addColorStop(0.5, `rgba(255,255,255,${a})`)
      grad.addColorStop(1, 'rgba(255,255,255,0)')
      g.fillStyle = grad
      g.fillRect(x - w, 0, w * 2, 1)
    }
    band(90, 9, 0.85)
    band(103, 3, 0.55)
    return scratch().createPattern(c, 'repeat')
  })
}

// What one paint needs, made the first time a ship wears it.
export function paintLook(pal) {
  return cached(`paint|${paintKey(pal)}`, () => {
    const look = {
      flame: linear(0, 0, 0, 1, [
        [0, '#ffffff'],
        [0.35, pal.flame],
        [1, hexA(pal.flame, 0)],
      ]),
    }
    if (pal.pattern === 'stripes') look.stripes = stripesPicture(pal)
    if (pal.pattern === 'checker') look.checker = checkerTile(pal)
    if (pal.pattern === 'camo') look.camo = camoTile(pal)
    if (pal.pattern === 'flames') look.hotrod = hotrodPicture(pal)
    if (pal.pattern === 'galaxy') {
      look.nebula = nebulaTile(pal)
      look.stars = starTiles()
    }
    return look
  })
}

// ---------------------------------------------------------------- patterns

// Each fills `path` (one surface of the hull) with the paint's pattern.
const PATTERNS = {
  stripes(ctx, path, pal, look) {
    ctx.fillStyle = look.stripes
    ctx.fill(path)
  },
  checker(ctx, path, pal, look) {
    // a proper two-tone flag over everything; the shading goes back on after
    ctx.fillStyle = pal.main
    ctx.fill(path)
    ctx.fillStyle = look.checker
    ctx.fill(path)
  },
  camo(ctx, path, pal, look) {
    ctx.fillStyle = look.camo
    ctx.fill(path)
  },
  flames(ctx, path, pal, look, t) {
    // the tongues lick a little, stretching back from the nose
    const s = 1 + 0.05 * Math.sin(t * 9)
    ctx.fillStyle = lay(look.hotrod, new DOMMatrix([1, 0, 0, s, 0, -40 + 40 * s]), SPAN)
    ctx.fill(path)
  },
  galaxy(ctx, path, pal, look, t) {
    const alpha = ctx.globalAlpha
    const drift = t * 3
    ctx.fillStyle = lay(look.nebula, new DOMMatrix([1, 0, 0, 1, drift, drift * 0.4]))
    ctx.fill(path)
    ctx.globalCompositeOperation = 'lighter'
    look.stars.forEach((stars, k) => {
      const a = 0.15 + 0.85 * Math.sin(t * 2.6 + k * 2.1)
      if (a < 0.05) return
      ctx.globalAlpha = alpha * a
      ctx.fillStyle = stars
      ctx.fill(path)
    })
  },
  rainbow(ctx, path, pal, look, t) {
    // 'color' keeps the hull's light and shade and swaps in the hue, so the
    // bands slide over a ship that still looks like a ship
    ctx.globalCompositeOperation = 'color'
    ctx.fillStyle = lay(rainbowTile(), new DOMMatrix().rotate(-34).translate(t * 36, 0))
    ctx.fill(path)
  },
  gold(ctx, path, pal, look, t) {
    // a glint sweeps across every couple of seconds, then the metal rests
    const k = (t * 0.55) % 1
    if (k > 0.62) return
    ctx.fillStyle = lay(glintTile(), new DOMMatrix().rotate(31.5).translate(-146 + k * 180, 0))
    ctx.fill(path)
  },
}

const SHEENED = new Set(['stripes', 'checker', 'camo', 'flames'])

// Lays the paint's pattern over one surface. `shade` (from `sheen`) puts the
// rounding back on a fuselage once an opaque pattern has flattened it; a
// surface without one is a wing, and is set back a touch so the hull still
// stands out from it.
export function coat(ctx, path, pal, look, t, shade) {
  const draw = PATTERNS[pal.pattern]
  if (!draw) return
  const alpha = ctx.globalAlpha
  draw(ctx, path, pal, look, t)
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = alpha
  if (SHEENED.has(pal.pattern)) {
    ctx.fillStyle = shade ?? 'rgba(12,8,40,0.22)'
    ctx.fill(path)
  }
}
