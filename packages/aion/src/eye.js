// The affected eye and the first 12 mm of its optic nerve, built in the
// nerve-head frame (see anat.js). Everything that can be sliced shares one
// clipping plane; the painted section and the in-plane bundles and vessels
// sit just behind it.
import * as THREE from 'three'
import {
  D2R, THETA, RE, WALL_C, R_RET_IN, R_DURA, NERVE_END, SLICE_Z, TUBE_Z, LANES, DISC_R,
  lamFront, nerveR, wallX, bundle, fundus, FOVEA, LAM_T,
} from './anat.js'
import { paintSection, PLATES } from './painter.js'
import { tube, curveOf, flow, canvasTexture, rng, smooth, lerp } from './util.js'

const HEALTHY = new THREE.Color(0xf1dd94), SWOLLEN = new THREE.Color(0xf6cdb6), DEAD = new THREE.Color(0x8d8f98)
const ART = 0xd8372c, VEIN = 0x3d5cab

/** A tube lying in the slice plane, built straight from bundle() samples, with swollen and wasted shapes as morph targets. */
function planarTube(samples, z, radial, swell, waste) {
  const n = samples.length, ring = radial + 1
  const pos = new Float32Array(n * ring * 3), fat = new Float32Array(n * ring * 3), thin = new Float32Array(n * ring * 3)
  const idx = []
  samples.forEach((p, i) => {
    const a = samples[Math.max(0, i - 1)], b = samples[Math.min(n - 1, i + 1)]
    const tx = b.x - a.x, ty = b.y - a.y, L = Math.hypot(tx, ty) || 1
    const nx = -ty / L, ny = tx / L
    const m = swell(p)
    for (let j = 0; j <= radial; j++) {
      const ang = (j / radial) * Math.PI * 2, c = Math.cos(ang), s = Math.sin(ang), k = (i * ring + j) * 3
      pos[k] = p.x + nx * c * p.r; pos[k + 1] = p.y + ny * c * p.r; pos[k + 2] = z + s * p.r
      const rf = p.r * m.scale
      fat[k] = p.x + m.dx + nx * c * rf; fat[k + 1] = p.y + m.dy + ny * c * rf; fat[k + 2] = z + s * Math.min(rf, 0.066)
      const rt = p.r * waste
      thin[k] = p.x + nx * c * rt; thin[k + 1] = p.y + ny * c * rt; thin[k + 2] = z + s * rt
      if (i < n - 1 && j < radial) { const q = i * ring + j; idx.push(q, q + ring, q + 1, q + ring, q + ring + 1, q + 1) }
    }
  })
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setIndex(idx)
  g.computeVertexNormals()
  g.morphAttributes.position = [new THREE.BufferAttribute(fat, 3), new THREE.BufferAttribute(thin, 3)]
  return g
}

function paintFundus(g, S) {
  const rand = rng(11), k = S / 34, cx = S / 2 - (FOVEA.u / 2) * k, cy = S / 2
  const X = u => cx + u * k, Y = v => cy - v * k
  // fades to one flat colour before the edge, so the stretched rim of the map shows no streaks
  const bg = g.createRadialGradient(S / 2, S / 2, S * 0.03, S / 2, S / 2, S * 0.5)
  bg.addColorStop(0, '#d9662d'); bg.addColorStop(0.6, '#bd4d21'); bg.addColorStop(1, '#8a3214')
  g.fillStyle = bg; g.fillRect(0, 0, S, S)
  for (let i = 0; i < 2600; i++) { // faint mottling from the choroid showing through
    g.fillStyle = rand() < 0.5 ? 'rgba(255,170,90,0.03)' : 'rgba(70,15,5,0.035)'
    const a = rand() * 7, r = S * 0.44 * Math.sqrt(rand())
    g.beginPath(); g.arc(S / 2 + r * Math.cos(a), S / 2 + r * Math.sin(a), (0.1 + 0.45 * rand()) * k, 0, 7); g.fill()
  }
  const m = g.createRadialGradient(X(FOVEA.u), Y(FOVEA.v), 0, X(FOVEA.u), Y(FOVEA.v), 1.9 * k)
  m.addColorStop(0, 'rgba(70,14,6,0.8)'); m.addColorStop(0.25, 'rgba(70,14,6,0.45)'); m.addColorStop(1, 'rgba(70,14,6,0)')
  g.fillStyle = m; g.fillRect(0, 0, S, S)
}

