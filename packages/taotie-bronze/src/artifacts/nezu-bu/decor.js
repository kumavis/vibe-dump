// Nezu bu 饕餮文瓿 (90082) — the décor, TRACED.
//
// How it was drawn: photo-06 (head-on at a belly mask) was developed onto each register's own panel coordinates
// through the camera fitted to its outline (dossier §b.1; .work/r8-bu/develop.py): x = developed mm from the mask
// centre line (θ · r(s), the lathe's 'true' map), y = arc mm above the register's lower edge. The developed images
// (reference/nezu-bu/faces/dev-*.jpg) were ruled every 10 mm and read element by element: every band below is a
// centre line read off them with its width (mm) at the control points. The photograph turns away beyond ≈ 60° of
// the centre line (≈ 110 mm of belly arc, ≈ 120 mm of shoulder arc): what lies between there and the divider
// flange at 90° (≈ 164 mm) is INFERRED from the visible part and marked so below.
//
// Three idioms on one vessel (photo-06):
//  * BELLY — broad, flat-topped raised bands (≈ 4–6 mm, ≈ 1.6 mm proud, softly rounded shoulders), each cut along
//    its length by two or three sunk lines that follow its edges; a big pillow eye inside a rounded-square frame,
//    an oval nostril pocket, a vertical nose column, and outside the frame a huge rounded-square spiral horn of
//    three laps; a fine squared-spiral ground (≈ 1.25 mm pitch).
//  * SHOULDER — a long-bodied dragon per half facing the centre ridge: a smooth, rounded, domed body (≈ 3.5 mm)
//    sweeping in an S over two low discs studded with dots, a squarish head with a round eye, curled jaws and a
//    curled crest; the ground is fine lines that FOLLOW the creature (contour echoes), not spirals.
//  * FOOT — fine raised threads (≈ 0.8 mm): rectangular cartouches in three rows, each holding squared spirals
//    and C-hooks; the openings sit in the middle row beside the centre flange.
// Data are the RIGHT half (x ≥ 0, seen from outside); the left half is its mirror image.

const circle = (c, r, n = 48) => Array.from({ length: n }, (_, i) => [c[0] + r * Math.cos((2 * Math.PI * i) / n), c[1] + r * Math.sin((2 * Math.PI * i) / n)])
const ellipse = (c, rx, ry, n = 40) => Array.from({ length: n }, (_, i) => [c[0] + rx * Math.cos((2 * Math.PI * i) / n), c[1] + ry * Math.sin((2 * Math.PI * i) / n)])

/** a rounded-square spiral centre line, outside → in: box x0..x1 × y0..y1, `pitch` between laps, `laps`; starts at
 *  the bottom-left corner going up (dir +1: clockwise seen from outside) */
export function squareSpiral(x0, y0, x1, y1, pitch, laps, { startAt = 0 } = {}) {
  const pts = [[x0 + startAt, y0]]
  let a = x0, b = x1, lo = y0, hi = y1
  pts.push([a, y0])
  for (let k = 0; k < laps * 4; k++) {
    const s = k % 4
    if (s === 0) pts.push([a, hi])
    else if (s === 1) pts.push([b, hi])
    else if (s === 2) { lo += pitch; pts.push([b, lo]) }
    else { a += pitch; pts.push([a, lo]); hi -= pitch; b -= pitch }
    if (b - a < pitch * 0.9 || hi - lo < pitch * 0.9) break
  }
  // drop a duplicate first point
  return pts.filter((p, i) => i === 0 || Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) > 1e-6)
}

/**
 * Render fat-band data into a panel, mirrored about W/2.
 * data = { bands: [{ c, w, round?, inner?, start?, end?, spiral?, fill?, contour? }], plates: [{ c, w, h, r, fill? }],
 *          eyes: [{ c, w, h, height?, crown?, round?, ring? }], pockets: [{ c, rx, ry, depth }] (sunk ovals),
 *          discs: [{ c, r, height, dots: [[dx, dy]…] }], lines: [{ c, w, closed? }] (sunk), centre: mm kept plain }
 */
