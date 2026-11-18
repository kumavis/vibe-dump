// nezu-fangyi — the relief renderer for this vessel's décor.
//
// The Nezu fangyi is Style V-b at its most sculptural (dossier §c): broad,
// smooth, round-shouldered plateaus about 3 mm high, each carrying ONE incised
// line down its middle (ending in the eye of every spiral), domed slit bosses
// standing 2 mm proud of them, and fine squared leiwen sunk only into the
// channels left between the bands. So a mask here is a set of BANDS (a spine +
// a width, built with the kit's Turtle) plus a few solid blobs and bosses.
//
// Authoring space ("half space"): u = mm OUTWARD from the face's centre line
// (the centre flange), v = mm UP from the panel bottom. A sheet is drawn on the
// LEFT half of the panel (x = xc − u) and the panel is mirrored, as the mould
// carver worked to a centre line. Only kit primitives are used:
// ReliefPanel.raise/sink, fillGround (leiwen), mirrorX, shapes.band/drawShape.

export class Sheet {
  constructor() {
    this.bands = [] // { pts, w, capA, capB, line }
    this.blobs = [] // { shape, echo }  kit shape (poly / rrect / ellipse / circle), raised as plateau
    this.bosses = [] // { c, rx, ry, h, slit: [len, width] | null, rot }
    this.lines = [] // extra incised lines [[u, v]…]
    this.rings = [] // { shape, w }  grooves cut round a socket before its boss is raised
  }
  band(pts, w, o = {}) {
    this.bands.push({ pts, w, capA: o.capA ?? 'round', capB: o.capB ?? 'round', line: o.line ?? true, trim: o.trim })
    return pts
  }
  blob(shape, o = {}) {
    this.blobs.push({ shape, echo: o.echo ?? 0 })
    return this
  }
  boss(o) {
    this.bosses.push({ ry: o.rx, slit: null, rot: 0, ...o })
    return this
  }
  line(pts) {
    this.lines.push(pts)
    return this
  }
  ring(shape, w) {
    this.rings.push({ shape, w })
    return this
  }
  /** a new sheet with every coordinate passed through f([u, v]) → [u, v] (lid trapezoids, compression) */
  map(f) {
    const S = new Sheet()
    const mp = (pts) => pts.map((p) => f(p))
    const ms = (s) => {
      const o = { ...s }
      if (s.pts) o.pts = mp(s.pts)
      if (s.c) o.c = f(s.c)
      return o
    }
    S.bands = this.bands.map((b) => ({ ...b, pts: mp(b.pts) }))
    S.blobs = this.blobs.map((b) => ({ ...b, shape: ms(b.shape) }))
    S.bosses = this.bosses.map((b) => ({ ...b, c: f(b.c) }))
    S.lines = this.lines.map(mp)
    S.rings = this.rings.map((r) => ({ ...r, shape: ms(r.shape) }))
    return S
  }
  /** append another sheet (already in this sheet's space) */
  merge(o) {
    this.bands.push(...o.bands)
    this.blobs.push(...o.blobs)
    this.bosses.push(...o.bosses)
    this.lines.push(...o.lines)
    this.rings.push(...o.rings)
    return this
  }
}

/** Round-shouldered plateau: steep at the foot, a quarter-round arris (V-b, cast and burnished). */
export const shoulderProfile = (s, w) => {
  if (s <= 0) return 0
  if (s >= w) return 1
  const t = s / w
  return Math.sqrt(1 - (1 - t) * (1 - t))
}

/**
 * Render sheets onto a panel.
 * halves: [{ sheet, xc }]  each sheet drawn on the left half about panel x = xc (u → xc − u)
 * o: { L1 (plateau mm), shoulder (mm), groove: { w, d }, boss: { shoulder }, ground: leiwen opts,
 *      fields: [{x,y,w,h}] rects (panel mm) where leiwen goes (left halves), mirror: true | rect,
 *      seed, lift: number (raise everything by this, e.g. so plain borders sit flush) }
 */
