// Nezu you 饕餮文卣 (90086) — the décor, TRACED.
//
// How it was drawn: photo-31 (head-on at the pivot face) was developed onto each register's own panel
// coordinates — x = developed mm from the face's centre line (θ · r(s), round plan, the lathe's 'true' map),
// y = arc mm above the register's lower edge — through the camera fitted to the photograph's outline
// (reference/nezu-you/faces.json points; .work/r8-you/develop.py), gridded every 5 mm and read element by
// element. Every band below is a centre line read off those grids with its width (mm) at each control point.
// The outer third of each half (beyond ≈ 110 mm of arc, where photo-31 turns away) is read off photo-32.
//
// The idiom (photo-31/32): HIGH, FAT relief. The belly mask's bands are 6–9 mm wide and stand ≈ 3 mm proud
// with rounded shoulders and one sunk contour line, the horn is a G of a rounded-square frame round a curl
// block with a deep dark pocket, the eyes are big round domed bosses (≈ 36 mm, ≈ 6 mm high) with a round
// hollow pupil, and every gap is filled with fine leiwen (≈ 1.2 mm pitch: the scale of the whole model rests
// on it, dossier §b.2). The friezes are the same hand at half the height. Data are the RIGHT half (x ≥ 0,
// seen from outside); the left half is its mirror image.

/**
 * Render traced data into a panel, mirrored about W/2.
 * data = { bands: [{ c: [[x, y]…], w, round?, inner?, start?, end?, spiral?, startSpiral?, fill?, contour? }],
 *          plates: [{ c, w, h, r, fill? }], eyes: [{ c, w, h, height?, pupil?, ring? }],
 *          lines: [{ c: [[x, y]…], w, closed? }] (sunk), borders: [[y0, y1]…] (raised full-width lines),
 *          noGround: [[x0, y0, x1, y1]…] (rects kept plain), centre: mm kept plain at the centre line }
 */
export function renderTrace(kit, panel, data, o = {}) {
  const W = panel.width
  const height = o.height ?? 2.6
  const depth = o.depth ?? 0.42
  const els = []
  const sides = data.single ? [1] : [1, -1]
  const ox = data.single ? 0 : W / 2 // single: data in panel x, unmirrored
  for (const side of sides) {
    const X = ([x, y]) => [ox + side * x, y]
    const sp = (s) => s && { ...s, dir: (s.dir ?? 1) * side }
    for (const b of data.bands || []) {
      els.push(kit.roundStroke(b.c.map(X), {
        width: b.w, round: b.round ?? 0.55, inner: b.inner ?? 0.18, start: b.start ?? 'blunt', end: b.end ?? 'blunt',
        capRound: b.capRound ?? 0.4, spiral: sp(b.spiral), startSpiral: sp(b.startSpiral),
        ...(b.fill !== undefined ? { fill: b.fill } : {}), ...(b.contour !== undefined ? { contour: b.contour } : {}),
      }))
    }
    for (const p of data.plates || []) {
      els.push(kit.roundPlate({ c: X(p.c), w: p.w, h: p.h, r: p.r ?? 3, ...(p.fill ? { fill: p.fill } : {}), ...(p.contour !== undefined ? { contour: p.contour } : {}) }))
    }
  }
  // 0) raised border lines (register edges, bowstrings)
  for (const [y0, y1] of data.borders || []) {
    panel.raise((ctx) => ctx.fillRect(0, y0, W, y1 - y0), { height: o.borderHeight ?? height * 0.45, shoulder: (y1 - y0) * 0.45, profile: 'plateau' })
  }
  // 1) the bands: fat, proud, rounded shoulders, a contour line inside the edge
  if (els.length) {
    kit.carve(panel, els, {
      height, shoulder: o.shoulder ?? height * 0.55, depth, seed: o.seed ?? 0, irregularity: 1.2,
      contour: o.contour ?? { inset: Math.max(0.8, height * 0.42), line: o.line ?? 0.55 },
    })
  }
  // 2) the eyes (after carve: the ground packer must avoid them)
  for (const e of data.eyes || []) {
    for (const side of sides) {
      const c = [ox + side * e.c[0], e.c[1]]
      kit.pillowBoss(panel, { c, w: e.w, h: e.h, round: e.round ?? 1, height: e.height ?? height * 2, crown: e.crown ?? 0.72, slit: false, ring: e.ring ?? false, base: e.base })
      if (e.pupil) {
        const pc = [c[0] + side * (e.pupil.dx ?? 0), c[1] + (e.pupil.dy ?? 0)]
        panel.sink((ctx) => { ctx.beginPath(); ctx.arc(pc[0], pc[1], e.pupil.r, 0, Math.PI * 2); ctx.fill() }, { depth: e.pupil.depth ?? 2.4, shoulder: e.pupil.r * 0.55, profile: 'u' })
      }
    }
  }
  // 3) extra sunk lines (eye sockets, dividers)
  const lines = data.lines || []
  if (lines.length) {
    panel.sink((ctx) => {
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'
      for (const side of sides) for (const l of lines) {
        ctx.lineWidth = l.w ?? 0.6
        ctx.beginPath()
        l.c.forEach(([x, y], i) => (i ? ctx.lineTo(ox + side * x, y) : ctx.moveTo(ox + side * x, y)))
        if (l.closed) ctx.closePath()
        ctx.stroke()
      }
    }, { depth: depth * 0.9, shoulder: 0.25, profile: 'u' })
  }
  // 4) the leiwen ground everywhere left (one half, then the other: hands mirror)
  if (o.ground !== false) {
    const g = o.ground || {}
    const cg = data.centre ?? 0
    const parts = data.single ? [{ x: cg, w: W - cg, hand: 'right' }] : [{ x: W / 2 + cg, w: W / 2 - cg, hand: 'right' }, { x: 0, w: W / 2 - cg, hand: 'left' }]
    for (const part of parts) {
      kit.leiwenFill(panel, { rect: { x: part.x, y: g.y0 ?? 0, w: part.w, h: (g.y1 ?? panel.height) - (g.y0 ?? 0) }, avoid: 'raised', margin: g.margin ?? 0.55 }, {
        pitch: g.pitch ?? 1.2, line: 0.5, depth: g.depth ?? depth, cell: g.cell ?? [5.2, 9.5], pairs: g.pairs ?? 0.25, maxAspect: g.maxAspect ?? 1.6,
        roundness: 0.12, jitter: 0.06, hand: part.hand, seed: (o.seed ?? 0) + 11, turns: g.turns,
      })
    }
  }
}

