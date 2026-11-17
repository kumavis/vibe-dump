// Nezu hu — the décor panels. Both bands are rows of ONE stamped panchi unit (kit.panchiBand, unit 'nezu-hu',
// traced off photo-11 developed onto the shoulder: reference/nezu-hu/faces/dev-shoulder.jpg); the cords between
// them are plain round cords and a twisted rope (kit.plainCord / kit.ropeCord). Panels are laid 1:1 ('true' map)
// on two sectors centred on the front and the back (seams under the handles, ±90°); the pattern is periodic over
// each row's half circumference, so the two sectors share one panel and meet without a break.
//
// Rows and counts are counted on the photograph (dossier §c): shoulder 4 rows of ≈ 17.7 mm, body 9 rows of
// ≈ 17.5 mm; one block ≈ 48 mm wide (the developed image's ≈ 48 mm repeat), so each row carries round(πr / 48) blocks per
// half turn at its own radius — the cells narrow up the shoulder as the stamped rows do.

import { LV } from './form.js'
import INSCRIPTION from '../../../reference/nezu-hu/inscription.json'
import UNITS from '../../../reference/nezu-hu/panchi-units.json'

// hu-fix round 2: the BELLY's own unit (reference/nezu-hu/panchi-units.json, drawing .work/hu-fix/unit-body.png): 47.2 ×
// 17.9 mm, three 15.7 mm frames the full row height — a squared C with a nested C and a tongue, a ∩ with a nested U
// hanging from its top bar, a U with an inner ∩ hook — long top / bottom bars running on from frame to frame ≈ 2 mm
// inside the row borders, so the rows nearly touch. Rows are a STRAIGHT repeat (not mirrored); the phase of each row is
// the one fitted on the developed photograph (NCC of the unit's band mask, rows 1–5), the rest continue ≈ 3.4 mm a row.
// Phases in mm: where a unit starts, right of the front centre line.
const BELLY_PHASE = [27.1, 30.5, 30.5, 3.5, 34.0, 37.0, 40.4, 43.8, 0.0]

// hu-fix: every band carries a fine incised MEDIAN LINE down its centre (photo-11 at 6×, .work/hu-fix/crops/b1-s.png,
// s1-s.png: each band reads as two pale crests split by a dark hairline — band ≈ 2.3–2.8 mm, groove ≈ 0.4–0.5 mm,
// running unbroken round the corners and through the joins, stopping short of the knobbed heads; a few heads show
// a dark centre, an eye). At 5 px/mm (q 1) the groove is ≈ 2.3 px, at the phone cap (q 0.5, 2048 px) ≈ 1.6 px;
// the geometry is displaced by the low-passed field, so the line lives in the normal map and the cavity channel.
export const MEDIAN = { width: 0.46, depth: 0.32, inset: 0.45, profile: 'v', eye: { r: 0.38 } }
// hu-fix round 2: the shoulder keeps the r8 unit 'nezu-hu' (it fits the shoulder better than the belly's unit: NCC
// .10 / .08 / .11 vs .07 / .03 / −.04 on the developed rows) at 2.4 mm bands
// strands ≈ 2.1 mm, round-shouldered with a narrow flat top, ≈ 1.4 mm proud; knobs and pellets a little prouder
const RIB = { median: MEDIAN, rib: 2.4, height: 1.7, profile: 'plateau', shoulder: 0.8, knob: 1.45, knobHeight: 2.0, jitter: 0.35, wobble: 0.14, wavelength: 16, swell: 0.08 }

/** a flat-topped ledge (plateau section, crisp shoulders) */
function flatCord(panel, x0, x1, y, width, height) {
  panel.raise((ctx) => { ctx.fillRect(x0, y - width / 2, x1 - x0, width) }, { height, profile: 'plateau', shoulder: 0.45 })
}

/** arc mm from the register's bottom for a height y */
const arcOf = (P, y0) => (y) => P.sAtY(y) - P.sAtY(y0)

/**
 * The lower body band + the cords above it. Register y LV.body[0] → LV.cords[1].
 * size: lathe sector size (true map): width, height (arc mm), widthAt(arc)
 */
