// The look. A finished skeleton — points, half-widths, trims — painted to a 2-D
// context in one of thirteen modes.
//
// Three decisions shape everything below. Ink is filled as ONE path under the
// non-zero rule, so overlapping strokes union instead of showing their seams.
// Every mode draws in em units under a single transform, so a 64-pixel thumbnail
// and a 2000-pixel stage run identical code and only the hairlines are divided
// back out (`px` is one device pixel expressed in em). And nothing here reaches
// for a global: the grain tile borrows a surface from the passed context's own
// canvas, so an OffscreenCanvas in a worker renders exactly what the page does.
//
// The hot path is a redraw every frame while the writing animation plays, so
// anything that would allocate per frame — colour strings, the hue ramp,
// gradients, the grain pattern, the halftone grid — is built once against a
// signature of the parameters that feed it and reused until that changes.
import { clamp, polylineLength, mulberry32 } from '../geom/path.js'
import { strokeOutline } from '../engine/outline.js'
import { capsFor } from '../engine/nib.js'
import { trimmedPoints, trimmedWidths, EM } from '../engine/skeleton.js'

const TAU = Math.PI * 2
const DEG = Math.PI / 180
const RAMP_N = 24 // hue ramp resolution, and the size of the gradient pool
const BLEED_EM = 32 // em units of dilation at rdBleed = 1
const MIN_RIBBON = 6 // below this a stroke has no direction worth ramping along
const MAX_HATCH = 240 // hatch lines per stroke before the step is widened
const MAX_RINGS = 16
const DOT_BUDGET = 7e5 // halftone cells the screen may sample per glyph
const DOT_GAIN = 1.08 // dots at full coverage just touch their neighbours
const GRAIN_SIZE = 64
const FONT_STACK = 'ui-sans-serif, system-ui, -apple-system, sans-serif'
const NEON_PASSES = [0.055, 0.5, 0.028, 0.55, 0.012, 0.7] // blur (of the side), alpha
const HUE_MODES = new Set(['order', 'component', 'ribbon', 'xray'])

export const RENDER_MODES = [
  { id: 'ink', label: 'Ink — solid fill' },
  { id: 'hollow', label: 'Hollow — outline only' },
  { id: 'skeleton', label: 'Skeleton — centrelines' },
  { id: 'ribbon', label: 'Ribbon — gradient along each stroke' },
  { id: 'order', label: 'Order — hue by stroke order' },
  { id: 'component', label: 'Component — hue by radical' },
  { id: 'xray', label: 'X-ray — overlaps glow' },
  { id: 'hatch', label: 'Hatch — engraved lines' },
  { id: 'contour', label: 'Contour — topographic rings' },
  { id: 'letterpress', label: 'Letterpress — pressed into paper' },
  { id: 'neon', label: 'Neon — glow' },
  { id: 'dot', label: 'Halftone — dots' },
  { id: 'wire', label: 'Wire — engineering drawing' },
]
const MODE_IDS = new Set(RENDER_MODES.map((m) => m.id))

export const params = [
  {
    id: 'rdMode',
    label: 'Mode',
    group: 'Mode',
    type: 'select',
    default: 'ink',
    options: RENDER_MODES.map((m) => ({ value: m.id, label: m.label })),
    hint: 'How the finished glyph is drawn. Every mode reads the same geometry — only the ink changes.',
  },
  {
    id: 'rdInk',
    label: 'Ink',
    group: 'Ink & paper',
    type: 'color',
    default: '#e8e8ee',
    hint: 'The colour the glyph is made of.',
  },
  {
    id: 'rdPaper',
    label: 'Paper',
    group: 'Ink & paper',
    type: 'color',
    default: '#0a0a0c',
    hint: 'What the glyph is sitting on. The renderer never paints it — it only needs to know, for the letterpress emboss, the grid and the stroke-order badges.',
  },
  {
    id: 'rdAccent',
    label: 'Accent',
    group: 'Ink & paper',
    type: 'color',
    default: '#e2574c',
    hint: 'Anchors the hue ramp for the order, component, ribbon and x-ray modes, and colours keylines, glow, shadows and markers.',
  },
  {
    id: 'rdHueSpread',
    label: 'Hue spread',
    group: 'Ink & paper',
    type: 'range',
    min: 0,
    max: 360,
    step: 1,
    default: 180,
    unit: '°',
    when: (P) => HUE_MODES.has(P.rdMode),
    hint: 'How far around the wheel the ramp travels from the accent hue. 0 makes every stroke the same colour.',
  },
  {
    id: 'rdHueRotate',
    label: 'Hue rotate',
    group: 'Ink & paper',
    type: 'range',
    min: 0,
    max: 360,
    step: 1,
    default: 0,
    unit: '°',
    when: (P) => HUE_MODES.has(P.rdMode),
    hint: 'Turn the whole ramp, keeping its spread.',
  },
  {
    id: 'rdOpacity',
    label: 'Opacity',
    group: 'Effects',
    type: 'range',
    min: 0.05,
    max: 1,
    step: 0.01,
    default: 1,
    hint: 'Alpha of the ink. Below 1 the union of the strokes still reads as one shape — the overlaps do not double up.',
  },
  {
    id: 'rdOutlineW',
    label: 'Keyline',
    group: 'Effects',
    type: 'range',
    min: 0,
    max: 8,
    step: 0.1,
    default: 0,
    unit: 'px',
    hint: 'An accent-coloured line drawn around the filled shape. In hollow and wire modes it sets the line weight instead.',
  },
  {
    id: 'rdShadow',
    label: 'Shadow',
    group: 'Effects',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    hint: 'An offset accent-coloured shadow behind the ink. Misregistration rather than realism: a black shadow would be invisible on dark paper.',
  },
  {
    id: 'rdShadowAngle',
    label: 'Shadow angle',
    group: 'Effects',
    type: 'range',
    min: 0,
    max: 360,
    step: 1,
    default: 135,
    unit: '°',
    when: (P) => P.rdShadow > 0 || P.rdMode === 'letterpress',
    hint: 'Direction the shadow falls, clockwise from east. Letterpress uses it as the light direction for the emboss.',
  },
  {
    id: 'rdGrain',
    label: 'Paper grain',
    group: 'Effects',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    hint: 'A fixed noise tile laid over the whole square, in device pixels, so it reads as the surface rather than as part of the glyph.',
  },
  {
    id: 'rdBleed',
    label: 'Ink bleed',
    group: 'Effects',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    hint: 'Paint the shape again slightly dilated and translucent, the way ink creeps into a fibrous paper.',
  },
  {
    id: 'rdHatchStep',
    label: 'Screen pitch',
    group: 'Effects',
    type: 'range',
    min: 2,
    max: 24,
    step: 0.5,
    default: 8,
    unit: 'px',
    when: (P) => P.rdMode === 'hatch' || P.rdMode === 'dot',
    hint: 'Spacing of the hatch lines and of the halftone grid, in device pixels — a screen frequency, so it stays constant as the glyph is scaled.',
  },
  {
    id: 'rdContourStep',
    label: 'Contour step',
    group: 'Effects',
    type: 'range',
    min: 2,
    max: 24,
    step: 0.5,
    default: 9,
    unit: 'px',
    when: (P) => P.rdMode === 'contour',
    hint: 'Distance between the concentric inset outlines. Each ring is the stroke re-outlined at a smaller half-width, so the insets are exact rather than approximated.',
  },
  {
    id: 'rdShowGrid',
    label: 'Grid',
    group: 'Overlays',
    type: 'toggle',
    default: false,
    hint: 'The em square with its centre lines and thirds, as on squared practice paper.',
  },
  {
    id: 'rdShowRef',
    label: 'Reference ghost',
    group: 'Overlays',
    type: 'toggle',
    default: false,
    hint: 'The untouched KanjiVG skeleton under the design, so you can see exactly what the pipeline moved.',
  },
  {
    id: 'rdShowOrder',
    label: 'Stroke numbers',
    group: 'Overlays',
    type: 'toggle',
    default: false,
    hint: 'A numeral at the head of every stroke, in writing order.',
  },
  {
    id: 'rdWriteAnim',
    label: 'Written',
    group: 'Overlays',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.001,
    default: 1,
    hint: 'Reveal the glyph up to this fraction of its total ink length, in stroke order. The stroke being written is cut at the exact arc length, not snapped to a sample.',
  },
]

