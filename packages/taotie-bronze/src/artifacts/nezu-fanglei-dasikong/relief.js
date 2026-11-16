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
// spirals) as the blades' eyes and cheeks; convex pillow eyes; whorl bosses; a fine leiwen ground (≈ 1.6 mm pitch).

const RELIEF = { band: 2.3, shoulder: 1.0, groove: 0.42, leiwen: 0.42 }
const CONTOUR = { inset: 0.75, line: 0.42 }
const SPIRALS = { kind: 'spirals', line: 0.4, pitch: 0.95, gap: 0.35, square: 0.25, tail: 'merge', min: 2.6 }
const NOFILL = { kind: 'none' }
const ROUND = { round: 0.7, inner: 0.22 }
const COIL = { kind: 'coil', line: 0.45, pitch: 1.25 }
const GROUND = { pitch: 1.2, line: 0.5, cell: [8, 13], roundness: 0.2, jitter: 0.06, pairs: 0.4, maxAspect: 1.5, fillers: true }

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

// ------------------------------------------------------------------ blades (lower belly, y 28–207)

/**
 * A hanging blade (face-blades): axis ax(y), half width hw(y), top y0, tip y1. Raised line-border strip with three
 * grooves, a strip of C-scrolls inside it (a raised band with a spiral chain cut on it), a plain nose strip on the
 * axis, and in its upper part a mask: a frieze of two bands, a "7" horn per half with a coil plate (eye) inside it
 * and a big coil plate (cheek) below. Everything else inside is leiwen. Returns { outline, inner, els, sinks }.
 */
function blade(kit, M, { ax, hw, y0, y1, k = 1, mask = true, nose = [0, 0] }) {
  const ys = []
  for (let y = y1; y <= y0 + 1e-6; y += 2) ys.push(y)
  if (ys[ys.length - 1] < y0) ys.push(y0)
  const edge = (side, inset) => ys.map((y) => [ax(y) + side * Math.max(0, hw(y) - inset * (y - y1 < 8 ? (y - y1) / 8 : 1)), y])
  const ring = (inset) => {
    const r = edge(1, inset), l = edge(-1, inset).reverse()
    return [...r, ...l].map(M)
  }
  const outline = ring(0), inner = ring(14.5)
  const strip0 = ring(5.2)
  const els = []
  const lines = []
  const scrolls = []
  const coils = []
  for (const d of [1.35, 2.6, 3.85]) {
    for (const side of [-1, 1]) lines.push(edge(side, d).filter((p) => p[1] > y1 + d * 1.6).map(M))
  }
  // C-scroll strips: one raised band per side, a spiral chain cut on it
  for (const side of [-1, 1]) {
    const pts = edge(side, 9.0).filter((p) => p[1] > y1 + 13 && p[1] < y0 - 1.5)
    if (pts.length > 2) {
      els.push(kit.roundStroke([pts[pts.length - 1], pts[Math.floor(pts.length / 2)], pts[0]].map(M), { width: 6.6, round: 0.6, inner: 0.2, end: 'round', start: 'flat', contour: { inset: 0.6, line: 0.38 }, fill: NOFILL }))
      // the C-scrolls cut on it: small round spirals every ≈ 6.2 mm, alternating hand (cheaper than a spiral chain)
      const a = pts[0], b = pts[pts.length - 1]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.floor((L - 4) / 7))
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n
        const c = M([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
        const hand = (i % 2 ? 1 : -1) * side, ph = Math.atan2(b[1] - a[1], b[0] - a[0])
        const sp = []
        for (let u = 0; u <= 1.0001; u += 0.06) {
          const ang = ph + hand * u * Math.PI * 2.6, r = 0.4 + 2.5 * u
          sp.push([c[0] + r * Math.cos(ang), c[1] + r * Math.sin(ang)])
        }
        scrolls.push(sp)
      }
    }
  }
  // nose strip on the axis
  if (nose[1] > nose[0]) {
    els.push(kit.roundStroke([[ax(nose[1]), nose[1]], [ax(nose[0]), nose[0]]].map(M), { width: 3.6 * Math.max(0.8, k), round: 0.4, inner: 0.1, start: 'flat', end: 'round', contour: false, fill: NOFILL }))
  }
  if (mask) {
    // the mask, traced on the centre blade (face-blades): u from the axis (× k), y relative to the top y0 = 207
    const U = (u, y) => M([ax(y0 + y) + u * k, y0 + y])
    for (const s of [-1, 1]) {
      const Sx = (ctrl, o) => kit.roundStroke(ctrl.map(([u, y]) => U(s * u, y)), { ...o, spiral: o.spiral && { ...o.spiral, dir: o.spiral.dir * s } })
      // top frieze (y 186–204): two stacked bands, the upper turning down at its outer end, the lower rolled
      els.push(Sx([[5.5, -7.5], [44, -7.5], [44, -14]], { width: 4.6, ...ROUND, end: 'spiral', spiral: { turns: 0.8, dir: 1, R: 2.2 }, fill: NOFILL }))
      els.push(Sx([[50, -18.5], [12, -18.5]], { width: 4.6, ...ROUND, end: 'spiral', spiral: { turns: 1, dir: 1, R: 2.4 }, fill: k > 0.95 ? { ...SPIRALS, min: 3.0 } : NOFILL }))
      // the "7" horn: across under the frieze, down the outer side, the end curling in
      els.push(Sx([[5, -27.5], [38, -27.5], [38, -54]], { width: [7, 7.2, 6.2], ...ROUND, end: 'spiral', spiral: { turns: 0.9, dir: -1, R: 3.2 }, fill: k > 0.95 ? { ...SPIRALS, min: 3.6, chain: false } : NOFILL }))
      // eye coil inside the horn, cheek coil below it (low plates: the squared spirals read as cut into the ground)
      coils.push(kit.roundPlate({ c: U(s * 18, -40.5), w: 23 * k, h: 18, round: 0.22, fill: { ...COIL, hand: s > 0 ? 'right' : 'left' } }))
      coils.push(kit.roundPlate({ c: U(s * 16.5, -66), w: 25 * k, h: 24, round: 0.2, fill: { ...COIL, hand: s > 0 ? 'left' : 'right' } }))
    }
  }
  return { outline, inner, strip0, lines, els, scrolls, coils }
}

