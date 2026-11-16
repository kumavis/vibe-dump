// Nezu zun 饕餮文尊 (90075) — the décor, TRACED from the developed photographs.
//
// How it was drawn: photo-26 (head-on at a shoulder head) was developed onto each register's own panel coordinates
// through the camera fitted to its outline (dossier §b.1): x = developed mm from the mask-centre flange (θ · r(s),
// the lathe's 'true' map), y = arc mm above the register's lower edge. The grids (.work/r8-zun/dev/*.png, 5 mm) were
// read element by element; the region within 60° of a divider flange (beyond ≈ 75 mm on the belly) is read off the
// same development where it turns away and checked against photo-28, which looks straight at a divider.
//
// The idiom (photo-26, photo-28): THREAD RELIEF. Unlike the fat-band Nezu vessels this zun is drawn in single raised
// threads ≈ 0.95 mm wide at a ≈ 2.1 mm pitch, all at one low height, on a flat ground: the mask's parts are
// compartments outlined by a thread and filled with parallel threads and squared spirals that follow the walls;
// only the eyes rise — smooth round domes in a plain socket. The circle bands carry low domed discs with a small
// ring, alternating with symmetric hooks. Data are the RIGHT half (x ≥ 0 from the centre line, seen from outside);
// the left half is its mirror image.

/** a squared spiral with rounded corners, outside → in: centre c, outer size w × h, thread pitch, `turns` (laps; default
 *  as many as fit). It starts at an outer corner and winds inward clockwise; `start` picks the corner / sense
 *  ('left' bottom-left going up · 'right' bottom-right going up · 'top' top-right going down · 'bottom' top-left going
 *  down), dir −1 mirrors it. Returns { c: points, r } for renderThreads. */
export function rectSpiral(c, w, h, { pitch = 2.1, turns, r = 1.4, start = 'left', dir = 1 } = {}) {
  const maxLaps = Math.max(1, Math.floor(Math.min(w, h) / (2 * pitch)))
  const laps = Math.min(turns ?? maxLaps, maxLaps + 0.5)
  let a = -w / 2, b = w / 2, lo = -h / 2, hi = h / 2
  const pts = [[a, lo]]
  for (let k = 0; k < laps * 4; k++) {
    const side = k % 4
    if (side === 0) pts.push([a, hi]) // up the left side
    else if (side === 1) pts.push([b, hi]) // across the top
    else if (side === 2) { lo += pitch; pts.push([b, lo]) } // down the right side, stopping a pitch above the last bottom
    else { a += pitch; pts.push([a, lo]); hi -= pitch; b -= pitch } // back along the bottom
    if (b - a < pitch * 0.9 || hi - lo < pitch * 0.9) break
  }
  const sx = { left: 1, right: -1, top: -1, bottom: 1 }[start] * dir
  const sy = { left: 1, right: 1, top: -1, bottom: -1 }[start]
  return { c: pts.map(([x, y]) => [c[0] + sx * x, c[1] + sy * y]), r }
}

/** a C / G hook: a squared hook curling in, open to `side` ('left' | 'right'), box w × h at c */
export function hook(c, w, h, side = 'left') {
  const s = side === 'left' ? 1 : -1
  const [x, y] = c
  return {
    c: [[x + s * w / 2, y + h / 2], [x - s * w / 2, y + h / 2], [x - s * w / 2, y - h / 2], [x + s * w / 2, y - h / 2], [x + s * w / 2, y + h * 0.05], [x, y + h * 0.05], [x, y - h * 0.12]],
    r: Math.min(w, h) * 0.22,
  }
}

const circle = (c, r, n = 40) => Array.from({ length: n + 1 }, (_, i) => [c[0] + r * Math.cos((2 * Math.PI * i) / n), c[1] + r * Math.sin((2 * Math.PI * i) / n)])

/** round a polyline's corners (mm radius) */
function rounded(kit, pts, r, closed) {
  return r > 0 && pts.length > 2 ? kit.shapes.fillet(pts, r, { closed, step: 0.3 }) : pts
}

/**
 * Render traced thread data into a panel, mirrored about the centre line W/2.
 * data = { threads: [{ c, closed?, r?, w? }], bosses: [{ c, d, h?, crown? }], discs: [{ c, d, h? }],
 *          plain: [[x, y]…][] (closed regions kept plain: the eye sockets), borders: [y…] (full-width threads),
 *          centre: mm kept plain at the centre line (the flange), single?: no mirror }
 * opts = { thread: { w, h }, ground: { pitch, … } | false, seed }
 */
