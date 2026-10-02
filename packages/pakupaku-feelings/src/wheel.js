// The fortune teller's geometry, and the SVG for each flap of it.
//
// It is one square of paper, the way a real fortune teller is:
//
//                        ◇  the four corner flaps, folded out, make a diamond
//                      ╱ │ ╲
//                    ╱───┼───╲    eight core triangles, each folded in over
//                  ◇ │ ╲ │ ╱ │ ◇  one half-side of the square — so their
//                    ╲─╱─┼─╲─╱    outer edges, opened out, are the diamond's
//                      ╲ │ ╱      rim
//                        ◇
//
// Opening a core flips its triangle out over its side of the square, onto the
// diamond. Its closer words are folded up inside it: the first unfolds off the
// triangle's outer edge (the diamond's rim), and the rest fan out sideways
// around the ring, each off the one before. A closer word's needs are folded up
// inside it the same way and open off its outer edge as a crown of petals.

import { Flap, nextSeq } from './fold.js'

const SVGNS = 'http://www.w3.org/2000/svg'
const DEG = Math.PI / 180

const H = 120 // half the square
export const G = {
  H,
  // Where the closer words start: the diamond the opened corner flaps make
  // (|x| + |y| = 2H), pushed out by a hairline gap.
  DI: 2 * H + 8 * Math.SQRT2,
  R1: 356, // outer edge of the closer-word ring
  R2I: 366, // inner edge of the needs fan
  R2S: 428, // a needs petal's shoulders, where it starts to narrow
  R2T: 498, // the tip of a needs petal
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

/** Distance from the centre to the diamond |x| + |y| = d, along angle `a`. */
function toDiamond(a, d) {
  return d / (Math.abs(Math.cos(a * DEG)) + Math.abs(Math.sin(a * DEG)))
}

/** The diamond's outline from angle a0 to a1, its points included. */
function diamondPath(a0, a1, d) {
  const pts = [at(toDiamond(a0, d), a0)]
  for (let k = -8; k <= 8; k++) {
    const ca = 90 * k
    if (ca > a0 + 1e-6 && ca < a1 - 1e-6) pts.push(at(d, ca))
  }
  pts.push(at(toDiamond(a1, d), a1))
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
// Patrick Hand has no Japanese; those characters fall through to Klee One.
export const LABEL_FONT = '"Patrick Hand", "Klee One", "Comic Sans MS", "Segoe Print", cursive'

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
  return (
    `<text class="${cls}" x="${cx.toFixed(1)}" y="${p[1].toFixed(1)}" font-size="${fit.toFixed(1)}" dy="0.34em">${esc(text)}</text>` +
    // A dot under the word that takes the click — a precise target for tests
    // and the thumbnail shooter, which press an element's centre.
    `<circle class="hit" cx="${cx.toFixed(1)}" cy="${p[1].toFixed(1)}" r="3"/>`
  )
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

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
function flapEl({ poly, facets, back, backArt = '', crease, extra = '', title = '', attrs = {} }) {
  const outline = pts(poly)
  const creaseLine = crease ? `<line class="crease" x1="${crease[0][0]}" y1="${crease[0][1]}" x2="${crease[1][0]}" y2="${crease[1][1]}"/>` : ''
  const front =
    facets.map(([fp, c]) => `<polygon points="${pts(fp)}" fill="${c}" stroke="${c}" stroke-width="0.6"/>`).join('') +
    `<polygon class="grain" points="${outline}"/>` +
    creaseLine +
    `<polygon class="edge" points="${outline}"/>` +
    extra
  const backFace =
    (backArt || `<polygon points="${outline}" fill="${back}"/>` + creaseLine) +
    `<polygon class="grain" points="${outline}"/>` +
    `<polygon class="edge" points="${outline}"/>`
  return el(
    (title ? `<title>${esc(title)}</title>` : '') +
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

/** A core triangle's corners: the centre O, the midpoint M of the side it
 * folds over, and the corner K at the other end of that half-side. */
function corners(core) {
  const a0 = core.angle - 22.5, a1 = core.angle + 22.5
  const p0 = at(toSquare(a0, G.H), a0)
  const p1 = at(toSquare(a1, G.H), a1)
  const onAxis = (p) => Math.abs(p[0]) < 1e-6 || Math.abs(p[1]) < 1e-6
  return { p0, p1, M: onAxis(p0) ? p0 : p1, K: onAxis(p0) ? p1 : p0 }
}

/**
 * The paper the core sits on, with its drop shadow — and, under each
 * triangle, a flower for whoever opens it. `flower(color, opts)` draws one.
 */
export function baseMarkup(cores, flower) {
  const h = G.H + 5
  let out = `<rect x="${-h}" y="${-h}" width="${2 * h}" height="${2 * h}" rx="3" class="base"/>`
  const r = (G.H * (2 - Math.SQRT2)) / 2 // the triangle's inscribed circle
  for (const core of cores) {
    const { M, K } = corners(core)
    const toO = [-M[0] / G.H, -M[1] / G.H]
    const toK = [(K[0] - M[0]) / G.H, (K[1] - M[1]) / G.H]
    const x = M[0] + r * (toO[0] + toK[0]), y = M[1] + r * (toO[1] + toK[1])
    out += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})" class="hidden-flower">${flower(core.color, { petals: 6, r: r * 0.9, turn: core.angle })}</g>`
  }
  return out
}

/**
 * The eight core triangles. Each one's resting state is *folded*: its flat
 * shape is where it lies opened out, over its side of the square, and at rest
 * it sits at 180° — folded in over that side. So what you see on the square is
 * its back, and that is where the coloured feeling is drawn (pre-mirrored
 * across the fold, so the fold puts it the right way round). Opened out, it
 * shows its pale inside, with the word again.
 */
export function buildCores(sheet, cores) {
  const flaps = []
  for (const core of cores) {
    const c = core.angle
    const { p0, p1, M, K } = corners(core)
    const e = at(toSquare(c, G.H), c)
    const O = [0, 0]
    const inside = [O, p0, p1]
    // Folding over a left/right side mirrors x; over a top/bottom side, y.
    const sideways = Math.abs(M[1]) < 1e-6
    const flip = sideways ? ([x, y]) => [2 * M[0] - x, y] : ([x, y]) => [x, 2 * M[1] - y]
    const mirror = sideways ? `matrix(-1 0 0 1 ${2 * M[0]} 0)` : `matrix(1 0 0 -1 0 ${2 * M[1]})`
    const open = inside.map(flip)

    // Horizontal text wants the triangle's widest rows: near the centre line
    // when M is on a left/right side, out by the edge when M is on the top or
    // bottom. The face takes the room that's left.
    const along = (m, k) => [M[0] * m + (K[0] - M[0]) * k, M[1] * m + (K[1] - M[1]) * k]
    const textPt = sideways ? along(0.6, 0.17) : along(0.86, 0.42)
    const facePt = sideways ? along(0.75, 0.5) : along(0.48, 0.19)

    // The lit side of each crease faces the upper-left light.
    const litFirst = Math.sin((c - 22.5 - 225) * DEG) < Math.sin((c + 22.5 - 225) * DEG)
    const fA = [O, p0, e]
    const fB = [O, e, p1]
    const tone = (light, dark) => [[fA, litFirst ? light : dark], [fB, litFirst ? dark : light]]
    const poly = (pts, fill) => `<polygon points="${pts.map((p) => p.join(',')).join(' ')}" fill="${fill}" stroke="${fill}" stroke-width="0.6"/>`

    // The back: the feeling as it shows on the square.
    const backArt =
      `<g transform="${mirror}">` +
      tone(lighten(core.color, 0.1), darken(core.color, 0.07)).map(([f, fill]) => poly(f, fill)).join('') +
      `<line class="crease" x1="0" y1="0" x2="${e[0]}" y2="${e[1]}"/>` +
      faceMarkup(core.id, facePt[0], facePt[1], 15.5, core.color) +
      label(inside, textPt, core.word, 23, 'lbl core-lbl') +
      `</g>`

    // The inside, seen once it has opened out onto the diamond.
    const fp = flip(facePt), tp = flip(textPt)
    const g = flapEl({
      poly: open,
      facets: tone(lighten(core.color, 0.52), lighten(core.color, 0.4)).map(([f, fill]) => [f.map(flip), fill]),
      backArt,
      crease: [flip(O), flip(e)],
      extra: faceMarkup(core.id, fp[0], fp[1], 15.5, core.color) + label(open, tp, core.word, 23, 'lbl core-lbl'),
      title: core.gist,
      attrs: { 'data-kind': 'core', 'data-id': core.id, 'data-pick': '' },
    })
    // Hover lifts it about the same edge it opens on (a negative lift, since
    // folded over, "up" for the paper is back toward open).
    const f = new Flap({ poly: open, el: g, hinge: [M, K], liftHinge: [M, K], angle: 180 })
    f.seq = nextSeq()
    f.kind = 'core'
    f.id = core.id
    sheet.add(f)
    flaps.push(f)
  }
  return flaps
}

/**
 * The four corner flaps, folded in over the square: the outside of the closed
 * fortune teller. `lines` is written across them — each flap carries its own
 * piece of the writing, clipped to it and pre-mirrored across its fold, so the
 * words read whole while it's shut and come apart as it opens. Opened out,
 * they lie flat as the four points of a diamond.
 */
export function buildCovers(sheet, lines) {
  const H = G.H
  const colors = ['#f6b2c3', '#9fd0f0', '#f9df84', '#a8dca4']
  const edges = [
    [[-H, -H], [H, -H]],
    [[H, -H], [H, H]],
    [[H, H], [-H, H]],
    [[-H, H], [-H, -H]],
  ]
  const size = 44
  const writing = lines
    .map((line, i) => `<text class="lbl cover-lbl" x="0" y="${((i - (lines.length - 1) / 2) * size * 1.12).toFixed(1)}" font-size="${size}" dy="0.34em">${esc(line)}</text>`)
    .join('')
  return edges.map(([p, q], i) => {
    const m = mid(p, q)
    const apex = [m[0] * 2, m[1] * 2]
    const poly = [p, q, apex]
    const shut = [p, q, [0, 0]]
    const mirror = Math.abs(m[1]) < 1e-6 ? `matrix(-1 0 0 1 ${2 * m[0]} 0)` : `matrix(1 0 0 -1 0 ${2 * m[1]})`
    const clip = `cover-clip-${nextSeq()}`
    const centre = [(p[0] + q[0]) / 3, (p[1] + q[1]) / 3]
    const backArt =
      `<g transform="${mirror}">` +
      `<clipPath id="${clip}"><polygon points="${pts(shut)}"/></clipPath>` +
      `<polygon points="${pts(shut)}" fill="${colors[i]}"/>` +
      `<line class="crease" x1="${m[0]}" y1="${m[1]}" x2="0" y2="0"/>` +
      `<g clip-path="url(#${clip})">${writing}</g>` +
      `<circle class="hit" cx="${centre[0].toFixed(1)}" cy="${centre[1].toFixed(1)}" r="3"/>` +
      `</g>`
    const g = flapEl({
      poly,
      facets: [[[p, m, apex], lighten(colors[i], 0.35)], [[m, q, apex], lighten(colors[i], 0.2)]],
      backArt,
      crease: [m, apex],
      attrs: { 'data-kind': 'cover', 'data-id': String(i), 'data-pick': '' },
    })
    const f = new Flap({ poly, el: g, hinge: [p, q], liftHinge: [p, q], angle: 180 })
    f.seq = nextSeq()
    f.kind = 'cover'
    sheet.add(f)
    return f
  })
}

/**
 * Build a fan of trapezoids or petals, folded up flat onto `parent`. `slots`
 * are [a0, a1] angle ranges in order; the root is the slot nearest `centre`,
 * hinged to the parent by `rootHinge(slot)`; the rest hang off their neighbour
 * toward the root by the shared radial edge, each folded onto it.
 */
function buildFan(sheet, { parent, slots, centre, make, rootHinge, sideHinge }) {
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
    const f = new Flap({ poly, el: g, parent, hinge, liftHinge, angle: 180 })
    f.seq = nextSeq()
    f.index = i
    f.slot = slots[i]
    sheet.add(f)
    flaps[i] = f
    return f
  }
  const r = mk(root, parent, rootHinge(slots[root]))
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

/** The closer-word fan around one core feeling, folded up inside its triangle. */
export function buildCloserFan(sheet, core, triangle) {
  const n = core.closer.length
  const slots = centredSlots(core.angle, n, G.D1)
  return buildFan(sheet, {
    parent: triangle,
    slots,
    centre: core.angle,
    rootHinge: ([a0, a1]) => [at(toDiamond(a0, G.DI), a0), at(toDiamond(a1, G.DI), a1)],
    sideHinge: (a) => [at(toDiamond(a, G.DI), a), at(G.R1, a)],
    make: ([a0, a1], i) => {
      const am = (a0 + a1) / 2
      const word = core.closer[i]
      const inner = diamondPath(a0, a1, G.DI)
      const o0 = at(G.R1, a0), o1 = at(G.R1, a1)
      const poly = [...inner, o1, o0]
      const im = at(toDiamond(am, G.DI), am)
      const om = mid(o0, o1)
      const fA = [...diamondPath(a0, am, G.DI), om, o0]
      const fB = [...diamondPath(am, a1, G.DI), o1, om]
      // Alternate two tints so neighbouring words read as separate sheets.
      const dark = lighten(core.color, i % 2 ? 0.42 : 0.3)
      const light = lighten(core.color, i % 2 ? 0.5 : 0.38)
      const litFirst = Math.sin((a0 - 225) * DEG) < Math.sin((a1 - 225) * DEG)
      const rIn = toDiamond(am, G.DI)
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
        title: word.gist,
        attrs: { 'data-kind': 'closer', 'data-id': word.id, 'data-pick': '' },
      })
      return { poly, g, liftHinge: [inner[0], inner[inner.length - 1]] }
    },
  })
}

/** The needs fan, folded up inside one closer word. */
export function buildNeedsFan(sheet, word, needs, families) {
  const centre = (word.slot[0] + word.slot[1]) / 2
  const slots = centredSlots(centre, needs.length, G.D2)
  return buildFan(sheet, {
    parent: word,
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
        title: need.means,
        attrs: { 'data-kind': 'need', 'data-id': need.key, 'data-pick': '' },
      })
      return { poly, g, liftHinge: [i1, i0] }
    },
  })
}