// ------------------------------------------------------------------ main register (y 213–271)

function mainDesign(kit, M, s, kx, Qh) {
  const { S, B, P } = maker(kit, M, s, kx)
  void B
  const els = [
    // the 冂 horn (face-main): one fat band from beside the centre strip up, along the top, down the outer side,
    // back along the bottom, its end turning up into the leiwen-filled hollow
    S([[8.5, 246], [8.5, 266.3], [60, 266.3], [60, 245.5], [22, 245.5]], { width: [7.2, 7.6, 7.8, 7.6, 7.2], ...ROUND, end: 'round', fill: NOFILL }),
    // the nested inner band (face-main: a second, thinner 冂 inside the first, its hollow leiwen)
    S([[19, 251], [19, 257.5], [50, 257.5], [50, 251.5], [42, 251.5]], { width: 4.6, ...ROUND, end: 'spiral', spiral: { turns: 0.8, dir: -1, R: 1.8 }, fill: NOFILL }),
    // the body band from the eye outward, a chain of spirals cut on it, its outer end rolled down
    S([[39, 233.5], [92, 233.5]], { width: 10, ...ROUND, start: 'blunt', end: 'spiral', spiral: { turns: 0.9, dir: -1, R: 3.8 }, fill: { ...SPIRALS, min: 5.2, size: 6.2, gap: 1.2, tail: 'radial' } }),
    // lower jaw: a band rolled up into a big curl under the eye
    S([[62, 217], [31, 217]], { width: 7.2, ...ROUND, end: 'spiral', spiral: { turns: 1.25, dir: -1, R: 5.4, gap: 0.9 }, fill: NOFILL }),
    S([[8, 214.5], [8, 226], [16, 226]], { width: 5.6, ...ROUND, end: 'spiral', spiral: { turns: 0.8, dir: -1, R: 2.2 }, fill: NOFILL }),
    // outer coil ("ear"): a band along the bottom of the upper field, up the outer side and rolled into a big spiral
    S([[77, 243.5], [117, 243.5], [117, 262], [97, 262]], { width: 6.8, ...ROUND, end: 'spiral', spiral: { turns: 1.35, dir: 1, R: 6.6, gap: 0.9 }, fill: NOFILL }),
    // lower outer hook
    S([[76, 216], [115, 216], [115, 227.5]], { width: 6.2, ...ROUND, end: 'spiral', spiral: { turns: 0.9, dir: 1, R: 2.8 }, fill: NOFILL }),
  ]
  // centre strip (one per panel: drawn by the s = +1 half only)
  if (s > 0) els.push(kit.roundStroke([M([0, 213]), M([0, 270.5])], { width: 7.4, round: 0.2, inner: 0.1, start: 'flat', end: 'flat', contour: { inset: 3.4, line: 0.5 }, fill: NOFILL }))
  const eyes = [{ c: P([27.5, 233.5]), w: 17 * kx, h: 13.5, round: 0.62, height: 3.2, crown: 0.85, slit: { len: 5.5, width: 0.9, depth: 0.7 }, ring: { gap: 0.8, line: 0.55, depth: 0.4 } }]
  void Qh
  return { els, eyes }
}