// ── parameter + colour plumbing ──────────────────────────────────────────────

const num = (v, def, lo, hi) => {
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? (n < lo ? lo : n > hi ? hi : n) : def
}

const HEX = /^#([0-9a-fA-F]{3,8})$/
const colorOf = (v, fb) => (typeof v === 'string' && HEX.test(v.trim()) ? v.trim() : fb)

const COLOR_CACHE = new Map()

function toHsl(c) {
  const r = c.r / 255
  const gr = c.g / 255
  const b = c.b / 255
  const mx = Math.max(r, gr, b)
  const mn = Math.min(r, gr, b)
  const d = mx - mn
  let h = 0
  if (d > 1e-6) {
    if (mx === r) h = ((gr - b) / d) % 6
    else if (mx === gr) h = (b - r) / d + 2
    else h = (r - gr) / d + 4
    h *= 60
  }
  c.h = ((h % 360) + 360) % 360
  c.l = (mx + mn) / 2
  c.s = d < 1e-6 ? 0 : clamp(d / Math.max(1e-6, 1 - Math.abs(2 * c.l - 1)), 0, 1)
}

/** Parse #rgb / #rgba / #rrggbb / #rrggbbaa once and keep it. */
function parseColor(str, fb) {
  const hit = COLOR_CACHE.get(str)
  if (hit) return hit
  const m = HEX.exec(str)
  if (!m) return fb
  const h = m[1]
  const c = { r: 0, g: 0, b: 0, a: 1, h: 0, s: 0, l: 0 }
  const pair = (i) => parseInt(h.slice(i, i + 2), 16)
  const single = (i) => parseInt(h[i] + h[i], 16)
  if (h.length === 3 || h.length === 4) {
    c.r = single(0)
    c.g = single(1)
    c.b = single(2)
    if (h.length === 4) c.a = single(3) / 255
  } else if (h.length === 6 || h.length === 8) {
    c.r = pair(0)
    c.g = pair(2)
    c.b = pair(4)
    if (h.length === 8) c.a = pair(6) / 255
  } else return fb
  toHsl(c)
  if (COLOR_CACHE.size > 64) COLOR_CACHE.clear()
  COLOR_CACHE.set(str, c)
  return c
}

const WHITE = { r: 232, g: 232, b: 238, a: 1, h: 240, s: 0.14, l: 0.92 }
const BLACK = { r: 10, g: 10, b: 12, a: 1, h: 240, s: 0.09, l: 0.04 }

const rgbCss = (r, g, b, a) =>
  a >= 1 ? `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})` : `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a.toFixed(3)})`

const mixCss = (c1, c2, t, a = 1) => rgbCss(c1.r + (c2.r - c1.r) * t, c1.g + (c2.g - c1.g) * t, c1.b + (c2.b - c1.b) * t, a)

const hslCss = (h, s, l) => `hsl(${(((h % 360) + 360) % 360).toFixed(1)}, ${(clamp(s, 0, 1) * 100).toFixed(1)}%, ${(clamp(l, 0, 1) * 100).toFixed(1)}%)`

// One palette, rebuilt only when the colours or the ramp actually change.
const PAL = {
  sig: '',
  ink: WHITE,
  paper: BLACK,
  accent: WHITE,
  inkCss: '#e8e8ee',
  paperCss: '#0a0a0c',
  accentCss: '#e2574c',
  coreCss: '#fff',
  gridCss: '#26262e',
  ghostCss: '#3a3a44',
  pressCss: '#888',
  pressDarkCss: '#000',
  pressLightCss: '#fff',
  glowCss: '#e2574c',
  ramp: new Array(RAMP_N),
  rampLo: new Array(RAMP_N),
  rampHi: new Array(RAMP_N),
}

