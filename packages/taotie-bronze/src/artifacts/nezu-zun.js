// Nezu Museum zun 饕餮文尊 (90075) — Shang dynasty, 12th–11th c. BC. Reconstructed from the project owner's
// photographs (reference/nezu-zun/photo-26.jpg head-on at a shoulder head from below the shoulder, photo-28.jpg from
// higher, looking at a divider flange) via reference/nezu-zun/dossier.md. photo-29 / photo-30 are close-ups of a
// DIFFERENT, related vessel (no circle bands, plain centre ridge): comparanda only (dossier §e). The size is INFERRED
// (no dimension on the label): scale from the thread-line pitch. Units mm, Y up, front (+Z) = a shoulder head and
// the mask-centre flange below it.
//
// Form (nezu-zun/form.js): a broad-shouldered zun — a tall plain trumpet mouth ending in an upright lip band, a
// cylindrical neck with three bowstrings, a sloping shoulder with three animal heads in the round (snouts running
// out over the belly) and three hooked slab flanges between them, a narrow collar, a rolled belly top with small
// square studs, the bulging belly, a high foot with three bowstrings, three cross-shaped openings and a frieze.
// Six notched flanges on the belly and on the foot.
// Décor (nezu-zun/decor.js): THREAD RELIEF traced off the developed photographs — a large mask under each head and
// a small one on each divider flange, between bands of domed discs; a mask per 120° on the foot.

import * as THREE from 'three'
import { LV, BODY, RIDGES, AZ, headSDF, SHOULDER_FLANGE, SHOULDER_FLANGE_T } from './nezu-zun/form.js'
import { bellyPanel, circUpPanel, circLowPanel, footPanel, collarPanel, shoulderPanel } from './nezu-zun/decor.js'

const T_NOTCH = { shape: 'T', pitch: 11, depth: 0.55, width: 3 }

