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

/**
 * Roll the end of a centre line into a coil: from its last point, turning toward `dir` (+1 = left of travel), radius R0
 * shrinking `shrink` mm per turn (band width + gap keeps the turns apart), through `sweep` degrees. → the extended path.
 */
export function curlPath(pts, { R = 4.5, sweep = 270, dir = 1, shrink = 5.6, step = 0.5 } = {}) {
  const E = pts[pts.length - 1], F = pts[pts.length - 2]
  const l = Math.hypot(E[0] - F[0], E[1] - F[1]) || 1
  const d = [(E[0] - F[0]) / l, (E[1] - F[1]) / l], nl = [-d[1] * dir, d[0] * dir]
  const c = [E[0] + nl[0] * R, E[1] + nl[1] * R]
  const th0 = Math.atan2(E[1] - c[1], E[0] - c[0])
  const out = pts.slice()
  const sw = (sweep * Math.PI) / 180
  for (let ph = step / R; ph <= sw; ph += step / Math.max(1, R)) {
    const r = R - (shrink * ph) / (2 * Math.PI)
    if (r < 0.6) break
    out.push([c[0] + Math.cos(th0 + dir * ph) * r, c[1] + Math.sin(th0 + dir * ph) * r])
  }
  return out
}

/** one kui in its canonical 62 × 26 mm frame: head at u = 0 facing −u, v = 0 at the frieze bottom */
export function kuiUnit(kit, map, ky = 1, o = {}) {
  const M = (pts) => pts.map(map)
  const S = (pts, w, opt = {}) => kit.roundStroke(M(pts), { width: Array.isArray(w) ? w.map((v) => v * ky) : w * ky, round: 0.8, inner: 0.35, start: 'flat', end: 'round', ...opt })
  const C = (pts, curl, w) => curlPath(pts, { shrink: w + 1.5, ...curl }) // a coiled end (design frame)
  const tailR = o.tailR ?? 5.3
  return {
    plates: [
      { outer: kit.roundPoly(M([[0.4, 6.2], [13.8, 6.2], [13.8, 25.2], [0.4, 25.2]]), { round: [2.4, 2, 3.8, 3.4] }) }, // tall squared head
      { outer: S(C([[10.4, 6.8], [10.4, 3.0], [5.6, 3.0]], { R: 1.9, sweep: 170, dir: -1 }, 4.2), 4.2) }, // jaw: down and forward, rolled up
      { outer: S(C([[13.2, 15.6], [25.5, 15.6]], { R: 3.8, sweep: 300, dir: 1 }, 5), 5) }, // crest: back from the head, rolled up and over
      { outer: S(C([[13.2, 8.8], [43.5, 8.8]], { R: tailR, sweep: 300, dir: 1 }, 5.8), 5.8) }, // body → tail rolled up and over (the G)
      { outer: S(C([[44.5, 21.6], [55.5, 22.3]], { R: 2.2, sweep: 170, dir: -1 }, 4), 4) }, // dorsal quill off the tail, hooked down
      { outer: S(C([[30.5, 6], [30.5, 2.7], [18, 2.7]], { R: 1.7, sweep: 170, dir: -1 }, 4), 4) }, // leg, hooked up at its front
      { outer: S([[47.5, 6.4], [47.5, 2.7], [58.5, 2.7]], 4) }, // claw under the tail
    ],
    eyes: [{ c: map([6.9, 16.2]), w: 7.2 * ky, h: 5.8 * ky }],
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
    union: true, height: spec.height ?? 2.2, shoulder: 1.15, pillow: 0.35, pillowWidth: 2.4,
    contour: { inset: 1.05, line: 0.72 }, depth: 0.5, seed,
  })
  for (const e of eyes) { // the kui eye: a rounded-oblong boss in a sunk socket, a slit pupil (photo: neck, foot)
    panel.sink((ctx) => { ctx.beginPath(); ctx.ellipse(e.c[0], e.c[1], e.w / 2 + 0.8, e.h / 2 + 0.8, 0, 0, Math.PI * 2); ctx.fill() }, { depth: 0.9, shoulder: 0.4, profile: 'u' })
    kit.pillowBoss(panel, { c: e.c, w: e.w, h: e.h, round: 0.55, height: 2.5, crown: 0.75, slit: { len: e.w * 0.5, width: 0.8, depth: 0.7 }, ring: false })
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
export const NECK_FRIEZE = { band: [8.6, 33.9], borders: [[7.2, 8.5], [34, 35.2]], cords: [{ y: 2.6, width: 1.7 }, { y: 5.2, width: 1.7 }], units: [[21.5, 82], [84, 144.5]] }
export const SKIRT_FRIEZE = { band: [2.3, 24.9], borders: [[0.9, 2.2], [25, 26.3]], units: [[14.5, 81], [84, 148]], tailR: 5.3, height: 2.1 }
export const FOOT_FRIEZE = { band: [2.4, 23.8], borders: [[0.9, 2.3], [23.9, 25.3]], units: [[4.5, 67], [69.5, 129.5]], height: 2.0, ground: { pitch: 1.0, width: 0.65, height: 0.48 } }
