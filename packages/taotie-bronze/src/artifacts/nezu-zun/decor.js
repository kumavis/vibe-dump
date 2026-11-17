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

import { echoThreads, spiral, hookLine } from './echo.js'

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
  const tw = o.thread?.w ?? 1.0
  const th = o.thread?.h ?? 0.7
  const sides = data.single ? [1] : [1, -1]
  const X = (side) => ([x, y]) => [W / 2 + side * x, y]
  const polys = []
  for (const side of sides) for (const t of data.threads || []) polys.push({ pts: rounded(kit, t.c.map(X(side)), t.r ?? 1.2, !!t.closed), closed: !!t.closed, w: t.w ?? tw })
  // 1) every line in ONE call (one EDT). The Nezu zun's line work is RAISED thread relief at about half duty: light
  //    threads ≈ 1 mm wide at a ≈ 2.1 mm pitch, the narrow gaps between them dark with shadow and dirt (photo-26's
  //    circle band shows the highlight on each thread unambiguously); mode 'sunk' cuts them instead
  const sunk = (o.mode ?? 'thread') === 'sunk'
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
      kit.pillowBoss(panel, { c, w: d.d, h: d.d, round: 1, height: d.h ?? 1.4, crown: d.crown ?? 0.3, slit: false, ring: false })
    }
    for (const b of data.bosses || []) {
      const c = X(side)(b.c)
      kit.pillowBoss(panel, { c, w: b.d, h: b.dh ?? b.d, round: 1, height: b.h ?? 3.2, crown: b.crown ?? 0.85, slit: false, ring: false })
    }
  }
  // 3) small threads ON the discs (their inner ring and crescent): added after the domes
  const onTop = []
  for (const side of sides) for (const d of data.discs || []) {
    if (d.ring !== false) onTop.push({ pts: circle(X(side)([d.c[0], d.c[1] + d.d * 0.04]), d.d * 0.13, 24), closed: true })
    if (d.crescent !== false) {
      // three comma hooks round the rim (a whorl), each a short arc curling inward
      const c = X(side)(d.c), R = d.d * 0.33
      for (let k = 0; k < 3; k++) {
        const a0 = Math.PI * (1.5 + (2 * k) / 3) * side
        const arc = []
        for (let i = 0; i <= 10; i++) { const a = a0 + side * 1.1 * (i / 10); const rr = R * (1 - 0.18 * (i / 10)); arc.push([c[0] + rr * Math.cos(a), c[1] + rr * Math.sin(a)]) }
        onTop.push({ pts: arc, closed: false })
      }
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
        mode: sunk ? 'sunk' : 'thread', depth: th, pitch: g.pitch ?? 2.1, line: g.line ?? 0.48, cell: g.cell ?? [7, 16], pairs: g.pairs ?? 0.3,
        maxAspect: g.maxAspect ?? 2.8, roundness: g.roundness ?? 0.55, jitter: 0.06, echo: g.echo ?? 2, follow: 1, hand: part.hand,
        seed: (o.seed ?? 0) + 7, fillers: true,
      })
    }
  }
}

// ------------------------------------------------------------------ helpers for data

const T = (c, o = {}) => ({ c, ...o })
const S = (c, w, h, o = {}) => rectSpiral(c, w, h, o)

// ------------------------------------------------------------------ belly (y 0 = 114 mm; one 120° sector, centre = a head)
//
// Fix pass r8: TRACED AGAIN off photo-26 developed onto the panel (.work/r8-zun-fix/trace/t0.png, t1.png: x = mm from
// the head-centre flange — the development's own x is offset by 8.3 mm, the midpoint of the two eyes — y = arc mm above
// the register's foot; 60 mm tall) and, for the small mask on the divider, photo-28's development (.work/r8-zun/dev/
// m28c.png, x from its flange). Drawn as SEEDS for the echo renderer (echo.js): the threads are the lines parallel to
// these at the 2.1 mm pitch, so the field is filled edge to edge the way the bronze is.

