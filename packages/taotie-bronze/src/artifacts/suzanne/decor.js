// Suzanne as a taotie — the décor, drawn in the PROJECTORS' panel spaces.
//
// How it was drawn: the subdivided head was unwrapped through each projector below (.work/classics-mesh
// unwrap: every vertex → panel mm, shaded, gridded every 10 mm) and the bands were placed on her own
// features, read off those grids. The face panel is a latitude / longitude map round a centre behind her
// eyes (spherical projector: true-size across the brow, x = longitude · 92 mm, y = latitude · 92 mm,
// longitude 0 / latitude 0 at panel [128, 64]); the ear panel is planar, square to the ear's bowl.
// Only the LEFT half of the face is authored (panel x < 128) and mirrored; the right ear reads the same
// map through a mirrored projector.
//
// Reading of her face in face-panel mm (the décor below: almond lids + round pupil pit, horns from the flange along
// the brow to a coil over each temple, one raised field edge): eyeball (a separate shell, already a convex boss) centre
// [89, 56], radius 27, its raised pupil disk radius 10.5; brow ridge from the centre notch [128, 77] up to
// its peak [101, 100], out to [66, 96] and down to [46, 82]; nose bump at [128, 12], the muzzle below the
// panel; forehead y 100–160, crown y 160–180; cheek y 4–32 under the eye, x 26–80.

export const FACE = {
  width: 256, height: 180,
  projector: { center: [0, 150, -15], pole: [0, 1, 0], front: [0, 0, 1], radius: 92, anchor: [128, 64], fade: 7, facing: [0.12, 0.42] },
  eye: { c: [89, 56], r: 27, pupil: 10.5 },
}

export const EAR = {
  width: 72, height: 80,
  // right ear (+X); the left ear mirrors it (center x and normal x negated, mirror: true)
  projector: { center: [128, 135, -45], normal: [0.36, 0, 0.933], up: [0, 1, 0], fade: 4, facing: [0.2, 0.5], depth: [-10, 30] },
}

const contour = { inset: 1.3, line: 0.55 }

/** a smooth band through control points (Catmull-Rom, dense) with a width law w(t), t ∈ [0, 1] along it */
const smoothBand = (kit, pts, w, opts = {}) => kit.roundStroke(kit.shapes.spline(pts, 0.8), { width: w, round: 0.6, inner: 0.18, ...opts })
const lerpW = (stops) => (t) => {
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const [t0, a] = stops[i - 1], [t1, b] = stops[i]
      const f = (t - t0) / Math.max(t1 - t0, 1e-6)
      return a + (b - a) * f * f * (3 - 2 * f)
    }
  }
  return stops[stops.length - 1][1]
}

/** the décor field's outer edge (left half, panel mm): over the crown, down the temple, along under the cheek */
const FIELD = [[128, 168], [96, 167], [62, 160], [32, 146], [16, 120], [12, 84], [13, 44], [17, 25], [30, 16], [60, 15], [90, 16]]

