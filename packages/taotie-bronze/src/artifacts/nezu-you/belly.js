// Nezu you 饕餮文卣 (90086) — the BELLY MASK as FAT RAISED SLABS (the slab pass, from the project owner's own tracing).
//
// The owner drew the mask's horn over photo-32 (reference/nezu-you/owner-trace-horn.json): ONE raised slab — a fat C,
// a wide arch across the top, a blunt foot at the left, the right leg curling in to a hooked point — standing well
// proud of a ground of fine squared spirals; the lines along it, the notches on its top edge and the small spiral in
// its curl are INCISED into that one slab. The earlier readings (bundles of thinner bands) were rejected.
// Every other slab was painted by eye on photo-32, snapped to the photograph's edges (tools/snap.py) and kept only if
// tools/support.py finds the edge in the photograph (the gate): reference/nezu-you/slabs.json holds every outline
// (photo-32 px and panel mm, the owner's marked), .work/slab-nezu-you/review.jpg shows them numbered on the photo.
//
// Frame: panel mm of the belly register (x = developed mm from the face's centre line, y = arc mm above the register's
// lower edge), RIGHT half; the mask is mirror-symmetric about the centre flange (photo-31 developed), so the left half
// is the mirror image. Passages the photograph does not settle (no edge where a slab would be: the post between the
// eye and the C-block, the inner bands beside the centre flange, the side kui's upright bar, the far end of the outer
// field) are left as spiral ground for the owner to draw.
//
// Construction (KIT.md § Traced plates, § Ridge work):
//   slabs     kit.tracedPlates on the outlines — a flat top on a rounded shoulder, an incised line running along
//             inside every edge (two on the horn, which also carries its notches); the horn the proudest
//   eye       a broad domed disc (kit.pillowBoss) standing on its socket slab, a sunk ring round it, a deep pupil
//   C-block   its deep pocket sunk well below the ground
//   body      the lower body slab carries fine spirals on its top (a leiwen fill)
//   ground    kit.ridgeGround: fine raised squared spirals packed into everything that is not slab

import SLABS from '../../../reference/nezu-you/slabs.json'

const SLAB = {
  horn: { height: 3.2, shoulder: 1.1, pillow: 0.35, pillowWidth: 4 }, // the owner: "well proud"
  face: { height: 2.7, shoulder: 1.0, pillow: 0.3, pillowWidth: 3.5 },
  line: { inset: 1.5, line: 0.75 }, // the incised line along every slab edge
  line2: { inset: 3.7, line: 0.65 }, // the horn's second line (its wide arch and the curl)
  depth: 0.6,
}

/** the belly slabs, right half, panel mm: { horn, slabs: [{ name, outline }], body, features } */
export function bellyDesign() {
  const horn = []
  const slabs = []
  let body = null
  for (const s of SLABS.slabs) {
    if (s.by === 'owner') horn.push(s.face_mm)
    else if (s.name === 'body') body = s.face_mm
    else slabs.push({ name: s.name, outline: s.face_mm })
  }
  return { horn, slabs, body, features: SLABS.features }
}

/** draw the belly into a panel (mm, y up, centre line at W/2) */
export function drawBelly(kit, panel, size, { seed = 0 } = {}) {
  const W = panel.width, H = panel.height, cx = W / 2
  const hw = (y) => (size.widthAt ? size.widthAt(Math.max(0, Math.min(H, y))) / 2 : W / 2)
  const D = bellyDesign()
  const sides = [1, -1]
  const T = (side) => ([x, y]) => [cx + side * x, y]
  const both = (list) => sides.flatMap((side) => list.map((o) => ({ outer: o.map(T(side)), holes: [] })))
  // register top edge: a low rounded border band
  panel.raise((ctx) => ctx.fillRect(0, H - 2.3, W, 1.6), { height: 1.1, shoulder: 0.7, profile: 'plateau' })

  // 1) the slabs: the owner's horn (two incised lines along it), the face slabs (one line), the body (spirals on top)
  kit.tracedPlates(panel, both(D.horn), { ...SLAB.horn, contour: SLAB.line, contour2: SLAB.line2, depth: SLAB.depth, seed })
  kit.tracedPlates(panel, both(D.slabs.map((s) => s.outline)), { ...SLAB.face, contour: SLAB.line, contour2: false, depth: SLAB.depth, seed: seed + 1 })
  if (D.body) kit.tracedPlates(panel, both([D.body]), { ...SLAB.face, height: 2.5, contour: { inset: 1.3, line: 0.7 }, contour2: false, depth: 0.5,
    fill: { kind: 'leiwen', inset: 2.4, pitch: 1.1, line: 0.5, cell: [4, 7.5], roundness: 0.35, pairs: 0.3, maxAspect: 1.6 }, seed: seed + 2 })

  // 2) incised detail on the tops: the horn's notches; the C-block's deep pocket
  const F = D.features
  panel.sink((ctx) => {
    ctx.lineCap = 'round'; ctx.lineWidth = 1.1
    for (const side of sides) for (const n of F.notches.face_mm) {
      const [a, b] = n.map(T(side)); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke()
    }
  }, { depth: 0.8, shoulder: 0.3, profile: 'u' })
  panel.sink((ctx) => {
    ctx.beginPath()
    for (const side of sides) { F.pocket.face_mm.map(T(side)).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath() }
    ctx.fill()
  }, { depth: 1.8, shoulder: 0.6, profile: 'u' })

  // 3) the eyes: a broad domed disc on its socket slab, a sunk ring round it, the pupil a deep pit
  for (const side of sides) {
    const e = F.eye, c = T(side)(e.c), d = 2 * e.r - 4
    panel.sink((ctx) => { ctx.beginPath(); ctx.arc(c[0], c[1], d / 2 + 0.9, 0, Math.PI * 2); ctx.arc(c[0], c[1], d / 2 + 0.1, 0, Math.PI * 2, true); ctx.fill() }, { depth: 0.6, shoulder: 0.3, profile: 'u' })
    kit.pillowBoss(panel, { c, w: d, h: d, round: 1, height: 4.4, crown: 0.42, slit: false, ring: false })
    const pc = T(side)(F.pupil.c)
    panel.sink((ctx) => { ctx.beginPath(); ctx.arc(pc[0], pc[1], F.pupil.r, 0, Math.PI * 2); ctx.fill() }, { depth: 3.0, shoulder: F.pupil.r * 0.45, profile: 'u' })
  }

  // 4) the ground: fine raised square spirals of one round thread, packed into everything that is not slab
  const inside = (ctx) => {
    ctx.beginPath()
    for (let y = 0; y <= H; y += 2) ctx.lineTo(cx + hw(y) - 3.4, y)
    for (let y = H; y >= 0; y -= 2) ctx.lineTo(cx - hw(y) + 3.4, y)
    ctx.closePath(); ctx.fill()
  }
  kit.ridgeGround(panel, { rect: { x: 0, y: 0.4, w: W, h: H - 2.9 }, include: inside, avoid: 'raised' }, {
    pitch: 1.2, width: 0.78, height: 0.62, seed: seed + 3, leiwen: { cell: [4.2, 8.4], pairs: 0.25, maxAspect: 1.7 },
  })
  return D
}
