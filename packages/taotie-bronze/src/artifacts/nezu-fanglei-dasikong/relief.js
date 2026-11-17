// nezu-fanglei-dasikong — the décor, TRACED by hand from the flattened faces of photo-34
// (reference/nezu-fanglei-dasikong/faces/*.jpg, read off mm grids: .work/r8-dsk/solve/grid.py).
//
// Coordinates: x = developed mm from the side's centre line (left → right seen from outside), y = VESSEL height.
// One panel per side covers the whole body from the foot to the shoulder top and runs corner diagonal → corner
// diagonal, because the lower belly's hanging blades straddle the corners. The corner line is x = ±Qh(y)
// (half the side's developed width at that height): every unit that touches it is drawn symmetric about it, and
// a narrow strip along it is kept free of leiwen so the two panels that meet there agree.
// The narrow ±X sides repeat the broad face's design, compressed in x (inferred: the photographs show the front).
//
// Relief language (photo-34): FAT flat-topped bands ≈ 2.2 mm proud with round outer corners, a sunk contour line
// inside each edge, chains of small spirals cut on the bodies; big raised coil plates (concentric squared-round
// spirals); convex pillow eyes; whorl bosses; a fine leiwen ground (≈ 1.6 mm pitch). The hanging blades are a different
// language: fat round ridges ≈ 1.4 mm pitch, everything multi-ridge (kit § Ridge work, kit.dasikongBlade).

import FACES from '../../../reference/nezu-fanglei-dasikong/faces.json'
import MAIN_PLATES from '../../../reference/nezu-fanglei-dasikong/faces/face-main.plates.json'
import SHOULDER_PLATES from '../../../reference/nezu-fanglei-dasikong/faces/face-shoulder.plates.json'
import LID_PLATES from '../../../reference/nezu-fanglei-dasikong/faces/face-lid.plates.json'

const RELIEF = { band: 2.3, shoulder: 1.0, groove: 0.42, leiwen: 0.42 }
const NOFILL = { kind: 'none' }
const GROUND = { pitch: 1.2, line: 0.5, cell: [8, 13], roundness: 0.2, jitter: 0.06, pairs: 0.4, maxAspect: 1.5, fillers: true }

// Round r8-dsk-fix: the main mask, the shoulder kui and the lid mask are TRACED PLATES — outlines drawn band by band
// off the illumination-flattened faces (reference/nezu-fanglei-dasikong/faces/<face>.trace.json → <face>.plates.json,
// tools/trace.py) and raised by kit.tracedPlates: flat-topped plates with steep shoulders, TWO incised lines running
// parallel to every edge, spirals packed on the wide tops (the body band's C-hooks). Face x is measured from each
// face's own axis (the camera residual puts the photographed axis 3 mm left of the face centre).
const AXIS = { 'face-main': 117, 'face-shoulder': 114.5, 'face-lid': 85 }
const PLATES = {
  height: 2.3, shoulder: 0.55, pillow: 0.15, pillowWidth: 2.5, depth: 0.42,
  contour: { inset: 0.85, line: 0.42 }, contour2: { inset: 2.05, line: 0.36, depth: 0.3 },
  fill: { kind: 'leiwen', inset: 3.0, pitch: 0.85, line: 0.4, roundness: 1, cell: [2.6, 5.2], pairs: 0.5, maxAspect: 2.6, jitter: 0.04, fillers: false },
  bosses: [],
}
/** face mm (origin bottom-left, y up) → [x from the face axis × kx, VESSEL y], then through M */
function faceToVessel(face, M, kx = 1) {
  const F = FACES.faces[face]
  const up = F.up || [0, 1, 0]
  const k = up[1] / Math.hypot(up[0], up[1], up[2])
  return ([x, y]) => M([(x - AXIS[face]) * kx, F.center[1] + (y - F.height / 2) * k])
}
function traced(kit, panel, M, list, opts) {
  const plates = []
  for (const { face, data, kx } of list) {
    const map = faceToVessel(face, M, kx)
    for (const p of data.plates) plates.push({ outer: p.outer.map(map), holes: (p.holes || []).map((h) => h.map(map)) })
  }
  return kit.tracedPlates(panel, plates, { ...PLATES, ...opts })
}

const polyDraw = (pts) => (ctx) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill() }

/** element builders in face mm (x mirrored by s, scaled by kx), mapped through M */
function maker(kit, M, s, kx = 1) {
  const P = (p) => M([s * kx * p[0], p[1]])
  const mirrorSpiral = (sp) => sp && { ...sp, dir: sp.dir * s }
  return {
    P,
    S: (ctrl, o = {}) => kit.roundStroke(ctrl.map(P), { ...o, spiral: mirrorSpiral(o.spiral), startSpiral: mirrorSpiral(o.startSpiral) }),
    Sraw: (ctrl, o = {}) => kit.roundStroke(ctrl, o),
    B: (c, w, h, o = {}) => kit.roundPlate({ round: 0.45, ...o, w: w * kx, c: P(c), fill: o.fill && o.fill.kind === 'coil' ? { ...o.fill, hand: s > 0 ? 'right' : 'left' } : o.fill }),
  }
}