export function renderThreads(kit, panel, data, o = {}) {
  const W = panel.width, Hh = panel.height
  const tw = o.thread?.w ?? 0.72
  const th = o.thread?.h ?? 0.5
  const sides = data.single ? [1] : [1, -1]
  const X = (side) => ([x, y]) => [W / 2 + side * x, y]
  const polys = []
  for (const side of sides) for (const t of data.threads || []) polys.push({ pts: rounded(kit, t.c.map(X(side)), t.r ?? 1.2, !!t.closed), closed: !!t.closed, w: t.w ?? tw })
  // 1) every line in ONE call (one EDT). The Nezu zun's line work is INCISED: narrow dark grooves between wider
  //    flat lands (photo-26: groove ≈ 0.7 mm at a 2.1 mm pitch), so the default is sunk; 'thread' raises them
  const sunk = (o.mode ?? 'sunk') === 'sunk'
  const lineOp = (draw, h, w) => (sunk ? panel.sink(draw, { depth: h, shoulder: w * 0.3, profile: 'u' }) : panel.add(draw, { height: h, shoulder: w * 0.42, profile: 'plateau' }))
  lineOp((ctx) => {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    for (const p of polys) {
      ctx.lineWidth = p.w
      ctx.beginPath()
      p.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
      if (p.closed) ctx.closePath()
      ctx.stroke()
    }
    for (const y of data.borders || []) { ctx.lineWidth = tw * 1.1; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }
  }, th, tw)
  // 2) discs (circle bands) and eye bosses: smooth domes
  for (const side of sides) {
    for (const d of data.discs || []) {
      const c = X(side)(d.c)
      kit.pillowBoss(panel, { c, w: d.d, h: d.d, round: 1, height: d.h ?? 1.5, crown: d.crown ?? 0.42, slit: false, ring: false })
    }
    for (const b of data.bosses || []) {
      const c = X(side)(b.c)
      kit.pillowBoss(panel, { c, w: b.d, h: b.dh ?? b.d, round: 1, height: b.h ?? 3.2, crown: b.crown ?? 0.85, slit: false, ring: false })
    }
  }
  // 3) small threads ON the discs (their inner ring and crescent): added after the domes
  const onTop = []
  for (const side of sides) for (const d of data.discs || []) {
    if (d.ring !== false) onTop.push({ pts: circle(X(side)([d.c[0], d.c[1] + d.d * 0.12]), d.d * 0.17, 24), closed: true })
    if (d.crescent !== false) {
      const c = X(side)(d.c), R = d.d * 0.33
      const arc = []
      for (let i = 0; i <= 12; i++) { const a = Math.PI * (1.15 + 0.7 * (i / 12)); arc.push([c[0] + R * Math.cos(a), c[1] + R * Math.sin(a) + d.d * 0.02]) }
      onTop.push({ pts: arc, closed: false })
    }
  }
  if (onTop.length) {
    lineOp((ctx) => {
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = tw * 0.85
      for (const p of onTop) { ctx.beginPath(); p.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); if (p.closed) ctx.closePath(); ctx.stroke() }
    }, th * 0.8, tw * 0.85)
  }
  // 4) the thread ground: the packer fills every compartment left free with wall-following spirals
  if (o.ground !== false) {
    const g = o.ground || {}
    const plainDraw = (ctx) => {
      for (const side of sides) for (const pl of data.plain || []) {
        ctx.beginPath(); pl.map(X(side)).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill()
      }
      const cg = data.centre ?? 0
      if (cg > 0) ctx.fillRect(W / 2 - cg, 0, 2 * cg, Hh)
      for (const e of data.edgePlain || []) ctx.fillRect(e[0], e[1], e[2], e[3])
    }
    const plainM = panel.mask(plainDraw)
    const field = panel.field
    const avoid = new Float32Array(field.length)
    for (let i = 0; i < field.length; i++) avoid[i] = Math.abs(field[i]) > 0.05 || plainM.data[i] > 0.5 ? 1 : 0
    const parts = data.single ? [{ x: 0, w: W, hand: 'right' }] : [{ x: W / 2, w: W / 2, hand: 'right' }, { x: 0, w: W / 2, hand: 'left' }]
    for (const part of parts) {
      kit.leiwenFill(panel, { rect: { x: part.x, y: g.y0 ?? 0, w: part.w, h: (g.y1 ?? Hh) - (g.y0 ?? 0) }, avoid: { data: avoid }, margin: g.margin ?? 0.7 }, {
        mode: sunk ? 'sunk' : 'thread', depth: th, pitch: g.pitch ?? 2.1, line: g.line ?? 0.34, cell: g.cell ?? [7, 16], pairs: g.pairs ?? 0.3,
        maxAspect: g.maxAspect ?? 2.8, roundness: g.roundness ?? 0.55, jitter: 0.06, echo: g.echo ?? 2, follow: 1, hand: part.hand,
        seed: (o.seed ?? 0) + 7, fillers: true,
      })
    }
  }
}