// ------------------------------------------------------------------ shoulder: whorl-boss band (285–306) and kui frieze (307–336)

function kuiDesign(kit, M, s, kx) {
  const { S, P } = maker(kit, M, s, kx)
  const els = [
    // the kui facing the centre head (face-shoulder, photo-34): three fat rows — a crest band with a spiral chain
    // (329.5), the jointed body running to the corner and rolling up (320), the legs and tail hook (311.5) — and a
    // head block with the eye at x 26–36
    S([[36, 333], [100, 333]], { width: 5.8, ...ROUND, start: 'blunt', end: 'spiral', spiral: { turns: 0.9, dir: 1, R: 2.4 }, fill: { ...SPIRALS, min: 2.4 } }),
    S([[40, 324.3], [106, 324.3], [106, 331]], { width: 6.4, ...ROUND, start: 'blunt', end: 'spiral', spiral: { turns: 0.9, dir: 1, R: 2.4 }, fill: { ...SPIRALS, joints: true, min: 2.4 } }),
    S([[30, 315.5], [62, 315.5]], { width: 5.6, ...ROUND, end: 'spiral', spiral: { turns: 0.9, dir: -1, R: 2.2 }, fill: NOFILL }),
    S([[70, 315.5], [100, 315.5]], { width: 5.6, ...ROUND, start: 'spiral', startSpiral: { turns: 0.8, dir: 1, R: 2.2 }, end: 'round', fill: NOFILL }),
    S([[24, 330], [24, 318]], { width: 6.2, ...ROUND, end: 'spiral', spiral: { turns: 0.8, dir: 1, R: 2.2 }, fill: NOFILL }),
  ]
  const eyes = [{ c: P([32, 324.5]), w: 6.6 * kx, h: 5.8, round: 0.8, height: 2.9, crown: 0.9, slit: false }]
  return { els, eyes }
}

