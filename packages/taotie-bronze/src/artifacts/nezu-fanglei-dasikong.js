// Nezu Museum square lei 饕餮文方罍 (90079), said to be from the Dasikong site, Anyang — Shang dynasty, 13th–12th
// c. BC, Important Cultural Property. Reconstructed from the project owner's two front photographs
// (reference/nezu-fanglei-dasikong/photo-34.jpg, near head-on; photo-03.jpg, from a little left and higher) via
// reference/nezu-fanglei-dasikong/dossier.md. H = 500 mm is INFERRED (no dimension on the label). Units mm, Y up,
// front (+Z) = the face with the low lug; the loop handles are on ±X.
//
// Form (nezu-fanglei-dasikong/form.js): a ROUNDED-square body (no flanges anywhere) swelling from a narrow base to
// its widest at the main register and rounding in over a sloping shoulder to a flat ledge; a straight square collar;
// a four-sided DOMED lid with a slotless centre flange down each slope and a little hipped-roof knob. The body
// is lofted side by side (form.loftSide), each side carrying ONE 1:1 panel from corner diagonal to corner diagonal,
// because the hanging blades of the lower belly straddle the corners. Décor (nezu-fanglei-dasikong/relief.js) is
// traced from the flattened faces of photo-34; sculpture (sculpture.js): handles, shoulder heads, the low lug.

import * as THREE from 'three'
import { H, LV, RHO, COLLAR, bodyW, bodyR, lidW, lidR, quarterLen, arcTable, loftSide, ringLoft, capMesh } from './nezu-fanglei-dasikong/form.js'
import { bodyPanel, collarPanel, lidPanel } from './nezu-fanglei-dasikong/relief.js'
import { shoulderHeadSDF, handleSDF, lugSDF, lugCavity } from './nezu-fanglei-dasikong/sculpture.js'

/** a flange path through world points (bottom → top) with an outward direction per point */
function polyPath(pts, outs) {
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + pts[i].distanceTo(pts[i - 1]))
  const last = pts.length - 1
  return {
    isPath: true, length: cum[last],
    frame(s) {
      let i = 1
      while (i < last && cum[i] < s) i++
      const t = (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1)
      const p = pts[i - 1].clone().lerp(pts[i], t)
      const d = pts[i].clone().sub(pts[i - 1]).normalize()
      const n = outs[i - 1].clone().lerp(outs[i], Math.min(1, Math.max(0, t)))
      n.addScaledVector(d, -n.dot(d)).normalize()
      return { p, n, d, b: new THREE.Vector3().crossVectors(d, n) }
    },
  }
}