/** The optic disc as the doctor sees it. Up on the canvas is up in the eye. */
function paintDisc(g, S, s) {
  const c = S / 2, r = S * (DISC_R / 2.6)
  g.clearRect(0, 0, S, S)
  const swell = s.swelling, pale = s.pallor
  if (swell > 0.01) { // blurred, raised margin spilling past the normal edge, worst above
    const halo = g.createRadialGradient(c, c - r * 0.3, r * 0.5, c, c - r * 0.3, r * 1.4)
    halo.addColorStop(0, `rgba(238,122,92,${0.92 * swell})`); halo.addColorStop(1, 'rgba(238,122,92,0)')
    g.fillStyle = halo; g.fillRect(0, 0, S, S)
  }
  const body = g.createRadialGradient(c, c, 0, c, c, r)
  body.addColorStop(0, '#ee9a68'); body.addColorStop(0.8, '#e17f4a'); body.addColorStop(1, '#d56a38')
  g.fillStyle = body; g.beginPath(); g.arc(c, c, r, 0, 7); g.fill()
  g.save(); g.beginPath(); g.arc(c, c, r * (1 + 0.24 * swell), 0, 7); g.clip()
  const up = g.createLinearGradient(0, c - r, 0, c + r * 0.25)
  up.addColorStop(0, `rgba(226,84,60,${0.7 * swell * (1 - pale)})`); up.addColorStop(1, 'rgba(226,84,60,0)')
  g.fillStyle = up; g.fillRect(0, 0, S, S)
  const wash = g.createLinearGradient(0, c - r, 0, c + r * 0.2)
  wash.addColorStop(0, `rgba(248,244,230,${0.95 * pale})`); wash.addColorStop(0.7, `rgba(248,244,230,${0.9 * pale})`); wash.addColorStop(1, 'rgba(248,244,230,0)')
  g.fillStyle = wash; g.fillRect(0, 0, S, S)
  g.restore()
  g.fillStyle = 'rgba(255,240,205,0.92)' // the cup: small, in a crowded disc
  g.beginPath(); g.arc(c, c, r * 0.17 * (1 - 0.6 * swell), 0, 7); g.fill()
  const blood = swell * (1 - pale)
  if (blood > 0.01) { // splinter haemorrhages at the margin
    g.strokeStyle = `rgba(150,12,18,${0.85 * blood})`; g.lineCap = 'round'
    for (const [a, len, wd] of [[-2.25, 0.3, 0.075], [-1.5, 0.22, 0.06], [-0.85, 0.27, 0.07]]) {
      g.lineWidth = wd * r
      g.beginPath(); g.moveTo(c + Math.cos(a) * r * 0.97, c + Math.sin(a) * r * 0.97)
      g.lineTo(c + Math.cos(a) * r * (1 + len), c + Math.sin(a) * r * (1 + len)); g.stroke()
    }
  }
}