const spirals = (min = 3.2) => ({ kind: 'spirals', line: 0.5, pitch: 0.9, gap: 0.35, square: 0.25, tail: false, min })

// ------------------------------------------------------------------ belly (y 0 = 57 mm, height ≈ 116 mm)

/** BELLY: one 180° panel per broad side, centred on the pivot (front) / its twin (back). */
export const BELLY = {
  centre: 4.5, // the centre flange
  bands: [
    // the horn: a rounded-square G frame (bottom-inner → up the inner column → across the top → down the outer
    // column → back in along the bottom to the curl block); 7.5–9 mm wide
    { c: [[64, 79.2], [33.5, 79.2], [33.5, 110.4], [91, 110.4], [91, 82.4], [76, 82.4]], w: [7.6, 8.4, 9.8, 9.8, 8.6, 7.8], round: 0.6, inner: 0.16, end: 'flat' },
    // the G's hook: hanging from the top bar and rolling in on itself (a deep dark pocket round its coil)
    { c: [[59, 106], [59, 90], [72, 89], [76.5, 97.5]], w: [7.6, 8, 7.6, 7], end: 'spiral', spiral: { turns: 1.1, dir: 1, R: 3.6 }, fill: { kind: 'lines', pitch: 1.3, line: 0.45 } },
    // the long brow band under the horn, rising from the centre line
    { c: [[4.5, 57.5], [22, 66.2], [62, 69.4], [103, 68.4]], w: [5, 6.6, 7, 6], end: 'point' },
    // upper-inner C hook beside the centre line (curl at its foot)
    { c: [[24, 111], [7, 110], [5.6, 90], [10, 81]], w: [6.6, 7, 6.6, 6], end: 'spiral', spiral: { turns: 0.95, dir: 1, R: 3.6 } },
    // the long band hugging the eye on the inner side (the jaw's upper lip), rising from the bottom
    { c: [[6, 3.5], [7, 24], [13.6, 43], [25, 59]], w: [5, 6, 6, 4.6], start: 'round', end: 'point' },
    // the band under the eye
    { c: [[17, 18.5], [42, 18], [65, 22.6], [82, 33]], w: [5, 6.4, 6.2, 4.8], end: 'point' },
    // the body hook beside the eye (outer): along, down, back in, rolled
    { c: [[67, 58.4], [97, 58.8], [104, 50], [98, 41.6], [83, 43]], w: [7, 8.2, 8, 7.2, 6.6], end: 'spiral', spiral: { turns: 1, dir: 1, R: 4 } },
    // the lower outer tail (jaw) rolling up at its end
    { c: [[58, 7.6], [88, 9.6], [106, 19.6], [110, 32]], w: [5, 6, 6, 5], end: 'spiral', spiral: { turns: 0.9, dir: 1, R: 3.6 } },
    // small hooks at the foot of the field
    { c: [[21, 4], [40, 4.6], [47.5, 12]], w: [4.4, 4.8, 4.4], end: 'spiral', spiral: { turns: 0.8, dir: 1, R: 2.8 } },
    // the upright band at the horn's outer side (an ear) with its curl over the top
    { c: [[104.5, 74], [104.5, 107], [112, 112.6]], w: [6.6, 7, 6], end: 'spiral', spiral: { turns: 0.8, dir: -1, R: 3.4 } },
    // photo-32: the tall side kui standing up the outer field (head with a round eye at the top) …
    { c: [[130, 16], [128, 100], [134, 111.4], [147, 110], [151, 98]], w: [8, 9.6, 9, 8, 7], end: 'spiral', spiral: { turns: 0.9, dir: 1, R: 3.8 }, fill: spirals(3.6) },
    // … a second, lower hook toward the end flange
    { c: [[162, 14], [161, 66], [171, 77]], w: [7, 7.4, 6.4], end: 'spiral', spiral: { turns: 0.85, dir: -1, R: 3.4 } },
    { c: [[176, 88], [176, 110]], w: [5.2, 5.2], start: 'round', end: 'round' },
  ],
  plates: [
    { c: [45.5, 92.5], w: 10.6, h: 18, r: 3.6, fill: spirals(3.2) }, // the block inside the G frame
  ],
  eyes: [
    { c: [46, 43], w: 36.5, h: 37, round: 1, height: 6.2, crown: 0.62, pupil: { r: 4.4, dy: -0.6, depth: 2.8 } },
    { c: [139, 105], w: 7.2, h: 7.2, round: 1, height: 2.2, crown: 0.8, base: 'field' }, // the side kui's eye
  ],
  lines: [
    { c: circle([46, 43], 20.6, 72), w: 0.85, closed: true }, // the socket line round the eye boss
  ],
  borders: [[116.6, 118.2]],
}

