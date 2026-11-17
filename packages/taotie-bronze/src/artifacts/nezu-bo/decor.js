// Nezu bo 蟠螭文鎛 (90120) — the décor of the HALF-FACES (centre line → edge), in panel mm, drawn with the kit's
// woven interlace (relief/weave.js; KIT.md § Woven interlace).
//
// bo-fix: every woven zone re-read at full resolution on photo-18 / 19 and the developed faces/dev-*.jpg (unit-cell
// drawings in .work/bo-fix/weave-unit-*.png, summarised in KIT.md). One idiom throughout: flat raised ribbons of THREE
// ribs (rib ≈ 1.6–1.75 mm, groove ≈ 0.55 mm), solid dragon heads with ringed eyes, crests, hooks and knobs, a plain
// ground, and a real over-under where two bodies cross. Per zone:
//   top band      a chain of interlocked C-rings, 12 sites of 38.5 mm (true) per face, flipped by turns — a straight
//                 repeat ROUND the bell (whole number of sites per face)
//   centre panel  one column per half of eight cells (scroll, four dragons, scroll, two dragons), every second turned
//                 180°, S-links between; the two columns REPEAT (photo-18: not mirrored)
//   bands (篆)    five G-framed dragons and a crossed ring per half, MIRRORED about the face centre (photo-18)
//   field (鼓)    dragons in nested G-frames, cells 62 × 31.6 mm (true), rows flipped by turns, a straight repeat
//                 round the bell; its lowest row (the base band) worn almost flat
// Mirrored zones are the same on both half-face panels; repeated zones need a panel per side: panel x = s on the
// right half, x = −s on the left (s = developed mm from the face centre, + to the right seen from outside; the left
// half-face's mesh mirrors x, so the left panel draws the pattern mirrored and the bronze shows it repeated). With a
// whole number of repeats per FACE the pattern closes round the bell, the back face repeating the front.
//
// Panel frame: x = 0 on the face centre line → x = PANEL_W at the edge (angle-proportional across the face, see
// form.js); y = body height − y0 of the panel.

import { LAYOUT, PANEL_W, H, halfLength, ARC_END } from './form.js'

/** panel mm per TRUE mm across the face at body height y (the panel is angle-proportional) */
const kAt = (y) => PANEL_W / (halfLength(y) * ARC_END)

function clonePanel(kit, src, seed) {
  const p = new kit.ReliefPanel({ width: src.width, height: src.height, ppmm: src.ppmm, maxSize: Math.max(src.cols, src.rows) + 1, seed })
  p.field.set(src.field)
  p.groove.set(src.groove)
  return p
}

/** raised plain strip / rect (ledges, frames): plateau with a rounded shoulder */
function strips(panel, rects, h, shoulder) {
  panel.raise((ctx) => {
    ctx.beginPath()
    for (const [x0, y0, x1, y1] of rects) ctx.rect(x0, y0, x1 - x0, y1 - y0)
    ctx.fill()
  }, { height: h, shoulder })
}

/** two strands twisting round each other (the edge strip): three-ribbed ribbons crossing over and under by turns */
function guilloche(kit, s0, s1, tc, amp, period, w) {
  const E = kit.weaveEls()
  const half = period / 2, n = Math.ceil((s1 - s0) / half) + 2
  for (let strand = 0; strand < 2; strand++) {
    for (let k = -1; k < n; k++) {
      // a segment runs from one turning point to the next, so the crossings fall in its middle
      const a = s0 + k * half + half / 2, b = a + half
      const pts = []
      for (let i = 0; i <= 16; i++) {
        const s = a - 0.4 + ((b - a + 0.8) * i) / 16
        pts.push([tc + (strand ? -1 : 1) * amp * Math.sin(((s - s0) / period) * Math.PI * 2), s])
      }
      E.ribbons.push({ pts, w, z: (k + strand + 4) % 2, group: 'strand' + strand })
    }
  }
  return E
}

/**
 * The upper zone: ledges, frames, the bands, the edge strip (shared), then per side the central panel's column and the
 * top band. → { R, L } (ReliefPanels, not baked)
 */