export function bodyPanel(kit, P, size, { ppmm, seed }) {
  const W = size.width, H = size.height
  const panel = new kit.ReliefPanel({ width: W, height: H, ppmm, seed })
  const A = arcOf(P, LV.body[0])
  const top = A(LV.body[1]) - 0.9
  const bottom = 0.9
  const rect = { x: 0, y: bottom, w: W, h: top - bottom }
  const U = UNITS.belly
  const rowH = rect.h / 9
  const rows = []
  for (let k = 0; k < 9; k++) {
    // the cell this row will get (panchiBand: round(width / unit.w)) → the phase as a fraction of it
    const cell = size.widthAt(rect.y + rect.h - (k + 0.5) * rowH) / Math.max(1, Math.round(size.widthAt(rect.y + rect.h - (k + 0.5) * rowH) / U.w))
    rows.push({ weight: 1, shift: BELLY_PHASE[k] / cell })
  }
  // bands 3.0 mm (the split band's two crests + shoulders; the reviewers' 2.5–3), channels 0.3–1.5 mm, swollen heads r 2
  kit.panchiBand(panel, rect, { unit: U, rows, ...RIB, rib: 2.9, height: 2.0, shoulder: 0.7, knob: 2.0, knobHeight: 2.4, centre: W / 2, rowWidth: (y) => size.widthAt(y), seed })
  // cords: plain (224.4), twisted rope (229.7), plain (236.4)
  const yc = (y) => A(y)
  // photo-11 (detail-cord): a broad flat ledge, a plain strip, the rope (long sloping strands ≈ 5.5 mm apart), a plain
  // strip, a second flat ledge under the shoulder band — the cords are flat-topped ledges, not round wires
  flatCord(panel, 0, W, yc(224.2), 3.2, 1.1)
  kit.ropeCord(panel, { x0: 0, x1: W, y: yc(229.7), width: 3.4, height: 1.6, pitch: 5.5, slant: 58, line: 0.75 })
  flatCord(panel, 0, W, yc(235.9), 3.0, 1.1)
  return panel.bake()
}

/** the shoulder band + the rope at the foot of the neck. Register y LV.shoulder[0] → 316. */
export function shoulderPanel(kit, P, size, { ppmm, seed }) {
  const W = size.width, H = size.height
  const panel = new kit.ReliefPanel({ width: W, height: H, ppmm, seed })
  const A = arcOf(P, LV.shoulder[0])
  const top = A(LV.shoulder[1]) - 0.7
  const rect = { x: 0, y: 1.0, w: W, h: top - 1.0 }
  const rows = []
  for (let k = 0; k < 4; k++) rows.push({ weight: 1, mirror: k % 2 === 1, shift: k % 2 ? 0.5 : 0 })
  kit.panchiBand(panel, rect, { unit: 'nezu-hu', rows, ...RIB, centre: W / 2, rowWidth: (y) => size.widthAt(y), seed: seed + 3 })
  kit.ropeCord(panel, { x0: 0, x1: W, y: A(LV.rope), width: 3.2, height: 1.5, pitch: 5.0, slant: 58, line: 0.7 })
  return panel.bake()
}

/**
 * The neck, front sector only: the incised inscription — seven columns on the front of the neck, ≈ 25 graphs,
 * HAND-TRACED stroke by stroke off photo-11 developed onto the neck (reference/nezu-hu/inscription.json, hu-fix): only
 * the strokes the photograph shows, none completed or guessed; graphs under lime are left incomplete. Thin, even
 * V-cut lines (≈ 0.6 mm wide, 0.3 mm deep): the strokes are hairlines that cut across the surface — engraved, not
 * cast (dossier §c). Register y 316 → 422; the tracing's frame starts at y 318.
 */
export function neckPanel(kit, P, size, { ppmm, seed, y0 = 316 }) {
  const W = size.width, H = size.height
  const panel = new kit.ReliefPanel({ width: W, height: H, ppmm, seed })
  const I = INSCRIPTION
  const off = P.sAtY(I.y0) - P.sAtY(y0)
  panel.sink((ctx) => {
    ctx.lineWidth = I.stroke.width
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    for (const g of Object.values(I.graphs)) {
      for (const s of g.s) {
        ctx.moveTo(W / 2 + s[0][0], off + s[0][1])
        for (let i = 1; i < s.length; i++) ctx.lineTo(W / 2 + s[i][0], off + s[i][1])
      }
    }
    ctx.stroke()
  }, { depth: I.stroke.depth, profile: 'v', shoulder: I.stroke.width / 2 })
  return panel.bake()
}
