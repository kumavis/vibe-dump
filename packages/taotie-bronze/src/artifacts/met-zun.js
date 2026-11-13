// Met zun 43.25.1 — shouldered three-section wine container, 13th c. BCE.
// Reconstruction from reference/met-zun/dossier.md (measured from the Met's
// photographs DP140764/5/6 and DT2853) and profile.json. Units mm, Y up,
// front (+Z, azimuth 0) = a NOSE line.
//
// THREE-fold: three identical 120° mould sectors, nose lines at 0/±120 (belly and
// foot nose flanges, the shoulder heads, the centre neck blade), seams at ±60/180
// (seam flanges, shoulder strips, hairline neck ridges, gaps between blades).
// Form: the measured 64-point profile on kit.lathe; 6 + 6 T-notched slab flanges,
// 3 plain shoulder strips; three flat bovine heads (met-zun/head.js).
// Décor: flat flush bands outlined by one groove on fine squared leiwen, only the
// eyes raised (met-zun/relief.js), one panel per register (met-zun/decor.js).

import * as THREE from 'three'
import PROFILE from '../../reference/met-zun/profile.json'
import { zunHeadSDF } from './met-zun/head.js'
import { bellyPanel, bellyKuiPanel, footPanel, dentilPanel, shoulderPanel, neckPanel, bladePanel } from './met-zun/decor.js'

const H = 400
const NOSES = [0, 120, 240]
const SEAMS = [60, 180, 300]
const ALL6 = [0, 60, 120, 180, 240, 300]
// narrow plain slots (slot/pitch ≈ 0.18) cut 0.35 p deep, continued down both faces as
// scored lines (detail-belly-mask.jpg, detail-foot-mask.jpg): no stepped heads
const T_NOTCH = { shape: 'score', rungs: 'full', pitch: 13.5, depth: 0.35, width: 2.4 }

