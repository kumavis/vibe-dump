// Approach B — the doctor's view. Looking through the pupil at the back of a
// right eye: optic disc on the right, macula on the left, nerve fibres arcing
// in from everywhere. An inset shows what that eye sees as fibres drop out.
import * as THREE from 'three'
import { createStage, flowDots, smooth, lerp } from './kit.js'

const R = 9                       // radius of the bowl we are looking into
const DISC = { u: 1.7, v: 0, r: 0.8 }
const FOVEA = { u: -1.5, v: 0 }

const bowl = (u, v, lift = 0) => {
  const z = -Math.sqrt(R * R - u * u - v * v)
  return new THREE.Vector3(u, v, z).multiplyScalar(1 - lift / R)
}

function fundusTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 512
  const g = c.getContext('2d')
  const bg = g.createRadialGradient(256, 256, 30, 256, 256, 360)
  bg.addColorStop(0, '#d8652c'); bg.addColorStop(0.6, '#b9481d'); bg.addColorStop(1, '#5e1d0c')
  g.fillStyle = bg; g.fillRect(0, 0, 512, 512)
  // faint choroidal mottling
  for (let i = 0; i < 900; i++) {
    g.fillStyle = `rgba(${Math.random() < 0.5 ? '255,170,90' : '70,15,5'},0.035)`
    g.beginPath(); g.arc(Math.random() * 512, Math.random() * 512, 4 + Math.random() * 14, 0, 7); g.fill()
  }
  // macula: a darker patch with the fovea at its centre (plane is 10 units wide)
  const fx = 256 + FOVEA.u * 51.2, fy = 256
  const m = g.createRadialGradient(fx, fy, 0, fx, fy, 62)
  m.addColorStop(0, 'rgba(70,14,6,0.75)'); m.addColorStop(1, 'rgba(70,14,6,0)')
  g.fillStyle = m; g.fillRect(0, 0, 512, 512)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace
  return t
}

/** The optic disc, repainted as it swells and then pales. Up on the canvas is up in the eye. */
function paintDisc(g, s) {
  const S = 256, c = S / 2, r = S * 0.36
  g.clearRect(0, 0, S, S)
  const swell = s.swelling, pale = s.pallor
  // swollen, blurred upper margin spilling past the normal edge
  if (swell > 0.01) {
    const halo = g.createRadialGradient(c, c - r * 0.25, r * 0.5, c, c - r * 0.25, r * 1.32)
    halo.addColorStop(0, `rgba(240,120,90,${0.9 * swell})`); halo.addColorStop(1, 'rgba(240,120,90,0)')
    g.fillStyle = halo; g.fillRect(0, 0, S, S)
  }
  const body = g.createRadialGradient(c, c, 0, c, c, r)
  body.addColorStop(0, '#ee9a68'); body.addColorStop(0.8, '#e17f4a'); body.addColorStop(1, '#d56a38')
  g.fillStyle = body; g.beginPath(); g.arc(c, c, r, 0, 7); g.fill()
  g.save(); g.beginPath(); g.arc(c, c, r * (1 + 0.22 * swell), 0, 7); g.clip()
  // upper half: flushed while swollen, pale afterwards
  const up = g.createLinearGradient(0, c - r, 0, c + r * 0.25)
  up.addColorStop(0, `rgba(226,84,60,${0.7 * swell * (1 - pale)})`); up.addColorStop(1, 'rgba(226,84,60,0)')
  g.fillStyle = up; g.fillRect(0, 0, S, S)
  const wash = g.createLinearGradient(0, c - r, 0, c + r * 0.2)
  wash.addColorStop(0, `rgba(248,244,230,${0.95 * pale})`); wash.addColorStop(0.7, `rgba(248,244,230,${0.9 * pale})`); wash.addColorStop(1, 'rgba(248,244,230,0)')
  g.fillStyle = wash; g.fillRect(0, 0, S, S)
  g.restore()
  // the cup: small in a "disc at risk"
  g.fillStyle = 'rgba(255,240,205,0.9)'
  g.beginPath(); g.arc(c + 3, c, r * 0.17 * (1 - 0.6 * swell), 0, 7); g.fill()
  // flame-shaped haemorrhages at the swollen margin
  const blood = swell * (1 - pale)
  if (blood > 0.01) {
    g.strokeStyle = `rgba(150,12,18,${0.85 * blood})`; g.lineCap = 'round'
    for (const [a, len, wd] of [[-2.2, 26, 7], [-1.45, 20, 6], [-0.8, 24, 7]]) {
      g.lineWidth = wd
      g.beginPath(); g.moveTo(c + Math.cos(a) * r * 0.95, c + Math.sin(a) * r * 0.95)
      g.lineTo(c + Math.cos(a) * (r + len), c + Math.sin(a) * (r + len)); g.stroke()
    }
  }
}

