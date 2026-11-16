// Nezu bu 饕餮文瓿 (90082) — the form, measured.
//
// The outline is a camera solve on the project owner's single photograph (reference/nezu-bu/photo-06.jpg,
// dossier §b.1): one pinhole camera (elevation 9.3°, focal ≈ 2050 px) and three profile rings (foot base, lid
// ledge, body lip) plus the knob tip, fitted together by least squares to hand-read outline points (1.6 px rms);
// then the belly silhouette read row by row between the side flanges' teeth (half widths: the body reads ≈ 15 px
// left of the lid / foot axis, see dossier), the register borders read on the front centre line and converted to
// heights through the same camera. Scale is INFERRED from the ground-line pitch (dossier §b.2): 1 fitted unit
// (foot radius = 100) = 0.8 mm. All mm, Y up, front (+Z) = the low beaded ridge at the centre of a belly mask.

/** register heights (mm): [y0, y1] */
export const LV = {
  base: [0, 19], // plain base band of the ring foot (pale, flaring a little)
  foot: [19, 54.4], // foot frieze: hooked units + two openings per mask (upper), a chain of squared spirals (lower)
  footSplit: 29.6, // the line between the two foot rows
  holes: 34, // centre height of the foot openings (±11° either side of the 0° / 180° flanges)
  collar: [54.4, 64.2], // plain convex ring at the top of the foot
  mask: [77, 123.6], // belly taotie (between the underside and the divider band)
  divider: [123.6, 127.4], // the narrow plain band between the mask and the shoulder frieze
  shoulder: [127.4, 158.6], // the shoulder frieze of long-bodied dragons
  slope: [158.6, 171.2], // plain sloping shoulder band
  lip: 175.4, // the body's rounded lip
  lid: 187.6, // underside of the lid's ledge
  lidDeco: [194.6, 224.6], // the lid's decorated slope (between the ledge and the crown)
  apex: 229.4, // lid crown at the axis
  knobTop: 281.5,
}

/** outer profile of the body, bottom → top, [r, y] mm */
export const BODY = [
  [80, 0, 'corner'],
  [80.4, 1.4],
  [80.1, 6],
  [79.3, 19],
  [78.5, 30],
  [77.6, 46],
  [77.0, 54.4],
  [77.6, 56.4],
  [78.3, 59.5],
  [78.2, 62.6],
  [79.6, 64.2, 'corner'],
  [88, 63.4],
  [94.4, 64.8],
  [98.4, 68.6],
  [100.8, 73.6],
  [102.6, 79.8],
  [103.9, 86],
  [104.6, 95.7],
  [104.8, 107.4],
  [104.4, 119],
  [103.9, 124],
  [103.2, 130.5],
  [101.3, 141.8],
  [97.4, 153.2],
  [93, 158.6],
  [86, 165.6],
  [78.6, 171.2],
  [76.6, 173.4],
  [75.3, 175.4],
  [73.6, 176.8],
  [71.4, 177.4, 'corner'],
  [70.8, 179],
  [70.6, 188.6],
]

/** outer profile of the lid, rim → crown, [r, y] mm (vessel frame: the lid seated) */
export const LID = [
  [77.8, 187.6, 'corner'],
  [80.4, 188.4],
  [81.0, 190.6],
  [80.5, 192.8],
  [78.4, 193.8, 'corner'],
  [76.4, 194.6],
  [73.4, 196.8],
  [67.5, 203.4],
  [58.7, 211.6],
  [50, 216.6],
  [41.4, 220],
  [33, 222.6],
  [25.6, 224.4],
  [16, 226.2],
  [7.4, 227.2],
  [0.01, 227.6],
]

/** the bud knob in the round: [r, y] bottom → tip (photo-06: stem Ø ≈ 13 mm, bud Ø ≈ 24 mm widest a third up) */
export const KNOB = [
  [0.01, 224.6], [7.6, 224.6], [7.0, 227.6], [6.4, 232], [6.2, 240], [6.4, 248], [7.2, 251.4], [9.4, 253.6],
  [11.4, 257.4], [12.1, 261.4], [11.6, 265.6], [10.0, 270], [7.4, 274.6], [4.2, 278.6], [1.6, 281], [0.01, 281.5],
]

/** azimuths (deg; 0 = front +Z, + toward +X) */
export const AZ = {
  masks: [0, 180], // the belly / lid / foot mask centres: low beaded ridges (body), flanges (lid, foot)
  dividers: [90, 270], // the tall hooked flanges between the masks
  all4: [0, 90, 180, 270],
  holes: [-11, 11, 169, 191], // foot openings: two per mask, flanking its flange
}

/** radius of the body profile at height y (linear between points; first match from the bottom) */
export function rAt(y, P = BODY) {
  for (let i = 0; i < P.length - 1; i++) {
    const [r0, y0] = P[i], [r1, y1] = P[i + 1]
    if (y >= y0 && y <= y1 && y1 > y0) return r0 + ((r1 - r0) * (y - y0)) / (y1 - y0)
  }
  return P[P.length - 1][0]
}

/**
 * Hooked flange silhouette (photo-06, the two divider flanges seen in profile at the silhouette): a row of
 * teeth separated by deep narrow slots; each tooth's upper end is a beak (a small nick in its crest a little
 * below the slot) so the row reads as the "bird-head" crenellation of the photograph.
 * → CCW polygon [σ, t] for kit.flange({ outline }), σ 0 → L along the path (upward), t outward, root at −embed.
 */
export function hookTeeth(L, { height = 12, pitch = 9.5, slot = 0.3, depth = 0.6, nick = 0.28, nickW = 0.24, embed = 2, startPlain = 0, lowHeight = 2.5, phase = 0.5 } = {}) {
  const H = height
  const n = Math.max(1, Math.round((L - startPlain) / pitch))
  const p = (L - startPlain) / n
  const w = Math.max(1.2, p * slot)
  const top = []
  // crest from σ = 0 upward
  if (startPlain > 0) top.push([0, lowHeight], [startPlain - 0.8, lowHeight])
  else top.push([0, H * 0.82])
  for (let k = 0; k < n; k++) {
    const a = startPlain + k * p, b = a + p
    const sa = k === 0 ? a + (startPlain > 0 ? 0 : p * 0.12) : a
    top.push([sa, H])
    // the nick under the beak
    const n0 = b - w - (phase + nickW * 0.5) * p * 0.6, n1 = n0 + nickW * p * 0.55
    top.push([n0, H], [n0 + 0.25, H * (1 - nick)], [n1, H * (1 - nick)], [n1 + 0.5, H])
    // the beak's tip and the slot
    if (k < n - 1) {
      top.push([b - w, H * 1.03], [b - w, H * (1 - depth)], [b, H * (1 - depth)])
    } else {
      top.push([b - w * 0.4, H * 1.02], [L, H * 0.7])
    }
  }
  // CCW: root (bottom) left → right, then crest right → left
  const pts = [[0, -embed], [L, -embed]]
  for (let i = top.length - 1; i >= 0; i--) pts.push(top[i])
  return pts
}
