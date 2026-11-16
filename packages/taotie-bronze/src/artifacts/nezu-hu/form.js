// Nezu hu 蟠螭文壺 (90099) — the form, measured.
//
// The outline comes from the project owner's single photograph (reference/nezu-hu/photo-11.jpg, dossier §b): a
// camera fitted to the rim's far edge, the base's near edge and the silhouette rings of neck, belly and foot ring
// (the fit runs to an almost orthographic camera — a phone zoomed in from ≈ 2 m — looking down 7.8°, rolled 1.0°);
// the silhouette read row by row (half the full width where both sides are clean; behind the handles the shoulder
// edge was read by eye between the handle's limbs) and converted to rings; register borders read on the front centre
// line and converted to heights through the same camera. Scale is INFERRED (dossier §b.2): 1 fitted unit (rim
// radius = 100) = 1.2 mm. All mm, Y up, front (+Z) = the photograph's line of sight; handles at ±90°.

/** register heights (mm) */
export const LV = {
  base: [0, 7.4], // plain base band, a little flared, with a groove at its top
  foot: [7.4, 58.1], // the plain convex foot ring (its undercut top edge at ≈ 57–59)
  body: [68.4, 221.2], // the lower interlace band (nine rows of panchi units); r8 fix: its lower edge read again
  // on the front centre line against the render through the same camera, 5 mm higher than first read
  cords: [221.2, 238.2], // two plain cords and a twisted rope between the bands
  shoulder: [238.2, 309.1], // the upper interlace band (four rows)
  rope: 312.6, // the twisted rope at the foot of the neck
  neck: [314, 425], // the plain neck (an incised inscription on the front)
  lip: [440, 448.3], // the everted lip band (a crisp lower edge at 440; the flare below it is neck)
  rim: 448.3,
}

/** outer profile, bottom → top, [r, y] mm */
export const BODY = [
  [130.8, 0.0, 'corner'],
  [131.5, 1.8],
  [131.3, 5.5],
  [130.3, 7.4],
  // the foot ring (r8 fix pass: re-read against photo-11's silhouette — widest at mid-ring, 0.58 H, and undercut
  // under the belly, 0.536 H at the junction; the previous reading was ≈ 2 % narrow and ≈ 3 % full there)
  [133.0, 9.1],
  [137.4, 13.8],
  [140.4, 20.4],
  [141.8, 28.8],
  [141.3, 37.2],
  [139.2, 46.0],
  [135.6, 52.6],
  [131.6, 57.0],
  [132.0, 59.4],
  [136.6, 62.6],
  [145.6, 68.3],
  [150.5, 73.9],
  [154.9, 82.4],
  [159.7, 91.0],
  [164.0, 99.5],
  [167.0, 108.0],
  [169.1, 116.4],
  [170.2, 124.8],
  [170.4, 133.2],
  [170.2, 141.6],
  [169.6, 150.6],
  [168.5, 159.1],
  [166.9, 167.5],
  [164.9, 176.0],
  [162.5, 184.6],
  [159.6, 193.1],
  [156.2, 201.6],
  [152.3, 210.1],
  [149.0, 216.0],
  [145.9, 221.2],
  [141.8, 226.1],
  [136.8, 231.1],
  [132.0, 235.2],
  [127.8, 238.3],
  [121.7, 249.6],
  [114.7, 264.0],
  [106.7, 278.2],
  [98.6, 290.4],
  [93.1, 300.7],
  [91.0, 309.1],
  [90.2, 314.4],
  [89.0, 326.4],
  [88.2, 338.4],
  [88.2, 348.0],
  [89.3, 357.6],
  [90.2, 367.2],
  [91.3, 378.0],
  [92.6, 388.8],
  [94.3, 398.4],
  [96.5, 406.8],
  [98.9, 414.0],
  [101.8, 419.5],
  [104.9, 423.1],
  [108.2, 426.2],
  [110.9, 429.1],
  [112.1, 433.2],
  [113.4, 437.0],
  // the everted lip BAND (photo-11: a crisp lower edge ≈ 8 mm under the rim, the band leaning out above it)
  [114.6, 439.6, 'corner'],
  [117.3, 440.4],
  [118.5, 444.4],
  [119.3, 448.3],
]
