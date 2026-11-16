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
  holes: 34, // centre height of the foot openings (±12.5° either side of the 0° / 180° flanges)
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
  [77.0, 54.4, 'corner'],
  [78.6, 55.4],
  [80.6, 57.4],
  [81.4, 59.6],
  [80.9, 62],
  [79.8, 63.6],
  [80.4, 64.4, 'corner'],
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

/** the bud knob in the round: [r, y] bottom → tip. photo-06 read on a 1:1 gridded crop (3.44 px/mm at the lid): an
 *  inverted drop — the tip at 281.5, straight-sided ogive flanks to the widest Ø ≈ 26 mm ≈ 22 mm below the tip, then a
 *  round bulb closing quickly into the neck (Ø ≈ 15 mm at y ≈ 247.5), which flows on as the two posts */
export const KNOB = [
  [0.01, 246.6], [6.6, 246.6], [7.6, 247.6], [8.8, 249.2], [10.6, 251.2], [12.2, 253.8], [13.0, 256.6], [13.1, 259.6],
  [12.5, 262.6], [11.3, 266.2], [9.6, 270], [7.4, 273.8], [5, 277.2], [2.6, 279.9], [1, 281.1], [0.01, 281.5],
]
/** the stem: TWO posts side by side (photo-06: each ≈ 7 mm wide, a hairline slot ≈ 1.2 mm between them, together
 *  ≈ 15 mm = the bud's neck; the front lid flange runs up to them), each [x, z, r] mm from the axis, from the crown
 *  (y 224.6) into the bud's neck (y 248) */
export const POSTS = [[-3.8, 0, 3.65], [3.8, 0, 3.65]]
export const POST_TOP = 248.4
export const RIDGES = [
  { y: 160.6, count: 1, width: 1.6, height: 0.6, shape: 'round' }, // the raised line over the shoulder frieze
  { y: 170.2, count: 1, width: 1.8, height: 0.7, shape: 'round' }, // the ridge at the foot of the lip
]

/** azimuths (deg; 0 = front +Z, + toward +X) */
export const AZ = {
  masks: [0, 180], // the belly / lid / foot mask centres: low beaded ridges (body), flanges (lid, foot)
  dividers: [90, 270], // the tall hooked flanges between the masks
  all4: [0, 90, 180, 270],
  holes: [-12.5, 12.5, 167.5, 192.5], // foot openings: two per mask, flanking its flange (photo-06: ≈ 17 mm off it)
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
 * Hooked flange silhouette (photo-06: the two divider flanges and the lid's flanges seen in profile at the
 * silhouette): a row of blocky teeth separated by narrow slots; each tooth's upper end (toward +σ) rises into a
 * short beak, and with `nick` > 0 a small notch in the crest behind the beak makes it a bird head (the lid).
 * → CCW polygon [σ, t] for kit.flange({ outline }), σ 0 → L along the path (upward), t outward, root at −embed.
 */
export function hookTeeth(L, { height = 12, pitch = 9.5, slot = 0.26, depth = 0.5, beak = 0.12, nick = 0, nickW = 0.18, embed = 2, startPlain = 0, lowHeight = 2.5 } = {}) {
  const H = height
  const n = Math.max(1, Math.round((L - startPlain) / pitch))
  const p = (L - startPlain) / n
  const w = Math.max(1.2, p * slot)
  const top = []
  if (startPlain > 0) top.push([0, lowHeight], [startPlain - 0.8, lowHeight])
  for (let k = 0; k < n; k++) {
    const a = startPlain + k * p, b = a + p
    const e = k === n - 1 ? L : b - w // the tooth's upper end
    top.push([k === 0 && startPlain === 0 ? a + p * 0.1 : a, H * 0.9], [a + p * 0.15, H])
    if (nick > 0) {
      // a bird head facing +σ: crest, a beak overhanging the slot, the throat cut back under it
      top.push([e - p * 0.08, H * (1 + beak * 0.3)], [e + p * 0.1, H * (1 + beak * 0.15)], [e + p * 0.11, H * (1 - nick * 0.35)],
        [e - p * 0.06, H * (1 - nick)], [e, H * (1 - nick * 1.4)])
    } else top.push([e - p * 0.28, H], [e - p * 0.04, H * (1 + beak)], [e, H * (1 + beak * 0.4)])
    if (k < n - 1) top.push([e, H * (1 - depth)], [b, H * (1 - depth)])
    else top.push([L, H * 0.6])
  }
  const pts = [[0, -embed], [L, -embed]]
  for (let i = top.length - 1; i >= 0; i--) pts.push(top[i])
  return pts
}

/** a per-pitch tooth shape [[u, t/H]…] (u 0 → 1 along one pitch) repeated n times between optional plain ends → CCW
 *  outline [σ, t] for kit.flange({ outline }); the root runs at −embed */
function repeatTeeth(L, unit, { height: H, pitch, embed = 2, startT = 0.6, endT = 0.4, endRound = 0 }) {
  const n = Math.max(1, Math.round(L / pitch))
  const p = L / n
  const top = [[0, startT * H]]
  for (let k = 0; k < n; k++) for (const [u, t] of unit) if (k * p + u * p > 0.05 && k * p + u * p < L - 0.05) top.push([k * p + u * p, t * H])
  if (endRound > 0) top.push([L - endRound * 0.4, endT * H + endRound * 0.25])
  top.push([L, endT * H])
  const pts = [[0, -embed], [L, -embed]]
  for (let i = top.length - 1; i >= 0; i--) pts.push(top[i])
  return pts
}

/** the DIVIDER flanges (photo-06, both in profile; gridded 1:1 crop of the left one): a solid spine ≈ 0.58 of the
 *  height, blocky teeth ≈ 0.72 of the pitch tall standing out from it, each tooth's upper outer corner rising in a
 *  short beak that curls back over the narrow slot above it; the slot widens inward to a rounded floor (C-shaped) */
export const DIVIDER_TOOTH = [
  [0.0, 0.6], [0.015, 0.84], [0.07, 0.97], [0.17, 1.0], [0.6, 1.0], [0.7, 1.05], [0.79, 1.03], [0.82, 0.95],
  [0.78, 0.87], [0.7, 0.83], [0.73, 0.68], [0.8, 0.59], [0.9, 0.57], [0.97, 0.58],
]
export const dividerTeeth = (L, o) => repeatTeeth(L, DIVIDER_TOOTH, { startT: 0.62, endT: 0.32, endRound: 4, ...o })

/** the LID flanges (photo-06: the right one in profile, gridded 1:1 crop): three chunky teeth on a low body, deep
 *  slots between them; each tooth a stem carrying a T-shaped bird head — a crest notch on top, the hooked beak
 *  pointing up the lid toward the knob (+σ) and curling down over the next slot, the back of the head overhanging */
export const LID_TOOTH = [
  [0.0, 0.08], [0.12, 0.08], [0.13, 0.58], [0.04, 0.64], [0.02, 0.84], [0.1, 1.0], [0.38, 1.0], [0.43, 0.86],
  [0.53, 0.86], [0.59, 1.04], [0.86, 1.03], [0.99, 0.88], [0.97, 0.72], [0.88, 0.68], [0.84, 0.6], [0.84, 0.08],
]
export const lidTeeth = (L, o) => repeatTeeth(L, LID_TOOTH, { startT: 0.2, endT: 0.08, ...o })