export function renderBands(kit, panel, data, o = {}) {
  const W = panel.width
  const height = o.height ?? 1.6
  const depth = o.depth ?? 0.4
  const sides = [1, -1]
  const X = (side) => ([x, y]) => [W / 2 + side * x, y]
  const els = []
  for (const side of sides) {
    const sp = (s) => s && { ...s, dir: (s.dir ?? 1) * side }
    for (const b of data.bands || []) {
      els.push(kit.roundStroke(b.c.map(X(side)), {
        width: b.w, round: b.round ?? 0.55, inner: b.inner ?? 0.18, start: b.start ?? 'blunt', end: b.end ?? 'blunt',
        capRound: b.capRound ?? 0.45, spiral: sp(b.spiral), startSpiral: sp(b.startSpiral),
        ...(b.fill !== undefined ? { fill: b.fill } : {}), ...(b.contour !== undefined ? { contour: b.contour } : {}),
      }))
    }
    for (const p of data.plates || []) els.push(kit.roundPlate({ c: X(side)(p.c), w: p.w, h: p.h, r: p.r ?? 3, ...(p.fill ? { fill: p.fill } : {}), ...(p.contour !== undefined ? { contour: p.contour } : {}) }))
  }
  if (els.length) {
    kit.carve(panel, els, {
      height, shoulder: o.shoulder ?? height * 0.6, depth, seed: o.seed ?? 0, irregularity: 1,
      contour: o.contour ?? { inset: 0.85, line: 0.45 }, fill: o.fill,
    })
  }
  for (const side of sides) {
    for (const d of data.discs || []) {
      const c = X(side)(d.c)
      kit.pillowBoss(panel, { c, w: d.r * 2, h: d.r * 2, round: 1, height: d.height ?? 1.2, crown: 0.45, slit: false, ring: false })
    }
    for (const e of data.eyes || []) {
      const c = X(side)(e.c)
      kit.pillowBoss(panel, { c, w: e.w, h: e.h, round: e.round ?? 0.6, height: e.height ?? 3.2, crown: e.crown ?? 0.8, slit: false, ring: e.ring ?? false, base: e.base })
    }
  }
  // sunk: pockets (nostrils), dots on the discs, extra lines
  const pockets = data.pockets || []
  if (pockets.length) {
    for (const p of pockets) {
      panel.sink((ctx) => {
        for (const side of sides) {
          const pts = ellipse(X(side)(p.c), p.rx, p.ry)
          ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill()
        }
      }, { depth: p.depth ?? 1.8, shoulder: Math.min(p.rx, p.ry) * 0.45, profile: 'u' })
    }
  }
  const dots = []
  for (const side of sides) for (const d of data.discs || []) for (const [dx, dy] of d.dots || []) dots.push([X(side)(d.c)[0] + side * dx, d.c[1] + dy, d.dot ?? 0.9])
  if (dots.length) panel.sink((ctx) => { for (const [x, y, r] of dots) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill() } }, { depth: 0.55, shoulder: 0.4, profile: 'u' })
  const lines = []
  for (const side of sides) for (const l of data.lines || []) lines.push({ ...l, c: l.c.map(X(side)) })
  for (const d of data.discs || []) if (d.ring) for (const side of sides) lines.push({ c: circle(X(side)(d.c), d.ring, 56), w: 0.55, closed: true })
  for (const e of data.eyes || []) if (e.socket) for (const side of sides) lines.push({ c: ellipse(X(side)(e.c), e.socket[0], e.socket[1], 56), w: 0.6, closed: true })
  if (lines.length) {
    panel.sink((ctx) => {
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'
      for (const l of lines) {
        ctx.lineWidth = l.w ?? 0.55
        ctx.beginPath(); l.c.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
        if (l.closed) ctx.closePath()
        ctx.stroke()
      }
    }, { depth: depth * 0.9, shoulder: 0.25, profile: 'u' })
  }
  // the ground: fine squared spirals (belly) or contour-following lines (shoulder), each half on its own (hands mirror)
  if (o.ground !== false) {
    const g = o.ground || {}
    const cg = data.centre ?? 0
    for (const [x, w, hand] of [[W / 2 + cg, W / 2 - cg, 'right'], [0, W / 2 - cg, 'left']]) {
      kit.leiwenFill(panel, { rect: { x, y: 0, w, h: panel.height }, avoid: 'raised', margin: g.margin ?? 0.5 }, {
        pitch: g.pitch ?? 1.25, line: g.line ?? 0.5, depth: g.depth ?? depth * 0.85, cell: g.cell ?? [4.6, 8], pairs: g.pairs ?? 0.2,
        maxAspect: g.maxAspect ?? 1.6, roundness: g.roundness ?? 0.15, jitter: 0.07, echo: g.echo ?? 0, follow: g.follow ?? 1,
        hand, seed: (o.seed ?? 0) + 11, fillers: true,
      })
    }
  }
}

