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

// belly mask and shoulder dragons: RIDGE WORK (ridge pass) — see ./ridge.js
export { maskPanel, shoulderPanel } from './ridge.js'

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
  // the raised frames round the openings (photo-06: squarish, ≈ 6 × 5 mm openings in a frame ≈ 1.5 mm wide, centred
  // ≈ 17 mm from the flange): [x0, y0, x1, y1] mm, the opening itself is the lathe's hole
  frames: [[12.6, 11.4, 21.6, 19.2]],
  threads: [
    // top row (y 20.6–33.6): long cartouches of paired squared hooks
    ...cartouche(2.6, 25, 20.6, 33.6, [[13.6, 27.1, 18, 10.4]]),
    ...cartouche(26.4, 50, 20.6, 33.6, [[32.4, 27.1, 10, 10.4, 1.7, 1], [44, 27.1, 10, 10.4, 1.7, -1]]),
    ...cartouche(51.4, 66, 20.6, 33.6, [[58.7, 27.1, 12.4, 10.4]]),
    ...cartouche(67.4, 84, 20.6, 33.6, [[72.6, 27.1, 8.4, 10.4, 1.7, 1], [79.2, 27.1, 7.8, 10.4, 1.7, -1]]),
    ...cartouche(85.4, 104, 20.6, 33.6, [[94.7, 27.1, 16.4, 10.4]]),
    ...cartouche(105.4, 122, 20.6, 33.6, [[110.6, 27.1, 8.4, 10.4, 1.7, 1], [117.2, 27.1, 7.8, 10.4, 1.7, -1]]), // INFERRED from here on
    // middle row (y 11.6–19.6): the opening (its raised frame is drawn by renderThreads from FOOT.frames), then
    // cartouches of hooks (photo-06: a long one x 25–47 holding C-hooks and a squared spiral, irregular)
    ...cartouche(24.2, 47.6, 11.6, 19.6, [[29.6, 15.6, 8.6, 6.4, 1.6, 1], [37.4, 15.6, 6.4, 6.4, 1.6, -1], [44, 15.6, 5.4, 6.4, 1.5, 1]]),
    ...cartouche(49, 66, 11.6, 19.6, [[54.4, 15.6, 9.4, 6.4, 1.6, -1], [62, 15.6, 6.2, 6.4, 1.5]]),
    ...cartouche(67.4, 84, 11.6, 19.6, [[75.7, 15.6, 14.4, 6.4, 1.6, -1]]),
    ...cartouche(85.4, 104, 11.6, 19.6, [[90.4, 15.6, 8.4, 6.4, 1.6], [99.4, 15.6, 7.6, 6.4, 1.6, -1]]),
    ...cartouche(105.4, 122, 11.6, 19.6, [[113.7, 15.6, 14.4, 6.4, 1.6, -1]]),
    // bottom row (y 0.6–10.6): the continuous band of small squared spirals (≈ 10 mm units, alternating hands, short
    // divider threads between them); by the flange a square of concentric turns
    ...cartouche(1.6, 21, 0.6, 10.6, [[11.3, 5.6, 16.4, 8.6]]),
    { c: [[22.6, 0.6], [124, 0.6]] }, { c: [[22.6, 10.6], [124, 10.6]] },
    ...Array.from({ length: 10 }, (_, k) => ({ c: rectSpiral(27.8 + k * 10, 5.6, 7.8, 7.6, 1.55, k % 2 ? -1 : 1) })),
    ...Array.from({ length: 10 }, (_, k) => ({ c: [[22.6 + k * 10, k % 2 ? 10.6 : 0.6], [22.6 + k * 10, k % 2 ? 3.4 : 7.8]] })),
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
  // the openings' frames: a broader, higher raised ring than the threads
  if (data.frames) panel.add((ctx) => {
    ctx.lineJoin = 'round'; ctx.lineWidth = 1.7
    for (const side of [1, -1]) for (const [x0, y0, x1, y1] of data.frames) {
      const a = W / 2 + side * x0, b = W / 2 + side * x1
      ctx.strokeRect(Math.min(a, b), y0, Math.abs(b - a), y1 - y0)
    }
  }, { height: th * 1.6, shoulder: 0.6, profile: 'plateau' })
  // the free ground inside the cartouches: a thread spiral filler (the packer, raised mode)
  kit.leiwenFill(panel, { avoid: 'raised', margin: 0.45 }, { pitch: 1.7, line: 0.42, mode: 'thread', depth: th * 0.8, cell: [3.4, 6], pairs: 0.3, roundness: 0.1, seed: (o.seed ?? 0) + 5 })
}

// ------------------------------------------------------------------ lid slope (y 194.6 → 224.6 of the lid, arc ≈ 33 mm)

/** the lid mask, right half (photo-06's lid is legible only within ≈ 45 mm of the front flange; the rest INFERRED):
 *  a leiwen strip along the ledge, a rounded frame round the eye, a G-horn rising to the crown, a jaw hook */
export const LIDM = {
  centre: 3,
  bands: [
    // fix pass: ONE big rounded frame per half beside the front flange (photo-06 / detail-knob: ≈ 50 mm wide), open
    // at its lower outer corner, holding the eye and a hooked inner band (x 6–56, y 8–28)
    { c: [[30, 8.4], [6.8, 8.4], [6.8, 27.8], [55.6, 27.8], [55.6, 14.6], [46, 14.6]], w: [3.6, 4, 4, 4, 3.8, 3.2], round: 0.7, inner: 0.22, end: 'round', fill: lines(1.2) },
    { c: [[30, 13.4], [30, 22.6], [48, 22.6], [48, 19.2]], w: 3, round: 0.6, inner: 0.2, end: 'round' },
    // the horn: a curving G running out toward the side flange (x 60–94, y 7–29)
    { c: squareSpiral(61, 7.4, 94, 29, 5.6, 1.5), w: 3.8, round: 0.95, inner: 0.35, end: 'round', fill: lines(1.25) },
    // INFERRED, out to the side flange: a C-hook
    { c: [[112, 6.6], [99, 6.6], [99, 25], [115, 25], [115, 14]], w: 3.4, round: 0.7, inner: 0.25, end: 'round' },
  ],
  eyes: [{ c: [18.4, 18.4], w: 9, h: 8, round: 0.9, height: 2.6, crown: 0.85, socket: [5.6, 5] }],
}

// ------------------------------------------------------------------ panels

const make = (kit, size, { ppmm, seed }, fn) => {
  const panel = new kit.ReliefPanel({ width: size.width, height: size.height, ppmm, seed })
  fn(panel)
  return panel.bake()
}

export const footPanel = (kit, size, o) => make(kit, size, o, (panel) => renderThreads(kit, panel, FOOT, { seed: o.seed }))

export const lidPanel = (kit, size, o) => make(kit, size, o, (panel) => {
  // the leiwen strip along the ledge: a raised border line above it
  const W = panel.width
  panel.raise((ctx) => ctx.fillRect(0, 4.6, W, 1.1), { height: 0.9, shoulder: 0.4, profile: 'plateau' })
  renderBands(kit, panel, LIDM, { seed: o.seed, height: 1.5, shoulder: 0.85, depth: 0.36, ground: { pitch: 1.15, cell: [4, 7] } })
})