export function buildEye(clip, lowRes) {
  const group = new THREE.Group()
  const cut = { clippingPlanes: [clip] }
  const std = o => new THREE.MeshStandardMaterial({ roughness: 0.6, ...o })
  const anterior = new THREE.Vector3(-Math.cos(THETA), 0, Math.sin(THETA))
  const toFront = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), anterior)
  const limb = 29.4 * D2R

  // ---- the globe
  const scleraGeo = new THREE.SphereGeometry(RE, 96, 64, 0, Math.PI * 2, limb, Math.PI - limb)
  scleraGeo.applyQuaternion(toFront); scleraGeo.translate(-RE, 0, 0)
  group.add(new THREE.Mesh(scleraGeo, std({ color: 0xece6da, roughness: 0.45, ...cut })))
  const uvea = new THREE.SphereGeometry(11.3, 64, 48); uvea.translate(-12.1, 0, 0)
  group.add(new THREE.Mesh(uvea, new THREE.MeshBasicMaterial({ color: 0x2b1711, side: THREE.BackSide, ...cut })))

  // retina, painted like a fundus photograph and mapped flat around the disc
  const retGeo = new THREE.SphereGeometry(R_RET_IN, 128, 96, 0, Math.PI * 2, 52 * D2R, Math.PI - 52 * D2R)
  retGeo.applyQuaternion(toFront)
  {
    const p = retGeo.attributes.position, uv = retGeo.attributes.uv
    for (let i = 0; i < p.count; i++) {
      const x = Math.max(p.getX(i), 0.4), u = (-p.getZ(i) / x) * 10.72, v = (p.getY(i) / x) * 10.72
      uv.setXY(i, 0.5 + (u - FOVEA.u / 2) / 34, 0.5 + v / 34)
    }
  }
  retGeo.translate(WALL_C, 0, 0)
  group.add(new THREE.Mesh(retGeo, new THREE.MeshBasicMaterial({ map: canvasTexture(lowRes ? 1024 : 2048, paintFundus), side: THREE.BackSide, ...cut })))

  // front of the eye
  const front = new THREE.Group()
  front.quaternion.copy(toFront); front.position.set(-RE, 0, 0)
  group.add(front)
  const cornea = new THREE.Mesh(new THREE.SphereGeometry(7.8, 64, 24, 0, Math.PI * 2, 0, 49.1 * D2R),
    new THREE.MeshPhysicalMaterial({ color: 0xcfe8f0, roughness: 0.05, transparent: true, opacity: 0.3, depthWrite: false, ...cut }))
  cornea.position.y = 5.35; cornea.renderOrder = 2
  const irisTex = canvasTexture(256, (g, S) => {
    const rand = rng(5); g.fillStyle = '#4f7391'; g.fillRect(0, 0, S, S)
    g.translate(S / 2, S / 2)
    for (let i = 0; i < 260; i++) { g.rotate(rand() * 7); g.strokeStyle = rand() < 0.5 ? 'rgba(20,40,60,0.35)' : 'rgba(190,215,230,0.3)'; g.lineWidth = 1 + rand() * 1.5; g.beginPath(); g.moveTo(S * 0.14, 0); g.lineTo(S * 0.5, 0); g.stroke() }
  })
  const iris = new THREE.Mesh(new THREE.RingGeometry(1.7, 5.95, 64), new THREE.MeshStandardMaterial({ map: irisTex, side: THREE.DoubleSide, roughness: 0.7, ...cut }))
  iris.rotation.x = -Math.PI / 2; iris.position.y = 9.55
  const pupil = new THREE.Mesh(new THREE.CircleGeometry(1.75, 40), new THREE.MeshBasicMaterial({ color: 0x050506, ...cut }))
  pupil.rotation.x = -Math.PI / 2; pupil.position.y = 9.5
  const lensGeo = new THREE.SphereGeometry(1, 48, 32); lensGeo.scale(4.5, 1.9, 4.5)
  const lens = new THREE.Mesh(lensGeo, new THREE.MeshPhysicalMaterial({ color: 0xeee6c2, roughness: 0.15, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false, ...cut }))
  lens.position.y = 7.3; lens.renderOrder = 1
  front.add(cornea, iris, pupil, lens)

  // nerve sheath behind the eye
  const dura = new THREE.CylinderGeometry(R_DURA, R_DURA, NERVE_END + 0.2, 48, 1, true)
  dura.rotateZ(-Math.PI / 2); dura.translate((NERVE_END - 0.2) / 2, 0, 0)
  group.add(new THREE.Mesh(dura, std({ color: 0xbdb5a7, side: THREE.DoubleSide, ...cut })))

  // ---- on the inside surface: retinal vessels and the nerve-fibre layer
  const F = (u, v, lift) => new THREE.Vector3(...fundus(u, v, lift))
  const vesselMat = { a: std({ color: ART, roughness: 0.5, ...cut }), v: std({ color: 0x7c1620, roughness: 0.5, ...cut }) }
  const retinalFlow = []
  const onDisc = u => 0.03 + 0.07 * (1 - smooth(0.7, 1.4, u)) // vessels ride over the disc
  const surfaceVessel = (pts, r, kind) => {
    const curve = curveOf(pts.map(([u, v]) => F(u, v, onDisc(Math.hypot(u, v)) + r)))
    group.add(new THREE.Mesh(tube(curve, 64, 6, t => r * (1 - 0.45 * t)), vesselMat[kind]))
    if (kind === 'a') { const f = flow(curve, 12, r * 2.6, 0xffc2ae); f.mat.clippingPlanes = [clip]; group.add(f.points); retinalFlow.push(f) }
  }
  for (const s of [1, -1]) {
    const temporal = [[0.05, 0.12], [0.3, 0.75], [1.3, 2.3], [3.2, 3.4], [5.6, 3.3], [8, 2.3], [10, 0.9]].map(([u, v]) => [u, v * s])
    const nasal = [[-0.05, 0.12], [-0.4, 0.8], [-1.5, 2.1], [-3.4, 3.1], [-6, 3.7], [-8.5, 3.6]].map(([u, v]) => [u, v * s])
    for (const a of [temporal, nasal]) {
      surfaceVessel(a, 0.05, 'a')
      surfaceVessel(a.map(([u, v], i) => [u + (i ? 0.16 : 0.1) * (a === temporal ? 1 : -1), v + (i ? 0.2 * s : 0)]), 0.065, 'v')
      const [bu, bv] = a[3]
      surfaceVessel([[bu, bv], [bu * 1.05, bv + 1.1 * s], [bu * 1.2, bv + 2.6 * s]], 0.03, 'a')
      surfaceVessel([[a[2][0], a[2][1]], [a[2][0] * 1.6, a[2][1] - 0.6 * s], [a[2][0] * 2.4, a[2][1] - 1.0 * s]], 0.026, 'a')
    }
  }
  const nflMat = {}
  const NFL_OK = new THREE.Color(0xffe9a8), NFL_DEAD = new THREE.Color(0x5a4a44)
  for (const half of ['sup', 'inf']) {
    const s = half === 'sup' ? 1 : -1
    const m = nflMat[half] = new THREE.MeshBasicMaterial({ color: NFL_OK, transparent: true, opacity: 0.3, depthWrite: false, ...cut })
    const N = 46
    for (let i = 0; i < N; i++) {
      const beta = 0.06 + (i / (N - 1)) * (Math.PI - 0.1) // angle round the disc, 0 = toward the fovea
      const p0 = new THREE.Vector2(Math.cos(beta) * DISC_R, Math.sin(beta) * DISC_R)
      const dir = new THREE.Vector2(Math.cos(beta), Math.sin(beta))
      let p1, p2
      if (beta < 0.3) { p2 = new THREE.Vector2(FOVEA.u - 0.4, 0.05 + beta * 0.6); p1 = p0.clone().lerp(p2, 0.5) } //   straight to the macula
      else if (beta < 1.25) { //                                                                                     arching over it to the midline
        const k = (beta - 0.3) / 0.95
        p2 = new THREE.Vector2(FOVEA.u + 0.45 + 4.6 * k, 0.05); p1 = new THREE.Vector2((p0.x + p2.x) / 2 - 0.5, 1.0 + 3.4 * k)
      } else if (beta < 2.05) { const k = (beta - 1.25) / 0.8; p2 = new THREE.Vector2(lerp(9.5, 0, k), lerp(2, 8, k)); p1 = p0.clone().addScaledVector(dir, 2.2).add(new THREE.Vector2(1.6 * (1 - k), 2)) }
      else { p2 = p0.clone().addScaledVector(dir, 6.5); p1 = p0.clone().lerp(p2, 0.5) }
      const q = new THREE.QuadraticBezierCurve(p0, p1, p2)
      const mesh = new THREE.Mesh(tube(curveOf(q.getPoints(20).map(p => F(p.x, p.y * s, 0.012))), 24, 4, 0.016), m)
      mesh.renderOrder = 1
      group.add(mesh)
    }
  }
  // the disc itself, as seen from inside the eye
  const discCanvas = document.createElement('canvas'); discCanvas.width = discCanvas.height = 512
  const dg = discCanvas.getContext('2d')
  const discTex = new THREE.CanvasTexture(discCanvas); discTex.colorSpace = THREE.SRGBColorSpace
  const disc = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.6), new THREE.MeshBasicMaterial({ map: discTex, transparent: true, depthWrite: false }))
  disc.rotation.y = -Math.PI / 2; disc.position.set(-1.555, 0, 0); disc.renderOrder = 2
  group.add(disc)

  // ---- the section: painted plates, then bundles and vessels standing proud of them
  const section = new THREE.Group()
  group.add(section)
  const plateMats = PLATES.map((b, i) => {
    const tex = canvasTexture(lowRes ? 1024 : 2048, (g, S) => paintSection(g, S, b, PLATES[i + 1]))
    const m = new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.5 })
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(b.w, b.w), m)
    mesh.position.set(b.x + b.w / 2, b.y + b.w / 2, SLICE_Z + i * 0.0012)
    section.add(mesh)
    return m
  })

  const bundles = []
  for (const sign of [1, -1]) for (let i = 0; i < LANES; i++) {
    const samples = bundle(i, sign, 10)
    const geo = planarTube(samples, TUBE_Z, 8, p => sign > 0
      ? { scale: 1 + 1.3 * p.bump, dx: -p.bump * (0.1 + 0.011 * (LANES - 1 - i)), dy: p.bump * 0.013 * i }
      : { scale: 1 + 0.22 * p.bump, dx: -p.bump * 0.02, dy: 0 }, 0.5)
    const mat = std({ color: HEALTHY, roughness: 0.55, transparent: true })
    const mesh = new THREE.Mesh(geo, mat)
    section.add(mesh)
    bundles.push({ mesh, mat, upper: sign > 0, lane: i })
  }

  const vessels = []
  const inPlane = (pts, r, color, role, dots, z = -0.036) => {
    const curve = curveOf(pts.map(p => [p[0], p[1], p[2] ?? z]))
    const mat = std({ color, roughness: 0.45, transparent: true, emissive: color, emissiveIntensity: r < 0.02 ? 0.55 : 0.12 })
    const mesh = new THREE.Mesh(tube(curve, Math.max(24, pts.length * 10), 8, r), mat)
    section.add(mesh)
    const f = dots ? flow(curve, dots, r * 1.5, color === VEIN ? 0xb9c8ff : 0xffd0c2) : null
    if (f) { f.points.renderOrder = 4; f.mat.depthTest = false; section.add(f.points) }
    vessels.push({ mesh, mat, f, role, base: new THREE.Color(color), len: curve.getLength() })
  }
  const rs = R_RET_IN - 0.06
  // central retinal artery and vein: in through the sheath ~10 mm back, then up the core of the nerve
  inPlane([[12.4, -3.6], [10.6, -2.75], [9.6, -1.7], [8.7, -0.55], [7.8, -0.07], [4, -0.06], [0, -0.055], [-0.9, -0.05], [-1.3, -0.05]], 0.055, ART, 'cra', 26)
  inPlane([[12.9, -3.6, -0.1], [11.1, -2.75, -0.1], [10.1, -1.7, -0.1], [9.2, -0.5, -0.1], [8.3, 0.06, -0.1], [4, 0.07, -0.1], [0, 0.065, -0.1], [-0.9, 0.06, -0.1], [-1.28, 0.06, -0.1]], 0.066, VEIN, 'crv', 0)
  for (const s of [1, -1]) {
    inPlane([[-1.3, -0.05], [-1.44, 0.1 * s], [-1.56, 0.42 * s], [-1.6, 0.9 * s], [wallX(rs, 1.6) - 0.02, 1.6 * s], [wallX(rs, 2.6), 2.6 * s], [wallX(rs, 4), 4 * s]], 0.04, ART, 'cra', 10)
    inPlane([[-1.28, 0.06, -0.1], [-1.4, 0.2 * s, -0.1], [-1.52, 0.5 * s, -0.1], [-1.57, 1.0 * s, -0.1], [wallX(rs, 1.7) - 0.02, 1.7 * s, -0.1], [wallX(rs, 3), 3 * s, -0.1]], 0.048, VEIN, 'crv', 0)
    // a short posterior ciliary artery beside the nerve, through the sclera to the arterial circle
    const sec = s > 0 ? 'sector' : 'other'
    inPlane([[14.5, 2.4, -3.8], [12.6, s > 0 ? 3 : -0.4, s > 0 ? -2.2 : -3.6], [11, 2.75 * s, -1.2], [8.5, 3.15 * s, -0.12], [6, 3.15 * s], [2, 3.08 * s], [0.3, 3.05 * s], [-0.3, 2.9 * s], [-0.62, 2.4 * s], [-0.75, 1.8 * s], [-0.75, 1.38 * s]], 0.04, ART, sec + '-trunk', 28)
    // … into the lamina
    inPlane([[-0.75, 1.38 * s], [-0.8, 1.08 * s], [lamFront(0.8) + 0.15, 0.82 * s], [lamFront(0.5) + 0.15, 0.5 * s], [lamFront(0.2) + 0.15, 0.2 * s]], 0.013, ART, sec, 9)
    // … forward through the choroid at the disc margin into the prelaminar tissue
    inPlane([[-0.75, 1.38 * s], [-0.95, 1.32 * s], [-1.14, 1.16 * s], [-1.2, 0.99 * s], [-1.22, 0.8 * s], [-1.2, 0.5 * s], [-1.18, 0.24 * s]], 0.012, ART, sec, 9)
    // … and back along the pia to the nerve behind the lamina
    inPlane([[-0.75, 1.38 * s], [-0.55, 1.22 * s], [-0.3, 1.075 * s], [0.5, 1.54 * s], [2, 1.545 * s], [5, 1.545 * s]], 0.012, ART, s > 0 ? 'sector-pial' : 'other', 14)
    inPlane([[0.6, 1.54 * s], [0.75, 1.1 * s], [0.85, 0.6 * s]], 0.009, ART, s > 0 ? 'sector-pial' : 'other', 4)
    inPlane([[2.2, 1.545 * s], [2.35, 1.1 * s], [2.45, 0.55 * s]], 0.009, ART, s > 0 ? 'sector-pial' : 'other', 4)
  }

  // ---- outside the globe: the ring of short posterior ciliary arteries around the nerve
  const outer = new THREE.Group()
  group.add(outer)
  const outerMat = std({ color: ART, roughness: 0.5, ...cut })
  const outerFlow = []
  const trunks = { lat: [14.5, 2.4, -3.8], med: [14.5, 2.4, 3.8] }
  for (let k = 0; k < 14; k++) {
    const az = (k + 0.5) / 14 * Math.PI * 2
    const cy = Math.cos(az), cz = Math.sin(az) // az = 0 is straight up
    if (Math.abs(cz) < 0.2) continue //           the two in the slice plane are drawn above
    const rho = 2.75 + 0.9 * ((k * 7) % 5) / 4
    const t = cz < 0 ? trunks.lat : trunks.med
    const end = [-RE + Math.sqrt(RE * RE - rho * rho) + 0.03, rho * cy, rho * cz]
    const curve = curveOf([t, [11.5, 2.9 * cy + 0.5, 3.3 * cz], [7, 3.0 * cy, 3.0 * cz], [2, rho * cy, rho * cz], end])
    outer.add(new THREE.Mesh(tube(curve, 48, 6, 0.04), outerMat))
    const f = flow(curve, 16, 0.09, 0xffd0c2); f.mat.clippingPlanes = [clip]; outer.add(f.points); outerFlow.push(f)
  }

  const tmp = new THREE.Color()
  let painted = ''
  return {
    group, section, trunks,
    update(s, dt) {
      // slice furniture only exists once the cut is nearly through
      section.visible = s.plate > 0.01
      for (const m of plateMats) m.opacity = s.plate
      const macro = s.plate * (1 - s.micro)
      for (const b of bundles) {
        const w = b.upper ? 1 : 0
        b.mesh.morphTargetInfluences[0] = s.swelling * (b.upper ? 1 : 0.8)
        b.mesh.morphTargetInfluences[1] = s.atrophy * w
        b.mat.color.copy(HEALTHY).lerp(SWOLLEN, s.swelling * (b.upper ? 1 : 0.25)).lerp(DEAD, Math.max(s.atrophy, s.pallor, 0.35 * s.damage) * w * 0.9)
        b.mat.opacity = macro; b.mesh.visible = macro > 0.01
      }
      for (const v of vessels) {
        const sector = v.role.startsWith('sector')
        const speed = v.role === 'sector' ? s.flow : v.role === 'sector-trunk' ? lerp(s.flow, s.flowAll, 0.5) : v.role === 'sector-pial' ? lerp(s.flow, s.flowAll, 0.4) : v.role === 'cra' ? 1 : s.flowAll
        const health = smooth(0.05, 0.6, speed)
        v.mat.color.copy(v.base).multiplyScalar(sector ? 0.4 + 0.6 * health : 1); v.mat.emissive.copy(v.mat.color)
        const fine = v.role !== 'cra' && v.role !== 'crv' && !v.role.endsWith('trunk')
        v.mat.opacity = s.plate * (fine ? 1 - s.micro : 1); v.mesh.visible = v.mat.opacity > 0.01
        if (v.f) { v.f.points.visible = v.mesh.visible; v.f.advance(dt * 0.9 * speed / v.len, health); v.f.mat.opacity = v.mat.opacity }
      }
      for (const f of retinalFlow) f.advance(dt * 0.05)
      for (const f of outerFlow) f.advance(dt * 0.06 * s.flowAll, smooth(0.2, 0.9, s.flowAll))
      nflMat.sup.color.copy(NFL_OK).lerp(NFL_DEAD, s.damage); nflMat.sup.opacity = lerp(0.3, 0.22, s.damage)
      disc.visible = s.cap > 0.01; disc.material.opacity = s.cap
      disc.scale.setScalar(1 + 0.1 * s.swelling)
      const key = [s.swelling, s.pallor].map(x => x.toFixed(3)).join()
      if (disc.visible && key !== painted) { painted = key; paintDisc(dg, 512, s); discTex.needsUpdate = true }
      void tmp
    },
  }
}
