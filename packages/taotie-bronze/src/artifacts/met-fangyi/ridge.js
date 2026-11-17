// met-fangyi — the RIDGE pass (KIT.md § Ridge work; .work/ridge-met-fangyi/NOTES.md).
//
// The Met's own photographs (8–10 px/mm) show every figure of this fangyi as a FAT rounded band carrying two to four
// parallel ridges along its length, narrow sunk channels between neighbouring bands, coils that are the band itself
// rolling in, spiral rows and chains of round spirals on the band tops, rounded-square eye bosses with a pupil, and a
// ground of squared leiwen spirals. So each figure is drawn here as kit ridge work on CENTRE LINES (ridgeBand with n
// ridges on a plateau, squared coils as nested multi-ridge paths, round spirals of a finer ridge 'add'ed on the band
// tops), the eyes and the bottle horn as pillowed masses, then the leiwen ground.
//
// Coordinates: FACE mm of the named flattened face (reference/met-fangyi/faces/<face>.jpg; x from the face's left
// edge, y up from its bottom), RIGHT half (the sharper one on every photograph), drawn into the LEFT half of the panel
// through the mirror about the face axis; panel.mirrorX copies it back over the right half (the brief: the bronze's
// left creatures sit 1.5–2 mm off the mirror position, no design difference).
//
// LEVELS (the border question, brief § 5): on the bronze each register's plain border is flush with the band tops —
// the décor is sunk into the wall. Here the frame is raised to G and everything shifted down by G at the end, so the
// ground lies G below the wall surface and the figures (plateau + ridge) come back up to it. With the 3 mm wall the
// deepest cut (ground + channel or leiwen groove) is kept ≤ 2.75 mm.

const TAU = Math.PI * 2

/** ridge classes, mm. FIG = the bands' own ridges; SPI = round spirals on band tops (finer); PL = figure plateau */
export const FOOT = {
  G: 2.3,
  FIG: { width: 1.0, pitch: 1.45, height: 0.8, groove: 0.3 },
  SPI: { width: 0.52, pitch: 0.8, height: 0.7, groove: 0.22 },
  PL: { height: 1.5, margin: 0.3, channel: 0.75, channelDepth: 0.42 },
  ground: { pitch: 0.74, line: 0.5, depth: 0.34, roundness: 0.08, jitter: 0.04, cell: [3.8, 6.4], pairs: 0, maxAspect: 1.6 },
}

// ------------------------------------------------------------------ small geometry helpers (design space)

const dense = (path, step = 0.5) => {
  const out = [path[0].slice()]
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1], b = path[i], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step))
    for (let j = 1; j <= n; j++) out.push([a[0] + ((b[0] - a[0]) * j) / n, a[1] + ((b[1] - a[1]) * j) / n])
  }
  return out
}

/** A round(ed-square) spiral centre line: outer radius R (to the ridge's centre), turns in `pitch` per turn, hand ±1
 *  (+1 counter-clockwise inward), a0 deg = where the outer end starts, sq 0 round … 1 squarish. */
export function spiralLine([cx, cy], R, { pitch = 1.12, hand = 1, a0 = 90, sq = 0.25, rIn = 0.35, step = 0.25 } = {}) {
  const ex = 2 + sq * 4
  const turns = Math.max(0.6, (R - rIn) / pitch)
  const phiMax = turns * TAU
  const out = []
  for (let phi = 0; phi <= phiMax + 1e-6;) {
    const r = R - ((R - rIn) * phi) / phiMax
    const a = (a0 * Math.PI) / 180 + hand * phi
    const ca = Math.cos(a), sa = Math.sin(a)
    const k = 1 / Math.pow(Math.pow(Math.abs(ca), ex) + Math.pow(Math.abs(sa), ex), 1 / ex)
    out.push([cx + ca * r * k, cy + sa * r * k])
    phi += Math.min(0.3, step / Math.max(0.3, r))
  }
  return out
}

/**
 * A figure's plateau with no ridges of its own along it (the spiral rows / chains sit on it): pushed into the work's
 * plateau list exactly as ridgeBand({ plateau }) does (same channel, same raise), path mapped through the view.
 */
export function plateau(h, path, width, o = {}) {
  const pl = { ...o.PL }
  const pts = dense(path, 0.4).map((p) => h.T(p))
  h.plateaus.push({ pts, width, height: pl.height, shoulder: pl.shoulder ?? Math.min(width / 2, Math.max(0.35, pl.height * 0.5)), channel: pl.channel, channelDepth: pl.channelDepth, cap: o.cap ?? 'round' })
}

// ------------------------------------------------------------------ the renderer

/**
 * Render ridge registers into a panel. layers: [{ draw(h, out), P (face mm → panel mm), axis (face mm) }] — draw()
 * gets a RidgeWork view whose design space is the RIGHT half in face mm, mirrored into the left half of the panel,
 * and `out` to collect { bosses: [pillowBoss opts in face mm], masses: [{ outline, …tracedPlates opts }],
 * cuts: [{ pts, line, depth }] (sunk lines after everything, face mm) }.
 * fields: decorated fields (panel mm; [x, y, w, h] or polygon); outside them the plain frame. G: ground depth below
 * the frame. ground: leiwen opts. Draws the left half only, then mirrors and shifts by −G.
 */
