// Suzanne as a taotie — projected relief on a polygon cage the kit did not make.
//
// Not a museum object: Blender's monkey head (the Blender Foundation's mascot), from the Khronos glTF
// Sample Assets (CC0, © 2017 UX3D; reference/suzanne/SOURCES.md), committed as a 25 kB quantised cage by
// tools/classics.mjs and Loop-subdivided at load. Her own features BECOME the mask (suzanne/decor.js):
// the eyes — already convex bosses — stay wide open with a round sunk pupil inside one almond lid pointed at
// both corners, the brows turn into fat C-horns ≈ 9 mm proud that coil back over the temples, a notched flange
// (kit.flange on a path sliced off her centre line) runs from the crown down between the eyes, the ears carry big
// coiled bands, and brow, forehead, temples and cheeks a fine leiwen ground up to one raised edge. The muzzle and mouth stay
// hers. Relief arrives through kit.skin: a spherical projector for the face, a planar one per ear (the
// left mirrored), the mesh refined only where a band displaces it; the bare head keeps a cavity-driven
// patina. She sits on a short cast neck ring (a socle), her chin just clear of the plinth.
// Units mm, Y up, front +Z.

import * as THREE from 'three'
import cageUrl from './suzanne/suzanne.bin?url'
import { FACE, EAR, drawFace, drawEar } from './suzanne/decor.js'

const HEIGHT = 220 // the head, chin to crown
const LIFT = 6 // the chin's clearance above the plinth (the socle carries her)

