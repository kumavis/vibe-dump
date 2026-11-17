// Met gui 62.217 — food-serving vessel (gui) on a ring foot with two animal-head loop
// handles, 12th c. BCE. Reconstruction from reference/met-gui/dossier.md (measured from the
// Met's photographs DP218261–64, DP218602–04) and profile.json. Units mm, Y up, front
// (+Z, azimuth 0) = the centre line of mask face A (front.jpg); the handles at ±90°.
//
// TWO-fold: the décor of each register is one 180° panel per face, centred on the
// mask's nose ridge, the same panel on both faces (face B, back.jpg, repeats face A);
// the handles cover the joins at ±90°. Panels are laid 1:1 in developed mm (map 'true')
// and every element in them is traced off the photographs developed onto the same
// coordinates (met-gui/decor.js says how).

import * as THREE from 'three'
import PROFILE from '../../reference/met-gui/profile.json'
import { handleSDF, friezeHeadSDF } from './met-gui/sculpture.js'
import { maskPanel, friezePanel, bladePanel, footPanel } from './met-gui/decor.js'

const H = 117

export default {
  id: 'met-gui',
  order: 6,
  title: 'Food Serving Vessel (Gui)',
  titleZh: '簋',
  type: 'gui',
  date: '12th century BCE',
  period: 'Late Shang dynasty, Anyang period (Yinxu II–III by style)',
  findspot: 'Not recorded',
  collection: 'The Metropolitan Museum of Art, New York — Gift of Count and Countess Bernard d’Escayrac, 1962',
  accession: '62.217',
  dimensions: { h: 117, w: 235, d: 159 },
  blurb:
    'A round bowl for serving cooked grain, set on a ring foot and lifted by two cast loop handles, each crowned by a horned animal head looking out over the rim. ' +
    'Its décor lies almost flush: on the belly a mask of broad flat bands drawn by their outlines, with a large convex eye on either side of a low ridge, between a dragon frieze centred on a small sculpted head and a row of rising blades above, and a second frieze around the foot. ' +
    'Form and décor are traced from the Met’s photographs; the interior, the wall thickness and the cast lattice under the base are inferred.',
  defaultPatina: 'met-gui',
  views: {
    // camera on the photographs' stations: near head-on, ≈ 3° above the rim (dossier §b.1)
    front: { azimuth: 0, elevation: 9, fov: 12, fit: 0.82, target: [0, 75, 0], ref: 'front.jpg' },
    back: { azimuth: 180, elevation: 9, fov: 12, fit: 0.82, target: [0, 75, 0], ref: 'back.jpg' },
    side: { azimuth: 90, elevation: 9, fov: 12, fit: 0.8, target: [0, 71, 0], ref: 'side.jpg' },
    'side-b': { azimuth: -90, elevation: 9, fov: 12, fit: 0.8, target: [0, 71, 0], ref: 'side-b.jpg' },
    top: { azimuth: 0, elevation: 89, fov: 12, fit: 0.82, target: [0, 58, 0], ref: 'top.jpg' },
    'three-quarter': { azimuth: -35, elevation: 18, fov: 18, fit: 1.1 },
    'detail-mask': { azimuth: 0, elevation: 9, fov: 4, fit: 0.3, target: [0, 60, 0], ref: 'detail-mask.jpg' },
    'detail-neck': { azimuth: 0, elevation: 9, fov: 4, fit: 0.2, target: [0, 99, 0], ref: 'detail-neck-band.jpg' },
    'detail-foot': { azimuth: 0, elevation: 9, fov: 4, fit: 0.2, target: [0, 27, 0], ref: 'detail-foot-band.jpg' },
    'detail-handle': { azimuth: 0, elevation: 9, fov: 4, fit: 0.24, target: [-100, 80, 0], ref: 'detail-handle.jpg' },
    'detail-handle-end': { azimuth: 90, elevation: 9, fov: 4, fit: 0.2, target: [112, 86, 0], ref: 'detail-handle-end.jpg' },
    // flat faces (KIT.md § Flat faces; reference/met-gui/faces.json): down the photograph's own line of sight
    'face-front': { face: { center: [0, 58.5, 60], normal: [0, 0.0698, 0.9976], up: [0, 0.9976, -0.0698], width: 250, height: 126 }, ref: 'faces/face-front.jpg' },
    'face-mask': { face: { center: [0, 63.5, 78], normal: [0, 0.0698, 0.9976], up: [0, 0.9976, -0.0698], width: 150, height: 52 }, ref: 'faces/face-mask.jpg' },
    'face-neck': { face: { center: [0, 99, 76], normal: [0, 0.0698, 0.9976], up: [0, 0.9976, -0.0698], width: 150, height: 30 }, ref: 'faces/face-neck.jpg' },
    'face-foot': { face: { center: [0, 23, 58], normal: [0, 0.0698, 0.9976], up: [0, 0.9976, -0.0698], width: 124, height: 46 }, ref: 'faces/face-foot.jpg' },
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const q = Math.max(0.25, quality)
    const ppmm = 8 * Math.sqrt(q) // ≈ 0.85 mm leiwen: ≈ 7 px per pitch
    const seed = 62217
    const panels = {}
    const plain = new kit.PatinaMaterial()

    const profile = new kit.Profile(PROFILE.points)
    const R = PROFILE.registers
    const jobs = [
      ['foot', footPanel],
      ['mask', maskPanel],
      ['frieze', friezePanel],
      ['blades', bladePanel],
    ]
    const sizes = {}
    for (let i = 0; i < jobs.length; i++) {
      const [name, fn] = jobs[i]
      await onProgress(0.02 + 0.6 * (i / jobs.length), name)
      const sz = registerSize(profile, R[name][0], R[name][1])
      sizes[name] = sz
      panels[name] = fn(kit, sz, { ppmm, seed: seed + i })
    }

    await onProgress(0.65, 'casting')
    const registers = {}
    for (const [name] of jobs) {
      registers[name] = { y0: R[name][0], y1: Math.min(R[name][1], profile.bounds.yMax - 0.01), relief: () => panels[name], map: 'true', mapWidth: sizes[name].width, fade: 0.8 }
    }
    const body = kit.lathe({
      profile,
      sectors: { count: 2, center: 0 },
      registers,
      wall: (s, y) => (y < 20 ? 3 : y < 40 ? 3.5 : 3),
      lip: { thickness: 3.4, length: 8, shape: 'flat', bulge: 0.5 },
      floor: { y: 37, thickness: 4, dome: 0.6 },
      foot: { wall: 3 },
      tolerance: { seed: 7, ovality: 0.006, rim: 0.004, lean: 0 },
      density: 1.0,
      quality: q,
      material: plain,
    })
    const object = new THREE.Group()
    object.name = 'met-gui'
    object.add(body)

    // ---------------------------------------------------------------- nose ridges (mask centre lines)
    await onProgress(0.72, 'ridges')
    const ridges = kit.latheFlanges(body, {
      azimuths: [0, 180], ranges: [{ range: { y0: R.mask[0] + 0.8, y1: R.mask[1] - 0.4 } }], gap: 0, seed: seed + 9,
      height: 2.2, thickness: 5.0, embed: 1, taper: 22, bevel: 1.2, waver: 0.1, notches: { shape: 'none' }, material: plain, part: 'body',
    })
    for (const r of ridges) body.add(r)
    // foot frieze: the short ridge at each centre line
    const fr = kit.latheFlanges(body, {
      azimuths: [0, 180], ranges: [{ range: { y0: R.foot[0] + 0.6, y1: R.foot[1] - 0.6 } }], gap: 0, seed: seed + 10,
      height: 1.6, thickness: 3.0, embed: 1, taper: 14, bevel: 0.8, waver: 0.1, notches: { shape: 'none' }, material: plain, part: 'body',
    })
    for (const r of fr) body.add(r)

    // ---------------------------------------------------------------- handles
    await onProgress(0.78, 'handles')
    const voxel = Math.max(0.42, 0.55 / Math.sqrt(q))
    const hGeo = kit.meshSDF(handleSDF(), { voxel })
    const hMat = new kit.PatinaMaterial()
    const handles = []
    for (const side of [1, -1]) {
      const g = hGeo.clone()
      if (side < 0) g.applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI))
      g.computeBoundingBox(); g.computeBoundingSphere()
      const m = new THREE.Mesh(g, hMat)
      m.userData.part = 'handles'
      m.castShadow = m.receiveShadow = true
      object.add(m)
      handles.push(m)
    }

    // ---------------------------------------------------------------- frieze heads
    await onProgress(0.9, 'heads')
    const headGeo = kit.meshSDF(friezeHeadSDF({ embed: 2 }), { voxel: Math.max(0.28, 0.4 / Math.sqrt(q)) })
    const heads = []
    for (const az of [0, 180]) {
      const h = new THREE.Mesh(headGeo, hMat)
      h.userData.part = 'heads'
      h.castShadow = h.receiveShadow = true
      kit.mountOnLathe(body, h, { azimuth: az, y: (R.frieze[0] + R.frieze[1]) / 2 + 0.4, follow: 1, pitch: 0, lift: 0 })
      h.updateMatrix()
      h.geometry = headGeo.clone().applyMatrix4(h.matrix)
      h.geometry.computeBoundingBox(); h.geometry.computeBoundingSphere()
      h.position.set(0, 0, 0); h.quaternion.identity(); h.scale.set(1, 1, 1)
      object.add(h)
      heads.push(h)
    }

    await onProgress(1, 'done')
    return { object, parts: { body, handles, heads }, panels }
  },
}

/** one register × 180° sector, laid 1:1 ('true' map): width = the half-circumference at its widest */
function registerSize(P, y0, y1) {
  const s0 = P.sAtY(y0)
  const s1 = P.sAtY(Math.min(y1, P.bounds.yMax - 0.01), { from: 'top' })
  let rMax = 0
  for (let s = s0; s <= s1; s += 0.2) rMax = Math.max(rMax, P.at(s).r)
  const width = Math.PI * rMax
  return { width, height: s1 - s0, s0, s1, rMax, rAt: (yArc) => P.at(s0 + yArc).r }
}