const lines = (pitch = 1.25) => ({ kind: 'lines', line: 0.45, pitch })

// ------------------------------------------------------------------ belly mask (register y 77 → 123.6, arc ≈ 47 mm)

/** the mask, right half: centre ridge at x 0, divider flange at x ≈ 164 */
export const MASK = {
  centre: 2.4,
  bands: [
    // nose column beside the ridge and the narrow band outside it (worn; read at x 5–22)
    { c: [[11.5, 5], [11.5, 25], [11.5, 44]], w: [6, 6.4, 6], fill: lines(1.3) },
    { c: [[20.4, 7], [20.4, 44]], w: 3.4 },
    // the eye frame: a rounded-square G open at the bottom right, its top bar cut with lines (x 27–61.5, y 23.5–44)
    { c: [[34, 23.4], [27, 23.4], [27, 33], [27, 43.8], [44, 43.8], [61.4, 43.8], [61.4, 31.5]], w: [3.6, 4.2, 4.2, 4.6, 4.6, 4.4, 4], round: 0.6, inner: 0.2, end: 'blunt', fill: lines(1.2) },
    // the squared hook inside the frame, left of the eye
    { c: [[32, 26.4], [32, 38.6], [39, 38.6], [39, 31.4], [35.6, 31.4]], w: 3, round: 0.5, inner: 0.15, end: 'round' },
    // the cheek band under the eye, pointed toward the nose
    { c: [[42, 20.8], [52, 22.8], [64.6, 23.6]], w: [2.4, 4, 4.2], start: 'point', fill: lines(1.2) },
    // the vertical band between the frame and the horn
    { c: [[67.8, 11], [67.8, 30], [67.8, 45]], w: 4.4, fill: lines(1.25) },
    // the HORN: a rounded-square spiral of three laps (outer box x 72.5–127, y 11–45; ≈ 6.3 mm between laps)
    { c: squareSpiral(72.6, 11, 127, 45, 6.3, 2.6), w: 4.3, round: 0.55, inner: 0.22, end: 'round', fill: lines(1.3) },
    // the jaw row along the foot of the field: C-hooks curling in (x 4–70, y 1–10)
    { c: [[5, 9.4], [5, 1.6], [19.5, 1.6], [19.5, 7], [11, 7]], w: 2.6, round: 0.5, inner: 0.15, end: 'round' },
    { c: [[23, 9.4], [23, 1.6], [38.5, 1.6], [38.5, 9.4], [29, 9.4], [29, 5]], w: 2.6, round: 0.5, inner: 0.15, end: 'round' },
    { c: [[41.5, 1.6], [41.5, 9.4], [53, 9.4], [53, 4], [46, 4]], w: 2.6, round: 0.5, inner: 0.15, end: 'round' },
    { c: [[56, 9.4], [56, 1.6], [65.5, 1.6], [65.5, 6.6]], w: 2.6, round: 0.5, inner: 0.15, end: 'round' },
    // INFERRED beyond the photograph's edge (x > 127): an upright band and a C-hook up to the divider flange
    { c: [[134.4, 7], [134.4, 45]], w: 4.4, fill: lines(1.25) },
    { c: [[150, 7.5], [141, 7.5], [141, 44.6], [158.4, 44.6], [158.4, 16], [150.6, 16]], w: 4, round: 0.55, inner: 0.2, end: 'round', fill: lines(1.3) },
  ],
  eyes: [{ c: [55.4, 34.4], w: 12.4, h: 11, round: 0.7, height: 3.4, crown: 0.85, socket: [7.6, 6.8] }],
  pockets: [{ c: [34.6, 16.4], rx: 3.6, ry: 1.8, depth: 1.8 }],
  plates: [{ c: [34.6, 16.4], w: 10.2, h: 6.2, r: 3, contour: false }], // the nostril's raised rim (pocket sunk into it)
}

