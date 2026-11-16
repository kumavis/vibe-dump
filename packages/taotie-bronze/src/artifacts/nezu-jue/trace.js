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
  height: 1.8, // band height above the plain ground (mm, est. from the shadows)
  bands: [
    // fix pass r8: NO top border (photo-02: the columns and the block run up to a plain fillet); the bottom border
    // stays — the photograph does show a band with squared spirals under the jaw (detail-band, y ≈ 640–670)
    { c: [[-7.6, -18.3], [27.0, -18.3]], w: 2.5, start: 'flat', end: 'flat' },
    // the outer column of the mask (u −7.6 … −2.4), broken low down by the C hook (a dark crescent above the hook)
    { c: [[-5.0, 16.6], [-5.0, 0.9]], w: 4.2, start: 'round', end: 'blunt' },
    { c: [[-5.0, -10.0], [-5.0, -17.4]], w: 4.2, start: 'blunt', end: 'flat' },
    // the big C hook turned OUT of the column low down, round a deep round pocket (u −8.6 … −3, v −0.5 … −9.3)
    { c: [[-3.0, -1.9], [-8.6, -1.9], [-8.6, -7.9], [-4.4, -7.9], [-4.4, -5.4]], w: [3.0, 3.0, 2.9, 2.6, 2.2], round: 0.75, end: 'round', spirals: false },
    // a second, shorter column left of the eye (u −2.4 … 1.6, v 5.6 … −9.9)
    { c: [[-0.5, 5.4], [-0.5, -8.0]], w: 3.6, start: 'round', end: 'blunt' },
    // the 'beak': a horn band from over the eye out to a broad block (u 0.5 → 17.5, v 9.8)
    { c: [[1.0, 8.4], [1.6, 9.8], [11.0, 9.8]], w: [2.4, 3.4, 3.6], start: 'point', end: 'flat' },
    // the eye frame: a ROUNDED ring, broad and arched on top (the pale ∩ brow over the socket)
    { c: [[2.2, 3.6], [8.8, 3.6], [8.8, -5.1], [2.2, -5.1], [2.2, 3.6]], w: [2.8, 2.8, 1.6, 1.6, 2.8], round: 0.95, inner: 0.5, start: 'flat', end: 'flat', spirals: false },
    // the curl right of the eye: a C open to the left round a deep pocket (u 10 … 18.1, v 4.1 … −3.3)
    { c: [[9.4, 2.9], [16.8, 2.9], [16.8, -2.1], [12.2, -2.1], [12.2, -0.4]], w: [2.8, 2.8, 2.7, 2.4, 2.0], round: 0.8, end: 'round' },
    // the jaw's top arm under the eye (v −7.3), and a stem down to the bottom border on its right (u 13.6)
    { c: [[-1.6, -7.3], [17.6, -7.3]], w: 2.8, start: 'flat', end: 'round' },
    { c: [[13.7, -7.0], [13.7, -17.3]], w: 2.8, start: 'flat', end: 'flat' },
    // lower-right curl (pockets at u 18.8, v −8 … −12)
    { c: [[15.0, -10.0], [19.6, -10.0], [19.6, -14.8], [16.8, -14.8]], w: [2.2, 2.2, 2.0, 1.8], round: 0.8, end: 'round', spirals: false },
    // the G curl of the jaw round a deep pocket (u 2 … 11.5, v −9.9 … −18)
    { c: [[2.9, -17.3], [2.9, -10.6], [11.2, -10.6], [11.2, -15.6], [6.6, -15.6], [6.6, -13.4]], w: [2.6, 2.6, 2.4, 2.2, 2.0, 1.8], round: 0.8, end: 'round' },
    // the nose: a column beside the flange (u 19.5 … 22.6) — it carries spirals like the others (photo-02)
    { c: [[21.0, 16.6], [21.0, -17.3]], w: 3.2, start: 'round', end: 'flat' },
  ],
  plates: [
    // the block's upward arm to the top border (u 13.7 … 17.4, v 11 … 16.8)
    { c: [15.6, 13.3], w: 3.8, h: 6.4, r: 1.5 },
    // the broad block at the beak's outer end (u 9.3 … 17.6, v 5.4 … 11.6)
    { c: [13.5, 8.5], w: 8.2, h: 6.0, r: 2.0 },
  ],
  // the eye: a low pillow in the socket's lower half with a horizontal slit (the pale bar in the photograph)
  eyes: [{ c: [5.5, -3.6], w: 4.6, h: 2.1, round: 0.55, height: 1.1, crown: 0.6, slit: { len: 3.0, width: 0.5, depth: 0.45 } }],
  // deep pockets (sunk further than the ground: dark in the photograph)
  pockets: [
    { c: [5.5, 0.4], rx: 2.7, ry: 2.1, depth: 0.9 }, // eye socket (upper half)
    { c: [14.5, 0.4], rx: 1.5, ry: 1.1, depth: 0.8 },
    { c: [17.6, -12.4], rx: 1.2, ry: 1.5, depth: 0.8 },
    { c: [8.9, -13.1], rx: 1.6, ry: 1.2, depth: 0.8 },
    { c: [-6.5, -4.9], rx: 1.6, ry: 1.6, depth: 0.8 }, // the round pocket in the outer C hook
    { c: [-5.0, -0.5], rx: 2.4, ry: 0.55, depth: 0.6 }, // the dark crescent between the column and its hook
    { c: [1.6, 7.0], rx: 1.0, ry: 1.1, depth: 0.6 },
  ],
}

