// Met gui 62.217 — the décor of one 180° face, register by register, TRACED.
//
// How it was drawn: each register of front.jpg / side.jpg (full-size originals DP218261 / 62)
// was developed (unrolled) onto exactly the coordinates of its panel — x = developed mm from
// the mask's centre line (θ · r(s)), y = arc mm above the register's lower edge, the same
// Profile as the lathe — at 8 px/mm, gridded every 5 mm and read element by element
// (.work/r5-met-gui/scripts/develop.py, pgrid2.py). Every band below is a centre line read off
// those grids with its width; every leiwen window a polygon read the same way. Nothing is
// composed from a motif preset.
//
// The idiom of this piece (photograph, detail-mask.jpg): a NEAR-FLUSH Style IV/early V
// surface. The motif bands are broad, flat and only just proud (≈ 0.25 mm), told apart from
// the plain field by a sunk outline and one inner contour line; the "ground" is not
// everywhere — fine square leiwen fills closed windows between the bands, and big nested
// spirals / lozenges fill the lower field; the two convex eyes are the only high relief.
// Data are the RIGHT half (x ≥ 0, seen from outside); the left half is its mirror image.

const NOSE = 1.9 // the nose ridge (a separate low flange) covers |x| < 1.9

function makePanel(kit, size, ppmm, seed) {
  return new kit.ReliefPanel({ width: size.width, height: size.height, ppmm, seed })
}

/**
 * Render a traced face: data in half-face mm (x from the centre line, y up), mirrored.
 * data = { bands: [{ c: [[x, y]…], w: mm | [mm…], round, inner, start, end, spiral }],
 *          plates: [{ c, w, h, r }], polys: [{ pts, round }],
 *          windows: [{ pts, pitch, kind: 'leiwen' | 'lozenge' | 'nested', size }],
 *          eyes: [{ c, w, h, slit }], lines: [{ c: [[x,y]…], w }] (extra sunk lines) }
 */
