// Nezu Museum bo 蟠螭文鎛 (90120) — Spring and Autumn period, 6th–5th c. BC. Reconstructed from the project owner's
// TWO photographs (reference/nezu-bo/photo-18.jpg head-on at a broad face, photo-19 ≈ 40° round toward the left end)
// via reference/nezu-bo/dossier.md. The size is INFERRED (no dimension on the label): see dossier §b.3. The back is
// not photographed: it repeats the front. Units mm, Y up, front (+Z) = the broad face of photo-18; the long axis X.
//
// Form (nezu-bo/form.js): a bell of pointed-oval section standing on its flat mouth, its broad faces swelling a little,
// widening from the flat top to the middle and near-straight below; hollow, the wall ≈ 7 mm at the mouth (inferred).
// On the top the openwork crown (nezu-bo/crown.js): a plain bar loop between interlaced dragons, a flat plate with
// real openings. On each face: the central panel (钲), beside it three rows of three coiled-serpent bosses (枚, true
// geometry, nezu-bo/bosses.js) parted by two bands of interlace (篆), a twisted edge strip, a twisted band round the
// top, and below a broad raised border the lower field (鼓) of interlaced dragons (nezu-bo/decor.js).

import * as THREE from 'three'
import { H, K, WALL, TOP, LAYOUT, PANEL_W, halfLength, sectionXZ, faceTheta, pointAt, normalAt } from './nezu-bo/form.js'
import { upperPanel, lowerPanel } from './nezu-bo/decor.js'
import { bossMaps, buildBosses } from './nezu-bo/bosses.js'
import { buildCrown } from './nezu-bo/crown.js'

/** one half of one broad face between two heights: u from the centre line to the edge, panel x = u */
function facePatch(kit, { face, side, y0, y1, relief, material, density }) {
  const surface = (u, v, out) => {
    const th = faceTheta(face, side, u)
    const y = y0 + v * (y1 - y0)
    const p = pointAt(th, y), n = normalAt(th, y)
    out.pos.set(p[0], p[1], p[2])
    out.nrm.set(n[0], n[1], n[2])
  }
  const nu = Math.ceil(PANEL_W * density), nv = Math.ceil((y1 - y0) * density)
  const geo = kit.buildSurface({ surface, segments: [nu, nv], relief, fade: 1.5, maxVerts: 2e6 })
  return new THREE.Mesh(geo, material)
}

/** the inner wall: the section shrunk by the wall thickness (continuous through the edges) */
function innerAt(theta, y) {
  const A = halfLength(y)
  const [sx, sz] = sectionXZ(theta)
  return [(A - WALL) * sx, y, (K * A - WALL) * (sz / K)]
}

function ringFan(points, centre, up) {
  // a closed ring → triangle fan around `centre`, facing +y (up = true) or −y
  const n = points.length
  const pos = new Float32Array((n + 1) * 3), nrm = new Float32Array((n + 1) * 3)
  pos.set(centre, 0)
  for (let i = 0; i < n; i++) pos.set(points[i], (i + 1) * 3)
  for (let i = 0; i <= n; i++) nrm[i * 3 + 1] = up ? 1 : -1
  const idx = []
  for (let i = 0; i < n; i++) {
    const a = i + 1, b = ((i + 1) % n) + 1
    // points run θ −π → π (anticlockwise seen from above when x = sin θ, z = cos θ: clockwise) — orient by `up`
    if (up) idx.push(0, a, b)
    else idx.push(0, b, a)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('normal', new THREE.BufferAttribute(nrm, 3))
  g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array((n + 1) * 2).fill(-1), 2))
  g.setIndex(idx)
  return g
}

