// Nezu Museum hu 蟠螭文壺 (90099) — Spring and Autumn period, 7th–6th c. BC. Reconstructed from the project owner's
// ONE photograph (reference/nezu-hu/photo-11.jpg: the front, the camera a little above the rim, zoomed in from afar)
// via reference/nezu-hu/dossier.md. The size is INFERRED (no dimension on the label): see dossier §b.2. Everything the
// photograph does not show (the back, the handles' thickness, the inside) is inferred: the back repeats the front.
// Units mm, Y up, front (+Z) = the photograph's line of sight; the two handles at ±90°.
//
// Form (nezu-hu/form.js): a round, pear-shaped hu — a plain flaring ring foot over a narrow base band; a broad low
// belly; a sloping shoulder; a tall plain neck flaring to an everted lip. Two feline-dragon handles stand on the
// shoulder (nezu-hu/handles.js, sculpture). Décor (nezu-hu/decor.js): two bands of stamped panchi interlace — four
// rows on the shoulder, nine on the body — between twisted ropes and plain cords, every band split by a fine median
// line; the neck is plain but for an engraved inscription on the front (hand-traced, not transcribed).

import * as THREE from 'three'
import { LV, BODY } from './nezu-hu/form.js'
import { bodyPanel, shoulderPanel, neckPanel } from './nezu-hu/decor.js'
import { handleSDF, orientConsistently } from './nezu-hu/handles.js'