function renderFace(kit, panel, data, { sy = 1, relief = 0.25, outline = 0.5, contour = 1.05, line = 0.42, depth = 0.3, seed = 0, pitch = 0.85 } = {}) {
  const W = panel.width
  if (sy !== 1) data = scaleY(data, sy)
  const els = []
  for (const side of [1, -1]) {
    const X = ([x, y]) => [W / 2 + side * x, y]
    for (const b of data.bands || []) {
      els.push(kit.roundStroke(b.c.map(X), {
        width: b.w, round: b.round ?? 0.45, inner: b.inner ?? 0.15, start: b.start ?? 'blunt', end: b.end ?? 'blunt',
        capRound: b.capRound ?? 0.35, spiral: b.spiral && { ...b.spiral, dir: (b.spiral.dir ?? 1) * side },
        startSpiral: b.startSpiral && { ...b.startSpiral, dir: (b.startSpiral.dir ?? 1) * side },
        contour: b.contour,
      }))
    }
    for (const p of data.plates || []) els.push(kit.roundPlate({ c: X(p.c), w: p.w, h: p.h, r: p.r ?? 1.5, contour: p.contour }))
    for (const p of data.polys || []) els.push(kit.roundPoly(p.pts.map(X), { round: p.round ?? 1.2, contour: p.contour }))
  }
  // 0) thin raised border lines (friezes)
  for (const [y0, y1] of data.borders || []) panel.raise((ctx) => ctx.fillRect(0, y0, W, y1 - y0), { height: relief, shoulder: 0.15, profile: 'plateau' })
  // 1) the bands, just proud, with a crisp outline groove at their foot
  if (els.length) {
    kit.carve(panel, els, { height: relief, shoulder: 0.15, depth, contour: { inset: 0.18, line: outline }, seed })
    // 2) the inner contour line
    kit.carve(panel, els.filter((e) => e.opts?.contour !== false), { raise: false, depth: depth * 0.85, contour: { inset: contour, line }, seed: seed + 1 })
  }
  // 3) extra sunk lines (dividers, the slit lines between scrolls)
  const lines = data.lines || []
  if (lines.length) {
    panel.sink((ctx) => {
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'
      for (const side of [1, -1]) for (const l of lines) {
        ctx.lineWidth = l.w ?? line
        ctx.beginPath()
        l.c.forEach(([x, y], i) => (i ? ctx.lineTo(W / 2 + side * x, y) : ctx.moveTo(W / 2 + side * x, y)))
        if (l.closed) ctx.closePath()
        ctx.stroke()
      }
    }, { depth: depth * 0.9, shoulder: 0.2, profile: 'u' })
  }
  // 4) the windows of ground: an outline groove, then leiwen (or the nested lozenge) inside it
  const wins = data.windows || []
  if (wins.length) {
    panel.sink((ctx) => {
      ctx.lineJoin = 'round'
      for (const side of [1, -1]) for (const win of wins) {
        ctx.lineWidth = outline
        ctx.beginPath()
        win.pts.forEach(([x, y], i) => (i ? ctx.lineTo(W / 2 + side * x, y) : ctx.moveTo(W / 2 + side * x, y)))
        ctx.closePath()
        ctx.stroke()
      }
    }, { depth, shoulder: 0.2, profile: 'u' })
  }
  for (const win of wins) {
    for (const side of [1, -1]) {
      const pts = win.pts.map(([x, y]) => [W / 2 + side * x, y])
      const include = (ctx) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill() }
      if (win.kind === 'lozenge') {
        kit.lozengeFill(panel, { include, avoid: 'raised', margin: win.margin ?? 0.6 }, { size: win.size ?? 19, fill: win.fill ?? 'nested', pitch: win.pitch ?? 1.0, levels: win.levels ?? 1, depth, seed: seed + 7 })
      } else {
        kit.leiwenFill(panel, { include, avoid: null, margin: win.margin ?? 0.55 }, {
          pitch: win.pitch ?? pitch, line: 0.5, depth, cell: win.cell ?? 'auto', pairs: win.pairs ?? 0.2, maxAspect: win.maxAspect ?? 1.6,
          roundness: 0.1, jitter: 0.05, hand: side > 0 ? 'right' : 'left', seed: seed + 11,
        })
      }
    }
  }
  // 4b) an all-over leiwen ground (friezes): everywhere in the rect not raised
  if (data.ground) {
    const [x0, y0, x1, y1] = data.ground.rect
    for (const side of [1, -1]) {
      const a = W / 2 + side * x0, b = W / 2 + side * Math.min(x1, W / 2)
      kit.leiwenFill(panel, { rect: { x: Math.min(a, b), y: y0, w: Math.abs(b - a), h: y1 - y0 }, avoid: 'raised', margin: 0.5 }, {
        pitch: data.ground.pitch ?? pitch, line: 0.5, depth, cell: data.ground.cell ?? 'auto', pairs: data.ground.pairs ?? 0.3,
        maxAspect: 1.8, roundness: 0.1, jitter: 0.05, hand: side > 0 ? 'right' : 'left', seed: seed + 13,
      })
    }
  }
  // 5) the eyes
  for (const e of data.eyes || []) {
    for (const side of [1, -1]) {
      kit.pillowBoss(panel, {
        c: [W / 2 + side * e.c[0], e.c[1]], w: e.w, h: e.h, round: e.round ?? 0.7, height: e.height ?? 2.4, crown: e.crown ?? 0.85,
        slit: e.slit ? { len: e.slit.len, width: e.slit.width ?? 1.0, depth: 0.7, offset: [side * (e.slit.dx ?? 0), e.slit.dy ?? 0] } : false,
        ring: false,
      })
    }
  }
}

/** the traced data were read on panels of a fixed height: stretch y to the built register */
function scaleY(d, k) {
  const P = (pts) => pts.map(([x, y]) => [x, y * k])
  return {
    ...d,
    bands: d.bands?.map((b) => ({ ...b, c: P(b.c) })),
    polys: d.polys?.map((p) => ({ ...p, pts: P(p.pts) })),
    plates: d.plates?.map((p) => ({ ...p, c: [p.c[0], p.c[1] * k], h: p.h * k })),
    lines: d.lines?.map((l) => ({ ...l, c: P(l.c) })),
    windows: d.windows?.map((w) => ({ ...w, pts: P(w.pts) })),
    eyes: d.eyes?.map((e) => ({ ...e, c: [e.c[0], e.c[1] * k], h: e.h * k })),
    ground: d.ground && { ...d.ground, rect: [d.ground.rect[0], d.ground.rect[1] * k, d.ground.rect[2], d.ground.rect[3] * k] },
    borders: d.borders?.map(([a, b]) => [a * k, b * k]),
  }
}