/** the face: wide-open eyes in an almond lid, fat C-horns coiled at the temples, a leiwen field with a raised edge */
export function drawFace(kit, panel, { seed = 1 } = {}) {
  const E = FACE.eye
  // 1) the horns — real volume (≈ 9 mm proud, a rounded section): each leaves the centre flange, sweeps out along
  //    the brow above the eye and rolls back in a full coil over the temple, beside the eye
  const horn = smoothBand(kit, [[122, 91], [107, 104], [86, 110], [64, 108], [46, 103], [32, 112], [26, 128], [33, 142], [49, 146], [59, 136], [55, 124]],
    lerpW([[0, 9], [0.12, 12.5], [0.45, 14], [0.75, 13], [1, 11]]),
    { start: 'blunt', capRound: 0.5, end: 'spiral', spiral: { turns: 0.7, dir: 1, R: 4.5 }, contour: { inset: 1.9, line: 0.65 } })
  kit.carve(panel, [horn], { height: 9, shoulder: 5.5, depth: 0.5, seed, irregularity: 1 })

  // 2) the eye: one almond lid round her eyeball dome, a long point dipping down toward the nose, a short one out
  const H = 4.2
  const els = [
    smoothBand(kit, [[40, 61], [52, 77], [72, 87], [95, 89], [113, 80], [120, 63], [121, 40]], lerpW([[0, 0.8], [0.12, 6.5], [0.45, 8], [0.8, 7], [1, 0.6]]),
      { start: 'point', end: 'point', contour: false }),
    smoothBand(kit, [[40, 61], [52, 40], [72, 27], [96, 25], [111, 30], [119, 41]], lerpW([[0, 0.8], [0.15, 5.5], [0.6, 6.5], [1, 3]]),
      { start: 'point', end: 'round', contour: false }),
    // a hooked crest beside the flange, above the horns
    smoothBand(kit, [[118, 119], [118, 160], [104, 172]], lerpW([[0, 8], [0.5, 9], [1, 8]]), { end: 'spiral', spiral: { turns: 0.9, dir: 1, R: 4.2 } }),
  ]
  kit.carve(panel, els, { height: H, shoulder: H * 0.6, depth: 0.45, seed: seed + 1, irregularity: 1, contour })

  // 3) the pupil: a round pit in the centre of the dome, a quarter of its diameter, wide open
  panel.sink((ctx) => { ctx.beginPath(); ctx.arc(E.c[0], E.c[1], E.r * 0.25 * 2 / 2 + 0.5, 0, Math.PI * 2); ctx.fill() }, { depth: 3, shoulder: 2.2, profile: 'u' })

  // 4) the field's edge: one raised band along the hairline, down the temple, under the cheek and up the muzzle's edge
  const edge = kit.shapes.spline(FIELD.concat([[99, 19], [107, 28], [123, 33]]), 0.8)
  panel.raise((ctx) => {
    ctx.lineWidth = 3.2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    edge.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
    ctx.stroke()
  }, { height: 1.8, profile: 'dome' })

  // 5) the fine leiwen ground filling the whole field (brow, forehead, temple, cheek) up to the raised edges
  kit.leiwenFill(panel, {
    rect: { x: 0, y: 0, w: 123, h: FACE.height },
    avoid: 'raised',
    margin: 0.55,
    include: (ctx) => {
      ctx.beginPath()
      edge.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
      ctx.lineTo(123, 168)
      ctx.closePath()
      ctx.moveTo(E.c[0] + E.r + 1.5, E.c[1])
      ctx.arc(E.c[0], E.c[1], E.r + 1.5, 0, Math.PI * 2, true)
      ctx.fill('evenodd')
    },
  }, { pitch: 1.25, line: 0.5, depth: 0.45, cell: [5, 9], pairs: 0.25, maxAspect: 1.5, roundness: 0.12, jitter: 0.06, hand: 'left', seed: seed + 11 })
  panel.mirrorX()
}

/** the ear: one big spiral band coiled in the bowl, leiwen round it */
export function drawEar(kit, panel, { seed = 2 } = {}) {
  const H = 3
  const coil = smoothBand(kit, [[21, 11], [12, 29], [12, 50], [24, 64], [42, 66], [54, 54], [55, 38], [46, 28]], lerpW([[0, 6], [0.25, 10], [1, 9]]), {
    start: 'point', end: 'spiral', spiral: { turns: 1.3, dir: -1, R: 8.5 },
  })
  kit.carve(panel, [coil], { height: H, shoulder: H * 0.6, depth: 0.42, seed, irregularity: 1, contour })
  // leiwen only in the bowl: the rim and the root where the projector lets go stay plain (no cut-off ground)
  kit.leiwenFill(panel, { rect: { x: 0, y: 0, w: panel.width, h: panel.height }, avoid: 'raised', margin: 0.55,
    include: (ctx) => { ctx.beginPath(); ctx.ellipse(33, 39, 24, 28.5, 0, 0, Math.PI * 2); ctx.fill() } },
    { pitch: 1.2, line: 0.5, depth: 0.42, cell: [5, 8.5], pairs: 0.2, maxAspect: 1.4, roundness: 0.12, jitter: 0.06, seed: seed + 5 })
}
