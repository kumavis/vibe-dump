// The units on screen (ENGINEERING.md §7 "Units"): every ship kit as one
// instanced hull (Pearl Harbor's ninety-odd ships instance per kit) with its
// turrets as instanced meshes turned to their bearings, every aircraft kit
// as an instanced body and propeller, the national marking per instance from
// the one atlas. Instance matrices are written each frame from the sim's
// typed arrays relative to an origin near the camera (ENGINEERING §2), and
// the materials keep a minimum size on screen (3 px of span for aircraft, a
// few pixels of length for ships, so a column reads at 30 km as its
// silhouette). Fragments under the sea are discarded by the material, so a
// sinking ship goes under the surface as the sim lowers it.

import * as THREE from 'three'
import { shipGeometry, aircraftGeometry, insigniaRects } from '../kits/index.js'
import { mergeGeometries } from '../kits/builder.js'
import { shipMaterial, aircraftMaterial, setPixelScale } from './materials.js'

const M = new THREE.Matrix4()
const T = new THREE.Matrix4()
const Q = new THREE.Quaternion()
const P = new THREE.Vector3()
const S1 = new THREE.Vector3(1, 1, 1)

function instanced(geo, mat, n, extra = {}) {
  const mesh = new THREE.InstancedMesh(geo, mat, Math.max(1, n))
  mesh.count = 0
  mesh.frustumCulled = false
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  const st = new THREE.InstancedBufferAttribute(new Float32Array(Math.max(1, n) * 4), 4)
  st.setUsage(THREE.DynamicDrawUsage)
  geo.setAttribute('aState', st)
  for (const [k, v] of Object.entries(extra)) geo.setAttribute(k, v)
  mesh.userData.state = st
  return mesh
}

export class UnitRenderer {
  /**
   * light: the shared light bag; sim: for kits, capacities and state;
   * colourDate: the battle's day (paint schemes and markings by date).
   */
  constructor(light, sim, { colourDate, weapons, atlas }) {
    this.sim = sim
    this.group = new THREE.Group()
    this.group.name = 'units'
    this.materials = []
    this.kits = [] // per sim kit index: { kind, hull, turrets: [{ mesh, at, rest, battery, j }], body, prop }
    this.atlas = atlas
    this.rects = insigniaRects()
    this.colourDate = colourDate
    this.weapons = weapons
    this.light = light
    this.pending = sim.kits.map((_, k) => k)
    this.origin = new THREE.Vector3()
  }

  /** Build a few kits (the box loads a few per frame); returns true when all are built. */
  buildSome(n = 2) {
    while (n-- > 0 && this.pending.length) this.buildKit(this.pending.shift())
    return this.pending.length === 0
  }

  get ready() {
    return this.pending.length === 0
  }

  buildKit(k) {
    const entry = this.sim.kits[k]
    const cap = Math.max(1, this.sim.capacityByKit[entry.id] || 1)
    if (!entry.kit) {
      this.kits[k] = null
      return
    }
    if (entry.kind === 'ship') {
      const g = shipGeometry(entry.kit, { colourDate: this.colourDate, weapons: this.weapons })
      const mat = shipMaterial(this.light, entry.kit.loa)
      this.materials.push(mat)
      const hull = instanced(mergeGeometries([g.hull, g.parts]), mat, cap)
      this.group.add(hull)
      const counts = {}
      const turrets = g.turrets.map((t) => {
        const j = (counts[t.battery] = (counts[t.battery] ?? -1) + 1)
        const mesh = instanced(t.geometry.clone(), mat, cap)
        this.group.add(mesh)
        return { mesh, at: t.at, rest: t.rest, battery: t.battery, j }
      })
      this.kits[k] = { kind: 'ship', hull, turrets, size: entry.kit.loa }
    } else {
      const g = aircraftGeometry(entry.kit, { colourDate: this.colourDate })
      const size = Math.max(entry.kit.span, entry.kit.length)
      const mat = aircraftMaterial(this.light, size, this.atlas)
      this.materials.push(mat)
      const rect = this.rects[g.insignia] || [0, 0, 0, 0]
      const ins = new THREE.InstancedBufferAttribute(new Float32Array(cap * 4), 4)
      for (let i = 0; i < cap; i++) ins.array.set(rect, i * 4)
      const body = instanced(g.body.clone(), mat, cap, { aInsignia: ins })
      const ins2 = new THREE.InstancedBufferAttribute(ins.array.slice(), 4)
      const prop = instanced(g.prop.clone(), mat, cap, { aInsignia: ins2 })
      this.group.add(body, prop)
      this.kits[k] = { kind: 'aircraft', body, prop, size }
    }
  }