function palette(p) {
  const inkS = colorOf(p.rdInk, '#e8e8ee')
  const paperS = colorOf(p.rdPaper, '#0a0a0c')
  const accentS = colorOf(p.rdAccent, '#e2574c')
  const spread = num(p.rdHueSpread, 180, 0, 360)
  const rotate = num(p.rdHueRotate, 0, 0, 360)
  const sig = inkS + '|' + paperS + '|' + accentS + '|' + spread + '|' + rotate
  if (sig === PAL.sig) return PAL

  const ink = parseColor(inkS, WHITE)
  const paper = parseColor(paperS, BLACK)
  const accent = parseColor(accentS, WHITE)
  PAL.ink = ink
  PAL.paper = paper
  PAL.accent = accent
  PAL.inkCss = rgbCss(ink.r, ink.g, ink.b, ink.a)
  PAL.paperCss = rgbCss(paper.r, paper.g, paper.b, paper.a)
  PAL.accentCss = rgbCss(accent.r, accent.g, accent.b, accent.a)
  // the neon core is the ink pushed most of the way to white — a filament is
  // always brighter than its own glow, whatever colour the glow is
  PAL.coreCss = mixCss(ink, { r: 255, g: 255, b: 255 }, 0.55)
  PAL.gridCss = mixCss(paper, ink, 0.2)
  PAL.ghostCss = mixCss(paper, ink, 0.4)
  PAL.pressCss = mixCss(paper, ink, 0.62)
  PAL.pressDarkCss = mixCss(paper, { r: 0, g: 0, b: 0 }, 0.75, 0.85)
  PAL.pressLightCss = mixCss(ink, { r: 255, g: 255, b: 255 }, 0.5, 0.5)
  PAL.glowCss = rgbCss(accent.r, accent.g, accent.b, 0.85)

  // The ramp borrows the accent's saturation and lightness so a design keeps one
  // temperature however far the hue travels; both are floored, because a nearly
  // black or nearly grey accent would otherwise flatten the whole ramp.
  const S = clamp(accent.s, 0.35, 0.95)
  const L = clamp(accent.l, 0.42, 0.7)
  for (let i = 0; i < RAMP_N; i++) {
    const h = accent.h + rotate + (spread * i) / (RAMP_N - 1)
    PAL.ramp[i] = hslCss(h, S, L)
    PAL.rampLo[i] = hslCss(h, S * 0.85, L * 0.36)
    PAL.rampHi[i] = hslCss(h, S * 0.7, Math.min(0.9, L * 1.45))
  }
  PAL.sig = sig
  return PAL
}

const rampAt = (t) => PAL.ramp[clamp(Math.round(t * (RAMP_N - 1)), 0, RAMP_N - 1) | 0]
const rampIndex = (t) => clamp(Math.round(t * (RAMP_N - 1)), 0, RAMP_N - 1) | 0

// ── per-context caches ───────────────────────────────────────────────────────
// Gradients and patterns belong to the context that made them, so they hang off
// a WeakMap rather than a module variable: two canvases, two caches, and both
// die with their canvas.

const GRAD_CACHE = new WeakMap()

/**
 * A pool of unit gradients running (0,0)→(1,0), one per ramp step. Ribbon mode
 * maps each stroke's own start→end onto that unit segment with a transform, so
 * no gradient is ever built per stroke or per frame.
 */
function ribbonGradients(g) {
  if (typeof g.createLinearGradient !== 'function') return null
  let e = GRAD_CACHE.get(g)
  if (!e) {
    e = { sig: '', grads: new Array(RAMP_N) }
    GRAD_CACHE.set(g, e)
  }
  if (e.sig !== PAL.sig) {
    for (let i = 0; i < RAMP_N; i++) {
      const gr = g.createLinearGradient(0, 0, 1, 0)
      gr.addColorStop(0, PAL.rampLo[i])
      gr.addColorStop(0.55, PAL.ramp[i])
      gr.addColorStop(1, PAL.rampHi[i])
      e.grads[i] = gr
    }
    e.sig = PAL.sig
  }
  return e.grads
}

const GRAIN_CACHE = new WeakMap()
let GRAIN_TILE = null

/** A drawing surface of our own, taken from whatever the context lives on. */
function makeSurface(g, w, h) {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h)
  const doc = g.canvas && g.canvas.ownerDocument
  if (!doc || typeof doc.createElement !== 'function') return null
  const el = doc.createElement('canvas')
  el.width = w
  el.height = h
  return el
}

function grainPattern(g) {
  if (typeof g.createPattern !== 'function') return null
  const hit = GRAIN_CACHE.get(g)
  if (hit !== undefined) return hit
  let pat = null
  if (!GRAIN_TILE) {
    const surf = makeSurface(g, GRAIN_SIZE, GRAIN_SIZE)
    const sg = surf && surf.getContext ? surf.getContext('2d') : null
    if (sg && typeof sg.createImageData === 'function') {
      const img = sg.createImageData(GRAIN_SIZE, GRAIN_SIZE)
      const rnd = mulberry32(0x9e3779b1)
      // neutral speckle — light and dark in equal measure, so the tile works on
      // black paper and white paper alike
      for (let i = 0; i < img.data.length; i += 4) {
        const v = 60 + rnd() * 190
        img.data[i] = v
        img.data[i + 1] = v
        img.data[i + 2] = v
        img.data[i + 3] = rnd() * rnd() * 255
      }
      sg.putImageData(img, 0, 0)
      GRAIN_TILE = surf
    }
  }
  if (GRAIN_TILE) pat = g.createPattern(GRAIN_TILE, 'repeat') || null
  GRAIN_CACHE.set(g, pat)
  return pat
}

// ── the drawable set ─────────────────────────────────────────────────────────
// One entry per visible stroke, reused between frames: the trimmed centreline,
// its widths, the outline polygons, and the handful of derived numbers the modes
// ask for. Nothing here is ever handed back out, so the buffers can be shared.

const SHAPES = []
const COMP_IDS = []
const OPTS = { capStart: 'butt', capEnd: 'butt', join: 'round', miterLimit: 3, capScale: 1 }
const DASH = [0, 0]
const NO_DASH = []
let PBUF = new Float64Array(0)
let WBUF = new Float64Array(0)
let RBUF = new Float64Array(0)
let COV = new Float32Array(0)

const grow = (buf, n) => (buf.length >= n ? buf : new Float64Array(n))

