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
  // warez blob: bouba, not kiki — every lump a different size, zero corners
  outline: `M 30 44
    Q 10 22 58 14
    Q 120 -6 168 16
    Q 232 -4 272 22
    Q 306 44 294 92
    Q 310 140 292 178
    Q 306 226 268 250
    Q 220 282 158 262
    Q 96 284 52 258
    Q 8 236 20 186
    Q 2 140 18 104
    Q 4 66 30 44 Z`,
  inner: `M 40 46 Q 155 34 270 42 L 274 212 Q 156 226 44 218 Z`,
  content: { x: 44, y: 46, w: 224, h: 168 },
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
