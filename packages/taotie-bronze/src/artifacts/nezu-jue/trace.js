// Nezu jue — traced décor data, in FACE mm of reference/nezu-jue/faces/face-band.jpg (u right, v up, origin at the
// face centre: θ 128, y 120.75; the plane looks down the photograph's line of sight). relief.js carries every point
// onto the developed band panel (x = r·asin(u / r) + 22.8 from the handle seam, y = 120.75 + v / 0.978).
// Read off the flattened face at 1 mm ticks (.work/r8-jue/fb_ticks.png): the half of the TAIL mask that faces the
// photograph, from its outer column (u −5, θ 120) to its nose beside the θ 180 flange (u 23.5).
//
// The idiom of THIS band (photo-02): every motif element is a RAISED band ≈ 2–3 mm wide, flat-topped, square-ish
// cornered, and its top carries a chain of small SQUARED spirals (the 雷纹 sits ON the motif, red-brown in the
// photograph); the ground between the bands is PLAIN, smooth and sunk (pale buff burial deposit fills it), with dark
// deep pockets inside the curls and in the eye socket. Bands: c = centre-line control points [u, v], w = width.

export const BAND = {
  height: 1.25, // band height above the plain ground (mm, est. from the shadows)
  bands: [
    // borders: top and bottom of the field (squared spirals along both)
    { c: [[-7.6, 18.0], [27.5, 18.0]], w: 2.3, start: 'flat', end: 'flat' },
    { c: [[-7.6, -18.2], [27.5, -18.2]], w: 2.5, start: 'flat', end: 'flat' },
    // the outer column of the mask (u −7 … −2.7), full height, with a C curl turned out to the left low down
    { c: [[-4.85, 17.0], [-4.85, -17.2]], w: 4.2, start: 'flat', end: 'flat' },
    { c: [[-3.2, -2.3], [-8.4, -2.3], [-8.4, -6.9], [-5.6, -6.9]], w: [2.3, 2.3, 2.1, 1.9], end: 'spiral', spiral: { turns: 0.55, gap: 0.5, dir: 1, R: 1.2 } },
    // short tab hanging from the top border (u 1 … 5.8)
    { c: [[1.0, 15.7], [5.8, 15.7]], w: 1.9, start: 'round', end: 'round' },
    // the 'beak': a horn band from over the eye out to a broad block (u 2.6 → 17.5, v 10)
    { c: [[2.4, 7.8], [2.9, 10.0], [11.0, 10.0]], w: [1.6, 2.6, 2.8], start: 'point', end: 'flat' },
    // brow link from the outer column to the eye frame
    { c: [[-2.8, 2.9], [2.2, 2.9]], w: 2.4, start: 'flat', end: 'flat' },
    // the eye frame: a squared ring, broad on top (u 1 … 10.6, v 4 … −7.7)
    { c: [[1.9, 2.9], [9.8, 2.9], [9.8, -6.9], [1.9, -6.9], [1.9, 2.9]], w: [2.4, 2.4, 1.7, 1.7, 2.4], round: 0.35, inner: 0.12, start: 'flat', end: 'flat' },
    // the curl right of the eye: a squared C open to the left round a deep pocket (u 12 … 17.6, v 4 … −1.6)
    { c: [[9.8, 3.9], [17.2, 3.9], [17.2, -1.7], [12.4, -1.7]], w: [2.2, 2.2, 2.0, 1.8], end: 'round' },
    // a stem down from the curl to the bottom border, and the lower-right curl (pocket at u 18.4, v −9.6)
    { c: [[13.6, -3.0], [13.6, -17.2]], w: 2.0, start: 'flat', end: 'flat' },
    { c: [[13.6, -5.2], [21.3, -5.2], [21.3, -13.8], [16.6, -13.8], [16.6, -10.0]], w: [2.0, 2.0, 1.9, 1.8, 1.7], end: 'spiral', spiral: { turns: 0.45, gap: 0.45, dir: -1, R: 1.1 } },
    // the jaw: a Γ (top arm v −8.6, left arm u 0.4) and the G curl inside it round a deep pocket (u 6.7, v −14)
    { c: [[12.6, -8.6], [0.4, -8.6], [0.4, -17.2]], w: 2.2, start: 'flat', end: 'flat' },
    { c: [[10.4, -11.2], [3.6, -11.2], [3.6, -16.0], [9.8, -16.0], [9.8, -13.4]], w: [1.9, 1.9, 1.8, 1.7, 1.6], end: 'spiral', spiral: { turns: 0.5, gap: 0.45, dir: 1, R: 1.1 } },
    // the nose column beside the flange (u 22 … 25), stacked ladder of short hooks in the photograph
    { c: [[23.3, 17.0], [23.3, -17.2]], w: 2.6, start: 'flat', end: 'flat', ticks: true },
  ],
  plates: [
    // the broad block at the beak's outer end (u 10 … 17.5, v 5.7 … 11.4)
    { c: [14.0, 8.6], w: 7.2, h: 5.4, r: 1.0 },
  ],
  // the eye: a low pillow in the socket's lower half with a horizontal slit (the pale bar in the photograph)
  eyes: [{ c: [5.85, -4.6], w: 5.0, h: 2.4, round: 0.55, height: 1.0, crown: 0.6, slit: { len: 3.2, width: 0.55, depth: 0.45 } }],
  // deep pockets (sunk further than the ground: dark in the photograph)
  pockets: [
    { c: [5.85, -1.0], rx: 3.0, ry: 1.7, depth: 0.9 }, // eye socket (upper half)
    { c: [14.6, 1.1], rx: 1.6, ry: 1.3, depth: 0.8 },
    { c: [18.8, -9.5], rx: 1.4, ry: 2.4, depth: 0.8 },
    { c: [6.8, -13.6], rx: 1.8, ry: 1.4, depth: 0.8 },
    { c: [-6.4, -4.6], rx: 1.0, ry: 1.0, depth: 0.7 },
    { c: [1.2, 12.6], rx: 1.2, ry: 1.4, depth: 0.6 },
  ],
}

