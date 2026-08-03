// ---------------------------------------------------------------------------
// The material delivery, at the site end.
//
// The merchant loads a flatbed in its yard and sends it down the road. This is
// what happens when it gets here: it comes off the road at the site gate, backs
// onto the plot beside the drops, and two of the shift take the pallets off it
// one at a time and tip them onto the right pile. When the bed is empty it
// pulls out and goes back for another load.
//
// Everything here is plot-local, like the rest of the site — the renderer
// parents this to whichever plot is being built.
// ---------------------------------------------------------------------------

import * as THREE from 'three'
import { SITE, toLocal, forRow } from './config.js'
import { buildFlatbed, buildCone } from './props.js'
import { buildCarryStack } from './robot.js'

/** Where the lorry stands to be unloaded, and which way it faces. */
const PARK = { x: 11.8, z: 3.4, yaw: Math.PI }
const DRIVE = 5.4

export function createSupplyRig({ group, origin, rng }) {
  const lorry = buildFlatbed()
  lorry.group.scale.setScalar(0.66)
  lorry.group.visible = false
  group.add(lorry.group)

  const L = (p) => {
    const q = toLocal(origin, p)
    return { x: q.x, z: q.z }
  }
  const road = L({ x: SITE.gate.x, z: SITE.roadZ })
  const gate = L(forRow(origin, SITE.gate))

  // a couple of cones the driver drops while it is standing
  const cones = [buildCone(rng), buildCone(rng)]
  cones.forEach((c, i) => {
    c.position.set(PARK.x - 1.6 + i * 3.2, 0, PARK.z + 3.4)
    c.visible = false
    group.add(c)
  })

  let state = 'away' // away | arriving | parked | leaving
  let pos = { x: road.x, z: road.z + 6 }
  let yaw = Math.PI
  let route = []
  /** One entry per pallet still on the bed. */
  let load = []
  let taken = 0

  function setRoute(points) {
    route = points.slice()
  }

  /**
   * A load has arrived from the merchant. `manifest` is what the yard hands
   * put on the bed, in the order they put it there.
   */
  function arrive(manifest) {
    if (state !== 'away') return false
    load = manifest.slice(0, 8).map((m, i) => {
      const mesh = buildCarryStack(m.key, m.n)
      const slot = lorry.slot(i)
      mesh.position.set(slot.x, slot.y, slot.z)
      mesh.rotation.y = (rng() - 0.5) * 0.16
      lorry.loadAnchor.add(mesh)
      return { ...m, mesh }
    })
    if (!load.length) return false
    taken = 0
    pos = { x: road.x - 14, z: road.z }
    yaw = Math.PI / 2
    setRoute([
      { x: gate.x, z: road.z },
      { x: gate.x, z: gate.z - 1.6 },
      { x: PARK.x, z: PARK.z + 2.4 },
      { x: PARK.x, z: PARK.z },
    ])
    state = 'arriving'
    lorry.group.visible = true
    return true
  }

  function leave() {
    if (state !== 'parked') return
    setRoute([
      { x: PARK.x, z: PARK.z + 3.0 },
      { x: gate.x, z: gate.z - 1.6 },
      { x: gate.x, z: road.z },
      { x: road.x - 26, z: road.z },
    ])
    state = 'leaving'
    for (const c of cones) c.visible = false
  }

  function update(dt) {
    if (state === 'away' || state === 'parked') return
    if (!route.length) {
      if (state === 'arriving') {
        state = 'parked'
        yaw = PARK.yaw
        for (const c of cones) c.visible = true
      } else {
        state = 'away'
        lorry.group.visible = false
      }
      return
    }
    const wp = route[0]
    const dx = wp.x - pos.x
    const dz = wp.z - pos.z
    const d = Math.hypot(dx, dz)
    const step = DRIVE * dt
    if (d <= Math.max(step, 1e-4)) {
      pos.x = wp.x
      pos.z = wp.z
      route.shift()
    } else {
      pos.x += (dx / d) * step
      pos.z += (dz / d) * step
      const want = Math.atan2(dx, dz)
      let turn = ((want - yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI
      yaw += turn * Math.min(1, dt * 3.2)
    }
    lorry.group.position.set(pos.x, 0, pos.z)
    lorry.group.rotation.y = yaw
  }

  return {
    arrive,
    update,
    get state() {
      return state
    },
    get parked() {
      return state === 'parked'
    },
    /** Pallets still on the bed. */
    get left() {
      return load.length - taken
    },
    /** Where an unloader stands to reach the bed. */
    stand(slot = 0) {
      return { level: 0, x: PARK.x - 2.1, y: 0, z: PARK.z - 0.8 + slot * 1.7 }
    },
    /** Take the next pallet off. Returns what was on it. */
    takeOne() {
      if (taken >= load.length) return null
      const item = load[taken++]
      lorry.loadAnchor.remove(item.mesh)
      if (taken >= load.length) {
        // empty: the driver has somewhere else to be
        leave()
        load = []
        taken = 0
      }
      return { key: item.key, n: item.n }
    },
    /** Which materials are still on the bed, so a hauler can plan its run. */
    peek() {
      return taken < load.length ? load[taken].key : null
    },
    dispose() {
      group.remove(lorry.group)
      for (const c of cones) group.remove(c)
    },
  }
}