// ------------------------------------------------------------------------------ geometry helpers

const D2R = Math.PI / 180
const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
/** Archimedean spiral polyline, r0 (outer) → r1 (inner), `turns`, starting at angle a0 (deg), dir +1 ccw */
function spiral(c, r0, r1, turns, a0 = 0, dir = 1) {
  const n = Math.max(12, Math.round(turns * 36))
  const out = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = (a0 + dir * 360 * turns * t) * D2R, r = r0 + (r1 - r0) * t
    out.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)])
  }
  return out
}
function ellipse(c, rx, ry, n = 40) {
  const out = []
  for (let i = 0; i <= n; i++) { const a = (2 * Math.PI * i) / n; out.push([c[0] + rx * Math.cos(a), c[1] + ry * Math.sin(a)]) }
  return out
}
const L = (c, w) => ({ c, w })

// ------------------------------------------------------------------------------ main mask

/**
 * Belly mask, y 38.6 → 85.5 (arc 56.3 mm; décor from y ≈ 0.8 to 53.2 of the panel).
 * Traced off front.jpg developed (A-mask.png, 8 px/mm; quadrant grids q1–q5) for x ≤ 81;
 * beyond, toward the handle at x ≈ 126, the photograph is foreshortened past reading and side.jpg
 * could only be developed to ±3 mm: the handle half-mask there (marked APPROX) is laid out from
 * side.jpg by eye.
 */
