// Met gu 1985.214.4 — trumpet-mouthed wine beaker, late Shang (Anyang).
// Reconstruction from reference/met-gu/dossier.md and profile.json (measured from
// the Met's three CC0 photographs). Units mm, Y up, front (+Z, azimuth 0) = the
// nose flange of taotie A; noses on the 0°/180° flanges, mould seams on 90°/270°.
//
// Form: one lathe body (foot ring → apron → concave foot → 3-rib collar → waist
// drum → neck → trumpet → thin flat lip), cast with a 0.8° lean toward −Z and a
// rim ~1.5° out of level; eight ladder-scored flanges (met-gu/flanges.js): four
// slabs on the drum, four on the foot sweeping out into spurs past the ring.
// Décor (met-gu/decor.js): flush flat-band taotie on 0.75–0.85 mm leiwen on the
// foot and waist (only the eyes raised), a same-direction neck frieze, and four
// tall line-blades on the trumpet. Foot and blade panels are laid 1:1 on the wall.

import { paintFoot, paintWaist, paintNeck, paintBlade } from './met-gu/decor.js'
import { guFlanges } from './met-gu/flanges.js'

const DEG = Math.PI / 180

// profile.json (r, y, join, label), bottom → top, outer surface, flanges excluded
const PROFILE = [
  // apron: a short dished ledge continuing the bell's concave sweep; the décor starts on it at y ≈ 21
  // (detail-foot-front.jpg puts the bottom leiwen row ≈ 6 mm lower than the dossier's 25.5 — photo wins)
  [46.5, 0.0, 'C', 'footBottom'], [47.1, 6.0], [47.7, 12.0], [48.3, 17.5, 'C', 'ringTop'], [46.4, 18.1], [44.4, 18.9], [42.6, 19.9],
  [41.0, 21.1, null, 'footDecorBottom'], [39.4, 22.5], [37.9, 24.0], [36.4, 25.8], [34.4, 27.7], [32.4, 30.5], [30.4, 35.5], [28.6, 42.0], [27.0, 47.5], [25.4, 53.3],
  [24.2, 58.5], [23.2, 64.5], [22.5, 70.0], [22.0, 75.5], [21.6, 77.4], [21.1, 78.3, 'C', 'footTop'], [19.6, 78.6, 'C'],
  [19.6, 79.6], [20.6, 80.5], [19.6, 81.5], [19.6, 83.0], [20.6, 84.0], [19.6, 85.0], [19.6, 87.0], [20.6, 88.0], [19.6, 89.0],
  [19.6, 94.6, 'C', 'collarTop'], [21.7, 95.0, 'C', 'drumBottom'], [21.6, 105.0], [21.5, 120.0], [21.4, 135.0], [21.4, 146.4, 'C', 'drumTop'],
  [18.5, 146.8, 'C', 'neckBottom'], [18.4, 153.0], [18.3, 160.0], [18.2, 171.5, null, 'bandTop'], [18.2, 185.0], [18.4, 198.0], [18.7, 205.0],
  [19.1, 212.0], [19.9, 220.0], [20.7, 228.0], [22.0, 236.0], [23.6, 244.0], [25.7, 252.0], [28.2, 260.0], [31.6, 268.0], [36.0, 276.0],
  [41.5, 284.0], [45.0, 288.0], [49.0, 292.0], [53.0, 296.0], [57.5, 299.5], [63.0, 302.5], [70.0, 305.0], [77.0, 306.8],
  [83.6, 307.8, 'C', 'lipBottom'], [85.0, 308.6], [85.0, 311.0, 'L', 'rim'],
]

// The detail photographs are CROPS of three exposures. A crop view keeps its exposure's camera POSITION
// (the stage puts a target view's camera at target + dir(az, el) · fit·R / tan(fov/2)) and only re-aims and
// narrows the lens, so the perspective of every detail matches its photograph.
const R_BOX = 197.4 // half the bbox diagonal (171.3 × 312.9 × 169.3): a target view frames fit × R_BOX
const SIDE_VIEW = { azimuth: 89, elevation: 17, fov: 26, fit: 0.99, target: [0, 172, 0] }
const LEFT_VIEW = { azimuth: -97, elevation: 18, fov: 21, fit: 0.97, target: [0, 166, 0] }
const FOOT_VIEW = { azimuth: -4, elevation: 21, fov: 12, fit: 0.346, target: [3.5, 30, 0] }
function camPos(v) {
  const dist = (v.fit * R_BOX) / Math.tan((v.fov * DEG) / 2)
  const a = v.azimuth * DEG, e = v.elevation * DEG
  return [v.target[0] + dist * Math.sin(a) * Math.cos(e), v.target[1] + dist * Math.sin(e), v.target[2] + dist * Math.cos(a) * Math.cos(e)]
}
// the cast axis leans 0.8° toward −Z (lathe tolerance below): a crop centred on the axis at height y aims there
const LEAN = Math.tan(0.8 * DEG)
function crop(parent, { fit, target: [x, y, z], ref }) {  // ref stays a literal `ref:` for tools/refs.mjs
  const target = [x, y, +(z - LEAN * y).toFixed(2)]
  const p = camPos(parent)
  const d = p.map((c, i) => c - target[i])
  const dist = Math.hypot(...d)
  const r1 = (x) => +x.toFixed(2)
  return {
    azimuth: r1(Math.atan2(d[0], d[2]) / DEG), elevation: r1(Math.asin(d[1] / dist) / DEG),
    fov: r1((2 * Math.atan((fit * R_BOX) / dist)) / DEG), fit, target, ref,
  }
}