export default {
  id: 'met-zun',
  order: 3,
  title: 'Wine Container (Zun)',
  titleZh: '尊',
  type: 'zun',
  date: '13th century BCE',
  period: 'Late Shang dynasty, Anyang style (Yinxu I–II by style)',
  findspot: 'Not documented (unprovenanced); attributed to Anyang on style',
  collection: 'The Metropolitan Museum of Art, New York — Rogers Fund, 1943',
  accession: '43.25.1',
  dimensions: { h: 400, w: 352, d: 352 },
  blurb:
    'A tall wine container in three tiers — a wide trumpet mouth, a squat belly with three flat-horned ox heads on its shoulder, and a high flaring foot — cast in a three-piece mould whose joins are marked by notched flanges. ' +
    'Its masks are drawn in broad, flat bands outlined by a single groove: a huge squared horn over a small low eye on the belly, a tall D-shaped horn on the foot, all set on fine thunder spirals once filled with black pigment. ' +
    'The outline, flanges and heads are measured from the Met’s photographs; the hidden interior (floor height, wall thickness), the exact line of every mask band and the décor on the unphotographed back are inferred.',
  defaultPatina: 'met-zun',
  views: {
    // full views: camera on the photographs' own stations (≈ 1.9 m from the axis, dossier §b.1)
    'three-quarter': { azimuth: -60, elevation: 13, fov: 20.2, fit: 1.13, ref: 'three-quarter.jpg' },
    front: { azimuth: 0, elevation: 11.5, fov: 20.3, fit: 1.26, ref: 'front.jpg' },
    side: { azimuth: 90, elevation: 4, fov: 20, fit: 1.2 },
    back: { azimuth: 180, elevation: 12, fov: 20, fit: 1.2 },
    top: { azimuth: 0, elevation: 68, fov: 20, fit: 1.2 },
    // clean décor close-ups (no photograph): raking three-quarter light on the flat bands
    'detail-belly': { azimuth: 24, elevation: 8, fov: 18, fit: 0.3, target: [0, 200, 0] },
    'detail-head': { azimuth: 35, elevation: 20, fov: 18, fit: 0.13, target: [0, 258, 112] },
    'detail-foot': { azimuth: -22, elevation: 10, fov: 18, fit: 0.3, target: [0, 75, 0] },
    // detail views: the crop boxes of SOURCES.md re-projected through the photo's camera station
    // (≈ 1.9 m, narrow fov ⇒ the photographs' perspective), then target/fit refined by overlay
    'belly-mask': { azimuth: 0, elevation: 11.6, fov: 3.6, fit: 0.26, target: [3, 185, 0], ref: 'detail-belly-mask.jpg' },
    'belly-half': { azimuth: -1.8, elevation: 11.6, fov: 3.25, fit: 0.194, target: [70, 182, 0], ref: 'detail-belly-half.jpg' },
    'belly-seam': { azimuth: -60, elevation: 12.2, fov: 3.6, fit: 0.26, target: [1, 190, 2], ref: 'detail-belly-seam.jpg' },
    'shoulder-head': { azimuth: 0, elevation: 9, fov: 3.6, fit: 0.245, target: [0, 260, 0], ref: 'detail-shoulder-head.jpg' },
    'shoulder-seam': { azimuth: -60, elevation: 9.7, fov: 3.6, fit: 0.215, target: [0, 262, 0], ref: 'detail-shoulder-seam.jpg' },
    'neck-blades': { azimuth: 0, elevation: 5, fov: 4.4, fit: 0.26, target: [0, 336, 0], ref: 'detail-neck-blades.jpg' },
    'neck-seam': { azimuth: -60, elevation: 7.8, fov: 3.85, fit: 0.230, target: [0, 316, 0], ref: 'detail-neck-seam.jpg' },
    'foot-front': { azimuth: 0, elevation: 15.6, fov: 4.6, fit: 0.282, target: [9, 43, 0], ref: 'detail-foot-front.jpg' },
    'foot-seam': { azimuth: -60, elevation: 16.3, fov: 4.6, fit: 0.32, target: [4, 50, 8], ref: 'detail-foot-seam.jpg' },
    'foot-mask': { azimuth: 0, elevation: 18, fov: 14.5, fit: 0.43, target: [0, 62, 0], ref: 'detail-foot-mask.jpg' },
    waist: { azimuth: 0, elevation: 13.4, fov: 2.1, fit: 0.107, target: [0, 128, 84], ref: 'detail-waist.jpg' },
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const q = Math.max(0.25, quality)
    const ppmm = 5 * Math.sqrt(q) // 1.3 mm leiwen: ≈ 6.5 px per pitch
    const seed = 43251
    const panels = {}
    const plain = new kit.PatinaMaterial()

    const profile = new kit.Profile(outerProfile(PROFILE.points))
    const once = (name, fn) => (k, size) => (panels[name] ??= fn(size))
    const sec3 = { count: 3, center: 0 }
    // each register's panel is built on first request (lathe asks per sector; all three share it)
    const jobs = [
      ['dentils', 27, 36, (size) => dentilPanel(kit, size, { ppmm: ppmm * 0.8, seed: seed + 1 })],
      ['foot', 36, 120, (size) => footPanel(kit, size, { ppmm, seed: seed + 2 })],
      ['belly', 152, 218, (size) => bellyPanel(kit, size, { ppmm, seed: seed + 3 })],
      ['bellyKui', 218, 241, (size) => bellyKuiPanel(kit, size, { ppmm, seed: seed + 4 })],
      ['shoulder', 254, 281, (size) => shoulderPanel(kit, size, { ppmm, seed: seed + 5 })],
      ['neck', 283, 323, (size) => neckPanel(kit, size, { ppmm, seed: seed + 6 })],
      ['blades', 323, 391, (size) => bladePanel(kit, size, { ppmm: ppmm * 0.9, seed: seed + 7 })],
    ]
    // bake the panels up front (one per register) so onProgress can yield between them
    for (let i = 0; i < jobs.length; i++) {
      const [name, y0, y1, fn] = jobs[i]
      await onProgress(0.02 + 0.68 * (i / jobs.length), name)
      panels[name] = fn(sectorSize(profile, y0, y1, 120))
    }

    await onProgress(0.72, 'casting')
    const wall = (s, y) => (y < 128 ? 3.5 : y < 256 ? 4 : y < 335 ? 3.5 : 3)
    const body = kit.lathe({
      profile,
      sectors: sec3,
      registers: Object.fromEntries(jobs.map(([n, y0, y1]) => [n, { y0, y1, relief: once(n), fade: 1.2 }])),
      wall,
      lip: { thickness: 4.5, length: 10, shape: 'flat', bulge: 0.35 },
      floor: { y: 128, thickness: 4, dome: 1 },
      foot: { wall: 3.5 },
      tolerance: { seed: 1, ovality: 0.012, rim: 0.008, lean: 0 },
      density: 1.0,
      quality: q,
      material: plain,
    })
    const info = body.userData.lathe

    const object = new THREE.Group()
    object.name = 'met-zun'
    object.add(body)

    // ---------------------------------------------------------------- flanges
    await onProgress(0.8, 'flanges')
    const flanges = []
    // belly: 6 slabs, y 145 → 243, projection 16, thickness 8, T slots at ≈ 13.5 mm
    flanges.push(...kit.latheFlanges(body, {
      azimuths: ALL6, ranges: [{ range: { y0: 145, y1: 243 } }], gap: 0, seed: seed + 11,
      height: 16, thickness: 8, embed: 2, taper: 2.5, bevel: 0.7, waver: 0.35, notches: T_NOTCH, material: plain,
    }))
    // foot: 6 slabs, y 30 → 122 along the foot cone, projection 13, thickness 7
    flanges.push(...kit.latheFlanges(body, {
      azimuths: ALL6, ranges: [{ range: { y0: 30, y1: 122 } }], gap: 0, seed: seed + 12,
      height: 13, thickness: 7, embed: 2, taper: 2.5, bevel: 0.7, waver: 0.35, notches: { ...T_NOTCH, pitch: 13 }, material: plain,
    }))
    // shoulder: 3 low plain strips on the seams, carination → neck base
    flanges.push(...kit.latheFlanges(body, {
      azimuths: SEAMS, ranges: [{ range: { y0: 254.5, y1: 280.8 } }], gap: 0, seed: seed + 13,
      height: 3.5, thickness: 7, embed: 1.5, taper: 4, bevel: 0.8, waver: 0.2, notches: { shape: 'none' }, material: plain,
    }))
    for (const f of flanges) object.add(f)
    // neck: hairline seam ridges through the kui band (part of the body)
    // a 1 mm bead that follows the concave neck point by point and stops at the blade
    // border (y 315). kit.flange's generated outline has only two root points, so on a
    // CONCAVE wall its root edge is a chord standing off the wall (a knife fin); a
    // caller outline with a dense root keeps the bead on the wall.
    const [rs0, rs1] = info.range({ y0: 283, y1: 315 })
    const RL = rs1 - rs0, re = 0.8
    const beadOutline = []
    for (let i = 0, n = Math.ceil(RL / 0.8); i <= n; i++) beadOutline.push([(RL * i) / n, -re])
    beadOutline.push([RL, 0.2], [RL - 1.2, 0.85])
    for (let i = 0, n = Math.ceil((RL - 2) / 0.8); i <= n; i++) beadOutline.push([RL - 2 - ((RL - 2) * i) / n, 1.0])
    beadOutline.push([0, 1.0])
    const ridges = kit.latheFlanges(body, {
      azimuths: SEAMS, ranges: [{ range: { y0: 283, y1: 315 } }], gap: 0, seed: seed + 14,
      height: 1.0, thickness: 1.8, embed: re, taper: 6, bevel: 0.3, waver: 0.15, material: plain, part: 'body',
      outline: beadOutline, grooves: [],
    })
    for (const r of ridges) body.add(r)

    // ---------------------------------------------------------------- heads
    await onProgress(0.88, 'heads')
    const voxel = Math.max(0.32, 0.5 / Math.sqrt(q))
    const headGeo = kit.meshSDF(zunHeadSDF({ wallR: 160, slope: 41, embed: 4 }), { voxel })
    const headMat = new kit.PatinaMaterial()
    const heads = []
    for (const az of NOSES) {
      const h = new THREE.Mesh(headGeo, headMat)
      h.userData.part = 'heads'
      h.castShadow = h.receiveShadow = true
      kit.mountOnLathe(body, h, { azimuth: az, y: 264, follow: 1, pitch: 0, lift: 0 })
      // bake the mount into the vertices: bounding boxes (metrics, framing) stay tight
      h.updateMatrix()
      h.geometry = headGeo.clone().applyMatrix4(h.matrix)
      h.geometry.computeBoundingBox()
      h.geometry.computeBoundingSphere()
      h.position.set(0, 0, 0)
      h.quaternion.identity()
      h.scale.set(1, 1, 1)
      object.add(h)
      heads.push(h)
    }

    await onProgress(1, 'done')
    return { object, parts: { body, flanges, heads }, panels }
  },
}

