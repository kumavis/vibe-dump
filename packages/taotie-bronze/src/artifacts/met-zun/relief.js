// Met zun 43.25.1 — the flat-band (Loehr III/IV) renderer.
//
// dossier §c: broad pale bands 3.5–4.5 mm wide, flush with the wall (+0.3 at
// most), each outlined by ONE sunk contour groove 1.2–1.4 mm wide, ≈ 0.5 deep,
// on a squared leiwen ground (pitch 1.3, 0.4 deep). Only the eyes are raised
// (L2 domes ≈ 2.2 mm with a sunk pupil). Every recess carries black inlay, so
// the groove channel must be exact: bands are never marked as groove.

/**
 * @param kit
 * @param panel     ReliefPanel
 * @param o.bands   kit.shapes shapes (band / poly / rrect / circle), panel mm
 * @param o.bosses  [{ c: [x, y], r, ring?: bool, pupil?: mm }]
 * @param o.lines   [{ pts, w }] incised lines on the plain / ground
 * @param o.half    the rect to fill with leiwen (left half; the caller mirrors)
 * @param o.include optional draw(ctx) restricting the leiwen (blades)
 * @param o.leiwen  leiwen options
 */
export function renderFlush(kit, panel, o) {
  const { drawShape, strokeLine } = kit.shapes
  const bands = o.bands || []
  const bosses = o.bosses || []
  const lines = o.lines || []
  const g = o.groove ?? 1.3
  const gDepth = o.grooveDepth ?? 0.5
  const lift = o.lift ?? 0.15
  const all = (shapes, grow) => (ctx) => {
    for (const s of shapes) drawShape(ctx, s, grow)
  }

  // the contour grooves (and anything sunk before this call) are not leiwen: snapshot them
  // before the incised lines, whose land must stay pale like the leiwen's own
  let G0 = null
  if (bands.length) {
    // 1. the contour groove: sink band + g, then lift the band back above it
    panel.sink(all(bands, g), { depth: gDepth, profile: (s) => (s <= 0 ? 0 : Math.min(1, Math.sqrt(Math.min(1, s / 0.45)))) })
    panel.raise(all(bands, 0), { height: lift, shoulder: 0.22, profile: 'plateau' })
  }
  if (o.solid !== false) G0 = panel.groove.slice()
  // 2. incised lines (blade contours, frieze borders)
  if (lines.length) {
    const byW = new Map()
    for (const l of lines) {
      const w = l.w ?? 0.7
      if (!byW.has(w)) byW.set(w, [])
      byW.get(w).push(l.pts)
    }
    for (const [w, ls] of byW) {
      panel.sink((ctx) => {
        for (const pts of ls) strokeLine(ctx, pts, w)
      }, { depth: o.lineDepth ?? 0.45, shoulder: w / 2, profile: 'u' })
    }
  }
  // 3. L2 eye bosses: flattened domes, ring-rimmed where asked
  const bossH = o.boss ?? 2.2
  for (const b of bosses) {
    const r = b.r
    const h = b.h ?? bossH
    panel.raise((ctx) => drawShape(ctx, kit.shapes.circle(b.c, r)), {
      height: h,
      shoulder: r,
      profile: (s, w) => {
        if (s <= 0) return 0
        const t = Math.min(1, s / w)
        const wall = Math.min(1, s / 0.5)
        // a flattened dome: steep foot, broad crown
        return wall * (0.35 + 0.65 * Math.sqrt(1 - (1 - t) * (1 - t)))
      },
    })
  }
  if (bosses.length) {
    panel.sink((ctx) => {
      for (const b of bosses) {
        drawShape(ctx, kit.shapes.circle(b.c, b.pupil ?? b.r * 0.24))
        if (b.ring) strokeLine(ctx, kit.shapes.arcPts(b.c, b.r * 0.72, 0, 360, 0.3), 0.5)
      }
    }, { depth: 0.6, shoulder: 0.3, profile: 'u' })
  }

  // bands are bronze, never paste: clear the groove channel wherever the field is up
  const F = panel.field, G = panel.groove
  for (let i = 0; i < F.length; i++) if (F[i] > 0.02) G[i] = 0

  // 4. the leiwen ground: everything still exactly at 0 inside the half rect
  if (o.leiwen !== false && o.half) {
    const avoid = new Float32Array(F.length)
    for (let i = 0; i < F.length; i++) avoid[i] = Math.abs(F[i]) > 0.02 ? 1 : 0
    kit.leiwenFill(panel, { rect: o.half, avoid: { data: avoid }, include: o.include, margin: o.margin ?? 0.45 }, {
      pitch: 1.3, line: 0.55, roundness: 0.1, depth: 0.4, follow: 1, jitter: 0.06, pairs: 0.7, seed: o.seed ?? 1, ...(o.leiwen || {}),
    })
    // 5. no plain land in the décor field: ground the packer left between its cells and
    //    the contour grooves is sunk and inlaid too, so the bands stand as pale flush
    //    islands on a continuous black-filled ground (detail-leiwen.jpg), not as
    //    plateaus ringed by a pale land (and thin leftover strips do not read as extra
    //    parallel outlines)
    if (G0) {
      const e = o.solidInset ?? 1.4 // a plain land at the register's top and bottom border
      solidGround(panel, { x: o.half.x, y: o.half.y + e, w: o.half.w, h: o.half.h - 2 * e }, G0, { near: o.near ?? 0.62, depth: 0.4 })
    }
  }
}