export function renderRidge(kit, panel, layers, { fields, G, ground = {}, prof = FOOT.FIG, halfRect, seed = 1, frameRound = 0.8 }) {
  const W = panel.width, H = panel.height
  const pathPoly = (ctx, pts) => { pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath() }
  // 1. the plain frame at G (the wall surface after the final shift)
  panel.raise((ctx) => {
    ctx.beginPath()
    ctx.rect(-1, -1, W + 2, H + 2)
    for (const f of fields) {
      const q = Array.isArray(f[0]) ? f : [[f[0], f[1]], [f[0] + f[2], f[1]], [f[0] + f[2], f[1] + f[3]], [f[0], f[1] + f[3]]]
      pathPoly(ctx, kit.shapes.fillet(q, frameRound, { closed: true, step: 0.3 }))
    }
    ctx.fill('evenodd')
  }, { height: G, shoulder: 0.3 })
  // 2. the figures: ridge work through the mirrored views; traced outlines as plates under it
  const work = kit.ridgeWork(panel, prof)
  const outs = []
  for (const L of layers) {
    const pre = L.pre ?? ((q) => q)
    const M = (q) => { const [x, y] = pre(q); return L.P([2 * L.axis - x, y]) }
    const out = { bosses: [], masses: [], cuts: [], plates: [], M }
    L.draw(work.view(M), out)
    outs.push(out)
  }
  const plates = outs.flatMap(({ plates, M }) => plates.map((q) => ({ ...q, pts: kit.shapes.fillet(q.poly, q.round ?? 1.2, { closed: true, step: 0.3 }).map(M) })))
  if (plates.length) {
    // the sunk channel round every plate (its inner half is covered again by the plate), then the plates
    const ch = plates[0].channel ?? { w: 0.75, d: 0.42 }
    panel.sink((ctx) => { ctx.lineJoin = 'round'; ctx.lineWidth = 2 * ch.w; for (const q of plates) { ctx.beginPath(); pathPoly(ctx, q.pts); ctx.stroke() } }, { depth: ch.d, shoulder: ch.w / 2, profile: 'u' })
    const byH = new Map()
    for (const q of plates) { const k = `${q.height}|${q.shoulder}`; if (!byH.has(k)) byH.set(k, []); byH.get(k).push(q) }
    for (const g of byH.values()) kit.tracedPlates(panel, g.map((q) => q.pts), { height: g[0].height, shoulder: g[0].shoulder ?? 0.9, pillow: g[0].pillow ?? 0, pillowWidth: g[0].pillowWidth ?? 3, contour: false, bosses: [], ground: false, union: true, seed })
  }
  work.flush()
  // 3. pillowed masses (the bottle horn), bosses (eyes), sunk lines on them
  for (const { masses, M } of outs) {
    for (const { outline, ...o } of masses) kit.tracedPlates(panel, [outline.map(M)], { contour: false, bosses: [], ground: false, seed, ...o })
  }
  for (const { bosses, M } of outs) {
    for (const b of bosses) {
      const c = M(b.c), e = M([b.c[0] + b.w / 2, b.c[1]]), t = M([b.c[0], b.c[1] + b.h / 2])
      const slit = b.slit ? { ...b.slit, offset: [-(b.slit.offset?.[0] ?? 0), b.slit.offset?.[1] ?? 0], rot: -(b.slit.rot ?? 0) } : false
      kit.pillowBoss(panel, { ...b, c, w: 2 * Math.hypot(e[0] - c[0], e[1] - c[1]), h: 2 * Math.hypot(t[0] - c[0], t[1] - c[1]), slit })
    }
  }
  const cuts = outs.flatMap(({ cuts, M }) => cuts.map((k) => ({ ...k, pts: k.pts.map(M) })))
  const byCut = new Map() // one sink per line width and depth
  for (const k of cuts) { const key = `${k.line}|${k.depth}`; if (!byCut.has(key)) byCut.set(key, []); byCut.get(key).push(k) }
  for (const g of byCut.values()) {
    panel.sink((ctx) => { ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = g[0].line; for (const k of g) { ctx.beginPath(); k.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke() } }, { depth: g[0].depth, shoulder: g[0].line * 0.45, profile: 'u' })
  }
  // 4. the ground: squared leiwen packed into what is left of the left half (per layer: its own rect and cell sizes)
  const hr = halfRect ?? { x: 0, y: 0, w: W / 2, h: H }
  const rects = layers.filter((L) => L.groundRect)
  if (rects.length) for (const L of rects) kit.leiwenFill(panel, { rect: L.groundRect, avoid: 'raised', margin: 0.45 }, { ...FOOT.ground, seed, ...ground, ...L.ground })
  else kit.leiwenFill(panel, { rect: hr, avoid: 'raised', margin: 0.45 }, { ...FOOT.ground, seed, ...ground })
  panel.mirrorX()
  const f = panel.field
  for (let i = 0; i < f.length; i++) f[i] -= G
  return panel
}

