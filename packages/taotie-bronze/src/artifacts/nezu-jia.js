// Nezu Museum jia 饕餮文斝 (90067) — a tripod wine warmer, Shang dynasty, 13th–12th c. BC, said to come from
// Houjiazhuang, Anyang. Reconstructed from the project owner's two photographs (reference/nezu-jia/photo-21.jpg,
// a near elevation from the handle's left; photo-22.jpg, three-quarter from the handle side) via
// reference/nezu-jia/dossier.md. The size is INFERRED (no dimension on the label): rim Ø 176 mm, 406 mm to the
// post tops. Units mm, Y up, front (+Z, θ 0) = the lower-frieze mask that faces the camera in photo-21.
//
// Form (nezu-jia/form.js): a lathe body — a short bulging drum (the lower body, flat-bottomed) under a 4 mm
// ledge, a waist, and a tall flaring upper wall ending in a thick lip; three long blade legs of triangular
// section with a notched flange on the outer edge and a channel down the back; two posts on the rim, square
// stems under bell-shaped caps with four notched flanges; a strap handle over one leg, an animal head with two
// square plates on its crown at the top outer corner (nezu-jia/sculpture.js). Slab flanges between the drum
// masks, low ladder noses on them, six notched flanges up the upper wall, hooked over the lip.
// Décor (nezu-jia/relief.js + trace.js): three big high-relief masks on the drum, six flat masks in the waist
// band, twelve rising blades, small masks on legs, stems and caps.

import * as THREE from 'three'
import { AZ, PROFILE, REG, RIM_Y, LEG_PANEL, POST, buildLeg, buildPost, DEG } from './nezu-jia/form.js'
import { handleSDF } from './nezu-jia/sculpture.js'
import { friezePanel, bandPanel, bladePanel, legFacePanel, capFlankPanel, stemPanel } from './nezu-jia/relief.js'