// ------------------------------------------------------------------ helpers for data

const T = (c, o = {}) => ({ c, ...o })
const S = (c, w, h, o = {}) => rectSpiral(c, w, h, o)
const nose = (x0, x1, ys, hh) => ys.map((y) => hook([(x0 + x1) / 2, y], x1 - x0, hh, 'left'))

// ------------------------------------------------------------------ belly (y 0 = 114 mm; one 120° sector, centre = a head)

/** BELLY: the large mask under the head (eyes Ø 19.5 at ±39 mm), and half of the small mask centred on the
 *  divider flange at the sector edge (x = W/2; its eye Ø ≈ 12, 28 mm in from the divider). */
export function bellyData(W) {
  const E = W / 2 // the divider (small mask centre)
  const R = (c, w, h, o = {}) => rectSpiral(c, w, h, { r: 2.2, ...o })
  const comb = (x0, x1, y0, y1, p = 2.1) => Array.from({ length: Math.floor((x1 - x0) / p) + 1 }, (_, i) => T([[x0 + i * p, y0], [x0 + i * p, y1]], { r: 0 }))
  const threads = [
    // nose column beside the flange: its outer wall and five stacked hooks
    T([[14.6, 0.6], [14.6, 55.4]], { r: 0 }),
    ...nose(6.8, 12.8, [50.5, 40, 29, 17.5, 6.5], 6.6).map((h) => ({ ...h, r: 1.6 })),
    // horn: a long hook — up the inner side, across under the top border, down the outer side and back in (a G)
    T([[17.6, 38], [17.6, 52.6], [60.4, 52.6], [60.4, 42.4], [54.4, 42.4], [54.4, 47.2]], { r: 3.4 }),
    // the horn's big rounded spiral and the hook in its root
    R([37.6, 44.6], 25, 12.4, { turns: 3, start: 'left' }),
    T([[21.2, 38.6], [21.2, 48.4], [23.8, 48.4]], { r: 1.6 }),
    // the eye socket: a rounded loop, its lower outer corner sweeping down into the jaw
    T([[21.4, 37.8], [21.4, 20.6], [25.6, 14.8], [47.6, 14.8], [53.6, 18.4], [56.4, 26], [56.8, 37.8]], { closed: true, r: 5 }),
    T([[53.6, 18.4], [57.6, 12.2], [62.6, 9.4], [70, 9.4]], { r: 3 }),
    // jaw: round spirals under the socket and a long C hook
    R([25, 7], 8.8, 9.4, { turns: 2, start: 'right', r: 2.8 }),
    R([35.2, 7.6], 8.6, 9.6, { turns: 2, start: 'left', r: 2.8 }),
    T([[40.6, 12.6], [50.4, 12.6], [52.4, 8.2], [50.6, 3.2], [43.4, 3.2], [43.4, 7.8], [47.2, 7.8]], { r: 2.2 }),
    // claws: groups of short upright strokes along the lower right
    ...comb(72.4, 84.6, 2.6, 11.6),
    ...comb(88.6, 98.8, 2.6, 11.6),
    // brow / body band running out from the eye toward the small mask: two walls with big rounded spirals in it
    T([[56.8, 37.8], [101.6, 37.8]], { r: 0 }),
    T([[60.4, 17.4], [101.6, 17.4]], { r: 0 }),
    R([67.4, 27.6], 13.2, 15.4, { turns: 3, start: 'bottom', r: 3.2 }),
    R([82.4, 27.6], 13.6, 15.4, { turns: 3, start: 'top', r: 3.2 }),
    T([[90.6, 21.4], [101.6, 21.4]], { r: 0 }),
    T([[90.6, 25.6], [101.6, 25.6]], { r: 0 }),
    T([[90.6, 29.8], [101.6, 29.8]], { r: 0 }),
    T([[90.6, 34], [101.6, 34]], { r: 0 }),
    // upper outer field: a rounded spiral, the comb of vertical strokes (crest / quills), another spiral
    R([68.6, 46.8], 11, 11.4, { turns: 2, start: 'bottom', r: 2.8 }),
    ...comb(76.6, 89.2, 40.6, 53),
    R([96.6, 46.6], 10.6, 11.4, { turns: 2, start: 'top', r: 2.8 }),
    // the small mask at the divider: a rounded socket round its eye, a horn spiral over it, hooks under it, nose column
    T([[E - 39, 30.6], [E - 39, 13.4], [E - 18.2, 13.4], [E - 18.2, 30.6]], { closed: true, r: 4.2 }),
    R([E - 28.4, 44.4], 19, 11, { turns: 2, start: 'left', r: 2.6 }),
    T([[E - 41, 36.4], [E - 41, 52.6], [E - 15.6, 52.6], [E - 15.6, 36.4]], { r: 3.4 }),
    ...[[E - 37.6, 6], [E - 27.6, 6], [E - 17.6, 6]].map(([x, y]) => R([x, y], 9, 8.6, { turns: 2, start: 'right', r: 2.6 })),
    T([[E - 13.4, 0.6], [E - 13.4, 55.4]], { r: 0 }),
    ...nose(E - 11.8, E - 6.2, [49.5, 38, 27, 16, 5.6], 6.4).map((h) => ({ ...h, r: 1.6 })),
  ]
  return {
    threads,
    bosses: [
      { c: [38.6, 26.2], d: 19.5, h: 3.8, crown: 0.86 },
      { c: [E - 28.6, 22], d: 12, h: 2.6, crown: 0.86 },
    ],
    plain: [
      [[22.4, 37], [22.4, 21], [26, 15.8], [47.4, 15.8], [52.8, 19], [55.4, 26], [55.8, 37]],
      [[E - 38, 29.6], [E - 38, 14.4], [E - 19.2, 14.4], [E - 19.2, 29.6]],
    ],
    borders: [0.7, 55.3],
    centre: 5.4,
  }
}

