// Nezu Museum bu 饕餮文瓿 (90082) — Shang–Western Zhou, 11th c. BC. Reconstructed from the project owner's ONE
// photograph (reference/nezu-bu/photo-06.jpg: head-on at a belly mask, the camera at about lid height) via
// reference/nezu-bu/dossier.md. The size is INFERRED (no dimension on the label): scale from the ground-line pitch.
// Everything the photograph does not show (the back, the lid's far side, the inside) is inferred: the back repeats
// the front. Units mm, Y up, front (+Z) = the low beaded ridge at the centre of a belly mask.
//
// Form (nezu-bu/form.js): a squat, broad-shouldered round jar — a ring foot with a plain flaring base band, a
// two-row frieze and a plain collar; a wide belly over a sloping underside; a sloping shoulder and a thick rounded
// lip; a domed lid with a projecting ledge and a bud knob on a stem. Two tall hooked flanges divide the body at
// ±90° (shoulder and belly), low beaded ridges run down the mask centres (0°, 180°); four bird-headed flanges stand on
// the lid; on the foot two hooked flanges (±90°) and two low beaded ridges (0°, 180°). Two small framed openings flank
// each foot ridge at the mask centres.
// Décor (nezu-bu/decor.js) is TRACED from photo-06 developed onto each register's panel (reference/nezu-bu/faces/).

import * as THREE from 'three'
import { LV, BODY, LID, KNOB, POSTS, POST_TOP, RIDGES, AZ, hookTeeth, dividerTeeth, lidTeeth } from './nezu-bu/form.js'
import { roundShell, meridianPath, revolveSolid } from './nezu-bu/shell.js'
import { maskPanel, shoulderPanel, footPanel, lidPanel } from './nezu-bu/decor.js'

