// Nezu you 饕餮文卣 (90086) — the LID SLOPE: fat rounded hook bands rolling into real coils, a ring-eyed boss.
//
// Positions are the earlier tracing's (reference/nezu-you/trace/lid.json, read off faces/dev-lid.jpg for the lower
// 50 mm — photo-31 sees the slope almost edge-on — and shapes from photo-32 / detail-lid.jpg, the slope seen at ≈ 42°);
// panel frame: x = developed mm from the face's centre line (the strap's plane), y = arc mm above the slope's foot.
// What changed is the drawing: every band is ONE fat pillowed plate (round shoulders, ≈ 2.6 mm proud, one incised line
// inside the edge) whose end ROLLS into a coil of the band itself (not a stamped spiral), the bands of one figure are
// unioned, the boss is a domed eye in a sunk ring with a pupil, and the ground is a LOW field of square spirals —
// detail-lid.jpg shows the lid's ground smoother and shallower than the body's. The lid's ridge flanges are plain
// notched blocks in both photographs (no décor on them). Right half drawn; the left mirrors it; the back repeats the front.
import { curlPath } from './friezes.js'

/** Catmull-Rom through control points (n per span), widths interpolated */
function smooth(c, w, n = 5) {
  const W = Array.isArray(w) ? w : c.map(() => w)
  const P = (i) => c[Math.max(0, Math.min(c.length - 1, i))]
  const pts = [], ws = []
  for (let i = 0; i < c.length - 1; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2)
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t
      const f = (a, b, cc, d) => 0.5 * (2 * b + (-a + cc) * t + (2 * a - 5 * b + 4 * cc - d) * t2 + (-a + 3 * b - 3 * cc + d) * t3)
      pts.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])])
      ws.push(W[i] + (W[i + 1] - W[i]) * t)
    }
  }
  pts.push(c[c.length - 1]); ws.push(W[W.length - 1])
  return { pts, ws }
}

export function lidDesign(kit) {
  // a band: smoothed centre line, optional coiled end (R, dir, sweep), widths held through the coil
  const B = (c, w, curl, o = {}) => {
    const wk = (v) => v * 1.15 // detail-lid.jpg: the bands are fatter than the earlier tracing's widths
    const W0 = Array.isArray(w) ? w.map(wk) : wk(w)
    const s = o.sharp ? { pts: c, ws: Array.isArray(W0) ? W0 : c.map(() => W0) } : smooth(c, W0)
    let pts = s.pts, ws = s.ws
    if (curl) {
      const wEnd = ws[ws.length - 1]
      pts = curlPath(pts, { R: curl.R, dir: curl.dir, sweep: curl.sweep ?? 300, shrink: wEnd + 1.6 })
      ws = [...ws, ...Array(pts.length - ws.length).fill(wEnd)]
    }
    return kit.roundStroke(pts, { width: ws, round: o.round ?? 0.9, inner: o.inner ?? 0.4, start: o.start ?? 'round', end: 'round' })
  }
  const rev = (c) => c.slice().reverse()
  return {
    bands: [
      B([[24, 45], [12, 41], [9, 23], [14, 8], [36, 6], [50, 14], [50.5, 28], [41, 33.5], [34, 31.5]], [6.6, 7.4, 8, 8, 8, 7.6, 7, 6.6, 6.2], { R: 4.4, dir: 1, sweep: 320 }), // the big G rolling in
      B([[16, 52.5], [44, 51.5], [70, 47.5]], [6, 6.6, 5]), // the long band over the G toward the boss
      B([[48, 41.5], [64, 43], [72, 38.5]], [6, 6.4, 5.6], { R: 3.0, dir: -1, sweep: 290 }), // upper hook beside the boss
      B(rev([[92, 12.5], [110, 13.5], [124, 17], [128.5, 25]]), [5.6, 6.6, 7.4, 7], { R: 4.2, dir: -1, sweep: 320 }), // outer hook, rolled low
      B([[56, 5.5], [71, 6], [77, 11.5]], [5.4, 5.8, 5], { R: 2.6, dir: 1, sweep: 280 }), // low hook between
      B([[112, 36], [96, 38.5], [86, 36], [84.5, 31.5]], [5.6, 6.2, 6, 5.4], { R: 2.6, dir: 1, sweep: 280 }), // hook over the boss, outer
      B([[5.5, 6], [5.5, 33]], 6, null, { sharp: true }), // nose under the strap
      B([[12, 57], [12, 68], [36, 68.4], [40, 62]], [6, 6.6, 6.4, 6], { R: 3.0, dir: 1, sweep: 300 }, { sharp: true }), // high G toward the knob
      B([[50, 56], [62, 61], [69, 57.5]], [5.6, 6, 5], { R: 2.6, dir: -1, sweep: 280 }), // high hook outer
    ],
    eye: { c: [79, 24], d: 15, pupil: 2.8 },
    pits: [{ c: [31.5, 23.5], r: 1.4 }], // the deep hole at the G's centre
  }
}

export function drawLid(kit, panel, { seed = 0, y1 } = {}) {
  const W = panel.width, H = panel.height, cx = W / 2
  const D = lidDesign(kit)
  const plates = []
  for (const side of [1, -1]) for (const el of D.bands) plates.push({ outer: kit.elementContour(el, 0).map(([x, y]) => [cx + side * x, y]) })
  panel.raise((ctx) => ctx.fillRect(0, 0.8, W, 1.8), { height: 1.0, shoulder: 0.8, profile: 'plateau' }) // the border at the slope's foot
  kit.tracedPlates(panel, plates, { union: true, height: 2.4, shoulder: 1.5, pillow: 0.6, pillowWidth: 3.2, contour: { inset: 1.2, line: 0.7 }, depth: 0.5, seed })
  for (const side of [1, -1]) {
    const c = [cx + side * D.eye.c[0], D.eye.c[1]]
    panel.sink((ctx) => { ctx.beginPath(); ctx.arc(c[0], c[1], D.eye.d / 2 + 1.0, 0, Math.PI * 2); ctx.arc(c[0], c[1], D.eye.d / 2 + 0.3, 0, Math.PI * 2, true); ctx.fill() }, { depth: 0.6, shoulder: 0.3, profile: 'u' })
    kit.pillowBoss(panel, { c, w: D.eye.d, h: D.eye.d, round: 1, height: 4.0, crown: 0.6, slit: false, ring: false })
    panel.sink((ctx) => { ctx.beginPath(); ctx.arc(c[0], c[1], D.eye.pupil, 0, Math.PI * 2); ctx.fill() }, { depth: 2.0, shoulder: 0.8, profile: 'u' })
    for (const p of D.pits) {
      const pc = [cx + side * p.c[0], p.c[1]]
      panel.sink((ctx) => { ctx.beginPath(); ctx.arc(pc[0], pc[1], p.r, 0, Math.PI * 2); ctx.fill() }, { depth: 1.6, shoulder: 0.5, profile: 'u' })
    }
  }
  kit.ridgeGround(panel, { rect: { x: 0, y: 2.8, w: W, h: Math.min(H, y1 ?? H) - 2.8 }, avoid: 'raised' }, {
    pitch: 1.1, width: 0.66, height: 0.32, seed: seed + 3, leiwen: { cell: [4.4, 8.8], pairs: 0.25, maxAspect: 1.7 },
  })
  return D
}
