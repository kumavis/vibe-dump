// Approach A — anatomical cutaway. The back of the eye sliced in half, with
// the optic nerve leaving to the right. x runs along the nerve (x<0 is inside
// the eye), y is up, and the slice face is z = 0 with the kept half behind it.
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { createStage, flowDots, smooth } from './kit.js'

const R = 6          // outer radius of the eye wall
const RC = 0.85      // radius of the scleral canal
const LAYERS = [     // [inner, outer, colour] — drawn on the slice face
  [R - 0.32, R, 0xe9e4d8],          // sclera
  [R - 0.47, R - 0.32, 0x7a2a22],   // choroid
  [R - 0.62, R - 0.47, 0xd9783f],   // retina
]
const CAP = 1.05     // how far the wall extends, in radians from the nerve axis
const HOLE = Math.asin(RC / R)

const HEALTHY = new THREE.Color(0xf0d79a)
const SWOLLEN = new THREE.Color(0xff8f78)
const DEAD = new THREE.Color(0x6f7482)

export function createCutaway(el) {
  const stage = createStage(el, { fov: 34, minAspect: 1.45 })
  const { scene, camera, renderer } = stage
  camera.position.set(-3.2, 2.4, 14)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0.5, 0, -0.3)
  controls.enablePan = false
  controls.enableDamping = true
  controls.minDistance = 5
  controls.maxDistance = 18
  controls.minAzimuthAngle = -1.1; controls.maxAzimuthAngle = 1.1
  controls.update()

  scene.add(new THREE.AmbientLight(0xffffff, 0.75))
  const key = new THREE.DirectionalLight(0xffffff, 1.6)
  key.position.set(3, 5, 8)
  scene.add(key)

  const eye = new THREE.Group()
  scene.add(eye)
  const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.75, side: THREE.DoubleSide, ...extra })

  // --- eye wall: curved surfaces behind the slice, flat layers on the slice face
  const shell = (radius, color) => {
    const g = new THREE.SphereGeometry(radius, 48, 24, Math.PI, Math.PI, HOLE * R / radius, CAP - HOLE)
    g.rotateZ(-Math.PI / 2); g.translate(-R, 0, 0)
    eye.add(new THREE.Mesh(g, mat(color)))
  }
  shell(R, 0xe9e4d8)
  shell(R - 0.62, 0xc9652f)
  for (const [inner, outer, color] of LAYERS) {
    for (const sign of [1, -1]) {
      const a0 = Math.asin(RC / outer)
      const g = new THREE.RingGeometry(inner, outer, 40, 1, sign > 0 ? a0 : -CAP, CAP - a0)
      g.translate(-R, 0, 0)
      eye.add(new THREE.Mesh(g, mat(color)))
    }
  }

  // --- optic nerve behind the eye: an open half-pipe so the fibres show
  const halfPipe = (radius, x0, x1, color, extra) => {
    const g = new THREE.CylinderGeometry(radius, radius, x1 - x0, 32, 1, true, Math.PI / 2, Math.PI)
    g.rotateZ(-Math.PI / 2); g.translate((x0 + x1) / 2, 0, 0)
    const m = new THREE.Mesh(g, mat(color, extra))
    eye.add(m)
    return m
  }
  halfPipe(1.3, 0.05, 6, 0x3b3340)
  halfPipe(1.62, 0.05, 6, 0x8f97a8, { transparent: true, opacity: 0.55 })
  // lamina cribrosa — the sieve the fibres pass through
  const lam = new THREE.CircleGeometry(RC, 32, -Math.PI / 2, Math.PI)
  lam.rotateY(Math.PI / 2); lam.translate(0, 0, 0)
  eye.add(new THREE.Mesh(lam, mat(0xcdbf9f, { transparent: true, opacity: 0.55 })))

  // --- nerve fibres: over the retina, down through the canal, out the nerve
  const fibres = []
  const AZ = 13, LANES = 4
  for (let a = 0; a < AZ; a++) {
    const az = Math.PI + (a / (AZ - 1)) * Math.PI
    for (let l = 0; l < LANES; l++) {
      const rc = RC * (0.26 + 0.2 * l) + (a % 2) * 0.03
      const rf = R - 0.66 - l * 0.045
      const pts2 = []
      for (const th of [1.0, 0.74, 0.52, 0.34, 0.24]) pts2.push([rf * Math.sin(th), -R + rf * Math.cos(th)])
      pts2.push([rc + 0.32, -0.7 - l * 0.02], [rc + 0.07, -0.5], [rc, -0.2], [rc, 0.1], [rc * 1.35, 0.7], [rc * 1.42, 2.2], [rc * 1.42, 6])
      const curve = new THREE.CatmullRomCurve3(pts2.map(([rho, x]) => new THREE.Vector3(x, rho * Math.cos(az), rho * Math.sin(az))))
      const TS = 64, RS = 6
      const geo = new THREE.TubeGeometry(curve, TS, 0.062, RS, false)
      // morph target: the same tube, fattened where it squeezes through the canal
      const base = geo.attributes.position
      const fat = new Float32Array(base.count * 3)
      const c = new THREE.Vector3(), p = new THREE.Vector3()
      for (let i = 0; i <= TS; i++) {
        curve.getPointAt(i / TS, c)
        const bump = smooth(-1.1, -0.55, c.x) * (1 - smooth(-0.05, 0.3, c.x))
        for (let j = 0; j <= RS; j++) {
          const k = i * (RS + 1) + j
          p.fromBufferAttribute(base, k).sub(c).multiplyScalar(1 + 1.1 * bump).add(c)
          p.x -= 0.16 * bump // swollen tissue heaps up into the eye
          fat[k * 3] = p.x; fat[k * 3 + 1] = p.y; fat[k * 3 + 2] = p.z
        }
      }
      geo.morphAttributes.position = [new THREE.BufferAttribute(fat, 3)]
      const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: HEALTHY, roughness: 0.6 }))
      eye.add(mesh)
      fibres.push({ mesh, w: smooth(-0.05, 0.45, Math.cos(az)) }) // upper sector is the one that fails
    }
  }

  // --- vessels
  const P = (x, rho, az) => new THREE.Vector3(x, rho * Math.cos(az), rho * Math.sin(az) - 0.06)
  const vessels = []
  const addVessel = (pts, radius, color, dots, role) => {
    const curve = new THREE.CatmullRomCurve3(pts)
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, radius, 8, false),
      new THREE.MeshStandardMaterial({ color, roughness: 0.5 }))
    eye.add(tube)
    const flow = flowDots(curve, dots, { size: radius * 3.2, color: 0xffb3a6 })
    flow.points.renderOrder = 2; flow.points.material.depthTest = false
    eye.add(flow.points)
    vessels.push({ tube, flow, role, base: new THREE.Color(color) })
  }
  // short posterior ciliary arteries: along the outside of the nerve, through
  // the sclera beside it, then a twig into the nerve head
  for (const az of [2 * Math.PI, 1.72 * Math.PI, 1.28 * Math.PI, Math.PI]) {
    addVessel([P(6, 2.5, az), P(3, 2.2, az), P(1, 1.95, az), P(0.25, 1.6, az), P(-0.22, 1.3, az),
      P(-0.36, 1.0, az), P(-0.34, 0.7, az), P(-0.3, 0.42, az)], 0.06, 0xd8413a, 14, Math.cos(az) > 0 ? 'sector' : 'spca')
  }
  // central retinal artery: up the middle of the nerve, branching over the retina
  const rr = R - 0.72
  for (const az of [2 * Math.PI, Math.PI]) {
    addVessel([P(6, 0.02, az), P(2, 0.02, az), P(-0.4, 0.03, az), P(-0.74, 0.2, az),
      ...[0.1, 0.25, 0.45, 0.7, 0.98].map(th => P(-R + rr * Math.cos(th), rr * Math.sin(th), az))], 0.05, 0xb5303a, 16, 'cra')
  }

  // --- labels
  const L = (t, x, y, z = 0, cls) => stage.addLabel(t, new THREE.Vector3(x, y, z), cls)
  L('Inside the eye', -3.4, -1.3, -2, 'soft')
  L('Retina', -2.6, 3.9)
  L('White wall of the eye (sclera)', -0.4, -4.4)
  L('Optic disc', -1.25, 0)
  L('Optic nerve → brain', 4.3, -0.55)
  L('Short posterior ciliary artery', 3.4, 2.75)
  L('Central retinal artery', 3.2, 0.3)
  const sector = L('Starved part of the disc', -1.5, 1.0, 0, 'alert')
  const cramped = L('Tight opening — no spare room', 0.5, -1.25, 0, 'hint')

  const tmp = new THREE.Color()
  const night = new THREE.Color(0x0a1230), day = new THREE.Color(0x0b0e14)
  return {
    id: 'cutaway',
    frame(s, dt) {
      controls.update()
      renderer.setClearColor(tmp.copy(day).lerp(night, s.night))
      for (const f of fibres) {
        f.mesh.morphTargetInfluences[0] = s.swelling * (0.25 + 0.75 * f.w)
        f.mesh.material.color.copy(HEALTHY).lerp(SWOLLEN, s.swelling * f.w * (1 - s.damage * 0.6)).lerp(DEAD, s.damage * f.w)
      }
      for (const v of vessels) {
        const speed = v.role === 'sector' ? s.flow : v.role === 'spca' ? s.flowAll : 0.9
        v.flow.advance(dt * 0.11 * speed, smooth(0.05, 0.6, speed))
        v.tube.material.color.copy(v.base).multiplyScalar(0.45 + 0.55 * smooth(0.05, 0.7, speed))
      }
      sector.opacity = s.damage
      cramped.opacity = Math.max(s.crowd, s.swelling * (1 - s.pallor))
      stage.render()
    },
  }
}