/** a closed ridge following a traced outline `inset` mm inside it (the rounded rim of a plate) */
export function rim(h, poly, inset, prof, o = {}) {
  const sa = poly.reduce((a, p, i) => { const q = poly[(i + 1) % poly.length]; return a + p[0] * q[1] - q[0] * p[1] }, 0)
  const s = Math.sign(sa) || 1, n = poly.length
  const pts = poly.map((p, k) => {
    const a = poly[(k - 1 + n) % n], b = poly[(k + 1) % n]
    const e1 = [p[0] - a[0], p[1] - a[1]], e2 = [b[0] - p[0], b[1] - p[1]]
    const l1 = Math.hypot(...e1) || 1, l2 = Math.hypot(...e2) || 1
    const n1 = s > 0 ? [-e1[1] / l1, e1[0] / l1] : [e1[1] / l1, -e1[0] / l1]
    const n2 = s > 0 ? [-e2[1] / l2, e2[0] / l2] : [e2[1] / l2, -e2[0] / l2]
    let mx = n1[0] + n2[0], my = n1[1] + n2[1]
    const ml = Math.hypot(mx, my) || 1
    mx /= ml; my /= ml
    const c = Math.max(0.35, mx * n2[0] + my * n2[1])
    return [p[0] + (mx * inset) / c, p[1] + (my * inset) / c]
  })
  return h.ridgeBand(pts, { ...prof, ridges: 1, mode: 'add', closed: true, bend: o.bend ?? 1.6, ...o })
}

// ------------------------------------------------------------------ the foot dragon (face-long-foot / face-end)

/**
 * ONE kui per half, head at the notch, facing the axis (face-long-foot.jpg, detail-foot-long.jpg at 4×). Element list
 * (right half; .work/ridge-met-fangyi/NOTES.md):
 *  1 upper jaw — a fat band from the notch end back to the horn, four ridges: the outer pair runs round the notch end
 *    in one U and encloses the row of three round spirals, the inner pair starts behind the row and runs on to the horn
 *  2 limb + lower jaw — two ridges dropping from under the jaw beside the eye, turning out along the bottom and up
 *    round the ring-spiral lobe; the Z hook inside it
 *  3 bottle horn — a pillowed mushroom (bulb by the eye, neck, flared cap outward), a spiral on the bulb
 *  4 eye — rounded-square boss, small sunk pupil
 *  5 body — a fat band from behind the eye to the outer column: a bold ridge along its top, the chain of round spirals
 *    under it, the outline ridge round its outer end
 *  6 tail coil — three nested ridges up the outer column, along the top, down the inner side and rolling in, a
 *    squared spiral at its heart
 *  7 claw — three ridges dropping from the body and hooking forward
 *  8 leg — a lobe under the belly behind the eye, a spiral in it
 *  9 lip curl — a small hook over the snout
 * K: the measured positions for this face.
 */
export const FOOT_LONG_K = {
  axis: 76,
  jaw: { x0: 86.4, x1: 102.8, y: 24.0, row: [87.9, 91.0, 94.1], inner0: 95.6 },
  limb: [[96.5, 21.4], [96.5, 15.6], [92.7, 15.6], [92.7, 9.9], [103.6, 9.9], [103.6, 14.0], [100.4, 14.0]],
  lobe: { c: [100.9, 12.0], d: 2.9 },
  zhook: [[94.5, 13.6], [98.6, 13.6], [98.6, 11.6], [96.0, 11.6]],
  horn: [[104.8, 22.6], [105.6, 25.9], [108.3, 27.0], [110.4, 26.1], [111.6, 27.3], [113.7, 27.6], [114.1, 26.4], [114.0, 20.2], [112.6, 19.4], [110.8, 21.5], [108.2, 20.4], [105.8, 20.9]],
  hornSpiral: { c: [106.6, 24.0], d: 2.8 },
  eye: { c: [100.95, 18.4], w: 5.5, h: 5.5 },
  body: { x0: 104.8, x1: 133.6, y: 15.55, w: 6.6, top: 18.1, chain: [107.3, 112.2, 125.7, 130.4], chainY: 15.0, chainD: 4.3 },
  coil: [[133.1, 15.0], [133.1, 27.9], [121.9, 27.9], [121.9, 20.6], [128.6, 20.6], [128.6, 23.95], [125.4, 23.95]],
  claw: [[120.9, 12.6], [120.9, 8.9], [117.4, 8.9]],
  leg: { path: [[107.5, 12.6], [107.5, 9.3]], w: 4.4, spiral: { c: [107.5, 10.4], d: 3.0 } },
  lip: { c: [93.3, 28.6], d: 2.9 },
}

/** the end face's foot (face-end.jpg, y < 31; axis 59): the same kui closed up — eye taller than wide, the coil's outer
 *  column running down beside the body to the bottom, the claw under the body's end, and a lower limb with two spirals
 *  under the belly (it has no counterpart on the long face) */
