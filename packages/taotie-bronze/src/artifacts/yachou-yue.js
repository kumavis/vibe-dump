// Yachou yue 亚醜钺 — the ceremonial axe with an openwork grinning face, Subutun M1, Qingzhou
// (Shandong Museum). Reconstruction from reference/yachou-yue/dossier.md, measured on Gary Todd's
// CC0 photographs. Units mm, Y up, front (+Z) = the face as the museum shows it, blade down.
//
// Not a vessel: a cast plate ≈ 8.5 mm thick (inferred), built with kit.plate() — a true silhouette,
// true through-openings (eyes, ears, brow crescents, the mouth between the teeth, the two lashing
// slots, fourteen T-slots in the side edges), the blade thinning to a bevelled edge. The face
// (yachou-yue/relief.js) is one ReliefMap read by both faces: the museum label says the
// inscription stands either side of the mouth on BOTH faces, and the mask is openwork, so the
// back repeats the front. Both faces read the map at the SAME plate x, because the traced openings
// are not symmetric and every ring must stay round its own hole; the price is that the two tiny
// 亚醜 graphs read mirror-reversed from behind (one mesh carries one material, so one map).

import * as THREE from 'three'
import { outline, holes, makeThickness, THICK, H as PLATE_H } from './yachou-yue/form.js'
import { RECT, drawFace } from './yachou-yue/relief.js'

const LIFT = 12 // the blade's lowest point above the plinth (it rests in a clear block)
const Z = THICK.body / 2 // the front face plane

const face = (cy, w, h) => ({ center: [0, LIFT + cy, Z], normal: [0, 0, 1], up: [0, 1, 0], width: w, height: h })

export default {
  id: 'yachou-yue',
  order: 8,
  title: 'Yachou Axe (Yue) with Grinning Face',
  titleZh: '亚醜钺',
  type: 'yue (ceremonial axe)',
  date: 'Late Shang (museum label: Shang dynasty, 1600–1046 BC)',
  period: 'Late Shang dynasty',
  findspot: 'Tomb M1, Subutun, Qingzhou (formerly Yidu), Shandong — excavated 1965',
  collection: 'Shandong Museum, Jinan',
  accession: '',
  dimensions: { h: 327, w: 345, d: 9 },
  blurb:
    'A broad bronze axe blade cast as a single plate and pierced right through to make a face: hooked brows over crescent slits, ring eyes, C-shaped ears, a crested nose and a wide grin whose teeth stand between the cuts. ' +
    'Beside the mouth, on both faces, is the clan sign 亚醜 (Ya Chou); the museum calls an axe this large a symbol of power. ' +
    'Outline, openings and face are traced from open-licence photographs; the size, the thickness and the back are inferred.',
  defaultPatina: 'yachou-yue',
  views: {
    front: { azimuth: 0, elevation: 3, fov: 14, fit: 0.86, target: [0, LIFT + 163, 0], ref: 'front.jpg' },
    'three-quarter': { azimuth: -8, elevation: 1, fov: 16, fit: 0.86, target: [0, LIFT + 163, 0], ref: 'three-quarter.jpg' },
    oblique: { azimuth: -32, elevation: 10, fov: 16, fit: 0.95, target: [0, LIFT + 160, 0] },
    'detail-mount': { azimuth: -6, elevation: -16, fov: 10, fit: 0.24, target: [-50, LIFT + 255, Z], ref: 'detail-mount.jpg' },
    back: { azimuth: 180, elevation: 3, fov: 14, fit: 0.72, target: [0, LIFT + 165, 0] },
    edge: { azimuth: 90, elevation: 4, fov: 14, fit: 0.7, target: [0, LIFT + 165, 0] },
    'edge-blade': { azimuth: 90, elevation: 2, fov: 10, fit: 0.2, target: [165, LIFT + 50, 0] },
    'detail-face': { azimuth: 0, elevation: 2, fov: 10, fit: 0.33, target: [0, LIFT + 175, Z], ref: 'detail-face.jpg' },
    'detail-mouth': { azimuth: 0, elevation: 2, fov: 10, fit: 0.19, target: [0, LIFT + 120, Z], ref: 'detail-mouth.jpg' },
    'detail-eye-ear': { azimuth: 0, elevation: 2, fov: 10, fit: 0.16, target: [74, LIFT + 194, Z], ref: 'detail-eye-ear.jpg' },
    'detail-inscription': { azimuth: 0, elevation: 2, fov: 10, fit: 0.07, target: [-88, LIFT + 135, Z], ref: 'detail-inscription.jpg' },
    'detail-slots': { azimuth: 0, elevation: 2, fov: 10, fit: 0.2, target: [-96, LIFT + 172, Z], ref: 'detail-slots.jpg' },
    'detail-shoulder': { azimuth: -20, elevation: 10, fov: 10, fit: 0.16, target: [-80, LIFT + 262, Z] },
    'detail-blade': { azimuth: -35, elevation: 12, fov: 10, fit: 0.3, target: [-90, LIFT + 15, 0] },
    // flat faces (KIT.md § Flat faces; reference/yachou-yue/faces.json)
    'face-front': { face: face(163.5, 360, 336), ref: 'faces/face-front.jpg' },
    'face-mask': { face: face(170, 250, 156), ref: 'faces/face-mask.jpg' },
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const q = Math.max(0.25, quality)
    await onProgress(0.05, 'face')
    const panel = new kit.ReliefPanel({ width: RECT.w, height: RECT.h, ppmm: 6 * Math.sqrt(q), seed: 1965 })
    drawFace(kit, panel)
    await onProgress(0.45, 'baking')
    const relief = panel.bake()
    await onProgress(0.6, 'casting')

    const T = makeThickness()
    const material = new kit.PatinaMaterial({ relief })
    const plate = kit.plate({
      outline: outline(),
      holes: holes(),
      thickness: T,
      front: { relief, rect: RECT },
      back: { relief: 'front', mirror: false },
      spacing: 14,
      reliefSpacing: q >= 1.5 ? 1.5 : q >= 1 ? 2.3 : 3.2,
      refine: (x, y) => (T.edgeDistance(x, y) < THICK.bevel + 3 ? (q >= 1 ? 3.5 : 5) : 99),
      material,
      part: 'body',
    })
    plate.position.y = LIFT
    plate.name = 'yachou-yue plate'

    await onProgress(0.85, 'stand')
    const stand = makeStand(kit)

    const object = new THREE.Group()
    object.name = 'yachou-yue'
    object.add(plate)
    object.add(stand)
    object.userData.plate = { triangles: plate.userData.plate.triangles, height: PLATE_H }
    await onProgress(1, 'done')
    return { object, parts: { body: plate, stand }, panels: { face: relief } }
  },
}