  /** Once a frame: every live slot into its kit's instances, relative to an origin near the camera. */
  update(camera, heightPx, time) {
    const sim = this.sim
    const s = sim.state
    // the origin: the camera's position on a 1 km grid, so the instance offsets stay small
    this.origin.set(Math.round(camera.position.x / 1024) * 1024, 0, Math.round(camera.position.z / 1024) * 1024)
    this.group.position.copy(this.origin)
    setPixelScale(this.materials, camera, heightPx)
    const counts = new Int32Array(this.kits.length)
    const X = sim._X
    for (let i = 0; i < sim.capacity; i++) {
      const a = s.alive[i]
      if (!a) continue
      const k = s.kitIndex[i]
      const kit = this.kits[k]
      if (!kit) continue
      const n = counts[k]++
      P.set(s.pos[3 * i] - this.origin.x, s.pos[3 * i + 1], s.pos[3 * i + 2] - this.origin.z)
      Q.set(s.quat[4 * i], s.quat[4 * i + 1], s.quat[4 * i + 2], s.quat[4 * i + 3])
      M.compose(P, Q, S1)
      const fire = s.fire[i]
      if (kit.kind === 'ship') {
        if (n >= kit.hull.instanceMatrix.count) continue
        kit.hull.setMatrixAt(n, M)
        const st = kit.hull.userData.state
        st.array[4 * n] = fire
        st.array[4 * n + 1] = a
        const guns = X[i]?.guns || X[i]?.ai?.guns || null
        for (const t of kit.turrets) {
          let brg = t.rest
          const mt = guns?.[t.battery]?.mounts?.[t.j]
          if (mt) brg = mt.bearing
          T.makeRotationY((-brg * Math.PI) / 180)
          T.setPosition(t.at[0], t.at[1], t.at[2])
          t.mesh.setMatrixAt(n, T.premultiply(M))
          const ts = t.mesh.userData.state
          ts.array[4 * n] = fire
          ts.array[4 * n + 1] = a
        }
      } else {
        if (n >= kit.body.instanceMatrix.count) continue
        kit.body.setMatrixAt(n, M)
        kit.prop.setMatrixAt(n, M)
        const st = kit.body.userData.state
        st.array[4 * n] = fire
        st.array[4 * n + 1] = a
      }
    }
    for (let k = 0; k < this.kits.length; k++) {
      const kit = this.kits[k]
      if (!kit) continue
      const n = counts[k]
      const meshes = kit.kind === 'ship' ? [kit.hull, ...kit.turrets.map((t) => t.mesh)] : [kit.body, kit.prop]
      for (const m of meshes) {
        m.count = Math.min(n, m.instanceMatrix.count)
        m.instanceMatrix.needsUpdate = true
        m.userData.state.needsUpdate = true
      }
    }
  }

  materialsAll() {
    return this.materials
  }

  dispose() {
    for (const kit of this.kits) {
      if (!kit) continue
      const meshes = kit.kind === 'ship' ? [kit.hull, ...kit.turrets.map((t) => t.mesh)] : [kit.body, kit.prop]
      for (const m of meshes) {
        m.geometry.dispose()
        m.dispose?.()
      }
    }
    for (const m of this.materials) m.dispose()
    this.group.clear()
  }
}