// ------------------------------------------------------------------ blades (lower belly, y 27–207)

// Round ridges: the blades are drawn entirely in fat round-topped threads (kit § Ridge work), measured on photo-34 at
// ≈ 1.35 mm pitch (spirals), ridge ≈ groove. The composition — border bundles, scroll columns, the squared spirals in
// slanted cells, horn bands, hooked eyes — is kit.dasikongBlade (src/kit/relief/motifs/ridges.js), authored in BLADE
// space (x from the blade's axis, vessel y) off faces/face-blades.jpg; here it is only placed on the panel.
const RIDGE = { width: 0.78, pitch: 1.4, height: 0.75, groove: 0.35 }

// ------------------------------------------------------------------ whorl bosses (shoulder 285–306, lid 404–419)

/**
 * a whorl boss (photo-34, face-lid / face-shoulder): a low dome in a sunk ring, five fat COMMAS swirling round a
 * small centre dot (a round sunk head, a tail sweeping out along the rim), and small round dots in the ring between
 * the tails.
 */
function whorl(kit, panel, c, d, { height = 2.6, hand = 1 } = {}) {
  kit.pillowBoss(panel, { c, w: d, h: d, round: 1, height, crown: 0.7, slit: false, ring: { gap: 0.8, line: 0.6, depth: 0.45 } })
  const R = d / 2, n = 5
  panel.sink((ctx) => {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    ctx.beginPath(); ctx.arc(c[0], c[1], R * 0.11, 0, Math.PI * 2); ctx.fill()
    for (let i = 0; i < n; i++) {
      const a0 = (i * 2 * Math.PI) / n + 0.3
      // head: a round pit
      const hx = c[0] + R * 0.4 * Math.cos(a0), hy = c[1] + R * 0.4 * Math.sin(a0)
      ctx.beginPath(); ctx.arc(hx, hy, R * 0.13, 0, Math.PI * 2); ctx.fill()
      // tail: tapering, sweeping out and round (drawn as shrinking dabs)
      for (let t = 0; t <= 1.0001; t += 0.08) {
        const a = a0 + hand * t * 1.35, r = R * (0.4 + 0.3 * t)
        ctx.beginPath(); ctx.arc(c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), R * (0.1 - 0.06 * t), 0, Math.PI * 2); ctx.fill()
      }
      // a small dot near the rim between the tails
      const ad = a0 - hand * 0.55
      ctx.beginPath(); ctx.arc(c[0] + R * 0.8 * Math.cos(ad), c[1] + R * 0.8 * Math.sin(ad), R * 0.065, 0, Math.PI * 2); ctx.fill()
    }
  }, { depth: 0.55, shoulder: 0.2, profile: 'u' })
}

// ------------------------------------------------------------------ panels

/**
 * The body panel of one side: { relief, panelW } — x = panelW/2 + developed mm, y = arc(y) along the front meridian.
 * ctx: { ppmm, seed, k (side index), kx (x scale of the mask design), Qh(y) (half developed width), arc, lug }
 */
