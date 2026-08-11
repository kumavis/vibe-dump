// shapes.js — the weird window silhouettes. Each shape is an SVG path string
// (used both for CSS clip-path and canvas Path2D) plus an inner content hole;
// the space between outline and inner is the glass "moat" that holds liquid.

export const AMP = {
  w: 390, h: 168,
  // swoopy webamp-skin fish: bulged left, jagged bitten right edge
  outline: `M 92 10
    Q 200 -10 302 12
    L 376 30 L 350 62 L 382 92
    Q 388 132 336 148
    Q 300 168 236 156
    Q 150 172 96 152
    Q 40 140 16 108
    Q -6 74 10 44
    Q 26 14 92 10 Z`,
  inner: `M 48 36
    Q 195 22 336 40
    L 344 100
    Q 195 118 54 104 Z`,
  content: { x: 52, y: 36, w: 286, h: 66 },
}

export const KEYGEN = {
  w: 310, h: 282,
  // cracked-warez jag: every edge slightly off-angle
  outline: `M 26 20 L 122 4 L 154 18 L 268 8 L 298 42
    L 282 96 L 302 152 L 276 212 L 292 246
    L 214 272 L 152 258 L 62 274 L 30 240
    L 8 166 L 24 122 L 4 62 Z`,
  inner: `M 38 42 L 270 36 L 276 214 L 44 224 Z`,
  content: { x: 42, y: 42, w: 228, h: 174 },
}

export const FILES = {
  w: 340, h: 288,
  // cumulus cloud with a wavy base
  outline: `M 20 128
    Q 4 66 68 60
    Q 86 12 144 34
    Q 182 -8 232 28
    Q 294 10 302 70
    Q 338 92 328 144
    L 324 214
    Q 328 258 274 264
    Q 168 288 70 266
    Q 14 256 20 208 Z`,
  inner: `M 46 88
    Q 172 72 296 90
    L 296 208
    Q 170 228 50 214 Z`,
  content: { x: 52, y: 90, w: 238 , h: 118 },
}

// donut clock: outline has a REAL hole (inner circle wound the opposite way,
// so the nonzero fill rule punches it out — works for CSS clip-path too)
const R = 118, r = 56, C = 122
const circle = (radius, sweep) =>
  `M ${C + radius} ${C}
   A ${radius} ${radius} 0 1 ${sweep} ${C - radius} ${C}
   A ${radius} ${radius} 0 1 ${sweep} ${C + radius} ${C} Z`
export const DONUT = {
  w: 244, h: 244,
  outline: `${circle(R, 1)} ${circle(r, 0)}`,
  inner: null,
  content: null,
  R, r, C,
}

export function bandPath(shape) {
  const p = new Path2D(shape.outline)
  if (shape.inner) p.addPath(new Path2D(shape.inner))
  return p
}