export const FOOT_END_K = {
  axis: 59,
  jaw: { x0: 65.7, x1: 81.2, y: 24.7, row: [67.2, 70.4, 73.5], inner0: 75.3 },
  limb: [[76.0, 21.6], [76.0, 16.1], [73.0, 16.1], [73.0, 10.4], [81.0, 10.4], [81.0, 12.8]],
  lobe: { c: [78.9, 12.9], d: 2.3 },
  zhook: [[74.6, 13.9], [77.0, 13.9], [77.0, 12.2], [75.6, 12.2]],
  horn: [[82.6, 23.4], [83.3, 27.3], [85.4, 28.2], [87.2, 27.4], [88.4, 28.5], [90.0, 28.1], [90.3, 24.2], [89.5, 21.2], [87.6, 20.7], [85.0, 20.8], [83.2, 21.6]],
  hornSpiral: { c: [84.6, 25.2], d: 2.5 },
  eye: { c: [80.5, 18.2], w: 4.4, h: 5.4 },
  body: { x0: 83.8, x1: 98.2, y: 16.95, w: 5.9, top: 18.95, chain: [87.5, 92.3], chainY: 16.4, chainD: 3.7 },
  coil: [[100.8, 11.4], [100.8, 26.2], [93.85, 26.2], [93.85, 21.5], [97.3, 21.5]],
  claw: [[96.7, 13.6], [96.7, 10.2], [98.4, 10.2]], clawRidges: 2, clawDir: 1, clawAngle: 150,
  belly: { path: [[86.4, 11.1], [94.2, 11.1]], w: 4.4, spirals: [[88.3, 11.1], [92.3, 11.1]], d: 3.1 },
  leg: { path: [[83.7, 13.2], [83.7, 10.0]], w: 2.9, spiral: { c: [83.7, 10.9], d: 2.3 } },
  lip: { c: [72.2, 29.5], d: 2.6 },
}

export function footDragon(K, R = FOOT) {
  const F = (n, o = {}) => ({ ...R.FIG, ridges: n, plateau: R.PL, ...o })
  const S = R.SPI
  const spiral = (h, c, d, hand = 1, a0 = 90, o = {}) => h.line(spiralLine(c, d / 2 - S.width / 2, { pitch: S.pitch, hand, a0, ...o }), { ...S, mode: 'add' })
  return (h, out) => {
    const p = R.FIG.pitch
    // 1 upper jaw: plateau, the outer ridge pair round the notch end, the spiral row, the inner pair on to the horn
    const J = K.jaw
    const wJ = 3 * p + R.FIG.width + 2 * R.PL.margin
    plateau(h, [[J.x0, J.y], [J.x1, J.y]], wJ, { PL: R.PL })
    h.ridgeBand([[J.x0, J.y], [J.x1, J.y]], { ...R.FIG, ridges: 2, pitch: 3 * p, mode: 'add', start: 'round', end: 'round' })
    h.ridgeBand([[J.inner0, J.y], [J.x1, J.y]], { ...R.FIG, ridges: 2, mode: 'add', start: 'round', end: 'round' })
    J.row.forEach((x, i) => spiral(h, [x, J.y], 3 * p - R.FIG.width - 0.1, i % 2 ? -1 : 1, 90))
    // 2 limb + lower jaw: two ridges down beside the eye, out along the bottom, up round the lobe; the Z hook inside
    h.ridgeBand(K.limb, F(2, { start: 'square', end: 'round', bend: 0.9 }))
    spiral(h, K.lobe.c, K.lobe.d, -1, 0)
    h.ridgeBand(K.zhook, { ...R.FIG, ridges: 1, mode: 'add', start: 'round', end: 'round' })
    plateau(h, [[K.zhook[0][0] - 1.2, K.zhook[0][1] - 0.9], [K.zhook[1][0], K.zhook[0][1] - 0.9]], 3.4, { PL: R.PL })
    // 5 body: plateau, its bold top ridge, the outline ridge round its outer end, the spiral chain
    const B = K.body
    plateau(h, [[B.x0, B.y], [B.x1, B.y]], B.w, { PL: R.PL })
    h.ridgeBand([[B.x0 + 0.6, B.top], [B.x1 - 2.2, B.top]], { ...R.FIG, ridges: 1, mode: 'add', start: 'round', end: 'round' })
    h.ridgeBand([[B.chain[1] + B.chainD / 2 + 0.6, B.y - B.w / 2 + 0.95], [B.x1 - 0.6, B.y - B.w / 2 + 0.95], [B.x1 - 0.6, B.top]], { ...R.FIG, ridges: 1, mode: 'add', start: 'round', end: 'square', bend: 1.2 })
    B.chain.forEach((x, i) => spiral(h, [x, B.chainY], B.chainD, i % 2 ? -1 : 1, i % 2 ? 0 : 180, { sq: 0.05 }))
    // 6 the tail coil: three nested ridges rolling in, a squared spiral at the heart
    h.ridgeBand(K.coil, F(3, { pitch: 1.35, width: 0.95, start: 'square', end: 'round' }))
    // 7 claw: three ridges down from the belly, hooking forward
    h.ridgeBand(K.claw, F(K.clawRidges ?? 3, { pitch: 1.3, width: 0.92, start: 'square', end: 'hook', dir: K.clawDir ?? -1, hookAngle: K.clawAngle ?? 160 }))
    if (K.belly) {
      plateau(h, K.belly.path, K.belly.w, { PL: R.PL })
      K.belly.spirals.forEach((c, i) => spiral(h, c, K.belly.d, i % 2 ? -1 : 1, 90))
    }
    // 8 leg: a lobe hanging under the belly, a spiral in it
    plateau(h, K.leg.path, K.leg.w, { PL: R.PL })
    spiral(h, K.leg.spiral.c, K.leg.spiral.d, 1, 90)
    // 9 lip curl over the snout: a small plateau with a spiral
    plateau(h, [[K.lip.c[0], K.lip.c[1] - 1.2], [K.lip.c[0], K.lip.c[1]]], K.lip.d + 0.9, { PL: R.PL })
    spiral(h, K.lip.c, K.lip.d, 1, 270)
    // 3 the bottle horn (pillowed mass) and 4 the eye (rounded-square boss with a pupil)
    out.masses.push({ outline: K.horn, height: R.G + 0.3, shoulder: 2.2, pillow: 0.9, pillowWidth: 3.2 })
    out.cuts.push({ pts: spiralLine(K.hornSpiral.c, K.hornSpiral.d / 2 - 0.3, { pitch: 0.85, hand: 1, a0: 90 }), line: 0.5, depth: 0.45 })
    out.bosses.push({ c: K.eye.c, w: K.eye.w, h: K.eye.h, round: 0.55, height: R.G + 1.0, crown: 0.85, slit: { len: 1.2, width: 0.9, depth: 0.6, offset: [-0.4, -0.5], rot: 60 } })
  }
}

