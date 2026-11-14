// Met fangding 49.135.2 — legs and flanges (detail-leg.jpg, detail-flange-corner.jpg, detail-flange-centre.jpg,
// face-long.jpg, three-quarter.jpg). Units mm.

/**
 * Leg décor: incised thread lines only (Style I/II-like, NOT relief), on the upper ≈ 45 mm of each leg,
 * outward half: two rings at the top, a band of hooked scrolls in boxes, a third ring, then pendant
 * blades with a scroll in each, fading out down the leg (detail-leg.jpg, side.jpg). Line work after the
 * photographs at the level they resolve it (≈ 3 px/mm on the legs): the layout is measured, the exact
 * curl of each scroll is not.
 */
export function legPanel(kit, size, { ppmm, seed }) {
  const { w, h } = size
  const p = new kit.ReliefPanel({ width: w, height: h, ppmm, seed })
  const top = h - 1.5
  const n = 3 // scroll units across the visible face (detail-leg: three boxes on the front half)
  const uw = w / n
  p.sink((ctx) => {
    ctx.lineWidth = 0.55
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    const line = (pts) => {
      ctx.beginPath()
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
      ctx.stroke()
    }
    // rings
    for (const y of [top, top - 2.4, top - 15.5]) line([[0, y], [w, y]])
    for (let k = 0; k < n; k++) {
      const x0 = k * uw, xm = x0 + uw / 2
      // scroll band: a squared hook (┌ then a curl) per box, the box divided by short uprights
      const yb = top - 14.3, yt = top - 3.6
      line([[x0 + 0.8, yb], [x0 + 0.8, yt]])
      line([[x0 + uw * 0.18, yb + 1.2], [x0 + uw * 0.18, yt - 1.2], [xm + uw * 0.18, yt - 1.2], [xm + uw * 0.18, yb + 3.5]])
      const c = [xm - uw * 0.05, yb + 4.6]
      const pts = []
      for (let i = 0; i <= 26; i++) {
        const a = Math.PI * 0.1 + (i / 26) * Math.PI * 1.75
        const r = 3.4 * (1 - (i / 26) * 0.62)
        pts.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)])
      }
      line(pts)
      // pendant blade: a long narrow V hanging from the band, a scroll pair inside its upper half
      const yb2 = top - 16.5, yTip = Math.max(2, top - 44)
      line([[x0 + uw * 0.12, yb2], [xm, yTip], [x0 + uw * 0.88, yb2]])
      for (const s of [-1, 1]) {
        const cc = [xm + s * uw * 0.14, yb2 - 7]
        const sp = []
        for (let i = 0; i <= 20; i++) {
          const a = (s > 0 ? Math.PI : 0) + s * (i / 20) * Math.PI * 1.6
          const r = 2.6 * (1 - (i / 20) * 0.6)
          sp.push([cc[0] + r * Math.cos(a), cc[1] + r * Math.sin(a)])
        }
        line(sp)
      }
      line([[xm, yb2 - 12], [xm, yb2 - 20]])
    }
  }, { depth: 0.28, profile: 'u' })
  return p.bake()
}

/**
 * Corner flange (a slab on the 45° bisector, ≈ 8.5 mm proud of the arris, from the mask register's
 * bottom to the frieze top): a plain slab with two lugs that stand ≈ 5 mm further out, one at its top
 * end and one on the frieze / mask border, and incised T marks on both faces (detail-flange-corner.jpg,
 * three-quarter.jpg). Returns { outline, grooves } in (σ along the flange from its bottom, t outward).
 */
export function cornerOutline(L, { p = 8.5, lug = 5, e = 2.5, lugAt }) {
  const r = 1.2
  const pts = [[0, -e], [L, -e],
    [L, p + lug - r], [L - r, p + lug], [L - 4.2, p + lug], [L - 4.6, p + lug - 1], [L - 5, p],
    [lugAt + 2.2, p], [lugAt + 1.8, p + lug - 1], [lugAt + 1.2, p + lug], [lugAt - 1.8, p + lug], [lugAt - 2.4, p + lug - 1], [lugAt - 2.6, p],
    [1.2, p], [0, p - 1.2]]
  const grooves = []
  // T marks: a bar across the face and a stem along it, every ≈ 11 mm (the same rhythm as the margins)
  for (let s = 6; s < L - 8; s += 11.5) {
    if (Math.abs(s - lugAt) < 3.5) continue
    grooves.push([[s, 1.2], [s, p - 1.6]])
    grooves.push([[s, p * 0.55], [s - 5.5, p * 0.55]])
  }
  return { outline: pts, grooves }
}

/**
 * Centre flange (the mask's nose ridge, through both registers): a plain rib with a block at its top end
 * and a lug where it crosses the fillet between frieze and mask (face-long.jpg, detail-flange-centre.jpg).
 */
export function centreOutline(L, { p, lug, e = 2, lugAt, marks = false }) {
  const r = 1
  const pts = [[0, -e], [L, -e], [L, p + lug - r], [L - r, p + lug], [L - 5.5, p + lug], [L - 6.2, p],
    [lugAt + 2.6, p], [lugAt + 2.1, p + lug - 0.6], [lugAt - 2.1, p + lug - 0.6], [lugAt - 2.6, p],
    [r, p], [0, p - r]]
  const grooves = []
  if (marks) {
    // the short-face centre flange carries T marks on its sides (three-quarter.jpg)
    for (let s = 5; s < L - 9; s += 11.5) {
      if (Math.abs(s - lugAt) < 3.5) continue
      grooves.push([[s, 1], [s, p - 1.4]])
      grooves.push([[s, p * 0.5], [s - 5, p * 0.5]])
    }
  }
  return { outline: pts, grooves }
}
