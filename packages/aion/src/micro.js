// The finest scale: two bundles of axons squeezing through neighbouring
// pores of the lamina cribrosa, the collagen beam between them, and the
// capillary that runs in the tissue between the bundles and on into the beam.
// Lengths are true to scale (millimetres; 0.001 = one micrometre).
import * as THREE from 'three'
import { MICRO, laneY, lamFront, SLICE_Z } from './anat.js'
import { curveOf, tube, smooth, lerp } from './util.js'

const UM = 0.001
const LF = MICRO.x, Y0 = MICRO.y
const X0 = LF - 0.31, X1 = LF + 0.27
const bundleR = x => lerp(0.027, 0.0125, smooth(LF - 0.06, LF + 0.02, x))
/** where organelles pile up and the axon balloons: just in front of the lamina */
const pile = x => smooth(LF - 0.115, LF - 0.05, x) * (1 - smooth(LF - 0.012, LF + 0.004, x))

export function buildMicro() {
  const group = new THREE.Group()
  const axonMat = new THREE.MeshStandardMaterial({ color: 0x8f6f22, emissive: 0x8f6f22, emissiveIntensity: 0.45, roughness: 0.5, transparent: true })
  const axons = [], cargo = []
  for (const lane of [MICRO.lane, MICRO.lane + 1]) {
    const yc = laneY(lane), toSeptum = lane === MICRO.lane ? 1 : -1
    for (let layer = 0; layer < 2; layer++) {
      const n = 12
      for (let a = 0; a < n; a++) {
        const f = (a + (layer ? 0.5 : 0)) / (n - 0.5) * 2 - 1
        const z = SLICE_Z + 0.02 - layer * 0.0034
        const path = x => yc + f * bundleR(x)
        const pts = []; for (let k = 0; k <= 34; k++) { const x = lerp(X0, X1, k / 34); pts.push([x, path(x), z]) }
        const curve = curveOf(pts)
        // swollen shape: each axon fattens, and the whole bundle spreads into the gap that holds the capillary
        const geo = tube(curve, 110, 6, 0.5 * UM, (t, p) => {
          const b = pile(p.x)
          return { scale: 1 + 2.1 * b, shift: [0, b * (f * 0.0045 + toSeptum * 0.0032), 0] }
        })
        const mesh = new THREE.Mesh(geo, axonMat)
        group.add(mesh); axons.push(mesh)
        if (layer === 0) for (let c = 0; c < 8; c++) cargo.push({ path, f, toSeptum, z: z + 0.0007, phase: Math.random(), dir: c % 3 === 0 ? -1 : 1, speed: 0.6 + 0.8 * Math.random(), pileAt: LF - 0.012 - 0.06 * Math.random() ** 1.6, x0: LF - 0.2, x1: LF + 0.2 })
      }
    }
  }
  // organelles being carried along the axons (mitochondria, vesicles)
  const cargoPos = new Float32Array(cargo.length * 3)
  const cargoGeo = new THREE.BufferGeometry(); cargoGeo.setAttribute('position', new THREE.BufferAttribute(cargoPos, 3))
  const cargoMat = new THREE.PointsMaterial({ size: 2.3 * UM, color: 0x0b6f8f, transparent: true, depthTest: false, sizeAttenuation: true })
  const cargoPts = new THREE.Points(cargoGeo, cargoMat); cargoPts.frustumCulled = false; cargoPts.renderOrder = 6
  group.add(cargoPts)

  // the capillary: 8 µm across, red cells in single file
  const capZ = SLICE_Z + 0.0185
  const capCurve = curveOf([[X0, Y0, capZ], [LF - 0.08, Y0, capZ], [LF, Y0, capZ], [X1, Y0, capZ]])
  const capMat = new THREE.MeshStandardMaterial({ color: 0xc2413a, roughness: 0.4, transparent: true, depthWrite: false })
  const capillary = new THREE.Mesh(tube(capCurve, 80, 12, 4 * UM, (t, p) => ({ scale: 1 - 0.74 * pile(p.x), shift: [0, 0, 0] })), capMat)
  capillary.renderOrder = 5
  group.add(capillary)
  const RBC = 11
  const cellGeo = new THREE.SphereGeometry(3.6 * UM, 16, 12)
  const cellMat = new THREE.MeshStandardMaterial({ color: 0xe0352b, roughness: 0.5, transparent: true })
  const cells = new THREE.InstancedMesh(cellGeo, cellMat, RBC); cells.renderOrder = 4
  group.add(cells)
  const cellX = Array.from({ length: RBC }, (_, i) => i / RBC)

  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), pos = new THREE.Vector3(), sc = new THREE.Vector3()
  return {
    group,
    anchor: { x: LF, y: Y0 },
    update(s, dt) {
      const vis = s.micro * s.plate
      group.visible = vis > 0.01
      if (!group.visible) return
      axonMat.opacity = 0.9 * vis; capMat.opacity = 0.42 * vis; cellMat.opacity = vis; cargoMat.opacity = vis
      for (const a of axons) a.morphTargetInfluences[0] = s.swelling
      capillary.morphTargetInfluences[0] = s.swelling
      // cargo: moves freely while there is energy; stalls and piles up in front of the lamina as flow fails
      cargo.forEach((c, i) => {
        c.phase = (c.phase + Math.max(0, dt) * 0.05 * c.speed * (1 - s.stasis)) % 1
        const free = lerp(c.x0, c.x1, c.dir > 0 ? c.phase : 1 - c.phase)
        const x = lerp(free, c.pileAt, s.stasis)
        const b = pile(x) * s.swelling
        cargoPos[i * 3] = x; cargoPos[i * 3 + 1] = c.path(x) + b * (c.f * 0.0045 + c.toSeptum * 0.0032) + (i % 3 - 1) * 0.0002 * (1 + 3 * b); cargoPos[i * 3 + 2] = c.z
      })
      cargoGeo.attributes.position.needsUpdate = true
      // red cells: slowed by poor flow, then held up behind the squeezed stretch
      const span = X1 - X0, gate = (LF - 0.118 - X0) / span
      for (let i = 0; i < RBC; i++) {
        let nx = cellX[i] + Math.max(0, dt) * 0.11 * s.flow
        if (s.swelling > 0.55 && cellX[i] <= gate && nx > gate - 0.02 * ((i * 5) % 4)) nx = cellX[i] // queue behind the pinch
        cellX[i] = nx % 1
        const x = X0 + cellX[i] * span
        const squeeze = 1 - 0.7 * pile(x) * s.swelling
        m.compose(pos.set(x, Y0, capZ), q, sc.set(0.42 + 0.5 * (1 - squeeze), squeeze, 1))
        cells.setMatrixAt(i, m)
      }
      cells.instanceMatrix.needsUpdate = true
    },
  }
}