// ------------------------------------------------------------------ the top frieze dragon (face-long-frieze / face-end)

/**
 * Confronted kui, heads at the centre flange (face-long-frieze.jpg, detail-frieze-long.jpg). Element list (right half):
 *  1 upper jaw — three ridges from under the eye out to the flange, turning down and hooking inward
 *  2 lower-jaw lobe — a squared spiral cell under the jaw's turn
 *  3 crest — a band over the head carrying two squared spirals
 *  4 eye — rounded-square boss, slit pupil
 *  5 head plate — behind the eye: an outline ridge round two spirals
 *  6 body — the front column dropping from under the eye to the ground line (two spirals) and the band running out
 *    to the outer column: a bold top ridge, the spiral chain under it
 *  7 tail coil — three nested ridges up the outer column, along the top and rolling in
 *  8 claw — three ridges down from the belly hooking back
 *  9 leg — two ridges along the bottom from under the column, up the front, a spiral in its corner
 * 10 lobes — the spiral lobe beside the front column, the small hook under the belly
 */
export const FRIEZE_LONG_K = {
  axis: 76,
  jaw: [[95.4, 25.3], [84.9, 25.3], [84.9, 18.6]],
  jawLobe: [[87.9, 16.8], [93.4, 16.8], [93.4, 20.6], [87.9, 20.6]],
  crest: { cells: [[[89.0, 27.4], [94.8, 27.4], [94.8, 30.5], [89.0, 30.5]], [[95.6, 27.4], [101.3, 27.4], [101.3, 30.5], [95.6, 30.5]]] },
  eye: { c: [97.9, 21.8], w: 6.0, h: 5.4, slit: { len: 2.2, width: 0.85, depth: 0.6 } },
  head: { box: [102.4, 20.2, 115.2, 27.8], spirals: [[105.2, 24.3, 3.8], [110.8, 24.2, 4.6]] },
  column: { x: 99.8, y0: 6.6, y1: 18.6, w: 7.0, spirals: [[99.9, 14.3, 3.7], [99.9, 9.0, 3.7]] },
  body: { x0: 99.8, x1: 132.6, y: 13.7, w: 6.2, top: 16.95, chain: [106.3, 111.0, 127.3, 131.8], chainY: 13.6, chainD: 4.1, topTo: 124.2 },
  coil: [[134.85, 12.0], [134.85, 27.35], [123.85, 27.35], [123.85, 19.7], [130.8, 19.7], [130.8, 23.4], [127.6, 23.4]],
  claw: [[122.0, 11.6], [122.0, 7.0], [117.6, 7.0]],
  leg: { path: [[95.4, 6.7], [86.0, 6.7], [86.0, 14.8]], spiral: [89.4, 10.4, 3.3] },
  lobes: [{ path: [[93.7, 12.6], [93.7, 13.6]], w: 4.2, spiral: [93.7, 13.1, 3.4] }, { path: [[106.6, 7.4], [107.2, 7.8]], w: 4.6, spiral: [106.8, 7.7, 3.5] }],
}

