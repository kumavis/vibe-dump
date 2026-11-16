// Nezu Museum you 饕餮文卣 (90086) — Shang dynasty, 12th–11th c. BC. Reconstructed from the project owner's
// photographs (reference/nezu-you/photo-31.jpg head-on at a broad face, photo-32.jpg three-quarter from the
// front right; photo-47 is a byte-identical copy of photo-32) via reference/nezu-you/dossier.md. The size is
// INFERRED (no dimension on the label): scale from the leiwen pitch. Units mm, Y up, front (+Z) = the broad face
// with the bail's pivot head (photo-31); the plan is an oval, long axis X; the lid's horns point along ±X.
//
// Form (nezu-you/form.js): a ring foot with a flared plain base band and a frieze, a pear-shaped belly that
// overhangs the foot, a straight neck, a lid with a decorated skirt, a flaring eave, a low conical top with
// notched ridge flanges along the long axis, a ribbed bud knob and an upturned horn at each end. The bail is a
// flat strap pivoting on two animal heads at the centres of the broad faces' necks (nezu-you/shell.js).
// Décor (nezu-you/decor.js) is TRACED from the flattened faces of photo-31 (reference/nezu-you/faces/).

import * as THREE from 'three'
import { OVAL, RK, LV, BODY, LID, BAIL, bailHalfLength, knobSDF, hornSDF, pivotHeadSDF } from './nezu-you/form.js'
import { ovalShell, bailStrap } from './nezu-you/shell.js'
import { bellyPanel, neckPanel, footPanel, skirtPanel, lidPanel, strapPanel } from './nezu-you/decor.js'