const widthAt = (w, i) => {
  if (!w || !w.length) return 1
  const v = w[i < w.length ? i : w.length - 1]
  return Number.isFinite(v) && v > 0 ? v : 1
}

/** Innermost group at depth 1 — the component a reader parses, not the glyph. */
function topGroup(skel, s) {
  const anc = s.ancestry
  if (anc && anc.length) {
    for (let i = 0; i < anc.length; i++) {
      const grp = skel.groups[anc[i]]
      if (grp && grp.depth === 1) return anc[i]
    }
    return anc[anc.length - 1]
  }
  return typeof s.group === 'number' ? s.group : -1
}

function inRadical(skel, s) {
  const anc = s.ancestry
  if (!anc) return false
  for (let i = 0; i < anc.length; i++) {
    const grp = skel.groups[anc[i]]
    if (grp && grp.isRadical) return true
  }
  return false
}

/** Cut a shape's centreline at `cut` em of arc length, into the shared buffers. */
function cutStroke(sh, cut) {
  const pts = sh.pts
  const w = sh.w
  const m = pts.length >> 1
  PBUF = grow(PBUF, pts.length + 2)
  WBUF = grow(WBUF, m + 1)
  PBUF[0] = pts[0]
  PBUF[1] = pts[1]
  WBUF[0] = widthAt(w, 0)
  let k = 1
  let acc = 0
  for (let i = 1; i < m; i++) {
    const ax = pts[i * 2 - 2]
    const ay = pts[i * 2 - 1]
    const dx = pts[i * 2] - ax
    const dy = pts[i * 2 + 1] - ay
    const d = Math.hypot(dx, dy)
    if (acc + d >= cut) {
      const t = d > 1e-9 ? clamp((cut - acc) / d, 0, 1) : 0
      const w0 = widthAt(w, i - 1)
      PBUF[k * 2] = ax + dx * t
      PBUF[k * 2 + 1] = ay + dy * t
      WBUF[k] = w0 + (widthAt(w, i) - w0) * t
      k++
      break
    }
    acc += d
    PBUF[k * 2] = pts[i * 2]
    PBUF[k * 2 + 1] = pts[i * 2 + 1]
    WBUF[k] = widthAt(w, i)
    k++
  }
  sh.pts = PBUF.subarray(0, k * 2)
  sh.w = WBUF.subarray(0, k)
  sh.len = cut
}

/** Outline one shape and cache what the modes need to know about it. */
function finish(sh, p, i, n) {
  const caps = capsFor(sh.s, p)
  sh.capStart = caps.capStart
  sh.capEnd = caps.capEnd
  OPTS.capStart = caps.capStart
  OPTS.capEnd = caps.capEnd
  sh.polys = strokeOutline(sh.pts, sh.w, OPTS)
  const pts = sh.pts
  sh.ax = pts[0]
  sh.ay = pts[1]
  sh.bx = pts[pts.length - 2]
  sh.by = pts[pts.length - 1]
  sh.t = n > 1 ? i / (n - 1) : 0
  let mw = 0
  for (let j = 0; j < sh.w.length; j++) if (sh.w[j] > mw) mw = sh.w[j]
  sh.mw = mw > 0 ? mw : 1
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (const poly of sh.polys) {
    for (let j = 0; j < poly.length; j += 2) {
      if (poly[j] < x0) x0 = poly[j]
      if (poly[j] > x1) x1 = poly[j]
      if (poly[j + 1] < y0) y0 = poly[j + 1]
      if (poly[j + 1] > y1) y1 = poly[j + 1]
    }
  }
  sh.ok = x0 <= x1
  sh.x0 = sh.ok ? x0 : 0
  sh.y0 = sh.ok ? y0 : 0
  sh.x1 = sh.ok ? x1 : 0
  sh.y1 = sh.ok ? y1 : 0
}

/**
 * Collect every stroke that is visible at this write fraction. Strokes come in
 * writing order, so the animation is one walk along the cumulative ink length
 * with the straddling stroke cut mid-arc.
 */
function gather(skel, p) {
  let n = 0
  let total = 0
  for (const s of skel.strokes) {
    if (!s || !s.alive) continue
    const pts = trimmedPoints(s)
    if (!pts || pts.length < 4) continue
    const sh = SHAPES[n] || (SHAPES[n] = {})
    sh.s = s
    sh.pts = pts
    sh.w = trimmedWidths(s)
    const len = polylineLength(pts)
    sh.len = Number.isFinite(len) ? len : 0
    total += sh.len
    n++
  }

  const anim = num(p.rdWriteAnim, 1, 0, 1)
  if (anim < 1) {
    const target = total * anim
    let acc = 0
    let cut = n
    for (let i = 0; i < n; i++) {
      const sh = SHAPES[i]
      if (acc + sh.len <= target) {
        acc += sh.len
        continue
      }
      const left = target - acc
      cut = left > 1e-3 ? i + 1 : i
      if (left > 1e-3) cutStroke(sh, left)
      break
    }
    n = cut
  }

  for (let i = 0; i < n; i++) finish(SHAPES[i], p, i, n)

  // component colouring needs the whole set before it can hand out ramp slots
  COMP_IDS.length = 0
  for (let i = 0; i < n; i++) {
    const sh = SHAPES[i]
    sh.gi = topGroup(skel, sh.s)
    sh.radical = inRadical(skel, sh.s)
    if (sh.gi >= 0 && COMP_IDS.indexOf(sh.gi) < 0) COMP_IDS.push(sh.gi)
  }
  return n
}

// ── path helpers ─────────────────────────────────────────────────────────────

function addPolys(g, polys) {
  for (const poly of polys) {
    if (!poly || poly.length < 6) continue
    g.moveTo(poly[0], poly[1])
    for (let j = 2; j < poly.length; j += 2) g.lineTo(poly[j], poly[j + 1])
    g.closePath()
  }
}

function addAll(g, n) {
  for (let i = 0; i < n; i++) addPolys(g, SHAPES[i].polys)
}

function addCentre(g, pts) {
  g.moveTo(pts[0], pts[1])
  for (let i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1])
}

const clearShadow = (g) => {
  g.shadowColor = 'rgba(0, 0, 0, 0)'
  g.shadowBlur = 0
  g.shadowOffsetX = 0
  g.shadowOffsetY = 0
}