// ------------------------------------------------------------------ circle bands

/** discs every `pitch` mm from `x0` (0 = on the centre line), symmetric hooks between them */
function circleBand(W, H, { x0, pitch, d }) {
  const half = W / 2
  const discs = []
  const threads = []
  const yc = H / 2
  for (let x = x0; x <= half + 0.01; x += pitch) discs.push({ c: [x, yc], d })
  // the hooks between: a pair of C-hooks back to back round a short upright, one above, one below
  for (let x = x0 + pitch / 2; x <= half + 0.01; x += pitch) {
    const a = d * 0.36, b = H * 0.26
    for (const sx of [1, -1]) {
      threads.push(T([[x + sx * 0.8, yc + b], [x + sx * a, yc + b], [x + sx * a, yc + 0.8], [x + sx * (a * 0.45), yc + 0.8]], { r: 1 }))
      threads.push(T([[x + sx * 0.8, yc - b], [x + sx * a, yc - b], [x + sx * a, yc - 0.8], [x + sx * (a * 0.45), yc - 0.8]], { r: 1 }))
    }
    threads.push(T([[x, yc - b + 1.2], [x, yc + b - 1.2]], { r: 0 }))
  }
  return { discs, threads, borders: [0.7, H - 0.7], plain: [] }
}
/** UPPER circle band (16.5 mm): a disc over each flange (x 0, and the divider) and two between — 4 per 120°… per 60° */
export const circUpData = (W, H) => circleBand(W, H, { x0: 0, pitch: W / 2 / 4, d: Math.min(13, H - 3.4) })
/** LOWER circle band (13.5 mm, on the curving underside): discs offset half a step (the flange ends between them) */
export const circLowData = (W, H) => circleBand(W, H, { x0: W / 2 / 8, pitch: W / 2 / 4, d: Math.min(12, H - 2.6) })

// ------------------------------------------------------------------ foot frieze (y 0 = 14 mm; 120° sector)

/** FOOT: one mask per 120° (centre under a head, divider flanges between): eye Ø ≈ 12 at 26 mm, a row of G
 *  spirals along the top, long body threads to the right of the eye, hooks under it (photo-26 foot development). */