export function upperPanels(kit, { ppmm, seed, y0 }) {
  const Hh = H - y0
  const panel = new kit.ReliefPanel({ width: PANEL_W, height: Hh, ppmm, seed })
  const Y = (y) => y - y0
  const P = LAYOUT.panel, F = LAYOUT.frame
  const xEnd0 = LAYOUT.end[0], xEnd1 = PANEL_W - 1.6
  const pHalf = (y) => P.bottom + ((P.top - P.bottom) * (y - P.y[0])) / (P.y[1] - P.y[0]) // the panel's frame edge at body y
  const topLedge = LAYOUT.ledges[LAYOUT.ledges.length - 1]

  // --- ledges and frames: raised strips (2.2 mm proud, rounded), each ledge ≈ 5 mm with its shadowed foot below
  const led = LAYOUT.ledges.map(([a, b], i) => {
    const top = b, bot = Math.max(a, b - 5.2)
    return i === LAYOUT.ledges.length - 1 ? [1.6, Y(bot), xEnd1, Y(top)] : [pHalf((a + b) / 2) - 0.5, Y(bot), xEnd0 + 0.6, Y(top)]
  })
  strips(panel, [...led, [xEnd0 - 0.2, Y(LAYOUT.border[1]) - 1, xEnd0 + F - 0.2, Y(topLedge[1] - 1)]], 2.2, 1.1)
  panel.raise((ctx) => {
    ctx.beginPath()
    const [ya, yb] = P.y
    ctx.moveTo(pHalf(ya) - F, Y(ya) - 1); ctx.lineTo(pHalf(ya), Y(ya) - 1); ctx.lineTo(pHalf(yb), Y(yb)); ctx.lineTo(pHalf(yb) - F, Y(yb)); ctx.closePath()
    ctx.fill()
  }, { height: 2.2, shoulder: 1.1 })
  strips(panel, [[1.6, Y(LAYOUT.border[0]), xEnd1, Y(LAYOUT.border[1])]], 2.8, 2.6)

  // --- the bands (篆), preset bo-band: per half from the panel outward five G-framed dragons and the crossed ring
  //     (cell borders traced on faces/dev-band.jpg); the snouts look toward the centre, units 2 and 5 carry the crest
  //     hook; mirrored about the face centre, so the same on both panels
  const band = kit.WEAVE_PRESETS['bo-band']
  const wB = kit.ribbonWidth(band.ribs, band.rib, band.groove)
  const UNITS = [[33, 79, 'stalk'], [79.5, 113, 'hook'], null, [129, 170.5, 'stalk'], [171, 217, 'hook'], [217.5, 242.4, 'stalk']]
  const bandEls = kit.weaveEls()
  for (const [b0, b1] of LAYOUT.bands) {
    const yb = Y(b0) + 0.4, T = b1 - b0 - 0.8
    for (const u of UNITS) {
      if (!u) {
        kit.weaveMerge(bandEls, kit.weaveMap(kit.weaveCell('ring', 16, T, { w: wB, half: 10.6 }), ([s, t]) => [113 + s, yb + t]))
        continue
      }
      const [xa, xb, crest] = u
      const E = kit.weaveCell('dragon', xb - xa, T, { ...band.params, w: wB, crest })
      kit.weaveMerge(bandEls, kit.weaveMap(E, ([s, t]) => [xa + s, yb + t]))
    }
  }
  const bandClip = (ctx) => { for (const [b0, b1] of LAYOUT.bands) ctx.rect(pHalf(b1) + 0.2, Y(b0) + 0.2, xEnd0 - pHalf(b1) - 0.4, b1 - b0 - 0.4) }
  kit.renderWeave(panel, bandEls, { ribs: band.ribs, groove: band.groove, height: 1.1, depth: 0.45, clip: bandClip })

  // --- the edge strip: twisted pairs (mirrored zone)
  const xs0 = xEnd0 + F + 0.4, xs1 = xEnd1 - 0.4
  const edge = guilloche(kit, Y(LAYOUT.border[1]) + 1, Y(topLedge[0]), (xs0 + xs1) / 2, (xs1 - xs0) / 2 - 2.1, 21, 4.0)
  kit.renderWeave(panel, edge, { ribs: 3, groove: 0.4, height: 1.0, depth: 0.38, clip: (ctx) => ctx.rect(xs0 - 0.6, Y(LAYOUT.border[1]) + 0.2, xs1 - xs0 + 1.2, Y(topLedge[0]) - Y(LAYOUT.border[1]) - 0.4) })

  // --- per side: the repeated zones
  const R = panel, L = clonePanel(kit, panel, seed + 7)
  // the central panel (preset bo-centre-panel): one column, cells as wide as the panel's narrowest half
  const cp = kit.WEAVE_PRESETS['bo-centre-panel']
  const ya = LAYOUT.border[1] + 0.8, yb = topLedge[0] - 0.5
  const xa = 1.4, xb = Math.min(pHalf(P.y[0]), pHalf(P.y[1])) - F - 0.3
  const col = kit.weaveTile({ x: xa, y: Y(ya), w: xb - xa, h: yb - ya }, { ...cp, cell: [xb - xa] })
  const colClip = (ctx) => {
    ctx.moveTo(1.6, Y(LAYOUT.border[1]) + 0.2); ctx.lineTo(pHalf(P.y[0]) - F - 0.2, Y(LAYOUT.border[1]) + 0.2)
    ctx.lineTo(pHalf(P.y[1]) - F - 0.2, Y(topLedge[0]) - 0.2); ctx.lineTo(1.6, Y(topLedge[0]) - 0.2); ctx.closePath()
  }
  const colR = { ribs: cp.ribs, groove: cp.groove, height: 1.1, depth: 0.45, clip: colClip }
  kit.renderWeave(R, col.els, colR)
  kit.renderWeave(L, kit.weaveMap(col.els, ([x, y]) => [xa + xb - x, y]), colR) // the same column, repeated on the bronze
  // the top band (preset bo-top-band): tiled in TRUE mm round the face, a whole even number of sites per face
  const tb = LAYOUT.topBand, tp = kit.WEAVE_PRESETS['bo-top-band']
  const yMid = (tb[0] + tb[1]) / 2, k = kAt(yMid)
  const Wt = (xEnd1 + 1.6) / k // true half-face width at the band
  const tRect = { x: 0, y: Y(tb[0]) + 0.3, w: Wt, h: tb[1] - tb[0] - 1.6 }
  const tClip = (ctx) => ctx.rect(1.0, Y(tb[0]) + 0.2, xEnd1 - 1.0, tb[1] - tb[0] - 1.4)
  const tR = { ribs: tp.ribs, groove: tp.groove, height: 1.05, depth: 0.42, clip: tClip }
  const chainR = kit.weaveTile(tRect, { ...tp, cell: [tp.cell[0], tRect.h], wrap: 2 * Wt, phase: 0, map: ([x, y]) => [x * k, y] })
  kit.renderWeave(R, chainR.els, tR)
  const chainL = kit.weaveTile(tRect, { ...tp, cell: [tp.cell[0], tRect.h], wrap: 2 * Wt, phase: -Wt, map: ([x, y]) => [(Wt - x) * k, y] })
  kit.renderWeave(L, chainL.els, tR)
  R.userData = { topSites: chainR.count, topPitch: chainR.pitch }
  return { R, L }
}