/** Shadow offsets ignore the transform, so they are quoted in device pixels. */
function setShadow(g, amt, angle, side, css) {
  const d = side * 0.022 * amt
  g.shadowColor = css
  g.shadowBlur = side * 0.02 * amt
  g.shadowOffsetX = Math.cos(angle) * d
  g.shadowOffsetY = Math.sin(angle) * d
}

// ── modes ────────────────────────────────────────────────────────────────────

function drawInk(g, n, p, px, side) {
  const op = num(p.rdOpacity, 1, 0.05, 1)
  const bleed = num(p.rdBleed, 0, 0, 1)
  const outw = num(p.rdOutlineW, 0, 0, 8)
  const shadow = num(p.rdShadow, 0, 0, 1)
  g.lineJoin = 'round'
  g.lineCap = 'round'
  g.beginPath()
  addAll(g, n)
  if (bleed > 0) {
    g.globalAlpha = op * 0.28
    g.strokeStyle = PAL.inkCss
    g.lineWidth = bleed * BLEED_EM
    g.stroke()
  }
  g.globalAlpha = op
  if (shadow > 0) setShadow(g, shadow, num(p.rdShadowAngle, 135, 0, 360) * DEG, side, PAL.glowCss)
  g.fillStyle = PAL.inkCss
  g.fill('nonzero')
  if (shadow > 0) clearShadow(g)
  if (outw > 0) {
    g.strokeStyle = PAL.accentCss
    g.lineWidth = outw * px
    g.stroke()
  }
}

function drawHollow(g, n, p, px) {
  g.globalAlpha = num(p.rdOpacity, 1, 0.05, 1)
  g.strokeStyle = PAL.inkCss
  g.lineWidth = Math.max(0.6, num(p.rdOutlineW, 0, 0, 8)) * px
  g.lineJoin = 'round'
  g.beginPath()
  addAll(g, n)
  g.stroke()
}

function drawSkeleton(g, n, p, px) {
  g.globalAlpha = num(p.rdOpacity, 1, 0.05, 1)
  g.strokeStyle = PAL.inkCss
  g.lineWidth = Math.max(0.8, num(p.rdOutlineW, 0, 0, 8)) * px * 1.4
  g.lineJoin = 'round'
  g.lineCap = 'round'
  g.beginPath()
  for (let i = 0; i < n; i++) addCentre(g, SHAPES[i].pts)
  g.stroke()

  const r = 1.9 * px
  g.beginPath()
  for (let i = 0; i < n; i++) {
    const pts = SHAPES[i].pts
    for (let j = 0; j < pts.length; j += 2) {
      g.moveTo(pts[j] + r, pts[j + 1])
      g.arc(pts[j], pts[j + 1], r, 0, TAU)
    }
  }
  g.globalAlpha = 0.75
  g.fillStyle = PAL.inkCss
  g.fill()

  g.beginPath()
  for (let i = 0; i < n; i++) {
    const sh = SHAPES[i]
    g.moveTo(sh.ax + r * 1.9, sh.ay)
    g.arc(sh.ax, sh.ay, r * 1.9, 0, TAU)
  }
  g.globalAlpha = 1
  g.fillStyle = PAL.accentCss
  g.fill()
}

function drawRibbon(g, n, p) {
  const grads = ribbonGradients(g)
  g.globalAlpha = num(p.rdOpacity, 1, 0.05, 1)
  for (let i = 0; i < n; i++) {
    const sh = SHAPES[i]
    const gi = rampIndex(sh.t)
    const dx = sh.bx - sh.ax
    const dy = sh.by - sh.ay
    const L = Math.hypot(dx, dy)
    if (!grads || !(L > MIN_RIBBON)) {
      g.beginPath()
      addPolys(g, sh.polys)
      g.fillStyle = PAL.ramp[gi]
      g.fill('nonzero')
      continue
    }
    // draw the stroke in its own frame — unit length along the chord — so one
    // cached gradient serves every stroke of every glyph
    const ux = dx / L
    const uy = dy / L
    g.save()
    g.transform(L * ux, L * uy, -L * uy, L * ux, sh.ax, sh.ay)
    g.beginPath()
    for (const poly of sh.polys) {
      if (!poly || poly.length < 6) continue
      for (let j = 0; j < poly.length; j += 2) {
        const rx = poly[j] - sh.ax
        const ry = poly[j + 1] - sh.ay
        const X = (rx * ux + ry * uy) / L
        const Y = (ry * ux - rx * uy) / L
        if (j === 0) g.moveTo(X, Y)
        else g.lineTo(X, Y)
      }
      g.closePath()
    }
    g.fillStyle = grads[gi]
    g.fill('nonzero')
    g.restore()
  }
}

function drawOrder(g, n, p, px, side) {
  const op = num(p.rdOpacity, 1, 0.05, 1)
  const shadow = num(p.rdShadow, 0, 0, 1)
  g.globalAlpha = op
  if (shadow > 0) setShadow(g, shadow, num(p.rdShadowAngle, 135, 0, 360) * DEG, side, PAL.glowCss)
  for (let i = 0; i < n; i++) {
    const sh = SHAPES[i]
    g.beginPath()
    addPolys(g, sh.polys)
    g.fillStyle = rampAt(sh.t)
    g.fill('nonzero')
  }
  if (shadow > 0) clearShadow(g)
}

function drawComponent(g, n, p) {
  const many = COMP_IDS.length > 1
  g.globalAlpha = num(p.rdOpacity, 1, 0.05, 1)
  for (let i = 0; i < n; i++) {
    const sh = SHAPES[i]
    g.beginPath()
    addPolys(g, sh.polys)
    if (sh.radical) g.fillStyle = PAL.accentCss
    else {
      const idx = COMP_IDS.indexOf(sh.gi)
      g.fillStyle = rampAt(many && idx >= 0 ? idx / (COMP_IDS.length - 1) : 0.5)
    }
    g.fill('nonzero')
  }
}

function drawXray(g, n, p) {
  const op = num(p.rdOpacity, 1, 0.05, 1)
  g.globalCompositeOperation = 'lighter'
  g.globalAlpha = op * 0.55
  for (let i = 0; i < n; i++) {
    const sh = SHAPES[i]
    g.beginPath()
    addPolys(g, sh.polys)
    g.fillStyle = rampAt(sh.t)
    g.fill('nonzero')
  }
  g.globalCompositeOperation = 'source-over'
}

