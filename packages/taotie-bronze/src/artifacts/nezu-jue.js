// Nezu Museum jue 饕餮文爵 (90105) — a tripod pouring cup, Shang dynasty, 13th–11th c. BC. Reconstructed from the
// project owner's ONE photograph (reference/nezu-jue/photo-02.jpg, three-quarter from behind the handle) via
// reference/nezu-jue/dossier.md. The size is INFERRED (no dimension on the label): 206 mm to the post caps.
// Units mm, Y up, front (+Z, θ 0) = the spout; the handle at θ 90 (+X), the tail at θ 180.
//
// Form (nezu-jue/form.js): a cup that is a body of revolution up to the band top and a swept upper wall above it,
// every meridian running out to its own point of the rim (spout channel, pointed tail); three blade legs of
// triangular section; two posts with umbrella caps at the spout root; a strap loop handle with an animal head
// (nezu-jue/sculpture.js); a notched flange on the band at the spout and tail axes.
// Décor (nezu-jue/relief.js + trace.js): one band of two masks (noses on the flanges, θ 0 and 180) in broad raised
// bands carrying leiwen on their tops over a plain sunk ground; a decorated triangle on the upper wall either side;
// whorls on the cap tops.

import * as THREE from 'three'
import { AZ, REG, RIM, bodySurface, bodySamples, buildLeg, bodyPoint, buildTailRibs, V_SPLIT } from './nezu-jue/form.js'
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
  dimensions: { h: 206, w: 172, d: 111, inferred: true, note: 'inferred: no dimension on the label; scale set by an assumed cup (band) Ø of 69 mm (dossier § Scale), proportions measured on the one photograph; h to the post caps, w spout tip → tail tip' },
  blurb:
    'A tripod pouring cup for warmed wine: a deep round-bottomed cup that sweeps up into a long open spout on one side and a pointed tail on the other, two capped posts at the root of the spout, a loop handle crowned by an animal head, and three splayed blade legs. ' +
    'Round the cup runs one band of masks drawn in broad raised bands that carry fine spirals on their tops, over a plain sunk ground; notched flanges mark their noses under the spout and the tail. ' +
    'Reconstructed from a single photograph by the project owner: the size is inferred, and the far side and the inside repeat the visible ones.',
  defaultPatina: 'nezu-jue',
  views: {
    // the photograph's station (solved on 8 landmarks, dossier § Camera): θ 122, 12° up, ≈ 1.33 m, a 10° lens
    side: { azimuth: 122, elevation: 12, fov: 10, fit: 0.8, target: [8.6, 101.9, 0], ref: 'side.jpg' },
    front: { azimuth: 0, elevation: 10, fov: 26, fit: 1.05, target: [0, 104, 0] },
    'three-quarter': { azimuth: 45, elevation: 14, fov: 26, fit: 1.05, target: [0, 104, 0] },
    handle: { azimuth: 90, elevation: 8, fov: 26, fit: 1.05, target: [0, 104, 0] },
    back: { azimuth: 270, elevation: 8, fov: 26, fit: 1.05, target: [0, 104, 0] },
    top: { azimuth: 90, elevation: 80, fov: 26, fit: 0.9, target: [0, 150, 0] },
    // details from the photograph's own station: each crop of photo-02 is the matching ref
    'detail-band': { azimuth: 122, elevation: 12, fov: 10, fit: 0.179, target: [21, 120.5, -26], ref: 'detail-band.jpg' },
    'detail-post-cap': { azimuth: 122, elevation: 12, fov: 10, fit: 0.107, target: [0, 195, 30], ref: 'detail-post-cap.jpg' },
    'detail-handle': { azimuth: 122, elevation: 12, fov: 10, fit: 0.2, target: [48, 124, 8], ref: 'detail-handle.jpg' },
    'detail-leg': { azimuth: 122, elevation: 12, fov: 10, fit: 0.358, target: [32, 48, 6], ref: 'detail-leg.jpg' },
    'detail-tail': { azimuth: 122, elevation: 12, fov: 10, fit: 0.207, target: [5, 170, -52], ref: 'detail-tail.jpg' },
    'detail-spout': { azimuth: 122, elevation: 12, fov: 10, fit: 0.248, target: [0, 178, 55], ref: 'detail-spout.jpg' },
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
    // the near cap (θ +50) is a plain dome in photo-02; the far one (θ −50) carries the whorl
    const posts = AZ.posts.map((az) => { const g = buildPost(kit, { az, q, material: plain, capMaterial: capMat, whorl: az < 0 ? panels.whorl : null }); object.add(g); return g })

    await onProgress(0.9, 'handle')
    const handle = buildHandle(kit, { q, material: new kit.PatinaMaterial() })
    object.add(handle)

    await onProgress(1, 'done')
    return { object, parts: { body, legs, posts, handles: [handle], flanges }, panels }
  },
}
const _p = new THREE.Vector3()
