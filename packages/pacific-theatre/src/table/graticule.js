// The chart's grid on the table: meridians and parallels every ten degrees,
// faint; the equator a little stronger; the 180th meridian dashed, which the
// date line follows across the open Pacific (labels.json names it; its bends
// round the Aleutians and the Fijian and Tongan groups are not drawn). On an
// azimuthal table the grid curves, which is itself worth seeing: north leans
// 15° at Midway.
//
// The lines are projected and clipped to the pack's rectangle here, then
// handed to render/lines.js as world polylines (LineSet `world: true`), so
// nothing is drawn past the table's edge.

import * as THREE from 'three'
import { LineSet } from '../render/lines.js'

const STEP = 10

/** Polylines of [lon, lat] points, projected and cut where they leave the rect. */
function clipped(lines, proj, b) {
  const out = []
  const inside = ([x, z]) => x >= b.x0 && x <= b.x1 && z >= b.z0 && z <= b.z1
  for (const line of lines) {
    let cur = []
    for (const ll of line) {
      const p = proj.toWorld(ll)
      if (inside(p)) cur.push(p)
      else {
        if (cur.length > 1) out.push(cur)
        cur = []
      }
    }
    if (cur.length > 1) out.push(cur)
  }
  return out
}

/** Points along a meridian or a parallel, every `d` degrees. */
const meridian = (lon, lat0, lat1, d = 0.5) => Array.from({ length: Math.round((lat1 - lat0) / d) + 1 }, (_, i) => [lon, lat0 + i * d])
const parallel = (lat, lon0, lon1, d = 0.5) => Array.from({ length: Math.round((lon1 - lon0) / d) + 1 }, (_, i) => [lon0 + i * d, lat])

export class Graticule {
  /** proj: the TableProjection (lon0 about the middle of the table); bounds: the pack's world rect; uniforms: the table's bag. */
  constructor(proj, bounds, uniforms) {
    const l0 = Math.round((proj.lon0 - 110) / STEP) * STEP
    const l1 = Math.round((proj.lon0 + 110) / STEP) * STEP
    const grid = []
    for (let lon = l0; lon <= l1; lon += STEP) if (Math.abs(lon - 180) > 1e-6) grid.push(meridian(lon, -80, 80))
    for (let lat = -70; lat <= 70; lat += STEP) if (lat !== 0) grid.push(parallel(lat, l0 - 20, l1 + 20))
    const opts = { world: true, maxSeg: 40, lift: [0.02, 0.0022], height: 300 }
    this.grid = new LineSet(clipped(grid, proj, bounds), null, uniforms, { ...opts, color: [0.62, 0.72, 0.82], width: 1, order: 2 })
    this.equator = new LineSet(clipped([parallel(0, l0 - 20, l1 + 20)], proj, bounds), null, uniforms, { ...opts, color: [0.82, 0.88, 0.94], width: 1.2, order: 2 })
    this.dateLine = new LineSet(clipped([meridian(180, -80, 80)], proj, bounds), null, uniforms, { ...opts, color: [1.25, 1.08, 0.82], width: 1.3, order: 2, dash: [60, 0.55] })
    this.sets = [this.grid, this.equator, this.dateLine]
    this.group = new THREE.Group()
    this.group.name = 'graticule'
    for (const s of this.sets) this.group.add(s.group)
  }

  update(camera, resolution, dpr, opacity = 1, distance = 1000) {
    this.grid.uniforms.uWidth.value = 1 * dpr
    this.equator.uniforms.uWidth.value = 1.2 * dpr
    this.dateLine.uniforms.uWidth.value = 1.3 * dpr
    this.dateLine.setDash(distance * 0.014)
    // the grid quietest over the whole theatre, where its lines crowd
    const t = Math.max(0, Math.min(1, Math.log(14000 / Math.max(1, distance)) / Math.log(7)))
    this.grid.update(camera, resolution, (0.065 + 0.075 * t * t * (3 - 2 * t)) * opacity)
    this.equator.update(camera, resolution, 0.3 * opacity)
    this.dateLine.update(camera, resolution, 0.5 * opacity)
  }

  dispose() {
    for (const s of this.sets) s.dispose()
  }
}