function drawHatch(g, n, p, px) {
  const op = num(p.rdOpacity, 1, 0.05, 1)
  const step0 = Math.max(0.35, num(p.rdHatchStep, 8, 2, 24) * px)
  for (let i = 0; i < n; i++) {
    const sh = SHAPES[i]
    if (!sh.ok) continue
    const R = 0.5 * Math.hypot(sh.x1 - sh.x0, sh.y1 - sh.y0) + step0
    if (!(R > 0)) continue
    const lines = clamp(Math.ceil((2 * R) / step0), 1, MAX_HATCH) | 0
    g.save()
    g.beginPath()
    addPolys(g, sh.polys)
    g.clip('nonzero')
    g.globalAlpha = op * 0.12
    g.fillStyle = PAL.inkCss
    g.fill('nonzero')
    g.globalAlpha = op
    g.translate((sh.x0 + sh.x1) / 2, (sh.y0 + sh.y1) / 2)
    // hatching runs along the stroke, which is what makes a turn read as a turn
    g.rotate(Math.atan2(sh.by - sh.ay, sh.bx - sh.ax))
    g.beginPath()
    for (let j = 0; j <= lines; j++) {
      const t = -R + (2 * R * j) / lines
      g.moveTo(-R, t)
      g.lineTo(R, t)
    }
    g.lineWidth = px
    g.strokeStyle = PAL.inkCss
    g.stroke()
    g.restore()
  }
  g.globalAlpha = op * 0.4
  g.strokeStyle = PAL.inkCss
  g.lineWidth = px
  g.lineJoin = 'round'
  g.beginPath()
  addAll(g, n)
  g.stroke()
}

function drawContour(g, n, p, px, quality) {
  const op = num(p.rdOpacity, 1, 0.05, 1)
  const step = Math.max(0.5, num(p.rdContourStep, 9, 2, 24) * px)
  const maxRings = quality < 1 ? 6 : MAX_RINGS
  g.lineJoin = 'round'
  g.lineWidth = px * 1.1
  for (let i = 0; i < n; i++) {
    const sh = SHAPES[i]
    g.globalAlpha = op
    g.strokeStyle = PAL.inkCss
    g.beginPath()
    addPolys(g, sh.polys)
    g.stroke()

    const rings = clamp(Math.floor(sh.mw / step), 0, maxRings) | 0
    const m = sh.w.length
    RBUF = grow(RBUF, m)
    OPTS.capStart = sh.capStart
    OPTS.capEnd = sh.capEnd
    for (let r = 1; r <= rings; r++) {
      const inset = r * step
      let any = false
      for (let j = 0; j < m; j++) {
        const v = widthAt(sh.w, j) - inset
        RBUF[j] = v > 0.6 ? v : 0.6
        if (v > 0.6) any = true
      }
      if (!any) break
      // an inset of a variable-width ribbon is just the same centreline drawn
      // with a smaller pen, so the rings are exact rather than approximated
      const polys = strokeOutline(sh.pts, RBUF.subarray(0, m), OPTS)
      g.globalAlpha = op * (0.85 - (0.5 * r) / (rings + 1))
      g.strokeStyle = r % 5 === 0 ? PAL.accentCss : PAL.inkCss
      g.beginPath()
      addPolys(g, polys)
      g.stroke()
    }
  }
}

function drawLetterpress(g, n, p, px, side) {
  const op = num(p.rdOpacity, 1, 0.05, 1)
  const ang = num(p.rdShadowAngle, 135, 0, 360) * DEG
  const depth = 0.006 + 0.012 * num(p.rdShadow, 0.4, 0, 1)
  const off = Math.max(0.75, side * depth)
  g.globalAlpha = op
  g.beginPath()
  addAll(g, n)
  g.fillStyle = PAL.pressCss
  g.fill('nonzero')

  // Inner shadow: clip to the glyph, then fill everything *around* it. The fill
  // itself lands outside the clip and is thrown away — only its shadow, which
  // spills inward across the boundary, survives.
  for (let pass = 0; pass < 2; pass++) {
    const a = pass === 0 ? ang : ang + Math.PI
    g.save()
    g.beginPath()
    addAll(g, n)
    g.clip('nonzero')
    g.beginPath()
    g.rect(-8 * EM, -8 * EM, 17 * EM, 17 * EM)
    addAll(g, n)
    g.shadowColor = pass === 0 ? PAL.pressDarkCss : PAL.pressLightCss
    g.shadowBlur = off * 1.6
    g.shadowOffsetX = Math.cos(a) * off
    g.shadowOffsetY = Math.sin(a) * off
    g.fillStyle = PAL.paperCss
    g.fill('evenodd')
    clearShadow(g)
    g.restore()
  }
}

function drawNeon(g, n, p, px, side) {
  const op = num(p.rdOpacity, 1, 0.05, 1)
  g.beginPath()
  addAll(g, n)
  g.fillStyle = PAL.accentCss
  for (let i = 0; i < NEON_PASSES.length; i += 2) {
    g.shadowColor = PAL.glowCss
    g.shadowBlur = Math.max(1, side * NEON_PASSES[i])
    g.globalAlpha = op * NEON_PASSES[i + 1]
    g.fill('nonzero')
  }
  clearShadow(g)
  g.globalAlpha = op
  g.fillStyle = PAL.coreCss
  g.fill('nonzero')
}

/**
 * Halftone. Coverage is scattered from the ribbon rather than gathered per
 * cell: each segment touches only the cells inside its own swept box, which is
 * the difference between sampling the glyph's whole bounding box against every
 * segment and doing a few dozen tests per segment. Taking the max coverage into
 * a shared grid unions the strokes for free, so overlaps do not darken.
 */