// the filler beside the handle (behind it in the photograph, u −20 … −9: a vertical band with two C hooks turned
// toward the handle), in DEVELOPED panel mm from the handle seam (x) and y above the band centre
export const FILLER = {
  // fix pass r8: two LARGE hooked frames (photo-02 behind the handle, face-band u −21.6 … −10 = developed x 0 … 12.5:
  // rounded G hooks round deep pockets at u ≈ −15.6, v ≈ 8.4 / −10.4); no separate column (the photograph has a dark
  // channel at u −10 … −7.5 before the mask's outer column)
  bands: [
    { c: [[11.2, 6.6], [11.2, 15.4], [1.3, 15.4], [1.3, 1.6], [8.6, 1.6], [8.6, 5.4]], w: [2.9, 2.9, 2.9, 2.7, 2.5, 2.1], end: 'round' },
    { c: [[11.2, -7.6], [11.2, -17.4], [1.3, -17.4], [1.3, -3.0], [8.6, -3.0], [8.6, -6.8]], w: [2.9, 2.9, 2.9, 2.7, 2.5, 2.1], end: 'round' },
  ],
  pockets: [{ c: [5.6, 8.6], rx: 2.1, ry: 2.8 }, { c: [5.6, -10.4], rx: 2.1, ry: 3.0 }],
}

// the decorated triangle on the upper wall (face-upper: base on the band's top border, u −8 … 9, apex ≈ 16 mm up),
// in developed mm from its axis (x) and above the band top (y): a raised double outline round a small face —
// a central stem with a cross bar, two square eyes, hooks at the foot
export const TRIANGLE = {
  // fix pass r8: ONE heavy raised border ≈ 2 mm (was a thin double outline) round a thick cross-like figure
  base: 17.4, h: 16.4,
  outlines: [0.6], outlineW: [2.1],
  bands: [
    { c: [[0, 1.6], [0, 10.4]], w: 2.2, start: 'flat', end: 'round' },
    { c: [[-3.6, 6.4], [3.6, 6.4]], w: 2.0, start: 'round', end: 'round' },
    { c: [[-1.8, 1.9], [-4.4, 1.9], [-4.4, 3.6]], w: 1.7, end: 'round' },
    { c: [[1.8, 1.9], [4.4, 1.9], [4.4, 3.6]], w: 1.7, end: 'round' },
  ],
  eyes: [],
}