export default {
  id: 'suzanne',
  group: 'examples',
  order: 62,
  title: 'Suzanne as a Taotie',
  type: 'computer-graphics test model, recast in bronze',
  date: 'Blender mascot 2002 · glTF sample 2017 · recast 2026',
  period: 'Computer-graphics test model (polygon cage)',
  findspot: '',
  collection: 'Mesh: Khronos glTF Sample Assets (CC0, © 2017 UX3D) — Suzanne is the Blender Foundation’s mascot',
  accession: '',
  dimensions: { h: 225, w: 304, d: 186 },
  blurb:
    'Suzanne is the monkey head built into the Blender 3D software as its test model and mascot; this cage is the CC0 copy UX3D made for the Khronos glTF sample models. ' +
    'The Taotie Kit subdivided her and projected relief onto her own features, so her face becomes the mask: staring eyes in pointed almond lids, brows turned into fat coiled horns, a notched flange down the nose, spirals in her ears, and a fine leiwen ground — her muzzle and mouth left as they were.',
  defaultPatina: 'suzanne',
  views: {
    front: { azimuth: 0, elevation: 4, fov: 26, fit: 1.05 },
    'three-quarter': { azimuth: -35, elevation: 10, fov: 26, fit: 1.05 },
    back: { azimuth: 180, elevation: 8, fov: 26, fit: 1.05 },
    side: { azimuth: 90, elevation: 4, fov: 26, fit: 1.08 },
    top: { azimuth: 0, elevation: 80, fov: 26, fit: 1.0 },
    'detail-eye': { azimuth: -12, elevation: 8, fov: 16, fit: 0.3, target: [-38, LIFT + 150, 80] },
    'detail-ear': { azimuth: 28, elevation: 6, fov: 16, fit: 0.27, target: [126, LIFT + 135, -42] },
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const q = Math.max(0.25, quality)
    await onProgress(0.02, 'loading the cage')
    let m = kit.decodeMesh(await kit.fetchMeshBytes(cageUrl))
    // glTF: Y up, she faces +Z → mm, chin on y = LIFT, centred
    const b0 = kit.meshBounds(m)
    const k = HEIGHT / b0.size[1]
    const P0 = m.positions
    for (let i = 0; i < P0.length; i += 3) {
      P0[i] = (P0[i] - b0.center[0]) * k
      P0[i + 1] = (P0[i + 1] - b0.min[1]) * k + LIFT
      P0[i + 2] = (P0[i + 2] - b0.center[2]) * k
    }
    await onProgress(0.06, 'subdividing')
    m = kit.loopSubdivide(m, q >= 0.75 ? 2 : 1)

    // ---- panels (drawn in the projectors' own mm, suzanne/decor.js)
    await onProgress(0.12, 'face panel')
    const ppmm = 6.5 * Math.sqrt(q)
    const facePanel = new kit.ReliefPanel({ width: FACE.width, height: FACE.height, ppmm, seed: 2002 })
    drawFace(kit, facePanel, { seed: 3 })
    await onProgress(0.42, 'baking the face')
    const faceMap = facePanel.bake()
    await onProgress(0.5, 'ear panel')
    const earPanel = new kit.ReliefPanel({ width: EAR.width, height: EAR.height, ppmm: ppmm * 1.1, seed: 2017 })
    drawEar(kit, earPanel, { seed: 5 })
    const earMap = earPanel.bake()

    const lift = (c) => [c[0], c[1] + LIFT, c[2]]
    const face = kit.sphericalProjector({ ...FACE.projector, center: lift(FACE.projector.center), width: FACE.width, height: FACE.height })
    const er = EAR.projector
    const earR = kit.planarProjector({ ...er, center: lift(er.center), width: EAR.width, height: EAR.height })
    const earL = kit.planarProjector({ ...er, center: lift([-er.center[0], er.center[1], er.center[2]]), normal: [-er.normal[0], er.normal[1], er.normal[2]], mirror: true, width: EAR.width, height: EAR.height })
    const regions = [
      { relief: faceMap, projectors: [face] },
      { relief: earMap, projectors: [earR, earL] },
    ]

    // ---- refine where a band displaces her, to the macro spacing
    await onProgress(0.58, 'refining')
    const edge = q >= 1.5 ? 0.75 : q >= 1 ? 1.0 : 1.7
    m = kit.refineMesh(m, { edge, where: kit.reliefWhere(regions, { size: 3, threshold: 0.06 }), maxVerts: q >= 1 ? 190000 : 80000 })
    await onProgress(0.7, 'cavity')
    kit.vertexNormals(m)
    const cavity = kit.meshCavity(m, { obscurance: 1.9, curvature: 0.6, gamma: 1.6 })
    await onProgress(0.8, 'dressing')
    const head = kit.skin(m, { regions, cavity, spacing: edge, part: 'body' })
    head.name = 'suzanne'

    // ---- the flange down her centre line, crown → top of the nose
    await onProgress(0.88, 'flange')
    const flange = centreFlange(kit, m, q)

    // ---- the socle
    await onProgress(0.94, 'socle')
    const socle = neckRing(kit, q)

    const object = new THREE.Group()
    object.name = 'suzanne'
    object.add(socle, head)
    if (flange) object.add(flange)
    await onProgress(1, 'done')
    const parts = { body: head, foot: socle }
    if (flange) parts.flanges = flange
    return { object, parts, panels: { face: faceMap, ear: earMap } }
  },
}

/** the notched flange on her centre line, sliced off the mesh (plane x = 0): one run from the crown down the
 *  forehead to the brow notch, a second down the bridge between the eyes to the top of the nose — broken at
 *  the notch, where her brow steps forward by a ledge no straight-sided flange can follow */