export const MASK = {
  polys: [
    // B: the column beside the nose ridge (narrow top, two C curls)
    { pts: [[6.0, 51.6], [9.9, 51.6], [9.9, 30.4], [2.9, 30.4], [2.9, 45.0], [6.0, 45.6]], round: 1.2 },
    // C: frame round leiwen window W1
    { pts: rect(11.4, 30.3, 25.0, 52.0), round: 1.6, contour: false },
    // D: the brow block (U ticks, two curls, hooks), leiwen window W2 at its right
    { pts: rect(25.6, 32.4, 50.2, 51.8), round: 3.0 },
    // E: the horn block: a G groove rolling into a spiral; leiwen window W3 inside
    { pts: rect(50.4, 36.4, 71.0, 53.2), round: 3.5 },
    // frame of the outer leiwen block W5
    { pts: rect(71.6, 35.9, 81.3, 53.6), round: 1.2, contour: false },
    // body band under the horn row
    { pts: rect(24.6, 30.5, 81.5, 33.8), round: 1.0, contour: false },
    // F, G: the column below the nose: a slotted plate, a curl plate
    { pts: rect(2.6, 15.6, 9.4, 28.2), round: 2.2 },
    { pts: rect(2.8, 0.9, 9.6, 13.3), round: 3.0 },
    // H: the jaw — a big hooked plate whose left edge slants, a nested spiral and a rolled curl
    { pts: [[13.4, 16.4], [33.6, 16.4], [33.6, 0.9], [10.8, 0.9], [11.2, 12.8]], round: [2, 2, 2, 2, 3] },
    // lower field: two S-scroll plates beside the lozenge
    { pts: rect(34.6, 14.8, 42.4, 20.2), round: 2.2 },
    { pts: rect(34.8, 2.6, 42.2, 12.6), round: 3.0 },
    // APPROX — handle half-mask (x 82 → 126; the handle tab covers 120–126)
    { pts: rect(82.4, 30.6, 92.0, 53.0), round: 2.0 },
    { pts: rect(94.6, 34.2, 113.0, 52.6), round: 3.5 },
    { pts: rect(83.0, 14.8, 120.0, 18.0), round: 1.0, contour: false },
  ],
  bands: [
    // the comma row along the eye line (q4, q5): each unit an open C band (≈ 6.6 × 7.4, band 1.9)
    // whose lower arm turns back up into the centre, holding a small curl; pitch 7.5
    ...[37.0, 44.5, 52.0, 59.5, 67.0, 74.5, 86.5, 94.0].map((x) => ({
      c: [[x + 2.4, 28.2], [x - 2.4, 28.2], [x - 2.4, 22.6], [x + 2.4, 22.6], [x + 2.4, 25.0]], w: 1.9, round: 0.8, inner: 0.3, end: 'round', contour: false,
    })),
  ],
  lines: [
    // B curls
    L(spiral([6.9, 41.8], 2.4, 0.5, 1.15, 20, 1), 0.5), L(spiral([6.9, 35.0], 2.6, 0.5, 1.15, 20, 1), 0.5),
    L([[7.6, 51.0], [7.6, 47.6]], 0.45),
    // D: the U ticks, two curls, the hooks at top right
    L([[30.4, 49.2], [30.4, 45.0], [31.4, 44.2], [32.4, 45.0], [32.4, 49.2]], 0.5),
    L(spiral([29.3, 37.4], 2.6, 0.5, 1.3, 70, 1), 0.5), L(spiral([35.0, 38.0], 2.8, 0.5, 1.3, 250, 1), 0.5),
    L([[27.6, 46.0], [27.6, 39.6]], 0.5),
    L([[36.5, 49.2], [41.8, 49.2], [42.6, 48.2]], 0.5), L([[36.0, 45.6], [40.2, 45.6], [40.2, 43.8]], 0.5),
    L(spiral([47.6, 49.4], 1.9, 0.4, 1.1, 180, -1), 0.45),
    // E: the G groove and its spiral
    L([[51.6, 38.4], [69.2, 38.4], [69.2, 51.8], [62.0, 51.8]], 0.5),
    L([[54.4, 52.6], [54.4, 42.0], [66.6, 42.0], [66.6, 47.5]], 0.5),
    L(spiral([63.4, 47.4], 3.2, 0.5, 1.6, 0, 1), 0.5),
    // F slot, G curl
    L([[5.5, 26.6], [5.5, 17.8], [6.6, 16.9], [7.8, 17.8], [7.8, 26.6]], 0.6),
    L(spiral([6.4, 7.4], 2.6, 0.5, 1.4, 90, 1), 0.5),
    // H: the rolled curl at the jaw's right end
    L(spiral([29.6, 8.4], 3.9, 0.5, 2.0, 90, -1), 0.5),
    // the comma row: one spiral in each C
    ...[37.0, 44.5, 52.0, 59.5, 67.0, 74.5, 86.5, 94.0].map((x) => L(spiral([x + 0.2, 25.4], 1.3, 0.3, 1.1, 0, 1), 0.42)),
    // S scrolls of the lower field
    L(spiral([38.5, 17.5], 1.8, 0.4, 1.0, 0, 1), 0.45), L(spiral([38.5, 7.6], 2.8, 0.5, 1.4, 90, -1), 0.5),
    // eye socket outline
    L(ellipse([20.3, 23.2], 7.9, 6.4), 0.55),
    // APPROX handle half-mask: column curls, horn spiral, small eye socket
    L(spiral([87.2, 46.0], 2.8, 0.5, 1.2, 20, 1), 0.5), L(spiral([87.2, 37.0], 2.8, 0.5, 1.2, 20, 1), 0.5),
    L([[96.6, 36.4], [111.0, 36.4], [111.0, 50.6], [104.0, 50.6]], 0.5),
    L(spiral([104.0, 44.0], 4.4, 0.5, 2.0, 0, 1), 0.5),
    L(ellipse([110.5, 10.2], 5.2, 4.3), 0.5),
  ],
  windows: [
    { pts: rect(12.8, 31.2, 24.4, 51.0), cell: [5, 7], pairs: 0.4 }, // W1
    { pts: rect(41.0, 33.3, 48.6, 45.7), cell: [3.6, 5], pairs: 0.3 }, // W2
    { pts: rect(56.6, 44.5, 60.5, 52.6), cell: [3, 4], pairs: 0 }, // W3
    { pts: rect(49.0, 33.9, 71.0, 35.9), pitch: 0.62, cell: [1.8, 2.4], pairs: 0 }, // W4: the strip of tiny spirals
    { pts: rect(72.4, 36.6, 80.6, 53.0), cell: [7, 9], pairs: 0, maxAspect: 1.3 }, // W5
    { pts: rect(14.2, 1.6, 25.8, 14.8), cell: [11, 13.5], pairs: 0, maxAspect: 1.5 }, // W6: the jaw's big nested spiral
    { pts: [[43.0, 1.2], [80.0, 1.2], [80.0, 13.9], [43.0, 13.9]], kind: 'lozenge', size: 19, pitch: 1.0, levels: 1 }, // G3 lozenge
    // APPROX handle half-mask grounds
    { pts: rect(113.6, 34.2, 120.5, 52.6), cell: [5, 7], pairs: 0 },
    { pts: rect(82.4, 1.2, 120.5, 13.6), cell: [4.5, 7], pairs: 0.3 },
    { pts: rect(100.0, 19.4, 120.5, 30.0), cell: [4.5, 7], pairs: 0.3 },
  ],
  eyes: [
    // pillow eye 14.0 × 11.0 at x 20.3, y 23.2; slit 4.4 × 1.2 mm, 1.6 below centre (q4)
    { c: [20.3, 23.6], w: 14.0, h: 11.4, round: 0.92, height: 3.0, crown: 1, slit: { len: 4.4, width: 1.2, dx: 0.7, dy: -1.6 } },
    // APPROX: the small eye of the handle half-mask (side.jpg)
    { c: [110.5, 10.2], w: 8.6, h: 7.0, round: 0.75, height: 1.8, crown: 0.85, slit: { len: 2.6, width: 0.9, dx: 0, dy: -0.8 } },
  ],
}

