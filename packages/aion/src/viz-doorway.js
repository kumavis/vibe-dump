// Approach C — the crowded doorway. A schematic, not anatomy: the same bundle
// of fibres passing through a roomy opening and a tight one, run through the
// same dip in blood flow side by side.
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { createStage, smooth } from './kit.js'

const N = 54, RF = 0.105, LEN = 3.4
const HEALTHY = new THREE.Color(0xf0d79a), STRESSED = new THREE.Color(0xff7d66), DEAD = new THREE.Color(0x6a6f7d)
const BLOOD = new THREE.Color(0xff4a40), STALLED = new THREE.Color(0x4a1a22)

function buildDoorway(scene, { x, ring, cup, tight }) {
  const g = new THREE.Group()
  g.position.x = x
  g.rotation.x = 1.12
  scene.add(g)

  const torus = new THREE.TorusGeometry(ring, 0.17, 16, 64)
  torus.rotateX(Math.PI / 2)
  g.add(new THREE.Mesh(torus, new THREE.MeshStandardMaterial({ color: 0xece7db, roughness: 0.6 })))

  const fibres = new THREE.InstancedMesh(new THREE.CylinderGeometry(RF, RF, LEN, 10),
    new THREE.MeshStandardMaterial({ roughness: 0.6 }), N)
  // a spindle around each fibre that fattens where it passes the ring
  const bulges = new THREE.InstancedMesh(new THREE.SphereGeometry(RF, 12, 10),
    new THREE.MeshStandardMaterial({ roughness: 0.6 }), N)
  g.add(fibres, bulges)
  const spots = []
  const rmax = ring - 0.17 - RF
  for (let i = 0; i < N; i++) {
    const r = Math.sqrt(cup * cup + ((i + 0.5) / N) * (rmax * rmax - cup * cup))
    const a = i * 2.39996
    const px = r * Math.cos(a), pz = r * Math.sin(a)
    spots.push({ px, pz, w: tight ? smooth(-0.1, 0.35, -pz / rmax) : 0 }) // far side of the tight ring fails
  }

  // capillaries threading between the fibres, with beads of blood
  const CAPS = 8, BEADS = 7
  const caps = []
  const capMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.045, 0.045, LEN + 1.1, 6),
    new THREE.MeshStandardMaterial({ roughness: 0.5 }), CAPS)
  const beads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.08, 8, 6), new THREE.MeshBasicMaterial(), CAPS * BEADS)
  g.add(capMesh, beads)
  const m = new THREE.Matrix4()
  for (let i = 0; i < CAPS; i++) {
    const a = (i + 0.5) / CAPS * Math.PI * 2, r = (cup + rmax) / 2 + (i % 2 ? 0.12 : -0.12)
    const px = r * Math.cos(a), pz = r * Math.sin(a)
    caps.push({ px, pz, phase: Math.random(), w: tight ? smooth(-0.1, 0.35, -pz / rmax) : 0 })
    capMesh.setMatrixAt(i, m.makeTranslation(px, 0, pz))
  }

  const q = new THREE.Quaternion(), sc = new THREE.Vector3(), pos = new THREE.Vector3(), col = new THREE.Color()
  return {
    group: g, ring, tight,
    update(s, dt) {
      for (let i = 0; i < N; i++) {
        const f = spots[i]
        // a roomy opening swells a little and recovers; a tight one jams
        const swell = tight ? s.swelling * (0.45 + 0.55 * f.w) : s.swelling * 0.4
        const k = 1 + (tight ? 0.38 : 0.3) * swell
        fibres.setMatrixAt(i, m.makeTranslation(f.px, 0, f.pz))
        bulges.setMatrixAt(i, m.compose(pos.set(f.px, 0, f.pz), q, sc.set(k, 7, k)))
        col.copy(HEALTHY).lerp(STRESSED, swell * (tight ? 1 : 0.35) * (1 - s.damage * f.w * 0.7)).lerp(DEAD, s.damage * f.w)
        fibres.setColorAt(i, col); bulges.setColorAt(i, col)
      }
      for (let i = 0; i < CAPS; i++) {
        const c = caps[i]
        const speed = tight ? s.flowAll + (s.flow - s.flowAll) * c.w : s.flowAll * (1 - 0.15 * s.swelling)
        const health = smooth(0.05, 0.6, speed)
        c.phase = (c.phase + dt * 0.22 * speed) % 1
        capMesh.setColorAt(i, col.copy(STALLED).lerp(BLOOD, health).multiplyScalar(0.7))
        for (let b = 0; b < BEADS; b++) {
          const y = (((b / BEADS + c.phase) % 1) - 0.5) * (LEN + 1.1)
          beads.setMatrixAt(i * BEADS + b, m.makeTranslation(c.px, y, c.pz))
          beads.setColorAt(i * BEADS + b, col.copy(STALLED).lerp(BLOOD, health))
        }
      }
      for (const im of [fibres, bulges, capMesh, beads]) {
        im.instanceMatrix.needsUpdate = true
        if (im.instanceColor) im.instanceColor.needsUpdate = true
      }
    },
  }
}

export function createDoorway(el) {
  const stage = createStage(el, { fov: 34, minAspect: 1.5, bg: 0x10131b })
  const { scene, camera, renderer } = stage
  camera.position.set(0, 1.2, 13.5)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, -0.1, 0)
  controls.enablePan = false; controls.enableDamping = true
  controls.minDistance = 6; controls.maxDistance = 20
  controls.update()

  scene.add(new THREE.AmbientLight(0xffffff, 0.8))
  const key = new THREE.DirectionalLight(0xffffff, 1.7); key.position.set(2, 6, 8); scene.add(key)

  const roomy = buildDoorway(scene, { x: -2.7, ring: 1.6, cup: 0.62, tight: false })
  const tight = buildDoorway(scene, { x: 2.7, ring: 1.14, cup: 0.08, tight: true })

  const L = (t, x, y, cls) => stage.addLabel(t, new THREE.Vector3(x, y, 0), cls)
  L('A disc with room to spare', -2.7, 3.0, 'title')
  L('A crowded disc — “disc at risk”', 2.7, 3.0, 'title')
  L('Rigid opening in the wall of the eye', -5.9, -1.3, 'soft')
  L('Nerve fibres', -1.2, -2.6, 'soft')
  L('Capillaries', 4.5, -2.4, 'soft')
  const fine = L('Swells a little, flow recovers', -2.7, -3.1, 'hint')
  const jam = L('No room: swelling shuts the capillaries', 2.7, -3.1, 'alert')

  // the vicious circle, spelt out
  const loop = document.createElement('div')
  loop.className = 'loop'
  loop.innerHTML = '<span data-k="flow">less blood</span>→<span data-k="swell">fibres swell</span>→<span data-k="squeeze">vessels squeezed</span>↻'
  el.appendChild(loop)
  const chips = Object.fromEntries([...loop.querySelectorAll('span')].map(c => [c.dataset.k, c]))

  return {
    id: 'doorway',
    frame(s, dt) {
      controls.update()
      roomy.update(s, dt); tight.update(s, dt)
      fine.opacity = s.swelling
      jam.opacity = Math.max(s.swelling, s.damage * (1 - s.pallor))
      const active = s.u > 2 && s.u < 5
      loop.style.opacity = active ? 1 : 0.25
      chips.flow.classList.toggle('on', active && s.flow < 0.8)
      chips.swell.classList.toggle('on', active && s.swelling > 0.15)
      chips.squeeze.classList.toggle('on', active && s.flow < 0.45)
      stage.render()
    },
  }
}
