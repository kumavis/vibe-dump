// Nezu you 饕餮文卣 (90086) — the bail STRAP: two sinuous dragons in fat banded relief along a 27 mm strip.
//
// Read off photo-31 developed onto the strap's own outer face (.work/ridge-nezu-you/develop_strap.py: x 0…27 across,
// y = arc mm from the strap's lower end inside the pivot head, up the leg and over the arch to the crown at 248), and
// detail-strap.jpg. Panel frame = that frame (single, not mirrored; both halves of the bail share it).
//   lower dragon  ONE creature from the tail coil low on the left (centre ≈ 6.8, 17.5) up an S body that swings right
//                 (x ≈ 15 at y 35–45, a quill rolled out to the right at y ≈ 47) and back left into the head at
//                 y 78–93, its eye the oblong boss above it (y ≈ 97)
//   mask          over the eye boss (y 104–129): two hooked brows either side of a nose bar, a bar across the top
//   upper dragon  its tail coiled low (centre ≈ 11, 143), a quill rolled to the left above it (y ≈ 160), the body up
//                 the right of the strip with two quills to the left, to a squared head at the crown (y 233–248).
//                 Above y ≈ 190 the arch turns away from photo-31 and is not readable: the upper body is drawn on as the
//                 photographs show it lower down, the crown head is INFERRED (the two halves meet head to head).
// Fat banded plates (one incised line inside each edge, pillowed, ≈ 2–2.7 mm proud) unioned per creature, a raised rim along each
// edge, and a ground of small raised square spirals (one fat round thread) in everything left.

/** extend a centre line by coiling it round centre c through `sweep`°, radius shrinking `shrink` mm per turn */
function coilAbout(pts, c, { sweep = 300, shrink = 5.4, step = 0.45, min = 0.6 } = {}) {
  const E = pts[pts.length - 1], F = pts[pts.length - 2]
  const d = [E[0] - F[0], E[1] - F[1]], v = [c[0] - E[0], c[1] - E[1]]
  const sg = d[0] * v[1] - d[1] * v[0] > 0 ? 1 : -1 // centre on the left of travel → turn left (ccw)
  const R = Math.hypot(v[0], v[1]), th0 = Math.atan2(E[1] - c[1], E[0] - c[0])
  const out = pts.slice()
  for (let ph = step / R; ph <= (sweep * Math.PI) / 180; ph += step / Math.max(1, R)) {
    const r = R - (shrink * ph) / (2 * Math.PI)
    if (r < min) break
    out.push([c[0] + Math.cos(th0 + sg * ph) * r, c[1] + Math.sin(th0 + sg * ph) * r])
  }
  return out
}
/** width along a path by arc fraction: piecewise linear through [[t, w]…] */
const widthBy = (stops) => (t) => {
  for (let i = 0; i < stops.length - 1; i++) {
    const [t0, w0] = stops[i], [t1, w1] = stops[i + 1]
    if (t <= t1) return w0 + ((w1 - w0) * (t - t0)) / Math.max(1e-6, t1 - t0)
  }
  return stops[stops.length - 1][1]
}