export function maskPanel(kit, size, { ppmm, seed }) {
  const panel = makePanel(kit, size, ppmm, seed)
  renderFace(kit, panel, MASK, { seed, sy: size.height / 56.35 })
  return panel.bake()
}

// ------------------------------------------------------------------------------ neck frieze

/**
 * Dragon frieze, y 85.5 → 101.6 (arc 16.3; units between y 1.3 and 12.4), traced off A-neck.png
 * (grids n1, n2) for x ≤ 80; the units repeat their rhythm (window | squared spiral body) to the
 * handle. x 0–6.5 is the sculpted frontal head (sculpture.js), the frieze runs on leiwen.
 */
export const FRIEZE = {
  polys: [{ pts: rect(6.4, 1.4, 9.2, 12.2), round: 1.2 }],
  bands: [
    { c: [[17.2, 11.8], [17.2, 5.0], [21.0, 3.4], [24.8, 5.0], [24.8, 11.8]], w: 3.2, round: 0.6, inner: 0.2 }, // U curl
    { c: [[27.2, 5.6], [31.0, 3.6], [40.5, 3.6], [40.5, 11.4], [34.0, 11.4]], w: 3.0, round: 0.55, inner: 0.15 }, // body out of the eye
    { c: [[47.0, 1.8], [47.0, 11.8], [61.0, 11.8], [61.0, 3.8], [52.0, 3.8], [52.0, 8.4], [57.4, 8.4], [57.4, 6.2]], w: 2.8, round: 0.55, inner: 0.15 },
    { c: [[80.0, 12.0], [70.8, 12.0], [70.8, 3.8], [78.5, 3.8], [78.5, 9.0], [73.8, 9.0], [73.8, 6.8]], w: 2.8, round: 0.55, inner: 0.15 },
    { c: [[88.0, 1.8], [88.0, 11.8], [100.0, 11.8], [100.0, 3.8], [92.6, 3.8], [92.6, 8.4], [97.0, 8.4], [97.0, 6.4]], w: 2.8, round: 0.55, inner: 0.15 },
    { c: [[118.0, 12.0], [108.0, 12.0], [108.0, 3.8], [116.0, 3.8], [116.0, 9.0], [111.2, 9.0], [111.2, 6.8]], w: 2.8, round: 0.55, inner: 0.15 },
  ],
  lines: [L([[7.8, 11.0], [7.8, 7.2], [7.0, 6.6]], 0.45), L([[7.8, 2.6], [7.8, 5.4]], 0.45)],
  ground: { rect: [1.0, 1.2, 126, 12.5], cell: [3.5, 5.5], pairs: 0.3, pitch: 0.8 },
  eyes: [{ c: [28.6, 8.8], w: 3.8, h: 3.5, round: 0.9, height: 1.3, crown: 0.9 }],
  borders: [[0, 1.2], [12.6, 13.6]],
}
export function friezePanel(kit, size, { ppmm, seed }) {
  const panel = makePanel(kit, size, ppmm, seed)
  renderFace(kit, panel, FRIEZE, { seed, sy: size.height / 16.33, relief: 0.35 })
  return panel.bake()
}