/** the museum mount as Gary Todd's photographs show it: a clear bar lying across the front of the plate just above
 *  the shoulders (detail-mount.jpg), carried by two slim uprights outside the shoulders, and a low clear block the
 *  blade rests in. Kept thin and pale: it must not hide the blade. How the bar is held at its ends is not visible (I). */
function makeStand() {
  const g = new THREE.Group()
  g.userData.part = 'stand'
  const clear = new THREE.MeshStandardMaterial({ color: 0xdfe6e6, roughness: 0.08, metalness: 0, transparent: true, opacity: 0.22, depthWrite: false })
  const metal = new THREE.MeshStandardMaterial({ color: 0x9aa0a0, roughness: 0.35, metalness: 0.8 })
  const rodY = LIFT + 275 + 4.6
  const rodZ = Z + 4.6
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, 300, 24), clear)
  rod.rotation.z = Math.PI / 2
  rod.position.set(0, rodY, rodZ)
  g.add(rod)
  // uprights behind the plate, each with a short arm forward (outside the shoulders) to the bar's end
  const backZ = -14
  for (const s of [1, -1]) {
    const up = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, rodY, 16), metal)
    up.position.set(s * 146, rodY / 2, backZ)
    g.add(up)
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, rodZ - backZ, 12), metal)
    arm.rotation.x = Math.PI / 2
    arm.position.set(s * 146, rodY, (rodZ + backZ) / 2)
    g.add(arm)
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 2, 24), metal)
    foot.position.set(s * 146, 1, backZ)
    g.add(foot)
  }
  // the clear block under the blade (in front of and behind the edge: a cradle with a slot)
  const blockGeo = new THREE.BoxGeometry(170, LIFT + 6, 14)
  for (const s of [1, -1]) {
    const b = new THREE.Mesh(blockGeo, clear)
    b.position.set(0, (LIFT + 6) / 2, s * (THICK.blade / 2 + 7.6))
    g.add(b)
  }
  const base = new THREE.Mesh(new THREE.BoxGeometry(170, LIFT - 1.2, THICK.blade + 2), clear)
  base.position.set(0, (LIFT - 1.2) / 2, 0)
  g.add(base)
  g.traverse((o) => { if (o.isMesh) { o.castShadow = o.material === metal; o.receiveShadow = true; o.renderOrder = o.material === clear ? 2 : 0 } })
  return g
}