function centreFlange(kit, m, q) {
  const lines = kit.sliceMesh(m, { point: [0, 0, 0], normal: [1, 0, 0] })
  // the head shell's centre section is the longest loop; keep its front-top part (one contiguous run)
  const loop = lines.sort((a, b) => b.length - a.length)[0]
  if (!loop) return null
  const run = (y0, y1, r = 3) => {
    const keep = (p) => p[1] <= y1 && p[1] >= y0 && p[2] > -25
    const k0 = loop.findIndex((p) => !keep(p))
    const rot = k0 > 0 ? loop.slice(k0).concat(loop.slice(0, k0)) : loop
    let pts = rot.filter(keep)
    if (pts.length < 8) return null
    if (pts[0][1] > pts[pts.length - 1][1]) pts.reverse()
    return smoothPath(smoothPath(resamplePath(pts, 1.5), r), r)
  }
  const material = new kit.PatinaMaterial({ cavity: 0.85 })
  const g = new THREE.Group()
  g.name = 'flange'
  // one continuous run, crown → top of the nose, the brow notch's step eased by heavy smoothing
  const specs = [{ y0: LIFT + 97, y1: LIFT + 214, height: (f) => 7 + 2 * Math.sin(Math.PI * f), pitch: 15, smooth: 7 }]
  for (const sp of specs) {
    const pts = run(sp.y0, sp.y1, sp.smooth)
    if (!pts) continue
    g.add(kit.flange({
      path: pathFrame(pts, [0, LIFT + 140, -15]), height: sp.height, thickness: 6.5, taper: 4, waver: 0.3, seed: 11,
      notches: { shape: 'square', pitch: sp.pitch, depth: 0.45, width: 3.4 }, ends: { start: 'taper', end: 'taper' },
      material, part: 'flanges',
    }))
  }
  return g.children.length ? g : null
}

function resamplePath(pts, step) {
  const out = [pts[0]]
  let acc = 0
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i]
    const d = Math.hypot(b[1] - a[1], b[2] - a[2])
    acc += d
    while (acc >= step) {
      acc -= step
      const t = 1 - acc / Math.max(d, 1e-9)
      out.push([0, a[1] + t * (b[1] - a[1]), a[2] + t * (b[2] - a[2])])
    }
  }
  out.push(pts[pts.length - 1])
  return out
}

function smoothPath(pts, r) {
  return pts.map((p, i) => {
    let y = 0, z = 0, n = 0
    for (let j = Math.max(0, i - r); j <= Math.min(pts.length - 1, i + r); j++) { y += pts[j][1]; z += pts[j][2]; n++ }
    return [0, y / n, z / n]
  })
}

/** a path { length, frame(σ) } through points in the x = 0 plane; n points away from `inner` */
function pathFrame(pts, inner) {
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]))
  const L = cum[cum.length - 1]
  const at = (s) => {
    s = Math.max(0, Math.min(L, s))
    let i = 1
    while (i < cum.length - 1 && cum[i] < s) i++
    const t = (s - cum[i - 1]) / Math.max(cum[i] - cum[i - 1], 1e-9)
    return [0, pts[i - 1][1] + t * (pts[i][1] - pts[i - 1][1]), pts[i - 1][2] + t * (pts[i][2] - pts[i - 1][2])]
  }
  return {
    length: L,
    frame(s) {
      const h = 3
      const a = at(s - h), b = at(s + h), p = at(s)
      const d = new THREE.Vector3(0, b[1] - a[1], b[2] - a[2]).normalize()
      let n = new THREE.Vector3(0, -d.z, d.y)
      if (n.y * (p[1] - inner[1]) + n.z * (p[2] - inner[2]) < 0) n.negate()
      const bb = new THREE.Vector3().crossVectors(d, n)
      return { p: new THREE.Vector3(...p), n, d, b: bb }
    },
  }
}

/** a short cast neck ring (socle) under her skull: a stepped, flared foot, a concave waist, a collar of two
 *  bowstrings, the top lost inside the head */
function neckRing(kit, q) {
  const top = LIFT + 90
  const profile = [
    [52, 0], [52, 3.5, 'corner'], [48.5, 4.2, 'corner'], [48, 7], [44.5, 13], [41.5, 24], [41, 36], [42.5, 41], [41, 44.5], [42.5, 48], [41, 51.5], [40.5, 58], [37, top - 8], [33, top],
  ]
  const ring = kit.lathe({ profile, material: new kit.PatinaMaterial({ cavity: 0.8 }), part: 'foot', segments: { density: q >= 1 ? 0.7 : 0.4 } })
  ring.position.z = -28
  ring.name = 'socle'
  return ring
}