// ------------------------------------------------------------------------------ rising blades

/**
 * Rising blades, y 101.6 → 111.4: 14 per face (pitch 17.15 developed at r 76.4), one on the centre
 * line; bases touching at y 0.6, apexes at y 9.6 (n1, n2). Each blade: outline + inner contour, two
 * round spirals over its base and one above them; the inverted triangles between are plain.
 */
const BP = 240.1 / 14
export const BLADES = {
  polys: [...Array(8)].map((_, k) => ({ pts: [[k * BP - BP / 2 + 0.5, 0.6], [k * BP + BP / 2 - 0.5, 0.6], [k * BP, 9.6]], round: [0.15, 0.15, 1.2] })),
  lines: [...Array(8)].flatMap((_, k) => [
    L(spiral([k * BP - 2.8, 3.2], 1.9, 0.35, 1.2, 0, 1), 0.42), L(spiral([k * BP + 2.8, 3.2], 1.9, 0.35, 1.2, 180, -1), 0.42),
    L(spiral([k * BP, 5.9], 1.4, 0.3, 1.0, 90, 1), 0.4),
  ]),
}
export function bladePanel(kit, size, { ppmm, seed }) {
  const panel = makePanel(kit, size, ppmm, seed)
  renderFace(kit, panel, BLADES, { seed, contour: 0.9, sy: size.height / 9.93 })
  return panel.bake()
}

// ------------------------------------------------------------------------------ foot frieze

/**
 * Foot frieze, y 21.6 → 35.6 (arc 14; units y 0.8–13): a short ridge at 0° and 90° (flanges), and
 * in each quarter (93 mm) two dragons facing those ridges (detail-foot-band.jpg, A-foot.png f1):
 * squared head block, small eye, nested body band, tail rolled into a big round spiral at mid-quarter.
 */
const FQ = Math.PI * 59.19 / 2
function footDragon(mirror) {
  const X = (x) => (mirror ? FQ - x : x)
  const P = (pts) => pts.map(([x, y]) => [X(x), y])
  return {
    polys: [{ pts: P(rect(2.6, 1.0, 9.0, 12.6)), round: 1.6 }, { pts: P(rect(32.0, 1.4, 43.2, 12.4)), round: 4.4 }],
    bands: [{ c: P([[14.2, 10.6], [29.6, 10.6], [29.6, 3.2], [16.2, 3.2], [16.2, 7.0], [26.0, 7.0]]), w: 2.0, round: 0.5, inner: 0.12 }],
    lines: [L(spiral([X(5.8), 6.8], 2.6, 0.4, 1.4, 0, mirror ? -1 : 1), 0.45), L(spiral([X(37.6), 6.9], 4.4, 0.5, 2.3, 90, mirror ? 1 : -1), 0.5)],
    eyes: [{ c: [X(11.8), 7.2], w: 3.4, h: 3.2, round: 0.9, height: 1.2, crown: 0.9 }],
  }
}
const FD = [footDragon(false), footDragon(true)]
export const FOOT = {
  polys: FD.flatMap((d) => d.polys), bands: FD.flatMap((d) => d.bands), lines: FD.flatMap((d) => d.lines), eyes: FD.flatMap((d) => d.eyes),
  ground: { rect: [1.2, 0.8, FQ * 2, 13.2], cell: [3.5, 5.5], pairs: 0.3, pitch: 0.8 },
  borders: [[0, 0.7], [13.3, 14.0]],
}
export function footPanel(kit, size, { ppmm, seed }) {
  const panel = makePanel(kit, size, ppmm, seed)
  renderFace(kit, panel, FOOT, { seed, sy: size.height / 14.0 })
  return panel.bake()
}

export { NOSE }