export function bodyPanel(kit, { ppmm, seed, Qh, arc, kx = 1, lug = false, Hmax }) {
  const W = 2 * Qh(270) + 2
  const Hp = arc(Hmax)
  const p = new kit.ReliefPanel({ width: W, height: Hp, ppmm, seed })
  const M = ([x, y]) => [W / 2 + x, arc(y)]
  // ----- blades: the centre blade (scaled by kx on the narrow sides) and a blade on each corner line, both halves
  // drawn on both panels that meet there (identical, so the seam agrees)
  const ridges = kit.ridgeWork(p, RIDGE)
  kit.dasikongBlade(ridges.view(([x, y]) => M([x * kx, y])), { variant: 'centre', lug })
  for (const sd of [-1, 1]) kit.dasikongBlade(ridges.view(([x, y]) => M([sd * Qh(y) + x, y])), { variant: 'corner' })
  ridges.flush()
  // ----- main register + shoulder kui: traced plates (face-main, face-shoulder)
  traced(kit, p, M, [{ face: 'face-main', data: MAIN_PLATES, kx }], { seed })
  // the kui bodies (photo-34): 6–7 mm bands each carrying a chain of C-hooks — one contour line and a packed top
  traced(kit, p, M, [{ face: 'face-shoulder', data: SHOULDER_PLATES, kx }], { seed: seed + 3, contour2: null, fill: { ...PLATES.fill, inset: 1.5, cell: [2.2, 4.2], pitch: 0.75 } })
  const eyes = []
  for (const s of [1, -1]) {
    // main eye (face-main (91.6, 24.6)): an OVAL convex boss in a sunk ring; kui eye (face-shoulder (53, 50)): round
    eyes.push({ c: M([s * 25.4 * kx, 232.6]), w: 15.2 * kx, h: 11.6, round: 1, height: 3.4, crown: 0.95, slit: { len: 5.0, width: 0.9, depth: 0.6 }, ring: { gap: 0.7, line: 0.7, depth: 0.5 } })
    eyes.push({ c: M([s * 61.5 * kx, 325.4]), w: 6.6 * kx, h: 6.6, round: 1, height: 2.8, crown: 0.95, slit: false, ring: { gap: 0.5, line: 0.5, depth: 0.4 } })
  }
  for (const e of eyes) kit.pillowBoss(p, { slit: false, ...e })
  // ----- whorl-boss band (285–306)
  const xs = [0, 37, 74, 111].map((x) => x * kx)
  for (const x of xs) for (const s of x === 0 ? [1] : [1, -1]) whorl(kit, p, M([s * x, 295.5]), 20.5, { hand: s })
  // ----- borders and bowstrings: thin raised fillets across the side
  p.raise((ctx) => {
    const band = (y, h) => { const a = M([-Qh(y) - 2, y - h / 2]), b = M([Qh(y) + 2, y + h / 2]); ctx.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]) }
    band(209.5, 3.2) // fillet between the blades and the main register
    band(272.8, 3.0) // top border of the main register
    band(285.4, 1.2); band(305.8, 1.2) // the boss band's lines
    band(337.3, 1.2) // kui frieze top line
  }, { height: 1.0, shoulder: 0.45, profile: 'plateau' })
  p.raise((ctx) => {
    for (const y of [340.2, 343.4]) { const a = M([-Qh(y) - 2, y - 0.8]), b = M([Qh(y) + 2, y + 0.8]); ctx.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]) }
  }, { height: 0.9, profile: 'ridge' })
  // ----- grounds: leiwen in every field, kept off a 1.4 mm strip either side of the corner lines (seam agreement)
  const seamFree = (y0, y1) => {
    const pts = []
    for (let y = y0; y <= y1 + 0.01; y += 4) pts.push([Qh(y) - 1.4, y])
    const L = []
    for (let y = y1; y >= y0 - 0.01; y -= 4) L.push([-Qh(y) + 1.4, y])
    return [...pts, ...L].map(M)
  }
  const fill = (y0, y1, include, extra = {}) => kit.leiwenFill(p, { rect: { x: 0, y: arc(y0), w: W, h: arc(y1) - arc(y0) }, include, margin: 0.55 }, { ...GROUND, depth: RELIEF.leiwen, seed: seed + Math.round(y0), ...extra })
  fill(212, 271, polyDraw(seamFree(205, 280)))
  fill(287, 304.5, polyDraw(seamFree(280, 340)), { cell: [4.5, 8] })
  fill(307, 336.4, polyDraw(seamFree(300, 345)), { cell: [5, 9] })
  const relief = p.bake()
  let lugRelief = null
  if (lug) {
    // the low lug's hole (photo-34 / photo-03: a dark opening above the pendant head): a deep pocket in the wall
    // behind the lug's strap, so the cavity patina darkens it as the photographs show. The panel without it is the
    // back face (no lug: inferred), the same décor baked twice.
    // (round r8-dsk-fix: ≈ 38 × 14 mm and 13 mm deep, its floor PLAIN — the décor is first levelled off by a
    // plateau, so no leiwen shows inside — and its walls steep: it renders as the photographs' black opening)
    const pocket = (ctx) => { const a = M([-19, 86]), b = M([19, 100.5]); ctx.beginPath(); ctx.roundRect ? ctx.roundRect(a[0], a[1], b[0] - a[0], b[1] - a[1], [2, 2, 7, 7]) : ctx.rect(a[0], a[1], b[0] - a[0], b[1] - a[1]); ctx.fill() }
    p.raise(pocket, { height: 2.6, shoulder: 0.01, profile: 'plateau' })
    p.sink(pocket, { depth: 15.6, shoulder: 1.0, profile: 'u' })
    lugRelief = p.bake()
  }
  return { relief, lugRelief, panelW: W, panelH: Hp }
}

