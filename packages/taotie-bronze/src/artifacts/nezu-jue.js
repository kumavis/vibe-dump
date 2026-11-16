// Nezu Museum jue 饕餮文爵 (90105) — a tripod pouring cup, Shang dynasty, 13th–11th c. BC. Reconstructed from the
// project owner's ONE photograph (reference/nezu-jue/photo-02.jpg, three-quarter from behind the handle) via
// reference/nezu-jue/dossier.md. The size is INFERRED (no dimension on the label): 214 mm to the tail tip.
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
import { AZ, REG, RIM, bodySurface, bodySamples, buildLeg, postTop, CUP, uOfAz, azOfU, bodyPoint, V_SPLIT } from './nezu-jue/form.js'
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
  designation: '',
  dimensions: { h: 214, w: 186, d: 125, inferred: true, note: 'inferred: no dimension on the label; scale set by an assumed cup Ø of 69 mm (dossier § Scale), proportions measured on the one photograph' },
  blurb:
    'A tripod pouring cup for warmed wine: a deep round-bottomed cup that sweeps up into a long open spout on one side and a pointed tail on the other, two capped posts at the root of the spout, a loop handle crowned by an animal head, and three splayed blade legs. ' +
    'Round the cup runs one band of masks drawn in broad raised bands that carry fine spirals on their tops, over a plain sunk ground; notched flanges mark their noses under the spout and the tail. ' +
    'Reconstructed from a single photograph by the project owner: the size is inferred, and the far side and the inside repeat the visible ones.',
  defaultPatina: 'nezu-jue',
  views: {
    side: { azimuth: 122, elevation: 12, fov: 10, fit: 0.78, target: [6.5, 101.3, 0], ref: 'side.jpg' },
    'side-hi': { azimuth: 124, elevation: 20, fov: 10, fit: 0.78, target: [6.5, 104, 0] },
    front: { azimuth: 0, elevation: 8, fov: 28, fit: 1.05, target: [0, 112, 0] },
    'three-quarter': { azimuth: 40, elevation: 14, fov: 28, fit: 1.05, target: [0, 112, 0] },
    handle: { azimuth: 90, elevation: 8, fov: 28, fit: 1.05, target: [0, 112, 0] },
    top: { azimuth: 90, elevation: 82, fov: 28, fit: 1.0, target: [0, 150, 0] },
    'detail-band': { azimuth: 150, elevation: 8, fov: 20, fit: 0.32, target: [0, 132, -20] },
    'detail-post-cap': { azimuth: 110, elevation: 30, fov: 20, fit: 0.14, target: [16.4, 208, 32.3] },
    'detail-handle-head': { azimuth: 120, elevation: 14, fov: 20, fit: 0.2, target: [52, 140, 0] },
    'detail-leg': { azimuth: 130, elevation: 6, fov: 22, fit: 0.42, target: [36, 55, 0] },
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

    await onProgress(0.6, 'flanges')
    const flanges = []
    for (const az of AZ.flanges) {
      const s = Math.sin(az * Math.PI / 180), c = Math.cos(az * Math.PI / 180)
      const f = kit.flange({
        from: new THREE.Vector3(s * 34.1, REG.band[0] + 0.6, c * 34.1), to: new THREE.Vector3(s * 34.3, REG.band[1] - 0.4, c * 34.3), out: new THREE.Vector3(s, 0, c),
        height: 3.4, thickness: 3.0, embed: 1.0, taper: 4, bevel: 0.5, waver: 0.3, seed: seed + az,
        notches: { shape: 'square', pitch: 3.7, depth: 0.42, width: 1.5 }, material: plain, part: 'flanges',
      })
      flanges.push(f); object.add(f)
    }

    await onProgress(0.7, 'legs')
    const legs = AZ.legs.map((az) => { const g = buildLeg(kit, { az, material: plain, q }); object.add(g); return g })

    await onProgress(0.8, 'posts')
    const capMat = new kit.PatinaMaterial({ relief: panels.whorl })
    const posts = AZ.posts.map((az) => { const g = buildPost(kit, { az, q, material: plain, capMaterial: capMat, whorl: panels.whorl }); object.add(g); return g })

    await onProgress(0.9, 'handle')
    const handle = buildHandle(kit, { q, material: new kit.PatinaMaterial() })
    object.add(handle)

    await onProgress(1, 'done')
    return { object, parts: { body, legs, posts, handles: [handle], flanges }, panels }
  },
}
const _p = new THREE.Vector3()
void CUP; void uOfAz; void azOfU; void postTop
