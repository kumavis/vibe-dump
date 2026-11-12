// Approach D — the whole head. A stylised head turns to glass, showing the
// eyes and the route the picture takes: optic nerves, the crossing (chiasm),
// and on to the visual cortex at the back of the brain. Signals from the
// affected eye thin out as its fibres fail.
//
// Head space: x to the person's left, y up, z out of the face. The affected
// eye is the person's right one (x < 0), matching the doctor's-view panel.
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { createStage, flowDots, smooth, lerp } from './kit.js'
import { createVisionInset } from './vision.js'

const S = 2.7 // head scale
const SKIN = new THREE.Color(0xcdb9a6), GLASS = new THREE.Color(0x9fb4d8)
const V = (x, y, z) => new THREE.Vector3(x * S, y * S, z * S)
const EYE = { x: 0.272, y: 0.084, z: 0.745, r: 0.118 }

function headGeometry() {
  const g = new THREE.SphereGeometry(1, 72, 56)
  const p = g.attributes.position
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i)
    const k = smooth(0.1, -0.9, y) //                 0 at the temples, 1 at the chin
    let px = x * 0.8 * (1 - 0.27 * k)
    let py = y * (y < 0 ? 1.16 : 1.05)
    let pz = z * 0.95 * (1 - (z < 0 ? 0.3 : 0.1) * k)
    if (z > 0) {
      pz += 0.17 * Math.exp(-((x / 0.13) ** 2 + ((y + 0.14) / 0.2) ** 2)) //            nose
      pz -= 0.06 * Math.exp(-(((Math.abs(x) - 0.34) / 0.14) ** 2 + ((y - 0.08) / 0.1) ** 2)) // eye sockets
      pz += 0.035 * Math.exp(-((x / 0.3) ** 2 + ((y - 0.24) / 0.07) ** 2)) //           brow
    }
    p.setXYZ(i, px * S, py * S, pz * S)
  }
  g.computeVertexNormals()
  return g
}

