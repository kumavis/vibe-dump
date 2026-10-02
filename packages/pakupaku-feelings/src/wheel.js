// The fortune teller's geometry, and the SVG for each flap of it.
//
// Lying open, the paper looks like this (not to scale):
//
//           ╱‾‾‾‾‾ needs: pointed petals, one fan per closer word ‾‾‾‾‾╲
//         ╱   closer words: a fan of trapezoids around one core      ╲
//        │              ┌───────┬───────┐                             │
//        │              │╲  core│core  ╱│   eight core feelings: the  │
//        │              │  ╲    │    ╱  │   eight triangles inside a  │
//        │              ├─────── ───────┤   flattened paper fortune   │
//        │              │  ╱    │    ╲  │   teller                    │
//        │              │╱      │      ╲│                             │
//                       └───────┴───────┘
//
// A closer-word fan is centred on its core's triangle and unfolds from it: the
// middle trapezoid swings up off the square's edge, then each neighbour swings
// out sideways off the one before. A needs fan does the same off the outer edge
// of its closer word.

import { Flap, nextSeq } from './fold.js'

const SVGNS = 'http://www.w3.org/2000/svg'
const DEG = Math.PI / 180

export const G = {
  H: 130, // half the square
  HO: 140, // the square plus the gap before the closer-word fan
  R1: 320, // outer edge of the closer-word fan
  R2I: 331, // inner edge of the needs fan
  R2S: 394, // a needs petal's shoulders, where it starts to narrow
  R2T: 484, // the tip of a needs petal
  D1: 22.5, // degrees per closer word
  D2: 20, // degrees per need
}

export const INK = '#3b2b25'
const PAPER_BACK = '#fbf6ea'

// ---------------------------------------------------------------- geometry --

const at = (r, a) => [r * Math.cos(a * DEG), r * Math.sin(a * DEG)]
const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]

/** Distance from the centre to a square of half-side `half`, along angle `a`. */
export function toSquare(a, half) {
  const c = Math.abs(Math.cos(a * DEG)), s = Math.abs(Math.sin(a * DEG))
  return half / Math.max(c, s)
}

/** The offset square's outline from angle a0 to a1, corners included. */
function squarePath(a0, a1, half) {
  const pts = [at(toSquare(a0, half), a0)]
  for (let k = -12; k <= 12; k++) {
    const ca = 45 + 90 * k
    if (ca > a0 + 1e-6 && ca < a1 - 1e-6) pts.push([Math.sign(Math.cos(ca * DEG)) * half, Math.sign(Math.sin(ca * DEG)) * half])
  }
  pts.push(at(toSquare(a1, half), a1))
  return pts
}

export function bbox(polys) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const poly of polys) {
    for (const [x, y] of poly) {
      if (x < x0) x0 = x
      if (y < y0) y0 = y
      if (x > x1) x1 = x
      if (y > y1) y1 = y
    }
  }
  return { x0, y0, x1, y1 }
}

/** Where a horizontal line at `y` crosses the polygon, around `x`. */
function spanAt(poly, x, y) {
  const xs = []
  for (let i = 0; i < poly.length; i++) {
    const [ax, ay] = poly[i]
    const [bx, by] = poly[(i + 1) % poly.length]
    if ((ay <= y && by > y) || (by <= y && ay > y)) xs.push(ax + ((y - ay) / (by - ay)) * (bx - ax))
  }
  xs.sort((a, b) => a - b)
  for (let i = 0; i + 1 < xs.length; i += 2) if (x >= xs[i] - 1 && x <= xs[i + 1] + 1) return [xs[i], xs[i + 1]]
  return xs.length >= 2 ? [xs[0], xs[xs.length - 1]] : [x - 40, x + 40]
}

// ------------------------------------------------------------------ colour --