// the filler beside the handle (behind it in the photograph, u −20 … −9: a vertical band with two C hooks turned
// toward the handle), in DEVELOPED panel mm from the handle seam (x) and y above the band centre
export const FILLER = {
  bands: [
    { c: [[10.6, 17.6], [10.6, -17.8]], w: 3.2, start: 'flat', end: 'flat' },
    { c: [[9.2, 10.4], [4.2, 10.4], [4.2, 5.2], [7.4, 5.2]], w: [2.2, 2.2, 2.0, 1.8], end: 'spiral', spiral: { turns: 0.5, gap: 0.45, dir: -1, R: 1.1 } },
    { c: [[9.2, -5.4], [4.2, -5.4], [4.2, -10.6], [7.4, -10.6]], w: [2.2, 2.2, 2.0, 1.8], end: 'spiral', spiral: { turns: 0.5, gap: 0.45, dir: -1, R: 1.1 } },
  ],
}

// the decorated triangle on the upper wall (face-upper: base on the band's top border, u −8 … 9, apex ≈ 16 mm up),
// in developed mm from its axis (x) and above the band top (y): a raised double outline round a small face —
// a central stem with a cross bar, two square eyes, hooks at the foot
export const TRIANGLE = {
  base: 17.4, h: 16.4,
  outlines: [0.5, 2.2], outlineW: [1.3, 0.9],
  bands: [
    { c: [[0, 1.2], [0, 10.6]], w: 1.6, start: 'flat', end: 'round' },
    { c: [[-3.2, 6.6], [3.2, 6.6]], w: 1.3, start: 'round', end: 'round' },
    { c: [[-1.6, 1.4], [-4.6, 1.4], [-4.6, 3.4]], w: 1.2, end: 'round' },
    { c: [[1.6, 1.4], [4.6, 1.4], [4.6, 3.4]], w: 1.2, end: 'round' },
  ],
  eyes: [{ c: [-2.2, 4.0], w: 1.6, h: 1.3 }, { c: [2.2, 4.0], w: 1.6, h: 1.3 }],
}
