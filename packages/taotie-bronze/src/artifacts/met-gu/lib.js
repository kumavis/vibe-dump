// Drawing helpers for the Met gu 1985.214.4 décor (Loehr IV-V flush bands on
// fine squared leiwen). Everything here works in panel mm on a ReliefPanel.

/** Rectangular squared spiral (雷纹 in its own frame): outermost turn = the frame, wound inward at `pitch`.
 *  Starts at the bottom-left corner going right (counter-clockwise inward); `flip` mirrors it left↔right,
 *  `turn` rotates the start corner by quarter turns. Returns a polyline. */
export function rectSpiral(x0, y0, w, h, pitch, { flip = false, turn = 0 } = {}) {
  let l = 0, b = 0, r = w, t = h
  const pts = [[l, b]]
  for (let guard = 0; guard < 40; guard++) {
    pts.push([r, b])
    pts.push([r, t])
    if (r - l < pitch * 1.6) break
    pts.push([l, t])
    if (t - b < pitch * 2.2) break
    b += pitch
    pts.push([l, b])
    l += pitch
    r -= pitch
    t -= pitch
    if (r - l < pitch * 0.9 || t - b < pitch * 0.9) break
  }
  const q = ((turn % 4) + 4) % 4
  return pts.map(([x, y]) => {
    // rotate the start corner: 0 bl, 1 br, 2 tr, 3 tl (point reflections keep the cell in place)
    let X = x, Y = y
    if (q === 1) { X = w - y * (w / h); Y = x * (h / w) }
    if (q === 2) { X = w - x; Y = h - y }
    if (q === 3) { X = y * (w / h); Y = h - x * (h / w) }
    if (flip) X = w - X
    return [x0 + X, y0 + Y]
  })
}

/** A row (or column) of framed spiral cells filling [a, b] along one axis. */
export function cellRow(x0, y0, w, h, { count, pitch, vertical = false, gap = 0.35, alt = true }) {
  const L = vertical ? h : w
  const n = Math.max(1, count ?? Math.round(L / ((vertical ? w : h) * 1.15)))
  const c = (L - gap * (n - 1)) / n
  const out = []
  for (let i = 0; i < n; i++) {
    const a = i * (c + gap)
    const flip = alt && i % 2 === 1
    out.push(vertical ? rectSpiral(x0, y0 + a, w, c, pitch, { flip }) : rectSpiral(x0 + a, y0, c, h, pitch, { flip }))
  }
  return out
}

/** Sink a set of polylines as incised grooves (round-bottomed). */
export function incise(panel, lines, { width = 0.42, depth = 0.3 } = {}) {
  if (!lines.length) return
  panel.sink((ctx) => {
    ctx.lineWidth = width
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    for (const pts of lines) {
      if (pts.length < 2) continue
      ctx.beginPath()
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
      ctx.stroke()
    }
  }, { depth, shoulder: width / 2, profile: 'u' })
}

const grooveAt = (s, c, hw) => (Math.abs(s - c) >= hw ? 0 : Math.sqrt(1 - ((s - c) / hw) ** 2))

/**
 * Flush flat bands (Loehr IV/V-b as on this gu): lifted `lift` mm with a steep, softened
 * shoulder, outlined by one groove just inside the edge, and optionally one echo groove
 * `echo` mm inside the edge (the waist's single contour line).
 */
export function flushBands(panel, paint, { lift = 0.25, lw = 0.42, groove = 0.3, echo = 0, shoulder = 0.14 } = {}) {
  panel.raise(paint, { height: lift, shoulder, profile: 'plateau' })
  const ghw = lw / 2
  panel.sink(paint, {
    depth: groove,
    shoulder: Math.max(echo, lw) + lw,
    profile: (s) => Math.max(grooveAt(s, ghw * 1.05, ghw), echo ? grooveAt(s, echo, ghw * 0.9) : 0),
  })
}