export function renderSheets(kit, panel, halves, o = {}) {
  const {
    L1 = 3, shoulder = 1.1, groove = { w: 0.8, d: 0.55 }, ground = {}, fields = null, mirror = true, seed = 1, slitDepth = 1.1,
  } = o
  const { drawShape, band, strokeLine, trim, polyLength } = kit.shapes
  const withHalf = (ctx, xc, fn) => {
    ctx.save()
    ctx.translate(xc, 0)
    ctx.scale(-1, 1)
    fn()
    ctx.restore()
  }

  // 1. plateaus: every band and blob of every half, one raise (one distance field)
  panel.raise((ctx) => {
    for (const { sheet, xc } of halves) {
      withHalf(ctx, xc, () => {
        for (const b of sheet.bands) drawShape(ctx, band(b.pts, b.w, b.capA, b.capB))
        for (const b of sheet.blobs) drawShape(ctx, b.shape)
      })
    }
  }, { height: L1, shoulder, profile: shoulderProfile })

  // 2. incised lines: band centre lines (trimmed short of the caps), blob echoes, extra lines, socket rings
  panel.sink((ctx) => {
    for (const { sheet, xc } of halves) {
      withHalf(ctx, xc, () => {
        for (const b of sheet.bands) {
          if (!b.line) continue
          const L = polyLength(b.pts)
          const w0 = typeof b.w === 'number' ? b.w : b.w(0.5)
          const cut = b.trim ?? Math.min(w0 * 0.75, L * 0.3)
          const pts = trim(b.pts, b.capA === 'round' || b.capA === 'square' ? cut : 0, b.capB === 'round' || b.capB === 'square' ? cut : 0)
          if (pts.length > 1) strokeLine(ctx, pts, groove.w)
        }
        for (const l of sheet.lines) strokeLine(ctx, l, groove.w)
      })
    }
  }, { depth: groove.d, profile: 'u' })

  // socket rings: a wider, deeper groove that leaves the eye frame standing as a band round its boss
  const rings = halves.some(({ sheet }) => sheet.rings.length)
  if (rings) {
    panel.sink((ctx) => {
      for (const { sheet, xc } of halves) {
        withHalf(ctx, xc, () => {
          for (const r of sheet.rings) {
          // a ring groove = the outline of a shape, stroked
          const s = r.shape
          ctx.lineWidth = r.w
          ctx.beginPath()
          if (s.kind === 'rrect') {
            const w = s.w, h = s.h, rr = Math.min(s.r, w / 2, h / 2)
            ctx.save()
            ctx.translate(s.c[0], s.c[1])
            ctx.moveTo(-w / 2 + rr, -h / 2)
            ctx.arcTo(w / 2, -h / 2, w / 2, h / 2, rr)
            ctx.arcTo(w / 2, h / 2, -w / 2, h / 2, rr)
            ctx.arcTo(-w / 2, h / 2, -w / 2, -h / 2, rr)
            ctx.arcTo(-w / 2, -h / 2, w / 2, -h / 2, rr)
            ctx.closePath()
            ctx.restore()
          } else if (s.kind === 'ellipse') {
            ctx.ellipse(s.c[0], s.c[1], s.rx, s.ry, 0, 0, Math.PI * 2)
          } else if (s.kind === 'circle') {
            ctx.arc(s.c[0], s.c[1], s.r, 0, Math.PI * 2)
          } else if (s.pts) {
            ctx.moveTo(s.pts[0][0], s.pts[0][1])
            for (const p of s.pts) ctx.lineTo(p[0], p[1])
            ctx.closePath()
          }
          ctx.stroke()
        }
        })
      }
    }, { depth: o.ringDepth ?? Math.max(groove.d * 2, L1 * 0.4), profile: 'u' })
  }

  // 3. bosses: one dome per call so each takes its own radius
  for (const { sheet, xc } of halves) {
    for (const b of sheet.bosses) {
      panel.raise((ctx) => withHalf(ctx, xc, () => drawShape(ctx, kit.shapes.ellipse(b.c, b.rx, b.ry, b.rot))), {
        height: b.h, shoulder: Math.min(b.rx, b.ry) * (b.flat ?? 1), profile: 'dome',
      })
    }
  }
  // slit pupils
  const slits = []
  for (const { sheet, xc } of halves) for (const b of sheet.bosses) if (b.slit) slits.push({ b, xc })
  if (slits.length) {
    panel.sink((ctx) => {
      for (const { b, xc } of slits) {
        withHalf(ctx, xc, () => strokeLine(ctx, [[b.c[0] - b.slit[0] / 2, b.c[1]], [b.c[0] + b.slit[0] / 2, b.c[1]]], b.slit[1]))
      }
    }, { depth: slitDepth, profile: 'u' })
  }

  // 4. leiwen in the channels: only inside the décor fields (plain borders stay plain)
  const rects = fields ?? halves.map(({ xc }) => ({ x: 0, y: 0, w: xc, h: panel.height }))
  rects.forEach((r, i) => {
    if (r.w > 1 && r.h > 1) panel.fillGround({ ...ground, seed: seed + i * 31 }, { rect: r, avoid: 'raised', margin: ground.margin ?? 0.5 })
  })

  // 5. mirror the left half onto the right
  if (mirror === true) panel.mirrorX()
  else if (mirror) for (const r of [].concat(mirror)) panel.mirrorX(r)
  return panel
}

// ------------------------------------------------------------------ authoring helpers

/** Turtle from [u, v] with heading (deg, 0 = outward +u, 90 = up). */
export const turtle = (kit, at, heading) => new kit.shapes.Turtle(at, heading)

/** A squared C-spiral band: start at `at` heading `heading`, then curl `dir` (+1 left/CCW, −1 right/CW). */
export function spiralBand(kit, S, at, heading, lead, { dir = 1, size = 10, pitch = 6, turns = 1.25, r = 2.5, w = 4, capA = 'round', capB = 'round', line = true } = {}) {
  const T = new kit.shapes.Turtle(at, heading)
  if (lead > 0) T.fwd(lead)
  T.curl({ dir, size, pitch, turns, r })
  return S.band(T.spine(0.3), w, { capA, capB, line })
}
