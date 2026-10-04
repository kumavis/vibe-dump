import * as THREE from 'three'
import { oceanVertex, oceanFragment } from './shaders/ocean.glsl.js'

// Concentric rings, dense under the camera and huge at the horizon: small
// triangles where depth precision matters, few where it doesn't.
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

// One big quad that rides along under the camera, so the sea always reaches the
// horizon. Everything interesting — depth colour, reef breakers, caustics,
// fishpond calm — happens per pixel from the height texture.
export class Ocean {
  constructor(shared, heightTex, seaTex) {
    this.uniforms = {
      ...shared.uniforms,
      uHeight: { value: heightTex },
      uSea: { value: seaTex },
      uCamPos: { value: new THREE.Vector3() },
      uWind: { value: new THREE.Vector2(-0.8, 0.45) },
      uSwellDir: { value: new THREE.Vector2(-0.6, 0.8) },
      uSwell: { value: 0.6 },
      uDebug: { value: 0 },
      uHorizonColor: { value: new THREE.Color() },
      uZenithColor: { value: new THREE.Color() },
    }
    const geo = ringGeometry(1.5, 8000, 96, 72)
    this.material = new THREE.ShaderMaterial({
      vertexShader: oceanVertex,
      fragmentShader: oceanFragment,
      uniforms: this.uniforms,
      transparent: true,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -8,
    })
    this.mesh = new THREE.Mesh(geo, this.material)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = 1
  }

  update(camera) {
    this.uniforms.uCamPos.value.copy(camera.position)
    this.mesh.position.set(camera.position.x, 0, camera.position.z)
  }
}