/** BELLY seeds, right half (x ≥ 0 from the head-centre flange; E = W/2 = the divider, the small mask's centre) */
export function bellyEcho(W, H) {
  const E = W / 2
  const sp = (c, R, o) => spiral(c, R, { pitch: 2.1, ...o })
  const seeds = [
    // borders
    [[0, 0.8], [E, 0.8]], [[0, H - 0.8], [E, H - 0.8]],
    // nose column beside the flange: its wall and a stack of hooks curling up
    [[15.5, 1.2], [15.5, 36.4]],
    ...[4.6, 11.6, 18.6, 25.6, 32.4].map((y) => hookLine([8.4, y - 1.2], [12.2, y], 2, 1, 0.9)),
    sp([12.6, 44], [2.8, 4.6], { a0: 270, dir: -1, sq: 0.3 }),
    sp([12.6, 53], [2.6, 2.6], { a0: 270, dir: -1 }),
    // upper-band divider (the horn's foot), rising a little toward the divider flange
    [[9, 37.2], [30, 37.6], [60, 38.1], [106, 39.1], [E - 36, 39.3]],
    // the eye socket: a C round the left of the eye, its foot curling under
    [[27.5, 36.2], [21, 35.2], [18.6, 31], [18.6, 17], [20.6, 13], [27, 12], [29.4, 13.8]],
    // the line under the eye sweeping out and up into the mid divider (photo-26: a wavy line, not a box)
    [[24, 14.4], [28.4, 16.6], [36, 17.1], [44, 17.5], [50, 19.6], [54, 20.9], [62, 21], [106, 21.3], [E - 36, 21.4]],
    // the socket's right side: slanting lines rising from the eye's lower outer corner
    [[50, 19.6], [52.6, 28], [54.6, 38]],
    // horn: two rounded-square spirals on the eye and a narrow one at its root, under frame lines
    sp([33, 44.6], [6.6, 5.2], { a0: 180, dir: -1, sq: 0.45 }),
    sp([45.6, 44.6], [6.4, 5.2], { a0: 0, dir: 1, sq: 0.45 }),
    sp([22.4, 45], [2.6, 4.2], { a0: 270, dir: 1, sq: 0.3 }),
    // jaw: a hooked spiral and a small coil under the eye
    sp([41, 7.6], [4.4, 4], { a0: 90, dir: 1, sq: 0.2 }),
    sp([31, 4.6], [3.2, 3], { a0: 0, dir: -1 }),
    hookLine([18.6, 9.4], [26, 9.6], 1.8, 1, 0.8),
    // upper band: a spiral, then slanting quills ending in small curls (photo-26 x 68–86)
    sp([64, 47.6], [6.4, 6], { a0: 180, dir: -1, sq: 0.35 }),
    ...[69.6, 73.8, 78, 82.2].map((x) => hookLine([x + 5.4, H - 1.4], [x + 0.5, 41.6], 1.6, -1, 0.9)),
    // the big rounded-square spiral over the small mask (photo-28: u ≈ −59 from the divider)
    sp([E - 48, 48.6], [11.6, 9.4], { a0: 180, dir: 1, sq: 0.6 }),
    // body band: a big round spiral by the socket, a G hook, small coils, then long lines to the small mask
    sp([62, 27.2], [7, 6.4], { a0: 90, dir: 1, sq: 0.35 }),
    sp([77, 29.4], [4.4, 4.2], { a0: 270, dir: -1, sq: 0.45 }),
    sp([88.6, 31.2], [2.6, 2.4], { a0: 270, dir: -1 }),
    sp([96, 31.6], [2.2, 2.2], { a0: 270, dir: -1 }),
    // lower band: a row of comma hooks whose tails slant down to the right; two big coils toward the divider
    ...[56, 63, 70, 77, 84].map((x) => hookLine([x + 4.4, 1.8], [x, 12.6], 2.3, -1, 0.9)),
    sp([93, 7.4], [4.4, 4.4], { a0: 90, dir: -1, sq: 0.3 }),
    sp([103, 6.8], [4.2, 4.2], { a0: 90, dir: 1, sq: 0.3 }),
    // SMALL MASK (photo-28, x from the divider): the seam with the large mask, two squared spirals above a low eye,
    // a socket line, hooks under it and a nose column beside the flange
    [[E - 38.2, 22], [E - 38.2, H - 1.2]],
    sp([E - 30.6, 33.4], [6.2, 5.2], { a0: 180, dir: -1, sq: 0.6 }),
    sp([E - 17.4, 47.8], [6.2, 6.6], { a0: 0, dir: 1, sq: 0.6 }),
    [[E - 44, 26], [E - 44, 9.6], [E - 40, 6.6], [E - 22, 6.6]],
    ...[E - 40, E - 32.6, E - 25.2].map((x) => hookLine([x, 2.6], [x + 4.6, 3.4], 1.5, 1, 0.8)),
    [[E - 11.2, 1.2], [E - 11.2, H - 1.2]],
    ...[6, 14.4, 22.8, 31.2, 39.6, 48].map((y) => hookLine([E - 7.4, y - 1.2], [E - 9.8, y], 1.6, -1, 0.8)),
  ]
  return {
    seeds,
    rings: [{ c: [39.5, 26.5], r: 11.2 }, { c: [E - 31, 16.6], r: 7.4 }],
    plainCircles: [{ c: [39.5, 26.5], r: 10.3 }, { c: [E - 31, 16.6], r: 6.5 }],
    // the plain land inside the socket's C, left of the eye (photo-26: no line work there)
    plain: [[[20.6, 15.6], [27.6, 14.6], [29.6, 18], [29.6, 33.4], [21, 33.2], [20.6, 30]]],
    bosses: [
      { c: [39.5, 26.5], d: 19.6, h: 2.6, crown: 0.62 },
      { c: [E - 31, 16.6], d: 12, h: 1.9, crown: 0.62 },
    ],
    centre: 6.2,
  }
}