export function footData(W) {
  const E = W / 2
  const threads = [
    T([[11.6, 0.6], [11.6, 41.2]], { r: 0 }),
    ...nose(5.6, 10.4, [35, 26, 17, 8], 6),
    // top row: a wall under a run of G spirals
    T([[13.6, 27.6], [E - 6, 27.6]], { r: 0 }),
    ...Array.from({ length: Math.floor((E - 20) / 8.2) }, (_, i) => S([18 + i * 8.2, 33.4], 7.4, 8.6, { turns: 2, start: i % 2 ? 'left' : 'bottom' })),
    // socket round the eye
    T([[16.2, 26], [16.2, 10.6], [36, 10.6], [36, 26]], { closed: true, r: 2.6 }),
    // the body: long parallel threads from the socket to the divider
    ...[11.6, 14.6, 17.6, 20.6, 23.6].map((y) => T([[38.6, y], [E - 8, y]], { r: 0 })),
    // hooks under the socket and body
    T([[13.6, 9.2], [E - 6, 9.2]], { r: 0 }),
    ...Array.from({ length: Math.floor((E - 18) / 9.4) }, (_, i) => S([18.6 + i * 9.4, 4.6], 8.4, 7.4, { turns: 1, start: i % 2 ? 'left' : 'right' })),
  ]
  return {
    threads,
    bosses: [{ c: [26.2, 18.2], d: 12, h: 2.6, crown: 0.86 }],
    plain: [circle([26.2, 18.2], 8.6, 28).map(([x, y]) => [Math.min(Math.max(x, 17.4), 34.8), Math.min(Math.max(y, 11.8), 24.8)])],
    borders: [0.7, 41.4],
    centre: 4.4,
  }
}

// ------------------------------------------------------------------ collar and shoulder (photo-28 only, dim)

/** COLLAR (≈ 5.6 mm): a run of small C-scrolls in boxes (photo-28, left of the shoulder flange) */
export function collarData(W, H) {
  const half = W / 2
  const threads = []
  const n = Math.floor(half / 8.6)
  const step = half / n
  for (let i = 0; i < n; i++) threads.push(S([step * (i + 0.5), H / 2], step - 1.2, H - 1.8, { turns: 1, start: i % 2 ? 'left' : 'right', r: 1.2 }))
  return { threads, borders: [], plain: [], centre: 0 }
}

/** SHOULDER slope (≈ 23 mm of arc): one kui per half sector facing the head — a head with a round eye beside the
 *  head's root, a long body band of two walls out to the shoulder flange with spirals in it, a crest of
 *  short threads above (photo-28: thread décor of oblique strokes and spirals, too dim to trace closely) */
export function shoulderData(W, H) {
  const half = W / 2
  const threads = [
    T([[24, 3.4], [half - 9, 3.4]], { r: 0 }),
    T([[30, 12.2], [half - 9, 12.2]], { r: 0 }),
    S([22, 9], 10, 10, { turns: 2, start: 'right' }),
    ...Array.from({ length: Math.floor((half - 46) / 12) }, (_, i) => S([38 + i * 12, 7.8], 10.4, 6.4, { turns: 1, start: i % 2 ? 'left' : 'right' })),
    ...Array.from({ length: Math.floor((half - 40) / 3) }, (_, i) => T([[34 + i * 3, 14.4], [36 + i * 3, 19.4]], { r: 0 })),
  ]
  return { threads, bosses: [{ c: [22, 9], d: 3.8, h: 1.2, crown: 0.9 }], plain: [], borders: [0.7, H - 0.7], centre: 15 }
}

// ------------------------------------------------------------------ panels

const panelOf = (kit, size, ppmm, seed) => new kit.ReliefPanel({ width: size.width, height: size.height, ppmm, seed })

export function bellyPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  renderThreads(kit, p, bellyData(size.width), { seed, ground: { pitch: 2.1, cell: [6, 16] } })
  return p.bake()
}
export function circUpPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  renderThreads(kit, p, circUpData(size.width, size.height), { seed, ground: { pitch: 1.9, cell: [4, 8], echo: 0 } })
  return p.bake()
}
export function circLowPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  renderThreads(kit, p, circLowData(size.width, size.height), { seed, ground: { pitch: 1.9, cell: [4, 8], echo: 0 } })
  return p.bake()
}
export function footPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  renderThreads(kit, p, footData(size.width), { seed, ground: { pitch: 2.0, cell: [5, 13] } })
  return p.bake()
}
export function collarPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  renderThreads(kit, p, collarData(size.width, size.height), { seed, thread: { w: 0.8, h: 0.45 }, ground: false })
  return p.bake()
}
export function shoulderPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  renderThreads(kit, p, shoulderData(size.width, size.height), { seed, ground: { pitch: 2.0, cell: [5, 12] } })
  return p.bake()
}
