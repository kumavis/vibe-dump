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

// BAND / FILLER (the ridge pass's plate reading of the belly band) are gone: the band is now built from the slab
// outlines in reference/nezu-jue/slabs.json (slab pass, relief.js).

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