function drawDot(g, n, p, px, quality) {
  const op = num(p.rdOpacity, 1, 0.05, 1)
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  let area = 0
  for (let i = 0; i < n; i++) {
    const sh = SHAPES[i]
    if (!sh.ok) continue
    if (sh.x0 < x0) x0 = sh.x0
    if (sh.y0 < y0) y0 = sh.y0
    if (sh.x1 > x1) x1 = sh.x1
    if (sh.y1 > y1) y1 = sh.y1
    const pts = sh.pts
    const m = pts.length >> 1
    for (let s = 1; s < m; s++) {
      const w = Math.max(widthAt(sh.w, s - 1), widthAt(sh.w, s))
      area += (Math.abs(pts[s * 2] - pts[s * 2 - 2]) + 2 * w) * (Math.abs(pts[s * 2 + 1] - pts[s * 2 - 1]) + 2 * w)
    }
  }
  if (!(x0 <= x1)) return

  let step = Math.max(0.4, num(p.rdHatchStep, 8, 2, 24) * px)
  // the screen frequency is the user's, until the cell count says otherwise
  const budget = DOT_BUDGET * quality
  if (area / (step * step) > budget) step = Math.sqrt(area / budget)
  const gx = x0 - step
  const gy = y0 - step
  const cols = clamp(Math.ceil((x1 - x0 + 2 * step) / step) + 1, 1, 4096) | 0
  const rows = clamp(Math.ceil((y1 - y0 + 2 * step) / step) + 1, 1, 4096) | 0
  const cells = cols * rows
  if (COV.length < cells) COV = new Float32Array(cells)
  COV.fill(0, 0, cells)

  for (let i = 0; i < n; i++) {
    const sh = SHAPES[i]
    if (!sh.ok || sh.pts.length < 4) continue
    const pts = sh.pts
    const m = pts.length >> 1
    for (let s = 1; s < m; s++) {
      const ax = pts[s * 2 - 2]
      const ay = pts[s * 2 - 1]
      const dx = pts[s * 2] - ax
      const dy = pts[s * 2 + 1] - ay
      const w0 = widthAt(sh.w, s - 1)
      const w1 = widthAt(sh.w, s)
      const pad = (w0 > w1 ? w0 : w1) + step
      const L2 = dx * dx + dy * dy
      const inv = L2 > 1e-9 ? 1 / L2 : 0
      const j0 = clamp(Math.floor((Math.min(ax, ax + dx) - pad - gx) / step), 0, cols - 1) | 0
      const j1 = clamp(Math.ceil((Math.max(ax, ax + dx) + pad - gx) / step), 0, cols - 1) | 0
      const i0 = clamp(Math.floor((Math.min(ay, ay + dy) - pad - gy) / step), 0, rows - 1) | 0
      const i1 = clamp(Math.ceil((Math.max(ay, ay + dy) + pad - gy) / step), 0, rows - 1) | 0
      for (let r = i0; r <= i1; r++) {
        const y = gy + (r + 0.5) * step
        const row = r * cols
        for (let c = j0; c <= j1; c++) {
          const x = gx + (c + 0.5) * step
          const t = clamp(((x - ax) * dx + (y - ay) * dy) * inv, 0, 1)
          const ex = x - (ax + dx * t)
          const ey = y - (ay + dy * t)
          const d = Math.hypot(ex, ey) - (w0 + (w1 - w0) * t)
          if (d >= 0.5 * step) continue
          const cov = clamp(0.5 - d / step, 0, 1)
          const k = row + c
          if (cov > COV[k]) COV[k] = cov
        }
      }
    }
  }

  g.beginPath()
  for (let r = 0; r < rows; r++) {
    const y = gy + (r + 0.5) * step
    for (let c = 0; c < cols; c++) {
      const cov = COV[r * cols + c]
      if (cov <= 0.03) continue
      const x = gx + (c + 0.5) * step
      const rad = 0.5 * step * Math.sqrt(cov) * DOT_GAIN
      g.moveTo(x + rad, y)
      g.arc(x, y, rad, 0, TAU)
    }
  }
  g.globalAlpha = op
  g.fillStyle = PAL.inkCss
  g.fill()
}

function drawWire(g, n, p, px) {
  const op = num(p.rdOpacity, 1, 0.05, 1)
  const lw = Math.max(0.7, num(p.rdOutlineW, 0, 0, 8)) * px
  g.lineJoin = 'round'
  g.lineCap = 'butt'

  g.globalAlpha = op * 0.85
  g.strokeStyle = PAL.inkCss
  g.lineWidth = lw
  g.beginPath()
  addAll(g, n)
  g.stroke()

  // tick marks at every sample, the way a drafted curve carries its stations
  const tick = 2.6 * px
  g.globalAlpha = op * 0.45
  g.beginPath()
  for (let i = 0; i < n; i++) {
    const pts = SHAPES[i].pts
    const m = pts.length >> 1
    for (let j = 0; j < m; j++) {
      const a = j > 0 ? j - 1 : 0
      const b = j < m - 1 ? j + 1 : m - 1
      let dx = pts[b * 2] - pts[a * 2]
      let dy = pts[b * 2 + 1] - pts[a * 2 + 1]
      const L = Math.hypot(dx, dy)
      if (!(L > 1e-6)) continue
      dx /= L
      dy /= L
      g.moveTo(pts[j * 2] + dy * tick, pts[j * 2 + 1] - dx * tick)
      g.lineTo(pts[j * 2] - dy * tick, pts[j * 2 + 1] + dx * tick)
    }
  }
  g.stroke()

  DASH[0] = 7 * px
  DASH[1] = 5 * px
  g.setLineDash(DASH)
  g.globalAlpha = op
  g.strokeStyle = PAL.accentCss
  g.lineWidth = lw
  g.beginPath()
  for (let i = 0; i < n; i++) addCentre(g, SHAPES[i].pts)
  g.stroke()
  g.setLineDash(NO_DASH)

  g.beginPath()
  for (let i = 0; i < n; i++) {
    const sh = SHAPES[i]
    g.moveTo(sh.ax + 3 * px, sh.ay)
    g.arc(sh.ax, sh.ay, 3 * px, 0, TAU)
  }
  g.stroke()
}

// ── overlays ─────────────────────────────────────────────────────────────────