function hex(c) {
  const n = parseInt(c.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
function rgb([r, g, b]) {
  return `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)})`
}
export function mix(a, b, t) {
  const A = hex(a), B = hex(b)
  return rgb(A.map((v, i) => v + (B[i] - v) * t))
}
export function darken(a, t) {
  return mix(a, '#2a1a12', t)
}
export function lighten(a, t) {
  return mix(a, '#ffffff', t)
}

// ------------------------------------------------------------------- text --

const measurer = document.createElement('canvas').getContext('2d')
export const LABEL_FONT = '"Patrick Hand", "Comic Sans MS", "Segoe Print", cursive'

function measure(text, size) {
  measurer.font = `${size}px ${LABEL_FONT}`
  return measurer.measureText(text).width
}

/** A horizontal label centred in `poly` around `p`, shrunk to fit if need be. */
function label(poly, p, text, size, cls = 'lbl') {
  const [l, r] = spanAt(poly, p[0], p[1])
  const room = r - l - 14
  const w = measure(text, size)
  const fit = w > room ? Math.max(size * 0.62, (size * room) / w) : size
  const x = (l + r) / 2
  // Pull the label back toward the anchor when the span is lopsided, so it
  // stays visually tied to where the paper is widest along the fold's spine.
  const cx = Math.abs(x - p[0]) > 24 ? p[0] + Math.sign(x - p[0]) * 24 : x
  return `<text class="${cls}" x="${cx.toFixed(1)}" y="${p[1].toFixed(1)}" font-size="${fit.toFixed(1)}" dy="0.34em">${text}</text>`
}

// ----------------------------------------------------------------- drawing --

const pts = (poly) => poly.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ')

function el(markup, attrs) {
  const g = document.createElementNS(SVGNS, 'g')
  for (const [k, v] of Object.entries(attrs)) g.setAttribute(k, v)
  g.innerHTML = markup
  return g
}

/**
 * A two-faced flap. `facets` is a list of [poly, colour] tiled over the front;
 * `crease` an optional valley line drawn on both faces.
 */
function flapEl({ poly, facets, back, crease, extra = '', attrs = {} }) {
  const outline = pts(poly)
  const creaseLine = crease ? `<line class="crease" x1="${crease[0][0]}" y1="${crease[0][1]}" x2="${crease[1][0]}" y2="${crease[1][1]}"/>` : ''
  const front =
    facets.map(([fp, c]) => `<polygon points="${pts(fp)}" fill="${c}" stroke="${c}" stroke-width="0.6"/>`).join('') +
    `<polygon class="grain" points="${outline}"/>` +
    creaseLine +
    `<polygon class="edge" points="${outline}"/>` +
    extra
  const backFace =
    `<polygon points="${outline}" fill="${back}"/>` +
    `<polygon class="grain" points="${outline}"/>` +
    creaseLine +
    `<polygon class="edge" points="${outline}"/>`
  return el(
    `<g class="front">${front}</g><g class="back" style="display:none">${backFace}</g>` +
      `<polygon class="shade" points="${outline}" style="opacity:0"/><polygon class="veil" points="${outline}"/>`,
    { class: 'flap', ...attrs },
  )
}

// ------------------------------------------------------------------- faces --

// Little ink faces, drawn upright. Each is a list of SVG bits around (0, 0) at
// radius 16; they're placed and scaled by `face()`.
const FACES = {
  happy: `<circle cx="-5.5" cy="-3" r="1.9" class="ink-dot"/><circle cx="5.5" cy="-3" r="1.9" class="ink-dot"/><path d="M-7 3 Q0 11 7 3" class="ink"/>`,
  excited: `<circle cx="-5.5" cy="-4" r="2.3" class="ink-dot"/><circle cx="5.5" cy="-4" r="2.3" class="ink-dot"/><path d="M-6.5 2 Q0 2 6.5 2 Q6 10 0 10.5 Q-6 10 -6.5 2Z" class="ink-fill"/>`,
  loving: `<path d="M-8 -3 Q-5.5 -6.5 -3 -3" class="ink"/><path d="M3 -3 Q5.5 -6.5 8 -3" class="ink"/><circle cx="-9" cy="3" r="2.6" class="blush"/><circle cx="9" cy="3" r="2.6" class="blush"/><path d="M-5 3.5 Q0 8.5 5 3.5" class="ink"/>`,
  calm: `<path d="M-8.5 -3 Q-5.5 0 -2.5 -3" class="ink"/><path d="M2.5 -3 Q5.5 0 8.5 -3" class="ink"/><path d="M-4 5 Q0 7.5 4 5" class="ink"/>`,
  tired: `<path d="M-8.5 -2.5 L-2.5 -2.5" class="ink"/><path d="M2.5 -2.5 L8.5 -2.5" class="ink"/><path d="M-8 -2.5 Q-5.5 0.5 -3 -2.5" class="ink thin"/><path d="M3 -2.5 Q5.5 0.5 8 -2.5" class="ink thin"/><ellipse cx="0" cy="6.5" rx="2.6" ry="3" class="ink"/><text x="10" y="-8" class="zz">z</text>`,
  sad: `<path d="M-8.5 -7.5 L-3 -9.5" class="ink thin"/><path d="M3 -9.5 L8.5 -7.5" class="ink thin"/><circle cx="-5.5" cy="-3" r="1.9" class="ink-dot"/><circle cx="5.5" cy="-3" r="1.9" class="ink-dot"/><path d="M-6 8 Q0 2.5 6 8" class="ink"/><path d="M-6 1 Q-7.6 4 -6 5 Q-4.4 4 -6 1Z" class="tear"/>`,
  scared: `<path d="M-9 -9 Q-5.5 -11.5 -2.5 -9.5" class="ink thin"/><path d="M2.5 -9.5 Q5.5 -11.5 9 -9" class="ink thin"/><circle cx="-5.5" cy="-3.5" r="3" class="ink"/><circle cx="5.5" cy="-3.5" r="3" class="ink"/><circle cx="-5.5" cy="-3.5" r="1" class="ink-dot"/><circle cx="5.5" cy="-3.5" r="1" class="ink-dot"/><path d="M-7 7 Q-5 4.5 -3.5 7 Q-1.75 9.5 0 7 Q1.75 4.5 3.5 7 Q5 9.5 7 7" class="ink"/>`,
  angry: `<path d="M-9 -8 L-2.5 -5" class="ink"/><path d="M2.5 -5 L9 -8" class="ink"/><circle cx="-5" cy="-1.5" r="1.9" class="ink-dot"/><circle cx="5" cy="-1.5" r="1.9" class="ink-dot"/><path d="M-6 8.5 Q0 3 6 8.5" class="ink"/>`,
}

export function faceMarkup(id, x, y, r, color) {
  const s = r / 16
  return (
    `<g class="face" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(3)})">` +
    `<circle r="15.5" fill="#fffaf0" stroke="${darken(color, 0.25)}" stroke-width="1.6"/>${FACES[id] ?? FACES.calm}</g>`
  )
}

// ------------------------------------------------------------------- build --

/** The paper the core sits on, with its drop shadow. Static. */
export function baseMarkup() {
  const h = G.H + 5
  return `<rect x="${-h}" y="${-h}" width="${2 * h}" height="${2 * h}" rx="3" class="base"/>`
}

/** The eight core triangles. */
export function buildCores(sheet, cores) {
  const flaps = []
  for (const core of cores) {
    const c = core.angle
    const a0 = c - 22.5, a1 = c + 22.5
    const p0 = at(toSquare(a0, G.H), a0)
    const p1 = at(toSquare(a1, G.H), a1)
    const e = at(toSquare(c, G.H), c)
    const O = [0, 0]
    const poly = [O, p0, p1]
    const fA = [O, p0, e]
    const fB = [O, e, p1]
    // The lit side of each crease faces the upper-left light.
    const litFirst = Math.sin((a0 - 225) * DEG) < Math.sin((a1 - 225) * DEG)
    const light = lighten(core.color, 0.1), dark = darken(core.color, 0.07)
    // Each triangle is a right triangle: centre, the midpoint of a side (M),
    // and a corner (K). Horizontal text wants the triangle's widest rows: near
    // the centre line when M is on a left/right side, out by the edge when M is
    // on the top/bottom. The face takes the room that's left.
    const onAxis = (p) => Math.abs(p[0]) < 1e-6 || Math.abs(p[1]) < 1e-6
    const M = onAxis(p0) ? p0 : p1
    const K = onAxis(p0) ? p1 : p0
    const along = (m, k) => [M[0] * m + (K[0] - M[0]) * k, M[1] * m + (K[1] - M[1]) * k]
    const sideways = Math.abs(M[1]) < 1e-6
    const textPt = sideways ? along(0.6, 0.17) : along(0.86, 0.42)
    const facePt = sideways ? along(0.75, 0.5) : along(0.48, 0.19)
    const extra = faceMarkup(core.id, facePt[0], facePt[1], 15.5, core.color) + label(poly, textPt, core.word, 23, 'lbl core-lbl')
    const g = flapEl({
      poly,
      facets: [[fA, litFirst ? light : dark], [fB, litFirst ? dark : light]],
      back: mix(PAPER_BACK, core.color, 0.1),
      crease: [O, e],
      extra,
      attrs: { 'data-kind': 'core', 'data-id': core.id, 'data-pick': '' },
    })
    const f = new Flap({ poly, el: g, liftHinge: [p1, p0] })
    f.seq = nextSeq()
    f.kind = 'core'
    f.id = core.id
    sheet.add(f)
    flaps.push(f)
  }
  return flaps
}

/** Four pastel flaps folded over the square, which open out like petals. */
export function buildCovers(sheet) {
  const H = G.H
  const colors = ['#f6b2c3', '#9fd0f0', '#f9df84', '#a8dca4']
  const edges = [
    [[-H, -H], [H, -H]],
    [[H, -H], [H, H]],
    [[H, H], [-H, H]],
    [[-H, H], [-H, -H]],
  ]
  return edges.map(([p, q], i) => {
    const m = mid(p, q)
    const apex = [m[0] * 2, m[1] * 2]
    const poly = [p, q, apex]
    const g = flapEl({
      poly,
      facets: [[[p, m, apex], lighten(colors[i], 0.35)], [[m, q, apex], lighten(colors[i], 0.2)]],
      back: colors[i],
      crease: [m, apex],
      attrs: { 'data-kind': 'cover', 'aria-hidden': 'true' },
    })
    const f = new Flap({ poly, el: g, hinge: [p, q], angle: 180 })
    f.seq = nextSeq()
    f.kind = 'cover'
    sheet.add(f)
    return f
  })
}

/**
 * Open a fan of trapezoids or petals. `slots` are [a0, a1] angle ranges in
 * order; the root is the slot nearest `centre`, hinged on `rootHinge(slot)`;
 * the rest hang off their neighbour toward the root by the shared radial edge.
 */
function buildFan(sheet, { slots, centre, make, rootHinge, sideHinge }) {
  let root = 0
  let best = Infinity
  slots.forEach(([a0, a1], i) => {
    const d = Math.abs((a0 + a1) / 2 - centre)
    if (d < best - 1e-6) {
      best = d
      root = i
    }
  })
  const flaps = new Array(slots.length)
  const mk = (i, parent, hinge) => {
    const { poly, g, liftHinge } = make(slots[i], i)
    const f = new Flap({ poly, el: g, parent, hinge, liftHinge, angle: parent ? 180 : 90 })
    f.seq = nextSeq()
    f.index = i
    f.slot = slots[i]
    sheet.add(f)
    flaps[i] = f
    return f
  }
  const r = mk(root, null, rootHinge(slots[root]))
  r.order = 0
  let prev = r
  for (let i = root - 1; i >= 0; i--) {
    prev = mk(i, prev, sideHinge(slots[i][1]))
    prev.order = root - i
  }
  prev = r
  for (let i = root + 1; i < slots.length; i++) {
    prev = mk(i, prev, sideHinge(slots[i][0]))
    prev.order = i - root
  }
  return { flaps, root: r }
}

function centredSlots(centre, n, step) {
  const start = centre - (n * step) / 2
  return Array.from({ length: n }, (_, i) => [start + i * step, start + (i + 1) * step])
}

/** The closer-word fan around one core feeling. */
export function buildCloserFan(sheet, core) {
  const n = core.closer.length
  const slots = centredSlots(core.angle, n, G.D1)
  return buildFan(sheet, {
    slots,
    centre: core.angle,
    rootHinge: ([a0, a1]) => [at(toSquare(a0, G.HO), a0), at(toSquare(a1, G.HO), a1)],
    sideHinge: (a) => [at(toSquare(a, G.HO), a), at(G.R1, a)],
    make: ([a0, a1], i) => {
      const am = (a0 + a1) / 2
      const word = core.closer[i]
      const inner = squarePath(a0, a1, G.HO)
      const o0 = at(G.R1, a0), o1 = at(G.R1, a1)
      const poly = [...inner, o1, o0]
      const im = at(toSquare(am, G.HO), am)
      const om = mid(o0, o1)
      const fA = [...squarePath(a0, am, G.HO), om, o0]
      const fB = [...squarePath(am, a1, G.HO), o1, om]
      // Alternate two tints so neighbouring words read as separate sheets.
      const dark = lighten(core.color, i % 2 ? 0.42 : 0.3)
      const light = lighten(core.color, i % 2 ? 0.5 : 0.38)
      const litFirst = Math.sin((a0 - 225) * DEG) < Math.sin((a1 - 225) * DEG)
      const rIn = toSquare(am, G.HO)
      const rOut = G.R1 * Math.cos((G.D1 / 2) * DEG)
      const tp = at(rIn + (rOut - rIn) * 0.56, am)
      const g = flapEl({
        poly,
        facets: [
          [fA, litFirst ? light : dark],
          [fB, litFirst ? dark : light],
        ],
        back: mix(PAPER_BACK, core.color, 0.12),
        crease: [im, om],
        extra: label(poly, tp, word.word, 19.5),
        attrs: { 'data-kind': 'closer', 'data-id': word.id, 'data-pick': '' },
      })
      return { poly, g, liftHinge: [inner[0], inner[inner.length - 1]] }
    },
  })
}

/** The needs fan off one closer word. */
export function buildNeedsFan(sheet, centre, needs, families) {
  const slots = centredSlots(centre, needs.length, G.D2)
  return buildFan(sheet, {
    slots,
    centre,
    rootHinge: ([a0, a1]) => [at(G.R2I, a0), at(G.R2I, a1)],
    sideHinge: (a) => [at(G.R2I, a), at(G.R2S, a)],
    make: ([a0, a1], i) => {
      const am = (a0 + a1) / 2
      const need = needs[i]
      const color = families[need.family].color
      const i0 = at(G.R2I, a0), i1 = at(G.R2I, a1)
      const o0 = at(G.R2S, a0), o1 = at(G.R2S, a1)
      const tip = at(G.R2T, am)
      const im = mid(i0, i1)
      const poly = [i0, i1, o1, tip, o0]
      const litFirst = Math.sin((a0 - 225) * DEG) < Math.sin((a1 - 225) * DEG)
      const light = lighten(color, 0.28), dark = lighten(color, 0.08)
      const tp = at(G.R2I + (G.R2S - G.R2I) * 0.72, am)
      const g = flapEl({
        poly,
        facets: [
          [[i0, im, tip, o0], litFirst ? light : dark],
          [[im, i1, o1, tip], litFirst ? dark : light],
        ],
        back: mix(PAPER_BACK, color, 0.14),
        crease: [im, tip],
        extra: label(poly, tp, need.name, 18.5),
        attrs: { 'data-kind': 'need', 'data-id': need.name, 'data-pick': '' },
      })
      return { poly, g, liftHinge: [i1, i0] }
    },
  })
}