export function friezeDragon(K, R = FOOT) {
  const F = (n, o = {}) => ({ ...R.FIG, ridges: n, plateau: R.PL, ...o })
  const S = R.SPI
  const spiral = (h, [x, y, d], hand = 1, a0 = 90, o = {}) => h.line(spiralLine([x, y], d / 2 - S.width / 2, { pitch: S.pitch, hand, a0, ...o }), { ...S, mode: 'add' })
  const box = (h, q) => { // a plateau filling a 4-corner cell (design space), as a short thick stroke
    const xs = q.map((p) => p[0]), ys = q.map((p) => p[1])
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys)
    const w = Math.min(x1 - x0, y1 - y0)
    const path = x1 - x0 >= y1 - y0 ? [[x0 + w / 2, (y0 + y1) / 2], [x1 - w / 2, (y0 + y1) / 2]] : [[(x0 + x1) / 2, y0 + w / 2], [(x0 + x1) / 2, y1 - w / 2]]
    plateau(h, path, w, { PL: R.PL, cap: 'square' })
  }
  return (h, out) => {
    // 1 upper jaw, 2 its lobe
    h.ridgeBand(K.jaw, F(3, { pitch: 1.3, width: 0.9, start: 'round', end: 'hook', dir: 1, hookAngle: 150 }))
    box(h, K.jawLobe)
    h.quadSpiral(K.jawLobe, { ...S, mode: 'add', margin: 0.55, dir: -1, corner: 1.0 })
    // 3 crest: two squared spiral cells on one plateau
    for (const q of K.crest.cells) { box(h, q); h.quadSpiral(q, { ...S, mode: 'add', margin: 0.5, corner: 0.9 }) }
    // 5 head plate: an outline ridge round two spirals
    const [hx0, hy0, hx1, hy1] = K.head.box
    box(h, [[hx0, hy0], [hx1, hy0], [hx1, hy1], [hx0, hy1]])
    h.ridgeBand([[hx0 + 0.95, hy0 + 0.95], [hx1 - 0.95, hy0 + 0.95], [hx1 - 0.95, hy1 - 0.95], [hx0 + 0.95, hy1 - 0.95]], { ...R.FIG, ridges: 1, mode: 'add', closed: true, bend: 1.4 })
    K.head.spirals.forEach((s, i) => spiral(h, s, i % 2 ? -1 : 1, 180))
    // 6 body: the front column and the band, a top ridge, the column's outline ridge, the spiral chains
    const C = K.column, B = K.body
    plateau(h, [[C.x, C.y1], [C.x, C.y0]], C.w, { PL: R.PL })
    plateau(h, [[B.x0, B.y], [B.x1, B.y]], B.w, { PL: R.PL })
    h.ridgeBand([[B.x0 + 1.4, B.top], [B.topTo, B.top]], { ...R.FIG, ridges: 1, mode: 'add', start: 'round', end: 'round' })
    h.ridgeBand([[C.x - C.w / 2 + 0.95, C.y1 - 0.4], [C.x - C.w / 2 + 0.95, C.y0 - C.w / 2 + 0.95], [C.x + C.w / 2 - 0.95, C.y0 - C.w / 2 + 0.95], [C.x + C.w / 2 - 0.95, B.y - B.w / 2 + 0.95], [B.chain[1] + B.chainD / 2 + 0.7, B.y - B.w / 2 + 0.95]], { ...R.FIG, ridges: 1, mode: 'add', start: 'round', end: 'round', bend: 1.2 })
    C.spirals.forEach((s, i) => spiral(h, s, i % 2 ? -1 : 1, 90, { sq: 0.05 }))
    B.chain.forEach((x, i) => spiral(h, [x, B.chainY, B.chainD], i % 2 ? -1 : 1, i % 2 ? 0 : 180, { sq: 0.05 }))
    // 7 the coil, 8 the claw
    h.ridgeBand(K.coil, F(3, { pitch: 1.35, width: 0.95, start: 'square', end: 'round' }))
    h.ridgeBand(K.claw, F(3, { pitch: 1.25, width: 0.88, start: 'square', end: 'hook', dir: -1, hookAngle: 150 }))
    // 9 leg, 10 lobes
    h.ridgeBand(K.leg.path, F(2, { pitch: 1.35, width: 0.95, start: 'round', end: 'round', bend: 1.0 }))
    spiral(h, K.leg.spiral, 1, 180)
    plateau(h, [[K.leg.spiral[0], K.leg.spiral[1] - 0.6], [K.leg.spiral[0], K.leg.spiral[1] + 0.3]], K.leg.spiral[2] + 0.8, { PL: R.PL })
    for (const l of K.lobes) { plateau(h, l.path, l.w, { PL: R.PL }); spiral(h, l.spiral, -1, 90) }
    // 4 the eye
    out.bosses.push({ c: K.eye.c, w: K.eye.w, h: K.eye.h, round: 0.55, height: R.G + 1.0, crown: 0.85, slit: K.eye.slit })
  }
}

// ------------------------------------------------------------------ the main mask (face-long-main / face-end)

/** ridge classes of the main mask (detail-face-long at 2×): a fat rounded RIM round every part (≈ 1.5 mm), nested
 *  figure ridges inside it (≈ 1.45 mm pitch: the horn's three rolling into the curl, the brow pair), bold squared
 *  spirals filling the cells (≈ 1.1 mm pitch, 4 turns in a 9 mm cell), round spirals on the columns */
export const MAIN = {
  G: 2.3,
  plate: { height: 1.45, shoulder: 0.8, round: 1.4 },
  RIM: { width: 1.5, pitch: 2.1, height: 0.85, groove: 0.3 },
  FIG: { width: 1.0, pitch: 1.45, height: 0.85, groove: 0.3 },
  CELL: { width: 0.74, pitch: 1.1, height: 0.8, groove: 0.26 },
  SPI: { width: 0.62, pitch: 0.95, height: 0.75, groove: 0.24 },
  ground: { pitch: 0.72, line: 0.5, depth: 0.34, roundness: 0.08, jitter: 0.04, cell: [6, 11], pairs: 0, maxAspect: 1.35 },
}

/**
 * The great mask, long face (face-long-main.jpg, vessel y = fy + 31; detail-face-long.jpg). Element list (right half):
 *  1 horn — ONE fat G: the rim runs round the whole outline (ticked along the top); inside it the left column holds two
 *    big squared spirals, the top band a row of four, and three nested ridges run down the outer column, back along
 *    the bottom and ROLL IN as a squared coil — the curl; the slot rises between curl and column
 *  2 brow — a two-ridge Γ over the eye, its outer end hooked down
 *  3 eye — the big rounded-square pillow boss, slit pupil
 *  4 ear — a C on the outer edge: rim, a squared spiral in each lobe
 *  5 tail — an S below it: rim, a squared spiral in each loop
 *  6 jaw — a G: rim, a row of four round spirals along its top, the squared coil it rolls into
 *  7 axial strip — the upper column (three round spirals, a scored cap), the Γ arm, the lower column (four spirals, a
 *    foot lobe) beside the centre flange
 * K: traced outlines (face-long-main.trace.json, unchanged layout) and the cells measured inside them.
 */
