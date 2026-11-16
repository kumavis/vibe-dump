// Nezu hu — the décor panels. Both bands are rows of ONE stamped panchi unit (kit.panchiBand, unit 'nezu-hu',
// traced off photo-11 developed onto the shoulder: reference/nezu-hu/faces/dev-shoulder.jpg); the cords between
// them are plain round cords and a twisted rope (kit.plainCord / kit.ropeCord). Panels are laid 1:1 ('true' map)
// on two sectors centred on the front and the back (seams under the handles, ±90°); the pattern is periodic over
// each row's half circumference, so the two sectors share one panel and meet without a break.
//
// Rows and counts are counted on the photograph (dossier §c): shoulder 4 rows of ≈ 17.7 mm, body 9 rows of
// ≈ 17.5 mm; a unit ≈ 24 mm wide (≈ 48 mm repeat with its mirror), so each row carries round(πr / 24) units per
// half turn at its own radius — the cells narrow up the shoulder as the stamped rows do.

import { LV } from './form.js'

const RIB = { rib: 1.55, height: 1.05, knob: 1.3, knobHeight: 1.35, jitter: 0.14 }

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
  const rows = []
  for (let k = 0; k < 9; k++) rows.push({ weight: 1, mirror: k % 2 === 1, shift: k % 2 ? 0.5 : 0 })
  kit.panchiBand(panel, rect, { unit: 'nezu-hu', rows, ...RIB, centre: W / 2, rowWidth: (y) => size.widthAt(y), seed })
  // cords: plain (224.4), twisted rope (229.7), plain (236.4)
  const yc = (y) => A(y)
  kit.plainCord(panel, { x0: 0, x1: W, y: yc(224.2), width: 2.4, height: 1.2 })
  kit.ropeCord(panel, { x0: 0, x1: W, y: yc(229.7), width: 3.6, height: 1.6, pitch: 2.5, slant: 52 })
  kit.plainCord(panel, { x0: 0, x1: W, y: yc(235.9), width: 2.4, height: 1.2 })
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
  kit.ropeCord(panel, { x0: 0, x1: W, y: A(LV.rope), width: 3.0, height: 1.3, pitch: 2.2, slant: 52 })
  return panel.bake()
}