/** a whorl boss: a domed disc with four comma grooves swirling round a small centre ring, a sunk ring round it */
function whorl(kit, panel, c, d, { height = 2.6, hand = 1 } = {}) {
  kit.pillowBoss(panel, { c, w: d, h: d, round: 1, height, crown: 0.75, slit: false, ring: { gap: 0.9, line: 0.6, depth: 0.45 } })
  const R = d / 2
  panel.sink((ctx) => {
    ctx.lineWidth = 0.55
    ctx.lineCap = 'round'
    ctx.beginPath(); ctx.arc(c[0], c[1], R * 0.2, 0, Math.PI * 2); ctx.stroke()
    for (let i = 0; i < 4; i++) {
      const a0 = (i * Math.PI) / 2
      ctx.beginPath()
      for (let t = 0; t <= 1.0001; t += 0.1) {
        const a = a0 + hand * t * 1.6, r = R * (0.32 + 0.48 * t)
        const x = c[0] + r * Math.cos(a), y = c[1] + r * Math.sin(a)
        if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      }
      ctx.stroke()
      // the comma's head: a little sunk dot at its inner end
      ctx.beginPath(); ctx.arc(c[0] + R * 0.34 * Math.cos(a0), c[1] + R * 0.34 * Math.sin(a0), 0.75, 0, Math.PI * 2); ctx.fill()
    }
  }, { depth: 0.45, shoulder: 0.2, profile: 'u' })
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
  const t0 = performance.now(), lap = (l) => console.info(`  panel ${l} ${Math.round(performance.now() - t0)}`)
  const M = ([x, y]) => [W / 2 + x, arc(y)]
  const strip = (y) => [[-Qh(y), y], [Qh(y), y]]
  void strip
  // ----- blades
  const TOP = 207
  const centre = blade(kit, M, { ax: () => 0, hw: (y) => 65 * kx * Math.pow(Math.max(0, (y - 28) / (TOP - 28)), 0.92), y0: TOP, y1: 28, k: kx, nose: [lug ? 116 : 40, 186] })
  const corners = [-1, 1].map((sd) => blade(kit, M, { ax: (y) => sd * Qh(y), hw: (y) => 57 * Math.pow(Math.max(0, (y - 45) / (TOP - 45)), 0.95), y0: TOP, y1: 45, k: 0.88, nose: [52, 186] }))
  const blades = [centre, ...corners]
  // raised border strips (outline minus its 5.2 mm inset), grooves cut after
  p.raise((ctx) => {
    for (const b of blades) {
      ctx.beginPath()
      b.outline.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath()
      b.strip0.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath()
      ctx.fill('evenodd')
    }
  }, { height: 1.3, shoulder: 0.5, profile: 'plateau' })
  p.sink((ctx) => {
    ctx.lineWidth = 0.42; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    for (const b of blades) for (const l of b.lines) { if (l.length < 2) continue; ctx.beginPath(); l.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke() }
  }, { depth: 0.35, shoulder: 0.15, profile: 'u' })
  lap('borders')
  // ----- main register + shoulder elements
  const eyes = [], mainEls = [], kuiEls = []
  for (const s of [1, -1]) {
    const m = mainDesign(kit, M, s, kx, Qh), k = kuiDesign(kit, M, s, kx)
    mainEls.push(...m.els); kuiEls.push(...k.els); eyes.push(...m.eyes, ...k.eyes)
  }
  lap('elements')
  kit.carve(p, [...blades.flatMap((b) => b.els), ...mainEls, ...kuiEls], { height: RELIEF.band, shoulder: RELIEF.shoulder, depth: RELIEF.groove, contour: CONTOUR, irregularity: 1, seed })
  lap('carve main')
  kit.carve(p, blades.flatMap((b) => b.coils), { height: 0.7, shoulder: 0.4, depth: 0.42, contour: { inset: 0.5, line: 0.42 }, irregularity: 1, seed: seed + 7 })
  p.sink((ctx) => {
    ctx.lineWidth = 0.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    for (const b of blades) for (const l of b.scrolls) { ctx.beginPath(); l.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke() }
  }, { depth: 0.38, shoulder: 0.15, profile: 'u' })
  lap('carve')
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
  lap('bosses+fillets')
  // ----- grounds: leiwen in every field, kept off a 1.4 mm strip either side of the corner lines (seam agreement)
  const seamFree = (y0, y1) => {
    const pts = []
    for (let y = y0; y <= y1 + 0.01; y += 4) pts.push([Qh(y) - 1.4, y])
    const L = []
    for (let y = y1; y >= y0 - 0.01; y -= 4) L.push([-Qh(y) + 1.4, y])
    return [...pts, ...L].map(M)
  }
  const fill = (y0, y1, include, extra = {}) => kit.leiwenFill(p, { rect: { x: 0, y: arc(y0), w: W, h: arc(y1) - arc(y0) }, include, margin: 0.55 }, { ...GROUND, depth: RELIEF.leiwen, seed: seed + Math.round(y0), ...extra })
  for (const b of blades) {
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity
    for (const [x, y] of b.inner) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y) }
    x0 = Math.max(0, x0); x1 = Math.min(W, x1)
    if (x1 - x0 > 2) kit.leiwenFill(p, { rect: { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }, include: polyDraw(b.inner), margin: 0.55 }, { ...GROUND, depth: RELIEF.leiwen, seed: seed + Math.round(x0) })
  }
  lap('blade leiwen')
  fill(212, 271, polyDraw(seamFree(205, 280)))
  fill(287, 304.5, polyDraw(seamFree(280, 340)), { cell: [4.5, 8] })
  fill(307, 336.4, polyDraw(seamFree(300, 345)), { cell: [5, 9] })
  lap('leiwen')
  const relief = p.bake()
  let lugRelief = null
  if (lug) {
    // the low lug's hole (photo-34 / photo-03: a dark opening above the pendant head): a deep pocket in the wall
    // behind the lug's strap, so the cavity patina darkens it as the photographs show. The panel without it is the
    // back face (no lug: inferred), the same décor baked twice.
    p.sink((ctx) => { const a = M([-17, 85.5]), b = M([17, 100]); ctx.beginPath(); ctx.roundRect ? ctx.roundRect(a[0], a[1], b[0] - a[0], b[1] - a[1], 4) : ctx.rect(a[0], a[1], b[0] - a[0], b[1] - a[1]); ctx.fill() }, { depth: 9, shoulder: 1.8, profile: 'u' })
    lugRelief = p.bake()
  }
  lap('bake')
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
    kit.pillowBoss(p, { c: P([20, 375]), w: 3.6 * kx, h: 3.6, round: 1, height: 0.9, crown: 0.8, slit: false })
  }
  els.push(kit.roundStroke([M([0, 352.5]), M([0, 394.5])], { width: 9, round: 0.15, start: 'flat', end: 'flat', contour: { inset: 1.2, line: 0.4 }, fill: { kind: 'lines', line: 0.38, pitch: 2.2 } }))
  kit.carve(p, els, { height: 0.32, shoulder: 0.25, depth: 0.2, contour: { inset: 0.5, line: 0.32 }, seed, irregularity: 0.6 })
  p.raise((ctx) => { ctx.fillRect(0, 349.5 - y0, W, 1.6); ctx.fillRect(0, 395.4 - y0, W, 1.4) }, { height: 0.8, shoulder: 0.35 })
  kit.leiwenFill(p, { rect: { x: 1.5, y: 351.5 - y0, w: W - 3, h: 43 }, margin: 0.45 }, { ...GROUND, pitch: 1.2, cell: [4.5, 8], depth: 0.16, seed })
  return p.bake()
}