export default {
  id: 'nezu-you',
  order: 9,
  title: 'You with Taotie Design',
  titleZh: '饕餮文卣',
  type: 'you',
  date: 'Shang dynasty, 12th–11th centuries BC',
  period: 'Late Shang (Anyang period)',
  findspot: 'Not stated on the label',
  collection: 'Nezu Museum, Tokyo',
  accession: '90086 (number on the gallery label; exhibit 4)',
  designation: 'Important Art Object (重要美術品)',
  dimensions: { h: 390, w: 265, d: 263, inferred: true, note: 'inferred from the leiwen pitch on the photographs (±15 %): H with the bail upright; the label gives no dimensions' },
  blurb:
    'A lidded wine bucket of oval section, carried by a flat strap handle that pivots on two horned animal heads and arches over the lid. ' +
    'Fat, rounded masks in high relief fill the pear-shaped belly — great G-shaped horns, round boss eyes, hooked bodies — over a fine thunder-pattern ground, between dragon friezes on the neck, the lid and the foot; notched flanges run down the ends and the lid carries a ribbed bud knob and an upturned horn at each end. ' +
    'Reconstructed from two of the project owner’s photographs: the size is inferred, and the back repeats the front.',
  defaultPatina: 'nezu-you',
  views: {
    // photo-31: the phone ≈ 1 m away at about the lid's height (fitted to the outline, dossier §b.1)
    front: { azimuth: 0, elevation: 5.5, fov: 24, fit: 0.86, target: [0, 195, 0], ref: 'front.jpg' },
    // photo-32: from the front right, higher (≈ 18° at the foot)
    'three-quarter': { azimuth: 33, elevation: 16, fov: 24, fit: 0.86, target: [0, 192, 0], ref: 'three-quarter.jpg' },
    end: { azimuth: 90, elevation: 6, fov: 24, fit: 0.9, target: [0, 195, 0] },
    back: { azimuth: 180, elevation: 6, fov: 24, fit: 0.9, target: [0, 195, 0] },
    top: { azimuth: 0, elevation: 88, fov: 24, fit: 0.9, target: [0, 200, 0] },
    'detail-mask': { azimuth: 0, elevation: 9, fov: 24, fit: 0.27, target: [58, 116, 105], ref: 'detail-mask.jpg' },
    'detail-eye': { azimuth: 0, elevation: 10, fov: 24, fit: 0.12, target: [46, 99, 118], ref: 'detail-eye.jpg' },
    'detail-head': { azimuth: 0, elevation: 6, fov: 24, fit: 0.17, target: [0, 192, 100], ref: 'detail-head.jpg' },
    'detail-strap': { azimuth: 0, elevation: 2, fov: 24, fit: 0.36, target: [0, 285, 110], ref: 'detail-strap.jpg' },
    'detail-lid': { azimuth: 40, elevation: 18, fov: 24, fit: 0.36, target: [0, 290, 0], ref: 'detail-lid.jpg' },
    'detail-foot': { azimuth: 0, elevation: 14, fov: 24, fit: 0.3, target: [0, 34, 80], ref: 'detail-foot.jpg' },
    // flat faces (KIT.md § Flat faces; reference/nezu-you/faces.json): down photo-31's own line of sight
    'face-belly': { face: { center: [0, 110, 108], normal: [0, 0.0958, 0.9954], up: [0, 0.9954, -0.0958], width: 250, height: 118 }, ref: 'faces/face-belly.jpg' },
    'face-neck': { face: { center: [0, 188, 88], normal: [0, 0.0958, 0.9954], up: [0, 0.9954, -0.0958], width: 200, height: 42 }, ref: 'faces/face-neck.jpg' },
    'face-skirt': { face: { center: [0, 229.5, 91], normal: [0, 0.0958, 0.9954], up: [0, 0.9954, -0.0958], width: 200, height: 34 }, ref: 'faces/face-skirt.jpg' },
    'face-foot': { face: { center: [0, 32, 80], normal: [0, 0.0958, 0.9954], up: [0, 0.9954, -0.0958], width: 180, height: 36 }, ref: 'faces/face-foot.jpg' },
    'face-lid': { face: { center: [0, 284, 74], normal: [0, 0.0958, 0.9954], up: [0, 0.9954, -0.0958], width: 200, height: 56 }, ref: 'faces/face-lid.jpg' },
    'face-strap': { face: { center: [0, 262, 113.764], normal: [0, 0.0958, 0.9954], up: [0, 0.9954, -0.0958], width: 40, height: 120 }, ref: 'faces/face-strap.jpg' },
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const q = Math.max(0.25, quality)
    const ppmm = 4.4 * Math.sqrt(q) // 1.2 mm leiwen: ≈ 5.3 px per pitch
    const seed = 90086
    const plain = new kit.PatinaMaterial()
    const panels = {}
    const object = new THREE.Group()
    object.name = 'nezu-you'

    // ---------------------------------------------------------------- body
    const profile = new kit.Profile(BODY)
    const regs = { foot: LV.footFrieze, belly: LV.belly, neck: LV.neck }
    const jobs = [['foot', footPanel], ['belly', bellyPanel], ['neck', neckPanel]]
    const registers = {}
    for (let i = 0; i < jobs.length; i++) {
      const [name, fn] = jobs[i]
      registers[name] = {
        y0: regs[name][0], y1: regs[name][1], map: 'true', fade: 1.0,
        relief: (k, size) => {
          if (!panels[name]) panels[name] = fn(kit, { width: Math.max(size.widthBottom, size.widthTop, size.width), height: size.height }, { ppmm, seed: seed + i })
          return panels[name]
        },
      }
    }
    await onProgress(0.05, 'body')
    const body = kit.lathe({
      profile, oval: OVAL, sectors: { count: 2, center: 0 }, registers,
      wall: 4, lip: { thickness: 4.5, length: 6, shape: 'flat' }, floor: { y: 54, thickness: 5, dome: 1.5 }, foot: { wall: 4 },
      density: 0.75, quality: q, material: plain, part: 'body',
    })
    object.add(body)

    // ---------------------------------------------------------------- flanges on the body
    await onProgress(0.5, 'flanges')
    const fl = (azimuths, y0, y1, o) => kit.latheFlanges(body, { azimuths, ranges: [{ range: { y0, y1 } }], gap: 0, seed: seed + y0, material: plain, part: 'flanges', taper: 4, waver: 0.3, ...o })
    const flanges = [
      ...fl([90, 270], LV.belly[0] - 1, LV.belly[1] + 1, { height: 8, thickness: 7, embed: 2, notches: { shape: 'square', pitch: 17, depth: 0.6, width: 3.4 } }),
      ...fl([0, 180], LV.belly[0] + 1, LV.belly[1] - 14, { height: 7, thickness: 7, embed: 2, notches: { shape: 'square', pitch: 11, depth: 0.5, width: 2.4 } }),
      ...fl([90, 270], LV.neck[0], LV.neck[1] + 2, { height: 7.5, thickness: 7, embed: 2, notches: { shape: 'square', pitch: 12.5, depth: 0.55, width: 3 } }),
      ...fl([0, 90, 180, 270], LV.footFrieze[0], LV.footFrieze[1], { height: 5, thickness: 6, embed: 2, notches: { shape: 'square', pitch: 9.5, depth: 0.5, width: 2.2 } }),
    ]
    for (const f of flanges) object.add(f)

    // ---------------------------------------------------------------- lid
    await onProgress(0.6, 'lid')
    const lidP = new kit.Profile(LID)
    const sA = (y) => lidP.sAtY(y)
    const lid = ovalShell(kit, {
      profile: lidP, oval: OVAL, quality: q, material: plain, thickness: 3.5,
      bands: [
        { name: 'skirt-low', s0: 0, s1: sA(LV.skirt[0]), closeBottom: true },
        { name: 'skirt', s0: sA(LV.skirt[0]), s1: sA(LV.skirt[1]), relief: (k, size) => (panels.skirt ||= skirtPanel(kit, size, { ppmm, seed: seed + 5 })) },
        { name: 'eave', s0: sA(LV.skirt[1]), s1: sA(LV.lidTop[0]) + 0.4 },
        { name: 'top', s0: sA(LV.lidTop[0]) + 0.4, s1: sA(LV.lidTop[1]), relief: (k, size) => (panels.lid ||= lidPanel(kit, size, { ppmm, seed: seed + 6 })) },
        { name: 'crown', s0: sA(LV.lidTop[1]), s1: lidP.length },
      ],
    })
    object.add(lid)
    // ridge flanges along ±X, from the eave to the knob
    for (const sx of [1, -1]) {
      const s0 = lidP.sAtY(265.5), s1 = lidP.sAtY(309)
      const path = {
        isPath: true, planar: true, kind: 'lid-ridge', length: s1 - s0,
        frame: (sg) => {
          const q = lidP.at(Math.min(Math.max(s0 + sg, 0), lidP.length))
          const pp = new THREE.Vector3(sx * q.r, q.y, 0), n = new THREE.Vector3(sx * q.nr, q.ny, 0), dd = new THREE.Vector3(sx * q.tr, q.ty, 0)
          return { p: pp, n, d: dd, b: new THREE.Vector3().crossVectors(dd, n) }
        },
      }
      const f = kit.flange({ path, height: (t) => 12.5 - 3 * t, thickness: 6.5, embed: 2.5, taper: 4, waver: 0.3, seed: seed + 40 + sx, notches: { shape: 'square', pitch: 13, depth: 0.45, width: 3.2 }, material: plain, part: 'flanges' })
      object.add(f)
    }

    // skirt flanges at the ends, under the horns
    for (const sx of [1, -1]) {
      const f = kit.flange({ from: new THREE.Vector3(sx * 92.8 * RK, LV.skirt[0], 0), to: new THREE.Vector3(sx * 93.2 * RK, LV.skirt[1], 0), out: new THREE.Vector3(sx, 0, 0),
        height: 8, thickness: 7, embed: 2, taper: 4, waver: 0.3, seed: seed + 50 + sx, notches: { shape: 'square', pitch: 13.5, depth: 0.55, width: 3 }, material: plain, part: 'flanges' })
      object.add(f)
    }

    // ---------------------------------------------------------------- sculpture: knob, horns, pivot heads
    await onProgress(0.7, 'knob, horns, heads')
    const voxel = Math.max(0.45, 0.6 / Math.sqrt(q))
    const sculpt = new kit.PatinaMaterial()
    const knobGeo = kit.meshSDF(knobSDF(), { voxel: voxel * 0.9 })
    knobGeo.translate(0, LV.apex - 2.5, 0)
    const knob = new THREE.Mesh(knobGeo, sculpt)
    knob.userData.part = 'knob'
    object.add(knob)
    const hornGeo = kit.meshSDF(hornSDF(), { voxel })
    const horns = []
    for (const sx of [1, -1]) {
      const g = hornGeo.clone()
      if (sx < 0) g.applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI))
      g.computeBoundingBox(); g.computeBoundingSphere()
      const m = new THREE.Mesh(g, sculpt)
      m.userData.part = 'horns'
      object.add(m)
      horns.push(m)
    }
    const headGeo = kit.meshSDF(pivotHeadSDF(), { voxel: voxel * 0.8 })
    const heads = []
    for (const az of [0, 180]) {
      const h = new THREE.Mesh(headGeo, sculpt)
      kit.mountOnLathe(body, h, { azimuth: az, y: 190, follow: 0, pitch: 0, lift: 0 })
      h.updateMatrix()
      h.geometry = headGeo.clone().applyMatrix4(h.matrix)
      h.geometry.computeBoundingBox(); h.geometry.computeBoundingSphere()
      h.position.set(0, 0, 0); h.quaternion.identity(); h.scale.set(1, 1, 1)
      h.userData.part = 'heads'
      object.add(h)
      heads.push(h)
    }

    // ---------------------------------------------------------------- bail
    await onProgress(0.8, 'bail')
    panels.strap = strapPanel(kit, { width: BAIL.width, height: bailHalfLength() }, { ppmm: ppmm * 1.1, seed: seed + 7 })
    const bail = bailStrap(kit, { relief: panels.strap, quality: q, material: plain })
    object.add(bail)

    object.traverse((m) => { if (m.isMesh) { m.castShadow = m.receiveShadow = true } })
    await onProgress(1, 'done')
    return { object, parts: { body, lid, knob, horns, heads, bail, flanges }, panels }
  },
}