export const MAIN_LONG_K = {
  axis: 76,
  horn: {
    poly: [[97.0, 61.6], [98.6, 58.4], [111.6, 58.4], [113.4, 60.2], [113.6, 71.4], [115.1, 72.6], [116.6, 71.4], [116.8, 62.4], [118.8, 60.6], [133.6, 60.6], [137.2, 63.6], [137.4, 86.6], [135.2, 89.4], [104.4, 89.4], [99.2, 87.0], [97.0, 82.6]],
    cells: [[[99.6, 72.6], [111.6, 72.6], [111.6, 86.4], [100.8, 86.4]], [[99.6, 60.9], [111.4, 60.9], [111.4, 71.8], [99.6, 71.8]]],
    row: { x0: 112.4, x1: 132.0, y0: 78.6, y1: 85.2, n: 4 },
    coil: [[133.55, 85.4], [133.55, 64.5], [120.9, 64.5], [120.9, 75.6], [129.2, 75.6], [129.2, 68.85], [125.0, 68.85]],
    ticks: { x0: 105.5, x1: 133, step: 3.7, y0: 87.7, y1: 89.4 },
  },
  brow: { poly: [[100.6, 51.2], [100.6, 53.2], [101.6, 54.2], [115.4, 54.2], [116.6, 53.0], [116.6, 46.8], [115.6, 45.8], [113.4, 45.8], [112.6, 46.8], [112.6, 51.2]], path: [[101.8, 52.7], [114.6, 52.7], [114.6, 46.6]] },
  eye: { c: [107.35, 35.1], w: 15.3, h: 13.3, slit: { len: 4.8, width: 1.0, depth: 0.8, offset: [0, -0.5] } },
  ear: { poly: [[124.8, 47.8], [124.6, 53.2], [126.2, 54.8], [135.6, 54.8], [137.0, 53.2], [137.0, 40.0], [135.4, 38.2], [127.0, 38.2], [124.6, 40.2], [124.6, 43.4], [128.2, 43.8], [128.4, 47.4]],
    cells: [[[127.0, 45.9], [134.9, 45.9], [134.9, 52.8], [126.8, 52.8]], [[129.6, 40.2], [134.9, 40.2], [134.9, 45.1], [129.6, 45.1]]] },
  tail: { poly: [[124.0, 23.0], [124.0, 29.4], [125.4, 30.8], [134.8, 30.8], [136.2, 29.4], [136.2, 17.4], [133.6, 14.8], [133.4, 5.8], [131.8, 4.4], [122.4, 4.4], [120.8, 6.0], [120.8, 13.0], [122.4, 14.8], [130.4, 15.2], [130.4, 21.6], [128.6, 23.0]],
    cells: [[[126.0, 23.9], [134.2, 23.9], [134.2, 28.8], [126.0, 28.8]], [[122.8, 6.4], [131.4, 6.4], [131.4, 12.9], [122.8, 12.9]], [[132.2, 16.6], [134.2, 18.0], [134.2, 23.1], [132.2, 23.1]]] },
  jaw: { poly: [[95.8, 8.0], [98.0, 4.4], [116.8, 4.4], [119.2, 6.6], [119.2, 22.0], [116.8, 24.8], [99.6, 24.8], [95.8, 21.2]],
    row: { x0: 98.6, x1: 117.2, y: 20.3, d: 4.2, n: 4 }, cell: [[98.4, 6.6], [117.0, 6.6], [117.0, 17.9], [98.4, 17.9]] },
  axial: [
    { poly: [[78.6, 58.6], [87.4, 58.6], [87.4, 92.0], [78.6, 92.0]], spirals: [[83.0, 80.6, 6.4], [83.0, 72.0, 6.4], [83.0, 63.4, 6.4]], cap: [87.0, 89.8] },
    { poly: [[78.6, 48.4], [93.6, 48.4], [94.8, 49.6], [94.8, 55.6], [93.6, 56.8], [78.6, 56.8]], spirals: [[89.4, 52.6, 5.4]], cells: [[[79.6, 49.6], [86.4, 49.6], [86.4, 55.6], [79.6, 55.6]]] },
    { poly: [[78.2, 5.0], [87.6, 5.0], [88.6, 6.4], [88.6, 14.0], [87.4, 15.0], [87.4, 47.2], [78.2, 47.2]], spirals: [[82.8, 41.7, 6.2], [82.8, 34.3, 6.2], [82.8, 26.9, 6.2], [82.8, 19.5, 6.2], [83.4, 10.0, 6.8]] },
  ],
}

/**
 * Box re-fit for another face (the end face, the lid slopes): an element's box on the long face → its box on that
 * face, both given as LEFT-half face mm the way traced.js END_FIT / LID_*_FIT record them (a reversed y range flips
 * the element). Returns a map on RIGHT-half design points: long (axis 76) → target face (axis `axis`).
 */
