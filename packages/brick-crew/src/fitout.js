// ---------------------------------------------------------------------------
// The joiner's lorry.
//
// When the house tops out this drives in off the road, backs up to the front
// door and drops its tailgate. The fit-out gang works the bed down one piece at
// a time and carries each one in through the doorway; when the last piece is
// standing in the right room the lorry shuts up and leaves.
//
// Plot-local coordinates, like everything else the crew touches.
// ---------------------------------------------------------------------------

import * as THREE from 'three'
import { SITE, YARD } from './config.js'
import { buildTruck, buildFurniture } from './props.js'

export function createTruckRig({ group, houseGroup, plan, origin, rng }) {
  const truck = buildTruck(rng)
  truck.group.visible = false
  group.add(truck.group)

  const L = (p) => ({ x: p.x - origin.x, z: p.z - origin.z })
  const road = L({ x: SITE.gate.x, z: SITE.roadZ })
  const gate = L(SITE.gate)
  const park = YARD.truck

  // --- the load ------------------------------------------------------------
  // Everything is on the bed to start with, stacked where it will fit.
  const bed = new THREE.Group()
  bed.position.set(0, 0.78, -0.6)
  truck.group.add(bed)

  const pieces = plan.furniture.map((spec, i) => {
    const mesh = buildFurniture(spec)
    const col = i % 2
    const row = Math.floor(i / 2)
    mesh.position.set(-0.46 + col * 0.92, 0, 1.3 - row * 0.72)
    mesh.rotation.y = (i % 3) * 0.4
    mesh.scale.setScalar(0.55)
    bed.add(mesh)
    return { spec, mesh }
  })
  const meshOf = new Map(pieces.map((p) => [p.spec.name + p.spec.at.join(','), p.mesh]))
  const keyOf = (spec) => spec.name + spec.at.join(',')

  // --- movement ------------------------------------------------------------
  let state = 'away' // away | arriving | parked | leaving | gone
  let path = []
  let gateT = 0
  let gateTarget = 0
  const pos = new THREE.Vector3()
  let yaw = Math.PI

  const SPEED = 4.2

  function setPath(pts, endYaw) {
    path = pts.slice()
    truck.group.userData.endYaw = endYaw
  }

  function arrive() {
    if (state !== 'away') return
    state = 'arriving'
    truck.group.visible = true
    pos.set(road.x + 26, 0, road.z)
    yaw = -Math.PI / 2
    truck.setGate(0)
    gateT = 0
    gateTarget = 0
    setPath([
      { x: road.x + 6, z: road.z },
      { x: gate.x, z: gate.z + 1.6 },
      { x: park.x, z: park.z },
    ], park.rot)
  }

  function leave() {
    if (state !== 'parked') return
    state = 'leaving'
    gateTarget = 0
    setPath([
      { x: gate.x, z: gate.z + 1.8 },
      { x: road.x, z: road.z },
      { x: road.x - 30, z: road.z },
    ], -Math.PI / 2)
  }

  function update(dt) {
    if (state === 'away' || state === 'gone') return
    gateT += (gateTarget - gateT) * Math.min(1, dt * 2.4)
    truck.setGate(gateT)

    if (path.length) {
      const wp = path[0]
      const dx = wp.x - pos.x
      const dz = wp.z - pos.z
      const d = Math.hypot(dx, dz)
      const step = SPEED * dt
      if (d <= Math.max(step, 1e-3)) {
        pos.set(wp.x, 0, wp.z)
        path.shift()
        if (!path.length) {
          yaw = truck.group.userData.endYaw ?? yaw
          if (state === 'arriving') {
            state = 'parked'
            gateTarget = 1
          } else if (state === 'leaving') {
            state = 'gone'
            truck.group.visible = false
          }
        }
      } else {
        pos.x += (dx / d) * step
        pos.z += (dz / d) * step
        const want = Math.atan2(dx, dz)
        let diff = ((want - yaw + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI
        yaw += diff * Math.min(1, dt * 3)
      }
    }
    truck.group.position.copy(pos)
    truck.group.rotation.y = yaw
  }

  /** Where a robot stands to work the back of the lorry. */
  function loadPoint() {
    const back = truck.loadPoint
    const s = Math.sin(yaw)
    const c = Math.cos(yaw)
    return { x: pos.x + back.x * c + back.z * s, z: pos.z - back.x * s + back.z * c }
  }

  return {
    group: truck.group,
    arrive,
    leave,
    update,
    loadPoint,
    /** The gang can only start once the tailgate is actually down. */
    ready: () => state === 'parked' && gateT > 0.8,
    take(spec) {
      const mesh = meshOf.get(keyOf(spec))
      bed.remove(mesh)
      mesh.rotation.set(0, 0, 0)
      return mesh
    },
    /** Set the piece down where it belongs, in the house for good. */
    settle(mesh, spec) {
      mesh.position.set(spec.at[0], 0, spec.at[2])
      mesh.rotation.set(0, spec.rot, 0)
      mesh.scale.setScalar(1)
      houseGroup.add(mesh)
    },
    /** A robot that clocks off mid-delivery puts it back on the lorry. */
    putBack(mesh, spec) {
      const i = pieces.findIndex((p) => keyOf(p.spec) === keyOf(spec))
      mesh.position.set(-0.46 + (i % 2) * 0.92, 0, 1.3 - Math.floor(i / 2) * 0.72)
      mesh.rotation.set(0, (i % 3) * 0.4, 0)
      mesh.scale.setScalar(0.55)
      bed.add(mesh)
    },
  }
}