/** The lower field (preset bo-field; the worn lowest row = bo-base-band). → { R, L } */
export function lowerPanels(kit, { ppmm, seed, height }) {
  const panel = new kit.ReliefPanel({ width: PANEL_W, height, ppmm, seed })
  const R = panel, L = clonePanel(kit, panel, seed + 7)
  const [f0, f1] = LAYOUT.field
  const fp = kit.WEAVE_PRESETS['bo-field'], bp = kit.WEAVE_PRESETS['bo-base-band']
  const k = kAt((f0 + f1) / 2)
  const Wt = PANEL_W / k
  const rowH = (f1 - f0) / 4
  // the phase puts a head column ≈ 35 mm right of the centre line (faces/dev-lower-19.jpg: eyes at s ≈ 35, 95, 157)
  const phase0 = 62 - 35 + 7.4
  const clip = (ctx) => ctx.rect(1.6, f0, PANEL_W - 3.2, f1 - f0)
  for (const [P, side] of [[R, 1], [L, -1]]) {
    const map = side > 0 ? ([x, y]) => [x * k, y] : ([x, y]) => [(Wt - x) * k, y]
    const phase = side > 0 ? phase0 : phase0 - Wt
    const cell = [fp.cell[0], rowH]
    const fresh = kit.weaveTile({ x: 0, y: f0 + rowH, w: Wt, h: 3 * rowH }, { ...fp, cell, count: [0, 3], wrap: 2 * Wt, phase, map })
    kit.renderWeave(P, fresh.els, { ribs: fp.ribs, groove: fp.groove, height: 1.0, depth: 0.42, clip })
    const worn = kit.weaveTile({ x: 0, y: f0, w: Wt, h: rowH }, { ...bp, cell, count: [0, 1], row0: 3, wrap: 2 * Wt, phase, map })
    kit.renderWeave(P, worn.els, { ribs: bp.ribs, groove: bp.groove, height: bp.height, depth: bp.depth, shoulder: bp.shoulder, clip })
    if (side > 0) R.userData = { fieldRepeats: fresh.count, fieldPitch: fresh.pitch }
  }
  return { R, L }
}
