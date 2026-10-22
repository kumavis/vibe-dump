// One big disc of sea that rides along under the camera, so the water always
// reaches the horizon, from 800 m up or from 900 km. Its rings grow
// geometrically outward: small triangles under the camera where depth
// precision matters, few and huge where it doesn't. Everything else happens
// per pixel, from the ground under each one (ocean.glsl.js).

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

export class Ocean {
  constructor(shared, worldUniforms) {
    this.uniforms = {
      ...shared.uniforms,
      ...worldUniforms,
      uCamPos: { value: new THREE.Vector3() },
      uWind: { value: new THREE.Vector2(-0.8, 0.45) },
      uSwellDir: { value: new THREE.Vector2(-0.6, 0.8) },
      uDebug: { value: 0 },
    }
    this.material = new THREE.ShaderMaterial({
      vertexShader: oceanVertex,
      fragmentShader: oceanFragment,
      uniforms: this.uniforms,
      transparent: true,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -8,
    })
    this.mesh = new THREE.Mesh(ringGeometry(1, 250000, 96, 120), this.material)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = 1
  }

  update(camera) {
    this.uniforms.uCamPos.value.copy(camera.position)
    this.mesh.position.set(camera.position.x, 0, camera.position.z)
  }
}
