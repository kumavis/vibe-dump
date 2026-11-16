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
// Reading of her face in face-panel mm: eyeball (a separate shell, already a convex boss) centre
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

/** the face: C-horn brows, pointed canthi and a slit pupil, a kui on the cheek, a leiwen field with a bowstring edge */
export function drawFace(kit, panel, { seed = 1 } = {}) {
  const H = 4.2 // band height (mm): FAT and proud
  const els = [
    // the brow becomes a fat C-horn: it leaves the centre notch along her brow ridge over the eye, turns up at
    // the temple, sweeps back across the forehead and rolls in on itself
    smoothBand(kit, [[121, 89], [108, 99], [90, 104], [70, 103], [54, 101], [42, 112], [40, 129], [49, 145], [68, 154], [90, 155], [106, 147], [110, 134]],
      lerpW([[0, 8], [0.12, 13], [0.38, 16], [0.55, 17.5], [0.8, 15], [1, 12.5]]),
      { start: 'point', end: 'spiral', spiral: { turns: 1.05, dir: -1, R: 6.5 }, contour: { inset: 1.8, line: 0.6 }, ticks: { side: 'right', pitch: 5.5, line: 0.6, skipEnds: 2 } }),
    // an inner hook inside the C, rolled up toward the horn's curl
    smoothBand(kit, [[97, 119], [80, 117], [66, 123], [64, 134]], lerpW([[0, 6], [0.4, 9], [1, 8]]),
      { start: 'blunt', end: 'spiral', spiral: { turns: 0.85, dir: -1, R: 4 } }),
    // the canthi: fat spurs pinched to points, leaving the eyeball's rim — the inner one hooks down toward the nose
    smoothBand(kit, [[114, 53], [120, 45], [119, 33]], lerpW([[0, 8.5], [0.4, 7], [1, 0.6]]), { start: 'round', end: 'point', contour: false }),
    smoothBand(kit, [[64, 57], [54, 60], [45, 58]], lerpW([[0, 9], [1, 0.6]]), { start: 'round', end: 'point', contour: false }),
    // the kui on the cheek (the flat of the face between the eye and the ear — the strip under the eye is too
    // steep and narrow for one): upright, head down toward the eye's corner, tail rolled at the top, a leg, a quill
    smoothBand(kit, [[29, 101], [28, 82], [28, 60], [29, 49]], lerpW([[0, 6.4], [1, 7.4]]), { start: 'spiral', startSpiral: { turns: 1, dir: 1, R: 3.8 }, end: 'blunt' }),
    smoothBand(kit, [[34, 41], [38.5, 33], [36, 25.5]], lerpW([[0, 4.8], [1, 4]]), { end: 'spiral', spiral: { turns: 0.9, dir: -1, R: 2.6 }, contour: false }),
    smoothBand(kit, [[24, 38], [21.5, 28]], lerpW([[0, 4], [1, 0.6]]), { end: 'point', contour: false }),
    smoothBand(kit, [[23.5, 71], [18.5, 66], [18.5, 59]], lerpW([[0, 4], [1, 0.6]]), { end: 'point', contour: false }),
    smoothBand(kit, [[33.5, 77], [39.5, 83], [39, 92]], lerpW([[0, 4.4], [1, 4]]), { end: 'spiral', spiral: { turns: 0.85, dir: 1, R: 2.4 }, contour: false }),
  ]
  kit.carve(panel, els, { height: H, shoulder: H * 0.6, depth: 0.45, seed, irregularity: 1, contour })

  // the kui's round eye
  kit.pillowBoss(panel, { c: [29, 43], w: 7.2, h: 7.2, round: 1, height: H + 1.3, crown: 0.8, slit: { len: 3.2, width: 0.8, depth: 0.6 }, ring: false })

  // the slit pupil, sunk across her raised pupil disk
  const E = FACE.eye
  panel.sink((ctx) => {
    ctx.beginPath()
    ctx.moveTo(E.c[0] - 9.5, E.c[1])
    ctx.quadraticCurveTo(E.c[0], E.c[1] + 3.4, E.c[0] + 9.5, E.c[1])
    ctx.quadraticCurveTo(E.c[0], E.c[1] - 3.4, E.c[0] - 9.5, E.c[1])
    ctx.fill()
  }, { depth: 1.8, shoulder: 1.2, profile: 'u' })

  // a bowstring along the field's edge
  const edge = kit.shapes.spline(FIELD, 0.8)
  panel.raise((ctx) => {
    ctx.lineWidth = 2.6
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    edge.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
    ctx.stroke()
  }, { height: 1.3, profile: 'dome' })

  // the fine leiwen ground inside the field — never on the eyeball, the nose / muzzle, or the flange's root strip
  kit.leiwenFill(panel, {
    rect: { x: 0, y: 0, w: 123, h: FACE.height },
    avoid: 'raised',
    margin: 0.55,
    include: (ctx) => {
      ctx.beginPath()
      edge.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
      ctx.lineTo(98, 16)
      ctx.lineTo(98, 20)
      ctx.quadraticCurveTo(104, 31, 123, 32)
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