export function boxFit([[a0, b0, a1, b1], [c0, d0, c1, d1]], axis) {
  const sx = (c1 - c0) / (a1 - a0), sy = (d1 - d0) / (b1 - b0)
  return ([x, y]) => { const xl = 152 - x; return [2 * axis - (c0 + (xl - a0) * sx), d0 + (y - b0) * sy] }
}

export function mainMask(K, R = MAIN, { fit = null, drop = [] } = {}) {
  const PL0 = (poly, o = {}) => ({ poly, ...R.plate, ...o })
  const spiral = (h, [x, y, d], hand = 1, a0 = 90, o = {}) => h.line(spiralLine([x, y], d / 2 - R.SPI.width / 2, { pitch: R.SPI.pitch, hand, a0, sq: 0.45, ...o }), { ...R.SPI, mode: 'add' })
  const cell = (h, q, o = {}) => h.quadSpiral(q, { ...R.CELL, mode: 'add', margin: 0.5, corner: 2.4, cornerMin: 0.5, ...o })
  const rimIn = R.RIM.width / 2 + 0.55
  return (h0, out0) => {
    // each element through its own re-fit (identity on the long face)
    let PL = PL0, h = h0, out = out0
    const use = (name) => {
      const f = fit && fit[name]
      h = f ? h0.view(f) : h0
      const F = f ?? ((q) => q)
      PL = (poly, o) => PL0(poly.map(F), o)
      out = {
        plates: out0.plates,
        cuts: { push: (k) => out0.cuts.push({ ...k, pts: k.pts.map(F) }) },
        bosses: { push: (b) => { const c = F(b.c), e = F([b.c[0] + b.w / 2, b.c[1]]), t = F([b.c[0], b.c[1] + b.h / 2]); out0.bosses.push({ ...b, c, w: 2 * Math.hypot(e[0] - c[0], e[1] - c[1]), h: 2 * Math.hypot(t[0] - c[0], t[1] - c[1]) }) } },
      }
      return !drop.includes(name)
    }
    // 1 horn
    use('horn')
    const Ho = K.horn
    out.plates.push(PL(Ho.poly))
    rim(h, Ho.poly, rimIn, R.RIM, { bend: 3.2 })
    Ho.cells.forEach((q, i) => cell(h, q, { dir: i % 2 ? -1 : 1 }))
    const r = Ho.row, wr = (r.x1 - r.x0) / r.n
    for (let i = 0; i < r.n; i++) cell(h, [[r.x0 + i * wr, r.y0], [r.x0 + (i + 1) * wr, r.y0], [r.x0 + (i + 1) * wr, r.y1], [r.x0 + i * wr, r.y1]], { dir: i % 2 ? -1 : 1, corner: 1.6 })
    h.ridgeBand(Ho.coil, { ...R.FIG, ridges: 3, mode: 'add', start: 'round', end: 'round', bend: 1.0 })
    for (let x = Ho.ticks.x0; x <= Ho.ticks.x1; x += Ho.ticks.step) out.cuts.push({ pts: [[x, Ho.ticks.y0], [x, Ho.ticks.y1]], line: 0.5, depth: 0.5 })
    // 2 brow
    if (use('brow')) {
      out.plates.push(PL(K.brow.poly, { round: 1.0 }))
      h.ridgeBand(K.brow.path, { ...R.FIG, ridges: 2, mode: 'add', start: 'round', end: 'round', bend: 0.9 })
    }
    // 4 ear, 5 tail
    for (const [name, part] of [['ear', K.ear], ['tail', K.tail]]) {
      if (!use(name)) continue
      out.plates.push(PL(part.poly))
      rim(h, part.poly, rimIn, R.RIM, { bend: 2.0 })
      part.cells.forEach((q, i) => cell(h, q, { dir: i % 2 ? -1 : 1, corner: 1.8 }))
    }
    // 6 jaw
    if (use('jaw')) {
      const J = K.jaw
      out.plates.push(PL(J.poly))
      rim(h, J.poly, rimIn, R.RIM, { bend: 2.4 })
      const wj = (J.row.x1 - J.row.x0) / J.row.n
      for (let i = 0; i < J.row.n; i++) spiral(h, [J.row.x0 + (i + 0.5) * wj, J.row.y, J.row.d], i % 2 ? -1 : 1, 90)
      h.quadSpiral(J.cell, { ...R.FIG, mode: 'add', margin: 0.72, corner: 2.6, cornerMin: 0.6, dir: -1 })
    }
    // 7 axial strip
    K.axial.forEach((a, k) => {
      if (!use(['column-up', 'gamma', 'column-down'][k])) return
      out.plates.push(PL(a.poly, { round: 1.0 }))
      rim(h, a.poly, rimIn, R.RIM, { bend: 1.8 })
      a.spirals.forEach((s, i) => spiral(h, s, i % 2 ? -1 : 1, 90))
      ;(a.cells || []).forEach((q) => cell(h, q, { corner: 1.6 }))
      if (a.cap) for (const y of a.cap) out.cuts.push({ pts: [[80.2, y], [85.8, y]], line: 0.55, depth: 0.5 })
    })
    // 3 the eye
    use('eye')
    out.bosses.push({ c: K.eye.c, w: K.eye.w, h: K.eye.h, round: 0.55, height: R.eyeHeight ?? R.G + 1.6, crown: 0.9, slit: K.eye.slit })
  }
}