/** lid slope (y 400–466): a row of whorl bosses under a mask whose centre is a flange (a separate mesh) */
export function lidPanel(kit, { ppmm, seed, Qh, arc, y0, y1, kx = 1 }) {
  const W = 2 * Qh(y0) + 2
  const Hp = arc(y1)
  const p = new kit.ReliefPanel({ width: W, height: Hp, ppmm, seed })
  const M = ([x, y]) => [W / 2 + x, arc(y)]
  const els = [], eyes = []
  for (const s of [-1, 1]) {
    const { S, P } = maker(kit, M, s, kx)
    els.push(
      // the lid mask (face-lid, read on its clean left half): a fat horn band from the flange out along the top and
      // down the outer side, hooking back in; a big C below the eye opening toward the flange; leiwen beyond x ≈ 45
      S([[5.5, 457.5], [36, 457.5], [36, 448], [24, 448]], { width: [7.6, 7.8, 7, 6.4], ...ROUND, end: 'spiral', spiral: { turns: 0.8, dir: -1, R: 2.4 }, fill: NOFILL }),
      S([[6, 425.5], [39, 425.5], [39, 437.5], [27, 437.5]], { width: [7.6, 7.8, 7.2, 6.4], ...ROUND, end: 'spiral', spiral: { turns: 0.9, dir: 1, R: 2.6 }, fill: NOFILL }),
      S([[48, 432], [64, 432], [64, 440]], { width: 4.6, ...ROUND, end: 'spiral', spiral: { turns: 0.9, dir: 1, R: 2 }, fill: NOFILL }),
    )
    eyes.push({ c: P([18, 442.5]), w: 14 * kx, h: 9.5, round: 0.3, height: 3.4, crown: 0.8, slit: { len: 4.4, width: 0.8, depth: 0.6 } })
  }
  kit.carve(p, els, { height: 2.7, shoulder: 1.2, depth: RELIEF.groove, contour: CONTOUR, irregularity: 1, seed })
  for (const e of eyes) kit.pillowBoss(p, { slit: false, ...e })
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