export function createHead(el) {
  const stage = createStage(el, { fov: 30, minAspect: 0.85, bg: 0x0b0e14 })
  const { scene, camera, renderer } = stage
  camera.position.set(0, 0.4, 15.5)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, -0.2, 0)
  controls.enablePan = false; controls.enableDamping = true
  controls.minDistance = 5; controls.maxDistance = 24
  controls.update()

  scene.add(new THREE.AmbientLight(0xffffff, 0.7))
  const key = new THREE.DirectionalLight(0xffffff, 1.8); key.position.set(3, 5, 8); scene.add(key)
  const rim = new THREE.DirectionalLight(0x9fb8ff, 0.9); rim.position.set(-5, 2, -6); scene.add(rim)

  const head = new THREE.Group()
  scene.add(head)

  // --- skin. Drawn in two passes (depth first, then colour) so that when it
  // goes transparent you see one clean glass surface, not its own back faces.
  const skin = new THREE.MeshStandardMaterial({ color: 0xcdb9a6, roughness: 0.65, transparent: true })
  const depth = new THREE.MeshBasicMaterial({ colorWrite: false, transparent: true })
  const skinParts = []
  const addSkin = (geo, at) => {
    for (const [m, order] of [[depth, 5], [skin, 6]]) {
      const mesh = new THREE.Mesh(geo, m)
      mesh.renderOrder = order
      if (at) mesh.position.copy(at)
      head.add(mesh); skinParts.push(mesh)
    }
  }
  addSkin(headGeometry())
  addSkin(new THREE.CylinderGeometry(0.4 * S, 0.46 * S, 0.9 * S, 32), V(0, -1.3, -0.12))
  for (const side of [-1, 1]) {
    const ear = new THREE.SphereGeometry(S, 20, 16); ear.scale(0.07, 0.2, 0.12)
    addSkin(ear, V(side * 0.79, 0, -0.05))
  }

  // --- a faint brain, for context once the head is glass
  const brainGeo = new THREE.SphereGeometry(S, 40, 32); brainGeo.scale(0.66, 0.6, 0.8)
  const brain = new THREE.Mesh(brainGeo, new THREE.MeshStandardMaterial({ color: 0xd8a0a8, transparent: true, opacity: 0, depthWrite: false, roughness: 0.9 }))
  brain.position.copy(V(0, 0.34, -0.1)); brain.renderOrder = 1
  head.add(brain)

  // --- eyes
  for (const side of [-1, 1]) {
    const eye = new THREE.Group()
    eye.position.copy(V(side * EYE.x, EYE.y, EYE.z))
    eye.add(new THREE.Mesh(new THREE.SphereGeometry(EYE.r * S, 32, 24), new THREE.MeshStandardMaterial({ color: 0xf4f1ea, roughness: 0.35 })))
    const iris = new THREE.Mesh(new THREE.SphereGeometry(EYE.r * S * 0.52, 24, 16), new THREE.MeshStandardMaterial({ color: 0x4a6b8a, roughness: 0.3 }))
    iris.position.z = EYE.r * S * 0.7; iris.scale.z = 0.62
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(EYE.r * S * 0.24, 16, 12), new THREE.MeshBasicMaterial({ color: 0x08080a }))
    pupil.position.z = EYE.r * S * 0.94; pupil.scale.z = 0.45
    eye.add(iris, pupil)
    head.add(eye)
  }

  // --- the visual pathway
  const back = side => [side * EYE.x, EYE.y, EYE.z - EYE.r * 0.96]
  const nervePts = side => [back(side), [side * 0.2, 0.07, 0.44], [side * 0.09, 0.06, 0.25], [side * 0.02, 0.055, 0.15]]
  const tractPts = side => [[side * 0.02, 0.055, 0.13], [side * 0.1, 0.055, 0.03], [side * 0.25, 0.07, -0.14], [side * 0.31, 0.13, -0.45], [side * 0.14, 0.17, -0.8]]
  const curve = pts => new THREE.CatmullRomCurve3(pts.map(p => V(...p)))
  const NERVE = new THREE.Color(0xf2d58a), FADED = new THREE.Color(0x767b8c)
  const nerveMat = {}
  for (const side of [-1, 1]) {
    nerveMat[side] = new THREE.MeshStandardMaterial({ color: NERVE, roughness: 0.5, emissive: 0x3a2c08 })
    head.add(new THREE.Mesh(new THREE.TubeGeometry(curve(nervePts(side)), 32, 0.03 * S, 10, false), nerveMat[side]))
    head.add(new THREE.Mesh(new THREE.TubeGeometry(curve(tractPts(side)), 48, 0.026 * S, 10, false),
      new THREE.MeshStandardMaterial({ color: 0xd9bf80, roughness: 0.5, emissive: 0x2a2006 })))
    const cortex = new THREE.Mesh(new THREE.SphereGeometry(0.11 * S, 20, 16), new THREE.MeshStandardMaterial({ color: 0xe79aa6, roughness: 0.7 }))
    cortex.position.copy(V(side * 0.14, 0.2, -0.84)); cortex.scale.set(1, 1.2, 0.7)
    head.add(cortex)
  }
  // signals: each eye sends fibres to both sides of the brain
  const signals = []
  for (const eyeSide of [-1, 1]) for (const brainSide of [-1, 1]) {
    const f = flowDots(curve([...nervePts(eyeSide), ...tractPts(brainSide)]), 9, { size: 0.16, color: eyeSide < 0 ? 0xffd27a : 0x9fe0ff })
    f.points.renderOrder = 3; f.points.material.depthTest = false
    head.add(f.points)
    signals.push({ f, affected: eyeSide < 0 })
  }
  // where it happens: the nerve head at the back of the affected eye
  const spot = new THREE.Mesh(new THREE.SphereGeometry(0.045 * S, 20, 16),
    new THREE.MeshStandardMaterial({ color: 0xff5a4d, emissive: 0xff2a1a, emissiveIntensity: 1.2, transparent: true, opacity: 0, depthWrite: false }))
  spot.position.copy(V(...back(-1))); spot.renderOrder = 4
  head.add(spot)

  // --- labels ride on the head
  const L = (t, x, y, z, cls) => stage.addLabel(t, V(x, y, z), cls, head)
  const inner = [
    L('Affected eye', -0.3, 0.08, 1.02),
    L('Optic nerves', 0.36, 0.07, 0.4),
    L('Chiasm — the nerves cross', 0.3, 0.06, 0.1),
    L('Visual cortex — where you see', 0, 0.2, -1.05),
  ]
  const here = L('NAION happens here: where the nerve leaves the eye', -0.98, 0.05, 0.5, 'alert')

  const vision = createVisionInset(el, 'What the affected eye sees')

  return {
    id: 'head',
    frame(s, dt, time) {
      controls.update()
      const glass = smooth(0.1, 0.6, s.u) //   skin fades during the first step
      const turn = smooth(0.35, 1.1, s.u) //   then the head tips to show the route from above
      skin.opacity = lerp(1, 0.22, glass)
      skin.color.copy(SKIN).lerp(GLASS, glass)
      skin.emissive.setScalar(0.06 * glass)
      skin.depthWrite = glass < 0.02
      brain.material.opacity = 0.16 * glass
      head.rotation.set(lerp(0.05, 0.85, turn), lerp(0.4, 0.3, turn) + Math.sin(time * 0.25) * 0.04, 0)
      head.updateMatrixWorld()

      nerveMat[-1].color.copy(NERVE).lerp(FADED, 0.6 * s.damage)
      for (const sig of signals) sig.f.advance(dt * 0.16, sig.affected ? 1 - 0.75 * s.damage : 1)
      const hot = Math.max(smooth(2, 2.6, s.u) * (1 - s.pallor), 0)
      spot.material.opacity = hot * (0.75 + 0.25 * Math.sin(time * 5))
      spot.scale.setScalar(1 + 0.9 * s.swelling)
      for (const l of inner) l.opacity = smooth(0.6, 1, glass)
      here.opacity = Math.max(hot, s.damage)
      vision.update(s)
      stage.render()
    },
  }
}