export default {
  id: 'nezu-fanglei-dasikong',
  order: 9,
  title: 'Square Lei with Taotie Design (Dasikong)',
  titleZh: '饕餮文方罍',
  type: 'fanglei',
  date: '13th–12th century BC',
  period: 'Shang dynasty (Anyang)',
  findspot: 'Said to have been excavated from the Dasikong site, Anyang, Henan (伝河南省安陽殷墟大司空村出土)',
  collection: 'Nezu Museum, Tokyo',
  accession: '90079 (number on the gallery label; exhibit 12)',
  designation: 'Important Cultural Property (重要文化財)',
  dimensions: { h: 500, w: 284, d: 256, inferred: true, note: 'INFERRED: H assumed 500 mm (the label gives none; square lei run 40–55 cm, and the leiwen then measures ≈ 1.6 mm pitch); proportions back-projected from photo-34; w, d = body without handles; the depth is not visible in either photograph (assumed 0.9 × width)' },
  blurb:
    'A tall wine jar of rounded-square section with broad shoulders and a body that narrows toward its base, closed by a four-sided domed lid with a small roof-shaped knob. ' +
    'Masks with fat hooked horns run round the upper belly over a fine thunder-pattern ground, long blades hang from it over the plain lower body and straddle the corners, a horned head and a band of whorl bosses ride the shoulder, beast-headed loop handles stand on the sides, and low on the front a small beast head stands out from the wall on a loop. ' +
    'Reconstructed from two of the project owner’s photographs of the front: the height is inferred, and the sides and back repeat the front.',
  defaultPatina: 'nezu-fanglei-dasikong',
  views: {
    // photo-34: az ≈ 3.5°, el ≈ 10°, ≈ 0.9 m (vfov ≈ 38°) — an ASSUMED camera, .work/r8-dsk/solve/cam.py
    front: { azimuth: 3.5, elevation: 10, fov: 38, fit: 0.92, target: [0, 250, 0], ref: 'front.jpg' },
    'front-high': { azimuth: 14, elevation: 12, fov: 38, fit: 0.97, target: [0, 245, 0], ref: 'front-high.jpg' },
    'three-quarter': { azimuth: 40, elevation: 12, fov: 26, fit: 1.08 },
    side: { azimuth: 90, elevation: 8, fov: 26, fit: 1.08 },
    back: { azimuth: 180, elevation: 8, fov: 26, fit: 1.08 },
    top: { azimuth: 15, elevation: 72, fov: 28, fit: 1.05 },
    // details: same camera as photo-34; each ref is the 1:1 crop of photo-34 that the view frames (4:3,
    // .work/r8-dsk/solve/crops.py; R ≈ 332 mm)
    'detail-lid': { azimuth: 3.5, elevation: 10, fov: 20, fit: 0.2, target: [0, 438, 60], ref: 'detail-lid.jpg' },
    'detail-shoulder': { azimuth: 3.5, elevation: 10, fov: 20, fit: 0.165, target: [-58, 318, 112], ref: 'detail-shoulder.jpg' },
    'detail-head': { azimuth: 3.5, elevation: 10, fov: 20, fit: 0.09, target: [0, 320, 125], ref: 'detail-head.jpg' },
    'detail-main': { azimuth: 3.5, elevation: 10, fov: 20, fit: 0.165, target: [-58, 244, 126], ref: 'detail-main.jpg' },
    'detail-blade': { azimuth: 3.5, elevation: 10, fov: 20, fit: 0.286, target: [0, 120, 100], ref: 'detail-blade.jpg' },
    'detail-handle': { azimuth: 3.5, elevation: 10, fov: 20, fit: 0.09, target: [145, 318, 0], ref: 'detail-handle.jpg' },
    'detail-lug': { azimuth: 3.5, elevation: 10, fov: 20, fit: 0.114, target: [0, 70, 95], ref: 'detail-lug.jpg' },
    // flat faces (KIT.md § Flat faces): head-on on each zone's chord plane; ref = the flattened photo-34
    'face-lid': { face: { center: [0, 433, 59.62], normal: [0, 0.5188, 0.8549], up: [0, 0.8549, -0.5188], width: 168, height: 81.2 }, ref: 'faces/face-lid.jpg' },
    'face-collar': { face: { center: [0, 372.75, 78.3], normal: [0, 0, 1], up: [0, 1, 0], width: 174, height: 53.5 }, ref: 'faces/face-collar.jpg' },
    'face-shoulder': { face: { center: [0, 315, 108.61], normal: [0, 0.5054, 0.8629], up: [0, 0.8629, -0.5054], width: 228, height: 75.9 }, ref: 'faces/face-shoulder.jpg' },
    'face-main': { face: { center: [0, 245, 124.42], normal: [0, -0.0749, 0.9972], up: [0, 0.9972, 0.0749], width: 240, height: 74.2 }, ref: 'faces/face-main.jpg' },
    'face-blades': { face: { center: [0, 119, 99.16], normal: [0, -0.2385, 0.9711], up: [0, 0.9711, 0.2385], width: 236, height: 199.6 }, ref: 'faces/face-blades.jpg' },
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const q = Math.max(0.25, quality)
    const ppmm = 4.0 * Math.sqrt(q)
    const dens = 0.62 * Math.sqrt(q)
    const seed = 90079
    const plain = new kit.PatinaMaterial()
    const ledge = new kit.PatinaMaterial({ cavity: 0.5 })
    const object = new THREE.Group()
    object.name = 'nezu-fanglei-dasikong'
    const panels = {}
    const V = (x, y, z) => new THREE.Vector3(x, y, z)
    const group = (part) => { const g = new THREE.Group(); g.userData.part = part; object.add(g); return g }

    // ---------------------------------------------------------------- body (rounded square, one panel per side)
    const Rb = (y) => Math.min(bodyR(y), RHO * bodyW(y) - 0.5)
    const Qh = (k) => (y) => quarterLen(bodyW(y), RHO * bodyW(y), Rb(y), k) / 2
    const arcB = arcTable(LV.base, LV.shoulder, bodyW)
    const kxSide = Qh(1)(270) / Qh(0)(270)
    await onProgress(0.03, 'belly · broad faces (traced)')
    const pf = bodyPanel(kit, { ppmm, seed, Qh: Qh(0), arc: arcB, kx: 1, lug: true, Hmax: LV.shoulder })
    // (round dsk-lug: NO pocket under the lug — the dark patch is the shade of the loop and the gap behind its head)
    panels.bodyLong = pf.relief
    panels.bodyBack = pf.relief
    await onProgress(0.3, 'belly · narrow faces')
    const ps = bodyPanel(kit, { ppmm: ppmm * 0.8, seed: seed + 1, Qh: Qh(1), arc: arcB, kx: kxSide, lug: false, Hmax: LV.shoulder })
    panels.bodyShort = ps.relief
    await onProgress(0.55, 'collar and lid')
    const collarW = (k) => quarterLen(COLLAR, RHO * COLLAR, 3, k) + 2
    panels.collarLong = collarPanel(kit, { ppmm, seed: seed + 2, W: collarW(0), y0: 348, y1: LV.collar })
    panels.collarShort = collarPanel(kit, { ppmm: ppmm * 0.85, seed: seed + 3, W: collarW(1), y0: 348, y1: LV.collar, kx: collarW(1) / collarW(0) })
    const Rl = (y) => Math.min(lidR(y), RHO * lidW(y) - 0.5)
    const QhL = (k) => (y) => quarterLen(lidW(y), RHO * lidW(y), Rl(y), k) / 2
    const arcL = arcTable(LV.eave, LV.lidTop, lidW, 0.25)
    const arcL0 = (y) => arcL(y) // arc from the eave
    const pl = lidPanel(kit, { ppmm, seed: seed + 4, Qh: QhL(0), arc: arcL0, y0: LV.eave, y1: LV.lidTop })
    const plS = lidPanel(kit, { ppmm: ppmm * 0.85, seed: seed + 5, Qh: QhL(1), arc: arcL0, y0: LV.eave, y1: LV.lidTop, kx: QhL(1)(LV.eave) / QhL(0)(LV.eave) })
    panels.lidLong = pl.relief
    panels.lidShort = plS.relief

    // ---------------------------------------------------------------- casting
    await onProgress(0.72, 'casting')
    const mat = (relief, meshTint) => new kit.PatinaMaterial({ relief, meshTint })
    // photo-34 / photo-03: the collar is near-black, the lid and knob darker than the body (per-mesh tints, beauty only)
    const TINT = { collar: '#4c4d49', lid: '#8d8e88' }
    const bodyG = group('body')
    const matB = [mat(pf.relief), mat(ps.relief), mat(pf.relief)]
    for (let k = 0; k < 4; k++) {
      const p = k % 2 ? ps : pf
      bodyG.add(loftSide(kit, { k, y0: LV.base, y1: LV.shoulder, W: bodyW, R: Rb, relief: p.relief, arc: arcB, panelW: p.panelW, material: k % 2 ? matB[1] : matB[k === 2 ? 2 : 0], density: dens, fade: 1.0 }))
    }
    bodyG.add(capMesh({ y: 0, a: bodyW(0), b: RHO * bodyW(0), r: Rb(0) }, plain, false))
    // the ledge: from the shoulder top in to the collar, a small round at its outer edge
    const wTop = bodyW(LV.shoulder)
    const ring = (y, a, r) => ({ y, a, b: RHO * a, r })
    // (r8-dsk-fix: photo-03 shows no broad flat deck — the shoulder keeps rounding up and in to a short narrow ledge
    // at the collar foot, so the ledge now rises ≈ 5 mm as it runs in)
    const led = ringLoft([ring(LV.shoulder, wTop, Rb(LV.shoulder)), ring(LV.shoulder + 2.2, wTop - 3.2, Rb(LV.shoulder) - 2.4), ring(LV.shoulder + 4.2, COLLAR + 4.5, 6), ring(LV.shoulder + 5, COLLAR + 1.2, 4), ring(LV.shoulder + 5, COLLAR - 1, 3)], ledge)
    bodyG.add(led)

    const collarG = group('collar')
    const matC = [mat(panels.collarLong, TINT.collar), mat(panels.collarShort, TINT.collar)]
    for (let k = 0; k < 4; k++) {
      collarG.add(loftSide(kit, { k, y0: 348, y1: LV.collar, W: () => COLLAR, R: () => 3, relief: k % 2 ? panels.collarShort : panels.collarLong, arc: (y) => y - 348, panelW: collarW(k % 2), material: matC[k % 2], density: dens, fade: 0.8 }))
    }

    const lidG = group('lid')
    const matL = [mat(pl.relief, TINT.lid), mat(plS.relief, TINT.lid)]
    const lidPlain = new kit.PatinaMaterial({ meshTint: TINT.lid })
    for (let k = 0; k < 4; k++) {
      const p = k % 2 ? plS : pl
      lidG.add(loftSide(kit, { k, y0: LV.eave, y1: LV.lidTop, W: lidW, R: Rl, relief: p.relief, arc: arcL0, panelW: p.panelW, material: matL[k % 2], density: dens * 1.2, fade: 0.8 }))
    }
    // the lid's lip: it sits on the collar top and overhangs it a little
    lidG.add(ringLoft([ring(LV.collar, COLLAR + 0.6, 4), ring(LV.collar + 0.3, lidW(LV.eave) + 0.6, Rl(LV.eave)), ring(LV.eave, lidW(LV.eave) + 0.6, Rl(LV.eave)), ring(LV.eave, lidW(LV.eave), Rl(LV.eave))], lidPlain))
    lidG.add(capMesh({ y: LV.collar, a: COLLAR + 0.6, b: RHO * (COLLAR + 0.6), r: 4 }, lidPlain, false))
    lidG.add(capMesh({ y: LV.lidTop, a: lidW(LV.lidTop), b: RHO * lidW(LV.lidTop), r: Rl(LV.lidTop) }, lidPlain, true))

    // knob: a little hipped roof on a thick vertical-sided cap, on a short post (photo-34: 39 mm across)
    const knob = kit.roofKnob({
      width: 40, depth: 35, rise: 7, ridge: 0.7,
      skirt: { height: 0.5, fascia: 17 },
      post: { height: LV.knob - LV.lidTop + 0.5, width: 15, depth: 13.5, waist: 0 },
      material: lidPlain, part: 'knob', embed: 6,
    })
    knob.position.y = LV.lidTop - 0.5
    object.add(knob)

    // lid centre flanges: a plain thick bar down the middle of each slope from under the knob (photo-34)
    const flanges = []
    for (const k of [0, 2]) { // front and back only: the side slopes' silhouettes in photo-34 show none
      const pts = [], outs = []
      for (let i = 0; i <= 16; i++) {
        const y = 424 + (LV.lidTop - 2.5 - 424) * (i / 16)
        const a = lidW(y), dz = RHO * a
        const c = k === 0 ? V(0, y, dz) : k === 1 ? V(a, y, 0) : k === 2 ? V(0, y, -dz) : V(-a, y, 0)
        // outward: horizontal side normal tilted by the slope
        const e = 0.5
        const a2 = lidW(Math.min(LV.lidTop, y + e)), a1 = lidW(Math.max(LV.eave, y - e))
        const dr = ((k % 2 ? 1 : RHO) * (a2 - a1)) / (2 * e)
        const nh = k === 0 ? V(0, 0, 1) : k === 1 ? V(1, 0, 0) : k === 2 ? V(0, 0, -1) : V(-1, 0, 0)
        const n = nh.clone().multiplyScalar(1).add(V(0, -dr, 0)).normalize()
        pts.push(c); outs.push(n)
      }
      const path = polyPath(pts, outs)
      const m = kit.flange({ path, height: (f) => 7.5 + 2.5 * f, thickness: 6.6, notches: null, ends: { start: 'taper', end: 'square' }, embed: 2.5, taper: 1, bevel: 0.35, waver: 0.2, seed: seed + k, material: lidPlain, part: 'flanges' })
      flanges.push(m); object.add(m)
    }

    // ---------------------------------------------------------------- sculpture
    await onProgress(0.86, 'handles and heads')
    const voxel = Math.max(0.6, 0.8 / Math.sqrt(q))
    const sMat = new kit.PatinaMaterial()
    const mesh = (geo, part) => {
      const m = new THREE.Mesh(geo, sMat)
      m.userData.part = part
      m.castShadow = m.receiveShadow = true
      object.add(m)
      return m
    }
    const turn = new THREE.Matrix4().makeRotationY(Math.PI)
    const hGeo = kit.meshSDF(handleSDF(), { voxel })
    const handles = [mesh(hGeo, 'handles'), mesh(hGeo.clone().applyMatrix4(turn), 'handles')]
    const headGeo = kit.meshSDF(shoulderHeadSDF(), { voxel })
    const heads = [mesh(headGeo, 'heads'), mesh(headGeo.clone().applyMatrix4(turn), 'heads')] // back: inferred
    // the low lug: a loop standing out of the wall carrying a head (no hole in the wall: the photographs' dark patch is
    // the loop's shade and the gap behind the head). Its own occlusion as a per-vertex cavity; malachite-green tint.
    const lugSdf = lugSDF()
    const lug = mesh(lugCavity(kit.meshSDF(lugSdf, { voxel: voxel * 0.8 }), lugSdf), 'lug')
    lug.material = new kit.PatinaMaterial({ cavityAttribute: true, meshTint: '#93a88c' })

    await onProgress(1, 'done')
    void H
    return { object, parts: { body: bodyG, collar: collarG, lid: lidG, knob, flanges, handles, heads, lug }, panels }
  },
}
