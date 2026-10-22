// One big disc of sea that rides along under a box's camera, so the water
// always reaches the horizon, from a bridge or from the hand-over height. Its
// rings grow geometrically outward: small triangles under the camera, few and
// huge where it does not matter. Everything else happens per pixel, from the
// ground under each one (shaders/ocean.glsl.js).
//
// Copied from holo-i-ke-au's render/ocean.js (b480c27) and adapted for a box
// (ENGINEERING §7): the disc reaches past the far plane (1,000 km in metres:
// the far plane is 450 km), its uniforms are the box's light and ground bags
// plus its own, it leans on no polygonOffset (nothing under the logarithmic
// depth buffer), and the wind and swell come from battle.json's weather.
// Handed to the engine workflow at the fork.

import * as THREE from 'three'
import { oceanVertex, oceanFragment } from './shaders/ocean.glsl.js'

function ringGeometry(r0, r1, segments, rings) {
  const pos = [0, 0, 0]
  for (let r = 0; r <= rings; r++) {
    const rad = r0 * Math.pow(r1 / r0, r / rings)
    for (let s = 0; s < segments; s++) {
      const a = (s / segments) * Math.PI * 2
      pos.push(Math.cos(a) * rad, 0, Math.sin(a) * rad)
    }
  }
  const idx = []
  for (let s = 0; s < segments; s++) idx.push(0, 1 + ((s + 1) % segments), 1 + s)
  for (let r = 0; r < rings; r++) {
    for (let s = 0; s < segments; s++) {
      const a = 1 + r * segments + s
      const b = 1 + r * segments + ((s + 1) % segments)
      const c = a + segments
      const d = b + segments
      idx.push(a, b, c, b, d, c)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setIndex(idx)
  return g
}

/** A compass bearing (degrees) as a world direction [x, z]: x east, z south. */
const bearing = (deg) => [Math.sin((deg * Math.PI) / 180), -Math.cos((deg * Math.PI) / 180)]

export class Ocean {
  /**
   * uniforms: the box's bag ({ ...app.light.uniforms, ...ground.uniforms });
   * opts: { unit (metres per world unit, 1 in a box), radius (world units,
   * beyond the far plane) }.
   */
  constructor(uniforms, { unit = 1, radius = 1e6 / unit } = {}) {
    this.uniforms = {
      ...uniforms,
      uCamPos: { value: new THREE.Vector3() },
      uUnitM: { value: unit },
      uWind: { value: new THREE.Vector2(-0.8, 0.45) },
      uSwellDir: { value: new THREE.Vector2(-0.6, 0.8) },
      uSeaK: { value: 1 },
      uSwellK: { value: 1 },
      uDebug: { value: 0 },
    }
    this.material = new THREE.ShaderMaterial({
      vertexShader: oceanVertex,
      fragmentShader: oceanFragment,
      uniforms: this.uniforms,
      transparent: true,
    })
    const r0 = 1 / unit
    this.mesh = new THREE.Mesh(ringGeometry(r0, radius, 96, 140), this.material)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = 1
  }

  /**
   * battle.json's weather: { wind: { fromDeg, kn }, swellM, sea }. The wind
   * uniform points where the wind blows toward, its length about 1 at 16
   * knots, so whitecaps come in from about Beaufort 4; the swell runs with
   * the wind unless the record says otherwise (`swellFromDeg`).
   */
  setWeather(weather = {}) {
    const w = weather.wind || {}
    const kn = Number.isFinite(w.kn) ? w.kn : 8
    const from = Number.isFinite(w.fromDeg) ? w.fromDeg : 90
    const [x, z] = bearing(from + 180)
    const k = kn / 16
    this.uniforms.uWind.value.set(x * k, z * k)
    const [sx, sz] = bearing((Number.isFinite(weather.swellFromDeg) ? weather.swellFromDeg : from) + 180)
    this.uniforms.uSwellDir.value.set(sx, sz)
    // the sea state (Douglas 0–9) scales the chop and the caps; the swell's height the long waves
    const sea = Number.isFinite(weather.sea) ? weather.sea : 3
    this.uniforms.uSeaK.value = 0.35 + 0.22 * sea
    this.uniforms.uSwellK.value = 0.4 + 0.6 * Math.min(4, Number.isFinite(weather.swellM) ? weather.swellM : 1)
  }

  update(camera) {
    this.uniforms.uCamPos.value.copy(camera.position)
    this.mesh.position.set(camera.position.x, 0, camera.position.z)
  }

  dispose() {
    this.mesh.geometry.dispose()
    this.material.dispose()
  }
}