export default {
  id: 'nezu-jia',
  order: 9,
  title: 'Jia with Taotie Design',
  titleZh: '饕餮文斝',
  type: 'jia',
  date: '13th–12th century BC',
  period: 'Shang dynasty (Anyang period)',
  findspot: 'Said to have been excavated from Houjiazhuang, Anyang, Henan province',
  collection: 'Nezu Museum, Tokyo',
  accession: '90067 (number on the gallery label; exhibit 5)',
  designation: 'Important Cultural Property (重要文化財)',
  dimensions: { h: 406, w: 262, d: 214, inferred: true, note: 'inferred: no dimension on the label; scale set by an assumed rim Ø of 176 mm, proportions measured on the two photographs (dossier § Scale)' },
  blurb:
    'A tripod for warming wine: a flaring cup with a bulging drum below it, raised on three long blade-like legs, with two tall posts capped by little bells standing on the rim and a strap handle crowned by an animal head. ' +
    'Masks in fat, deep relief run round the drum between slab flanges; above the waist a band of flatter masks and twelve rising blades climb the cup, split by notched flanges, and small masks climb the legs, the posts and their caps. ' +
    'Reconstructed from two of the project owner’s photographs: the size is inferred, and the side away from the camera repeats the visible ones.',
  defaultPatina: 'nezu-jia',
  views: {
    // the two photographs' stations, solved by eye against the renders (dossier § Cameras): a phone ≈ 64° vertical
    // lens, ≈ 0.33 m (photo-21, eye ≈ 290 mm above the floor, below the rim) and ≈ 0.41 m (photo-22, higher)
    front: { azimuth: -4, elevation: 3, fov: 56, fit: 0.93, target: [0, 222, 0], ref: 'front.jpg' },
    'three-quarter': { azimuth: -44, elevation: 9, fov: 50, fit: 0.98, target: [0, 236, 0], ref: 'three-quarter.jpg' },
    'handle-side': { azimuth: -60, elevation: 6, fov: 26, fit: 1.08, target: [0, 216, 0] },
    side: { azimuth: 30, elevation: 6, fov: 26, fit: 1.08, target: [0, 216, 0] },
    back: { azimuth: 120, elevation: 6, fov: 26, fit: 1.08, target: [0, 216, 0] },
    top: { azimuth: -20, elevation: 80, fov: 26, fit: 1.0, target: [0, 216, 0] },
    'detail-post-cap': { azimuth: 40, elevation: 8, fov: 20, fit: 0.2, target: [53, 386, 63] },
    'detail-upper-frieze': { azimuth: 0, elevation: 6, fov: 20, fit: 0.3, target: [0, 276, 60] },
    'detail-mask': { azimuth: 0, elevation: 4, fov: 20, fit: 0.24, target: [0, 203, 58] },
    'detail-handle-head': { azimuth: -62, elevation: 10, fov: 20, fit: 0.2, target: [-102, 270, 59] },
    'face-drum': { face: { center: [0, 203, 40], normal: [-0.0682, 0.2079, 0.9758], up: [0.0145, 0.9781, -0.2074], width: 132, height: 60 }, ref: 'faces/face-drum.jpg' },
    'face-upper': { face: { center: [0, 277, 45], normal: [-0.0698, 0, 0.9976], up: [0, 1, 0], width: 150, height: 88 }, ref: 'faces/face-upper.jpg' },
    'detail-leg': { azimuth: 60, elevation: 4, fov: 22, fit: 0.46, target: [66, 95, 38] },
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const q = Math.max(0.25, quality)
    const ppmm = 7 * Math.sqrt(q) // 0.7 mm leiwen: ≥ 5 px per pitch at q 0.5
    const seed = 90067
    const panels = {}
    const plain = new kit.PatinaMaterial()
    const P = new kit.Profile(PROFILE)
    const size = (y0, y1, deg) => {
      const s0 = P.sAtY(y0), s1 = P.sAtY(y1, { from: 'top' })
      return { width: P.at((s0 + s1) / 2).r * deg * DEG, height: s1 - s0 }
    }

    // ------------------------------------------------------------------ panels
    await onProgress(0.02, 'drum masks')
    panels.frieze = friezePanel(kit, size(REG.frieze[0], REG.frieze[1], 120), { ppmm, seed })
    await onProgress(0.2, 'waist band')
    panels.band = bandPanel(kit, size(REG.band[0], REG.band[1], 60), { ppmm, seed: seed + 1 })
    await onProgress(0.3, 'blades')
    const bs = size(REG.blades[0], REG.blades[1], 30)
    panels.bladeF = bladePanel(kit, bs, { ppmm: ppmm * 0.9, seed: seed + 2, flanged: true })
    panels.bladeP = bladePanel(kit, bs, { ppmm: ppmm * 0.9, seed: seed + 3, flanged: false })
    await onProgress(0.4, 'legs')
    panels.legL = legFacePanel(kit, LEG_PANEL, { ppmm: ppmm * 0.85, seed: seed + 4, side: 'L' })
    panels.legR = legFacePanel(kit, LEG_PANEL, { ppmm: ppmm * 0.85, seed: seed + 4, side: 'R' })
    await onProgress(0.48, 'posts')
    const capP = new kit.Profile(POST.cap)
    const cs0 = capP.sAtY(POST.flank[0]), cs1 = capP.sAtY(POST.flank[1], { from: 'top' })
    panels.capFlank = capFlankPanel(kit, { w: capP.at((cs0 + cs1) / 2).r * Math.PI / 2, h: cs1 - cs0 }, { ppmm: ppmm * 1.1, seed: seed + 5 })
    panels.stem = stemPanel(kit, { w: POST.stem.w, h: POST.stem.top - RIM_Y }, { ppmm: ppmm * 1.1, seed: seed + 6 })

    // ------------------------------------------------------------------ body
    await onProgress(0.55, 'casting')
    const body = kit.lathe({
      profile: P,
      sectors: { count: 6, center: 0 },
      registers: {
        frieze: { y0: REG.frieze[0], y1: REG.frieze[1], sectors: { count: 3, center: 0 }, relief: () => panels.frieze, fade: 1.2 },
        band: { y0: REG.band[0], y1: REG.band[1], sectors: { count: 6, center: 30 }, relief: () => panels.band, fade: 1.0 },
        blades: { y0: REG.blades[0], y1: REG.blades[1], sectors: { count: 12, center: 0 }, relief: (k) => (k % 2 === 0 ? panels.bladeF : panels.bladeP), fade: 0.8 },
      },
      wall: 3,
      lip: { thickness: 4.2, length: 7, shape: 'round', bulge: 0.4 },
      floor: { y: 176, thickness: 4, dome: 0.3 },
      tolerance: { seed: 23, ovality: 0.005, rim: 0.003, lean: 0 },
      density: 0.95,
      quality: q,
      material: plain,
    })
    const object = new THREE.Group()
    object.name = 'nezu-jia'
    object.add(body)

    // ------------------------------------------------------------------ flanges
    await onProgress(0.66, 'flanges')
    const flanges = []
    // slabs between the drum masks (photo-21 right edge: ≈ 12 mm proud, ≈ 9 thick, cut into ≈ 7 blocks)
    for (const f of kit.latheFlanges(body, {
      azimuths: AZ.slabs, ranges: [{ range: { y0: REG.frieze[0] - 1.5, y1: REG.frieze[1] + 1.5 } }], gap: 0, seed: seed + 7,
      height: 11.5, thickness: 8.6, embed: 2, taper: 3, bevel: 0.9, waver: 0.35, notches: { shape: 'square', pitch: 7.4, depth: 0.22, width: 1.8 },
      material: plain, part: 'flanges',
    })) flanges.push(f)
    // the masks' noses: a low broad ridge scored as a ladder
    for (const f of kit.latheFlanges(body, {
      azimuths: AZ.masks, ranges: [{ range: { y0: REG.frieze[0] + 2, y1: REG.frieze[1] - 1 } }], gap: 0, seed: seed + 8,
      height: 2.8, thickness: 9.5, embed: 1.2, taper: 14, bevel: 0.8, waver: 0.2, notches: { shape: 'score', pitch: 2.4, depth: 0.32, width: 1.0 },
      material: plain, part: 'flanges',
    })) flanges.push(f)
    // upper wall: waist → over the lip, hooked out at the top (photo-21 right silhouette)
    for (const az of AZ.upper) {
      const ranges = az === AZ.handle
        ? [{ range: { y0: REG.band[0] - 0.5, y1: 273.7 } }, { range: { y0: 291, y1: 319.9 }, ends: { start: 'square', end: { type: 'hook', length: 3, height: 2.5 } } }]
        : [{ range: { y0: REG.band[0] - 0.5, y1: 319.9 }, ends: { start: 'square', end: { type: 'hook', length: 3, height: 2.5 } } }]
      for (const f of kit.latheFlanges(body, {
        azimuths: [az], ranges, gap: 0, seed: seed + 9 + az,
        height: (f) => 4.8 + 2.4 * f, thickness: 6.0, embed: 1.4, taper: 4, bevel: 0.6, waver: 0.4,
        notches: { shape: 'T', pitch: 6.8, depth: 0.42, width: 2.0 }, material: plain, part: 'flanges',
      })) flanges.push(f)
    }
    for (const f of flanges) object.add(f)

    // ------------------------------------------------------------------ legs
    await onProgress(0.74, 'legs')
    const legMatL = new kit.PatinaMaterial({ relief: panels.legL })
    const legMatR = new kit.PatinaMaterial({ relief: panels.legR })
    const legs = AZ.legs.map((az, i) => {
      const g = buildLeg(kit, { az, q, seed: seed + 20 + i, material: plain, faces: { L: { relief: panels.legL, material: legMatL }, R: { relief: panels.legR, material: legMatR } } })
      object.add(g)
      return g
    })

    // ------------------------------------------------------------------ posts
    await onProgress(0.82, 'posts')
    const capMat = new kit.PatinaMaterial({ relief: panels.capFlank })
    const stemMat = new kit.PatinaMaterial({ relief: panels.stem })
    const posts = AZ.posts.map((az, i) => {
      const g = buildPost(kit, { az, q, seed: seed + 30 + i, material: plain, relief: { flank: panels.capFlank, stem: panels.stem }, decorMaterials: { flank: capMat, stem: stemMat } })
      object.add(g)
      return g
    })

    // ------------------------------------------------------------------ handle
    await onProgress(0.9, 'handle')
    const hGeo = kit.meshSDF(handleSDF(), { voxel: Math.max(0.6, 0.72 / Math.sqrt(q)) })
    hGeo.applyMatrix4(new THREE.Matrix4().makeRotationY((AZ.handle - 90) * DEG))
    hGeo.computeBoundingBox(); hGeo.computeBoundingSphere()
    const handle = new THREE.Mesh(hGeo, new kit.PatinaMaterial())
    handle.userData.part = 'handles'
    handle.castShadow = handle.receiveShadow = true
    object.add(handle)

    await onProgress(1, 'done')
    return { object, parts: { body, legs, posts, handles: [handle], flanges }, panels }
  },
}