// true-mapped blade panel width (mm). The blade itself is ≈ 27.8 at the neck (photo) → 22.6 under the ogive, but the
// panel must span the whole sector arc at the lip (±66 mm): the patina reads uv.x < −0.5 as an inner wall, and a
// narrower panel turned the trumpet beside the blade apex into dark hard-edged wedges.
const BLADE_W = 70

/** The author's view of one lathe register sector, computed before the lathe exists (same as lathe's `size`). */
function regSize(P, s0, s1, angDeg) {
  const ang = angDeg * DEG
  const h = s1 - s0
  const widthAt = (v) => P.at(s0 + Math.min(Math.max(v, 0), h)).r * ang
  return { height: h, widthAt, width: widthAt(h / 2), widthBottom: widthAt(0), widthTop: widthAt(h) }
}

export default {
  id: 'met-gu',
  order: 4,
  title: 'Wine Beaker (Gu)',
  titleZh: '觚',
  type: 'gu',
  date: '13th–11th century BCE',
  period: 'Late Shang dynasty, Anyang period (Yinxu II–III by style)',
  findspot: 'Not documented (unprovenanced); attributed to Anyang on style',
  collection: 'The Metropolitan Museum of Art, New York — Gift of Ernest Erickson Foundation, 1985',
  accession: '1985.214.4',
  dimensions: { h: 311, w: 170, d: 170 },
  blurb:
    'An extremely slender beaker for offering wine: a trumpet mouth opening to more than half its height above a neck only 36 mm across, ' +
    'four tall blades of incised thunder-pattern climbing the trumpet, and on the narrow waist drum and the flaring foot a pair of flat-band masks ' +
    'with crook horns and bulging rounded-square eyes, split by eight ladder-scored flanges whose foot ends sweep out past the ring as spurs. ' +
    'Form, flanges and the layout of every band are measured from the Met’s three photographs; the hidden flare under the lip, the wall thickness, ' +
    'the cup floor and the least legible passages of décor (the foot’s upper band, the neck creatures) are inferred.',
  defaultPatina: 'met-gu',
  views: {
    'three-quarter': { azimuth: 38, elevation: 14, fov: 24, fit: 1.0 },
    side: { ...SIDE_VIEW, ref: 'side.jpg' },
    'side-left': { ...LEFT_VIEW, ref: 'side-left.jpg' },
    front: { azimuth: 0, elevation: 17, fov: 23, fit: 1.17 },
    elevation: { azimuth: 90, elevation: 4, fov: 23, fit: 1.12 },
    top: { azimuth: 45, elevation: 68, fov: 26, fit: 1.05 },
    'foot-three-quarter': { azimuth: 40, elevation: 18, fov: 20, fit: 0.32, target: [0, 46, 0] },
    'waist-three-quarter': { azimuth: 30, elevation: 10, fov: 20, fit: 0.2, target: [0, 125, 0] },
    'detail-foot-front': { ...FOOT_VIEW, ref: 'detail-foot-front.jpg' },
    'detail-foot-halfmask': crop(FOOT_VIEW, { fit: 0.17, target: [-16, 48, 21], ref: 'detail-foot-halfmask.jpg' }),
    'detail-foot-seam': crop(SIDE_VIEW, { fit: 0.212, target: [0, 25, 0], ref: 'detail-foot-seam.jpg' }),
    'detail-foot-ring': crop(SIDE_VIEW, { fit: 0.113, target: [46, 11, 0], ref: 'detail-foot-ring.jpg' }),
    'detail-waist': crop(SIDE_VIEW, { fit: 0.158, target: [0, 118.5, 0], ref: 'detail-waist.jpg' }),
    'detail-waist-b': crop(LEFT_VIEW, { fit: 0.17, target: [0, 116.5, 0], ref: 'detail-waist-b.jpg' }),
    'detail-flange-ladder': crop(SIDE_VIEW, { fit: 0.213, target: [0, 98, 15], ref: 'detail-flange-ladder.jpg' }),
    'detail-collar': crop(FOOT_VIEW, { fit: 0.07, target: [0, 83, 0], ref: 'detail-collar.jpg' }),
    'detail-neck-band': crop(SIDE_VIEW, { fit: 0.081, target: [0, 160, 0], ref: 'detail-neck-band.jpg' }),
    'detail-neck-band-b': crop(LEFT_VIEW, { fit: 0.081, target: [0, 160, 0], ref: 'detail-neck-band-b.jpg' }),
    'detail-blade': crop(SIDE_VIEW, { fit: 0.356, target: [0, 236, 0], ref: 'detail-blade.jpg' }),
    'detail-rim-lip': crop(SIDE_VIEW, { fit: 0.35, target: [0, 304, 0], ref: 'detail-rim-lip.jpg' }),
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const q = Math.max(0.25, quality)
    const ppmm = 9 * Math.sqrt(q) // 0.75 mm leiwen wants ≥ 8 px/mm
    const P = new kit.Profile(PROFILE, { ridges: [{ y: 17.0, count: 1, width: 0.9, height: 0.4, shape: 'round' }] }) // ring-top arris bead
    const S = (x) => (typeof x === 'string' ? P.resolveS(x) : P.sAtY(x))
    const panels = {}
    const bake = (p) => p.bake()

    // ---------------------------------------------------------------- panels (one bake per distinct mould section)
    await onProgress(0.02, 'foot')
    const footS = [S('footDecorBottom'), S('footTop')]
    const footSize = regSize(P, footS[0], footS[1], 180)
    {
      const p = new kit.ReliefPanel({ width: footSize.widthBottom, height: footSize.height, ppmm, seed: 1985214 })
      paintFoot(kit, p, footSize, { pitch: 0.75, seed: 41 })
      panels.foot = bake(p)
    }
    await onProgress(0.22, 'waist A')
    const waistS = [S('drumBottom'), S('drumTop')]
    const waistSize = regSize(P, waistS[0], waistS[1], 180)
    for (const v of ['A', 'B']) {
      const p = new kit.ReliefPanel({ width: waistSize.width, height: waistSize.height, ppmm, seed: 1985215 })
      paintWaist(kit, p, waistSize, { pitch: 0.85, seed: 42, variant: v })
      panels['waist' + v] = bake(p)
      await onProgress(v === 'A' ? 0.34 : 0.44, v === 'A' ? 'waist B' : 'neck band')
    }
    const neckS = [S(153.4), S('bandTop')]
    const neckSize = regSize(P, neckS[0], neckS[1], 90)
    {
      const p = new kit.ReliefPanel({ width: neckSize.width, height: neckSize.height, ppmm: ppmm * 1.05, seed: 1985216 })
      paintNeck(kit, p, { pitch: 0.9, seed: 43 })
      panels.neckBand = bake(p)
    }
    await onProgress(0.5, 'blades')
    const bladeS = [S('bandTop'), S('lipBottom')]
    {
      const p = new kit.ReliefPanel({ width: BLADE_W, height: bladeS[1] - bladeS[0], ppmm: ppmm * 0.9, seed: 1985217 })
      paintBlade(kit, p, { vAt: (y) => P.sAtY(y) - bladeS[0], pitch: 0.88 })
      panels.blades = bake(p)
    }
    await onProgress(0.6, 'body')

    // ---------------------------------------------------------------- body
    const body = kit.lathe({
      profile: P,
      wall: 2.3,
      lip: { thickness: 3.4, shape: 'flat', bulge: 0 }, // 3.4: the inner skin meets the flat top without a step (no inner bead)
      floor: { y: 104, thickness: 3.5 },
      foot: { wall: 2.7 },
      sectors: 4,
      density: 1.0,
      quality,
      registers: {
        foot: { from: 'footDecorBottom', to: 'footTop', sectors: { count: 2, center: 0 }, map: 'true', mapWidth: footSize.widthBottom, relief: () => panels.foot },
        waist: { from: 'drumBottom', to: 'drumTop', sectors: { count: 2, center: 0 }, relief: [panels.waistA, panels.waistB] },
        neckBand: { from: 153.4, to: 'bandTop', sectors: { count: 4, center: 45 }, relief: () => panels.neckBand },
        blades: { from: 'bandTop', to: 'lipBottom', sectors: { count: 4, center: 0 }, map: 'true', mapWidth: BLADE_W, relief: () => panels.blades },
      },
      // dossier §b.6: axis leans 0.8° (toward −Z, taotie B), rim ≈ 1.5° out of level; seed chosen for that lean
      tolerance: { seed: 1176, ovality: 0.006, rim: 0.006, lean: 0.8 },
    })
    await onProgress(0.85, 'flanges')

    // ---------------------------------------------------------------- flanges
    const flanges = guFlanges(kit, body, P, { seed: 1985 })
    for (const f of flanges) body.add(f)
    await onProgress(1, 'done')
    return { object: body, parts: { body, flanges }, panels }
  },
}