export function strapDesign(kit, L) {
  const S = (pts, width, o = {}) => kit.roundStroke(pts, { width, round: 0.7, inner: 0.3, start: 'round', end: 'round', ...o })
  const curl = (pts, R, dir, sweep, shrink) => {
    const E = pts[pts.length - 1], F = pts[pts.length - 2], l = Math.hypot(E[0] - F[0], E[1] - F[1])
    const n = [(-(E[1] - F[1]) / l) * dir, ((E[0] - F[0]) / l) * dir]
    return coilAbout(pts, [E[0] + n[0] * R, E[1] + n[1] * R], { sweep, shrink })
  }
  const lower = [
    S(coilAbout([[8.6, 79], [7.2, 70], [8.2, 60], [12.4, 49], [14.6, 37.5], [13.2, 28.5], [9.8, 22]], [7.6, 18], { sweep: 310, shrink: 6.4 }),
      widthBy([[0, 6.4], [0.15, 7.6], [0.6, 7.8], [0.74, 5.6], [1, 4.4]])), // body → tail coil
    S(curl([[14.6, 44], [19.4, 46.6]], 2.9, 1, 290, 5.6), 4.2), // quill rolled out to the right in the bend
    kit.roundPoly([[3.2, 79.6], [12, 77.2], [15.8, 82.6], [14.6, 90.4], [9.4, 93], [3.4, 90.6]], { round: [3.6, 3.4, 4, 4, 3.4, 3.6] }), // head
  ]
  const mask = [
    S([[13.5, 103.6], [13.5, 124.5]], 3.8, { start: 'round', end: 'flat' }), // nose bar
    S(curl([[7, 107.2], [7, 120.4]], 2.1, 1, 190, 4.2), 3.7), // brow, hooked out
    S(curl([[20, 107.2], [20, 120.4]], 2.1, -1, 190, 4.2), 3.7), // brow, hooked out
    S([[3.6, 127.4], [23.4, 127.4]], 3.4), // bar across the top
  ]
  const upper = [
    S(coilAbout([[13.6, L - 14.5], [15.6, 222], [17.6, 204], [18.4, 186], [17.4, 168], [16.2, 154.5], [15.4, 148.6]], [11.2, 143.4], { sweep: 320, shrink: 6.6 }),
      widthBy([[0, 6.4], [0.3, 7.6], [0.72, 7.6], [0.82, 5.6], [1, 4.4]])), // body → tail coil
    S(curl([[14.6, 160.6], [7.6, 161.6]], 2.4, 1, 270, 5.6), 4.2), // quill rolled down to the left
    S(curl([[16.6, 181], [8.6, 184]], 2.2, 1, 250, 5.4), 4.2), // quill
    S(curl([[17.4, 205], [9.4, 208.4]], 2.2, 1, 250, 5.4), 4.2), // quill
    kit.roundPoly([[7.6, L - 15], [20.6, L - 15], [20.6, L - 0.6], [7.6, L - 0.6]], { round: [3, 3, 1.5, 1.5] }), // head at the crown (inferred)
  ]
  return { lower, mask, upper, eyes: [{ c: [11.4, 97.2], w: 8.6, h: 7.4 }, { c: [14.1, L - 7.6], w: 6.6, h: 5.6 }] }
}

export function drawStrap(kit, panel, { seed = 0 } = {}) {
  const W = panel.width, L = panel.height
  const D = strapDesign(kit, L)
  const contour = kit.elementContour.bind(kit)
  // the rims along both edges
  panel.raise((ctx) => { ctx.fillRect(0, 0, 1.5, L); ctx.fillRect(W - 1.5, 0, 1.5, L) }, { height: 1.2, shoulder: 0.6, profile: 'plateau' })
  const opts = { union: true, height: 2.0, shoulder: 1.4, pillow: 0.7, pillowWidth: 2.8, contour: { inset: 1.0, line: 0.62 }, depth: 0.48 }
  for (const [k, g] of [['lower', D.lower], ['mask', D.mask], ['upper', D.upper]]) {
    kit.tracedPlates(panel, g.map((el) => ({ outer: contour(el, 0) })), { ...opts, seed: seed + k.length })
  }
  for (const e of D.eyes) {
    panel.sink((ctx) => { ctx.beginPath(); ctx.ellipse(e.c[0], e.c[1], e.w / 2 + 0.8, e.h / 2 + 0.8, 0, 0, Math.PI * 2); ctx.fill() }, { depth: 0.8, shoulder: 0.35, profile: 'u' })
    kit.pillowBoss(panel, { c: e.c, w: e.w, h: e.h, round: 0.6, height: 2.8, crown: 0.75, slit: { len: e.w * 0.42, width: 0.8, depth: 0.7 }, ring: false })
  }
  kit.ridgeGround(panel, { rect: { x: 1.6, y: 0, w: W - 3.2, h: L }, avoid: 'raised' }, {
    pitch: 0.95, width: 0.62, height: 0.45, seed: seed + 3, leiwen: { cell: [3.2, 6.4], pairs: 0.3, maxAspect: 1.8 },
  })
  return D
}