/** A small landscape, then fog over the lower half as the upper fibres fail. */
function paintView(g, W, H, s) {
  const sky = g.createLinearGradient(0, 0, 0, H * 0.6)
  sky.addColorStop(0, '#6fb1e6'); sky.addColorStop(1, '#d9ecf7')
  g.fillStyle = sky; g.fillRect(0, 0, W, H)
  g.fillStyle = '#fff4c2'; g.beginPath(); g.arc(W * 0.78, H * 0.2, H * 0.07, 0, 7); g.fill()
  g.fillStyle = '#7fa66b'; g.beginPath(); g.moveTo(0, H * 0.55)
  g.quadraticCurveTo(W * 0.3, H * 0.36, W * 0.6, H * 0.52); g.quadraticCurveTo(W * 0.85, H * 0.42, W, H * 0.5)
  g.lineTo(W, H); g.lineTo(0, H); g.fill()
  g.fillStyle = '#5c8f4e'; g.fillRect(0, H * 0.6, W, H * 0.4)
  g.fillStyle = '#d9c7a0'; g.beginPath(); g.moveTo(W * 0.46, H * 0.6); g.lineTo(W * 0.54, H * 0.6)
  g.lineTo(W * 0.72, H); g.lineTo(W * 0.3, H); g.fill()
  g.fillStyle = '#f3ede2'; g.fillRect(W * 0.16, H * 0.44, W * 0.2, H * 0.2)
  g.fillStyle = '#a5483a'; g.beginPath(); g.moveTo(W * 0.13, H * 0.45); g.lineTo(W * 0.26, H * 0.3); g.lineTo(W * 0.39, H * 0.45); g.fill()
  g.fillStyle = '#4b3a2c'; g.fillRect(W * 0.24, H * 0.54, W * 0.04, H * 0.1)
  g.fillStyle = '#3f6f3a'; g.beginPath(); g.arc(W * 0.8, H * 0.52, H * 0.13, 0, 7); g.fill()
  g.fillStyle = '#5a4030'; g.fillRect(W * 0.79, H * 0.6, W * 0.02, H * 0.12)
  if (s.damage > 0.01) {
    const fog = g.createLinearGradient(0, H * 0.42, 0, H * 0.58)
    fog.addColorStop(0, 'rgba(72,74,84,0)'); fog.addColorStop(1, `rgba(72,74,84,${0.93 * s.damage})`)
    g.fillStyle = fog; g.fillRect(0, H * 0.42, W, H * 0.58)
  }
}