// ------------------------------------------------------------------ friezes: kui flanking the centre

/** a kui facing the centre line (head at small x) in a frieze, authored at the neck's 35.5 mm; `s` scales it to
 *  another frieze, `len` (mm) is the whole creature's length — the body stretches, a quill every ≈ 28 units */
function kui(x0, s, len) {
  const P = ([x, y]) => [x0 + x * s, y * s]
  const B = (c, w, extra = {}) => ({ c: c.map(P), w: (Array.isArray(w) ? w : [w]).map((v) => v * s * 1.45), ...extra })
  const end = Math.max(70, len / s) // units
  const bands = [
    // upper jaw / trunk curling up in front of the head
    B([[2, 26], [16, 30.5], [26, 28]], [4.6, 5, 4.4], { end: 'spiral', spiral: { turns: 0.9, dir: -1, R: 2.6 * s } }),
    // lower jaw
    B([[3, 11.5], [12, 9.6]], [3.6, 3.6], { start: 'round', end: 'point' }),
    // crest: a G-hook rising off the head
    B([[18, 20], [26, 31.5], [38, 31.5], [40, 23]], [4.4, 4.8, 4.6, 4.2], { end: 'spiral', spiral: { turns: 0.9, dir: 1, R: 2.6 * s } }),
    // the body, long and fat, ending in a rolled tail
    B([[16, 13.8], [44, 12.6], [end - 10, 13.6], [end - 2, 22]], [6.6, 6.6, 6, 4.8], { end: 'spiral', spiral: { turns: 1, dir: 1, R: 3 * s } }),
    // the leg, claw forward
    B([[40, 9.6], [40, 4.6], [30, 4.2]], [4, 4, 3.4], { end: 'point' }),
  ]
  // quills hooking up off the back
  for (let q = 50; q < end - 22; q += 22) bands.push(B([[q, 17], [q + 2, 26.5], [q + 12, 29.6]], [4.4, 4.6, 4], { end: 'spiral', spiral: { turns: 0.85, dir: -1, R: 2.4 * s } }))
  // a hanging hook under the body behind the leg
  for (let q = 64; q < end - 30; q += 56) bands.push(B([[q, 9.4], [q + 3, 4.2], [q + 13, 4.4]], [3.8, 3.8, 3.4], { end: 'spiral', spiral: { turns: 0.8, dir: 1, R: 2 * s } }))
  return {
    bands,
    plates: [{ c: P([12, 19]), w: 12 * s, h: 13 * s, r: 4.4 * s, fill: { kind: 'coil', pitch: 1.0, line: 0.42 } }],
    eyes: [{ c: P([12, 19.4]), w: 5.6 * s, h: 5.6 * s, round: 1, height: 1.6, crown: 0.8, base: 'field' }],
  }
}
function merge(...parts) {
  const o = { bands: [], plates: [], eyes: [], lines: [] }
  for (const p of parts) for (const k of Object.keys(o)) o[k].push(...(p[k] || []))
  return o
}
function circle(c, r, n = 48) {
  const out = []
  for (let i = 0; i < n; i++) out.push([c[0] + r * Math.cos((2 * Math.PI * i) / n), c[1] + r * Math.sin((2 * Math.PI * i) / n)])
  return out
}