export default {
  id: 'nezu-zun',
  order: 10,
  title: 'Zun with Taotie Design',
  titleZh: '饕餮文尊',
  type: 'zun',
  date: 'Shang dynasty, 12th–11th centuries BC',
  period: 'Late Shang (Anyang period)',
  findspot: 'Not stated on the label',
  collection: 'Nezu Museum, Tokyo',
  accession: '90075 (number on the gallery label; exhibit 10)',
  designation: 'Not stated on the label',
  dimensions: { h: 348, w: 360, d: 360, inferred: true, note: 'inferred from the thread-line pitch on the photographs (±20 %); the label gives no dimensions. Proportions are measured (camera solve, dossier §b).' },
  blurb:
    'A broad-shouldered wine vessel: a wide plain trumpet mouth over a sloping shoulder carrying three animal heads in the round, a bulging belly and a high foot pierced by three cross-shaped openings. ' +
    'The belly and foot are drawn in fine raised threads — taotie masks with smooth domed eyes, their parts filled with spirals — between bands of small domed discs, and divided by notched flanges. ' +
    'Reconstructed from two of the project owner’s photographs: the size is inferred, the back repeats the front.',
  defaultPatina: 'nezu-zun',
  views: {
    // the photographs' own camera stations (fitted to the outlines, dossier §b.1): photo-26 ≈ 0.67 m from the axis,
    // ≈ 110 mm above the plinth (below the shoulder: the flare is seen from underneath); photo-28 ≈ 1.03 m out at
    // about rim height (the lip nearly edge-on), turned 55° to look at a divider flange between two heads
    front: { azimuth: 0.5, elevation: -4.9, fov: 49.32, fit: 0.785, target: [23, 156, 139], ref: 'front.jpg' },
    'three-quarter': { azimuth: 53.8, elevation: 11.3, fov: 24.91, fit: 0.632, target: [125, 195, 72], ref: 'three-quarter.jpg' },
    side: { azimuth: 90, elevation: 6, fov: 30, fit: 1.12, target: [0, 175, 0] },
    top: { azimuth: 0, elevation: 82, fov: 30, fit: 1.1, target: [0, 200, 0] },
    // details: the crop boxes of SOURCES.md re-projected through the same stations
    'detail-head': { azimuth: 47.6, elevation: 8.7, fov: 4.72, fit: 0.131, target: [138, 219, -80], ref: 'detail-head.jpg' },
    'detail-head-front': { azimuth: 2.4, elevation: -11.8, fov: 7.31, fit: 0.1, target: [8, 209, 192], ref: 'detail-head-front.jpg' },
    'detail-mask': { azimuth: 2.3, elevation: -3.7, fov: 15.32, fit: 0.231, target: [7, 145, 137], ref: 'detail-mask.jpg' },
    'detail-eye': { azimuth: -1, elevation: -2.8, fov: 3.85, fit: 0.058, target: [37, 137, 129], ref: 'detail-eye.jpg' },
    'detail-circles': { azimuth: -1.9, elevation: -7.4, fov: 6.54, fit: 0.098, target: [45, 179, 138], ref: 'detail-circles.jpg' },
    'detail-foot': { azimuth: 2.2, elevation: 6.3, fov: 13.42, fit: 0.222, target: [6, 48, 86], ref: 'detail-foot.jpg' },
    'detail-opening': { azimuth: 60, elevation: 4, fov: 24, fit: 0.1, target: [72, 82, 42] },
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const q = Math.max(0.25, quality)
    const ppmm = 5.2 * Math.sqrt(q) // 2.1 mm thread pitch: ≈ 11 px per pitch
    const seed = 90075
    const plain = new kit.PatinaMaterial()
    const panels = {}
    const object = new THREE.Group()
    object.name = 'nezu-zun'

    // ---------------------------------------------------------------- body
    const profile = new kit.Profile(BODY, { ridges: RIDGES })
    const jobs = [
      ['foot', LV.foot, footPanel],
      ['circLow', LV.circLow, circLowPanel],
      ['mask', LV.mask, bellyPanel],
      ['circUp', LV.circUp, circUpPanel],
      ['collar', LV.collar, collarPanel],
      ['shoulder', LV.shoulder, shoulderPanel],
    ]
    const registers = {}
    for (let i = 0; i < jobs.length; i++) {
      const [name, [y0, y1], fn] = jobs[i]
      registers[name] = {
        y0, y1, fade: 0.9,
        relief: (k, size) => (panels[name] ??= fn(kit, { width: size.width, height: size.height }, { ppmm, seed: seed + i })),
      }
    }
    await onProgress(0.05, 'body')
    const holes = AZ.dividers.map((azimuth) => ({ shape: 'cross', azimuth, y: LV.holes, arm: 6.4, width: 4.8 }))
    const body = kit.lathe({
      profile, sectors: { count: 3, center: 0 }, registers, holes,
      wall: (s, y) => (y < 90 ? 4 : y < 280 ? 4.5 : 3.6),
      lip: { thickness: 5, length: 8, shape: 'round' },
      floor: { y: 93, thickness: 5, dome: 2 }, foot: { wall: 4 },
      tolerance: { seed: 7, ovality: 0.006, rim: 0.012, lean: 0 },
      density: 0.8, quality: q, material: plain, part: 'body',
    })
    object.add(body)

    // ---------------------------------------------------------------- flanges
    await onProgress(0.6, 'flanges')
    const fl = (azimuths, y0, y1, o) => kit.latheFlanges(body, { azimuths, ranges: [{ range: { y0, y1 } }], gap: 0, seed: seed + y0, material: plain, part: 'flanges', taper: 3, waver: 0.3, bevel: 0.6, ...o })
    const flanges = [
      // belly: six, from the lower circle band to the upper band's foot, ≈ 11 mm proud, T-notched every ≈ 11 mm
      ...fl(AZ.all6, 104, 174, { height: 11, thickness: 9.5, embed: 2, notches: T_NOTCH }),
      // foot: six, over the frieze, ≈ 8 mm proud
      ...fl(AZ.all6, 13, 57, { height: 8, thickness: 8, embed: 2, notches: { ...T_NOTCH, pitch: 9, width: 2.4 } }),
    ]
    // shoulder: three slabs between the heads (an L: top along the slope, outer edge down past the collar, a hook)
    const shape = new THREE.Shape(SHOULDER_FLANGE.map(([r, y]) => new THREE.Vector2(r, y)))
    const slabGeo = new THREE.ExtrudeGeometry(shape, { depth: SHOULDER_FLANGE_T - 1.6, bevelEnabled: true, bevelThickness: 0.8, bevelSize: 0.8, bevelSegments: 2, curveSegments: 4 })
    slabGeo.translate(0, 0, -(SHOULDER_FLANGE_T - 1.6) / 2)
    for (const az of AZ.dividers) {
      const g = slabGeo.clone().applyMatrix4(new THREE.Matrix4().makeRotationY(((az - 90) * Math.PI) / 180))
      g.computeVertexNormals()
      const m = new THREE.Mesh(g, plain)
      m.userData.part = 'flanges'
      flanges.push(m)
    }
    for (const f of flanges) object.add(f)

    // studs: small square knobs on the rolled belly top (two seen, at ±45°; four assumed)
    const studGeo = new THREE.BoxGeometry(6, 6, 4)
    const studs = []
    for (const az of AZ.studs) {
      const a = (az * Math.PI) / 180
      const m = new THREE.Mesh(studGeo, plain)
      m.position.set(Math.sin(a) * 143.6, LV.studs, Math.cos(a) * 143.6)
      m.rotation.y = a
      m.userData.part = 'studs'
      object.add(m)
      studs.push(m)
    }

    // ---------------------------------------------------------------- heads
    await onProgress(0.75, 'heads')
    const voxel = Math.max(0.5, 0.7 / Math.sqrt(q))
    const headGeo = kit.meshSDF(headSDF(), { voxel })
    const headMat = new kit.PatinaMaterial()
    const heads = []
    for (const az of AZ.heads) {
      const g = headGeo.clone().applyMatrix4(new THREE.Matrix4().makeRotationY((az * Math.PI) / 180))
      g.computeBoundingBox(); g.computeBoundingSphere()
      const h = new THREE.Mesh(g, headMat)
      h.userData.part = 'heads'
      object.add(h)
      heads.push(h)
    }

    object.traverse((m) => { if (m.isMesh) { m.castShadow = m.receiveShadow = true } })
    await onProgress(1, 'done')
    return { object, parts: { body, flanges, heads, studs }, panels }
  },
}