// ------------------------------------------------------------------ shoulder (register y 127.4 → 158.6, arc ≈ 33.5 mm)

/** a long-bodied dragon per half, head at the centre ridge (x 18–42), facing it */
export const SHOULDER = {
  centre: 2.2,
  bands: [
    // the body: from the neck over the first disc, down round it and back underneath (x 37–81)
    { c: [[37.6, 18.4], [48.8, 19.9], [57, 23.1], [63.7, 24.9], [71, 23.6], [76.8, 20.4], [80.6, 15.7], [79, 10], [74, 7.2], [66.5, 6.4], [56, 7.4]], w: [4.4, 4, 3.8, 3.8, 3.8, 3.8, 3.6, 3.4, 3.2, 2.8, 2], round: 0.6, inner: 0.3, end: 'point' },
    // the second sweep: off the top of the first loop, down and round the second disc (x 73–122)
    { c: [[72, 25.4], [85, 19], [94.6, 13.8], [104, 10], [113, 8.2], [120.6, 9.4], [122, 14.8], [116, 21.3], [105, 24], [97, 22.6]], w: [2.6, 3.6, 3.6, 3.6, 3.6, 3.4, 3.2, 3, 2.8, 2.2], round: 0.6, inner: 0.3, end: 'round' },
    // crest: a thin band off the top of the head curling over at the far end (x 6–25, y 25–32)
    { c: [[25, 24.4], [15, 26.4], [8, 27.6], [6.2, 30], [9.6, 31.8], [14, 30.6]], w: [3, 2.8, 2.6, 2.4, 2.2, 2], round: 0.6, inner: 0.3, end: 'round' },
    // upper snout curling down in front of the head
    { c: [[25, 14.2], [19.8, 13.8], [16.4, 12.2], [16.6, 9.8]], w: [3.2, 3, 2.6, 2.2], end: 'round' },
    // lower jaw / foreleg: along the bottom, rolled up at its tail end
    { c: [[15, 8.8], [22.6, 7.8], [32, 7.2], [37.4, 8], [38.6, 10.6], [36, 11.4]], w: [2.4, 3, 3, 2.8, 2.6, 2.2], end: 'round' },
    // INFERRED (x > 122, the photograph turns away): the tail curling up before the divider flange
    { c: [[124, 24.6], [134, 26], [142, 22], [143, 13.2], [137.6, 10.4]], w: [2.6, 3.2, 3.2, 3, 2.6], end: 'spiral', spiral: { turns: 0.6, dir: -1, R: 2.6 } },
  ],
  plates: [{ c: [31, 16.4], w: 14.6, h: 12, r: 5, contour: { inset: 0.8, line: 0.45 } }], // the head
  eyes: [{ c: [28.6, 17.6], w: 5.6, h: 5, round: 1, height: 1.4, crown: 0.8, base: 'field', socket: [3.8, 3.4] }],
  discs: [
    { c: [70.6, 15.4], r: 6.8, height: 1.1, ring: 8.2, dots: [[-2.2, 1.6], [1.4, 2.4], [2.8, -0.4], [0.2, -0.6], [-2.6, -1.8], [0.8, -3]] },
    { c: [99.4, 18.2], r: 5.6, height: 1, ring: 7, dots: [[-1.8, 1.2], [1.4, 1.8], [2, -1], [-0.4, -0.6], [-1.6, -2.2]] },
  ],
}

// ------------------------------------------------------------------ foot (register y 19 → 54.4, arc ≈ 35.5 mm)

