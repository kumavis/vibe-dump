// Nezu jia — traced décor data. Half-mask data: x = developed mm from the sector's centre line (outward), y = mm
// above the register's lower edge, read off the developed photographs (relief.js says how). Bands: c = centre-line
// control points, w = width (mm or per point); plates: c, w, h, r; eyes: pillow bosses; lines: extra sunk lines.

// LOWER DRUM (120° sector, 121.6 × 49.2 mm), photo-21 mask at θ 0 (≈ 4° off the camera axis) + photo-22 for the
// right-hand mask at θ −120's near half. Fat, high relief (2.4 mm), deep pockets.
export const FRIEZE = {
  h: 49.2, height: 2.4, shoulder: 0.9, pitch: 0.72,
  // round r8-fix (blind review + face-drum): SIX tightly packed fat ribs that run down past the eye, a deep dark
  // socket with a round boss sitting low in it, jaws as C-hooks round dark pockets ≈ ±20 mm out, the ground left
  // only in narrow channels (an extra hook unit under the brow column)
  bands: [
    ...[6.6, 9.2, 11.8, 14.4, 17.0, 19.6].map((x, i) => ({ c: [[x, 47.4], [x, 18.6]], w: 2.15, round: 0.5, inner: 0.15, start: 'round', end: 'flat', contour: false, _i: i })),
    { c: [[5.4, 17.4], [21.6, 17.4]], w: 3.8, round: 0.5, inner: 0.15, start: 'blunt', end: 'blunt', contour: { inset: 0.6, line: 0.42 } },
    // the brow bar over the socket and the outer column it turns down into (an inverted U round the socket)
    { c: [[21.0, 42.0], [34.4, 42.0], [34.4, 30], [34.4, 17.6]], w: [6.6, 7.0, 5.8, 5.4], round: 0.55, inner: 0.15, start: 'blunt', end: 'blunt',
      contour: { inset: 0.8, line: 0.45 } },
    // lower jaw: a fat C-hook round a deep pocket, ≈ 20 mm out from the nose (face-drum)
    { c: [[30.6, 13.2], [16.4, 13.2], [16.4, 3.8], [26.8, 3.8], [26.8, 7.6]], w: [5.4, 5.8, 5.4, 4.8, 4.4], round: 0.6, inner: 0.12, start: 'blunt', end: 'blunt',
      contour: { inset: 0.75, line: 0.45 } },
    // the nose-side hook under the comb, round its own small pocket
    { c: [[12.6, 13.0], [4.4, 13.0], [4.4, 3.8], [10.6, 3.8]], w: [4.2, 4.4, 4.2, 3.6], round: 0.6, inner: 0.12, start: 'blunt', end: 'spiral',
      spiral: { turns: 0.6, gap: 0.8, dir: 1, R: 1.8 }, contour: { inset: 0.65, line: 0.42 } },
    // the body: a tall column behind the eye, hooked at the foot
    { c: [[44.4, 46.8], [44.4, 20], [44.4, 6.0], [38.6, 6.0]], w: [6.4, 6.6, 6.2, 5.2], round: 0.55, inner: 0.14, start: 'flat', end: 'spiral',
      spiral: { turns: 0.75, gap: 0.9, dir: -1, R: 2.6 }, contour: { inset: 0.75, line: 0.45 } },
    // a hook between the brow column and the body, filling what was open ground
    { c: [[39.2, 36.0], [39.2, 25.4], [36.2, 25.4]], w: [3.4, 3.4, 3.0], round: 0.6, inner: 0.15, start: 'round', end: 'blunt' },
    // a narrow column beside the slab flange
    { c: [[52.4, 44.6], [52.4, 4.6]], w: 4.0, round: 0.5, inner: 0.15, start: 'blunt', end: 'blunt' },
  ],
  plates: [
    // the cheek plateau under the socket
    { c: [26.4, 20.0], w: 10.4, h: 5.6, r: 2.4, contour: { inset: 0.8, line: 0.45 } },
  ],
  // the socket: sunk 1.1 mm and left plain (dark); the eye boss sits low in it
  socket: { c: [26.2, 30.6], w: 10.0, h: 12.0, r: 3.6, depth: 1.1 },
  eyes: [
    { c: [26.2, 29.4], w: 8.0, h: 7.6, round: 0.8, height: 3.6, crown: 0.9, base: -1.05, slit: { len: 2.8, width: 0.8, depth: 0.7 } },
  ],
  lines: [],
}

// WAIST BAND (60° sector, ≈ 54 × 31.8 mm at the waist), photo-21 left of the θ 0 flange, photo-22 under the plain
// blade at θ −30. Flat bands (0.55 mm) with one sunk line, small slit eyes low in the band.
export const BAND = {
  w: 54.2, h: 31.8, height: 0.55, pitch: 0.75,
  bands: [
    // brow + horn: a squared hook rising from over the eye and rolling inward at the top
    { c: [[4.6, 23.4], [12.6, 23.4], [12.6, 27.4], [21.4, 27.4], [21.4, 18.6]], w: [3.6, 3.6, 3.4, 3.2, 3.0], round: 0.9, inner: 0.3, end: 'spiral', spiral: { turns: 1.0, gap: 0.7, dir: -1, R: 2.6 } },
    // the body: a band running out from behind the eye to a turned-up tail
    { c: [[16.6, 13.2], [24.4, 13.2], [24.4, 5.2], [19.0, 5.2]], w: [3.2, 3.2, 3.0, 2.8], round: 0.9, inner: 0.3, end: 'spiral', spiral: { turns: 0.9, gap: 0.6, dir: 1, R: 2.0 } },
    // jaw
    { c: [[3.0, 4.2], [9.8, 4.2], [9.8, 8.2]], w: [3.0, 3.0, 2.6], round: 0.9, inner: 0.3, end: 'blunt' },
  ],
  eyes: [{ c: [9.6, 14.4], w: 5.6, h: 4.2, round: 0.55, height: 1.3, crown: 0.7, slit: { len: 2.4, width: 0.6, depth: 0.5 } }],
  lines: [],
}

