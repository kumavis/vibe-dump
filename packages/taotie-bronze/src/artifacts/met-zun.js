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
const T_NOTCH = { shape: 'T', pitch: 13.5, depth: 0.35, width: 2.6 }

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
    'three-quarter': { azimuth: -60, elevation: 13, fov: 20, fit: 1.08, ref: 'three-quarter.jpg' },
    front: { azimuth: 0, elevation: 12, fov: 20, fit: 1.08, ref: 'front.jpg' },
    side: { azimuth: 90, elevation: 4, fov: 20, fit: 1.2 },
    top: { azimuth: 0, elevation: 68, fov: 20, fit: 1.2 },
    'belly-mask': { azimuth: 0, elevation: 12, fov: 7, fit: 0.22, target: [0, 196, 0], ref: 'detail-belly-mask.jpg' },
    'belly-seam': { azimuth: -60, elevation: 13, fov: 7, fit: 0.22, target: [0, 196, 0], ref: 'detail-belly-seam.jpg' },
    'shoulder-head': { azimuth: 0, elevation: 10, fov: 7, fit: 0.24, target: [0, 268, 0], ref: 'detail-shoulder-head.jpg' },
    'neck-blades': { azimuth: 0, elevation: 6, fov: 7, fit: 0.25, target: [0, 340, 0], ref: 'detail-neck-blades.jpg' },
    'foot-front': { azimuth: 0, elevation: 15, fov: 7, fit: 0.4, target: [0, 65, 0], ref: 'detail-foot-front.jpg' },
    'foot-mask': { azimuth: 0, elevation: 16, fov: 18, fit: 0.29, target: [0, 85, 0], ref: 'detail-foot-mask.jpg' },
    'foot-seam': { azimuth: -60, elevation: 15, fov: 7, fit: 0.4, target: [0, 65, 0], ref: 'detail-foot-seam.jpg' },
    'shoulder-seam': { azimuth: -60, elevation: 10, fov: 7, fit: 0.24, target: [0, 280, 0], ref: 'detail-shoulder-seam.jpg' },
    'belly-half': { azimuth: 30, elevation: 12, fov: 7, fit: 0.24, target: [55, 190, 95], ref: 'detail-belly-half.jpg' },
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
    const ridges = kit.latheFlanges(body, {
      azimuths: SEAMS, ranges: [{ range: { y0: 283, y1: 326 } }], gap: 0, seed: seed + 14,
      height: 1.1, thickness: 1.9, embed: 0.8, taper: 6, bevel: 0.35, waver: 0.2, notches: { shape: 'none' }, material: plain, part: 'body',
      ends: { end: { type: 'taper', length: 4 } },
    })
    for (const r of ridges) body.add(r)

    // ---------------------------------------------------------------- heads
    await onProgress(0.88, 'heads')
    const voxel = Math.max(0.32, 0.5 / Math.sqrt(q))
    const headGeo = kit.meshSDF(zunHeadSDF({ wallR: 160, droop: 78, muzzle: 17, scale: 1.06, embed: 4 }), { voxel })
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
    void info

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