export default {
  id: 'nezu-hu',
  order: 17,
  title: 'Hu with Panchi Design',
  titleZh: '蟠螭文壺',
  type: 'hu',
  date: 'Spring and Autumn period, 7th–6th centuries BC',
  period: 'Eastern Zhou, Spring and Autumn period',
  findspot: 'Not stated on the label',
  collection: 'Nezu Museum, Tokyo',
  accession: '90099 (number on the gallery label; exhibit 17)',
  designation: 'Not stated on the label',
  dimensions: { h: 448, w: 341, d: 341, inferred: true, note: 'inferred (±20 %): the label gives no dimensions; scale from the stamped interlace and the inscription (dossier §b.2). H to the rim; W = D = the belly diameter (the handles stay inside it). Proportions are measured on the photograph through a fitted camera.' },
  blurb:
    'A pear-shaped wine flask of the Spring and Autumn period. Its shoulder and belly are covered in rows of tiny interlaced coiled serpents (panchi), pressed into the mould from one carved pattern block again and again, between twisted ropes; two feline dragons climb the shoulder as handles. ' +
    'The front of the tall plain neck bears an engraved inscription of about 25 graphs in seven columns; the photograph shows where its strokes run but does not allow any graph to be read with confidence, so the model reproduces the visible strokes without a transcription. Every raised band of the interlace is split down its centre by a fine incised line. Reconstructed from one of the project owner’s photographs: the size is inferred, and the back repeats the front.',
  defaultPatina: 'nezu-hu',
  views: {
    // photo-11's own station: the fit is almost orthographic (dossier §b.1) — a long lens, 7.8° above the rim
    front: { azimuth: 0, elevation: 7.8, fov: 10, fit: 0.765, target: [3, 219, 0], ref: 'front.jpg' },
    side: { azimuth: 90, elevation: 6, fov: 24, fit: 1.08, target: [0, 222, 0] },
    'three-quarter': { azimuth: 40, elevation: 12, fov: 24, fit: 1.08, target: [0, 222, 0] },
    top: { azimuth: 0, elevation: 80, fov: 24, fit: 1.1, target: [0, 222, 0] },
    // details: the crop boxes of SOURCES.md re-projected through the same station
    'detail-handle': { azimuth: 0, elevation: 7.8, fov: 4, fit: 0.18, target: [121, 292, 0], ref: 'detail-handle.jpg' },
    'detail-handle-left': { azimuth: 0, elevation: 7.8, fov: 4, fit: 0.18, target: [-115, 292, 0], ref: 'detail-handle-left.jpg' },
    'detail-panchi': { azimuth: 0, elevation: 7.8, fov: 4, fit: 0.129, target: [5, 278, 107], ref: 'detail-panchi.jpg' },
    'detail-body': { azimuth: 0, elevation: 7.8, fov: 4, fit: 0.155, target: [4, 166, 167], ref: 'detail-body.jpg' },
    'detail-cord': { azimuth: 0, elevation: 7.8, fov: 4, fit: 0.06, target: [2, 231, 137], ref: 'detail-cord.jpg' },
    'detail-inscription': { azimuth: 0, elevation: 7.8, fov: 4, fit: 0.206, target: [-5, 364, 90], ref: 'detail-inscription.jpg' },
    'detail-foot': { azimuth: 0, elevation: 7.8, fov: 4, fit: 0.172, target: [-56, 48, 126], ref: 'detail-foot.jpg' },
    // TMP-HUFIX
    'tmp-hR-front': { azimuth: 0, elevation: 7.8, fov: 6, fit: 0.2, target: [122, 292, 0] },
    'tmp-hR-side': { azimuth: 90, elevation: 8, fov: 6, fit: 0.2, target: [122, 292, 0] },
    'tmp-hR-34': { azimuth: 50, elevation: 20, fov: 6, fit: 0.22, target: [122, 292, 0] },
    'tmp-hR-back': { azimuth: 150, elevation: 15, fov: 6, fit: 0.22, target: [122, 292, 0] },
    'tmp-head-top': { azimuth: 60, elevation: 55, fov: 6, fit: 0.1, target: [130, 325, 0] },
    'tmp-body-close': { azimuth: 0, elevation: 7.8, fov: 3, fit: 0.06, target: [0, 166, 168] },
    'tmp-shoulder-close': { azimuth: 0, elevation: 20, fov: 3, fit: 0.06, target: [0, 270, 112] },
    // flat faces (KIT.md § Flat faces; reference/nezu-hu/faces.json): chord planes down photo-11's line of sight
    'face-shoulder': { face: { center: [0, 274, 109.07], normal: [0, 0.135, 0.9908], up: [0, 0.9908, -0.135], width: 200, height: 76 }, ref: 'faces/face-shoulder.jpg' },
    'face-body': { face: { center: [0, 142, 170.17], normal: [0, 0.135, 0.9908], up: [0, 0.9908, -0.135], width: 260, height: 164 }, ref: 'faces/face-body.jpg' },
    'face-neck': { face: { center: [0, 370, 90.49], normal: [0, 0.135, 0.9908], up: [0, 0.9908, -0.135], width: 200, height: 110 }, ref: 'faces/face-neck.jpg' },
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const q = Math.max(0.25, quality)
    const ppmm = 5 * Math.sqrt(q) // a 2.8 mm band ≈ 14 px at q 1
    const seed = 90099
    const plain = new kit.PatinaMaterial()
    const panels = {}
    const object = new THREE.Group()
    object.name = 'nezu-hu'

    // ---------------------------------------------------------------- body
    const profile = new kit.Profile(BODY)
    await onProgress(0.05, 'body')
    const registers = {
      body: {
        y0: LV.body[0], y1: LV.cords[1], map: 'true', fade: { u0: 0, u1: 0, v0: 1.2, v1: 1.2 },
        relief: (k, size) => (panels.body ??= bodyPanel(kit, profile, size, { ppmm, seed })),
      },
      shoulder: {
        y0: LV.cords[1], y1: 316, map: 'true', fade: { u0: 0, u1: 0, v0: 1.2, v1: 1.2 },
        relief: (k, size) => (panels.shoulder ??= shoulderPanel(kit, profile, size, { ppmm, seed: seed + 1 })),
      },
      // the neck: plain but for the incised inscription on the front (front sector only; the back is plain)
      neck: {
        y0: 316, y1: 422, map: 'true', fade: { u0: 0, u1: 0, v0: 1.2, v1: 1.2 },
        relief: (k, size) => (k === 0 ? (panels.neck ??= neckPanel(kit, profile, size, { ppmm: ppmm * 0.9, seed: seed + 2 })) : null),
      },
    }
    const body = kit.lathe({
      profile, sectors: { count: 2, center: 0 }, registers,
      wall: (s, y) => (y < 60 ? 4.5 : 3.8),
      lip: { thickness: 5.2, length: 6, shape: 'round' },
      floor: { y: 66, thickness: 5, dome: 2 }, foot: { wall: 4.5 },
      tolerance: { seed: 11, ovality: 0.006, rim: 0.004, lean: 0 },
      density: 0.55, quality: q, material: plain, part: 'body',
    })
    object.add(body)

    // ---------------------------------------------------------------- handles
    await onProgress(0.7, 'handles')
    const handleMat = new kit.PatinaMaterial()
    const voxel = Math.max(0.45, 0.6 / Math.sqrt(q))
    const hGeo = kit.meshSDF(handleSDF(), { voxel })
    orientConsistently(hGeo) // one consistent outward winding (meshSDF's per-triangle gradient test flips a few in the grooves)
    const handles = []
    for (const az of [90, -90]) {
      const m = new THREE.Mesh(hGeo, handleMat)
      // handle plane: x radial → the azimuth's direction (sin θ, 0, cos θ); z across → the tangent
      m.rotation.y = ((az - 90) * Math.PI) / 180
      m.userData.part = 'handles'
      object.add(m)
      handles.push(m)
    }

    object.traverse((m) => { if (m.isMesh) { m.castShadow = m.receiveShadow = true } })
    await onProgress(1, 'done')
    return { object, parts: { body, handles }, panels }
  },
}