// BLADES (30° sector, ≈ 31 × 47.2 mm on a fan): raised double ogive line; the plain blade holds a small vertical
// mask (eyes ≈ 0.45 up), the flanged blade a column of small C-scrolls on each side of the flange.
export const BLADE_PLAIN = {
  w: 31, h: 47.2, base: 28.6, apex: 46.8, ogive: 1.55, outlines: [0.6, 2.4], outlineW: [1.1, 0.9], lineHeight: 0.5,
  height: 0.5, pitch: 0.75, leiwen: 18,
  bands: [
    { c: [[1.2, 30.6], [4.6, 30.6], [4.6, 26.4]], w: [2.0, 2.0, 1.8], round: 0.5, inner: 0.15, end: 'blunt' },
    { c: [[1.6, 14.6], [6.4, 14.6], [6.4, 10.2], [3.2, 10.2]], w: [1.9, 1.9, 1.8, 1.6], round: 0.5, inner: 0.15, end: 'spiral', spiral: { turns: 0.8, gap: 0.5, dir: 1, R: 1.3 } },
  ],
  eyes: [{ c: [4.4, 21.8], w: 3.6, h: 2.8, round: 0.6, height: 0.9, crown: 0.7, slit: false }],
  lines: [{ c: [[0, 38], [0, 25]], w: 0.5 }],
}
export const BLADE_FLANGED = {
  w: 31, h: 47.2, base: 28.6, apex: 46.8, ogive: 1.55, outlines: [0.6, 2.4], outlineW: [1.1, 0.9], lineHeight: 0.5,
  height: 0.5, pitch: 0.75, leiwen: 0,
  bands: [
    // a column of small C-scrolls beside the flange (photo-21 crop: 6 of them, bottom to two thirds up)
    ...[3.4, 9.2, 15.0, 20.8, 26.6, 32.0].map((y, i) => ({ c: [[3.6, y + 2.2], [6.6, y + 2.2], [6.6, y], [4.2, y]], w: 1.7 - i * 0.08, round: 0.6, inner: 0.2, end: 'spiral', spiral: { turns: 0.7, gap: 0.45, dir: 1, R: 0.9 } })),
  ],
  eyes: [],
  lines: [],
}

// LEG FACES (TRUE mm, x from the apex edge): a column of small masks 0.4–0.9 up the leg, then a plain blade.
export const LEGFACE = {
  height: 1.1, pitch: 0.7, frame: 13.6,
  unit: {
    bands: [
      { c: [[2.2, 9.6], [9.6, 9.6], [9.6, 6.0]], w: [2.2, 2.2, 2.0], end: 'spiral', spiral: { turns: 0.8, gap: 0.5, dir: 1, R: 1.4 } },
      { c: [[2.2, 1.6], [8.6, 1.6], [8.6, 3.8]], w: [2.0, 2.0, 1.8], end: 'blunt' },
    ],
    eyes: [{ c: [4.6, 5.6], w: 3.0, h: 2.4 }],
  },
  units: [148, 135, 122, 109, 96, 83, 70, 57].map((y, i) => ({ y, s: 1 - i * 0.03 })),
}

// POST CAP FLANK (one 90° sector of the bell, ≈ 31 × 50 mm on its surface) and STEM FACE (24 × 30 mm)
export const CAPFLANK = {
  w: 31, h: 50, height: 0.6, pitch: 0.7,
  bands: [
    { c: [[2.2, 33], [8.6, 33], [8.6, 40], [13.4, 40]], w: [3.0, 3.0, 2.8, 2.6], end: 'spiral', spiral: { turns: 0.9, gap: 0.6, dir: -1, R: 1.8 } },
    { c: [[4.0, 20], [11.6, 20], [11.6, 13]], w: [2.8, 2.8, 2.4], end: 'spiral', spiral: { turns: 0.8, gap: 0.5, dir: 1, R: 1.6 } },
    { c: [[2.0, 7], [7.6, 7]], w: 2.4, end: 'blunt' },
  ],
  eyes: [{ c: [5.4, 26.4], w: 4.4, h: 3.6, height: 1.4, crown: 0.7, slit: false }],
}
export const STEMFACE = {
  w: 24, h: 30, height: 0.8, pitch: 0.7,
  bands: [
    { c: [[2.0, 23], [8.2, 23], [8.2, 17.6]], w: [2.6, 2.6, 2.4], end: 'spiral', spiral: { turns: 0.9, gap: 0.5, dir: 1, R: 1.5 } },
    { c: [[2.0, 7], [8.6, 7], [8.6, 3.2]], w: [2.4, 2.4, 2.2], end: 'blunt' },
  ],
  eyes: [{ c: [5.6, 13.8], w: 3.8, h: 3.0, height: 1.2, slit: false }],
}