export default {
  id: 'nezu-bo',
  order: 19,
  title: 'Bo with Panchi Design',
  titleZh: '蟠螭文鎛',
  type: 'bo (bell)',
  date: 'Spring and Autumn period, 6th–5th centuries BC',
  period: 'Eastern Zhou, Spring and Autumn period',
  findspot: 'Not stated on the label',
  collection: 'Nezu Museum, Tokyo',
  accession: '90120 (number on the gallery label; exhibit 18)',
  designation: 'Not stated on the label',
  dimensions: { h: 568, w: 353, d: 280, inferred: true, note: 'inferred (±20 %): the label gives no dimensions; scale from the incised-line pitch of the interlace and the boss size (dossier §b.3). H to the top of the crown (body 450); W across the edges, D across the faces (bosses included). Proportions are measured on the two photographs through fitted cameras.' },
  blurb:
    'A large bell of pointed-oval section, made to hang mouth-down from its openwork crown of interlaced dragons and be struck from outside. Each face has a central panel flanked by three rows of three bosses, each a serpent coiled on itself with a small beast head, between bands of interlace; below a broad border the striking field is covered with interlaced dragons whose flat bodies are cut by fine parallel lines. ' +
    'Reconstructed from two of the project owner’s photographs: the size is inferred, and the back repeats the front.',
  defaultPatina: 'nezu-bo',
  views: {
    front: { azimuth: 0, elevation: 3.5, fov: 55.6, fit: 0.76, target: [0, 298, 133], ref: 'front.jpg' },
    'three-quarter': { azimuth: -40, elevation: 8, fov: 30, fit: 1.0, target: [0, 270, 0] },
    end: { azimuth: 90, elevation: 6, fov: 28, fit: 1.08, target: [0, 280, 0] },
    top: { azimuth: 0, elevation: 80, fov: 28, fit: 1.0, target: [0, 450, 0] },
    'detail-crown': { azimuth: 0, elevation: 4, fov: 20, fit: 0.36, target: [0, 505, 0] },
    'detail-boss': { azimuth: 12, elevation: 3, fov: 12, fit: 0.07, target: [-64, 400, 132] },
    'detail-band': { azimuth: 10, elevation: 4, fov: 14, fit: 0.2, target: [-90, 347, 125] },
    'detail-panel': { azimuth: 0, elevation: 4, fov: 18, fit: 0.42, target: [0, 295, 137] },
    'detail-field': { azimuth: 0, elevation: 14, fov: 16, fit: 0.3, target: [0, 80, 137] },
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const q = Math.max(0.25, quality)
    const ppmm = 6 * Math.sqrt(q)
    const seed = 90120
    const object = new THREE.Group()
    object.name = 'nezu-bo'
    const panels = {}

    await onProgress(0.05, 'upper décor')
    panels.upper = upperPanel(kit, { ppmm, seed, y0: LAYOUT.split }).bake()
    await onProgress(0.35, 'lower field')
    panels.lower = lowerPanel(kit, { ppmm, seed: seed + 1, height: LAYOUT.split }).bake()
    await onProgress(0.55, 'body')

    const body = new THREE.Group()
    body.userData.part = 'body'
    const matU = new kit.PatinaMaterial({ relief: panels.upper })
    const matL = new kit.PatinaMaterial({ relief: panels.lower })
    const density = 0.62 * Math.sqrt(q)
    for (const face of [1, -1]) {
      for (const side of [1, -1]) {
        body.add(facePatch(kit, { face, side, y0: LAYOUT.split, y1: H, relief: panels.upper, material: matU, density }))
        body.add(facePatch(kit, { face, side, y0: 0, y1: LAYOUT.split, relief: panels.lower, material: matL, density }))
      }
    }
    // inside: wall, mouth rim, ceiling; outside: the flat top
    const plain = new kit.PatinaMaterial()
    const inner = new kit.PatinaMaterial({ interior: 1 })
    const nT = Math.round(240 * Math.sqrt(q))
    const yIn = H - TOP
    const innerGeo = kit.buildSurface({
      surface: (u, v, out) => {
        const th = -Math.PI + u * Math.PI * 2
        const p = innerAt(th, v * yIn)
        const pn = innerAt(th + 1e-3, v * yIn), pm = innerAt(th - 1e-3, v * yIn)
        // inward normal: perpendicular to the section tangent, pointing at the axis
        let nx = -(pn[2] - pm[2]), nz = pn[0] - pm[0]
        if (nx * p[0] + nz * p[2] > 0) { nx = -nx; nz = -nz }
        const l = Math.hypot(nx, nz) || 1
        out.pos.set(p[0], p[1], p[2])
        out.nrm.set(nx / l, 0, nz / l)
      },
      segments: [nT, 24],
    })
    body.add(new THREE.Mesh(innerGeo, inner))
    const rimGeo = kit.buildSurface({
      surface: (u, v, out) => {
        const th = -Math.PI + u * Math.PI * 2
        const a = pointAt(th, 0), b = innerAt(th, 0)
        out.pos.set(a[0] + (b[0] - a[0]) * v, 0, a[2] + (b[2] - a[2]) * v)
        out.nrm.set(0, -1, 0)
      },
      segments: [nT * 2, 1],
    })
    body.add(new THREE.Mesh(rimGeo, plain))
    const ring = (f, y) => Array.from({ length: nT * 2 }, (_, i) => f(-Math.PI + (i / (nT * 2)) * Math.PI * 2, y))
    body.add(new THREE.Mesh(ringFan(ring(pointAt, H), [0, H, 0], true), plain))
    body.add(new THREE.Mesh(ringFan(ring(innerAt, yIn), [0, yIn, 0], false), inner))
    object.add(body)

    await onProgress(0.7, 'bosses')
    const maps = bossMaps(kit, { quality: q, seed })
    panels.boss = maps[0]
    const bossMats = maps.map((m) => new kit.PatinaMaterial({ relief: m }))
    const bosses = buildBosses(kit, { maps, materials: bossMats, quality: q })
    object.add(bosses)

    await onProgress(0.85, 'crown')
    const crown = buildCrown(kit, { quality: q, material: new kit.PatinaMaterial() })
    crown.position.y = H
    object.add(crown)

    object.traverse((m) => { if (m.isMesh) { m.castShadow = m.receiveShadow = true } })
    await onProgress(1, 'done')
    return { object, parts: { body, bosses, crown }, panels }
  },
}