/** NECK (35.5 mm): the pivot head covers |x| < 14; a long kui faces it, its tail at the end flange */
export const NECK = { centre: 13, ...merge(kui(16, 1, 126)), borders: [[1.4, 3.2], [33.2, 34.6]] }
/** LID SKIRT (27 mm): the same pair at 0.76 scale; the strap hides the centre */
export const SKIRT = { centre: 6, ...merge(kui(9, 0.76, 138)), borders: [[1, 2.6], [24.6, 26.2]] }
/** FOOT (26.5 mm): a pair facing the centre flange */
export const FOOT = { centre: 4.5, ...merge(kui(7, 0.72, 126)), borders: [[0.8, 2.4], [24, 25.6]] }

// ------------------------------------------------------------------ lid top (y 0 = the slope's foot at 264.5 mm)

/** LID: a mask on each broad slope: round ring-eyed bosses, G-hook horns, side hooks (photo-31 left, photo-32) */
export const LID = {
  centre: 0,
  bands: [
    // the big G-hook horn of each half rising toward the knob, rolled at its inner end
    { c: [[7, 42], [22, 50], [44, 48], [52, 37], [43, 29.5]], w: [6.4, 7.4, 7.4, 6.8, 6], end: 'spiral', spiral: { turns: 1, dir: 1, R: 3.6 } },
    // a long hooked jaw under the eye, out toward the end flange
    { c: [[34, 10.6], [56, 12], [70, 20], [76, 32]], w: [5.6, 6.6, 6.2, 5], end: 'spiral', spiral: { turns: 0.95, dir: -1, R: 3.4 } },
    // the outer hooks near the ridge flange
    { c: [[100, 36], [88, 37.5], [76, 42.6]], w: [5.4, 6, 5], end: 'spiral', spiral: { turns: 0.9, dir: 1, R: 3 } },
    { c: [[102, 9], [116, 16], [120, 27]], w: [5, 5.6, 4.8], end: 'spiral', spiral: { turns: 0.9, dir: -1, R: 2.8 } },
    // the nose under the strap
    { c: [[6, 6], [6, 30]], w: [6, 6], start: 'round', end: 'round' },
    // small hooks high on the slope, toward the knob
    { c: [[14, 60], [30, 64], [38, 58]], w: [4.6, 5, 4.4], end: 'spiral', spiral: { turns: 0.85, dir: 1, R: 2.4 } },
  ],
  plates: [],
  eyes: [
    { c: [22, 22], w: 17, h: 16, round: 1, height: 4.4, crown: 0.55, pupil: { r: 2.8, depth: 2 }, ring: { gap: 0.6, line: 0.7, depth: 0.5 } },
    { c: [88, 20], w: 13.4, h: 12.8, round: 1, height: 3.8, crown: 0.55, pupil: { r: 2.3, depth: 1.8 }, ring: { gap: 0.6, line: 0.6, depth: 0.45 } },
  ],
  lines: [],
  borders: [[0.8, 2.6]],
}