export function createFundus(el) {
  const stage = createStage(el, { fov: 44, minAspect: 1.35, bg: 0x050608 })
  const { scene, camera } = stage
  camera.position.set(0, 0, 0)

  // the retina: a plane bent into the bowl so the texture maps simply
  const plane = new THREE.RingGeometry(0.001, 5, 72, 24) // round, like the view through a pupil
  const pp = plane.attributes.position
  for (let i = 0; i < pp.count; i++) pp.setZ(i, -Math.sqrt(R * R - pp.getX(i) ** 2 - pp.getY(i) ** 2))
  scene.add(new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ map: fundusTexture() })))

  // nerve fibre layer. beta = angle around the disc, 0 pointing at the macula.
  const fibreMat = { sup: null, inf: null }
  const HEALTHY = new THREE.Color(0xffe9a8), DEAD = new THREE.Color(0x4c5262)
  for (const half of ['sup', 'inf']) {
    const sign = half === 'sup' ? 1 : -1
    const m = fibreMat[half] = new THREE.MeshBasicMaterial({ color: HEALTHY, transparent: true, opacity: 0.3, depthWrite: false })
    const N = 44
    for (let i = 0; i < N; i++) {
      const beta = 0.06 + (i / (N - 1)) * (Math.PI - 0.1)
      const p0 = new THREE.Vector2(DISC.u - Math.cos(beta) * DISC.r, Math.sin(beta) * DISC.r)
      const dir = new THREE.Vector2(-Math.cos(beta), Math.sin(beta))
      let p1, p2
      if (beta < 0.3) { //                 straight to the macula
        p2 = new THREE.Vector2(FOVEA.u + 0.3, 0.05 + beta * 0.5); p1 = p0.clone().lerp(p2, 0.5)
      } else if (beta < 1.25) { //          arc over the macula, ending on the midline
        const k = (beta - 0.3) / 0.95
        p2 = new THREE.Vector2(FOVEA.u - 0.35 - 2.8 * k, 0.04)
        p1 = new THREE.Vector2((p0.x + p2.x) / 2 + 0.4, 0.75 + 2.6 * k)
      } else if (beta < 2.05) { //          sweep out to the edge
        const k = (beta - 1.25) / 0.8
        p2 = new THREE.Vector2(lerp(-4.7, 0.2, k), lerp(1.2, 4.7, k))
        p1 = p0.clone().addScaledVector(dir, 1.6).add(new THREE.Vector2(-1.2 * (1 - k), 1.5))
      } else { //                           straight out on the nose side
        p2 = p0.clone().addScaledVector(dir, 4.2); p1 = p0.clone().lerp(p2, 0.5)
      }
      const q = new THREE.QuadraticBezierCurve(p0, p1, p2)
      const pts = q.getPoints(24).filter(p => p.length() < 4.9).map(p => bowl(p.x, p.y * sign, 0.03))
      if (pts.length < 4) continue
      scene.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.014, 4, false), m))
    }
  }

  // retinal vessels: four arcades, artery + vein each, with a couple of twigs
  const flows = []
  const vessel = (pts, radius, color, withFlow) => {
    const inside = pts.filter(([u, v]) => Math.hypot(u, v) < 4.9)
    if (inside.length < 2) return
    const curve = new THREE.CatmullRomCurve3(inside.map(([u, v]) => bowl(u, v, 0.06)))
    scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 48, radius, 6, false), new THREE.MeshBasicMaterial({ color })))
    if (withFlow) { const f = flowDots(curve, 10, { size: 0.09, color: 0xffb09a }); scene.add(f.points); flows.push(f) }
  }
  const D = DISC.u
  const arcades = [
    [[D - 0.05, 0.1], [D - 0.3, 1.0], [D - 1.3, 2.1], [-1.4, 2.5], [-3.2, 2.0], [-4.6, 1.2]],
    [[D + 0.1, 0.1], [D + 0.45, 1.0], [D + 1.2, 1.9], [D + 2.2, 2.6], [4.3, 3.0]],
  ]
  for (const sign of [1, -1]) for (const a of arcades) {
    const art = a.map(([u, v]) => [u, v * sign])
    const vein = a.map(([u, v], i) => [u + 0.06 + i * 0.05, (v + i * 0.09) * sign])
    vessel(art, 0.034, 0xd23a2e, true)
    vessel(vein, 0.046, 0x7c1620, false)
    const [bu, bv] = art[3]
    vessel([[bu, bv], [bu - 0.2, bv + 0.8 * sign], [bu - 0.6, bv + 1.7 * sign]], 0.022, 0xd23a2e, false)
  }

  // optic disc
  const dc = document.createElement('canvas'); dc.width = dc.height = 256
  const dg = dc.getContext('2d')
  const dtex = new THREE.CanvasTexture(dc); dtex.colorSpace = THREE.SRGBColorSpace
  const disc = new THREE.Mesh(new THREE.PlaneGeometry(DISC.r / 0.36, DISC.r / 0.36),
    new THREE.MeshBasicMaterial({ map: dtex, transparent: true, depthWrite: false }))
  disc.position.copy(bowl(DISC.u, DISC.v, 0.1)); disc.lookAt(0, 0, 0); disc.renderOrder = 3
  scene.add(disc)

  // inset: what this eye sees
  const inset = document.createElement('figure')
  inset.className = 'inset'
  inset.innerHTML = '<canvas width="320" height="200"></canvas><figcaption>What this eye sees</figcaption>'
  el.appendChild(inset)
  const vg = inset.querySelector('canvas').getContext('2d')

  const L = (t, u, v, cls) => stage.addLabel(t, bowl(u, v, 0.1), cls)
  L('Optic disc', DISC.u + 0.2, -1.2)
  L('Macula — sharp central vision', FOVEA.u, -0.6)
  L('Nerve fibres', -2.4, 2.9, 'soft')
  L('Artery and vein', 3.9, -2.45, 'soft')
  const lost = L('These upper fibres carry the lower half of the view', -1.7, 1.75, 'alert')
  const small = L('Small cup: a crowded disc', DISC.u + 0.2, 1.2, 'hint')

  // gentle parallax so the bowl reads as 3-D
  const look = { x: 0, y: 0, tx: 0, ty: 0 }
  el.addEventListener('pointermove', e => {
    const b = el.getBoundingClientRect()
    look.tx = ((e.clientX - b.left) / b.width - 0.5) * 0.22
    look.ty = ((e.clientY - b.top) / b.height - 0.5) * 0.16
  })

  let painted = ''
  return {
    id: 'fundus',
    frame(s, dt, time) {
      look.x += (look.tx - look.x) * 0.08; look.y += (look.ty - look.y) * 0.08
      camera.rotation.set(-look.y, -look.x + Math.sin(time * 0.3) * 0.012, 0)
      const key = [s.swelling, s.pallor, s.damage].map(x => x.toFixed(3)).join()
      if (key !== painted) {
        painted = key
        paintDisc(dg, s); dtex.needsUpdate = true
        paintView(vg, 320, 200, s)
      }
      disc.scale.setScalar(1 + 0.14 * s.swelling)
      const pulse = s.damage > 0.02 && s.damage < 0.98 ? 0.25 * Math.sin(time * 6) : 0
      fibreMat.sup.color.copy(HEALTHY).lerp(DEAD, s.damage)
      fibreMat.sup.opacity = lerp(0.3, 0.24, s.damage) + pulse * 0.3
      for (const f of flows) f.advance(dt * 0.06)
      lost.opacity = s.damage
      small.opacity = s.crowd
      stage.render()
    },
  }
}
