// Nezu Museum jue 饕餮文爵 (90105) — a tripod pouring cup, Shang dynasty, 13th–11th c. BC. Reconstructed from the
// project owner's ONE photograph (reference/nezu-jue/photo-02.jpg, three-quarter from behind the handle) via
// reference/nezu-jue/dossier.md. The size is INFERRED (no dimension on the label): 206 mm to the post caps.
// Units mm, Y up, front (+Z, θ 0) = the spout; the handle at θ 90 (+X), the tail at θ 180.
//
// Form (nezu-jue/form.js): a cup that is a body of revolution up to the band top and a swept upper wall above it,
// every meridian running out to its own point of the rim (a broad spout channel flaring to a rolled lip, pointed
// tail); three blade legs of triangular section tapering to points; two identical posts with domed, whorled caps at
// the spout root; a strap loop handle crowned by a ram's head (nezu-jue/sculpture.js); a notched flange on the band
// at the spout and tail axes.
// Décor (nezu-jue/relief.js + trace.js): one band of two masks (noses on the flanges, θ 0 and 180) in broad raised
// bands carrying leiwen on their tops over a plain sunk ground; a decorated triangle on the upper wall either side;
// whorls on both cap tops.

import * as THREE from 'three'
import { AZ, REG, RIM, bodySurface, bodySamples, buildLeg, bodyPoint, buildTailRibs, buildSpoutLip, V_SPLIT } from './nezu-jue/form.js'
import { buildHandle, buildPost } from './nezu-jue/sculpture.js'
import { bandPanel, whorlPanel, PANEL } from './nezu-jue/relief.js'