export default {
  id: 'nezu-bu',
  order: 11,
  title: 'Bu with Taotie Design',
  titleZh: '饕餮文瓿',
  type: 'bu',
  date: 'Shang–Western Zhou dynasty, 11th century BC',
  period: 'Shang–Western Zhou (as the label dates it)',
  findspot: 'Not stated on the label',
  collection: 'Nezu Museum, Tokyo',
  accession: '90082 (number on the gallery label; exhibit 14)',
  designation: 'Not stated on the label',
  dimensions: { h: 282, w: 236, d: 236, inferred: true, note: 'inferred from the ground-line pitch on the photograph (±20 %): H to the knob tip, W across the divider flanges; the label gives no dimensions. Proportions are measured (camera solve, dossier §b).' },
  blurb:
    'A squat, broad-shouldered lidded jar for wine. Long-bodied dragons with dotted discs in their coils run round the shoulder, and a great taotie in broad raised bands — round boss eyes under hooked horns, its bands cut with lines that follow their edges — fills each side of the belly over a fine ground, between tall hooked flanges. ' +
    'The domed lid carries hooked flanges and a bud-shaped knob; the ring foot has a frieze pierced by small openings. ' +
    'Reconstructed from one of the project owner’s photographs: the size is inferred, and the back repeats the front.',
  defaultPatina: 'nezu-bu',
  views: {
    // photo-06's own camera station (fitted to the outline, dossier §b.1): ≈ 0.61 m from the axis at ≈ 180 mm above
    // the plinth (about the lid's ledge), looking slightly down; the frame is the photograph cropped to 4:3
    front: { azimuth: -3.5, elevation: 4.1, fov: 31.34, fit: 0.799, target: [37, 137, 2], ref: 'front.jpg' },
    'three-quarter': { azimuth: 45, elevation: 10, fov: 28, fit: 1.08, target: [0, 140, 0] },
    side: { azimuth: 90, elevation: 6, fov: 28, fit: 1.08, target: [0, 140, 0] },
    back: { azimuth: 180, elevation: 6, fov: 28, fit: 1.08, target: [0, 140, 0] },
    top: { azimuth: 0, elevation: 82, fov: 28, fit: 1.1, target: [0, 140, 0] },
    // details: the crop boxes of SOURCES.md re-projected through the same station; fit (fix pass) = the crop's HEIGHT
    // in mm (≈ 4.1 px/mm on the belly, 3.44 at the lid) / 2 / R (R ≈ 217 mm): the stage fits the vertical extent (the knob view is lifted to the
    // stage's lowest elevation, 1.2°: the photograph looks up at it by ≈ 5°)
    'detail-knob': { azimuth: -2.7, elevation: 1.2, fov: 10.02, fit: 0.25, target: [29, 238, 1], ref: 'detail-knob.jpg' },
    'detail-shoulder': { azimuth: -4.4, elevation: 3.1, fov: 9.4, fit: 0.13, target: [40, 148, 89], ref: 'detail-shoulder.jpg' },
    'detail-mask': { azimuth: -5.1, elevation: 8, fov: 8.57, fit: 0.15, target: [45, 106, 94], ref: 'detail-mask.jpg' },
    'detail-eye': { azimuth: -5.8, elevation: 7.6, fov: 3.77, fit: 0.072, target: [52, 110, 91], ref: 'detail-eye.jpg' },
    'detail-flange': { azimuth: -3.5, elevation: 6, fov: 11.4, fit: 0.232, target: [-112, 111, 6], ref: 'detail-flange.jpg' }, // re-aimed (fix pass): on the left divider flange itself
    'detail-foot': { azimuth: -1.7, elevation: 15.3, fov: 10.85, fit: 0.215, target: [15, 32, 77], ref: 'detail-foot.jpg' },
    // flat faces (KIT.md § Flat faces; reference/nezu-bu/faces.json): chord planes down photo-06's line of sight
    'face-belly': { face: { center: [0, 100, 104.67], normal: [0, 0.1568, 0.9876], up: [0, 0.9876, -0.1568], width: 220, height: 50 }, ref: 'faces/face-belly.jpg' },
    'face-shoulder': { face: { center: [0, 143, 100.89], normal: [0, 0.0722, 0.9974], up: [0, 0.9974, -0.0722], width: 220, height: 34 }, ref: 'faces/face-shoulder.jpg' },
    'face-foot': { face: { center: [0, 37, 78.11], normal: [0, 0.2607, 0.9654], up: [0, 0.9654, -0.2607], width: 170, height: 38 }, ref: 'faces/face-foot.jpg' },
    'face-lid': { face: { center: [0, 209, 61.49], normal: [0, -0.0539, 0.9985], up: [0, 0.9985, 0.0539], width: 130, height: 34 }, ref: 'faces/face-lid.jpg' },
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const q = Math.max(0.25, quality)
    const ppmm = 6.2 * Math.sqrt(q) // ≈ 1.25 mm ground-line pitch: ≈ 7.7 px per pitch at q 1
    const seed = 90082
    const plain = new kit.PatinaMaterial()
    const panels = {}
    const object = new THREE.Group()
    object.name = 'nezu-bu'

    // ---------------------------------------------------------------- body
    const profile = new kit.Profile(BODY, { ridges: RIDGES })
    const jobs = [['foot', LV.foot, footPanel], ['mask', LV.mask, maskPanel], ['shoulder', LV.shoulder, shoulderPanel]]
    const registers = {}
    for (let i = 0; i < jobs.length; i++) {
      const [name, [y0, y1], fn] = jobs[i]
      registers[name] = {
        y0, y1, map: 'true', fade: 1.0,
        relief: (k, size) => (panels[name] ??= fn(kit, { width: Math.max(size.widthBottom, size.widthTop, size.width), height: size.height }, { ppmm, seed: seed + i })),
      }
    }
    await onProgress(0.05, 'body')
    const holes = AZ.holes.map((azimuth) => ({ shape: 'rect', azimuth, y: LV.holes + 0.3, w: 6.2, h: 5 }))
    const body = kit.lathe({
      profile, sectors: { count: 2, center: 0 }, registers, holes,
      wall: (s, y) => (y < 64 ? 3.6 : 4),
      lip: { thickness: 4.5, length: 5, shape: 'round' },
      floor: { y: 66, thickness: 5, dome: 2 }, foot: { wall: 3.6 },
      tolerance: { seed: 6, ovality: 0.005, rim: 0.006, lean: 0 },
      density: 0.62, quality: q, material: plain, part: 'body',
    })
    object.add(body)

    // ---------------------------------------------------------------- flanges
    await onProgress(0.55, 'flanges')
    const info = body.userData.lathe
    const flanges = []
    // photo-06: the flanges read darker than the walls (dark olive; the lid's near-black)
    const flangeMat = new kit.PatinaMaterial({ meshTint: '#70726a' })
    const lidFlangeMat = new kit.PatinaMaterial({ meshTint: '#50524c' })
    const addFlange = (path, o) => {
      const f = kit.flange({ path, thickness: 5.6, taper: 3, waver: 0.3, bevel: 0.6, material: flangeMat, part: 'flanges', ...o })
      object.add(f)
      flanges.push(f)
    }
    // dividers (±90°): shoulder + belly in one run, ≈ 13 mm proud, eleven hooked teeth
    for (const az of AZ.dividers) {
      // photo-06: the top ends rounding into the shoulder at y ≈ 154 (no spike); blocky beaked teeth at ≈ 9.6 mm
      const [s0, s1] = info.range({ y0: 66.5, y1: 154 })
      const path = info.meridian(az, { s0, s1 })
      addFlange(path, { outline: dividerTeeth(path.length, { height: 13, pitch: 9.6, embed: 2 }), seed: seed + az })
    }
    // mask-centre ridges (0°, 180°): low, narrow, beaded
    for (const az of AZ.masks) {
      const [s0, s1] = info.range({ y0: 78, y1: 158 })
      addFlange(info.meridian(az, { s0, s1 }), { height: 3.2, thickness: 3.4, embed: 1.5, bevel: 0.5, notches: { shape: 'square', pitch: 4.2, depth: 0.6, width: 1.6 }, seed: seed + 7 + az, incise: false })
    }
    // foot: the side ones (±90°) four hooked teeth over the upper half (photo-06, y ≈ 34–63, in profile); the front and
    // back ones (0°, 180°) a low narrow beaded ridge running down the frieze to the base band (fix pass: photo-06 /
    // detail-foot show no teeth there)
    for (const az of AZ.all4) {
      const [s0, s1] = info.range({ y0: 21, y1: 63 })
      const path = info.meridian(az, { s0, s1 })
      if (az % 180 === 0) addFlange(path, { height: 3, thickness: 3.4, embed: 1.5, bevel: 0.5, notches: { shape: 'square', pitch: 4.4, depth: 0.5, width: 1.4 }, seed: seed + 11 + az, incise: false, material: flangeMat })
      else addFlange(path, { outline: hookTeeth(path.length, { height: 7.5, pitch: 7.6, embed: 2, depth: 0.55, startPlain: 13.5, lowHeight: 2.6 }), thickness: 5, seed: seed + 11 + az })
    }

    // ---------------------------------------------------------------- lid
    await onProgress(0.65, 'lid')
    const lidP = new kit.Profile(LID)
    const sA = (y) => lidP.sAtY(y)
    const lid = roundShell(kit, {
      profile: lidP, quality: q, material: plain, thickness: 3,
      bands: [
        { name: 'ledge', s0: 0, s1: sA(LV.lidDeco[0]), closeBottom: true },
        { name: 'slope', s0: sA(LV.lidDeco[0]), s1: sA(LV.lidDeco[1]), relief: (k, size) => (panels.lid ??= lidPanel(kit, size, { ppmm, seed: seed + 5 })) },
        { name: 'crown', s0: sA(LV.lidDeco[1]), s1: lidP.length },
      ],
    })
    object.add(lid)
    const lidFlanges = []
    for (const az of AZ.all4) {
      // photo-06 (the right one in profile): three chunky teeth, each topped by a bird head whose beak points to the knob
      const s0 = lidP.sAtY(195.2), s1 = lidP.sAtY(224.4)
      const path = meridianPath(lidP, az, s0, s1)
      const f = kit.flange({ path, outline: lidTeeth(path.length, { height: 14, pitch: 19, embed: 2 }), thickness: 5.4, taper: 3, waver: 0.3, bevel: 0.6, seed: seed + 21 + az, material: lidFlangeMat, part: 'flanges' })
      object.add(f)
      flanges.push(f)
      lidFlanges.push(f)
    }

    // ---------------------------------------------------------------- knob
    await onProgress(0.75, 'knob')
    // photo-06: the knob is near-black and glossy-dull, darker than the lid (a per-mesh multiply, beauty only)
    const knobMat = new kit.PatinaMaterial({ meshTint: '#4a4a46' })
    const knob = new THREE.Group()
    knob.userData.part = 'knob'
    knob.add(new THREE.Mesh(revolveSolid(KNOB, { segments: Math.round(40 * Math.sqrt(q)) }), knobMat))
    const postGeo = new THREE.CylinderGeometry(1, 1, 1, Math.round(16 * Math.sqrt(q)))
    for (const [x, z, r] of POSTS) {
      const g = postGeo.clone().applyMatrix4(new THREE.Matrix4().makeScale(r, POST_TOP - 224.6, r)).applyMatrix4(new THREE.Matrix4().makeTranslation(x, (POST_TOP + 224.6) / 2, z))
      knob.add(new THREE.Mesh(g, knobMat))
    }
    object.add(knob)

    object.traverse((m) => { if (m.isMesh) { m.castShadow = m.receiveShadow = true } })
    await onProgress(1, 'done')
    return { object, parts: { body, lid, knob, flanges }, panels }
  },
}