/** Rounded-square domed boss (eye) standing `height` mm above the ground, steep wall, spherical top. */
export function domeBoss(panel, drawFn, { height = 2, radius = 3, wall = 0.4 } = {}) {
  panel.raise(drawFn, {
    height,
    shoulder: radius,
    profile: (s, w) => {
      if (s <= 0) return 0
      const t = Math.min(1, s / w)
      const sw = Math.min(1, s / wall)
      const plateau = 1 - (1 - sw) ** 2.5
      return plateau * (0.35 + 0.65 * Math.sqrt(1 - (1 - t) * (1 - t)))
    },
  })
}

/** Stroke a band (shapes.band) list into ctx; a tiny helper so draw fns stay short. */
export function paintAll(drawShape, shapes) {
  return (ctx) => {
    for (const s of shapes) drawShape(ctx, s)
  }
}

/**
 * A FRAMED squared spiral (雷纹 as cast on this gu): a closed frame plus, inside it, a spiral whose
 * outer arm leaves the frame as a lead-in and winds inward `turns` times to a short hook at the
 * centre. Pitch adapts so the turns fit the short side (never below `minPitch`).
 * `flip` mirrors left↔right, `rot` (0|2) starts the lead-in from the top instead of the bottom.
 * Returns an array of polylines (frame, spiral).
 */
export function framedSpiral(x0, y0, w, h, { turns = 3, minPitch = 0.8, flip = false, rot = 0, frame = true } = {}) {
  const m = Math.min(w, h)
  const g = Math.max(minPitch, m / (2 * turns + 1.4))
  const sp = []
  // lead-in from the frame's bottom edge, then inward: up, right, down, left, up …
  let l = g, b = 0, r = w - g, t = h - g
  sp.push([l, b])
  for (let guard = 0; guard < 24; guard++) {
    sp.push([l, t])
    if (r - l < g * 0.9) break
    sp.push([r, t])
    if (t - (b + g) < g * 0.9) break
    sp.push([r, b + g])
    if (r - (l + g) < g * 0.9) break
    sp.push([l + g, b + g])
    l += g; b += g; r -= g; t -= g
    if (t - b < g * 0.9 || r - l < g * 0.2) break
  }
  // keep the centre hook short: trim the last leg to half its length
  if (sp.length > 3) {
    const a = sp[sp.length - 2], z = sp[sp.length - 1]
    sp[sp.length - 1] = [a[0] + (z[0] - a[0]) * 0.6, a[1] + (z[1] - a[1]) * 0.6]
  }
  const tx = ([x, y]) => {
    let X = x, Y = y
    if (rot === 2) { X = w - X; Y = h - Y }
    if (flip) X = w - X
    return [x0 + X, y0 + Y]
  }
  const out = [sp.map(tx)]
  if (frame) out.push([[0, 0], [w, 0], [w, h], [0, h], [0, 0]].map(tx))
  return out
}

/** A row (or column) of framed spirals, alternating hand. */
export function framedRow(x0, y0, w, h, { count, vertical = false, gap = 0.5, turns = 3, minPitch = 0.8, alt = true, rot = 0 } = {}) {
  const L = vertical ? h : w
  const n = Math.max(1, count ?? Math.round(L / ((vertical ? w : h) * 1.15)))
  const c = (L - gap * (n - 1)) / n
  const out = []
  for (let i = 0; i < n; i++) {
    const a = i * (c + gap)
    const o = { turns, minPitch, flip: alt && i % 2 === 1, rot }
    out.push(...(vertical ? framedSpiral(x0, y0 + a, w, c, o) : framedSpiral(x0 + a, y0, c, h, o)))
  }
  return out
}

/** A round coil groove: Archimedean spiral from radius R at angle a0 (rad) inward to `r1`, `dir` ±1 (CCW +). */
export function coilLine([cx, cy], R, { a0 = 0, turns = 1.6, r1 = 0.35, dir = 1 } = {}) {
  const pts = []
  const n = Math.ceil(turns * 48)
  for (let i = 0; i <= n; i++) {
    const f = i / n
    const a = a0 + dir * f * turns * 2 * Math.PI
    const r = R + (r1 - R) * f
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
  }
  return pts
}
