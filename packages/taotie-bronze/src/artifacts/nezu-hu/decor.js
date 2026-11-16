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

// strands ≈ 2.1 mm, round-shouldered with a narrow flat top, ≈ 1.4 mm proud; knobs and pellets a little prouder
const RIB = { rib: 2.35, height: 1.7, profile: 'plateau', shoulder: 0.8, knob: 1.35, knobHeight: 2.0, jitter: 0.35, wobble: 0.14, wavelength: 16, swell: 0.08 }

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
  const rows = []
  for (let k = 0; k < 9; k++) rows.push({ weight: 1, mirror: k % 2 === 1, shift: k % 2 ? 0.5 : 0 })
  // the belly's impressions read FATTER than the shoulder's on photo-11 (detail-body, seen face-on: strands ≈ 2.8 mm,
  // channels ≈ 1.6 mm — a dense mass with little ground), the shoulder's ≈ 2.2 mm
  kit.panchiBand(panel, rect, { unit: 'nezu-hu', rows, ...RIB, rib: 2.8, shoulder: 0.85, knob: 1.55, knobHeight: 2.1, centre: W / 2, rowWidth: (y) => size.widthAt(y), seed })
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
 * The neck, front sector only: the incised inscription (≈ 8 columns over the front half of the neck), a 0.25 mm
 * raster extracted from photo-11 developed onto the neck (reference/nezu-hu/inscription.json — NOT a transcription,
 * the strokes as the photograph shows them). Register y 316 → 422; the raster's frame starts at y 318.
 */
export function neckPanel(kit, P, size, { ppmm, seed, y0 = 316 }) {
  const W = size.width, H = size.height
  const panel = new kit.ReliefPanel({ width: W, height: H, ppmm, seed })
  const I = INSCRIPTION
  const off = P.sAtY(I.y0) - P.sAtY(y0)
  const px = 1 / I.ppmm
  panel.sink((ctx) => {
    ctx.beginPath()
    for (const [r, c, n] of I.runs) {
      const x = W / 2 + I.x0 + c * px, y = off + I.ymax - (r + 1) * px
      ctx.rect(x, y, n * px, px * 1.02)
    }
    ctx.fill()
  }, { depth: 0.4, profile: 'u', shoulder: 0.18 })
  return panel.bake()
}