// ------------------------------------------------------------------ the bail strap (one half: lower end → crown)

/** photo-31 (detail-strap.jpg), from the pivot up: a rolled curl at the foot; a long S-dragon, its fat body filled
 *  with spirals, swinging once across the strap (≈ 8–90 mm); a round boss (≈ 96); a small mask of two hooked brows
 *  over the boss (≈ 100–126); a second S-dragon up the arch with its curl low (≈ 130 → the crown). Raised rims along
 *  both edges, fine spirals in the ground. Panel 27 mm wide; single (no mirror). */
export function strapData(L) {
  const W = 27, m = W / 2
  const S = (y0, y1, amp, n = 14) => {
    const out = []
    for (let i = 0; i <= n; i++) { const t = i / n; out.push([m + amp * Math.sin(Math.PI * 2 * t) * (0.4 + 0.6 * Math.sin(Math.PI * t)), y0 + (y1 - y0) * t]) }
    return out
  }
  return {
    single: true,
    centre: 0,
    bands: [
      { c: [[2.2, 1], [2.2, L]], w: 2.8, start: 'flat', end: 'flat', contour: false },
      { c: [[W - 2.2, 1], [W - 2.2, L]], w: 2.8, start: 'flat', end: 'flat', contour: false },
      // lower dragon: curl at the foot, S body, head (blunt) under the boss
      { c: S(10, 86, 5.2), w: [5.6, 6.4, 6.8, 6.8, 6.6, 6.4, 6.2, 6, 5.8, 5.6, 5.4, 5.2, 5, 4.8, 4.6], start: 'spiral', startSpiral: { turns: 1.1, dir: 1, R: 3.2 }, end: 'round', fill: spirals(2.6) },
      // the small mask over the boss: two hooked brows
      { c: [[m - 1.5, 102], [6, 106], [6, 116], [10.5, 122]], w: 3.6, end: 'spiral', spiral: { turns: 0.8, dir: -1, R: 2 } },
      { c: [[m + 1.5, 102], [W - 6, 106], [W - 6, 116], [W - 10.5, 122]], w: 3.6, end: 'spiral', spiral: { turns: 0.8, dir: 1, R: 2 } },
      { c: [[m, 108], [m, 124]], w: 2.6, start: 'round', end: 'point' },
      // upper dragon along the arch
      { c: S(134, L - 8, -5, 18), w: 5.6, start: 'spiral', startSpiral: { turns: 1.1, dir: -1, R: 3.4 }, end: 'round', fill: spirals(2.6) },
    ],
    plates: [],
    eyes: [{ c: [m, 95.5], w: 8.4, h: 8.4, round: 1, height: 2.6, crown: 0.7 }],
    lines: [],
  }
}

// ------------------------------------------------------------------ panels

const panelOf = (kit, size, ppmm, seed) => new kit.ReliefPanel({ width: size.width, height: size.height, ppmm, seed })

export function bellyPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  renderTrace(kit, p, BELLY, { height: 3.0, seed, ground: { pitch: 1.2, cell: [5.4, 9.6], pairs: 0.2 } })
  return p.bake()
}
export function neckPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  renderTrace(kit, p, NECK, { height: 1.8, seed, line: 0.45, ground: { pitch: 1.0, cell: [4.6, 8], pairs: 0.3 } })
  return p.bake()
}
export function skirtPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  renderTrace(kit, p, SKIRT, { height: 1.5, seed, line: 0.42, ground: { pitch: 0.95, cell: [4.4, 7.6], pairs: 0.3 } })
  return p.bake()
}
export function footPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  renderTrace(kit, p, FOOT, { height: 1.5, seed, line: 0.42, ground: { pitch: 0.95, cell: [4.4, 7.6], pairs: 0.3 } })
  return p.bake()
}
export function lidPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  renderTrace(kit, p, LID, { height: 2.2, seed, ground: { pitch: 1.1, cell: [5, 9], pairs: 0.25, y1: Math.min(size.height, 72) } })
  return p.bake()
}
export function strapPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  renderTrace(kit, p, strapData(size.height), { height: 1.4, seed, line: 0.4, contour: { inset: 0.7, line: 0.4 }, ground: { pitch: 0.95, cell: [4, 7], pairs: 0.3 } })
  return p.bake()
}