/** collar (y 348–397.5): a flush frieze of thin kui either side of a plain centre strip */
export function collarPanel(kit, { ppmm, seed, W, y0, y1, kx = 1 }) {
  const Hp = y1 - y0
  const p = new kit.ReliefPanel({ width: W, height: Hp, ppmm, seed })
  const M = ([x, y]) => [W / 2 + x, y - y0]
  const els = []
  for (const s of [-1, 1]) {
    const { S, P } = maker(kit, M, s, kx)
    els.push(
      S([[14, 385], [62, 385], [62, 377], [52, 377]], { width: 3.2, round: 0.8, inner: 0.25, end: 'spiral', spiral: { turns: 0.9, dir: -1, R: 1.8 }, fill: NOFILL }),
      S([[14, 365], [70, 365], [76, 371]], { width: 3.2, round: 0.8, inner: 0.25, end: 'spiral', spiral: { turns: 0.9, dir: 1, R: 1.8 }, fill: NOFILL }),
      S([[20, 357], [44, 357], [44, 361]], { width: 2.8, round: 0.8, inner: 0.25, end: 'spiral', spiral: { turns: 0.8, dir: 1, R: 1.5 }, fill: NOFILL }),
    )
    kit.pillowBoss(p, { c: P([20, 375]), w: 3.6 * kx, h: 3.6, round: 1, height: 0.25, crown: 0.8, slit: false })
  }
  const plate = kit.roundStroke([M([0, 352.5]), M([0, 394.5])], { width: 9, round: 0.15, start: 'flat', end: 'flat', contour: { inset: 1.2, line: 0.4 }, fill: NOFILL })
  // round r8-dsk-fix: photo-34 shows the collar near-black and nearly flush — only the centre plate reads
  kit.carve(p, els, { height: 0.14, shoulder: 0.2, depth: 0.12, contour: { inset: 0.5, line: 0.3 }, seed, irregularity: 0.6 })
  kit.carve(p, [plate], { height: 0.7, shoulder: 0.3, depth: 0.25, seed, irregularity: 0.4 })
  p.raise((ctx) => { ctx.fillRect(0, 349.5 - y0, W, 1.6); ctx.fillRect(0, 395.4 - y0, W, 1.4) }, { height: 0.8, shoulder: 0.35 })
  kit.leiwenFill(p, { rect: { x: 1.5, y: 351.5 - y0, w: W - 3, h: 43 }, margin: 0.45 }, { ...GROUND, pitch: 1.2, cell: [4.5, 8], depth: 0.1, seed })
  return p.bake()
}

/** lid slope (y 400–466): a row of whorl bosses under a mask whose centre is a flange (a separate mesh) */
export function lidPanel(kit, { ppmm, seed, Qh, arc, y0, y1, kx = 1 }) {
  const W = 2 * Qh(y0) + 2
  const Hp = arc(y1)
  const p = new kit.ReliefPanel({ width: W, height: Hp, ppmm, seed })
  const M = ([x, y]) => [W / 2 + x, arc(y)]
  // the lid mask: traced plates (face-lid) — fat stacked bands crowding the flange, a block round the eye, the big C
  traced(kit, p, M, [{ face: 'face-lid', data: LID_PLATES, kx }], { height: 2.6, shoulder: 0.6, seed })
  // the eye: a RECTANGULAR pillow with a slit (face-lid (68.5, 50.1) → ±16.5, 441)
  for (const s of [-1, 1]) kit.pillowBoss(p, { c: M([s * 16.5 * kx, 441.2]), w: 12.5 * kx, h: 7.6, round: 0.25, height: 1.6, crown: 0.7, base: 'field', slit: { len: 6.4, width: 1.5, depth: 0.8 } })
  for (const x of [0, 30, 60].map((v) => v * kx)) for (const s of x === 0 ? [1] : [1, -1]) whorl(kit, p, M([s * x, 411.2]), 14, { height: 2.3, hand: s })
  p.raise((ctx) => {
    const band = (y, h) => { const a = M([-Qh(y) - 2, y - h / 2]), b = M([Qh(y) + 2, y + h / 2]); ctx.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]) }
    band(402.2, 1.4); band(420.6, 1.4)
  }, { height: 0.9, shoulder: 0.4 })
  const seamFree = (ya, yb) => {
    const pts = []
    for (let y = ya; y <= yb + 0.01; y += 2) pts.push([Qh(y) - 1.4, y])
    for (let y = yb; y >= ya - 0.01; y -= 2) pts.push([-Qh(y) + 1.4, y])
    return pts.map(M)
  }
  kit.leiwenFill(p, { rect: { x: 0, y: arc(403.5), w: W, h: arc(419.5) - arc(403.5) }, include: polyDraw(seamFree(400, 425)), margin: 0.5 }, { ...GROUND, pitch: 1.3, cell: [4, 7], depth: 0.3, seed })
  kit.leiwenFill(p, { rect: { x: 0, y: arc(422), w: W, h: arc(463) - arc(422) }, include: polyDraw(seamFree(418, 466)), margin: 0.5 }, { ...GROUND, pitch: 1.3, cell: [4.5, 8], depth: 0.3, seed: seed + 1 })
  return { relief: p.bake(), panelW: W }
}