/**
 * profile.json is the SILHOUETTE: its top point (r 176, y 400) is the rim's outer edge
 * as seen, which on a lip turned out almost flat is the top of the rim. The lathe
 * profile is the OUTER (under)side of the wall, the lip cap rising a wall's thickness
 * above it, so the last 15 mm are lowered by the lip thickness (H stays 400).
 */
function outerProfile(points) {
  // The waist as the photographs show it (front.jpg, detail-waist.jpg): a concave neck
  // ≈ 17 mm tall between the foot décor top (y 120) and a TIGHT belly underside — a
  // near-horizontal shelf at y ≈ 138 turning up through a small quarter-round into the
  // belly wall — so the plain waist shows at the photographs' 12–13° elevation instead
  // of hiding under a long shallow bowl (profile.json's 128–152 points read the
  // silhouette, where the underside's flatness is invisible).
  const WAIST = [
    [77.4, 124], [76.9, 128], [76.9, 132], [77.4, 135.2], [79.2, 137.2],
    [83.5, 138.3], [88.5, 138.9], [91.8, 139.8], [93.8, 141.6], [95.0, 144.2], [96.4, 147.8],
  ]
  // the carination: a broad worn arris (R ≈ 3, detail-shoulder-seam.jpg), not a crisp crease
  points = points.flatMap((p) => (p[3] === 'carination' ? [[116.0, 251.6], [115.6, 255.3], [113.9, 257.2]] : [p]))
  points = points.filter((p) => !(p[1] > 120 && p[1] < 152))
  const at = points.findIndex((p) => p[1] >= 152)
  points.splice(at, 0, ...WAIST.map((p) => (p[2] === undefined ? [p[0], p[1]] : p)))
  return points.map((p) => {
    const y = p[1]
    if (y <= 385) return p
    const q = p.slice()
    q[1] = y - 4.1 * Math.pow((y - 385) / 15, 1.5)
    return q
  })
}

/**
 * The size of one register × sector cell as kit.lathe reports it (KIT.md § size), computed
 * from the Profile alone so the panels can be baked before the body is built.
 */
function sectorSize(P, y0, y1, spanDeg) {
  const s0 = P.sAtY(y0), s1 = P.sAtY(y1, { from: 'top' })
  const len = s1 - s0
  const ang = (spanDeg * Math.PI) / 180
  const at = (yArc) => P.at(s0 + Math.min(Math.max(yArc, 0), len))
  const widthAt = (yArc) => at(yArc).r * ang
  const width = widthAt(len / 2)
  return {
    theta0: -spanDeg / 2, theta1: spanDeg / 2, center: 0, width, height: len,
    widthBottom: widthAt(0), widthTop: widthAt(len), rBottom: at(0).r, rTop: at(len).r, rMid: at(len / 2).r,
    widthAt,
    toPanel: (pt, W = width) => [W / 2 + (pt[0] * W) / widthAt(pt[1]), pt[1]],
    fromPanel: (pt, W = width) => [((pt[0] - W / 2) * widthAt(pt[1])) / W, pt[1]],
  }
}