/** thread relief: one raised thread ≈ 0.85 mm wide; cartouches in three rows (y 0.6–10.6, 11.6–19.6, 20.6–33.6) */
function rectSpiral(cx, cy, w, h, pitch, dir = 1) {
  const pts = []
  let a = -w / 2, b = w / 2, lo = -h / 2, hi = h / 2
  pts.push([a, lo])
  for (let k = 0; k < 24; k++) {
    const s = k % 4
    if (s === 0) pts.push([a, hi])
    else if (s === 1) pts.push([b, hi])
    else if (s === 2) { lo += pitch; pts.push([b, lo]) }
    else { a += pitch; pts.push([a, lo]); hi -= pitch; b -= pitch }
    if (b - a < pitch * 1.1 || hi - lo < pitch * 1.1) break
  }
  return pts.map(([x, y]) => [cx + dir * x, cy + y])
}
function cartouche(x0, x1, y0, y1, units) {
  const t = [{ c: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], closed: true }]
  for (const u of units) t.push({ c: rectSpiral(u[0], u[1], u[2], u[3], u[4] ?? 1.7, u[5] ?? 1) })
  return t
}
export const FOOT = {
  threads: [
    // top row (y 20.6–33.6): long cartouches of paired squared hooks
    ...cartouche(2.6, 25, 20.6, 33.6, [[13.6, 27.1, 18, 10.4]]),
    ...cartouche(26.4, 50, 20.6, 33.6, [[32.4, 27.1, 10, 10.4, 1.7, 1], [44, 27.1, 10, 10.4, 1.7, -1]]),
    ...cartouche(51.4, 66, 20.6, 33.6, [[58.7, 27.1, 12.4, 10.4]]),
    ...cartouche(67.4, 84, 20.6, 33.6, [[72.6, 27.1, 8.4, 10.4, 1.7, 1], [79.2, 27.1, 7.8, 10.4, 1.7, -1]]),
    ...cartouche(85.4, 104, 20.6, 33.6, [[94.7, 27.1, 16.4, 10.4]]),
    ...cartouche(105.4, 122, 20.6, 33.6, [[110.6, 27.1, 8.4, 10.4, 1.7, 1], [117.2, 27.1, 7.8, 10.4, 1.7, -1]]), // INFERRED from here on
    // middle row (y 11.6–19.6): the opening's frame beside the flange, then cartouches
    { c: [[9.8, 11.4], [22.4, 11.4], [22.4, 19.8], [9.8, 19.8]], closed: true },
    ...cartouche(24.2, 49, 11.6, 19.6, [[30.4, 15.6, 10, 6.4, 1.6, 1], [42.8, 15.6, 10, 6.4, 1.6, -1]]),
    ...cartouche(50.4, 66, 11.6, 19.6, [[58.2, 15.6, 13.4, 6.4, 1.6]]),
    ...cartouche(67.4, 84, 11.6, 19.6, [[75.7, 15.6, 14.4, 6.4, 1.6, -1]]),
    ...cartouche(85.4, 104, 11.6, 19.6, [[94.7, 15.6, 16, 6.4, 1.6]]),
    ...cartouche(105.4, 122, 11.6, 19.6, [[113.7, 15.6, 14.4, 6.4, 1.6, -1]]),
    // bottom row (y 0.6–10.6): squared spirals in boxes, the pale band of the photograph
    ...cartouche(1.6, 21, 0.6, 10.6, [[11.3, 5.6, 16.4, 8.6]]),
    ...cartouche(22.4, 49, 0.6, 10.6, [[29, 5.6, 10.4, 8.6, 1.7, 1], [42.4, 5.6, 10.4, 8.6, 1.7, -1]]),
    ...cartouche(50.4, 58.4, 0.6, 10.6, [[54.4, 5.6, 6.4, 8.6]]),
    ...cartouche(59.8, 84, 0.6, 10.6, [[65.6, 5.6, 9.4, 8.6, 1.7, 1], [78, 5.6, 9.4, 8.6, 1.7, -1]]),
    ...cartouche(85.4, 104, 0.6, 10.6, [[94.7, 5.6, 16, 8.6]]),
    ...cartouche(105.4, 122, 0.6, 10.6, [[113.7, 5.6, 14.4, 8.6, 1.7, -1]]),
  ],
}

