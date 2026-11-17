// Nezu Museum square hu with phoenix design 鳳文方壺 (90097-98, one of a pair) — Western Zhou dynasty, 9th century
// BC. Reconstructed from the project owner's two photographs (reference/nezu-fanghu/photo-08.jpg, the broad face
// head-on; photo-09.jpg, three-quarter from the front right) via reference/nezu-fanghu/dossier.md. H = 500 mm is
// INFERRED (no dimension on the label). Units mm, Y up, front (+Z) = the broad face of photo-08; the animal-head
// handles with their rings are on the narrow ±X sides.
//
// Form (nezu-fanghu/form.js): a pear-shaped body of rounded-RECTANGULAR section (depth 0.55 × width, measured on
// photo-09) — a slightly waisted neck, a belly swelling to its widest low down, a concave foot band on a flat foot
// plate; a domed lid band with a lip, crowned by an open flaring collar. Each side of the body is ONE loft carrying
// ONE 1:1 relief panel from corner diagonal to corner diagonal. Décor (nezu-fanghu/decor.js): traced off photo-08
// developed onto the model's own surface, in the Western Zhou "cut ribbon" language (kit.cutRibbons). Sculpture
// (sculpture.js): handles, true hanging rings, pyramidal strap studs.

import * as THREE from 'three'
import { H, LV, RHO, PLATE, CROWN, bodyW, bodyR, lidW, lidR, halfQ, arcTable, loftSide, ringLoft, capMesh } from './nezu-fanghu/form.js'
import { bodyPanel, lidPanel } from './nezu-fanghu/decor.js'
import { handleSDF, ringMesh, studGeometry } from './nezu-fanghu/sculpture.js'