function drawGrid(g, em, px) {
  g.globalAlpha = 1
  g.strokeStyle = PAL.gridCss
  g.lineWidth = px
  g.beginPath()
  g.rect(0, 0, em, em)
  g.stroke()
  g.globalAlpha = 0.7
  DASH[0] = 6 * px
  DASH[1] = 6 * px
  g.setLineDash(DASH)
  g.beginPath()
  g.moveTo(em / 2, 0)
  g.lineTo(em / 2, em)
  g.moveTo(0, em / 2)
  g.lineTo(em, em / 2)
  g.stroke()
  g.setLineDash(NO_DASH)
  g.globalAlpha = 0.35
  g.beginPath()
  for (let i = 1; i < 3; i++) {
    g.moveTo((em * i) / 3, 0)
    g.lineTo((em * i) / 3, em)
    g.moveTo(0, (em * i) / 3)
    g.lineTo(em, (em * i) / 3)
  }
  g.stroke()
  g.globalAlpha = 1
}

/** The pristine skeleton, assuming the em transform is already in place. */
function strokeGhost(g, skel, px) {
  g.globalAlpha = 0.75
  g.strokeStyle = PAL.ghostCss
  g.lineWidth = 1.4 * px
  g.lineJoin = 'round'
  g.lineCap = 'round'
  DASH[0] = 5 * px
  DASH[1] = 5 * px
  g.setLineDash(DASH)
  g.beginPath()
  for (const s of skel.strokes) {
    const r = s.ref
    if (!r || r.length < 4) continue
    addCentre(g, r)
  }
  g.stroke()
  g.setLineDash(NO_DASH)
  g.globalAlpha = 1
}

function drawNumbers(g, n, px) {
  const r = 11 * px
  g.font = '600 ' + (r * 1.25).toFixed(2) + 'px ' + FONT_STACK
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  for (let i = 0; i < n; i++) {
    const sh = SHAPES[i]
    // sit the badge just behind the entry point, off the ink where possible
    let dx = sh.ax - sh.pts[2]
    let dy = sh.ay - sh.pts[3]
    const L = Math.hypot(dx, dy)
    if (L > 1e-6) {
      dx /= L
      dy /= L
    } else {
      dx = 0
      dy = 0
    }
    const x = sh.ax + dx * r * 0.9
    const y = sh.ay + dy * r * 0.9
    g.globalAlpha = 0.88
    g.fillStyle = PAL.paperCss
    g.beginPath()
    g.moveTo(x + r, y)
    g.arc(x, y, r, 0, TAU)
    g.fill()
    g.globalAlpha = 1
    g.fillStyle = PAL.accentCss
    g.fillText(String((sh.s.i | 0) + 1), x, y)
  }
}

function drawGrain(g, ox, oy, side, amt) {
  const pat = grainPattern(g)
  if (!pat) return
  g.save()
  g.globalAlpha = amt * 0.4
  g.fillStyle = pat
  g.fillRect(ox, oy, side, side)
  g.restore()
}

// ── entry points ─────────────────────────────────────────────────────────────

// Mapping is shared by the glyph and the ghost, and both are called on the same
// box, so one scratch record is enough.
const M = { ok: false, k: 1, ox: 0, oy: 0, side: 1, px: 1, em: EM }

function mapBox(skel, box) {
  M.ok = false
  if (!box) return M
  const em = Number.isFinite(skel.em) && skel.em > 0 ? skel.em : EM
  const w = num(box.w, 0, 0, 1e7)
  const h = num(box.h, 0, 0, 1e7)
  if (!(w > 0.5) || !(h > 0.5)) return M
  // uniform scale, centred: a non-square box must not shear the glyph
  const k = Math.min(w, h) / em
  M.em = em
  M.k = k
  M.side = em * k
  M.px = 1 / k
  M.ox = num(box.x, 0, -1e7, 1e7) + (w - M.side) / 2
  M.oy = num(box.y, 0, -1e7, 1e7) + (h - M.side) / 2
  M.ok = true
  return M
}

/**
 * Paint one finished skeleton into `box` (device pixels). The context is left
 * exactly as it was found; the skeleton is only read.
 */
export function renderGlyph(g, skel, P, ctx, box) {
  if (!g || !skel || !skel.strokes) return
  const m = mapBox(skel, box)
  if (!m.ok) return
  const p = P || {}
  const px = m.px
  const quality = ctx && Number.isFinite(ctx.quality) ? clamp(ctx.quality, 0.2, 1) : 1
  const mode = MODE_IDS.has(p.rdMode) ? p.rdMode : 'ink'
  palette(p)
  const n = gather(skel, p)

  g.save()
  g.translate(m.ox, m.oy)
  g.scale(m.k, m.k)
  if (p.rdShowGrid) drawGrid(g, m.em, px)
  if (p.rdShowRef) strokeGhost(g, skel, px)
  if (mode === 'hollow') drawHollow(g, n, p, px)
  else if (mode === 'skeleton') drawSkeleton(g, n, p, px)
  else if (mode === 'ribbon') drawRibbon(g, n, p)
  else if (mode === 'order') drawOrder(g, n, p, px, m.side)
  else if (mode === 'component') drawComponent(g, n, p)
  else if (mode === 'xray') drawXray(g, n, p)
  else if (mode === 'hatch') drawHatch(g, n, p, px)
  else if (mode === 'contour') drawContour(g, n, p, px, quality)
  else if (mode === 'letterpress') drawLetterpress(g, n, p, px, m.side)
  else if (mode === 'neon') drawNeon(g, n, p, px, m.side)
  else if (mode === 'dot') drawDot(g, n, p, px, quality)
  else if (mode === 'wire') drawWire(g, n, p, px)
  else drawInk(g, n, p, px, m.side)
  if (p.rdShowOrder) drawNumbers(g, n, px)
  g.restore()

  const grain = num(p.rdGrain, 0, 0, 1)
  if (grain > 0 && quality > 0.5) drawGrain(g, m.ox, m.oy, m.side, grain)
}

/** The untouched skeleton, for showing what the pipeline moved. */
export function renderReferenceGhost(g, skel, P, box) {
  if (!g || !skel || !skel.strokes) return
  const m = mapBox(skel, box)
  if (!m.ok) return
  palette(P || {})
  g.save()
  g.translate(m.ox, m.oy)
  g.scale(m.k, m.k)
  strokeGhost(g, skel, m.px)
  g.restore()
}
