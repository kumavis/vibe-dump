// ---------------------------------------------------------------------------
// The lorry.
//
// There is exactly one, and it spends its whole life going round the same loop:
// stand on the merchant's dock while the yard hands load it, drive down the
// road to whichever plot is being built, back onto the plot beside the drops
// while two of the shift take the pallets off, then drive back for another load.
//
// It lives in world coordinates — it is the one thing in the app that belongs
// to the street rather than to a plot or to the yard — so both ends talk to it
// through the small interface at the bottom.
// ---------------------------------------------------------------------------

import * as THREE from 'three'
import { SITE, DEPOT, forRow, toWorld } from './config.js'
import { buildFlatbed } from './props.js'
import { buildCarryStack } from './robot.js'

/** Where it stands on the merchant's dock, in the yard's own coordinates. */
const DOCK = { x: DEPOT.x + 10.2, z: DEPOT.z - 9.6 }
/** Where it stands on a plot, in that plot's coordinates. */
// far enough in that the lorry stands inside the hoarding on every plot
const PARK = { x: 9.4, z: 3.4 }
const DRIVE = 6.2
const CAPACITY = 8

export function createHaulage({ scene, rng }) {
  const lorry = buildFlatbed()
  lorry.group.scale.setScalar(0.66)
  scene.add(lorry.group)

  let state = 'dock' // dock | toSite | onPlot | toYard
  const pos = { x: DOCK.x, z: DOCK.z }
  let yaw = 0
  let route = []
  /** One entry per pallet on the bed. */
  let load = []
  let taken = 0
  let plot = null
  /** Nothing to deliver to yet, so it waits on the dock. */
  let waitT = 0

  lorry.group.position.set(pos.x, 0, pos.z)

  const parkWorld = () => toWorld(plot, PARK)
  const gateWorld = () => forRow(plot, SITE.gate)

  function setPlot(origin) {
    const moved = plot && (plot.x !== origin.x || plot.z !== origin.z)
    plot = origin
    // The crew has gone next door. A lorry already on the road was heading for
    // the old plot, so send it to the new one; one standing on the old plot
    // takes what is left of its load with it.
    if (!moved) return
    if (state === 'toSite') depart()
    else if (state === 'onPlot') depart()
  }

  /** The yard puts one pallet on the bed. */
  function putPallet(key, n) {
    if (state !== 'dock' || load.length >= CAPACITY) return false
    const mesh = buildCarryStack(key, n)
    const slot = lorry.slot(load.length)
    mesh.position.set(slot.x, slot.y, slot.z)
    mesh.rotation.y = (rng() - 0.5) * 0.16
    lorry.loadAnchor.add(mesh)
    load.push({ key, n, mesh })
    return true
  }

  function depart() {
    if (!plot) return
    const gate = gateWorld()
    const park = parkWorld()
    const apron = toWorld(plot, { x: PARK.x, z: PARK.z + 2.6 })
    route = [
      { x: DEPOT.x + 10.5, z: DEPOT.z - 4 },
      { x: DEPOT.x + 10.5, z: SITE.roadZ },
      { x: gate.x, z: SITE.roadZ },
      { x: gate.x, z: (gate.z + SITE.roadZ) / 2 },
      { x: apron.x, z: apron.z },
      { x: park.x, z: park.z },
    ]
    state = 'toSite'
  }

  function goBack() {
    const gate = gateWorld()
    const apron = toWorld(plot, { x: PARK.x, z: PARK.z + 3.2 })
    route = [
      { x: apron.x, z: apron.z },
      { x: gate.x, z: (gate.z + SITE.roadZ) / 2 },
      { x: gate.x, z: SITE.roadZ },
      { x: DEPOT.x + 10.5, z: SITE.roadZ },
      { x: DOCK.x, z: DOCK.z },
    ]
    state = 'toYard'
  }

  function update(dt) {
    if (state === 'dock') {
      waitT += dt
      // full, or part-loaded and nobody has added to it for a while: get going
      if (load.length >= CAPACITY || (load.length >= 3 && waitT > 26)) {
        waitT = 0
        depart()
      }
      return
    }
    if (state === 'onPlot') return

    if (!route.length) {
      if (state === 'toSite') {
        state = 'onPlot'
        taken = 0
      } else {
        state = 'dock'
        waitT = 0
        pos.x = DOCK.x
        pos.z = DOCK.z
        yaw = 0
        lorry.group.position.set(pos.x, 0, pos.z)
        lorry.group.rotation.y = yaw
      }
      return
    }
    const wp = route[0]
    const dx = wp.x - pos.x
    const dz = wp.z - pos.z
    const d = Math.hypot(dx, dz)
    const step = DRIVE * dt
    if (d <= Math.max(step, 0.05)) {
      pos.x = wp.x
      pos.z = wp.z
      route.shift()
    } else {
      pos.x += (dx / d) * step
      pos.z += (dz / d) * step
      const want = Math.atan2(dx, dz)
      const turn = ((want - yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI
      yaw += turn * Math.min(1, dt * 3.4)
    }
    lorry.group.position.set(pos.x, 0, pos.z)
    lorry.group.rotation.y = yaw
  }

  return {
    update,
    setPlot,
    putPallet,
    get state() {
      return state
    },
    get atDock() {
      return state === 'dock'
    },
    get atPlot() {
      return state === 'onPlot'
    },
    get left() {
      return load.length - taken
    },
    /** Where an unloader stands, in world coordinates. */
    standWorld(slot = 0) {
      const p = toWorld(plot, { x: PARK.x - 2.1, z: PARK.z - 0.8 + slot * 1.7 })
      return { x: p.x, z: p.z }
    },
    /** Take the next pallet off. Empty means the driver leaves. */
    takeOne() {
      if (taken >= load.length) return null
      const item = load[taken++]
      lorry.loadAnchor.remove(item.mesh)
      if (taken >= load.length) {
        load = []
        taken = 0
        goBack()
      }
      return { key: item.key, n: item.n }
    },
  }
}