export default {
  id: 'nezu-fanghu',
  order: 14,
  title: 'Square Hu with Phoenix Design',
  titleZh: '鳳文方壺',
  type: 'fanghu',
  date: '9th century BC',
  period: 'Western Zhou dynasty',
  findspot: 'Not stated on the label',
  collection: 'Nezu Museum, Tokyo',
  accession: '90097-98 (number on the gallery label, exhibit 16; the double number marks a pair — the twin stands beside it, photo-09)',
  designation: '—',
  dimensions: { h: 500, w: 254, d: 140, inferred: true, note: 'INFERRED: H assumed 500 mm (the label gives none; it is then consistent with a ≈ 0.9 mm leiwen pitch and a 75 mm ring); proportions back-projected from photo-08 through an assumed camera, the plan depth (0.55 × width) from photo-09; w, d = body without handles' },
  blurb:
    'A tall wine jar of rounded-rectangular section, its pear-shaped belly divided by broad flat straps that cross at pyramidal studs, each of the eight fields a large crested bird drawn in fat ribbons cut into the bronze. ' +
    'A frieze of birds and a band of rising triangles run round the neck, animal-head handles on the narrow sides hold loose rings, and the domed lid carries more birds under an open flaring crown. ' +
    'Reconstructed from two of the project owner’s photographs; the height is inferred and the sides and back repeat the front.',
  defaultPatina: 'nezu-fanghu',
  views: {
    // photo-08: assumed camera az 4.4°, el 6°, 965 mm from (0, 250, 0), vfov ≈ 38° (.work/r8-fanghu/solve/fit08.py)
    front: { azimuth: 4.4, elevation: 6, fov: 38, fit: 1.0, target: [0, 250, 0], ref: 'front.jpg' },
    // photo-09: az ≈ 38°, el ≈ 7.5°, ≈ 1.25 m (fit09.py; the twin at the left edge cropped out of the ref)
    // r8 fix: az 46 showed far more of the narrow side than photo-09 does; 36° with the closer, wider lens of the photo
    'three-quarter': { azimuth: 36, elevation: 9, fov: 46, fit: 1.0, target: [0, 250, 0], ref: 'three-quarter.jpg' },
    side: { azimuth: 90, elevation: 6, fov: 26, fit: 1.08 },
    back: { azimuth: 180, elevation: 6, fov: 26, fit: 1.08 },
    top: { azimuth: 12, elevation: 70, fov: 28, fit: 1.05 },
    // details: same camera direction as photo-08; each ref is the 1:1 crop of photo-08 it frames (R ≈ 283 mm)
    'detail-crown': { azimuth: 4.4, elevation: 6, fov: 20, fit: 0.2, target: [0, 465, 45], ref: 'detail-crown.jpg' },
    'detail-handle': { azimuth: 4.4, elevation: 6, fov: 20, fit: 0.2, target: [-92, 320, 0], ref: 'detail-handle.jpg' },
    'detail-stud': { azimuth: 4.4, elevation: 6, fov: 20, fit: 0.2, target: [0, 182, 75], ref: 'detail-stud.jpg' },
    'detail-phoenix': { azimuth: 4.4, elevation: 6, fov: 20, fit: 0.2, target: [65, 118, 70], ref: 'detail-phoenix.jpg' },
    'detail-upper': { azimuth: 4.4, elevation: 6, fov: 20, fit: 0.18, target: [-52, 245, 55], ref: 'detail-upper.jpg' },
    'detail-neck': { azimuth: 4.4, elevation: 6, fov: 20, fit: 0.22, target: [0, 360, 42], ref: 'detail-neck.jpg' },
    'detail-foot': { azimuth: 4.4, elevation: 6, fov: 20, fit: 0.2, target: [0, 42, 62], ref: 'detail-foot.jpg' },
    // flat faces (KIT.md § Flat faces): head-on on each zone's chord plane; ref = photo-08 flattened (faces.json)
    'face-lower': { face: { center: [0, 118, 63.45], normal: [0, -0.0918, 0.9958], up: [0, 0.9958, 0.0918], width: 236, height: 100.4 }, ref: 'faces/face-lower.jpg' },
    'face-upper': { face: { center: [0, 244, 55.17], normal: [0, 0.1958, 0.9806], up: [0, 0.9806, -0.1958], width: 184, height: 97.9 }, ref: 'faces/face-upper.jpg' },
    'face-strap': { face: { center: [0, 181, 65.51], normal: [0, 0.1206, 0.9927], up: [0, 0.9927, -0.1206], width: 120, height: 62.5 }, ref: 'faces/face-strap.jpg' },
    'face-neck': { face: { center: [0, 363, 43.81], normal: [0, -0.0023, 1], up: [0, 1, 0.0023], width: 152, height: 114 }, ref: 'faces/face-neck.jpg' },
    'face-foot': { face: { center: [0, 40.5, 58.99], normal: [0, 0.0051, 1], up: [0, 1, -0.0051], width: 212, height: 55 }, ref: 'faces/face-foot.jpg' },
    'face-lid': { face: { center: [0, 444.5, 35.12], normal: [0, 0.4015, 0.9159], up: [0, 0.9159, -0.4015], width: 144, height: 42.6 }, ref: 'faces/face-lid.jpg' },
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const q = Math.max(0.25, quality)
    const seed = 90097
    const plain = new kit.PatinaMaterial()
    const object = new THREE.Group()
    object.name = 'nezu-fanghu'
    const panels = {}
    const t0 = performance.now(), lap = (l) => console.info(`fanghu ${l} ${Math.round(performance.now() - t0)} ms`)
    const group = (part) => { const g = new THREE.Group(); g.userData.part = part; object.add(g); return g }
    const mat = (relief) => new kit.PatinaMaterial({ relief })

    // ---------------------------------------------------------------- relief panels
    const y0 = LV.plateTop, y1 = LV.neck
    const Rb = (y) => Math.min(bodyR(y), RHO * bodyW(y) - 0.5)
    const Qf = halfQ(0, bodyW, Rb), Qs = halfQ(1, bodyW, Rb)
    const arcF = arcTable(y0, y1, bodyW, 0), arcS = arcTable(y0, y1, bodyW, 1)
    // ≤ 2040 px on the long side at q 1 (the phone cap is 2048)
    const ppmm = Math.min(4.8 * Math.sqrt(q), 2040 / arcF(y1))
    await onProgress(0.03, 'broad faces · phoenix fields (traced)')
    const pf = bodyPanel(kit, { ppmm, seed, Qh: Qf, Qf, arc: arcF, y0, y1 })
    panels.bodyFront = pf.relief
    lap('front panel')
    await onProgress(0.35, 'narrow faces')
    const ps = bodyPanel(kit, { ppmm, seed: seed + 10, Qh: Qs, Qf, arc: arcS, y0, y1, side: true })
    panels.bodySide = ps.relief
    lap('side panel')
    await onProgress(0.6, 'lid')
    const Rl = (y) => Math.min(lidR(y), RHO * lidW(y) - 0.5)
    const QlF = halfQ(0, lidW, Rl), QlS = halfQ(1, lidW, Rl)
    const arcLF = arcTable(LV.lip, LV.lid, lidW, 0, 0.25), arcLS = arcTable(LV.lip, LV.lid, lidW, 1, 0.25)
    const lf = lidPanel(kit, { ppmm: ppmm * 1.1, seed: seed + 20, Qh: QlF, Qf: QlF, arc: arcLF, y0: LV.lip, y1: LV.lid })
    const ls = lidPanel(kit, { ppmm: ppmm * 1.1, seed: seed + 21, Qh: QlS, Qf: QlF, arc: arcLS, y0: LV.lip, y1: LV.lid })
    panels.lidFront = lf.relief
    panels.lidSide = ls.relief
    lap('lid panels')

    // ---------------------------------------------------------------- casting
    await onProgress(0.72, 'casting')
    const dens = 0.62 * Math.sqrt(q)
    const bodyG = group('body')
    const matF = mat(pf.relief), matS = mat(ps.relief)
    for (let k = 0; k < 4; k++) {
      const p = k % 2 ? ps : pf
      bodyG.add(loftSide(kit, { k, y0, y1, W: bodyW, R: Rb, relief: p.relief, arc: k % 2 ? arcS : arcF, panelW: p.panelW, material: k % 2 ? matS : matF, density: dens, fade: 1.0, maxVerts: 240000 }))
    }
    const ring = (y, a, r, b = RHO * a) => ({ y, a, b, r })
    // the foot plate (y 0–13): a flat slab, slightly larger than the foot band, small rounded corners
    const footG = group('foot')
    footG.add(ringLoft([ring(0, PLATE.w - 1.2, PLATE.r, PLATE.d - 1.2), ring(0.8, PLATE.w, PLATE.r, PLATE.d), ring(PLATE.h - 0.8, PLATE.w, PLATE.r, PLATE.d), ring(PLATE.h, PLATE.w - 1.2, PLATE.r, PLATE.d - 1.2), ring(PLATE.h, bodyW(y0) + 0.2, Rb(y0))], plain))
    footG.add(capMesh({ y: 0, a: PLATE.w - 1.2, b: PLATE.d - 1.2, r: PLATE.r }, plain, false))

    // the lid: lip ring over the neck top, the domed band (relief), the crown (an open flaring collar)
    const lidG = group('lid')
    const matLF = mat(lf.relief), matLS = mat(ls.relief)
    // the lip: a thin edge overhanging the neck (a hard shadow line under it, photo-08), the dome rises straight off it
    const Wl = lidW(LV.lip)
    lidG.add(ringLoft([ring(y1 - 0.2, bodyW(y1) - 0.6, Rb(y1)), ring(y1 - 0.2, Wl - 0.9, Rl(LV.lip) - 0.4), ring(y1 + 0.3, Wl, Rl(LV.lip)), ring(LV.lip, Wl, Rl(LV.lip))], plain))
    for (let k = 0; k < 4; k++) {
      const p = k % 2 ? ls : lf
      lidG.add(loftSide(kit, { k, y0: LV.lip, y1: LV.lid, W: lidW, R: Rl, relief: p.relief, arc: k % 2 ? arcLS : arcLF, panelW: p.panelW, material: k % 2 ? matLS : matLF, density: dens * 1.2, fade: 0.8 }))
    }
    const cr = (y, w) => ring(y, w, CROWN.r * RHO * w)
    const wIn = (w) => w - CROWN.wall
    // the crown: near-black (photo-08/09), its rim a saddle — full height on the broad faces, rolling down round the
    // corners (the rounded upper corners of the front view) to a lower narrow side split by a deep U slot (photo-09)
    const crownMat = new kit.PatinaMaterial({ meshTint: '#2c2924', envMapIntensity: 0.3, cavity: 0.3 })
    const crownIn = new kit.PatinaMaterial({ interior: 1, meshTint: '#3a352e', envMapIntensity: 0.3 })
    const crownSaddle = (mesh) => {
      const P = mesh.geometry.attributes.position, yb = CROWN.y0 + 4, Hc = CROWN.y1 - yb
      for (let i = 0; i < P.count; i++) {
        const y = P.getY(i)
        if (y <= yb) continue
        const x = P.getX(i), z = P.getZ(i)
        const a = CROWN.w0 + ((CROWN.w1 - CROWN.w0) * (y - CROWN.y0)) / (CROWN.y1 - CROWN.y0)
        const u = Math.min(1, Math.abs(x) / a), t = (y - yb) / Hc
        const sm = (e0, e1, v) => { const k = Math.max(0, Math.min(1, (v - e0) / (e1 - e0))); return k * k * (3 - 2 * k) }
        // a quarter-round corner of radius Rc in the front view: the narrow side stands Rc lower than the broad faces
        const u0 = 0.78, Rc = (1 - u0) * a, dx = Math.max(0, Math.min(Rc, (u - u0) * a))
        const side = (Rc - Math.sqrt(Rc * Rc - dx * dx)) / Math.max(1e-6, 1) + 1.2 * u * u // + a slightly convex rim
        const slot = 0.5 * Hc * sm(0.9, 0.99, u) * Math.exp(-((z / 4.2) ** 6)) // the U slot in the narrow side
        P.setY(i, y - t * (side + slot))
      }
      P.needsUpdate = true
      mesh.geometry.computeVertexNormals()
      return mesh
    }
    lidG.add(ringLoft([ring(LV.lid, lidW(LV.lid), Rl(LV.lid)), cr(LV.lid + 0.4, CROWN.w0 + 0.8), cr(CROWN.y0 + 1.5, CROWN.w0)], plain))
    lidG.add(crownSaddle(ringLoft([cr(CROWN.y0 + 1.5, CROWN.w0), cr(CROWN.y0 + 8, CROWN.w0 + 2.0), cr(CROWN.y0 + 14, CROWN.w0 + 3.8), cr(CROWN.y0 + 22, CROWN.w0 + 5.0), cr(CROWN.y1 - 1.2, CROWN.w1), cr(CROWN.y1, CROWN.w1 - 0.8), cr(CROWN.y1, wIn(CROWN.w1) + 0.6)], crownMat)))
    lidG.add(crownSaddle(ringLoft([cr(CROWN.y1, wIn(CROWN.w1) + 0.6), cr(CROWN.y1 - 1, wIn(CROWN.w1)), cr(CROWN.y0 + 22, wIn(CROWN.w0 + 5.0)), cr(CROWN.y0 + 8, wIn(CROWN.w0 + 2.0)), cr(CROWN.y0 + 3, wIn(CROWN.w0))], crownIn)))
    lidG.add(capMesh({ y: CROWN.y0 + 3, a: wIn(CROWN.w0), b: RHO * wIn(CROWN.w0), r: CROWN.r * RHO * wIn(CROWN.w0) }, crownIn, true))
    lap('meshes')

    // ---------------------------------------------------------------- sculpture
    await onProgress(0.84, 'handles, rings and studs')
    // photo-08/09: the handle heads, the rings and the crown are a near-black brown, the studs a little darker and
    // smoother than the straps — per-mesh tints (the shared patina uniforms cannot tell parts apart)
    const sMat = new kit.PatinaMaterial({ meshTint: '#8a8578' })
    const darkMat = new kit.PatinaMaterial({ meshTint: '#4a4038', envMapIntensity: 0.45, cavity: 0.5 })
    const voxel = Math.max(0.55, 0.75 / Math.sqrt(q))
    const flipX = new THREE.Matrix4().makeScale(-1, 1, 1)
    const hGeo = kit.meshSDF(handleSDF(), { voxel })
    const hGeo2 = hGeo.clone().applyMatrix4(flipX)
    // mirroring flips the winding: swap two indices per triangle
    const flipWinding = (g) => {
      if (g.index) { const a = g.index.array; for (let i = 0; i < a.length; i += 3) { const t = a[i + 1]; a[i + 1] = a[i + 2]; a[i + 2] = t } g.index.needsUpdate = true }
      else {
        const p = g.attributes.position.array
        for (let i = 0; i < p.length; i += 9) for (let c = 0; c < 3; c++) { const t = p[i + 3 + c]; p[i + 3 + c] = p[i + 6 + c]; p[i + 6 + c] = t }
      }
      g.computeVertexNormals()
      return g
    }
    flipWinding(hGeo2)
    const handles = [hGeo, hGeo2].map((g) => {
      const m = new THREE.Mesh(g, darkMat)
      m.userData.part = 'handles'
      m.castShadow = m.receiveShadow = true
      object.add(m)
      return m
    })
    const rings = [ringMesh(darkMat, { segments: [Math.round(96 * Math.sqrt(q)), 16] })]
    const r2 = ringMesh(darkMat, { segments: [Math.round(96 * Math.sqrt(q)), 16] })
    r2.position.x *= -1; r2.rotation.z *= -1
    rings.push(r2)
    for (const r of rings) { r.userData.part = 'rings'; object.add(r) }
    // studs: per side, a diamond on the strap crossing and a triangle under the shoulder band
    const studs = group('studs')
    for (let k = 0; k < 4; k++) {
      // the narrow sides' studs stand less proud (photo-08: their silhouette bumps ≈ 2/3 of the broad face's)
      const f = k % 2 ? 0.66 : 1
      studs.add(new THREE.Mesh(studGeometry(k, 'diamond', { cy: 180.5, w: 50 * (k % 2 ? 0.85 : 1), h: 58 * (k % 2 ? 0.9 : 1), height: 17 * f }), sMat))
      studs.add(new THREE.Mesh(studGeometry(k, 'triangle', { cy: 266, top: 290.5, w: 44 * (k % 2 ? 0.85 : 1), height: 13 * f }), sMat))
    }
    studs.traverse((o) => { if (o.isMesh) o.castShadow = o.receiveShadow = true })
    lap('sculpture')
    await onProgress(1, 'done')
    void H
    return { object, parts: { body: bodyG, foot: footG, lid: lidG, handles, rings, studs }, panels }
  },
}