// ------------------------------------------------------------------ circle bands

/** discs every `pitch` mm from `x0` (0 = on the centre line), each a low flat dome with a raised rim bearing a whorl
 *  (a ring and three crescents: detail-circles.jpg / the developed band cu2.png); between them fat round hooks drawn
 *  as single threads (maxRings 0: no echo lines, the band is too narrow for them) */
function circleBand(W, H, { x0, pitch, d }) {
  const half = W / 2
  const discs = []
  const seeds = [[[0, 0.6], [half, 0.6]], [[0, H - 0.6], [half, H - 0.6]]]
  const rings = []
  const yc = H / 2
  for (let x = x0; x <= half + 0.01; x += pitch) {
    discs.push({ c: [x, yc], d })
    rings.push({ c: [x, yc], r: d / 2 - 0.3 }) // the disc's raised rim thread
  }
  const r = H * 0.11
  for (let x = x0 + pitch / 2; x <= half + 0.01; x += pitch) {
    const a = Math.min(pitch * 0.2, H * 0.36)
    // (face-circles, flattened): a small ring in the middle, a hook over it curling down and one under it curling up,
    // and a tall comma against each disc
    rings.push({ c: [x, H * 0.5], r: H * 0.15 })
    seeds.push(hookLine([x + a * 0.6, H * 0.86], [x - a * 0.25, H * 0.86], r * 1.3, 1, 1.0)) // over it, rolling down to the left
    seeds.push(hookLine([x - a * 0.6, H * 0.14], [x + a * 0.25, H * 0.14], r * 1.3, 1, 1.0)) // under it, rolling up to the right
    for (const s of [-1, 1]) {
      seeds.push(hookLine([x + s * pitch * 0.3, H * 0.2], [x + s * pitch * 0.3, H * 0.66], r * 0.95, s, 0.9)) // against the disc
      // the crowd: hooks dropping from the top corners and rising from the bottom ones
      seeds.push(hookLine([x + s * a * 1.1, H * 0.82], [x + s * a * 1.0, H * 0.58], r * 0.7, -s, 0.85))
      seeds.push(hookLine([x - s * a * 1.1, H * 0.18], [x - s * a * 1.0, H * 0.42], r * 0.7, -s, 0.85))
    }
  }
  return { discs, seeds, rings, maxRings: 0, plainCircles: discs.map((q) => ({ c: q.c, r: q.d / 2 - 0.9 })) }
}
/** UPPER circle band (16.5 mm): a disc over each flange and on a 32.6 mm pitch between (measured ≈ 32–34 mm),
 *  so the divider falls half way between two discs and the band mirrors there; discs fill ≈ 93 % of the band */
export const circUpData = (W, H) => circleBand(W, H, { x0: 0, pitch: W / 2 / 4.5, d: H * 0.93 })
/** LOWER circle band (13.5 mm, on the curving underside): the same pitch, offset half a step */
export const circLowData = (W, H) => circleBand(W, H, { x0: W / 2 / 9, pitch: W / 2 / 4.5, d: H * 0.93 })

// ------------------------------------------------------------------ foot frieze (y 0 = 14 mm; 120° sector)

/** FOOT seeds: one mask per 120° (centre under a head, divider flanges between): eye Ø ≈ 12 at 26 mm, low; a row of
 *  rounded G spirals along the top; long body lines (the echo of the dividers) running out to the divider and
 *  curling at their ends; hooks underneath (photo-26 foot development) */
export function footEcho(W, H) {
  const E = W / 2
  const seeds = [
    [[0, 0.8], [E, 0.8]], [[0, H - 0.8], [E, H - 0.8]],
    [[11.4, 1.2], [11.4, H - 1.2]],
    ...[6, 14, 22, 30, 37].map((y) => hookLine([6, y - 1], [9, y], 1.6, 1, 0.8)),
    // top row divider, sagging a little toward the divider flange
    [[11.4, 28.6], [40, 28.4], [E - 8, 27.6]],
    ...Array.from({ length: Math.floor((E - 22) / 8.6) }, (_, i) => spiral([18.6 + i * 8.6, 34.6], [3.7, 4.4], { pitch: 2, a0: i % 2 ? 0 : 180, dir: i % 2 ? 1 : -1, sq: 0.3 })),
    // eye socket line under the eye, sweeping into the lower divider
    [[16, 22], [16.6, 12], [22, 9.4], [40, 9.6], [E - 8, 9.8]],
    // body: curling ends of the long lines near the divider and by the eye
    spiral([E - 15, 18.6], [4.2, 4.6], { pitch: 2, a0: 90, dir: -1, sq: 0.3 }),
    spiral([44, 18.6], [3.6, 3.8], { pitch: 2, a0: 270, dir: -1, sq: 0.3 }),
    // hooks along the bottom
    ...Array.from({ length: Math.floor((E - 20) / 9.4) }, (_, i) => hookLine([16 + i * 9.4, 2.4], [20 + i * 9.4, 6.8], 1.6, i % 2 ? 1 : -1, 0.8)),
  ]
  return {
    seeds,
    rings: [{ c: [26.2, 17.4], r: 7.2 }],
    plainCircles: [{ c: [26.2, 17.4], r: 6.4 }],
    bosses: [{ c: [26.2, 17.4], d: 12, h: 1.9, crown: 0.62 }],
    centre: 4.6,
  }
}