export function renderThreads(kit, panel, data, o = {}) {
  const W = panel.width
  const tw = o.w ?? 0.85, th = o.h ?? 0.55
  const polys = []
  for (const side of [1, -1]) for (const t of data.threads) {
    let pts = t.c.map(([x, y]) => [W / 2 + side * x, y])
    pts = kit.shapes.fillet(pts, 0.7, { closed: !!t.closed, step: 0.25 })
    polys.push({ pts, closed: !!t.closed })
  }
  panel.add((ctx) => {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = tw
    for (const p of polys) {
      ctx.beginPath(); p.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
      if (p.closed) ctx.closePath()
      ctx.stroke()
    }
    // register borders
    ctx.lineWidth = tw * 1.1
    for (const y of [0.15, panel.height - 0.6]) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }
  }, { height: th, shoulder: tw * 0.42, profile: 'plateau' })
  // the free ground inside the cartouches: a thread spiral filler (the packer, raised mode)
  kit.leiwenFill(panel, { avoid: 'raised', margin: 0.45 }, { pitch: 1.7, line: 0.42, mode: 'thread', depth: th * 0.8, cell: [3.4, 6], pairs: 0.3, roundness: 0.1, seed: (o.seed ?? 0) + 5 })
}

// ------------------------------------------------------------------ lid slope (y 194.6 → 224.6 of the lid, arc ≈ 33 mm)

/** the lid mask, right half (photo-06's lid is legible only within ≈ 45 mm of the front flange; the rest INFERRED):
 *  a leiwen strip along the ledge, a rounded frame round the eye, a G-horn rising to the crown, a jaw hook */
export const LIDM = {
  centre: 3,
  bands: [
    // the frame round the mask's eye (x 7–36, y 8–28)
    { c: [[22, 8.6], [7.4, 8.6], [7.4, 27.6], [36, 27.6], [36, 14.4], [28.6, 14.4]], w: [3.4, 3.8, 3.8, 3.8, 3.6, 3], round: 0.6, inner: 0.2, end: 'round', fill: lines(1.2) },
    // the horn: an outward G (x 40–92, y 7–29)
    { c: squareSpiral(40.4, 7.4, 92, 29, 5.6, 1.6), w: 3.8, round: 0.55, inner: 0.22, end: 'round', fill: lines(1.25) },
    // INFERRED, out to the divider flange: a C-hook
    { c: [[110, 6.6], [97, 6.6], [97, 25], [113, 25], [113, 14]], w: 3.4, round: 0.55, inner: 0.2, end: 'round' },
  ],
  eyes: [{ c: [20.6, 19.6], w: 9.4, h: 8, round: 0.75, height: 2.6, crown: 0.85, socket: [5.8, 5] }],
}

// ------------------------------------------------------------------ panels

const make = (kit, size, { ppmm, seed }, fn) => {
  const panel = new kit.ReliefPanel({ width: size.width, height: size.height, ppmm, seed })
  fn(panel)
  return panel.bake()
}

export const maskPanel = (kit, size, o) => make(kit, size, o, (panel) => {
  renderBands(kit, panel, MASK, { seed: o.seed, height: 1.7, shoulder: 0.95, depth: 0.4, contour: { inset: 0.8, line: 0.45 }, ground: { pitch: 1.25, cell: [4.6, 8], pairs: 0.15 } })
})

export const shoulderPanel = (kit, size, o) => make(kit, size, o, (panel) => {
  // domed, rounded-section bands (shoulder ≈ half the width); the ground: contour echoes, spirals only in leftovers
  renderBands(kit, panel, SHOULDER, { seed: o.seed, height: 1.5, shoulder: 1.6, depth: 0.36, contour: { inset: 0.7, line: 0.4 }, ground: { pitch: 1.2, echo: 4, cell: [4.2, 7.4], pairs: 0.4, follow: 1 } })
})

export const footPanel = (kit, size, o) => make(kit, size, o, (panel) => renderThreads(kit, panel, FOOT, { seed: o.seed }))

export const lidPanel = (kit, size, o) => make(kit, size, o, (panel) => {
  // the leiwen strip along the ledge: a raised border line above it
  const W = panel.width
  panel.raise((ctx) => ctx.fillRect(0, 4.6, W, 1.1), { height: 0.9, shoulder: 0.4, profile: 'plateau' })
  renderBands(kit, panel, LIDM, { seed: o.seed, height: 1.5, shoulder: 0.85, depth: 0.36, ground: { pitch: 1.15, cell: [4, 7] } })
})
