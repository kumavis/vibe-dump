// Nezu jue — traced décor data, in FACE mm of reference/nezu-jue/faces/face-band.jpg (u right, v up, origin at the
// face centre: θ 128, y 120.75; the plane looks down the photograph's line of sight). relief.js carries every point
// onto the developed band panel (x = r·asin(u / r) + 22.8 from the handle seam, y = 120.75 + v / 0.978).
//
// Ridge pass (.work/ridge-nezu-jue/NOTES.md): re-read off photo-02 at full resolution, 4× (face-band on 1 mm ticks).
// The idiom of THIS band: the field is a pavement of broad FLAT PLATES with SQUARE corners, parted by narrow dark
// channels (≈ 0.6–1 mm) and by deep dark pockets inside the curls and the eye socket. The figures (red-brown in the
// photograph) stand highest and carry ridge work on their tops — chains of small squared spirals (columns, brow,
// stem, bottom border) or two or three parallel lines (eye frame, the C beside the eye, the jaw's G curl, the lower
// curl, the strip by the nose); the cells between them are plain plates a step lower (pale with buff deposit).
// Every path is axis-aligned (the bronze's bands run square to the band), so it maps exactly onto the panel.
//
// figure: { c: centre line [[u, v]…], w: width (face mm), deco: 'sp' (squared-spiral chain) | 'ln' (n ridges) |
//   'pl' (plain, high), n, cell (spiral cell target, mm) }. The half drawn is the tail mask's handle side, from
//   the hook beside the handle (u −9.4, θ ≈ 113) to the nose (u ≈ 27, the θ 180 flange).

export const BAND = {
  figures: [
    // the bottom border: a chain of squared spirals from the outer column to under the flange (meets its mirror)
    { c: [[-8.4, -18.0], [27.4, -18.0]], w: 2.6, deco: 'sp', cell: 2.9 },
    // C1, the outer column (u −7.4 … −2.9): squared spirals, broken low down by its outward hook
    { c: [[-5.15, 18.3], [-5.15, -0.6]], w: 4.5, deco: 'sp' },
    { c: [[-2.95, -1.7], [-8.4, -1.7], [-8.4, -8.0], [-4.1, -8.0], [-4.1, -5.2]], w: 2.0, deco: 'ln', n: 2 },
    { c: [[-5.15, -9.0], [-5.15, -16.4]], w: 4.5, deco: 'sp' },
    // C2, the inner column beside the eye (u −2.4 … 0.5)
    { c: [[-0.95, 5.3], [-0.95, -7.2]], w: 2.9, deco: 'sp' },
    // the brow: a bar over the eye's lid and a broad block over the C, both carrying squared spirals
    { c: [[2.9, 10.85], [10.2, 10.85]], w: 3.3, deco: 'sp' },
    { c: [[13.6, 12.3], [13.6, 4.85]], w: 7.3, deco: 'sp', cell: 3.4 },
    // the eye frame: a square ring (plain high band), the lid plate, socket and eyeball inside
    { c: [[2.0, 3.7], [9.0, 3.7], [9.0, -5.9], [2.0, -5.9]], w: 1.3, deco: 'pl', closed: true },
    // C3: the squared G right of the eye, open to the left round its pocket
    { c: [[11.2, -0.4], [11.2, 3.15], [16.85, 3.15], [16.85, -3.35], [11.2, -3.35], [11.2, -2.4]], w: 1.6, deco: 'ln', n: 2 },
    // the jaw's G curl in the lower cell: three lines (photo: the clearest multi-line band on the bronze)
    { c: [[2.6, -16.2], [2.6, -11.8], [10.5, -11.8], [10.5, -15.7], [5.3, -15.7], [5.3, -13.6]], w: 2.2, deco: 'ln', n: 3 },
    // S2, the stem between the G curl and the lower-right curl
    { c: [[13.3, -5.4], [13.3, -16.6]], w: 2.2, deco: 'sp' },
    // the lower-right curl: a squared spiral of two lines in toward its pocket
    { c: [[22.9, -5.4], [15.9, -5.4], [15.9, -15.8], [22.9, -15.8], [22.9, -8.5], [18.6, -8.5], [18.6, -12.8], [20.7, -12.8]], w: 1.6, deco: 'ln', n: 2 },
    // S1, the lined strip right of the brow block and the C (u 18.3 … 19.9), running up to the top fillet
    { c: [[19.1, 18.3], [19.1, -3.4]], w: 1.6, deco: 'ln', n: 2 },
    // the nose strip against the flange
    { c: [[24.4, 18.3], [24.4, -16.9]], w: 1.5, deco: 'pl' },
  ],
  // extra channels where the photograph shows a dark line between two plain plates (centre lines, width mm)
  channels: [
    { c: [[0.7, -7.9], [11.8, -7.9]], w: 1.3 }, // under the eye frame: the jaw cell's top edge
    { c: [[-2.4, 13.0], [17.4, 13.0]], w: 1.0 },  // the brow's top: the upper cell's floor
  ],
  // deep pockets (rounded rectangles c, w × h, corner r; face mm): dark in the photograph
  pockets: [
    { c: [5.5, -1.25], w: 5.4, h: 2.9, r: 0.9 },  // eye socket (upper half of the eye)
    { c: [1.8, 9.2], w: 2.4, h: 1.9, r: 0.7 },    // under the brow bar's left end (the 'beak')
    { c: [1.6, 15.3], w: 4.2, h: 1.6, r: 0.6 },   // the slot under the top fillet
    { c: [14.6, 14.9], w: 3.4, h: 2.2, r: 0.8 },  // over the brow block
    { c: [12.95, -1.4], w: 2.6, h: 1.4, r: 0.6 }, // in the C
    { c: [7.9, -13.75], w: 3.2, h: 2.0, r: 0.8 }, // in the G curl
    { c: [20.75, -10.65], w: 2.6, h: 1.6, r: 0.6 }, // in the lower-right curl
    { c: [-6.25, -5.0], w: 2.4, h: 2.6, r: 1.0 }, // in C1's hook
    { c: [23.0, 11.3], w: 1.4, h: 1.0, r: 0.4 },  // by the nose strip
    { c: [23.0, 1.0], w: 1.4, h: 1.0, r: 0.4 },
  ],
  // the eyeball: a low pillow in the socket's lower half with a horizontal slit (the pale bar in the photograph)
  eyes: [{ c: [5.7, -4.25], w: 4.8, h: 2.1, round: 0.3, height: 1.0, crown: 0.55, slit: { len: 3.2, width: 0.45, depth: 0.4 } }],
}