/** render an echo spec (right-half data) into a full-sector panel, mirrored about its centre line; bosses, discs and
 *  their whorls after */
export function renderEcho(kit, panel, data, o = {}) {
  const W = panel.width, Hh = panel.height, c = W / 2
  const sh = (pts) => pts.map(([x, y]) => [c + x, y])
  const cg = data.centre ?? 0
  echoThreads(kit, panel, {
    seeds: data.seeds.map(sh),
    rings: (data.rings || []).map((r) => ({ ...r, c: [c + r.c[0], r.c[1]] })),
    plainCircles: (data.plainCircles || []).map((r) => ({ ...r, c: [c + r.c[0], r.c[1]] })),
    plain: (data.plain || []).map(sh),
    plainRects: cg > 0 ? [[c - cg, 0, 2 * cg, Hh], [0, 0, cg, Hh], [W - cg, 0, cg, Hh]] : [],
    mirror: c,
  }, { pitch: o.pitch ?? 2.1, w: o.w ?? 1.22, h: o.h ?? 0.75, maxRings: data.maxRings })
  const X = (side) => ([x, y]) => [c + side * x, y]
  for (const side of [1, -1]) {
    for (const b of data.bosses || []) kit.pillowBoss(panel, { c: X(side)(b.c), w: b.d, h: b.dh ?? b.d, round: 1, height: b.h ?? 2.6, crown: b.crown ?? 0.6, slit: false, ring: false })
    for (const d of data.discs || []) kit.pillowBoss(panel, { c: X(side)(d.c), w: d.d, h: d.d, round: 1, height: d.h ?? 1.1, crown: d.crown ?? 0.2, slit: false, ring: false })
  }
  // the whorl ON each disc, thin threads added on the dome
  if (data.discs?.length) {
    const tw = (o.w ?? 1.0) * 0.85
    panel.add((ctx) => {
      ctx.lineCap = 'round'; ctx.lineWidth = tw
      for (const side of [1, -1]) for (const d of data.discs) {
        const [cx, cy] = X(side)(d.c), r = d.d / 2
        // the whorl (detail-circles): a small ring a little off centre and three crescents round it, each a short arc
        // opening toward the centre
        ctx.beginPath(); ctx.arc(cx - r * 0.08, cy + r * 0.04, r * 0.2, 0, Math.PI * 2); ctx.stroke()
        for (let k = 0; k < 3; k++) {
          const t = [0.3, 1, 1.55][k] * Math.PI
          const qx = cx + Math.cos(t) * r * 0.56, qy = cy + Math.sin(t) * r * 0.56
          ctx.beginPath(); ctx.arc(qx, qy, r * 0.22, t - Math.PI * 0.55, t + Math.PI * 0.55); ctx.stroke()
        }
      }
    }, { height: 0.42, shoulder: tw * 0.45, profile: 'plateau' })
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
  renderEcho(kit, p, bellyEcho(size.width, size.height), { seed })
  return p.bake()
}
export function circUpPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  renderEcho(kit, p, circUpData(size.width, size.height), { seed, pitch: 1.7, w: 1.25, h: 0.6 })
  return p.bake()
}
export function circLowPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  renderEcho(kit, p, circLowData(size.width, size.height), { seed, pitch: 1.7, w: 1.15, h: 0.6 })
  return p.bake()
}
export function footPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  renderEcho(kit, p, footEcho(size.width, size.height), { seed, pitch: 2.0, w: 0.95, h: 0.6 })
  return p.bake()
}
export function collarPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  renderThreads(kit, p, collarData(size.width, size.height), { seed, thread: { w: 0.8, h: 0.45 }, ground: false })
  return p.bake()
}
export function shoulderPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  renderThreads(kit, p, shoulderData(size.width, size.height), { seed, thread: { w: 0.8, h: 0.4 }, ground: { pitch: 1.8, cell: [5, 12] } }) // fix pass r8: low and fine (dark and narrow on the photographs)
  return p.bake()
}