/**
 * Sink every ground pixel inside rect that is farther than `near` mm from a leiwen
 * groove (a groove pixel that was not a groove in G0) — the unpatterned land.
 */
export function solidGround(panel, rect, G0, { near = 0.62, depth = 0.4 } = {}) {
  const { cols, rows, ppmm } = panel
  const F = panel.field, G = panel.groove
  const x0 = Math.max(0, Math.floor(rect.x * ppmm)), x1 = Math.min(cols, Math.ceil((rect.x + rect.w) * ppmm))
  const y0 = Math.max(0, Math.floor(rect.y * ppmm)), y1 = Math.min(rows, Math.ceil((rect.y + rect.h) * ppmm))
  const w = x1 - x0, h = y1 - y0
  if (w <= 0 || h <= 0) return
  const k = Math.max(1, Math.round(near * ppmm))
  // leiwen groove mask → separable box dilation by k px (horizontal, then vertical)
  const m = new Uint8Array(w * h)
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y + y0) * cols + x + x0
    m[y * w + x] = G[i] > 0.3 && G0[i] < 0.3 ? 1 : 0
  }
  const tmp = new Uint8Array(w * h)
  for (let y = 0; y < h; y++) {
    let run = -1e9
    for (let x = 0; x < w; x++) { if (m[y * w + x]) run = x; tmp[y * w + x] = x - run <= k ? 1 : 0 }
    run = 1e9
    for (let x = w - 1; x >= 0; x--) { if (m[y * w + x]) run = x; if (run - x <= k) tmp[y * w + x] = 1 }
  }
  const near2 = new Uint8Array(w * h)
  for (let x = 0; x < w; x++) {
    let run = -1e9
    for (let y = 0; y < h; y++) { if (tmp[y * w + x]) run = y; near2[y * w + x] = y - run <= k ? 1 : 0 }
    run = 1e9
    for (let y = h - 1; y >= 0; y--) { if (tmp[y * w + x]) run = y; if (run - y <= k) near2[y * w + x] = 1 }
  }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y + y0) * cols + x + x0
    if (near2[y * w + x] || Math.abs(F[i]) > 0.03 || G[i] > 0.3) continue
    F[i] = -depth
    G[i] = 1
  }
}

/** Map a list of shapes through f (points only; widths kept). */
export function mapAll(kit, shapes, f) {
  return shapes.map((s) => kit.shapes.mapShape(s, f))
}