// the filler beside the handle (behind it in the photograph: dark and foreshortened; two squared G hooks round deep
// pockets, turned toward the handle), in DEVELOPED panel mm from the handle seam (x) and face v (y)
export const FILLER = {
  figures: [
    { c: [[11.1, 6.6], [11.1, 15.6], [1.3, 15.6], [1.3, 1.5], [8.4, 1.5], [8.4, 5.2]], w: 2.4, deco: 'ln', n: 2 },
    { c: [[11.1, -7.6], [11.1, -16.3], [1.3, -16.3], [1.3, -2.9], [8.4, -2.9], [8.4, -6.6]], w: 2.4, deco: 'ln', n: 2 },
  ],
  pockets: [{ c: [5.1, 8.5], w: 3.0, h: 5.2, r: 1.0 }, { c: [5.1, -9.7], w: 3.0, h: 5.6, r: 1.0 }],
}

// the triangle on the upper wall (face-upper, θ 129: base on the band's top fillet ≈ 18 mm, ≈ 15.5 mm tall), in
// developed mm from its axis (x) and above its base (y). Read off face-upper at 6× (fu-grid): a double-lined border
// (two ridges on a raised band), a central stem rising to the apex, two eye pockets under short squared brows, two
// lower pockets held in the foot hooks; the interior is the plain wall.
export const TRIANGLE = {
  base: 18.4, h: 16.4,
  border: { w: 2.2, n: 2 },
  figures: [
    { c: [[0, 0.9], [0, 13.2]], w: 1.7, deco: 'ln', n: 2 },
    { c: [[1.15, 7.2], [2.9, 7.2]], w: 1.2, deco: 'pl' },
    { c: [[-1.15, 7.2], [-2.9, 7.2]], w: 1.2, deco: 'pl' },
    { c: [[1.15, 1.1], [4.8, 1.1], [4.8, 2.9]], w: 1.3, deco: 'pl' },
    { c: [[-1.15, 1.1], [-4.8, 1.1], [-4.8, 2.9]], w: 1.3, deco: 'pl' },
  ],
  pockets: [
    { c: [2.0, 5.6], w: 2.1, h: 1.2, r: 0.45 }, { c: [-2.0, 5.6], w: 2.1, h: 1.2, r: 0.45 },
    { c: [3.3, 2.6], w: 1.4, h: 1.2, r: 0.45 }, { c: [-3.3, 2.6], w: 1.4, h: 1.2, r: 0.45 },
  ],
}