export default {
  id: 'nezu-jue',
  order: 10,
  title: 'Jue with Taotie Design',
  titleZh: '饕餮文爵',
  type: 'jue',
  date: '13th–11th century BC',
  period: 'Shang dynasty',
  findspot: 'Not stated on the label',
  collection: 'Nezu Museum, Tokyo',
  accession: '90105 (number on the gallery label; exhibit 2)',
  designation: 'none stated on the label',
  dimensions: { h: 205, w: 174, d: 103, inferred: true, note: 'inferred: no dimension on the label; scale set by an assumed cup (band) Ø of 69 mm (dossier § Scale), proportions measured on the one photograph; h to the post caps, w spout tip → tail tip' },
  blurb:
    'A tripod pouring cup for warmed wine: a deep round-bottomed cup that sweeps up into a long open spout on one side and a pointed tail on the other, two capped posts at the root of the spout, a loop handle crowned by an animal head, and three splayed blade legs. ' +
    'Round the cup runs one band of masks drawn in broad raised bands that carry fine spirals on their tops, over a plain sunk ground; notched flanges mark their noses under the spout and the tail. ' +
    'Reconstructed from a single photograph by the project owner: the size is inferred, and the far side and the inside repeat the visible ones.',
  defaultPatina: 'nezu-jue',
  views: {
    // the photograph's station, refitted in the jue-fix pass on 5 landmarks (both visible leg tips, both finial tops,
    // the upper-wall triangle's apex; ≈ 14 px rms ≈ 1.6 mm; the spout and tail tips then land within ≈ 5 / 1.5 mm):
    // θ 123.5, 15° up, 1.33 m, a 10° lens (fit = 1331 mm · tan 5° / R, R ≈ 143.9 mm)
    side: { azimuth: 123.5, elevation: 15, fov: 10, fit: 0.8094, target: [9.9, 99.8, 0], ref: 'side.jpg' },
    front: { azimuth: 0, elevation: 10, fov: 26, fit: 1.05, target: [0, 104, 0] },
    'three-quarter': { azimuth: 45, elevation: 14, fov: 26, fit: 1.05, target: [0, 104, 0] },
    handle: { azimuth: 90, elevation: 8, fov: 26, fit: 1.05, target: [0, 104, 0] },
    back: { azimuth: 270, elevation: 8, fov: 26, fit: 1.05, target: [0, 104, 0] },
    top: { azimuth: 90, elevation: 80, fov: 26, fit: 0.9, target: [0, 150, 0] },
    // details from the photograph's own station (jue-fix: the SAME camera position as `side`, a narrower lens aimed at
    // the centre of each crop of photo-02, so every detail is a like-for-like reference — they were close cameras with
    // a 10° lens, whose perspective did not match the crop)
    'detail-band': { azimuth: 122.80, elevation: 14.42, fov: 2.291, fit: 0.1811, target: [21.2, 119.8, -26.0], ref: 'detail-band.jpg' },
    'detail-post-cap': { azimuth: 124.41, elevation: 10.88, fov: 1.331, fit: 0.1078, target: [1.2, 192.4, 30.8], ref: 'detail-post-cap.jpg' },
    'detail-handle': { azimuth: 124.76, elevation: 14.31, fov: 2.560, fit: 0.2017, target: [48.2, 123.3, 7.9], ref: 'detail-handle.jpg' },
    'detail-leg': { azimuth: 124.29, elevation: 17.43, fov: 4.496, fit: 0.3632, target: [32.8, 45.7, 5.9], ref: 'detail-leg.jpg' },
    'detail-tail': { azimuth: 121.44, elevation: 12.26, fov: 2.663, fit: 0.2086, target: [5.4, 170.0, -51.3], ref: 'detail-tail.jpg' },
    'detail-spout': { azimuth: 125.29, elevation: 11.52, fov: 3.059, fit: 0.2508, target: [1.1, 174.5, 55.3], ref: 'detail-spout.jpg' },
    'face-band': { face: { center: [27.11, 120.75, -21.18], normal: [0.8295, 0.2079, -0.5183], up: [-0.1763, 0.9781, 0.1102], width: 62, height: 48 }, ref: 'faces/face-band.jpg' },
    'face-upper': { face: { center: [27.11, 152, -21.18], normal: [0.8295, 0.2079, -0.5183], up: [-0.1763, 0.9781, 0.1102], width: 62, height: 30 }, ref: 'faces/face-upper.jpg' },
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const q = Math.max(0.25, quality)
    const seed = 90105
    const panels = {}
    const plain = new kit.PatinaMaterial()

    await onProgress(0.05, 'band')
    const ppmm = 7.5 * Math.sqrt(q)
    panels.band = bandPanel(kit, { ppmm, seed })
    panels.whorl = whorlPanel(kit, { ppmm: 10 * Math.sqrt(q), seed: seed + 1 })

    await onProgress(0.4, 'casting')
    const bandMat = new kit.PatinaMaterial({ relief: panels.band })
    // panel ↔ body: x = developed mm along the band at r = PANEL.r from θ = 90 (the handle seam), y = height − PANEL.y0
    const geo = kit.buildSurface({
      surface: bodySurface,
      samples: bodySamples(q),
      relief: panels.band,
      panelMap: (u, v, o) => {
        const p = bodyPoint(u, v, _p)
        o[0] = u
        o[1] = (p.y - PANEL.y0) / PANEL.h
        // relief only on the cup wall and the side parts of the upper wall (not up the spout or the tail)
        const r = Math.hypot(p.x, p.z)
        o[2] = v <= V_SPLIT + 1e-6 ? 1 : r < RIM.r0 + 1.2 ? 1 : 0
      },
      fade: { u0: 0, u1: 0, v0: 0, v1: 0 },
      back: { thickness: RIM.lip, rims: ['v1'] },
    })
    const body = new THREE.Mesh(geo, bandMat)
    body.name = 'body'; body.userData.part = 'body'; body.castShadow = body.receiveShadow = true
    const object = new THREE.Group()
    object.name = 'nezu-jue'
    object.add(body)
    // the lip is the wall's own flat edge (RIM.lip thick); the tail carries a rib along each side (fix pass r8)
    for (const m of buildTailRibs(kit, { material: plain, q })) body.add(m)
    // jue-fix: the spout's rolled rim
    body.add(buildSpoutLip(kit, { material: plain, q }))

    await onProgress(0.6, 'flanges')
    const flanges = []
    for (const az of AZ.flanges) {
      const s = Math.sin(az * Math.PI / 180), c = Math.cos(az * Math.PI / 180)
      const f = kit.flange({
        from: new THREE.Vector3(s * 34.1, REG.band[0] + 0.6, c * 34.1), to: new THREE.Vector3(s * 34.3, REG.band[1] - 0.4, c * 34.3), out: new THREE.Vector3(s, 0, c),
        height: 3.4, thickness: 3.0, embed: 1.0, taper: 4, bevel: 0.5, waver: 0.3, seed: seed + az,
        notches: { shape: 'square', pitch: 2.75, depth: 0.36, width: 1.0 }, material: plain, part: 'flanges',
      })
      flanges.push(f); object.add(f)
    }

    await onProgress(0.7, 'legs')
    const legs = AZ.legs.map((az) => { const g = buildLeg(kit, { az, material: plain, q }); object.add(g); return g })

    await onProgress(0.8, 'posts')
    const capMat = new kit.PatinaMaterial({ relief: panels.whorl })
    // jue-fix: the two posts are one design (the owner: "the mushroom bits should match"): the same geometry, whorl
    // on both caps (photo-02 shows it on the far cap; the near cap's dome is worn smooth in the light)
    const posts = AZ.posts.map((az) => { const g = buildPost(kit, { az, q, material: plain, capMaterial: capMat, whorl: panels.whorl }); object.add(g); return g })

    await onProgress(0.9, 'handle')
    const handle = buildHandle(kit, { q, material: new kit.PatinaMaterial() })
    object.add(handle)

    await onProgress(1, 'done')
    return { object, parts: { body, legs, posts, handles: [handle], flanges }, panels }
  },
}
const _p = new THREE.Vector3()
