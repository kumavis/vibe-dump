// Nezu you 饕餮文卣 (90086) — the three FRIEZES (neck, lid skirt, foot) as rows of the bronze's own compact kui.
//
// Read off photo-31 developed onto each register (.work/ridge-nezu-you/develop.py, both halves averaged), face-neck /
// face-skirt / face-foot and detail-foot.jpg, and photo-32 for the outer parts. Each half of each frieze holds kui
// dragons CONFRONTED about the face's centre line (the pivot head on the neck, the strap on the skirt, the centre
// flange on the foot): every kui faces the axis. One kui is ONE continuous creature, drawn as fat banded plates
// (round shoulders ≈ 2 mm proud, one incised line inside the edge) unioned into one mass:
//   head   a squared block at the front with a round eye boss (pupil pit) in it
//   jaw    hooked down and forward from the head, rolled up at its tip
//   crest  a G-crest from the top of the head running back, rolled into a spiral above the body
//   body   from the head back along the lower half of the band, rising at the rear into a rolled tail
//   quills two hooked quills hanging from the body, a hooked dorsal fin above it
// Every gap is a ground of raised square spirals (one fat round thread). Photo-31 shows the first kui of each half
// clearly; the second (outer) kui of each half is seen only obliquely in photo-32 (on the neck) or not at all — it
// REPEATS the first; the back face repeats the front.

/** one kui in its canonical 62 × 26 mm frame: head at u = 0 facing −u, v = 0 at the frieze bottom */
export function kuiUnit(kit, map, ky = 1, o = {}) {
  const M = (pts) => pts.map(map)
  const S = (pts, w, opt = {}) => kit.roundStroke(M(pts), { width: Array.isArray(w) ? w.map((v) => v * ky) : w * ky, round: 0.8, inner: 0.35, start: 'flat', ...opt })
  const tailR = o.tailR ?? 2.8
  return {
    plates: [
      { outer: kit.roundPoly(M([[0.6, 6.4], [13.6, 6.4], [13.6, 22.9], [0.6, 22.9]]), { round: [2.6, 2, 3.6, 3] }) }, // head
      { outer: S([[3.4, 7.4], [3.4, 2.7], [11, 2.7]], 3.8, { end: 'spiral', spiral: { turns: 0.7, dir: 1, R: 1.5 } }) }, // jaw
      { outer: S([[12.5, 21.4], [36.5, 21.4], [36.5, 14.3], [27, 14.3]], 4.4, { end: 'spiral', spiral: { turns: 0.8, dir: -1, R: 2.1 } }) }, // crest
      { outer: S([[13, 9.9], [46, 9.9], [54.5, 11.4], [57.5, 16.8]], [5.2, 5.2, 4.8, 4.4], { end: 'spiral', spiral: { turns: 1, dir: 1, R: tailR, taper: 0.75 } }) }, // body → tail
      { outer: S([[22, 8], [22, 2.9], [28.5, 2.9]], 3.5, { end: 'spiral', spiral: { turns: 0.6, dir: 1, R: 1.3 } }) }, // quill
      { outer: S([[37, 8], [37, 2.9], [43.5, 2.9]], 3.5, { end: 'spiral', spiral: { turns: 0.6, dir: 1, R: 1.3 } }) }, // quill
      { outer: S([[41.5, 21.4], [52, 21.4], [52, 16]], 3.9, { end: 'spiral', spiral: { turns: 0.6, dir: -1, R: 1.5 } }) }, // dorsal fin
    ],
    eyes: [{ c: map([7.1, 15.2]), d: 5.6 * ky }],
  }
}

/**
 * Draw a confronted kui frieze.
 * spec: { band: [y0, y1] (the frieze between its borders), borders: [[y0, y1]…], units: [[x0, x1]…] (each kui's span,
 *         panel x from the centre line, head at x0), cords: [{ y, width }], tailR, height, ground: ridge profile }
 */
export function drawFrieze(kit, panel, size, spec, { seed = 0 } = {}) {
  const W = panel.width, H = panel.height, cx = W / 2
  const hw = (y) => { const yy = Math.max(0, Math.min(H, y)); return size.widthAt ? size.widthAt(yy) / 2 : size.rAt ? (Math.PI * size.rAt(yy)) / 2 : W / 2 }
  const [yb, yt] = spec.band
  const ky = Math.min(1, (yt - yb) / 26)
  const plates = [], eyes = []
  for (const side of [1, -1]) {
    for (const [x0, x1] of spec.units) {
      const kx = (x1 - x0) / 62
      const map = ([u, v]) => [cx + side * (x0 + u * kx), yb + v * ky]
      const k = kuiUnit(kit, map, ky, spec)
      for (const p of k.plates) plates.push({ outer: kit.elementContour(p.outer, 0) })
      eyes.push(...k.eyes)
    }
  }
  // borders and cords: low rounded bands, full width
  for (const [y0, y1] of spec.borders || []) panel.raise((ctx) => ctx.fillRect(0, y0, W, y1 - y0), { height: 1.0, shoulder: (y1 - y0) * 0.45, profile: 'plateau' })
  for (const c of spec.cords || []) kit.plainCord(panel, { x0: 0, x1: W, y: c.y, width: c.width ?? 1.8, height: c.height ?? 1.0 })
  kit.tracedPlates(panel, plates, {
    union: true, height: spec.height ?? 2.0, shoulder: 1.0, pillow: 0.3, pillowWidth: 2.2,
    contour: { inset: 0.95, line: 0.62 }, depth: 0.45, seed,
  })
  for (const e of eyes) {
    panel.sink((ctx) => { ctx.beginPath(); ctx.arc(e.c[0], e.c[1], e.d / 2 + 0.75, 0, Math.PI * 2); ctx.fill() }, { depth: 0.9, shoulder: 0.4, profile: 'u' })
    kit.pillowBoss(panel, { c: e.c, w: e.d, h: e.d, round: 1, height: 2.6, crown: 0.7, slit: false, ring: false })
    panel.sink((ctx) => { ctx.beginPath(); ctx.arc(e.c[0], e.c[1], e.d * 0.2, 0, Math.PI * 2); ctx.fill() }, { depth: 1.4, shoulder: 0.4, profile: 'u' })
  }
  const inside = (ctx) => {
    ctx.beginPath()
    for (let y = yb - 0.5; y <= yt + 0.5; y += 1) ctx.lineTo(cx + hw(y) - 3.6, y)
    for (let y = yt + 0.5; y >= yb - 0.5; y -= 1) ctx.lineTo(cx - hw(y) + 3.6, y)
    ctx.closePath(); ctx.fill()
  }
  const g = spec.ground || {}
  kit.ridgeGround(panel, { rect: { x: 0, y: yb, w: W, h: yt - yb }, include: inside, avoid: 'raised' }, {
    pitch: g.pitch ?? 1.05, width: g.width ?? 0.68, height: g.height ?? 0.5, seed: seed + 3, leiwen: { cell: [3.6, 7], pairs: 0.25, maxAspect: 1.7 },
  })
}

// the three friezes (right half; panel x from the centre line)
export const NECK_FRIEZE = { band: [8.6, 33.9], borders: [[7.2, 8.5], [34, 35.2]], cords: [{ y: 2.6, width: 1.7 }, { y: 5.2, width: 1.7 }], units: [[15, 78], [81, 143.5]] }
export const SKIRT_FRIEZE = { band: [2.3, 24.9], borders: [[0.9, 2.2], [25, 26.3]], units: [[14.5, 81], [84, 148]], tailR: 3.6, height: 1.9 }
export const FOOT_FRIEZE = { band: [2.4, 23.8], borders: [[0.9, 2.3], [23.9, 25.3]], units: [[4.5, 67], [69.5, 129.5]], height: 1.8, ground: { pitch: 1.0, width: 0.65, height: 0.48 } }
